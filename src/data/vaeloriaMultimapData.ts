import {
  ArenaWeatherType,
  ConquestBattleModifiers,
  Domain,
  OverworldFieldBuff,
} from '../types/game';
import { ConquestFactionId } from './vaeloriaConquestData';
import { resolveStageMapNode } from './vaeloriaMapData';

export type VaeloriaRealmId =
  | 'veridia'
  | 'eclipse'
  | 'matrix'
  | 'solaria'
  | 'pyros'
  | 'vortex'
  | 'underforge'
  | 'astral_isles'
  | 'sunken_abyss'
  | 'deep_roots'
  | 'sky_bastions'
  | 'prismatic_crater'
  | 'sea_of_storms'
  | 'boreal_skyway'
  | 'capital_veridia'
  | 'capital_vortex'
  | 'capital_solaria'
  | 'capital_eclipse'
  | 'capital_pyros'
  | 'capital_axial';

export type VaeloriaMapScope = 'world' | VaeloriaRealmId;

export type VaeloriaRealmTier =
  | 'cardinal_realm'
  | 'deep_frontier'
  | 'transit_corridor'
  | 'imperial_capital';

export interface RegionalBorderPortal {
  id: string;
  targetRealm: VaeloriaRealmId;
  label: string;
  sublabel: string;
  directionIcon: string;
  /** Portal position in % (0..100) on the current regional map */
  x: number;
  y: number;
  /** Arrival position in % (0..100) on the target regional map */
  arrivalX: number;
  arrivalY: number;
}

export interface RegionalLocalLandmark {
  id: string;
  name: string;
  kind: 'town' | 'ruin' | 'fort' | 'port' | 'shrine' | 'pass';
  x: number;
  y: number;
}

export interface VaeloriaRegionalMapDef {
  id: VaeloriaRealmId;
  tier: VaeloriaRealmTier;
  parentRealmId?: VaeloriaRealmId;
  factionId: ConquestFactionId;
  domain: Domain;
  name: string;
  shortName: string;
  cardinalTitle: string;
  subtitle: string;
  icon: string;
  accentColor: string;
  imagePath: string;
  /** Bounding box of this realm on the Continental World Map (in % 0..100) for the Minimap Radar */
  worldBounds: { x: number; y: number; w: number; h: number };
  /** Center anchor on the Continental World Map (in % 0..100) */
  worldCenter: { x: number; y: number };
  portals: RegionalBorderPortal[];
  localLandmarks: RegionalLocalLandmark[];
}

export const VAELORIA_CARDINAL_REALMS: VaeloriaRealmId[] = [
  'veridia',
  'eclipse',
  'matrix',
  'solaria',
  'pyros',
  'vortex',
];

export const VAELORIA_DEEP_FRONTIERS: VaeloriaRealmId[] = [
  'underforge',
  'astral_isles',
  'sunken_abyss',
  'deep_roots',
  'sky_bastions',
  'prismatic_crater',
];

export const VAELORIA_TRANSIT_CORRIDORS: VaeloriaRealmId[] = [
  'sea_of_storms',
  'boreal_skyway',
];

export const VAELORIA_IMPERIAL_CAPITALS: VaeloriaRealmId[] = [
  'capital_veridia',
  'capital_vortex',
  'capital_solaria',
  'capital_eclipse',
  'capital_pyros',
  'capital_axial',
];

export const CARDINAL_TO_CAPITAL_MAP: Partial<Record<VaeloriaRealmId, VaeloriaRealmId>> = {
  veridia: 'capital_veridia',
  vortex: 'capital_vortex',
  solaria: 'capital_solaria',
  eclipse: 'capital_eclipse',
  pyros: 'capital_pyros',
  matrix: 'capital_axial',
};

export const CAPITAL_PROVINCE_TO_CAPITAL_MAP: Record<string, VaeloriaRealmId> = {
  prov_veridia_mother_tree: 'capital_veridia',
  prov_vortex_polar_spire: 'capital_vortex',
  prov_solaria_great_dome: 'capital_solaria',
  prov_eclipse_obsidian_cathedral: 'capital_eclipse',
  prov_pyros_split_anvil: 'capital_pyros',
  prov_matrix_five_seals: 'capital_axial',
};

export const VAELORIA_REALM_ORDER: VaeloriaRealmId[] = [
  ...VAELORIA_CARDINAL_REALMS,
  ...VAELORIA_DEEP_FRONTIERS,
  ...VAELORIA_TRANSIT_CORRIDORS,
  ...VAELORIA_IMPERIAL_CAPITALS,
];

