import {
  SOVEREIGN_AI_LEADERBOARD_ROSTER,
  type SovereignAiLeaderboardEntry,
} from '../data/sovereignEloLadderData';
import { Domain } from '../types/game';
import { getActiveRoomsList, MultiplayerRoom } from './multiplayerEngine';
import {
  fetchHydratedLiveSovereignRoster,
  getCachedHydratedLiveSovereignRoster,
  resolveDeterministicRollingMatchup,
  ROLLING_CYCLE_MS,
  ROLLING_MATCH_SPAN_MS,
  ROLLING_STAGGER_MS,
  ROLLING_TABLE_COUNT,
} from './sovereignLiveEloEngine';
import {
  getActiveRefusalCooldowns,
  getSovereignsBusyInTournamentAt,
  isSovereignOnlineAt,
  type SovereignPresenceStatus,
} from './sovereignPresenceEngine';
import {
  buildScheduledOfficialTournaments,
  ComputedRoundPairing,
  ComputedTournamentStanding,
  computeTournamentSnapshot,
  fetchTournamentCatalogFromCloud,
  getTournamentNowMs,
  SwissTournamentDefinition,
  TournamentCatalogData,
} from './tournamentEngine';

export interface LiveArenaFeedItem {
  feedId: string;
  sourceKind: 'pvp_room' | 'tournament_live' | 'sovereign_arena';
  tableBadge: string;
  tournament: SwissTournamentDefinition;
  pairing: ComputedRoundPairing;
  livePvpRoom?: MultiplayerRoom | null;
}

let cachedCloudCatalog: TournamentCatalogData | null = null;
let lastCloudFetchAtMs = 0;

function buildStandingFromSovereign(
  entry: SovereignAiLeaderboardEntry,
  ladderRank: number
): ComputedTournamentStanding {
  const primaryDomain: Domain =
    entry.domains.find((d) => d !== 'neutral') ?? entry.domains[0] ?? 'red';
  return {
    participantId: `sov::${entry.sovereignId}`,
    kind: 'sovereign',
    rank: ladderRank,
    displayName: entry.sovereignName,
    subtitle: entry.realmOrigin || entry.sovereignTitle,
    avatarCardId: entry.avatarCardId,
    eloRating: entry.eloRating,
    primaryDomain,
    points: 0,
    buchholz: 0,
    hpDiff: 0,
    wins: entry.simulatedWins,
    draws: 0,
    losses: entry.simulatedLosses,
    roundsPlayed: entry.simulatedGames,
    opponentIds: [],
    matchHistory: [],
    sovereignEntry: entry,
  };
}

