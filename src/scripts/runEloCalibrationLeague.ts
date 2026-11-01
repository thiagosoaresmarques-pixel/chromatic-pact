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
} from '../data/aiBicolorMasteryData';
import { ORDERED_BICOLOR_ARCHETYPE_IDS } from '../data/aiBicolorMastery';
import {
  POLYCOLOR_ARCHETYPE_MASTERY,
  POLYCOLOR_VALUE_NETWORKS,
  PolycolorArchetypeId,
} from '../data/aiPolycolorMasteryData';
import { ORDERED_POLYCOLOR_ARCHETYPE_IDS } from '../data/aiPolycolorMastery';
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

interface CardPlayMiniStat {
  playedGames: number;
  scoreSum: number;
}

interface WorkerEloJobRequest {
  jobId: number;
  nodeA: number;
  nodeB: number;
  champIdxA: number;
  champIdxB: number;
  tierA: AiSkillTier;
  tierB: AiSkillTier;
  deckACardIds: string[];
  deckBCardIds: string[];
  nameA: string;
  nameB: string;
  deckIdA: string;
  deckIdB: string;
  profileA: DeckLearnedAiProfile;
  profileB: DeckLearnedAiProfile;
  mlpA: SerializedValueMlp | null;
  mlpB: SerializedValueMlp | null;
  numMirrorPairs: number;
  trackCards: boolean;
}

interface WorkerEloJobResponse {
  jobId: number;
  nodeA: number;
  nodeB: number;
  champIdxA: number;
  champIdxB: number;
  tierA: AiSkillTier;
  tierB: AiSkillTier;
  matchesPlayed: number;
  scoreASum: number;
  winsA: number;
  lossesA: number;
  draws: number;
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

function simulateMultiTierDuel(
  playerDeckCards: CardDefinition[],
  aiDeckCards: CardDefinition[],
  namePlayer: string,
  nameAi: string,
  deckIdPlayer: string,
  deckIdAi: string,
  tierP: AiSkillTier,
  tierA: AiSkillTier,
  overrides: AiProfileOverrides,
  trackCards: boolean,
  playedPOut: Set<string>,
  playedAOut: Set<string>
): { scoreP: number; terminalOutcome: 1 | 0 | 0.5 } {
  let state = createInitialGameState(playerDeckCards, aiDeckCards, {
    playerName: namePlayer,
    aiName: nameAi,
    playerDeckId: deckIdPlayer,
    aiDeckId: deckIdAi,
    playerSkillTier: tierP,
    aiSkillTier: tierA,
  });

  const pSwap = chooseMulliganIndicesForActor(state, 'player', overrides.player, tierP);
  state = mulliganCards(state, 'player', pSwap);
  const aSwap = chooseMulliganIndicesForActor(state, 'ai', overrides.ai, tierA);
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

    if (trackCards) {
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
    }

    state = next;
  }

  if (state.phase === 'gameover' && state.winner === 'player') {
    return { scoreP: 1, terminalOutcome: 1 };
  }
  if (state.phase === 'gameover' && state.winner === 'ai') {
    return { scoreP: 0, terminalOutcome: 0 };
  }

  const pBoard = getAllBoardUnits(state.player).reduce(
    (s, u) => s + u.currentAtk + u.currentHp,
    0
  );
  const aBoard = getAllBoardUnits(state.ai).reduce(
    (s, u) => s + u.currentAtk + u.currentHp,
    0
  );
  const adv = state.player.hp - state.ai.hp + (pBoard - aBoard) * 0.4;
  const s = clamp(0.5 + adv / 60, 0.15, 0.85);
  return { scoreP: s, terminalOutcome: s > 0.55 ? 1 : s < 0.45 ? 0 : 0.5 };
}

// ============================================================================
// WORKER THREAD ENTRYPOINT
// ============================================================================
if (!isMainThread && parentPort) {
  parentPort.on('message', (req: WorkerEloJobRequest) => {
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
    let winsA = 0;
    let lossesA = 0;
    let draws = 0;
    const pairMeans: number[] = [];

    for (let k = 0; k < req.numMirrorPairs; k++) {
      const pSet1 = new Set<string>();
      const aSet1 = new Set<string>();
      const r1 = simulateMultiTierDuel(
        cardsA,
        cardsB,
        req.nameA,
        req.nameB,
        req.deckIdA,
        req.deckIdB,
        req.tierA,
        req.tierB,
        {
          player: req.profileA,
          ai: req.profileB,
          playerSkillTier: req.tierA,
          aiSkillTier: req.tierB,
          playerValueMlp: req.tierA >= 3 ? req.mlpA : null,
          aiValueMlp: req.tierB >= 3 ? req.mlpB : null,
          fastRollout: false,
        },
        req.trackCards,
        pSet1,
        aSet1
      );
      if (req.trackCards) {
        addPlayed(cardStatsA, pSet1, r1.scoreP);
        addPlayed(cardStatsB, aSet1, 1 - r1.scoreP);
      }
      if (r1.terminalOutcome === 1) winsA += 1;
      else if (r1.terminalOutcome === 0) lossesA += 1;
      else draws += 1;

      const pSet2 = new Set<string>();
      const aSet2 = new Set<string>();
      const r2B = simulateMultiTierDuel(
        cardsB,
        cardsA,
        req.nameB,
        req.nameA,
        req.deckIdB,
        req.deckIdA,
        req.tierB,
        req.tierA,
        {
          player: req.profileB,
          ai: req.profileA,
          playerSkillTier: req.tierB,
          aiSkillTier: req.tierA,
          playerValueMlp: req.tierB >= 3 ? req.mlpB : null,
          aiValueMlp: req.tierA >= 3 ? req.mlpA : null,
          fastRollout: false,
        },
        req.trackCards,
        pSet2,
        aSet2
      );
      const s2A = 1 - r2B.scoreP;
      if (req.trackCards) {
        addPlayed(cardStatsB, pSet2, r2B.scoreP);
        addPlayed(cardStatsA, aSet2, s2A);
      }
      if (r2B.terminalOutcome === 0) winsA += 1;
      else if (r2B.terminalOutcome === 1) lossesA += 1;
      else draws += 1;

      scoreASum += r1.scoreP + s2A;
      pairMeans.push(0.5 * (r1.scoreP + s2A));
    }

    const res: WorkerEloJobResponse = {
      jobId: req.jobId,
      nodeA: req.nodeA,
      nodeB: req.nodeB,
      champIdxA: req.champIdxA,
      champIdxB: req.champIdxB,
      tierA: req.tierA,
      tierB: req.tierB,
      matchesPlayed: req.numMirrorPairs * 2,
      scoreASum,
      winsA,
      lossesA,
      draws,
      pairMeans,
      cardPlaysA: Array.from(cardStatsA.entries()),
      cardPlaysB: Array.from(cardStatsB.entries()),
    };
    parentPort!.postMessage(res);
  });
}

