import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isMainThread, parentPort, Worker } from 'node:worker_threads';
import { ALL_CARDS, CARDS_BY_ID } from '../data/cards';
import { MAX_COPIES_BY_RARITY, MAX_LEGENDARIES_PER_DECK, REQUIRED_DECK_SIZE } from '../data/decks';
import {
  AiDecisionWeights,
  DeckLearnedAiProfile,
  DEFAULT_AI_WEIGHTS,
  DiscoveredCardCombo,
} from '../data/aiLearnedProfiles';
import type { MonocolorArchetypeId } from '../data/aiMonocolorMasteryData';
import { createInitialGameState, getAllBoardUnits, mulliganCards } from '../engine/gameEngine';
import {
  AiProfileOverrides,
  chooseMulliganIndicesForActor,
  executeTurnStepForActor,
} from '../engine/aiEngine';
import {
  extractNormalizedStateFeatures,
  SerializedValueMlp,
  trainValueMlpWithAdam,
  VALUE_MLP_INPUT_DIM,
  ValueTrainingSample,
} from '../engine/aiValueNetwork';
import { AiSkillTier, CardDefinition, Domain, Rarity } from '../types/game';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// EXTENDED STATISTICAL METADATA TYPES (EMITTED TO aiMonocolorMasteryData.ts)
// ============================================================================
interface StabilizedCardShapleyMetric {
  cardId: string;
  cardName: string;
  shapleyValue: number;
  shapleyLcb: number;
  ci95HalfWidth: number;
  playedWinRate: number;
  stuckInHandRate: number;
  samples: number;
}

interface StabilizedTierDeckMetadata {
  tier: AiSkillTier;
  tierLabel: string;
  cardIds: string[];
  legendaryCount: number;
  rareCount: number;
  uncommonCount: number;
  commonCount: number;
  avgCost: number;
  benchmarkWinRateVsLadder: number;
  benchmarkCi95HalfWidth?: number;
}

interface StabilizedArchetypeMastery {
  archetypeId: MonocolorArchetypeId;
  domain: Domain;
  name: string;
  subtitle: string;
  strategySummary: string;
  tacticalIdentity: 'aggro' | 'midrange' | 'control' | 'ramp' | 'tempo' | 'attrition';
  coverCardId: string;
  generationsEvolved: number;
  matchesSimulated: number;
  seedWinRate: number;
  championWinRate: number;
  championDeckJaccardStability?: number;
  medianCardCi95HalfWidth?: number;
  learnedProfile: DeckLearnedAiProfile;
  topShapleyCards: StabilizedCardShapleyMetric[];
  tierDecks: Record<AiSkillTier, StabilizedTierDeckMetadata>;
}

interface StabilizedDomainTierLadderBenchmark {
  domain: Domain;
  matchesPerCell: number;
  totalLadderMatches?: number;
  tierOverallWinRates: Record<AiSkillTier, number>;
  tierCi95HalfWidths?: Record<AiSkillTier, number>;
  maxTierCi95HalfWidth?: number;
  convergedByMargin?: boolean;
  adjacentDominanceWinRates: {
    tier2VsTier1: number;
    tier3VsTier2: number;
    tier4VsTier3: number;
    tier5VsTier4: number;
    tier5VsTier1: number;
  };
}

interface ConvergenceCriteriaReport {
  workerThreadsUsed: number;
  targetTierCi95HalfWidth: number;
  achievedMaxTierCi95HalfWidth: number;
  targetDeckJaccardStability: number;
  achievedMeanDeckJaccardStability: number;
  achievedMaxMedianCardCi95HalfWidth: number;
  minComboCoPlays: number;
  generationsExecuted: number;
  convergedEarly: boolean;
}

interface StabilizedTrainingSummary {
  generatedAt: string;
  totalMatchesSimulated: number;
  totalStateTrajectoriesTrained: number;
  elapsedSeconds: number;
  archetypesCount: number;
  convergenceReport?: ConvergenceCriteriaReport;
  ladderByDomain: Partial<Record<Domain, StabilizedDomainTierLadderBenchmark>>;
}

// ============================================================================
// TELEMETRY & WORKER IPC TYPES
// ============================================================================
interface CardEvoTelemetry {
  drawnGames: number;
  playedGames: number;
  playedScoreSum: number;
  stuckInHandGames: number;
  keptMulliganGames: number;
  keptMulliganScoreSum: number;
  channeledEarlyGames: number;
  channeledEarlyScoreSum: number;
}

interface PairEvoTelemetry {
  cardA: string;
  cardB: string;
  coPlayGames: number;
  coPlayScoreSum: number;
}

interface PackedTrajectoryBatch {
  count: number;
  featuresFlat: Float64Array; // length = count * VALUE_MLP_INPUT_DIM
  targets: Float64Array;
  weights: Float64Array;
}

interface WorkerPairBatchRequest {
  jobId: number;
  deckACardIds: string[];
  deckBCardIds: string[];
  nameA: string;
  nameB: string;
  deckIdA?: string;
  deckIdB?: string;
  domainA: Domain;
  domainB: Domain;
  profileA?: DeckLearnedAiProfile;
  profileB?: DeckLearnedAiProfile;
  skillTierA: AiSkillTier;
  skillTierB: AiSkillTier;
  mlpA: SerializedValueMlp | null;
  mlpB: SerializedValueMlp | null;
  fastRollout: boolean;
  numMirrorPairs: number;
  collectTelemetryA: boolean;
  collectTelemetryB: boolean;
  maxTrajectoriesPerSide: number;
}

interface WorkerPairBatchResponse {
  jobId: number;
  matchesPlayed: number;
  pairCount: number;
  scoreASum: number; // sum across all 2 * pairCount games in [0 .. 2*pairCount]
  pairMeanSum: number; // sum of per-pair averages x_k in [0 .. pairCount]
  pairMeanSumSq: number; // sum of x_k^2 for exact empirical variance
  cardTelemetryA?: Array<[string, CardEvoTelemetry]>;
  pairTelemetryA?: Array<[string, PairEvoTelemetry]>;
  cardTelemetryB?: Array<[string, CardEvoTelemetry]>;
  pairTelemetryB?: Array<[string, PairEvoTelemetry]>;
  trajectoriesA?: PackedTrajectoryBatch;
  trajectoriesB?: PackedTrajectoryBatch;
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

function resolveDeckDefinitions(cardIds: string[]): CardDefinition[] {
  const arr = new Array<CardDefinition>(cardIds.length);
  for (let i = 0; i < cardIds.length; i++) {
    arr[i] = CARDS_BY_ID[cardIds[i]];
  }
  return arr;
}

function getOrCreateCardEvo(
  map: Map<string, CardEvoTelemetry>,
  cardId: string
): CardEvoTelemetry {
  let b = map.get(cardId);
  if (!b) {
    b = {
      drawnGames: 0,
      playedGames: 0,
      playedScoreSum: 0,
      stuckInHandGames: 0,
      keptMulliganGames: 0,
      keptMulliganScoreSum: 0,
      channeledEarlyGames: 0,
      channeledEarlyScoreSum: 0,
    };
    map.set(cardId, b);
  }
  return b;
}

// ============================================================================
// CORE SINGLE-MATCH SIMULATION (USED INSIDE WORKER THREADS)
// ============================================================================
function simulateSingleMatchInWorker(
  playerDeckCards: CardDefinition[],
  aiDeckCards: CardDefinition[],
  namePlayer: string,
  nameAi: string,
  deckIdPlayer: string | undefined,
  deckIdAi: string | undefined,
  domainPlayer: Domain,
  domainAi: Domain,
  overrides: AiProfileOverrides,
  cardStatsP: Map<string, CardEvoTelemetry> | null,
  pairStatsP: Map<string, PairEvoTelemetry> | null,
  cardStatsA: Map<string, CardEvoTelemetry> | null,
  pairStatsA: Map<string, PairEvoTelemetry> | null,
  trajOutP: ValueTrainingSample[] | null,
  trajOutA: ValueTrainingSample[] | null,
  maxTrajP: number,
  maxTrajA: number
): number {
  let state = createInitialGameState(playerDeckCards, aiDeckCards, {
    playerName: namePlayer,
    aiName: nameAi,
    playerDeckId: deckIdPlayer,
    aiDeckId: deckIdAi,
    playerSkillTier: overrides.playerSkillTier ?? 3,
    aiSkillTier: overrides.aiSkillTier ?? 3,
  });

  const pSwap = chooseMulliganIndicesForActor(
    state,
    'player',
    overrides.player,
    overrides.playerSkillTier
  );
  const pSwapSet = new Set(pSwap);
  const pKept = new Set<string>();
  if (cardStatsP) {
    state.player.hand.forEach((c, idx) => {
      if (!pSwapSet.has(idx)) pKept.add(c.id);
    });
  }
  state = mulliganCards(state, 'player', pSwap);

  const aSwap = chooseMulliganIndicesForActor(
    state,
    'ai',
    overrides.ai,
    overrides.aiSkillTier
  );
  const aSwapSet = new Set(aSwap);
  const aKept = new Set<string>();
  if (cardStatsA) {
    state.ai.hand.forEach((c, idx) => {
      if (!aSwapSet.has(idx)) aKept.add(c.id);
    });
  }
  state = mulliganCards(state, 'ai', aSwap);

  const pSeenInHand = cardStatsP ? new Set<string>(state.player.hand.map((c) => c.id)) : null;
  const aSeenInHand = cardStatsA ? new Set<string>(state.ai.hand.map((c) => c.id)) : null;
  const pPlayed = cardStatsP ? new Set<string>() : null;
  const aPlayed = cardStatsA ? new Set<string>() : null;
  const pEarlyChanneled = cardStatsP ? new Set<string>() : null;
  const aEarlyChanneled = cardStatsA ? new Set<string>() : null;

  const recordedSnaps: Array<{
    actor: 'player' | 'ai';
    turn: number;
    features: Float64Array;
  }> = [];

  const wantSnapsP = Boolean(trajOutP && trajOutP.length < maxTrajP);
  const wantSnapsA = Boolean(trajOutA && trajOutA.length < maxTrajA);

  const maxTurns = 34;
  let guardSteps = 0;

  while (state.phase !== 'gameover' && state.turn <= maxTurns && guardSteps < 900) {
    guardSteps += 1;
    const active = state.activePlayer;

    if (pSeenInHand) {
      for (const c of state.player.hand) pSeenInHand.add(c.id);
    }
    if (aSeenInHand) {
      for (const c of state.ai.hand) aSeenInHand.add(c.id);
    }

    const prevHandP = cardStatsP ? state.player.hand : null;
    const prevChanP = cardStatsP ? state.player.channeledCards.length : 0;
    const prevHandA = cardStatsA ? state.ai.hand : null;
    const prevChanA = cardStatsA ? state.ai.channeledCards.length : 0;
    const prevTurn = state.turn;

    if (
      ((active === 'player' && wantSnapsP) || (active === 'ai' && wantSnapsA)) &&
      !state[active].hasChanneledThisTurn &&
      state.turn >= 2 &&
      state.turn % 2 === 0
    ) {
      recordedSnaps.push({
        actor: active,
        turn: state.turn,
        features: extractNormalizedStateFeatures(state, active),
      });
    }

    const step = executeTurnStepForActor(state, active, overrides);
    const next = step.nextState;

    // Track BOTH sides on every step so defender-turn Reactions (Blue/Purple/Red) are accurately counted!
    if (prevHandP) {
      if (next.player.channeledCards.length > prevChanP && prevTurn <= 3) {
        const ch = next.player.channeledCards[next.player.channeledCards.length - 1];
        if (ch) pEarlyChanneled?.add(ch.id);
      } else if (
        next.player.channeledCards.length === prevChanP &&
        next.player.hand.length < prevHandP.length
      ) {
        const remCounts = new Map<string, number>();
        for (const c of next.player.hand) remCounts.set(c.id, (remCounts.get(c.id) ?? 0) + 1);
        for (const c of prevHandP) {
          const cnt = remCounts.get(c.id) ?? 0;
          if (cnt > 0) remCounts.set(c.id, cnt - 1);
          else pPlayed?.add(c.id);
        }
      }
    }

    if (prevHandA) {
      if (next.ai.channeledCards.length > prevChanA && prevTurn <= 3) {
        const ch = next.ai.channeledCards[next.ai.channeledCards.length - 1];
        if (ch) aEarlyChanneled?.add(ch.id);
      } else if (
        next.ai.channeledCards.length === prevChanA &&
        next.ai.hand.length < prevHandA.length
      ) {
        const remCounts = new Map<string, number>();
        for (const c of next.ai.hand) remCounts.set(c.id, (remCounts.get(c.id) ?? 0) + 1);
        for (const c of prevHandA) {
          const cnt = remCounts.get(c.id) ?? 0;
          if (cnt > 0) remCounts.set(c.id, cnt - 1);
          else aPlayed?.add(c.id);
        }
      }
    }

    state = next;
  }

  let scorePlayer = 0.5;
  if (state.phase === 'gameover' && state.winner === 'player') {
    scorePlayer = 1;
  } else if (state.phase === 'gameover' && state.winner === 'ai') {
    scorePlayer = 0;
  } else {
    const pBoard = getAllBoardUnits(state.player).reduce(
      (s, u) => s + u.currentAtk + u.currentHp,
      0
    );
    const aBoard = getAllBoardUnits(state.ai).reduce(
      (s, u) => s + u.currentAtk + u.currentHp,
      0
    );
    const adv = state.player.hp - state.ai.hp + (pBoard - aBoard) * 0.4;
    scorePlayer = clamp(0.5 + adv / 60, 0.15, 0.85);
  }
  const scoreAi = 1 - scorePlayer;

  if (recordedSnaps.length > 0) {
    const finalTurn = Math.max(2, state.turn);
    const zPlayer = (scorePlayer - 0.5) * 2;
    for (const snap of recordedSnaps) {
      const targetArr = snap.actor === 'player' ? trajOutP : trajOutA;
      const cap = snap.actor === 'player' ? maxTrajP : maxTrajA;
      if (!targetArr || targetArr.length >= cap) continue;
      const zActor = snap.actor === 'player' ? zPlayer : -zPlayer;
      const dist = Math.max(0, finalTurn - snap.turn);
      const lambdaDiscount = Math.pow(0.94, dist);
      const target = clamp(zActor * lambdaDiscount, -1, 1);
      const importance = 0.65 + 0.35 * clamp(snap.turn / finalTurn, 0, 1);
      targetArr.push({
        features: snap.features,
        target,
        weight: importance,
      });
    }
  }

  const recordTelemetry = (
    cMap: Map<string, CardEvoTelemetry> | null,
    pMap: Map<string, PairEvoTelemetry> | null,
    score: number,
    seen: Set<string> | null,
    played: Set<string> | null,
    kept: Set<string>,
    earlyChan: Set<string> | null,
    endHand: CardDefinition[]
  ) => {
    if (!cMap || !seen || !played || !earlyChan) return;
    const stuckSet = new Set<string>();
    for (const c of endHand) {
      if (!played.has(c.id) && !earlyChan.has(c.id)) stuckSet.add(c.id);
    }
    for (const cid of seen) {
      const st = getOrCreateCardEvo(cMap, cid);
      st.drawnGames += 1;
      if (stuckSet.has(cid)) st.stuckInHandGames += 1;
    }
    for (const cid of kept) {
      const st = getOrCreateCardEvo(cMap, cid);
      st.keptMulliganGames += 1;
      st.keptMulliganScoreSum += score;
    }
    for (const cid of earlyChan) {
      const st = getOrCreateCardEvo(cMap, cid);
      st.channeledEarlyGames += 1;
      st.channeledEarlyScoreSum += score;
    }
    for (const cid of played) {
      const st = getOrCreateCardEvo(cMap, cid);
      st.playedGames += 1;
      st.playedScoreSum += score;
    }
    if (pMap && played.size >= 2) {
      const playedArr = Array.from(played).sort();
      for (let i = 0; i < playedArr.length; i++) {
        for (let j = i + 1; j < playedArr.length; j++) {
          const key = `${playedArr[i]}|${playedArr[j]}`;
          let p = pMap.get(key);
          if (!p) {
            p = { cardA: playedArr[i], cardB: playedArr[j], coPlayGames: 0, coPlayScoreSum: 0 };
            pMap.set(key, p);
          }
          p.coPlayGames += 1;
          p.coPlayScoreSum += score;
        }
      }
    }
  };

  recordTelemetry(
    cardStatsP,
    pairStatsP,
    scorePlayer,
    pSeenInHand,
    pPlayed,
    pKept,
    pEarlyChanneled,
    state.player.hand
  );
  recordTelemetry(
    cardStatsA,
    pairStatsA,
    scoreAi,
    aSeenInHand,
    aPlayed,
    aKept,
    aEarlyChanneled,
    state.ai.hand
  );

  // Suppress unused domain param warning
  void domainPlayer;
  void domainAi;
  return scorePlayer;
}

function packTrajectories(samples: ValueTrainingSample[]): PackedTrajectoryBatch | undefined {
  if (samples.length === 0) return undefined;
  const n = samples.length;
  const featuresFlat = new Float64Array(n * VALUE_MLP_INPUT_DIM);
  const targets = new Float64Array(n);
  const weights = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    featuresFlat.set(samples[i].features, i * VALUE_MLP_INPUT_DIM);
    targets[i] = samples[i].target;
    weights[i] = samples[i].weight;
  }
  return { count: n, featuresFlat, targets, weights };
}