function buildRollingSovereignTable(
  slotIdx: number,
  nowMs: number,
  customStartOffsetMs?: number,
  explicitBucket?: number
): LiveArenaFeedItem | null {
  const slotOffset = slotIdx * ROLLING_STAGGER_MS;
  const bucket =
    explicitBucket !== undefined
      ? explicitBucket
      : Math.floor((nowMs - slotOffset) / ROLLING_CYCLE_MS);

  const spec = resolveDeterministicRollingMatchup(bucket, slotIdx);
  if (!spec) return null;

  const matchStartMs =
    explicitBucket !== undefined
      ? spec.matchStartMs
      : customStartOffsetMs !== undefined
      ? nowMs - customStartOffsetMs
      : spec.matchStartMs;
  const matchFinishMs = matchStartMs + ROLLING_MATCH_SPAN_MS;

  // Keep only tables currently mid-battle with >= 24s remaining so viewers never land at the very end
  if (
    explicitBucket === undefined &&
    customStartOffsetMs === undefined &&
    (nowMs < matchStartMs + 6_000 || nowMs > matchFinishMs - 24_000)
  ) {
    return null;
  }

  const liveMap = getCachedHydratedLiveSovereignRoster(nowMs).byId;
  const liveSovA = liveMap.get(spec.sovA.sovereignId) ?? spec.sovA;
  const liveSovB = liveMap.get(spec.sovB.sovereignId) ?? spec.sovB;

  const standingA = buildStandingFromSovereign(liveSovA, spec.idxA + 1);
  const standingB = buildStandingFromSovereign(liveSovB, spec.idxB + 1);
  const canonicalWinner = spec.canonicalWinner;
  const elapsedRatio = Math.max(0, Math.min(1, (nowMs - matchStartMs) / ROLLING_MATCH_SPAN_MS));
  const liveTurnEst = Math.max(1, Math.min(8, Math.floor(1 + elapsedRatio * 6)));

  const defId =
    customStartOffsetMs !== undefined
      ? `live_arena_instant_${Math.floor(matchStartMs / 1000)}_s${slotIdx}`
      : `live_arena_b${bucket}_s${slotIdx}`;

  const def: SwissTournamentDefinition = {
    id: defId,
    title: 'Arena de Vaeloria',
    subtitle: 'Partida Oficial em Tempo Real',
    startsAtMs: matchStartMs,
    endsAtMs: matchStartMs + ROLLING_CYCLE_MS,
    totalRounds: 1,
    roundDurationMs: ROLLING_CYCLE_MS,
    playWindowMs: ROLLING_CYCLE_MS - 4_000,
    timeControlId: 'blitz_30s',
    turnTimeLimitSec: 30,
    mulliganTimeLimitSec: 15,
    includeAllSovereigns: true,
    prizeSpec: {
      kind: 'gold_and_shards',
      label: 'Ranking Oficial de Vaeloria',
      description: 'Duelo válido pelo Ranking Geral de Soberanos.',
    },
    createdBy: 'vaeloria',
    createdAtMs: matchStartMs,
    finalizedAward: null,
  };

  const isCompletedAlready = explicitBucket !== undefined && nowMs >= matchFinishMs;
  const tableNumber = slotIdx + 1;
  const pairing: ComputedRoundPairing = {
    tableNumber,
    round: 1,
    playerA: standingA,
    playerB: standingB,
    pointsBeforeA: 0,
    pointsBeforeB: 0,
    result: isCompletedAlready ? canonicalWinner : 'IN_PROGRESS',
    hpDiffA: isCompletedAlready ? (canonicalWinner === 'A_WIN' ? 14 : -14) : 0,
    turns: 7,
    liveTurnEstimate: liveTurnEst,
    matchStartMs,
    matchFinishMs,
    canonicalResult: canonicalWinner,
    canonicalTurns: 7,
    isHumanTable: false,
  };

  return {
    feedId: `sov_live::${defId}`,
    sourceKind: 'sovereign_arena',
    tableBadge: `Mesa #${tableNumber}`,
    tournament: def,
    pairing,
  };
}

