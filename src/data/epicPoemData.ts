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
import { EPIC_POEM_PARALLEL_PART_7 } from './epicPoemParallelPart7';
import { EPIC_POEM_PARALLEL_PART_8 } from './epicPoemParallelPart8';
import { EPIC_POEM_PARALLEL_PART_9 } from './epicPoemParallelPart9';
import { EPIC_POEM_PARALLEL_PART_10 } from './epicPoemParallelPart10';
import { EPIC_POEM_PARALLEL_PART_11 } from './epicPoemParallelPart11';
import { EPIC_POEM_PARALLEL_PART_12 } from './epicPoemParallelPart12';
import { EPIC_POEM_PARALLEL_PART_13 } from './epicPoemParallelPart13';
import { EPIC_POEM_PARALLEL_PART_14 } from './epicPoemParallelPart14';
import { EPIC_POEM_PARALLEL_PART_15 } from './epicPoemParallelPart15';
import { EPIC_POEM_PARALLEL_PART_16 } from './epicPoemParallelPart16';
import { EPIC_POEM_PARALLEL_PART_17 } from './epicPoemParallelPart17';
import { EPIC_POEM_PARALLEL_PART_18 } from './epicPoemParallelPart18';
import { EPIC_POEM_PARALLEL_PART_19 } from './epicPoemParallelPart19';
import { EPIC_POEM_PARALLEL_PART_20 } from './epicPoemParallelPart20';
import { EPIC_POEM_PARALLEL_PART_21 } from './epicPoemParallelPart21';
import { EPIC_POEM_PARALLEL_PART_22 } from './epicPoemParallelPart22';
import { EPIC_POEM_PARALLEL_PART_23 } from './epicPoemParallelPart23';

/**
 * O GRANDE POEMA ÉPICO DE VAELORIA — A CANÇÃO DA FRATURA CROMÁTICA (∞ A.F. — 1.240 D.F.)
 * Estrutura das 7 Grandes Eras Cronológicas (Era Zero à VIª Era), cujos capítulos narrativos
 * contínuos (71 Capítulos Canônicos) contam a História Principal de Vaeloria integrando as
 * 82 Criaturas Lendárias e todas as 34 Relíquias e Feitiços Lendários das Seis Eras.
 */
export const EPIC_POEM_CANTOS: EpicPoemCanto[] = [
  ...EPIC_POEM_PART_1,
  ...EPIC_POEM_PART_2,
  ...EPIC_POEM_PART_3,
  ...EPIC_POEM_PART_4,
];

/**
 * CAPÍTULOS NARRATIVOS DA CRÔNICA PRINCIPAL DE VAELORIA (CAPÍTULOS I-A a VII-K)
 * Os 71 capítulos contínuos distribuídos nos 7 Cantos cronológicos.
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
  ...EPIC_POEM_PARALLEL_PART_7,
  ...EPIC_POEM_PARALLEL_PART_8,
  ...EPIC_POEM_PARALLEL_PART_9,
  ...EPIC_POEM_PARALLEL_PART_10,
  ...EPIC_POEM_PARALLEL_PART_11,
  ...EPIC_POEM_PARALLEL_PART_12,
  ...EPIC_POEM_PARALLEL_PART_13,
  ...EPIC_POEM_PARALLEL_PART_14,
  ...EPIC_POEM_PARALLEL_PART_15,
  ...EPIC_POEM_PARALLEL_PART_16,
  ...EPIC_POEM_PARALLEL_PART_17,
  ...EPIC_POEM_PARALLEL_PART_18,
  ...EPIC_POEM_PARALLEL_PART_19,
  ...EPIC_POEM_PARALLEL_PART_20,
  ...EPIC_POEM_PARALLEL_PART_21,
  ...EPIC_POEM_PARALLEL_PART_22,
  ...EPIC_POEM_PARALLEL_PART_23,
];

/**
 * Ordena os Capítulos Narrativos na exata ordem cronológica dos marcos de cada Canto
 * e normaliza automaticamente os códigos (I-A, I-B, I-C...) para que a régua lateral e o fluxo
 * do livro iluminado estejam sempre 100% sincronizados.
 */
