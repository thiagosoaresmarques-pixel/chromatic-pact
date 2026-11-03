import {
  SOVEREIGN_AI_LEADERBOARD_ROSTER,
  SovereignAiLeaderboardEntry,
} from '../data/sovereignEloLadderData';

export const ROLLING_TABLE_COUNT = 8;
export const ROLLING_CYCLE_MS = 132_000; // 2m 12s per table cycle
export const ROLLING_MATCH_SPAN_MS = 116_000; // ~1m 56s active play
export const ROLLING_STAGGER_MS = Math.floor(ROLLING_CYCLE_MS / ROLLING_TABLE_COUNT); // 16.5s stagger
const BUCKET_ALL_SLOTS_DONE_OFFSET_MS =
  (ROLLING_TABLE_COUNT - 1) * ROLLING_STAGGER_MS + ROLLING_MATCH_SPAN_MS;

const CLOUD_LIVE_ELO_ROW = '__sovereign_live_elo_v2__:global';
const LOCAL_LIVE_ELO_CACHE_KEY = 'chromatic_pact_sovereign_live_elo_v2';
const DEFAULT_SUPABASE_URL = 'https://hpsrvsjcenkvikmipgik.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_Uk8HZmNDvhNLHIaosigqfA_raWP3k9l';

const ARENA_K_FACTOR = 16;
const TOURNAMENT_K_FACTOR = 16;
const HUMAN_DUEL_SOVEREIGN_K_FACTOR = 16;
const INITIAL_BACKFILL_BUCKETS = 660; // ~24h of organic arena matches on cold genesis
const MAX_STEP_CATCHUP_BUCKETS = 1200; // bounded O(1) execution (< 2ms)
const RECENT_DELTA_WINDOW_MS = 15 * 60_000; // 15 minutes

// Compact tuple per sovereignId: [dEloFloat, addedWins, addedLosses]
export type SovereignDeltaTuple = [number, number, number];

export interface RecentSovereignEloEvent {
  id: string;
  delta: number;
  ts: number;
}

export interface CloudSovereignLiveLedger {
  version: 1;
  checkpointBucket: number;
  processedTournamentIds: string[];
  stats: Record<string, SovereignDeltaTuple>;
  recentEvents: RecentSovereignEloEvent[];
  updatedAtMs: number;
}

export interface DeterministicRollingMatchup {
  bucket: number;
  slotIdx: number;
  idxA: number;
  idxB: number;
  sovA: SovereignAiLeaderboardEntry;
  sovB: SovereignAiLeaderboardEntry;
  matchStartMs: number;
  matchFinishMs: number;
  canonicalWinner: 'A_WIN' | 'B_WIN';
}

export interface HydratedLiveSovereignResult {
  roster: SovereignAiLeaderboardEntry[];
  byId: Map<string, SovereignAiLeaderboardEntry>;
  recentDeltaById: Record<string, number>;
  lastUpdatedAtMs: number;
}

const BASE_INDEX_BY_ID = new Map<string, number>();
for (let i = 0; i < SOVEREIGN_AI_LEADERBOARD_ROSTER.length; i += 1) {
  BASE_INDEX_BY_ID.set(SOVEREIGN_AI_LEADERBOARD_ROSTER[i].sovereignId, i);
}

let inMemoryLedger: CloudSovereignLiveLedger | null = null;
let lastCloudFetchMs = 0;
let lastCloudWriteMs = 0;
let inflightCloudFetch: Promise<CloudSovereignLiveLedger> | null = null;

function resolveSupabaseCredentials(): { url: string; anonKey: string } {
  const envObj = (import.meta as unknown as { env?: Record<string, string> }).env;
  const procEnv =
    typeof process !== 'undefined' && process?.env
      ? (process.env as Record<string, string | undefined>)
      : undefined;

  let localUrl = '';
  let localKey = '';
  if (typeof localStorage !== 'undefined') {
    try {
      localUrl = localStorage.getItem('cp_mp_supabase_url') || '';
      localKey = localStorage.getItem('cp_mp_supabase_key') || '';
    } catch {
      // ignore storage errors
    }
  }

  const url = (
    localUrl ||
    envObj?.VITE_SUPABASE_URL ||
    procEnv?.VITE_SUPABASE_URL ||
    DEFAULT_SUPABASE_URL
  )
    .trim()
    .replace(/\/$/, '');

  const anonKey = (
    localKey ||
    envObj?.VITE_SUPABASE_ANON_KEY ||
    procEnv?.VITE_SUPABASE_ANON_KEY ||
    DEFAULT_SUPABASE_KEY
  ).trim();

  return { url, anonKey };
}

