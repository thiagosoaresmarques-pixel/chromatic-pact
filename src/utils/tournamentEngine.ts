import { ALL_CARDS, CARDS_BY_ID } from '../data/cards';
import {
  SOVEREIGN_AI_LEADERBOARD_ROSTER,
  SovereignAiLeaderboardEntry,
} from '../data/sovereignEloLadderData';
import { CampaignBoss, CardDefinition, Domain } from '../types/game';
import {
  getSupabaseConfig,
  SovereignUserProfile,
} from './multiplayerEngine';
import { buildRankedSovereignBossEncounter } from '../data/sovereignEloLadder';

// ============================================================================
// 1. TIME CONTROL EMPIRICAL BENCHMARKS & TOURNAMENT CADENCE PRESETS
// ============================================================================

export type TournamentTimeControlId = 'blitz_30s' | 'rapid_45s' | 'standard_60s' | 'classic_180s';

export interface TournamentTimeControlSpec {
  id: TournamentTimeControlId;
  label: string;
  turnSeconds: number;
  mulliganSeconds: number;
  avgMatchMinutes: string;
  p95MatchMinutes: string;
  recommendedRoundMinutes: number;
  recommendedRoundsIn1h: number;
  verdict: string;
  recommendedFor: string;
}

/**
 * Calibração empírica baseada na telemetria de partidas 40 PV vs 40 PV do Chromatic Pact:
 * - Média de 4 a 7 rodadas completas por duelo (8 a 14 turnos individuais)
 * - Média de 2,0 a 4,5 decisões atômicas por turno (P90 = 6 ações em turnos de pilhas 3x / Expansão)
 */
export const TOURNAMENT_TIME_CONTROLS: Record<
  TournamentTimeControlId,
  TournamentTimeControlSpec
> = {
  blitz_30s: {
    id: 'blitz_30s',
    label: 'Blitz · 30s / turno',
    turnSeconds: 30,
    mulliganSeconds: 15,
    avgMatchMinutes: '2,5 – 3,5 min',
    p95MatchMinutes: '6,0 min',
    recommendedRoundMinutes: 7,
    recommendedRoundsIn1h: 8,
    verdict: 'Rápido, porém apertado em turnos tardios com pilhas 3× e múltiplos ataques.',
    recommendedFor: 'Eventos relâmpago casuais',
  },
  rapid_45s: {
    id: 'rapid_45s',
    label: 'Rápido Oficial · 45s / turno',
    turnSeconds: 45,
    mulliganSeconds: 20,
    avgMatchMinutes: '3,8 – 5,2 min',
    p95MatchMinutes: '8,5 min',
    recommendedRoundMinutes: 10,
    recommendedRoundsIn1h: 6,
    verdict: 'Ponto ótimo competitivo: ~7s por ação tática em turnos densos e cabe em janelas fixas de 10 min.',
    recommendedFor: 'Torneios Suíços de 1h (Terça Soberana & Copas Oficiais)',
  },
  standard_60s: {
    id: 'standard_60s',
    label: 'Padrão · 60s / turno',
    turnSeconds: 60,
    mulliganSeconds: 30,
    avgMatchMinutes: '5,0 – 7,0 min',
    p95MatchMinutes: '12,0 min',
    recommendedRoundMinutes: 12,
    recommendedRoundsIn1h: 5,
    verdict: 'Confortável para duelos avulsos de Ranking ELO, mas exige rodadas de 12–15 min no Suíço.',
    recommendedFor: 'Fila Ranqueada ELO & Conclave 1×1',
  },
  classic_180s: {
    id: 'classic_180s',
    label: 'Clássico · 3 min / turno',
    turnSeconds: 180,
    mulliganSeconds: 45,
    avgMatchMinutes: '10 – 18 min',
    p95MatchMinutes: '36,0 min',
    recommendedRoundMinutes: 35,
    recommendedRoundsIn1h: 1,
    verdict: 'Inviável para torneios Suíços de 1h (teto de 36+ min em 1 única partida).',
    recommendedFor: 'Finais presenciais / Playoffs Top 4 MD3',
  },
};

// ============================================================================
// 2. DATA MODELS FOR SERVERLESS CLOUD-SYNCHRONIZED SWISS TOURNAMENTS
// ============================================================================

export type TournamentPrizeKind =
  | 'unowned_domain_rare_card'
  | 'unowned_domain_legendary_card'
  | 'gold_and_shards'
  | 'cash_brl_pix';

export interface TournamentPrizeSpec {
  kind: TournamentPrizeKind;
  label: string;
  description: string;
  goldBonus?: number;
  shardsBonus?: number;
  cashBrl?: number;
}

export interface TournamentAwardedPrize {
  winnerUserId: string;
  winnerUsername: string;
  winnerGlobalRank: number;
  winnerPoints: number;
  primaryDomain: Domain;
  cardId?: string;
  cardName?: string;
  goldBonus?: number;
  shardsBonus?: number;
  cashBrl?: number;
  awardedAtMs: number;
}

export interface SwissTournamentDefinition {
  id: string;
  title: string;
  subtitle: string;
  startsAtMs: number;
  endsAtMs: number;
  totalRounds: number;
  roundDurationMs: number;
  playWindowMs: number;
  timeControlId: TournamentTimeControlId;
  turnTimeLimitSec: number;
  mulliganTimeLimitSec: number;
  includeAllSovereigns: boolean;
  prizeSpec: TournamentPrizeSpec;
  createdBy: string;
  createdAtMs: number;
  finalizedAward?: TournamentAwardedPrize | null;
}

export interface HumanRoundMatchRecord {
  round: number;
  opponentId: string;
  opponentName: string;
  opponentKind: 'human' | 'sovereign';
  score: 1 | 0.5 | 0;
  hpDiff: number;
  turns: number;
  startedAtMs?: number;
  finishedAtMs: number;
  reason?: string;
}

