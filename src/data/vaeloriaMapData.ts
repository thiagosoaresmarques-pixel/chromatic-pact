import { Domain } from '../types/game';

export interface VaeloriaTerritoryRegion {
  id: string;
  domain: Domain;
  name: string;
  cardinalLabel: string;
  subtitle: string;
  citadel: string;
  icon: string;
  color: string;
  /** Center label position in % (0..100) on the 16:9 Vaeloria map */
  labelX: number;
  labelY: number;
  /** Territory center for live "Current Region" detection while roaming */
  anchorX: number;
  anchorY: number;
}

export interface VaeloriaSubLandmark {
  id: string;
  name: string;
  domain: Domain;
  x: number;
  y: number;
}

export interface VaeloriaStageMapNode {
  bossId: string;
  stage: number;
  x: number;
  y: number;
  regionName: string;
  landmarkName: string;
  territoryDomain: Domain;
}

export const VAELORIA_WORLD_MAP_IMAGE = '/assets/map/vaeloria_world_map.jpg';

/**
 * OS SEIS TERRITÓRIOS CANÔNICOS DE VAELORIA
 * Calibrados sobre a ilustração cartográfica oficial (16:9):
 * - Polos Setentrionais: Vórtex (Safira / Azul)
 * - Norte Vulcânico: Pyros (Chama / Vermelho)
 * - Oeste Profundo: Vale do Eclipse (Umbral / Roxo)
 * - Centro Axial: Fronteira Cinzenta (Matriz / Neutro)
 * - Leste Alto: Solária (Alvorada / Dourado)
 * - Sul Selvagem: Veridia (Selva / Verde)
 */
export const VAELORIA_MAP_TERRITORIES: VaeloriaTerritoryRegion[] = [
  {
    id: 'territory_vortex',
    domain: 'blue',
    name: 'VÓRTEX',
    cardinalLabel: 'POLOS SETENTRIONAIS',
    subtitle: 'Estreito de Safira & Planetário Astral',
    citadel: 'Pináculo Polar & Agulhas de Vidro',
    icon: '❄️',
    color: '#38bdf8',
    labelX: 50,
    labelY: 5.5,
    anchorX: 50,
    anchorY: 14,
  },
  {
    id: 'territory_pyros',
    domain: 'red',
    name: 'PYROS',
    cardinalLabel: 'NORTE VULCÂNICO',
    subtitle: 'Cordilheira Boreal & Bigorna Partida',
    citadel: 'Caldeira Ancestral & Bigorna Partida',
    icon: '🔥',
    color: '#ef4444',
    labelX: 51,
    labelY: 34.5,
    anchorX: 51,
    anchorY: 28,
  },
  {
    id: 'territory_eclipse',
    domain: 'purple',
    name: 'VALE DO ECLIPSE',
    cardinalLabel: 'OESTE PROFUNDO',
    subtitle: 'Fendas Umbrais & Catedral de Obsidiana',
    citadel: 'Catedral de Obsidiana & Ossário Real',
    icon: '💀',
    color: '#a855f7',
    labelX: 22,
    labelY: 31,
    anchorX: 26,
    anchorY: 50,
  },
  {
    id: 'territory_grey_frontier',
    domain: 'neutral',
    name: 'FRONTEIRA CINZENTA',
    cardinalLabel: 'CENTRO AXIAL',
    subtitle: 'Torre dos Cinco Selos & Arena do Pacto',
    citadel: 'Torre dos Cinco Selos',
    icon: '☸',
    color: '#e2e8f0',
    labelX: 50,
    labelY: 62.5,
    anchorX: 50,
    anchorY: 51,
  },
  {
    id: 'territory_solaria',
    domain: 'gold',
    name: 'SOLÁRIA',
    cardinalLabel: 'LESTE ALTO',
    subtitle: 'Planaltos de Mármore & Espelhos Solares',
    citadel: 'Zênite Dourado & Cidadela da Alvorada',
    icon: '☀️',
    color: '#eab308',
    labelX: 80,
    labelY: 63,
    anchorX: 76,
    anchorY: 46,
  },
  {
    id: 'territory_veridia',
    domain: 'green',
    name: 'VERIDIA',
    cardinalLabel: 'SUL SELVAGEM',
    subtitle: 'Selva Primeva & Árvore-Mãe',
    citadel: 'Coração da Árvore-Mãe & Galhada Viva',
    icon: '🌿',
    color: '#10b981',
    labelX: 50,
    labelY: 92,
    anchorX: 50,
    anchorY: 78,
  },
];

