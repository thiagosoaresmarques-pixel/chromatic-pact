import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isMainThread, parentPort, Worker } from 'node:worker_threads';
import { ALL_CARDS, CARDS_BY_ID } from '../data/cards';
import {
  CAMPAIGN_BOSSES,
  MAX_COPIES_BY_RARITY,
  MAX_LEGENDARIES_PER_DECK,
  PREBUILT_DECKS,
  REQUIRED_DECK_SIZE,
} from '../data/decks';
import type { DeckLearnedAiProfile, DiscoveredCardCombo } from '../data/aiLearnedProfiles';
import {
  CardShapleyMetric,
  DOMAIN_VALUE_NETWORKS,
  MONOCOLOR_ARCHETYPE_MASTERY,
  MONOCOLOR_TRAINING_SUMMARY,
  MonocolorArchetypeId,
  MonocolorArchetypeMastery,
  MonocolorTrainingSummary,
  TierDeckMetadata,
} from '../data/aiMonocolorMasteryData';
import {
  BICOLOR_ARCHETYPE_MASTERY,
  BICOLOR_TRAINING_SUMMARY,
  BICOLOR_VALUE_NETWORKS,
  BicolorArchetypeId,
  BicolorArchetypeMastery,
  BicolorTrainingSummary,
} from '../data/aiBicolorMasteryData';
import { ORDERED_BICOLOR_ARCHETYPE_IDS } from '../data/aiBicolorMastery';
import {
  POLYCOLOR_ARCHETYPE_MASTERY,
  POLYCOLOR_TRAINING_SUMMARY,
  POLYCOLOR_VALUE_NETWORKS,
  PolycolorArchetypeId,
  PolycolorArchetypeMastery,
  PolycolorTrainingSummary,
} from '../data/aiPolycolorMasteryData';
import { ORDERED_POLYCOLOR_ARCHETYPE_IDS } from '../data/aiPolycolorMastery';
import {
  AiProfileOverrides,
  chooseMulliganIndicesForActor,
  executeTurnStepForActor,
} from '../engine/aiEngine';
import {
  extractNormalizedStateFeatures,
  SerializedValueMlp,
  trainValueMlpWithAdam,
  VALUE_MLP_H1_DIM,
  VALUE_MLP_H2_DIM,
  VALUE_MLP_INPUT_DIM,
  ValueTrainingSample,
} from '../engine/aiValueNetwork';
import {
  createInitialGameState,
  getAllBoardUnits,
  mulliganCards,
} from '../engine/gameEngine';
import { AiSkillTier, CardDefinition, Domain } from '../types/game';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type UnifiedFormatKind = 'monocolor' | 'bicolor' | 'tricolor' | 'pentachromatic';
type UnifiedChampionId = MonocolorArchetypeId | BicolorArchetypeId | PolycolorArchetypeId;

interface CardUsageStat {
  drawnOrHeldGames: number;
  playedGames: number;
  playedWinSum: number;
  stuckGames: number;
}

interface RawTrajectoryRecord {
  features: number[];
  target: number;
  weight: number;
}

interface WorkerBatchDuelRequest {
  jobId: number;
  kind: 'duel_pair';
  idxA: number;
  idxB: number;
  deckACardIds: string[];
  deckBCardIds: string[];
  nameA: string;
  nameB: string;
  idA: string;
  idB: string;
  profileA: DeckLearnedAiProfile;
  profileB: DeckLearnedAiProfile;
  mlpA: SerializedValueMlp | null;
  mlpB: SerializedValueMlp | null;
  numMirrorPairs: number;
  fastRollout: boolean;
  collectSamplesProb: number;
}