export interface HumanTournamentEntry {
  tournamentId: string;
  userId: string;
  username: string;
  title: string;
  avatarCardId: string;
  eloRating: number;
  deckId: string;
  deckName: string;
  primaryDomain: Domain;
  deckCardIds: string[];
  ownedCardIdsSnapshot: string[];
  enrolledAtMs: number;
  lastHeartbeatAtMs: number;
  activeRoundStarted?: number;
  resultsByRound: Record<number, HumanRoundMatchRecord>;
  prizeClaimed?: boolean;
  claimedCardId?: string;
}

export interface ComputedTournamentStanding {
  participantId: string;
  kind: 'human' | 'sovereign';
  rank: number;
  displayName: string;
  subtitle: string;
  avatarCardId: string;
  eloRating: number;
  primaryDomain: Domain;
  points: number;
  buchholz: number;
  hpDiff: number;
  wins: number;
  draws: number;
  losses: number;
  roundsPlayed: number;
  opponentIds: string[];
  sovereignEntry?: SovereignAiLeaderboardEntry;
  humanEntry?: HumanTournamentEntry;
}

export interface ComputedRoundPairing {
  tableNumber: number;
  round: number;
  playerA: ComputedTournamentStanding;
  playerB: ComputedTournamentStanding | null; // null = Swiss Bye (1.0 pt)
  result: 'A_WIN' | 'B_WIN' | 'DRAW' | 'BYE' | 'IN_PROGRESS' | 'PENDING';
  hpDiffA: number;
  turns: number;
  roomCode?: string;
  isHumanTable: boolean;
}

export type TournamentPhaseStatus =
  | 'registration' // Before startsAtMs
  | 'round_active' // Inside round r play window
  | 'round_break'  // 30s pairing transition between round r and r+1
  | 'finished';    // At or after endsAtMs

export interface ComputedTournamentSnapshot {
  definition: SwissTournamentDefinition;
  nowMs: number;
  phase: TournamentPhaseStatus;
  currentRound: number; // 0 before start, 1..totalRounds during/after
  roundStartsAtMs: number;
  roundPlayDeadlineMs: number;
  roundEndsAtMs: number;
  standings: ComputedTournamentStanding[];
  currentRoundPairings: ComputedRoundPairing[];
  myEntry: HumanTournamentEntry | null;
  myStanding: ComputedTournamentStanding | null;
  myCurrentPairing: ComputedRoundPairing | null;
  humanEntrantsCount: number;
  totalParticipantsCount: number;
  finalizedAward: TournamentAwardedPrize | null;
}

// ============================================================================
// 3. DEFAULT INAUGURAL TOURNAMENT TODAY (17:00 - 18:00 BRT) & CLOCK SYNC
// ============================================================================

export const INAUGURAL_TOURNAMENT_ID = 'copa_inaugural_2026_11_01_17h';

// 2026-11-01T17:00:00-03:00 = 2026-11-01T20:00:00.000Z
const INAUGURAL_START_MS = Date.parse('2026-11-01T17:00:00-03:00');
const INAUGURAL_END_MS = Date.parse('2026-11-01T18:00:00-03:00');

export const DEFAULT_INAUGURAL_TOURNAMENT: SwissTournamentDefinition = {
  id: INAUGURAL_TOURNAMENT_ID,
  title: 'Copa Suíça de Vaeloria — Edição Inaugural',
  subtitle: 'Sistema Suíço · 6 Rodadas · Aberto a Todos',
  startsAtMs: INAUGURAL_START_MS,
  endsAtMs: INAUGURAL_END_MS,
  totalRounds: 6,
  roundDurationMs: 10 * 60 * 1000, // 10 min per round x 6 rounds = 60 min (17h-18h)
  playWindowMs: 9.5 * 60 * 1000,   // 9m30s active play + 30s automatic pairing interval
  timeControlId: 'rapid_45s',
  turnTimeLimitSec: 45,
  mulliganTimeLimitSec: 20,
  includeAllSovereigns: true,
  prizeSpec: {
    kind: 'unowned_domain_rare_card',
    label: '1 Carta Rara Inédita (Cor do Grimório)',
    description:
      'Concedida automaticamente ao jogador humano melhor classificado ao término da 6ª rodada, sorteada entre as cartas Raras da cor predominante do seu Grimório que ainda não pertençam à sua coleção.',
    goldBonus: 50,
  },
  createdBy: 'tsm81',
  createdAtMs: Date.parse('2026-11-01T16:15:00-03:00'),
  finalizedAward: null,
};

let serverClockOffsetMs = 0;

export function updateServerClockOffsetFromHeader(dateHeader: string | null): void {
  if (!dateHeader) return;
  const parsed = Date.parse(dateHeader);
  if (!Number.isNaN(parsed)) {
    serverClockOffsetMs = parsed - Date.now();
  }
}

export function getTournamentNowMs(): number {
  return Date.now() + serverClockOffsetMs;
}

// ============================================================================
// 4. DETERMINISTIC HASH & SEEDED PRNG FOR RACE-FREE MULTI-CLIENT CONSENSUS
// ============================================================================

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededUnitFloat(seedKey: string): number {
  let x = hashSeed(seedKey) || 1;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  return (x >>> 0) / 4294967296;
}

export function inferDeckPrimaryDomain(cardIds: string[]): Domain {
  const counts: Record<Domain, number> = {
    red: 0,
    green: 0,
    blue: 0,
    purple: 0,
    gold: 0,
    neutral: 0,
  };
  for (const cid of cardIds) {
    const dom = CARDS_BY_ID[cid]?.domain;
    if (dom) counts[dom] += 1;
  }
  let best: Domain = 'red';
  let bestCount = -1;
  for (const dom of ['red', 'green', 'blue', 'purple', 'gold'] as Domain[]) {
    if (counts[dom] > bestCount) {
      bestCount = counts[dom];
      best = dom;
    }
  }
  if (bestCount <= 0 && counts.neutral > 0) return 'neutral';
  return best;
}

/**
 * Resolves a Sovereign vs Sovereign pairing deterministically from calibrated ELO
 * so all clients compute the exact same leaderboard in < 2ms with zero race conditions.
 */