export const VAELORIA_SUB_LANDMARKS: VaeloriaSubLandmark[] = [
  { id: 'lm_dead_stars_sea', name: 'Mar das Estrelas Mortas', domain: 'blue', x: 14, y: 17 },
  { id: 'lm_glass_spires', name: 'Agulhas de Safira', domain: 'blue', x: 74, y: 11 },
  { id: 'lm_split_anvil', name: 'Bigorna Partida', domain: 'red', x: 51, y: 20.5 },
  { id: 'lm_obsidian_cathedral', name: 'Catedral de Obsidiana', domain: 'purple', x: 29, y: 54.5 },
  { id: 'lm_bone_marsh', name: 'Ossário da Costa', domain: 'purple', x: 21, y: 71 },
  { id: 'lm_five_seals_tower', name: 'Arena do Pacto', domain: 'neutral', x: 50, y: 55.8 },
  { id: 'lm_solar_mirrors', name: 'Espelhos Solares', domain: 'gold', x: 86, y: 36 },
  { id: 'lm_dawn_ocean', name: 'Oceano da Alvorada', domain: 'gold', x: 90, y: 69 },
  { id: 'lm_mother_tree', name: 'Árvore-Mãe', domain: 'green', x: 50, y: 67.5 },
  { id: 'lm_fang_peninsula', name: 'Península das Presas', domain: 'green', x: 35, y: 89 },
];

/**
 * COORDENADAS GEOGRÁFICAS CANÔNICAS DOS 26 ESTÁGIOS DA CAMPANHA
 * Posicionados exatamente sobre os marcos ilustrados do continente de Vaeloria.
 */
