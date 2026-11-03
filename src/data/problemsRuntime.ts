import { ALL_CARDS, CARDS_BY_ID } from './cards';
import {
  addUnitToSlot,
  createInitialGameState,
  getDomainExpansionSpec,
  recalculateFormationBonuses,
} from '../engine/gameEngine';
import { BoardUnit, CardDefinition, Domain, GameState, RowType } from '../types/game';

export type ProblemDifficultyTier =
  | 'iniciante'
  | 'intermediario'
  | 'avancado'
  | 'mestre'
  | 'grao_mestre'
  | 'campeoes_torneio';

export const PROBLEM_TIERS_ORDER: ProblemDifficultyTier[] = [
  'iniciante',
  'intermediario',
  'avancado',
  'mestre',
  'grao_mestre',
  'campeoes_torneio',
];

export interface ProblemUnitPlacement {
  cardId: string;
  row: RowType;
  slotIndex: number;
  damageTaken?: number;
  bonusAtk?: number;
  bonusHp?: number;
  hasSummoningSickness?: boolean;
  hasDivineShield?: boolean;
  isFrozen?: boolean;
  isAscended?: boolean;
}

export interface TacticalProblem {
  id: string;
  number: number;
  code: string;
  title: string;
  subtitle: string;
  difficulty: ProblemDifficultyTier;
  difficultyLabel: string;
  stars: number;
  goldReward: number;
  primaryDomain: Exclude<Domain, 'neutral'>;
  mechanicTag: string;
  scenarioLore: string;
  objectiveText: string;
  hint1: string;
  hint2: string;
  solutionSteps: string[];
  whyIndefensible: string;
  turnNumber: number;
  p1Name: string;
  p1AvatarCardId: string;
  p1Hp: number;
  p1Essence: number;
  p1MaxEssence: number;
  p1Affinities: Record<Domain, number>;
  p1HandCardIds: string[];
  p1DeckTopCardIds: string[];
  p1ChanneledCardIds: string[];
  p1CryptCardIds: string[];
  p1Units: ProblemUnitPlacement[];
  p2Name: string;
  p2Title: string;
  p2AvatarCardId: string;
  p2Domain: Exclude<Domain, 'neutral'>;
  p2Hp: number;
  p2Essence: number;
  p2MaxEssence: number;
  p2Affinities: Record<Domain, number>;
  p2Units: ProblemUnitPlacement[];
  initialDomainState?: {
    owner: 'player' | 'ai';
    domain: Exclude<Domain, 'neutral'>;
    turnsRemaining?: number;
    damageTakenByOwnerThisRound?: number;
    clashRival?: {
      owner: 'player' | 'ai';
      domain: Exclude<Domain, 'neutral'>;
      turnsRemaining?: number;
    } | null;
  } | null;
}

export const PROBLEM_DIFFICULTY_META: Record<
  ProblemDifficultyTier,
  {
    label: string;
    starsText: string;
    color: string;
    bg: string;
    border: string;
    description: string;
  }