function resolveSovereignVsSovereignMatch(
  tournamentId: string,
  round: number,
  idA: string,
  eloA: number,
  idB: string,
  eloB: number
): { result: 'A_WIN' | 'B_WIN' | 'DRAW'; hpDiffA: number; turns: number } {
  const canonicalPair = idA < idB ? `${idA}::${idB}` : `${idB}::${idA}`;
  const uOutcome = seededUnitFloat(`${tournamentId}::r${round}::out::${canonicalPair}`);
  const uMargin = seededUnitFloat(`${tournamentId}::r${round}::mrg::${canonicalPair}`);
  const uTurns = seededUnitFloat(`${tournamentId}::r${round}::trn::${canonicalPair}`);

  const expectedA = 1 / (1 + Math.pow(10, (eloB - eloA) / 400));
  const drawProb = 0.03; // Rare simultaneous lethal / round-bell tie
  const winProbA = expectedA * (1 - drawProb);
  const turns = 4 + Math.floor(uTurns * 5); // 4..8 rounds

  if (uOutcome < winProbA) {
    const hp = 6 + Math.floor(uMargin * 22);
    return { result: 'A_WIN', hpDiffA: hp, turns };
  }
  if (uOutcome < winProbA + drawProb) {
    return { result: 'DRAW', hpDiffA: 0, turns: 8 };
  }
  const hp = 6 + Math.floor(uMargin * 22);
  return { result: 'B_WIN', hpDiffA: -hp, turns };
}

// ============================================================================
// 5. DETERMINISTIC SWISS PAIRING & MULTI-ROUND ENGINE
// ============================================================================

export function getRoundWindowTimestamps(
  def: SwissTournamentDefinition,
  round: number
): { startMs: number; playDeadlineMs: number; endMs: number } {
  const startMs = def.startsAtMs + (round - 1) * def.roundDurationMs;
  const endMs =
    round >= def.totalRounds
      ? def.endsAtMs
      : def.startsAtMs + round * def.roundDurationMs;
  const playDeadlineMs =
    round >= def.totalRounds
      ? Math.max(startMs + 60_000, def.endsAtMs - 5_000)
      : startMs + def.playWindowMs;
  return { startMs, playDeadlineMs, endMs };
}

function sortStandingsInPlace(list: ComputedTournamentStanding[]): void {
  list.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.buchholz !== a.buchholz) return b.buchholz - a.buchholz;
    if (b.hpDiff !== a.hpDiff) return b.hpDiff - a.hpDiff;
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (b.eloRating !== a.eloRating) return b.eloRating - a.eloRating;
    return a.participantId.localeCompare(b.participantId);
  });
  for (let i = 0; i < list.length; i += 1) {
    list[i].rank = i + 1;
  }
}

function buildDeterministicRoomCode(
  tournamentId: string,
  round: number,
  idA: string,
  idB: string
): string {
  const ordered = [idA, idB].sort().join('::');
  const h = hashSeed(`${tournamentId}::r${round}::room::${ordered}`)
    .toString(36)
    .toUpperCase()
    .padStart(6, '0')
    .slice(0, 6);
  return `TRN${round}-${h}`;
}

/**
 * Pairs participants for Round `round` using Score-Bracket + ELO-Proximity Swiss
 * (no repeat opponents; odd participant at bottom receives 1.0 pt Bye).
 */
function pairParticipantsSwiss(
  def: SwissTournamentDefinition,
  round: number,
  eligible: ComputedTournamentStanding[]
): Array<{ a: ComputedTournamentStanding; b: ComputedTournamentStanding | null }> {
  // Sort by Points DESC, then ELO DESC, then deterministic seed jitter for variety inside exact ties
  const ordered = [...eligible].sort((x, y) => {
    if (y.points !== x.points) return y.points - x.points;
    if (y.eloRating !== x.eloRating) return y.eloRating - x.eloRating;
    const jx = hashSeed(`${def.id}::r${round}::seed::${x.participantId}`);
    const jy = hashSeed(`${def.id}::r${round}::seed::${y.participantId}`);
    return jx - jy;
  });

  const used = new Set<string>();
  const pairs: Array<{ a: ComputedTournamentStanding; b: ComputedTournamentStanding | null }> = [];

  // Choose Bye recipient first if odd count (lowest ranked player who hasn't had a Bye yet, preferring non-human so humans always get a real board!)
  let byeId: string | null = null;
  if (ordered.length % 2 === 1) {
    for (let i = ordered.length - 1; i >= 0; i -= 1) {
      const cand = ordered[i];
      if (cand.kind === 'sovereign' && !cand.opponentIds.includes('__BYE__')) {
        byeId = cand.participantId;
        break;
      }
    }
    if (!byeId) {
      byeId = ordered[ordered.length - 1].participantId;
    }
    used.add(byeId);
  }

  for (let i = 0; i < ordered.length; i += 1) {
    const pA = ordered[i];
    if (used.has(pA.participantId)) continue;
    used.add(pA.participantId);

    // Find best available opponent: closest score, never faced before, closest ELO
    let bestIdx = -1;
    for (let j = i + 1; j < ordered.length; j += 1) {
      const pB = ordered[j];
      if (used.has(pB.participantId)) continue;
      if (!pA.opponentIds.includes(pB.participantId)) {
        bestIdx = j;
        break;
      }
    }
    // Fallback if all remaining opponents were already faced (only possible in tiny fields)
    if (bestIdx === -1) {
      for (let j = i + 1; j < ordered.length; j += 1) {
        if (!used.has(ordered[j].participantId)) {
          bestIdx = j;
          break;
        }
      }
    }

    if (bestIdx !== -1) {
      const pB = ordered[bestIdx];
      used.add(pB.participantId);
      pairs.push({ a: pA, b: pB });
    } else {
      pairs.push({ a: pA, b: null });
    }
  }

  if (byeId) {
    const byePlayer = ordered.find((p) => p.participantId === byeId);
    if (byePlayer) {
      pairs.push({ a: byePlayer, b: null });
    }
  }

  return pairs;
}

/**
 * Deterministically picks a Sovereign challenger for a human who joined mid-round
 * so existing main-pool pairings never shift mid-round.
 */