export const VAELORIA_REGIONAL_MAPS: Record<VaeloriaRealmId, VaeloriaRegionalMapDef> = {
  veridia: {
    id: 'veridia',
    tier: 'cardinal_realm',
    factionId: 'veridia',
    domain: 'green',
    name: 'Veridia — O Sul Selvagem',
    shortName: 'Veridia',
    cardinalTitle: 'ATLAS REGIONAL DO SUL • VERIDIA',
    subtitle: 'Santuário da Árvore-Mãe, Delta de Jade & Península das Presas',
    icon: '🌿',
    accentColor: '#10b981',
    imagePath: '/assets/map/vaeloria_region_veridia.jpg',
    worldBounds: { x: 28, y: 63, w: 44, h: 31 },
    worldCenter: { x: 50, y: 76 },
    portals: [
      {
        id: 'portal_veridia_to_matrix',
        targetRealm: 'matrix',
        label: 'Fronteira Norte → Centro Axial',
        sublabel: 'Estrada Real dos Cinco Selos',
        directionIcon: '⬆️',
        x: 50,
        y: 8.5,
        arrivalX: 50,
        arrivalY: 85,
      },
      {
        id: 'portal_veridia_to_eclipse',
        targetRealm: 'eclipse',
        label: 'Passo Noroeste → Eclipse',
        sublabel: 'Travessia do Pântano Negro',
        directionIcon: '↖️',
        x: 11,
        y: 20,
        arrivalX: 80,
        arrivalY: 82,
      },
      {
        id: 'portal_veridia_to_solaria',
        targetRealm: 'solaria',
        label: 'Estrada Nordeste → Solária',
        sublabel: 'Subida dos Jardins Suspensos',
        directionIcon: '↗️',
        x: 89,
        y: 18,
        arrivalX: 20,
        arrivalY: 82,
      },
      {
        id: 'portal_veridia_to_deep_roots',
        targetRealm: 'deep_roots',
        label: 'Descida Espiral → Raízes Profundas',
        sublabel: 'Túnel da Árvore-Mãe',
        directionIcon: '🕳️',
        x: 54,
        y: 88,
        arrivalX: 49,
        arrivalY: 23,
      },
      {
        id: 'portal_veridia_to_capital_veridia',
        targetRealm: 'capital_veridia',
        label: 'Portão de Cipó-Ferro → Galhada Viva',
        sublabel: '4ª Escala • Cidadela-Capital da Árvore-Mãe',
        directionIcon: '🏰',
        x: 50,
        y: 41,
        arrivalX: 31,
        arrivalY: 22,
      },
      {
        id: 'portal_veridia_to_sea_of_storms',
        targetRealm: 'sea_of_storms',
        label: 'Frota do Delta → Mar das Tormentas',
        sublabel: 'Rota Marítima Austral',
        directionIcon: '⚓',
        x: 20,
        y: 89,
        arrivalX: 42,
        arrivalY: 88,
      },
    ],
    localLandmarks: [
      { id: 'lm_veridia_1', name: 'Aldeia da Seiva Antiga', kind: 'town', x: 42, y: 40 },
      { id: 'lm_veridia_2', name: 'Pontes Pênseis de Cipó-Ferro', kind: 'pass', x: 63, y: 47 },
      { id: 'lm_veridia_3', name: 'Ruínas Esmeralda Submersas', kind: 'ruin', x: 58, y: 67 },
      { id: 'lm_veridia_4', name: 'Totens da Grande Caçada', kind: 'shrine', x: 35, y: 64 },
      { id: 'lm_veridia_5', name: 'Forte das Raízes Norte', kind: 'fort', x: 42, y: 17 },
      { id: 'lm_veridia_6', name: 'Ancoradouro Austral', kind: 'port', x: 38, y: 85 },
    ],
  },

  eclipse: {
    id: 'eclipse',
    tier: 'cardinal_realm',
    factionId: 'eclipse',
    domain: 'purple',
    name: 'Vale do Eclipse — Oeste Profundo',
    shortName: 'Eclipse',
    cardinalTitle: 'ATLAS REGIONAL DO OESTE • VALE DO ECLIPSE',
    subtitle: 'Catedral de Obsidiana, Fenda Abissal & Costa do Ossário',
    icon: '💀',
    accentColor: '#a855f7',
    imagePath: '/assets/map/vaeloria_region_eclipse.jpg',
    worldBounds: { x: 14, y: 31, w: 26, h: 42 },
    worldCenter: { x: 27, y: 51 },
    portals: [
      {
        id: 'portal_eclipse_to_matrix',
        targetRealm: 'matrix',
        label: 'Fronteira Leste → Centro Axial',
        sublabel: 'Portão do Anel Ocidental',
        directionIcon: '➡️',
        x: 91,
        y: 50,
        arrivalX: 13,
        arrivalY: 52,
      },
      {
        id: 'portal_eclipse_to_pyros',
        targetRealm: 'pyros',
        label: 'Passo Nordeste → Pyros',
        sublabel: 'Garganta da Caldeira Ocidental',
        directionIcon: '↗️',
        x: 88,
        y: 11,
        arrivalX: 14,
        arrivalY: 64,
      },
      {
        id: 'portal_eclipse_to_vortex',
        targetRealm: 'vortex',
        label: 'Rota Boreal → Vórtex',
        sublabel: 'Estreito das Estrelas Mortas',
        directionIcon: '⬆️',
        x: 24,
        y: 8.5,
        arrivalX: 20,
        arrivalY: 83,
      },
      {
        id: 'portal_eclipse_to_veridia',
        targetRealm: 'veridia',
        label: 'Trilha Sudeste → Veridia',
        sublabel: 'Fronteira das Matas Espinhosas',
        directionIcon: '↘️',
        x: 86,
        y: 89,
        arrivalX: 16,
        arrivalY: 22,
      },
      {
        id: 'portal_eclipse_to_sunken_abyss',
        targetRealm: 'sunken_abyss',
        label: 'Escadaria Abissal → Fossa Submersa',
        sublabel: 'Falésia da Catedral Afogada',
        directionIcon: '🌊',
        x: 10,
        y: 46,
        arrivalX: 82,
        arrivalY: 36,
      },
      {
        id: 'portal_eclipse_to_capital_eclipse',
        targetRealm: 'capital_eclipse',
        label: 'Ponte das Gárgulas → Nocturnus',
        sublabel: '4ª Escala • Catedral-Necrópole Imperial',
        directionIcon: '🏰',
        x: 51,
        y: 38,
        arrivalX: 76,
        arrivalY: 80,
      },
      {
        id: 'portal_eclipse_to_sea_of_storms',
        targetRealm: 'sea_of_storms',
        label: 'Cais do Ossário → Mar das Tormentas',
        sublabel: 'Rota dos Corsários Umbrais',
        directionIcon: '⚓',
        x: 11,
        y: 78,
        arrivalX: 14,
        arrivalY: 56,
      },
    ],
    localLandmarks: [
      { id: 'lm_eclipse_1', name: 'Necrópole dos Sinos Mudos', kind: 'ruin', x: 38, y: 36 },
      { id: 'lm_eclipse_2', name: 'Vila da Vigília Umbral', kind: 'town', x: 58, y: 58 },
      { id: 'lm_eclipse_3', name: 'Ponte das Gárgulas', kind: 'pass', x: 64, y: 38 },
      { id: 'lm_eclipse_4', name: 'Farol da Lua Sangrenta', kind: 'port', x: 14, y: 63 },
      { id: 'lm_eclipse_5', name: 'Santuário dos Pactuários', kind: 'shrine', x: 46, y: 68 },
      { id: 'lm_eclipse_6', name: 'Bastilha de Sangue-Ferro', kind: 'fort', x: 64, y: 20 },
    ],
  },

  matrix: {
    id: 'matrix',
    tier: 'cardinal_realm',
    factionId: 'matrix',
    domain: 'neutral',
    name: 'Fronteira Cinzenta — Centro Axial',
    shortName: 'Centro Axial',
    cardinalTitle: 'ATLAS REGIONAL CENTRAL • FRONTEIRA CINZENTA',
    subtitle: 'Torre dos Cinco Selos, Monólitos Prismáticos & Anel do Pacto',
    icon: '☸',
    accentColor: '#e2e8f0',
    imagePath: '/assets/map/vaeloria_region_axial.jpg',
    worldBounds: { x: 36, y: 38, w: 28, h: 25 },
    worldCenter: { x: 50, y: 50.5 },
    portals: [
      {
        id: 'portal_matrix_to_pyros',
        targetRealm: 'pyros',
        label: 'Passo Norte → Pyros',
        sublabel: 'Subida da Grande Bigorna',
        directionIcon: '⬆️',
        x: 50,
        y: 8.5,
        arrivalX: 50,
        arrivalY: 85,
      },
      {
        id: 'portal_matrix_to_veridia',
        targetRealm: 'veridia',
        label: 'Estrada Sul → Veridia',
        sublabel: 'Descida para a Árvore-Mãe',
        directionIcon: '⬇️',
        x: 50,
        y: 90.5,
        arrivalX: 50,
        arrivalY: 14,
      },
      {
        id: 'portal_matrix_to_eclipse',
        targetRealm: 'eclipse',
        label: 'Portão Oeste → Eclipse',
        sublabel: 'Estrada da Escarpa Carmesim',
        directionIcon: '⬅️',
        x: 8.5,
        y: 50,
        arrivalX: 85,
        arrivalY: 50,
      },
      {
        id: 'portal_matrix_to_solaria',
        targetRealm: 'solaria',
        label: 'Portão Leste → Solária',
        sublabel: 'Via Imperial do Grande Domo',
        directionIcon: '➡️',
        x: 91.5,
        y: 50,
        arrivalX: 14,
        arrivalY: 50,
      },
      {
        id: 'portal_matrix_to_prismatic_crater',
        targetRealm: 'prismatic_crater',
        label: 'Fenda dos Selos → Cratera Prismática',
        sublabel: 'Descida Planar sob a Torre Axial',
        directionIcon: '💎',
        x: 50,
        y: 59,
        arrivalX: 50,
        arrivalY: 16,
      },
      {
        id: 'portal_matrix_to_capital_axial',
        targetRealm: 'capital_axial',
        label: 'Anel Diplomático → Cidade Franca Axial',
        sublabel: '4ª Escala • Torre dos Cinco Selos & Embaixadas',
        directionIcon: '🏰',
        x: 50,
        y: 43,
        arrivalX: 50,
        arrivalY: 86,
      },
    ],
    localLandmarks: [
      { id: 'lm_matrix_1', name: 'Coliseu Externo dos Selos', kind: 'fort', x: 50, y: 68 },
      { id: 'lm_matrix_2', name: 'Encruzilhada das Cinco Linhas de Ley', kind: 'shrine', x: 50, y: 32 },
      { id: 'lm_matrix_3', name: 'Entreposto das Caravanas Neutras', kind: 'town', x: 36, y: 50 },
      { id: 'lm_matrix_4', name: 'Praça dos Embaixadores', kind: 'town', x: 64, y: 50 },
      { id: 'lm_matrix_5', name: 'Ruínas da Primeira Refração', kind: 'ruin', x: 18, y: 38 },
      { id: 'lm_matrix_6', name: 'Atalaia Oriental de Granito', kind: 'fort', x: 82, y: 38 },
    ],
  },

  solaria: {
    id: 'solaria',
    tier: 'cardinal_realm',
    factionId: 'solaria',
    domain: 'gold',
    name: 'Solária — O Leste Alto',
    shortName: 'Solária',
    cardinalTitle: 'ATLAS REGIONAL DO LESTE • SOLÁRIA',
    subtitle: 'Grande Domo Solar, Relicário Eterno & Falésias dos Espelhos',
    icon: '☀️',
    accentColor: '#eab308',
    imagePath: '/assets/map/vaeloria_region_solaria.jpg',
    worldBounds: { x: 62, y: 29, w: 28, h: 37 },
    worldCenter: { x: 74, y: 45 },
    portals: [
      {
        id: 'portal_solaria_to_matrix',
        targetRealm: 'matrix',
        label: 'Via Oeste → Centro Axial',
        sublabel: 'Estrada do Tribunal Oriental',
        directionIcon: '⬅️',
        x: 8.5,
        y: 50,
        arrivalX: 86,
        arrivalY: 50,
      },
      {
        id: 'portal_solaria_to_pyros',
        targetRealm: 'pyros',
        label: 'Passo Noroeste → Pyros',
        sublabel: 'Portões das Escamas Imperiais',
        directionIcon: '↖️',
        x: 12,
        y: 14,
        arrivalX: 85,
        arrivalY: 66,
      },
      {
        id: 'portal_solaria_to_vortex',
        targetRealm: 'vortex',
        label: 'Rota Marítima Norte → Vórtex',
        sublabel: 'Travessia do Monólito de Safira',
        directionIcon: '⬆️',
        x: 68,
        y: 8.5,
        arrivalX: 80,
        arrivalY: 84,
      },
      {
        id: 'portal_solaria_to_veridia',
        targetRealm: 'veridia',
        label: 'Descida Sudoeste → Veridia',
        sublabel: 'Aquedutos para o Delta de Jade',
        directionIcon: '↙️',
        x: 14,
        y: 89,
        arrivalX: 83,
        arrivalY: 23,
      },
      {
        id: 'portal_solaria_to_sky_bastions',
        targetRealm: 'sky_bastions',
        label: 'Ponte de Luz → Bastilhas Celestes',
        sublabel: 'Ascensão às Ilhas do Zênite',
        directionIcon: '🌤️',
        x: 88,
        y: 56,
        arrivalX: 28,
        arrivalY: 62,
      },
      {
        id: 'portal_solaria_to_capital_solaria',
        targetRealm: 'capital_solaria',
        label: 'Arco Triunfal → Bastião de Aethelgard',
        sublabel: '4ª Escala • Cidadela Imperial Dourada',
        directionIcon: '🏰',
        x: 49,
        y: 39,
        arrivalX: 50,
        arrivalY: 69,
      },
      {
        id: 'portal_solaria_to_sea_of_storms',
        targetRealm: 'sea_of_storms',
        label: 'Porto da Alvorada → Mar das Tormentas',
        sublabel: 'Esquadra Oriental de Galés',
        directionIcon: '⚓',
        x: 84,
        y: 84,
        arrivalX: 85,
        arrivalY: 52,
      },
      {
        id: 'portal_solaria_to_boreal_skyway',
        targetRealm: 'boreal_skyway',
        label: 'Doca do Zênite → Corredor das Nuvens',
        sublabel: 'Rota Aérea Transcontinental',
        directionIcon: '🐉',
        x: 88,
        y: 19,
        arrivalX: 78,
        arrivalY: 56,
      },
    ],
    localLandmarks: [
      { id: 'lm_solaria_1', name: 'Aqueduto Imperial de Alabastro', kind: 'pass', x: 36, y: 60 },
      { id: 'lm_solaria_2', name: 'Cidade-Terraço da Aurora', kind: 'town', x: 62, y: 55 },
      { id: 'lm_solaria_3', name: 'Porto Real do Sol Nascente', kind: 'port', x: 71, y: 76 },
      { id: 'lm_solaria_4', name: 'Mosteiro das Lentes Sagradas', kind: 'shrine', x: 68, y: 31 },
      { id: 'lm_solaria_5', name: 'Cidadela da Guarda Dourada', kind: 'fort', x: 35, y: 37 },
      { id: 'lm_solaria_6', name: 'Colunata dos Reis Antigos', kind: 'ruin', x: 50, y: 78 },
    ],
  },

  pyros: {
    id: 'pyros',
    tier: 'cardinal_realm',
    factionId: 'pyros',
    domain: 'red',
    name: 'Pyros — O Norte Vulcânico',
    shortName: 'Pyros',
    cardinalTitle: 'ATLAS REGIONAL DO NORTE • PYROS',
    subtitle: 'A Grande Bigorna Partida, Caldeiras de Magma & Ninho das Armadas',
    icon: '🔥',
    accentColor: '#ef4444',
    imagePath: '/assets/map/vaeloria_region_pyros.jpg',
    worldBounds: { x: 35, y: 17, w: 32, h: 22 },
    worldCenter: { x: 51, y: 26 },
    portals: [
      {
        id: 'portal_pyros_to_vortex',
        targetRealm: 'vortex',
        label: 'Passo Boreal → Vórtex',
        sublabel: 'Fronteira de Gelo e Vapor',
        directionIcon: '⬆️',
        x: 50,
        y: 8.5,
        arrivalX: 50,
        arrivalY: 85,
      },
      {
        id: 'portal_pyros_to_matrix',
        targetRealm: 'matrix',
        label: 'Descida Sul → Centro Axial',
        sublabel: 'Estrada de Basalto dos Cinco Selos',
        directionIcon: '⬇️',
        x: 50,
        y: 90.5,
        arrivalX: 50,
        arrivalY: 14,
      },
      {
        id: 'portal_pyros_to_eclipse',
        targetRealm: 'eclipse',
        label: 'Desfiladeiro Sudoeste → Eclipse',
        sublabel: 'Cânion de Cinza e Sombra',
        directionIcon: '↙️',
        x: 9,
        y: 72,
        arrivalX: 82,
        arrivalY: 16,
      },
      {
        id: 'portal_pyros_to_solaria',
        targetRealm: 'solaria',
        label: 'Cordilheira Sudeste → Solária',
        sublabel: 'Rota dos Portões Dracônicos',
        directionIcon: '↘️',
        x: 91,
        y: 74,
        arrivalX: 16,
        arrivalY: 20,
      },
      {
        id: 'portal_pyros_to_underforge',
        targetRealm: 'underforge',
        label: 'Abismo Rúnico → Infraforja',
        sublabel: 'Descida às Fornalhas de Ignaroth',
        directionIcon: '⚒️',
        x: 68,
        y: 43,
        arrivalX: 72,
        arrivalY: 24,
      },
      {
        id: 'portal_pyros_to_capital_pyros',
        targetRealm: 'capital_pyros',
        label: 'Ponte das Correntes → Caldeira de Vulcanor',
        sublabel: '4ª Escala • Metrópole-Forja Imperial',
        directionIcon: '🏰',
        x: 50,
        y: 39,
        arrivalX: 51,
        arrivalY: 84,
      },
      {
        id: 'portal_pyros_to_boreal_skyway',
        targetRealm: 'boreal_skyway',
        label: 'Ninho das Armadas → Corredor das Nuvens',
        sublabel: 'Ascensão pelas Colunas Térmicas',
        directionIcon: '🐉',
        x: 84,
        y: 16,
        arrivalX: 23,
        arrivalY: 24,
      },
    ],
    localLandmarks: [
      { id: 'lm_pyros_1', name: 'Ponte de Ferro sobre o Rio de Lava', kind: 'pass', x: 37, y: 48 },
      { id: 'lm_pyros_2', name: 'Fundição das Legiões Rubras', kind: 'town', x: 54, y: 68 },
      { id: 'lm_pyros_3', name: 'Docas Suspensas de Dirigíveis', kind: 'port', x: 64, y: 31 },
      { id: 'lm_pyros_4', name: 'Altar da Chama Primordial', kind: 'shrine', x: 34, y: 68 },
      { id: 'lm_pyros_5', name: 'Bastião de Obsidiana Ardente', kind: 'fort', x: 63, y: 54 },
      { id: 'lm_pyros_6', name: 'Ossada do Dragão Ancestral', kind: 'ruin', x: 16, y: 35 },
    ],
  },

  vortex: {
    id: 'vortex',
    tier: 'cardinal_realm',
    factionId: 'vortex',
    domain: 'blue',
    name: 'Vórtex — Polos Setentrionais',
    shortName: 'Vórtex',
    cardinalTitle: 'ATLAS REGIONAL POLAR • VÓRTEX',
    subtitle: 'Pináculo Polar de Chronos, Agulhas de Safira & Fossa Estelar',
    icon: '❄️',
    accentColor: '#38bdf8',
    imagePath: '/assets/map/vaeloria_region_vortex.jpg',
    worldBounds: { x: 24, y: 4, w: 54, h: 20 },
    worldCenter: { x: 50, y: 13 },
    portals: [
      {
        id: 'portal_vortex_to_pyros',
        targetRealm: 'pyros',
        label: 'Fronteira Sul → Pyros',
        sublabel: 'Descida ao Observatório Piro-Rúnico',
        directionIcon: '⬇️',
        x: 50,
        y: 90.5,
        arrivalX: 50,
        arrivalY: 14,
      },
      {
        id: 'portal_vortex_to_eclipse',
        targetRealm: 'eclipse',
        label: 'Mar Sudoeste → Eclipse',
        sublabel: 'Travessia da Fossa das Estrelas',
        directionIcon: '↙️',
        x: 13,
        y: 88,
        arrivalX: 25,
        arrivalY: 15,
      },
      {
        id: 'portal_vortex_to_solaria',
        targetRealm: 'solaria',
        label: 'Estreito Sudeste → Solária',
        sublabel: 'Rota Naval para o Relicário Eterno',
        directionIcon: '↘️',
        x: 87,
        y: 88,
        arrivalX: 66,
        arrivalY: 15,
      },
      {
        id: 'portal_vortex_to_astral_isles',
        targetRealm: 'astral_isles',
        label: 'Estreito Astral → Ilhas Astrais',
        sublabel: 'Rota das Estrelas Mortas',
        directionIcon: '🌌',
        x: 11,
        y: 22,
        arrivalX: 56,
        arrivalY: 80,
      },
      {
        id: 'portal_vortex_to_capital_vortex',
        targetRealm: 'capital_vortex',
        label: 'Comportas de Safira → Cristália Polar',
        sublabel: '4ª Escala • Pináculo Horológico Imperial',
        directionIcon: '🏰',
        x: 50,
        y: 29,
        arrivalX: 64,
        arrivalY: 80,
      },
      {
        id: 'portal_vortex_to_sea_of_storms',
        targetRealm: 'sea_of_storms',
        label: 'Fiorde Boreal → Mar das Tormentas',
        sublabel: 'Comboio de Quebra-Gelos',
        directionIcon: '⚓',
        x: 24,
        y: 84,
        arrivalX: 20,
        arrivalY: 16,
      },
      {
        id: 'portal_vortex_to_boreal_skyway',
        targetRealm: 'boreal_skyway',
        label: 'Agulhas de Vento → Corredor das Nuvens',
        sublabel: 'Corrente Polar da Aurora',
        directionIcon: '🐉',
        x: 86,
        y: 24,
        arrivalX: 50,
        arrivalY: 36,
      },
    ],
    localLandmarks: [
      { id: 'lm_vortex_1', name: 'Ponte de Gelo Eterno', kind: 'pass', x: 64, y: 36 },
      { id: 'lm_vortex_2', name: 'Cais dos Quebra-Gelos Reais', kind: 'port', x: 45, y: 56 },
      { id: 'lm_vortex_3', name: 'Vila Boreal dos Relojoeiros', kind: 'town', x: 56, y: 52 },
      { id: 'lm_vortex_4', name: 'Santuário da Aurora Astral', kind: 'shrine', x: 38, y: 37 },
      { id: 'lm_vortex_5', name: 'Forte da Geada Negra', kind: 'fort', x: 40, y: 69 },
      { id: 'lm_vortex_6', name: 'Naufrágio da Primeira Armada', kind: 'ruin', x: 16, y: 49 },
    ],
  },

  // =========================================================================
  // AS 6 NOVAS FRONTEIRAS PROFUNDAS, SUBTERRÂNEAS, MARÍTIMAS & CELESTES
  // =========================================================================

  underforge: {
    id: 'underforge',
    tier: 'deep_frontier',
    parentRealmId: 'pyros',
    factionId: 'pyros',
    domain: 'red',
    name: 'Infraforja Magmática de Ignaroth',
    shortName: 'Infraforja',
    cardinalTitle: 'FRONTEIRA SUBTERRÂNEA • INFRAFORJA DE IGNAROTH',
    subtitle: 'Bigorna Abissal, Cataratas de Escória & Crisol de Basalto',
    icon: '⚒️',
    accentColor: '#f97316',
    imagePath: '/assets/map/vaeloria_frontier_underforge.jpg',
    worldBounds: { x: 81, y: 5, w: 16.5, h: 18.5 },
    worldCenter: { x: 89.5, y: 14 },
    portals: [
      {
        id: 'portal_underforge_to_pyros',
        targetRealm: 'pyros',
        label: 'Escadaria Rúnica → Superfície de Pyros',
        sublabel: 'Ascensão à Grande Bigorna Partida',
        directionIcon: '⬆️',
        x: 74,
        y: 21,
        arrivalX: 66,
        arrivalY: 45,
      },
      {
        id: 'portal_underforge_to_prismatic_crater',
        targetRealm: 'prismatic_crater',
        label: 'Túnel Tectônico → Cratera Prismática',
        sublabel: 'Conduto de Magma e Cristal',
        directionIcon: '↙️',
        x: 11,
        y: 82,
        arrivalX: 28,
        arrivalY: 22,
      },
      {
        id: 'portal_underforge_to_sky_bastions',
        targetRealm: 'sky_bastions',
        label: 'Chaminé Térmica → Bastilhas Celestes',
        sublabel: 'Corrente Ascendente das Armadas',
        directionIcon: '↘️',
        x: 89,
        y: 78,
        arrivalX: 80,
        arrivalY: 26,
      },
      {
        id: 'portal_underforge_to_capital_pyros',
        targetRealm: 'capital_pyros',
        label: 'Elevador de Correntes → Caldeira de Vulcanor',
        sublabel: 'Subida Direta ao Trono da Bigorna',
        directionIcon: '🏰',
        x: 52,
        y: 18,
        arrivalX: 52,
        arrivalY: 52,
      },
    ],
    localLandmarks: [
      { id: 'lm_underforge_1', name: 'Fornalhas de Escamas Eternas', kind: 'town', x: 35, y: 38 },
      { id: 'lm_underforge_2', name: 'Ponte das Correntes Rubras', kind: 'pass', x: 24, y: 77 },
      { id: 'lm_underforge_3', name: 'Docas de Escória Incandescente', kind: 'port', x: 40, y: 74 },
      { id: 'lm_underforge_4', name: 'Santuário do Coração de Ignaroth', kind: 'shrine', x: 54, y: 29 },
      { id: 'lm_underforge_5', name: 'Bastião da Catarata de Magma', kind: 'fort', x: 66, y: 42 },
      { id: 'lm_underforge_6', name: 'Tumba dos Primeiros Ferreiros', kind: 'ruin', x: 16, y: 32 },
    ],
  },

  astral_isles: {
    id: 'astral_isles',
    tier: 'deep_frontier',
    parentRealmId: 'vortex',
    factionId: 'vortex',
    domain: 'blue',
    name: 'Arquipélago Astral das Estrelas Mortas',
    shortName: 'Ilhas Astrais',
    cardinalTitle: 'FRONTEIRA MARÍTIMA POLAR • ARQUIPÉLAGO ASTRAL',
    subtitle: 'Turbilhão de Chronos, Faróis de Latão & Recifes Estelares',
    icon: '🌌',
    accentColor: '#06b6d4',
    imagePath: '/assets/map/vaeloria_frontier_astral_isles.jpg',
    worldBounds: { x: 3, y: 5, w: 17.5, h: 18 },
    worldCenter: { x: 11.5, y: 14 },
    portals: [
      {
        id: 'portal_astral_to_vortex',
        targetRealm: 'vortex',
        label: 'Porto do Estreito → Vórtex Polar',
        sublabel: 'Retorno ao Pináculo de Chronos',
        directionIcon: '↘️',
        x: 56,
        y: 84,
        arrivalX: 15,
        arrivalY: 25,
      },
      {
        id: 'portal_astral_to_sunken_abyss',
        targetRealm: 'sunken_abyss',
        label: 'Abismo Oceânico → Fossa Submersa',
        sublabel: 'Mergulho pelas Águas Negras',
        directionIcon: '⬇️',
        x: 11,
        y: 78,
        arrivalX: 20,
        arrivalY: 18,
      },
      {
        id: 'portal_astral_to_sky_bastions',
        targetRealm: 'sky_bastions',
        label: 'Ponte Boreal → Bastilhas Celestes',
        sublabel: 'Arco de Luz Estelar',
        directionIcon: '➡️',
        x: 90,
        y: 26,
        arrivalX: 38,
        arrivalY: 22,
      },
      {
        id: 'portal_astral_to_capital_vortex',
        targetRealm: 'capital_vortex',
        label: 'Feixe Refractor → Pináculo de Cristália',
        sublabel: 'Retorno às Agulhas da Capital',
        directionIcon: '🏰',
        x: 68,
        y: 78,
        arrivalX: 51,
        arrivalY: 18,
      },
      {
        id: 'portal_astral_to_sea_of_storms',
        targetRealm: 'sea_of_storms',
        label: 'Passagem Sul → Mar das Tormentas',
        sublabel: 'Descida ao Vórtice Central',
        directionIcon: '⚓',
        x: 34,
        y: 88,
        arrivalX: 52,
        arrivalY: 15,
      },
      {
        id: 'portal_astral_to_boreal_skyway',
        targetRealm: 'boreal_skyway',
        label: 'Corrente da Aurora → Corredor das Nuvens',
        sublabel: 'Ascensão Eólica Setentrional',
        directionIcon: '🐉',
        x: 84,
        y: 14,
        arrivalX: 68,
        arrivalY: 20,
      },
    ],
    localLandmarks: [
      { id: 'lm_astral_isles_1', name: 'Farol Horológico do Norte', kind: 'fort', x: 51, y: 20 },
      { id: 'lm_astral_isles_2', name: 'Passarela de Luz Estelar', kind: 'pass', x: 63, y: 46 },
      { id: 'lm_astral_isles_3', name: 'Recife dos Galeões Cristalizados', kind: 'ruin', x: 17, y: 68 },
      { id: 'lm_astral_isles_4', name: 'Planetário das Esferas Mortas', kind: 'shrine', x: 78, y: 24 },
      { id: 'lm_astral_isles_5', name: 'Ancoradouro de Safira Boreal', kind: 'port', x: 44, y: 68 },
      { id: 'lm_astral_isles_6', name: 'Observatório Ocidental de Latão', kind: 'town', x: 14, y: 38 },
    ],
  },

  sunken_abyss: {
    id: 'sunken_abyss',
    tier: 'deep_frontier',
    parentRealmId: 'eclipse',
    factionId: 'eclipse',
    domain: 'purple',
    name: 'Fossa Submersa da Catedral Afogada',
    shortName: 'Fossa Abissal',
    cardinalTitle: 'FRONTEIRA ABISSAL OCIDENTAL • FOSSA SUBMERSA',
    subtitle: 'Basílica Afogada, Arcos de Leviatã & Porto de Fogo-Fátuo',
    icon: '🦑',
    accentColor: '#c084fc',
    imagePath: '/assets/map/vaeloria_frontier_sunken_abyss.jpg',
    worldBounds: { x: 2, y: 35, w: 11.2, h: 31 },
    worldCenter: { x: 7.5, y: 50.5 },
    portals: [
      {
        id: 'portal_abyss_to_eclipse',
        targetRealm: 'eclipse',
        label: 'Escadaria da Falésia → Vale do Eclipse',
        sublabel: 'Subida para a Costa do Ossário',
        directionIcon: '➡️',
        x: 86,
        y: 36,
        arrivalX: 14,
        arrivalY: 46,
      },
      {
        id: 'portal_abyss_to_astral_isles',
        targetRealm: 'astral_isles',
        label: 'Corrente Polar → Ilhas Astrais',
        sublabel: 'Rota dos Naufrágios Fantasmas',
        directionIcon: '⬆️',
        x: 16,
        y: 14,
        arrivalX: 16,
        arrivalY: 74,
      },
      {
        id: 'portal_abyss_to_deep_roots',
        targetRealm: 'deep_roots',
        label: 'Sifão Subterrâneo → Raízes Profundas',
        sublabel: 'Rio Oculto sob o Continente',
        directionIcon: '↘️',
        x: 78,
        y: 86,
        arrivalX: 16,
        arrivalY: 78,
      },
      {
        id: 'portal_abyss_to_capital_eclipse',
        targetRealm: 'capital_eclipse',
        label: 'Canal Fúnebre → Cais de Nocturnus',
        sublabel: 'Subida à Catedral-Necrópole',
        directionIcon: '🏰',
        x: 88,
        y: 56,
        arrivalX: 18,
        arrivalY: 80,
      },
      {
        id: 'portal_abyss_to_sea_of_storms',
        targetRealm: 'sea_of_storms',
        label: 'Vórtice Ascendente → Mar das Tormentas',
        sublabel: 'Emergência pelo Olho do Furacão',
        directionIcon: '⚓',
        x: 38,
        y: 14,
        arrivalX: 50,
        arrivalY: 53,
      },
    ],
    localLandmarks: [
      { id: 'lm_sunken_abyss_1', name: 'Porto dos Navios de Fogo-Fátuo', kind: 'port', x: 20, y: 24 },
      { id: 'lm_sunken_abyss_2', name: 'Arcada de Costelas de Leviatã', kind: 'pass', x: 55, y: 22 },
      { id: 'lm_sunken_abyss_3', name: 'Jardins de Coral Sanguíneo', kind: 'shrine', x: 26, y: 68 },
      { id: 'lm_sunken_abyss_4', name: 'Atalaia da Lanterna Carmesim', kind: 'fort', x: 28, y: 42 },
      { id: 'lm_sunken_abyss_5', name: 'Claustro dos Sinos Submersos', kind: 'ruin', x: 44, y: 64 },
      { id: 'lm_sunken_abyss_6', name: 'Entreposto dos Mergulhadores Umbrais', kind: 'town', x: 55, y: 82 },
    ],
  },

  deep_roots: {
    id: 'deep_roots',
    tier: 'deep_frontier',
    parentRealmId: 'veridia',
    factionId: 'veridia',
    domain: 'green',
    name: 'Raízes Abissais da Árvore-Mãe',
    shortName: 'Raízes Profundas',
    cardinalTitle: 'FRONTEIRA SUBTERRÂNEA DO SUL • RAÍZES ABISSAIS',
    subtitle: 'Lago de Âmbar Vivo, Fortaleza de Cipó-Ferro & Bosques Bioluminescentes',
    icon: '🍄',
    accentColor: '#34d399',
    imagePath: '/assets/map/vaeloria_frontier_deep_roots.jpg',
    worldBounds: { x: 65, y: 80.5, w: 25, h: 15 },
    worldCenter: { x: 78, y: 88 },
    portals: [
      {
        id: 'portal_roots_to_veridia',
        targetRealm: 'veridia',
        label: 'Portal Espiral → Superfície de Veridia',
        sublabel: 'Subida pelo Tronco da Árvore-Mãe',
        directionIcon: '⬆️',
        x: 49,
        y: 19,
        arrivalX: 54,
        arrivalY: 82,
      },
      {
        id: 'portal_roots_to_prismatic_crater',
        targetRealm: 'prismatic_crater',
        label: 'Veio Cristalino → Cratera Prismática',
        sublabel: 'Raízes que Tocam o Núcleo Axial',
        directionIcon: '⬅️',
        x: 11,
        y: 44,
        arrivalX: 84,
        arrivalY: 68,
      },
      {
        id: 'portal_roots_to_sunken_abyss',
        targetRealm: 'sunken_abyss',
        label: 'Rio Esmeralda Oculto → Fossa Abissal',
        sublabel: 'Passagem Aquática Subterrânea',
        directionIcon: '↙️',
        x: 14,
        y: 84,
        arrivalX: 74,
        arrivalY: 82,
      },
      {
        id: 'portal_roots_to_capital_veridia',
        targetRealm: 'capital_veridia',
        label: 'Cerne da Árvore-Mãe → Galhada Viva',
        sublabel: 'Ascensão Direta à Cidadela da Copa',
        directionIcon: '🏰',
        x: 56,
        y: 24,
        arrivalX: 54,
        arrivalY: 56,
      },
    ],
    localLandmarks: [
      { id: 'lm_deep_roots_1', name: 'Templo de Jade Engolido pelas Raízes', kind: 'ruin', x: 22, y: 28 },
      { id: 'lm_deep_roots_2', name: 'Bosque dos Fungos Luminescentes', kind: 'shrine', x: 28, y: 78 },
      { id: 'lm_deep_roots_3', name: 'Pontes Suspensas da Seiva Dourada', kind: 'pass', x: 62, y: 44 },
      { id: 'lm_deep_roots_4', name: 'Aldeia dos Guardiões de Esporos', kind: 'town', x: 38, y: 46 },
      { id: 'lm_deep_roots_5', name: 'Platô da Ossada Primordial', kind: 'fort', x: 84, y: 40 },
      { id: 'lm_deep_roots_6', name: 'Cais do Lago de Âmbar Líquido', kind: 'port', x: 56, y: 68 },
    ],
  },

  sky_bastions: {
    id: 'sky_bastions',
    tier: 'deep_frontier',
    parentRealmId: 'solaria',
    factionId: 'solaria',
    domain: 'gold',
    name: 'Bastilhas Celestes do Zênite',
    shortName: 'Bastilhas Celestes',
    cardinalTitle: 'FRONTEIRA CELESTE ORIENTAL • BASTILHAS DO ZÊNITE',
    subtitle: 'Catedral dos Espelhos, Ilhas Flutuantes & Docas das Armadas',
    icon: '🌤️',
    accentColor: '#facc15',
    imagePath: '/assets/map/vaeloria_frontier_sky_bastions.jpg',
    worldBounds: { x: 81.5, y: 59, w: 16.5, h: 18.5 },
    worldCenter: { x: 90, y: 68.5 },
    portals: [
      {
        id: 'portal_sky_to_solaria',
        targetRealm: 'solaria',
        label: 'Escadaria Dourada → Solária',
        sublabel: 'Descida ao Grande Domo Solar',
        directionIcon: '↙️',
        x: 26,
        y: 62,
        arrivalX: 83,
        arrivalY: 56,
      },
      {
        id: 'portal_sky_to_underforge',
        targetRealm: 'underforge',
        label: 'Rota das Armadas → Infraforja',
        sublabel: 'Mergulho pelas Colunas Térmicas',
        directionIcon: '↖️',
        x: 82,
        y: 22,
        arrivalX: 84,
        arrivalY: 74,
      },
      {
        id: 'portal_sky_to_astral_isles',
        targetRealm: 'astral_isles',
        label: 'Corrente Boreal → Ilhas Astrais',
        sublabel: 'Voo sobre o Mar Setentrional',
        directionIcon: '⬆️',
        x: 38,
        y: 18,
        arrivalX: 84,
        arrivalY: 28,
      },
      {
        id: 'portal_sky_to_capital_solaria',
        targetRealm: 'capital_solaria',
        label: 'Ponte Solar → Píeres de Aethelgard',
        sublabel: 'Atracação na Cidadela Dourada',
        directionIcon: '🏰',
        x: 18,
        y: 74,
        arrivalX: 86,
        arrivalY: 36,
      },
      {
        id: 'portal_sky_to_boreal_skyway',
        targetRealm: 'boreal_skyway',
        label: 'Arco Ocidental → Corredor das Nuvens',
        sublabel: 'Rota Transcontinental das Armadas',
        directionIcon: '🐉',
        x: 14,
        y: 34,
        arrivalX: 88,
        arrivalY: 44,
      },
    ],
    localLandmarks: [
      { id: 'lm_sky_bastions_1', name: 'Santuário da Aurora Suspensa', kind: 'shrine', x: 39, y: 24 },
      { id: 'lm_sky_bastions_2', name: 'Arcos de Luz Dourada', kind: 'pass', x: 40, y: 46 },
      { id: 'lm_sky_bastions_3', name: 'Docas Imperiais das Naus-Dragão', kind: 'port', x: 76, y: 66 },
      { id: 'lm_sky_bastions_4', name: 'Torre Heliográfica Oriental', kind: 'fort', x: 78, y: 34 },
      { id: 'lm_sky_bastions_5', name: 'Vila Flutuante dos Artífices Solares', kind: 'town', x: 58, y: 58 },
      { id: 'lm_sky_bastions_6', name: 'Ruínas do Primeiro Trono Alado', kind: 'ruin', x: 18, y: 48 },
    ],
  },

  prismatic_crater: {
    id: 'prismatic_crater',
    tier: 'deep_frontier',
    parentRealmId: 'matrix',
    factionId: 'matrix',
    domain: 'neutral',
    name: 'Cratera da Fratura Prismática',
    shortName: 'Cratera Prismática',
    cardinalTitle: 'FRONTEIRA PLANAR AXIAL • CRATERA DA FRATURA',
    subtitle: 'Núcleo Pentacromático, Monólitos Partidos & Fenda Primordial',
    icon: '💎',
    accentColor: '#f472b6',
    imagePath: '/assets/map/vaeloria_frontier_prismatic_crater.jpg',
    worldBounds: { x: 4.5, y: 74, w: 25.5, h: 21.5 },
    worldCenter: { x: 17, y: 85 },
    portals: [
      {
        id: 'portal_crater_to_matrix',
        targetRealm: 'matrix',
        label: 'Escadaria Axial → Torre dos Cinco Selos',
        sublabel: 'Retorno à Fronteira Cinzenta',
        directionIcon: '⬆️',
        x: 50,
        y: 12,
        arrivalX: 50,
        arrivalY: 56,
      },
      {
        id: 'portal_crater_to_underforge',
        targetRealm: 'underforge',
        label: 'Falha Rubra → Infraforja',
        sublabel: 'Fenda Magmática Noroeste',
        directionIcon: '↖️',
        x: 24,
        y: 20,
        arrivalX: 16,
        arrivalY: 78,
      },
      {
        id: 'portal_crater_to_deep_roots',
        targetRealm: 'deep_roots',
        label: 'Túnel Esmeralda → Raízes Profundas',
        sublabel: 'Galeria Sudeste da Árvore-Mãe',
        directionIcon: '↘️',
        x: 86,
        y: 72,
        arrivalX: 16,
        arrivalY: 44,
      },
      {
        id: 'portal_crater_to_capital_axial',
        targetRealm: 'capital_axial',
        label: 'Coluna de Luz → Torre dos Cinco Selos',
        sublabel: 'Subida Direta à Cidade Franca Axial',
        directionIcon: '🏰',
        x: 50,
        y: 26,
        arrivalX: 50,
        arrivalY: 58,
      },
    ],
    localLandmarks: [
      { id: 'lm_prismatic_crater_1', name: 'Monólito Carmesim da Refração', kind: 'shrine', x: 30, y: 26 },
      { id: 'lm_prismatic_crater_2', name: 'Monólito Ametista do Véu', kind: 'ruin', x: 72, y: 26 },
      { id: 'lm_prismatic_crater_3', name: 'Passarela Ocidental de Ley Safira', kind: 'pass', x: 16, y: 48 },
      { id: 'lm_prismatic_crater_4', name: 'Passarela Oriental de Ley Solar', kind: 'pass', x: 84, y: 48 },
      { id: 'lm_prismatic_crater_5', name: 'Acampamento dos Cartógrafos da Fenda', kind: 'town', x: 35, y: 69 },
      { id: 'lm_prismatic_crater_6', name: 'Bastião dos Oito Raios Partidos', kind: 'fort', x: 65, y: 69 },
    ],
  },

  // =========================================================================
  // OS 2 CORREDORES TRANSCONTINENTAIS (3ª ESCALA • NÁUTICO & CELESTE)
  // =========================================================================

  sea_of_storms: {
    id: 'sea_of_storms',
    tier: 'transit_corridor',
    factionId: 'vortex',
    domain: 'blue',
    name: 'Mar Interior das Tormentas & Estreito das Frotas',
    shortName: 'Mar das Tormentas',
    cardinalTitle: 'CARTA NÁUTICA TRANSCONTINENTAL • MAR DAS TORMENTAS',
    subtitle: 'Vórtice Bioluminescente, Faróis-Fortaleza, Ossadas de Leviatã & Rotas de Comboio',
    icon: '⚓',
    accentColor: '#22d3ee',
    imagePath: '/assets/map/vaeloria_corridor_sea_storms.jpg',
    worldBounds: { x: 12, y: 24, w: 76, h: 66 },
    worldCenter: { x: 50, y: 58 },
    portals: [
      {
        id: 'portal_sea_to_vortex',
        targetRealm: 'vortex',
        label: 'Fiordes Setentrionais → Vórtex Polar',
        sublabel: 'Quebra-Gelos rumo a Cristália',
        directionIcon: '⬆️',
        x: 20,
        y: 13,
        arrivalX: 24,
        arrivalY: 82,
      },
      {
        id: 'portal_sea_to_eclipse',
        targetRealm: 'eclipse',
        label: 'Falésias Ósseas → Vale do Eclipse',
        sublabel: 'Atracação no Ossário da Costa',
        directionIcon: '⬅️',
        x: 11,
        y: 55,
        arrivalX: 14,
        arrivalY: 75,
      },
      {
        id: 'portal_sea_to_veridia',
        targetRealm: 'veridia',
        label: 'Atóis Esmeralda → Sul de Veridia',
        sublabel: 'Entrada pelo Delta de Jade',
        directionIcon: '⬇️',
        x: 41,
        y: 90,
        arrivalX: 24,
        arrivalY: 85,
      },
      {
        id: 'portal_sea_to_solaria',
        targetRealm: 'solaria',
        label: 'Porto Dourado → Costa de Solária',
        sublabel: 'Subida às Falésias da Alvorada',
        directionIcon: '➡️',
        x: 86,
        y: 50,
        arrivalX: 80,
        arrivalY: 80,
      },
      {
        id: 'portal_sea_to_sunken_abyss',
        targetRealm: 'sunken_abyss',
        label: 'Olho do Maelstrom → Fossa Submersa',
        sublabel: 'Mergulho Abissal à Basílica Afogada',
        directionIcon: '🦑',
        x: 50,
        y: 53,
        arrivalX: 24,
        arrivalY: 28,
      },
      {
        id: 'portal_sea_to_astral_isles',
        targetRealm: 'astral_isles',
        label: 'Passagem Boreal → Ilhas Astrais',
        sublabel: 'Rota das Estrelas Mortas',
        directionIcon: '🌌',
        x: 52,
        y: 11,
        arrivalX: 46,
        arrivalY: 72,
      },
      {
        id: 'portal_sea_to_capital_vortex',
        targetRealm: 'capital_vortex',
        label: 'Canal Quebra-Gelo → Cristália',
        sublabel: '4ª Escala • Eclusas da Capital Polar',
        directionIcon: '🏰',
        x: 31,
        y: 15,
        arrivalX: 21,
        arrivalY: 80,
      },
      {
        id: 'portal_sea_to_capital_eclipse',
        targetRealm: 'capital_eclipse',
        label: 'Estreito Umbral → Nocturnus',
        sublabel: '4ª Escala • Cais da Catedral-Necrópole',
        directionIcon: '🏰',
        x: 18,
        y: 44,
        arrivalX: 12,
        arrivalY: 68,
      },
      {
        id: 'portal_sea_to_capital_veridia',
        targetRealm: 'capital_veridia',
        label: 'Foz do Rio de Jade → Galhada Viva',
        sublabel: '4ª Escala • Porto das Raízes da Capital',
        directionIcon: '🏰',
        x: 52,
        y: 88,
        arrivalX: 34,
        arrivalY: 78,
      },
      {
        id: 'portal_sea_to_capital_axial',
        targetRealm: 'capital_axial',
        label: 'Canal Mercante → Cidade Franca Axial',
        sublabel: '4ª Escala • Doca das Cinco Embaixadas',
        directionIcon: '🏰',
        x: 64,
        y: 74,
        arrivalX: 15,
        arrivalY: 80,
      },
    ],
    localLandmarks: [
      { id: 'lm_sea_storms_1', name: 'Farol Vulcânico do Nordeste', kind: 'fort', x: 66, y: 28 },
      { id: 'lm_sea_storms_2', name: 'Farol dos Recifes Sudoeste', kind: 'fort', x: 33, y: 64 },
      { id: 'lm_sea_storms_3', name: 'Arcada do Crânio de Leviatã', kind: 'ruin', x: 37, y: 34 },
      { id: 'lm_sea_storms_4', name: 'Enseada Couraçada Oriental', kind: 'port', x: 80, y: 18 },
      { id: 'lm_sea_storms_5', name: 'Laguna dos Corsários de Coral', kind: 'town', x: 76, y: 89 },
      { id: 'lm_sea_storms_6', name: 'Santuário da Bússola Submersa', kind: 'shrine', x: 64, y: 64 },
    ],
  },

  boreal_skyway: {
    id: 'boreal_skyway',
    tier: 'transit_corridor',
    factionId: 'solaria',
    domain: 'gold',
    name: 'Corredor Boreal das Nuvens & Correntes Dracônicas',
    shortName: 'Corredor das Nuvens',
    cardinalTitle: 'CARTA ALTIMÉTRICA CELESTE • CORREDOR BOREAL DAS NUVENS',
    subtitle: 'Viadutos Suspensos, Espirais de Ley Eólica, Poleiros de Dragões & Relés Celestes',
    icon: '🐉',
    accentColor: '#fde047',
    imagePath: '/assets/map/vaeloria_corridor_skyway.jpg',
    worldBounds: { x: 22, y: 10, w: 66, h: 48 },
    worldCenter: { x: 58, y: 28 },
    portals: [
      {
        id: 'portal_skyway_to_pyros',
        targetRealm: 'pyros',
        label: 'Cristas Térmicas → Pyros Vulcânico',
        sublabel: 'Descida pelos Poleiros de Dragões',
        directionIcon: '🔥',
        x: 22,
        y: 22,
        arrivalX: 80,
        arrivalY: 20,
      },
      {
        id: 'portal_skyway_to_vortex',
        targetRealm: 'vortex',
        label: 'Relé Setentrional → Vórtex Polar',
        sublabel: 'Pouso nas Agulhas de Safira',
        directionIcon: '❄️',
        x: 50,
        y: 36,
        arrivalX: 82,
        arrivalY: 28,
      },
      {
        id: 'portal_skyway_to_solaria',
        targetRealm: 'solaria',
        label: 'Torre de Atracação → Leste de Solária',
        sublabel: 'Descida ao Bastião Dourado',
        directionIcon: '☀️',
        x: 78,
        y: 56,
        arrivalX: 84,
        arrivalY: 24,
      },
      {
        id: 'portal_skyway_to_sky_bastions',
        targetRealm: 'sky_bastions',
        label: 'Viaduto Oriental → Bastilhas Celestes',
        sublabel: 'Ponte Aérea rumo ao Zênite',
        directionIcon: '🌤️',
        x: 92,
        y: 44,
        arrivalX: 78,
        arrivalY: 60,
      },
      {
        id: 'portal_skyway_to_astral_isles',
        targetRealm: 'astral_isles',
        label: 'Espiral Boreal → Ilhas Astrais',
        sublabel: 'Corrente Superior da Aurora',
        directionIcon: '🌌',
        x: 68,
        y: 18,
        arrivalX: 84,
        arrivalY: 26,
      },
      {
        id: 'portal_skyway_to_capital_pyros',
        targetRealm: 'capital_pyros',
        label: 'Mergulho Térmico → Vulcanor',
        sublabel: '4ª Escala • Poleiros da Caldeira Imperial',
        directionIcon: '🏰',
        x: 34,
        y: 20,
        arrivalX: 79,
        arrivalY: 24,
      },
      {
        id: 'portal_skyway_to_capital_solaria',
        targetRealm: 'capital_solaria',
        label: 'Ponte de Luz → Aethelgard',
        sublabel: '4ª Escala • Píeres Celestes da Capital',
        directionIcon: '🏰',
        x: 78,
        y: 72,
        arrivalX: 79,
        arrivalY: 20,
      },
    ],
    localLandmarks: [
      { id: 'lm_skyway_1', name: 'Cidadela-Relé do Meio-Céu', kind: 'fort', x: 50, y: 38 },
      { id: 'lm_skyway_2', name: 'Viaduto Imperial das Nuvens', kind: 'pass', x: 33, y: 74 },
      { id: 'lm_skyway_3', name: 'Bastião de Atracação das Armadas', kind: 'port', x: 78, y: 58 },
      { id: 'lm_skyway_4', name: 'Picos da Revoada Escarlate', kind: 'shrine', x: 20, y: 24 },
      { id: 'lm_skyway_5', name: 'Vórtice Eólico de Ley Celeste', kind: 'shrine', x: 64, y: 76 },
      { id: 'lm_skyway_6', name: 'Ruínas da Ponte Alada Antiga', kind: 'ruin', x: 61, y: 45 },
    ],
  },

  // =========================================================================
  // AS 6 CIDADELAS-CAPITAIS IMPERIAIS (4ª ESCALA • PLANTA URBANA & TÁTICA)
  // =========================================================================

  capital_veridia: {
    id: 'capital_veridia',
    tier: 'imperial_capital',
    parentRealmId: 'veridia',
    factionId: 'veridia',
    domain: 'green',
    name: 'Galhada Viva — Cidadela da Árvore-Mãe',
    shortName: 'Galhada Viva',
    cardinalTitle: 'PLANTA IMPERIAL (4ª ESCALA) • GALHADA VIVA, CAPITAL DE VERIDIA',
    subtitle: 'Anéis Suspensos da Árvore-Mãe, Porto de Raízes, Círculo Druídico & Arquivo de Âmbar',
    icon: '🏰',
    accentColor: '#10b981',
    imagePath: '/assets/map/vaeloria_capital_veridia.jpg',
    worldBounds: { x: 46, y: 65, w: 8, h: 7 },
    worldCenter: { x: 50, y: 68.5 },
    portals: [
      {
        id: 'portal_cap_veridia_to_veridia',
        targetRealm: 'veridia',
        label: 'Portão de Cipó-Ferro → Reino de Veridia',
        sublabel: 'Saída para a Selva Primeva (2ª Escala)',
        directionIcon: '🌿',
        x: 31,
        y: 19,
        arrivalX: 50,
        arrivalY: 44,
      },
      {
        id: 'portal_cap_veridia_to_deep_roots',
        targetRealm: 'deep_roots',
        label: 'Escadaria de Seiva → Raízes Profundas',
        sublabel: 'Descida Direta ao Subsolo Bioluminescente',
        directionIcon: '🍄',
        x: 55,
        y: 58,
        arrivalX: 49,
        arrivalY: 22,
      },
      {
        id: 'portal_cap_veridia_to_sea_of_storms',
        targetRealm: 'sea_of_storms',
        label: 'Porto Fluvial de Jade → Mar das Tormentas',
        sublabel: 'Embarque pelas Canoas de Guerra',
        directionIcon: '⚓',
        x: 34,
        y: 78,
        arrivalX: 41,
        arrivalY: 88,
      },
    ],
    localLandmarks: [
      { id: 'lm_cap_veridia_1', name: 'Trono da Copa & Santuário Central', kind: 'shrine', x: 52, y: 34 },
      { id: 'lm_cap_veridia_2', name: 'Portão Norte de Cipó-Ferro', kind: 'fort', x: 31, y: 19 },
      { id: 'lm_cap_veridia_3', name: 'Arena dos Totens & Domadores', kind: 'fort', x: 17, y: 41 },
      { id: 'lm_cap_veridia_4', name: 'Porto das Raízes do Rio de Jade', kind: 'port', x: 36, y: 76 },
      { id: 'lm_cap_veridia_5', name: 'Círculo Megalítico das Poças de Seiva', kind: 'shrine', x: 80, y: 23 },
      { id: 'lm_cap_veridia_6', name: 'Grande Arquivo Esculpido em Âmbar', kind: 'town', x: 86, y: 60 },
    ],
  },

  capital_vortex: {
    id: 'capital_vortex',
    tier: 'imperial_capital',
    parentRealmId: 'vortex',
    factionId: 'vortex',
    domain: 'blue',
    name: 'Pináculo Polar de Cristália',
    shortName: 'Cristália',
    cardinalTitle: 'PLANTA IMPERIAL (4ª ESCALA) • CRISTÁLIA, CAPITAL DE VÓRTEX',
    subtitle: 'Grande Astrolábio de Chronos, Agulhas Refratoras, Fundição Relojoeira & Eclusas Polares',
    icon: '🏰',
    accentColor: '#38bdf8',
    imagePath: '/assets/map/vaeloria_capital_vortex.jpg',
    worldBounds: { x: 46, y: 9, w: 8, h: 7 },
    worldCenter: { x: 50, y: 12.5 },
    portals: [
      {
        id: 'portal_cap_vortex_to_vortex',
        targetRealm: 'vortex',
        label: 'Bastião Boreal → Reino de Vórtex',
        sublabel: 'Saída para os Fiordes Polares (2ª Escala)',
        directionIcon: '❄️',
        x: 65,
        y: 82,
        arrivalX: 50,
        arrivalY: 33,
      },
      {
        id: 'portal_cap_vortex_to_astral_isles',
        targetRealm: 'astral_isles',
        label: 'Portal das Agulhas → Ilhas Astrais',
        sublabel: 'Salto Refractor rumo às Estrelas Mortas',
        directionIcon: '🌌',
        x: 51,
        y: 14,
        arrivalX: 56,
        arrivalY: 80,
      },
      {
        id: 'portal_cap_vortex_to_sea_of_storms',
        targetRealm: 'sea_of_storms',
        label: 'Eclusa dos Quebra-Gelos → Mar das Tormentas',
        sublabel: 'Zarpada Naval para o Sul',
        directionIcon: '⚓',
        x: 21,
        y: 80,
        arrivalX: 20,
        arrivalY: 16,
      },
    ],
    localLandmarks: [
      { id: 'lm_cap_vortex_1', name: 'Domo do Grande Astrolábio Imperial', kind: 'shrine', x: 51, y: 44 },
      { id: 'lm_cap_vortex_2', name: 'Coroa das Agulhas de Safira Pura', kind: 'shrine', x: 51, y: 15 },
      { id: 'lm_cap_vortex_3', name: 'Bairro das Engrenagens & Relojoaria Bélica', kind: 'town', x: 81, y: 48 },
      { id: 'lm_cap_vortex_4', name: 'Claustro da Biblioteca Congelada', kind: 'ruin', x: 21, y: 41 },
      { id: 'lm_cap_vortex_5', name: 'Eclusas & Docas dos Quebra-Gelos', kind: 'port', x: 21, y: 79 },
      { id: 'lm_cap_vortex_6', name: 'Portão Couraçado da Muralha Boreal', kind: 'fort', x: 65, y: 81 },
    ],
  },

  capital_solaria: {
    id: 'capital_solaria',
    tier: 'imperial_capital',
    parentRealmId: 'solaria',
    factionId: 'solaria',
    domain: 'gold',
    name: 'Bastião Dourado de Aethelgard',
    shortName: 'Aethelgard',
    cardinalTitle: 'PLANTA IMPERIAL (4ª ESCALA) • AETHELGARD, CAPITAL DE SOLÁRIA',
    subtitle: 'Catedral do Sol Invicto, Matriz de Espelhos Heliostáticos, Docas Celestes & Sete Terraços',
    icon: '🏰',
    accentColor: '#eab308',
    imagePath: '/assets/map/vaeloria_capital_solaria.jpg',
    worldBounds: { x: 71, y: 40, w: 8, h: 7 },
    worldCenter: { x: 75, y: 43.5 },
    portals: [
      {
        id: 'portal_cap_solaria_to_solaria',
        targetRealm: 'solaria',
        label: 'Viaduto de Mármore → Reino de Solária',
        sublabel: 'Saída para os Planaltos Dourados (2ª Escala)',
        directionIcon: '☀️',
        x: 34,
        y: 84,
        arrivalX: 48,
        arrivalY: 44,
      },
      {
        id: 'portal_cap_solaria_to_sky_bastions',
        targetRealm: 'sky_bastions',
        label: 'Píer das Galés Celestes → Bastilhas do Zênite',
        sublabel: 'Voo Direto às Ilhas Suspensas',
        directionIcon: '🌤️',
        x: 88,
        y: 36,
        arrivalX: 28,
        arrivalY: 60,
      },
      {
        id: 'portal_cap_solaria_to_boreal_skyway',
        targetRealm: 'boreal_skyway',
        label: 'Torre de Sinalização → Corredor das Nuvens',
        sublabel: 'Rota Transcontinental das Armadas',
        directionIcon: '🐉',
        x: 79,
        y: 18,
        arrivalX: 78,
        arrivalY: 56,
      },
    ],
    localLandmarks: [
      { id: 'lm_cap_solaria_1', name: 'Basílica Dourada & Praça do Tribunal', kind: 'shrine', x: 48, y: 25 },
      { id: 'lm_cap_solaria_2', name: 'Matriz dos Espelhos Heliostáticos', kind: 'shrine', x: 71, y: 35 },
      { id: 'lm_cap_solaria_3', name: 'Píeres Suspensos das Galés Celestes', kind: 'port', x: 88, y: 36 },
      { id: 'lm_cap_solaria_4', name: 'Quartéis & Forjas da Legião Dourada', kind: 'fort', x: 19, y: 44 },
      { id: 'lm_cap_solaria_5', name: 'Aquedutos & Jardins em Cascata', kind: 'pass', x: 31, y: 74 },
      { id: 'lm_cap_solaria_6', name: 'Terraço Mercantil da Alvorada', kind: 'town', x: 52, y: 58 },
    ],
  },

  capital_eclipse: {
    id: 'capital_eclipse',
    tier: 'imperial_capital',
    parentRealmId: 'eclipse',
    factionId: 'eclipse',
    domain: 'purple',
    name: 'Catedral-Necrópole de Nocturnus',
    shortName: 'Nocturnus',
    cardinalTitle: 'PLANTA IMPERIAL (4ª ESCALA) • NOCTURNUS, CAPITAL DO ECLIPSE',
    subtitle: 'Alta Catedral de Obsidiana, Criptas de Marfim, Aqueduto Carmesim & Cais dos Barqueiros',
    icon: '🏰',
    accentColor: '#a855f7',
    imagePath: '/assets/map/vaeloria_capital_eclipse.jpg',
    worldBounds: { x: 25, y: 50, w: 8, h: 7 },
    worldCenter: { x: 29, y: 53.5 },
    portals: [
      {
        id: 'portal_cap_eclipse_to_eclipse',
        targetRealm: 'eclipse',
        label: 'Portão dos Cavaleiros → Vale do Eclipse',
        sublabel: 'Saída para as Terras Umbrais (2ª Escala)',
        directionIcon: '💀',
        x: 78,
        y: 82,
        arrivalX: 51,
        arrivalY: 42,
      },
      {
        id: 'portal_cap_eclipse_to_sunken_abyss',
        targetRealm: 'sunken_abyss',
        label: 'Cais Subterrâneo → Fossa Submersa',
        sublabel: 'Barcaça Fúnebre rumo à Catedral Afogada',
        directionIcon: '🦑',
        x: 15,
        y: 82,
        arrivalX: 82,
        arrivalY: 36,
      },
      {
        id: 'portal_cap_eclipse_to_sea_of_storms',
        targetRealm: 'sea_of_storms',
        label: 'Canal Sombrio → Mar das Tormentas',
        sublabel: 'Saída Naval dos Corsários Negros',
        directionIcon: '⚓',
        x: 8,
        y: 68,
        arrivalX: 14,
        arrivalY: 56,
      },
    ],
    localLandmarks: [
      { id: 'lm_cap_eclipse_1', name: 'Alta Catedral de Obsidiana & Campanário', kind: 'shrine', x: 47, y: 38 },
      { id: 'lm_cap_eclipse_2', name: 'Criptas Reais de Marfim Antigo', kind: 'ruin', x: 16, y: 18 },
      { id: 'lm_cap_eclipse_3', name: 'Aqueduto Carmesim & Destilaria Alquímica', kind: 'pass', x: 84, y: 16 },
      { id: 'lm_cap_eclipse_4', name: 'Claustro dos Corvos & Arquivo Proibido', kind: 'town', x: 84, y: 52 },
      { id: 'lm_cap_eclipse_5', name: 'Cais Abissal dos Barqueiros', kind: 'port', x: 15, y: 80 },
      { id: 'lm_cap_eclipse_6', name: 'Bastião da Guarda Sangue-Negro', kind: 'fort', x: 78, y: 82 },
    ],
  },

  capital_pyros: {
    id: 'capital_pyros',
    tier: 'imperial_capital',
    parentRealmId: 'pyros',
    factionId: 'pyros',
    domain: 'red',
    name: 'Caldeira Imperial de Vulcanor',
    shortName: 'Vulcanor',
    cardinalTitle: 'PLANTA IMPERIAL (4ª ESCALA) • VULCANOR, CAPITAL DE PYROS',
    subtitle: 'Grande Bigorna Real, Comportas de Lava, Fundições de Guerra & Poleiros de Wyverns',
    icon: '🏰',
    accentColor: '#ef4444',
    imagePath: '/assets/map/vaeloria_capital_pyros.jpg',
    worldBounds: { x: 47, y: 18, w: 8, h: 7 },
    worldCenter: { x: 51, y: 21.5 },
    portals: [
      {
        id: 'portal_cap_pyros_to_pyros',
        targetRealm: 'pyros',
        label: 'Ponte Levadiça Sul → Reino de Pyros',
        sublabel: 'Saída para a Cordilheira Vulcânica (2ª Escala)',
        directionIcon: '🔥',
        x: 51,
        y: 86,
        arrivalX: 50,
        arrivalY: 44,
      },
      {
        id: 'portal_cap_pyros_to_underforge',
        targetRealm: 'underforge',
        label: 'Fosso da Bigorna → Infraforja de Ignaroth',
        sublabel: 'Elevador de Correntes ao Subsolo Magmático',
        directionIcon: '⚒️',
        x: 52,
        y: 52,
        arrivalX: 72,
        arrivalY: 24,
      },
      {
        id: 'portal_cap_pyros_to_boreal_skyway',
        targetRealm: 'boreal_skyway',
        label: 'Poleiros Imperiais → Corredor das Nuvens',
        sublabel: 'Decolagem das Hostes Dracônicas',
        directionIcon: '🐉',
        x: 79,
        y: 22,
        arrivalX: 22,
        arrivalY: 22,
      },
    ],
    localLandmarks: [
      { id: 'lm_cap_pyros_1', name: 'Bastião da Grande Bigorna Imperial', kind: 'shrine', x: 51, y: 35 },
      { id: 'lm_cap_pyros_2', name: 'Represa & Comportas de Magma Noroeste', kind: 'pass', x: 21, y: 22 },
      { id: 'lm_cap_pyros_3', name: 'Altos-Fornos & Fundições de Cerco', kind: 'town', x: 17, y: 58 },
      { id: 'lm_cap_pyros_4', name: 'Agulhas & Poleiros dos Wyverns Reais', kind: 'port', x: 79, y: 24 },
      { id: 'lm_cap_pyros_5', name: 'Fosso de Gladiadores da Caldeira', kind: 'fort', x: 84, y: 69 },
      { id: 'lm_cap_pyros_6', name: 'Portão das Correntes sobre o Rio de Lava', kind: 'fort', x: 51, y: 85 },
    ],
  },

  capital_axial: {
    id: 'capital_axial',
    tier: 'imperial_capital',
    parentRealmId: 'matrix',
    factionId: 'matrix',
    domain: 'neutral',
    name: 'Cidade Franca & Torre dos Cinco Selos',
    shortName: 'Cidade Franca',
    cardinalTitle: 'PLANTA IMPERIAL (4ª ESCALA) • CIDADE FRANCA AXIAL & TORRE DOS SELOS',
    subtitle: 'Coliseu do Pacto, Cinco Bairros-Embaixada Pentacromáticos & Canais de Ley Convergentes',
    icon: '🏰',
    accentColor: '#e2e8f0',
    imagePath: '/assets/map/vaeloria_capital_axial.jpg',
    worldBounds: { x: 46, y: 49, w: 8, h: 7 },
    worldCenter: { x: 50, y: 52.5 },
    portals: [
      {
        id: 'portal_cap_axial_to_matrix',
        targetRealm: 'matrix',
        label: 'Portão Sul do Anel → Fronteira Cinzenta',
        sublabel: 'Saída para a Planície Axial (2ª Escala)',
        directionIcon: '☸',
        x: 50,
        y: 89,
        arrivalX: 50,
        arrivalY: 48,
      },
      {
        id: 'portal_cap_axial_to_prismatic_crater',
        targetRealm: 'prismatic_crater',
        label: 'Poço de Ley Central → Cratera Prismática',
        sublabel: 'Descida Direta ao Núcleo Partido',
        directionIcon: '💎',
        x: 50,
        y: 60,
        arrivalX: 50,
        arrivalY: 16,
      },
      {
        id: 'portal_cap_axial_to_sea_of_storms',
        targetRealm: 'sea_of_storms',
        label: 'Doca Fluvial Sudoeste → Mar das Tormentas',
        sublabel: 'Comboio Neutro das Guildas',
        directionIcon: '⚓',
        x: 13,
        y: 80,
        arrivalX: 64,
        arrivalY: 64,
      },
    ],
    localLandmarks: [
      { id: 'lm_cap_axial_1', name: 'Torre dos Cinco Selos & Coliseu do Pacto', kind: 'shrine', x: 50, y: 45 },
      { id: 'lm_cap_axial_2', name: 'Embaixada Rubra das Forjas (Setor NO)', kind: 'fort', x: 30, y: 24 },
      { id: 'lm_cap_axial_3', name: 'Embaixada Safira do Conclave (Setor NE)', kind: 'shrine', x: 69, y: 23 },
      { id: 'lm_cap_axial_4', name: 'Embaixada Dourada & Casa da Moeda (Setor L)', kind: 'town', x: 82, y: 53 },
      { id: 'lm_cap_axial_5', name: 'Embaixada Esmeralda dos Jardins (Setor S)', kind: 'town', x: 49, y: 77 },
      { id: 'lm_cap_axial_6', name: 'Embaixada Umbral das Sombras (Setor O)', kind: 'ruin', x: 17, y: 52 },
    ],
  },
};