export function hashLiveEloSeed(input: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function round1(val: number): number {
  return Math.round(val * 10) / 10;
}

/**
 * Deterministic rolling matchup shared between Live Arena spectator tables
 * and the continuous Sovereign ELO ledger so every watched match moves real ELO.
 */
export function resolveDeterministicRollingMatchup(
  bucket: number,
  slotIdx: number
): DeterministicRollingMatchup | null {
  const roster = SOVEREIGN_AI_LEADERBOARD_ROSTER;
  if (roster.length < 2) return null;

  const slotOffset = slotIdx * ROLLING_STAGGER_MS;
  const matchStartMs = bucket * ROLLING_CYCLE_MS + slotOffset;
  const matchFinishMs = matchStartMs + ROLLING_MATCH_SPAN_MS;

  const seed = hashLiveEloSeed(`vaeloria_live_table_v1::b${bucket}::s${slotIdx}`);
  const poolCap = slotIdx % 2 === 0 ? Math.min(90, roster.length) : roster.length;
  const idxA = seed % poolCap;
  const sovA = roster[idxA];
  const domA = sovA.domains[0] ?? 'red';

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

  // Win probability calibrated to baseline ELO gap so expected drift is zero
  const expectedA = 1 / (1 + Math.pow(10, (sovB.eloRating - sovA.eloRating) / 400));
  const outcomeHash = hashLiveEloSeed(`vaeloria_live_outcome_v2::b${bucket}::s${slotIdx}`);
  const u = (outcomeHash % 100_000) / 100_000;
  const canonicalWinner: 'A_WIN' | 'B_WIN' = u < expectedA ? 'A_WIN' : 'B_WIN';

  return {
    bucket,
    slotIdx,
    idxA,
    idxB: bestIdxB,
    sovA,
    sovB,
    matchStartMs,
    matchFinishMs,
    canonicalWinner,
  };
}

function getFullyCompletedBucket(nowMs: number): number {
  return Math.floor((nowMs - BUCKET_ALL_SLOTS_DONE_OFFSET_MS) / ROLLING_CYCLE_MS);
}

function applyPairMatchToStats(
  stats: Record<string, SovereignDeltaTuple>,
  sovA: SovereignAiLeaderboardEntry,
  sovB: SovereignAiLeaderboardEntry,
  outcome: 'A_WIN' | 'B_WIN' | 'DRAW',
  kFactor: number
): { deltaIntA: number; deltaIntB: number } {
  const prevA = stats[sovA.sovereignId] ?? [0, 0, 0];
  const prevB = stats[sovB.sovereignId] ?? [0, 0, 0];

  const curEloA = sovA.eloRating + prevA[0];
  const curEloB = sovB.eloRating + prevB[0];

  const expA = 1 / (1 + Math.pow(10, (curEloB - curEloA) / 400));
  const scoreA = outcome === 'A_WIN' ? 1 : outcome === 'B_WIN' ? 0 : 0.5;

  const rawStepA = kFactor * (scoreA - expA);
  const rawStepB = -rawStepA;

  const nextDEloA = round1(prevA[0] + rawStepA);
  const nextDEloB = round1(prevB[0] + rawStepB);

  const beforeIntA = Math.round(sovA.eloRating + prevA[0]);
  const beforeIntB = Math.round(sovB.eloRating + prevB[0]);
  const afterIntA = Math.round(sovA.eloRating + nextDEloA);
  const afterIntB = Math.round(sovB.eloRating + nextDEloB);

  stats[sovA.sovereignId] = [
    nextDEloA,
    prevA[1] + (outcome === 'A_WIN' ? 1 : 0),
    prevA[2] + (outcome === 'B_WIN' ? 1 : 0),
  ];
  stats[sovB.sovereignId] = [
    nextDEloB,
    prevB[1] + (outcome === 'B_WIN' ? 1 : 0),
    prevB[2] + (outcome === 'A_WIN' ? 1 : 0),
  ];

  return {
    deltaIntA: afterIntA - beforeIntA,
    deltaIntB: afterIntB - beforeIntB,
  };
}

function createColdGenesisLedger(nowMs: number): CloudSovereignLiveLedger {
  const targetBucket = getFullyCompletedBucket(nowMs);
  const startBucket = targetBucket - INITIAL_BACKFILL_BUCKETS;
  const stats: Record<string, SovereignDeltaTuple> = {};

  for (let b = startBucket + 1; b <= targetBucket; b += 1) {
    for (let s = 0; s < ROLLING_TABLE_COUNT; s += 1) {
      const m = resolveDeterministicRollingMatchup(b, s);
      if (!m) continue;
      applyPairMatchToStats(stats, m.sovA, m.sovB, m.canonicalWinner, ARENA_K_FACTOR);
    }
  }

  return {
    version: 1,
    checkpointBucket: targetBucket,
    processedTournamentIds: [],
    stats,
    recentEvents: [],
    updatedAtMs: nowMs,
  };
}

function advanceLedgerToBucket(
  ledger: CloudSovereignLiveLedger,
  nowMs: number
): { nextLedger: CloudSovereignLiveLedger; didAdvance: boolean } {
  const targetBucket = getFullyCompletedBucket(nowMs);
  if (targetBucket <= ledger.checkpointBucket) {
    return { nextLedger: ledger, didAdvance: false };
  }

  const nextStats: Record<string, SovereignDeltaTuple> = {};
  for (const [k, v] of Object.entries(ledger.stats)) {
    nextStats[k] = [v[0], v[1], v[2]];
  }

  let fromBucket = ledger.checkpointBucket;
  const gap = targetBucket - fromBucket;
  if (gap > MAX_STEP_CATCHUP_BUCKETS) {
    const skippedBuckets = gap - MAX_STEP_CATCHUP_BUCKETS;
    const totalPlayerSlots = skippedBuckets * ROLLING_TABLE_COUNT * 2;
    const avgMatchesPerSovereign = Math.floor(
      totalPlayerSlots / Math.max(1, SOVEREIGN_AI_LEADERBOARD_ROSTER.length)
    );
    if (avgMatchesPerSovereign > 0) {
      for (const sov of SOVEREIGN_AI_LEADERBOARD_ROSTER) {
        const cur = nextStats[sov.sovereignId] ?? [0, 0, 0];
        const addWins = Math.round(avgMatchesPerSovereign * clamp(sov.simulatedWinRate, 0.35, 0.65));
        const addLosses = Math.max(0, avgMatchesPerSovereign - addWins);
        nextStats[sov.sovereignId] = [cur[0], cur[1] + addWins, cur[2] + addLosses];
      }
    }
    fromBucket = targetBucket - MAX_STEP_CATCHUP_BUCKETS;
  }

  for (let b = fromBucket + 1; b <= targetBucket; b += 1) {
    for (let s = 0; s < ROLLING_TABLE_COUNT; s += 1) {
      const m = resolveDeterministicRollingMatchup(b, s);
      if (!m) continue;
      applyPairMatchToStats(nextStats, m.sovA, m.sovB, m.canonicalWinner, ARENA_K_FACTOR);
    }
  }

  const cutoffMs = nowMs - 45 * 60_000;
  const prunedEvents = (ledger.recentEvents ?? []).filter((e) => e.ts >= cutoffMs).slice(-80);

  return {
    nextLedger: {
      version: 1,
      checkpointBucket: targetBucket,
      processedTournamentIds: (ledger.processedTournamentIds ?? []).slice(-60),
      stats: nextStats,
      recentEvents: prunedEvents,
      updatedAtMs: nowMs,
    },
    didAdvance: true,
  };
}

function readLocalCachedLedger(): CloudSovereignLiveLedger | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LOCAL_LIVE_ELO_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CloudSovereignLiveLedger;
    if (parsed && parsed.version === 1 && typeof parsed.checkpointBucket === 'number') {
      return parsed;
    }
  } catch {
    // ignore corrupt cache
  }
  return null;
}

