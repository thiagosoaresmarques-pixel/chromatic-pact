import { EpicPoemCanto, EpicPoemNode } from './epicPoemTypes';
import { EPIC_POEM_PART_1 } from './epicPoemPart1';
import { EPIC_POEM_PART_2 } from './epicPoemPart2';
import { EPIC_POEM_PART_3 } from './epicPoemPart3';
import { EPIC_POEM_PART_4 } from './epicPoemPart4';

/**
 * O GRANDE POEMA ÉPICO DE VAELORIA — A CANÇÃO DA FRATURA CROMÁTICA (∞ A.F. — 1.240 D.F.)
 * Reúne os 7 Cantos Cronológicos (Era Zero à VIª Era) em um único poema contínuo
 * de coluna única, contendo Prelúdios, Interlúdios Históricos e todas as 73 Criaturas Lendárias (#1 a #73).
 */
export const EPIC_POEM_CANTOS: EpicPoemCanto[] = [
  ...EPIC_POEM_PART_1,
  ...EPIC_POEM_PART_2,
  ...EPIC_POEM_PART_3,
  ...EPIC_POEM_PART_4,
];

/**
 * Todos os nós poéticos (Prelúdios, as 73 Criaturas Lendárias e Interlúdios) em ordem cronológica linear.
 */
export const ALL_EPIC_POEM_NODES: EpicPoemNode[] = EPIC_POEM_CANTOS.flatMap((canto) => canto.nodes);

/**
 * Mapa direto por cardId para os nós das 73 Criaturas Lendárias no Grande Poema Épico.
 */
export const EPIC_POEM_CREATURE_NODES_BY_CARD_ID: Record<string, EpicPoemNode> =
  ALL_EPIC_POEM_NODES.reduce<Record<string, EpicPoemNode>>((acc, node) => {
    if (node.kind === 'creature') {
      acc[node.cardId] = node;
    }
    return acc;
  }, {});

/**
 * Contagem total de versos e estrofes do Grande Poema Épico.
 */
export const EPIC_POEM_STATS = {
  totalCantos: EPIC_POEM_CANTOS.length,
  totalNodes: ALL_EPIC_POEM_NODES.length,
  totalLegendaryCreatures: ALL_EPIC_POEM_NODES.filter((n) => n.kind === 'creature').length,
  totalStanzas: ALL_EPIC_POEM_NODES.reduce((sum, n) => sum + n.stanzas.length, 0),
  totalVerses: ALL_EPIC_POEM_NODES.reduce(
    (sum, n) => sum + n.stanzas.reduce((sSum, st) => sSum + st.length, 0),
    0
  ),
};