/**
 * Coordenadas calibradas diretamente sobre as 6 artes cartográficas regionais (16:9)
 * para todos os 26 Chefes da Campanha + 9 Etapas da Expedição!
 */
export const STAGE_REGIONAL_COORDS: Record<
  string,
  { realm: VaeloriaRealmId; rx: number; ry: number }
> = {
  // === VERIDIA (Sul) ===
  boss_stage_1_goblin_king: { realm: 'veridia', rx: 26, ry: 24 },
  boss_stage_16_thousand_shields: { realm: 'veridia', rx: 50, ry: 48 },
  exp_boss_1: { realm: 'veridia', rx: 22, ry: 72 },
  exp_boss_8_valkyra: { realm: 'veridia', rx: 50, ry: 48 },

  // === VÓRTEX (Polos) ===
  boss_stage_2_storm_oracle: { realm: 'vortex', rx: 73, ry: 72 },
  boss_stage_13_chronomancer: { realm: 'vortex', rx: 50, ry: 36 },
  boss_stage_17_abyssal_chimera: { realm: 'vortex', rx: 23, ry: 29 },
  boss_stage_19_astral_cataclysm: { realm: 'vortex', rx: 28, ry: 66 },
  exp_boss_2: { realm: 'vortex', rx: 73, ry: 72 },
  exp_boss_6: { realm: 'vortex', rx: 50, ry: 36 },

  // === SOLÁRIA (Leste) ===
  boss_stage_3_solar_arbiter: { realm: 'solaria', rx: 48, ry: 46 },
  boss_stage_4_solar_wild: { realm: 'solaria', rx: 23, ry: 72 },
  boss_stage_10_eternal_reliquary: { realm: 'solaria', rx: 28, ry: 20 },
  boss_stage_22_eclipse_zenith_armada: { realm: 'solaria', rx: 85, ry: 28 },
  exp_boss_3: { realm: 'solaria', rx: 48, ry: 46 },

  // === VALE DO ECLIPSE (Oeste) ===
  boss_stage_5_lich_emperor: { realm: 'eclipse', rx: 26, ry: 22 },
  boss_stage_7_eternal_rot: { realm: 'eclipse', rx: 76, ry: 78 },
  boss_stage_8_iron_inquisition: { realm: 'eclipse', rx: 51, ry: 45 },
  boss_stage_11_blood_moon: { realm: 'eclipse', rx: 27, ry: 75 },
  boss_stage_18_crimson_sun: { realm: 'eclipse', rx: 83, ry: 21 },
  exp_boss_4: { realm: 'eclipse', rx: 51, ry: 45 },

  // === PYROS (Norte Vulcânico) ===
  boss_stage_6_storm_dragon: { realm: 'pyros', rx: 25, ry: 21 },
  boss_stage_5_crater_tyrant: { realm: 'pyros', rx: 22, ry: 52 },
  boss_stage_12_draconic_council: { realm: 'pyros', rx: 77, ry: 60 },
  boss_stage_15_siege_battery: { realm: 'pyros', rx: 88, ry: 56 },
  boss_stage_21_crater_armada: { realm: 'pyros', rx: 78, ry: 22 },
  boss_stage_24_primal_volcanic_wheels: { realm: 'pyros', rx: 50, ry: 46 },
  exp_boss_5: { realm: 'pyros', rx: 22, ry: 52 },
  exp_boss_7_armada: { realm: 'pyros', rx: 78, ry: 22 },

  // === FRONTEIRA CINZENTA / MATRIZ AXIAL (Centro) ===
  boss_stage_6_valkyra: { realm: 'matrix', rx: 22, ry: 22 },
  boss_stage_20_supreme_valkyra: { realm: 'matrix', rx: 77, ry: 22 },
  boss_stage_23_refraction_triad: { realm: 'matrix', rx: 20, ry: 72 },
  boss_stage_25_celestial_funeral_wheels: { realm: 'matrix', rx: 84, ry: 73 },
  boss_stage_26_vaelkor_supreme_wheel: { realm: 'matrix', rx: 50, ry: 50 },
  exp_boss_9_vaelkor: { realm: 'matrix', rx: 50, ry: 50 },

  // === ATO VII: OS TRONOS ALÉM DO VÉU (6 FRONTEIRAS PROFUNDAS) ===
  boss_stage_27_underforge_colossus: { realm: 'underforge', rx: 51, ry: 48 },
  boss_stage_28_astral_leviathan: { realm: 'astral_isles', rx: 31, ry: 49 },
  boss_stage_29_drowned_patriarch: { realm: 'sunken_abyss', rx: 53, ry: 52 },
  boss_stage_30_amber_progenitor: { realm: 'deep_roots', rx: 50, ry: 56 },
  boss_stage_31_zenith_seraph: { realm: 'sky_bastions', rx: 55, ry: 36 },
  boss_stage_32_fracture_architect: { realm: 'prismatic_crater', rx: 50, ry: 50 },
};

