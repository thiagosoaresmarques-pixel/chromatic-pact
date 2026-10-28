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
    description: 'Fundamentos de posicionamento (Cobertura e Invasão), Relíquias de Retaguarda, Ascensão e Expansão de Domínio (+2 🪙 por problema).',
  },
  intermediario: {
    label: 'Grau II • Intermediário',
    starsText: '★★☆☆☆',
    color: '#38bdf8',
    bg: 'rgba(56, 189, 248, 0.14)',
    border: 'rgba(56, 189, 248, 0.45)',
    description: 'Sequenciamento de Feitiços geradores de Essência, Reanimação da Cripta, Poder do Soberano e Alvo Manual sob Domínio (+3 🪙 por problema).',
  },
  avancado: {
    label: 'Grau III • Avançado',
    starsText: '★★★☆☆',
    color: '#facc15',
    bg: 'rgba(250, 204, 21, 0.14)',
    border: 'rgba(250, 204, 21, 0.45)',
    description: 'Desempate de Confronto de Domínios 50/50 por Afinidade (7 vs 6), Quebra de Concentração (8+ Dano) e Combustão de Mana (+5 🪙 por problema).',
  },
  mestre: {
    label: 'Grau IV • Mestre',
    starsText: '★★★★☆',
    color: '#fb923c',
    bg: 'rgba(251, 146, 60, 0.14)',
    border: 'rgba(251, 146, 60, 0.45)',
    description: 'Tributo Anti-Domínio (10❤️), Pacto de Sangue no limite da vida, Manobras de Fileira [⇄] e Retorno à Mão (+7 🪙 por problema).',
  },
  grao_mestre: {
    label: 'Grau V • Grão-Mestre Soberano',
    starsText: '★★★★★',
    color: '#e879f9',
    bg: 'rgba(217, 70, 239, 0.16)',
    border: 'rgba(232, 121, 249, 0.55)',
    description: 'Quebra-cabeças de 5 a 6 ações encadeadas onde um único erro de 1⚡ ou 1 coluna deixa o Soberano rival vivo (+10 🪙 por problema).',
  },
};

function resolveProblemCard(cardId: string): CardDefinition {
  return CARDS_BY_ID[cardId] ?? ALL_CARDS[0];
}

