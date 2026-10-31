import { ALL_CARDS } from './cards';
import { CAMPAIGN_BOSSES } from './decks';
import { CardDefinition, Domain } from '../types/game';
import { resolvePrimaryBossDomain } from './vaeloriaMapData';
import {
  CONQUEST_PROVINCES,
  ConquestProvinceDef,
  MicroSettlement,
} from './vaeloriaConquestData';
import {
  PROVINCE_REGIONAL_COORDS,
  STAGE_REGIONAL_COORDS,
  VAELORIA_REALM_ORDER,
  VAELORIA_REGIONAL_MAPS,
  VaeloriaMapScope,
  VaeloriaRealmId,
} from './vaeloriaMultimapData';
import {
  CartographicPathFeature,
  CartographicToponymFeature,
  HistoricalBattlefieldSite,
  VAELORIA_CARTOGRAPHIC_PATHS,
  VAELORIA_CARTOGRAPHIC_TOPONYMS,
  VAELORIA_HISTORICAL_BATTLEFIELDS,
} from './vaeloriaCartographyDetails';

export type CapitalDistrictRole =
  | 'throne'
  | 'forge'
  | 'archive'
  | 'mercenaries'
  | 'harbor'
  | 'sanctum';

export interface CapitalDistrictDef {
  id: string;
  capitalScope: Extract<
    VaeloriaRealmId,
    | 'capital_veridia'
    | 'capital_vortex'
    | 'capital_solaria'
    | 'capital_eclipse'
    | 'capital_pyros'
    | 'capital_axial'
  >;
  name: string;
  role: CapitalDistrictRole;
  roleLabel: string;
  icon: string;
  domain: Domain;
  /** Position in % (0..100) calibrated on the 16:9 capital city plan */
  x: number;
  y: number;
  elevationLabel: string;
  climateLabel: string;
  cantoQuote: string;
  loreChronicle: string;
  tacticalPerkSummary: string;
  fastTravelScope?: VaeloriaMapScope;
  fastTravelLabel?: string;
  nativeCardIds: string[];
}

export interface CartographicInspectionNote {
  id: string;
  categoryBadge: string;
  icon: string;
  title: string;
  subtitle: string;
  domain: Domain;
  scope: VaeloriaMapScope;
  x: number;
  y: number;
  elevationLabel: string;
  climateLabel: string;
  cantoRef: string;
  loreText: string;
  tacticalSummary?: string;
  fastTravelScope?: VaeloriaMapScope;
  fastTravelLabel?: string;
  nativeCards: CardDefinition[];
}

const CARDS_BY_ID: Record<string, CardDefinition> = Object.fromEntries(
  ALL_CARDS.map((c) => [c.id, c])
);

export function resolveNativeCardsByIds(
  cardIds: string[],
  fallbackDomain: Domain = 'neutral',
  seed = 'vaeloria',
  targetCount = 4
): CardDefinition[] {
  const result: CardDefinition[] = [];
  const seen = new Set<string>();
  for (const cid of cardIds) {
    const found = CARDS_BY_ID[cid];
    if (found && !seen.has(found.id)) {
      seen.add(found.id);
      result.push(found);
    }
  }
  if (result.length < targetCount) {
    const pool = ALL_CARDS.filter(
      (c) => c.domain === fallbackDomain && !seen.has(c.id)
    );
    let hash = 2166136261;
    for (let i = 0; i < seed.length; i++) {
      hash = Math.imul(hash ^ seed.charCodeAt(i), 16777619) >>> 0;
    }
    let idx = 0;
    while (result.length < targetCount && idx < pool.length) {
      const pick = pool[(hash + idx * 37) % pool.length];
      if (pick && !seen.has(pick.id)) {
        seen.add(pick.id);
        result.push(pick);
      }
      idx++;
    }
  }
  return result.slice(0, targetCount);
}

/**
 * 36 Distritos Urbanos Interativos (6 por Cidadela-Capital Imperial na 4ª Escala)
 */
