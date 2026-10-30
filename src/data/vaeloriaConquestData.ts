import { CampaignBoss, ConquestBattleModifiers, Domain } from '../types/game';

export type ConquestFactionId = 'vortex' | 'pyros' | 'eclipse' | 'matrix' | 'solaria' | 'veridia';

export type ProvinceTerrainKind =
  | 'citadel'
  | 'mountain_pass'
  | 'port'
  | 'forge'
  | 'sanctuary'
  | 'marsh'
  | 'forest'
  | 'glacier'
  | 'skyway';

export interface MicroSettlement {
  name: string;
  /** Offset in % relative to province center */
  dx: number;
  dy: number;
  kind: 'village' | 'mine' | 'watchtower' | 'harbor' | 'shrine';
}

export interface ConquestFactionDef {
  id: ConquestFactionId;
  name: string;
  shortName: string;
  rulerName: string;
  rulerTitle: string;
  domain: Domain;
  color: string;
  fillColor: string;
  icon: string;
  capitalProvinceId: string;
  avatarCardId: string;
  defaultDeckId: string;
  imperialDoctrineName: string;
  imperialDoctrineDesc: string;
}

export interface ConquestProvinceDef {
  id: string;
  name: string;
  regionLabel: string;
  initialOwner: ConquestFactionId;
  domain: Domain;
  /** Position in % (0..100) calibrated on the 16:9 Vaeloria map */
  x: number;
  y: number;
  isCapital?: boolean;
  terrainKind: ProvinceTerrainKind;
  terrainLabel: string;
  neighbors: string[];
  navalOrSkyNeighbors?: string[];
  supplyIncome: number;
  strategicBonusTitle: string;
  strategicBonusDesc: string;
  garrisonCommander: string;
  garrisonTitle: string;
  garrisonAvatarCardId: string;
  garrisonDeckId: string;
  baseGarrisonHp: number;
  loreSnippet: string;
  microSettlements: MicroSettlement[];
}

export interface ConquestCrisisDef {
  id: string;
  name: string;
  icon: string;
  accent: string;
  description: string;
  effectType: 'open_seas' | 'dragon_skyways' | 'polar_winter' | 'axial_judgment';
}

export const CONQUEST_MAP_WIDTH = 3200;
export const CONQUEST_MAP_HEIGHT = 1800;

export const CONQUEST_FACTIONS: Record<ConquestFactionId, ConquestFactionDef> = {
  pyros: {
    id: 'pyros',
    name: 'Império da Bigorna de Pyros',
    shortName: 'Pyros',
    rulerName: 'Ignis-Vor & Marechal da Roda Rubra',
    rulerTitle: 'Soberano das Caldeiras do Norte',
    domain: 'red',
    color: '#ef4444',
    fillColor: 'rgba(239, 68, 68, 0.27)',
    icon: '🔥',
    capitalProvinceId: 'prov_pyros_split_anvil',
    avatarCardId: 'red_173_general_roda_chama',
    defaultDeckId: 'deck_dual_draconic_pact',
    imperialDoctrineName: 'Forja de Sangue e Ferro',
    imperialDoctrineDesc:
      'Relíquias custam -1⚡ de Essência nos Cercos enquanto a Grande Bigorna Partida estiver sob sua bandeira.',
  },
  vortex: {
    id: 'vortex',
    name: 'Conclave Horológico de Vórtex',
    shortName: 'Vórtex',
    rulerName: 'Chronos-Vael & Árbitro Glacial',
    rulerTitle: 'Regente dos Polos Setentrionais',
    domain: 'blue',
    color: '#38bdf8',
    fillColor: 'rgba(56, 189, 248, 0.27)',
    icon: '❄️',
    capitalProvinceId: 'prov_vortex_polar_spire',
    avatarCardId: 'blue_173_general_roda_gelo',
    defaultDeckId: 'deck_spec_chronomancer',
    imperialDoctrineName: 'Astrolábio das Eras',
    imperialDoctrineDesc:
      'Concede +1⚡ de Essência Máxima e Inicial em todos os Cercos enquanto o Pináculo Polar estiver sob seu domínio.',
  },
  eclipse: {
    id: 'eclipse',
    name: 'Corte de Obsidiana do Eclipse',
    shortName: 'Eclipse',
    rulerName: 'Morgath-Zul & Juiz Fúnebre da Roda',
    rulerTitle: 'Senhor do Oeste Profundo',
    domain: 'purple',
    color: '#a855f7',
    fillColor: 'rgba(168, 85, 247, 0.28)',
    icon: '💀',
    capitalProvinceId: 'prov_eclipse_obsidian_cathedral',
    avatarCardId: 'purple_173_general_roda_abismo',
    defaultDeckId: 'deck_tri_blood_moon',
    imperialDoctrineName: 'Dízimo das Sombras',
    imperialDoctrineDesc:
      'Causa 3 de dano direto de abertura ao comandante inimigo no início de cada Cerco enquanto controlar a Catedral.',
  },
  solaria: {
    id: 'solaria',
    name: 'Hegemonia da Alvorada de Solária',
    shortName: 'Solária',
    rulerName: 'Aurelius & General da Roda Solar',
    rulerTitle: 'Protetor do Leste Alto',
    domain: 'gold',
    color: '#eab308',
    fillColor: 'rgba(234, 179, 8, 0.26)',
    icon: '☀️',
    capitalProvinceId: 'prov_solaria_great_dome',
    avatarCardId: 'gold_173_general_roda_sol',
    defaultDeckId: 'deck_tri_eternal_reliquary',
    imperialDoctrineName: 'Égide do Zênite',
    imperialDoctrineDesc:
      'A primeira criatura invocada em cada coluna da Vanguarda ganha +1🛡️ Armadura enquanto o Grande Domo for seu.',
  },
  veridia: {
    id: 'veridia',
    name: 'Pacto da Raiz de Ferro de Veridia',
    shortName: 'Veridia',
    rulerName: 'Sylvanor & Guardião da Roda Primeva',
    rulerTitle: 'Voz da Árvore-Mãe do Sul',
    domain: 'green',
    color: '#10b981',
    fillColor: 'rgba(16, 185, 129, 0.26)',
    icon: '🌿',
    capitalProvinceId: 'prov_veridia_mother_tree',
    avatarCardId: 'green_173_general_roda_selva',
    defaultDeckId: 'deck_tri_primal_titans',
    imperialDoctrineName: 'Seiva Imortal da Árvore-Mãe',
    imperialDoctrineDesc:
      'Seu Soberano inicia todos os Cercos com +6❤️ PV Máximo e Inicial enquanto o Santuário da Árvore-Mãe for seu.',
  },
  matrix: {
    id: 'matrix',
    name: 'Ordem Axial dos Cinco Selos',
    shortName: 'Ordem Axial',
    rulerName: 'Vaelkor, Árbitro da Roda Matriz',
    rulerTitle: 'Guardião do Centro Axial',
    domain: 'neutral',
    color: '#e2e8f0',
    fillColor: 'rgba(226, 232, 240, 0.25)',
    icon: '☸',
    capitalProvinceId: 'prov_matrix_five_seals',
    avatarCardId: 'neutral_173_general_roda_matriz',
    defaultDeckId: 'deck_penta_valkyra_pact',
    imperialDoctrineName: 'Convergência dos Oito Raios',
    imperialDoctrineDesc:
      'Criaturas Lendárias e Generais da Roda entram com +1🛡️ Armadura e +1♻️ Regeneração enquanto detiver a Torre Axial.',
  },
};

export const CONQUEST_FACTION_ORDER: ConquestFactionId[] = [
  'pyros',
  'vortex',
  'eclipse',
  'solaria',
  'veridia',
  'matrix',
];

export const CONQUEST_CRISES: ConquestCrisisDef[] = [
  {
    id: 'crisis_open_seas',
    name: 'Marés Abertas do Comércio',
    icon: '⚓',
    accent: '#38bdf8',
    description: 'Cada Porto sob seu controle rende +15⚙️ Suprimentos extras nesta estação.',
    effectType: 'open_seas',
  },
  {
    id: 'crisis_dragon_skyways',
    name: 'Revoada das Armadas Dracônicas',
    icon: '🐉',
    accent: '#ef4444',
    description: 'Unidades com Voo, Sopro ou Armada recebem +1⚔️ ATQ em todos os Cercos desta estação.',
    effectType: 'dragon_skyways',
  },
  {
    id: 'crisis_polar_winter',
    name: 'Inverno Astral de Vórtex',
    icon: '❄️',
    accent: '#93c5fd',
    description: 'Bastiões defensivos concedem +5❤️ PV adicionais aos defensores contra invasões.',
    effectType: 'polar_winter',
  },
  {
    id: 'crisis_axial_judgment',
    name: 'Ressonância da Torre dos Cinco Selos',
    icon: '☸',
    accent: '#fde047',
    description: 'Províncias da Fronteira Cinzenta geram +20⚙️ Suprimentos extras e +4❤️ PV nos Cercos.',
    effectType: 'axial_judgment',
  },
];