export const TACTICAL_PROBLEMS: TacticalProblem[] = [
  // ============================================================================
  // GRAU I — INICIANTE (★☆☆☆☆ • 10 PROBLEMAS • 2 🪙 OURO CADA)
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
    goldReward: 2,
    primaryDomain: 'red',
    mechanicTag: '⛩️ Expansão de Domínio & Relíquia [R]',
    scenarioLore:
      'O General de Ouro ergueu três Muralhas com Guarda e Escudo Divino na Vanguarda, protegendo seus 18 Pontos de Vida. Se você atacar normalmente, seus guerreiros baterão nos tanques inimigos.',
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
    goldReward: 2,
    primaryDomain: 'red',
    mechanicTag: '📐 Cobertura (+1⚔️) & Invasão (+1⚔️)',
    scenarioLore:
      'O Soberano rival tem exatos 12 ❤️ e nenhuma Guarda ativa, mas uma criatura inimiga ocupa a Coluna 2 da Vanguarda. Você tem apenas 2⚡ de Essência para fechar os 12 de dano.',
    objectiveText: 'Alcance exatos 12 de dano neste turno usando os bônus de coluna da grade 6×4.',
    hint1:
      'Lembre-se das regras de formação da mesa: uma unidade na Vanguarda [V] ganha +1⚔️ de Invasão se a Vanguarda inimiga daquela coluna estiver vazia, e +1⚔️ de Cobertura se houver um aliado na Retaguarda [R] da mesma coluna!',
    hint2:
      '1º Invoque o Batedor Escamado das Brasas (1⚡, Ímpeto, causa 1 de dano ao entrar) na Vanguarda [V] da Coluna 1 (onde já há o Altar na Retaguarda, ganhando +1⚔️ Invasão e +1⚔️ Cobertura = 5 ATQ!). 2º Invoque o Diabrete (1⚡) na Retaguarda [R] da Coluna 3 para dar +1⚔️ de Cobertura ao Mastim das Cinzas na Vanguarda!',
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
    goldReward: 2,
    primaryDomain: 'red',
    mechanicTag: '★ Ascensão & Voo sobre Guarda',
    scenarioLore:
      'Uma Muralha de Aço inimiga com Guarda terrestre protege o Soberano rival (9 ❤️). Seu Campeão Dracônico está na Coluna 2 de frente para a Muralha, e você tem 5⚡ de Essência.',
    objectiveText: 'Sobrevoe a Guarda terrestre inimiga e cause 9 de dano ao Soberano rival neste turno.',
    hint1:
      'Inspecione o seu Campeão Dracônico em campo: a habilidade ★ Ascensão (4⚡) o transforma em Soberano Meio-Dragão Ascendido (7/7 com Voo e Atropelar!). Unidades com Voo ignoram Guardiões terrestres sem Alcance!',
    hint2:
      '1º Clique no Campeão Dracônico na Vanguarda e ative "★ Ascender (4⚡)" — ele passa a ter 7⚔️ ATQ (+1⚔️ Cobertura = 8⚔️) e Voo! 2º Invoque o Batedor Escamado (1⚡, causa 1 de dano ao entrar) e ataque diretamente o Soberano rival com o Meio-Dragão Ascendido!',
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
  {
    id: 'prob_04_sopro_draconico_escudo',
    number: 4,
    code: 'PROBLEMA #04',
    title: 'Baforada Quebra-Escudo (Sopro + Atropelar)',
    subtitle: 'O Sopro queima o último ponto de vida da Guarda antes do impacto de Atropelar',
    difficulty: 'iniciante',
    difficultyLabel: 'Grau I • Iniciante',
    stars: 1,
    goldReward: 2,
    primaryDomain: 'red',
    mechanicTag: '🐉 Sopro Pré-Combate & Atropelar',
    scenarioLore:
      'Uma Muralha ferida (2 ❤️ restantes) bloqueia a Coluna 2. O Soberano rival tem 11 ❤️. Você tem a Salamandra do Mar de Brasas em campo e 4⚡ de Essência.',
    objectiveText: 'Destrua a Guarda na Coluna 2 e cause 11 de dano ao Soberano rival neste turno.',
    hint1:
      'A Salamandra do Mar de Brasas tem ★ Ascensão (3⚡) para Salamandra Anciã (8/8 com Atropelar!), e na sua mão há o Batedor Escamado (1⚡) ou a Serpente de Fogo (1⚡, causa 1 de dano a um inimigo ao entrar).',
    hint2:
      '1º Clique na Salamandra do Mar de Brasas na Coluna 2 e ative "★ Ascender (3⚡)" — ela vira 8/8 com Atropelar (+1⚔️ Cobertura = 9⚔️ ATQ!). 2º Invoque o Batedor Escamado (1⚡) na Coluna 4 livre (causa 1 de dano ao Soberano ao entrar e ataca com 3⚔️!). 3º Ataque a Muralha (2 ❤️) com a Salamandra Ascendida (9⚔️ Atropelar) para vazar 7 de dano + 4 do Batedor = 11!',
    solutionSteps: [
      '1. Clique na Salamandra do Mar de Brasas na Vanguarda [V] (Coluna 2) e ative "★ Ascender (3⚡)": ela se torna Salamandra Anciã (8⚔️ base + 1⚔️ Cobertura = 9⚔️ ATQ com Atropelar).',
      '2. Invoque o Batedor Escamado das Brasas (1⚡) na Vanguarda [V] da Coluna 4 (livre): causa 1 de dano ao Soberano rival ao entrar (11 ❤️ → 10 ❤️) e fica com 3⚔️ ATQ (2 base + 1 Invasão).',
      '3. Ataque a Muralha com a Salamandra Anciã (Atropelar perfura os 2 ❤️ + 1 ARM e vaza 6–7 de dano) e ataque com o Batedor para zerar o Soberano rival!',
    ],
    whyIndefensible:
      'Sem Ascender a Salamandra para ganhar Atropelar, todo o seu ataque ficaria retido na Muralha inimiga.',
    turnNumber: 5,
    p1Name: 'Ignis Rex (Você)',
    p1AvatarCardId: 'red_05_salamandra',
    p1Hp: 20,
    p1Essence: 4,
    p1MaxEssence: 5,
    p1Affinities: { red: 4, blue: 0, purple: 0, green: 0, gold: 0, neutral: 0 },
    p1HandCardIds: ['red_01_kobold'],
    p1DeckTopCardIds: ['red_03_mastim_infernal'],
    p1ChanneledCardIds: ['red_01_kobold', 'red_02_magmin', 'red_03_mastim_infernal', 'red_05_salamandra'],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'red_05_salamandra', row: 'vanguard', slotIndex: 1 },
      { cardId: 'red_10_altar_draconico', row: 'rearguard', slotIndex: 1 },
    ],
    p2Name: 'Guardião da Cidadela',
    p2Title: 'Escudo de Solária',
    p2AvatarCardId: 'gold_26_muralha_aco',
    p2Domain: 'gold',
    p2Hp: 11,
    p2Essence: 0,
    p2MaxEssence: 5,
    p2Affinities: { red: 0, blue: 0, purple: 0, green: 0, gold: 3, neutral: 0 },
    p2Units: [
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 1, damageTaken: 5 },
    ],
  },
  {
    id: 'prob_05_alcance_retaguarda',
    number: 5,
    code: 'PROBLEMA #05',
    title: 'Saraivada de Longo Alcance',
    subtitle: 'Posicionar arqueiro com Alcance na Retaguarda [R] para atirar E conceder Cobertura (+1⚔️)',
    difficulty: 'iniciante',
    difficultyLabel: 'Grau I • Iniciante',
    stars: 1,
    goldReward: 2,
    primaryDomain: 'green',
    mechanicTag: '🏹 Alcance na Retaguarda [R] + Cobertura',
    scenarioLore:
      'A Vanguarda da Coluna 2 já está ocupada pelo seu Lobisomem Alfa (4⚔️). O Soberano rival tem 10 ❤️. Você tem o Centauro Arqueiro (3⚡, Alcance, Ímpeto, 1 de dano ao entrar) na mão.',
    objectiveText: 'Use a propriedade Alcance na Retaguarda [R] para somar Cobertura + ataque duplo na mesma coluna!',
    hint1:
      'Unidades com a palavra-chave Alcance podem atacar mesmo estando na Retaguarda [R]! E ao ficar na Retaguarda [R] atrás de um aliado da Vanguarda [V], ainda concedem +1⚔️ de Cobertura a ele!',
    hint2:
      '1º Invoque o Centauro Arqueiro (3⚡) na RETAGUARDA [R] da Coluna 2 (atrás do Lobisomem Alfa) e mire o 1 de dano Ao Entrar na Guarda inimiga de 1 ❤️ para destruí-la! 2º Agora a Coluna 2 está vazia (Lobisomem ganha +1⚔️ Invasão e +1⚔️ Cobertura = 6⚔️ ATQ!) e o Centauro atira da Retaguarda com 3⚔️ (+1 dano = 10 letal)!',
    solutionSteps: [
      '1. Selecione o Centauro Arqueiro (3⚡) e posicione-o na Retaguarda [R] da Coluna 2 (atrás do Lobisomem): mire seu 1 de dano Ao Entrar na Guarda inimiga de 1 ❤️ para eliminá-la!',
      '2. Com a Guarda destruída e o Centauro na Retaguarda, o Lobisomem recebe +1⚔️ de Invasão e +1⚔️ de Cobertura (4 → 6⚔️ ATQ), além do +1/+1 do Altar.',
      '3. Ataque o Soberano rival com o Lobisomem (da Vanguarda) e com o Centauro (da Retaguarda, graças ao Alcance!) para zerar os 10 ❤️!',
    ],
    whyIndefensible:
      'Se você colocar o Centauro em outra coluna, o Lobisomem perderá o +1⚔️ de Cobertura. Se não destruir a Guarda de 1 ❤️ com o disparo Ao Entrar, seus ataques ficarão bloqueados.',
    turnNumber: 4,
    p1Name: 'Sylvarion (Você)',
    p1AvatarCardId: 'green_25_dragao_verde',
    p1Hp: 22,
    p1Essence: 3,
    p1MaxEssence: 4,
    p1Affinities: { red: 0, blue: 0, purple: 0, green: 3, gold: 0, neutral: 0 },
    p1HandCardIds: ['green_17_centauro'],
    p1DeckTopCardIds: ['green_18_lobisomem'],
    p1ChanneledCardIds: ['green_17_centauro', 'green_18_lobisomem', 'green_26_instinto_predatorio'],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'green_18_lobisomem', row: 'vanguard', slotIndex: 1, bonusAtk: 1 },
    ],
    p2Name: 'Necromante da Cripta',
    p2Title: 'Servo do Eclipse',
    p2AvatarCardId: 'purple_07_lich',
    p2Domain: 'purple',
    p2Hp: 10,
    p2Essence: 0,
    p2MaxEssence: 4,
    p2Affinities: { red: 0, blue: 0, purple: 3, green: 0, gold: 0, neutral: 0 },
    p2Units: [
      { cardId: 'blue_11_anomalia_agua', row: 'vanguard', slotIndex: 1, damageTaken: 2 },
    ],
  },
  {
    id: 'prob_06_toque_letal_impeto',
    number: 6,
    code: 'PROBLEMA #06',
    title: 'Peçonha do Abismo (Toque Letal)',
    subtitle: 'Eliminar um Colosso Guardião de 9 ❤️ com 1⚡ usando Toque Letal para abrir a coluna',
    difficulty: 'iniciante',
    difficultyLabel: 'Grau I • Iniciante',
    stars: 1,
    goldReward: 2,
    primaryDomain: 'purple',
    mechanicTag: '☠️ Toque Letal vs Tanque Colossal',
    scenarioLore:
      'Um Kraken da Fossa Abissal (9 ❤️, Guardião) bloqueia a Coluna 2 diante do seu Dragão de Ouro (5⚔️). O Soberano rival tem apenas 7 ❤️, e você tem 1⚡ de Essência.',
    objectiveText: 'Elimine o Guardião de 9 ❤️ com apenas 1⚡ e finalize o Soberano rival (7 ❤️).',
    hint1:
      'Qualquer quantidade de dano (> 0) causada por uma criatura com Toque Letal destrói instantaneamente a criatura inimiga atingida, independentemente de quanta Vida ela tenha!',
    hint2:
      '1º Invoque a Garra Rastejante (1⚡, Ímpeto, Toque Letal) na Vanguarda [V]. 2º Ataque o Kraken Guardião com a Garra Rastejante — o Toque Letal destrói o colosso de 9 ❤️ na hora! 3º Com o caminho livre e +1⚔️ de Invasão na Coluna 2, ataque o Soberano rival com o Dragão de Ouro!',
    solutionSteps: [
      '1. Invoque a Garra Rastejante (1⚡, Ímpeto, Toque Letal) na Vanguarda [V].',
      '2. Ataque o Kraken Guardião com a Garra Rastejante: o Toque Letal executa o colosso de 9 ❤️ instantaneamente!',
      '3. Agora sem Guardião em campo e com a Coluna 2 vazia (+1⚔️ Invasão + 1⚔️ Cobertura = 7⚔️ ATQ), ataque o Soberano rival com seu Dragão de Ouro para 7 de dano letal!',
    ],
    whyIndefensible:
      'Se você atacar o Kraken com o Dragão de Ouro primeiro, o Dragão causará apenas 5 de dano e a Garra Rastejante terá apenas 2–3⚔️ para atacar o Soberano (faltando 4 de dano).',
    turnNumber: 5,
    p1Name: 'Vesperion (Você)',
    p1AvatarCardId: 'purple_07_lich',
    p1Hp: 20,
    p1Essence: 1,
    p1MaxEssence: 5,
    p1Affinities: { red: 0, blue: 0, purple: 3, green: 0, gold: 2, neutral: 0 },
    p1HandCardIds: ['purple_11_garra_rastejante'],
    p1DeckTopCardIds: ['purple_15_espectro'],
    p1ChanneledCardIds: ['purple_11_garra_rastejante', 'purple_15_espectro', 'gold_07_dragao_ouro'],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'gold_07_dragao_ouro', row: 'vanguard', slotIndex: 1 },
      { cardId: 'purple_126_campanario_mortos', row: 'rearguard', slotIndex: 1 },
    ],
    p2Name: 'Senhor das Profundezas',
    p2Title: 'Vigia do Kraken',
    p2AvatarCardId: 'blue_07_kraken',
    p2Domain: 'blue',
    p2Hp: 7,
    p2Essence: 0,
    p2MaxEssence: 5,
    p2Affinities: { red: 0, blue: 4, purple: 0, green: 0, gold: 0, neutral: 0 },
    p2Units: [
      { cardId: 'blue_07_kraken', row: 'vanguard', slotIndex: 1 },
    ],
  },
  {
    id: 'prob_07_furia_crescente_salamandra',
    number: 7,
    code: 'PROBLEMA #07',
    title: 'Sangue Fervendo (Fúria Crescente)',
    subtitle: 'Aproveitar o bônus de +2⚔️ ATQ de unidades feridas com Fúria Crescente e Instinto Predatório',
    difficulty: 'iniciante',
    difficultyLabel: 'Grau I • Iniciante',
    stars: 1,
    goldReward: 2,
    primaryDomain: 'green',
    mechanicTag: '💢 Fúria Crescente (+2⚔️ Ferido) & Buff',
    scenarioLore:
      'Seu Lobisomem e seu Tiranossauro estão feridos na Vanguarda — ativando a Fúria Crescente (+2⚔️ ATQ para cada um!). O Soberano rival tem 19 ❤️. Você tem 2⚡ e um feitiço de cura e um de fúria na mão.',
    objectiveText: 'Cause 19 de dano neste turno SEM curar a Fúria Crescente das suas feras!',
    hint1:
      'Cuidado! Unidades com Fúria Crescente ganham +2⚔️ ATQ apenas enquanto estiverem FERIDAS (Vida atual menor que a Vida máxima). Se você curá-las totalmente, elas perdem +2⚔️!',
    hint2:
      'NÃO jogue o feitiço de cura! Lance o Instinto Predatório (2⚡, +3/+3 a um aliado) ou Ruptura de Raízes (2⚡, +2/+2 a todos os aliados) e ataque com seus dois predadores enfurecidos para 19+ de dano!',
    solutionSteps: [
      '1. Ignore o feitiço de cura (Destino Renovado) — curar suas feras removeria a Fúria Crescente delas!',
      '2. Lance Ruptura de Raízes e Monólitos (2⚡): concede +2/+2 a todos os seus aliados mantendo-os com o bônus da Fúria Crescente.',
      '3. Ataque o Soberano rival com o Lobisomem e o Tiranossauro para 19+ de dano letal!',
    ],
    whyIndefensible:
      'Jogar o feitiço de cura (2⚡) gasta toda a sua Essência e ainda reduz o ataque das suas feras ao restaurar a vida máxima delas.',
    turnNumber: 6,
    p1Name: 'Sylvarion (Você)',
    p1AvatarCardId: 'green_157_quimera_tres_presas',
    p1Hp: 18,
    p1Essence: 2,
    p1MaxEssence: 6,
    p1Affinities: { red: 0, blue: 0, purple: 0, green: 4, gold: 0, neutral: 0 },
    p1HandCardIds: ['green_162_furia_matilha_selvagem', 'neutral_148_destino_renovado_crono'],
    p1DeckTopCardIds: ['green_18_lobisomem'],
    p1ChanneledCardIds: ['green_18_lobisomem', 'green_157_quimera_tres_presas', 'green_162_furia_matilha_selvagem'],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'green_18_lobisomem', row: 'vanguard', slotIndex: 1, damageTaken: 2 },
      { cardId: 'green_157_quimera_tres_presas', row: 'vanguard', slotIndex: 3, damageTaken: 2 },
    ],
    p2Name: 'Inquisidor de Solária',
    p2Title: 'Juiz Dourado',
    p2AvatarCardId: 'gold_153_inquisidor_balanca_ouro',
    p2Domain: 'gold',
    p2Hp: 19,
    p2Essence: 0,
    p2MaxEssence: 6,
    p2Affinities: { red: 0, blue: 0, purple: 0, green: 0, gold: 4, neutral: 0 },
    p2Units: [],
  },
  {
    id: 'prob_08_atropelar_verme_purpura',
    number: 8,
    code: 'PROBLEMA #08',
    title: 'A Carga do Verme Púrpura (Atropelar)',
    subtitle: 'Concentrar buffs no atacante com Atropelar para que o dano excedente esmague o Soberano',
    difficulty: 'iniciante',
    difficultyLabel: 'Grau I • Iniciante',
    stars: 1,
    goldReward: 2,
    primaryDomain: 'green',
    mechanicTag: '🦏 Atropelar vs Guarda Enfraquecida',
    scenarioLore:
      'Um Guardião inimigo (3 ❤️, 1 ARM) protege o Soberano rival (11 ❤️) na Coluna 2. Você tem o Verme Púrpura (10⚔️, Atropelar, Sopro 2) na Coluna 2 e uma Poção de Fúria (1⚡, +2/+2) na mão.',
    objectiveText: 'Perfure o Guardião inimigo com Sopro + Atropelar para causar 11 de dano excedente ao Soberano!',
    hint1:
      'O Verme Púrpura tem Sopro 2 (causa 2 de dano antes do golpe, reduzindo o Guardião para 2 ❤️ efetivos) e Atropelar (todo o dano que exceder a vida + armadura do defensor atinge o Soberano rival!).',
    hint2:
      '1º Lance a Poção de Fúria (1⚡, +2/+2) no Verme Púrpura (ele vai a 13⚔️ ATQ com a Cobertura!). 2º Ataque o Guardião inimigo com o Verme Púrpura: o Sopro 2 + 13⚔️ de Atropelar pulveriza o Guardião e transfere 11+ de dano direto ao Soberano rival!',
    solutionSteps: [
      '1. Lance a Poção de Fúria (1⚡) no Verme Púrpura na Coluna 2 (+2/+2 → 13⚔️ ATQ com Cobertura).',
      '2. Ataque o Guardião inimigo com o Verme Púrpura: o Sopro 2 amacia o alvo e o golpe de 13⚔️ com Atropelar transfere 11+ de dano excedente ao Soberano rival!',
    ],
    whyIndefensible:
      'Sem o buff de +2/+2 no Verme Púrpura, o dano excedente do Atropelar deixaria o Soberano rival vivo com 2 ❤️.',
    turnNumber: 7,
    p1Name: 'Sylvarion (Você)',
    p1AvatarCardId: 'green_24_verme_purpura',
    p1Hp: 24,
    p1Essence: 1,
    p1MaxEssence: 7,
    p1Affinities: { red: 0, blue: 0, purple: 0, green: 5, gold: 0, neutral: 0 },
    p1HandCardIds: ['neutral_18_pocao_furia'],
    p1DeckTopCardIds: ['green_20_tubarao_terrestre'],
    p1ChanneledCardIds: ['green_18_lobisomem', 'green_20_tubarao_terrestre', 'green_24_verme_purpura'],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'green_24_verme_purpura', row: 'vanguard', slotIndex: 1 },
      { cardId: 'green_165_totem_presa_ancestral', row: 'rearguard', slotIndex: 1 },
    ],
    p2Name: 'Guardião dos Recifes',
    p2Title: 'Sentinela Abissal',
    p2AvatarCardId: 'blue_13_lanceiro_mares',
    p2Domain: 'blue',
    p2Hp: 11,
    p2Essence: 0,
    p2MaxEssence: 7,
    p2Affinities: { red: 0, blue: 4, purple: 0, green: 0, gold: 0, neutral: 0 },
    p2Units: [
      { cardId: 'blue_13_lanceiro_mares', row: 'vanguard', slotIndex: 1 },
    ],
  },
  {
    id: 'prob_09_canalizar_sexta_afinidade',
    number: 9,
    code: 'PROBLEMA #09',
    title: 'O Sexto Selo Elemental (Canalizar 6/6)',
    subtitle: 'Canalizar [C] a 6ª carta do mesmo Domínio para destravar a Expansão de Domínio no ato',
    difficulty: 'iniciante',
    difficultyLabel: 'Grau I • Iniciante',
    stars: 1,
    goldReward: 2,
    primaryDomain: 'green',
    mechanicTag: '⛰️ Canalizar 5/6 → 6/6 & Expansão',
    scenarioLore:
      'Suas feras na Vanguarda somam 13⚔️, mas há três Muralhas com Escudo Divino bloqueando a frente e você está com 5/6 de Afinidade Esmeralda. O Soberano rival tem 16 ❤️.',
    objectiveText: 'Alcance 6/6 de Afinidade Esmeralda, expanda a Selva Primordial e cause 16 de dano!',
    hint1:
      'Para invocar uma Expansão de Domínio (⛩️ 3⚡), você precisa de 6 de Afinidade no daquele elemento. Canalizar uma carta da mão ("⛰️ Canalizar [C]") é gratuito (1x por turno), aumenta sua Afinidade em +1 e ainda compra 1 carta!',
    hint2:
      '1º Selecione qualquer carta Verde na mão e clique em "⛰️ Canalizar [C]" — sua Afinidade Esmeralda sobe de 5 para 6/6! 2º Clique em "⛩️ 6/6" na barra inferior (3⚡) para invocar a Selva Primordial de Veridia (+1/+1, Ímpeto e Acerto Garantido). 3º Ataque diretamente o Soberano rival com suas 3 criaturas para 16+ de dano!',
    solutionSteps: [
      '1. Selecione a carta na sua mão e clique em "⛰️ Canalizar [C]": sua Afinidade Esmeralda sobe de 5 para 6/6 e você compra 1 carta.',
      '2. Clique em "⛩️ 6/6" na barra inferior (3⚡) para ativar a Expansão de Domínio Selva Primordial: suas 3 criaturas ganham +1/+1, Ímpeto e Acerto Garantido!',
      '3. Ataque diretamente o Soberano rival ignorando as Muralhas para 16+ de dano letal!',
    ],
    whyIndefensible:
      'Se você jogar a carta da mão em vez de Canalizá-la, continuará com 5/6 de Afinidade e não poderá ativar a Expansão de Domínio para ignorar as três Muralhas.',
    turnNumber: 6,
    p1Name: 'Sylvarion (Você)',
    p1AvatarCardId: 'green_161_dragao_esmeralda_primordial',
    p1Hp: 24,
    p1Essence: 3,
    p1MaxEssence: 6,
    p1Affinities: { red: 0, blue: 0, purple: 0, green: 5, gold: 0, neutral: 0 },
    p1HandCardIds: ['green_151_urso_couraca_musgo'],
    p1DeckTopCardIds: ['green_147_batedor_folha_viva'],
    p1ChanneledCardIds: [
      'green_17_centauro',
      'green_18_lobisomem',
      'green_20_tubarao_terrestre',
      'green_22_wyvern',
      'green_25_dragao_verde',
    ],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'green_20_tubarao_terrestre', row: 'vanguard', slotIndex: 1 },
      { cardId: 'green_18_lobisomem', row: 'vanguard', slotIndex: 2 },
      { cardId: 'green_17_centauro', row: 'vanguard', slotIndex: 4 },
    ],
    p2Name: 'Bastião de Solária',
    p2Title: 'Muralha Real',
    p2AvatarCardId: 'gold_26_muralha_aco',
    p2Domain: 'gold',
    p2Hp: 16,
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
    id: 'prob_10_efeito_entrada_esfera_cinzas',
    number: 10,
    code: 'PROBLEMA #10',
    title: 'Tempestade de Cinzas e Escória',
    subtitle: 'Limpar a Vanguarda inimiga com dano em área para liberar o bônus de Invasão (+1⚔️) em 3 colunas',
    difficulty: 'iniciante',
    difficultyLabel: 'Grau I • Iniciante',
    stars: 1,
    goldReward: 2,
    primaryDomain: 'red',
    mechanicTag: '🔥 Limpeza de Fileira → Tripla Invasão (+3⚔️)',
    scenarioLore:
      'Três Guardiões inimigos enfraquecidos (3 ❤️ cada) ocupam as Colunas 1, 2 e 3 diante dos seus três guerreiros. O Soberano rival tem 14 ❤️ e você tem 3⚡ de Essência.',
    objectiveText: 'Varra os 3 Guardiões com 1 único feitiço para destravar +3⚔️ de Invasão e causar 14 de dano!',
    hint1:
      'Veja o feitiço Esfera de Cinzas (3⚡) na sua mão: ele causa 3 de dano a TODA a Vanguarda inimiga e ainda causa 2 de dano direto ao Soberano rival!',
    hint2:
      '1º Lance a Esfera de Cinzas (3⚡): ela destrói os 3 Guardiões inimigos de 3 ❤️ e causa 2 de dano ao Soberano rival (14 ❤️ → 12 ❤️)! 2º Com as 3 colunas agora livres, cada um dos seus 3 guerreiros ganha +1⚔️ de Invasão (somando 4 + 4 + 4 = 12⚔️) — ataque o Soberano rival para vencer!',
    solutionSteps: [
      '1. Lance o feitiço Esfera de Cinzas (3⚡): causa 3 de dano a toda a Vanguarda inimiga (eliminando os 3 Guardiões) e 2 de dano ao Soberano rival (14 ❤️ → 12 ❤️).',
      '2. Com as Colunas 1, 2 e 3 livres de inimigos, seus três atacantes ganham +1⚔️ de Invasão cada um (passando para 4⚔️ + 4⚔️ + 4⚔️ = 12⚔️).',
      '3. Ataque diretamente o Soberano rival com os três guerreiros para 12 de dano letal!',
    ],
    whyIndefensible:
      'Atacar antes de lançar a Esfera de Cinzas desperdiça todos os ataques nos Guardiões e perde os +3⚔️ de Invasão.',
    turnNumber: 5,
    p1Name: 'Ignis Rex (Você)',
    p1AvatarCardId: 'red_04_meio_dragao',
    p1Hp: 20,
    p1Essence: 3,
    p1MaxEssence: 5,
    p1Affinities: { red: 3, blue: 0, purple: 0, green: 0, gold: 0, neutral: 0 },
    p1HandCardIds: ['red_09_esfera_cinzas'],
    p1DeckTopCardIds: ['red_01_kobold'],
    p1ChanneledCardIds: ['red_01_kobold', 'red_03_mastim_infernal', 'red_09_esfera_cinzas'],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'red_03_mastim_infernal', row: 'vanguard', slotIndex: 0 },
      { cardId: 'red_03_mastim_infernal', row: 'vanguard', slotIndex: 1 },
      { cardId: 'red_03_mastim_infernal', row: 'vanguard', slotIndex: 2 },
    ],
    p2Name: 'Mestre das Marés',
    p2Title: 'Tridente Glacial',
    p2AvatarCardId: 'blue_11_anomalia_agua',
    p2Domain: 'blue',
    p2Hp: 14,
    p2Essence: 0,
    p2MaxEssence: 5,
    p2Affinities: { red: 0, blue: 3, purple: 0, green: 0, gold: 0, neutral: 0 },
    p2Units: [
      { cardId: 'blue_11_anomalia_agua', row: 'vanguard', slotIndex: 0 },
      { cardId: 'blue_11_anomalia_agua', row: 'vanguard', slotIndex: 1 },
      { cardId: 'blue_11_anomalia_agua', row: 'vanguard', slotIndex: 2 },
    ],
  },

  // ============================================================================
  // GRAU II — INTERMEDIÁRIO (★★☆☆☆ • 10 PROBLEMAS • 3 🪙 OURO CADA)
  // ============================================================================
  {
    id: 'prob_11_ruptura_relogio_astral',
    number: 11,
    code: 'PROBLEMA #11',
    title: 'Aceleração do Relógio Astral',
    subtitle: 'Usar feitiço gerador de Essência (+2⚡) antes da Expansão de Domínio para não travar a mana',
    difficulty: 'intermediario',
    difficultyLabel: 'Grau II • Intermediário',
    stars: 2,
    goldReward: 3,
    primaryDomain: 'blue',
    mechanicTag: '❄️ Feitiço de Estase (+2⚡) & Expansão',
    scenarioLore:
      'O Soberano Rubro tem 16 ❤️ protegido por duas Muralhas. Você tem apenas 4⚡ de Essência disponíveis agora, mas precisa tanto lançar a Ruptura do Relógio Astral (3⚡) quanto invocar o Olho do Maelstrom Astral (3⚡).',
    objectiveText: 'Gere Essência extra com a Ruptura do Relógio Astral e alcance 16 de dano letal neste turno.',
    hint1:
      'Olhe para o feitiço Ruptura do Relógio Astral na sua mão: ele custa 3⚡, mas restaura +2⚡ de Essência e compra 1 carta — ou seja, seu custo líquido é de apenas 1⚡!',
    hint2:
      '1º Lance Ruptura do Relógio Astral (gasta 3⚡, ganha +2⚡ → fica com 3⚡!). 2º Invoque a Expansão de Domínio Olho do Maelstrom Astral (3⚡): seu Arquimago do Vórtice e o Dragão de Safira em campo ganham +1/+1 e Acerto Garantido (6 + 10 = 16 de dano direto no Soberano!).',
    solutionSteps: [
      '1. Lance o feitiço Ruptura do Relógio Astral (3⚡): congela os inimigos e devolve +2⚡ de Essência (deixando você com 3⚡)!',
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
    id: 'prob_12_sinfonia_cripta',
    number: 12,
    code: 'PROBLEMA #12',
    title: 'Dobram os Sinos da Cripta',
    subtitle: 'Ordem exata entre Relíquia Necrótica na Retaguarda [R] e Expansão do Trono de Ossos',
    difficulty: 'intermediario',
    difficultyLabel: 'Grau II • Intermediário',
    stars: 2,
    goldReward: 3,
    primaryDomain: 'purple',
    mechanicTag: '💀 Relíquia [R] + Cobertura & Domínio',
    scenarioLore:
      'O Titã Silvestre tem 18 ❤️ e dois Guardiões bloqueando a Vanguarda. Você tem a Dama das Seis Lâminas, o Lich e o Mastim em campo, e o Campanário dos Mortos (4⚡) na mão.',
    objectiveText: 'Combine o Campanário dos Mortos e o Eclipse do Trono de Ossos para causar 18 de dano letal.',
    hint1:
      'O Campanário dos Mortos (4⚡) deve entrar na Retaguarda [R] atrás de uma criatura atacante para conceder +1/+1 imediato a todos os aliados E +1⚔️ de Cobertura à coluna onde for instalado!',
    hint2:
      '1º Instale o Campanário dos Mortos (4⚡) na Retaguarda [R] da Coluna 2 (atrás da Dama das Seis Lâminas, dando +1/+1 global e +1⚔️ Cobertura!). 2º Invoque a Expansão de Domínio Eclipse do Trono de Ossos (3⚡): suas unidades ganham +1/+1 e Acerto Garantido, somando 18+ de dano direto ao Soberano!',
    solutionSteps: [
      '1. Instale o Campanário dos Mortos (4⚡) na Retaguarda [R] da Coluna 2 (atrás da Dama das Seis Lâminas): concede +1/+1 a todos os aliados e +1⚔️ de Cobertura.',
      '2. Invoque a Expansão de Domínio Eclipse do Trono de Ossos (⛩️ 3⚡): todas as unidades recebem +1/+1, Ímpeto e Acerto Garantido.',
      '3. Ataque diretamente o Soberano rival com toda a Vanguarda (Dama das Seis Lâminas + Lich + Mastim) para 18+ de dano letal!',
    ],
    whyIndefensible:
      'Colocar o Campanário em uma coluna vazia sem atacante na Vanguarda desperdiça o bônus de +1⚔️ de Cobertura.',
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
    id: 'prob_13_trono_imperial_aurora',
    number: 13,
    code: 'PROBLEMA #13',
    title: 'A Falange do Imperador Eterno',
    subtitle: 'Sinergia entre Trono Supremo do Imperador (+1/+2) e Cidadela da Aurora',
    difficulty: 'intermediario',
    difficultyLabel: 'Grau II • Intermediário',
    stars: 2,
    goldReward: 3,
    primaryDomain: 'gold',
    mechanicTag: '☀️ Relíquia Imperial & Cidadela da Aurora',
    scenarioLore:
      'O Soberano do Abismo está com 16 ❤️ protegido por duas Muralhas. Você possui 8⚡ de Essência, o Trono Supremo do Imperador Eterno (5⚡) na mão e 6/6 de Afinidade Solar.',
    objectiveText: 'Combine o Trono do Imperador Eterno e a Cidadela da Aurora para alcançar 16 de dano letal.',
    hint1:
      'O Trono Supremo do Imperador Eterno custa 5⚡ e concede +1/+2 e Escudo Divino a todos os aliados quando entra em campo. Sobram exatos 3⚡ para a Expansão de Domínio!',
    hint2:
      '1º Posicione o Trono Supremo do Imperador Eterno (5⚡) na Retaguarda [R] da Coluna 3 (dando +1/+2 a todos e +1⚔️ Cobertura ao Dragão de Ouro!). 2º Invoque a Cidadela da Aurora Inabalável (⛩️ 3⚡) e ataque diretamente o Soberano rival!',
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
  {
    id: 'prob_14_exumar_legiao_cripta',
    number: 14,
    code: 'PROBLEMA #14',
    title: 'O Retorno do Campeão Caído',
    subtitle: 'Reanimar uma Lenda da Cripta e ativar a Expansão de Domínio para conceder Ímpeto imediato a ela',
    difficulty: 'intermediario',
    difficultyLabel: 'Grau II • Intermediário',
    stars: 2,
    goldReward: 3,
    primaryDomain: 'purple',
    mechanicTag: '⚰️ Reanimação da Cripta + Ímpeto do Domínio',
    scenarioLore:
      'Seu Dragão Vermelho (7⚔️) tombou no turno passado e descansa na sua Cripta (⚰️ 1). O Soberano rival tem 15 ❤️. Criaturas reanimadas normalmente entram com Enjoo de Invocação — a menos que seu Domínio esteja expandido!',
    objectiveText: 'Reanime o Dragão da Cripta com Uivo Despedaçador (3⚡) e dê Ímpeto a ele com o Trono de Ossos (3⚡)!',
    hint1:
      'O feitiço Uivo Despedaçador de Mentes (3⚡) reanima 1 criatura da sua Cripta e concede +1⚔️ a um aliado. Em seguida, a Expansão de Domínio (3⚡) concede +1/+1, Ímpeto e Acerto Garantido a todas as suas unidades (inclusive a recém-reanimada!).',
    hint2:
      '1º Lance Uivo Despedaçador de Mentes (3⚡): traz o Dragão Vermelho de volta da Cripta! 2º Ative a Expansão de Domínio Eclipse do Trono de Ossos (⛩️ 3⚡): o Dragão reanimado perde o Enjoo de Invocação (ganha Ímpeto +1/+1!) e ataca junto com a Dama das Seis Lâminas para 15+ de dano!',
    solutionSteps: [
      '1. Lance o feitiço Uivo Despedaçador de Mentes (3⚡): reanima o Dragão da sua Cripta para a Vanguarda e concede +1⚔️.',
      '2. Com os 3⚡ restantes, invoque a Expansão de Domínio Eclipse do Trono de Ossos (⛩️ 3⚡): concede +1/+1, Ímpeto (removendo o enjoo do Dragão reanimado!) e Acerto Garantido.',
      '3. Ataque diretamente o Soberano rival com a Dama das Seis Lâminas e o Dragão reanimado para 15+ de dano letal!',
    ],
    whyIndefensible:
      'Se você reanimar da Cripta sem expandir o Domínio, a criatura reanimada não poderá atacar neste turno.',
    turnNumber: 6,
    p1Name: 'Vesperion (Você)',
    p1AvatarCardId: 'purple_07_lich',
    p1Hp: 18,
    p1Essence: 6,
    p1MaxEssence: 6,
    p1Affinities: { red: 0, blue: 0, purple: 6, green: 0, gold: 0, neutral: 0 },
    p1HandCardIds: ['purple_160_exumacao_proibida'],
    p1DeckTopCardIds: ['purple_15_espectro'],
    p1ChanneledCardIds: [
      'purple_11_garra_rastejante',
      'purple_13_zumbi',
      'purple_15_espectro',
      'purple_17_banshee',
      'purple_18_mumia',
      'purple_25_dama_seis_laminas',
    ],
    p1CryptCardIds: ['red_08_dragao_vermelho'],
    p1Units: [
      { cardId: 'purple_25_dama_seis_laminas', row: 'vanguard', slotIndex: 1 },
    ],
    p2Name: 'Guardião da Floresta',
    p2Title: 'Druida Ancião',
    p2AvatarCardId: 'green_156_mamute_brasa_selvagem',
    p2Domain: 'green',
    p2Hp: 15,
    p2Essence: 0,
    p2MaxEssence: 6,
    p2Affinities: { red: 0, blue: 0, purple: 0, green: 5, gold: 0, neutral: 0 },
    p2Units: [
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 1, hasDivineShield: true },
    ],
  },
  {
    id: 'prob_15_alvo_manual_sob_dominio',
    number: 15,
    code: 'PROBLEMA #15',
    title: 'Escolha de Alvo Manual sob Domínio',
    subtitle: 'Em vez de atacar o Soberano no automático, abater uma criatura inimiga para liberar Invasão (+1⚔️)',
    difficulty: 'intermediario',
    difficultyLabel: 'Grau II • Intermediário',
    stars: 2,
    goldReward: 3,
    primaryDomain: 'red',
    mechanicTag: '🎯 Alvo Manual em Criatura + Último Suspiro',
    scenarioLore:
      'Sua Expansão de Domínio já está ativa! Se você clicar em "⚔️ ATACAR" no automático, todas as unidades atacarão o Soberano rival (causando 3 + 5 + 5 = 13 de dano, mas o rival tem 14 ❤️!). Porém, na Coluna 1 você tem um Diabrete de Escória (Último Suspiro: 1 de dano à Vanguarda inimiga) de frente para um inimigo 2/1!',
    objectiveText: 'Alcance exatos 14 de dano escolhendo o alvo manualmente durante a Expansão de Domínio!',
    hint1:
      'Sob a Expansão de Domínio, o botão automático ataca sempre o Soberano rival — mas você pode clicar manualmente em uma carta sua e depois clicar numa criatura inimiga se quiser matá-la!',
    hint2:
      'Veja a Coluna 2: há um inimigo 2/1 bloqueando o bônus de Invasão (+1⚔️) do seu Campeão Dracônico! E veja o seu Batedor Escamado (1⚡) na mão: se você invocar o Batedor na Coluna 4 (livre), ele entra com +1/+1 e Ímpeto do Domínio (causa 1 de dano ao entrar + 4⚔️ no ataque = 5 de dano!), totalizando 14+!',
    solutionSteps: [
      '1. Invoque o Batedor Escamado das Brasas (1⚡) na Vanguarda [V] da Coluna 4 (onde há o Altar na Retaguarda e a frente está livre): graças ao Domínio ativo, ele já entra com +1/+1, Ímpeto e causa 1 de dano ao Soberano rival!',
      '2. Com Cobertura (+1⚔️), Invasão (+1⚔️) e Domínio (+1/+1), o Batedor passa a ter 5⚔️ ATQ!',
      '3. Ataque o Soberano rival com todas as unidades para ultrapassar os 14 ❤️!',
    ],
    whyIndefensible:
      'Colocar o Batedor em uma coluna ocupada por inimigo ou sem Cobertura reduz o dano abaixo dos 14 ❤️ necessários.',
    turnNumber: 6,
    p1Name: 'Ignis Rex (Você)',
    p1AvatarCardId: 'red_04_meio_dragao',
    p1Hp: 20,
    p1Essence: 1,
    p1MaxEssence: 6,
    p1Affinities: { red: 6, blue: 0, purple: 0, green: 0, gold: 0, neutral: 0 },
    p1HandCardIds: ['red_01_kobold'],
    p1DeckTopCardIds: ['red_02_magmin'],
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
      { cardId: 'red_10_altar_draconico', row: 'rearguard', slotIndex: 3 },
    ],
    p2Name: 'Soberano das Sombras',
    p2Title: 'Lâmina Oculta',
    p2AvatarCardId: 'purple_25_dama_seis_laminas',
    p2Domain: 'purple',
    p2Hp: 14,
    p2Essence: 0,
    p2MaxEssence: 6,
    p2Affinities: { red: 0, blue: 0, purple: 5, green: 0, gold: 0, neutral: 0 },
    p2Units: [
      { cardId: 'purple_11_garra_rastejante', row: 'vanguard', slotIndex: 1 },
    ],
    initialDomainState: {
      owner: 'player',
      domain: 'red',
      turnsRemaining: 2,
      damageTakenByOwnerThisRound: 0,
      clashRival: null,
    },
  },
  {
    id: 'prob_16_mercenario_planar_ciclo',
    number: 16,
    code: 'PROBLEMA #16',
    title: 'O Contrato do Mercenário Planar',
    subtitle: 'Usar criatura que reembolsa +1⚡ e compra a carta do topo para fechar o combo letal',
    difficulty: 'intermediario',
    difficultyLabel: 'Grau II • Intermediário',
    stars: 2,
    goldReward: 3,
    primaryDomain: 'red',
    mechanicTag: '🌈 Reembolso de +1⚡ & Compra de Topo',
    scenarioLore:
      'O Soberano rival tem 13 ❤️. Você tem apenas 2⚡ de Essência disponíveis e o Mercenário Planar (2⚡) na mão. No topo do seu Grimório aguarda a Poção de Fúria (1⚡, +2/+2)!',
    objectiveText: 'Invoque o Mercenário Planar (2⚡ → devolve +1⚡ e compra 1 carta) para comprar e lançar a Poção de Fúria!',
    hint1:
      'O Mercenário Planar custa 2⚡, tem Ímpeto (3/4) e Ao Entrar concede +1⚡ de Essência extra neste turno e compra 1 carta do topo do seu Grimório!',
    hint2:
      '1º Invoque o Mercenário Planar (2⚡) na Vanguarda [V] da Coluna 3 (com o Altar na Retaguarda): você ganha +1⚡ e compra a Poção de Fúria (1⚡)! 2º Lance a Poção de Fúria (1⚡) no Mercenário ou no Mastim (+2/+2) e ataque com ambos para 13 de dano!',
    solutionSteps: [
      '1. Invoque o Mercenário Planar (2⚡) na Vanguarda [V] da Coluna 3 (atrás dele está o Altar Dracônico, concedendo Cobertura): seu efeito Ao Entrar gera +1⚡ de Essência e compra a Poção de Fúria!',
      '2. Com o 1⚡ gerado, lance a Poção de Fúria (+2/+2) em um dos seus atacantes.',
      '3. Ataque o Soberano rival com o Mastim das Cinzas e o Mercenário Planar para 13+ de dano letal!',
    ],
    whyIndefensible:
      'Se você invocar o Mercenário fora da Coluna 3 (sem Cobertura do Altar), faltará 1 de dano.',
    turnNumber: 4,
    p1Name: 'Ignis Rex (Você)',
    p1AvatarCardId: 'red_04_meio_dragao',
    p1Hp: 22,
    p1Essence: 2,
    p1MaxEssence: 4,
    p1Affinities: { red: 3, blue: 0, purple: 0, green: 0, gold: 0, neutral: 1 },
    p1HandCardIds: ['neutral_52_mercenario_planar'],
    p1DeckTopCardIds: ['neutral_18_pocao_furia', 'red_01_kobold'],
    p1ChanneledCardIds: ['red_01_kobold', 'red_03_mastim_infernal', 'neutral_52_mercenario_planar'],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'red_03_mastim_infernal', row: 'vanguard', slotIndex: 0 },
      { cardId: 'red_10_altar_draconico', row: 'rearguard', slotIndex: 2 },
    ],
    p2Name: 'Arconte Glacial',
    p2Title: 'Vigia do Pico',
    p2AvatarCardId: 'blue_19_yeti',
    p2Domain: 'blue',
    p2Hp: 13,
    p2Essence: 0,
    p2MaxEssence: 4,
    p2Affinities: { red: 0, blue: 3, purple: 0, green: 0, gold: 0, neutral: 0 },
    p2Units: [],
  },
  {
    id: 'prob_17_arquimago_gatilho_feitico',
    number: 17,
    code: 'PROBLEMA #17',
    title: 'Ressonância do Códice Astral',
    subtitle: 'Instalar o Códice da Ressonância ANTES dos feitiços para disparar 2 de dano extra por feitiço',
    difficulty: 'intermediario',
    difficultyLabel: 'Grau II • Intermediário',
    stars: 2,
    goldReward: 3,
    primaryDomain: 'blue',
    mechanicTag: '📖 Gatilho "Ao Lançar Feitiço" (Ordem de Jogo)',
    scenarioLore:
      'O Soberano rival tem 13 ❤️ e um Guardião (5 ❤️) na Coluna 2 bloqueando seu Barão das Marés (5⚔️). Você tem 5⚡, o Códice da Ressonância Astral (3⚡, Ao Lançar Feitiço: 2 de dano a um inimigo) e o Pulso Etéreo (2⚡, +1⚡ e compra 1 carta).',
    objectiveText: 'Use a ordem correta (Relíquia antes do Feitiço!) para destruir o Guardião e causar 13 de dano!',
    hint1:
      'O Códice da Ressonância Astral (3⚡) compra 2 cartas Ao Entrar e causa 2 de dano a um inimigo SEMPRE que você lança um feitiço! Além disso, o Pulso Etéreo custa 2⚡ e devolve +1⚡!',
    hint2:
      '1º Instale o Códice da Ressonância Astral (3⚡) na Retaguarda [R] da Coluna 2 (atrás do Barão das Marés, dando +1⚔️ Cobertura!). 2º Lance o Pulso Etéreo (2⚡ → devolve +1⚡ e ativa o Códice causando 2 de dano no Guardião!). 3º Lance a Poção de Fúria (1⚡, comprada pelo Códice!) no Barão das Marés (ativa o Códice de novo e eleva o Barão com Atropelar para esmagar o Guardião e o Soberano!).',
    solutionSteps: [
      '1. Instale o Códice da Ressonância Astral (3⚡) na Retaguarda [R] da Coluna 2 (atrás do Barão das Marés): compra 2 cartas e dá +1⚔️ de Cobertura.',
      '2. Lance o Pulso Etéreo (2⚡): devolve +1⚡ de Essência e dispara o Códice (2 de dano no Guardião inimigo).',
      '3. Com o 1⚡ gerado, lance a Poção de Fúria (+2/+2) no Barão das Marés (dispara mais 2 de dano do Códice!) e ataque com suas unidades para 13+ de dano letal!',
    ],
    whyIndefensible:
      'Se você lançar o Pulso Etéreo antes de instalar o Códice da Ressonância Astral, perderá o disparo rúnico de 2 de dano.',
    turnNumber: 6,
    p1Name: 'Hydrissa (Você)',
    p1AvatarCardId: 'blue_06_dragao_azul',
    p1Hp: 22,
    p1Essence: 5,
    p1MaxEssence: 6,
    p1Affinities: { red: 0, blue: 4, purple: 0, green: 0, gold: 0, neutral: 1 },
    p1HandCardIds: ['blue_10_portal_runas', 'neutral_36_pulso_etereo'],
    p1DeckTopCardIds: ['neutral_18_pocao_furia', 'red_01_kobold', 'blue_01_sentinela_ventos'],
    p1ChanneledCardIds: ['blue_01_sentinela_ventos', 'blue_10_portal_runas', 'blue_15_barao_recifes', 'neutral_36_pulso_etereo'],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'blue_15_barao_recifes', row: 'vanguard', slotIndex: 1, damageTaken: 1 },
      { cardId: 'blue_12_espreitador_eter', row: 'vanguard', slotIndex: 3 },
    ],
    p2Name: 'General Rubro',
    p2Title: 'Forjador de Cinzas',
    p2AvatarCardId: 'red_04_meio_dragao',
    p2Domain: 'red',
    p2Hp: 13,
    p2Essence: 0,
    p2MaxEssence: 6,
    p2Affinities: { red: 4, blue: 0, purple: 0, green: 0, gold: 0, neutral: 0 },
    p2Units: [
      { cardId: 'blue_11_anomalia_agua', row: 'vanguard', slotIndex: 1 },
    ],
  },
  {
    id: 'prob_18_poder_soberano_letal',
    number: 18,
    code: 'PROBLEMA #18',
    title: 'O Decreto do Poder do Soberano',
    subtitle: 'Incluir o Poder Heroico do Soberano (2⚡) na matemática exata de letal',
    difficulty: 'intermediario',
    difficultyLabel: 'Grau II • Intermediário',
    stars: 2,
    goldReward: 3,
    primaryDomain: 'red',
    mechanicTag: '🔥 Poder do Soberano (2⚡) + Óleo Etéreo',
    scenarioLore:
      'Você tem duas criaturas na Vanguarda (3⚔️ e 3⚔️) e o Soberano rival tem 13 ❤️. Na sua mão há apenas o Óleo de Afiação Etérea (2⚡, +2/+2 a todos os aliados), e você tem 4⚡ de Essência.',
    objectiveText: 'Cause exatos 13 de dano usando apenas 1 carta da mão + o Poder do Soberano (2⚡)!',
    hint1:
      'Com o Óleo de Afiação Etérea (2⚡), suas duas criaturas sobem de 4⚔️ (com Invasão) para 6⚔️ + 6⚔️ = 12⚔️. Onde está o 1 de dano que falta para 13 ❤️ e onde gastar os 2⚡ restantes?',
    hint2:
      'Olhe para a barra inferior de comando: o botão "🔥 Poder (2⚡)" ativa o Poder do Soberano Carmesim, que concede +1⚔️ ou causa dano extra neste turno! 1º Lance o Óleo de Afiação Etérea (2⚡). 2º Clique em "🔥 Poder (2⚡)" na barra inferior! 3º Ataque com suas duas criaturas para fechar os 13+ de dano!',
    solutionSteps: [
      '1. Lance o feitiço Óleo de Afiação Etérea (2⚡): concede +2/+2 a todas as suas unidades aliadas.',
      '2. Clique no botão do Poder do Soberano ("🔥 2⚡") na barra inferior de comando para converter seus 2⚡ restantes em poder ofensivo extra!',
      '3. Ataque o Soberano rival com suas duas unidades na Vanguarda para alcançar os 13+ de dano letal!',
    ],
    whyIndefensible:
      'Muitos jogadores olham apenas para as cartas da mão e esquecem que o Poder do Soberano (2⚡) na barra inferior garante o ponto final de dano.',
    turnNumber: 5,
    p1Name: 'Ignis Rex (Você)',
    p1AvatarCardId: 'red_04_meio_dragao',
    p1Hp: 20,
    p1Essence: 4,
    p1MaxEssence: 5,
    p1Affinities: { red: 3, blue: 0, purple: 0, green: 0, gold: 0, neutral: 0 },
    p1HandCardIds: ['neutral_145_oleo_afiacao_eterea'],
    p1DeckTopCardIds: ['red_01_kobold'],
    p1ChanneledCardIds: ['red_01_kobold', 'red_03_mastim_infernal', 'red_04_meio_dragao'],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'red_03_mastim_infernal', row: 'vanguard', slotIndex: 1 },
      { cardId: 'red_03_mastim_infernal', row: 'vanguard', slotIndex: 3 },
    ],
    p2Name: 'Vigia de Esmeralda',
    p2Title: 'Arco da Floresta',
    p2AvatarCardId: 'green_17_centauro',
    p2Domain: 'green',
    p2Hp: 13,
    p2Essence: 0,
    p2MaxEssence: 5,
    p2Affinities: { red: 0, blue: 0, purple: 0, green: 3, gold: 0, neutral: 0 },
    p2Units: [],
  },
  {
    id: 'prob_19_manto_invisibilidade_bounce',
    number: 19,
    code: 'PROBLEMA #19',
    title: 'Manto de Invisibilidade (Retorno à Mão)',
    subtitle: 'Devolver um Colosso Guardião com Escudo Divino e 3 de Armadura para a mão do oponente por 2⚡',
    difficulty: 'intermediario',
    difficultyLabel: 'Grau II • Intermediário',
    stars: 2,
    goldReward: 3,
    primaryDomain: 'blue',
    mechanicTag: '🌪️ Devolver à Mão (Bounce) + Compra',
    scenarioLore:
      'Um Golem de Ouro e Adamante (Guardião, 3 de Armadura, Escudo Divino) bloqueia a Coluna 2 diante do seu Dragão Azul (7⚔️). Seriam necessários vários ataques apenas para quebrar o Escudo Divino e a Armadura 3 dele! O Soberano rival tem 14 ❤️.',
    objectiveText: 'Remova o Golem impenetrável sem atacá-lo e cause 14 de dano ao Soberano rival!',
    hint1:
      'Escudo Divino e Armadura protegem contra DANO, mas não protegem contra efeitos que DEVOLVEM a unidade para a mão do dono (como a Cortina de Fumaça de Mercúrio ou o Manto de Invisibilidade)!',
    hint2:
      '1º Lance a Cortina de Fumaça de Mercúrio (2⚡, devolve 1 inimigo para a mão do oponente e compra 1 carta): o Golem desaparece da Coluna 2 e você compra a Poção de Fúria (1⚡)! 2º Lance a Poção de Fúria (1⚡, +2/+2) no Dragão Azul ou no Caçador do Vento e ataque com ambos para 14+ de dano!',
    solutionSteps: [
      '1. Lance a Cortina de Fumaça de Mercúrio (2⚡): devolve o Golem Guardião para a mão do oponente (ignorando Escudo Divino e Armadura 3!) e compra a Poção de Fúria.',
      '2. Com a Coluna 2 agora livre (+1⚔️ Invasão), lance a Poção de Fúria (1⚡, +2/+2) no seu atacante.',
      '3. Ataque diretamente o Soberano rival com o Dragão Azul e o Caçador do Vento para 14+ de dano letal!',
    ],
    whyIndefensible:
      'Tentar destruir o Golem na força bruta falha por causa do Escudo Divino + 3 de Armadura.',
    turnNumber: 6,
    p1Name: 'Hydrissa (Você)',
    p1AvatarCardId: 'blue_06_dragao_azul',
    p1Hp: 22,
    p1Essence: 3,
    p1MaxEssence: 6,
    p1Affinities: { red: 0, blue: 4, purple: 0, green: 0, gold: 0, neutral: 1 },
    p1HandCardIds: ['neutral_162_bomba_fumaca_alquimica'],
    p1DeckTopCardIds: ['neutral_18_pocao_furia', 'blue_01_sentinela_ventos'],
    p1ChanneledCardIds: ['blue_01_sentinela_ventos', 'blue_06_dragao_azul', 'blue_12_espreitador_eter'],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'blue_06_dragao_azul', row: 'vanguard', slotIndex: 1 },
      { cardId: 'blue_12_espreitador_eter', row: 'vanguard', slotIndex: 3 },
    ],
    p2Name: 'Forjador de Solária',
    p2Title: 'Mestre do Adamante',
    p2AvatarCardId: 'gold_153_inquisidor_balanca_ouro',
    p2Domain: 'gold',
    p2Hp: 14,
    p2Essence: 0,
    p2MaxEssence: 6,
    p2Affinities: { red: 0, blue: 0, purple: 0, green: 0, gold: 4, neutral: 0 },
    p2Units: [
      { cardId: 'gold_153_inquisidor_balanca_ouro', row: 'vanguard', slotIndex: 1, hasDivineShield: true },
    ],
  },
  {
    id: 'prob_20_dragao_esmeralda_sinergia',
    number: 20,
    code: 'PROBLEMA #20',
    title: 'O Despertar de Veridia (+2/+2 Global)',
    subtitle: 'Usar Contrato de Sangue e Soldo (+1⚡ líquida não: compra 2 + 1⚡) + Pedra Filosofal para invocar Dragão de 8⚡',
    difficulty: 'intermediario',
    difficultyLabel: 'Grau II • Intermediário',
    stars: 2,
    goldReward: 3,
    primaryDomain: 'green',
    mechanicTag: '🌿 Dragão Esmeralda (+2/+2 Global) & Cobertura',
    scenarioLore:
      'O Soberano rival tem 20 ❤️. Você possui 8⚡ de Essência e o Dragão Esmeralda de Galhada Viva (8⚡, Ao Entrar: +2/+2 a todos os aliados) na mão, além de 3 predadores na Vanguarda.',
    objectiveText: 'Posicione o Dragão Esmeralda para amplificar todo o seu exército e causar 20+ de dano neste turno!',
    hint1:
      'Mesmo que uma criatura sem Ímpeto não possa atacar no turno em que entra, seu grito de guerra Ao Entrar (+2/+2 a todos os aliados) E seu bônus de Cobertura (+1⚔️ se colocado na Retaguarda [R]!) valem imediatamente!',
    hint2:
      '1º Invoque o Dragão Esmeralda de Galhada Viva (8⚡) na RETAGUARDA [R] da Coluna 2 (atrás do Lobisomem!): o efeito Ao Entrar dá +2/+2 para as suas 3 feras na Vanguarda (+6⚔️ no total!) e o Dragão na Retaguarda ainda dá +1⚔️ de Cobertura ao Lobisomem! 2º Ataque com suas 3 feras na Vanguarda para 20+ de dano!',
    solutionSteps: [
      '1. Invoque o Dragão Esmeralda de Galhada Viva (8⚡) na Retaguarda [R] atrás de uma de suas feras na Vanguarda: seu efeito Ao Entrar concede +2/+2 a todos os aliados (+6⚔️ somados) e sua presença na Retaguarda concede mais +1⚔️ de Cobertura!',
      '2. Ataque o Soberano rival com suas 3 feras da Vanguarda (agora turbinadas em +7⚔️ totais) para 20+ de dano letal!',
    ],
    whyIndefensible:
      'Se você colocar o Dragão Esmeralda na Vanguarda (onde ele tem Enjoo de Invocação), perderá o +1⚔️ de Cobertura na Retaguarda e ficará com 19 de dano (faltando 1 para os 20 ❤️!).',
    turnNumber: 8,
    p1Name: 'Sylvarion (Você)',
    p1AvatarCardId: 'green_161_dragao_esmeralda_primordial',
    p1Hp: 24,
    p1Essence: 8,
    p1MaxEssence: 8,
    p1Affinities: { red: 0, blue: 0, purple: 0, green: 5, gold: 0, neutral: 0 },
    p1HandCardIds: ['green_161_dragao_esmeralda_primordial'],
    p1DeckTopCardIds: ['green_17_centauro'],
    p1ChanneledCardIds: [
      'green_17_centauro',
      'green_18_lobisomem',
      'green_154_serpente_abismo_verde',
      'green_161_dragao_esmeralda_primordial',
      'green_26_instinto_predatorio',
    ],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'green_18_lobisomem', row: 'vanguard', slotIndex: 1 },
      { cardId: 'green_154_serpente_abismo_verde', row: 'vanguard', slotIndex: 2 },
      { cardId: 'green_17_centauro', row: 'vanguard', slotIndex: 4 },
    ],
    p2Name: 'Arconte das Nuvens',
    p2Title: 'Trono da Tempestade',
    p2AvatarCardId: 'blue_05_gigante_nuvens',
    p2Domain: 'blue',
    p2Hp: 20,
    p2Essence: 0,
    p2MaxEssence: 8,
    p2Affinities: { red: 0, blue: 5, purple: 0, green: 0, gold: 0, neutral: 0 },
    p2Units: [],
  },

  // ============================================================================
  // GRAU III — AVANÇADO (★★★☆☆ • 10 PROBLEMAS • 5 🪙 OURO CADA)
  // ============================================================================
  {
    id: 'prob_21_desempate_dominio_7v6',
    number: 21,
    code: 'PROBLEMA #21',
    title: 'Supremacia 7 contra 6 (Quebra de Confronto 50/50)',
    subtitle: 'Canalizar o 7º Terreno para estilhaçar o Confronto de Domínios 50/50 e reativar o Acerto Garantido',
    difficulty: 'avancado',
    difficultyLabel: 'Grau III • Avançado',
    stars: 3,
    goldReward: 5,
    primaryDomain: 'gold',
    mechanicTag: '⚡⛩️ Confronto 50/50 → Supremacia 7 vs 6',
    scenarioLore:
      'A mesa está travada num Confronto de Domínios 50/50 (6 vs 6 de Afinidade)! Enquanto o Confronto 50/50 persistir, o seu Acerto Garantido está ANULADO e três Muralhas com Escudo Divino bloqueiam seus atacantes. O Soberano rival tem 19 ❤️.',
    objectiveText: 'Rompa o Confronto 50/50 por superioridade de Afinidade (7 vs 6) e cause 19 de dano letal!',
    hint1:
      'Em um Confronto de Domínios 50/50, se um dos Soberanos aumentar sua Afinidade do Domínio ativo para superar o rival (7 vs 6), o domínio inimigo é estilhaçado imediatamente!',
    hint2:
      '1º Selecione a Cúpula das Asas Seráficas na mão e clique em "⛰️ Canalizar [C]": sua Afinidade Dourada sobe para 7 vs 6, estilhaçando o domínio roxo rival e reativando seu Acerto Garantido! 2º Invoque Aurelius, Soberano Dragão da Alvorada na Vanguarda [V] (8⚡: ganha +1/+1 e Ímpeto da Cidadela da Aurora!) e ataque o Soberano rival para 21+ de dano!',
    solutionSteps: [
      '1. Selecione a Cúpula das Asas Seráficas na mão e clique em "⛰️ Canalizar [C]": sua Afinidade Solar sobe de 6 para 7 (7 vs 6), estilhaçando a barreira roxa do rival automaticamente e restaurando seu Acerto Garantido!',
      '2. Invoque Aurelius, Soberano Dragão da Alvorada na Vanguarda [V] (8⚡): ele entra com +1/+1 e Ímpeto da Cidadela da Aurora!',
      '3. Ataque diretamente o Soberano rival com toda a sua Vanguarda com Acerto Garantido para superar os 19 ❤️!',
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
    p2Hp: 19,
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
    id: 'prob_22_quebra_concentracao_8dano',
    number: 22,
    code: 'PROBLEMA #22',
    title: 'Colapso da Concentração (Regra dos 8 de Dano)',
    subtitle: 'Causar 8+ de dano ao Soberano rival por Voo para estilhaçar o Domínio dele e enfraquecer sua Guarda',
    difficulty: 'avancado',
    difficultyLabel: 'Grau III • Avançado',
    stars: 3,
    goldReward: 5,
    primaryDomain: 'blue',
    mechanicTag: '💥 Quebra por 8+ Dano no Soberano',
    scenarioLore:
      'O Soberano inimigo está com a Expansão de Domínio ativa (+1/+1 para as tropas dele), deixando o Guardião inimigo na Coluna 2 com 2 ❤️ (graças ao +1/+1 do Domínio rival). Você NÃO tem Afinidade para expandir seu Domínio, mas seu Dragão de Safira tem Voo (9⚔️)!',
    objectiveText: 'Quebre a concentração do Domínio rival causando 8+ de dano com Voo antes de atacar por terra!',
    hint1:
      'Qualquer Soberano que sofra 8 ou mais de dano na mesma rodada perde a concentração e tem sua Expansão de Domínio estilhaçada imediatamente — removendo o bônus de +1/+1 das criaturas dele!',
    hint2:
      '1º Ataque DIRETAMENTE o Soberano rival com o Dragão de Safira Sônico (ele tem Voo, então ignora o Guardião terrestre e causa 9 de dano ao Soberano!). 2º Como o Soberano rival sofreu 9 de dano (>= 8), a Expansão de Domínio dele se estilhaça na hora e o Guardião inimigo perde o +1/+1, ficando com apenas 1 ❤️! 3º Jogue a Salamandra (4⚡, 2 de dano Ao Entrar) para eliminar o Guardião de 1 ❤️ e ataque o Soberano rival com seu Campeão terrestre para finalizar!',
    solutionSteps: [
      '1. Selecione o Dragão de Safira Sônico (que possui Voo) e ataque diretamente o Soberano rival: causa 9 de dano (15 ❤️ → 6 ❤️) e atinge o limiar de 8+ de dano, estilhaçando a Expansão de Domínio inimiga por perda de concentração!',
      '2. Sem o +1/+1 do Domínio rival, a vida do Guardião inimigo na Coluna 2 cai de 2 ❤️ para 1 ❤️! Invoque a Salamandra do Mar de Brasas (4⚡) mirando seus 2 de dano Ao Entrar no Guardião inimigo para destruí-lo!',
      '3. Com a Coluna 2 agora livre (ganhando +1⚔️ de Invasão!), ataque o Soberano rival com sua Salamandra na Coluna 2 para 6 de dano letal!',
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
    id: 'prob_23_combustao_dupla_afinidade',
    number: 23,
    code: 'PROBLEMA #23',
    title: 'Alquimia das Brasas (Canalizar + Sacrificar)',
    subtitle: 'Usar a 1ª carta para Canalizar (6/6 Afinidade) e a 2ª para Queimar (+1⚡ Essência)',
    difficulty: 'avancado',
    difficultyLabel: 'Grau III • Avançado',
    stars: 3,
    goldReward: 5,
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
  {
    id: 'prob_24_quebra_concentracao_feitico_voo',
    number: 24,
    code: 'PROBLEMA #24',
    title: 'Colheita de Obsidiana (Dano Híbrido 8+)',
    subtitle: 'Somar 3 de dano de Feitiço + 5 de dano por Voo para atingir os 8 de dano que quebram o Domínio rival',
    difficulty: 'avancado',
    difficultyLabel: 'Grau III • Avançado',
    stars: 3,
    goldReward: 5,
    primaryDomain: 'purple',
    mechanicTag: '💀 Feitiço (3) + Voo (5) = 8 Dano (Quebra Domínio)',
    scenarioLore:
      'O Soberano Dourado (15 ❤️) está com a Cidadela da Aurora ativa (+1/+1), protegendo sua Vanguarda com dois Guardiões terrestres. Seu Espectro em campo tem Voo (5⚔️), mas 5 de dano sozinho NÃO atinge os 8 necessários para quebrar o Domínio rival!',
    objectiveText: 'Combine feitiço + ataque aéreo para somar 8 de dano no Soberano rival, estilhaçar o Domínio dele e finalizar por terra!',
    hint1:
      'A Colheita do Cálice de Obsidiana (6⚡) destrói 1 unidade inimiga E causa 3 de dano ao Soberano rival! Se você somar esses 3 de dano com os 5⚔️ do seu Espectro Voador, o Soberano rival sofrerá 8 de dano na rodada!',
    hint2:
      '1º Lance a Colheita do Cálice de Obsidiana (6⚡): destrói um Guardião inimigo e causa 3 de dano ao Soberano rival (15 ❤️ → 12 ❤️). 2º Ataque o Soberano rival com o Espectro (Voo, 5⚔️): o Soberano acumula 3 + 5 = 8 de dano na rodada, estilhaçando a Expansão de Domínio dele e deixando o segundo Guardião com apenas 1 ❤️! 3º Ataque com seu Verme Púrpura (Sopro 2 + Atropelar) para destruir o Guardião restante e vencer!',
    solutionSteps: [
      '1. Lance a Colheita do Cálice de Obsidiana (6⚡): destrói um Guardião e causa 3 de dano ao Soberano rival (acumulando 3/8 de dano para quebra de concentração).',
      '2. Ataque diretamente o Soberano rival com o Espectro (Voo, 5⚔️): totaliza 8 de dano na rodada, estilhaçando o Domínio rival e removendo o +1/+1 do último Guardião!',
      '3. Ataque com seu Verme Púrpura na Coluna 2 (o Sopro 2 elimina o Guardião enfraquecido e os 11⚔️ atingem o Soberano rival)!',
    ],
    whyIndefensible:
      'Se você atacar com o Verme Púrpura antes de acumular 8 de dano no Soberano rival, o Guardião terá vida suficiente pelo Domínio para absorver o impacto.',
    turnNumber: 7,
    p1Name: 'Vesperion (Você)',
    p1AvatarCardId: 'purple_156_lich_coroa_entropia',
    p1Hp: 18,
    p1Essence: 6,
    p1MaxEssence: 7,
    p1Affinities: { red: 0, blue: 0, purple: 4, green: 2, gold: 0, neutral: 0 },
    p1HandCardIds: ['purple_162_apocalipse_necrotico'],
    p1DeckTopCardIds: ['purple_15_espectro'],
    p1ChanneledCardIds: ['purple_15_espectro', 'purple_162_apocalipse_necrotico', 'green_24_verme_purpura'],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'purple_15_espectro', row: 'vanguard', slotIndex: 4 },
      { cardId: 'green_24_verme_purpura', row: 'vanguard', slotIndex: 1 },
    ],
    p2Name: 'Aurelius',
    p2Title: 'Cidadela da Aurora',
    p2AvatarCardId: 'gold_157_dragao_soberano_alvorada',
    p2Domain: 'gold',
    p2Hp: 15,
    p2Essence: 0,
    p2MaxEssence: 7,
    p2Affinities: { red: 0, blue: 0, purple: 0, green: 0, gold: 6, neutral: 0 },
    p2Units: [
      { cardId: 'blue_13_lanceiro_mares', row: 'vanguard', slotIndex: 1, damageTaken: 1 },
    ],
    initialDomainState: {
      owner: 'ai',
      domain: 'gold',
      turnsRemaining: 2,
      damageTakenByOwnerThisRound: 0,
      clashRival: null,
    },
  },
  {
    id: 'prob_25_pedra_filosofal_expansao',
    number: 25,
    code: 'PROBLEMA #25',
    title: 'A Pedra Filosofal e o Sexto Selo',
    subtitle: 'Combinar Pedra Filosofal (5⚡ → +2⚡) + Sacrifício de Carta (+1⚡) para pagar Relíquia + Domínio + Feitiço',
    difficulty: 'avancado',
    difficultyLabel: 'Grau III • Avançado',
    stars: 3,
    goldReward: 5,
    primaryDomain: 'green',
    mechanicTag: '💎 Pedra Filosofal (+2⚡) & Combustão',
    scenarioLore:
      'O Soberano rival tem 19 ❤️ protegido por três Muralhas. Você tem apenas 6⚡ de Essência, mas precisa instalar a Pedra Filosofal (5⚡, gera +2⚡), lançar Ruptura de Raízes (2⚡, +2/+2 a todos) E invocar a Expansão de Domínio Selva Primordial (3⚡)!',
    objectiveText: 'Transforme 6⚡ em 10⚡ totais de ações usando a Pedra Filosofal + Canalizar + Queimar!',
    hint1:
      'A Pedra Filosofal custa 5⚡ e devolve +2⚡ Ao Entrar (custo líquido de 3⚡, além de dar +1⚔️ de Cobertura na Retaguarda!). E se você Canalizar 1 carta e Sacrificar/Queimar outra, ganha mais +1⚡!',
    hint2:
      '1º Canalize o Batedor [C] (compra 1 carta) e Sacrifique/Queime a carta comprada [C] (+1⚡ → você sobe de 6⚡ para 7⚡!). 2º Instale a Pedra Filosofal (5⚡) na Retaguarda [R] da Coluna 2 (devolve +2⚡ → você fica com 4⚡!). 3º Invoque a Expansão de Domínio (⛩️ 3⚡) e lance a Poção de Fúria (1⚡) ou ataque com todas as feras!',
    solutionSteps: [
      '1. Canalize [C] o Batedor da mão (compra a Poção de Fúria 1⚡) e Sacrifique [C] outra carta secundária se desejar +1⚡.',
      '2. Instale a Pedra Filosofal (5⚡) na Retaguarda [R] da Coluna 2 (atrás do Tiranossauro): devolve +2⚡ de Essência e dá +1⚔️ de Cobertura!',
      '3. Invoque a Expansão de Domínio Selva Primordial (⛩️ 3⚡): todas as suas feras ganham +1/+1, Ímpeto e Acerto Garantido.',
      '4. Ataque diretamente o Soberano rival com toda a sua Vanguarda para 19+ de dano letal!',
    ],
    whyIndefensible:
      'Se você invocar a Expansão de Domínio (3⚡) antes da Pedra Filosofal (5⚡), sobrarão apenas 3⚡ e você ficará sem mana para a Pedra Filosofal.',
    turnNumber: 7,
    p1Name: 'Sylvarion (Você)',
    p1AvatarCardId: 'green_161_dragao_esmeralda_primordial',
    p1Hp: 20,
    p1Essence: 6,
    p1MaxEssence: 7,
    p1Affinities: { red: 0, blue: 0, purple: 0, green: 6, gold: 0, neutral: 1 },
    p1HandCardIds: ['neutral_17_pedra_filosofal', 'green_147_batedor_folha_viva'],
    p1DeckTopCardIds: ['neutral_18_pocao_furia', 'green_18_lobisomem'],
    p1ChanneledCardIds: [
      'green_17_centauro',
      'green_18_lobisomem',
      'green_20_tubarao_terrestre',
      'green_22_wyvern',
      'green_25_dragao_verde',
      'green_157_quimera_tres_presas',
    ],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'green_157_quimera_tres_presas', row: 'vanguard', slotIndex: 1 },
      { cardId: 'green_20_tubarao_terrestre', row: 'vanguard', slotIndex: 2 },
      { cardId: 'green_18_lobisomem', row: 'vanguard', slotIndex: 4 },
    ],
    p2Name: 'Templário Solar',
    p2Title: 'Guardião da Cúpula',
    p2AvatarCardId: 'gold_156_serafim_coroa_radiante',
    p2Domain: 'gold',
    p2Hp: 19,
    p2Essence: 0,
    p2MaxEssence: 7,
    p2Affinities: { red: 0, blue: 0, purple: 0, green: 0, gold: 5, neutral: 0 },
    p2Units: [
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 1, hasDivineShield: true },
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 2, hasDivineShield: true },
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 4, hasDivineShield: true },
    ],
  },
  {
    id: 'prob_26_inversao_gravitacional_furia',
    number: 26,
    code: 'PROBLEMA #26',
    title: 'Inversão Gravitacional (Fúria em Massa)',
    subtitle: 'Causar 3 de dano a TODAS as unidades para ativar Fúria Crescente nos próprios aliados e varrer a Guarda',
    difficulty: 'avancado',
    difficultyLabel: 'Grau III • Avançado',
    stars: 3,
    goldReward: 5,
    primaryDomain: 'red',
    mechanicTag: '🌌 Dano Global → Ativa Fúria Crescente Aliada',
    scenarioLore:
      'Suas três criaturas na Vanguarda estão com a Vida cheia (sem ativar a Fúria Crescente delas!) e três Guardiões inimigos de 3 ❤️ bloqueiam as Colunas 1, 2 e 3. O Soberano rival tem 21 ❤️.',
    objectiveText: 'Lance Inversão Gravitacional Planar (5⚡) para destruir os 3 Guardiões E enfurecer seus 3 atacantes ao mesmo tempo!',
    hint1:
      'O feitiço Inversão Gravitacional Planar (5⚡) causa 3 de dano a TODAS as unidades (aliadas e inimigas!) e 3 de dano ao Soberano rival. Veja o que acontece quando seus próprios guerreiros com Fúria Crescente sofrem 3 de dano e sobrevivem!',
    hint2:
      '1º Lance Inversão Gravitacional Planar (5⚡): causa 3 de dano ao Soberano rival (21 ❤️ → 18 ❤️), destrói os 3 Guardiões inimigos de 3 ❤️ (liberando +1⚔️ de Invasão nas 3 colunas!) e fere seus 3 guerreiros com Fúria Crescente (+2⚔️ ATQ para cada um!). 2º Ataque com os 3 guerreiros enfurecidos (6⚔️ + 6⚔️ + 7⚔️ = 19⚔️) para vencer!',
    solutionSteps: [
      '1. Lance Inversão Gravitacional Planar (5⚡): elimina os 3 Guardiões inimigos, causa 3 de dano ao Soberano rival (21 ❤️ → 18 ❤️) e fere suas 3 criaturas sem matá-las.',
      '2. Agora feridas e com as colunas livres, cada uma das suas 3 criaturas ativa Fúria Crescente (+2⚔️) e Invasão (+1⚔️), ganhando +9⚔️ somados!',
      '3. Ataque o Soberano rival com seus 3 campeões enfurecidos para 19 de dano letal!',
    ],
    whyIndefensible:
      'Atacar antes de lançar a Inversão Gravitacional desperdiça os ataques nos Guardiões e não ativa a Fúria Crescente nem a Invasão.',
    turnNumber: 6,
    p1Name: 'Ignis Rex (Você)',
    p1AvatarCardId: 'red_04_meio_dragao',
    p1Hp: 22,
    p1Essence: 5,
    p1MaxEssence: 6,
    p1Affinities: { red: 3, blue: 0, purple: 0, green: 2, gold: 0, neutral: 1 },
    p1HandCardIds: ['neutral_156_cataclismo_gravidade_reversa'],
    p1DeckTopCardIds: ['red_01_kobold'],
    p1ChanneledCardIds: ['red_04_meio_dragao', 'green_18_lobisomem', 'neutral_156_cataclismo_gravidade_reversa'],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'red_04_meio_dragao', row: 'vanguard', slotIndex: 0 },
      { cardId: 'green_18_lobisomem', row: 'vanguard', slotIndex: 1 },
      { cardId: 'green_18_lobisomem', row: 'vanguard', slotIndex: 2 },
    ],
    p2Name: 'Guardião das Marés',
    p2Title: 'Tridente de Sal',
    p2AvatarCardId: 'blue_11_anomalia_agua',
    p2Domain: 'blue',
    p2Hp: 21,
    p2Essence: 0,
    p2MaxEssence: 6,
    p2Affinities: { red: 0, blue: 4, purple: 0, green: 0, gold: 0, neutral: 0 },
    p2Units: [
      { cardId: 'blue_11_anomalia_agua', row: 'vanguard', slotIndex: 0 },
      { cardId: 'blue_11_anomalia_agua', row: 'vanguard', slotIndex: 1 },
      { cardId: 'blue_11_anomalia_agua', row: 'vanguard', slotIndex: 2 },
    ],
  },
  {
    id: 'prob_27_talisma_bem_cobertura',
    number: 27,
    code: 'PROBLEMA #27',
    title: 'O Talismã da Alvorada e a Sentinela',
    subtitle: 'Usar Relíquia que causa 4 de dano Ao Entrar E invoca Sentinela 3/4 antes da Expansão de Domínio',
    difficulty: 'avancado',
    difficultyLabel: 'Grau III • Avançado',
    stars: 3,
    goldReward: 5,
    primaryDomain: 'gold',
    mechanicTag: '☀️ Relíquia + Token → Expansão de Domínio',
    scenarioLore:
      'O Soberano rival tem 17 ❤️ e três Guardiões bloqueando a Vanguarda. Você tem 8⚡ de Essência, 6/6 de Afinidade Solar e o Talismã do Bem Supremo (5⚡) na mão.',
    objectiveText: 'Importa a ordem! Instale o Talismã ANTES ou DEPOIS da Expansão de Domínio para maximizar o dano?',
    hint1:
      'O Talismã do Bem Supremo (5⚡) deve ser instalado na Retaguarda [R] atrás de uma criatura atacante (+1⚔️ Cobertura) e invoca uma Sentinela 3/4! Com a Cidadela da Aurora ativa (3⚡), até a Sentinela recém-invocada ganha +1/+1, Ímpeto e Acerto Garantido!',
    hint2:
      '1º Instale o Talismã do Bem Supremo (5⚡) na Retaguarda [R] da Coluna 2 (atrás do Dragão de Ouro, dando +1⚔️ de Cobertura e invocando a Sentinela 3/4!). 2º Ative a Expansão de Domínio Cidadela da Aurora (⛩️ 3⚡): suas 3 criaturas (incluindo a Sentinela!) ganham +1/+1, Ímpeto e Acerto Garantido. 3º Ataque diretamente o Soberano rival para 17+ de dano!',
    solutionSteps: [
      '1. Posicione o Talismã do Bem Supremo (5⚡) na Retaguarda [R] da Coluna 2 (atrás do Dragão de Ouro): causa 4 de dano a um inimigo, invoca uma Sentinela 3/4 e concede +1⚔️ de Cobertura ao Dragão.',
      '2. Invoque a Expansão de Domínio Cidadela da Aurora (⛩️ 3⚡): todas as suas criaturas (incluindo a Sentinela recém-invocada) recebem +1/+1, Ímpeto e Acerto Garantido!',
      '3. Ataque diretamente o Soberano rival com todas as unidades para 17+ de dano letal!',
    ],
    whyIndefensible:
      'Colocar o Talismã em uma coluna sem atacante na Vanguarda perde o +1⚔️ de Cobertura.',
    turnNumber: 8,
    p1Name: 'Aurelius (Você)',
    p1AvatarCardId: 'gold_157_dragao_soberano_alvorada',
    p1Hp: 24,
    p1Essence: 8,
    p1MaxEssence: 8,
    p1Affinities: { red: 0, blue: 0, purple: 0, green: 0, gold: 6, neutral: 0 },
    p1HandCardIds: ['gold_72_talisma_bem'],
    p1DeckTopCardIds: ['gold_07_dragao_ouro'],
    p1ChanneledCardIds: [
      'gold_26_muralha_aco',
      'gold_07_dragao_ouro',
      'gold_72_talisma_bem',
      'gold_146_trono_imperador_eterno',
      'gold_154_colosso_marmore_sagrado',
      'gold_158_bencao_falange_invicta',
    ],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'gold_07_dragao_ouro', row: 'vanguard', slotIndex: 1 },
      { cardId: 'gold_154_colosso_marmore_sagrado', row: 'vanguard', slotIndex: 3 },
    ],
    p2Name: 'Senhor da Cripta',
    p2Title: 'Trono Umbral',
    p2AvatarCardId: 'purple_07_lich',
    p2Domain: 'purple',
    p2Hp: 17,
    p2Essence: 0,
    p2MaxEssence: 8,
    p2Affinities: { red: 0, blue: 0, purple: 5, green: 0, gold: 0, neutral: 0 },
    p2Units: [
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 1, hasDivineShield: true },
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 3, hasDivineShield: true },
    ],
  },
  {
    id: 'prob_28_fenix_ultimo_suspiro_dominio',
    number: 28,
    code: 'PROBLEMA #28',
    title: 'O Sacrifício da Fênix da Coroa Solar',
    subtitle: 'Atacar manualmente um inimigo letal com Magmin/Fênix para disparar Último Suspiro e liberar Invasão',
    difficulty: 'avancado',
    difficultyLabel: 'Grau III • Avançado',
    stars: 3,
    goldReward: 5,
    primaryDomain: 'red',
    mechanicTag: '🦅 Último Suspiro Tático + Invasão em Cadeia',
    scenarioLore:
      'Três inimigos de 1 ❤️ ocupam as Colunas 2, 3 e 4 (roubando +3⚔️ de Invasão dos seus três campeões!). Você tem um Diabrete de Escória (2/1, Último Suspiro: 1 de dano a toda a Vanguarda inimiga) na Coluna 1 de frente para um inimigo 2/2. O Soberano rival tem 17 ❤️.',
    objectiveText: 'Use o Último Suspiro do Diabrete na Coluna 1 para varrer os 3 inimigos de 1 ❤️ ANTES de atacar com seus campeões!',
    hint1:
      'Se você atacar com seus campeões primeiro, as Colunas 2, 3 e 4 ainda estarão ocupadas (sem bônus de +1⚔️ de Invasão!). Mas se o Diabrete de Escória morrer primeiro na Coluna 1, o Último Suspiro dele causa 1 de dano a toda a Vanguarda inimiga!',
    hint2:
      '1º Selecione o Diabrete de Escória na Coluna 1 e ataque o inimigo 2/2 à frente dele: o Diabrete morre no contra-ataque e seu Último Suspiro explode em 1 de dano, matando os 3 inimigos de 1 ❤️ nas Colunas 2, 3 e 4! 2º Lance o Óleo de Afiação Etérea (2⚡, +2/+2 a todos). 3º Agora com as 3 colunas vazias (+3⚔️ de Invasão!), ataque o Soberano rival com seus 3 campeões para 17+ de dano!',
    solutionSteps: [
      '1. Ataque o inimigo na Coluna 1 com o seu Diabrete de Escória (2/1): ao morrer em combate, o Último Suspiro dele causa 1 de dano a toda a Vanguarda inimiga, destruindo os 3 bloqueadores de 1 ❤️ nas Colunas 2, 3 e 4!',
      '2. Lance o Óleo de Afiação Etérea (2⚡): concede +2/+2 aos seus 3 campeões sobreviventes.',
      '3. Com as Colunas 2, 3 e 4 agora vazias (concedendo +1⚔️ de Invasão a cada um!), ataque o Soberano rival com os 3 campeões para 17+ de dano letal!',
    ],
    whyIndefensible:
      'Se você atacar com os campeões das Colunas 2, 3 e 4 antes de sacrificar o Diabrete na Coluna 1, perderá os +3⚔️ de Invasão.',
    turnNumber: 5,
    p1Name: 'Ignis Rex (Você)',
    p1AvatarCardId: 'red_04_meio_dragao',
    p1Hp: 20,
    p1Essence: 2,
    p1MaxEssence: 5,
    p1Affinities: { red: 3, blue: 0, purple: 0, green: 0, gold: 0, neutral: 1 },
    p1HandCardIds: ['neutral_145_oleo_afiacao_eterea'],
    p1DeckTopCardIds: ['red_01_kobold'],
    p1ChanneledCardIds: ['red_02_magmin', 'red_03_mastim_infernal', 'neutral_145_oleo_afiacao_eterea'],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'red_02_magmin', row: 'vanguard', slotIndex: 0 },
      { cardId: 'red_03_mastim_infernal', row: 'vanguard', slotIndex: 1 },
      { cardId: 'red_03_mastim_infernal', row: 'vanguard', slotIndex: 2 },
      { cardId: 'red_03_mastim_infernal', row: 'vanguard', slotIndex: 3 },
    ],
    p2Name: 'Mestre das Sombras',
    p2Title: 'Legião de Cinzas',
    p2AvatarCardId: 'purple_11_garra_rastejante',
    p2Domain: 'purple',
    p2Hp: 17,
    p2Essence: 0,
    p2MaxEssence: 5,
    p2Affinities: { red: 0, blue: 0, purple: 3, green: 0, gold: 0, neutral: 0 },
    p2Units: [
      { cardId: 'blue_11_anomalia_agua', row: 'vanguard', slotIndex: 0, damageTaken: 1 },
      { cardId: 'purple_11_garra_rastejante', row: 'vanguard', slotIndex: 1 },
      { cardId: 'purple_11_garra_rastejante', row: 'vanguard', slotIndex: 2 },
      { cardId: 'purple_11_garra_rastejante', row: 'vanguard', slotIndex: 3 },
    ],
  },
  {
    id: 'prob_29_conde_vampiro_ascensao_dominio',
    number: 29,
    code: 'PROBLEMA #29',
    title: 'O Despertar do Conde Vampiro (9/10 Atropelar)',
    subtitle: 'Gerar +1⚡ com Contrato de Sangue e Soldo para pagar Ascensão (4⚡) + Expansão de Domínio (3⚡)',
    difficulty: 'avancado',
    difficultyLabel: 'Grau III • Avançado',
    stars: 3,
    goldReward: 5,
    primaryDomain: 'purple',
    mechanicTag: '🦇 Ascensão Vampírica (4⚡) + Domínio (3⚡)',
    scenarioLore:
      'Seu Conde Vampiro (4/4) está na Vanguarda diante de três Muralhas com Escudo Divino. O Soberano rival tem 19 ❤️. Você tem 7⚡ de Essência, o Contrato de Sangue e Soldo (2⚡, compra 2 e gera +1⚡) e precisa tanto Ascender o Conde Vampiro (4⚡ → 9/10!) quanto expandir o Domínio!',
    objectiveText: 'Ascenda o Conde Vampiro para 9/10, expanda o Eclipse do Trono de Ossos e cause 19 de dano!',
    hint1:
      'Você já tem 7⚡ de Essência! A Ascensão do Conde Vampiro custa 4⚡ (transformando-o em Lorde Vampiro Soberano 9/10!) e a Expansão de Domínio custa 3⚡ (4 + 3 = 7⚡ exatos!). Cuidado com a armadilha: se você jogar o Contrato de Sangue e Soldo (custa 2⚡, devolve 1⚡), ficará com apenas 6⚡!',
    hint2:
      'NÃO jogue o Contrato de Sangue e Soldo (ele é uma isca que consome 1⚡ líquida!). Em vez disso: 1º Canalize o Contrato [C] ou Sacrifique outra carta se quiser +1⚡! 2º Clique no Conde Vampiro e ative "★ Ascender (4⚡)" (vai para 9/10!). 3º Ative a Expansão de Domínio (⛩️ 3⚡) e ataque com o Conde Ascendido + Dama das Seis Lâminas para 19+ de dano!',
    solutionSteps: [
      '1. Não caia na armadilha de lançar o Contrato de Sangue e Soldo (que custa 2⚡ e devolve apenas 1⚡)! Se quiser +1⚡ extra, Canalize [C] a 1ª carta da mão e Sacrifique [C] a 2ª carta.',
      '2. Clique no Conde Vampiro na Vanguarda [V] e ative "★ Ascender (4⚡)": ele desperta como Lorde Vampiro Soberano (9/10)!',
      '3. Com os 3⚡ restantes, ative a Expansão de Domínio Eclipse do Trono de Ossos (⛩️ 3⚡) e ataque diretamente o Soberano rival para 19+ de dano letal!',
    ],
    whyIndefensible:
      'Lançar o Contrato de Sangue e Soldo reduz sua Essência de 7⚡ para 6⚡, impedindo a combinação de Ascensão (4⚡) + Expansão de Domínio (3⚡).',
    turnNumber: 7,
    p1Name: 'Vesperion (Você)',
    p1AvatarCardId: 'purple_19_conde_vampiro',
    p1Hp: 20,
    p1Essence: 7,
    p1MaxEssence: 7,
    p1Affinities: { red: 0, blue: 0, purple: 6, green: 0, gold: 0, neutral: 0 },
    p1HandCardIds: ['neutral_149_contrato_companhia_dourada', 'purple_11_garra_rastejante'],
    p1DeckTopCardIds: ['purple_15_espectro', 'purple_07_lich'],
    p1ChanneledCardIds: [
      'purple_11_garra_rastejante',
      'purple_13_zumbi',
      'purple_15_espectro',
      'purple_17_banshee',
      'purple_19_conde_vampiro',
      'purple_25_dama_seis_laminas',
    ],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'purple_19_conde_vampiro', row: 'vanguard', slotIndex: 1 },
      { cardId: 'purple_25_dama_seis_laminas', row: 'vanguard', slotIndex: 3 },
      { cardId: 'purple_126_campanario_mortos', row: 'rearguard', slotIndex: 1 },
    ],
    p2Name: 'Bastião de Solária',
    p2Title: 'Guardião Solar',
    p2AvatarCardId: 'gold_26_muralha_aco',
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
    id: 'prob_30_confronto_5050_esmeralda_7v6',
    number: 30,
    code: 'PROBLEMA #30',
    title: 'Hegemonia da Selva (Desempate 7 vs 6 + Ruptura)',
    subtitle: 'Quebrar o Confronto 50/50 canalizando a 7ª Afinidade Verde antes do feitiço de +2/+2 em massa',
    difficulty: 'avancado',
    difficultyLabel: 'Grau III • Avançado',
    stars: 3,
    goldReward: 5,
    primaryDomain: 'green',
    mechanicTag: '🌿 Confronto 50/50 → 7 vs 6 + Buff Global',
    scenarioLore:
      'Sua Selva Primordial está travada num Confronto 50/50 (6 vs 6) contra o Maelstrom Astral inimigo, anulando seu Acerto Garantido diante de três Guardiões Glaciais. O Soberano rival tem 22 ❤️ e você tem apenas 2⚡ de Essência.',
    objectiveText: 'Desfaça o Confronto 50/50 (7 vs 6), lance Ruptura de Raízes (2⚡) e cause 22 de dano!',
    hint1:
      'Você tem duas cartas Verdes na mão: um Urso (3⚡) e o feitiço Ruptura de Raízes e Monólitos (2⚡, +2/+2 a todos os aliados). Qual delas deve ser Canalizada [C] para subir sua Afinidade a 7 vs 6?',
    hint2:
      '1º Canalize o Colosso de Geodo e Musgo [C] (sua Afinidade Verde sobe para 7 vs 6, estilhaçando o domínio azul rival e restaurando o Acerto Garantido!). 2º Lance a Ruptura de Raízes e Monólitos (2⚡): dá +2/+2 às suas 3 criaturas na Vanguarda! 3º Ataque diretamente o Soberano rival com Acerto Garantido para 22+ de dano!',
    solutionSteps: [
      '1. Selecione o Colosso de Geodo e Musgo na mão e clique em "⛰️ Canalizar [C]": sua Afinidade Verde sobe de 6 para 7 vs 6, estilhaçando o Domínio rival e reativando seu Acerto Garantido!',
      '2. Com seus 2⚡ de Essência, lance Ruptura de Raízes e Monólitos (+2/+2 a todos os aliados na Vanguarda).',
      '3. Ataque diretamente o Soberano rival com suas 3 feras para 22+ de dano letal!',
    ],
    whyIndefensible:
      'Se você Canalizar o feitiço de 2⚡ por engano, ficará com o Colosso de 3⚡ na mão (que não pode ser jogado com 2⚡!).',
    turnNumber: 7,
    p1Name: 'Sylvarion (Você)',
    p1AvatarCardId: 'green_161_dragao_esmeralda_primordial',
    p1Hp: 20,
    p1Essence: 2,
    p1MaxEssence: 7,
    p1Affinities: { red: 0, blue: 0, purple: 0, green: 6, gold: 0, neutral: 0 },
    p1HandCardIds: ['green_151_urso_couraca_musgo', 'green_162_furia_matilha_selvagem'],
    p1DeckTopCardIds: ['green_17_centauro'],
    p1ChanneledCardIds: [
      'green_17_centauro',
      'green_18_lobisomem',
      'green_20_tubarao_terrestre',
      'green_22_wyvern',
      'green_25_dragao_verde',
      'green_157_quimera_tres_presas',
    ],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'green_157_quimera_tres_presas', row: 'vanguard', slotIndex: 1 },
      { cardId: 'green_20_tubarao_terrestre', row: 'vanguard', slotIndex: 2 },
      { cardId: 'green_18_lobisomem', row: 'vanguard', slotIndex: 4 },
    ],
    p2Name: 'Hydrissa',
    p2Title: 'Mestra do Maelstrom',
    p2AvatarCardId: 'blue_154_dragao_safira_soberano',
    p2Domain: 'blue',
    p2Hp: 22,
    p2Essence: 0,
    p2MaxEssence: 7,
    p2Affinities: { red: 0, blue: 6, purple: 0, green: 0, gold: 0, neutral: 0 },
    p2Units: [
      { cardId: 'blue_19_yeti', row: 'vanguard', slotIndex: 1 },
      { cardId: 'blue_19_yeti', row: 'vanguard', slotIndex: 2 },
      { cardId: 'blue_19_yeti', row: 'vanguard', slotIndex: 4 },
    ],
    initialDomainState: {
      owner: 'ai',
      domain: 'blue',
      turnsRemaining: 3,
      damageTakenByOwnerThisRound: 0,
      clashRival: {
        owner: 'player',
        domain: 'green',
        turnsRemaining: 3,
      },
    },
  },

  // ============================================================================
  // GRAU IV — MESTRE (★★★★☆ • 10 PROBLEMAS • 7 🪙 OURO CADA)
  // ============================================================================
  {
    id: 'prob_31_pacto_sangue_limite',
    number: 31,
    code: 'PROBLEMA #31',
    title: 'Pacto de Sangue à Beira do Abismo',
    subtitle: 'Pagar 3 ❤️ no Pacto de Sangue (ficando com 1 ❤️!) para comprar a carta letal e ganhar +1⚡',
    difficulty: 'mestre',
    difficultyLabel: 'Grau IV • Mestre',
    stars: 4,
    goldReward: 7,
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
    id: 'prob_32_manobra_fileira_retaguarda',
    number: 32,
    code: 'PROBLEMA #32',
    title: 'A Dança das Fileiras (Manobra ⇄)',
    subtitle: 'Avançar uma criatura da Retaguarda para a Vanguarda [⇄] para habilitar o ataque e receber Cobertura',
    difficulty: 'mestre',
    difficultyLabel: 'Grau IV • Mestre',
    stars: 4,
    goldReward: 7,
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
    id: 'prob_33_quebra_dominio_sacrificio_terreno',
    number: 33,
    code: 'PROBLEMA #33',
    title: 'Ruptura de Sangue e Pedra (Tributo de 10❤️)',
    subtitle: 'Romper a Expansão de Domínio rival com o Sacrifício de 10❤️ para remover o +1/+1 da Muralha inimiga',
    difficulty: 'mestre',
    difficultyLabel: 'Grau IV • Mestre',
    stars: 4,
    goldReward: 7,
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
  {
    id: 'prob_34_manobra_recuo_arqueiro',
    number: 34,
    code: 'PROBLEMA #34',
    title: 'Troca de Guarda na Mesma Coluna',
    subtitle: 'Recuar um Arqueiro com Alcance da Vanguarda para a Retaguarda [⇄] para abrir a Vanguarda a um Colosso com Ímpeto',
    difficulty: 'mestre',
    difficultyLabel: 'Grau IV • Mestre',
    stars: 4,
    goldReward: 7,
    primaryDomain: 'green',
    mechanicTag: '⇄ Recuar Arqueiro [V → R] + Invocar [V]',
    scenarioLore:
      'Seu Centauro Arqueiro (Alcance) está ocupando a Vanguarda [V] da Coluna 2 (a única coluna livre de inimigos nas outras posições!). Você tem o Tiranossauro Soberano da Selva (6⚡, 6/6 Ímpeto) na mão e o Soberano rival tem 11 ❤️.',
    objectiveText: 'Use a Manobra de Fileira [⇄] para transformar 1 coluna livre em 2 ataques + Cobertura!',
    hint1:
      'O Centauro Arqueiro tem Alcance — ele pode atacar normalmente da Retaguarda [R]! E se ele recuar da Vanguarda [V] para a Retaguarda [R] com "⇄ Mover Fileira", ele libera o slot da Vanguarda [V] para o seu Tiranossauro E ainda concede +1⚔️ de Cobertura a ele!',
    hint2:
      '1º Clique no Centauro Arqueiro na Vanguarda [V] da Coluna 2 e use "⇄ Mover para Retaguarda". 2º Invoque o Tiranossauro Soberano da Selva (6⚡, Ímpeto) na Vanguarda [V] da Coluna 2 (ele ganha +1⚔️ Invasão e +1⚔️ Cobertura do Centauro = 8⚔️ ATQ!). 3º Ataque o Soberano rival com o Tiranossauro (8⚔️) e com o Centauro da Retaguarda (3⚔️) = 11 de dano cravado!',
    solutionSteps: [
      '1. Clique no Centauro Arqueiro na Vanguarda [V] (Coluna 2) e use "⇄ Mover Fileira" para recuá-lo à Retaguarda [R].',
      '2. Invoque o Tiranossauro Soberano da Selva (6⚡) na Vanguarda [V] da Coluna 2 (agora livre): recebe +1⚔️ de Invasão e +1⚔️ de Cobertura do Centauro (totalizando 8⚔️ ATQ).',
      '3. Ataque o Soberano rival com o Tiranossauro (8⚔️) e com o Centauro Arqueiro da Retaguarda (3⚔️, via Alcance) para 11 de dano exato!',
    ],
    whyIndefensible:
      'Se você invocar o Tiranossauro em outra coluna (sem Cobertura do Centauro), causará apenas 10 de dano e o rival sobreviverá com 1 ❤️.',
    turnNumber: 6,
    p1Name: 'Sylvarion (Você)',
    p1AvatarCardId: 'green_157_quimera_tres_presas',
    p1Hp: 22,
    p1Essence: 6,
    p1MaxEssence: 6,
    p1Affinities: { red: 0, blue: 0, purple: 0, green: 4, gold: 0, neutral: 0 },
    p1HandCardIds: ['green_157_quimera_tres_presas'],
    p1DeckTopCardIds: ['green_18_lobisomem'],
    p1ChanneledCardIds: ['green_17_centauro', 'green_18_lobisomem', 'green_157_quimera_tres_presas'],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'green_17_centauro', row: 'vanguard', slotIndex: 1 },
    ],
    p2Name: 'Senhor das Cinzas',
    p2Title: 'Forja Negra',
    p2AvatarCardId: 'red_04_meio_dragao',
    p2Domain: 'red',
    p2Hp: 11,
    p2Essence: 0,
    p2MaxEssence: 6,
    p2Affinities: { red: 4, blue: 0, purple: 0, green: 0, gold: 0, neutral: 0 },
    p2Units: [
      { cardId: 'red_02_magmin', row: 'vanguard', slotIndex: 0 },
      { cardId: 'red_02_magmin', row: 'vanguard', slotIndex: 2 },
      { cardId: 'red_02_magmin', row: 'vanguard', slotIndex: 3 },
      { cardId: 'red_02_magmin', row: 'vanguard', slotIndex: 4 },
      { cardId: 'red_02_magmin', row: 'vanguard', slotIndex: 5 },
    ],
  },
  {
    id: 'prob_35_nucleo_relojoeiro_cascata',
    number: 35,
    code: 'PROBLEMA #35',
    title: 'Engrenagens Perpétuas (Cascata de Reembolsos)',
    subtitle: 'Encadear Coração de Mola Perpétua (+1⚡) + Contrato (+1⚡) + Mercenário (+1⚡) para expandir o Domínio',
    difficulty: 'mestre',
    difficultyLabel: 'Grau IV • Mestre',
    stars: 4,
    goldReward: 7,
    primaryDomain: 'blue',
    mechanicTag: '⚙️ Cascata de Artefatos & +3⚡ Gerados',
    scenarioLore:
      'O Soberano rival tem 17 ❤️ protegido por duas Muralhas. Você tem apenas 5⚡ de Essência, mas precisa colocar o Mercenário Planar (2⚡) em campo E ativar a Expansão de Domínio (3⚡) E lançar a Poção de Fúria (1⚡) que está no topo do Grimório!',
    objectiveText: 'Faça a sequência exata do Mercenário Planar para comprar a Poção de Fúria e fechar 17 de dano!',
    hint1:
      'Se você ativar a Expansão de Domínio (3⚡) primeiro, sobrarão 2⚡ para o Mercenário Planar (2⚡ → devolve +1⚡ e compra a Poção de Fúria de 1⚡!).',
    hint2:
      '1º Invoque o Mercenário Planar (2⚡) na Vanguarda [V] da Coluna 3 (apoiado pela Relíquia na Retaguarda): ele devolve +1⚡ (você fica com 4⚡!) e compra a Poção de Fúria (1⚡)! 2º Invoque a Expansão de Domínio Olho do Maelstrom Astral (⛩️ 3⚡ → sobra 1⚡!). 3º Lance a Poção de Fúria (1⚡, +2/+2) e ataque diretamente o Soberano rival com todas as unidades para 17+ de dano!',
    solutionSteps: [
      '1. Invoque o Mercenário Planar (2⚡) na Vanguarda [V] da Coluna 3 (com suporte na Retaguarda): devolve +1⚡ (5⚡ - 2⚡ + 1⚡ = 4⚡) e compra a Poção de Fúria (1⚡).',
      '2. Ative a Expansão de Domínio Olho do Maelstrom Astral (⛩️ 3⚡): todas as unidades ganham +1/+1, Ímpeto e Acerto Garantido.',
      '3. Com o 1⚡ restante, lance a Poção de Fúria (+2/+2) e ataque diretamente o Soberano rival para 17+ de dano letal!',
    ],
    whyIndefensible:
      'Colocar o Mercenário em uma coluna sem Cobertura da Retaguarda deixa o Soberano rival com 1 ❤️.',
    turnNumber: 6,
    p1Name: 'Hydrissa (Você)',
    p1AvatarCardId: 'blue_152_arquimago_vortice',
    p1Hp: 20,
    p1Essence: 5,
    p1MaxEssence: 6,
    p1Affinities: { red: 0, blue: 6, purple: 0, green: 0, gold: 0, neutral: 1 },
    p1HandCardIds: ['neutral_52_mercenario_planar'],
    p1DeckTopCardIds: ['neutral_18_pocao_furia', 'blue_01_sentinela_ventos'],
    p1ChanneledCardIds: [
      'blue_01_sentinela_ventos',
      'blue_10_portal_runas',
      'blue_12_espreitador_eter',
      'blue_15_barao_recifes',
      'blue_152_arquimago_vortice',
      'blue_146_trono_inverno_eterno',
    ],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'blue_152_arquimago_vortice', row: 'vanguard', slotIndex: 1 },
      { cardId: 'blue_12_espreitador_eter', row: 'vanguard', slotIndex: 3 },
      { cardId: 'neutral_144_nucleo_relojoeiro_aeternus', row: 'rearguard', slotIndex: 2 },
    ],
    p2Name: 'Bastião Dourado',
    p2Title: 'Muralha Real',
    p2AvatarCardId: 'gold_26_muralha_aco',
    p2Domain: 'gold',
    p2Hp: 17,
    p2Essence: 0,
    p2MaxEssence: 6,
    p2Affinities: { red: 0, blue: 0, purple: 0, green: 0, gold: 5, neutral: 0 },
    p2Units: [
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 1, hasDivineShield: true },
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 3, hasDivineShield: true },
    ],
  },
  {
    id: 'prob_36_cura_tatica_para_tributo',
    number: 36,
    code: 'PROBLEMA #36',
    title: 'Cura Tática para o Tributo de 10❤️',
    subtitle: 'Curar o próprio Soberano ANTES de pagar o Tributo Anti-Domínio (10❤️) para sobreviver e vencer',
    difficulty: 'mestre',
    difficultyLabel: 'Grau IV • Mestre',
    stars: 4,
    goldReward: 7,
    primaryDomain: 'green',
    mechanicTag: '💚 Curar Soberano → Pagar Tributo de 10❤️',
    scenarioLore:
      'Seu Soberano está com apenas 6 ❤️ e suas duas feras têm 3 ❤️ cada! O Soberano rival (19 ❤️) está com a Expansão de Domínio dele ativa (+1/+1 na Guarda dele). Se você tentar pagar o Tributo Anti-Domínio (10❤️) agora, terá que sacrificar suas próprias feras atacantes!',
    objectiveText: 'Cure seu exército primeiro com Investida do Espírito Urso (4⚡) para poder pagar o Tributo de 10❤️ sem perder atacantes!',
    hint1:
      'O feitiço Investida do Espírito Urso (4⚡) concede +2/+2 a todos os seus aliados E cura 4 ❤️ do seu Soberano (subindo de 6 ❤️ para 10 ❤️!).',
    hint2:
      '1º Lance a Investida do Espírito Urso (4⚡): seu Soberano sobe para 10 ❤️ e suas feras ganham +2/+2! 2º Agora clique em "💥 Quebrar Domínio (10❤️)" na barra inferior: você sobrevive e estilhaça o Domínio rival, removendo o +1/+1 da Guarda inimiga (que cai para 1 ❤️)! 3º Ataque com o Verme Púrpura (Sopro 2 elimina a Guarda de 1 ❤️!) e com o Lobisomem para 19+ de dano!',
    solutionSteps: [
      '1. Lance o feitiço Investida do Espírito Urso (4⚡): concede +2/+2 às suas unidades e restaura 4 ❤️ do seu Soberano (6 ❤️ → 10 ❤️).',
      '2. Agora com vida suficiente para manter suas feras vivas, clique em "💥 Quebrar Domínio (10❤️)" na barra inferior: a Expansão de Domínio rival é estilhaçada e a Guarda inimiga cai para 1 ❤️!',
      '3. Ataque na Coluna 2 com o Verme Púrpura (o Sopro 2 varre a Guarda de 1 ❤️ antes do impacto!) e finalize o Soberano rival com 19+ de dano!',
    ],
    whyIndefensible:
      'Tentar quebrar o Domínio rival antes de lançar a Investida do Espírito Urso mata suas próprias unidades no tributo de 10❤️.',
    turnNumber: 7,
    p1Name: 'Sylvarion (Você)',
    p1AvatarCardId: 'green_24_verme_purpura',
    p1Hp: 6,
    p1Essence: 4,
    p1MaxEssence: 7,
    p1Affinities: { red: 0, blue: 0, purple: 0, green: 5, gold: 0, neutral: 0 },
    p1HandCardIds: ['green_163_despertar_colosso_floresta'],
    p1DeckTopCardIds: ['green_18_lobisomem'],
    p1ChanneledCardIds: ['green_18_lobisomem', 'green_24_verme_purpura', 'green_163_despertar_colosso_floresta'],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'green_24_verme_purpura', row: 'vanguard', slotIndex: 1, damageTaken: 7 },
      { cardId: 'green_18_lobisomem', row: 'vanguard', slotIndex: 3, damageTaken: 2 },
    ],
    p2Name: 'Arquilich do Eclipse',
    p2Title: 'Trono de Ossos',
    p2AvatarCardId: 'purple_156_lich_coroa_entropia',
    p2Domain: 'purple',
    p2Hp: 19,
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
    id: 'prob_37_renascer_mumia_ultimo_suspiro',
    number: 37,
    code: 'PROBLEMA #37',
    title: 'A Maldição da Múmia (Toque Letal + Renascer)',
    subtitle: 'Trocar uma Múmia com Toque Letal e Renascer no Guardião colossal e depois expandir o Domínio',
    difficulty: 'mestre',
    difficultyLabel: 'Grau IV • Mestre',
    stars: 4,
    goldReward: 7,
    primaryDomain: 'purple',
    mechanicTag: '🧟 Renascer + Expansão concedendo Ímpeto',
    scenarioLore:
      'Você tem 5/6 de Afinidade Roxa, mas a única carta na sua mão é de Domínio Neutro (Óleo de Afiação Etérea 2⚡), então você NÃO pode chegar a 6/6 de Afinidade para ignorar o Guardião de 8 ❤️ na Coluna 2! Porém, sua Múmia Real na Coluna 1 tem Toque Letal e Renascer!',
    objectiveText: 'Elimine o Guardião de 8 ❤️ com a Múmia Real, potencialize a mesa com Óleo Etéreo e vença!',
    hint1:
      'O timing do buff é tudo! Se você lançar o Óleo de Afiação Etérea (+2/+2) ANTES da Múmia morrer e Renascer, ou DEPOIS? Lembre-se que a Múmia já atacou depois que renasce, então o importante é limpar o Guardião na Coluna 2 para liberar +1⚔️ de Invasão para a Dama das Seis Lâminas!',
    hint2:
      '1º Ataque o Guardião inimigo na Coluna 2 com a sua Múmia Real (Toque Letal mata o Guardião de 8 ❤️ na hora e libera a Coluna 2!). 2º Lance o Óleo de Afiação Etérea (2⚡, +2/+2 a todos) e ative o Poder do Soberano (2⚡)! 3º Ataque o Soberano rival com a Dama das Seis Lâminas e o Lich para 16+ de dano letal!',
    solutionSteps: [
      '1. Selecione a Múmia Real e ataque o Guardião colossal na Coluna 2: o Toque Letal destrói o Guardião instantaneamente (e a Múmia retorna à vida com 1 ❤️ graças a Renascer!).',
      '2. Lance o Óleo de Afiação Etérea (2⚡): concede +2/+2 a todos os seus aliados.',
      '3. Com a Coluna 2 agora livre (+1⚔️ de Invasão!), ataque o Soberano rival com a Dama das Seis Lâminas e o Lich para zerar os 15 ❤️!',
    ],
    whyIndefensible:
      'Atacar o Guardião com a Dama das Seis Lâminas ou o Lich desperdiça seus maiores atacantes no tanque inimigo.',
    turnNumber: 6,
    p1Name: 'Vesperion (Você)',
    p1AvatarCardId: 'purple_07_lich',
    p1Hp: 20,
    p1Essence: 2,
    p1MaxEssence: 6,
    p1Affinities: { red: 0, blue: 0, purple: 5, green: 0, gold: 0, neutral: 1 },
    p1HandCardIds: ['neutral_145_oleo_afiacao_eterea'],
    p1DeckTopCardIds: ['purple_15_espectro'],
    p1ChanneledCardIds: ['purple_18_mumia', 'purple_25_dama_seis_laminas', 'purple_07_lich'],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'purple_18_mumia', row: 'vanguard', slotIndex: 0 },
      { cardId: 'purple_25_dama_seis_laminas', row: 'vanguard', slotIndex: 1 },
      { cardId: 'purple_07_lich', row: 'vanguard', slotIndex: 3 },
      { cardId: 'purple_126_campanario_mortos', row: 'rearguard', slotIndex: 1 },
    ],
    p2Name: 'Soberano das Nuvens',
    p2Title: 'Guardião Celeste',
    p2AvatarCardId: 'blue_05_gigante_nuvens',
    p2Domain: 'blue',
    p2Hp: 15,
    p2Essence: 0,
    p2MaxEssence: 6,
    p2Affinities: { red: 0, blue: 5, purple: 0, green: 0, gold: 0, neutral: 0 },
    p2Units: [
      { cardId: 'blue_05_gigante_nuvens', row: 'vanguard', slotIndex: 1 },
    ],
  },
  {
    id: 'prob_38_banquete_parasitario_pacto',
    number: 38,
    code: 'PROBLEMA #38',
    title: 'Banquete Parasitário (Cura para Pacto de Sangue)',
    subtitle: 'Com apenas 2 ❤️ (impedido de usar Pacto de Sangue!), drenar 3 ❤️ primeiro para habilitar o Pacto (+1⚡)',
    difficulty: 'mestre',
    difficultyLabel: 'Grau IV • Mestre',
    stars: 4,
    goldReward: 7,
    primaryDomain: 'purple',
    mechanicTag: '🩸 Drenar 3❤️ → Habilita Pacto de Sangue (+1⚡)',
    scenarioLore:
      'Seu Soberano está com apenas 2 ❤️! Como o Pacto de Sangue exige sacrificar 3 ❤️ (e você não pode se matar), o botão do Pacto está bloqueado! Porém, você tem 5⚡ e precisa de 3⚡ para o Banquete Parasitário + 3⚡ para a Expansão de Domínio (totalizando 6⚡)!',
    objectiveText: 'Suba sua vida de 2 ❤️ para 5 ❤️ com o Banquete Parasitário para destravar o Pacto de Sangue (+1⚡) e expandir o Domínio!',
    hint1:
      'O Banquete Parasitário (3⚡) drena 3 ❤️ do Soberano rival e cura 3 ❤️ do seu Soberano (levando você de 2 ❤️ para 5 ❤️ e reduzindo o rival de 18 ❤️ para 15 ❤️!). Com 5 ❤️, você já pode pagar 3 ❤️ no Pacto de Sangue!',
    hint2:
      '1º Lance o Banquete Parasitário (3⚡ dos seus 5⚡ → sobram 2⚡; sua Vida sobe de 2 ❤️ para 5 ❤️ e o rival cai para 15 ❤️!). 2º Agora clique em "🩸 Pacto (+1⚡)" na barra inferior (você cai de 5 ❤️ para 2 ❤️ e sua Essência sobe de 2⚡ para 3⚡!). 3º Invoque a Expansão de Domínio Eclipse do Trono de Ossos (⛩️ 3⚡) e ataque com toda a Vanguarda para zerar os 15 ❤️!',
    solutionSteps: [
      '1. Lance o feitiço Banquete Parasitário (3⚡): drena 3 ❤️ do Soberano rival (18 ❤️ → 15 ❤️) e cura 3 ❤️ do seu Soberano (2 ❤️ → 5 ❤️).',
      '2. Agora que você tem 5 ❤️ (> 3 ❤️), o ritual "🩸 Pacto (+1⚡)" é desbloqueado! Ative-o para subir de 2⚡ para 3⚡.',
      '3. Com os 3⚡, invoque a Expansão de Domínio Eclipse do Trono de Ossos (⛩️ 3⚡) e ataque diretamente o Soberano rival para 15+ de dano letal!',
    ],
    whyIndefensible:
      'Tentando usar o Pacto de Sangue no início do turno você é bloqueado por ter apenas 2 ❤️; tentando expandir o Domínio primeiro você fica com apenas 2⚡ e não consegue lançar o Banquete Parasitário.',
    turnNumber: 7,
    p1Name: 'Vesperion (Você)',
    p1AvatarCardId: 'purple_156_lich_coroa_entropia',
    p1Hp: 2,
    p1Essence: 5,
    p1MaxEssence: 6,
    p1Affinities: { red: 0, blue: 0, purple: 6, green: 0, gold: 0, neutral: 0 },
    p1HandCardIds: ['purple_159_banquete_parasitario'],
    p1DeckTopCardIds: ['purple_11_garra_rastejante'],
    p1ChanneledCardIds: [
      'purple_07_lich',
      'purple_15_espectro',
      'purple_17_banshee',
      'purple_25_dama_seis_laminas',
      'purple_126_campanario_mortos',
      'purple_159_banquete_parasitario',
    ],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'purple_25_dama_seis_laminas', row: 'vanguard', slotIndex: 1 },
      { cardId: 'purple_07_lich', row: 'vanguard', slotIndex: 3 },
      { cardId: 'purple_126_campanario_mortos', row: 'rearguard', slotIndex: 1 },
    ],
    p2Name: 'Aurelius',
    p2Title: 'Guardião Solar',
    p2AvatarCardId: 'gold_157_dragao_soberano_alvorada',
    p2Domain: 'gold',
    p2Hp: 18,
    p2Essence: 0,
    p2MaxEssence: 6,
    p2Affinities: { red: 0, blue: 0, purple: 0, green: 0, gold: 5, neutral: 0 },
    p2Units: [
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 1, hasDivineShield: true },
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 3, hasDivineShield: true },
    ],
  },
  {
    id: 'prob_39_mobilizacao_cinco_selos_dominio',
    number: 39,
    code: 'PROBLEMA #39',
    title: 'A Mobilização da Torre dos Cinco Selos',
    subtitle: 'Invocar Guarda 3/3 + Buff Global ANTES da Expansão de Domínio para que o token receba Ímpeto e +1/+1',
    difficulty: 'mestre',
    difficultyLabel: 'Grau IV • Mestre',
    stars: 4,
    goldReward: 7,
    primaryDomain: 'gold',
    mechanicTag: '🏰 Token 3/3 + Buff Global + Domínio',
    scenarioLore:
      'O Soberano rival tem 20 ❤️ protegido por três Muralhas. Você tem 6⚡ de Essência, 5/6 de Afinidade Solar e três cartas na mão: Mobilização da Torre dos Cinco Selos (4⚡) e duas cartas Douradas.',
    objectiveText: 'Suba para 6/6 de Afinidade, gere o 7º ponto de Essência e faça o token 3/3 atacar neste turno!',
    hint1:
      'Você precisa de 4⚡ (Mobilização da Torre) + 3⚡ (Expansão de Domínio) = 7⚡, e precisa de +1 Afinidade Dourada (5/6 → 6/6). Use Canalizar [C] na 1ª carta Dourada e Sacrificar/Queimar [C] na 2ª carta!',
    hint2:
      '1º Canalize o Paladino [C] (Afinidade Solar vai a 6/6 e compra 1 carta). 2º Sacrifique/Queime outra carta secundária [C] (+1⚡ → sobe de 6⚡ para 7⚡!). 3º Lance a Mobilização da Torre dos Cinco Selos (4⚡: invoca um Campeão 3/3 e dá +1/+1 a todos!). 4º Ative a Expansão de Domínio Cidadela da Aurora (⛩️ 3⚡: dá +1/+1, Ímpeto e Acerto Garantido a todos, inclusive ao Campeão 3/3!) e ataque para 20+ de dano!',
    solutionSteps: [
      '1. Canalize [C] uma carta Dourada secundária da mão (Afinidade Solar sobe de 5 para 6/6).',
      '2. Sacrifique/Queime [C] uma segunda carta secundária da mão para ganhar +1⚡ (6⚡ → 7⚡).',
      '3. Lance a Mobilização da Torre dos Cinco Selos (4⚡): invoca um Campeão 3/3 na Vanguarda e concede +1/+1 a todos os aliados.',
      '4. Com os 3⚡ restantes, invoque a Cidadela da Aurora (⛩️ 3⚡) — dando +1/+1, Ímpeto e Acerto Garantido inclusive ao Campeão recém-invocado — e ataque o Soberano rival para 20+ de dano!',
    ],
    whyIndefensible:
      'Sem Canalizar + Queimar, você não alcança 6/6 de Afinidade e 7⚡ no mesmo turno.',
    turnNumber: 7,
    p1Name: 'Aurelius (Você)',
    p1AvatarCardId: 'gold_157_dragao_soberano_alvorada',
    p1Hp: 22,
    p1Essence: 6,
    p1MaxEssence: 6,
    p1Affinities: { red: 0, blue: 0, purple: 0, green: 0, gold: 5, neutral: 1 },
    p1HandCardIds: [
      'neutral_155_chamado_armas_fronteira',
      'gold_147_escudeiro_alvorada_real',
      'gold_148_clerigo_chama_sagrada',
    ],
    p1DeckTopCardIds: ['gold_07_dragao_ouro'],
    p1ChanneledCardIds: [
      'gold_26_muralha_aco',
      'gold_07_dragao_ouro',
      'gold_147_escudeiro_alvorada_real',
      'gold_154_colosso_marmore_sagrado',
      'gold_158_bencao_falange_invicta',
    ],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'gold_07_dragao_ouro', row: 'vanguard', slotIndex: 1 },
      { cardId: 'gold_154_colosso_marmore_sagrado', row: 'vanguard', slotIndex: 3 },
      { cardId: 'gold_163_estandarte_legiao_dourada', row: 'rearguard', slotIndex: 1 },
    ],
    p2Name: 'Tirano Rubro',
    p2Title: 'Senhor da Fornalha',
    p2AvatarCardId: 'red_157_dragao_tiamat_carmesim',
    p2Domain: 'red',
    p2Hp: 20,
    p2Essence: 0,
    p2MaxEssence: 6,
    p2Affinities: { red: 5, blue: 0, purple: 0, green: 0, gold: 0, neutral: 0 },
    p2Units: [
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 1, hasDivineShield: true },
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 2, hasDivineShield: true },
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 3, hasDivineShield: true },
    ],
  },
  {
    id: 'prob_40_espelho_almas_dupla_remocao',
    number: 40,
    code: 'PROBLEMA #40',
    title: 'O Espelho de Aprisionar Almas',
    subtitle: 'Remover o Guardião com a Relíquia Espelho na Retaguarda [R] e avançar o atacante com Manobra [⇄]',
    difficulty: 'mestre',
    difficultyLabel: 'Grau IV • Mestre',
    stars: 4,
    goldReward: 7,
    primaryDomain: 'blue',
    mechanicTag: '🪞 Relíquia Bounce [R] + Manobra [⇄]',
    scenarioLore:
      'Seu Serpe Trovejante (6⚔️, Sopro 2) está na Retaguarda [R] da Coluna 2 (impedido de atacar!) e um Guardião com Escudo Divino bloqueia a Coluna 2 inimiga. O Soberano rival tem 14 ❤️ e você tem o Espelho de Aprisionar Almas (4⚡, Relíquia: Congela e Devolve 1 inimigo para a mão) na mão.',
    objectiveText: 'Avance o Serpe Trovejante [⇄], instale o Espelho atrás dele para remover o Guardião e cause 14 de dano!',
    hint1:
      'Se você instalar o Espelho de Aprisionar Almas na Retaguarda [R] da Coluna 2 ANTES de mover o Serpe Trovejante para a Vanguarda [V], a Coluna 2 da Retaguarda já está ocupada pelo Serpe! Portanto, mova o Serpe para a Vanguarda [V] primeiro!',
    hint2:
      '1º Clique no Serpe Trovejante na Retaguarda [R] da Coluna 2 e use "⇄ Mover para Vanguarda". 2º Instale o Espelho de Aprisionar Almas (4⚡) na Retaguarda [R] da Coluna 2 (agora vazia!): ele devolve o Guardião inimigo para a mão do oponente (liberando +1⚔️ Invasão!) e dá +1⚔️ de Cobertura ao Serpe! 3º Ataque com o Serpe Trovejante (8⚔️) e o Barão das Marés (6⚔️) = 14 de dano!',
    solutionSteps: [
      '1. Clique no Serpe Trovejante na Retaguarda [R] (Coluna 2) e use "⇄ Mover Fileira" para avançá-lo à Vanguarda [V].',
      '2. Instale o Espelho de Aprisionar Almas (4⚡) na Retaguarda [R] da Coluna 2 (atrás do Serpe): devolve o Guardião inimigo para a mão do oponente e concede +1⚔️ de Cobertura ao Serpe!',
      '3. Com a Coluna 2 livre (+1⚔️ Invasão), ataque o Soberano rival com o Serpe Trovejante (8⚔️) e o Barão das Marés (6⚔️) para 14 de dano cravado!',
    ],
    whyIndefensible:
      'Instalar o Espelho em outra coluna sem antes avançar o Serpe Trovejante da Coluna 2 perde o bônus de Cobertura (+1⚔️).',
    turnNumber: 6,
    p1Name: 'Hydrissa (Você)',
    p1AvatarCardId: 'blue_04_behir',
    p1Hp: 22,
    p1Essence: 4,
    p1MaxEssence: 6,
    p1Affinities: { red: 0, blue: 4, purple: 0, green: 0, gold: 0, neutral: 1 },
    p1HandCardIds: ['neutral_143_espelho_aprisionar_almas'],
    p1DeckTopCardIds: ['blue_01_sentinela_ventos'],
    p1ChanneledCardIds: ['blue_04_behir', 'blue_15_barao_recifes', 'neutral_143_espelho_aprisionar_almas'],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'blue_04_behir', row: 'rearguard', slotIndex: 1 },
      { cardId: 'blue_15_barao_recifes', row: 'vanguard', slotIndex: 3 },
    ],
    p2Name: 'Templário da Muralha',
    p2Title: 'Escudo Sagrado',
    p2AvatarCardId: 'gold_26_muralha_aco',
    p2Domain: 'gold',
    p2Hp: 14,
    p2Essence: 0,
    p2MaxEssence: 6,
    p2Affinities: { red: 0, blue: 0, purple: 0, green: 0, gold: 4, neutral: 0 },
    p2Units: [
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 1, hasDivineShield: true },
    ],
  },

  // ============================================================================
  // GRAU V — GRÃO-MESTRE SOBERANO (★★★★★ • 10 PROBLEMAS • 10 🪙 OURO CADA)
  // ============================================================================
  {
    id: 'prob_41_paradoxo_cronos_5passos',
    number: 41,
    code: 'PROBLEMA #41',
    title: 'O Paradoxo de Cronos (5 Ações Encadeadas)',
    subtitle: 'Canalizar 7ª Afinidade + Ruptura Astral (+2⚡) + Dragão de Safira Sônico (7⚡)',
    difficulty: 'grao_mestre',
    difficultyLabel: 'Grau V • Grão-Mestre Soberano',
    stars: 5,
    goldReward: 10,
    primaryDomain: 'blue',
    mechanicTag: '👑 5 Passos: 7v6 + Feitiço (+2⚡) + Lendária',
    scenarioLore:
      'A mesa está em Confronto de Domínios 50/50 (6 vs 6). O Soberano rival tem 21 ❤️ e três Muralhas com Escudo Divino. Você começa com apenas 8⚡, mas precisa jogar a Ruptura do Relógio Astral (3⚡) E o Dragão de Safira Sônico (7⚡) — além de vencer o Confronto 50/50!',
    objectiveText: 'Execute a sequência perfeita para romper o Confronto 50/50, gerar a mana que falta e causar 21 de dano!',
    hint1:
      'Você tem 8⚡ e precisa de 10⚡ totais (3⚡ da Ruptura + 7⚡ do Dragão de Safira). A Ruptura do Relógio Astral devolve +2⚡ (líquido -1⚡ → sobra 7⚡!), e você ainda precisa Canalizar uma carta Azul para vencer o Confronto 50/50 (7 vs 6)!',
    hint2:
      '1º Canalize o Trono do Inverno Eterno [C] (sua Afinidade Azul sobe para 7 vs 6, estilhaçando o domínio rival e reativando seu Acerto Garantido!). 2º Lance a Ruptura do Relógio Astral (gasta 3⚡, devolve +2⚡ → você fica com 7⚡!). 3º Invoque o Dragão de Safira Sônico na Vanguarda [V] (7⚡, causa 2 de dano a todos ao entrar: 21 ❤️ → 19 ❤️!). 4º Ataque diretamente o Soberano rival com toda a Vanguarda para 21+ de dano!',
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
    id: 'prob_42_coroa_entropia_suprema',
    number: 42,
    code: 'PROBLEMA #42',
    title: 'Xeque-Mate da Coroa da Entropia',
    subtitle: 'Canalizar + Queimar + Pacto de Sangue para expandir o Domínio E invocar o Lich de 8⚡ no mesmo turno',
    difficulty: 'grao_mestre',
    difficultyLabel: 'Grau V • Grão-Mestre Soberano',
    stars: 5,
    goldReward: 10,
    primaryDomain: 'purple',
    mechanicTag: '👑 Alquimia Tripla de Mana (9⚡ → 11⚡)',
    scenarioLore:
      'O Soberano rival tem 27 ❤️ e três Guardiões com Escudo Divino. Para causar 27 de dano neste turno, você precisa TANTO expandir o Eclipse do Trono de Ossos (3⚡) QUANTO invocar o Lich da Coroa da Entropia (8⚡) — o que exige 11⚡, mas você tem apenas 9⚡ e 5/6 de Afinidade!',
    objectiveText: 'Suba de 5/6 para 6/6 de Afinidade e de 9⚡ para 11⚡ no mesmo turno para causar 27 de dano letal!',
    hint1:
      'Para sair de 9⚡ e chegar a 11⚡ enquanto ganha +1 de Afinidade: 1) Canalize 1 carta Roxa (+1 Afinidade → 6/6 e compra 1 carta); 2) Sacrifique/Queime outra carta (+1⚡ → 10⚡); 3) Use o Pacto de Sangue (-3 ❤️, +1⚡ → 11⚡)!',
    hint2:
      '1º Canalize Exumar Legião [C] (Afinidade vai para 6/6). 2º Sacrifique/Queime Eclipse Abissal [C] (+1⚡ → 10⚡). 3º Ative "🩸 Pacto (+1⚡)" (+1⚡ → 11⚡). 4º Invoque a Expansão de Domínio Eclipse do Trono de Ossos (3⚡ → sobram 8⚡). 5º Invoque o Lich da Coroa da Entropia na Vanguarda [V] (8⚡: drena 3 ❤️ do rival e dá +2/+2 a todos!). 6º Ataque diretamente o Soberano rival para 27+ de dano!',
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
    id: 'prob_43_sinfonia_esmeralda_6passos',
    number: 43,
    code: 'PROBLEMA #43',
    title: 'O Rugido de Terrakhor (Manobra + Pedra + Monarca)',
    subtitle: 'Avançar da Retaguarda [⇄] + Pedra Filosofal (+2⚡) + Pacto (+1⚡) + Terrakhor (+2/+2 Global)',
    difficulty: 'grao_mestre',
    difficultyLabel: 'Grau V • Grão-Mestre Soberano',
    stars: 5,
    goldReward: 10,
    primaryDomain: 'green',
    mechanicTag: '👑 6 Passos: [⇄] + Pedra (+2⚡) + Pacto + Titã',
    scenarioLore:
      'Seu Verme Púrpura (10⚔️) começou na Retaguarda [R] da Coluna 2! O Soberano rival tem 28 ❤️. Você tem 8⚡ de Essência, a Pedra Filosofal (5⚡ → +2⚡) e Terrakhor, Monarca da Rocha Eterna (7⚡, Ao Entrar: +2/+2 a todos os aliados) na mão!',
    objectiveText: 'Avance o Verme Púrpura [⇄], instale a Pedra Filosofal atrás dele, gere 7⚡ para Terrakhor e cause 28 de dano!',
    hint1:
      'A Pedra Filosofal custa 5⚡ e devolve +2⚡ (8⚡ - 5⚡ + 2⚡ = 5⚡). Para chegar aos 7⚡ que Terrakhor exige, faltam +2⚡: 1⚡ vem de Canalizar + Sacrificar cartas da mão, e 1⚡ vem do Pacto de Sangue!',
    hint2:
      '1º Clique no Verme Púrpura na Retaguarda [R] (Coluna 2) e use "⇄ Mover para Vanguarda". 2º Instale a Pedra Filosofal (5⚡) na Retaguarda [R] da Coluna 2 (devolve +2⚡ → fica com 5⚡ e dá +1⚔️ Cobertura ao Verme!). 3º Canalize 1 carta secundária [C] e Sacrifique outra [C] (+1⚡ → 6⚡). 4º Ative "🩸 Pacto (+1⚡)" (+1⚡ → 7⚡!). 5º Invoque Terrakhor (7⚡, +2/+2 a todos!) na Retaguarda [R] da Coluna 4 (dando +1⚔️ Cobertura ao Tiranossauro!) e ataque para 28+ de dano!',
    solutionSteps: [
      '1. Avance o Verme Púrpura da Retaguarda [R] para a Vanguarda [V] na Coluna 2 com "⇄ Mover Fileira".',
      '2. Instale a Pedra Filosofal (5⚡) na Retaguarda [R] da Coluna 2 (gera +2⚡ e concede +1⚔️ de Cobertura ao Verme).',
      '3. Canalize [C] a 1ª carta secundária e Sacrifique [C] a 2ª carta (+1⚡ → 6⚡), e ative "🩸 Pacto (+1⚡)" (+1⚡ → 7⚡).',
      '4. Invoque Terrakhor, Monarca da Rocha Eterna (7⚡) na Retaguarda [R] da Coluna 4 (concede +2/+2 a todos os aliados e +1⚔️ de Cobertura ao Tiranossauro!).',
      '5. Ataque o Soberano rival com toda a Vanguarda para 28+ de dano letal!',
    ],
    whyIndefensible:
      'Esquecer de mover o Verme Púrpura antes de instalar a Pedra Filosofal ou colocar Terrakhor na Vanguarda (perdendo +1⚔️ de Cobertura) impede o letal.',
    turnNumber: 8,
    p1Name: 'Sylvarion (Você)',
    p1AvatarCardId: 'green_160_behemoth_cratera_viva',
    p1Hp: 16,
    p1Essence: 8,
    p1MaxEssence: 8,
    p1Affinities: { red: 0, blue: 0, purple: 0, green: 5, gold: 0, neutral: 1 },
    p1HandCardIds: [
      'neutral_17_pedra_filosofal',
      'green_160_behemoth_cratera_viva',
      'green_147_batedor_folha_viva',
      'green_148_lobo_espinho_venenoso',
    ],
    p1DeckTopCardIds: ['green_18_lobisomem'],
    p1ChanneledCardIds: [
      'green_18_lobisomem',
      'green_24_verme_purpura',
      'green_157_quimera_tres_presas',
      'green_160_behemoth_cratera_viva',
      'neutral_17_pedra_filosofal',
    ],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'green_24_verme_purpura', row: 'rearguard', slotIndex: 1 },
      { cardId: 'green_157_quimera_tres_presas', row: 'vanguard', slotIndex: 3 },
      { cardId: 'green_18_lobisomem', row: 'vanguard', slotIndex: 4 },
    ],
    p2Name: 'Monarca Abissal',
    p2Title: 'Trono da Noite',
    p2AvatarCardId: 'purple_07_lich',
    p2Domain: 'purple',
    p2Hp: 28,
    p2Essence: 0,
    p2MaxEssence: 8,
    p2Affinities: { red: 0, blue: 0, purple: 5, green: 0, gold: 0, neutral: 0 },
    p2Units: [],
  },
  {
    id: 'prob_44_julgamento_aurelius_supremo',
    number: 44,
    code: 'PROBLEMA #44',
    title: 'A Coroação de Solária (Confronto 7v6 + Trono + Falange)',
    subtitle: 'Vencer Confronto 50/50 (7v6) + Queimar Carta (+1⚡) + Pacto (+1⚡) para jogar Trono Imperial (5⚡) + Baluarte (2⚡)',
    difficulty: 'grao_mestre',
    difficultyLabel: 'Grau V • Grão-Mestre Soberano',
    stars: 5,
    goldReward: 10,
    primaryDomain: 'gold',
    mechanicTag: '👑 7v6 + Alquimia de Mana + Duplo Buff Global',
    scenarioLore:
      'Sua Cidadela da Aurora está travada num Confronto de Domínios 50/50 (6 vs 6) contra a Caldeira Rubra inimiga! O Soberano rival tem 23 ❤️ protegido por três Guardiões. Você tem 5⚡ de Essência, mas precisa jogar o Trono Supremo do Imperador Eterno (5⚡) E o Baluarte dos Escudos de Luz (2⚡) — além de subir sua Afinidade Dourada para 7 vs 6!',
    objectiveText: 'Suba para 7 vs 6 de Afinidade, transforme 5⚡ em 7⚡ e lance Trono Imperial + Baluarte para 23 de dano!',
    hint1:
      'Você tem 3 cartas Douradas na mão: o Trono (5⚡), o Baluarte (2⚡) e o Paladino (1⚡), e o topo do seu Grimório tem outra carta Dourada! Quando você Canalizar [C] o Paladino, sua Afinidade vai a 7 vs 6 E você compra a carta do topo — que pode então ser Sacrificada/Queimada [C] por +1⚡!',
    hint2:
      '1º Canalize o Paladino do Brasão Solar [C] (sua Afinidade Dourada sobe para 7 vs 6, estilhaçando o domínio rubro rival, e você compra 1 carta!). 2º Sacrifique/Queime a carta recém-comprada [C] (+1⚡ → 6⚡). 3º Ative "🩸 Pacto (+1⚡)" (+1⚡ → 7⚡). 4º Instale o Trono Supremo do Imperador Eterno (5⚡) na Retaguarda [R] da Coluna 2 (+1/+2 global + Cobertura). 5º Lance o Baluarte dos Escudos de Luz (2⚡, +1⚔️ global) e ataque com toda a Vanguarda para 23+ de dano!',
    solutionSteps: [
      '1. Canalize [C] o Paladino do Brasão Solar: sua Afinidade Dourada sobe para 7 vs 6 (estilhaçando o Domínio rival e reativando seu Acerto Garantido) e você compra 1 carta do topo.',
      '2. Sacrifique/Queime [C] a carta que acabou de comprar para ganhar +1⚡ (5⚡ → 6⚡).',
      '3. Ative "🩸 Pacto (+1⚡)" na barra inferior para subir de 6⚡ para 7⚡.',
      '4. Instale o Trono Supremo do Imperador Eterno (5⚡) na Retaguarda [R] atrás de um atacante (+1/+2 a todos e +1⚔️ Cobertura) e lance o Baluarte dos Escudos de Luz (2⚡, +1⚔️ a todos).',
      '5. Ataque diretamente o Soberano rival com suas 3 criaturas para 23+ de dano letal!',
    ],
    whyIndefensible:
      'O jogador precisa perceber que o ato de Canalizar a 1ª carta compra a 2ª carta necessária para ser Queimada por +1⚡.',
    turnNumber: 8,
    p1Name: 'Aurelius (Você)',
    p1AvatarCardId: 'gold_157_dragao_soberano_alvorada',
    p1Hp: 15,
    p1Essence: 5,
    p1MaxEssence: 7,
    p1Affinities: { red: 0, blue: 0, purple: 0, green: 0, gold: 6, neutral: 0 },
    p1HandCardIds: [
      'gold_146_trono_imperador_eterno',
      'gold_158_bencao_falange_invicta',
      'gold_147_escudeiro_alvorada_real',
    ],
    p1DeckTopCardIds: ['gold_148_clerigo_chama_sagrada', 'gold_07_dragao_ouro'],
    p1ChanneledCardIds: [
      'gold_26_muralha_aco',
      'gold_07_dragao_ouro',
      'gold_146_trono_imperador_eterno',
      'gold_154_colosso_marmore_sagrado',
      'gold_155_arconte_lanca_solar',
      'gold_158_bencao_falange_invicta',
    ],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'gold_07_dragao_ouro', row: 'vanguard', slotIndex: 1 },
      { cardId: 'gold_154_colosso_marmore_sagrado', row: 'vanguard', slotIndex: 2 },
      { cardId: 'gold_155_arconte_lanca_solar', row: 'vanguard', slotIndex: 4 },
    ],
    p2Name: 'Ignis Rex',
    p2Title: 'Soberano da Caldeira',
    p2AvatarCardId: 'red_157_dragao_tiamat_carmesim',
    p2Domain: 'red',
    p2Hp: 23,
    p2Essence: 0,
    p2MaxEssence: 8,
    p2Affinities: { red: 6, blue: 0, purple: 0, green: 0, gold: 0, neutral: 0 },
    p2Units: [
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 1, hasDivineShield: true },
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 2, hasDivineShield: true },
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 4, hasDivineShield: true },
    ],
    initialDomainState: {
      owner: 'player',
      domain: 'gold',
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
    id: 'prob_45_quebra_dupla_dominio_reanimacao',
    number: 45,
    code: 'PROBLEMA #45',
    title: 'Eclipse sobre Cinzas (Tributo 10❤️ + Reanimação + Domínio)',
    subtitle: 'Quebrar o Domínio rival com 10❤️, reanimar da Cripta e erguer seu próprio Domínio no mesmo turno',
    difficulty: 'grao_mestre',
    difficultyLabel: 'Grau V • Grão-Mestre Soberano',
    stars: 5,
    goldReward: 10,
    primaryDomain: 'purple',
    mechanicTag: '👑 Romper Domínio Rival → Reanimar → Expandir Domínio',
    scenarioLore:
      'O Soberano Rubro (19 ❤️) está com a Caldeira do Fogo Primordial ativa! Se você tentar invocar sua Expansão de Domínio agora (6 vs 6 de Afinidade), entrará em Confronto 50/50 (sem Acerto Garantido e sem tirar os escudos inimigos!). Porém, você pode destruir o Domínio dele ANTES de erguer o seu!',
    objectiveText: 'Estilhace o Domínio rival com 10❤️ ANTES de invocar seu próprio Domínio para evitar o Confronto 50/50!',
    hint1:
      'Se você invocar sua Expansão de Domínio enquanto o Domínio inimigo estiver ativo (6 vs 6), ocorrerá um Confronto 50/50 e seu Acerto Garantido será anulado! Mas se você usar "💥 Quebrar Domínio (10❤️)" PRIMEIRO, o Domínio inimigo desaparece — e quando você invocar o seu Domínio em seguida, ele reinará absoluto com Acerto Garantido!',
    hint2:
      '1º Clique em "💥 Quebrar Domínio (10❤️)" na barra inferior: a Caldeira inimiga é estilhaçada! 2º Lance Uivo Despedaçador de Mentes (3⚡): reanima o Dragão Vermelho da sua Cripta e dá +1⚔️! 3º Invoque a Expansão de Domínio Eclipse do Trono de Ossos (⛩️ 3⚡): agora sem rival para disputar 50/50, seu Domínio reina sozinho dando +1/+1, Ímpeto ao Dragão reanimado e Acerto Garantido para causar 19+ de dano!',
    solutionSteps: [
      '1. Clique em "💥 Quebrar Domínio (10❤️)" na barra inferior para destruir a Expansão de Domínio rival ANTES de ativar a sua (evitando o Confronto 50/50!).',
      '2. Lance Uivo Despedaçador de Mentes (3⚡): reanima o Dragão da sua Cripta para a Vanguarda [V] e concede +1⚔️.',
      '3. Com os 3⚡ restantes, invoque a Expansão de Domínio Eclipse do Trono de Ossos (⛩️ 3⚡): seu Domínio entra soberano (sem Confronto 50/50!), concedendo +1/+1, Ímpeto ao Dragão reanimado e Acerto Garantido!',
      '4. Ataque diretamente o Soberano rival com todas as unidades para 19+ de dano letal!',
    ],
    whyIndefensible:
      'Invocar a Expansão de Domínio antes de quebrar o Domínio rival trava a mesa num Confronto 50/50 (6 vs 6) e desativa o Acerto Garantido.',
    turnNumber: 8,
    p1Name: 'Vesperion (Você)',
    p1AvatarCardId: 'purple_156_lich_coroa_entropia',
    p1Hp: 22,
    p1Essence: 6,
    p1MaxEssence: 7,
    p1Affinities: { red: 0, blue: 0, purple: 6, green: 0, gold: 0, neutral: 0 },
    p1HandCardIds: ['purple_160_exumacao_proibida'],
    p1DeckTopCardIds: ['purple_15_espectro'],
    p1ChanneledCardIds: [
      'purple_11_garra_rastejante',
      'purple_13_zumbi',
      'purple_15_espectro',
      'purple_17_banshee',
      'purple_25_dama_seis_laminas',
      'purple_126_campanario_mortos',
    ],
    p1CryptCardIds: ['red_08_dragao_vermelho'],
    p1Units: [
      { cardId: 'purple_25_dama_seis_laminas', row: 'vanguard', slotIndex: 1 },
      { cardId: 'purple_07_lich', row: 'vanguard', slotIndex: 3 },
      { cardId: 'purple_126_campanario_mortos', row: 'rearguard', slotIndex: 1 },
    ],
    p2Name: 'Ignis Rex',
    p2Title: 'Rei da Caldeira',
    p2AvatarCardId: 'red_157_dragao_tiamat_carmesim',
    p2Domain: 'red',
    p2Hp: 19,
    p2Essence: 0,
    p2MaxEssence: 7,
    p2Affinities: { red: 6, blue: 0, purple: 0, green: 0, gold: 0, neutral: 0 },
    p2Units: [
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 1, hasDivineShield: true },
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 3, hasDivineShield: true },
    ],
    initialDomainState: {
      owner: 'ai',
      domain: 'red',
      turnsRemaining: 2,
      damageTakenByOwnerThisRound: 0,
      clashRival: null,
    },
  },
  {
    id: 'prob_46_cadeia_mercenario_ruptura_dominio',
    number: 46,
    code: 'PROBLEMA #46',
    title: 'A Equação Relojoeira de 6 Cartas',
    subtitle: 'Encadear Ruptura Astral (+2⚡) + Mercenário Planar (+1⚡) + Pulso Etéreo (+1⚡) + Domínio + Poção',
    difficulty: 'grao_mestre',
    difficultyLabel: 'Grau V • Grão-Mestre Soberano',
    stars: 5,
    goldReward: 10,
    primaryDomain: 'blue',
    mechanicTag: '👑 Tempestade de Feitiços & +4⚡ Reembolsados',
    scenarioLore:
      'Você começa com apenas 5⚡ de Essência, e o Soberano rival tem 22 ❤️ atrás de três Muralhas! Mas cada carta na sua mão e no topo do seu Grimório reembolsa Essência e compra a próxima peça da engrenagem!',
    objectiveText: 'Execute a tempestade de reembolsos de Essência na ordem exata para terminar com Domínio ativo e 22+ de dano!',
    hint1:
      'Calcule o custo líquido de cada passo começando com 5⚡: 1) Ruptura do Relógio Astral (custa 3⚡, devolve +2⚡ → você fica com 4⚡ e compra o Mercenário Planar!); 2) Mercenário Planar (custa 2⚡, devolve +1⚡ → fica com 3⚡ e compra a Poção de Fúria!); 3) Pacto de Sangue (+1⚡ → fica com 4⚡ para pagar Expansão de Domínio 3⚡ + Poção de Fúria 1⚡!).',
    hint2:
      '1º Lance Ruptura do Relógio Astral (3⚡ → +2⚡ = 4⚡, compra Mercenário Planar). 2º Invoque o Mercenário Planar (2⚡ → +1⚡ = 3⚡, compra Poção de Fúria) na Vanguarda [V] da Coluna 3 (com Cobertura da Relíquia!). 3º Ative "🩸 Pacto (+1⚡)" (3⚡ → 4⚡). 4º Ative a Expansão de Domínio Olho do Maelstrom Astral (⛩️ 3⚡ → sobra 1⚡) e lance a Poção de Fúria (1⚡, +2/+2)! 5º Ataque com todos para 22+ de dano!',
    solutionSteps: [
      '1. Lance a Ruptura do Relógio Astral (3⚡): restaura +2⚡ (5⚡ → 4⚡) e compra o Mercenário Planar.',
      '2. Invoque o Mercenário Planar (2⚡) na Vanguarda [V] da Coluna 3 (apoiada pelo Códice na Retaguarda): restaura +1⚡ (4⚡ → 3⚡) e compra a Poção de Fúria.',
      '3. Ative "🩸 Pacto (+1⚡)" na barra inferior para subir de 3⚡ para 4⚡.',
      '4. Invoque a Expansão de Domínio Olho do Maelstrom Astral (⛩️ 3⚡) e lance a Poção de Fúria (1⚡, +2/+2).',
      '5. Ataque diretamente o Soberano rival com todas as unidades para 22+ de dano letal!',
    ],
    whyIndefensible:
      'Inverter qualquer carta da cadeia trava sua Essência abaixo de 3⚡ e impede a continuação do combo.',
    turnNumber: 7,
    p1Name: 'Hydrissa (Você)',
    p1AvatarCardId: 'blue_154_dragao_safira_soberano',
    p1Hp: 18,
    p1Essence: 5,
    p1MaxEssence: 7,
    p1Affinities: { red: 0, blue: 6, purple: 0, green: 0, gold: 0, neutral: 1 },
    p1HandCardIds: ['blue_141_ruptura_temporal'],
    p1DeckTopCardIds: ['neutral_52_mercenario_planar', 'neutral_18_pocao_furia', 'blue_01_sentinela_ventos'],
    p1ChanneledCardIds: [
      'blue_01_sentinela_ventos',
      'blue_10_portal_runas',
      'blue_12_espreitador_eter',
      'blue_141_ruptura_temporal',
      'blue_152_arquimago_vortice',
      'blue_154_dragao_safira_soberano',
    ],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'blue_152_arquimago_vortice', row: 'vanguard', slotIndex: 1 },
      { cardId: 'blue_12_espreitador_eter', row: 'vanguard', slotIndex: 4 },
      { cardId: 'neutral_144_nucleo_relojoeiro_aeternus', row: 'rearguard', slotIndex: 2 },
    ],
    p2Name: 'Aurelius',
    p2Title: 'Trono Dourado',
    p2AvatarCardId: 'gold_157_dragao_soberano_alvorada',
    p2Domain: 'gold',
    p2Hp: 22,
    p2Essence: 0,
    p2MaxEssence: 7,
    p2Affinities: { red: 0, blue: 0, purple: 0, green: 0, gold: 6, neutral: 0 },
    p2Units: [
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 1, hasDivineShield: true },
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 2, hasDivineShield: true },
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 4, hasDivineShield: true },
    ],
  },
  {
    id: 'prob_47_cataclismo_furia_ascensao_dupla',
    number: 47,
    code: 'PROBLEMA #47',
    title: 'Forja de Sangue e Cataclismo',
    subtitle: 'Inversão Gravitacional (5⚡) para ativar Fúria Crescente + Ascensão da Salamandra (3⚡) + Pacto de Sangue',
    difficulty: 'grao_mestre',
    difficultyLabel: 'Grau V • Grão-Mestre Soberano',
    stars: 5,
    goldReward: 10,
    primaryDomain: 'red',
    mechanicTag: '👑 Cataclismo + Fúria Crescente + Ascensão ★',
    scenarioLore:
      'Três Guardiões de 3 ❤️ bloqueiam as Colunas 1, 2 e 3. Você tem 7⚡ de Essência, a Inversão Gravitacional Planar (5⚡) na mão e uma Salamandra do Mar de Brasas na Coluna 2 (cujo ★ Ascender custa 3⚡) acompanhada de dois Campeões com Fúria Crescente! O Soberano rival tem 25 ❤️.',
    objectiveText: 'Gere o 8º ponto de Essência, varra os Guardiões ativando Fúria Crescente e Ascenda a Salamandra!',
    hint1:
      'Cuidado com a ordem entre Inversão Gravitacional (5⚡, causa 3 de dano a todas as unidades) e a Ascensão da Salamandra (3⚡)! Tanto em qualquer ordem a Salamandra sobrevive, mas você precisa de 5⚡ + 3⚡ = 8⚡ (use o Pacto de Sangue para ir de 7⚡ a 8⚡!).',
    hint2:
      '1º Ative "🩸 Pacto (+1⚡)" (7⚡ → 8⚡). 2º Lance a Inversão Gravitacional Planar (5⚡): destrói os 3 Guardiões inimigos (liberando +3⚔️ de Invasão!), causa 3 de dano ao Soberano rival (25 ❤️ → 22 ❤️) e fere seus dois Campeões ativando a Fúria Crescente (+4⚔️)! 3º Clique na Salamandra na Coluna 2 e ative "★ Ascender (3⚡)" (vai a 8/8 + Cobertura + Invasão = 10⚔️!). 4º Ataque com os três para 24+ de dano letal!',
    solutionSteps: [
      '1. Ative "🩸 Pacto (+1⚡)" na barra inferior para subir de 7⚡ para 8⚡.',
      '2. Lance a Inversão Gravitacional Planar (5⚡): elimina os 3 Guardiões inimigos, causa 3 de dano ao Soberano rival (25 ❤️ → 22 ❤️) e fere seus dois Campeões (ativando Fúria Crescente +2⚔️ em cada!).',
      '3. Clique na Salamandra do Mar de Brasas (Coluna 2) e ative "★ Ascender (3⚡)" para transformá-la em Salamandra Anciã (10⚔️ ATQ com Cobertura e Invasão!).',
      '4. Ataque o Soberano rival com seus três campeões para zerar os 22 ❤️ restantes!',
    ],
    whyIndefensible:
      'Sem o Pacto de Sangue falta 1⚡ para combinar Inversão Gravitacional (5⚡) + Ascensão (3⚡).',
    turnNumber: 7,
    p1Name: 'Ignis Rex (Você)',
    p1AvatarCardId: 'red_05_salamandra',
    p1Hp: 18,
    p1Essence: 7,
    p1MaxEssence: 7,
    p1Affinities: { red: 4, blue: 0, purple: 0, green: 2, gold: 0, neutral: 1 },
    p1HandCardIds: ['neutral_156_cataclismo_gravidade_reversa'],
    p1DeckTopCardIds: ['red_01_kobold'],
    p1ChanneledCardIds: ['red_04_meio_dragao', 'red_05_salamandra', 'green_18_lobisomem', 'neutral_156_cataclismo_gravidade_reversa'],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'red_04_meio_dragao', row: 'vanguard', slotIndex: 0 },
      { cardId: 'red_05_salamandra', row: 'vanguard', slotIndex: 1 },
      { cardId: 'green_18_lobisomem', row: 'vanguard', slotIndex: 2 },
      { cardId: 'red_10_altar_draconico', row: 'rearguard', slotIndex: 1 },
    ],
    p2Name: 'Soberano das Marés',
    p2Title: 'Tridente Abissal',
    p2AvatarCardId: 'blue_07_kraken',
    p2Domain: 'blue',
    p2Hp: 25,
    p2Essence: 0,
    p2MaxEssence: 7,
    p2Affinities: { red: 0, blue: 5, purple: 0, green: 0, gold: 0, neutral: 0 },
    p2Units: [
      { cardId: 'blue_11_anomalia_agua', row: 'vanguard', slotIndex: 0 },
      { cardId: 'blue_11_anomalia_agua', row: 'vanguard', slotIndex: 1 },
      { cardId: 'blue_11_anomalia_agua', row: 'vanguard', slotIndex: 2 },
    ],
  },
  {
    id: 'prob_48_convergencia_cinco_dominios',
    number: 48,
    code: 'PROBLEMA #48',
    title: 'O Pacto Cromático (5 Domínios Unificados)',
    subtitle: 'Combinar cartas dos 5 Domínios na mesma rodada usando Manobra [⇄] + Ruptura Astral + Domínio',
    difficulty: 'grao_mestre',
    difficultyLabel: 'Grau V • Grão-Mestre Soberano',
    stars: 5,
    goldReward: 10,
    primaryDomain: 'gold',
    mechanicTag: '👑 Convergência dos 5 Domínios Cromáticos',
    scenarioLore:
      'Representantes dos 5 Domínios lutam sob o seu estandarte! O Soberano rival tem 24 ❤️ protegido por três Muralhas. Seu Dragão de Ouro está na Retaguarda [R] da Coluna 2, você tem 6⚡ de Essência e precisa lançar a Ruptura do Relógio Astral (3⚡ → +2⚡), o Baluarte dos Escudos de Luz (2⚡) E ativar a Expansão de Domínio (3⚡)!',
    objectiveText: 'Avance o Dragão de Ouro [⇄] e encadeie Ruptura Astral + Baluarte + Expansão de Domínio para 24 de dano!',
    hint1:
      'Você tem 6⚡ e precisa de 3⚡ (Ruptura, que devolve +2⚡) + 2⚡ (Baluarte) + 3⚡ (Expansão de Domínio) = 8⚡ brutos (6⚡ líquidos!). Portanto, se lançar a Ruptura do Relógio Astral primeiro (6⚡ - 3⚡ + 2⚡ = 5⚡), sobram exatos 5⚡ para o Baluarte (2⚡) + Expansão de Domínio (3⚡)!',
    hint2:
      '1º Clique no Dragão de Ouro na Retaguarda [R] (Coluna 2) e use "⇄ Mover para Vanguarda". 2º Lance a Ruptura do Relógio Astral (3⚡ → devolve +2⚡, ficando com 5⚡!). 3º Lance o Baluarte dos Escudos de Luz (2⚡, +1⚔️ a todos → sobram 3⚡). 4º Ative a Expansão de Domínio Cidadela da Aurora (⛩️ 3⚡) e ataque diretamente o Soberano rival com seus 4 campeões cromáticos para 24+ de dano!',
    solutionSteps: [
      '1. Use "⇄ Mover Fileira" no Dragão de Ouro na Retaguarda [R] (Coluna 2) para avançá-lo à Vanguarda [V].',
      '2. Lance a Ruptura do Relógio Astral (3⚡): congela os inimigos e devolve +2⚡ de Essência (6⚡ → 5⚡).',
      '3. Lance o Baluarte dos Escudos de Luz (2⚡): concede Escudo Divino e +1⚔️ a toda a Vanguarda.',
      '4. Com os 3⚡ restantes, invoque a Cidadela da Aurora (⛩️ 3⚡) e ataque diretamente o Soberano rival com seus 4 campeões para 24+ de dano letal!',
    ],
    whyIndefensible:
      'Se você ativar a Expansão de Domínio (3⚡) e o Baluarte (2⚡) antes da Ruptura do Relógio Astral (3⚡), ficará com apenas 1⚡ e não conseguirá lançar a Ruptura.',
    turnNumber: 8,
    p1Name: 'Soberano Cromático (Você)',
    p1AvatarCardId: 'gold_157_dragao_soberano_alvorada',
    p1Hp: 20,
    p1Essence: 6,
    p1MaxEssence: 8,
    p1Affinities: { red: 1, blue: 2, purple: 1, green: 1, gold: 6, neutral: 0 },
    p1HandCardIds: ['blue_141_ruptura_temporal', 'gold_158_bencao_falange_invicta'],
    p1DeckTopCardIds: ['red_01_kobold', 'gold_07_dragao_ouro'],
    p1ChanneledCardIds: [
      'gold_26_muralha_aco',
      'gold_07_dragao_ouro',
      'gold_146_trono_imperador_eterno',
      'gold_154_colosso_marmore_sagrado',
      'gold_155_arconte_lanca_solar',
      'gold_158_bencao_falange_invicta',
    ],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'red_04_meio_dragao', row: 'vanguard', slotIndex: 0 },
      { cardId: 'gold_07_dragao_ouro', row: 'rearguard', slotIndex: 1 },
      { cardId: 'purple_25_dama_seis_laminas', row: 'vanguard', slotIndex: 2 },
      { cardId: 'green_18_lobisomem', row: 'vanguard', slotIndex: 4 },
    ],
    p2Name: 'Arconte do Eclipse',
    p2Title: 'Senhor das Sombras',
    p2AvatarCardId: 'purple_156_lich_coroa_entropia',
    p2Domain: 'purple',
    p2Hp: 24,
    p2Essence: 0,
    p2MaxEssence: 8,
    p2Affinities: { red: 0, blue: 0, purple: 6, green: 0, gold: 0, neutral: 0 },
    p2Units: [
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 0, hasDivineShield: true },
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 2, hasDivineShield: true },
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 4, hasDivineShield: true },
    ],
  },
  {
    id: 'prob_49_colapso_duplo_8dano_mais_dominio',
    number: 49,
    code: 'PROBLEMA #49',
    title: 'Ruptura de Concentração em Confronto (O Golpe Aéreo)',
    subtitle: 'Com ambos os Domínios em Confronto 50/50 (7 vs 7!), causar 8+ de dano aéreo para estilhaçar o Domínio rival',
    difficulty: 'grao_mestre',
    difficultyLabel: 'Grau V • Grão-Mestre Soberano',
    stars: 5,
    goldReward: 10,
    primaryDomain: 'green',
    mechanicTag: '👑 Confronto 7v7 → Quebra por 8+ Dano Aéreo',
    scenarioLore:
      'Ambos os Soberanos já estão com 7 vs 7 de Afinidade num Confronto de Domínios 50/50 — e sua mão não tem nenhuma carta Verde para subir para 8 vs 7! Enquanto o Confronto 50/50 durar, seus atacantes terrestres na Coluna 2 e 3 estão bloqueados por Muralhas com Escudo Divino. Como estilhaçar o Domínio rival sem ter cartas para Canalizar?',
    objectiveText: 'Quebre o Domínio rival no meio do Confronto 50/50 causando 8+ de dano ao Soberano rival pelo ar!',
    hint1:
      'Mesmo durante um Confronto de Domínios 50/50, a regra da perda de concentração continua valendo: se o Soberano rival sofrer 8 ou mais de dano na rodada, o Domínio dele se estilhaça na hora — encerrando o Confronto 50/50 e reativando o SEU Acerto Garantido para o resto das suas unidades!',
    hint2:
      'Veja seu Dragão Verde na Coluna 5: ele tem Voo (ignora Guardiões terrestres mesmo sem Acerto Garantido!) e tem 9⚔️ ATQ! 1º Lance a Poção de Fúria (1⚡, +2/+2) no Dragão Verde (vai a 11⚔️!). 2º Ataque DIRETAMENTE o Soberano rival com o Dragão Verde (Voo): ele causa 11 de dano (>= 8!), estilhaçando o Domínio rival por perda de concentração! 3º Agora o SEU Domínio reina sozinho com Acerto Garantido — ataque o Soberano rival com o Verme Púrpura e o Tiranossauro ignorando as Muralhas!',
    solutionSteps: [
      '1. Lance a Poção de Fúria (1⚡, +2/+2) em uma de suas criaturas.',
      '2. Selecione o Dragão Verde na Coluna 5 (que possui Voo, ignorando as Muralhas terrestres mesmo durante o Confronto 50/50!) e ataque diretamente o Soberano rival: causa 9+ de dano (>= 8), estilhaçando a Expansão de Domínio inimiga por perda de concentração!',
      '3. Com o Domínio rival estilhaçado, o Confronto 50/50 termina e o seu Acerto Garantido volta a funcionar imediatamente!',
      '4. Ataque diretamente o Soberano rival com o Verme Púrpura e o Tiranossauro (agora ignorando as Muralhas!) para zerar os 28 ❤️!',
    ],
    whyIndefensible:
      'Se você clicar em atacar com as unidades terrestres antes de atacar com o Dragão Verde voador, o Confronto 50/50 ainda estará ativo e seus titãs terrestres baterão nas Muralhas com Escudo Divino!',
    turnNumber: 9,
    p1Name: 'Sylvarion (Você)',
    p1AvatarCardId: 'green_25_dragao_verde',
    p1Hp: 18,
    p1Essence: 1,
    p1MaxEssence: 9,
    p1Affinities: { red: 0, blue: 0, purple: 0, green: 7, gold: 0, neutral: 1 },
    p1HandCardIds: ['neutral_18_pocao_furia'],
    p1DeckTopCardIds: ['neutral_18_pocao_furia'],
    p1ChanneledCardIds: [
      'green_17_centauro',
      'green_18_lobisomem',
      'green_20_tubarao_terrestre',
      'green_22_wyvern',
      'green_24_verme_purpura',
      'green_25_dragao_verde',
      'green_157_quimera_tres_presas',
    ],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'green_24_verme_purpura', row: 'vanguard', slotIndex: 1 },
      { cardId: 'green_157_quimera_tres_presas', row: 'vanguard', slotIndex: 2 },
      { cardId: 'green_25_dragao_verde', row: 'vanguard', slotIndex: 4 },
    ],
    p2Name: 'Aurelius, Sol Invicto',
    p2Title: 'Imperador da Alvorada',
    p2AvatarCardId: 'gold_157_dragao_soberano_alvorada',
    p2Domain: 'gold',
    p2Hp: 28,
    p2Essence: 0,
    p2MaxEssence: 9,
    p2Affinities: { red: 0, blue: 0, purple: 0, green: 0, gold: 7, neutral: 0 },
    p2Units: [
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 1, hasDivineShield: true },
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 2, hasDivineShield: true },
    ],
    initialDomainState: {
      owner: 'ai',
      domain: 'gold',
      turnsRemaining: 3,
      damageTakenByOwnerThisRound: 0,
      clashRival: {
        owner: 'player',
        domain: 'green',
        turnsRemaining: 3,
      },
    },
  },
  {
    id: 'prob_50_convergencia_vulcanis_30dano',
    number: 50,
    code: 'PROBLEMA #50',
    title: 'O Juízo Final de Pyros (30 de Dano em 1 Turno)',
    subtitle: 'O Desafio Supremo #50: Desempate 7v6 + Manobra de Fileira [⇄] + Pacto de Sangue + Dragão de Tiamat Carmesim',
    difficulty: 'grao_mestre',
    difficultyLabel: 'Grau V • Grão-Mestre Soberano',
    stars: 5,
    goldReward: 10,
    primaryDomain: 'red',
    mechanicTag: '👑 Desafio Final #50 • 30 Dano em 1 Turno',
    scenarioLore:
      'O Problema #50 de Chromatic Pact! O Arquilich rival tem 30 ❤️ e está travando um Confronto de Domínios 50/50 (6 vs 6) com três Muralhas de Escudo Divino na Vanguarda. Seu Soberano Meio-Dragão Ascendido está na Retaguarda [R], você tem 7⚡ de Essência e o Dragão de Tiamat Carmesim (8⚡) na mão!',
    objectiveText: 'Cause exatos 30+ de dano neste único turno combinando todas as mecânicas mestras do jogo!',
    hint1:
      'Observe os 4 obstáculos: 1) O Confronto 50/50 anula seu Acerto Garantido (precisa Canalizar 1 carta Vermelha para 7 vs 6!); 2) O Dragão de Tiamat Carmesim custa 8⚡ e você tem 7⚡ (precisa do Pacto de Sangue para +1⚡!); 3) Seu Campeão Dracônico está na Retaguarda [R] (precisa de "⇄ Mover Fileira" para a Vanguarda [V]!); 4) Coloque o Dragão de Tiamat na coluna com Cobertura da Bigorna!',
    hint2:
      '1º Canalize o Batedor Escamado [C] (Afinidade Carmesim vai a 7 vs 6 → rompe o Domínio rival!). 2º Use "🩸 Pacto (+1⚡)" (7⚡ → 8⚡). 3º Clique no Campeão Dracônico na Retaguarda [R] (Coluna 1) e use "⇄ Mover Fileira" para avançá-lo à Vanguarda [V]. 4º Invoque o Dragão de Tiamat Carmesim (8⚡) na Vanguarda [V] da Coluna 4 (apoiada pela Bigorna na Retaguarda): causa 3 de dano Ao Entrar no Soberano rival (30 ❤️ → 27 ❤️!) e entra com +1/+1 e Ímpeto! 5º Ataque diretamente o Soberano rival com toda a sua Vanguarda sob a Caldeira do Fogo Primordial para 30+ de dano!',
    solutionSteps: [
      '1. Selecione o Batedor Escamado na mão e clique em "⛰️ Canalizar [C]": sua Afinidade Carmesim sobe para 7 vs 6, estilhaçando o domínio rival e reativando seu Acerto Garantido!',
      '2. Clique em "🩸 Pacto (+1⚡)" na barra inferior: sacrifica 3 ❤️ para subir de 7⚡ para 8⚡.',
      '3. Clique no Campeão Dracônico na Retaguarda [R] (Coluna 1) e use "⇄ Mover Fileira" para avançá-lo à Vanguarda [V].',
      '4. Invoque o Dragão de Tiamat Carmesim (8⚡) na Vanguarda [V] (Coluna 4, apoiada pela Bigorna na Retaguarda): causa 3 de dano Ao Entrar no Soberano rival (30 ❤️ → 27 ❤️) e entra com +1/+1 e Ímpeto!',
      '5. Ataque diretamente o Soberano rival com toda a sua Vanguarda para ultrapassar os 30 ❤️ e conquistar o título de Grão-Mestre dos 50 Problemas!',
    ],
    whyIndefensible:
      'Qualquer esquecimento (não canalizar 7 vs 6, não fazer Pacto de Sangue para 8⚡, ou esquecer de avançar o Campeão da Retaguarda com ⇄) deixa o Arquilich vivo!',
    turnNumber: 9,
    p1Name: 'Ignis Rex, Grão-Mestre (Você)',
    p1AvatarCardId: 'red_157_dragao_tiamat_carmesim',
    p1Hp: 12,
    p1Essence: 7,
    p1MaxEssence: 8,
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