function pickMidRoundSovereignChallenger(
  def: SwissTournamentDefinition,
  round: number,
  human: ComputedTournamentStanding,
  allSovereigns: ComputedTournamentStanding[]
): ComputedTournamentStanding {
  const candidates = allSovereigns
    .filter((s) => !human.opponentIds.includes(s.participantId))
    .sort((x, y) => {
      const scDiffX = Math.abs(x.points - human.points);
      const scDiffY = Math.abs(y.points - human.points);
      if (scDiffX !== scDiffY) return scDiffX - scDiffY;
      const eloDiffX = Math.abs(x.eloRating - human.eloRating);
      const eloDiffY = Math.abs(y.eloRating - human.eloRating);
      if (eloDiffX !== eloDiffY) return eloDiffX - eloDiffY;
      return x.participantId.localeCompare(y.participantId);
    });
  const pool = candidates.slice(0, Math.min(5, candidates.length));
  if (pool.length === 0) return allSovereigns[0];
  const idx = hashSeed(`${def.id}::late::r${round}::${human.participantId}`) % pool.length;
  return pool[idx];
}

// ============================================================================
// 6. FULL TOURNAMENT SNAPSHOT COMPUTATION & PRIZE RESOLUTION
// ============================================================================

export function resolveUnownedDomainRareCardPrize(
  tournamentId: string,
  winnerEntry: HumanTournamentEntry,
  winnerGlobalRank: number,
  winnerPoints: number,
  prizeSpec: TournamentPrizeSpec,
  awardedAtMs: number
): TournamentAwardedPrize {
  const primaryDomain = winnerEntry.primaryDomain || inferDeckPrimaryDomain(winnerEntry.deckCardIds);
  const ownedSet = new Set(winnerEntry.ownedCardIdsSnapshot ?? []);

  // 1st priority: Rare card of the exact primary domain of the winner's Grimoire NOT owned at all
  let pool: CardDefinition[] = ALL_CARDS.filter(
    (c) => c.rarity === 'rare' && c.domain === primaryDomain && !ownedSet.has(c.id)
  );

  // 2nd priority fallback: Any Rare card of that domain (if user already owns 1+ of every Rare in that color)
  if (pool.length === 0) {
    pool = ALL_CARDS.filter((c) => c.rarity === 'rare' && c.domain === primaryDomain);
  }

  // 3rd priority fallback: Any unowned Rare card across all domains
  if (pool.length === 0) {
    pool = ALL_CARDS.filter((c) => c.rarity === 'rare' && !ownedSet.has(c.id));
  }

  // Sort deterministically by card id before applying seeded pick
  pool.sort((a, b) => a.id.localeCompare(b.id));
  const pickIdx =
    pool.length > 0
      ? hashSeed(
          `${tournamentId}::prize::${winnerEntry.username.toLowerCase()}::${winnerPoints}`
        ) % pool.length
      : 0;
  const chosenCard = pool[pickIdx];

  return {
    winnerUserId: winnerEntry.userId,
    winnerUsername: winnerEntry.username,
    winnerGlobalRank,
    winnerPoints,
    primaryDomain,
    cardId: chosenCard?.id,
    cardName: chosenCard?.name,
    goldBonus: prizeSpec.goldBonus ?? 0,
    shardsBonus: prizeSpec.shardsBonus ?? 0,
    cashBrl: prizeSpec.cashBrl,
    awardedAtMs,
  };
}

