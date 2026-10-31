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
import {
  CardShapleyMetric,
  DOMAIN_VALUE_NETWORKS,
  MONOCOLOR_ARCHETYPE_MASTERY,
  MonocolorArchetypeId,
  TierDeckMetadata,
} from '../data/aiMonocolorMasteryData';
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
// BICOLOR ARCHETYPE IDS & OUTPUT DATA INTERFACES (aiBicolorMasteryData.ts)
// ============================================================================
export type BicolorArchetypeId =
  | 'dual_red_gold'
  | 'dual_blue_purple'
  | 'dual_red_green'
  | 'dual_blue_gold'
  | 'dual_purple_green'
  | 'dual_red_purple'
  | 'dual_blue_green'
  | 'dual_green_gold'
  | 'dual_purple_gold'
  | 'dual_red_blue'
  | 'dual_green_neutral'
  | 'dual_red_neutral'
  | 'dual_blue_neutral'
  | 'dual_purple_neutral'
  | 'dual_gold_neutral';

export type BicolorPactTriadId =
  | 'pyros_alliances'
  | 'veridia_alliances'
  | 'vortex_alliances'
  | 'eclipse_alliances'
  | 'solaria_alliances';

interface StabilizedBicolorArchetypeMastery {
  archetypeId: BicolorArchetypeId;
  domains: [Domain, Domain];
  isAxialAlliance: boolean;
  triadId: BicolorPactTriadId;
  classicDeckId?: string;
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
  championDeckJaccardStability: number;
  medianCardCi95HalfWidth: number;
  domainCardBreakdown: Record<string, number>;
  crossDomainCombos: DiscoveredCardCombo[];
  learnedProfile: DeckLearnedAiProfile;
  topShapleyCards: CardShapleyMetric[];
  tierDecks: Record<AiSkillTier, TierDeckMetadata>;
}