function buildPvpRoomLiveItem(room: MultiplayerRoom, nowMs: number): LiveArenaFeedItem | null {
  if (
    room.status !== 'playing' ||
    !room.guest ||
    !room.canonicalState ||
    room.canonicalState.phase === 'gameover'
  ) {
    return null;
  }
  const lastTouch = room.lastActivityAt ?? room.createdAt;
  if (nowMs - lastTouch > 12 * 60_000) return null;

  const hostStanding: ComputedTournamentStanding = {
    participantId: `hum::${room.host.username.toLowerCase()}`,
    kind: 'human',
    rank: 1,
    displayName: room.host.username,
    subtitle: room.host.title,
    avatarCardId: room.host.avatarCardId,
    eloRating: room.host.eloRating,
    primaryDomain: 'red',
    points: 0,
    buchholz: 0,
    hpDiff: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    roundsPlayed: 0,
    opponentIds: [],
    matchHistory: [],
  };

  const guestStanding: ComputedTournamentStanding = {
    participantId: `hum::${room.guest.username.toLowerCase()}`,
    kind: 'human',
    rank: 2,
    displayName: room.guest.username,
    subtitle: room.guest.title,
    avatarCardId: room.guest.avatarCardId,
    eloRating: room.guest.eloRating,
    primaryDomain: 'blue',
    points: 0,
    buchholz: 0,
    hpDiff: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    roundsPlayed: 0,
    opponentIds: [],
    matchHistory: [],
  };

  const def: SwissTournamentDefinition = {
    id: `conclave_live_${room.code}`,
    title: 'Conclave de Vaeloria',
    subtitle: `Sala ${room.code}`,
    startsAtMs: room.createdAt,
    endsAtMs: room.createdAt + 30 * 60_000,
    totalRounds: 1,
    roundDurationMs: 30 * 60_000,
    playWindowMs: 30 * 60_000,
    timeControlId: 'standard_60s',
    turnTimeLimitSec: 60,
    mulliganTimeLimitSec: 25,
    includeAllSovereigns: false,
    prizeSpec: {
      kind: 'gold_and_shards',
      label: 'Duelo 1×1',
      description: 'Partida ao vivo no Conclave.',
    },
    createdBy: room.host.username,
    createdAtMs: room.createdAt,
    finalizedAward: null,
  };

  const pairing: ComputedRoundPairing = {
    tableNumber: 1,
    round: 1,
    playerA: hostStanding,
    playerB: guestStanding,
    pointsBeforeA: 0,
    pointsBeforeB: 0,
    result: 'IN_PROGRESS',
    hpDiffA: 0,
    turns: room.canonicalState.turn,
    liveTurnEstimate: room.canonicalState.turn,
    matchStartMs: room.createdAt,
    matchFinishMs: room.createdAt + 25 * 60_000,
    roomCode: room.code,
    isHumanTable: true,
  };

  return {
    feedId: `pvp::${room.code}`,
    sourceKind: 'pvp_room',
    tableBadge: `Sala ${room.code}`,
    tournament: def,
    pairing,
    livePvpRoom: room,
  };
}

export async function refreshLiveArenaCloudPool(): Promise<void> {
  const now = getTournamentNowMs();
  void fetchHydratedLiveSovereignRoster(now);
  if (now - lastCloudFetchAtMs < 12_000 && cachedCloudCatalog) return;
  lastCloudFetchAtMs = now;
  try {
    cachedCloudCatalog = await fetchTournamentCatalogFromCloud();
  } catch {
    // keep previous cache
  }
}

export function collectCurrentlyLiveMatchesSync(nowMs = getTournamentNowMs()): LiveArenaFeedItem[] {
  const pool: LiveArenaFeedItem[] = [];

  // 1. Active Multiplayer PvP Rooms
  try {
    const rooms = getActiveRoomsList();
    for (const r of rooms) {
      const item = buildPvpRoomLiveItem(r, nowMs);
      if (item) pool.push(item);
    }
  } catch {
    // ignore
  }

  // 2. Active Swiss Tournament Live Tables (Human & Sovereign)
  if (cachedCloudCatalog) {
    for (const def of cachedCloudCatalog.tournaments) {
      const entries = cachedCloudCatalog.entriesByTournament[def.id] ?? [];
      const snap = computeTournamentSnapshot(def, entries, null, nowMs);
      if (snap.phase === 'round_active' && snap.currentRound >= 1) {
        const roundPairings = snap.roundsPairings[snap.currentRound] ?? [];
        const liveTables = roundPairings.filter(
          (p) => p.result === 'IN_PROGRESS' && p.playerB !== null
        );
        // Sample up to 16 live tournament tables (prioritizing human tables + top boards)
        const humanLive = liveTables.filter((p) => p.isHumanTable);
        const topSovereignLive = liveTables.filter((p) => !p.isHumanTable).slice(0, 12);
        for (const p of [...humanLive, ...topSovereignLive]) {
          pool.push({
            feedId: `trn::${def.id}::r${p.round}::t${p.tableNumber}`,
            sourceKind: 'tournament_live',
            tableBadge: `Torneio · Mesa #${p.tableNumber}`,
            tournament: def,
            pairing: p,
          });
        }
      }
    }
  }

  // 3. Always-On Rolling Live Sovereign Tables (guarantees >= 1 live match 24/7)
  for (let slot = 0; slot < ROLLING_TABLE_COUNT; slot += 1) {
    const rolling = buildRollingSovereignTable(slot, nowMs);
    if (rolling) pool.push(rolling);
  }

  // Absolute guarantee: if for any clock edge case pool is empty, spawn an active table 35s in
  if (pool.length === 0) {
    const fallback = buildRollingSovereignTable(0, nowMs, 35_000);
    if (fallback) pool.push(fallback);
  }

  return pool;
}

