import { CAMPAIGN_BOSSES, PREBUILT_DECKS } from './decks';
import {
  BICOLOR_ARCHETYPE_MASTERY,
  MONOCOLOR_ARCHETYPE_MASTERY,
  MonocolorArchetypeId,
  POLYCOLOR_ARCHETYPE_MASTERY,
  resolveBicolorArchetypeForDeckId,
  resolveBicolorArchetypeForDomains,
  resolvePentachromaticArchetypeForBoss,
  resolvePolycolorArchetypeForDeckId,
  resolveTricolorArchetypeForDomains,
} from './aiMonocolorMastery';
import { GameState } from '../types/game';

/**
 * GERADO AUTOMATICAMENTE POR src/scripts/trainAiLeague.ts
 * Total da Maratona IA vs IA: 202,464 partidas completas simuladas (859.4s).
 */

export interface AiDecisionWeights {
  aggroFaceBias: number;
  tradeValueBias: number;
  guardianPriority: number;
  flyingEvasionBias: number;
  stackConsolidationBias: number;
  antiAoeSpreadBias: number;
  spellHoldPatience: number;
  relicPriority: number;
  ascensionEagerness: number;
  bloodPactThresholdHp: number;
  domainExpansionEagerness: number;
  sovPowerTempoBias: number;
  synergyHoldBonus: number;
  mulliganCurveTarget: number;
}

export interface DiscoveredCardCombo {
  cardAId: string;
  cardBId: string;
  coPlayWinRate: number;
  liftOverBaseline: number;
  sampleCount: number;
  synergyNote: string;
}

export interface DeckLearnedAiProfile {
  deckId: string;
  deckName: string;
  archetypeTag: string;
  generationsTrained: number;
  matchesSimulated: number;
  baselineWinRate: number;
  trainedWinRate: number;
  weights: AiDecisionWeights;
  mulliganKeepIds: string[];
  channelPriorityIds: string[];
  channelAvoidIds: string[];
  highImpactCardBoosts: Record<string, number>;
  synergyPairs: Array<[string, string]>;
  discoveredCombos: DiscoveredCardCombo[];
}

export const DEFAULT_AI_WEIGHTS: AiDecisionWeights = {
  "aggroFaceBias": 1,
  "tradeValueBias": 1,
  "guardianPriority": 1,
  "flyingEvasionBias": 1,
  "stackConsolidationBias": 1,
  "antiAoeSpreadBias": 1,
  "spellHoldPatience": 1,
  "relicPriority": 1,
  "ascensionEagerness": 1,
  "bloodPactThresholdHp": 24,
  "domainExpansionEagerness": 1,
  "sovPowerTempoBias": 1,
  "synergyHoldBonus": 20,
  "mulliganCurveTarget": 3.2
};

export const BASELINE_AI_PROFILE: DeckLearnedAiProfile = {
  deckId: 'baseline_default',
  deckName: 'Doutrina Base Vaeloriana',
  archetypeTag: 'Equilíbrio Tático Padrão',
  generationsTrained: 0,
  matchesSimulated: 0,
  baselineWinRate: 50,
  trainedWinRate: 50,
  weights: { ...DEFAULT_AI_WEIGHTS },
  mulliganKeepIds: [],
  channelPriorityIds: [],
  channelAvoidIds: [],
  highImpactCardBoosts: {},
  synergyPairs: [],
  discoveredCombos: [],
};

export const AI_LEAGUE_SUMMARY = {
  totalMatchesSimulated: 202464,
  decksTrained: 40,
  elapsedSeconds: 859.4,
} as const;