/**
 * AS 30 PROVÍNCIAS GEOPOLÍTICAS CANÔNICAS DE VAELORIA (5 por Reino)
 */
export const CONQUEST_PROVINCES: ConquestProvinceDef[] = [
  // ===================== 1. VÓRTEX (POLOS SETENTRIONAIS) =====================
  {
    id: 'prov_vortex_polar_spire',
    name: 'Pináculo Polar de Chronos',
    regionLabel: 'Vórtex Central • Capital Polar',
    initialOwner: 'vortex',
    domain: 'blue',
    x: 50,
    y: 10.5,
    isCapital: true,
    terrainKind: 'glacier',
    terrainLabel: 'Cidadela Glacial',
    neighbors: [
      'prov_vortex_west_isles',
      'prov_vortex_glass_spires',
      'prov_pyros_runic_ridge',
      'prov_pyros_sky_corridor',
    ],
    supplyIncome: 85,
    strategicBonusTitle: 'Selo Polar: +1⚡ Essência Inicial',
    strategicBonusDesc: 'Soberano começa cada batalha de Cerco com +1⚡ de Essência Máxima e Atual.',
    garrisonCommander: 'Chronos-Vael, Guardião Polar',
    garrisonTitle: 'Soberano do Planetário Horológico',
    garrisonAvatarCardId: 'blue_173_general_roda_gelo',
    garrisonDeckId: 'deck_spec_chronomancer',
    baseGarrisonHp: 74,
    loreSnippet: 'No topo congelado do mundo, engrenagens de safira medem o pulso das seis nações.',
    microSettlements: [
      { name: 'Torre do Pêndulo', dx: -2.4, dy: 1.5, kind: 'watchtower' },
      { name: 'Cais Quebra-Gelo', dx: 2.6, dy: 2.1, kind: 'harbor' },
      { name: 'Altar Boreal', dx: 0.4, dy: -2.2, kind: 'shrine' },
    ],
  },
  {
    id: 'prov_vortex_west_isles',
    name: 'Ilhas Glaciais Ocidentais',
    regionLabel: 'Arquipélago Noroeste de Vórtex',
    initialOwner: 'vortex',
    domain: 'blue',
    x: 35.5,
    y: 13.5,
    terrainKind: 'glacier',
    terrainLabel: 'Arquipélago Ártico',
    neighbors: ['prov_vortex_polar_spire', 'prov_vortex_dead_stars', 'prov_pyros_runic_ridge'],
    supplyIncome: 40,
    strategicBonusTitle: 'Vigia das Geleiras',
    strategicBonusDesc: 'Fortifica a rota marítima setentrional e abastece frotas polares.',
    garrisonCommander: 'Almirante Cryon',
    garrisonTitle: 'Sentinela do Gelo Eterno',
    garrisonAvatarCardId: 'blue_172_armada_draconica_gelo',
    garrisonDeckId: 'deck_blue_tempest',
    baseGarrisonHp: 48,
    loreSnippet: 'Pináculos de gelo azulado onde dragões glaciais nidificam acima das nevascas.',
    microSettlements: [
      { name: 'Forte Geada', dx: -2.2, dy: 1.2, kind: 'watchtower' },
      { name: 'Mina de Cobalto', dx: 2.1, dy: -1.4, kind: 'mine' },
    ],
  },
  {
    id: 'prov_vortex_dead_stars',
    name: 'Estreito das Estrelas Mortas',
    regionLabel: 'Costa Polar Sudoeste',
    initialOwner: 'vortex',
    domain: 'blue',
    x: 28.5,
    y: 22.5,
    terrainKind: 'port',
    terrainLabel: 'Porto Astral',
    neighbors: [
      'prov_vortex_west_isles',
      'prov_pyros_runic_ridge',
      'prov_pyros_west_caldera',
      'prov_eclipse_abyssal_gorge',
    ],
    supplyIncome: 55,
    strategicBonusTitle: 'Porto das Estrelas (+55⚙️)',
    strategicBonusDesc: 'Entreposto naval que conecta os mares polares aos cânions do Oeste.',
    garrisonCommander: 'Oráculo Vespera',
    garrisonTitle: 'Navegadora da Fossa Astral',
    garrisonAvatarCardId: 'blue_80_senhor_tempo',
    garrisonDeckId: 'deck_dual_abyssal_storm',
    baseGarrisonHp: 50,
    loreSnippet: 'Meteoritos antigos repousam sob águas translúcidas que nunca congelam por completo.',
    microSettlements: [
      { name: 'Ancoradouro Estelar', dx: -2.5, dy: 1.6, kind: 'harbor' },
      { name: 'Farol de Vidro', dx: 2.0, dy: -1.8, kind: 'watchtower' },
    ],
  },
  {
    id: 'prov_vortex_glass_spires',
    name: 'Agulhas de Safira',
    regionLabel: 'Arquipélago Nordeste de Vórtex',
    initialOwner: 'vortex',
    domain: 'blue',
    x: 62.5,
    y: 12.5,
    terrainKind: 'glacier',
    terrainLabel: 'Fiordes de Cristal',
    neighbors: [
      'prov_vortex_polar_spire',
      'prov_vortex_sapphire_monolith',
      'prov_pyros_sky_corridor',
    ],
    supplyIncome: 40,
    strategicBonusTitle: 'Fiordes Refrativos',
    strategicBonusDesc: 'Protege o flanco leste do Planetário contra incursões aéreas.',
    garrisonCommander: 'Magus Kaelen',
    garrisonTitle: 'Tecelão das Agulhas',
    garrisonAvatarCardId: 'blue_06_dragao_azul',
    garrisonDeckId: 'deck_blue_tempest',
    baseGarrisonHp: 46,
    loreSnippet: 'Colunas naturais de quartzo azul que cantam quando o vento polar sopra.',
    microSettlements: [
      { name: 'Vila Boreal', dx: -1.9, dy: 1.4, kind: 'village' },
      { name: 'Veio de Safira', dx: 2.3, dy: 0.9, kind: 'mine' },
    ],
  },
  {
    id: 'prov_vortex_sapphire_monolith',
    name: 'Monólito Tempestuoso',
    regionLabel: 'Passagem Oriental Vórtex–Solária',
    initialOwner: 'vortex',
    domain: 'blue',
    x: 73.5,
    y: 18.5,
    terrainKind: 'port',
    terrainLabel: 'Porto & Monólito',
    neighbors: [
      'prov_vortex_glass_spires',
      'prov_pyros_sky_corridor',
      'prov_solaria_eternal_reliquary',
    ],
    supplyIncome: 55,
    strategicBonusTitle: 'Rota do Mar da Alvorada (+55⚙️)',
    strategicBonusDesc: 'Ponte marítima estratégica entre o Polo Leste e os planaltos de Solária.',
    garrisonCommander: 'Arconte Lyra das Tormentas',
    garrisonTitle: 'Senhora do Monólito Oriental',
    garrisonAvatarCardId: 'blue_06_dragao_azul',
    garrisonDeckId: 'deck_dual_storm_dragon',
    baseGarrisonHp: 52,
    loreSnippet: 'Um obelisco colossal cravado no mar onde relâmpagos anunciam frotas invasoras.',
    microSettlements: [
      { name: 'Porto Relâmpago', dx: 2.2, dy: 1.8, kind: 'harbor' },
      { name: 'Santuário da Bruma', dx: -2.0, dy: -1.3, kind: 'shrine' },
    ],
  },

  // ===================== 2. PYROS (NORTE VULCÂNICO) =====================
  {
    id: 'prov_pyros_split_anvil',
    name: 'A Grande Bigorna Partida',
    regionLabel: 'Cume Central de Pyros • Capital',
    initialOwner: 'pyros',
    domain: 'red',
    x: 51,
    y: 25.5,
    isCapital: true,
    terrainKind: 'forge',
    terrainLabel: 'Capital & Forja Suprema',
    neighbors: [
      'prov_pyros_runic_ridge',
      'prov_pyros_west_caldera',
      'prov_pyros_sky_corridor',
      'prov_pyros_east_crater',
      'prov_matrix_nw_monolith',
      'prov_matrix_ne_prism',
    ],
    supplyIncome: 85,
    strategicBonusTitle: 'Selo da Bigorna: Relíquias -1⚡',
    strategicBonusDesc: 'Suas cartas de Relíquia custam -1⚡ de Essência em todas as batalhas de Cerco.',
    garrisonCommander: 'Ignis-Vor & General da Bigorna',
    garrisonTitle: 'Alto Soberano de Pyros',
    garrisonAvatarCardId: 'red_173_general_roda_chama',
    garrisonDeckId: 'deck_dual_draconic_pact',
    baseGarrisonHp: 76,
    loreSnippet: 'Onde o martelo primordial rachou a montanha, rios de ferro líquido alimentam legiões.',
    microSettlements: [
      { name: 'Fornalha Imperial', dx: -2.3, dy: 1.4, kind: 'mine' },
      { name: 'Torre de Escória', dx: 2.4, dy: 1.6, kind: 'watchtower' },
      { name: 'Vila dos Ferreiros', dx: 0.2, dy: 2.8, kind: 'village' },
    ],
  },
  {
    id: 'prov_pyros_runic_ridge',
    name: 'Observatório Piro-Rúnico',
    regionLabel: 'Passo Boreal Pyros–Vórtex',
    initialOwner: 'pyros',
    domain: 'red',
    x: 43,
    y: 19.5,
    terrainKind: 'mountain_pass',
    terrainLabel: 'Passo de Montanha',
    neighbors: [
      'prov_vortex_polar_spire',
      'prov_vortex_west_isles',
      'prov_vortex_dead_stars',
      'prov_pyros_west_caldera',
      'prov_pyros_split_anvil',
    ],
    supplyIncome: 40,
    strategicBonusTitle: 'Gargalo do Vapor Boreal',
    strategicBonusDesc: 'Controla a subida terrestre entre as geleiras polares e as caldeiras.',
    garrisonCommander: 'Pirita-Mor Varkos',
    garrisonTitle: 'Guardião da Fronteira Fumegante',
    garrisonAvatarCardId: 'red_08_dragao_vermelho',
    garrisonDeckId: 'deck_dual_storm_dragon',
    baseGarrisonHp: 50,
    loreSnippet: 'Vapor escaldante sobe do choque eterno entre o magma de Pyros e o gelo de Vórtex.',
    microSettlements: [
      { name: 'Bastilha do Vapor', dx: -1.8, dy: 1.5, kind: 'watchtower' },
      { name: 'Santuário Termo-Rúnico', dx: 1.9, dy: -1.2, kind: 'shrine' },
    ],
  },
  {
    id: 'prov_pyros_west_caldera',
    name: 'Grande Caldeira Primordial',
    regionLabel: 'Pyros Ocidental',
    initialOwner: 'pyros',
    domain: 'red',
    x: 39.5,
    y: 29.5,
    terrainKind: 'forge',
    terrainLabel: 'Caldeira Vulcânica',
    neighbors: [
      'prov_pyros_runic_ridge',
      'prov_vortex_dead_stars',
      'prov_eclipse_abyssal_gorge',
      'prov_eclipse_twilight_scarp',
      'prov_matrix_nw_monolith',
      'prov_pyros_split_anvil',
    ],
    supplyIncome: 55,
    strategicBonusTitle: 'Bombardeio Magmático (+1 Dano Abertura)',
    strategicBonusDesc: 'Dispara +1 de dano de artilharia vulcânica contra o comandante rival no início dos Cercos.',
    garrisonCommander: 'Kragthar da Cratera',
    garrisonTitle: 'Senhor dos Dragões de Cinza',
    garrisonAvatarCardId: 'red_08_dragao_vermelho',
    garrisonDeckId: 'deck_red_inferno',
    baseGarrisonHp: 54,
    loreSnippet: 'Lagos de magma iluminam as nuvens negras dia e noite na encosta ocidental.',
    microSettlements: [
      { name: 'Mina de Obsidiana Rubra', dx: -2.4, dy: 1.3, kind: 'mine' },
      { name: 'Forte Piroclasto', dx: 2.1, dy: 1.9, kind: 'watchtower' },
    ],
  },
  {
    id: 'prov_pyros_sky_corridor',
    name: 'Corredor Aéreo das Armadas',
    regionLabel: 'Céus do Nordeste de Pyros',
    initialOwner: 'pyros',
    domain: 'red',
    x: 58.5,
    y: 20,
    terrainKind: 'skyway',
    terrainLabel: 'Ninho das Armadas',
    neighbors: [
      'prov_vortex_polar_spire',
      'prov_vortex_glass_spires',
      'prov_vortex_sapphire_monolith',
      'prov_pyros_split_anvil',
      'prov_pyros_east_crater',
    ],
    supplyIncome: 50,
    strategicBonusTitle: 'Ninho Alado: Voo & Armadas +1⚔️',
    strategicBonusDesc: 'Criaturas com Voo, Sopro ou Armadas Dracônicas recebem +1⚔️ ATQ ao entrar nos Cercos.',
    garrisonCommander: 'Almirante Drakkon',
    garrisonTitle: 'Comandante da Esquadra Rubra',
    garrisonAvatarCardId: 'red_172_armada_draconica_chama',
    garrisonDeckId: 'deck_squad_siege_battery',
    baseGarrisonHp: 54,
    loreSnippet: 'Correntes térmicas ascendentes sustentam frotas inteiras de dragões encouraçados.',
    microSettlements: [
      { name: 'Poleiro das Escamas', dx: -1.7, dy: 1.4, kind: 'watchtower' },
      { name: 'Forja de Arpéus', dx: 2.2, dy: 1.1, kind: 'mine' },
    ],
  },
  {
    id: 'prov_pyros_east_crater',
    name: 'Cratera da Bateria Astral',
    regionLabel: 'Pyros Oriental',
    initialOwner: 'pyros',
    domain: 'red',
    x: 60.5,
    y: 31.5,
    terrainKind: 'mountain_pass',
    terrainLabel: 'Cratera Fortificada',
    neighbors: [
      'prov_pyros_split_anvil',
      'prov_pyros_sky_corridor',
      'prov_solaria_dragon_gates',
      'prov_matrix_ne_prism',
    ],
    supplyIncome: 45,
    strategicBonusTitle: 'Artilharia da Cratera (+1 Dano Abertura)',
    strategicBonusDesc: 'Soma +1 de dano de cerco inicial contra qualquer comandante inimigo.',
    garrisonCommander: 'Vulcanor da Bateria',
    garrisonTitle: 'Artilheiro-Mor do Leste',
    garrisonAvatarCardId: 'red_08_dragao_vermelho',
    garrisonDeckId: 'deck_squad_siege_battery',
    baseGarrisonHp: 52,
    loreSnippet: 'Canhões rúnicos fundidos na rocha viva vigiam os passos que descem rumo a Solária.',
    microSettlements: [
      { name: 'Reduto de Bronze', dx: 2.0, dy: 1.5, kind: 'watchtower' },
      { name: 'Poço de Enxofre', dx: -2.1, dy: 0.9, kind: 'mine' },
    ],
  },

  // ===================== 3. VALE DO ECLIPSE (OESTE PROFUNDO) =====================
  {
    id: 'prov_eclipse_obsidian_cathedral',
    name: 'Catedral Gótica de Obsidiana',
    regionLabel: 'Coração do Vale do Eclipse • Capital',
    initialOwner: 'eclipse',
    domain: 'purple',
    x: 28,
    y: 50,
    isCapital: true,
    terrainKind: 'citadel',
    terrainLabel: 'Capital & Catedral Umbral',
    neighbors: [
      'prov_eclipse_abyssal_gorge',
      'prov_eclipse_twilight_scarp',
      'prov_eclipse_blood_ossuary',
      'prov_eclipse_black_marsh',
      'prov_matrix_west_ring',
    ],
    supplyIncome: 85,
    strategicBonusTitle: 'Selo de Obsidiana: +3 Dreno de Abertura',
    strategicBonusDesc: 'Causa 3 de dano sombrio inicial ao comandante rival ao abrir qualquer Cerco.',
    garrisonCommander: 'Morgath-Zul & Juiz de Obsidiana',
    garrisonTitle: 'Soberano do Trono Umbral',
    garrisonAvatarCardId: 'purple_173_general_roda_abismo',
    garrisonDeckId: 'deck_tri_blood_moon',
    baseGarrisonHp: 75,
    loreSnippet: 'Torres negras perfuram o nevoeiro violeta onde sinos silenciosos convocam os caídos.',
    microSettlements: [
      { name: 'Claustro das Cinzas', dx: -2.5, dy: -1.6, kind: 'shrine' },
      { name: 'Vila Nocturna', dx: 2.3, dy: 1.8, kind: 'village' },
      { name: 'Torre do Inquisidor', dx: -1.8, dy: 2.4, kind: 'watchtower' },
    ],
  },
  {
    id: 'prov_eclipse_abyssal_gorge',
    name: 'Desfiladeiro da Fenda Abissal',
    regionLabel: 'Noroeste do Eclipse',
    initialOwner: 'eclipse',
    domain: 'purple',
    x: 21.5,
    y: 38,
    terrainKind: 'mountain_pass',
    terrainLabel: 'Cânion Sombrio',
    neighbors: [
      'prov_vortex_dead_stars',
      'prov_pyros_west_caldera',
      'prov_eclipse_twilight_scarp',
      'prov_eclipse_obsidian_cathedral',
    ],
    supplyIncome: 40,
    strategicBonusTitle: 'Emboscada do Cânion',
    strategicBonusDesc: 'Gargalo estreito que protege o norte do Vale do Eclipse contra invasões.',
    garrisonCommander: 'Imperador-Lich Malakor',
    garrisonTitle: 'Senhor da Fenda Profunda',
    garrisonAvatarCardId: 'purple_07_lich',
    garrisonDeckId: 'deck_purple_abyss',
    baseGarrisonHp: 50,
    loreSnippet: 'Pontes pênseis cruzam abismos sem fundo de onde sussurram legiões antigas.',
    microSettlements: [
      { name: 'Ponte das Almas', dx: 2.1, dy: -1.4, kind: 'watchtower' },
      { name: 'Cripta Escavada', dx: -2.0, dy: 1.7, kind: 'shrine' },
    ],
  },
  {
    id: 'prov_eclipse_twilight_scarp',
    name: 'Escarpa do Sol Carmesim',
    regionLabel: 'Fronteira Eclipse–Matriz',
    initialOwner: 'eclipse',
    domain: 'purple',
    x: 35,
    y: 43,
    terrainKind: 'mountain_pass',
    terrainLabel: 'Escarpa Fortificada',
    neighbors: [
      'prov_pyros_west_caldera',
      'prov_eclipse_abyssal_gorge',
      'prov_eclipse_obsidian_cathedral',
      'prov_matrix_nw_monolith',
      'prov_matrix_west_ring',
    ],
    supplyIncome: 45,
    strategicBonusTitle: 'Muralha Crepuscular',
    strategicBonusDesc: 'Posição elevada que domina a estrada oeste rumo à Fronteira Cinzenta.',
    garrisonCommander: 'Condessa Carmilla do Eclipse',
    garrisonTitle: 'Dama da Escarpa Rubra',
    garrisonAvatarCardId: 'purple_172_armada_draconica_abismo',
    garrisonDeckId: 'deck_tri_crimson_sun',
    baseGarrisonHp: 52,
    loreSnippet: 'No crepúsculo perpétuo desta escarpa, o sol poente tinge a pedra de carmesim.',
    microSettlements: [
      { name: 'Forte Crepúsculo', dx: 1.8, dy: 1.5, kind: 'watchtower' },
      { name: 'Mina de Prata Negra', dx: -2.1, dy: -1.3, kind: 'mine' },
    ],
  },
  {
    id: 'prov_eclipse_blood_ossuary',
    name: 'Ossário Real da Costa',
    regionLabel: 'Litoral Sudoeste do Eclipse',
    initialOwner: 'eclipse',
    domain: 'purple',
    x: 20,
    y: 63.5,
    terrainKind: 'port',
    terrainLabel: 'Porto Necrópole',
    neighbors: ['prov_eclipse_obsidian_cathedral', 'prov_eclipse_black_marsh'],
    supplyIncome: 55,
    strategicBonusTitle: 'Frota Fantasma (+55⚙️)',
    strategicBonusDesc: 'Gera tributos marítimos pesados no litoral ocidental.',
    garrisonCommander: 'Nyx, Sacerdotisa da Maré Negra',
    garrisonTitle: 'Guardiã das Costelas de Titã',
    garrisonAvatarCardId: 'purple_07_lich',
    garrisonDeckId: 'deck_dual_iron_inquisition',
    baseGarrisonHp: 48,
    loreSnippet: 'Navios ancoram sob as costelas colossais de leviatãs primordiais encalhados.',
    microSettlements: [
      { name: 'Cais de Marfim', dx: -2.2, dy: 1.8, kind: 'harbor' },
      { name: 'Relicário Costeiro', dx: 2.0, dy: -1.5, kind: 'shrine' },
    ],
  },
  {
    id: 'prov_eclipse_black_marsh',
    name: 'Pântano Negro sob o Eclipse',
    regionLabel: 'Fronteira Sul Eclipse–Veridia',
    initialOwner: 'eclipse',
    domain: 'purple',
    x: 29.5,
    y: 69,
    terrainKind: 'marsh',
    terrainLabel: 'Pântano Umbral',
    neighbors: [
      'prov_eclipse_obsidian_cathedral',
      'prov_eclipse_blood_ossuary',
      'prov_matrix_west_ring',
      'prov_veridia_thorn_woods',
      'prov_veridia_fang_peninsula',
    ],
    supplyIncome: 40,
    strategicBonusTitle: 'Miasma da Fronteira (+2❤️ PV)',
    strategicBonusDesc: 'Concede +2❤️ PV adicionais ao seu Soberano pela resiliência alquímica do pântano.',
    garrisonCommander: 'Pestilento Vorghul',
    garrisonTitle: 'Senhor das Águas Turvas',
    garrisonAvatarCardId: 'purple_06_tirano_ocular',
    garrisonDeckId: 'deck_dual_eternal_rot',
    baseGarrisonHp: 50,
    loreSnippet: 'Onde as raízes de Veridia apodrecem sob a névoa roxa, apenas os pactuários conhecem o caminho.',
    microSettlements: [
      { name: 'Aldeia Palafita', dx: -1.9, dy: 1.6, kind: 'village' },
      { name: 'Altar do Miasma', dx: 2.1, dy: -1.2, kind: 'shrine' },
    ],
  },

  // ===================== 4. FRONTEIRA CINZENTA (CENTRO AXIAL) =====================
  {
    id: 'prov_matrix_five_seals',
    name: 'Torre dos Cinco Selos',
    regionLabel: 'Umbigo Axial de Vaeloria • Capital',
    initialOwner: 'matrix',
    domain: 'neutral',
    x: 50,
    y: 50.5,
    isCapital: true,
    terrainKind: 'citadel',
    terrainLabel: 'Capital Axial Suprema',
    neighbors: [
      'prov_matrix_nw_monolith',
      'prov_matrix_ne_prism',
      'prov_matrix_west_ring',
      'prov_matrix_east_tribunal',
      'prov_veridia_thorn_woods',
      'prov_veridia_mother_tree',
    ],
    supplyIncome: 95,
    strategicBonusTitle: 'Selo Axial: Lendas +1🛡️/+1♻️',
    strategicBonusDesc: 'Criaturas Lendárias e Generais da Roda entram com +1🛡️ Armadura e +1♻️ Regeneração.',
    garrisonCommander: 'Vaelkor, Árbitro da Roda Matriz',
    garrisonTitle: 'Regente Supremo do Eixo',
    garrisonAvatarCardId: 'neutral_173_general_roda_matriz',
    garrisonDeckId: 'deck_penta_valkyra_pact',
    baseGarrisonHp: 82,
    loreSnippet: 'O centro exato do mundo, onde cinco estradas elementais convergem sob a Roda de Oito Raios.',
    microSettlements: [
      { name: 'Arena Circular do Pacto', dx: 0, dy: 2.5, kind: 'shrine' },
      { name: 'Bastilha Cinzenta Norte', dx: -2.2, dy: -1.7, kind: 'watchtower' },
      { name: 'Bastilha Cinzenta Leste', dx: 2.3, dy: -1.5, kind: 'watchtower' },
    ],
  },
  {
    id: 'prov_matrix_nw_monolith',
    name: 'Monólito da Primeira Torre',
    regionLabel: 'Fronteira Cinzenta Noroeste',
    initialOwner: 'matrix',
    domain: 'neutral',
    x: 44.5,
    y: 41.5,
    terrainKind: 'sanctuary',
    terrainLabel: 'Monólito Prismático',
    neighbors: [
      'prov_pyros_split_anvil',
      'prov_pyros_west_caldera',
      'prov_eclipse_twilight_scarp',
      'prov_matrix_west_ring',
      'prov_matrix_five_seals',
      'prov_matrix_ne_prism',
    ],
    supplyIncome: 45,
    strategicBonusTitle: 'Pilar Cinzento Ocidental',
    strategicBonusDesc: 'Encruzilhada vital entre Pyros, o Vale do Eclipse e o coração axial.',
    garrisonCommander: 'Valkyra da Vigília Cinzenta',
    garrisonTitle: 'Sentinela do Primeiro Selo',
    garrisonAvatarCardId: 'neutral_10_valkyra_pentacromatica',
    garrisonDeckId: 'deck_spec_pentachromatic',
    baseGarrisonHp: 56,
    loreSnippet: 'Um obelisco translúcido que refrata a cinza vulcânica em feixes prateados.',
    microSettlements: [
      { name: 'Vigia do Prisma', dx: -1.8, dy: -1.4, kind: 'watchtower' },
      { name: 'Santuário Cinzento', dx: 1.6, dy: 1.5, kind: 'shrine' },
    ],
  },
  {
    id: 'prov_matrix_ne_prism',
    name: 'Monólito do Prisma Infinito',
    regionLabel: 'Fronteira Cinzenta Nordeste',
    initialOwner: 'matrix',
    domain: 'neutral',
    x: 56,
    y: 41.5,
    terrainKind: 'sanctuary',
    terrainLabel: 'Monólito Prismático',
    neighbors: [
      'prov_pyros_split_anvil',
      'prov_pyros_east_crater',
      'prov_solaria_dragon_gates',
      'prov_solaria_great_dome',
      'prov_matrix_east_tribunal',
      'prov_matrix_five_seals',
      'prov_matrix_nw_monolith',
    ],
    supplyIncome: 45,
    strategicBonusTitle: 'Pilar Cinzento Oriental',
    strategicBonusDesc: 'Domina as rotas centrais que ligam Pyros e Solária ao trono axial.',
    garrisonCommander: 'Almirante da Matriz',
    garrisonTitle: 'Comandante da Esquadra Prismática',
    garrisonAvatarCardId: 'neutral_172_armada_draconica_matriz',
    garrisonDeckId: 'deck_spec_pentachromatic',
    baseGarrisonHp: 56,
    loreSnippet: 'Espelhos suspensos em levitação silenciosa guardam a passagem nordeste do platô.',
    microSettlements: [
      { name: 'Torre Refratora', dx: 1.9, dy: -1.4, kind: 'watchtower' },
      { name: 'Mina de Éter', dx: -1.7, dy: 1.3, kind: 'mine' },
    ],
  },
  {
    id: 'prov_matrix_west_ring',
    name: 'Anel Ocidental dos Pactuários',
    regionLabel: 'Platô Cinzento Sudoeste',
    initialOwner: 'matrix',
    domain: 'neutral',
    x: 41,
    y: 55.5,
    terrainKind: 'citadel',
    terrainLabel: 'Fortaleza do Anel',
    neighbors: [
      'prov_eclipse_obsidian_cathedral',
      'prov_eclipse_twilight_scarp',
      'prov_eclipse_black_marsh',
      'prov_veridia_thorn_woods',
      'prov_matrix_five_seals',
      'prov_matrix_nw_monolith',
    ],
    supplyIncome: 50,
    strategicBonusTitle: 'Muralha do Anel Oeste (+50⚙️)',
    strategicBonusDesc: 'Escudo ocidental da Torre dos Cinco Selos e entreposto de caravanas.',
    garrisonCommander: 'Tríade da Refração Ocidental',
    garrisonTitle: 'Pactuários do Anel',
    garrisonAvatarCardId: 'neutral_10_valkyra_pentacromatica',
    garrisonDeckId: 'deck_squad_thousand_shields',
    baseGarrisonHp: 54,
    loreSnippet: 'Muralhas circulares de pedra cinza resistem há séculos aos cercos umbrais.',
    microSettlements: [
      { name: 'Mercado da Fronteira', dx: -2.0, dy: 1.5, kind: 'village' },
      { name: 'Guarita do Anel', dx: 1.7, dy: -1.4, kind: 'watchtower' },
    ],
  },
  {
    id: 'prov_matrix_east_tribunal',
    name: 'Tribunal Oriental das Rodas',
    regionLabel: 'Platô Cinzento Sudeste',
    initialOwner: 'matrix',
    domain: 'neutral',
    x: 59,
    y: 55.5,
    terrainKind: 'citadel',
    terrainLabel: 'Fortaleza do Anel',
    neighbors: [
      'prov_matrix_five_seals',
      'prov_matrix_ne_prism',
      'prov_solaria_great_dome',
      'prov_solaria_hanging_gardens',
      'prov_veridia_jade_delta',
      'prov_veridia_mother_tree',
    ],
    supplyIncome: 50,
    strategicBonusTitle: 'Muralha do Anel Leste (+50⚙️)',
    strategicBonusDesc: 'Guarda a travessia leste entre Solária, Veridia e o Centro Axial.',
    garrisonCommander: 'Juízes do Tribunal Cinzento',
    garrisonTitle: 'Guardiões do Leste Axial',
    garrisonAvatarCardId: 'neutral_173_general_roda_matriz',
    garrisonDeckId: 'deck_squad_thousand_shields',
    baseGarrisonHp: 54,
    loreSnippet: 'Oito colunas de granito marcam o antigo pátio de julgamento dos soberanos.',
    microSettlements: [
      { name: 'Pátio dos Oito Marcos', dx: 1.8, dy: 1.4, kind: 'shrine' },
      { name: 'Forte da Estrada Real', dx: -1.8, dy: -1.5, kind: 'watchtower' },
    ],
  },

  // ===================== 5. SOLÁRIA (LESTE ALTO) =====================
  {
    id: 'prov_solaria_great_dome',
    name: 'Grande Domo da Cidadela Solar',
    regionLabel: 'Solária Central • Capital',
    initialOwner: 'solaria',
    domain: 'gold',
    x: 72,
    y: 44,
    isCapital: true,
    terrainKind: 'citadel',
    terrainLabel: 'Capital & Domo de Mármore',
    neighbors: [
      'prov_solaria_eternal_reliquary',
      'prov_solaria_dragon_gates',
      'prov_solaria_zenith_mirrors',
      'prov_solaria_hanging_gardens',
      'prov_matrix_ne_prism',
      'prov_matrix_east_tribunal',
    ],
    supplyIncome: 85,
    strategicBonusTitle: 'Selo Solar: +1🛡️ Armadura na Vanguarda',
    strategicBonusDesc: 'A primeira unidade de cada coluna na Vanguarda recebe +1🛡️ Armadura ao entrar.',
    garrisonCommander: 'Aurelius & General da Roda Solar',
    garrisonTitle: 'Alto Regente da Alvorada',
    garrisonAvatarCardId: 'gold_173_general_roda_sol',
    garrisonDeckId: 'deck_tri_eternal_reliquary',
    baseGarrisonHp: 76,
    loreSnippet: 'Sob a cúpula dourada visível a léguas no oceano, falanges reluzentes juram ordem eterna.',
    microSettlements: [
      { name: 'Praça da Alvorada', dx: -2.2, dy: 1.6, kind: 'village' },
      { name: 'Basílica Dourada', dx: 0.4, dy: -2.3, kind: 'shrine' },
      { name: 'Torre dos Escudos', dx: 2.4, dy: 1.7, kind: 'watchtower' },
    ],
  },
  {
    id: 'prov_solaria_eternal_reliquary',
    name: 'Santuário do Relicário Eterno',
    regionLabel: 'Alto Norte de Solária',
    initialOwner: 'solaria',
    domain: 'gold',
    x: 76,
    y: 33,
    terrainKind: 'sanctuary',
    terrainLabel: 'Santuário & Cofre Real',
    neighbors: [
      'prov_vortex_sapphire_monolith',
      'prov_solaria_dragon_gates',
      'prov_solaria_great_dome',
      'prov_solaria_zenith_mirrors',
    ],
    supplyIncome: 65,
    strategicBonusTitle: 'Cofres Solares (+65⚙️)',
    strategicBonusDesc: 'A província não-capital mais rica em tributos de ouro e suprimentos de Vaeloria.',
    garrisonCommander: 'Seraphiel, Custódio das Relíquias',
    garrisonTitle: 'Guardião dos Cofres Celestes',
    garrisonAvatarCardId: 'gold_09_serafim_solar',
    garrisonDeckId: 'deck_gold_bastion',
    baseGarrisonHp: 52,
    loreSnippet: 'Cofres de mármore branco guardam cálices, estandartes e armaduras da Primeira Era.',
    microSettlements: [
      { name: 'Abadia Branca', dx: -1.9, dy: -1.4, kind: 'shrine' },
      { name: 'Mina de Ouro Puro', dx: 2.2, dy: 1.5, kind: 'mine' },
    ],
  },
  {
    id: 'prov_solaria_dragon_gates',
    name: 'Portões das Escamas Imperiais',
    regionLabel: 'Cordilheira Piro-Solar',
    initialOwner: 'solaria',
    domain: 'gold',
    x: 66,
    y: 35,
    terrainKind: 'mountain_pass',
    terrainLabel: 'Portão de Cordilheira',
    neighbors: [
      'prov_pyros_east_crater',
      'prov_matrix_ne_prism',
      'prov_solaria_eternal_reliquary',
      'prov_solaria_great_dome',
    ],
    supplyIncome: 45,
    strategicBonusTitle: 'Bastião da Cordilheira',
    strategicBonusDesc: 'Tranca a invasão terrestre vinda das crateras orientais de Pyros.',
    garrisonCommander: 'Vaelgor dos Portões Dourados',
    garrisonTitle: 'Mestre dos Autômatos e Dragões Solares',
    garrisonAvatarCardId: 'gold_07_dragao_ouro',
    garrisonDeckId: 'deck_tri_celestial_scales',
    baseGarrisonHp: 54,
    loreSnippet: 'Portas duplas de bronze de trinta metros separam a fuligem de Pyros dos terraços solares.',
    microSettlements: [
      { name: 'Muralha de Bronze', dx: -2.0, dy: -1.3, kind: 'watchtower' },
      { name: 'Vila da Guarnição', dx: 1.9, dy: 1.6, kind: 'village' },
    ],
  },
  {
    id: 'prov_solaria_zenith_mirrors',
    name: 'Torres dos Espelhos do Zênite',
    regionLabel: 'Falésias Orientais de Solária',
    initialOwner: 'solaria',
    domain: 'gold',
    x: 84,
    y: 44,
    terrainKind: 'port',
    terrainLabel: 'Falésias & Espelhos',
    neighbors: [
      'prov_solaria_eternal_reliquary',
      'prov_solaria_great_dome',
      'prov_solaria_hanging_gardens',
    ],
    supplyIncome: 55,
    strategicBonusTitle: 'Feixe dos Espelhos (+2 Dano Abertura)',
    strategicBonusDesc: 'Concentra luz solar para causar +2 de dano inicial contra o comandante inimigo nos Cercos.',
    garrisonCommander: 'Almirante Helios do Zênite',
    garrisonTitle: 'Comandante da Armada Solar',
    garrisonAvatarCardId: 'gold_172_armada_draconica_sol',
    garrisonDeckId: 'deck_gold_bastion',
    baseGarrisonHp: 52,
    loreSnippet: 'Lentes monumentais nas falésias incendeiam velas inimigas antes que toquem a costa.',
    microSettlements: [
      { name: 'Porto da Alvorada', dx: 2.1, dy: 2.0, kind: 'harbor' },
      { name: 'Lente Maior', dx: -1.6, dy: -1.7, kind: 'watchtower' },
    ],
  },
  {
    id: 'prov_solaria_hanging_gardens',
    name: 'Jardins Suspensos da Aurora',
    regionLabel: 'Fronteira Sul Solária–Veridia',
    initialOwner: 'solaria',
    domain: 'gold',
    x: 73.5,
    y: 57.5,
    terrainKind: 'forest',
    terrainLabel: 'Terraços & Aquedutos',
    neighbors: [
      'prov_solaria_great_dome',
      'prov_solaria_zenith_mirrors',
      'prov_matrix_east_tribunal',
      'prov_veridia_jade_delta',
    ],
    supplyIncome: 50,
    strategicBonusTitle: 'Aquedutos Dourados (+2❤️ PV)',
    strategicBonusDesc: 'Águas consagradas concedem +2❤️ PV adicionais ao seu Soberano nos Cercos.',
    garrisonCommander: 'Arconte Celestia',
    garrisonTitle: 'Protetora dos Terraços Silvestres',
    garrisonAvatarCardId: 'gold_09_serafim_solar',
    garrisonDeckId: 'deck_dual_solar_wild',
    baseGarrisonHp: 50,
    loreSnippet: 'Cachoeiras descem de aquedutos de mármore alimentando pomares luminosos.',
    microSettlements: [
      { name: 'Vila dos Aquedutos', dx: -2.0, dy: 1.4, kind: 'village' },
      { name: 'Fonte Solar', dx: 2.1, dy: -1.3, kind: 'shrine' },
    ],
  },

  // ===================== 6. VERIDIA (SUL SELVAGEM) =====================
  {
    id: 'prov_veridia_mother_tree',
    name: 'Santuário da Árvore-Mãe',
    regionLabel: 'Coração de Veridia • Capital',
    initialOwner: 'veridia',
    domain: 'green',
    x: 50.5,
    y: 74,
    isCapital: true,
    terrainKind: 'sanctuary',
    terrainLabel: 'Capital & Árvore-Mundo',
    neighbors: [
      'prov_matrix_five_seals',
      'prov_matrix_east_tribunal',
      'prov_veridia_thorn_woods',
      'prov_veridia_jade_delta',
      'prov_veridia_fang_peninsula',
      'prov_veridia_emerald_canopy',
    ],
    supplyIncome: 85,
    strategicBonusTitle: 'Selo Primevo: +6❤️ PV do Soberano',
    strategicBonusDesc: 'Seu Soberano entra em todas as batalhas de Cerco com +6❤️ PV Máximo e Inicial.',
    garrisonCommander: 'Sylvanor & General da Roda Primeva',
    garrisonTitle: 'Soberano das Raízes de Ferro',
    garrisonAvatarCardId: 'green_173_general_roda_selva',
    garrisonDeckId: 'deck_tri_primal_titans',
    baseGarrisonHp: 78,
    loreSnippet: 'Suas raízes de ferro sustentam o continente sul e sua copa toca as nuvens.',
    microSettlements: [
      { name: 'Cidadela da Galhada', dx: 0, dy: -2.4, kind: 'shrine' },
      { name: 'Aldeia das Raízes', dx: -2.5, dy: 1.7, kind: 'village' },
      { name: 'Atalaia Silvestre', dx: 2.4, dy: 1.5, kind: 'watchtower' },
    ],
  },
  {
    id: 'prov_veridia_thorn_woods',
    name: 'Matas Espinhosas do Norte',
    regionLabel: 'Veridia Noroeste',
    initialOwner: 'veridia',
    domain: 'green',
    x: 40,
    y: 68.5,
    terrainKind: 'forest',
    terrainLabel: 'Selva Espinhosa',
    neighbors: [
      'prov_eclipse_black_marsh',
      'prov_matrix_west_ring',
      'prov_matrix_five_seals',
      'prov_veridia_mother_tree',
      'prov_veridia_fang_peninsula',
    ],
    supplyIncome: 45,
    strategicBonusTitle: 'Trincheira de Espinhos',
    strategicBonusDesc: 'Barreira natural densa que protege o acesso ocidental à Árvore-Mãe.',
    garrisonCommander: 'Gorgoroth das Três Matas',
    garrisonTitle: 'Guardião dos Espinheiros',
    garrisonAvatarCardId: 'green_09_hidra',
    garrisonDeckId: 'deck_green_wild',
    baseGarrisonHp: 52,
    loreSnippet: 'Cipós grossos como muralhas fecham as trilhas contra qualquer exército estrangeiro.',
    microSettlements: [
      { name: 'Forte Espinheiro', dx: -2.0, dy: -1.4, kind: 'watchtower' },
      { name: 'Clareira dos Druidas', dx: 1.9, dy: 1.5, kind: 'shrine' },
    ],
  },
  {
    id: 'prov_veridia_jade_delta',
    name: 'Delta dos Rios de Jade',
    regionLabel: 'Veridia Nordeste',
    initialOwner: 'veridia',
    domain: 'green',
    x: 62,
    y: 70,
    terrainKind: 'port',
    terrainLabel: 'Delta Fluvial',
    neighbors: [
      'prov_matrix_east_tribunal',
      'prov_solaria_hanging_gardens',
      'prov_veridia_mother_tree',
      'prov_veridia_emerald_canopy',
    ],
    supplyIncome: 55,
    strategicBonusTitle: 'Rotas de Jade (+55⚙️)',
    strategicBonusDesc: 'Fértil bacia fluvial que abastece os exércitos do sul com provisões abundantes.',
    garrisonCommander: 'Senhora das Escamas Verdes',
    garrisonTitle: 'Comandante da Esquadra da Selva',
    garrisonAvatarCardId: 'green_172_armada_draconica_selva',
    garrisonDeckId: 'deck_dual_wild_evolution',
    baseGarrisonHp: 52,
    loreSnippet: 'Águas cor de esmeralda serpenteiam entre ruínas cobertas de musgo dourado.',
    microSettlements: [
      { name: 'Porto Fluvial de Jade', dx: 2.3, dy: 1.4, kind: 'harbor' },
      { name: 'Vila das Águas', dx: -1.8, dy: 1.2, kind: 'village' },
    ],
  },
  {
    id: 'prov_veridia_fang_peninsula',
    name: 'Península das Presas',
    regionLabel: 'Extremo Sudoeste de Veridia',
    initialOwner: 'veridia',
    domain: 'green',
    x: 37,
    y: 83.5,
    terrainKind: 'port',
    terrainLabel: 'Costa Selvagem',
    neighbors: [
      'prov_eclipse_black_marsh',
      'prov_veridia_thorn_woods',
      'prov_veridia_mother_tree',
      'prov_veridia_emerald_canopy',
    ],
    supplyIncome: 50,
    strategicBonusTitle: 'Feras Costeiras (+50⚙️)',
    strategicBonusDesc: 'Ancoradouro natural protegido por recifes em forma de presas.',
    garrisonCommander: 'Kaor, Domador de Behemoths',
    garrisonTitle: 'Vigia do Mar Austral',
    garrisonAvatarCardId: 'green_03_ursogrifo',
    garrisonDeckId: 'deck_dual_primal_fury',
    baseGarrisonHp: 48,
    loreSnippet: 'Recifes pontiagudos guardam enseadas secretas onde feras colossais caçam.',
    microSettlements: [
      { name: 'Enseada da Presa', dx: -2.2, dy: 1.7, kind: 'harbor' },
      { name: 'Acampamento Feral', dx: 2.0, dy: -1.4, kind: 'village' },
    ],
  },
  {
    id: 'prov_veridia_emerald_canopy',
    name: 'Dossel Esmeralda Oriental',
    regionLabel: 'Extremo Sudeste de Veridia',
    initialOwner: 'veridia',
    domain: 'green',
    x: 58,
    y: 83,
    terrainKind: 'forest',
    terrainLabel: 'Selva Profunda',
    neighbors: [
      'prov_veridia_mother_tree',
      'prov_veridia_jade_delta',
      'prov_veridia_fang_peninsula',
    ],
    supplyIncome: 45,
    strategicBonusTitle: 'Reserva Vital (+2❤️ PV)',
    strategicBonusDesc: 'Ervas ancestrais do dossel somam +2❤️ PV ao seu Soberano nos Cercos.',
    garrisonCommander: 'Ancião Thalos da Galhada',
    garrisonTitle: 'Protetor do Sul Profundo',
    garrisonAvatarCardId: 'green_09_hidra',
    garrisonDeckId: 'deck_green_wild',
    baseGarrisonHp: 48,
    loreSnippet: 'Sob copas tão fechadas que criam um mundo próprio, templos verdes dormem intocados.',
    microSettlements: [
      { name: 'Santuário Esmeralda', dx: 1.9, dy: 1.3, kind: 'shrine' },
      { name: 'Mina de Âmbar Vivo', dx: -2.1, dy: -1.1, kind: 'mine' },
    ],
  },
];