export const VAELORIA_CAPITAL_DISTRICTS: CapitalDistrictDef[] = [
  // =========================================================================
  // 1. GALHADA VIVA (capital_veridia)
  // =========================================================================
  {
    id: 'dist_veridia_throne',
    capitalScope: 'capital_veridia',
    name: 'Salão do Cerne & Trono de Galhada',
    role: 'throne',
    roleLabel: 'Trono Imperial',
    icon: '👑',
    domain: 'green',
    x: 47,
    y: 42,
    elevationLabel: '+115 m no Tronco Central',
    climateLabel: 'Pólen Dourado & Brisa Fresca',
    cantoQuote: '“Nenhum machado jamais feriu o cerne onde os reis da selva comungam.” — Canto III',
    loreChronicle:
      'Esculpido organicamente sem cortar uma única fibra viva, o Salão do Cerne reúne os chefes tribais e arquidruidas de Veridia.',
    tacticalPerkSummary: 'Doutrina de Veridia: Regeneração +1 e vigor arbóreo nas defesas da Capital.',
    nativeCardIds: [
      'green_50_avatar_gaia',
      'green_156_mamute_brasa_selvagem',
      'green_161_dragao_esmeralda_primordial',
      'green_173_general_roda_selva',
    ],
  },
  {
    id: 'dist_veridia_forge',
    capitalScope: 'capital_veridia',
    name: 'Oficinas de Pau-Ferro & Quitina',
    role: 'forge',
    roleLabel: 'Forja Viva & Arsenal',
    icon: '🏹',
    domain: 'green',
    x: 38,
    y: 26,
    elevationLabel: '+78 m • Galeria Noroeste',
    climateLabel: 'Aroma de Resina Quente',
    cantoQuote: '“Onde o Norte dobra o ferro no fogo, o Sul molda a madeira que quebra o ferro.” — Canto III',
    loreChronicle:
      'Mestres artesãos endurecem escudos de carapaça de escorpião-jade e arcos compostos em banhos de âmbar fervente.',
    tacticalPerkSummary: 'Arsenal Silvestre: Armaduras de quitina e arcos longos de alcance superior.',
    nativeCardIds: [
      'green_112_escorpiao_jade',
      'green_137_lorde_treant_espinhos',
      'green_53_carapaca_espinhosa',
      'green_72_cajado_floresta',
    ],
  },
  {
    id: 'dist_veridia_archive',
    capitalScope: 'capital_veridia',
    name: 'Cúpula Botânica do Âmbar Eterno',
    role: 'archive',
    roleLabel: 'Grande Arquivo',
    icon: '📜',
    domain: 'green',
    x: 80,
    y: 66,
    elevationLabel: '+62 m • Promontório Leste',
    climateLabel: 'Luz Âmbar Translúcida',
    cantoQuote: '“Cada gota dourada guarda o rugido de uma era antes dos homens.” — Canto I',
    loreChronicle:
      'Biblioteca viva onde linhagens genéticas de predadores jurássicos e tratados medicinais estão preservados em resina.',
    tacticalPerkSummary: 'Sabedoria Ancestral: Preservação de feras de -3351 C.V. e feitiços de reencarnação.',
    nativeCardIds: [
      'green_88_reencarnacao_ancestral',
      'green_90_relogio_solar_druida',
      'green_108_semente_mundo',
      'green_75_druida_ciclos',
    ],
  },
  {
    id: 'dist_veridia_mercenaries',
    capitalScope: 'capital_veridia',
    name: 'Círculo de Caça & Fosso das Presas',
    role: 'mercenaries',
    roleLabel: 'Domadores & Clãs',
    icon: '🐾',
    domain: 'green',
    x: 22,
    y: 48,
    elevationLabel: '+45 m • Arena Ocidental',
    climateLabel: 'Rugidos Ecoantes',
    cantoQuote: '“Só cavalga o tiranossauro quem primeiro o encarou sem escudo.” — Canto IV',
    loreChronicle:
      'Quartel-arena onde rastreadores lupinos, centauros e domadores selecionam as feras de assalto da campanha.',
    tacticalPerkSummary: 'Tropas de Choque: Feras com Atropelar e Ímpeto recrutadas nos clãs do Sul.',
    nativeCardIds: [
      'green_67_tiranossauro_alfa',
      'green_132_tigre_esmeralda_alfa',
      'green_44_centauro_chefe',
      'green_141_soberano_fera_primordial',
    ],
  },
  {
    id: 'dist_veridia_harbor',
    capitalScope: 'capital_veridia',
    name: 'Ancoradouro das Raízes de Jade',
    role: 'harbor',
    roleLabel: 'Porto Fluvial Imperial',
    icon: '🛶',
    domain: 'green',
    x: 38,
    y: 73,
    elevationLabel: '140 m • Espelho D’Água',
    climateLabel: 'Névoa Bioluminescente',
    cantoQuote: '“Pelas raízes descem barcaças silenciosas até o coração do oceano.” — Canto IV',
    loreChronicle:
      'Docas esculpidas entre arcos radiculares gigantes que ligam Galhada Viva ao Delta e ao Mar das Tormentas.',
    tacticalPerkSummary: 'Conexão Hídrica: Acesso rápido às rotas navais do Mar Interior das Tormentas.',
    fastTravelScope: 'sea_of_storms',
    fastTravelLabel: 'Zarpar ao Mar das Tormentas',
    nativeCardIds: [
      'green_09_hidra',
      'green_68_zaratan_ilha',
      'green_114_crocodilo_pantano_rei',
      'green_158_hidra_pantano_ancestral',
    ],
  },
  {
    id: 'dist_veridia_sanctum',
    capitalScope: 'capital_veridia',
    name: 'Fontes Sagradas dos Nove Menires',
    role: 'sanctum',
    roleLabel: 'Santuário Elemental',
    icon: '✨',
    domain: 'green',
    x: 74,
    y: 28,
    elevationLabel: '+94 m • Terraço Nordeste',
    climateLabel: 'Vapor Curativo Dourado',
    cantoQuote: '“Bebe da fonte verde e tuas chagas fecharão antes do próximo sol.” — Canto III',
    loreChronicle:
      'Círculo megalítico alimentado por gêiseres mornos de seiva pura vindos diretamente das Raízes Abissais.',
    tacticalPerkSummary: 'Santuário de Ley: Canaliza energia direta das Raízes Abissais (+1 Essência em cercos).',
    fastTravelScope: 'deep_roots',
    fastTravelLabel: 'Descer às Raízes Profundas',
    nativeCardIds: [
      'green_30_xama_druida',
      'green_36_coracao_floresta',
      'green_144_bencao_arvore_mundo',
      'green_167_arauto_prisma_selva',
    ],
  },

  // =========================================================================
  // 2. PINÁCULO POLAR DE CRISTÁLIA (capital_vortex)
  // =========================================================================
  {
    id: 'dist_vortex_throne',
    capitalScope: 'capital_vortex',
    name: 'Câmara Sincrônica do Trono de Safira',
    role: 'throne',
    roleLabel: 'Trono Horológico',
    icon: '👑',
    domain: 'blue',
    x: 46,
    y: 52,
    elevationLabel: '+180 m • Base do Grande Domo',
    climateLabel: 'Calor Geotérmico Controlado',
    cantoQuote: '“Em Cristália, até os reis governam sob o compasso implacável do pêndulo.” — Canto III',
    loreChronicle:
      'Salão octogonal sob o Grande Astrolábio onde o Conclave de Vórtex projeta mapas astrais em tempo real.',
    tacticalPerkSummary: 'Doutrina de Vórtex: Controle temporal, compra tática e congelamento da vanguarda rival.',
    nativeCardIds: [
      'blue_81_arconte_cronos',
      'blue_149_cronomante_ampulheta',
      'blue_166_trono_oniciencia_astral',
      'blue_173_general_roda_gelo',
    ],
  },
  {
    id: 'dist_vortex_forge',
    capitalScope: 'capital_vortex',
    name: 'Manufatura Imperial de Engrenagens',
    role: 'forge',
    roleLabel: 'Forja Relojoeira',
    icon: '⚙️',
    domain: 'blue',
    x: 74,
    y: 42,
    elevationLabel: '+65 m • Ala Leste',
    climateLabel: 'Vapor & Óleo Alquímico',
    cantoQuote: '“Cem rodas de latão batem como um só coração sem sangue.” — Canto VI',
    loreChronicle:
      'Complexo fabril que monta golens de quartzo, bombas de estase e blindagens térmicas para a frota polar.',
    tacticalPerkSummary: 'Engenharia Boreal: Autômatos blindados e artefatos de manipulação de turno.',
    nativeCardIds: [
      'blue_41_golem_cristal',
      'blue_94_sentinela_safira',
      'blue_85_bomba_tempo',
      'neutral_144_nucleo_relojoeiro_aeternus',
    ],
  },
  {
    id: 'dist_vortex_archive',
    capitalScope: 'capital_vortex',
    name: 'Claustro dos Códices do Zero Absoluto',
    role: 'archive',
    roleLabel: 'Biblioteca & Observatório',
    icon: '📘',
    domain: 'blue',
    x: 26,
    y: 34,
    elevationLabel: '+88 m • Claustro Oeste',
    climateLabel: 'Silêncio Cristalino (-12 °C)',
    cantoQuote: '“O gelo preserva o pergaminho melhor que qualquer cofre de ouro.” — Canto II',
    loreChronicle:
      'Arquivo hermético onde cronomantes estudam linhas do tempo descartadas e cartas celestes anteriores à Fratura.',
    tacticalPerkSummary: 'Onisciência Arcana: Feitiços de previsão, contramágica e compra acelerada.',
    nativeCardIds: [
      'blue_36_tomo_infinito',
      'blue_102_biblioteca_proibida',
      'blue_126_tomo_zero_absoluto',
      'blue_139_visao_onisciente',
    ],
  },
  {
    id: 'dist_vortex_mercenaries',
    capitalScope: 'capital_vortex',
    name: 'Guarnição dos Cavaleiros da Geada Real',
    role: 'mercenaries',
    roleLabel: 'Quartel Boreal',
    icon: '🛡️',
    domain: 'blue',
    x: 56,
    y: 74,
    elevationLabel: '+38 m • Muralha Sul',
    climateLabel: 'Vento Polar Firme',
    cantoQuote: '“Firmes como a banquisa; letais como a avalanche.” — Canto IV',
    loreChronicle:
      'Praça d’armas onde treinam os lanceiros glaciais, jarls aliados e ginetes de dracos da nevasca.',
    tacticalPerkSummary: 'Falange Álgida: Tropas resistentes com efeitos de Congelar no impacto.',
    nativeCardIds: [
      'blue_21_executor_glacial',
      'blue_60_gigante_gelo_jarl',
      'blue_131_cavaleiro_geada_real',
      'blue_114_draco_nevasca',
    ],
  },
  {
    id: 'dist_vortex_harbor',
    capitalScope: 'capital_vortex',
    name: 'Diques Térmicos da Armada Quebra-Gelo',
    role: 'harbor',
    roleLabel: 'Eclusas Navais',
    icon: '🚢',
    domain: 'blue',
    x: 27,
    y: 73,
    elevationLabel: 'Nível do Mar • Canal Sudoeste',
    climateLabel: 'Bruma de Água Aquecida',
    cantoQuote: '“Quando os mares congelam, apenas as proas de Cristália continuam a marchar.” — Canto IV',
    loreChronicle:
      'Comportas monumentais que lançam fragatas couraçadas diretamente rumo ao Mar Interior das Tormentas.',
    tacticalPerkSummary: 'Projeção Naval: Travessia direta para o corredor marítimo continental.',
    fastTravelScope: 'sea_of_storms',
    fastTravelLabel: 'Navegar ao Mar das Tormentas',
    nativeCardIds: [
      'blue_42_serpente_marinha',
      'blue_107_bussola_astral',
      'blue_113_navegador_fenda',
      'blue_172_armada_draconica_gelo',
    ],
  },
  {
    id: 'dist_vortex_sanctum',
    capitalScope: 'capital_vortex',
    name: 'Anel Refractor das Sete Safiras',
    role: 'sanctum',
    roleLabel: 'Santuário Astral',
    icon: '🔮',
    domain: 'blue',
    x: 57,
    y: 22,
    elevationLabel: '+260 m • Terraço Norte',
    climateLabel: 'Aurora Boreal Intensa',
    cantoQuote: '“Sete torres bebem a luz das estrelas mortas para acender a cidade.” — Canto III',
    loreChronicle:
      'Catedral aberta de cristal azul onde feixes estelares abrem passagem direta ao Arquipélago Astral.',
    tacticalPerkSummary: 'Ponte Estelar: Canaliza ressonância direta com as Ilhas Astrais.',
    fastTravelScope: 'astral_isles',
    fastTravelLabel: 'Saltar às Ilhas Astrais',
    nativeCardIds: [
      'blue_54_planetario_arcano',
      'blue_125_astrolabio_infinito',
      'blue_167_arauto_prisma_gelo',
      'blue_168_tecelao_feixe_gelo',
    ],
  },

  // =========================================================================
  // 3. BASTIÃO DOURADO DE AETHELGARD (capital_solaria)
  // =========================================================================
  {
    id: 'dist_solaria_throne',
    capitalScope: 'capital_solaria',
    name: 'Domo Imperial & Trono de Heliópolis',
    role: 'throne',
    roleLabel: 'Trono Solar',
    icon: '👑',
    domain: 'gold',
    x: 42,
    y: 22,
    elevationLabel: '+1.880 m • Acrópole Central',
    climateLabel: 'Claridade Perpétua',
    cantoQuote: '“Sob a cúpula dourada nenhuma sombra se esconde do julgamento.” — Canto III',
    loreChronicle:
      'Palácio-basílica de mármore e ouro batido onde o Imperador Solar e o Senado das Valquírias decretam leis.',
    tacticalPerkSummary: 'Doutrina de Solária: Escudo Divino, Armadura elevada e cura soberana.',
    nativeCardIds: [
      'gold_09_serafim_solar',
      'gold_119_soberano_ordem_eterna',
      'gold_138_imperador_sol_supremo',
      'gold_173_general_roda_sol',
    ],
  },
  {
    id: 'dist_solaria_forge',
    capitalScope: 'capital_solaria',
    name: 'Forjas Consagradas de Hélios',
    role: 'forge',
    roleLabel: 'Arsenal Imperial',
    icon: '⚒️',
    domain: 'gold',
    x: 24,
    y: 52,
    elevationLabel: '+1.690 m • Baluarte Oeste',
    climateLabel: 'Calor Limpo de Fornalha Solar',
    cantoQuote: '“Cada escudo leva três bênçãos antes de receber o primeiro golpe.” — Canto V',
    loreChronicle:
      'Ferreiros rúnicos e golens de bronze temperam lanças radiantes, balistas de repetição e égides reais.',
    tacticalPerkSummary: 'Relíquias Douradas: Redução de custo e armaduras sagradas de alta durabilidade.',
    nativeCardIds: [
      'gold_41_forjador_runico',
      'gold_125_fornalha_celestial',
      'gold_133_mestre_forja_imperial',
      'gold_143_bigorna_sol_invicto',
    ],
  },
  {
    id: 'dist_solaria_archive',
    capitalScope: 'capital_solaria',
    name: 'Colégio dos Juízes & Esfinges Reais',
    role: 'archive',
    roleLabel: 'Tribunal & Arquivo',
    icon: '⚖️',
    domain: 'gold',
    x: 58,
    y: 30,
    elevationLabel: '+1.840 m • Ala Leste da Praça',
    climateLabel: 'Brisa Serena de Altitude',
    cantoQuote: '“Toda promessa proferida no Leste fica gravada em placas de bronze.” — Canto V',
    loreChronicle:
      'Salões colunados guardados por androesfinges onde repousam os códigos imperiais e genealogias das legiões.',
    tacticalPerkSummary: 'Ordem Suprema: Decretos defensivos e anulação de investidas caóticas.',
    nativeCardIds: [
      'gold_20_androesfinge',
      'gold_134_esfinge_sentenca_real',
      'gold_144_obelisk_lei_suprema',
      'gold_165_arca_lei_celestial',
    ],
  },
  {
    id: 'dist_solaria_mercenaries',
    capitalScope: 'capital_solaria',
    name: 'Campo de Marte da Falange Dourada',
    role: 'mercenaries',
    roleLabel: 'Quartel das Legiões',
    icon: '🛡️',
    domain: 'gold',
    x: 44,
    y: 48,
    elevationLabel: '+1.740 m • Quarto Terraço',
    climateLabel: 'Sol de Meio-Dia',
    cantoQuote: '“Mil escudos erguidos refletem o próprio sol contra o invasor.” — Canto IV',
    loreChronicle:
      'Alojamentos escalonados de templários, alabardeiros e cavaleiros de pégaso prontos para marchar.',
    tacticalPerkSummary: 'Formação Invicta: Bônus de linha para Vanguarda pesada e unidades com Guardião.',
    nativeCardIds: [
      'gold_56_lanceiro_falange',
      'gold_80_paladino_destino',
      'gold_95_cavaleiro_pegaso',
      'gold_116_centuriao_forja_dourada',
    ],
  },
  {
    id: 'dist_solaria_harbor',
    capitalScope: 'capital_solaria',
    name: 'Arcadas Suspensas da Frota Celeste',
    role: 'harbor',
    roleLabel: 'Doca de Dirigíveis',
    icon: '⛵',
    domain: 'gold',
    x: 86,
    y: 38,
    elevationLabel: '+1.810 m sobre as Nuvens',
    climateLabel: 'Alísios Fortes do Leste',
    cantoQuote: '“De Aethelgard partem velas que jamais tocaram a água salgada.” — Canto IV',
    loreChronicle:
      'Torres-píer projetadas sobre o abismo oriental onde atracam galés voadoras rumo às nuvens altas.',
    tacticalPerkSummary: 'Ponte Aérea: Embarque imediato para o Corredor Boreal e Bastilhas Celestes.',
    fastTravelScope: 'boreal_skyway',
    fastTravelLabel: 'Voar ao Corredor das Nuvens',
    nativeCardIds: [
      'gold_40_pegaso_celeste',
      'gold_136_dragao_platina_celeste',
      'gold_172_armada_draconica_sol',
      'gold_32_estandarte_imperial',
    ],
  },
  {
    id: 'dist_solaria_sanctum',
    capitalScope: 'capital_solaria',
    name: 'Anfiteatro dos Espelhos Heliostáticos',
    role: 'sanctum',
    roleLabel: 'Santuário Solar',
    icon: '☀️',
    domain: 'gold',
    x: 68,
    y: 26,
    elevationLabel: '+1.855 m • Ponta Oriental',
    climateLabel: 'Foco Radiante Intenso',
    cantoQuote: '“Aqui a alvorada é recolhida em espelhos e transformada em muralha.” — Canto III',
    loreChronicle:
      'Santuário óptico monumental capaz de projetar pontes de luz sólida até as Bastilhas do Zênite.',
    tacticalPerkSummary: 'Feixe do Zênite: Conecta Aethelgard diretamente às Bastilhas Celestes.',
    fastTravelScope: 'sky_bastions',
    fastTravelLabel: 'Subir às Bastilhas Celestes',
    nativeCardIds: [
      'gold_10_egide_radiante',
      'gold_49_colera_divina',
      'gold_167_arauto_prisma_sol',
      'gold_168_tecelao_feixe_sol',
    ],
  },

  // =========================================================================
  // 4. CATEDRAL-NECRÓPOLE DE NOCTURNUS (capital_eclipse)
  // =========================================================================
  {
    id: 'dist_eclipse_throne',
    capitalScope: 'capital_eclipse',
    name: 'Nave Negra & Trono dos Três Crânios',
    role: 'throne',
    roleLabel: 'Trono Umbral',
    icon: '👑',
    domain: 'purple',
    x: 48,
    y: 28,
    elevationLabel: '+210 m sobre o Fosso',
    climateLabel: 'Chamas Violetas & Incenso Frio',
    cantoQuote: '“Os vivos reinam por décadas; Nocturnus governa por eras.” — Canto II',
    loreChronicle:
      'Coração da Alta Catedral de Obsidiana, onde arcebispos-lich e príncipes imortais deliberam em silêncio.',
    tacticalPerkSummary: 'Doutrina do Eclipse: Dreno de Vida, Renascer da Cripta e Pactos de Sangue.',
    nativeCardIds: [
      'purple_07_lich',
      'purple_65_principe_mortos',
      'purple_157_dragao_sombra_abissal',
      'purple_173_general_roda_abismo',
    ],
  },
  {
    id: 'dist_eclipse_forge',
    capitalScope: 'capital_eclipse',
    name: 'Destilarias & Forjas Alquímicas do Leste',
    role: 'forge',
    roleLabel: 'Forja Carmesim',
    icon: '🧪',
    domain: 'purple',
    x: 92,
    y: 14,
    elevationLabel: '+235 m • Terraço do Aqueduto',
    climateLabel: 'Vapores Rubros Quentes',
    cantoQuote: '“Nem toda lâmina precisa de fogo quando conhece a sede.” — Canto II',
    loreChronicle:
      'Fornalhas alquímicas conectadas ao Aqueduto Carmesim onde aço-sombra e cálices vampíricos são temperados.',
    tacticalPerkSummary: 'Alquimia Sombria: Armas com Toque Letal e relíquias de sifão vital.',
    nativeCardIds: [
      'purple_35_calice_vampirico',
      'purple_59_duergar_despota',
      'purple_125_ataude_sangue',
      'purple_165_calice_sangue_imortal',
    ],
  },
  {
    id: 'dist_eclipse_archive',
    capitalScope: 'capital_eclipse',
    name: 'Scriptorium Proibido do Claustro dos Corvos',
    role: 'archive',
    roleLabel: 'Arquivo Sombrio',
    icon: '🪶',
    domain: 'purple',
    x: 78,
    y: 46,
    elevationLabel: '+175 m • Torres Orientais',
    climateLabel: 'Luar Frio & Sussurros',
    cantoQuote: '“Todo segredo esquecido pelos vivos acaba arquivado em Nocturnus.” — Canto VI',
    loreChronicle:
      'Complexo monástico gótico que guarda grimórios necromânticos, genealogias reais e mapas de catacumbas.',
    tacticalPerkSummary: 'Sabedoria Proibida: Exumação em massa da Cripta e maldições debilitantes.',
    nativeCardIds: [
      'purple_107_grimorio_necromante',
      'purple_68_exumar_legiao',
      'purple_80_necromante_entropia',
      'purple_151_inquisidor_umbral',
    ],
  },
  {
    id: 'dist_eclipse_mercenaries',
    capitalScope: 'capital_eclipse',
    name: 'Cidadela da Ordem Sangue-Negro',
    role: 'mercenaries',
    roleLabel: 'Quartel de Cavaleiros',
    icon: '⚔️',
    domain: 'purple',
    x: 68,
    y: 78,
    elevationLabel: '+130 m • Baluarte Sudeste',
    climateLabel: 'Névoa Baixa',
    cantoQuote: '“Nenhum guarda dorme nos muros de Nocturnus.” — Canto IV',
    loreChronicle:
      'Fortaleza dentada onde paladinos caídos, inquisidores e ceifadores montam guarda eterna.',
    tacticalPerkSummary: 'Legião Imortal: Unidades com Renascer e contra-ataques letais.',
    nativeCardIds: [
      'purple_05_cavaleiro_morte',
      'purple_114_cavaleiro_sangue_negro',
      'purple_131_inquisidor_sangue',
      'purple_133_ceifador_tumular',
    ],
  },
  {
    id: 'dist_eclipse_harbor',
    capitalScope: 'capital_eclipse',
    name: 'Docas Subterrâneas das Lanternas Roxas',
    role: 'harbor',
    roleLabel: 'Cais Abissal',
    icon: '🛶',
    domain: 'purple',
    x: 22,
    y: 74,
    elevationLabel: 'Nível do Rio Subterrâneo',
    climateLabel: 'Água Negra & Cerração',
    cantoQuote: '“Uma moeda de prata basta para descer até onde o sol jamais brilhou.” — Canto VII',
    loreChronicle:
      'Porto sombrio ao pé da escarpa oeste de onde partem galeotas rumo à Fossa Submersa e ao mar aberto.',
    tacticalPerkSummary: 'Rota Submersa: Navegação oculta para a Fossa Abissal e Mar das Tormentas.',
    fastTravelScope: 'sunken_abyss',
    fastTravelLabel: 'Descer à Fossa Submersa',
    nativeCardIds: [
      'purple_45_dragao_sombras',
      'purple_53_lanterna_almas',
      'purple_98_cavaleiro_apocalipse',
      'purple_172_armada_draconica_abismo',
    ],
  },
  {
    id: 'dist_eclipse_sanctum',
    capitalScope: 'capital_eclipse',
    name: 'Mausoléus Reais de Marfim Pálido',
    role: 'sanctum',
    roleLabel: 'Santuário Ancestral',
    icon: '🕯️',
    domain: 'purple',
    x: 22,
    y: 24,
    elevationLabel: '+195 m • Platô Noroeste',
    climateLabel: 'Clarão Lunar Perpétuo',
    cantoQuote: '“Em cofres de marfim dormem as coroas da Primeira Dinastia.” — Canto II',
    loreChronicle:
      'Conjunto de capelas brancas ligadas à Catedral Negra por uma ponte de gárgulas sobre o vazio.',
    tacticalPerkSummary: 'Memória Dinástica: Bênçãos espirituais de Essência e proteção contra desgaste.',
    nativeCardIds: [
      'purple_36_trono_ossos',
      'purple_99_lorde_vampiro_anciao',
      'purple_146_coroa_rei_cadaver',
      'purple_167_arauto_prisma_abismo',
    ],
  },

  // =========================================================================
  // 5. CALDEIRA IMPERIAL DE VULCANOR (capital_pyros)
  // =========================================================================
  {
    id: 'dist_pyros_throne',
    capitalScope: 'capital_pyros',
    name: 'Cidadela da Bigorna & Trono de Basalto',
    role: 'throne',
    roleLabel: 'Trono da Caldeira',
    icon: '👑',
    domain: 'red',
    x: 51,
    y: 20,
    elevationLabel: '+2.490 m • Topo da Bigorna',
    climateLabel: 'Clarão Rubro & Brasa',
    cantoQuote: '“Quem senta sobre a Bigorna governa pelo peso do martelo.” — Canto II',
    loreChronicle:
      'Torreão negro cravado diretamente sobre a Bigorna Titânica de onde escorre lava incandescente.',
    tacticalPerkSummary: 'Doutrina de Pyros: Ataque explosivo, Pele Incandescente e artilharia de abertura.',
    nativeCardIds: [
      'red_08_dragao_vermelho',
      'red_138_colosso_vulcano_primordial',
      'red_157_dragao_tiamat_carmesim',
      'red_173_general_roda_chama',
    ],
  },
  {
    id: 'dist_pyros_forge',
    capitalScope: 'capital_pyros',
    name: 'Complexo dos Altos-Fornos & Cadinhos',
    role: 'forge',
    roleLabel: 'Grande Fundição',
    icon: '🔨',
    domain: 'red',
    x: 24,
    y: 66,
    elevationLabel: '+2.360 m • Bancada Sudoeste',
    climateLabel: 'Fumaça Espessa & Metal Líquido',
    cantoQuote: '“Mil martelos batem dia e noite; quando param, é sinal de que a guerra começou.” — Canto IV',
    loreChronicle:
      'Coração industrial de Pyros onde gigantes do fogo e artífices azer fundem couraças e máquinas de cerco.',
    tacticalPerkSummary: 'Artilharia Rubra: Bombardeios em área e armas forjadas em magma.',
    fastTravelScope: 'underforge',
    fastTravelLabel: 'Descer à Infraforja de Ignaroth',
    nativeCardIds: [
      'red_07_gigante_fogo',
      'red_36_bigorna_fogo',
      'red_44_gigante_forja',
      'red_133_juggernaut_fornalha',
    ],
  },
  {
    id: 'dist_pyros_archive',
    capitalScope: 'capital_pyros',
    name: 'Câmara de Controle das Comportas Térmicas',
    role: 'archive',
    roleLabel: 'Engenharia Piro-Rúnica',
    icon: '🌋',
    domain: 'red',
    x: 16,
    y: 22,
    elevationLabel: '+2.430 m • Represa Noroeste',
    climateLabel: 'Vapor Superaquecido',
    cantoQuote: '“Domar um rio de pedra derretida exige mais ciência que coragem.” — Canto III',
    loreChronicle:
      'Centro técnico onde piromantes e engenheiros regulam o fluxo de lava que protege o hexágono imperial.',
    tacticalPerkSummary: 'Domínio Piroclástico: Feitiços de dano em linha e erupções controladas.',
    nativeCardIds: [
      'red_25_erupcao_piroclastica',
      'red_72_caldeirao_magma',
      'red_77_piromante_fenda',
      'red_90_nucleo_fragmento_rubro',
    ],
  },
  {
    id: 'dist_pyros_mercenaries',
    capitalScope: 'capital_pyros',
    name: 'Anfiteatro de Cinzas & Gladiadores',
    role: 'mercenaries',
    roleLabel: 'Arena de Guerra',
    icon: '🏆',
    domain: 'red',
    x: 78,
    y: 72,
    elevationLabel: '+2.340 m • Cratera Sudeste',
    climateLabel: 'Poeira Vulcânica Quente',
    cantoQuote: '“Em Vulcanor, patentes não se herdam: conquistam-se na areia negra.” — Canto IV',
    loreChronicle:
      'Coliseu escavado na rocha basáltica onde campeões berserkers e meio-dragões provam seu valor.',
    tacticalPerkSummary: 'Vanguarda Feroz: Guerreiros com Fúria Crescente e Ímpeto imediato.',
    nativeCardIds: [
      'red_04_meio_dragao',
      'red_94_berserker_draconico',
      'red_112_gladiador_caldeira',
      'red_134_senhor_guerra_rubro',
    ],
  },
  {
    id: 'dist_pyros_harbor',
    capitalScope: 'capital_pyros',
    name: 'Pináculos de Pouso da Hoste Dracônica',
    role: 'harbor',
    roleLabel: 'Doca de Wyverns',
    icon: '🐉',
    domain: 'red',
    x: 74,
    y: 32,
    elevationLabel: '+2.580 m • Agulhas Nordeste',
    climateLabel: 'Correntes Ascendentes Fortes',
    cantoQuote: '“Das agulhas negras sobem sombras rubras capazes de cobrir o sol.” — Canto IV',
    loreChronicle:
      'Plataformas rochosas elevadas de onde esquadrões de dracos e wyverns decolam para o Corredor das Nuvens.',
    tacticalPerkSummary: 'Supremacia Aérea: Acesso imediato ao Corredor Boreal das Nuvens.',
    fastTravelScope: 'boreal_skyway',
    fastTravelLabel: 'Decolar ao Corredor das Nuvens',
    nativeCardIds: [
      'red_42_cavaleiro_draconico',
      'red_63_wyvern_imperial',
      'red_137_dragao_cometa_rubro',
      'red_172_armada_draconica_chama',
    ],
  },
  {
    id: 'dist_pyros_sanctum',
    capitalScope: 'capital_pyros',
    name: 'Anel Interno das Fornalhas Sagradas',
    role: 'sanctum',
    roleLabel: 'Santuário da Chama',
    icon: '🔥',
    domain: 'red',
    x: 62,
    y: 52,
    elevationLabel: '+2.400 m • Hexágono Interno',
    climateLabel: 'Brasas Eternas',
    cantoQuote: '“A primeira fagulha do mundo ainda arde sob estes portões.” — Canto I',
    loreChronicle:
      'Templo marcial cercado pelo canal interno de lava onde as bandeiras de campanha são batizadas no fogo.',
    tacticalPerkSummary: 'Chama Primordial: Concede fervor ofensivo (+1 Essência / +1 ATQ em batalhas locais).',
    nativeCardIds: [
      'red_45_fenix_primordial',
      'red_107_fornalha_draconica',
      'red_167_arauto_prisma_chama',
      'red_168_tecelao_feixe_chama',
    ],
  },

  // =========================================================================
  // 6. CIDADE FRANCA & TORRE DOS CINCO SELOS (capital_axial)
  // =========================================================================
  {
    id: 'dist_axial_throne',
    capitalScope: 'capital_axial',
    name: 'Átrio Supremo da Torre & Arena do Pacto',
    role: 'throne',
    roleLabel: 'Eixo Pentacromático',
    icon: '☸',
    domain: 'neutral',
    x: 50,
    y: 36,
    elevationLabel: '+780 m • Pináculo Central',
    climateLabel: 'Harmonia Etérea',
    cantoQuote: '“Cinco cores entram; uma só lei prevalece no círculo de pedra.” — Canto V',
    loreChronicle:
      'Câmara do Conselho Supremo acima do Coliseu, onde os tratados continentais e duelos de soberanos são arbitrados.',
    tacticalPerkSummary: 'Doutrina Axial: Sinergia multi-domínio, Lendas neutras e quebra de Expansões.',
    fastTravelScope: 'prismatic_crater',
    fastTravelLabel: 'Descer à Cratera Prismática',
    nativeCardIds: [
      'neutral_10_valkyra_pentacromatica',
      'neutral_30_coroa_pactos',
      'neutral_167_arauto_prisma_matriz',
      'neutral_173_general_roda_matriz',
    ],
  },
  {
    id: 'dist_axial_forge',
    capitalScope: 'capital_axial',
    name: 'Quarteirão das Forjas Diplomáticas (Setor Rubro)',
    role: 'forge',
    roleLabel: 'Arsenal Neutro',
    icon: '⚒️',
    domain: 'neutral',
    x: 24,
    y: 32,
    elevationLabel: '630 m • Cunha Noroeste',
    climateLabel: 'Fumaça Dourada-Rubra',
    cantoQuote: '“Aqui anões, humanos e artífices vendem o mesmo aço a todos os tronos.” — Canto VI',
    loreChronicle:
      'Distrito industrial administrado pela delegação de Pyros e pelas guildas de armeiros independentes.',
    tacticalPerkSummary: 'Equipamento Universal: Relíquias neutras compatíveis com qualquer afinidade.',
    nativeCardIds: [
      'neutral_14_armadura_mithral',
      'neutral_35_colosso_adamantina',
      'neutral_107_colosso_forja_vapor',
      'neutral_115_golem_ferro_fornalha_neutra',
    ],
  },
  {
    id: 'dist_axial_archive',
    capitalScope: 'capital_axial',
    name: 'Universidade & Planetário da Cunha Safira',
    role: 'archive',
    roleLabel: 'Grande Cartografia',
    icon: '🧭',
    domain: 'neutral',
    x: 74,
    y: 30,
    elevationLabel: '635 m • Cunha Nordeste',
    climateLabel: 'Brisa Cristalina',
    cantoQuote: '“Todos os mapas de Vaeloria nascem sob estas cúpulas azuis.” — Canto VI',
    loreChronicle:
      'Sede da Guilda Real dos Cartógrafos e Cronistas, responsável pelo mapeamento dos 21 domínios conhecidos.',
    tacticalPerkSummary: 'Cartografia Imperial: Conhecimento completo de rotas, portais e bestiário.',
    nativeCardIds: [
      'neutral_13_grimorio_astral',
      'neutral_117_elminster_sabio_cinzento',
      'neutral_118_volothamp_cronista_mundos',
      'neutral_139_amuleto_planos_astrolabio',
    ],
  },
  {
    id: 'dist_axial_mercenaries',
    capitalScope: 'capital_axial',
    name: 'Anel das Companhias Livres & Casa da Moeda',
    role: 'mercenaries',
    roleLabel: 'Guildas & Contratos',
    icon: '🪙',
    domain: 'neutral',
    x: 76,
    y: 62,
    elevationLabel: '625 m • Cunha Leste',
    climateLabel: 'Movimento Cosmopolita',
    cantoQuote: '“O soldo pago na Cidade Franca compra espadas de qualquer bandeira.” — Canto V',
    loreChronicle:
      'Bairro mercantil dourado onde capitães mercenários, banqueiros e embaixadores firmam alianças.',
    tacticalPerkSummary: 'Companhias Livres: Veteranos versáteis sem exigência de afinidade elemental.',
    nativeCardIds: [
      'neutral_01_mercenario_veterano',
      'neutral_91_campeao_arena_livre',
      'neutral_92_senhor_guerra_fronteira',
      'neutral_149_contrato_companhia_dourada',
    ],
  },
  {
    id: 'dist_axial_harbor',
    capitalScope: 'capital_axial',
    name: 'Docas Fluviais da Trégua & Ponte Sul',
    role: 'harbor',
    roleLabel: 'Porto Fluvial Franco',
    icon: '⚓',
    domain: 'neutral',
    x: 79,
    y: 86,
    elevationLabel: '605 m • Canal Sudeste',
    climateLabel: 'Águas Calmas',
    cantoQuote: '“Nenhuma galé pode ser apresada à vista das muralhas brancas.” — Canto V',
    loreChronicle:
      'Terminais fluviais fora da muralha circular que escoam mercadorias rumo aos estuários marítimos.',
    tacticalPerkSummary: 'Comércio Livre: Viagem fluvial direta para o Mar Interior das Tormentas.',
    fastTravelScope: 'sea_of_storms',
    fastTravelLabel: 'Navegar ao Mar das Tormentas',
    nativeCardIds: [
      'neutral_05_corsario_astral',
      'neutral_62_espadachim_corsario',
      'neutral_110_mercador_lago_escuro',
      'neutral_126_concha_runa_uvar',
    ],
  },
  {
    id: 'dist_axial_sanctum',
    capitalScope: 'capital_axial',
    name: 'Claustro Diplomático das Sombras & Jardins',
    role: 'sanctum',
    roleLabel: 'Embaixadas Sombra & Vida',
    icon: '🔮',
    domain: 'neutral',
    x: 24,
    y: 64,
    elevationLabel: '622 m • Cunhas Sudoeste',
    climateLabel: 'Penumbra Perfumada',
    cantoQuote: '“Onde a raiz verde encontra a pedra violeta, selam-se os pactos mais duradouros.” — Canto VI',
    loreChronicle:
      'Encontro entre o setor diplomático umbral e os jardins botânicos do sul, repleto de santuários discretos.',
    tacticalPerkSummary: 'Equilíbrio Diplomático: Acesso a segredos de Estado e bênçãos híbridas.',
    nativeCardIds: [
      'neutral_04_espiao_duplo',
      'neutral_93_ladrao_mestre_mascara',
      'neutral_120_xanathar_senhor_crime',
      'neutral_171_pactuario_elemental_matriz',
    ],
  },
];

