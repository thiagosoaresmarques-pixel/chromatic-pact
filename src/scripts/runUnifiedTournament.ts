import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { isMainThread, parentPort, Worker } from 'node:worker_threads';
import { CARDS_BY_ID } from '../data/cards';
import type { DeckLearnedAiProfile } from '../data/aiLearnedProfiles';
import {
  DOMAIN_VALUE_NETWORKS,
  MONOCOLOR_ARCHETYPE_MASTERY,
  MonocolorArchetypeId,
} from '../data/aiMonocolorMasteryData';
import {
  BICOLOR_ARCHETYPE_MASTERY,
  BICOLOR_VALUE_NETWORKS,
  BicolorArchetypeId,
  ORDERED_BICOLOR_ARCHETYPE_IDS,
} from '../data/aiBicolorMastery';
import {
  ORDERED_POLYCOLOR_ARCHETYPE_IDS,
  POLYCOLOR_ARCHETYPE_MASTERY,
  POLYCOLOR_VALUE_NETWORKS,
  PolycolorArchetypeId,
} from '../data/aiPolycolorMastery';
import {
  AiProfileOverrides,
  chooseMulliganIndicesForActor,
  executeTurnStepForActor,
} from '../engine/aiEngine';
import type { SerializedValueMlp } from '../engine/aiValueNetwork';
import {
  createInitialGameState,
  getAllBoardUnits,
  mulliganCards,
} from '../engine/gameEngine';
import { AiSkillTier, CardDefinition, Domain } from '../types/game';

export type UnifiedFormatKind = 'monocolor' | 'bicolor' | 'tricolor' | 'pentachromatic';
export type UnifiedChampionId =
  | MonocolorArchetypeId
  | BicolorArchetypeId
  | PolycolorArchetypeId;

interface WorkerPairJobRequest {
  jobId: number;
  idxA: number;
  idxB: number;
  deckACardIds: string[];
  deckBCardIds: string[];
  nameA: string;
  nameB: string;
  deckIdA: string;
  deckIdB: string;
  domainA: Domain;
  domainB: Domain;
  profileA: DeckLearnedAiProfile;
  profileB: DeckLearnedAiProfile;
  mlpA: SerializedValueMlp | null;
  mlpB: SerializedValueMlp | null;
  numMirrorPairs: number;
}

interface CardPlayMiniStat {
  playedGames: number;
  scoreSum: number;
}