export const CAMPAIGN_BOSS_MAP_NODES: Record<string, VaeloriaStageMapNode> = {
  // ATO I — As Fronteiras Despertas (1–4)
  boss_stage_1_goblin_king: {
    bossId: 'boss_stage_1_goblin_king',
    stage: 1,
    x: 40,
    y: 69.5,
    regionName: 'Veridia Setentrional',
    landmarkName: 'Matas Espinhosas do Norte',
    territoryDomain: 'green',
  },
  boss_stage_2_storm_oracle: {
    bossId: 'boss_stage_2_storm_oracle',
    stage: 2,
    x: 73,
    y: 18,
    regionName: 'Arquipélago de Vórtex',
    landmarkName: 'Monólito Tempestuoso de Safira',
    territoryDomain: 'blue',
  },
  boss_stage_3_solar_arbiter: {
    bossId: 'boss_stage_3_solar_arbiter',
    stage: 3,
    x: 71,
    y: 43.5,
    regionName: 'Solária Central',
    landmarkName: 'Grande Domo da Cidadela Solar',
    territoryDomain: 'gold',
  },
  boss_stage_4_solar_wild: {
    bossId: 'boss_stage_4_solar_wild',
    stage: 4,
    x: 74,
    y: 56,
    regionName: 'Fronteira Solária–Veridia',
    landmarkName: 'Jardins Suspensos da Aurora Silvestre',
    territoryDomain: 'gold',
  },

  // ATO II — Os Pactos Dualistas (5–8)
  boss_stage_5_lich_emperor: {
    bossId: 'boss_stage_5_lich_emperor',
    stage: 5,
    x: 22,
    y: 38.5,
    regionName: 'Desfiladeiro Noroeste',
    landmarkName: 'Cripta Abissal da Fenda',
    territoryDomain: 'purple',
  },
  boss_stage_6_storm_dragon: {
    bossId: 'boss_stage_6_storm_dragon',
    stage: 6,
    x: 43.5,
    y: 19,
    regionName: 'Fronteira Pyros–Vórtex',
    landmarkName: 'Observatório Piro-Rúnico',
    territoryDomain: 'red',
  },
  boss_stage_7_eternal_rot: {
    bossId: 'boss_stage_7_eternal_rot',
    stage: 7,
    x: 29.5,
    y: 68.5,
    regionName: 'Fronteira Eclipse–Veridia',
    landmarkName: 'Pântano Negro sob o Eclipse',
    territoryDomain: 'purple',
  },
  boss_stage_8_iron_inquisition: {
    bossId: 'boss_stage_8_iron_inquisition',
    stage: 8,
    x: 29,
    y: 49.5,
    regionName: 'Vale do Eclipse',
    landmarkName: 'Catedral Gótica de Obsidiana',
    territoryDomain: 'purple',
  },

  // ATO III — Os Tronos Ancestrais (9–12)
  boss_stage_5_crater_tyrant: {
    bossId: 'boss_stage_5_crater_tyrant',
    stage: 9,
    x: 41.5,
    y: 27.5,
    regionName: 'Oeste de Pyros',
    landmarkName: 'Grande Caldeira Primordial',
    territoryDomain: 'red',
  },
  boss_stage_10_eternal_reliquary: {
    bossId: 'boss_stage_10_eternal_reliquary',
    stage: 10,
    x: 76,
    y: 34.5,
    regionName: 'Alto Norte de Solária',
    landmarkName: 'Santuário do Relicário Eterno',
    territoryDomain: 'gold',
  },
  boss_stage_11_blood_moon: {
    bossId: 'boss_stage_11_blood_moon',
    stage: 11,
    x: 20.5,
    y: 63.5,
    regionName: 'Costa Sudoeste do Eclipse',
    landmarkName: 'Ossário Real da Lua Sangrenta',
    territoryDomain: 'purple',
  },
  boss_stage_12_draconic_council: {
    bossId: 'boss_stage_12_draconic_council',
    stage: 12,
    x: 65.5,
    y: 34.5,
    regionName: 'Cordilheira Piro-Solar',
    landmarkName: 'Portões das Escamas Imperiais',
    territoryDomain: 'red',
  },

  // ATO IV — A Convergência do Tempo (13–14)
  boss_stage_13_chronomancer: {
    bossId: 'boss_stage_13_chronomancer',
    stage: 13,
    x: 50,
    y: 10.5,
    regionName: 'Pico Polar de Vórtex',
    landmarkName: 'Planetário Horológico de Chronos',
    territoryDomain: 'blue',
  },
  boss_stage_6_valkyra: {
    bossId: 'boss_stage_6_valkyra',
    stage: 14,
    x: 45,
    y: 44,
    regionName: 'Fronteira Cinzenta Noroeste',
    landmarkName: 'Monólito da Primeira Torre Cinzenta',
    territoryDomain: 'neutral',
  },

  // ATO V — Os Tronos Tripartidos (15–20)
  boss_stage_15_siege_battery: {
    bossId: 'boss_stage_15_siege_battery',
    stage: 15,
    x: 60,
    y: 31,
    regionName: 'Leste de Pyros',
    landmarkName: 'Cratera Ardente da Bateria Astral',
    territoryDomain: 'red',
  },
  boss_stage_16_thousand_shields: {
    bossId: 'boss_stage_16_thousand_shields',
    stage: 16,
    x: 50.5,
    y: 74.5,
    regionName: 'Coração de Veridia',
    landmarkName: 'Raízes da Árvore-Mãe & Mil Escudos',
    territoryDomain: 'green',
  },
  boss_stage_17_abyssal_chimera: {
    bossId: 'boss_stage_17_abyssal_chimera',
    stage: 17,
    x: 36,
    y: 13.5,
    regionName: 'Ilhas Glaciais Ocidentais',
    landmarkName: 'Pináculo de Gelo e Chama Necrótica',
    territoryDomain: 'purple',
  },
  boss_stage_18_crimson_sun: {
    bossId: 'boss_stage_18_crimson_sun',
    stage: 18,
    x: 35.5,
    y: 44.5,
    regionName: 'Escarpa Crepuscular',
    landmarkName: 'Corte do Sol Carmesim',
    territoryDomain: 'gold',
  },
  boss_stage_19_astral_cataclysm: {
    bossId: 'boss_stage_19_astral_cataclysm',
    stage: 19,
    x: 30.5,
    y: 22,
    regionName: 'Estreito Polar Ocidental',
    landmarkName: 'Fossa das Estrelas Mortas',
    territoryDomain: 'blue',
  },
  boss_stage_20_supreme_valkyra: {
    bossId: 'boss_stage_20_supreme_valkyra',
    stage: 20,
    x: 55.5,
    y: 44,
    regionName: 'Fronteira Cinzenta Nordeste',
    landmarkName: 'Monólito do Prisma Infinito',
    territoryDomain: 'neutral',
  },

  // ATO VI — As Armadas e o Julgamento das Rodas (21–26)
  boss_stage_21_crater_armada: {
    bossId: 'boss_stage_21_crater_armada',
    stage: 21,
    x: 58,
    y: 19.5,
    regionName: 'Estreito Boreal Pyros–Vórtex',
    landmarkName: 'Corredor Aéreo das Armadas',
    territoryDomain: 'red',
  },
  boss_stage_22_eclipse_zenith_armada: {
    bossId: 'boss_stage_22_eclipse_zenith_armada',
    stage: 22,
    x: 83.5,
    y: 43,
    regionName: 'Falésias Orientais de Solária',
    landmarkName: 'Torres dos Espelhos do Zênite',
    territoryDomain: 'gold',
  },
  boss_stage_23_refraction_triad: {
    bossId: 'boss_stage_23_refraction_triad',
    stage: 23,
    x: 41,
    y: 54.5,
    regionName: 'Anel Ocidental do Prisma',
    landmarkName: 'Cristal dos Arautos e Pactuários',
    territoryDomain: 'purple',
  },
  boss_stage_24_primal_volcanic_wheels: {
    bossId: 'boss_stage_24_primal_volcanic_wheels',
    stage: 24,
    x: 51,
    y: 25,
    regionName: 'Cume Central de Pyros',
    landmarkName: 'A Grande Bigorna Partida',
    territoryDomain: 'red',
  },
  boss_stage_25_celestial_funeral_wheels: {
    bossId: 'boss_stage_25_celestial_funeral_wheels',
    stage: 25,
    x: 59,
    y: 54.5,
    regionName: 'Anel Oriental do Prisma',
    landmarkName: 'Tribunal das Três Rodas',
    territoryDomain: 'gold',
  },
  boss_stage_26_vaelkor_supreme_wheel: {
    bossId: 'boss_stage_26_vaelkor_supreme_wheel',
    stage: 26,
    x: 50,
    y: 50.5,
    regionName: 'Umbigo Axial de Vaeloria',
    landmarkName: 'Torre dos Cinco Selos • Eixo da Roda Matriz',
    territoryDomain: 'neutral',
  },
};