export const CONQUEST_PROVINCES_BY_ID: Record<string, ConquestProvinceDef> = Object.fromEntries(
  CONQUEST_PROVINCES.map((p) => [p.id, p])
);

// ============================================================================
// GEOMETRIA GEOPOLÍTICA (VORONOI RECORTADO + BORDAS ORGÂNICAS COMPARTILHADAS)
// ============================================================================

interface Point2D {
  x: number;
  y: number;
}

export interface ComputedProvinceGeometry {
  provinceId: string;
  svgPath: string;
  centroid: Point2D;
}

export interface SharedProvinceBorder {
  key: string;
  provA: string;
  provB: string;
  svgPath: string;
}

// Contornos continentais calibrados sobre vaeloria_world_map.jpg (em % 0..100)
const MAIN_CONTINENT_SILHOUETTE_PCT: Point2D[] = [
  { x: 35, y: 18 },
  { x: 50, y: 17.2 },
  { x: 64, y: 18.2 },
  { x: 76, y: 25 },
  { x: 86, y: 35 },
  { x: 89.5, y: 45 },
  { x: 86.5, y: 56 },
  { x: 79, y: 65.5 },
  { x: 69, y: 78 },
  { x: 62, y: 88.5 },
  { x: 49, y: 91.5 },
  { x: 34, y: 89.5 },
  { x: 24, y: 79 },
  { x: 15.5, y: 67 },
  { x: 14.5, y: 51 },
  { x: 16.5, y: 35 },
  { x: 25, y: 24 },
];