function writeLocalCachedLedger(ledger: CloudSovereignLiveLedger): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_LIVE_ELO_CACHE_KEY, JSON.stringify(ledger));
  } catch {
    // ignore quota
  }
}

async function fetchLedgerFromSupabase(nowMs: number): Promise<CloudSovereignLiveLedger> {
  const { url, anonKey } = resolveSupabaseCredentials();
  try {
    const res = await fetch(
      `${url}/rest/v1/sovereign_profiles?username=eq.${encodeURIComponent(
        CLOUD_LIVE_ELO_ROW
      )}&select=title&limit=1`,
      {
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
        },
      }
    );
    if (res.ok) {
      const rows = (await res.json()) as Array<{ title?: string }>;
      if (rows[0]?.title) {
        const parsed = JSON.parse(rows[0].title) as CloudSovereignLiveLedger;
        if (parsed && parsed.version === 1 && typeof parsed.checkpointBucket === 'number') {
          return parsed;
        }
      }
    }
  } catch {
    // fallback to local or cold genesis
  }
  return inMemoryLedger ?? readLocalCachedLedger() ?? createColdGenesisLedger(nowMs);
}

async function persistLedgerToSupabase(
  ledger: CloudSovereignLiveLedger,
  force = false
): Promise<void> {
  const now = Date.now();
  if (!force && now - lastCloudWriteMs < 45_000) return;
  lastCloudWriteMs = now;

  const { url, anonKey } = resolveSupabaseCredentials();
  const baseHeaders: Record<string, string> = {
    apikey: anonKey,
    'Content-Type': 'application/json',
  };
  if (anonKey.startsWith('eyJ')) {
    baseHeaders.Authorization = `Bearer ${anonKey}`;
  }

  try {
    const rpcRes = await fetch(`${url}/rest/v1/rpc/rpc_upsert_system_record`, {
      method: 'POST',
      headers: baseHeaders,
      body: JSON.stringify({
        p_key: CLOUD_LIVE_ELO_ROW,
        p_payload: JSON.stringify(ledger),
        p_avatar_card_id: 'neutral_10_valkyra_pentacromatica',
        p_elo_rating: 1000,
        p_pvp_wins: 0,
        p_pvp_losses: 0,
      }),
    });
    if (rpcRes.status !== 404) return;

    await fetch(`${url}/rest/v1/sovereign_profiles?on_conflict=username`, {
      method: 'POST',
      headers: {
        ...baseHeaders,
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        username: CLOUD_LIVE_ELO_ROW,
        title: JSON.stringify(ledger),
        avatar_card_id: 'neutral_10_valkyra_pentacromatica',
        elo_rating: 1000,
        pvp_wins: 0,
        pvp_losses: 0,
        gold: 0,
        updated_at: new Date(now).toISOString(),
      }),
    });
  } catch {
    // silent network fallback
  }
}