export const AI_LEARNED_PROFILES: Record<string, DeckLearnedAiProfile> = {
  "deck_red_inferno": {
    "deckId": "deck_red_inferno",
    "deckName": "Grimório da Cratera Ardente",
    "archetypeTag": "aggro",
    "generationsTrained": 46,
    "matchesSimulated": 17256,
    "baselineWinRate": 35.6,
    "trainedWinRate": 47.5,
    "weights": {
      "aggroFaceBias": 1,
      "tradeValueBias": 0.97,
      "guardianPriority": 1,
      "flyingEvasionBias": 1,
      "stackConsolidationBias": 0.96,
      "antiAoeSpreadBias": 1,
      "spellHoldPatience": 0.99,
      "relicPriority": 1,
      "ascensionEagerness": 0.93,
      "bloodPactThresholdHp": 24,
      "domainExpansionEagerness": 0.96,
      "sovPowerTempoBias": 1,
      "synergyHoldBonus": 24,
      "mulliganCurveTarget": 3.25
    },
    "mulliganKeepIds": [
      "red_42_cavaleiro_draconico",
      "red_79_draco_meteoro",
      "red_12_mephit_magma",
      "red_74_corredor_brasas",
      "red_55_diabrete_forja",
      "red_148_sapador_enxofre"
    ],
    "channelPriorityIds": [
      "red_154_juggernaut_escoria",
      "red_136_arquidemonio_brasas",
      "red_23_dragao_latao",
      "red_104_tempestade_cinzas",
      "red_21_diabo_chifres"
    ],
    "channelAvoidIds": [
      "red_180_malakor_general_lamina_colossal",
      "red_195_clamor_forja_guerra",
      "red_36_bigorna_fogo",
      "red_42_cavaleiro_draconico",
      "red_65_dragao_magma_anciao",
      "red_173_general_roda_chama"
    ],
    "highImpactCardBoosts": {
      "red_180_malakor_general_lamina_colossal": 18,
      "red_195_clamor_forja_guerra": 18,
      "red_36_bigorna_fogo": 18,
      "red_42_cavaleiro_draconico": 18,
      "red_65_dragao_magma_anciao": 18,
      "red_173_general_roda_chama": 18,
      "red_54_coroa_chama_eterna": 18,
      "red_10_altar_draconico": 17
    },
    "synergyPairs": [
      [
        "red_114_draco_escoria",
        "red_180_malakor_general_lamina_colossal"
      ],
      [
        "red_180_malakor_general_lamina_colossal",
        "red_67_fornalha_interior"
      ],
      [
        "red_169_pressagio_revoada_chama",
        "red_195_clamor_forja_guerra"
      ],
      [
        "red_195_clamor_forja_guerra",
        "red_46_tirano_carmesim"
      ],
      [
        "red_36_bigorna_fogo",
        "red_42_cavaleiro_draconico"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "red_114_draco_escoria",
        "cardBId": "red_180_malakor_general_lamina_colossal",
        "coPlayWinRate": 82.4,
        "liftOverBaseline": 45.1,
        "sampleCount": 34,
        "synergyNote": "Abertura de corredor tático: Draco de Escória Vulcânica neutraliza bloqueadores para a infiltração letal de Malakor, General da Lâmina Colossal (82.4% WR, +45.1% Lift)."
      },
      {
        "cardAId": "red_180_malakor_general_lamina_colossal",
        "cardBId": "red_67_fornalha_interior",
        "coPlayWinRate": 81.3,
        "liftOverBaseline": 44,
        "sampleCount": 32,
        "synergyNote": "Abertura de corredor tático: Fornalha Interior neutraliza bloqueadores para a infiltração letal de Malakor, General da Lâmina Colossal (81.3% WR, +44.0% Lift)."
      },
      {
        "cardAId": "red_169_pressagio_revoada_chama",
        "cardBId": "red_195_clamor_forja_guerra",
        "coPlayWinRate": 78.6,
        "liftOverBaseline": 41.3,
        "sampleCount": 28,
        "synergyNote": "Abertura de corredor tático: Clamor da Forja de Guerra neutraliza bloqueadores para a infiltração letal de Presságio da Revoada Cinzenta (78.6% WR, +41.3% Lift)."
      },
      {
        "cardAId": "red_195_clamor_forja_guerra",
        "cardBId": "red_46_tirano_carmesim",
        "coPlayWinRate": 82.4,
        "liftOverBaseline": 45.1,
        "sampleCount": 17,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Clamor da Forja de Guerra + Ignarok, o Devorador de Reinos na mesma janela de pressão (82.4% WR, +45.1% Lift)."
      },
      {
        "cardAId": "red_36_bigorna_fogo",
        "cardBId": "red_42_cavaleiro_draconico",
        "coPlayWinRate": 84.6,
        "liftOverBaseline": 47.3,
        "sampleCount": 13,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Ginete da Asa Escarlate + Bigorna do Rei da Fornalha na mesma janela de pressão (84.6% WR, +47.3% Lift)."
      }
    ]
  },
  "deck_blue_tempest": {
    "deckId": "deck_blue_tempest",
    "deckName": "Tomo do Olho do Furacão",
    "archetypeTag": "tempo",
    "generationsTrained": 46,
    "matchesSimulated": 16294,
    "baselineWinRate": 41.3,
    "trainedWinRate": 62.5,
    "weights": {
      "aggroFaceBias": 1,
      "tradeValueBias": 1,
      "guardianPriority": 1,
      "flyingEvasionBias": 1,
      "stackConsolidationBias": 1,
      "antiAoeSpreadBias": 1,
      "spellHoldPatience": 1,
      "relicPriority": 1,
      "ascensionEagerness": 1,
      "bloodPactThresholdHp": 24,
      "domainExpansionEagerness": 1,
      "sovPowerTempoBias": 1,
      "synergyHoldBonus": 20,
      "mulliganCurveTarget": 3.2
    },
    "mulliganKeepIds": [
      "blue_02_elemental_ar",
      "blue_19_yeti",
      "blue_149_cronomante_ampulheta",
      "blue_18_lobo_invernal",
      "blue_62_principe_ar",
      "blue_132_esfinge_nebulosa"
    ],
    "channelPriorityIds": [
      "blue_124_dissipar_essencia",
      "blue_50_diluvio_primordial",
      "blue_174_inversao_coordenadas",
      "blue_141_ruptura_temporal",
      "blue_48_inverter_gravidade"
    ],
    "channelAvoidIds": [
      "blue_35_cetro_inverno",
      "blue_173_general_roda_gelo",
      "blue_45_oraculo_abissal",
      "blue_28_orbe_tempestade",
      "blue_172_armada_draconica_gelo",
      "blue_71_tigela_mares"
    ],
    "highImpactCardBoosts": {
      "blue_35_cetro_inverno": 18,
      "blue_173_general_roda_gelo": 18,
      "blue_45_oraculo_abissal": 18,
      "blue_28_orbe_tempestade": 18,
      "blue_172_armada_draconica_gelo": 18,
      "blue_71_tigela_mares": 17,
      "blue_136_leviata_cronos": 15,
      "blue_62_principe_ar": 15
    },
    "synergyPairs": [
      [
        "blue_35_cetro_inverno",
        "blue_45_oraculo_abissal"
      ],
      [
        "blue_19_yeti",
        "blue_45_oraculo_abissal"
      ],
      [
        "blue_02_elemental_ar",
        "blue_35_cetro_inverno"
      ],
      [
        "blue_112_golem_gelo_runico",
        "blue_136_leviata_cronos"
      ],
      [
        "blue_173_general_roda_gelo",
        "blue_80_senhor_tempo"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "blue_35_cetro_inverno",
        "cardBId": "blue_45_oraculo_abissal",
        "coPlayWinRate": 100,
        "liftOverBaseline": 48.5,
        "sampleCount": 13,
        "synergyNote": "Abertura de corredor tático: Cetro da Geada Soberana neutraliza bloqueadores para a infiltração letal de Nereus, Soberano das Sete Marés (100.0% WR, +48.5% Lift)."
      },
      {
        "cardAId": "blue_19_yeti",
        "cardBId": "blue_45_oraculo_abissal",
        "coPlayWinRate": 83.7,
        "liftOverBaseline": 32.2,
        "sampleCount": 98,
        "synergyNote": "Yeti Abominável do Pico (4⚡) trava a Vanguarda enquanto Nereus, Soberano das Sete Marés (6⚡) opera protegido com +1 ATQ de Cobertura (83.7% WR, +32.2% Lift)."
      },
      {
        "cardAId": "blue_02_elemental_ar",
        "cardBId": "blue_35_cetro_inverno",
        "coPlayWinRate": 84.6,
        "liftOverBaseline": 33.1,
        "sampleCount": 52,
        "synergyNote": "Abertura de corredor tático: Vórtice Elemental do Ar neutraliza bloqueadores para a infiltração letal de Cetro da Geada Soberana (84.6% WR, +33.1% Lift)."
      },
      {
        "cardAId": "blue_112_golem_gelo_runico",
        "cardBId": "blue_136_leviata_cronos",
        "coPlayWinRate": 80.5,
        "liftOverBaseline": 29,
        "sampleCount": 41,
        "synergyNote": "Abertura de corredor tático: Golem de Gelo Rúnico neutraliza bloqueadores para a infiltração letal de Chronoleviatã, Soberano do Tempo (80.5% WR, +29.0% Lift)."
      },
      {
        "cardAId": "blue_173_general_roda_gelo",
        "cardBId": "blue_80_senhor_tempo",
        "coPlayWinRate": 90.9,
        "liftOverBaseline": 39.4,
        "sampleCount": 11,
        "synergyNote": "Thaddeus, Senhor do Tempo (6⚡) trava a Vanguarda enquanto Cryonax, General da Roda Astral (7⚡) opera protegido com +1 ATQ de Cobertura (90.9% WR, +39.4% Lift)."
      }
    ]
  },
  "deck_purple_abyss": {
    "deckId": "deck_purple_abyss",
    "deckName": "Necronomicon do Sol Negro",
    "archetypeTag": "attrition",
    "generationsTrained": 46,
    "matchesSimulated": 15006,
    "baselineWinRate": 44.1,
    "trainedWinRate": 51.6,
    "weights": {
      "aggroFaceBias": 1,
      "tradeValueBias": 1,
      "guardianPriority": 1,
      "flyingEvasionBias": 1,
      "stackConsolidationBias": 1,
      "antiAoeSpreadBias": 1,
      "spellHoldPatience": 1,
      "relicPriority": 1,
      "ascensionEagerness": 1,
      "bloodPactThresholdHp": 24,
      "domainExpansionEagerness": 1,
      "sovPowerTempoBias": 1,
      "synergyHoldBonus": 20,
      "mulliganCurveTarget": 3.2
    },
    "mulliganKeepIds": [
      "purple_18_mumia",
      "purple_132_quimera_costurada",
      "purple_37_acolito_oculto",
      "purple_170_flagelo_cornudo_abismo",
      "purple_13_zumbi",
      "purple_112_carnical_cripta"
    ],
    "channelPriorityIds": [
      "purple_49_banquete_almas",
      "purple_115_golem_ossario",
      "purple_117_conde_nosferatu",
      "purple_135_colosso_catacumba",
      "purple_51_eclipse_eterno"
    ],
    "channelAvoidIds": [
      "purple_172_armada_draconica_abismo",
      "purple_100_dragao_necrotico",
      "purple_156_lich_coroa_entropia",
      "purple_32_apocalipse_vazio",
      "purple_173_general_roda_abismo",
      "purple_71_varinha_orcus"
    ],
    "highImpactCardBoosts": {
      "purple_172_armada_draconica_abismo": 18,
      "purple_100_dragao_necrotico": 18,
      "purple_156_lich_coroa_entropia": 18,
      "purple_32_apocalipse_vazio": 18,
      "purple_173_general_roda_abismo": 18,
      "purple_71_varinha_orcus": 18,
      "purple_89_ampulheta_sangue": 18,
      "purple_83_arquidemonio_tempo": 18
    },
    "synergyPairs": [
      [
        "purple_05_cavaleiro_morte",
        "purple_71_varinha_orcus"
      ],
      [
        "purple_71_varinha_orcus",
        "purple_90_recipiente_arcano"
      ],
      [
        "purple_100_dragao_necrotico",
        "purple_18_mumia"
      ],
      [
        "purple_172_armada_draconica_abismo",
        "purple_40_carnical_real"
      ],
      [
        "purple_18_mumia",
        "purple_32_apocalipse_vazio"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "purple_05_cavaleiro_morte",
        "cardBId": "purple_71_varinha_orcus",
        "coPlayWinRate": 100,
        "liftOverBaseline": 48,
        "sampleCount": 14,
        "synergyNote": "Paladino do Juramento Quebrado (4⚡) trava a Vanguarda enquanto Cetro da Caveira Abissal (4⚡) opera protegido com +1 ATQ de Cobertura (100.0% WR, +48.0% Lift)."
      },
      {
        "cardAId": "purple_71_varinha_orcus",
        "cardBId": "purple_90_recipiente_arcano",
        "coPlayWinRate": 100,
        "liftOverBaseline": 48,
        "sampleCount": 12,
        "synergyNote": "Recursão da Cripta: recicla ameaças abatidas entre Cetro da Caveira Abissal e Recipiente de Almas Aprisionadas, esgotando as remoções rivais (100.0% WR, +48.0% Lift)."
      },
      {
        "cardAId": "purple_100_dragao_necrotico",
        "cardBId": "purple_18_mumia",
        "coPlayWinRate": 89.3,
        "liftOverBaseline": 37.2,
        "sampleCount": 28,
        "synergyNote": "Recursão da Cripta: recicla ameaças abatidas entre Faraó Enfaixado da Cripta e Morgath, O Dragão da Chama Necrótica, esgotando as remoções rivais (89.3% WR, +37.2% Lift)."
      },
      {
        "cardAId": "purple_172_armada_draconica_abismo",
        "cardBId": "purple_40_carnical_real",
        "coPlayWinRate": 100,
        "liftOverBaseline": 48,
        "sampleCount": 11,
        "synergyNote": "Recursão da Cripta: recicla ameaças abatidas entre Lorde Carniçal das Catacumbas e Legião Dracônica do Eclipse, esgotando as remoções rivais (100.0% WR, +48.0% Lift)."
      },
      {
        "cardAId": "purple_18_mumia",
        "cardBId": "purple_32_apocalipse_vazio",
        "coPlayWinRate": 87.5,
        "liftOverBaseline": 35.5,
        "sampleCount": 32,
        "synergyNote": "Recursão da Cripta: recicla ameaças abatidas entre Faraó Enfaixado da Cripta e Eclipse do Vazio Eterno, esgotando as remoções rivais (87.5% WR, +35.5% Lift)."
      }
    ]
  },
  "deck_green_wild": {
    "deckId": "deck_green_wild",
    "deckName": "Códice da Selva Primordial",
    "archetypeTag": "ramp",
    "generationsTrained": 46,
    "matchesSimulated": 17188,
    "baselineWinRate": 48.4,
    "trainedWinRate": 45.3,
    "weights": {
      "aggroFaceBias": 1.12,
      "tradeValueBias": 0.74,
      "guardianPriority": 0.94,
      "flyingEvasionBias": 1.15,
      "stackConsolidationBias": 1.11,
      "antiAoeSpreadBias": 0.99,
      "spellHoldPatience": 0.91,
      "relicPriority": 0.98,
      "ascensionEagerness": 0.92,
      "bloodPactThresholdHp": 24,
      "domainExpansionEagerness": 0.91,
      "sovPowerTempoBias": 1.13,
      "synergyHoldBonus": 21,
      "mulliganCurveTarget": 3.2
    },
    "mulliganKeepIds": [
      "green_07_troll",
      "green_150_xama_raizes_antigas",
      "green_72_cajado_floresta",
      "green_74_coelho_branco_arauto",
      "green_163_despertar_colosso_floresta",
      "green_95_xama_esporos"
    ],
    "channelPriorityIds": [
      "green_100_quimera_selvagem",
      "green_117_mamute_esmeralda",
      "green_101_tiranossauro_alfa",
      "green_158_hidra_pantano_ancestral",
      "green_47_roc_tempestade"
    ],
    "channelAvoidIds": [
      "green_159_tiranossauro_imperador",
      "green_142_patriarca_selva_eterna",
      "green_09_hidra",
      "green_28_totem_silvestre",
      "green_120_hidra_primordial_rei",
      "green_49_dragao_esmeralda"
    ],
    "highImpactCardBoosts": {
      "green_159_tiranossauro_imperador": 18,
      "green_142_patriarca_selva_eterna": 18,
      "green_09_hidra": 18,
      "green_28_totem_silvestre": 18,
      "green_120_hidra_primordial_rei": 18,
      "green_49_dragao_esmeralda": 18,
      "green_179_brennus_marechal_manto_musgo": 18,
      "green_160_behemoth_cratera_viva": 18
    },
    "synergyPairs": [
      [
        "green_120_hidra_primordial_rei",
        "green_95_xama_esporos"
      ],
      [
        "green_13_satiro",
        "green_142_patriarca_selva_eterna"
      ],
      [
        "green_142_patriarca_selva_eterna",
        "green_182_arauto_duas_asas_eden"
      ],
      [
        "green_149_vespa_rainha_feral",
        "green_159_tiranossauro_imperador"
      ],
      [
        "green_163_despertar_colosso_floresta",
        "green_167_arauto_prisma_selva"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "green_120_hidra_primordial_rei",
        "cardBId": "green_95_xama_esporos",
        "coPlayWinRate": 77.8,
        "liftOverBaseline": 43.5,
        "sampleCount": 27,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Xamã do Círculo dos Esporos + Hidra-Rei de Sete Cabeças na mesma janela de pressão (77.8% WR, +43.5% Lift)."
      },
      {
        "cardAId": "green_13_satiro",
        "cardBId": "green_142_patriarca_selva_eterna",
        "coPlayWinRate": 76.9,
        "liftOverBaseline": 42.7,
        "sampleCount": 26,
        "synergyNote": "Sátiro Flautista da Clareira (2⚡) trava a Vanguarda enquanto Sylvanhorn, Patriarca da Selva Eterna (7⚡) opera protegido com +1 ATQ de Cobertura (76.9% WR, +42.7% Lift)."
      },
      {
        "cardAId": "green_142_patriarca_selva_eterna",
        "cardBId": "green_182_arauto_duas_asas_eden",
        "coPlayWinRate": 78.9,
        "liftOverBaseline": 44.7,
        "sampleCount": 19,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Arauto das Duas Asas do Éden + Sylvanhorn, Patriarca da Selva Eterna na mesma janela de pressão (78.9% WR, +44.7% Lift)."
      },
      {
        "cardAId": "green_149_vespa_rainha_feral",
        "cardBId": "green_159_tiranossauro_imperador",
        "coPlayWinRate": 78.9,
        "liftOverBaseline": 44.7,
        "sampleCount": 19,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Gorila-Titã de Couraça de Rocha + Hidra de Peçonha Esmeralda na mesma janela de pressão (78.9% WR, +44.7% Lift)."
      },
      {
        "cardAId": "green_163_despertar_colosso_floresta",
        "cardBId": "green_167_arauto_prisma_selva",
        "coPlayWinRate": 100,
        "liftOverBaseline": 65.8,
        "sampleCount": 6,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Investida do Espírito Urso + Arauto da Raiz Prismática na mesma janela de pressão (100.0% WR, +65.8% Lift)."
      }
    ]
  },
  "deck_gold_bastion": {
    "deckId": "deck_gold_bastion",
    "deckName": "Escritura do Baluarte Solar",
    "archetypeTag": "tempo",
    "generationsTrained": 46,
    "matchesSimulated": 15946,
    "baselineWinRate": 40.9,
    "trainedWinRate": 47.2,
    "weights": {
      "aggroFaceBias": 1,
      "tradeValueBias": 1,
      "guardianPriority": 1,
      "flyingEvasionBias": 1,
      "stackConsolidationBias": 1,
      "antiAoeSpreadBias": 1,
      "spellHoldPatience": 1,
      "relicPriority": 1,
      "ascensionEagerness": 1,
      "bloodPactThresholdHp": 24,
      "domainExpansionEagerness": 1,
      "sovPowerTempoBias": 1,
      "synergyHoldBonus": 20,
      "mulliganCurveTarget": 3.2
    },
    "mulliganKeepIds": [
      "gold_170_flagelo_cornudo_sol",
      "gold_43_sentinela_relogio",
      "gold_16_unicornio",
      "gold_147_escudeiro_alvorada_real",
      "gold_37_escudeiro_solar",
      "gold_76_monge_relogio"
    ],
    "channelPriorityIds": [
      "gold_135_serafim_seis_asas",
      "gold_117_arcanjo_egide",
      "gold_136_dragao_platina_celeste",
      "gold_06_deva",
      "gold_82_arcanjo_cronos"
    ],
    "channelAvoidIds": [
      "gold_172_armada_draconica_sol",
      "gold_157_dragao_soberano_alvorada",
      "gold_138_imperador_sol_supremo",
      "gold_07_dragao_ouro",
      "gold_142_calice_alvorada_real",
      "gold_173_general_roda_sol"
    ],
    "highImpactCardBoosts": {
      "gold_172_armada_draconica_sol": 18,
      "gold_157_dragao_soberano_alvorada": 18,
      "gold_138_imperador_sol_supremo": 18,
      "gold_07_dragao_ouro": 18,
      "gold_142_calice_alvorada_real": 18,
      "gold_173_general_roda_sol": 18,
      "gold_119_soberano_ordem_eterna": 18,
      "gold_09_serafim_solar": 18
    },
    "synergyPairs": [
      [
        "gold_138_imperador_sol_supremo",
        "gold_16_unicornio"
      ],
      [
        "gold_147_escudeiro_alvorada_real",
        "gold_156_serafim_coroa_radiante"
      ],
      [
        "gold_113_valquiria_alvorada",
        "gold_87_relogio_bolso_real"
      ],
      [
        "gold_10_egide_radiante",
        "gold_40_pegaso_celeste"
      ],
      [
        "gold_10_egide_radiante",
        "gold_155_arconte_lanca_solar"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "gold_138_imperador_sol_supremo",
        "cardBId": "gold_16_unicornio",
        "coPlayWinRate": 76,
        "liftOverBaseline": 39.8,
        "sampleCount": 25,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Unicórnio do Bosque Sagrado + Hyperion, Deus-Imperador da Aurora na mesma janela de pressão (76.0% WR, +39.8% Lift)."
      },
      {
        "cardAId": "gold_147_escudeiro_alvorada_real",
        "cardBId": "gold_156_serafim_coroa_radiante",
        "coPlayWinRate": 88.9,
        "liftOverBaseline": 52.7,
        "sampleCount": 9,
        "synergyNote": "Paladino do Brasão Solar (1⚡) trava a Vanguarda enquanto Arcanjo Supremo das Seis Asas (7⚡) opera protegido com +1 ATQ de Cobertura (88.9% WR, +52.7% Lift)."
      },
      {
        "cardAId": "gold_113_valquiria_alvorada",
        "cardBId": "gold_87_relogio_bolso_real",
        "coPlayWinRate": 69.8,
        "liftOverBaseline": 33.6,
        "sampleCount": 43,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Cronômetro Dourado de Bolso + Valquíria da Alvorada na mesma janela de pressão (69.8% WR, +33.6% Lift)."
      },
      {
        "cardAId": "gold_10_egide_radiante",
        "cardBId": "gold_40_pegaso_celeste",
        "coPlayWinRate": 73.9,
        "liftOverBaseline": 37.7,
        "sampleCount": 23,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Égide do Planetário + Corcel Alado do Empíreo na mesma janela de pressão (73.9% WR, +37.7% Lift)."
      },
      {
        "cardAId": "gold_10_egide_radiante",
        "cardBId": "gold_155_arconte_lanca_solar",
        "coPlayWinRate": 87.5,
        "liftOverBaseline": 51.3,
        "sampleCount": 8,
        "synergyNote": "Abertura de corredor tático: Égide do Planetário neutraliza bloqueadores para a infiltração letal de General Angelical da Espada Solar (87.5% WR, +51.3% Lift)."
      }
    ]
  },
  "deck_dual_draconic_pact": {
    "deckId": "deck_dual_draconic_pact",
    "deckName": "Grimório das Escamas Imperiais",
    "archetypeTag": "Pacto Duplo 🔥+☀️ • Chama & Ordem",
    "generationsTrained": 44,
    "matchesSimulated": 11906,
    "baselineWinRate": 49.7,
    "trainedWinRate": 63.4,
    "weights": {
      "aggroFaceBias": 1.28,
      "tradeValueBias": 1.2,
      "guardianPriority": 1.26,
      "flyingEvasionBias": 1.2,
      "stackConsolidationBias": 1.38,
      "antiAoeSpreadBias": 1.15,
      "spellHoldPatience": 0.96,
      "relicPriority": 1.22,
      "ascensionEagerness": 1.24,
      "bloodPactThresholdHp": 20,
      "domainExpansionEagerness": 1.08,
      "sovPowerTempoBias": 1,
      "synergyHoldBonus": 22,
      "mulliganCurveTarget": 2.8
    },
    "mulliganKeepIds": [
      "neutral_106_reen_assassino_relojoeiro",
      "gold_43_sentinela_relogio",
      "red_114_draco_escoria",
      "red_42_cavaleiro_draconico",
      "gold_01_espada_animada",
      "gold_37_escudeiro_solar"
    ],
    "channelPriorityIds": [
      "gold_117_arcanjo_egide",
      "gold_136_dragao_platina_celeste",
      "red_06_efreeti",
      "red_153_elemental_fornalha_viva",
      "red_20_quimera"
    ],
    "channelAvoidIds": [
      "neutral_106_reen_assassino_relojoeiro",
      "red_195_clamor_forja_guerra",
      "red_173_general_roda_chama",
      "red_157_dragao_tiamat_carmesim",
      "red_36_bigorna_fogo",
      "red_100_dragao_vulcanico_anciao"
    ],
    "highImpactCardBoosts": {
      "neutral_106_reen_assassino_relojoeiro": 18,
      "red_195_clamor_forja_guerra": 18,
      "red_173_general_roda_chama": 18,
      "red_157_dragao_tiamat_carmesim": 18,
      "red_36_bigorna_fogo": 18,
      "red_100_dragao_vulcanico_anciao": 18,
      "red_156_fenix_coroa_solar": 17,
      "red_12_mephit_magma": 16
    },
    "synergyPairs": [
      [
        "neutral_106_reen_assassino_relojoeiro",
        "red_12_mephit_magma"
      ],
      [
        "neutral_106_reen_assassino_relojoeiro",
        "neutral_80_dragonete_emboscada"
      ],
      [
        "gold_01_espada_animada",
        "red_195_clamor_forja_guerra"
      ],
      [
        "gold_23_dragao_prata",
        "neutral_80_dragonete_emboscada"
      ],
      [
        "red_114_draco_escoria",
        "red_195_clamor_forja_guerra"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "neutral_106_reen_assassino_relojoeiro",
        "cardBId": "red_12_mephit_magma",
        "coPlayWinRate": 91,
        "liftOverBaseline": 34.1,
        "sampleCount": 78,
        "synergyNote": "Abertura de corredor tático: Diabrete de Magma neutraliza bloqueadores para a infiltração letal de Reen, Ceifador de Engrenagens (91.0% WR, +34.1% Lift)."
      },
      {
        "cardAId": "neutral_106_reen_assassino_relojoeiro",
        "cardBId": "neutral_80_dragonete_emboscada",
        "coPlayWinRate": 92.7,
        "liftOverBaseline": 35.8,
        "sampleCount": 41,
        "synergyNote": "Abertura de corredor tático: Dragonete Corredor de Emboscada neutraliza bloqueadores para a infiltração letal de Reen, Ceifador de Engrenagens (92.7% WR, +35.8% Lift)."
      },
      {
        "cardAId": "gold_01_espada_animada",
        "cardBId": "red_195_clamor_forja_guerra",
        "coPlayWinRate": 90.3,
        "liftOverBaseline": 33.4,
        "sampleCount": 31,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Lâmina Voadora Consagrada + Clamor da Forja de Guerra na mesma janela de pressão (90.3% WR, +33.4% Lift)."
      },
      {
        "cardAId": "gold_23_dragao_prata",
        "cardBId": "neutral_80_dragonete_emboscada",
        "coPlayWinRate": 94.4,
        "liftOverBaseline": 37.5,
        "sampleCount": 18,
        "synergyNote": "Dragonete Corredor de Emboscada (2⚡) trava a Vanguarda enquanto Argentum, Sentinela Alabastro (6⚡) opera protegido com +1 ATQ de Cobertura (94.4% WR, +37.5% Lift)."
      },
      {
        "cardAId": "red_114_draco_escoria",
        "cardBId": "red_195_clamor_forja_guerra",
        "coPlayWinRate": 88.6,
        "liftOverBaseline": 31.6,
        "sampleCount": 35,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Clamor da Forja de Guerra + Draco de Escória Vulcânica na mesma janela de pressão (88.6% WR, +31.6% Lift)."
      }
    ]
  },
  "deck_dual_abyssal_storm": {
    "deckId": "deck_dual_abyssal_storm",
    "deckName": "Tomo da Tormenta Abissal",
    "archetypeTag": "Pacto Duplo ❄️+💀 • Tempestade & Abismo",
    "generationsTrained": 44,
    "matchesSimulated": 10134,
    "baselineWinRate": 45,
    "trainedWinRate": 60,
    "weights": {
      "aggroFaceBias": 0.86,
      "tradeValueBias": 1.2,
      "guardianPriority": 1,
      "flyingEvasionBias": 1.2,
      "stackConsolidationBias": 0.94,
      "antiAoeSpreadBias": 1.15,
      "spellHoldPatience": 1.24,
      "relicPriority": 1.22,
      "ascensionEagerness": 1.05,
      "bloodPactThresholdHp": 20,
      "domainExpansionEagerness": 1.08,
      "sovPowerTempoBias": 1,
      "synergyHoldBonus": 22,
      "mulliganCurveTarget": 3.2
    },
    "mulliganKeepIds": [
      "neutral_106_reen_assassino_relojoeiro",
      "blue_109_estudante_astral",
      "purple_148_carnical_catacumba",
      "blue_124_dissipar_essencia",
      "neutral_52_mercenario_planar",
      "purple_35_calice_vampirico"
    ],
    "channelPriorityIds": [
      "blue_50_diluvio_primordial",
      "blue_186_gigante_clava_glacial",
      "blue_120_prisao_zero_absoluto",
      "blue_124_dissipar_essencia",
      "blue_16_sirenideo"
    ],
    "channelAvoidIds": [
      "purple_35_calice_vampirico",
      "neutral_133_escudo_sentinela_olho",
      "neutral_11_botas_aladas",
      "blue_173_general_roda_gelo",
      "blue_28_orbe_tempestade",
      "purple_173_general_roda_abismo"
    ],
    "highImpactCardBoosts": {
      "purple_35_calice_vampirico": 18,
      "neutral_133_escudo_sentinela_olho": 18,
      "neutral_11_botas_aladas": 18,
      "blue_173_general_roda_gelo": 18,
      "blue_28_orbe_tempestade": 18,
      "purple_173_general_roda_abismo": 18,
      "blue_107_bussola_astral": 18,
      "purple_100_dragao_necrotico": 18
    },
    "synergyPairs": [
      [
        "blue_173_general_roda_gelo",
        "purple_20_tecelao_profano"
      ],
      [
        "purple_100_dragao_necrotico",
        "purple_20_tecelao_profano"
      ],
      [
        "neutral_11_botas_aladas",
        "purple_170_flagelo_cornudo_abismo"
      ],
      [
        "blue_19_yeti",
        "neutral_133_escudo_sentinela_olho"
      ],
      [
        "neutral_106_reen_assassino_relojoeiro",
        "purple_35_calice_vampirico"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "blue_173_general_roda_gelo",
        "cardBId": "purple_20_tecelao_profano",
        "coPlayWinRate": 93,
        "liftOverBaseline": 36.3,
        "sampleCount": 43,
        "synergyNote": "Aracnomante das Cavernas (4⚡) trava a Vanguarda enquanto Cryonax, General da Roda Astral (7⚡) opera protegido com +1 ATQ de Cobertura (93.0% WR, +36.3% Lift)."
      },
      {
        "cardAId": "purple_100_dragao_necrotico",
        "cardBId": "purple_20_tecelao_profano",
        "coPlayWinRate": 91.9,
        "liftOverBaseline": 35.2,
        "sampleCount": 37,
        "synergyNote": "Aracnomante das Cavernas (4⚡) trava a Vanguarda enquanto Morgath, O Dragão da Chama Necrótica (7⚡) opera protegido com +1 ATQ de Cobertura (91.9% WR, +35.2% Lift)."
      },
      {
        "cardAId": "neutral_11_botas_aladas",
        "cardBId": "purple_170_flagelo_cornudo_abismo",
        "coPlayWinRate": 100,
        "liftOverBaseline": 43.3,
        "sampleCount": 12,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Botas Aladas do Mensageiro + Flagelo Cornudo do Abismo na mesma janela de pressão (100.0% WR, +43.3% Lift)."
      },
      {
        "cardAId": "blue_19_yeti",
        "cardBId": "neutral_133_escudo_sentinela_olho",
        "coPlayWinRate": 88.2,
        "liftOverBaseline": 31.5,
        "sampleCount": 34,
        "synergyNote": "Escudo Sentinela Sempre-Atento (2⚡) trava a Vanguarda enquanto Yeti Abominável do Pico (4⚡) opera protegido com +1 ATQ de Cobertura (88.2% WR, +31.5% Lift)."
      },
      {
        "cardAId": "neutral_106_reen_assassino_relojoeiro",
        "cardBId": "purple_35_calice_vampirico",
        "coPlayWinRate": 91.3,
        "liftOverBaseline": 34.6,
        "sampleCount": 23,
        "synergyNote": "Abertura de corredor tático: Cálice da Sede Carmesim neutraliza bloqueadores para a infiltração letal de Reen, Ceifador de Engrenagens (91.3% WR, +34.6% Lift)."
      }
    ]
  },
  "deck_dual_primal_fury": {
    "deckId": "deck_dual_primal_fury",
    "deckName": "Códice da Ruína Selvagem",
    "archetypeTag": "ramp",
    "generationsTrained": 44,
    "matchesSimulated": 10292,
    "baselineWinRate": 50.3,
    "trainedWinRate": 59.7,
    "weights": {
      "aggroFaceBias": 1.08,
      "tradeValueBias": 0.92,
      "guardianPriority": 1.04,
      "flyingEvasionBias": 0.78,
      "stackConsolidationBias": 1.03,
      "antiAoeSpreadBias": 1.19,
      "spellHoldPatience": 1.07,
      "relicPriority": 0.92,
      "ascensionEagerness": 0.93,
      "bloodPactThresholdHp": 22,
      "domainExpansionEagerness": 1.07,
      "sovPowerTempoBias": 0.91,
      "synergyHoldBonus": 20,
      "mulliganCurveTarget": 3.26
    },
    "mulliganKeepIds": [
      "green_07_troll",
      "green_186_guardiao_runico_carvalho",
      "neutral_84_cao_guerra_encouracado",
      "red_42_cavaleiro_draconico",
      "red_12_mephit_magma",
      "neutral_81_operario_relojoeiro"
    ],
    "channelPriorityIds": [
      "red_20_quimera",
      "green_183_sachiel_arcanjo_quatro_asas_seiva",
      "green_119_behemoth_cratera_verde",
      "red_44_gigante_forja",
      "red_154_juggernaut_escoria"
    ],
    "channelAvoidIds": [
      "red_157_dragao_tiamat_carmesim",
      "red_100_dragao_vulcanico_anciao",
      "red_173_general_roda_chama",
      "green_182_arauto_duas_asas_eden",
      "red_36_bigorna_fogo",
      "green_179_brennus_marechal_manto_musgo"
    ],
    "highImpactCardBoosts": {
      "red_157_dragao_tiamat_carmesim": 18,
      "red_100_dragao_vulcanico_anciao": 18,
      "red_173_general_roda_chama": 18,
      "green_182_arauto_duas_asas_eden": 18,
      "red_36_bigorna_fogo": 18,
      "green_179_brennus_marechal_manto_musgo": 18,
      "green_173_general_roda_selva": 18,
      "neutral_52_mercenario_planar": 18
    },
    "synergyPairs": [
      [
        "green_07_troll",
        "red_173_general_roda_chama"
      ],
      [
        "red_04_meio_dragao",
        "red_36_bigorna_fogo"
      ],
      [
        "green_188_zahir_genio_tres_desejos",
        "neutral_52_mercenario_planar"
      ],
      [
        "green_36_coracao_floresta",
        "red_04_meio_dragao"
      ],
      [
        "green_182_arauto_duas_asas_eden",
        "green_20_tubarao_terrestre"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "green_07_troll",
        "cardBId": "red_173_general_roda_chama",
        "coPlayWinRate": 100,
        "liftOverBaseline": 47.4,
        "sampleCount": 13,
        "synergyNote": "Abertura de corredor tático: Troll Regenerador do Pântano neutraliza bloqueadores para a infiltração letal de Pyrrakon, General da Roda Vulcânica (100.0% WR, +47.4% Lift)."
      },
      {
        "cardAId": "red_04_meio_dragao",
        "cardBId": "red_36_bigorna_fogo",
        "coPlayWinRate": 90.9,
        "liftOverBaseline": 38.4,
        "sampleCount": 22,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Campeão Dracônico + Bigorna do Rei da Fornalha na mesma janela de pressão (90.9% WR, +38.4% Lift)."
      },
      {
        "cardAId": "green_188_zahir_genio_tres_desejos",
        "cardBId": "neutral_52_mercenario_planar",
        "coPlayWinRate": 100,
        "liftOverBaseline": 47.4,
        "sampleCount": 10,
        "synergyNote": "Motor de aceleração: Mercenário das Lâminas Planais antecipa recursos e fôlego para sustentar o impacto de Zahir, Gênio dos Três Desejos (100.0% WR, +47.4% Lift)."
      },
      {
        "cardAId": "green_36_coracao_floresta",
        "cardBId": "red_04_meio_dragao",
        "coPlayWinRate": 84.2,
        "liftOverBaseline": 31.7,
        "sampleCount": 38,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Coração da Seiva Primordial + Campeão Dracônico na mesma janela de pressão (84.2% WR, +31.7% Lift)."
      },
      {
        "cardAId": "green_182_arauto_duas_asas_eden",
        "cardBId": "green_20_tubarao_terrestre",
        "coPlayWinRate": 100,
        "liftOverBaseline": 47.4,
        "sampleCount": 8,
        "synergyNote": "Abertura de corredor tático: Arauto das Duas Asas do Éden neutraliza bloqueadores para a infiltração letal de Tubarão Terrestre Couraçado (100.0% WR, +47.4% Lift)."
      }
    ]
  },
  "deck_dual_arcane_forge": {
    "deckId": "deck_dual_arcane_forge",
    "deckName": "Grimório da Forja do Zênite",
    "archetypeTag": "control",
    "generationsTrained": 44,
    "matchesSimulated": 10376,
    "baselineWinRate": 39.7,
    "trainedWinRate": 68.4,
    "weights": {
      "aggroFaceBias": 1,
      "tradeValueBias": 1,
      "guardianPriority": 1,
      "flyingEvasionBias": 1,
      "stackConsolidationBias": 1,
      "antiAoeSpreadBias": 1,
      "spellHoldPatience": 1,
      "relicPriority": 1,
      "ascensionEagerness": 1,
      "bloodPactThresholdHp": 24,
      "domainExpansionEagerness": 1,
      "sovPowerTempoBias": 1,
      "synergyHoldBonus": 20,
      "mulliganCurveTarget": 3.2
    },
    "mulliganKeepIds": [
      "neutral_168_tecelao_feixe_matriz",
      "blue_17_bruxa_mar",
      "gold_37_escudeiro_solar",
      "blue_40_naga_guardia",
      "blue_62_principe_ar",
      "gold_16_unicornio"
    ],
    "channelPriorityIds": [
      "blue_134_arquimago_singularidade",
      "blue_132_esfinge_nebulosa",
      "gold_23_dragao_prata",
      "blue_22_dragao_branco",
      "blue_05_gigante_nuvens"
    ],
    "channelAvoidIds": [
      "blue_54_planetario_arcano",
      "gold_87_relogio_bolso_real",
      "blue_173_general_roda_gelo",
      "gold_142_calice_alvorada_real",
      "neutral_168_tecelao_feixe_matriz",
      "blue_17_bruxa_mar"
    ],
    "highImpactCardBoosts": {
      "blue_54_planetario_arcano": 18,
      "gold_87_relogio_bolso_real": 18,
      "blue_173_general_roda_gelo": 18,
      "gold_142_calice_alvorada_real": 18,
      "neutral_168_tecelao_feixe_matriz": 18,
      "blue_17_bruxa_mar": 18,
      "gold_173_general_roda_sol": 18,
      "gold_89_pendulo_justica": 17
    },
    "synergyPairs": [
      [
        "gold_142_calice_alvorada_real",
        "gold_87_relogio_bolso_real"
      ],
      [
        "gold_141_intervencao_angelical",
        "gold_142_calice_alvorada_real"
      ],
      [
        "gold_141_intervencao_angelical",
        "gold_87_relogio_bolso_real"
      ],
      [
        "blue_17_bruxa_mar",
        "gold_16_unicornio"
      ],
      [
        "gold_173_general_roda_sol",
        "gold_43_sentinela_relogio"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "gold_142_calice_alvorada_real",
        "cardBId": "gold_87_relogio_bolso_real",
        "coPlayWinRate": 100,
        "liftOverBaseline": 42.7,
        "sampleCount": 18,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Cálice Real da Alvorada + Cronômetro Dourado de Bolso na mesma janela de pressão (100.0% WR, +42.7% Lift)."
      },
      {
        "cardAId": "gold_141_intervencao_angelical",
        "cardBId": "gold_142_calice_alvorada_real",
        "coPlayWinRate": 90.3,
        "liftOverBaseline": 32.9,
        "sampleCount": 72,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Intervenção da Égide Angelical + Cálice Real da Alvorada na mesma janela de pressão (90.3% WR, +32.9% Lift)."
      },
      {
        "cardAId": "gold_141_intervencao_angelical",
        "cardBId": "gold_87_relogio_bolso_real",
        "coPlayWinRate": 88.9,
        "liftOverBaseline": 31.5,
        "sampleCount": 36,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Intervenção da Égide Angelical + Cronômetro Dourado de Bolso na mesma janela de pressão (88.9% WR, +31.5% Lift)."
      },
      {
        "cardAId": "blue_17_bruxa_mar",
        "cardBId": "gold_16_unicornio",
        "coPlayWinRate": 90.9,
        "liftOverBaseline": 33.6,
        "sampleCount": 22,
        "synergyNote": "Megera da Escuma Negra (3⚡) trava a Vanguarda enquanto Unicórnio do Bosque Sagrado (3⚡) opera protegido com +1 ATQ de Cobertura (90.9% WR, +33.6% Lift)."
      },
      {
        "cardAId": "gold_173_general_roda_sol",
        "cardBId": "gold_43_sentinela_relogio",
        "coPlayWinRate": 87.1,
        "liftOverBaseline": 29.8,
        "sampleCount": 31,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Sentinela da Engrenagem Real + Heliokar, General da Roda Celeste na mesma janela de pressão (87.1% WR, +29.8% Lift)."
      }
    ]
  },
  "deck_dual_eternal_rot": {
    "deckId": "deck_dual_eternal_rot",
    "deckName": "Tomo da Podridão Eterna",
    "archetypeTag": "attrition",
    "generationsTrained": 44,
    "matchesSimulated": 10022,
    "baselineWinRate": 37.2,
    "trainedWinRate": 65.9,
    "weights": {
      "aggroFaceBias": 1.05,
      "tradeValueBias": 1.51,
      "guardianPriority": 1.16,
      "flyingEvasionBias": 1.11,
      "stackConsolidationBias": 0.98,
      "antiAoeSpreadBias": 1.01,
      "spellHoldPatience": 1.03,
      "relicPriority": 0.94,
      "ascensionEagerness": 1.05,
      "bloodPactThresholdHp": 21,
      "domainExpansionEagerness": 0.88,
      "sovPowerTempoBias": 0.91,
      "synergyHoldBonus": 24,
      "mulliganCurveTarget": 2.65
    },
    "mulliganKeepIds": [
      "neutral_84_cao_guerra_encouracado",
      "neutral_81_operario_relojoeiro",
      "green_07_troll",
      "purple_132_quimera_costurada",
      "purple_148_carnical_catacumba",
      "purple_170_flagelo_cornudo_abismo"
    ],
    "channelPriorityIds": [
      "green_155_ente_carvalho_anciao",
      "green_94_urso_runico",
      "purple_135_colosso_catacumba",
      "green_61_planta_carnivora",
      "green_21_colosso_pantano"
    ],
    "channelAvoidIds": [
      "purple_65_principe_mortos",
      "green_163_despertar_colosso_floresta",
      "green_49_dragao_esmeralda",
      "green_88_reencarnacao_ancestral",
      "purple_112_carnical_cripta",
      "purple_148_carnical_catacumba"
    ],
    "highImpactCardBoosts": {
      "purple_65_principe_mortos": 18,
      "green_163_despertar_colosso_floresta": 18,
      "green_49_dragao_esmeralda": 18,
      "green_88_reencarnacao_ancestral": 18,
      "purple_112_carnical_cripta": 18,
      "purple_148_carnical_catacumba": 18,
      "purple_133_ceifador_tumular": 18,
      "green_09_hidra": 18
    },
    "synergyPairs": [
      [
        "green_46_ent_anciao",
        "purple_196_guilhotina_sol_negro"
      ],
      [
        "green_88_reencarnacao_ancestral",
        "purple_65_principe_mortos"
      ],
      [
        "neutral_81_operario_relojoeiro",
        "purple_65_principe_mortos"
      ],
      [
        "green_09_hidra",
        "purple_30_erguer_mortos"
      ],
      [
        "green_09_hidra",
        "purple_196_guilhotina_sol_negro"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "green_46_ent_anciao",
        "cardBId": "purple_196_guilhotina_sol_negro",
        "coPlayWinRate": 100,
        "liftOverBaseline": 45.8,
        "sampleCount": 15,
        "synergyNote": "Carvalho-Mestre de Mil Invernos (5⚡) trava a Vanguarda enquanto Guilhotina do Sol Negro (5⚡) opera protegido com +1 ATQ de Cobertura (100.0% WR, +45.8% Lift)."
      },
      {
        "cardAId": "green_88_reencarnacao_ancestral",
        "cardBId": "purple_65_principe_mortos",
        "coPlayWinRate": 95,
        "liftOverBaseline": 40.8,
        "sampleCount": 20,
        "synergyNote": "Abertura de corredor tático: Reencarnação Primordial neutraliza bloqueadores para a infiltração letal de Malakor-Vael, Soberano da Não-Vida (95.0% WR, +40.8% Lift)."
      },
      {
        "cardAId": "neutral_81_operario_relojoeiro",
        "cardBId": "purple_65_principe_mortos",
        "coPlayWinRate": 88.6,
        "liftOverBaseline": 34.4,
        "sampleCount": 44,
        "synergyNote": "Abertura de corredor tático: Operário de Corda de Ferro neutraliza bloqueadores para a infiltração letal de Malakor-Vael, Soberano da Não-Vida (88.6% WR, +34.4% Lift)."
      },
      {
        "cardAId": "green_09_hidra",
        "cardBId": "purple_30_erguer_mortos",
        "coPlayWinRate": 94.7,
        "liftOverBaseline": 40.5,
        "sampleCount": 19,
        "synergyNote": "Erguer Legião da Cripta (3⚡) trava a Vanguarda enquanto Vorágine, Hidra Voraz do Pântano (6⚡) opera protegido com +1 ATQ de Cobertura (94.7% WR, +40.5% Lift)."
      },
      {
        "cardAId": "green_09_hidra",
        "cardBId": "purple_196_guilhotina_sol_negro",
        "coPlayWinRate": 100,
        "liftOverBaseline": 45.8,
        "sampleCount": 12,
        "synergyNote": "Guilhotina do Sol Negro (5⚡) trava a Vanguarda enquanto Vorágine, Hidra Voraz do Pântano (6⚡) opera protegido com +1 ATQ de Cobertura (100.0% WR, +45.8% Lift)."
      }
    ]
  },
  "deck_dual_blood_flame": {
    "deckId": "deck_dual_blood_flame",
    "deckName": "Aliança de Brasa & Umbra",
    "archetypeTag": "Pacto Duplo 🔥+💀 • Chama & Abismo",
    "generationsTrained": 44,
    "matchesSimulated": 10418,
    "baselineWinRate": 37.5,
    "trainedWinRate": 68.8,
    "weights": {
      "aggroFaceBias": 1.28,
      "tradeValueBias": 1.02,
      "guardianPriority": 1,
      "flyingEvasionBias": 1.2,
      "stackConsolidationBias": 0.94,
      "antiAoeSpreadBias": 1.15,
      "spellHoldPatience": 1.24,
      "relicPriority": 1.22,
      "ascensionEagerness": 1.05,
      "bloodPactThresholdHp": 20,
      "domainExpansionEagerness": 1.08,
      "sovPowerTempoBias": 1,
      "synergyHoldBonus": 22,
      "mulliganCurveTarget": 2.8
    },
    "mulliganKeepIds": [
      "neutral_84_cao_guerra_encouracado",
      "red_42_cavaleiro_draconico",
      "red_03_mastim_infernal",
      "neutral_81_operario_relojoeiro",
      "red_12_mephit_magma",
      "purple_130_verme_necrotico"
    ],
    "channelPriorityIds": [
      "red_176_dancarino_plumas_brasa",
      "purple_59_duergar_despota",
      "purple_77_devorador_anos",
      "red_94_berserker_draconico",
      "purple_185_xama_mascaras_vazias"
    ],
    "channelAvoidIds": [
      "red_172_armada_draconica_chama",
      "purple_23_dracolich",
      "red_173_general_roda_chama",
      "purple_100_dragao_necrotico",
      "purple_126_campanario_mortos",
      "purple_35_calice_vampirico"
    ],
    "highImpactCardBoosts": {
      "red_172_armada_draconica_chama": 18,
      "purple_23_dracolich": 18,
      "red_173_general_roda_chama": 18,
      "purple_100_dragao_necrotico": 18,
      "purple_126_campanario_mortos": 18,
      "purple_35_calice_vampirico": 18,
      "neutral_84_cao_guerra_encouracado": 14,
      "red_36_bigorna_fogo": 14
    },
    "synergyPairs": [
      [
        "purple_185_xama_mascaras_vazias",
        "red_36_bigorna_fogo"
      ],
      [
        "purple_126_campanario_mortos",
        "purple_170_flagelo_cornudo_abismo"
      ],
      [
        "purple_130_verme_necrotico",
        "purple_35_calice_vampirico"
      ],
      [
        "red_03_mastim_infernal",
        "red_173_general_roda_chama"
      ],
      [
        "purple_155_lorde_vampiro_soberano",
        "red_111_predador_piroclastico"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "purple_185_xama_mascaras_vazias",
        "cardBId": "red_36_bigorna_fogo",
        "coPlayWinRate": 100,
        "liftOverBaseline": 39.9,
        "sampleCount": 13,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Xamã das Máscaras Vazias + Bigorna do Rei da Fornalha na mesma janela de pressão (100.0% WR, +39.9% Lift)."
      },
      {
        "cardAId": "purple_126_campanario_mortos",
        "cardBId": "purple_170_flagelo_cornudo_abismo",
        "coPlayWinRate": 87.8,
        "liftOverBaseline": 27.7,
        "sampleCount": 41,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Flagelo Cornudo do Abismo + Campanário dos Mortos na mesma janela de pressão (87.8% WR, +27.7% Lift)."
      },
      {
        "cardAId": "purple_130_verme_necrotico",
        "cardBId": "purple_35_calice_vampirico",
        "coPlayWinRate": 86.4,
        "liftOverBaseline": 26.2,
        "sampleCount": 66,
        "synergyNote": "Motor de aceleração: Verme Couraçado da Necrópole antecipa recursos e fôlego para sustentar o impacto de Cálice da Sede Carmesim (86.4% WR, +26.2% Lift)."
      },
      {
        "cardAId": "red_03_mastim_infernal",
        "cardBId": "red_173_general_roda_chama",
        "coPlayWinRate": 90.9,
        "liftOverBaseline": 30.8,
        "sampleCount": 22,
        "synergyNote": "Abertura de corredor tático: Mastim das Cinzas neutraliza bloqueadores para a infiltração letal de Pyrrakon, General da Roda Vulcânica (90.9% WR, +30.8% Lift)."
      },
      {
        "cardAId": "purple_155_lorde_vampiro_soberano",
        "cardBId": "red_111_predador_piroclastico",
        "coPlayWinRate": 100,
        "liftOverBaseline": 39.9,
        "sampleCount": 9,
        "synergyNote": "Sinergia empírica de alta conversão: curvar Pantera Piroclástica (2⚡) rumo a Ceifador Gigante do Eclipse (6⚡) eleva o domínio de mesa (100.0% WR, +39.9% Lift)."
      }
    ]
  },
  "deck_dual_wild_evolution": {
    "deckId": "deck_dual_wild_evolution",
    "deckName": "Códice da Evolução Quimérica",
    "archetypeTag": "ramp",
    "generationsTrained": 44,
    "matchesSimulated": 10200,
    "baselineWinRate": 50.9,
    "trainedWinRate": 50.3,
    "weights": {
      "aggroFaceBias": 1,
      "tradeValueBias": 1,
      "guardianPriority": 1,
      "flyingEvasionBias": 1,
      "stackConsolidationBias": 1,
      "antiAoeSpreadBias": 1,
      "spellHoldPatience": 1,
      "relicPriority": 1,
      "ascensionEagerness": 1,
      "bloodPactThresholdHp": 24,
      "domainExpansionEagerness": 1,
      "sovPowerTempoBias": 1,
      "synergyHoldBonus": 20,
      "mulliganCurveTarget": 3.2
    },
    "mulliganKeepIds": [
      "green_07_troll",
      "green_19_guardiao_ursino",
      "blue_19_yeti",
      "blue_76_anomalia_viva",
      "neutral_126_concha_runa_uvar",
      "green_52_estouro_manada"
    ],
    "channelPriorityIds": [
      "blue_50_diluvio_primordial",
      "green_144_bencao_arvore_mundo",
      "blue_59_mago_ilusao",
      "blue_126_tomo_zero_absoluto",
      "blue_16_sirenideo"
    ],
    "channelAvoidIds": [
      "green_52_estouro_manada",
      "green_163_despertar_colosso_floresta",
      "blue_173_general_roda_gelo",
      "blue_154_dragao_safira_soberano",
      "green_34_furia_matilha",
      "green_69_chamado_selva"
    ],
    "highImpactCardBoosts": {
      "green_52_estouro_manada": 18,
      "green_163_despertar_colosso_floresta": 18,
      "blue_173_general_roda_gelo": 18,
      "blue_154_dragao_safira_soberano": 18,
      "green_34_furia_matilha": 18,
      "green_69_chamado_selva": 18,
      "neutral_11_botas_aladas": 18,
      "green_120_hidra_primordial_rei": 18
    },
    "synergyPairs": [
      [
        "green_34_furia_matilha",
        "green_52_estouro_manada"
      ],
      [
        "blue_42_serpente_marinha",
        "neutral_11_botas_aladas"
      ],
      [
        "blue_62_principe_ar",
        "green_163_despertar_colosso_floresta"
      ],
      [
        "blue_173_general_roda_gelo",
        "green_12_pixie"
      ],
      [
        "blue_62_principe_ar",
        "green_52_estouro_manada"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "green_34_furia_matilha",
        "cardBId": "green_52_estouro_manada",
        "coPlayWinRate": 100,
        "liftOverBaseline": 44.8,
        "sampleCount": 15,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Chamado da Matilha Alfa + Marcha dos Colossos na mesma janela de pressão (100.0% WR, +44.8% Lift)."
      },
      {
        "cardAId": "blue_42_serpente_marinha",
        "cardBId": "neutral_11_botas_aladas",
        "coPlayWinRate": 100,
        "liftOverBaseline": 44.8,
        "sampleCount": 12,
        "synergyNote": "Abertura de corredor tático: Botas Aladas do Mensageiro neutraliza bloqueadores para a infiltração letal de Leviatã da Fossa Boreal (100.0% WR, +44.8% Lift)."
      },
      {
        "cardAId": "blue_62_principe_ar",
        "cardBId": "green_163_despertar_colosso_floresta",
        "coPlayWinRate": 88.9,
        "liftOverBaseline": 33.7,
        "sampleCount": 36,
        "synergyNote": "Abertura de corredor tático: Yan-Vael, Senhor do Furacão neutraliza bloqueadores para a infiltração letal de Investida do Espírito Urso (88.9% WR, +33.7% Lift)."
      },
      {
        "cardAId": "blue_173_general_roda_gelo",
        "cardBId": "green_12_pixie",
        "coPlayWinRate": 94.4,
        "liftOverBaseline": 39.3,
        "sampleCount": 18,
        "synergyNote": "Fada Pixie do Pó Estelar (2⚡) trava a Vanguarda enquanto Cryonax, General da Roda Astral (7⚡) opera protegido com +1 ATQ de Cobertura (94.4% WR, +39.3% Lift)."
      },
      {
        "cardAId": "blue_62_principe_ar",
        "cardBId": "green_52_estouro_manada",
        "coPlayWinRate": 87.9,
        "liftOverBaseline": 32.7,
        "sampleCount": 33,
        "synergyNote": "Abertura de corredor tático: Yan-Vael, Senhor do Furacão neutraliza bloqueadores para a infiltração letal de Marcha dos Colossos (87.9% WR, +32.7% Lift)."
      }
    ]
  },
  "deck_dual_solar_wild": {
    "deckId": "deck_dual_solar_wild",
    "deckName": "Escritura da Aurora Silvestre",
    "archetypeTag": "midrange",
    "generationsTrained": 44,
    "matchesSimulated": 10392,
    "baselineWinRate": 47.2,
    "trainedWinRate": 65.3,
    "weights": {
      "aggroFaceBias": 1,
      "tradeValueBias": 1,
      "guardianPriority": 1,
      "flyingEvasionBias": 1,
      "stackConsolidationBias": 1,
      "antiAoeSpreadBias": 1,
      "spellHoldPatience": 1,
      "relicPriority": 1,
      "ascensionEagerness": 1,
      "bloodPactThresholdHp": 24,
      "domainExpansionEagerness": 1,
      "sovPowerTempoBias": 1,
      "synergyHoldBonus": 20,
      "mulliganCurveTarget": 3.2
    },
    "mulliganKeepIds": [
      "gold_16_unicornio",
      "gold_37_escudeiro_solar",
      "neutral_63_abjurador_errante",
      "green_19_guardiao_ursino",
      "neutral_81_operario_relojoeiro",
      "gold_141_intervencao_angelical"
    ],
    "channelPriorityIds": [
      "gold_156_serafim_coroa_radiante",
      "green_08_ente",
      "gold_64_rei_hekton",
      "gold_82_arcanjo_cronos",
      "green_151_urso_couraca_musgo"
    ],
    "channelAvoidIds": [
      "green_54_totem_ancestral",
      "gold_87_relogio_bolso_real",
      "gold_172_armada_draconica_sol",
      "green_146_altar_presas_ancestrais",
      "green_173_general_roda_selva",
      "gold_142_calice_alvorada_real"
    ],
    "highImpactCardBoosts": {
      "green_54_totem_ancestral": 18,
      "gold_87_relogio_bolso_real": 18,
      "gold_172_armada_draconica_sol": 18,
      "green_146_altar_presas_ancestrais": 18,
      "green_173_general_roda_selva": 18,
      "gold_142_calice_alvorada_real": 18,
      "gold_32_estandarte_imperial": 18,
      "gold_119_soberano_ordem_eterna": 18
    },
    "synergyPairs": [
      [
        "gold_04_armadura_conjurada",
        "gold_10_egide_radiante"
      ],
      [
        "gold_180_valerius_comandante_aguia_imperial",
        "gold_99_serafim_coroado"
      ],
      [
        "gold_141_intervencao_angelical",
        "gold_16_unicornio"
      ],
      [
        "gold_142_calice_alvorada_real",
        "gold_16_unicornio"
      ],
      [
        "green_179_brennus_marechal_manto_musgo",
        "green_54_totem_ancestral"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "gold_04_armadura_conjurada",
        "cardBId": "gold_10_egide_radiante",
        "coPlayWinRate": 85.3,
        "liftOverBaseline": 27.9,
        "sampleCount": 95,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Sentinela de Elmo Arcano + Égide do Planetário na mesma janela de pressão (85.3% WR, +27.9% Lift)."
      },
      {
        "cardAId": "gold_180_valerius_comandante_aguia_imperial",
        "cardBId": "gold_99_serafim_coroado",
        "coPlayWinRate": 100,
        "liftOverBaseline": 42.7,
        "sampleCount": 10,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Valerius, Comandante da Águia Imperial + Seraphiel, A Imperatriz das Seis Asas na mesma janela de pressão (100.0% WR, +42.7% Lift)."
      },
      {
        "cardAId": "gold_141_intervencao_angelical",
        "cardBId": "gold_16_unicornio",
        "coPlayWinRate": 84.5,
        "liftOverBaseline": 27.1,
        "sampleCount": 161,
        "synergyNote": "Abertura de corredor tático: Intervenção da Égide Angelical neutraliza bloqueadores para a infiltração letal de Unicórnio do Bosque Sagrado (84.5% WR, +27.1% Lift)."
      },
      {
        "cardAId": "gold_142_calice_alvorada_real",
        "cardBId": "gold_16_unicornio",
        "coPlayWinRate": 90.5,
        "liftOverBaseline": 33.1,
        "sampleCount": 21,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Cálice Real da Alvorada + Unicórnio do Bosque Sagrado na mesma janela de pressão (90.5% WR, +33.1% Lift)."
      },
      {
        "cardAId": "green_179_brennus_marechal_manto_musgo",
        "cardBId": "green_54_totem_ancestral",
        "coPlayWinRate": 100,
        "liftOverBaseline": 42.7,
        "sampleCount": 9,
        "synergyNote": "Monólito da Presa Primordial (3⚡) trava a Vanguarda enquanto Brennus, Marechal do Manto de Musgo (5⚡) opera protegido com +1 ATQ de Cobertura (100.0% WR, +42.7% Lift)."
      }
    ]
  },
  "deck_dual_iron_inquisition": {
    "deckId": "deck_dual_iron_inquisition",
    "deckName": "Tomo da Inquisição Crepuscular",
    "archetypeTag": "Pacto Duplo 💀+☀️ • Abismo & Ordem",
    "generationsTrained": 44,
    "matchesSimulated": 9854,
    "baselineWinRate": 43.4,
    "trainedWinRate": 62.2,
    "weights": {
      "aggroFaceBias": 1.02,
      "tradeValueBias": 1.2,
      "guardianPriority": 1.26,
      "flyingEvasionBias": 1.02,
      "stackConsolidationBias": 1.38,
      "antiAoeSpreadBias": 1.15,
      "spellHoldPatience": 1.24,
      "relicPriority": 1.22,
      "ascensionEagerness": 1.24,
      "bloodPactThresholdHp": 20,
      "domainExpansionEagerness": 1.08,
      "sovPowerTempoBias": 1,
      "synergyHoldBonus": 22,
      "mulliganCurveTarget": 3.2
    },
    "mulliganKeepIds": [
      "gold_43_sentinela_relogio",
      "gold_16_unicornio",
      "neutral_84_cao_guerra_encouracado",
      "purple_37_acolito_oculto",
      "gold_37_escudeiro_solar",
      "purple_13_zumbi"
    ],
    "channelPriorityIds": [
      "gold_117_arcanjo_egide",
      "gold_116_centuriao_forja_dourada",
      "purple_154_cavaleiro_morte_eterna",
      "gold_118_colosso_sol_invicto",
      "gold_115_leao_celestial_rei"
    ],
    "channelAvoidIds": [
      "gold_30_escudo_solar",
      "gold_157_dragao_soberano_alvorada",
      "neutral_154_elixir_pedra_ferro",
      "gold_32_estandarte_imperial",
      "neutral_61_fragmento_coroa_prisma",
      "gold_172_armada_draconica_sol"
    ],
    "highImpactCardBoosts": {
      "gold_30_escudo_solar": 18,
      "gold_157_dragao_soberano_alvorada": 18,
      "neutral_154_elixir_pedra_ferro": 18,
      "gold_32_estandarte_imperial": 18,
      "neutral_61_fragmento_coroa_prisma": 18,
      "gold_172_armada_draconica_sol": 18,
      "purple_173_general_roda_abismo": 18,
      "gold_35_chamado_valquirias": 18
    },
    "synergyPairs": [
      [
        "gold_10_egide_radiante",
        "neutral_154_elixir_pedra_ferro"
      ],
      [
        "gold_141_intervencao_angelical",
        "neutral_154_elixir_pedra_ferro"
      ],
      [
        "gold_10_egide_radiante",
        "gold_119_soberano_ordem_eterna"
      ],
      [
        "purple_135_colosso_catacumba",
        "purple_173_general_roda_abismo"
      ],
      [
        "gold_141_intervencao_angelical",
        "gold_30_escudo_solar"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "gold_10_egide_radiante",
        "cardBId": "neutral_154_elixir_pedra_ferro",
        "coPlayWinRate": 89.7,
        "liftOverBaseline": 34.5,
        "sampleCount": 29,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Égide do Planetário + Elixir de Pele de Adamantina na mesma janela de pressão (89.7% WR, +34.5% Lift)."
      },
      {
        "cardAId": "gold_141_intervencao_angelical",
        "cardBId": "neutral_154_elixir_pedra_ferro",
        "coPlayWinRate": 86.7,
        "liftOverBaseline": 31.5,
        "sampleCount": 60,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Intervenção da Égide Angelical + Elixir de Pele de Adamantina na mesma janela de pressão (86.7% WR, +31.5% Lift)."
      },
      {
        "cardAId": "gold_10_egide_radiante",
        "cardBId": "gold_119_soberano_ordem_eterna",
        "coPlayWinRate": 100,
        "liftOverBaseline": 44.8,
        "sampleCount": 10,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Égide do Planetário + Justinian, Soberano da Ordem Eterna na mesma janela de pressão (100.0% WR, +44.8% Lift)."
      },
      {
        "cardAId": "purple_135_colosso_catacumba",
        "cardBId": "purple_173_general_roda_abismo",
        "coPlayWinRate": 100,
        "liftOverBaseline": 44.8,
        "sampleCount": 10,
        "synergyNote": "Abertura de corredor tático: Colosso Gótico da Catacumba neutraliza bloqueadores para a infiltração letal de Nyxaroth, General da Roda Fúnebre (100.0% WR, +44.8% Lift)."
      },
      {
        "cardAId": "gold_141_intervencao_angelical",
        "cardBId": "gold_30_escudo_solar",
        "coPlayWinRate": 84.8,
        "liftOverBaseline": 29.6,
        "sampleCount": 66,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Intervenção da Égide Angelical + Bastião do Sol Invicto na mesma janela de pressão (84.8% WR, +29.6% Lift)."
      }
    ]
  },
  "deck_dual_storm_dragon": {
    "deckId": "deck_dual_storm_dragon",
    "deckName": "Grimório do Fogo Astral",
    "archetypeTag": "tempo",
    "generationsTrained": 44,
    "matchesSimulated": 9938,
    "baselineWinRate": 29.7,
    "trainedWinRate": 57.2,
    "weights": {
      "aggroFaceBias": 1,
      "tradeValueBias": 1,
      "guardianPriority": 1,
      "flyingEvasionBias": 1,
      "stackConsolidationBias": 1,
      "antiAoeSpreadBias": 1,
      "spellHoldPatience": 1,
      "relicPriority": 1,
      "ascensionEagerness": 1,
      "bloodPactThresholdHp": 24,
      "domainExpansionEagerness": 1,
      "sovPowerTempoBias": 1,
      "synergyHoldBonus": 20,
      "mulliganCurveTarget": 3.2
    },
    "mulliganKeepIds": [
      "red_42_cavaleiro_draconico",
      "neutral_84_cao_guerra_encouracado",
      "blue_62_principe_ar",
      "blue_37_mago_aprendiz",
      "red_12_mephit_magma",
      "blue_149_cronomante_ampulheta"
    ],
    "channelPriorityIds": [
      "red_104_tempestade_cinzas",
      "red_72_caldeirao_magma",
      "blue_43_arconte_tempestade",
      "blue_121_tempestade_mental",
      "blue_29_raio_cadeia"
    ],
    "channelAvoidIds": [
      "blue_172_armada_draconica_gelo",
      "blue_173_general_roda_gelo",
      "blue_72_incensario_ventos",
      "blue_28_orbe_tempestade",
      "neutral_11_botas_aladas",
      "blue_08_chamado_trovao"
    ],
    "highImpactCardBoosts": {
      "blue_172_armada_draconica_gelo": 18,
      "blue_173_general_roda_gelo": 18,
      "blue_72_incensario_ventos": 18,
      "blue_28_orbe_tempestade": 18,
      "neutral_11_botas_aladas": 18,
      "blue_08_chamado_trovao": 17,
      "red_42_cavaleiro_draconico": 16,
      "blue_62_principe_ar": 15
    },
    "synergyPairs": [
      [
        "blue_172_armada_draconica_gelo",
        "red_35_contra_ataque_igneo"
      ],
      [
        "blue_172_armada_draconica_gelo",
        "blue_55_familiar_coruja"
      ],
      [
        "blue_173_general_roda_gelo",
        "red_99_senhor_balor_fogo"
      ],
      [
        "blue_67_clone_espelhado",
        "red_188_malik_genio_tres_brasas"
      ],
      [
        "blue_173_general_roda_gelo",
        "red_42_cavaleiro_draconico"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "blue_172_armada_draconica_gelo",
        "cardBId": "red_35_contra_ataque_igneo",
        "coPlayWinRate": 88.9,
        "liftOverBaseline": 40.2,
        "sampleCount": 27,
        "synergyNote": "Abertura de corredor tático: Represália do Escudo em Brasa neutraliza bloqueadores para a infiltração letal de Esquadra Dracônica da Nevasca (88.9% WR, +40.2% Lift)."
      },
      {
        "cardAId": "blue_172_armada_draconica_gelo",
        "cardBId": "blue_55_familiar_coruja",
        "coPlayWinRate": 84.4,
        "liftOverBaseline": 35.7,
        "sampleCount": 32,
        "synergyNote": "Abertura de corredor tático: Coruja Astral de Vigília neutraliza bloqueadores para a infiltração letal de Esquadra Dracônica da Nevasca (84.4% WR, +35.7% Lift)."
      },
      {
        "cardAId": "blue_173_general_roda_gelo",
        "cardBId": "red_99_senhor_balor_fogo",
        "coPlayWinRate": 92.9,
        "liftOverBaseline": 44.2,
        "sampleCount": 14,
        "synergyNote": "Abertura de corredor tático: Bael-Khor, General do Chicote Ígneo neutraliza bloqueadores para a infiltração letal de Cryonax, General da Roda Astral (92.9% WR, +44.2% Lift)."
      },
      {
        "cardAId": "blue_67_clone_espelhado",
        "cardBId": "red_188_malik_genio_tres_brasas",
        "coPlayWinRate": 91.7,
        "liftOverBaseline": 43,
        "sampleCount": 12,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Duplicata Ilusória + Malik, Gênio das Três Brasas na mesma janela de pressão (91.7% WR, +43.0% Lift)."
      },
      {
        "cardAId": "blue_173_general_roda_gelo",
        "cardBId": "red_42_cavaleiro_draconico",
        "coPlayWinRate": 80,
        "liftOverBaseline": 31.3,
        "sampleCount": 35,
        "synergyNote": "Abertura de corredor tático: Ginete da Asa Escarlate neutraliza bloqueadores para a infiltração letal de Cryonax, General da Roda Astral (80.0% WR, +31.3% Lift)."
      }
    ]
  },
  "deck_tri_arcane_cataclysm": {
    "deckId": "deck_tri_arcane_cataclysm",
    "deckName": "Grimório do Cataclismo Arcano",
    "archetypeTag": "control",
    "generationsTrained": 43,
    "matchesSimulated": 16096,
    "baselineWinRate": 40,
    "trainedWinRate": 56.9,
    "weights": {
      "aggroFaceBias": 1.15,
      "tradeValueBias": 1.28,
      "guardianPriority": 1.02,
      "flyingEvasionBias": 1.12,
      "stackConsolidationBias": 1.05,
      "antiAoeSpreadBias": 1.13,
      "spellHoldPatience": 1.24,
      "relicPriority": 1.08,
      "ascensionEagerness": 0.8,
      "bloodPactThresholdHp": 25,
      "domainExpansionEagerness": 1.02,
      "sovPowerTempoBias": 1.09,
      "synergyHoldBonus": 26,
      "mulliganCurveTarget": 2.8
    },
    "mulliganKeepIds": [
      "neutral_93_ladrao_mestre_mascara",
      "blue_182_arauto_duas_asas_geada",
      "red_12_mephit_magma",
      "red_04_meio_dragao",
      "blue_19_yeti",
      "red_42_cavaleiro_draconico"
    ],
    "channelPriorityIds": [
      "blue_121_tempestade_mental",
      "blue_50_diluvio_primordial",
      "red_104_tempestade_cinzas",
      "red_76_salamandra_vapor",
      "blue_29_raio_cadeia"
    ],
    "channelAvoidIds": [
      "blue_173_general_roda_gelo",
      "blue_35_cetro_inverno",
      "purple_65_principe_mortos",
      "blue_153_leviata_fenda_abissal",
      "red_173_general_roda_chama",
      "purple_166_altar_ceifador_supremo"
    ],
    "highImpactCardBoosts": {
      "blue_173_general_roda_gelo": 18,
      "blue_35_cetro_inverno": 18,
      "purple_65_principe_mortos": 18,
      "blue_153_leviata_fenda_abissal": 18,
      "red_173_general_roda_chama": 18,
      "blue_180_leona_marechal_leao_branco_inverno": 18,
      "neutral_93_ladrao_mestre_mascara": 18,
      "blue_67_clone_espelhado": 18
    },
    "synergyPairs": [
      [
        "blue_173_general_roda_gelo",
        "neutral_11_botas_aladas"
      ],
      [
        "blue_173_general_roda_gelo",
        "red_04_meio_dragao"
      ],
      [
        "blue_35_cetro_inverno",
        "red_42_cavaleiro_draconico"
      ],
      [
        "purple_65_principe_mortos",
        "red_42_cavaleiro_draconico"
      ],
      [
        "blue_148_espectro_nevoeiro_algido",
        "red_173_general_roda_chama"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "blue_173_general_roda_gelo",
        "cardBId": "neutral_11_botas_aladas",
        "coPlayWinRate": 95.7,
        "liftOverBaseline": 43.7,
        "sampleCount": 23,
        "synergyNote": "Botas Aladas do Mensageiro (2⚡) trava a Vanguarda enquanto Cryonax, General da Roda Astral (7⚡) opera protegido com +1 ATQ de Cobertura (95.7% WR, +43.7% Lift)."
      },
      {
        "cardAId": "blue_173_general_roda_gelo",
        "cardBId": "red_04_meio_dragao",
        "coPlayWinRate": 92.3,
        "liftOverBaseline": 40.4,
        "sampleCount": 26,
        "synergyNote": "Abertura de corredor tático: Campeão Dracônico neutraliza bloqueadores para a infiltração letal de Cryonax, General da Roda Astral (92.3% WR, +40.4% Lift)."
      },
      {
        "cardAId": "blue_35_cetro_inverno",
        "cardBId": "red_42_cavaleiro_draconico",
        "coPlayWinRate": 92,
        "liftOverBaseline": 40.1,
        "sampleCount": 25,
        "synergyNote": "Abertura de corredor tático: Cetro da Geada Soberana neutraliza bloqueadores para a infiltração letal de Ginete da Asa Escarlate (92.0% WR, +40.1% Lift)."
      },
      {
        "cardAId": "purple_65_principe_mortos",
        "cardBId": "red_42_cavaleiro_draconico",
        "coPlayWinRate": 94.1,
        "liftOverBaseline": 42.2,
        "sampleCount": 17,
        "synergyNote": "Abertura de corredor tático: Ginete da Asa Escarlate neutraliza bloqueadores para a infiltração letal de Malakor-Vael, Soberano da Não-Vida (94.1% WR, +42.2% Lift)."
      },
      {
        "cardAId": "blue_148_espectro_nevoeiro_algido",
        "cardBId": "red_173_general_roda_chama",
        "coPlayWinRate": 100,
        "liftOverBaseline": 48.1,
        "sampleCount": 10,
        "synergyNote": "Abertura de corredor tático: Dançarino dos Chakrams de Raio neutraliza bloqueadores para a infiltração letal de Pyrrakon, General da Roda Vulcânica (100.0% WR, +48.1% Lift)."
      }
    ]
  },
  "deck_tri_primal_titans": {
    "deckId": "deck_tri_primal_titans",
    "deckName": "Códice dos Titãs Primordiais",
    "archetypeTag": "ramp",
    "generationsTrained": 43,
    "matchesSimulated": 9684,
    "baselineWinRate": 52.5,
    "trainedWinRate": 55,
    "weights": {
      "aggroFaceBias": 1.01,
      "tradeValueBias": 1.06,
      "guardianPriority": 1.01,
      "flyingEvasionBias": 1.14,
      "stackConsolidationBias": 1.18,
      "antiAoeSpreadBias": 0.97,
      "spellHoldPatience": 0.97,
      "relicPriority": 0.95,
      "ascensionEagerness": 1,
      "bloodPactThresholdHp": 26,
      "domainExpansionEagerness": 1.07,
      "sovPowerTempoBias": 0.98,
      "synergyHoldBonus": 24,
      "mulliganCurveTarget": 3.19
    },
    "mulliganKeepIds": [
      "green_74_coelho_branco_arauto",
      "neutral_63_abjurador_errante",
      "gold_141_intervencao_angelical",
      "green_19_guardiao_ursino",
      "gold_37_escudeiro_solar",
      "red_42_cavaleiro_draconico"
    ],
    "channelPriorityIds": [
      "gold_23_dragao_prata",
      "green_36_coracao_floresta",
      "gold_22_soberano_dao",
      "green_183_sachiel_arcanjo_quatro_asas_seiva",
      "gold_156_serafim_coroa_radiante"
    ],
    "channelAvoidIds": [
      "green_181_verbena_marechal_cardo_real",
      "red_157_dragao_tiamat_carmesim",
      "red_173_general_roda_chama",
      "gold_157_dragao_soberano_alvorada",
      "green_160_behemoth_cratera_viva",
      "red_144_escudo_magma_reativo"
    ],
    "highImpactCardBoosts": {
      "green_181_verbena_marechal_cardo_real": 18,
      "red_157_dragao_tiamat_carmesim": 18,
      "red_173_general_roda_chama": 18,
      "gold_157_dragao_soberano_alvorada": 18,
      "green_160_behemoth_cratera_viva": 18,
      "red_144_escudo_magma_reativo": 18,
      "gold_172_armada_draconica_sol": 18,
      "gold_173_general_roda_sol": 18
    },
    "synergyPairs": [
      [
        "gold_10_egide_radiante",
        "green_181_verbena_marechal_cardo_real"
      ],
      [
        "gold_141_intervencao_angelical",
        "red_155_senhor_efreeti_chama"
      ],
      [
        "green_181_verbena_marechal_cardo_real",
        "green_74_coelho_branco_arauto"
      ],
      [
        "gold_141_intervencao_angelical",
        "green_160_behemoth_cratera_viva"
      ],
      [
        "neutral_63_abjurador_errante",
        "red_157_dragao_tiamat_carmesim"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "gold_10_egide_radiante",
        "cardBId": "green_181_verbena_marechal_cardo_real",
        "coPlayWinRate": 100,
        "liftOverBaseline": 44.1,
        "sampleCount": 17,
        "synergyNote": "Égide do Planetário (3⚡) trava a Vanguarda enquanto Verbena, Marechal do Cardo Real (7⚡) opera protegido com +1 ATQ de Cobertura (100.0% WR, +44.1% Lift)."
      },
      {
        "cardAId": "gold_141_intervencao_angelical",
        "cardBId": "red_155_senhor_efreeti_chama",
        "coPlayWinRate": 100,
        "liftOverBaseline": 44.1,
        "sampleCount": 12,
        "synergyNote": "Abertura de corredor tático: Intervenção da Égide Angelical neutraliza bloqueadores para a infiltração letal de Dragão Tectônico de Lava (100.0% WR, +44.1% Lift)."
      },
      {
        "cardAId": "green_181_verbena_marechal_cardo_real",
        "cardBId": "green_74_coelho_branco_arauto",
        "coPlayWinRate": 100,
        "liftOverBaseline": 44.1,
        "sampleCount": 11,
        "synergyNote": "Lebre Astral do Tempo Perdido (1⚡) trava a Vanguarda enquanto Verbena, Marechal do Cardo Real (7⚡) opera protegido com +1 ATQ de Cobertura (100.0% WR, +44.1% Lift)."
      },
      {
        "cardAId": "gold_141_intervencao_angelical",
        "cardBId": "green_160_behemoth_cratera_viva",
        "coPlayWinRate": 85.4,
        "liftOverBaseline": 29.5,
        "sampleCount": 41,
        "synergyNote": "Abertura de corredor tático: Intervenção da Égide Angelical neutraliza bloqueadores para a infiltração letal de Terrakhor, Monarca da Rocha Eterna (85.4% WR, +29.5% Lift)."
      },
      {
        "cardAId": "neutral_63_abjurador_errante",
        "cardBId": "red_157_dragao_tiamat_carmesim",
        "coPlayWinRate": 100,
        "liftOverBaseline": 44.1,
        "sampleCount": 8,
        "synergyNote": "Abertura de corredor tático: Abjurador do Selo Cinzento neutraliza bloqueadores para a infiltração letal de Vulcanis, Titã da Bigorna Primordial (100.0% WR, +44.1% Lift)."
      }
    ]
  },
  "deck_tri_eternal_reliquary": {
    "deckId": "deck_tri_eternal_reliquary",
    "deckName": "Relicário do Trono Eterno",
    "archetypeTag": "Pacto Triplo ☀️+❄️+💀 • Ordem, Tempestade & Abismo",
    "generationsTrained": 43,
    "matchesSimulated": 9458,
    "baselineWinRate": 51.6,
    "trainedWinRate": 61.6,
    "weights": {
      "aggroFaceBias": 0.86,
      "tradeValueBias": 1.2,
      "guardianPriority": 1.26,
      "flyingEvasionBias": 1.2,
      "stackConsolidationBias": 1.38,
      "antiAoeSpreadBias": 1.15,
      "spellHoldPatience": 1.24,
      "relicPriority": 1.22,
      "ascensionEagerness": 1.24,
      "bloodPactThresholdHp": 20,
      "domainExpansionEagerness": 1.08,
      "sovPowerTempoBias": 1,
      "synergyHoldBonus": 22,
      "mulliganCurveTarget": 3.2
    },
    "mulliganKeepIds": [
      "gold_43_sentinela_relogio",
      "purple_34_cripta_espinhos",
      "blue_62_principe_ar",
      "gold_37_escudeiro_solar",
      "neutral_84_cao_guerra_encouracado",
      "neutral_87_armadura_animada_vigia"
    ],
    "channelPriorityIds": [
      "purple_196_guilhotina_sol_negro",
      "blue_59_mago_ilusao",
      "gold_04_armadura_conjurada",
      "blue_95_leviata_abissal",
      "blue_134_arquimago_singularidade"
    ],
    "channelAvoidIds": [
      "blue_173_general_roda_gelo",
      "purple_173_general_roda_abismo",
      "gold_10_egide_radiante",
      "gold_87_relogio_bolso_real",
      "blue_180_leona_marechal_leao_branco_inverno",
      "gold_180_valerius_comandante_aguia_imperial"
    ],
    "highImpactCardBoosts": {
      "blue_173_general_roda_gelo": 18,
      "purple_173_general_roda_abismo": 18,
      "gold_10_egide_radiante": 18,
      "gold_87_relogio_bolso_real": 18,
      "blue_180_leona_marechal_leao_branco_inverno": 18,
      "gold_180_valerius_comandante_aguia_imperial": 18,
      "neutral_11_botas_aladas": 18,
      "gold_48_decreto_imperial": 17
    },
    "synergyPairs": [
      [
        "blue_112_golem_gelo_runico",
        "purple_173_general_roda_abismo"
      ],
      [
        "blue_180_leona_marechal_leao_branco_inverno",
        "blue_45_oraculo_abissal"
      ],
      [
        "blue_173_general_roda_gelo",
        "purple_67_sussurros_loucura"
      ],
      [
        "gold_10_egide_radiante",
        "purple_34_cripta_espinhos"
      ],
      [
        "blue_173_general_roda_gelo",
        "gold_48_decreto_imperial"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "blue_112_golem_gelo_runico",
        "cardBId": "purple_173_general_roda_abismo",
        "coPlayWinRate": 100,
        "liftOverBaseline": 45.3,
        "sampleCount": 11,
        "synergyNote": "Abertura de corredor tático: Golem de Gelo Rúnico neutraliza bloqueadores para a infiltração letal de Nyxaroth, General da Roda Fúnebre (100.0% WR, +45.3% Lift)."
      },
      {
        "cardAId": "blue_180_leona_marechal_leao_branco_inverno",
        "cardBId": "blue_45_oraculo_abissal",
        "coPlayWinRate": 100,
        "liftOverBaseline": 45.3,
        "sampleCount": 10,
        "synergyNote": "Leona, Marechal do Leão Branco de Inverno (5⚡) trava a Vanguarda enquanto Nereus, Soberano das Sete Marés (6⚡) opera protegido com +1 ATQ de Cobertura (100.0% WR, +45.3% Lift)."
      },
      {
        "cardAId": "blue_173_general_roda_gelo",
        "cardBId": "purple_67_sussurros_loucura",
        "coPlayWinRate": 87.1,
        "liftOverBaseline": 32.4,
        "sampleCount": 31,
        "synergyNote": "Abertura de corredor tático: Ecos da Loucura Abissal neutraliza bloqueadores para a infiltração letal de Cryonax, General da Roda Astral (87.1% WR, +32.4% Lift)."
      },
      {
        "cardAId": "gold_10_egide_radiante",
        "cardBId": "purple_34_cripta_espinhos",
        "coPlayWinRate": 83.5,
        "liftOverBaseline": 28.8,
        "sampleCount": 109,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Égide do Planetário + Sarcófago de Espinhos Negros na mesma janela de pressão (83.5% WR, +28.8% Lift)."
      },
      {
        "cardAId": "blue_173_general_roda_gelo",
        "cardBId": "gold_48_decreto_imperial",
        "coPlayWinRate": 86.7,
        "liftOverBaseline": 32,
        "sampleCount": 30,
        "synergyNote": "Abertura de corredor tático: Édito da Falange Dourada neutraliza bloqueadores para a infiltração letal de Cryonax, General da Roda Astral (86.7% WR, +32.0% Lift)."
      }
    ]
  },
  "deck_tri_blood_moon": {
    "deckId": "deck_tri_blood_moon",
    "deckName": "Tomo da Lua Sangrenta",
    "archetypeTag": "aggro",
    "generationsTrained": 43,
    "matchesSimulated": 9492,
    "baselineWinRate": 56.3,
    "trainedWinRate": 59.4,
    "weights": {
      "aggroFaceBias": 1,
      "tradeValueBias": 1,
      "guardianPriority": 1,
      "flyingEvasionBias": 1,
      "stackConsolidationBias": 1,
      "antiAoeSpreadBias": 1,
      "spellHoldPatience": 1,
      "relicPriority": 1,
      "ascensionEagerness": 1,
      "bloodPactThresholdHp": 24,
      "domainExpansionEagerness": 1,
      "sovPowerTempoBias": 1,
      "synergyHoldBonus": 20,
      "mulliganCurveTarget": 3.2
    },
    "mulliganKeepIds": [
      "neutral_93_ladrao_mestre_mascara",
      "green_07_troll",
      "neutral_84_cao_guerra_encouracado",
      "neutral_81_operario_relojoeiro",
      "purple_37_acolito_oculto",
      "neutral_52_mercenario_planar"
    ],
    "channelPriorityIds": [
      "purple_28_filacterio_noite",
      "green_08_ente",
      "purple_05_cavaleiro_morte",
      "red_35_contra_ataque_igneo",
      "green_84_brontossauro_colosso"
    ],
    "channelAvoidIds": [
      "purple_138_soberano_carnica",
      "red_173_general_roda_chama",
      "red_156_fenix_coroa_solar",
      "green_88_reencarnacao_ancestral",
      "purple_30_erguer_mortos",
      "neutral_93_ladrao_mestre_mascara"
    ],
    "highImpactCardBoosts": {
      "purple_138_soberano_carnica": 18,
      "red_173_general_roda_chama": 18,
      "red_156_fenix_coroa_solar": 17,
      "green_88_reencarnacao_ancestral": 14,
      "purple_30_erguer_mortos": 14,
      "neutral_93_ladrao_mestre_mascara": 14,
      "purple_156_lich_coroa_entropia": 13,
      "purple_65_principe_mortos": 13
    },
    "synergyPairs": [
      [
        "green_07_troll",
        "purple_100_dragao_necrotico"
      ],
      [
        "neutral_84_cao_guerra_encouracado",
        "purple_100_dragao_necrotico"
      ],
      [
        "neutral_84_cao_guerra_encouracado",
        "red_156_fenix_coroa_solar"
      ],
      [
        "green_49_dragao_esmeralda",
        "purple_133_ceifador_tumular"
      ],
      [
        "purple_131_inquisidor_sangue",
        "purple_138_soberano_carnica"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "green_07_troll",
        "cardBId": "purple_100_dragao_necrotico",
        "coPlayWinRate": 100,
        "liftOverBaseline": 35.4,
        "sampleCount": 14,
        "synergyNote": "Recursão da Cripta: recicla ameaças abatidas entre Troll Regenerador do Pântano e Morgath, O Dragão da Chama Necrótica, esgotando as remoções rivais (100.0% WR, +35.4% Lift)."
      },
      {
        "cardAId": "neutral_84_cao_guerra_encouracado",
        "cardBId": "purple_100_dragao_necrotico",
        "coPlayWinRate": 92.6,
        "liftOverBaseline": 28,
        "sampleCount": 27,
        "synergyNote": "Abertura de corredor tático: Mastim de Ferro da Caravana neutraliza bloqueadores para a infiltração letal de Morgath, O Dragão da Chama Necrótica (92.6% WR, +28.0% Lift)."
      },
      {
        "cardAId": "neutral_84_cao_guerra_encouracado",
        "cardBId": "red_156_fenix_coroa_solar",
        "coPlayWinRate": 94.4,
        "liftOverBaseline": 29.9,
        "sampleCount": 18,
        "synergyNote": "Abertura de corredor tático: Mastim de Ferro da Caravana neutraliza bloqueadores para a infiltração letal de Pyrokor, Monarca do Fogo Vivo (94.4% WR, +29.9% Lift)."
      },
      {
        "cardAId": "green_49_dragao_esmeralda",
        "cardBId": "purple_133_ceifador_tumular",
        "coPlayWinRate": 91.3,
        "liftOverBaseline": 26.7,
        "sampleCount": 23,
        "synergyNote": "Abertura de corredor tático: Ceifador Executor Tumular neutraliza bloqueadores para a infiltração letal de Smaragda, Soberana da Selva Fechada (91.3% WR, +26.7% Lift)."
      },
      {
        "cardAId": "purple_131_inquisidor_sangue",
        "cardBId": "purple_138_soberano_carnica",
        "coPlayWinRate": 91.3,
        "liftOverBaseline": 26.7,
        "sampleCount": 23,
        "synergyNote": "Sinergia empírica de alta conversão: curvar Inquisidor da Lâmina Sanguínea (3⚡) rumo a Necrothor, Monarca do Trono de Ossos (7⚡) eleva o domínio de mesa (91.3% WR, +26.7% Lift)."
      }
    ]
  },
  "deck_tri_celestial_scales": {
    "deckId": "deck_tri_celestial_scales",
    "deckName": "Escritura das Escamas Celestiais",
    "archetypeTag": "midrange",
    "generationsTrained": 43,
    "matchesSimulated": 9696,
    "baselineWinRate": 50.6,
    "trainedWinRate": 59.4,
    "weights": {
      "aggroFaceBias": 1,
      "tradeValueBias": 1,
      "guardianPriority": 1,
      "flyingEvasionBias": 1,
      "stackConsolidationBias": 1,
      "antiAoeSpreadBias": 1,
      "spellHoldPatience": 1,
      "relicPriority": 1,
      "ascensionEagerness": 1,
      "bloodPactThresholdHp": 24,
      "domainExpansionEagerness": 1,
      "sovPowerTempoBias": 1,
      "synergyHoldBonus": 20,
      "mulliganCurveTarget": 3.2
    },
    "mulliganKeepIds": [
      "gold_37_escudeiro_solar",
      "blue_62_principe_ar",
      "neutral_80_dragonete_emboscada",
      "blue_03_esfinge",
      "gold_76_monge_relogio",
      "blue_55_familiar_coruja"
    ],
    "channelPriorityIds": [
      "gold_04_armadura_conjurada",
      "blue_59_mago_ilusao",
      "blue_134_arquimago_singularidade",
      "blue_132_esfinge_nebulosa",
      "neutral_114_emissario_conselho_aguas"
    ],
    "channelAvoidIds": [
      "green_163_despertar_colosso_floresta",
      "gold_87_relogio_bolso_real",
      "blue_173_general_roda_gelo",
      "blue_172_armada_draconica_gelo",
      "blue_45_oraculo_abissal",
      "gold_100_dragao_imperial_ouro"
    ],
    "highImpactCardBoosts": {
      "green_163_despertar_colosso_floresta": 18,
      "gold_87_relogio_bolso_real": 18,
      "blue_173_general_roda_gelo": 18,
      "blue_172_armada_draconica_gelo": 18,
      "blue_45_oraculo_abissal": 18,
      "gold_100_dragao_imperial_ouro": 18,
      "neutral_11_botas_aladas": 18,
      "neutral_154_elixir_pedra_ferro": 18
    },
    "synergyPairs": [
      [
        "gold_76_monge_relogio",
        "green_88_reencarnacao_ancestral"
      ],
      [
        "gold_100_dragao_imperial_ouro",
        "gold_48_decreto_imperial"
      ],
      [
        "blue_153_leviata_fenda_abissal",
        "blue_173_general_roda_gelo"
      ],
      [
        "blue_153_leviata_fenda_abissal",
        "gold_100_dragao_imperial_ouro"
      ],
      [
        "blue_45_oraculo_abissal",
        "green_84_brontossauro_colosso"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "gold_76_monge_relogio",
        "cardBId": "green_88_reencarnacao_ancestral",
        "coPlayWinRate": 100,
        "liftOverBaseline": 41.7,
        "sampleCount": 18,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Punho do Relógio de Mão + Reencarnação Primordial na mesma janela de pressão (100.0% WR, +41.7% Lift)."
      },
      {
        "cardAId": "gold_100_dragao_imperial_ouro",
        "cardBId": "gold_48_decreto_imperial",
        "coPlayWinRate": 100,
        "liftOverBaseline": 41.7,
        "sampleCount": 17,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Édito da Falange Dourada + Aurion-Sol, O Dragão Imperial do Zênite na mesma janela de pressão (100.0% WR, +41.7% Lift)."
      },
      {
        "cardAId": "blue_153_leviata_fenda_abissal",
        "cardBId": "blue_173_general_roda_gelo",
        "coPlayWinRate": 95.8,
        "liftOverBaseline": 37.5,
        "sampleCount": 24,
        "synergyNote": "Zephyrus, Monarca do Ciclone (6⚡) trava a Vanguarda enquanto Cryonax, General da Roda Astral (7⚡) opera protegido com +1 ATQ de Cobertura (95.8% WR, +37.5% Lift)."
      },
      {
        "cardAId": "blue_153_leviata_fenda_abissal",
        "cardBId": "gold_100_dragao_imperial_ouro",
        "coPlayWinRate": 100,
        "liftOverBaseline": 41.7,
        "sampleCount": 14,
        "synergyNote": "Zephyrus, Monarca do Ciclone (6⚡) trava a Vanguarda enquanto Aurion-Sol, O Dragão Imperial do Zênite (7⚡) opera protegido com +1 ATQ de Cobertura (100.0% WR, +41.7% Lift)."
      },
      {
        "cardAId": "blue_45_oraculo_abissal",
        "cardBId": "green_84_brontossauro_colosso",
        "coPlayWinRate": 100,
        "liftOverBaseline": 41.7,
        "sampleCount": 14,
        "synergyNote": "Brontossauro Trovejante (-3351 C.V.) (5⚡) trava a Vanguarda enquanto Nereus, Soberano das Sete Marés (6⚡) opera protegido com +1 ATQ de Cobertura (100.0% WR, +41.7% Lift)."
      }
    ]
  },
  "deck_spec_chronomancer": {
    "deckId": "deck_spec_chronomancer",
    "deckName": "Códice da Ampulheta Infinita",
    "archetypeTag": "control",
    "generationsTrained": 44,
    "matchesSimulated": 10400,
    "baselineWinRate": 42.5,
    "trainedWinRate": 57.5,
    "weights": {
      "aggroFaceBias": 1.17,
      "tradeValueBias": 1.2,
      "guardianPriority": 1.02,
      "flyingEvasionBias": 1.08,
      "stackConsolidationBias": 0.9,
      "antiAoeSpreadBias": 1.1,
      "spellHoldPatience": 1.39,
      "relicPriority": 1.29,
      "ascensionEagerness": 0.87,
      "bloodPactThresholdHp": 22,
      "domainExpansionEagerness": 0.88,
      "sovPowerTempoBias": 0.98,
      "synergyHoldBonus": 25,
      "mulliganCurveTarget": 2.42
    },
    "mulliganKeepIds": [
      "neutral_168_tecelao_feixe_matriz",
      "gold_37_escudeiro_solar",
      "blue_62_principe_ar",
      "gold_16_unicornio",
      "gold_43_sentinela_relogio",
      "gold_142_calice_alvorada_real"
    ],
    "channelPriorityIds": [
      "blue_134_arquimago_singularidade",
      "blue_34_barreira_espelhada",
      "blue_05_gigante_nuvens",
      "blue_59_mago_ilusao",
      "blue_22_dragao_branco"
    ],
    "channelAvoidIds": [
      "gold_157_dragao_soberano_alvorada",
      "blue_35_cetro_inverno",
      "gold_30_escudo_solar",
      "blue_154_dragao_safira_soberano",
      "neutral_168_tecelao_feixe_matriz",
      "gold_142_calice_alvorada_real"
    ],
    "highImpactCardBoosts": {
      "gold_157_dragao_soberano_alvorada": 18,
      "blue_35_cetro_inverno": 18,
      "gold_30_escudo_solar": 18,
      "blue_154_dragao_safira_soberano": 18,
      "neutral_168_tecelao_feixe_matriz": 18,
      "gold_142_calice_alvorada_real": 18,
      "blue_136_leviata_cronos": 17,
      "gold_87_relogio_bolso_real": 17
    },
    "synergyPairs": [
      [
        "blue_35_cetro_inverno",
        "blue_62_principe_ar"
      ],
      [
        "blue_62_principe_ar",
        "gold_30_escudo_solar"
      ],
      [
        "gold_157_dragao_soberano_alvorada",
        "gold_48_decreto_imperial"
      ],
      [
        "gold_157_dragao_soberano_alvorada",
        "gold_37_escudeiro_solar"
      ],
      [
        "blue_35_cetro_inverno",
        "gold_16_unicornio"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "blue_35_cetro_inverno",
        "cardBId": "blue_62_principe_ar",
        "coPlayWinRate": 88.6,
        "liftOverBaseline": 34.9,
        "sampleCount": 35,
        "synergyNote": "Cetro da Geada Soberana (3⚡) trava a Vanguarda enquanto Yan-Vael, Senhor do Furacão (4⚡) opera protegido com +1 ATQ de Cobertura (88.6% WR, +34.9% Lift)."
      },
      {
        "cardAId": "blue_62_principe_ar",
        "cardBId": "gold_30_escudo_solar",
        "coPlayWinRate": 84.2,
        "liftOverBaseline": 30.5,
        "sampleCount": 95,
        "synergyNote": "Bastião do Sol Invicto (3⚡) trava a Vanguarda enquanto Yan-Vael, Senhor do Furacão (4⚡) opera protegido com +1 ATQ de Cobertura (84.2% WR, +30.5% Lift)."
      },
      {
        "cardAId": "gold_157_dragao_soberano_alvorada",
        "cardBId": "gold_48_decreto_imperial",
        "coPlayWinRate": 93.3,
        "liftOverBaseline": 39.7,
        "sampleCount": 15,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Édito da Falange Dourada + Aurelius, Soberano Dragão da Alvorada na mesma janela de pressão (93.3% WR, +39.7% Lift)."
      },
      {
        "cardAId": "gold_157_dragao_soberano_alvorada",
        "cardBId": "gold_37_escudeiro_solar",
        "coPlayWinRate": 88,
        "liftOverBaseline": 34.3,
        "sampleCount": 25,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Escudeiro da Alvorada + Aurelius, Soberano Dragão da Alvorada na mesma janela de pressão (88.0% WR, +34.3% Lift)."
      },
      {
        "cardAId": "blue_35_cetro_inverno",
        "cardBId": "gold_16_unicornio",
        "coPlayWinRate": 92.9,
        "liftOverBaseline": 39.2,
        "sampleCount": 14,
        "synergyNote": "Abertura de corredor tático: Cetro da Geada Soberana neutraliza bloqueadores para a infiltração letal de Unicórnio do Bosque Sagrado (92.9% WR, +39.2% Lift)."
      }
    ]
  },
  "deck_spec_pentachromatic": {
    "deckId": "deck_spec_pentachromatic",
    "deckName": "Tomo do Dragão Prismático",
    "archetypeTag": "ramp",
    "generationsTrained": 43,
    "matchesSimulated": 9884,
    "baselineWinRate": 58.8,
    "trainedWinRate": 55,
    "weights": {
      "aggroFaceBias": 1,
      "tradeValueBias": 1,
      "guardianPriority": 1,
      "flyingEvasionBias": 1,
      "stackConsolidationBias": 1,
      "antiAoeSpreadBias": 1,
      "spellHoldPatience": 1,
      "relicPriority": 1,
      "ascensionEagerness": 1,
      "bloodPactThresholdHp": 24,
      "domainExpansionEagerness": 1,
      "sovPowerTempoBias": 1,
      "synergyHoldBonus": 20,
      "mulliganCurveTarget": 3.2
    },
    "mulliganKeepIds": [
      "green_19_guardiao_ursino",
      "green_36_coracao_floresta",
      "gold_37_escudeiro_solar",
      "purple_35_calice_vampirico",
      "purple_37_acolito_oculto",
      "blue_40_naga_guardia"
    ],
    "channelPriorityIds": [
      "green_169_pressagio_revoada_selva",
      "blue_196_engrenagens_eternidade",
      "gold_04_armadura_conjurada",
      "purple_05_cavaleiro_morte",
      "blue_153_leviata_fenda_abissal"
    ],
    "channelAvoidIds": [
      "neutral_10_valkyra_pentacromatica",
      "red_172_armada_draconica_chama",
      "blue_198_decreto_decima_segunda_hora",
      "purple_173_general_roda_abismo",
      "purple_156_lich_coroa_entropia",
      "blue_173_general_roda_gelo"
    ],
    "highImpactCardBoosts": {
      "neutral_10_valkyra_pentacromatica": 18,
      "red_172_armada_draconica_chama": 18,
      "blue_198_decreto_decima_segunda_hora": 18,
      "purple_173_general_roda_abismo": 18,
      "purple_156_lich_coroa_entropia": 18,
      "blue_173_general_roda_gelo": 18,
      "purple_172_armada_draconica_abismo": 18,
      "green_163_despertar_colosso_floresta": 18
    },
    "synergyPairs": [
      [
        "purple_156_lich_coroa_entropia",
        "red_55_diabrete_forja"
      ],
      [
        "green_07_troll",
        "purple_156_lich_coroa_entropia"
      ],
      [
        "purple_173_general_roda_abismo",
        "red_55_diabrete_forja"
      ],
      [
        "blue_03_esfinge",
        "blue_198_decreto_decima_segunda_hora"
      ],
      [
        "green_07_troll",
        "green_163_despertar_colosso_floresta"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "purple_156_lich_coroa_entropia",
        "cardBId": "red_55_diabrete_forja",
        "coPlayWinRate": 93.1,
        "liftOverBaseline": 40,
        "sampleCount": 29,
        "synergyNote": "Motor de aceleração: Diabrete Soprador de Brasas antecipa recursos e fôlego para sustentar o impacto de Dragão Umbral do Eclipse (93.1% WR, +40.0% Lift)."
      },
      {
        "cardAId": "green_07_troll",
        "cardBId": "purple_156_lich_coroa_entropia",
        "coPlayWinRate": 100,
        "liftOverBaseline": 46.9,
        "sampleCount": 15,
        "synergyNote": "Recursão da Cripta: recicla ameaças abatidas entre Troll Regenerador do Pântano e Dragão Umbral do Eclipse, esgotando as remoções rivais (100.0% WR, +46.9% Lift)."
      },
      {
        "cardAId": "purple_173_general_roda_abismo",
        "cardBId": "red_55_diabrete_forja",
        "coPlayWinRate": 94.7,
        "liftOverBaseline": 41.6,
        "sampleCount": 19,
        "synergyNote": "Abertura de corredor tático: Diabrete Soprador de Brasas neutraliza bloqueadores para a infiltração letal de Nyxaroth, General da Roda Fúnebre (94.7% WR, +41.6% Lift)."
      },
      {
        "cardAId": "blue_03_esfinge",
        "cardBId": "blue_198_decreto_decima_segunda_hora",
        "coPlayWinRate": 100,
        "liftOverBaseline": 46.9,
        "sampleCount": 11,
        "synergyNote": "Oráculo Esfinge do Pináculo (4⚡) trava a Vanguarda enquanto Decreto da Décima Segunda Hora (7⚡) opera protegido com +1 ATQ de Cobertura (100.0% WR, +46.9% Lift)."
      },
      {
        "cardAId": "green_07_troll",
        "cardBId": "green_163_despertar_colosso_floresta",
        "coPlayWinRate": 94.1,
        "liftOverBaseline": 41,
        "sampleCount": 17,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Troll Regenerador do Pântano + Investida do Espírito Urso na mesma janela de pressão (94.1% WR, +41.0% Lift)."
      }
    ]
  },
  "deck_tri_astral_cataclysm": {
    "deckId": "deck_tri_astral_cataclysm",
    "deckName": "Grimório da Convergência Astral",
    "archetypeTag": "control",
    "generationsTrained": 43,
    "matchesSimulated": 9610,
    "baselineWinRate": 46.9,
    "trainedWinRate": 57.5,
    "weights": {
      "aggroFaceBias": 0.82,
      "tradeValueBias": 0.88,
      "guardianPriority": 1.05,
      "flyingEvasionBias": 1.13,
      "stackConsolidationBias": 1.12,
      "antiAoeSpreadBias": 0.88,
      "spellHoldPatience": 0.99,
      "relicPriority": 1,
      "ascensionEagerness": 0.96,
      "bloodPactThresholdHp": 24,
      "domainExpansionEagerness": 0.88,
      "sovPowerTempoBias": 0.91,
      "synergyHoldBonus": 20,
      "mulliganCurveTarget": 3.36
    },
    "mulliganKeepIds": [
      "blue_62_principe_ar",
      "red_55_diabrete_forja",
      "red_76_salamandra_vapor",
      "neutral_11_botas_aladas",
      "red_12_mephit_magma",
      "neutral_61_fragmento_coroa_prisma"
    ],
    "channelPriorityIds": [
      "red_104_tempestade_cinzas",
      "blue_29_raio_cadeia",
      "blue_121_tempestade_mental",
      "blue_50_diluvio_primordial",
      "blue_134_arquimago_singularidade"
    ],
    "channelAvoidIds": [
      "purple_35_calice_vampirico",
      "blue_35_cetro_inverno",
      "neutral_11_botas_aladas",
      "blue_72_incensario_ventos",
      "red_180_malakor_general_lamina_colossal",
      "neutral_61_fragmento_coroa_prisma"
    ],
    "highImpactCardBoosts": {
      "purple_35_calice_vampirico": 18,
      "blue_35_cetro_inverno": 18,
      "neutral_11_botas_aladas": 18,
      "blue_72_incensario_ventos": 18,
      "red_180_malakor_general_lamina_colossal": 18,
      "red_173_general_roda_chama": 18,
      "blue_173_general_roda_gelo": 18,
      "purple_65_principe_mortos": 18
    },
    "synergyPairs": [
      [
        "purple_65_principe_mortos",
        "purple_81_aberracao_relogio"
      ],
      [
        "red_180_malakor_general_lamina_colossal",
        "red_42_cavaleiro_draconico"
      ],
      [
        "purple_35_calice_vampirico",
        "red_55_diabrete_forja"
      ],
      [
        "blue_19_yeti",
        "purple_173_general_roda_abismo"
      ],
      [
        "blue_173_general_roda_gelo",
        "blue_62_principe_ar"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "purple_65_principe_mortos",
        "cardBId": "purple_81_aberracao_relogio",
        "coPlayWinRate": 100,
        "liftOverBaseline": 50.6,
        "sampleCount": 14,
        "synergyNote": "Abertura de corredor tático: Astrolábio Vivo do Eclipse neutraliza bloqueadores para a infiltração letal de Malakor-Vael, Soberano da Não-Vida (100.0% WR, +50.6% Lift)."
      },
      {
        "cardAId": "red_180_malakor_general_lamina_colossal",
        "cardBId": "red_42_cavaleiro_draconico",
        "coPlayWinRate": 90.9,
        "liftOverBaseline": 41.5,
        "sampleCount": 22,
        "synergyNote": "Abertura de corredor tático: Ginete da Asa Escarlate neutraliza bloqueadores para a infiltração letal de Malakor, General da Lâmina Colossal (90.9% WR, +41.5% Lift)."
      },
      {
        "cardAId": "purple_35_calice_vampirico",
        "cardBId": "red_55_diabrete_forja",
        "coPlayWinRate": 100,
        "liftOverBaseline": 50.6,
        "sampleCount": 10,
        "synergyNote": "Motor de aceleração: Diabrete Soprador de Brasas antecipa recursos e fôlego para sustentar o impacto de Cálice da Sede Carmesim (100.0% WR, +50.6% Lift)."
      },
      {
        "cardAId": "blue_19_yeti",
        "cardBId": "purple_173_general_roda_abismo",
        "coPlayWinRate": 90,
        "liftOverBaseline": 40.6,
        "sampleCount": 20,
        "synergyNote": "Abertura de corredor tático: Yeti Abominável do Pico neutraliza bloqueadores para a infiltração letal de Nyxaroth, General da Roda Fúnebre (90.0% WR, +40.6% Lift)."
      },
      {
        "cardAId": "blue_173_general_roda_gelo",
        "cardBId": "blue_62_principe_ar",
        "coPlayWinRate": 87.5,
        "liftOverBaseline": 38.1,
        "sampleCount": 24,
        "synergyNote": "Abertura de corredor tático: Yan-Vael, Senhor do Furacão neutraliza bloqueadores para a infiltração letal de Cryonax, General da Roda Astral (87.5% WR, +38.1% Lift)."
      }
    ]
  },
  "deck_tri_primordial_forge": {
    "deckId": "deck_tri_primordial_forge",
    "deckName": "Códice dos Behemoths de Obsidiana",
    "archetypeTag": "ramp",
    "generationsTrained": 43,
    "matchesSimulated": 9684,
    "baselineWinRate": 52.8,
    "trainedWinRate": 59.7,
    "weights": {
      "aggroFaceBias": 1.35,
      "tradeValueBias": 1.18,
      "guardianPriority": 1.22,
      "flyingEvasionBias": 0.98,
      "stackConsolidationBias": 1.11,
      "antiAoeSpreadBias": 1.11,
      "spellHoldPatience": 1.05,
      "relicPriority": 1.14,
      "ascensionEagerness": 1.28,
      "bloodPactThresholdHp": 25,
      "domainExpansionEagerness": 1.28,
      "sovPowerTempoBias": 1.05,
      "synergyHoldBonus": 20,
      "mulliganCurveTarget": 2.95
    },
    "mulliganKeepIds": [
      "gold_37_escudeiro_solar",
      "red_114_draco_escoria",
      "gold_76_monge_relogio",
      "gold_43_sentinela_relogio",
      "green_19_guardiao_ursino",
      "gold_16_unicornio"
    ],
    "channelPriorityIds": [
      "gold_23_dragao_prata",
      "neutral_19_pergaminho_protecao",
      "red_32_ritual_cinzas",
      "neutral_114_emissario_conselho_aguas",
      "green_07_troll"
    ],
    "channelAvoidIds": [
      "red_156_fenix_coroa_solar",
      "gold_172_armada_draconica_sol",
      "gold_173_general_roda_sol",
      "red_157_dragao_tiamat_carmesim",
      "gold_157_dragao_soberano_alvorada",
      "green_181_verbena_marechal_cardo_real"
    ],
    "highImpactCardBoosts": {
      "red_156_fenix_coroa_solar": 18,
      "gold_172_armada_draconica_sol": 18,
      "gold_173_general_roda_sol": 18,
      "red_157_dragao_tiamat_carmesim": 18,
      "gold_157_dragao_soberano_alvorada": 18,
      "green_181_verbena_marechal_cardo_real": 18,
      "green_36_coracao_floresta": 18,
      "red_173_general_roda_chama": 18
    },
    "synergyPairs": [
      [
        "gold_08_golem_ferro",
        "gold_10_egide_radiante"
      ],
      [
        "gold_37_escudeiro_solar",
        "red_156_fenix_coroa_solar"
      ],
      [
        "gold_173_general_roda_sol",
        "gold_43_sentinela_relogio"
      ],
      [
        "gold_43_sentinela_relogio",
        "red_156_fenix_coroa_solar"
      ],
      [
        "gold_173_general_roda_sol",
        "gold_76_monge_relogio"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "gold_08_golem_ferro",
        "cardBId": "gold_10_egide_radiante",
        "coPlayWinRate": 100,
        "liftOverBaseline": 42.2,
        "sampleCount": 17,
        "synergyNote": "Abertura de corredor tático: Égide do Planetário neutraliza bloqueadores para a infiltração letal de Golem de Ferro Inexpugnável (100.0% WR, +42.2% Lift)."
      },
      {
        "cardAId": "gold_37_escudeiro_solar",
        "cardBId": "red_156_fenix_coroa_solar",
        "coPlayWinRate": 91.5,
        "liftOverBaseline": 33.7,
        "sampleCount": 47,
        "synergyNote": "Abertura de corredor tático: Escudeiro da Alvorada neutraliza bloqueadores para a infiltração letal de Pyrokor, Monarca do Fogo Vivo (91.5% WR, +33.7% Lift)."
      },
      {
        "cardAId": "gold_173_general_roda_sol",
        "cardBId": "gold_43_sentinela_relogio",
        "coPlayWinRate": 95.2,
        "liftOverBaseline": 37.4,
        "sampleCount": 21,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Sentinela da Engrenagem Real + Heliokar, General da Roda Celeste na mesma janela de pressão (95.2% WR, +37.4% Lift)."
      },
      {
        "cardAId": "gold_43_sentinela_relogio",
        "cardBId": "red_156_fenix_coroa_solar",
        "coPlayWinRate": 90,
        "liftOverBaseline": 32.2,
        "sampleCount": 40,
        "synergyNote": "Abertura de corredor tático: Sentinela da Engrenagem Real neutraliza bloqueadores para a infiltração letal de Pyrokor, Monarca do Fogo Vivo (90.0% WR, +32.2% Lift)."
      },
      {
        "cardAId": "gold_173_general_roda_sol",
        "cardBId": "gold_76_monge_relogio",
        "coPlayWinRate": 92.3,
        "liftOverBaseline": 34.5,
        "sampleCount": 26,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Punho do Relógio de Mão + Heliokar, General da Roda Celeste na mesma janela de pressão (92.3% WR, +34.5% Lift)."
      }
    ]
  },
  "deck_tri_abyssal_chimera": {
    "deckId": "deck_tri_abyssal_chimera",
    "deckName": "Tomo da Quimera Abissal",
    "archetypeTag": "Pacto Triplo 💀+❄️+🌿 • Abismo, Tempestade & Selva",
    "generationsTrained": 43,
    "matchesSimulated": 9076,
    "baselineWinRate": 52.5,
    "trainedWinRate": 64.4,
    "weights": {
      "aggroFaceBias": 0.86,
      "tradeValueBias": 1.2,
      "guardianPriority": 1.26,
      "flyingEvasionBias": 1.2,
      "stackConsolidationBias": 0.94,
      "antiAoeSpreadBias": 1.15,
      "spellHoldPatience": 1.24,
      "relicPriority": 1.22,
      "ascensionEagerness": 1.24,
      "bloodPactThresholdHp": 20,
      "domainExpansionEagerness": 1.08,
      "sovPowerTempoBias": 1,
      "synergyHoldBonus": 22,
      "mulliganCurveTarget": 3.5
    },
    "mulliganKeepIds": [
      "blue_18_lobo_invernal",
      "blue_62_principe_ar",
      "purple_13_zumbi",
      "green_19_guardiao_ursino",
      "green_07_troll",
      "green_88_reencarnacao_ancestral"
    ],
    "channelPriorityIds": [
      "blue_50_diluvio_primordial",
      "purple_196_guilhotina_sol_negro",
      "green_08_ente",
      "green_144_bencao_arvore_mundo",
      "blue_16_sirenideo"
    ],
    "channelAvoidIds": [
      "blue_35_cetro_inverno",
      "neutral_11_botas_aladas",
      "green_163_despertar_colosso_floresta",
      "purple_102_exumar_legiao",
      "blue_172_armada_draconica_gelo",
      "blue_173_general_roda_gelo"
    ],
    "highImpactCardBoosts": {
      "blue_35_cetro_inverno": 18,
      "neutral_11_botas_aladas": 18,
      "green_163_despertar_colosso_floresta": 18,
      "purple_102_exumar_legiao": 18,
      "blue_172_armada_draconica_gelo": 18,
      "blue_173_general_roda_gelo": 18,
      "blue_28_orbe_tempestade": 18,
      "purple_173_general_roda_abismo": 18
    },
    "synergyPairs": [
      [
        "blue_18_lobo_invernal",
        "neutral_11_botas_aladas"
      ],
      [
        "neutral_11_botas_aladas",
        "purple_30_erguer_mortos"
      ],
      [
        "blue_172_armada_draconica_gelo",
        "purple_30_erguer_mortos"
      ],
      [
        "blue_172_armada_draconica_gelo",
        "blue_62_principe_ar"
      ],
      [
        "blue_173_general_roda_gelo",
        "purple_102_exumar_legiao"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "blue_18_lobo_invernal",
        "cardBId": "neutral_11_botas_aladas",
        "coPlayWinRate": 100,
        "liftOverBaseline": 38.7,
        "sampleCount": 17,
        "synergyNote": "Abertura de corredor tático: Botas Aladas do Mensageiro neutraliza bloqueadores para a infiltração letal de Lobo Alfa da Geada (100.0% WR, +38.7% Lift)."
      },
      {
        "cardAId": "neutral_11_botas_aladas",
        "cardBId": "purple_30_erguer_mortos",
        "coPlayWinRate": 92.3,
        "liftOverBaseline": 31,
        "sampleCount": 52,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Botas Aladas do Mensageiro + Erguer Legião da Cripta na mesma janela de pressão (92.3% WR, +31.0% Lift)."
      },
      {
        "cardAId": "blue_172_armada_draconica_gelo",
        "cardBId": "purple_30_erguer_mortos",
        "coPlayWinRate": 95.8,
        "liftOverBaseline": 34.5,
        "sampleCount": 24,
        "synergyNote": "Abertura de corredor tático: Erguer Legião da Cripta neutraliza bloqueadores para a infiltração letal de Esquadra Dracônica da Nevasca (95.8% WR, +34.5% Lift)."
      },
      {
        "cardAId": "blue_172_armada_draconica_gelo",
        "cardBId": "blue_62_principe_ar",
        "coPlayWinRate": 95.5,
        "liftOverBaseline": 34.1,
        "sampleCount": 22,
        "synergyNote": "Yan-Vael, Senhor do Furacão (4⚡) trava a Vanguarda enquanto Esquadra Dracônica da Nevasca (8⚡) opera protegido com +1 ATQ de Cobertura (95.5% WR, +34.1% Lift)."
      },
      {
        "cardAId": "blue_173_general_roda_gelo",
        "cardBId": "purple_102_exumar_legiao",
        "coPlayWinRate": 100,
        "liftOverBaseline": 38.7,
        "sampleCount": 13,
        "synergyNote": "Abertura de corredor tático: Despertar da Legião Eterna neutraliza bloqueadores para a infiltração letal de Cryonax, General da Roda Astral (100.0% WR, +38.7% Lift)."
      }
    ]
  },
  "deck_tri_crimson_sun": {
    "deckId": "deck_tri_crimson_sun",
    "deckName": "Escritura do Eclipse Carmesim",
    "archetypeTag": "midrange",
    "generationsTrained": 43,
    "matchesSimulated": 9614,
    "baselineWinRate": 54.4,
    "trainedWinRate": 65.6,
    "weights": {
      "aggroFaceBias": 1,
      "tradeValueBias": 1,
      "guardianPriority": 1,
      "flyingEvasionBias": 1,
      "stackConsolidationBias": 1,
      "antiAoeSpreadBias": 1,
      "spellHoldPatience": 1,
      "relicPriority": 1,
      "ascensionEagerness": 1,
      "bloodPactThresholdHp": 24,
      "domainExpansionEagerness": 1,
      "sovPowerTempoBias": 1,
      "synergyHoldBonus": 20,
      "mulliganCurveTarget": 3.2
    },
    "mulliganKeepIds": [
      "neutral_106_reen_assassino_relojoeiro",
      "gold_37_escudeiro_solar",
      "neutral_84_cao_guerra_encouracado",
      "gold_43_sentinela_relogio",
      "gold_01_espada_animada",
      "red_148_sapador_enxofre"
    ],
    "channelPriorityIds": [
      "purple_134_matriarca_noite_eterna",
      "red_153_elemental_fornalha_viva",
      "neutral_114_emissario_conselho_aguas",
      "gold_04_armadura_conjurada",
      "red_79_draco_meteoro"
    ],
    "channelAvoidIds": [
      "red_72_caldeirao_magma",
      "purple_100_dragao_necrotico",
      "neutral_106_reen_assassino_relojoeiro",
      "gold_32_estandarte_imperial",
      "gold_30_escudo_solar",
      "purple_28_filacterio_noite"
    ],
    "highImpactCardBoosts": {
      "red_72_caldeirao_magma": 18,
      "purple_100_dragao_necrotico": 18,
      "neutral_106_reen_assassino_relojoeiro": 18,
      "gold_32_estandarte_imperial": 18,
      "gold_30_escudo_solar": 18,
      "purple_28_filacterio_noite": 13,
      "red_12_mephit_magma": 13,
      "red_173_general_roda_chama": 12
    },
    "synergyPairs": [
      [
        "gold_76_monge_relogio",
        "red_72_caldeirao_magma"
      ],
      [
        "neutral_63_abjurador_errante",
        "red_72_caldeirao_magma"
      ],
      [
        "purple_100_dragao_necrotico",
        "red_79_draco_meteoro"
      ],
      [
        "neutral_106_reen_assassino_relojoeiro",
        "red_12_mephit_magma"
      ],
      [
        "gold_32_estandarte_imperial",
        "red_148_sapador_enxofre"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "gold_76_monge_relogio",
        "cardBId": "red_72_caldeirao_magma",
        "coPlayWinRate": 100,
        "liftOverBaseline": 31.3,
        "sampleCount": 24,
        "synergyNote": "Punho do Relógio de Mão (2⚡) trava a Vanguarda enquanto Fornalha Rúnica da Caldeira (3⚡) opera protegido com +1 ATQ de Cobertura (100.0% WR, +31.3% Lift)."
      },
      {
        "cardAId": "neutral_63_abjurador_errante",
        "cardBId": "red_72_caldeirao_magma",
        "coPlayWinRate": 96,
        "liftOverBaseline": 27.3,
        "sampleCount": 25,
        "synergyNote": "Sinergia empírica de alta conversão: curvar Abjurador do Selo Cinzento (2⚡) rumo a Fornalha Rúnica da Caldeira (3⚡) eleva o domínio de mesa (96.0% WR, +27.3% Lift)."
      },
      {
        "cardAId": "purple_100_dragao_necrotico",
        "cardBId": "red_79_draco_meteoro",
        "coPlayWinRate": 100,
        "liftOverBaseline": 31.3,
        "sampleCount": 13,
        "synergyNote": "Recursão da Cripta: recicla ameaças abatidas entre Draco de Impacto Meteórico e Morgath, O Dragão da Chama Necrótica, esgotando as remoções rivais (100.0% WR, +31.3% Lift)."
      },
      {
        "cardAId": "neutral_106_reen_assassino_relojoeiro",
        "cardBId": "red_12_mephit_magma",
        "coPlayWinRate": 90.3,
        "liftOverBaseline": 21.6,
        "sampleCount": 103,
        "synergyNote": "Abertura de corredor tático: Diabrete de Magma neutraliza bloqueadores para a infiltração letal de Reen, Ceifador de Engrenagens (90.3% WR, +21.6% Lift)."
      },
      {
        "cardAId": "gold_32_estandarte_imperial",
        "cardBId": "red_148_sapador_enxofre",
        "coPlayWinRate": 100,
        "liftOverBaseline": 31.3,
        "sampleCount": 12,
        "synergyNote": "Abertura de corredor tático: Mastim de Obsidiana e Enxofre neutraliza bloqueadores para a infiltração letal de Estandarte da Legião Dourada (100.0% WR, +31.3% Lift)."
      }
    ]
  },
  "deck_tri_eternal_horizon": {
    "deckId": "deck_tri_eternal_horizon",
    "deckName": "Códice do Horizonte Eterno",
    "archetypeTag": "midrange",
    "generationsTrained": 43,
    "matchesSimulated": 9734,
    "baselineWinRate": 51.3,
    "trainedWinRate": 53.1,
    "weights": {
      "aggroFaceBias": 1,
      "tradeValueBias": 1,
      "guardianPriority": 1,
      "flyingEvasionBias": 1,
      "stackConsolidationBias": 1,
      "antiAoeSpreadBias": 1,
      "spellHoldPatience": 1,
      "relicPriority": 1,
      "ascensionEagerness": 1,
      "bloodPactThresholdHp": 24,
      "domainExpansionEagerness": 1,
      "sovPowerTempoBias": 1,
      "synergyHoldBonus": 20,
      "mulliganCurveTarget": 3.2
    },
    "mulliganKeepIds": [
      "blue_62_principe_ar",
      "blue_55_familiar_coruja",
      "gold_37_escudeiro_solar",
      "gold_141_intervencao_angelical",
      "gold_43_sentinela_relogio",
      "blue_19_yeti"
    ],
    "channelPriorityIds": [
      "blue_134_arquimago_singularidade",
      "blue_132_esfinge_nebulosa",
      "green_119_behemoth_cratera_verde",
      "blue_50_diluvio_primordial",
      "green_84_brontossauro_colosso"
    ],
    "channelAvoidIds": [
      "neutral_11_botas_aladas",
      "neutral_154_elixir_pedra_ferro",
      "gold_87_relogio_bolso_real",
      "green_163_despertar_colosso_floresta",
      "blue_173_general_roda_gelo",
      "blue_172_armada_draconica_gelo"
    ],
    "highImpactCardBoosts": {
      "neutral_11_botas_aladas": 18,
      "neutral_154_elixir_pedra_ferro": 18,
      "gold_87_relogio_bolso_real": 18,
      "green_163_despertar_colosso_floresta": 18,
      "blue_173_general_roda_gelo": 18,
      "blue_172_armada_draconica_gelo": 18,
      "gold_142_calice_alvorada_real": 18,
      "green_88_reencarnacao_ancestral": 18
    },
    "synergyPairs": [
      [
        "gold_141_intervencao_angelical",
        "neutral_154_elixir_pedra_ferro"
      ],
      [
        "gold_10_egide_radiante",
        "neutral_154_elixir_pedra_ferro"
      ],
      [
        "green_150_xama_raizes_antigas",
        "neutral_11_botas_aladas"
      ],
      [
        "blue_67_clone_espelhado",
        "neutral_11_botas_aladas"
      ],
      [
        "gold_100_dragao_imperial_ouro",
        "gold_10_egide_radiante"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "gold_141_intervencao_angelical",
        "cardBId": "neutral_154_elixir_pedra_ferro",
        "coPlayWinRate": 97.2,
        "liftOverBaseline": 39,
        "sampleCount": 36,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Intervenção da Égide Angelical + Elixir de Pele de Adamantina na mesma janela de pressão (97.2% WR, +39.0% Lift)."
      },
      {
        "cardAId": "gold_10_egide_radiante",
        "cardBId": "neutral_154_elixir_pedra_ferro",
        "coPlayWinRate": 91.2,
        "liftOverBaseline": 33,
        "sampleCount": 57,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Égide do Planetário + Elixir de Pele de Adamantina na mesma janela de pressão (91.2% WR, +33.0% Lift)."
      },
      {
        "cardAId": "green_150_xama_raizes_antigas",
        "cardBId": "neutral_11_botas_aladas",
        "coPlayWinRate": 100,
        "liftOverBaseline": 41.7,
        "sampleCount": 13,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Pterossauro Imperial da Selva + Botas Aladas do Mensageiro na mesma janela de pressão (100.0% WR, +41.7% Lift)."
      },
      {
        "cardAId": "blue_67_clone_espelhado",
        "cardBId": "neutral_11_botas_aladas",
        "coPlayWinRate": 94.7,
        "liftOverBaseline": 36.5,
        "sampleCount": 19,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Botas Aladas do Mensageiro + Duplicata Ilusória na mesma janela de pressão (94.7% WR, +36.5% Lift)."
      },
      {
        "cardAId": "gold_100_dragao_imperial_ouro",
        "cardBId": "gold_10_egide_radiante",
        "coPlayWinRate": 92,
        "liftOverBaseline": 33.7,
        "sampleCount": 25,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Égide do Planetário + Aurion-Sol, O Dragão Imperial do Zênite na mesma janela de pressão (92.0% WR, +33.7% Lift)."
      }
    ]
  },
  "deck_squad_thousand_shields": {
    "deckId": "deck_squad_thousand_shields",
    "deckName": "Tratado da Falange dos Mil Escudos",
    "archetypeTag": "Doutrina de Esquadrão 🛡️ • Vanguarda & Cobertura",
    "generationsTrained": 44,
    "matchesSimulated": 17376,
    "baselineWinRate": 40.3,
    "trainedWinRate": 64.1,
    "weights": {
      "aggroFaceBias": 1.02,
      "tradeValueBias": 1.2,
      "guardianPriority": 1.26,
      "flyingEvasionBias": 1.02,
      "stackConsolidationBias": 1.38,
      "antiAoeSpreadBias": 0.84,
      "spellHoldPatience": 0.96,
      "relicPriority": 1.22,
      "ascensionEagerness": 1.24,
      "bloodPactThresholdHp": 26,
      "domainExpansionEagerness": 1.08,
      "sovPowerTempoBias": 1,
      "synergyHoldBonus": 22,
      "mulliganCurveTarget": 2.8
    },
    "mulliganKeepIds": [
      "neutral_63_abjurador_errante",
      "gold_43_sentinela_relogio",
      "green_07_troll",
      "gold_37_escudeiro_solar",
      "green_19_guardiao_ursino",
      "gold_16_unicornio"
    ],
    "channelPriorityIds": [
      "gold_04_armadura_conjurada",
      "gold_17_couatl",
      "green_84_brontossauro_colosso",
      "green_61_planta_carnivora",
      "gold_41_forjador_runico"
    ],
    "channelAvoidIds": [
      "green_146_altar_presas_ancestrais",
      "gold_142_calice_alvorada_real",
      "gold_87_relogio_bolso_real",
      "green_103_dragao_floresta_anciao",
      "neutral_63_abjurador_errante",
      "gold_172_armada_draconica_sol"
    ],
    "highImpactCardBoosts": {
      "green_146_altar_presas_ancestrais": 18,
      "gold_142_calice_alvorada_real": 18,
      "gold_87_relogio_bolso_real": 18,
      "green_103_dragao_floresta_anciao": 18,
      "neutral_63_abjurador_errante": 18,
      "gold_172_armada_draconica_sol": 18,
      "green_50_avatar_gaia": 15,
      "green_07_troll": 14
    },
    "synergyPairs": [
      [
        "green_07_troll",
        "green_146_altar_presas_ancestrais"
      ],
      [
        "gold_142_calice_alvorada_real",
        "gold_154_colosso_marmore_sagrado"
      ],
      [
        "gold_04_armadura_conjurada",
        "green_146_altar_presas_ancestrais"
      ],
      [
        "gold_87_relogio_bolso_real",
        "neutral_63_abjurador_errante"
      ],
      [
        "gold_142_calice_alvorada_real",
        "green_41_sapo_colossal"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "green_07_troll",
        "cardBId": "green_146_altar_presas_ancestrais",
        "coPlayWinRate": 86.3,
        "liftOverBaseline": 36.6,
        "sampleCount": 51,
        "synergyNote": "Altar das Presas Ancestrais (3⚡) trava a Vanguarda enquanto Troll Regenerador do Pântano (4⚡) opera protegido com +1 ATQ de Cobertura (86.3% WR, +36.6% Lift)."
      },
      {
        "cardAId": "gold_142_calice_alvorada_real",
        "cardBId": "gold_154_colosso_marmore_sagrado",
        "coPlayWinRate": 86.8,
        "liftOverBaseline": 37.2,
        "sampleCount": 38,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Cálice Real da Alvorada + Leão Sagrado de Juba Solar na mesma janela de pressão (86.8% WR, +37.2% Lift)."
      },
      {
        "cardAId": "gold_04_armadura_conjurada",
        "cardBId": "green_146_altar_presas_ancestrais",
        "coPlayWinRate": 85.2,
        "liftOverBaseline": 35.6,
        "sampleCount": 54,
        "synergyNote": "Sentinela de Elmo Arcano (3⚡) trava a Vanguarda enquanto Altar das Presas Ancestrais (3⚡) opera protegido com +1 ATQ de Cobertura (85.2% WR, +35.6% Lift)."
      },
      {
        "cardAId": "gold_87_relogio_bolso_real",
        "cardBId": "neutral_63_abjurador_errante",
        "coPlayWinRate": 85.7,
        "liftOverBaseline": 36.1,
        "sampleCount": 28,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Cronômetro Dourado de Bolso + Abjurador do Selo Cinzento na mesma janela de pressão (85.7% WR, +36.1% Lift)."
      },
      {
        "cardAId": "gold_142_calice_alvorada_real",
        "cardBId": "green_41_sapo_colossal",
        "coPlayWinRate": 83.9,
        "liftOverBaseline": 34.2,
        "sampleCount": 31,
        "synergyNote": "Cálice Real da Alvorada (2⚡) trava a Vanguarda enquanto Batrácio Engolidor do Pântano (3⚡) opera protegido com +1 ATQ de Cobertura (83.9% WR, +34.2% Lift)."
      }
    ]
  },
  "deck_squad_siege_battery": {
    "deckId": "deck_squad_siege_battery",
    "deckName": "Tratado da Bateria de Cerco Arcana",
    "archetypeTag": "tempo",
    "generationsTrained": 44,
    "matchesSimulated": 9954,
    "baselineWinRate": 30.3,
    "trainedWinRate": 60.3,
    "weights": {
      "aggroFaceBias": 0.89,
      "tradeValueBias": 1,
      "guardianPriority": 1.3,
      "flyingEvasionBias": 0.76,
      "stackConsolidationBias": 1.13,
      "antiAoeSpreadBias": 0.97,
      "spellHoldPatience": 1.06,
      "relicPriority": 1.01,
      "ascensionEagerness": 1.17,
      "bloodPactThresholdHp": 21,
      "domainExpansionEagerness": 0.92,
      "sovPowerTempoBias": 1,
      "synergyHoldBonus": 21,
      "mulliganCurveTarget": 2.86
    },
    "mulliganKeepIds": [
      "neutral_84_cao_guerra_encouracado",
      "blue_37_mago_aprendiz",
      "blue_62_principe_ar",
      "blue_55_familiar_coruja",
      "red_114_draco_escoria",
      "red_12_mephit_magma"
    ],
    "channelPriorityIds": [
      "blue_29_raio_cadeia",
      "blue_50_diluvio_primordial",
      "blue_43_arconte_tempestade",
      "red_104_tempestade_cinzas",
      "blue_121_tempestade_mental"
    ],
    "channelAvoidIds": [
      "blue_72_incensario_ventos",
      "red_173_general_roda_chama",
      "blue_08_chamado_trovao",
      "blue_62_principe_ar",
      "red_72_caldeirao_magma",
      "blue_68_parar_tempo"
    ],
    "highImpactCardBoosts": {
      "blue_72_incensario_ventos": 18,
      "red_173_general_roda_chama": 17,
      "blue_08_chamado_trovao": 15,
      "blue_62_principe_ar": 14,
      "red_72_caldeirao_magma": 14,
      "blue_68_parar_tempo": 14,
      "neutral_52_mercenario_planar": 14,
      "blue_40_naga_guardia": 14
    },
    "synergyPairs": [
      [
        "blue_51_dissipar_magia",
        "blue_72_incensario_ventos"
      ],
      [
        "blue_72_incensario_ventos",
        "neutral_80_dragonete_emboscada"
      ],
      [
        "blue_68_parar_tempo",
        "neutral_80_dragonete_emboscada"
      ],
      [
        "blue_43_arconte_tempestade",
        "blue_68_parar_tempo"
      ],
      [
        "neutral_52_mercenario_planar",
        "red_33_supernova_vulcanica"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "blue_51_dissipar_magia",
        "cardBId": "blue_72_incensario_ventos",
        "coPlayWinRate": 86.7,
        "liftOverBaseline": 43.6,
        "sampleCount": 15,
        "synergyNote": "Motor de aceleração: Contramágica Rúnica antecipa recursos e fôlego para sustentar o impacto de Turíbulo dos Quatro Ventos (86.7% WR, +43.6% Lift)."
      },
      {
        "cardAId": "blue_72_incensario_ventos",
        "cardBId": "neutral_80_dragonete_emboscada",
        "coPlayWinRate": 100,
        "liftOverBaseline": 56.9,
        "sampleCount": 6,
        "synergyNote": "Abertura de corredor tático: Dragonete Corredor de Emboscada neutraliza bloqueadores para a infiltração letal de Turíbulo dos Quatro Ventos (100.0% WR, +56.9% Lift)."
      },
      {
        "cardAId": "blue_68_parar_tempo",
        "cardBId": "neutral_80_dragonete_emboscada",
        "coPlayWinRate": 73.3,
        "liftOverBaseline": 30.3,
        "sampleCount": 30,
        "synergyNote": "Abertura de corredor tático: Dragonete Corredor de Emboscada neutraliza bloqueadores para a infiltração letal de Estase Temporal Absoluta (73.3% WR, +30.3% Lift)."
      },
      {
        "cardAId": "blue_43_arconte_tempestade",
        "cardBId": "blue_68_parar_tempo",
        "coPlayWinRate": 87.5,
        "liftOverBaseline": 44.4,
        "sampleCount": 8,
        "synergyNote": "Abertura de corredor tático: Arconte do Relâmpago Vivo neutraliza bloqueadores para a infiltração letal de Estase Temporal Absoluta (87.5% WR, +44.4% Lift)."
      },
      {
        "cardAId": "neutral_52_mercenario_planar",
        "cardBId": "red_33_supernova_vulcanica",
        "coPlayWinRate": 67.9,
        "liftOverBaseline": 24.8,
        "sampleCount": 56,
        "synergyNote": "Abertura de corredor tático: Mercenário das Lâminas Planais neutraliza bloqueadores para a infiltração letal de Supernova da Caldeira (67.9% WR, +24.8% Lift)."
      }
    ]
  },
  "deck_penta_valkyra_pact": {
    "deckId": "deck_penta_valkyra_pact",
    "deckName": "Grimório Supremo de Valkyra",
    "archetypeTag": "Convergência Pentacromática 👑 • Todos os Domínios",
    "generationsTrained": 43,
    "matchesSimulated": 16742,
    "baselineWinRate": 54.4,
    "trainedWinRate": 55.6,
    "weights": {
      "aggroFaceBias": 1.28,
      "tradeValueBias": 1.2,
      "guardianPriority": 1.26,
      "flyingEvasionBias": 1.2,
      "stackConsolidationBias": 1.38,
      "antiAoeSpreadBias": 1.15,
      "spellHoldPatience": 1.24,
      "relicPriority": 1.22,
      "ascensionEagerness": 1.24,
      "bloodPactThresholdHp": 20,
      "domainExpansionEagerness": 1.08,
      "sovPowerTempoBias": 1,
      "synergyHoldBonus": 22,
      "mulliganCurveTarget": 2.8
    },
    "mulliganKeepIds": [
      "neutral_106_reen_assassino_relojoeiro",
      "gold_37_escudeiro_solar",
      "green_07_troll",
      "green_19_guardiao_ursino",
      "red_12_mephit_magma",
      "blue_13_lanceiro_mares"
    ],
    "channelPriorityIds": [
      "blue_59_mago_ilusao",
      "blue_134_arquimago_singularidade",
      "gold_154_colosso_marmore_sagrado",
      "red_76_salamandra_vapor",
      "neutral_115_golem_ferro_fornalha_neutra"
    ],
    "channelAvoidIds": [
      "purple_35_calice_vampirico",
      "red_173_general_roda_chama",
      "neutral_10_valkyra_pentacromatica",
      "gold_173_general_roda_sol",
      "neutral_106_reen_assassino_relojoeiro",
      "neutral_155_chamado_armas_fronteira"
    ],
    "highImpactCardBoosts": {
      "purple_35_calice_vampirico": 18,
      "red_173_general_roda_chama": 18,
      "neutral_10_valkyra_pentacromatica": 18,
      "gold_173_general_roda_sol": 18,
      "neutral_106_reen_assassino_relojoeiro": 18,
      "neutral_155_chamado_armas_fronteira": 18,
      "gold_87_relogio_bolso_real": 18,
      "gold_32_estandarte_imperial": 18
    },
    "synergyPairs": [
      [
        "neutral_106_reen_assassino_relojoeiro",
        "red_12_mephit_magma"
      ],
      [
        "neutral_93_ladrao_mestre_mascara",
        "purple_30_erguer_mortos"
      ],
      [
        "green_173_general_roda_selva",
        "neutral_56_barreira_prismatica"
      ],
      [
        "blue_62_principe_ar",
        "neutral_155_chamado_armas_fronteira"
      ],
      [
        "neutral_155_chamado_armas_fronteira",
        "neutral_56_barreira_prismatica"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "neutral_106_reen_assassino_relojoeiro",
        "cardBId": "red_12_mephit_magma",
        "coPlayWinRate": 90.5,
        "liftOverBaseline": 36.7,
        "sampleCount": 63,
        "synergyNote": "Abertura de corredor tático: Diabrete de Magma neutraliza bloqueadores para a infiltração letal de Reen, Ceifador de Engrenagens (90.5% WR, +36.7% Lift)."
      },
      {
        "cardAId": "neutral_93_ladrao_mestre_mascara",
        "cardBId": "purple_30_erguer_mortos",
        "coPlayWinRate": 88,
        "liftOverBaseline": 34.2,
        "sampleCount": 75,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Mestre-Ladrão da Guilda Cinza + Erguer Legião da Cripta na mesma janela de pressão (88.0% WR, +34.2% Lift)."
      },
      {
        "cardAId": "green_173_general_roda_selva",
        "cardBId": "neutral_56_barreira_prismatica",
        "coPlayWinRate": 100,
        "liftOverBaseline": 46.2,
        "sampleCount": 13,
        "synergyNote": "Abertura de corredor tático: Muralha do Prisma Pentacromático neutraliza bloqueadores para a infiltração letal de Sylvarok, General da Roda Primeva (100.0% WR, +46.2% Lift)."
      },
      {
        "cardAId": "blue_62_principe_ar",
        "cardBId": "neutral_155_chamado_armas_fronteira",
        "coPlayWinRate": 91.7,
        "liftOverBaseline": 37.9,
        "sampleCount": 24,
        "synergyNote": "Abertura de corredor tático: Yan-Vael, Senhor do Furacão neutraliza bloqueadores para a infiltração letal de Mobilização da Torre dos Cinco Selos (91.7% WR, +37.9% Lift)."
      },
      {
        "cardAId": "neutral_155_chamado_armas_fronteira",
        "cardBId": "neutral_56_barreira_prismatica",
        "coPlayWinRate": 91.7,
        "liftOverBaseline": 37.9,
        "sampleCount": 24,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Muralha do Prisma Pentacromático + Mobilização da Torre dos Cinco Selos na mesma janela de pressão (91.7% WR, +37.9% Lift)."
      }
    ]
  },
  "deck_neutral_axial": {
    "deckId": "deck_neutral_axial",
    "deckName": "Códice da Legião Axial",
    "archetypeTag": "midrange",
    "generationsTrained": 46,
    "matchesSimulated": 9958,
    "baselineWinRate": 37.8,
    "trainedWinRate": 47.8,
    "weights": {
      "aggroFaceBias": 0.9,
      "tradeValueBias": 1.03,
      "guardianPriority": 1.06,
      "flyingEvasionBias": 0.79,
      "stackConsolidationBias": 1,
      "antiAoeSpreadBias": 1.17,
      "spellHoldPatience": 1.04,
      "relicPriority": 0.81,
      "ascensionEagerness": 1,
      "bloodPactThresholdHp": 24,
      "domainExpansionEagerness": 1,
      "sovPowerTempoBias": 0.92,
      "synergyHoldBonus": 17,
      "mulliganCurveTarget": 3.2
    },
    "mulliganKeepIds": [
      "neutral_106_reen_assassino_relojoeiro",
      "neutral_168_tecelao_feixe_matriz",
      "neutral_84_cao_guerra_encouracado",
      "neutral_81_operario_relojoeiro",
      "neutral_93_ladrao_mestre_mascara",
      "neutral_94_arqueiro_zenite"
    ],
    "channelPriorityIds": [
      "neutral_91_campeao_arena_livre",
      "neutral_152_portal_dimensional_cinza",
      "neutral_169_pressagio_revoada_matriz",
      "neutral_34_cavaleiro_planar",
      "neutral_114_emissario_conselho_aguas"
    ],
    "channelAvoidIds": [
      "neutral_13_grimorio_astral",
      "neutral_10_valkyra_pentacromatica",
      "neutral_15_ampulheta_tempo",
      "neutral_11_botas_aladas",
      "neutral_106_reen_assassino_relojoeiro",
      "neutral_155_chamado_armas_fronteira"
    ],
    "highImpactCardBoosts": {
      "neutral_13_grimorio_astral": 18,
      "neutral_10_valkyra_pentacromatica": 18,
      "neutral_15_ampulheta_tempo": 18,
      "neutral_11_botas_aladas": 18,
      "neutral_106_reen_assassino_relojoeiro": 18,
      "neutral_155_chamado_armas_fronteira": 18,
      "neutral_154_elixir_pedra_ferro": 18,
      "neutral_93_ladrao_mestre_mascara": 18
    },
    "synergyPairs": [
      [
        "neutral_106_reen_assassino_relojoeiro",
        "neutral_13_grimorio_astral"
      ],
      [
        "neutral_11_botas_aladas",
        "neutral_13_grimorio_astral"
      ],
      [
        "neutral_10_valkyra_pentacromatica",
        "neutral_154_elixir_pedra_ferro"
      ],
      [
        "neutral_10_valkyra_pentacromatica",
        "neutral_168_tecelao_feixe_matriz"
      ],
      [
        "neutral_11_botas_aladas",
        "neutral_155_chamado_armas_fronteira"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "neutral_106_reen_assassino_relojoeiro",
        "cardBId": "neutral_13_grimorio_astral",
        "coPlayWinRate": 91.9,
        "liftOverBaseline": 58.8,
        "sampleCount": 37,
        "synergyNote": "Abertura de corredor tático: Tomo das Estrelas Viajantes neutraliza bloqueadores para a infiltração letal de Reen, Ceifador de Engrenagens (91.9% WR, +58.8% Lift)."
      },
      {
        "cardAId": "neutral_11_botas_aladas",
        "cardBId": "neutral_13_grimorio_astral",
        "coPlayWinRate": 94.7,
        "liftOverBaseline": 61.7,
        "sampleCount": 19,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Botas Aladas do Mensageiro + Tomo das Estrelas Viajantes na mesma janela de pressão (94.7% WR, +61.7% Lift)."
      },
      {
        "cardAId": "neutral_10_valkyra_pentacromatica",
        "cardBId": "neutral_154_elixir_pedra_ferro",
        "coPlayWinRate": 90,
        "liftOverBaseline": 56.9,
        "sampleCount": 20,
        "synergyNote": "Abertura de corredor tático: Elixir de Pele de Adamantina neutraliza bloqueadores para a infiltração letal de Valkyra, Imperatriz Pentacromática (90.0% WR, +56.9% Lift)."
      },
      {
        "cardAId": "neutral_10_valkyra_pentacromatica",
        "cardBId": "neutral_168_tecelao_feixe_matriz",
        "coPlayWinRate": 93.3,
        "liftOverBaseline": 60.2,
        "sampleCount": 15,
        "synergyNote": "Tecelão do Feixe Primordial (3⚡) trava a Vanguarda enquanto Valkyra, Imperatriz Pentacromática (8⚡) opera protegido com +1 ATQ de Cobertura (93.3% WR, +60.2% Lift)."
      },
      {
        "cardAId": "neutral_11_botas_aladas",
        "cardBId": "neutral_155_chamado_armas_fronteira",
        "coPlayWinRate": 77.3,
        "liftOverBaseline": 44.2,
        "sampleCount": 44,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Botas Aladas do Mensageiro + Mobilização da Torre dos Cinco Selos na mesma janela de pressão (77.3% WR, +44.2% Lift)."
      }
    ]
  },
  "deck_dual_red_neutral": {
    "deckId": "deck_dual_red_neutral",
    "deckName": "Tratado da Forja Bélica Axial",
    "archetypeTag": "aggro",
    "generationsTrained": 44,
    "matchesSimulated": 10072,
    "baselineWinRate": 49.4,
    "trainedWinRate": 78.8,
    "weights": {
      "aggroFaceBias": 1.36,
      "tradeValueBias": 0.91,
      "guardianPriority": 1.07,
      "flyingEvasionBias": 1.38,
      "stackConsolidationBias": 1.11,
      "antiAoeSpreadBias": 0.95,
      "spellHoldPatience": 1.13,
      "relicPriority": 0.97,
      "ascensionEagerness": 0.69,
      "bloodPactThresholdHp": 22,
      "domainExpansionEagerness": 1.01,
      "sovPowerTempoBias": 1.37,
      "synergyHoldBonus": 18,
      "mulliganCurveTarget": 2.49
    },
    "mulliganKeepIds": [
      "neutral_106_reen_assassino_relojoeiro",
      "neutral_81_operario_relojoeiro",
      "red_42_cavaleiro_draconico",
      "red_148_sapador_enxofre",
      "red_12_mephit_magma",
      "neutral_84_cao_guerra_encouracado"
    ],
    "channelPriorityIds": [
      "neutral_109_aranha_pedra_steeder",
      "neutral_105_cacador_sangue_mutageno",
      "red_36_bigorna_fogo",
      "red_170_flagelo_cornudo_chama",
      "neutral_114_emissario_conselho_aguas"
    ],
    "channelAvoidIds": [
      "neutral_106_reen_assassino_relojoeiro",
      "neutral_10_valkyra_pentacromatica",
      "red_72_caldeirao_magma",
      "red_42_cavaleiro_draconico",
      "neutral_81_operario_relojoeiro",
      "neutral_30_coroa_pactos"
    ],
    "highImpactCardBoosts": {
      "neutral_106_reen_assassino_relojoeiro": 18,
      "neutral_10_valkyra_pentacromatica": 15,
      "red_72_caldeirao_magma": 11,
      "red_42_cavaleiro_draconico": 11,
      "neutral_81_operario_relojoeiro": 10,
      "neutral_30_coroa_pactos": 9,
      "red_114_draco_escoria": 9,
      "red_12_mephit_magma": 8
    },
    "synergyPairs": [
      [
        "neutral_106_reen_assassino_relojoeiro",
        "red_111_predador_piroclastico"
      ],
      [
        "neutral_106_reen_assassino_relojoeiro",
        "red_38_serpente_fogo"
      ],
      [
        "neutral_10_valkyra_pentacromatica",
        "red_04_meio_dragao"
      ],
      [
        "neutral_13_grimorio_astral",
        "neutral_30_coroa_pactos"
      ],
      [
        "neutral_114_emissario_conselho_aguas",
        "red_109_diabrete_fornalha"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "neutral_106_reen_assassino_relojoeiro",
        "cardBId": "red_111_predador_piroclastico",
        "coPlayWinRate": 97,
        "liftOverBaseline": 20.3,
        "sampleCount": 33,
        "synergyNote": "Abertura de corredor tático: Pantera Piroclástica neutraliza bloqueadores para a infiltração letal de Reen, Ceifador de Engrenagens (97.0% WR, +20.3% Lift)."
      },
      {
        "cardAId": "neutral_106_reen_assassino_relojoeiro",
        "cardBId": "red_38_serpente_fogo",
        "coPlayWinRate": 95.7,
        "liftOverBaseline": 18.9,
        "sampleCount": 69,
        "synergyNote": "Abertura de corredor tático: Víbora de Brasa Jovem neutraliza bloqueadores para a infiltração letal de Reen, Ceifador de Engrenagens (95.7% WR, +18.9% Lift)."
      },
      {
        "cardAId": "neutral_10_valkyra_pentacromatica",
        "cardBId": "red_04_meio_dragao",
        "coPlayWinRate": 100,
        "liftOverBaseline": 23.3,
        "sampleCount": 14,
        "synergyNote": "Abertura de corredor tático: Campeão Dracônico neutraliza bloqueadores para a infiltração letal de Valkyra, Imperatriz Pentacromática (100.0% WR, +23.3% Lift)."
      },
      {
        "cardAId": "neutral_13_grimorio_astral",
        "cardBId": "neutral_30_coroa_pactos",
        "coPlayWinRate": 100,
        "liftOverBaseline": 23.3,
        "sampleCount": 13,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Tomo das Estrelas Viajantes + Diadema Supremo Pentacromático na mesma janela de pressão (100.0% WR, +23.3% Lift)."
      },
      {
        "cardAId": "neutral_114_emissario_conselho_aguas",
        "cardBId": "red_109_diabrete_fornalha",
        "coPlayWinRate": 95.2,
        "liftOverBaseline": 18.5,
        "sampleCount": 21,
        "synergyNote": "Motor de aceleração: Diabrete da Fornalha antecipa recursos e fôlego para sustentar o impacto de Emissário Real do Conselho (95.2% WR, +18.5% Lift)."
      }
    ]
  },
  "deck_dual_blue_neutral": {
    "deckId": "deck_dual_blue_neutral",
    "deckName": "Códice do Astrolábio Mecânico",
    "archetypeTag": "tempo",
    "generationsTrained": 44,
    "matchesSimulated": 10358,
    "baselineWinRate": 46.3,
    "trainedWinRate": 65.6,
    "weights": {
      "aggroFaceBias": 1,
      "tradeValueBias": 1,
      "guardianPriority": 1,
      "flyingEvasionBias": 1,
      "stackConsolidationBias": 1,
      "antiAoeSpreadBias": 1,
      "spellHoldPatience": 1,
      "relicPriority": 1,
      "ascensionEagerness": 1,
      "bloodPactThresholdHp": 24,
      "domainExpansionEagerness": 1,
      "sovPowerTempoBias": 1,
      "synergyHoldBonus": 20,
      "mulliganCurveTarget": 3.2
    },
    "mulliganKeepIds": [
      "neutral_106_reen_assassino_relojoeiro",
      "neutral_168_tecelao_feixe_matriz",
      "blue_55_familiar_coruja",
      "neutral_80_dragonete_emboscada",
      "neutral_114_emissario_conselho_aguas",
      "neutral_63_abjurador_errante"
    ],
    "channelPriorityIds": [
      "blue_59_mago_ilusao",
      "neutral_115_golem_ferro_fornalha_neutra",
      "blue_05_gigante_nuvens",
      "blue_151_draco_tempestade_astral",
      "blue_149_cronomante_ampulheta"
    ],
    "channelAvoidIds": [
      "blue_172_armada_draconica_gelo",
      "neutral_11_botas_aladas",
      "neutral_173_general_roda_matriz",
      "blue_36_tomo_infinito",
      "blue_72_incensario_ventos",
      "neutral_106_reen_assassino_relojoeiro"
    ],
    "highImpactCardBoosts": {
      "blue_172_armada_draconica_gelo": 18,
      "neutral_11_botas_aladas": 18,
      "neutral_173_general_roda_matriz": 18,
      "blue_36_tomo_infinito": 18,
      "blue_72_incensario_ventos": 18,
      "neutral_106_reen_assassino_relojoeiro": 18,
      "blue_154_dragao_safira_soberano": 18,
      "neutral_10_valkyra_pentacromatica": 18
    },
    "synergyPairs": [
      [
        "blue_172_armada_draconica_gelo",
        "blue_55_familiar_coruja"
      ],
      [
        "blue_55_familiar_coruja",
        "blue_72_incensario_ventos"
      ],
      [
        "neutral_10_valkyra_pentacromatica",
        "neutral_93_ladrao_mestre_mascara"
      ],
      [
        "neutral_173_general_roda_matriz",
        "neutral_19_pergaminho_protecao"
      ],
      [
        "blue_23_dragao_bronze",
        "neutral_11_botas_aladas"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "blue_172_armada_draconica_gelo",
        "cardBId": "blue_55_familiar_coruja",
        "coPlayWinRate": 100,
        "liftOverBaseline": 44.1,
        "sampleCount": 12,
        "synergyNote": "Abertura de corredor tático: Coruja Astral de Vigília neutraliza bloqueadores para a infiltração letal de Esquadra Dracônica da Nevasca (100.0% WR, +44.1% Lift)."
      },
      {
        "cardAId": "blue_55_familiar_coruja",
        "cardBId": "blue_72_incensario_ventos",
        "coPlayWinRate": 94.4,
        "liftOverBaseline": 38.5,
        "sampleCount": 18,
        "synergyNote": "Abertura de corredor tático: Coruja Astral de Vigília neutraliza bloqueadores para a infiltração letal de Turíbulo dos Quatro Ventos (94.4% WR, +38.5% Lift)."
      },
      {
        "cardAId": "neutral_10_valkyra_pentacromatica",
        "cardBId": "neutral_93_ladrao_mestre_mascara",
        "coPlayWinRate": 100,
        "liftOverBaseline": 44.1,
        "sampleCount": 11,
        "synergyNote": "Abertura de corredor tático: Mestre-Ladrão da Guilda Cinza neutraliza bloqueadores para a infiltração letal de Valkyra, Imperatriz Pentacromática (100.0% WR, +44.1% Lift)."
      },
      {
        "cardAId": "neutral_173_general_roda_matriz",
        "cardBId": "neutral_19_pergaminho_protecao",
        "coPlayWinRate": 91.3,
        "liftOverBaseline": 35.4,
        "sampleCount": 23,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Pergaminho da Égide Universal + Vaelkor, General da Roda Prismática na mesma janela de pressão (91.3% WR, +35.4% Lift)."
      },
      {
        "cardAId": "blue_23_dragao_bronze",
        "cardBId": "neutral_11_botas_aladas",
        "coPlayWinRate": 89.3,
        "liftOverBaseline": 33.3,
        "sampleCount": 28,
        "synergyNote": "Botas Aladas do Mensageiro (2⚡) trava a Vanguarda enquanto Auronautilus, Dragão de Bronze (6⚡) opera protegido com +1 ATQ de Cobertura (89.3% WR, +33.3% Lift)."
      }
    ]
  },
  "deck_dual_purple_neutral": {
    "deckId": "deck_dual_purple_neutral",
    "deckName": "Relicário das Almas Cinzentas",
    "archetypeTag": "Aliança Cromático-Axial 💀+⚙️ • Eclipse & Matriz",
    "generationsTrained": 44,
    "matchesSimulated": 10132,
    "baselineWinRate": 46.3,
    "trainedWinRate": 63.1,
    "weights": {
      "aggroFaceBias": 1.02,
      "tradeValueBias": 1.02,
      "guardianPriority": 1,
      "flyingEvasionBias": 1.02,
      "stackConsolidationBias": 0.94,
      "antiAoeSpreadBias": 1.15,
      "spellHoldPatience": 1.24,
      "relicPriority": 1.22,
      "ascensionEagerness": 1.05,
      "bloodPactThresholdHp": 20,
      "domainExpansionEagerness": 1.08,
      "sovPowerTempoBias": 1,
      "synergyHoldBonus": 22,
      "mulliganCurveTarget": 3.2
    },
    "mulliganKeepIds": [
      "purple_133_ceifador_tumular",
      "purple_37_acolito_oculto",
      "neutral_93_ladrao_mestre_mascara",
      "neutral_47_dados_destino",
      "purple_132_quimera_costurada",
      "neutral_80_dragonete_emboscada"
    ],
    "channelPriorityIds": [
      "neutral_115_golem_ferro_fornalha_neutra",
      "neutral_166_protocolo_torre_axial",
      "purple_155_lorde_vampiro_soberano",
      "purple_51_eclipse_eterno",
      "purple_98_cavaleiro_apocalipse"
    ],
    "channelAvoidIds": [
      "neutral_10_valkyra_pentacromatica",
      "purple_172_armada_draconica_abismo",
      "neutral_11_botas_aladas",
      "neutral_133_escudo_sentinela_olho",
      "purple_173_general_roda_abismo",
      "purple_28_filacterio_noite"
    ],
    "highImpactCardBoosts": {
      "neutral_10_valkyra_pentacromatica": 18,
      "purple_172_armada_draconica_abismo": 18,
      "neutral_11_botas_aladas": 18,
      "neutral_133_escudo_sentinela_olho": 18,
      "purple_173_general_roda_abismo": 18,
      "purple_28_filacterio_noite": 18,
      "purple_83_arquidemonio_tempo": 18,
      "purple_65_principe_mortos": 18
    },
    "synergyPairs": [
      [
        "neutral_10_valkyra_pentacromatica",
        "purple_68_exumar_legiao"
      ],
      [
        "neutral_11_botas_aladas",
        "purple_30_erguer_mortos"
      ],
      [
        "purple_100_dragao_necrotico",
        "purple_102_exumar_legiao"
      ],
      [
        "neutral_11_botas_aladas",
        "purple_05_cavaleiro_morte"
      ],
      [
        "neutral_10_valkyra_pentacromatica",
        "neutral_25_convergencia_harmonica"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "neutral_10_valkyra_pentacromatica",
        "cardBId": "purple_68_exumar_legiao",
        "coPlayWinRate": 100,
        "liftOverBaseline": 49.3,
        "sampleCount": 13,
        "synergyNote": "Abertura de corredor tático: Exumar a Legião Caída neutraliza bloqueadores para a infiltração letal de Valkyra, Imperatriz Pentacromática (100.0% WR, +49.3% Lift)."
      },
      {
        "cardAId": "neutral_11_botas_aladas",
        "cardBId": "purple_30_erguer_mortos",
        "coPlayWinRate": 87.8,
        "liftOverBaseline": 37.1,
        "sampleCount": 41,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Botas Aladas do Mensageiro + Erguer Legião da Cripta na mesma janela de pressão (87.8% WR, +37.1% Lift)."
      },
      {
        "cardAId": "purple_100_dragao_necrotico",
        "cardBId": "purple_102_exumar_legiao",
        "coPlayWinRate": 94.4,
        "liftOverBaseline": 43.7,
        "sampleCount": 18,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Despertar da Legião Eterna + Morgath, O Dragão da Chama Necrótica na mesma janela de pressão (94.4% WR, +43.7% Lift)."
      },
      {
        "cardAId": "neutral_11_botas_aladas",
        "cardBId": "purple_05_cavaleiro_morte",
        "coPlayWinRate": 87.9,
        "liftOverBaseline": 37.1,
        "sampleCount": 33,
        "synergyNote": "Botas Aladas do Mensageiro (2⚡) trava a Vanguarda enquanto Paladino do Juramento Quebrado (4⚡) opera protegido com +1 ATQ de Cobertura (87.9% WR, +37.1% Lift)."
      },
      {
        "cardAId": "neutral_10_valkyra_pentacromatica",
        "cardBId": "neutral_25_convergencia_harmonica",
        "coPlayWinRate": 88.9,
        "liftOverBaseline": 38.1,
        "sampleCount": 27,
        "synergyNote": "Abertura de corredor tático: Convergência dos Cinco Pactos neutraliza bloqueadores para a infiltração letal de Valkyra, Imperatriz Pentacromática (88.9% WR, +38.1% Lift)."
      }
    ]
  },
  "deck_dual_green_neutral": {
    "deckId": "deck_dual_green_neutral",
    "deckName": "Códice dos Colossos Simbióticos",
    "archetypeTag": "midrange",
    "generationsTrained": 44,
    "matchesSimulated": 10418,
    "baselineWinRate": 54.7,
    "trainedWinRate": 62.8,
    "weights": {
      "aggroFaceBias": 1.15,
      "tradeValueBias": 0.93,
      "guardianPriority": 1.26,
      "flyingEvasionBias": 0.88,
      "stackConsolidationBias": 1,
      "antiAoeSpreadBias": 1,
      "spellHoldPatience": 0.88,
      "relicPriority": 1.2,
      "ascensionEagerness": 1.01,
      "bloodPactThresholdHp": 24,
      "domainExpansionEagerness": 1.25,
      "sovPowerTempoBias": 1.1,
      "synergyHoldBonus": 12,
      "mulliganCurveTarget": 2.9
    },
    "mulliganKeepIds": [
      "neutral_106_reen_assassino_relojoeiro",
      "neutral_84_cao_guerra_encouracado",
      "green_19_guardiao_ursino",
      "neutral_81_operario_relojoeiro",
      "green_53_carapaca_espinhosa",
      "neutral_31_automato_explorado"
    ],
    "channelPriorityIds": [
      "green_32_gorila_alfa",
      "green_119_behemoth_cratera_verde",
      "neutral_171_pactuario_elemental_matriz",
      "green_66_gorila_rei",
      "green_139_dragao_floresta_antiga"
    ],
    "channelAvoidIds": [
      "neutral_10_valkyra_pentacromatica",
      "neutral_173_general_roda_matriz",
      "green_161_dragao_esmeralda_primordial",
      "green_173_general_roda_selva",
      "green_33_behemoth_primordial",
      "neutral_106_reen_assassino_relojoeiro"
    ],
    "highImpactCardBoosts": {
      "neutral_10_valkyra_pentacromatica": 18,
      "neutral_173_general_roda_matriz": 18,
      "green_161_dragao_esmeralda_primordial": 18,
      "green_173_general_roda_selva": 18,
      "green_33_behemoth_primordial": 18,
      "neutral_106_reen_assassino_relojoeiro": 18,
      "neutral_154_elixir_pedra_ferro": 18,
      "green_146_altar_presas_ancestrais": 18
    },
    "synergyPairs": [
      [
        "green_173_general_roda_selva",
        "neutral_106_reen_assassino_relojoeiro"
      ],
      [
        "green_50_avatar_gaia",
        "neutral_106_reen_assassino_relojoeiro"
      ],
      [
        "green_173_general_roda_selva",
        "neutral_25_convergencia_harmonica"
      ],
      [
        "green_09_hidra",
        "neutral_155_chamado_armas_fronteira"
      ],
      [
        "green_50_avatar_gaia",
        "green_53_carapaca_espinhosa"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "green_173_general_roda_selva",
        "cardBId": "neutral_106_reen_assassino_relojoeiro",
        "coPlayWinRate": 100,
        "liftOverBaseline": 37.9,
        "sampleCount": 15,
        "synergyNote": "Abertura de corredor tático: Reen, Ceifador de Engrenagens neutraliza bloqueadores para a infiltração letal de Sylvarok, General da Roda Primeva (100.0% WR, +37.9% Lift)."
      },
      {
        "cardAId": "green_50_avatar_gaia",
        "cardBId": "neutral_106_reen_assassino_relojoeiro",
        "coPlayWinRate": 95.5,
        "liftOverBaseline": 33.4,
        "sampleCount": 22,
        "synergyNote": "Abertura de corredor tático: Reen, Ceifador de Engrenagens neutraliza bloqueadores para a infiltração letal de Sylvanor, o Coração do Mundo (95.5% WR, +33.4% Lift)."
      },
      {
        "cardAId": "green_173_general_roda_selva",
        "cardBId": "neutral_25_convergencia_harmonica",
        "coPlayWinRate": 100,
        "liftOverBaseline": 37.9,
        "sampleCount": 13,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Convergência dos Cinco Pactos + Sylvarok, General da Roda Primeva na mesma janela de pressão (100.0% WR, +37.9% Lift)."
      },
      {
        "cardAId": "green_09_hidra",
        "cardBId": "neutral_155_chamado_armas_fronteira",
        "coPlayWinRate": 100,
        "liftOverBaseline": 37.9,
        "sampleCount": 12,
        "synergyNote": "Mobilização da Torre dos Cinco Selos (4⚡) trava a Vanguarda enquanto Vorágine, Hidra Voraz do Pântano (6⚡) opera protegido com +1 ATQ de Cobertura (100.0% WR, +37.9% Lift)."
      },
      {
        "cardAId": "green_50_avatar_gaia",
        "cardBId": "green_53_carapaca_espinhosa",
        "coPlayWinRate": 100,
        "liftOverBaseline": 37.9,
        "sampleCount": 12,
        "synergyNote": "Abertura de corredor tático: Rebote de Espinhos Vivos neutraliza bloqueadores para a infiltração letal de Sylvanor, o Coração do Mundo (100.0% WR, +37.9% Lift)."
      }
    ]
  },
  "deck_dual_gold_neutral": {
    "deckId": "deck_dual_gold_neutral",
    "deckName": "Escritura da Cidadela de Marfim",
    "archetypeTag": "Aliança Cromático-Axial ☀️+⚙️ • Solária & Matriz",
    "generationsTrained": 44,
    "matchesSimulated": 10250,
    "baselineWinRate": 52.2,
    "trainedWinRate": 54.7,
    "weights": {
      "aggroFaceBias": 1.02,
      "tradeValueBias": 1.2,
      "guardianPriority": 1.26,
      "flyingEvasionBias": 1.02,
      "stackConsolidationBias": 1.38,
      "antiAoeSpreadBias": 1.15,
      "spellHoldPatience": 0.96,
      "relicPriority": 1.22,
      "ascensionEagerness": 1.24,
      "bloodPactThresholdHp": 26,
      "domainExpansionEagerness": 1.08,
      "sovPowerTempoBias": 1,
      "synergyHoldBonus": 22,
      "mulliganCurveTarget": 3.2
    },
    "mulliganKeepIds": [
      "neutral_106_reen_assassino_relojoeiro",
      "neutral_84_cao_guerra_encouracado",
      "neutral_81_operario_relojoeiro",
      "gold_37_escudeiro_solar",
      "gold_95_cavaleiro_pegaso",
      "gold_141_intervencao_angelical"
    ],
    "channelPriorityIds": [
      "gold_97_colosso_celestial",
      "gold_117_arcanjo_egide",
      "gold_156_serafim_coroa_radiante",
      "neutral_113_gigante_pedra_entalhador",
      "gold_154_colosso_marmore_sagrado"
    ],
    "channelAvoidIds": [
      "gold_172_armada_draconica_sol",
      "neutral_106_reen_assassino_relojoeiro",
      "gold_28_reliquia_pacto",
      "neutral_133_escudo_sentinela_olho",
      "neutral_10_valkyra_pentacromatica",
      "gold_142_calice_alvorada_real"
    ],
    "highImpactCardBoosts": {
      "gold_172_armada_draconica_sol": 18,
      "neutral_106_reen_assassino_relojoeiro": 18,
      "gold_28_reliquia_pacto": 18,
      "neutral_133_escudo_sentinela_olho": 18,
      "neutral_10_valkyra_pentacromatica": 18,
      "gold_142_calice_alvorada_real": 18,
      "neutral_154_elixir_pedra_ferro": 18,
      "gold_173_general_roda_sol": 18
    },
    "synergyPairs": [
      [
        "gold_142_calice_alvorada_real",
        "gold_28_reliquia_pacto"
      ],
      [
        "gold_142_calice_alvorada_real",
        "gold_95_cavaleiro_pegaso"
      ],
      [
        "neutral_106_reen_assassino_relojoeiro",
        "neutral_133_escudo_sentinela_olho"
      ],
      [
        "gold_172_armada_draconica_sol",
        "gold_37_escudeiro_solar"
      ],
      [
        "neutral_133_escudo_sentinela_olho",
        "neutral_99_tlincalli_ferrao_aco"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "gold_142_calice_alvorada_real",
        "cardBId": "gold_28_reliquia_pacto",
        "coPlayWinRate": 95.8,
        "liftOverBaseline": 39.5,
        "sampleCount": 24,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Cálice Real da Alvorada + Arca da Aliança Dourada na mesma janela de pressão (95.8% WR, +39.5% Lift)."
      },
      {
        "cardAId": "gold_142_calice_alvorada_real",
        "cardBId": "gold_95_cavaleiro_pegaso",
        "coPlayWinRate": 95.2,
        "liftOverBaseline": 38.9,
        "sampleCount": 21,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Cálice Real da Alvorada + Valkíria do Pégaso Real na mesma janela de pressão (95.2% WR, +38.9% Lift)."
      },
      {
        "cardAId": "neutral_106_reen_assassino_relojoeiro",
        "cardBId": "neutral_133_escudo_sentinela_olho",
        "coPlayWinRate": 90,
        "liftOverBaseline": 33.6,
        "sampleCount": 40,
        "synergyNote": "Abertura de corredor tático: Escudo Sentinela Sempre-Atento neutraliza bloqueadores para a infiltração letal de Reen, Ceifador de Engrenagens (90.0% WR, +33.6% Lift)."
      },
      {
        "cardAId": "gold_172_armada_draconica_sol",
        "cardBId": "gold_37_escudeiro_solar",
        "coPlayWinRate": 100,
        "liftOverBaseline": 43.6,
        "sampleCount": 13,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Escudeiro da Alvorada + Armada Dracônica do Zênite na mesma janela de pressão (100.0% WR, +43.6% Lift)."
      },
      {
        "cardAId": "neutral_133_escudo_sentinela_olho",
        "cardBId": "neutral_99_tlincalli_ferrao_aco",
        "coPlayWinRate": 95,
        "liftOverBaseline": 38.6,
        "sampleCount": 20,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Escudo Sentinela Sempre-Atento + Caçador-Escorpião do Deserto Cinza na mesma janela de pressão (95.0% WR, +38.6% Lift)."
      }
    ]
  },
  "deck_tri_zenith_armada": {
    "deckId": "deck_tri_zenith_armada",
    "deckName": "Grimório da Armada do Zênite",
    "archetypeTag": "tempo",
    "generationsTrained": 43,
    "matchesSimulated": 9718,
    "baselineWinRate": 60.9,
    "trainedWinRate": 54.1,
    "weights": {
      "aggroFaceBias": 1,
      "tradeValueBias": 1,
      "guardianPriority": 1,
      "flyingEvasionBias": 1,
      "stackConsolidationBias": 1,
      "antiAoeSpreadBias": 1,
      "spellHoldPatience": 1,
      "relicPriority": 1,
      "ascensionEagerness": 1,
      "bloodPactThresholdHp": 24,
      "domainExpansionEagerness": 1,
      "sovPowerTempoBias": 1,
      "synergyHoldBonus": 20,
      "mulliganCurveTarget": 3.2
    },
    "mulliganKeepIds": [
      "gold_37_escudeiro_solar",
      "gold_43_sentinela_relogio",
      "blue_149_cronomante_ampulheta",
      "neutral_84_cao_guerra_encouracado",
      "red_42_cavaleiro_draconico",
      "gold_141_intervencao_angelical"
    ],
    "channelPriorityIds": [
      "blue_134_arquimago_singularidade",
      "red_23_dragao_latao",
      "blue_169_pressagio_revoada_gelo",
      "neutral_113_gigante_pedra_entalhador",
      "blue_72_incensario_ventos"
    ],
    "channelAvoidIds": [
      "blue_35_cetro_inverno",
      "blue_172_armada_draconica_gelo",
      "red_173_general_roda_chama",
      "blue_154_dragao_safira_soberano",
      "blue_136_leviata_cronos",
      "gold_172_armada_draconica_sol"
    ],
    "highImpactCardBoosts": {
      "blue_35_cetro_inverno": 18,
      "blue_172_armada_draconica_gelo": 18,
      "red_173_general_roda_chama": 18,
      "blue_154_dragao_safira_soberano": 18,
      "blue_136_leviata_cronos": 18,
      "gold_172_armada_draconica_sol": 18,
      "blue_89_roda_tempo": 17,
      "blue_173_general_roda_gelo": 16
    },
    "synergyPairs": [
      [
        "blue_35_cetro_inverno",
        "gold_37_escudeiro_solar"
      ],
      [
        "blue_35_cetro_inverno",
        "gold_43_sentinela_relogio"
      ],
      [
        "blue_06_dragao_azul",
        "gold_76_monge_relogio"
      ],
      [
        "blue_136_leviata_cronos",
        "blue_62_principe_ar"
      ],
      [
        "blue_169_pressagio_revoada_gelo",
        "red_12_mephit_magma"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "blue_35_cetro_inverno",
        "cardBId": "gold_37_escudeiro_solar",
        "coPlayWinRate": 100,
        "liftOverBaseline": 35.6,
        "sampleCount": 16,
        "synergyNote": "Escudeiro da Alvorada (1⚡) trava a Vanguarda enquanto Cetro da Geada Soberana (3⚡) opera protegido com +1 ATQ de Cobertura (100.0% WR, +35.6% Lift)."
      },
      {
        "cardAId": "blue_35_cetro_inverno",
        "cardBId": "gold_43_sentinela_relogio",
        "coPlayWinRate": 95.5,
        "liftOverBaseline": 31.1,
        "sampleCount": 22,
        "synergyNote": "Cetro da Geada Soberana (3⚡) trava a Vanguarda enquanto Sentinela da Engrenagem Real (3⚡) opera protegido com +1 ATQ de Cobertura (95.5% WR, +31.1% Lift)."
      },
      {
        "cardAId": "blue_06_dragao_azul",
        "cardBId": "gold_76_monge_relogio",
        "coPlayWinRate": 100,
        "liftOverBaseline": 35.6,
        "sampleCount": 13,
        "synergyNote": "Punho do Relógio de Mão (2⚡) trava a Vanguarda enquanto Vorthurion, Tempestade do Deserto (7⚡) opera protegido com +1 ATQ de Cobertura (100.0% WR, +35.6% Lift)."
      },
      {
        "cardAId": "blue_136_leviata_cronos",
        "cardBId": "blue_62_principe_ar",
        "coPlayWinRate": 92.3,
        "liftOverBaseline": 27.9,
        "sampleCount": 26,
        "synergyNote": "Abertura de corredor tático: Yan-Vael, Senhor do Furacão neutraliza bloqueadores para a infiltração letal de Chronoleviatã, Soberano do Tempo (92.3% WR, +27.9% Lift)."
      },
      {
        "cardAId": "blue_169_pressagio_revoada_gelo",
        "cardBId": "red_12_mephit_magma",
        "coPlayWinRate": 94.7,
        "liftOverBaseline": 30.4,
        "sampleCount": 19,
        "synergyNote": "Abertura de corredor tático: Diabrete de Magma neutraliza bloqueadores para a infiltração letal de Presságio da Revoada Glacial (94.7% WR, +30.4% Lift)."
      }
    ]
  },
  "deck_tri_tempest_primordial": {
    "deckId": "deck_tri_tempest_primordial",
    "deckName": "Códice da Tempestade Primordial",
    "archetypeTag": "tempo",
    "generationsTrained": 43,
    "matchesSimulated": 9698,
    "baselineWinRate": 50.9,
    "trainedWinRate": 59.7,
    "weights": {
      "aggroFaceBias": 1,
      "tradeValueBias": 1,
      "guardianPriority": 1,
      "flyingEvasionBias": 1,
      "stackConsolidationBias": 1,
      "antiAoeSpreadBias": 1,
      "spellHoldPatience": 1,
      "relicPriority": 1,
      "ascensionEagerness": 1,
      "bloodPactThresholdHp": 24,
      "domainExpansionEagerness": 1,
      "sovPowerTempoBias": 1,
      "synergyHoldBonus": 20,
      "mulliganCurveTarget": 3.2
    },
    "mulliganKeepIds": [
      "green_19_guardiao_ursino",
      "blue_62_principe_ar",
      "red_55_diabrete_forja",
      "green_07_troll",
      "red_114_draco_escoria",
      "green_12_pixie"
    ],
    "channelPriorityIds": [
      "blue_132_esfinge_nebulosa",
      "green_144_bencao_arvore_mundo",
      "red_76_salamandra_vapor",
      "red_32_ritual_cinzas",
      "blue_76_anomalia_viva"
    ],
    "channelAvoidIds": [
      "blue_173_general_roda_gelo",
      "green_173_general_roda_selva",
      "green_34_furia_matilha",
      "green_52_estouro_manada",
      "red_173_general_roda_chama",
      "blue_154_dragao_safira_soberano"
    ],
    "highImpactCardBoosts": {
      "blue_173_general_roda_gelo": 18,
      "green_173_general_roda_selva": 18,
      "green_34_furia_matilha": 18,
      "green_52_estouro_manada": 18,
      "red_173_general_roda_chama": 18,
      "blue_154_dragao_safira_soberano": 18,
      "blue_153_leviata_fenda_abissal": 18,
      "green_120_hidra_primordial_rei": 16
    },
    "synergyPairs": [
      [
        "blue_62_principe_ar",
        "green_52_estouro_manada"
      ],
      [
        "blue_153_leviata_fenda_abissal",
        "green_173_general_roda_selva"
      ],
      [
        "blue_169_pressagio_revoada_gelo",
        "green_34_furia_matilha"
      ],
      [
        "blue_153_leviata_fenda_abissal",
        "green_12_pixie"
      ],
      [
        "blue_67_clone_espelhado",
        "green_34_furia_matilha"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "blue_62_principe_ar",
        "cardBId": "green_52_estouro_manada",
        "coPlayWinRate": 100,
        "liftOverBaseline": 45,
        "sampleCount": 14,
        "synergyNote": "Abertura de corredor tático: Yan-Vael, Senhor do Furacão neutraliza bloqueadores para a infiltração letal de Marcha dos Colossos (100.0% WR, +45.0% Lift)."
      },
      {
        "cardAId": "blue_153_leviata_fenda_abissal",
        "cardBId": "green_173_general_roda_selva",
        "coPlayWinRate": 94.4,
        "liftOverBaseline": 39.5,
        "sampleCount": 18,
        "synergyNote": "Zephyrus, Monarca do Ciclone (6⚡) trava a Vanguarda enquanto Sylvarok, General da Roda Primeva (7⚡) opera protegido com +1 ATQ de Cobertura (94.4% WR, +39.5% Lift)."
      },
      {
        "cardAId": "blue_169_pressagio_revoada_gelo",
        "cardBId": "green_34_furia_matilha",
        "coPlayWinRate": 86.5,
        "liftOverBaseline": 31.5,
        "sampleCount": 37,
        "synergyNote": "Abertura de corredor tático: Chamado da Matilha Alfa neutraliza bloqueadores para a infiltração letal de Presságio da Revoada Glacial (86.5% WR, +31.5% Lift)."
      },
      {
        "cardAId": "blue_153_leviata_fenda_abissal",
        "cardBId": "green_12_pixie",
        "coPlayWinRate": 86.1,
        "liftOverBaseline": 31.1,
        "sampleCount": 36,
        "synergyNote": "Fada Pixie do Pó Estelar (2⚡) trava a Vanguarda enquanto Zephyrus, Monarca do Ciclone (6⚡) opera protegido com +1 ATQ de Cobertura (86.1% WR, +31.1% Lift)."
      },
      {
        "cardAId": "blue_67_clone_espelhado",
        "cardBId": "green_34_furia_matilha",
        "coPlayWinRate": 86.1,
        "liftOverBaseline": 31.1,
        "sampleCount": 36,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Chamado da Matilha Alfa + Duplicata Ilusória na mesma janela de pressão (86.1% WR, +31.1% Lift)."
      }
    ]
  },
  "deck_tri_eclipse_bastion": {
    "deckId": "deck_tri_eclipse_bastion",
    "deckName": "Escritura do Bastião do Eclipse",
    "archetypeTag": "attrition",
    "generationsTrained": 43,
    "matchesSimulated": 9684,
    "baselineWinRate": 52.2,
    "trainedWinRate": 57.2,
    "weights": {
      "aggroFaceBias": 1.21,
      "tradeValueBias": 1.32,
      "guardianPriority": 1.37,
      "flyingEvasionBias": 0.86,
      "stackConsolidationBias": 1.22,
      "antiAoeSpreadBias": 1,
      "spellHoldPatience": 0.99,
      "relicPriority": 1.1,
      "ascensionEagerness": 1,
      "bloodPactThresholdHp": 22,
      "domainExpansionEagerness": 1.15,
      "sovPowerTempoBias": 1.05,
      "synergyHoldBonus": 18,
      "mulliganCurveTarget": 2.9
    },
    "mulliganKeepIds": [
      "green_07_troll",
      "gold_43_sentinela_relogio",
      "gold_37_escudeiro_solar",
      "neutral_84_cao_guerra_encouracado",
      "gold_141_intervencao_angelical",
      "green_150_xama_raizes_antigas"
    ],
    "channelPriorityIds": [
      "gold_23_dragao_prata",
      "green_155_ente_carvalho_anciao",
      "gold_115_leao_celestial_rei",
      "neutral_115_golem_ferro_fornalha_neutra",
      "gold_137_colosso_cidadela_eterna"
    ],
    "channelAvoidIds": [
      "purple_83_arquidemonio_tempo",
      "gold_08_golem_ferro",
      "gold_172_armada_draconica_sol",
      "purple_173_general_roda_abismo",
      "gold_32_estandarte_imperial",
      "purple_100_dragao_necrotico"
    ],
    "highImpactCardBoosts": {
      "purple_83_arquidemonio_tempo": 18,
      "gold_08_golem_ferro": 18,
      "gold_172_armada_draconica_sol": 18,
      "purple_173_general_roda_abismo": 18,
      "gold_32_estandarte_imperial": 18,
      "purple_100_dragao_necrotico": 18,
      "gold_119_soberano_ordem_eterna": 18,
      "green_150_xama_raizes_antigas": 18
    },
    "synergyPairs": [
      [
        "purple_30_erguer_mortos",
        "purple_83_arquidemonio_tempo"
      ],
      [
        "gold_141_intervencao_angelical",
        "green_33_behemoth_primordial"
      ],
      [
        "gold_02_gargula",
        "gold_32_estandarte_imperial"
      ],
      [
        "gold_141_intervencao_angelical",
        "purple_83_arquidemonio_tempo"
      ],
      [
        "green_151_urso_couraca_musgo",
        "purple_100_dragao_necrotico"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "purple_30_erguer_mortos",
        "cardBId": "purple_83_arquidemonio_tempo",
        "coPlayWinRate": 100,
        "liftOverBaseline": 42.3,
        "sampleCount": 18,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Erguer Legião da Cripta + Mephistar, O Demônio do Pacto Eterno na mesma janela de pressão (100.0% WR, +42.3% Lift)."
      },
      {
        "cardAId": "gold_141_intervencao_angelical",
        "cardBId": "green_33_behemoth_primordial",
        "coPlayWinRate": 100,
        "liftOverBaseline": 42.3,
        "sampleCount": 17,
        "synergyNote": "Abertura de corredor tático: Intervenção da Égide Angelical neutraliza bloqueadores para a infiltração letal de Gorgoroth, Behemoth Devorador de Montanhas (100.0% WR, +42.3% Lift)."
      },
      {
        "cardAId": "gold_02_gargula",
        "cardBId": "gold_32_estandarte_imperial",
        "coPlayWinRate": 95,
        "liftOverBaseline": 37.3,
        "sampleCount": 20,
        "synergyNote": "Gárgula da Catedral Solar (2⚡) trava a Vanguarda enquanto Estandarte da Legião Dourada (4⚡) opera protegido com +1 ATQ de Cobertura (95.0% WR, +37.3% Lift)."
      },
      {
        "cardAId": "gold_141_intervencao_angelical",
        "cardBId": "purple_83_arquidemonio_tempo",
        "coPlayWinRate": 100,
        "liftOverBaseline": 42.3,
        "sampleCount": 12,
        "synergyNote": "Abertura de corredor tático: Intervenção da Égide Angelical neutraliza bloqueadores para a infiltração letal de Mephistar, O Demônio do Pacto Eterno (100.0% WR, +42.3% Lift)."
      },
      {
        "cardAId": "green_151_urso_couraca_musgo",
        "cardBId": "purple_100_dragao_necrotico",
        "coPlayWinRate": 100,
        "liftOverBaseline": 42.3,
        "sampleCount": 11,
        "synergyNote": "Recursão da Cripta: recicla ameaças abatidas entre Colosso de Geodo e Musgo e Morgath, O Dragão da Chama Necrótica, esgotando as remoções rivais (100.0% WR, +42.3% Lift)."
      }
    ]
  },
  "deck_penta_wheel_convergence": {
    "deckId": "deck_penta_wheel_convergence",
    "deckName": "Tomo da Convergência dos Oito Raios",
    "archetypeTag": "control",
    "generationsTrained": 43,
    "matchesSimulated": 9886,
    "baselineWinRate": 45.3,
    "trainedWinRate": 62.2,
    "weights": {
      "aggroFaceBias": 0.69,
      "tradeValueBias": 1.34,
      "guardianPriority": 1.27,
      "flyingEvasionBias": 0.95,
      "stackConsolidationBias": 1.04,
      "antiAoeSpreadBias": 0.98,
      "spellHoldPatience": 1.31,
      "relicPriority": 1.07,
      "ascensionEagerness": 0.87,
      "bloodPactThresholdHp": 20,
      "domainExpansionEagerness": 1.15,
      "sovPowerTempoBias": 1.04,
      "synergyHoldBonus": 19,
      "mulliganCurveTarget": 2.58
    },
    "mulliganKeepIds": [
      "gold_37_escudeiro_solar",
      "purple_34_cripta_espinhos",
      "neutral_168_tecelao_feixe_matriz",
      "green_19_guardiao_ursino",
      "red_104_tempestade_cinzas",
      "blue_40_naga_guardia"
    ],
    "channelPriorityIds": [
      "red_104_tempestade_cinzas",
      "neutral_115_golem_ferro_fornalha_neutra",
      "neutral_166_protocolo_torre_axial",
      "neutral_93_ladrao_mestre_mascara",
      "green_08_ente"
    ],
    "channelAvoidIds": [
      "red_160_furia_sangue_draconico",
      "gold_142_calice_alvorada_real",
      "neutral_11_botas_aladas",
      "neutral_10_valkyra_pentacromatica",
      "purple_173_general_roda_abismo",
      "red_173_general_roda_chama"
    ],
    "highImpactCardBoosts": {
      "red_160_furia_sangue_draconico": 18,
      "gold_142_calice_alvorada_real": 18,
      "neutral_11_botas_aladas": 18,
      "neutral_10_valkyra_pentacromatica": 18,
      "purple_173_general_roda_abismo": 18,
      "red_173_general_roda_chama": 18,
      "blue_173_general_roda_gelo": 18,
      "purple_32_apocalipse_vazio": 18
    },
    "synergyPairs": [
      [
        "neutral_11_botas_aladas",
        "red_160_furia_sangue_draconico"
      ],
      [
        "gold_142_calice_alvorada_real",
        "red_160_furia_sangue_draconico"
      ],
      [
        "gold_37_escudeiro_solar",
        "purple_173_general_roda_abismo"
      ],
      [
        "neutral_11_botas_aladas",
        "neutral_19_pergaminho_protecao"
      ],
      [
        "gold_10_egide_radiante",
        "gold_142_calice_alvorada_real"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "neutral_11_botas_aladas",
        "cardBId": "red_160_furia_sangue_draconico",
        "coPlayWinRate": 100,
        "liftOverBaseline": 44.6,
        "sampleCount": 16,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Botas Aladas do Mensageiro + Galope das Brasas Vivas na mesma janela de pressão (100.0% WR, +44.6% Lift)."
      },
      {
        "cardAId": "gold_142_calice_alvorada_real",
        "cardBId": "red_160_furia_sangue_draconico",
        "coPlayWinRate": 95.5,
        "liftOverBaseline": 40,
        "sampleCount": 22,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Cálice Real da Alvorada + Galope das Brasas Vivas na mesma janela de pressão (95.5% WR, +40.0% Lift)."
      },
      {
        "cardAId": "gold_37_escudeiro_solar",
        "cardBId": "purple_173_general_roda_abismo",
        "coPlayWinRate": 91.2,
        "liftOverBaseline": 35.7,
        "sampleCount": 34,
        "synergyNote": "Abertura de corredor tático: Escudeiro da Alvorada neutraliza bloqueadores para a infiltração letal de Nyxaroth, General da Roda Fúnebre (91.2% WR, +35.7% Lift)."
      },
      {
        "cardAId": "neutral_11_botas_aladas",
        "cardBId": "neutral_19_pergaminho_protecao",
        "coPlayWinRate": 90.2,
        "liftOverBaseline": 34.8,
        "sampleCount": 41,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Botas Aladas do Mensageiro + Pergaminho da Égide Universal na mesma janela de pressão (90.2% WR, +34.8% Lift)."
      },
      {
        "cardAId": "gold_10_egide_radiante",
        "cardBId": "gold_142_calice_alvorada_real",
        "coPlayWinRate": 88.5,
        "liftOverBaseline": 33,
        "sampleCount": 78,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Cálice Real da Alvorada + Égide do Planetário na mesma janela de pressão (88.5% WR, +33.0% Lift)."
      }
    ]
  }
};

