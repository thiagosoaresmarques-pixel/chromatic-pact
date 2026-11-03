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
import { BICOLOR_VALUE_NETWORKS, DOMAIN_VALUE_NETWORKS } from '../data/aiValueNetworksData';
import {
  CardShapleyMetric,
  MONOCOLOR_ARCHETYPE_MASTERY,
  MonocolorArchetypeId,
  TierDeckMetadata,
} from '../data/aiMonocolorMasteryData';
import {
  BICOLOR_ARCHETYPE_MASTERY,
  BicolorArchetypeId,
} from '../data/aiBicolorMasteryData';
import { resolveBicolorArchetypeForDomains } from '../data/aiBicolorMastery';
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
// POLYCOLOR (TRICOLOR + PENTACHROMATIC APEX) ARCHETYPE IDS & INTERFACES
// ============================================================================
export type PolycolorArchetypeId =
  | 'tri_red_blue_purple'
  | 'tri_red_green_gold'
  | 'tri_blue_purple_gold'
  | 'tri_red_purple_green'
  | 'tri_blue_green_gold'
  | 'tri_blue_purple_green'
  | 'tri_red_purple_gold'
  | 'tri_purple_green_gold'
  | 'tri_red_blue_green'
  | 'tri_red_blue_gold'
  | 'penta_prismatic_crater'
  | 'penta_free_city_sovereign'
  | 'penta_wheel_convergence';

export type PolycolorConclaveId =
  | 'cataclysm_triads'
  | 'imperial_triads'
  | 'pentachromatic_apex';

interface StabilizedPolycolorArchetypeMastery {
  archetypeId: PolycolorArchetypeId;
  tierFormat: 'tricolor' | 'pentachromatic';
  domains: Domain[];
  conclaveId: PolycolorConclaveId;
  classicDeckIds: string[];
  name: string;
  subtitle: string;
  strategySummary: string;
  tacticalIdentity: 'aggro' | 'midrange' | 'control' | 'ramp' | 'tempo' | 'attrition';
  coverCardId: string;
  generationsEvolved: number;
  matchesSimulated: number;
  seedWinRate: number;
  championWinRate: number;
  vsMonocolorWinRate: number;
  vsBicolorWinRate: number;
  championDeckJaccardStability: number;
  medianCardCi95HalfWidth: number;
  domainCardBreakdown: Record<string, number>;
  crossDomainCombos: DiscoveredCardCombo[];
  learnedProfile: DeckLearnedAiProfile;
  topShapleyCards: CardShapleyMetric[];
  tierDecks: Record<AiSkillTier, TierDeckMetadata>;
}

interface PolycolorConclaveLadderBenchmark {
  conclaveId: PolycolorConclaveId;
  conclaveTitle: string;
  archetypeIds: PolycolorArchetypeId[];
  matchesPerCell: number;
  totalLadderMatches: number;
  tierOverallWinRates: Record<AiSkillTier, number>;
  tierCi95HalfWidths: Record<AiSkillTier, number>;
  maxTierCi95HalfWidth: number;
  convergedByMargin: boolean;
  adjacentDominanceWinRates: {
    tier2VsTier1: number;
    tier3VsTier2: number;
    tier4VsTier3: number;
    tier5VsTier4: number;
    tier5VsTier1: number;
  };
}

interface PolycolorTrainingSummary {
  generatedAt: string;
  totalMatchesSimulated: number;
  totalStateTrajectoriesTrained: number;
  elapsedSeconds: number;
  archetypesCount: number;
  tricolorCount: number;
  pentachromaticCount: number;
  overallVsMonocolorTier5WinRate: number;
  overallVsBicolorTier5WinRate: number;
  convergenceReport: {
    workerThreadsUsed: number;
    targetTierCi95HalfWidth: number;
    achievedMaxTierCi95HalfWidth: number;
    targetDeckJaccardStability: number;
    achievedMeanDeckJaccardStability: number;
    achievedMaxMedianCardCi95HalfWidth: number;
    minComboCoPlays: number;
    generationsExecuted: number;
    convergedEarly: boolean;
  };
  ladderByConclave: Record<PolycolorConclaveId, PolycolorConclaveLadderBenchmark>;
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
  featuresFlat: Float64Array;
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
  scoreASum: number;
  pairMeanSum: number;
  pairMeanSumSq: number;
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

    const trajA: ValueTrainingSample[] | null = req.maxTrajectoriesPerSide > 0 ? [] : null;
    const trajB: ValueTrainingSample[] | null = req.maxTrajectoriesPerSide > 0 ? [] : null;

    let scoreASum = 0;
    let pairMeanSum = 0;
    let pairMeanSumSq = 0;

    for (let k = 0; k < req.numMirrorPairs; k++) {
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
// MAIN THREAD: WORKER POOL & PAIRED STAT ACCUMULATOR
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
    const safeVar = Math.max(0.015, rawVar);
    return Math.sqrt(safeVar / this.pairCount);
  }

  get ci95HalfWidth(): number {
    return 1.96 * this.stdError;
  }
}

// ============================================================================
// 13 POLYCOLOR ARCHETYPE BLUEPRINTS (10 TRICOLOR + 3 PENTACHROMATIC APEX)
// ============================================================================
interface PolycolorBlueprint {
  id: PolycolorArchetypeId;
  tierFormat: 'tricolor' | 'pentachromatic';
  domains: Exclude<Domain, 'neutral'>[];
  conclaveId: PolycolorConclaveId;
  classicDeckIds: string[];
  coverCardId: string;
  name: string;
  subtitle: string;
  strategySummary: string;
  tacticalIdentity: 'aggro' | 'midrange' | 'control' | 'ramp' | 'tempo' | 'attrition';
  targetAvgCost: number;
  minEarlyDrops: number;
  minCreatures: number;
  maxRelics: number;
  minPerColoredDomain: number;
  minNeutralSupport: number;
  maxNeutralSupport: number;
  seedWeights: AiDecisionWeights;
}

const CONCLAVE_TITLES: Record<PolycolorConclaveId, string> = {
  cataclysm_triads: 'Conclave dos Cataclismos Elementais (5 Tríades de Fúria & Ruína)',
  imperial_triads: 'Conclave das Ordens Imperiais & Abissais (5 Tríades de Trono & Estase)',
  pentachromatic_apex: 'Conclave Pentacromático Ápice (Cratera Prismática, Cidade Franca & Matriz)',
};