interface WorkerPairJobResponse {
  jobId: number;
  idxA: number;
  idxB: number;
  matchesPlayed: number;
  pairCount: number;
  scoreASum: number;
  pairMeans: number[];
  cardPlaysA: Array<[string, CardPlayMiniStat]>;
  cardPlaysB: Array<[string, CardPlayMiniStat]>;
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

function simulateSingleBeamDuel(
  playerDeckCards: CardDefinition[],
  aiDeckCards: CardDefinition[],
  namePlayer: string,
  nameAi: string,
  deckIdPlayer: string,
  deckIdAi: string,
  overrides: AiProfileOverrides,
  playedPOut: Set<string>,
  playedAOut: Set<string>
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

  const maxTurns = 34;
  let guardSteps = 0;

  while (state.phase !== 'gameover' && state.turn <= maxTurns && guardSteps < 900) {
    guardSteps += 1;
    const active = state.activePlayer;
    const prevHandP = state.player.hand;
    const prevChanP = state.player.channeledCards.length;
    const prevHandA = state.ai.hand;
    const prevChanA = state.ai.channeledCards.length;

    const step = executeTurnStepForActor(state, active, overrides);
    const next = step.nextState;

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

  if (state.phase === 'gameover' && state.winner === 'player') return 1;
  if (state.phase === 'gameover' && state.winner === 'ai') return 0;

  const pBoard = getAllBoardUnits(state.player).reduce(
    (s, u) => s + u.currentAtk + u.currentHp,
    0
  );
  const aBoard = getAllBoardUnits(state.ai).reduce(
    (s, u) => s + u.currentAtk + u.currentHp,
    0
  );
  const adv = state.player.hp - state.ai.hp + (pBoard - aBoard) * 0.4;
  return clamp(0.5 + adv / 60, 0.15, 0.85);
}

// ============================================================================
// WORKER THREAD ENTRYPOINT
// ============================================================================
if (!isMainThread && parentPort) {
  parentPort.on('message', (req: WorkerPairJobRequest) => {
    const cardsA = resolveDeckDefinitions(req.deckACardIds);
    const cardsB = resolveDeckDefinitions(req.deckBCardIds);
    const cardStatsA = new Map<string, CardPlayMiniStat>();
    const cardStatsB = new Map<string, CardPlayMiniStat>();

    const addPlayed = (map: Map<string, CardPlayMiniStat>, set: Set<string>, score: number) => {
      for (const cid of set) {
        let st = map.get(cid);
        if (!st) {
          st = { playedGames: 0, scoreSum: 0 };
          map.set(cid, st);
        }
        st.playedGames += 1;
        st.scoreSum += score;
      }
    };

    let scoreASum = 0;
    const pairMeans: number[] = [];

    for (let k = 0; k < req.numMirrorPairs; k++) {
      const pSet1 = new Set<string>();
      const aSet1 = new Set<string>();
      const s1 = simulateSingleBeamDuel(
        cardsA,
        cardsB,
        req.nameA,
        req.nameB,
        req.deckIdA,
        req.deckIdB,
        {
          player: req.profileA,
          ai: req.profileB,
          playerSkillTier: 5,
          aiSkillTier: 5,
          playerValueMlp: req.mlpA,
          aiValueMlp: req.mlpB,
          fastRollout: false,
        },
        pSet1,
        aSet1
      );
      addPlayed(cardStatsA, pSet1, s1);
      addPlayed(cardStatsB, aSet1, 1 - s1);

      const pSet2 = new Set<string>();
      const aSet2 = new Set<string>();
      const s2B = simulateSingleBeamDuel(
        cardsB,
        cardsA,
        req.nameB,
        req.nameA,
        req.deckIdB,
        req.deckIdA,
        {
          player: req.profileB,
          ai: req.profileA,
          playerSkillTier: 5,
          aiSkillTier: 5,
          playerValueMlp: req.mlpB,
          aiValueMlp: req.mlpA,
          fastRollout: false,
        },
        pSet2,
        aSet2
      );
      const s2A = 1 - s2B;
      addPlayed(cardStatsB, pSet2, s2B);
      addPlayed(cardStatsA, aSet2, s2A);

      scoreASum += s1 + s2A;
      pairMeans.push(0.5 * (s1 + s2A));
    }

    const res: WorkerPairJobResponse = {
      jobId: req.jobId,
      idxA: req.idxA,
      idxB: req.idxB,
      matchesPlayed: req.numMirrorPairs * 2,
      pairCount: req.numMirrorPairs,
      scoreASum,
      pairMeans,
      cardPlaysA: Array.from(cardStatsA.entries()),
      cardPlaysB: Array.from(cardStatsB.entries()),
    };
    parentPort!.postMessage(res);
  });
}

class TournamentWorkerPool {
  private workers: Worker[] = [];
  private idleWorkers: Worker[] = [];
  private queue: Array<{
    req: WorkerPairJobRequest;
    resolve: (res: WorkerPairJobResponse) => void;
    reject: (err: Error) => void;
  }> = [];
  private inFlight = new Map<
    number,
    { resolve: (res: WorkerPairJobResponse) => void; reject: (err: Error) => void }
  >();
  private nextJobId = 1;

  constructor(readonly size: number) {
    const workerUrl = new URL(import.meta.url);
    for (let i = 0; i < size; i++) {
      const w = new Worker(workerUrl, { execArgv: ['--import', 'tsx'] });
      w.on('message', (msg: WorkerPairJobResponse) => {
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

  runJob(req: Omit<WorkerPairJobRequest, 'jobId'>): Promise<WorkerPairJobResponse> {
    const jobId = this.nextJobId++;
    const fullReq: WorkerPairJobRequest = { ...req, jobId };
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
// MAIN TOURNAMENT ORCHESTRATOR
// ============================================================================
interface ChampionEntry {
  id: UnifiedChampionId;
  name: string;
  subtitle: string;
  format: UnifiedFormatKind;
  domains: Domain[];
  coverCardId: string;
  classicDeckIds: string[];
  cardIds: string[];
  learnedProfile: DeckLearnedAiProfile;
  mlp: SerializedValueMlp | null;
}

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

const PATCHED_36_CARD_IDS = [
  'neutral_10_valkyra_pentacromatica',
  'red_76_salamandra_vapor',
  'red_55_diabrete_forja',
  'red_109_diabrete_fornalha',
  'neutral_88_espada_voadora_runica',
  'neutral_52_mercenario_planar',
  'gold_32_estandarte_imperial',
  'gold_04_armadura_conjurada',
  'gold_02_gargula',
  'gold_157_dragao_soberano_alvorada',
  'blue_153_leviata_fenda_abissal',
  'green_68_zaratan_ilha',
  'red_167_arauto_prisma_chama',
  'blue_167_arauto_prisma_gelo',
  'purple_167_arauto_prisma_abismo',
  'green_167_arauto_prisma_selva',
  'gold_167_arauto_prisma_sol',
  'neutral_167_arauto_prisma_matriz',
  'blue_44_dragao_prateado',
  'gold_05_automato_guardiao',
  'purple_19_conde_vampiro',
  'purple_23_dracolich',
  'purple_96_abominacao_costurada',
  'purple_97_arquidemonio_sombras',
  'green_75_druida_ciclos',
  'neutral_35_colosso_adamantina',
  'neutral_172_armada_draconica_matriz',
  'purple_07_lich',
  'blue_171_pactuario_elemental_gelo',
  'blue_168_tecelao_feixe_gelo',
  'purple_20_tecelao_profano',
  'blue_17_bruxa_mar',
  'neutral_106_reen_assassino_relojoeiro',
  'neutral_168_tecelao_feixe_matriz',
  'green_46_ent_anciao',
  'green_116_ent_espinheiro_anciao',
];

function buildAll44Champions(): ChampionEntry[] {
  const list: ChampionEntry[] = [];

  for (const id of ORDERED_MONO_IDS) {
    const m = MONOCOLOR_ARCHETYPE_MASTERY[id];
    if (!m) continue;
    list.push({
      id,
      name: m.name,
      subtitle: m.subtitle,
      format: 'monocolor',
      domains: [m.domain],
      coverCardId: m.coverCardId,
      classicDeckIds: CLASSIC_MONO_MAP[id] ?? [],
      cardIds: m.tierDecks[5].cardIds,
      learnedProfile: m.learnedProfile,
      mlp: DOMAIN_VALUE_NETWORKS[m.domain] ?? null,
    });
  }

  for (const id of ORDERED_BICOLOR_ARCHETYPE_IDS) {
    const m = BICOLOR_ARCHETYPE_MASTERY[id];
    if (!m) continue;
    list.push({
      id,
      name: m.name,
      subtitle: m.subtitle,
      format: 'bicolor',
      domains: m.domains,
      coverCardId: m.coverCardId,
      classicDeckIds: m.classicDeckId ? [m.classicDeckId] : [],
      cardIds: m.tierDecks[5].cardIds,
      learnedProfile: m.learnedProfile,
      mlp: BICOLOR_VALUE_NETWORKS[id] ?? DOMAIN_VALUE_NETWORKS[m.domains[0]] ?? null,
    });
  }

  for (const id of ORDERED_POLYCOLOR_ARCHETYPE_IDS) {
    const m = POLYCOLOR_ARCHETYPE_MASTERY[id];
    if (!m) continue;
    list.push({
      id,
      name: m.name,
      subtitle: m.subtitle,
      format: m.tierFormat,
      domains: m.domains,
      coverCardId: m.coverCardId,
      classicDeckIds: m.classicDeckIds ?? [],
      cardIds: m.tierDecks[5].cardIds,
      learnedProfile: m.learnedProfile,
      mlp: POLYCOLOR_VALUE_NETWORKS[id] ?? DOMAIN_VALUE_NETWORKS[m.domains[0]] ?? null,
    });
  }

  return list;
}

async function runMain(): Promise<void> {
  const t0 = Date.now();
  const numWorkers = Math.max(2, Math.min(10, os.cpus().length - 2));
  const champions = buildAll44Champions();
  const N = champions.length; // 44

  console.log(
    `================================================================================\n` +
      ` GRANDE TORNEIO UNIFICADO DE VAELORIA — ${N} × ${N - 1} CAMPEÕES TIER V\n` +
      ` Workers: ${numWorkers} | Formatos: 16 Mono + 15 Bicolor + 10 Tricolor + 3 Penta\n` +
      `================================================================================`
  );

  const pool = new TournamentWorkerPool(numWorkers);

  // Pairwise accumulators (oriented i < j: pairMeans[i][j] holds score of i vs j in [0,1])
  const pairMeansByCell: number[][][] = Array.from({ length: N }, () =>
    Array.from({ length: N }, () => [])
  );
  const gamesByCell: number[][] = Array.from({ length: N }, () => new Array<number>(N).fill(0));
  const scoreSumByCell: number[][] = Array.from({ length: N }, () => new Array<number>(N).fill(0));
  const globalCardStats = new Map<string, CardPlayMiniStat>();

  let totalMatchesSimulated = 0;

  const absorbResponse = (res: WorkerPairJobResponse) => {
    const { idxA, idxB, matchesPlayed, scoreASum, pairMeans, cardPlaysA, cardPlaysB } = res;
    totalMatchesSimulated += matchesPlayed;
    gamesByCell[idxA][idxB] += matchesPlayed;
    gamesByCell[idxB][idxA] += matchesPlayed;
    scoreSumByCell[idxA][idxB] += scoreASum;
    scoreSumByCell[idxB][idxA] += matchesPlayed - scoreASum;
    for (const pm of pairMeans) {
      pairMeansByCell[idxA][idxB].push(pm);
      pairMeansByCell[idxB][idxA].push(1 - pm);
    }
    for (const [cid, st] of cardPlaysA) {
      const cur = globalCardStats.get(cid) ?? { playedGames: 0, scoreSum: 0 };
      cur.playedGames += st.playedGames;
      cur.scoreSum += st.scoreSum;
      globalCardStats.set(cid, cur);
    }
    for (const [cid, st] of cardPlaysB) {
      const cur = globalCardStats.get(cid) ?? { playedGames: 0, scoreSum: 0 };
      cur.playedGames += st.playedGames;
      cur.scoreSum += st.scoreSum;
      globalCardStats.set(cid, cur);
    }
  };

  const computeChampionStats = (idx: number) => {
    const allPairMeans: number[] = [];
    let totalGames = 0;
    let totalScore = 0;
    for (let j = 0; j < N; j++) {
      if (j === idx) continue;
      totalGames += gamesByCell[idx][j];
      totalScore += scoreSumByCell[idx][j];
      for (const pm of pairMeansByCell[idx][j]) allPairMeans.push(pm);
    }
    const wr = totalGames > 0 ? totalScore / totalGames : 0.5;
    const K = allPairMeans.length;
    if (K <= 1) return { wr, ci95: 0.5, games: totalGames };
    let varSum = 0;
    for (const x of allPairMeans) {
      const d = x - wr;
      varSum += d * d;
    }
    const sampleVar = varSum / (K - 1);
    const ci95 = 1.96 * Math.sqrt(sampleVar / K);
    return { wr, ci95, games: totalGames };
  };

  // Wave 1: 6 mirror pairs (12 full Beam Search games) for all 946 unordered pairs = 11,352 games
  const BASE_MIRROR_PAIRS = 6;
  console.log(
    `\n[Onda 1] Simulando todos os ${(N * (N - 1)) / 2} pares (${BASE_MIRROR_PAIRS * 2} jogos Beam Search/par = ${((N * (N - 1)) / 2) * BASE_MIRROR_PAIRS * 2} duelos)...`
  );

  const wave1Promises: Promise<void>[] = [];
  let completedJobs = 0;
  const totalWave1Jobs = (N * (N - 1)) / 2;

  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      const A = champions[i];
      const B = champions[j];
      const p = pool
        .runJob({
          idxA: i,
          idxB: j,
          deckACardIds: A.cardIds,
          deckBCardIds: B.cardIds,
          nameA: A.name,
          nameB: B.name,
          deckIdA: A.id,
          deckIdB: B.id,
          domainA: A.domains[0],
          domainB: B.domains[0],
          profileA: A.learnedProfile,
          profileB: B.learnedProfile,
          mlpA: A.mlp,
          mlpB: B.mlp,
          numMirrorPairs: BASE_MIRROR_PAIRS,
        })
        .then((res) => {
          absorbResponse(res);
          completedJobs += 1;
          if (completedJobs % 100 === 0 || completedJobs === totalWave1Jobs) {
            const sec = ((Date.now() - t0) / 1000).toFixed(1);
            console.log(
              `  -> Progresso Onda 1: ${completedJobs}/${totalWave1Jobs} pares (${totalMatchesSimulated} duelos em ${sec}s)`
            );
          }
        });
      wave1Promises.push(p);
    }
  }
  await Promise.all(wave1Promises);

  // Adaptive Waves until max IC 95% across all 44 Champions <= ±3.00%
  const TARGET_CI95 = 0.03;
  for (let wave = 2; wave <= 6; wave++) {
    const needMore = new Set<number>();
    let maxCi = 0;
    for (let i = 0; i < N; i++) {
      const { ci95 } = computeChampionStats(i);
      if (ci95 > maxCi) maxCi = ci95;
      if (ci95 > TARGET_CI95) needMore.add(i);
    }
    console.log(
      `[Auditoria Estatística Pós-Onda ${wave - 1}] Max IC 95% Global = ±${(maxCi * 100).toFixed(2)}% | Campeões > ±3.00%: ${needMore.size}/${N}`
    );
    if (needMore.size === 0) break;

    const pairsToRun: Array<[number, number]> = [];
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        if (needMore.has(i) || needMore.has(j)) {
          pairsToRun.push([i, j]);
        }
      }
    }
    console.log(
      `[Onda Adaptativa ${wave}] Refinando ${pairsToRun.length} pares (+4 duelos espelhados/par = +${pairsToRun.length * 4} duelos)...`
    );
    await Promise.all(
      pairsToRun.map(([i, j]) => {
        const A = champions[i];
        const B = champions[j];
        return pool
          .runJob({
            idxA: i,
            idxB: j,
            deckACardIds: A.cardIds,
            deckBCardIds: B.cardIds,
            nameA: A.name,
            nameB: B.name,
            deckIdA: A.id,
            deckIdB: B.id,
            domainA: A.domains[0],
            domainB: B.domains[0],
            profileA: A.learnedProfile,
            profileB: B.learnedProfile,
            mlpA: A.mlp,
            mlpB: B.mlp,
            numMirrorPairs: 2,
          })
          .then(absorbResponse);
      })
    );
  }

  await pool.close();
  const elapsedSeconds = Number(((Date.now() - t0) / 1000).toFixed(1));

  // Build Format Ecology Matrix (4 x 4)
  const formats: UnifiedFormatKind[] = ['monocolor', 'bicolor', 'tricolor', 'pentachromatic'];
  const formatScoreSum: Record<UnifiedFormatKind, Record<UnifiedFormatKind, number>> = {
    monocolor: { monocolor: 0, bicolor: 0, tricolor: 0, pentachromatic: 0 },
    bicolor: { monocolor: 0, bicolor: 0, tricolor: 0, pentachromatic: 0 },
    tricolor: { monocolor: 0, bicolor: 0, tricolor: 0, pentachromatic: 0 },
    pentachromatic: { monocolor: 0, bicolor: 0, tricolor: 0, pentachromatic: 0 },
  };
  const formatGameSum: Record<UnifiedFormatKind, Record<UnifiedFormatKind, number>> = {
    monocolor: { monocolor: 0, bicolor: 0, tricolor: 0, pentachromatic: 0 },
    bicolor: { monocolor: 0, bicolor: 0, tricolor: 0, pentachromatic: 0 },
    tricolor: { monocolor: 0, bicolor: 0, tricolor: 0, pentachromatic: 0 },
    pentachromatic: { monocolor: 0, bicolor: 0, tricolor: 0, pentachromatic: 0 },
  };

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (i === j) continue;
      const fi = champions[i].format;
      const fj = champions[j].format;
      formatScoreSum[fi][fj] += scoreSumByCell[i][j];
      formatGameSum[fi][fj] += gamesByCell[i][j];
    }
  }

  const formatEcologyMatrix: Record<
    UnifiedFormatKind,
    {
      overallWinRate: number;
      totalGames: number;
      vsFormat: Record<UnifiedFormatKind, number>;
    }
  > = {} as never;

  for (const fi of formats) {
    let totS = 0;
    let totG = 0;
    const vsFormat: Record<UnifiedFormatKind, number> = {
      monocolor: 0.5,
      bicolor: 0.5,
      tricolor: 0.5,
      pentachromatic: 0.5,
    };
    for (const fj of formats) {
      totS += formatScoreSum[fi][fj];
      totG += formatGameSum[fi][fj];
      vsFormat[fj] =
        formatGameSum[fi][fj] > 0
          ? Number((formatScoreSum[fi][fj] / formatGameSum[fi][fj]).toFixed(4))
          : 0.5;
    }
    formatEcologyMatrix[fi] = {
      overallWinRate: totG > 0 ? Number((totS / totG).toFixed(4)) : 0.5,
      totalGames: totG,
      vsFormat,
    };
  }

  // Build Matchup Matrix & Standings
  const matchupMatrix: Record<string, Record<string, number>> = {};
  for (let i = 0; i < N; i++) {
    const idA = champions[i].id;
    matchupMatrix[idA] = {};
    for (let j = 0; j < N; j++) {
      if (i === j) {
        matchupMatrix[idA][idA] = 0.5;
      } else {
        const wr =
          gamesByCell[i][j] > 0 ? scoreSumByCell[i][j] / gamesByCell[i][j] : 0.5;
        matchupMatrix[idA][champions[j].id] = Number(wr.toFixed(4));
      }
    }
  }

  let maxChampionCi95 = 0;
  const rawStandings = champions.map((c, idx) => {
    const { wr, ci95, games } = computeChampionStats(idx);
    if (ci95 > maxChampionCi95) maxChampionCi95 = ci95;

    const vsFormatWinRates: Record<UnifiedFormatKind, number> = {
      monocolor: 0.5,
      bicolor: 0.5,
      tricolor: 0.5,
      pentachromatic: 0.5,
    };
    for (const fj of formats) {
      let s = 0;
      let g = 0;
      for (let j = 0; j < N; j++) {
        if (j === idx || champions[j].format !== fj) continue;
        s += scoreSumByCell[idx][j];
        g += gamesByCell[idx][j];
      }
      vsFormatWinRates[fj] = g > 0 ? Number((s / g).toFixed(4)) : 0.5;
    }

    const oppRows: Array<{ opponentId: UnifiedChampionId; winRate: number; games: number }> = [];
    for (let j = 0; j < N; j++) {
      if (j === idx) continue;
      oppRows.push({
        opponentId: champions[j].id,
        winRate: matchupMatrix[c.id][champions[j].id],
        games: gamesByCell[idx][j],
      });
    }
    oppRows.sort((a, b) => b.winRate - a.winRate);

    const tierBadge: 'S' | 'A' | 'B' =
      wr >= 0.555 ? 'S' : wr >= 0.445 ? 'A' : 'B';

    return {
      rank: 0,
      archetypeId: c.id,
      name: c.name,
      subtitle: c.subtitle,
      format: c.format,
      domains: c.domains,
      coverCardId: c.coverCardId,
      classicDeckIds: c.classicDeckIds,
      tierBadge,
      overallWinRate: Number(wr.toFixed(4)),
      ci95HalfWidth: Number(ci95.toFixed(4)),
      matchesPlayed: games,
      vsFormatWinRates,
      bestMatchups: oppRows.slice(0, 5),
      worstMatchups: oppRows.slice(-5).reverse(),
    };
  });

  rawStandings.sort((a, b) => b.overallWinRate - a.overallWinRate);
  rawStandings.forEach((st, idx) => {
    st.rank = idx + 1;
  });

  const tierCounts = { S: 0, A: 0, B: 0 };
  for (const st of rawStandings) tierCounts[st.tierBadge] += 1;

  const patchedCardsAudit = PATCHED_36_CARD_IDS.map((cid) => {
    const c = CARDS_BY_ID[cid];
    const st = globalCardStats.get(cid);
    const playedGames = st?.playedGames ?? 0;
    const playedWinRate =
      playedGames > 0 ? Number((st!.scoreSum / playedGames).toFixed(4)) : 0.5;
    return {
      cardId: cid,
      cardName: c?.name ?? cid,
      domain: c?.domain ?? 'neutral',
      cost: c?.cost ?? 0,
      playedGames,
      playedWinRate,
    };
  });

  const summaryObj = {
    generatedAt: new Date().toISOString(),
    totalChampions: N,
    totalUnorderedPairs: (N * (N - 1)) / 2,
    totalMatchesSimulated,
    numWorkers,
    elapsedSeconds,
    maxChampionCi95HalfWidth: Number(maxChampionCi95.toFixed(4)),
    convergedByMargin: maxChampionCi95 <= TARGET_CI95 + 0.0005,
    tierCounts,
    formatEcologyMatrix,
    patchedCardsAudit,
  };

  console.log('\n=== TOP 15 RANKING GLOBAL UNIFICADO (44 CAMPEÕES TIER V) ===');
  for (const st of rawStandings.slice(0, 15)) {
    console.log(
      `#${String(st.rank).padStart(2)} [${st.tierBadge}] ${st.archetypeId.padEnd(28)} (${st.format.slice(0, 5).padEnd(5)}) | ` +
        `WR=${(st.overallWinRate * 100).toFixed(1)}% (±${(st.ci95HalfWidth * 100).toFixed(2)}%, n=${st.matchesPlayed}) | ` +
        `vsMono=${(st.vsFormatWinRates.monocolor * 100).toFixed(0)}% vsBi=${(st.vsFormatWinRates.bicolor * 100).toFixed(0)}% vsTri=${(st.vsFormatWinRates.tricolor * 100).toFixed(0)}%`
    );
  }

  console.log('\n=== BOTTOM 10 RANKING GLOBAL UNIFICADO ===');
  for (const st of rawStandings.slice(-10)) {
    console.log(
      `#${String(st.rank).padStart(2)} [${st.tierBadge}] ${st.archetypeId.padEnd(28)} (${st.format.slice(0, 5).padEnd(5)}) | ` +
        `WR=${(st.overallWinRate * 100).toFixed(1)}% (±${(st.ci95HalfWidth * 100).toFixed(2)}%, n=${st.matchesPlayed}) | ` +
        `vsMono=${(st.vsFormatWinRates.monocolor * 100).toFixed(0)}% vsBi=${(st.vsFormatWinRates.bicolor * 100).toFixed(0)}% vsTri=${(st.vsFormatWinRates.tricolor * 100).toFixed(0)}%`
    );
  }

  console.log('\n=== ECOLOGIA PÓS-PATCH ENTRE OS 4 FORMATOS ===');
  for (const f of formats) {
    const row = formatEcologyMatrix[f];
    console.log(
      `  ${f.padEnd(15)} | Global=${(row.overallWinRate * 100).toFixed(1)}% | ` +
        `vsMono=${(row.vsFormat.monocolor * 100).toFixed(1)}% | vsBi=${(row.vsFormat.bicolor * 100).toFixed(1)}% | ` +
        `vsTri=${(row.vsFormat.tricolor * 100).toFixed(1)}% | vsPenta=${(row.vsFormat.pentachromatic * 100).toFixed(1)}%`
    );
  }

  console.log('\n=== AUDITORIA PÓS-PATCH DAS CARTAS CALIBRADAS (COM AMOSTRA NO TORNEIO) ===');
  for (const pc of patchedCardsAudit.filter((x) => x.playedGames >= 15)) {
    console.log(
      `  ${pc.cardId.padEnd(36)} | ${pc.cost}⚡ | WR=${(pc.playedWinRate * 100).toFixed(1)}% (n=${pc.playedGames})`
    );
  }

  const outPath = path.resolve(process.cwd(), 'src/data/aiUnifiedTournamentData.ts');
  const fileContents = `import { Domain } from '../types/game';
import type { MonocolorArchetypeId } from './aiMonocolorMasteryData';
import type { BicolorArchetypeId } from './aiBicolorMasteryData';
import type { PolycolorArchetypeId } from './aiPolycolorMasteryData';

/**
 * GERADO AUTOMATICAMENTE POR src/scripts/runUnifiedTournament.ts (npm run tournament:unified)
 * Grande Torneio Unificado de Vaeloria (44 × 43 Campeões Tier V): ${totalMatchesSimulated} duelos Beam Search (${elapsedSeconds}s em ${numWorkers} threads)
 * Margem de Erro Máxima IC 95% por Campeão: ±${(maxChampionCi95 * 100).toFixed(2)}%
 */

export type UnifiedFormatKind = 'monocolor' | 'bicolor' | 'tricolor' | 'pentachromatic';
export type UnifiedChampionId =
  | MonocolorArchetypeId
  | BicolorArchetypeId
  | PolycolorArchetypeId;

export interface UnifiedMatchupSnippet {
  opponentId: UnifiedChampionId;
  winRate: number;
  games: number;
}

export interface UnifiedChampionStanding {
  rank: number;
  archetypeId: UnifiedChampionId;
  name: string;
  subtitle: string;
  format: UnifiedFormatKind;
  domains: Domain[];
  coverCardId: string;
  classicDeckIds: string[];
  tierBadge: 'S' | 'A' | 'B';
  overallWinRate: number;
  ci95HalfWidth: number;
  matchesPlayed: number;
  vsFormatWinRates: Record<UnifiedFormatKind, number>;
  bestMatchups: UnifiedMatchupSnippet[];
  worstMatchups: UnifiedMatchupSnippet[];
}

export interface PatchedCardTournamentMetric {
  cardId: string;
  cardName: string;
  domain: Domain;
  cost: number;
  playedGames: number;
  playedWinRate: number;
}

export interface UnifiedTournamentSummary {
  generatedAt: string;
  totalChampions: number;
  totalUnorderedPairs: number;
  totalMatchesSimulated: number;
  numWorkers: number;
  elapsedSeconds: number;
  maxChampionCi95HalfWidth: number;
  convergedByMargin: boolean;
  tierCounts: { S: number; A: number; B: number };
  formatEcologyMatrix: Record<
    UnifiedFormatKind,
    {
      overallWinRate: number;
      totalGames: number;
      vsFormat: Record<UnifiedFormatKind, number>;
    }
  >;
  patchedCardsAudit: PatchedCardTournamentMetric[];
}

export const UNIFIED_TOURNAMENT_SUMMARY: UnifiedTournamentSummary = ${JSON.stringify(
    summaryObj,
    null,
    2
  )};

export const UNIFIED_CHAMPION_STANDINGS: UnifiedChampionStanding[] = ${JSON.stringify(
    rawStandings,
    null,
    2
  )};

export const UNIFIED_MATCHUP_MATRIX: Record<UnifiedChampionId, Record<UnifiedChampionId, number>> = ${JSON.stringify(
    matchupMatrix,
    null,
    2
  )};
`;

  fs.writeFileSync(outPath, fileContents, 'utf8');
  console.log(`\nExportado com sucesso para: ${outPath}`);
}

if (isMainThread) {
  runMain().catch((err) => {
    console.error('Erro fatal em runUnifiedTournament:', err);
    process.exit(1);
  });
}