/**
 * Resolves the learned AI tactical profile for either 'player' or 'ai' in O(1) when deckId/bossId
 * is present, or via fast card-overlap matching for custom/restored decks.
 */
export function resolveLearnedProfileForActor(
  state: GameState,
  actor: 'player' | 'ai',
  overrideProfile?: DeckLearnedAiProfile
): DeckLearnedAiProfile {
  if (overrideProfile) return overrideProfile;

  const explicitDeckId = actor === 'player' ? state.playerDeckId : state.aiDeckId;
  if (explicitDeckId) {
    if (AI_LEARNED_PROFILES[explicitDeckId]) {
      return AI_LEARNED_PROFILES[explicitDeckId];
    }
    const polyId = resolvePolycolorArchetypeForDeckId(explicitDeckId);
    if (polyId && POLYCOLOR_ARCHETYPE_MASTERY[polyId]?.learnedProfile) {
      return POLYCOLOR_ARCHETYPE_MASTERY[polyId].learnedProfile;
    }
    const biId = resolveBicolorArchetypeForDeckId(explicitDeckId);
    if (biId && BICOLOR_ARCHETYPE_MASTERY[biId]?.learnedProfile) {
      return BICOLOR_ARCHETYPE_MASTERY[biId].learnedProfile;
    }
    const monoMastery = MONOCOLOR_ARCHETYPE_MASTERY[explicitDeckId as MonocolorArchetypeId];
    if (monoMastery?.learnedProfile) {
      return monoMastery.learnedProfile;
    }
  }

  if (actor === 'ai' && state.bossId) {
    const boss = CAMPAIGN_BOSSES.find((b) => b.id === state.bossId);
    if (boss) {
      if (AI_LEARNED_PROFILES[boss.deckId]) {
        return AI_LEARNED_PROFILES[boss.deckId];
      }
      if (boss.domains.length >= 4) {
        const pentaId = resolvePentachromaticArchetypeForBoss(boss);
        if (POLYCOLOR_ARCHETYPE_MASTERY[pentaId]?.learnedProfile) {
          return POLYCOLOR_ARCHETYPE_MASTERY[pentaId].learnedProfile;
        }
      } else if (boss.domains.length === 3) {
        const triBossId =
          resolveTricolorArchetypeForDomains(boss.domains) ??
          resolvePolycolorArchetypeForDeckId(boss.deckId);
        if (triBossId && POLYCOLOR_ARCHETYPE_MASTERY[triBossId]?.learnedProfile) {
          return POLYCOLOR_ARCHETYPE_MASTERY[triBossId].learnedProfile;
        }
      } else if (boss.domains.length === 2) {
        const biBossId =
          resolveBicolorArchetypeForDomains(boss.domains) ??
          resolveBicolorArchetypeForDeckId(boss.deckId);
        if (biBossId && BICOLOR_ARCHETYPE_MASTERY[biBossId]?.learnedProfile) {
          return BICOLOR_ARCHETYPE_MASTERY[biBossId].learnedProfile;
        }
      }
    }
  }

  const actorState = state[actor];
  const sampleIds = new Set<string>();
  for (const c of actorState.hand) sampleIds.add(c.id);
  for (const c of actorState.channeledCards) sampleIds.add(c.id);
  for (const c of actorState.crypt) sampleIds.add(c.id);
  const deckSliceLen = Math.min(28, actorState.deck.length);
  for (let i = 0; i < deckSliceLen; i++) {
    sampleIds.add(actorState.deck[i].id);
  }

  if (sampleIds.size === 0) return BASELINE_AI_PROFILE;

  let bestDeckId: string | null = null;
  let bestHits = 0;

  for (const deck of PREBUILT_DECKS) {
    let hits = 0;
    const seenInDeck = new Set<string>();
    for (const cid of deck.cardIds) {
      if (!seenInDeck.has(cid) && sampleIds.has(cid)) {
        seenInDeck.add(cid);
        hits += 1;
      }
    }
    if (hits > bestHits) {
      bestHits = hits;
      bestDeckId = deck.id;
    }
  }

  if (bestDeckId && bestHits >= 4 && AI_LEARNED_PROFILES[bestDeckId]) {
    return AI_LEARNED_PROFILES[bestDeckId];
  }

  return BASELINE_AI_PROFILE;
}