function materializeLiveRoster(
  baseLedger: CloudSovereignLiveLedger,
  nowMs: number
): HydratedLiveSovereignResult {
  const { nextLedger } = advanceLedgerToBucket(baseLedger, nowMs);

  // Clone stats to apply partial buckets whose individual staggered tables ALREADY finished at `nowMs`
  const workingStats: Record<string, SovereignDeltaTuple> = {};
  for (const [k, v] of Object.entries(nextLedger.stats)) {
    workingStats[k] = [v[0], v[1], v[2]];
  }

  const recentDeltaById: Record<string, number> = {};
  const recentCutoffMs = nowMs - RECENT_DELTA_WINDOW_MS;

  // Compute recent deltas from completed buckets in the last 15 minutes
  const earliestRecentBucket = Math.floor((recentCutoffMs - ROLLING_MATCH_SPAN_MS) / ROLLING_CYCLE_MS);
  const currentMaxBucket = Math.floor(nowMs / ROLLING_CYCLE_MS);

  for (let b = Math.max(earliestRecentBucket, nextLedger.checkpointBucket - 8); b <= nextLedger.checkpointBucket; b += 1) {
    for (let s = 0; s < ROLLING_TABLE_COUNT; s += 1) {
      const m = resolveDeterministicRollingMatchup(b, s);
      if (!m || m.matchFinishMs < recentCutoffMs || m.matchFinishMs > nowMs) continue;
      const curA = m.sovA.eloRating + (workingStats[m.sovA.sovereignId]?.[0] ?? 0);
      const curB = m.sovB.eloRating + (workingStats[m.sovB.sovereignId]?.[0] ?? 0);
      const expA = 1 / (1 + Math.pow(10, (curB - curA) / 400));
      const scoreA = m.canonicalWinner === 'A_WIN' ? 1 : 0;
      const approxStepA = Math.round(ARENA_K_FACTOR * (scoreA - expA));
      const approxStepB = -approxStepA;
      if (approxStepA !== 0) {
        recentDeltaById[m.sovA.sovereignId] =
          (recentDeltaById[m.sovA.sovereignId] ?? 0) + approxStepA;
      }
      if (approxStepB !== 0) {
        recentDeltaById[m.sovB.sovereignId] =
          (recentDeltaById[m.sovB.sovereignId] ?? 0) + approxStepB;
      }
    }
  }

  // Apply finished slots in partial buckets (b > checkpointBucket where matchFinishMs <= nowMs)
  for (let b = nextLedger.checkpointBucket + 1; b <= currentMaxBucket; b += 1) {
    for (let s = 0; s < ROLLING_TABLE_COUNT; s += 1) {
      const m = resolveDeterministicRollingMatchup(b, s);
      if (!m || m.matchFinishMs > nowMs) continue;
      const { deltaIntA, deltaIntB } = applyPairMatchToStats(
        workingStats,
        m.sovA,
        m.sovB,
        m.canonicalWinner,
        ARENA_K_FACTOR
      );
      if (m.matchFinishMs >= recentCutoffMs) {
        if (deltaIntA !== 0) {
          recentDeltaById[m.sovA.sovereignId] =
            (recentDeltaById[m.sovA.sovereignId] ?? 0) + deltaIntA;
        }
        if (deltaIntB !== 0) {
          recentDeltaById[m.sovB.sovereignId] =
            (recentDeltaById[m.sovB.sovereignId] ?? 0) + deltaIntB;
        }
      }
    }
  }

  // Include recent human duels / tournament consolidations within the last 15 minutes
  for (const ev of nextLedger.recentEvents ?? []) {
    if (ev.ts >= recentCutoffMs && ev.delta !== 0) {
      recentDeltaById[ev.id] = (recentDeltaById[ev.id] ?? 0) + ev.delta;
    }
  }

  const byId = new Map<string, SovereignAiLeaderboardEntry>();
  const roster: SovereignAiLeaderboardEntry[] = SOVEREIGN_AI_LEADERBOARD_ROSTER.map((base) => {
    const tuple = workingStats[base.sovereignId];
    if (!tuple) {
      byId.set(base.sovereignId, base);
      return base;
    }
    const liveElo = Math.max(800, Math.round(base.eloRating + tuple[0]));
    const liveWins = base.simulatedWins + tuple[1];
    const liveLosses = base.simulatedLosses + tuple[2];
    const liveGames = liveWins + liveLosses;
    const liveWinRate = liveGames > 0 ? liveWins / liveGames : base.simulatedWinRate;

    const hydrated: SovereignAiLeaderboardEntry = {
      ...base,
      eloRating: liveElo,
      simulatedWins: liveWins,
      simulatedLosses: liveLosses,
      simulatedGames: liveGames,
      simulatedWinRate: liveWinRate,
    };
    byId.set(base.sovereignId, hydrated);
    return hydrated;
  });

  return {
    roster,
    byId,
    recentDeltaById,
    lastUpdatedAtMs: nowMs,
  };
}

