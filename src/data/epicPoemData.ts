import { EpicPoemCanto, EpicPoemNode } from './epicPoemTypes';
import { EPIC_POEM_PART_1 } from './epicPoemPart1';
import { EPIC_POEM_PART_2 } from './epicPoemPart2';
import { EPIC_POEM_PART_3 } from './epicPoemPart3';
import { EPIC_POEM_PART_4 } from './epicPoemPart4';
import { EPIC_POEM_PARALLEL_PART_1 } from './epicPoemParallelPart1';
import { EPIC_POEM_PARALLEL_PART_2 } from './epicPoemParallelPart2';
import { EPIC_POEM_PARALLEL_PART_3 } from './epicPoemParallelPart3';
import { EPIC_POEM_PARALLEL_PART_4 } from './epicPoemParallelPart4';
import { EPIC_POEM_PARALLEL_PART_5 } from './epicPoemParallelPart5';
import { EPIC_POEM_PARALLEL_PART_6 } from './epicPoemParallelPart6';

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
 * CRÔNICAS PARALELAS DE VAELORIA (CANTOS I-A a VII-A)
 * Ramificações opcionais derivadas dos 7 Cantos principais, integrando as demais criaturas e relíquias.
 */
const ROMAN_BY_CANTO_ID: Record<string, string> = {
  canto_1_vigilia: 'I',
  canto_2_fratura: 'II',
  canto_3_cidadelas: 'III',
  canto_4_guerra: 'IV',
  canto_5_pacto: 'V',
  canto_6_tratados: 'VI',
  canto_7_presente: 'VII',
};

const RAW_PARALLEL_CANTOS: EpicPoemCanto[] = [
  ...EPIC_POEM_PARALLEL_PART_1,
  ...EPIC_POEM_PARALLEL_PART_2,
  ...EPIC_POEM_PARALLEL_PART_3,
  ...EPIC_POEM_PARALLEL_PART_4,
  ...EPIC_POEM_PARALLEL_PART_5,
  ...EPIC_POEM_PARALLEL_PART_6,
];

/**
 * Ordena os Cantos Paralelos na exata ordem cronológica dos nós-âncora de cada Canto Principal
 * e normaliza automaticamente os códigos (I-A, I-B, I-C...) para que a régua lateral e o fluxo
 * da página estejam sempre 100% sincronizados.
 */
export const PARALLEL_EPIC_POEM_CANTOS: EpicPoemCanto[] = EPIC_POEM_CANTOS.flatMap((mainCanto) => {
  const roman = ROMAN_BY_CANTO_ID[mainCanto.id] || 'I';
  const children = RAW_PARALLEL_CANTOS.filter((p) => p.parentCantoId === mainCanto.id);

  children.sort((a, b) => {
    const idxA = mainCanto.nodes.findIndex((n) => n.id === a.anchorNodeId);
    const idxB = mainCanto.nodes.findIndex((n) => n.id === b.anchorNodeId);
    const posA = idxA === -1 ? 999 : idxA;
    const posB = idxB === -1 ? 999 : idxB;
    if (posA !== posB) return posA - posB;
    return (a.parallelCode || '').localeCompare(b.parallelCode || '');
  });

  return children.map((child, idx) => {
    const suffix = String.fromCharCode(65 + idx); // A, B, C, D...
    const code = `${roman}-${suffix}`;
    return {
      ...child,
      parallelCode: code,
      cantoNumber: `CANTO PARALELO ${code}`,
    };
  });
});

export const PARALLEL_CANTO_BY_PARENT_ID: Record<string, EpicPoemCanto> = Object.fromEntries(
  PARALLEL_EPIC_POEM_CANTOS.filter((c) => c.parentCantoId).map((c) => [c.parentCantoId!, c])
);

export const PARALLEL_CANTOS_BY_PARENT_ID: Record<string, EpicPoemCanto[]> =
  PARALLEL_EPIC_POEM_CANTOS.reduce<Record<string, EpicPoemCanto[]>>((acc, canto) => {
    if (canto.parentCantoId) {
      if (!acc[canto.parentCantoId]) {
        acc[canto.parentCantoId] = [];
      }
      acc[canto.parentCantoId].push(canto);
    }
    return acc;
  }, {});

export const ALL_PARALLEL_POEM_NODES: EpicPoemNode[] = PARALLEL_EPIC_POEM_CANTOS.flatMap(
  (c) => c.nodes
);

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