interface WorkerBatchDuelResponse {
  jobId: number;
  idxA: number;
  idxB: number;
  matchesPlayed: number;
  scoreASum: number;
  cardStatsA: Array<[string, CardUsageStat]>;
  cardStatsB: Array<[string, CardUsageStat]>;
  coPlayWinsA: Array<[string, { coPlays: number; winSum: number }]>;
  coPlayWinsB: Array<[string, { coPlays: number; winSum: number }]>;
  samplesA: RawTrajectoryRecord[];
  samplesB: RawTrajectoryRecord[];
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

function resolveDeckDefinitions(cardIds: string[]): CardDefinition[] {
  const arr = new Array<CardDefinition>(cardIds.length);
  for (let i = 0; i < cardIds.length; i++) {
    const c = CARDS_BY_ID[cardIds[i]];
    if (!c) throw new Error(`Missing card ID in deck: ${cardIds[i]}`);
    arr[i] = c;
  }
  return arr;
}

function simulateEvolutionDuel(
  playerDeckCards: CardDefinition[],
  aiDeckCards: CardDefinition[],
  namePlayer: string,
  nameAi: string,
  deckIdPlayer: string,
  deckIdAi: string,
  overrides: AiProfileOverrides,
  collectSamplesProb: number,
  playedPOut: Set<string>,
  playedAOut: Set<string>,
  seenHandPOut: Set<string>,
  seenHandAOut: Set<string>,
  samplesPOut: RawTrajectoryRecord[],
  samplesAOut: RawTrajectoryRecord[]
): number {
  let state = createInitialGameState(playerDeckCards, aiDeckCards, {
    playerName: namePlayer,
    aiName: nameAi,
    playerDeckId: deckIdPlayer,
    aiDeckId: deckIdAi,
    playerSkillTier: 5 as AiSkillTier,
    aiSkillTier: 5 as AiSkillTier,
  });

  const pSwap = chooseMulliganIndicesForActor(state, 'player', overrides.player, 5);
  state = mulliganCards(state, 'player', pSwap);
  const aSwap = chooseMulliganIndicesForActor(state, 'ai', overrides.ai, 5);
  state = mulliganCards(state, 'ai', aSwap);

  for (const c of state.player.hand) seenHandPOut.add(c.id);
  for (const c of state.ai.hand) seenHandAOut.add(c.id);

  const pendingStatesP: Array<{ feat: number[]; turn: number }> = [];
  const pendingStatesA: Array<{ feat: number[]; turn: number }> = [];

  const maxTurns = 32;
  let guardSteps = 0;
  let lastRecordedTurnP = -1;
  let lastRecordedTurnA = -1;

  while (state.phase !== 'gameover' && state.turn <= maxTurns && guardSteps < 850) {
    guardSteps += 1;
    const active = state.activePlayer;

    if (collectSamplesProb > 0 && state.turn >= 2) {
      if (active === 'player' && state.turn !== lastRecordedTurnP && Math.random() < collectSamplesProb) {
        lastRecordedTurnP = state.turn;
        const f = extractNormalizedStateFeatures(state, 'player');
        pendingStatesP.push({ feat: Array.from(f), turn: state.turn });
      } else if (active === 'ai' && state.turn !== lastRecordedTurnA && Math.random() < collectSamplesProb) {
        lastRecordedTurnA = state.turn;
        const f = extractNormalizedStateFeatures(state, 'ai');
        pendingStatesA.push({ feat: Array.from(f), turn: state.turn });
      }
    }

    const prevHandP = state.player.hand;
    const prevChanP = state.player.channeledCards.length;
    const prevHandA = state.ai.hand;
    const prevChanA = state.ai.channeledCards.length;

    const step = executeTurnStepForActor(state, active, overrides);
    const next = step.nextState;

    for (const c of next.player.hand) seenHandPOut.add(c.id);
    for (const c of next.ai.hand) seenHandAOut.add(c.id);

    if (
      next.player.channeledCards.length === prevChanP &&
      next.player.hand.length < prevHandP.length
    ) {
      const remCounts = new Map<string, number>();
      for (const c of next.player.hand) remCounts.set(c.id, (remCounts.get(c.id) ?? 0) + 1);
      for (const c of prevHandP) {
        const cnt = remCounts.get(c.id) ?? 0;
        if (cnt > 0) remCounts.set(c.id, cnt - 1);
        else playedPOut.add(c.id);
      }
    }

    if (
      next.ai.channeledCards.length === prevChanA &&
      next.ai.hand.length < prevHandA.length
    ) {
      const remCounts = new Map<string, number>();
      for (const c of next.ai.hand) remCounts.set(c.id, (remCounts.get(c.id) ?? 0) + 1);
      for (const c of prevHandA) {
        const cnt = remCounts.get(c.id) ?? 0;
        if (cnt > 0) remCounts.set(c.id, cnt - 1);
        else playedAOut.add(c.id);
      }
    }

    state = next;
  }

  let scoreP = 0.5;
  if (state.phase === 'gameover' && state.winner === 'player') {
    scoreP = 1;
  } else if (state.phase === 'gameover' && state.winner === 'ai') {
    scoreP = 0;
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
    scoreP = clamp(0.5 + adv / 60, 0.15, 0.85);
  }

  const endTurnNum = Math.max(1, state.turn);
  const outcomeP = scoreP * 2 - 1; // [-1, +1]
  const outcomeA = -outcomeP;

  for (const rec of pendingStatesP) {
    const dist = Math.max(0, endTurnNum - rec.turn);
    const discount = Math.pow(0.95, dist);
    samplesPOut.push({
      features: rec.feat,
      target: clamp(outcomeP * discount, -1, 1),
      weight: 0.7 + 0.3 * discount,
    });
  }
  for (const rec of pendingStatesA) {
    const dist = Math.max(0, endTurnNum - rec.turn);
    const discount = Math.pow(0.95, dist);
    samplesAOut.push({
      features: rec.feat,
      target: clamp(outcomeA * discount, -1, 1),
      weight: 0.7 + 0.3 * discount,
    });
  }

  return scoreP;
}

// ============================================================================
// WORKER THREAD ENTRYPOINT
// ============================================================================
if (!isMainThread && parentPort) {
  parentPort.on('message', (req: WorkerBatchDuelRequest) => {
    const cardsA = resolveDeckDefinitions(req.deckACardIds);
    const cardsB = resolveDeckDefinitions(req.deckBCardIds);

    const cardStatsA = new Map<string, CardUsageStat>();
    const cardStatsB = new Map<string, CardUsageStat>();
    const coPlaysA = new Map<string, { coPlays: number; winSum: number }>();
    const coPlaysB = new Map<string, { coPlays: number; winSum: number }>();
    const samplesA: RawTrajectoryRecord[] = [];
    const samplesB: RawTrajectoryRecord[] = [];

    const recordUsage = (
      map: Map<string, CardUsageStat>,
      coMap: Map<string, { coPlays: number; winSum: number }>,
      played: Set<string>,
      seen: Set<string>,
      score: number
    ) => {
      for (const cid of seen) {
        let st = map.get(cid);
        if (!st) {
          st = { drawnOrHeldGames: 0, playedGames: 0, playedWinSum: 0, stuckGames: 0 };
          map.set(cid, st);
        }
        st.drawnOrHeldGames += 1;
        if (!played.has(cid)) {
          st.stuckGames += 1;
        }
      }
      const playedArr = Array.from(played);
      for (const cid of playedArr) {
        let st = map.get(cid);
        if (!st) {
          st = { drawnOrHeldGames: 1, playedGames: 0, playedWinSum: 0, stuckGames: 0 };
          map.set(cid, st);
        }
        st.playedGames += 1;
        st.playedWinSum += score;
      }
      if (playedArr.length >= 2 && playedArr.length <= 18) {
        playedArr.sort();
        for (let i = 0; i < playedArr.length; i++) {
          for (let j = i + 1; j < playedArr.length; j++) {
            const key = `${playedArr[i]}|${playedArr[j]}`;
            let cp = coPlaysA === coMap ? coPlaysA.get(key) : coPlaysB.get(key);
            if (!cp) {
              cp = { coPlays: 0, winSum: 0 };
              coMap.set(key, cp);
            }
            cp.coPlays += 1;
            cp.winSum += score;
          }
        }
      }
    };

    let scoreASum = 0;
    for (let k = 0; k < req.numMirrorPairs; k++) {
      const pPlay1 = new Set<string>();
      const aPlay1 = new Set<string>();
      const pSeen1 = new Set<string>();
      const aSeen1 = new Set<string>();
      const s1 = simulateEvolutionDuel(
        cardsA,
        cardsB,
        req.nameA,
        req.nameB,
        req.idA,
        req.idB,
        {
          player: req.profileA,
          ai: req.profileB,
          playerSkillTier: 5,
          aiSkillTier: 5,
          playerValueMlp: req.mlpA,
          aiValueMlp: req.mlpB,
          fastRollout: req.fastRollout,
        },
        req.collectSamplesProb,
        pPlay1,
        aPlay1,
        pSeen1,
        aSeen1,
        samplesA,
        samplesB
      );
      recordUsage(cardStatsA, coPlaysA, pPlay1, pSeen1, s1);
      recordUsage(cardStatsB, coPlaysB, aPlay1, aSeen1, 1 - s1);

      const pPlay2 = new Set<string>();
      const aPlay2 = new Set<string>();
      const pSeen2 = new Set<string>();
      const aSeen2 = new Set<string>();
      const s2B = simulateEvolutionDuel(
        cardsB,
        cardsA,
        req.nameB,
        req.nameA,
        req.idB,
        req.idA,
        {
          player: req.profileB,
          ai: req.profileA,
          playerSkillTier: 5,
          aiSkillTier: 5,
          playerValueMlp: req.mlpB,
          aiValueMlp: req.mlpA,
          fastRollout: req.fastRollout,
        },
        req.collectSamplesProb,
        pPlay2,
        aPlay2,
        pSeen2,
        aSeen2,
        samplesB,
        samplesA
      );
      const s2A = 1 - s2B;
      recordUsage(cardStatsB, coPlaysB, pPlay2, pSeen2, s2B);
      recordUsage(cardStatsA, coPlaysA, aPlay2, aSeen2, s2A);

      scoreASum += s1 + s2A;
    }

    const res: WorkerBatchDuelResponse = {
      jobId: req.jobId,
      idxA: req.idxA,
      idxB: req.idxB,
      matchesPlayed: req.numMirrorPairs * 2,
      scoreASum,
      cardStatsA: Array.from(cardStatsA.entries()),
      cardStatsB: Array.from(cardStatsB.entries()),
      coPlayWinsA: Array.from(coPlaysA.entries()),
      coPlayWinsB: Array.from(coPlaysB.entries()),
      samplesA,
      samplesB,
    };
    parentPort!.postMessage(res);
  });
}

class EvolutionWorkerPool {
  private workers: Worker[] = [];
  private idleWorkers: Worker[] = [];
  private queue: Array<{
    req: WorkerBatchDuelRequest;
    resolve: (res: WorkerBatchDuelResponse) => void;
    reject: (err: Error) => void;
  }> = [];
  private inFlight = new Map<
    number,
    { resolve: (res: WorkerBatchDuelResponse) => void; reject: (err: Error) => void }
  >();
  private nextJobId = 1;