export function computeTournamentSnapshot(
  def: SwissTournamentDefinition,
  humanEntries: HumanTournamentEntry[],
  currentUsername?: string | null,
  explicitNowMs?: number
): ComputedTournamentSnapshot {
  const nowMs = explicitNowMs ?? getTournamentNowMs();

  // Deduplicate human entries by lowercase username
  const humanMap = new Map<string, HumanTournamentEntry>();
  for (const h of humanEntries) {
    if (!h?.username) continue;
    const key = h.username.trim().toLowerCase();
    const prev = humanMap.get(key);
    if (
      !prev ||
      Object.keys(h.resultsByRound ?? {}).length >=
        Object.keys(prev.resultsByRound ?? {}).length
    ) {
      humanMap.set(key, h);
    }
  }
  const uniqueHumans = Array.from(humanMap.values());

  // Initialize participant map (276 Sovereigns + enrolled Humans)
  const participantMap = new Map<string, ComputedTournamentStanding>();

  if (def.includeAllSovereigns) {
    for (const sov of SOVEREIGN_AI_LEADERBOARD_ROSTER) {
      const pid = `sov::${sov.sovereignId}`;
      participantMap.set(pid, {
        participantId: pid,
        kind: 'sovereign',
        rank: 0,
        displayName: sov.sovereignName,
        subtitle: `${sov.realmOrigin} · ${sov.sovereignTitle}`,
        avatarCardId: sov.avatarCardId,
        eloRating: sov.eloRating,
        primaryDomain: sov.domains[0] ?? 'neutral',
        points: 0,
        buchholz: 0,
        hpDiff: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        roundsPlayed: 0,
        opponentIds: [],
        sovereignEntry: sov,
      });
    }
  }

  for (const hum of uniqueHumans) {
    const pid = `hum::${hum.username.trim().toLowerCase()}`;
    participantMap.set(pid, {
      participantId: pid,
      kind: 'human',
      rank: 0,
      displayName: hum.username,
      subtitle: hum.deckName || hum.title,
      avatarCardId: hum.avatarCardId,
      eloRating: hum.eloRating,
      primaryDomain: hum.primaryDomain || inferDeckPrimaryDomain(hum.deckCardIds),
      points: 0,
      buchholz: 0,
      hpDiff: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      roundsPlayed: 0,
      opponentIds: [],
      humanEntry: hum,
    });
  }

  // Determine current tournament phase & round
  let phase: TournamentPhaseStatus = 'registration';
  let currentRound = 0;

  if (nowMs < def.startsAtMs) {
    phase = 'registration';
    currentRound = 0;
  } else if (nowMs >= def.endsAtMs) {
    phase = 'finished';
    currentRound = def.totalRounds;
  } else {
    const elapsed = nowMs - def.startsAtMs;
    const rIdx = Math.min(
      def.totalRounds,
      Math.floor(elapsed / def.roundDurationMs) + 1
    );
    currentRound = rIdx;
    const win = getRoundWindowTimestamps(def, rIdx);
    phase = nowMs < win.playDeadlineMs ? 'round_active' : 'round_break';
  }

  let currentRoundPairings: ComputedRoundPairing[] = [];

  // Simulate / resolve Rounds 1..currentRound sequentially
  for (let r = 1; r <= currentRound; r += 1) {
    const rWin = getRoundWindowTimestamps(def, r);
    const isPastDeadline = nowMs >= rWin.playDeadlineMs || phase === 'finished';

    // Main pool for round r: all Sovereigns + humans enrolled on or before round start
    const mainPool: ComputedTournamentStanding[] = [];
    const midRoundHumans: ComputedTournamentStanding[] = [];
    const allSovStandings: ComputedTournamentStanding[] = [];

    for (const st of participantMap.values()) {
      if (st.kind === 'sovereign') {
        mainPool.push(st);
        allSovStandings.push(st);
      } else if (st.humanEntry) {
        if (st.humanEntry.enrolledAtMs <= rWin.startMs) {
          mainPool.push(st);
        } else if (st.humanEntry.enrolledAtMs <= rWin.playDeadlineMs) {
          midRoundHumans.push(st);
        }
      }
    }

    const rawPairs = pairParticipantsSwiss(def, r, mainPool);
    const roundPairings: ComputedRoundPairing[] = [];
    let tableNum = 1;

    const applyScore = (
      st: ComputedTournamentStanding,
      oppId: string,
      pts: 1 | 0.5 | 0,
      hpDelta: number
    ) => {
      st.points += pts;
      st.hpDiff += hpDelta;
      st.roundsPlayed += 1;
      st.opponentIds.push(oppId);
      if (pts === 1) st.wins += 1;
      else if (pts === 0.5) st.draws += 1;
      else st.losses += 1;
    };

    for (const pair of rawPairs) {
      const { a, b } = pair;
      if (!b) {
        applyScore(a, '__BYE__', 1, 10);
        roundPairings.push({
          tableNumber: tableNum++,
          round: r,
          playerA: { ...a },
          playerB: null,
          result: 'BYE',
          hpDiffA: 10,
          turns: 0,
          isHumanTable: a.kind === 'human',
        });
        continue;
      }

      const isHumanTable = a.kind === 'human' || b.kind === 'human';

      if (!isHumanTable) {
        // Sovereign vs Sovereign: resolved deterministically once round starts
        const res = resolveSovereignVsSovereignMatch(
          def.id,
          r,
          a.participantId,
          a.eloRating,
          b.participantId,
          b.eloRating
        );
        if (res.result === 'A_WIN') {
          applyScore(a, b.participantId, 1, res.hpDiffA);
          applyScore(b, a.participantId, 0, -res.hpDiffA);
        } else if (res.result === 'B_WIN') {
          applyScore(a, b.participantId, 0, res.hpDiffA);
          applyScore(b, a.participantId, 1, -res.hpDiffA);
        } else {
          applyScore(a, b.participantId, 0.5, 0);
          applyScore(b, a.participantId, 0.5, 0);
        }
        roundPairings.push({
          tableNumber: tableNum++,
          round: r,
          playerA: { ...a },
          playerB: { ...b },
          result: res.result,
          hpDiffA: res.hpDiffA,
          turns: res.turns,
          isHumanTable: false,
        });
      } else if (a.kind === 'human' && b.kind === 'human') {
        // Human vs Human table
        const recA = a.humanEntry?.resultsByRound?.[r];
        const recB = b.humanEntry?.resultsByRound?.[r];
        const roomCode = buildDeterministicRoomCode(
          def.id,
          r,
          a.participantId,
          b.participantId
        );

        if (recA) {
          const ptsB: 1 | 0.5 | 0 = recA.score === 1 ? 0 : recA.score === 0 ? 1 : 0.5;
          applyScore(a, b.participantId, recA.score, recA.hpDiff);
          applyScore(b, a.participantId, ptsB, -recA.hpDiff);
          roundPairings.push({
            tableNumber: tableNum++,
            round: r,
            playerA: { ...a },
            playerB: { ...b },
            result: recA.score === 1 ? 'A_WIN' : recA.score === 0 ? 'B_WIN' : 'DRAW',
            hpDiffA: recA.hpDiff,
            turns: recA.turns,
            roomCode,
            isHumanTable: true,
          });
        } else if (recB) {
          const ptsA: 1 | 0.5 | 0 = recB.score === 1 ? 0 : recB.score === 0 ? 1 : 0.5;
          applyScore(a, b.participantId, ptsA, -recB.hpDiff);
          applyScore(b, a.participantId, recB.score, recB.hpDiff);
          roundPairings.push({
            tableNumber: tableNum++,
            round: r,
            playerA: { ...a },
            playerB: { ...b },
            result: ptsA === 1 ? 'A_WIN' : ptsA === 0 ? 'B_WIN' : 'DRAW',
            hpDiffA: -recB.hpDiff,
            turns: recB.turns,
            roomCode,
            isHumanTable: true,
          });
        } else if (isPastDeadline) {
          // Neither human recorded a result before round deadline -> double forfeit (0-0) unless one started
          const aStarted = a.humanEntry?.activeRoundStarted === r;
          const bStarted = b.humanEntry?.activeRoundStarted === r;
          if (aStarted && !bStarted) {
            applyScore(a, b.participantId, 1, 15);
            applyScore(b, a.participantId, 0, -15);
            roundPairings.push({
              tableNumber: tableNum++,
              round: r,
              playerA: { ...a },
              playerB: { ...b },
              result: 'A_WIN',
              hpDiffA: 15,
              turns: 0,
              roomCode,
              isHumanTable: true,
            });
          } else if (bStarted && !aStarted) {
            applyScore(a, b.participantId, 0, -15);
            applyScore(b, a.participantId, 1, 15);
            roundPairings.push({
              tableNumber: tableNum++,
              round: r,
              playerA: { ...a },
              playerB: { ...b },
              result: 'B_WIN',
              hpDiffA: -15,
              turns: 0,
              roomCode,
              isHumanTable: true,
            });
          } else {
            applyScore(a, b.participantId, 0, 0);
            applyScore(b, a.participantId, 0, 0);
            roundPairings.push({
              tableNumber: tableNum++,
              round: r,
              playerA: { ...a },
              playerB: { ...b },
              result: 'DRAW',
              hpDiffA: 0,
              turns: 0,
              roomCode,
              isHumanTable: true,
            });
          }
        } else {
          roundPairings.push({
            tableNumber: tableNum++,
            round: r,
            playerA: { ...a },
            playerB: { ...b },
            result: 'IN_PROGRESS',
            hpDiffA: 0,
            turns: 0,
            roomCode,
            isHumanTable: true,
          });
        }
      } else {
        // Human vs Sovereign table
        const hum = a.kind === 'human' ? a : b;
        const sov = a.kind === 'sovereign' ? a : b;
        const humIsA = a.kind === 'human';
        const rec = hum.humanEntry?.resultsByRound?.[r];

        if (rec) {
          const sovScore: 1 | 0.5 | 0 =
            rec.score === 1 ? 0 : rec.score === 0 ? 1 : 0.5;
          applyScore(hum, sov.participantId, rec.score, rec.hpDiff);
          applyScore(sov, hum.participantId, sovScore, -rec.hpDiff);
          const resultCode =
            rec.score === 0.5
              ? 'DRAW'
              : (rec.score === 1) === humIsA
              ? 'A_WIN'
              : 'B_WIN';
          roundPairings.push({
            tableNumber: tableNum++,
            round: r,
            playerA: { ...a },
            playerB: { ...b },
            result: resultCode,
            hpDiffA: humIsA ? rec.hpDiff : -rec.hpDiff,
            turns: rec.turns,
            isHumanTable: true,
          });
        } else if (isPastDeadline) {
          // Human missed the round -> Sovereign wins by W.O.
          applyScore(hum, sov.participantId, 0, -20);
          applyScore(sov, hum.participantId, 1, 20);
          roundPairings.push({
            tableNumber: tableNum++,
            round: r,
            playerA: { ...a },
            playerB: { ...b },
            result: humIsA ? 'B_WIN' : 'A_WIN',
            hpDiffA: humIsA ? -20 : 20,
            turns: 0,
            isHumanTable: true,
          });
        } else {
          roundPairings.push({
            tableNumber: tableNum++,
            round: r,
            playerA: { ...a },
            playerB: { ...b },
            result: 'IN_PROGRESS',
            hpDiffA: 0,
            turns: 0,
            isHumanTable: true,
          });
        }
      }
    }

    // Also pair any mid-round late-joining human immediately against a matching Sovereign challenger
    for (const lateHum of midRoundHumans) {
      const challenger = pickMidRoundSovereignChallenger(
        def,
        r,
        lateHum,
        allSovStandings
      );
      const rec = lateHum.humanEntry?.resultsByRound?.[r];
      if (rec) {
        applyScore(lateHum, challenger.participantId, rec.score, rec.hpDiff);
        roundPairings.push({
          tableNumber: tableNum++,
          round: r,
          playerA: { ...lateHum },
          playerB: { ...challenger },
          result:
            rec.score === 1 ? 'A_WIN' : rec.score === 0 ? 'B_WIN' : 'DRAW',
          hpDiffA: rec.hpDiff,
          turns: rec.turns,
          isHumanTable: true,
        });
      } else if (isPastDeadline) {
        applyScore(lateHum, challenger.participantId, 0, -20);
        roundPairings.push({
          tableNumber: tableNum++,
          round: r,
          playerA: { ...lateHum },
          playerB: { ...challenger },
          result: 'B_WIN',
          hpDiffA: -20,
          turns: 0,
          isHumanTable: true,
        });
      } else {
        roundPairings.push({
          tableNumber: tableNum++,
          round: r,
          playerA: { ...lateHum },
          playerB: { ...challenger },
          result: 'IN_PROGRESS',
          hpDiffA: 0,
          turns: 0,
          isHumanTable: true,
        });
      }
    }

    if (r === currentRound) {
      currentRoundPairings = roundPairings;
    }
  }

  // Compute Buchholz (sum of final/current points of all opponents faced)
  for (const st of participantMap.values()) {
    let bh = 0;
    for (const oppId of st.opponentIds) {
      if (oppId === '__BYE__') continue;
      const opp = participantMap.get(oppId);
      if (opp) bh += opp.points;
    }
    st.buchholz = Math.round(bh * 10) / 10;
  }

  const standings = Array.from(participantMap.values());
  sortStandingsInPlace(standings);

  // Refresh playerA/playerB ranks inside currentRoundPairings
  const rankLookup = new Map(standings.map((s) => [s.participantId, s]));
  currentRoundPairings = currentRoundPairings
    .map((p) => ({
      ...p,
      playerA: rankLookup.get(p.playerA.participantId) ?? p.playerA,
      playerB: p.playerB
        ? rankLookup.get(p.playerB.participantId) ?? p.playerB
        : null,
    }))
    .sort((x, y) => {
      if (x.isHumanTable !== y.isHumanTable) return x.isHumanTable ? -1 : 1;
      return x.tableNumber - y.tableNumber;
    });

  const cleanCurrentUser = (currentUsername || '').trim().toLowerCase();
  const myPid = cleanCurrentUser ? `hum::${cleanCurrentUser}` : '';
  const myStanding = myPid ? rankLookup.get(myPid) ?? null : null;
  const myEntry = myStanding?.humanEntry ?? null;
  const myCurrentPairing = myPid
    ? currentRoundPairings.find(
        (p) =>
          p.playerA.participantId === myPid ||
          p.playerB?.participantId === myPid
      ) ?? null
    : null;

  // Determine Round Timestamps for UI countdowns
  let roundStartsAtMs = def.startsAtMs;
  let roundPlayDeadlineMs = def.startsAtMs + def.playWindowMs;
  let roundEndsAtMs = def.startsAtMs + def.roundDurationMs;
  if (currentRound >= 1 && currentRound <= def.totalRounds) {
    const rw = getRoundWindowTimestamps(def, currentRound);
    roundStartsAtMs = rw.startMs;
    roundPlayDeadlineMs = rw.playDeadlineMs;
    roundEndsAtMs = rw.endMs;
  }

  // Automatic Prize Resolution once Tournament is Finished
  let finalizedAward: TournamentAwardedPrize | null = def.finalizedAward ?? null;
  if (phase === 'finished' && !finalizedAward) {
    // Best human participant who actually played at least 1 match (or fallback to any enrolled human if none finished)
    const activeHumans = standings.filter(
      (s) =>
        s.kind === 'human' &&
        s.humanEntry &&
        Object.keys(s.humanEntry.resultsByRound ?? {}).length > 0
    );
    const bestHuman =
      activeHumans[0] ??
      standings.find((s) => s.kind === 'human' && Boolean(s.humanEntry));

    if (bestHuman && bestHuman.humanEntry) {
      finalizedAward = resolveUnownedDomainRareCardPrize(
        def.id,
        bestHuman.humanEntry,
        bestHuman.rank,
        bestHuman.points,
        def.prizeSpec,
        def.endsAtMs
      );
    }
  }

  return {
    definition: def,
    nowMs,
    phase,
    currentRound,
    roundStartsAtMs,
    roundPlayDeadlineMs,
    roundEndsAtMs,
    standings,
    currentRoundPairings,
    myEntry,
    myStanding,
    myCurrentPairing,
    humanEntrantsCount: uniqueHumans.length,
    totalParticipantsCount: standings.length,
    finalizedAward,
  };
}