/**
 * Synchronous accessor used by real-time arena feeds and UI components.
 */
export function getCachedHydratedLiveSovereignRoster(
  nowMs = Date.now()
): HydratedLiveSovereignResult {
  if (!inMemoryLedger) {
    inMemoryLedger = readLocalCachedLedger() ?? createColdGenesisLedger(nowMs);
  }
  return materializeLiveRoster(inMemoryLedger, nowMs);
}

/**
 * Cloud-synchronized live Sovereign roster. Advances completed arena buckets
 * and persists periodic checkpoints to Supabase (`__sovereign_live_elo_v1__:global`).
 */
export async function fetchHydratedLiveSovereignRoster(
  nowMs = Date.now(),
  forceCloudSync = false
): Promise<HydratedLiveSovereignResult> {
  if (forceCloudSync || !inMemoryLedger || nowMs - lastCloudFetchMs > 25_000) {
    if (!inflightCloudFetch) {
      inflightCloudFetch = fetchLedgerFromSupabase(nowMs).finally(() => {
        inflightCloudFetch = null;
      });
    }
    const fetched = await inflightCloudFetch;
    lastCloudFetchMs = nowMs;

    const { nextLedger, didAdvance } = advanceLedgerToBucket(fetched, nowMs);
    inMemoryLedger = nextLedger;
    writeLocalCachedLedger(nextLedger);
    if (didAdvance || forceCloudSync) {
      void persistLedgerToSupabase(nextLedger, forceCloudSync);
    }
  } else {
    const { nextLedger, didAdvance } = advanceLedgerToBucket(inMemoryLedger, nowMs);
    inMemoryLedger = nextLedger;
    if (didAdvance) {
      writeLocalCachedLedger(nextLedger);
      void persistLedgerToSupabase(nextLedger, false);
    }
  }

  return materializeLiveRoster(inMemoryLedger, nowMs);
}

