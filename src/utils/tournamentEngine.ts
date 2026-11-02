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

export interface ParticipantRoundHistoryItem {
  round: number;
  tableNumber: number;
  opponentId: string; // '__BYE__' if Swiss Bye
  opponentName: string;
  opponentSubtitle: string;
  opponentAvatarCardId: string;
  opponentPrimaryDomain: Domain;
  opponentElo: number;
  opponentFinalRank: number;
  opponentFinalPoints: number;
  outcome: 'WIN' | 'DRAW' | 'LOSS' | 'BYE' | 'IN_PROGRESS';
  scoreEarned: 1 | 0.5 | 0;
  cumulativePoints: number;
  hpDiff: number;
  turns: number;
  liveTurnEstimate?: number;
  matchStartMs?: number;
  matchFinishMs?: number;
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
  matchHistory: ParticipantRoundHistoryItem[];
  sovereignEntry?: SovereignAiLeaderboardEntry;
  humanEntry?: HumanTournamentEntry;
}

export interface ComputedRoundPairing {
  tableNumber: number;
  round: number;
  playerA: ComputedTournamentStanding;
  playerB: ComputedTournamentStanding | null; // null = Swiss Bye (1.0 pt)
  pointsBeforeA: number;
  pointsBeforeB: number;
  result: 'A_WIN' | 'B_WIN' | 'DRAW' | 'BYE' | 'IN_PROGRESS' | 'PENDING';
  hpDiffA: number;
  turns: number;
  liveTurnEstimate?: number;
  matchStartMs?: number;
  matchFinishMs?: number;
  canonicalResult?: 'A_WIN' | 'B_WIN' | 'DRAW';
  canonicalHpDiffA?: number;
  canonicalTurns?: number;
  roomCode?: string;
  isHumanTable: boolean;
  isMyTable?: boolean;
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
  roundsPairings: Record<number, ComputedRoundPairing[]>;
  myEntry: HumanTournamentEntry | null;
  myStanding: ComputedTournamentStanding | null;
  myCurrentPairing: ComputedRoundPairing | null;
  humanEntrantsCount: number;
  totalParticipantsCount: number;
  finalizedAward: TournamentAwardedPrize | null;
}

export interface TournamentCatalogData {
  tournaments: SwissTournamentDefinition[];
  entriesByTournament: Record<string, HumanTournamentEntry[]>;
  primaryTournamentId: string;
}

// ============================================================================
// 3. INAUGURAL EDITION & AUTOMATIC OFFICIAL WEEKLY SCHEDULE + CLOCK SYNC
// ============================================================================

export const INAUGURAL_TOURNAMENT_ID = 'copa_vaeloria_2026_11_01_19h';

// 2026-11-01T19:00:00-03:00 -> 2026-11-01T20:00:00-03:00
const INAUGURAL_START_MS = Date.parse('2026-11-01T19:00:00-03:00');
const INAUGURAL_END_MS = Date.parse('2026-11-01T20:00:00-03:00');

export const DEFAULT_INAUGURAL_TOURNAMENT: SwissTournamentDefinition = {
  id: INAUGURAL_TOURNAMENT_ID,
  title: 'Copa Suíça de Vaeloria — Edição das 19h',
  subtitle: 'Sistema Suíço · 6 Rodadas · 45s / turno',
  startsAtMs: INAUGURAL_START_MS,
  endsAtMs: INAUGURAL_END_MS,
  totalRounds: 6,
  roundDurationMs: 10 * 60 * 1000, // 10 min per round x 6 rounds = 60 min (19h-20h)
  playWindowMs: 9.5 * 60 * 1000,   // 9m30s active play + 30s automatic pairing interval
  timeControlId: 'rapid_45s',
  turnTimeLimitSec: 45,
  mulliganTimeLimitSec: 20,
  includeAllSovereigns: true,
  prizeSpec: {
    kind: 'unowned_domain_rare_card',
    label: '1 Carta Rara Inédita (Cor do Grimório)',
    description:
      'Concedida automaticamente ao Campeão da edição ao término da 6ª rodada, sorteada entre as cartas Raras inéditas da cor predominante do seu Grimório (+50 Ouro).',
    goldBonus: 50,
  },
  createdBy: 'tsm81',
  createdAtMs: Date.parse('2026-11-01T18:52:00-03:00'),
  finalizedAward: null,
};

/**
 * Builds the deterministic official recurring tournament calendar in Brasília time (UTC-3):
 * - Daily 12h30 BRT: Copa Meridiana de Vaeloria (5 rounds, Blitz 30s/turn, +80 Gold & +60 Shards)
 * - Mon–Sat 20h00 BRT: Copa Suíça Noturna (6 rounds, Rapid 45s/turn, 1 Unowned Rare + 50 Gold)
 * - Sundays 19h00 BRT: Grande Copa Dominical (7 rounds, Rapid 45s/turn, 1 Unowned Legendary + 120 Gold)
 *
 * Includes editions within [nowMs - 36h, nowMs + 36h] plus the next upcoming Sunday Grand Cup
 * so players always have open registrations, countdowns, and recent completed replays.
 */