> = {
  iniciante: {
    label: 'Grau I • Iniciante',
    starsText: '★☆☆☆☆',
    color: '#4ade80',
    bg: 'rgba(34, 197, 94, 0.14)',
    border: 'rgba(74, 222, 128, 0.45)',
    description:
      'Fundamentos de posicionamento (Cobertura e Invasão), Relíquias de Retaguarda, Ascensão e Expansão de Domínio (+2 🪙 por problema).',
  },
  intermediario: {
    label: 'Grau II • Intermediário',
    starsText: '★★☆☆☆',
    color: '#38bdf8',
    bg: 'rgba(56, 189, 248, 0.14)',
    border: 'rgba(56, 189, 248, 0.45)',
    description:
      'Sequenciamento de Feitiços geradores de Essência, Reanimação da Cripta, Poder do Soberano e Alvo Manual sob Domínio (+3 🪙 por problema).',
  },
  avancado: {
    label: 'Grau III • Avançado',
    starsText: '★★★☆☆',
    color: '#facc15',
    bg: 'rgba(250, 204, 21, 0.14)',
    border: 'rgba(250, 204, 21, 0.45)',
    description:
      'Desempate de Confronto de Domínios 50/50 por Afinidade (7 vs 6), Quebra de Concentração (8+ Dano) e Combustão de Mana (+5 🪙 por problema).',
  },
  mestre: {
    label: 'Grau IV • Mestre',
    starsText: '★★★★☆',
    color: '#fb923c',
    bg: 'rgba(251, 146, 60, 0.14)',
    border: 'rgba(251, 146, 60, 0.45)',
    description:
      'Tributo Anti-Domínio (10❤️), Sacrifício Vital no limite da vida, Manobras de Fileira [⇄] e Retorno à Mão (+7 🪙 por problema).',
  },
  grao_mestre: {
    label: 'Grau V • Grão-Mestre Soberano',
    starsText: '★★★★★',
    color: '#e879f9',
    bg: 'rgba(217, 70, 239, 0.16)',
    border: 'rgba(232, 121, 249, 0.55)',
    description:
      'Quebra-cabeças de 5 a 6 ações encadeadas onde um único erro de 1⚡ ou 1 coluna deixa o Soberano rival vivo (+10 🪙 por problema).',
  },
  campeoes_torneio: {
    label: '🏆 Grão-Soberanos',
    starsText: '👑★★★★★',
    color: '#fde047',
    bg: 'rgba(234, 179, 8, 0.16)',
    border: 'rgba(250, 204, 21, 0.65)',
    description:
      'Desafios de 1 turno inspirados nas jogadas e combos assinatura dos Grão-Soberanos de Vaeloria (#1–#44) — desbloqueados desde o início (+12 🪙 por problema).',
  },
};

export function resolveProblemCard(cardId: string): CardDefinition {
  return CARDS_BY_ID[cardId] ?? ALL_CARDS[0];
}