/**
 * Records the real ELO & W/L impact on a Sovereign when a Human player finishes a Ranked Duel.
 */
export async function recordHumanVsSovereignLiveMatch(
  sovereignId: string,
  didHumanWin: boolean,
  humanOpponentElo: number
): Promise<void> {
  if (!BASE_INDEX_BY_ID.has(sovereignId)) return;
  const nowMs = Date.now();
  const base = SOVEREIGN_AI_LEADERBOARD_ROSTER[BASE_INDEX_BY_ID.get(sovereignId)!];
  const current = await fetchLedgerFromSupabase(nowMs);
  const { nextLedger } = advanceLedgerToBucket(current, nowMs);

  const prev = nextLedger.stats[sovereignId] ?? [0, 0, 0];
  const curSovElo = base.eloRating + prev[0];
  const expSov = 1 / (1 + Math.pow(10, (humanOpponentElo - curSovElo) / 400));
  const scoreSov = didHumanWin ? 0 : 1;
  const rawSovStep = HUMAN_DUEL_SOVEREIGN_K_FACTOR * (scoreSov - expSov);
  const beforeInt = Math.round(curSovElo);
  const nextDElo = round1(prev[0] + rawSovStep);
  const afterInt = Math.round(base.eloRating + nextDElo);
  const appliedInt = afterInt - beforeInt;

  nextLedger.stats[sovereignId] = [
    nextDElo,
    prev[1] + (didHumanWin ? 0 : 1),
    prev[2] + (didHumanWin ? 1 : 0),
  ];
  nextLedger.recentEvents = [
    ...(nextLedger.recentEvents ?? []).slice(-79),
    { id: sovereignId, delta: appliedInt, ts: nowMs },
  ];
  nextLedger.updatedAtMs = nowMs;

  inMemoryLedger = nextLedger;
  writeLocalCachedLedger(nextLedger);
  await persistLedgerToSupabase(nextLedger, true);
}

/**
 * Consolidates all finished matches of a Daily Swiss Tournament or Sunday Cup
 * idempotently into the global Sovereign ELO ledger.
 */