export function pickRandomLiveArenaMatchSync(options?: {
  excludeFeedId?: string | null;
  nowMs?: number;
}): LiveArenaFeedItem {
  const nowMs = options?.nowMs ?? getTournamentNowMs();
  const allLive = collectCurrentlyLiveMatchesSync(nowMs);
  const candidates =
    options?.excludeFeedId && allLive.length > 1
      ? allLive.filter((item) => item.feedId !== options.excludeFeedId)
      : allLive;

  // Give active PvP rooms & live human tournament tables strong visibility while keeping random selection
  const weighted: LiveArenaFeedItem[] = [];
  for (const item of candidates) {
    const copies =
      item.sourceKind === 'pvp_room'
        ? 4
        : item.sourceKind === 'tournament_live' && item.pairing.isHumanTable
        ? 4
        : item.sourceKind === 'tournament_live'
        ? 2
        : 1;
    for (let i = 0; i < copies; i += 1) {
      weighted.push(item);
    }
  }

  const pickList = weighted.length > 0 ? weighted : allLive;
  const randomIdx = Math.floor(Math.random() * pickList.length);
  return pickList[randomIdx];
}

export function buildShareKeyForLiveFeedItem(item: LiveArenaFeedItem): string | null {
  if (item.sourceKind === 'pvp_room' && item.livePvpRoom?.code) {
    return `pvp_${item.livePvpRoom.code}`;
  }
  if (item.sourceKind === 'tournament_live') {
    return `trn_${item.tournament.id}__${item.pairing.round}__${item.pairing.tableNumber}`;
  }
  const matchRolling = /^live_arena_b(\d+)_s(\d+)$/.exec(item.tournament.id);
  if (matchRolling) {
    return `b${matchRolling[1]}_s${matchRolling[2]}`;
  }
  const matchInstant = /^live_arena_instant_(\d+)_s(\d+)$/.exec(item.tournament.id);
  if (matchInstant) {
    const startSec = Number(matchInstant[1]);
    const slotIdx = Number(matchInstant[2]);
    if (Number.isFinite(startSec) && Number.isFinite(slotIdx)) {
      const slotOffset = slotIdx * ROLLING_STAGGER_MS;
      const bucket = Math.floor((startSec * 1000 - slotOffset) / ROLLING_CYCLE_MS);
      return `b${bucket}_s${slotIdx}`;
    }
  }
  return null;
}

export function resolveSharedLiveArenaFeedItem(
  shareKey: string,
  nowMs = getTournamentNowMs()
): LiveArenaFeedItem | null {
  const clean = shareKey.trim();
  if (!clean) return null;

  if (clean.startsWith('pvp_')) {
    const roomCode = clean.slice(4).trim().toUpperCase();
    try {
      const room = getActiveRoomsList().find((r) => r.code.toUpperCase() === roomCode);
      if (room) {
        const live = buildPvpRoomLiveItem(room, nowMs);
        if (live) return live;
      }
    } catch {
      // ignore
    }
    return null;
  }

  const m = /^b(\d+)_s(\d+)$/.exec(clean);
  if (m) {
    const bucket = Number(m[1]);
    const slotIdx = Math.max(0, Math.min(ROLLING_TABLE_COUNT - 1, Number(m[2])));
    if (Number.isFinite(bucket) && Number.isFinite(slotIdx)) {
      return buildRollingSovereignTable(slotIdx, nowMs, undefined, bucket);
    }
  }
  return null;
}

