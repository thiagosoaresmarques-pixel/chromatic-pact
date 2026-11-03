import {
  getSolvedProblemIds,
  isProblemTierUnlocked,
  PROBLEM_ROSTER_LITE,
} from '../data/problemsRuntime';

export type DailyQuestEventType =
  | 'problem_solved'
  | 'problem_solved_clean'
  | 'match_won'
  | 'domain_invoked'
  | 'unit_ascended'
  | 'domain_clashed_or_broken'
  | 'pack_or_deck_action';

export interface DailyQuestTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
  eventType: DailyQuestEventType;
  target: number;
  goldReward: number; // Sempre <= 8 (abaixo dos 10 🪙 de vitória em partida)
}

export interface DailyQuestProgress {
  id: string;
  title: string;
  description: string;
  icon: string;
  eventType: DailyQuestEventType;
  progress: number;
  target: number;
  goldReward: number;
  claimed: boolean;
}

export interface DailyStateData {
  dateKey: string; // YYYY-MM-DD
  dailyProblemId: string;
  dailyProblemFailedToday: boolean;
  dailyProblemHintUsedToday: boolean;
  dailyProblemSolvedToday: boolean;
  dailyProblemBonusClaimed: boolean;
  quests: DailyQuestProgress[];
}

export const DAILY_PROBLEM_BONUS_GOLD = 3;

const DAILY_STATE_STORAGE_KEY = 'chromatic_pact_daily_state_v1';

const QUEST_POOL_PROBLEMS: DailyQuestTemplate[] = [
  {
    id: 'dq_solve_1_prob',
    title: 'Mente Afiada',
    description: 'Resolva 1 Problema Tático de Xeque-Mate.',
    icon: '♟️',
    eventType: 'problem_solved',
    target: 1,
    goldReward: 4,
  },
  {
    id: 'dq_solve_2_probs',
    title: 'Calculista da Fratura',
    description: 'Resolva 2 Problemas Táticos na mesa.',
    icon: '📐',
    eventType: 'problem_solved',
    target: 2,
    goldReward: 6,
  },
  {
    id: 'dq_solve_clean',
    title: 'Xeque-Mate Cirúrgico',
    description: 'Resolva 1 Problema Tático sem errar e sem usar Dica.',
    icon: '🏆',
    eventType: 'problem_solved_clean',
    target: 1,
    goldReward: 6,
  },
];

const QUEST_POOL_COMBAT: DailyQuestTemplate[] = [
  {
    id: 'dq_win_1_match',
    title: 'Sangue na Arena',
    description: 'Vença 1 duelo (Arena, Campanha, Expedição ou 1×1).',
    icon: '⚔️',
    eventType: 'match_won',
    target: 1,
    goldReward: 5,
  },
  {
    id: 'dq_win_2_matches',
    title: 'Soberania em Combate',
    description: 'Vença 2 duelos contra Soberanos rivais.',
    icon: '👑',
    eventType: 'match_won',
    target: 2,
    goldReward: 8,
  },
];

const QUEST_POOL_MECHANICS: DailyQuestTemplate[] = [
  {
    id: 'dq_invoke_domain',
    title: 'Arquiteto de Santuário',
    description: 'Invoque 1 Expansão de Domínio (⛩️) em batalha ou problema.',
    icon: '⛩️',
    eventType: 'domain_invoked',
    target: 1,
    goldReward: 5,
  },
  {
    id: 'dq_ascend_unit',
    title: 'Despertar Lendário',
    description: 'Ascenda (★) 1 criatura em campo durante um turno.',
    icon: '🔥',
    eventType: 'unit_ascended',
    target: 1,
    goldReward: 5,
  },
  {
    id: 'dq_clash_or_break',
    title: 'Ruptura de Barreira',
    description: 'Dispute ou estilhace uma Expansão de Domínio inimiga.',
    icon: '💥',
    eventType: 'domain_clashed_or_broken',
    target: 1,
    goldReward: 6,
  },
];