export function buildScheduledOfficialTournaments(nowMs: number): SwissTournamentDefinition[] {
  const BRT_OFFSET_MS = -3 * 60 * 60 * 1000;
  const DAY_MS = 24 * 60 * 60 * 1000;
  const pad2 = (n: number) => String(n).padStart(2, '0');

  const out = new Map<string, SwissTournamentDefinition>();
  const brtShiftedNow = nowMs + BRT_OFFSET_MS;
  const todayBrtMidnightShifted = Math.floor(brtShiftedNow / DAY_MS) * DAY_MS;

  const buildDayEditions = (dayOffset: number, onlySundayGrandCup = false) => {
    const dayShiftedMs = todayBrtMidnightShifted + dayOffset * DAY_MS;
    const d = new Date(dayShiftedMs);
    const yyyy = d.getUTCFullYear();
    const mm = pad2(d.getUTCMonth() + 1);
    const dd = pad2(d.getUTCDate());
    const dow = d.getUTCDay(); // 0 = Sunday .. 6 = Saturday
    const dateIsoPrefix = `${yyyy}-${mm}-${dd}`;
    const dateSlug = `${yyyy}_${mm}_${dd}`;
    const createdAtMs = Date.parse(`${dateIsoPrefix}T00:05:00-03:00`);

    if (!onlySundayGrandCup) {
      // 1. Daily 12:30 BRT — Copa Meridiana (5 rounds x 9m = 45m, Blitz 30s)
      const noonStartMs = Date.parse(`${dateIsoPrefix}T12:30:00-03:00`);
      const noonEndMs = noonStartMs + 5 * 9 * 60 * 1000;
      const noonId = `copa_meridiana_${dateSlug}_12h30`;
      out.set(noonId, {
        id: noonId,
        title: `Copa Meridiana`,
        subtitle: `Sistema Suíço · 5 Rodadas · 30s / turno`,
        startsAtMs: noonStartMs,
        endsAtMs: noonEndMs,
        totalRounds: 5,
        roundDurationMs: 9 * 60 * 1000,
        playWindowMs: 8.5 * 60 * 1000,
        timeControlId: 'blitz_30s',
        turnTimeLimitSec: 30,
        mulliganTimeLimitSec: 20,
        includeAllSovereigns: true,
        prizeSpec: {
          kind: 'gold_and_shards',
          label: '80 Ouro + 60 Estilhaços',
          description:
            'Concedido automaticamente ao Campeão da edição meridiana ao término da 5ª rodada (+80 Ouro e +60 Estilhaços Astrais para Forja).',
          goldBonus: 80,
          shardsBonus: 60,
        },
        createdBy: 'conclave_oficial',
        createdAtMs,
        finalizedAward: null,
      });

      // 2. Mon–Sat 20:00 BRT — Copa Suíça Noturna (6 rounds x 10m = 60m, Rapid 45s)
      if (dow !== 0) {
        const nightStartMs = Date.parse(`${dateIsoPrefix}T20:00:00-03:00`);
        const nightEndMs = nightStartMs + 6 * 10 * 60 * 1000;
        const nightId = `copa_noturna_${dateSlug}_20h`;
        out.set(nightId, {
          id: nightId,
          title: `Copa Suíça Noturna`,
          subtitle: `Sistema Suíço · 6 Rodadas · 45s / turno`,
          startsAtMs: nightStartMs,
          endsAtMs: nightEndMs,
          totalRounds: 6,
          roundDurationMs: 10 * 60 * 1000,
          playWindowMs: 9.5 * 60 * 1000,
          timeControlId: 'rapid_45s',
          turnTimeLimitSec: 45,
          mulliganTimeLimitSec: 20,
          includeAllSovereigns: true,
          prizeSpec: {
            kind: 'unowned_domain_rare_card',
            label: '1 Carta Rara Inédita + 50 Ouro',
            description:
              'Concedida automaticamente ao Campeão da edição noturna ao término da 6ª rodada, sorteada entre as cartas Raras inéditas da cor predominante do seu Grimório (+50 Ouro).',
            goldBonus: 50,
          },
          createdBy: 'conclave_oficial',
          createdAtMs,
          finalizedAward: null,
        });
      }
    }

    // 3. Sunday 19:00 BRT — Grande Copa Dominical (7 rounds x 10m = 70m, Legendary Prize!)
    if (dow === 0) {
      const sunStartMs = Date.parse(`${dateIsoPrefix}T19:00:00-03:00`);
      const sunEndMs = sunStartMs + 7 * 10 * 60 * 1000;
      const sunId = `grande_copa_domingo_${dateSlug}_19h`;
      // Avoid colliding with the historical 2026-11-01 19h inaugural test tournament
      if (dateIsoPrefix !== '2026-11-01') {
        out.set(sunId, {
          id: sunId,
          title: `Grande Copa Dominical`,
          subtitle: `Sistema Suíço · 7 Rodadas · 45s / turno`,
          startsAtMs: sunStartMs,
          endsAtMs: sunEndMs,
          totalRounds: 7,
          roundDurationMs: 10 * 60 * 1000,
          playWindowMs: 9.5 * 60 * 1000,
          timeControlId: 'rapid_45s',
          turnTimeLimitSec: 45,
          mulliganTimeLimitSec: 25,
          includeAllSovereigns: true,
          prizeSpec: {
            kind: 'unowned_domain_legendary_card',
            label: '1 Carta Lendária Inédita + 120 Ouro',
            description:
              'Concedida automaticamente ao Grande Campeão de Domingo ao término da 7ª rodada, sorteada entre as cartas Lendárias inéditas da cor predominante do seu Grimório (+120 Ouro).',
            goldBonus: 120,
          },
          createdBy: 'conclave_oficial',
          createdAtMs,
          finalizedAward: null,
        });
      }
    }
  };

  // Yesterday, Today, Tomorrow, +2d (in case tomorrow is Sunday and Monday is next Night Cup)
  for (const offset of [-1, 0, 1, 2]) {
    buildDayEditions(offset, false);
  }
  // Ensure the next upcoming Sunday Grand Cup is always visible on the schedule
  for (let offset = 2; offset <= 7; offset += 1) {
    const dayShiftedMs = todayBrtMidnightShifted + offset * DAY_MS;
    if (new Date(dayShiftedMs).getUTCDay() === 0) {
      buildDayEditions(offset, true);
      break;
    }
  }

  const minEndKeepMs = nowMs - 36 * 60 * 60 * 1000;
  const candidates = Array.from(out.values()).sort((a, b) => a.startsAtMs - b.startsAtMs);

  // Keep recent completed editions + ONLY the single next active/upcoming edition per series!
  const seenUpcomingSeries = new Set<string>();
  const filtered: SwissTournamentDefinition[] = [];
  for (const def of candidates) {
    if (def.endsAtMs < minEndKeepMs) continue;
    const isFinished = nowMs >= def.endsAtMs;
    if (isFinished) {
      filtered.push(def);
      continue;
    }
    const seriesKey = def.id.startsWith('copa_meridiana_')
      ? 'meridiana'
      : def.id.startsWith('copa_noturna_')
      ? 'noturna'
      : def.id.startsWith('grande_copa_domingo_')
      ? 'domingo'
      : def.id;
    if (seenUpcomingSeries.has(seriesKey)) continue;
    seenUpcomingSeries.add(seriesKey);
    filtered.push(def);
  }

  return filtered;
}

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