export interface RecentSovereignMatchSummary {
  id: string;
  playedAtMs: number;
  opponent: SovereignAiLeaderboardEntry;
  didWin: boolean;
  deltaElo: number;
  spectatorItem: LiveArenaFeedItem;
}

export function getRecentMatchesForSovereign(
  sovereignId: string,
  limit = 6,
  nowMs = getTournamentNowMs()
): RecentSovereignMatchSummary[] {
  const results: RecentSovereignMatchSummary[] = [];
  const allSlotsDoneOffset =
    (ROLLING_TABLE_COUNT - 1) * ROLLING_STAGGER_MS + ROLLING_MATCH_SPAN_MS;
  const latestCompletedBucket = Math.floor((nowMs - allSlotsDoneOffset) / ROLLING_CYCLE_MS);
  const liveMap = getCachedHydratedLiveSovereignRoster(nowMs).byId;
  const maxScanBuckets = 2600;

  for (
    let b = latestCompletedBucket;
    b > latestCompletedBucket - maxScanBuckets && results.length < limit;
    b -= 1
  ) {
    for (let slotIdx = ROLLING_TABLE_COUNT - 1; slotIdx >= 0; slotIdx -= 1) {
      const spec = resolveDeterministicRollingMatchup(b, slotIdx);
      if (!spec || spec.matchFinishMs > nowMs) continue;

      const isA = spec.sovA.sovereignId === sovereignId;
      const isB = !isA && spec.sovB.sovereignId === sovereignId;
      if (!isA && !isB) continue;

      const rawSelf = isA ? spec.sovA : spec.sovB;
      const rawOpp = isA ? spec.sovB : spec.sovA;
      const oppLive = liveMap.get(rawOpp.sovereignId) ?? rawOpp;
      const selfLive = liveMap.get(rawSelf.sovereignId) ?? rawSelf;

      const didWin = isA ? spec.canonicalWinner === 'A_WIN' : spec.canonicalWinner === 'B_WIN';
      const expSelf = 1 / (1 + Math.pow(10, (oppLive.eloRating - selfLive.eloRating) / 400));
      const rawDelta = Math.round(16 * ((didWin ? 1 : 0) - expSelf));
      const deltaElo = didWin ? Math.max(1, rawDelta) : Math.min(-1, rawDelta);

      const spectatorItem = buildRollingSovereignTable(slotIdx, nowMs, undefined, b);
      if (!spectatorItem) continue;

      const dateFmt = new Date(spec.matchFinishMs).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
      spectatorItem.tableBadge = `Mesa #${slotIdx + 1} · ${dateFmt}`;

      results.push({
        id: `sov_hist_b${b}_s${slotIdx}`,
        playedAtMs: spec.matchFinishMs,
        opponent: oppLive,
        didWin,
        deltaElo,
        spectatorItem,
      });

      if (results.length >= limit) break;
    }
  }

  return results;
}

export interface SovereignRealtimePresenceEntry {
  sovereignId: string;
  status: SovereignPresenceStatus;
  statusLabel: string;
  detailLabel: string;
  liveWatchItem?: LiveArenaFeedItem;
  justFinishedMatchAgoMs: number | null;
}

export interface SovereignPresenceDirectorySnapshot {
  byId: Record<string, SovereignRealtimePresenceEntry>;
  onlineIdleCount: number;
  inMatchCount: number;
  inTournamentCount: number;
  offlineCount: number;
}

