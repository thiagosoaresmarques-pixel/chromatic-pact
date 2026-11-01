// ============================================================================
// GRANDE CAMPANHA GEOGRÁFICA & DOMINAÇÃO CROMÁTICA DE VAELORIA
// 276 Confrontos Individuais 1x1 (100 Soberanos Lendários + 176 Comandantes Raros = 276 Criaturas)
// Grafo Geográfico Passo a Passo + Bloqueio de Zona de Controle + Conversão Cromática
// ============================================================================

import { BiomeRealmId, CampaignBoss, Domain } from '../types/game';
import {
  BICOLOR_ARCHETYPE_MASTERY,
  BicolorArchetypeId,
  MONOCOLOR_ARCHETYPE_MASTERY,
  MonocolorArchetypeId,
  POLYCOLOR_ARCHETYPE_MASTERY,
  PolycolorArchetypeId,
  buildIndividualSovereignSignatureDeck,
  resolveCampaignBossGraduatedSetup,
} from './aiMonocolorMastery';
import type { UnifiedChampionId } from './aiUnifiedTournamentData';
import {
  VAELORIA_REGIONAL_MAPS,
  VaeloriaMapScope,
  VaeloriaRealmId,
} from './vaeloriaMultimapData';

export type SovereignBannerDomain = Exclude<Domain, 'neutral'>;

export interface GrandCampaignEncounterNode {
  id: string;
  stage: number;
  submapId: VaeloriaRealmId;
  submapOrder: number;
  /** Coordenada X (0..100%) calibrada em terra firme no sub-mapa */
  rx: number;
  /** Coordenada Y (0..100%) calibrada em terra firme no sub-mapa */
  ry: number;
  /** Hub correspondente no Mapa Continental */
  worldX: number;
  worldY: number;
  landmarkName: string;
  tier: 1 | 2 | 3 | 4 | 5;
  encounterKind: 'rare_garrison' | 'legendary_sovereign' | 'throne_apex';
  isEntryNode: boolean;
  isThroneNode: boolean;
  unlocksSubmaps: VaeloriaRealmId[];
  boss: CampaignBoss;
}

export interface GrandCampaignSubmapGraph {
  submapId: VaeloriaRealmId;
  domain: Domain;
  worldHub: { x: number; y: number };
  worldPolygon: Array<[number, number]>;
  entryPos: { x: number; y: number };
  entryNodeIds: string[];
  throneNodeId: string;
  nodeIds: string[];
  edges: Array<[string, string]>;
  portalGatekeepers: Record<string, string>;
}

export interface WorldSubmapRoadEdge {
  from: VaeloriaRealmId;
  to: VaeloriaRealmId;
  kind: 'border_ring' | 'deep_unlock' | 'axial_bridge';
}

export const STARTING_REALM_BY_SOVEREIGN_DOMAIN: Record<SovereignBannerDomain, VaeloriaRealmId> = {
  green: 'veridia',
  red: 'pyros',
  blue: 'vortex',
  purple: 'eclipse',
  gold: 'solaria',
};

export const SOVEREIGN_BANNER_PALETTE: Record<
  SovereignBannerDomain,
  {
    name: string;
    realmLabel: string;
    hex: string;
    fillRgba: string;
    borderRgba: string;
    tintFilterRgba: string;
  }
> = {
  green: {
    name: 'Esmeralda de Veridia',
    realmLabel: 'Veridia',
    hex: '#10b981',
    fillRgba: 'rgba(16, 185, 129, 0.34)',
    borderRgba: 'rgba(52, 211, 153, 0.85)',
    tintFilterRgba: 'rgba(16, 185, 129, 0.24)',
  },
  red: {
    name: 'Chama Imperial de Pyros',
    realmLabel: 'Pyros',
    hex: '#ef4444',
    fillRgba: 'rgba(239, 68, 68, 0.34)',
    borderRgba: 'rgba(248, 113, 113, 0.85)',
    tintFilterRgba: 'rgba(239, 68, 68, 0.24)',
  },
  blue: {
    name: 'Safira Polar de Vórtex',
    realmLabel: 'Vórtex',
    hex: '#38bdf8',
    fillRgba: 'rgba(56, 189, 248, 0.34)',
    borderRgba: 'rgba(125, 211, 252, 0.85)',
    tintFilterRgba: 'rgba(56, 189, 248, 0.24)',
  },
  purple: {
    name: 'Obsidiana do Eclipse',
    realmLabel: 'Eclipse',
    hex: '#a855f7',
    fillRgba: 'rgba(168, 85, 247, 0.34)',
    borderRgba: 'rgba(192, 132, 252, 0.85)',
    tintFilterRgba: 'rgba(168, 85, 247, 0.24)',
  },
  gold: {
    name: 'Alvorada de Solária',
    realmLabel: 'Solária',
    hex: '#eab308',
    fillRgba: 'rgba(234, 179, 8, 0.34)',
    borderRgba: 'rgba(250, 204, 21, 0.85)',
    tintFilterRgba: 'rgba(234, 179, 8, 0.22)',
  },
};

export const WORLD_SUBMAP_EDGES: WorldSubmapRoadEdge[] = [
  {
    "from": "veridia",
    "to": "eclipse",
    "kind": "border_ring"
  },
  {
    "from": "eclipse",
    "to": "pyros",
    "kind": "border_ring"
  },
  {
    "from": "pyros",
    "to": "vortex",
    "kind": "border_ring"
  },
  {
    "from": "vortex",
    "to": "solaria",
    "kind": "border_ring"
  },
  {
    "from": "solaria",
    "to": "veridia",
    "kind": "border_ring"
  },
  {
    "from": "veridia",
    "to": "deep_roots",
    "kind": "deep_unlock"
  },
  {
    "from": "deep_roots",
    "to": "capital_veridia",
    "kind": "deep_unlock"
  },
  {
    "from": "pyros",
    "to": "underforge",
    "kind": "deep_unlock"
  },
  {
    "from": "underforge",
    "to": "capital_pyros",
    "kind": "deep_unlock"
  },
  {
    "from": "vortex",
    "to": "sea_of_storms",
    "kind": "deep_unlock"
  },
  {
    "from": "vortex",
    "to": "astral_isles",
    "kind": "deep_unlock"
  },
  {
    "from": "sea_of_storms",
    "to": "astral_isles",
    "kind": "deep_unlock"
  },
  {
    "from": "astral_isles",
    "to": "capital_vortex",
    "kind": "deep_unlock"
  },
  {
    "from": "eclipse",
    "to": "sunken_abyss",
    "kind": "deep_unlock"
  },
  {
    "from": "sunken_abyss",
    "to": "capital_eclipse",
    "kind": "deep_unlock"
  },
  {
    "from": "solaria",
    "to": "boreal_skyway",
    "kind": "deep_unlock"
  },
  {
    "from": "solaria",
    "to": "sky_bastions",
    "kind": "deep_unlock"
  },
  {
    "from": "boreal_skyway",
    "to": "sky_bastions",
    "kind": "deep_unlock"
  },
  {
    "from": "sky_bastions",
    "to": "capital_solaria",
    "kind": "deep_unlock"
  },
  {
    "from": "veridia",
    "to": "matrix",
    "kind": "axial_bridge"
  },
  {
    "from": "eclipse",
    "to": "matrix",
    "kind": "axial_bridge"
  },
  {
    "from": "pyros",
    "to": "matrix",
    "kind": "axial_bridge"
  },
  {
    "from": "solaria",
    "to": "matrix",
    "kind": "axial_bridge"
  },
  {
    "from": "matrix",
    "to": "prismatic_crater",
    "kind": "deep_unlock"
  },
  {
    "from": "prismatic_crater",
    "to": "capital_axial",
    "kind": "deep_unlock"
  }
];

export const GRAND_CAMPAIGN_SUBMAP_GRAPHS: Record<VaeloriaRealmId, GrandCampaignSubmapGraph> = {
  "veridia": {
    "submapId": "veridia",
    "domain": "green",
    "worldHub": {
      "x": 31,
      "y": 81.5
    },
    "worldPolygon": [
      [
        16,
        69
      ],
      [
        38,
        67
      ],
      [
        45,
        73
      ],
      [
        44,
        96
      ],
      [
        22,
        94
      ],
      [
        15,
        83
      ]
    ],
    "entryPos": {
      "x": 14,
      "y": 80
    },
    "entryNodeIds": [
      "gc_green_t1_veridia_01",
      "gc_green_t1_veridia_02"
    ],
    "throneNodeId": "gc_green_t3_veridia_14",
    "nodeIds": [
      "gc_green_t1_veridia_01",
      "gc_green_t1_veridia_01_b",
      "gc_green_t1_veridia_02",
      "gc_green_t1_veridia_02_b",
      "gc_green_t1_veridia_03",
      "gc_green_t1_veridia_03_b",
      "gc_green_t1_veridia_04",
      "gc_green_t1_veridia_04_b",
      "gc_green_t2_veridia_05",
      "gc_green_t2_veridia_05_b",
      "gc_green_t2_veridia_06",
      "gc_green_t2_veridia_06_b",
      "gc_green_t2_veridia_07",
      "gc_green_t2_veridia_07_b",
      "gc_green_t2_veridia_08",
      "gc_green_t2_veridia_08_b",
      "gc_green_t2_veridia_09",
      "gc_green_t2_veridia_09_b",
      "gc_green_t2_veridia_10",
      "gc_green_t2_veridia_10_b",
      "gc_green_t3_veridia_11",
      "gc_green_t3_veridia_12",
      "gc_green_t3_veridia_13",
      "gc_green_t3_veridia_14"
    ],
    "edges": [
      [
        "gc_green_t1_veridia_01",
        "gc_green_t1_veridia_01_b"
      ],
      [
        "gc_green_t1_veridia_02",
        "gc_green_t1_veridia_02_b"
      ],
      [
        "gc_green_t1_veridia_03",
        "gc_green_t1_veridia_03_b"
      ],
      [
        "gc_green_t1_veridia_04",
        "gc_green_t1_veridia_04_b"
      ],
      [
        "gc_green_t2_veridia_05",
        "gc_green_t2_veridia_05_b"
      ],
      [
        "gc_green_t2_veridia_06",
        "gc_green_t2_veridia_06_b"
      ],
      [
        "gc_green_t2_veridia_07",
        "gc_green_t2_veridia_07_b"
      ],
      [
        "gc_green_t2_veridia_08",
        "gc_green_t2_veridia_08_b"
      ],
      [
        "gc_green_t2_veridia_09",
        "gc_green_t2_veridia_09_b"
      ],
      [
        "gc_green_t2_veridia_10",
        "gc_green_t2_veridia_10_b"
      ],
      [
        "gc_green_t1_veridia_01_b",
        "gc_green_t1_veridia_02"
      ],
      [
        "gc_green_t1_veridia_01_b",
        "gc_green_t1_veridia_03"
      ],
      [
        "gc_green_t1_veridia_01_b",
        "gc_green_t1_veridia_04"
      ],
      [
        "gc_green_t1_veridia_02_b",
        "gc_green_t2_veridia_05"
      ],
      [
        "gc_green_t1_veridia_03_b",
        "gc_green_t2_veridia_06"
      ],
      [
        "gc_green_t2_veridia_05_b",
        "gc_green_t2_veridia_07"
      ],
      [
        "gc_green_t2_veridia_06_b",
        "gc_green_t2_veridia_08"
      ],
      [
        "gc_green_t1_veridia_04_b",
        "gc_green_t2_veridia_09"
      ],
      [
        "gc_green_t2_veridia_08_b",
        "gc_green_t2_veridia_10"
      ],
      [
        "gc_green_t2_veridia_07_b",
        "gc_green_t3_veridia_11"
      ],
      [
        "gc_green_t2_veridia_07_b",
        "gc_green_t3_veridia_12"
      ],
      [
        "gc_green_t2_veridia_10_b",
        "gc_green_t3_veridia_13"
      ],
      [
        "gc_green_t3_veridia_12",
        "gc_green_t3_veridia_14"
      ],
      [
        "gc_green_t2_veridia_09_b",
        "gc_green_t3_veridia_14"
      ],
      [
        "gc_green_t3_veridia_11",
        "gc_green_t3_veridia_12"
      ],
      [
        "gc_green_t3_veridia_13",
        "gc_green_t3_veridia_14"
      ]
    ],
    "portalGatekeepers": {
      "matrix": "gc_green_t3_veridia_14",
      "eclipse": "gc_green_t3_veridia_11",
      "solaria": "gc_green_t3_veridia_13",
      "deep_roots": "gc_green_t3_veridia_14",
      "capital_veridia": "gc_green_t3_veridia_14",
      "sea_of_storms": "gc_green_t2_veridia_10_b"
    }
  },
  "deep_roots": {
    "submapId": "deep_roots",
    "domain": "green",
    "worldHub": {
      "x": 69.5,
      "y": 81.5
    },
    "worldPolygon": [
      [
        56,
        67
      ],
      [
        86,
        69
      ],
      [
        88,
        83
      ],
      [
        77,
        94
      ],
      [
        56,
        96
      ],
      [
        55,
        73
      ]
    ],
    "entryPos": {
      "x": 15,
      "y": 24
    },
    "entryNodeIds": [
      "gc_green_t2_deep_roots_01",
      "gc_green_t2_deep_roots_02"
    ],
    "throneNodeId": "gc_green_t4_deep_roots_13",
    "nodeIds": [
      "gc_green_t2_deep_roots_01",
      "gc_green_t2_deep_roots_01_b",
      "gc_green_t2_deep_roots_02",
      "gc_green_t2_deep_roots_02_b",
      "gc_green_t2_deep_roots_03",
      "gc_green_t2_deep_roots_03_b",
      "gc_green_t3_deep_roots_04",
      "gc_green_t3_deep_roots_04_b",
      "gc_green_t3_deep_roots_05",
      "gc_green_t3_deep_roots_05_b",
      "gc_green_t3_deep_roots_06",
      "gc_green_t3_deep_roots_06_b",
      "gc_green_t3_deep_roots_07",
      "gc_green_t3_deep_roots_07_b",
      "gc_green_t3_deep_roots_08",
      "gc_green_t3_deep_roots_09",
      "gc_green_t4_deep_roots_10",
      "gc_green_t4_deep_roots_11",
      "gc_green_t4_deep_roots_12",
      "gc_green_t4_deep_roots_13"
    ],
    "edges": [
      [
        "gc_green_t2_deep_roots_01",
        "gc_green_t2_deep_roots_01_b"
      ],
      [
        "gc_green_t2_deep_roots_02",
        "gc_green_t2_deep_roots_02_b"
      ],
      [
        "gc_green_t2_deep_roots_03",
        "gc_green_t2_deep_roots_03_b"
      ],
      [
        "gc_green_t3_deep_roots_04",
        "gc_green_t3_deep_roots_04_b"
      ],
      [
        "gc_green_t3_deep_roots_05",
        "gc_green_t3_deep_roots_05_b"
      ],
      [
        "gc_green_t3_deep_roots_06",
        "gc_green_t3_deep_roots_06_b"
      ],
      [
        "gc_green_t3_deep_roots_07",
        "gc_green_t3_deep_roots_07_b"
      ],
      [
        "gc_green_t2_deep_roots_01_b",
        "gc_green_t2_deep_roots_02"
      ],
      [
        "gc_green_t2_deep_roots_01_b",
        "gc_green_t2_deep_roots_03"
      ],
      [
        "gc_green_t2_deep_roots_03_b",
        "gc_green_t3_deep_roots_04"
      ],
      [
        "gc_green_t2_deep_roots_02_b",
        "gc_green_t3_deep_roots_05"
      ],
      [
        "gc_green_t2_deep_roots_03_b",
        "gc_green_t3_deep_roots_06"
      ],
      [
        "gc_green_t3_deep_roots_06_b",
        "gc_green_t3_deep_roots_07"
      ],
      [
        "gc_green_t3_deep_roots_04_b",
        "gc_green_t3_deep_roots_08"
      ],
      [
        "gc_green_t3_deep_roots_05_b",
        "gc_green_t3_deep_roots_09"
      ],
      [
        "gc_green_t3_deep_roots_07_b",
        "gc_green_t4_deep_roots_10"
      ],
      [
        "gc_green_t3_deep_roots_09",
        "gc_green_t4_deep_roots_11"
      ],
      [
        "gc_green_t4_deep_roots_11",
        "gc_green_t4_deep_roots_12"
      ],
      [
        "gc_green_t3_deep_roots_08",
        "gc_green_t4_deep_roots_13"
      ],
      [
        "gc_green_t4_deep_roots_10",
        "gc_green_t4_deep_roots_13"
      ],
      [
        "gc_green_t4_deep_roots_12",
        "gc_green_t4_deep_roots_13"
      ]
    ],
    "portalGatekeepers": {
      "veridia": "gc_green_t3_deep_roots_09",
      "prismatic_crater": "gc_green_t2_deep_roots_03_b",
      "sunken_abyss": "gc_green_t3_deep_roots_06_b",
      "capital_veridia": "gc_green_t4_deep_roots_13"
    }
  },
  "capital_veridia": {
    "submapId": "capital_veridia",
    "domain": "green",
    "worldHub": {
      "x": 50,
      "y": 76.5
    },
    "worldPolygon": [
      [
        38,
        67
      ],
      [
        56,
        67
      ],
      [
        55,
        73
      ],
      [
        56,
        96
      ],
      [
        44,
        96
      ],
      [
        45,
        73
      ]
    ],
    "entryPos": {
      "x": 50,
      "y": 84
    },
    "entryNodeIds": [
      "gc_green_t3_capital_veridia_01",
      "gc_green_t3_capital_veridia_02"
    ],
    "throneNodeId": "gc_green_t5_capital_veridia_13",
    "nodeIds": [
      "gc_green_t3_capital_veridia_01",
      "gc_green_t3_capital_veridia_01_b",
      "gc_green_t3_capital_veridia_02",
      "gc_green_t3_capital_veridia_02_b",
      "gc_green_t3_capital_veridia_03",
      "gc_green_t3_capital_veridia_03_b",
      "gc_green_t4_capital_veridia_04",
      "gc_green_t4_capital_veridia_04_b",
      "gc_green_t4_capital_veridia_05",
      "gc_green_t4_capital_veridia_06",
      "gc_green_t4_capital_veridia_07",
      "gc_green_t4_capital_veridia_08",
      "gc_green_t4_capital_veridia_09",
      "gc_green_t5_capital_veridia_10",
      "gc_green_t5_capital_veridia_11",
      "gc_green_t5_capital_veridia_12",
      "gc_green_t5_capital_veridia_13"
    ],
    "edges": [
      [
        "gc_green_t3_capital_veridia_01",
        "gc_green_t3_capital_veridia_01_b"
      ],
      [
        "gc_green_t3_capital_veridia_02",
        "gc_green_t3_capital_veridia_02_b"
      ],
      [
        "gc_green_t3_capital_veridia_03",
        "gc_green_t3_capital_veridia_03_b"
      ],
      [
        "gc_green_t4_capital_veridia_04",
        "gc_green_t4_capital_veridia_04_b"
      ],
      [
        "gc_green_t3_capital_veridia_01_b",
        "gc_green_t3_capital_veridia_02"
      ],
      [
        "gc_green_t3_capital_veridia_01_b",
        "gc_green_t3_capital_veridia_03"
      ],
      [
        "gc_green_t3_capital_veridia_02_b",
        "gc_green_t4_capital_veridia_04"
      ],
      [
        "gc_green_t3_capital_veridia_03_b",
        "gc_green_t4_capital_veridia_05"
      ],
      [
        "gc_green_t3_capital_veridia_01_b",
        "gc_green_t4_capital_veridia_06"
      ],
      [
        "gc_green_t4_capital_veridia_06",
        "gc_green_t4_capital_veridia_07"
      ],
      [
        "gc_green_t4_capital_veridia_06",
        "gc_green_t4_capital_veridia_08"
      ],
      [
        "gc_green_t4_capital_veridia_07",
        "gc_green_t4_capital_veridia_09"
      ],
      [
        "gc_green_t4_capital_veridia_08",
        "gc_green_t5_capital_veridia_10"
      ],
      [
        "gc_green_t4_capital_veridia_09",
        "gc_green_t5_capital_veridia_11"
      ],
      [
        "gc_green_t5_capital_veridia_10",
        "gc_green_t5_capital_veridia_12"
      ],
      [
        "gc_green_t4_capital_veridia_06",
        "gc_green_t5_capital_veridia_13"
      ],
      [
        "gc_green_t5_capital_veridia_12",
        "gc_green_t5_capital_veridia_13"
      ],
      [
        "gc_green_t4_capital_veridia_04_b",
        "gc_green_t4_capital_veridia_09"
      ],
      [
        "gc_green_t4_capital_veridia_05",
        "gc_green_t4_capital_veridia_08"
      ],
      [
        "gc_green_t5_capital_veridia_11",
        "gc_green_t5_capital_veridia_13"
      ]
    ],
    "portalGatekeepers": {
      "veridia": "gc_green_t5_capital_veridia_12",
      "deep_roots": "gc_green_t4_capital_veridia_06",
      "sea_of_storms": "gc_green_t3_capital_veridia_03_b"
    }
  },
  "pyros": {
    "submapId": "pyros",
    "domain": "red",
    "worldHub": {
      "x": 39.5,
      "y": 25.5
    },
    "worldPolygon": [
      [
        27,
        18
      ],
      [
        51,
        16
      ],
      [
        50,
        30
      ],
      [
        45,
        39
      ],
      [
        33,
        40
      ],
      [
        26,
        28
      ]
    ],
    "entryPos": {
      "x": 14,
      "y": 74
    },
    "entryNodeIds": [
      "gc_red_t1_pyros_01",
      "gc_red_t1_pyros_02"
    ],
    "throneNodeId": "gc_red_t3_pyros_11",
    "nodeIds": [
      "gc_red_t1_pyros_01",
      "gc_red_t1_pyros_01_b",
      "gc_red_t1_pyros_02",
      "gc_red_t1_pyros_02_b",
      "gc_red_t1_pyros_03",
      "gc_red_t1_pyros_03_b",
      "gc_red_t2_pyros_04",
      "gc_red_t2_pyros_04_b",
      "gc_red_t2_pyros_05",
      "gc_red_t2_pyros_05_b",
      "gc_red_t2_pyros_06",
      "gc_red_t2_pyros_06_b",
      "gc_red_t2_pyros_07",
      "gc_red_t2_pyros_07_b",
      "gc_red_t2_pyros_08",
      "gc_red_t2_pyros_08_b",
      "gc_red_t3_pyros_09",
      "gc_red_t3_pyros_10",
      "gc_red_t3_pyros_11"
    ],
    "edges": [
      [
        "gc_red_t1_pyros_01",
        "gc_red_t1_pyros_01_b"
      ],
      [
        "gc_red_t1_pyros_02",
        "gc_red_t1_pyros_02_b"
      ],
      [
        "gc_red_t1_pyros_03",
        "gc_red_t1_pyros_03_b"
      ],
      [
        "gc_red_t2_pyros_04",
        "gc_red_t2_pyros_04_b"
      ],
      [
        "gc_red_t2_pyros_05",
        "gc_red_t2_pyros_05_b"
      ],
      [
        "gc_red_t2_pyros_06",
        "gc_red_t2_pyros_06_b"
      ],
      [
        "gc_red_t2_pyros_07",
        "gc_red_t2_pyros_07_b"
      ],
      [
        "gc_red_t2_pyros_08",
        "gc_red_t2_pyros_08_b"
      ],
      [
        "gc_red_t1_pyros_01_b",
        "gc_red_t1_pyros_02"
      ],
      [
        "gc_red_t1_pyros_01_b",
        "gc_red_t1_pyros_03"
      ],
      [
        "gc_red_t1_pyros_03_b",
        "gc_red_t2_pyros_04"
      ],
      [
        "gc_red_t1_pyros_03_b",
        "gc_red_t2_pyros_05"
      ],
      [
        "gc_red_t2_pyros_05_b",
        "gc_red_t2_pyros_06"
      ],
      [
        "gc_red_t2_pyros_05_b",
        "gc_red_t2_pyros_07"
      ],
      [
        "gc_red_t2_pyros_04_b",
        "gc_red_t2_pyros_08"
      ],
      [
        "gc_red_t2_pyros_07_b",
        "gc_red_t3_pyros_09"
      ],
      [
        "gc_red_t3_pyros_09",
        "gc_red_t3_pyros_10"
      ],
      [
        "gc_red_t2_pyros_07_b",
        "gc_red_t3_pyros_11"
      ],
      [
        "gc_red_t3_pyros_09",
        "gc_red_t3_pyros_11"
      ],
      [
        "gc_red_t1_pyros_02_b",
        "gc_red_t2_pyros_05"
      ],
      [
        "gc_red_t2_pyros_06_b",
        "gc_red_t2_pyros_07"
      ],
      [
        "gc_red_t2_pyros_08_b",
        "gc_red_t3_pyros_11"
      ],
      [
        "gc_red_t3_pyros_10",
        "gc_red_t3_pyros_11"
      ]
    ],
    "portalGatekeepers": {
      "vortex": "gc_red_t2_pyros_08_b",
      "matrix": "gc_red_t3_pyros_11",
      "eclipse": "gc_red_t1_pyros_01",
      "solaria": "gc_red_t3_pyros_09",
      "underforge": "gc_red_t3_pyros_11",
      "capital_pyros": "gc_red_t3_pyros_11",
      "boreal_skyway": "gc_red_t3_pyros_10"
    }
  },
  "underforge": {
    "submapId": "underforge",
    "domain": "red",
    "worldHub": {
      "x": 53.5,
      "y": 32.8
    },
    "worldPolygon": [
      [
        45,
        39
      ],
      [
        50,
        30
      ],
      [
        63,
        31
      ],
      [
        64,
        40
      ]
    ],
    "entryPos": {
      "x": 16,
      "y": 26
    },
    "entryNodeIds": [
      "gc_red_t2_underforge_01",
      "gc_red_t2_underforge_02"
    ],
    "throneNodeId": "gc_red_t4_underforge_10",
    "nodeIds": [
      "gc_red_t2_underforge_01",
      "gc_red_t2_underforge_01_b",
      "gc_red_t2_underforge_02",
      "gc_red_t2_underforge_02_b",
      "gc_red_t2_underforge_03",
      "gc_red_t2_underforge_03_b",
      "gc_red_t3_underforge_04",
      "gc_red_t3_underforge_04_b",
      "gc_red_t3_underforge_05",
      "gc_red_t3_underforge_05_b",
      "gc_red_t3_underforge_06",
      "gc_red_t3_underforge_07",
      "gc_red_t4_underforge_08",
      "gc_red_t4_underforge_09",
      "gc_red_t4_underforge_10"
    ],
    "edges": [
      [
        "gc_red_t2_underforge_01",
        "gc_red_t2_underforge_01_b"
      ],
      [
        "gc_red_t2_underforge_02",
        "gc_red_t2_underforge_02_b"
      ],
      [
        "gc_red_t2_underforge_03",
        "gc_red_t2_underforge_03_b"
      ],
      [
        "gc_red_t3_underforge_04",
        "gc_red_t3_underforge_04_b"
      ],
      [
        "gc_red_t3_underforge_05",
        "gc_red_t3_underforge_05_b"
      ],
      [
        "gc_red_t2_underforge_01_b",
        "gc_red_t2_underforge_02"
      ],
      [
        "gc_red_t2_underforge_02_b",
        "gc_red_t2_underforge_03"
      ],
      [
        "gc_red_t2_underforge_02_b",
        "gc_red_t3_underforge_04"
      ],
      [
        "gc_red_t3_underforge_04_b",
        "gc_red_t3_underforge_05"
      ],
      [
        "gc_red_t3_underforge_04_b",
        "gc_red_t3_underforge_06"
      ],
      [
        "gc_red_t2_underforge_03_b",
        "gc_red_t3_underforge_07"
      ],
      [
        "gc_red_t3_underforge_06",
        "gc_red_t4_underforge_08"
      ],
      [
        "gc_red_t4_underforge_08",
        "gc_red_t4_underforge_09"
      ],
      [
        "gc_red_t4_underforge_08",
        "gc_red_t4_underforge_10"
      ],
      [
        "gc_red_t3_underforge_05_b",
        "gc_red_t4_underforge_10"
      ],
      [
        "gc_red_t3_underforge_07",
        "gc_red_t4_underforge_10"
      ],
      [
        "gc_red_t4_underforge_09",
        "gc_red_t4_underforge_10"
      ]
    ],
    "portalGatekeepers": {
      "pyros": "gc_red_t4_underforge_08",
      "prismatic_crater": "gc_red_t3_underforge_07",
      "sky_bastions": "gc_red_t4_underforge_09",
      "capital_pyros": "gc_red_t4_underforge_10"
    }
  },
  "capital_pyros": {
    "submapId": "capital_pyros",
    "domain": "red",
    "worldHub": {
      "x": 61,
      "y": 22
    },
    "worldPolygon": [
      [
        51,
        16
      ],
      [
        72,
        20
      ],
      [
        69,
        32
      ],
      [
        63,
        31
      ],
      [
        50,
        30
      ]
    ],
    "entryPos": {
      "x": 47,
      "y": 80
    },
    "entryNodeIds": [
      "gc_red_t3_capital_pyros_01",
      "gc_red_t3_capital_pyros_02"
    ],
    "throneNodeId": "gc_red_t5_capital_pyros_10",
    "nodeIds": [
      "gc_red_t3_capital_pyros_01",
      "gc_red_t3_capital_pyros_01_b",
      "gc_red_t3_capital_pyros_02",
      "gc_red_t3_capital_pyros_03",
      "gc_red_t4_capital_pyros_04",
      "gc_red_t4_capital_pyros_05",
      "gc_red_t4_capital_pyros_06",
      "gc_red_t4_capital_pyros_07",
      "gc_red_t5_capital_pyros_08",
      "gc_red_t5_capital_pyros_09",
      "gc_red_t5_capital_pyros_10"
    ],
    "edges": [
      [
        "gc_red_t3_capital_pyros_01",
        "gc_red_t3_capital_pyros_01_b"
      ],
      [
        "gc_red_t3_capital_pyros_01_b",
        "gc_red_t3_capital_pyros_02"
      ],
      [
        "gc_red_t3_capital_pyros_02",
        "gc_red_t3_capital_pyros_03"
      ],
      [
        "gc_red_t3_capital_pyros_03",
        "gc_red_t4_capital_pyros_04"
      ],
      [
        "gc_red_t3_capital_pyros_02",
        "gc_red_t4_capital_pyros_05"
      ],
      [
        "gc_red_t3_capital_pyros_03",
        "gc_red_t4_capital_pyros_06"
      ],
      [
        "gc_red_t4_capital_pyros_06",
        "gc_red_t4_capital_pyros_07"
      ],
      [
        "gc_red_t4_capital_pyros_04",
        "gc_red_t5_capital_pyros_08"
      ],
      [
        "gc_red_t4_capital_pyros_07",
        "gc_red_t5_capital_pyros_09"
      ],
      [
        "gc_red_t5_capital_pyros_09",
        "gc_red_t5_capital_pyros_10"
      ],
      [
        "gc_red_t4_capital_pyros_06",
        "gc_red_t5_capital_pyros_10"
      ],
      [
        "gc_red_t4_capital_pyros_05",
        "gc_red_t4_capital_pyros_06"
      ],
      [
        "gc_red_t5_capital_pyros_08",
        "gc_red_t5_capital_pyros_09"
      ]
    ],
    "portalGatekeepers": {
      "pyros": "gc_red_t3_capital_pyros_01",
      "underforge": "gc_red_t3_capital_pyros_03",
      "boreal_skyway": "gc_red_t4_capital_pyros_07"
    }
  },
  "vortex": {
    "submapId": "vortex",
    "domain": "blue",
    "worldHub": {
      "x": 41.5,
      "y": 11.5
    },
    "worldPolygon": [
      [
        31,
        2
      ],
      [
        46,
        2
      ],
      [
        46,
        17
      ],
      [
        31,
        18
      ]
    ],
    "entryPos": {
      "x": 50,
      "y": 82
    },
    "entryNodeIds": [
      "gc_blue_t1_vortex_01",
      "gc_blue_t1_vortex_02"
    ],
    "throneNodeId": "gc_blue_t3_vortex_08",
    "nodeIds": [
      "gc_blue_t1_vortex_01",
      "gc_blue_t1_vortex_01_b",
      "gc_blue_t1_vortex_02",
      "gc_blue_t1_vortex_02_b",
      "gc_blue_t2_vortex_03",
      "gc_blue_t2_vortex_03_b",
      "gc_blue_t2_vortex_04",
      "gc_blue_t2_vortex_04_b",
      "gc_blue_t2_vortex_05",
      "gc_blue_t2_vortex_05_b",
      "gc_blue_t2_vortex_06",
      "gc_blue_t2_vortex_06_b",
      "gc_blue_t3_vortex_07",
      "gc_blue_t3_vortex_08"
    ],
    "edges": [
      [
        "gc_blue_t1_vortex_01",
        "gc_blue_t1_vortex_01_b"
      ],
      [
        "gc_blue_t1_vortex_02",
        "gc_blue_t1_vortex_02_b"
      ],
      [
        "gc_blue_t2_vortex_03",
        "gc_blue_t2_vortex_03_b"
      ],
      [
        "gc_blue_t2_vortex_04",
        "gc_blue_t2_vortex_04_b"
      ],
      [
        "gc_blue_t2_vortex_05",
        "gc_blue_t2_vortex_05_b"
      ],
      [
        "gc_blue_t2_vortex_06",
        "gc_blue_t2_vortex_06_b"
      ],
      [
        "gc_blue_t1_vortex_01_b",
        "gc_blue_t1_vortex_02"
      ],
      [
        "gc_blue_t1_vortex_01_b",
        "gc_blue_t2_vortex_03"
      ],
      [
        "gc_blue_t1_vortex_02_b",
        "gc_blue_t2_vortex_04"
      ],
      [
        "gc_blue_t1_vortex_02_b",
        "gc_blue_t2_vortex_05"
      ],
      [
        "gc_blue_t2_vortex_05_b",
        "gc_blue_t2_vortex_06"
      ],
      [
        "gc_blue_t2_vortex_04_b",
        "gc_blue_t3_vortex_07"
      ],
      [
        "gc_blue_t2_vortex_05_b",
        "gc_blue_t3_vortex_08"
      ],
      [
        "gc_blue_t3_vortex_07",
        "gc_blue_t3_vortex_08"
      ],
      [
        "gc_blue_t2_vortex_03_b",
        "gc_blue_t2_vortex_06"
      ],
      [
        "gc_blue_t2_vortex_06_b",
        "gc_blue_t3_vortex_08"
      ]
    ],
    "portalGatekeepers": {
      "pyros": "gc_blue_t1_vortex_01",
      "eclipse": "gc_blue_t1_vortex_02",
      "solaria": "gc_blue_t2_vortex_03_b",
      "astral_isles": "gc_blue_t3_vortex_08",
      "capital_vortex": "gc_blue_t3_vortex_08",
      "sea_of_storms": "gc_blue_t2_vortex_04_b",
      "boreal_skyway": "gc_blue_t2_vortex_06_b"
    }
  },
  "sea_of_storms": {
    "submapId": "sea_of_storms",
    "domain": "blue",
    "worldHub": {
      "x": 77.5,
      "y": 12
    },
    "worldPolygon": [
      [
        65,
        3
      ],
      [
        86,
        5
      ],
      [
        85,
        19
      ],
      [
        65,
        18
      ]
    ],
    "entryPos": {
      "x": 18,
      "y": 76
    },
    "entryNodeIds": [
      "gc_blue_t2_sea_of_storms_01"
    ],
    "throneNodeId": "gc_blue_t3_sea_of_storms_06",
    "nodeIds": [
      "gc_blue_t2_sea_of_storms_01",
      "gc_blue_t2_sea_of_storms_01_b",
      "gc_blue_t2_sea_of_storms_02",
      "gc_blue_t2_sea_of_storms_02_b",
      "gc_blue_t2_sea_of_storms_03",
      "gc_blue_t2_sea_of_storms_03_b",
      "gc_blue_t3_sea_of_storms_04",
      "gc_blue_t3_sea_of_storms_04_b",
      "gc_blue_t3_sea_of_storms_05",
      "gc_blue_t3_sea_of_storms_06"
    ],
    "edges": [
      [
        "gc_blue_t2_sea_of_storms_01",
        "gc_blue_t2_sea_of_storms_01_b"
      ],
      [
        "gc_blue_t2_sea_of_storms_02",
        "gc_blue_t2_sea_of_storms_02_b"
      ],
      [
        "gc_blue_t2_sea_of_storms_03",
        "gc_blue_t2_sea_of_storms_03_b"
      ],
      [
        "gc_blue_t3_sea_of_storms_04",
        "gc_blue_t3_sea_of_storms_04_b"
      ],
      [
        "gc_blue_t2_sea_of_storms_01_b",
        "gc_blue_t2_sea_of_storms_02"
      ],
      [
        "gc_blue_t2_sea_of_storms_01_b",
        "gc_blue_t2_sea_of_storms_03"
      ],
      [
        "gc_blue_t2_sea_of_storms_03_b",
        "gc_blue_t3_sea_of_storms_04"
      ],
      [
        "gc_blue_t2_sea_of_storms_03_b",
        "gc_blue_t3_sea_of_storms_05"
      ],
      [
        "gc_blue_t3_sea_of_storms_05",
        "gc_blue_t3_sea_of_storms_06"
      ],
      [
        "gc_blue_t3_sea_of_storms_04_b",
        "gc_blue_t3_sea_of_storms_06"
      ],
      [
        "gc_blue_t2_sea_of_storms_02_b",
        "gc_blue_t3_sea_of_storms_04"
      ]
    ],
    "portalGatekeepers": {
      "vortex": "gc_blue_t3_sea_of_storms_05",
      "eclipse": "gc_blue_t2_sea_of_storms_03_b",
      "veridia": "gc_blue_t2_sea_of_storms_02_b",
      "solaria": "gc_blue_t3_sea_of_storms_06",
      "sunken_abyss": "gc_blue_t3_sea_of_storms_06",
      "astral_isles": "gc_blue_t3_sea_of_storms_06",
      "capital_vortex": "gc_blue_t3_sea_of_storms_05",
      "capital_eclipse": "gc_blue_t2_sea_of_storms_03_b",
      "capital_veridia": "gc_blue_t2_sea_of_storms_02_b",
      "capital_axial": "gc_blue_t3_sea_of_storms_06"
    }
  },
  "astral_isles": {
    "submapId": "astral_isles",
    "domain": "blue",
    "worldHub": {
      "x": 22.5,
      "y": 11.5
    },
    "worldPolygon": [
      [
        14,
        4
      ],
      [
        31,
        2
      ],
      [
        31,
        18
      ],
      [
        15,
        19
      ]
    ],
    "entryPos": {
      "x": 79,
      "y": 81
    },
    "entryNodeIds": [
      "gc_blue_t3_astral_isles_01",
      "gc_blue_t3_astral_isles_02"
    ],
    "throneNodeId": "gc_blue_t4_astral_isles_07",
    "nodeIds": [
      "gc_blue_t3_astral_isles_01",
      "gc_blue_t3_astral_isles_01_b",
      "gc_blue_t3_astral_isles_02",
      "gc_blue_t3_astral_isles_02_b",
      "gc_blue_t3_astral_isles_03",
      "gc_blue_t4_astral_isles_04",
      "gc_blue_t4_astral_isles_05",
      "gc_blue_t4_astral_isles_06",
      "gc_blue_t4_astral_isles_07"
    ],
    "edges": [
      [
        "gc_blue_t3_astral_isles_01",
        "gc_blue_t3_astral_isles_01_b"
      ],
      [
        "gc_blue_t3_astral_isles_02",
        "gc_blue_t3_astral_isles_02_b"
      ],
      [
        "gc_blue_t3_astral_isles_01_b",
        "gc_blue_t3_astral_isles_02"
      ],
      [
        "gc_blue_t3_astral_isles_01_b",
        "gc_blue_t3_astral_isles_03"
      ],
      [
        "gc_blue_t3_astral_isles_02_b",
        "gc_blue_t4_astral_isles_04"
      ],
      [
        "gc_blue_t3_astral_isles_03",
        "gc_blue_t4_astral_isles_05"
      ],
      [
        "gc_blue_t4_astral_isles_05",
        "gc_blue_t4_astral_isles_06"
      ],
      [
        "gc_blue_t4_astral_isles_06",
        "gc_blue_t4_astral_isles_07"
      ],
      [
        "gc_blue_t4_astral_isles_04",
        "gc_blue_t4_astral_isles_07"
      ]
    ],
    "portalGatekeepers": {
      "vortex": "gc_blue_t3_astral_isles_01",
      "sunken_abyss": "gc_blue_t3_astral_isles_02",
      "sky_bastions": "gc_blue_t4_astral_isles_05",
      "capital_vortex": "gc_blue_t4_astral_isles_07",
      "sea_of_storms": "gc_blue_t3_astral_isles_02",
      "boreal_skyway": "gc_blue_t4_astral_isles_05"
    }
  },
  "capital_vortex": {
    "submapId": "capital_vortex",
    "domain": "blue",
    "worldHub": {
      "x": 52.5,
      "y": 9.5
    },
    "worldPolygon": [
      [
        46,
        2
      ],
      [
        65,
        3
      ],
      [
        65,
        18
      ],
      [
        46,
        17
      ]
    ],
    "entryPos": {
      "x": 50,
      "y": 82
    },
    "entryNodeIds": [
      "gc_blue_t3_capital_vortex_01",
      "gc_blue_t3_capital_vortex_02"
    ],
    "throneNodeId": "gc_blue_t5_capital_vortex_07",
    "nodeIds": [
      "gc_blue_t3_capital_vortex_01",
      "gc_blue_t3_capital_vortex_02",
      "gc_blue_t4_capital_vortex_03",
      "gc_blue_t4_capital_vortex_04",
      "gc_blue_t4_capital_vortex_05",
      "gc_blue_t5_capital_vortex_06",
      "gc_blue_t5_capital_vortex_07"
    ],
    "edges": [
      [
        "gc_blue_t3_capital_vortex_01",
        "gc_blue_t3_capital_vortex_02"
      ],
      [
        "gc_blue_t3_capital_vortex_01",
        "gc_blue_t4_capital_vortex_03"
      ],
      [
        "gc_blue_t3_capital_vortex_02",
        "gc_blue_t4_capital_vortex_04"
      ],
      [
        "gc_blue_t4_capital_vortex_03",
        "gc_blue_t4_capital_vortex_05"
      ],
      [
        "gc_blue_t4_capital_vortex_04",
        "gc_blue_t5_capital_vortex_06"
      ],
      [
        "gc_blue_t5_capital_vortex_06",
        "gc_blue_t5_capital_vortex_07"
      ],
      [
        "gc_blue_t4_capital_vortex_04",
        "gc_blue_t5_capital_vortex_07"
      ],
      [
        "gc_blue_t4_capital_vortex_05",
        "gc_blue_t5_capital_vortex_07"
      ]
    ],
    "portalGatekeepers": {
      "vortex": "gc_blue_t3_capital_vortex_02",
      "astral_isles": "gc_blue_t5_capital_vortex_06",
      "sea_of_storms": "gc_blue_t4_capital_vortex_03"
    }
  },
  "eclipse": {
    "submapId": "eclipse",
    "domain": "purple",
    "worldHub": {
      "x": 24.5,
      "y": 48
    },
    "worldPolygon": [
      [
        18,
        41
      ],
      [
        33,
        40
      ],
      [
        38,
        49
      ],
      [
        35,
        62
      ],
      [
        20,
        57
      ]
    ],
    "entryPos": {
      "x": 84,
      "y": 52
    },
    "entryNodeIds": [
      "gc_purple_t1_eclipse_01",
      "gc_purple_t1_eclipse_02"
    ],
    "throneNodeId": "gc_purple_t3_eclipse_12",
    "nodeIds": [
      "gc_purple_t1_eclipse_01",
      "gc_purple_t1_eclipse_01_b",
      "gc_purple_t1_eclipse_02",
      "gc_purple_t1_eclipse_02_b",
      "gc_purple_t1_eclipse_03",
      "gc_purple_t1_eclipse_03_b",
      "gc_purple_t2_eclipse_04",
      "gc_purple_t2_eclipse_04_b",
      "gc_purple_t2_eclipse_05",
      "gc_purple_t2_eclipse_05_b",
      "gc_purple_t2_eclipse_06",
      "gc_purple_t2_eclipse_06_b",
      "gc_purple_t2_eclipse_07",
      "gc_purple_t2_eclipse_07_b",
      "gc_purple_t2_eclipse_08",
      "gc_purple_t2_eclipse_08_b",
      "gc_purple_t2_eclipse_09",
      "gc_purple_t3_eclipse_10",
      "gc_purple_t3_eclipse_11",
      "gc_purple_t3_eclipse_12"
    ],
    "edges": [
      [
        "gc_purple_t1_eclipse_01",
        "gc_purple_t1_eclipse_01_b"
      ],
      [
        "gc_purple_t1_eclipse_02",
        "gc_purple_t1_eclipse_02_b"
      ],
      [
        "gc_purple_t1_eclipse_03",
        "gc_purple_t1_eclipse_03_b"
      ],
      [
        "gc_purple_t2_eclipse_04",
        "gc_purple_t2_eclipse_04_b"
      ],
      [
        "gc_purple_t2_eclipse_05",
        "gc_purple_t2_eclipse_05_b"
      ],
      [
        "gc_purple_t2_eclipse_06",
        "gc_purple_t2_eclipse_06_b"
      ],
      [
        "gc_purple_t2_eclipse_07",
        "gc_purple_t2_eclipse_07_b"
      ],
      [
        "gc_purple_t2_eclipse_08",
        "gc_purple_t2_eclipse_08_b"
      ],
      [
        "gc_purple_t1_eclipse_01_b",
        "gc_purple_t1_eclipse_02"
      ],
      [
        "gc_purple_t1_eclipse_01_b",
        "gc_purple_t1_eclipse_03"
      ],
      [
        "gc_purple_t1_eclipse_01_b",
        "gc_purple_t2_eclipse_04"
      ],
      [
        "gc_purple_t2_eclipse_04_b",
        "gc_purple_t2_eclipse_05"
      ],
      [
        "gc_purple_t1_eclipse_03_b",
        "gc_purple_t2_eclipse_06"
      ],
      [
        "gc_purple_t2_eclipse_05_b",
        "gc_purple_t2_eclipse_07"
      ],
      [
        "gc_purple_t2_eclipse_07_b",
        "gc_purple_t2_eclipse_08"
      ],
      [
        "gc_purple_t2_eclipse_06_b",
        "gc_purple_t2_eclipse_09"
      ],
      [
        "gc_purple_t2_eclipse_08_b",
        "gc_purple_t3_eclipse_10"
      ],
      [
        "gc_purple_t2_eclipse_09",
        "gc_purple_t3_eclipse_11"
      ],
      [
        "gc_purple_t2_eclipse_08_b",
        "gc_purple_t3_eclipse_12"
      ],
      [
        "gc_purple_t2_eclipse_04_b",
        "gc_purple_t3_eclipse_12"
      ],
      [
        "gc_purple_t1_eclipse_02_b",
        "gc_purple_t1_eclipse_03"
      ],
      [
        "gc_purple_t3_eclipse_10",
        "gc_purple_t3_eclipse_12"
      ],
      [
        "gc_purple_t3_eclipse_11",
        "gc_purple_t3_eclipse_12"
      ]
    ],
    "portalGatekeepers": {
      "matrix": "gc_purple_t3_eclipse_12",
      "pyros": "gc_purple_t2_eclipse_05_b",
      "vortex": "gc_purple_t3_eclipse_10",
      "veridia": "gc_purple_t1_eclipse_02",
      "sunken_abyss": "gc_purple_t3_eclipse_12",
      "capital_eclipse": "gc_purple_t3_eclipse_12",
      "sea_of_storms": "gc_purple_t3_eclipse_11"
    }
  },
  "sunken_abyss": {
    "submapId": "sunken_abyss",
    "domain": "purple",
    "worldHub": {
      "x": 15.5,
      "y": 65.5
    },
    "worldPolygon": [
      [
        4,
        53
      ],
      [
        20,
        57
      ],
      [
        35,
        62
      ],
      [
        38,
        67
      ],
      [
        16,
        69
      ],
      [
        9,
        79
      ],
      [
        4,
        68
      ]
    ],
    "entryPos": {
      "x": 80,
      "y": 24
    },
    "entryNodeIds": [
      "gc_purple_t2_sunken_abyss_01",
      "gc_purple_t2_sunken_abyss_02"
    ],
    "throneNodeId": "gc_purple_t4_sunken_abyss_10",
    "nodeIds": [
      "gc_purple_t2_sunken_abyss_01",
      "gc_purple_t2_sunken_abyss_01_b",
      "gc_purple_t2_sunken_abyss_02",
      "gc_purple_t2_sunken_abyss_02_b",
      "gc_purple_t2_sunken_abyss_03",
      "gc_purple_t2_sunken_abyss_03_b",
      "gc_purple_t3_sunken_abyss_04",
      "gc_purple_t3_sunken_abyss_04_b",
      "gc_purple_t3_sunken_abyss_05",
      "gc_purple_t3_sunken_abyss_05_b",
      "gc_purple_t3_sunken_abyss_06",
      "gc_purple_t3_sunken_abyss_07",
      "gc_purple_t4_sunken_abyss_08",
      "gc_purple_t4_sunken_abyss_09",
      "gc_purple_t4_sunken_abyss_10"
    ],
    "edges": [
      [
        "gc_purple_t2_sunken_abyss_01",
        "gc_purple_t2_sunken_abyss_01_b"
      ],
      [
        "gc_purple_t2_sunken_abyss_02",
        "gc_purple_t2_sunken_abyss_02_b"
      ],
      [
        "gc_purple_t2_sunken_abyss_03",
        "gc_purple_t2_sunken_abyss_03_b"
      ],
      [
        "gc_purple_t3_sunken_abyss_04",
        "gc_purple_t3_sunken_abyss_04_b"
      ],
      [
        "gc_purple_t3_sunken_abyss_05",
        "gc_purple_t3_sunken_abyss_05_b"
      ],
      [
        "gc_purple_t2_sunken_abyss_01_b",
        "gc_purple_t2_sunken_abyss_02"
      ],
      [
        "gc_purple_t2_sunken_abyss_01_b",
        "gc_purple_t2_sunken_abyss_03"
      ],
      [
        "gc_purple_t2_sunken_abyss_01_b",
        "gc_purple_t3_sunken_abyss_04"
      ],
      [
        "gc_purple_t2_sunken_abyss_02_b",
        "gc_purple_t3_sunken_abyss_05"
      ],
      [
        "gc_purple_t2_sunken_abyss_03_b",
        "gc_purple_t3_sunken_abyss_06"
      ],
      [
        "gc_purple_t3_sunken_abyss_05_b",
        "gc_purple_t3_sunken_abyss_07"
      ],
      [
        "gc_purple_t3_sunken_abyss_07",
        "gc_purple_t4_sunken_abyss_08"
      ],
      [
        "gc_purple_t3_sunken_abyss_06",
        "gc_purple_t4_sunken_abyss_09"
      ],
      [
        "gc_purple_t3_sunken_abyss_04_b",
        "gc_purple_t4_sunken_abyss_10"
      ],
      [
        "gc_purple_t3_sunken_abyss_05_b",
        "gc_purple_t4_sunken_abyss_10"
      ],
      [
        "gc_purple_t4_sunken_abyss_08",
        "gc_purple_t4_sunken_abyss_10"
      ],
      [
        "gc_purple_t4_sunken_abyss_09",
        "gc_purple_t4_sunken_abyss_10"
      ]
    ],
    "portalGatekeepers": {
      "eclipse": "gc_purple_t2_sunken_abyss_01",
      "astral_isles": "gc_purple_t3_sunken_abyss_07",
      "deep_roots": "gc_purple_t3_sunken_abyss_06",
      "capital_eclipse": "gc_purple_t4_sunken_abyss_10",
      "sea_of_storms": "gc_purple_t3_sunken_abyss_07"
    }
  },
  "capital_eclipse": {
    "submapId": "capital_eclipse",
    "domain": "purple",
    "worldHub": {
      "x": 16.5,
      "y": 31.5
    },
    "worldPolygon": [
      [
        4,
        28
      ],
      [
        26,
        20
      ],
      [
        33,
        40
      ],
      [
        18,
        41
      ],
      [
        4,
        53
      ]
    ],
    "entryPos": {
      "x": 78,
      "y": 80
    },
    "entryNodeIds": [
      "gc_purple_t3_capital_eclipse_01",
      "gc_purple_t3_capital_eclipse_02"
    ],
    "throneNodeId": "gc_purple_t5_capital_eclipse_10",
    "nodeIds": [
      "gc_purple_t3_capital_eclipse_01",
      "gc_purple_t3_capital_eclipse_01_b",
      "gc_purple_t3_capital_eclipse_02",
      "gc_purple_t3_capital_eclipse_02_b",
      "gc_purple_t3_capital_eclipse_03",
      "gc_purple_t4_capital_eclipse_04",
      "gc_purple_t4_capital_eclipse_05",
      "gc_purple_t4_capital_eclipse_06",
      "gc_purple_t4_capital_eclipse_07",
      "gc_purple_t5_capital_eclipse_08",
      "gc_purple_t5_capital_eclipse_09",
      "gc_purple_t5_capital_eclipse_10"
    ],
    "edges": [
      [
        "gc_purple_t3_capital_eclipse_01",
        "gc_purple_t3_capital_eclipse_01_b"
      ],
      [
        "gc_purple_t3_capital_eclipse_02",
        "gc_purple_t3_capital_eclipse_02_b"
      ],
      [
        "gc_purple_t3_capital_eclipse_01_b",
        "gc_purple_t3_capital_eclipse_02"
      ],
      [
        "gc_purple_t3_capital_eclipse_02_b",
        "gc_purple_t3_capital_eclipse_03"
      ],
      [
        "gc_purple_t3_capital_eclipse_02_b",
        "gc_purple_t4_capital_eclipse_04"
      ],
      [
        "gc_purple_t3_capital_eclipse_02_b",
        "gc_purple_t4_capital_eclipse_05"
      ],
      [
        "gc_purple_t3_capital_eclipse_03",
        "gc_purple_t4_capital_eclipse_06"
      ],
      [
        "gc_purple_t4_capital_eclipse_05",
        "gc_purple_t4_capital_eclipse_07"
      ],
      [
        "gc_purple_t4_capital_eclipse_04",
        "gc_purple_t5_capital_eclipse_08"
      ],
      [
        "gc_purple_t5_capital_eclipse_08",
        "gc_purple_t5_capital_eclipse_09"
      ],
      [
        "gc_purple_t4_capital_eclipse_07",
        "gc_purple_t5_capital_eclipse_10"
      ],
      [
        "gc_purple_t4_capital_eclipse_05",
        "gc_purple_t5_capital_eclipse_10"
      ],
      [
        "gc_purple_t4_capital_eclipse_06",
        "gc_purple_t4_capital_eclipse_07"
      ],
      [
        "gc_purple_t5_capital_eclipse_09",
        "gc_purple_t5_capital_eclipse_10"
      ]
    ],
    "portalGatekeepers": {
      "eclipse": "gc_purple_t3_capital_eclipse_01",
      "sunken_abyss": "gc_purple_t5_capital_eclipse_08",
      "sea_of_storms": "gc_purple_t5_capital_eclipse_08"
    }
  },
  "solaria": {
    "submapId": "solaria",
    "domain": "gold",
    "worldHub": {
      "x": 75.5,
      "y": 48.5
    },
    "worldPolygon": [
      [
        64,
        40
      ],
      [
        80,
        41
      ],
      [
        82,
        57
      ],
      [
        63,
        62
      ],
      [
        62,
        49
      ]
    ],
    "entryPos": {
      "x": 16,
      "y": 50
    },
    "entryNodeIds": [
      "gc_gold_t1_solaria_01",
      "gc_gold_t1_solaria_02"
    ],
    "throneNodeId": "gc_gold_t3_solaria_09",
    "nodeIds": [
      "gc_gold_t1_solaria_01",
      "gc_gold_t1_solaria_01_b",
      "gc_gold_t1_solaria_02",
      "gc_gold_t1_solaria_02_b",
      "gc_gold_t2_solaria_03",
      "gc_gold_t2_solaria_03_b",
      "gc_gold_t2_solaria_04",
      "gc_gold_t2_solaria_04_b",
      "gc_gold_t2_solaria_05",
      "gc_gold_t2_solaria_05_b",
      "gc_gold_t2_solaria_06",
      "gc_gold_t2_solaria_06_b",
      "gc_gold_t3_solaria_07",
      "gc_gold_t3_solaria_07_b",
      "gc_gold_t3_solaria_08",
      "gc_gold_t3_solaria_09"
    ],
    "edges": [
      [
        "gc_gold_t1_solaria_01",
        "gc_gold_t1_solaria_01_b"
      ],
      [
        "gc_gold_t1_solaria_02",
        "gc_gold_t1_solaria_02_b"
      ],
      [
        "gc_gold_t2_solaria_03",
        "gc_gold_t2_solaria_03_b"
      ],
      [
        "gc_gold_t2_solaria_04",
        "gc_gold_t2_solaria_04_b"
      ],
      [
        "gc_gold_t2_solaria_05",
        "gc_gold_t2_solaria_05_b"
      ],
      [
        "gc_gold_t2_solaria_06",
        "gc_gold_t2_solaria_06_b"
      ],
      [
        "gc_gold_t3_solaria_07",
        "gc_gold_t3_solaria_07_b"
      ],
      [
        "gc_gold_t1_solaria_01_b",
        "gc_gold_t1_solaria_02"
      ],
      [
        "gc_gold_t1_solaria_01_b",
        "gc_gold_t2_solaria_03"
      ],
      [
        "gc_gold_t1_solaria_02_b",
        "gc_gold_t2_solaria_04"
      ],
      [
        "gc_gold_t2_solaria_04_b",
        "gc_gold_t2_solaria_05"
      ],
      [
        "gc_gold_t2_solaria_03_b",
        "gc_gold_t2_solaria_06"
      ],
      [
        "gc_gold_t2_solaria_06_b",
        "gc_gold_t3_solaria_07"
      ],
      [
        "gc_gold_t2_solaria_05_b",
        "gc_gold_t3_solaria_08"
      ],
      [
        "gc_gold_t2_solaria_04_b",
        "gc_gold_t3_solaria_09"
      ],
      [
        "gc_gold_t2_solaria_03_b",
        "gc_gold_t3_solaria_09"
      ],
      [
        "gc_gold_t3_solaria_07_b",
        "gc_gold_t3_solaria_09"
      ],
      [
        "gc_gold_t3_solaria_08",
        "gc_gold_t3_solaria_09"
      ]
    ],
    "portalGatekeepers": {
      "matrix": "gc_gold_t3_solaria_09",
      "pyros": "gc_gold_t1_solaria_02",
      "vortex": "gc_gold_t3_solaria_08",
      "veridia": "gc_gold_t1_solaria_01",
      "sky_bastions": "gc_gold_t3_solaria_09",
      "capital_solaria": "gc_gold_t3_solaria_09",
      "sea_of_storms": "gc_gold_t3_solaria_07_b",
      "boreal_skyway": "gc_gold_t2_solaria_05_b"
    }
  },
  "boreal_skyway": {
    "submapId": "boreal_skyway",
    "domain": "gold",
    "worldHub": {
      "x": 73.5,
      "y": 30.5
    },
    "worldPolygon": [
      [
        69,
        20
      ],
      [
        80,
        22
      ],
      [
        79,
        41
      ],
      [
        64,
        40
      ]
    ],
    "entryPos": {
      "x": 19,
      "y": 65
    },
    "entryNodeIds": [
      "gc_gold_t2_boreal_skyway_01",
      "gc_gold_t2_boreal_skyway_02"
    ],
    "throneNodeId": "gc_gold_t3_boreal_skyway_07",
    "nodeIds": [
      "gc_gold_t2_boreal_skyway_01",
      "gc_gold_t2_boreal_skyway_01_b",
      "gc_gold_t2_boreal_skyway_02",
      "gc_gold_t2_boreal_skyway_02_b",
      "gc_gold_t2_boreal_skyway_03",
      "gc_gold_t2_boreal_skyway_03_b",
      "gc_gold_t3_boreal_skyway_04",
      "gc_gold_t3_boreal_skyway_04_b",
      "gc_gold_t3_boreal_skyway_05",
      "gc_gold_t3_boreal_skyway_06",
      "gc_gold_t3_boreal_skyway_07"
    ],
    "edges": [
      [
        "gc_gold_t2_boreal_skyway_01",
        "gc_gold_t2_boreal_skyway_01_b"
      ],
      [
        "gc_gold_t2_boreal_skyway_02",
        "gc_gold_t2_boreal_skyway_02_b"
      ],
      [
        "gc_gold_t2_boreal_skyway_03",
        "gc_gold_t2_boreal_skyway_03_b"
      ],
      [
        "gc_gold_t3_boreal_skyway_04",
        "gc_gold_t3_boreal_skyway_04_b"
      ],
      [
        "gc_gold_t2_boreal_skyway_01_b",
        "gc_gold_t2_boreal_skyway_02"
      ],
      [
        "gc_gold_t2_boreal_skyway_02_b",
        "gc_gold_t2_boreal_skyway_03"
      ],
      [
        "gc_gold_t2_boreal_skyway_01_b",
        "gc_gold_t3_boreal_skyway_04"
      ],
      [
        "gc_gold_t2_boreal_skyway_01_b",
        "gc_gold_t3_boreal_skyway_05"
      ],
      [
        "gc_gold_t3_boreal_skyway_04_b",
        "gc_gold_t3_boreal_skyway_06"
      ],
      [
        "gc_gold_t3_boreal_skyway_05",
        "gc_gold_t3_boreal_skyway_07"
      ],
      [
        "gc_gold_t3_boreal_skyway_04_b",
        "gc_gold_t3_boreal_skyway_07"
      ],
      [
        "gc_gold_t2_boreal_skyway_03_b",
        "gc_gold_t3_boreal_skyway_05"
      ],
      [
        "gc_gold_t3_boreal_skyway_06",
        "gc_gold_t3_boreal_skyway_07"
      ]
    ],
    "portalGatekeepers": {
      "pyros": "gc_gold_t3_boreal_skyway_06",
      "vortex": "gc_gold_t3_boreal_skyway_07",
      "solaria": "gc_gold_t3_boreal_skyway_07",
      "sky_bastions": "gc_gold_t3_boreal_skyway_07",
      "astral_isles": "gc_gold_t3_boreal_skyway_07",
      "capital_pyros": "gc_gold_t3_boreal_skyway_06",
      "capital_solaria": "gc_gold_t3_boreal_skyway_07"
    }
  },
  "sky_bastions": {
    "submapId": "sky_bastions",
    "domain": "gold",
    "worldHub": {
      "x": 88.5,
      "y": 58.5
    },
    "worldPolygon": [
      [
        80,
        41
      ],
      [
        96,
        46
      ],
      [
        96,
        68
      ],
      [
        86,
        69
      ],
      [
        63,
        62
      ],
      [
        82,
        57
      ]
    ],
    "entryPos": {
      "x": 18,
      "y": 32
    },
    "entryNodeIds": [
      "gc_gold_t3_sky_bastions_01",
      "gc_gold_t3_sky_bastions_02"
    ],
    "throneNodeId": "gc_gold_t4_sky_bastions_07",
    "nodeIds": [
      "gc_gold_t3_sky_bastions_01",
      "gc_gold_t3_sky_bastions_01_b",
      "gc_gold_t3_sky_bastions_02",
      "gc_gold_t3_sky_bastions_02_b",
      "gc_gold_t3_sky_bastions_03",
      "gc_gold_t3_sky_bastions_03_b",
      "gc_gold_t4_sky_bastions_04",
      "gc_gold_t4_sky_bastions_05",
      "gc_gold_t4_sky_bastions_06",
      "gc_gold_t4_sky_bastions_07"
    ],
    "edges": [
      [
        "gc_gold_t3_sky_bastions_01",
        "gc_gold_t3_sky_bastions_01_b"
      ],
      [
        "gc_gold_t3_sky_bastions_02",
        "gc_gold_t3_sky_bastions_02_b"
      ],
      [
        "gc_gold_t3_sky_bastions_03",
        "gc_gold_t3_sky_bastions_03_b"
      ],
      [
        "gc_gold_t3_sky_bastions_01_b",
        "gc_gold_t3_sky_bastions_02"
      ],
      [
        "gc_gold_t3_sky_bastions_01_b",
        "gc_gold_t3_sky_bastions_03"
      ],
      [
        "gc_gold_t3_sky_bastions_02_b",
        "gc_gold_t4_sky_bastions_04"
      ],
      [
        "gc_gold_t3_sky_bastions_03_b",
        "gc_gold_t4_sky_bastions_05"
      ],
      [
        "gc_gold_t4_sky_bastions_05",
        "gc_gold_t4_sky_bastions_06"
      ],
      [
        "gc_gold_t4_sky_bastions_05",
        "gc_gold_t4_sky_bastions_07"
      ],
      [
        "gc_gold_t4_sky_bastions_04",
        "gc_gold_t4_sky_bastions_07"
      ],
      [
        "gc_gold_t4_sky_bastions_06",
        "gc_gold_t4_sky_bastions_07"
      ]
    ],
    "portalGatekeepers": {
      "solaria": "gc_gold_t3_sky_bastions_03_b",
      "underforge": "gc_gold_t4_sky_bastions_07",
      "astral_isles": "gc_gold_t4_sky_bastions_04",
      "capital_solaria": "gc_gold_t4_sky_bastions_07",
      "boreal_skyway": "gc_gold_t3_sky_bastions_01"
    }
  },
  "capital_solaria": {
    "submapId": "capital_solaria",
    "domain": "gold",
    "worldHub": {
      "x": 86,
      "y": 31.5
    },
    "worldPolygon": [
      [
        80,
        22
      ],
      [
        95,
        26
      ],
      [
        96,
        46
      ],
      [
        79,
        41
      ]
    ],
    "entryPos": {
      "x": 20,
      "y": 78
    },
    "entryNodeIds": [
      "gc_gold_t3_capital_solaria_01",
      "gc_gold_t3_capital_solaria_02"
    ],
    "throneNodeId": "gc_gold_t5_capital_solaria_08",
    "nodeIds": [
      "gc_gold_t3_capital_solaria_01",
      "gc_gold_t3_capital_solaria_01_b",
      "gc_gold_t3_capital_solaria_02",
      "gc_gold_t4_capital_solaria_03",
      "gc_gold_t4_capital_solaria_04",
      "gc_gold_t4_capital_solaria_05",
      "gc_gold_t4_capital_solaria_06",
      "gc_gold_t5_capital_solaria_07",
      "gc_gold_t5_capital_solaria_08"
    ],
    "edges": [
      [
        "gc_gold_t3_capital_solaria_01",
        "gc_gold_t3_capital_solaria_01_b"
      ],
      [
        "gc_gold_t3_capital_solaria_01_b",
        "gc_gold_t3_capital_solaria_02"
      ],
      [
        "gc_gold_t3_capital_solaria_02",
        "gc_gold_t4_capital_solaria_03"
      ],
      [
        "gc_gold_t4_capital_solaria_03",
        "gc_gold_t4_capital_solaria_04"
      ],
      [
        "gc_gold_t4_capital_solaria_04",
        "gc_gold_t4_capital_solaria_05"
      ],
      [
        "gc_gold_t4_capital_solaria_04",
        "gc_gold_t4_capital_solaria_06"
      ],
      [
        "gc_gold_t4_capital_solaria_06",
        "gc_gold_t5_capital_solaria_07"
      ],
      [
        "gc_gold_t4_capital_solaria_04",
        "gc_gold_t5_capital_solaria_08"
      ],
      [
        "gc_gold_t4_capital_solaria_06",
        "gc_gold_t5_capital_solaria_08"
      ],
      [
        "gc_gold_t4_capital_solaria_05",
        "gc_gold_t5_capital_solaria_08"
      ],
      [
        "gc_gold_t5_capital_solaria_07",
        "gc_gold_t5_capital_solaria_08"
      ]
    ],
    "portalGatekeepers": {
      "solaria": "gc_gold_t3_capital_solaria_02",
      "sky_bastions": "gc_gold_t5_capital_solaria_07",
      "boreal_skyway": "gc_gold_t5_capital_solaria_07"
    }
  },
  "matrix": {
    "submapId": "matrix",
    "domain": "neutral",
    "worldHub": {
      "x": 42,
      "y": 49
    },
    "worldPolygon": [
      [
        33,
        40
      ],
      [
        45,
        39
      ],
      [
        46,
        54
      ],
      [
        38,
        56
      ],
      [
        38,
        49
      ]
    ],
    "entryPos": {
      "x": 16,
      "y": 50
    },
    "entryNodeIds": [
      "gc_neutral_t2_matrix_01",
      "gc_neutral_t2_matrix_02"
    ],
    "throneNodeId": "gc_neutral_t4_matrix_10",
    "nodeIds": [
      "gc_neutral_t2_matrix_01",
      "gc_neutral_t2_matrix_01_b",
      "gc_neutral_t2_matrix_02",
      "gc_neutral_t2_matrix_02_b",
      "gc_neutral_t2_matrix_03",
      "gc_neutral_t2_matrix_03_b",
      "gc_neutral_t3_matrix_04",
      "gc_neutral_t3_matrix_04_b",
      "gc_neutral_t3_matrix_05",
      "gc_neutral_t3_matrix_05_b",
      "gc_neutral_t3_matrix_06",
      "gc_neutral_t3_matrix_06_b",
      "gc_neutral_t3_matrix_07",
      "gc_neutral_t4_matrix_08",
      "gc_neutral_t4_matrix_09",
      "gc_neutral_t4_matrix_10"
    ],
    "edges": [
      [
        "gc_neutral_t2_matrix_01",
        "gc_neutral_t2_matrix_01_b"
      ],
      [
        "gc_neutral_t2_matrix_02",
        "gc_neutral_t2_matrix_02_b"
      ],
      [
        "gc_neutral_t2_matrix_03",
        "gc_neutral_t2_matrix_03_b"
      ],
      [
        "gc_neutral_t3_matrix_04",
        "gc_neutral_t3_matrix_04_b"
      ],
      [
        "gc_neutral_t3_matrix_05",
        "gc_neutral_t3_matrix_05_b"
      ],
      [
        "gc_neutral_t3_matrix_06",
        "gc_neutral_t3_matrix_06_b"
      ],
      [
        "gc_neutral_t2_matrix_01_b",
        "gc_neutral_t2_matrix_02"
      ],
      [
        "gc_neutral_t2_matrix_01_b",
        "gc_neutral_t2_matrix_03"
      ],
      [
        "gc_neutral_t2_matrix_01_b",
        "gc_neutral_t3_matrix_04"
      ],
      [
        "gc_neutral_t3_matrix_04_b",
        "gc_neutral_t3_matrix_05"
      ],
      [
        "gc_neutral_t3_matrix_04_b",
        "gc_neutral_t3_matrix_06"
      ],
      [
        "gc_neutral_t3_matrix_06_b",
        "gc_neutral_t3_matrix_07"
      ],
      [
        "gc_neutral_t3_matrix_07",
        "gc_neutral_t4_matrix_08"
      ],
      [
        "gc_neutral_t3_matrix_07",
        "gc_neutral_t4_matrix_09"
      ],
      [
        "gc_neutral_t3_matrix_04_b",
        "gc_neutral_t4_matrix_10"
      ],
      [
        "gc_neutral_t3_matrix_05_b",
        "gc_neutral_t4_matrix_10"
      ],
      [
        "gc_neutral_t2_matrix_02_b",
        "gc_neutral_t3_matrix_04"
      ],
      [
        "gc_neutral_t2_matrix_03_b",
        "gc_neutral_t3_matrix_06"
      ],
      [
        "gc_neutral_t4_matrix_08",
        "gc_neutral_t4_matrix_09"
      ],
      [
        "gc_neutral_t4_matrix_09",
        "gc_neutral_t4_matrix_10"
      ]
    ],
    "portalGatekeepers": {
      "pyros": "gc_neutral_t3_matrix_06_b",
      "veridia": "gc_neutral_t3_matrix_05_b",
      "eclipse": "gc_neutral_t2_matrix_01",
      "solaria": "gc_neutral_t3_matrix_07",
      "prismatic_crater": "gc_neutral_t4_matrix_10",
      "capital_axial": "gc_neutral_t4_matrix_10"
    }
  },
  "prismatic_crater": {
    "submapId": "prismatic_crater",
    "domain": "neutral",
    "worldHub": {
      "x": 50,
      "y": 61
    },
    "worldPolygon": [
      [
        38,
        56
      ],
      [
        62,
        56
      ],
      [
        63,
        67
      ],
      [
        38,
        67
      ]
    ],
    "entryPos": {
      "x": 50,
      "y": 18
    },
    "entryNodeIds": [
      "gc_neutral_t3_prismatic_crater_01",
      "gc_neutral_t3_prismatic_crater_02"
    ],
    "throneNodeId": "gc_neutral_t4_prismatic_crater_09",
    "nodeIds": [
      "gc_neutral_t3_prismatic_crater_01",
      "gc_neutral_t3_prismatic_crater_01_b",
      "gc_neutral_t3_prismatic_crater_02",
      "gc_neutral_t3_prismatic_crater_02_b",
      "gc_neutral_t3_prismatic_crater_03",
      "gc_neutral_t3_prismatic_crater_03_b",
      "gc_neutral_t3_prismatic_crater_04",
      "gc_neutral_t4_prismatic_crater_05",
      "gc_neutral_t4_prismatic_crater_06",
      "gc_neutral_t4_prismatic_crater_07",
      "gc_neutral_t4_prismatic_crater_08",
      "gc_neutral_t4_prismatic_crater_09"
    ],
    "edges": [
      [
        "gc_neutral_t3_prismatic_crater_01",
        "gc_neutral_t3_prismatic_crater_01_b"
      ],
      [
        "gc_neutral_t3_prismatic_crater_02",
        "gc_neutral_t3_prismatic_crater_02_b"
      ],
      [
        "gc_neutral_t3_prismatic_crater_03",
        "gc_neutral_t3_prismatic_crater_03_b"
      ],
      [
        "gc_neutral_t3_prismatic_crater_01_b",
        "gc_neutral_t3_prismatic_crater_02"
      ],
      [
        "gc_neutral_t3_prismatic_crater_01_b",
        "gc_neutral_t3_prismatic_crater_03"
      ],
      [
        "gc_neutral_t3_prismatic_crater_02_b",
        "gc_neutral_t3_prismatic_crater_04"
      ],
      [
        "gc_neutral_t3_prismatic_crater_03_b",
        "gc_neutral_t4_prismatic_crater_05"
      ],
      [
        "gc_neutral_t3_prismatic_crater_02_b",
        "gc_neutral_t4_prismatic_crater_06"
      ],
      [
        "gc_neutral_t4_prismatic_crater_05",
        "gc_neutral_t4_prismatic_crater_07"
      ],
      [
        "gc_neutral_t4_prismatic_crater_06",
        "gc_neutral_t4_prismatic_crater_08"
      ],
      [
        "gc_neutral_t3_prismatic_crater_04",
        "gc_neutral_t4_prismatic_crater_09"
      ],
      [
        "gc_neutral_t3_prismatic_crater_02_b",
        "gc_neutral_t4_prismatic_crater_09"
      ],
      [
        "gc_neutral_t4_prismatic_crater_07",
        "gc_neutral_t4_prismatic_crater_09"
      ],
      [
        "gc_neutral_t4_prismatic_crater_08",
        "gc_neutral_t4_prismatic_crater_09"
      ]
    ],
    "portalGatekeepers": {
      "matrix": "gc_neutral_t3_prismatic_crater_01",
      "underforge": "gc_neutral_t4_prismatic_crater_05",
      "deep_roots": "gc_neutral_t4_prismatic_crater_08",
      "capital_axial": "gc_neutral_t4_prismatic_crater_09"
    }
  },
  "capital_axial": {
    "submapId": "capital_axial",
    "domain": "neutral",
    "worldHub": {
      "x": 51.5,
      "y": 46
    },
    "worldPolygon": [
      [
        45,
        39
      ],
      [
        64,
        40
      ],
      [
        62,
        56
      ],
      [
        46,
        54
      ]
    ],
    "entryPos": {
      "x": 50,
      "y": 82
    },
    "entryNodeIds": [
      "gc_neutral_t4_capital_axial_01",
      "gc_neutral_t4_capital_axial_02"
    ],
    "throneNodeId": "gc_neutral_t5_capital_axial_09",
    "nodeIds": [
      "gc_neutral_t4_capital_axial_01",
      "gc_neutral_t4_capital_axial_02",
      "gc_neutral_t4_capital_axial_03",
      "gc_neutral_t4_capital_axial_04",
      "gc_neutral_t5_capital_axial_05",
      "gc_neutral_t5_capital_axial_06",
      "gc_neutral_t5_capital_axial_07",
      "gc_neutral_t5_capital_axial_08",
      "gc_neutral_t5_capital_axial_09"
    ],
    "edges": [
      [
        "gc_neutral_t4_capital_axial_01",
        "gc_neutral_t4_capital_axial_02"
      ],
      [
        "gc_neutral_t4_capital_axial_01",
        "gc_neutral_t4_capital_axial_03"
      ],
      [
        "gc_neutral_t4_capital_axial_01",
        "gc_neutral_t4_capital_axial_04"
      ],
      [
        "gc_neutral_t4_capital_axial_04",
        "gc_neutral_t5_capital_axial_05"
      ],
      [
        "gc_neutral_t4_capital_axial_03",
        "gc_neutral_t5_capital_axial_06"
      ],
      [
        "gc_neutral_t5_capital_axial_06",
        "gc_neutral_t5_capital_axial_07"
      ],
      [
        "gc_neutral_t5_capital_axial_07",
        "gc_neutral_t5_capital_axial_08"
      ],
      [
        "gc_neutral_t4_capital_axial_04",
        "gc_neutral_t5_capital_axial_09"
      ],
      [
        "gc_neutral_t5_capital_axial_07",
        "gc_neutral_t5_capital_axial_09"
      ],
      [
        "gc_neutral_t4_capital_axial_02",
        "gc_neutral_t4_capital_axial_04"
      ],
      [
        "gc_neutral_t5_capital_axial_05",
        "gc_neutral_t5_capital_axial_09"
      ],
      [
        "gc_neutral_t5_capital_axial_08",
        "gc_neutral_t5_capital_axial_09"
      ]
    ],
    "portalGatekeepers": {
      "matrix": "gc_neutral_t4_capital_axial_01",
      "prismatic_crater": "gc_neutral_t4_capital_axial_04",
      "sea_of_storms": "gc_neutral_t4_capital_axial_02"
    }
  }
};

export const GRAND_CAMPAIGN_NODES: GrandCampaignEncounterNode[] = [
  {
    "id": "gc_green_t1_veridia_01",
    "stage": 1,
    "submapId": "veridia",
    "submapOrder": 1,
    "rx": 20.6,
    "ry": 73.6,
    "worldX": 31,
    "worldY": 81.5,
    "landmarkName": "Enseada da Presa",
    "tier": 1,
    "encounterKind": "rare_garrison",
    "isEntryNode": true,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t1_veridia_01",
      "stage": 1,
      "name": "Serpente Emplumada do Dossel",
      "title": "Guardião de Fronteira • Enseada da Presa",
      "domains": [
        "green"
      ],
      "avatarCardId": "green_135_serpente_emplumada_selva",
      "startingHp": 40,
      "passiveName": "Patrulha das Raízes",
      "passiveDescription": "Guarnição fronteiriça de Veridia versada em emboscadas de floresta.",
      "rewardGold": 12,
      "rewardShards": 10,
      "rewardCardIds": [
        "green_135_serpente_emplumada_selva",
        "green_170_flagelo_cornudo_selva"
      ],
      "loreIntro": "Serpente Emplumada do Dossel mantém vigília soberana sobre Enseada da Presa (Veridia — O Sul Selvagem), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_green_swarm",
      "customDeckCardIds": [],
      "difficultyTier": 1,
      "submapId": "veridia",
      "landmarkName": "Enseada da Presa",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_green_swarm",
      "archetypeTitle": "Enxame & Matilha Silvestre"
    }
  },
  {
    "id": "gc_green_t1_veridia_01_b",
    "stage": 2,
    "submapId": "veridia",
    "submapOrder": 2,
    "rx": 20.5,
    "ry": 68.2,
    "worldX": 31,
    "worldY": 81.5,
    "landmarkName": "Reduto — Enseada da Presa",
    "tier": 1,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t1_veridia_01_b",
      "stage": 2,
      "name": "Tecelão do Feixe Silvestre",
      "title": "Comandante Regional • Reduto — Enseada da Presa",
      "domains": [
        "green"
      ],
      "avatarCardId": "green_168_tecelao_feixe_selva",
      "startingHp": 40,
      "passiveName": "Patrulha das Raízes",
      "passiveDescription": "Guarnição fronteiriça de Veridia versada em emboscadas de floresta.",
      "rewardGold": 12,
      "rewardShards": 10,
      "rewardCardIds": [
        "green_168_tecelao_feixe_selva",
        "green_78_quimera_silvestre"
      ],
      "loreIntro": "Tecelão do Feixe Silvestre lidera o posto avançado em Reduto — Enseada da Presa (Veridia — O Sul Selvagem). Vença o duelo para prosseguir pela estrada.",
      "deckId": "mono_green_roots",
      "customDeckCardIds": [],
      "difficultyTier": 1,
      "submapId": "veridia",
      "landmarkName": "Reduto — Enseada da Presa",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_green_roots",
      "archetypeTitle": "Enxame & Matilha Silvestre"
    }
  },
  {
    "id": "gc_green_t1_veridia_02",
    "stage": 3,
    "submapId": "veridia",
    "submapOrder": 3,
    "rx": 13,
    "ry": 65,
    "worldX": 31,
    "worldY": 81.5,
    "landmarkName": "Guarita das Raízes Vivas",
    "tier": 1,
    "encounterKind": "rare_garrison",
    "isEntryNode": true,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t1_veridia_02",
      "stage": 3,
      "name": "Troll Dire de Sangue Eterno",
      "title": "Guardião de Fronteira • Guarita das Raízes Vivas",
      "domains": [
        "green"
      ],
      "avatarCardId": "green_83_troll_duas_cabecas",
      "startingHp": 40,
      "passiveName": "Patrulha das Raízes",
      "passiveDescription": "Guarnição fronteiriça de Veridia versada em emboscadas de floresta.",
      "rewardGold": 12,
      "rewardShards": 10,
      "rewardCardIds": [
        "green_83_troll_duas_cabecas",
        "green_18_lobisomem"
      ],
      "loreIntro": "Troll Dire de Sangue Eterno mantém vigília soberana sobre Guarita das Raízes Vivas (Veridia — O Sul Selvagem), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_green_swarm",
      "customDeckCardIds": [],
      "difficultyTier": 1,
      "submapId": "veridia",
      "landmarkName": "Guarita das Raízes Vivas",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_green_swarm",
      "archetypeTitle": "Enxame & Matilha Silvestre"
    }
  },
  {
    "id": "gc_green_t1_veridia_02_b",
    "stage": 4,
    "submapId": "veridia",
    "submapOrder": 4,
    "rx": 16.4,
    "ry": 58,
    "worldX": 31,
    "worldY": 81.5,
    "landmarkName": "Vanguarda — Guarita das Raízes Vivas",
    "tier": 1,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t1_veridia_02_b",
      "stage": 4,
      "name": "Patriarca Urso-Ancestral",
      "title": "Comandante Regional • Vanguarda — Guarita das Raízes Vivas",
      "domains": [
        "green"
      ],
      "avatarCardId": "green_19_guardiao_ursino",
      "startingHp": 40,
      "passiveName": "Patrulha das Raízes",
      "passiveDescription": "Guarnição fronteiriça de Veridia versada em emboscadas de floresta.",
      "rewardGold": 12,
      "rewardShards": 10,
      "rewardCardIds": [
        "green_19_guardiao_ursino",
        "green_112_escorpiao_jade"
      ],
      "loreIntro": "Patriarca Urso-Ancestral lidera o posto avançado em Vanguarda — Guarita das Raízes Vivas (Veridia — O Sul Selvagem). Vença o duelo para prosseguir pela estrada.",
      "deckId": "mono_green_colossus",
      "customDeckCardIds": [],
      "difficultyTier": 1,
      "submapId": "veridia",
      "landmarkName": "Vanguarda — Guarita das Raízes Vivas",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_green_colossus",
      "archetypeTitle": "Enxame & Matilha Silvestre"
    }
  },
  {
    "id": "gc_green_t1_veridia_03",
    "stage": 5,
    "submapId": "veridia",
    "submapOrder": 5,
    "rx": 31,
    "ry": 81,
    "worldX": 31,
    "worldY": 81.5,
    "landmarkName": "Ponte do Musgo Antigo",
    "tier": 1,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t1_veridia_03",
      "stage": 5,
      "name": "Anquilossauro Fortaleza de Cristal",
      "title": "Guardião de Fronteira • Ponte do Musgo Antigo",
      "domains": [
        "green"
      ],
      "avatarCardId": "green_134_anquilossauro_fortaleza",
      "startingHp": 40,
      "passiveName": "Patrulha das Raízes",
      "passiveDescription": "Guarnição fronteiriça de Veridia versada em emboscadas de floresta.",
      "rewardGold": 12,
      "rewardShards": 10,
      "rewardCardIds": [
        "green_134_anquilossauro_fortaleza",
        "green_04_pantera_miragem"
      ],
      "loreIntro": "Anquilossauro Fortaleza de Cristal mantém vigília soberana sobre Ponte do Musgo Antigo (Veridia — O Sul Selvagem), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_green_roots",
      "customDeckCardIds": [],
      "difficultyTier": 1,
      "submapId": "veridia",
      "landmarkName": "Ponte do Musgo Antigo",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_green_roots",
      "archetypeTitle": "Raízes Eternas"
    }
  },
  {
    "id": "gc_green_t1_veridia_03_b",
    "stage": 6,
    "submapId": "veridia",
    "submapOrder": 6,
    "rx": 36.3,
    "ry": 77.6,
    "worldX": 31,
    "worldY": 81.5,
    "landmarkName": "Baluarte — Ponte do Musgo Antigo",
    "tier": 1,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t1_veridia_03_b",
      "stage": 6,
      "name": "Minotauro Quebra-Muros",
      "title": "Comandante Regional • Baluarte — Ponte do Musgo Antigo",
      "domains": [
        "green"
      ],
      "avatarCardId": "green_05_minotauro",
      "startingHp": 40,
      "passiveName": "Patrulha das Raízes",
      "passiveDescription": "Guarnição fronteiriça de Veridia versada em emboscadas de floresta.",
      "rewardGold": 12,
      "rewardShards": 10,
      "rewardCardIds": [
        "green_05_minotauro",
        "green_28_totem_silvestre"
      ],
      "loreIntro": "Minotauro Quebra-Muros lidera o posto avançado em Baluarte — Ponte do Musgo Antigo (Veridia — O Sul Selvagem). Vença o duelo para prosseguir pela estrada.",
      "deckId": "mono_green_colossus",
      "customDeckCardIds": [],
      "difficultyTier": 1,
      "submapId": "veridia",
      "landmarkName": "Baluarte — Ponte do Musgo Antigo",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_green_colossus",
      "archetypeTitle": "Raízes Eternas"
    }
  },
  {
    "id": "gc_green_t1_veridia_04",
    "stage": 7,
    "submapId": "veridia",
    "submapOrder": 7,
    "rx": 31,
    "ry": 65,
    "worldX": 31,
    "worldY": 81.5,
    "landmarkName": "Clareira dos Espinhos",
    "tier": 1,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t1_veridia_04",
      "stage": 7,
      "name": "Troll Regenerador do Pântano",
      "title": "Guardião de Fronteira • Clareira dos Espinhos",
      "domains": [
        "green"
      ],
      "avatarCardId": "green_07_troll",
      "startingHp": 40,
      "passiveName": "Patrulha das Raízes",
      "passiveDescription": "Guarnição fronteiriça de Veridia versada em emboscadas de floresta.",
      "rewardGold": 12,
      "rewardShards": 10,
      "rewardCardIds": [
        "green_07_troll",
        "green_151_urso_couraca_musgo"
      ],
      "loreIntro": "Troll Regenerador do Pântano mantém vigília soberana sobre Clareira dos Espinhos (Veridia — O Sul Selvagem), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_green_roots",
      "customDeckCardIds": [],
      "difficultyTier": 1,
      "submapId": "veridia",
      "landmarkName": "Clareira dos Espinhos",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_green_roots",
      "archetypeTitle": "Raízes Eternas"
    }
  },
  {
    "id": "gc_green_t1_veridia_04_b",
    "stage": 8,
    "submapId": "veridia",
    "submapOrder": 8,
    "rx": 36.3,
    "ry": 68.4,
    "worldX": 31,
    "worldY": 81.5,
    "landmarkName": "Atalaia — Clareira dos Espinhos",
    "tier": 1,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t1_veridia_04_b",
      "stage": 8,
      "name": "Rinoceronte Chifre-de-Monólito",
      "title": "Comandante Regional • Atalaia — Clareira dos Espinhos",
      "domains": [
        "green"
      ],
      "avatarCardId": "green_136_rinoceronte_monolito",
      "startingHp": 40,
      "passiveName": "Patrulha das Raízes",
      "passiveDescription": "Guarnição fronteiriça de Veridia versada em emboscadas de floresta.",
      "rewardGold": 12,
      "rewardShards": 10,
      "rewardCardIds": [
        "green_136_rinoceronte_monolito",
        "green_130_urso_runico_anciao"
      ],
      "loreIntro": "Rinoceronte Chifre-de-Monólito lidera o posto avançado em Atalaia — Clareira dos Espinhos (Veridia — O Sul Selvagem). Vença o duelo para prosseguir pela estrada.",
      "deckId": "mono_green_swarm",
      "customDeckCardIds": [],
      "difficultyTier": 1,
      "submapId": "veridia",
      "landmarkName": "Atalaia — Clareira dos Espinhos",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_green_swarm",
      "archetypeTitle": "Raízes Eternas"
    }
  },
  {
    "id": "gc_green_t2_veridia_05",
    "stage": 9,
    "submapId": "veridia",
    "submapOrder": 9,
    "rx": 13,
    "ry": 49,
    "worldX": 31,
    "worldY": 81.5,
    "landmarkName": "Terraço da Seiva Dourada",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t2_veridia_05",
      "stage": 9,
      "name": "Kongor, Rei de Costas Prateadas",
      "title": "Guardião de Fronteira • Terraço da Seiva Dourada",
      "domains": [
        "green"
      ],
      "avatarCardId": "green_32_gorila_alfa",
      "startingHp": 40,
      "passiveName": "Vigor da Mata",
      "passiveDescription": "Feras veteranas alimentadas pela seiva das grandes copas.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "green_32_gorila_alfa",
        "green_62_rinoceronte_couracado"
      ],
      "loreIntro": "Kongor, Rei de Costas Prateadas mantém vigília soberana sobre Terraço da Seiva Dourada (Veridia — O Sul Selvagem), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_green_swarm",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "veridia",
      "landmarkName": "Terraço da Seiva Dourada",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_green_swarm",
      "archetypeTitle": "Enxame & Matilha Silvestre"
    }
  },
  {
    "id": "gc_green_t2_veridia_05_b",
    "stage": 10,
    "submapId": "veridia",
    "submapOrder": 10,
    "rx": 18.3,
    "ry": 52.4,
    "worldX": 31,
    "worldY": 81.5,
    "landmarkName": "Atalaia — Terraço da Seiva Dourada",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t2_veridia_05_b",
      "stage": 10,
      "name": "Pactuário do Espírito Silvestre",
      "title": "Comandante Regional • Atalaia — Terraço da Seiva Dourada",
      "domains": [
        "green"
      ],
      "avatarCardId": "green_171_pactuario_elemental_selva",
      "startingHp": 40,
      "passiveName": "Vigor da Mata",
      "passiveDescription": "Feras veteranas alimentadas pela seiva das grandes copas.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "green_171_pactuario_elemental_selva",
        "green_97_serpente_constritora"
      ],
      "loreIntro": "Pactuário do Espírito Silvestre lidera o posto avançado em Atalaia — Terraço da Seiva Dourada (Veridia — O Sul Selvagem). Vença o duelo para prosseguir pela estrada.",
      "deckId": "mono_green_colossus",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "veridia",
      "landmarkName": "Atalaia — Terraço da Seiva Dourada",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_green_colossus",
      "archetypeTitle": "Enxame & Matilha Silvestre"
    }
  },
  {
    "id": "gc_green_t2_veridia_06",
    "stage": 11,
    "submapId": "veridia",
    "submapOrder": 11,
    "rx": 43,
    "ry": 81,
    "worldX": 31,
    "worldY": 81.5,
    "landmarkName": "Forte de Pau-Ferro",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t2_veridia_06",
      "stage": 11,
      "name": "Estegossauro de Placas Esmeralda",
      "title": "Guardião de Fronteira • Forte de Pau-Ferro",
      "domains": [
        "green"
      ],
      "avatarCardId": "green_82_estegossauro_anciao",
      "startingHp": 40,
      "passiveName": "Vigor da Mata",
      "passiveDescription": "Feras veteranas alimentadas pela seiva das grandes copas.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "green_82_estegossauro_anciao",
        "green_126_coracao_selva_viva"
      ],
      "loreIntro": "Estegossauro de Placas Esmeralda mantém vigília soberana sobre Forte de Pau-Ferro (Veridia — O Sul Selvagem), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_green_colossus",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "veridia",
      "landmarkName": "Forte de Pau-Ferro",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_green_colossus",
      "archetypeTitle": "Colossos Primordiais"
    }
  },
  {
    "id": "gc_green_t2_veridia_06_b",
    "stage": 12,
    "submapId": "veridia",
    "submapOrder": 12,
    "rx": 48.3,
    "ry": 77.6,
    "worldX": 31,
    "worldY": 81.5,
    "landmarkName": "Baluarte — Forte de Pau-Ferro",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t2_veridia_06_b",
      "stage": 12,
      "name": "Ave Roc das Cumeadas",
      "title": "Comandante Regional • Baluarte — Forte de Pau-Ferro",
      "domains": [
        "green"
      ],
      "avatarCardId": "green_47_roc_tempestade",
      "startingHp": 40,
      "passiveName": "Vigor da Mata",
      "passiveDescription": "Feras veteranas alimentadas pela seiva das grandes copas.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "green_47_roc_tempestade",
        "green_125_totem_predador_alfa"
      ],
      "loreIntro": "Ave Roc das Cumeadas lidera o posto avançado em Baluarte — Forte de Pau-Ferro (Veridia — O Sul Selvagem). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_blue_green",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "veridia",
      "landmarkName": "Baluarte — Forte de Pau-Ferro",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_blue_green",
      "archetypeTitle": "Colossos Primordiais"
    }
  },
  {
    "id": "gc_green_t2_veridia_07",
    "stage": 13,
    "submapId": "veridia",
    "submapOrder": 13,
    "rx": 25,
    "ry": 49,
    "worldX": 31,
    "worldY": 81.5,
    "landmarkName": "Santuário dos Druidas",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t2_veridia_07",
      "stage": 13,
      "name": "Fera-Peste do Brejo Negro",
      "title": "Guardião de Fronteira • Santuário dos Druidas",
      "domains": [
        "green"
      ],
      "avatarCardId": "green_65_catoblepas_pantano",
      "startingHp": 40,
      "passiveName": "Vigor da Mata",
      "passiveDescription": "Feras veteranas alimentadas pela seiva das grandes copas.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "green_65_catoblepas_pantano",
        "green_88_reencarnacao_ancestral"
      ],
      "loreIntro": "Fera-Peste do Brejo Negro mantém vigília soberana sobre Santuário dos Druidas (Veridia — O Sul Selvagem), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_green_swarm",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "veridia",
      "landmarkName": "Santuário dos Druidas",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_green_swarm",
      "archetypeTitle": "Enxame & Matilha Silvestre"
    }
  },
  {
    "id": "gc_green_t2_veridia_07_b",
    "stage": 14,
    "submapId": "veridia",
    "submapOrder": 14,
    "rx": 32,
    "ry": 43.1,
    "worldX": 31,
    "worldY": 81.5,
    "landmarkName": "Vanguarda — Santuário dos Druidas",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t2_veridia_07_b",
      "stage": 14,
      "name": "Serpe Wyvern do Ferrão",
      "title": "Comandante Regional • Vanguarda — Santuário dos Druidas",
      "domains": [
        "green"
      ],
      "avatarCardId": "green_22_wyvern",
      "startingHp": 40,
      "passiveName": "Vigor da Mata",
      "passiveDescription": "Feras veteranas alimentadas pela seiva das grandes copas.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "green_22_wyvern",
        "green_132_tigre_esmeralda_alfa"
      ],
      "loreIntro": "Serpe Wyvern do Ferrão lidera o posto avançado em Vanguarda — Santuário dos Druidas (Veridia — O Sul Selvagem). Vença o duelo para prosseguir pela estrada.",
      "deckId": "mono_green_roots",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "veridia",
      "landmarkName": "Vanguarda — Santuário dos Druidas",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_green_roots",
      "archetypeTitle": "Enxame & Matilha Silvestre"
    }
  },
  {
    "id": "gc_green_t2_veridia_08",
    "stage": 15,
    "submapId": "veridia",
    "submapOrder": 15,
    "rx": 55,
    "ry": 81,
    "worldX": 31,
    "worldY": 81.5,
    "landmarkName": "Arco do Cipó Real",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t2_veridia_08",
      "stage": 15,
      "name": "Ancião da Sequoia Milenar",
      "title": "Guardião de Fronteira • Arco do Cipó Real",
      "domains": [
        "green",
        "neutral"
      ],
      "avatarCardId": "green_99_guardiao_sequoia",
      "startingHp": 40,
      "passiveName": "Vigor da Mata",
      "passiveDescription": "Feras veteranas alimentadas pela seiva das grandes copas.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "green_99_guardiao_sequoia",
        "green_97_serpente_constritora"
      ],
      "loreIntro": "Ancião da Sequoia Milenar mantém vigília soberana sobre Arco do Cipó Real (Veridia — O Sul Selvagem), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "dual_green_neutral",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "veridia",
      "landmarkName": "Arco do Cipó Real",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_green_neutral",
      "archetypeTitle": "Aliança dos Engenhos Silvestres"
    }
  },
  {
    "id": "gc_green_t2_veridia_08_b",
    "stage": 16,
    "submapId": "veridia",
    "submapOrder": 16,
    "rx": 58.9,
    "ry": 76.4,
    "worldX": 31,
    "worldY": 81.5,
    "landmarkName": "Reduto — Arco do Cipó Real",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t2_veridia_08_b",
      "stage": 16,
      "name": "Arquidruida da Coroa de Galhada",
      "title": "Comandante Regional • Reduto — Arco do Cipó Real",
      "domains": [
        "green",
        "neutral"
      ],
      "avatarCardId": "green_156_mamute_brasa_selvagem",
      "startingHp": 40,
      "passiveName": "Vigor da Mata",
      "passiveDescription": "Feras veteranas alimentadas pela seiva das grandes copas.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "green_156_mamute_brasa_selvagem",
        "green_96_gorila_esmeralda"
      ],
      "loreIntro": "Arquidruida da Coroa de Galhada lidera o posto avançado em Reduto — Arco do Cipó Real (Veridia — O Sul Selvagem). Vença o duelo para prosseguir pela estrada.",
      "deckId": "mono_green_swarm",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "veridia",
      "landmarkName": "Reduto — Arco do Cipó Real",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_green_swarm",
      "archetypeTitle": "Aliança dos Engenhos Silvestres"
    }
  },
  {
    "id": "gc_green_t2_veridia_09",
    "stage": 17,
    "submapId": "veridia",
    "submapOrder": 17,
    "rx": 43,
    "ry": 65,
    "worldX": 31,
    "worldY": 81.5,
    "landmarkName": "Passagem das Copas",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t2_veridia_09",
      "stage": 17,
      "name": "Presságio da Revoada Espinhosa",
      "title": "Guardião de Fronteira • Passagem das Copas",
      "domains": [
        "green",
        "gold"
      ],
      "avatarCardId": "green_169_pressagio_revoada_selva",
      "startingHp": 40,
      "passiveName": "Vigor da Mata",
      "passiveDescription": "Feras veteranas alimentadas pela seiva das grandes copas.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "green_169_pressagio_revoada_selva",
        "green_108_semente_mundo"
      ],
      "loreIntro": "Presságio da Revoada Espinhosa mantém vigília soberana sobre Passagem das Copas (Veridia — O Sul Selvagem), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "dual_green_gold",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "veridia",
      "landmarkName": "Passagem das Copas",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_green_gold",
      "archetypeTitle": "Pacto da Aurora Silvestre"
    }
  },
  {
    "id": "gc_green_t2_veridia_09_b",
    "stage": 18,
    "submapId": "veridia",
    "submapOrder": 18,
    "rx": 49.2,
    "ry": 58.8,
    "worldX": 31,
    "worldY": 81.5,
    "landmarkName": "Atalaia — Passagem das Copas",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t2_veridia_09_b",
      "stage": 18,
      "name": "Mamute Lanoso de Batalha",
      "title": "Comandante Regional • Atalaia — Passagem das Copas",
      "domains": [
        "green",
        "gold"
      ],
      "avatarCardId": "green_64_mamute_guerra",
      "startingHp": 40,
      "passiveName": "Vigor da Mata",
      "passiveDescription": "Feras veteranas alimentadas pela seiva das grandes copas.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "green_64_mamute_guerra",
        "green_89_corpo_atemporal"
      ],
      "loreIntro": "Mamute Lanoso de Batalha lidera o posto avançado em Atalaia — Passagem das Copas (Veridia — O Sul Selvagem). Vença o duelo para prosseguir pela estrada.",
      "deckId": "mono_green_roots",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "veridia",
      "landmarkName": "Atalaia — Passagem das Copas",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_green_roots",
      "archetypeTitle": "Pacto da Aurora Silvestre"
    }
  },
  {
    "id": "gc_green_t2_veridia_10",
    "stage": 19,
    "submapId": "veridia",
    "submapOrder": 19,
    "rx": 66,
    "ry": 78,
    "worldX": 31,
    "worldY": 81.5,
    "landmarkName": "Delta dos Rios de Jade",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t2_veridia_10",
      "stage": 19,
      "name": "Mamute de Presas Esmeralda",
      "title": "Guardião de Fronteira • Delta dos Rios de Jade",
      "domains": [
        "green",
        "blue"
      ],
      "avatarCardId": "green_117_mamute_esmeralda",
      "startingHp": 40,
      "passiveName": "Vigor da Mata",
      "passiveDescription": "Feras veteranas alimentadas pela seiva das grandes copas.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "green_117_mamute_esmeralda",
        "green_42_ettin_selvagem"
      ],
      "loreIntro": "Mamute de Presas Esmeralda mantém vigília soberana sobre Delta dos Rios de Jade (Veridia — O Sul Selvagem), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "dual_blue_green",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "veridia",
      "landmarkName": "Delta dos Rios de Jade",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_blue_green",
      "archetypeTitle": "Pacto da Evolução Quimérica"
    }
  },
  {
    "id": "gc_green_t2_veridia_10_b",
    "stage": 20,
    "submapId": "veridia",
    "submapOrder": 20,
    "rx": 72.8,
    "ry": 66.1,
    "worldX": 31,
    "worldY": 81.5,
    "landmarkName": "Vanguarda — Delta dos Rios de Jade",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t2_veridia_10_b",
      "stage": 20,
      "name": "Quimera Alfa de Três Presas",
      "title": "Comandante Regional • Vanguarda — Delta dos Rios de Jade",
      "domains": [
        "green",
        "blue"
      ],
      "avatarCardId": "green_100_quimera_selvagem",
      "startingHp": 40,
      "passiveName": "Vigor da Mata",
      "passiveDescription": "Feras veteranas alimentadas pela seiva das grandes copas.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "green_100_quimera_selvagem",
        "green_77_alossauro_cacador"
      ],
      "loreIntro": "Quimera Alfa de Três Presas lidera o posto avançado em Vanguarda — Delta dos Rios de Jade (Veridia — O Sul Selvagem). Vença o duelo para prosseguir pela estrada.",
      "deckId": "mono_green_roots",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "veridia",
      "landmarkName": "Vanguarda — Delta dos Rios de Jade",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_green_roots",
      "archetypeTitle": "Pacto da Evolução Quimérica"
    }
  },
  {
    "id": "gc_green_t3_veridia_11",
    "stage": 21,
    "submapId": "veridia",
    "submapOrder": 21,
    "rx": 26,
    "ry": 24,
    "worldX": 31,
    "worldY": 81.5,
    "landmarkName": "Matas Espinhosas do Norte",
    "tier": 3,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t3_veridia_11",
      "stage": 21,
      "name": "Smaragda, Soberana da Selva Fechada",
      "title": "Lorde Soberano • Matas Espinhosas do Norte",
      "domains": [
        "green",
        "purple"
      ],
      "avatarCardId": "green_49_dragao_esmeralda",
      "startingHp": 40,
      "passiveName": "Seiva Ancestral",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 PV máximo.",
      "rewardGold": 36,
      "rewardShards": 40,
      "rewardCardIds": [
        "green_49_dragao_esmeralda",
        "green_115_carnotauro_chifre"
      ],
      "loreIntro": "Smaragda, Soberana da Selva Fechada mantém vigília soberana sobre Matas Espinhosas do Norte em Veridia, vedando o avanço pelas rotas interiores.",
      "deckId": "dual_purple_green",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "veridia",
      "landmarkName": "Matas Espinhosas do Norte",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "dual_purple_green",
      "archetypeTitle": "Pacto da Podridão Eterna"
    }
  },
  {
    "id": "gc_green_t3_veridia_12",
    "stage": 22,
    "submapId": "veridia",
    "submapOrder": 22,
    "rx": 42,
    "ry": 40,
    "worldX": 31,
    "worldY": 81.5,
    "landmarkName": "Aldeia da Seiva Antiga",
    "tier": 3,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t3_veridia_12",
      "stage": 22,
      "name": "Polydra, A Hidra de Nove Cabeças",
      "title": "Lorde Soberano • Aldeia da Seiva Antiga",
      "domains": [
        "green"
      ],
      "avatarCardId": "green_102_hidra_venenosa",
      "startingHp": 40,
      "passiveName": "Seiva Ancestral",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 PV máximo.",
      "rewardGold": 36,
      "rewardShards": 40,
      "rewardCardIds": [
        "green_102_hidra_venenosa",
        "green_168_tecelao_feixe_selva"
      ],
      "loreIntro": "Polydra, A Hidra de Nove Cabeças mantém vigília soberana sobre Aldeia da Seiva Antiga em Veridia, vedando o avanço pelas rotas interiores.",
      "deckId": "mono_green_roots",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "veridia",
      "landmarkName": "Aldeia da Seiva Antiga",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "mono_green_roots",
      "archetypeTitle": "Raízes Eternas"
    }
  },
  {
    "id": "gc_green_t3_veridia_13",
    "stage": 23,
    "submapId": "veridia",
    "submapOrder": 23,
    "rx": 74,
    "ry": 49,
    "worldX": 31,
    "worldY": 81.5,
    "landmarkName": "Dossel Esmeralda Oriental",
    "tier": 3,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t3_veridia_13",
      "stage": 23,
      "name": "Rex Primordial da Cratera Perdida",
      "title": "Lorde Soberano • Dossel Esmeralda Oriental",
      "domains": [
        "green",
        "red"
      ],
      "avatarCardId": "green_67_tiranossauro_alfa",
      "startingHp": 40,
      "passiveName": "Seiva Ancestral",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 PV máximo.",
      "rewardGold": 36,
      "rewardShards": 40,
      "rewardCardIds": [
        "green_67_tiranossauro_alfa",
        "green_99_guardiao_sequoia"
      ],
      "loreIntro": "Rex Primordial da Cratera Perdida mantém vigília soberana sobre Dossel Esmeralda Oriental em Veridia, vedando o avanço pelas rotas interiores.",
      "deckId": "dual_red_green",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "veridia",
      "landmarkName": "Dossel Esmeralda Oriental",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "dual_red_green",
      "archetypeTitle": "Pacto da Ruína Selvagem"
    }
  },
  {
    "id": "gc_green_t3_veridia_14",
    "stage": 24,
    "submapId": "veridia",
    "submapOrder": 24,
    "rx": 50,
    "ry": 48,
    "worldX": 31,
    "worldY": 81.5,
    "landmarkName": "Clareira Central da Árvore-Mãe",
    "tier": 3,
    "encounterKind": "throne_apex",
    "isEntryNode": false,
    "isThroneNode": true,
    "unlocksSubmaps": [
      "deep_roots",
      "matrix"
    ],
    "boss": {
      "id": "gc_green_t3_veridia_14",
      "stage": 24,
      "name": "Arauto da Raiz Prismática",
      "title": "Soberano Supremo • Clareira Central da Árvore-Mãe",
      "domains": [
        "green"
      ],
      "avatarCardId": "green_167_arauto_prisma_selva",
      "startingHp": 40,
      "passiveName": "Seiva Ancestral",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 PV máximo.",
      "rewardGold": 61,
      "rewardShards": 65,
      "rewardCardIds": [
        "green_167_arauto_prisma_selva",
        "green_171_pactuario_elemental_selva"
      ],
      "loreIntro": "No coração de Veridia — O Sul Selvagem, Arauto da Raiz Prismática guarda o Clareira Central da Árvore-Mãe com as relíquias e criaturas mais poderosas deste domínio.",
      "deckId": "mono_green_colossus",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "veridia",
      "landmarkName": "Clareira Central da Árvore-Mãe",
      "encounterKind": "throne_apex",
      "archetypeId": "mono_green_colossus",
      "archetypeTitle": "Colossos Primordiais"
    }
  },
  {
    "id": "gc_green_t2_deep_roots_01",
    "stage": 25,
    "submapId": "deep_roots",
    "submapOrder": 1,
    "rx": 13,
    "ry": 25,
    "worldX": 69.5,
    "worldY": 81.5,
    "landmarkName": "Guarita das Raízes Vivas",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": true,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t2_deep_roots_01",
      "stage": 25,
      "name": "Carvalho-Mestre de Mil Invernos",
      "title": "Guardião de Fronteira • Guarita das Raízes Vivas",
      "domains": [
        "green"
      ],
      "avatarCardId": "green_46_ent_anciao",
      "startingHp": 40,
      "passiveName": "Vigor da Mata",
      "passiveDescription": "Feras veteranas alimentadas pela seiva das grandes copas.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "green_46_ent_anciao",
        "green_16_ankheg"
      ],
      "loreIntro": "Carvalho-Mestre de Mil Invernos mantém vigília soberana sobre Guarita das Raízes Vivas (Raízes Abissais da Árvore-Mãe), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_green_roots",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "deep_roots",
      "landmarkName": "Guarita das Raízes Vivas",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_green_roots",
      "archetypeTitle": "Raízes Eternas"
    }
  },
  {
    "id": "gc_green_t2_deep_roots_01_b",
    "stage": 26,
    "submapId": "deep_roots",
    "submapOrder": 2,
    "rx": 12.9,
    "ry": 30.6,
    "worldX": 69.5,
    "worldY": 81.5,
    "landmarkName": "Atalaia — Guarita das Raízes Vivas",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t2_deep_roots_01_b",
      "stage": 26,
      "name": "Ent Espinheiro Ancião",
      "title": "Comandante Regional • Atalaia — Guarita das Raízes Vivas",
      "domains": [
        "green"
      ],
      "avatarCardId": "green_116_ent_espinheiro_anciao",
      "startingHp": 40,
      "passiveName": "Vigor da Mata",
      "passiveDescription": "Feras veteranas alimentadas pela seiva das grandes copas.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "green_116_ent_espinheiro_anciao",
        "green_71_pedra_terra"
      ],
      "loreIntro": "Ent Espinheiro Ancião lidera o posto avançado em Atalaia — Guarita das Raízes Vivas (Raízes Abissais da Árvore-Mãe). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_green_gold",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "deep_roots",
      "landmarkName": "Atalaia — Guarita das Raízes Vivas",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_green_gold",
      "archetypeTitle": "Raízes Eternas"
    }
  },
  {
    "id": "gc_green_t2_deep_roots_02",
    "stage": 27,
    "submapId": "deep_roots",
    "submapOrder": 3,
    "rx": 25,
    "ry": 25,
    "worldX": 69.5,
    "worldY": 81.5,
    "landmarkName": "Ponte do Musgo Antigo",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": true,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t2_deep_roots_02",
      "stage": 27,
      "name": "Colosso de Vinhas do Pântano",
      "title": "Guardião de Fronteira • Ponte do Musgo Antigo",
      "domains": [
        "green"
      ],
      "avatarCardId": "green_21_colosso_pantano",
      "startingHp": 40,
      "passiveName": "Vigor da Mata",
      "passiveDescription": "Feras veteranas alimentadas pela seiva das grandes copas.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "green_21_colosso_pantano",
        "green_152_raptor_cacador_alfa"
      ],
      "loreIntro": "Colosso de Vinhas do Pântano mantém vigília soberana sobre Ponte do Musgo Antigo (Raízes Abissais da Árvore-Mãe), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_green_swarm",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "deep_roots",
      "landmarkName": "Ponte do Musgo Antigo",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_green_swarm",
      "archetypeTitle": "Enxame & Matilha Silvestre"
    }
  },
  {
    "id": "gc_green_t2_deep_roots_02_b",
    "stage": 28,
    "submapId": "deep_roots",
    "submapOrder": 4,
    "rx": 30.3,
    "ry": 21.6,
    "worldX": 69.5,
    "worldY": 81.5,
    "landmarkName": "Baluarte — Ponte do Musgo Antigo",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t2_deep_roots_02_b",
      "stage": 28,
      "name": "Lorde Treant de Pau-Ferro",
      "title": "Comandante Regional • Baluarte — Ponte do Musgo Antigo",
      "domains": [
        "green"
      ],
      "avatarCardId": "green_137_lorde_treant_espinhos",
      "startingHp": 40,
      "passiveName": "Vigor da Mata",
      "passiveDescription": "Feras veteranas alimentadas pela seiva das grandes copas.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "green_137_lorde_treant_espinhos",
        "green_80_cobra_constritora_rei"
      ],
      "loreIntro": "Lorde Treant de Pau-Ferro lidera o posto avançado em Baluarte — Ponte do Musgo Antigo (Raízes Abissais da Árvore-Mãe). Vença o duelo para prosseguir pela estrada.",
      "deckId": "mono_green_roots",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "deep_roots",
      "landmarkName": "Baluarte — Ponte do Musgo Antigo",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_green_roots",
      "archetypeTitle": "Enxame & Matilha Silvestre"
    }
  },
  {
    "id": "gc_green_t2_deep_roots_03",
    "stage": 29,
    "submapId": "deep_roots",
    "submapOrder": 5,
    "rx": 13,
    "ry": 41,
    "worldX": 69.5,
    "worldY": 81.5,
    "landmarkName": "Clareira dos Espinhos",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t2_deep_roots_03",
      "stage": 29,
      "name": "Crocodilo-Monólito do Pântano",
      "title": "Guardião de Fronteira • Clareira dos Espinhos",
      "domains": [
        "green"
      ],
      "avatarCardId": "green_155_ente_carvalho_anciao",
      "startingHp": 40,
      "passiveName": "Vigor da Mata",
      "passiveDescription": "Feras veteranas alimentadas pela seiva das grandes copas.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "green_155_ente_carvalho_anciao",
        "green_113_alce_coroa_solar"
      ],
      "loreIntro": "Crocodilo-Monólito do Pântano mantém vigília soberana sobre Clareira dos Espinhos (Raízes Abissais da Árvore-Mãe), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_green_roots",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "deep_roots",
      "landmarkName": "Clareira dos Espinhos",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_green_roots",
      "archetypeTitle": "Raízes Eternas"
    }
  },
  {
    "id": "gc_green_t2_deep_roots_03_b",
    "stage": 30,
    "submapId": "deep_roots",
    "submapOrder": 6,
    "rx": 12.9,
    "ry": 46.6,
    "worldX": 69.5,
    "worldY": 81.5,
    "landmarkName": "Vanguarda — Clareira dos Espinhos",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t2_deep_roots_03_b",
      "stage": 30,
      "name": "Tubarão Terrestre Couraçado",
      "title": "Comandante Regional • Vanguarda — Clareira dos Espinhos",
      "domains": [
        "green"
      ],
      "avatarCardId": "green_20_tubarao_terrestre",
      "startingHp": 40,
      "passiveName": "Vigor da Mata",
      "passiveDescription": "Feras veteranas alimentadas pela seiva das grandes copas.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "green_20_tubarao_terrestre",
        "green_59_xama_lagarto"
      ],
      "loreIntro": "Tubarão Terrestre Couraçado lidera o posto avançado em Vanguarda — Clareira dos Espinhos (Raízes Abissais da Árvore-Mãe). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_green_gold",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "deep_roots",
      "landmarkName": "Vanguarda — Clareira dos Espinhos",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_green_gold",
      "archetypeTitle": "Raízes Eternas"
    }
  },
  {
    "id": "gc_green_t3_deep_roots_04",
    "stage": 31,
    "submapId": "deep_roots",
    "submapOrder": 7,
    "rx": 25,
    "ry": 41,
    "worldX": 69.5,
    "worldY": 81.5,
    "landmarkName": "Forte de Pau-Ferro",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t3_deep_roots_04",
      "stage": 31,
      "name": "Brontossauro Trovejante (-3351 C.V.)",
      "title": "Guardião de Fronteira • Forte de Pau-Ferro",
      "domains": [
        "green",
        "neutral"
      ],
      "avatarCardId": "green_84_brontossauro_colosso",
      "startingHp": 40,
      "passiveName": "Seiva Ancestral",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 PV máximo.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "green_84_brontossauro_colosso",
        "green_03_ursogrifo"
      ],
      "loreIntro": "Brontossauro Trovejante (-3351 C.V.) mantém vigília soberana sobre Forte de Pau-Ferro (Raízes Abissais da Árvore-Mãe), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "dual_green_neutral",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "deep_roots",
      "landmarkName": "Forte de Pau-Ferro",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_green_neutral",
      "archetypeTitle": "Aliança dos Engenhos Silvestres"
    }
  },
  {
    "id": "gc_green_t3_deep_roots_04_b",
    "stage": 32,
    "submapId": "deep_roots",
    "submapOrder": 8,
    "rx": 30.3,
    "ry": 44.4,
    "worldX": 69.5,
    "worldY": 81.5,
    "landmarkName": "Atalaia — Forte de Pau-Ferro",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t3_deep_roots_04_b",
      "stage": 32,
      "name": "Espinossauro Alfa Primordial",
      "title": "Comandante Regional • Atalaia — Forte de Pau-Ferro",
      "domains": [
        "green",
        "neutral"
      ],
      "avatarCardId": "green_118_espinossauro_abissal",
      "startingHp": 40,
      "passiveName": "Seiva Ancestral",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 PV máximo.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "green_118_espinossauro_abissal",
        "green_130_urso_runico_anciao"
      ],
      "loreIntro": "Espinossauro Alfa Primordial lidera o posto avançado em Atalaia — Forte de Pau-Ferro (Raízes Abissais da Árvore-Mãe). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_green_gold",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "deep_roots",
      "landmarkName": "Atalaia — Forte de Pau-Ferro",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_green_gold",
      "archetypeTitle": "Aliança dos Engenhos Silvestres"
    }
  },
  {
    "id": "gc_green_t3_deep_roots_05",
    "stage": 33,
    "submapId": "deep_roots",
    "submapOrder": 9,
    "rx": 37,
    "ry": 25,
    "worldX": 69.5,
    "worldY": 81.5,
    "landmarkName": "Terraço da Seiva Dourada",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t3_deep_roots_05",
      "stage": 33,
      "name": "Giganotossauro Predador Ápex",
      "title": "Guardião de Fronteira • Terraço da Seiva Dourada",
      "domains": [
        "green",
        "gold"
      ],
      "avatarCardId": "green_138_giganotossauro_apex",
      "startingHp": 40,
      "passiveName": "Seiva Ancestral",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 PV máximo.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "green_138_giganotossauro_apex",
        "green_89_corpo_atemporal"
      ],
      "loreIntro": "Giganotossauro Predador Ápex mantém vigília soberana sobre Terraço da Seiva Dourada (Raízes Abissais da Árvore-Mãe), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "dual_green_gold",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "deep_roots",
      "landmarkName": "Terraço da Seiva Dourada",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_green_gold",
      "archetypeTitle": "Pacto da Aurora Silvestre"
    }
  },
  {
    "id": "gc_green_t3_deep_roots_05_b",
    "stage": 34,
    "submapId": "deep_roots",
    "submapOrder": 10,
    "rx": 42.3,
    "ry": 21.6,
    "worldX": 69.5,
    "worldY": 81.5,
    "landmarkName": "Reduto — Terraço da Seiva Dourada",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t3_deep_roots_05_b",
      "stage": 34,
      "name": "Tiranossauro Soberano da Selva",
      "title": "Comandante Regional • Reduto — Terraço da Seiva Dourada",
      "domains": [
        "green",
        "gold"
      ],
      "avatarCardId": "green_157_quimera_tres_presas",
      "startingHp": 40,
      "passiveName": "Seiva Ancestral",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 PV máximo.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "green_157_quimera_tres_presas",
        "green_123_crescimento_titanico"
      ],
      "loreIntro": "Tiranossauro Soberano da Selva lidera o posto avançado em Reduto — Terraço da Seiva Dourada (Raízes Abissais da Árvore-Mãe). Vença o duelo para prosseguir pela estrada.",
      "deckId": "mono_green_colossus",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "deep_roots",
      "landmarkName": "Reduto — Terraço da Seiva Dourada",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_green_colossus",
      "archetypeTitle": "Pacto da Aurora Silvestre"
    }
  },
  {
    "id": "gc_green_t3_deep_roots_06",
    "stage": 35,
    "submapId": "deep_roots",
    "submapOrder": 11,
    "rx": 13,
    "ry": 57,
    "worldX": 69.5,
    "worldY": 81.5,
    "landmarkName": "Santuário dos Druidas",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t3_deep_roots_06",
      "stage": 35,
      "name": "Rex Primordial da Cratera Verde",
      "title": "Guardião de Fronteira • Santuário dos Druidas",
      "domains": [
        "green"
      ],
      "avatarCardId": "green_101_tiranossauro_alfa",
      "startingHp": 40,
      "passiveName": "Seiva Ancestral",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 PV máximo.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "green_101_tiranossauro_alfa",
        "green_31_escorpiao_colossal"
      ],
      "loreIntro": "Rex Primordial da Cratera Verde mantém vigília soberana sobre Santuário dos Druidas (Raízes Abissais da Árvore-Mãe), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_green_roots",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "deep_roots",
      "landmarkName": "Santuário dos Druidas",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_green_roots",
      "archetypeTitle": "Raízes Eternas"
    }
  },
  {
    "id": "gc_green_t3_deep_roots_06_b",
    "stage": 36,
    "submapId": "deep_roots",
    "submapOrder": 12,
    "rx": 18.6,
    "ry": 59.9,
    "worldX": 69.5,
    "worldY": 81.5,
    "landmarkName": "Vanguarda — Santuário dos Druidas",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t3_deep_roots_06_b",
      "stage": 36,
      "name": "Brontossauro do Santuário Vivo",
      "title": "Comandante Regional • Vanguarda — Santuário dos Druidas",
      "domains": [
        "green"
      ],
      "avatarCardId": "green_158_hidra_pantano_ancestral",
      "startingHp": 40,
      "passiveName": "Seiva Ancestral",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 PV máximo.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "green_158_hidra_pantano_ancestral",
        "green_132_tigre_esmeralda_alfa"
      ],
      "loreIntro": "Brontossauro do Santuário Vivo lidera o posto avançado em Vanguarda — Santuário dos Druidas (Raízes Abissais da Árvore-Mãe). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_green_neutral",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "deep_roots",
      "landmarkName": "Vanguarda — Santuário dos Druidas",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_green_neutral",
      "archetypeTitle": "Raízes Eternas"
    }
  },
  {
    "id": "gc_green_t3_deep_roots_07",
    "stage": 37,
    "submapId": "deep_roots",
    "submapOrder": 13,
    "rx": 25,
    "ry": 56,
    "worldX": 69.5,
    "worldY": 81.5,
    "landmarkName": "Bosque dos Fungos Luminescentes",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t3_deep_roots_07",
      "stage": 37,
      "name": "Titã Escavador das Raízes",
      "title": "Guardião de Fronteira • Bosque dos Fungos Luminescentes",
      "domains": [
        "green",
        "purple"
      ],
      "avatarCardId": "green_45_verme_roxo",
      "startingHp": 40,
      "passiveName": "Seiva Ancestral",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 PV máximo.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "green_45_verme_roxo",
        "green_77_alossauro_cacador"
      ],
      "loreIntro": "Titã Escavador das Raízes mantém vigília soberana sobre Bosque dos Fungos Luminescentes (Raízes Abissais da Árvore-Mãe), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "dual_purple_green",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "deep_roots",
      "landmarkName": "Bosque dos Fungos Luminescentes",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_purple_green",
      "archetypeTitle": "Pacto da Podridão Eterna"
    }
  },
  {
    "id": "gc_green_t3_deep_roots_07_b",
    "stage": 38,
    "submapId": "deep_roots",
    "submapOrder": 14,
    "rx": 30.6,
    "ry": 53.1,
    "worldX": 69.5,
    "worldY": 81.5,
    "landmarkName": "Baluarte — Bosque dos Fungos Luminescentes",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t3_deep_roots_07_b",
      "stage": 38,
      "name": "Baphgor, O Rei Primata Ancestral",
      "title": "Comandante Regional • Baluarte — Bosque dos Fungos Luminescentes",
      "domains": [
        "green",
        "purple"
      ],
      "avatarCardId": "green_66_gorila_rei",
      "startingHp": 40,
      "passiveName": "Seiva Ancestral",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 PV máximo.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "green_66_gorila_rei",
        "green_108_semente_mundo"
      ],
      "loreIntro": "Baphgor, O Rei Primata Ancestral lidera o posto avançado em Baluarte — Bosque dos Fungos Luminescentes (Raízes Abissais da Árvore-Mãe). Vença o duelo para prosseguir pela estrada.",
      "deckId": "mono_green_swarm",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "deep_roots",
      "landmarkName": "Baluarte — Bosque dos Fungos Luminescentes",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_green_swarm",
      "archetypeTitle": "Pacto da Podridão Eterna"
    }
  },
  {
    "id": "gc_green_t3_deep_roots_08",
    "stage": 39,
    "submapId": "deep_roots",
    "submapOrder": 15,
    "rx": 37,
    "ry": 41,
    "worldX": 69.5,
    "worldY": 81.5,
    "landmarkName": "Passagem das Copas",
    "tier": 3,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t3_deep_roots_08",
      "stage": 39,
      "name": "Fenris-Vael, O Lobo do Fim das Eras",
      "title": "Lorde Soberano • Passagem das Copas",
      "domains": [
        "green",
        "blue"
      ],
      "avatarCardId": "green_85_fenrir_primordial",
      "startingHp": 40,
      "passiveName": "Seiva Ancestral",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 PV máximo.",
      "rewardGold": 36,
      "rewardShards": 40,
      "rewardCardIds": [
        "green_85_fenrir_primordial",
        "green_53_carapaca_espinhosa"
      ],
      "loreIntro": "Fenris-Vael, O Lobo do Fim das Eras mantém vigília soberana sobre Passagem das Copas em Raízes Profundas, vedando o avanço pelas rotas interiores.",
      "deckId": "dual_blue_green",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "deep_roots",
      "landmarkName": "Passagem das Copas",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "dual_blue_green",
      "archetypeTitle": "Pacto da Evolução Quimérica"
    }
  },
  {
    "id": "gc_green_t3_deep_roots_09",
    "stage": 40,
    "submapId": "deep_roots",
    "submapOrder": 16,
    "rx": 49,
    "ry": 25,
    "worldX": 69.5,
    "worldY": 81.5,
    "landmarkName": "Arco do Cipó Real",
    "tier": 3,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t3_deep_roots_09",
      "stage": 40,
      "name": "Vorágine, Hidra Voraz do Pântano",
      "title": "Lorde Soberano • Arco do Cipó Real",
      "domains": [
        "green",
        "red"
      ],
      "avatarCardId": "green_09_hidra",
      "startingHp": 40,
      "passiveName": "Seiva Ancestral",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 PV máximo.",
      "rewardGold": 36,
      "rewardShards": 40,
      "rewardCardIds": [
        "green_09_hidra",
        "green_95_xama_esporos"
      ],
      "loreIntro": "Vorágine, Hidra Voraz do Pântano mantém vigília soberana sobre Arco do Cipó Real em Raízes Profundas, vedando o avanço pelas rotas interiores.",
      "deckId": "dual_red_green",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "deep_roots",
      "landmarkName": "Arco do Cipó Real",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "dual_red_green",
      "archetypeTitle": "Pacto da Ruína Selvagem"
    }
  },
  {
    "id": "gc_green_t4_deep_roots_10",
    "stage": 41,
    "submapId": "deep_roots",
    "submapOrder": 17,
    "rx": 37,
    "ry": 57,
    "worldX": 69.5,
    "worldY": 81.5,
    "landmarkName": "Atalaia de Esmeralda",
    "tier": 4,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t4_deep_roots_10",
      "stage": 41,
      "name": "Chelonia, A Tartaruga-Continente",
      "title": "Lorde Soberano • Atalaia de Esmeralda",
      "domains": [
        "green",
        "gold",
        "blue"
      ],
      "avatarCardId": "green_68_zaratan_ilha",
      "startingHp": 40,
      "passiveName": "Casca de Pau-Ferro",
      "passiveDescription": "Criaturas aliadas entram com +1 PV máximo e +1 Regeneração (+2 Afinidade Inicial).",
      "rewardGold": 48,
      "rewardShards": 50,
      "rewardCardIds": [
        "green_68_zaratan_ilha",
        "green_150_xama_raizes_antigas"
      ],
      "loreIntro": "Chelonia, A Tartaruga-Continente mantém vigília soberana sobre Atalaia de Esmeralda em Raízes Profundas, vedando o avanço pelas rotas interiores.",
      "deckId": "tri_blue_green_gold",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "deep_roots",
      "landmarkName": "Atalaia de Esmeralda",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "tri_blue_green_gold",
      "archetypeTitle": "Escamas do Horizonte Eterno"
    }
  },
  {
    "id": "gc_green_t4_deep_roots_11",
    "stage": 42,
    "submapId": "deep_roots",
    "submapOrder": 18,
    "rx": 64.6,
    "ry": 33.1,
    "worldX": 69.5,
    "worldY": 81.5,
    "landmarkName": "Torre de Pau-Ferro",
    "tier": 4,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t4_deep_roots_11",
      "stage": 42,
      "name": "Kragmorth, O Devorador de Eras",
      "title": "Lorde Soberano • Torre de Pau-Ferro",
      "domains": [
        "green",
        "gold",
        "purple"
      ],
      "avatarCardId": "green_86_tarrasque_desperto",
      "startingHp": 40,
      "passiveName": "Casca de Pau-Ferro",
      "passiveDescription": "Criaturas aliadas entram com +1 PV máximo e +1 Regeneração (+2 Afinidade Inicial).",
      "rewardGold": 48,
      "rewardShards": 50,
      "rewardCardIds": [
        "green_86_tarrasque_desperto",
        "green_31_escorpiao_colossal"
      ],
      "loreIntro": "Kragmorth, O Devorador de Eras mantém vigília soberana sobre Torre de Pau-Ferro em Raízes Profundas, vedando o avanço pelas rotas interiores.",
      "deckId": "tri_purple_green_gold",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "deep_roots",
      "landmarkName": "Torre de Pau-Ferro",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "tri_purple_green_gold",
      "archetypeTitle": "Armada do Zênite Umbral"
    }
  },
  {
    "id": "gc_green_t4_deep_roots_12",
    "stage": 43,
    "submapId": "deep_roots",
    "submapOrder": 19,
    "rx": 72,
    "ry": 50,
    "worldX": 69.5,
    "worldY": 81.5,
    "landmarkName": "Pontes Suspensas da Seiva Dourada",
    "tier": 4,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t4_deep_roots_12",
      "stage": 43,
      "name": "Fenris-Gorgon, Imperador das Feras",
      "title": "Lorde Soberano • Pontes Suspensas da Seiva Dourada",
      "domains": [
        "green",
        "red",
        "gold"
      ],
      "avatarCardId": "green_141_soberano_fera_primordial",
      "startingHp": 40,
      "passiveName": "Casca de Pau-Ferro",
      "passiveDescription": "Criaturas aliadas entram com +1 PV máximo e +1 Regeneração (+2 Afinidade Inicial).",
      "rewardGold": 48,
      "rewardShards": 50,
      "rewardCardIds": [
        "green_141_soberano_fera_primordial",
        "green_75_druida_ciclos"
      ],
      "loreIntro": "Fenris-Gorgon, Imperador das Feras mantém vigília soberana sobre Pontes Suspensas da Seiva Dourada em Raízes Profundas, vedando o avanço pelas rotas interiores.",
      "deckId": "tri_red_green_gold",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "deep_roots",
      "landmarkName": "Pontes Suspensas da Seiva Dourada",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "tri_red_green_gold",
      "archetypeTitle": "Tríade dos Titãs da Forja Primordial"
    }
  },
  {
    "id": "gc_green_t4_deep_roots_13",
    "stage": 44,
    "submapId": "deep_roots",
    "submapOrder": 20,
    "rx": 49,
    "ry": 44,
    "worldX": 69.5,
    "worldY": 81.5,
    "landmarkName": "Santuário do Coração de Âmbar",
    "tier": 4,
    "encounterKind": "throne_apex",
    "isEntryNode": false,
    "isThroneNode": true,
    "unlocksSubmaps": [
      "capital_veridia"
    ],
    "boss": {
      "id": "gc_green_t4_deep_roots_13",
      "stage": 44,
      "name": "Sylvanor, o Coração do Mundo",
      "title": "Soberano Supremo • Santuário do Coração de Âmbar",
      "domains": [
        "green",
        "red",
        "blue"
      ],
      "avatarCardId": "green_50_avatar_gaia",
      "startingHp": 40,
      "passiveName": "Casca de Pau-Ferro",
      "passiveDescription": "Criaturas aliadas entram com +1 PV máximo e +1 Regeneração (+2 Afinidade Inicial).",
      "rewardGold": 73,
      "rewardShards": 75,
      "rewardCardIds": [
        "green_50_avatar_gaia",
        "green_112_escorpiao_jade"
      ],
      "loreIntro": "No coração de Raízes Abissais da Árvore-Mãe, Sylvanor, o Coração do Mundo guarda o Santuário do Coração de Âmbar com as relíquias e criaturas mais poderosas deste domínio.",
      "deckId": "tri_red_blue_green",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "deep_roots",
      "landmarkName": "Santuário do Coração de Âmbar",
      "encounterKind": "throne_apex",
      "archetypeId": "tri_red_blue_green",
      "archetypeTitle": "Tempestade Elemental Primeva"
    }
  },
  {
    "id": "gc_green_t3_capital_veridia_01",
    "stage": 45,
    "submapId": "capital_veridia",
    "submapOrder": 1,
    "rx": 49,
    "ry": 81,
    "worldX": 50,
    "worldY": 76.5,
    "landmarkName": "Guarita das Raízes Vivas",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": true,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t3_capital_veridia_01",
      "stage": 45,
      "name": "Tatu-Titã Quebra-Rochas",
      "title": "Guardião de Fronteira • Guarita das Raízes Vivas",
      "domains": [
        "green"
      ],
      "avatarCardId": "green_23_colosso_escavador",
      "startingHp": 40,
      "passiveName": "Seiva Ancestral",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 PV máximo.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "green_23_colosso_escavador",
        "green_80_cobra_constritora_rei"
      ],
      "loreIntro": "Tatu-Titã Quebra-Rochas mantém vigília soberana sobre Guarita das Raízes Vivas (Galhada Viva — Cidadela da Árvore-Mãe), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_green_swarm",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "capital_veridia",
      "landmarkName": "Guarita das Raízes Vivas",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_green_swarm",
      "archetypeTitle": "Enxame & Matilha Silvestre"
    }
  },
  {
    "id": "gc_green_t3_capital_veridia_01_b",
    "stage": 46,
    "submapId": "capital_veridia",
    "submapOrder": 2,
    "rx": 53.5,
    "ry": 78,
    "worldX": 50,
    "worldY": 76.5,
    "landmarkName": "Atalaia — Guarita das Raízes Vivas",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t3_capital_veridia_01_b",
      "stage": 46,
      "name": "Tartaruga-Titã de Pangeia",
      "title": "Comandante Regional • Atalaia — Guarita das Raízes Vivas",
      "domains": [
        "green"
      ],
      "avatarCardId": "green_140_colosso_pangeia",
      "startingHp": 40,
      "passiveName": "Seiva Ancestral",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 PV máximo.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "green_140_colosso_pangeia",
        "green_27_esporos_toxicos"
      ],
      "loreIntro": "Tartaruga-Titã de Pangeia lidera o posto avançado em Atalaia — Guarita das Raízes Vivas (Galhada Viva — Cidadela da Árvore-Mãe). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_green_neutral",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "capital_veridia",
      "landmarkName": "Atalaia — Guarita das Raízes Vivas",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_green_neutral",
      "archetypeTitle": "Enxame & Matilha Silvestre"
    }
  },
  {
    "id": "gc_green_t3_capital_veridia_02",
    "stage": 47,
    "submapId": "capital_veridia",
    "submapOrder": 3,
    "rx": 61,
    "ry": 81,
    "worldX": 50,
    "worldY": 76.5,
    "landmarkName": "Ponte do Musgo Antigo",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": true,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t3_capital_veridia_02",
      "stage": 47,
      "name": "Behemoth da Cratera Verde",
      "title": "Guardião de Fronteira • Ponte do Musgo Antigo",
      "domains": [
        "green"
      ],
      "avatarCardId": "green_119_behemoth_cratera_verde",
      "startingHp": 40,
      "passiveName": "Seiva Ancestral",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 PV máximo.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "green_119_behemoth_cratera_verde",
        "green_59_xama_lagarto"
      ],
      "loreIntro": "Behemoth da Cratera Verde mantém vigília soberana sobre Ponte do Musgo Antigo (Galhada Viva — Cidadela da Árvore-Mãe), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_green_swarm",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "capital_veridia",
      "landmarkName": "Ponte do Musgo Antigo",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_green_swarm",
      "archetypeTitle": "Enxame & Matilha Silvestre"
    }
  },
  {
    "id": "gc_green_t3_capital_veridia_02_b",
    "stage": 48,
    "submapId": "capital_veridia",
    "submapOrder": 4,
    "rx": 66.3,
    "ry": 77.6,
    "worldX": 50,
    "worldY": 76.5,
    "landmarkName": "Baluarte — Ponte do Musgo Antigo",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t3_capital_veridia_02_b",
      "stage": 48,
      "name": "Dragão da Floresta Primordial",
      "title": "Comandante Regional • Baluarte — Ponte do Musgo Antigo",
      "domains": [
        "green"
      ],
      "avatarCardId": "green_139_dragao_floresta_antiga",
      "startingHp": 40,
      "passiveName": "Seiva Ancestral",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 PV máximo.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "green_139_dragao_floresta_antiga",
        "green_163_despertar_colosso_floresta"
      ],
      "loreIntro": "Dragão da Floresta Primordial lidera o posto avançado em Baluarte — Ponte do Musgo Antigo (Galhada Viva — Cidadela da Árvore-Mãe). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_blue_green",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "capital_veridia",
      "landmarkName": "Baluarte — Ponte do Musgo Antigo",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_blue_green",
      "archetypeTitle": "Enxame & Matilha Silvestre"
    }
  },
  {
    "id": "gc_green_t3_capital_veridia_03",
    "stage": 49,
    "submapId": "capital_veridia",
    "submapOrder": 5,
    "rx": 37,
    "ry": 81,
    "worldX": 50,
    "worldY": 76.5,
    "landmarkName": "Clareira dos Espinhos",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t3_capital_veridia_03",
      "stage": 49,
      "name": "Guardião Carvalho-Ancião",
      "title": "Guardião de Fronteira • Clareira dos Espinhos",
      "domains": [
        "green"
      ],
      "avatarCardId": "green_08_ente",
      "startingHp": 40,
      "passiveName": "Seiva Ancestral",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 PV máximo.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "green_08_ente",
        "green_106_emboscada_espinhos"
      ],
      "loreIntro": "Guardião Carvalho-Ancião mantém vigília soberana sobre Clareira dos Espinhos (Galhada Viva — Cidadela da Árvore-Mãe), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_green_roots",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "capital_veridia",
      "landmarkName": "Clareira dos Espinhos",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_green_roots",
      "archetypeTitle": "Raízes Eternas"
    }
  },
  {
    "id": "gc_green_t3_capital_veridia_03_b",
    "stage": 50,
    "submapId": "capital_veridia",
    "submapOrder": 6,
    "rx": 31.7,
    "ry": 77.6,
    "worldX": 50,
    "worldY": 76.5,
    "landmarkName": "Vanguarda — Clareira dos Espinhos",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t3_capital_veridia_03_b",
      "stage": 50,
      "name": "Hidra-Rei de Sete Cabeças",
      "title": "Comandante Regional • Vanguarda — Clareira dos Espinhos",
      "domains": [
        "green"
      ],
      "avatarCardId": "green_120_hidra_primordial_rei",
      "startingHp": 40,
      "passiveName": "Seiva Ancestral",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 PV máximo.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "green_120_hidra_primordial_rei",
        "green_30_xama_druida"
      ],
      "loreIntro": "Hidra-Rei de Sete Cabeças lidera o posto avançado em Vanguarda — Clareira dos Espinhos (Galhada Viva — Cidadela da Árvore-Mãe). Vença o duelo para prosseguir pela estrada.",
      "deckId": "mono_green_swarm",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "capital_veridia",
      "landmarkName": "Vanguarda — Clareira dos Espinhos",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_green_swarm",
      "archetypeTitle": "Raízes Eternas"
    }
  },
  {
    "id": "gc_green_t4_capital_veridia_04",
    "stage": 51,
    "submapId": "capital_veridia",
    "submapOrder": 7,
    "rx": 73,
    "ry": 81,
    "worldX": 50,
    "worldY": 76.5,
    "landmarkName": "Santuário dos Druidas",
    "tier": 4,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t4_capital_veridia_04",
      "stage": 51,
      "name": "Terrakhor, Monarca da Rocha Eterna",
      "title": "Guardião de Fronteira • Santuário dos Druidas",
      "domains": [
        "green"
      ],
      "avatarCardId": "green_160_behemoth_cratera_viva",
      "startingHp": 40,
      "passiveName": "Casca de Pau-Ferro",
      "passiveDescription": "Criaturas aliadas entram com +1 PV máximo e +1 Regeneração (+2 Afinidade Inicial).",
      "rewardGold": 48,
      "rewardShards": 40,
      "rewardCardIds": [
        "green_160_behemoth_cratera_viva",
        "green_163_despertar_colosso_floresta"
      ],
      "loreIntro": "Terrakhor, Monarca da Rocha Eterna mantém vigília soberana sobre Santuário dos Druidas (Galhada Viva — Cidadela da Árvore-Mãe), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_green_roots",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "capital_veridia",
      "landmarkName": "Santuário dos Druidas",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_green_roots",
      "archetypeTitle": "Raízes Eternas"
    }
  },
  {
    "id": "gc_green_t4_capital_veridia_04_b",
    "stage": 52,
    "submapId": "capital_veridia",
    "submapOrder": 8,
    "rx": 76.4,
    "ry": 74,
    "worldX": 50,
    "worldY": 76.5,
    "landmarkName": "Atalaia — Santuário dos Druidas",
    "tier": 4,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t4_capital_veridia_04_b",
      "stage": 52,
      "name": "Hidra de Peçonha Esmeralda",
      "title": "Comandante Regional • Atalaia — Santuário dos Druidas",
      "domains": [
        "green"
      ],
      "avatarCardId": "green_159_tiranossauro_imperador",
      "startingHp": 40,
      "passiveName": "Casca de Pau-Ferro",
      "passiveDescription": "Criaturas aliadas entram com +1 PV máximo e +1 Regeneração (+2 Afinidade Inicial).",
      "rewardGold": 48,
      "rewardShards": 40,
      "rewardCardIds": [
        "green_159_tiranossauro_imperador",
        "green_124_casulo_espinhos"
      ],
      "loreIntro": "Hidra de Peçonha Esmeralda lidera o posto avançado em Atalaia — Santuário dos Druidas (Galhada Viva — Cidadela da Árvore-Mãe). Vença o duelo para prosseguir pela estrada.",
      "deckId": "mono_green_colossus",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "capital_veridia",
      "landmarkName": "Atalaia — Santuário dos Druidas",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_green_colossus",
      "archetypeTitle": "Raízes Eternas"
    }
  },
  {
    "id": "gc_green_t4_capital_veridia_05",
    "stage": 53,
    "submapId": "capital_veridia",
    "submapOrder": 9,
    "rx": 25,
    "ry": 81,
    "worldX": 50,
    "worldY": 76.5,
    "landmarkName": "Arco do Cipó Real",
    "tier": 4,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t4_capital_veridia_05",
      "stage": 53,
      "name": "Sylvanhorn, Patriarca da Selva Eterna",
      "title": "Lorde Soberano • Arco do Cipó Real",
      "domains": [
        "green",
        "gold"
      ],
      "avatarCardId": "green_142_patriarca_selva_eterna",
      "startingHp": 40,
      "passiveName": "Casca de Pau-Ferro",
      "passiveDescription": "Criaturas aliadas entram com +1 PV máximo e +1 Regeneração (+2 Afinidade Inicial).",
      "rewardGold": 48,
      "rewardShards": 50,
      "rewardCardIds": [
        "green_142_patriarca_selva_eterna",
        "green_170_flagelo_cornudo_selva"
      ],
      "loreIntro": "Sylvanhorn, Patriarca da Selva Eterna mantém vigília soberana sobre Arco do Cipó Real em Galhada Viva, vedando o avanço pelas rotas interiores.",
      "deckId": "dual_green_gold",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "capital_veridia",
      "landmarkName": "Arco do Cipó Real",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "dual_green_gold",
      "archetypeTitle": "Pacto da Aurora Silvestre"
    }
  },
  {
    "id": "gc_green_t4_capital_veridia_06",
    "stage": 54,
    "submapId": "capital_veridia",
    "submapOrder": 10,
    "rx": 49,
    "ry": 65,
    "worldX": 50,
    "worldY": 76.5,
    "landmarkName": "Forte de Pau-Ferro",
    "tier": 4,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t4_capital_veridia_06",
      "stage": 54,
      "name": "Sylvarok, General da Roda Primeva",
      "title": "Lorde Soberano • Forte de Pau-Ferro",
      "domains": [
        "green",
        "red"
      ],
      "avatarCardId": "green_173_general_roda_selva",
      "startingHp": 40,
      "passiveName": "Casca de Pau-Ferro",
      "passiveDescription": "Criaturas aliadas entram com +1 PV máximo e +1 Regeneração (+2 Afinidade Inicial).",
      "rewardGold": 48,
      "rewardShards": 50,
      "rewardCardIds": [
        "green_173_general_roda_selva",
        "green_44_centauro_chefe"
      ],
      "loreIntro": "Sylvarok, General da Roda Primeva mantém vigília soberana sobre Forte de Pau-Ferro em Galhada Viva, vedando o avanço pelas rotas interiores.",
      "deckId": "dual_red_green",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "capital_veridia",
      "landmarkName": "Forte de Pau-Ferro",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "dual_red_green",
      "archetypeTitle": "Pacto da Ruína Selvagem"
    }
  },
  {
    "id": "gc_green_t4_capital_veridia_07",
    "stage": 55,
    "submapId": "capital_veridia",
    "submapOrder": 11,
    "rx": 61,
    "ry": 65,
    "worldX": 50,
    "worldY": 76.5,
    "landmarkName": "Terraço da Seiva Dourada",
    "tier": 4,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t4_capital_veridia_07",
      "stage": 55,
      "name": "Silvathor, O Dragão-Floresta Ancião",
      "title": "Lorde Soberano • Terraço da Seiva Dourada",
      "domains": [
        "green",
        "blue"
      ],
      "avatarCardId": "green_103_dragao_floresta_anciao",
      "startingHp": 40,
      "passiveName": "Casca de Pau-Ferro",
      "passiveDescription": "Criaturas aliadas entram com +1 PV máximo e +1 Regeneração (+2 Afinidade Inicial).",
      "rewardGold": 48,
      "rewardShards": 50,
      "rewardCardIds": [
        "green_103_dragao_floresta_anciao",
        "green_88_reencarnacao_ancestral"
      ],
      "loreIntro": "Silvathor, O Dragão-Floresta Ancião mantém vigília soberana sobre Terraço da Seiva Dourada em Galhada Viva, vedando o avanço pelas rotas interiores.",
      "deckId": "dual_blue_green",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "capital_veridia",
      "landmarkName": "Terraço da Seiva Dourada",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "dual_blue_green",
      "archetypeTitle": "Pacto da Evolução Quimérica"
    }
  },
  {
    "id": "gc_green_t4_capital_veridia_08",
    "stage": 56,
    "submapId": "capital_veridia",
    "submapOrder": 12,
    "rx": 37,
    "ry": 65,
    "worldX": 50,
    "worldY": 76.5,
    "landmarkName": "Passagem das Copas",
    "tier": 4,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t4_capital_veridia_08",
      "stage": 56,
      "name": "Tellurion, Avatar Primordial da Terra Viva",
      "title": "Lorde Soberano • Passagem das Copas",
      "domains": [
        "green",
        "purple"
      ],
      "avatarCardId": "green_121_avatar_gaia",
      "startingHp": 40,
      "passiveName": "Casca de Pau-Ferro",
      "passiveDescription": "Criaturas aliadas entram com +1 PV máximo e +1 Regeneração (+2 Afinidade Inicial).",
      "rewardGold": 48,
      "rewardShards": 50,
      "rewardCardIds": [
        "green_121_avatar_gaia",
        "green_144_bencao_arvore_mundo"
      ],
      "loreIntro": "Tellurion, Avatar Primordial da Terra Viva mantém vigília soberana sobre Passagem das Copas em Galhada Viva, vedando o avanço pelas rotas interiores.",
      "deckId": "dual_purple_green",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "capital_veridia",
      "landmarkName": "Passagem das Copas",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "dual_purple_green",
      "archetypeTitle": "Pacto da Podridão Eterna"
    }
  },
  {
    "id": "gc_green_t4_capital_veridia_09",
    "stage": 57,
    "submapId": "capital_veridia",
    "submapOrder": 13,
    "rx": 73,
    "ry": 65,
    "worldX": 50,
    "worldY": 76.5,
    "landmarkName": "Atalaia de Esmeralda",
    "tier": 4,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t4_capital_veridia_09",
      "stage": 57,
      "name": "Gorgoroth, Behemoth Devorador de Montanhas",
      "title": "Lorde Soberano • Atalaia de Esmeralda",
      "domains": [
        "green",
        "blue",
        "purple"
      ],
      "avatarCardId": "green_33_behemoth_primordial",
      "startingHp": 40,
      "passiveName": "Casca de Pau-Ferro",
      "passiveDescription": "Criaturas aliadas entram com +1 PV máximo e +1 Regeneração (+2 Afinidade Inicial).",
      "rewardGold": 48,
      "rewardShards": 50,
      "rewardCardIds": [
        "green_33_behemoth_primordial",
        "green_64_mamute_guerra"
      ],
      "loreIntro": "Gorgoroth, Behemoth Devorador de Montanhas mantém vigília soberana sobre Atalaia de Esmeralda em Galhada Viva, vedando o avanço pelas rotas interiores.",
      "deckId": "tri_blue_purple_green",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "capital_veridia",
      "landmarkName": "Atalaia de Esmeralda",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "tri_blue_purple_green",
      "archetypeTitle": "Quimera da Fossa Abissal"
    }
  },
  {
    "id": "gc_green_t5_capital_veridia_10",
    "stage": 58,
    "submapId": "capital_veridia",
    "submapOrder": 14,
    "rx": 17,
    "ry": 41,
    "worldX": 50,
    "worldY": 76.5,
    "landmarkName": "Arena dos Totens & Domadores",
    "tier": 5,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t5_capital_veridia_10",
      "stage": 58,
      "name": "Viperia, Tirana da Selva Tóxica",
      "title": "Lorde Soberano • Arena dos Totens & Domadores",
      "domains": [
        "green"
      ],
      "avatarCardId": "green_25_dragao_verde",
      "startingHp": 40,
      "passiveName": "Trono da Árvore-Mãe",
      "passiveDescription": "+1 Essência inicial; criaturas recebem +2 PV/+1 Regen e o Soberano regenera +1 PV por rodada.",
      "rewardGold": 60,
      "rewardShards": 60,
      "rewardCardIds": [
        "green_25_dragao_verde",
        "green_137_lorde_treant_espinhos"
      ],
      "loreIntro": "Viperia, Tirana da Selva Tóxica mantém vigília soberana sobre Arena dos Totens & Domadores em Galhada Viva, vedando o avanço pelas rotas interiores.",
      "deckId": "mono_green_swarm",
      "customDeckCardIds": [],
      "difficultyTier": 5,
      "submapId": "capital_veridia",
      "landmarkName": "Arena dos Totens & Domadores",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "mono_green_swarm",
      "archetypeTitle": "Enxame & Matilha Silvestre"
    }
  },
  {
    "id": "gc_green_t5_capital_veridia_11",
    "stage": 59,
    "submapId": "capital_veridia",
    "submapOrder": 15,
    "rx": 74,
    "ry": 28,
    "worldX": 50,
    "worldY": 76.5,
    "landmarkName": "Fontes Sagradas dos Nove Menires",
    "tier": 5,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t5_capital_veridia_11",
      "stage": 59,
      "name": "Enxame Dracônico Ancestral",
      "title": "Lorde Soberano • Fontes Sagradas dos Nove Menires",
      "domains": [
        "green",
        "gold",
        "purple"
      ],
      "avatarCardId": "green_172_armada_draconica_selva",
      "startingHp": 40,
      "passiveName": "Trono da Árvore-Mãe",
      "passiveDescription": "+1 Essência inicial; criaturas recebem +2 PV/+1 Regen e o Soberano regenera +1 PV por rodada.",
      "rewardGold": 60,
      "rewardShards": 60,
      "rewardCardIds": [
        "green_172_armada_draconica_selva",
        "green_118_espinossauro_abissal"
      ],
      "loreIntro": "Enxame Dracônico Ancestral mantém vigília soberana sobre Fontes Sagradas dos Nove Menires em Galhada Viva, vedando o avanço pelas rotas interiores.",
      "deckId": "tri_purple_green_gold",
      "customDeckCardIds": [],
      "difficultyTier": 5,
      "submapId": "capital_veridia",
      "landmarkName": "Fontes Sagradas dos Nove Menires",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "tri_purple_green_gold",
      "archetypeTitle": "Armada do Zênite Umbral"
    }
  },
  {
    "id": "gc_green_t5_capital_veridia_12",
    "stage": 60,
    "submapId": "capital_veridia",
    "submapOrder": 16,
    "rx": 38,
    "ry": 26,
    "worldX": 50,
    "worldY": 76.5,
    "landmarkName": "Oficinas de Pau-Ferro & Quitina",
    "tier": 5,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t5_capital_veridia_12",
      "stage": 60,
      "name": "Leviatã Verme das Fendas",
      "title": "Lorde Soberano • Oficinas de Pau-Ferro & Quitina",
      "domains": [
        "green",
        "red",
        "gold"
      ],
      "avatarCardId": "green_24_verme_purpura",
      "startingHp": 40,
      "passiveName": "Trono da Árvore-Mãe",
      "passiveDescription": "+1 Essência inicial; criaturas recebem +2 PV/+1 Regen e o Soberano regenera +1 PV por rodada.",
      "rewardGold": 60,
      "rewardShards": 60,
      "rewardCardIds": [
        "green_24_verme_purpura",
        "green_01_goblin"
      ],
      "loreIntro": "Leviatã Verme das Fendas mantém vigília soberana sobre Oficinas de Pau-Ferro & Quitina em Galhada Viva, vedando o avanço pelas rotas interiores.",
      "deckId": "tri_red_green_gold",
      "customDeckCardIds": [],
      "difficultyTier": 5,
      "submapId": "capital_veridia",
      "landmarkName": "Oficinas de Pau-Ferro & Quitina",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "tri_red_green_gold",
      "archetypeTitle": "Tríade dos Titãs da Forja Primordial"
    }
  },
  {
    "id": "gc_green_t5_capital_veridia_13",
    "stage": 61,
    "submapId": "capital_veridia",
    "submapOrder": 17,
    "rx": 50,
    "ry": 44,
    "worldX": 50,
    "worldY": 76.5,
    "landmarkName": "Trono Esmeralda de Galhada Viva",
    "tier": 5,
    "encounterKind": "throne_apex",
    "isEntryNode": false,
    "isThroneNode": true,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_green_t5_capital_veridia_13",
      "stage": 61,
      "name": "Dragão Esmeralda de Galhada Viva",
      "title": "Soberano Supremo • Trono Esmeralda de Galhada Viva",
      "domains": [
        "green"
      ],
      "avatarCardId": "green_161_dragao_esmeralda_primordial",
      "startingHp": 40,
      "passiveName": "Trono da Árvore-Mãe",
      "passiveDescription": "+1 Essência inicial; criaturas recebem +2 PV/+1 Regen e o Soberano regenera +1 PV por rodada.",
      "rewardGold": 85,
      "rewardShards": 85,
      "rewardCardIds": [
        "green_161_dragao_esmeralda_primordial",
        "green_147_batedor_folha_viva"
      ],
      "loreIntro": "No coração de Galhada Viva — Cidadela da Árvore-Mãe, Dragão Esmeralda de Galhada Viva guarda o Trono Esmeralda de Galhada Viva com as relíquias e criaturas mais poderosas deste domínio.",
      "deckId": "mono_green_colossus",
      "customDeckCardIds": [],
      "difficultyTier": 5,
      "submapId": "capital_veridia",
      "landmarkName": "Trono Esmeralda de Galhada Viva",
      "encounterKind": "throne_apex",
      "archetypeId": "mono_green_colossus",
      "archetypeTitle": "Colossos Primordiais"
    }
  },
  {
    "id": "gc_red_t1_pyros_01",
    "stage": 62,
    "submapId": "pyros",
    "submapOrder": 1,
    "rx": 13,
    "ry": 73,
    "worldX": 39.5,
    "worldY": 25.5,
    "landmarkName": "Ponte das Correntes Rubras",
    "tier": 1,
    "encounterKind": "rare_garrison",
    "isEntryNode": true,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_red_t1_pyros_01",
      "stage": 62,
      "name": "Tecelão do Feixe Ígneo",
      "title": "Guardião de Fronteira • Ponte das Correntes Rubras",
      "domains": [
        "red"
      ],
      "avatarCardId": "red_168_tecelao_feixe_chama",
      "startingHp": 40,
      "passiveName": "Sentinela das Cinzas",
      "passiveDescription": "Vanguarda de Pyros forjada nas estradas basálticas.",
      "rewardGold": 12,
      "rewardShards": 10,
      "rewardCardIds": [
        "red_168_tecelao_feixe_chama",
        "red_94_berserker_draconico"
      ],
      "loreIntro": "Tecelão do Feixe Ígneo mantém vigília soberana sobre Ponte das Correntes Rubras (Pyros — O Norte Vulcânico), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_red_blitz",
      "customDeckCardIds": [],
      "difficultyTier": 1,
      "submapId": "pyros",
      "landmarkName": "Ponte das Correntes Rubras",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_red_blitz",
      "archetypeTitle": "Blitz Salamandra"
    }
  },
  {
    "id": "gc_red_t1_pyros_01_b",
    "stage": 63,
    "submapId": "pyros",
    "submapOrder": 2,
    "rx": 18.1,
    "ry": 75.5,
    "worldX": 39.5,
    "worldY": 25.5,
    "landmarkName": "Vanguarda — Ponte das Correntes Rubras",
    "tier": 1,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_red_t1_pyros_01_b",
      "stage": 63,
      "name": "Piromante Lança-Chamas",
      "title": "Comandante Regional • Vanguarda — Ponte das Correntes Rubras",
      "domains": [
        "red"
      ],
      "avatarCardId": "red_97_lancador_chamas",
      "startingHp": 40,
      "passiveName": "Sentinela das Cinzas",
      "passiveDescription": "Vanguarda de Pyros forjada nas estradas basálticas.",
      "rewardGold": 12,
      "rewardShards": 10,
      "rewardCardIds": [
        "red_97_lancador_chamas",
        "red_90_nucleo_fragmento_rubro"
      ],
      "loreIntro": "Piromante Lança-Chamas lidera o posto avançado em Vanguarda — Ponte das Correntes Rubras (Pyros — O Norte Vulcânico). Vença o duelo para prosseguir pela estrada.",
      "deckId": "mono_red_dragon",
      "customDeckCardIds": [],
      "difficultyTier": 1,
      "submapId": "pyros",
      "landmarkName": "Vanguarda — Ponte das Correntes Rubras",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_red_dragon",
      "archetypeTitle": "Blitz Salamandra"
    }
  },
  {
    "id": "gc_red_t1_pyros_02",
    "stage": 64,
    "submapId": "pyros",
    "submapOrder": 3,
    "rx": 25,
    "ry": 81,
    "worldX": 39.5,
    "worldY": 25.5,
    "landmarkName": "Forte da Escória",
    "tier": 1,
    "encounterKind": "rare_garrison",
    "isEntryNode": true,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_red_t1_pyros_02",
      "stage": 64,
      "name": "Juggernaut de Ferro da Fornalha",
      "title": "Guardião de Fronteira • Forte da Escória",
      "domains": [
        "red"
      ],
      "avatarCardId": "red_133_juggernaut_fornalha",
      "startingHp": 40,
      "passiveName": "Sentinela das Cinzas",
      "passiveDescription": "Vanguarda de Pyros forjada nas estradas basálticas.",
      "rewardGold": 12,
      "rewardShards": 10,
      "rewardCardIds": [
        "red_133_juggernaut_fornalha",
        "red_33_supernova_vulcanica"
      ],
      "loreIntro": "Juggernaut de Ferro da Fornalha mantém vigília soberana sobre Forte da Escória (Pyros — O Norte Vulcânico), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_red_blitz",
      "customDeckCardIds": [],
      "difficultyTier": 1,
      "submapId": "pyros",
      "landmarkName": "Forte da Escória",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_red_blitz",
      "archetypeTitle": "Blitz Salamandra"
    }
  },
  {
    "id": "gc_red_t1_pyros_02_b",
    "stage": 65,
    "submapId": "pyros",
    "submapOrder": 4,
    "rx": 26.2,
    "ry": 73.3,
    "worldX": 39.5,
    "worldY": 25.5,
    "landmarkName": "Reduto — Forte da Escória",
    "tier": 1,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_red_t1_pyros_02_b",
      "stage": 65,
      "name": "Marechal da Legião Férrea",
      "title": "Comandante Regional • Reduto — Forte da Escória",
      "domains": [
        "red"
      ],
      "avatarCardId": "red_18_marechal_rubro",
      "startingHp": 40,
      "passiveName": "Sentinela das Cinzas",
      "passiveDescription": "Vanguarda de Pyros forjada nas estradas basálticas.",
      "rewardGold": 12,
      "rewardShards": 10,
      "rewardCardIds": [
        "red_18_marechal_rubro",
        "red_49_marca_imolacao"
      ],
      "loreIntro": "Marechal da Legião Férrea lidera o posto avançado em Reduto — Forte da Escória (Pyros — O Norte Vulcânico). Vença o duelo para prosseguir pela estrada.",
      "deckId": "mono_red_pyroclasm",
      "customDeckCardIds": [],
      "difficultyTier": 1,
      "submapId": "pyros",
      "landmarkName": "Reduto — Forte da Escória",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_red_pyroclasm",
      "archetypeTitle": "Blitz Salamandra"
    }
  },
  {
    "id": "gc_red_t1_pyros_03",
    "stage": 66,
    "submapId": "pyros",
    "submapOrder": 5,
    "rx": 21,
    "ry": 61,
    "worldX": 39.5,
    "worldY": 25.5,
    "landmarkName": "Grande Caldeira Primordial",
    "tier": 1,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_red_t1_pyros_03",
      "stage": 66,
      "name": "Destruidor de Obsidiana Fundida",
      "title": "Guardião de Fronteira • Grande Caldeira Primordial",
      "domains": [
        "red"
      ],
      "avatarCardId": "red_62_colosso_obsidiana",
      "startingHp": 40,
      "passiveName": "Sentinela das Cinzas",
      "passiveDescription": "Vanguarda de Pyros forjada nas estradas basálticas.",
      "rewardGold": 12,
      "rewardShards": 10,
      "rewardCardIds": [
        "red_62_colosso_obsidiana",
        "red_42_cavaleiro_draconico"
      ],
      "loreIntro": "Destruidor de Obsidiana Fundida mantém vigília soberana sobre Grande Caldeira Primordial (Pyros — O Norte Vulcânico), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_red_pyroclasm",
      "customDeckCardIds": [],
      "difficultyTier": 1,
      "submapId": "pyros",
      "landmarkName": "Grande Caldeira Primordial",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_red_pyroclasm",
      "archetypeTitle": "Artilharia Piroclástica"
    }
  },
  {
    "id": "gc_red_t1_pyros_03_b",
    "stage": 67,
    "submapId": "pyros",
    "submapOrder": 6,
    "rx": 26.1,
    "ry": 62.9,
    "worldX": 39.5,
    "worldY": 25.5,
    "landmarkName": "Atalaia — Grande Caldeira Primordial",
    "tier": 1,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_red_t1_pyros_03_b",
      "stage": 67,
      "name": "Pactuário do Espírito Magmático",
      "title": "Comandante Regional • Atalaia — Grande Caldeira Primordial",
      "domains": [
        "red"
      ],
      "avatarCardId": "red_171_pactuario_elemental_chama",
      "startingHp": 40,
      "passiveName": "Sentinela das Cinzas",
      "passiveDescription": "Vanguarda de Pyros forjada nas estradas basálticas.",
      "rewardGold": 12,
      "rewardShards": 10,
      "rewardCardIds": [
        "red_171_pactuario_elemental_chama",
        "red_121_furia_vulcao"
      ],
      "loreIntro": "Pactuário do Espírito Magmático lidera o posto avançado em Atalaia — Grande Caldeira Primordial (Pyros — O Norte Vulcânico). Vença o duelo para prosseguir pela estrada.",
      "deckId": "mono_red_blitz",
      "customDeckCardIds": [],
      "difficultyTier": 1,
      "submapId": "pyros",
      "landmarkName": "Atalaia — Grande Caldeira Primordial",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_red_blitz",
      "archetypeTitle": "Artilharia Piroclástica"
    }
  },
  {
    "id": "gc_red_t2_pyros_04",
    "stage": 68,
    "submapId": "pyros",
    "submapOrder": 7,
    "rx": 13,
    "ry": 49,
    "worldX": 39.5,
    "worldY": 25.5,
    "landmarkName": "Garganta Piroclástica",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_red_t2_pyros_04",
      "stage": 68,
      "name": "General Senhor da Guerra Rubro",
      "title": "Guardião de Fronteira • Garganta Piroclástica",
      "domains": [
        "red"
      ],
      "avatarCardId": "red_134_senhor_guerra_rubro",
      "startingHp": 40,
      "passiveName": "Fúria da Caldeira",
      "passiveDescription": "Batalhão ofensivo treinado sob chuva piroclástica.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "red_134_senhor_guerra_rubro",
        "red_103_fissura_tectonica"
      ],
      "loreIntro": "General Senhor da Guerra Rubro mantém vigília soberana sobre Garganta Piroclástica (Pyros — O Norte Vulcânico), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_red_pyroclasm",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "pyros",
      "landmarkName": "Garganta Piroclástica",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_red_pyroclasm",
      "archetypeTitle": "Artilharia Piroclástica"
    }
  },
  {
    "id": "gc_red_t2_pyros_04_b",
    "stage": 69,
    "submapId": "pyros",
    "submapOrder": 8,
    "rx": 20,
    "ry": 39,
    "worldX": 39.5,
    "worldY": 25.5,
    "landmarkName": "Vanguarda — Garganta Piroclástica",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_red_t2_pyros_04_b",
      "stage": 69,
      "name": "Sultão da Cidadela de Bronze",
      "title": "Comandante Regional • Vanguarda — Garganta Piroclástica",
      "domains": [
        "red"
      ],
      "avatarCardId": "red_81_efreeti_sultao",
      "startingHp": 40,
      "passiveName": "Fúria da Caldeira",
      "passiveDescription": "Batalhão ofensivo treinado sob chuva piroclástica.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "red_81_efreeti_sultao",
        "red_85_tempo_emprestado"
      ],
      "loreIntro": "Sultão da Cidadela de Bronze lidera o posto avançado em Vanguarda — Garganta Piroclástica (Pyros — O Norte Vulcânico). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_red_purple",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "pyros",
      "landmarkName": "Vanguarda — Garganta Piroclástica",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_red_purple",
      "archetypeTitle": "Artilharia Piroclástica"
    }
  },
  {
    "id": "gc_red_t2_pyros_05",
    "stage": 70,
    "submapId": "pyros",
    "submapOrder": 9,
    "rx": 34,
    "ry": 68,
    "worldX": 39.5,
    "worldY": 25.5,
    "landmarkName": "Altar da Chama Primordial",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_red_t2_pyros_05",
      "stage": 70,
      "name": "Hidra de Magma Vulcânica",
      "title": "Guardião de Fronteira • Altar da Chama Primordial",
      "domains": [
        "red"
      ],
      "avatarCardId": "red_116_hidra_vulcanica",
      "startingHp": 40,
      "passiveName": "Fúria da Caldeira",
      "passiveDescription": "Batalhão ofensivo treinado sob chuva piroclástica.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "red_116_hidra_vulcanica",
        "red_141_sangue_fervente"
      ],
      "loreIntro": "Hidra de Magma Vulcânica mantém vigília soberana sobre Altar da Chama Primordial (Pyros — O Norte Vulcânico), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_red_blitz",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "pyros",
      "landmarkName": "Altar da Chama Primordial",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_red_blitz",
      "archetypeTitle": "Blitz Salamandra"
    }
  },
  {
    "id": "gc_red_t2_pyros_05_b",
    "stage": 71,
    "submapId": "pyros",
    "submapOrder": 10,
    "rx": 35.1,
    "ry": 62.7,
    "worldX": 39.5,
    "worldY": 25.5,
    "landmarkName": "Baluarte — Altar da Chama Primordial",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_red_t2_pyros_05_b",
      "stage": 71,
      "name": "Serpe Real de Escama Rubra",
      "title": "Comandante Regional • Baluarte — Altar da Chama Primordial",
      "domains": [
        "red"
      ],
      "avatarCardId": "red_63_wyvern_imperial",
      "startingHp": 40,
      "passiveName": "Fúria da Caldeira",
      "passiveDescription": "Batalhão ofensivo treinado sob chuva piroclástica.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "red_63_wyvern_imperial",
        "red_89_ponto_centelha"
      ],
      "loreIntro": "Serpe Real de Escama Rubra lidera o posto avançado em Baluarte — Altar da Chama Primordial (Pyros — O Norte Vulcânico). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_red_gold",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "pyros",
      "landmarkName": "Baluarte — Altar da Chama Primordial",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_red_gold",
      "archetypeTitle": "Blitz Salamandra"
    }
  },
  {
    "id": "gc_red_t2_pyros_06",
    "stage": 72,
    "submapId": "pyros",
    "submapOrder": 11,
    "rx": 43,
    "ry": 81,
    "worldX": 39.5,
    "worldY": 25.5,
    "landmarkName": "Bastião de Basalto",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_red_t2_pyros_06",
      "stage": 72,
      "name": "Presságio da Revoada Cinzenta",
      "title": "Guardião de Fronteira • Bastião de Basalto",
      "domains": [
        "red",
        "neutral"
      ],
      "avatarCardId": "red_169_pressagio_revoada_chama",
      "startingHp": 40,
      "passiveName": "Fúria da Caldeira",
      "passiveDescription": "Batalhão ofensivo treinado sob chuva piroclástica.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "red_169_pressagio_revoada_chama",
        "red_113_xama_cinzas"
      ],
      "loreIntro": "Presságio da Revoada Cinzenta mantém vigília soberana sobre Bastião de Basalto (Pyros — O Norte Vulcânico), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "dual_red_neutral",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "pyros",
      "landmarkName": "Bastião de Basalto",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_red_neutral",
      "archetypeTitle": "Aliança da Artilharia de Mercúrio"
    }
  },
  {
    "id": "gc_red_t2_pyros_06_b",
    "stage": 73,
    "submapId": "pyros",
    "submapOrder": 12,
    "rx": 43.7,
    "ry": 65.9,
    "worldX": 39.5,
    "worldY": 25.5,
    "landmarkName": "Atalaia — Bastião de Basalto",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_red_t2_pyros_06_b",
      "stage": 73,
      "name": "Colosso de Escória e Brasa",
      "title": "Comandante Regional • Atalaia — Bastião de Basalto",
      "domains": [
        "red",
        "neutral"
      ],
      "avatarCardId": "red_98_colosso_escoria",
      "startingHp": 40,
      "passiveName": "Fúria da Caldeira",
      "passiveDescription": "Batalhão ofensivo treinado sob chuva piroclástica.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "red_98_colosso_escoria",
        "red_78_minotauro_forja"
      ],
      "loreIntro": "Colosso de Escória e Brasa lidera o posto avançado em Atalaia — Bastião de Basalto (Pyros — O Norte Vulcânico). Vença o duelo para prosseguir pela estrada.",
      "deckId": "mono_red_dragon",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "pyros",
      "landmarkName": "Atalaia — Bastião de Basalto",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_red_dragon",
      "archetypeTitle": "Aliança da Artilharia de Mercúrio"
    }
  },
  {
    "id": "gc_red_t2_pyros_07",
    "stage": 74,
    "submapId": "pyros",
    "submapOrder": 13,
    "rx": 37,
    "ry": 48,
    "worldX": 39.5,
    "worldY": 25.5,
    "landmarkName": "Ponte de Ferro sobre o Rio de Lava",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_red_t2_pyros_07",
      "stage": 74,
      "name": "Arauto Demoníaco da Erupção",
      "title": "Guardião de Fronteira • Ponte de Ferro sobre o Rio de Lava",
      "domains": [
        "red",
        "purple"
      ],
      "avatarCardId": "red_117_arauto_erupcao",
      "startingHp": 40,
      "passiveName": "Fúria da Caldeira",
      "passiveDescription": "Batalhão ofensivo treinado sob chuva piroclástica.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "red_117_arauto_erupcao",
        "red_170_flagelo_cornudo_chama"
      ],
      "loreIntro": "Arauto Demoníaco da Erupção mantém vigília soberana sobre Ponte de Ferro sobre o Rio de Lava (Pyros — O Norte Vulcânico), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "dual_red_purple",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "pyros",
      "landmarkName": "Ponte de Ferro sobre o Rio de Lava",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_red_purple",
      "archetypeTitle": "Pacto da Chama Sangrenta"
    }
  },
  {
    "id": "gc_red_t2_pyros_07_b",
    "stage": 75,
    "submapId": "pyros",
    "submapOrder": 14,
    "rx": 49.2,
    "ry": 45.7,
    "worldX": 39.5,
    "worldY": 25.5,
    "landmarkName": "Reduto — Ponte de Ferro sobre o Rio de Lava",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_red_t2_pyros_07_b",
      "stage": 75,
      "name": "Fênix da Coroa Solar",
      "title": "Comandante Regional • Reduto — Ponte de Ferro sobre o Rio de Lava",
      "domains": [
        "red",
        "purple"
      ],
      "avatarCardId": "red_45_fenix_primordial",
      "startingHp": 40,
      "passiveName": "Fúria da Caldeira",
      "passiveDescription": "Batalhão ofensivo treinado sob chuva piroclástica.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "red_45_fenix_primordial",
        "red_103_fissura_tectonica"
      ],
      "loreIntro": "Fênix da Coroa Solar lidera o posto avançado em Reduto — Ponte de Ferro sobre o Rio de Lava (Pyros — O Norte Vulcânico). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_red_blue",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "pyros",
      "landmarkName": "Reduto — Ponte de Ferro sobre o Rio de Lava",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_red_blue",
      "archetypeTitle": "Pacto da Chama Sangrenta"
    }
  },
  {
    "id": "gc_red_t2_pyros_08",
    "stage": 76,
    "submapId": "pyros",
    "submapOrder": 15,
    "rx": 21.6,
    "ry": 23.8,
    "worldX": 39.5,
    "worldY": 25.5,
    "landmarkName": "Bastilha do Vapor",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_red_t2_pyros_08",
      "stage": 76,
      "name": "Draco de Cobre das Ravinas",
      "title": "Guardião de Fronteira • Bastilha do Vapor",
      "domains": [
        "red",
        "blue"
      ],
      "avatarCardId": "red_24_dragao_cobre",
      "startingHp": 40,
      "passiveName": "Fúria da Caldeira",
      "passiveDescription": "Batalhão ofensivo treinado sob chuva piroclástica.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "red_24_dragao_cobre",
        "red_160_furia_sangue_draconico"
      ],
      "loreIntro": "Draco de Cobre das Ravinas mantém vigília soberana sobre Bastilha do Vapor (Pyros — O Norte Vulcânico), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "dual_red_blue",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "pyros",
      "landmarkName": "Bastilha do Vapor",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_red_blue",
      "archetypeTitle": "Pacto do Fogo Astral"
    }
  },
  {
    "id": "gc_red_t2_pyros_08_b",
    "stage": 77,
    "submapId": "pyros",
    "submapOrder": 16,
    "rx": 33.9,
    "ry": 35,
    "worldX": 39.5,
    "worldY": 25.5,
    "landmarkName": "Vanguarda — Bastilha do Vapor",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_red_t2_pyros_08_b",
      "stage": 77,
      "name": "Forjador Real de Surtur",
      "title": "Comandante Regional • Vanguarda — Bastilha do Vapor",
      "domains": [
        "red",
        "blue"
      ],
      "avatarCardId": "red_80_gigante_caldeira",
      "startingHp": 40,
      "passiveName": "Fúria da Caldeira",
      "passiveDescription": "Batalhão ofensivo treinado sob chuva piroclástica.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "red_80_gigante_caldeira",
        "red_26_grilhoes_incandescentes"
      ],
      "loreIntro": "Forjador Real de Surtur lidera o posto avançado em Vanguarda — Bastilha do Vapor (Pyros — O Norte Vulcânico). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_red_purple",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "pyros",
      "landmarkName": "Vanguarda — Bastilha do Vapor",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_red_purple",
      "archetypeTitle": "Pacto do Fogo Astral"
    }
  },
  {
    "id": "gc_red_t3_pyros_09",
    "stage": 78,
    "submapId": "pyros",
    "submapOrder": 17,
    "rx": 77,
    "ry": 57,
    "worldX": 39.5,
    "worldY": 25.5,
    "landmarkName": "Cratera da Bateria Astral",
    "tier": 3,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_red_t3_pyros_09",
      "stage": 78,
      "name": "Bael-Khor, General do Chicote Ígneo",
      "title": "Lorde Soberano • Cratera da Bateria Astral",
      "domains": [
        "red"
      ],
      "avatarCardId": "red_99_senhor_balor_fogo",
      "startingHp": 40,
      "passiveName": "Brasa da Fornalha",
      "passiveDescription": "Criaturas invocadas por este Soberano entram com +1 ATQ.",
      "rewardGold": 36,
      "rewardShards": 40,
      "rewardCardIds": [
        "red_99_senhor_balor_fogo",
        "red_72_caldeirao_magma"
      ],
      "loreIntro": "Bael-Khor, General do Chicote Ígneo mantém vigília soberana sobre Cratera da Bateria Astral em Pyros, vedando o avanço pelas rotas interiores.",
      "deckId": "mono_red_pyroclasm",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "pyros",
      "landmarkName": "Cratera da Bateria Astral",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "mono_red_pyroclasm",
      "archetypeTitle": "Artilharia Piroclástica"
    }
  },
  {
    "id": "gc_red_t3_pyros_10",
    "stage": 79,
    "submapId": "pyros",
    "submapOrder": 18,
    "rx": 74.6,
    "ry": 24.6,
    "worldX": 39.5,
    "worldY": 25.5,
    "landmarkName": "Poleiro das Escamas",
    "tier": 3,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_red_t3_pyros_10",
      "stage": 79,
      "name": "Arauto da Supernova Prismática",
      "title": "Lorde Soberano • Poleiro das Escamas",
      "domains": [
        "red",
        "gold"
      ],
      "avatarCardId": "red_167_arauto_prisma_chama",
      "startingHp": 40,
      "passiveName": "Brasa da Fornalha",
      "passiveDescription": "Criaturas invocadas por este Soberano entram com +1 ATQ.",
      "rewardGold": 36,
      "rewardShards": 40,
      "rewardCardIds": [
        "red_167_arauto_prisma_chama",
        "red_113_xama_cinzas"
      ],
      "loreIntro": "Arauto da Supernova Prismática mantém vigília soberana sobre Poleiro das Escamas em Pyros, vedando o avanço pelas rotas interiores.",
      "deckId": "dual_red_gold",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "pyros",
      "landmarkName": "Poleiro das Escamas",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "dual_red_gold",
      "archetypeTitle": "Pacto das Escamas Imperiais"
    }
  },
  {
    "id": "gc_red_t3_pyros_11",
    "stage": 80,
    "submapId": "pyros",
    "submapOrder": 19,
    "rx": 53.5,
    "ry": 42.5,
    "worldX": 39.5,
    "worldY": 25.5,
    "landmarkName": "Caldeira Central da Fornalha",
    "tier": 3,
    "encounterKind": "throne_apex",
    "isEntryNode": false,
    "isThroneNode": true,
    "unlocksSubmaps": [
      "underforge",
      "matrix"
    ],
    "boss": {
      "id": "gc_red_t3_pyros_11",
      "stage": 80,
      "name": "Ignis-Vael, Príncipe do Núcleo Ardente",
      "title": "Soberano Supremo • Caldeira Central da Fornalha",
      "domains": [
        "red"
      ],
      "avatarCardId": "red_64_principe_fogo",
      "startingHp": 40,
      "passiveName": "Brasa da Fornalha",
      "passiveDescription": "Criaturas invocadas por este Soberano entram com +1 ATQ.",
      "rewardGold": 61,
      "rewardShards": 65,
      "rewardCardIds": [
        "red_64_principe_fogo",
        "red_151_artificie_caldeira"
      ],
      "loreIntro": "No coração de Pyros — O Norte Vulcânico, Ignis-Vael, Príncipe do Núcleo Ardente guarda o Caldeira Central da Fornalha com as relíquias e criaturas mais poderosas deste domínio.",
      "deckId": "mono_red_dragon",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "pyros",
      "landmarkName": "Caldeira Central da Fornalha",
      "encounterKind": "throne_apex",
      "archetypeId": "mono_red_dragon",
      "archetypeTitle": "Trono Dracônico"
    }
  },
  {
    "id": "gc_red_t2_underforge_01",
    "stage": 81,
    "submapId": "underforge",
    "submapOrder": 1,
    "rx": 13,
    "ry": 17,
    "worldX": 53.5,
    "worldY": 32.8,
    "landmarkName": "Ponte das Correntes Rubras",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": true,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_red_t2_underforge_01",
      "stage": 81,
      "name": "Soberano Ígneo da Cidadela de Bronze",
      "title": "Guardião de Fronteira • Ponte das Correntes Rubras",
      "domains": [
        "red"
      ],
      "avatarCardId": "red_06_efreeti",
      "startingHp": 40,
      "passiveName": "Fúria da Caldeira",
      "passiveDescription": "Batalhão ofensivo treinado sob chuva piroclástica.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "red_06_efreeti",
        "red_19_corcel_brasas"
      ],
      "loreIntro": "Soberano Ígneo da Cidadela de Bronze mantém vigília soberana sobre Ponte das Correntes Rubras (Infraforja Magmática de Ignaroth), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_red_blitz",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "underforge",
      "landmarkName": "Ponte das Correntes Rubras",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_red_blitz",
      "archetypeTitle": "Blitz Salamandra"
    }
  },
  {
    "id": "gc_red_t2_underforge_01_b",
    "stage": 82,
    "submapId": "underforge",
    "submapOrder": 2,
    "rx": 17.7,
    "ry": 22.9,
    "worldX": 53.5,
    "worldY": 32.8,
    "landmarkName": "Reduto — Ponte das Correntes Rubras",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_red_t2_underforge_01_b",
      "stage": 82,
      "name": "Titã Encouraçado da Caldeira",
      "title": "Comandante Regional • Reduto — Ponte das Correntes Rubras",
      "domains": [
        "red"
      ],
      "avatarCardId": "red_44_gigante_forja",
      "startingHp": 40,
      "passiveName": "Fúria da Caldeira",
      "passiveDescription": "Batalhão ofensivo treinado sob chuva piroclástica.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "red_44_gigante_forja",
        "red_86_destruicao_elemental"
      ],
      "loreIntro": "Titã Encouraçado da Caldeira lidera o posto avançado em Reduto — Ponte das Correntes Rubras (Infraforja Magmática de Ignaroth). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_red_blue",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "underforge",
      "landmarkName": "Reduto — Ponte das Correntes Rubras",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_red_blue",
      "archetypeTitle": "Blitz Salamandra"
    }
  },
  {
    "id": "gc_red_t2_underforge_02",
    "stage": 83,
    "submapId": "underforge",
    "submapOrder": 3,
    "rx": 16,
    "ry": 32,
    "worldX": 53.5,
    "worldY": 32.8,
    "landmarkName": "Tumba dos Primeiros Ferreiros",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": true,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_red_t2_underforge_02",
      "stage": 83,
      "name": "Quimera da Garganta Vulcânica",
      "title": "Guardião de Fronteira • Tumba dos Primeiros Ferreiros",
      "domains": [
        "red",
        "neutral"
      ],
      "avatarCardId": "red_20_quimera",
      "startingHp": 40,
      "passiveName": "Fúria da Caldeira",
      "passiveDescription": "Batalhão ofensivo treinado sob chuva piroclástica.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "red_20_quimera",
        "red_150_lanceiro_obsidiana"
      ],
      "loreIntro": "Quimera da Garganta Vulcânica mantém vigília soberana sobre Tumba dos Primeiros Ferreiros (Infraforja Magmática de Ignaroth), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "dual_red_neutral",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "underforge",
      "landmarkName": "Tumba dos Primeiros Ferreiros",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_red_neutral",
      "archetypeTitle": "Aliança da Artilharia de Mercúrio"
    }
  },
  {
    "id": "gc_red_t2_underforge_02_b",
    "stage": 84,
    "submapId": "underforge",
    "submapOrder": 4,
    "rx": 16.6,
    "ry": 37.4,
    "worldX": 53.5,
    "worldY": 32.8,
    "landmarkName": "Vanguarda — Tumba dos Primeiros Ferreiros",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_red_t2_underforge_02_b",
      "stage": 84,
      "name": "Behemoth dos Gêiseres de Fogo",
      "title": "Comandante Regional • Vanguarda — Tumba dos Primeiros Ferreiros",
      "domains": [
        "red",
        "neutral"
      ],
      "avatarCardId": "red_135_behemoth_piroclastico",
      "startingHp": 40,
      "passiveName": "Fúria da Caldeira",
      "passiveDescription": "Batalhão ofensivo treinado sob chuva piroclástica.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "red_135_behemoth_piroclastico",
        "red_35_contra_ataque_igneo"
      ],
      "loreIntro": "Behemoth dos Gêiseres de Fogo lidera o posto avançado em Vanguarda — Tumba dos Primeiros Ferreiros (Infraforja Magmática de Ignaroth). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_red_blue",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "underforge",
      "landmarkName": "Vanguarda — Tumba dos Primeiros Ferreiros",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_red_blue",
      "archetypeTitle": "Aliança da Artilharia de Mercúrio"
    }
  },
  {
    "id": "gc_red_t2_underforge_03",
    "stage": 85,
    "submapId": "underforge",
    "submapOrder": 5,
    "rx": 13,
    "ry": 49,
    "worldX": 53.5,
    "worldY": 32.8,
    "landmarkName": "Garganta Piroclástica",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_red_t2_underforge_03",
      "stage": 85,
      "name": "Sultão das Lâminas de Brasa",
      "title": "Guardião de Fronteira • Garganta Piroclástica",
      "domains": [
        "red"
      ],
      "avatarCardId": "red_154_juggernaut_escoria",
      "startingHp": 40,
      "passiveName": "Fúria da Caldeira",
      "passiveDescription": "Batalhão ofensivo treinado sob chuva piroclástica.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "red_154_juggernaut_escoria",
        "red_26_grilhoes_incandescentes"
      ],
      "loreIntro": "Sultão das Lâminas de Brasa mantém vigília soberana sobre Garganta Piroclástica (Infraforja Magmática de Ignaroth), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_red_pyroclasm",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "underforge",
      "landmarkName": "Garganta Piroclástica",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_red_pyroclasm",
      "archetypeTitle": "Artilharia Piroclástica"
    }
  },
  {
    "id": "gc_red_t2_underforge_03_b",
    "stage": 86,
    "submapId": "underforge",
    "submapOrder": 6,
    "rx": 20.2,
    "ry": 49.7,
    "worldX": 53.5,
    "worldY": 32.8,
    "landmarkName": "Baluarte — Garganta Piroclástica",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_red_t2_underforge_03_b",
      "stage": 86,
      "name": "Arquidemônio das Correntes Solares",
      "title": "Comandante Regional • Baluarte — Garganta Piroclástica",
      "domains": [
        "red"
      ],
      "avatarCardId": "red_136_arquidemonio_brasas",
      "startingHp": 40,
      "passiveName": "Fúria da Caldeira",
      "passiveDescription": "Batalhão ofensivo treinado sob chuva piroclástica.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "red_136_arquidemonio_brasas",
        "red_106_escudo_magmatico"
      ],
      "loreIntro": "Arquidemônio das Correntes Solares lidera o posto avançado em Baluarte — Garganta Piroclástica (Infraforja Magmática de Ignaroth). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_red_blue",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "underforge",
      "landmarkName": "Baluarte — Garganta Piroclástica",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_red_blue",
      "archetypeTitle": "Artilharia Piroclástica"
    }
  },
  {
    "id": "gc_red_t3_underforge_04",
    "stage": 87,
    "submapId": "underforge",
    "submapOrder": 7,
    "rx": 31,
    "ry": 25,
    "worldX": 53.5,
    "worldY": 32.8,
    "landmarkName": "Forte da Escória",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_red_t3_underforge_04",
      "stage": 87,
      "name": "Arconte de Chifres e Brasa",
      "title": "Guardião de Fronteira • Forte da Escória",
      "domains": [
        "red",
        "purple"
      ],
      "avatarCardId": "red_21_diabo_chifres",
      "startingHp": 40,
      "passiveName": "Brasa da Fornalha",
      "passiveDescription": "Criaturas invocadas por este Soberano entram com +1 ATQ.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "red_21_diabo_chifres",
        "red_54_coroa_chama_eterna"
      ],
      "loreIntro": "Arconte de Chifres e Brasa mantém vigília soberana sobre Forte da Escória (Infraforja Magmática de Ignaroth), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "dual_red_purple",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "underforge",
      "landmarkName": "Forte da Escória",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_red_purple",
      "archetypeTitle": "Pacto da Chama Sangrenta"
    }
  },
  {
    "id": "gc_red_t3_underforge_04_b",
    "stage": 88,
    "submapId": "underforge",
    "submapOrder": 8,
    "rx": 35.9,
    "ry": 22.7,
    "worldX": 53.5,
    "worldY": 32.8,
    "landmarkName": "Reduto — Forte da Escória",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_red_t3_underforge_04_b",
      "stage": 88,
      "name": "Titã do Núcleo de Basalto",
      "title": "Comandante Regional • Reduto — Forte da Escória",
      "domains": [
        "red",
        "purple"
      ],
      "avatarCardId": "red_118_tita_basalto",
      "startingHp": 40,
      "passiveName": "Brasa da Fornalha",
      "passiveDescription": "Criaturas invocadas por este Soberano entram com +1 ATQ.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "red_118_tita_basalto",
        "red_17_orc_xama"
      ],
      "loreIntro": "Titã do Núcleo de Basalto lidera o posto avançado em Reduto — Forte da Escória (Infraforja Magmática de Ignaroth). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_red_neutral",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "underforge",
      "landmarkName": "Reduto — Forte da Escória",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_red_neutral",
      "archetypeTitle": "Pacto da Chama Sangrenta"
    }
  },
  {
    "id": "gc_red_t3_underforge_05",
    "stage": 89,
    "submapId": "underforge",
    "submapOrder": 9,
    "rx": 35,
    "ry": 38,
    "worldX": 53.5,
    "worldY": 32.8,
    "landmarkName": "Fornalhas de Escamas Eternas",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_red_t3_underforge_05",
      "stage": 89,
      "name": "Colosso Forjador do Vulcão",
      "title": "Guardião de Fronteira • Fornalhas de Escamas Eternas",
      "domains": [
        "red"
      ],
      "avatarCardId": "red_07_gigante_fogo",
      "startingHp": 40,
      "passiveName": "Brasa da Fornalha",
      "passiveDescription": "Criaturas invocadas por este Soberano entram com +1 ATQ.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "red_07_gigante_fogo",
        "red_96_serpente_piroclastica"
      ],
      "loreIntro": "Colosso Forjador do Vulcão mantém vigília soberana sobre Fornalhas de Escamas Eternas (Infraforja Magmática de Ignaroth), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_red_dragon",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "underforge",
      "landmarkName": "Fornalhas de Escamas Eternas",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_red_dragon",
      "archetypeTitle": "Trono Dracônico"
    }
  },
  {
    "id": "gc_red_t3_underforge_05_b",
    "stage": 90,
    "submapId": "underforge",
    "submapOrder": 10,
    "rx": 42.2,
    "ry": 43.1,
    "worldX": 53.5,
    "worldY": 32.8,
    "landmarkName": "Atalaia — Fornalhas de Escamas Eternas",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_red_t3_underforge_05_b",
      "stage": 90,
      "name": "Dragão do Cometa Carmesim",
      "title": "Comandante Regional • Atalaia — Fornalhas de Escamas Eternas",
      "domains": [
        "red"
      ],
      "avatarCardId": "red_137_dragao_cometa_rubro",
      "startingHp": 40,
      "passiveName": "Brasa da Fornalha",
      "passiveDescription": "Criaturas invocadas por este Soberano entram com +1 ATQ.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "red_137_dragao_cometa_rubro",
        "red_61_manticora_fogo"
      ],
      "loreIntro": "Dragão do Cometa Carmesim lidera o posto avançado em Atalaia — Fornalhas de Escamas Eternas (Infraforja Magmática de Ignaroth). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_red_neutral",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "underforge",
      "landmarkName": "Atalaia — Fornalhas de Escamas Eternas",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_red_neutral",
      "archetypeTitle": "Trono Dracônico"
    }
  },
  {
    "id": "gc_red_t3_underforge_06",
    "stage": 91,
    "submapId": "underforge",
    "submapOrder": 11,
    "rx": 43,
    "ry": 17,
    "worldX": 53.5,
    "worldY": 32.8,
    "landmarkName": "Bastião de Basalto",
    "tier": 3,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_red_t3_underforge_06",
      "stage": 91,
      "name": "Ignis-Aeterna, A Fênix do Tempo Emprestado",
      "title": "Lorde Soberano • Bastião de Basalto",
      "domains": [
        "red",
        "gold"
      ],
      "avatarCardId": "red_82_fenix_taquion",
      "startingHp": 40,
      "passiveName": "Brasa da Fornalha",
      "passiveDescription": "Criaturas invocadas por este Soberano entram com +1 ATQ.",
      "rewardGold": 36,
      "rewardShards": 40,
      "rewardCardIds": [
        "red_82_fenix_taquion",
        "red_132_wyvern_escoria"
      ],
      "loreIntro": "Ignis-Aeterna, A Fênix do Tempo Emprestado mantém vigília soberana sobre Bastião de Basalto em Infraforja, vedando o avanço pelas rotas interiores.",
      "deckId": "dual_red_gold",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "underforge",
      "landmarkName": "Bastião de Basalto",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "dual_red_gold",
      "archetypeTitle": "Pacto das Escamas Imperiais"
    }
  },
  {
    "id": "gc_red_t3_underforge_07",
    "stage": 92,
    "submapId": "underforge",
    "submapOrder": 12,
    "rx": 25,
    "ry": 57,
    "worldX": 53.5,
    "worldY": 32.8,
    "landmarkName": "Fundição das Brasas",
    "tier": 3,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_red_t3_underforge_07",
      "stage": 92,
      "name": "Belphegor, Regente da Cidadela Ardente",
      "title": "Lorde Soberano • Fundição das Brasas",
      "domains": [
        "red",
        "green"
      ],
      "avatarCardId": "red_47_arquiduque_ferro",
      "startingHp": 40,
      "passiveName": "Brasa da Fornalha",
      "passiveDescription": "Criaturas invocadas por este Soberano entram com +1 ATQ.",
      "rewardGold": 36,
      "rewardShards": 40,
      "rewardCardIds": [
        "red_47_arquiduque_ferro",
        "red_33_supernova_vulcanica"
      ],
      "loreIntro": "Belphegor, Regente da Cidadela Ardente mantém vigília soberana sobre Fundição das Brasas em Infraforja, vedando o avanço pelas rotas interiores.",
      "deckId": "dual_red_green",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "underforge",
      "landmarkName": "Fundição das Brasas",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "dual_red_green",
      "archetypeTitle": "Pacto da Ruína Selvagem"
    }
  },
  {
    "id": "gc_red_t4_underforge_08",
    "stage": 93,
    "submapId": "underforge",
    "submapOrder": 13,
    "rx": 55,
    "ry": 25,
    "worldX": 53.5,
    "worldY": 32.8,
    "landmarkName": "Passagem da Caldeira",
    "tier": 4,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_red_t4_underforge_08",
      "stage": 93,
      "name": "Ignarok, o Devorador de Reinos",
      "title": "Lorde Soberano • Passagem da Caldeira",
      "domains": [
        "red",
        "gold",
        "purple"
      ],
      "avatarCardId": "red_46_tirano_carmesim",
      "startingHp": 40,
      "passiveName": "Bigorna Ardente",
      "passiveDescription": "Criaturas aliadas entram com +1 ATQ (+2 Afinidade Rubra inicial).",
      "rewardGold": 48,
      "rewardShards": 50,
      "rewardCardIds": [
        "red_46_tirano_carmesim",
        "red_116_hidra_vulcanica"
      ],
      "loreIntro": "Ignarok, o Devorador de Reinos mantém vigília soberana sobre Passagem da Caldeira em Infraforja, vedando o avanço pelas rotas interiores.",
      "deckId": "tri_red_purple_gold",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "underforge",
      "landmarkName": "Passagem da Caldeira",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "tri_red_purple_gold",
      "archetypeTitle": "Eclipse do Sol Carmesim"
    }
  },
  {
    "id": "gc_red_t4_underforge_09",
    "stage": 94,
    "submapId": "underforge",
    "submapOrder": 14,
    "rx": 72.9,
    "ry": 51.3,
    "worldX": 53.5,
    "worldY": 32.8,
    "landmarkName": "Torre de Basalto",
    "tier": 4,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_red_t4_underforge_09",
      "stage": 94,
      "name": "Baelgor, Senhor do Fosso Ardente",
      "title": "Lorde Soberano • Torre de Basalto",
      "domains": [
        "red",
        "green",
        "gold"
      ],
      "avatarCardId": "red_22_tirano_fogo",
      "startingHp": 40,
      "passiveName": "Bigorna Ardente",
      "passiveDescription": "Criaturas aliadas entram com +1 ATQ (+2 Afinidade Rubra inicial).",
      "rewardGold": 48,
      "rewardShards": 50,
      "rewardCardIds": [
        "red_22_tirano_fogo",
        "red_23_dragao_latao"
      ],
      "loreIntro": "Baelgor, Senhor do Fosso Ardente mantém vigília soberana sobre Torre de Basalto em Infraforja, vedando o avanço pelas rotas interiores.",
      "deckId": "tri_red_green_gold",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "underforge",
      "landmarkName": "Torre de Basalto",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "tri_red_green_gold",
      "archetypeTitle": "Tríade dos Titãs da Forja Primordial"
    }
  },
  {
    "id": "gc_red_t4_underforge_10",
    "stage": 95,
    "submapId": "underforge",
    "submapOrder": 15,
    "rx": 53,
    "ry": 42,
    "worldX": 53.5,
    "worldY": 32.8,
    "landmarkName": "Bigorna Abissal de Adamantina",
    "tier": 4,
    "encounterKind": "throne_apex",
    "isEntryNode": false,
    "isThroneNode": true,
    "unlocksSubmaps": [
      "capital_pyros"
    ],
    "boss": {
      "id": "gc_red_t4_underforge_10",
      "stage": 95,
      "name": "Pyroclasmos, Imperador das Chamas",
      "title": "Soberano Supremo • Bigorna Abissal de Adamantina",
      "domains": [
        "red",
        "gold",
        "blue"
      ],
      "avatarCardId": "red_119_soberano_piroclasma",
      "startingHp": 40,
      "passiveName": "Bigorna Ardente",
      "passiveDescription": "Criaturas aliadas entram com +1 ATQ (+2 Afinidade Rubra inicial).",
      "rewardGold": 73,
      "rewardShards": 75,
      "rewardCardIds": [
        "red_119_soberano_piroclasma",
        "red_73_fagulha_taquion"
      ],
      "loreIntro": "No coração de Infraforja Magmática de Ignaroth, Pyroclasmos, Imperador das Chamas guarda o Bigorna Abissal de Adamantina com as relíquias e criaturas mais poderosas deste domínio.",
      "deckId": "tri_red_blue_gold",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "underforge",
      "landmarkName": "Bigorna Abissal de Adamantina",
      "encounterKind": "throne_apex",
      "archetypeId": "tri_red_blue_gold",
      "archetypeTitle": "Conclave da Chama Celeste"
    }
  },
  {
    "id": "gc_red_t3_capital_pyros_01",
    "stage": 96,
    "submapId": "capital_pyros",
    "submapOrder": 1,
    "rx": 49,
    "ry": 81,
    "worldX": 61,
    "worldY": 22,
    "landmarkName": "Ponte das Correntes Rubras",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": true,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_red_t3_capital_pyros_01",
      "stage": 96,
      "name": "Soberano de Latão do Deserto",
      "title": "Guardião de Fronteira • Ponte das Correntes Rubras",
      "domains": [
        "red"
      ],
      "avatarCardId": "red_23_dragao_latao",
      "startingHp": 40,
      "passiveName": "Brasa da Fornalha",
      "passiveDescription": "Criaturas invocadas por este Soberano entram com +1 ATQ.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "red_23_dragao_latao",
        "red_153_elemental_fornalha_viva"
      ],
      "loreIntro": "Soberano de Latão do Deserto mantém vigília soberana sobre Ponte das Correntes Rubras (Caldeira Imperial de Vulcanor), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_red_blitz",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "capital_pyros",
      "landmarkName": "Ponte das Correntes Rubras",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_red_blitz",
      "archetypeTitle": "Blitz Salamandra"
    }
  },
  {
    "id": "gc_red_t3_capital_pyros_01_b",
    "stage": 97,
    "submapId": "capital_pyros",
    "submapOrder": 2,
    "rx": 52.4,
    "ry": 74.7,
    "worldX": 61,
    "worldY": 22,
    "landmarkName": "Baluarte — Ponte das Correntes Rubras",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_red_t3_capital_pyros_01_b",
      "stage": 97,
      "name": "Dragão Tectônico de Lava",
      "title": "Comandante Regional • Baluarte — Ponte das Correntes Rubras",
      "domains": [
        "red"
      ],
      "avatarCardId": "red_155_senhor_efreeti_chama",
      "startingHp": 40,
      "passiveName": "Brasa da Fornalha",
      "passiveDescription": "Criaturas invocadas por este Soberano entram com +1 ATQ.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "red_155_senhor_efreeti_chama",
        "red_04_meio_dragao"
      ],
      "loreIntro": "Dragão Tectônico de Lava lidera o posto avançado em Baluarte — Ponte das Correntes Rubras (Caldeira Imperial de Vulcanor). Vença o duelo para prosseguir pela estrada.",
      "deckId": "mono_red_pyroclasm",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "capital_pyros",
      "landmarkName": "Baluarte — Ponte das Correntes Rubras",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_red_pyroclasm",
      "archetypeTitle": "Blitz Salamandra"
    }
  },
  {
    "id": "gc_red_t3_capital_pyros_02",
    "stage": 98,
    "submapId": "capital_pyros",
    "submapOrder": 3,
    "rx": 61,
    "ry": 73,
    "worldX": 61,
    "worldY": 22,
    "landmarkName": "Garganta Piroclástica",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": true,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_red_t3_capital_pyros_02",
      "stage": 98,
      "name": "Pyrokor, Monarca do Fogo Vivo",
      "title": "Guarnição de Fronteira • Garganta Piroclástica",
      "domains": [
        "red"
      ],
      "avatarCardId": "red_156_fenix_coroa_solar",
      "startingHp": 40,
      "passiveName": "Brasa da Fornalha",
      "passiveDescription": "Criaturas invocadas por este Soberano entram com +1 ATQ.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "red_156_fenix_coroa_solar",
        "red_23_dragao_latao"
      ],
      "loreIntro": "Pyrokor, Monarca do Fogo Vivo mantém vigília soberana sobre Garganta Piroclástica em Vulcanor, vedando o avanço pelas rotas interiores.",
      "deckId": "mono_red_pyroclasm",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "capital_pyros",
      "landmarkName": "Garganta Piroclástica",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_red_pyroclasm",
      "archetypeTitle": "Artilharia Piroclástica"
    }
  },
  {
    "id": "gc_red_t3_capital_pyros_03",
    "stage": 99,
    "submapId": "capital_pyros",
    "submapOrder": 4,
    "rx": 49,
    "ry": 65,
    "worldX": 61,
    "worldY": 22,
    "landmarkName": "Forte da Escória",
    "tier": 3,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_red_t3_capital_pyros_03",
      "stage": 99,
      "name": "Pyrrakon, General da Roda Vulcânica",
      "title": "Lorde Soberano • Forte da Escória",
      "domains": [
        "red",
        "neutral"
      ],
      "avatarCardId": "red_173_general_roda_chama",
      "startingHp": 40,
      "passiveName": "Brasa da Fornalha",
      "passiveDescription": "Criaturas invocadas por este Soberano entram com +1 ATQ.",
      "rewardGold": 36,
      "rewardShards": 40,
      "rewardCardIds": [
        "red_173_general_roda_chama",
        "red_73_fagulha_taquion"
      ],
      "loreIntro": "Pyrrakon, General da Roda Vulcânica mantém vigília soberana sobre Forte da Escória em Vulcanor, vedando o avanço pelas rotas interiores.",
      "deckId": "dual_red_neutral",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "capital_pyros",
      "landmarkName": "Forte da Escória",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "dual_red_neutral",
      "archetypeTitle": "Aliança da Artilharia de Mercúrio"
    }
  },
  {
    "id": "gc_red_t4_capital_pyros_04",
    "stage": 100,
    "submapId": "capital_pyros",
    "submapOrder": 5,
    "rx": 24,
    "ry": 66,
    "worldX": 61,
    "worldY": 22,
    "landmarkName": "Complexo dos Altos-Fornos & Cadinhos",
    "tier": 4,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_red_t4_capital_pyros_04",
      "stage": 100,
      "name": "Magmarok, o Tirano Piroclástico",
      "title": "Lorde Soberano • Complexo dos Altos-Fornos & Cadinhos",
      "domains": [
        "red",
        "blue"
      ],
      "avatarCardId": "red_65_dragao_magma_anciao",
      "startingHp": 40,
      "passiveName": "Bigorna Ardente",
      "passiveDescription": "Criaturas aliadas entram com +1 ATQ (+2 Afinidade Rubra inicial).",
      "rewardGold": 48,
      "rewardShards": 50,
      "rewardCardIds": [
        "red_65_dragao_magma_anciao",
        "red_13_mephit_fumaca"
      ],
      "loreIntro": "Magmarok, o Tirano Piroclástico mantém vigília soberana sobre Complexo dos Altos-Fornos & Cadinhos em Vulcanor, vedando o avanço pelas rotas interiores.",
      "deckId": "dual_red_blue",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "capital_pyros",
      "landmarkName": "Complexo dos Altos-Fornos & Cadinhos",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "dual_red_blue",
      "archetypeTitle": "Pacto do Fogo Astral"
    }
  },
  {
    "id": "gc_red_t4_capital_pyros_05",
    "stage": 101,
    "submapId": "capital_pyros",
    "submapOrder": 6,
    "rx": 78,
    "ry": 72,
    "worldX": 61,
    "worldY": 22,
    "landmarkName": "Anfiteatro de Cinzas & Gladiadores",
    "tier": 4,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_red_t4_capital_pyros_05",
      "stage": 101,
      "name": "Pyraxis, Soberano da Ruína Solar",
      "title": "Lorde Soberano • Anfiteatro de Cinzas & Gladiadores",
      "domains": [
        "red",
        "purple"
      ],
      "avatarCardId": "red_83_dragao_cataclismo",
      "startingHp": 40,
      "passiveName": "Bigorna Ardente",
      "passiveDescription": "Criaturas aliadas entram com +1 ATQ (+2 Afinidade Rubra inicial).",
      "rewardGold": 48,
      "rewardShards": 50,
      "rewardCardIds": [
        "red_83_dragao_cataclismo",
        "red_52_escama_incandescente"
      ],
      "loreIntro": "Pyraxis, Soberano da Ruína Solar mantém vigília soberana sobre Anfiteatro de Cinzas & Gladiadores em Vulcanor, vedando o avanço pelas rotas interiores.",
      "deckId": "dual_red_purple",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "capital_pyros",
      "landmarkName": "Anfiteatro de Cinzas & Gladiadores",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "dual_red_purple",
      "archetypeTitle": "Pacto da Chama Sangrenta"
    }
  },
  {
    "id": "gc_red_t4_capital_pyros_06",
    "stage": 102,
    "submapId": "capital_pyros",
    "submapOrder": 7,
    "rx": 62,
    "ry": 52,
    "worldX": 61,
    "worldY": 22,
    "landmarkName": "Anel Interno das Fornalhas Sagradas",
    "tier": 4,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_red_t4_capital_pyros_06",
      "stage": 102,
      "name": "Vulcanor, Colosso da Caldeira Primordial",
      "title": "Lorde Soberano • Anel Interno das Fornalhas Sagradas",
      "domains": [
        "red"
      ],
      "avatarCardId": "red_138_colosso_vulcano_primordial",
      "startingHp": 40,
      "passiveName": "Bigorna Ardente",
      "passiveDescription": "Criaturas aliadas entram com +1 ATQ (+2 Afinidade Rubra inicial).",
      "rewardGold": 48,
      "rewardShards": 50,
      "rewardCardIds": [
        "red_138_colosso_vulcano_primordial",
        "red_88_pulso_impacto_fogo"
      ],
      "loreIntro": "Vulcanor, Colosso da Caldeira Primordial mantém vigília soberana sobre Anel Interno das Fornalhas Sagradas em Vulcanor, vedando o avanço pelas rotas interiores.",
      "deckId": "mono_red_pyroclasm",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "capital_pyros",
      "landmarkName": "Anel Interno das Fornalhas Sagradas",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "mono_red_pyroclasm",
      "archetypeTitle": "Artilharia Piroclástica"
    }
  },
  {
    "id": "gc_red_t4_capital_pyros_07",
    "stage": 103,
    "submapId": "capital_pyros",
    "submapOrder": 8,
    "rx": 78,
    "ry": 27,
    "worldX": 61,
    "worldY": 22,
    "landmarkName": "Agulhas & Poleiros dos Wyverns Reais",
    "tier": 4,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_red_t4_capital_pyros_07",
      "stage": 103,
      "name": "Khorvath, O Dragão Vulcânico Ancião",
      "title": "Lorde Soberano • Agulhas & Poleiros dos Wyverns Reais",
      "domains": [
        "red",
        "gold"
      ],
      "avatarCardId": "red_100_dragao_vulcanico_anciao",
      "startingHp": 40,
      "passiveName": "Bigorna Ardente",
      "passiveDescription": "Criaturas aliadas entram com +1 ATQ (+2 Afinidade Rubra inicial).",
      "rewardGold": 48,
      "rewardShards": 50,
      "rewardCardIds": [
        "red_100_dragao_vulcanico_anciao",
        "red_128_sapador_piroclastico"
      ],
      "loreIntro": "Khorvath, O Dragão Vulcânico Ancião mantém vigília soberana sobre Agulhas & Poleiros dos Wyverns Reais em Vulcanor, vedando o avanço pelas rotas interiores.",
      "deckId": "dual_red_gold",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "capital_pyros",
      "landmarkName": "Agulhas & Poleiros dos Wyverns Reais",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "dual_red_gold",
      "archetypeTitle": "Pacto das Escamas Imperiais"
    }
  },
  {
    "id": "gc_red_t5_capital_pyros_08",
    "stage": 104,
    "submapId": "capital_pyros",
    "submapOrder": 9,
    "rx": 20,
    "ry": 15,
    "worldX": 61,
    "worldY": 22,
    "landmarkName": "Represa & Comportas de Magma Noroeste",
    "tier": 5,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_red_t5_capital_pyros_08",
      "stage": 104,
      "name": "Igniskar, Tirano da Cratera",
      "title": "Lorde Soberano • Represa & Comportas de Magma Noroeste",
      "domains": [
        "red",
        "green",
        "blue"
      ],
      "avatarCardId": "red_08_dragao_vermelho",
      "startingHp": 40,
      "passiveName": "Trono Supremo de Vulcanor",
      "passiveDescription": "+1 Essência inicial; tropas entram com +1 ATQ/+1 Armadura e o calor causa 1 de dano em rodadas pares.",
      "rewardGold": 60,
      "rewardShards": 60,
      "rewardCardIds": [
        "red_08_dragao_vermelho",
        "red_14_diabo_espinhos"
      ],
      "loreIntro": "Igniskar, Tirano da Cratera mantém vigília soberana sobre Represa & Comportas de Magma Noroeste em Vulcanor, vedando o avanço pelas rotas interiores.",
      "deckId": "tri_red_blue_green",
      "customDeckCardIds": [],
      "difficultyTier": 5,
      "submapId": "capital_pyros",
      "landmarkName": "Represa & Comportas de Magma Noroeste",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "tri_red_blue_green",
      "archetypeTitle": "Tempestade Elemental Primeva"
    }
  },
  {
    "id": "gc_red_t5_capital_pyros_09",
    "stage": 105,
    "submapId": "capital_pyros",
    "submapOrder": 10,
    "rx": 51,
    "ry": 20,
    "worldX": 61,
    "worldY": 22,
    "landmarkName": "Cidadela da Bigorna & Trono de Basalto",
    "tier": 5,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_red_t5_capital_pyros_09",
      "stage": 105,
      "name": "Hoste Dracônica da Cratera",
      "title": "Lorde Soberano • Cidadela da Bigorna & Trono de Basalto",
      "domains": [
        "red",
        "green",
        "gold"
      ],
      "avatarCardId": "red_172_armada_draconica_chama",
      "startingHp": 40,
      "passiveName": "Trono Supremo de Vulcanor",
      "passiveDescription": "+1 Essência inicial; tropas entram com +1 ATQ/+1 Armadura e o calor causa 1 de dano em rodadas pares.",
      "rewardGold": 60,
      "rewardShards": 60,
      "rewardCardIds": [
        "red_172_armada_draconica_chama",
        "red_59_cao_magma"
      ],
      "loreIntro": "Hoste Dracônica da Cratera mantém vigília soberana sobre Cidadela da Bigorna & Trono de Basalto em Vulcanor, vedando o avanço pelas rotas interiores.",
      "deckId": "tri_red_green_gold",
      "customDeckCardIds": [],
      "difficultyTier": 5,
      "submapId": "capital_pyros",
      "landmarkName": "Cidadela da Bigorna & Trono de Basalto",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "tri_red_green_gold",
      "archetypeTitle": "Tríade dos Titãs da Forja Primordial"
    }
  },
  {
    "id": "gc_red_t5_capital_pyros_10",
    "stage": 106,
    "submapId": "capital_pyros",
    "submapOrder": 11,
    "rx": 51,
    "ry": 33,
    "worldX": 61,
    "worldY": 22,
    "landmarkName": "Trono Supremo da Grande Bigorna de Vulcanor",
    "tier": 5,
    "encounterKind": "throne_apex",
    "isEntryNode": false,
    "isThroneNode": true,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_red_t5_capital_pyros_10",
      "stage": 106,
      "name": "Vulcanis, Titã da Bigorna Primordial",
      "title": "Soberano Supremo • Trono Supremo da Grande Bigorna de Vulcanor",
      "domains": [
        "red"
      ],
      "avatarCardId": "red_157_dragao_tiamat_carmesim",
      "startingHp": 40,
      "passiveName": "Trono Supremo de Vulcanor",
      "passiveDescription": "+1 Essência inicial; tropas entram com +1 ATQ/+1 Armadura e o calor causa 1 de dano em rodadas pares.",
      "rewardGold": 85,
      "rewardShards": 85,
      "rewardCardIds": [
        "red_157_dragao_tiamat_carmesim",
        "red_103_fissura_tectonica"
      ],
      "loreIntro": "No coração de Caldeira Imperial de Vulcanor, Vulcanis, Titã da Bigorna Primordial guarda o Trono Supremo da Grande Bigorna de Vulcanor com as relíquias e criaturas mais poderosas deste domínio.",
      "deckId": "mono_red_dragon",
      "customDeckCardIds": [],
      "difficultyTier": 5,
      "submapId": "capital_pyros",
      "landmarkName": "Trono Supremo da Grande Bigorna de Vulcanor",
      "encounterKind": "throne_apex",
      "archetypeId": "mono_red_dragon",
      "archetypeTitle": "Trono Dracônico"
    }
  },
  {
    "id": "gc_blue_t1_vortex_01",
    "stage": 107,
    "submapId": "vortex",
    "submapOrder": 1,
    "rx": 49,
    "ry": 81,
    "worldX": 41.5,
    "worldY": 11.5,
    "landmarkName": "Ponte de Gelo Astral",
    "tier": 1,
    "encounterKind": "rare_garrison",
    "isEntryNode": true,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_blue_t1_vortex_01",
      "stage": 107,
      "name": "Tecelão do Feixe Astral",
      "title": "Guardião de Fronteira • Ponte de Gelo Astral",
      "domains": [
        "blue"
      ],
      "avatarCardId": "blue_168_tecelao_feixe_gelo",
      "startingHp": 40,
      "passiveName": "Vigia Boreal",
      "passiveDescription": "Guarnição horológica das passagens congeladas de Vórtex.",
      "rewardGold": 12,
      "rewardShards": 10,
      "rewardCardIds": [
        "blue_168_tecelao_feixe_gelo",
        "blue_140_vortice_polar"
      ],
      "loreIntro": "Tecelão do Feixe Astral mantém vigília soberana sobre Ponte de Gelo Astral (Vórtex — Polos Setentrionais), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_blue_frost",
      "customDeckCardIds": [],
      "difficultyTier": 1,
      "submapId": "vortex",
      "landmarkName": "Ponte de Gelo Astral",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_blue_frost",
      "archetypeTitle": "Inverno Eterno"
    }
  },
  {
    "id": "gc_blue_t1_vortex_01_b",
    "stage": 108,
    "submapId": "vortex",
    "submapOrder": 2,
    "rx": 55.4,
    "ry": 79.3,
    "worldX": 41.5,
    "worldY": 11.5,
    "landmarkName": "Atalaia — Ponte de Gelo Astral",
    "tier": 1,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_blue_t1_vortex_01_b",
      "stage": 108,
      "name": "Arquimago da Cidadela Flutuante",
      "title": "Comandante Regional • Atalaia — Ponte de Gelo Astral",
      "domains": [
        "blue"
      ],
      "avatarCardId": "blue_96_arquimago_tempestade",
      "startingHp": 40,
      "passiveName": "Vigia Boreal",
      "passiveDescription": "Guarnição horológica das passagens congeladas de Vórtex.",
      "rewardGold": 12,
      "rewardShards": 10,
      "rewardCardIds": [
        "blue_96_arquimago_tempestade",
        "blue_126_tomo_zero_absoluto"
      ],
      "loreIntro": "Arquimago da Cidadela Flutuante lidera o posto avançado em Atalaia — Ponte de Gelo Astral (Vórtex — Polos Setentrionais). Vença o duelo para prosseguir pela estrada.",
      "deckId": "mono_blue_chrono",
      "customDeckCardIds": [],
      "difficultyTier": 1,
      "submapId": "vortex",
      "landmarkName": "Atalaia — Ponte de Gelo Astral",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_blue_chrono",
      "archetypeTitle": "Inverno Eterno"
    }
  },
  {
    "id": "gc_blue_t1_vortex_02",
    "stage": 109,
    "submapId": "vortex",
    "submapOrder": 3,
    "rx": 40,
    "ry": 69,
    "worldX": 41.5,
    "worldY": 11.5,
    "landmarkName": "Forte da Geada Negra",
    "tier": 1,
    "encounterKind": "rare_garrison",
    "isEntryNode": true,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_blue_t1_vortex_02",
      "stage": 109,
      "name": "Grifo-Tormenta de Asas Elétricas",
      "title": "Guardião de Fronteira • Forte da Geada Negra",
      "domains": [
        "blue"
      ],
      "avatarCardId": "blue_61_quimera_tempestade",
      "startingHp": 40,
      "passiveName": "Vigia Boreal",
      "passiveDescription": "Guarnição horológica das passagens congeladas de Vórtex.",
      "rewardGold": 12,
      "rewardShards": 10,
      "rewardCardIds": [
        "blue_61_quimera_tempestade",
        "blue_113_navegador_fenda"
      ],
      "loreIntro": "Grifo-Tormenta de Asas Elétricas mantém vigília soberana sobre Forte da Geada Negra (Vórtex — Polos Setentrionais), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_blue_frost",
      "customDeckCardIds": [],
      "difficultyTier": 1,
      "submapId": "vortex",
      "landmarkName": "Forte da Geada Negra",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_blue_frost",
      "archetypeTitle": "Inverno Eterno"
    }
  },
  {
    "id": "gc_blue_t1_vortex_02_b",
    "stage": 110,
    "submapId": "vortex",
    "submapOrder": 4,
    "rx": 35.9,
    "ry": 62.7,
    "worldX": 41.5,
    "worldY": 11.5,
    "landmarkName": "Baluarte — Forte da Geada Negra",
    "tier": 1,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_blue_t1_vortex_02_b",
      "stage": 110,
      "name": "Esfinge da Nebulosa Safira",
      "title": "Comandante Regional • Baluarte — Forte da Geada Negra",
      "domains": [
        "blue"
      ],
      "avatarCardId": "blue_132_esfinge_nebulosa",
      "startingHp": 40,
      "passiveName": "Vigia Boreal",
      "passiveDescription": "Guarnição horológica das passagens congeladas de Vórtex.",
      "rewardGold": 12,
      "rewardShards": 10,
      "rewardCardIds": [
        "blue_132_esfinge_nebulosa",
        "blue_09_onda_repulsora"
      ],
      "loreIntro": "Esfinge da Nebulosa Safira lidera o posto avançado em Baluarte — Forte da Geada Negra (Vórtex — Polos Setentrionais). Vença o duelo para prosseguir pela estrada.",
      "deckId": "mono_blue_abyssal",
      "customDeckCardIds": [],
      "difficultyTier": 1,
      "submapId": "vortex",
      "landmarkName": "Baluarte — Forte da Geada Negra",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_blue_abyssal",
      "archetypeTitle": "Inverno Eterno"
    }
  },
  {
    "id": "gc_blue_t2_vortex_03",
    "stage": 111,
    "submapId": "vortex",
    "submapOrder": 5,
    "rx": 75.8,
    "ry": 74.4,
    "worldX": 41.5,
    "worldY": 11.5,
    "landmarkName": "Cais dos Baleeiros Polares",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_blue_t2_vortex_03",
      "stage": 111,
      "name": "Miragem do Relógio Astral",
      "title": "Guardião de Fronteira • Cais dos Baleeiros Polares",
      "domains": [
        "blue"
      ],
      "avatarCardId": "blue_79_semblante_atemporal",
      "startingHp": 40,
      "passiveName": "Maré Cortante",
      "passiveDescription": "Esquadrão tático de controle glacial e refração.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "blue_79_semblante_atemporal",
        "blue_36_tomo_infinito"
      ],
      "loreIntro": "Miragem do Relógio Astral mantém vigília soberana sobre Cais dos Baleeiros Polares (Vórtex — Polos Setentrionais), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_blue_abyssal",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "vortex",
      "landmarkName": "Cais dos Baleeiros Polares",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_blue_abyssal",
      "archetypeTitle": "Frota Abissal"
    }
  },
  {
    "id": "gc_blue_t2_vortex_03_b",
    "stage": 112,
    "submapId": "vortex",
    "submapOrder": 6,
    "rx": 70.5,
    "ry": 62.9,
    "worldX": 41.5,
    "worldY": 11.5,
    "landmarkName": "Reduto — Cais dos Baleeiros Polares",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_blue_t2_vortex_03_b",
      "stage": 112,
      "name": "Pactuário do Espírito Glacial",
      "title": "Comandante Regional • Reduto — Cais dos Baleeiros Polares",
      "domains": [
        "blue"
      ],
      "avatarCardId": "blue_171_pactuario_elemental_gelo",
      "startingHp": 40,
      "passiveName": "Maré Cortante",
      "passiveDescription": "Esquadrão tático de controle glacial e refração.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "blue_171_pactuario_elemental_gelo",
        "blue_49_mente_onisciente"
      ],
      "loreIntro": "Pactuário do Espírito Glacial lidera o posto avançado em Reduto — Cais dos Baleeiros Polares (Vórtex — Polos Setentrionais). Vença o duelo para prosseguir pela estrada.",
      "deckId": "mono_blue_frost",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "vortex",
      "landmarkName": "Reduto — Cais dos Baleeiros Polares",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_blue_frost",
      "archetypeTitle": "Frota Abissal"
    }
  },
  {
    "id": "gc_blue_t2_vortex_04",
    "stage": 113,
    "submapId": "vortex",
    "submapOrder": 7,
    "rx": 20.5,
    "ry": 55.5,
    "worldX": 41.5,
    "worldY": 11.5,
    "landmarkName": "Estreito das Estrelas Mortas",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_blue_t2_vortex_04",
      "stage": 113,
      "name": "Roca das Nuvens Trovejantes",
      "title": "Guardião de Fronteira • Estreito das Estrelas Mortas",
      "domains": [
        "blue",
        "purple"
      ],
      "avatarCardId": "blue_25_roca",
      "startingHp": 40,
      "passiveName": "Maré Cortante",
      "passiveDescription": "Esquadrão tático de controle glacial e refração.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "blue_25_roca",
        "blue_12_espreitador_eter"
      ],
      "loreIntro": "Roca das Nuvens Trovejantes mantém vigília soberana sobre Estreito das Estrelas Mortas (Vórtex — Polos Setentrionais), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "dual_blue_purple",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "vortex",
      "landmarkName": "Estreito das Estrelas Mortas",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_blue_purple",
      "archetypeTitle": "Pacto da Tormenta Abissal"
    }
  },
  {
    "id": "gc_blue_t2_vortex_04_b",
    "stage": 114,
    "submapId": "vortex",
    "submapOrder": 8,
    "rx": 29.3,
    "ry": 43.7,
    "worldX": 41.5,
    "worldY": 11.5,
    "landmarkName": "Vanguarda — Estreito das Estrelas Mortas",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [
      "sea_of_storms"
    ],
    "boss": {
      "id": "gc_blue_t2_vortex_04_b",
      "stage": 114,
      "name": "Oráculo das Fossas Marinhas",
      "title": "Comandante Regional • Vanguarda — Estreito das Estrelas Mortas",
      "domains": [
        "blue",
        "purple"
      ],
      "avatarCardId": "blue_115_oraculo_mar_profundo",
      "startingHp": 40,
      "passiveName": "Maré Cortante",
      "passiveDescription": "Esquadrão tático de controle glacial e refração.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "blue_115_oraculo_mar_profundo",
        "blue_158_relampago_encadeado"
      ],
      "loreIntro": "Oráculo das Fossas Marinhas lidera o posto avançado em Vanguarda — Estreito das Estrelas Mortas (Vórtex — Polos Setentrionais). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_blue_green",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "vortex",
      "landmarkName": "Vanguarda — Estreito das Estrelas Mortas",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_blue_green",
      "archetypeTitle": "Pacto da Tormenta Abissal"
    }
  },
  {
    "id": "gc_blue_t2_vortex_05",
    "stage": 115,
    "submapId": "vortex",
    "submapOrder": 9,
    "rx": 56,
    "ry": 52,
    "worldX": 41.5,
    "worldY": 11.5,
    "landmarkName": "Vila Boreal dos Relojoeiros",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_blue_t2_vortex_05",
      "stage": 115,
      "name": "Serpente da Fossa Abissal",
      "title": "Guardião de Fronteira • Vila Boreal dos Relojoeiros",
      "domains": [
        "blue"
      ],
      "avatarCardId": "blue_133_serpente_fenda_marinha",
      "startingHp": 40,
      "passiveName": "Maré Cortante",
      "passiveDescription": "Esquadrão tático de controle glacial e refração.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "blue_133_serpente_fenda_marinha",
        "blue_36_tomo_infinito"
      ],
      "loreIntro": "Serpente da Fossa Abissal mantém vigília soberana sobre Vila Boreal dos Relojoeiros (Vórtex — Polos Setentrionais), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_blue_chrono",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "vortex",
      "landmarkName": "Vila Boreal dos Relojoeiros",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_blue_chrono",
      "archetypeTitle": "Conclave Cronomante"
    }
  },
  {
    "id": "gc_blue_t2_vortex_05_b",
    "stage": 116,
    "submapId": "vortex",
    "submapOrder": 10,
    "rx": 55,
    "ry": 46,
    "worldX": 41.5,
    "worldY": 11.5,
    "landmarkName": "Baluarte — Vila Boreal dos Relojoeiros",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_blue_t2_vortex_05_b",
      "stage": 116,
      "name": "Yan-Vael, Senhor do Furacão",
      "title": "Comandante Regional • Baluarte — Vila Boreal dos Relojoeiros",
      "domains": [
        "blue"
      ],
      "avatarCardId": "blue_62_principe_ar",
      "startingHp": 40,
      "passiveName": "Maré Cortante",
      "passiveDescription": "Esquadrão tático de controle glacial e refração.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "blue_62_principe_ar",
        "blue_19_yeti"
      ],
      "loreIntro": "Yan-Vael, Senhor do Furacão lidera o posto avançado em Baluarte — Vila Boreal dos Relojoeiros (Vórtex — Polos Setentrionais). Vença o duelo para prosseguir pela estrada.",
      "deckId": "mono_blue_abyssal",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "vortex",
      "landmarkName": "Baluarte — Vila Boreal dos Relojoeiros",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_blue_abyssal",
      "archetypeTitle": "Conclave Cronomante"
    }
  },
  {
    "id": "gc_blue_t2_vortex_06",
    "stage": 117,
    "submapId": "vortex",
    "submapOrder": 11,
    "rx": 71.5,
    "ry": 47,
    "worldX": 41.5,
    "worldY": 11.5,
    "landmarkName": "Ponte de Gelo Eterno",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_blue_t2_vortex_06",
      "stage": 117,
      "name": "Presságio da Revoada Glacial",
      "title": "Guardião de Fronteira • Ponte de Gelo Eterno",
      "domains": [
        "blue",
        "neutral"
      ],
      "avatarCardId": "blue_169_pressagio_revoada_gelo",
      "startingHp": 40,
      "passiveName": "Maré Cortante",
      "passiveDescription": "Esquadrão tático de controle glacial e refração.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "blue_169_pressagio_revoada_gelo",
        "blue_03_esfinge"
      ],
      "loreIntro": "Presságio da Revoada Glacial mantém vigília soberana sobre Ponte de Gelo Eterno (Vórtex — Polos Setentrionais), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "dual_blue_neutral",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "vortex",
      "landmarkName": "Ponte de Gelo Eterno",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_blue_neutral",
      "archetypeTitle": "Aliança do Astrolábio Arcano"
    }
  },
  {
    "id": "gc_blue_t2_vortex_06_b",
    "stage": 118,
    "submapId": "vortex",
    "submapOrder": 12,
    "rx": 63.6,
    "ry": 39.1,
    "worldX": 41.5,
    "worldY": 11.5,
    "landmarkName": "Atalaia — Ponte de Gelo Eterno",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_blue_t2_vortex_06_b",
      "stage": 118,
      "name": "Centopeia Térmica da Geleira",
      "title": "Comandante Regional • Atalaia — Ponte de Gelo Eterno",
      "domains": [
        "blue",
        "neutral"
      ],
      "avatarCardId": "blue_20_remorhaz",
      "startingHp": 40,
      "passiveName": "Maré Cortante",
      "passiveDescription": "Esquadrão tático de controle glacial e refração.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "blue_20_remorhaz",
        "blue_101_vortice_dimensional"
      ],
      "loreIntro": "Centopeia Térmica da Geleira lidera o posto avançado em Atalaia — Ponte de Gelo Eterno (Vórtex — Polos Setentrionais). Vença o duelo para prosseguir pela estrada.",
      "deckId": "mono_blue_chrono",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "vortex",
      "landmarkName": "Atalaia — Ponte de Gelo Eterno",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_blue_chrono",
      "archetypeTitle": "Aliança do Astrolábio Arcano"
    }
  },
  {
    "id": "gc_blue_t3_vortex_07",
    "stage": 119,
    "submapId": "vortex",
    "submapOrder": 13,
    "rx": 33.5,
    "ry": 25.5,
    "worldX": 41.5,
    "worldY": 11.5,
    "landmarkName": "Ilhas Glaciais Ocidentais",
    "tier": 3,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_blue_t3_vortex_07",
      "stage": 119,
      "name": "Arauto do Zero Prismático",
      "title": "Lorde Soberano • Ilhas Glaciais Ocidentais",
      "domains": [
        "blue"
      ],
      "avatarCardId": "blue_167_arauto_prisma_gelo",
      "startingHp": 40,
      "passiveName": "Égide de Safira",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 36,
      "rewardShards": 40,
      "rewardCardIds": [
        "blue_167_arauto_prisma_gelo",
        "blue_103_diluvio_arcano"
      ],
      "loreIntro": "Arauto do Zero Prismático mantém vigília soberana sobre Ilhas Glaciais Ocidentais em Vórtex, vedando o avanço pelas rotas interiores.",
      "deckId": "mono_blue_frost",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "vortex",
      "landmarkName": "Ilhas Glaciais Ocidentais",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "mono_blue_frost",
      "archetypeTitle": "Inverno Eterno"
    }
  },
  {
    "id": "gc_blue_t3_vortex_08",
    "stage": 120,
    "submapId": "vortex",
    "submapOrder": 14,
    "rx": 50,
    "ry": 36,
    "worldX": 41.5,
    "worldY": 11.5,
    "landmarkName": "Pináculo Polar de Chronos",
    "tier": 3,
    "encounterKind": "throne_apex",
    "isEntryNode": false,
    "isThroneNode": true,
    "unlocksSubmaps": [
      "astral_isles",
      "matrix"
    ],
    "boss": {
      "id": "gc_blue_t3_vortex_08",
      "stage": 120,
      "name": "Nereus, Soberano das Sete Marés",
      "title": "Soberano Supremo • Pináculo Polar de Chronos",
      "domains": [
        "blue"
      ],
      "avatarCardId": "blue_45_oraculo_abissal",
      "startingHp": 40,
      "passiveName": "Égide de Safira",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 61,
      "rewardShards": 65,
      "rewardCardIds": [
        "blue_45_oraculo_abissal",
        "blue_04_behir"
      ],
      "loreIntro": "No coração de Vórtex — Polos Setentrionais, Nereus, Soberano das Sete Marés guarda o Pináculo Polar de Chronos com as relíquias e criaturas mais poderosas deste domínio.",
      "deckId": "mono_blue_chrono",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "vortex",
      "landmarkName": "Pináculo Polar de Chronos",
      "encounterKind": "throne_apex",
      "archetypeId": "mono_blue_chrono",
      "archetypeTitle": "Conclave Cronomante"
    }
  },
  {
    "id": "gc_blue_t2_sea_of_storms_01",
    "stage": 121,
    "submapId": "sea_of_storms",
    "submapOrder": 1,
    "rx": 19,
    "ry": 73,
    "worldX": 77.5,
    "worldY": 12,
    "landmarkName": "Ponte de Gelo Astral",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": true,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_blue_t2_sea_of_storms_01",
      "stage": 121,
      "name": "Serpente Leviatã das Fendas",
      "title": "Guardião de Fronteira • Ponte de Gelo Astral",
      "domains": [
        "blue"
      ],
      "avatarCardId": "blue_95_leviata_abissal",
      "startingHp": 40,
      "passiveName": "Maré Cortante",
      "passiveDescription": "Esquadrão tático de controle glacial e refração.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "blue_95_leviata_abissal",
        "blue_17_bruxa_mar"
      ],
      "loreIntro": "Serpente Leviatã das Fendas mantém vigília soberana sobre Ponte de Gelo Astral (Mar Interior das Tormentas & Estreito das Frotas), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_blue_frost",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "sea_of_storms",
      "landmarkName": "Ponte de Gelo Astral",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_blue_frost",
      "archetypeTitle": "Inverno Eterno"
    }
  },
  {
    "id": "gc_blue_t2_sea_of_storms_01_b",
    "stage": 122,
    "submapId": "sea_of_storms",
    "submapOrder": 2,
    "rx": 19.9,
    "ry": 67.7,
    "worldX": 77.5,
    "worldY": 12,
    "landmarkName": "Baluarte — Ponte de Gelo Astral",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_blue_t2_sea_of_storms_01_b",
      "stage": 122,
      "name": "Arquimago da Singularidade",
      "title": "Comandante Regional • Baluarte — Ponte de Gelo Astral",
      "domains": [
        "blue"
      ],
      "avatarCardId": "blue_134_arquimago_singularidade",
      "startingHp": 40,
      "passiveName": "Maré Cortante",
      "passiveDescription": "Esquadrão tático de controle glacial e refração.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "blue_134_arquimago_singularidade",
        "blue_129_cronomante_ampulheta"
      ],
      "loreIntro": "Arquimago da Singularidade lidera o posto avançado em Baluarte — Ponte de Gelo Astral (Mar Interior das Tormentas & Estreito das Frotas). Vença o duelo para prosseguir pela estrada.",
      "deckId": "mono_blue_chrono",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "sea_of_storms",
      "landmarkName": "Baluarte — Ponte de Gelo Astral",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_blue_chrono",
      "archetypeTitle": "Inverno Eterno"
    }
  },
  {
    "id": "gc_blue_t2_sea_of_storms_02",
    "stage": 123,
    "submapId": "sea_of_storms",
    "submapOrder": 3,
    "rx": 31,
    "ry": 81,
    "worldX": 77.5,
    "worldY": 12,
    "landmarkName": "Observatório da Geada",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_blue_t2_sea_of_storms_02",
      "stage": 123,
      "name": "Arconte do Relâmpago Vivo",
      "title": "Guardião de Fronteira • Observatório da Geada",
      "domains": [
        "blue"
      ],
      "avatarCardId": "blue_43_arconte_tempestade",
      "startingHp": 40,
      "passiveName": "Maré Cortante",
      "passiveDescription": "Esquadrão tático de controle glacial e refração.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "blue_43_arconte_tempestade",
        "blue_165_planetario_horologico"
      ],
      "loreIntro": "Arconte do Relâmpago Vivo mantém vigília soberana sobre Observatório da Geada (Mar Interior das Tormentas & Estreito das Frotas), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_blue_chrono",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "sea_of_storms",
      "landmarkName": "Observatório da Geada",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_blue_chrono",
      "archetypeTitle": "Conclave Cronomante"
    }
  },
  {
    "id": "gc_blue_t2_sea_of_storms_02_b",
    "stage": 124,
    "submapId": "sea_of_storms",
    "submapOrder": 4,
    "rx": 35.3,
    "ry": 73.9,
    "worldX": 77.5,
    "worldY": 12,
    "landmarkName": "Atalaia — Observatório da Geada",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_blue_t2_sea_of_storms_02_b",
      "stage": 124,
      "name": "Hydrissa, Soberana do Redemoinho",
      "title": "Comandante Regional • Atalaia — Observatório da Geada",
      "domains": [
        "blue"
      ],
      "avatarCardId": "blue_152_arquimago_vortice",
      "startingHp": 40,
      "passiveName": "Maré Cortante",
      "passiveDescription": "Esquadrão tático de controle glacial e refração.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "blue_152_arquimago_vortice",
        "blue_71_tigela_mares"
      ],
      "loreIntro": "Hydrissa, Soberana do Redemoinho lidera o posto avançado em Atalaia — Observatório da Geada (Mar Interior das Tormentas & Estreito das Frotas). Vença o duelo para prosseguir pela estrada.",
      "deckId": "mono_blue_frost",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "sea_of_storms",
      "landmarkName": "Atalaia — Observatório da Geada",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_blue_frost",
      "archetypeTitle": "Conclave Cronomante"
    }
  },
  {
    "id": "gc_blue_t2_sea_of_storms_03",
    "stage": 125,
    "submapId": "sea_of_storms",
    "submapOrder": 5,
    "rx": 19,
    "ry": 57,
    "worldX": 77.5,
    "worldY": 12,
    "landmarkName": "Forte do Estreito Polar",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_blue_t2_sea_of_storms_03",
      "stage": 125,
      "name": "Serpe Trovejante de Doze Patas",
      "title": "Guardião de Fronteira • Forte do Estreito Polar",
      "domains": [
        "blue",
        "neutral"
      ],
      "avatarCardId": "blue_04_behir",
      "startingHp": 40,
      "passiveName": "Maré Cortante",
      "passiveDescription": "Esquadrão tático de controle glacial e refração.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "blue_04_behir",
        "blue_130_arraia_tempestade"
      ],
      "loreIntro": "Serpe Trovejante de Doze Patas mantém vigília soberana sobre Forte do Estreito Polar (Mar Interior das Tormentas & Estreito das Frotas), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "dual_blue_neutral",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "sea_of_storms",
      "landmarkName": "Forte do Estreito Polar",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_blue_neutral",
      "archetypeTitle": "Aliança do Astrolábio Arcano"
    }
  },
  {
    "id": "gc_blue_t2_sea_of_storms_03_b",
    "stage": 126,
    "submapId": "sea_of_storms",
    "submapOrder": 6,
    "rx": 24.6,
    "ry": 53.4,
    "worldX": 77.5,
    "worldY": 12,
    "landmarkName": "Reduto — Forte do Estreito Polar",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_blue_t2_sea_of_storms_03_b",
      "stage": 126,
      "name": "Arconte da Geada Inflexível",
      "title": "Comandante Regional • Reduto — Forte do Estreito Polar",
      "domains": [
        "blue",
        "neutral"
      ],
      "avatarCardId": "blue_21_executor_glacial",
      "startingHp": 40,
      "passiveName": "Maré Cortante",
      "passiveDescription": "Esquadrão tático de controle glacial e refração.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "blue_21_executor_glacial",
        "blue_120_prisao_zero_absoluto"
      ],
      "loreIntro": "Arconte da Geada Inflexível lidera o posto avançado em Reduto — Forte do Estreito Polar (Mar Interior das Tormentas & Estreito das Frotas). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_blue_gold",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "sea_of_storms",
      "landmarkName": "Reduto — Forte do Estreito Polar",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_blue_gold",
      "archetypeTitle": "Aliança do Astrolábio Arcano"
    }
  },
  {
    "id": "gc_blue_t3_sea_of_storms_04",
    "stage": 127,
    "submapId": "sea_of_storms",
    "submapOrder": 7,
    "rx": 33,
    "ry": 64,
    "worldX": 77.5,
    "worldY": 12,
    "landmarkName": "Farol dos Recifes Sudoeste",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_blue_t3_sea_of_storms_04",
      "stage": 127,
      "name": "Dragão do Glaciar Eterno",
      "title": "Guardião de Fronteira • Farol dos Recifes Sudoeste",
      "domains": [
        "blue",
        "red"
      ],
      "avatarCardId": "blue_135_dragao_glaciar_eterno",
      "startingHp": 40,
      "passiveName": "Égide de Safira",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "blue_135_dragao_glaciar_eterno",
        "blue_31_zero_absoluto"
      ],
      "loreIntro": "Dragão do Glaciar Eterno mantém vigília soberana sobre Farol dos Recifes Sudoeste (Mar Interior das Tormentas & Estreito das Frotas), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "dual_red_blue",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "sea_of_storms",
      "landmarkName": "Farol dos Recifes Sudoeste",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_red_blue",
      "archetypeTitle": "Pacto do Fogo Astral"
    }
  },
  {
    "id": "gc_blue_t3_sea_of_storms_04_b",
    "stage": 128,
    "submapId": "sea_of_storms",
    "submapOrder": 8,
    "rx": 39,
    "ry": 53.6,
    "worldX": 77.5,
    "worldY": 12,
    "landmarkName": "Reduto — Farol dos Recifes Sudoeste",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_blue_t3_sea_of_storms_04_b",
      "stage": 128,
      "name": "Soberano das Nuvens Altas",
      "title": "Comandante Regional • Reduto — Farol dos Recifes Sudoeste",
      "domains": [
        "blue",
        "red"
      ],
      "avatarCardId": "blue_05_gigante_nuvens",
      "startingHp": 40,
      "passiveName": "Égide de Safira",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "blue_05_gigante_nuvens",
        "blue_12_espreitador_eter"
      ],
      "loreIntro": "Soberano das Nuvens Altas lidera o posto avançado em Reduto — Farol dos Recifes Sudoeste (Mar Interior das Tormentas & Estreito das Frotas). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_blue_neutral",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "sea_of_storms",
      "landmarkName": "Reduto — Farol dos Recifes Sudoeste",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_blue_neutral",
      "archetypeTitle": "Pacto do Fogo Astral"
    }
  },
  {
    "id": "gc_blue_t3_sea_of_storms_05",
    "stage": 129,
    "submapId": "sea_of_storms",
    "submapOrder": 9,
    "rx": 31,
    "ry": 49,
    "worldX": 77.5,
    "worldY": 12,
    "landmarkName": "Passarela de Safira",
    "tier": 3,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_blue_t3_sea_of_storms_05",
      "stage": 129,
      "name": "Thaddeus, Senhor do Tempo",
      "title": "Lorde Soberano • Passarela de Safira",
      "domains": [
        "blue",
        "green"
      ],
      "avatarCardId": "blue_80_senhor_tempo",
      "startingHp": 40,
      "passiveName": "Égide de Safira",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 36,
      "rewardShards": 40,
      "rewardCardIds": [
        "blue_80_senhor_tempo",
        "blue_01_sentinela_ventos"
      ],
      "loreIntro": "Thaddeus, Senhor do Tempo mantém vigília soberana sobre Passarela de Safira em Mar das Tormentas, vedando o avanço pelas rotas interiores.",
      "deckId": "dual_blue_green",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "sea_of_storms",
      "landmarkName": "Passarela de Safira",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "dual_blue_green",
      "archetypeTitle": "Pacto da Evolução Quimérica"
    }
  },
  {
    "id": "gc_blue_t3_sea_of_storms_06",
    "stage": 130,
    "submapId": "sea_of_storms",
    "submapOrder": 10,
    "rx": 52,
    "ry": 46,
    "worldX": 77.5,
    "worldY": 12,
    "landmarkName": "Olho Marítimo das Tormentas",
    "tier": 3,
    "encounterKind": "throne_apex",
    "isEntryNode": false,
    "isThroneNode": true,
    "unlocksSubmaps": [
      "astral_isles"
    ],
    "boss": {
      "id": "gc_blue_t3_sea_of_storms_06",
      "stage": 130,
      "name": "Zephyros, O Dragão da Tempestade Astral",
      "title": "Soberano Supremo • Olho Marítimo das Tormentas",
      "domains": [
        "blue",
        "purple"
      ],
      "avatarCardId": "blue_97_draco_relampago",
      "startingHp": 40,
      "passiveName": "Égide de Safira",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 61,
      "rewardShards": 65,
      "rewardCardIds": [
        "blue_97_draco_relampago",
        "blue_110_enguia_voltaica"
      ],
      "loreIntro": "No coração de Mar Interior das Tormentas & Estreito das Frotas, Zephyros, O Dragão da Tempestade Astral guarda o Olho Marítimo das Tormentas com as relíquias e criaturas mais poderosas deste domínio.",
      "deckId": "dual_blue_purple",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "sea_of_storms",
      "landmarkName": "Olho Marítimo das Tormentas",
      "encounterKind": "throne_apex",
      "archetypeId": "dual_blue_purple",
      "archetypeTitle": "Pacto da Tormenta Abissal"
    }
  },
  {
    "id": "gc_blue_t3_astral_isles_01",
    "stage": 131,
    "submapId": "astral_isles",
    "submapOrder": 1,
    "rx": 79,
    "ry": 81,
    "worldX": 22.5,
    "worldY": 11.5,
    "landmarkName": "Ponte de Gelo Astral",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": true,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_blue_t3_astral_isles_01",
      "stage": 131,
      "name": "Kraken Couraçado da Tempestade",
      "title": "Guardião de Fronteira • Ponte de Gelo Astral",
      "domains": [
        "blue"
      ],
      "avatarCardId": "blue_116_kraken_tempestade",
      "startingHp": 40,
      "passiveName": "Égide de Safira",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "blue_116_kraken_tempestade",
        "blue_94_sentinela_safira"
      ],
      "loreIntro": "Kraken Couraçado da Tempestade mantém vigília soberana sobre Ponte de Gelo Astral (Arquipélago Astral das Estrelas Mortas), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_blue_frost",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "astral_isles",
      "landmarkName": "Ponte de Gelo Astral",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_blue_frost",
      "archetypeTitle": "Inverno Eterno"
    }
  },
  {
    "id": "gc_blue_t3_astral_isles_01_b",
    "stage": 132,
    "submapId": "astral_isles",
    "submapOrder": 2,
    "rx": 75.4,
    "ry": 73.6,
    "worldX": 22.5,
    "worldY": 11.5,
    "landmarkName": "Vanguarda — Ponte de Gelo Astral",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_blue_t3_astral_isles_01_b",
      "stage": 132,
      "name": "Zephyrus, Monarca do Ciclone",
      "title": "Comandante Regional • Vanguarda — Ponte de Gelo Astral",
      "domains": [
        "blue"
      ],
      "avatarCardId": "blue_153_leviata_fenda_abissal",
      "startingHp": 40,
      "passiveName": "Égide de Safira",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "blue_153_leviata_fenda_abissal",
        "blue_160_nevasca_soberana"
      ],
      "loreIntro": "Zephyrus, Monarca do Ciclone lidera o posto avançado em Vanguarda — Ponte de Gelo Astral (Arquipélago Astral das Estrelas Mortas). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_blue_purple",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "astral_isles",
      "landmarkName": "Vanguarda — Ponte de Gelo Astral",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_blue_purple",
      "archetypeTitle": "Inverno Eterno"
    }
  },
  {
    "id": "gc_blue_t3_astral_isles_02",
    "stage": 133,
    "submapId": "astral_isles",
    "submapOrder": 3,
    "rx": 48.5,
    "ry": 84.5,
    "worldX": 22.5,
    "worldY": 11.5,
    "landmarkName": "Ancoradouro de Safira Boreal",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": true,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_blue_t3_astral_isles_02",
      "stage": 133,
      "name": "Kryonax, Flagelo do Inverno",
      "title": "Guardião de Fronteira • Ancoradouro de Safira Boreal",
      "domains": [
        "blue",
        "gold"
      ],
      "avatarCardId": "blue_22_dragao_branco",
      "startingHp": 40,
      "passiveName": "Égide de Safira",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "blue_22_dragao_branco",
        "blue_10_portal_runas"
      ],
      "loreIntro": "Kryonax, Flagelo do Inverno mantém vigília soberana sobre Ancoradouro de Safira Boreal (Arquipélago Astral das Estrelas Mortas), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "dual_blue_gold",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "astral_isles",
      "landmarkName": "Ancoradouro de Safira Boreal",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_blue_gold",
      "archetypeTitle": "Pacto da Forja do Zênite"
    }
  },
  {
    "id": "gc_blue_t3_astral_isles_02_b",
    "stage": 134,
    "submapId": "astral_isles",
    "submapOrder": 4,
    "rx": 46.5,
    "ry": 73.9,
    "worldX": 22.5,
    "worldY": 11.5,
    "landmarkName": "Reduto — Ancoradouro de Safira Boreal",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_blue_t3_astral_isles_02_b",
      "stage": 134,
      "name": "Auronautilus, Dragão de Bronze",
      "title": "Comandante Regional • Reduto — Ancoradouro de Safira Boreal",
      "domains": [
        "blue",
        "gold"
      ],
      "avatarCardId": "blue_23_dragao_bronze",
      "startingHp": 40,
      "passiveName": "Égide de Safira",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "blue_23_dragao_bronze",
        "blue_94_sentinela_safira"
      ],
      "loreIntro": "Auronautilus, Dragão de Bronze lidera o posto avançado em Reduto — Ancoradouro de Safira Boreal (Arquipélago Astral das Estrelas Mortas). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_blue_purple",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "astral_isles",
      "landmarkName": "Reduto — Ancoradouro de Safira Boreal",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_blue_purple",
      "archetypeTitle": "Pacto da Forja do Zênite"
    }
  },
  {
    "id": "gc_blue_t3_astral_isles_03",
    "stage": 135,
    "submapId": "astral_isles",
    "submapOrder": 5,
    "rx": 83.4,
    "ry": 55.8,
    "worldX": 22.5,
    "worldY": 11.5,
    "landmarkName": "Draga de Safira",
    "tier": 3,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_blue_t3_astral_isles_03",
      "stage": 135,
      "name": "Aureon, Dragão da Geada Astral",
      "title": "Lorde Soberano • Draga de Safira",
      "domains": [
        "blue"
      ],
      "avatarCardId": "blue_44_dragao_prateado",
      "startingHp": 40,
      "passiveName": "Égide de Safira",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 36,
      "rewardShards": 40,
      "rewardCardIds": [
        "blue_44_dragao_prateado",
        "blue_51_dissipar_magia"
      ],
      "loreIntro": "Aureon, Dragão da Geada Astral mantém vigília soberana sobre Draga de Safira em Ilhas Astrais, vedando o avanço pelas rotas interiores.",
      "deckId": "mono_blue_chrono",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "astral_isles",
      "landmarkName": "Draga de Safira",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "mono_blue_chrono",
      "archetypeTitle": "Conclave Cronomante"
    }
  },
  {
    "id": "gc_blue_t4_astral_isles_04",
    "stage": 136,
    "submapId": "astral_isles",
    "submapOrder": 6,
    "rx": 51.7,
    "ry": 61.5,
    "worldX": 22.5,
    "worldY": 11.5,
    "landmarkName": "Cais Boreal",
    "tier": 4,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_blue_t4_astral_isles_04",
      "stage": 136,
      "name": "Aegirion, Soberano das Fendas Abissais",
      "title": "Lorde Soberano • Cais Boreal",
      "domains": [
        "blue",
        "red"
      ],
      "avatarCardId": "blue_98_soberano_mares",
      "startingHp": 40,
      "passiveName": "Zero Polar",
      "passiveDescription": "Criaturas entram com +1 Armadura e nevascas congelam 1 inimigo em rodadas pares.",
      "rewardGold": 48,
      "rewardShards": 50,
      "rewardCardIds": [
        "blue_98_soberano_mares",
        "blue_87_desacelerar_golpe"
      ],
      "loreIntro": "Aegirion, Soberano das Fendas Abissais mantém vigília soberana sobre Cais Boreal em Ilhas Astrais, vedando o avanço pelas rotas interiores.",
      "deckId": "dual_red_blue",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "astral_isles",
      "landmarkName": "Cais Boreal",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "dual_red_blue",
      "archetypeTitle": "Pacto do Fogo Astral"
    }
  },
  {
    "id": "gc_blue_t4_astral_isles_05",
    "stage": 137,
    "submapId": "astral_isles",
    "submapOrder": 7,
    "rx": 79,
    "ry": 41,
    "worldX": 22.5,
    "worldY": 11.5,
    "landmarkName": "Observatório da Geada",
    "tier": 4,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_blue_t4_astral_isles_05",
      "stage": 137,
      "name": "Chronoleviatã, Soberano do Tempo",
      "title": "Lorde Soberano • Observatório da Geada",
      "domains": [
        "blue",
        "red",
        "purple"
      ],
      "avatarCardId": "blue_136_leviata_cronos",
      "startingHp": 40,
      "passiveName": "Zero Polar",
      "passiveDescription": "Criaturas entram com +1 Armadura e nevascas congelam 1 inimigo em rodadas pares.",
      "rewardGold": 48,
      "rewardShards": 50,
      "rewardCardIds": [
        "blue_136_leviata_cronos",
        "blue_138_correntes_geada"
      ],
      "loreIntro": "Chronoleviatã, Soberano do Tempo mantém vigília soberana sobre Observatório da Geada em Ilhas Astrais, vedando o avanço pelas rotas interiores.",
      "deckId": "tri_red_blue_purple",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "astral_isles",
      "landmarkName": "Observatório da Geada",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "tri_red_blue_purple",
      "archetypeTitle": "Cataclismo da Convergência Astral"
    }
  },
  {
    "id": "gc_blue_t4_astral_isles_06",
    "stage": 138,
    "submapId": "astral_isles",
    "submapOrder": 8,
    "rx": 63,
    "ry": 46,
    "worldX": 22.5,
    "worldY": 11.5,
    "landmarkName": "Passarela de Luz Estelar",
    "tier": 4,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_blue_t4_astral_isles_06",
      "stage": 138,
      "name": "Orion, Arconte da Tempestade Astral",
      "title": "Lorde Soberano • Passarela de Luz Estelar",
      "domains": [
        "blue",
        "gold",
        "purple"
      ],
      "avatarCardId": "blue_117_arconte_astral",
      "startingHp": 40,
      "passiveName": "Zero Polar",
      "passiveDescription": "Criaturas entram com +1 Armadura e nevascas congelam 1 inimigo em rodadas pares.",
      "rewardGold": 48,
      "rewardShards": 50,
      "rewardCardIds": [
        "blue_117_arconte_astral",
        "blue_09_onda_repulsora"
      ],
      "loreIntro": "Orion, Arconte da Tempestade Astral mantém vigília soberana sobre Passarela de Luz Estelar em Ilhas Astrais, vedando o avanço pelas rotas interiores.",
      "deckId": "tri_blue_purple_gold",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "astral_isles",
      "landmarkName": "Passarela de Luz Estelar",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "tri_blue_purple_gold",
      "archetypeTitle": "Relicário do Trono Eterno"
    }
  },
  {
    "id": "gc_blue_t4_astral_isles_07",
    "stage": 139,
    "submapId": "astral_isles",
    "submapOrder": 9,
    "rx": 50,
    "ry": 36,
    "worldX": 22.5,
    "worldY": 11.5,
    "landmarkName": "Farol Horológico do Turbilhão Estelar",
    "tier": 4,
    "encounterKind": "throne_apex",
    "isEntryNode": false,
    "isThroneNode": true,
    "unlocksSubmaps": [
      "capital_vortex"
    ],
    "boss": {
      "id": "gc_blue_t4_astral_isles_07",
      "stage": 139,
      "name": "Thalassia, A Maré Devoradora",
      "title": "Soberano Supremo • Farol Horológico do Turbilhão Estelar",
      "domains": [
        "blue",
        "red",
        "green"
      ],
      "avatarCardId": "blue_63_leviata_primordial",
      "startingHp": 40,
      "passiveName": "Zero Polar",
      "passiveDescription": "Criaturas entram com +1 Armadura e nevascas congelam 1 inimigo em rodadas pares.",
      "rewardGold": 73,
      "rewardShards": 75,
      "rewardCardIds": [
        "blue_63_leviata_primordial",
        "blue_34_barreira_espelhada"
      ],
      "loreIntro": "No coração de Arquipélago Astral das Estrelas Mortas, Thalassia, A Maré Devoradora guarda o Farol Horológico do Turbilhão Estelar com as relíquias e criaturas mais poderosas deste domínio.",
      "deckId": "tri_red_blue_green",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "astral_isles",
      "landmarkName": "Farol Horológico do Turbilhão Estelar",
      "encounterKind": "throne_apex",
      "archetypeId": "tri_red_blue_green",
      "archetypeTitle": "Tempestade Elemental Primeva"
    }
  },
  {
    "id": "gc_blue_t3_capital_vortex_01",
    "stage": 140,
    "submapId": "capital_vortex",
    "submapOrder": 1,
    "rx": 49,
    "ry": 81,
    "worldX": 52.5,
    "worldY": 9.5,
    "landmarkName": "Ponte de Gelo Astral",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": true,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_blue_t3_capital_vortex_01",
      "stage": 140,
      "name": "Quelônio-Titã dos Mares",
      "title": "Guarnição de Fronteira • Ponte de Gelo Astral",
      "domains": [
        "blue"
      ],
      "avatarCardId": "blue_24_tartaruga_dragao",
      "startingHp": 40,
      "passiveName": "Égide de Safira",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "blue_24_tartaruga_dragao",
        "blue_08_chamado_trovao"
      ],
      "loreIntro": "Quelônio-Titã dos Mares mantém vigília soberana sobre Ponte de Gelo Astral em Cristália, vedando o avanço pelas rotas interiores.",
      "deckId": "mono_blue_frost",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "capital_vortex",
      "landmarkName": "Ponte de Gelo Astral",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_blue_frost",
      "archetypeTitle": "Inverno Eterno"
    }
  },
  {
    "id": "gc_blue_t3_capital_vortex_02",
    "stage": 141,
    "submapId": "capital_vortex",
    "submapOrder": 2,
    "rx": 61,
    "ry": 73,
    "worldX": 52.5,
    "worldY": 9.5,
    "landmarkName": "Observatório da Geada",
    "tier": 3,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": true,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_blue_t3_capital_vortex_02",
      "stage": 141,
      "name": "Cryonax, General da Roda Astral",
      "title": "Lorde Soberano • Observatório da Geada",
      "domains": [
        "blue",
        "neutral"
      ],
      "avatarCardId": "blue_173_general_roda_gelo",
      "startingHp": 40,
      "passiveName": "Égide de Safira",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 36,
      "rewardShards": 40,
      "rewardCardIds": [
        "blue_173_general_roda_gelo",
        "blue_32_transmutar_eter"
      ],
      "loreIntro": "Cryonax, General da Roda Astral mantém vigília soberana sobre Observatório da Geada em Cristália, vedando o avanço pelas rotas interiores.",
      "deckId": "dual_blue_neutral",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "capital_vortex",
      "landmarkName": "Observatório da Geada",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "dual_blue_neutral",
      "archetypeTitle": "Aliança do Astrolábio Arcano"
    }
  },
  {
    "id": "gc_blue_t4_capital_vortex_03",
    "stage": 142,
    "submapId": "capital_vortex",
    "submapOrder": 3,
    "rx": 25.5,
    "ry": 83.5,
    "worldX": 52.5,
    "worldY": 9.5,
    "landmarkName": "Eclusas & Docas dos Quebra-Gelos",
    "tier": 4,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_blue_t4_capital_vortex_03",
      "stage": 142,
      "name": "Vorthurion, Tempestade do Deserto",
      "title": "Lorde Soberano • Eclusas & Docas dos Quebra-Gelos",
      "domains": [
        "blue"
      ],
      "avatarCardId": "blue_06_dragao_azul",
      "startingHp": 40,
      "passiveName": "Zero Polar",
      "passiveDescription": "Criaturas entram com +1 Armadura e nevascas congelam 1 inimigo em rodadas pares.",
      "rewardGold": 48,
      "rewardShards": 50,
      "rewardCardIds": [
        "blue_06_dragao_azul",
        "blue_76_anomalia_viva"
      ],
      "loreIntro": "Vorthurion, Tempestade do Deserto mantém vigília soberana sobre Eclusas & Docas dos Quebra-Gelos em Cristália, vedando o avanço pelas rotas interiores.",
      "deckId": "mono_blue_abyssal",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "capital_vortex",
      "landmarkName": "Eclusas & Docas dos Quebra-Gelos",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "mono_blue_abyssal",
      "archetypeTitle": "Frota Abissal"
    }
  },
  {
    "id": "gc_blue_t4_capital_vortex_04",
    "stage": 143,
    "submapId": "capital_vortex",
    "submapOrder": 4,
    "rx": 74,
    "ry": 42,
    "worldX": 52.5,
    "worldY": 9.5,
    "landmarkName": "Manufatura Imperial de Engrenagens",
    "tier": 4,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_blue_t4_capital_vortex_04",
      "stage": 143,
      "name": "Chronos, Guardião do Eixo Eterno",
      "title": "Lorde Soberano • Manufatura Imperial de Engrenagens",
      "domains": [
        "blue",
        "gold"
      ],
      "avatarCardId": "blue_81_arconte_cronos",
      "startingHp": 40,
      "passiveName": "Zero Polar",
      "passiveDescription": "Criaturas entram com +1 Armadura e nevascas congelam 1 inimigo em rodadas pares.",
      "rewardGold": 48,
      "rewardShards": 50,
      "rewardCardIds": [
        "blue_81_arconte_cronos",
        "blue_112_golem_gelo_runico"
      ],
      "loreIntro": "Chronos, Guardião do Eixo Eterno mantém vigília soberana sobre Manufatura Imperial de Engrenagens em Cristália, vedando o avanço pelas rotas interiores.",
      "deckId": "dual_blue_gold",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "capital_vortex",
      "landmarkName": "Manufatura Imperial de Engrenagens",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "dual_blue_gold",
      "archetypeTitle": "Pacto da Forja do Zênite"
    }
  },
  {
    "id": "gc_blue_t4_capital_vortex_05",
    "stage": 144,
    "submapId": "capital_vortex",
    "submapOrder": 5,
    "rx": 21,
    "ry": 41,
    "worldX": 52.5,
    "worldY": 9.5,
    "landmarkName": "Claustro da Biblioteca Congelada",
    "tier": 4,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_blue_t4_capital_vortex_05",
      "stage": 144,
      "name": "Kraken da Fossa Abissal",
      "title": "Lorde Soberano • Claustro da Biblioteca Congelada",
      "domains": [
        "blue",
        "purple",
        "green"
      ],
      "avatarCardId": "blue_07_kraken",
      "startingHp": 40,
      "passiveName": "Zero Polar",
      "passiveDescription": "Criaturas entram com +1 Armadura e nevascas congelam 1 inimigo em rodadas pares.",
      "rewardGold": 48,
      "rewardShards": 50,
      "rewardCardIds": [
        "blue_07_kraken",
        "blue_150_guardiao_runa_safira"
      ],
      "loreIntro": "Kraken da Fossa Abissal mantém vigília soberana sobre Claustro da Biblioteca Congelada em Cristália, vedando o avanço pelas rotas interiores.",
      "deckId": "tri_blue_purple_green",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "capital_vortex",
      "landmarkName": "Claustro da Biblioteca Congelada",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "tri_blue_purple_green",
      "archetypeTitle": "Quimera da Fossa Abissal"
    }
  },
  {
    "id": "gc_blue_t5_capital_vortex_06",
    "stage": 145,
    "submapId": "capital_vortex",
    "submapOrder": 6,
    "rx": 57,
    "ry": 22,
    "worldX": 52.5,
    "worldY": 9.5,
    "landmarkName": "Anel Refractor das Sete Safiras",
    "tier": 5,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_blue_t5_capital_vortex_06",
      "stage": 145,
      "name": "Esquadra Dracônica da Nevasca",
      "title": "Lorde Soberano • Anel Refractor das Sete Safiras",
      "domains": [
        "blue",
        "red",
        "purple"
      ],
      "avatarCardId": "blue_172_armada_draconica_gelo",
      "startingHp": 40,
      "passiveName": "Trono do Grande Astrolábio",
      "passiveDescription": "+1 Essência inicial; +1 Armadura nas tropas, congela 1 unidade rival e restaura +1 PV em rodadas pares.",
      "rewardGold": 60,
      "rewardShards": 60,
      "rewardCardIds": [
        "blue_172_armada_draconica_gelo",
        "blue_48_inverter_gravidade"
      ],
      "loreIntro": "Esquadra Dracônica da Nevasca mantém vigília soberana sobre Anel Refractor das Sete Safiras em Cristália, vedando o avanço pelas rotas interiores.",
      "deckId": "tri_red_blue_purple",
      "customDeckCardIds": [],
      "difficultyTier": 5,
      "submapId": "capital_vortex",
      "landmarkName": "Anel Refractor das Sete Safiras",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "tri_red_blue_purple",
      "archetypeTitle": "Cataclismo da Convergência Astral"
    }
  },
  {
    "id": "gc_blue_t5_capital_vortex_07",
    "stage": 146,
    "submapId": "capital_vortex",
    "submapOrder": 7,
    "rx": 50,
    "ry": 38,
    "worldX": 52.5,
    "worldY": 9.5,
    "landmarkName": "Trono do Grande Astrolábio de Cristália",
    "tier": 5,
    "encounterKind": "throne_apex",
    "isEntryNode": false,
    "isThroneNode": true,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_blue_t5_capital_vortex_07",
      "stage": 146,
      "name": "Dragão de Safira Sônico",
      "title": "Soberano Supremo • Trono do Grande Astrolábio de Cristália",
      "domains": [
        "blue"
      ],
      "avatarCardId": "blue_154_dragao_safira_soberano",
      "startingHp": 40,
      "passiveName": "Trono do Grande Astrolábio",
      "passiveDescription": "+1 Essência inicial; +1 Armadura nas tropas, congela 1 unidade rival e restaura +1 PV em rodadas pares.",
      "rewardGold": 85,
      "rewardShards": 85,
      "rewardCardIds": [
        "blue_154_dragao_safira_soberano",
        "blue_90_orbe_quebrada"
      ],
      "loreIntro": "No coração de Pináculo Polar de Cristália, Dragão de Safira Sônico guarda o Trono do Grande Astrolábio de Cristália com as relíquias e criaturas mais poderosas deste domínio.",
      "deckId": "mono_blue_chrono",
      "customDeckCardIds": [],
      "difficultyTier": 5,
      "submapId": "capital_vortex",
      "landmarkName": "Trono do Grande Astrolábio de Cristália",
      "encounterKind": "throne_apex",
      "archetypeId": "mono_blue_chrono",
      "archetypeTitle": "Conclave Cronomante"
    }
  },
  {
    "id": "gc_purple_t1_eclipse_01",
    "stage": 147,
    "submapId": "eclipse",
    "submapOrder": 1,
    "rx": 85,
    "ry": 49,
    "worldX": 24.5,
    "worldY": 48,
    "landmarkName": "Ponte do Ossário",
    "tier": 1,
    "encounterKind": "rare_garrison",
    "isEntryNode": true,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t1_eclipse_01",
      "stage": 147,
      "name": "Espectro Usurpador de Sombras",
      "title": "Guardião de Fronteira • Ponte do Ossário",
      "domains": [
        "purple"
      ],
      "avatarCardId": "purple_44_devorador_intelecto",
      "startingHp": 40,
      "passiveName": "Ronda do Crepúsculo",
      "passiveDescription": "Guarda juramentada das gargantas sombrias do Eclipse.",
      "rewardGold": 12,
      "rewardShards": 10,
      "rewardCardIds": [
        "purple_44_devorador_intelecto",
        "purple_90_recipiente_arcano"
      ],
      "loreIntro": "Espectro Usurpador de Sombras mantém vigília soberana sobre Ponte do Ossário (Vale do Eclipse — Oeste Profundo), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_purple_crypt",
      "customDeckCardIds": [],
      "difficultyTier": 1,
      "submapId": "eclipse",
      "landmarkName": "Ponte do Ossário",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_purple_crypt",
      "archetypeTitle": "Culto da Cripta"
    }
  },
  {
    "id": "gc_purple_t1_eclipse_01_b",
    "stage": 148,
    "submapId": "eclipse",
    "submapOrder": 2,
    "rx": 83.7,
    "ry": 55.1,
    "worldX": 24.5,
    "worldY": 48,
    "landmarkName": "Reduto — Ponte do Ossário",
    "tier": 1,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t1_eclipse_01_b",
      "stage": 148,
      "name": "Tecelão do Feixe Umbral",
      "title": "Comandante Regional • Reduto — Ponte do Ossário",
      "domains": [
        "purple"
      ],
      "avatarCardId": "purple_168_tecelao_feixe_abismo",
      "startingHp": 40,
      "passiveName": "Ronda do Crepúsculo",
      "passiveDescription": "Guarda juramentada das gargantas sombrias do Eclipse.",
      "rewardGold": 12,
      "rewardShards": 10,
      "rewardCardIds": [
        "purple_168_tecelao_feixe_abismo",
        "purple_164_sentenca_tumulo"
      ],
      "loreIntro": "Tecelão do Feixe Umbral lidera o posto avançado em Reduto — Ponte do Ossário (Vale do Eclipse — Oeste Profundo). Vença o duelo para prosseguir pela estrada.",
      "deckId": "mono_purple_blood",
      "customDeckCardIds": [],
      "difficultyTier": 1,
      "submapId": "eclipse",
      "landmarkName": "Reduto — Ponte do Ossário",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_purple_blood",
      "archetypeTitle": "Culto da Cripta"
    }
  },
  {
    "id": "gc_purple_t1_eclipse_02",
    "stage": 149,
    "submapId": "eclipse",
    "submapOrder": 3,
    "rx": 83.9,
    "ry": 73.8,
    "worldX": 24.5,
    "worldY": 48,
    "landmarkName": "Altar do Miasma",
    "tier": 1,
    "encounterKind": "rare_garrison",
    "isEntryNode": true,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t1_eclipse_02",
      "stage": 149,
      "name": "Ceifador Executor Tumular",
      "title": "Guardião de Fronteira • Altar do Miasma",
      "domains": [
        "purple"
      ],
      "avatarCardId": "purple_133_ceifador_tumular",
      "startingHp": 40,
      "passiveName": "Ronda do Crepúsculo",
      "passiveDescription": "Guarda juramentada das gargantas sombrias do Eclipse.",
      "rewardGold": 12,
      "rewardShards": 10,
      "rewardCardIds": [
        "purple_133_ceifador_tumular",
        "purple_61_sombra_assassina"
      ],
      "loreIntro": "Ceifador Executor Tumular mantém vigília soberana sobre Altar do Miasma (Vale do Eclipse — Oeste Profundo), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_purple_crypt",
      "customDeckCardIds": [],
      "difficultyTier": 1,
      "submapId": "eclipse",
      "landmarkName": "Altar do Miasma",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_purple_crypt",
      "archetypeTitle": "Culto da Cripta"
    }
  },
  {
    "id": "gc_purple_t1_eclipse_02_b",
    "stage": 150,
    "submapId": "eclipse",
    "submapOrder": 4,
    "rx": 82,
    "ry": 64.6,
    "worldX": 24.5,
    "worldY": 48,
    "landmarkName": "Vanguarda — Altar do Miasma",
    "tier": 1,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t1_eclipse_02_b",
      "stage": 150,
      "name": "Astrolábio Vivo do Eclipse",
      "title": "Comandante Regional • Vanguarda — Altar do Miasma",
      "domains": [
        "purple"
      ],
      "avatarCardId": "purple_81_aberracao_relogio",
      "startingHp": 40,
      "passiveName": "Ronda do Crepúsculo",
      "passiveDescription": "Guarda juramentada das gargantas sombrias do Eclipse.",
      "rewardGold": 12,
      "rewardShards": 10,
      "rewardCardIds": [
        "purple_81_aberracao_relogio",
        "purple_114_cavaleiro_sangue_negro"
      ],
      "loreIntro": "Astrolábio Vivo do Eclipse lidera o posto avançado em Vanguarda — Altar do Miasma (Vale do Eclipse — Oeste Profundo). Vença o duelo para prosseguir pela estrada.",
      "deckId": "mono_purple_umbral",
      "customDeckCardIds": [],
      "difficultyTier": 1,
      "submapId": "eclipse",
      "landmarkName": "Vanguarda — Altar do Miasma",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_purple_umbral",
      "archetypeTitle": "Culto da Cripta"
    }
  },
  {
    "id": "gc_purple_t1_eclipse_03",
    "stage": 151,
    "submapId": "eclipse",
    "submapOrder": 5,
    "rx": 73,
    "ry": 57,
    "worldX": 24.5,
    "worldY": 48,
    "landmarkName": "Capela das Sombras",
    "tier": 1,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t1_eclipse_03",
      "stage": 151,
      "name": "Pactuário do Espírito Umbral",
      "title": "Guardião de Fronteira • Capela das Sombras",
      "domains": [
        "purple"
      ],
      "avatarCardId": "purple_171_pactuario_elemental_abismo",
      "startingHp": 40,
      "passiveName": "Ronda do Crepúsculo",
      "passiveDescription": "Guarda juramentada das gargantas sombrias do Eclipse.",
      "rewardGold": 12,
      "rewardShards": 10,
      "rewardCardIds": [
        "purple_171_pactuario_elemental_abismo",
        "purple_125_ataude_sangue"
      ],
      "loreIntro": "Pactuário do Espírito Umbral mantém vigília soberana sobre Capela das Sombras (Vale do Eclipse — Oeste Profundo), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_purple_umbral",
      "customDeckCardIds": [],
      "difficultyTier": 1,
      "submapId": "eclipse",
      "landmarkName": "Capela das Sombras",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_purple_umbral",
      "archetypeTitle": "Inquisição Umbral"
    }
  },
  {
    "id": "gc_purple_t1_eclipse_03_b",
    "stage": 152,
    "submapId": "eclipse",
    "submapOrder": 6,
    "rx": 69.6,
    "ry": 63.3,
    "worldX": 24.5,
    "worldY": 48,
    "landmarkName": "Baluarte — Capela das Sombras",
    "tier": 1,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t1_eclipse_03_b",
      "stage": 152,
      "name": "Lich da Entropia Temporal",
      "title": "Comandante Regional • Baluarte — Capela das Sombras",
      "domains": [
        "purple"
      ],
      "avatarCardId": "purple_80_necromante_entropia",
      "startingHp": 40,
      "passiveName": "Ronda do Crepúsculo",
      "passiveDescription": "Guarda juramentada das gargantas sombrias do Eclipse.",
      "rewardGold": 12,
      "rewardShards": 10,
      "rewardCardIds": [
        "purple_80_necromante_entropia",
        "purple_42_pesadelo_infernal"
      ],
      "loreIntro": "Lich da Entropia Temporal lidera o posto avançado em Baluarte — Capela das Sombras (Vale do Eclipse — Oeste Profundo). Vença o duelo para prosseguir pela estrada.",
      "deckId": "mono_purple_blood",
      "customDeckCardIds": [],
      "difficultyTier": 1,
      "submapId": "eclipse",
      "landmarkName": "Baluarte — Capela das Sombras",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_purple_blood",
      "archetypeTitle": "Inquisição Umbral"
    }
  },
  {
    "id": "gc_purple_t2_eclipse_04",
    "stage": 153,
    "submapId": "eclipse",
    "submapOrder": 7,
    "rx": 73,
    "ry": 41,
    "worldX": 24.5,
    "worldY": 48,
    "landmarkName": "Garganta do Crepúsculo",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t2_eclipse_04",
      "stage": 153,
      "name": "Presságio da Revoada Umbral",
      "title": "Guardião de Fronteira • Garganta do Crepúsculo",
      "domains": [
        "purple"
      ],
      "avatarCardId": "purple_169_pressagio_revoada_abismo",
      "startingHp": 40,
      "passiveName": "Selo Necromântico",
      "passiveDescription": "Legião umbral sustentada pelos ecos da cripta.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "purple_169_pressagio_revoada_abismo",
        "purple_85_enigma_extraplanar"
      ],
      "loreIntro": "Presságio da Revoada Umbral mantém vigília soberana sobre Garganta do Crepúsculo (Vale do Eclipse — Oeste Profundo), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_purple_blood",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "eclipse",
      "landmarkName": "Garganta do Crepúsculo",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_purple_blood",
      "archetypeTitle": "Pacto Sanguíneo"
    }
  },
  {
    "id": "gc_purple_t2_eclipse_04_b",
    "stage": 154,
    "submapId": "eclipse",
    "submapOrder": 8,
    "rx": 67.6,
    "ry": 39.5,
    "worldX": 24.5,
    "worldY": 48,
    "landmarkName": "Reduto — Garganta do Crepúsculo",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t2_eclipse_04_b",
      "stage": 154,
      "name": "Malphas, O Arquidemônio das Sombras",
      "title": "Comandante Regional • Reduto — Garganta do Crepúsculo",
      "domains": [
        "purple"
      ],
      "avatarCardId": "purple_97_arquidemonio_sombras",
      "startingHp": 40,
      "passiveName": "Selo Necromântico",
      "passiveDescription": "Legião umbral sustentada pelos ecos da cripta.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "purple_97_arquidemonio_sombras",
        "purple_59_duergar_despota"
      ],
      "loreIntro": "Malphas, O Arquidemônio das Sombras lidera o posto avançado em Reduto — Garganta do Crepúsculo (Vale do Eclipse — Oeste Profundo). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_red_purple",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "eclipse",
      "landmarkName": "Reduto — Garganta do Crepúsculo",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_red_purple",
      "archetypeTitle": "Pacto Sanguíneo"
    }
  },
  {
    "id": "gc_purple_t2_eclipse_05",
    "stage": 155,
    "submapId": "eclipse",
    "submapOrder": 9,
    "rx": 83,
    "ry": 21,
    "worldX": 24.5,
    "worldY": 48,
    "landmarkName": "Escarpa do Sol Carmesim",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t2_eclipse_05",
      "stage": 155,
      "name": "Paladino do Juramento Quebrado",
      "title": "Guardião de Fronteira • Escarpa do Sol Carmesim",
      "domains": [
        "purple",
        "red"
      ],
      "avatarCardId": "purple_05_cavaleiro_morte",
      "startingHp": 40,
      "passiveName": "Selo Necromântico",
      "passiveDescription": "Legião umbral sustentada pelos ecos da cripta.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "purple_05_cavaleiro_morte",
        "purple_130_verme_necrotico"
      ],
      "loreIntro": "Paladino do Juramento Quebrado mantém vigília soberana sobre Escarpa do Sol Carmesim (Vale do Eclipse — Oeste Profundo), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "dual_red_purple",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "eclipse",
      "landmarkName": "Escarpa do Sol Carmesim",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_red_purple",
      "archetypeTitle": "Pacto da Chama Sangrenta"
    }
  },
  {
    "id": "gc_purple_t2_eclipse_05_b",
    "stage": 156,
    "submapId": "eclipse",
    "submapOrder": 10,
    "rx": 74.8,
    "ry": 17.2,
    "worldX": 24.5,
    "worldY": 48,
    "landmarkName": "Atalaia — Escarpa do Sol Carmesim",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t2_eclipse_05_b",
      "stage": 156,
      "name": "Cavaleiro Pálido da Ruína",
      "title": "Comandante Regional • Atalaia — Escarpa do Sol Carmesim",
      "domains": [
        "purple",
        "red"
      ],
      "avatarCardId": "purple_98_cavaleiro_apocalipse",
      "startingHp": 40,
      "passiveName": "Selo Necromântico",
      "passiveDescription": "Legião umbral sustentada pelos ecos da cripta.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "purple_98_cavaleiro_apocalipse",
        "purple_69_dedo_morte"
      ],
      "loreIntro": "Cavaleiro Pálido da Ruína lidera o posto avançado em Atalaia — Escarpa do Sol Carmesim (Vale do Eclipse — Oeste Profundo). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_purple_green",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "eclipse",
      "landmarkName": "Atalaia — Escarpa do Sol Carmesim",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_purple_green",
      "archetypeTitle": "Pacto da Chama Sangrenta"
    }
  },
  {
    "id": "gc_purple_t2_eclipse_06",
    "stage": 157,
    "submapId": "eclipse",
    "submapOrder": 11,
    "rx": 61,
    "ry": 65,
    "worldX": 24.5,
    "worldY": 48,
    "landmarkName": "Forte da Névoa Negra",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t2_eclipse_06",
      "stage": 157,
      "name": "Soberano da Coroa Psiônica",
      "title": "Guardião de Fronteira • Forte da Névoa Negra",
      "domains": [
        "purple"
      ],
      "avatarCardId": "purple_116_devorador_mentes",
      "startingHp": 40,
      "passiveName": "Selo Necromântico",
      "passiveDescription": "Legião umbral sustentada pelos ecos da cripta.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "purple_116_devorador_mentes",
        "purple_69_dedo_morte"
      ],
      "loreIntro": "Soberano da Coroa Psiônica mantém vigília soberana sobre Forte da Névoa Negra (Vale do Eclipse — Oeste Profundo), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_purple_umbral",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "eclipse",
      "landmarkName": "Forte da Névoa Negra",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_purple_umbral",
      "archetypeTitle": "Inquisição Umbral"
    }
  },
  {
    "id": "gc_purple_t2_eclipse_06_b",
    "stage": 158,
    "submapId": "eclipse",
    "submapOrder": 12,
    "rx": 47.5,
    "ry": 73.3,
    "worldX": 24.5,
    "worldY": 48,
    "landmarkName": "Baluarte — Forte da Névoa Negra",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t2_eclipse_06_b",
      "stage": 158,
      "name": "Soberano do Crânio Abissal",
      "title": "Comandante Regional • Baluarte — Forte da Névoa Negra",
      "domains": [
        "purple"
      ],
      "avatarCardId": "purple_62_beholder_morte",
      "startingHp": 40,
      "passiveName": "Selo Necromântico",
      "passiveDescription": "Legião umbral sustentada pelos ecos da cripta.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "purple_62_beholder_morte",
        "purple_122_praga_necrotica"
      ],
      "loreIntro": "Soberano do Crânio Abissal lidera o posto avançado em Baluarte — Forte da Névoa Negra (Vale do Eclipse — Oeste Profundo). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_purple_neutral",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "eclipse",
      "landmarkName": "Baluarte — Forte da Névoa Negra",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_purple_neutral",
      "archetypeTitle": "Inquisição Umbral"
    }
  },
  {
    "id": "gc_purple_t2_eclipse_07",
    "stage": 159,
    "submapId": "eclipse",
    "submapOrder": 13,
    "rx": 64,
    "ry": 20,
    "worldX": 24.5,
    "worldY": 48,
    "landmarkName": "Bastilha de Sangue-Ferro",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t2_eclipse_07",
      "stage": 159,
      "name": "Arquidemônio do Miasma Eterno",
      "title": "Guardião de Fronteira • Bastilha de Sangue-Ferro",
      "domains": [
        "purple",
        "gold"
      ],
      "avatarCardId": "purple_153_arquidemonio_malogro",
      "startingHp": 40,
      "passiveName": "Selo Necromântico",
      "passiveDescription": "Legião umbral sustentada pelos ecos da cripta.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "purple_153_arquidemonio_malogro",
        "purple_85_enigma_extraplanar"
      ],
      "loreIntro": "Arquidemônio do Miasma Eterno mantém vigília soberana sobre Bastilha de Sangue-Ferro (Vale do Eclipse — Oeste Profundo), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "dual_purple_gold",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "eclipse",
      "landmarkName": "Bastilha de Sangue-Ferro",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_purple_gold",
      "archetypeTitle": "Pacto da Inquisição Crepuscular"
    }
  },
  {
    "id": "gc_purple_t2_eclipse_07_b",
    "stage": 160,
    "submapId": "eclipse",
    "submapOrder": 14,
    "rx": 59.4,
    "ry": 25,
    "worldX": 24.5,
    "worldY": 48,
    "landmarkName": "Vanguarda — Bastilha de Sangue-Ferro",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t2_eclipse_07_b",
      "stage": 160,
      "name": "Colosso Gótico da Catacumba",
      "title": "Comandante Regional • Vanguarda — Bastilha de Sangue-Ferro",
      "domains": [
        "purple",
        "gold"
      ],
      "avatarCardId": "purple_135_colosso_catacumba",
      "startingHp": 40,
      "passiveName": "Selo Necromântico",
      "passiveDescription": "Legião umbral sustentada pelos ecos da cripta.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "purple_135_colosso_catacumba",
        "purple_161_pacto_agonia_eterna"
      ],
      "loreIntro": "Colosso Gótico da Catacumba lidera o posto avançado em Vanguarda — Bastilha de Sangue-Ferro (Vale do Eclipse — Oeste Profundo). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_purple_green",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "eclipse",
      "landmarkName": "Vanguarda — Bastilha de Sangue-Ferro",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_purple_green",
      "archetypeTitle": "Pacto da Inquisição Crepuscular"
    }
  },
  {
    "id": "gc_purple_t2_eclipse_08",
    "stage": 161,
    "submapId": "eclipse",
    "submapOrder": 15,
    "rx": 61,
    "ry": 33,
    "worldX": 24.5,
    "worldY": 48,
    "landmarkName": "Cripta dos Juramentos",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t2_eclipse_08",
      "stage": 161,
      "name": "Serafim dos Anéis Abissais",
      "title": "Guardião de Fronteira • Cripta dos Juramentos",
      "domains": [
        "purple"
      ],
      "avatarCardId": "purple_06_tirano_ocular",
      "startingHp": 40,
      "passiveName": "Selo Necromântico",
      "passiveDescription": "Legião umbral sustentada pelos ecos da cripta.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "purple_06_tirano_ocular",
        "purple_58_micoide_esporos"
      ],
      "loreIntro": "Serafim dos Anéis Abissais mantém vigília soberana sobre Cripta dos Juramentos (Vale do Eclipse — Oeste Profundo), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_purple_crypt",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "eclipse",
      "landmarkName": "Cripta dos Juramentos",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_purple_crypt",
      "archetypeTitle": "Culto da Cripta"
    }
  },
  {
    "id": "gc_purple_t2_eclipse_08_b",
    "stage": 162,
    "submapId": "eclipse",
    "submapOrder": 16,
    "rx": 51.2,
    "ry": 36.6,
    "worldX": 24.5,
    "worldY": 48,
    "landmarkName": "Reduto — Cripta dos Juramentos",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t2_eclipse_08_b",
      "stage": 162,
      "name": "Matriarca da Noite Eterna",
      "title": "Comandante Regional • Reduto — Cripta dos Juramentos",
      "domains": [
        "purple"
      ],
      "avatarCardId": "purple_134_matriarca_noite_eterna",
      "startingHp": 40,
      "passiveName": "Selo Necromântico",
      "passiveDescription": "Legião umbral sustentada pelos ecos da cripta.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "purple_134_matriarca_noite_eterna",
        "purple_90_recipiente_arcano"
      ],
      "loreIntro": "Matriarca da Noite Eterna lidera o posto avançado em Reduto — Cripta dos Juramentos (Vale do Eclipse — Oeste Profundo). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_red_purple",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "eclipse",
      "landmarkName": "Reduto — Cripta dos Juramentos",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_red_purple",
      "archetypeTitle": "Culto da Cripta"
    }
  },
  {
    "id": "gc_purple_t2_eclipse_09",
    "stage": 163,
    "submapId": "eclipse",
    "submapOrder": 17,
    "rx": 27.8,
    "ry": 76.6,
    "worldX": 24.5,
    "worldY": 48,
    "landmarkName": "Cais de Marfim",
    "tier": 2,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t2_eclipse_09",
      "stage": 163,
      "name": "Balgorath, Flagelo do Abismo",
      "title": "Lorde Soberano • Cais de Marfim",
      "domains": [
        "purple",
        "neutral"
      ],
      "avatarCardId": "purple_08_lorde_abissal",
      "startingHp": 40,
      "passiveName": "Selo Necromântico",
      "passiveDescription": "Legião umbral sustentada pelos ecos da cripta.",
      "rewardGold": 24,
      "rewardShards": 30,
      "rewardCardIds": [
        "purple_08_lorde_abissal",
        "purple_89_ampulheta_sangue"
      ],
      "loreIntro": "Balgorath, Flagelo do Abismo mantém vigília soberana sobre Cais de Marfim em Eclipse, vedando o avanço pelas rotas interiores.",
      "deckId": "dual_purple_neutral",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "eclipse",
      "landmarkName": "Cais de Marfim",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "dual_purple_neutral",
      "archetypeTitle": "Aliança da Guilda das Máscaras"
    }
  },
  {
    "id": "gc_purple_t3_eclipse_10",
    "stage": 164,
    "submapId": "eclipse",
    "submapOrder": 18,
    "rx": 26,
    "ry": 22,
    "worldX": 24.5,
    "worldY": 48,
    "landmarkName": "Desfiladeiro da Fenda Abissal",
    "tier": 3,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t3_eclipse_10",
      "stage": 164,
      "name": "Arauto do Eclipse Prismático",
      "title": "Lorde Soberano • Desfiladeiro da Fenda Abissal",
      "domains": [
        "purple",
        "blue"
      ],
      "avatarCardId": "purple_167_arauto_prisma_abismo",
      "startingHp": 40,
      "passiveName": "Névoa Sangrenta",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Regeneração.",
      "rewardGold": 36,
      "rewardShards": 40,
      "rewardCardIds": [
        "purple_167_arauto_prisma_abismo",
        "purple_148_carnical_catacumba"
      ],
      "loreIntro": "Arauto do Eclipse Prismático mantém vigília soberana sobre Desfiladeiro da Fenda Abissal em Eclipse, vedando o avanço pelas rotas interiores.",
      "deckId": "dual_blue_purple",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "eclipse",
      "landmarkName": "Desfiladeiro da Fenda Abissal",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "dual_blue_purple",
      "archetypeTitle": "Pacto da Tormenta Abissal"
    }
  },
  {
    "id": "gc_purple_t3_eclipse_11",
    "stage": 165,
    "submapId": "eclipse",
    "submapOrder": 19,
    "rx": 14,
    "ry": 63,
    "worldX": 24.5,
    "worldY": 48,
    "landmarkName": "Farol da Lua Sangrenta",
    "tier": 3,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t3_eclipse_11",
      "stage": 165,
      "name": "Mycoria, Dama da Podridão",
      "title": "Lorde Soberano • Farol da Lua Sangrenta",
      "domains": [
        "purple",
        "green"
      ],
      "avatarCardId": "purple_63_rainha_fungos",
      "startingHp": 40,
      "passiveName": "Névoa Sangrenta",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Regeneração.",
      "rewardGold": 36,
      "rewardShards": 40,
      "rewardCardIds": [
        "purple_63_rainha_fungos",
        "purple_30_erguer_mortos"
      ],
      "loreIntro": "Mycoria, Dama da Podridão mantém vigília soberana sobre Farol da Lua Sangrenta em Eclipse, vedando o avanço pelas rotas interiores.",
      "deckId": "dual_purple_green",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "eclipse",
      "landmarkName": "Farol da Lua Sangrenta",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "dual_purple_green",
      "archetypeTitle": "Pacto da Podridão Eterna"
    }
  },
  {
    "id": "gc_purple_t3_eclipse_12",
    "stage": 166,
    "submapId": "eclipse",
    "submapOrder": 20,
    "rx": 51,
    "ry": 45,
    "worldX": 24.5,
    "worldY": 48,
    "landmarkName": "Altar Central do Vale do Eclipse",
    "tier": 3,
    "encounterKind": "throne_apex",
    "isEntryNode": false,
    "isThroneNode": true,
    "unlocksSubmaps": [
      "sunken_abyss",
      "matrix"
    ],
    "boss": {
      "id": "gc_purple_t3_eclipse_12",
      "stage": 166,
      "name": "Nihil-Vael, Devorador de Linhas do Tempo",
      "title": "Soberano Supremo • Altar Central do Vale do Eclipse",
      "domains": [
        "purple"
      ],
      "avatarCardId": "purple_82_senhor_malogro",
      "startingHp": 40,
      "passiveName": "Névoa Sangrenta",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Regeneração.",
      "rewardGold": 61,
      "rewardShards": 65,
      "rewardCardIds": [
        "purple_82_senhor_malogro",
        "purple_58_micoide_esporos"
      ],
      "loreIntro": "No coração de Vale do Eclipse — Oeste Profundo, Nihil-Vael, Devorador de Linhas do Tempo guarda o Altar Central do Vale do Eclipse com as relíquias e criaturas mais poderosas deste domínio.",
      "deckId": "mono_purple_blood",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "eclipse",
      "landmarkName": "Altar Central do Vale do Eclipse",
      "encounterKind": "throne_apex",
      "archetypeId": "mono_purple_blood",
      "archetypeTitle": "Pacto Sanguíneo"
    }
  },
  {
    "id": "gc_purple_t2_sunken_abyss_01",
    "stage": 167,
    "submapId": "sunken_abyss",
    "submapOrder": 1,
    "rx": 79,
    "ry": 25,
    "worldX": 15.5,
    "worldY": 65.5,
    "landmarkName": "Ponte do Ossário",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": true,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t2_sunken_abyss_01",
      "stage": 167,
      "name": "Nyxarion, o Dragão do Eclipse",
      "title": "Guardião de Fronteira • Ponte do Ossário",
      "domains": [
        "purple"
      ],
      "avatarCardId": "purple_45_dragao_sombras",
      "startingHp": 40,
      "passiveName": "Selo Necromântico",
      "passiveDescription": "Legião umbral sustentada pelos ecos da cripta.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "purple_45_dragao_sombras",
        "purple_30_erguer_mortos"
      ],
      "loreIntro": "Nyxarion, o Dragão do Eclipse mantém vigília soberana sobre Ponte do Ossário (Fossa Submersa da Catedral Afogada), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_purple_crypt",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "sunken_abyss",
      "landmarkName": "Ponte do Ossário",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_purple_crypt",
      "archetypeTitle": "Culto da Cripta"
    }
  },
  {
    "id": "gc_purple_t2_sunken_abyss_01_b",
    "stage": 168,
    "submapId": "sunken_abyss",
    "submapOrder": 2,
    "rx": 73.6,
    "ry": 24.5,
    "worldX": 15.5,
    "worldY": 65.5,
    "landmarkName": "Vanguarda — Ponte do Ossário",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t2_sunken_abyss_01_b",
      "stage": 168,
      "name": "Nocturnus, Dragão do Eclipse",
      "title": "Comandante Regional • Vanguarda — Ponte do Ossário",
      "domains": [
        "purple"
      ],
      "avatarCardId": "purple_24_dragao_sombras",
      "startingHp": 40,
      "passiveName": "Selo Necromântico",
      "passiveDescription": "Legião umbral sustentada pelos ecos da cripta.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "purple_24_dragao_sombras",
        "purple_49_banquete_almas"
      ],
      "loreIntro": "Nocturnus, Dragão do Eclipse lidera o posto avançado em Vanguarda — Ponte do Ossário (Fossa Submersa da Catedral Afogada). Vença o duelo para prosseguir pela estrada.",
      "deckId": "mono_purple_umbral",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "sunken_abyss",
      "landmarkName": "Vanguarda — Ponte do Ossário",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_purple_umbral",
      "archetypeTitle": "Culto da Cripta"
    }
  },
  {
    "id": "gc_purple_t2_sunken_abyss_02",
    "stage": 169,
    "submapId": "sunken_abyss",
    "submapOrder": 3,
    "rx": 67,
    "ry": 17,
    "worldX": 15.5,
    "worldY": 65.5,
    "landmarkName": "Capela das Sombras",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": true,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t2_sunken_abyss_02",
      "stage": 169,
      "name": "Behemoth Ossário das Catacumbas",
      "title": "Guardião de Fronteira • Capela das Sombras",
      "domains": [
        "purple"
      ],
      "avatarCardId": "purple_154_cavaleiro_morte_eterna",
      "startingHp": 40,
      "passiveName": "Selo Necromântico",
      "passiveDescription": "Legião umbral sustentada pelos ecos da cripta.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "purple_154_cavaleiro_morte_eterna",
        "purple_30_erguer_mortos"
      ],
      "loreIntro": "Behemoth Ossário das Catacumbas mantém vigília soberana sobre Capela das Sombras (Fossa Submersa da Catedral Afogada), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_purple_umbral",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "sunken_abyss",
      "landmarkName": "Capela das Sombras",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_purple_umbral",
      "archetypeTitle": "Inquisição Umbral"
    }
  },
  {
    "id": "gc_purple_t2_sunken_abyss_02_b",
    "stage": 170,
    "submapId": "sunken_abyss",
    "submapOrder": 4,
    "rx": 63.6,
    "ry": 23.3,
    "worldX": 15.5,
    "worldY": 65.5,
    "landmarkName": "Reduto — Capela das Sombras",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t2_sunken_abyss_02_b",
      "stage": 170,
      "name": "Serafim Caído do Vazio",
      "title": "Comandante Regional • Reduto — Capela das Sombras",
      "domains": [
        "purple"
      ],
      "avatarCardId": "purple_118_serafim_caido",
      "startingHp": 40,
      "passiveName": "Selo Necromântico",
      "passiveDescription": "Legião umbral sustentada pelos ecos da cripta.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "purple_118_serafim_caido",
        "purple_15_espectro"
      ],
      "loreIntro": "Serafim Caído do Vazio lidera o posto avançado em Reduto — Capela das Sombras (Fossa Submersa da Catedral Afogada). Vença o duelo para prosseguir pela estrada.",
      "deckId": "mono_purple_blood",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "sunken_abyss",
      "landmarkName": "Reduto — Capela das Sombras",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_purple_blood",
      "archetypeTitle": "Inquisição Umbral"
    }
  },
  {
    "id": "gc_purple_t2_sunken_abyss_03",
    "stage": 171,
    "submapId": "sunken_abyss",
    "submapOrder": 5,
    "rx": 79,
    "ry": 41,
    "worldX": 15.5,
    "worldY": 65.5,
    "landmarkName": "Forte da Névoa Negra",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t2_sunken_abyss_03",
      "stage": 171,
      "name": "Nosferatu, Soberano Carmesim",
      "title": "Guardião de Fronteira • Forte da Névoa Negra",
      "domains": [
        "purple",
        "neutral"
      ],
      "avatarCardId": "purple_19_conde_vampiro",
      "startingHp": 40,
      "passiveName": "Selo Necromântico",
      "passiveDescription": "Legião umbral sustentada pelos ecos da cripta.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "purple_19_conde_vampiro",
        "purple_77_devorador_anos"
      ],
      "loreIntro": "Nosferatu, Soberano Carmesim mantém vigília soberana sobre Forte da Névoa Negra (Fossa Submersa da Catedral Afogada), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "dual_purple_neutral",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "sunken_abyss",
      "landmarkName": "Forte da Névoa Negra",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_purple_neutral",
      "archetypeTitle": "Aliança da Guilda das Máscaras"
    }
  },
  {
    "id": "gc_purple_t2_sunken_abyss_03_b",
    "stage": 172,
    "submapId": "sunken_abyss",
    "submapOrder": 6,
    "rx": 74.4,
    "ry": 50.8,
    "worldX": 15.5,
    "worldY": 65.5,
    "landmarkName": "Atalaia — Forte da Névoa Negra",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t2_sunken_abyss_03_b",
      "stage": 172,
      "name": "Leviatã Psíquico Primordial",
      "title": "Comandante Regional • Atalaia — Forte da Névoa Negra",
      "domains": [
        "purple",
        "neutral"
      ],
      "avatarCardId": "purple_21_abolete",
      "startingHp": 40,
      "passiveName": "Selo Necromântico",
      "passiveDescription": "Legião umbral sustentada pelos ecos da cripta.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "purple_21_abolete",
        "purple_112_carnical_cripta"
      ],
      "loreIntro": "Leviatã Psíquico Primordial lidera o posto avançado em Atalaia — Forte da Névoa Negra (Fossa Submersa da Catedral Afogada). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_purple_gold",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "sunken_abyss",
      "landmarkName": "Atalaia — Forte da Névoa Negra",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_purple_gold",
      "archetypeTitle": "Aliança da Guilda das Máscaras"
    }
  },
  {
    "id": "gc_purple_t3_sunken_abyss_04",
    "stage": 173,
    "submapId": "sunken_abyss",
    "submapOrder": 7,
    "rx": 67,
    "ry": 33,
    "worldX": 15.5,
    "worldY": 65.5,
    "landmarkName": "Garganta do Crepúsculo",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t3_sunken_abyss_04",
      "stage": 173,
      "name": "Arauto Supremo do Sol Negro",
      "title": "Guardião de Fronteira • Garganta do Crepúsculo",
      "domains": [
        "purple",
        "blue"
      ],
      "avatarCardId": "purple_137_arauto_sol_negro",
      "startingHp": 40,
      "passiveName": "Névoa Sangrenta",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Regeneração.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "purple_137_arauto_sol_negro",
        "purple_61_sombra_assassina"
      ],
      "loreIntro": "Arauto Supremo do Sol Negro mantém vigília soberana sobre Garganta do Crepúsculo (Fossa Submersa da Catedral Afogada), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "dual_blue_purple",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "sunken_abyss",
      "landmarkName": "Garganta do Crepúsculo",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_blue_purple",
      "archetypeTitle": "Pacto da Tormenta Abissal"
    }
  },
  {
    "id": "gc_purple_t3_sunken_abyss_04_b",
    "stage": 174,
    "submapId": "sunken_abyss",
    "submapOrder": 8,
    "rx": 58.7,
    "ry": 37.4,
    "worldX": 15.5,
    "worldY": 65.5,
    "landmarkName": "Vanguarda — Garganta do Crepúsculo",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t3_sunken_abyss_04_b",
      "stage": 174,
      "name": "Serpente Abissal de Seis Espadas",
      "title": "Comandante Regional • Vanguarda — Garganta do Crepúsculo",
      "domains": [
        "purple",
        "blue"
      ],
      "avatarCardId": "purple_25_dama_seis_laminas",
      "startingHp": 40,
      "passiveName": "Névoa Sangrenta",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Regeneração.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "purple_25_dama_seis_laminas",
        "purple_09_desintegrar"
      ],
      "loreIntro": "Serpente Abissal de Seis Espadas lidera o posto avançado em Vanguarda — Garganta do Crepúsculo (Fossa Submersa da Catedral Afogada). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_purple_green",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "sunken_abyss",
      "landmarkName": "Vanguarda — Garganta do Crepúsculo",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_purple_green",
      "archetypeTitle": "Pacto da Tormenta Abissal"
    }
  },
  {
    "id": "gc_purple_t3_sunken_abyss_05",
    "stage": 175,
    "submapId": "sunken_abyss",
    "submapOrder": 9,
    "rx": 55,
    "ry": 25,
    "worldX": 15.5,
    "worldY": 65.5,
    "landmarkName": "Cripta dos Juramentos",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t3_sunken_abyss_05",
      "stage": 175,
      "name": "Crânio Arcano da Morte",
      "title": "Guardião de Fronteira • Cripta dos Juramentos",
      "domains": [
        "purple"
      ],
      "avatarCardId": "purple_22_orbe_necrotico",
      "startingHp": 40,
      "passiveName": "Névoa Sangrenta",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Regeneração.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "purple_22_orbe_necrotico",
        "purple_151_inquisidor_umbral"
      ],
      "loreIntro": "Crânio Arcano da Morte mantém vigília soberana sobre Cripta dos Juramentos (Fossa Submersa da Catedral Afogada), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_purple_crypt",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "sunken_abyss",
      "landmarkName": "Cripta dos Juramentos",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_purple_crypt",
      "archetypeTitle": "Culto da Cripta"
    }
  },
  {
    "id": "gc_purple_t3_sunken_abyss_05_b",
    "stage": 176,
    "submapId": "sunken_abyss",
    "submapOrder": 10,
    "rx": 47.7,
    "ry": 31.1,
    "worldX": 15.5,
    "worldY": 65.5,
    "landmarkName": "Baluarte — Cripta dos Juramentos",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t3_sunken_abyss_05_b",
      "stage": 176,
      "name": "Voraghor, O Vazio Gelatinoso",
      "title": "Comandante Regional • Baluarte — Cripta dos Juramentos",
      "domains": [
        "purple"
      ],
      "avatarCardId": "purple_64_lorde_sem_rosto",
      "startingHp": 40,
      "passiveName": "Névoa Sangrenta",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Regeneração.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "purple_64_lorde_sem_rosto",
        "purple_125_ataude_sangue"
      ],
      "loreIntro": "Voraghor, O Vazio Gelatinoso lidera o posto avançado em Baluarte — Cripta dos Juramentos (Fossa Submersa da Catedral Afogada). Vença o duelo para prosseguir pela estrada.",
      "deckId": "mono_purple_blood",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "sunken_abyss",
      "landmarkName": "Baluarte — Cripta dos Juramentos",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_purple_blood",
      "archetypeTitle": "Culto da Cripta"
    }
  },
  {
    "id": "gc_purple_t3_sunken_abyss_06",
    "stage": 177,
    "submapId": "sunken_abyss",
    "submapOrder": 11,
    "rx": 76.3,
    "ry": 64.1,
    "worldX": 15.5,
    "worldY": 65.5,
    "landmarkName": "Mina de Marfim Abissal",
    "tier": 3,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t3_sunken_abyss_06",
      "stage": 177,
      "name": "Vladislaus, O Patriarca de Sangue",
      "title": "Lorde Soberano • Mina de Marfim Abissal",
      "domains": [
        "purple",
        "gold"
      ],
      "avatarCardId": "purple_99_lorde_vampiro_anciao",
      "startingHp": 40,
      "passiveName": "Névoa Sangrenta",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Regeneração.",
      "rewardGold": 36,
      "rewardShards": 40,
      "rewardCardIds": [
        "purple_99_lorde_vampiro_anciao",
        "purple_151_inquisidor_umbral"
      ],
      "loreIntro": "Vladislaus, O Patriarca de Sangue mantém vigília soberana sobre Mina de Marfim Abissal em Fossa Abissal, vedando o avanço pelas rotas interiores.",
      "deckId": "dual_purple_gold",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "sunken_abyss",
      "landmarkName": "Mina de Marfim Abissal",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "dual_purple_gold",
      "archetypeTitle": "Pacto da Inquisição Crepuscular"
    }
  },
  {
    "id": "gc_purple_t3_sunken_abyss_07",
    "stage": 178,
    "submapId": "sunken_abyss",
    "submapOrder": 12,
    "rx": 17.9,
    "ry": 15,
    "worldX": 15.5,
    "worldY": 65.5,
    "landmarkName": "Farol Carmesim",
    "tier": 3,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t3_sunken_abyss_07",
      "stage": 178,
      "name": "Carmilla, Condessa de Sangue e Ouro",
      "title": "Lorde Soberano • Farol Carmesim",
      "domains": [
        "purple",
        "red"
      ],
      "avatarCardId": "purple_46_noiva_vampira",
      "startingHp": 40,
      "passiveName": "Névoa Sangrenta",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Regeneração.",
      "rewardGold": 36,
      "rewardShards": 40,
      "rewardCardIds": [
        "purple_46_noiva_vampira",
        "purple_20_tecelao_profano"
      ],
      "loreIntro": "Carmilla, Condessa de Sangue e Ouro mantém vigília soberana sobre Farol Carmesim em Fossa Abissal, vedando o avanço pelas rotas interiores.",
      "deckId": "dual_red_purple",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "sunken_abyss",
      "landmarkName": "Farol Carmesim",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "dual_red_purple",
      "archetypeTitle": "Pacto da Chama Sangrenta"
    }
  },
  {
    "id": "gc_purple_t4_sunken_abyss_08",
    "stage": 179,
    "submapId": "sunken_abyss",
    "submapOrder": 13,
    "rx": 25,
    "ry": 42,
    "worldX": 15.5,
    "worldY": 65.5,
    "landmarkName": "Atalaia da Lanterna Carmesim",
    "tier": 4,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t4_sunken_abyss_08",
      "stage": 179,
      "name": "Malakor-Vael, Soberano da Não-Vida",
      "title": "Lorde Soberano • Atalaia da Lanterna Carmesim",
      "domains": [
        "purple",
        "gold",
        "red"
      ],
      "avatarCardId": "purple_65_principe_mortos",
      "startingHp": 40,
      "passiveName": "Liturgia de Nocturnus",
      "passiveDescription": "Criaturas aliadas recebem +1 Regeneração (+2 Afinidade Umbral inicial).",
      "rewardGold": 48,
      "rewardShards": 50,
      "rewardCardIds": [
        "purple_65_principe_mortos",
        "purple_79_assassino_lamento"
      ],
      "loreIntro": "Malakor-Vael, Soberano da Não-Vida mantém vigília soberana sobre Atalaia da Lanterna Carmesim em Fossa Abissal, vedando o avanço pelas rotas interiores.",
      "deckId": "tri_red_purple_gold",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "sunken_abyss",
      "landmarkName": "Atalaia da Lanterna Carmesim",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "tri_red_purple_gold",
      "archetypeTitle": "Eclipse do Sol Carmesim"
    }
  },
  {
    "id": "gc_purple_t4_sunken_abyss_09",
    "stage": 180,
    "submapId": "sunken_abyss",
    "submapOrder": 14,
    "rx": 55,
    "ry": 82,
    "worldX": 15.5,
    "worldY": 65.5,
    "landmarkName": "Entreposto dos Mergulhadores Umbrais",
    "tier": 4,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t4_sunken_abyss_09",
      "stage": 180,
      "name": "Vesperion, Arquimago Lich Imortal",
      "title": "Lorde Soberano • Entreposto dos Mergulhadores Umbrais",
      "domains": [
        "purple",
        "blue",
        "green"
      ],
      "avatarCardId": "purple_07_lich",
      "startingHp": 40,
      "passiveName": "Liturgia de Nocturnus",
      "passiveDescription": "Criaturas aliadas recebem +1 Regeneração (+2 Afinidade Umbral inicial).",
      "rewardGold": 48,
      "rewardShards": 50,
      "rewardCardIds": [
        "purple_07_lich",
        "purple_126_campanario_mortos"
      ],
      "loreIntro": "Vesperion, Arquimago Lich Imortal mantém vigília soberana sobre Entreposto dos Mergulhadores Umbrais em Fossa Abissal, vedando o avanço pelas rotas interiores.",
      "deckId": "tri_blue_purple_green",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "sunken_abyss",
      "landmarkName": "Entreposto dos Mergulhadores Umbrais",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "tri_blue_purple_green",
      "archetypeTitle": "Quimera da Fossa Abissal"
    }
  },
  {
    "id": "gc_purple_t4_sunken_abyss_10",
    "stage": 181,
    "submapId": "sunken_abyss",
    "submapOrder": 15,
    "rx": 54,
    "ry": 48,
    "worldX": 15.5,
    "worldY": 65.5,
    "landmarkName": "Basílica Submersa do Leviatã",
    "tier": 4,
    "encounterKind": "throne_apex",
    "isEntryNode": false,
    "isThroneNode": true,
    "unlocksSubmaps": [
      "capital_eclipse"
    ],
    "boss": {
      "id": "gc_purple_t4_sunken_abyss_10",
      "stage": 181,
      "name": "Malakor, Imperador da Entropia",
      "title": "Soberano Supremo • Basílica Submersa do Leviatã",
      "domains": [
        "purple",
        "red",
        "green"
      ],
      "avatarCardId": "purple_119_soberano_entropia",
      "startingHp": 40,
      "passiveName": "Liturgia de Nocturnus",
      "passiveDescription": "Criaturas aliadas recebem +1 Regeneração (+2 Afinidade Umbral inicial).",
      "rewardGold": 73,
      "rewardShards": 75,
      "rewardCardIds": [
        "purple_119_soberano_entropia",
        "purple_45_dragao_sombras"
      ],
      "loreIntro": "No coração de Fossa Submersa da Catedral Afogada, Malakor, Imperador da Entropia guarda o Basílica Submersa do Leviatã com as relíquias e criaturas mais poderosas deste domínio.",
      "deckId": "tri_red_purple_green",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "sunken_abyss",
      "landmarkName": "Basílica Submersa do Leviatã",
      "encounterKind": "throne_apex",
      "archetypeId": "tri_red_purple_green",
      "archetypeTitle": "Corte da Lua Sangrenta"
    }
  },
  {
    "id": "gc_purple_t3_capital_eclipse_01",
    "stage": 182,
    "submapId": "capital_eclipse",
    "submapOrder": 1,
    "rx": 85,
    "ry": 81,
    "worldX": 16.5,
    "worldY": 31.5,
    "landmarkName": "Ponte do Ossário",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": true,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t3_capital_eclipse_01",
      "stage": 182,
      "name": "Nosferatu, Monarca Carmesim",
      "title": "Guardião de Fronteira • Ponte do Ossário",
      "domains": [
        "purple"
      ],
      "avatarCardId": "purple_117_conde_nosferatu",
      "startingHp": 40,
      "passiveName": "Névoa Sangrenta",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Regeneração.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "purple_117_conde_nosferatu",
        "purple_125_ataude_sangue"
      ],
      "loreIntro": "Nosferatu, Monarca Carmesim mantém vigília soberana sobre Ponte do Ossário (Catedral-Necrópole de Nocturnus), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_purple_crypt",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "capital_eclipse",
      "landmarkName": "Ponte do Ossário",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_purple_crypt",
      "archetypeTitle": "Culto da Cripta"
    }
  },
  {
    "id": "gc_purple_t3_capital_eclipse_01_b",
    "stage": 183,
    "submapId": "capital_eclipse",
    "submapOrder": 2,
    "rx": 78.1,
    "ry": 76.3,
    "worldX": 16.5,
    "worldY": 31.5,
    "landmarkName": "Atalaia — Ponte do Ossário",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t3_capital_eclipse_01_b",
      "stage": 183,
      "name": "Dragão Espectral do Abismo",
      "title": "Comandante Regional • Atalaia — Ponte do Ossário",
      "domains": [
        "purple"
      ],
      "avatarCardId": "purple_136_dragao_espectral_abismo",
      "startingHp": 40,
      "passiveName": "Névoa Sangrenta",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Regeneração.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "purple_136_dragao_espectral_abismo",
        "purple_59_duergar_despota"
      ],
      "loreIntro": "Dragão Espectral do Abismo lidera o posto avançado em Atalaia — Ponte do Ossário (Catedral-Necrópole de Nocturnus). Vença o duelo para prosseguir pela estrada.",
      "deckId": "mono_purple_blood",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "capital_eclipse",
      "landmarkName": "Atalaia — Ponte do Ossário",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_purple_blood",
      "archetypeTitle": "Culto da Cripta"
    }
  },
  {
    "id": "gc_purple_t3_capital_eclipse_02",
    "stage": 184,
    "submapId": "capital_eclipse",
    "submapOrder": 3,
    "rx": 68,
    "ry": 78,
    "worldX": 16.5,
    "worldY": 31.5,
    "landmarkName": "Cidadela da Ordem Sangue-Negro",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": true,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t3_capital_eclipse_02",
      "stage": 184,
      "name": "Ceifador Gigante do Eclipse",
      "title": "Guardião de Fronteira • Cidadela da Ordem Sangue-Negro",
      "domains": [
        "purple",
        "gold"
      ],
      "avatarCardId": "purple_155_lorde_vampiro_soberano",
      "startingHp": 40,
      "passiveName": "Névoa Sangrenta",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Regeneração.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "purple_155_lorde_vampiro_soberano",
        "purple_61_sombra_assassina"
      ],
      "loreIntro": "Ceifador Gigante do Eclipse mantém vigília soberana sobre Cidadela da Ordem Sangue-Negro (Catedral-Necrópole de Nocturnus), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "dual_purple_gold",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "capital_eclipse",
      "landmarkName": "Cidadela da Ordem Sangue-Negro",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_purple_gold",
      "archetypeTitle": "Pacto da Inquisição Crepuscular"
    }
  },
  {
    "id": "gc_purple_t3_capital_eclipse_02_b",
    "stage": 185,
    "submapId": "capital_eclipse",
    "submapOrder": 4,
    "rx": 63.1,
    "ry": 75.7,
    "worldX": 16.5,
    "worldY": 31.5,
    "landmarkName": "Baluarte — Cidadela da Ordem Sangue-Negro",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t3_capital_eclipse_02_b",
      "stage": 185,
      "name": "Dragão Umbral do Eclipse",
      "title": "Comandante Regional • Baluarte — Cidadela da Ordem Sangue-Negro",
      "domains": [
        "purple",
        "gold"
      ],
      "avatarCardId": "purple_156_lich_coroa_entropia",
      "startingHp": 40,
      "passiveName": "Névoa Sangrenta",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Regeneração.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "purple_156_lich_coroa_entropia",
        "purple_49_banquete_almas"
      ],
      "loreIntro": "Dragão Umbral do Eclipse lidera o posto avançado em Baluarte — Cidadela da Ordem Sangue-Negro (Catedral-Necrópole de Nocturnus). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_purple_green",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "capital_eclipse",
      "landmarkName": "Baluarte — Cidadela da Ordem Sangue-Negro",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_purple_green",
      "archetypeTitle": "Pacto da Inquisição Crepuscular"
    }
  },
  {
    "id": "gc_purple_t3_capital_eclipse_03",
    "stage": 186,
    "submapId": "capital_eclipse",
    "submapOrder": 5,
    "rx": 79,
    "ry": 65,
    "worldX": 16.5,
    "worldY": 31.5,
    "landmarkName": "Capela das Sombras",
    "tier": 3,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t3_capital_eclipse_03",
      "stage": 186,
      "name": "Nocturnus, Avatar da Noite Sem Fim",
      "title": "Lorde Soberano • Capela das Sombras",
      "domains": [
        "purple"
      ],
      "avatarCardId": "purple_47_avatar_escuridao",
      "startingHp": 40,
      "passiveName": "Névoa Sangrenta",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Regeneração.",
      "rewardGold": 36,
      "rewardShards": 40,
      "rewardCardIds": [
        "purple_47_avatar_escuridao",
        "purple_45_dragao_sombras"
      ],
      "loreIntro": "Nocturnus, Avatar da Noite Sem Fim mantém vigília soberana sobre Capela das Sombras em Nocturnus, vedando o avanço pelas rotas interiores.",
      "deckId": "mono_purple_umbral",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "capital_eclipse",
      "landmarkName": "Capela das Sombras",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "mono_purple_umbral",
      "archetypeTitle": "Inquisição Umbral"
    }
  },
  {
    "id": "gc_purple_t4_capital_eclipse_04",
    "stage": 187,
    "submapId": "capital_eclipse",
    "submapOrder": 6,
    "rx": 55,
    "ry": 81,
    "worldX": 16.5,
    "worldY": 31.5,
    "landmarkName": "Forte da Névoa Negra",
    "tier": 4,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t4_capital_eclipse_04",
      "stage": 187,
      "name": "Nyxaroth, General da Roda Fúnebre",
      "title": "Lorde Soberano • Forte da Névoa Negra",
      "domains": [
        "purple",
        "blue"
      ],
      "avatarCardId": "purple_173_general_roda_abismo",
      "startingHp": 40,
      "passiveName": "Liturgia de Nocturnus",
      "passiveDescription": "Criaturas aliadas recebem +1 Regeneração (+2 Afinidade Umbral inicial).",
      "rewardGold": 48,
      "rewardShards": 50,
      "rewardCardIds": [
        "purple_173_general_roda_abismo",
        "purple_153_arquidemonio_malogro"
      ],
      "loreIntro": "Nyxaroth, General da Roda Fúnebre mantém vigília soberana sobre Forte da Névoa Negra em Nocturnus, vedando o avanço pelas rotas interiores.",
      "deckId": "dual_blue_purple",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "capital_eclipse",
      "landmarkName": "Forte da Névoa Negra",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "dual_blue_purple",
      "archetypeTitle": "Pacto da Tormenta Abissal"
    }
  },
  {
    "id": "gc_purple_t4_capital_eclipse_05",
    "stage": 188,
    "submapId": "capital_eclipse",
    "submapOrder": 7,
    "rx": 61,
    "ry": 65,
    "worldX": 16.5,
    "worldY": 31.5,
    "landmarkName": "Garganta do Crepúsculo",
    "tier": 4,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t4_capital_eclipse_05",
      "stage": 188,
      "name": "Mephistar, O Demônio do Pacto Eterno",
      "title": "Lorde Soberano • Garganta do Crepúsculo",
      "domains": [
        "purple",
        "red"
      ],
      "avatarCardId": "purple_83_arquidemonio_tempo",
      "startingHp": 40,
      "passiveName": "Liturgia de Nocturnus",
      "passiveDescription": "Criaturas aliadas recebem +1 Regeneração (+2 Afinidade Umbral inicial).",
      "rewardGold": 48,
      "rewardShards": 50,
      "rewardCardIds": [
        "purple_83_arquidemonio_tempo",
        "purple_117_conde_nosferatu"
      ],
      "loreIntro": "Mephistar, O Demônio do Pacto Eterno mantém vigília soberana sobre Garganta do Crepúsculo em Nocturnus, vedando o avanço pelas rotas interiores.",
      "deckId": "dual_red_purple",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "capital_eclipse",
      "landmarkName": "Garganta do Crepúsculo",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "dual_red_purple",
      "archetypeTitle": "Pacto da Chama Sangrenta"
    }
  },
  {
    "id": "gc_purple_t4_capital_eclipse_06",
    "stage": 189,
    "submapId": "capital_eclipse",
    "submapOrder": 8,
    "rx": 84,
    "ry": 52,
    "worldX": 16.5,
    "worldY": 31.5,
    "landmarkName": "Claustro dos Corvos & Arquivo Proibido",
    "tier": 4,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t4_capital_eclipse_06",
      "stage": 189,
      "name": "Necrothor, Monarca do Trono de Ossos",
      "title": "Lorde Soberano • Claustro dos Corvos & Arquivo Proibido",
      "domains": [
        "purple"
      ],
      "avatarCardId": "purple_138_soberano_carnica",
      "startingHp": 40,
      "passiveName": "Liturgia de Nocturnus",
      "passiveDescription": "Criaturas aliadas recebem +1 Regeneração (+2 Afinidade Umbral inicial).",
      "rewardGold": 48,
      "rewardShards": 50,
      "rewardCardIds": [
        "purple_138_soberano_carnica",
        "purple_48_toque_apodrecimento"
      ],
      "loreIntro": "Necrothor, Monarca do Trono de Ossos mantém vigília soberana sobre Claustro dos Corvos & Arquivo Proibido em Nocturnus, vedando o avanço pelas rotas interiores.",
      "deckId": "mono_purple_umbral",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "capital_eclipse",
      "landmarkName": "Claustro dos Corvos & Arquivo Proibido",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "mono_purple_umbral",
      "archetypeTitle": "Inquisição Umbral"
    }
  },
  {
    "id": "gc_purple_t4_capital_eclipse_07",
    "stage": 190,
    "submapId": "capital_eclipse",
    "submapOrder": 9,
    "rx": 67,
    "ry": 49,
    "worldX": 16.5,
    "worldY": 31.5,
    "landmarkName": "Cripta dos Juramentos",
    "tier": 4,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t4_capital_eclipse_07",
      "stage": 190,
      "name": "Morgath, O Dragão da Chama Necrótica",
      "title": "Lorde Soberano • Cripta dos Juramentos",
      "domains": [
        "purple",
        "gold",
        "green"
      ],
      "avatarCardId": "purple_100_dragao_necrotico",
      "startingHp": 40,
      "passiveName": "Liturgia de Nocturnus",
      "passiveDescription": "Criaturas aliadas recebem +1 Regeneração (+2 Afinidade Umbral inicial).",
      "rewardGold": 48,
      "rewardShards": 50,
      "rewardCardIds": [
        "purple_100_dragao_necrotico",
        "purple_27_emboscada_umbrosa"
      ],
      "loreIntro": "Morgath, O Dragão da Chama Necrótica mantém vigília soberana sobre Cripta dos Juramentos em Nocturnus, vedando o avanço pelas rotas interiores.",
      "deckId": "tri_purple_green_gold",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "capital_eclipse",
      "landmarkName": "Cripta dos Juramentos",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "tri_purple_green_gold",
      "archetypeTitle": "Armada do Zênite Umbral"
    }
  },
  {
    "id": "gc_purple_t5_capital_eclipse_08",
    "stage": 191,
    "submapId": "capital_eclipse",
    "submapOrder": 10,
    "rx": 15,
    "ry": 76,
    "worldX": 16.5,
    "worldY": 31.5,
    "landmarkName": "Cais Abissal dos Barqueiros",
    "tier": 5,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t5_capital_eclipse_08",
      "stage": 191,
      "name": "Ossaurion, Dragão-Ossário Eterno",
      "title": "Lorde Soberano • Cais Abissal dos Barqueiros",
      "domains": [
        "purple",
        "red",
        "green"
      ],
      "avatarCardId": "purple_23_dracolich",
      "startingHp": 40,
      "passiveName": "Trono de Obsidiana",
      "passiveDescription": "+1 Essência inicial; Lendárias ganham Renascer e drena 1 PV do rival em rodadas pares.",
      "rewardGold": 60,
      "rewardShards": 60,
      "rewardCardIds": [
        "purple_23_dracolich",
        "purple_67_sussurros_loucura"
      ],
      "loreIntro": "Ossaurion, Dragão-Ossário Eterno mantém vigília soberana sobre Cais Abissal dos Barqueiros em Nocturnus, vedando o avanço pelas rotas interiores.",
      "deckId": "tri_red_purple_green",
      "customDeckCardIds": [],
      "difficultyTier": 5,
      "submapId": "capital_eclipse",
      "landmarkName": "Cais Abissal dos Barqueiros",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "tri_red_purple_green",
      "archetypeTitle": "Corte da Lua Sangrenta"
    }
  },
  {
    "id": "gc_purple_t5_capital_eclipse_09",
    "stage": 192,
    "submapId": "capital_eclipse",
    "submapOrder": 11,
    "rx": 16,
    "ry": 18,
    "worldX": 16.5,
    "worldY": 31.5,
    "landmarkName": "Criptas Reais de Marfim Antigo",
    "tier": 5,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t5_capital_eclipse_09",
      "stage": 192,
      "name": "Legião Dracônica do Eclipse",
      "title": "Lorde Soberano • Criptas Reais de Marfim Antigo",
      "domains": [
        "purple"
      ],
      "avatarCardId": "purple_172_armada_draconica_abismo",
      "startingHp": 40,
      "passiveName": "Trono de Obsidiana",
      "passiveDescription": "+1 Essência inicial; Lendárias ganham Renascer e drena 1 PV do rival em rodadas pares.",
      "rewardGold": 60,
      "rewardShards": 60,
      "rewardCardIds": [
        "purple_172_armada_draconica_abismo",
        "purple_120_colheita_almas"
      ],
      "loreIntro": "Legião Dracônica do Eclipse mantém vigília soberana sobre Criptas Reais de Marfim Antigo em Nocturnus, vedando o avanço pelas rotas interiores.",
      "deckId": "mono_purple_crypt",
      "customDeckCardIds": [],
      "difficultyTier": 5,
      "submapId": "capital_eclipse",
      "landmarkName": "Criptas Reais de Marfim Antigo",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "mono_purple_crypt",
      "archetypeTitle": "Culto da Cripta"
    }
  },
  {
    "id": "gc_purple_t5_capital_eclipse_10",
    "stage": 193,
    "submapId": "capital_eclipse",
    "submapOrder": 12,
    "rx": 50,
    "ry": 36,
    "worldX": 16.5,
    "worldY": 31.5,
    "landmarkName": "Trono de Obsidiana da Catedral de Nocturnus",
    "tier": 5,
    "encounterKind": "throne_apex",
    "isEntryNode": false,
    "isThroneNode": true,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_purple_t5_capital_eclipse_10",
      "stage": 193,
      "name": "Monarca dos Três Crânios",
      "title": "Soberano Supremo • Trono de Obsidiana da Catedral de Nocturnus",
      "domains": [
        "purple"
      ],
      "avatarCardId": "purple_157_dragao_sombra_abissal",
      "startingHp": 40,
      "passiveName": "Trono de Obsidiana",
      "passiveDescription": "+1 Essência inicial; Lendárias ganham Renascer e drena 1 PV do rival em rodadas pares.",
      "rewardGold": 85,
      "rewardShards": 85,
      "rewardCardIds": [
        "purple_157_dragao_sombra_abissal",
        "purple_03_aparicao"
      ],
      "loreIntro": "No coração de Catedral-Necrópole de Nocturnus, Monarca dos Três Crânios guarda o Trono de Obsidiana da Catedral de Nocturnus com as relíquias e criaturas mais poderosas deste domínio.",
      "deckId": "mono_purple_blood",
      "customDeckCardIds": [],
      "difficultyTier": 5,
      "submapId": "capital_eclipse",
      "landmarkName": "Trono de Obsidiana da Catedral de Nocturnus",
      "encounterKind": "throne_apex",
      "archetypeId": "mono_purple_blood",
      "archetypeTitle": "Pacto Sanguíneo"
    }
  },
  {
    "id": "gc_gold_t1_solaria_01",
    "stage": 194,
    "submapId": "solaria",
    "submapOrder": 1,
    "rx": 23.1,
    "ry": 72.6,
    "worldX": 75.5,
    "worldY": 48.5,
    "landmarkName": "Vila dos Aquedutos",
    "tier": 1,
    "encounterKind": "rare_garrison",
    "isEntryNode": true,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_gold_t1_solaria_01",
      "stage": 194,
      "name": "Mestre-Ferreiro da Forja Imperial",
      "title": "Guardião de Fronteira • Vila dos Aquedutos",
      "domains": [
        "gold"
      ],
      "avatarCardId": "gold_133_mestre_forja_imperial",
      "startingHp": 40,
      "passiveName": "Falange da Aurora",
      "passiveDescription": "Guarnição disciplinada dos terraços externos de Solária.",
      "rewardGold": 12,
      "rewardShards": 10,
      "rewardCardIds": [
        "gold_133_mestre_forja_imperial",
        "gold_25_veredito_celestial"
      ],
      "loreIntro": "Mestre-Ferreiro da Forja Imperial mantém vigília soberana sobre Vila dos Aquedutos (Solária — O Leste Alto), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_gold_phalanx",
      "customDeckCardIds": [],
      "difficultyTier": 1,
      "submapId": "solaria",
      "landmarkName": "Vila dos Aquedutos",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_gold_phalanx",
      "archetypeTitle": "Falange Impenetrável"
    }
  },
  {
    "id": "gc_gold_t1_solaria_01_b",
    "stage": 195,
    "submapId": "solaria",
    "submapOrder": 2,
    "rx": 21.9,
    "ry": 58.9,
    "worldX": 75.5,
    "worldY": 48.5,
    "landmarkName": "Baluarte — Vila dos Aquedutos",
    "tier": 1,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_gold_t1_solaria_01_b",
      "stage": 195,
      "name": "Tecelão do Feixe Solar",
      "title": "Comandante Regional • Baluarte — Vila dos Aquedutos",
      "domains": [
        "gold"
      ],
      "avatarCardId": "gold_168_tecelao_feixe_sol",
      "startingHp": 40,
      "passiveName": "Falange da Aurora",
      "passiveDescription": "Guarnição disciplinada dos terraços externos de Solária.",
      "rewardGold": 12,
      "rewardShards": 10,
      "rewardCardIds": [
        "gold_168_tecelao_feixe_sol",
        "gold_10_egide_radiante"
      ],
      "loreIntro": "Tecelão do Feixe Solar lidera o posto avançado em Baluarte — Vila dos Aquedutos (Solária — O Leste Alto). Vença o duelo para prosseguir pela estrada.",
      "deckId": "mono_gold_judgment",
      "customDeckCardIds": [],
      "difficultyTier": 1,
      "submapId": "solaria",
      "landmarkName": "Baluarte — Vila dos Aquedutos",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_gold_judgment",
      "archetypeTitle": "Falange Impenetrável"
    }
  },
  {
    "id": "gc_gold_t1_solaria_02",
    "stage": 196,
    "submapId": "solaria",
    "submapOrder": 3,
    "rx": 19.8,
    "ry": 25.6,
    "worldX": 75.5,
    "worldY": 48.5,
    "landmarkName": "Atalaia da Garganta Dourada",
    "tier": 1,
    "encounterKind": "rare_garrison",
    "isEntryNode": true,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_gold_t1_solaria_02",
      "stage": 196,
      "name": "Justicar da Aurora Eterna",
      "title": "Guardião de Fronteira • Atalaia da Garganta Dourada",
      "domains": [
        "gold"
      ],
      "avatarCardId": "gold_80_paladino_destino",
      "startingHp": 40,
      "passiveName": "Falange da Aurora",
      "passiveDescription": "Guarnição disciplinada dos terraços externos de Solária.",
      "rewardGold": 12,
      "rewardShards": 10,
      "rewardCardIds": [
        "gold_80_paladino_destino",
        "gold_43_sentinela_relogio"
      ],
      "loreIntro": "Justicar da Aurora Eterna mantém vigília soberana sobre Atalaia da Garganta Dourada (Solária — O Leste Alto), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_gold_celestial",
      "customDeckCardIds": [],
      "difficultyTier": 1,
      "submapId": "solaria",
      "landmarkName": "Atalaia da Garganta Dourada",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_gold_celestial",
      "archetypeTitle": "Legião Celeste"
    }
  },
  {
    "id": "gc_gold_t1_solaria_02_b",
    "stage": 197,
    "submapId": "solaria",
    "submapOrder": 4,
    "rx": 24.4,
    "ry": 33.3,
    "worldX": 75.5,
    "worldY": 48.5,
    "landmarkName": "Atalaia — Atalaia da Garganta Dourada",
    "tier": 1,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_gold_t1_solaria_02_b",
      "stage": 197,
      "name": "Pactuário do Espírito Solar",
      "title": "Comandante Regional • Atalaia — Atalaia da Garganta Dourada",
      "domains": [
        "gold"
      ],
      "avatarCardId": "gold_171_pactuario_elemental_sol",
      "startingHp": 40,
      "passiveName": "Falange da Aurora",
      "passiveDescription": "Guarnição disciplinada dos terraços externos de Solária.",
      "rewardGold": 12,
      "rewardShards": 10,
      "rewardCardIds": [
        "gold_171_pactuario_elemental_sol",
        "gold_170_flagelo_cornudo_sol"
      ],
      "loreIntro": "Pactuário do Espírito Solar lidera o posto avançado em Atalaia — Atalaia da Garganta Dourada (Solária — O Leste Alto). Vença o duelo para prosseguir pela estrada.",
      "deckId": "mono_gold_phalanx",
      "customDeckCardIds": [],
      "difficultyTier": 1,
      "submapId": "solaria",
      "landmarkName": "Atalaia — Atalaia da Garganta Dourada",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_gold_phalanx",
      "archetypeTitle": "Legião Celeste"
    }
  },
  {
    "id": "gc_gold_t2_solaria_03",
    "stage": 198,
    "submapId": "solaria",
    "submapOrder": 5,
    "rx": 36,
    "ry": 60,
    "worldX": 75.5,
    "worldY": 48.5,
    "landmarkName": "Aqueduto Imperial de Alabastro",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_gold_t2_solaria_03",
      "stage": 198,
      "name": "Presságio da Revoada Solar",
      "title": "Guardião de Fronteira • Aqueduto Imperial de Alabastro",
      "domains": [
        "gold"
      ],
      "avatarCardId": "gold_169_pressagio_revoada_sol",
      "startingHp": 40,
      "passiveName": "Lança Radiante",
      "passiveDescription": "Ordem juramentada dos espelhos solares e pontes celestes.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "gold_169_pressagio_revoada_sol",
        "gold_108_trono_ordem_suprema"
      ],
      "loreIntro": "Presságio da Revoada Solar mantém vigília soberana sobre Aqueduto Imperial de Alabastro (Solária — O Leste Alto), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_gold_judgment",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "solaria",
      "landmarkName": "Aqueduto Imperial de Alabastro",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_gold_judgment",
      "archetypeTitle": "Julgamento Solar"
    }
  },
  {
    "id": "gc_gold_t2_solaria_03_b",
    "stage": 199,
    "submapId": "solaria",
    "submapOrder": 6,
    "rx": 41.2,
    "ry": 64.2,
    "worldX": 75.5,
    "worldY": 48.5,
    "landmarkName": "Atalaia — Aqueduto Imperial de Alabastro",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_gold_t2_solaria_03_b",
      "stage": 199,
      "name": "Thane das Colunas de Mármore",
      "title": "Comandante Regional • Atalaia — Aqueduto Imperial de Alabastro",
      "domains": [
        "gold"
      ],
      "avatarCardId": "gold_62_gigante_pedra_rei",
      "startingHp": 40,
      "passiveName": "Lança Radiante",
      "passiveDescription": "Ordem juramentada dos espelhos solares e pontes celestes.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "gold_62_gigante_pedra_rei",
        "gold_123_altar_sol_eterno"
      ],
      "loreIntro": "Thane das Colunas de Mármore lidera o posto avançado em Atalaia — Aqueduto Imperial de Alabastro (Solária — O Leste Alto). Vença o duelo para prosseguir pela estrada.",
      "deckId": "mono_gold_celestial",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "solaria",
      "landmarkName": "Atalaia — Aqueduto Imperial de Alabastro",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_gold_celestial",
      "archetypeTitle": "Julgamento Solar"
    }
  },
  {
    "id": "gc_gold_t2_solaria_04",
    "stage": 200,
    "submapId": "solaria",
    "submapOrder": 7,
    "rx": 35,
    "ry": 37,
    "worldX": 75.5,
    "worldY": 48.5,
    "landmarkName": "Cidadela da Guarda Dourada",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_gold_t2_solaria_04",
      "stage": 200,
      "name": "Serafim de Seis Asas do Zênite",
      "title": "Guardião de Fronteira • Cidadela da Guarda Dourada",
      "domains": [
        "gold"
      ],
      "avatarCardId": "gold_135_serafim_seis_asas",
      "startingHp": 40,
      "passiveName": "Lança Radiante",
      "passiveDescription": "Ordem juramentada dos espelhos solares e pontes celestes.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "gold_135_serafim_seis_asas",
        "gold_123_altar_sol_eterno"
      ],
      "loreIntro": "Serafim de Seis Asas do Zênite mantém vigília soberana sobre Cidadela da Guarda Dourada (Solária — O Leste Alto), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_gold_phalanx",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "solaria",
      "landmarkName": "Cidadela da Guarda Dourada",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_gold_phalanx",
      "archetypeTitle": "Falange Impenetrável"
    }
  },
  {
    "id": "gc_gold_t2_solaria_04_b",
    "stage": 201,
    "submapId": "solaria",
    "submapOrder": 8,
    "rx": 38.3,
    "ry": 32.3,
    "worldX": 75.5,
    "worldY": 48.5,
    "landmarkName": "Baluarte — Cidadela da Guarda Dourada",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_gold_t2_solaria_04_b",
      "stage": 201,
      "name": "Colosso de Mármore e Ouro",
      "title": "Comandante Regional • Baluarte — Cidadela da Guarda Dourada",
      "domains": [
        "gold"
      ],
      "avatarCardId": "gold_97_colosso_celestial",
      "startingHp": 40,
      "passiveName": "Lança Radiante",
      "passiveDescription": "Ordem juramentada dos espelhos solares e pontes celestes.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "gold_97_colosso_celestial",
        "gold_106_bastiao_eterno"
      ],
      "loreIntro": "Colosso de Mármore e Ouro lidera o posto avançado em Baluarte — Cidadela da Guarda Dourada (Solária — O Leste Alto). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_red_gold",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "solaria",
      "landmarkName": "Baluarte — Cidadela da Guarda Dourada",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_red_gold",
      "archetypeTitle": "Falange Impenetrável"
    }
  },
  {
    "id": "gc_gold_t2_solaria_05",
    "stage": 202,
    "submapId": "solaria",
    "submapOrder": 9,
    "rx": 42,
    "ry": 21.1,
    "worldX": 75.5,
    "worldY": 48.5,
    "landmarkName": "Mina de Ouro Sagrado",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_gold_t2_solaria_05",
      "stage": 202,
      "name": "Esfinge da Sentença Real",
      "title": "Guardião de Fronteira • Mina de Ouro Sagrado",
      "domains": [
        "gold",
        "neutral"
      ],
      "avatarCardId": "gold_134_esfinge_sentenca_real",
      "startingHp": 40,
      "passiveName": "Lança Radiante",
      "passiveDescription": "Ordem juramentada dos espelhos solares e pontes celestes.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "gold_134_esfinge_sentenca_real",
        "gold_49_colera_divina"
      ],
      "loreIntro": "Esfinge da Sentença Real mantém vigília soberana sobre Mina de Ouro Sagrado (Solária — O Leste Alto), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "dual_gold_neutral",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "solaria",
      "landmarkName": "Mina de Ouro Sagrado",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_gold_neutral",
      "archetypeTitle": "Aliança do Bastião Relojoeiro"
    }
  },
  {
    "id": "gc_gold_t2_solaria_05_b",
    "stage": 203,
    "submapId": "solaria",
    "submapOrder": 10,
    "rx": 52.2,
    "ry": 28.6,
    "worldX": 75.5,
    "worldY": 48.5,
    "landmarkName": "Vanguarda — Mina de Ouro Sagrado",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [
      "boreal_skyway"
    ],
    "boss": {
      "id": "gc_gold_t2_solaria_05_b",
      "stage": 203,
      "name": "Grão-Cã das Minas de Ouro",
      "title": "Comandante Regional • Vanguarda — Mina de Ouro Sagrado",
      "domains": [
        "gold",
        "neutral"
      ],
      "avatarCardId": "gold_22_soberano_dao",
      "startingHp": 40,
      "passiveName": "Lança Radiante",
      "passiveDescription": "Ordem juramentada dos espelhos solares e pontes celestes.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "gold_22_soberano_dao",
        "gold_113_valquiria_alvorada"
      ],
      "loreIntro": "Grão-Cã das Minas de Ouro lidera o posto avançado em Vanguarda — Mina de Ouro Sagrado (Solária — O Leste Alto). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_green_gold",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "solaria",
      "landmarkName": "Vanguarda — Mina de Ouro Sagrado",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_green_gold",
      "archetypeTitle": "Aliança do Bastião Relojoeiro"
    }
  },
  {
    "id": "gc_gold_t2_solaria_06",
    "stage": 204,
    "submapId": "solaria",
    "submapOrder": 11,
    "rx": 50,
    "ry": 78,
    "worldX": 75.5,
    "worldY": 48.5,
    "landmarkName": "Colunata dos Reis Antigos",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_gold_t2_solaria_06",
      "stage": 204,
      "name": "Raziel, Arconte da Espada Flamejante",
      "title": "Guardião de Fronteira • Colunata dos Reis Antigos",
      "domains": [
        "gold",
        "green"
      ],
      "avatarCardId": "gold_98_arconte_julgamento",
      "startingHp": 40,
      "passiveName": "Lança Radiante",
      "passiveDescription": "Ordem juramentada dos espelhos solares e pontes celestes.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "gold_98_arconte_julgamento",
        "gold_160_decreto_invulnerabilidade"
      ],
      "loreIntro": "Raziel, Arconte da Espada Flamejante mantém vigília soberana sobre Colunata dos Reis Antigos (Solária — O Leste Alto), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "dual_green_gold",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "solaria",
      "landmarkName": "Colunata dos Reis Antigos",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_green_gold",
      "archetypeTitle": "Pacto da Aurora Silvestre"
    }
  },
  {
    "id": "gc_gold_t2_solaria_06_b",
    "stage": 205,
    "submapId": "solaria",
    "submapOrder": 12,
    "rx": 56.7,
    "ry": 72.9,
    "worldX": 75.5,
    "worldY": 48.5,
    "landmarkName": "Reduto — Colunata dos Reis Antigos",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_gold_t2_solaria_06_b",
      "stage": 205,
      "name": "Leão Sagrado de Juba Solar",
      "title": "Comandante Regional • Reduto — Colunata dos Reis Antigos",
      "domains": [
        "gold",
        "green"
      ],
      "avatarCardId": "gold_154_colosso_marmore_sagrado",
      "startingHp": 40,
      "passiveName": "Lança Radiante",
      "passiveDescription": "Ordem juramentada dos espelhos solares e pontes celestes.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "gold_154_colosso_marmore_sagrado",
        "gold_32_estandarte_imperial"
      ],
      "loreIntro": "Leão Sagrado de Juba Solar lidera o posto avançado em Reduto — Colunata dos Reis Antigos (Solária — O Leste Alto). Vença o duelo para prosseguir pela estrada.",
      "deckId": "mono_gold_phalanx",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "solaria",
      "landmarkName": "Reduto — Colunata dos Reis Antigos",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_gold_phalanx",
      "archetypeTitle": "Pacto da Aurora Silvestre"
    }
  },
  {
    "id": "gc_gold_t3_solaria_07",
    "stage": 206,
    "submapId": "solaria",
    "submapOrder": 13,
    "rx": 67,
    "ry": 74,
    "worldX": 75.5,
    "worldY": 48.5,
    "landmarkName": "Porto Real do Sol Nascente",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_gold_t3_solaria_07",
      "stage": 206,
      "name": "Titã do Pêndulo Dourado",
      "title": "Guardião de Fronteira • Porto Real do Sol Nascente",
      "domains": [
        "gold",
        "blue"
      ],
      "avatarCardId": "gold_81_colosso_engrenagem",
      "startingHp": 40,
      "passiveName": "Bastião da Alvorada",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "gold_81_colosso_engrenagem",
        "gold_125_fornalha_celestial"
      ],
      "loreIntro": "Titã do Pêndulo Dourado mantém vigília soberana sobre Porto Real do Sol Nascente (Solária — O Leste Alto), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "dual_blue_gold",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "solaria",
      "landmarkName": "Porto Real do Sol Nascente",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_blue_gold",
      "archetypeTitle": "Pacto da Forja do Zênite"
    }
  },
  {
    "id": "gc_gold_t3_solaria_07_b",
    "stage": 207,
    "submapId": "solaria",
    "submapOrder": 14,
    "rx": 55.8,
    "ry": 63.6,
    "worldX": 75.5,
    "worldY": 48.5,
    "landmarkName": "Baluarte — Porto Real do Sol Nascente",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_gold_t3_solaria_07_b",
      "stage": 207,
      "name": "Leão-Rei Celestial",
      "title": "Comandante Regional • Baluarte — Porto Real do Sol Nascente",
      "domains": [
        "gold",
        "blue"
      ],
      "avatarCardId": "gold_115_leao_celestial_rei",
      "startingHp": 40,
      "passiveName": "Bastião da Alvorada",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "gold_115_leao_celestial_rei",
        "gold_77_franco_atirador_fenda"
      ],
      "loreIntro": "Leão-Rei Celestial lidera o posto avançado em Baluarte — Porto Real do Sol Nascente (Solária — O Leste Alto). Vença o duelo para prosseguir pela estrada.",
      "deckId": "mono_gold_celestial",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "solaria",
      "landmarkName": "Baluarte — Porto Real do Sol Nascente",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_gold_celestial",
      "archetypeTitle": "Pacto da Forja do Zênite"
    }
  },
  {
    "id": "gc_gold_t3_solaria_08",
    "stage": 208,
    "submapId": "solaria",
    "submapOrder": 15,
    "rx": 68,
    "ry": 31,
    "worldX": 75.5,
    "worldY": 48.5,
    "landmarkName": "Mosteiro das Lentes Sagradas",
    "tier": 3,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_gold_t3_solaria_08",
      "stage": 208,
      "name": "Arauto do Zênite Prismático",
      "title": "Lorde Soberano • Mosteiro das Lentes Sagradas",
      "domains": [
        "gold"
      ],
      "avatarCardId": "gold_167_arauto_prisma_sol",
      "startingHp": 40,
      "passiveName": "Bastião da Alvorada",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 36,
      "rewardShards": 40,
      "rewardCardIds": [
        "gold_167_arauto_prisma_sol",
        "gold_10_egide_radiante"
      ],
      "loreIntro": "Arauto do Zênite Prismático mantém vigília soberana sobre Mosteiro das Lentes Sagradas em Solária, vedando o avanço pelas rotas interiores.",
      "deckId": "mono_gold_judgment",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "solaria",
      "landmarkName": "Mosteiro das Lentes Sagradas",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "mono_gold_judgment",
      "archetypeTitle": "Julgamento Solar"
    }
  },
  {
    "id": "gc_gold_t3_solaria_09",
    "stage": 209,
    "submapId": "solaria",
    "submapOrder": 16,
    "rx": 48,
    "ry": 46,
    "worldX": 75.5,
    "worldY": 48.5,
    "landmarkName": "Zênite Central de Solária",
    "tier": 3,
    "encounterKind": "throne_apex",
    "isEntryNode": false,
    "isThroneNode": true,
    "unlocksSubmaps": [
      "sky_bastions",
      "matrix"
    ],
    "boss": {
      "id": "gc_gold_t3_solaria_09",
      "stage": 209,
      "name": "Seraphiel, A Imperatriz das Seis Asas",
      "title": "Soberano Supremo • Zênite Central de Solária",
      "domains": [
        "gold"
      ],
      "avatarCardId": "gold_99_serafim_coroado",
      "startingHp": 40,
      "passiveName": "Bastião da Alvorada",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 61,
      "rewardShards": 65,
      "rewardCardIds": [
        "gold_99_serafim_coroado",
        "gold_78_cavaleiro_ambrosia"
      ],
      "loreIntro": "No coração de Solária — O Leste Alto, Seraphiel, A Imperatriz das Seis Asas guarda o Zênite Central de Solária com as relíquias e criaturas mais poderosas deste domínio.",
      "deckId": "mono_gold_celestial",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "solaria",
      "landmarkName": "Zênite Central de Solária",
      "encounterKind": "throne_apex",
      "archetypeId": "mono_gold_celestial",
      "archetypeTitle": "Legião Celeste"
    }
  },
  {
    "id": "gc_gold_t2_boreal_skyway_01",
    "stage": 210,
    "submapId": "boreal_skyway",
    "submapOrder": 1,
    "rx": 19,
    "ry": 65,
    "worldX": 73.5,
    "worldY": 30.5,
    "landmarkName": "Ponte de Alabastro",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": true,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_gold_t2_boreal_skyway_01",
      "stage": 210,
      "name": "Centurião da Forja Dourada",
      "title": "Guardião de Fronteira • Ponte de Alabastro",
      "domains": [
        "gold"
      ],
      "avatarCardId": "gold_116_centuriao_forja_dourada",
      "startingHp": 40,
      "passiveName": "Lança Radiante",
      "passiveDescription": "Ordem juramentada dos espelhos solares e pontes celestes.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "gold_116_centuriao_forja_dourada",
        "gold_17_couatl"
      ],
      "loreIntro": "Centurião da Forja Dourada mantém vigília soberana sobre Ponte de Alabastro (Corredor Boreal das Nuvens & Correntes Dracônicas), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_gold_phalanx",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "boreal_skyway",
      "landmarkName": "Ponte de Alabastro",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_gold_phalanx",
      "archetypeTitle": "Falange Impenetrável"
    }
  },
  {
    "id": "gc_gold_t2_boreal_skyway_01_b",
    "stage": 211,
    "submapId": "boreal_skyway",
    "submapOrder": 2,
    "rx": 18.9,
    "ry": 59.6,
    "worldX": 73.5,
    "worldY": 30.5,
    "landmarkName": "Reduto — Ponte de Alabastro",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_gold_t2_boreal_skyway_01_b",
      "stage": 211,
      "name": "Touro Couraçado de Bronze",
      "title": "Comandante Regional • Reduto — Ponte de Alabastro",
      "domains": [
        "gold"
      ],
      "avatarCardId": "gold_19_touro_ferreo",
      "startingHp": 40,
      "passiveName": "Lança Radiante",
      "passiveDescription": "Ordem juramentada dos espelhos solares e pontes celestes.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "gold_19_touro_ferreo",
        "gold_51_balista_cidadela"
      ],
      "loreIntro": "Touro Couraçado de Bronze lidera o posto avançado em Reduto — Ponte de Alabastro (Corredor Boreal das Nuvens & Correntes Dracônicas). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_blue_gold",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "boreal_skyway",
      "landmarkName": "Reduto — Ponte de Alabastro",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_blue_gold",
      "archetypeTitle": "Falange Impenetrável"
    }
  },
  {
    "id": "gc_gold_t2_boreal_skyway_02",
    "stage": 212,
    "submapId": "boreal_skyway",
    "submapOrder": 3,
    "rx": 19,
    "ry": 81,
    "worldX": 73.5,
    "worldY": 30.5,
    "landmarkName": "Forte do Zênite",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": true,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_gold_t2_boreal_skyway_02",
      "stage": 212,
      "name": "Autômato Égide da Cidadela",
      "title": "Guardião de Fronteira • Forte do Zênite",
      "domains": [
        "gold"
      ],
      "avatarCardId": "gold_05_automato_guardiao",
      "startingHp": 40,
      "passiveName": "Lança Radiante",
      "passiveDescription": "Ordem juramentada dos espelhos solares e pontes celestes.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "gold_05_automato_guardiao",
        "gold_149_sentinela_relogio_solar"
      ],
      "loreIntro": "Autômato Égide da Cidadela mantém vigília soberana sobre Forte do Zênite (Corredor Boreal das Nuvens & Correntes Dracônicas), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_gold_celestial",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "boreal_skyway",
      "landmarkName": "Forte do Zênite",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_gold_celestial",
      "archetypeTitle": "Legião Celeste"
    }
  },
  {
    "id": "gc_gold_t2_boreal_skyway_02_b",
    "stage": 213,
    "submapId": "boreal_skyway",
    "submapOrder": 4,
    "rx": 26.7,
    "ry": 81,
    "worldX": 73.5,
    "worldY": 30.5,
    "landmarkName": "Vanguarda — Forte do Zênite",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_gold_t2_boreal_skyway_02_b",
      "stage": 213,
      "name": "Hekaton, Monarca do Trono do Trovão",
      "title": "Comandante Regional • Vanguarda — Forte do Zênite",
      "domains": [
        "gold"
      ],
      "avatarCardId": "gold_64_rei_hekton",
      "startingHp": 40,
      "passiveName": "Lança Radiante",
      "passiveDescription": "Ordem juramentada dos espelhos solares e pontes celestes.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "gold_64_rei_hekton",
        "gold_71_elmo_brilho"
      ],
      "loreIntro": "Hekaton, Monarca do Trono do Trovão lidera o posto avançado em Vanguarda — Forte do Zênite (Corredor Boreal das Nuvens & Correntes Dracônicas). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_blue_gold",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "boreal_skyway",
      "landmarkName": "Vanguarda — Forte do Zênite",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_blue_gold",
      "archetypeTitle": "Legião Celeste"
    }
  },
  {
    "id": "gc_gold_t2_boreal_skyway_03",
    "stage": 214,
    "submapId": "boreal_skyway",
    "submapOrder": 5,
    "rx": 33,
    "ry": 74,
    "worldX": 73.5,
    "worldY": 30.5,
    "landmarkName": "Viaduto Imperial das Nuvens",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_gold_t2_boreal_skyway_03",
      "stage": 214,
      "name": "Arauto Seráfico da Alvorada",
      "title": "Guardião de Fronteira • Viaduto Imperial das Nuvens",
      "domains": [
        "gold",
        "neutral"
      ],
      "avatarCardId": "gold_06_deva",
      "startingHp": 40,
      "passiveName": "Lança Radiante",
      "passiveDescription": "Ordem juramentada dos espelhos solares e pontes celestes.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "gold_06_deva",
        "gold_58_sacerdote_luz"
      ],
      "loreIntro": "Arauto Seráfico da Alvorada mantém vigília soberana sobre Viaduto Imperial das Nuvens (Corredor Boreal das Nuvens & Correntes Dracônicas), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "dual_gold_neutral",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "boreal_skyway",
      "landmarkName": "Viaduto Imperial das Nuvens",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_gold_neutral",
      "archetypeTitle": "Aliança do Bastião Relojoeiro"
    }
  },
  {
    "id": "gc_gold_t2_boreal_skyway_03_b",
    "stage": 215,
    "submapId": "boreal_skyway",
    "submapOrder": 6,
    "rx": 28.7,
    "ry": 66.9,
    "worldX": 73.5,
    "worldY": 30.5,
    "landmarkName": "Baluarte — Viaduto Imperial das Nuvens",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_gold_t2_boreal_skyway_03_b",
      "stage": 215,
      "name": "Esfinge Guardiã do Templo Dourado",
      "title": "Comandante Regional • Baluarte — Viaduto Imperial das Nuvens",
      "domains": [
        "gold",
        "neutral"
      ],
      "avatarCardId": "gold_63_esfinge_dourada",
      "startingHp": 40,
      "passiveName": "Lança Radiante",
      "passiveDescription": "Ordem juramentada dos espelhos solares e pontes celestes.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "gold_63_esfinge_dourada",
        "gold_153_inquisidor_balanca_ouro"
      ],
      "loreIntro": "Esfinge Guardiã do Templo Dourado lidera o posto avançado em Baluarte — Viaduto Imperial das Nuvens (Corredor Boreal das Nuvens & Correntes Dracônicas). Vença o duelo para prosseguir pela estrada.",
      "deckId": "mono_gold_judgment",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "boreal_skyway",
      "landmarkName": "Baluarte — Viaduto Imperial das Nuvens",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_gold_judgment",
      "archetypeTitle": "Aliança do Bastião Relojoeiro"
    }
  },
  {
    "id": "gc_gold_t3_boreal_skyway_04",
    "stage": 216,
    "submapId": "boreal_skyway",
    "submapOrder": 7,
    "rx": 19,
    "ry": 49,
    "worldX": 73.5,
    "worldY": 30.5,
    "landmarkName": "Terraço dos Espelhos",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_gold_t3_boreal_skyway_04",
      "stage": 216,
      "name": "Serafim da Décima Segunda Hora",
      "title": "Guardião de Fronteira • Terraço dos Espelhos",
      "domains": [
        "gold",
        "blue"
      ],
      "avatarCardId": "gold_82_arcanjo_cronos",
      "startingHp": 40,
      "passiveName": "Bastião da Alvorada",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "gold_82_arcanjo_cronos",
        "gold_143_bigorna_sol_invicto"
      ],
      "loreIntro": "Serafim da Décima Segunda Hora mantém vigília soberana sobre Terraço dos Espelhos (Corredor Boreal das Nuvens & Correntes Dracônicas), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "dual_blue_gold",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "boreal_skyway",
      "landmarkName": "Terraço dos Espelhos",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_blue_gold",
      "archetypeTitle": "Pacto da Forja do Zênite"
    }
  },
  {
    "id": "gc_gold_t3_boreal_skyway_04_b",
    "stage": 217,
    "submapId": "boreal_skyway",
    "submapOrder": 8,
    "rx": 24.1,
    "ry": 39.5,
    "worldX": 73.5,
    "worldY": 30.5,
    "landmarkName": "Baluarte — Terraço dos Espelhos",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_gold_t3_boreal_skyway_04_b",
      "stage": 217,
      "name": "Titã da Cidadela do Zênite",
      "title": "Comandante Regional • Baluarte — Terraço dos Espelhos",
      "domains": [
        "gold",
        "blue"
      ],
      "avatarCardId": "gold_45_gigante_tempestade",
      "startingHp": 40,
      "passiveName": "Bastião da Alvorada",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "gold_45_gigante_tempestade",
        "gold_15_grifo_real"
      ],
      "loreIntro": "Titã da Cidadela do Zênite lidera o posto avançado em Baluarte — Terraço dos Espelhos (Corredor Boreal das Nuvens & Correntes Dracônicas). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_purple_gold",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "boreal_skyway",
      "landmarkName": "Baluarte — Terraço dos Espelhos",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_purple_gold",
      "archetypeTitle": "Pacto da Forja do Zênite"
    }
  },
  {
    "id": "gc_gold_t3_boreal_skyway_05",
    "stage": 218,
    "submapId": "boreal_skyway",
    "submapOrder": 9,
    "rx": 31,
    "ry": 57,
    "worldX": 73.5,
    "worldY": 30.5,
    "landmarkName": "Atalaia da Alvorada",
    "tier": 3,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_gold_t3_boreal_skyway_05",
      "stage": 218,
      "name": "Heliodor, Dragão do Sol Nascente",
      "title": "Lorde Soberano • Atalaia da Alvorada",
      "domains": [
        "gold",
        "purple"
      ],
      "avatarCardId": "gold_47_dragao_solar",
      "startingHp": 40,
      "passiveName": "Bastião da Alvorada",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 36,
      "rewardShards": 40,
      "rewardCardIds": [
        "gold_47_dragao_solar",
        "gold_22_soberano_dao"
      ],
      "loreIntro": "Heliodor, Dragão do Sol Nascente mantém vigília soberana sobre Atalaia da Alvorada em Corredor das Nuvens, vedando o avanço pelas rotas interiores.",
      "deckId": "dual_purple_gold",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "boreal_skyway",
      "landmarkName": "Atalaia da Alvorada",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "dual_purple_gold",
      "archetypeTitle": "Pacto da Inquisição Crepuscular"
    }
  },
  {
    "id": "gc_gold_t3_boreal_skyway_06",
    "stage": 219,
    "submapId": "boreal_skyway",
    "submapOrder": 10,
    "rx": 20,
    "ry": 24,
    "worldX": 73.5,
    "worldY": 30.5,
    "landmarkName": "Picos da Revoada Escarlate",
    "tier": 3,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_gold_t3_boreal_skyway_06",
      "stage": 219,
      "name": "Aurelion, O Titã Empíreo",
      "title": "Lorde Soberano • Picos da Revoada Escarlate",
      "domains": [
        "gold",
        "red"
      ],
      "avatarCardId": "gold_65_emperion_solar",
      "startingHp": 40,
      "passiveName": "Bastião da Alvorada",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 36,
      "rewardShards": 40,
      "rewardCardIds": [
        "gold_65_emperion_solar",
        "gold_134_esfinge_sentenca_real"
      ],
      "loreIntro": "Aurelion, O Titã Empíreo mantém vigília soberana sobre Picos da Revoada Escarlate em Corredor das Nuvens, vedando o avanço pelas rotas interiores.",
      "deckId": "dual_red_gold",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "boreal_skyway",
      "landmarkName": "Picos da Revoada Escarlate",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "dual_red_gold",
      "archetypeTitle": "Pacto das Escamas Imperiais"
    }
  },
  {
    "id": "gc_gold_t3_boreal_skyway_07",
    "stage": 220,
    "submapId": "boreal_skyway",
    "submapOrder": 11,
    "rx": 52,
    "ry": 42,
    "worldX": 73.5,
    "worldY": 30.5,
    "landmarkName": "Arco Eólico das Armadas Solares",
    "tier": 3,
    "encounterKind": "throne_apex",
    "isEntryNode": false,
    "isThroneNode": true,
    "unlocksSubmaps": [
      "sky_bastions"
    ],
    "boss": {
      "id": "gc_gold_t3_boreal_skyway_07",
      "stage": 220,
      "name": "Heliokar, General da Roda Celeste",
      "title": "Soberano Supremo • Arco Eólico das Armadas Solares",
      "domains": [
        "gold",
        "red",
        "blue"
      ],
      "avatarCardId": "gold_173_general_roda_sol",
      "startingHp": 40,
      "passiveName": "Bastião da Alvorada",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 61,
      "rewardShards": 65,
      "rewardCardIds": [
        "gold_173_general_roda_sol",
        "gold_63_esfinge_dourada"
      ],
      "loreIntro": "No coração de Corredor Boreal das Nuvens & Correntes Dracônicas, Heliokar, General da Roda Celeste guarda o Arco Eólico das Armadas Solares com as relíquias e criaturas mais poderosas deste domínio.",
      "deckId": "tri_red_blue_gold",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "boreal_skyway",
      "landmarkName": "Arco Eólico das Armadas Solares",
      "encounterKind": "throne_apex",
      "archetypeId": "tri_red_blue_gold",
      "archetypeTitle": "Conclave da Chama Celeste"
    }
  },
  {
    "id": "gc_gold_t3_sky_bastions_01",
    "stage": 221,
    "submapId": "sky_bastions",
    "submapOrder": 1,
    "rx": 18.1,
    "ry": 33.3,
    "worldX": 88.5,
    "worldY": 58.5,
    "landmarkName": "Torre Alabastro",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": true,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_gold_t3_sky_bastions_01",
      "stage": 221,
      "name": "Arcanjo da Égide Dourada",
      "title": "Guardião de Fronteira • Torre Alabastro",
      "domains": [
        "gold"
      ],
      "avatarCardId": "gold_117_arcanjo_egide",
      "startingHp": 40,
      "passiveName": "Bastião da Alvorada",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "gold_117_arcanjo_egide",
        "gold_10_egide_radiante"
      ],
      "loreIntro": "Arcanjo da Égide Dourada mantém vigília soberana sobre Torre Alabastro (Bastilhas Celestes do Zênite), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_gold_phalanx",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "sky_bastions",
      "landmarkName": "Torre Alabastro",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_gold_phalanx",
      "archetypeTitle": "Falange Impenetrável"
    }
  },
  {
    "id": "gc_gold_t3_sky_bastions_01_b",
    "stage": 222,
    "submapId": "sky_bastions",
    "submapOrder": 2,
    "rx": 17,
    "ry": 28,
    "worldX": 88.5,
    "worldY": 58.5,
    "landmarkName": "Baluarte — Torre Alabastro",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_gold_t3_sky_bastions_01_b",
      "stage": 222,
      "name": "Colosso do Sol Invicto",
      "title": "Comandante Regional • Baluarte — Torre Alabastro",
      "domains": [
        "gold"
      ],
      "avatarCardId": "gold_118_colosso_sol_invicto",
      "startingHp": 40,
      "passiveName": "Bastião da Alvorada",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "gold_118_colosso_sol_invicto",
        "gold_48_decreto_imperial"
      ],
      "loreIntro": "Colosso do Sol Invicto lidera o posto avançado em Baluarte — Torre Alabastro (Bastilhas Celestes do Zênite). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_red_gold",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "sky_bastions",
      "landmarkName": "Baluarte — Torre Alabastro",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_red_gold",
      "archetypeTitle": "Falange Impenetrável"
    }
  },
  {
    "id": "gc_gold_t3_sky_bastions_02",
    "stage": 223,
    "submapId": "sky_bastions",
    "submapOrder": 3,
    "rx": 19,
    "ry": 17,
    "worldX": 88.5,
    "worldY": 58.5,
    "landmarkName": "Atalaia da Alvorada",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": true,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_gold_t3_sky_bastions_02",
      "stage": 223,
      "name": "General Angelical da Espada Solar",
      "title": "Guardião de Fronteira • Atalaia da Alvorada",
      "domains": [
        "gold",
        "neutral"
      ],
      "avatarCardId": "gold_155_arconte_lanca_solar",
      "startingHp": 40,
      "passiveName": "Bastião da Alvorada",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "gold_155_arconte_lanca_solar",
        "gold_88_forja_1877"
      ],
      "loreIntro": "General Angelical da Espada Solar mantém vigília soberana sobre Atalaia da Alvorada (Bastilhas Celestes do Zênite), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "dual_gold_neutral",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "sky_bastions",
      "landmarkName": "Atalaia da Alvorada",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_gold_neutral",
      "archetypeTitle": "Aliança do Bastião Relojoeiro"
    }
  },
  {
    "id": "gc_gold_t3_sky_bastions_02_b",
    "stage": 224,
    "submapId": "sky_bastions",
    "submapOrder": 4,
    "rx": 22.4,
    "ry": 23.3,
    "worldX": 88.5,
    "worldY": 58.5,
    "landmarkName": "Atalaia — Atalaia da Alvorada",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_gold_t3_sky_bastions_02_b",
      "stage": 224,
      "name": "Colosso da Cidadela Viva",
      "title": "Comandante Regional • Atalaia — Atalaia da Alvorada",
      "domains": [
        "gold",
        "neutral"
      ],
      "avatarCardId": "gold_137_colosso_cidadela_eterna",
      "startingHp": 40,
      "passiveName": "Bastião da Alvorada",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "gold_137_colosso_cidadela_eterna",
        "gold_113_valquiria_alvorada"
      ],
      "loreIntro": "Colosso da Cidadela Viva lidera o posto avançado em Atalaia — Atalaia da Alvorada (Bastilhas Celestes do Zênite). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_purple_gold",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "sky_bastions",
      "landmarkName": "Atalaia — Atalaia da Alvorada",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_purple_gold",
      "archetypeTitle": "Aliança do Bastião Relojoeiro"
    }
  },
  {
    "id": "gc_gold_t3_sky_bastions_03",
    "stage": 225,
    "submapId": "sky_bastions",
    "submapOrder": 5,
    "rx": 19,
    "ry": 49,
    "worldX": 88.5,
    "worldY": 58.5,
    "landmarkName": "Terraço dos Espelhos",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_gold_t3_sky_bastions_03",
      "stage": 225,
      "name": "Argentum, Sentinela Alabastro",
      "title": "Guardião de Fronteira • Terraço dos Espelhos",
      "domains": [
        "gold"
      ],
      "avatarCardId": "gold_23_dragao_prata",
      "startingHp": 40,
      "passiveName": "Bastião da Alvorada",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "gold_23_dragao_prata",
        "gold_139_consagracao_imperial"
      ],
      "loreIntro": "Argentum, Sentinela Alabastro mantém vigília soberana sobre Terraço dos Espelhos (Bastilhas Celestes do Zênite), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_gold_judgment",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "sky_bastions",
      "landmarkName": "Terraço dos Espelhos",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_gold_judgment",
      "archetypeTitle": "Julgamento Solar"
    }
  },
  {
    "id": "gc_gold_t3_sky_bastions_03_b",
    "stage": 226,
    "submapId": "sky_bastions",
    "submapOrder": 6,
    "rx": 27.8,
    "ry": 44.3,
    "worldX": 88.5,
    "worldY": 58.5,
    "landmarkName": "Reduto — Terraço dos Espelhos",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_gold_t3_sky_bastions_03_b",
      "stage": 226,
      "name": "Dragão Celestial de Platina e Ouro",
      "title": "Comandante Regional • Reduto — Terraço dos Espelhos",
      "domains": [
        "gold"
      ],
      "avatarCardId": "gold_136_dragao_platina_celeste",
      "startingHp": 40,
      "passiveName": "Bastião da Alvorada",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "gold_136_dragao_platina_celeste",
        "gold_49_colera_divina"
      ],
      "loreIntro": "Dragão Celestial de Platina e Ouro lidera o posto avançado em Reduto — Terraço dos Espelhos (Bastilhas Celestes do Zênite). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_purple_gold",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "sky_bastions",
      "landmarkName": "Reduto — Terraço dos Espelhos",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_purple_gold",
      "archetypeTitle": "Julgamento Solar"
    }
  },
  {
    "id": "gc_gold_t4_sky_bastions_04",
    "stage": 227,
    "submapId": "sky_bastions",
    "submapOrder": 7,
    "rx": 31,
    "ry": 25,
    "worldX": 88.5,
    "worldY": 58.5,
    "landmarkName": "Ponte de Alabastro",
    "tier": 4,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_gold_t4_sky_bastions_04",
      "stage": 227,
      "name": "Aeternus, O Primeiro Forjado de Guerra",
      "title": "Lorde Soberano • Ponte de Alabastro",
      "domains": [
        "gold",
        "blue"
      ],
      "avatarCardId": "gold_83_forjado_ancestral",
      "startingHp": 40,
      "passiveName": "Luz de Aethelgard",
      "passiveDescription": "Criaturas aliadas entram com +1 Armadura (+2 Afinidade Solar inicial).",
      "rewardGold": 48,
      "rewardShards": 50,
      "rewardCardIds": [
        "gold_83_forjado_ancestral",
        "gold_02_gargula"
      ],
      "loreIntro": "Aeternus, O Primeiro Forjado de Guerra mantém vigília soberana sobre Ponte de Alabastro em Bastilhas Celestes, vedando o avanço pelas rotas interiores.",
      "deckId": "dual_blue_gold",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "sky_bastions",
      "landmarkName": "Ponte de Alabastro",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "dual_blue_gold",
      "archetypeTitle": "Pacto da Forja do Zênite"
    }
  },
  {
    "id": "gc_gold_t4_sky_bastions_05",
    "stage": 228,
    "submapId": "sky_bastions",
    "submapOrder": 8,
    "rx": 40,
    "ry": 46,
    "worldX": 88.5,
    "worldY": 58.5,
    "landmarkName": "Arcos de Luz Dourada",
    "tier": 4,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_gold_t4_sky_bastions_05",
      "stage": 228,
      "name": "Caelestius, o Serafim de Seis Asas",
      "title": "Lorde Soberano • Arcos de Luz Dourada",
      "domains": [
        "gold",
        "green",
        "blue"
      ],
      "avatarCardId": "gold_46_arcanjo_supremo",
      "startingHp": 40,
      "passiveName": "Luz de Aethelgard",
      "passiveDescription": "Criaturas aliadas entram com +1 Armadura (+2 Afinidade Solar inicial).",
      "rewardGold": 48,
      "rewardShards": 50,
      "rewardCardIds": [
        "gold_46_arcanjo_supremo",
        "gold_56_lanceiro_falange"
      ],
      "loreIntro": "Caelestius, o Serafim de Seis Asas mantém vigília soberana sobre Arcos de Luz Dourada em Bastilhas Celestes, vedando o avanço pelas rotas interiores.",
      "deckId": "tri_blue_green_gold",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "sky_bastions",
      "landmarkName": "Arcos de Luz Dourada",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "tri_blue_green_gold",
      "archetypeTitle": "Escamas do Horizonte Eterno"
    }
  },
  {
    "id": "gc_gold_t4_sky_bastions_06",
    "stage": 229,
    "submapId": "sky_bastions",
    "submapOrder": 9,
    "rx": 75.7,
    "ry": 62.3,
    "worldX": 88.5,
    "worldY": 58.5,
    "landmarkName": "Farol das Nuvens",
    "tier": 4,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_gold_t4_sky_bastions_06",
      "stage": 229,
      "name": "Aurion-Sol, O Dragão Imperial do Zênite",
      "title": "Lorde Soberano • Farol das Nuvens",
      "domains": [
        "gold",
        "blue",
        "purple"
      ],
      "avatarCardId": "gold_100_dragao_imperial_ouro",
      "startingHp": 40,
      "passiveName": "Luz de Aethelgard",
      "passiveDescription": "Criaturas aliadas entram com +1 Armadura (+2 Afinidade Solar inicial).",
      "rewardGold": 48,
      "rewardShards": 50,
      "rewardCardIds": [
        "gold_100_dragao_imperial_ouro",
        "gold_102_formacao_falange"
      ],
      "loreIntro": "Aurion-Sol, O Dragão Imperial do Zênite mantém vigília soberana sobre Farol das Nuvens em Bastilhas Celestes, vedando o avanço pelas rotas interiores.",
      "deckId": "tri_blue_purple_gold",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "sky_bastions",
      "landmarkName": "Farol das Nuvens",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "tri_blue_purple_gold",
      "archetypeTitle": "Relicário do Trono Eterno"
    }
  },
  {
    "id": "gc_gold_t4_sky_bastions_07",
    "stage": 230,
    "submapId": "sky_bastions",
    "submapOrder": 10,
    "rx": 55,
    "ry": 34,
    "worldX": 88.5,
    "worldY": 58.5,
    "landmarkName": "Cidadela de Alabastro das Cascatas",
    "tier": 4,
    "encounterKind": "throne_apex",
    "isEntryNode": false,
    "isThroneNode": true,
    "unlocksSubmaps": [
      "capital_solaria"
    ],
    "boss": {
      "id": "gc_gold_t4_sky_bastions_07",
      "stage": 230,
      "name": "Justinian, Soberano da Ordem Eterna",
      "title": "Soberano Supremo • Cidadela de Alabastro das Cascatas",
      "domains": [
        "gold",
        "red",
        "blue"
      ],
      "avatarCardId": "gold_119_soberano_ordem_eterna",
      "startingHp": 40,
      "passiveName": "Luz de Aethelgard",
      "passiveDescription": "Criaturas aliadas entram com +1 Armadura (+2 Afinidade Solar inicial).",
      "rewardGold": 73,
      "rewardShards": 75,
      "rewardCardIds": [
        "gold_119_soberano_ordem_eterna",
        "gold_161_egide_reflexao_divina"
      ],
      "loreIntro": "No coração de Bastilhas Celestes do Zênite, Justinian, Soberano da Ordem Eterna guarda o Cidadela de Alabastro das Cascatas com as relíquias e criaturas mais poderosas deste domínio.",
      "deckId": "tri_red_blue_gold",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "sky_bastions",
      "landmarkName": "Cidadela de Alabastro das Cascatas",
      "encounterKind": "throne_apex",
      "archetypeId": "tri_red_blue_gold",
      "archetypeTitle": "Conclave da Chama Celeste"
    }
  },
  {
    "id": "gc_gold_t3_capital_solaria_01",
    "stage": 231,
    "submapId": "capital_solaria",
    "submapOrder": 1,
    "rx": 13,
    "ry": 81,
    "worldX": 86,
    "worldY": 31.5,
    "landmarkName": "Ponte de Alabastro",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": true,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_gold_t3_capital_solaria_01",
      "stage": 231,
      "name": "Esfinge Juíza do Templo Solar",
      "title": "Guardião de Fronteira • Ponte de Alabastro",
      "domains": [
        "gold"
      ],
      "avatarCardId": "gold_20_androesfinge",
      "startingHp": 40,
      "passiveName": "Bastião da Alvorada",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "gold_20_androesfinge",
        "gold_94_justicar_implacavel"
      ],
      "loreIntro": "Esfinge Juíza do Templo Solar mantém vigília soberana sobre Ponte de Alabastro (Bastião Dourado de Aethelgard), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_gold_phalanx",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "capital_solaria",
      "landmarkName": "Ponte de Alabastro",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_gold_phalanx",
      "archetypeTitle": "Falange Impenetrável"
    }
  },
  {
    "id": "gc_gold_t3_capital_solaria_01_b",
    "stage": 232,
    "submapId": "capital_solaria",
    "submapOrder": 2,
    "rx": 22.2,
    "ry": 81.1,
    "worldX": 86,
    "worldY": 31.5,
    "landmarkName": "Vanguarda — Ponte de Alabastro",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_gold_t3_capital_solaria_01_b",
      "stage": 232,
      "name": "Arcanjo Supremo das Seis Asas",
      "title": "Comandante Regional • Vanguarda — Ponte de Alabastro",
      "domains": [
        "gold"
      ],
      "avatarCardId": "gold_156_serafim_coroa_radiante",
      "startingHp": 40,
      "passiveName": "Bastião da Alvorada",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "gold_156_serafim_coroa_radiante",
        "gold_121_lanca_julgamento_solar"
      ],
      "loreIntro": "Arcanjo Supremo das Seis Asas lidera o posto avançado em Vanguarda — Ponte de Alabastro (Bastião Dourado de Aethelgard). Vença o duelo para prosseguir pela estrada.",
      "deckId": "mono_gold_judgment",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "capital_solaria",
      "landmarkName": "Vanguarda — Ponte de Alabastro",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_gold_judgment",
      "archetypeTitle": "Falange Impenetrável"
    }
  },
  {
    "id": "gc_gold_t3_capital_solaria_02",
    "stage": 233,
    "submapId": "capital_solaria",
    "submapOrder": 3,
    "rx": 31,
    "ry": 74,
    "worldX": 86,
    "worldY": 31.5,
    "landmarkName": "Aquedutos & Jardins em Cascata",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": true,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_gold_t3_capital_solaria_02",
      "stage": 233,
      "name": "Golem de Ferro Inexpugnável",
      "title": "Guarnição de Fronteira • Aquedutos & Jardins em Cascata",
      "domains": [
        "gold",
        "green"
      ],
      "avatarCardId": "gold_08_golem_ferro",
      "startingHp": 40,
      "passiveName": "Bastião da Alvorada",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "gold_08_golem_ferro",
        "gold_158_bencao_falange_invicta"
      ],
      "loreIntro": "Golem de Ferro Inexpugnável mantém vigília soberana sobre Aquedutos & Jardins em Cascata em Aethelgard, vedando o avanço pelas rotas interiores.",
      "deckId": "dual_green_gold",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "capital_solaria",
      "landmarkName": "Aquedutos & Jardins em Cascata",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_green_gold",
      "archetypeTitle": "Pacto da Aurora Silvestre"
    }
  },
  {
    "id": "gc_gold_t4_capital_solaria_03",
    "stage": 234,
    "submapId": "capital_solaria",
    "submapOrder": 4,
    "rx": 19,
    "ry": 65,
    "worldX": 86,
    "worldY": 31.5,
    "landmarkName": "Atalaia da Alvorada",
    "tier": 4,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_gold_t4_capital_solaria_03",
      "stage": 234,
      "name": "Hyperion, Deus-Imperador da Aurora",
      "title": "Lorde Soberano • Atalaia da Alvorada",
      "domains": [
        "gold"
      ],
      "avatarCardId": "gold_138_imperador_sol_supremo",
      "startingHp": 40,
      "passiveName": "Luz de Aethelgard",
      "passiveDescription": "Criaturas aliadas entram com +1 Armadura (+2 Afinidade Solar inicial).",
      "rewardGold": 48,
      "rewardShards": 50,
      "rewardCardIds": [
        "gold_138_imperador_sol_supremo",
        "gold_25_veredito_celestial"
      ],
      "loreIntro": "Hyperion, Deus-Imperador da Aurora mantém vigília soberana sobre Atalaia da Alvorada em Aethelgard, vedando o avanço pelas rotas interiores.",
      "deckId": "mono_gold_judgment",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "capital_solaria",
      "landmarkName": "Atalaia da Alvorada",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "mono_gold_judgment",
      "archetypeTitle": "Julgamento Solar"
    }
  },
  {
    "id": "gc_gold_t4_capital_solaria_04",
    "stage": 235,
    "submapId": "capital_solaria",
    "submapOrder": 5,
    "rx": 31,
    "ry": 57,
    "worldX": 86,
    "worldY": 31.5,
    "landmarkName": "Terraço dos Espelhos",
    "tier": 4,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_gold_t4_capital_solaria_04",
      "stage": 235,
      "name": "Zephaniel, Arcanjo Solar do Zênite",
      "title": "Lorde Soberano • Terraço dos Espelhos",
      "domains": [
        "gold",
        "blue"
      ],
      "avatarCardId": "gold_09_serafim_solar",
      "startingHp": 40,
      "passiveName": "Luz de Aethelgard",
      "passiveDescription": "Criaturas aliadas entram com +1 Armadura (+2 Afinidade Solar inicial).",
      "rewardGold": 48,
      "rewardShards": 50,
      "rewardCardIds": [
        "gold_09_serafim_solar",
        "gold_52_calice_graal"
      ],
      "loreIntro": "Zephaniel, Arcanjo Solar do Zênite mantém vigília soberana sobre Terraço dos Espelhos em Aethelgard, vedando o avanço pelas rotas interiores.",
      "deckId": "dual_blue_gold",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "capital_solaria",
      "landmarkName": "Terraço dos Espelhos",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "dual_blue_gold",
      "archetypeTitle": "Pacto da Forja do Zênite"
    }
  },
  {
    "id": "gc_gold_t4_capital_solaria_05",
    "stage": 236,
    "submapId": "capital_solaria",
    "submapOrder": 6,
    "rx": 19,
    "ry": 49,
    "worldX": 86,
    "worldY": 31.5,
    "landmarkName": "Passagem Radiante",
    "tier": 4,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_gold_t4_capital_solaria_05",
      "stage": 236,
      "name": "Titã Primogênito da Alvorada",
      "title": "Lorde Soberano • Passagem Radiante",
      "domains": [
        "gold",
        "green",
        "blue"
      ],
      "avatarCardId": "gold_24_tita_empirico",
      "startingHp": 40,
      "passiveName": "Luz de Aethelgard",
      "passiveDescription": "Criaturas aliadas entram com +1 Armadura (+2 Afinidade Solar inicial).",
      "rewardGold": 48,
      "rewardShards": 50,
      "rewardCardIds": [
        "gold_24_tita_empirico",
        "gold_95_cavaleiro_pegaso"
      ],
      "loreIntro": "Titã Primogênito da Alvorada mantém vigília soberana sobre Passagem Radiante em Aethelgard, vedando o avanço pelas rotas interiores.",
      "deckId": "tri_blue_green_gold",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "capital_solaria",
      "landmarkName": "Passagem Radiante",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "tri_blue_green_gold",
      "archetypeTitle": "Escamas do Horizonte Eterno"
    }
  },
  {
    "id": "gc_gold_t4_capital_solaria_06",
    "stage": 237,
    "submapId": "capital_solaria",
    "submapOrder": 7,
    "rx": 43,
    "ry": 65,
    "worldX": 86,
    "worldY": 31.5,
    "landmarkName": "Forte do Zênite",
    "tier": 4,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_gold_t4_capital_solaria_06",
      "stage": 237,
      "name": "Armada Dracônica do Zênite",
      "title": "Lorde Soberano • Forte do Zênite",
      "domains": [
        "gold",
        "blue",
        "purple"
      ],
      "avatarCardId": "gold_172_armada_draconica_sol",
      "startingHp": 40,
      "passiveName": "Luz de Aethelgard",
      "passiveDescription": "Criaturas aliadas entram com +1 Armadura (+2 Afinidade Solar inicial).",
      "rewardGold": 48,
      "rewardShards": 50,
      "rewardCardIds": [
        "gold_172_armada_draconica_sol",
        "gold_129_grifo_couracado_real"
      ],
      "loreIntro": "Armada Dracônica do Zênite mantém vigília soberana sobre Forte do Zênite em Aethelgard, vedando o avanço pelas rotas interiores.",
      "deckId": "tri_blue_purple_gold",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "capital_solaria",
      "landmarkName": "Forte do Zênite",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "tri_blue_purple_gold",
      "archetypeTitle": "Relicário do Trono Eterno"
    }
  },
  {
    "id": "gc_gold_t5_capital_solaria_07",
    "stage": 238,
    "submapId": "capital_solaria",
    "submapOrder": 8,
    "rx": 86,
    "ry": 38,
    "worldX": 86,
    "worldY": 31.5,
    "landmarkName": "Arcadas Suspensas da Frota Celeste",
    "tier": 5,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_gold_t5_capital_solaria_07",
      "stage": 238,
      "name": "Aurarius, Majestade do Sol",
      "title": "Lorde Soberano • Arcadas Suspensas da Frota Celeste",
      "domains": [
        "gold",
        "red",
        "blue"
      ],
      "avatarCardId": "gold_07_dragao_ouro",
      "startingHp": 40,
      "passiveName": "Trono da Cúpula Dourada",
      "passiveDescription": "+1 Essência inicial; tropas entram com Escudo Divino e restaura +2 PV em rodadas pares.",
      "rewardGold": 60,
      "rewardShards": 60,
      "rewardCardIds": [
        "gold_07_dragao_ouro",
        "gold_10_egide_radiante"
      ],
      "loreIntro": "Aurarius, Majestade do Sol mantém vigília soberana sobre Arcadas Suspensas da Frota Celeste em Aethelgard, vedando o avanço pelas rotas interiores.",
      "deckId": "tri_red_blue_gold",
      "customDeckCardIds": [],
      "difficultyTier": 5,
      "submapId": "capital_solaria",
      "landmarkName": "Arcadas Suspensas da Frota Celeste",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "tri_red_blue_gold",
      "archetypeTitle": "Conclave da Chama Celeste"
    }
  },
  {
    "id": "gc_gold_t5_capital_solaria_08",
    "stage": 239,
    "submapId": "capital_solaria",
    "submapOrder": 9,
    "rx": 50,
    "ry": 38,
    "worldX": 86,
    "worldY": 31.5,
    "landmarkName": "Trono da Cúpula Dourada de Aethelgard",
    "tier": 5,
    "encounterKind": "throne_apex",
    "isEntryNode": false,
    "isThroneNode": true,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_gold_t5_capital_solaria_08",
      "stage": 239,
      "name": "Aurelius, Soberano Dragão da Alvorada",
      "title": "Soberano Supremo • Trono da Cúpula Dourada de Aethelgard",
      "domains": [
        "gold"
      ],
      "avatarCardId": "gold_157_dragao_soberano_alvorada",
      "startingHp": 40,
      "passiveName": "Trono da Cúpula Dourada",
      "passiveDescription": "+1 Essência inicial; tropas entram com Escudo Divino e restaura +2 PV em rodadas pares.",
      "rewardGold": 85,
      "rewardShards": 85,
      "rewardCardIds": [
        "gold_157_dragao_soberano_alvorada",
        "gold_78_cavaleiro_ambrosia"
      ],
      "loreIntro": "No coração de Bastião Dourado de Aethelgard, Aurelius, Soberano Dragão da Alvorada guarda o Trono da Cúpula Dourada de Aethelgard com as relíquias e criaturas mais poderosas deste domínio.",
      "deckId": "mono_gold_celestial",
      "customDeckCardIds": [],
      "difficultyTier": 5,
      "submapId": "capital_solaria",
      "landmarkName": "Trono da Cúpula Dourada de Aethelgard",
      "encounterKind": "throne_apex",
      "archetypeId": "mono_gold_celestial",
      "archetypeTitle": "Legião Celeste"
    }
  },
  {
    "id": "gc_neutral_t2_matrix_01",
    "stage": 240,
    "submapId": "matrix",
    "submapOrder": 1,
    "rx": 13,
    "ry": 49,
    "worldX": 42,
    "worldY": 49,
    "landmarkName": "Ponte Cinzenta do Pacto",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": true,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_neutral_t2_matrix_01",
      "stage": 240,
      "name": "Emissário Real do Conselho",
      "title": "Guardião de Fronteira • Ponte Cinzenta do Pacto",
      "domains": [
        "neutral"
      ],
      "avatarCardId": "neutral_114_emissario_conselho_aguas",
      "startingHp": 40,
      "passiveName": "Ordem da Matriz",
      "passiveDescription": " Defensores juramentados do Anel Axial.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "neutral_114_emissario_conselho_aguas",
        "neutral_08_colosso_carne"
      ],
      "loreIntro": "Emissário Real do Conselho mantém vigília soberana sobre Ponte Cinzenta do Pacto (Fronteira Cinzenta — Centro Axial), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_neutral_axial",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "matrix",
      "landmarkName": "Ponte Cinzenta do Pacto",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_neutral_axial",
      "archetypeTitle": "Legião Axial Autômata"
    }
  },
  {
    "id": "gc_neutral_t2_matrix_01_b",
    "stage": 241,
    "submapId": "matrix",
    "submapOrder": 2,
    "rx": 17,
    "ry": 44.5,
    "worldX": 42,
    "worldY": 49,
    "landmarkName": "Reduto — Ponte Cinzenta do Pacto",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_neutral_t2_matrix_01_b",
      "stage": 241,
      "name": "Sentinela do Fragmento do Tempo",
      "title": "Comandante Regional • Reduto — Ponte Cinzenta do Pacto",
      "domains": [
        "neutral"
      ],
      "avatarCardId": "neutral_43_guardiao_fragmento",
      "startingHp": 40,
      "passiveName": "Ordem da Matriz",
      "passiveDescription": " Defensores juramentados do Anel Axial.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "neutral_43_guardiao_fragmento",
        "neutral_23_golem_argila"
      ],
      "loreIntro": "Sentinela do Fragmento do Tempo lidera o posto avançado em Reduto — Ponte Cinzenta do Pacto (Fronteira Cinzenta — Centro Axial). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_purple_neutral",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "matrix",
      "landmarkName": "Reduto — Ponte Cinzenta do Pacto",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_purple_neutral",
      "archetypeTitle": "Legião Axial Autômata"
    }
  },
  {
    "id": "gc_neutral_t2_matrix_02",
    "stage": 242,
    "submapId": "matrix",
    "submapOrder": 3,
    "rx": 17,
    "ry": 69.8,
    "worldX": 42,
    "worldY": 49,
    "landmarkName": "Estalagem das Caravanas",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": true,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_neutral_t2_matrix_02",
      "stage": 242,
      "name": "Tecelão do Feixe Primordial",
      "title": "Guardião de Fronteira • Estalagem das Caravanas",
      "domains": [
        "neutral"
      ],
      "avatarCardId": "neutral_168_tecelao_feixe_matriz",
      "startingHp": 40,
      "passiveName": "Ordem da Matriz",
      "passiveDescription": " Defensores juramentados do Anel Axial.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "neutral_168_tecelao_feixe_matriz",
        "neutral_46_pausar_pensar"
      ],
      "loreIntro": "Tecelão do Feixe Primordial mantém vigília soberana sobre Estalagem das Caravanas (Fronteira Cinzenta — Centro Axial), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_neutral_axial",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "matrix",
      "landmarkName": "Estalagem das Caravanas",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_neutral_axial",
      "archetypeTitle": "Legião Axial Autômata"
    }
  },
  {
    "id": "gc_neutral_t2_matrix_02_b",
    "stage": 243,
    "submapId": "matrix",
    "submapOrder": 4,
    "rx": 27.8,
    "ry": 63.4,
    "worldX": 42,
    "worldY": 49,
    "landmarkName": "Vanguarda — Estalagem das Caravanas",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_neutral_t2_matrix_02_b",
      "stage": 243,
      "name": "Corsário da Lâmina Prateada",
      "title": "Comandante Regional • Vanguarda — Estalagem das Caravanas",
      "domains": [
        "neutral"
      ],
      "avatarCardId": "neutral_05_corsario_astral",
      "startingHp": 40,
      "passiveName": "Ordem da Matriz",
      "passiveDescription": " Defensores juramentados do Anel Axial.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "neutral_05_corsario_astral",
        "neutral_149_contrato_companhia_dourada"
      ],
      "loreIntro": "Corsário da Lâmina Prateada lidera o posto avançado em Vanguarda — Estalagem das Caravanas (Fronteira Cinzenta — Centro Axial). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_red_neutral",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "matrix",
      "landmarkName": "Vanguarda — Estalagem das Caravanas",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_red_neutral",
      "archetypeTitle": "Legião Axial Autômata"
    }
  },
  {
    "id": "gc_neutral_t2_matrix_03",
    "stage": 244,
    "submapId": "matrix",
    "submapOrder": 5,
    "rx": 18.8,
    "ry": 19.4,
    "worldX": 42,
    "worldY": 49,
    "landmarkName": "Vigia do Prisma",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_neutral_t2_matrix_03",
      "stage": 244,
      "name": "Cavaleiro do Horizonte Estelar",
      "title": "Guardião de Fronteira • Vigia do Prisma",
      "domains": [
        "neutral"
      ],
      "avatarCardId": "neutral_34_cavaleiro_planar",
      "startingHp": 40,
      "passiveName": "Ordem da Matriz",
      "passiveDescription": " Defensores juramentados do Anel Axial.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "neutral_34_cavaleiro_planar",
        "neutral_165_quebra_feiticaria_runica"
      ],
      "loreIntro": "Cavaleiro do Horizonte Estelar mantém vigília soberana sobre Vigia do Prisma (Fronteira Cinzenta — Centro Axial), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_neutral_axial",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "matrix",
      "landmarkName": "Vigia do Prisma",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_neutral_axial",
      "archetypeTitle": "Legião Axial Autômata"
    }
  },
  {
    "id": "gc_neutral_t2_matrix_03_b",
    "stage": 245,
    "submapId": "matrix",
    "submapOrder": 6,
    "rx": 33.8,
    "ry": 21.8,
    "worldX": 42,
    "worldY": 49,
    "landmarkName": "Baluarte — Vigia do Prisma",
    "tier": 2,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_neutral_t2_matrix_03_b",
      "stage": 245,
      "name": "Mestre da Lâmina Cantante",
      "title": "Comandante Regional • Baluarte — Vigia do Prisma",
      "domains": [
        "neutral"
      ],
      "avatarCardId": "neutral_103_lamina_cantante_cinza",
      "startingHp": 40,
      "passiveName": "Ordem da Matriz",
      "passiveDescription": " Defensores juramentados do Anel Axial.",
      "rewardGold": 24,
      "rewardShards": 20,
      "rewardCardIds": [
        "neutral_103_lamina_cantante_cinza",
        "neutral_57_orbe_dominacao"
      ],
      "loreIntro": "Mestre da Lâmina Cantante lidera o posto avançado em Baluarte — Vigia do Prisma (Fronteira Cinzenta — Centro Axial). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_blue_neutral",
      "customDeckCardIds": [],
      "difficultyTier": 2,
      "submapId": "matrix",
      "landmarkName": "Baluarte — Vigia do Prisma",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_blue_neutral",
      "archetypeTitle": "Legião Axial Autômata"
    }
  },
  {
    "id": "gc_neutral_t3_matrix_04",
    "stage": 246,
    "submapId": "matrix",
    "submapOrder": 7,
    "rx": 36,
    "ry": 50,
    "worldX": 42,
    "worldY": 49,
    "landmarkName": "Entreposto das Caravanas Neutras",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_neutral_t3_matrix_04",
      "stage": 246,
      "name": "Reen, Ceifador de Engrenagens",
      "title": "Guardião de Fronteira • Entreposto das Caravanas Neutras",
      "domains": [
        "neutral",
        "green"
      ],
      "avatarCardId": "neutral_106_reen_assassino_relojoeiro",
      "startingHp": 40,
      "passiveName": "Escudo Convergente",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "neutral_106_reen_assassino_relojoeiro",
        "neutral_139_amuleto_planos_astrolabio"
      ],
      "loreIntro": "Reen, Ceifador de Engrenagens mantém vigília soberana sobre Entreposto das Caravanas Neutras (Fronteira Cinzenta — Centro Axial), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "dual_green_neutral",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "matrix",
      "landmarkName": "Entreposto das Caravanas Neutras",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_green_neutral",
      "archetypeTitle": "Aliança dos Engenhos Silvestres"
    }
  },
  {
    "id": "gc_neutral_t3_matrix_04_b",
    "stage": 247,
    "submapId": "matrix",
    "submapOrder": 8,
    "rx": 42.2,
    "ry": 46.6,
    "worldX": 42,
    "worldY": 49,
    "landmarkName": "Reduto — Entreposto das Caravanas Neutras",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_neutral_t3_matrix_04_b",
      "stage": 247,
      "name": "Caranguejo-Bastião das Rochas",
      "title": "Comandante Regional • Reduto — Entreposto das Caravanas Neutras",
      "domains": [
        "neutral",
        "green"
      ],
      "avatarCardId": "neutral_112_caranguejo_colossal_costa",
      "startingHp": 40,
      "passiveName": "Escudo Convergente",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "neutral_112_caranguejo_colossal_costa",
        "neutral_109_aranha_pedra_steeder"
      ],
      "loreIntro": "Caranguejo-Bastião das Rochas lidera o posto avançado em Reduto — Entreposto das Caravanas Neutras (Fronteira Cinzenta — Centro Axial). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_purple_neutral",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "matrix",
      "landmarkName": "Reduto — Entreposto das Caravanas Neutras",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_purple_neutral",
      "archetypeTitle": "Aliança dos Engenhos Silvestres"
    }
  },
  {
    "id": "gc_neutral_t3_matrix_05",
    "stage": 248,
    "submapId": "matrix",
    "submapOrder": 9,
    "rx": 50,
    "ry": 68,
    "worldX": 42,
    "worldY": 49,
    "landmarkName": "Coliseu Externo dos Selos",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_neutral_t3_matrix_05",
      "stage": 248,
      "name": "Caracol-Mangual de Casco Prismático",
      "title": "Guardião de Fronteira • Coliseu Externo dos Selos",
      "domains": [
        "neutral",
        "red"
      ],
      "avatarCardId": "neutral_97_caracol_mangual_prisma",
      "startingHp": 40,
      "passiveName": "Escudo Convergente",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "neutral_97_caracol_mangual_prisma",
        "neutral_138_anel_ariete_forca"
      ],
      "loreIntro": "Caracol-Mangual de Casco Prismático mantém vigília soberana sobre Coliseu Externo dos Selos (Fronteira Cinzenta — Centro Axial), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "dual_red_neutral",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "matrix",
      "landmarkName": "Coliseu Externo dos Selos",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_red_neutral",
      "archetypeTitle": "Aliança da Artilharia de Mercúrio"
    }
  },
  {
    "id": "gc_neutral_t3_matrix_05_b",
    "stage": 249,
    "submapId": "matrix",
    "submapOrder": 10,
    "rx": 53.4,
    "ry": 60.1,
    "worldX": 42,
    "worldY": 49,
    "landmarkName": "Atalaia — Coliseu Externo dos Selos",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_neutral_t3_matrix_05_b",
      "stage": 249,
      "name": "Devorador Mutante do Limbo",
      "title": "Comandante Regional • Atalaia — Coliseu Externo dos Selos",
      "domains": [
        "neutral",
        "red"
      ],
      "avatarCardId": "neutral_07_mutante_caos",
      "startingHp": 40,
      "passiveName": "Escudo Convergente",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "neutral_07_mutante_caos",
        "neutral_149_contrato_companhia_dourada"
      ],
      "loreIntro": "Devorador Mutante do Limbo lidera o posto avançado em Atalaia — Coliseu Externo dos Selos (Fronteira Cinzenta — Centro Axial). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_purple_neutral",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "matrix",
      "landmarkName": "Atalaia — Coliseu Externo dos Selos",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_purple_neutral",
      "archetypeTitle": "Aliança da Artilharia de Mercúrio"
    }
  },
  {
    "id": "gc_neutral_t3_matrix_06",
    "stage": 250,
    "submapId": "matrix",
    "submapOrder": 11,
    "rx": 50,
    "ry": 32,
    "worldX": 42,
    "worldY": 49,
    "landmarkName": "Encruzilhada das Cinco Linhas de Ley",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_neutral_t3_matrix_06",
      "stage": 250,
      "name": "Pactuário do Éter Primordial",
      "title": "Guardião de Fronteira • Encruzilhada das Cinco Linhas de Ley",
      "domains": [
        "neutral",
        "blue"
      ],
      "avatarCardId": "neutral_171_pactuario_elemental_matriz",
      "startingHp": 40,
      "passiveName": "Escudo Convergente",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "neutral_171_pactuario_elemental_matriz",
        "neutral_125_estandarte_runa_krig"
      ],
      "loreIntro": "Pactuário do Éter Primordial mantém vigília soberana sobre Encruzilhada das Cinco Linhas de Ley (Fronteira Cinzenta — Centro Axial), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "dual_blue_neutral",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "matrix",
      "landmarkName": "Encruzilhada das Cinco Linhas de Ley",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_blue_neutral",
      "archetypeTitle": "Aliança do Astrolábio Arcano"
    }
  },
  {
    "id": "gc_neutral_t3_matrix_06_b",
    "stage": 251,
    "submapId": "matrix",
    "submapOrder": 12,
    "rx": 62,
    "ry": 32.3,
    "worldX": 42,
    "worldY": 49,
    "landmarkName": "Baluarte — Encruzilhada das Cinco Linhas de Ley",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_neutral_t3_matrix_06_b",
      "stage": 251,
      "name": "Espectro Abissal Colecionador de Relíquias",
      "title": "Comandante Regional • Baluarte — Encruzilhada das Cinco Linhas de Ley",
      "domains": [
        "neutral",
        "blue"
      ],
      "avatarCardId": "neutral_100_morkoth_ilha_errante",
      "startingHp": 40,
      "passiveName": "Escudo Convergente",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "neutral_100_morkoth_ilha_errante",
        "neutral_94_arqueiro_zenite"
      ],
      "loreIntro": "Espectro Abissal Colecionador de Relíquias lidera o posto avançado em Baluarte — Encruzilhada das Cinco Linhas de Ley (Fronteira Cinzenta — Centro Axial). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_gold_neutral",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "matrix",
      "landmarkName": "Baluarte — Encruzilhada das Cinco Linhas de Ley",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_gold_neutral",
      "archetypeTitle": "Aliança do Astrolábio Arcano"
    }
  },
  {
    "id": "gc_neutral_t3_matrix_07",
    "stage": 252,
    "submapId": "matrix",
    "submapOrder": 13,
    "rx": 75,
    "ry": 40,
    "worldX": 42,
    "worldY": 49,
    "landmarkName": "Atalaia Oriental de Granito",
    "tier": 3,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_neutral_t3_matrix_07",
      "stage": 252,
      "name": "Aldous, Grande Cronista do Bestiário",
      "title": "Lorde Soberano • Atalaia Oriental de Granito",
      "domains": [
        "neutral",
        "gold"
      ],
      "avatarCardId": "neutral_118_volothamp_cronista_mundos",
      "startingHp": 40,
      "passiveName": "Escudo Convergente",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 36,
      "rewardShards": 40,
      "rewardCardIds": [
        "neutral_118_volothamp_cronista_mundos",
        "neutral_162_bomba_fumaca_alquimica"
      ],
      "loreIntro": "Aldous, Grande Cronista do Bestiário mantém vigília soberana sobre Atalaia Oriental de Granito em Centro Axial, vedando o avanço pelas rotas interiores.",
      "deckId": "dual_gold_neutral",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "matrix",
      "landmarkName": "Atalaia Oriental de Granito",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "dual_gold_neutral",
      "archetypeTitle": "Aliança do Bastião Relojoeiro"
    }
  },
  {
    "id": "gc_neutral_t4_matrix_08",
    "stage": 253,
    "submapId": "matrix",
    "submapOrder": 14,
    "rx": 80.2,
    "ry": 19.4,
    "worldX": 42,
    "worldY": 49,
    "landmarkName": "Torre Refratora",
    "tier": 4,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_neutral_t4_matrix_08",
      "stage": 253,
      "name": "Draco Horológico de Aeternus",
      "title": "Lorde Soberano • Torre Refratora",
      "domains": [
        "red",
        "blue",
        "purple",
        "green",
        "gold"
      ],
      "avatarCardId": "neutral_44_dragao_relogio",
      "startingHp": 40,
      "passiveName": "Ressonância dos Cinco Selos",
      "passiveDescription": "+1 Armadura nas criaturas e +2 Afinidade inicial nos cinco domínios.",
      "rewardGold": 48,
      "rewardShards": 50,
      "rewardCardIds": [
        "neutral_44_dragao_relogio",
        "blue_10_portal_runas"
      ],
      "loreIntro": "Draco Horológico de Aeternus mantém vigília soberana sobre Torre Refratora em Centro Axial, vedando o avanço pelas rotas interiores.",
      "deckId": "penta_prismatic_crater",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "matrix",
      "landmarkName": "Torre Refratora",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "penta_prismatic_crater",
      "archetypeTitle": "Soberania da Cratera Prismática"
    }
  },
  {
    "id": "gc_neutral_t4_matrix_09",
    "stage": 254,
    "submapId": "matrix",
    "submapOrder": 15,
    "rx": 84,
    "ry": 73,
    "worldX": 42,
    "worldY": 49,
    "landmarkName": "Tribunal Oriental das Rodas",
    "tier": 4,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_neutral_t4_matrix_09",
      "stage": 254,
      "name": "Malphas, O Tecelão do Ritual Abissal",
      "title": "Lorde Soberano • Tribunal Oriental das Rodas",
      "domains": [
        "blue",
        "gold",
        "purple",
        "red",
        "green"
      ],
      "avatarCardId": "neutral_121_vizeran_arquimago_exilado",
      "startingHp": 40,
      "passiveName": "Ressonância dos Cinco Selos",
      "passiveDescription": "+1 Armadura nas criaturas e +2 Afinidade inicial nos cinco domínios.",
      "rewardGold": 48,
      "rewardShards": 50,
      "rewardCardIds": [
        "neutral_121_vizeran_arquimago_exilado",
        "blue_35_cetro_inverno"
      ],
      "loreIntro": "Malphas, O Tecelão do Ritual Abissal mantém vigília soberana sobre Tribunal Oriental das Rodas em Centro Axial, vedando o avanço pelas rotas interiores.",
      "deckId": "penta_wheel_convergence",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "matrix",
      "landmarkName": "Tribunal Oriental das Rodas",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "penta_wheel_convergence",
      "archetypeTitle": "Convergência da Roda Horológica"
    }
  },
  {
    "id": "gc_neutral_t4_matrix_10",
    "stage": 255,
    "submapId": "matrix",
    "submapOrder": 16,
    "rx": 50,
    "ry": 50,
    "worldX": 42,
    "worldY": 49,
    "landmarkName": "Anel Externo da Fronteira Cinzenta",
    "tier": 4,
    "encounterKind": "throne_apex",
    "isEntryNode": false,
    "isThroneNode": true,
    "unlocksSubmaps": [
      "prismatic_crater"
    ],
    "boss": {
      "id": "gc_neutral_t4_matrix_10",
      "stage": 255,
      "name": "Titã Forjado em Adamantina",
      "title": "Soberano Supremo • Anel Externo da Fronteira Cinzenta",
      "domains": [
        "blue",
        "gold",
        "purple",
        "red",
        "green"
      ],
      "avatarCardId": "neutral_35_colosso_adamantina",
      "startingHp": 40,
      "passiveName": "Ressonância dos Cinco Selos",
      "passiveDescription": "+1 Armadura nas criaturas e +2 Afinidade inicial nos cinco domínios.",
      "rewardGold": 73,
      "rewardShards": 75,
      "rewardCardIds": [
        "neutral_35_colosso_adamantina",
        "purple_36_trono_ossos"
      ],
      "loreIntro": "No coração de Fronteira Cinzenta — Centro Axial, Titã Forjado em Adamantina guarda o Anel Externo da Fronteira Cinzenta com as relíquias e criaturas mais poderosas deste domínio.",
      "deckId": "penta_wheel_convergence",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "matrix",
      "landmarkName": "Anel Externo da Fronteira Cinzenta",
      "encounterKind": "throne_apex",
      "archetypeId": "penta_wheel_convergence",
      "archetypeTitle": "Convergência da Roda Horológica"
    }
  },
  {
    "id": "gc_neutral_t3_prismatic_crater_01",
    "stage": 256,
    "submapId": "prismatic_crater",
    "submapOrder": 1,
    "rx": 49,
    "ry": 17,
    "worldX": 50,
    "worldY": 61,
    "landmarkName": "Ponte Cinzenta do Pacto",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": true,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_neutral_t3_prismatic_crater_01",
      "stage": 256,
      "name": "Presságio da Revoada Primordial",
      "title": "Guardião de Fronteira • Ponte Cinzenta do Pacto",
      "domains": [
        "neutral"
      ],
      "avatarCardId": "neutral_169_pressagio_revoada_matriz",
      "startingHp": 40,
      "passiveName": "Escudo Convergente",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "neutral_169_pressagio_revoada_matriz",
        "neutral_133_escudo_sentinela_olho"
      ],
      "loreIntro": "Presságio da Revoada Primordial mantém vigília soberana sobre Ponte Cinzenta do Pacto (Cratera da Fratura Prismática), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "mono_neutral_axial",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "prismatic_crater",
      "landmarkName": "Ponte Cinzenta do Pacto",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_neutral_axial",
      "archetypeTitle": "Legião Axial Autômata"
    }
  },
  {
    "id": "gc_neutral_t3_prismatic_crater_01_b",
    "stage": 257,
    "submapId": "prismatic_crater",
    "submapOrder": 2,
    "rx": 52.8,
    "ry": 20.9,
    "worldX": 50,
    "worldY": 61,
    "landmarkName": "Baluarte — Ponte Cinzenta do Pacto",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_neutral_t3_prismatic_crater_01_b",
      "stage": 257,
      "name": "Grão-Ofídio de Sangue Frio",
      "title": "Comandante Regional • Baluarte — Ponte Cinzenta do Pacto",
      "domains": [
        "neutral"
      ],
      "avatarCardId": "neutral_06_cultista_ofidio",
      "startingHp": 40,
      "passiveName": "Escudo Convergente",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "neutral_06_cultista_ofidio",
        "neutral_132_espada_vingadora_runica"
      ],
      "loreIntro": "Grão-Ofídio de Sangue Frio lidera o posto avançado em Baluarte — Ponte Cinzenta do Pacto (Cratera da Fratura Prismática). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_purple_neutral",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "prismatic_crater",
      "landmarkName": "Baluarte — Ponte Cinzenta do Pacto",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_purple_neutral",
      "archetypeTitle": "Legião Axial Autômata"
    }
  },
  {
    "id": "gc_neutral_t3_prismatic_crater_02",
    "stage": 258,
    "submapId": "prismatic_crater",
    "submapOrder": 3,
    "rx": 61,
    "ry": 25,
    "worldX": 50,
    "worldY": 61,
    "landmarkName": "Guarita dos Cinco Selos",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": true,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_neutral_t3_prismatic_crater_02",
      "stage": 258,
      "name": "Marechal Mercenário da Fronteira",
      "title": "Guardião de Fronteira • Guarita dos Cinco Selos",
      "domains": [
        "neutral",
        "purple"
      ],
      "avatarCardId": "neutral_92_senhor_guerra_fronteira",
      "startingHp": 40,
      "passiveName": "Escudo Convergente",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "neutral_92_senhor_guerra_fronteira",
        "neutral_102_cavaleiro_dragao_purpura"
      ],
      "loreIntro": "Marechal Mercenário da Fronteira mantém vigília soberana sobre Guarita dos Cinco Selos (Cratera da Fratura Prismática), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "dual_purple_neutral",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "prismatic_crater",
      "landmarkName": "Guarita dos Cinco Selos",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_purple_neutral",
      "archetypeTitle": "Aliança da Guilda das Máscaras"
    }
  },
  {
    "id": "gc_neutral_t3_prismatic_crater_02_b",
    "stage": 259,
    "submapId": "prismatic_crater",
    "submapOrder": 4,
    "rx": 56.5,
    "ry": 31.7,
    "worldX": 50,
    "worldY": 61,
    "landmarkName": "Atalaia — Guarita dos Cinco Selos",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_neutral_t3_prismatic_crater_02_b",
      "stage": 259,
      "name": "Colosso de Vidro Prismático",
      "title": "Comandante Regional • Atalaia — Guarita dos Cinco Selos",
      "domains": [
        "neutral",
        "purple"
      ],
      "avatarCardId": "neutral_53_colosso_prismantico",
      "startingHp": 40,
      "passiveName": "Escudo Convergente",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "neutral_53_colosso_prismantico",
        "neutral_137_botas_velocidade_mercurio"
      ],
      "loreIntro": "Colosso de Vidro Prismático lidera o posto avançado em Atalaia — Guarita dos Cinco Selos (Cratera da Fratura Prismática). Vença o duelo para prosseguir pela estrada.",
      "deckId": "mono_neutral_axial",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "prismatic_crater",
      "landmarkName": "Atalaia — Guarita dos Cinco Selos",
      "encounterKind": "rare_garrison",
      "archetypeId": "mono_neutral_axial",
      "archetypeTitle": "Aliança da Guilda das Máscaras"
    }
  },
  {
    "id": "gc_neutral_t3_prismatic_crater_03",
    "stage": 260,
    "submapId": "prismatic_crater",
    "submapOrder": 5,
    "rx": 37,
    "ry": 25,
    "worldX": 50,
    "worldY": 61,
    "landmarkName": "Monólito da Trégua",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_neutral_t3_prismatic_crater_03",
      "stage": 260,
      "name": "Juggernaut de Caldeira e Bronze",
      "title": "Guardião de Fronteira • Monólito da Trégua",
      "domains": [
        "neutral",
        "gold"
      ],
      "avatarCardId": "neutral_107_colosso_forja_vapor",
      "startingHp": 40,
      "passiveName": "Escudo Convergente",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "neutral_107_colosso_forja_vapor",
        "neutral_139_amuleto_planos_astrolabio"
      ],
      "loreIntro": "Juggernaut de Caldeira e Bronze mantém vigília soberana sobre Monólito da Trégua (Cratera da Fratura Prismática), vedando a passagem pelas estradas desta fronteira.",
      "deckId": "dual_gold_neutral",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "prismatic_crater",
      "landmarkName": "Monólito da Trégua",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_gold_neutral",
      "archetypeTitle": "Aliança do Bastião Relojoeiro"
    }
  },
  {
    "id": "gc_neutral_t3_prismatic_crater_03_b",
    "stage": 261,
    "submapId": "prismatic_crater",
    "submapOrder": 6,
    "rx": 32.3,
    "ry": 32.2,
    "worldX": 50,
    "worldY": 61,
    "landmarkName": "Reduto — Monólito da Trégua",
    "tier": 3,
    "encounterKind": "rare_garrison",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_neutral_t3_prismatic_crater_03_b",
      "stage": 261,
      "name": "Gigante Entalhador de Monólitos",
      "title": "Comandante Regional • Reduto — Monólito da Trégua",
      "domains": [
        "neutral",
        "gold"
      ],
      "avatarCardId": "neutral_113_gigante_pedra_entalhador",
      "startingHp": 40,
      "passiveName": "Escudo Convergente",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 36,
      "rewardShards": 30,
      "rewardCardIds": [
        "neutral_113_gigante_pedra_entalhador",
        "neutral_96_conjurador_circulo_neutro"
      ],
      "loreIntro": "Gigante Entalhador de Monólitos lidera o posto avançado em Reduto — Monólito da Trégua (Cratera da Fratura Prismática). Vença o duelo para prosseguir pela estrada.",
      "deckId": "dual_red_neutral",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "prismatic_crater",
      "landmarkName": "Reduto — Monólito da Trégua",
      "encounterKind": "rare_garrison",
      "archetypeId": "dual_red_neutral",
      "archetypeTitle": "Aliança do Bastião Relojoeiro"
    }
  },
  {
    "id": "gc_neutral_t3_prismatic_crater_04",
    "stage": 262,
    "submapId": "prismatic_crater",
    "submapOrder": 7,
    "rx": 49,
    "ry": 33,
    "worldX": 50,
    "worldY": 61,
    "landmarkName": "Bastião Axial",
    "tier": 3,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_neutral_t3_prismatic_crater_04",
      "stage": 262,
      "name": "Valerius, Arquimago dos Sete Selos",
      "title": "Lorde Soberano • Bastião Axial",
      "domains": [
        "neutral"
      ],
      "avatarCardId": "neutral_117_elminster_sabio_cinzento",
      "startingHp": 40,
      "passiveName": "Escudo Convergente",
      "passiveDescription": "Criaturas invocadas por este Soberano recebem +1 Armadura.",
      "rewardGold": 36,
      "rewardShards": 40,
      "rewardCardIds": [
        "neutral_117_elminster_sabio_cinzento",
        "gold_03_mimico"
      ],
      "loreIntro": "Valerius, Arquimago dos Sete Selos mantém vigília soberana sobre Bastião Axial em Cratera Prismática, vedando o avanço pelas rotas interiores.",
      "deckId": "mono_neutral_axial",
      "customDeckCardIds": [],
      "difficultyTier": 3,
      "submapId": "prismatic_crater",
      "landmarkName": "Bastião Axial",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "mono_neutral_axial",
      "archetypeTitle": "Legião Axial Autômata"
    }
  },
  {
    "id": "gc_neutral_t4_prismatic_crater_05",
    "stage": 263,
    "submapId": "prismatic_crater",
    "submapOrder": 8,
    "rx": 22,
    "ry": 35,
    "worldX": 50,
    "worldY": 61,
    "landmarkName": "Falha de Ley Ocidental",
    "tier": 4,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_neutral_t4_prismatic_crater_05",
      "stage": 263,
      "name": "Matriz do Prisma Primordial",
      "title": "Lorde Soberano • Falha de Ley Ocidental",
      "domains": [
        "blue",
        "red",
        "purple"
      ],
      "avatarCardId": "neutral_167_arauto_prisma_matriz",
      "startingHp": 40,
      "passiveName": "Ressonância dos Cinco Selos",
      "passiveDescription": "+1 Armadura nas criaturas e +2 Afinidade inicial nos cinco domínios.",
      "rewardGold": 48,
      "rewardShards": 50,
      "rewardCardIds": [
        "neutral_167_arauto_prisma_matriz",
        "gold_32_estandarte_imperial"
      ],
      "loreIntro": "Matriz do Prisma Primordial mantém vigília soberana sobre Falha de Ley Ocidental em Cratera Prismática, vedando o avanço pelas rotas interiores.",
      "deckId": "tri_red_blue_purple",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "prismatic_crater",
      "landmarkName": "Falha de Ley Ocidental",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "tri_red_blue_purple",
      "archetypeTitle": "Cataclismo da Convergência Astral"
    }
  },
  {
    "id": "gc_neutral_t4_prismatic_crater_06",
    "stage": 264,
    "submapId": "prismatic_crater",
    "submapOrder": 9,
    "rx": 76.1,
    "ry": 36.5,
    "worldX": 50,
    "worldY": 61,
    "landmarkName": "Altar dos Raios",
    "tier": 4,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_neutral_t4_prismatic_crater_06",
      "stage": 264,
      "name": "Skrym-Khor, O Gigante Quebra-Tronos",
      "title": "Lorde Soberano • Altar dos Raios",
      "domains": [
        "gold",
        "red",
        "purple"
      ],
      "avatarCardId": "neutral_116_harshnag_machado_inverno",
      "startingHp": 40,
      "passiveName": "Ressonância dos Cinco Selos",
      "passiveDescription": "+1 Armadura nas criaturas e +2 Afinidade inicial nos cinco domínios.",
      "rewardGold": 48,
      "rewardShards": 50,
      "rewardCardIds": [
        "neutral_116_harshnag_machado_inverno",
        "red_50_forjar_no_sangue"
      ],
      "loreIntro": "Skrym-Khor, O Gigante Quebra-Tronos mantém vigília soberana sobre Altar dos Raios em Cratera Prismática, vedando o avanço pelas rotas interiores.",
      "deckId": "tri_red_purple_gold",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "prismatic_crater",
      "landmarkName": "Altar dos Raios",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "tri_red_purple_gold",
      "archetypeTitle": "Eclipse do Sol Carmesim"
    }
  },
  {
    "id": "gc_neutral_t4_prismatic_crater_07",
    "stage": 265,
    "submapId": "prismatic_crater",
    "submapOrder": 10,
    "rx": 13,
    "ry": 49,
    "worldX": 50,
    "worldY": 61,
    "landmarkName": "Passarela Ocidental de Ley Safira",
    "tier": 4,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_neutral_t4_prismatic_crater_07",
      "stage": 265,
      "name": "Aetherion, O Dragão do Vácuo Astral",
      "title": "Lorde Soberano • Passarela Ocidental de Ley Safira",
      "domains": [
        "gold",
        "green",
        "blue"
      ],
      "avatarCardId": "neutral_54_dragao_etereo",
      "startingHp": 40,
      "passiveName": "Ressonância dos Cinco Selos",
      "passiveDescription": "+1 Armadura nas criaturas e +2 Afinidade inicial nos cinco domínios.",
      "rewardGold": 48,
      "rewardShards": 50,
      "rewardCardIds": [
        "neutral_54_dragao_etereo",
        "green_40_licantropo_alfa"
      ],
      "loreIntro": "Aetherion, O Dragão do Vácuo Astral mantém vigília soberana sobre Passarela Ocidental de Ley Safira em Cratera Prismática, vedando o avanço pelas rotas interiores.",
      "deckId": "tri_blue_green_gold",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "prismatic_crater",
      "landmarkName": "Passarela Ocidental de Ley Safira",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "tri_blue_green_gold",
      "archetypeTitle": "Escamas do Horizonte Eterno"
    }
  },
  {
    "id": "gc_neutral_t4_prismatic_crater_08",
    "stage": 266,
    "submapId": "prismatic_crater",
    "submapOrder": 11,
    "rx": 87,
    "ry": 49,
    "worldX": 50,
    "worldY": 61,
    "landmarkName": "Passarela Oriental de Ley Solar",
    "tier": 4,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_neutral_t4_prismatic_crater_08",
      "stage": 266,
      "name": "Astrolon, Dragão do Vácuo Estelar",
      "title": "Lorde Soberano • Passarela Oriental de Ley Solar",
      "domains": [
        "blue",
        "gold",
        "purple",
        "red",
        "green"
      ],
      "avatarCardId": "neutral_24_dragao_astral",
      "startingHp": 40,
      "passiveName": "Ressonância dos Cinco Selos",
      "passiveDescription": "+1 Armadura nas criaturas e +2 Afinidade inicial nos cinco domínios.",
      "rewardGold": 48,
      "rewardShards": 50,
      "rewardCardIds": [
        "neutral_24_dragao_astral",
        "neutral_27_elmo_telepatia"
      ],
      "loreIntro": "Astrolon, Dragão do Vácuo Estelar mantém vigília soberana sobre Passarela Oriental de Ley Solar em Cratera Prismática, vedando o avanço pelas rotas interiores.",
      "deckId": "penta_wheel_convergence",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "prismatic_crater",
      "landmarkName": "Passarela Oriental de Ley Solar",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "penta_wheel_convergence",
      "archetypeTitle": "Convergência da Roda Horológica"
    }
  },
  {
    "id": "gc_neutral_t4_prismatic_crater_09",
    "stage": 267,
    "submapId": "prismatic_crater",
    "submapOrder": 12,
    "rx": 50,
    "ry": 55,
    "worldX": 50,
    "worldY": 61,
    "landmarkName": "Núcleo Partido da Cratera Prismática",
    "tier": 4,
    "encounterKind": "throne_apex",
    "isEntryNode": false,
    "isThroneNode": true,
    "unlocksSubmaps": [
      "capital_axial"
    ],
    "boss": {
      "id": "gc_neutral_t4_prismatic_crater_09",
      "stage": 267,
      "name": "Oculus-Vex, O Olho Mecânico do Submundo",
      "title": "Soberano Supremo • Núcleo Partido da Cratera Prismática",
      "domains": [
        "red",
        "blue",
        "purple",
        "green",
        "gold"
      ],
      "avatarCardId": "neutral_120_xanathar_senhor_crime",
      "startingHp": 40,
      "passiveName": "Ressonância dos Cinco Selos",
      "passiveDescription": "+1 Armadura nas criaturas e +2 Afinidade inicial nos cinco domínios.",
      "rewardGold": 73,
      "rewardShards": 75,
      "rewardCardIds": [
        "neutral_120_xanathar_senhor_crime",
        "blue_70_refletir_feitico"
      ],
      "loreIntro": "No coração de Cratera da Fratura Prismática, Oculus-Vex, O Olho Mecânico do Submundo guarda o Núcleo Partido da Cratera Prismática com as relíquias e criaturas mais poderosas deste domínio.",
      "deckId": "penta_prismatic_crater",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "prismatic_crater",
      "landmarkName": "Núcleo Partido da Cratera Prismática",
      "encounterKind": "throne_apex",
      "archetypeId": "penta_prismatic_crater",
      "archetypeTitle": "Soberania da Cratera Prismática"
    }
  },
  {
    "id": "gc_neutral_t4_capital_axial_01",
    "stage": 268,
    "submapId": "capital_axial",
    "submapOrder": 1,
    "rx": 49,
    "ry": 77,
    "worldX": 51.5,
    "worldY": 46,
    "landmarkName": "Embaixada Esmeralda dos Jardins (Setor S)",
    "tier": 4,
    "encounterKind": "rare_garrison",
    "isEntryNode": true,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_neutral_t4_capital_axial_01",
      "stage": 268,
      "name": "Colosso de Ferro da Cidadela",
      "title": "Guarnição de Fronteira • Embaixada Esmeralda dos Jardins (Setor S)",
      "domains": [
        "gold",
        "green",
        "purple"
      ],
      "avatarCardId": "neutral_115_golem_ferro_fornalha_neutra",
      "startingHp": 40,
      "passiveName": "Ressonância dos Cinco Selos",
      "passiveDescription": "+1 Armadura nas criaturas e +2 Afinidade inicial nos cinco domínios.",
      "rewardGold": 48,
      "rewardShards": 40,
      "rewardCardIds": [
        "neutral_115_golem_ferro_fornalha_neutra",
        "gold_40_pegaso_celeste"
      ],
      "loreIntro": "Colosso de Ferro da Cidadela mantém vigília soberana sobre Embaixada Esmeralda dos Jardins (Setor S) em Cidade Franca, vedando o avanço pelas rotas interiores.",
      "deckId": "tri_purple_green_gold",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "capital_axial",
      "landmarkName": "Embaixada Esmeralda dos Jardins (Setor S)",
      "encounterKind": "rare_garrison",
      "archetypeId": "tri_purple_green_gold",
      "archetypeTitle": "Armada do Zênite Umbral"
    }
  },
  {
    "id": "gc_neutral_t4_capital_axial_02",
    "stage": 269,
    "submapId": "capital_axial",
    "submapOrder": 2,
    "rx": 67,
    "ry": 81,
    "worldX": 51.5,
    "worldY": 46,
    "landmarkName": "Ponte Cinzenta do Pacto",
    "tier": 4,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": true,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_neutral_t4_capital_axial_02",
      "stage": 269,
      "name": "Atlas-Khor, O Regente do Ordenamento",
      "title": "Lorde Soberano • Ponte Cinzenta do Pacto",
      "domains": [
        "gold",
        "green",
        "red",
        "blue",
        "purple"
      ],
      "avatarCardId": "neutral_122_rei_hekaton_neutro_arbitro",
      "startingHp": 40,
      "passiveName": "Ressonância dos Cinco Selos",
      "passiveDescription": "+1 Armadura nas criaturas e +2 Afinidade inicial nos cinco domínios.",
      "rewardGold": 48,
      "rewardShards": 50,
      "rewardCardIds": [
        "neutral_122_rei_hekaton_neutro_arbitro",
        "red_59_cao_magma"
      ],
      "loreIntro": "Atlas-Khor, O Regente do Ordenamento mantém vigília soberana sobre Ponte Cinzenta do Pacto em Cidade Franca, vedando o avanço pelas rotas interiores.",
      "deckId": "penta_free_city_sovereign",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "capital_axial",
      "landmarkName": "Ponte Cinzenta do Pacto",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "penta_free_city_sovereign",
      "archetypeTitle": "Concílio Supremo da Cidade Franca"
    }
  },
  {
    "id": "gc_neutral_t4_capital_axial_03",
    "stage": 270,
    "submapId": "capital_axial",
    "submapOrder": 3,
    "rx": 31,
    "ry": 81,
    "worldX": 51.5,
    "worldY": 46,
    "landmarkName": "Guarita dos Cinco Selos",
    "tier": 4,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_neutral_t4_capital_axial_03",
      "stage": 270,
      "name": "Deus-Máquina de Aeternus",
      "title": "Lorde Soberano • Guarita dos Cinco Selos",
      "domains": [
        "blue",
        "gold",
        "purple",
        "red",
        "green"
      ],
      "avatarCardId": "neutral_123_emissario_relojoeiro_supremo",
      "startingHp": 40,
      "passiveName": "Ressonância dos Cinco Selos",
      "passiveDescription": "+1 Armadura nas criaturas e +2 Afinidade inicial nos cinco domínios.",
      "rewardGold": 48,
      "rewardShards": 50,
      "rewardCardIds": [
        "neutral_123_emissario_relojoeiro_supremo",
        "purple_69_dedo_morte"
      ],
      "loreIntro": "Deus-Máquina de Aeternus mantém vigília soberana sobre Guarita dos Cinco Selos em Cidade Franca, vedando o avanço pelas rotas interiores.",
      "deckId": "penta_wheel_convergence",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "capital_axial",
      "landmarkName": "Guarita dos Cinco Selos",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "penta_wheel_convergence",
      "archetypeTitle": "Convergência da Roda Horológica"
    }
  },
  {
    "id": "gc_neutral_t4_capital_axial_04",
    "stage": 271,
    "submapId": "capital_axial",
    "submapOrder": 4,
    "rx": 61,
    "ry": 65,
    "worldX": 51.5,
    "worldY": 46,
    "landmarkName": "Monólito da Trégua",
    "tier": 4,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_neutral_t4_capital_axial_04",
      "stage": 271,
      "name": "Tauron-Khor, Titã Quebra-Tronos",
      "title": "Lorde Soberano • Monólito da Trégua",
      "domains": [
        "red",
        "blue",
        "purple",
        "green",
        "gold"
      ],
      "avatarCardId": "neutral_09_baphometis_abismo",
      "startingHp": 40,
      "passiveName": "Ressonância dos Cinco Selos",
      "passiveDescription": "+1 Armadura nas criaturas e +2 Afinidade inicial nos cinco domínios.",
      "rewardGold": 48,
      "rewardShards": 50,
      "rewardCardIds": [
        "neutral_09_baphometis_abismo",
        "gold_70_maca_ruptura"
      ],
      "loreIntro": "Tauron-Khor, Titã Quebra-Tronos mantém vigília soberana sobre Monólito da Trégua em Cidade Franca, vedando o avanço pelas rotas interiores.",
      "deckId": "penta_prismatic_crater",
      "customDeckCardIds": [],
      "difficultyTier": 4,
      "submapId": "capital_axial",
      "landmarkName": "Monólito da Trégua",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "penta_prismatic_crater",
      "archetypeTitle": "Soberania da Cratera Prismática"
    }
  },
  {
    "id": "gc_neutral_t5_capital_axial_05",
    "stage": 272,
    "submapId": "capital_axial",
    "submapOrder": 5,
    "rx": 76,
    "ry": 62,
    "worldX": 51.5,
    "worldY": 46,
    "landmarkName": "Anel das Companhias Livres & Casa da Moeda",
    "tier": 5,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_neutral_t5_capital_axial_05",
      "stage": 272,
      "name": "Vaelkor, General da Roda Prismática",
      "title": "Lorde Soberano • Anel das Companhias Livres & Casa da Moeda",
      "domains": [
        "gold",
        "green",
        "red",
        "blue",
        "purple"
      ],
      "avatarCardId": "neutral_173_general_roda_matriz",
      "startingHp": 40,
      "passiveName": "Trono Pentacromático de Vaeloria",
      "passiveDescription": "+1 Essência e +3 Afinidade Pentacromática; tropas recebem +1/+1/+1 e drena 1 PV por rodada.",
      "rewardGold": 60,
      "rewardShards": 60,
      "rewardCardIds": [
        "neutral_173_general_roda_matriz",
        "gold_84_tiro_perdicao"
      ],
      "loreIntro": "Vaelkor, General da Roda Prismática mantém vigília soberana sobre Anel das Companhias Livres & Casa da Moeda em Cidade Franca, vedando o avanço pelas rotas interiores.",
      "deckId": "penta_free_city_sovereign",
      "customDeckCardIds": [],
      "difficultyTier": 5,
      "submapId": "capital_axial",
      "landmarkName": "Anel das Companhias Livres & Casa da Moeda",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "penta_free_city_sovereign",
      "archetypeTitle": "Concílio Supremo da Cidade Franca"
    }
  },
  {
    "id": "gc_neutral_t5_capital_axial_06",
    "stage": 273,
    "submapId": "capital_axial",
    "submapOrder": 6,
    "rx": 17,
    "ry": 52,
    "worldX": 51.5,
    "worldY": 46,
    "landmarkName": "Embaixada Umbral das Sombras (Setor O)",
    "tier": 5,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_neutral_t5_capital_axial_06",
      "stage": 273,
      "name": "Titã Ferrostor, O Devastador de Dragões",
      "title": "Lorde Soberano • Embaixada Umbral das Sombras (Setor O)",
      "domains": [
        "red",
        "purple",
        "green"
      ],
      "avatarCardId": "neutral_119_colosso_vonindod_fragmento",
      "startingHp": 40,
      "passiveName": "Trono Pentacromático de Vaeloria",
      "passiveDescription": "+1 Essência e +3 Afinidade Pentacromática; tropas recebem +1/+1/+1 e drena 1 PV por rodada.",
      "rewardGold": 60,
      "rewardShards": 60,
      "rewardCardIds": [
        "neutral_119_colosso_vonindod_fragmento",
        "red_78_minotauro_forja"
      ],
      "loreIntro": "Titã Ferrostor, O Devastador de Dragões mantém vigília soberana sobre Embaixada Umbral das Sombras (Setor O) em Cidade Franca, vedando o avanço pelas rotas interiores.",
      "deckId": "tri_red_purple_green",
      "customDeckCardIds": [],
      "difficultyTier": 5,
      "submapId": "capital_axial",
      "landmarkName": "Embaixada Umbral das Sombras (Setor O)",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "tri_red_purple_green",
      "archetypeTitle": "Corte da Lua Sangrenta"
    }
  },
  {
    "id": "gc_neutral_t5_capital_axial_07",
    "stage": 274,
    "submapId": "capital_axial",
    "submapOrder": 7,
    "rx": 30,
    "ry": 24,
    "worldX": 51.5,
    "worldY": 46,
    "landmarkName": "Embaixada Rubra das Forjas (Setor NO)",
    "tier": 5,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_neutral_t5_capital_axial_07",
      "stage": 274,
      "name": "Armada Dracônica do Prisma",
      "title": "Lorde Soberano • Embaixada Rubra das Forjas (Setor NO)",
      "domains": [
        "red",
        "green",
        "gold"
      ],
      "avatarCardId": "neutral_172_armada_draconica_matriz",
      "startingHp": 40,
      "passiveName": "Trono Pentacromático de Vaeloria",
      "passiveDescription": "+1 Essência e +3 Afinidade Pentacromática; tropas recebem +1/+1/+1 e drena 1 PV por rodada.",
      "rewardGold": 60,
      "rewardShards": 60,
      "rewardCardIds": [
        "neutral_172_armada_draconica_matriz",
        "red_103_fissura_tectonica"
      ],
      "loreIntro": "Armada Dracônica do Prisma mantém vigília soberana sobre Embaixada Rubra das Forjas (Setor NO) em Cidade Franca, vedando o avanço pelas rotas interiores.",
      "deckId": "tri_red_green_gold",
      "customDeckCardIds": [],
      "difficultyTier": 5,
      "submapId": "capital_axial",
      "landmarkName": "Embaixada Rubra das Forjas (Setor NO)",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "tri_red_green_gold",
      "archetypeTitle": "Tríade dos Titãs da Forja Primordial"
    }
  },
  {
    "id": "gc_neutral_t5_capital_axial_08",
    "stage": 275,
    "submapId": "capital_axial",
    "submapOrder": 8,
    "rx": 69,
    "ry": 23,
    "worldX": 51.5,
    "worldY": 46,
    "landmarkName": "Embaixada Safira do Conclave (Setor NE)",
    "tier": 5,
    "encounterKind": "legendary_sovereign",
    "isEntryNode": false,
    "isThroneNode": false,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_neutral_t5_capital_axial_08",
      "stage": 275,
      "name": "Valkyra, Imperatriz Pentacromática",
      "title": "Lorde Soberano • Embaixada Safira do Conclave (Setor NE)",
      "domains": [
        "gold",
        "red",
        "blue"
      ],
      "avatarCardId": "neutral_10_valkyra_pentacromatica",
      "startingHp": 40,
      "passiveName": "Trono Pentacromático de Vaeloria",
      "passiveDescription": "+1 Essência e +3 Afinidade Pentacromática; tropas recebem +1/+1/+1 e drena 1 PV por rodada.",
      "rewardGold": 60,
      "rewardShards": 60,
      "rewardCardIds": [
        "neutral_10_valkyra_pentacromatica",
        "purple_94_ceifador_abissal"
      ],
      "loreIntro": "Valkyra, Imperatriz Pentacromática mantém vigília soberana sobre Embaixada Safira do Conclave (Setor NE) em Cidade Franca, vedando o avanço pelas rotas interiores.",
      "deckId": "tri_red_blue_gold",
      "customDeckCardIds": [],
      "difficultyTier": 5,
      "submapId": "capital_axial",
      "landmarkName": "Embaixada Safira do Conclave (Setor NE)",
      "encounterKind": "legendary_sovereign",
      "archetypeId": "tri_red_blue_gold",
      "archetypeTitle": "Conclave da Chama Celeste"
    }
  },
  {
    "id": "gc_neutral_t5_capital_axial_09",
    "stage": 276,
    "submapId": "capital_axial",
    "submapOrder": 9,
    "rx": 50,
    "ry": 45,
    "worldX": 51.5,
    "worldY": 46,
    "landmarkName": "Trono Pentacromático da Torre dos Cinco Selos",
    "tier": 5,
    "encounterKind": "throne_apex",
    "isEntryNode": false,
    "isThroneNode": true,
    "unlocksSubmaps": [],
    "boss": {
      "id": "gc_neutral_t5_capital_axial_09",
      "stage": 276,
      "name": "Gorgonoth, O Devorador de Continentes",
      "title": "Soberano Supremo • Trono Pentacromático da Torre dos Cinco Selos",
      "domains": [
        "blue",
        "gold",
        "purple",
        "red",
        "green"
      ],
      "avatarCardId": "neutral_124_tarrasque_despertar_neutro",
      "startingHp": 40,
      "passiveName": "Trono Pentacromático de Vaeloria",
      "passiveDescription": "+1 Essência e +3 Afinidade Pentacromática; tropas recebem +1/+1/+1 e drena 1 PV por rodada.",
      "rewardGold": 85,
      "rewardShards": 85,
      "rewardCardIds": [
        "neutral_124_tarrasque_despertar_neutro",
        "gold_94_justicar_implacavel"
      ],
      "loreIntro": "No coração de Cidade Franca & Torre dos Cinco Selos, Gorgonoth, O Devorador de Continentes guarda o Trono Pentacromático da Torre dos Cinco Selos com as relíquias e criaturas mais poderosas deste domínio.",
      "deckId": "penta_wheel_convergence",
      "customDeckCardIds": [],
      "difficultyTier": 5,
      "submapId": "capital_axial",
      "landmarkName": "Trono Pentacromático da Torre dos Cinco Selos",
      "encounterKind": "throne_apex",
      "archetypeId": "penta_wheel_convergence",
      "archetypeTitle": "Convergência da Roda Horológica"
    }
  }
];

function resolveDomainsForAssignedChampion(
  primarySubmapDomain: Domain,
  champId: UnifiedChampionId,
  fallbackDomains: Domain[]
): Domain[] {
  let rawDomains: Domain[] = fallbackDomains;
  const mono = MONOCOLOR_ARCHETYPE_MASTERY[champId as MonocolorArchetypeId];
  const bi = BICOLOR_ARCHETYPE_MASTERY[champId as BicolorArchetypeId];
  const poly = POLYCOLOR_ARCHETYPE_MASTERY[champId as PolycolorArchetypeId];
  if (mono) {
    rawDomains = [mono.domain];
  } else if (bi) {
    rawDomains = [...bi.domains];
  } else if (poly) {
    rawDomains = [...poly.domains];
  }

  if (rawDomains.includes(primarySubmapDomain)) {
    return [
      primarySubmapDomain,
      ...rawDomains.filter((d) => d !== primarySubmapDomain),
    ];
  }
  return rawDomains;
}

// Hydrate all 276 Solo Grand Campaign encounters with their individual 100-card Signature Grimoires & symmetric 40 PV
for (const node of GRAND_CAMPAIGN_NODES) {
  node.boss.startingHp = 40;
  node.boss.difficultyTier = node.tier;
  const submapDom = VAELORIA_REGIONAL_MAPS[node.submapId]?.domain ?? node.boss.domains[0] ?? 'neutral';
  const assignedChamp = (node.boss.archetypeId as UnifiedChampionId | undefined) ?? undefined;
  if (assignedChamp) {
    node.boss.domains = resolveDomainsForAssignedChampion(
      submapDom,
      assignedChamp,
      node.boss.domains
    );
  }
  const graduated = resolveCampaignBossGraduatedSetup(node.boss);
  node.boss.deckId = graduated.archetypeId;
  node.boss.archetypeId = graduated.archetypeId;
  node.boss.archetypeTitle = graduated.archetypeTitle;
  node.boss.customDeckCardIds = buildIndividualSovereignSignatureDeck(
    node.boss.avatarCardId,
    graduated.archetypeId,
    node.tier
  );
}

export const GRAND_CAMPAIGN_NODES_BY_ID: Record<string, GrandCampaignEncounterNode> = Object.fromEntries(
  GRAND_CAMPAIGN_NODES.map((n) => [n.id, n])
);

export const GRAND_CAMPAIGN_BOSSES: CampaignBoss[] = GRAND_CAMPAIGN_NODES.map((n) => n.boss);

/**
 * Calcula quais dos 20 sub-mapas estão desbloqueados na marcha continental do jogador:
 * - O Reino Cardinal natal do Soberano está sempre acessível.
 * - Vencer ao menos 1 guarnição de fronteira em qualquer Reino Cardinal abre a Estrada Continental
 *   para os Reinos Cardinais vizinhos (permitindo recuar e buscar rotas/cores Tier 1 mais fracas!).
 * - Fronteiras Profundas, Corredores, Capitais Imperiais e o Eixo Central (Matriz -> Cratera -> Cidade Franca)
 *   só abrem quando o jogador derrota o Guardião de Fronteira/Trono correspondente sem pular inimigos!
 */
export function computeUnlockedCampaignSubmaps(
  clearedBossIds: Iterable<string>,
  sovereignDomain: SovereignBannerDomain
): Set<VaeloriaRealmId> {
  const cleared = new Set(clearedBossIds);
  const unlocked = new Set<VaeloriaRealmId>();
  const homeRealm = STARTING_REALM_BY_SOVEREIGN_DOMAIN[sovereignDomain] ?? 'veridia';
  unlocked.add(homeRealm);

  // Also unlock any submap where the player already defeated a boss previously (if they switched banner color)
  for (const node of GRAND_CAMPAIGN_NODES) {
    if (cleared.has(node.id)) {
      unlocked.add(node.submapId);
    }
  }

  let changed = true;
  while (changed) {
    changed = false;
    for (const rid of Array.from(unlocked)) {
      const g = GRAND_CAMPAIGN_SUBMAP_GRAPHS[rid];
      if (!g) continue;
      const clearedInSubmap = g.nodeIds.filter((nid) => cleared.has(nid));

      // 1. Direct Submap Unlocks triggered by defeating specific Gatekeeper / Throne nodes in an unlocked submap
      for (const nid of clearedInSubmap) {
        const node = GRAND_CAMPAIGN_NODES_BY_ID[nid];
        if (!node) continue;
        for (const targetSub of node.unlocksSubmaps) {
          if (!unlocked.has(targetSub)) {
            unlocked.add(targetSub);
            changed = true;
          }
        }
      }

      // 2. Continental Ring Road: clearing >= 1 entry/border node in an unlocked Cardinal Realm opens adjacent Cardinal Realms' Tier 1 borders!
      if (clearedInSubmap.length >= 1) {
        for (const edge of WORLD_SUBMAP_EDGES) {
          if (edge.kind !== 'border_ring') continue;
          if (edge.from === rid && !unlocked.has(edge.to)) {
            unlocked.add(edge.to);
            changed = true;
          } else if (edge.to === rid && !unlocked.has(edge.from)) {
            unlocked.add(edge.from);
            changed = true;
          }
        }
      }
    }
  }

  return unlocked;
}

/**
 * Calcula a acessibilidade estrita passo a passo dentro de um sub-mapa (Zona de Controle):
 * - Nós de entrada (`entryNodeIds`) estão acessíveis ao entrar no sub-mapa.
 * - Um nó `V` só fica acessível se ao menos um nó adjacente `U` conectado por estrada já foi DERROTADO (`cleared`).
 * - Adversários vivos bloqueiam todas as estradas adiante deles (impossível pular por cima de adversários!).
 * - Nós já derrotados permanecem 100% livres para recuo e reposicionamento tático.
 */
export function computeSubmapReachability(
  submapId: VaeloriaRealmId,
  clearedBossIds: Iterable<string>
): {
  accessibleNodeIds: Set<string>;
  clearedNodeIds: Set<string>;
  frontlineNodeIds: Set<string>;
  lockedNodeIds: Set<string>;
  isSubmapConquered: boolean;
  clearedCount: number;
  totalCount: number;
} {
  const g = GRAND_CAMPAIGN_SUBMAP_GRAPHS[submapId];
  const clearedGlobal = new Set(clearedBossIds);
  const clearedNodeIds = new Set<string>();
  const accessibleNodeIds = new Set<string>();

  for (const nid of g.nodeIds) {
    if (clearedGlobal.has(nid)) {
      clearedNodeIds.add(nid);
    }
  }

  // Entry nodes are immediately reachable from the submap Entry Camp
  for (const eid of g.entryNodeIds) {
    accessibleNodeIds.add(eid);
  }
  // All already-cleared nodes are reachable
  for (const cid of clearedNodeIds) {
    accessibleNodeIds.add(cid);
  }

  // Propagate reachability strictly OUT OF cleared nodes (Zone of Control: undefeated nodes do NOT propagate!)
  let changed = true;
  while (changed) {
    changed = false;
    for (const [u, v] of g.edges) {
      if (clearedNodeIds.has(u) && accessibleNodeIds.has(u) && !accessibleNodeIds.has(v)) {
        accessibleNodeIds.add(v);
        changed = true;
      }
      if (clearedNodeIds.has(v) && accessibleNodeIds.has(v) && !accessibleNodeIds.has(u)) {
        accessibleNodeIds.add(u);
        changed = true;
      }
    }
  }

  const frontlineNodeIds = new Set<string>();
  const lockedNodeIds = new Set<string>();
  for (const nid of g.nodeIds) {
    if (clearedNodeIds.has(nid)) continue;
    if (accessibleNodeIds.has(nid)) {
      frontlineNodeIds.add(nid);
    } else {
      lockedNodeIds.add(nid);
    }
  }

  return {
    accessibleNodeIds,
    clearedNodeIds,
    frontlineNodeIds,
    lockedNodeIds,
    isSubmapConquered: clearedNodeIds.size === g.nodeIds.length && g.nodeIds.length > 0,
    clearedCount: clearedNodeIds.size,
    totalCount: g.nodeIds.length,
  };
}

/**
 * Calcula a rota passo a passo sobre as estradas geográficas do sub-mapa entre a posição atual
 * do Soberano e o nó de destino (passando apenas por estradas liberadas / nós já pacificados!).
 */
export function findSubmapStepPath(
  submapId: VaeloriaRealmId,
  fromCoords: { x: number; y: number },
  targetNodeId: string,
  clearedBossIds: Iterable<string>
): Array<{ x: number; y: number; nodeId?: string }> {
  const g = GRAND_CAMPAIGN_SUBMAP_GRAPHS[submapId];
  const targetNode = GRAND_CAMPAIGN_NODES_BY_ID[targetNodeId];
  if (!g || !targetNode) return [];

  const cleared = new Set(clearedBossIds);
  // Build virtual graph including '__ENTRY__' at g.entryPos
  const coordsById: Record<string, { x: number; y: number }> = {
    __ENTRY__: g.entryPos,
  };
  const adj: Record<string, string[]> = { __ENTRY__: [...g.entryNodeIds] };
  for (const nid of g.nodeIds) {
    const n = GRAND_CAMPAIGN_NODES_BY_ID[nid];
    coordsById[nid] = { x: n.rx, y: n.ry };
    adj[nid] = [];
  }
  for (const eid of g.entryNodeIds) {
    adj[eid].push('__ENTRY__');
  }
  for (const [u, v] of g.edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  // Find closest node (or __ENTRY__) to current pawn position
  let startKey = '__ENTRY__';
  let bestD = Math.hypot(fromCoords.x - g.entryPos.x, fromCoords.y - g.entryPos.y);
  for (const nid of g.nodeIds) {
    const c = coordsById[nid];
    const d = Math.hypot(fromCoords.x - c.x, fromCoords.y - c.y);
    if (d < bestD) {
      bestD = d;
      startKey = nid;
    }
  }

  if (startKey === targetNodeId) {
    return [{ x: targetNode.rx, y: targetNode.ry, nodeId: targetNodeId }];
  }

  // BFS where intermediate nodes (other than startKey & targetNodeId) MUST be cleared (or __ENTRY__)!
  const queue: string[] = [startKey];
  const parent = new Map<string, string | null>([[startKey, null]]);

  while (queue.length > 0) {
    const cur = queue.shift()!;
    if (cur === targetNodeId) break;
    // Cannot walk THROUGH an undefeated boss node unless it's __ENTRY__!
    if (cur !== startKey && cur !== '__ENTRY__' && !cleared.has(cur)) {
      continue;
    }
    // Also if cur === startKey and startKey is an undefeated boss, we can only step BACK to cleared nodes or __ENTRY__!
    for (const nxt of adj[cur] ?? []) {
      if (parent.has(nxt)) continue;
      if (cur === startKey && cur !== '__ENTRY__' && !cleared.has(cur)) {
        // From an undefeated frontline node, can only retreat to __ENTRY__ or a cleared node!
        if (nxt !== '__ENTRY__' && !cleared.has(nxt)) continue;
      }
      parent.set(nxt, cur);
      queue.push(nxt);
    }
  }

  if (!parent.has(targetNodeId)) {
    return [{ x: targetNode.rx, y: targetNode.ry, nodeId: targetNodeId }];
  }

  const chain: string[] = [];
  let walk: string | null = targetNodeId;
  while (walk !== null) {
    chain.push(walk);
    walk = parent.get(walk) ?? null;
  }
  chain.reverse();

  return chain.slice(1).map((k) => ({
    x: coordsById[k].x,
    y: coordsById[k].y,
    nodeId: k === '__ENTRY__' ? undefined : k,
  }));
}

/**
 * Calcula a rota passo a passo entre sub-mapas no Mapa Continental ('world')
 * passando apenas por sub-mapas desbloqueados!
 */
export function findWorldSubmapStepPath(
  fromSubmap: VaeloriaRealmId,
  toSubmap: VaeloriaRealmId,
  unlockedSubmaps: Set<VaeloriaRealmId>
): Array<{ x: number; y: number; submapId: VaeloriaRealmId }> {
  const targetG = GRAND_CAMPAIGN_SUBMAP_GRAPHS[toSubmap];
  if (!targetG) return [];
  if (fromSubmap === toSubmap) {
    return [{ x: targetG.worldHub.x, y: targetG.worldHub.y, submapId: toSubmap }];
  }

  const adj = new Map<VaeloriaRealmId, VaeloriaRealmId[]>();
  for (const e of WORLD_SUBMAP_EDGES) {
    if (!adj.has(e.from)) adj.set(e.from, []);
    if (!adj.has(e.to)) adj.set(e.to, []);
    adj.get(e.from)!.push(e.to);
    adj.get(e.to)!.push(e.from);
  }

  const queue: VaeloriaRealmId[] = [fromSubmap];
  const parent = new Map<VaeloriaRealmId, VaeloriaRealmId | null>([[fromSubmap, null]]);
  while (queue.length > 0) {
    const cur = queue.shift()!;
    if (cur === toSubmap) break;
    for (const nxt of adj.get(cur) ?? []) {
      if (parent.has(nxt) || !unlockedSubmaps.has(nxt)) continue;
      parent.set(nxt, cur);
      queue.push(nxt);
    }
  }

  if (!parent.has(toSubmap)) {
    return [{ x: targetG.worldHub.x, y: targetG.worldHub.y, submapId: toSubmap }];
  }

  const chain: VaeloriaRealmId[] = [];
  let w: VaeloriaRealmId | null = toSubmap;
  while (w !== null) {
    chain.push(w);
    w = parent.get(w) ?? null;
  }
  chain.reverse();

  return chain.slice(1).map((rid) => ({
    x: GRAND_CAMPAIGN_SUBMAP_GRAPHS[rid].worldHub.x,
    y: GRAND_CAMPAIGN_SUBMAP_GRAPHS[rid].worldHub.y,
    submapId: rid,
  }));
}

// ============================================================================
// PERSISTÊNCIA DE SESSÃO DO MAPA DA CAMPANHA (SUB-MAPA ATIVO + FORMATO EXPANDIDO)
// ============================================================================

export interface CampaignMapSessionState {
  mapScope: VaeloriaMapScope;
  pawnPos?: { x: number; y: number };
  selectedBossId?: string;
  isTheaterFullscreen: boolean;
  returnBanner?: string | null;
}

const CAMPAIGN_MAP_SESSION_KEY = 'chromatic_pact_campaign_map_session_v1';

export function loadCampaignMapSession(): CampaignMapSessionState | null {
  try {
    const raw = localStorage.getItem(CAMPAIGN_MAP_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CampaignMapSessionState>;
    const scope = parsed.mapScope;
    const isValidScope =
      scope === 'world' || (typeof scope === 'string' && scope in VAELORIA_REGIONAL_MAPS);
    if (!isValidScope) return null;
    return {
      mapScope: scope as VaeloriaMapScope,
      pawnPos:
        parsed.pawnPos &&
        typeof parsed.pawnPos.x === 'number' &&
        typeof parsed.pawnPos.y === 'number'
          ? parsed.pawnPos
          : undefined,
      selectedBossId:
        typeof parsed.selectedBossId === 'string' ? parsed.selectedBossId : undefined,
      isTheaterFullscreen:
        parsed.isTheaterFullscreen !== undefined ? Boolean(parsed.isTheaterFullscreen) : true,
      returnBanner:
        typeof parsed.returnBanner === 'string' ? parsed.returnBanner : null,
    };
  } catch {
    return null;
  }
}

export function saveCampaignMapSession(patch: Partial<CampaignMapSessionState>): void {
  try {
    const prev = loadCampaignMapSession();
    const next: CampaignMapSessionState = {
      mapScope: patch.mapScope ?? prev?.mapScope ?? 'world',
      pawnPos: patch.pawnPos ?? prev?.pawnPos,
      selectedBossId: patch.selectedBossId ?? prev?.selectedBossId,
      isTheaterFullscreen:
        patch.isTheaterFullscreen !== undefined
          ? patch.isTheaterFullscreen
          : prev?.isTheaterFullscreen ?? true,
      returnBanner:
        patch.returnBanner !== undefined ? patch.returnBanner : prev?.returnBanner ?? null,
    };
    localStorage.setItem(CAMPAIGN_MAP_SESSION_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Garante que ao entrar ou retornar de um duelo da Campanha (especialmente ao vencer
 * e sair da mesa), o jogador retorne exatamente ao sub-mapa daquele confronto, nas
 * coordenadas do Soberano enfrentado, e em formato expandido (Tela Cheia).
 */
export function saveCampaignReturnFromBossDuel(
  bossId: string,
  options?: { didWin?: boolean; forceExpanded?: boolean }
): void {
  const gcNode = GRAND_CAMPAIGN_NODES_BY_ID[bossId];
  if (!gcNode) return;
  const prev = loadCampaignMapSession();
  const rdef = VAELORIA_REGIONAL_MAPS[gcNode.submapId];
  const nextBanner =
    options?.didWin === true
      ? `✓ ${gcNode.boss.name} vencido — ${rdef.name}`
      : options?.didWin === false
        ? null
        : prev?.returnBanner ?? rdef.name;

  saveCampaignMapSession({
    mapScope: gcNode.submapId,
    pawnPos: { x: gcNode.rx, y: gcNode.ry },
    selectedBossId: bossId,
    isTheaterFullscreen:
      options?.forceExpanded !== undefined
        ? options.forceExpanded
        : Boolean(options?.didWin || prev?.isTheaterFullscreen),
    returnBanner: nextBanner,
  });
}