export async function consolidateFinishedSwissTournamentLiveElo(
  tournamentId: string,
  pairingsFlat: Array<{
    sovereignIdA?: string | null;
    sovereignIdB?: string | null;
    humanEloA?: number | null;
    humanEloB?: number | null;
    result: 'A_WIN' | 'B_WIN' | 'DRAW' | 'BYE' | 'IN_PROGRESS' | 'PENDING';
  }>
): Promise<boolean> {
  if (!tournamentId || pairingsFlat.length === 0) return false;
  if (inMemoryLedger?.processedTournamentIds?.includes(tournamentId)) return false;

  const nowMs = Date.now();
  const fetched = await fetchLedgerFromSupabase(nowMs);
  if (fetched.processedTournamentIds?.includes(tournamentId)) {
    inMemoryLedger = fetched;
    return false;
  }

  const { nextLedger } = advanceLedgerToBucket(fetched, nowMs);
  if (nextLedger.processedTournamentIds.includes(tournamentId)) return false;

  const netTourneyDelta: Record<string, number> = {};

  for (const p of pairingsFlat) {
    if (p.result !== 'A_WIN' && p.result !== 'B_WIN' && p.result !== 'DRAW') continue;

    const idxA = p.sovereignIdA ? BASE_INDEX_BY_ID.get(p.sovereignIdA) : undefined;
    const idxB = p.sovereignIdB ? BASE_INDEX_BY_ID.get(p.sovereignIdB) : undefined;

    if (idxA !== undefined && idxB !== undefined) {
      const sovA = SOVEREIGN_AI_LEADERBOARD_ROSTER[idxA];
      const sovB = SOVEREIGN_AI_LEADERBOARD_ROSTER[idxB];
      const { deltaIntA, deltaIntB } = applyPairMatchToStats(
        nextLedger.stats,
        sovA,
        sovB,
        p.result,
        TOURNAMENT_K_FACTOR
      );
      netTourneyDelta[sovA.sovereignId] = (netTourneyDelta[sovA.sovereignId] ?? 0) + deltaIntA;
      netTourneyDelta[sovB.sovereignId] = (netTourneyDelta[sovB.sovereignId] ?? 0) + deltaIntB;
    } else if (idxA !== undefined && typeof p.humanEloB === 'number') {
      const sovA = SOVEREIGN_AI_LEADERBOARD_ROSTER[idxA];
      const prev = nextLedger.stats[sovA.sovereignId] ?? [0, 0, 0];
      const curA = sovA.eloRating + prev[0];
      const expA = 1 / (1 + Math.pow(10, (p.humanEloB - curA) / 400));
      const scoreA = p.result === 'A_WIN' ? 1 : p.result === 'B_WIN' ? 0 : 0.5;
      const beforeInt = Math.round(curA);
      const nextDElo = round1(prev[0] + TOURNAMENT_K_FACTOR * (scoreA - expA));
      const afterInt = Math.round(sovA.eloRating + nextDElo);
      nextLedger.stats[sovA.sovereignId] = [
        nextDElo,
        prev[1] + (p.result === 'A_WIN' ? 1 : 0),
        prev[2] + (p.result === 'B_WIN' ? 1 : 0),
      ];
      netTourneyDelta[sovA.sovereignId] =
        (netTourneyDelta[sovA.sovereignId] ?? 0) + (afterInt - beforeInt);
    } else if (idxB !== undefined && typeof p.humanEloA === 'number') {
      const sovB = SOVEREIGN_AI_LEADERBOARD_ROSTER[idxB];
      const prev = nextLedger.stats[sovB.sovereignId] ?? [0, 0, 0];
      const curB = sovB.eloRating + prev[0];
      const expB = 1 / (1 + Math.pow(10, (p.humanEloA - curB) / 400));
      const scoreB = p.result === 'B_WIN' ? 1 : p.result === 'A_WIN' ? 0 : 0.5;
      const beforeInt = Math.round(curB);
      const nextDElo = round1(prev[0] + TOURNAMENT_K_FACTOR * (scoreB - expB));
      const afterInt = Math.round(sovB.eloRating + nextDElo);
      nextLedger.stats[sovB.sovereignId] = [
        nextDElo,
        prev[1] + (p.result === 'B_WIN' ? 1 : 0),
        prev[2] + (p.result === 'A_WIN' ? 1 : 0),
      ];
      netTourneyDelta[sovB.sovereignId] =
        (netTourneyDelta[sovB.sovereignId] ?? 0) + (afterInt - beforeInt);
    }
  }

  const tourneyEvents: RecentSovereignEloEvent[] = Object.entries(netTourneyDelta)
    .filter(([, d]) => d !== 0)
    .map(([id, delta]) => ({ id, delta, ts: nowMs }));

  nextLedger.processedTournamentIds = [
    ...nextLedger.processedTournamentIds.slice(-59),
    tournamentId,
  ];
  nextLedger.recentEvents = [...(nextLedger.recentEvents ?? []), ...tourneyEvents].slice(-120);
  nextLedger.updatedAtMs = nowMs;

  inMemoryLedger = nextLedger;
  writeLocalCachedLedger(nextLedger);
  await persistLedgerToSupabase(nextLedger, true);
  return true;
}