/**
 * Coordenadas calibradas sobre as 12 artes cartográficas regionais e de fronteira (16:9)
 * para as 48 Províncias da Conquista Continental (5 por Reino Cardinal + 3 por Fronteira Profunda)!
 */
export const PROVINCE_REGIONAL_COORDS: Record<
  string,
  { realm: VaeloriaRealmId; rx: number; ry: number }
> = {
  // 1. Vórtex
  prov_vortex_polar_spire: { realm: 'vortex', rx: 50, ry: 36 },
  prov_vortex_west_isles: { realm: 'vortex', rx: 23, ry: 29 },
  prov_vortex_dead_stars: { realm: 'vortex', rx: 28, ry: 66 },
  prov_vortex_glass_spires: { realm: 'vortex', rx: 81, ry: 38 },
  prov_vortex_sapphire_monolith: { realm: 'vortex', rx: 73, ry: 72 },

  // 2. Pyros
  prov_pyros_split_anvil: { realm: 'pyros', rx: 50, ry: 46 },
  prov_pyros_runic_ridge: { realm: 'pyros', rx: 25, ry: 21 },
  prov_pyros_west_caldera: { realm: 'pyros', rx: 22, ry: 52 },
  prov_pyros_sky_corridor: { realm: 'pyros', rx: 78, ry: 22 },
  prov_pyros_east_crater: { realm: 'pyros', rx: 81, ry: 60 },

  // 3. Vale do Eclipse
  prov_eclipse_obsidian_cathedral: { realm: 'eclipse', rx: 51, ry: 45 },
  prov_eclipse_abyssal_gorge: { realm: 'eclipse', rx: 26, ry: 22 },
  prov_eclipse_twilight_scarp: { realm: 'eclipse', rx: 83, ry: 21 },
  prov_eclipse_blood_ossuary: { realm: 'eclipse', rx: 27, ry: 75 },
  prov_eclipse_black_marsh: { realm: 'eclipse', rx: 76, ry: 78 },

  // 4. Fronteira Cinzenta (Matriz)
  prov_matrix_five_seals: { realm: 'matrix', rx: 50, ry: 50 },
  prov_matrix_nw_monolith: { realm: 'matrix', rx: 22, ry: 22 },
  prov_matrix_ne_prism: { realm: 'matrix', rx: 77, ry: 22 },
  prov_matrix_west_ring: { realm: 'matrix', rx: 20, ry: 72 },
  prov_matrix_east_tribunal: { realm: 'matrix', rx: 84, ry: 73 },

  // 5. Solária
  prov_solaria_great_dome: { realm: 'solaria', rx: 48, ry: 46 },
  prov_solaria_eternal_reliquary: { realm: 'solaria', rx: 28, ry: 20 },
  prov_solaria_dragon_gates: { realm: 'solaria', rx: 17, ry: 38 },
  prov_solaria_zenith_mirrors: { realm: 'solaria', rx: 85, ry: 28 },
  prov_solaria_hanging_gardens: { realm: 'solaria', rx: 23, ry: 72 },

  // 6. Veridia
  prov_veridia_mother_tree: { realm: 'veridia', rx: 50, ry: 48 },
  prov_veridia_thorn_woods: { realm: 'veridia', rx: 26, ry: 24 },
  prov_veridia_jade_delta: { realm: 'veridia', rx: 83, ry: 26 },
  prov_veridia_fang_peninsula: { realm: 'veridia', rx: 22, ry: 72 },
  prov_veridia_emerald_canopy: { realm: 'veridia', rx: 69, ry: 77 },

  // 7. Infraforja Magmática (Fronteira Subterrânea de Pyros)
  prov_underforge_dragon_anvil: { realm: 'underforge', rx: 51, ry: 48 },
  prov_underforge_slag_cataracts: { realm: 'underforge', rx: 22, ry: 54 },
  prov_underforge_basalt_crucible: { realm: 'underforge', rx: 76, ry: 56 },

  // 8. Arquipélago Astral (Fronteira Marítima de Vórtex)
  prov_astral_maelstrom_eye: { realm: 'astral_isles', rx: 31, ry: 49 },
  prov_astral_chronos_beacon: { realm: 'astral_isles', rx: 56, ry: 23 },
  prov_astral_starwreck_reef: { realm: 'astral_isles', rx: 74, ry: 52 },

  // 9. Fossa Submersa (Fronteira Abissal do Eclipse)
  prov_abyss_drowned_basilica: { realm: 'sunken_abyss', rx: 53, ry: 52 },
  prov_abyss_ghostfire_harbor: { realm: 'sunken_abyss', rx: 22, ry: 28 },
  prov_abyss_leviathan_ribs: { realm: 'sunken_abyss', rx: 68, ry: 68 },

  // 10. Raízes Abissais (Fronteira Subterrânea de Veridia)
  prov_roots_amber_heart: { realm: 'deep_roots', rx: 50, ry: 56 },
  prov_roots_spore_sanctuary: { realm: 'deep_roots', rx: 24, ry: 64 },
  prov_roots_ironwood_bastion: { realm: 'deep_roots', rx: 74, ry: 45 },

  // 11. Bastilhas Celestes (Fronteira Aérea de Solária)
  prov_sky_mirror_cathedral: { realm: 'sky_bastions', rx: 55, ry: 36 },
  prov_sky_alabaster_citadel: { realm: 'sky_bastions', rx: 22, ry: 34 },
  prov_sky_armada_docks: { realm: 'sky_bastions', rx: 80, ry: 60 },

  // 12. Cratera Prismática (Fronteira Planar da Matriz)
  prov_crater_shattered_core: { realm: 'prismatic_crater', rx: 50, ry: 50 },
  prov_crater_sapphire_fault: { realm: 'prismatic_crater', rx: 24, ry: 46 },
  prov_crater_solar_monoliths: { realm: 'prismatic_crater', rx: 76, ry: 46 },
};