export function computeSovereignPresenceDirectory(
  nowMs = getTournamentNowMs()
): SovereignPresenceDirectorySnapshot {
  const tourneyBusyMap = getSovereignsBusyInTournamentAt(nowMs);
  const inMatchMap = new Map<
    string,
    { detailLabel: string; liveWatchItem?: LiveArenaFeedItem }
  >();
  const justFinishedAgoMap = new Map<string, number>();

  // 1. Check active Swiss tournament live matches
  const activeDefs =
    cachedCloudCatalog?.tournaments ?? buildScheduledOfficialTournaments(nowMs);
  for (const def of activeDefs) {
    if (nowMs < def.startsAtMs || nowMs >= def.endsAtMs) continue;
    const entries = cachedCloudCatalog?.entriesByTournament?.[def.id] ?? [];
    const snap = computeTournamentSnapshot(def, entries, null, nowMs);
    if (snap.phase === 'round_active' && snap.currentRound >= 1) {
      const roundPairings = snap.roundsPairings[snap.currentRound] ?? [];
      for (const p of roundPairings) {
        if (p.result !== 'IN_PROGRESS' || !p.playerB) continue;
        const watchItem: LiveArenaFeedItem = {
          feedId: `trn::${def.id}::r${p.round}::t${p.tableNumber}`,
          sourceKind: 'tournament_live',
          tableBadge: `Torneio · Mesa #${p.tableNumber}`,
          tournament: def,
          pairing: p,
        };
        if (p.playerA.sovereignEntry) {
          const oppShort = p.playerB.displayName.split(',')[0].trim();
          inMatchMap.set(p.playerA.sovereignEntry.sovereignId, {
            detailLabel: `Em duelo no torneio vs. ${oppShort}`,
            liveWatchItem: watchItem,
          });
        }
        if (p.playerB.sovereignEntry) {
          const oppShort = p.playerA.displayName.split(',')[0].trim();
          inMatchMap.set(p.playerB.sovereignEntry.sovereignId, {
            detailLabel: `Em duelo no torneio vs. ${oppShort}`,
            liveWatchItem: watchItem,
          });
        }
      }
    }
  }

  // 2. Check all 8 rolling Arena tables (active matches & recent post-match cooldowns)
  for (let slotIdx = 0; slotIdx < ROLLING_TABLE_COUNT; slotIdx += 1) {
    const slotOffset = slotIdx * ROLLING_STAGGER_MS;
    const curBucket = Math.floor((nowMs - slotOffset) / ROLLING_CYCLE_MS);
    const spec = resolveDeterministicRollingMatchup(curBucket, slotIdx);

    if (spec) {
      if (nowMs >= spec.matchStartMs && nowMs < spec.matchFinishMs) {
        const watchItem =
          buildRollingSovereignTable(slotIdx, nowMs, undefined, curBucket) ?? undefined;
        const shortA = spec.sovA.sovereignName.split(',')[0].trim();
        const shortB = spec.sovB.sovereignName.split(',')[0].trim();
        inMatchMap.set(spec.sovA.sovereignId, {
          detailLabel: `Em duelo na Arena vs. ${shortB}`,
          liveWatchItem: watchItem,
        });
        inMatchMap.set(spec.sovB.sovereignId, {
          detailLabel: `Em duelo na Arena vs. ${shortA}`,
          liveWatchItem: watchItem,
        });
      } else if (nowMs >= spec.matchFinishMs) {
        const ago = nowMs - spec.matchFinishMs;
        justFinishedAgoMap.set(spec.sovA.sovereignId, ago);
        justFinishedAgoMap.set(spec.sovB.sovereignId, ago);
      }
    }

    const prevSpec = resolveDeterministicRollingMatchup(curBucket - 1, slotIdx);
    if (prevSpec && nowMs >= prevSpec.matchFinishMs) {
      const ago = nowMs - prevSpec.matchFinishMs;
      if (ago < 60_000) {
        const prevA = justFinishedAgoMap.get(prevSpec.sovA.sovereignId);
        if (prevA === undefined || ago < prevA) {
          justFinishedAgoMap.set(prevSpec.sovA.sovereignId, ago);
        }
        const prevB = justFinishedAgoMap.get(prevSpec.sovB.sovereignId);
        if (prevB === undefined || ago < prevB) {
          justFinishedAgoMap.set(prevSpec.sovB.sovereignId, ago);
        }
      }
    }
  }

  const byId: Record<string, SovereignRealtimePresenceEntry> = {};
  let onlineIdleCount = 0;
  let inMatchCount = 0;
  let inTournamentCount = 0;
  let offlineCount = 0;

  for (const sov of SOVEREIGN_AI_LEADERBOARD_ROSTER) {
    const sid = sov.sovereignId;
    const activeMatch = inMatchMap.get(sid);
    const justFinishedMatchAgoMs = justFinishedAgoMap.get(sid) ?? null;

    if (activeMatch) {
      inMatchCount += 1;
      byId[sid] = {
        sovereignId: sid,
        status: 'in_match',
        statusLabel: 'Em duelo',
        detailLabel: activeMatch.detailLabel,
        liveWatchItem: activeMatch.liveWatchItem,
        justFinishedMatchAgoMs: null,
      };
      continue;
    }

    const tourneyDuty = tourneyBusyMap.get(sid);
    if (tourneyDuty) {
      inTournamentCount += 1;
      byId[sid] = {
        sovereignId: sid,
        status: 'in_tournament',
        statusLabel: 'Em torneio',
        detailLabel: tourneyDuty.isPreStartConcentration
          ? `Concentrado para ${tourneyDuty.tournamentTitle}`
          : `Disputando ${tourneyDuty.tournamentTitle}`,
        justFinishedMatchAgoMs,
      };
      continue;
    }

    if (isSovereignOnlineAt(sid, nowMs, tourneyBusyMap)) {
      onlineIdleCount += 1;
      byId[sid] = {
        sovereignId: sid,
        status: 'online_idle',
        statusLabel: 'Disponível',
        detailLabel: 'Disponível para duelo',
        justFinishedMatchAgoMs,
      };
    } else {
      offlineCount += 1;
      byId[sid] = {
        sovereignId: sid,
        status: 'offline',
        statusLabel: 'Ausente',
        detailLabel: 'Ausente no momento',
        justFinishedMatchAgoMs: null,
      };
    }
  }

  return {
    byId,
    onlineIdleCount,
    inMatchCount,
    inTournamentCount,
    offlineCount,
  };
}

