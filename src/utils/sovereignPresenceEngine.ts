import {
  SOVEREIGN_AI_LEADERBOARD_ROSTER,
  SovereignAiLeaderboardEntry,
} from '../data/sovereignEloLadderData';

/**
 * Cutoff timestamp (2026-11-03T21:30:00-03:00) preserving already-started/completed
 * tournaments and past rolling ledger buckets without altering historical standings.
 */
export const SOVEREIGN_PRESENCE_V2_CUTOFF_MS = Date.parse('2026-11-03T21:30:00-03:00');

export const TOURNAMENT_CONCENTRATION_LEAD_MS = 10 * 60_000; // 10 min before round 1
export const CHALLENGE_REFUSAL_COOLDOWN_MS = 4 * 60_000; // 4 min anti-spam pause
export const POST_MATCH_REVIEW_WINDOW_MS = 45_000; // 45s after leaving a match

const REFUSAL_COOLDOWN_STORAGE_KEY = 'chromatic_pact_sov_refusal_cd_v1';

export type SovereignPresenceStatus =
  | 'online_idle'
  | 'in_match'
  | 'in_tournament'
  | 'offline';

export interface TournamentCohortMetaInput {
  id: string;
  title: string;
  startsAtMs: number;
  endsAtMs: number;
  createdAtMs?: number;
  includeAllSovereigns?: boolean;
  isSpecialGrandCup?: boolean;
}

export interface SovereignTournamentRegistration {
  sovereign: SovereignAiLeaderboardEntry;
  enrolledAtMs: number;
}

export interface ActiveTournamentDutyInfo {
  tournamentId: string;
  tournamentTitle: string;
  startsAtMs: number;
  endsAtMs: number;
  isPreStartConcentration: boolean;
}

export interface SovereignRefusalCooldownEntry {
  untilMs: number;
  reason: string;
}

