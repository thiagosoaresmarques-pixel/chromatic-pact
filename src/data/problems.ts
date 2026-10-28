import { ALL_CARDS, CARDS_BY_ID } from './cards';
import {
  addUnitToSlot,
  createInitialGameState,
  getAllBoardUnits,
  getDomainExpansionSpec,
  recalculateFormationBonuses,
} from '../engine/gameEngine';
import { BoardUnit, CardDefinition, Domain, GameState, RowType } from '../types/game';

export type ProblemDifficultyTier =
  | 'iniciante'
  | 'intermediario'
  | 'avancado'
  | 'mestre'
  | 'grao_mestre';

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
  // Initial deterministic board & hand setup
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
    description: 'Fundamentos de posicionamento (Cobertura e Invasão), Relíquias de Retaguarda, Ascensão e Expansão de Domínio.',
  },
  intermediario: {
    label: 'Grau II • Intermediário',
    starsText: '★★☆☆☆',
    color: '#38bdf8',
    bg: 'rgba(56, 189, 248, 0.14)',
    border: 'rgba(56, 189, 248, 0.45)',
    description: 'Sequenciamento de Feitiços geradores de Essência, Reanimação da Cripta e Escolha de Alvo Manual sob Domínio.',
  },
  avancado: {
    label: 'Grau III • Avançado',
    starsText: '★★★☆☆',
    color: '#facc15',
    bg: 'rgba(250, 204, 21, 0.14)',
    border: 'rgba(250, 204, 21, 0.45)',
    description: 'Desempate de Confronto de Domínios 50/50 por Afinidade (7 vs 6), Quebra de Concentração (8+ Dano) e Combustão de Mana.',
  },
  mestre: {
    label: 'Grau IV • Mestre',
    starsText: '★★★★☆',
    color: '#fb923c',
    bg: 'rgba(251, 146, 60, 0.14)',
    border: 'rgba(251, 146, 60, 0.45)',
    description: 'Sacrifício de Terreno para Quebrar Domínio Rival, Pacto de Sangue no limite da vida e Manobras de Fileira [⇄].',
  },
  grao_mestre: {
    label: 'Grau V • Grão-Mestre Soberano',
    starsText: '★★★★★',
    color: '#e879f9',
    bg: 'rgba(217, 70, 239, 0.16)',
    border: 'rgba(232, 121, 249, 0.55)',
    description: 'Quebra-cabeças de 5 a 6 ações encadeadas onde um único erro de 1⚡ ou 1 coluna deixa o Soberano rival vivo.',
  },
};

function resolveProblemCard(cardId: string): CardDefinition {
  return CARDS_BY_ID[cardId] ?? ALL_CARDS[0];
}