export function mapTerritoryIdToRealmId(territoryId: string): VaeloriaRealmId {
  if (territoryId === 'territory_vortex') return 'vortex';
  if (territoryId === 'territory_pyros') return 'pyros';
  if (territoryId === 'territory_eclipse') return 'eclipse';
  if (territoryId === 'territory_solaria') return 'solaria';
  if (territoryId === 'territory_veridia') return 'veridia';
  return 'matrix';
}

export function resolveNearestRealmFromWorldCoords(wx: number, wy: number): VaeloriaRealmId {
  // Check if coordinates fall inside one of the 6 Deep Frontier outer enclaves first
  for (const fid of VAELORIA_DEEP_FRONTIERS) {
    const b = VAELORIA_REGIONAL_MAPS[fid].worldBounds;
    if (wx >= b.x && wx <= b.x + b.w && wy >= b.y && wy <= b.y + b.h) {
      return fid;
    }
  }
  let bestRealm: VaeloriaRealmId = 'matrix';
  let bestDist = Infinity;
  for (const rid of VAELORIA_CARDINAL_REALMS) {
    const c = VAELORIA_REGIONAL_MAPS[rid].worldCenter;
    const d = Math.hypot(wx - c.x, wy - c.y);
    if (d < bestDist) {
      bestDist = d;
      bestRealm = rid;
    }
  }
  return bestRealm;
}

