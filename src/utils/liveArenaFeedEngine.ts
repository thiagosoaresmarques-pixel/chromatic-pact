import {
  SOVEREIGN_AI_LEADERBOARD_ROSTER,
  SovereignAiLeaderboardEntry,
} from '../data/sovereignEloLadderData';
import { Domain } from '../types/game';
import { getActiveRoomsList, MultiplayerRoom } from './multiplayerEngine';
import {
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

const ROLLING_TABLE_COUNT = 8;
const ROLLING_CYCLE_MS = 132_000; // 2m 12s per table cycle
const ROLLING_MATCH_SPAN_MS = 116_000; // ~1m 56s active play (~1.8s–2.3s per real engine action)
const ROLLING_STAGGER_MS = Math.floor(ROLLING_CYCLE_MS / ROLLING_TABLE_COUNT); // 16.5s stagger

let cachedCloudCatalog: TournamentCatalogData | null = null;
let lastCloudFetchAtMs = 0;

function hashFeedSeed(input: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

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
  customStartOffsetMs?: number
): LiveArenaFeedItem | null {
  const roster = SOVEREIGN_AI_LEADERBOARD_ROSTER;
  if (roster.length < 2) return null;

  const slotOffset = slotIdx * ROLLING_STAGGER_MS;
  const bucket = Math.floor((nowMs - slotOffset) / ROLLING_CYCLE_MS);
  const matchStartMs =
    customStartOffsetMs !== undefined
      ? nowMs - customStartOffsetMs
      : bucket * ROLLING_CYCLE_MS + slotOffset;
  const matchFinishMs = matchStartMs + ROLLING_MATCH_SPAN_MS;

  // Keep only tables currently mid-battle with >= 24s remaining so viewers never land at the very end
  if (
    customStartOffsetMs === undefined &&
    (nowMs < matchStartMs + 6_000 || nowMs > matchFinishMs - 24_000)
  ) {
    return null;
  }

  const seed = hashFeedSeed(`vaeloria_live_table_v1::b${bucket}::s${slotIdx}`);
  // Spotlight high-mastery & diverse Sovereigns across all 276 entries (weighted toward top 120 + full roster)
  const poolCap = slotIdx % 2 === 0 ? Math.min(90, roster.length) : roster.length;
  const idxA = seed % poolCap;
  const sovA = roster[idxA];
  const domA = sovA.domains[0] ?? 'red';

  // Find a close-ELO rival from a contrasting Domain so matchups are visually & tactically rich
  let bestIdxB = (idxA + 7) % roster.length;
  let bestScore = Number.POSITIVE_INFINITY;
  for (let probe = 1; probe <= 28; probe += 1) {
    const candIdx = (idxA + ((seed >>> 5) % 19) + probe * 5) % roster.length;
    if (candIdx === idxA) continue;
    const cand = roster[candIdx];
    const eloGap = Math.abs(cand.eloRating - sovA.eloRating);
    const samePrimaryPenalty = (cand.domains[0] ?? 'blue') === domA ? 140 : 0;
    const score = eloGap + samePrimaryPenalty;
    if (score < bestScore) {
      bestScore = score;
      bestIdxB = candIdx;
    }
  }
  const sovB = roster[bestIdxB];

  const standingA = buildStandingFromSovereign(sovA, idxA + 1);
  const standingB = buildStandingFromSovereign(sovB, bestIdxB + 1);
  const canonicalWinner: 'A_WIN' | 'B_WIN' = (seed & 1) === 0 ? 'A_WIN' : 'B_WIN';
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

  const tableNumber = slotIdx + 1;
  const pairing: ComputedRoundPairing = {
    tableNumber,
    round: 1,
    playerA: standingA,
    playerB: standingB,
    pointsBeforeA: 0,
    pointsBeforeB: 0,
    result: 'IN_PROGRESS',
    hpDiffA: 0,
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