export const TACTICAL_PROBLEMS: TacticalProblem[] = [
  // ============================================================================
  // GRAU I — INICIANTE (★☆☆☆☆)
  // ============================================================================
  {
    id: 'prob_01_forja_impeto',
    number: 1,
    code: 'PROBLEMA #01',
    title: 'O Despertar da Caldeira',
    subtitle: 'Relíquia de Forja + Expansão de Domínio Carmesim para ignorar a Muralha',
    difficulty: 'iniciante',
    difficultyLabel: 'Grau I • Iniciante',
    stars: 1,
    goldReward: 25,
    primaryDomain: 'red',
    mechanicTag: '⛩️ Expansão de Domínio & Relíquia [R]',
    scenarioLore:
      'O General de Ouro ergueu uma Muralha com Guarda e Escudo Divino na Vanguarda, protegendo seus 18 Pontos de Vida. Se você atacar normalmente, seus guerreiros baterão no tanque inimigo.',
    objectiveText: 'Derrote o Soberano rival (18 ❤️) neste turno.',
    hint1:
      'A Relíquia Bigorna do Rei da Fornalha concede +1/+1 aos seus aliados e invoca uma Cria Dracônica 2/1 quando instalada na Retaguarda [R].',
    hint2:
      '1º Instale a Bigorna do Rei da Fornalha na Retaguarda [R] (4⚡). 2º Ative a Expansão de Domínio Carmesim (⛩️ 3⚡) para dar +1/+1, Ímpeto e Acerto Garantido a todos (totalizando 5 + 5 + 4 + 4 = 18 de dano direto no Soberano!).',
    solutionSteps: [
      '1. Selecione a Bigorna do Rei da Fornalha na mão e posicione-a na Retaguarda [R] (gasta 4⚡, dá +1/+1 aos aliados e cria uma Cria Dracônica 2/1).',
      '2. Clique em "⛩️ 6/6" na barra inferior (ou abra Terrenos) para invocar a Caldeira do Fogo Primordial (gasta 3⚡): todas as suas 4 criaturas recebem +1/+1, Ímpeto e Acerto Garantido!',
      '3. Clique em "⚔️ ATACAR": com o Acerto Garantido ativo, suas 4 criaturas ignoram a Guarda rival e causam 5 + 5 + 4 + 4 = 18 de dano letal ao Soberano!',
    ],
    whyIndefensible:
      'Se você invocar a Expansão de Domínio mas não instalar a Bigorna na Retaguarda, causará apenas 11 de dano. Se atacar antes de expandir o Domínio, ficará preso na Guarda com Escudo Divino.',
    turnNumber: 6,
    p1Name: 'Ignis Rex (Você)',
    p1AvatarCardId: 'red_157_dragao_tiamat_carmesim',
    p1Hp: 24,
    p1Essence: 7,
    p1MaxEssence: 7,
    p1Affinities: { red: 6, blue: 0, purple: 0, green: 0, gold: 0, neutral: 0 },
    p1HandCardIds: ['red_36_bigorna_fogo', 'red_05_salamandra'],
    p1DeckTopCardIds: ['red_01_kobold', 'red_02_magmin'],
    p1ChanneledCardIds: [
      'red_01_kobold',
      'red_02_magmin',
      'red_03_mastim_infernal',
      'red_04_meio_dragao',
      'red_10_altar_draconico',
      'red_18_marechal_rubro',
    ],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'red_04_meio_dragao', row: 'vanguard', slotIndex: 1 },
      { cardId: 'red_03_mastim_infernal', row: 'vanguard', slotIndex: 2 },
      { cardId: 'red_01_kobold', row: 'vanguard', slotIndex: 4 },
    ],
    p2Name: 'Bastião de Aurelius',
    p2Title: 'Guardião da Cidadela',
    p2AvatarCardId: 'gold_157_dragao_soberano_alvorada',
    p2Domain: 'gold',
    p2Hp: 18,
    p2Essence: 0,
    p2MaxEssence: 6,
    p2Affinities: { red: 0, blue: 0, purple: 0, green: 0, gold: 5, neutral: 0 },
    p2Units: [
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 1, hasDivineShield: true },
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 2, hasDivineShield: true },
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 4, hasDivineShield: true },
    ],
  },
  {
    id: 'prob_02_cobertura_invasao',
    number: 2,
    code: 'PROBLEMA #02',
    title: 'Geometria de Cobertura e Invasão',
    subtitle: 'O posicionamento exato na grade 6×4 decide entre 11 e 12 de dano',
    difficulty: 'iniciante',
    difficultyLabel: 'Grau I • Iniciante',
    stars: 1,
    goldReward: 25,
    primaryDomain: 'red',
    mechanicTag: '📐 Cobertura (+1⚔️) & Invasão (+1⚔️)',
    scenarioLore:
      'O Soberano rival tem exatos 12 ❤️ e nenhuma Guarda ativa, mas uma criatura inimiga ocupa a Coluna 2 da Vanguarda. Você tem apenas 2⚡ de Essência para fechar os 12 de dano.',
    objectiveText: 'Alcance exatos 12 de dano neste turno usando os bônus de coluna da grade 6×4.',
    hint1:
      'Lembre-se das regras de formação da mesa: uma unidade na Vanguarda [V] ganha +1⚔️ de Invasão se a Vanguarda inimiga daquela coluna estiver vazia, e +1⚔️ de Cobertura se houver um aliado na Retaguarda [R] da mesma coluna!',
    hint2:
      '1º Invoque o Batedor Escamado das Brasas (1⚡, Ímpeto, causa 1 de dano ao entrar) numa coluna VAZIA da Vanguarda [V] (ex: Coluna 1 onde já há suporte na Retaguarda, ganhando +1⚔️ Invasão e +1⚔️ Cobertura = 4 ATQ!). 2º Invoque o Diabrete (1⚡) na Retaguarda [R] da Coluna 3 para dar +1⚔️ de Cobertura ao Mastim das Cinzas na Vanguarda!',
    solutionSteps: [
      '1. Invoque o Batedor Escamado das Brasas (1⚡) na Vanguarda [V] da Coluna 1 (que tem o Altar Dracônico na Retaguarda e está livre na frente): causa 1 de dano ao entrar e fica com 5⚔️ ATQ (2 base + 1 Altar + 1 Invasão + 1 Cobertura).',
      '2. Invoque o Diabrete de Escória (1⚡) na Retaguarda [R] da Coluna 3 (atrás do Mastim das Cinzas): isso concede +1⚔️ de Cobertura ao Mastim, elevando-o para 6⚔️ ATQ (3 base + 1 Altar + 1 Invasão + 1 Cobertura).',
      '3. Ataque o Soberano rival com o Mastim (6⚔️) e o Batedor (5⚔️): 1 (entrada) + 6 + 5 = 12 de dano cravado!',
    ],
    whyIndefensible:
      'Se você colocar o Batedor na Coluna 2 (bloqueada por inimigo) ou esquecer de dar Cobertura na Retaguarda da Coluna 3, faltará 1 ou 2 de dano e o rival sobreviverá com 1 ❤️.',
    turnNumber: 4,
    p1Name: 'Comandante de Pyros',
    p1AvatarCardId: 'red_04_meio_dragao',
    p1Hp: 20,
    p1Essence: 2,
    p1MaxEssence: 4,
    p1Affinities: { red: 3, blue: 0, purple: 0, green: 0, gold: 0, neutral: 0 },
    p1HandCardIds: ['red_01_kobold', 'red_02_magmin'],
    p1DeckTopCardIds: ['red_03_mastim_infernal'],
    p1ChanneledCardIds: ['red_01_kobold', 'red_02_magmin', 'red_03_mastim_infernal'],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'red_10_altar_draconico', row: 'rearguard', slotIndex: 0 },
      { cardId: 'red_03_mastim_infernal', row: 'vanguard', slotIndex: 2 },
    ],
    p2Name: 'Vigia de Vaeloria',
    p2Title: 'Sentinela da Fronteira',
    p2AvatarCardId: 'green_07_troll',
    p2Domain: 'green',
    p2Hp: 12,
    p2Essence: 0,
    p2MaxEssence: 4,
    p2Affinities: { red: 0, blue: 0, purple: 0, green: 3, gold: 0, neutral: 0 },
    p2Units: [
      { cardId: 'green_07_troll', row: 'vanguard', slotIndex: 1, damageTaken: 2 },
    ],
  },
  {
    id: 'prob_03_ascensao_draconica',
    number: 3,
    code: 'PROBLEMA #03',
    title: 'O Juramento de Asas e Fogo',
    subtitle: 'Ascensão em campo (★) para ganhar Voo e sobrevoar a Guarda terrestre',
    difficulty: 'iniciante',
    difficultyLabel: 'Grau I • Iniciante',
    stars: 1,
    goldReward: 25,
    primaryDomain: 'red',
    mechanicTag: '★ Ascensão & Voo sobre Guarda',
    scenarioLore:
      'Uma Muralha de Aço inimiga com Guarda terrestre protege o Soberano rival (9 ❤️). Seu Campeão Dracônico está na Coluna 2 de frente para a Muralha, e você tem 6⚡ de Essência.',
    objectiveText: 'Sobrevoe a Guarda terrestre inimiga e cause 9 de dano ao Soberano rival neste turno.',
    hint1:
      'Inspecione o seu Campeão Dracônico em campo: a habilidade ★ Ascensão (4⚡) o transforma em Soberano Meio-Dragão Ascendido (7/7 com Voo e Atropelar!). Unidades com Voo ignoram Guardiões terrestres sem Alcance!',
    hint2:
      '1º Clique no Campeão Dracônico na Vanguarda e ative "★ Ascender (4⚡)" — ele passa a ter 7⚔️ ATQ (+1⚔️ Cobertura = 8⚔️) e Voo! 2º Ative o Poder do Soberano ("🔥 2⚡" na barra inferior) ou invoque o Batedor Escamado (1⚡, causa 1 de dano ao entrar) e ataque diretamente o Soberano rival com o Meio-Dragão Ascendido!',
    solutionSteps: [
      '1. Clique no Campeão Dracônico na Vanguarda [V] e escolha "★ Ascender (4⚡)": ele desperta como Soberano Meio-Dragão Ascendido (7⚔️ base + 1⚔️ Cobertura = 8⚔️ ATQ e Voo).',
      '2. Jogue o Batedor Escamado das Brasas (1⚡) da mão em qualquer slot: seu efeito Ao Entrar causa 1 de dano direto ao Soberano rival (9 ❤️ → 8 ❤️).',
      '3. Ataque diretamente o Soberano rival com o Soberano Meio-Dragão Ascendido (graças ao Voo, ele ignora a Muralha terrestre!) causando 8 de dano letal!',
    ],
    whyIndefensible:
      'Se você não Ascender o Campeão Dracônico, ele não terá Voo e será obrigado a atacar a Muralha com Guarda.',
    turnNumber: 6,
    p1Name: 'Ignis Rex (Você)',
    p1AvatarCardId: 'red_04_meio_dragao',
    p1Hp: 22,
    p1Essence: 5,
    p1MaxEssence: 6,
    p1Affinities: { red: 4, blue: 0, purple: 0, green: 0, gold: 0, neutral: 0 },
    p1HandCardIds: ['red_01_kobold'],
    p1DeckTopCardIds: ['red_03_mastim_infernal'],
    p1ChanneledCardIds: ['red_01_kobold', 'red_02_magmin', 'red_03_mastim_infernal', 'red_04_meio_dragao'],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'red_04_meio_dragao', row: 'vanguard', slotIndex: 1 },
      { cardId: 'red_02_magmin', row: 'rearguard', slotIndex: 1, hasSummoningSickness: true },
    ],
    p2Name: 'Templário da Muralha',
    p2Title: 'Escudo do Sol',
    p2AvatarCardId: 'gold_26_muralha_aco',
    p2Domain: 'gold',
    p2Hp: 9,
    p2Essence: 0,
    p2MaxEssence: 5,
    p2Affinities: { red: 0, blue: 0, purple: 0, green: 0, gold: 4, neutral: 0 },
    p2Units: [
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 1, hasDivineShield: true },
    ],
  },

  // ============================================================================
  // GRAU II — INTERMEDIÁRIO (★★☆☆☆)
  // ============================================================================
  {
    id: 'prob_04_ruptura_relogio_astral',
    number: 4,
    code: 'PROBLEMA #04',
    title: 'Aceleração do Relógio Astral',
    subtitle: 'Usar feitiço gerador de Essência (+2⚡) para viabilizar Expansão + Dragão no mesmo turno',
    difficulty: 'intermediario',
    difficultyLabel: 'Grau II • Intermediário',
    stars: 2,
    goldReward: 40,
    primaryDomain: 'blue',
    mechanicTag: '❄️ Feitiço de Estase (+2⚡) & Expansão',
    scenarioLore:
      'O Soberano Rubro tem 16 ❤️. Você tem apenas 4⚡ de Essência disponíveis agora, mas precisa tanto invocar o Olho do Maelstrom Astral (3⚡) quanto trazer a Salamandra do Topo do Grimório.',
    objectiveText: 'Gere Essência extra com a Ruptura do Relógio Astral e alcance 16 de dano letal neste turno.',
    hint1:
      'Olhe para o feitiço Ruptura do Relógio Astral na sua mão: ele custa 3⚡, mas restaura +2⚡ de Essência e compra 1 carta — ou seja, seu custo líquido é de apenas 1⚡!',
    hint2:
      '1º Lance Ruptura do Relógio Astral (gasta 3⚡, ganha +2⚡ → fica com 3⚡ e compra o Batedor Escamado!). 2º Invoque a Expansão de Domínio Olho do Maelstrom Astral (3⚡): seu Arquimago do Vórtice e o Dragão de Safira em campo ganham +1/+1 e Acerto Garantido (6 + 10 = 16 de dano direto no Soberano!).',
    solutionSteps: [
      '1. Lance o feitiço Ruptura do Relógio Astral (3⚡): congela os inimigos, devolve +2⚡ de Essência e ativa o gatilho de feitiço do Arquimago do Vórtice!',
      '2. Com os 3⚡ restantes, invoque a Expansão de Domínio Olho do Maelstrom Astral (⛩️ 3⚡): todas as suas unidades recebem +1/+1, Ímpeto e Acerto Garantido.',
      '3. Ataque diretamente o Soberano rival com o Arquimago do Vórtice e o Dragão de Safira Sônico para 16 de dano letal!',
    ],
    whyIndefensible:
      'Se você invocar a Expansão de Domínio primeiro (gastando 3⚡ dos seus 4⚡), sobrará apenas 1⚡ e você não conseguirá lançar a Ruptura do Relógio Astral.',
    turnNumber: 7,
    p1Name: 'Hydrissa (Você)',
    p1AvatarCardId: 'blue_154_dragao_safira_soberano',
    p1Hp: 24,
    p1Essence: 4,
    p1MaxEssence: 7,
    p1Affinities: { red: 0, blue: 6, purple: 0, green: 0, gold: 0, neutral: 0 },
    p1HandCardIds: ['blue_141_ruptura_temporal'],
    p1DeckTopCardIds: ['red_01_kobold', 'blue_37_mago_aprendiz'],
    p1ChanneledCardIds: [
      'blue_37_mago_aprendiz',
      'blue_136_leviata_cronos',
      'blue_141_ruptura_temporal',
      'blue_152_arquimago_vortice',
      'blue_146_trono_inverno_eterno',
      'blue_161_singularidade_temporal',
    ],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'blue_152_arquimago_vortice', row: 'vanguard', slotIndex: 1 },
      { cardId: 'blue_154_dragao_safira_soberano', row: 'vanguard', slotIndex: 3 },
    ],
    p2Name: 'Senhor das Cinzas',
    p2Title: 'Tirano Vulcânico',
    p2AvatarCardId: 'red_157_dragao_tiamat_carmesim',
    p2Domain: 'red',
    p2Hp: 16,
    p2Essence: 0,
    p2MaxEssence: 7,
    p2Affinities: { red: 5, blue: 0, purple: 0, green: 0, gold: 0, neutral: 0 },
    p2Units: [
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 1 },
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 3 },
    ],
  },
  {
    id: 'prob_05_sinfonia_cripta',
    number: 5,
    code: 'PROBLEMA #05',
    title: 'Dobram os Sinos da Cripta',
    subtitle: 'Ordem exata entre Reanimação, Relíquia Necrótica e Expansão do Trono de Ossos',
    difficulty: 'intermediario',
    difficultyLabel: 'Grau II • Intermediário',
    stars: 2,
    goldReward: 40,
    primaryDomain: 'purple',
    mechanicTag: '💀 Cripta, Relíquia [R] & Domínio',
    scenarioLore:
      'O Titã Silvestre tem 18 ❤️ e um Troll bloqueando a Vanguarda. Você tem a Dama das Seis Lâminas e o Lich em campo, e o Campanário dos Mortos na mão.',
    objectiveText: 'Combine o Campanário dos Mortos e o Eclipse do Trono de Ossos para causar 18 de dano letal.',
    hint1:
      'O Campanário dos Mortos (4⚡) deve entrar na Retaguarda [R] para conceder +1/+1 imediato aos seus aliados e +1⚔️ de Cobertura à coluna onde for instalado!',
    hint2:
      '1º Instale o Campanário dos Mortos (4⚡) na Retaguarda [R] da Coluna 2 (atrás da Dama das Seis Lâminas, dando +1/+1 global e +1⚔️ Cobertura!). 2º Invoque a Expansão de Domínio Eclipse do Trono de Ossos (3⚡): suas unidades ganham +1/+1 e Acerto Garantido, somando 18 de dano direto ao Soberano!',
    solutionSteps: [
      '1. Instale o Campanário dos Mortos (4⚡) na Retaguarda [R] da Coluna 2 (atrás da Dama das Seis Lâminas): concede +1/+1 a todos os aliados e +1⚔️ de Cobertura.',
      '2. Invoque a Expansão de Domínio Eclipse do Trono de Ossos (⛩️ 3⚡): todas as unidades recebem +1/+1, Ímpeto e Acerto Garantido.',
      '3. Ataque diretamente o Soberano rival com toda a Vanguarda (Dama das Seis Lâminas + Lich + Mastim) para 18+ de dano letal!',
    ],
    whyIndefensible:
      'Colocar o Campanário em uma coluna sem atacante na Vanguarda desperdiça o bônus de +1⚔️ de Cobertura.',
    turnNumber: 7,
    p1Name: 'Vesperion, Arquilich (Você)',
    p1AvatarCardId: 'purple_156_lich_coroa_entropia',
    p1Hp: 20,
    p1Essence: 7,
    p1MaxEssence: 7,
    p1Affinities: { red: 0, blue: 0, purple: 6, green: 0, gold: 0, neutral: 0 },
    p1HandCardIds: ['purple_126_campanario_mortos'],
    p1DeckTopCardIds: ['purple_07_lich'],
    p1ChanneledCardIds: [
      'purple_07_lich',
      'purple_25_dama_seis_laminas',
      'purple_68_exumar_legiao',
      'purple_126_campanario_mortos',
      'purple_123_eclipse_abissal',
      'purple_138_soberano_carnica',
    ],
    p1CryptCardIds: ['purple_138_soberano_carnica'],
    p1Units: [
      { cardId: 'purple_25_dama_seis_laminas', row: 'vanguard', slotIndex: 1 },
      { cardId: 'purple_07_lich', row: 'vanguard', slotIndex: 3 },
      { cardId: 'red_03_mastim_infernal', row: 'vanguard', slotIndex: 4 },
    ],
    p2Name: 'Vorágine Silvestre',
    p2Title: 'Guardião da Mata Antiga',
    p2AvatarCardId: 'green_09_hidra',
    p2Domain: 'green',
    p2Hp: 18,
    p2Essence: 0,
    p2MaxEssence: 7,
    p2Affinities: { red: 0, blue: 0, purple: 0, green: 5, gold: 0, neutral: 0 },
    p2Units: [
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 1 },
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 3 },
    ],
  },
  {
    id: 'prob_06_trono_imperial_aurora',
    number: 6,
    code: 'PROBLEMA #06',
    title: 'A Falange do Imperador Eterno',
    subtitle: 'Sinergia entre Trono Supremo do Imperador (+1/+2) e Cidadela da Aurora',
    difficulty: 'intermediario',
    difficultyLabel: 'Grau II • Intermediário',
    stars: 2,
    goldReward: 40,
    primaryDomain: 'gold',
    mechanicTag: '☀️ Relíquia Imperial & Cidadela da Aurora',
    scenarioLore:
      'O Soberano do Abismo está com 16 ❤️ protegido por duas Muralhas. Você possui 8⚡ de Essência, o Trono Supremo do Imperador Eterno (5⚡) na mão e 6/6 de Afinidade Solar.',
    objectiveText: ' Combine o Trono do Imperador Eterno e a Cidadela da Aurora para alcançar 16 de dano letal.',
    hint1:
      'O Trono Supremo do Imperador Eterno custa 5⚡ e concede +1/+2 e Escudo Divino a todos os aliados quando entra em campo. Sobram exatos 3⚡ para a Expansão de Domínio!',
    hint2:
      '1º Posicione o Trono Supremo do Imperador Eterno (5⚡) na Retaguarda [R] da Coluna 2 (dando +1/+2 a todos e +1⚔️ Cobertura ao Dragão de Ouro!). 2º Invoque a Cidadela da Aurora Inabalável (⛩️ 3⚡) e ataque diretamente o Soberano rival!',
    solutionSteps: [
      '1. Posicione o Trono Supremo do Imperador Eterno (5⚡) na Retaguarda [R] atrás de uma de suas unidades na Vanguarda: concede +1/+2 a toda a falange e +1⚔️ de Cobertura.',
      '2. Invoque a Expansão de Domínio Cidadela da Aurora Inabalável (⛩️ 3⚡): concede mais +1/+1, Ímpeto e Acerto Garantido.',
      '3. Ataque diretamente o Soberano rival com suas 3 unidades da Vanguarda para 16+ de dano letal!',
    ],
    whyIndefensible:
      'Com 5⚡ do Trono + 3⚡ da Cidadela da Aurora, todas as suas unidades ignoram os Guardiões inimigos via Acerto Garantido.',
    turnNumber: 8,
    p1Name: 'Aurelius (Você)',
    p1AvatarCardId: 'gold_157_dragao_soberano_alvorada',
    p1Hp: 26,
    p1Essence: 8,
    p1MaxEssence: 8,
    p1Affinities: { red: 0, blue: 0, purple: 0, green: 0, gold: 6, neutral: 0 },
    p1HandCardIds: ['gold_146_trono_imperador_eterno'],
    p1DeckTopCardIds: ['gold_07_dragao_ouro'],
    p1ChanneledCardIds: [
      'gold_26_muralha_aco',
      'gold_07_dragao_ouro',
      'gold_146_trono_imperador_eterno',
      'gold_160_decreto_invulnerabilidade',
      'gold_26_muralha_aco',
      'gold_07_dragao_ouro',
    ],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 1 },
      { cardId: 'gold_07_dragao_ouro', row: 'vanguard', slotIndex: 2 },
      { cardId: 'red_03_mastim_infernal', row: 'vanguard', slotIndex: 4 },
    ],
    p2Name: 'Arconte do Eclipse',
    p2Title: 'Senhor das Sombras',
    p2AvatarCardId: 'purple_07_lich',
    p2Domain: 'purple',
    p2Hp: 16,
    p2Essence: 0,
    p2MaxEssence: 8,
    p2Affinities: { red: 0, blue: 0, purple: 5, green: 0, gold: 0, neutral: 0 },
    p2Units: [
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 1, hasDivineShield: true },
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 2, hasDivineShield: true },
    ],
  },

  // ============================================================================
  // GRAU III — AVANÇADO (★★★☆☆)
  // ============================================================================
  {
    id: 'prob_07_desempate_dominio_7v6',
    number: 7,
    code: 'PROBLEMA #07',
    title: 'Supremacia 7 contra 6 (Quebra de Confronto 50/50)',
    subtitle: 'Canalizar o 7º Terreno para estilhaçar o Confronto de Domínios 50/50 e reativar o Acerto Garantido',
    difficulty: 'avancado',
    difficultyLabel: 'Grau III • Avançado',
    stars: 3,
    goldReward: 60,
    primaryDomain: 'gold',
    mechanicTag: '⚡⛩️ Confronto 50/50 → Supremacia 7 vs 6',
    scenarioLore:
      'A mesa está travada num Confronto de Domínios 50/50 (6 vs 6 de Afinidade)! Enquanto o Confronto 50/50 persistir, o seu Acerto Garantido está ANULADO e duas Muralhas com Escudo Divino bloqueiam seus atacantes. O Soberano rival tem 22 ❤️.',
    objectiveText: 'Rompa o Confronto 50/50 por superioridade de Afinidade (7 vs 6) e cause 22 de dano letal!',
    hint1:
      'Em um Confronto de Domínios 50/50, se um dos Soberanos aumentar sua Afinidade do Domínio ativo para superar o rival (7 vs 6), o domínio inimigo é estilhaçado imediatamente!',
    hint2:
      '1º Selecione o Decreto de Invulnerabilidade (ou qualquer carta Dourada que não seja Aurelius) na mão e clique em "⛰️ Canalizar [C]": sua Afinidade Dourada sobe para 7 vs 6, estilhaçando o domínio roxo rival e reativando seu Acerto Garantido! 2º Invoque Aurelius, Soberano da Alvorada na Vanguarda [V] (+2/+2 para todos!) e ataque o Soberano rival para 25 de dano!',
    solutionSteps: [
      '1. Selecione o Decreto de Invulnerabilidade na mão e clique em "⛰️ Canalizar [C]": sua Afinidade Solar sobe de 6 para 7 (7 vs 6), estilhaçando a barreira roxa do rival automaticamente e restaurando seu Acerto Garantido!',
      '2. Invoque Aurelius, Dragão Soberano da Alvorada na Vanguarda [V] (8⚡): ele concede +2/+2 a todos os seus aliados e ganha +1/+1 e Ímpeto da Cidadela da Aurora!',
      '3. Ataque diretamente o Soberano rival com toda a sua Vanguarda (4 + 9 + 11 = 24+ de dano com Acerto Garantido)!',
    ],
    whyIndefensible:
      'Se você invocar Aurelius sem antes Canalizar uma carta Dourada para 7 de Afinidade, o Confronto 50/50 continuará ativo (anulando o Acerto Garantido) e seus ataques pararão nas Muralhas com Escudo Divino.',
    turnNumber: 8,
    p1Name: 'Aurelius (Você)',
    p1AvatarCardId: 'gold_157_dragao_soberano_alvorada',
    p1Hp: 22,
    p1Essence: 8,
    p1MaxEssence: 8,
    p1Affinities: { red: 0, blue: 0, purple: 0, green: 0, gold: 6, neutral: 0 },
    p1HandCardIds: ['gold_157_dragao_soberano_alvorada', 'gold_160_decreto_invulnerabilidade'],
    p1DeckTopCardIds: ['gold_07_dragao_ouro', 'gold_26_muralha_aco'],
    p1ChanneledCardIds: [
      'gold_26_muralha_aco',
      'gold_07_dragao_ouro',
      'gold_146_trono_imperador_eterno',
      'gold_160_decreto_invulnerabilidade',
      'gold_26_muralha_aco',
      'gold_07_dragao_ouro',
    ],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 1 },
      { cardId: 'gold_07_dragao_ouro', row: 'vanguard', slotIndex: 2 },
    ],
    p2Name: 'Monarca dos Três Crânios',
    p2Title: 'Soberano do Eclipse',
    p2AvatarCardId: 'purple_157_dragao_sombra_abissal',
    p2Domain: 'purple',
    p2Hp: 22,
    p2Essence: 0,
    p2MaxEssence: 8,
    p2Affinities: { red: 0, blue: 0, purple: 6, green: 0, gold: 0, neutral: 0 },
    p2Units: [
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 1, hasDivineShield: true },
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 2, hasDivineShield: true },
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 3, hasDivineShield: true },
    ],
    initialDomainState: {
      owner: 'ai',
      domain: 'purple',
      turnsRemaining: 3,
      damageTakenByOwnerThisRound: 0,
      clashRival: {
        owner: 'player',
        domain: 'gold',
        turnsRemaining: 3,
      },
    },
  },
  {
    id: 'prob_08_quebra_concentracao_8dano',
    number: 8,
    code: 'PROBLEMA #08',
    title: 'Colapso da Concentração (Regra dos 8 de Dano)',
    subtitle: 'Causar 8+ de dano ao Soberano rival por Voo para estilhaçar o Domínio dele e enfraquecer sua Guarda',
    difficulty: 'avancado',
    difficultyLabel: 'Grau III • Avançado',
    stars: 3,
    goldReward: 60,
    primaryDomain: 'blue',
    mechanicTag: '💥 Quebra por 8+ Dano no Soberano',
    scenarioLore:
      'O Soberano inimigo está com a Expansão de Domínio ativa (+1/+1 para as tropas dele), deixando o Guardião inimigo na Coluna 2 com 2 ❤️ (graças ao +1/+1 do Domínio rival). Você NÃO tem Afinidade para expandir seu Domínio, mas seu Dragão de Safira tem Voo (9⚔️)!',
    objectiveText: 'Quebre a concentração do Domínio rival causando 8+ de dano com Voo antes de atacar por terra!',
    hint1:
      'Qualquer Soberano que sofra 8 ou mais de dano na mesma rodada perde a concentração e tem sua Expansão de Domínio estilhaçada imediatamente — removendo o bônus de +1/+1 das criaturas dele!',
    hint2:
      '1º Ataque DIRETAMENTE o Soberano rival com o Dragão de Safira Sônico (ele tem Voo, então ignora o Guardião terrestre e causa 9 de dano ao Soberano!). 2º Como o Soberano rival sofreu 9 de dano (>= 8), a Expansão de Domínio dele se estilhaça na hora e o Guardião inimigo perde o +1/+1, ficando com apenas 1 ❤️! 3º Jogue a Salamandra (ou Diabrete) para eliminar o Guardião de 1 ❤️ e ataque o Soberano rival com seu Campeão terrestre para finalizar!',
    solutionSteps: [
      '1. Selecione o Dragão de Safira Sônico (que possui Voo) e ataque diretamente o Soberano rival: causa 9 de dano (15 ❤️ → 6 ❤️) e atinge o limiar de 8+ de dano, estilhaçando a Expansão de Domínio inimiga por perda de concentração!',
      '2. Sem o +1/+1 do Domínio rival, a vida do Guardião inimigo na Coluna 2 cai de 2 ❤️ para 1 ❤️! Invoque a Salamandra do Mar de Brasas (4⚡) mirando seus 2 de dano Ao Entrar no Guardião inimigo para destruí-lo!',
      '3. Com a Coluna 2 agora livre (ganhando +1⚔️ de Invasão!), ataque o Soberano rival com seu Campeão na Coluna 2 para 6 de dano letal!',
    ],
    whyIndefensible:
      'Se você lançar a Salamandra no Guardião ANTES de quebrar o Domínio rival com o ataque aéreo de 9 de dano, o Guardião terá 1 de Armadura + 2 ❤️ do Domínio e sobreviverá, bloqueando seu atacante terrestre!',
    turnNumber: 7,
    p1Name: 'Hydrissa (Você)',
    p1AvatarCardId: 'blue_154_dragao_safira_soberano',
    p1Hp: 18,
    p1Essence: 4,
    p1MaxEssence: 7,
    p1Affinities: { red: 2, blue: 4, purple: 0, green: 0, gold: 0, neutral: 0 },
    p1HandCardIds: ['red_05_salamandra'],
    p1DeckTopCardIds: ['blue_37_mago_aprendiz'],
    p1ChanneledCardIds: ['blue_37_mago_aprendiz', 'blue_152_arquimago_vortice', 'red_01_kobold', 'red_02_magmin'],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'blue_154_dragao_safira_soberano', row: 'vanguard', slotIndex: 4 },
      { cardId: 'red_05_salamandra', row: 'vanguard', slotIndex: 1 },
    ],
    p2Name: 'Vesperion, Arquilich',
    p2Title: 'Senhor do Trono de Ossos',
    p2AvatarCardId: 'purple_07_lich',
    p2Domain: 'purple',
    p2Hp: 15,
    p2Essence: 0,
    p2MaxEssence: 7,
    p2Affinities: { red: 0, blue: 0, purple: 6, green: 0, gold: 0, neutral: 0 },
    p2Units: [
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 1, damageTaken: 5 },
    ],
    initialDomainState: {
      owner: 'ai',
      domain: 'purple',
      turnsRemaining: 2,
      damageTakenByOwnerThisRound: 0,
      clashRival: null,
    },
  },
  {
    id: 'prob_09_combustao_dupla_afinidade',
    number: 9,
    code: 'PROBLEMA #09',
    title: 'Alquimia da Brasas (Canalizar + Sacrificar)',
    subtitle: 'Usar a 1ª carta para Canalizar (6/6 Afinidade) e a 2ª para Queimar (+1⚡ Essência)',
    difficulty: 'avancado',
    difficultyLabel: 'Grau III • Avançado',
    stars: 3,
    goldReward: 60,
    primaryDomain: 'red',
    mechanicTag: '⛰️ Canalizar + 🔥 Queimar por +1⚡',
    scenarioLore:
      'Você está com 5/6 de Afinidade Carmesim e apenas 6⚡ de Essência. Para vencer os 17 ❤️ do rival através das Muralhas dele, você precisa TANTO invocar a Expansão de Domínio (3⚡, exige 6/6 Afinidade) QUANTO instalar a Bigorna do Rei da Fornalha (4⚡) — totalizando 7⚡!',
    objectiveText: 'Consiga a 6ª Afinidade e o 7º ponto de Essência no mesmo turno para jogar Bigorna + Domínio!',
    hint1:
      'A primeira carta que você envia aos Terrenos no turno usa "⛰️ Canalizar [C]" (+1 Afinidade e compra 1 carta). A SEGUNDA carta que você envia no mesmo turno usa "🔥 Sacrificar/Queimar [C]", que concede +1⚡ de Essência temporária neste turno!',
    hint2:
      '1º Canalize o Diabrete (1ª carta → sua Afinidade vai para 6/6 e você compra 1 carta!). 2º Sacrifique/Queime outra carta da mão que não seja a Bigorna (2ª carta → você ganha +1⚡, subindo de 6⚡ para 7⚡!). 3º Instale a Bigorna na Retaguarda (4⚡), invoque a Expansão de Domínio (3⚡) e ataque para 18 de dano!',
    solutionSteps: [
      '1. Selecione uma carta secundária na mão (ex: Diabrete) e clique em "⛰️ Canalizar [C]": sua Afinidade Carmesim sobe de 5 para 6/6 e você compra 1 carta.',
      '2. Selecione outra carta secundária na mão e clique em "🔥 Sacrificar [C]": você queima a carta para ganhar +1⚡ de Essência temporária neste turno (6⚡ → 7⚡)!',
      '3. Instale a Bigorna do Rei da Fornalha na Retaguarda [R] (4⚡), ative a Expansão de Domínio (⛩️ 3⚡) e ataque o Soberano rival para 18 de dano letal!',
    ],
    whyIndefensible:
      'Sem usar a combinação de Canalizar (1ª carta) + Queimar por Mana (2ª carta), é matematicamente impossível ter 6/6 de Afinidade e 7⚡ no mesmo turno.',
    turnNumber: 6,
    p1Name: 'Ignis Rex (Você)',
    p1AvatarCardId: 'red_157_dragao_tiamat_carmesim',
    p1Hp: 20,
    p1Essence: 6,
    p1MaxEssence: 6,
    p1Affinities: { red: 5, blue: 0, purple: 0, green: 0, gold: 0, neutral: 0 },
    p1HandCardIds: ['red_36_bigorna_fogo', 'red_02_magmin', 'red_18_marechal_rubro'],
    p1DeckTopCardIds: ['red_01_kobold', 'red_03_mastim_infernal'],
    p1ChanneledCardIds: [
      'red_01_kobold',
      'red_02_magmin',
      'red_03_mastim_infernal',
      'red_04_meio_dragao',
      'red_10_altar_draconico',
    ],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'red_04_meio_dragao', row: 'vanguard', slotIndex: 1 },
      { cardId: 'red_03_mastim_infernal', row: 'vanguard', slotIndex: 2 },
      { cardId: 'red_01_kobold', row: 'vanguard', slotIndex: 4 },
    ],
    p2Name: 'Arconte de Aço',
    p2Title: 'Muralha Implacável',
    p2AvatarCardId: 'gold_26_muralha_aco',
    p2Domain: 'gold',
    p2Hp: 17,
    p2Essence: 0,
    p2MaxEssence: 6,
    p2Affinities: { red: 0, blue: 0, purple: 0, green: 0, gold: 5, neutral: 0 },
    p2Units: [
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 1, hasDivineShield: true },
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 2, hasDivineShield: true },
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 4, hasDivineShield: true },
    ],
  },

  // ============================================================================
  // GRAU IV — MESTRE (★★★★☆)
  // ============================================================================
  {
    id: 'prob_10_pacto_sangue_limite',
    number: 10,
    code: 'PROBLEMA #10',
    title: 'Pacto de Sangue à Beira do Abismo',
    subtitle: 'Pagar 3 ❤️ no Pacto de Sangue (ficando com 1 ❤️!) para comprar a carta letal e ganhar +1⚡',
    difficulty: 'mestre',
    difficultyLabel: 'Grau IV • Mestre',
    stars: 4,
    goldReward: 80,
    primaryDomain: 'purple',
    mechanicTag: '🩸 Pacto de Sangue (-3❤️ / +1⚡ & Compra)',
    scenarioLore:
      'Você está com apenas 4 ❤️ restantes! O Soberano rival tem 19 ❤️. Sua mão tem o Campanário dos Mortos (4⚡), mas você só tem 6⚡ — falta 1⚡ para conseguir instalar o Campanário (4⚡) E expandir o Eclipse do Trono de Ossos (3⚡)!',
    objectiveText: 'Sobreviva com 1 ❤️ usando o Pacto de Sangue para destravar o combo de 7⚡ e vencer neste turno!',
    hint1:
      'Na barra inferior de comando (ou gaveta de Terrenos), o ritual "🩸 Pacto de Sangue" custa 3 ❤️ do seu Soberano (4 ❤️ → 1 ❤️), mas concede +1⚡ de Essência imediata e compra a carta do topo do seu Grimório!',
    hint2:
      '1º Clique em "🩸 Pacto (+1⚡)" na barra inferior: você cai para 1 ❤️, sobe de 6⚡ para 7⚡ e compra o Batedor Escamado! 2º Instale o Campanário dos Mortos na Retaguarda [R] da Coluna 2 (4⚡). 3º Invoque a Expansão de Domínio Eclipse do Trono de Ossos (⛩️ 3⚡) e ataque o Soberano rival para 19+ de dano!',
    solutionSteps: [
      '1. Ative o ritual "🩸 Pacto (+1⚡)" na barra inferior: seu Soberano sacrifica 3 ❤️ (ficando com 1 ❤️!), ganha +1⚡ (6⚡ → 7⚡) e compra 1 carta.',
      '2. Instale o Campanário dos Mortos (4⚡) na Retaguarda [R] atrás de um de seus atacantes da Vanguarda (+1/+1 global e +1⚔️ Cobertura).',
      '3. Com os 3⚡ restantes, invoque a Expansão de Domínio Eclipse do Trono de Ossos (⛩️ 3⚡) e ataque diretamente o Soberano rival com todas as unidades!',
    ],
    whyIndefensible:
      'Sem o Pacto de Sangue, você tem apenas 6⚡ e não consegue combinar o Campanário (4⚡) com a Expansão de Domínio (3⚡).',
    turnNumber: 7,
    p1Name: 'Vesperion, Arquilich (Você)',
    p1AvatarCardId: 'purple_156_lich_coroa_entropia',
    p1Hp: 4,
    p1Essence: 6,
    p1MaxEssence: 6,
    p1Affinities: { red: 0, blue: 0, purple: 6, green: 0, gold: 0, neutral: 0 },
    p1HandCardIds: ['purple_126_campanario_mortos'],
    p1DeckTopCardIds: ['red_01_kobold', 'purple_07_lich'],
    p1ChanneledCardIds: [
      'purple_07_lich',
      'purple_25_dama_seis_laminas',
      'purple_68_exumar_legiao',
      'purple_126_campanario_mortos',
      'purple_123_eclipse_abissal',
      'purple_138_soberano_carnica',
    ],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'purple_25_dama_seis_laminas', row: 'vanguard', slotIndex: 1 },
      { cardId: 'purple_07_lich', row: 'vanguard', slotIndex: 3 },
      { cardId: 'red_03_mastim_infernal', row: 'vanguard', slotIndex: 4 },
    ],
    p2Name: 'Imperador Dourado',
    p2Title: 'Trono Solar',
    p2AvatarCardId: 'gold_157_dragao_soberano_alvorada',
    p2Domain: 'gold',
    p2Hp: 19,
    p2Essence: 0,
    p2MaxEssence: 7,
    p2Affinities: { red: 0, blue: 0, purple: 0, green: 0, gold: 5, neutral: 0 },
    p2Units: [
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 1, hasDivineShield: true },
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 3, hasDivineShield: true },
    ],
  },
  {
    id: 'prob_11_manobra_fileira_retaguarda',
    number: 11,
    code: 'PROBLEMA #11',
    title: 'A Dança das Fileiras (Manobra ⇄)',
    subtitle: 'Avançar uma criatura da Retaguarda para a Vanguarda [⇄] para habilitar o ataque e receber Cobertura',
    difficulty: 'mestre',
    difficultyLabel: 'Grau IV • Mestre',
    stars: 4,
    goldReward: 80,
    primaryDomain: 'gold',
    mechanicTag: '⇄ Mover Fileira [R → V] & Cobertura',
    scenarioLore:
      'Seu Dragão de Ouro (5⚔️) começou o turno preso na Retaguarda [R] da Coluna 3 — e unidades sem Alcance na Retaguarda NÃO podem atacar! O Soberano rival tem 17 ❤️.',
    objectiveText: 'Avance o Dragão de Ouro para a Vanguarda [⇄], instale o Trono na Retaguarda e cause 17 de dano!',
    hint1:
      'Clique no Dragão de Ouro na Retaguarda [R]: você pode usar a ação tática "⇄ Mover Fileira" gratuitamente (1x por turno por unidade) para avançá-lo à Vanguarda [V] da Coluna 3!',
    hint2:
      '1º Clique no Dragão de Ouro na Retaguarda [R] da Coluna 3 e use "⇄ Mover para Vanguarda" (agora ele pode atacar e ganha +1⚔️ de Invasão!). 2º Instale o Trono Supremo do Imperador Eterno (5⚡) na Retaguarda [R] da Coluna 3 (dando +1/+2 a todos e +1⚔️ de Cobertura ao Dragão!). 3º Ataque com todas as unidades da Vanguarda para 17 de dano!',
    solutionSteps: [
      '1. Clique no Dragão de Ouro na Retaguarda [R] (Coluna 3) e selecione "⇄ Mover Fileira" para avançá-lo à Vanguarda [V].',
      '2. Posicione o Trono Supremo do Imperador Eterno (5⚡) na Retaguarda [R] da Coluna 3 (exatamente atrás do Dragão de Ouro): concede +1/+2 a todos os aliados e +1⚔️ de Cobertura ao Dragão!',
      '3. Ataque o Soberano rival com suas 3 criaturas na Vanguarda para 17 de dano cravado!',
    ],
    whyIndefensible:
      'Se você não mover o Dragão de Ouro da Retaguarda para a Vanguarda antes de atacar, ele ficará impedido de atacar por não possuir Alcance.',
    turnNumber: 6,
    p1Name: 'Aurelius (Você)',
    p1AvatarCardId: 'gold_157_dragao_soberano_alvorada',
    p1Hp: 24,
    p1Essence: 5,
    p1MaxEssence: 6,
    p1Affinities: { red: 0, blue: 0, purple: 0, green: 0, gold: 4, neutral: 0 },
    p1HandCardIds: ['gold_146_trono_imperador_eterno'],
    p1DeckTopCardIds: ['gold_26_muralha_aco'],
    p1ChanneledCardIds: ['gold_26_muralha_aco', 'gold_07_dragao_ouro', 'gold_146_trono_imperador_eterno', 'gold_07_dragao_ouro'],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'gold_07_dragao_ouro', row: 'rearguard', slotIndex: 2 },
      { cardId: 'red_04_meio_dragao', row: 'vanguard', slotIndex: 0 },
      { cardId: 'red_03_mastim_infernal', row: 'vanguard', slotIndex: 4 },
    ],
    p2Name: 'Guardião da Cripta',
    p2Title: 'Vigia Abissal',
    p2AvatarCardId: 'purple_07_lich',
    p2Domain: 'purple',
    p2Hp: 17,
    p2Essence: 0,
    p2MaxEssence: 6,
    p2Affinities: { red: 0, blue: 0, purple: 4, green: 0, gold: 0, neutral: 0 },
    p2Units: [],
  },
  {
    id: 'prob_12_quebra_dominio_sacrificio_terreno',
    number: 12,
    code: 'PROBLEMA #12',
    title: 'Ruptura de Sangue e Pedra (Tributo de 10❤️)',
    subtitle: 'Romper a Expansão de Domínio rival com o Sacrifício de 10❤️ para remover o +1/+1 da Muralha inimiga',
    difficulty: 'mestre',
    difficultyLabel: 'Grau IV • Mestre',
    stars: 4,
    goldReward: 80,
    primaryDomain: 'red',
    mechanicTag: '💥 Romper Domínio (Tributo de 10❤️)',
    scenarioLore:
      'O Soberano rival tem apenas 12 ❤️, mas está sob a Expansão de Domínio dele (que dá +1/+1 à Muralha dele na Coluna 2, deixando-a com 2 ❤️). Você tem apenas 3⚡ de Essência e 4/6 de Afinidade, então não pode invocar seu próprio Domínio.',
    objectiveText: 'Estilhace o Domínio rival com o Tributo Anti-Domínio (💥 10❤️), queime a Muralha com Sopro e finalize!',
    hint1:
      'Quando o inimigo está com a Expansão de Domínio ativa, você pode clicar em "💥 Quebrar Domínio (10❤️)" na barra inferior para sacrificar 10❤️ distribuídos entre seu Soberano e suas unidades e estilhaçar o Domínio rival sem gastar Essência!',
    hint2:
      '1º Clique em "💥 Quebrar Domínio" na barra inferior e confirme o sacrifício (preservando suas criaturas vivas!): o Domínio inimigo se estilhaça e a Muralha inimiga na Coluna 2 perde +1/+1, caindo de 2 ❤️ para 1 ❤️! 2º Invoque o Mastim das Cinzas (2⚡, Ímpeto) e o Batedor Escamado (1⚡, causa 1 de dano ao entrar). 3º Ataque na Coluna 2 com seu Campeão Dracônico (o Sopro 1 destrói a Muralha de 1 ❤️ antes do impacto!) e finalize o Soberano rival!',
    solutionSteps: [
      '1. Clique em "💥 Quebrar Domínio (10❤️)" na barra inferior e confirme o tributo de vida: a Expansão de Domínio inimiga é estilhaçada e a Muralha rival cai de 2 ❤️ para 1 ❤️!',
      '2. Invoque o Mastim das Cinzas (2⚡, Ímpeto) na Vanguarda [V] da Coluna 1 e o Batedor Escamado (1⚡, causa 1 de dano ao Soberano ao entrar) na Coluna 5.',
      '3. Ataque na Coluna 2 com seu Campeão Dracônico: o Sopro 1 queima o último 1 ❤️ da Muralha antes do golpe, abrindo caminho para todos os seus atacantes zerarem os 12 ❤️ do Soberano!',
    ],
    whyIndefensible:
      'Se você não estilhaçar o Domínio rival antes de atacar, a Muralha inimiga terá 2 ❤️ (pelo bônus do Domínio rival), sobreviverá ao Sopro 1 e absorverá o ataque do seu Campeão.',
    turnNumber: 6,
    p1Name: 'Ignis Rex (Você)',
    p1AvatarCardId: 'red_157_dragao_tiamat_carmesim',
    p1Hp: 18,
    p1Essence: 3,
    p1MaxEssence: 6,
    p1Affinities: { red: 4, blue: 0, purple: 0, green: 0, gold: 0, neutral: 0 },
    p1HandCardIds: ['red_03_mastim_infernal', 'red_01_kobold'],
    p1DeckTopCardIds: ['red_02_magmin'],
    p1ChanneledCardIds: [
      'red_01_kobold',
      'red_02_magmin',
      'red_03_mastim_infernal',
      'red_04_meio_dragao',
    ],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'red_04_meio_dragao', row: 'vanguard', slotIndex: 1 },
      { cardId: 'red_03_mastim_infernal', row: 'vanguard', slotIndex: 3 },
    ],
    p2Name: 'Soberano do Inverno',
    p2Title: 'Mestre do Maelstrom',
    p2AvatarCardId: 'blue_154_dragao_safira_soberano',
    p2Domain: 'blue',
    p2Hp: 12,
    p2Essence: 0,
    p2MaxEssence: 6,
    p2Affinities: { red: 0, blue: 6, purple: 0, green: 0, gold: 0, neutral: 0 },
    p2Units: [
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 1, damageTaken: 5 },
    ],
    initialDomainState: {
      owner: 'ai',
      domain: 'blue',
      turnsRemaining: 2,
      damageTakenByOwnerThisRound: 0,
      clashRival: null,
    },
  },

  // ============================================================================
  // GRAU V — GRÃO-MESTRE SOBERANO (★★★★★)
  // ============================================================================
  {
    id: 'prob_13_paradoxo_cronos_5passos',
    number: 13,
    code: 'PROBLEMA #13',
    title: 'O Paradoxo de Cronos (5 Ações Encadeadas)',
    subtitle: 'Canalizar 7ª Afinidade + Ruptura Astral (+2⚡) + Pacto de Sangue (+1⚡) + Dragão de Safira Sônico',
    difficulty: 'grao_mestre',
    difficultyLabel: 'Grau V • Grão-Mestre Soberano',
    stars: 5,
    goldReward: 120,
    primaryDomain: 'blue',
    mechanicTag: '👑 5 Passos: 7v6 + Feitiço + Pacto + Lendária',
    scenarioLore:
      'A mesa está em Confronto de Domínios 50/50 (6 vs 6). O Soberano rival tem 21 ❤️ e três Muralhas com Escudo Divino. Você começa com apenas 8⚡, mas precisa jogar a Ruptura do Relógio Astral (3⚡) E o Dragão de Safira Sônico (7⚡) — além de vencer o Confronto 50/50!',
    objectiveText: 'Execute a sequência perfeita de 5 passos para romper o Confronto 50/50, gerar a mana que falta e causar 21 de dano!',
    hint1:
      'Você tem 8⚡ e precisa de 10⚡ totais (3⚡ da Ruptura + 7⚡ do Dragão de Safira). A Ruptura do Relógio Astral devolve +2⚡ (líquido -1⚡ → sobra 7⚡!), e você ainda precisa Canalizar uma carta Azul para vencer o Confronto 50/50 (7 vs 6)!',
    hint2:
      '1º Canalize o Trono do Inverno Eterno [C] (sua Afinidade Azul sobe para 7 vs 6, estilhaçando o domínio rival e reativando seu Acerto Garantido!). 2º Lance a Ruptura do Relógio Astral (gasta 3⚡, devolve +2⚡ → você fica com 7⚡ e seu Arquimago ganha +1/+1!). 3º Invoque o Dragão de Safira Sônico na Vanguarda [V] (7⚡, causa 2 de dano a todos ao entrar: 21 ❤️ → 19 ❤️!). 4º Ataque diretamente o Soberano rival com toda a Vanguarda (Arquimago + Dragão + Campeão = 19+ de dano)!',
    solutionSteps: [
      '1. Selecione o Trono do Inverno Eterno na mão e clique em "⛰️ Canalizar [C]": sua Afinidade Azul sobe para 7 vs 6, estilhaçando a barreira rival e reativando seu Acerto Garantido!',
      '2. Lance a Ruptura do Relógio Astral (gasta 3⚡ dos seus 8⚡, mas restaura +2⚡ → deixando exatamente 7⚡ disponíveis!).',
      '3. Com os 7⚡ exatos, invoque o Dragão de Safira Sônico na Vanguarda [V]: seu Sopro Sônico Ao Entrar causa 2 de dano ao Soberano rival (21 ❤️ → 19 ❤️) e entra com +1/+1 e Ímpeto do Maelstrom Astral!',
      '4. Ataque diretamente o Soberano rival com todas as suas unidades na Vanguarda para zerar os 19 ❤️ restantes!',
    ],
    whyIndefensible:
      'Se você invocar o Dragão de Safira (7⚡) primeiro, sobrará apenas 1⚡ e você não poderá lançar a Ruptura do Relógio Astral (3⚡). Se não Canalizar o Trono para 7 vs 6, o Confronto 50/50 bloqueará seu Acerto Garantido!',
    turnNumber: 8,
    p1Name: 'Hydrissa (Você)',
    p1AvatarCardId: 'blue_154_dragao_safira_soberano',
    p1Hp: 16,
    p1Essence: 8,
    p1MaxEssence: 8,
    p1Affinities: { red: 0, blue: 6, purple: 0, green: 0, gold: 0, neutral: 0 },
    p1HandCardIds: [
      'blue_141_ruptura_temporal',
      'blue_154_dragao_safira_soberano',
      'blue_146_trono_inverno_eterno',
    ],
    p1DeckTopCardIds: ['blue_37_mago_aprendiz', 'blue_152_arquimago_vortice'],
    p1ChanneledCardIds: [
      'blue_37_mago_aprendiz',
      'blue_136_leviata_cronos',
      'blue_141_ruptura_temporal',
      'blue_152_arquimago_vortice',
      'blue_146_trono_inverno_eterno',
      'blue_161_singularidade_temporal',
    ],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'blue_152_arquimago_vortice', row: 'vanguard', slotIndex: 1 },
      { cardId: 'red_04_meio_dragao', row: 'vanguard', slotIndex: 2 },
    ],
    p2Name: 'Vulcanis, Soberano Rubro',
    p2Title: 'Rei da Caldeira',
    p2AvatarCardId: 'red_157_dragao_tiamat_carmesim',
    p2Domain: 'red',
    p2Hp: 21,
    p2Essence: 0,
    p2MaxEssence: 8,
    p2Affinities: { red: 6, blue: 0, purple: 0, green: 0, gold: 0, neutral: 0 },
    p2Units: [
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 1, hasDivineShield: true },
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 2, hasDivineShield: true },
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 3, hasDivineShield: true },
    ],
    initialDomainState: {
      owner: 'player',
      domain: 'blue',
      turnsRemaining: 3,
      damageTakenByOwnerThisRound: 0,
      clashRival: {
        owner: 'ai',
        domain: 'red',
        turnsRemaining: 3,
      },
    },
  },
  {
    id: 'prob_14_coroa_entropia_suprema',
    number: 14,
    code: 'PROBLEMA #14',
    title: 'Xeque-Mate da Coroa da Entropia',
    subtitle: 'Canalizar + Queimar + Pacto de Sangue para expandir o Domínio E invocar o Lich de 8⚡ no mesmo turno',
    difficulty: 'grao_mestre',
    difficultyLabel: 'Grau V • Grão-Mestre Soberano',
    stars: 5,
    goldReward: 120,
    primaryDomain: 'purple',
    mechanicTag: '👑 Alquimia Tripla de Mana (9⚡ → 11⚡)',
    scenarioLore:
      'O Soberano rival tem 27 ❤️ e três Guardiões com Escudo Divino. Para causar 27 de dano neste turno, você precisa TANTO expandir o Eclipse do Trono de Ossos (3⚡) QUANTO invocar o Lich da Coroa da Entropia (8⚡) — o que exige 11⚡, mas você tem apenas 9⚡ e 5/6 de Afinidade!',
    objectiveText: 'Suba de 5/6 para 6/6 de Afinidade e de 9⚡ para 11⚡ no mesmo turno para causar 27 de dano letal!',
    hint1:
      'Para sair de 9⚡ e chegar a 11⚡ enquanto ganha +1 de Afinidade: 1) Canalize 1 carta Roxa (+1 Afinidade → 6/6 e compra 1 carta); 2) Sacrifique/Queime outra carta (+1⚡ → 10⚡); 3) Use o Pacto de Sangue (-3 ❤️, +1⚡ → 11⚡)!',
    hint2:
      '1º Canalize Exumar Legião [C] (Afinidade vai para 6/6). 2º Sacrifique/Queime Eclipse Abissal [C] (+1⚡ → 10⚡). 3º Ative "🩸 Pacto (+1⚡)" (+1⚡ → 11⚡). 4º Invoque a Expansão de Domínio Eclipse do Trono de Ossos (3⚡ → sobram 8⚡). 5º Invoque o Lich da Coroa da Entropia na Vanguarda [V] (8⚡: drena 3 ❤️ do rival e dá +2/+2 a todos!). 6º Ataque diretamente o Soberano rival para 25+ de dano!',
    solutionSteps: [
      '1. Canalize [C] uma carta secundária Roxa da mão: sua Afinidade do Abismo sobe de 5 para 6/6 e você compra 1 carta.',
      '2. Sacrifique/Queime [C] uma segunda carta secundária da mão: você ganha +1⚡ temporário (9⚡ → 10⚡).',
      '3. Clique em "🩸 Pacto (+1⚡)" na barra inferior: sacrifica 3 ❤️ para ganhar mais +1⚡ (10⚡ → 11⚡).',
      '4. Invoque a Expansão de Domínio Eclipse do Trono de Ossos (⛩️ 3⚡, restando 8⚡) e invoque o Lich da Coroa da Entropia (8⚡) na Vanguarda [V] (drena 3 ❤️ ao entrar e concede +2/+2 a todos).',
      '5. Com o Acerto Garantido ativo, ataque o Soberano rival com toda a sua Vanguarda para superar os 27 ❤️!',
    ],
    whyIndefensible:
      'Exige o domínio simultâneo das três mecânicas de economia do jogo (Canalizar para Afinidade, Queimar para +1⚡ e Pacto de Sangue para +1⚡) para alcançar os 11⚡ necessários.',
    turnNumber: 9,
    p1Name: 'Vesperion, Lich Supremo (Você)',
    p1AvatarCardId: 'purple_156_lich_coroa_entropia',
    p1Hp: 14,
    p1Essence: 9,
    p1MaxEssence: 9,
    p1Affinities: { red: 0, blue: 0, purple: 5, green: 0, gold: 0, neutral: 0 },
    p1HandCardIds: [
      'purple_156_lich_coroa_entropia',
      'purple_68_exumar_legiao',
      'purple_123_eclipse_abissal',
    ],
    p1DeckTopCardIds: ['purple_07_lich', 'purple_25_dama_seis_laminas'],
    p1ChanneledCardIds: [
      'purple_07_lich',
      'purple_25_dama_seis_laminas',
      'purple_68_exumar_legiao',
      'purple_126_campanario_mortos',
      'purple_123_eclipse_abissal',
    ],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'purple_25_dama_seis_laminas', row: 'vanguard', slotIndex: 1 },
      { cardId: 'purple_07_lich', row: 'vanguard', slotIndex: 3 },
      { cardId: 'purple_126_campanario_mortos', row: 'rearguard', slotIndex: 1 },
    ],
    p2Name: 'Aurelius, Sol Invicto',
    p2Title: 'Imperador da Alvorada',
    p2AvatarCardId: 'gold_157_dragao_soberano_alvorada',
    p2Domain: 'gold',
    p2Hp: 27,
    p2Essence: 0,
    p2MaxEssence: 9,
    p2Affinities: { red: 0, blue: 0, purple: 0, green: 0, gold: 6, neutral: 0 },
    p2Units: [
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 1, hasDivineShield: true },
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 2, hasDivineShield: true },
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 3, hasDivineShield: true },
    ],
  },
  {
    id: 'prob_15_convergencia_vulcanis_30dano',
    number: 15,
    code: 'PROBLEMA #15',
    title: 'O Juízo Final de Pyros (30 de Dano em 1 Turno)',
    subtitle: 'O Desafio Supremo: Desempate 7v6 + Manobra de Fileira [⇄] + Pacto de Sangue + Vulcanis, Soberano Carmesim',
    difficulty: 'grao_mestre',
    difficultyLabel: 'Grau V • Grão-Mestre Soberano',
    stars: 5,
    goldReward: 150,
    primaryDomain: 'red',
    mechanicTag: '👑 Desafio Final • 30 Dano em 1 Turno',
    scenarioLore:
      'O desafio definitivo de Chromatic Pact! O Arquilich rival tem 30 ❤️ e está travando um Confronto de Domínios 50/50 (6 vs 6) com três Muralhas de Escudo Divino na Vanguarda. Seu Soberano Meio-Dragão Ascendido está na Retaguarda [R], você tem 8⚡ de Essência e Vulcanis, Soberano Carmesim (9⚡) na mão!',
    objectiveText: 'Cause exatos 30+ de dano neste único turno combinando todas as mecânicas mestras do jogo!',
    hint1:
      'Observe os 4 obstáculos: 1) O Confronto 50/50 anula seu Acerto Garantido (precisa Canalizar 1 carta Vermelha para 7 vs 6!); 2) Vulcanis custa 9⚡ e você tem 8⚡ (precisa do Pacto de Sangue para +1⚡!); 3) Seu Campeão Dracônico está na Retaguarda [R] (precisa de "⇄ Mover Fileira" para a Vanguarda [V]!); 4) Coloque Vulcanis na coluna com Cobertura da Retaguarda!',
    hint2:
      '1º Canalize o Kobold [C] (Afinidade Carmesim vai a 7 vs 6 → rompe o Domínio rival!). 2º Use "🩸 Pacto (+1⚡)" (8⚡ → 9⚡). 3º Clique no Campeão Dracônico na Retaguarda [R] e use "⇄ Mover Fileira" para avançá-lo à Vanguarda [V]. 4º Invoque Vulcanis, Soberano Carmesim (9⚡) na Vanguarda [V] (seu Sopro Ao Entrar causa 2 de dano ao Soberano rival: 30 ❤️ → 28 ❤️!). 5º Ataque diretamente o Soberano rival com toda a sua Vanguarda sob a Caldeira do Fogo Primordial para 30+ de dano!',
    solutionSteps: [
      '1. Selecione o Batedor Escamado na mão e clique em "⛰️ Canalizar [C]": sua Afinidade Carmesim sobe para 7 vs 6, estilhaçando o domínio rival e reativando seu Acerto Garantido!',
      '2. Clique em "🩸 Pacto (+1⚡)" na barra inferior: sacrifica 3 ❤️ para subir de 8⚡ para 9⚡.',
      '3. Clique no Campeão Dracônico na Retaguarda [R] (Coluna 1) e use "⇄ Mover Fileira" para avançá-lo à Vanguarda [V].',
      '4. Invoque Vulcanis, Soberano Carmesim (9⚡) na Vanguarda [V] (Coluna 4, apoiada pela Bigorna na Retaguarda): causa 2 de dano Ao Entrar no Soberano rival (30 ❤️ → 28 ❤️) e entra com +1/+1 e Ímpeto!',
      '5. Ataque diretamente o Soberano rival com toda a sua Vanguarda (Meio-Dragão + Mastim + Cria Dracônica + Vulcanis) para ultrapassar os 30 ❤️ e conquistar o título de Grão-Mestre!',
    ],
    whyIndefensible:
      'Qualquer esquecimento (não canalizar 7 vs 6, não fazer Pacto de Sangue para 9⚡, ou esquecer de avançar o Campeão da Retaguarda com ⇄) deixa o Arquilich vivo!',
    turnNumber: 9,
    p1Name: 'Ignis Rex, Grão-Mestre (Você)',
    p1AvatarCardId: 'red_157_dragao_tiamat_carmesim',
    p1Hp: 12,
    p1Essence: 8,
    p1MaxEssence: 9,
    p1Affinities: { red: 6, blue: 0, purple: 0, green: 0, gold: 0, neutral: 0 },
    p1HandCardIds: ['red_157_dragao_tiamat_carmesim', 'red_01_kobold'],
    p1DeckTopCardIds: ['red_02_magmin', 'red_03_mastim_infernal'],
    p1ChanneledCardIds: [
      'red_01_kobold',
      'red_02_magmin',
      'red_03_mastim_infernal',
      'red_04_meio_dragao',
      'red_10_altar_draconico',
      'red_18_marechal_rubro',
    ],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'red_04_meio_dragao', row: 'rearguard', slotIndex: 0, isAscended: true },
      { cardId: 'red_03_mastim_infernal', row: 'vanguard', slotIndex: 1 },
      { cardId: 'red_03_mastim_infernal', row: 'vanguard', slotIndex: 2 },
      { cardId: 'red_10_altar_draconico', row: 'rearguard', slotIndex: 1 },
      { cardId: 'red_36_bigorna_fogo', row: 'rearguard', slotIndex: 3 },
    ],
    p2Name: 'Vesperion, Imperador Lich',
    p2Title: 'Trono Eterno do Abismo',
    p2AvatarCardId: 'purple_156_lich_coroa_entropia',
    p2Domain: 'purple',
    p2Hp: 30,
    p2Essence: 0,
    p2MaxEssence: 9,
    p2Affinities: { red: 0, blue: 0, purple: 6, green: 0, gold: 0, neutral: 0 },
    p2Units: [
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 1, hasDivineShield: true },
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 2, hasDivineShield: true },
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 3, hasDivineShield: true },
    ],
    initialDomainState: {
      owner: 'player',
      domain: 'red',
      turnsRemaining: 3,
      damageTakenByOwnerThisRound: 0,
      clashRival: {
        owner: 'ai',
        domain: 'purple',
        turnsRemaining: 3,
      },
    },
  },
];

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

const SOLVED_PROBLEMS_STORAGE_KEY = 'chromatic_pact_solved_problems_v1';

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

export function markProblemAsSolved(problemId: string): { isFirstTime: boolean; allSolved: string[] } {
  const current = getSolvedProblemIds();
  if (current.includes(problemId)) {
    return { isFirstTime: false, allSolved: current };
  }
  const updated = [...current, problemId];
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(SOLVED_PROBLEMS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore storage errors
    }
  }
  return { isFirstTime: true, allSolved: updated };
}