function hashPresenceSeed(input: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

function seededFloat(key: string): number {
  let x = hashPresenceSeed(key) || 1;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  return (x >>> 0) / 4294967296;
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

// ============================================================================
// 1. PARTIAL & GRADUAL TOURNAMENT COHORT ENGINE
// ============================================================================

const cohortCache = new Map<string, SovereignTournamentRegistration[]>();
const knownCustomTournaments = new Map<string, TournamentCohortMetaInput>();

export function registerKnownTournamentWindows(defs: TournamentCohortMetaInput[]): void {
  for (const d of defs) {
    if (!d?.id) continue;
    knownCustomTournaments.set(d.id, {
      id: d.id,
      title: d.title,
      startsAtMs: d.startsAtMs,
      endsAtMs: d.endsAtMs,
      createdAtMs: d.createdAtMs,
      includeAllSovereigns: d.includeAllSovereigns,
      isSpecialGrandCup: d.isSpecialGrandCup,
    });
  }
}

function isSpecialGrandCupTournament(meta: TournamentCohortMetaInput): boolean {
  if (meta.isSpecialGrandCup) return true;
  const hay = `${meta.id} ${meta.title}`.toLowerCase();
  return hay.includes('dominical') || hay.includes('domingo') || hay.includes('especial');
}

export function getFullTournamentSovereignCohort(
  meta: TournamentCohortMetaInput
): SovereignTournamentRegistration[] {
  if (meta.includeAllSovereigns === false) return [];

  const cached = cohortCache.get(meta.id);
  if (cached) return cached;

  const roster = SOVEREIGN_AI_LEADERBOARD_ROSTER;
  if (meta.startsAtMs <= SOVEREIGN_PRESENCE_V2_CUTOFF_MS) {
    const legacy = roster.map((sovereign) => ({
      sovereign,
      enrolledAtMs: meta.createdAtMs ?? meta.startsAtMs - 3 * 3600_000,
    }));
    cohortCache.set(meta.id, legacy);
    return legacy;
  }

  const seed = hashPresenceSeed(`sov_tourney_cohort_v2::${meta.id}`);
  const isSpecial = isSpecialGrandCupTournament(meta);
  const targetCount = isSpecial
    ? 64 + (seed % 33) // 64..96 Sovereigns in Grand Cups
    : 32 + (seed % 25); // 32..56 Sovereigns in Daily/Regular Swiss

  // Stratified across 4 ELO bands so every division has competitive representation
  const bandCount = 4;
  const bandSize = Math.ceil(roster.length / bandCount);
  const selected: SovereignAiLeaderboardEntry[] = [];
  const chosenIds = new Set<string>();

  for (let b = 0; b < bandCount; b += 1) {
    const slice = roster.slice(b * bandSize, (b + 1) * bandSize);
    const quota =
      b === bandCount - 1
        ? targetCount - selected.length
        : Math.round(targetCount / bandCount);

    const scored = slice
      .map((sov) => ({
        sov,
        score: seededFloat(`${meta.id}::band${b}::${sov.sovereignId}`),
      }))
      .sort((a, bItem) => a.score - bItem.score);

    for (let i = 0; i < Math.min(quota, scored.length); i += 1) {
      selected.push(scored[i].sov);
      chosenIds.add(scored[i].sov.sovereignId);
    }
  }

  if (selected.length < targetCount) {
    for (const sov of roster) {
      if (selected.length >= targetCount) break;
      if (!chosenIds.has(sov.sovereignId)) {
        selected.push(sov);
        chosenIds.add(sov.sovereignId);
      }
    }
  }

  const minCreatedFloor =
    meta.createdAtMs && meta.createdAtMs < meta.startsAtMs - 5 * 60_000
      ? meta.createdAtMs
      : meta.startsAtMs - 6 * 3600_000;

  const registrations: SovereignTournamentRegistration[] = selected.map((sovereign) => {
    const waveRoll = seededFloat(`${meta.id}::wave::${sovereign.sovereignId}`);
    const minRoll = seededFloat(`${meta.id}::min::${sovereign.sovereignId}`);

    // ~26% register early (1h30 to 4h30 before start), ~74% arrive progressively in the final 90 min
    const leadMinutes =
      waveRoll < 0.26
        ? 90 + Math.floor(minRoll * 180)
        : 1 + Math.floor(minRoll * 89);

    const rawEnrolledAt = meta.startsAtMs - leadMinutes * 60_000;
    const enrolledAtMs = Math.min(
      meta.startsAtMs - 45_000,
      Math.max(minCreatedFloor, rawEnrolledAt)
    );

    return { sovereign, enrolledAtMs };
  });

  registrations.sort((a, b) => a.enrolledAtMs - b.enrolledAtMs);
  cohortCache.set(meta.id, registrations);
  return registrations;
}

/**
 * Returns the Sovereigns already enrolled in `meta` at `nowMs`.
 * During `registration` (`nowMs < startsAtMs`), entrants grow organically over time;
 * once started (`nowMs >= startsAtMs`), the full cohort for that edition is locked in.
 */
export function getEnrolledTournamentSovereignsAt(
  meta: TournamentCohortMetaInput,
  nowMs: number
): SovereignAiLeaderboardEntry[] {
  const full = getFullTournamentSovereignCohort(meta);
  if (nowMs >= meta.startsAtMs || meta.startsAtMs <= SOVEREIGN_PRESENCE_V2_CUTOFF_MS) {
    return full.map((r) => r.sovereign);
  }
  return full.filter((r) => r.enrolledAtMs <= nowMs).map((r) => r.sovereign);
}

/**
 * Computes the deterministic recurring official tournament windows around `atMs`
 * plus any custom tournaments registered in memory, without circular imports.
 */
function getRelevantTournamentMetasNear(atMs: number): TournamentCohortMetaInput[] {
  const BRT_OFFSET_MS = -3 * 60 * 60 * 1000;
  const DAY_MS = 24 * 60 * 60 * 1000;
  const pad2 = (n: number) => String(n).padStart(2, '0');

  const out = new Map<string, TournamentCohortMetaInput>();
  const brtShifted = atMs + BRT_OFFSET_MS;
  const baseDayShifted = Math.floor(brtShifted / DAY_MS) * DAY_MS;

  for (let offset = -1; offset <= 1; offset += 1) {
    const dayShiftedMs = baseDayShifted + offset * DAY_MS;
    const d = new Date(dayShiftedMs);
    const yyyy = d.getUTCFullYear();
    const mm = pad2(d.getUTCMonth() + 1);
    const dd = pad2(d.getUTCDate());
    const dow = d.getUTCDay();
    const dateIsoPrefix = `${yyyy}-${mm}-${dd}`;
    if (dateIsoPrefix < '2026-11-02') continue;

    const isWeekend = dow === 0 || dow === 6;
    const isSunday = dow === 0;
    const startClockIso = isWeekend ? '14:00:00' : '19:00:00';
    const hourSlug = isWeekend ? '14h' : '19h';
    const startsAtMs = Date.parse(`${dateIsoPrefix}T${startClockIso}-03:00`);
    const endsAtMs = startsAtMs + 60 * 60_000;
    const id = `torneio_diario_vaeloria_${yyyy}_${mm}_${dd}_${hourSlug}`;

    out.set(id, {
      id,
      title: isSunday ? 'Grande Copa Dominical de Vaeloria' : 'Torneio Diário de Vaeloria',
      startsAtMs,
      endsAtMs,
      createdAtMs: Date.parse(`${dateIsoPrefix}T00:05:00-03:00`),
      includeAllSovereigns: true,
      isSpecialGrandCup: isSunday,
    });
  }

  for (const custom of knownCustomTournaments.values()) {
    if (
      custom.includeAllSovereigns !== false &&
      atMs >= custom.startsAtMs - 30 * 60_000 &&
      atMs <= custom.endsAtMs + 5 * 60_000
    ) {
      out.set(custom.id, custom);
    }
  }

  return Array.from(out.values());
}

/**
 * Returns all Sovereigns currently busy in (or in the 10-minute pre-start concentration of)
 * an active official tournament at `atMs`.
 */
export function getSovereignsBusyInTournamentAt(
  atMs: number
): Map<string, ActiveTournamentDutyInfo> {
  const busy = new Map<string, ActiveTournamentDutyInfo>();
  if (atMs <= SOVEREIGN_PRESENCE_V2_CUTOFF_MS) return busy;

  const candidates = getRelevantTournamentMetasNear(atMs);
  for (const meta of candidates) {
    const concStart = meta.startsAtMs - TOURNAMENT_CONCENTRATION_LEAD_MS;
    if (atMs >= concStart && atMs < meta.endsAtMs) {
      const cohort = getFullTournamentSovereignCohort(meta);
      const isPreStartConcentration = atMs < meta.startsAtMs;
      for (const item of cohort) {
        busy.set(item.sovereign.sovereignId, {
          tournamentId: meta.id,
          tournamentTitle: meta.title,
          startsAtMs: meta.startsAtMs,
          endsAtMs: meta.endsAtMs,
          isPreStartConcentration,
        });
      }
    }
  }
  return busy;
}

// ============================================================================
// 2. REALISTIC ONLINE DUTY ROTATION (~35% TO 45% ONLINE SIMULTANEOUSLY)
// ============================================================================

function getTargetOnlineDutyRatio(atMs: number): number {
  const BRT_OFFSET_MS = -3 * 60 * 60 * 1000;
  const brtDate = new Date(atMs + BRT_OFFSET_MS);
  const hour = brtDate.getUTCHours();

  // Natural daily rhythm in Brasília time: ~35% late night, ~39% morning, ~42% afternoon, ~45% evening
  if (hour >= 18 && hour <= 23) return 0.45;
  if (hour >= 12 && hour < 18) return 0.41;
  if (hour >= 7 && hour < 12) return 0.38;
  return 0.35;
}

/**
 * Deterministic, smooth session presence per Sovereign (~45–95 min online, ~75–125 min offline).
 * Synchronized across all clients via `atMs`.
 */
export function isSovereignOnlineAt(
  sovereignId: string,
  atMs: number,
  precomputedTourneyBusy?: Map<string, ActiveTournamentDutyInfo>
): boolean {
  const busyMap = precomputedTourneyBusy ?? getSovereignsBusyInTournamentAt(atMs);
  if (busyMap.has(sovereignId)) {
    return true;
  }

  const cycleMinutes = 132 + (hashPresenceSeed(`cycle_len::${sovereignId}`) % 84); // 132..215 min
  const cycleMs = cycleMinutes * 60_000;
  const phaseOffsetMs = hashPresenceSeed(`cycle_phase::${sovereignId}`) % cycleMs;

  const shifted = Math.max(0, atMs + phaseOffsetMs);
  const cycleIndex = Math.floor(shifted / cycleMs);
  const posRatio = (shifted % cycleMs) / cycleMs;

  const baseDuty = getTargetOnlineDutyRatio(atMs);
  const cycleJitter =
    ((hashPresenceSeed(`cycle_jit::${sovereignId}::${cycleIndex}`) % 9) - 4) * 0.01;
  const threshold = clamp(baseDuty + cycleJitter, 0.32, 0.48);

  return posRatio < threshold;
}

// ============================================================================
// 3. CHALLENGE REFUSAL & ANTI-SPAM COOLDOWN ENGINE
// ============================================================================

function readRefusalCooldownMap(): Record<string, SovereignRefusalCooldownEntry> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(REFUSAL_COOLDOWN_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, SovereignRefusalCooldownEntry>;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeRefusalCooldownMap(map: Record<string, SovereignRefusalCooldownEntry>): void {
  if (typeof window === 'undefined') return;
  try {
    const now = Date.now();
    const cleaned: Record<string, SovereignRefusalCooldownEntry> = {};
    for (const [k, v] of Object.entries(map)) {
      if (v && typeof v.untilMs === 'number' && v.untilMs > now) {
        cleaned[k] = v;
      }
    }
    window.localStorage.setItem(REFUSAL_COOLDOWN_STORAGE_KEY, JSON.stringify(cleaned));
  } catch {
    // ignore storage errors
  }
}

export function getActiveRefusalCooldowns(
  nowMs = Date.now()
): Record<string, SovereignRefusalCooldownEntry> {
  const map = readRefusalCooldownMap();
  const active: Record<string, SovereignRefusalCooldownEntry> = {};
  for (const [k, v] of Object.entries(map)) {
    if (v && v.untilMs > nowMs) {
      active[k] = v;
    }
  }
  return active;
}

export function clearExpiredRefusalCooldowns(): void {
  writeRefusalCooldownMap(readRefusalCooldownMap());
}

export interface EvaluateChallengeInviteParams {
  sovereign: SovereignAiLeaderboardEntry;
  playerElo: number;
  recentOpponentIds?: string[];
  justFinishedMatchAgoMs?: number | null;
  nowMs?: number;
}

export interface EvaluateChallengeInviteResult {
  accepted: boolean;
  refusalProbability: number;
  reason: string;
  cooldownUntilMs?: number;
}

export function evaluateSovereignChallengeInvite(
  params: EvaluateChallengeInviteParams
): EvaluateChallengeInviteResult {
  const nowMs = params.nowMs ?? Date.now();
  const activeCooldowns = getActiveRefusalCooldowns(nowMs);
  const existingCd = activeCooldowns[params.sovereign.sovereignId];
  if (existingCd) {
    return {
      accepted: false,
      refusalProbability: 1,
      reason: existingCd.reason,
      cooldownUntilMs: existingCd.untilMs,
    };
  }

  let prob = 0.12; // 12% baseline refusal on balanced fresh challenges

  const absEloGap = Math.abs(params.playerElo - params.sovereign.eloRating);
  const hasLargeEloGap = absEloGap > 350;
  if (absEloGap > 600) {
    prob += 0.25;
  } else if (absEloGap > 350) {
    prob += 0.15;
  }

  const recentList = (params.recentOpponentIds ?? []).slice(-6);
  const recentMatchesVsTarget = recentList.filter(
    (id) => id === params.sovereign.sovereignId
  ).length;
  if (recentMatchesVsTarget >= 2) {
    prob += 0.5;
  } else if (recentMatchesVsTarget === 1) {
    prob += 0.25;
  }

  const justLeftTable =
    typeof params.justFinishedMatchAgoMs === 'number' &&
    params.justFinishedMatchAgoMs >= 0 &&
    params.justFinishedMatchAgoMs < POST_MATCH_REVIEW_WINDOW_MS;
  if (justLeftTable) {
    prob += 0.1;
  }

  const refusalProbability = clamp(prob, 0.12, 0.78);
  const roll = Math.random();

  if (roll < refusalProbability) {
    const reason =
      recentMatchesVsTarget >= 1
        ? 'Já enfrentou você recentemente e preferiu buscar outros adversários agora.'
        : hasLargeEloGap
        ? 'Prefere enfrentar adversários mais próximos da própria divisão neste momento.'
        : justLeftTable
        ? 'Está revisando o grimório após encerrar a última partida.'
        : 'Optou por não aceitar desafios neste momento.';

    const untilMs = nowMs + CHALLENGE_REFUSAL_COOLDOWN_MS;
    const map = readRefusalCooldownMap();
    map[params.sovereign.sovereignId] = { untilMs, reason };
    writeRefusalCooldownMap(map);

    return {
      accepted: false,
      refusalProbability,
      reason,
      cooldownUntilMs: untilMs,
    };
  }

  return {
    accepted: true,
    refusalProbability,
    reason: '',
  };
}
