import { CAMPAIGN_BOSSES, PREBUILT_DECKS } from './decks';
import { GameState } from '../types/game';

/**
 * GERADO AUTOMATICAMENTE POR src/scripts/trainAiLeague.ts
 * Total da Maratona IA vs IA: 118,460 partidas completas simuladas (302.3s).
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
  totalMatchesSimulated: 118460,
  decksTrained: 30,
  elapsedSeconds: 302.3,
} as const;

export const AI_LEARNED_PROFILES: Record<string, DeckLearnedAiProfile> = {
  "deck_red_inferno": {
    "deckId": "deck_red_inferno",
    "deckName": "Grimório da Cratera Ardente",
    "archetypeTag": "Mono-Vermelho 🔥 • Chama & Escama",
    "generationsTrained": 48,
    "matchesSimulated": 13494,
    "baselineWinRate": 46.6,
    "trainedWinRate": 52.8,
    "weights": {
      "aggroFaceBias": 0.94,
      "tradeValueBias": 0.97,
      "guardianPriority": 1.12,
      "flyingEvasionBias": 1.24,
      "stackConsolidationBias": 1.29,
      "antiAoeSpreadBias": 1.03,
      "spellHoldPatience": 1.07,
      "relicPriority": 0.96,
      "ascensionEagerness": 0.82,
      "bloodPactThresholdHp": 18,
      "domainExpansionEagerness": 0.97,
      "sovPowerTempoBias": 1.16,
      "synergyHoldBonus": 20,
      "mulliganCurveTarget": 2.95
    },
    "mulliganKeepIds": [
      "red_62_colosso_obsidiana",
      "red_133_juggernaut_fornalha",
      "red_125_armadilha_piroclastica",
      "red_38_serpente_fogo",
      "red_164_armadilha_fissura_magma",
      "red_01_kobold"
    ],
    "channelPriorityIds": [
      "red_164_armadilha_fissura_magma",
      "red_87_rajada_prismatica_fogo",
      "red_125_armadilha_piroclastica",
      "red_63_wyvern_imperial",
      "red_33_supernova_vulcanica"
    ],
    "channelAvoidIds": [
      "red_172_armada_draconica_chama",
      "red_65_dragao_magma_anciao",
      "red_173_general_roda_chama",
      "red_137_dragao_cometa_rubro",
      "red_08_dragao_vermelho",
      "red_119_soberano_piroclasma"
    ],
    "highImpactCardBoosts": {
      "red_172_armada_draconica_chama": 18,
      "red_65_dragao_magma_anciao": 18,
      "red_173_general_roda_chama": 18,
      "red_137_dragao_cometa_rubro": 18,
      "red_08_dragao_vermelho": 18,
      "red_119_soberano_piroclasma": 17,
      "red_102_sangue_incandescente": 15,
      "red_45_fenix_primordial": 14
    },
    "synergyPairs": [
      [
        "red_137_dragao_cometa_rubro",
        "red_173_general_roda_chama"
      ],
      [
        "red_172_armada_draconica_chama",
        "red_65_dragao_magma_anciao"
      ],
      [
        "red_137_dragao_cometa_rubro",
        "red_172_armada_draconica_chama"
      ],
      [
        "red_117_arauto_erupcao",
        "red_65_dragao_magma_anciao"
      ],
      [
        "red_117_arauto_erupcao",
        "red_69_ira_vulcao"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "red_137_dragao_cometa_rubro",
        "cardBId": "red_173_general_roda_chama",
        "coPlayWinRate": 92,
        "liftOverBaseline": 38,
        "sampleCount": 25,
        "synergyNote": "Abertura de corredor tático: Dragão do Cometa Carmesim neutraliza bloqueadores para a infiltração letal de Pyrrakon, General da Roda Vulcânica (92.0% WR, +38.0% Lift)."
      },
      {
        "cardAId": "red_172_armada_draconica_chama",
        "cardBId": "red_65_dragao_magma_anciao",
        "coPlayWinRate": 100,
        "liftOverBaseline": 46,
        "sampleCount": 12,
        "synergyNote": "Sinergia empírica de alta conversão: curvar Magmarok, o Tirano Piroclástico (7⚡) rumo a Hoste Dracônica da Cratera (8⚡) eleva o domínio de mesa (100.0% WR, +46.0% Lift)."
      },
      {
        "cardAId": "red_137_dragao_cometa_rubro",
        "cardBId": "red_172_armada_draconica_chama",
        "coPlayWinRate": 94.4,
        "liftOverBaseline": 40.5,
        "sampleCount": 18,
        "synergyNote": "Sinergia empírica de alta conversão: curvar Dragão do Cometa Carmesim (6⚡) rumo a Hoste Dracônica da Cratera (8⚡) eleva o domínio de mesa (94.4% WR, +40.5% Lift)."
      },
      {
        "cardAId": "red_117_arauto_erupcao",
        "cardBId": "red_65_dragao_magma_anciao",
        "coPlayWinRate": 86.2,
        "liftOverBaseline": 32.2,
        "sampleCount": 29,
        "synergyNote": "Abertura de corredor tático: Arauto Demoníaco da Erupção neutraliza bloqueadores para a infiltração letal de Magmarok, o Tirano Piroclástico (86.2% WR, +32.2% Lift)."
      },
      {
        "cardAId": "red_117_arauto_erupcao",
        "cardBId": "red_69_ira_vulcao",
        "coPlayWinRate": 84.8,
        "liftOverBaseline": 30.9,
        "sampleCount": 33,
        "synergyNote": "Abertura de corredor tático: Arauto Demoníaco da Erupção neutraliza bloqueadores para a infiltração letal de Despertar da Caldeira Ancestral (84.8% WR, +30.9% Lift)."
      }
    ]
  },
  "deck_blue_tempest": {
    "deckId": "deck_blue_tempest",
    "deckName": "Tomo do Olho do Furacão",
    "archetypeTag": "Mono-Azul ❄️ • Tempestade & Runa",
    "generationsTrained": 48,
    "matchesSimulated": 13544,
    "baselineWinRate": 31.6,
    "trainedWinRate": 54.7,
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
      "blue_79_semblante_atemporal",
      "blue_52_passo_bruma",
      "blue_61_quimera_tempestade",
      "blue_159_paradoxo_ampulheta",
      "neutral_46_pausar_pensar",
      "blue_170_flagelo_cornudo_gelo"
    ],
    "channelPriorityIds": [
      "blue_160_nevasca_soberana",
      "blue_141_ruptura_temporal",
      "blue_132_esfinge_nebulosa",
      "blue_159_paradoxo_ampulheta",
      "blue_124_dissipar_essencia"
    ],
    "channelAvoidIds": [
      "blue_173_general_roda_gelo",
      "blue_172_armada_draconica_gelo",
      "blue_80_senhor_tempo",
      "blue_07_kraken",
      "blue_79_semblante_atemporal",
      "blue_52_passo_bruma"
    ],
    "highImpactCardBoosts": {
      "blue_173_general_roda_gelo": 18,
      "blue_172_armada_draconica_gelo": 18,
      "blue_80_senhor_tempo": 18,
      "blue_07_kraken": 18,
      "blue_79_semblante_atemporal": 18,
      "blue_52_passo_bruma": 18,
      "blue_89_roda_tempo": 16,
      "blue_117_arconte_astral": 14
    },
    "synergyPairs": [
      [
        "blue_173_general_roda_gelo",
        "blue_80_senhor_tempo"
      ],
      [
        "blue_89_roda_tempo",
        "blue_99_congelar_tempo"
      ],
      [
        "blue_134_arquimago_singularidade",
        "blue_173_general_roda_gelo"
      ],
      [
        "blue_168_tecelao_feixe_gelo",
        "blue_172_armada_draconica_gelo"
      ],
      [
        "blue_172_armada_draconica_gelo",
        "blue_80_senhor_tempo"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "blue_173_general_roda_gelo",
        "cardBId": "blue_80_senhor_tempo",
        "coPlayWinRate": 91.3,
        "liftOverBaseline": 49.6,
        "sampleCount": 23,
        "synergyNote": "Thaddeus, Senhor do Tempo (6⚡) trava a Vanguarda enquanto Cryonax, General da Roda Astral (7⚡) opera protegido com +1 ATQ de Cobertura (91.3% WR, +49.6% Lift)."
      },
      {
        "cardAId": "blue_89_roda_tempo",
        "cardBId": "blue_99_congelar_tempo",
        "coPlayWinRate": 100,
        "liftOverBaseline": 58.3,
        "sampleCount": 9,
        "synergyNote": "Motor de aceleração: Congelar o Instante antecipa recursos e fôlego para sustentar o impacto de Astrolábio das Eras Eternas (100.0% WR, +58.3% Lift)."
      },
      {
        "cardAId": "blue_134_arquimago_singularidade",
        "cardBId": "blue_173_general_roda_gelo",
        "coPlayWinRate": 80.4,
        "liftOverBaseline": 38.7,
        "sampleCount": 46,
        "synergyNote": "Arquimago da Singularidade (5⚡) trava a Vanguarda enquanto Cryonax, General da Roda Astral (7⚡) opera protegido com +1 ATQ de Cobertura (80.4% WR, +38.7% Lift)."
      },
      {
        "cardAId": "blue_168_tecelao_feixe_gelo",
        "cardBId": "blue_172_armada_draconica_gelo",
        "coPlayWinRate": 84.2,
        "liftOverBaseline": 42.5,
        "sampleCount": 19,
        "synergyNote": "Abertura de corredor tático: Tecelão do Feixe Astral neutraliza bloqueadores para a infiltração letal de Esquadra Dracônica da Nevasca (84.2% WR, +42.5% Lift)."
      },
      {
        "cardAId": "blue_172_armada_draconica_gelo",
        "cardBId": "blue_80_senhor_tempo",
        "coPlayWinRate": 90.9,
        "liftOverBaseline": 49.2,
        "sampleCount": 11,
        "synergyNote": "Abertura de corredor tático: Thaddeus, Senhor do Tempo neutraliza bloqueadores para a infiltração letal de Esquadra Dracônica da Nevasca (90.9% WR, +49.2% Lift)."
      }
    ]
  },
  "deck_purple_abyss": {
    "deckId": "deck_purple_abyss",
    "deckName": "Necronomicon do Sol Negro",
    "archetypeTag": "Mono-Roxo 💀 • Abismo & Sombra",
    "generationsTrained": 48,
    "matchesSimulated": 13582,
    "baselineWinRate": 54.7,
    "trainedWinRate": 52.8,
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
      "purple_05_cavaleiro_morte",
      "purple_133_ceifador_tumular",
      "purple_170_flagelo_cornudo_abismo",
      "neutral_46_pausar_pensar",
      "purple_147_acolito_sangue_profano",
      "purple_27_emboscada_umbrosa"
    ],
    "channelPriorityIds": [
      "purple_161_pacto_agonia_eterna",
      "purple_96_abominacao_costurada",
      "purple_122_praga_necrotica",
      "purple_116_devorador_mentes",
      "purple_19_conde_vampiro"
    ],
    "channelAvoidIds": [
      "purple_172_armada_draconica_abismo",
      "purple_05_cavaleiro_morte",
      "purple_07_lich",
      "purple_173_general_roda_abismo",
      "purple_119_soberano_entropia",
      "purple_23_dracolich"
    ],
    "highImpactCardBoosts": {
      "purple_172_armada_draconica_abismo": 18,
      "purple_05_cavaleiro_morte": 18,
      "purple_07_lich": 18,
      "purple_173_general_roda_abismo": 18,
      "purple_119_soberano_entropia": 18,
      "purple_23_dracolich": 17,
      "purple_133_ceifador_tumular": 16,
      "purple_169_pressagio_revoada_abismo": 13
    },
    "synergyPairs": [
      [
        "purple_172_armada_draconica_abismo",
        "purple_55_rastejador_cripta"
      ],
      [
        "purple_172_armada_draconica_abismo",
        "purple_53_lanterna_almas"
      ],
      [
        "purple_05_cavaleiro_morte",
        "purple_07_lich"
      ],
      [
        "purple_07_lich",
        "purple_133_ceifador_tumular"
      ],
      [
        "purple_109_servo_catacumba",
        "purple_23_dracolich"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "purple_172_armada_draconica_abismo",
        "cardBId": "purple_55_rastejador_cripta",
        "coPlayWinRate": 97,
        "liftOverBaseline": 36.7,
        "sampleCount": 33,
        "synergyNote": "Recursão da Cripta: recicla ameaças abatidas entre Escolo-Couraçada da Cripta e Legião Dracônica do Eclipse, esgotando as remoções rivais (97.0% WR, +36.7% Lift)."
      },
      {
        "cardAId": "purple_172_armada_draconica_abismo",
        "cardBId": "purple_53_lanterna_almas",
        "coPlayWinRate": 100,
        "liftOverBaseline": 39.7,
        "sampleCount": 21,
        "synergyNote": "Recursão da Cripta: recicla ameaças abatidas entre Lanterna das Almas Penadas e Legião Dracônica do Eclipse, esgotando as remoções rivais (100.0% WR, +39.7% Lift)."
      },
      {
        "cardAId": "purple_05_cavaleiro_morte",
        "cardBId": "purple_07_lich",
        "coPlayWinRate": 94.4,
        "liftOverBaseline": 34.2,
        "sampleCount": 36,
        "synergyNote": "Paladino do Juramento Quebrado (4⚡) trava a Vanguarda enquanto Vesperion, Arquimago Lich Imortal (7⚡) opera protegido com +1 ATQ de Cobertura (94.4% WR, +34.2% Lift)."
      },
      {
        "cardAId": "purple_07_lich",
        "cardBId": "purple_133_ceifador_tumular",
        "coPlayWinRate": 92.7,
        "liftOverBaseline": 32.4,
        "sampleCount": 41,
        "synergyNote": "Recursão da Cripta: recicla ameaças abatidas entre Ceifador Executor Tumular e Vesperion, Arquimago Lich Imortal, esgotando as remoções rivais (92.7% WR, +32.4% Lift)."
      },
      {
        "cardAId": "purple_109_servo_catacumba",
        "cardBId": "purple_23_dracolich",
        "coPlayWinRate": 95.2,
        "liftOverBaseline": 35,
        "sampleCount": 21,
        "synergyNote": "Sinergia empírica de alta conversão: curvar Servo Esquelético da Catacumba (1⚡) rumo a Ossaurion, Dragão-Ossário Eterno (8⚡) eleva o domínio de mesa (95.2% WR, +35.0% Lift)."
      }
    ]
  },
  "deck_green_wild": {
    "deckId": "deck_green_wild",
    "deckName": "Códice da Selva Primordial",
    "archetypeTag": "Mono-Verde 🌿 • Selva & Fera",
    "generationsTrained": 48,
    "matchesSimulated": 13728,
    "baselineWinRate": 48.1,
    "trainedWinRate": 56.9,
    "weights": {
      "aggroFaceBias": 0.79,
      "tradeValueBias": 0.78,
      "guardianPriority": 1.01,
      "flyingEvasionBias": 1.05,
      "stackConsolidationBias": 1.15,
      "antiAoeSpreadBias": 0.93,
      "spellHoldPatience": 1.13,
      "relicPriority": 0.94,
      "ascensionEagerness": 0.98,
      "bloodPactThresholdHp": 23,
      "domainExpansionEagerness": 1.07,
      "sovPowerTempoBias": 1.06,
      "synergyHoldBonus": 16,
      "mulliganCurveTarget": 3.2
    },
    "mulliganKeepIds": [
      "green_32_gorila_alfa",
      "green_35_fosso_vinhas",
      "green_91_rastreador_feral",
      "green_13_satiro",
      "green_02_aranha_gigante",
      "neutral_31_automato_explorado"
    ],
    "channelPriorityIds": [
      "green_79_anquilossauro_ferro",
      "green_135_serpente_emplumada_selva",
      "green_171_pactuario_elemental_selva",
      "green_64_mamute_guerra",
      "green_117_mamute_esmeralda"
    ],
    "channelAvoidIds": [
      "green_172_armada_draconica_selva",
      "green_32_gorila_alfa",
      "green_09_hidra",
      "neutral_17_pedra_filosofal",
      "neutral_18_pocao_furia",
      "green_169_pressagio_revoada_selva"
    ],
    "highImpactCardBoosts": {
      "green_172_armada_draconica_selva": 18,
      "green_32_gorila_alfa": 18,
      "green_09_hidra": 17,
      "neutral_17_pedra_filosofal": 15,
      "neutral_18_pocao_furia": 12,
      "green_169_pressagio_revoada_selva": 12,
      "green_71_pedra_terra": 11,
      "green_91_rastreador_feral": 11
    },
    "synergyPairs": [
      [
        "green_170_flagelo_cornudo_selva",
        "green_172_armada_draconica_selva"
      ],
      [
        "green_117_mamute_esmeralda",
        "green_71_pedra_terra"
      ],
      [
        "green_172_armada_draconica_selva",
        "green_70_instinto_sobrevivencia"
      ],
      [
        "green_32_gorila_alfa",
        "green_71_pedra_terra"
      ],
      [
        "green_171_pactuario_elemental_selva",
        "neutral_17_pedra_filosofal"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "green_170_flagelo_cornudo_selva",
        "cardBId": "green_172_armada_draconica_selva",
        "coPlayWinRate": 100,
        "liftOverBaseline": 41,
        "sampleCount": 12,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Flagelo Cornudo da Mata + Enxame Dracônico Ancestral na mesma janela de pressão (100.0% WR, +41.0% Lift)."
      },
      {
        "cardAId": "green_117_mamute_esmeralda",
        "cardBId": "green_71_pedra_terra",
        "coPlayWinRate": 90,
        "liftOverBaseline": 31,
        "sampleCount": 30,
        "synergyNote": "Monólito de Comando da Terra (3⚡) trava a Vanguarda enquanto Mamute de Presas Esmeralda (5⚡) opera protegido com +1 ATQ de Cobertura (90.0% WR, +31.0% Lift)."
      },
      {
        "cardAId": "green_172_armada_draconica_selva",
        "cardBId": "green_70_instinto_sobrevivencia",
        "coPlayWinRate": 100,
        "liftOverBaseline": 41,
        "sampleCount": 11,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Rugido de Sobrevivência + Enxame Dracônico Ancestral na mesma janela de pressão (100.0% WR, +41.0% Lift)."
      },
      {
        "cardAId": "green_32_gorila_alfa",
        "cardBId": "green_71_pedra_terra",
        "coPlayWinRate": 86.4,
        "liftOverBaseline": 27.3,
        "sampleCount": 44,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Monólito de Comando da Terra + Kongor, Rei de Costas Prateadas na mesma janela de pressão (86.4% WR, +27.3% Lift)."
      },
      {
        "cardAId": "green_171_pactuario_elemental_selva",
        "cardBId": "neutral_17_pedra_filosofal",
        "coPlayWinRate": 100,
        "liftOverBaseline": 41,
        "sampleCount": 9,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Pactuário do Espírito Silvestre + Pedra Filosofal do Alquimista na mesma janela de pressão (100.0% WR, +41.0% Lift)."
      }
    ]
  },
  "deck_gold_bastion": {
    "deckId": "deck_gold_bastion",
    "deckName": "Escritura do Baluarte Solar",
    "archetypeTag": "Mono-Dourado ☀️ • Ordem & Ferro",
    "generationsTrained": 48,
    "matchesSimulated": 13820,
    "baselineWinRate": 38.8,
    "trainedWinRate": 43.1,
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
      "gold_106_bastiao_eterno",
      "gold_86_reacao_dividida",
      "gold_141_intervencao_angelical",
      "gold_131_cavaleiro_pegaso_solar",
      "gold_163_estandarte_legiao_dourada"
    ],
    "channelPriorityIds": [
      "gold_169_pressagio_revoada_sol",
      "gold_12_automato_engrenagem",
      "gold_135_serafim_seis_asas",
      "gold_115_leao_celestial_rei",
      "gold_171_pactuario_elemental_sol"
    ],
    "channelAvoidIds": [
      "gold_157_dragao_soberano_alvorada",
      "gold_172_armada_draconica_sol",
      "gold_07_dragao_ouro",
      "gold_138_imperador_sol_supremo",
      "gold_119_soberano_ordem_eterna",
      "gold_173_general_roda_sol"
    ],
    "highImpactCardBoosts": {
      "gold_157_dragao_soberano_alvorada": 18,
      "gold_172_armada_draconica_sol": 18,
      "gold_07_dragao_ouro": 18,
      "gold_138_imperador_sol_supremo": 18,
      "gold_119_soberano_ordem_eterna": 18,
      "gold_173_general_roda_sol": 18,
      "gold_156_serafim_coroa_radiante": 18,
      "gold_35_chamado_valquirias": 18
    },
    "synergyPairs": [
      [
        "gold_07_dragao_ouro",
        "gold_160_decreto_invulnerabilidade"
      ],
      [
        "gold_131_cavaleiro_pegaso_solar",
        "gold_157_dragao_soberano_alvorada"
      ],
      [
        "gold_157_dragao_soberano_alvorada",
        "gold_62_gigante_pedra_rei"
      ],
      [
        "gold_156_serafim_coroa_radiante",
        "gold_82_arcanjo_cronos"
      ],
      [
        "gold_115_leao_celestial_rei",
        "gold_138_imperador_sol_supremo"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "gold_07_dragao_ouro",
        "cardBId": "gold_160_decreto_invulnerabilidade",
        "coPlayWinRate": 100,
        "liftOverBaseline": 70.5,
        "sampleCount": 10,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Cúpula das Asas Seráficas + Aurarius, Majestade do Sol na mesma janela de pressão (100.0% WR, +70.5% Lift)."
      },
      {
        "cardAId": "gold_131_cavaleiro_pegaso_solar",
        "cardBId": "gold_157_dragao_soberano_alvorada",
        "coPlayWinRate": 88.9,
        "liftOverBaseline": 59.4,
        "sampleCount": 18,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Cavaleiro de Pégaso Solar + Aurelius, Soberano Dragão da Alvorada na mesma janela de pressão (88.9% WR, +59.4% Lift)."
      },
      {
        "cardAId": "gold_157_dragao_soberano_alvorada",
        "cardBId": "gold_62_gigante_pedra_rei",
        "coPlayWinRate": 100,
        "liftOverBaseline": 70.5,
        "sampleCount": 9,
        "synergyNote": "Thane das Colunas de Mármore (5⚡) trava a Vanguarda enquanto Aurelius, Soberano Dragão da Alvorada (8⚡) opera protegido com +1 ATQ de Cobertura (100.0% WR, +70.5% Lift)."
      },
      {
        "cardAId": "gold_156_serafim_coroa_radiante",
        "cardBId": "gold_82_arcanjo_cronos",
        "coPlayWinRate": 81.5,
        "liftOverBaseline": 52,
        "sampleCount": 27,
        "synergyNote": "Serafim da Décima Segunda Hora (6⚡) trava a Vanguarda enquanto Arcanjo Supremo das Seis Asas (7⚡) opera protegido com +1 ATQ de Cobertura (81.5% WR, +52.0% Lift)."
      },
      {
        "cardAId": "gold_115_leao_celestial_rei",
        "cardBId": "gold_138_imperador_sol_supremo",
        "coPlayWinRate": 84.2,
        "liftOverBaseline": 54.7,
        "sampleCount": 19,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Leão-Rei Celestial + Hyperion, Deus-Imperador da Aurora na mesma janela de pressão (84.2% WR, +54.7% Lift)."
      }
    ]
  },
  "deck_dual_draconic_pact": {
    "deckId": "deck_dual_draconic_pact",
    "deckName": "Grimório das Escamas Imperiais",
    "archetypeTag": "Pacto Duplo 🔥+☀️ • Chama & Ordem",
    "generationsTrained": 48,
    "matchesSimulated": 7504,
    "baselineWinRate": 41.9,
    "trainedWinRate": 57.5,
    "weights": {
      "aggroFaceBias": 0.82,
      "tradeValueBias": 1.1,
      "guardianPriority": 0.78,
      "flyingEvasionBias": 0.86,
      "stackConsolidationBias": 1.09,
      "antiAoeSpreadBias": 1.04,
      "spellHoldPatience": 1.07,
      "relicPriority": 1.18,
      "ascensionEagerness": 0.95,
      "bloodPactThresholdHp": 24,
      "domainExpansionEagerness": 1.19,
      "sovPowerTempoBias": 0.92,
      "synergyHoldBonus": 22,
      "mulliganCurveTarget": 3.63
    },
    "mulliganKeepIds": [
      "red_62_colosso_obsidiana",
      "red_01_kobold",
      "gold_170_flagelo_cornudo_sol",
      "gold_01_espada_animada",
      "red_165_bigorna_fogo_primordial",
      "gold_121_lanca_julgamento_solar"
    ],
    "channelPriorityIds": [
      "red_161_erupcao_piroclastica",
      "gold_121_lanca_julgamento_solar",
      "gold_133_mestre_forja_imperial",
      "red_116_hidra_vulcanica",
      "red_125_armadilha_piroclastica"
    ],
    "channelAvoidIds": [
      "red_172_armada_draconica_chama",
      "neutral_10_valkyra_pentacromatica",
      "gold_173_general_roda_sol",
      "red_65_dragao_magma_anciao",
      "red_08_dragao_vermelho",
      "gold_07_dragao_ouro"
    ],
    "highImpactCardBoosts": {
      "red_172_armada_draconica_chama": 18,
      "neutral_10_valkyra_pentacromatica": 18,
      "gold_173_general_roda_sol": 18,
      "red_65_dragao_magma_anciao": 18,
      "red_08_dragao_vermelho": 18,
      "gold_07_dragao_ouro": 18,
      "red_102_sangue_incandescente": 18,
      "gold_115_leao_celestial_rei": 16
    },
    "synergyPairs": [
      [
        "neutral_46_pausar_pensar",
        "red_172_armada_draconica_chama"
      ],
      [
        "gold_01_espada_animada",
        "red_172_armada_draconica_chama"
      ],
      [
        "gold_134_esfinge_sentenca_real",
        "neutral_10_valkyra_pentacromatica"
      ],
      [
        "gold_55_cao_guarda_real",
        "neutral_10_valkyra_pentacromatica"
      ],
      [
        "gold_170_flagelo_cornudo_sol",
        "gold_173_general_roda_sol"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "neutral_46_pausar_pensar",
        "cardBId": "red_172_armada_draconica_chama",
        "coPlayWinRate": 94.4,
        "liftOverBaseline": 51.2,
        "sampleCount": 36,
        "synergyNote": "Motor de aceleração: Pausar e Pensar um Segundo antecipa recursos e fôlego para sustentar o impacto de Hoste Dracônica da Cratera (94.4% WR, +51.2% Lift)."
      },
      {
        "cardAId": "gold_01_espada_animada",
        "cardBId": "red_172_armada_draconica_chama",
        "coPlayWinRate": 95.7,
        "liftOverBaseline": 52.5,
        "sampleCount": 23,
        "synergyNote": "Sinergia empírica de alta conversão: curvar Lâmina Voadora Consagrada (1⚡) rumo a Hoste Dracônica da Cratera (8⚡) eleva o domínio de mesa (95.7% WR, +52.5% Lift)."
      },
      {
        "cardAId": "gold_134_esfinge_sentenca_real",
        "cardBId": "neutral_10_valkyra_pentacromatica",
        "coPlayWinRate": 95.2,
        "liftOverBaseline": 52,
        "sampleCount": 21,
        "synergyNote": "Abertura de corredor tático: Esfinge da Sentença Real neutraliza bloqueadores para a infiltração letal de Valkyra, Imperatriz Pentacromática (95.2% WR, +52.0% Lift)."
      },
      {
        "cardAId": "gold_55_cao_guarda_real",
        "cardBId": "neutral_10_valkyra_pentacromatica",
        "coPlayWinRate": 92.3,
        "liftOverBaseline": 49.1,
        "sampleCount": 26,
        "synergyNote": "Abertura de corredor tático: Mastim Couraçado da Cidadela neutraliza bloqueadores para a infiltração letal de Valkyra, Imperatriz Pentacromática (92.3% WR, +49.1% Lift)."
      },
      {
        "cardAId": "gold_170_flagelo_cornudo_sol",
        "cardBId": "gold_173_general_roda_sol",
        "coPlayWinRate": 88.5,
        "liftOverBaseline": 45.3,
        "sampleCount": 26,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Flagelo Cornudo da Alvorada + Heliokar, General da Roda Celeste na mesma janela de pressão (88.5% WR, +45.3% Lift)."
      }
    ]
  },
  "deck_dual_abyssal_storm": {
    "deckId": "deck_dual_abyssal_storm",
    "deckName": "Tomo da Tormenta Abissal",
    "archetypeTag": "Pacto Duplo ❄️+💀 • Tempestade & Abismo",
    "generationsTrained": 48,
    "matchesSimulated": 4630,
    "baselineWinRate": 39.7,
    "trainedWinRate": 52.8,
    "weights": {
      "aggroFaceBias": 0.78,
      "tradeValueBias": 1.06,
      "guardianPriority": 0.66,
      "flyingEvasionBias": 1.18,
      "stackConsolidationBias": 0.58,
      "antiAoeSpreadBias": 1.08,
      "spellHoldPatience": 1.41,
      "relicPriority": 1.43,
      "ascensionEagerness": 1.13,
      "bloodPactThresholdHp": 22,
      "domainExpansionEagerness": 1.01,
      "sovPowerTempoBias": 1,
      "synergyHoldBonus": 11,
      "mulliganCurveTarget": 3.41
    },
    "mulliganKeepIds": [
      "purple_81_aberracao_relogio",
      "blue_37_mago_aprendiz",
      "purple_146_coroa_rei_cadaver",
      "blue_10_portal_runas",
      "blue_121_tempestade_mental",
      "neutral_46_pausar_pensar"
    ],
    "channelPriorityIds": [
      "blue_140_vortice_polar",
      "blue_121_tempestade_mental",
      "blue_133_serpente_fenda_marinha",
      "purple_45_dragao_sombras",
      "blue_124_dissipar_essencia"
    ],
    "channelAvoidIds": [
      "blue_173_general_roda_gelo",
      "blue_07_kraken",
      "purple_68_exumar_legiao",
      "blue_63_leviata_primordial",
      "purple_144_retorno_profano",
      "purple_07_lich"
    ],
    "highImpactCardBoosts": {
      "blue_173_general_roda_gelo": 18,
      "blue_07_kraken": 18,
      "purple_68_exumar_legiao": 18,
      "blue_63_leviata_primordial": 18,
      "purple_144_retorno_profano": 18,
      "purple_07_lich": 18,
      "blue_44_dragao_prateado": 16,
      "purple_81_aberracao_relogio": 14
    },
    "synergyPairs": [
      [
        "blue_07_kraken",
        "blue_67_clone_espelhado"
      ],
      [
        "blue_173_general_roda_gelo",
        "blue_67_clone_espelhado"
      ],
      [
        "blue_63_leviata_primordial",
        "purple_68_exumar_legiao"
      ],
      [
        "blue_173_general_roda_gelo",
        "purple_81_aberracao_relogio"
      ],
      [
        "blue_07_kraken",
        "blue_44_dragao_prateado"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "blue_07_kraken",
        "cardBId": "blue_67_clone_espelhado",
        "coPlayWinRate": 93.1,
        "liftOverBaseline": 44.7,
        "sampleCount": 29,
        "synergyNote": "Abertura de corredor tático: Duplicata Ilusória neutraliza bloqueadores para a infiltração letal de Kraken da Fossa Abissal (93.1% WR, +44.7% Lift)."
      },
      {
        "cardAId": "blue_173_general_roda_gelo",
        "cardBId": "blue_67_clone_espelhado",
        "coPlayWinRate": 89.2,
        "liftOverBaseline": 40.8,
        "sampleCount": 37,
        "synergyNote": "Abertura de corredor tático: Duplicata Ilusória neutraliza bloqueadores para a infiltração letal de Cryonax, General da Roda Astral (89.2% WR, +40.8% Lift)."
      },
      {
        "cardAId": "blue_63_leviata_primordial",
        "cardBId": "purple_68_exumar_legiao",
        "coPlayWinRate": 87.2,
        "liftOverBaseline": 38.9,
        "sampleCount": 47,
        "synergyNote": "Abertura de corredor tático: Exumar a Legião Caída neutraliza bloqueadores para a infiltração letal de Thalassia, A Maré Devoradora (87.2% WR, +38.9% Lift)."
      },
      {
        "cardAId": "blue_173_general_roda_gelo",
        "cardBId": "purple_81_aberracao_relogio",
        "coPlayWinRate": 82.5,
        "liftOverBaseline": 34.1,
        "sampleCount": 57,
        "synergyNote": "Astrolábio Vivo do Eclipse (4⚡) trava a Vanguarda enquanto Cryonax, General da Roda Astral (7⚡) opera protegido com +1 ATQ de Cobertura (82.5% WR, +34.1% Lift)."
      },
      {
        "cardAId": "blue_07_kraken",
        "cardBId": "blue_44_dragao_prateado",
        "coPlayWinRate": 92.9,
        "liftOverBaseline": 44.5,
        "sampleCount": 14,
        "synergyNote": "Abertura de corredor tático: Aureon, Dragão da Geada Astral neutraliza bloqueadores para a infiltração letal de Kraken da Fossa Abissal (92.9% WR, +44.5% Lift)."
      }
    ]
  },
  "deck_dual_primal_fury": {
    "deckId": "deck_dual_primal_fury",
    "deckName": "Códice da Ruína Selvagem",
    "archetypeTag": "Pacto Duplo 🔥+🌿 • Chama & Selva",
    "generationsTrained": 48,
    "matchesSimulated": 4654,
    "baselineWinRate": 42.8,
    "trainedWinRate": 65.3,
    "weights": {
      "aggroFaceBias": 1.37,
      "tradeValueBias": 0.98,
      "guardianPriority": 1.45,
      "flyingEvasionBias": 0.92,
      "stackConsolidationBias": 0.93,
      "antiAoeSpreadBias": 1.28,
      "spellHoldPatience": 0.9,
      "relicPriority": 0.74,
      "ascensionEagerness": 1.32,
      "bloodPactThresholdHp": 20,
      "domainExpansionEagerness": 1.12,
      "sovPowerTempoBias": 0.94,
      "synergyHoldBonus": 23,
      "mulliganCurveTarget": 2.74
    },
    "mulliganKeepIds": [
      "green_07_troll",
      "green_74_coelho_branco_arauto",
      "green_05_minotauro",
      "green_01_goblin",
      "green_91_rastreador_feral",
      "green_37_lobo_atroz"
    ],
    "channelPriorityIds": [
      "green_170_flagelo_cornudo_selva",
      "green_108_semente_mundo",
      "green_117_mamute_esmeralda",
      "red_125_armadilha_piroclastica",
      "green_135_serpente_emplumada_selva"
    ],
    "channelAvoidIds": [
      "red_173_general_roda_chama",
      "green_172_armada_draconica_selva",
      "red_08_dragao_vermelho",
      "green_07_troll",
      "red_64_principe_fogo",
      "green_74_coelho_branco_arauto"
    ],
    "highImpactCardBoosts": {
      "red_173_general_roda_chama": 18,
      "green_172_armada_draconica_selva": 18,
      "red_08_dragao_vermelho": 18,
      "green_07_troll": 18,
      "red_64_principe_fogo": 12,
      "green_74_coelho_branco_arauto": 12,
      "green_105_instinto_predador": 12,
      "green_05_minotauro": 12
    },
    "synergyPairs": [
      [
        "green_05_minotauro",
        "green_172_armada_draconica_selva"
      ],
      [
        "green_74_coelho_branco_arauto",
        "red_46_tirano_carmesim"
      ],
      [
        "green_91_rastreador_feral",
        "red_173_general_roda_chama"
      ],
      [
        "red_168_tecelao_feixe_chama",
        "red_173_general_roda_chama"
      ],
      [
        "green_91_rastreador_feral",
        "red_08_dragao_vermelho"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "green_05_minotauro",
        "cardBId": "green_172_armada_draconica_selva",
        "coPlayWinRate": 94.1,
        "liftOverBaseline": 34.7,
        "sampleCount": 17,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Minotauro Quebra-Muros + Enxame Dracônico Ancestral na mesma janela de pressão (94.1% WR, +34.7% Lift)."
      },
      {
        "cardAId": "green_74_coelho_branco_arauto",
        "cardBId": "red_46_tirano_carmesim",
        "coPlayWinRate": 86.1,
        "liftOverBaseline": 26.7,
        "sampleCount": 36,
        "synergyNote": "Motor de aceleração: Lebre Astral do Tempo Perdido antecipa recursos e fôlego para sustentar o impacto de Ignarok, o Devorador de Reinos (86.1% WR, +26.7% Lift)."
      },
      {
        "cardAId": "green_91_rastreador_feral",
        "cardBId": "red_173_general_roda_chama",
        "coPlayWinRate": 85.7,
        "liftOverBaseline": 26.3,
        "sampleCount": 35,
        "synergyNote": "Abertura de corredor tático: Rastreador Feral da Copa neutraliza bloqueadores para a infiltração letal de Pyrrakon, General da Roda Vulcânica (85.7% WR, +26.3% Lift)."
      },
      {
        "cardAId": "red_168_tecelao_feixe_chama",
        "cardBId": "red_173_general_roda_chama",
        "coPlayWinRate": 88,
        "liftOverBaseline": 28.6,
        "sampleCount": 25,
        "synergyNote": "Abertura de corredor tático: Tecelão do Feixe Ígneo neutraliza bloqueadores para a infiltração letal de Pyrrakon, General da Roda Vulcânica (88.0% WR, +28.6% Lift)."
      },
      {
        "cardAId": "green_91_rastreador_feral",
        "cardBId": "red_08_dragao_vermelho",
        "coPlayWinRate": 92.9,
        "liftOverBaseline": 33.4,
        "sampleCount": 14,
        "synergyNote": "Abertura de corredor tático: Rastreador Feral da Copa neutraliza bloqueadores para a infiltração letal de Igniskar, Tirano da Cratera (92.9% WR, +33.4% Lift)."
      }
    ]
  },
  "deck_dual_arcane_forge": {
    "deckId": "deck_dual_arcane_forge",
    "deckName": "Grimório da Forja do Zênite",
    "archetypeTag": "Pacto Duplo ❄️+☀️ • Tempestade & Ordem",
    "generationsTrained": 48,
    "matchesSimulated": 4642,
    "baselineWinRate": 35,
    "trainedWinRate": 51.9,
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
      "bloodPactThresholdHp": 26,
      "domainExpansionEagerness": 1.08,
      "sovPowerTempoBias": 1,
      "synergyHoldBonus": 22,
      "mulliganCurveTarget": 3.2
    },
    "mulliganKeepIds": [
      "blue_164_desvio_dimensional",
      "gold_55_cao_guarda_real",
      "blue_145_bussola_planos",
      "neutral_170_flagelo_cornudo_matriz",
      "gold_30_escudo_solar",
      "neutral_46_pausar_pensar"
    ],
    "channelPriorityIds": [
      "gold_05_automato_guardiao",
      "gold_06_deva",
      "gold_143_bigorna_sol_invicto",
      "blue_121_tempestade_mental",
      "neutral_170_flagelo_cornudo_matriz"
    ],
    "channelAvoidIds": [
      "gold_172_armada_draconica_sol",
      "gold_173_general_roda_sol",
      "blue_136_leviata_cronos",
      "blue_117_arconte_astral",
      "gold_119_soberano_ordem_eterna",
      "gold_33_trono_celestial"
    ],
    "highImpactCardBoosts": {
      "gold_172_armada_draconica_sol": 18,
      "gold_173_general_roda_sol": 18,
      "blue_136_leviata_cronos": 18,
      "blue_117_arconte_astral": 18,
      "gold_119_soberano_ordem_eterna": 18,
      "gold_33_trono_celestial": 18,
      "gold_138_imperador_sol_supremo": 18,
      "gold_71_elmo_brilho": 18
    },
    "synergyPairs": [
      [
        "gold_172_armada_draconica_sol",
        "gold_55_cao_guarda_real"
      ],
      [
        "blue_136_leviata_cronos",
        "gold_172_armada_draconica_sol"
      ],
      [
        "blue_117_arconte_astral",
        "gold_173_general_roda_sol"
      ],
      [
        "gold_173_general_roda_sol",
        "neutral_167_arauto_prisma_matriz"
      ],
      [
        "blue_136_leviata_cronos",
        "neutral_167_arauto_prisma_matriz"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "gold_172_armada_draconica_sol",
        "cardBId": "gold_55_cao_guarda_real",
        "coPlayWinRate": 84.6,
        "liftOverBaseline": 51.7,
        "sampleCount": 52,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Mastim Couraçado da Cidadela + Armada Dracônica do Zênite na mesma janela de pressão (84.6% WR, +51.7% Lift)."
      },
      {
        "cardAId": "blue_136_leviata_cronos",
        "cardBId": "gold_172_armada_draconica_sol",
        "coPlayWinRate": 100,
        "liftOverBaseline": 67.1,
        "sampleCount": 11,
        "synergyNote": "Abertura de corredor tático: Chronoleviatã, Soberano do Tempo neutraliza bloqueadores para a infiltração letal de Armada Dracônica do Zênite (100.0% WR, +67.1% Lift)."
      },
      {
        "cardAId": "blue_117_arconte_astral",
        "cardBId": "gold_173_general_roda_sol",
        "coPlayWinRate": 85.7,
        "liftOverBaseline": 52.8,
        "sampleCount": 14,
        "synergyNote": "Orion, Arconte da Tempestade Astral (7⚡) trava a Vanguarda enquanto Heliokar, General da Roda Celeste (7⚡) opera protegido com +1 ATQ de Cobertura (85.7% WR, +52.8% Lift)."
      },
      {
        "cardAId": "gold_173_general_roda_sol",
        "cardBId": "neutral_167_arauto_prisma_matriz",
        "coPlayWinRate": 82.4,
        "liftOverBaseline": 49.4,
        "sampleCount": 17,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Matriz do Prisma Primordial + Heliokar, General da Roda Celeste na mesma janela de pressão (82.4% WR, +49.4% Lift)."
      },
      {
        "cardAId": "blue_136_leviata_cronos",
        "cardBId": "neutral_167_arauto_prisma_matriz",
        "coPlayWinRate": 80,
        "liftOverBaseline": 47.1,
        "sampleCount": 20,
        "synergyNote": "Abertura de corredor tático: Matriz do Prisma Primordial neutraliza bloqueadores para a infiltração letal de Chronoleviatã, Soberano do Tempo (80.0% WR, +47.1% Lift)."
      }
    ]
  },
  "deck_dual_eternal_rot": {
    "deckId": "deck_dual_eternal_rot",
    "deckName": "Tomo da Podridão Eterna",
    "archetypeTag": "Pacto Duplo 💀+🌿 • Abismo & Selva",
    "generationsTrained": 48,
    "matchesSimulated": 4606,
    "baselineWinRate": 39.1,
    "trainedWinRate": 60.3,
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
      "purple_05_cavaleiro_morte",
      "purple_170_flagelo_cornudo_abismo",
      "purple_11_garra_rastejante",
      "green_74_coelho_branco_arauto",
      "green_35_fosso_vinhas",
      "green_37_lobo_atroz"
    ],
    "channelPriorityIds": [
      "purple_75_vidente_pesadelos",
      "purple_86_enervacao_temporal",
      "purple_09_desintegrar",
      "green_135_serpente_emplumada_selva",
      "green_117_mamute_esmeralda"
    ],
    "channelAvoidIds": [
      "purple_172_armada_draconica_abismo",
      "green_33_behemoth_primordial",
      "purple_173_general_roda_abismo",
      "purple_07_lich",
      "purple_23_dracolich",
      "purple_05_cavaleiro_morte"
    ],
    "highImpactCardBoosts": {
      "purple_172_armada_draconica_abismo": 18,
      "green_33_behemoth_primordial": 18,
      "purple_173_general_roda_abismo": 18,
      "purple_07_lich": 18,
      "purple_23_dracolich": 18,
      "purple_05_cavaleiro_morte": 18,
      "purple_11_garra_rastejante": 13,
      "purple_63_rainha_fungos": 13
    },
    "synergyPairs": [
      [
        "purple_11_garra_rastejante",
        "purple_173_general_roda_abismo"
      ],
      [
        "green_169_pressagio_revoada_selva",
        "purple_173_general_roda_abismo"
      ],
      [
        "purple_05_cavaleiro_morte",
        "purple_172_armada_draconica_abismo"
      ],
      [
        "green_11_sugador_alado",
        "purple_172_armada_draconica_abismo"
      ],
      [
        "purple_05_cavaleiro_morte",
        "purple_07_lich"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "purple_11_garra_rastejante",
        "cardBId": "purple_173_general_roda_abismo",
        "coPlayWinRate": 95.7,
        "liftOverBaseline": 37.4,
        "sampleCount": 46,
        "synergyNote": "Abertura de corredor tático: Garra Decepada Animada neutraliza bloqueadores para a infiltração letal de Nyxaroth, General da Roda Fúnebre (95.7% WR, +37.4% Lift)."
      },
      {
        "cardAId": "green_169_pressagio_revoada_selva",
        "cardBId": "purple_173_general_roda_abismo",
        "coPlayWinRate": 100,
        "liftOverBaseline": 41.7,
        "sampleCount": 24,
        "synergyNote": "Abertura de corredor tático: Presságio da Revoada Espinhosa neutraliza bloqueadores para a infiltração letal de Nyxaroth, General da Roda Fúnebre (100.0% WR, +41.7% Lift)."
      },
      {
        "cardAId": "purple_05_cavaleiro_morte",
        "cardBId": "purple_172_armada_draconica_abismo",
        "coPlayWinRate": 96.8,
        "liftOverBaseline": 38.5,
        "sampleCount": 31,
        "synergyNote": "Abertura de corredor tático: Paladino do Juramento Quebrado neutraliza bloqueadores para a infiltração letal de Legião Dracônica do Eclipse (96.8% WR, +38.5% Lift)."
      },
      {
        "cardAId": "green_11_sugador_alado",
        "cardBId": "purple_172_armada_draconica_abismo",
        "coPlayWinRate": 95.7,
        "liftOverBaseline": 37.4,
        "sampleCount": 23,
        "synergyNote": "Recursão da Cripta: recicla ameaças abatidas entre Mosquito-Vampiro da Selva e Legião Dracônica do Eclipse, esgotando as remoções rivais (95.7% WR, +37.4% Lift)."
      },
      {
        "cardAId": "purple_05_cavaleiro_morte",
        "cardBId": "purple_07_lich",
        "coPlayWinRate": 91.2,
        "liftOverBaseline": 32.9,
        "sampleCount": 34,
        "synergyNote": "Paladino do Juramento Quebrado (4⚡) trava a Vanguarda enquanto Vesperion, Arquimago Lich Imortal (7⚡) opera protegido com +1 ATQ de Cobertura (91.2% WR, +32.9% Lift)."
      }
    ]
  },
  "deck_dual_blood_flame": {
    "deckId": "deck_dual_blood_flame",
    "deckName": "Grimório da Chama Sangrenta",
    "archetypeTag": "Pacto Duplo 🔥+💀 • Chama & Abismo",
    "generationsTrained": 48,
    "matchesSimulated": 4660,
    "baselineWinRate": 40,
    "trainedWinRate": 53.1,
    "weights": {
      "aggroFaceBias": 1.16,
      "tradeValueBias": 0.93,
      "guardianPriority": 0.95,
      "flyingEvasionBias": 0.94,
      "stackConsolidationBias": 0.84,
      "antiAoeSpreadBias": 1.12,
      "spellHoldPatience": 0.98,
      "relicPriority": 1.1,
      "ascensionEagerness": 1.19,
      "bloodPactThresholdHp": 23,
      "domainExpansionEagerness": 1.04,
      "sovPowerTempoBias": 0.99,
      "synergyHoldBonus": 22,
      "mulliganCurveTarget": 2.95
    },
    "mulliganKeepIds": [
      "purple_37_acolito_oculto",
      "red_53_explosao_vingativa",
      "red_38_serpente_fogo",
      "neutral_46_pausar_pensar",
      "purple_11_garra_rastejante",
      "purple_01_esqueleto"
    ],
    "channelPriorityIds": [
      "red_164_armadilha_fissura_magma",
      "red_122_onda_calor_letal",
      "purple_06_tirano_ocular",
      "purple_122_praga_necrotica",
      "red_161_erupcao_piroclastica"
    ],
    "channelAvoidIds": [
      "red_172_armada_draconica_chama",
      "red_82_fenix_taquion",
      "red_173_general_roda_chama",
      "purple_173_general_roda_abismo",
      "red_08_dragao_vermelho",
      "purple_08_lorde_abissal"
    ],
    "highImpactCardBoosts": {
      "red_172_armada_draconica_chama": 18,
      "red_82_fenix_taquion": 18,
      "red_173_general_roda_chama": 18,
      "purple_173_general_roda_abismo": 18,
      "red_08_dragao_vermelho": 18,
      "purple_08_lorde_abissal": 18,
      "purple_50_pacto_proibido": 18,
      "purple_46_noiva_vampira": 17
    },
    "synergyPairs": [
      [
        "red_173_general_roda_chama",
        "red_45_fenix_primordial"
      ],
      [
        "red_173_general_roda_chama",
        "red_82_fenix_taquion"
      ],
      [
        "purple_173_general_roda_abismo",
        "purple_37_acolito_oculto"
      ],
      [
        "red_02_magmin",
        "red_172_armada_draconica_chama"
      ],
      [
        "purple_134_matriarca_noite_eterna",
        "purple_173_general_roda_abismo"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "red_173_general_roda_chama",
        "cardBId": "red_45_fenix_primordial",
        "coPlayWinRate": 96.4,
        "liftOverBaseline": 48.4,
        "sampleCount": 28,
        "synergyNote": "Abertura de corredor tático: Fênix da Coroa Solar neutraliza bloqueadores para a infiltração letal de Pyrrakon, General da Roda Vulcânica (96.4% WR, +48.4% Lift)."
      },
      {
        "cardAId": "red_173_general_roda_chama",
        "cardBId": "red_82_fenix_taquion",
        "coPlayWinRate": 100,
        "liftOverBaseline": 52,
        "sampleCount": 13,
        "synergyNote": "Abertura de corredor tático: Ignis-Aeterna, A Fênix do Tempo Emprestado neutraliza bloqueadores para a infiltração letal de Pyrrakon, General da Roda Vulcânica (100.0% WR, +52.0% Lift)."
      },
      {
        "cardAId": "purple_173_general_roda_abismo",
        "cardBId": "purple_37_acolito_oculto",
        "coPlayWinRate": 87,
        "liftOverBaseline": 38.9,
        "sampleCount": 46,
        "synergyNote": "Abertura de corredor tático: Acólito do Sol Negro neutraliza bloqueadores para a infiltração letal de Nyxaroth, General da Roda Fúnebre (87.0% WR, +38.9% Lift)."
      },
      {
        "cardAId": "red_02_magmin",
        "cardBId": "red_172_armada_draconica_chama",
        "coPlayWinRate": 90.9,
        "liftOverBaseline": 42.9,
        "sampleCount": 22,
        "synergyNote": "Abertura de corredor tático: Diabrete de Escória Vulcânica neutraliza bloqueadores para a infiltração letal de Hoste Dracônica da Cratera (90.9% WR, +42.9% Lift)."
      },
      {
        "cardAId": "purple_134_matriarca_noite_eterna",
        "cardBId": "purple_173_general_roda_abismo",
        "coPlayWinRate": 90.9,
        "liftOverBaseline": 42.9,
        "sampleCount": 22,
        "synergyNote": "Abertura de corredor tático: Matriarca da Noite Eterna neutraliza bloqueadores para a infiltração letal de Nyxaroth, General da Roda Fúnebre (90.9% WR, +42.9% Lift)."
      }
    ]
  },
  "deck_dual_wild_evolution": {
    "deckId": "deck_dual_wild_evolution",
    "deckName": "Códice da Evolução Quimérica",
    "archetypeTag": "Pacto Duplo ❄️+🌿 • Tempestade & Selva",
    "generationsTrained": 48,
    "matchesSimulated": 4672,
    "baselineWinRate": 39.1,
    "trainedWinRate": 55.9,
    "weights": {
      "aggroFaceBias": 0.79,
      "tradeValueBias": 1.07,
      "guardianPriority": 1.4,
      "flyingEvasionBias": 1.18,
      "stackConsolidationBias": 0.74,
      "antiAoeSpreadBias": 1.26,
      "spellHoldPatience": 1.27,
      "relicPriority": 1.27,
      "ascensionEagerness": 1.24,
      "bloodPactThresholdHp": 27,
      "domainExpansionEagerness": 0.97,
      "sovPowerTempoBias": 1.18,
      "synergyHoldBonus": 22,
      "mulliganCurveTarget": 3.78
    },
    "mulliganKeepIds": [
      "blue_37_mago_aprendiz",
      "blue_01_sentinela_ventos",
      "green_146_altar_presas_ancestrais",
      "green_37_lobo_atroz",
      "blue_164_desvio_dimensional",
      "green_11_sugador_alado"
    ],
    "channelPriorityIds": [
      "blue_160_nevasca_soberana",
      "blue_124_dissipar_essencia",
      "blue_140_vortice_polar",
      "green_117_mamute_esmeralda",
      "green_64_mamute_guerra"
    ],
    "channelAvoidIds": [
      "neutral_172_armada_draconica_matriz",
      "neutral_173_general_roda_matriz",
      "blue_07_kraken",
      "green_163_despertar_colosso_floresta",
      "green_146_altar_presas_ancestrais",
      "neutral_11_botas_aladas"
    ],
    "highImpactCardBoosts": {
      "neutral_172_armada_draconica_matriz": 18,
      "neutral_173_general_roda_matriz": 18,
      "blue_07_kraken": 18,
      "green_163_despertar_colosso_floresta": 18,
      "green_146_altar_presas_ancestrais": 18,
      "neutral_11_botas_aladas": 17,
      "green_68_zaratan_ilha": 17,
      "blue_69_escudo_arcano": 16
    },
    "synergyPairs": [
      [
        "blue_07_kraken",
        "blue_69_escudo_arcano"
      ],
      [
        "blue_115_oraculo_mar_profundo",
        "neutral_172_armada_draconica_matriz"
      ],
      [
        "green_30_xama_druida",
        "neutral_172_armada_draconica_matriz"
      ],
      [
        "green_134_anquilossauro_fortaleza",
        "neutral_173_general_roda_matriz"
      ],
      [
        "blue_37_mago_aprendiz",
        "neutral_173_general_roda_matriz"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "blue_07_kraken",
        "cardBId": "blue_69_escudo_arcano",
        "coPlayWinRate": 100,
        "liftOverBaseline": 54,
        "sampleCount": 10,
        "synergyNote": "Abertura de corredor tático: Égide de Abjuração neutraliza bloqueadores para a infiltração letal de Kraken da Fossa Abissal (100.0% WR, +54.0% Lift)."
      },
      {
        "cardAId": "blue_115_oraculo_mar_profundo",
        "cardBId": "neutral_172_armada_draconica_matriz",
        "coPlayWinRate": 90,
        "liftOverBaseline": 44,
        "sampleCount": 20,
        "synergyNote": "Motor de aceleração: Oráculo das Fossas Marinhas antecipa recursos e fôlego para sustentar o impacto de Armada Dracônica do Prisma (90.0% WR, +44.0% Lift)."
      },
      {
        "cardAId": "green_30_xama_druida",
        "cardBId": "neutral_172_armada_draconica_matriz",
        "coPlayWinRate": 83.9,
        "liftOverBaseline": 37.8,
        "sampleCount": 31,
        "synergyNote": "Motor de aceleração: Arquidruida do Círculo Antigo antecipa recursos e fôlego para sustentar o impacto de Armada Dracônica do Prisma (83.9% WR, +37.8% Lift)."
      },
      {
        "cardAId": "green_134_anquilossauro_fortaleza",
        "cardBId": "neutral_173_general_roda_matriz",
        "coPlayWinRate": 86.4,
        "liftOverBaseline": 40.3,
        "sampleCount": 22,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Anquilossauro Fortaleza de Cristal + Vaelkor, General da Roda Prismática na mesma janela de pressão (86.4% WR, +40.3% Lift)."
      },
      {
        "cardAId": "blue_37_mago_aprendiz",
        "cardBId": "neutral_173_general_roda_matriz",
        "coPlayWinRate": 80.9,
        "liftOverBaseline": 34.8,
        "sampleCount": 47,
        "synergyNote": "Iniciado da Torre Astral (1⚡) trava a Vanguarda enquanto Vaelkor, General da Roda Prismática (7⚡) opera protegido com +1 ATQ de Cobertura (80.9% WR, +34.8% Lift)."
      }
    ]
  },
  "deck_dual_solar_wild": {
    "deckId": "deck_dual_solar_wild",
    "deckName": "Escritura da Aurora Silvestre",
    "archetypeTag": "Pacto Duplo 🌿+☀️ • Selva & Ordem",
    "generationsTrained": 48,
    "matchesSimulated": 4612,
    "baselineWinRate": 44.1,
    "trainedWinRate": 58.4,
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
      "green_91_rastreador_feral",
      "gold_91_lanceiro_alvorada",
      "gold_37_escudeiro_solar",
      "gold_170_flagelo_cornudo_sol",
      "green_37_lobo_atroz",
      "green_35_fosso_vinhas"
    ],
    "channelPriorityIds": [
      "gold_169_pressagio_revoada_sol",
      "green_64_mamute_guerra",
      "green_135_serpente_emplumada_selva",
      "green_117_mamute_esmeralda",
      "gold_116_centuriao_forja_dourada"
    ],
    "channelAvoidIds": [
      "gold_172_armada_draconica_sol",
      "gold_173_general_roda_sol",
      "green_121_avatar_gaia",
      "gold_72_talisma_bem",
      "gold_65_emperion_solar",
      "green_105_instinto_predador"
    ],
    "highImpactCardBoosts": {
      "gold_172_armada_draconica_sol": 18,
      "gold_173_general_roda_sol": 18,
      "green_121_avatar_gaia": 18,
      "gold_72_talisma_bem": 16,
      "gold_65_emperion_solar": 16,
      "green_105_instinto_predador": 15,
      "green_91_rastreador_feral": 14,
      "neutral_18_pocao_furia": 14
    },
    "synergyPairs": [
      [
        "gold_173_general_roda_sol",
        "gold_37_escudeiro_solar"
      ],
      [
        "gold_172_armada_draconica_sol",
        "green_91_rastreador_feral"
      ],
      [
        "gold_172_armada_draconica_sol",
        "green_105_instinto_predador"
      ],
      [
        "gold_173_general_roda_sol",
        "green_37_lobo_atroz"
      ],
      [
        "gold_47_dragao_solar",
        "gold_72_talisma_bem"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "gold_173_general_roda_sol",
        "cardBId": "gold_37_escudeiro_solar",
        "coPlayWinRate": 90,
        "liftOverBaseline": 36.8,
        "sampleCount": 40,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Escudeiro da Alvorada + Heliokar, General da Roda Celeste na mesma janela de pressão (90.0% WR, +36.8% Lift)."
      },
      {
        "cardAId": "gold_172_armada_draconica_sol",
        "cardBId": "green_91_rastreador_feral",
        "coPlayWinRate": 90.3,
        "liftOverBaseline": 37.1,
        "sampleCount": 31,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Rastreador Feral da Copa + Armada Dracônica do Zênite na mesma janela de pressão (90.3% WR, +37.1% Lift)."
      },
      {
        "cardAId": "gold_172_armada_draconica_sol",
        "cardBId": "green_105_instinto_predador",
        "coPlayWinRate": 90,
        "liftOverBaseline": 36.8,
        "sampleCount": 30,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Faro do Predador Alfa + Armada Dracônica do Zênite na mesma janela de pressão (90.0% WR, +36.8% Lift)."
      },
      {
        "cardAId": "gold_173_general_roda_sol",
        "cardBId": "green_37_lobo_atroz",
        "coPlayWinRate": 87.9,
        "liftOverBaseline": 34.6,
        "sampleCount": 33,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Lobo Atroz da Espinha Gelada + Heliokar, General da Roda Celeste na mesma janela de pressão (87.9% WR, +34.6% Lift)."
      },
      {
        "cardAId": "gold_47_dragao_solar",
        "cardBId": "gold_72_talisma_bem",
        "coPlayWinRate": 91.7,
        "liftOverBaseline": 38.4,
        "sampleCount": 12,
        "synergyNote": "Talismã do Zênite Puro (5⚡) trava a Vanguarda enquanto Heliodor, Dragão do Sol Nascente (6⚡) opera protegido com +1 ATQ de Cobertura (91.7% WR, +38.4% Lift)."
      }
    ]
  },
  "deck_dual_iron_inquisition": {
    "deckId": "deck_dual_iron_inquisition",
    "deckName": "Tomo da Inquisição Crepuscular",
    "archetypeTag": "Pacto Duplo 💀+☀️ • Abismo & Ordem",
    "generationsTrained": 48,
    "matchesSimulated": 4630,
    "baselineWinRate": 32.8,
    "trainedWinRate": 61.6,
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
      "purple_05_cavaleiro_morte",
      "purple_170_flagelo_cornudo_abismo",
      "purple_133_ceifador_tumular",
      "purple_01_esqueleto",
      "purple_125_ataude_sangue",
      "gold_141_intervencao_angelical"
    ],
    "channelPriorityIds": [
      "gold_12_automato_engrenagem",
      "purple_96_abominacao_costurada",
      "purple_122_praga_necrotica",
      "gold_168_tecelao_feixe_sol",
      "purple_16_fantasma"
    ],
    "channelAvoidIds": [
      "purple_173_general_roda_abismo",
      "purple_65_principe_mortos",
      "gold_72_talisma_bem",
      "purple_119_soberano_entropia",
      "gold_119_soberano_ordem_eterna",
      "gold_167_arauto_prisma_sol"
    ],
    "highImpactCardBoosts": {
      "purple_173_general_roda_abismo": 18,
      "purple_65_principe_mortos": 18,
      "gold_72_talisma_bem": 18,
      "purple_119_soberano_entropia": 18,
      "gold_119_soberano_ordem_eterna": 18,
      "gold_167_arauto_prisma_sol": 18,
      "purple_133_ceifador_tumular": 18,
      "purple_46_noiva_vampira": 18
    },
    "synergyPairs": [
      [
        "purple_65_principe_mortos",
        "purple_89_ampulheta_sangue"
      ],
      [
        "purple_173_general_roda_abismo",
        "purple_65_principe_mortos"
      ],
      [
        "gold_141_intervencao_angelical",
        "purple_119_soberano_entropia"
      ],
      [
        "gold_167_arauto_prisma_sol",
        "purple_173_general_roda_abismo"
      ],
      [
        "gold_87_relogio_bolso_real",
        "purple_119_soberano_entropia"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "purple_65_principe_mortos",
        "cardBId": "purple_89_ampulheta_sangue",
        "coPlayWinRate": 89.7,
        "liftOverBaseline": 41.3,
        "sampleCount": 29,
        "synergyNote": "Abertura de corredor tático: Ampulheta das Mil Mortes neutraliza bloqueadores para a infiltração letal de Malakor-Vael, Soberano da Não-Vida (89.7% WR, +41.3% Lift)."
      },
      {
        "cardAId": "purple_173_general_roda_abismo",
        "cardBId": "purple_65_principe_mortos",
        "coPlayWinRate": 100,
        "liftOverBaseline": 51.6,
        "sampleCount": 12,
        "synergyNote": "Abertura de corredor tático: Malakor-Vael, Soberano da Não-Vida neutraliza bloqueadores para a infiltração letal de Nyxaroth, General da Roda Fúnebre (100.0% WR, +51.6% Lift)."
      },
      {
        "cardAId": "gold_141_intervencao_angelical",
        "cardBId": "purple_119_soberano_entropia",
        "coPlayWinRate": 100,
        "liftOverBaseline": 51.6,
        "sampleCount": 10,
        "synergyNote": "Abertura de corredor tático: Intervenção da Égide Angelical neutraliza bloqueadores para a infiltração letal de Malakor, Imperador da Entropia (100.0% WR, +51.6% Lift)."
      },
      {
        "cardAId": "gold_167_arauto_prisma_sol",
        "cardBId": "purple_173_general_roda_abismo",
        "coPlayWinRate": 100,
        "liftOverBaseline": 51.6,
        "sampleCount": 10,
        "synergyNote": "Abertura de corredor tático: Arauto do Zênite Prismático neutraliza bloqueadores para a infiltração letal de Nyxaroth, General da Roda Fúnebre (100.0% WR, +51.6% Lift)."
      },
      {
        "cardAId": "gold_87_relogio_bolso_real",
        "cardBId": "purple_119_soberano_entropia",
        "coPlayWinRate": 87.5,
        "liftOverBaseline": 39.1,
        "sampleCount": 24,
        "synergyNote": "Abertura de corredor tático: Cronômetro Dourado de Bolso neutraliza bloqueadores para a infiltração letal de Malakor, Imperador da Entropia (87.5% WR, +39.1% Lift)."
      }
    ]
  },
  "deck_dual_storm_dragon": {
    "deckId": "deck_dual_storm_dragon",
    "deckName": "Grimório do Fogo Astral",
    "archetypeTag": "Pacto Duplo 🔥+❄️ • Chama & Tempestade",
    "generationsTrained": 48,
    "matchesSimulated": 4618,
    "baselineWinRate": 50,
    "trainedWinRate": 49.4,
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
      "blue_37_mago_aprendiz",
      "neutral_46_pausar_pensar",
      "red_01_kobold",
      "red_164_armadilha_fissura_magma",
      "red_145_emboscada_geiser",
      "blue_164_desvio_dimensional"
    ],
    "channelPriorityIds": [
      "red_164_armadilha_fissura_magma",
      "red_125_armadilha_piroclastica",
      "blue_115_oraculo_mar_profundo",
      "blue_43_arconte_tempestade",
      "blue_152_arquimago_vortice"
    ],
    "channelAvoidIds": [
      "blue_07_kraken",
      "red_119_soberano_piroclasma",
      "blue_172_armada_draconica_gelo",
      "red_82_fenix_taquion",
      "red_08_dragao_vermelho",
      "blue_173_general_roda_gelo"
    ],
    "highImpactCardBoosts": {
      "blue_07_kraken": 18,
      "red_119_soberano_piroclasma": 18,
      "blue_172_armada_draconica_gelo": 18,
      "red_82_fenix_taquion": 18,
      "red_08_dragao_vermelho": 18,
      "blue_173_general_roda_gelo": 18,
      "red_102_sangue_incandescente": 18,
      "blue_72_incensario_ventos": 18
    },
    "synergyPairs": [
      [
        "blue_07_kraken",
        "red_30_furia_sangue"
      ],
      [
        "blue_07_kraken",
        "red_117_arauto_erupcao"
      ],
      [
        "blue_37_mago_aprendiz",
        "red_119_soberano_piroclasma"
      ],
      [
        "blue_30_visao_ancestral",
        "red_119_soberano_piroclasma"
      ],
      [
        "red_08_dragao_vermelho",
        "red_82_fenix_taquion"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "blue_07_kraken",
        "cardBId": "red_30_furia_sangue",
        "coPlayWinRate": 90,
        "liftOverBaseline": 40.9,
        "sampleCount": 30,
        "synergyNote": "Abertura de corredor tático: Fúria de Sangue Vulcânico neutraliza bloqueadores para a infiltração letal de Kraken da Fossa Abissal (90.0% WR, +40.9% Lift)."
      },
      {
        "cardAId": "blue_07_kraken",
        "cardBId": "red_117_arauto_erupcao",
        "coPlayWinRate": 91.7,
        "liftOverBaseline": 42.6,
        "sampleCount": 24,
        "synergyNote": "Abertura de corredor tático: Arauto Demoníaco da Erupção neutraliza bloqueadores para a infiltração letal de Kraken da Fossa Abissal (91.7% WR, +42.6% Lift)."
      },
      {
        "cardAId": "blue_37_mago_aprendiz",
        "cardBId": "red_119_soberano_piroclasma",
        "coPlayWinRate": 86,
        "liftOverBaseline": 36.9,
        "sampleCount": 50,
        "synergyNote": "Abertura de corredor tático: Iniciado da Torre Astral neutraliza bloqueadores para a infiltração letal de Pyroclasmos, Imperador das Chamas (86.0% WR, +36.9% Lift)."
      },
      {
        "cardAId": "blue_30_visao_ancestral",
        "cardBId": "red_119_soberano_piroclasma",
        "coPlayWinRate": 88.5,
        "liftOverBaseline": 39.4,
        "sampleCount": 26,
        "synergyNote": "Abertura de corredor tático: Visão do Oráculo Astral neutraliza bloqueadores para a infiltração letal de Pyroclasmos, Imperador das Chamas (88.5% WR, +39.4% Lift)."
      },
      {
        "cardAId": "red_08_dragao_vermelho",
        "cardBId": "red_82_fenix_taquion",
        "coPlayWinRate": 100,
        "liftOverBaseline": 50.9,
        "sampleCount": 9,
        "synergyNote": "Abertura de corredor tático: Ignis-Aeterna, A Fênix do Tempo Emprestado neutraliza bloqueadores para a infiltração letal de Igniskar, Tirano da Cratera (100.0% WR, +50.9% Lift)."
      }
    ]
  },
  "deck_tri_arcane_cataclysm": {
    "deckId": "deck_tri_arcane_cataclysm",
    "deckName": "Grimório do Cataclismo Arcano",
    "archetypeTag": "Pacto Triplo ❄️+🔥+💀 • Tempestade, Chama & Abismo",
    "generationsTrained": 48,
    "matchesSimulated": 14670,
    "baselineWinRate": 39.7,
    "trainedWinRate": 48.4,
    "weights": {
      "aggroFaceBias": 1.28,
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
      "mulliganCurveTarget": 2.8
    },
    "mulliganKeepIds": [
      "neutral_46_pausar_pensar",
      "red_72_caldeirao_magma",
      "blue_01_sentinela_ventos",
      "red_01_kobold",
      "red_145_emboscada_geiser",
      "purple_89_ampulheta_sangue"
    ],
    "channelPriorityIds": [
      "red_125_armadilha_piroclastica",
      "red_116_hidra_vulcanica",
      "red_33_supernova_vulcanica",
      "red_164_armadilha_fissura_magma",
      "blue_121_tempestade_mental"
    ],
    "channelAvoidIds": [
      "blue_173_general_roda_gelo",
      "blue_07_kraken",
      "neutral_173_general_roda_matriz",
      "purple_23_dracolich",
      "purple_50_pacto_proibido",
      "purple_68_exumar_legiao"
    ],
    "highImpactCardBoosts": {
      "blue_173_general_roda_gelo": 18,
      "blue_07_kraken": 18,
      "neutral_173_general_roda_matriz": 18,
      "purple_23_dracolich": 18,
      "purple_50_pacto_proibido": 18,
      "purple_68_exumar_legiao": 18,
      "red_102_sangue_incandescente": 17,
      "red_137_dragao_cometa_rubro": 16
    },
    "synergyPairs": [
      [
        "blue_07_kraken",
        "red_30_furia_sangue"
      ],
      [
        "blue_173_general_roda_gelo",
        "red_146_coroa_chama_eterna"
      ],
      [
        "blue_173_general_roda_gelo",
        "purple_89_ampulheta_sangue"
      ],
      [
        "blue_07_kraken",
        "purple_46_noiva_vampira"
      ],
      [
        "neutral_173_general_roda_matriz",
        "red_137_dragao_cometa_rubro"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "blue_07_kraken",
        "cardBId": "red_30_furia_sangue",
        "coPlayWinRate": 100,
        "liftOverBaseline": 60.5,
        "sampleCount": 13,
        "synergyNote": "Abertura de corredor tático: Fúria de Sangue Vulcânico neutraliza bloqueadores para a infiltração letal de Kraken da Fossa Abissal (100.0% WR, +60.5% Lift)."
      },
      {
        "cardAId": "blue_173_general_roda_gelo",
        "cardBId": "red_146_coroa_chama_eterna",
        "coPlayWinRate": 100,
        "liftOverBaseline": 60.5,
        "sampleCount": 11,
        "synergyNote": "Coroa da Caldeira Eterna (4⚡) trava a Vanguarda enquanto Cryonax, General da Roda Astral (7⚡) opera protegido com +1 ATQ de Cobertura (100.0% WR, +60.5% Lift)."
      },
      {
        "cardAId": "blue_173_general_roda_gelo",
        "cardBId": "purple_89_ampulheta_sangue",
        "coPlayWinRate": 80,
        "liftOverBaseline": 40.5,
        "sampleCount": 50,
        "synergyNote": "Ampulheta das Mil Mortes (2⚡) trava a Vanguarda enquanto Cryonax, General da Roda Astral (7⚡) opera protegido com +1 ATQ de Cobertura (80.0% WR, +40.5% Lift)."
      },
      {
        "cardAId": "blue_07_kraken",
        "cardBId": "purple_46_noiva_vampira",
        "coPlayWinRate": 100,
        "liftOverBaseline": 60.5,
        "sampleCount": 8,
        "synergyNote": "Abertura de corredor tático: Carmilla, Condessa de Sangue e Ouro neutraliza bloqueadores para a infiltração letal de Kraken da Fossa Abissal (100.0% WR, +60.5% Lift)."
      },
      {
        "cardAId": "neutral_173_general_roda_matriz",
        "cardBId": "red_137_dragao_cometa_rubro",
        "coPlayWinRate": 81.5,
        "liftOverBaseline": 41.9,
        "sampleCount": 27,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Dragão do Cometa Carmesim + Vaelkor, General da Roda Prismática na mesma janela de pressão (81.5% WR, +41.9% Lift)."
      }
    ]
  },
  "deck_tri_primal_titans": {
    "deckId": "deck_tri_primal_titans",
    "deckName": "Códice dos Titãs Primordiais",
    "archetypeTag": "Pacto Triplo 🌿+🔥+☀️ • Selva, Chama & Ordem",
    "generationsTrained": 48,
    "matchesSimulated": 4672,
    "baselineWinRate": 45.9,
    "trainedWinRate": 64.1,
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
      "green_91_rastreador_feral",
      "green_37_lobo_atroz",
      "red_62_colosso_obsidiana",
      "gold_11_homunculo",
      "green_01_goblin",
      "green_74_coelho_branco_arauto"
    ],
    "channelPriorityIds": [
      "green_135_serpente_emplumada_selva",
      "green_64_mamute_guerra",
      "green_144_bencao_arvore_mundo",
      "red_145_emboscada_geiser",
      "red_168_tecelao_feixe_chama"
    ],
    "channelAvoidIds": [
      "red_119_soberano_piroclasma",
      "green_37_lobo_atroz",
      "green_172_armada_draconica_selva",
      "green_91_rastreador_feral",
      "red_62_colosso_obsidiana",
      "green_67_tiranossauro_alfa"
    ],
    "highImpactCardBoosts": {
      "red_119_soberano_piroclasma": 18,
      "green_37_lobo_atroz": 15,
      "green_172_armada_draconica_selva": 13,
      "green_91_rastreador_feral": 13,
      "red_62_colosso_obsidiana": 11,
      "green_67_tiranossauro_alfa": 10,
      "green_74_coelho_branco_arauto": 10,
      "green_01_goblin": 10
    },
    "synergyPairs": [
      [
        "red_119_soberano_piroclasma",
        "red_62_colosso_obsidiana"
      ],
      [
        "green_117_mamute_esmeralda",
        "red_119_soberano_piroclasma"
      ],
      [
        "green_170_flagelo_cornudo_selva",
        "green_172_armada_draconica_selva"
      ],
      [
        "red_65_dragao_magma_anciao",
        "red_91_batedor_salamandra"
      ],
      [
        "gold_116_centuriao_forja_dourada",
        "green_01_goblin"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "red_119_soberano_piroclasma",
        "cardBId": "red_62_colosso_obsidiana",
        "coPlayWinRate": 86.2,
        "liftOverBaseline": 24.5,
        "sampleCount": 29,
        "synergyNote": "Abertura de corredor tático: Destruidor de Obsidiana Fundida neutraliza bloqueadores para a infiltração letal de Pyroclasmos, Imperador das Chamas (86.2% WR, +24.5% Lift)."
      },
      {
        "cardAId": "green_117_mamute_esmeralda",
        "cardBId": "red_119_soberano_piroclasma",
        "coPlayWinRate": 92.3,
        "liftOverBaseline": 30.6,
        "sampleCount": 13,
        "synergyNote": "Abertura de corredor tático: Mamute de Presas Esmeralda neutraliza bloqueadores para a infiltração letal de Pyroclasmos, Imperador das Chamas (92.3% WR, +30.6% Lift)."
      },
      {
        "cardAId": "green_170_flagelo_cornudo_selva",
        "cardBId": "green_172_armada_draconica_selva",
        "coPlayWinRate": 100,
        "liftOverBaseline": 38.3,
        "sampleCount": 7,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Flagelo Cornudo da Mata + Enxame Dracônico Ancestral na mesma janela de pressão (100.0% WR, +38.3% Lift)."
      },
      {
        "cardAId": "red_65_dragao_magma_anciao",
        "cardBId": "red_91_batedor_salamandra",
        "coPlayWinRate": 87.5,
        "liftOverBaseline": 25.8,
        "sampleCount": 16,
        "synergyNote": "Sinergia empírica de alta conversão: curvar Batedor Salamandra das Fendas (1⚡) rumo a Magmarok, o Tirano Piroclástico (7⚡) eleva o domínio de mesa (87.5% WR, +25.8% Lift)."
      },
      {
        "cardAId": "gold_116_centuriao_forja_dourada",
        "cardBId": "green_01_goblin",
        "coPlayWinRate": 80,
        "liftOverBaseline": 18.3,
        "sampleCount": 115,
        "synergyNote": "Abertura de corredor tático: Emboscador Goblin da Mata neutraliza bloqueadores para a infiltração letal de Centurião da Forja Dourada (80.0% WR, +18.3% Lift)."
      }
    ]
  },
  "deck_tri_eternal_reliquary": {
    "deckId": "deck_tri_eternal_reliquary",
    "deckName": "Relicário do Trono Eterno",
    "archetypeTag": "Pacto Triplo ☀️+❄️+💀 • Ordem, Tempestade & Abismo",
    "generationsTrained": 48,
    "matchesSimulated": 4630,
    "baselineWinRate": 26.6,
    "trainedWinRate": 59.7,
    "weights": {
      "aggroFaceBias": 0.74,
      "tradeValueBias": 0.93,
      "guardianPriority": 0.99,
      "flyingEvasionBias": 1.21,
      "stackConsolidationBias": 1.54,
      "antiAoeSpreadBias": 1.06,
      "spellHoldPatience": 1.34,
      "relicPriority": 1.33,
      "ascensionEagerness": 1.27,
      "bloodPactThresholdHp": 24,
      "domainExpansionEagerness": 0.81,
      "sovPowerTempoBias": 1.25,
      "synergyHoldBonus": 33,
      "mulliganCurveTarget": 3.58
    },
    "mulliganKeepIds": [
      "blue_89_roda_tempo",
      "blue_01_sentinela_ventos",
      "purple_125_ataude_sangue",
      "purple_145_orgao_catedrais_negras",
      "blue_13_lanceiro_mares",
      "gold_29_martelo_trovao"
    ],
    "channelPriorityIds": [
      "purple_122_praga_necrotica",
      "blue_121_tempestade_mental",
      "gold_05_automato_guardiao",
      "blue_124_dissipar_essencia",
      "purple_125_ataude_sangue"
    ],
    "channelAvoidIds": [
      "gold_173_general_roda_sol",
      "purple_65_principe_mortos",
      "gold_167_arauto_prisma_sol",
      "neutral_173_general_roda_matriz",
      "purple_46_noiva_vampira",
      "gold_65_emperion_solar"
    ],
    "highImpactCardBoosts": {
      "gold_173_general_roda_sol": 18,
      "purple_65_principe_mortos": 18,
      "gold_167_arauto_prisma_sol": 18,
      "neutral_173_general_roda_matriz": 18,
      "purple_46_noiva_vampira": 18,
      "gold_65_emperion_solar": 18,
      "blue_135_dragao_glaciar_eterno": 18,
      "purple_144_retorno_profano": 18
    },
    "synergyPairs": [
      [
        "gold_72_talisma_bem",
        "purple_65_principe_mortos"
      ],
      [
        "purple_118_serafim_caido",
        "purple_46_noiva_vampira"
      ],
      [
        "gold_167_arauto_prisma_sol",
        "purple_65_principe_mortos"
      ],
      [
        "neutral_173_general_roda_matriz",
        "purple_89_ampulheta_sangue"
      ],
      [
        "gold_167_arauto_prisma_sol",
        "gold_72_talisma_bem"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "gold_72_talisma_bem",
        "cardBId": "purple_65_principe_mortos",
        "coPlayWinRate": 95,
        "liftOverBaseline": 46.5,
        "sampleCount": 20,
        "synergyNote": "Abertura de corredor tático: Talismã do Zênite Puro neutraliza bloqueadores para a infiltração letal de Malakor-Vael, Soberano da Não-Vida (95.0% WR, +46.5% Lift)."
      },
      {
        "cardAId": "purple_118_serafim_caido",
        "cardBId": "purple_46_noiva_vampira",
        "coPlayWinRate": 90.9,
        "liftOverBaseline": 42.4,
        "sampleCount": 22,
        "synergyNote": "Sinergia empírica de alta conversão: curvar Serafim Caído do Vazio (6⚡) rumo a Carmilla, Condessa de Sangue e Ouro (6⚡) eleva o domínio de mesa (90.9% WR, +42.4% Lift)."
      },
      {
        "cardAId": "gold_167_arauto_prisma_sol",
        "cardBId": "purple_65_principe_mortos",
        "coPlayWinRate": 88,
        "liftOverBaseline": 39.5,
        "sampleCount": 25,
        "synergyNote": "Abertura de corredor tático: Arauto do Zênite Prismático neutraliza bloqueadores para a infiltração letal de Malakor-Vael, Soberano da Não-Vida (88.0% WR, +39.5% Lift)."
      },
      {
        "cardAId": "neutral_173_general_roda_matriz",
        "cardBId": "purple_89_ampulheta_sangue",
        "coPlayWinRate": 82.8,
        "liftOverBaseline": 34.2,
        "sampleCount": 58,
        "synergyNote": "Ampulheta das Mil Mortes (2⚡) trava a Vanguarda enquanto Vaelkor, General da Roda Prismática (7⚡) opera protegido com +1 ATQ de Cobertura (82.8% WR, +34.2% Lift)."
      },
      {
        "cardAId": "gold_167_arauto_prisma_sol",
        "cardBId": "gold_72_talisma_bem",
        "coPlayWinRate": 92.9,
        "liftOverBaseline": 44.3,
        "sampleCount": 14,
        "synergyNote": "Talismã do Zênite Puro (5⚡) trava a Vanguarda enquanto Arauto do Zênite Prismático (6⚡) opera protegido com +1 ATQ de Cobertura (92.9% WR, +44.3% Lift)."
      }
    ]
  },
  "deck_tri_blood_moon": {
    "deckId": "deck_tri_blood_moon",
    "deckName": "Tomo da Lua Sangrenta",
    "archetypeTag": "Pacto Triplo 💀+🌿+🔥 • Abismo, Selva & Chama",
    "generationsTrained": 48,
    "matchesSimulated": 4636,
    "baselineWinRate": 52.2,
    "trainedWinRate": 65.9,
    "weights": {
      "aggroFaceBias": 1.28,
      "tradeValueBias": 1.02,
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
      "mulliganCurveTarget": 2.8
    },
    "mulliganKeepIds": [
      "green_37_lobo_atroz",
      "purple_170_flagelo_cornudo_abismo",
      "purple_55_rastejador_cripta",
      "purple_11_garra_rastejante",
      "purple_01_esqueleto",
      "purple_37_acolito_oculto"
    ],
    "channelPriorityIds": [
      "green_117_mamute_esmeralda",
      "purple_116_devorador_mentes",
      "green_116_ent_espinheiro_anciao",
      "red_116_hidra_vulcanica",
      "red_145_emboscada_geiser"
    ],
    "channelAvoidIds": [
      "purple_172_armada_draconica_abismo",
      "purple_46_noiva_vampira",
      "purple_173_general_roda_abismo",
      "green_49_dragao_esmeralda",
      "green_37_lobo_atroz",
      "purple_170_flagelo_cornudo_abismo"
    ],
    "highImpactCardBoosts": {
      "purple_172_armada_draconica_abismo": 18,
      "purple_46_noiva_vampira": 18,
      "purple_173_general_roda_abismo": 17,
      "green_49_dragao_esmeralda": 16,
      "green_37_lobo_atroz": 14,
      "purple_170_flagelo_cornudo_abismo": 12,
      "purple_65_principe_mortos": 12,
      "purple_11_garra_rastejante": 11
    },
    "synergyPairs": [
      [
        "purple_173_general_roda_abismo",
        "red_102_sangue_incandescente"
      ],
      [
        "purple_170_flagelo_cornudo_abismo",
        "purple_172_armada_draconica_abismo"
      ],
      [
        "green_01_goblin",
        "purple_173_general_roda_abismo"
      ],
      [
        "green_37_lobo_atroz",
        "purple_172_armada_draconica_abismo"
      ],
      [
        "purple_170_flagelo_cornudo_abismo",
        "purple_46_noiva_vampira"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "purple_173_general_roda_abismo",
        "cardBId": "red_102_sangue_incandescente",
        "coPlayWinRate": 94.7,
        "liftOverBaseline": 28.2,
        "sampleCount": 38,
        "synergyNote": "Abertura de corredor tático: Fervor do Sangue Incandescente neutraliza bloqueadores para a infiltração letal de Nyxaroth, General da Roda Fúnebre (94.7% WR, +28.2% Lift)."
      },
      {
        "cardAId": "purple_170_flagelo_cornudo_abismo",
        "cardBId": "purple_172_armada_draconica_abismo",
        "coPlayWinRate": 95.7,
        "liftOverBaseline": 29.1,
        "sampleCount": 23,
        "synergyNote": "Recursão da Cripta: recicla ameaças abatidas entre Flagelo Cornudo do Abismo e Legião Dracônica do Eclipse, esgotando as remoções rivais (95.7% WR, +29.1% Lift)."
      },
      {
        "cardAId": "green_01_goblin",
        "cardBId": "purple_173_general_roda_abismo",
        "coPlayWinRate": 91.7,
        "liftOverBaseline": 25.1,
        "sampleCount": 36,
        "synergyNote": "Abertura de corredor tático: Emboscador Goblin da Mata neutraliza bloqueadores para a infiltração letal de Nyxaroth, General da Roda Fúnebre (91.7% WR, +25.1% Lift)."
      },
      {
        "cardAId": "green_37_lobo_atroz",
        "cardBId": "purple_172_armada_draconica_abismo",
        "coPlayWinRate": 92.9,
        "liftOverBaseline": 26.3,
        "sampleCount": 28,
        "synergyNote": "Recursão da Cripta: recicla ameaças abatidas entre Lobo Atroz da Espinha Gelada e Legião Dracônica do Eclipse, esgotando as remoções rivais (92.9% WR, +26.3% Lift)."
      },
      {
        "cardAId": "purple_170_flagelo_cornudo_abismo",
        "cardBId": "purple_46_noiva_vampira",
        "coPlayWinRate": 87.5,
        "liftOverBaseline": 20.9,
        "sampleCount": 48,
        "synergyNote": "Sinergia empírica de alta conversão: curvar Flagelo Cornudo do Abismo (3⚡) rumo a Carmilla, Condessa de Sangue e Ouro (6⚡) eleva o domínio de mesa (87.5% WR, +20.9% Lift)."
      }
    ]
  },
  "deck_tri_celestial_scales": {
    "deckId": "deck_tri_celestial_scales",
    "deckName": "Escritura das Escamas Celestiais",
    "archetypeTag": "Pacto Triplo ☀️+🌿+❄️ • Ordem, Selva & Tempestade",
    "generationsTrained": 48,
    "matchesSimulated": 4648,
    "baselineWinRate": 40.6,
    "trainedWinRate": 61.9,
    "weights": {
      "aggroFaceBias": 1.05,
      "tradeValueBias": 1.16,
      "guardianPriority": 1.35,
      "flyingEvasionBias": 1.14,
      "stackConsolidationBias": 0.97,
      "antiAoeSpreadBias": 1.25,
      "spellHoldPatience": 1.06,
      "relicPriority": 1,
      "ascensionEagerness": 1.14,
      "bloodPactThresholdHp": 23,
      "domainExpansionEagerness": 1,
      "sovPowerTempoBias": 0.95,
      "synergyHoldBonus": 24,
      "mulliganCurveTarget": 2.89
    },
    "mulliganKeepIds": [
      "green_37_lobo_atroz",
      "blue_37_mago_aprendiz",
      "blue_170_flagelo_cornudo_gelo",
      "gold_37_escudeiro_solar",
      "blue_01_sentinela_ventos",
      "green_52_estouro_manada"
    ],
    "channelPriorityIds": [
      "green_144_bencao_arvore_mundo",
      "blue_115_oraculo_mar_profundo",
      "green_46_ent_anciao",
      "blue_164_desvio_dimensional",
      "green_117_mamute_esmeralda"
    ],
    "channelAvoidIds": [
      "blue_172_armada_draconica_gelo",
      "gold_173_general_roda_sol",
      "blue_63_leviata_primordial",
      "gold_65_emperion_solar",
      "gold_72_talisma_bem",
      "blue_117_arconte_astral"
    ],
    "highImpactCardBoosts": {
      "blue_172_armada_draconica_gelo": 18,
      "gold_173_general_roda_sol": 18,
      "blue_63_leviata_primordial": 18,
      "gold_65_emperion_solar": 16,
      "gold_72_talisma_bem": 16,
      "blue_117_arconte_astral": 15,
      "gold_20_androesfinge": 14,
      "green_54_totem_ancestral": 13
    },
    "synergyPairs": [
      [
        "blue_170_flagelo_cornudo_gelo",
        "blue_172_armada_draconica_gelo"
      ],
      [
        "blue_13_lanceiro_mares",
        "blue_172_armada_draconica_gelo"
      ],
      [
        "blue_63_leviata_primordial",
        "green_01_goblin"
      ],
      [
        "blue_117_arconte_astral",
        "green_01_goblin"
      ],
      [
        "gold_141_intervencao_angelical",
        "gold_173_general_roda_sol"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "blue_170_flagelo_cornudo_gelo",
        "cardBId": "blue_172_armada_draconica_gelo",
        "coPlayWinRate": 91.9,
        "liftOverBaseline": 36.7,
        "sampleCount": 37,
        "synergyNote": "Flagelo Cornudo da Geada (3⚡) trava a Vanguarda enquanto Esquadra Dracônica da Nevasca (8⚡) opera protegido com +1 ATQ de Cobertura (91.9% WR, +36.7% Lift)."
      },
      {
        "cardAId": "blue_13_lanceiro_mares",
        "cardBId": "blue_172_armada_draconica_gelo",
        "coPlayWinRate": 92.6,
        "liftOverBaseline": 37.4,
        "sampleCount": 27,
        "synergyNote": "Tritão Guardião dos Recifes (1⚡) trava a Vanguarda enquanto Esquadra Dracônica da Nevasca (8⚡) opera protegido com +1 ATQ de Cobertura (92.6% WR, +37.4% Lift)."
      },
      {
        "cardAId": "blue_63_leviata_primordial",
        "cardBId": "green_01_goblin",
        "coPlayWinRate": 89.3,
        "liftOverBaseline": 34.1,
        "sampleCount": 28,
        "synergyNote": "Abertura de corredor tático: Emboscador Goblin da Mata neutraliza bloqueadores para a infiltração letal de Thalassia, A Maré Devoradora (89.3% WR, +34.1% Lift)."
      },
      {
        "cardAId": "blue_117_arconte_astral",
        "cardBId": "green_01_goblin",
        "coPlayWinRate": 87.5,
        "liftOverBaseline": 32.3,
        "sampleCount": 32,
        "synergyNote": "Abertura de corredor tático: Emboscador Goblin da Mata neutraliza bloqueadores para a infiltração letal de Orion, Arconte da Tempestade Astral (87.5% WR, +32.3% Lift)."
      },
      {
        "cardAId": "gold_141_intervencao_angelical",
        "cardBId": "gold_173_general_roda_sol",
        "coPlayWinRate": 100,
        "liftOverBaseline": 44.8,
        "sampleCount": 9,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Intervenção da Égide Angelical + Heliokar, General da Roda Celeste na mesma janela de pressão (100.0% WR, +44.8% Lift)."
      }
    ]
  },
  "deck_spec_chronomancer": {
    "deckId": "deck_spec_chronomancer",
    "deckName": "Códice da Ampulheta Infinita",
    "archetypeTag": "Arquétipo Especial ⏳ • Ordem Cronomante",
    "generationsTrained": 48,
    "matchesSimulated": 4630,
    "baselineWinRate": 39.1,
    "trainedWinRate": 54.7,
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
      "blue_79_semblante_atemporal",
      "blue_168_tecelao_feixe_gelo",
      "gold_80_paladino_destino",
      "blue_13_lanceiro_mares",
      "gold_141_intervencao_angelical",
      "blue_159_paradoxo_ampulheta"
    ],
    "channelPriorityIds": [
      "blue_160_nevasca_soberana",
      "blue_134_arquimago_singularidade",
      "gold_12_automato_engrenagem",
      "blue_121_tempestade_mental",
      "blue_168_tecelao_feixe_gelo"
    ],
    "channelAvoidIds": [
      "neutral_173_general_roda_matriz",
      "blue_173_general_roda_gelo",
      "gold_90_trono_horas",
      "blue_80_senhor_tempo",
      "blue_79_semblante_atemporal",
      "blue_117_arconte_astral"
    ],
    "highImpactCardBoosts": {
      "neutral_173_general_roda_matriz": 18,
      "blue_173_general_roda_gelo": 18,
      "gold_90_trono_horas": 18,
      "blue_80_senhor_tempo": 18,
      "blue_79_semblante_atemporal": 18,
      "blue_117_arconte_astral": 18,
      "blue_44_dragao_prateado": 18,
      "blue_98_soberano_mares": 18
    },
    "synergyPairs": [
      [
        "blue_79_semblante_atemporal",
        "neutral_173_general_roda_matriz"
      ],
      [
        "blue_117_arconte_astral",
        "gold_70_maca_ruptura"
      ],
      [
        "gold_116_centuriao_forja_dourada",
        "gold_90_trono_horas"
      ],
      [
        "blue_98_soberano_mares",
        "gold_115_leao_celestial_rei"
      ],
      [
        "blue_146_trono_inverno_eterno",
        "gold_70_maca_ruptura"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "blue_79_semblante_atemporal",
        "cardBId": "neutral_173_general_roda_matriz",
        "coPlayWinRate": 81.6,
        "liftOverBaseline": 43.7,
        "sampleCount": 49,
        "synergyNote": "Miragem do Relógio Astral (4⚡) trava a Vanguarda enquanto Vaelkor, General da Roda Prismática (7⚡) opera protegido com +1 ATQ de Cobertura (81.6% WR, +43.7% Lift)."
      },
      {
        "cardAId": "blue_117_arconte_astral",
        "cardBId": "gold_70_maca_ruptura",
        "coPlayWinRate": 86.4,
        "liftOverBaseline": 48.4,
        "sampleCount": 22,
        "synergyNote": "Abertura de corredor tático: Maça Solar da Ruptura neutraliza bloqueadores para a infiltração letal de Orion, Arconte da Tempestade Astral (86.4% WR, +48.4% Lift)."
      },
      {
        "cardAId": "gold_116_centuriao_forja_dourada",
        "cardBId": "gold_90_trono_horas",
        "coPlayWinRate": 90.9,
        "liftOverBaseline": 52.9,
        "sampleCount": 11,
        "synergyNote": "Centurião da Forja Dourada (5⚡) trava a Vanguarda enquanto Santuário do Relógio da Eternidade (5⚡) opera protegido com +1 ATQ de Cobertura (90.9% WR, +52.9% Lift)."
      },
      {
        "cardAId": "blue_98_soberano_mares",
        "cardBId": "gold_115_leao_celestial_rei",
        "coPlayWinRate": 75,
        "liftOverBaseline": 37,
        "sampleCount": 44,
        "synergyNote": "Leão-Rei Celestial (5⚡) trava a Vanguarda enquanto Aegirion, Soberano das Fendas Abissais (7⚡) opera protegido com +1 ATQ de Cobertura (75.0% WR, +37.0% Lift)."
      },
      {
        "cardAId": "blue_146_trono_inverno_eterno",
        "cardBId": "gold_70_maca_ruptura",
        "coPlayWinRate": 90,
        "liftOverBaseline": 52,
        "sampleCount": 10,
        "synergyNote": "Motor de aceleração: Maça Solar da Ruptura antecipa recursos e fôlego para sustentar o impacto de Trono do Inverno Eterno (90.0% WR, +52.0% Lift)."
      }
    ]
  },
  "deck_spec_pentachromatic": {
    "deckId": "deck_spec_pentachromatic",
    "deckName": "Tomo do Dragão Prismático",
    "archetypeTag": "Pacto Pentacromático 🐉 • Cinco Domínios",
    "generationsTrained": 48,
    "matchesSimulated": 4600,
    "baselineWinRate": 50.3,
    "trainedWinRate": 57.2,
    "weights": {
      "aggroFaceBias": 1.1,
      "tradeValueBias": 0.89,
      "guardianPriority": 0.93,
      "flyingEvasionBias": 1,
      "stackConsolidationBias": 1,
      "antiAoeSpreadBias": 0.91,
      "spellHoldPatience": 0.86,
      "relicPriority": 1.01,
      "ascensionEagerness": 0.97,
      "bloodPactThresholdHp": 24,
      "domainExpansionEagerness": 1.11,
      "sovPowerTempoBias": 0.98,
      "synergyHoldBonus": 20,
      "mulliganCurveTarget": 3.2
    },
    "mulliganKeepIds": [
      "green_01_goblin",
      "blue_01_sentinela_ventos",
      "blue_13_lanceiro_mares",
      "blue_73_novico_ampulheta",
      "red_73_fagulha_taquion",
      "green_11_sugador_alado"
    ],
    "channelPriorityIds": [
      "green_137_lorde_treant_espinhos",
      "red_69_ira_vulcao",
      "red_125_armadilha_piroclastica",
      "red_126_bigorna_draconica",
      "gold_71_elmo_brilho"
    ],
    "channelAvoidIds": [
      "neutral_10_valkyra_pentacromatica",
      "red_119_soberano_piroclasma",
      "neutral_173_general_roda_matriz",
      "neutral_172_armada_draconica_matriz",
      "blue_117_arconte_astral",
      "green_01_goblin"
    ],
    "highImpactCardBoosts": {
      "neutral_10_valkyra_pentacromatica": 18,
      "red_119_soberano_piroclasma": 18,
      "neutral_173_general_roda_matriz": 18,
      "neutral_172_armada_draconica_matriz": 18,
      "blue_117_arconte_astral": 13,
      "green_01_goblin": 12,
      "green_156_mamute_brasa_selvagem": 11,
      "neutral_169_pressagio_revoada_matriz": 11
    },
    "synergyPairs": [
      [
        "green_123_crescimento_titanico",
        "neutral_173_general_roda_matriz"
      ],
      [
        "green_156_mamute_brasa_selvagem",
        "neutral_10_valkyra_pentacromatica"
      ],
      [
        "neutral_10_valkyra_pentacromatica",
        "neutral_169_pressagio_revoada_matriz"
      ],
      [
        "neutral_172_armada_draconica_matriz",
        "purple_01_esqueleto"
      ],
      [
        "blue_89_roda_tempo",
        "red_119_soberano_piroclasma"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "green_123_crescimento_titanico",
        "cardBId": "neutral_173_general_roda_matriz",
        "coPlayWinRate": 94.4,
        "liftOverBaseline": 39.6,
        "sampleCount": 18,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Crescimento Titânico da Floresta + Vaelkor, General da Roda Prismática na mesma janela de pressão (94.4% WR, +39.6% Lift)."
      },
      {
        "cardAId": "green_156_mamute_brasa_selvagem",
        "cardBId": "neutral_10_valkyra_pentacromatica",
        "coPlayWinRate": 90.9,
        "liftOverBaseline": 36,
        "sampleCount": 22,
        "synergyNote": "Arquidruida da Coroa de Galhada (5⚡) trava a Vanguarda enquanto Valkyra, Imperatriz Pentacromática (7⚡) opera protegido com +1 ATQ de Cobertura (90.9% WR, +36.0% Lift)."
      },
      {
        "cardAId": "neutral_10_valkyra_pentacromatica",
        "cardBId": "neutral_169_pressagio_revoada_matriz",
        "coPlayWinRate": 88.9,
        "liftOverBaseline": 34,
        "sampleCount": 27,
        "synergyNote": "Presságio da Revoada Primordial (5⚡) trava a Vanguarda enquanto Valkyra, Imperatriz Pentacromática (7⚡) opera protegido com +1 ATQ de Cobertura (88.9% WR, +34.0% Lift)."
      },
      {
        "cardAId": "neutral_172_armada_draconica_matriz",
        "cardBId": "purple_01_esqueleto",
        "coPlayWinRate": 93.3,
        "liftOverBaseline": 38.5,
        "sampleCount": 15,
        "synergyNote": "Motor de aceleração: Legionário Ossudo antecipa recursos e fôlego para sustentar o impacto de Armada Dracônica do Prisma (93.3% WR, +38.5% Lift)."
      },
      {
        "cardAId": "blue_89_roda_tempo",
        "cardBId": "red_119_soberano_piroclasma",
        "coPlayWinRate": 86.7,
        "liftOverBaseline": 31.8,
        "sampleCount": 30,
        "synergyNote": "Abertura de corredor tático: Astrolábio das Eras Eternas neutraliza bloqueadores para a infiltração letal de Pyroclasmos, Imperador das Chamas (86.7% WR, +31.8% Lift)."
      }
    ]
  },
  "deck_tri_astral_cataclysm": {
    "deckId": "deck_tri_astral_cataclysm",
    "deckName": "Grimório da Convergência Astral",
    "archetypeTag": "Pacto Triplo ❄️+🔥+☀️ • Tempestade, Chama & Ordem",
    "generationsTrained": 48,
    "matchesSimulated": 4638,
    "baselineWinRate": 30.6,
    "trainedWinRate": 54.4,
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
      "blue_96_arquimago_tempestade",
      "purple_91_cultista_sangue",
      "blue_91_iniciado_runico",
      "purple_35_calice_vampirico",
      "purple_36_trono_ossos",
      "neutral_46_pausar_pensar"
    ],
    "channelPriorityIds": [
      "red_164_armadilha_fissura_magma",
      "red_117_arauto_erupcao",
      "red_125_armadilha_piroclastica",
      "blue_124_dissipar_essencia",
      "red_97_lancador_chamas"
    ],
    "channelAvoidIds": [
      "red_119_soberano_piroclasma",
      "purple_35_calice_vampirico",
      "neutral_172_armada_draconica_matriz",
      "purple_36_trono_ossos",
      "red_173_general_roda_chama",
      "red_102_sangue_incandescente"
    ],
    "highImpactCardBoosts": {
      "red_119_soberano_piroclasma": 18,
      "purple_35_calice_vampirico": 18,
      "neutral_172_armada_draconica_matriz": 18,
      "purple_36_trono_ossos": 18,
      "red_173_general_roda_chama": 18,
      "red_102_sangue_incandescente": 16,
      "purple_117_conde_nosferatu": 16,
      "red_117_arauto_erupcao": 16
    },
    "synergyPairs": [
      [
        "purple_36_trono_ossos",
        "red_173_general_roda_chama"
      ],
      [
        "purple_35_calice_vampirico",
        "purple_99_lorde_vampiro_anciao"
      ],
      [
        "purple_29_colheita_sombras",
        "red_119_soberano_piroclasma"
      ],
      [
        "purple_50_pacto_proibido",
        "red_119_soberano_piroclasma"
      ],
      [
        "purple_35_calice_vampirico",
        "red_102_sangue_incandescente"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "purple_36_trono_ossos",
        "cardBId": "red_173_general_roda_chama",
        "coPlayWinRate": 100,
        "liftOverBaseline": 51.1,
        "sampleCount": 13,
        "synergyNote": "Abertura de corredor tático: Trono de Ossos do Arquimago neutraliza bloqueadores para a infiltração letal de Pyrrakon, General da Roda Vulcânica (100.0% WR, +51.1% Lift)."
      },
      {
        "cardAId": "purple_35_calice_vampirico",
        "cardBId": "purple_99_lorde_vampiro_anciao",
        "coPlayWinRate": 89.7,
        "liftOverBaseline": 40.8,
        "sampleCount": 29,
        "synergyNote": "Motor de aceleração: Cálice da Sede Carmesim antecipa recursos e fôlego para sustentar o impacto de Vladislaus, O Patriarca de Sangue (89.7% WR, +40.8% Lift)."
      },
      {
        "cardAId": "purple_29_colheita_sombras",
        "cardBId": "red_119_soberano_piroclasma",
        "coPlayWinRate": 85.3,
        "liftOverBaseline": 36.4,
        "sampleCount": 34,
        "synergyNote": "Abertura de corredor tático: Colheita de Almas Sombrias neutraliza bloqueadores para a infiltração letal de Pyroclasmos, Imperador das Chamas (85.3% WR, +36.4% Lift)."
      },
      {
        "cardAId": "purple_50_pacto_proibido",
        "cardBId": "red_119_soberano_piroclasma",
        "coPlayWinRate": 84.6,
        "liftOverBaseline": 35.7,
        "sampleCount": 39,
        "synergyNote": "Abertura de corredor tático: Contrato das Sete Correntes neutraliza bloqueadores para a infiltração letal de Pyroclasmos, Imperador das Chamas (84.6% WR, +35.7% Lift)."
      },
      {
        "cardAId": "purple_35_calice_vampirico",
        "cardBId": "red_102_sangue_incandescente",
        "coPlayWinRate": 82.8,
        "liftOverBaseline": 33.9,
        "sampleCount": 58,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Fervor do Sangue Incandescente + Cálice da Sede Carmesim na mesma janela de pressão (82.8% WR, +33.9% Lift)."
      }
    ]
  },
  "deck_tri_primordial_forge": {
    "deckId": "deck_tri_primordial_forge",
    "deckName": "Códice dos Behemoths de Obsidiana",
    "archetypeTag": "Pacto Triplo 🌿+🔥+💀 • Selva, Chama & Abismo",
    "generationsTrained": 48,
    "matchesSimulated": 4600,
    "baselineWinRate": 45.9,
    "trainedWinRate": 60.3,
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
      "green_37_lobo_atroz",
      "gold_37_escudeiro_solar",
      "green_91_rastreador_feral",
      "gold_73_aprendiz_relojoeiro",
      "red_02_magmin",
      "green_35_fosso_vinhas"
    ],
    "channelPriorityIds": [
      "gold_97_colosso_celestial",
      "green_117_mamute_esmeralda",
      "green_135_serpente_emplumada_selva",
      "red_116_hidra_vulcanica",
      "red_169_pressagio_revoada_chama"
    ],
    "channelAvoidIds": [
      "red_172_armada_draconica_chama",
      "red_173_general_roda_chama",
      "red_100_dragao_vulcanico_anciao",
      "green_103_dragao_floresta_anciao",
      "green_37_lobo_atroz",
      "green_91_rastreador_feral"
    ],
    "highImpactCardBoosts": {
      "red_172_armada_draconica_chama": 18,
      "red_173_general_roda_chama": 18,
      "red_100_dragao_vulcanico_anciao": 16,
      "green_103_dragao_floresta_anciao": 14,
      "green_37_lobo_atroz": 10,
      "green_91_rastreador_feral": 10,
      "red_02_magmin": 9,
      "red_01_kobold": 9
    },
    "synergyPairs": [
      [
        "green_01_goblin",
        "red_172_armada_draconica_chama"
      ],
      [
        "green_102_hidra_venenosa",
        "red_99_senhor_balor_fogo"
      ],
      [
        "green_100_quimera_selvagem",
        "red_172_armada_draconica_chama"
      ],
      [
        "green_123_crescimento_titanico",
        "red_173_general_roda_chama"
      ],
      [
        "red_170_flagelo_cornudo_chama",
        "red_173_general_roda_chama"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "green_01_goblin",
        "cardBId": "red_172_armada_draconica_chama",
        "coPlayWinRate": 93.3,
        "liftOverBaseline": 33.9,
        "sampleCount": 30,
        "synergyNote": "Abertura de corredor tático: Emboscador Goblin da Mata neutraliza bloqueadores para a infiltração letal de Hoste Dracônica da Cratera (93.3% WR, +33.9% Lift)."
      },
      {
        "cardAId": "green_102_hidra_venenosa",
        "cardBId": "red_99_senhor_balor_fogo",
        "coPlayWinRate": 95.7,
        "liftOverBaseline": 36.2,
        "sampleCount": 23,
        "synergyNote": "Abertura de corredor tático: Bael-Khor, General do Chicote Ígneo neutraliza bloqueadores para a infiltração letal de Polydra, A Hidra de Nove Cabeças (95.7% WR, +36.2% Lift)."
      },
      {
        "cardAId": "green_100_quimera_selvagem",
        "cardBId": "red_172_armada_draconica_chama",
        "coPlayWinRate": 94.1,
        "liftOverBaseline": 34.7,
        "sampleCount": 17,
        "synergyNote": "Sinergia empírica de alta conversão: curvar Quimera Alfa de Três Presas (5⚡) rumo a Hoste Dracônica da Cratera (8⚡) eleva o domínio de mesa (94.1% WR, +34.7% Lift)."
      },
      {
        "cardAId": "green_123_crescimento_titanico",
        "cardBId": "red_173_general_roda_chama",
        "coPlayWinRate": 92.9,
        "liftOverBaseline": 33.4,
        "sampleCount": 14,
        "synergyNote": "Abertura de corredor tático: Crescimento Titânico da Floresta neutraliza bloqueadores para a infiltração letal de Pyrrakon, General da Roda Vulcânica (92.9% WR, +33.4% Lift)."
      },
      {
        "cardAId": "red_170_flagelo_cornudo_chama",
        "cardBId": "red_173_general_roda_chama",
        "coPlayWinRate": 83.9,
        "liftOverBaseline": 24.4,
        "sampleCount": 31,
        "synergyNote": "Abertura de corredor tático: Flagelo Cornudo da Fornalha neutraliza bloqueadores para a infiltração letal de Pyrrakon, General da Roda Vulcânica (83.9% WR, +24.4% Lift)."
      }
    ]
  },
  "deck_tri_abyssal_chimera": {
    "deckId": "deck_tri_abyssal_chimera",
    "deckName": "Tomo da Quimera Abissal",
    "archetypeTag": "Pacto Triplo 💀+❄️+🌿 • Abismo, Tempestade & Selva",
    "generationsTrained": 48,
    "matchesSimulated": 4666,
    "baselineWinRate": 37.5,
    "trainedWinRate": 63.1,
    "weights": {
      "aggroFaceBias": 0.61,
      "tradeValueBias": 1.16,
      "guardianPriority": 1.44,
      "flyingEvasionBias": 1.02,
      "stackConsolidationBias": 0.91,
      "antiAoeSpreadBias": 1.46,
      "spellHoldPatience": 1.28,
      "relicPriority": 1.08,
      "ascensionEagerness": 1.29,
      "bloodPactThresholdHp": 19,
      "domainExpansionEagerness": 1.08,
      "sovPowerTempoBias": 0.98,
      "synergyHoldBonus": 21,
      "mulliganCurveTarget": 3.63
    },
    "mulliganKeepIds": [
      "blue_91_iniciado_runico",
      "blue_01_sentinela_ventos",
      "blue_170_flagelo_cornudo_gelo",
      "blue_89_roda_tempo",
      "green_107_altar_fera_antiga",
      "green_01_goblin"
    ],
    "channelPriorityIds": [
      "blue_103_diluvio_arcano",
      "green_75_druida_ciclos",
      "blue_124_dissipar_essencia",
      "green_117_mamute_esmeralda",
      "blue_115_oraculo_mar_profundo"
    ],
    "channelAvoidIds": [
      "purple_172_armada_draconica_abismo",
      "purple_100_dragao_necrotico",
      "purple_173_general_roda_abismo",
      "green_104_levante_selva",
      "blue_117_arconte_astral",
      "purple_102_exumar_legiao"
    ],
    "highImpactCardBoosts": {
      "purple_172_armada_draconica_abismo": 18,
      "purple_100_dragao_necrotico": 18,
      "purple_173_general_roda_abismo": 18,
      "green_104_levante_selva": 18,
      "blue_117_arconte_astral": 18,
      "purple_102_exumar_legiao": 18,
      "purple_154_cavaleiro_morte_eterna": 18,
      "green_105_instinto_predador": 18
    },
    "synergyPairs": [
      [
        "blue_89_roda_tempo",
        "purple_172_armada_draconica_abismo"
      ],
      [
        "blue_170_flagelo_cornudo_gelo",
        "purple_172_armada_draconica_abismo"
      ],
      [
        "blue_117_arconte_astral",
        "green_105_instinto_predador"
      ],
      [
        "blue_89_roda_tempo",
        "green_104_levante_selva"
      ],
      [
        "green_105_instinto_predador",
        "purple_173_general_roda_abismo"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "blue_89_roda_tempo",
        "cardBId": "purple_172_armada_draconica_abismo",
        "coPlayWinRate": 95.2,
        "liftOverBaseline": 40.8,
        "sampleCount": 21,
        "synergyNote": "Motor de aceleração: Astrolábio das Eras Eternas antecipa recursos e fôlego para sustentar o impacto de Legião Dracônica do Eclipse (95.2% WR, +40.8% Lift)."
      },
      {
        "cardAId": "blue_170_flagelo_cornudo_gelo",
        "cardBId": "purple_172_armada_draconica_abismo",
        "coPlayWinRate": 92,
        "liftOverBaseline": 37.6,
        "sampleCount": 25,
        "synergyNote": "Abertura de corredor tático: Flagelo Cornudo da Geada neutraliza bloqueadores para a infiltração letal de Legião Dracônica do Eclipse (92.0% WR, +37.6% Lift)."
      },
      {
        "cardAId": "blue_117_arconte_astral",
        "cardBId": "green_105_instinto_predador",
        "coPlayWinRate": 88.4,
        "liftOverBaseline": 33.9,
        "sampleCount": 43,
        "synergyNote": "Abertura de corredor tático: Faro do Predador Alfa neutraliza bloqueadores para a infiltração letal de Orion, Arconte da Tempestade Astral (88.4% WR, +33.9% Lift)."
      },
      {
        "cardAId": "blue_89_roda_tempo",
        "cardBId": "green_104_levante_selva",
        "coPlayWinRate": 91.7,
        "liftOverBaseline": 37.2,
        "sampleCount": 24,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Astrolábio das Eras Eternas + Levante da Selva Indomável na mesma janela de pressão (91.7% WR, +37.2% Lift)."
      },
      {
        "cardAId": "green_105_instinto_predador",
        "cardBId": "purple_173_general_roda_abismo",
        "coPlayWinRate": 87.2,
        "liftOverBaseline": 32.8,
        "sampleCount": 47,
        "synergyNote": "Abertura de corredor tático: Faro do Predador Alfa neutraliza bloqueadores para a infiltração letal de Nyxaroth, General da Roda Fúnebre (87.2% WR, +32.8% Lift)."
      }
    ]
  },
  "deck_tri_crimson_sun": {
    "deckId": "deck_tri_crimson_sun",
    "deckName": "Escritura do Eclipse Carmesim",
    "archetypeTag": "Pacto Triplo 🔥+💀+☀️ • Chama, Abismo & Ordem",
    "generationsTrained": 48,
    "matchesSimulated": 4666,
    "baselineWinRate": 41.6,
    "trainedWinRate": 52.2,
    "weights": {
      "aggroFaceBias": 1.2,
      "tradeValueBias": 1.39,
      "guardianPriority": 1.74,
      "flyingEvasionBias": 1.5,
      "stackConsolidationBias": 1.3,
      "antiAoeSpreadBias": 1.15,
      "spellHoldPatience": 1.23,
      "relicPriority": 1.3,
      "ascensionEagerness": 0.78,
      "bloodPactThresholdHp": 14,
      "domainExpansionEagerness": 1.12,
      "sovPowerTempoBias": 0.97,
      "synergyHoldBonus": 21,
      "mulliganCurveTarget": 2.53
    },
    "mulliganKeepIds": [
      "purple_170_flagelo_cornudo_abismo",
      "gold_32_estandarte_imperial",
      "neutral_46_pausar_pensar",
      "purple_164_sentenca_tumulo",
      "purple_91_cultista_sangue",
      "gold_39_inquisidor_justica"
    ],
    "channelPriorityIds": [
      "red_164_armadilha_fissura_magma",
      "gold_05_automato_guardiao",
      "red_97_lancador_chamas",
      "red_125_armadilha_piroclastica",
      "red_145_emboscada_geiser"
    ],
    "channelAvoidIds": [
      "red_119_soberano_piroclasma",
      "red_99_senhor_balor_fogo",
      "gold_99_serafim_coroado",
      "gold_173_general_roda_sol",
      "purple_117_conde_nosferatu",
      "red_117_arauto_erupcao"
    ],
    "highImpactCardBoosts": {
      "red_119_soberano_piroclasma": 18,
      "red_99_senhor_balor_fogo": 18,
      "gold_99_serafim_coroado": 18,
      "gold_173_general_roda_sol": 18,
      "purple_117_conde_nosferatu": 15,
      "red_117_arauto_erupcao": 15,
      "purple_98_cavaleiro_apocalipse": 14,
      "purple_167_arauto_prisma_abismo": 14
    },
    "synergyPairs": [
      [
        "red_119_soberano_piroclasma",
        "red_99_senhor_balor_fogo"
      ],
      [
        "gold_98_arconte_julgamento",
        "red_119_soberano_piroclasma"
      ],
      [
        "gold_32_estandarte_imperial",
        "red_99_senhor_balor_fogo"
      ],
      [
        "gold_173_general_roda_sol",
        "red_67_fornalha_interior"
      ],
      [
        "gold_99_serafim_coroado",
        "red_117_arauto_erupcao"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "red_119_soberano_piroclasma",
        "cardBId": "red_99_senhor_balor_fogo",
        "coPlayWinRate": 100,
        "liftOverBaseline": 49.8,
        "sampleCount": 12,
        "synergyNote": "Abertura de corredor tático: Bael-Khor, General do Chicote Ígneo neutraliza bloqueadores para a infiltração letal de Pyroclasmos, Imperador das Chamas (100.0% WR, +49.8% Lift)."
      },
      {
        "cardAId": "gold_98_arconte_julgamento",
        "cardBId": "red_119_soberano_piroclasma",
        "coPlayWinRate": 87.1,
        "liftOverBaseline": 36.9,
        "sampleCount": 31,
        "synergyNote": "Abertura de corredor tático: Raziel, Arconte da Espada Flamejante neutraliza bloqueadores para a infiltração letal de Pyroclasmos, Imperador das Chamas (87.1% WR, +36.9% Lift)."
      },
      {
        "cardAId": "gold_32_estandarte_imperial",
        "cardBId": "red_99_senhor_balor_fogo",
        "coPlayWinRate": 93.8,
        "liftOverBaseline": 43.6,
        "sampleCount": 16,
        "synergyNote": "Abertura de corredor tático: Estandarte da Legião Dourada neutraliza bloqueadores para a infiltração letal de Bael-Khor, General do Chicote Ígneo (93.8% WR, +43.6% Lift)."
      },
      {
        "cardAId": "gold_173_general_roda_sol",
        "cardBId": "red_67_fornalha_interior",
        "coPlayWinRate": 84.8,
        "liftOverBaseline": 34.7,
        "sampleCount": 33,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Fornalha Interior + Heliokar, General da Roda Celeste na mesma janela de pressão (84.8% WR, +34.7% Lift)."
      },
      {
        "cardAId": "gold_99_serafim_coroado",
        "cardBId": "red_117_arauto_erupcao",
        "coPlayWinRate": 83.3,
        "liftOverBaseline": 33.2,
        "sampleCount": 48,
        "synergyNote": "Abertura de corredor tático: Arauto Demoníaco da Erupção neutraliza bloqueadores para a infiltração letal de Seraphiel, A Imperatriz das Seis Asas (83.3% WR, +33.2% Lift)."
      }
    ]
  },
  "deck_tri_eternal_horizon": {
    "deckId": "deck_tri_eternal_horizon",
    "deckName": "Códice do Horizonte Eterno",
    "archetypeTag": "Pacto Triplo 🌿+☀️+💀 • Selva, Ordem & Abismo",
    "generationsTrained": 48,
    "matchesSimulated": 4660,
    "baselineWinRate": 49.4,
    "trainedWinRate": 55,
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
      "bloodPactThresholdHp": 26,
      "domainExpansionEagerness": 1.08,
      "sovPowerTempoBias": 1,
      "synergyHoldBonus": 22,
      "mulliganCurveTarget": 3.5
    },
    "mulliganKeepIds": [
      "gold_01_espada_animada",
      "blue_37_mago_aprendiz",
      "green_91_rastreador_feral",
      "green_35_fosso_vinhas",
      "gold_91_lanceiro_alvorada",
      "blue_91_iniciado_runico"
    ],
    "channelPriorityIds": [
      "green_99_guardiao_sequoia",
      "green_117_mamute_esmeralda",
      "gold_106_bastiao_eterno",
      "gold_116_centuriao_forja_dourada",
      "gold_98_arconte_julgamento"
    ],
    "channelAvoidIds": [
      "green_121_avatar_gaia",
      "gold_172_armada_draconica_sol",
      "neutral_173_general_roda_matriz",
      "green_173_general_roda_selva",
      "gold_100_dragao_imperial_ouro",
      "green_105_instinto_predador"
    ],
    "highImpactCardBoosts": {
      "green_121_avatar_gaia": 18,
      "gold_172_armada_draconica_sol": 18,
      "neutral_173_general_roda_matriz": 18,
      "green_173_general_roda_selva": 18,
      "gold_100_dragao_imperial_ouro": 18,
      "green_105_instinto_predador": 18,
      "gold_32_estandarte_imperial": 18,
      "green_104_levante_selva": 18
    },
    "synergyPairs": [
      [
        "blue_01_sentinela_ventos",
        "green_121_avatar_gaia"
      ],
      [
        "green_105_instinto_predador",
        "green_173_general_roda_selva"
      ],
      [
        "blue_37_mago_aprendiz",
        "green_121_avatar_gaia"
      ],
      [
        "green_91_rastreador_feral",
        "neutral_173_general_roda_matriz"
      ],
      [
        "gold_100_dragao_imperial_ouro",
        "gold_142_calice_alvorada_real"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "blue_01_sentinela_ventos",
        "cardBId": "green_121_avatar_gaia",
        "coPlayWinRate": 91,
        "liftOverBaseline": 32.3,
        "sampleCount": 67,
        "synergyNote": "Sentinela das Correntes Aéreas (1⚡) trava a Vanguarda enquanto Tellurion, Avatar Primordial da Terra Viva (7⚡) opera protegido com +1 ATQ de Cobertura (91.0% WR, +32.3% Lift)."
      },
      {
        "cardAId": "green_105_instinto_predador",
        "cardBId": "green_173_general_roda_selva",
        "coPlayWinRate": 90.2,
        "liftOverBaseline": 31.5,
        "sampleCount": 41,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Faro do Predador Alfa + Sylvarok, General da Roda Primeva na mesma janela de pressão (90.2% WR, +31.5% Lift)."
      },
      {
        "cardAId": "blue_37_mago_aprendiz",
        "cardBId": "green_121_avatar_gaia",
        "coPlayWinRate": 88.7,
        "liftOverBaseline": 29.9,
        "sampleCount": 53,
        "synergyNote": "Iniciado da Torre Astral (1⚡) trava a Vanguarda enquanto Tellurion, Avatar Primordial da Terra Viva (7⚡) opera protegido com +1 ATQ de Cobertura (88.7% WR, +29.9% Lift)."
      },
      {
        "cardAId": "green_91_rastreador_feral",
        "cardBId": "neutral_173_general_roda_matriz",
        "coPlayWinRate": 88.2,
        "liftOverBaseline": 29.4,
        "sampleCount": 51,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Rastreador Feral da Copa + Vaelkor, General da Roda Prismática na mesma janela de pressão (88.2% WR, +29.4% Lift)."
      },
      {
        "cardAId": "gold_100_dragao_imperial_ouro",
        "cardBId": "gold_142_calice_alvorada_real",
        "coPlayWinRate": 88.9,
        "liftOverBaseline": 30.1,
        "sampleCount": 36,
        "synergyNote": "Cálice Real da Alvorada (2⚡) trava a Vanguarda enquanto Aurion-Sol, O Dragão Imperial do Zênite (7⚡) opera protegido com +1 ATQ de Cobertura (88.9% WR, +30.1% Lift)."
      }
    ]
  },
  "deck_squad_thousand_shields": {
    "deckId": "deck_squad_thousand_shields",
    "deckName": "Tratado da Falange dos Mil Escudos",
    "archetypeTag": "Doutrina de Esquadrão 🛡️ • Vanguarda & Cobertura",
    "generationsTrained": 48,
    "matchesSimulated": 15630,
    "baselineWinRate": 48.1,
    "trainedWinRate": 65,
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
      "gold_32_estandarte_imperial",
      "green_74_coelho_branco_arauto",
      "gold_73_aprendiz_relojoeiro",
      "gold_37_escudeiro_solar",
      "gold_133_mestre_forja_imperial",
      "green_147_batedor_folha_viva"
    ],
    "channelPriorityIds": [
      "gold_162_veredito_inquisidor",
      "green_117_mamute_esmeralda",
      "gold_134_esfinge_sentenca_real",
      "green_116_ent_espinheiro_anciao",
      "gold_135_serafim_seis_asas"
    ],
    "channelAvoidIds": [
      "gold_172_armada_draconica_sol",
      "green_121_avatar_gaia",
      "green_173_general_roda_selva",
      "gold_173_general_roda_sol",
      "green_172_armada_draconica_selva",
      "gold_32_estandarte_imperial"
    ],
    "highImpactCardBoosts": {
      "gold_172_armada_draconica_sol": 18,
      "green_121_avatar_gaia": 18,
      "green_173_general_roda_selva": 18,
      "gold_173_general_roda_sol": 18,
      "green_172_armada_draconica_selva": 18,
      "gold_32_estandarte_imperial": 15,
      "gold_115_leao_celestial_rei": 15,
      "green_74_coelho_branco_arauto": 14
    },
    "synergyPairs": [
      [
        "green_142_patriarca_selva_eterna",
        "green_169_pressagio_revoada_selva"
      ],
      [
        "gold_115_leao_celestial_rei",
        "green_121_avatar_gaia"
      ],
      [
        "gold_73_aprendiz_relojoeiro",
        "green_173_general_roda_selva"
      ],
      [
        "gold_72_talisma_bem",
        "green_105_instinto_predador"
      ],
      [
        "green_173_general_roda_selva",
        "neutral_169_pressagio_revoada_matriz"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "green_142_patriarca_selva_eterna",
        "cardBId": "green_169_pressagio_revoada_selva",
        "coPlayWinRate": 100,
        "liftOverBaseline": 41.4,
        "sampleCount": 13,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Presságio da Revoada Espinhosa + Sylvanhorn, Patriarca da Selva Eterna na mesma janela de pressão (100.0% WR, +41.4% Lift)."
      },
      {
        "cardAId": "gold_115_leao_celestial_rei",
        "cardBId": "green_121_avatar_gaia",
        "coPlayWinRate": 94.1,
        "liftOverBaseline": 35.5,
        "sampleCount": 17,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Leão-Rei Celestial + Tellurion, Avatar Primordial da Terra Viva na mesma janela de pressão (94.1% WR, +35.5% Lift)."
      },
      {
        "cardAId": "gold_73_aprendiz_relojoeiro",
        "cardBId": "green_173_general_roda_selva",
        "coPlayWinRate": 87.9,
        "liftOverBaseline": 29.3,
        "sampleCount": 33,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Artífice de Rodas Dentadas + Sylvarok, General da Roda Primeva na mesma janela de pressão (87.9% WR, +29.3% Lift)."
      },
      {
        "cardAId": "gold_72_talisma_bem",
        "cardBId": "green_105_instinto_predador",
        "coPlayWinRate": 86.7,
        "liftOverBaseline": 28.1,
        "sampleCount": 45,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Faro do Predador Alfa + Talismã do Zênite Puro na mesma janela de pressão (86.7% WR, +28.1% Lift)."
      },
      {
        "cardAId": "green_173_general_roda_selva",
        "cardBId": "neutral_169_pressagio_revoada_matriz",
        "coPlayWinRate": 93.3,
        "liftOverBaseline": 34.8,
        "sampleCount": 15,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Presságio da Revoada Primordial + Sylvarok, General da Roda Primeva na mesma janela de pressão (93.3% WR, +34.8% Lift)."
      }
    ]
  },
  "deck_squad_siege_battery": {
    "deckId": "deck_squad_siege_battery",
    "deckName": "Tratado da Bateria de Cerco Arcana",
    "archetypeTag": "Doutrina de Artilharia 🏹 • Retaguarda & Magias",
    "generationsTrained": 48,
    "matchesSimulated": 4678,
    "baselineWinRate": 29.7,
    "trainedWinRate": 56.6,
    "weights": {
      "aggroFaceBias": 1.28,
      "tradeValueBias": 1.2,
      "guardianPriority": 1,
      "flyingEvasionBias": 1.2,
      "stackConsolidationBias": 1.38,
      "antiAoeSpreadBias": 0.84,
      "spellHoldPatience": 1.24,
      "relicPriority": 1,
      "ascensionEagerness": 1.05,
      "bloodPactThresholdHp": 20,
      "domainExpansionEagerness": 1.08,
      "sovPowerTempoBias": 1,
      "synergyHoldBonus": 22,
      "mulliganCurveTarget": 2.8
    },
    "mulliganKeepIds": [
      "red_62_colosso_obsidiana",
      "blue_96_arquimago_tempestade",
      "blue_37_mago_aprendiz",
      "blue_91_iniciado_runico",
      "neutral_46_pausar_pensar",
      "blue_124_dissipar_essencia"
    ],
    "channelPriorityIds": [
      "red_164_armadilha_fissura_magma",
      "red_68_chuva_enxofre",
      "blue_121_tempestade_mental",
      "red_161_erupcao_piroclastica",
      "red_116_hidra_vulcanica"
    ],
    "channelAvoidIds": [
      "neutral_172_armada_draconica_matriz",
      "blue_154_dragao_safira_soberano",
      "blue_173_general_roda_gelo",
      "blue_172_armada_draconica_gelo",
      "blue_117_arconte_astral",
      "red_100_dragao_vulcanico_anciao"
    ],
    "highImpactCardBoosts": {
      "neutral_172_armada_draconica_matriz": 18,
      "blue_154_dragao_safira_soberano": 18,
      "blue_173_general_roda_gelo": 18,
      "blue_172_armada_draconica_gelo": 18,
      "blue_117_arconte_astral": 18,
      "red_100_dragao_vulcanico_anciao": 18,
      "red_126_bigorna_draconica": 18,
      "neutral_11_botas_aladas": 18
    },
    "synergyPairs": [
      [
        "blue_14_saqueador_abissal",
        "blue_173_general_roda_gelo"
      ],
      [
        "blue_154_dragao_safira_soberano",
        "blue_64_seta_gelo"
      ],
      [
        "blue_172_armada_draconica_gelo",
        "neutral_11_botas_aladas"
      ],
      [
        "neutral_172_armada_draconica_matriz",
        "red_30_furia_sangue"
      ],
      [
        "blue_104_fracao_temporal",
        "blue_117_arconte_astral"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "blue_14_saqueador_abissal",
        "cardBId": "blue_173_general_roda_gelo",
        "coPlayWinRate": 93.8,
        "liftOverBaseline": 56.5,
        "sampleCount": 16,
        "synergyNote": "Abertura de corredor tático: Maré Sanguinária das Trincheiras neutraliza bloqueadores para a infiltração letal de Cryonax, General da Roda Astral (93.8% WR, +56.5% Lift)."
      },
      {
        "cardAId": "blue_154_dragao_safira_soberano",
        "cardBId": "blue_64_seta_gelo",
        "coPlayWinRate": 82,
        "liftOverBaseline": 44.8,
        "sampleCount": 50,
        "synergyNote": "Abertura de corredor tático: Lança de Gelo Perfurante neutraliza bloqueadores para a infiltração letal de Dragão de Safira Sônico (82.0% WR, +44.8% Lift)."
      },
      {
        "cardAId": "blue_172_armada_draconica_gelo",
        "cardBId": "neutral_11_botas_aladas",
        "coPlayWinRate": 82.1,
        "liftOverBaseline": 44.9,
        "sampleCount": 28,
        "synergyNote": "Abertura de corredor tático: Botas Aladas do Mensageiro neutraliza bloqueadores para a infiltração letal de Esquadra Dracônica da Nevasca (82.1% WR, +44.9% Lift)."
      },
      {
        "cardAId": "neutral_172_armada_draconica_matriz",
        "cardBId": "red_30_furia_sangue",
        "coPlayWinRate": 80.6,
        "liftOverBaseline": 43.4,
        "sampleCount": 31,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Fúria de Sangue Vulcânico + Armada Dracônica do Prisma na mesma janela de pressão (80.6% WR, +43.4% Lift)."
      },
      {
        "cardAId": "blue_104_fracao_temporal",
        "cardBId": "blue_117_arconte_astral",
        "coPlayWinRate": 78.3,
        "liftOverBaseline": 41,
        "sampleCount": 46,
        "synergyNote": "Abertura de corredor tático: Fração de Segundo Infinita neutraliza bloqueadores para a infiltração letal de Orion, Arconte da Tempestade Astral (78.3% WR, +41.0% Lift)."
      }
    ]
  },
  "deck_penta_valkyra_pact": {
    "deckId": "deck_penta_valkyra_pact",
    "deckName": "Grimório Supremo de Valkyra",
    "archetypeTag": "Convergência Pentacromática 👑 • Todos os Domínios",
    "generationsTrained": 48,
    "matchesSimulated": 15760,
    "baselineWinRate": 34.4,
    "trainedWinRate": 61.9,
    "weights": {
      "aggroFaceBias": 1.18,
      "tradeValueBias": 1.27,
      "guardianPriority": 1.28,
      "flyingEvasionBias": 1.32,
      "stackConsolidationBias": 1.19,
      "antiAoeSpreadBias": 0.98,
      "spellHoldPatience": 1.27,
      "relicPriority": 1.2,
      "ascensionEagerness": 1.28,
      "bloodPactThresholdHp": 13,
      "domainExpansionEagerness": 0.84,
      "sovPowerTempoBias": 1.16,
      "synergyHoldBonus": 19,
      "mulliganCurveTarget": 3.01
    },
    "mulliganKeepIds": [
      "gold_91_lanceiro_alvorada",
      "blue_91_iniciado_runico",
      "green_54_totem_ancestral",
      "gold_32_estandarte_imperial",
      "red_01_kobold",
      "red_164_armadilha_fissura_magma"
    ],
    "channelPriorityIds": [
      "blue_169_pressagio_revoada_gelo",
      "red_125_armadilha_piroclastica",
      "green_144_bencao_arvore_mundo",
      "gold_171_pactuario_elemental_sol",
      "blue_107_bussola_astral"
    ],
    "channelAvoidIds": [
      "neutral_10_valkyra_pentacromatica",
      "purple_100_dragao_necrotico",
      "neutral_172_armada_draconica_matriz",
      "red_100_dragao_vulcanico_anciao",
      "red_156_fenix_coroa_solar"
    ],
    "highImpactCardBoosts": {
      "neutral_10_valkyra_pentacromatica": 18,
      "purple_100_dragao_necrotico": 18,
      "neutral_172_armada_draconica_matriz": 18,
      "red_100_dragao_vulcanico_anciao": 18,
      "red_156_fenix_coroa_solar": 18,
      "blue_169_pressagio_revoada_gelo": 18,
      "neutral_173_general_roda_matriz": 18,
      "gold_32_estandarte_imperial": 18
    },
    "synergyPairs": [
      [
        "neutral_168_tecelao_feixe_matriz",
        "purple_100_dragao_necrotico"
      ],
      [
        "gold_105_coroa_imperador",
        "neutral_10_valkyra_pentacromatica"
      ],
      [
        "gold_32_estandarte_imperial",
        "neutral_10_valkyra_pentacromatica"
      ],
      [
        "neutral_172_armada_draconica_matriz",
        "red_30_furia_sangue"
      ],
      [
        "green_139_dragao_floresta_antiga",
        "red_100_dragao_vulcanico_anciao"
      ]
    ],
    "discoveredCombos": [
      {
        "cardAId": "neutral_168_tecelao_feixe_matriz",
        "cardBId": "purple_100_dragao_necrotico",
        "coPlayWinRate": 93.9,
        "liftOverBaseline": 43.3,
        "sampleCount": 33,
        "synergyNote": "Motor de aceleração: Tecelão do Feixe Primordial antecipa recursos e fôlego para sustentar o impacto de Morgath, O Dragão da Chama Necrótica (93.9% WR, +43.3% Lift)."
      },
      {
        "cardAId": "gold_105_coroa_imperador",
        "cardBId": "neutral_10_valkyra_pentacromatica",
        "coPlayWinRate": 95.7,
        "liftOverBaseline": 45,
        "sampleCount": 23,
        "synergyNote": "Coroa Imperial de Solis (3⚡) trava a Vanguarda enquanto Valkyra, Imperatriz Pentacromática (7⚡) opera protegido com +1 ATQ de Cobertura (95.7% WR, +45.0% Lift)."
      },
      {
        "cardAId": "gold_32_estandarte_imperial",
        "cardBId": "neutral_10_valkyra_pentacromatica",
        "coPlayWinRate": 91.4,
        "liftOverBaseline": 40.8,
        "sampleCount": 35,
        "synergyNote": "Estandarte da Legião Dourada (3⚡) trava a Vanguarda enquanto Valkyra, Imperatriz Pentacromática (7⚡) opera protegido com +1 ATQ de Cobertura (91.4% WR, +40.8% Lift)."
      },
      {
        "cardAId": "neutral_172_armada_draconica_matriz",
        "cardBId": "red_30_furia_sangue",
        "coPlayWinRate": 92,
        "liftOverBaseline": 41.4,
        "sampleCount": 25,
        "synergyNote": "Multiplicador de falange: escalona atributos e sobrevivência combinando Fúria de Sangue Vulcânico + Armada Dracônica do Prisma na mesma janela de pressão (92.0% WR, +41.4% Lift)."
      },
      {
        "cardAId": "green_139_dragao_floresta_antiga",
        "cardBId": "red_100_dragao_vulcanico_anciao",
        "coPlayWinRate": 100,
        "liftOverBaseline": 49.4,
        "sampleCount": 12,
        "synergyNote": "Sinergia empírica de alta conversão: curvar Dragão da Floresta Primordial (6⚡) rumo a Khorvath, O Dragão Vulcânico Ancião (7⚡) eleva o domínio de mesa (100.0% WR, +49.4% Lift)."
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
  if (explicitDeckId && AI_LEARNED_PROFILES[explicitDeckId]) {
    return AI_LEARNED_PROFILES[explicitDeckId];
  }

  if (actor === 'ai' && state.bossId) {
    const boss = CAMPAIGN_BOSSES.find((b) => b.id === state.bossId);
    if (boss && AI_LEARNED_PROFILES[boss.deckId]) {
      return AI_LEARNED_PROFILES[boss.deckId];
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
