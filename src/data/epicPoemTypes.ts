import { Domain } from '../types/game';

/**
 * Um nó dentro do Grande Poema Épico de Vaeloria (Coluna Única Contínua).
 * Pode ser:
 * - 'prelude' / 'interlude': Estrofes de transição histórica, batalhas, tratados e marcos cronológicos.
 * - 'creature': Episódio poético completo de uma das 73 Criaturas Lendárias (#1 a #73),
 *   inserida em seu exato momento histórico e geográfico com múltiplas estrofes rimadas.
 */
export interface EpicPoemNode {
  id: string;
  kind: 'prelude' | 'interlude' | 'creature';
  /** Ordem cronológica global da criatura (1 a 73) se kind === 'creature' */
  creatureOrder?: number;
  /** ID da carta ilustrada associada a este trecho do poema */
  cardId: string;
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
  /** Sequência contínua de prelúdios, criaturas lendárias e interlúdios históricos em coluna única */
  nodes: EpicPoemNode[];
}