/**
 * Selects the closest ELO Sovereign who is currently online, free (not in a match
 * or tournament), and not on refusal cooldown.
 */
export function findBestAvailableOnlineSovereign(
  playerElo: number,
  recentOpponentIds: string[] = [],
  nowMs = getTournamentNowMs()
): SovereignAiLeaderboardEntry {
  const liveRoster = getCachedHydratedLiveSovereignRoster(nowMs).roster;
  const presence = computeSovereignPresenceDirectory(nowMs).byId;
  const refusalCooldowns = getActiveRefusalCooldowns(Date.now());
  const recentSet = new Set(recentOpponentIds.slice(-4));

  const availableFresh = liveRoster.filter(
    (s) =>
      presence[s.sovereignId]?.status === 'online_idle' &&
      !refusalCooldowns[s.sovereignId] &&
      !recentSet.has(s.sovereignId)
  );
  const availableAny = liveRoster.filter(
    (s) =>
      presence[s.sovereignId]?.status === 'online_idle' &&
      !refusalCooldowns[s.sovereignId]
  );

  const pool =
    availableFresh.length > 0
      ? availableFresh
      : availableAny.length > 0
      ? availableAny
      : liveRoster;

  let best = pool[0];
  let bestDiff = Math.abs(best.eloRating - playerElo);
  for (let i = 1; i < pool.length; i += 1) {
    const diff = Math.abs(pool[i].eloRating - playerElo);
    if (diff < bestDiff) {
      best = pool[i];
      bestDiff = diff;
    }
  }
  return best;
}