export function getCapitalDistrictsForScope(
  scope: VaeloriaMapScope
): CapitalDistrictDef[] {
  return VAELORIA_CAPITAL_DISTRICTS.filter((d) => d.capitalScope === scope);
}

export function buildDistrictInspectionNote(
  d: CapitalDistrictDef
): CartographicInspectionNote {
  const capDef = VAELORIA_REGIONAL_MAPS[d.capitalScope];
  return {
    id: d.id,
    categoryBadge: `DISTRITO IMPERIAL • ${d.roleLabel.toUpperCase()}`,
    icon: d.icon,
    title: d.name,
    subtitle: `${capDef.shortName} (4ª Escala Urbana)`,
    domain: d.domain,
    scope: d.capitalScope,
    x: d.x,
    y: d.y,
    elevationLabel: d.elevationLabel,
    climateLabel: d.climateLabel,
    cantoRef: d.cantoQuote,
    loreText: d.loreChronicle,
    tacticalSummary: d.tacticalPerkSummary,
    fastTravelScope: d.fastTravelScope,
    fastTravelLabel: d.fastTravelLabel,
    nativeCards: resolveNativeCardsByIds(d.nativeCardIds, d.domain, d.id, 4),
  };
}

export function buildToponymInspectionNote(
  t: CartographicToponymFeature
): CartographicInspectionNote {
  const scopeLabel =
    t.scope === 'world'
      ? 'Continente de Vaeloria'
      : VAELORIA_REGIONAL_MAPS[t.scope].shortName;
  const kindIcon =
    t.kind === 'mountain_range' || t.kind === 'peak'
      ? '⛰️'
      : t.kind === 'sea'
        ? '🌊'
        : t.kind === 'forest'
          ? '🌲'
          : t.kind === 'chasm'
            ? '🕳️'
            : t.kind === 'bridge'
              ? '🌉'
              : t.kind === 'ruin_site'
                ? '🏛️'
                : '📍';
  return {
    id: t.id,
    categoryBadge: `FEIÇÃO GEOGRÁFICA • LOD ${t.lod}`,
    icon: kindIcon,
    title: t.name,
    subtitle: scopeLabel,
    domain: t.domain,
    scope: t.scope,
    x: t.x,
    y: t.y,
    elevationLabel: t.elevationLabel,
    climateLabel: t.climateLabel,
    cantoRef: t.cantoRef,
    loreText: t.loreNote,
    nativeCards: resolveNativeCardsByIds(t.nativeCardIds, t.domain, t.id, 4),
  };
}