/**
 * Returns a discrete stage key for memoization so `computeTournamentSnapshot` only recomputes
 * when a round boundary is crossed (instead of every 1,000ms clock tick).
 */
export function getTournamentStageKey(def: SwissTournamentDefinition, nowMs: number): string {
  if (nowMs < def.startsAtMs) return 'registration';
  if (nowMs >= def.endsAtMs) return 'finished';
  const elapsed = nowMs - def.startsAtMs;
  const rIdx = Math.min(def.totalRounds, Math.floor(elapsed / def.roundDurationMs) + 1);
  const win = getRoundWindowTimestamps(def, rIdx);
  if (nowMs < win.playDeadlineMs) {
    const tick4s = Math.floor(elapsed / 4000);
    return `r${rIdx}_active_${tick4s}`;
  }
  return `r${rIdx}_break`;
}

// ============================================================================
// 4. DETERMINISTIC HASH & SEEDED PRNG FOR RACE-FREE MULTI-CLIENT CONSENSUS
// ============================================================================

export function hashTournamentSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function hashSeed(input: string): number {
  return hashTournamentSeed(input);
}

export function computeCanonicalPairKey(idA: string, idB: string): string {
  return idA < idB ? `${idA}::${idB}` : `${idB}::${idA}`;
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
 * AND assigns a realistic human-paced clock window (3m20s to 8m35s within the 9m30s round)
 * so unwatched tables consume 0ms CPU while remaining live-watchable in real time.
 */
export function resolveSovereignVsSovereignMatch(
  tournamentId: string,
  round: number,
  idA: string,
  eloA: number,
  idB: string,
  eloB: number,
  roundStartMs = 0,
  playWindowMs = 9.5 * 60 * 1000
): {
  result: 'A_WIN' | 'B_WIN' | 'DRAW';
  hpDiffA: number;
  turns: number;
  matchStartMs: number;
  matchFinishMs: number;
} {
  const canonicalPair = computeCanonicalPairKey(idA, idB);
  const uOutcome = seededUnitFloat(`${tournamentId}::r${round}::out::${canonicalPair}`);
  const uMargin = seededUnitFloat(`${tournamentId}::r${round}::mrg::${canonicalPair}`);
  const uTurns = seededUnitFloat(`${tournamentId}::r${round}::trn::${canonicalPair}`);
  const uPace = seededUnitFloat(`${tournamentId}::r${round}::pace::${canonicalPair}`);
  const uSeat = seededUnitFloat(`${tournamentId}::r${round}::seat::${canonicalPair}`);

  const expectedA = 1 / (1 + Math.pow(10, (eloB - eloA) / 400));
  const drawProb = 0.03; // Rare round-bell technical draw
  const winProbA = expectedA * (1 - drawProb);
  const turns = 4 + Math.floor(uTurns * 5); // 4..8 rounds

  // Realistic human cadence: 4..9s seating + ~42..60s per full round (capped safely inside playWindowMs)
  const seatOffsetMs = Math.round((4 + uSeat * 5) * 1000);
  const secPerRound = 41 + uPace * 19; // 41..60s per full round (2 turns)
  const maxPlaySpanMs = Math.max(90_000, playWindowMs - 16_000);
  const rawDurationMs = Math.round(turns * secPerRound * 1000);
  const clampedDurationMs = Math.min(maxPlaySpanMs - seatOffsetMs, Math.max(150_000, rawDurationMs));
  const matchStartMs = roundStartMs + seatOffsetMs;
  const matchFinishMs =
    uOutcome >= winProbA && uOutcome < winProbA + drawProb
      ? roundStartMs + maxPlaySpanMs
      : matchStartMs + clampedDurationMs;

  if (uOutcome < winProbA) {
    const hp = 6 + Math.floor(uMargin * 22);
    return { result: 'A_WIN', hpDiffA: hp, turns, matchStartMs, matchFinishMs };
  }
  if (uOutcome < winProbA + drawProb) {
    return { result: 'DRAW', hpDiffA: 0, turns: 8, matchStartMs, matchFinishMs };
  }
  const hp = 6 + Math.floor(uMargin * 22);
  return { result: 'B_WIN', hpDiffA: -hp, turns, matchStartMs, matchFinishMs };
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
  const ordered = [...eligible].sort((x, y) => {
    if (y.points !== x.points) return y.points - x.points;
    if (y.eloRating !== x.eloRating) return y.eloRating - x.eloRating;
    const jx = hashSeed(`${def.id}::r${round}::seed::${x.participantId}`);
    const jy = hashSeed(`${def.id}::r${round}::seed::${y.participantId}`);
    return jx - jy;
  });

  const used = new Set<string>();
  const pairs: Array<{ a: ComputedTournamentStanding; b: ComputedTournamentStanding | null }> = [];

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

    let bestIdx = -1;
    for (let j = i + 1; j < ordered.length; j += 1) {
      const pB = ordered[j];
      if (used.has(pB.participantId)) continue;
      if (!pA.opponentIds.includes(pB.participantId)) {
        bestIdx = j;
        break;
      }
    }
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

function pickMidRoundSovereignChallenger(
  def: SwissTournamentDefinition,
  round: number,
  challengerTarget: ComputedTournamentStanding,
  allSovereigns: ComputedTournamentStanding[]
): ComputedTournamentStanding {
  const candidates = allSovereigns
    .filter((s) => !challengerTarget.opponentIds.includes(s.participantId))
    .sort((x, y) => {
      const scDiffX = Math.abs(x.points - challengerTarget.points);
      const scDiffY = Math.abs(y.points - challengerTarget.points);
      if (scDiffX !== scDiffY) return scDiffX - scDiffY;
      const eloDiffX = Math.abs(x.eloRating - challengerTarget.eloRating);
      const eloDiffY = Math.abs(y.eloRating - challengerTarget.eloRating);
      if (eloDiffX !== eloDiffY) return eloDiffX - eloDiffY;
      return x.participantId.localeCompare(y.participantId);
    });
  const pool = candidates.slice(0, Math.min(5, candidates.length));
  if (pool.length === 0) return allSovereigns[0];
  const idx = hashSeed(`${def.id}::late::r${round}::${challengerTarget.participantId}`) % pool.length;
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
  const targetRarity = prizeSpec.kind === 'unowned_domain_legendary_card' ? 'legendary' : 'rare';

  let pool: CardDefinition[] = ALL_CARDS.filter(
    (c) => c.rarity === targetRarity && c.domain === primaryDomain && !ownedSet.has(c.id)
  );
  if (pool.length === 0) {
    pool = ALL_CARDS.filter((c) => c.rarity === targetRarity && c.domain === primaryDomain);
  }
  if (pool.length === 0) {
    pool = ALL_CARDS.filter((c) => c.rarity === targetRarity && !ownedSet.has(c.id));
  }

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
    cardId:
      prizeSpec.kind === 'gold_and_shards'
        ? undefined
        : chosenCard?.id,
    cardName:
      prizeSpec.kind === 'gold_and_shards'
        ? undefined
        : chosenCard?.name,
    goldBonus: prizeSpec.goldBonus ?? 0,
    shardsBonus: prizeSpec.shardsBonus ?? 0,
    cashBrl: prizeSpec.cashBrl,
    awardedAtMs,
  };
}

function sanitizeLegacyNonDiegeticDescription(desc: string): string {
  return desc
    .replace(/ao jogador humano melhor classificado/gi, 'ao Campeão da edição')
    .replace(/do melhor jogador humano/gi, 'do Campeão da edição')
    .replace(/do jogador humano melhor qualificado/gi, 'do Campeão da edição')
    .replace(/ao campeão humano/gi, 'ao Campeão');
}

export function computeTournamentSnapshot(
  rawDef: SwissTournamentDefinition,
  humanEntries: HumanTournamentEntry[],
  currentUsername?: string | null,
  explicitNowMs?: number
): ComputedTournamentSnapshot {
  const nowMs = explicitNowMs ?? getTournamentNowMs();
  const def: SwissTournamentDefinition = {
    ...rawDef,
    prizeSpec: {
      ...rawDef.prizeSpec,
      description: sanitizeLegacyNonDiegeticDescription(rawDef.prizeSpec.description),
    },
  };

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

  const participantMap = new Map<string, ComputedTournamentStanding>();

  if (def.includeAllSovereigns) {
    for (const sov of SOVEREIGN_AI_LEADERBOARD_ROSTER) {
      const pid = `sov::${sov.sovereignId}`;
      const shortRealm = sov.realmOrigin.split(/\s*[—•·]\s*/)[0]?.trim() || sov.realmOrigin;
      participantMap.set(pid, {
        participantId: pid,
        kind: 'sovereign',
        rank: 0,
        displayName: sov.sovereignName,
        subtitle: shortRealm,
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
        matchHistory: [],
        sovereignEntry: sov,
      });
    }
  }

  for (const hum of uniqueHumans) {
    const pid = `hum::${hum.username.trim().toLowerCase()}`;
    const shortHumSub = (hum.deckName || hum.title || '')
      .split(/\s*[—•·]\s*/)[0]
      ?.trim();
    participantMap.set(pid, {
      participantId: pid,
      kind: 'human',
      rank: 0,
      displayName: hum.username,
      subtitle: shortHumSub || hum.title,
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
      matchHistory: [],
      humanEntry: hum,
    });
  }

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

  const roundsPairings: Record<number, ComputedRoundPairing[]> = {};
  const cleanCurrentUser = (currentUsername || '').trim().toLowerCase();
  const myPid = cleanCurrentUser ? `hum::${cleanCurrentUser}` : '';

  for (let r = 1; r <= currentRound; r += 1) {
    const rWin = getRoundWindowTimestamps(def, r);
    const isPastDeadline = nowMs >= rWin.playDeadlineMs || phase === 'finished';

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

    const recordCompletedMatch = (
      st: ComputedTournamentStanding,
      opp: ComputedTournamentStanding | null,
      tNum: number,
      pts: 1 | 0.5 | 0,
      hpDelta: number,
      turns: number,
      explicitOutcome?: ParticipantRoundHistoryItem['outcome'],
      matchStartMs?: number,
      matchFinishMs?: number
    ) => {
      st.points += pts;
      st.hpDiff += hpDelta;
      st.roundsPlayed += 1;
      const oppId = opp ? opp.participantId : '__BYE__';
      st.opponentIds.push(oppId);
      if (pts === 1) st.wins += 1;
      else if (pts === 0.5) st.draws += 1;
      else st.losses += 1;

      const outcome: ParticipantRoundHistoryItem['outcome'] =
        explicitOutcome ??
        (!opp ? 'BYE' : pts === 1 ? 'WIN' : pts === 0.5 ? 'DRAW' : 'LOSS');

      st.matchHistory.push({
        round: r,
        tableNumber: tNum,
        opponentId: oppId,
        opponentName: opp ? opp.displayName : 'Bye Suíço',
        opponentSubtitle: opp ? opp.subtitle : 'Folga regulamentar (+1,0 pt)',
        opponentAvatarCardId: opp ? opp.avatarCardId : 'neutral_10_valkyra_pentacromatica',
        opponentPrimaryDomain: opp ? opp.primaryDomain : 'neutral',
        opponentElo: opp ? opp.eloRating : st.eloRating,
        opponentFinalRank: 0,
        opponentFinalPoints: 0,
        outcome,
        scoreEarned: pts,
        cumulativePoints: st.points,
        hpDiff: hpDelta,
        turns,
        matchStartMs,
        matchFinishMs,
      });
    };

    const recordInProgressMatch = (
      st: ComputedTournamentStanding,
      opp: ComputedTournamentStanding,
      tNum: number,
      liveTurnEstimate?: number,
      matchStartMs?: number,
      matchFinishMs?: number
    ) => {
      st.matchHistory.push({
        round: r,
        tableNumber: tNum,
        opponentId: opp.participantId,
        opponentName: opp.displayName,
        opponentSubtitle: opp.subtitle,
        opponentAvatarCardId: opp.avatarCardId,
        opponentPrimaryDomain: opp.primaryDomain,
        opponentElo: opp.eloRating,
        opponentFinalRank: 0,
        opponentFinalPoints: 0,
        outcome: 'IN_PROGRESS',
        scoreEarned: 0,
        cumulativePoints: st.points,
        hpDiff: 0,
        turns: 0,
        liveTurnEstimate,
        matchStartMs,
        matchFinishMs,
      });
    };

    for (const pair of rawPairs) {
      const { a, b } = pair;
      const currentTable = tableNum++;
      const ptsBeforeA = a.points;
      const ptsBeforeB = b ? b.points : 0;

      if (!b) {
        recordCompletedMatch(a, null, currentTable, 1, 10, 0, 'BYE');
        roundPairings.push({
          tableNumber: currentTable,
          round: r,
          playerA: { ...a },
          playerB: null,
          pointsBeforeA: ptsBeforeA,
          pointsBeforeB: 0,
          result: 'BYE',
          hpDiffA: 10,
          turns: 0,
          isHumanTable: a.kind === 'human',
          isMyTable: Boolean(myPid && a.participantId === myPid),
        });
        continue;
      }

      const isHumanTable = a.kind === 'human' || b.kind === 'human';
      const isMyTable = Boolean(
        myPid && (a.participantId === myPid || b.participantId === myPid)
      );

      if (!isHumanTable) {
        const res = resolveSovereignVsSovereignMatch(
          def.id,
          r,
          a.participantId,
          a.eloRating,
          b.participantId,
          b.eloRating,
          rWin.startMs,
          def.playWindowMs
        );
        const isStillPlayingLive =
          r === currentRound &&
          phase === 'round_active' &&
          nowMs < res.matchFinishMs;

        if (isStillPlayingLive) {
          const span = Math.max(1, res.matchFinishMs - res.matchStartMs);
          const prog = Math.max(0, Math.min(0.99, (nowMs - res.matchStartMs) / span));
          const liveTurn = Math.max(1, Math.min(res.turns, Math.floor(prog * res.turns) + 1));
          recordInProgressMatch(
            a,
            b,
            currentTable,
            liveTurn,
            res.matchStartMs,
            res.matchFinishMs
          );
          recordInProgressMatch(
            b,
            a,
            currentTable,
            liveTurn,
            res.matchStartMs,
            res.matchFinishMs
          );
          roundPairings.push({
            tableNumber: currentTable,
            round: r,
            playerA: { ...a },
            playerB: { ...b },
            pointsBeforeA: ptsBeforeA,
            pointsBeforeB: ptsBeforeB,
            result: 'IN_PROGRESS',
            hpDiffA: 0,
            turns: 0,
            liveTurnEstimate: liveTurn,
            matchStartMs: res.matchStartMs,
            matchFinishMs: res.matchFinishMs,
            canonicalResult: res.result,
            canonicalHpDiffA: res.hpDiffA,
            canonicalTurns: res.turns,
            isHumanTable: false,
            isMyTable: false,
          });
        } else {
          if (res.result === 'A_WIN') {
            recordCompletedMatch(
              a,
              b,
              currentTable,
              1,
              res.hpDiffA,
              res.turns,
              undefined,
              res.matchStartMs,
              res.matchFinishMs
            );
            recordCompletedMatch(
              b,
              a,
              currentTable,
              0,
              -res.hpDiffA,
              res.turns,
              undefined,
              res.matchStartMs,
              res.matchFinishMs
            );
          } else if (res.result === 'B_WIN') {
            recordCompletedMatch(
              a,
              b,
              currentTable,
              0,
              res.hpDiffA,
              res.turns,
              undefined,
              res.matchStartMs,
              res.matchFinishMs
            );
            recordCompletedMatch(
              b,
              a,
              currentTable,
              1,
              -res.hpDiffA,
              res.turns,
              undefined,
              res.matchStartMs,
              res.matchFinishMs
            );
          } else {
            recordCompletedMatch(
              a,
              b,
              currentTable,
              0.5,
              0,
              res.turns,
              undefined,
              res.matchStartMs,
              res.matchFinishMs
            );
            recordCompletedMatch(
              b,
              a,
              currentTable,
              0.5,
              0,
              res.turns,
              undefined,
              res.matchStartMs,
              res.matchFinishMs
            );
          }
          roundPairings.push({
            tableNumber: currentTable,
            round: r,
            playerA: { ...a },
            playerB: { ...b },
            pointsBeforeA: ptsBeforeA,
            pointsBeforeB: ptsBeforeB,
            result: res.result,
            hpDiffA: res.hpDiffA,
            turns: res.turns,
            matchStartMs: res.matchStartMs,
            matchFinishMs: res.matchFinishMs,
            canonicalResult: res.result,
            canonicalHpDiffA: res.hpDiffA,
            canonicalTurns: res.turns,
            isHumanTable: false,
            isMyTable: false,
          });
        }
      } else if (a.kind === 'human' && b.kind === 'human') {
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
          recordCompletedMatch(a, b, currentTable, recA.score, recA.hpDiff, recA.turns);
          recordCompletedMatch(b, a, currentTable, ptsB, -recA.hpDiff, recA.turns);
          roundPairings.push({
            tableNumber: currentTable,
            round: r,
            playerA: { ...a },
            playerB: { ...b },
            pointsBeforeA: ptsBeforeA,
            pointsBeforeB: ptsBeforeB,
            result: recA.score === 1 ? 'A_WIN' : recA.score === 0 ? 'B_WIN' : 'DRAW',
            hpDiffA: recA.hpDiff,
            turns: recA.turns,
            roomCode,
            isHumanTable: true,
            isMyTable,
          });
        } else if (recB) {
          const ptsA: 1 | 0.5 | 0 = recB.score === 1 ? 0 : recB.score === 0 ? 1 : 0.5;
          recordCompletedMatch(a, b, currentTable, ptsA, -recB.hpDiff, recB.turns);
          recordCompletedMatch(b, a, currentTable, recB.score, recB.hpDiff, recB.turns);
          roundPairings.push({
            tableNumber: currentTable,
            round: r,
            playerA: { ...a },
            playerB: { ...b },
            pointsBeforeA: ptsBeforeA,
            pointsBeforeB: ptsBeforeB,
            result: ptsA === 1 ? 'A_WIN' : ptsA === 0 ? 'B_WIN' : 'DRAW',
            hpDiffA: -recB.hpDiff,
            turns: recB.turns,
            roomCode,
            isHumanTable: true,
            isMyTable,
          });
        } else if (isPastDeadline) {
          const aStarted = a.humanEntry?.activeRoundStarted === r;
          const bStarted = b.humanEntry?.activeRoundStarted === r;
          if (aStarted && !bStarted) {
            recordCompletedMatch(a, b, currentTable, 1, 15, 0);
            recordCompletedMatch(b, a, currentTable, 0, -15, 0);
            roundPairings.push({
              tableNumber: currentTable,
              round: r,
              playerA: { ...a },
              playerB: { ...b },
              pointsBeforeA: ptsBeforeA,
              pointsBeforeB: ptsBeforeB,
              result: 'A_WIN',
              hpDiffA: 15,
              turns: 0,
              roomCode,
              isHumanTable: true,
              isMyTable,
            });
          } else if (bStarted && !aStarted) {
            recordCompletedMatch(a, b, currentTable, 0, -15, 0);
            recordCompletedMatch(b, a, currentTable, 1, 15, 0);
            roundPairings.push({
              tableNumber: currentTable,
              round: r,
              playerA: { ...a },
              playerB: { ...b },
              pointsBeforeA: ptsBeforeA,
              pointsBeforeB: ptsBeforeB,
              result: 'B_WIN',
              hpDiffA: -15,
              turns: 0,
              roomCode,
              isHumanTable: true,
              isMyTable,
            });
          } else {
            recordCompletedMatch(a, b, currentTable, 0, 0, 0, 'LOSS');
            recordCompletedMatch(b, a, currentTable, 0, 0, 0, 'LOSS');
            roundPairings.push({
              tableNumber: currentTable,
              round: r,
              playerA: { ...a },
              playerB: { ...b },
              pointsBeforeA: ptsBeforeA,
              pointsBeforeB: ptsBeforeB,
              result: 'DRAW',
              hpDiffA: 0,
              turns: 0,
              roomCode,
              isHumanTable: true,
              isMyTable,
            });
          }
        } else {
          recordInProgressMatch(a, b, currentTable);
          recordInProgressMatch(b, a, currentTable);
          roundPairings.push({
            tableNumber: currentTable,
            round: r,
            playerA: { ...a },
            playerB: { ...b },
            pointsBeforeA: ptsBeforeA,
            pointsBeforeB: ptsBeforeB,
            result: 'IN_PROGRESS',
            hpDiffA: 0,
            turns: 0,
            roomCode,
            isHumanTable: true,
            isMyTable,
          });
        }
      } else {
        const hum = a.kind === 'human' ? a : b;
        const sov = a.kind === 'sovereign' ? a : b;
        const humIsA = a.kind === 'human';
        const rec = hum.humanEntry?.resultsByRound?.[r];

        if (rec) {
          const sovScore: 1 | 0.5 | 0 =
            rec.score === 1 ? 0 : rec.score === 0 ? 1 : 0.5;
          recordCompletedMatch(hum, sov, currentTable, rec.score, rec.hpDiff, rec.turns);
          recordCompletedMatch(sov, hum, currentTable, sovScore, -rec.hpDiff, rec.turns);
          const resultCode =
            rec.score === 0.5
              ? 'DRAW'
              : (rec.score === 1) === humIsA
              ? 'A_WIN'
              : 'B_WIN';
          roundPairings.push({
            tableNumber: currentTable,
            round: r,
            playerA: { ...a },
            playerB: { ...b },
            pointsBeforeA: ptsBeforeA,
            pointsBeforeB: ptsBeforeB,
            result: resultCode,
            hpDiffA: humIsA ? rec.hpDiff : -rec.hpDiff,
            turns: rec.turns,
            isHumanTable: true,
            isMyTable,
          });
        } else if (isPastDeadline) {
          recordCompletedMatch(hum, sov, currentTable, 0, -20, 0);
          recordCompletedMatch(sov, hum, currentTable, 1, 20, 0);
          roundPairings.push({
            tableNumber: currentTable,
            round: r,
            playerA: { ...a },
            playerB: { ...b },
            pointsBeforeA: ptsBeforeA,
            pointsBeforeB: ptsBeforeB,
            result: humIsA ? 'B_WIN' : 'A_WIN',
            hpDiffA: humIsA ? -20 : 20,
            turns: 0,
            isHumanTable: true,
            isMyTable,
          });
        } else {
          recordInProgressMatch(hum, sov, currentTable);
          recordInProgressMatch(sov, hum, currentTable);
          roundPairings.push({
            tableNumber: currentTable,
            round: r,
            playerA: { ...a },
            playerB: { ...b },
            pointsBeforeA: ptsBeforeA,
            pointsBeforeB: ptsBeforeB,
            result: 'IN_PROGRESS',
            hpDiffA: 0,
            turns: 0,
            isHumanTable: true,
            isMyTable,
          });
        }
      }
    }

    for (const lateHum of midRoundHumans) {
      const currentTable = tableNum++;
      const ptsBeforeA = lateHum.points;
      const challenger = pickMidRoundSovereignChallenger(
        def,
        r,
        lateHum,
        allSovStandings
      );
      const ptsBeforeB = challenger.points;
      const isMyTable = Boolean(myPid && lateHum.participantId === myPid);
      const rec = lateHum.humanEntry?.resultsByRound?.[r];

      if (rec) {
        recordCompletedMatch(lateHum, challenger, currentTable, rec.score, rec.hpDiff, rec.turns);
        roundPairings.push({
          tableNumber: currentTable,
          round: r,
          playerA: { ...lateHum },
          playerB: { ...challenger },
          pointsBeforeA: ptsBeforeA,
          pointsBeforeB: ptsBeforeB,
          result:
            rec.score === 1 ? 'A_WIN' : rec.score === 0 ? 'B_WIN' : 'DRAW',
          hpDiffA: rec.hpDiff,
          turns: rec.turns,
          isHumanTable: true,
          isMyTable,
        });
      } else if (isPastDeadline) {
        recordCompletedMatch(lateHum, challenger, currentTable, 0, -20, 0);
        roundPairings.push({
          tableNumber: currentTable,
          round: r,
          playerA: { ...lateHum },
          playerB: { ...challenger },
          pointsBeforeA: ptsBeforeA,
          pointsBeforeB: ptsBeforeB,
          result: 'B_WIN',
          hpDiffA: -20,
          turns: 0,
          isHumanTable: true,
          isMyTable,
        });
      } else {
        recordInProgressMatch(lateHum, challenger, currentTable);
        roundPairings.push({
          tableNumber: currentTable,
          round: r,
          playerA: { ...lateHum },
          playerB: { ...challenger },
          pointsBeforeA: ptsBeforeA,
          pointsBeforeB: ptsBeforeB,
          result: 'IN_PROGRESS',
          hpDiffA: 0,
          turns: 0,
          isHumanTable: true,
          isMyTable,
        });
      }
    }

    roundsPairings[r] = roundPairings;
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

  const rankLookup = new Map(standings.map((s) => [s.participantId, s]));

  // Backfill opponentFinalRank & opponentFinalPoints into every participant's matchHistory
  for (const st of standings) {
    for (const item of st.matchHistory) {
      if (item.opponentId === '__BYE__') continue;
      const opp = rankLookup.get(item.opponentId);
      if (opp) {
        item.opponentFinalRank = opp.rank;
        item.opponentFinalPoints = opp.points;
      }
    }
  }

  // Refresh playerA/playerB standings inside EVERY round's pairings, keeping authentic Swiss table order (#1, #2, #3...)
  for (const rKey of Object.keys(roundsPairings)) {
    const rNum = Number(rKey);
    roundsPairings[rNum] = roundsPairings[rNum]
      .map((p) => ({
        ...p,
        playerA: rankLookup.get(p.playerA.participantId) ?? p.playerA,
        playerB: p.playerB
          ? rankLookup.get(p.playerB.participantId) ?? p.playerB
          : null,
      }))
      .sort((x, y) => x.tableNumber - y.tableNumber);
  }

  const currentRoundPairings = roundsPairings[currentRound] ?? [];
  const myStanding = myPid ? rankLookup.get(myPid) ?? null : null;
  const myEntry = myStanding?.humanEntry ?? null;
  const myCurrentPairing = myPid
    ? currentRoundPairings.find(
        (p) =>
          p.playerA.participantId === myPid ||
          p.playerB?.participantId === myPid
      ) ?? null
    : null;

  let roundStartsAtMs = def.startsAtMs;
  let roundPlayDeadlineMs = def.startsAtMs + def.playWindowMs;
  let roundEndsAtMs = def.startsAtMs + def.roundDurationMs;
  if (currentRound >= 1 && currentRound <= def.totalRounds) {
    const rw = getRoundWindowTimestamps(def, currentRound);
    roundStartsAtMs = rw.startMs;
    roundPlayDeadlineMs = rw.playDeadlineMs;
    roundEndsAtMs = rw.endMs;
  }

  // Automatic Prize Resolution once Tournament is Finished (Champion #1 receives the Champion Prize)
  let finalizedAward: TournamentAwardedPrize | null = def.finalizedAward ?? null;
  if (phase === 'finished' && !finalizedAward) {
    const champion = standings[0];
    if (champion && champion.kind === 'human' && champion.humanEntry) {
      finalizedAward = resolveUnownedDomainRareCardPrize(
        def.id,
        champion.humanEntry,
        champion.rank,
        champion.points,
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
    roundsPairings,
    myEntry,
    myStanding,
    myCurrentPairing,
    humanEntrantsCount: uniqueHumans.length,
    totalParticipantsCount: standings.length,
    finalizedAward,
  };
}

// ============================================================================
// 7. SUPABASE CLOUD PERSISTENCE & MULTI-TOURNAMENT CATALOG CACHE
// ============================================================================

const LOCAL_TOURNAMENT_CATALOG_KEY = 'chromatic_pact_tournament_catalog_v4';
const LOCAL_TOURNAMENT_ENTRIES_KEY = 'chromatic_pact_tournament_entries_v2';
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

function readLocalCatalogCache(): {
  defs: SwissTournamentDefinition[];
  entries: HumanTournamentEntry[];
} {
  let defs: SwissTournamentDefinition[] = [DEFAULT_INAUGURAL_TOURNAMENT];
  let entries: HumanTournamentEntry[] = [];
  if (typeof window === 'undefined') return { defs, entries };
  try {
    const rawDefs = localStorage.getItem(LOCAL_TOURNAMENT_CATALOG_KEY);
    if (rawDefs) {
      const parsed = JSON.parse(rawDefs) as SwissTournamentDefinition[];
      if (Array.isArray(parsed) && parsed.length > 0) defs = parsed;
    }
    const rawEntries = localStorage.getItem(LOCAL_TOURNAMENT_ENTRIES_KEY);
    if (rawEntries) {
      const parsedE = JSON.parse(rawEntries) as HumanTournamentEntry[];
      if (Array.isArray(parsedE)) entries = parsedE;
    }
  } catch {
    // Ignore
  }
  return { defs, entries };
}

function saveLocalCatalogCache(
  defs: SwissTournamentDefinition[],
  entries: HumanTournamentEntry[]
): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_TOURNAMENT_CATALOG_KEY, JSON.stringify(defs));
    localStorage.setItem(LOCAL_TOURNAMENT_ENTRIES_KEY, JSON.stringify(entries));
  } catch {
    // Ignore
  }
}