/**
 * Projeções Táticas Secundárias para as 6 Cidadelas-Capitais (4ª Escala) e 2 Corredores (3ª Escala):
 * Permite desafiar Soberanos Imperiais, Frotas Navais e Armadas Celestes diretamente nos novos mapas!
 */
export const SCOPE_STAGE_PROJECTIONS: Partial<
  Record<VaeloriaRealmId, Record<string, { rx: number; ry: number }>>
> = {
  capital_veridia: {
    boss_stage_16_thousand_shields: { rx: 52, ry: 34 },
    exp_boss_8_valkyra: { rx: 52, ry: 34 },
  },
  capital_vortex: {
    boss_stage_13_chronomancer: { rx: 51, ry: 44 },
    exp_boss_6: { rx: 51, ry: 44 },
  },
  capital_solaria: {
    boss_stage_3_solar_arbiter: { rx: 48, ry: 25 },
    exp_boss_3: { rx: 48, ry: 25 },
  },
  capital_eclipse: {
    boss_stage_8_iron_inquisition: { rx: 47, ry: 38 },
    exp_boss_4: { rx: 47, ry: 38 },
  },
  capital_pyros: {
    boss_stage_24_primal_volcanic_wheels: { rx: 51, ry: 35 },
    boss_stage_12_draconic_council: { rx: 79, ry: 24 },
  },
  capital_axial: {
    boss_stage_26_vaelkor_supreme_wheel: { rx: 50, ry: 45 },
    boss_stage_20_supreme_valkyra: { rx: 69, ry: 23 },
    exp_boss_9_vaelkor: { rx: 50, ry: 45 },
  },
  sea_of_storms: {
    boss_stage_17_abyssal_chimera: { rx: 28, ry: 22 },
    boss_stage_28_astral_leviathan: { rx: 50, ry: 48 },
    boss_stage_29_drowned_patriarch: { rx: 26, ry: 72 },
    boss_stage_11_blood_moon: { rx: 14, ry: 48 },
  },
  boreal_skyway: {
    boss_stage_6_storm_dragon: { rx: 24, ry: 26 },
    boss_stage_21_crater_armada: { rx: 38, ry: 68 },
    boss_stage_22_eclipse_zenith_armada: { rx: 76, ry: 54 },
    boss_stage_31_zenith_seraph: { rx: 52, ry: 36 },
    exp_boss_7_armada: { rx: 38, ry: 68 },
  },
};