export function buildPathInspectionNote(
  p: CartographicPathFeature
): CartographicInspectionNote {
  const mid = p.points[Math.floor(p.points.length / 2)] ?? [50, 50];
  const scopeLabel =
    p.scope === 'world'
      ? 'Continente de Vaeloria'
      : VAELORIA_REGIONAL_MAPS[p.scope].shortName;
  const icon =
    p.kind === 'river'
      ? '🌊'
      : p.kind === 'lava_stream'
        ? '🌋'
        : p.kind === 'sea_lane'
          ? '⚓'
          : p.kind === 'sky_jet'
            ? '🐉'
            : '🔮';
  const kindBadge =
    p.kind === 'river'
      ? 'CURSO HIDROGRÁFICO'
      : p.kind === 'lava_stream'
        ? 'TORRENTE MAGMÁTICA'
        : p.kind === 'sea_lane'
          ? 'ROTA MARÍTIMA'
          : p.kind === 'sky_jet'
            ? 'CORRENTE CELESTE'
            : 'CONDUTO DE LEY';
  return {
    id: p.id,
    categoryBadge: kindBadge,
    icon,
    title: p.name,
    subtitle: scopeLabel,
    domain: p.domain,
    scope: p.scope,
    x: mid[0],
    y: mid[1],
    elevationLabel: p.elevationLabel,
    climateLabel: p.climateLabel,
    cantoRef: p.cantoRef,
    loreText: p.loreNote,
    tacticalSummary: p.trafficLabel
      ? `Tráfego Ativo na Rota: ${p.trafficLabel}`
      : undefined,
    nativeCards: resolveNativeCardsByIds(p.nativeCardIds, p.domain, p.id, 4),
  };
}