const POLAR_ARCHIPELAGO_SILHOUETTE_PCT: Point2D[] = [
  { x: 26, y: 11 },
  { x: 38, y: 5.5 },
  { x: 50, y: 4.5 },
  { x: 65, y: 6.2 },
  { x: 78, y: 12.5 },
  { x: 79.5, y: 22.5 },
  { x: 68, y: 24.5 },
  { x: 51, y: 18.5 },
  { x: 35, y: 25.5 },
  { x: 22.5, y: 25.5 },
  { x: 22, y: 17.5 },
];

function clipPolygonHalfPlane(
  poly: Point2D[],
  midX: number,
  midY: number,
  nx: number,
  ny: number
): Point2D[] {
  if (poly.length === 0) return [];
  const out: Point2D[] = [];
  for (let i = 0; i < poly.length; i++) {
    const cur = poly[i];
    const prev = poly[(i + poly.length - 1) % poly.length];
    const dCur = (cur.x - midX) * nx + (cur.y - midY) * ny;
    const dPrev = (prev.x - midX) * nx + (prev.y - midY) * ny;
    const curInside = dCur <= 1e-5;
    const prevInside = dPrev <= 1e-5;

    if (curInside !== prevInside) {
      const denom = dPrev - dCur;
      const t = Math.abs(denom) > 1e-9 ? dPrev / denom : 0.5;
      out.push({
        x: prev.x + (cur.x - prev.x) * t,
        y: prev.y + (cur.y - prev.y) * t,
      });
    }
    if (curInside) {
      out.push(cur);
    }
  }
  return out;
}