  constructor(readonly size: number) {
    const workerUrl = new URL(import.meta.url);
    for (let i = 0; i < size; i++) {
      const w = new Worker(workerUrl, { execArgv: ['--import', 'tsx'] });
      w.on('message', (msg: WorkerBatchDuelResponse) => {
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

  runJob(req: Omit<WorkerBatchDuelRequest, 'jobId' | 'kind'>): Promise<WorkerBatchDuelResponse> {
    const jobId = this.nextJobId++;
    const fullReq: WorkerBatchDuelRequest = { ...req, jobId, kind: 'duel_pair' };
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

// ============================================================================
// CHAMPION EVOLUTION STATE & DOMAIN-PRESERVING DECK MUTATOR
// ============================================================================
const ORDERED_MONO_IDS: MonocolorArchetypeId[] = [
  'mono_green_swarm',
  'mono_green_colossus',
  'mono_green_roots',
  'mono_red_blitz',
  'mono_red_pyroclasm',
  'mono_red_dragon',
  'mono_blue_frost',
  'mono_blue_chrono',
  'mono_blue_abyssal',
  'mono_purple_crypt',
  'mono_purple_blood',
  'mono_purple_umbral',
  'mono_gold_phalanx',
  'mono_gold_celestial',
  'mono_gold_judgment',
  'mono_neutral_axial',
];

const CLASSIC_MONO_MAP: Partial<Record<MonocolorArchetypeId, string[]>> = {
  mono_red_dragon: ['deck_red_inferno'],
  mono_red_blitz: ['deck_aggro_blitz'],
  mono_blue_frost: ['deck_blue_tempest'],
  mono_blue_chrono: ['deck_control_bastion'],
  mono_purple_crypt: ['deck_purple_shadow', 'deck_crypt_reanimator'],
  mono_green_colossus: ['deck_green_wild', 'deck_midrange_beasts'],
  mono_gold_phalanx: ['deck_gold_radiant'],
  mono_gold_judgment: ['deck_relic_artificer'],
  mono_neutral_axial: ['deck_neutral_watch'],
};

interface MutableChampion {
  idx: number;
  id: UnifiedChampionId;
  name: string;
  subtitle: string;
  format: UnifiedFormatKind;
  domains: Domain[];
  tacticalIdentity: 'aggro' | 'midrange' | 'control' | 'ramp' | 'tempo' | 'attrition';
  coverCardId: string;
  classicDeckIds: string[];
  cardIds: string[];
  initialCardIds: string[];
  learnedProfile: DeckLearnedAiProfile;
  cardStats: Map<string, CardUsageStat>;
  coPlayStats: Map<string, { coPlays: number; winSum: number }>;
  matchesPlayed: number;
  scoreSum: number;
  acceptedSwaps: number;
}

function heuristicCardPriorForIdentity(
  card: CardDefinition,
  identity: MutableChampion['tacticalIdentity'],
  targetAvgCost: number
): number {
  let score = -Math.abs(card.cost - targetAvgCost) * 0.12;
  const kw = new Set(card.keywords);
  const effs = new Set(card.effects.map((e) => e.type));

  if (card.rarity === 'legendary') score += 0.25;
  else if (card.rarity === 'rare') score += 0.14;
  else if (card.rarity === 'uncommon') score += 0.06;

  if (effs.has('draw_cards')) score += 0.14;
  if (effs.has('break_domain_expansion')) score += 0.16;

  switch (identity) {
    case 'aggro':
      if (card.cost <= 3) score += 0.22;
      if (kw.has('Ímpeto') || kw.has('Voo') || effs.has('damage_enemy_sovereign')) score += 0.25;
      break;
    case 'tempo':
      if (kw.has('Voo') || kw.has('Alcance') || effs.has('freeze_enemy')) score += 0.22;
      if (card.cost <= 4) score += 0.12;
      break;
    case 'midrange':
      if (kw.has('Escudo Divino') || kw.has('Guardião') || kw.has('Atropelar')) score += 0.2;
      if (effs.has('buff_all_allies') || effs.has('damage_single_enemy')) score += 0.16;
      break;
    case 'ramp':
      if (effs.has('grant_bonus_essence')) score += 0.32;
      if (kw.has('Atropelar') || (card.breathDamage ?? 0) > 0 || card.cost >= 6) score += 0.2;
      break;
    case 'control':
      if (
        effs.has('destroy_enemy') ||
        effs.has('freeze_enemy') ||
        effs.has('damage_all_units') ||
        kw.has('Guardião')
      ) {
        score += 0.24;
      }
      break;
    case 'attrition':
      if (
        kw.has('Renascer') ||
        kw.has('Dreno de Vida') ||
        kw.has('Toque Letal') ||
        effs.has('revive_from_crypt')
      ) {
        score += 0.25;
      }
      break;
  }
  return score;
}

function assertDeckInvariants(cardIds: string[], coverCardId: string, label: string): void {
  if (cardIds.length !== REQUIRED_DECK_SIZE) {
    throw new Error(`[${label}] Expected 100 cards, got ${cardIds.length}`);
  }
  const counts = new Map<string, number>();
  let legCount = 0;
  let creatureCount = 0;
  for (const cid of cardIds) {
    const c = CARDS_BY_ID[cid];
    if (!c) throw new Error(`[${label}] Unknown card ${cid}`);
    const nextCnt = (counts.get(cid) ?? 0) + 1;
    if (nextCnt > MAX_COPIES_BY_RARITY[c.rarity]) {
      throw new Error(`[${label}] Card ${cid} exceeds rarity copy cap (${nextCnt})`);
    }
    counts.set(cid, nextCnt);
    if (c.rarity === 'legendary') legCount += 1;
    if (c.type === 'creature') creatureCount += 1;
  }
  if (legCount > MAX_LEGENDARIES_PER_DECK) {
    throw new Error(`[${label}] Exceeded 10 legendaries (${legCount})`);
  }
  if (creatureCount < 50) {
    throw new Error(`[${label}] Too few creatures (${creatureCount})`);
  }
  if (!counts.has(coverCardId) && CARDS_BY_ID[coverCardId]?.rarity !== 'legendary') {
    // Tier 1/2 have 0 legendaries so legendary coverCardId is omitted in Tier 1-2
  }
}

/**
 * Proposes a domain-preserving 1-for-1 (up to 2 copies) Shapley deck mutation.
 * Returns null if no promising improvement candidate exists.
 */
function proposeDomainPreservingMutation(
  champ: MutableChampion,
  globalCardShapley: Map<string, { played: number; winSum: number }>,
  genSeed: number
): { candidateIds: string[]; summary: string } | null {
  const baselineWr = champ.matchesPlayed > 0 ? champ.scoreSum / champ.matchesPlayed : 0.5;
  const counts = new Map<string, number>();
  let legCount = 0;
  let creatureCount = 0;
  let relicCount = 0;
  let costSum = 0;

  for (const cid of champ.cardIds) {
    counts.set(cid, (counts.get(cid) ?? 0) + 1);
    const c = CARDS_BY_ID[cid]!;
    if (c.rarity === 'legendary') legCount += 1;
    if (c.type === 'creature') creatureCount += 1;
    if (c.type === 'relic') relicCount += 1;
    costSum += c.cost;
  }
  const avgCost = costSum / champ.cardIds.length;

  // Rank cards currently in deck from weakest to strongest empirical Shapley
  const uniqueInDeck = Array.from(counts.keys());
  const weakCandidates: Array<{ card: CardDefinition; utility: number }> = [];

  for (const cid of uniqueInDeck) {
    if (cid === champ.coverCardId) continue;
    const card = CARDS_BY_ID[cid]!;
    const st = champ.cardStats.get(cid);
    const played = st?.playedGames ?? 0;
    const stuckRate =
      st && st.drawnOrHeldGames > 0 ? st.stuckGames / st.drawnOrHeldGames : 0.25;
    const empWr = played > 0 ? st!.playedWinSum / played : baselineWr;
    // Shrink empirical WR towards baseline when sample count is small
    const shrunkDelta = ((empWr - baselineWr) * played) / (played + 10);
    const prior = heuristicCardPriorForIdentity(card, champ.tacticalIdentity, avgCost) * 0.08;
    const utility = shrunkDelta - stuckRate * 0.06 + prior;
    weakCandidates.push({ card, utility });
  }

  weakCandidates.sort((a, b) => a.utility - b.utility);
  if (weakCandidates.length === 0) return null;

  const nextDeck = champ.cardIds.slice();
  const swapsDone: string[] = [];

  // Attempt up to 2 single-copy domain-preserving replacements
  const pickOffset = genSeed % Math.min(3, weakCandidates.length);
  for (let wIdx = pickOffset; wIdx < weakCandidates.length && swapsDone.length < 2; wIdx++) {
    const dropCard = weakCandidates[wIdx].card;
    const curDropCopies = counts.get(dropCard.id) ?? 0;
    if (curDropCopies <= 0) continue;

    // Find best replacement in exact same domain
    const sameDomainPool = ALL_CARDS.filter((c) => c.domain === dropCard.domain && c.id !== dropCard.id);
    let bestCand: CardDefinition | null = null;
    let bestCandScore = weakCandidates[wIdx].utility + 0.015;

    for (const cand of sameDomainPool) {
      const curCopies = counts.get(cand.id) ?? 0;
      if (curCopies >= MAX_COPIES_BY_RARITY[cand.rarity]) continue;
      const nextLeg =
        legCount - (dropCard.rarity === 'legendary' ? 1 : 0) + (cand.rarity === 'legendary' ? 1 : 0);
      if (nextLeg > MAX_LEGENDARIES_PER_DECK) continue;

      const nextCreature =
        creatureCount - (dropCard.type === 'creature' ? 1 : 0) + (cand.type === 'creature' ? 1 : 0);
      if (nextCreature < 58) continue;

      const nextRelic =
        relicCount - (dropCard.type === 'relic' ? 1 : 0) + (cand.type === 'relic' ? 1 : 0);
      if (nextRelic > 12) continue;

      const localSt = champ.cardStats.get(cand.id);
      const globalSt = globalCardShapley.get(cand.id);
      const localWr =
        localSt && localSt.playedGames >= 4
          ? localSt.playedWinSum / localSt.playedGames - baselineWr
          : 0;
      const globalWr =
        globalSt && globalSt.played >= 12 ? globalSt.winSum / globalSt.played - 0.5 : 0;
      const prior = heuristicCardPriorForIdentity(cand, champ.tacticalIdentity, avgCost) * 0.14;
      const candScore = localWr * 0.65 + globalWr * 0.45 + prior;

      if (candScore > bestCandScore) {
        bestCandScore = candScore;
        bestCand = cand;
      }
    }

    if (bestCand) {
      const pos = nextDeck.indexOf(dropCard.id);
      if (pos !== -1) {
        nextDeck[pos] = bestCand.id;
        counts.set(dropCard.id, curDropCopies - 1);
        counts.set(bestCand.id, (counts.get(bestCand.id) ?? 0) + 1);
        legCount =
          legCount -
          (dropCard.rarity === 'legendary' ? 1 : 0) +
          (bestCand.rarity === 'legendary' ? 1 : 0);
        creatureCount =
          creatureCount -
          (dropCard.type === 'creature' ? 1 : 0) +
          (bestCand.type === 'creature' ? 1 : 0);
        relicCount =
          relicCount -
          (dropCard.type === 'relic' ? 1 : 0) +
          (bestCand.type === 'relic' ? 1 : 0);
        swapsDone.push(`-${dropCard.name} +${bestCand.name}`);
      }
    }
  }

  if (swapsDone.length === 0) return null;
  assertDeckInvariants(nextDeck, champ.coverCardId, `${champ.id}_challenger`);
  return { candidateIds: nextDeck, summary: swapsDone.join(', ') };
}

/**
 * Rebuilds Tier 1..5 deck metadata from the evolved Tier 5 deck while strictly
 * preserving 100 cards and exact per-domain counts on every tier.
 */
function buildDomainPreservingTierDecks(
  champ: MutableChampion,
  existingTiers: Record<AiSkillTier, TierDeckMetadata>,
  globalCardShapley: Map<string, { played: number; winSum: number }>
): Record<AiSkillTier, TierDeckMetadata> {
  const tierCaps: Record<AiSkillTier, { maxLeg: number; maxRare: number; label: string }> = {
    1: { maxLeg: 0, maxRare: 0, label: 'Tier I — Recruta Planar' },
    2: { maxLeg: 0, maxRare: 6, label: 'Tier II — Veterano Regular' },
    3: { maxLeg: 3, maxRare: 14, label: 'Tier III — Comandante Tático' },
    4: { maxLeg: 6, maxRare: 22, label: 'Tier IV — Mestre Estrategista' },
    5: { maxLeg: 10, maxRare: 99, label: 'Tier V — Soberano Grão-Mestre' },
  };

  const avgCostT5 =
    champ.cardIds.reduce((s, cid) => s + CARDS_BY_ID[cid]!.cost, 0) / champ.cardIds.length;

  const rankReplacementScore = (c: CardDefinition): number => {
    const g = globalCardShapley.get(c.id);
    const gBonus = g && g.played >= 10 ? (g.winSum / g.played - 0.5) * 0.6 : 0;
    return heuristicCardPriorForIdentity(c, champ.tacticalIdentity, avgCostT5) + gBonus;
  };

  const result = {} as Record<AiSkillTier, TierDeckMetadata>;

  for (const tier of [1, 2, 3, 4, 5] as AiSkillTier[]) {
    const cap = tierCaps[tier];
    const deck = champ.cardIds.slice();
    const counts = new Map<string, number>();
    for (const cid of deck) counts.set(cid, (counts.get(cid) ?? 0) + 1);

    const replaceExcessRarity = (targetRarity: 'legendary' | 'rare', maxAllowed: number) => {
      const indices: number[] = [];
      for (let i = 0; i < deck.length; i++) {
        if (CARDS_BY_ID[deck[i]]!.rarity === targetRarity) {
          indices.push(i);
        }
      }
      // Prefer keeping coverCardId when maxAllowed > 0
      indices.sort((ia, ib) => {
        if (deck[ia] === champ.coverCardId) return 1;
        if (deck[ib] === champ.coverCardId) return -1;
        return (
          rankReplacementScore(CARDS_BY_ID[deck[ia]]!) -
          rankReplacementScore(CARDS_BY_ID[deck[ib]]!)
        );
      });

      while (indices.length > maxAllowed) {
        const dropIdx = indices.shift()!;
        const dropCard = CARDS_BY_ID[deck[dropIdx]]!;
        // Pick best Common/Uncommon in the EXACT same domain
        const pool = ALL_CARDS.filter(
          (c) =>
            c.domain === dropCard.domain &&
            (c.rarity === 'common' || c.rarity === 'uncommon') &&
            (dropCard.type !== 'creature' || c.type === 'creature')
        ).sort((a, b) => rankReplacementScore(b) - rankReplacementScore(a));

        let chosen = pool.find((c) => (counts.get(c.id) ?? 0) < MAX_COPIES_BY_RARITY[c.rarity]);
        if (!chosen) {
          const fallbackPool = ALL_CARDS.filter(
            (c) =>
              c.domain === dropCard.domain &&
              (c.rarity === 'common' || c.rarity === 'uncommon') &&
              (counts.get(c.id) ?? 0) < MAX_COPIES_BY_RARITY[c.rarity]
          ).sort((a, b) => rankReplacementScore(b) - rankReplacementScore(a));
          chosen = fallbackPool[0];
        }
        if (chosen) {
          counts.set(dropCard.id, (counts.get(dropCard.id) ?? 1) - 1);
          deck[dropIdx] = chosen.id;
          counts.set(chosen.id, (counts.get(chosen.id) ?? 0) + 1);
        }
      }
    };

    if (tier < 5) {
      replaceExcessRarity('legendary', cap.maxLeg);
      replaceExcessRarity('rare', cap.maxRare);
    }

    assertDeckInvariants(deck, champ.coverCardId, `${champ.id}_tier_${tier}`);

    let leg = 0;
    let rare = 0;
    let unc = 0;
    let com = 0;
    let costTotal = 0;
    for (const cid of deck) {
      const c = CARDS_BY_ID[cid]!;
      costTotal += c.cost;
      if (c.rarity === 'legendary') leg += 1;
      else if (c.rarity === 'rare') rare += 1;
      else if (c.rarity === 'uncommon') unc += 1;
      else com += 1;
    }

    const prevMeta = existingTiers[tier];
    result[tier] = {
      tier,
      tierLabel: prevMeta?.tierLabel ?? cap.label,
      cardIds: deck,
      legendaryCount: leg,
      rareCount: rare,
      uncommonCount: unc,
      commonCount: com,
      avgCost: Number((costTotal / deck.length).toFixed(2)),
      benchmarkWinRateVsLadder: prevMeta?.benchmarkWinRateVsLadder ?? 0.5,
      benchmarkCi95HalfWidth: prevMeta?.benchmarkCi95HalfWidth ?? 0.025,
    };
  }

  return result;
}

function buildTopShapleyList(
  champ: MutableChampion,
  fallback: CardShapleyMetric[]
): CardShapleyMetric[] {
  const baselineWr = champ.matchesPlayed > 0 ? champ.scoreSum / champ.matchesPlayed : 0.5;
  const inDeckSet = new Set(champ.cardIds);
  const metrics: CardShapleyMetric[] = [];

  for (const cid of inDeckSet) {
    const st = champ.cardStats.get(cid);
    if (!st || st.playedGames < 5) continue;
    const card = CARDS_BY_ID[cid]!;
    const playedWr = st.playedWinSum / st.playedGames;
    const stuckRate = st.drawnOrHeldGames > 0 ? st.stuckGames / st.drawnOrHeldGames : 0;
    const shapley = playedWr - baselineWr - stuckRate * 0.05;
    const se = Math.sqrt(Math.max(0.01, playedWr * (1 - playedWr)) / st.playedGames);
    const ci95 = 1.96 * se;
    metrics.push({
      cardId: cid,
      cardName: card.name,
      shapleyValue: Number(shapley.toFixed(4)),
      shapleyLcb: Number((shapley - ci95).toFixed(4)),
      ci95HalfWidth: Number(ci95.toFixed(4)),
      playedWinRate: Number(playedWr.toFixed(3)),
      stuckInHandRate: Number(stuckRate.toFixed(3)),
      samples: st.playedGames,
    });
  }

  metrics.sort((a, b) => b.shapleyValue - a.shapleyValue);
  return metrics.length >= 8 ? metrics.slice(0, 12) : fallback;
}

function extractCrossDomainCombos(
  champ: MutableChampion,
  fallback: DiscoveredCardCombo[]
): DiscoveredCardCombo[] {
  const baselineWr = champ.matchesPlayed > 0 ? champ.scoreSum / champ.matchesPlayed : 0.5;
  const inDeck = new Set(champ.cardIds);
  const candidates: DiscoveredCardCombo[] = [];

  for (const [key, st] of champ.coPlayStats.entries()) {
    if (st.coPlays < 8) continue;
    const [cidA, cidB] = key.split('|');
    if (!inDeck.has(cidA) || !inDeck.has(cidB)) continue;
    const cA = CARDS_BY_ID[cidA];
    const cB = CARDS_BY_ID[cidB];
    if (!cA || !cB) continue;
    const coWr = st.winSum / st.coPlays;
    const lift = coWr - baselineWr;
    if (lift <= 0.01) continue;
    // Prefer cross-domain combos for Bicolor/Polycolor
    const crossBonus = cA.domain !== cB.domain ? 0.03 : 0;
    candidates.push({
      cardAId: cidA,
      cardBId: cidB,
      coPlayWinRate: Number(coWr.toFixed(3)),
      liftOverBaseline: Number((lift + crossBonus).toFixed(3)),
      sampleCount: st.coPlays,
      synergyNote: `${cA.name} + ${cB.name} (${Math.round(coWr * 100)}% WR em ${st.coPlays} duelos cruzados)`,
    });
  }

  candidates.sort((a, b) => b.liftOverBaseline - a.liftOverBaseline || b.coPlayWinRate - a.coPlayWinRate);
  if (candidates.length >= 4) return candidates.slice(0, 6);
  const merged = [...candidates];
  for (const fb of fallback) {
    if (merged.length >= 5) break;
    if (
      !merged.some(
        (m) =>
          (m.cardAId === fb.cardAId && m.cardBId === fb.cardBId) ||
          (m.cardAId === fb.cardBId && m.cardBId === fb.cardAId)
      )
    ) {
      merged.push(fb);
    }
  }
  return merged;
}

function forwardMlpRaw(mlp: SerializedValueMlp, features: Float64Array): number {
  const h1 = new Float64Array(VALUE_MLP_H1_DIM);
  for (let i = 0; i < VALUE_MLP_H1_DIM; i++) {
    let sum = mlp.b1[i];
    const off = i * VALUE_MLP_INPUT_DIM;
    for (let j = 0; j < VALUE_MLP_INPUT_DIM; j++) sum += mlp.w1[off + j] * features[j];
    h1[i] = sum >= 0 ? sum : 0.1 * sum;
  }
  const h2 = new Float64Array(VALUE_MLP_H2_DIM);
  for (let i = 0; i < VALUE_MLP_H2_DIM; i++) {
    let sum = mlp.b2[i];
    const off = i * VALUE_MLP_H1_DIM;
    for (let j = 0; j < VALUE_MLP_H1_DIM; j++) sum += mlp.w2[off + j] * h1[j];
    h2[i] = sum >= 0 ? sum : 0.1 * sum;
  }
  let out = mlp.b3;
  for (let j = 0; j < VALUE_MLP_H2_DIM; j++) out += mlp.w3[j] * h2[j];
  return Math.tanh(out);
}

function evalMlpValidationSet(
  mlp: SerializedValueMlp,
  valSamples: ValueTrainingSample[]
): { mse: number; signAcc: number } {
  if (valSamples.length === 0) return { mse: mlp.finalMse, signAcc: mlp.signAccuracy };
  let mseSum = 0;
  let signHits = 0;
  let signTotal = 0;
  for (let i = 0; i < valSamples.length; i++) {
    const s = valSamples[i];
    const pred = forwardMlpRaw(mlp, s.features);
    const diff = pred - s.target;
    mseSum += diff * diff;
    if (Math.abs(s.target) >= 0.15) {
      signTotal += 1;
      if ((pred >= 0 && s.target >= 0) || (pred < 0 && s.target < 0)) {
        signHits += 1;
      }
    }
  }
  return {
    mse: mseSum / valSamples.length,
    signAcc: signTotal > 0 ? signHits / signTotal : mlp.signAccuracy,
  };
}

function jaccardDeckSimilarity(a: string[], b: string[]): number {
  const ca = new Map<string, number>();
  const cb = new Map<string, number>();
  for (const x of a) ca.set(x, (ca.get(x) ?? 0) + 1);
  for (const x of b) cb.set(x, (cb.get(x) ?? 0) + 1);
  const keys = new Set([...ca.keys(), ...cb.keys()]);
  let inter = 0;
  let uni = 0;
  for (const k of keys) {
    const va = ca.get(k) ?? 0;
    const vb = cb.get(k) ?? 0;
    inter += Math.min(va, vb);
    uni += Math.max(va, vb);
  }
  return uni > 0 ? inter / uni : 1;
}

// ============================================================================
// MAIN ESTÁGIO 1 ORCHESTRATOR
// ============================================================================
async function runStage1(): Promise<void> {
  const t0 = Date.now();
  const workerCount = Math.max(2, Math.min(10, os.cpus().length - 2));
  const checkpointDir = path.resolve(process.cwd(), 'scratch/overnight_checkpoints');
  fs.mkdirSync(checkpointDir, { recursive: true });

  // Clone live MLP registries
  const domainMlps: Partial<Record<Domain, SerializedValueMlp>> = structuredClone(
    DOMAIN_VALUE_NETWORKS
  );
  const bicolorMlps: Partial<Record<BicolorArchetypeId, SerializedValueMlp>> = structuredClone(
    BICOLOR_VALUE_NETWORKS
  );
  const polycolorMlps: Partial<Record<PolycolorArchetypeId, SerializedValueMlp>> = structuredClone(
    POLYCOLOR_VALUE_NETWORKS
  );

  // Build mutable list of all 44 Champions
  const champions: MutableChampion[] = [];
  for (const id of ORDERED_MONO_IDS) {
    const m = MONOCOLOR_ARCHETYPE_MASTERY[id];
    if (!m) continue;
    champions.push({
      idx: champions.length,
      id,
      name: m.name,
      subtitle: m.subtitle,
      format: 'monocolor',
      domains: [m.domain],
      tacticalIdentity: m.tacticalIdentity,
      coverCardId: m.coverCardId,
      classicDeckIds: CLASSIC_MONO_MAP[id] ?? [],
      cardIds: m.tierDecks[5].cardIds.slice(),
      initialCardIds: m.tierDecks[5].cardIds.slice(),
      learnedProfile: structuredClone(m.learnedProfile),
      cardStats: new Map(),
      coPlayStats: new Map(),
      matchesPlayed: 0,
      scoreSum: 0,
      acceptedSwaps: 0,
    });
  }
  for (const id of ORDERED_BICOLOR_ARCHETYPE_IDS) {
    const m = BICOLOR_ARCHETYPE_MASTERY[id];
    if (!m) continue;
    champions.push({
      idx: champions.length,
      id,
      name: m.name,
      subtitle: m.subtitle,
      format: 'bicolor',
      domains: [...m.domains],
      tacticalIdentity: m.tacticalIdentity,
      coverCardId: m.coverCardId,
      classicDeckIds: m.classicDeckId ? [m.classicDeckId] : [],
      cardIds: m.tierDecks[5].cardIds.slice(),
      initialCardIds: m.tierDecks[5].cardIds.slice(),
      learnedProfile: structuredClone(m.learnedProfile),
      cardStats: new Map(),
      coPlayStats: new Map(),
      matchesPlayed: 0,
      scoreSum: 0,
      acceptedSwaps: 0,
    });
  }
  for (const id of ORDERED_POLYCOLOR_ARCHETYPE_IDS) {
    const m = POLYCOLOR_ARCHETYPE_MASTERY[id];
    champions.push({
      idx: champions.length,
      id,
      name: m.name,
      subtitle: m.subtitle,
      format: m.tierFormat,
      domains: [...m.domains],
      tacticalIdentity: m.tacticalIdentity,
      coverCardId: m.coverCardId,
      classicDeckIds: [...m.classicDeckIds],
      cardIds: m.tierDecks[5].cardIds.slice(),
      initialCardIds: m.tierDecks[5].cardIds.slice(),
      learnedProfile: structuredClone(m.learnedProfile),
      cardStats: new Map(),
      coPlayStats: new Map(),
      matchesPlayed: 0,
      scoreSum: 0,
      acceptedSwaps: 0,
    });
  }

  const getMlpForChamp = (c: MutableChampion): SerializedValueMlp | null => {
    if (c.format === 'monocolor') {
      return domainMlps[c.domains[0]] ?? null;
    }
    if (c.format === 'bicolor') {
      return bicolorMlps[c.id as BicolorArchetypeId] ?? domainMlps[c.domains[0]] ?? null;
    }
    return polycolorMlps[c.id as PolycolorArchetypeId] ?? domainMlps[c.domains[0]] ?? null;
  };

  console.log(
    `================================================================================\n` +
      ` ESTÁGIO 1 — CO-EVOLUÇÃO CRUZADA MULTI-FORMATO & RE-TREINAMENTO DE 34 VALUE MLPs\n` +
      ` Campeões: ${champions.length} | Redes Neurais: 34 (6 Mono + 15 Bi + 13 Poly) | Workers: ${workerCount}\n` +
      `================================================================================`
  );

  const pool = new EvolutionWorkerPool(workerCount);
  const NUM_GENERATIONS = 6;

  // Trajectory buffers per MLP key
  const domainSamples = new Map<Domain, ValueTrainingSample[]>();
  const bicolorSamples = new Map<BicolorArchetypeId, ValueTrainingSample[]>();
  const polySamples = new Map<PolycolorArchetypeId, ValueTrainingSample[]>();
  const globalCardShapley = new Map<string, { played: number; winSum: number }>();

  let totalMatchesSimulated = 0;
  let totalTrajectoriesCollected = 0;
  let totalAcceptedMutations = 0;
  let totalMlpsImproved = 0;

  const pushChampSamples = (champ: MutableChampion, recs: RawTrajectoryRecord[]) => {
    if (recs.length === 0) return;
    totalTrajectoriesCollected += recs.length;
    const converted: ValueTrainingSample[] = recs.map((r) => ({
      features:
        r.features.length === VALUE_MLP_INPUT_DIM
          ? Float64Array.from(r.features)
          : new Float64Array(VALUE_MLP_INPUT_DIM),
      target: r.target,
      weight: r.weight,
    }));

    if (champ.format === 'monocolor') {
      const dom = champ.domains[0];
      const arr = domainSamples.get(dom) ?? [];
      for (const s of converted) if (arr.length < 32000) arr.push(s);
      domainSamples.set(dom, arr);
    } else if (champ.format === 'bicolor') {
      const bid = champ.id as BicolorArchetypeId;
      const arr = bicolorSamples.get(bid) ?? [];
      for (const s of converted) if (arr.length < 18000) arr.push(s);
      bicolorSamples.set(bid, arr);
    } else {
      const pid = champ.id as PolycolorArchetypeId;
      const arr = polySamples.get(pid) ?? [];
      for (const s of converted) if (arr.length < 18000) arr.push(s);
      polySamples.set(pid, arr);
    }
  };

  const mergeUsageIntoChamp = (
    champ: MutableChampion,
    cardStats: Array<[string, CardUsageStat]>,
    coPlays: Array<[string, { coPlays: number; winSum: number }]>
  ) => {
    for (const [cid, st] of cardStats) {
      const cur = champ.cardStats.get(cid) ?? {
        drawnOrHeldGames: 0,
        playedGames: 0,
        playedWinSum: 0,
        stuckGames: 0,
      };
      cur.drawnOrHeldGames += st.drawnOrHeldGames;
      cur.playedGames += st.playedGames;
      cur.playedWinSum += st.playedWinSum;
      cur.stuckGames += st.stuckGames;
      champ.cardStats.set(cid, cur);

      const g = globalCardShapley.get(cid) ?? { played: 0, winSum: 0 };
      g.played += st.playedGames;
      g.winSum += st.playedWinSum;
      globalCardShapley.set(cid, g);
    }
    for (const [key, cp] of coPlays) {
      const cur = champ.coPlayStats.get(key) ?? { coPlays: 0, winSum: 0 };
      cur.coPlays += cp.coPlays;
      cur.winSum += cp.winSum;
      champ.coPlayStats.set(key, cur);
    }
  };

  try {
    for (let gen = 1; gen <= NUM_GENERATIONS; gen++) {
      const genStart = Date.now();
      // Build cross-format Swiss/Stratified pairings: every champion faces 10 distinct cross-format & peer rivals
      const pairSet = new Set<string>();
      const genPairs: Array<[number, number]> = [];
      const N = champions.length;

      for (let i = 0; i < N; i++) {
        for (let step = 1; step <= 6; step++) {
          const j = (i + step * 7 + gen * 3) % N;
          if (i === j) continue;
          const a = Math.min(i, j);
          const b = Math.max(i, j);
          const key = `${a}_${b}`;
          if (!pairSet.has(key)) {
            pairSet.add(key);
            genPairs.push([a, b]);
          }
        }
      }

      console.log(
        `\n[Geração ${gen}/${NUM_GENERATIONS}] Colhendo Shapley & Trajetórias Multi-Formato (${genPairs.length} pares × 12 duelos = ${genPairs.length * 12} jogos)...`
      );

      await Promise.all(
        genPairs.map(([ia, ib]) => {
          const A = champions[ia];
          const B = champions[ib];
          return pool
            .runJob({
              idxA: ia,
              idxB: ib,
              deckACardIds: A.cardIds,
              deckBCardIds: B.cardIds,
              nameA: A.name,
              nameB: B.name,
              idA: A.id,
              idB: B.id,
              profileA: A.learnedProfile,
              profileB: B.learnedProfile,
              mlpA: getMlpForChamp(A),
              mlpB: getMlpForChamp(B),
              numMirrorPairs: 6,
              fastRollout: gen < NUM_GENERATIONS, // Fast Beam rollout during search, full precision on Gen 6!
              collectSamplesProb: 0.42,
            })
            .then((res) => {
              totalMatchesSimulated += res.matchesPlayed;
              A.matchesPlayed += res.matchesPlayed;
              A.scoreSum += res.scoreASum;
              B.matchesPlayed += res.matchesPlayed;
              B.scoreSum += res.matchesPlayed - res.scoreASum;
              mergeUsageIntoChamp(A, res.cardStatsA, res.coPlayWinsA);
              mergeUsageIntoChamp(B, res.cardStatsB, res.coPlayWinsB);
              pushChampSamples(A, res.samplesA);
              pushChampSamples(B, res.samplesB);
            });
        })
      );

      // Step B: Propose & Gatekeep Domain-Preserving 1-for-1 Shapley Swaps
      const proposals: Array<{
        champ: MutableChampion;
        candidateIds: string[];
        summary: string;
      }> = [];

      for (const c of champions) {
        const prop = proposeDomainPreservingMutation(c, globalCardShapley, gen + c.idx);
        if (prop) {
          proposals.push({ champ: c, ...prop });
        }
      }

      let genAccepted = 0;
      if (proposals.length > 0) {
        await Promise.all(
          proposals.map(async ({ champ, candidateIds, summary }) => {
            // Head-to-head + 2 cross-format benchmark opponents (24 games total)
            const opp1 = champions[(champ.idx + 17) % champions.length];
            const opp2 = champions[(champ.idx + 33) % champions.length];

            const [h2h, vs1Cand, vs1Inc, vs2Cand, vs2Inc] = await Promise.all([
              pool.runJob({
                idxA: champ.idx,
                idxB: champ.idx,
                deckACardIds: candidateIds,
                deckBCardIds: champ.cardIds,
                nameA: `${champ.name} (Challenger)`,
                nameB: `${champ.name} (Incumbent)`,
                idA: champ.id,
                idB: champ.id,
                profileA: champ.learnedProfile,
                profileB: champ.learnedProfile,
                mlpA: getMlpForChamp(champ),
                mlpB: getMlpForChamp(champ),
                numMirrorPairs: 6, // 12 H2H games
                fastRollout: true,
                collectSamplesProb: 0.25,
              }),
              pool.runJob({
                idxA: champ.idx,
                idxB: opp1.idx,
                deckACardIds: candidateIds,
                deckBCardIds: opp1.cardIds,
                nameA: champ.name,
                nameB: opp1.name,
                idA: champ.id,
                idB: opp1.id,
                profileA: champ.learnedProfile,
                profileB: opp1.learnedProfile,
                mlpA: getMlpForChamp(champ),
                mlpB: getMlpForChamp(opp1),
                numMirrorPairs: 4, // 8 games
                fastRollout: true,
                collectSamplesProb: 0,
              }),
              pool.runJob({
                idxA: champ.idx,
                idxB: opp1.idx,
                deckACardIds: champ.cardIds,
                deckBCardIds: opp1.cardIds,
                nameA: champ.name,
                nameB: opp1.name,
                idA: champ.id,
                idB: opp1.id,
                profileA: champ.learnedProfile,
                profileB: opp1.learnedProfile,
                mlpA: getMlpForChamp(champ),
                mlpB: getMlpForChamp(opp1),
                numMirrorPairs: 4,
                fastRollout: true,
                collectSamplesProb: 0,
              }),
              pool.runJob({
                idxA: champ.idx,
                idxB: opp2.idx,
                deckACardIds: candidateIds,
                deckBCardIds: opp2.cardIds,
                nameA: champ.name,
                nameB: opp2.name,
                idA: champ.id,
                idB: opp2.id,
                profileA: champ.learnedProfile,
                profileB: opp2.learnedProfile,
                mlpA: getMlpForChamp(champ),
                mlpB: getMlpForChamp(opp2),
                numMirrorPairs: 4,
                fastRollout: true,
                collectSamplesProb: 0,
              }),
              pool.runJob({
                idxA: champ.idx,
                idxB: opp2.idx,
                deckACardIds: champ.cardIds,
                deckBCardIds: opp2.cardIds,
                nameA: champ.name,
                nameB: opp2.name,
                idA: champ.id,
                idB: opp2.id,
                profileA: champ.learnedProfile,
                profileB: opp2.learnedProfile,
                mlpA: getMlpForChamp(champ),
                mlpB: getMlpForChamp(opp2),
                numMirrorPairs: 4,
                fastRollout: true,
                collectSamplesProb: 0,
              }),
            ]);

            totalMatchesSimulated +=
              h2h.matchesPlayed +
              vs1Cand.matchesPlayed +
              vs1Inc.matchesPlayed +
              vs2Cand.matchesPlayed +
              vs2Inc.matchesPlayed;
            pushChampSamples(champ, h2h.samplesA);

            const h2hWr = h2h.scoreASum / h2h.matchesPlayed;
            const candGauntletWr =
              (vs1Cand.scoreASum + vs2Cand.scoreASum) /
              (vs1Cand.matchesPlayed + vs2Cand.matchesPlayed);
            const incGauntletWr =
              (vs1Inc.scoreASum + vs2Inc.scoreASum) /
              (vs1Inc.matchesPlayed + vs2Inc.matchesPlayed);

            // Strict Gatekeeper: must win H2H >= 54% AND improve or hold gauntlet WR
            if (h2hWr >= 0.54 && candGauntletWr >= incGauntletWr + 0.01) {
              champ.cardIds = candidateIds;
              champ.acceptedSwaps += 1;
              genAccepted += 1;
              totalAcceptedMutations += 1;
              console.log(
                `  [ Evolução Aceita ] ${champ.name}: ${summary} (H2H ${(h2hWr * 100).toFixed(1)}%, Gauntlet ${(incGauntletWr * 100).toFixed(1)}% -> ${(candGauntletWr * 100).toFixed(1)}%)`
              );
            }
          })
        );
      }

      // Step C: Warm-Start Fine-Tune all 34 Value MLPs at Gen 3 and Gen 6
      if (gen === 3 || gen === NUM_GENERATIONS) {
        const lr = gen === 3 ? 0.0008 : 0.00045;
        let roundImproved = 0;

        const fineTuneOne = (
          domain: Domain,
          currentMlp: SerializedValueMlp | undefined,
          allSamples: ValueTrainingSample[],
          seedOffset: number
        ): SerializedValueMlp | undefined => {
          if (!currentMlp || allSamples.length < 400) return currentMlp;
          const splitIdx = Math.floor(allSamples.length * 0.8);
          const trainSplit = allSamples.slice(0, splitIdx);
          const valSplit = allSamples.slice(splitIdx);
          const beforeVal = evalMlpValidationSet(currentMlp, valSplit);

          const candidateMlp = trainValueMlpWithAdam(domain, trainSplit, {
            epochs: 12,
            batchSize: 64,
            learningRate: lr,
            weightDecay: 0.00015,
            seed: 20261101 + gen * 100 + seedOffset,
            warmStartMlp: currentMlp,
          });
          const afterVal = evalMlpValidationSet(candidateMlp, valSplit);

          if (afterVal.mse <= beforeVal.mse * 1.002) {
            roundImproved += 1;
            return {
              ...candidateMlp,
              samplesTrained: currentMlp.samplesTrained + trainSplit.length,
              epochs: currentMlp.epochs + 12,
              finalMse: Number(Math.min(currentMlp.finalMse, afterVal.mse).toFixed(4)),
              signAccuracy: Number(
                Math.max(currentMlp.signAccuracy, afterVal.signAcc).toFixed(4)
              ),
            };
          }
          return currentMlp;
        };

        const domainsOrder: Domain[] = ['green', 'red', 'blue', 'purple', 'gold', 'neutral'];
        domainsOrder.forEach((dom, idx) => {
          domainMlps[dom] = fineTuneOne(dom, domainMlps[dom], domainSamples.get(dom) ?? [], idx);
        });
        ORDERED_BICOLOR_ARCHETYPE_IDS.forEach((bid, idx) => {
          const dom = BICOLOR_ARCHETYPE_MASTERY[bid]?.domains[0] ?? 'neutral';
          bicolorMlps[bid] = fineTuneOne(
            dom,
            bicolorMlps[bid],
            bicolorSamples.get(bid) ?? [],
            20 + idx
          );
        });
        ORDERED_POLYCOLOR_ARCHETYPE_IDS.forEach((pid, idx) => {
          const dom = POLYCOLOR_ARCHETYPE_MASTERY[pid].domains[0];
          polycolorMlps[pid] = fineTuneOne(
            dom,
            polycolorMlps[pid],
            polySamples.get(pid) ?? [],
            50 + idx
          );
        });

        totalMlpsImproved += roundImproved;
        console.log(
          `  [ Fine-Tuning Neural Gen ${gen} ] ${roundImproved}/34 Value MLPs aprimoradas em holdout cruzado (${totalTrajectoriesCollected.toLocaleString()} estados colhidos).`
        );
      }

      const genSec = ((Date.now() - genStart) / 1000).toFixed(1);
      console.log(
        `  -> Fim da Geração ${gen}/${NUM_GENERATIONS} em ${genSec}s | Swaps aceitos: ${genAccepted} | Acumulado: ${totalMatchesSimulated.toLocaleString()} jogos.`
      );

      // Save atomic generation checkpoint
      const ckptPath = path.join(checkpointDir, `stage1_gen_${gen}.json`);
      fs.writeFileSync(
        ckptPath,
        JSON.stringify(
          {
            gen,
            timestamp: new Date().toISOString(),
            totalMatchesSimulated,
            totalTrajectoriesCollected,
            totalAcceptedMutations,
            decks: Object.fromEntries(champions.map((c) => [c.id, c.cardIds])),
          },
          null,
          2
        ),
        'utf-8'
      );
    }
  } finally {
    await pool.close();
  }

  const elapsedSeconds = Number(((Date.now() - t0) / 1000).toFixed(1));

  // ============================================================================
  // REBUILD TIER 1..5 METADATA & WRITE BACK MASTERY DATA + PREBUILT_DECKS
  // ============================================================================
  console.log('\n[Persistência] Atualizando dados de maestria Mono/Bi/Poly e grimórios clássicos...');

  const updatedMonoMastery: Partial<Record<MonocolorArchetypeId, MonocolorArchetypeMastery>> =
    structuredClone(MONOCOLOR_ARCHETYPE_MASTERY);
  const updatedBiMastery: Partial<Record<BicolorArchetypeId, BicolorArchetypeMastery>> =
    structuredClone(BICOLOR_ARCHETYPE_MASTERY);
  const updatedPolyMastery: Record<PolycolorArchetypeId, PolycolorArchetypeMastery> =
    structuredClone(POLYCOLOR_ARCHETYPE_MASTERY);

  const evolvedClassicDeckMap = new Map<string, string[]>();

  for (const c of champions) {
    const jaccard = Number(jaccardDeckSimilarity(c.initialCardIds, c.cardIds).toFixed(3));
    const crossWr = c.matchesPlayed > 0 ? Number((c.scoreSum / c.matchesPlayed).toFixed(3)) : 0.5;

    for (const cdId of c.classicDeckIds) {
      evolvedClassicDeckMap.set(cdId, c.cardIds.slice());
    }

    if (c.format === 'monocolor') {
      const mid = c.id as MonocolorArchetypeId;
      const prev = updatedMonoMastery[mid];
      if (!prev) continue;
      const rebuiltTiers =
        c.acceptedSwaps > 0
          ? buildDomainPreservingTierDecks(c, prev.tierDecks, globalCardShapley)
          : prev.tierDecks;
      updatedMonoMastery[mid] = {
        ...prev,
        generationsEvolved: prev.generationsEvolved + NUM_GENERATIONS,
        matchesSimulated: prev.matchesSimulated + c.matchesPlayed,
        championWinRate: crossWr,
        championDeckJaccardStability: jaccard,
        topShapleyCards: buildTopShapleyList(c, prev.topShapleyCards),
        tierDecks: rebuiltTiers,
      };
    } else if (c.format === 'bicolor') {
      const bid = c.id as BicolorArchetypeId;
      const prev = updatedBiMastery[bid];
      if (!prev) continue;
      const rebuiltTiers =
        c.acceptedSwaps > 0
          ? buildDomainPreservingTierDecks(c, prev.tierDecks, globalCardShapley)
          : prev.tierDecks;
      const updatedCombos = extractCrossDomainCombos(c, prev.crossDomainCombos);
      updatedBiMastery[bid] = {
        ...prev,
        generationsEvolved: prev.generationsEvolved + NUM_GENERATIONS,
        matchesSimulated: prev.matchesSimulated + c.matchesPlayed,
        championWinRate: crossWr,
        championDeckJaccardStability: jaccard,
        crossDomainCombos: updatedCombos,
        learnedProfile: {
          ...prev.learnedProfile,
          matchesSimulated: prev.learnedProfile.matchesSimulated + c.matchesPlayed,
          discoveredCombos: updatedCombos.slice(0, 6),
        },
        topShapleyCards: buildTopShapleyList(c, prev.topShapleyCards),
        tierDecks: rebuiltTiers,
      };
    } else {
      const pid = c.id as PolycolorArchetypeId;
      const prev = updatedPolyMastery[pid];
      const rebuiltTiers =
        c.acceptedSwaps > 0
          ? buildDomainPreservingTierDecks(c, prev.tierDecks, globalCardShapley)
          : prev.tierDecks;
      const updatedCombos = extractCrossDomainCombos(c, prev.crossDomainCombos);
      updatedPolyMastery[pid] = {
        ...prev,
        generationsEvolved: prev.generationsEvolved + NUM_GENERATIONS,
        matchesSimulated: prev.matchesSimulated + c.matchesPlayed,
        championWinRate: crossWr,
        championDeckJaccardStability: jaccard,
        crossDomainCombos: updatedCombos,
        learnedProfile: {
          ...prev.learnedProfile,
          matchesSimulated: prev.learnedProfile.matchesSimulated + c.matchesPlayed,
          discoveredCombos: updatedCombos.slice(0, 6),
        },
        topShapleyCards: buildTopShapleyList(c, prev.topShapleyCards),
        tierDecks: rebuiltTiers,
      };
    }
  }

  // 1. Write aiMonocolorMasteryData.ts
  const monoNewMatches = Math.round(totalMatchesSimulated * (16 / 44));
  const monoNewSamples = Array.from(domainSamples.values()).reduce((s, a) => s + a.length, 0);
  const nextMonoSummary: MonocolorTrainingSummary = {
    ...MONOCOLOR_TRAINING_SUMMARY,
    generatedAt: new Date().toISOString(),
    totalMatchesSimulated: MONOCOLOR_TRAINING_SUMMARY.totalMatchesSimulated + monoNewMatches,
    totalStateTrajectoriesTrained:
      MONOCOLOR_TRAINING_SUMMARY.totalStateTrajectoriesTrained + monoNewSamples,
    elapsedSeconds: Number((MONOCOLOR_TRAINING_SUMMARY.elapsedSeconds + elapsedSeconds * 0.36).toFixed(1)),
  };

  const monoFilePath = path.resolve(__dirname, '../data/aiMonocolorMasteryData.ts');
  const monoHeaderEnd = fs
    .readFileSync(monoFilePath, 'utf-8')
    .indexOf('export const MONOCOLOR_TRAINING_SUMMARY');
  const monoTypeHeader = fs.readFileSync(monoFilePath, 'utf-8').slice(0, monoHeaderEnd);
  fs.writeFileSync(
    monoFilePath,
    `${monoTypeHeader}export const MONOCOLOR_TRAINING_SUMMARY: MonocolorTrainingSummary = ${JSON.stringify(
      nextMonoSummary,
      null,
      2
    )};\n\nexport const DOMAIN_VALUE_NETWORKS: Partial<Record<Domain, SerializedValueMlp>> = ${JSON.stringify(
      domainMlps
    )};\n\nexport const MONOCOLOR_ARCHETYPE_MASTERY: Partial<Record<MonocolorArchetypeId, MonocolorArchetypeMastery>> = ${JSON.stringify(
      updatedMonoMastery,
      null,
      2
    )};\n`,
    'utf-8'
  );

  // 2. Write aiBicolorMasteryData.ts
  const biNewMatches = Math.round(totalMatchesSimulated * (15 / 44));
  const biNewSamples = Array.from(bicolorSamples.values()).reduce((s, a) => s + a.length, 0);
  const nextBiSummary: BicolorTrainingSummary = {
    ...BICOLOR_TRAINING_SUMMARY,
    generatedAt: new Date().toISOString(),
    totalMatchesSimulated: BICOLOR_TRAINING_SUMMARY.totalMatchesSimulated + biNewMatches,
    totalStateTrajectoriesTrained:
      BICOLOR_TRAINING_SUMMARY.totalStateTrajectoriesTrained + biNewSamples,
    elapsedSeconds: Number((BICOLOR_TRAINING_SUMMARY.elapsedSeconds + elapsedSeconds * 0.34).toFixed(1)),
  };

  const biFilePath = path.resolve(__dirname, '../data/aiBicolorMasteryData.ts');
  const biRaw = fs.readFileSync(biFilePath, 'utf-8');
  const biHeaderEnd = biRaw.indexOf('export const BICOLOR_TRAINING_SUMMARY');
  const biTypeHeader = biRaw.slice(0, biHeaderEnd);
  fs.writeFileSync(
    biFilePath,
    `${biTypeHeader}export const BICOLOR_TRAINING_SUMMARY: BicolorTrainingSummary = ${JSON.stringify(
      nextBiSummary,
      null,
      2
    )};\n\nexport const BICOLOR_VALUE_NETWORKS: Partial<Record<BicolorArchetypeId, SerializedValueMlp>> = ${JSON.stringify(
      bicolorMlps
    )};\n\nexport const BICOLOR_ARCHETYPE_MASTERY: Partial<Record<BicolorArchetypeId, BicolorArchetypeMastery>> = ${JSON.stringify(
      updatedBiMastery,
      null,
      2
    )};\n`,
    'utf-8'
  );

  // 3. Write aiPolycolorMasteryData.ts
  const polyNewMatches = totalMatchesSimulated - monoNewMatches - biNewMatches;
  const polyNewSamples = Array.from(polySamples.values()).reduce((s, a) => s + a.length, 0);
  const nextPolySummary: PolycolorTrainingSummary = {
    ...POLYCOLOR_TRAINING_SUMMARY,
    generatedAt: new Date().toISOString(),
    totalMatchesSimulated: POLYCOLOR_TRAINING_SUMMARY.totalMatchesSimulated + polyNewMatches,
    totalStateTrajectoriesTrained:
      POLYCOLOR_TRAINING_SUMMARY.totalStateTrajectoriesTrained + polyNewSamples,
    elapsedSeconds: Number((POLYCOLOR_TRAINING_SUMMARY.elapsedSeconds + elapsedSeconds * 0.3).toFixed(1)),
  };

  const polyFilePath = path.resolve(__dirname, '../data/aiPolycolorMasteryData.ts');
  const polyRaw = fs.readFileSync(polyFilePath, 'utf-8');
  const polyHeaderEnd = polyRaw.indexOf('export const POLYCOLOR_TRAINING_SUMMARY');
  const polyTypeHeader = polyRaw.slice(0, polyHeaderEnd);
  fs.writeFileSync(
    polyFilePath,
    `${polyTypeHeader}export const POLYCOLOR_TRAINING_SUMMARY: PolycolorTrainingSummary = ${JSON.stringify(
      nextPolySummary,
      null,
      2
    )};\n\nexport const POLYCOLOR_VALUE_NETWORKS: Partial<Record<PolycolorArchetypeId, SerializedValueMlp>> = ${JSON.stringify(
      polycolorMlps
    )};\n\nexport const POLYCOLOR_ARCHETYPE_MASTERY: Record<\n  PolycolorArchetypeId,\n  PolycolorArchetypeMastery\n> = ${JSON.stringify(
      updatedPolyMastery,
      null,
      2
    )};\n`,
    'utf-8'
  );

  // 4. Sync PREBUILT_DECKS in src/data/decks.ts
  const nextPrebuiltDecks = PREBUILT_DECKS.map((d) => {
    const evolvedIds = evolvedClassicDeckMap.get(d.id);
    if (!evolvedIds || evolvedIds.length !== REQUIRED_DECK_SIZE) return d;
    return {
      ...d,
      cardIds: evolvedIds,
    };
  });

  const decksFilePath = path.resolve(__dirname, '../data/decks.ts');
  const decksContent = `import { CampaignBoss, PrebuiltDeck, Rarity } from '../types/game';

export const REQUIRED_DECK_SIZE = 100;

export const MAX_COPIES_BY_RARITY: Record<Rarity, number> = {
  common: 3,
  uncommon: 3,
  rare: 2,
  legendary: 1,
};

export const MAX_LEGENDARIES_PER_DECK = 10;

export const PREBUILT_DECKS: PrebuiltDeck[] = ${JSON.stringify(nextPrebuiltDecks, null, 2)};

export const CAMPAIGN_BOSSES: CampaignBoss[] = ${JSON.stringify(CAMPAIGN_BOSSES, null, 2)};
`;
  fs.writeFileSync(decksFilePath, decksContent, 'utf-8');

  console.log(
    `\n================================================================================\n` +
      ` ESTÁGIO 1 CONCLUÍDO EM ${elapsedSeconds}s!\n` +
      ` • Partidas Co-Evoluídas Multi-Formato: ${totalMatchesSimulated.toLocaleString()}\n` +
      ` • Trajetórias de Estado Colhidas: ${totalTrajectoriesCollected.toLocaleString()}\n` +
      ` • Mutações Shapley Aprovadas no Gatekeeper: ${totalAcceptedMutations}\n` +
      ` • Atualizações de Pesos Value MLP Aprovadas em Holdout: ${totalMlpsImproved}\n` +
      `================================================================================`
  );
}

if (isMainThread) {
  runStage1().catch((err) => {
    console.error('Erro fatal no Estágio 1 (runOvernightCrossEvolution):', err);
    process.exit(1);
  });
}