function assembleCatalogFromRaw(
  cloudDefs: SwissTournamentDefinition[],
  allEntries: HumanTournamentEntry[],
  nowMs: number
): TournamentCatalogData {
  const defMap = new Map<string, SwissTournamentDefinition>();

  if (cloudDefs.length === 0) {
    defMap.set(DEFAULT_INAUGURAL_TOURNAMENT.id, DEFAULT_INAUGURAL_TOURNAMENT);
  }

  for (const sched of buildScheduledOfficialTournaments(nowMs)) {
    defMap.set(sched.id, sched);
  }

  for (const cd of cloudDefs) {
    if (cd && cd.id) {
      defMap.set(cd.id, {
        ...cd,
        prizeSpec: {
          ...cd.prizeSpec,
          description: sanitizeLegacyNonDiegeticDescription(cd.prizeSpec?.description ?? ''),
        },
      });
    }
  }

  const tournaments = Array.from(defMap.values()).sort((a, b) => {
    const aCat = nowMs >= a.startsAtMs && nowMs < a.endsAtMs ? 2 : nowMs < a.startsAtMs ? 1 : 0;
    const bCat = nowMs >= b.startsAtMs && nowMs < b.endsAtMs ? 2 : nowMs < b.startsAtMs ? 1 : 0;
    if (bCat !== aCat) return bCat - aCat;
    // Among upcoming: soonest first; among finished: most recent first
    if (aCat === 1) return a.startsAtMs - b.startsAtMs;
    return b.startsAtMs - a.startsAtMs;
  });

  const entriesByTournament: Record<string, HumanTournamentEntry[]> = {};
  for (const t of tournaments) {
    entriesByTournament[t.id] = [];
  }

  for (const entry of allEntries) {
    if (!entry?.tournamentId || !entry?.username) continue;
    if (!entriesByTournament[entry.tournamentId]) {
      entriesByTournament[entry.tournamentId] = [];
    }
    const list = entriesByTournament[entry.tournamentId];
    const clean = entry.username.trim().toLowerCase();
    const existingIdx = list.findIndex((x) => x.username.trim().toLowerCase() === clean);
    if (existingIdx === -1) {
      list.push(entry);
    } else if (
      Object.keys(entry.resultsByRound ?? {}).length >=
      Object.keys(list[existingIdx].resultsByRound ?? {}).length
    ) {
      list[existingIdx] = entry;
    }
  }

  const primaryTournamentId =
    tournaments[0]?.id ?? DEFAULT_INAUGURAL_TOURNAMENT.id;

  return {
    tournaments,
    entriesByTournament,
    primaryTournamentId,
  };
}

