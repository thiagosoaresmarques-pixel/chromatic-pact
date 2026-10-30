import { Domain } from '../types/game';

/**
 * Um nó dentro do Grande Poema Épico de Vaeloria (Coluna Única Contínua).
 * Pode ser:
 * - 'prelude' / 'interlude': Estrofes de transição histórica, batalhas, tratados e marcos cronológicos.
 * - 'creature': Episódio poético completo de uma das 100 Criaturas Lendárias (#1 a #100),
 *   inserida em seu exato momento histórico e geográfico com múltiplas estrofes rimadas.
 */
export interface EpicPoemNode {
  id: string;
  kind: 'prelude' | 'interlude' | 'creature';
  /** Ordem cronológica global da criatura (1 a 100) se kind === 'creature' */
  creatureOrder?: number;
  /** ID da carta ilustrada associada a este trecho do poema */
  cardId: string;
  /** Se verdadeiro, oculta a ilustração neste segmento para fluir apenas como estrofes narrativas de transição */
  hideCardArt?: boolean;
  /** Título poético do episódio ou nome próprio da criatura lendária */
  title: string;
  /** Subtítulo / epíteto ou resumo de 1 linha do marco histórico */
  subtitle: string;
  /** Data oficial no calendário de Vaeloria (ex: '∞ A.F.', 'Ano 12 A.F.', 'Ano 599 D.F.') */
  yearLabel: string;
  /** Local geográfico em Vaeloria */
  locationLabel: string;
  /** Domínio cromático predominante deste trecho */
  domain: Domain;
  /**
   * Estrofes do poema (cada estrofe é um array de 4 versos rimados em esquema AABB ou ABAB).
   * Para criaturas lendárias, contém 3 quadras (12 versos) que narram a data, o contexto histórico,
   * o feito lendário e o poder da criatura em batalha, conectando-se ao fluxo do poema.
   */
  stanzas: string[][];
}

export interface EpicPoemCanto {
  id: string;
  cantoNumber: string;
  eraNumber: string;
  periodLabel: string;
  title: string;
  subtitle: string;
  accentColor: string;
  bannerImage: string;
  /** Se verdadeiro, este Canto é uma Crônica Paralela (aprofundamento opcional de um Canto principal) */
  isParallel?: boolean;
  /** ID do Canto principal (ex: 'canto_1_vigilia' a 'canto_7_presente') ao qual esta história paralela se vincula */
  parentCantoId?: string;
  /** ID do nó de evento histórico no Canto principal logo após o qual esta história paralela se ramifica */
  anchorNodeId?: string;
  /** Código curto para a régua lateral (ex: 'I-A', 'II-A') */
  parallelCode?: string;
  /** Ordem cronológica canônica global dos 78 capítulos narrativos (1 a 78) */
  chronologicalOrder?: number;
  /** Rótulo curto para subitem da régua lateral e filtro (ex: 'Conjura do Prisma') */
  shortTitle?: string;
  /** Sequência contínua de prelúdios, criaturas lendárias e interlúdios históricos em coluna única */
  nodes: EpicPoemNode[];
}