export const SCOPE_PROVINCE_PROJECTIONS: Partial<
  Record<VaeloriaRealmId, Record<string, { rx: number; ry: number }>>
> = {
  capital_veridia: {
    prov_veridia_mother_tree: { rx: 52, ry: 34 },
  },
  capital_vortex: {
    prov_vortex_polar_spire: { rx: 51, ry: 44 },
  },
  capital_solaria: {
    prov_solaria_great_dome: { rx: 48, ry: 25 },
  },
  capital_eclipse: {
    prov_eclipse_obsidian_cathedral: { rx: 47, ry: 38 },
  },
  capital_pyros: {
    prov_pyros_split_anvil: { rx: 51, ry: 35 },
  },
  capital_axial: {
    prov_matrix_five_seals: { rx: 50, ry: 45 },
  },
  sea_of_storms: {
    prov_vortex_dead_stars: { rx: 22, ry: 18 },
    prov_astral_maelstrom_eye: { rx: 50, ry: 52 },
    prov_eclipse_blood_ossuary: { rx: 14, ry: 52 },
    prov_abyss_ghostfire_harbor: { rx: 28, ry: 70 },
    prov_veridia_fang_peninsula: { rx: 42, ry: 88 },
    prov_veridia_jade_delta: { rx: 74, ry: 86 },
    prov_solaria_hanging_gardens: { rx: 86, ry: 66 },
    prov_solaria_zenith_mirrors: { rx: 84, ry: 32 },
  },
  boreal_skyway: {
    prov_pyros_runic_ridge: { rx: 18, ry: 34 },
    prov_pyros_sky_corridor: { rx: 34, ry: 72 },
    prov_vortex_glass_spires: { rx: 50, ry: 36 },
    prov_astral_chronos_beacon: { rx: 66, ry: 22 },
    prov_solaria_dragon_gates: { rx: 60, ry: 48 },
    prov_sky_mirror_cathedral: { rx: 78, ry: 56 },
    prov_sky_armada_docks: { rx: 90, ry: 46 },
  },
};

