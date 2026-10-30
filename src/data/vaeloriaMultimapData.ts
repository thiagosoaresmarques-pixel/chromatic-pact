import { Domain } from '../types/game';
import { ConquestFactionId } from './vaeloriaConquestData';
import { resolveStageMapNode } from './vaeloriaMapData';

export type VaeloriaRealmId =
  | 'veridia'
  | 'eclipse'
  | 'matrix'
  | 'solaria'
  | 'pyros'
  | 'vortex';

export type VaeloriaMapScope = 'world' | VaeloriaRealmId;

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
  name: string;
  kind: 'town' | 'ruin' | 'fort' | 'port' | 'shrine' | 'pass';
  x: number;
  y: number;
}

export interface VaeloriaRegionalMapDef {
  id: VaeloriaRealmId;
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

export const VAELORIA_REALM_ORDER: VaeloriaRealmId[] = [
  'veridia',
  'eclipse',
  'matrix',
  'solaria',
  'pyros',
  'vortex',
];

export const VAELORIA_REGIONAL_MAPS: Record<VaeloriaRealmId, VaeloriaRegionalMapDef> = {
  veridia: {
    id: 'veridia',
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
    ],
    localLandmarks: [
      { name: 'Aldeia da Seiva Antiga', kind: 'town', x: 42, y: 40 },
      { name: 'Pontes Pênseis de Cipó-Ferro', kind: 'pass', x: 63, y: 47 },
      { name: 'Ruínas Esmeralda Submersas', kind: 'ruin', x: 58, y: 67 },
      { name: 'Totens da Grande Caçada', kind: 'shrine', x: 35, y: 64 },
      { name: 'Forte das Raízes Norte', kind: 'fort', x: 42, y: 17 },
      { name: 'Ancoradouro Austral', kind: 'port', x: 38, y: 85 },
    ],
  },

  eclipse: {
    id: 'eclipse',
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
    ],
    localLandmarks: [
      { name: 'Necrópole dos Sinos Mudos', kind: 'ruin', x: 38, y: 36 },
      { name: 'Vila da Vigília Umbral', kind: 'town', x: 58, y: 58 },
      { name: 'Ponte das Gárgulas', kind: 'pass', x: 64, y: 38 },
      { name: 'Farol da Lua Sangrenta', kind: 'port', x: 14, y: 63 },
      { name: 'Santuário dos Pactuários', kind: 'shrine', x: 46, y: 68 },
      { name: 'Bastilha de Sangue-Ferro', kind: 'fort', x: 64, y: 20 },
    ],
  },

  matrix: {
    id: 'matrix',
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
    ],
    localLandmarks: [
      { name: 'Coliseu Externo dos Selos', kind: 'fort', x: 50, y: 68 },
      { name: 'Encruzilhada das Cinco Linhas de Ley', kind: 'shrine', x: 50, y: 32 },
      { name: 'Entreposto das Caravanas Neutras', kind: 'town', x: 36, y: 50 },
      { name: 'Praça dos Embaixadores', kind: 'town', x: 64, y: 50 },
      { name: 'Ruínas da Primeira Refração', kind: 'ruin', x: 18, y: 38 },
      { name: 'Atalaia Oriental de Granito', kind: 'fort', x: 82, y: 38 },
    ],
  },

  solaria: {
    id: 'solaria',
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
    ],
    localLandmarks: [
      { name: 'Aqueduto Imperial de Alabastro', kind: 'pass', x: 36, y: 60 },
      { name: 'Cidade-Terraço da Aurora', kind: 'town', x: 62, y: 55 },
      { name: 'Porto Real do Sol Nascente', kind: 'port', x: 71, y: 76 },
      { name: 'Mosteiro das Lentes Sagradas', kind: 'shrine', x: 68, y: 31 },
      { name: 'Cidadela da Guarda Dourada', kind: 'fort', x: 35, y: 37 },
      { name: 'Colunata dos Reis Antigos', kind: 'ruin', x: 50, y: 78 },
    ],
  },

  pyros: {
    id: 'pyros',
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
    ],
    localLandmarks: [
      { name: 'Ponte de Ferro sobre o Rio de Lava', kind: 'pass', x: 37, y: 48 },
      { name: 'Fundição das Legiões Rubras', kind: 'town', x: 54, y: 68 },
      { name: 'Docas Suspensas de Dirigíveis', kind: 'port', x: 64, y: 31 },
      { name: 'Altar da Chama Primordial', kind: 'shrine', x: 34, y: 68 },
      { name: 'Bastião de Obsidiana Ardente', kind: 'fort', x: 63, y: 54 },
      { name: 'Ossada do Dragão Ancestral', kind: 'ruin', x: 16, y: 35 },
    ],
  },

  vortex: {
    id: 'vortex',
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
    ],
    localLandmarks: [
      { name: 'Ponte de Gelo Eterno', kind: 'pass', x: 64, y: 36 },
      { name: 'Cais dos Quebra-Gelos Reais', kind: 'port', x: 45, y: 56 },
      { name: 'Vila Boreal dos Relojoeiros', kind: 'town', x: 56, y: 52 },
      { name: 'Santuário da Aurora Astral', kind: 'shrine', x: 38, y: 37 },
      { name: 'Forte da Geada Negra', kind: 'fort', x: 40, y: 69 },
      { name: 'Naufrágio da Primeira Armada', kind: 'ruin', x: 16, y: 49 },
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
};

/**
 * Coordenadas calibradas sobre as 6 artes cartográficas regionais (16:9)
 * para as 30 Províncias da Conquista Continental (5 províncias amplas por Reino)!
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
};

export function mapTerritoryIdToRealmId(territoryId: string): VaeloriaRealmId {
  if (territoryId === 'territory_vortex') return 'vortex';
  if (territoryId === 'territory_pyros') return 'pyros';
  if (territoryId === 'territory_eclipse') return 'eclipse';
  if (territoryId === 'territory_solaria') return 'solaria';
  if (territoryId === 'territory_veridia') return 'veridia';
  return 'matrix';
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