export function buildProblemInitialGameState(problem: TacticalProblem): GameState {
  const pDeck = problem.p1DeckTopCardIds.map(resolveProblemCard);
  const aiDeck = [resolveProblemCard(problem.p2AvatarCardId)];

  const state = createInitialGameState(pDeck, aiDeck, {
    playerName: problem.p1Name,
    aiName: problem.p2Name,
    aiTitle: problem.p2Title,
    aiAvatarCardId: problem.p2AvatarCardId,
    aiStartingHp: problem.p2Hp,
  });

  state.turn = problem.turnNumber;
  state.activePlayer = 'player';
  state.phase = 'main';

  state.player.avatarCardId = problem.p1AvatarCardId;
  state.player.hp = problem.p1Hp;
  state.player.maxHp = 40;
  state.player.currentEssence = problem.p1Essence;
  state.player.maxEssence = problem.p1MaxEssence;
  state.player.hand = problem.p1HandCardIds.map(resolveProblemCard);
  state.player.deck = problem.p1DeckTopCardIds.map(resolveProblemCard);
  state.player.channeledCards = problem.p1ChanneledCardIds.map(resolveProblemCard);
  state.player.crypt = problem.p1CryptCardIds.map(resolveProblemCard);
  state.player.affinities = { ...problem.p1Affinities };
  state.player.hasChanneledThisTurn = false;
  state.player.hasUsedSovereignPowerThisTurn = false;
  state.player.hasUsedBloodPactThisTurn = false;
  state.player.vanguard = Array(6).fill(null);
  state.player.rearguard = Array(6).fill(null);
  state.player.vanguardStacks = Array.from({ length: 6 }, () => []);
  state.player.rearguardStacks = Array.from({ length: 6 }, () => []);

  state.ai.hp = problem.p2Hp;
  state.ai.maxHp = 40;
  state.ai.currentEssence = problem.p2Essence;
  state.ai.maxEssence = problem.p2MaxEssence;
  state.ai.affinities = { ...problem.p2Affinities };
  state.ai.vanguard = Array(6).fill(null);
  state.ai.rearguard = Array(6).fill(null);
  state.ai.vanguardStacks = Array.from({ length: 6 }, () => []);
  state.ai.rearguardStacks = Array.from({ length: 6 }, () => []);

  const createProblemUnit = (
    placement: ProblemUnitPlacement,
    owner: 'player' | 'ai',
    idx: number
  ): BoardUnit => {
    const baseCard = resolveProblemCard(placement.cardId);
    const isAsc = Boolean(placement.isAscended && baseCard.ascension);
    const atk = (isAsc ? baseCard.ascension!.newAtk : baseCard.atk) + (placement.bonusAtk ?? 0);
    const armor = isAsc ? baseCard.ascension!.newArmor : baseCard.armor;
    const maxHp = (isAsc ? baseCard.ascension!.newMaxHp : baseCard.hp) + (placement.bonusHp ?? 0);
    const currentHp = Math.max(1, maxHp - (placement.damageTaken ?? 0));
    const keywords = isAsc
      ? Array.from(new Set([...baseCard.keywords, ...(baseCard.ascension!.addedKeywords ?? [])]))
      : [...baseCard.keywords];

    return {
      instanceId: `prob-unit-${problem.id}-${owner}-${placement.row}-${placement.slotIndex}-${idx}`,
      cardId: baseCard.id,
      card: isAsc
        ? {
            ...baseCard,
            name: baseCard.ascension!.newName,
            atk,
            armor,
            hp: maxHp,
            keywords,
          }
        : baseCard,
      owner,
      row: placement.row,
      slotIndex: placement.slotIndex,
      currentAtk: atk,
      currentArmor: armor,
      currentHp,
      maxHp,
      keywords,
      regeneration: baseCard.regeneration ?? 0,
      hasSummoningSickness: placement.hasSummoningSickness ?? false,
      hasAttackedThisTurn: false,
      isFrozen: placement.isFrozen ?? false,
      hasDivineShield: placement.hasDivineShield ?? keywords.includes('Escudo Divino'),
      isAscended: isAsc,
      hasRebornTriggered: false,
      stance: 'attack',
    };
  };

  problem.p1Units.forEach((u, idx) => {
    addUnitToSlot(state.player, u.row, u.slotIndex, createProblemUnit(u, 'player', idx));
  });

  problem.p2Units.forEach((u, idx) => {
    addUnitToSlot(state.ai, u.row, u.slotIndex, createProblemUnit(u, 'ai', idx));
  });

  if (problem.initialDomainState) {
    const dState = problem.initialDomainState;
    const spec = getDomainExpansionSpec(dState.domain);
    const rivalSpec = dState.clashRival ? getDomainExpansionSpec(dState.clashRival.domain) : null;
    state.domainExpansion = {
      owner: dState.owner,
      domain: spec.domain,
      name: spec.name,
      subtitle: spec.subtitle,
      icon: spec.icon,
      potencyDesc: spec.potencyDesc,
      sureHitDesc: spec.sureHitDesc,
      turnsRemaining: dState.turnsRemaining ?? 3,
      damageTakenByOwnerThisRound: dState.damageTakenByOwnerThisRound ?? 0,
      simpleDomainProtectedActor: null,
      clashRival:
        dState.clashRival && rivalSpec
          ? {
              owner: dState.clashRival.owner,
              domain: rivalSpec.domain,
              name: rivalSpec.name,
              icon: rivalSpec.icon,
            }
          : null,
    };
  } else {
    state.domainExpansion = null;
  }

  state.feedbacks = [];
  state.combatLog = [
    {
      id: `prob-log-init-${problem.id}`,
      turn: problem.turnNumber,
      actor: 'system',
      category: 'turn',
      message: `♟️ ${problem.code} — ${problem.title}: ${problem.objectiveText}`,
    },
  ];

  recalculateFormationBonuses(state);
  return state;
}

export const SOLVED_PROBLEMS_STORAGE_KEY = 'chromatic_pact_solved_problems_v1';
export const PROBLEM_HISTORY_STORAGE_KEY = 'chromatic_pact_problem_history_v1';