// ============================================================================
// 7. SUPABASE CLOUD PERSISTENCE & LOCAL CACHE (RACE-FREE PER-USER ROWS)
// ============================================================================

const LOCAL_TOURNAMENT_META_KEY = 'chromatic_pact_tournament_meta_v1';
const LOCAL_TOURNAMENT_ENTRIES_KEY = 'chromatic_pact_tournament_entries_v1';
const CLAIMED_TOURNAMENT_PRIZES_KEY = 'chromatic_pact_claimed_tournaments_v1';

const CLOUD_META_PREFIX = '__tournament_meta__:';
const CLOUD_ENTRY_PREFIX = '__tournament_entry__:';

function getHeaders(anonKey: string, extra?: Record<string, string>): Record<string, string> {
  return {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
    ...(extra ?? {}),
  };
}

export function getClaimedTournamentPrizeIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(CLAIMED_TOURNAMENT_PRIZES_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

export function markTournamentPrizeClaimedLocal(claimKey: string): void {
  if (typeof window === 'undefined') return;
  try {
    const set = getClaimedTournamentPrizeIds();
    set.add(claimKey);
    localStorage.setItem(CLAIMED_TOURNAMENT_PRIZES_KEY, JSON.stringify(Array.from(set)));
  } catch {
    // Ignore
  }
}

function readLocalTournamentState(): {
  def: SwissTournamentDefinition;
  entries: HumanTournamentEntry[];
} {
  let def = DEFAULT_INAUGURAL_TOURNAMENT;
  let entries: HumanTournamentEntry[] = [];
  if (typeof window === 'undefined') return { def, entries };
  try {
    const rawDef = localStorage.getItem(LOCAL_TOURNAMENT_META_KEY);
    if (rawDef) {
      const parsed = JSON.parse(rawDef) as SwissTournamentDefinition;
      if (parsed && parsed.id) def = parsed;
    }
    const rawEntries = localStorage.getItem(LOCAL_TOURNAMENT_ENTRIES_KEY);
    if (rawEntries) {
      const parsedE = JSON.parse(rawEntries) as HumanTournamentEntry[];
      if (Array.isArray(parsedE)) entries = parsedE;
    }
  } catch {
    // Ignore
  }
  return { def, entries };
}

function saveLocalTournamentState(
  def: SwissTournamentDefinition,
  entries: HumanTournamentEntry[]
): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_TOURNAMENT_META_KEY, JSON.stringify(def));
    localStorage.setItem(LOCAL_TOURNAMENT_ENTRIES_KEY, JSON.stringify(entries));
  } catch {
    // Ignore
  }
}