// ============================================================================
// WORKER THREAD ENTRYPOINT
// ============================================================================
if (!isMainThread && parentPort) {
  parentPort.on('message', (req: WorkerPairBatchRequest) => {
    const cardsA = resolveDeckDefinitions(req.deckACardIds);
    const cardsB = resolveDeckDefinitions(req.deckBCardIds);

    const cardStatsA = req.collectTelemetryA ? new Map<string, CardEvoTelemetry>() : null;
    const pairStatsA = req.collectTelemetryA ? new Map<string, PairEvoTelemetry>() : null;
    const cardStatsB = req.collectTelemetryB ? new Map<string, CardEvoTelemetry>() : null;
    const pairStatsB = req.collectTelemetryB ? new Map<string, PairEvoTelemetry>() : null;

    const trajA: ValueTrainingSample[] | null =
      req.maxTrajectoriesPerSide > 0 ? [] : null;
    const trajB: ValueTrainingSample[] | null =
      req.maxTrajectoriesPerSide > 0 ? [] : null;

    let scoreASum = 0;
    let pairMeanSum = 0;
    let pairMeanSumSq = 0;

    for (let k = 0; k < req.numMirrorPairs; k++) {
      // Seat 1: A goes first ('player'), B goes second ('ai')
      const s1 = simulateSingleMatchInWorker(
        cardsA,
        cardsB,
        req.nameA,
        req.nameB,
        req.deckIdA,
        req.deckIdB,
        req.domainA,
        req.domainB,
        {
          player: req.profileA,
          ai: req.profileB,
          playerSkillTier: req.skillTierA,
          aiSkillTier: req.skillTierB,
          playerValueMlp: req.mlpA,
          aiValueMlp: req.mlpB,
          fastRollout: req.fastRollout,
        },
        cardStatsA,
        pairStatsA,
        cardStatsB,
        pairStatsB,
        trajA,
        trajB,
        req.maxTrajectoriesPerSide,
        req.maxTrajectoriesPerSide
      );

      // Seat 2: B goes first ('player'), A goes second ('ai')
      const s2B = simulateSingleMatchInWorker(
        cardsB,
        cardsA,
        req.nameB,
        req.nameA,
        req.deckIdB,
        req.deckIdA,
        req.domainB,
        req.domainA,
        {
          player: req.profileB,
          ai: req.profileA,
          playerSkillTier: req.skillTierB,
          aiSkillTier: req.skillTierA,
          playerValueMlp: req.mlpB,
          aiValueMlp: req.mlpA,
          fastRollout: req.fastRollout,
        },
        cardStatsB,
        pairStatsB,
        cardStatsA,
        pairStatsA,
        trajB,
        trajA,
        req.maxTrajectoriesPerSide,
        req.maxTrajectoriesPerSide
      );

      const s2A = 1 - s2B;
      const pairMean = 0.5 * (s1 + s2A);
      scoreASum += s1 + s2A;
      pairMeanSum += pairMean;
      pairMeanSumSq += pairMean * pairMean;
    }

    const res: WorkerPairBatchResponse = {
      jobId: req.jobId,
      matchesPlayed: req.numMirrorPairs * 2,
      pairCount: req.numMirrorPairs,
      scoreASum,
      pairMeanSum,
      pairMeanSumSq,
      cardTelemetryA: cardStatsA ? Array.from(cardStatsA.entries()) : undefined,
      pairTelemetryA: pairStatsA ? Array.from(pairStatsA.entries()) : undefined,
      cardTelemetryB: cardStatsB ? Array.from(cardStatsB.entries()) : undefined,
      pairTelemetryB: pairStatsB ? Array.from(pairStatsB.entries()) : undefined,
      trajectoriesA: trajA ? packTrajectories(trajA) : undefined,
      trajectoriesB: trajB ? packTrajectories(trajB) : undefined,
    };

    parentPort!.postMessage(res);
  });
}

// ============================================================================
// MAIN THREAD: WORKER POOL & STATISTICAL CONVERGENCE ENGINE
// ============================================================================
class SimulationWorkerPool {
  private workers: Worker[] = [];
  private idleWorkers: Worker[] = [];
  private queue: Array<{
    req: WorkerPairBatchRequest;
    resolve: (res: WorkerPairBatchResponse) => void;
    reject: (err: Error) => void;
  }> = [];
  private inFlight = new Map<
    number,
    {
      resolve: (res: WorkerPairBatchResponse) => void;
      reject: (err: Error) => void;
    }
  >();
  private nextJobId = 1;

  constructor(readonly size: number) {
    const workerUrl = new URL(import.meta.url);
    for (let i = 0; i < size; i++) {
      const w = new Worker(workerUrl, {
        execArgv: ['--import', 'tsx'],
      });
      w.on('message', (msg: WorkerPairBatchResponse) => {
        const pending = this.inFlight.get(msg.jobId);
        if (pending) {
          this.inFlight.delete(msg.jobId);
          pending.resolve(msg);
        }
        this.idleWorkers.push(w);
        this.pump();
      });
      w.on('error', (err) => {
        for (const p of this.inFlight.values()) p.reject(err);
        this.inFlight.clear();
      });
      this.workers.push(w);
      this.idleWorkers.push(w);
    }
  }

  runBatch(req: Omit<WorkerPairBatchRequest, 'jobId'>): Promise<WorkerPairBatchResponse> {
    const jobId = this.nextJobId++;
    const fullReq: WorkerPairBatchRequest = { ...req, jobId };
    return new Promise((resolve, reject) => {
      this.queue.push({ req: fullReq, resolve, reject });
      this.pump();
    });
  }

  private pump(): void {
    while (this.idleWorkers.length > 0 && this.queue.length > 0) {
      const worker = this.idleWorkers.pop()!;
      const item = this.queue.shift()!;
      this.inFlight.set(item.req.jobId, { resolve: item.resolve, reject: item.reject });
      worker.postMessage(item.req);
    }
  }

  async close(): Promise<void> {
    await Promise.all(this.workers.map((w) => w.terminate()));
    this.workers = [];
    this.idleWorkers = [];
  }
}

/**
 * Exact empirical accumulator for mirror-seat paired observations x_k in [0, 1].
 */
class PairedStatAccumulator {
  pairCount = 0;
  pairMeanSum = 0;
  pairMeanSumSq = 0;

  addBatch(pairs: number, sum: number, sumSq: number): void {
    this.pairCount += pairs;
    this.pairMeanSum += sum;
    this.pairMeanSumSq += sumSq;
  }

  get totalMatches(): number {
    return this.pairCount * 2;
  }

  get mean(): number {
    return this.pairCount > 0 ? this.pairMeanSum / this.pairCount : 0.5;
  }

  get stdError(): number {
    if (this.pairCount <= 1) return 0.25;
    const m = this.mean;
    const rawVar = (this.pairMeanSumSq - this.pairCount * m * m) / (this.pairCount - 1);
    // Floor variance at 0.015 so unanimous small samples never falsely report 0 error
    const safeVar = Math.max(0.015, rawVar);
    return Math.sqrt(safeVar / this.pairCount);
  }

  get ci95HalfWidth(): number {
    return 1.96 * this.stdError;
  }
}

interface ArchetypeBlueprint {
  id: MonocolorArchetypeId;
  domain: Domain;
  name: string;
  subtitle: string;
  strategySummary: string;
  tacticalIdentity: 'aggro' | 'midrange' | 'control' | 'ramp' | 'tempo' | 'attrition';
  seedWeights: AiDecisionWeights;
  targetAvgCost: number;
  minEarlyDrops: number;
  minCreatures: number;
}