export function buildSettlementInspectionNote(
  prov: ConquestProvinceDef,
  settlement: MicroSettlement,
  x: number,
  y: number,
  scope: VaeloriaMapScope
): CartographicInspectionNote {
  const kindMap: Record<
    MicroSettlement['kind'],
    { icon: string; label: string; perk: string }
  > = {
    village: {
      icon: '🏘️',
      label: 'Vila & Entreposto Local',
      perk: `Abastece a guarnição de ${prov.name} (+${prov.supplyIncome} Suprimentos base na província).`,
    },
    mine: {
      icon: '⛏️',
      label: 'Lavra Mineral & Extração',
      perk: `Fornece minérios estratégicos para Forjas de Guerra em ${prov.name}.`,
    },
    watchtower: {
      icon: '🗼',
      label: 'Atalaia & Vigia de Fronteira',
      perk: `Monitora corredores de invasão vizinhos (${prov.neighbors.length} rotas conectadas).`,
    },
    harbor: {
      icon: '⚓',
      label: 'Ancoradouro & Doca Tática',
      perk: `Sustenta linhas costeiras/aéreas de suprimento de ${prov.name}.`,
    },
    shrine: {
      icon: '⛩️',
      label: 'Ermida & Nodo Menor de Ley',
      perk: `Canaliza afinidade elemental (${prov.terrainLabel}) para os defensores locais.`,
    },
  };
  const meta = kindMap[settlement.kind];
  const elevationByTerrain: Record<ConquestProvinceDef['terrainKind'], string> = {
    citadel: '+980 m • Platô Fortificado',
    mountain_pass: '+2.350 m • Desfiladeiro Alpino',
    port: '12 m • Nível Costeiro',
    forge: '+1.820 m • Bancada Vulcânica',
    sanctuary: '+640 m • Clareira Consagrada',
    marsh: '45 m • Várzea Úmida',
    forest: '210 m • Sob o Dossel',
    glacier: '+1.490 m • Frente Glacial',
    skyway: '+4.100 m • Rochedo Suspenso',
  };
  return {
    id: `settle_${prov.id}_${settlement.name}`,
    categoryBadge: `ASSENTAMENTO • ${meta.label.toUpperCase()}`,
    icon: meta.icon,
    title: settlement.name,
    subtitle: `Província de ${prov.name} • ${prov.regionLabel}`,
    domain: prov.domain,
    scope,
    x,
    y,
    elevationLabel: elevationByTerrain[prov.terrainKind],
    climateLabel: prov.terrainLabel,
    cantoRef: `Jurisdição de ${prov.garrisonCommander}`,
    loreText: `${settlement.name} integra a malha territorial de ${prov.name}. ${prov.loreSnippet}`,
    tacticalSummary: meta.perk,
    nativeCards: resolveNativeCardsByIds(
      [prov.garrisonAvatarCardId],
      prov.domain,
      `${prov.id}_${settlement.name}`,
      4
    ),
  };
}