interface BicolorTriadLadderBenchmark {
  triadId: BicolorPactTriadId;
  triadTitle: string;
  archetypeIds: BicolorArchetypeId[];
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

interface BicolorTrainingSummary {
  generatedAt: string;
  totalMatchesSimulated: number;
  totalStateTrajectoriesTrained: number;
  elapsedSeconds: number;
  archetypesCount: number;
  overallVsMonocolorTier5WinRate: number;
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
  ladderByTriad: Record<BicolorPactTriadId, BicolorTriadLadderBenchmark>;
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
// 15 BICOLOR ARCHETYPE BLUEPRINTS (10 CHROMATIC DUAL PACTS + 5 AXIAL ALLIANCES)
// ============================================================================
interface BicolorBlueprint {
  id: BicolorArchetypeId;
  domains: [Domain, Domain];
  isAxialAlliance: boolean;
  triadId: BicolorPactTriadId;
  classicDeckId?: string;
  name: string;
  subtitle: string;
  strategySummary: string;
  tacticalIdentity: 'aggro' | 'midrange' | 'control' | 'ramp' | 'tempo' | 'attrition';
  targetAvgCost: number;
  minEarlyDrops: number;
  minCreatures: number;
  maxRelics: number;
  minDomainA: number;
  minDomainB: number;
  maxNeutralSupport: number;
  seedWeights: AiDecisionWeights;
}

const TRIAD_TITLES: Record<BicolorPactTriadId, string> = {
  pyros_alliances: 'Tríade de Pyros (Chama-Ordem, Chama-Abismo & Artilharia Axial)',
  veridia_alliances: 'Tríade de Veridia (Ruína Selvagem, Aurora Silvestre & Engenhos Axiais)',
  vortex_alliances: 'Tríade de Vórtex (Fogo Astral, Evolução Quimérica & Astrolábio Axial)',
  eclipse_alliances: 'Tríade de Eclipse (Tormenta Abissal, Podridão Eterna & Guilda Axial)',
  solaria_alliances: 'Tríade de Solária (Forja do Zênite, Inquisição Crepuscular & Bastião Axial)',
};

const BICOLOR_BLUEPRINTS: BicolorBlueprint[] = [
  // ======================== 10 CHROMATIC DUAL PACTS ========================
  {
    id: 'dual_red_gold',
    domains: ['red', 'gold'],
    isAxialAlliance: false,
    triadId: 'pyros_alliances',
    classicDeckId: 'deck_dual_draconic_pact',
    name: 'Pacto das Escamas Imperiais',
    subtitle: 'Pacto Duplo 🔥+☀️ • Dragões Solares & Escudo Divino',
    strategySummary:
      'Combina Guardiões e Escudo Divino de Solária com Fúria Crescente, Voo e Sopro Dracônico de Pyros para trocas invencíveis.',
    tacticalIdentity: 'midrange',
    targetAvgCost: 3.4,
    minEarlyDrops: 26,
    minCreatures: 62,
    maxRelics: 8,
    minDomainA: 32,
    minDomainB: 32,
    maxNeutralSupport: 10,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.15,
      flyingEvasionBias: 1.32,
      guardianPriority: 1.24,
      ascensionEagerness: 1.25,
      mulliganCurveTarget: 2.9,
    },
  },
  {
    id: 'dual_blue_purple',
    domains: ['blue', 'purple'],
    isAxialAlliance: false,
    triadId: 'eclipse_alliances',
    classicDeckId: 'deck_dual_abyssal_storm',
    name: 'Pacto da Tormenta Abissal',
    subtitle: 'Pacto Duplo ❄️+💀 • Estase Glacial & Execução Umbral',
    strategySummary:
      'Trava a Vanguarda rival com Congelamento e Alcance enquanto ceifadores de Toque Letal, remoções umbrais e compra arcana esmagam por atrito.',
    tacticalIdentity: 'control',
    targetAvgCost: 3.4,
    minEarlyDrops: 26,
    minCreatures: 54,
    maxRelics: 11,
    minDomainA: 32,
    minDomainB: 32,
    maxNeutralSupport: 10,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 0.94,
      tradeValueBias: 1.36,
      spellHoldPatience: 1.26,
      synergyHoldBonus: 24,
      mulliganCurveTarget: 3.0,
    },
  },
  {
    id: 'dual_red_green',
    domains: ['red', 'green'],
    isAxialAlliance: false,
    triadId: 'veridia_alliances',
    classicDeckId: 'deck_dual_primal_fury',
    name: 'Pacto da Ruína Selvagem',
    subtitle: 'Pacto Duplo 🔥+🌿 • Rampa Vulcânica, Ímpeto & Atropelar',
    strategySummary:
      'Acelera Essência com rampa silvestre para lançar Behemoths e Dragões com Ímpeto e Atropelar antes que a defesa inimiga se estabilize.',
    tacticalIdentity: 'ramp',
    targetAvgCost: 3.5,
    minEarlyDrops: 26,
    minCreatures: 66,
    maxRelics: 8,
    minDomainA: 32,
    minDomainB: 32,
    maxNeutralSupport: 10,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.24,
      tradeValueBias: 1.12,
      ascensionEagerness: 1.28,
      domainExpansionEagerness: 1.22,
      mulliganCurveTarget: 2.9,
    },
  },
  {
    id: 'dual_blue_gold',
    domains: ['blue', 'gold'],
    isAxialAlliance: false,
    triadId: 'solaria_alliances',
    classicDeckId: 'deck_dual_arcane_forge',
    name: 'Pacto da Forja do Zênite',
    subtitle: 'Pacto Duplo ❄️+☀️ • Cidadela Cronomante & Escudo Celeste',
    strategySummary:
      'Ergue muralhas de Armadura e Escudo Divino sustentadas por compra de cartas cronomante, Congelamento cirúrgico e arcontes aéreos.',
    tacticalIdentity: 'control',
    targetAvgCost: 3.4,
    minEarlyDrops: 26,
    minCreatures: 56,
    maxRelics: 12,
    minDomainA: 32,
    minDomainB: 32,
    maxNeutralSupport: 10,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 0.96,
      tradeValueBias: 1.32,
      guardianPriority: 1.34,
      relicPriority: 1.18,
      spellHoldPatience: 1.22,
      mulliganCurveTarget: 3.0,
    },
  },
  {
    id: 'dual_purple_green',
    domains: ['purple', 'green'],
    isAxialAlliance: false,
    triadId: 'eclipse_alliances',
    classicDeckId: 'deck_dual_eternal_rot',
    name: 'Pacto da Podridão Eterna',
    subtitle: 'Pacto Duplo 💀+🌿 • Cripta, Regeneração & Veneno',
    strategySummary:
      'Funde Renascer e reanimação da Cripta com Guardiões regenerativos e Toque Letal em um ciclo inesgotável de vida e decomposição.',
    tacticalIdentity: 'attrition',
    targetAvgCost: 3.3,
    minEarlyDrops: 28,
    minCreatures: 64,
    maxRelics: 9,
    minDomainA: 32,
    minDomainB: 32,
    maxNeutralSupport: 10,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.04,
      tradeValueBias: 1.30,
      guardianPriority: 1.28,
      synergyHoldBonus: 24,
      mulliganCurveTarget: 2.9,
    },
  },
  {
    id: 'dual_red_purple',
    domains: ['red', 'purple'],
    isAxialAlliance: false,
    triadId: 'pyros_alliances',
    classicDeckId: 'deck_dual_blood_flame',
    name: 'Pacto da Chama Sangrenta',
    subtitle: 'Pacto Duplo 🔥+💀 • Blitz Sanguinária, Dreno & Último Suspiro',
    strategySummary:
      'Pressiona incessantemente o Soberano rival com Ímpeto, Dreno de Vida, gatilhos explosivos de Último Suspiro e queima direta.',
    tacticalIdentity: 'aggro',
    targetAvgCost: 2.8,
    minEarlyDrops: 34,
    minCreatures: 60,
    maxRelics: 8,
    minDomainA: 32,
    minDomainB: 32,
    maxNeutralSupport: 10,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.34,
      tradeValueBias: 1.06,
      bloodPactThresholdHp: 17,
      sovPowerTempoBias: 1.22,
      mulliganCurveTarget: 2.5,
    },
  },
  {
    id: 'dual_blue_green',
    domains: ['blue', 'green'],
    isAxialAlliance: false,
    triadId: 'vortex_alliances',
    classicDeckId: 'deck_dual_wild_evolution',
    name: 'Pacto da Evolução Quimérica',
    subtitle: 'Pacto Duplo ❄️+🌿 • Rampa Arcana, Compra & Leviatãs',
    strategySummary:
      'Une aceleração de Essência silvestre e compra de cartas glacial para evoluir quimeras, congelar bloqueadores e dominar com Titãs e Leviatãs.',
    tacticalIdentity: 'ramp',
    targetAvgCost: 3.5,
    minEarlyDrops: 26,
    minCreatures: 60,
    maxRelics: 9,
    minDomainA: 32,
    minDomainB: 32,
    maxNeutralSupport: 10,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.08,
      tradeValueBias: 1.24,
      ascensionEagerness: 1.30,
      flyingEvasionBias: 1.22,
      mulliganCurveTarget: 3.0,
    },
  },
  {
    id: 'dual_green_gold',
    domains: ['green', 'gold'],
    isAxialAlliance: false,
    triadId: 'veridia_alliances',
    classicDeckId: 'deck_dual_solar_wild',
    name: 'Pacto da Aurora Silvestre',
    subtitle: 'Pacto Duplo 🌿+☀️ • Falange dos Mil Escudos & Hinos Globais',
    strategySummary:
      'Multiplica aliados protegidos por Guardião, Regeneração e Escudo Divino em massa, esmagando em frente ampla com bônus globais +ATQ/+VIDA.',
    tacticalIdentity: 'midrange',
    targetAvgCost: 3.2,
    minEarlyDrops: 28,
    minCreatures: 66,
    maxRelics: 9,
    minDomainA: 32,
    minDomainB: 32,
    maxNeutralSupport: 10,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.12,
      tradeValueBias: 1.24,
      guardianPriority: 1.38,
      stackConsolidationBias: 1.22,
      mulliganCurveTarget: 2.8,
    },
  },
  {
    id: 'dual_purple_gold',
    domains: ['purple', 'gold'],
    isAxialAlliance: false,
    triadId: 'solaria_alliances',
    classicDeckId: 'deck_dual_iron_inquisition',
    name: 'Pacto da Inquisição Crepuscular',
    subtitle: 'Pacto Duplo 💀+☀️ • Dreno Solar, Renascer & Veredito',
    strategySummary:
      'Combina campeões imortais com Renascer, Escudo Divino e Dreno de Vida ao lado de destruição inquisitorial e Relíquias consagradas.',
    tacticalIdentity: 'attrition',
    targetAvgCost: 3.3,
    minEarlyDrops: 27,
    minCreatures: 58,
    maxRelics: 12,
    minDomainA: 32,
    minDomainB: 32,
    maxNeutralSupport: 10,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.00,
      tradeValueBias: 1.34,
      guardianPriority: 1.28,
      relicPriority: 1.18,
      mulliganCurveTarget: 2.9,
    },
  },
  {
    id: 'dual_red_blue',
    domains: ['red', 'blue'],
    isAxialAlliance: false,
    triadId: 'vortex_alliances',
    classicDeckId: 'deck_dual_storm_dragon',
    name: 'Pacto do Fogo Astral',
    subtitle: 'Pacto Duplo 🔥+❄️ • Artilharia Arcana, Voo & Tempestade',
    strategySummary:
      'Alinha feitiços piroclásticos, compra rúnica e Congelamento para abrir os céus para Dragões e Fênix de Voo e Alcance.',
    tacticalIdentity: 'tempo',
    targetAvgCost: 3.2,
    minEarlyDrops: 28,
    minCreatures: 54,
    maxRelics: 10,
    minDomainA: 32,
    minDomainB: 32,
    maxNeutralSupport: 10,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.18,
      flyingEvasionBias: 1.34,
      spellHoldPatience: 1.16,
      sovPowerTempoBias: 1.22,
      mulliganCurveTarget: 2.8,
    },
  },

  // ======================== 5 CHROMATIC-AXIAL ALLIANCES ========================
  {
    id: 'dual_green_neutral',
    domains: ['green', 'neutral'],
    isAxialAlliance: true,
    triadId: 'veridia_alliances',
    name: 'Aliança dos Engenhos Silvestres',
    subtitle: 'Aliança 🌿+⚙️ • Colossos de Madeira-Ferro & Guildas Axiais',
    strategySummary:
      'Une a rampa e os Titãs de Veridia aos Constructos blindados e campeões da Cidade Franca em uma frente pesada de Atropelar e Armadura.',
    tacticalIdentity: 'midrange',
    targetAvgCost: 3.5,
    minEarlyDrops: 27,
    minCreatures: 68,
    maxRelics: 8,
    minDomainA: 34,
    minDomainB: 34,
    maxNeutralSupport: 0,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.14,
      tradeValueBias: 1.22,
      guardianPriority: 1.24,
      domainExpansionEagerness: 1.25,
      mulliganCurveTarget: 2.9,
    },
  },
  {
    id: 'dual_red_neutral',
    domains: ['red', 'neutral'],
    isAxialAlliance: true,
    triadId: 'pyros_alliances',
    name: 'Aliança da Artilharia de Mercúrio',
    subtitle: 'Aliança 🔥+⚙️ • Tropas de Choque & Assassinos Relojoeiros',
    strategySummary:
      'Funde a velocidade vulcânica de Pyros com mercenários de Ímpeto/Toque Letal e autômatos de cerco da Cidade Franca.',
    tacticalIdentity: 'aggro',
    targetAvgCost: 2.9,
    minEarlyDrops: 32,
    minCreatures: 66,
    maxRelics: 8,
    minDomainA: 34,
    minDomainB: 34,
    maxNeutralSupport: 0,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.32,
      tradeValueBias: 1.08,
      flyingEvasionBias: 1.22,
      sovPowerTempoBias: 1.24,
      mulliganCurveTarget: 2.6,
    },
  },
  {
    id: 'dual_blue_neutral',
    domains: ['blue', 'neutral'],
    isAxialAlliance: true,
    triadId: 'vortex_alliances',
    name: 'Aliança do Astrolábio Arcano',
    subtitle: 'Aliança ❄️+⚙️ • Controle Horológico, Alcance & Voo',
    strategySummary:
      'Coordena Congelamento glacial e compra de cartas com artilharia de Alcance e Constructos de Escudo Divino da Matriz Axial.',
    tacticalIdentity: 'tempo',
    targetAvgCost: 3.3,
    minEarlyDrops: 28,
    minCreatures: 60,
    maxRelics: 10,
    minDomainA: 34,
    minDomainB: 34,
    maxNeutralSupport: 0,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.05,
      tradeValueBias: 1.28,
      flyingEvasionBias: 1.28,
      spellHoldPatience: 1.18,
      mulliganCurveTarget: 2.9,
    },
  },
  {
    id: 'dual_purple_neutral',
    domains: ['purple', 'neutral'],
    isAxialAlliance: true,
    triadId: 'eclipse_alliances',
    name: 'Aliança da Guilda das Máscaras',
    subtitle: 'Aliança 💀+⚙️ • Lâminas Letais, Dreno & Submundo Axial',
    strategySummary:
      'Opera assassinos furtivos da Cidade Franca ao lado de lordes necróticos de Eclipse com Toque Letal, Dreno de Vida e reanimação.',
    tacticalIdentity: 'midrange',
    targetAvgCost: 3.2,
    minEarlyDrops: 29,
    minCreatures: 62,
    maxRelics: 10,
    minDomainA: 34,
    minDomainB: 34,
    maxNeutralSupport: 0,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.12,
      tradeValueBias: 1.28,
      bloodPactThresholdHp: 19,
      synergyHoldBonus: 22,
      mulliganCurveTarget: 2.8,
    },
  },
  {
    id: 'dual_gold_neutral',
    domains: ['gold', 'neutral'],
    isAxialAlliance: true,
    triadId: 'solaria_alliances',
    name: 'Aliança do Bastião Relojoeiro',
    subtitle: 'Aliança ☀️+⚙️ • Falange de Ferro Meteórico & Escudo Real',
    strategySummary:
      'Alinha Guardiões Imperiais de Solária e Golens Relojoeiros com Armadura pesada, Escudo Divino global e contra-ataques disciplinados.',
    tacticalIdentity: 'midrange',
    targetAvgCost: 3.3,
    minEarlyDrops: 28,
    minCreatures: 64,
    maxRelics: 10,
    minDomainA: 34,
    minDomainB: 34,
    maxNeutralSupport: 0,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.04,
      tradeValueBias: 1.28,
      guardianPriority: 1.38,
      relicPriority: 1.14,
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

// Empirical Shapley priors harvested from Phase 1 Monocolor Mastery!
const MONOCOLOR_SHAPLEY_PRIOR = new Map<string, number>();
for (const m of Object.values(MONOCOLOR_ARCHETYPE_MASTERY)) {
  if (!m) continue;
  for (const sc of m.topShapleyCards) {
    const prev = MONOCOLOR_SHAPLEY_PRIOR.get(sc.cardId) ?? -99;
    if (sc.shapleyValue > prev) {
      MONOCOLOR_SHAPLEY_PRIOR.set(sc.cardId, sc.shapleyValue);
    }
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

  // Smooth Dual-Pact affinity curve: low affinityReq cards cast cleanly on 1+1 starting split!
  if (card.cost <= 3 && card.affinityReq <= 1) q += 0.9;
  else if (card.cost <= 3 && card.affinityReq >= 3) q -= 1.2;

  const monoPrior = MONOCOLOR_SHAPLEY_PRIOR.get(card.id);
  if (monoPrior !== undefined) {
    q += clamp(monoPrior * 22, -1.5, 3.8);
  }

  return q;
}

function computeBicolorSynergyAffinity(card: CardDefinition, bp: BicolorBlueprint): number {
  const kw = new Set(card.keywords);
  const effs = new Set(card.effects.map((e) => e.type));
  let s = -Math.abs(card.cost - bp.targetAvgCost) * 0.65;

  // Slight preference for main Pact colors over 3rd-wheel Neutral cards unless Neutral has high utility
  if (!bp.isAxialAlliance && card.domain === 'neutral') {
    s -= 1.2;
    if (effs.has('draw_cards') || effs.has('buff_all_allies') || effs.has('shield_all_allies')) {
      s += 2.4;
    }
  }

  switch (bp.id) {
    case 'dual_red_gold':
      if (kw.has('Voo') || (card.breathDamage ?? 0) > 0) s += 5.2;
      if (kw.has('Escudo Divino') || kw.has('Guardião') || card.armor >= 1) s += 4.6;
      if (kw.has('Fúria Crescente') || card.ascension) s += 4.2;
      break;
    case 'dual_blue_purple':
      if (effs.has('freeze_enemy') || effs.has('freeze_enemy_vanguard')) s += 6.2;
      if (kw.has('Toque Letal') || effs.has('destroy_enemy') || effs.has('draw_cards')) s += 5.8;
      if (kw.has('Alcance') || kw.has('Renascer')) s += 3.6;
      break;
    case 'dual_red_green':
      if (effs.has('grant_bonus_essence')) s += 6.8;
      if (kw.has('Atropelar') || kw.has('Ímpeto') || (card.breathDamage ?? 0) > 0) s += 5.4;
      if (card.type === 'creature' && card.cost >= 5) s += 3.2;
      break;
    case 'dual_blue_gold':
      if (kw.has('Guardião') || kw.has('Escudo Divino')) s += 5.6;
      if (effs.has('draw_cards') || effs.has('freeze_enemy') || effs.has('shield_all_allies')) s += 5.8;
      if (kw.has('Voo') || kw.has('Alcance')) s += 3.5;
      break;
    case 'dual_purple_green':
      if (kw.has('Renascer') || effs.has('revive_from_crypt') || (card.regeneration ?? 0) > 0) s += 6.2;
      if (kw.has('Guardião') || kw.has('Toque Letal')) s += 5.0;
      if (card.effects.some((e) => e.trigger === 'on_death') || effs.has('summon_token')) s += 4.0;
      break;
    case 'dual_red_purple':
      if (card.type === 'creature' && card.cost <= 3) s += 4.6;
      if (kw.has('Ímpeto') || kw.has('Dreno de Vida') || kw.has('Toque Letal')) s += 5.8;
      if (effs.has('damage_enemy_sovereign') || card.effects.some((e) => e.trigger === 'on_death')) s += 4.8;
      if (card.cost >= 6) s -= 3.2;
      break;
    case 'dual_blue_green':
      if (effs.has('grant_bonus_essence') || effs.has('draw_cards')) s += 6.5;
      if (card.ascension || kw.has('Atropelar') || kw.has('Voo')) s += 4.8;
      if (effs.has('freeze_enemy') || effs.has('bounce_enemy')) s += 3.6;
      break;
    case 'dual_green_gold':
      if (kw.has('Guardião') || kw.has('Escudo Divino')) s += 5.8;
      if (effs.has('buff_all_allies') || effs.has('shield_all_allies') || effs.has('summon_token')) s += 6.4;
      if ((card.regeneration ?? 0) > 0 || card.armor >= 1) s += 3.6;
      break;
    case 'dual_purple_gold':
      if (kw.has('Dreno de Vida') || kw.has('Escudo Divino') || kw.has('Renascer')) s += 5.8;
      if (effs.has('destroy_enemy') || effs.has('shield_all_allies') || effs.has('heal_all_allies')) s += 5.4;
      if (kw.has('Guardião')) s += 3.8;
      break;
    case 'dual_red_blue':
      if (card.type === 'spell' || card.type === 'reaction') s += 4.2;
      if (card.effects.some((e) => e.trigger === 'spell_cast') || effs.has('draw_cards')) s += 6.0;
      if (
        kw.has('Voo') ||
        effs.has('freeze_enemy') ||
        effs.has('damage_enemy_row') ||
        effs.has('damage_single_enemy')
      ) {
        s += 5.0;
      }
      break;
    case 'dual_green_neutral':
      if (kw.has('Atropelar') || kw.has('Guardião') || card.armor >= 1) s += 5.2;
      if (effs.has('grant_bonus_essence') || effs.has('buff_all_allies')) s += 5.5;
      if (card.type === 'creature' && card.rarity === 'legendary' && card.atk >= 6) s += 3.8;
      break;
    case 'dual_red_neutral':
      if (card.type === 'creature' && card.cost <= 3) s += 4.5;
      if (kw.has('Ímpeto') || kw.has('Toque Letal') || kw.has('Voo')) s += 5.8;
      if (effs.has('damage_enemy_sovereign') || effs.has('damage_single_enemy')) s += 4.2;
      if (card.cost >= 6) s -= 2.8;
      break;
    case 'dual_blue_neutral':
      if (kw.has('Alcance') || kw.has('Voo') || kw.has('Escudo Divino')) s += 5.4;
      if (effs.has('freeze_enemy') || effs.has('draw_cards') || effs.has('bounce_enemy')) s += 5.8;
      break;
    case 'dual_purple_neutral':
      if (kw.has('Toque Letal') || kw.has('Dreno de Vida') || kw.has('Renascer')) s += 5.8;
      if (effs.has('destroy_enemy') || effs.has('revive_from_crypt') || effs.has('draw_cards')) s += 5.0;
      break;
    case 'dual_gold_neutral':
      if (kw.has('Guardião') || kw.has('Escudo Divino') || card.armor >= 1) s += 5.8;
      if (effs.has('shield_all_allies') || effs.has('buff_all_allies') || effs.has('buff_target_ally')) s += 5.2;
      break;
  }

  if (effs.has('break_domain_expansion')) s += 5.5;
  return s;
}

function getEligiblePoolForBlueprint(bp: BicolorBlueprint): CardDefinition[] {
  const [domA, domB] = bp.domains;
  return ALL_CARDS.filter(
    (c) =>
      c.domain === domA ||
      c.domain === domB ||
      (!bp.isAxialAlliance && bp.maxNeutralSupport > 0 && c.domain === 'neutral')
  );
}

function assertValid100BicolorDeck(
  cardIds: string[],
  bp: BicolorBlueprint,
  maxAllowedLegendaries = MAX_LEGENDARIES_PER_DECK,
  label = '',
  enforceRelicAndDomainSplit = true
): void {
  if (cardIds.length !== REQUIRED_DECK_SIZE) {
    throw new Error(`[${label}] Expected ${REQUIRED_DECK_SIZE} cards, got ${cardIds.length}`);
  }
  const [domA, domB] = bp.domains;
  const counts = new Map<string, number>();
  let legCount = 0;
  let relicCount = 0;
  let countA = 0;
  let countB = 0;
  let countNeutralThird = 0;

  for (const id of cardIds) {
    const c = CARDS_BY_ID[id];
    if (!c) throw new Error(`[${label}] Unknown card ID: ${id}`);
    if (c.domain === domA) {
      countA += 1;
    } else if (c.domain === domB) {
      countB += 1;
    } else if (!bp.isAxialAlliance && c.domain === 'neutral') {
      countNeutralThird += 1;
    } else {
      throw new Error(
        `[${label}] Illegal domain card ${id} (${c.domain}) for pact ${domA}+${domB}`
      );
    }

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
    if (countA < bp.minDomainA || countB < bp.minDomainB) {
      throw new Error(
        `[${label}] Bicolor split violated: ${domA}=${countA} (min ${bp.minDomainA}), ${domB}=${countB} (min ${bp.minDomainB})`
      );
    }
    if (!bp.isAxialAlliance && countNeutralThird > bp.maxNeutralSupport) {
      throw new Error(
        `[${label}] Neutral support cap exceeded: ${countNeutralThird} > ${bp.maxNeutralSupport}`
      );
    }
  }
}

interface DeckSlotTracker {
  bp: BicolorBlueprint;
  deck: string[];
  counts: Map<string, number>;
  legCount: number;
  rareCount: number;
  creatureCount: number;
  relicCount: number;
  earlyDropCount: number;
  countA: number;
  countB: number;
  countNeutralThird: number;
  maxLeg: number;
  maxRare: number;
  maxRelics: number;
}

function createSlotTracker(
  bp: BicolorBlueprint,
  maxLeg = MAX_LEGENDARIES_PER_DECK,
  maxRare = 999,
  maxRelics = bp.maxRelics
): DeckSlotTracker {
  return {
    bp,
    deck: [],
    counts: new Map(),
    legCount: 0,
    rareCount: 0,
    creatureCount: 0,
    relicCount: 0,
    earlyDropCount: 0,
    countA: 0,
    countB: 0,
    countNeutralThird: 0,
    maxLeg,
    maxRare,
    maxRelics,
  };
}

function canTrackerAcceptCard(t: DeckSlotTracker, c: CardDefinition): boolean {
  if (t.deck.length >= REQUIRED_DECK_SIZE) return false;
  const curCopies = t.counts.get(c.id) ?? 0;
  if (curCopies >= MAX_COPIES_BY_RARITY[c.rarity]) return false;
  if (c.rarity === 'legendary' && t.legCount >= t.maxLeg) return false;
  if (c.rarity === 'rare' && t.rareCount >= t.maxRare) return false;
  if (c.type === 'relic' && t.relicCount >= t.maxRelics) return false;

  const [domA, domB] = t.bp.domains;
  const rem = REQUIRED_DECK_SIZE - t.deck.length;
  const defA = Math.max(0, t.bp.minDomainA - t.countA);
  const defB = Math.max(0, t.bp.minDomainB - t.countB);
  const defCreat = Math.max(0, t.bp.minCreatures - t.creatureCount);

  if (c.type !== 'creature' && rem <= defCreat) return false;

  if (c.domain === domA) {
    if (rem <= defB) return false;
  } else if (c.domain === domB) {
    if (rem <= defA) return false;
  } else if (!t.bp.isAxialAlliance && c.domain === 'neutral') {
    if (t.countNeutralThird >= t.bp.maxNeutralSupport) return false;
    if (rem <= defA + defB) return false;
  } else {
    return false;
  }

  // Prevent corner deadlock when remaining slots equal BOTH a domain deficit and creature deficit
  if (rem <= defA + defB && rem <= defCreat && c.type !== 'creature') {
    return false;
  }

  return true;
}

function pushCardIntoTracker(t: DeckSlotTracker, c: CardDefinition): void {
  const [domA, domB] = t.bp.domains;
  t.deck.push(c.id);
  t.counts.set(c.id, (t.counts.get(c.id) ?? 0) + 1);
  if (c.rarity === 'legendary') t.legCount += 1;
  if (c.rarity === 'rare') t.rareCount += 1;
  if (c.type === 'creature') t.creatureCount += 1;
  if (c.type === 'relic') t.relicCount += 1;
  if (c.cost <= 2 && (c.type === 'creature' || c.type === 'relic')) t.earlyDropCount += 1;
  if (c.domain === domA) t.countA += 1;
  else if (c.domain === domB) t.countB += 1;
  else t.countNeutralThird += 1;
}

function buildSeed100BicolorDeck(bp: BicolorBlueprint, pool: CardDefinition[]): string[] {
  const scored = pool
    .map((card) => ({
      card,
      totalScore: computeIntrinsicCardQuality(card) + computeBicolorSynergyAffinity(card, bp),
    }))
    .sort((a, b) => b.totalScore - a.totalScore);

  const t = createSlotTracker(bp);
  const [domA, domB] = bp.domains;

  const tryAddCopies = (c: CardDefinition, wanted: number) => {
    const cap = Math.min(MAX_COPIES_BY_RARITY[c.rarity], wanted);
    while ((t.counts.get(c.id) ?? 0) < cap && canTrackerAcceptCard(t, c)) {
      pushCardIntoTracker(t, c);
    }
  };

  // 1. Seed balanced early drops across BOTH primary domains (cost <= 2, affinityReq <= 2)
  for (const item of scored) {
    if (t.earlyDropCount >= bp.minEarlyDrops) break;
    const c = item.card;
    if (c.cost <= 2 && (c.type === 'creature' || c.type === 'relic')) {
      if (c.domain === domA && t.countA > t.countB + 8) continue;
      if (c.domain === domB && t.countB > t.countA + 8) continue;
      tryAddCopies(c, MAX_COPIES_BY_RARITY[c.rarity]);
    }
  }

  // 2. Ensure core minimum domain representation & creatures from both pillars (up to 4 Legendary slots per pillar first)
  for (const targetDom of [domA, domB]) {
    const minTarget = targetDom === domA ? bp.minDomainA : bp.minDomainB;
    let domLegAdded = 0;
    for (const item of scored) {
      const curDomCount = targetDom === domA ? t.countA : t.countB;
      if (curDomCount >= minTarget) break;
      if (item.card.domain !== targetDom) continue;
      if (item.card.rarity === 'legendary' && domLegAdded >= 5) continue;
      const beforeLeg = t.legCount;
      tryAddCopies(item.card, MAX_COPIES_BY_RARITY[item.card.rarity]);
      if (t.legCount > beforeLeg) domLegAdded += t.legCount - beforeLeg;
    }
  }

  // 3. Ensure creature floor
  for (const item of scored) {
    if (t.creatureCount >= bp.minCreatures) break;
    if (item.card.type === 'creature') {
      tryAddCopies(item.card, MAX_COPIES_BY_RARITY[item.card.rarity]);
    }
  }

  // 4. Fill remaining flexible slots by overall synergy + quality score
  for (const item of scored) {
    if (t.deck.length >= REQUIRED_DECK_SIZE) break;
    tryAddCopies(item.card, MAX_COPIES_BY_RARITY[item.card.rarity]);
  }

  assertValid100BicolorDeck(t.deck, bp, MAX_LEGENDARIES_PER_DECK, `seed:${bp.id}`, true);
  return t.deck;
}

interface BicolorEvoState {
  bp: BicolorBlueprint;
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
  jaccardStability: number;
  medianChampionCardCi95: number;
}

function buildExploration100BicolorDeck(
  arch: BicolorEvoState,
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
    if (t.deck.length >= 46) break;
    tryAdd(tc, MAX_COPIES_BY_RARITY[tc.rarity]);
  }

  for (const id of arch.cardIds) {
    if (t.earlyDropCount >= 26 || t.deck.length >= 80) break;
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

  assertValid100BicolorDeck(t.deck, arch.bp, MAX_LEGENDARIES_PER_DECK, `explore:${arch.bp.id}`, false);
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
  arch: BicolorEvoState,
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

function unpackIntoPactTrajectories(
  sink: Map<BicolorArchetypeId, ValueTrainingSample[]>,
  archId: BicolorArchetypeId,
  packed: PackedTrajectoryBatch | undefined,
  capPerPact: number
): void {
  if (!packed || packed.count === 0) return;
  const arr = sink.get(archId);
  if (!arr || arr.length >= capPerPact) return;
  const limit = Math.min(packed.count, capPerPact - arr.length);
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

function synthesizeBicolorProfileAndShapley(
  arch: BicolorEvoState,
  gen: number,
  minComboCoPlays = 28
): {
  profile: DeckLearnedAiProfile;
  shapleyRanking: CardShapleyMetric[];
  crossDomainCombos: DiscoveredCardCombo[];
  medianDeckCardCi95: number;
} {
  const baseWr = arch.totalGames > 0 ? arch.totalWinsScore / arch.totalGames : 0.5;
  const kShrink = 12;

  const bestPairLiftForCard = new Map<string, number>();
  const discoveredCombos: Array<DiscoveredCardCombo & { liftLcb95: number; isCrossDomain: boolean }> = [];

  for (const pair of arch.pairStats.values()) {
    if (pair.coPlayGames < 14) continue;
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
    const conservativePairLift = Math.max(0, rawPairLift - 0.85 * pairSe) * (isCrossDomain ? 1.15 : 1.0);

    if (conservativePairLift > (bestPairLiftForCard.get(pair.cardA) ?? 0)) {
      bestPairLiftForCard.set(pair.cardA, conservativePairLift);
    }
    if (conservativePairLift > (bestPairLiftForCard.get(pair.cardB) ?? 0)) {
      bestPairLiftForCard.set(pair.cardB, conservativePairLift);
    }

    const liftOverBase = pairWr - baseWr;
    const liftLcb95 = liftOverBase - 1.645 * pairSe;

    if (nPair >= minComboCoPlays && liftLcb95 >= 0.012 && rawPairLift >= 0.012) {
      discoveredCombos.push({
        cardAId: pair.cardA,
        cardBId: pair.cardB,
        coPlayWinRate: Math.round(pairWr * 1000) / 1000,
        liftOverBaseline: Math.round(liftOverBase * 1000) / 1000,
        liftLcb95: liftLcb95 + (isCrossDomain ? 0.015 : 0),
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

    if (playedGames >= 18 && shapleyLcb >= 0.015) {
      highImpactCardBoosts[card.id] = Math.round(clamp(shapley * 180, 4, 24) * 10) / 10;
      if (card.rarity === 'legendary' || shapleyLcb >= 0.035) {
        channelAvoidIds.push(card.id);
      }
    }

    if (st && st.keptMulliganGames >= 14 && card.cost <= 3) {
      const keptWr = (st.keptMulliganScoreSum + 8 * baseWr) / (st.keptMulliganGames + 8);
      const keptSe = Math.sqrt((keptWr * (1 - keptWr)) / (st.keptMulliganGames + 9));
      if (keptWr - 0.8 * keptSe >= baseWr + 0.008) {
        mulliganKeepCandidates.push({ id: card.id, score: keptWr - 0.5 * keptSe });
      }
    }

    if (st && st.channeledEarlyGames >= 10 && card.rarity !== 'legendary') {
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

function proposeChallengerBicolorDeckAndWeights(
  arch: BicolorEvoState,
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
    const sa = (lcbById.get(a) ?? -0.03) + computeBicolorSynergyAffinity(ca, arch.bp) * 0.007;
    const sb = (lcbById.get(b) ?? -0.03) + computeBicolorSynergyAffinity(cb, arch.bp) * 0.007;
    return sa - sb;
  });

  const slotsToSwap = gen <= 6 ? 4 : gen <= 11 ? 3 : 2;
  const keptIds = arch.cardIds.slice();
  let removed = 0;

  for (const weakId of uniqueInDeck) {
    if (removed >= slotsToSwap) break;
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
    pushCardIntoTracker(tracker, c);
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
        (computeIntrinsicCardQuality(card) + computeBicolorSynergyAffinity(card, arch.bp)) * 0.011;
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

  assertValid100BicolorDeck(
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

function distillGraduatedBicolorTierDecks(
  arch: BicolorEvoState,
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
          computeBicolorSynergyAffinity(a, arch.bp) +
          computeIntrinsicCardQuality(a) * (tier >= 3 ? 0.8 : 0.35) +
          (shapleyMap.get(a.id) ?? 0) * 15;
        const sb =
          computeBicolorSynergyAffinity(b, arch.bp) +
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

    assertValid100BicolorDeck(
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

// ============================================================================
// MAIN PARALLELIZED BICOLOR CO-EVOLUTION PIPELINE
// ============================================================================
async function main() {
  const tStart = Date.now();
  const rng = createRng(20261101);
  const workerCount = Math.max(2, Math.min(10, os.cpus().length - 2));

  const MIN_GENERATIONS = 10;
  const MAX_GENERATIONS = 14;
  const TARGET_DECK_JACCARD_STABILITY = 0.975;
  const TARGET_CARD_MEDIAN_CI95 = 0.050;
  const TARGET_TIER_LADDER_CI95 = 0.030;
  const MIN_COMBO_COPLAYS = 28;
  const TRAJECTORY_CAP_PER_PACT = 15000;

  console.log('================================================================================');
  console.log(' CHROMATIC PACT — FASE 2: CO-EVOLUÇÃO PARALELA DOS 15 GRIMÓRIOS BICOLORES');
  console.log(` • Pool Paralelo: ${workerCount} Worker Threads (${os.cpus().length} CPUs lógicas)`);
  console.log(
    ' • Topologia: 10 Pactos Duplos Cromáticos + 5 Alianças Cromático-Axiais (Tiers I–V)'
  );
  console.log(
    ` • Critérios IC 95%: Escada Tier <= ±${(TARGET_TIER_LADDER_CI95 * 100).toFixed(1)}% | Jaccard >= ${(TARGET_DECK_JACCARD_STABILITY * 100).toFixed(1)}%`
  );
  console.log('================================================================================');

  const pool = new SimulationWorkerPool(workerCount);

  try {
    // 1. Seed all 15 Bicolor Archetypes & Warm-Start 15 Dedicated Value MLPs from Monocolor Networks
    const archetypes: BicolorEvoState[] = [];
    const trajectoriesByPact = new Map<BicolorArchetypeId, ValueTrainingSample[]>();
    const trainedMlps = new Map<BicolorArchetypeId, SerializedValueMlp>();

    for (const bp of BICOLOR_BLUEPRINTS) {
      const eligiblePool = getEligiblePoolForBlueprint(bp);
      const seedIds = buildSeed100BicolorDeck(bp, eligiblePool);

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
        jaccardStability: 0,
        medianChampionCardCi95: 0.25,
      });

      trajectoriesByPact.set(bp.id, []);
      const parentMlp = DOMAIN_VALUE_NETWORKS[bp.domains[0]];
      if (parentMlp) {
        trainedMlps.set(bp.id, { ...parentMlp, domain: bp.domains[0] });
      }
    }

    let totalMatchesSimulated = 0;

    // 1B. Exploratory Sweep across Legendary & Rare Dual-Domain Pools
    console.log(
      '\n[Etapa 1B] Varredura Exploratória dos Acervos Bicolores (Lendárias, Raras & Sinergias Cruzadas)...'
    );
    const exploreStart = Date.now();
    const exploreJobs: Array<{
      archA: BicolorEvoState;
      archB: BicolorEvoState;
      promise: Promise<WorkerPairBatchResponse>;
    }> = [];

    for (let idx = 0; idx < archetypes.length; idx++) {
      const arch = archetypes[idx];
      const [domA, domB] = arch.bp.domains;
      const highRarityPool = arch.eligiblePool
        .filter((c) => c.domain === domA || c.domain === domB)
        .sort((a, b) => {
          const rw: Record<Rarity, number> = { legendary: 4, rare: 3, uncommon: 2, common: 1 };
          return rw[b.rarity] - rw[a.rarity];
        });

      const chunkSize = 48;
      for (let cStart = 0; cStart < Math.min(240, highRarityPool.length); cStart += chunkSize) {
        const chunk = highRarityPool.slice(cStart, cStart + chunkSize);
        const expDeck = buildExploration100BicolorDeck(arch, chunk);
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
      unpackIntoPactTrajectories(
        trajectoriesByPact,
        job.archA.bp.id,
        res.trajectoriesA,
        TRAJECTORY_CAP_PER_PACT
      );
      unpackIntoPactTrajectories(
        trajectoriesByPact,
        job.archB.bp.id,
        res.trajectoriesB,
        TRAJECTORY_CAP_PER_PACT
      );
    }
    console.log(
      `   ✓ Varredura concluída em ${((Date.now() - exploreStart) / 1000).toFixed(1)}s (${totalMatchesSimulated} duelos exploratórios).`
    );

    const getSparringPartners = (arch: BicolorEvoState, gen: number): BicolorEvoState[] => {
      const others = archetypes.filter((a) => a.bp.id !== arch.bp.id);
      const picked: BicolorEvoState[] = [];
      const offset = (gen * 3 + archetypes.indexOf(arch) * 2) % others.length;
      for (let k = 0; k < 7; k++) {
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

      if (gen === 3 || gen === 7 || gen === 11) {
        console.log(
          `\n[Motor Neural — Geração ${gen}] Refinando 15 Redes Value MLP Bicolores (Warm-Start + 50/50 Adam)...`
        );
        let accSum = 0;
        let netCnt = 0;
        for (const arch of archetypes) {
          const samples = trajectoriesByPact.get(arch.bp.id) ?? [];
          if (samples.length >= 350) {
            const balanced = rebalanceTrajectorySamples(samples);
            const warm =
              trainedMlps.get(arch.bp.id) ?? DOMAIN_VALUE_NETWORKS[arch.bp.domains[0]] ?? null;
            const mlp = trainValueMlpWithAdam(arch.bp.domains[0], balanced, {
              epochs: 14,
              batchSize: 80,
              learningRate: 0.0018,
              seed: 5000 * gen + netCnt,
              warmStartMlp: warm,
            });
            trainedMlps.set(arch.bp.id, mlp);
            accSum += mlp.signAccuracy;
            netCnt += 1;
          }
        }
        console.log(
          `   ✓ ${netCnt}/15 Redes Value MLP atualizadas | Acurácia Média de Sinal: ${((accSum / Math.max(1, netCnt)) * 100).toFixed(1)}%`
        );
      }

      for (const arch of archetypes) {
        arch.prevGenCardIds = arch.cardIds.slice();
      }

      const leagueJobs: Array<{
        archA: BicolorEvoState;
        archB: BicolorEvoState;
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
              maxTrajectoriesPerSide: 50,
            }),
          });
        }

        const underSampled = arch.eligiblePool
          .filter((c) => {
            const p = arch.cardStats.get(c.id)?.playedGames ?? 0;
            const inChamp = arch.cardIds.includes(c.id);
            return (inChamp && p < 50) || (c.rarity === 'legendary' && p < 30);
          })
          .sort(
            (a, b) =>
              (arch.cardStats.get(a.id)?.playedGames ?? 0) -
              (arch.cardStats.get(b.id)?.playedGames ?? 0)
          );

        if (underSampled.length > 0 && gen <= 9) {
          const boostDeck = buildExploration100BicolorDeck(arch, underSampled.slice(0, 28));
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
      const genScoreByArch = new Map<BicolorArchetypeId, { score: number; games: number }>();

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

        unpackIntoPactTrajectories(
          trajectoriesByPact,
          job.archA.bp.id,
          res.trajectoriesA,
          TRAJECTORY_CAP_PER_PACT
        );
        unpackIntoPactTrajectories(
          trajectoriesByPact,
          job.archB.bp.id,
          res.trajectoriesB,
          TRAJECTORY_CAP_PER_PACT
        );
      }

      const challengerProposals = archetypes.map((arch) => {
        const rec = genScoreByArch.get(arch.bp.id);
        const genWr = rec && rec.games > 0 ? rec.score / rec.games : 0.5;
        if (gen === 1) arch.seedWinRate = genWr;
        arch.latestWinRate = genWr;

        const { profile, shapleyRanking, medianDeckCardCi95 } = synthesizeBicolorProfileAndShapley(
          arch,
          gen,
          MIN_COMBO_COPLAYS
        );
        arch.profile = profile;
        arch.medianChampionCardCi95 = medianDeckCardCi95;

        const { challengerCardIds, challengerWeights } = proposeChallengerBicolorDeckAndWeights(
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
          opp: BicolorEvoState;
          promise: Promise<WorkerPairBatchResponse>;
        }> = [];

        for (let pIdx = 0; pIdx < challengerProposals.length; pIdx++) {
          const prop = challengerProposals[pIdx];
          if (prop.decided) continue;
          const pactMlp = trainedMlps.get(prop.arch.bp.id) ?? null;

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
              mlpA: pactMlp,
              mlpB: pactMlp,
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
                mlpA: pactMlp,
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
                mlpA: pactMlp,
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

        for (const prop of challengerProposals) {
          if (prop.decided) continue;
          const dirAdv = prop.directStat.mean - 0.5;
          const dirSe = prop.directStat.stdError;
          const gauntAdv = prop.challGauntStat.mean - prop.incGauntStat.mean;
          const gauntSe = Math.hypot(prop.challGauntStat.stdError, prop.incGauntStat.stdError);

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
        `[Geração ${String(gen).padStart(2)}/${MAX_GENERATIONS}] ${genSec}s | Promovidos: ${String(promotedInGen).padStart(2)}/15 | Jaccard Médio: ${(meanJaccard * 100).toFixed(1)}% | Max Card IC95% Mediano: ±${(maxMedianCi95 * 100).toFixed(2)}% | Acumulado: ${totalMatchesSimulated.toLocaleString('en-US')} duelos`
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
            `   ✓ Convergência Estatística Atingida na Geração ${gen} (Jaccard >= ${(TARGET_DECK_JACCARD_STABILITY * 100).toFixed(1)}%)!`
          );
          break;
        }
      } else {
        consecutiveStableGens = 0;
      }
    }

    // 3. Final Deep Training of all 15 Dedicated Bicolor Value MLPs
    console.log(
      '\n[Etapa 3] Treinamento Profundo Final das 15 Redes Neurais Value MLP Bicolores (Adam + 50/50 Class-Balanced)...'
    );
    let totalTrajectories = 0;
    const bicolorNetworksOut: Partial<Record<BicolorArchetypeId, SerializedValueMlp>> = {};

    for (let idx = 0; idx < archetypes.length; idx++) {
      const arch = archetypes[idx];
      const samples = trajectoriesByPact.get(arch.bp.id) ?? [];
      totalTrajectories += samples.length;
      const balanced = rebalanceTrajectorySamples(samples);
      const warm = DOMAIN_VALUE_NETWORKS[arch.bp.domains[0]] ?? null;
      const mlp = trainValueMlpWithAdam(arch.bp.domains[0], balanced, {
        epochs: 26,
        batchSize: 96,
        learningRate: 0.0020,
        weightDecay: 0.00015,
        seed: 303700 + idx * 17,
        warmStartMlp: warm,
      });
      trainedMlps.set(arch.bp.id, mlp);
      bicolorNetworksOut[arch.bp.id] = mlp;
      console.log(
        `   ✓ MLP [${arch.bp.id.padEnd(20)}]: ${samples.length.toLocaleString('en-US').padStart(6)} estados | MSE ${mlp.initialMse.toFixed(4)} -> ${mlp.finalMse.toFixed(4)} | SignAcc: ${(mlp.signAccuracy * 100).toFixed(1)}%`
      );
    }

    // 4. Distill Graduated Tier I..V 100-Card Bicolor Grimoires
    console.log(
      '\n[Etapa 4] Destilando Grimórios Bicolores Estabilizados (Tiers I, II, III, IV e V) para os 15 Pactos...'
    );
    const masteryById: Record<string, StabilizedBicolorArchetypeMastery> = {};

    for (const arch of archetypes) {
      const { profile, shapleyRanking, crossDomainCombos, medianDeckCardCi95 } =
        synthesizeBicolorProfileAndShapley(arch, generationsExecuted, MIN_COMBO_COPLAYS);
      arch.profile = profile;
      arch.medianChampionCardCi95 = medianDeckCardCi95;
      const tierDecks = distillGraduatedBicolorTierDecks(arch, shapleyRanking);

      const breakdown: Record<string, number> = {};
      for (const cid of tierDecks[5].cardIds) {
        const d = CARDS_BY_ID[cid]!.domain;
        breakdown[d] = (breakdown[d] ?? 0) + 1;
      }

      const coverCardId =
        arch.cardIds.find((id) => CARDS_BY_ID[id]?.rarity === 'legendary') ?? arch.cardIds[0];

      masteryById[arch.bp.id] = {
        archetypeId: arch.bp.id,
        domains: arch.bp.domains,
        isAxialAlliance: arch.bp.isAxialAlliance,
        triadId: arch.bp.triadId,
        classicDeckId: arch.bp.classicDeckId,
        name: arch.bp.name,
        subtitle: arch.bp.subtitle,
        strategySummary: arch.bp.strategySummary,
        tacticalIdentity: arch.bp.tacticalIdentity,
        coverCardId,
        generationsEvolved: generationsExecuted,
        matchesSimulated: arch.totalGames,
        seedWinRate: Math.round(arch.seedWinRate * 1000) / 1000,
        championWinRate: Math.round(arch.latestWinRate * 1000) / 1000,
        vsMonocolorWinRate: 0.5,
        championDeckJaccardStability: Math.round(arch.jaccardStability * 1000) / 1000,
        medianCardCi95HalfWidth: Math.round(medianDeckCardCi95 * 10000) / 10000,
        domainCardBreakdown: breakdown,
        crossDomainCombos,
        learnedProfile: profile,
        topShapleyCards: shapleyRanking.slice(0, 22),
        tierDecks,
      };
    }

    // 4B. Global All-Pairs 15x14 Bicolor Tier V Round-Robin (Beam Search)
    console.log(
      '\n[Etapa 4B] Torneio Todos-Contra-Todos dos 15 Campeões Bicolores Tier V (105 confrontos * 8 jogos = 840 duelos Beam Search)...'
    );
    const champRRStart = Date.now();
    const champRRJobs: Array<{
      idA: BicolorArchetypeId;
      idB: BicolorArchetypeId;
      promise: Promise<WorkerPairBatchResponse>;
    }> = [];

    for (let i = 0; i < archetypes.length; i++) {
      for (let j = i + 1; j < archetypes.length; j++) {
        const a = archetypes[i];
        const b = archetypes[j];
        const mA = masteryById[a.bp.id];
        const mB = masteryById[b.bp.id];
        champRRJobs.push({
          idA: a.bp.id,
          idB: b.bp.id,
          promise: pool.runBatch({
            deckACardIds: mA.tierDecks[5].cardIds,
            deckBCardIds: mB.tierDecks[5].cardIds,
            nameA: a.bp.name,
            nameB: b.bp.name,
            deckIdA: a.bp.id,
            deckIdB: b.bp.id,
            domainA: a.bp.domains[0],
            domainB: b.bp.domains[0],
            profileA: mA.learnedProfile,
            profileB: mB.learnedProfile,
            skillTierA: 5,
            skillTierB: 5,
            mlpA: trainedMlps.get(a.bp.id) ?? null,
            mlpB: trainedMlps.get(b.bp.id) ?? null,
            fastRollout: false,
            numMirrorPairs: 4,
            collectTelemetryA: false,
            collectTelemetryB: false,
            maxTrajectoriesPerSide: 0,
          }),
        });
      }
    }

    const champRRResults = await Promise.all(champRRJobs.map((j) => j.promise));
    const champRRScore = new Map<BicolorArchetypeId, { score: number; games: number }>();
    for (let i = 0; i < champRRJobs.length; i++) {
      const job = champRRJobs[i];
      const res = champRRResults[i];
      totalMatchesSimulated += res.matchesPlayed;
      const recA = champRRScore.get(job.idA) ?? { score: 0, games: 0 };
      recA.score += res.scoreASum;
      recA.games += res.matchesPlayed;
      champRRScore.set(job.idA, recA);

      const recB = champRRScore.get(job.idB) ?? { score: 0, games: 0 };
      recB.score += res.matchesPlayed - res.scoreASum;
      recB.games += res.matchesPlayed;
      champRRScore.set(job.idB, recB);
    }

    // 4C. Cross-Format Showdown: 15 Bicolor Tier V Champions vs 16 Monocolor Tier V Champions!
    console.log(
      '\n[Etapa 4C] Confronto Cruzado Inter-Formatos: 15 Campeões Bicolores Tier V vs. 16 Campeões Monocolores Tier V (960 duelos Beam Search)...'
    );
    const monoChamps = Object.values(MONOCOLOR_ARCHETYPE_MASTERY).filter(
      (m): m is NonNullable<typeof m> => Boolean(m && m.tierDecks[5]?.cardIds.length === 100)
    );
    const crossJobs: Array<{
      biId: BicolorArchetypeId;
      monoId: MonocolorArchetypeId;
      promise: Promise<WorkerPairBatchResponse>;
    }> = [];

    for (const arch of archetypes) {
      const mBi = masteryById[arch.bp.id];
      for (const mMono of monoChamps) {
        crossJobs.push({
          biId: arch.bp.id,
          monoId: mMono.archetypeId,
          promise: pool.runBatch({
            deckACardIds: mBi.tierDecks[5].cardIds,
            deckBCardIds: mMono.tierDecks[5].cardIds,
            nameA: mBi.name,
            nameB: mMono.name,
            deckIdA: mBi.archetypeId,
            deckIdB: mMono.archetypeId,
            domainA: mBi.domains[0],
            domainB: mMono.domain,
            profileA: mBi.learnedProfile,
            profileB: mMono.learnedProfile,
            skillTierA: 5,
            skillTierB: 5,
            mlpA: trainedMlps.get(arch.bp.id) ?? null,
            mlpB: DOMAIN_VALUE_NETWORKS[mMono.domain] ?? null,
            fastRollout: false,
            numMirrorPairs: 2, // 4 Beam-Search games per Bicolor x Monocolor pair = 960 games!
            collectTelemetryA: false,
            collectTelemetryB: false,
            maxTrajectoriesPerSide: 0,
          }),
        });
      }
    }

    const crossResults = await Promise.all(crossJobs.map((j) => j.promise));
    const vsMonoScore = new Map<BicolorArchetypeId, { score: number; games: number }>();
    let globalBiScoreVsMono = 0;
    let globalBiGamesVsMono = 0;

    for (let i = 0; i < crossJobs.length; i++) {
      const job = crossJobs[i];
      const res = crossResults[i];
      totalMatchesSimulated += res.matchesPlayed;
      const rec = vsMonoScore.get(job.biId) ?? { score: 0, games: 0 };
      rec.score += res.scoreASum;
      rec.games += res.matchesPlayed;
      vsMonoScore.set(job.biId, rec);
      globalBiScoreVsMono += res.scoreASum;
      globalBiGamesVsMono += res.matchesPlayed;
    }

    for (const arch of archetypes) {
      const rr = champRRScore.get(arch.bp.id);
      const vm = vsMonoScore.get(arch.bp.id);
      const m = masteryById[arch.bp.id];
      if (rr && rr.games > 0) {
        m.championWinRate = Math.round((rr.score / rr.games) * 1000) / 1000;
        m.matchesSimulated += rr.games;
        m.learnedProfile.trainedWinRate = m.championWinRate;
        m.learnedProfile.matchesSimulated += rr.games;
      }
      if (vm && vm.games > 0) {
        m.vsMonocolorWinRate = Math.round((vm.score / vm.games) * 1000) / 1000;
        m.matchesSimulated += vm.games;
      }
      const splitStr = Object.entries(m.domainCardBreakdown)
        .map(([d, n]) => `${d}:${n}`)
        .join('/');
      console.log(
        `   • [${arch.bp.id.padEnd(20)}] Bicolor WR: ${(m.championWinRate * 100).toFixed(1).padStart(5)}% | vs Mono T5: ${(m.vsMonocolorWinRate * 100).toFixed(1).padStart(5)}% | Split: ${splitStr.padEnd(22)} | CrossCombos: ${m.crossDomainCombos.length}`
      );
    }
    console.log(
      `   ✓ Torneios 4B & 4C concluídos em ${((Date.now() - champRRStart) / 1000).toFixed(1)}s | Média Global Bicolor vs Monocolor Tier V: ${((globalBiScoreVsMono / Math.max(1, globalBiGamesVsMono)) * 100).toFixed(1)}%`
    );

    // 5. Adaptive Sequential 5-Tier Ladder Benchmark Across the 5 Alliance Triads (IC95% <= ±3.0%!)
    console.log(
      `\n[Etapa 5] Benchmark Sequencial Adaptativo da Escada Tier I -> Tier V nas 5 Tríades Bicolores (Alvo IC 95% <= ±${(TARGET_TIER_LADDER_CI95 * 100).toFixed(1)}%)...`
    );

    const triads: BicolorPactTriadId[] = [
      'pyros_alliances',
      'veridia_alliances',
      'vortex_alliances',
      'eclipse_alliances',
      'solaria_alliances',
    ];
    const tiers: AiSkillTier[] = [1, 2, 3, 4, 5];

    interface TriadLadderCell {
      triadId: BicolorPactTriadId;
      lowT: AiSkillTier;
      highT: AiSkillTier;
      statHigh: PairedStatAccumulator;
      nextArchCursor: number;
    }

    const cellsByTriad = new Map<BicolorPactTriadId, TriadLadderCell[]>();
    for (const tr of triads) {
      const cells: TriadLadderCell[] = [];
      for (let i = 0; i < tiers.length; i++) {
        for (let j = i + 1; j < tiers.length; j++) {
          cells.push({
            triadId: tr,
            lowT: tiers[i],
            highT: tiers[j],
            statHigh: new PairedStatAccumulator(),
            nextArchCursor: 0,
          });
        }
      }
      cellsByTriad.set(tr, cells);
    }

    const computeTriadStats = (tr: BicolorPactTriadId) => {
      const cells = cellsByTriad.get(tr)!;
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
        const sumL = k - sumH;
        const sumSqL = Math.max(0, k - 2 * sumH + sumSqH);
        tierStats[c.highT].addBatch(k, sumH, sumSqH);
        tierStats[c.lowT].addBatch(k, sumL, sumSqL);
      }
      let maxCi95 = 0;
      for (const t of tiers) maxCi95 = Math.max(maxCi95, tierStats[t].ci95HalfWidth);
      return { tierStats, maxCi95 };
    };

    const MAX_PAIRS_PER_CELL = 190;
    let ladderWave = 0;

    while (true) {
      ladderWave += 1;
      const pendingBatches: Array<{
        cell: TriadLadderCell;
        promise: Promise<WorkerPairBatchResponse>;
      }> = [];

      for (const tr of triads) {
        const { tierStats } = computeTriadStats(tr);
        const triadArchs = archetypes.filter((a) => a.bp.triadId === tr);

        for (const cell of cellsByTriad.get(tr)!) {
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

          const pairsToSchedule = needInitial ? 54 : 24;
          const perArchPairs = Math.max(1, Math.ceil(pairsToSchedule / triadArchs.length));

          for (let aOff = 0; aOff < triadArchs.length; aOff++) {
            const arch = triadArchs[(cell.nextArchCursor + aOff) % triadArchs.length];
            const m = masteryById[arch.bp.id];
            const pactMlp = trainedMlps.get(arch.bp.id) ?? null;
            pendingBatches.push({
              cell,
              promise: pool.runBatch({
                deckACardIds: m.tierDecks[cell.highT].cardIds,
                deckBCardIds: m.tierDecks[cell.lowT].cardIds,
                nameA: `${arch.bp.name} (T${cell.highT})`,
                nameB: `${arch.bp.name} (T${cell.lowT})`,
                deckIdA: arch.bp.id,
                deckIdB: arch.bp.id,
                domainA: arch.bp.domains[0],
                domainB: arch.bp.domains[0],
                profileA: cell.highT >= 3 ? m.learnedProfile : undefined,
                profileB: cell.lowT >= 3 ? m.learnedProfile : undefined,
                skillTierA: cell.highT,
                skillTierB: cell.lowT,
                mlpA: pactMlp,
                mlpB: pactMlp,
                fastRollout: false,
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

      if (pendingBatches.length === 0) break;

      const waveStart = Date.now();
      const results = await Promise.all(pendingBatches.map((b) => b.promise));
      let waveMatches = 0;
      for (let i = 0; i < pendingBatches.length; i++) {
        const res = results[i];
        pendingBatches[i].cell.statHigh.addBatch(
          res.pairCount,
          res.pairMeanSum,
          res.pairMeanSumSq
        );
        waveMatches += res.matchesPlayed;
        totalMatchesSimulated += res.matchesPlayed;
      }

      let worstCi95 = 0;
      for (const tr of triads) {
        worstCi95 = Math.max(worstCi95, computeTriadStats(tr).maxCi95);
      }
      console.log(
        `   • Onda Escada #${ladderWave}: +${waveMatches} duelos (${((Date.now() - waveStart) / 1000).toFixed(1)}s) | Maior Margem IC95% entre todos os Tiers: ±${(worstCi95 * 100).toFixed(2)}%`
      );
    }

    const ladderByTriad = {} as Record<BicolorPactTriadId, BicolorTriadLadderBenchmark>;
    let globalMaxTierCi95 = 0;

    for (const tr of triads) {
      const cells = cellsByTriad.get(tr)!;
      const { tierStats, maxCi95 } = computeTriadStats(tr);
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

      const triadArchs = archetypes.filter((a) => a.bp.triadId === tr);
      for (const ta of triadArchs) {
        const m = masteryById[ta.bp.id];
        for (const t of tiers) {
          m.tierDecks[t].benchmarkWinRateVsLadder = tierOverallWinRates[t];
          m.tierDecks[t].benchmarkCi95HalfWidth = tierCi95HalfWidths[t];
        }
      }

      const findCellMean = (highT: AiSkillTier, lowT: AiSkillTier) => {
        const c = cells.find((x) => x.highT === highT && x.lowT === lowT);
        return c ? r3(c.statHigh.mean) : 0.5;
      };

      const totalLadderMatches = cells.reduce((s, c) => s + c.statHigh.totalMatches, 0);
      const avgMatchesPerCell = Math.round(totalLadderMatches / cells.length);

      ladderByTriad[tr] = {
        triadId: tr,
        triadTitle: TRIAD_TITLES[tr],
        archetypeIds: triadArchs.map((a) => a.bp.id),
        matchesPerCell: avgMatchesPerCell,
        totalLadderMatches,
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
        `   [${tr.padEnd(18)}] (${totalLadderMatches} jogos, IC95% <= ±${(maxCi95 * 100).toFixed(2)}%): T1=${(tierOverallWinRates[1] * 100).toFixed(1)}% | T2=${(tierOverallWinRates[2] * 100).toFixed(1)}% | T3=${(tierOverallWinRates[3] * 100).toFixed(1)}% | T4=${(tierOverallWinRates[4] * 100).toFixed(1)}% | T5=${(tierOverallWinRates[5] * 100).toFixed(1)}% | T5vT1=${(findCellMean(5, 1) * 100).toFixed(1)}%`
      );
    }

    const elapsedSeconds = Math.round(((Date.now() - tStart) / 1000) * 10) / 10;
    const summary: BicolorTrainingSummary = {
      generatedAt: new Date().toISOString(),
      totalMatchesSimulated,
      totalStateTrajectoriesTrained: totalTrajectories,
      elapsedSeconds,
      archetypesCount: archetypes.length,
      overallVsMonocolorTier5WinRate:
        Math.round((globalBiScoreVsMono / Math.max(1, globalBiGamesVsMono)) * 1000) / 1000,
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
      ladderByTriad,
    };

    const targetPath = path.resolve(__dirname, '../data/aiBicolorMasteryData.ts');
    const fileContent = `import { AiSkillTier, Domain } from '../types/game';
import type { DeckLearnedAiProfile, DiscoveredCardCombo } from './aiLearnedProfiles';
import type { CardShapleyMetric, TierDeckMetadata } from './aiMonocolorMasteryData';
import type { SerializedValueMlp } from '../engine/aiValueNetwork';

/**
 * GERADO AUTOMATICAMENTE POR src/scripts/trainBicolorEvolution.ts (npm run train:bicolor)
 * Partidas Simuladas: ${totalMatchesSimulated.toLocaleString('en-US')} | Estados Treinados nas 15 Value MLPs: ${totalTrajectories.toLocaleString('en-US')} (${elapsedSeconds}s em ${workerCount} threads)
 * Margem de Erro Máxima IC 95% nos Tiers: ±${(globalMaxTierCi95 * 100).toFixed(2)}%
 */

export type BicolorArchetypeId =
  | 'dual_red_gold'
  | 'dual_blue_purple'
  | 'dual_red_green'
  | 'dual_blue_gold'
  | 'dual_purple_green'
  | 'dual_red_purple'
  | 'dual_blue_green'
  | 'dual_green_gold'
  | 'dual_purple_gold'
  | 'dual_red_blue'
  | 'dual_green_neutral'
  | 'dual_red_neutral'
  | 'dual_blue_neutral'
  | 'dual_purple_neutral'
  | 'dual_gold_neutral';

export type BicolorPactTriadId =
  | 'pyros_alliances'
  | 'veridia_alliances'
  | 'vortex_alliances'
  | 'eclipse_alliances'
  | 'solaria_alliances';

export interface BicolorArchetypeMastery {
  archetypeId: BicolorArchetypeId;
  domains: [Domain, Domain];
  isAxialAlliance: boolean;
  triadId: BicolorPactTriadId;
  classicDeckId?: string;
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
  championDeckJaccardStability: number;
  medianCardCi95HalfWidth: number;
  domainCardBreakdown: Record<string, number>;
  crossDomainCombos: DiscoveredCardCombo[];
  learnedProfile: DeckLearnedAiProfile;
  topShapleyCards: CardShapleyMetric[];
  tierDecks: Record<AiSkillTier, TierDeckMetadata>;
}

export interface BicolorTriadLadderBenchmark {
  triadId: BicolorPactTriadId;
  triadTitle: string;
  archetypeIds: BicolorArchetypeId[];
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

export interface BicolorTrainingSummary {
  generatedAt: string;
  totalMatchesSimulated: number;
  totalStateTrajectoriesTrained: number;
  elapsedSeconds: number;
  archetypesCount: number;
  overallVsMonocolorTier5WinRate: number;
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
  ladderByTriad: Record<BicolorPactTriadId, BicolorTriadLadderBenchmark>;
}

export const BICOLOR_TRAINING_SUMMARY: BicolorTrainingSummary = ${JSON.stringify(summary, null, 2)};

export const BICOLOR_VALUE_NETWORKS: Partial<Record<BicolorArchetypeId, SerializedValueMlp>> = ${JSON.stringify(bicolorNetworksOut)};

export const BICOLOR_ARCHETYPE_MASTERY: Partial<Record<BicolorArchetypeId, BicolorArchetypeMastery>> = ${JSON.stringify(masteryById, null, 2)};
`;

    fs.writeFileSync(targetPath, fileContent, 'utf-8');
    console.log('\n================================================================================');
    console.log(` TREINAMENTO BICOLOR CONCLUÍDO EM ${elapsedSeconds}s (${workerCount} Workers)!`);
    console.log(` • Duelos completos de 100 cartas simulados: ${totalMatchesSimulated.toLocaleString('en-US')}`);
    console.log(` • Estados treinados nas 15 Value MLPs: ${totalTrajectories.toLocaleString('en-US')}`);
    console.log(` • Maior Margem de Erro IC 95% nos Tiers: ±${(globalMaxTierCi95 * 100).toFixed(2)}%`);
    console.log(` • Artefato salvo em: ${targetPath}`);
    console.log('================================================================================');
  } finally {
    await pool.close();
  }
}

if (isMainThread) {
  main().catch((err) => {
    console.error('Erro fatal no treinamento paralelo bicolor:', err);
    process.exit(1);
  });
}