function deterministicHash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

/**
 * Subdivide o segmento (p1 -> p2) de forma determinística e simétrica:
 * chamar com (p1, p2) e com (p2, p1) gera exatamente a mesma linha quebrada invertida,
 * garantindo encaixe perfeito (0px de fresta) com aspecto orgânico de rio/cordilheira!
 */
function buildOrganicEdgePoints(p1: Point2D, p2: Point2D): Point2D[] {
  const k1 = `${Math.round(p1.x)},${Math.round(p1.y)}`;
  const k2 = `${Math.round(p2.x)},${Math.round(p2.y)}`;
  const forward = k1 < k2;
  const a = forward ? p1 : p2;
  const b = forward ? p2 : p1;

  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  if (len < 36) {
    return [p1, p2];
  }

  const px = -dy / len;
  const py = dx / len;
  const maxAmp = Math.min(20, len * 0.085);
  const seedBase = `${k1 < k2 ? k1 : k2}|${k1 < k2 ? k2 : k1}`;

  const o1 = (deterministicHash(`${seedBase}:1`) - 0.5) * 2 * maxAmp;
  const o2 = (deterministicHash(`${seedBase}:2`) - 0.5) * 2 * maxAmp;
  const o3 = (deterministicHash(`${seedBase}:3`) - 0.5) * 2 * maxAmp;

  const mids: Point2D[] = [
    { x: a.x + dx * 0.25 + px * o1, y: a.y + dy * 0.25 + py * o1 },
    { x: a.x + dx * 0.5 + px * o2, y: a.y + dy * 0.5 + py * o2 },
    { x: a.x + dx * 0.75 + px * o3, y: a.y + dy * 0.75 + py * o3 },
  ];

  return forward ? [p1, ...mids, p2] : [p1, ...mids.reverse(), p2];
}