export function buildBattlefieldInspectionNote(
  site: HistoricalBattlefieldSite,
  scope: VaeloriaMapScope
): CartographicInspectionNote {
  return {
    id: site.id,
    categoryBadge: `MEMÓRIA DE GUERRA • ${site.yearLabel.toUpperCase()}`,
    icon: '⚔️',
    title: site.name,
    subtitle: site.belligerents,
    domain: site.domain,
    scope,
    x: scope === 'world' ? site.worldX : site.regionalX,
    y: scope === 'world' ? site.worldY : site.regionalY,
    elevationLabel: `Teatro Histórico (${site.yearLabel})`,
    climateLabel: site.cantoRef,
    cantoRef: site.cantoRef,
    loreText: `${site.loreNote} Desfecho: ${site.outcome}`,
    tacticalSummary: `Beligerantes: ${site.belligerents}`,
    fastTravelScope:
      scope === 'world' && site.regionalScope !== 'world'
        ? site.regionalScope
        : undefined,
    fastTravelLabel:
      scope === 'world' && site.regionalScope !== 'world'
        ? `Inspecionar no Mapa de ${VAELORIA_REGIONAL_MAPS[site.regionalScope].shortName}`
        : undefined,
    nativeCards: resolveNativeCardsByIds(
      site.nativeCardIds,
      site.domain,
      site.id,
      4
    ),
  };
}