export const PARALLEL_EPIC_POEM_CANTOS: EpicPoemCanto[] = EPIC_POEM_CANTOS.flatMap((mainCanto) => {
  const roman = ROMAN_BY_CANTO_ID[mainCanto.id] || 'I';
  const children = RAW_PARALLEL_CANTOS.filter((p) => p.parentCantoId === mainCanto.id);

  children.sort((a, b) => {
    // No Canto VII, garante que o Capítulo de Gorgonoth & Deus-Máquina (1.180–1.240 D.F.)
    // venha imediatamente antes do Epílogo do Último Conselho na Arena (1.240 D.F.).
    if (a.id === 'canto_7b_ultimo_conselho_arena' && b.id !== 'canto_7b_ultimo_conselho_arena') {
      return 1;
    }
    if (b.id === 'canto_7b_ultimo_conselho_arena' && a.id !== 'canto_7b_ultimo_conselho_arena') {
      return -1;
    }

    const idxA = mainCanto.nodes.findIndex((n) => n.id === a.anchorNodeId);
    const idxB = mainCanto.nodes.findIndex((n) => n.id === b.anchorNodeId);
    const posA = idxA === -1 ? 999 : idxA;
    const posB = idxB === -1 ? 999 : idxB;
    if (posA !== posB) return posA - posB;

    // Caso dois capítulos compartilhem o mesmo anchorNodeId (ex: 680 D.F. vs 689 D.F. no Canto V),
    // garante que Valerius & Skrym-Khor (680 D.F.) venha antes dos Conclaves Ocultos (689 D.F.).
    if (a.id === 'canto_5i_valerius_skrym_pacto' && b.id === 'canto_5a_conclaves_ocultos') {
      return -1;
    }
    if (b.id === 'canto_5i_valerius_skrym_pacto' && a.id === 'canto_5a_conclaves_ocultos') {
      return 1;
    }

    return (a.parallelCode || '').localeCompare(b.parallelCode || '');
  });

  return children.map((child, idx) => {
    const suffix = String.fromCharCode(65 + idx); // A, B, C, D...
    const code = `${roman}-${suffix}`;
    return {
      ...child,
      parallelCode: code,
      cantoNumber: `CAPÍTULO ${code}`,
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
 * Nós de referência dos marcos originais dos 7 Cantos.
 */
export const ALL_EPIC_POEM_NODES: EpicPoemNode[] = EPIC_POEM_CANTOS.flatMap((canto) => canto.nodes);

/**
 * Mapa direto por cardId para todos os nós ilustrados da História Principal unificada
 * (incluindo todas as 82 Criaturas Lendárias e relíquias), usando ALL_EPIC_POEM_NODES como fallback.
 */
export const EPIC_POEM_CREATURE_NODES_BY_CARD_ID: Record<string, EpicPoemNode> = (() => {
  const map: Record<string, EpicPoemNode> = {};

  for (const node of ALL_EPIC_POEM_NODES) {
    if (node.cardId && (!map[node.cardId] || node.kind === 'creature')) {
      map[node.cardId] = node;
    }
  }

  for (const node of ALL_PARALLEL_POEM_NODES) {
    if (!node.cardId || node.hideCardArt) continue;
    const existing = map[node.cardId];
    const isFromMainParallel = ALL_PARALLEL_POEM_NODES.includes(existing);
    if (!existing || !isFromMainParallel || (node.kind === 'creature' && existing.kind !== 'creature')) {
      map[node.cardId] = node;
    }
  }

  return map;
})();

/**
 * Contagem total de capítulos, nós, estrofes e versos da História Principal Unificada de Vaeloria.
 */
export const EPIC_POEM_STATS = {
  totalCantos: EPIC_POEM_CANTOS.length,
  totalChapters: PARALLEL_EPIC_POEM_CANTOS.length,
  totalNodes: ALL_PARALLEL_POEM_NODES.length,
  totalLegendaryCreatures: new Set(
    ALL_PARALLEL_POEM_NODES.filter((n) => n.kind === 'creature' && !n.hideCardArt).map((n) => n.cardId)
  ).size,
  totalStanzas: ALL_PARALLEL_POEM_NODES.reduce((sum, n) => sum + n.stanzas.length, 0),
  totalVerses: ALL_PARALLEL_POEM_NODES.reduce(
    (sum, n) => sum + n.stanzas.reduce((sSum, st) => sSum + st.length, 0),
    0
  ),
};