function pointsToSvgPath(pts: Point2D[], closePath: boolean): string {
  if (pts.length === 0) return '';
  const parts = [`M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`];
  for (let i = 1; i < pts.length; i++) {
    parts.push(`L ${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)}`);
  }
  if (closePath) parts.push('Z');
  return parts.join(' ');
}

let cachedGeometries: {
  provinces: Record<string, ComputedProvinceGeometry>;
  sharedBorders: SharedProvinceBorder[];
} | null = null;

export function getConquestMapGeometries(): {
  provinces: Record<string, ComputedProvinceGeometry>;
  sharedBorders: SharedProvinceBorder[];
} {
  if (cachedGeometries) return cachedGeometries;

  const scalePoly = (pctPoly: Point2D[]): Point2D[] =>
    pctPoly.map((pt) => ({
      x: (pt.x / 100) * CONQUEST_MAP_WIDTH,
      y: (pt.y / 100) * CONQUEST_MAP_HEIGHT,
    }));

  const mainBase = scalePoly(MAIN_CONTINENT_SILHOUETTE_PCT);
  const polarBase = scalePoly(POLAR_ARCHIPELAGO_SILHOUETTE_PCT);

  const seeds = CONQUEST_PROVINCES.map((p) => ({
    prov: p,
    sx: (p.x / 100) * CONQUEST_MAP_WIDTH,
    sy: (p.y / 100) * CONQUEST_MAP_HEIGHT,
    isPolar: p.initialOwner === 'vortex',
  }));

  const rawPolys: Record<string, Point2D[]> = {};

  for (const s of seeds) {
    // Polar islands clip against the polar silhouette + polar rivals; continental provinces clip against main continent + continental rivals
    let cell = (s.isPolar ? polarBase : mainBase).map((pt) => ({ ...pt }));

    for (const other of seeds) {
      if (other.prov.id === s.prov.id) continue;
      if (other.isPolar !== s.isPolar) continue;
      const midX = (s.sx + other.sx) / 2;
      const midY = (s.sy + other.sy) / 2;
      const nx = other.sx - s.sx;
      const ny = other.sy - s.sy;
      cell = clipPolygonHalfPlane(cell, midX, midY, nx, ny);
      if (cell.length === 0) break;
    }
    rawPolys[s.prov.id] = cell;
  }

  const provinces: Record<string, ComputedProvinceGeometry> = {};
  const edgeOwnerMap = new Map<
    string,
    { p1: Point2D; p2: Point2D; owners: string[] }
  >();

  for (const s of seeds) {
    const poly = rawPolys[s.prov.id] ?? [];
    const organicOutline: Point2D[] = [];

    for (let i = 0; i < poly.length; i++) {
      const a = poly[i];
      const b = poly[(i + 1) % poly.length];
      if (Math.hypot(b.x - a.x, b.y - a.y) < 2) continue;

      const ka = `${Math.round(a.x / 3) * 3},${Math.round(a.y / 3) * 3}`;
      const kb = `${Math.round(b.x / 3) * 3},${Math.round(b.y / 3) * 3}`;
      const edgeKey = ka < kb ? `${ka}|${kb}` : `${kb}|${ka}`;

      const existing = edgeOwnerMap.get(edgeKey);
      if (existing) {
        if (!existing.owners.includes(s.prov.id)) {
          existing.owners.push(s.prov.id);
        }
      } else {
        edgeOwnerMap.set(edgeKey, { p1: a, p2: b, owners: [s.prov.id] });
      }

      const subPts = buildOrganicEdgePoints(a, b);
      for (let k = 0; k < subPts.length - 1; k++) {
        organicOutline.push(subPts[k]);
      }
    }

    provinces[s.prov.id] = {
      provinceId: s.prov.id,
      svgPath: pointsToSvgPath(organicOutline, true),
      centroid: { x: s.sx, y: s.sy },
    };
  }

  const sharedBorders: SharedProvinceBorder[] = [];
  for (const [edgeKey, info] of edgeOwnerMap.entries()) {
    if (info.owners.length === 2) {
      const subPts = buildOrganicEdgePoints(info.p1, info.p2);
      sharedBorders.push({
        key: edgeKey,
        provA: info.owners[0],
        provB: info.owners[1],
        svgPath: pointsToSvgPath(subPts, false),
      });
    }
  }

  cachedGeometries = { provinces, sharedBorders };
  return cachedGeometries;
}