const ARCHETYPE_BLUEPRINTS: ArchetypeBlueprint[] = [
  // ======================== GREEN (VERIDIA) ========================
  {
    id: 'mono_green_swarm',
    domain: 'green',
    name: 'Enxame & Matilha Silvestre',
    subtitle: 'Mono-Verde 🌿 • Aggro & Buff em Massa',
    strategySummary:
      'Inunda as 6 colunas cedo com feras velozes, invocações de matilha e rugidos de fortalecimento coletivo para letal explosivo.',
    tacticalIdentity: 'aggro',
    targetAvgCost: 2.7,
    minEarlyDrops: 34,
    minCreatures: 64,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.32,
      tradeValueBias: 0.92,
      stackConsolidationBias: 0.85,
      antiAoeSpreadBias: 1.25,
      synergyHoldBonus: 24,
      mulliganCurveTarget: 2.6,
    },
  },
  {
    id: 'mono_green_colossus',
    domain: 'green',
    name: 'Colossos Primordiais',
    subtitle: 'Mono-Verde 🌿 • Ramp & Atropelar',
    strategySummary:
      'Acelera Essência com xamãs druídicos para esmagar linhas defensivas com dinossauros e titãs dotados de Atropelar.',
    tacticalIdentity: 'ramp',
    targetAvgCost: 3.9,
    minEarlyDrops: 24,
    minCreatures: 58,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.15,
      tradeValueBias: 1.12,
      ascensionEagerness: 1.18,
      domainExpansionEagerness: 1.22,
      mulliganCurveTarget: 3.2,
    },
  },
  {
    id: 'mono_green_roots',
    domain: 'green',
    name: 'Raízes Eternas',
    subtitle: 'Mono-Verde 🌿 • Guardião & Regeneração',
    strategySummary:
      'Ergue muralhas vivas com Guardião, Regeneração e curas recorrentes, vencendo por atrito intransponível de Vanguarda.',
    tacticalIdentity: 'attrition',
    targetAvgCost: 3.4,
    minEarlyDrops: 26,
    minCreatures: 58,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 0.86,
      tradeValueBias: 1.28,
      guardianPriority: 1.38,
      relicPriority: 1.15,
      mulliganCurveTarget: 3.0,
    },
  },

  // ======================== RED (PYROS) ========================
  {
    id: 'mono_red_blitz',
    domain: 'red',
    name: 'Blitz Salamandra',
    subtitle: 'Mono-Vermelho 🔥 • Ímpeto & Pele Incandescente',
    strategySummary:
      'Assalto relâmpago com tropas de Ímpeto, Fúria Crescente e Pele Incandescente que punem qualquer bloqueio inimigo.',
    tacticalIdentity: 'aggro',
    targetAvgCost: 2.5,
    minEarlyDrops: 38,
    minCreatures: 62,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.45,
      tradeValueBias: 0.84,
      bloodPactThresholdHp: 20,
      sovPowerTempoBias: 1.2,
      mulliganCurveTarget: 2.4,
    },
  },
  {
    id: 'mono_red_pyroclasm',
    domain: 'red',
    name: 'Artilharia Piroclástica',
    subtitle: 'Mono-Vermelho 🔥 • Queima Direta & Cataclismos',
    strategySummary:
      'Varre fileiras inimigas com erupções vulcânicas, armadilhas de magma e dano direto letal contra o Soberano rival.',
    tacticalIdentity: 'control',
    targetAvgCost: 3.3,
    minEarlyDrops: 26,
    minCreatures: 46,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.25,
      tradeValueBias: 1.15,
      spellHoldPatience: 1.24,
      synergyHoldBonus: 26,
      mulliganCurveTarget: 3.0,
    },
  },
  {
    id: 'mono_red_dragon',
    domain: 'red',
    name: 'Trono Dracônico',
    subtitle: 'Mono-Vermelho 🔥 • Voo, Sopro & Ascensão',
    strategySummary:
      'Domina os céus com wyverns e dragões anciãos de Voo, Sopro Elemental e Ascensão, ignorando bloqueadores terrestres.',
    tacticalIdentity: 'midrange',
    targetAvgCost: 3.8,
    minEarlyDrops: 24,
    minCreatures: 56,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.18,
      flyingEvasionBias: 1.38,
      ascensionEagerness: 1.28,
      domainExpansionEagerness: 1.25,
      mulliganCurveTarget: 3.1,
    },
  },

  // ======================== BLUE (VÓRTEX) ========================
  {
    id: 'mono_blue_frost',
    domain: 'blue',
    name: 'Inverno Eterno',
    subtitle: 'Mono-Azul ❄️ • Congelar & Estase Tática',
    strategySummary:
      'Paralisa a Vanguarda inimiga turno após turno com Congelar em área e elementais glaciais enquanto dita o ritmo da mesa.',
    tacticalIdentity: 'tempo',
    targetAvgCost: 3.1,
    minEarlyDrops: 28,
    minCreatures: 52,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.08,
      tradeValueBias: 1.22,
      spellHoldPatience: 1.22,
      synergyHoldBonus: 26,
      mulliganCurveTarget: 2.9,
    },
  },
  {
    id: 'mono_blue_chrono',
    domain: 'blue',
    name: 'Conclave Cronomante',
    subtitle: 'Mono-Azul ⚡ • Compra, Reações & Feitiços',
    strategySummary:
      'Gera vantagem massiva de cartas, aciona gatilhos de conjuração arcana e neutraliza jogadas rivais com reações e devoluções.',
    tacticalIdentity: 'control',
    targetAvgCost: 3.2,
    minEarlyDrops: 26,
    minCreatures: 46,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 0.94,
      tradeValueBias: 1.30,
      spellHoldPatience: 1.32,
      relicPriority: 1.2,
      mulliganCurveTarget: 3.0,
    },
  },
  {
    id: 'mono_blue_abyssal',
    domain: 'blue',
    name: 'Frota Abissal',
    subtitle: 'Mono-Azul 🌊 • Voo, Alcance & Leviatãs',
    strategySummary:
      'Combina batedores aéreos de Voo/Alcance na Retaguarda com leviatãs oceânicos colossais para pressão evasiva implacável.',
    tacticalIdentity: 'midrange',
    targetAvgCost: 3.6,
    minEarlyDrops: 26,
    minCreatures: 58,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.18,
      flyingEvasionBias: 1.42,
      tradeValueBias: 1.12,
      domainExpansionEagerness: 1.22,
      mulliganCurveTarget: 3.0,
    },
  },

  // ======================== PURPLE (ECLIPSE) ========================
  {
    id: 'mono_purple_crypt',
    domain: 'purple',
    name: 'Culto da Cripta',
    subtitle: 'Mono-Roxo 💀 • Renascer & Reanimação',
    strategySummary:
      'Transforma a Cripta em recurso infinito com tropas de Renascer, gatilhos de Último Suspiro e rituais de ressurreição.',
    tacticalIdentity: 'attrition',
    targetAvgCost: 3.2,
    minEarlyDrops: 30,
    minCreatures: 60,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.05,
      tradeValueBias: 1.28,
      synergyHoldBonus: 25,
      domainExpansionEagerness: 1.22,
      mulliganCurveTarget: 2.9,
    },
  },
  {
    id: 'mono_purple_blood',
    domain: 'purple',
    name: 'Pacto Sanguíneo',
    subtitle: 'Mono-Roxo 🩸 • Dreno de Vida & Toque Letal',
    strategySummary:
      'Sustenta pactos agressivos e Corrupção convertendo vida drenada em pressão letal com vampiros e assassinos de Toque Letal.',
    tacticalIdentity: 'aggro',
    targetAvgCost: 2.9,
    minEarlyDrops: 32,
    minCreatures: 58,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.28,
      tradeValueBias: 1.15,
      bloodPactThresholdHp: 18,
      ascensionEagerness: 1.2,
      mulliganCurveTarget: 2.7,
    },
  },
  {
    id: 'mono_purple_umbral',
    domain: 'purple',
    name: 'Inquisição Umbral',
    subtitle: 'Mono-Roxo 🌑 • Destruição, Debuff & Controle',
    strategySummary:
      'Aniquila ameaças-chave com destruição direta, drena o ATQ da Vanguarda inimiga e domina o fim de jogo com lordes abissais.',
    tacticalIdentity: 'control',
    targetAvgCost: 3.5,
    minEarlyDrops: 25,
    minCreatures: 48,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 0.92,
      tradeValueBias: 1.36,
      spellHoldPatience: 1.28,
      relicPriority: 1.18,
      mulliganCurveTarget: 3.1,
    },
  },

  // ======================== GOLD (SOLÁRIA) ========================
  {
    id: 'mono_gold_phalanx',
    domain: 'gold',
    name: 'Falange Impenetrável',
    subtitle: 'Mono-Dourado 🛡️ • Guardião, Armadura & Bastião',
    strategySummary:
      'Forma linhas blindadas de Guardiões com alta Armadura e estandartes de comando que anulam investidas agressivas.',
    tacticalIdentity: 'midrange',
    targetAvgCost: 3.1,
    minEarlyDrops: 30,
    minCreatures: 60,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 0.98,
      tradeValueBias: 1.26,
      guardianPriority: 1.42,
      stackConsolidationBias: 1.22,
      mulliganCurveTarget: 2.9,
    },
  },
  {
    id: 'mono_gold_celestial',
    domain: 'gold',
    name: 'Legião Celeste',
    subtitle: 'Mono-Dourado ☀️ • Escudo Divino, Voo & Ascensão',
    strategySummary:
      'Comanda serafins e arcontes de Voo protegidos por Escudo Divino que realizam trocas 2-por-1 e ascendem em campeões solares.',
    tacticalIdentity: 'tempo',
    targetAvgCost: 3.4,
    minEarlyDrops: 28,
    minCreatures: 58,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.16,
      flyingEvasionBias: 1.35,
      ascensionEagerness: 1.30,
      tradeValueBias: 1.18,
      mulliganCurveTarget: 3.0,
    },
  },
  {
    id: 'mono_gold_judgment',
    domain: 'gold',
    name: 'Julgamento Solar',
    subtitle: 'Mono-Dourado ⚖️ • Relíquias, Escudo Global & Cura',
    strategySummary:
      'Acumula Relíquias imperiais, restaura a vida do Soberano e concede Escudo Divino em massa antes do veredito final.',
    tacticalIdentity: 'control',
    targetAvgCost: 3.5,
    minEarlyDrops: 25,
    minCreatures: 50,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 0.90,
      tradeValueBias: 1.32,
      guardianPriority: 1.28,
      relicPriority: 1.38,
      spellHoldPatience: 1.22,
      mulliganCurveTarget: 3.1,
    },
  },

  // ======================== NEUTRAL (MATRIZ AXIAL) ========================
  {
    id: 'mono_neutral_axial',
    domain: 'neutral',
    name: 'Legião Axial Autômata',
    subtitle: 'Mono-Neutro ⚙️ • Constructos, Relíquias & Matriz Horológica',
    strategySummary:
      'Opera com Constructos blindados, artilharia de Alcance, Pulso da Matriz (2⚡) e a Expansão de Domínio Matriz Horológica do Ponto Zero (6/6 Afinidade Axial).',
    tacticalIdentity: 'midrange',
    targetAvgCost: 3.2,
    minEarlyDrops: 28,
    minCreatures: 58,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.12,
      tradeValueBias: 1.20,
      relicPriority: 1.25,
      guardianPriority: 1.15,
      domainExpansionEagerness: 1.25,
      sovPowerTempoBias: 1.05,
      mulliganCurveTarget: 2.9,
    },
  },
];