// ============================================================================
// ALMANAQUE GEOGRÁFICO BUSCÁVEL DE VAELORIA (GAZETTEER DE 500+ LOCAIS)
// ============================================================================

export type GazetteerCategory =
  | 'map_realm'
  | 'capital_district'
  | 'province'
  | 'boss_seat'
  | 'landmark'
  | 'settlement'
  | 'toponym'
  | 'hydrography'
  | 'battlefield';

export interface VaeloriaGazetteerEntry {
  id: string;
  name: string;
  normalizedSearch: string;
  category: GazetteerCategory;
  categoryLabel: string;
  icon: string;
  domain: Domain;
  scope: VaeloriaMapScope;
  scopeShortName: string;
  x: number;
  y: number;
  recommendedZoom: number;
  subtitle: string;
  provinceId?: string;
  bossId?: string;
  inspectionNote?: CartographicInspectionNote;
}

function normalizeText(raw: string): string {
  return raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

let cachedGazetteer: VaeloriaGazetteerEntry[] | null = null;

export function getVaeloriaGazetteerIndex(): VaeloriaGazetteerEntry[] {
  if (cachedGazetteer) return cachedGazetteer;

  const entries: VaeloriaGazetteerEntry[] = [];

  // 1. Continental Map + 20 Navigable Realms/Frontiers/Corridors/Capitals (21 Maps)
  entries.push({
    id: 'gaz_map_world',
    name: 'Continente de Vaeloria (Mapa-Múndi)',
    normalizedSearch: normalizeText('Continente de Vaeloria Mapa Mundi Atlas Geral'),
    category: 'map_realm',
    categoryLabel: '1ª Escala • Continente',
    icon: '🌍',
    domain: 'neutral',
    scope: 'world',
    scopeShortName: 'Continente',
    x: 50,
    y: 50,
    recommendedZoom: 1,
    subtitle: 'Visão continental completa dos seis domínios e enclaves',
  });

  for (const rid of VAELORIA_REALM_ORDER) {
    const def = VAELORIA_REGIONAL_MAPS[rid];
    const catLabel =
      def.tier === 'imperial_capital'
        ? '4ª Escala • Capital'
        : def.tier === 'transit_corridor'
          ? '3ª Escala • Corredor'
          : def.tier === 'deep_frontier'
            ? '3ª Escala • Fronteira'
            : '2ª Escala • Reino';
    entries.push({
      id: `gaz_map_${rid}`,
      name: def.name,
      normalizedSearch: normalizeText(`${def.name} ${def.shortName} ${def.subtitle}`),
      category: 'map_realm',
      categoryLabel: catLabel,
      icon: def.icon,
      domain: def.domain,
      scope: rid,
      scopeShortName: def.shortName,
      x: 50,
      y: 50,
      recommendedZoom: 1.15,
      subtitle: def.subtitle,
    });
  }

  // 2. 36 Interactive Capital Districts
  for (const dist of VAELORIA_CAPITAL_DISTRICTS) {
    const capDef = VAELORIA_REGIONAL_MAPS[dist.capitalScope];
    entries.push({
      id: `gaz_dist_${dist.id}`,
      name: dist.name,
      normalizedSearch: normalizeText(`${dist.name} ${dist.roleLabel} ${capDef.shortName}`),
      category: 'capital_district',
      categoryLabel: `Distrito • ${capDef.shortName}`,
      icon: dist.icon,
      domain: dist.domain,
      scope: dist.capitalScope,
      scopeShortName: capDef.shortName,
      x: dist.x,
      y: dist.y,
      recommendedZoom: 1.9,
      subtitle: `${dist.roleLabel} — ${dist.elevationLabel}`,
      inspectionNote: buildDistrictInspectionNote(dist),
    });
  }

  // 3. 48 Conquest Provinces + 170 Micro-Settlements
  for (const prov of CONQUEST_PROVINCES) {
    const reg = PROVINCE_REGIONAL_COORDS[prov.id];
    const targetScope: VaeloriaMapScope = reg ? reg.realm : 'world';
    const px = reg ? reg.rx : prov.x;
    const py = reg ? reg.ry : prov.y;
    const scopeName =
      targetScope === 'world'
        ? 'Continente'
        : VAELORIA_REGIONAL_MAPS[targetScope].shortName;

    entries.push({
      id: `gaz_prov_${prov.id}`,
      name: prov.name,
      normalizedSearch: normalizeText(
        `${prov.name} ${prov.regionLabel} ${prov.garrisonCommander} ${prov.terrainLabel}`
      ),
      category: 'province',
      categoryLabel: 'Província Imperial',
      icon: prov.isCapital ? '👑' : '🛡️',
      domain: prov.domain,
      scope: targetScope,
      scopeShortName: scopeName,
      x: px,
      y: py,
      recommendedZoom: 1.85,
      subtitle: `${prov.regionLabel} • Comandante ${prov.garrisonCommander}`,
      provinceId: prov.id,
    });

    for (const ms of prov.microSettlements ?? []) {
      const sx = Math.max(4, Math.min(96, px + ms.dx * 2.4));
      const sy = Math.max(5, Math.min(95, py + ms.dy * 2.4));
      const note = buildSettlementInspectionNote(prov, ms, sx, sy, targetScope);
      entries.push({
        id: `gaz_settle_${prov.id}_${ms.name}`,
        name: ms.name,
        normalizedSearch: normalizeText(`${ms.name} ${prov.name} ${scopeName}`),
        category: 'settlement',
        categoryLabel: `Assentamento • ${scopeName}`,
        icon: note.icon,
        domain: prov.domain,
        scope: targetScope,
        scopeShortName: scopeName,
        x: sx,
        y: sy,
        recommendedZoom: 2.5,
        subtitle: `Pertence a ${prov.name}`,
        provinceId: prov.id,
        inspectionNote: note,
      });
    }
  }

  // 4. 32 Campaign Bosses
  for (const boss of CAMPAIGN_BOSSES) {
    const reg = STAGE_REGIONAL_COORDS[boss.id];
    const scope: VaeloriaMapScope = reg ? reg.realm : 'world';
    const scopeName =
      scope === 'world' ? 'Continente' : VAELORIA_REGIONAL_MAPS[scope].shortName;
    entries.push({
      id: `gaz_boss_${boss.id}`,
      name: `${boss.name} (${boss.title})`,
      normalizedSearch: normalizeText(`${boss.name} ${boss.title} Etapa ${boss.stage} ${scopeName}`),
      category: 'boss_seat',
      categoryLabel: `Chefe Etapa ${boss.stage}`,
      icon: '⚔️',
      domain: resolvePrimaryBossDomain(boss.domains),
      scope,
      scopeShortName: scopeName,
      x: reg ? reg.rx : 50,
      y: reg ? reg.ry : 50,
      recommendedZoom: 1.95,
      subtitle: `Etapa ${boss.stage} em ${scopeName}`,
      bossId: boss.id,
    });
  }

  // 5. 120 Overworld Exploration Landmarks across 20 Realms
  for (const rid of VAELORIA_REALM_ORDER) {
    const rdef = VAELORIA_REGIONAL_MAPS[rid];
    for (const lm of rdef.localLandmarks) {
      entries.push({
        id: `gaz_lm_${lm.id}`,
        name: lm.name,
        normalizedSearch: normalizeText(`${lm.name} ${rdef.shortName} ${lm.kind}`),
        category: 'landmark',
        categoryLabel: `Marco • ${rdef.shortName}`,
        icon:
          lm.kind === 'shrine'
            ? '⛩️'
            : lm.kind === 'fort'
              ? '🏰'
              : lm.kind === 'port'
                ? '⚓'
                : lm.kind === 'ruin'
                  ? '🏛️'
                  : lm.kind === 'pass'
                    ? '🌉'
                    : '🏘️',
        domain: rdef.domain,
        scope: rid,
        scopeShortName: rdef.shortName,
        x: lm.x,
        y: lm.y,
        recommendedZoom: 2.1,
        subtitle: `Marco explorável em ${rdef.shortName}`,
      });
    }
  }

  // 6. Toponyms
  for (const top of VAELORIA_CARTOGRAPHIC_TOPONYMS) {
    const scopeName =
      top.scope === 'world'
        ? 'Continente'
        : VAELORIA_REGIONAL_MAPS[top.scope].shortName;
    const note = buildToponymInspectionNote(top);
    entries.push({
      id: `gaz_top_${top.id}`,
      name: top.name,
      normalizedSearch: normalizeText(`${top.name} ${scopeName} ${top.elevationLabel}`),
      category: 'toponym',
      categoryLabel: `Topônimo • ${scopeName}`,
      icon: note.icon,
      domain: top.domain,
      scope: top.scope,
      scopeShortName: scopeName,
      x: top.x,
      y: top.y,
      recommendedZoom: top.lod >= 3 ? 2.9 : top.lod === 2 ? 1.9 : 1.35,
      subtitle: `${top.elevationLabel} • ${top.climateLabel}`,
      inspectionNote: note,
    });
  }

  // 7. Hydrography, Magma, Sea Lanes, Sky Jets & Ley Conduits
  for (const p of VAELORIA_CARTOGRAPHIC_PATHS) {
    const scopeName =
      p.scope === 'world'
        ? 'Continente'
        : VAELORIA_REGIONAL_MAPS[p.scope].shortName;
    const note = buildPathInspectionNote(p);
    entries.push({
      id: `gaz_path_${p.id}`,
      name: p.name,
      normalizedSearch: normalizeText(`${p.name} ${scopeName} ${p.trafficLabel ?? ''}`),
      category: 'hydrography',
      categoryLabel: `Rota/Rio • ${scopeName}`,
      icon: note.icon,
      domain: p.domain,
      scope: p.scope,
      scopeShortName: scopeName,
      x: note.x,
      y: note.y,
      recommendedZoom: 1.8,
      subtitle: `${p.elevationLabel} • ${p.cantoRef}`,
      inspectionNote: note,
    });
  }

  // 8. Historical Battlefields of the VII Cantos
  for (const bf of VAELORIA_HISTORICAL_BATTLEFIELDS) {
    const scopeName =
      bf.regionalScope === 'world'
        ? 'Continente'
        : VAELORIA_REGIONAL_MAPS[bf.regionalScope].shortName;
    const note = buildBattlefieldInspectionNote(bf, bf.regionalScope);
    entries.push({
      id: `gaz_bf_${bf.id}`,
      name: `${bf.name} (${bf.yearLabel})`,
      normalizedSearch: normalizeText(
        `${bf.name} ${bf.yearLabel} ${bf.cantoRef} ${bf.belligerents} ${scopeName}`
      ),
      category: 'battlefield',
      categoryLabel: `Batalha Histórica • ${bf.yearLabel}`,
      icon: '⚔️',
      domain: bf.domain,
      scope: bf.regionalScope,
      scopeShortName: scopeName,
      x: bf.regionalX,
      y: bf.regionalY,
      recommendedZoom: 2.0,
      subtitle: `${bf.cantoRef} — ${bf.belligerents}`,
      inspectionNote: note,
    });
  }

  cachedGazetteer = entries;
  return entries;
}

export function searchVaeloriaGazetteer(
  query: string,
  limit = 18
): VaeloriaGazetteerEntry[] {
  const all = getVaeloriaGazetteerIndex();
  const q = normalizeText(query);
  if (!q) {
    // Curated showcase when search box opens empty: Capitals, Corridors, Major Rivers & Battlefields
    return all
      .filter(
        (e) =>
          e.category === 'map_realm' ||
          e.category === 'capital_district' ||
          e.category === 'battlefield'
      )
      .slice(0, limit);
  }
  const tokens = q.split(/\s+/).filter(Boolean);
  const scored: Array<{ entry: VaeloriaGazetteerEntry; score: number }> = [];
  for (const entry of all) {
    let matchesAll = true;
    for (const tok of tokens) {
      if (!entry.normalizedSearch.includes(tok)) {
        matchesAll = false;
        break;
      }
    }
    if (!matchesAll) continue;
    const normTitle = normalizeText(entry.name);
    let score = 10;
    if (normTitle.startsWith(q)) score += 50;
    else if (normTitle.includes(q)) score += 25;
    if (entry.category === 'map_realm') score += 12;
    if (entry.category === 'capital_district' || entry.category === 'province') score += 8;
    scored.push({ entry, score });
  }
  scored.sort((a, b) => b.score - a.score || a.entry.name.localeCompare(b.entry.name));
  return scored.slice(0, limit).map((s) => s.entry);
}