/**
 * Calcula todos os modificadores reais de combate para um Cerco (ofensivo ou defensivo)
 * com base nas províncias atualmente controladas pelo império do jogador, Bastiões e Crise!
 */
export function buildConquestBattleModifiers(params: {
  targetProvince: ConquestProvinceDef;
  ownedProvinceIds: string[];
  fortifications: Record<string, number>;
  isDefensiveSiege: boolean;
  activeCrisis: ConquestCrisisDef;
}): ConquestBattleModifiers {
  const { targetProvince, ownedProvinceIds, fortifications, isDefensiveSiege, activeCrisis } =
    params;

  let playerBonusHp = 0;
  let playerBonusEssence = 0;
  let enemyOpeningDamage = 0;
  let vanguardArmorBonus = 0;
  let relicDiscount = false;
  let dragonSkyBonus = false;
  let legendaryWheelBonus = false;
  const perks: string[] = [];

  // 1. Capital Seals & Strategic Provinces Held by Player
  if (ownedProvinceIds.includes('prov_veridia_mother_tree')) {
    playerBonusHp += 6;
    perks.push('+6❤️ Árvore-Mãe');
  }
  if (ownedProvinceIds.includes('prov_vortex_polar_spire')) {
    playerBonusEssence += 1;
    perks.push('+1⚡ Selo Polar');
  }
  if (ownedProvinceIds.includes('prov_pyros_split_anvil')) {
    relicDiscount = true;
    perks.push('Relíquias -1⚡');
  }
  if (ownedProvinceIds.includes('prov_eclipse_obsidian_cathedral')) {
    enemyOpeningDamage += 3;
    perks.push('3💀 Dízimo de Obsidiana');
  }
  if (ownedProvinceIds.includes('prov_solaria_great_dome')) {
    vanguardArmorBonus += 1;
    perks.push('+1🛡️ Égide Solar');
  }
  if (ownedProvinceIds.includes('prov_matrix_five_seals')) {
    legendaryWheelBonus = true;
    perks.push('☸ Selo Axial');
  }

  // Secondary strategic provinces
  if (ownedProvinceIds.includes('prov_pyros_west_caldera')) enemyOpeningDamage += 1;
  if (ownedProvinceIds.includes('prov_pyros_east_crater')) enemyOpeningDamage += 1;
  if (ownedProvinceIds.includes('prov_solaria_zenith_mirrors')) enemyOpeningDamage += 2;
  if (ownedProvinceIds.includes('prov_pyros_sky_corridor')) dragonSkyBonus = true;
  if (ownedProvinceIds.includes('prov_eclipse_black_marsh')) playerBonusHp += 2;
  if (ownedProvinceIds.includes('prov_solaria_hanging_gardens')) playerBonusHp += 2;
  if (ownedProvinceIds.includes('prov_veridia_emerald_canopy')) playerBonusHp += 2;

  // 2. Defensive Bastion Fortification Bonus
  if (isDefensiveSiege) {
    const fortLvl = fortifications[targetProvince.id] ?? 0;
    if (fortLvl > 0) {
      const fortHp = fortLvl * 7 + (activeCrisis.effectType === 'polar_winter' ? 5 : 0);
      playerBonusHp += fortHp;
      vanguardArmorBonus += 1;
      perks.push(`🛡️ Bastião Nv.${fortLvl} (+${fortHp}❤️ & +1🛡️)`);
    } else if (activeCrisis.effectType === 'polar_winter') {
      playerBonusHp += 5;
      perks.push('❄️ Inverno Polar (+5❤️)');
    }
  }

  // 3. Continental Crisis Modifiers
  if (activeCrisis.effectType === 'dragon_skyways') {
    dragonSkyBonus = true;
    perks.push('🐉 Revoada (+1⚔️ Voo/Armadas)');
  }
  if (
    activeCrisis.effectType === 'axial_judgment' &&
    ownedProvinceIds.some((id) => CONQUEST_PROVINCES_BY_ID[id]?.initialOwner === 'matrix')
  ) {
    playerBonusHp += 4;
    perks.push('☸ Ressonância Axial (+4❤️)');
  }

  return {
    provinceId: targetProvince.id,
    provinceName: targetProvince.name,
    provinceDomain: targetProvince.domain,
    isDefensiveSiege,
    isCapitalSiege: Boolean(targetProvince.isCapital),
    playerBonusHp,
    playerBonusEssence,
    enemyOpeningDamage,
    vanguardArmorBonus,
    relicDiscount,
    dragonSkyBonus,
    legendaryWheelBonus,
    bannerSummary:
      perks.length > 0
        ? perks.join(' • ')
        : isDefensiveSiege
        ? 'Defesa de Fronteira em andamento!'
        : 'Assalto Continental em andamento!',
  };
}