export function getTodayDateKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getTimeUntilNextDailyReset(): string {
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
  const diffMs = Math.max(0, tomorrow.getTime() - now.getTime());
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${String(minutes).padStart(2, '0')}m`;
}

function hashDateSeed(dateKey: string, salt: string): number {
  let h = 2166136261;
  const str = `${dateKey}::${salt}`;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function pickDailyProblemIdForToday(dateKey: string): string {
  const solvedIds = getSolvedProblemIds();
  const solvedSet = new Set(solvedIds);
  const unlockedProblems = PROBLEM_ROSTER_LITE.filter((p) =>
    isProblemTierUnlocked(p.difficulty, solvedIds)
  );
  const unsolvedUnlocked = unlockedProblems.filter((p) => !solvedSet.has(p.id));
  const pool =
    unsolvedUnlocked.length > 0
      ? unsolvedUnlocked
      : unlockedProblems.length > 0
        ? unlockedProblems
        : PROBLEM_ROSTER_LITE;
  const idx = hashDateSeed(dateKey, 'daily_problem') % pool.length;
  return (pool[idx] ?? PROBLEM_ROSTER_LITE[0])?.id ?? 'prob_01_forja_impeto';
}

function createInitialDailyState(dateKey: string): DailyStateData {
  const dailyProblemId = pickDailyProblemIdForToday(dateKey);
  const q1 =
    QUEST_POOL_PROBLEMS[hashDateSeed(dateKey, 'q_prob') % QUEST_POOL_PROBLEMS.length];
  const q2 =
    QUEST_POOL_COMBAT[hashDateSeed(dateKey, 'q_combat') % QUEST_POOL_COMBAT.length];
  const q3 =
    QUEST_POOL_MECHANICS[hashDateSeed(dateKey, 'q_mech') % QUEST_POOL_MECHANICS.length];

  const templates = [q1, q2, q3];
  return {
    dateKey,
    dailyProblemId,
    dailyProblemFailedToday: false,
    dailyProblemHintUsedToday: false,
    dailyProblemSolvedToday: false,
    dailyProblemBonusClaimed: false,
    quests: templates.map((t) => ({
      ...t,
      progress: 0,
      claimed: false,
    })),
  };
}

export function getDailyState(): DailyStateData {
  const today = getTodayDateKey();
  if (typeof window === 'undefined') {
    return createInitialDailyState(today);
  }
  try {
    const raw = window.localStorage.getItem(DAILY_STATE_STORAGE_KEY);
    if (raw) {
      const parsed: DailyStateData = JSON.parse(raw);
      if (parsed && parsed.dateKey === today && Array.isArray(parsed.quests)) {
        const exists = PROBLEM_ROSTER_LITE.some((p) => p.id === parsed.dailyProblemId);
        if (!exists) {
          parsed.dailyProblemId = pickDailyProblemIdForToday(today);
        }
        return parsed;
      }
    }
  } catch {
    // ignore storage errors
  }

  const fresh = createInitialDailyState(today);
  saveDailyState(fresh);
  return fresh;
}

export function saveDailyState(state: DailyStateData): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(DAILY_STATE_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

export function recordDailyQuestEvent(
  eventType: DailyQuestEventType,
  amount = 1
): {
  state: DailyStateData;
  newlyCompletedQuests: DailyQuestProgress[];
} {
  const state = getDailyState();
  const newlyCompletedQuests: DailyQuestProgress[] = [];

  state.quests = state.quests.map((q) => {
    if (q.eventType !== eventType || q.claimed) return q;
    const wasComplete = q.progress >= q.target;
    const nextProgress = Math.min(q.target, q.progress + amount);
    const updated = { ...q, progress: nextProgress };
    if (!wasComplete && nextProgress >= q.target) {
      newlyCompletedQuests.push(updated);
    }
    return updated;
  });

  saveDailyState(state);
  return { state, newlyCompletedQuests };
}

export function recordDailyProblemAttemptResult(
  problemId: string,
  outcome: 'failed' | 'hint_used' | 'solved'
): {
  state: DailyStateData;
  earnedDailyBonusGold: number;
  newlyCompletedQuests: DailyQuestProgress[];
} {
  let state = getDailyState();
  let earnedDailyBonusGold = 0;
  const newlyCompletedQuests: DailyQuestProgress[] = [];

  if (problemId === state.dailyProblemId) {
    if (outcome === 'failed') {
      state.dailyProblemFailedToday = true;
    } else if (outcome === 'hint_used') {
      state.dailyProblemHintUsedToday = true;
    } else if (outcome === 'solved') {
      state.dailyProblemSolvedToday = true;
      if (
        !state.dailyProblemBonusClaimed &&
        !state.dailyProblemFailedToday &&
        !state.dailyProblemHintUsedToday
      ) {
        state.dailyProblemBonusClaimed = true;
        earnedDailyBonusGold = DAILY_PROBLEM_BONUS_GOLD;
      }
    }
    saveDailyState(state);
  }

  if (outcome === 'solved') {
    const res1 = recordDailyQuestEvent('problem_solved', 1);
    state = res1.state;
    newlyCompletedQuests.push(...res1.newlyCompletedQuests);
  }

  return { state, earnedDailyBonusGold, newlyCompletedQuests };
}

export function claimDailyQuestReward(questId: string): {
  state: DailyStateData;
  claimedQuest: DailyQuestProgress | null;
} {
  const state = getDailyState();
  let claimedQuest: DailyQuestProgress | null = null;

  state.quests = state.quests.map((q) => {
    if (q.id === questId && q.progress >= q.target && !q.claimed) {
      const updated = { ...q, claimed: true };
      claimedQuest = updated;
      return updated;
    }
    return q;
  });

  if (claimedQuest) {
    saveDailyState(state);
  }
  return { state, claimedQuest };
}

// ============================================================================
// VIGÍLIA SOBERANA (CICLO DE PRESENÇA DIÁRIA D1–D7 — REVELAÇÃO PROGRESSIVA)
// ============================================================================

export interface VigilDayRewardSpec {
  day: number; // 1..7
  gold: number;
  shards: number;
}

export const DAILY_VIGIL_REWARDS: ReadonlyArray<VigilDayRewardSpec> = [
  { day: 1, gold: 5, shards: 0 },
  { day: 2, gold: 6, shards: 0 },
  { day: 3, gold: 8, shards: 0 },
  { day: 4, gold: 10, shards: 0 },
  { day: 5, gold: 12, shards: 0 },
  { day: 6, gold: 15, shards: 0 },
  { day: 7, gold: 30, shards: 15 },
];

interface StoredVigilStreak {
  streakDay: number; // 1..7 of last claimed day
  lastClaimDateKey: string; // YYYY-MM-DD
}

const VIGIL_STORAGE_PREFIX = 'chromatic_pact_vigil_streak_v1::';

function getYesterdayDateKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export interface VigilStreakStatus {
  currentDay: number; // 1..7 (either claimed today or ready to claim today)
  claimedToday: boolean;
  todayReward: VigilDayRewardSpec;
  nextReward: VigilDayRewardSpec;
}

export function getVigilStreakState(username: string | null | undefined): VigilStreakStatus {
  const defaultSpec = DAILY_VIGIL_REWARDS[0];
  const secondSpec = DAILY_VIGIL_REWARDS[1];
  if (!username || typeof window === 'undefined') {
    return {
      currentDay: 1,
      claimedToday: false,
      todayReward: defaultSpec,
      nextReward: secondSpec,
    };
  }

  const key = `${VIGIL_STORAGE_PREFIX}${username.trim().toLowerCase()}`;
  const today = getTodayDateKey();
  const yesterday = getYesterdayDateKey();

  try {
    const raw = window.localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw) as StoredVigilStreak;
      if (parsed && parsed.lastClaimDateKey === today) {
        const day = Math.min(7, Math.max(1, parsed.streakDay || 1));
        const todayReward = DAILY_VIGIL_REWARDS[day - 1] ?? defaultSpec;
        const nextDay = day >= 7 ? 1 : day + 1;
        return {
          currentDay: day,
          claimedToday: true,
          todayReward,
          nextReward: DAILY_VIGIL_REWARDS[nextDay - 1] ?? defaultSpec,
        };
      }
      if (parsed && parsed.lastClaimDateKey === yesterday) {
        const prevDay = Math.min(7, Math.max(1, parsed.streakDay || 1));
        const nextDay = prevDay >= 7 ? 1 : prevDay + 1;
        const todayReward = DAILY_VIGIL_REWARDS[nextDay - 1] ?? defaultSpec;
        const afterNext = nextDay >= 7 ? 1 : nextDay + 1;
        return {
          currentDay: nextDay,
          claimedToday: false,
          todayReward,
          nextReward: DAILY_VIGIL_REWARDS[afterNext - 1] ?? defaultSpec,
        };
      }
    }
  } catch {
    // ignore storage errors
  }

  return {
    currentDay: 1,
    claimedToday: false,
    todayReward: defaultSpec,
    nextReward: secondSpec,
  };
}

export function claimDailyVigilReward(username: string): VigilDayRewardSpec | null {
  if (!username || typeof window === 'undefined') return null;
  const status = getVigilStreakState(username);
  if (status.claimedToday) return null;

  const key = `${VIGIL_STORAGE_PREFIX}${username.trim().toLowerCase()}`;
  const stored: StoredVigilStreak = {
    streakDay: status.currentDay,
    lastClaimDateKey: getTodayDateKey(),
  };
  try {
    window.localStorage.setItem(key, JSON.stringify(stored));
  } catch {
    // ignore
  }
  return status.todayReward;
}