export interface ProblemHistoryEntry {
  problemId: string;
  attempts: number;
  failures: number;
  solved: boolean;
  solvedOnFirstTry: boolean;
  maxHintStageUsed: number;
  lastAttemptAt: string;
  firstSolvedAt?: string;
}

export function getSolvedProblemIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(SOLVED_PROBLEMS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getProblemHistoryMap(): Record<string, ProblemHistoryEntry> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(PROBLEM_HISTORY_STORAGE_KEY);
    const map: Record<string, ProblemHistoryEntry> = raw ? JSON.parse(raw) : {};
    const legacySolved = getSolvedProblemIds();
    let changed = false;
    for (const id of legacySolved) {
      if (!map[id]) {
        map[id] = {
          problemId: id,
          attempts: 1,
          failures: 0,
          solved: true,
          solvedOnFirstTry: true,
          maxHintStageUsed: 0,
          lastAttemptAt: new Date().toISOString(),
          firstSolvedAt: new Date().toISOString(),
        };
        changed = true;
      } else if (!map[id].solved) {
        map[id].solved = true;
        changed = true;
      }
    }
    if (changed) {
      window.localStorage.setItem(PROBLEM_HISTORY_STORAGE_KEY, JSON.stringify(map));
    }
    return map;
  } catch {
    return {};
  }
}

export function saveProblemHistoryMap(map: Record<string, ProblemHistoryEntry>): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(PROBLEM_HISTORY_STORAGE_KEY, JSON.stringify(map));
  } catch {
    // ignore storage errors
  }
}

export function recordProblemAttemptFailed(problemId: string): ProblemHistoryEntry {
  const map = getProblemHistoryMap();
  const now = new Date().toISOString();
  const existing = map[problemId];
  const updated: ProblemHistoryEntry = existing
    ? {
        ...existing,
        attempts: existing.attempts + 1,
        failures: existing.failures + 1,
        lastAttemptAt: now,
      }
    : {
        problemId,
        attempts: 1,
        failures: 1,
        solved: false,
        solvedOnFirstTry: false,
        maxHintStageUsed: 0,
        lastAttemptAt: now,
      };
  map[problemId] = updated;
  saveProblemHistoryMap(map);
  return updated;
}

export function recordProblemHintUsed(problemId: string, hintStage: number): ProblemHistoryEntry {
  const map = getProblemHistoryMap();
  const now = new Date().toISOString();
  const existing = map[problemId];
  const updated: ProblemHistoryEntry = existing
    ? {
        ...existing,
        maxHintStageUsed: Math.max(existing.maxHintStageUsed, hintStage),
        lastAttemptAt: now,
      }
    : {
        problemId,
        attempts: 0,
        failures: 0,
        solved: false,
        solvedOnFirstTry: false,
        maxHintStageUsed: hintStage,
        lastAttemptAt: now,
      };
  map[problemId] = updated;
  saveProblemHistoryMap(map);
  return updated;
}