function createRng(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function computeIntrinsicCardQuality(card: CardDefinition): number {
  let q = 0;
  const cost = Math.max(1, card.cost);
  if (card.type === 'creature') {
    const statBudget =
      card.atk * 1.15 +
      card.hp * 1.0 +
      card.armor * 2.1 +
      (card.regeneration ?? 0) * 1.6 +
      (card.breathDamage ?? 0) * 1.8;
    q += (statBudget / (cost + 1.1)) * 3.2;
    q += card.keywords.length * 1.35;
    if (card.ascension) q += 1.4;
  } else if (card.type === 'relic') {
    q += 4.2 + card.hp * 0.35 + card.effects.length * 1.8;
  } else {
    q += 4.0 + card.effects.length * 1.9;
  }

  for (const eff of card.effects) {
    if (eff.type === 'draw_cards') q += eff.value * 1.6;
    else if (eff.type === 'destroy_enemy') q += 2.6;
    else if (eff.type === 'damage_all_units' || eff.type === 'damage_enemy_row') q += 2.1;
    else if (eff.type === 'revive_from_crypt' || eff.type === 'summon_token') q += 2.0;
    else if (eff.type === 'shield_all_allies' || eff.type === 'buff_all_allies') q += 2.1;
    else if (eff.type === 'break_domain_expansion') q += 2.8;
    else q += 1.2;
  }

  const rarityBonus: Record<Rarity, number> = {
    common: 0,
    uncommon: 0.9,
    rare: 2.1,
    legendary: 3.6,
  };
  q += rarityBonus[card.rarity];
  if ((card.corruptionCost ?? 0) >= 2) q -= 0.7;

  return q;
}

function computeArchetypeSynergyAffinity(
  card: CardDefinition,
  bp: ArchetypeBlueprint
): number {
  const kw = new Set(card.keywords);
  const effs = new Set(card.effects.map((e) => e.type));
  let s = 0;

  s -= Math.abs(card.cost - bp.targetAvgCost) * 0.65;

  switch (bp.id) {
    case 'mono_green_swarm':
      if (card.type === 'creature' && card.cost <= 3) s += 4.2;
      if (effs.has('summon_token') || effs.has('buff_all_allies')) s += 6.5;
      if (kw.has('Ímpeto') || kw.has('Fúria Crescente')) s += 3.8;
      if (card.cost >= 6) s -= 3.5;
      break;
    case 'mono_green_colossus':
      if (effs.has('grant_bonus_essence')) s += 7.0;
      if (kw.has('Atropelar')) s += 5.5;
      if (card.type === 'creature' && card.cost >= 5) s += 4.2;
      if (effs.has('buff_target_ally')) s += 3.0;
      break;
    case 'mono_green_roots':
      if (kw.has('Guardião')) s += 6.2;
      if ((card.regeneration ?? 0) > 0 || card.armor >= 1) s += 4.5;
      if (effs.has('heal_sovereign') || effs.has('heal_all_allies') || effs.has('heal_target_ally'))
        s += 5.0;
      break;

    case 'mono_red_blitz':
      if (card.type === 'creature' && card.cost <= 3) s += 4.8;
      if (kw.has('Ímpeto')) s += 6.0;
      if (kw.has('Pele Incandescente') || kw.has('Fúria Crescente')) s += 4.5;
      if (effs.has('damage_enemy_sovereign') && card.cost <= 3) s += 4.0;
      if (card.cost >= 6) s -= 4.0;
      break;
    case 'mono_red_pyroclasm':
      if (card.type === 'spell' || card.type === 'reaction') s += 4.6;
      if (
        effs.has('damage_enemy_sovereign') ||
        effs.has('damage_enemy_row') ||
        effs.has('damage_all_units') ||
        effs.has('damage_single_enemy')
      ) {
        s += 5.8;
      }
      if (card.effects.some((e) => e.trigger === 'spell_cast')) s += 5.2;
      break;
    case 'mono_red_dragon':
      if (kw.has('Voo')) s += 6.0;
      if ((card.breathDamage ?? 0) > 0) s += 5.8;
      if (card.ascension) s += 4.5;
      if (effs.has('grant_bonus_essence') || card.type === 'relic') s += 2.5;
      break;

    case 'mono_blue_frost':
      if (effs.has('freeze_enemy') || effs.has('freeze_enemy_vanguard')) s += 7.5;
      if (effs.has('bounce_enemy') || effs.has('debuff_enemy_vanguard_atk')) s += 3.8;
      break;
    case 'mono_blue_chrono':
      if (effs.has('draw_cards')) s += 6.5;
      if (card.effects.some((e) => e.trigger === 'spell_cast')) s += 6.5;
      if (card.type === 'spell' || card.type === 'reaction' || card.type === 'relic') s += 3.5;
      break;
    case 'mono_blue_abyssal':
      if (kw.has('Voo') || kw.has('Alcance')) s += 6.2;
      if (card.type === 'creature' && card.cost >= 4) s += 3.5;
      break;

    case 'mono_purple_crypt':
      if (kw.has('Renascer') || effs.has('revive_from_crypt')) s += 7.2;
      if (card.effects.some((e) => e.trigger === 'on_death')) s += 5.8;
      if (effs.has('summon_token')) s += 3.5;
      break;
    case 'mono_purple_blood':
      if (kw.has('Dreno de Vida') || kw.has('Toque Letal')) s += 6.2;
      if ((card.corruptionCost ?? 0) > 0 || effs.has('damage_enemy_sovereign')) s += 4.2;
      if (card.type === 'creature' && card.cost <= 3) s += 3.2;
      break;
    case 'mono_purple_umbral':
      if (
        effs.has('destroy_enemy') ||
        effs.has('debuff_enemy_vanguard_atk') ||
        effs.has('damage_all_units') ||
        effs.has('steal_small_enemy')
      ) {
        s += 6.8;
      }
      if (card.type === 'spell' || card.type === 'reaction' || card.type === 'relic') s += 3.2;
      break;

    case 'mono_gold_phalanx':
      if (kw.has('Guardião')) s += 6.8;
      if (card.armor >= 2) s += 5.2;
      if (effs.has('buff_all_allies') || effs.has('buff_target_ally')) s += 3.5;
      break;
    case 'mono_gold_celestial':
      if (kw.has('Escudo Divino')) s += 6.2;
      if (kw.has('Voo') || card.ascension) s += 5.8;
      break;
    case 'mono_gold_judgment':
      if (card.type === 'relic') s += 6.5;
      if (effs.has('shield_all_allies') || effs.has('heal_sovereign') || effs.has('heal_all_allies'))
        s += 6.0;
      if (effs.has('destroy_enemy') || effs.has('damage_all_units')) s += 4.0;
      break;

    case 'mono_neutral_axial':
      if (kw.has('Alcance') || kw.has('Guardião') || card.armor >= 1) s += 3.5;
      if (card.type === 'relic' || effs.has('draw_cards')) s += 3.5;
      break;
  }

  return s;
}

function assertValid100MonocolorDeck(
  cardIds: string[],
  expectedDomain: Domain,
  maxAllowedLegendaries = MAX_LEGENDARIES_PER_DECK,
  label = ''
): void {
  if (cardIds.length !== REQUIRED_DECK_SIZE) {
    throw new Error(`[${label}] Expected ${REQUIRED_DECK_SIZE} cards, got ${cardIds.length}`);
  }
  const counts = new Map<string, number>();
  let legCount = 0;
  for (const id of cardIds) {
    const c = CARDS_BY_ID[id];
    if (!c) throw new Error(`[${label}] Unknown card ID: ${id}`);
    if (c.domain !== expectedDomain) {
      throw new Error(`[${label}] Impure domain card ${id} (${c.domain} !== ${expectedDomain})`);
    }
    const next = (counts.get(id) ?? 0) + 1;
    if (next > MAX_COPIES_BY_RARITY[c.rarity]) {
      throw new Error(`[${label}] Copy cap exceeded for ${id} (${c.rarity}): ${next}`);
    }
    counts.set(id, next);
    if (c.rarity === 'legendary') legCount += 1;
  }
  if (legCount > maxAllowedLegendaries) {
    throw new Error(
      `[${label}] Legendary cap exceeded: ${legCount} > ${maxAllowedLegendaries}`
    );
  }
}

function buildSeed100DeckForBlueprint(
  bp: ArchetypeBlueprint,
  domainPool: CardDefinition[],
  alreadyUsedLegendariesInColor: Set<string>
): string[] {
  const scored = domainPool
    .map((card) => {
      const intrinsic = computeIntrinsicCardQuality(card);
      const fit = computeArchetypeSynergyAffinity(card, bp);
      const isWheelGeneral = card.effects.some((e) => e.type === 'break_domain_expansion');
      const dupLegPenalty =
        card.rarity === 'legendary' && !isWheelGeneral && alreadyUsedLegendariesInColor.has(card.id)
          ? 3.2
          : 0;
      return {
        card,
        totalScore: intrinsic + fit - dupLegPenalty,
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore);

  const deck: string[] = [];
  const counts = new Map<string, number>();
  let legCount = 0;
  let earlyDropSlots = 0;
  let creatureSlots = 0;

  const addCopies = (card: CardDefinition, maxWanted: number) => {
    const cap = Math.min(MAX_COPIES_BY_RARITY[card.rarity], maxWanted);
    while ((counts.get(card.id) ?? 0) < cap && deck.length < REQUIRED_DECK_SIZE) {
      if (card.rarity === 'legendary' && legCount >= MAX_LEGENDARIES_PER_DECK) break;
      deck.push(card.id);
      counts.set(card.id, (counts.get(card.id) ?? 0) + 1);
      if (card.rarity === 'legendary') {
        legCount += 1;
        alreadyUsedLegendariesInColor.add(card.id);
      }
      if (card.cost <= 2 && (card.type === 'creature' || card.type === 'relic')) {
        earlyDropSlots += 1;
      }
      if (card.type === 'creature') creatureSlots += 1;
    }
  };

  for (const item of scored) {
    if (earlyDropSlots >= bp.minEarlyDrops) break;
    if (item.card.cost <= 2 && (item.card.type === 'creature' || item.card.type === 'relic')) {
      addCopies(item.card, MAX_COPIES_BY_RARITY[item.card.rarity]);
    }
  }
  for (const item of scored) {
    if (creatureSlots >= bp.minCreatures || deck.length >= 82) break;
    if (item.card.type === 'creature' && item.card.cost <= 6) {
      addCopies(item.card, MAX_COPIES_BY_RARITY[item.card.rarity]);
    }
  }
  for (const item of scored) {
    if (deck.length >= REQUIRED_DECK_SIZE) break;
    addCopies(item.card, MAX_COPIES_BY_RARITY[item.card.rarity]);
  }

  assertValid100MonocolorDeck(deck, bp.domain, MAX_LEGENDARIES_PER_DECK, `seed:${bp.id}`);
  return deck;
}

/**
 * Builds a valid 100-card Exploration Deck prioritizing under-sampled cards in `arch.domainPool`
 * while preserving a playable curve backbone so every card gets realistic combat evaluation.
 */
function buildExploration100Deck(
  arch: ArchetypeEvoState,
  targetCards: CardDefinition[]
): string[] {
  const deck: string[] = [];
  const counts = new Map<string, number>();
  let legCount = 0;
  let earlyDrops = 0;

  const tryAdd = (c: CardDefinition, wanted: number) => {
    const cap = Math.min(MAX_COPIES_BY_RARITY[c.rarity], wanted);
    while ((counts.get(c.id) ?? 0) < cap && deck.length < REQUIRED_DECK_SIZE) {
      if (c.rarity === 'legendary' && legCount >= MAX_LEGENDARIES_PER_DECK) break;
      deck.push(c.id);
      counts.set(c.id, (counts.get(c.id) ?? 0) + 1);
      if (c.rarity === 'legendary') legCount += 1;
      if (c.cost <= 2 && (c.type === 'creature' || c.type === 'relic')) earlyDrops += 1;
    }
  };

  // 1. Pack target under-sampled cards first (up to 58 slots, up to 10 Legendaries)
  for (const tc of targetCards) {
    if (deck.length >= 58) break;
    tryAdd(tc, MAX_COPIES_BY_RARITY[tc.rarity]);
  }

  // 2. Ensure playable early curve from current Champion list so games don't brick artificially
  for (const id of arch.cardIds) {
    if (earlyDrops >= 26 || deck.length >= 84) break;
    const c = CARDS_BY_ID[id]!;
    if (c.cost <= 2 && (c.type === 'creature' || c.type === 'relic')) {
      tryAdd(c, 1);
    }
  }

  // 3. Fill remainder up to 100 from Champion deck, then domainPool
  for (const id of arch.cardIds) {
    if (deck.length >= REQUIRED_DECK_SIZE) break;
    tryAdd(CARDS_BY_ID[id]!, 1);
  }
  for (const c of arch.domainPool) {
    if (deck.length >= REQUIRED_DECK_SIZE) break;
    tryAdd(c, MAX_COPIES_BY_RARITY[c.rarity]);
  }

  assertValid100MonocolorDeck(deck, arch.bp.domain, MAX_LEGENDARIES_PER_DECK, `explore:${arch.bp.id}`);
  return deck;
}

interface ArchetypeEvoState {
  bp: ArchetypeBlueprint;
  domainPool: CardDefinition[];
  cardIds: string[];
  prevGenCardIds: string[];
  weights: AiDecisionWeights;
  profile: DeckLearnedAiProfile;
  cardStats: Map<string, CardEvoTelemetry>;
  pairStats: Map<string, PairEvoTelemetry>;
  ucbPulls: Map<string, number>;
  ucbRewardSum: Map<string, number>;
  totalGames: number;
  totalWinsScore: number;
  seedWinRate: number;
  latestWinRate: number;
  jaccardStability: number;
  medianChampionCardCi95: number;
}

function computeMultisetJaccard(deckA: string[], deckB: string[]): number {
  const cA = new Map<string, number>();
  const cB = new Map<string, number>();
  for (const id of deckA) cA.set(id, (cA.get(id) ?? 0) + 1);
  for (const id of deckB) cB.set(id, (cB.get(id) ?? 0) + 1);
  const allKeys = new Set([...cA.keys(), ...cB.keys()]);
  let inter = 0;
  let uni = 0;
  for (const k of allKeys) {
    const a = cA.get(k) ?? 0;
    const b = cB.get(k) ?? 0;
    inter += Math.min(a, b);
    uni += Math.max(a, b);
  }
  return uni > 0 ? inter / uni : 1;
}

function mergeWorkerTelemetryIntoArch(
  arch: ArchetypeEvoState,
  matchesAdded: number,
  winsScoreAdded: number,
  cardEntries?: Array<[string, CardEvoTelemetry]>,
  pairEntries?: Array<[string, PairEvoTelemetry]>
): void {
  arch.totalGames += matchesAdded;
  arch.totalWinsScore += winsScoreAdded;

  if (cardEntries) {
    for (const [cid, delta] of cardEntries) {
      const dst = getOrCreateCardEvo(arch.cardStats, cid);
      dst.drawnGames += delta.drawnGames;
      dst.playedGames += delta.playedGames;
      dst.playedScoreSum += delta.playedScoreSum;
      dst.stuckInHandGames += delta.stuckInHandGames;
      dst.keptMulliganGames += delta.keptMulliganGames;
      dst.keptMulliganScoreSum += delta.keptMulliganScoreSum;
      dst.channeledEarlyGames += delta.channeledEarlyGames;
      dst.channeledEarlyScoreSum += delta.channeledEarlyScoreSum;

      if (delta.playedGames > 0) {
        arch.ucbPulls.set(cid, (arch.ucbPulls.get(cid) ?? 0) + delta.playedGames);
        arch.ucbRewardSum.set(cid, (arch.ucbRewardSum.get(cid) ?? 0) + delta.playedScoreSum);
      }
    }
  }

  if (pairEntries) {
    for (const [key, delta] of pairEntries) {
      let dst = arch.pairStats.get(key);
      if (!dst) {
        dst = { cardA: delta.cardA, cardB: delta.cardB, coPlayGames: 0, coPlayScoreSum: 0 };
        arch.pairStats.set(key, dst);
      }
      dst.coPlayGames += delta.coPlayGames;
      dst.coPlayScoreSum += delta.coPlayScoreSum;
    }
  }
}

function unpackIntoDomainTrajectories(
  sink: Map<Domain, ValueTrainingSample[]>,
  domain: Domain,
  packed: PackedTrajectoryBatch | undefined,
  capPerDomain: number
): void {
  if (!packed || packed.count === 0) return;
  const arr = sink.get(domain);
  if (!arr || arr.length >= capPerDomain) return;
  const limit = Math.min(packed.count, capPerDomain - arr.length);
  for (let i = 0; i < limit; i++) {
    const start = i * VALUE_MLP_INPUT_DIM;
    const feat = packed.featuresFlat.slice(start, start + VALUE_MLP_INPUT_DIM);
    arr.push({
      features: feat,
      target: packed.targets[i],
      weight: packed.weights[i],
    });
  }
}

/**
 * Synthesizes Empirical-Bayes Shapley rankings WITH exact posterior Standard Error & 95% CI,
 * plus Lower-Confidence-Bound (LCB 95%) audited Pairwise Combos (`coPlayGames >= 35`).
 */
function synthesizeLearnedProfileAndShapley(
  arch: ArchetypeEvoState,
  gen: number,
  minComboCoPlays = 35
): {
  profile: DeckLearnedAiProfile;
  shapleyRanking: StabilizedCardShapleyMetric[];
  medianDeckCardCi95: number;
} {
  const baseWr = arch.totalGames > 0 ? arch.totalWinsScore / arch.totalGames : 0.5;
  const kShrink = 12;

  const bestPairLiftForCard = new Map<string, number>();
  const discoveredCombos: Array<DiscoveredCardCombo & { liftLcb95: number }> = [];

  for (const pair of arch.pairStats.values()) {
    if (pair.coPlayGames < 16) continue;
    const nPair = pair.coPlayGames;
    const pairWr = (pair.coPlayScoreSum + 6 * baseWr) / (nPair + 6);
    const pairSe = Math.sqrt((pairWr * (1 - pairWr)) / (nPair + 7));

    const stA = arch.cardStats.get(pair.cardA);
    const stB = arch.cardStats.get(pair.cardB);
    const wrA = stA ? (stA.playedScoreSum + kShrink * baseWr) / (stA.playedGames + kShrink) : baseWr;
    const wrB = stB ? (stB.playedScoreSum + kShrink * baseWr) / (stB.playedGames + kShrink) : baseWr;

    const rawPairLift = pairWr - Math.max(wrA, wrB);
    // Conservative shrunk lift for Shapley credit
    const conservativePairLift = Math.max(0, rawPairLift - 0.85 * pairSe);

    if (conservativePairLift > (bestPairLiftForCard.get(pair.cardA) ?? 0)) {
      bestPairLiftForCard.set(pair.cardA, conservativePairLift);
    }
    if (conservativePairLift > (bestPairLiftForCard.get(pair.cardB) ?? 0)) {
      bestPairLiftForCard.set(pair.cardB, conservativePairLift);
    }

    const liftOverBase = pairWr - baseWr;
    const liftLcb95 = liftOverBase - 1.645 * pairSe;

    if (nPair >= minComboCoPlays && liftLcb95 >= 0.015 && rawPairLift >= 0.015) {
      const cA = CARDS_BY_ID[pair.cardA];
      const cB = CARDS_BY_ID[pair.cardB];
      if (cA && cB) {
        discoveredCombos.push({
          cardAId: pair.cardA,
          cardBId: pair.cardB,
          coPlayWinRate: Math.round(pairWr * 1000) / 1000,
          liftOverBaseline: Math.round(liftOverBase * 1000) / 1000,
          liftLcb95,
          sampleCount: nPair,
          synergyNote: `${cA.name} + ${cB.name} (+${Math.round(liftOverBase * 100)}% WR | IC95% ±${(1.96 * pairSe * 100).toFixed(1)}%, n=${nPair})`,
        });
      }
    }
  }

  discoveredCombos.sort((a, b) => b.liftLcb95 - a.liftLcb95);
  const topCombos: DiscoveredCardCombo[] = discoveredCombos.slice(0, 12).map(
    ({ liftLcb95: _unused, ...rest }) => rest
  );

  const shapleyRanking: StabilizedCardShapleyMetric[] = [];
  const mulliganKeepCandidates: Array<{ id: string; score: number }> = [];
  const channelPrioCandidates: Array<{ id: string; score: number }> = [];
  const channelAvoidIds: string[] = [];
  const highImpactCardBoosts: Record<string, number> = {};

  for (const card of arch.domainPool) {
    const st = arch.cardStats.get(card.id);
    const playedGames = st?.playedGames ?? 0;
    const playedWr =
      ((st?.playedScoreSum ?? 0) + kShrink * baseWr) / (playedGames + kShrink);
    const posteriorSe = Math.sqrt((playedWr * (1 - playedWr)) / (playedGames + kShrink + 1));
    const ci95HalfWidth = 1.96 * posteriorSe;

    const drawnGames = Math.max(1, st?.drawnGames ?? 0);
    const stuckRate = st && st.drawnGames >= 10 ? st.stuckInHandGames / drawnGames : 0.15;
    const pairLift = Math.max(0, bestPairLiftForCard.get(card.id) ?? 0);

    const shapley = (playedWr - baseWr) - 0.16 * (stuckRate - 0.15) + 0.35 * pairLift;
    // Lower confidence bound prevents fluke low-sample cards from outranking proven staples
    const shapleyLcb = shapley - 1.28 * posteriorSe;

    if (playedGames >= 10) {
      shapleyRanking.push({
        cardId: card.id,
        cardName: card.name,
        shapleyValue: Math.round(shapley * 10000) / 10000,
        shapleyLcb: Math.round(shapleyLcb * 10000) / 10000,
        ci95HalfWidth: Math.round(ci95HalfWidth * 10000) / 10000,
        playedWinRate: Math.round(playedWr * 1000) / 1000,
        stuckInHandRate: Math.round(stuckRate * 1000) / 1000,
        samples: playedGames,
      });
    }

    if (playedGames >= 20 && shapleyLcb >= 0.015) {
      highImpactCardBoosts[card.id] = Math.round(clamp(shapley * 180, 4, 24) * 10) / 10;
      if (card.rarity === 'legendary' || shapleyLcb >= 0.035) {
        channelAvoidIds.push(card.id);
      }
    }

    if (st && st.keptMulliganGames >= 15 && card.cost <= 3) {
      const keptWr = (st.keptMulliganScoreSum + 8 * baseWr) / (st.keptMulliganGames + 8);
      const keptSe = Math.sqrt((keptWr * (1 - keptWr)) / (st.keptMulliganGames + 9));
      if (keptWr - 0.8 * keptSe >= baseWr + 0.008) {
        mulliganKeepCandidates.push({ id: card.id, score: keptWr - 0.5 * keptSe });
      }
    }

    if (st && st.channeledEarlyGames >= 12 && card.rarity !== 'legendary') {
      const chanWr = (st.channeledEarlyScoreSum + 8 * baseWr) / (st.channeledEarlyGames + 8);
      if (chanWr >= baseWr) {
        channelPrioCandidates.push({ id: card.id, score: chanWr + stuckRate * 0.2 });
      }
    }
  }

  // Sort by conservative LCB-blended Shapley so top cards are both high-impact AND well-sampled!
  shapleyRanking.sort((a, b) => (0.65 * b.shapleyLcb + 0.35 * b.shapleyValue) - (0.65 * a.shapleyLcb + 0.35 * a.shapleyValue));
  mulliganKeepCandidates.sort((a, b) => b.score - a.score);
  channelPrioCandidates.sort((a, b) => b.score - a.score);

  const ciByCard = new Map<string, number>();
  for (const s of shapleyRanking) ciByCard.set(s.cardId, s.ci95HalfWidth);
  const deckCis = Array.from(new Set(arch.cardIds))
    .map((id) => ciByCard.get(id) ?? 0.18)
    .sort((a, b) => a - b);
  const medianDeckCardCi95 =
    deckCis.length > 0 ? deckCis[Math.floor(deckCis.length / 2)] : 0.18;

  const profile: DeckLearnedAiProfile = {
    deckId: arch.bp.id,
    deckName: arch.bp.name,
    archetypeTag: arch.bp.tacticalIdentity,
    generationsTrained: gen,
    matchesSimulated: arch.totalGames,
    baselineWinRate: Math.round(arch.seedWinRate * 1000) / 1000,
    trainedWinRate: Math.round(arch.latestWinRate * 1000) / 1000,
    weights: { ...arch.weights },
    mulliganKeepIds: mulliganKeepCandidates.slice(0, 12).map((x) => x.id),
    channelPriorityIds: channelPrioCandidates.slice(0, 10).map((x) => x.id),
    channelAvoidIds: channelAvoidIds.slice(0, 12),
    highImpactCardBoosts,
    synergyPairs: topCombos.slice(0, 10).map((c) => [c.cardAId, c.cardBId]),
    discoveredCombos: topCombos,
  };

  return { profile, shapleyRanking, medianDeckCardCi95 };
}

function proposeChallengerDeckAndWeights(
  arch: ArchetypeEvoState,
  shapleyRanking: StabilizedCardShapleyMetric[],
  gen: number,
  rng: () => number
): { challengerCardIds: string[]; challengerWeights: AiDecisionWeights } {
  const currentIds = arch.cardIds.slice();
  const counts = new Map<string, number>();
  let legCount = 0;
  for (const id of currentIds) {
    counts.set(id, (counts.get(id) ?? 0) + 1);
    if (CARDS_BY_ID[id]?.rarity === 'legendary') legCount += 1;
  }

  const lcbById = new Map<string, number>();
  for (const s of shapleyRanking) {
    lcbById.set(s.cardId, 0.65 * s.shapleyLcb + 0.35 * s.shapleyValue);
  }

  const uniqueInDeck = Array.from(counts.keys());
  uniqueInDeck.sort((a, b) => {
    const ca = CARDS_BY_ID[a]!;
    const cb = CARDS_BY_ID[b]!;
    const sa = (lcbById.get(a) ?? -0.03) + computeArchetypeSynergyAffinity(ca, arch.bp) * 0.007;
    const sb = (lcbById.get(b) ?? -0.03) + computeArchetypeSynergyAffinity(cb, arch.bp) * 0.007;
    return sa - sb;
  });

  // Anneal mutation step size: swap 4 cards early, 2 cards in late fine-tuning generations
  const slotsToSwap = gen <= 6 ? 4 : gen <= 11 ? 3 : 2;
  let removed = 0;
  for (const weakId of uniqueInDeck) {
    if (removed >= slotsToSwap) break;
    const card = CARDS_BY_ID[weakId]!;
    if (card.effects.some((e) => e.type === 'break_domain_expansion')) continue;
    const idx = currentIds.indexOf(weakId);
    if (idx !== -1) {
      currentIds.splice(idx, 1);
      counts.set(weakId, (counts.get(weakId) ?? 1) - 1);
      if (card.rarity === 'legendary') legCount -= 1;
      removed += 1;
    }
  }

  const totalPulls = Math.max(20, arch.totalGames);
  const baseWr = arch.totalGames > 0 ? arch.totalWinsScore / arch.totalGames : 0.5;
  const exploreCoef = Math.max(0.05, 0.15 * Math.pow(0.92, gen - 1));

  const ucbCandidates = arch.domainPool
    .map((card) => {
      const pulls = arch.ucbPulls.get(card.id) ?? 0;
      const rew = arch.ucbRewardSum.get(card.id) ?? 0;
      const empMean = (rew + 8 * baseWr) / (pulls + 8);
      const exploration = exploreCoef * Math.sqrt(Math.log(totalPulls) / (pulls + 1));
      const prior =
        (computeIntrinsicCardQuality(card) + computeArchetypeSynergyAffinity(card, arch.bp)) *
        0.011;
      const noise = (rng() - 0.5) * 0.018;
      return {
        card,
        ucbScore: empMean + exploration + prior + noise,
      };
    })
    .sort((a, b) => b.ucbScore - a.ucbScore);

  for (const cand of ucbCandidates) {
    if (currentIds.length >= REQUIRED_DECK_SIZE) break;
    const c = cand.card;
    const curCopies = counts.get(c.id) ?? 0;
    if (curCopies >= MAX_COPIES_BY_RARITY[c.rarity]) continue;
    if (c.rarity === 'legendary' && legCount >= MAX_LEGENDARIES_PER_DECK) continue;

    currentIds.push(c.id);
    counts.set(c.id, curCopies + 1);
    if (c.rarity === 'legendary') legCount += 1;
  }

  for (const c of arch.domainPool) {
    if (currentIds.length >= REQUIRED_DECK_SIZE) break;
    const curCopies = counts.get(c.id) ?? 0;
    if (curCopies >= MAX_COPIES_BY_RARITY[c.rarity]) continue;
    if (c.rarity === 'legendary' && legCount >= MAX_LEGENDARIES_PER_DECK) continue;
    currentIds.push(c.id);
    counts.set(c.id, curCopies + 1);
    if (c.rarity === 'legendary') legCount += 1;
  }

  assertValid100MonocolorDeck(
    currentIds,
    arch.bp.domain,
    MAX_LEGENDARIES_PER_DECK,
    `challenger:${arch.bp.id}`
  );

  const wNext: AiDecisionWeights = { ...arch.weights };
  const keys: Array<keyof AiDecisionWeights> = [
    'aggroFaceBias',
    'tradeValueBias',
    'guardianPriority',
    'flyingEvasionBias',
    'spellHoldPatience',
    'relicPriority',
    'ascensionEagerness',
    'domainExpansionEagerness',
    'sovPowerTempoBias',
    'synergyHoldBonus',
    'mulliganCurveTarget',
  ];
  const stepScale = gen <= 8 ? 0.14 : 0.08;
  for (let m = 0; m < 3; m++) {
    const k = keys[Math.floor(rng() * keys.length)];
    const delta = (rng() - 0.5) * stepScale;
    if (k === 'synergyHoldBonus') {
      wNext[k] = Math.round(clamp(wNext[k] + delta * 35, 6, 36));
    } else if (k === 'mulliganCurveTarget') {
      wNext[k] = Math.round(clamp(wNext[k] + delta * 2.5, 2.2, 3.8) * 10) / 10;
    } else {
      wNext[k] = Math.round(clamp(wNext[k] + delta, 0.65, 1.55) * 100) / 100;
    }
  }

  return { challengerCardIds: currentIds, challengerWeights: wNext };
}

function distillGraduatedTierDecksForArchetype(
  arch: ArchetypeEvoState,
  shapleyRanking: StabilizedCardShapleyMetric[]
): Record<AiSkillTier, StabilizedTierDeckMetadata> {
  const shapleyMap = new Map<string, number>();
  for (const s of shapleyRanking) shapleyMap.set(s.cardId, s.shapleyValue);

  const tierSpecs: Record<
    AiSkillTier,
    { label: string; maxLeg: number; maxRare: number; dropTopSynergyCount: number }
  > = {
    1: {
      label: 'Tier I • Patrulha de Fronteira',
      maxLeg: 0,
      maxRare: 4,
      dropTopSynergyCount: 16,
    },
    2: {
      label: 'Tier II • Guarnição Regular',
      maxLeg: 1,
      maxRare: 9,
      dropTopSynergyCount: 11,
    },
    3: {
      label: 'Tier III • Bastião Veterano',
      maxLeg: 3,
      maxRare: 15,
      dropTopSynergyCount: 8,
    },
    4: {
      label: 'Tier IV • Elite do Alto Trono',
      maxLeg: 5,
      maxRare: 21,
      dropTopSynergyCount: 5,
    },
    5: {
      label: 'Tier V • Campeão Soberano Ápice',
      maxLeg: 10,
      maxRare: 99,
      dropTopSynergyCount: 0,
    },
  };

  const computeMeta = (tier: AiSkillTier, ids: string[]): StabilizedTierDeckMetadata => {
    let leg = 0;
    let rare = 0;
    let unc = 0;
    let com = 0;
    let costSum = 0;
    for (const id of ids) {
      const c = CARDS_BY_ID[id]!;
      costSum += c.cost;
      if (c.rarity === 'legendary') leg += 1;
      else if (c.rarity === 'rare') rare += 1;
      else if (c.rarity === 'uncommon') unc += 1;
      else com += 1;
    }
    return {
      tier,
      tierLabel: tierSpecs[tier].label,
      cardIds: ids,
      legendaryCount: leg,
      rareCount: rare,
      uncommonCount: unc,
      commonCount: com,
      avgCost: Math.round((costSum / ids.length) * 100) / 100,
      benchmarkWinRateVsLadder: 0,
    };
  };

  const out: Partial<Record<AiSkillTier, StabilizedTierDeckMetadata>> = {
    5: computeMeta(5, arch.cardIds.slice()),
  };

  const comboPowerSet = new Set<string>();
  for (const combo of arch.profile.discoveredCombos.slice(0, 8)) {
    comboPowerSet.add(combo.cardAId);
    comboPowerSet.add(combo.cardBId);
  }
  const topShapleyIds = shapleyRanking.map((s) => s.cardId);

  for (const tier of [4, 3, 2, 1] as AiSkillTier[]) {
    const spec = tierSpecs[tier];
    const excludedIds = new Set<string>();

    if (tier <= 3) {
      for (const c of arch.domainPool) {
        if (c.effects.some((e) => e.type === 'break_domain_expansion')) {
          excludedIds.add(c.id);
        }
      }
    }

    let dropped = 0;
    for (const sid of topShapleyIds) {
      if (dropped >= spec.dropTopSynergyCount) break;
      const c = CARDS_BY_ID[sid];
      if (!c) continue;
      if (c.rarity === 'legendary' || comboPowerSet.has(sid) || dropped < spec.dropTopSynergyCount) {
        excludedIds.add(sid);
        dropped += 1;
      }
    }

    const deck: string[] = [];
    const counts = new Map<string, number>();
    let legCount = 0;
    let rareCount = 0;

    for (const cid of arch.cardIds) {
      if (excludedIds.has(cid)) continue;
      const c = CARDS_BY_ID[cid]!;
      if (c.rarity === 'legendary' && legCount >= spec.maxLeg) continue;
      if (c.rarity === 'rare' && rareCount >= spec.maxRare) continue;
      deck.push(cid);
      counts.set(cid, (counts.get(cid) ?? 0) + 1);
      if (c.rarity === 'legendary') legCount += 1;
      if (c.rarity === 'rare') rareCount += 1;
    }

    const fillCandidates = arch.domainPool
      .filter((c) => !excludedIds.has(c.id))
      .sort((a, b) => {
        if (tier === 1) {
          const ra = a.rarity === 'common' ? 3 : a.rarity === 'uncommon' ? 2.5 : 0.5;
          const rb = b.rarity === 'common' ? 3 : b.rarity === 'uncommon' ? 2.5 : 0.5;
          const curveA = -Math.abs(a.cost - 3.2) * 0.4;
          const curveB = -Math.abs(b.cost - 3.2) * 0.4;
          return rb + curveB - (ra + curveA);
        }
        const sa =
          computeArchetypeSynergyAffinity(a, arch.bp) +
          computeIntrinsicCardQuality(a) * (tier >= 3 ? 0.8 : 0.35) +
          (shapleyMap.get(a.id) ?? 0) * 15;
        const sb =
          computeArchetypeSynergyAffinity(b, arch.bp) +
          computeIntrinsicCardQuality(b) * (tier >= 3 ? 0.8 : 0.35) +
          (shapleyMap.get(b.id) ?? 0) * 15;
        return sb - sa;
      });

    const addUpTo = (allowExcludedFallback: boolean) => {
      const source = allowExcludedFallback ? arch.domainPool : fillCandidates;
      for (const c of source) {
        if (deck.length >= REQUIRED_DECK_SIZE) break;
        if (c.rarity === 'legendary' && legCount >= spec.maxLeg) continue;
        if (c.rarity === 'rare' && rareCount >= spec.maxRare) continue;
        const cap = MAX_COPIES_BY_RARITY[c.rarity];
        while ((counts.get(c.id) ?? 0) < cap && deck.length < REQUIRED_DECK_SIZE) {
          if (c.rarity === 'legendary' && legCount >= spec.maxLeg) break;
          if (c.rarity === 'rare' && rareCount >= spec.maxRare) break;
          deck.push(c.id);
          counts.set(c.id, (counts.get(c.id) ?? 0) + 1);
          if (c.rarity === 'legendary') legCount += 1;
          if (c.rarity === 'rare') rareCount += 1;
        }
      }
    };

    addUpTo(false);
    if (deck.length < REQUIRED_DECK_SIZE) addUpTo(true);

    assertValid100MonocolorDeck(deck, arch.bp.domain, spec.maxLeg, `tier${tier}:${arch.bp.id}`);
    out[tier] = computeMeta(tier, deck);
  }

  return out as Record<AiSkillTier, StabilizedTierDeckMetadata>;
}

// ============================================================================
// MAIN PARALLELIZED ADAPTIVE CONVERGENCE PIPELINE
// ============================================================================
async function main() {
  const tStart = Date.now();
  const rng = createRng(20261031);
  const workerCount = Math.max(2, Math.min(10, os.cpus().length - 2));

  // Statistical stopping thresholds
  const MIN_GENERATIONS = 10;
  const MAX_GENERATIONS = 16;
  const TARGET_DECK_JACCARD_STABILITY = 0.975; // >= 97.5% deck stability across 2 consecutive gens
  const TARGET_CARD_MEDIAN_CI95 = 0.046; // <= ±4.6% median 95% MoE across Champion deck cards
  const TARGET_TIER_LADDER_CI95 = 0.030; // <= ±3.0% 95% MoE on every Sovereign Tier (I..V)
  const MIN_COMBO_COPLAYS = 35;
  const TRAJECTORY_CAP_PER_DOMAIN = 28000;

  console.log('================================================================================');
  console.log(' CHROMATIC PACT — TREINAMENTO MONOCOLOR PARALELO COM CONVERGÊNCIA ESTATÍSTICA');
  console.log(` • Pool Paralelo: ${workerCount} Worker Threads (${os.cpus().length} CPUs lógicas)`);
  console.log(
    ` • Critérios IC 95%: Escada Tier <= ±${(TARGET_TIER_LADDER_CI95 * 100).toFixed(1)}% | Cartas <= ±${(TARGET_CARD_MEDIAN_CI95 * 100).toFixed(1)}% | Jaccard >= ${(TARGET_DECK_JACCARD_STABILITY * 100).toFixed(1)}%`
  );
  console.log('================================================================================');

  const pool = new SimulationWorkerPool(workerCount);

  try {
    // 1. Seed all 16 Pure Monocolor Archetypes
    const poolByDomain = new Map<Domain, CardDefinition[]>();
    for (const dom of ['green', 'red', 'blue', 'purple', 'gold', 'neutral'] as Domain[]) {
      const cards = ALL_CARDS.filter((c) => c.domain === dom);
      poolByDomain.set(dom, cards);
    }

    const usedLegsByDomain = new Map<Domain, Set<string>>();
    const archetypes: ArchetypeEvoState[] = [];
    const archById = new Map<MonocolorArchetypeId, ArchetypeEvoState>();

    for (const bp of ARCHETYPE_BLUEPRINTS) {
      if (!usedLegsByDomain.has(bp.domain)) usedLegsByDomain.set(bp.domain, new Set());
      const domPool = poolByDomain.get(bp.domain)!;
      const seedIds = buildSeed100DeckForBlueprint(bp, domPool, usedLegsByDomain.get(bp.domain)!);

      const initProfile: DeckLearnedAiProfile = {
        deckId: bp.id,
        deckName: bp.name,
        archetypeTag: bp.tacticalIdentity,
        generationsTrained: 0,
        matchesSimulated: 0,
        baselineWinRate: 0.5,
        trainedWinRate: 0.5,
        weights: { ...bp.seedWeights },
        mulliganKeepIds: [],
        channelPriorityIds: [],
        channelAvoidIds: [],
        highImpactCardBoosts: {},
        synergyPairs: [],
        discoveredCombos: [],
      };

      const st: ArchetypeEvoState = {
        bp,
        domainPool: domPool,
        cardIds: seedIds,
        prevGenCardIds: seedIds.slice(),
        weights: { ...bp.seedWeights },
        profile: initProfile,
        cardStats: new Map(),
        pairStats: new Map(),
        ucbPulls: new Map(),
        ucbRewardSum: new Map(),
        totalGames: 0,
        totalWinsScore: 0,
        seedWinRate: 0.5,
        latestWinRate: 0.5,
        jaccardStability: 0,
        medianChampionCardCi95: 0.25,
      };
      archetypes.push(st);
      archById.set(bp.id, st);
    }

    const trajectoriesByDomain = new Map<Domain, ValueTrainingSample[]>();
    for (const dom of ['green', 'red', 'blue', 'purple', 'gold', 'neutral'] as Domain[]) {
      trajectoriesByDomain.set(dom, []);
    }

    const trainedMlps = new Map<Domain, SerializedValueMlp>();
    let totalMatchesSimulated = 0;

    // 1B. Full-Pool Exploratory Bandit Sweep (covers ALL 173 cards per color including all Legendaries!)
    console.log('\n[Etapa 1B] Varredura Exploratória Inicial das 1.038 Cartas (Cobertura de Lendárias & Raras)...');
    const exploreStart = Date.now();
    const exploreJobs: Array<{
      archA: ArchetypeEvoState;
      archB: ArchetypeEvoState;
      promise: Promise<WorkerPairBatchResponse>;
    }> = [];

    for (let idx = 0; idx < archetypes.length; idx++) {
      const arch = archetypes[idx];
      // Partition all 173 domain cards into 5 chunks (~35 cards each) so every single Legendary & Rare gets played!
      const sortedByRarity = arch.domainPool.slice().sort((a, b) => {
        const rw: Record<Rarity, number> = { legendary: 4, rare: 3, uncommon: 2, common: 1 };
        return rw[b.rarity] - rw[a.rarity];
      });
      const chunkSize = 35;
      for (let cStart = 0; cStart < sortedByRarity.length; cStart += chunkSize) {
        const chunk = sortedByRarity.slice(cStart, cStart + chunkSize);
        const expDeck = buildExploration100Deck(arch, chunk);
        const opp = archetypes[(idx + 3 + Math.floor(cStart / chunkSize) * 2) % archetypes.length];
        exploreJobs.push({
          archA: arch,
          archB: opp,
          promise: pool.runBatch({
            deckACardIds: expDeck,
            deckBCardIds: opp.cardIds,
            nameA: arch.bp.name,
            nameB: opp.bp.name,
            deckIdA: arch.bp.id,
            deckIdB: opp.bp.id,
            domainA: arch.bp.domain,
            domainB: opp.bp.domain,
            profileA: arch.profile,
            profileB: opp.profile,
            skillTierA: 3,
            skillTierB: 3,
            mlpA: null,
            mlpB: null,
            fastRollout: true,
            numMirrorPairs: 10, // 20 full games per chunk!
            collectTelemetryA: true,
            collectTelemetryB: true,
            maxTrajectoriesPerSide: 90,
          }),
        });
      }
    }

    const exploreResults = await Promise.all(exploreJobs.map((j) => j.promise));
    for (let i = 0; i < exploreJobs.length; i++) {
      const job = exploreJobs[i];
      const res = exploreResults[i];
      totalMatchesSimulated += res.matchesPlayed;
      mergeWorkerTelemetryIntoArch(
        job.archA,
        res.matchesPlayed,
        res.scoreASum,
        res.cardTelemetryA,
        res.pairTelemetryA
      );
      mergeWorkerTelemetryIntoArch(
        job.archB,
        res.matchesPlayed,
        res.matchesPlayed - res.scoreASum,
        res.cardTelemetryB,
        res.pairTelemetryB
      );
      unpackIntoDomainTrajectories(
        trajectoriesByDomain,
        job.archA.bp.domain,
        res.trajectoriesA,
        TRAJECTORY_CAP_PER_DOMAIN
      );
      unpackIntoDomainTrajectories(
        trajectoriesByDomain,
        job.archB.bp.domain,
        res.trajectoriesB,
        TRAJECTORY_CAP_PER_DOMAIN
      );
    }
    console.log(
      `   ✓ Varredura concluída em ${((Date.now() - exploreStart) / 1000).toFixed(1)}s (${totalMatchesSimulated} duelos exploratórios).`
    );

    const getSparringPartners = (arch: ArchetypeEvoState): ArchetypeEvoState[] => {
      const sameColor = archetypes.filter(
        (a) => a.bp.domain === arch.bp.domain && a.bp.id !== arch.bp.id
      );
      const crossColor: ArchetypeEvoState[] = [];
      for (const dom of ['green', 'red', 'blue', 'purple', 'gold', 'neutral'] as Domain[]) {
        if (dom === arch.bp.domain) continue;
        const candidates = archetypes.filter((a) => a.bp.domain === dom);
        if (candidates.length > 0) {
          crossColor.push(candidates[Math.floor(rng() * candidates.length)]);
        }
      }
      return [...sameColor, ...crossColor];
    };

    // 2. Adaptive Multi-Generation Shapley-UCB Co-Evolution Loop
    let generationsExecuted = 0;
    let consecutiveStableGens = 0;
    let convergedEarly = false;
    let finalMeanJaccard = 0;
    let finalMaxMedianCardCi95 = 1;

    for (let gen = 1; gen <= MAX_GENERATIONS; gen++) {
      generationsExecuted = gen;
      const genStart = Date.now();

      // Refresh Domain Value MLPs at Gen 3, Gen 7, and Gen 11
      if (gen === 3 || gen === 7 || gen === 11) {
        console.log(
          `\n[Motor Neural — Geração ${gen}] Atualizando 6 Redes Value MLP (48->64->32->1) via Adam...`
        );
        for (const [dom, samples] of trajectoriesByDomain.entries()) {
          if (samples.length >= 400) {
            const mlp = trainValueMlpWithAdam(dom, samples, {
              epochs: 18,
              batchSize: 80,
              learningRate: 0.0027,
              seed: 1000 * gen + dom.length,
            });
            trainedMlps.set(dom, mlp);
            console.log(
              `   • MLP [${dom.toUpperCase().padEnd(7)}]: ${samples.length.toString().padStart(5)} estados | MSE ${mlp.initialMse.toFixed(4)} -> ${mlp.finalMse.toFixed(4)} | SignAcc ${(mlp.signAccuracy * 100).toFixed(1)}%`
            );
          }
        }
      }

      for (const arch of archetypes) {
        arch.prevGenCardIds = arch.cardIds.slice();
      }

      // 2A. Parallel League Round + Targeted Under-Sampled Legendary/Champion Card Boost
      const leagueJobs: Array<{
        archA: ArchetypeEvoState;
        archB: ArchetypeEvoState;
        isPrimaryLeagueForA: boolean;
        promise: Promise<WorkerPairBatchResponse>;
      }> = [];

      for (const arch of archetypes) {
        const partners = getSparringPartners(arch);
        for (const opp of partners) {
          leagueJobs.push({
            archA: arch,
            archB: opp,
            isPrimaryLeagueForA: true,
            promise: pool.runBatch({
              deckACardIds: arch.cardIds,
              deckBCardIds: opp.cardIds,
              nameA: arch.bp.name,
              nameB: opp.bp.name,
              deckIdA: arch.bp.id,
              deckIdB: opp.bp.id,
              domainA: arch.bp.domain,
              domainB: opp.bp.domain,
              profileA: arch.profile,
              profileB: opp.profile,
              skillTierA: 3,
              skillTierB: 3,
              mlpA: trainedMlps.get(arch.bp.domain) ?? null,
              mlpB: trainedMlps.get(opp.bp.domain) ?? null,
              fastRollout: true,
              numMirrorPairs: 6, // 12 games per partner * 7 partners = 84 primary games (+ ~84 as opponent = ~168 games/arch/gen!)
              collectTelemetryA: true,
              collectTelemetryB: true,
              maxTrajectoriesPerSide: 55,
            }),
          });
        }

        // Targeted exploration boost for any Champion-deck or top-candidate card still under 45 played samples!
        const underSampledInColor = arch.domainPool
          .filter((c) => {
            const p = arch.cardStats.get(c.id)?.playedGames ?? 0;
            const inChamp = arch.cardIds.includes(c.id);
            return (inChamp && p < 55) || (c.rarity === 'legendary' && p < 35);
          })
          .sort(
            (a, b) =>
              (arch.cardStats.get(a.id)?.playedGames ?? 0) -
              (arch.cardStats.get(b.id)?.playedGames ?? 0)
          );

        if (underSampledInColor.length > 0 && gen <= 10) {
          const boostDeck = buildExploration100Deck(arch, underSampledInColor.slice(0, 28));
          const opp = partners[gen % partners.length];
          leagueJobs.push({
            archA: arch,
            archB: opp,
            isPrimaryLeagueForA: false,
            promise: pool.runBatch({
              deckACardIds: boostDeck,
              deckBCardIds: opp.cardIds,
              nameA: arch.bp.name,
              nameB: opp.bp.name,
              deckIdA: arch.bp.id,
              deckIdB: opp.bp.id,
              domainA: arch.bp.domain,
              domainB: opp.bp.domain,
              profileA: arch.profile,
              profileB: opp.profile,
              skillTierA: 3,
              skillTierB: 3,
              mlpA: trainedMlps.get(arch.bp.domain) ?? null,
              mlpB: trainedMlps.get(opp.bp.domain) ?? null,
              fastRollout: true,
              numMirrorPairs: 8, // +16 targeted games
              collectTelemetryA: true,
              collectTelemetryB: true,
              maxTrajectoriesPerSide: 40,
            }),
          });
        }
      }

      const leagueResults = await Promise.all(leagueJobs.map((j) => j.promise));
      const genScoreByArch = new Map<MonocolorArchetypeId, { score: number; games: number }>();

      for (let i = 0; i < leagueJobs.length; i++) {
        const job = leagueJobs[i];
        const res = leagueResults[i];
        totalMatchesSimulated += res.matchesPlayed;

        mergeWorkerTelemetryIntoArch(
          job.archA,
          res.matchesPlayed,
          res.scoreASum,
          res.cardTelemetryA,
          res.pairTelemetryA
        );
        mergeWorkerTelemetryIntoArch(
          job.archB,
          res.matchesPlayed,
          res.matchesPlayed - res.scoreASum,
          res.cardTelemetryB,
          res.pairTelemetryB
        );

        if (job.isPrimaryLeagueForA) {
          const rec = genScoreByArch.get(job.archA.bp.id) ?? { score: 0, games: 0 };
          rec.score += res.scoreASum;
          rec.games += res.matchesPlayed;
          genScoreByArch.set(job.archA.bp.id, rec);
        }

        unpackIntoDomainTrajectories(
          trajectoriesByDomain,
          job.archA.bp.domain,
          res.trajectoriesA,
          TRAJECTORY_CAP_PER_DOMAIN
        );
        unpackIntoDomainTrajectories(
          trajectoriesByDomain,
          job.archB.bp.domain,
          res.trajectoriesB,
          TRAJECTORY_CAP_PER_DOMAIN
        );
      }

      // 2B. Synthesize Shapley + Propose Challengers + Sequential Confidence-Bound Duel Testing
      const challengerProposals = archetypes.map((arch) => {
        const rec = genScoreByArch.get(arch.bp.id);
        const genWr = rec && rec.games > 0 ? rec.score / rec.games : 0.5;
        if (gen === 1) arch.seedWinRate = genWr;
        arch.latestWinRate = genWr;

        const { profile, shapleyRanking, medianDeckCardCi95 } = synthesizeLearnedProfileAndShapley(
          arch,
          gen,
          MIN_COMBO_COPLAYS
        );
        arch.profile = profile;
        arch.medianChampionCardCi95 = medianDeckCardCi95;

        const { challengerCardIds, challengerWeights } = proposeChallengerDeckAndWeights(
          arch,
          shapleyRanking,
          gen,
          rng
        );
        const challengerProfile: DeckLearnedAiProfile = {
          ...arch.profile,
          weights: challengerWeights,
        };
        return {
          arch,
          challengerCardIds,
          challengerWeights,
          challengerProfile,
          partners: getSparringPartners(arch).slice(0, 4),
          directStat: new PairedStatAccumulator(),
          challGauntStat: new PairedStatAccumulator(),
          incGauntStat: new PairedStatAccumulator(),
          decided: false,
          promoted: false,
        };
      });

      // Up to 3 sequential confidence waves per Challenger vs Incumbent!
      for (let wave = 1; wave <= 3; wave++) {
        const activeProps = challengerProposals.filter((p) => !p.decided);
        if (activeProps.length === 0) break;

        const wavePromises: Array<{
          propIdx: number;
          kind: 'direct' | 'chall_gaunt' | 'inc_gaunt';
          opp: ArchetypeEvoState;
          promise: Promise<WorkerPairBatchResponse>;
        }> = [];

        for (let pIdx = 0; pIdx < challengerProposals.length; pIdx++) {
          const prop = challengerProposals[pIdx];
          if (prop.decided) continue;
          const domMlp = trainedMlps.get(prop.arch.bp.domain) ?? null;

          // 8 mirror pairs (16 direct H2H matches) per wave
          wavePromises.push({
            propIdx: pIdx,
            kind: 'direct',
            opp: prop.arch,
            promise: pool.runBatch({
              deckACardIds: prop.challengerCardIds,
              deckBCardIds: prop.arch.cardIds,
              nameA: `${prop.arch.bp.name} (Challenger)`,
              nameB: prop.arch.bp.name,
              deckIdA: prop.arch.bp.id,
              deckIdB: prop.arch.bp.id,
              domainA: prop.arch.bp.domain,
              domainB: prop.arch.bp.domain,
              profileA: prop.challengerProfile,
              profileB: prop.arch.profile,
              skillTierA: 3,
              skillTierB: 3,
              mlpA: domMlp,
              mlpB: domMlp,
              fastRollout: true,
              numMirrorPairs: 8,
              collectTelemetryA: true,
              collectTelemetryB: true,
              maxTrajectoriesPerSide: 20,
            }),
          });

          // Plus 4 sparring partners * 2 mirror pairs = 16 gauntlet matches each for Challenger & Incumbent
          for (const gp of prop.partners) {
            const gpMlp = trainedMlps.get(gp.bp.domain) ?? null;
            wavePromises.push({
              propIdx: pIdx,
              kind: 'chall_gaunt',
              opp: gp,
              promise: pool.runBatch({
                deckACardIds: prop.challengerCardIds,
                deckBCardIds: gp.cardIds,
                nameA: prop.arch.bp.name,
                nameB: gp.bp.name,
                deckIdA: prop.arch.bp.id,
                deckIdB: gp.bp.id,
                domainA: prop.arch.bp.domain,
                domainB: gp.bp.domain,
                profileA: prop.challengerProfile,
                profileB: gp.profile,
                skillTierA: 3,
                skillTierB: 3,
                mlpA: domMlp,
                mlpB: gpMlp,
                fastRollout: true,
                numMirrorPairs: 2,
                collectTelemetryA: true,
                collectTelemetryB: true,
                maxTrajectoriesPerSide: 10,
              }),
            });
            wavePromises.push({
              propIdx: pIdx,
              kind: 'inc_gaunt',
              opp: gp,
              promise: pool.runBatch({
                deckACardIds: prop.arch.cardIds,
                deckBCardIds: gp.cardIds,
                nameA: prop.arch.bp.name,
                nameB: gp.bp.name,
                deckIdA: prop.arch.bp.id,
                deckIdB: gp.bp.id,
                domainA: prop.arch.bp.domain,
                domainB: gp.bp.domain,
                profileA: prop.arch.profile,
                profileB: gp.profile,
                skillTierA: 3,
                skillTierB: 3,
                mlpA: domMlp,
                mlpB: gpMlp,
                fastRollout: true,
                numMirrorPairs: 2,
                collectTelemetryA: true,
                collectTelemetryB: true,
                maxTrajectoriesPerSide: 10,
              }),
            });
          }
        }

        const waveResults = await Promise.all(wavePromises.map((w) => w.promise));
        for (let i = 0; i < wavePromises.length; i++) {
          const meta = wavePromises[i];
          const res = waveResults[i];
          const prop = challengerProposals[meta.propIdx];
          totalMatchesSimulated += res.matchesPlayed;

          if (meta.kind === 'direct') {
            prop.directStat.addBatch(res.pairCount, res.pairMeanSum, res.pairMeanSumSq);
            // Feed Challenger & Incumbent card telemetry into archetype pool!
            mergeWorkerTelemetryIntoArch(
              prop.arch,
              res.matchesPlayed,
              res.scoreASum,
              res.cardTelemetryA,
              res.pairTelemetryA
            );
            mergeWorkerTelemetryIntoArch(
              prop.arch,
              res.matchesPlayed,
              res.matchesPlayed - res.scoreASum,
              res.cardTelemetryB,
              res.pairTelemetryB
            );
          } else if (meta.kind === 'chall_gaunt') {
            prop.challGauntStat.addBatch(res.pairCount, res.pairMeanSum, res.pairMeanSumSq);
            mergeWorkerTelemetryIntoArch(
              prop.arch,
              res.matchesPlayed,
              res.scoreASum,
              res.cardTelemetryA,
              res.pairTelemetryA
            );
            mergeWorkerTelemetryIntoArch(
              meta.opp,
              res.matchesPlayed,
              res.matchesPlayed - res.scoreASum,
              res.cardTelemetryB,
              res.pairTelemetryB
            );
          } else {
            prop.incGauntStat.addBatch(res.pairCount, res.pairMeanSum, res.pairMeanSumSq);
            mergeWorkerTelemetryIntoArch(
              prop.arch,
              res.matchesPlayed,
              res.scoreASum,
              res.cardTelemetryA,
              res.pairTelemetryA
            );
            mergeWorkerTelemetryIntoArch(
              meta.opp,
              res.matchesPlayed,
              res.matchesPlayed - res.scoreASum,
              res.cardTelemetryB,
              res.pairTelemetryB
            );
          }
        }

        // Evaluate sequential stopping rule for each Challenger
        for (const prop of challengerProposals) {
          if (prop.decided) continue;
          const dirAdv = prop.directStat.mean - 0.5; // Challenger direct H2H edge over Incumbent
          const dirSe = prop.directStat.stdError;
          const gauntAdv = prop.challGauntStat.mean - prop.incGauntStat.mean;
          const gauntSe = Math.hypot(
            prop.challGauntStat.stdError,
            prop.incGauntStat.stdError
          );

          const combinedAdv = 0.55 * dirAdv + 0.45 * gauntAdv;
          const combinedSe = Math.hypot(0.55 * dirSe, 0.45 * gauntSe);
          const lcb90 = combinedAdv - 1.28 * combinedSe;
          const ucb85 = combinedAdv + 1.04 * combinedSe;

          if (lcb90 > 0.004 && combinedAdv >= 0.018) {
            prop.promoted = true;
            prop.decided = true;
          } else if (ucb85 < 0.012 || wave === 3) {
            prop.promoted = false;
            prop.decided = true;
          }
        }
      }

      let promotedInGen = 0;
      let jaccardSum = 0;
      let maxMedianCi95 = 0;

      for (const prop of challengerProposals) {
        if (prop.promoted) {
          prop.arch.cardIds = prop.challengerCardIds;
          prop.arch.weights = prop.challengerWeights;
          prop.arch.latestWinRate = Math.max(prop.arch.latestWinRate, prop.challGauntStat.mean);
          promotedInGen += 1;
        }
        prop.arch.jaccardStability = computeMultisetJaccard(
          prop.arch.prevGenCardIds,
          prop.arch.cardIds
        );
        jaccardSum += prop.arch.jaccardStability;
        if (prop.arch.medianChampionCardCi95 > maxMedianCi95) {
          maxMedianCi95 = prop.arch.medianChampionCardCi95;
        }
      }

      const meanJaccard = jaccardSum / archetypes.length;
      finalMeanJaccard = meanJaccard;
      finalMaxMedianCardCi95 = maxMedianCi95;

      const genSec = ((Date.now() - genStart) / 1000).toFixed(1);
      console.log(
        `[Geração ${String(gen).padStart(2)}/${MAX_GENERATIONS}] ${genSec}s | Promovidos: ${String(promotedInGen).padStart(2)}/16 | Jaccard Médio: ${(meanJaccard * 100).toFixed(1)}% | Max Card IC95% Mediano: ±${(maxMedianCi95 * 100).toFixed(2)}% | Acumulado: ${totalMatchesSimulated.toLocaleString('en-US')} duelos`
      );

      if (
        gen >= MIN_GENERATIONS &&
        meanJaccard >= TARGET_DECK_JACCARD_STABILITY &&
        maxMedianCi95 <= TARGET_CARD_MEDIAN_CI95
      ) {
        consecutiveStableGens += 1;
        if (consecutiveStableGens >= 2) {
          convergedEarly = true;
          console.log(
            `   ✓ Convergência Estatística Atingida na Geração ${gen} (Jaccard >= ${(TARGET_DECK_JACCARD_STABILITY * 100).toFixed(1)}% por 2 gerações e IC95% Mediano <= ±${(TARGET_CARD_MEDIAN_CI95 * 100).toFixed(1)}%)!`
          );
          break;
        }
      } else {
        consecutiveStableGens = 0;
      }
    }

    // 3. Final Deep Training of all 6 Domain Value MLPs (48 -> 64 -> 32 -> 1)
    console.log(
      '\n[Etapa 3] Treinamento Profundo Final das 6 Redes Neurais Value MLP (Adam + Holdout Validation)...'
    );
    let totalTrajectories = 0;
    const domainNetworksOut: Record<string, SerializedValueMlp> = {};

    for (const dom of ['green', 'red', 'blue', 'purple', 'gold', 'neutral'] as Domain[]) {
      const samples = trajectoriesByDomain.get(dom) ?? [];
      totalTrajectories += samples.length;
      const mlp = trainValueMlpWithAdam(dom, samples, {
        epochs: 30,
        batchSize: 96,
        learningRate: 0.0026,
        weightDecay: 0.00015,
        seed: 202600 + dom.charCodeAt(0),
      });
      trainedMlps.set(dom, mlp);
      domainNetworksOut[dom] = mlp;
      console.log(
        `   ✓ Rede Neural [${dom.toUpperCase().padEnd(7)}]: ${samples.length.toLocaleString('en-US').padStart(6)} estados | MSE ${mlp.initialMse.toFixed(4)} -> ${mlp.finalMse.toFixed(4)} | Acurácia de Sinal: ${(mlp.signAccuracy * 100).toFixed(1)}%`
      );
    }

    // 4. Synthesize Final Profiles & Distill Graduated Tier I..V 100-Card Decks
    console.log(
      '\n[Etapa 4] Destilando Grimórios Estabilizados (Tiers I, II, III, IV e V) para os 16 Arquétipos...'
    );
    const masteryById: Record<string, StabilizedArchetypeMastery> = {};

    for (const arch of archetypes) {
      const { profile, shapleyRanking, medianDeckCardCi95 } = synthesizeLearnedProfileAndShapley(
        arch,
        generationsExecuted,
        MIN_COMBO_COPLAYS
      );
      arch.profile = profile;
      arch.medianChampionCardCi95 = medianDeckCardCi95;
      const tierDecks = distillGraduatedTierDecksForArchetype(arch, shapleyRanking);
      const coverCardId =
        arch.cardIds.find((id) => CARDS_BY_ID[id]?.rarity === 'legendary') ?? arch.cardIds[0];

      masteryById[arch.bp.id] = {
        archetypeId: arch.bp.id,
        domain: arch.bp.domain,
        name: arch.bp.name,
        subtitle: arch.bp.subtitle,
        strategySummary: arch.bp.strategySummary,
        tacticalIdentity: arch.bp.tacticalIdentity,
        coverCardId,
        generationsEvolved: generationsExecuted,
        matchesSimulated: arch.totalGames,
        seedWinRate: Math.round(arch.seedWinRate * 1000) / 1000,
        championWinRate: Math.round(arch.latestWinRate * 1000) / 1000,
        championDeckJaccardStability: Math.round(arch.jaccardStability * 1000) / 1000,
        medianCardCi95HalfWidth: Math.round(medianDeckCardCi95 * 10000) / 10000,
        learnedProfile: profile,
        topShapleyCards: shapleyRanking.slice(0, 20),
        tierDecks,
      };
    }

    // 5. Adaptive Sequential 5-Tier Sovereign Ladder Benchmark (Stops ONLY when every Tier IC95% <= ±3.0%!)
    console.log(
      `\n[Etapa 5] Benchmark Sequencial Adaptativo da Escada Tier I -> Tier V (Alvo IC 95% <= ±${(TARGET_TIER_LADDER_CI95 * 100).toFixed(1)}% por Tier com Beam Search & Anti-Letal)...`
    );

    const domains: Domain[] = ['green', 'red', 'blue', 'purple', 'gold', 'neutral'];
    const tiers: AiSkillTier[] = [1, 2, 3, 4, 5];

    interface LadderCellState {
      domain: Domain;
      lowT: AiSkillTier;
      highT: AiSkillTier;
      statHigh: PairedStatAccumulator; // tracks High Tier score in [0..1]
      nextArchCursor: number;
    }

    const cellsByDomain = new Map<Domain, LadderCellState[]>();
    for (const dom of domains) {
      const cells: LadderCellState[] = [];
      for (let i = 0; i < tiers.length; i++) {
        for (let j = i + 1; j < tiers.length; j++) {
          cells.push({
            domain: dom,
            lowT: tiers[i],
            highT: tiers[j],
            statHigh: new PairedStatAccumulator(),
            nextArchCursor: 0,
          });
        }
      }
      cellsByDomain.set(dom, cells);
    }

    const computeDomainTierStats = (dom: Domain) => {
      const cells = cellsByDomain.get(dom)!;
      const tierStats: Record<AiSkillTier, PairedStatAccumulator> = {
        1: new PairedStatAccumulator(),
        2: new PairedStatAccumulator(),
        3: new PairedStatAccumulator(),
        4: new PairedStatAccumulator(),
        5: new PairedStatAccumulator(),
      };
      for (const c of cells) {
        const k = c.statHigh.pairCount;
        const sumH = c.statHigh.pairMeanSum;
        const sumSqH = c.statHigh.pairMeanSumSq;
        // For Low Tier, y_m = 1 - x_m => sum(y_m) = k - sumH, sum(y_m^2) = k - 2*sumH + sumSqH
        const sumL = k - sumH;
        const sumSqL = Math.max(0, k - 2 * sumH + sumSqH);
        tierStats[c.highT].addBatch(k, sumH, sumSqH);
        tierStats[c.lowT].addBatch(k, sumL, sumSqL);
      }
      let maxCi95 = 0;
      for (const t of tiers) {
        maxCi95 = Math.max(maxCi95, tierStats[t].ci95HalfWidth);
      }
      return { tierStats, maxCi95 };
    };

    const MAX_PAIRS_PER_CELL = 190; // up to 380 full Beam-Search games per cell (1,520 games per Tier -> IC95% <= ±3.0%)
    let ladderWave = 0;

    while (true) {
      ladderWave += 1;
      const pendingCellBatches: Array<{
        cell: LadderCellState;
        promise: Promise<WorkerPairBatchResponse>;
      }> = [];

      for (const dom of domains) {
        const { tierStats } = computeDomainTierStats(dom);
        const domArchetypes = archetypes.filter((a) => a.bp.domain === dom);
        const domMlp = trainedMlps.get(dom) ?? null;

        for (const cell of cellsByDomain.get(dom)!) {
          if (cell.statHigh.pairCount >= MAX_PAIRS_PER_CELL) continue;

          const needInitial = cell.statHigh.pairCount === 0;
          const needPrecision =
            tierStats[cell.highT].ci95HalfWidth > TARGET_TIER_LADDER_CI95 ||
            tierStats[cell.lowT].ci95HalfWidth > TARGET_TIER_LADDER_CI95;
          const isAdjacent = cell.highT - cell.lowT === 1;
          const adjacentUncertain =
            isAdjacent &&
            Math.abs(cell.statHigh.mean - 0.5) < cell.statHigh.ci95HalfWidth &&
            cell.statHigh.pairCount < 130;

          if (!needInitial && !needPrecision && !adjacentUncertain) continue;

          const pairsToSchedule = needInitial ? 54 : 24; // 108 games initially, +48 games per adaptive wave
          // Distribute evenly across the domain's 3 archetypes (or 1 for Neutral)
          const perArchPairs = Math.max(1, Math.ceil(pairsToSchedule / domArchetypes.length));
          for (let aOffset = 0; aOffset < domArchetypes.length; aOffset++) {
            const arch = domArchetypes[(cell.nextArchCursor + aOffset) % domArchetypes.length];
            const m = masteryById[arch.bp.id];
            pendingCellBatches.push({
              cell,
              promise: pool.runBatch({
                deckACardIds: m.tierDecks[cell.highT].cardIds,
                deckBCardIds: m.tierDecks[cell.lowT].cardIds,
                nameA: `${arch.bp.name} (T${cell.highT})`,
                nameB: `${arch.bp.name} (T${cell.lowT})`,
                deckIdA: arch.bp.id,
                deckIdB: arch.bp.id,
                domainA: dom,
                domainB: dom,
                profileA: cell.highT >= 3 ? m.learnedProfile : undefined,
                profileB: cell.lowT >= 3 ? m.learnedProfile : undefined,
                skillTierA: cell.highT,
                skillTierB: cell.lowT,
                mlpA: domMlp,
                mlpB: domMlp,
                fastRollout: false, // Full Beam Search + Anti-Lethal active!
                numMirrorPairs: perArchPairs,
                collectTelemetryA: false,
                collectTelemetryB: false,
                maxTrajectoriesPerSide: 0,
              }),
            });
          }
          cell.nextArchCursor += 1;
        }
      }

      if (pendingCellBatches.length === 0) break;

      const waveStart = Date.now();
      const results = await Promise.all(pendingCellBatches.map((b) => b.promise));
      let waveMatches = 0;
      for (let i = 0; i < pendingCellBatches.length; i++) {
        const res = results[i];
        pendingCellBatches[i].cell.statHigh.addBatch(
          res.pairCount,
          res.pairMeanSum,
          res.pairMeanSumSq
        );
        waveMatches += res.matchesPlayed;
        totalMatchesSimulated += res.matchesPlayed;
      }

      let worstDomainCi95 = 0;
      for (const dom of domains) {
        worstDomainCi95 = Math.max(worstDomainCi95, computeDomainTierStats(dom).maxCi95);
      }
      console.log(
        `   • Onda Escada #${ladderWave}: +${waveMatches} duelos (${((Date.now() - waveStart) / 1000).toFixed(1)}s) | Maior Margem IC95% entre todos os Tiers: ±${(worstDomainCi95 * 100).toFixed(2)}%`
      );
    }

    const ladderByDomain: Partial<Record<Domain, StabilizedDomainTierLadderBenchmark>> = {};
    let globalMaxTierCi95 = 0;

    for (const dom of domains) {
      const cells = cellsByDomain.get(dom)!;
      const { tierStats, maxCi95 } = computeDomainTierStats(dom);
      globalMaxTierCi95 = Math.max(globalMaxTierCi95, maxCi95);

      const r3 = (v: number) => Math.round(v * 1000) / 1000;
      const r4 = (v: number) => Math.round(v * 10000) / 10000;

      const tierOverallWinRates: Record<AiSkillTier, number> = {
        1: r3(tierStats[1].mean),
        2: r3(tierStats[2].mean),
        3: r3(tierStats[3].mean),
        4: r3(tierStats[4].mean),
        5: r3(tierStats[5].mean),
      };
      const tierCi95HalfWidths: Record<AiSkillTier, number> = {
        1: r4(tierStats[1].ci95HalfWidth),
        2: r4(tierStats[2].ci95HalfWidth),
        3: r4(tierStats[3].ci95HalfWidth),
        4: r4(tierStats[4].ci95HalfWidth),
        5: r4(tierStats[5].ci95HalfWidth),
      };

      const domArchetypes = archetypes.filter((a) => a.bp.domain === dom);
      for (const da of domArchetypes) {
        const m = masteryById[da.bp.id];
        for (const t of tiers) {
          m.tierDecks[t].benchmarkWinRateVsLadder = tierOverallWinRates[t];
          m.tierDecks[t].benchmarkCi95HalfWidth = tierCi95HalfWidths[t];
        }
      }

      const findCellMean = (highT: AiSkillTier, lowT: AiSkillTier) => {
        const c = cells.find((x) => x.highT === highT && x.lowT === lowT);
        return c ? r3(c.statHigh.mean) : 0.5;
      };

      const totalDomainLadderMatches = cells.reduce((s, c) => s + c.statHigh.totalMatches, 0);
      const avgMatchesPerCell = Math.round(totalDomainLadderMatches / cells.length);

      ladderByDomain[dom] = {
        domain: dom,
        matchesPerCell: avgMatchesPerCell,
        totalLadderMatches: totalDomainLadderMatches,
        tierOverallWinRates,
        tierCi95HalfWidths,
        maxTierCi95HalfWidth: r4(maxCi95),
        convergedByMargin: maxCi95 <= TARGET_TIER_LADDER_CI95,
        adjacentDominanceWinRates: {
          tier2VsTier1: findCellMean(2, 1),
          tier3VsTier2: findCellMean(3, 2),
          tier4VsTier3: findCellMean(4, 3),
          tier5VsTier4: findCellMean(5, 4),
          tier5VsTier1: findCellMean(5, 1),
        },
      };

      console.log(
        `   [${dom.toUpperCase().padEnd(7)}] (${totalDomainLadderMatches} jogos, IC95% <= ±${(maxCi95 * 100).toFixed(2)}%): T1=${(tierOverallWinRates[1] * 100).toFixed(1)}% | T2=${(tierOverallWinRates[2] * 100).toFixed(1)}% | T3=${(tierOverallWinRates[3] * 100).toFixed(1)}% | T4=${(tierOverallWinRates[4] * 100).toFixed(1)}% | T5=${(tierOverallWinRates[5] * 100).toFixed(1)}% | T5vT1=${(findCellMean(5, 1) * 100).toFixed(1)}%`
      );
    }

    const elapsedSeconds = Math.round(((Date.now() - tStart) / 1000) * 10) / 10;
    const summary: StabilizedTrainingSummary = {
      generatedAt: new Date().toISOString(),
      totalMatchesSimulated,
      totalStateTrajectoriesTrained: totalTrajectories,
      elapsedSeconds,
      archetypesCount: archetypes.length,
      convergenceReport: {
        workerThreadsUsed: workerCount,
        targetTierCi95HalfWidth: TARGET_TIER_LADDER_CI95,
        achievedMaxTierCi95HalfWidth: Math.round(globalMaxTierCi95 * 10000) / 10000,
        targetDeckJaccardStability: TARGET_DECK_JACCARD_STABILITY,
        achievedMeanDeckJaccardStability: Math.round(finalMeanJaccard * 1000) / 1000,
        achievedMaxMedianCardCi95HalfWidth: Math.round(finalMaxMedianCardCi95 * 10000) / 10000,
        minComboCoPlays: MIN_COMBO_COPLAYS,
        generationsExecuted,
        convergedEarly,
      },
      ladderByDomain,
    };

    const targetPath = path.resolve(__dirname, '../data/aiMonocolorMasteryData.ts');
    const fileContent = `import { AiSkillTier, Domain } from '../types/game';
import type { DeckLearnedAiProfile } from './aiLearnedProfiles';
import type { SerializedValueMlp } from '../engine/aiValueNetwork';

/**
 * GERADO AUTOMATICAMENTE POR src/scripts/trainMonocolorEvolution.ts (npm run train:mono)
 * Partidas Simuladas: ${totalMatchesSimulated.toLocaleString('en-US')} | Estados Treinados nas Value MLPs: ${totalTrajectories.toLocaleString('en-US')} (${elapsedSeconds}s em ${workerCount} threads)
 * Margem de Erro Máxima IC 95% nos Tiers: ±${(globalMaxTierCi95 * 100).toFixed(2)}%
 */

export type MonocolorArchetypeId =
  | 'mono_green_swarm'
  | 'mono_green_colossus'
  | 'mono_green_roots'
  | 'mono_red_blitz'
  | 'mono_red_pyroclasm'
  | 'mono_red_dragon'
  | 'mono_blue_frost'
  | 'mono_blue_chrono'
  | 'mono_blue_abyssal'
  | 'mono_purple_crypt'
  | 'mono_purple_blood'
  | 'mono_purple_umbral'
  | 'mono_gold_phalanx'
  | 'mono_gold_celestial'
  | 'mono_gold_judgment'
  | 'mono_neutral_axial';

export interface CardShapleyMetric {
  cardId: string;
  cardName: string;
  shapleyValue: number;
  shapleyLcb?: number;
  ci95HalfWidth?: number;
  playedWinRate: number;
  stuckInHandRate: number;
  samples: number;
}

export interface TierDeckMetadata {
  tier: AiSkillTier;
  tierLabel: string;
  cardIds: string[];
  legendaryCount: number;
  rareCount: number;
  uncommonCount: number;
  commonCount: number;
  avgCost: number;
  benchmarkWinRateVsLadder: number;
  benchmarkCi95HalfWidth?: number;
}

export interface MonocolorArchetypeMastery {
  archetypeId: MonocolorArchetypeId;
  domain: Domain;
  name: string;
  subtitle: string;
  strategySummary: string;
  tacticalIdentity: 'aggro' | 'midrange' | 'control' | 'ramp' | 'tempo' | 'attrition';
  coverCardId: string;
  generationsEvolved: number;
  matchesSimulated: number;
  seedWinRate: number;
  championWinRate: number;
  championDeckJaccardStability?: number;
  medianCardCi95HalfWidth?: number;
  learnedProfile: DeckLearnedAiProfile;
  topShapleyCards: CardShapleyMetric[];
  tierDecks: Record<AiSkillTier, TierDeckMetadata>;
}

export interface DomainTierLadderBenchmark {
  domain: Domain;
  matchesPerCell: number;
  totalLadderMatches?: number;
  tierOverallWinRates: Record<AiSkillTier, number>;
  tierCi95HalfWidths?: Record<AiSkillTier, number>;
  maxTierCi95HalfWidth?: number;
  convergedByMargin?: boolean;
  adjacentDominanceWinRates: {
    tier2VsTier1: number;
    tier3VsTier2: number;
    tier4VsTier3: number;
    tier5VsTier4: number;
    tier5VsTier1: number;
  };
}

export interface MonocolorConvergenceReport {
  workerThreadsUsed: number;
  targetTierCi95HalfWidth: number;
  achievedMaxTierCi95HalfWidth: number;
  targetDeckJaccardStability: number;
  achievedMeanDeckJaccardStability: number;
  achievedMaxMedianCardCi95HalfWidth: number;
  minComboCoPlays: number;
  generationsExecuted: number;
  convergedEarly: boolean;
}

export interface MonocolorTrainingSummary {
  generatedAt: string;
  totalMatchesSimulated: number;
  totalStateTrajectoriesTrained: number;
  elapsedSeconds: number;
  archetypesCount: number;
  convergenceReport?: MonocolorConvergenceReport;
  ladderByDomain: Partial<Record<Domain, DomainTierLadderBenchmark>>;
}

export const MONOCOLOR_TRAINING_SUMMARY: MonocolorTrainingSummary = ${JSON.stringify(summary, null, 2)};

export const DOMAIN_VALUE_NETWORKS: Partial<Record<Domain, SerializedValueMlp>> = ${JSON.stringify(domainNetworksOut)};

export const MONOCOLOR_ARCHETYPE_MASTERY: Partial<Record<MonocolorArchetypeId, MonocolorArchetypeMastery>> = ${JSON.stringify(masteryById, null, 2)};
`;

    fs.writeFileSync(targetPath, fileContent, 'utf-8');
    console.log('\n================================================================================');
    console.log(` TREINAMENTO ESTABILIZADO CONCLUÍDO EM ${elapsedSeconds}s (${workerCount} Workers)!`);
    console.log(` • Duelos completos de 100 cartas simulados: ${totalMatchesSimulated.toLocaleString('en-US')}`);
    console.log(` • Estados treinados nas 6 Value MLPs: ${totalTrajectories.toLocaleString('en-US')}`);
    console.log(` • Maior Margem de Erro IC 95% nos Tiers: ±${(globalMaxTierCi95 * 100).toFixed(2)}%`);
    console.log(` • Artefato salvo em: ${targetPath}`);
    console.log('================================================================================');
  } finally {
    await pool.close();
  }
}

if (isMainThread) {
  main().catch((err) => {
    console.error('Erro fatal no treinamento paralelo monocolor:', err);
    process.exit(1);
  });
}