class EloWorkerPool {
  private workers: Worker[] = [];
  private idleWorkers: Worker[] = [];
  private queue: Array<{
    req: WorkerEloJobRequest;
    resolve: (res: WorkerEloJobResponse) => void;
    reject: (err: Error) => void;
  }> = [];
  private inFlight = new Map<
    number,
    { resolve: (res: WorkerEloJobResponse) => void; reject: (err: Error) => void }
  >();
  private nextJobId = 1;

  constructor(readonly size: number) {
    const workerUrl = new URL(import.meta.url);
    for (let i = 0; i < size; i++) {
      const w = new Worker(workerUrl, { execArgv: ['--import', 'tsx'] });
      w.on('message', (msg: WorkerEloJobResponse) => {
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

  runJob(req: Omit<WorkerEloJobRequest, 'jobId'>): Promise<WorkerEloJobResponse> {
    const jobId = this.nextJobId++;
    const fullReq: WorkerEloJobRequest = { ...req, jobId };
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
// NAMED SOVEREIGNS LORE IDENTITIES FOR ALL 44 VAELORIA CHAMPIONS
// ============================================================================
const SOVEREIGN_LORE_BY_ARCHETYPE: Record<
  UnifiedChampionId,
  { sovereignName: string; sovereignTitle: string; realmOrigin: string }
> = {
  mono_green_swarm: {
    sovereignName: 'Sylvara Garra-Folha',
    sovereignTitle: 'Matriarca da Alcateia de Galhada Viva',
    realmOrigin: 'Veridia',
  },
  mono_green_colossus: {
    sovereignName: 'Thornak Casca-Titã',
    sovereignTitle: 'Senhor dos Behemoths Primordiais',
    realmOrigin: 'Veridia',
  },
  mono_green_roots: {
    sovereignName: 'Yggdran, o Ancião Verdejante',
    sovereignTitle: 'Guardião das Raízes do Mundo',
    realmOrigin: 'Veridia',
  },
  mono_red_blitz: {
    sovereignName: 'Kael Ignis-Voraz',
    sovereignTitle: 'Marechal das Legiões de Cinza',
    realmOrigin: 'Pyros',
  },
  mono_red_pyroclasm: {
    sovereignName: 'Pyraxxia Vulcano',
    sovereignTitle: 'Arquimaga do Cataclismo Rubro',
    realmOrigin: 'Pyros',
  },
  mono_red_dragon: {
    sovereignName: 'Ignarion Escama-Solar',
    sovereignTitle: 'Imperador Dracônico de Vulcanor',
    realmOrigin: 'Pyros',
  },
  mono_blue_frost: {
    sovereignName: 'Glacius Véu-de-Inverno',
    sovereignTitle: 'Regente da Cidadela Boreal',
    realmOrigin: 'Vórtex',
  },
  mono_blue_chrono: {
    sovereignName: 'Aetherion Relojoeiro-Astral',
    sovereignTitle: 'Oráculo da Singularidade de Cristália',
    realmOrigin: 'Vórtex',
  },
  mono_blue_abyssal: {
    sovereignName: 'Nereida Maré-Profunda',
    sovereignTitle: 'Soberana das Fendas Abissais',
    realmOrigin: 'Vórtex',
  },
  mono_purple_crypt: {
    sovereignName: 'Malakor Rei-Lich',
    sovereignTitle: 'Senhor Supremo do Ossuário de Nocturnus',
    realmOrigin: 'Eclipse',
  },
  mono_purple_blood: {
    sovereignName: 'Vladmir Sangue-Nobre',
    sovereignTitle: 'Príncipe Carmesim do Eclipse',
    realmOrigin: 'Eclipse',
  },
  mono_purple_umbral: {
    sovereignName: 'Nyxia Lâmina-do-Vazio',
    sovereignTitle: 'Sussurro Letal da Catedral Umbral',
    realmOrigin: 'Eclipse',
  },
  mono_gold_phalanx: {
    sovereignName: 'Aurelius Escudo-Dourado',
    sovereignTitle: 'Alto-Comandante de Aethelgard',
    realmOrigin: 'Solária',
  },
  mono_gold_celestial: {
    sovereignName: 'Seraphina Luz-Eterna',
    sovereignTitle: 'Arcanja do Zênite Radiante',
    realmOrigin: 'Solária',
  },
  mono_gold_judgment: {
    sovereignName: 'Valerius Martelo-Real',
    sovereignTitle: 'Grão-Juiz das Relíquias Solares',
    realmOrigin: 'Solária',
  },
  mono_neutral_axial: {
    sovereignName: 'Gorgonoth Matriz-Viva',
    sovereignTitle: 'Arquiteto Primordial da Torre Axial',
    realmOrigin: 'Cidade Franca Axial',
  },
  dual_red_gold: {
    sovereignName: 'Helios Forja-Ardente',
    sovereignTitle: ' Cruzado da Alvorada Vulcânica',
    realmOrigin: 'Aliança Pyros-Solária',
  },
  dual_blue_purple: {
    sovereignName: 'Morpheus Nebulosa-Negra',
    sovereignTitle: 'Tecelão dos Pesadelos Astrais',
    realmOrigin: 'Aliança Vórtex-Eclipse',
  },
  dual_red_green: {
    sovereignName: 'Ragnar Presa-de-Brasa',
    sovereignTitle: 'Cacique da Selva Incandescente',
    realmOrigin: 'Aliança Pyros-Veridia',
  },
  dual_blue_gold: {
    sovereignName: 'Orion Astrolábio-Real',
    sovereignTitle: 'Chanceler da Ordem Cristalina',
    realmOrigin: 'Aliança Vórtex-Solária',
  },
  dual_purple_green: {
    sovereignName: 'Nyxarion Esporo-Negro',
    sovereignTitle: 'Arconte do Pântano Imortal',
    realmOrigin: 'Aliança Eclipse-Veridia',
  },
  dual_red_purple: {
    sovereignName: 'Carmilla Lua-Sangrenta',
    sovereignTitle: 'Marquesa do Pacto Abissal-Rubro',
    realmOrigin: 'Aliança Pyros-Eclipse',
  },
  dual_blue_green: {
    sovereignName: 'Thalassa Maré-Silvestre',
    sovereignTitle: 'Xamã das Correntes Esmeraldas',
    realmOrigin: 'Aliança Vórtex-Veridia',
  },
  dual_green_gold: {
    sovereignName: 'Elowen Coroa-de-Carvalho',
    sovereignTitle: 'Rainha-Druida dos Bosques Solares',
    realmOrigin: 'Aliança Veridia-Solária',
  },
  dual_purple_gold: {
    sovereignName: 'Inquisidor Vane Sol-Negro',
    sovereignTitle: 'Pontífice do Crepúsculo Dourado',
    realmOrigin: 'Aliança Eclipse-Solária',
  },
  dual_red_blue: {
    sovereignName: 'Zephyrus Trovão-Rubro',
    sovereignTitle: 'Mestre da Tempestade Piro-Rúnica',
    realmOrigin: 'Aliança Pyros-Vórtex',
  },
  dual_green_neutral: {
    sovereignName: 'Briar Colosso-de-Aço',
    sovereignTitle: 'Guardião Simbiótico da Fronteira',
    realmOrigin: 'Pacto Veridia-Axial',
  },
  dual_red_neutral: {
    sovereignName: 'Kaelen Mercúrio-Rubro',
    sovereignTitle: 'Grão-Artilheiro da Fornalha Axial',
    realmOrigin: 'Pacto Pyros-Axial',
  },
  dual_blue_neutral: {
    sovereignName: 'Caelum Engrenagem-Fria',
    sovereignTitle: 'Soberano Cronomante da Matriz',
    realmOrigin: 'Pacto Vórtex-Axial',
  },
  dual_purple_neutral: {
    sovereignName: 'Reen Lâmina-Relojoeira',
    sovereignTitle: 'Executor Silencioso da Cidade Franca',
    realmOrigin: 'Pacto Eclipse-Axial',
  },
  dual_gold_neutral: {
    sovereignName: 'Cassius Bastião-de-Adamantina',
    sovereignTitle: 'Protetor Imortal do Trono Franco',
    realmOrigin: 'Pacto Solária-Axial',
  },
  tri_red_blue_purple: {
    sovereignName: 'Azazel Estrela-Caída',
    sovereignTitle: 'Imperador da Tríade do Cataclismo',
    realmOrigin: 'Tríade Pyros-Vórtex-Eclipse',
  },
  tri_red_green_gold: {
    sovereignName: 'Drakonis Sol-Selvagem',
    sovereignTitle: 'Soberano dos Titãs da Alvorada',
    realmOrigin: 'Tríade Pyros-Veridia-Solária',
  },
  tri_blue_purple_gold: {
    sovereignName: 'Arcturus Juízo-Eterno',
    sovereignTitle: 'Supremo Magistrado do Conclave Tríplice',
    realmOrigin: 'Tríade Vórtex-Eclipse-Solária',
  },
  tri_red_purple_green: {
    sovereignName: 'Morgath Carnificina-Viva',
    sovereignTitle: 'Senhor da Ruína Predatória',
    realmOrigin: 'Tríade Pyros-Eclipse-Veridia',
  },
  tri_blue_green_gold: {
    sovereignName: 'Lyra Horizonte-Celeste',
    sovereignTitle: 'Oráculo da Harmonia Ascendente',
    realmOrigin: 'Tríade Vórtex-Veridia-Solária',
  },
  tri_blue_purple_green: {
    sovereignName: 'Vorlag Abismo-Esmeralda',
    sovereignTitle: ' Patriarca da Ressurreição Cíclica',
    realmOrigin: 'Tríade Vórtex-Eclipse-Veridia',
  },
  tri_red_purple_gold: {
    sovereignName: 'Bellatrix Trono-de-Cinzas',
    sovereignTitle: 'Imperatriz do Sangue e Fogo Sagrado',
    realmOrigin: 'Tríade Pyros-Eclipse-Solária',
  },
  tri_purple_green_gold: {
    sovereignName: 'Solarius Raiz-Imortal',
    sovereignTitle: 'Hierofante da Cidadela Perene',
    realmOrigin: 'Tríade Eclipse-Veridia-Solária',
  },
  tri_red_blue_green: {
    sovereignName: 'Tempestus Fúria-Elemental',
    sovereignTitle: 'Arauto do Vórtice Primordial',
    realmOrigin: 'Tríade Pyros-Vórtex-Veridia',
  },
  tri_red_blue_gold: {
    sovereignName: 'Vaelith Chama-Celeste',
    sovereignTitle: 'Grão-Soberano do Conclave Empíreo',
    realmOrigin: 'Tríade Pyros-Vórtex-Solária',
  },
  penta_prismatic_crater: {
    sovereignName: 'Tiamat-Vael Cratera-Viva',
    sovereignTitle: 'Progenitora Dracônica dos Cinco Sóis',
    realmOrigin: 'Cratera Prismática',
  },
  penta_free_city_sovereign: {
    sovereignName: 'Aethel-Vox Conselho-Supremo',
    sovereignTitle: 'Soberano Pentacromático da Cidade Franca',
    realmOrigin: 'Cidade Franca Axial',
  },
  penta_wheel_convergence: {
    sovereignName: 'Valkyra Roda-do-Destino',
    sovereignTitle: 'Imperatriz da Convergência Pentacromática',
    realmOrigin: 'Ápice da Roda',
  },
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

interface ChampionFullEntry {
  idx: number;
  id: UnifiedChampionId;
  name: string;
  subtitle: string;
  format: UnifiedFormatKind;
  domains: Domain[];
  coverCardId: string;
  classicDeckIds: string[];
  tierCardIds: Record<AiSkillTier, string[]>;
  learnedProfile: DeckLearnedAiProfile;
  mlp: SerializedValueMlp | null;
}

function buildAll44ChampionsMultiTier(): ChampionFullEntry[] {
  const list: ChampionFullEntry[] = [];

  for (const id of ORDERED_MONO_IDS) {
    const m = MONOCOLOR_ARCHETYPE_MASTERY[id];
    if (!m) continue;
    list.push({
      idx: list.length,
      id,
      name: m.name,
      subtitle: m.subtitle,
      format: 'monocolor',
      domains: [m.domain],
      coverCardId: m.coverCardId,
      classicDeckIds: CLASSIC_MONO_MAP[id] ?? [],
      tierCardIds: {
        1: m.tierDecks[1].cardIds,
        2: m.tierDecks[2].cardIds,
        3: m.tierDecks[3].cardIds,
        4: m.tierDecks[4].cardIds,
        5: m.tierDecks[5].cardIds,
      },
      learnedProfile: m.learnedProfile,
      mlp: DOMAIN_VALUE_NETWORKS[m.domain] ?? null,
    });
  }

  for (const id of ORDERED_BICOLOR_ARCHETYPE_IDS) {
    const m = BICOLOR_ARCHETYPE_MASTERY[id];
    if (!m) continue;
    list.push({
      idx: list.length,
      id,
      name: m.name,
      subtitle: m.subtitle,
      format: 'bicolor',
      domains: [...m.domains],
      coverCardId: m.coverCardId,
      classicDeckIds: m.classicDeckId ? [m.classicDeckId] : [],
      tierCardIds: {
        1: m.tierDecks[1].cardIds,
        2: m.tierDecks[2].cardIds,
        3: m.tierDecks[3].cardIds,
        4: m.tierDecks[4].cardIds,
        5: m.tierDecks[5].cardIds,
      },
      learnedProfile: m.learnedProfile,
      mlp: BICOLOR_VALUE_NETWORKS[id] ?? DOMAIN_VALUE_NETWORKS[m.domains[0]] ?? null,
    });
  }

  for (const id of ORDERED_POLYCOLOR_ARCHETYPE_IDS) {
    const m = POLYCOLOR_ARCHETYPE_MASTERY[id];
    if (!m) continue;
    list.push({
      idx: list.length,
      id,
      name: m.name,
      subtitle: m.subtitle,
      format: m.tierFormat,
      domains: [...m.domains],
      coverCardId: m.coverCardId,
      classicDeckIds: [...m.classicDeckIds],
      tierCardIds: {
        1: m.tierDecks[1].cardIds,
        2: m.tierDecks[2].cardIds,
        3: m.tierDecks[3].cardIds,
        4: m.tierDecks[4].cardIds,
        5: m.tierDecks[5].cardIds,
      },
      learnedProfile: m.learnedProfile,
      mlp: POLYCOLOR_VALUE_NETWORKS[id] ?? DOMAIN_VALUE_NETWORKS[m.domains[0]] ?? null,
    });
  }

  return list;
}

/**
 * Fits Maximum-Likelihood Bradley-Terry / FIDE ELO across M nodes via Zermelo-Newman MM
 * updates with mild Gaussian/Laplace prior, anchored so median(anchorIndices) === 1200.
 */
function solveBradleyTerryElo(
  numNodes: number,
  gamesMat: Float64Array[],
  scoreMat: Float64Array[],
  anchorIndices: number[],
  anchorTargetElo = 1200
): { elo: number[]; rd: number[]; logLikelihood: number; iterations: number } {
  // gamma_i > 0 where E_{ij} = gamma_i / (gamma_i + gamma_j), R_i = 400 * log10(gamma_i)
  const logGamma = new Float64Array(numNodes).fill(0);
  const nextLogGamma = new Float64Array(numNodes).fill(0);

  const maxIter = 450;
  let iter = 0;

  for (iter = 1; iter <= maxIter; iter++) {
    let maxStep = 0;
    for (let i = 0; i < numNodes; i++) {
      // Weak prior pulling gently toward local neighborhood / finite bounds
      let winSum = 0.35;
      let denomSum = 0;
      const gi = Math.exp(logGamma[i]);

      for (let j = 0; j < numNodes; j++) {
        if (i === j) continue;
        const nij = gamesMat[i][j];
        if (nij <= 0) continue;
        winSum += scoreMat[i][j];
        const gj = Math.exp(logGamma[j]);
        denomSum += nij / (gi + gj);
      }
      // Weak prior match against unit reference (gamma = 1)
      denomSum += 0.7 / (gi + 1);

      const updatedGi = denomSum > 0 ? winSum / denomSum : gi;
      const newLg = clamp(Math.log(Math.max(1e-6, updatedGi)), -8, 8);
      const step = Math.abs(newLg - logGamma[i]);
      if (step > maxStep) maxStep = step;
      nextLogGamma[i] = newLg;
    }

    // Center mean logGamma to 0 each step for numerical stability
    let meanLg = 0;
    for (let i = 0; i < numNodes; i++) meanLg += nextLogGamma[i];
    meanLg /= numNodes;
    for (let i = 0; i < numNodes; i++) {
      logGamma[i] = nextLogGamma[i] - meanLg;
    }

    if (maxStep < 1e-6) break;
  }

  const scale = 400 / Math.LN10;
  const rawElo = new Array<number>(numNodes);
  for (let i = 0; i < numNodes; i++) {
    rawElo[i] = logGamma[i] * scale;
  }

  // Anchor median of Tier II nodes to 1200 ELO
  const anchorVals = anchorIndices.map((idx) => rawElo[idx]).sort((a, b) => a - b);
  const medianRaw =
    anchorVals.length > 0 ? anchorVals[Math.floor(anchorVals.length / 2)] : 0;
  const shift = anchorTargetElo - medianRaw;

  const elo = rawElo.map((r) => Math.round(r + shift));

  // Compute diagonal Fisher Information Rating Deviation (RD in ELO points)
  const ln10Over400 = Math.LN10 / 400;
  const rd = new Array<number>(numNodes);
  let logLikelihood = 0;

  for (let i = 0; i < numNodes; i++) {
    let fisherDiag = 0.0005;
    for (let j = 0; j < numNodes; j++) {
      if (i === j) continue;
      const nij = gamesMat[i][j];
      if (nij <= 0) continue;
      const eij = 1 / (1 + Math.pow(10, (elo[j] - elo[i]) / 400));
      fisherDiag += nij * eij * (1 - eij) * ln10Over400 * ln10Over400;
      if (i < j) {
        const sij = scoreMat[i][j];
        logLikelihood +=
          sij * Math.log(Math.max(1e-9, eij)) +
          (nij - sij) * Math.log(Math.max(1e-9, 1 - eij));
      }
    }
    rd[i] = Math.round(clamp(1 / Math.sqrt(fisherDiag), 12, 95));
  }

  return {
    elo,
    rd,
    logLikelihood: Number(logLikelihood.toFixed(2)),
    iterations: iter,
  };
}

// ============================================================================
// MAIN ESTÁGIO 2 ORCHESTRATOR
// ============================================================================
async function runStage2(): Promise<void> {
  const t0 = Date.now();
  const numWorkers = Math.max(2, Math.min(10, os.cpus().length - 2));
  const checkpointDir = path.resolve(process.cwd(), 'scratch/overnight_checkpoints');
  fs.mkdirSync(checkpointDir, { recursive: true });

  const champions = buildAll44ChampionsMultiTier();
  const N = champions.length; // 44
  const NUM_NODES = N * 5; // 220 (nodeIndex = champIdx * 5 + (tier - 1))
  const nodeIndex = (cIdx: number, tier: AiSkillTier) => cIdx * 5 + (tier - 1);

  console.log(
    `================================================================================\n` +
      ` ESTÁGIO 2 — SUPER-LIGA ELO BRADLEY-TERRY (${NUM_NODES} PERFIS IA = ${N} × TIERS I–V)\n` +
      ` Workers: ${numWorkers} | Âncora Oficial: Mediana Tier II Regular = 1200 ELO\n` +
      `================================================================================`
  );

  const pool = new EloWorkerPool(numWorkers);

  // 220 x 220 Multi-Tier ELO accumulators
  const nodeGames: Float64Array[] = Array.from(
    { length: NUM_NODES },
    () => new Float64Array(NUM_NODES)
  );
  const nodeScores: Float64Array[] = Array.from(
    { length: NUM_NODES },
    () => new Float64Array(NUM_NODES)
  );
  const nodeWins = new Int32Array(NUM_NODES);
  const nodeLosses = new Int32Array(NUM_NODES);
  const nodeDraws = new Int32Array(NUM_NODES);

  // 44 x 44 Tier V Unified Championship accumulators
  const t5PairMeans: number[][][] = Array.from({ length: N }, () =>
    Array.from({ length: N }, () => [])
  );
  const t5Games: number[][] = Array.from({ length: N }, () => new Array<number>(N).fill(0));
  const t5Scores: number[][] = Array.from({ length: N }, () => new Array<number>(N).fill(0));
  const globalCardStats = new Map<string, CardPlayMiniStat>();

  let totalMatchesSimulated = 0;
  let tier5ChampionshipMatches = 0;

  const absorbEloResponse = (res: WorkerEloJobResponse) => {
    totalMatchesSimulated += res.matchesPlayed;
    const { nodeA, nodeB, matchesPlayed, scoreASum, winsA, lossesA, draws } = res;

    nodeGames[nodeA][nodeB] += matchesPlayed;
    nodeGames[nodeB][nodeA] += matchesPlayed;
    nodeScores[nodeA][nodeB] += scoreASum;
    nodeScores[nodeB][nodeA] += matchesPlayed - scoreASum;

    nodeWins[nodeA] += winsA;
    nodeLosses[nodeA] += lossesA;
    nodeDraws[nodeA] += draws;

    nodeWins[nodeB] += lossesA;
    nodeLosses[nodeB] += winsA;
    nodeDraws[nodeB] += draws;

    if (res.tierA === 5 && res.tierB === 5 && res.champIdxA !== res.champIdxB) {
      tier5ChampionshipMatches += matchesPlayed;
      const i = res.champIdxA;
      const j = res.champIdxB;
      t5Games[i][j] += matchesPlayed;
      t5Games[j][i] += matchesPlayed;
      t5Scores[i][j] += scoreASum;
      t5Scores[j][i] += matchesPlayed - scoreASum;
      for (const pm of res.pairMeans) {
        t5PairMeans[i][j].push(pm);
        t5PairMeans[j][i].push(1 - pm);
      }
      for (const [cid, st] of res.cardPlaysA) {
        const cur = globalCardStats.get(cid) ?? { playedGames: 0, scoreSum: 0 };
        cur.playedGames += st.playedGames;
        cur.scoreSum += st.scoreSum;
        globalCardStats.set(cid, cur);
      }
      for (const [cid, st] of res.cardPlaysB) {
        const cur = globalCardStats.get(cid) ?? { playedGames: 0, scoreSum: 0 };
        cur.playedGames += st.playedGames;
        cur.scoreSum += st.scoreSum;
        globalCardStats.set(cid, cur);
      }
    }
  };

  const computeT5Stats = (idx: number) => {
    const allPairMeans: number[] = [];
    let totalGames = 0;
    let totalScore = 0;
    for (let j = 0; j < N; j++) {
      if (j === idx) continue;
      totalGames += t5Games[idx][j];
      totalScore += t5Scores[idx][j];
      for (const pm of t5PairMeans[idx][j]) allPairMeans.push(pm);
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

  try {
    // ==========================================================================
    // PART A: HIGH-PRECISION 44 x 43 TIER V UNIFIED CHAMPIONSHIP
    // ==========================================================================
    const BASE_T5_MIRROR_PAIRS = 9; // 18 Beam Search games per pair in Wave 1 = 17,028 games
    console.log(
      `\n[Parte A — Onda 1] Campeonato Unificado Tier V: ${(N * (N - 1)) / 2} pares × ${BASE_T5_MIRROR_PAIRS * 2} jogos = ${((N * (N - 1)) / 2) * BASE_T5_MIRROR_PAIRS * 2} duelos Beam Search...`
    );

    let donePairs = 0;
    const totalPairs = (N * (N - 1)) / 2;
    const wave1Tasks: Promise<void>[] = [];

    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const A = champions[i];
        const B = champions[j];
        wave1Tasks.push(
          pool
            .runJob({
              nodeA: nodeIndex(i, 5),
              nodeB: nodeIndex(j, 5),
              champIdxA: i,
              champIdxB: j,
              tierA: 5,
              tierB: 5,
              deckACardIds: A.tierCardIds[5],
              deckBCardIds: B.tierCardIds[5],
              nameA: A.name,
              nameB: B.name,
              deckIdA: A.id,
              deckIdB: B.id,
              profileA: A.learnedProfile,
              profileB: B.learnedProfile,
              mlpA: A.mlp,
              mlpB: B.mlp,
              numMirrorPairs: BASE_T5_MIRROR_PAIRS,
              trackCards: true,
            })
            .then((res) => {
              absorbEloResponse(res);
              donePairs += 1;
              if (donePairs % 150 === 0 || donePairs === totalPairs) {
                const sec = ((Date.now() - t0) / 1000).toFixed(1);
                console.log(
                  `  -> Parte A Onda 1: ${donePairs}/${totalPairs} pares (${tier5ChampionshipMatches.toLocaleString()} jogos em ${sec}s)`
                );
              }
            })
        );
      }
    }
    await Promise.all(wave1Tasks);

    // Adaptive refinement until max IC 95% <= ±2.10% across all 44 Tier V Sovereigns
    const TARGET_T5_CI95 = 0.021;
    for (let wave = 2; wave <= 6; wave++) {
      const needMore = new Set<number>();
      let maxCi = 0;
      for (let i = 0; i < N; i++) {
        const { ci95 } = computeT5Stats(i);
        if (ci95 > maxCi) maxCi = ci95;
        if (ci95 > TARGET_T5_CI95) needMore.add(i);
      }
      console.log(
        `  [Auditoria Parte A Pós-Onda ${wave - 1}] Max IC 95% Tier V = ±${(maxCi * 100).toFixed(2)}% | Acima de ±2.10%: ${needMore.size}/${N}`
      );
      if (needMore.size === 0) break;

      const refinePairs: Array<[number, number]> = [];
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          if (needMore.has(i) || needMore.has(j)) refinePairs.push([i, j]);
        }
      }
      console.log(
        `  [Onda Adaptativa ${wave}] +6 jogos espelhados em ${refinePairs.length} pares (+${refinePairs.length * 6} jogos)...`
      );
      await Promise.all(
        refinePairs.map(([i, j]) => {
          const A = champions[i];
          const B = champions[j];
          return pool
            .runJob({
              nodeA: nodeIndex(i, 5),
              nodeB: nodeIndex(j, 5),
              champIdxA: i,
              champIdxB: j,
              tierA: 5,
              tierB: 5,
              deckACardIds: A.tierCardIds[5],
              deckBCardIds: B.tierCardIds[5],
              nameA: A.name,
              nameB: B.name,
              deckIdA: A.id,
              deckIdB: B.id,
              profileA: A.learnedProfile,
              profileB: B.learnedProfile,
              mlpA: A.mlp,
              mlpB: B.mlp,
              numMirrorPairs: 3,
              trackCards: true,
            })
            .then(absorbEloResponse);
        })
      );
    }

    fs.writeFileSync(
      path.join(checkpointDir, 'stage2_partA_tier5_done.json'),
      JSON.stringify({ timestamp: new Date().toISOString(), tier5ChampionshipMatches }, null, 2),
      'utf-8'
    );

    // ==========================================================================
    // PART B: 220-NODE MULTI-TIER CALIBRATION GRAPH (INTRA-TIER + INTER-TIER BRIDGES)
    // ==========================================================================
    console.log(
      `\n[Parte B] Simulando Malha Multi-Tier Completa (220 Perfis = 44 Campeões × Tiers I–V)...`
    );

    const partBJobs: Array<Omit<WorkerEloJobRequest, 'jobId'>> = [];

    // B1. Intra-Archetype Full 5-Tier Ladder (all 10 pairs of (tA, tB) per archetype × 12 games = 5,280 games)
    const tiersAll: AiSkillTier[] = [1, 2, 3, 4, 5];
    for (let cIdx = 0; cIdx < N; cIdx++) {
      const C = champions[cIdx];
      for (let ti = 0; ti < tiersAll.length; ti++) {
        for (let tj = ti + 1; tj < tiersAll.length; tj++) {
          const tA = tiersAll[ti];
          const tB = tiersAll[tj];
          partBJobs.push({
            nodeA: nodeIndex(cIdx, tA),
            nodeB: nodeIndex(cIdx, tB),
            champIdxA: cIdx,
            champIdxB: cIdx,
            tierA: tA,
            tierB: tB,
            deckACardIds: C.tierCardIds[tA],
            deckBCardIds: C.tierCardIds[tB],
            nameA: `${C.name} (T${tA})`,
            nameB: `${C.name} (T${tB})`,
            deckIdA: C.id,
            deckIdB: C.id,
            profileA: C.learnedProfile,
            profileB: C.learnedProfile,
            mlpA: C.mlp,
            mlpB: C.mlp,
            numMirrorPairs: 6, // 12 games
            trackCards: false,
          });
        }
      }
    }

    // B2. Cross-Archetype Intra-Tier Swiss Leagues for Tiers 1, 2, 3, 4 (each faces 12 cross-format peers)
    for (const tier of [1, 2, 3, 4] as AiSkillTier[]) {
      const seen = new Set<string>();
      for (let i = 0; i < N; i++) {
        for (let step = 1; step <= 6; step++) {
          const j = (i + step * 7 + tier * 2) % N;
          if (i === j) continue;
          const a = Math.min(i, j);
          const b = Math.max(i, j);
          const key = `${a}_${b}`;
          if (seen.has(key)) continue;
          seen.add(key);
          const A = champions[a];
          const B = champions[b];
          partBJobs.push({
            nodeA: nodeIndex(a, tier),
            nodeB: nodeIndex(b, tier),
            champIdxA: a,
            champIdxB: b,
            tierA: tier,
            tierB: tier,
            deckACardIds: A.tierCardIds[tier],
            deckBCardIds: B.tierCardIds[tier],
            nameA: `${A.name} (T${tier})`,
            nameB: `${B.name} (T${tier})`,
            deckIdA: A.id,
            deckIdB: B.id,
            profileA: A.learnedProfile,
            profileB: B.learnedProfile,
            mlpA: A.mlp,
            mlpB: B.mlp,
            numMirrorPairs: 5, // 10 games
            trackCards: false,
          });
        }
      }
    }

    // B3. Cross-Archetype Inter-Tier Bridges: (1 vs 2), (2 vs 3), (3 vs 4), (4 vs 5), (2 vs 4), (1 vs 3)
    const bridges: Array<[AiSkillTier, AiSkillTier, number]> = [
      [1, 2, 5],
      [2, 3, 5],
      [3, 4, 5],
      [4, 5, 5],
      [1, 3, 4],
      [2, 4, 4],
    ];
    for (const [tLow, tHigh, pairsCount] of bridges) {
      for (let i = 0; i < N; i++) {
        for (let k = 1; k <= 4; k++) {
          const j = (i + k * 9 + tLow * 3) % N;
          const A = champions[i];
          const B = champions[j];
          partBJobs.push({
            nodeA: nodeIndex(i, tLow),
            nodeB: nodeIndex(j, tHigh),
            champIdxA: i,
            champIdxB: j,
            tierA: tLow,
            tierB: tHigh,
            deckACardIds: A.tierCardIds[tLow],
            deckBCardIds: B.tierCardIds[tHigh],
            nameA: `${A.name} (T${tLow})`,
            nameB: `${B.name} (T${tHigh})`,
            deckIdA: A.id,
            deckIdB: B.id,
            profileA: A.learnedProfile,
            profileB: B.learnedProfile,
            mlpA: A.mlp,
            mlpB: B.mlp,
            numMirrorPairs: pairsCount,
            trackCards: false,
          });
        }
      }
    }

    console.log(
      `  -> Disparando ${partBJobs.length} blocos multi-tier (~${partBJobs
        .reduce((s, x) => s + x.numMirrorPairs * 2, 0)
        .toLocaleString()} duelos adicionais)...`
    );

    let donePartB = 0;
    await Promise.all(
      partBJobs.map((job) =>
        pool.runJob(job).then((res) => {
          absorbEloResponse(res);
          donePartB += 1;
          if (donePartB % 400 === 0 || donePartB === partBJobs.length) {
            const sec = ((Date.now() - t0) / 1000).toFixed(1);
            console.log(
              `  -> Progresso Parte B: ${donePartB}/${partBJobs.length} blocos | Total Estágio 2: ${totalMatchesSimulated.toLocaleString()} jogos (${sec}s)`
            );
          }
        })
      )
    );
  } finally {
    await pool.close();
  }

  const elapsedSeconds = Number(((Date.now() - t0) / 1000).toFixed(1));

  // ============================================================================
  // PART C: EMIT UPDATED src/data/aiUnifiedTournamentData.ts
  // ============================================================================
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
      formatScoreSum[fi][fj] += t5Scores[i][j];
      formatGameSum[fi][fj] += t5Games[i][j];
    }
  }

  const formatEcologyMatrix: Record<
    UnifiedFormatKind,
    { overallWinRate: number; totalGames: number; vsFormat: Record<UnifiedFormatKind, number> }
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

  const matchupMatrix: Record<string, Record<string, number>> = {};
  for (let i = 0; i < N; i++) {
    const idA = champions[i].id;
    matchupMatrix[idA] = {};
    for (let j = 0; j < N; j++) {
      matchupMatrix[idA][champions[j].id] =
        i === j ? 0.5 : Number((t5Games[i][j] > 0 ? t5Scores[i][j] / t5Games[i][j] : 0.5).toFixed(4));
    }
  }

  let maxChampionCi95 = 0;
  const rawStandings = champions.map((c, idx) => {
    const { wr, ci95, games } = computeT5Stats(idx);
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
        s += t5Scores[idx][j];
        g += t5Games[idx][j];
      }
      vsFormatWinRates[fj] = g > 0 ? Number((s / g).toFixed(4)) : 0.5;
    }

    const oppRows: Array<{ opponentId: UnifiedChampionId; winRate: number; games: number }> = [];
    for (let j = 0; j < N; j++) {
      if (j === idx) continue;
      oppRows.push({
        opponentId: champions[j].id,
        winRate: matchupMatrix[c.id][champions[j].id],
        games: t5Games[idx][j],
      });
    }
    oppRows.sort((a, b) => b.winRate - a.winRate);

    const tierBadge: 'S' | 'A' | 'B' = wr >= 0.555 ? 'S' : wr >= 0.445 ? 'A' : 'B';

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

  const unifiedSummaryObj = {
    generatedAt: new Date().toISOString(),
    totalChampions: N,
    totalUnorderedPairs: (N * (N - 1)) / 2,
    totalMatchesSimulated: tier5ChampionshipMatches,
    numWorkers,
    elapsedSeconds,
    maxChampionCi95HalfWidth: Number(maxChampionCi95.toFixed(4)),
    convergedByMargin: maxChampionCi95 <= 0.025,
    tierCounts,
    formatEcologyMatrix,
    patchedCardsAudit,
  };

  const unifiedOutPath = path.resolve(process.cwd(), 'src/data/aiUnifiedTournamentData.ts');
  const unifiedFileContents = `import { Domain } from '../types/game';
import type { MonocolorArchetypeId } from './aiMonocolorMasteryData';
import type { BicolorArchetypeId } from './aiBicolorMasteryData';
import type { PolycolorArchetypeId } from './aiPolycolorMasteryData';

/**
 * GERADO AUTOMATICAMENTE POR src/scripts/runEloCalibrationLeague.ts
 * Grande Torneio Unificado de Vaeloria (44 × 43 Campeões Tier V): ${tier5ChampionshipMatches} duelos Beam Search (${elapsedSeconds}s em ${numWorkers} threads)
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
    unifiedSummaryObj,
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
  fs.writeFileSync(unifiedOutPath, unifiedFileContents, 'utf-8');

  // ============================================================================
  // PART D: SOLVE BRADLEY-TERRY ELO & EMIT src/data/sovereignEloLadderData.ts
  // ============================================================================
  const tier2AnchorIndices = champions.map((_, idx) => nodeIndex(idx, 2));
  const bt = solveBradleyTerryElo(NUM_NODES, nodeGames, nodeScores, tier2AnchorIndices, 1200);

  const archetypeTierEloMap: Record<
    string,
    Record<
      AiSkillTier,
      {
        elo: number;
        rd: number;
        games: number;
        wins: number;
        losses: number;
        draws: number;
        winRate: number;
      }
    >
  > = {};

  const tierBuckets: Record<AiSkillTier, number[]> = { 1: [], 2: [], 3: [], 4: [], 5: [] };

  for (let i = 0; i < N; i++) {
    const c = champions[i];
    archetypeTierEloMap[c.id] = {} as never;
    for (const tier of [1, 2, 3, 4, 5] as AiSkillTier[]) {
      const nIdx = nodeIndex(i, tier);
      let gTot = 0;
      let sTot = 0;
      for (let m = 0; m < NUM_NODES; m++) {
        if (m === nIdx) continue;
        gTot += nodeGames[nIdx][m];
        sTot += nodeScores[nIdx][m];
      }
      const eloVal = bt.elo[nIdx];
      tierBuckets[tier].push(eloVal);
      archetypeTierEloMap[c.id][tier] = {
        elo: eloVal,
        rd: bt.rd[nIdx],
        games: Math.round(gTot),
        wins: nodeWins[nIdx],
        losses: nodeLosses[nIdx],
        draws: nodeDraws[nIdx],
        winRate: gTot > 0 ? Number((sTot / gTot).toFixed(4)) : 0.5,
      };
    }
  }

  const tierEloDistribution: Record<
    AiSkillTier,
    { minElo: number; medianElo: number; meanElo: number; maxElo: number }
  > = {} as never;

  for (const tier of [1, 2, 3, 4, 5] as AiSkillTier[]) {
    const sorted = tierBuckets[tier].slice().sort((a, b) => a - b);
    const sum = sorted.reduce((s, x) => s + x, 0);
    tierEloDistribution[tier] = {
      minElo: sorted[0] ?? 1000,
      medianElo: sorted[Math.floor(sorted.length / 2)] ?? 1200,
      meanElo: Math.round(sum / Math.max(1, sorted.length)),
      maxElo: sorted[sorted.length - 1] ?? 1500,
    };
  }

  // Build Official Sovereign AI Leaderboard Roster:
  // - All 44 Grand Sovereigns (Tier V)
  // - Plus 24 Regional Commanders & Garrison Captains across Tiers I, II, III, IV so every ELO division is populated!
  interface SovereignAiRosterItem {
    sovereignId: string;
    sovereignName: string;
    sovereignTitle: string;
    realmOrigin: string;
    archetypeId: UnifiedChampionId;
    archetypeName: string;
    archetypeSubtitle: string;
    skillTier: AiSkillTier;
    isGrandSovereign: boolean;
    format: UnifiedFormatKind;
    domains: Domain[];
    avatarCardId: string;
    eloRating: number;
    eloRd: number;
    simulatedGames: number;
    simulatedWins: number;
    simulatedLosses: number;
    simulatedWinRate: number;
    tournamentRankTierV?: number;
  }

  const standingRankByArch = new Map<UnifiedChampionId, number>();
  for (const st of rawStandings) standingRankByArch.set(st.archetypeId, st.rank);

  const roster: SovereignAiRosterItem[] = [];

  // 1. All 44 Grand Sovereigns (Tier V)
  for (const c of champions) {
    const lore = SOVEREIGN_LORE_BY_ARCHETYPE[c.id];
    const cell = archetypeTierEloMap[c.id][5];
    roster.push({
      sovereignId: `sov_t5_${c.id}`,
      sovereignName: lore.sovereignName.trim(),
      sovereignTitle: lore.sovereignTitle.trim(),
      realmOrigin: lore.realmOrigin,
      archetypeId: c.id,
      archetypeName: c.name,
      archetypeSubtitle: c.subtitle,
      skillTier: 5,
      isGrandSovereign: true,
      format: c.format,
      domains: c.domains,
      avatarCardId: c.coverCardId,
      eloRating: cell.elo,
      eloRd: cell.rd,
      simulatedGames: cell.games,
      simulatedWins: cell.wins,
      simulatedLosses: cell.losses,
      simulatedWinRate: cell.winRate,
      tournamentRankTierV: standingRankByArch.get(c.id),
    });
  }

  // 2. 24 Regional Commanders & Vanguard Wardens across Tiers I–IV (6 per tier)
  const commanderPrefixes: Record<1 | 2 | 3 | 4, { prefix: string; roleTitle: string }> = {
    1: { prefix: 'Sentinela', roleTitle: 'Guarnição de Fronteira (Tier I)' },
    2: { prefix: 'Capitão', roleTitle: 'Veterano Regular da Ordem (Tier II)' },
    3: { prefix: 'Comandante', roleTitle: 'Estrategista Regional (Tier III)' },
    4: { prefix: 'Arconte', roleTitle: 'Mestre Tático do Conselho (Tier IV)' },
  };

  for (const tier of [4, 3, 2, 1] as const) {
    for (let pick = 0; pick < 6; pick++) {
      const cIdx = (pick * 7 + tier * 3) % N;
      const c = champions[cIdx];
      const lore = SOVEREIGN_LORE_BY_ARCHETYPE[c.id];
      const cell = archetypeTierEloMap[c.id][tier];
      const meta = commanderPrefixes[tier];
      const baseFirstName = lore.sovereignName.trim().split(' ')[0];
      const avatarCard =
        c.tierCardIds[tier].find((cid) => CARDS_BY_ID[cid]?.type === 'creature') ?? c.coverCardId;

      roster.push({
        sovereignId: `sov_t${tier}_${c.id}`,
        sovereignName: `${meta.prefix} de ${lore.realmOrigin} (${baseFirstName})`,
        sovereignTitle: `${meta.roleTitle} • ${c.name}`,
        realmOrigin: lore.realmOrigin,
        archetypeId: c.id,
        archetypeName: c.name,
        archetypeSubtitle: c.subtitle,
        skillTier: tier,
        isGrandSovereign: false,
        format: c.format,
        domains: c.domains,
        avatarCardId: avatarCard,
        eloRating: cell.elo,
        eloRd: cell.rd,
        simulatedGames: cell.games,
        simulatedWins: cell.wins,
        simulatedLosses: cell.losses,
        simulatedWinRate: cell.winRate,
      });
    }
  }

  roster.sort((a, b) => b.eloRating - a.eloRating || b.simulatedWinRate - a.simulatedWinRate);

  const eloSummary = {
    generatedAt: new Date().toISOString(),
    totalProfilesCalibrated: NUM_NODES,
    totalCalibrationMatches: totalMatchesSimulated,
    tier5ChampionshipMatches,
    anchorDescription: 'Mediana Tier II Regular = 1200 ELO (FIDE / Bradley-Terry MLE)',
    bradleyTerryIterations: bt.iterations,
    logLikelihood: bt.logLikelihood,
    elapsedSeconds,
    tierEloDistribution,
  };

  const eloOutPath = path.resolve(process.cwd(), 'src/data/sovereignEloLadderData.ts');
  const eloFileContent = `import { AiSkillTier, Domain } from '../types/game';
import type { UnifiedChampionId, UnifiedFormatKind } from './aiUnifiedTournamentData';

/**
 * GERADO AUTOMATICAMENTE POR src/scripts/runEloCalibrationLeague.ts
 * Super-Liga de Calibração ELO FIDE / Bradley-Terry:
 * • ${NUM_NODES} Perfis IA (44 Arquétipos × Tiers I–V)
 * • ${totalMatchesSimulated.toLocaleString()} Partidas Multi-Tier Simuladas (${elapsedSeconds}s em ${numWorkers} threads)
 * • Âncora Oficial: Mediana Tier II Regular = 1200 ELO
 */

export interface CalibratedArchetypeTierCell {
  elo: number;
  rd: number;
  games: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
}

export interface SovereignAiLeaderboardEntry {
  sovereignId: string;
  sovereignName: string;
  sovereignTitle: string;
  realmOrigin: string;
  archetypeId: UnifiedChampionId;
  archetypeName: string;
  archetypeSubtitle: string;
  skillTier: AiSkillTier;
  isGrandSovereign: boolean;
  format: UnifiedFormatKind;
  domains: Domain[];
  avatarCardId: string;
  eloRating: number;
  eloRd: number;
  simulatedGames: number;
  simulatedWins: number;
  simulatedLosses: number;
  simulatedWinRate: number;
  tournamentRankTierV?: number;
}

export interface SovereignEloCalibrationSummary {
  generatedAt: string;
  totalProfilesCalibrated: number;
  totalCalibrationMatches: number;
  tier5ChampionshipMatches: number;
  anchorDescription: string;
  bradleyTerryIterations: number;
  logLikelihood: number;
  elapsedSeconds: number;
  tierEloDistribution: Record<
    AiSkillTier,
    { minElo: number; medianElo: number; meanElo: number; maxElo: number }
  >;
}

export const SOVEREIGN_ELO_CALIBRATION_SUMMARY: SovereignEloCalibrationSummary = ${JSON.stringify(
    eloSummary,
    null,
    2
  )};

export const ARCHETYPE_TIER_ELO_MAP: Record<
  UnifiedChampionId,
  Record<AiSkillTier, CalibratedArchetypeTierCell>
> = ${JSON.stringify(archetypeTierEloMap, null, 2)};

export const SOVEREIGN_AI_LEADERBOARD_ROSTER: SovereignAiLeaderboardEntry[] = ${JSON.stringify(
    roster,
    null,
    2
  )};
`;
  fs.writeFileSync(eloOutPath, eloFileContent, 'utf-8');

  console.log('\n=== DISTRIBUIÇÃO EMPÍRICA DE ELO POR TIER DE IA (220 PERFIS) ===');
  for (const tier of [1, 2, 3, 4, 5] as AiSkillTier[]) {
    const d = tierEloDistribution[tier];
    console.log(
      `  Tier ${tier}: Min=${d.minElo} | Mediana=${d.medianElo} | Média=${d.meanElo} | Max=${d.maxElo} ELO`
    );
  }
  console.log('\n=== TOP 10 SOBERANOS DE VAELORIA NO RANKING ELO ===');
  for (let idx = 0; idx < 10 && idx < roster.length; idx++) {
    const r = roster[idx];
    console.log(
      `  #${String(idx + 1).padStart(2)} ${r.sovereignName.padEnd(28)} | ${r.eloRating} ELO (±${r.eloRd}) | ${r.archetypeName} (WR ${(r.simulatedWinRate * 100).toFixed(1)}%)`
    );
  }
  console.log(
    `\n================================================================================\n` +
      ` ESTÁGIO 2 CONCLUÍDO EM ${elapsedSeconds}s!\n` +
      ` • Total de Duelos Calibrados: ${totalMatchesSimulated.toLocaleString()}\n` +
      ` • Salvo em: ${eloOutPath} & ${unifiedOutPath}\n` +
      `================================================================================`
  );
}

if (isMainThread) {
  runStage2().catch((err) => {
    console.error('Erro fatal no Estágio 2 (runEloCalibrationLeague):', err);
    process.exit(1);
  });
}