export async function publishTournamentDefinitionToCloud(
  def: SwissTournamentDefinition
): Promise<boolean> {
  const local = readLocalTournamentState();
  saveLocalTournamentState(def, local.entries);

  const cfg = getSupabaseConfig();
  if (!cfg.isConfigured) return true;

  try {
    const res = await fetch(`${cfg.url}/rest/v1/sovereign_profiles?on_conflict=username`, {
      method: 'POST',
      headers: getHeaders(cfg.anonKey, {
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      }),
      body: JSON.stringify({
        username: `${CLOUD_META_PREFIX}${def.id}`,
        title: JSON.stringify(def),
        avatar_card_id: 'neutral_10_valkyra_pentacromatica',
        elo_rating: 1000,
        pvp_wins: def.totalRounds,
        pvp_losses: 0,
        gold: 0,
        updated_at: new Date().toISOString(),
      }),
    });
    updateServerClockOffsetFromHeader(res.headers.get('date'));
    return res.ok;
  } catch {
    return false;
  }
}

export async function upsertHumanTournamentEntryToCloud(
  entry: HumanTournamentEntry
): Promise<boolean> {
  const local = readLocalTournamentState();
  const cleanUser = entry.username.trim().toLowerCase();
  const filtered = local.entries.filter(
    (e) =>
      !(
        e.tournamentId === entry.tournamentId &&
        e.username.trim().toLowerCase() === cleanUser
      )
  );
  saveLocalTournamentState(local.def, [...filtered, entry]);

  const cfg = getSupabaseConfig();
  if (!cfg.isConfigured) return true;

  try {
    const res = await fetch(`${cfg.url}/rest/v1/sovereign_profiles?on_conflict=username`, {
      method: 'POST',
      headers: getHeaders(cfg.anonKey, {
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      }),
      body: JSON.stringify({
        username: `${CLOUD_ENTRY_PREFIX}${entry.tournamentId}:${cleanUser}`,
        title: JSON.stringify(entry),
        avatar_card_id: entry.avatarCardId || 'neutral_10_valkyra_pentacromatica',
        elo_rating: entry.eloRating || 1000,
        pvp_wins: Object.values(entry.resultsByRound ?? {}).filter((r) => r.score === 1).length,
        pvp_losses: Object.values(entry.resultsByRound ?? {}).filter((r) => r.score === 0).length,
        gold: 0,
        updated_at: new Date().toISOString(),
      }),
    });
    updateServerClockOffsetFromHeader(res.headers.get('date'));
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchActiveTournamentStateFromCloud(): Promise<{
  definition: SwissTournamentDefinition;
  entries: HumanTournamentEntry[];
}> {
  const local = readLocalTournamentState();
  const cfg = getSupabaseConfig();
  if (!cfg.isConfigured) {
    return { definition: local.def, entries: local.entries };
  }

  try {
    const res = await fetch(
      `${cfg.url}/rest/v1/sovereign_profiles?username=like.__tournament_*&select=username,title,updated_at&order=updated_at.desc&limit=200`,
      {
        headers: getHeaders(cfg.anonKey),
      }
    );
    updateServerClockOffsetFromHeader(res.headers.get('date'));
    if (!res.ok) {
      return { definition: local.def, entries: local.entries };
    }

    const rows = (await res.json()) as Array<{
      username: string;
      title: string;
      updated_at: string;
    }>;

    const defs: SwissTournamentDefinition[] = [];
    const allEntries: HumanTournamentEntry[] = [];

    for (const r of rows) {
      if (!r.username || !r.title) continue;
      if (r.username.startsWith(CLOUD_META_PREFIX)) {
        try {
          const parsed = JSON.parse(r.title) as SwissTournamentDefinition;
          if (parsed && parsed.id) defs.push(parsed);
        } catch {
          // Ignore malformed row
        }
      } else if (r.username.startsWith(CLOUD_ENTRY_PREFIX)) {
        try {
          const parsed = JSON.parse(r.title) as HumanTournamentEntry;
          if (parsed && parsed.tournamentId && parsed.username) {
            allEntries.push(parsed);
          }
        } catch {
          // Ignore malformed row
        }
      }
    }

    // Pick active or most recent upcoming/live tournament (preferring live > upcoming > latest finished)
    const now = getTournamentNowMs();
    defs.sort((a, b) => {
      const aLive = now >= a.startsAtMs && now < a.endsAtMs ? 2 : now < a.startsAtMs ? 1 : 0;
      const bLive = now >= b.startsAtMs && now < b.endsAtMs ? 2 : now < b.startsAtMs ? 1 : 0;
      if (bLive !== aLive) return bLive - aLive;
      return b.startsAtMs - a.startsAtMs;
    });

    let activeDef = defs[0] ?? DEFAULT_INAUGURAL_TOURNAMENT;

    // Seed the Inaugural Tournament to Cloud automatically if not yet stored
    if (defs.length === 0) {
      activeDef = DEFAULT_INAUGURAL_TOURNAMENT;
      void publishTournamentDefinitionToCloud(activeDef);
    }

    const relevantEntries = allEntries.filter((e) => e.tournamentId === activeDef.id);
    // Merge with any local entry that has more recorded rounds (instant optimistic UI)
    for (const loc of local.entries) {
      if (loc.tournamentId !== activeDef.id) continue;
      const idx = relevantEntries.findIndex(
        (e) => e.username.trim().toLowerCase() === loc.username.trim().toLowerCase()
      );
      if (idx === -1) {
        relevantEntries.push(loc);
      } else if (
        Object.keys(loc.resultsByRound ?? {}).length >
        Object.keys(relevantEntries[idx].resultsByRound ?? {}).length
      ) {
        relevantEntries[idx] = loc;
      }
    }

    saveLocalTournamentState(activeDef, relevantEntries);
    return { definition: activeDef, entries: relevantEntries };
  } catch {
    return { definition: local.def, entries: local.entries };
  }
}

export async function enrollHumanInTournament(params: {
  tournament: SwissTournamentDefinition;
  user: SovereignUserProfile;
  deckId: string;
  deckName: string;
  deckCardIds: string[];
  unlockedCardIds: Record<string, number>;
}): Promise<HumanTournamentEntry> {
  const now = getTournamentNowMs();
  const ownedSnapshot = Object.entries(params.unlockedCardIds)
    .filter(([, count]) => count > 0)
    .map(([cid]) => cid);

  const entry: HumanTournamentEntry = {
    tournamentId: params.tournament.id,
    userId: params.user.id,
    username: params.user.username,
    title: params.user.title,
    avatarCardId: params.user.avatarCardId,
    eloRating: params.user.eloRating ?? 1000,
    deckId: params.deckId,
    deckName: params.deckName,
    primaryDomain: inferDeckPrimaryDomain(params.deckCardIds),
    deckCardIds: params.deckCardIds.slice(0, 100),
    ownedCardIdsSnapshot: ownedSnapshot,
    enrolledAtMs: now,
    lastHeartbeatAtMs: now,
    resultsByRound: {},
    prizeClaimed: false,
  };

  await upsertHumanTournamentEntryToCloud(entry);
  return entry;
}

/**
 * Builds the symmetric 40 PV vs 40 PV encounter when a human faces a Sovereign in the Swiss Tournament.
 * Zero PvE passives, zero Overworld buffs — 100% symmetric tournament rules.
 */
export function buildTournamentSovereignBossEncounter(
  sovereignEntry: SovereignAiLeaderboardEntry,
  round: number
): CampaignBoss {
  const base = buildRankedSovereignBossEncounter(sovereignEntry);
  return {
    ...base,
    id: `tourn_r${round}_${sovereignEntry.sovereignId}`,
    stage: round,
    startingHp: 40,
    passiveName: 'Regra Simétrica de Torneio',
    passiveDescription: 'Duelo oficial 40 PV vs 40 PV sem modificadores externos.',
    rewardGold: 15,
  };
}