export function buildConquestBossForProvince(
  province: ConquestProvinceDef,
  ownerFactionId: ConquestFactionId,
  fortificationLevel: number,
  season: number
): CampaignBoss {
  const faction = CONQUEST_FACTIONS[ownerFactionId];
  const seasonScale = Math.min(18, Math.floor((season - 1) * 1.5));
  const fortBonusHp = fortificationLevel * 8;
  const totalHp = province.baseGarrisonHp + fortBonusHp + seasonScale;

  return {
    id: `conquest_${province.id}_s${season}`,
    stage: season,
    name: province.isCapital ? faction.rulerName : province.garrisonCommander,
    title: `${faction.icon} ${faction.shortName} • ${province.name}${
      fortificationLevel > 0 ? ` (Bastião Nv.${fortificationLevel})` : ''
    }`,
    domains: [faction.domain, province.domain],
    avatarCardId: province.isCapital ? faction.avatarCardId : province.garrisonAvatarCardId,
    startingHp: totalHp,
    passiveName: province.isCapital ? faction.imperialDoctrineName : province.strategicBonusTitle,
    passiveDescription: province.strategicBonusDesc,
    rewardGold: 10,
    loreIntro: province.loreSnippet,
    deckId: province.isCapital ? faction.defaultDeckId : province.garrisonDeckId,
  };
}