export function getInitialLocalTournamentCatalog(): TournamentCatalogData {
  const local = readLocalCatalogCache();
  return assembleCatalogFromRaw(local.defs, local.entries, getTournamentNowMs());
}

export async function publishTournamentDefinitionToCloud(
  def: SwissTournamentDefinition
): Promise<boolean> {
  const local = readLocalCatalogCache();
  const nextDefs = [...local.defs.filter((d) => d.id !== def.id), def];
  saveLocalCatalogCache(nextDefs, local.entries);

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
  const local = readLocalCatalogCache();
  const cleanUser = entry.username.trim().toLowerCase();
  const filtered = local.entries.filter(
    (e) =>
      !(
        e.tournamentId === entry.tournamentId &&
        e.username.trim().toLowerCase() === cleanUser
      )
  );
  saveLocalCatalogCache(local.defs, [...filtered, entry]);

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

export async function fetchTournamentCatalogFromCloud(): Promise<TournamentCatalogData> {
  const local = readLocalCatalogCache();
  const cfg = getSupabaseConfig();
  const now = getTournamentNowMs();

  if (!cfg.isConfigured) {
    return assembleCatalogFromRaw(local.defs, local.entries, now);
  }

  try {
    const res = await fetch(
      `${cfg.url}/rest/v1/sovereign_profiles?username=like.__tournament_*&select=username,title,updated_at&order=updated_at.desc&limit=300`,
      {
        headers: getHeaders(cfg.anonKey),
      }
    );
    updateServerClockOffsetFromHeader(res.headers.get('date'));
    const syncedNow = getTournamentNowMs();

    if (!res.ok) {
      return assembleCatalogFromRaw(local.defs, local.entries, syncedNow);
    }

    const rows = (await res.json()) as Array<{
      username: string;
      title: string;
      updated_at: string;
    }>;

    const cloudDefs: SwissTournamentDefinition[] = [];
    const cloudEntries: HumanTournamentEntry[] = [];

    for (const r of rows) {
      if (!r.username || !r.title) continue;
      if (r.username.startsWith(CLOUD_META_PREFIX)) {
        try {
          const parsed = JSON.parse(r.title) as SwissTournamentDefinition;
          if (parsed && parsed.id) cloudDefs.push(parsed);
        } catch {
          // Ignore malformed row
        }
      } else if (r.username.startsWith(CLOUD_ENTRY_PREFIX)) {
        try {
          const parsed = JSON.parse(r.title) as HumanTournamentEntry;
          if (parsed && parsed.tournamentId && parsed.username) {
            cloudEntries.push(parsed);
          }
        } catch {
          // Ignore malformed row
        }
      }
    }

    if (cloudDefs.length === 0) {
      void publishTournamentDefinitionToCloud(DEFAULT_INAUGURAL_TOURNAMENT);
    }

    // Merge optimistic local entries if newer/more rounds recorded
    const mergedEntries = [...cloudEntries];
    for (const loc of local.entries) {
      const idx = mergedEntries.findIndex(
        (e) =>
          e.tournamentId === loc.tournamentId &&
          e.username.trim().toLowerCase() === loc.username.trim().toLowerCase()
      );
      if (idx === -1) {
        mergedEntries.push(loc);
      } else if (
        Object.keys(loc.resultsByRound ?? {}).length >
        Object.keys(mergedEntries[idx].resultsByRound ?? {}).length
      ) {
        mergedEntries[idx] = loc;
      }
    }

    const catalog = assembleCatalogFromRaw(cloudDefs, mergedEntries, syncedNow);
    saveLocalCatalogCache(catalog.tournaments, mergedEntries);
    return catalog;
  } catch {
    return assembleCatalogFromRaw(local.defs, local.entries, now);
  }
}

export async function fetchActiveTournamentStateFromCloud(): Promise<{
  definition: SwissTournamentDefinition;
  entries: HumanTournamentEntry[];
}> {
  const catalog = await fetchTournamentCatalogFromCloud();
  const primary =
    catalog.tournaments.find((t) => t.id === catalog.primaryTournamentId) ??
    catalog.tournaments[0] ??
    DEFAULT_INAUGURAL_TOURNAMENT;
  return {
    definition: primary,
    entries: catalog.entriesByTournament[primary.id] ?? [],
  };
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

  // Ensure scheduled calendar tournament definition is persisted in Cloud on first enrollment
  void publishTournamentDefinitionToCloud(params.tournament);

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
 * Builds the symmetric 40 PV vs 40 PV encounter for a Swiss Tournament round.
 * Zero PvE passives, zero Overworld buffs — 100% symmetric tournament rules.
 */
export async function buildTournamentSovereignBossEncounter(
  sovereignEntry: SovereignAiLeaderboardEntry,
  round: number
): Promise<CampaignBoss> {
  const { buildRankedSovereignBossEncounter } = await import('../data/sovereignEloLadder');
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