export const PROBLEM_ROSTER_LITE: ReadonlyArray<{ id: string; difficulty: ProblemDifficultyTier }> = [
  {
    "id": "prob_01_forja_impeto",
    "difficulty": "iniciante"
  },
  {
    "id": "prob_02_cobertura_invasao",
    "difficulty": "iniciante"
  },
  {
    "id": "prob_03_ascensao_draconica",
    "difficulty": "iniciante"
  },
  {
    "id": "prob_04_sopro_draconico_escudo",
    "difficulty": "iniciante"
  },
  {
    "id": "prob_05_alcance_retaguarda",
    "difficulty": "iniciante"
  },
  {
    "id": "prob_06_toque_letal_impeto",
    "difficulty": "iniciante"
  },
  {
    "id": "prob_07_furia_crescente_salamandra",
    "difficulty": "iniciante"
  },
  {
    "id": "prob_08_atropelar_verme_purpura",
    "difficulty": "iniciante"
  },
  {
    "id": "prob_09_canalizar_sexta_afinidade",
    "difficulty": "iniciante"
  },
  {
    "id": "prob_10_efeito_entrada_esfera_cinzas",
    "difficulty": "iniciante"
  },
  {
    "id": "prob_ext_ini_01_serpente_fogo_invasao",
    "difficulty": "iniciante"
  },
  {
    "id": "prob_ext_ini_02_escudo_divino_troca_limpa",
    "difficulty": "iniciante"
  },
  {
    "id": "prob_ext_ini_03_lobo_geada_sopro",
    "difficulty": "iniciante"
  },
  {
    "id": "prob_ext_ini_04_banshee_grito_fatal",
    "difficulty": "iniciante"
  },
  {
    "id": "prob_ext_ini_05_pterossauro_buff_aereo",
    "difficulty": "iniciante"
  },
  {
    "id": "prob_ext_ini_06_wyvern_voo_letal",
    "difficulty": "iniciante"
  },
  {
    "id": "prob_ext_ini_07_leao_juba_solar_carga",
    "difficulty": "iniciante"
  },
  {
    "id": "prob_ext_ini_08_fogo_alquimico_remocao",
    "difficulty": "iniciante"
  },
  {
    "id": "prob_ext_ini_09_ascensao_raptor_allossauro",
    "difficulty": "iniciante"
  },
  {
    "id": "prob_ext_ini_10_eclipse_trono_ossos_basico",
    "difficulty": "iniciante"
  },
  {
    "id": "prob_ext_ini_11_pyrrakon_quebra_dominio",
    "difficulty": "iniciante"
  },
  {
    "id": "prob_ext_ini_12_hoste_cratera_armada",
    "difficulty": "iniciante"
  },
  {
    "id": "prob_11_ruptura_relogio_astral",
    "difficulty": "intermediario"
  },
  {
    "id": "prob_12_sinfonia_cripta",
    "difficulty": "intermediario"
  },
  {
    "id": "prob_13_trono_imperial_aurora",
    "difficulty": "intermediario"
  },
  {
    "id": "prob_14_exumar_legiao_cripta",
    "difficulty": "intermediario"
  },
  {
    "id": "prob_15_alvo_manual_sob_dominio",
    "difficulty": "intermediario"
  },
  {
    "id": "prob_16_mercenario_planar_ciclo",
    "difficulty": "intermediario"
  },
  {
    "id": "prob_17_arquimago_gatilho_feitico",
    "difficulty": "intermediario"
  },
  {
    "id": "prob_18_poder_soberano_letal",
    "difficulty": "intermediario"
  },
  {
    "id": "prob_19_manto_invisibilidade_bounce",
    "difficulty": "intermediario"
  },
  {
    "id": "prob_20_dragao_esmeralda_sinergia",
    "difficulty": "intermediario"
  },
  {
    "id": "prob_ext_int_01_elemental_ar_bounce_ascensao",
    "difficulty": "intermediario"
  },
  {
    "id": "prob_ext_int_02_cavaleiro_planar_rampa",
    "difficulty": "intermediario"
  },
  {
    "id": "prob_ext_int_03_salamandra_duplo_alvo",
    "difficulty": "intermediario"
  },
  {
    "id": "prob_ext_int_04_arquidruida_galhada_dominio",
    "difficulty": "intermediario"
  },
  {
    "id": "prob_ext_int_05_automato_ciclo_pocao",
    "difficulty": "intermediario"
  },
  {
    "id": "prob_ext_int_06_dragao_etereo_sopro_escudo",
    "difficulty": "intermediario"
  },
  {
    "id": "prob_ext_int_07_efreeti_varredura_vanguarda",
    "difficulty": "intermediario"
  },
  {
    "id": "prob_ext_int_08_julgamento_sete_sois_limpeza",
    "difficulty": "intermediario"
  },
  {
    "id": "prob_ext_int_09_maré_sanguinaria_token_dominio",
    "difficulty": "intermediario"
  },
  {
    "id": "prob_ext_int_10_travessia_portal_astral_token",
    "difficulty": "intermediario"
  },
  {
    "id": "prob_ext_int_11_sylvarok_disputa_dominios",
    "difficulty": "intermediario"
  },
  {
    "id": "prob_ext_int_12_pactuario_armada_nevasca",
    "difficulty": "intermediario"
  },
  {
    "id": "prob_21_desempate_dominio_7v6",
    "difficulty": "avancado"
  },
  {
    "id": "prob_22_quebra_concentracao_8dano",
    "difficulty": "avancado"
  },
  {
    "id": "prob_23_combustao_dupla_afinidade",
    "difficulty": "avancado"
  },
  {
    "id": "prob_24_quebra_concentracao_feitico_voo",
    "difficulty": "avancado"
  },
  {
    "id": "prob_25_pedra_filosofal_expansao",
    "difficulty": "avancado"
  },
  {
    "id": "prob_26_inversao_gravitacional_furia",
    "difficulty": "avancado"
  },
  {
    "id": "prob_27_talisma_bem_cobertura",
    "difficulty": "avancado"
  },
  {
    "id": "prob_28_fenix_ultimo_suspiro_dominio",
    "difficulty": "avancado"
  },
  {
    "id": "prob_29_conde_vampiro_ascensao_dominio",
    "difficulty": "avancado"
  },
  {
    "id": "prob_30_confronto_5050_esmeralda_7v6",
    "difficulty": "avancado"
  },
  {
    "id": "prob_ext_ava_01_confronto_5050_carmesim_7v6",
    "difficulty": "avancado"
  },
  {
    "id": "prob_ext_ava_02_quebra_concentracao_alcance_retaguarda",
    "difficulty": "avancado"
  },
  {
    "id": "prob_ext_ava_03_alquimia_azul_canalizar_queimar",
    "difficulty": "avancado"
  },
  {
    "id": "prob_ext_ava_04_general_angelical_dominio",
    "difficulty": "avancado"
  },
  {
    "id": "prob_ext_ava_05_hidra_peconha_esmeralda",
    "difficulty": "avancado"
  },
  {
    "id": "prob_ext_ava_06_canto_sereias_ruptura",
    "difficulty": "avancado"
  },
  {
    "id": "prob_ext_ava_07_gigante_fogo_atropelar_ataque",
    "difficulty": "avancado"
  },
  {
    "id": "prob_ext_ava_08_confronto_5050_abismo_7v6",
    "difficulty": "avancado"
  },
  {
    "id": "prob_ext_ava_09_bomba_tempo_engrenagem_invasao",
    "difficulty": "avancado"
  },
  {
    "id": "prob_ext_ava_10_colosso_pau_ferro_dominio",
    "difficulty": "avancado"
  },
  {
    "id": "prob_ext_ava_11_heliokar_cura_pacto_sangue",
    "difficulty": "avancado"
  },
  {
    "id": "prob_ext_ava_12_enxame_ancestral_dominio_verde",
    "difficulty": "avancado"
  },
  {
    "id": "prob_31_pacto_sangue_limite",
    "difficulty": "mestre"
  },
  {
    "id": "prob_32_manobra_fileira_retaguarda",
    "difficulty": "mestre"
  },
  {
    "id": "prob_33_quebra_dominio_sacrificio_terreno",
    "difficulty": "mestre"
  },
  {
    "id": "prob_34_manobra_recuo_arqueiro",
    "difficulty": "mestre"
  },
  {
    "id": "prob_35_nucleo_relojoeiro_cascata",
    "difficulty": "mestre"
  },
  {
    "id": "prob_36_cura_tatica_para_tributo",
    "difficulty": "mestre"
  },
  {
    "id": "prob_37_renascer_mumia_ultimo_suspiro",
    "difficulty": "mestre"
  },
  {
    "id": "prob_38_banquete_parasitario_pacto",
    "difficulty": "mestre"
  },
  {
    "id": "prob_39_mobilizacao_cinco_selos_dominio",
    "difficulty": "mestre"
  },
  {
    "id": "prob_40_espelho_almas_dupla_remocao",
    "difficulty": "mestre"
  },
  {
    "id": "prob_ext_mes_01_pacto_sangue_ascensao_anjo",
    "difficulty": "mestre"
  },
  {
    "id": "prob_ext_mes_02_manobra_dupla_fileira_carmesim",
    "difficulty": "mestre"
  },
  {
    "id": "prob_ext_mes_03_tributo_10hp_furia_crescente",
    "difficulty": "mestre"
  },
  {
    "id": "prob_ext_mes_04_compra_dupla_queima_pacto",
    "difficulty": "mestre"
  },
  {
    "id": "prob_ext_mes_05_arconte_trombeta_manobra",
    "difficulty": "mestre"
  },
  {
    "id": "prob_ext_mes_06_kraken_congelamento_dominio",
    "difficulty": "mestre"
  },
  {
    "id": "prob_ext_mes_07_furia_crescente_salamandra_ascensao",
    "difficulty": "mestre"
  },
  {
    "id": "prob_ext_mes_08_pacto_agonia_eterna_quebra_8",
    "difficulty": "mestre"
  },
  {
    "id": "prob_ext_mes_09_pedra_filosofal_manobra_dupla",
    "difficulty": "mestre"
  },
  {
    "id": "prob_ext_mes_10_colapso_8dano_mais_pacto_sangue",
    "difficulty": "mestre"
  },
  {
    "id": "prob_ext_mes_11_nyxaroth_execucao_abissal",
    "difficulty": "mestre"
  },
  {
    "id": "prob_ext_mes_12_legiao_eclipse_reanimacao",
    "difficulty": "mestre"
  },
  {
    "id": "prob_41_paradoxo_cronos_5passos",
    "difficulty": "grao_mestre"
  },
  {
    "id": "prob_42_coroa_entropia_suprema",
    "difficulty": "grao_mestre"
  },
  {
    "id": "prob_43_sinfonia_esmeralda_6passos",
    "difficulty": "grao_mestre"
  },
  {
    "id": "prob_44_julgamento_aurelius_supremo",
    "difficulty": "grao_mestre"
  },
  {
    "id": "prob_45_quebra_dupla_dominio_reanimacao",
    "difficulty": "grao_mestre"
  },
  {
    "id": "prob_46_cadeia_mercenario_ruptura_dominio",
    "difficulty": "grao_mestre"
  },
  {
    "id": "prob_47_cataclismo_furia_ascensao_dupla",
    "difficulty": "grao_mestre"
  },
  {
    "id": "prob_48_convergencia_cinco_dominios",
    "difficulty": "grao_mestre"
  },
  {
    "id": "prob_49_colapso_duplo_8dano_mais_dominio",
    "difficulty": "grao_mestre"
  },
  {
    "id": "prob_50_convergencia_vulcanis_30dano",
    "difficulty": "grao_mestre"
  },
  {
    "id": "prob_ext_gm_01_dragao_esmeralda_6passos",
    "difficulty": "grao_mestre"
  },
  {
    "id": "prob_ext_gm_02_tributo_10hp_reanimacao_conde",
    "difficulty": "grao_mestre"
  },
  {
    "id": "prob_ext_gm_03_pedra_filosofal_forja_dominio",
    "difficulty": "grao_mestre"
  },
  {
    "id": "prob_ext_gm_04_codice_astral_quatro_feiticos",
    "difficulty": "grao_mestre"
  },
  {
    "id": "prob_ext_gm_05_manobra_tripla_cidadela_aurora",
    "difficulty": "grao_mestre"
  },
  {
    "id": "prob_ext_gm_06_exumacao_dupla_cripta_lich",
    "difficulty": "grao_mestre"
  },
  {
    "id": "prob_ext_gm_07_quebra_concentracao_fenix_suspiro",
    "difficulty": "grao_mestre"
  },
  {
    "id": "prob_ext_gm_08_inversao_gravitacional_dominio_pacto",
    "difficulty": "grao_mestre"
  },
  {
    "id": "prob_ext_gm_09_convergencia_astral_safira_codice",
    "difficulty": "grao_mestre"
  },
  {
    "id": "prob_ext_gm_10_apoteose_100_soberanos",
    "difficulty": "grao_mestre"
  },
  {
    "id": "prob_ext_gm_11_cryonax_combo_cronos",
    "difficulty": "grao_mestre"
  },
  {
    "id": "prob_ext_gm_12_apoteose_roda_e_armada",
    "difficulty": "grao_mestre"
  },
  {
    "id": "prob_champ_01_chama_celeste",
    "difficulty": "campeoes_torneio"
  },
  {
    "id": "prob_champ_02_artilharia_mercurio",
    "difficulty": "campeoes_torneio"
  },
  {
    "id": "prob_champ_03_corte_lua_sangrenta",
    "difficulty": "campeoes_torneio"
  },
  {
    "id": "prob_champ_04_convergencia_roda",
    "difficulty": "campeoes_torneio"
  },
  {
    "id": "prob_champ_05_cratera_prismatica",
    "difficulty": "campeoes_torneio"
  },
  {
    "id": "prob_champ_06_bastiao_eclipse",
    "difficulty": "campeoes_torneio"
  }
];