const POLYCOLOR_BLUEPRINTS: PolycolorBlueprint[] = [
  // ======================== 10 TRICOLOR CATACLYSMS / TRIADS ========================
  {
    id: 'tri_red_blue_purple',
    tierFormat: 'tricolor',
    domains: ['blue', 'red', 'purple'],
    conclaveId: 'cataclysm_triads',
    classicDeckIds: ['deck_tri_arcane_cataclysm', 'deck_tri_astral_cataclysm'],
    coverCardId: 'blue_98_soberano_mares',
    name: 'Cataclismo da Convergência Astral',
    subtitle: 'Tríade ❄️+🔥+💀 • Estase, Fogo Piroclástico & Execução Umbral',
    strategySummary:
      'Une Congelamento e compra rúnica de Vórtex à artilharia vulcânica de Pyros e ceifadores letais de Eclipse para domínio absoluto de tempo e remoção.',
    tacticalIdentity: 'control',
    targetAvgCost: 3.3,
    minEarlyDrops: 27,
    minCreatures: 54,
    maxRelics: 10,
    minPerColoredDomain: 22,
    minNeutralSupport: 4,
    maxNeutralSupport: 12,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.02,
      tradeValueBias: 1.32,
      flyingEvasionBias: 1.28,
      spellHoldPatience: 1.24,
      synergyHoldBonus: 24,
      mulliganCurveTarget: 2.9,
    },
  },
  {
    id: 'tri_red_green_gold',
    tierFormat: 'tricolor',
    domains: ['red', 'green', 'gold'],
    conclaveId: 'cataclysm_triads',
    classicDeckIds: ['deck_tri_primal_titans', 'deck_tri_primordial_forge'],
    coverCardId: 'green_67_tiranossauro_alfa',
    name: 'Tríade dos Titãs da Forja Primordial',
    subtitle: 'Tríade 🔥+🌿+☀️ • Rampa Colossal, Escudo Divino & Sopro Dracônico',
    strategySummary:
      'Acelera Essência com rampa de Veridia para erguer Colossos e Dragões de Pyros blindados pelos Escudos Divinos e hinos imperiais de Solária.',
    tacticalIdentity: 'ramp',
    targetAvgCost: 3.5,
    minEarlyDrops: 26,
    minCreatures: 66,
    maxRelics: 8,
    minPerColoredDomain: 22,
    minNeutralSupport: 4,
    maxNeutralSupport: 12,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.20,
      tradeValueBias: 1.18,
      guardianPriority: 1.26,
      ascensionEagerness: 1.30,
      domainExpansionEagerness: 1.24,
      mulliganCurveTarget: 2.9,
    },
  },
  {
    id: 'tri_blue_purple_gold',
    tierFormat: 'tricolor',
    domains: ['gold', 'blue', 'purple'],
    conclaveId: 'imperial_triads',
    classicDeckIds: ['deck_tri_eternal_reliquary'],
    coverCardId: 'gold_72_talisma_bem',
    name: 'Relicário do Trono Eterno',
    subtitle: 'Tríade ☀️+❄️+💀 • Cidadela de Relíquias, Cronomancia & Veredito',
    strategySummary:
      'Fortifica o Soberano com Guardiões celestes, Relíquias imperiais, Congelamento e reanimação inquisitorial em uma muralha intransponível.',
    tacticalIdentity: 'control',
    targetAvgCost: 3.4,
    minEarlyDrops: 27,
    minCreatures: 56,
    maxRelics: 12,
    minPerColoredDomain: 22,
    minNeutralSupport: 4,
    maxNeutralSupport: 12,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 0.96,
      tradeValueBias: 1.35,
      guardianPriority: 1.34,
      relicPriority: 1.20,
      spellHoldPatience: 1.22,
      mulliganCurveTarget: 3.0,
    },
  },
  {
    id: 'tri_red_purple_green',
    tierFormat: 'tricolor',
    domains: ['red', 'purple', 'green'],
    conclaveId: 'cataclysm_triads',
    classicDeckIds: ['deck_tri_blood_moon'],
    coverCardId: 'purple_65_principe_mortos',
    name: 'Corte da Lua Sangrenta',
    subtitle: 'Tríade 🔥+💀+🌿 • Frenesi Predatório, Cripta & Atropelar',
    strategySummary:
      'Alimenta enxames ferozes com Ímpeto, Toque Letal, Dreno de Vida e reanimação da Cripta para esmagar linhas defensivas por pressão incessante.',
    tacticalIdentity: 'aggro',
    targetAvgCost: 3.1,
    minEarlyDrops: 30,
    minCreatures: 66,
    maxRelics: 8,
    minPerColoredDomain: 22,
    minNeutralSupport: 4,
    maxNeutralSupport: 12,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.26,
      tradeValueBias: 1.14,
      bloodPactThresholdHp: 18,
      sovPowerTempoBias: 1.22,
      mulliganCurveTarget: 2.7,
    },
  },
  {
    id: 'tri_blue_green_gold',
    tierFormat: 'tricolor',
    domains: ['gold', 'green', 'blue'],
    conclaveId: 'imperial_triads',
    classicDeckIds: ['deck_tri_celestial_scales', 'deck_tri_eternal_horizon'],
    coverCardId: 'gold_100_dragao_imperial_ouro',
    name: 'Escamas do Horizonte Eterno',
    subtitle: 'Tríade ☀️+🌿+❄️ • Falange Radiante, Rampa & Voo Astral',
    strategySummary:
      'Une rampa silvestre e compra arcana aos Serafins e Dragões Imperiais de Solária, dominando chão e ar com Escudo Divino e Regeneração.',
    tacticalIdentity: 'midrange',
    targetAvgCost: 3.4,
    minEarlyDrops: 27,
    minCreatures: 62,
    maxRelics: 10,
    minPerColoredDomain: 22,
    minNeutralSupport: 4,
    maxNeutralSupport: 12,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.08,
      tradeValueBias: 1.26,
      guardianPriority: 1.32,
      flyingEvasionBias: 1.26,
      ascensionEagerness: 1.28,
      mulliganCurveTarget: 2.9,
    },
  },
  {
    id: 'tri_blue_purple_green',
    tierFormat: 'tricolor',
    domains: ['blue', 'purple', 'green'],
    conclaveId: 'imperial_triads',
    classicDeckIds: ['deck_tri_abyssal_chimera'],
    coverCardId: 'purple_100_dragao_necrotico',
    name: 'Quimera da Fossa Abissal',
    subtitle: 'Tríade ❄️+💀+🌿 • Evolução Necrótica, Estase & Cripta Viva',
    strategySummary:
      'Recicla feras primordiais e Leviatãs da Cripta enquanto congela a frente inimiga e acumula vantagem de cartas e Essência.',
    tacticalIdentity: 'attrition',
    targetAvgCost: 3.4,
    minEarlyDrops: 27,
    minCreatures: 60,
    maxRelics: 9,
    minPerColoredDomain: 22,
    minNeutralSupport: 4,
    maxNeutralSupport: 12,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.02,
      tradeValueBias: 1.30,
      guardianPriority: 1.24,
      synergyHoldBonus: 24,
      mulliganCurveTarget: 2.9,
    },
  },
  {
    id: 'tri_red_purple_gold',
    tierFormat: 'tricolor',
    domains: ['gold', 'red', 'purple'],
    conclaveId: 'cataclysm_triads',
    classicDeckIds: ['deck_tri_crimson_sun'],
    coverCardId: 'gold_99_serafim_coroado',
    name: 'Eclipse do Sol Carmesim',
    subtitle: 'Tríade ☀️+🔥+💀 • Serafins Sanguinários, Dreno & Artilharia',
    strategySummary:
      'Marcha sob estandartes de Escudo Divino e Renascer enquanto drena vida e incinera bloqueadores com fogo vulcânico e vereditos sombrios.',
    tacticalIdentity: 'midrange',
    targetAvgCost: 3.2,
    minEarlyDrops: 28,
    minCreatures: 60,
    maxRelics: 10,
    minPerColoredDomain: 22,
    minNeutralSupport: 4,
    maxNeutralSupport: 12,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.18,
      tradeValueBias: 1.22,
      flyingEvasionBias: 1.28,
      guardianPriority: 1.24,
      mulliganCurveTarget: 2.8,
    },
  },
  {
    id: 'tri_purple_green_gold',
    tierFormat: 'tricolor',
    domains: ['gold', 'green', 'purple'],
    conclaveId: 'imperial_triads',
    classicDeckIds: [],
    coverCardId: 'gold_172_armada_draconica_sol',
    name: 'Armada do Zênite Umbral',
    subtitle: 'Tríade ☀️+🌿+💀 • Bastião Imortal, Regeneração & Renascer',
    strategySummary:
      'Ergue a linha de frente mais resiliente de Vaeloria unindo Guardiões dourados, Regeneração silvestre, Toque Letal e ressurreição da Cripta.',
    tacticalIdentity: 'attrition',
    targetAvgCost: 3.3,
    minEarlyDrops: 28,
    minCreatures: 64,
    maxRelics: 10,
    minPerColoredDomain: 22,
    minNeutralSupport: 4,
    maxNeutralSupport: 12,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.06,
      tradeValueBias: 1.32,
      guardianPriority: 1.38,
      stackConsolidationBias: 1.22,
      mulliganCurveTarget: 2.9,
    },
  },
  {
    id: 'tri_red_blue_green',
    tierFormat: 'tricolor',
    domains: ['red', 'green', 'blue'],
    conclaveId: 'cataclysm_triads',
    classicDeckIds: [],
    coverCardId: 'green_173_general_roda_selva',
    name: 'Tempestade Elemental Primeva',
    subtitle: 'Tríade 🔥+🌿+❄️ • Rampa Relâmpago, Leviatãs & Sopro Glacial',
    strategySummary:
      'Acelera Essência e compra cartas simultaneamente para despejar Dragões, Hidras e Arcontes com Ímpeto, Voo e Congelamento de linha.',
    tacticalIdentity: 'tempo',
    targetAvgCost: 3.4,
    minEarlyDrops: 27,
    minCreatures: 60,
    maxRelics: 8,
    minPerColoredDomain: 22,
    minNeutralSupport: 4,
    maxNeutralSupport: 12,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.18,
      tradeValueBias: 1.18,
      flyingEvasionBias: 1.28,
      ascensionEagerness: 1.28,
      mulliganCurveTarget: 2.9,
    },
  },
  {
    id: 'tri_red_blue_gold',
    tierFormat: 'tricolor',
    domains: ['gold', 'red', 'blue'],
    conclaveId: 'imperial_triads',
    classicDeckIds: [],
    coverCardId: 'red_173_general_roda_chama',
    name: 'Conclave da Chama Celeste',
    subtitle: 'Tríade ☀️+🔥+❄️ • Esquadra Aérea, Escudo Divino & Feitiçaria',
    strategySummary:
      'Domina os céus com Dragões Solares e Fênix protegidos por Escudo Divino, Congelamento tático e rajadas piroclásticas precisas.',
    tacticalIdentity: 'tempo',
    targetAvgCost: 3.2,
    minEarlyDrops: 28,
    minCreatures: 58,
    maxRelics: 10,
    minPerColoredDomain: 22,
    minNeutralSupport: 4,
    maxNeutralSupport: 12,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.16,
      tradeValueBias: 1.20,
      flyingEvasionBias: 1.36,
      spellHoldPatience: 1.16,
      mulliganCurveTarget: 2.8,
    },
  },

  // ======================== 3 PENTACHROMATIC APEX SOVEREIGNS ========================
  {
    id: 'penta_prismatic_crater',
    tierFormat: 'pentachromatic',
    domains: ['red', 'blue', 'purple', 'green', 'gold'],
    conclaveId: 'pentachromatic_apex',
    classicDeckIds: ['deck_spec_pentachromatic'],
    coverCardId: 'neutral_167_arauto_prisma_matriz',
    name: 'Soberania da Cratera Prismática',
    subtitle: 'Ápice Pentacromático 🔥❄️💀🌿☀️ • Dragões do Prisma & Primeira Fratura',
    strategySummary:
      'Canaliza os cinco domínios primordiais através de Arautos e Dragões da Cratera Prismática para desencadear Sopro, Voo e Expansão no Turno 4.',
    tacticalIdentity: 'ramp',
    targetAvgCost: 3.5,
    minEarlyDrops: 27,
    minCreatures: 62,
    maxRelics: 9,
    minPerColoredDomain: 13,
    minNeutralSupport: 12,
    maxNeutralSupport: 24,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.18,
      tradeValueBias: 1.22,
      flyingEvasionBias: 1.34,
      ascensionEagerness: 1.30,
      domainExpansionEagerness: 1.28,
      mulliganCurveTarget: 2.9,
    },
  },
  {
    id: 'penta_free_city_sovereign',
    tierFormat: 'pentachromatic',
    domains: ['gold', 'green', 'red', 'blue', 'purple'],
    conclaveId: 'pentachromatic_apex',
    classicDeckIds: ['deck_penta_valkyra_pact'],
    coverCardId: 'neutral_10_valkyra_pentacromatica',
    name: 'Concílio Supremo da Cidade Franca',
    subtitle: 'Ápice Pentacromático ☀️🌿🔥❄️💀+⚙️ • Valkyra & Torre dos Cinco Selos',
    strategySummary:
      'Une Valkyra, os Cinco Anciões Cromáticos e a elite da Cidade Franca em uma falange pentacromática de Escudo Divino, Ímpeto e hinos globais.',
    tacticalIdentity: 'midrange',
    targetAvgCost: 3.4,
    minEarlyDrops: 28,
    minCreatures: 66,
    maxRelics: 9,
    minPerColoredDomain: 13,
    minNeutralSupport: 12,
    maxNeutralSupport: 24,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.14,
      tradeValueBias: 1.26,
      guardianPriority: 1.32,
      flyingEvasionBias: 1.28,
      domainExpansionEagerness: 1.26,
      mulliganCurveTarget: 2.8,
    },
  },
  {
    id: 'penta_wheel_convergence',
    tierFormat: 'pentachromatic',
    domains: ['blue', 'gold', 'purple', 'red', 'green'],
    conclaveId: 'pentachromatic_apex',
    classicDeckIds: [],
    coverCardId: 'neutral_173_general_roda_matriz',
    name: 'Convergência da Roda Horológica',
    subtitle: 'Ápice Pentacromático ❄️☀️💀🔥🌿+⚙️ • Vaelkor & Generais da Roda',
    strategySummary:
      'Orquestra os Generais da Roda dos seis domínios, Constructos de Aeternus e Relíquias cronomantes para controle absoluto e viradas inevitáveis.',
    tacticalIdentity: 'control',
    targetAvgCost: 3.4,
    minEarlyDrops: 27,
    minCreatures: 58,
    maxRelics: 11,
    minPerColoredDomain: 13,
    minNeutralSupport: 12,
    maxNeutralSupport: 24,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.04,
      tradeValueBias: 1.34,
      guardianPriority: 1.30,
      relicPriority: 1.18,
      spellHoldPatience: 1.20,
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

// Fuse empirical Shapley priors from BOTH Phase 1 (16 Monocolors) AND Phase 2 (15 Bicolors)!
const PRIOR_SHAPLEY_SCORE = new Map<string, number>();
for (const m of Object.values(MONOCOLOR_ARCHETYPE_MASTERY)) {
  if (!m) continue;
  for (const sc of m.topShapleyCards) {
    const prev = PRIOR_SHAPLEY_SCORE.get(sc.cardId) ?? -99;
    if (sc.shapleyValue > prev) PRIOR_SHAPLEY_SCORE.set(sc.cardId, sc.shapleyValue);
  }
}
for (const m of Object.values(BICOLOR_ARCHETYPE_MASTERY)) {
  if (!m) continue;
  for (const sc of m.topShapleyCards) {
    const prev = PRIOR_SHAPLEY_SCORE.get(sc.cardId) ?? -99;
    if (sc.shapleyValue > prev) PRIOR_SHAPLEY_SCORE.set(sc.cardId, sc.shapleyValue);
  }
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
    q += 4.0 + card.hp * 0.35 + card.effects.length * 1.8;
  } else {
    q += 4.0 + card.effects.length * 1.9;
  }

  for (const eff of card.effects) {
    if (eff.type === 'draw_cards') q += eff.value * 1.65;
    else if (eff.type === 'destroy_enemy') q += 2.6;
    else if (eff.type === 'damage_all_units' || eff.type === 'damage_enemy_row') q += 2.1;
    else if (eff.type === 'revive_from_crypt' || eff.type === 'summon_token') q += 2.0;
    else if (eff.type === 'shield_all_allies' || eff.type === 'buff_all_allies') q += 2.2;
    else if (eff.type === 'break_domain_expansion') q += 3.0;
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

  // Polycolor affinity smoothness: cards with affinityReq <= 2 cast on Turn 1-2 via 0.65 cross-domain math!
  if (card.cost <= 3 && card.affinityReq <= 1) q += 1.25;
  else if (card.cost <= 3 && card.affinityReq === 2) q += 0.45;
  else if (card.cost <= 4 && card.affinityReq >= 3) q -= 1.6;
  else if (card.affinityReq >= 4) q -= 1.2;

  const prior = PRIOR_SHAPLEY_SCORE.get(card.id);
  if (prior !== undefined) {
    q += clamp(prior * 24, -1.5, 4.2);
  }

  return q;
}

function computePolycolorSynergyAffinity(card: CardDefinition, bp: PolycolorBlueprint): number {
  const kw = new Set(card.keywords);
  const effs = new Set(card.effects.map((e) => e.type));
  let s = -Math.abs(card.cost - bp.targetAvgCost) * 0.65;

  if (card.id === bp.coverCardId) {
    s += 12.0;
  }

  // Neutral cards provide wildcard affinity fixing when channeled on Turns 1-3!
  if (card.domain === 'neutral') {
    if (bp.tierFormat === 'pentachromatic') {
      if (card.id.includes('prisma') || card.id.includes('valkyra') || card.id.includes('roda')) {
        s += 6.5;
      }
      if (card.cost <= 3 || effs.has('draw_cards') || effs.has('buff_all_allies')) {
        s += 2.2;
      }
    } else {
      s -= 0.8;
      if (effs.has('draw_cards') || effs.has('buff_all_allies') || effs.has('shield_all_allies')) {
        s += 2.2;
      }
    }
  }

  switch (bp.id) {
    case 'tri_red_blue_purple':
      if (effs.has('freeze_enemy') || effs.has('destroy_enemy') || effs.has('draw_cards')) s += 5.8;
      if (kw.has('Voo') || kw.has('Toque Letal') || effs.has('damage_enemy_row')) s += 4.8;
      break;
    case 'tri_red_green_gold':
      if (effs.has('grant_bonus_essence') || effs.has('shield_all_allies')) s += 6.2;
      if (kw.has('Atropelar') || kw.has('Escudo Divino') || (card.breathDamage ?? 0) > 0) s += 5.4;
      break;
    case 'tri_blue_purple_gold':
      if (kw.has('Guardião') || kw.has('Escudo Divino') || card.type === 'relic') s += 5.4;
      if (effs.has('draw_cards') || effs.has('destroy_enemy') || effs.has('freeze_enemy')) s += 5.6;
      break;
    case 'tri_red_purple_green':
      if (kw.has('Ímpeto') || kw.has('Toque Letal') || kw.has('Renascer')) s += 5.8;
      if (effs.has('revive_from_crypt') || effs.has('buff_all_allies') || kw.has('Dreno de Vida')) s += 5.0;
      break;
    case 'tri_blue_green_gold':
      if (effs.has('grant_bonus_essence') || effs.has('draw_cards') || effs.has('buff_all_allies')) s += 6.0;
      if (kw.has('Escudo Divino') || kw.has('Voo') || (card.regeneration ?? 0) > 0) s += 5.0;
      break;
    case 'tri_blue_purple_green':
      if (effs.has('revive_from_crypt') || effs.has('freeze_enemy') || effs.has('draw_cards')) s += 5.8;
      if (kw.has('Renascer') || kw.has('Toque Letal') || (card.regeneration ?? 0) > 0) s += 5.2;
      break;
    case 'tri_red_purple_gold':
      if (kw.has('Escudo Divino') || kw.has('Dreno de Vida') || kw.has('Ímpeto')) s += 5.6;
      if (effs.has('destroy_enemy') || effs.has('damage_single_enemy') || kw.has('Voo')) s += 4.8;
      break;
    case 'tri_purple_green_gold':
      if (kw.has('Guardião') || kw.has('Renascer') || kw.has('Escudo Divino')) s += 6.0;
      if ((card.regeneration ?? 0) > 0 || effs.has('buff_all_allies') || effs.has('revive_from_crypt')) s += 5.2;
      break;
    case 'tri_red_blue_green':
      if (effs.has('grant_bonus_essence') || effs.has('draw_cards')) s += 6.2;
      if (kw.has('Ímpeto') || kw.has('Voo') || kw.has('Atropelar') || effs.has('freeze_enemy')) s += 5.0;
      break;
    case 'tri_red_blue_gold':
      if (kw.has('Voo') || kw.has('Escudo Divino') || kw.has('Alcance')) s += 5.8;
      if (effs.has('draw_cards') || effs.has('freeze_enemy') || effs.has('damage_single_enemy')) s += 5.2;
      break;
    case 'penta_prismatic_crater':
      if (kw.has('Voo') || (card.breathDamage ?? 0) > 0 || effs.has('grant_bonus_essence')) s += 5.8;
      if (card.id.includes('167_') || card.id.includes('172_') || card.ascension) s += 5.5;
      break;
    case 'penta_free_city_sovereign':
      if (kw.has('Escudo Divino') || kw.has('Guardião') || kw.has('Ímpeto')) s += 5.6;
      if (effs.has('buff_all_allies') || effs.has('shield_all_allies') || effs.has('draw_cards')) s += 5.6;
      break;
    case 'penta_wheel_convergence':
      if (card.id.includes('173_') || card.type === 'relic' || kw.has('Escudo Divino')) s += 6.0;
      if (effs.has('draw_cards') || effs.has('freeze_enemy') || effs.has('destroy_enemy')) s += 5.6;
      break;
  }

  if (effs.has('break_domain_expansion')) s += 5.5;
  return s;
}

function getEligiblePoolForBlueprint(bp: PolycolorBlueprint): CardDefinition[] {
  const allowed = new Set<Domain>([...bp.domains, 'neutral']);
  return ALL_CARDS.filter((c) => allowed.has(c.domain));
}

function assertValid100PolycolorDeck(
  cardIds: string[],
  bp: PolycolorBlueprint,
  maxAllowedLegendaries = MAX_LEGENDARIES_PER_DECK,
  label = '',
  enforceRelicAndDomainSplit = true
): void {
  if (cardIds.length !== REQUIRED_DECK_SIZE) {
    throw new Error(`[${label}] Expected ${REQUIRED_DECK_SIZE} cards, got ${cardIds.length}`);
  }
  const allowedColored = new Set<Domain>(bp.domains);
  const counts = new Map<string, number>();
  const domCounts: Record<Domain, number> = {
    red: 0,
    blue: 0,
    purple: 0,
    green: 0,
    gold: 0,
    neutral: 0,
  };
  let legCount = 0;
  let relicCount = 0;

  for (const id of cardIds) {
    const c = CARDS_BY_ID[id];
    if (!c) throw new Error(`[${label}] Unknown card ID: ${id}`);
    if (c.domain !== 'neutral' && !allowedColored.has(c.domain)) {
      throw new Error(`[${label}] Illegal domain card ${id} (${c.domain}) for ${bp.id}`);
    }
    domCounts[c.domain] += 1;

    const next = (counts.get(id) ?? 0) + 1;
    if (next > MAX_COPIES_BY_RARITY[c.rarity]) {
      throw new Error(`[${label}] Copy cap exceeded for ${id} (${c.rarity}): ${next}`);
    }
    counts.set(id, next);
    if (c.rarity === 'legendary') legCount += 1;
    if (c.type === 'relic') relicCount += 1;
  }

  if (legCount > maxAllowedLegendaries) {
    throw new Error(`[${label}] Legendary cap exceeded: ${legCount} > ${maxAllowedLegendaries}`);
  }

  if (enforceRelicAndDomainSplit) {
    if (relicCount > bp.maxRelics) {
      throw new Error(`[${label}] Relic cap exceeded: ${relicCount} > ${bp.maxRelics}`);
    }
    for (const d of bp.domains) {
      if (domCounts[d] < bp.minPerColoredDomain) {
        throw new Error(
          `[${label}] Domain pillar ${d}=${domCounts[d]} < min ${bp.minPerColoredDomain}`
        );
      }
    }
    if (domCounts.neutral < bp.minNeutralSupport || domCounts.neutral > bp.maxNeutralSupport) {
      throw new Error(
        `[${label}] Neutral count ${domCounts.neutral} outside [${bp.minNeutralSupport}, ${bp.maxNeutralSupport}]`
      );
    }
  }
}

interface PolyDeckSlotTracker {
  bp: PolycolorBlueprint;
  deck: string[];
  counts: Map<string, number>;
  domCounts: Record<Domain, number>;
  legCount: number;
  rareCount: number;
  creatureCount: number;
  relicCount: number;
  earlyDropCount: number;
  maxLeg: number;
  maxRare: number;
  maxRelics: number;
}

function createSlotTracker(
  bp: PolycolorBlueprint,
  maxLeg = MAX_LEGENDARIES_PER_DECK,
  maxRare = 999,
  maxRelics = bp.maxRelics
): PolyDeckSlotTracker {
  return {
    bp,
    deck: [],
    counts: new Map(),
    domCounts: { red: 0, blue: 0, purple: 0, green: 0, gold: 0, neutral: 0 },
    legCount: 0,
    rareCount: 0,
    creatureCount: 0,
    relicCount: 0,
    earlyDropCount: 0,
    maxLeg,
    maxRare,
    maxRelics,
  };
}

function canTrackerAcceptCard(t: PolyDeckSlotTracker, c: CardDefinition): boolean {
  if (t.deck.length >= REQUIRED_DECK_SIZE) return false;
  const curCopies = t.counts.get(c.id) ?? 0;
  if (curCopies >= MAX_COPIES_BY_RARITY[c.rarity]) return false;
  if (c.rarity === 'legendary' && t.legCount >= t.maxLeg) return false;
  if (c.rarity === 'rare' && t.rareCount >= t.maxRare) return false;
  if (c.type === 'relic' && t.relicCount >= t.maxRelics) return false;

  const isColoredPillar = t.bp.domains.includes(c.domain as Exclude<Domain, 'neutral'>);
  if (c.domain !== 'neutral' && !isColoredPillar) return false;
  if (c.domain === 'neutral' && t.domCounts.neutral >= t.bp.maxNeutralSupport) return false;

  const rem = REQUIRED_DECK_SIZE - t.deck.length;
  const defCreat = Math.max(0, t.bp.minCreatures - t.creatureCount);
  if (c.type !== 'creature' && rem <= defCreat) return false;

  let totalDeficit = Math.max(0, t.bp.minNeutralSupport - t.domCounts.neutral);
  for (const d of t.bp.domains) {
    totalDeficit += Math.max(0, t.bp.minPerColoredDomain - t.domCounts[d]);
  }

  const ownDeficit =
    c.domain === 'neutral'
      ? Math.max(0, t.bp.minNeutralSupport - t.domCounts.neutral)
      : Math.max(0, t.bp.minPerColoredDomain - t.domCounts[c.domain]);
  const otherDeficit = totalDeficit - ownDeficit;

  if (rem <= otherDeficit) return false;

  // Joint corner safety when remaining slots must satisfy BOTH domain minimums AND creature minimum
  if (rem <= totalDeficit && rem <= defCreat && c.type !== 'creature') {
    return false;
  }

  return true;
}

function pushCardIntoTracker(t: PolyDeckSlotTracker, c: CardDefinition): void {
  t.deck.push(c.id);
  t.counts.set(c.id, (t.counts.get(c.id) ?? 0) + 1);
  t.domCounts[c.domain] += 1;
  if (c.rarity === 'legendary') t.legCount += 1;
  if (c.rarity === 'rare') t.rareCount += 1;
  if (c.type === 'creature') t.creatureCount += 1;
  if (c.type === 'relic') t.relicCount += 1;
  if (c.cost <= 2 && (c.type === 'creature' || c.type === 'relic')) t.earlyDropCount += 1;
}

function buildSeed100PolycolorDeck(bp: PolycolorBlueprint, pool: CardDefinition[]): string[] {
  const scored = pool
    .map((card) => ({
      card,
      totalScore: computeIntrinsicCardQuality(card) + computePolycolorSynergyAffinity(card, bp),
    }))
    .sort((a, b) => b.totalScore - a.totalScore);

  const t = createSlotTracker(bp);
  const tryAddCopies = (c: CardDefinition, wanted: number) => {
    const cap = Math.min(MAX_COPIES_BY_RARITY[c.rarity], wanted);
    while ((t.counts.get(c.id) ?? 0) < cap && canTrackerAcceptCard(t, c)) {
      pushCardIntoTracker(t, c);
    }
  };

  // 0. Guarantee cover signature card
  const cover = CARDS_BY_ID[bp.coverCardId];
  if (cover && canTrackerAcceptCard(t, cover)) {
    pushCardIntoTracker(t, cover);
  }

  // 1. Seed smooth early drops (cost <= 2, affinityReq <= 2) evenly across pillars + Neutral fixers
  for (const item of scored) {
    if (t.earlyDropCount >= bp.minEarlyDrops) break;
    const c = item.card;
    if (c.cost <= 2 && c.affinityReq <= 2 && (c.type === 'creature' || c.type === 'relic')) {
      const maxPerDomEarly = bp.tierFormat === 'pentachromatic' ? 6 : 9;
      if (t.domCounts[c.domain] >= maxPerDomEarly) continue;
      tryAddCopies(c, MAX_COPIES_BY_RARITY[c.rarity]);
    }
  }

  // 2. Satisfy Neutral fixing minimum first (up to 2 Legendaries max so colored pillars share Legendaries)
  let neuLegs = t.legCount;
  for (const item of scored) {
    if (t.domCounts.neutral >= bp.minNeutralSupport) break;
    if (item.card.domain !== 'neutral') continue;
    if (item.card.rarity === 'legendary' && neuLegs >= 3) continue;
    const before = t.legCount;
    tryAddCopies(item.card, MAX_COPIES_BY_RARITY[item.card.rarity]);
    neuLegs += t.legCount - before;
  }

  // 3. Satisfy every colored domain's minimum pillar representation evenly
  const maxLegPerColor = bp.tierFormat === 'pentachromatic' ? 2 : 3;
  for (const dom of bp.domains) {
    let domLegs = 0;
    for (const item of scored) {
      if (t.domCounts[dom] >= bp.minPerColoredDomain) break;
      if (item.card.domain !== dom) continue;
      if (item.card.rarity === 'legendary' && domLegs >= maxLegPerColor) continue;
      const before = t.legCount;
      tryAddCopies(item.card, MAX_COPIES_BY_RARITY[item.card.rarity]);
      domLegs += t.legCount - before;
    }
  }

  // 4. Ensure creature floor
  for (const item of scored) {
    if (t.creatureCount >= bp.minCreatures) break;
    if (item.card.type === 'creature') {
      tryAddCopies(item.card, MAX_COPIES_BY_RARITY[item.card.rarity]);
    }
  }

  // 5. Fill remaining flexible slots by overall synergy + quality
  for (const item of scored) {
    if (t.deck.length >= REQUIRED_DECK_SIZE) break;
    tryAddCopies(item.card, MAX_COPIES_BY_RARITY[item.card.rarity]);
  }

  assertValid100PolycolorDeck(t.deck, bp, MAX_LEGENDARIES_PER_DECK, `seed:${bp.id}`, true);
  return t.deck;
}

interface PolycolorEvoState {
  bp: PolycolorBlueprint;
  eligiblePool: CardDefinition[];
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
  vsMonocolorWinRate: number;
  vsBicolorWinRate: number;
  jaccardStability: number;
  medianChampionCardCi95: number;
}

function buildExploration100PolycolorDeck(
  arch: PolycolorEvoState,
  targetCards: CardDefinition[]
): string[] {
  const t = createSlotTracker(
    arch.bp,
    MAX_LEGENDARIES_PER_DECK,
    999,
    Math.max(14, arch.bp.maxRelics)
  );

  const tryAdd = (c: CardDefinition, wanted: number) => {
    const cap = Math.min(MAX_COPIES_BY_RARITY[c.rarity], wanted);
    while ((t.counts.get(c.id) ?? 0) < cap && canTrackerAcceptCard(t, c)) {
      pushCardIntoTracker(t, c);
    }
  };

  for (const tc of targetCards) {
    if (t.deck.length >= 42) break;
    tryAdd(tc, MAX_COPIES_BY_RARITY[tc.rarity]);
  }

  for (const id of arch.cardIds) {
    if (t.earlyDropCount >= 26 || t.deck.length >= 78) break;
    const c = CARDS_BY_ID[id]!;
    if (c.cost <= 2 && (c.type === 'creature' || c.type === 'relic')) {
      tryAdd(c, 1);
    }
  }

  for (const id of arch.cardIds) {
    if (t.deck.length >= REQUIRED_DECK_SIZE) break;
    tryAdd(CARDS_BY_ID[id]!, 1);
  }

  for (const c of arch.eligiblePool) {
    if (t.deck.length >= REQUIRED_DECK_SIZE) break;
    tryAdd(c, MAX_COPIES_BY_RARITY[c.rarity]);
  }

  assertValid100PolycolorDeck(t.deck, arch.bp, MAX_LEGENDARIES_PER_DECK, `explore:${arch.bp.id}`, false);
  return t.deck;
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
  arch: PolycolorEvoState,
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

function unpackIntoPolyTrajectories(
  sink: Map<PolycolorArchetypeId, ValueTrainingSample[]>,
  archId: PolycolorArchetypeId,
  packed: PackedTrajectoryBatch | undefined,
  capPerArch: number
): void {
  if (!packed || packed.count === 0) return;
  const arr = sink.get(archId);
  if (!arr || arr.length >= capPerArch) return;
  const limit = Math.min(packed.count, capPerArch - arr.length);
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

function synthesizePolycolorProfileAndShapley(
  arch: PolycolorEvoState,
  gen: number,
  minComboCoPlays = 24
): {
  profile: DeckLearnedAiProfile;
  shapleyRanking: CardShapleyMetric[];
  crossDomainCombos: DiscoveredCardCombo[];
  medianDeckCardCi95: number;
} {
  const baseWr = arch.totalGames > 0 ? arch.totalWinsScore / arch.totalGames : 0.5;
  const kShrink = 12;

  const bestPairLiftForCard = new Map<string, number>();
  const discoveredCombos: Array<
    DiscoveredCardCombo & { liftLcb95: number; isCrossDomain: boolean }
  > = [];

  for (const pair of arch.pairStats.values()) {
    if (pair.coPlayGames < 12) continue;
    const nPair = pair.coPlayGames;
    const pairWr = (pair.coPlayScoreSum + 6 * baseWr) / (nPair + 6);
    const pairSe = Math.sqrt((pairWr * (1 - pairWr)) / (nPair + 7));

    const stA = arch.cardStats.get(pair.cardA);
    const stB = arch.cardStats.get(pair.cardB);
    const wrA = stA ? (stA.playedScoreSum + kShrink * baseWr) / (stA.playedGames + kShrink) : baseWr;
    const wrB = stB ? (stB.playedScoreSum + kShrink * baseWr) / (stB.playedGames + kShrink) : baseWr;

    const cA = CARDS_BY_ID[pair.cardA];
    const cB = CARDS_BY_ID[pair.cardB];
    if (!cA || !cB) continue;

    const isCrossDomain = cA.domain !== cB.domain;
    const rawPairLift = pairWr - Math.max(wrA, wrB);
    const conservativePairLift =
      Math.max(0, rawPairLift - 0.85 * pairSe) * (isCrossDomain ? 1.2 : 1.0);

    if (conservativePairLift > (bestPairLiftForCard.get(pair.cardA) ?? 0)) {
      bestPairLiftForCard.set(pair.cardA, conservativePairLift);
    }
    if (conservativePairLift > (bestPairLiftForCard.get(pair.cardB) ?? 0)) {
      bestPairLiftForCard.set(pair.cardB, conservativePairLift);
    }

    const liftOverBase = pairWr - baseWr;
    const liftLcb95 = liftOverBase - 1.645 * pairSe;

    if (nPair >= minComboCoPlays && liftLcb95 >= 0.01 && rawPairLift >= 0.01) {
      discoveredCombos.push({
        cardAId: pair.cardA,
        cardBId: pair.cardB,
        coPlayWinRate: Math.round(pairWr * 1000) / 1000,
        liftOverBaseline: Math.round(liftOverBase * 1000) / 1000,
        liftLcb95: liftLcb95 + (isCrossDomain ? 0.018 : 0),
        isCrossDomain,
        sampleCount: nPair,
        synergyNote: `${cA.name} (${cA.domain.toUpperCase()}) + ${cB.name} (${cB.domain.toUpperCase()}) (+${Math.round(liftOverBase * 100)}% WR | IC95% ±${(1.96 * pairSe * 100).toFixed(1)}%, n=${nPair})`,
      });
    }
  }

  discoveredCombos.sort((a, b) => b.liftLcb95 - a.liftLcb95);
  const topCombos: DiscoveredCardCombo[] = discoveredCombos
    .slice(0, 12)
    .map(({ liftLcb95: _u1, isCrossDomain: _u2, ...rest }) => rest);

  const crossDomainCombos: DiscoveredCardCombo[] = discoveredCombos
    .filter((c) => c.isCrossDomain)
    .slice(0, 8)
    .map(({ liftLcb95: _u1, isCrossDomain: _u2, ...rest }) => rest);

  const shapleyRanking: CardShapleyMetric[] = [];
  const mulliganKeepCandidates: Array<{ id: string; score: number }> = [];
  const channelPrioCandidates: Array<{ id: string; score: number }> = [];
  const channelAvoidIds: string[] = [];
  const highImpactCardBoosts: Record<string, number> = {};

  for (const card of arch.eligiblePool) {
    const st = arch.cardStats.get(card.id);
    const playedGames = st?.playedGames ?? 0;
    const playedWr = ((st?.playedScoreSum ?? 0) + kShrink * baseWr) / (playedGames + kShrink);
    const posteriorSe = Math.sqrt((playedWr * (1 - playedWr)) / (playedGames + kShrink + 1));
    const ci95HalfWidth = 1.96 * posteriorSe;

    const drawnGames = Math.max(1, st?.drawnGames ?? 0);
    const stuckRate = st && st.drawnGames >= 10 ? st.stuckInHandGames / drawnGames : 0.15;
    const pairLift = Math.max(0, bestPairLiftForCard.get(card.id) ?? 0);

    const shapley = playedWr - baseWr - 0.16 * (stuckRate - 0.15) + 0.38 * pairLift;
    const shapleyLcb = shapley - 1.28 * posteriorSe;

    if (playedGames >= 8) {
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

    if (playedGames >= 16 && shapleyLcb >= 0.015) {
      highImpactCardBoosts[card.id] = Math.round(clamp(shapley * 180, 4, 24) * 10) / 10;
      if (card.rarity === 'legendary' || shapleyLcb >= 0.035) {
        channelAvoidIds.push(card.id);
      }
    }

    if (st && st.keptMulliganGames >= 12 && card.cost <= 3) {
      const keptWr = (st.keptMulliganScoreSum + 8 * baseWr) / (st.keptMulliganGames + 8);
      const keptSe = Math.sqrt((keptWr * (1 - keptWr)) / (st.keptMulliganGames + 9));
      if (keptWr - 0.8 * keptSe >= baseWr + 0.008) {
        mulliganKeepCandidates.push({ id: card.id, score: keptWr - 0.5 * keptSe });
      }
    }

    if (st && st.channeledEarlyGames >= 8 && card.rarity !== 'legendary') {
      const chanWr = (st.channeledEarlyScoreSum + 8 * baseWr) / (st.channeledEarlyGames + 8);
      if (chanWr >= baseWr) {
        channelPrioCandidates.push({ id: card.id, score: chanWr + stuckRate * 0.2 });
      }
    }
  }

  shapleyRanking.sort(
    (a, b) =>
      0.65 * (b.shapleyLcb ?? b.shapleyValue) +
      0.35 * b.shapleyValue -
      (0.65 * (a.shapleyLcb ?? a.shapleyValue) + 0.35 * a.shapleyValue)
  );
  mulliganKeepCandidates.sort((a, b) => b.score - a.score);
  channelPrioCandidates.sort((a, b) => b.score - a.score);

  const ciByCard = new Map<string, number>();
  for (const s of shapleyRanking) ciByCard.set(s.cardId, s.ci95HalfWidth ?? 0.18);
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

  return { profile, shapleyRanking, crossDomainCombos, medianDeckCardCi95 };
}

function proposeChallengerPolycolorDeckAndWeights(
  arch: PolycolorEvoState,
  shapleyRanking: CardShapleyMetric[],
  gen: number,
  rng: () => number
): { challengerCardIds: string[]; challengerWeights: AiDecisionWeights } {
  const lcbById = new Map<string, number>();
  for (const s of shapleyRanking) {
    lcbById.set(s.cardId, 0.65 * (s.shapleyLcb ?? s.shapleyValue) + 0.35 * s.shapleyValue);
  }

  const baseCounts = new Map<string, number>();
  for (const id of arch.cardIds) baseCounts.set(id, (baseCounts.get(id) ?? 0) + 1);

  const uniqueInDeck = Array.from(baseCounts.keys()).sort((a, b) => {
    const ca = CARDS_BY_ID[a]!;
    const cb = CARDS_BY_ID[b]!;
    const sa = (lcbById.get(a) ?? -0.03) + computePolycolorSynergyAffinity(ca, arch.bp) * 0.007;
    const sb = (lcbById.get(b) ?? -0.03) + computePolycolorSynergyAffinity(cb, arch.bp) * 0.007;
    return sa - sb;
  });

  const slotsToSwap = gen <= 6 ? 4 : gen <= 10 ? 3 : 2;
  const keptIds = arch.cardIds.slice();
  let removed = 0;

  for (const weakId of uniqueInDeck) {
    if (removed >= slotsToSwap) break;
    if (weakId === arch.bp.coverCardId) continue;
    const card = CARDS_BY_ID[weakId]!;
    if (card.effects.some((e) => e.type === 'break_domain_expansion')) continue;
    const idx = keptIds.indexOf(weakId);
    if (idx !== -1) {
      keptIds.splice(idx, 1);
      removed += 1;
    }
  }

  const tracker = createSlotTracker(arch.bp);
  for (const id of keptIds) {
    const c = CARDS_BY_ID[id]!;
    if (canTrackerAcceptCard(tracker, c)) {
      pushCardIntoTracker(tracker, c);
    }
  }

  const totalPulls = Math.max(20, arch.totalGames);
  const baseWr = arch.totalGames > 0 ? arch.totalWinsScore / arch.totalGames : 0.5;
  const exploreCoef = Math.max(0.05, 0.15 * Math.pow(0.92, gen - 1));

  const ucbCandidates = arch.eligiblePool
    .map((card) => {
      const pulls = arch.ucbPulls.get(card.id) ?? 0;
      const rew = arch.ucbRewardSum.get(card.id) ?? 0;
      const empMean = (rew + 8 * baseWr) / (pulls + 8);
      const exploration = exploreCoef * Math.sqrt(Math.log(totalPulls) / (pulls + 1));
      const prior =
        (computeIntrinsicCardQuality(card) + computePolycolorSynergyAffinity(card, arch.bp)) * 0.011;
      const noise = (rng() - 0.5) * 0.018;
      return {
        card,
        ucbScore: empMean + exploration + prior + noise,
      };
    })
    .sort((a, b) => b.ucbScore - a.ucbScore);

  for (const cand of ucbCandidates) {
    if (tracker.deck.length >= REQUIRED_DECK_SIZE) break;
    if (canTrackerAcceptCard(tracker, cand.card)) {
      pushCardIntoTracker(tracker, cand.card);
    }
  }

  for (const c of arch.eligiblePool) {
    if (tracker.deck.length >= REQUIRED_DECK_SIZE) break;
    while (canTrackerAcceptCard(tracker, c) && tracker.deck.length < REQUIRED_DECK_SIZE) {
      pushCardIntoTracker(tracker, c);
    }
  }

  assertValid100PolycolorDeck(
    tracker.deck,
    arch.bp,
    MAX_LEGENDARIES_PER_DECK,
    `challenger:${arch.bp.id}`,
    true
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

  return { challengerCardIds: tracker.deck, challengerWeights: wNext };
}

function distillGraduatedPolycolorTierDecks(
  arch: PolycolorEvoState,
  shapleyRanking: CardShapleyMetric[]
): Record<AiSkillTier, TierDeckMetadata> {
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

  const computeMeta = (tier: AiSkillTier, ids: string[]): TierDeckMetadata => {
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

  const out: Partial<Record<AiSkillTier, TierDeckMetadata>> = {
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
      for (const c of arch.eligiblePool) {
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

    const tracker = createSlotTracker(arch.bp, spec.maxLeg, spec.maxRare, arch.bp.maxRelics);

    for (const cid of arch.cardIds) {
      if (excludedIds.has(cid)) continue;
      const c = CARDS_BY_ID[cid]!;
      if (canTrackerAcceptCard(tracker, c)) {
        pushCardIntoTracker(tracker, c);
      }
    }

    const fillCandidates = arch.eligiblePool
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
          computePolycolorSynergyAffinity(a, arch.bp) +
          computeIntrinsicCardQuality(a) * (tier >= 3 ? 0.8 : 0.35) +
          (shapleyMap.get(a.id) ?? 0) * 15;
        const sb =
          computePolycolorSynergyAffinity(b, arch.bp) +
          computeIntrinsicCardQuality(b) * (tier >= 3 ? 0.8 : 0.35) +
          (shapleyMap.get(b.id) ?? 0) * 15;
        return sb - sa;
      });

    const addUpTo = (source: CardDefinition[]) => {
      for (const c of source) {
        if (tracker.deck.length >= REQUIRED_DECK_SIZE) break;
        while (canTrackerAcceptCard(tracker, c) && tracker.deck.length < REQUIRED_DECK_SIZE) {
          pushCardIntoTracker(tracker, c);
        }
      }
    };

    addUpTo(fillCandidates);
    if (tracker.deck.length < REQUIRED_DECK_SIZE) addUpTo(arch.eligiblePool);

    assertValid100PolycolorDeck(
      tracker.deck,
      arch.bp,
      spec.maxLeg,
      `tier${tier}:${arch.bp.id}`,
      true
    );
    out[tier] = computeMeta(tier, tracker.deck);
  }

  return out as Record<AiSkillTier, TierDeckMetadata>;
}

function rebalanceTrajectorySamples(samples: ValueTrainingSample[]): ValueTrainingSample[] {
  let posWeightSum = 0;
  let negWeightSum = 0;
  for (const s of samples) {
    if (s.target > 0.01) posWeightSum += s.weight;
    else if (s.target < -0.01) negWeightSum += s.weight;
  }
  if (posWeightSum <= 0 || negWeightSum <= 0) return samples;
  const halfTotal = 0.5 * (posWeightSum + negWeightSum);
  const posScale = clamp(halfTotal / posWeightSum, 0.35, 3.0);
  const negScale = clamp(halfTotal / negWeightSum, 0.35, 3.0);
  return samples.map((s) => ({
    features: s.features,
    target: s.target,
    weight:
      s.target > 0.01
        ? s.weight * posScale
        : s.target < -0.01
          ? s.weight * negScale
          : s.weight,
  }));
}

function resolveWarmStartMlpForBlueprint(bp: PolycolorBlueprint): SerializedValueMlp | null {
  const biId = resolveBicolorArchetypeForDomains([bp.domains[0], bp.domains[1]]);
  if (biId && BICOLOR_VALUE_NETWORKS[biId]) {
    return { ...BICOLOR_VALUE_NETWORKS[biId]!, domain: bp.domains[0] };
  }
  const monoMlp = DOMAIN_VALUE_NETWORKS[bp.domains[0]];
  return monoMlp ? { ...monoMlp, domain: bp.domains[0] } : null;
}

// ============================================================================
// MAIN PARALLELIZED TRICOLOR & PENTACHROMATIC CO-EVOLUTION PIPELINE
// ============================================================================
async function main() {
  const tStart = Date.now();
  const rng = createRng(20261103);
  const workerCount = Math.max(2, Math.min(10, os.cpus().length - 2));

  const MIN_GENERATIONS = 10;
  const MAX_GENERATIONS = 13;
  const TARGET_DECK_JACCARD_STABILITY = 0.975;
  const TARGET_CARD_MEDIAN_CI95 = 0.055;
  const TARGET_TIER_LADDER_CI95 = 0.030;
  const MIN_COMBO_COPLAYS = 24;
  const TRAJECTORY_CAP_PER_ARCH = 15000;

  console.log('================================================================================');
  console.log(' CHROMATIC PACT — FASE 3: CO-EVOLUÇÃO TRICOLOR & PENTACROMÁTICA ÁPICE');
  console.log(` • Pool Paralelo: ${workerCount} Worker Threads (${os.cpus().length} CPUs lógicas)`);
  console.log(
    ' • Topologia: 10 Tríades/Cataclismos Tricolores + 3 Soberanos Pentacromáticos (Tiers I–V)'
  );
  console.log(
    ` • Critérios IC 95%: Escada Tier <= ±${(TARGET_TIER_LADDER_CI95 * 100).toFixed(1)}% | Jaccard >= ${(TARGET_DECK_JACCARD_STABILITY * 100).toFixed(1)}%`
  );
  console.log('================================================================================');

  const pool = new SimulationWorkerPool(workerCount);

  try {
    // 1. Seed all 13 Polycolor Archetypes & Warm-Start 13 Dedicated Value MLPs from Phase 2 Bicolor Networks
    const archetypes: PolycolorEvoState[] = [];
    const trajectoriesByArch = new Map<PolycolorArchetypeId, ValueTrainingSample[]>();
    const trainedMlps = new Map<PolycolorArchetypeId, SerializedValueMlp>();

    for (const bp of POLYCOLOR_BLUEPRINTS) {
      const eligiblePool = getEligiblePoolForBlueprint(bp);
      const seedIds = buildSeed100PolycolorDeck(bp, eligiblePool);

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

      archetypes.push({
        bp,
        eligiblePool,
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
        vsMonocolorWinRate: 0.5,
        vsBicolorWinRate: 0.5,
        jaccardStability: 0,
        medianChampionCardCi95: 0.25,
      });

      trajectoriesByArch.set(bp.id, []);
      const warm = resolveWarmStartMlpForBlueprint(bp);
      if (warm) {
        trainedMlps.set(bp.id, warm);
      }
    }

    let totalMatchesSimulated = 0;

    // 1B. Exploratory Sweep across Legendary & Rare Multi-Domain Pools
    console.log(
      '\n[Etapa 1B] Varredura Exploratória dos Acervos Tricolores & Pentacromáticos (Lendárias, Raras & Sinergias)...'
    );
    const exploreStart = Date.now();
    const exploreJobs: Array<{
      archA: PolycolorEvoState;
      archB: PolycolorEvoState;
      promise: Promise<WorkerPairBatchResponse>;
    }> = [];

    for (let idx = 0; idx < archetypes.length; idx++) {
      const arch = archetypes[idx];
      const highRarityPool = arch.eligiblePool
        .filter((c) => c.rarity === 'legendary' || c.rarity === 'rare')
        .sort((a, b) => {
          const rw: Record<Rarity, number> = { legendary: 4, rare: 3, uncommon: 2, common: 1 };
          return rw[b.rarity] - rw[a.rarity];
        });

      const chunkSize = 48;
      for (let cStart = 0; cStart < Math.min(288, highRarityPool.length); cStart += chunkSize) {
        const chunk = highRarityPool.slice(cStart, cStart + chunkSize);
        const expDeck = buildExploration100PolycolorDeck(arch, chunk);
        const opp = archetypes[(idx + 2 + Math.floor(cStart / chunkSize) * 3) % archetypes.length];
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
            domainA: arch.bp.domains[0],
            domainB: opp.bp.domains[0],
            profileA: arch.profile,
            profileB: opp.profile,
            skillTierA: 3,
            skillTierB: 3,
            mlpA: trainedMlps.get(arch.bp.id) ?? null,
            mlpB: trainedMlps.get(opp.bp.id) ?? null,
            fastRollout: true,
            numMirrorPairs: 8,
            collectTelemetryA: true,
            collectTelemetryB: true,
            maxTrajectoriesPerSide: 75,
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
      unpackIntoPolyTrajectories(
        trajectoriesByArch,
        job.archA.bp.id,
        res.trajectoriesA,
        TRAJECTORY_CAP_PER_ARCH
      );
      unpackIntoPolyTrajectories(
        trajectoriesByArch,
        job.archB.bp.id,
        res.trajectoriesB,
        TRAJECTORY_CAP_PER_ARCH
      );
    }
    console.log(
      `   ✓ Varredura concluída em ${((Date.now() - exploreStart) / 1000).toFixed(1)}s (${totalMatchesSimulated} duelos exploratórios).`
    );

    const getSparringPartners = (arch: PolycolorEvoState, gen: number): PolycolorEvoState[] => {
      const others = archetypes.filter((a) => a.bp.id !== arch.bp.id);
      const picked: PolycolorEvoState[] = [];
      const offset = (gen * 3 + archetypes.indexOf(arch) * 2) % others.length;
      for (let k = 0; k < 6; k++) {
        picked.push(others[(offset + k * 2) % others.length]);
      }
      return picked;
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

      if (gen === 3 || gen === 7 || gen === 10) {
        console.log(
          `\n[Motor Neural — Geração ${gen}] Refinando 13 Redes Value MLP Policromáticas (Warm-Start + 50/50 Adam)...`
        );
        let accSum = 0;
        let netCnt = 0;
        for (const arch of archetypes) {
          const samples = trajectoriesByArch.get(arch.bp.id) ?? [];
          if (samples.length >= 350) {
            const balanced = rebalanceTrajectorySamples(samples);
            const warm =
              trainedMlps.get(arch.bp.id) ?? resolveWarmStartMlpForBlueprint(arch.bp);
            const mlp = trainValueMlpWithAdam(arch.bp.domains[0], balanced, {
              epochs: 14,
              batchSize: 80,
              learningRate: 0.0018,
              seed: 7000 * gen + netCnt,
              warmStartMlp: warm,
            });
            trainedMlps.set(arch.bp.id, mlp);
            accSum += mlp.signAccuracy;
            netCnt += 1;
          }
        }
        console.log(
          `   ✓ ${netCnt}/13 Redes Value MLP atualizadas | Acurácia Média de Sinal: ${((accSum / Math.max(1, netCnt)) * 100).toFixed(1)}%`
        );
      }

      for (const arch of archetypes) {
        arch.prevGenCardIds = arch.cardIds.slice();
      }

      const leagueJobs: Array<{
        archA: PolycolorEvoState;
        archB: PolycolorEvoState;
        isPrimaryLeagueForA: boolean;
        promise: Promise<WorkerPairBatchResponse>;
      }> = [];

      for (const arch of archetypes) {
        const partners = getSparringPartners(arch, gen);
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
              domainA: arch.bp.domains[0],
              domainB: opp.bp.domains[0],
              profileA: arch.profile,
              profileB: opp.profile,
              skillTierA: 3,
              skillTierB: 3,
              mlpA: trainedMlps.get(arch.bp.id) ?? null,
              mlpB: trainedMlps.get(opp.bp.id) ?? null,
              fastRollout: true,
              numMirrorPairs: 6,
              collectTelemetryA: true,
              collectTelemetryB: true,
              maxTrajectoriesPerSide: 55,
            }),
          });
        }

        const underSampled = arch.eligiblePool
          .filter((c) => {
            const p = arch.cardStats.get(c.id)?.playedGames ?? 0;
            const inChamp = arch.cardIds.includes(c.id);
            return (inChamp && p < 45) || (c.rarity === 'legendary' && p < 26);
          })
          .sort(
            (a, b) =>
              (arch.cardStats.get(a.id)?.playedGames ?? 0) -
              (arch.cardStats.get(b.id)?.playedGames ?? 0)
          );

        if (underSampled.length > 0 && gen <= 9) {
          const boostDeck = buildExploration100PolycolorDeck(arch, underSampled.slice(0, 28));
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
              domainA: arch.bp.domains[0],
              domainB: opp.bp.domains[0],
              profileA: arch.profile,
              profileB: opp.profile,
              skillTierA: 3,
              skillTierB: 3,
              mlpA: trainedMlps.get(arch.bp.id) ?? null,
              mlpB: trainedMlps.get(opp.bp.id) ?? null,
              fastRollout: true,
              numMirrorPairs: 6,
              collectTelemetryA: true,
              collectTelemetryB: true,
              maxTrajectoriesPerSide: 35,
            }),
          });
        }
      }

      const leagueResults = await Promise.all(leagueJobs.map((j) => j.promise));
      const genScoreByArch = new Map<PolycolorArchetypeId, { score: number; games: number }>();

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

        unpackIntoPolyTrajectories(
          trajectoriesByArch,
          job.archA.bp.id,
          res.trajectoriesA,
          TRAJECTORY_CAP_PER_ARCH
        );
        unpackIntoPolyTrajectories(
          trajectoriesByArch,
          job.archB.bp.id,
          res.trajectoriesB,
          TRAJECTORY_CAP_PER_ARCH
        );
      }

      const challengerProposals = archetypes.map((arch) => {
        const rec = genScoreByArch.get(arch.bp.id);
        const genWr = rec && rec.games > 0 ? rec.score / rec.games : 0.5;
        if (gen === 1) arch.seedWinRate = genWr;
        arch.latestWinRate = genWr;

        const { profile, shapleyRanking, medianDeckCardCi95 } =
          synthesizePolycolorProfileAndShapley(arch, gen, MIN_COMBO_COPLAYS);
        arch.profile = profile;
        arch.medianChampionCardCi95 = medianDeckCardCi95;

        const { challengerCardIds, challengerWeights } =
          proposeChallengerPolycolorDeckAndWeights(arch, shapleyRanking, gen, rng);
        const challengerProfile: DeckLearnedAiProfile = {
          ...arch.profile,
          weights: challengerWeights,
        };
        return {
          arch,
          challengerCardIds,
          challengerWeights,
          challengerProfile,
          partners: getSparringPartners(arch, gen + 1).slice(0, 4),
          directStat: new PairedStatAccumulator(),
          challGauntStat: new PairedStatAccumulator(),
          incGauntStat: new PairedStatAccumulator(),
          decided: false,
          promoted: false,
        };
      });

      for (let wave = 1; wave <= 3; wave++) {
        const activeProps = challengerProposals.filter((p) => !p.decided);
        if (activeProps.length === 0) break;

        const wavePromises: Array<{
          propIdx: number;
          kind: 'direct' | 'chall_gaunt' | 'inc_gaunt';
          opp: PolycolorEvoState;
          promise: Promise<WorkerPairBatchResponse>;
        }> = [];

        for (let pIdx = 0; pIdx < challengerProposals.length; pIdx++) {
          const prop = challengerProposals[pIdx];
          if (prop.decided) continue;
          const archMlp = trainedMlps.get(prop.arch.bp.id) ?? null;

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
              domainA: prop.arch.bp.domains[0],
              domainB: prop.arch.bp.domains[0],
              profileA: prop.challengerProfile,
              profileB: prop.arch.profile,
              skillTierA: 3,
              skillTierB: 3,
              mlpA: archMlp,
              mlpB: archMlp,
              fastRollout: true,
              numMirrorPairs: 8,
              collectTelemetryA: true,
              collectTelemetryB: true,
              maxTrajectoriesPerSide: 18,
            }),
          });

          for (const gp of prop.partners) {
            const gpMlp = trainedMlps.get(gp.bp.id) ?? null;
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
                domainA: prop.arch.bp.domains[0],
                domainB: gp.bp.domains[0],
                profileA: prop.challengerProfile,
                profileB: gp.profile,
                skillTierA: 3,
                skillTierB: 3,
                mlpA: archMlp,
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
                domainA: prop.arch.bp.domains[0],
                domainB: gp.bp.domains[0],
                profileA: prop.arch.profile,
                profileB: gp.profile,
                skillTierA: 3,
                skillTierB: 3,
                mlpA: archMlp,
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

        const waveRes = await Promise.all(wavePromises.map((w) => w.promise));
        for (let i = 0; i < wavePromises.length; i++) {
          const meta = wavePromises[i];
          const res = waveRes[i];
          const prop = challengerProposals[meta.propIdx];
          totalMatchesSimulated += res.matchesPlayed;

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

          unpackIntoPolyTrajectories(
            trajectoriesByArch,
            prop.arch.bp.id,
            res.trajectoriesA,
            TRAJECTORY_CAP_PER_ARCH
          );
          unpackIntoPolyTrajectories(
            trajectoriesByArch,
            meta.opp.bp.id,
            res.trajectoriesB,
            TRAJECTORY_CAP_PER_ARCH
          );

          if (meta.kind === 'direct') {
            prop.directStat.addBatch(res.pairCount, res.pairMeanSum, res.pairMeanSumSq);
          } else if (meta.kind === 'chall_gaunt') {
            prop.challGauntStat.addBatch(res.pairCount, res.pairMeanSum, res.pairMeanSumSq);
          } else {
            prop.incGauntStat.addBatch(res.pairCount, res.pairMeanSum, res.pairMeanSumSq);
          }
        }

        for (const prop of challengerProposals) {
          if (prop.decided) continue;
          const directAdv = prop.directStat.mean - 0.5;
          const gauntAdv = prop.challGauntStat.mean - prop.incGauntStat.mean;
          const combAdv = 0.5 * directAdv + 0.5 * gauntAdv;
          const combSe = Math.sqrt(
            0.25 * prop.directStat.stdError ** 2 +
              0.25 * (prop.challGauntStat.stdError ** 2 + prop.incGauntStat.stdError ** 2)
          );
          const lcb90 = combAdv - 1.28 * combSe;
          const ucb90 = combAdv + 1.28 * combSe;

          if (lcb90 > 0) {
            prop.promoted = true;
            prop.decided = true;
          } else if (ucb90 < 0.005) {
            prop.promoted = false;
            prop.decided = true;
          } else if (wave === 3) {
            prop.promoted = combAdv >= 0.025 && prop.directStat.mean >= 0.515;
            prop.decided = true;
          }
        }
      }

      let promotedCount = 0;
      let jaccardSum = 0;
      let maxMedianCi95 = 0;

      for (const prop of challengerProposals) {
        if (prop.promoted) {
          prop.arch.cardIds = prop.challengerCardIds;
          prop.arch.weights = prop.challengerWeights;
          prop.arch.latestWinRate = Math.max(prop.arch.latestWinRate, prop.challGauntStat.mean);
          promotedCount += 1;
        }
        const jac = computeMultisetJaccard(prop.arch.prevGenCardIds, prop.arch.cardIds);
        prop.arch.jaccardStability = jac;
        jaccardSum += jac;
        if (prop.arch.medianChampionCardCi95 > maxMedianCi95) {
          maxMedianCi95 = prop.arch.medianChampionCardCi95;
        }
      }

      finalMeanJaccard = jaccardSum / archetypes.length;
      finalMaxMedianCardCi95 = maxMedianCi95;

      const genElapsed = ((Date.now() - genStart) / 1000).toFixed(1);
      console.log(
        `[Geração ${String(gen).padStart(2, ' ')}/${MAX_GENERATIONS}] ${genElapsed}s | Promovidos: ${String(promotedCount).padStart(2, ' ')}/13 | Jaccard Médio: ${(finalMeanJaccard * 100).toFixed(1)}% | Max Card IC95% Mediano: ±${(maxMedianCi95 * 100).toFixed(2)}% | Acumulado: ${totalMatchesSimulated.toLocaleString()} duelos`
      );

      if (
        gen >= MIN_GENERATIONS &&
        finalMeanJaccard >= TARGET_DECK_JACCARD_STABILITY &&
        maxMedianCi95 <= TARGET_CARD_MEDIAN_CI95
      ) {
        consecutiveStableGens += 1;
        if (consecutiveStableGens >= 2) {
          convergedEarly = true;
          console.log(
            `   ✓ Convergência estatística atingida na Geração ${gen} (Jaccard >= 97.5% por 2 gerações consecutivas)!`
          );
          break;
        }
      } else {
        consecutiveStableGens = 0;
      }
    }

    // 3. Final Deep Training of all 13 Polycolor Value MLPs (50/50 Class-Balanced + Warm-Start)
    console.log(
      '\n[Etapa 3] Treinamento Profundo Final das 13 Redes Neurais Value MLP Policromáticas (Adam + 50/50 Class-Balanced)...'
    );
    const finalPolyValueNetworks: Partial<Record<PolycolorArchetypeId, SerializedValueMlp>> = {};
    let totalStateSamples = 0;

    for (let idx = 0; idx < archetypes.length; idx++) {
      const arch = archetypes[idx];
      const rawSamples = trajectoriesByArch.get(arch.bp.id) ?? [];
      totalStateSamples += rawSamples.length;
      const balanced = rebalanceTrajectorySamples(rawSamples);
      const warm = trainedMlps.get(arch.bp.id) ?? resolveWarmStartMlpForBlueprint(arch.bp);
      const mlp = trainValueMlpWithAdam(arch.bp.domains[0], balanced, {
        epochs: 26,
        batchSize: 80,
        learningRate: 0.002,
        weightDecay: 0.00012,
        seed: 95000 + idx,
        warmStartMlp: warm,
      });
      finalPolyValueNetworks[arch.bp.id] = mlp;
      trainedMlps.set(arch.bp.id, mlp);
      console.log(
        `   ✓ MLP [${arch.bp.id.padEnd(26, ' ')}]: ${rawSamples.length.toLocaleString()} estados | MSE ${mlp.initialMse.toFixed(4)} -> ${mlp.finalMse.toFixed(4)} | SignAcc: ${(mlp.signAccuracy * 100).toFixed(1)}%`
      );
    }

    // 4. Distill Stabilized Tier I..V Decks for all 13 Polycolor Archetypes
    console.log(
      '\n[Etapa 4] Destilando Grimórios Tricolores & Pentacromáticos (Tiers I, II, III, IV e V) para os 13 Arquétipos...'
    );
    const masteryByArchetype = {} as Record<
      PolycolorArchetypeId,
      StabilizedPolycolorArchetypeMastery
    >;

    for (const arch of archetypes) {
      const { profile, shapleyRanking, crossDomainCombos, medianDeckCardCi95 } =
        synthesizePolycolorProfileAndShapley(arch, generationsExecuted, MIN_COMBO_COPLAYS);
      arch.profile = profile;
      arch.medianChampionCardCi95 = medianDeckCardCi95;
      const tierDecks = distillGraduatedPolycolorTierDecks(arch, shapleyRanking);

      const breakdown: Record<string, number> = {};
      for (const cid of arch.cardIds) {
        const d = CARDS_BY_ID[cid]!.domain;
        breakdown[d] = (breakdown[d] ?? 0) + 1;
      }

      masteryByArchetype[arch.bp.id] = {
        archetypeId: arch.bp.id,
        tierFormat: arch.bp.tierFormat,
        domains: [...arch.bp.domains],
        conclaveId: arch.bp.conclaveId,
        classicDeckIds: arch.bp.classicDeckIds,
        name: arch.bp.name,
        subtitle: arch.bp.subtitle,
        strategySummary: arch.bp.strategySummary,
        tacticalIdentity: arch.bp.tacticalIdentity,
        coverCardId: arch.bp.coverCardId,
        generationsEvolved: generationsExecuted,
        matchesSimulated: arch.totalGames,
        seedWinRate: Math.round(arch.seedWinRate * 1000) / 1000,
        championWinRate: Math.round(arch.latestWinRate * 1000) / 1000,
        vsMonocolorWinRate: 0.5,
        vsBicolorWinRate: 0.5,
        championDeckJaccardStability: Math.round(arch.jaccardStability * 1000) / 1000,
        medianCardCi95HalfWidth: Math.round(medianDeckCardCi95 * 10000) / 10000,
        domainCardBreakdown: breakdown,
        crossDomainCombos,
        learnedProfile: profile,
        topShapleyCards: shapleyRanking.slice(0, 28),
        tierDecks,
      };
    }

    // 4B. 13-Archetype Polycolor Tier V Champion Round-Robin
    console.log(
      '\n[Etapa 4B] Torneio Todos-Contra-Todos dos 13 Campeões Policromáticos Tier V (78 confrontos * 8 jogos = 624 duelos Beam Search)...'
    );
    const champStart = Date.now();
    const champJobs: Array<{
      idA: PolycolorArchetypeId;
      idB: PolycolorArchetypeId;
      promise: Promise<WorkerPairBatchResponse>;
    }> = [];

    for (let i = 0; i < archetypes.length; i++) {
      for (let j = i + 1; j < archetypes.length; j++) {
        const a = archetypes[i];
        const b = archetypes[j];
        champJobs.push({
          idA: a.bp.id,
          idB: b.bp.id,
          promise: pool.runBatch({
            deckACardIds: masteryByArchetype[a.bp.id].tierDecks[5].cardIds,
            deckBCardIds: masteryByArchetype[b.bp.id].tierDecks[5].cardIds,
            nameA: a.bp.name,
            nameB: b.bp.name,
            deckIdA: a.bp.id,
            deckIdB: b.bp.id,
            domainA: a.bp.domains[0],
            domainB: b.bp.domains[0],
            profileA: a.profile,
            profileB: b.profile,
            skillTierA: 5,
            skillTierB: 5,
            mlpA: finalPolyValueNetworks[a.bp.id] ?? null,
            mlpB: finalPolyValueNetworks[b.bp.id] ?? null,
            fastRollout: true,
            numMirrorPairs: 4,
            collectTelemetryA: false,
            collectTelemetryB: false,
            maxTrajectoriesPerSide: 0,
          }),
        });
      }
    }

    const champRes = await Promise.all(champJobs.map((j) => j.promise));
    const champWins = new Map<PolycolorArchetypeId, { score: number; games: number }>();
    for (let i = 0; i < champJobs.length; i++) {
      const job = champJobs[i];
      const res = champRes[i];
      totalMatchesSimulated += res.matchesPlayed;
      const rA = champWins.get(job.idA) ?? { score: 0, games: 0 };
      rA.score += res.scoreASum;
      rA.games += res.matchesPlayed;
      champWins.set(job.idA, rA);

      const rB = champWins.get(job.idB) ?? { score: 0, games: 0 };
      rB.score += res.matchesPlayed - res.scoreASum;
      rB.games += res.matchesPlayed;
      champWins.set(job.idB, rB);
    }

    // 4C. Cross-Format Showdown 1: 13 Polycolor Tier V vs. 16 Monocolor Tier V
    console.log(
      '\n[Etapa 4C] Confronto Inter-Formatos #1: 13 Policromáticos Tier V vs. 16 Monocolores Tier V (832 duelos Beam Search)...'
    );
    const monoIds = Object.keys(MONOCOLOR_ARCHETYPE_MASTERY) as MonocolorArchetypeId[];
    const vsMonoJobs: Array<{
      polyId: PolycolorArchetypeId;
      promise: Promise<WorkerPairBatchResponse>;
    }> = [];

    for (const arch of archetypes) {
      for (const mId of monoIds) {
        const mono = MONOCOLOR_ARCHETYPE_MASTERY[mId];
        if (!mono) continue;
        vsMonoJobs.push({
          polyId: arch.bp.id,
          promise: pool.runBatch({
            deckACardIds: masteryByArchetype[arch.bp.id].tierDecks[5].cardIds,
            deckBCardIds: mono.tierDecks[5].cardIds,
            nameA: arch.bp.name,
            nameB: mono.name,
            deckIdA: arch.bp.id,
            deckIdB: mono.archetypeId,
            domainA: arch.bp.domains[0],
            domainB: mono.domain,
            profileA: arch.profile,
            profileB: mono.learnedProfile,
            skillTierA: 5,
            skillTierB: 5,
            mlpA: finalPolyValueNetworks[arch.bp.id] ?? null,
            mlpB: DOMAIN_VALUE_NETWORKS[mono.domain] ?? null,
            fastRollout: true,
            numMirrorPairs: 2,
            collectTelemetryA: false,
            collectTelemetryB: false,
            maxTrajectoriesPerSide: 0,
          }),
        });
      }
    }

    const vsMonoRes = await Promise.all(vsMonoJobs.map((j) => j.promise));
    const vsMonoWins = new Map<PolycolorArchetypeId, { score: number; games: number }>();
    let globalPolyVsMonoScore = 0;
    let globalPolyVsMonoGames = 0;

    for (let i = 0; i < vsMonoJobs.length; i++) {
      const job = vsMonoJobs[i];
      const res = vsMonoRes[i];
      totalMatchesSimulated += res.matchesPlayed;
      globalPolyVsMonoScore += res.scoreASum;
      globalPolyVsMonoGames += res.matchesPlayed;
      const rec = vsMonoWins.get(job.polyId) ?? { score: 0, games: 0 };
      rec.score += res.scoreASum;
      rec.games += res.matchesPlayed;
      vsMonoWins.set(job.polyId, rec);
    }

    // 4D. Cross-Format Showdown 2: 13 Polycolor Tier V vs. 15 Bicolor Tier V
    console.log(
      '\n[Etapa 4D] Confronto Inter-Formatos #2: 13 Policromáticos Tier V vs. 15 Bicolores Tier V (780 duelos Beam Search)...'
    );
    const biIds = Object.keys(BICOLOR_ARCHETYPE_MASTERY) as BicolorArchetypeId[];
    const vsBiJobs: Array<{
      polyId: PolycolorArchetypeId;
      promise: Promise<WorkerPairBatchResponse>;
    }> = [];

    for (const arch of archetypes) {
      for (const bId of biIds) {
        const bi = BICOLOR_ARCHETYPE_MASTERY[bId];
        if (!bi) continue;
        vsBiJobs.push({
          polyId: arch.bp.id,
          promise: pool.runBatch({
            deckACardIds: masteryByArchetype[arch.bp.id].tierDecks[5].cardIds,
            deckBCardIds: bi.tierDecks[5].cardIds,
            nameA: arch.bp.name,
            nameB: bi.name,
            deckIdA: arch.bp.id,
            deckIdB: bi.archetypeId,
            domainA: arch.bp.domains[0],
            domainB: bi.domains[0],
            profileA: arch.profile,
            profileB: bi.learnedProfile,
            skillTierA: 5,
            skillTierB: 5,
            mlpA: finalPolyValueNetworks[arch.bp.id] ?? null,
            mlpB: BICOLOR_VALUE_NETWORKS[bi.archetypeId] ?? null,
            fastRollout: true,
            numMirrorPairs: 2,
            collectTelemetryA: false,
            collectTelemetryB: false,
            maxTrajectoriesPerSide: 0,
          }),
        });
      }
    }

    const vsBiRes = await Promise.all(vsBiJobs.map((j) => j.promise));
    const vsBiWins = new Map<PolycolorArchetypeId, { score: number; games: number }>();
    let globalPolyVsBiScore = 0;
    let globalPolyVsBiGames = 0;

    for (let i = 0; i < vsBiJobs.length; i++) {
      const job = vsBiJobs[i];
      const res = vsBiRes[i];
      totalMatchesSimulated += res.matchesPlayed;
      globalPolyVsBiScore += res.scoreASum;
      globalPolyVsBiGames += res.matchesPlayed;
      const rec = vsBiWins.get(job.polyId) ?? { score: 0, games: 0 };
      rec.score += res.scoreASum;
      rec.games += res.matchesPlayed;
      vsBiWins.set(job.polyId, rec);
    }

    for (const arch of archetypes) {
      const cRec = champWins.get(arch.bp.id);
      const mRec = vsMonoWins.get(arch.bp.id);
      const bRec = vsBiWins.get(arch.bp.id);
      const cWr = cRec && cRec.games > 0 ? Math.round((cRec.score / cRec.games) * 1000) / 1000 : 0.5;
      const mWr = mRec && mRec.games > 0 ? Math.round((mRec.score / mRec.games) * 1000) / 1000 : 0.5;
      const bWr = bRec && bRec.games > 0 ? Math.round((bRec.score / bRec.games) * 1000) / 1000 : 0.5;
      masteryByArchetype[arch.bp.id].championWinRate = cWr;
      masteryByArchetype[arch.bp.id].learnedProfile.trainedWinRate = cWr;
      masteryByArchetype[arch.bp.id].vsMonocolorWinRate = mWr;
      masteryByArchetype[arch.bp.id].vsBicolorWinRate = bWr;

      const splitStr = Object.entries(masteryByArchetype[arch.bp.id].domainCardBreakdown)
        .map(([d, n]) => `${d}:${n}`)
        .join('/');
      console.log(
        `   • [${arch.bp.id.padEnd(26, ' ')}] Poly WR: ${(cWr * 100).toFixed(1).padStart(5, ' ')}% | vs Mono: ${(mWr * 100).toFixed(1).padStart(5, ' ')}% | vs Bi: ${(bWr * 100).toFixed(1).padStart(5, ' ')}% | Split: ${splitStr}`
      );
    }

    const overallVsMonoWr =
      globalPolyVsMonoGames > 0
        ? Math.round((globalPolyVsMonoScore / globalPolyVsMonoGames) * 1000) / 1000
        : 0.5;
    const overallVsBiWr =
      globalPolyVsBiGames > 0
        ? Math.round((globalPolyVsBiScore / globalPolyVsBiGames) * 1000) / 1000
        : 0.5;
    console.log(
      `   ✓ Torneios 4B–4D concluídos em ${((Date.now() - champStart) / 1000).toFixed(1)}s | Global vs Mono T5: ${(overallVsMonoWr * 100).toFixed(1)}% | Global vs Bicolor T5: ${(overallVsBiWr * 100).toFixed(1)}%`
    );

    // 5. Adaptive Sequential Tier I -> Tier V Ladder Benchmark across the 3 Conclaves
    console.log(
      `\n[Etapa 5] Benchmark Sequencial Adaptativo da Escada Tier I -> Tier V nos 3 Conclaves (Alvo IC 95% <= ±${(TARGET_TIER_LADDER_CI95 * 100).toFixed(1)}%)...`
    );
    const conclaves: PolycolorConclaveId[] = [
      'cataclysm_triads',
      'imperial_triads',
      'pentachromatic_apex',
    ];
    const tiers: AiSkillTier[] = [1, 2, 3, 4, 5];

    const cellMatrix = {} as Record<
      PolycolorConclaveId,
      Record<AiSkillTier, Record<AiSkillTier, PairedStatAccumulator>>
    >;
    const tierRowAcc = {} as Record<PolycolorConclaveId, Record<AiSkillTier, PairedStatAccumulator>>;

    for (const cId of conclaves) {
      cellMatrix[cId] = {} as Record<AiSkillTier, Record<AiSkillTier, PairedStatAccumulator>>;
      tierRowAcc[cId] = {} as Record<AiSkillTier, PairedStatAccumulator>;
      for (const ta of tiers) {
        tierRowAcc[cId][ta] = new PairedStatAccumulator();
        cellMatrix[cId][ta] = {} as Record<AiSkillTier, PairedStatAccumulator>;
        for (const tb of tiers) {
          if (ta !== tb) cellMatrix[cId][ta][tb] = new PairedStatAccumulator();
        }
      }
    }

    const MAX_LADDER_WAVES = 14;
    let achievedMaxTierCi95 = 1;

    for (let lWave = 1; lWave <= MAX_LADDER_WAVES; lWave++) {
      const waveStart = Date.now();
      const ladderJobs: Array<{
        conclaveId: PolycolorConclaveId;
        tierA: AiSkillTier;
        tierB: AiSkillTier;
        promise: Promise<WorkerPairBatchResponse>;
      }> = [];

      for (const cId of conclaves) {
        const cArchs = archetypes.filter((a) => a.bp.conclaveId === cId);
        // Scale mirror pairs inversely with conclave size^2 so all 3 Conclaves converge at the same speed!
        const pairsPerDirectedArchMatch = cArchs.length <= 3 ? 2 : 1;

        for (let i = 0; i < tiers.length; i++) {
          for (let j = i + 1; j < tiers.length; j++) {
            const tA = tiers[i];
            const tB = tiers[j];
            const needMore =
              lWave === 1 ||
              tierRowAcc[cId][tA].ci95HalfWidth > TARGET_TIER_LADDER_CI95 ||
              tierRowAcc[cId][tB].ci95HalfWidth > TARGET_TIER_LADDER_CI95;

            if (!needMore) continue;

            for (const archA of cArchs) {
              for (const archB of cArchs) {
                const mA = masteryByArchetype[archA.bp.id];
                const mB = masteryByArchetype[archB.bp.id];
                ladderJobs.push({
                  conclaveId: cId,
                  tierA: tA,
                  tierB: tB,
                  promise: pool.runBatch({
                    deckACardIds: mA.tierDecks[tA].cardIds,
                    deckBCardIds: mB.tierDecks[tB].cardIds,
                    nameA: `${mA.name} [T${tA}]`,
                    nameB: `${mB.name} [T${tB}]`,
                    deckIdA: archA.bp.id,
                    deckIdB: archB.bp.id,
                    domainA: archA.bp.domains[0],
                    domainB: archB.bp.domains[0],
                    profileA: tA >= 2 ? mA.learnedProfile : undefined,
                    profileB: tB >= 2 ? mB.learnedProfile : undefined,
                    skillTierA: tA,
                    skillTierB: tB,
                    mlpA: tA >= 3 ? finalPolyValueNetworks[archA.bp.id] ?? null : null,
                    mlpB: tB >= 3 ? finalPolyValueNetworks[archB.bp.id] ?? null : null,
                    fastRollout: true,
                    numMirrorPairs: pairsPerDirectedArchMatch,
                    collectTelemetryA: false,
                    collectTelemetryB: false,
                    maxTrajectoriesPerSide: 0,
                  }),
                });
              }
            }
          }
        }
      }

      if (ladderJobs.length === 0) break;

      const lResults = await Promise.all(ladderJobs.map((j) => j.promise));
      let waveMatches = 0;
      for (let i = 0; i < ladderJobs.length; i++) {
        const job = ladderJobs[i];
        const res = lResults[i];
        totalMatchesSimulated += res.matchesPlayed;
        waveMatches += res.matchesPlayed;

        cellMatrix[job.conclaveId][job.tierA][job.tierB].addBatch(
          res.pairCount,
          res.pairMeanSum,
          res.pairMeanSumSq
        );
        tierRowAcc[job.conclaveId][job.tierA].addBatch(
          res.pairCount,
          res.pairMeanSum,
          res.pairMeanSumSq
        );

        const invSum = res.pairCount - res.pairMeanSum;
        const invSumSq = res.pairCount - 2 * res.pairMeanSum + res.pairMeanSumSq;
        cellMatrix[job.conclaveId][job.tierB][job.tierA].addBatch(res.pairCount, invSum, invSumSq);
        tierRowAcc[job.conclaveId][job.tierB].addBatch(res.pairCount, invSum, invSumSq);
      }

      achievedMaxTierCi95 = 0;
      for (const cId of conclaves) {
        for (const t of tiers) {
          const hw = tierRowAcc[cId][t].ci95HalfWidth;
          if (hw > achievedMaxTierCi95) achievedMaxTierCi95 = hw;
        }
      }

      console.log(
        `   • Onda Escada #${lWave}: +${waveMatches} duelos (${((Date.now() - waveStart) / 1000).toFixed(1)}s) | Maior Margem IC95% entre todos os Tiers: ±${(achievedMaxTierCi95 * 100).toFixed(2)}%`
      );

      if (achievedMaxTierCi95 <= TARGET_TIER_LADDER_CI95) {
        break;
      }
    }

    const ladderByConclave = {} as Record<PolycolorConclaveId, PolycolorConclaveLadderBenchmark>;
    for (const cId of conclaves) {
      const cArchs = archetypes.filter((a) => a.bp.conclaveId === cId);
      const tierOverallWinRates = {} as Record<AiSkillTier, number>;
      const tierCi95HalfWidths = {} as Record<AiSkillTier, number>;
      let maxCi = 0;
      let totalConclaveLadderGames = 0;

      for (const t of tiers) {
        const wr = Math.round(tierRowAcc[cId][t].mean * 1000) / 1000;
        const hw = Math.round(tierRowAcc[cId][t].ci95HalfWidth * 10000) / 10000;
        tierOverallWinRates[t] = wr;
        tierCi95HalfWidths[t] = hw;
        if (hw > maxCi) maxCi = hw;
        totalConclaveLadderGames += tierRowAcc[cId][t].totalMatches;

        for (const arch of cArchs) {
          masteryByArchetype[arch.bp.id].tierDecks[t].benchmarkWinRateVsLadder = wr;
        }
      }
      totalConclaveLadderGames = Math.round(totalConclaveLadderGames / 2);

      const adj = {
        tier2VsTier1: Math.round(cellMatrix[cId][2][1].mean * 1000) / 1000,
        tier3VsTier2: Math.round(cellMatrix[cId][3][2].mean * 1000) / 1000,
        tier4VsTier3: Math.round(cellMatrix[cId][4][3].mean * 1000) / 1000,
        tier5VsTier4: Math.round(cellMatrix[cId][5][4].mean * 1000) / 1000,
        tier5VsTier1: Math.round(cellMatrix[cId][5][1].mean * 1000) / 1000,
      };

      ladderByConclave[cId] = {
        conclaveId: cId,
        conclaveTitle: CONCLAVE_TITLES[cId],
        archetypeIds: cArchs.map((a) => a.bp.id),
        matchesPerCell: cellMatrix[cId][5][1].totalMatches,
        totalLadderMatches: totalConclaveLadderGames,
        tierOverallWinRates,
        tierCi95HalfWidths,
        maxTierCi95HalfWidth: maxCi,
        convergedByMargin: maxCi <= TARGET_TIER_LADDER_CI95,
        adjacentDominanceWinRates: adj,
      };

      console.log(
        `   [${cId.padEnd(20, ' ')}] (${totalConclaveLadderGames} jogos, IC95% <= ±${(maxCi * 100).toFixed(2)}%): T1=${(tierOverallWinRates[1] * 100).toFixed(1)}% | T2=${(tierOverallWinRates[2] * 100).toFixed(1)}% | T3=${(tierOverallWinRates[3] * 100).toFixed(1)}% | T4=${(tierOverallWinRates[4] * 100).toFixed(1)}% | T5=${(tierOverallWinRates[5] * 100).toFixed(1)}% | T5vT1=${(adj.tier5VsTier1 * 100).toFixed(1)}%`
      );
    }

    const elapsedSeconds = Math.round(((Date.now() - tStart) / 1000) * 10) / 10;
    const summary: PolycolorTrainingSummary = {
      generatedAt: new Date().toISOString(),
      totalMatchesSimulated,
      totalStateTrajectoriesTrained: totalStateSamples,
      elapsedSeconds,
      archetypesCount: archetypes.length,
      tricolorCount: 10,
      pentachromaticCount: 3,
      overallVsMonocolorTier5WinRate: overallVsMonoWr,
      overallVsBicolorTier5WinRate: overallVsBiWr,
      convergenceReport: {
        workerThreadsUsed: workerCount,
        targetTierCi95HalfWidth: TARGET_TIER_LADDER_CI95,
        achievedMaxTierCi95HalfWidth: Math.round(achievedMaxTierCi95 * 10000) / 10000,
        targetDeckJaccardStability: TARGET_DECK_JACCARD_STABILITY,
        achievedMeanDeckJaccardStability: Math.round(finalMeanJaccard * 1000) / 1000,
        achievedMaxMedianCardCi95HalfWidth: Math.round(finalMaxMedianCardCi95 * 10000) / 10000,
        minComboCoPlays: MIN_COMBO_COPLAYS,
        generationsExecuted,
        convergedEarly,
      },
      ladderByConclave,
    };

    // 6. Emit src/data/aiPolycolorMasteryData.ts
    const outPath = path.resolve(__dirname, '../data/aiPolycolorMasteryData.ts');
    const fileContent = `import { AiSkillTier, Domain } from '../types/game';
import type { DeckLearnedAiProfile, DiscoveredCardCombo } from './aiLearnedProfiles';
import type { CardShapleyMetric, TierDeckMetadata } from './aiMonocolorMasteryData';
import type { SerializedValueMlp } from '../engine/aiValueNetwork';

/**
 * GERADO AUTOMATICAMENTE POR src/scripts/trainPolycolorEvolution.ts (npm run train:polycolor)
 * Partidas Simuladas: ${totalMatchesSimulated.toLocaleString()} | Estados Treinados nas 13 Value MLPs: ${totalStateSamples.toLocaleString()} (${elapsedSeconds}s em ${workerCount} threads)
 * Margem de Erro Máxima IC 95% nos Tiers: ±${(achievedMaxTierCi95 * 100).toFixed(2)}%
 */

export type PolycolorArchetypeId =
  | 'tri_red_blue_purple'
  | 'tri_red_green_gold'
  | 'tri_blue_purple_gold'
  | 'tri_red_purple_green'
  | 'tri_blue_green_gold'
  | 'tri_blue_purple_green'
  | 'tri_red_purple_gold'
  | 'tri_purple_green_gold'
  | 'tri_red_blue_green'
  | 'tri_red_blue_gold'
  | 'penta_prismatic_crater'
  | 'penta_free_city_sovereign'
  | 'penta_wheel_convergence';

export type PolycolorConclaveId =
  | 'cataclysm_triads'
  | 'imperial_triads'
  | 'pentachromatic_apex';

export interface PolycolorArchetypeMastery {
  archetypeId: PolycolorArchetypeId;
  tierFormat: 'tricolor' | 'pentachromatic';
  domains: Domain[];
  conclaveId: PolycolorConclaveId;
  classicDeckIds: string[];
  name: string;
  subtitle: string;
  strategySummary: string;
  tacticalIdentity: 'aggro' | 'midrange' | 'control' | 'ramp' | 'tempo' | 'attrition';
  coverCardId: string;
  generationsEvolved: number;
  matchesSimulated: number;
  seedWinRate: number;
  championWinRate: number;
  vsMonocolorWinRate: number;
  vsBicolorWinRate: number;
  championDeckJaccardStability: number;
  medianCardCi95HalfWidth: number;
  domainCardBreakdown: Record<string, number>;
  crossDomainCombos: DiscoveredCardCombo[];
  learnedProfile: DeckLearnedAiProfile;
  topShapleyCards: CardShapleyMetric[];
  tierDecks: Record<AiSkillTier, TierDeckMetadata>;
}

export interface PolycolorConclaveLadderBenchmark {
  conclaveId: PolycolorConclaveId;
  conclaveTitle: string;
  archetypeIds: PolycolorArchetypeId[];
  matchesPerCell: number;
  totalLadderMatches: number;
  tierOverallWinRates: Record<AiSkillTier, number>;
  tierCi95HalfWidths: Record<AiSkillTier, number>;
  maxTierCi95HalfWidth: number;
  convergedByMargin: boolean;
  adjacentDominanceWinRates: {
    tier2VsTier1: number;
    tier3VsTier2: number;
    tier4VsTier3: number;
    tier5VsTier4: number;
    tier5VsTier1: number;
  };
}

export interface PolycolorTrainingSummary {
  generatedAt: string;
  totalMatchesSimulated: number;
  totalStateTrajectoriesTrained: number;
  elapsedSeconds: number;
  archetypesCount: number;
  tricolorCount: number;
  pentachromaticCount: number;
  overallVsMonocolorTier5WinRate: number;
  overallVsBicolorTier5WinRate: number;
  convergenceReport: {
    workerThreadsUsed: number;
    targetTierCi95HalfWidth: number;
    achievedMaxTierCi95HalfWidth: number;
    targetDeckJaccardStability: number;
    achievedMeanDeckJaccardStability: number;
    achievedMaxMedianCardCi95HalfWidth: number;
    minComboCoPlays: number;
    generationsExecuted: number;
    convergedEarly: boolean;
  };
  ladderByConclave: Record<PolycolorConclaveId, PolycolorConclaveLadderBenchmark>;
}

export const POLYCOLOR_TRAINING_SUMMARY: PolycolorTrainingSummary = ${JSON.stringify(summary, null, 2)};

export const POLYCOLOR_VALUE_NETWORKS: Partial<Record<PolycolorArchetypeId, SerializedValueMlp>> = ${JSON.stringify(
      finalPolyValueNetworks,
      null,
      2
    )};

export const POLYCOLOR_ARCHETYPE_MASTERY: Record<
  PolycolorArchetypeId,
  PolycolorArchetypeMastery
> = ${JSON.stringify(masteryByArchetype, null, 2)};
`;

    fs.writeFileSync(outPath, fileContent, 'utf-8');
    console.log('\n================================================================================');
    console.log(
      ` TREINAMENTO TRICOLOR & PENTACROMÁTICO CONCLUÍDO EM ${elapsedSeconds}s (${workerCount} Workers)!`
    );
    console.log(` • Duelos completos de 100 cartas simulados: ${totalMatchesSimulated.toLocaleString()}`);
    console.log(` • Estados treinados nas 13 Value MLPs: ${totalStateSamples.toLocaleString()}`);
    console.log(` • Maior Margem de Erro IC 95% nos Tiers: ±${(achievedMaxTierCi95 * 100).toFixed(2)}%`);
    console.log(` • Artefato salvo em: ${outPath}`);
    console.log('================================================================================\n');
  } finally {
    await pool.close();
  }
}

if (isMainThread) {
  main().catch((err) => {
    console.error('Erro fatal em trainPolycolorEvolution:', err);
    process.exit(1);
  });
}