/**
 * ROTA PEREGRINA DAS 9 ETAPAS DA EXPEDIÇÃO SOBRE O CONTINENTE DE VAELORIA
 */
export const EXPEDITION_STAGE_MAP_NODES: Record<string, VaeloriaStageMapNode> = {
  exp_boss_1: {
    bossId: 'exp_boss_1',
    stage: 1,
    x: 37,
    y: 83,
    regionName: 'Península Sul de Veridia',
    landmarkName: 'Mata Petrificada do Limiar',
    territoryDomain: 'green',
  },
  exp_boss_2: {
    bossId: 'exp_boss_2',
    stage: 2,
    x: 73,
    y: 18,
    regionName: 'Arquipélago de Vórtex',
    landmarkName: 'Monólito de Safira',
    territoryDomain: 'blue',
  },
  exp_boss_3: {
    bossId: 'exp_boss_3',
    stage: 3,
    x: 71,
    y: 43.5,
    regionName: 'Solária Central',
    landmarkName: 'Forjas do Domo Solar',
    territoryDomain: 'gold',
  },
  exp_boss_4: {
    bossId: 'exp_boss_4',
    stage: 4,
    x: 29,
    y: 49.5,
    regionName: 'Vale do Eclipse',
    landmarkName: 'Catedral dos Ecos Abissais',
    territoryDomain: 'purple',
  },
  exp_boss_5: {
    bossId: 'exp_boss_5',
    stage: 5,
    x: 41.5,
    y: 27.5,
    regionName: 'Pyros Boreal',
    landmarkName: 'Núcleo da Caldeira Ancestral',
    territoryDomain: 'red',
  },
  exp_boss_6: {
    bossId: 'exp_boss_6',
    stage: 6,
    x: 50,
    y: 10.5,
    regionName: 'Pico Polar de Vórtex',
    landmarkName: 'Planetário do Relógio Quebrado',
    territoryDomain: 'blue',
  },
  exp_boss_7_armada: {
    bossId: 'exp_boss_7_armada',
    stage: 7,
    x: 51,
    y: 25,
    regionName: 'Céus da Bigorna Partida',
    landmarkName: 'Esquadrões Alados da Fenda',
    territoryDomain: 'red',
  },
  exp_boss_8_valkyra: {
    bossId: 'exp_boss_8_valkyra',
    stage: 8,
    x: 50.5,
    y: 74.5,
    regionName: 'Santuário da Árvore-Mãe',
    landmarkName: 'Convergência das Raízes e do Prisma',
    territoryDomain: 'green',
  },
  exp_boss_9_vaelkor: {
    bossId: 'exp_boss_9_vaelkor',
    stage: 9,
    x: 50,
    y: 50.5,
    regionName: 'Centro Axial de Vaeloria',
    landmarkName: 'Torre dos Cinco Selos • Eixo da Roda Matriz',
    territoryDomain: 'neutral',
  },
};

export function resolveStageMapNode(
  mode: 'campaign' | 'expedition',
  bossId: string,
  stage: number
): VaeloriaStageMapNode {
  const table = mode === 'expedition' ? EXPEDITION_STAGE_MAP_NODES : CAMPAIGN_BOSS_MAP_NODES;
  if (table[bossId]) return table[bossId];
  const byStage = Object.values(table).find((n) => n.stage === stage);
  if (byStage) return byStage;
  return {
    bossId,
    stage,
    x: 50,
    y: 50.5,
    regionName: 'Fronteira Cinzenta',
    landmarkName: 'Torre dos Cinco Selos',
    territoryDomain: 'neutral',
  };
}

export function resolveNearestTerritory(x: number, y: number): VaeloriaTerritoryRegion {
  let best = VAELORIA_MAP_TERRITORIES[3];
  let bestDist = Infinity;
  for (const reg of VAELORIA_MAP_TERRITORIES) {
    const dx = x - reg.anchorX;
    const dy = (y - reg.anchorY) * 1.15;
    const d = dx * dx + dy * dy;
    if (d < bestDist) {
      bestDist = d;
      best = reg;
    }
  }
  return best;
}