export function isProblemTierUnlocked(
  tier: ProblemDifficultyTier,
  solvedIdsInput?: string[]
): boolean {
  if (tier === 'campeoes_torneio') return true;
  const tierIdx = PROBLEM_TIERS_ORDER.indexOf(tier);
  if (tierIdx <= 0) return true;
  const solvedSet = new Set(solvedIdsInput ?? getSolvedProblemIds());
  for (let i = 0; i < tierIdx; i++) {
    const prevTier = PROBLEM_TIERS_ORDER[i];
    if (prevTier === 'campeoes_torneio') continue;
    const prevTierProblems = PROBLEM_ROSTER_LITE.filter((p) => p.difficulty === prevTier);
    const allPrevSolved = prevTierProblems.every((p) => solvedSet.has(p.id));
    if (!allPrevSolved) return false;
  }
  return true;
}

export function markProblemAsSolved(problemId: string): {
  isFirstTime: boolean;
  allSolved: string[];
  entry: ProblemHistoryEntry;
  unlockedNewTier: ProblemDifficultyTier | null;
} {
  const current = getSolvedProblemIds();
  const map = getProblemHistoryMap();
  const now = new Date().toISOString();
  const existing = map[problemId];
  const isFirstTime = !current.includes(problemId);

  const unlockedBefore = new Set(
    PROBLEM_TIERS_ORDER.filter((t) => isProblemTierUnlocked(t, current))
  );

  const updatedSolved = isFirstTime ? [...current, problemId] : current;
  if (isFirstTime && typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(SOLVED_PROBLEMS_STORAGE_KEY, JSON.stringify(updatedSolved));
    } catch {
      // ignore storage errors
    }
  }

  const priorFailures = existing?.failures ?? 0;
  const priorHints = existing?.maxHintStageUsed ?? 0;
  const solvedOnFirstTry = existing?.solved
    ? existing.solvedOnFirstTry
    : priorFailures === 0 && priorHints === 0;

  const entry: ProblemHistoryEntry = {
    problemId,
    attempts: (existing?.attempts ?? 0) + 1,
    failures: priorFailures,
    solved: true,
    solvedOnFirstTry,
    maxHintStageUsed: priorHints,
    lastAttemptAt: now,
    firstSolvedAt: existing?.firstSolvedAt ?? now,
  };
  map[problemId] = entry;
  saveProblemHistoryMap(map);

  let unlockedNewTier: ProblemDifficultyTier | null = null;
  for (const t of PROBLEM_TIERS_ORDER) {
    if (!unlockedBefore.has(t) && isProblemTierUnlocked(t, updatedSolved)) {
      unlockedNewTier = t;
    }
  }

  return { isFirstTime, allSolved: updatedSolved, entry, unlockedNewTier };
}