export interface ScopeBreadcrumbItem {
  scope: VaeloriaMapScope;
  label: string;
  icon: string;
  tierLabel: string;
}

export function getScopeBreadcrumbChain(scope: VaeloriaMapScope): ScopeBreadcrumbItem[] {
  const root: ScopeBreadcrumbItem = {
    scope: 'world',
    label: 'Continente de Vaeloria',
    icon: '🌍',
    tierLabel: '1ª Escala',
  };
  if (scope === 'world') return [root];

  const def = VAELORIA_REGIONAL_MAPS[scope];
  const chain: ScopeBreadcrumbItem[] = [root];
  if (def.parentRealmId) {
    const parent = VAELORIA_REGIONAL_MAPS[def.parentRealmId];
    chain.push({
      scope: parent.id,
      label: parent.shortName,
      icon: parent.icon,
      tierLabel: '2ª Escala',
    });
  }
  const tierLabel =
    def.tier === 'cardinal_realm'
      ? '2ª Escala • Reino'
      : def.tier === 'deep_frontier'
        ? '3ª Escala • Fronteira'
        : def.tier === 'transit_corridor'
          ? '3ª Escala • Corredor'
          : '4ª Escala • Capital';
  chain.push({
    scope: def.id,
    label: def.shortName,
    icon: def.icon,
    tierLabel,
  });
  return chain;
}

export function getMapScaleMetadata(
  scope: VaeloriaMapScope,
  zoom: number
): { tierBadge: string; rulerText: string; unitKind: 'leagues' | 'meters' } {
  const z = Math.max(1, zoom);
  if (scope === 'world') {
    const leagues = Math.max(25, Math.round(900 / z / 5) * 5);
    return {
      tierBadge: '1ª ESCALA • CARTA CONTINENTAL',
      rulerText: `0 ━━━ ${leagues} léguas imperiais`,
      unitKind: 'leagues',
    };
  }
  const def = VAELORIA_REGIONAL_MAPS[scope];
  if (def.tier === 'imperial_capital') {
    const meters = Math.max(40, Math.round(720 / z / 10) * 10);
    return {
      tierBadge: '4ª ESCALA • PLANTA URBANA & BASTIÃO',
      rulerText: `0 ━━━ ${meters} m`,
      unitKind: 'meters',
    };
  }
  if (def.tier === 'transit_corridor') {
    const leagues = Math.max(15, Math.round(520 / z / 5) * 5);
    return {
      tierBadge:
        scope === 'sea_of_storms'
          ? '3ª ESCALA • CARTA NÁUTICA'
          : '3ª ESCALA • CARTA ALTIMÉTRICA',
      rulerText: `0 ━━━ ${leagues} léguas náuticas`,
      unitKind: 'leagues',
    };
  }
  if (def.tier === 'deep_frontier') {
    const leagues = Math.max(10, Math.round(180 / z / 5) * 5);
    return {
      tierBadge: '3ª ESCALA • ENCLAVE PROFUNDO',
      rulerText: `0 ━━━ ${leagues} léguas`,
      unitKind: 'leagues',
    };
  }
  const leagues = Math.max(15, Math.round(320 / z / 5) * 5);
  return {
    tierBadge: '2ª ESCALA • ATLAS REGIONAL',
    rulerText: `0 ━━━ ${leagues} léguas`,
    unitKind: 'leagues',
  };
}

export function resolveStageRegionalPlacement(
  mode: 'campaign' | 'expedition',
  bossId: string,
  stage: number
): { realm: VaeloriaRealmId; rx: number; ry: number } {
  const direct = STAGE_REGIONAL_COORDS[bossId];
  if (direct) return direct;

  const worldNode = resolveStageMapNode(mode, bossId, stage);
  const directByCanonical = STAGE_REGIONAL_COORDS[worldNode.bossId];
  if (directByCanonical) return directByCanonical;

  if (worldNode.territoryDomain === 'green') return { realm: 'veridia', rx: 50, ry: 50 };
  if (worldNode.territoryDomain === 'blue') return { realm: 'vortex', rx: 50, ry: 40 };
  if (worldNode.territoryDomain === 'gold') return { realm: 'solaria', rx: 50, ry: 48 };
  if (worldNode.territoryDomain === 'purple') return { realm: 'eclipse', rx: 50, ry: 48 };
  if (worldNode.territoryDomain === 'red') return { realm: 'pyros', rx: 50, ry: 48 };
  return { realm: 'matrix', rx: 50, ry: 50 };
}

/**
 * Climas Geográficos Regionais de Vaeloria (aplicados nas 2 rodadas iniciais das batalhas de mapa)
 */
export const REALM_WEATHER_PRESETS: Record<
  VaeloriaRealmId,
  {
    type: ArenaWeatherType;
    domain: Domain;
    name: string;
    icon: string;
    shortDesc: string;
  }
> = {
  pyros: {
    type: 'ash_storm',
    domain: 'red',
    name: 'Tempestade de Cinzas de Pyros',
    icon: '🌋',
    shortDesc: 'Caldeiras do Norte: unidades em campo ganham +1⚔️ ATQ; cinzas aquecem o campo.',
  },
  vortex: {
    type: 'astral_blizzard',
    domain: 'blue',
    name: 'Nevasca Horológica de Vórtex',
    icon: '❄️',
    shortDesc: 'Polos Setentrionais: vento polar reduz -1⚔️ do maior inimigo e acelera o fluxo rúnico.',
  },
  eclipse: {
    type: 'umbral_eclipse',
    domain: 'purple',
    name: 'Penumbra do Vale do Eclipse',
    icon: '🌑',
    shortDesc: 'Oeste Profundo: névoa abissal drena vitalidade na abertura das rodadas.',
  },
  veridia: {
    type: 'sylvan_monsoon',
    domain: 'green',
    name: 'Brisa Vital da Árvore-Mãe',
    icon: '🌿',
    shortDesc: 'Sul Selvagem: pólen primevo regenera +1❤️ nas criaturas em campo.',
  },
  solaria: {
    type: 'solar_zenith',
    domain: 'gold',
    name: 'Fulgor do Zênite de Solária',
    icon: '☀️',
    shortDesc: 'Leste Alto: raios solares concedem +1🛡️ Armadura na Vanguarda e +1❤️ ao Soberano.',
  },
  matrix: {
    type: 'astral_convergence',
    domain: 'neutral',
    name: 'Ressonância das Cinco Linhas de Ley',
    icon: '☸',
    shortDesc: 'Centro Axial: convergência planar concede +1⚡ Essência extra na abertura.',
  },
  underforge: {
    type: 'ash_storm',
    domain: 'red',
    name: 'Fornalha Tectônica de Ignaroth',
    icon: '⚒️',
    shortDesc: 'Infraforja Profunda: vapores magmáticos concedem +1⚔️ ATQ às tropas em campo.',
  },
  astral_isles: {
    type: 'astral_blizzard',
    domain: 'blue',
    name: 'Turbilhão das Estrelas Mortas',
    icon: '🌌',
    shortDesc: 'Arquipélago Astral: maré horológica reduz -1⚔️ do maior inimigo e acelera runas.',
  },
  sunken_abyss: {
    type: 'umbral_eclipse',
    domain: 'purple',
    name: 'Pressão da Basílica Afogada',
    icon: '🦑',
    shortDesc: 'Fossa Abissal: águas negras drenam vitalidade na abertura das rodadas.',
  },
  deep_roots: {
    type: 'sylvan_monsoon',
    domain: 'green',
    name: 'Esporos de Âmbar Vivo',
    icon: '🍄',
    shortDesc: 'Raízes Profundas: névoa bioluminescente regenera +1❤️ nas criaturas em campo.',
  },
  sky_bastions: {
    type: 'solar_zenith',
    domain: 'gold',
    name: 'Coroa Solar Acima das Nuvens',
    icon: '🌤️',
    shortDesc: 'Bastilhas Celestes: luz pura concede +1🛡️ Armadura na Vanguarda e +1❤️ ao Soberano.',
  },
  prismatic_crater: {
    type: 'astral_convergence',
    domain: 'neutral',
    name: 'Tormenta Pentacromática da Fratura',
    icon: '💎',
    shortDesc: 'Cratera Prismática: o núcleo partido irradia +1⚡ Essência extra na abertura.',
  },
  sea_of_storms: {
    type: 'astral_blizzard',
    domain: 'blue',
    name: 'Vórtice Marítimo das Tormentas',
    icon: '⚓',
    shortDesc: 'Mar Interior: vendaval salgado reduz -1⚔️ do maior inimigo e acelera o fluxo rúnico.',
  },
  boreal_skyway: {
    type: 'solar_zenith',
    domain: 'gold',
    name: 'Corrente Eólica das Armadas',
    icon: '🐉',
    shortDesc: 'Corredor das Nuvens: ventos superiores concedem +1🛡️ na Vanguarda e +1❤️ ao Soberano.',
  },
  capital_veridia: {
    type: 'sylvan_monsoon',
    domain: 'green',
    name: 'Pólen Sagrado de Galhada Viva',
    icon: '🏰',
    shortDesc: 'Cidadela da Árvore-Mãe: seiva imperial regenera +1❤️ nas criaturas em campo.',
  },
  capital_vortex: {
    type: 'astral_blizzard',
    domain: 'blue',
    name: 'Ressonância do Grande Astrolábio',
    icon: '🏰',
    shortDesc: 'Cristália Polar: precisão horológica reduz -1⚔️ do maior inimigo e acelera runas.',
  },
  capital_solaria: {
    type: 'solar_zenith',
    domain: 'gold',
    name: 'Refração dos Espelhos de Aethelgard',
    icon: '🏰',
    shortDesc: 'Bastião Dourado: luz concentrada concede +1🛡️ na Vanguarda e +1❤️ ao Soberano.',
  },
  capital_eclipse: {
    type: 'umbral_eclipse',
    domain: 'purple',
    name: 'Badalar Fúnebre de Nocturnus',
    icon: '🏰',
    shortDesc: 'Catedral-Necrópole: névoa consagrada drena vitalidade inimiga na abertura.',
  },
  capital_pyros: {
    type: 'ash_storm',
    domain: 'red',
    name: 'Calor da Grande Bigorna de Vulcanor',
    icon: '🏰',
    shortDesc: 'Caldeira Imperial: fornalhas abertas concedem +1⚔️ ATQ às tropas em campo.',
  },
  capital_axial: {
    type: 'astral_convergence',
    domain: 'neutral',
    name: 'Convergência da Cidade Franca',
    icon: '🏰',
    shortDesc: 'Torre dos Cinco Selos: harmonia diplomática concede +1⚡ Essência extra na abertura.',
  },
};

/**
 * Constrói os modificadores geográficos e climáticos de arena para batalhas da Campanha ou Expedição
 */
export function buildGeographicBattleModifiers(params: {
  mode: 'campaign' | 'expedition';
  bossId: string;
  stage: number;
  overworldBuff?: OverworldFieldBuff | null;
}): ConquestBattleModifiers {
  const { mode, bossId, stage, overworldBuff } = params;
  const worldNode = resolveStageMapNode(mode, bossId, stage);
  const regPlacement = resolveStageRegionalPlacement(mode, bossId, stage);
  const realmDef = VAELORIA_REGIONAL_MAPS[regPlacement.realm];
  const weatherPreset = REALM_WEATHER_PRESETS[regPlacement.realm];

  const buffHp = overworldBuff?.bonusHp ?? 0;
  const buffEss = overworldBuff?.bonusOpeningEssence ?? 0;
  const buffArm = overworldBuff?.vanguardArmorBonus ?? 0;

  const summaryParts = [`${weatherPreset.icon} ${weatherPreset.name} (2r)`];
  if (overworldBuff) {
    summaryParts.push(`✦ ${overworldBuff.sourceLandmarkName}: ${overworldBuff.summaryLabel}`);
  }

  return {
    provinceId: `geo_${regPlacement.realm}_${bossId}`,
    provinceName: worldNode.landmarkName,
    provinceDomain: realmDef.domain,
    isDefensiveSiege: false,
    isCapitalSiege: stage === 26 || stage === 32 || (mode === 'expedition' && stage === 9),
    playerBonusHp: buffHp,
    playerBonusEssence: buffEss,
    enemyOpeningDamage: 0,
    vanguardArmorBonus: buffArm,
    relicDiscount: false,
    dragonSkyBonus: false,
    legendaryWheelBonus: false,
    bannerSummary: summaryParts.join(' • '),
    biomeRealm: regPlacement.realm,
    landmarkLabel: `${realmDef.shortName} • ${worldNode.landmarkName}`,
    initialWeather: weatherPreset.type,
    overworldBuff: overworldBuff ?? null,
  };
}
