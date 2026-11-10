import { unpackMasteryRecord } from './compactMasteryCodec';
import { AiSkillTier, Domain } from '../types/game';
import type { DeckLearnedAiProfile, DiscoveredCardCombo } from './aiLearnedProfiles';
import type { CardShapleyMetric, TierDeckMetadata } from './aiMonocolorMasteryData';

/**
 * GERADO AUTOMATICAMENTE POR src/scripts/trainBicolorEvolution.ts (npm run train:bicolor)
 * Partidas Simuladas: 63,132 | Estados Treinados nas 15 Value MLPs: 166,773 (271.7s em 10 threads)
 * Margem de Erro Máxima IC 95% nos Tiers: ±2.99%
 */

export type BicolorArchetypeId =
  | 'dual_red_gold'
  | 'dual_blue_purple'
  | 'dual_red_green'
  | 'dual_blue_gold'
  | 'dual_purple_green'
  | 'dual_red_purple'
  | 'dual_blue_green'
  | 'dual_green_gold'
  | 'dual_purple_gold'
  | 'dual_red_blue'
  | 'dual_green_neutral'
  | 'dual_red_neutral'
  | 'dual_blue_neutral'
  | 'dual_purple_neutral'
  | 'dual_gold_neutral';

export type BicolorPactTriadId =
  | 'pyros_alliances'
  | 'veridia_alliances'
  | 'vortex_alliances'
  | 'eclipse_alliances'
  | 'solaria_alliances';

export interface BicolorArchetypeMastery {
  archetypeId: BicolorArchetypeId;
  domains: [Domain, Domain];
  isAxialAlliance: boolean;
  triadId: BicolorPactTriadId;
  classicDeckId?: string;
  name: string;
  subtitle: string;
  strategySummary: string;
  tacticalIdentity: 'aggro' | 'midrange' | 'control' | 'ramp' | 'tempo' | 'attrition';
  coverCardId: string;
  generationsEvolved: number;
  matchesSimulated: number;
  seedWinRate: number;
  championWinRate: number;
  vsMonocolorWinRate: number;
  championDeckJaccardStability: number;
  medianCardCi95HalfWidth: number;
  domainCardBreakdown: Record<string, number>;
  crossDomainCombos: DiscoveredCardCombo[];
  learnedProfile: DeckLearnedAiProfile;
  topShapleyCards: CardShapleyMetric[];
  tierDecks: Record<AiSkillTier, TierDeckMetadata>;
}

export interface BicolorTriadLadderBenchmark {
  triadId: BicolorPactTriadId;
  triadTitle: string;
  archetypeIds: BicolorArchetypeId[];
  matchesPerCell: number;
  totalLadderMatches: number;
  tierOverallWinRates: Record<AiSkillTier, number>;
  tierCi95HalfWidths: Record<AiSkillTier, number>;
  maxTierCi95HalfWidth: number;
  convergedByMargin: boolean;
  adjacentDominanceWinRates: {
    tier2VsTier1: number;
    tier3VsTier2: number;
    tier4VsTier3: number;
    tier5VsTier4: number;
    tier5VsTier1: number;
  };
}

export interface BicolorTrainingSummary {
  generatedAt: string;
  totalMatchesSimulated: number;
  totalStateTrajectoriesTrained: number;
  elapsedSeconds: number;
  archetypesCount: number;
  overallVsMonocolorTier5WinRate: number;
  convergenceReport: {
    workerThreadsUsed: number;
    targetTierCi95HalfWidth: number;
    achievedMaxTierCi95HalfWidth: number;
    targetDeckJaccardStability: number;
    achievedMeanDeckJaccardStability: number;
    achievedMaxMedianCardCi95HalfWidth: number;
    minComboCoPlays: number;
    generationsExecuted: number;
    convergedEarly: boolean;
  };
  ladderByTriad: Record<BicolorPactTriadId, BicolorTriadLadderBenchmark>;
}

export const BICOLOR_TRAINING_SUMMARY: BicolorTrainingSummary = {
  "generatedAt": "2026-11-10T20:32:54.777Z",
  "totalMatchesSimulated": 82482,
  "totalStateTrajectoriesTrained": 253598,
  "elapsedSeconds": 341.4,
  "archetypesCount": 15,
  "overallVsMonocolorTier5WinRate": 0.702,
  "convergenceReport": {
    "workerThreadsUsed": 10,
    "targetTierCi95HalfWidth": 0.03,
    "achievedMaxTierCi95HalfWidth": 0.0299,
    "targetDeckJaccardStability": 0.975,
    "achievedMeanDeckJaccardStability": 1,
    "achievedMaxMedianCardCi95HalfWidth": 0.18,
    "minComboCoPlays": 28,
    "generationsExecuted": 14,
    "convergedEarly": false
  },
  "ladderByTriad": {
    "pyros_alliances": {
      "triadId": "pyros_alliances",
      "triadTitle": "Tríade de Pyros (Chama-Ordem, Chama-Abismo & Artilharia Axial)",
      "archetypeIds": [
        "dual_red_gold",
        "dual_red_purple",
        "dual_red_neutral"
      ],
      "matchesPerCell": 338,
      "totalLadderMatches": 3384,
      "tierOverallWinRates": {
        "1": 0.043,
        "2": 0.276,
        "3": 0.615,
        "4": 0.719,
        "5": 0.828
      },
      "tierCi95HalfWidths": {
        "1": 0.0122,
        "2": 0.0291,
        "3": 0.0283,
        "4": 0.0273,
        "5": 0.0219
      },
      "maxTierCi95HalfWidth": 0.0291,
      "convergedByMargin": true,
      "adjacentDominanceWinRates": {
        "tier2VsTier1": 0.874,
        "tier3VsTier2": 0.866,
        "tier4VsTier3": 0.616,
        "tier5VsTier4": 0.64,
        "tier5VsTier1": 1
      }
    },
    "veridia_alliances": {
      "triadId": "veridia_alliances",
      "triadTitle": "Tríade de Veridia (Ruína Selvagem, Aurora Silvestre & Engenhos Axiais)",
      "archetypeIds": [
        "dual_red_green",
        "dual_green_gold",
        "dual_green_neutral"
      ],
      "matchesPerCell": 343,
      "totalLadderMatches": 3432,
      "tierOverallWinRates": {
        "1": 0.048,
        "2": 0.263,
        "3": 0.631,
        "4": 0.732,
        "5": 0.808
      },
      "tierCi95HalfWidths": {
        "1": 0.0126,
        "2": 0.0286,
        "3": 0.0283,
        "4": 0.0259,
        "5": 0.0231
      },
      "maxTierCi95HalfWidth": 0.0286,
      "convergedByMargin": true,
      "adjacentDominanceWinRates": {
        "tier2VsTier1": 0.853,
        "tier3VsTier2": 0.894,
        "tier4VsTier3": 0.629,
        "tier5VsTier4": 0.607,
        "tier5VsTier1": 1
      }
    },
    "vortex_alliances": {
      "triadId": "vortex_alliances",
      "triadTitle": "Tríade de Vórtex (Fogo Astral, Evolução Quimérica & Astrolábio Axial)",
      "archetypeIds": [
        "dual_blue_green",
        "dual_red_blue",
        "dual_blue_neutral"
      ],
      "matchesPerCell": 329,
      "totalLadderMatches": 3288,
      "tierOverallWinRates": {
        "1": 0.081,
        "2": 0.233,
        "3": 0.574,
        "4": 0.773,
        "5": 0.813
      },
      "tierCi95HalfWidths": {
        "1": 0.0165,
        "2": 0.0275,
        "3": 0.0294,
        "4": 0.026,
        "5": 0.0237
      },
      "maxTierCi95HalfWidth": 0.0294,
      "convergedByMargin": true,
      "adjacentDominanceWinRates": {
        "tier2VsTier1": 0.73,
        "tier3VsTier2": 0.848,
        "tier4VsTier3": 0.737,
        "tier5VsTier4": 0.55,
        "tier5VsTier1": 0.996
      }
    },
    "eclipse_alliances": {
      "triadId": "eclipse_alliances",
      "triadTitle": "Tríade de Eclipse (Tormenta Abissal, Podridão Eterna & Guilda Axial)",
      "archetypeIds": [
        "dual_blue_purple",
        "dual_purple_green",
        "dual_purple_neutral"
      ],
      "matchesPerCell": 324,
      "totalLadderMatches": 3240,
      "tierOverallWinRates": {
        "1": 0.036,
        "2": 0.297,
        "3": 0.624,
        "4": 0.761,
        "5": 0.773
      },
      "tierCi95HalfWidths": {
        "1": 0.0108,
        "2": 0.0299,
        "3": 0.0299,
        "4": 0.0262,
        "5": 0.0253
      },
      "maxTierCi95HalfWidth": 0.0299,
      "convergedByMargin": true,
      "adjacentDominanceWinRates": {
        "tier2VsTier1": 0.894,
        "tier3VsTier2": 0.856,
        "tier4VsTier3": 0.649,
        "tier5VsTier4": 0.497,
        "tier5VsTier1": 0.996
      }
    },
    "solaria_alliances": {
      "triadId": "solaria_alliances",
      "triadTitle": "Tríade de Solária (Forja do Zênite, Inquisição Crepuscular & Bastião Axial)",
      "archetypeIds": [
        "dual_blue_gold",
        "dual_purple_gold",
        "dual_gold_neutral"
      ],
      "matchesPerCell": 348,
      "totalLadderMatches": 3480,
      "tierOverallWinRates": {
        "1": 0.02,
        "2": 0.278,
        "3": 0.615,
        "4": 0.775,
        "5": 0.831
      },
      "tierCi95HalfWidths": {
        "1": 0.0096,
        "2": 0.029,
        "3": 0.0291,
        "4": 0.0248,
        "5": 0.0225
      },
      "maxTierCi95HalfWidth": 0.0291,
      "convergedByMargin": true,
      "adjacentDominanceWinRates": {
        "tier2VsTier1": 0.942,
        "tier3VsTier2": 0.917,
        "tier4VsTier3": 0.687,
        "tier5VsTier4": 0.567,
        "tier5VsTier1": 1
      }
    }
  }
};

export const BICOLOR_ARCHETYPE_MASTERY: Partial<Record<BicolorArchetypeId, BicolorArchetypeMastery>> = unpackMasteryRecord<BicolorArchetypeId, BicolorArchetypeMastery>({
  "dual_red_gold": {
    "archetypeId": "dual_red_gold",
    "domains": [
      "red",
      "gold"
    ],
    "isAxialAlliance": false,
    "triadId": "pyros_alliances",
    "classicDeckId": "deck_dual_draconic_pact",
    "name": "Pacto das Escamas Imperiais",
    "subtitle": "Pacto Duplo 🔥+☀️ • Dragões Solares & Escudo Divino",
    "strategySummary": "Combina Guardiões e Escudo Divino de Solária com Fúria Crescente, Voo e Sopro Dracônico de Pyros para trocas invencíveis.",
    "tacticalIdentity": "midrange",
    "coverCardId": "red_100_dragao_vulcanico_anciao",
    "generationsEvolved": 26,
    "matchesSimulated": 7996,
    "seedWinRate": 0.548,
    "championWinRate": 0.551,
    "vsMonocolorWinRate": 0.766,
    "championDeckJaccardStability": 0.852,
    "medianCardCi95HalfWidth": 0.0561,
    "domainCardBreakdown": {
      "gold": 42,
      "red": 48,
      "neutral": 10
    },
    "crossDomainCombos": [
      [
        935,
        457,
        1,
        0.479,
        8,
        " (100% WR em 8 duelos cruzados)"
      ],
      [
        457,
        460,
        1,
        0.449,
        9,
        " (100% WR em 9 duelos cruzados)"
      ],
      [
        935,
        11,
        0.938,
        0.417,
        32,
        " (94% WR em 32 duelos cruzados)"
      ],
      [
        175,
        913,
        0.938,
        0.417,
        16,
        " (94% WR em 16 duelos cruzados)"
      ],
      [
        145,
        175,
        0.923,
        0.372,
        13,
        " (92% WR em 13 duelos cruzados)"
      ],
      [
        205,
        508,
        0.923,
        0.372,
        13,
        " (92% WR em 13 duelos cruzados)"
      ]
    ],
    "learnedProfile": {
      "deckId": "dual_red_gold",
      "deckName": "Pacto das Escamas Imperiais",
      "archetypeTag": "midrange",
      "generationsTrained": 20,
      "matchesSimulated": 7932,
      "baselineWinRate": 0.548,
      "trainedWinRate": 0.551,
      "weights": {
        "aggroFaceBias": 1.19,
        "tradeValueBias": 1,
        "guardianPriority": 1.24,
        "flyingEvasionBias": 1.32,
        "stackConsolidationBias": 1,
        "antiAoeSpreadBias": 1,
        "spellHoldPatience": 1,
        "relicPriority": 1,
        "ascensionEagerness": 1.18,
        "bloodPactThresholdHp": 24,
        "domainExpansionEagerness": 1.03,
        "sovPowerTempoBias": 1,
        "synergyHoldBonus": 20,
        "mulliganCurveTarget": 2.9
      },
      "mk": [
        278,
        205,
        272,
        913,
        910,
        144
      ],
      "cp": [
        605,
        149,
        23,
        272,
        878,
        796,
        460,
        166,
        798,
        797
      ],
      "ca": [
        11,
        144,
        145,
        175,
        205,
        272,
        278,
        381,
        509,
        605,
        800,
        910
      ],
      "hb": [
        [
          5,
          13.5
        ],
        [
          7,
          14.4
        ],
        [
          11,
          17.3
        ],
        [
          35,
          19
        ],
        [
          144,
          12
        ],
        [
          145,
          9.5
        ],
        [
          175,
          24
        ],
        [
          205,
          14.6
        ],
        [
          209,
          13.1
        ],
        [
          272,
          18
        ],
        [
          278,
          20.7
        ],
        [
          381,
          12.8
        ],
        [
          460,
          9
        ],
        [
          508,
          18.8
        ],
        [
          509,
          18.4
        ],
        [
          572,
          7.8
        ],
        [
          605,
          14.7
        ],
        [
          698,
          17
        ],
        [
          798,
          18.5
        ],
        [
          799,
          15.6
        ],
        [
          800,
          20.1
        ],
        [
          910,
          17.7
        ],
        [
          913,
          21.1
        ],
        [
          935,
          20.9
        ],
        [
          1034,
          24
        ],
        [
          1037,
          17.8
        ],
        [
          1050,
          15
        ],
        [
          1067,
          20
        ],
        [
          1068,
          20
        ],
        [
          1119,
          20
        ],
        [
          1160,
          11
        ]
      ],
      "sp": [
        [
          175,
          11
        ],
        [
          175,
          272
        ],
        [
          175,
          605
        ],
        [
          175,
          910
        ],
        [
          145,
          1034
        ],
        [
          175,
          205
        ],
        [
          1037,
          913
        ],
        [
          145,
          175
        ],
        [
          278,
          910
        ],
        [
          278,
          11
        ]
      ],
      "dc": [
        [
          935,
          457,
          1,
          0.479,
          8,
          " (100% WR em 8 duelos cruzados)"
        ],
        [
          457,
          460,
          1,
          0.449,
          9,
          " (100% WR em 9 duelos cruzados)"
        ],
        [
          935,
          11,
          0.938,
          0.417,
          32,
          " (94% WR em 32 duelos cruzados)"
        ],
        [
          175,
          913,
          0.938,
          0.417,
          16,
          " (94% WR em 16 duelos cruzados)"
        ],
        [
          145,
          175,
          0.923,
          0.372,
          13,
          " (92% WR em 13 duelos cruzados)"
        ],
        [
          205,
          508,
          0.923,
          0.372,
          13,
          " (92% WR em 13 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        935,
        0.2427,
        0.1601,
        0.0826,
        0.8,
        0.126,
        90
      ],
      [
        800,
        0.2254,
        -0.0025,
        0.2279,
        0.818,
        0.836,
        11
      ],
      [
        35,
        0.2004,
        -0.1502,
        0.3506,
        0.8,
        0.973,
        5
      ],
      [
        508,
        0.1946,
        0.0624,
        0.1322,
        0.769,
        0.473,
        39
      ],
      [
        798,
        0.1894,
        -0.0255,
        0.2149,
        0.786,
        0.906,
        14
      ],
      [
        175,
        0.1829,
        0.0591,
        0.1238,
        0.773,
        0.777,
        44
      ],
      [
        698,
        0.1564,
        -0.0886,
        0.245,
        0.75,
        0.852,
        12
      ],
      [
        11,
        0.1008,
        0.0474,
        0.0535,
        0.659,
        0.142,
        302
      ],
      [
        7,
        0.0984,
        -0.1287,
        0.2271,
        0.688,
        0.761,
        16
      ],
      [
        5,
        0.078,
        -0.046,
        0.124,
        0.661,
        0.634,
        56
      ],
      [
        209,
        0.0682,
        -0.1408,
        0.209,
        0.65,
        0.615,
        20
      ],
      [
        509,
        0.0629,
        -0.1461,
        0.209,
        0.65,
        0.722,
        20
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "AQEBAAAAAAAAAwMDAgICAAAAAQEBAwMDAwMDBAQAAAAAAAAEBAQEAAMDAwQEAgICAAIAAAACAAAABAICAwMDAwMBBAQEBAQEBAEBAQQEAwMEAAAEAAACAwIEAwMDAQEBBAECABAQEJGRkQsLC42NjTw8PJCQkMnJyZGRkY6Ojj1aAwMDzc3NWlo9WRIcHByIiF1dXcxezs7OQZOTk1VBQQYGaWlpF6BVoKBVVlbMzMxZWRsbURISiMzMXhteVgZraxsbFj0XQJ4=",
        0,
        0,
        76,
        24,
        3.11,
        0.043,
        0.0122
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "AQEBAAAAAAAAAwMDAgICAAAAAQEBAwMDAwMDBAQAAAAAAAAEBAQEAAMDAwAAAgICAAIAAAACAAAABAICAwMDAwMBBAQEBAQEBAEBAQQEAwMDAAAEAAACAwIEAwMDAAABBAQCABAQEJGRkQsLC42NjTw8PJCQkMnJyZGRkY6Ojj1aAwMDzc3NWlo9WRIcHBwjI11dXcxezs7OQZOTk1VBQQYGaWlpF6BVoKBVVlbMzMxZWRsbpxISiMzMXhteVgZra6+vFj0aQJ4=",
        0,
        6,
        70,
        24,
        3.15,
        0.276,
        0.0291
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "AQEBAAAAAAAAAwMDAgICAAAAAQEBAwMDAwMDBAQAAAAAAAAEBAQEBAMDAwAAAgICAAAAAAACAAAABAQCAAADAwMCBAQEBAIBAQEBAQQEAwMDAAAEAAACAgIDAwMDAAABAQQCABAQEJGRkQsLC42NjTw8PJCQkMnJyZGRkY6Ojj1aAwMDzc3NWlo9WVkcHBwjI11dXczMzs7OQZOTkyxfQZWVaWlpQ1VVVaBBfX3MzMw9WRsdpxISiBLMXl5ebm5ra6+vFv0aQJ4=",
        3,
        14,
        59,
        24,
        3.33,
        0.615,
        0.0283
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "AQEBAAAAAAAAAwMDAgICAAAAAQEBAwMDAwMDBAQAAAAAAAAEBAEEBAMDAwAAAgICAAAAAAACAAAABAQEAAADAwMCAAICAAIBAQEBAQQEAwMDBAAEAAAAAAIDAwMDAAABAQQCABAQEJGRkQsLC42NjTw8PJCQkMnJyZGRkY6Ojj1aAwMDzc3NWlr8WVkcHBwjI11dXczMzs7ORZOTkyxfK5WVaWlpQ6aoqJdBfX3MzMw9PR0dp1kSiBISExO6bm5ra6+vFv0aQJ4=",
        6,
        22,
        48,
        24,
        3.52,
        0.719,
        0.0273
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "AQEBAAAAAAAAAwMDAgICAAAAAQEBAwMDAwMDBAAAAAAAAAAAAwEDAwMDAwAAAgICAwMAAAACAAAABAQEAAADAwMCAAICAAMBAQEBAQICAwMDAgIEAAAAAAIDAwMDAAABAQQCABAQEJGRkQsLC42NjTw8PJCQkMnJyZGRkY6OjgrRAwMDzc3NByD8Hx8cHBwjI11dXR4ezs7ORZOTkyxfK5WVaWlpQ6aoqJcLfX3MzMy7ux0dp7y8iAUFExO6bm5ra6+vFv0aQJ4=",
        10,
        33,
        33,
        24,
        3.86,
        0.828,
        0.0219
      ]
    ]
  },
  "dual_blue_purple": {
    "archetypeId": "dual_blue_purple",
    "domains": [
      "blue",
      "purple"
    ],
    "isAxialAlliance": false,
    "triadId": "eclipse_alliances",
    "classicDeckId": "deck_dual_abyssal_storm",
    "name": "Pacto da Tormenta Abissal",
    "subtitle": "Pacto Duplo ❄️+💀 • Estase Glacial & Execução Umbral",
    "strategySummary": "Trava a Vanguarda rival com Congelamento e Alcance enquanto ceifadores de Toque Letal, remoções umbrais e compra arcana esmagam por atrito.",
    "tacticalIdentity": "control",
    "coverCardId": "blue_80_senhor_tempo",
    "generationsEvolved": 26,
    "matchesSimulated": 7580,
    "seedWinRate": 0.345,
    "championWinRate": 0.498,
    "vsMonocolorWinRate": 0.578,
    "championDeckJaccardStability": 0.905,
    "medianCardCi95HalfWidth": 0.1511,
    "domainCardBreakdown": {
      "blue": 58,
      "neutral": 10,
      "purple": 32
    },
    "crossDomainCombos": [
      [
        816,
        545,
        1,
        0.532,
        9,
        " (100% WR em 9 duelos cruzados)"
      ],
      [
        816,
        1033,
        1,
        0.532,
        8,
        " (100% WR em 8 duelos cruzados)"
      ],
      [
        591,
        1033,
        1,
        0.532,
        9,
        " (100% WR em 9 duelos cruzados)"
      ],
      [
        1035,
        935,
        1,
        0.532,
        10,
        " (100% WR em 10 duelos cruzados)"
      ],
      [
        1015,
        103,
        1,
        0.502,
        12,
        " (100% WR em 12 duelos cruzados)"
      ],
      [
        1015,
        1033,
        1,
        0.502,
        12,
        " (100% WR em 12 duelos cruzados)"
      ]
    ],
    "learnedProfile": {
      "deckId": "dual_blue_purple",
      "deckName": "Pacto da Tormenta Abissal",
      "archetypeTag": "control",
      "generationsTrained": 20,
      "matchesSimulated": 7516,
      "baselineWinRate": 0.345,
      "trainedWinRate": 0.498,
      "weights": {
        "aggroFaceBias": 0.96,
        "tradeValueBias": 1.36,
        "guardianPriority": 1,
        "flyingEvasionBias": 1.02,
        "stackConsolidationBias": 1,
        "antiAoeSpreadBias": 1,
        "spellHoldPatience": 1.26,
        "relicPriority": 1,
        "ascensionEagerness": 1.04,
        "bloodPactThresholdHp": 24,
        "domainExpansionEagerness": 0.96,
        "sovPowerTempoBias": 1,
        "synergyHoldBonus": 24,
        "mulliganCurveTarget": 2.8
      },
      "mk": [
        591,
        1015,
        52,
        909
      ],
      "cp": [
        736,
        52,
        1015,
        812,
        724,
        838,
        83,
        633,
        629,
        591
      ],
      "ca": [
        54,
        93,
        103,
        545,
        741,
        816,
        840,
        1015,
        1027,
        1029,
        1033,
        1035
      ],
      "hb": [
        [
          52,
          14.2
        ],
        [
          54,
          21.7
        ],
        [
          91,
          6.2
        ],
        [
          93,
          16.4
        ],
        [
          103,
          17.3
        ],
        [
          545,
          24
        ],
        [
          591,
          13.6
        ],
        [
          736,
          8.8
        ],
        [
          741,
          24
        ],
        [
          816,
          24
        ],
        [
          838,
          9.5
        ],
        [
          840,
          24
        ],
        [
          935,
          16.2
        ],
        [
          1015,
          15.3
        ],
        [
          1027,
          24
        ],
        [
          1029,
          24
        ],
        [
          1033,
          24
        ],
        [
          1035,
          24
        ],
        [
          1074,
          13.8
        ],
        [
          1088,
          11
        ],
        [
          1107,
          11
        ],
        [
          1108,
          11
        ],
        [
          1151,
          15
        ]
      ],
      "sp": [
        [
          816,
          93
        ],
        [
          545,
          91
        ],
        [
          816,
          545
        ],
        [
          1029,
          54
        ],
        [
          1035,
          54
        ],
        [
          1035,
          91
        ],
        [
          816,
          1029
        ],
        [
          1035,
          1015
        ],
        [
          816,
          54
        ],
        [
          545,
          1015
        ]
      ],
      "dc": [
        [
          816,
          545,
          1,
          0.532,
          9,
          " (100% WR em 9 duelos cruzados)"
        ],
        [
          816,
          1033,
          1,
          0.532,
          8,
          " (100% WR em 8 duelos cruzados)"
        ],
        [
          591,
          1033,
          1,
          0.532,
          9,
          " (100% WR em 9 duelos cruzados)"
        ],
        [
          1035,
          935,
          1,
          0.532,
          10,
          " (100% WR em 10 duelos cruzados)"
        ],
        [
          1015,
          103,
          1,
          0.502,
          12,
          " (100% WR em 12 duelos cruzados)"
        ],
        [
          1015,
          1033,
          1,
          0.502,
          12,
          " (100% WR em 12 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        1035,
        0.2832,
        0.157,
        0.1262,
        0.811,
        0.602,
        37
      ],
      [
        1033,
        0.2604,
        0.1308,
        0.1296,
        0.789,
        0.631,
        38
      ],
      [
        545,
        0.1868,
        0.0637,
        0.1231,
        0.712,
        0.544,
        52
      ],
      [
        1027,
        0.1651,
        0.0011,
        0.164,
        0.7,
        0.748,
        30
      ],
      [
        103,
        0.1618,
        0.0379,
        0.1239,
        0.685,
        0.518,
        54
      ],
      [
        935,
        0.1369,
        0.0663,
        0.0706,
        0.651,
        0.34,
        175
      ],
      [
        840,
        0.1154,
        -0.0792,
        0.1947,
        0.652,
        0.785,
        23
      ],
      [
        52,
        0.0927,
        0.0137,
        0.079,
        0.621,
        0.609,
        145
      ],
      [
        1074,
        0.0846,
        -0.0362,
        0.1208,
        0.603,
        0.422,
        63
      ],
      [
        816,
        0.0817,
        -0.0007,
        0.0825,
        0.596,
        0.327,
        136
      ],
      [
        591,
        0.0798,
        -0.0053,
        0.0851,
        0.611,
        0.675,
        126
      ],
      [
        1015,
        0.0755,
        0.0096,
        0.0659,
        0.596,
        0.465,
        213
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "BAQEBAAAAgICBAMDAwEBAQEBAAAAAgICAwMDBAQEBAQAAAAEBAQEBAQEBAAAAAIEAAAABAQAAgIEAAICAwMDAAAAAAAAAwMDBAQAAAAAAAAAAAAEAwAAAAICAgEBAQMAAAQAA0BTVEm+vk9PT0mNjcJBQUGRkVNTU2pqaj8/P1NTVFJUJiYmHx9SQGhoZGQzMzOCYltbW2J9S4KCYmkdHff392lZWVlLSywsLGRSNDQ06OjoNjY2QC5FRUV1dXVCQkIuamloai4=",
        0,
        0,
        79,
        21,
        3.06,
        0.036,
        0.0108
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "BAQEBAAAAgICBAMDAwEBAQEBAAAAAgICAwMDBAQEBAQAAAABAQQEAgIEBAAAAAIEAAAABAQAAgIEAAICAwMDAAAAAAAAAwMDBAQAAAAAAAAAAAAEAwAAAAICAgEBAQMAAAIAA0BTVEm+vk9PT0mNjcJBQUGRkVNTU2pqaj8/P1NTVFJUJiYmRUVSQHt7ZGQzMzOCYltbW2J/S4KCYmkdHff392lZWVlLSywsLGRSNDQ06OjoNjY2QC5FRUV1dXVCQkIuamkWai4=",
        0,
        6,
        73,
        21,
        3.12,
        0.297,
        0.0299
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "BAQEAwAAAgICAwMDAwEBAQEBAAAAAgICAwMDBAQEAQQAAAABAQQEAgIEBAAAAAIEAAAABAQAAgIEAAICAwMDAQAAAAAAAwMDBAQAAAAAAAAAAAACAgAAAAICAgEBAQIAAQIAA0BTVKe+vk9PT6eNjcJBQUGRkVNTU2pqaj8/PwsyVJdUJiYmRUVSUnt7U1MzMzOCYltbW2J/S4KCYmkdHff3915ZWVlLSywsLGRkNDQ06OjoNjY2eXlFRUV1dXVCQkIWal4Wau0=",
        3,
        14,
        63,
        20,
        3.17,
        0.624,
        0.0299
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "BAQEAwAAAgICAwMDAwEBAQEBAAAAAgICAwMDBAQAAQQAAAABAQMDAgIAAAAAAAQEAAAABAQCAgIEAAICAwMDAQAAAAAAAwMDAgIAAAAAAAAAAAACAgAAAAICAgEBAQIAAQIAA0BTVKe+vk9PT6eNjcJBQUGRkVNTU2pqaj8/PwsyP5dUJiYmRUUwMHt75+czMzMJYltbW2J/goKCYmfg4Pf3915ZWVlLSywsLNTUNDQ06OjoNjY2eXlFRUV1dXVCQkIWal4Wau0=",
        6,
        22,
        54,
        18,
        3.39,
        0.761,
        0.0262
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "BAQEAwAAAgICAwMDAwEBAQEBAAAAAgICAwMDBAQAAQEAAAABAQMDAgIAAAAAAAQEAAAAAwQDAAACAAICAwMDAQAAAAMDAwMDAgIAAAAAAAAAAAACAgAAAAICAgEBAQIAAQIAA0BTVKe+vk9PT6eNjcJBQUGRkVNTU2pqaj8/PwsyP5dLJiYmRUUwMHt75+czMzMJA1tbW0h/Rl1dIWfg4Pf3915ZWVlFRSwsLNTUNDQ06OjoNjY2eXlFRUV1dXVCQkIWal4Wau0=",
        10,
        27,
        45,
        18,
        3.61,
        0.773,
        0.0253
      ]
    ]
  },
  "dual_red_green": {
    "archetypeId": "dual_red_green",
    "domains": [
      "red",
      "green"
    ],
    "isAxialAlliance": false,
    "triadId": "veridia_alliances",
    "classicDeckId": "deck_dual_primal_fury",
    "name": "Pacto da Ruína Selvagem",
    "subtitle": "Pacto Duplo 🔥+🌿 • Rampa Vulcânica, Ímpeto & Atropelar",
    "strategySummary": "Acelera Essência com rampa silvestre para lançar Behemoths e Dragões com Ímpeto e Atropelar antes que a defesa inimiga se estabilize.",
    "tacticalIdentity": "ramp",
    "coverCardId": "red_46_tirano_carmesim",
    "generationsEvolved": 26,
    "matchesSimulated": 7804,
    "seedWinRate": 0.607,
    "championWinRate": 0.545,
    "vsMonocolorWinRate": 0.859,
    "championDeckJaccardStability": 0.905,
    "medianCardCi95HalfWidth": 0.06,
    "domainCardBreakdown": {
      "neutral": 10,
      "red": 51,
      "green": 39
    },
    "crossDomainCombos": [
      [
        114,
        665,
        1,
        0.455,
        9,
        " (100% WR em 9 duelos cruzados)"
      ],
      [
        665,
        119,
        1,
        0.455,
        9,
        " (100% WR em 9 duelos cruzados)"
      ],
      [
        2,
        799,
        1,
        0.455,
        9,
        " (100% WR em 9 duelos cruzados)"
      ],
      [
        866,
        483,
        1,
        0.455,
        9,
        " (100% WR em 9 duelos cruzados)"
      ],
      [
        114,
        664,
        1,
        0.455,
        8,
        " (100% WR em 8 duelos cruzados)"
      ],
      [
        866,
        11,
        0.933,
        0.419,
        15,
        " (93% WR em 15 duelos cruzados)"
      ]
    ],
    "learnedProfile": {
      "deckId": "dual_red_green",
      "deckName": "Pacto da Ruína Selvagem",
      "archetypeTag": "ramp",
      "generationsTrained": 20,
      "matchesSimulated": 7740,
      "baselineWinRate": 0.607,
      "trainedWinRate": 0.545,
      "weights": {
        "aggroFaceBias": 1.24,
        "tradeValueBias": 1.12,
        "guardianPriority": 1,
        "flyingEvasionBias": 1,
        "stackConsolidationBias": 1,
        "antiAoeSpreadBias": 1,
        "spellHoldPatience": 1,
        "relicPriority": 1,
        "ascensionEagerness": 1.28,
        "bloodPactThresholdHp": 24,
        "domainExpansionEagerness": 1.22,
        "sovPowerTempoBias": 1,
        "synergyHoldBonus": 20,
        "mulliganCurveTarget": 2.9
      },
      "mk": [
        300,
        591,
        913,
        910
      ],
      "cp": [
        300,
        23,
        797,
        665,
        862,
        143,
        609,
        798,
        700,
        762
      ],
      "ca": [
        2,
        11,
        114,
        116,
        119,
        140,
        205,
        300,
        509,
        605,
        665,
        799
      ],
      "hb": [
        [
          2,
          14
        ],
        [
          11,
          17.6
        ],
        [
          114,
          18.3
        ],
        [
          115,
          10.9
        ],
        [
          116,
          16.2
        ],
        [
          119,
          12.9
        ],
        [
          140,
          24
        ],
        [
          205,
          15.1
        ],
        [
          300,
          24
        ],
        [
          509,
          24
        ],
        [
          605,
          14.2
        ],
        [
          665,
          24
        ],
        [
          700,
          18.8
        ],
        [
          799,
          24
        ],
        [
          800,
          24
        ],
        [
          853,
          18.1
        ],
        [
          862,
          24
        ],
        [
          863,
          24
        ],
        [
          866,
          19.7
        ],
        [
          910,
          18.3
        ],
        [
          913,
          22.9
        ],
        [
          1034,
          24
        ],
        [
          1036,
          24
        ],
        [
          1079,
          20
        ],
        [
          1091,
          11
        ],
        [
          1092,
          15
        ],
        [
          1101,
          11
        ],
        [
          1115,
          20
        ]
      ],
      "sp": [
        [
          853,
          509
        ],
        [
          11,
          1034
        ],
        [
          910,
          509
        ],
        [
          1036,
          11
        ],
        [
          863,
          910
        ],
        [
          1034,
          300
        ],
        [
          1036,
          910
        ],
        [
          863,
          913
        ],
        [
          863,
          11
        ],
        [
          140,
          2
        ]
      ],
      "dc": [
        [
          114,
          665,
          1,
          0.455,
          9,
          " (100% WR em 9 duelos cruzados)"
        ],
        [
          665,
          119,
          1,
          0.455,
          9,
          " (100% WR em 9 duelos cruzados)"
        ],
        [
          2,
          799,
          1,
          0.455,
          9,
          " (100% WR em 9 duelos cruzados)"
        ],
        [
          866,
          483,
          1,
          0.455,
          9,
          " (100% WR em 9 duelos cruzados)"
        ],
        [
          114,
          664,
          1,
          0.455,
          8,
          " (100% WR em 8 duelos cruzados)"
        ],
        [
          866,
          11,
          0.933,
          0.419,
          15,
          " (93% WR em 15 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        800,
        0.409,
        0.3213,
        0.0877,
        1,
        0.925,
        5
      ],
      [
        799,
        0.2811,
        0.1595,
        0.1216,
        0.867,
        0.815,
        30
      ],
      [
        665,
        0.272,
        0.1423,
        0.1296,
        0.857,
        0.808,
        28
      ],
      [
        866,
        0.2151,
        0.1077,
        0.1074,
        0.796,
        0.729,
        54
      ],
      [
        1034,
        0.2064,
        0.0231,
        0.1833,
        0.789,
        0.765,
        19
      ],
      [
        700,
        0.1964,
        -0.0186,
        0.2149,
        0.786,
        0.891,
        14
      ],
      [
        509,
        0.1962,
        0.0042,
        0.1921,
        0.778,
        0.735,
        18
      ],
      [
        1036,
        0.124,
        -0.0926,
        0.2166,
        0.706,
        0.742,
        17
      ],
      [
        605,
        0.0937,
        0.0297,
        0.0639,
        0.65,
        0.222,
        214
      ],
      [
        863,
        0.0831,
        -0.0856,
        0.1687,
        0.667,
        0.776,
        30
      ],
      [
        300,
        0.0661,
        0.0121,
        0.0539,
        0.613,
        0.052,
        313
      ],
      [
        119,
        0.0644,
        0.0014,
        0.063,
        0.626,
        0.328,
        227
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "AgICAQEBAwMDAwMDAAAAAwQEAwAAAAICAgAAAAQAAAAEAgICAwMEAAACBAEBAAAAAgIDAAQEBAEEBAEDAwEBAwQCAgICBAICAgQCAwMAAQQEAAAAAQEBAAADAAQCAgIAAAEBAk9PTywsLJGRkY6OjgsLC41DTVV3d3ePj48CAgJazc3NWl1dXRwcWszMtT35+QMDA7W1HBJDQ00DTSJpWVlpaVkilPSTk3L0MZNylBsbzPmIiB8fH8zMzM7OG85ylDExEhIDA/Q=",
        0,
        0,
        75,
        25,
        3.18,
        0.048,
        0.0126
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "AgICAQEBAwMDAwMDAAAAAwQEAwAAAAICAgAAAAQAAAAEAgICAwMEAAACBAEBAAAAAgIDAAQEBAEEBAEAAAEBAAACAgICBAICAgQCAwMAAQQEAAAAAQEBAAADAAQCAgIAAAEBAk9PTywsLJGRkY6OjgsLC41DTVV3d3ePj48CAgJazc3NWl1dXRwcWszMtT35+QMDA7W1HBJDQ00DTURpcnJpaY+PlPSTk3I7MZNylBsbzPmIiB8fH8zMzM7OG85ylDExEhIDA/Q=",
        0,
        6,
        69,
        25,
        3.21,
        0.263,
        0.0286
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "AgICAQEBAwMDAwMDAAAAAwQEAwAAAAICAgAAAAQAAAAEAgICAAMEAAACAgEBAAAAAAIDAwQEBAQEBAEAAAEBAAABAQICAgICAgMCAQMAAAAAAAAAAQEBAAADAwMCAQEAAAQBAE9PTywsLJGRkY6OjgsLC41DTVV3d3ePj48CAgJazc3NWl1dXdEcWhLMtbX5+QMDA861HBxDQ003W0RpcnIDA4+P4+Mxkzs7MTFik/kbzMwjIx8fH8zMzM7OGxtik2lpEhJNA4s=",
        3,
        14,
        58,
        25,
        3.32,
        0.631,
        0.0283
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "AgICAQEBAwMDAwMDAAAAAwQEAwAAAAICAgAAAAQAAAAEAgICAAEEAAAAAAAAAAAAAwMEAwQEAQQEBAEAAAEBAAABAQICAgIBAgMDAQEAAAAAAAAAAQEBAAABAwMAAQEDAwQEAE9PTywsLJGRkY6OjgsLC41DTVV3d3ePj48CAgIKzc3NWl1dXdH8WhISz8/MzAMDAx0dWhxDQwo3W0QDcnIDA4+P4+MxMTs7aTFiWvn5EswjIx8fH8zMzBMT+Rtif2lpHBxNTYs=",
        6,
        22,
        47,
        25,
        3.48,
        0.732,
        0.0259
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "AgICAQEBAwMDAwMDAAAAAwQEAwAAAAICAgAAAAQAAAADAgICAAEBAwMAAAMDAAAAAwMAAAQAAQQEBAMAAAMDAAABAQICAgICAgMDAgIAAAAAAAAAAQEBAAACAgMAAAACAgICAE9PTywsLJGRkY6OjgsLC41DTVV3d3ePj48CAgIKzc3NIF1dXdH8/R4ez88fHwMDAx0dBgYMdAo3W0RecnJfX4+P4+OZmTs7mJhiWry8FxcjIx8fH8zMzBMTurpif3NzYWH6+os=",
        10,
        47,
        18,
        25,
        4.13,
        0.808,
        0.0231
      ]
    ]
  },
  "dual_blue_gold": {
    "archetypeId": "dual_blue_gold",
    "domains": [
      "blue",
      "gold"
    ],
    "isAxialAlliance": false,
    "triadId": "solaria_alliances",
    "classicDeckId": "deck_dual_arcane_forge",
    "name": "Pacto da Forja do Zênite",
    "subtitle": "Pacto Duplo ❄️+☀️ • Cidadela Cronomante & Escudo Celeste",
    "strategySummary": "Ergue muralhas de Armadura e Escudo Divino sustentadas por compra de cartas cronomante, Congelamento cirúrgico e arcontes aéreos.",
    "tacticalIdentity": "control",
    "coverCardId": "gold_157_dragao_soberano_alvorada",
    "generationsEvolved": 26,
    "matchesSimulated": 7876,
    "seedWinRate": 0.512,
    "championWinRate": 0.577,
    "vsMonocolorWinRate": 0.781,
    "championDeckJaccardStability": 0.887,
    "medianCardCi95HalfWidth": 0.0782,
    "domainCardBreakdown": {
      "neutral": 10,
      "gold": 45,
      "blue": 45
    },
    "crossDomainCombos": [
      [
        57,
        272,
        1,
        0.453,
        10,
        " (100% WR em 10 duelos cruzados)"
      ],
      [
        54,
        57,
        1,
        0.423,
        12,
        " (100% WR em 12 duelos cruzados)"
      ],
      [
        1068,
        381,
        1,
        0.423,
        9,
        " (100% WR em 9 duelos cruzados)"
      ],
      [
        226,
        272,
        0.929,
        0.381,
        28,
        " (93% WR em 28 duelos cruzados)"
      ],
      [
        70,
        784,
        0.929,
        0.381,
        14,
        " (93% WR em 14 duelos cruzados)"
      ],
      [
        54,
        781,
        0.923,
        0.376,
        13,
        " (92% WR em 13 duelos cruzados)"
      ]
    ],
    "learnedProfile": {
      "deckId": "dual_blue_gold",
      "deckName": "Pacto da Forja do Zênite",
      "archetypeTag": "control",
      "generationsTrained": 20,
      "matchesSimulated": 7812,
      "baselineWinRate": 0.512,
      "trainedWinRate": 0.577,
      "weights": {
        "aggroFaceBias": 0.98,
        "tradeValueBias": 1.32,
        "guardianPriority": 1.34,
        "flyingEvasionBias": 0.96,
        "stackConsolidationBias": 1,
        "antiAoeSpreadBias": 1,
        "spellHoldPatience": 1.22,
        "relicPriority": 1.18,
        "ascensionEagerness": 1.15,
        "bloodPactThresholdHp": 24,
        "domainExpansionEagerness": 1,
        "sovPowerTempoBias": 1,
        "synergyHoldBonus": 22,
        "mulliganCurveTarget": 2.9
      },
      "mk": [
        278,
        37,
        272,
        784,
        421,
        810
      ],
      "cp": [
        70,
        715,
        909,
        573,
        40,
        57,
        278,
        416,
        816,
        717
      ],
      "ca": [
        54,
        70,
        226,
        272,
        278,
        381,
        421,
        784,
        816,
        880,
        1031,
        1035
      ],
      "hb": [
        [
          54,
          21.3
        ],
        [
          57,
          18.7
        ],
        [
          70,
          17.9
        ],
        [
          221,
          9
        ],
        [
          226,
          22.5
        ],
        [
          272,
          16
        ],
        [
          278,
          15
        ],
        [
          381,
          10.3
        ],
        [
          421,
          9.8
        ],
        [
          781,
          12.2
        ],
        [
          784,
          24
        ],
        [
          816,
          24
        ],
        [
          880,
          20.7
        ],
        [
          1031,
          24
        ],
        [
          1035,
          24
        ],
        [
          1037,
          24
        ],
        [
          1068,
          20
        ],
        [
          1074,
          20
        ],
        [
          1088,
          11
        ],
        [
          1119,
          20
        ]
      ],
      "sp": [
        [
          1035,
          784
        ],
        [
          816,
          1035
        ],
        [
          54,
          1037
        ],
        [
          816,
          784
        ],
        [
          221,
          1037
        ],
        [
          816,
          381
        ],
        [
          54,
          1031
        ],
        [
          226,
          784
        ],
        [
          1035,
          54
        ],
        [
          816,
          421
        ]
      ],
      "dc": [
        [
          57,
          272,
          1,
          0.453,
          10,
          " (100% WR em 10 duelos cruzados)"
        ],
        [
          54,
          57,
          1,
          0.423,
          12,
          " (100% WR em 12 duelos cruzados)"
        ],
        [
          1068,
          381,
          1,
          0.423,
          9,
          " (100% WR em 9 duelos cruzados)"
        ],
        [
          226,
          272,
          0.929,
          0.381,
          28,
          " (93% WR em 28 duelos cruzados)"
        ],
        [
          70,
          784,
          0.929,
          0.381,
          14,
          " (93% WR em 14 duelos cruzados)"
        ],
        [
          54,
          781,
          0.923,
          0.376,
          13,
          " (92% WR em 13 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        226,
        0.245,
        0.1452,
        0.0998,
        0.843,
        0.42,
        51
      ],
      [
        880,
        0.234,
        0.0953,
        0.1387,
        0.846,
        0.701,
        26
      ],
      [
        57,
        0.1941,
        0.0476,
        0.1465,
        0.815,
        0.871,
        27
      ],
      [
        70,
        0.1417,
        0.0035,
        0.1382,
        0.757,
        0.758,
        37
      ],
      [
        1037,
        0.1019,
        -0.0654,
        0.1673,
        0.714,
        0.705,
        28
      ],
      [
        816,
        0.0923,
        0.0092,
        0.0832,
        0.689,
        0.393,
        119
      ],
      [
        54,
        0.0694,
        0.0164,
        0.0531,
        0.654,
        0.144,
        309
      ],
      [
        1035,
        0.0687,
        -0.0886,
        0.1573,
        0.676,
        0.614,
        34
      ],
      [
        272,
        0.0673,
        0.0192,
        0.048,
        0.647,
        0.059,
        380
      ],
      [
        278,
        0.0655,
        0.0108,
        0.0547,
        0.651,
        0.161,
        292
      ],
      [
        784,
        0.0603,
        -0.0006,
        0.0609,
        0.643,
        0.109,
        238
      ],
      [
        781,
        0.0486,
        -0.1086,
        0.1573,
        0.657,
        0.628,
        35
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "AwMDAAAABAAAAwMDAwMDAQEDAwMBAQEBAQEEBAQBAQMEAwAAAAAAAAEBAQQEAAMDBAQEBAEBAAAAAgQAAQAABAQEBAQEAgICBAQDAwQDAQEBBAQEAwMDAgIEAAMBAAACAwAAAZSUlJGRkUA03Y2NjSoqKrCwEREREBAQpaWlVFJAQ0MsVCwmJiY2NjZCQkJSUuguLlWgoFWnp5OTk0GgoaehoUlJSVBUU21tbVNTBwdkLhYWFmRkQGlpaUFBVUUHG580PSw06Bs=",
        0,
        0,
        81,
        19,
        3.06,
        0.02,
        0.0096
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "AwMDAAAABAAAAwMDAwMDAQEDAwMBAQEBAQEEBAQBAQMEAwAAAAAAAAEBAQQEAAMDBAQEBAEBAAAAAgQAAQAAAwMDAwQEAgICBAQDAwQDAQEBBAQEAwMDAgIEAAMBAAACAwAAAZSUlJGRkUA03Y2NjSoqKrCwEREREBAQpaWlVFJARUUsVCwmJiY2NjZCQkJSUuguLlWgoFWnp5OTk0Ggoaehoa+v6upUU21tbVNTBwdkLhYWFmRkQGlpaUFBVUUHG580PSw06Bs=",
        0,
        6,
        75,
        19,
        3.02,
        0.278,
        0.029
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "AwMDAAAABAAAAwMDAwMDAQEDAwMBAQEBAQEEBAQBAQMEAwAAAAAAAAEBAQQEAAQDBAMEBAABAAAAAQQAAAQEAwMDAwQEAgICBAQBAQQBAQEBBAQEAwMDAQIEAAEBAAECAwEAAZSUlJGRkUA03Y2NjSoqKrCwEREREBAQpaWlC1JSRUUsVCwmJiY2NjZCQkJTUkZALlVwX1Whp5OTk6egoaGgoK+v6upUVG1tbVNTfX1kTxYWFmRkQGlpaadBVUWyG59KPSxK6xs=",
        3,
        14,
        64,
        19,
        3.17,
        0.615,
        0.0291
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "AwMDAAAABAAAAwMDAwMDAQEDAwMBAQEBAQEEBAQBAQMEAwAAAAAAAAEBAQQEAAICBAMEBAAAAAAAAAQEBAQEAwMDAwQEAgICBAQBAQEBAQEBAQECAwMDAAAEAAEBAAECAwEAAZSUlJGRkUA03Y2NjSoqKrCwEREREBAQpaWlC1JSRUUsMiwmJiY2NjZCQkJTU0bLyw1wXyyhoZOTk6FVoKBVoK+v6upUVG1tbVRTfX1PTxYWFqCgCmlpaZmZVUWyG59KPSxK6xs=",
        6,
        22,
        56,
        16,
        3.26,
        0.775,
        0.0248
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "AwMDAAAABAAAAwMDAwMDAQEDAwMBAQEBAQEEAwMBAQAEAgAAAAAAAAEBAQICAAICBAMEBAICAAAAAAMDAwAAAwMDAwAAAgICAAABAQEBAQEBAQECAwMDAAADAAEBAAECAQEAAZSUlJGRkUA03Y2NjSoqKrCwEREREBAQpaWlCzAwRUXiMs8mJiY2NjZCQkLNzUbLyw1wXyyoqJOTk5dvEBCmpq+v6uooKG1tbTk5fX1PTxYWFqCgCmlpaZmZDUWyG59KPZdK6xs=",
        10,
        38,
        36,
        16,
        3.65,
        0.831,
        0.0225
      ]
    ]
  },
  "dual_purple_green": {
    "archetypeId": "dual_purple_green",
    "domains": [
      "purple",
      "green"
    ],
    "isAxialAlliance": false,
    "triadId": "eclipse_alliances",
    "classicDeckId": "deck_dual_eternal_rot",
    "name": "Pacto da Podridão Eterna",
    "subtitle": "Pacto Duplo 💀+🌿 • Cripta, Regeneração & Veneno",
    "strategySummary": "Funde Renascer e reanimação da Cripta com Guardiões regenerativos e Toque Letal em um ciclo inesgotável de vida e decomposição.",
    "tacticalIdentity": "attrition",
    "coverCardId": "green_49_dragao_esmeralda",
    "generationsEvolved": 26,
    "matchesSimulated": 7516,
    "seedWinRate": 0.417,
    "championWinRate": 0.567,
    "vsMonocolorWinRate": 0.672,
    "championDeckJaccardStability": 0.869,
    "medianCardCi95HalfWidth": 0.0472,
    "domainCardBreakdown": {
      "purple": 42,
      "neutral": 10,
      "green": 48
    },
    "crossDomainCombos": [
      [
        266,
        831,
        1,
        0.463,
        8,
        " (100% WR em 8 duelos cruzados)"
      ],
      [
        266,
        101,
        1,
        0.463,
        9,
        " (100% WR em 9 duelos cruzados)"
      ],
      [
        140,
        265,
        1,
        0.433,
        14,
        " (100% WR em 14 duelos cruzados)"
      ],
      [
        1083,
        101,
        1,
        0.433,
        8,
        " (100% WR em 8 duelos cruzados)"
      ],
      [
        863,
        1015,
        0.923,
        0.386,
        13,
        " (92% WR em 13 duelos cruzados)"
      ],
      [
        126,
        346,
        0.917,
        0.38,
        12,
        " (92% WR em 12 duelos cruzados)"
      ]
    ],
    "learnedProfile": {
      "deckId": "dual_purple_green",
      "deckName": "Pacto da Podridão Eterna",
      "archetypeTag": "attrition",
      "generationsTrained": 20,
      "matchesSimulated": 7452,
      "baselineWinRate": 0.417,
      "trainedWinRate": 0.567,
      "weights": {
        "aggroFaceBias": 1.04,
        "tradeValueBias": 1.34,
        "guardianPriority": 1.28,
        "flyingEvasionBias": 1,
        "stackConsolidationBias": 1,
        "antiAoeSpreadBias": 1,
        "spellHoldPatience": 1,
        "relicPriority": 1,
        "ascensionEagerness": 0.99,
        "bloodPactThresholdHp": 24,
        "domainExpansionEagerness": 1,
        "sovPowerTempoBias": 0.99,
        "synergyHoldBonus": 24,
        "mulliganCurveTarget": 2.6
      },
      "mk": [
        913,
        1015,
        126,
        910,
        639,
        101
      ],
      "cp": [
        562,
        99,
        76,
        738,
        835,
        128,
        858,
        93,
        861,
        831
      ],
      "ca": [
        76,
        84,
        101,
        114,
        126,
        140,
        265,
        266,
        267,
        346,
        349,
        483
      ],
      "hb": [
        [
          76,
          20.8
        ],
        [
          83,
          8.8
        ],
        [
          84,
          9.4
        ],
        [
          93,
          16.1
        ],
        [
          101,
          20.9
        ],
        [
          114,
          24
        ],
        [
          126,
          16.9
        ],
        [
          140,
          24
        ],
        [
          265,
          11.9
        ],
        [
          266,
          17.5
        ],
        [
          267,
          24
        ],
        [
          346,
          24
        ],
        [
          349,
          24
        ],
        [
          483,
          24
        ],
        [
          545,
          24
        ],
        [
          639,
          18.1
        ],
        [
          665,
          16.2
        ],
        [
          735,
          16.9
        ],
        [
          736,
          19.5
        ],
        [
          831,
          23.4
        ],
        [
          838,
          16.7
        ],
        [
          839,
          24
        ],
        [
          862,
          20.7
        ],
        [
          863,
          22.2
        ],
        [
          897,
          15.8
        ],
        [
          910,
          20.2
        ],
        [
          913,
          17.6
        ],
        [
          1015,
          24
        ],
        [
          1027,
          24
        ],
        [
          1033,
          24
        ],
        [
          1036,
          24
        ],
        [
          1053,
          15
        ],
        [
          1083,
          20
        ],
        [
          1117,
          20
        ],
        [
          1149,
          11
        ],
        [
          1151,
          15
        ]
      ],
      "sp": [
        [
          910,
          545
        ],
        [
          1015,
          346
        ],
        [
          265,
          1033
        ],
        [
          910,
          839
        ],
        [
          913,
          1033
        ],
        [
          545,
          101
        ],
        [
          114,
          346
        ],
        [
          897,
          1033
        ],
        [
          114,
          839
        ],
        [
          545,
          1015
        ]
      ],
      "dc": [
        [
          266,
          831,
          1,
          0.463,
          8,
          " (100% WR em 8 duelos cruzados)"
        ],
        [
          266,
          101,
          1,
          0.463,
          9,
          " (100% WR em 9 duelos cruzados)"
        ],
        [
          140,
          265,
          1,
          0.433,
          14,
          " (100% WR em 14 duelos cruzados)"
        ],
        [
          1083,
          101,
          1,
          0.433,
          8,
          " (100% WR em 8 duelos cruzados)"
        ],
        [
          863,
          1015,
          0.923,
          0.386,
          13,
          " (92% WR em 13 duelos cruzados)"
        ],
        [
          126,
          346,
          0.917,
          0.38,
          12,
          " (92% WR em 12 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        1033,
        0.2721,
        0.1101,
        0.1621,
        0.875,
        0.714,
        16
      ],
      [
        863,
        0.1889,
        0.0622,
        0.1267,
        0.795,
        0.776,
        39
      ],
      [
        266,
        0.1662,
        0.0437,
        0.1225,
        0.75,
        0.333,
        48
      ],
      [
        140,
        0.1578,
        0.0164,
        0.1415,
        0.75,
        0.5,
        36
      ],
      [
        735,
        0.1539,
        0.0077,
        0.1462,
        0.758,
        0.73,
        33
      ],
      [
        665,
        0.1378,
        -0.0744,
        0.2122,
        0.75,
        0.901,
        16
      ],
      [
        93,
        0.1359,
        -0.0089,
        0.1448,
        0.743,
        0.795,
        35
      ],
      [
        349,
        0.127,
        0.0539,
        0.0731,
        0.709,
        0.305,
        148
      ],
      [
        1036,
        0.1207,
        -0.0553,
        0.176,
        0.72,
        0.643,
        25
      ],
      [
        346,
        0.1117,
        -0.0173,
        0.129,
        0.694,
        0.3,
        49
      ],
      [
        736,
        0.1115,
        0.0299,
        0.0816,
        0.697,
        0.361,
        122
      ],
      [
        101,
        0.1055,
        0.0383,
        0.0671,
        0.685,
        0.243,
        184
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "AAAAAwMDAwMDAwMDAwMDAwICAgQDAAAAAAAABAQDAwMCAgQEBAQEBAQAAAEBBAIBAQEBAAQABAQAAQEEBAQEAwMDAwAAAAICAAAABAQBBAEEAgIAAgICAAQAAAAAAgQCBAIEAlRUVJGRkY6OjoGBgZQ/Pz+Pj499QP///1NTU0Zi9/f3399iYkZjY0Z9W1tqak0sagkJCYpDcUNDcQQETk50dFdWVlZ7e3uRkVlZWU10aE4EfoKRii0tLVtjZWVxioJ9gk1/ft8=",
        0,
        0,
        74,
        26,
        3.06,
        0.036,
        0.0108
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "AAAAAwMDAwMDAwMDAwMDAwICAgQDAAAAAAAABAQDAwMCAgQEBAQEBAQAAAEBBAIBAQEBAAQABAQAAQEEBAEEAwMDAwAAAAICAAAABAEBBAEEBAIAAgICAAQAAAAAAgECBAIBAlRUVJGRkY6OjoGBgZQ/Pz+Pj499QP///1NTU0Zi9/f3399iYkZjY0Z9W1tqak0sagkJCYpDcUNDcQQETk7ndFdWVlZ7e3uRkVlZWU3naE4Efx2Rii0tLVtjZWVxioJdgk1/Xd8=",
        0,
        6,
        68,
        26,
        3.08,
        0.297,
        0.0299
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "AAAAAwMDAwMDAwMDAwMDAwICAgQDAAAAAAAABAQDAwMEBAQEBAAABAACAgEBBAQBAQEBAAAABAQAAQEBBAEDAwMDAwEAAAACAAAABAEBBAQEBAICAgICAgIAAAAAAgECBAIBAlRUVJGRkY6OjoGBgZQ/Pz+Pj499QP///1NTU0Zd9/f3YmJGYkZMTDtj399qCk1NagkJCYqKcUNDcQQEak7nYldWVlYEe3t7kVlZWUPnaE5Ofx2RkS0tLeLiZWVxiuBd4E1/Xd8=",
        3,
        14,
        58,
        25,
        3.19,
        0.624,
        0.0299
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "AAAAAwMDAwMDAwMDAwMDAwICAgQDAAAAAAAABAQDAwMDAwQEAQAABAABAQQBAAABAQEBAAAAAAQABAEBAQEDAwMDAwEBAAAAAAAAAgEBBAQEBAICAgICAgIAAAACAgECAgIBAlRUVJGRkY6OjoGBgZQ/Pz+Pj499QP///1NTUwld9/f3RkZGRlpMTDtjWVkMCnJyagkJCYqKcYpDcU4EamrnYldWVlYEBHt7e1lZWZnnaE5Ofx2RkS0tLeLiZWVxkeBd4Jl/Xd8=",
        6,
        22,
        47,
        25,
        3.41,
        0.761,
        0.0262
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "AAAAAwMDAwMDAwMDAwMDAwICAgQDAAAAAAAABAQDAwMDAwAAAQAABAABAQQBAAAAAQEBAAAAAwMBAAADAwEDAwMDAwMAAAEBAAAAAgEBAwMEBAMDAgICAgIAAAEBAgECAgIBAlRUVJGRkY6OjoGBgZQ/Pz+Pj499QP///1NTUwld9/f3RkZdXVpMTDtjWVkMCnJyjAkJCX5+dF5eC3NzX1/nYldWVlZagIAHB1lZWZnnaF1dfx309C0tLeLiZWVv4+Bd4Jl/Xd8=",
        10,
        42,
        23,
        25,
        3.91,
        0.773,
        0.0253
      ]
    ]
  },
  "dual_red_purple": {
    "archetypeId": "dual_red_purple",
    "domains": [
      "red",
      "purple"
    ],
    "isAxialAlliance": false,
    "triadId": "pyros_alliances",
    "classicDeckId": "deck_dual_blood_flame",
    "name": "Pacto da Chama Sangrenta",
    "subtitle": "Pacto Duplo 🔥+💀 • Blitz Sanguinária, Dreno & Último Suspiro",
    "strategySummary": "Pressiona incessantemente o Soberano rival com Ímpeto, Dreno de Vida, gatilhos explosivos de Último Suspiro e queima direta.",
    "tacticalIdentity": "aggro",
    "coverCardId": "purple_23_dracolich",
    "generationsEvolved": 26,
    "matchesSimulated": 7948,
    "seedWinRate": 0.476,
    "championWinRate": 0.525,
    "vsMonocolorWinRate": 0.703,
    "championDeckJaccardStability": 0.905,
    "medianCardCi95HalfWidth": 0.0369,
    "domainCardBreakdown": {
      "neutral": 10,
      "purple": 39,
      "red": 51
    },
    "crossDomainCombos": [
      [
        76,
        94,
        1,
        0.475,
        8,
        " (100% WR em 8 duelos cruzados)"
      ],
      [
        731,
        94,
        1,
        0.475,
        10,
        " (100% WR em 10 duelos cruzados)"
      ],
      [
        733,
        94,
        1,
        0.475,
        8,
        " (100% WR em 8 duelos cruzados)"
      ],
      [
        94,
        3,
        0.9,
        0.405,
        10,
        " (90% WR em 10 duelos cruzados)"
      ],
      [
        94,
        205,
        0.889,
        0.394,
        9,
        " (89% WR em 9 duelos cruzados)"
      ],
      [
        94,
        791,
        0.875,
        0.38,
        8,
        " (88% WR em 8 duelos cruzados)"
      ]
    ],
    "learnedProfile": {
      "deckId": "dual_red_purple",
      "deckName": "Pacto da Chama Sangrenta",
      "archetypeTag": "aggro",
      "generationsTrained": 20,
      "matchesSimulated": 7884,
      "baselineWinRate": 0.476,
      "trainedWinRate": 0.525,
      "weights": {
        "aggroFaceBias": 1.38,
        "tradeValueBias": 1.05,
        "guardianPriority": 1,
        "flyingEvasionBias": 1,
        "stackConsolidationBias": 1,
        "antiAoeSpreadBias": 1,
        "spellHoldPatience": 1,
        "relicPriority": 1,
        "ascensionEagerness": 1,
        "bloodPactThresholdHp": 17,
        "domainExpansionEagerness": 0.98,
        "sovPowerTempoBias": 1.19,
        "synergyHoldBonus": 19,
        "mulliganCurveTarget": 2.5
      },
      "mk": [
        591,
        913,
        910,
        2,
        733,
        11,
        236
      ],
      "cp": [
        737,
        733,
        502,
        591,
        208,
        106,
        731,
        838,
        236,
        0
      ],
      "ca": [
        2,
        11,
        76,
        205,
        236,
        446,
        460,
        502,
        545,
        731,
        733,
        791
      ],
      "hb": [
        [
          0,
          7.6
        ],
        [
          1,
          8.7
        ],
        [
          2,
          17.1
        ],
        [
          11,
          15.6
        ],
        [
          35,
          14.4
        ],
        [
          76,
          14.6
        ],
        [
          94,
          24
        ],
        [
          205,
          11
        ],
        [
          236,
          12.4
        ],
        [
          446,
          19.6
        ],
        [
          460,
          24
        ],
        [
          502,
          12.8
        ],
        [
          545,
          18.7
        ],
        [
          600,
          7.4
        ],
        [
          653,
          14.4
        ],
        [
          693,
          8.7
        ],
        [
          731,
          9.9
        ],
        [
          733,
          11.8
        ],
        [
          791,
          14.8
        ],
        [
          799,
          14
        ],
        [
          838,
          14.6
        ],
        [
          910,
          23.7
        ],
        [
          913,
          23.5
        ],
        [
          1028,
          24
        ],
        [
          1033,
          13.6
        ],
        [
          1034,
          17.4
        ],
        [
          1061,
          11
        ],
        [
          1112,
          11
        ],
        [
          1121,
          11
        ],
        [
          1123,
          13.2
        ],
        [
          1160,
          17
        ]
      ],
      "sp": [
        [
          913,
          2
        ],
        [
          910,
          913
        ],
        [
          446,
          693
        ],
        [
          904,
          502
        ],
        [
          910,
          545
        ],
        [
          913,
          1034
        ],
        [
          910,
          791
        ],
        [
          731,
          460
        ],
        [
          545,
          600
        ],
        [
          913,
          693
        ]
      ],
      "dc": [
        [
          76,
          94,
          1,
          0.475,
          8,
          " (100% WR em 8 duelos cruzados)"
        ],
        [
          731,
          94,
          1,
          0.475,
          10,
          " (100% WR em 10 duelos cruzados)"
        ],
        [
          733,
          94,
          1,
          0.475,
          8,
          " (100% WR em 8 duelos cruzados)"
        ],
        [
          94,
          3,
          0.9,
          0.405,
          10,
          " (90% WR em 10 duelos cruzados)"
        ],
        [
          94,
          205,
          0.889,
          0.394,
          9,
          " (89% WR em 9 duelos cruzados)"
        ],
        [
          94,
          791,
          0.875,
          0.38,
          8,
          " (88% WR em 8 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        94,
        0.3567,
        0.2416,
        0.1152,
        0.913,
        0.629,
        23
      ],
      [
        545,
        0.1925,
        -0.0197,
        0.2122,
        0.75,
        0.652,
        16
      ],
      [
        1034,
        0.1643,
        -0.0426,
        0.2069,
        0.722,
        0.66,
        18
      ],
      [
        1160,
        0.1561,
        0.0441,
        0.1119,
        0.703,
        0.443,
        64
      ],
      [
        11,
        0.1047,
        0.0456,
        0.059,
        0.633,
        0.066,
        256
      ],
      [
        838,
        0.1012,
        -0.1656,
        0.2667,
        0.667,
        0.813,
        12
      ],
      [
        35,
        0.0984,
        -0.1401,
        0.2386,
        0.667,
        0.867,
        15
      ],
      [
        1028,
        0.0983,
        -0.2789,
        0.3772,
        0.667,
        0.87,
        6
      ],
      [
        653,
        0.0967,
        -0.1049,
        0.2016,
        0.667,
        0.902,
        21
      ],
      [
        1033,
        0.0798,
        -0.1212,
        0.201,
        0.636,
        0.633,
        22
      ],
      [
        446,
        0.074,
        -0.0937,
        0.1677,
        0.625,
        0.522,
        32
      ],
      [
        1123,
        0.0714,
        -0.0887,
        0.1601,
        0.629,
        0.646,
        35
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "AwMDAAAAAgICAQEBAAAAAwMDAAAAAgICAgICAwAAAAICAgQEAgIAAAAEBAMDAwAAAAEBAQQDAwMDAwMCAgQEAgIBAQECAAAAAAAEAgAAAAEBAAAABAQAAAAEAgMDAwQEAgQEAI6Ojuzs7Nvb2/b29lNTU5GRkQsLC09PT1hYWIgAAABaWlpYiLW1zc3NiCX4+PgDAwP39/djQkJC9/f33t5jY93duLi4HGpqavj4Yd4BAQFUVMjIyIglAgICWLUXFxdhYRxYJfg=",
        0,
        0,
        54,
        46,
        2.35,
        0.043,
        0.0122
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "AwMDAAAAAgICAQEBAAAAAwMDAAAAAgICAgICAwAAAAICAgQEAgIAAAAABAMDAwAAAAEBAQQDAwMDAwMCAgQEAgIBAQECAAAAAgIEAgAAAAEBAAAAAQQAAAAEAAMDAwQEAgQEAo6Ojuzs7Nvb2/b29lNTU5GRkQsLC09PT1hYWIgAAABaWlpYiLW1zc3NIyX4+PgDAwP39/djQkJC9/f33t5jY93duLi4HGpqao2NYd4BAQFUVMjIyD0lAgICWNAXFxdhYRxYJSg=",
        0,
        6,
        48,
        46,
        2.41,
        0.276,
        0.0291
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "AwMDAAAAAgICAQEBAAAAAwMDAAAAAgICAgICAwAAAAICAgQEAgIAAAAABAMDAwAAAAEBAQQDAwMDAwMAAAQEAgIBAQECAAAAAgIAAwAAAAEBAAAAAQAAAAAAAAMDAwQEAgQEAo6Ojuzs7Nvb2/b29lNTU5GRkQsLC09PT1hYWIgAAABaWloKiLW1zc3NIyX4+PgDAwP39/djQkJC9/f3TExjY93duLi4HGpqao2NXkYBAQFUVMjIyD3SAgIC0NAXFxdhYRxYJSg=",
        3,
        10,
        41,
        46,
        2.59,
        0.615,
        0.0283
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "AwMDAAAAAgICAQEBAAAAAwMDAAAAAgICAgICAwAAAAICAgQEAgIAAAAABAMDAwAAAAEBAQQDAwMDAwMAAAEEAgIBAQECAAAAAgIAAwAAAAEBAAAAAQAAAAAAAAMDAwIEAgQEAo6Ojuzs7Nvb2/b29lNTU5GRkQsLC09PT1hYWIgAAABaWloKiLW1zc3NIwT4+PgDAwP39/djQkJC9/f3TEy+Y93duLi4HGpqao2NXkYBAQFUVMjIyD3SAgIC0NAXFxchYRxYJSg=",
        6,
        10,
        38,
        46,
        2.72,
        0.719,
        0.0273
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "AwMDAAAAAgICAQEBAAAAAwMDAAAAAgICAgICAwAAAAICAgQEAgIAAAAABAMDAwAAAAEBAQQDAwMDAwMAAAEEAgIBAQECAAAAAgIAAwAAAAEBAAAAAQAAAAAAAAMDAwIEAgQEAo6Ojuzs7Nvb2/b29lNTU5GRkQsLC09PT1hYWIgAAABaWloKiLW1zc3NIwT4+PgDAwP39/cJQkJC9/f3TEy+Y93duLi4HGpqao2NXkYBAQFUVMjIyD3SAgIC0NAXFxchYRxYJSg=",
        7,
        10,
        37,
        46,
        2.76,
        0.828,
        0.0219
      ]
    ]
  },
  "dual_blue_green": {
    "archetypeId": "dual_blue_green",
    "domains": [
      "blue",
      "green"
    ],
    "isAxialAlliance": false,
    "triadId": "vortex_alliances",
    "classicDeckId": "deck_dual_wild_evolution",
    "name": "Pacto da Evolução Quimérica",
    "subtitle": "Pacto Duplo ❄️+🌿 • Rampa Arcana, Compra & Leviatãs",
    "strategySummary": "Une aceleração de Essência silvestre e compra de cartas glacial para evoluir quimeras, congelar bloqueadores e dominar com Titãs e Leviatãs.",
    "tacticalIdentity": "ramp",
    "coverCardId": "blue_173_general_roda_gelo",
    "generationsEvolved": 26,
    "matchesSimulated": 7656,
    "seedWinRate": 0.524,
    "championWinRate": 0.588,
    "vsMonocolorWinRate": 0.688,
    "championDeckJaccardStability": 0.869,
    "medianCardCi95HalfWidth": 0.18,
    "domainCardBreakdown": {
      "neutral": 10,
      "blue": 58,
      "green": 32
    },
    "crossDomainCombos": [
      [
        1035,
        126,
        1,
        0.442,
        8,
        " (100% WR em 8 duelos cruzados)"
      ],
      [
        221,
        665,
        1,
        0.442,
        10,
        " (100% WR em 10 duelos cruzados)"
      ],
      [
        404,
        665,
        1,
        0.442,
        9,
        " (100% WR em 9 duelos cruzados)"
      ],
      [
        119,
        861,
        1,
        0.412,
        9,
        " (100% WR em 9 duelos cruzados)"
      ],
      [
        853,
        863,
        1,
        0.412,
        9,
        " (100% WR em 9 duelos cruzados)"
      ],
      [
        816,
        853,
        0.958,
        0.4,
        24,
        " (96% WR em 24 duelos cruzados)"
      ]
    ],
    "learnedProfile": {
      "deckId": "dual_blue_green",
      "deckName": "Pacto da Evolução Quimérica",
      "archetypeTag": "ramp",
      "generationsTrained": 20,
      "matchesSimulated": 7592,
      "baselineWinRate": 0.524,
      "trainedWinRate": 0.588,
      "weights": {
        "aggroFaceBias": 1.09,
        "tradeValueBias": 1.28,
        "guardianPriority": 0.95,
        "flyingEvasionBias": 1.23,
        "stackConsolidationBias": 1,
        "antiAoeSpreadBias": 1,
        "spellHoldPatience": 1,
        "relicPriority": 1.03,
        "ascensionEagerness": 1.3,
        "bloodPactThresholdHp": 24,
        "domainExpansionEagerness": 1.02,
        "sovPowerTempoBias": 1.02,
        "synergyHoldBonus": 19,
        "mulliganCurveTarget": 3
      },
      "mk": [
        108,
        110,
        126,
        67,
        591,
        909,
        955
      ],
      "cp": [
        112,
        715,
        368,
        130,
        38,
        863,
        861,
        767,
        862,
        141
      ],
      "ca": [
        54,
        58,
        114,
        116,
        119,
        132,
        140,
        408,
        816,
        853,
        863,
        1035
      ],
      "hb": [
        [
          37,
          18.8
        ],
        [
          54,
          14.9
        ],
        [
          57,
          10.1
        ],
        [
          58,
          23
        ],
        [
          114,
          16.7
        ],
        [
          116,
          13
        ],
        [
          119,
          12.4
        ],
        [
          126,
          9.2
        ],
        [
          132,
          12.2
        ],
        [
          140,
          13.7
        ],
        [
          408,
          14.8
        ],
        [
          665,
          19.3
        ],
        [
          816,
          24
        ],
        [
          853,
          13.9
        ],
        [
          862,
          14.2
        ],
        [
          863,
          21.8
        ],
        [
          866,
          16.8
        ],
        [
          1035,
          24
        ],
        [
          1036,
          22.5
        ],
        [
          1075,
          17.9
        ],
        [
          1079,
          20
        ],
        [
          1091,
          11
        ],
        [
          1101,
          11
        ],
        [
          1115,
          20
        ],
        [
          1133,
          20
        ]
      ],
      "sp": [
        [
          1035,
          58
        ],
        [
          816,
          116
        ],
        [
          1035,
          54
        ],
        [
          1035,
          853
        ],
        [
          816,
          119
        ],
        [
          1035,
          855
        ],
        [
          816,
          853
        ],
        [
          54,
          1036
        ],
        [
          1035,
          126
        ],
        [
          816,
          58
        ]
      ],
      "dc": [
        [
          1035,
          126,
          1,
          0.442,
          8,
          " (100% WR em 8 duelos cruzados)"
        ],
        [
          221,
          665,
          1,
          0.442,
          10,
          " (100% WR em 10 duelos cruzados)"
        ],
        [
          404,
          665,
          1,
          0.442,
          9,
          " (100% WR em 9 duelos cruzados)"
        ],
        [
          119,
          861,
          1,
          0.412,
          9,
          " (100% WR em 9 duelos cruzados)"
        ],
        [
          853,
          863,
          1,
          0.412,
          9,
          " (100% WR em 9 duelos cruzados)"
        ],
        [
          816,
          853,
          0.958,
          0.4,
          24,
          " (96% WR em 24 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        1036,
        0.2781,
        0.1526,
        0.1256,
        0.905,
        0.767,
        21
      ],
      [
        665,
        0.2068,
        0.0773,
        0.1295,
        0.839,
        0.872,
        31
      ],
      [
        1075,
        0.1748,
        -0.1758,
        0.3506,
        0.8,
        0.737,
        5
      ],
      [
        1035,
        0.1654,
        0.0029,
        0.1625,
        0.792,
        0.76,
        24
      ],
      [
        866,
        0.1515,
        -0.0634,
        0.2149,
        0.786,
        0.918,
        14
      ],
      [
        863,
        0.1092,
        0.0147,
        0.0944,
        0.729,
        0.638,
        85
      ],
      [
        408,
        0.1061,
        -0.037,
        0.1431,
        0.73,
        0.706,
        37
      ],
      [
        862,
        0.0931,
        -0.1701,
        0.2632,
        0.727,
        0.918,
        11
      ],
      [
        58,
        0.08,
        0.0137,
        0.0664,
        0.683,
        0.284,
        189
      ],
      [
        816,
        0.0778,
        -0.0025,
        0.0803,
        0.688,
        0.429,
        128
      ],
      [
        853,
        0.0716,
        -0.0112,
        0.0828,
        0.675,
        0.297,
        123
      ],
      [
        114,
        0.071,
        0.0061,
        0.0649,
        0.672,
        0.247,
        201
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "AwMDAwMDAAAAAAAAAAABAgEBAQEBAgICBAQDAgICAAAAAAIEBAAAAAMDBAQDAAICBAQCAgQEBAEEBAIEAgQEAQICAQEBAQEAAAACBAAAAgQBAQEEBAAAAAAABAIAAQABAAEBAI2Njbu7u93d3Xd3vr6+jAiUlD4+PgYGBkNNVQgRESYmJt9vU1M2NjYuLlJSLjJ0dENDk5NyTXJpIiIxcjFNIgMxk2lpQkJCQ0NDdGoyMghSk5OTamro6Ojf31MRMwONA41wcI0=",
        0,
        0,
        81,
        19,
        2.97,
        0.081,
        0.0165
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "AwMDAwMDAAAAAAAAAAABAgEBAQEBAgICBAQDAgICAAAAAQEEBAAAAAMDBAQDAAICBAQAAAQEBAEEBAIEAgQEAQICAQEBAQEAAAACBAAAAgQBAQEBAQAAAAAABAIAAQABAAEBAI2Njbu7u93d3Xd3vr6+jAiUlD4+PgYGBkNNVQgRESYmJkVFU1M2NjYuLlJSLjJ0dENDcnJyTXJpIiIxcjFNIgMxk2lpQkJCQ0NDdGoyMghSk5OTSkro6Ojf31MRMwONA41wcI0=",
        0,
        6,
        75,
        19,
        2.99,
        0.233,
        0.0275
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "AwMDAwMDAAAAAAAAAAABAgEBAQEBAgICBAQDBAIEAAAAAQEEBAAAAAQDBAQDAwICBAQAAAQEBAEEBAECAgQEBAEBAQEBAQEAAAADAwICAgIBAQEBAQAAAAAABAIAAQABAAEBAI2Njbu7u93d3Xd3vr6+jAiUlD4+PgYGBkNNVQsRbSYmJkVFU1M2NjZSLlJSLi4RdENDcnJyN3IDTSJp//9NIiINDWlpQkJCQ0NDNjbLywgIk5OTSkro6Ojf31MRMwONA41wcI0=",
        3,
        14,
        64,
        19,
        3.1,
        0.574,
        0.0294
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "AwMDAwMDAAAAAAAAAAABBAEBAQEBAgICBAQDBAIEAAAAAQEEBAAAAAQDAgQAAAICBAQAAAMEAwEEBAECAgQEBAEBAQEBAQEAAAADAwICAgIBAQEBAQAAAAAABAIABAAEAAEBAI2Njbu7u93d3Xd3vr6+jDOUlD4+PgYGBkNNVQsRbSYmJkVFU1M2NjZSMAhSOjp7ewxbcnJiN2IDQ03j//9DTSINDQMDQkJCQ0NDNjbLywgIk5OTSkro6Ojf31MRMyKNIo1wcI0=",
        6,
        22,
        53,
        19,
        3.29,
        0.773,
        0.026
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "AwMDAwMDAAAAAAAAAAADBAEBAQEBAgICBAQDBAAEAAAAAQEDAQAAAAMDAwMAAAICBAQAAAMEAwMDAwECAgAAAAEBAgIBAQEAAAADAwICAAABAQEBAQAAAAAAAgAAAwADAAEBAI2Njbu7u93d3Xd3vr6+ejOUlD4+PgYGBkNNVQs/bSYmJkVFMZg2NjYwMPPzOjp7ewxbcnJiN2JeX1/j//+Cfn4NDZmZQkJCQ0NDNjbLyzk5k5OTSkro6Ojf38/nM12NXY1wcI0=",
        10,
        39,
        32,
        19,
        3.81,
        0.813,
        0.0237
      ]
    ]
  },
  "dual_green_gold": {
    "archetypeId": "dual_green_gold",
    "domains": [
      "green",
      "gold"
    ],
    "isAxialAlliance": false,
    "triadId": "veridia_alliances",
    "classicDeckId": "deck_dual_solar_wild",
    "name": "Pacto da Aurora Silvestre",
    "subtitle": "Pacto Duplo 🌿+☀️ • Falange dos Mil Escudos & Hinos Globais",
    "strategySummary": "Multiplica aliados protegidos por Guardião, Regeneração e Escudo Divino em massa, esmagando em frente ampla com bônus globais +ATQ/+VIDA.",
    "tacticalIdentity": "midrange",
    "coverCardId": "green_50_avatar_gaia",
    "generationsEvolved": 26,
    "matchesSimulated": 7880,
    "seedWinRate": 0.631,
    "championWinRate": 0.551,
    "vsMonocolorWinRate": 0.75,
    "championDeckJaccardStability": 0.905,
    "medianCardCi95HalfWidth": 0.0562,
    "domainCardBreakdown": {
      "gold": 57,
      "neutral": 10,
      "green": 33
    },
    "crossDomainCombos": [
      [
        862,
        913,
        1,
        0.479,
        9,
        " (100% WR em 9 duelos cruzados)"
      ],
      [
        784,
        769,
        1,
        0.479,
        10,
        " (100% WR em 10 duelos cruzados)"
      ],
      [
        147,
        769,
        0.917,
        0.396,
        12,
        " (92% WR em 12 duelos cruzados)"
      ],
      [
        580,
        910,
        0.909,
        0.388,
        11,
        " (91% WR em 11 duelos cruzados)"
      ],
      [
        159,
        862,
        0.9,
        0.379,
        10,
        " (90% WR em 10 duelos cruzados)"
      ],
      [
        272,
        115,
        0.889,
        0.368,
        9,
        " (89% WR em 9 duelos cruzados)"
      ]
    ],
    "learnedProfile": {
      "deckId": "dual_green_gold",
      "deckName": "Pacto da Aurora Silvestre",
      "archetypeTag": "midrange",
      "generationsTrained": 20,
      "matchesSimulated": 7816,
      "baselineWinRate": 0.631,
      "trainedWinRate": 0.551,
      "weights": {
        "aggroFaceBias": 1.12,
        "tradeValueBias": 1.25,
        "guardianPriority": 1.38,
        "flyingEvasionBias": 1.02,
        "stackConsolidationBias": 1.22,
        "antiAoeSpreadBias": 1,
        "spellHoldPatience": 1.02,
        "relicPriority": 1,
        "ascensionEagerness": 1.01,
        "bloodPactThresholdHp": 24,
        "domainExpansionEagerness": 1,
        "sovPowerTempoBias": 1,
        "synergyHoldBonus": 21,
        "mulliganCurveTarget": 2.8
      },
      "mk": [
        913,
        278,
        272,
        853,
        126,
        910,
        145,
        159,
        784
      ],
      "cp": [
        862,
        769,
        780,
        151,
        664,
        879,
        680,
        115,
        863,
        145
      ],
      "ca": [
        114,
        126,
        145,
        159,
        272,
        278,
        381,
        421,
        678,
        682,
        769,
        784
      ],
      "hb": [
        [
          114,
          18.6
        ],
        [
          126,
          14.2
        ],
        [
          145,
          14.8
        ],
        [
          151,
          14.9
        ],
        [
          159,
          10.6
        ],
        [
          272,
          12
        ],
        [
          278,
          17
        ],
        [
          381,
          16
        ],
        [
          421,
          9.2
        ],
        [
          580,
          14
        ],
        [
          581,
          19.6
        ],
        [
          655,
          12.8
        ],
        [
          664,
          10.3
        ],
        [
          678,
          13.4
        ],
        [
          682,
          22.5
        ],
        [
          769,
          17.3
        ],
        [
          784,
          21.3
        ],
        [
          853,
          23
        ],
        [
          862,
          23.7
        ],
        [
          871,
          6.8
        ],
        [
          880,
          24
        ],
        [
          910,
          15.1
        ],
        [
          913,
          19.4
        ],
        [
          1036,
          17.6
        ],
        [
          1037,
          24
        ],
        [
          1050,
          15
        ],
        [
          1059,
          15
        ],
        [
          1068,
          14.5
        ],
        [
          1079,
          20
        ],
        [
          1115,
          20
        ]
      ],
      "sp": [
        [
          1037,
          853
        ],
        [
          880,
          913
        ],
        [
          880,
          910
        ],
        [
          871,
          862
        ],
        [
          145,
          1036
        ],
        [
          682,
          278
        ],
        [
          862,
          913
        ],
        [
          145,
          880
        ],
        [
          880,
          278
        ],
        [
          145,
          862
        ]
      ],
      "dc": [
        [
          862,
          913,
          1,
          0.479,
          9,
          " (100% WR em 9 duelos cruzados)"
        ],
        [
          784,
          769,
          1,
          0.479,
          10,
          " (100% WR em 10 duelos cruzados)"
        ],
        [
          147,
          769,
          0.917,
          0.396,
          12,
          " (92% WR em 12 duelos cruzados)"
        ],
        [
          580,
          910,
          0.909,
          0.388,
          11,
          " (91% WR em 11 duelos cruzados)"
        ],
        [
          159,
          862,
          0.9,
          0.379,
          10,
          " (90% WR em 10 duelos cruzados)"
        ],
        [
          272,
          115,
          0.889,
          0.368,
          9,
          " (89% WR em 9 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        581,
        0.2131,
        0.0378,
        0.1753,
        0.8,
        0.718,
        20
      ],
      [
        862,
        0.1567,
        -0.0165,
        0.1732,
        0.75,
        0.846,
        24
      ],
      [
        1037,
        0.1308,
        -0.029,
        0.1598,
        0.71,
        0.557,
        31
      ],
      [
        151,
        0.1097,
        -0.1069,
        0.2166,
        0.706,
        0.904,
        17
      ],
      [
        1068,
        0.099,
        -0.0436,
        0.1426,
        0.667,
        0.333,
        42
      ],
      [
        682,
        0.0981,
        -0.0419,
        0.1401,
        0.674,
        0.506,
        43
      ],
      [
        784,
        0.0915,
        0.0254,
        0.0661,
        0.647,
        0.086,
        201
      ],
      [
        580,
        0.0889,
        -0.0719,
        0.1608,
        0.667,
        0.535,
        33
      ],
      [
        769,
        0.0836,
        -0.0477,
        0.1313,
        0.673,
        0.778,
        49
      ],
      [
        1036,
        0.0783,
        -0.1394,
        0.2178,
        0.667,
        0.746,
        18
      ],
      [
        381,
        0.075,
        -0.0025,
        0.0776,
        0.635,
        0.182,
        148
      ],
      [
        655,
        0.0633,
        -0.0074,
        0.0707,
        0.635,
        0.411,
        178
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "AQEBAwMDAQEBAwMDAwMDAwMDAwICAgMDAwMDAwQBBAAABAQEAQEBAQEBAQEBBAABAQQEAQQEAgICAgIEBAAAAAAAAQIABAMDAQEBAQEEAwEBAQEBAAAAAAAABAQEAwQBAQQBBLCwsBERERAQEJGRkY6OjpSUlHyPj49nZ2dVVVVDBUOKikNNTd7eCQkJaWkDaU2KAwN0dAVVVUFBQaSkVlaTk5OhoRekoVYGBhYWFhcXoAYbG6WlpZ+fn5GRkaCgVVaQG96QBZA=",
        0,
        0,
        78,
        22,
        3.04,
        0.048,
        0.0126
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "AQEBAwMDAQEBAwMDAwMDAwMDAwICAgMDAwMDAwQBBAAABAQEAQEBAQEBAQEBBAABAQQEAQQEAgICAgIEBAAAAAAAAQIEBAMDAQEBAQEEAwEBAQEBAAAAAAAABAQEAwQBBAABALCwsBERERAQEJGRkY6OjpSUlHyPj49nZ2dVVVVDBUOKikNNTePjCQkJaWkDaU2KAwN0dAVVVUFBQaSkVlaTk5OhoRekGlYGBhYWFhcXoAYbG6WlpZ+fn5GRkaCgVVaQGyOZBa8=",
        0,
        6,
        72,
        22,
        3.07,
        0.263,
        0.0286
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "AQEBAwMDAQEBAwMDAwMDAwMDAwICAgMDAwMDAwQBBAQABAEBAQEBAQEBAAEBBAQAAAQEBAQEAgICAgIEBAAAAAMDAgIEBAMDAQEBAwEEBAEBAQEBAAAAAAAABAQEAwABBAABALCwsBERERAQEJGRkY6OjpSUlHyPj49nZ2dVVVVDCzdNikMFBePjCQkJA3IDA01Niop0dENVLEFBQaamVlaTk5NtbUJCGlUGBhYWFgYXoKAbG6WlpZ+fn5GRkVagVVaZGyOZBa8=",
        3,
        14,
        61,
        22,
        3.18,
        0.631,
        0.0283
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "AQEBAwMDAQEBAwMDAwMDAwMDAwICAgMDAwMDAwQBBAQEBAQBAQEBAQEAAAAAAQEEAgMDBAQEAgICAgIEBAAAAAMDAgIEBAQDAQEBAQEEBAEBAQEBAAAAAAAABAQCAwABBAAEALCwsBERERAQEJGRkY6OjpSUlHyPj49nZ2dVVVUMCzdNTVtDBePjCQkJcnJ+fgUFTZgBAUNVLEFBQaamVVaTk5NtbUJCGlWgBhYWFnx8oKAbG6WlpZ+fn5GRkVZWRVaZGyOZQ68=",
        6,
        22,
        50,
        22,
        3.27,
        0.732,
        0.0259
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "AQEBAwMDAQEBAwMDAwMDAwMDAwICAgMDAwMDAwQBBAAABAMDAQEBAQEAAAAAAwMCAgMDAQQEBAICAgICAgAAAAMDAgIEAwEBAQEBAQEBAQMDAQEBAAAAAAAAAAACAwABBAABALCwsBERERAQEJGRkY6OjpSUlHyPj49nZ2dVVVUMCzdzc1tfX+PjCQkJcnJ+fl5emJgBAQ8NLAeqRKamqKiTk5NtbUJCGm99fRYWFnx8q6sQEKWlpZ+fn5GRkZeXRVaZGyOZD68=",
        10,
        42,
        26,
        22,
        3.75,
        0.808,
        0.0231
      ]
    ]
  },
  "dual_purple_gold": {
    "archetypeId": "dual_purple_gold",
    "domains": [
      "purple",
      "gold"
    ],
    "isAxialAlliance": false,
    "triadId": "solaria_alliances",
    "classicDeckId": "deck_dual_iron_inquisition",
    "name": "Pacto da Inquisição Crepuscular",
    "subtitle": "Pacto Duplo 💀+☀️ • Dreno Solar, Renascer & Veredito",
    "strategySummary": "Combina campeões imortais com Renascer, Escudo Divino e Dreno de Vida ao lado de destruição inquisitorial e Relíquias consagradas.",
    "tacticalIdentity": "attrition",
    "coverCardId": "purple_173_general_roda_abismo",
    "generationsEvolved": 26,
    "matchesSimulated": 7336,
    "seedWinRate": 0.524,
    "championWinRate": 0.551,
    "vsMonocolorWinRate": 0.703,
    "championDeckJaccardStability": 0.905,
    "medianCardCi95HalfWidth": 0.0477,
    "domainCardBreakdown": {
      "gold": 58,
      "purple": 32,
      "neutral": 10
    },
    "crossDomainCombos": [
      [
        983,
        76,
        1,
        0.479,
        13,
        " (100% WR em 13 duelos cruzados)"
      ],
      [
        682,
        913,
        1,
        0.479,
        13,
        " (100% WR em 13 duelos cruzados)"
      ],
      [
        175,
        89,
        0.917,
        0.396,
        12,
        " (92% WR em 12 duelos cruzados)"
      ],
      [
        679,
        76,
        0.9,
        0.379,
        10,
        " (90% WR em 10 duelos cruzados)"
      ],
      [
        272,
        1033,
        0.875,
        0.354,
        8,
        " (88% WR em 8 duelos cruzados)"
      ],
      [
        274,
        741,
        0.875,
        0.354,
        8,
        " (88% WR em 8 duelos cruzados)"
      ]
    ],
    "learnedProfile": {
      "deckId": "dual_purple_gold",
      "deckName": "Pacto da Inquisição Crepuscular",
      "archetypeTag": "attrition",
      "generationsTrained": 20,
      "matchesSimulated": 7272,
      "baselineWinRate": 0.524,
      "trainedWinRate": 0.551,
      "weights": {
        "aggroFaceBias": 1,
        "tradeValueBias": 1.34,
        "guardianPriority": 1.28,
        "flyingEvasionBias": 1,
        "stackConsolidationBias": 1,
        "antiAoeSpreadBias": 1,
        "spellHoldPatience": 1,
        "relicPriority": 1.18,
        "ascensionEagerness": 1,
        "bloodPactThresholdHp": 24,
        "domainExpansionEagerness": 1,
        "sovPowerTempoBias": 1,
        "synergyHoldBonus": 20,
        "mulliganCurveTarget": 2.9
      },
      "mk": [
        278,
        159,
        834,
        913,
        236,
        784,
        84
      ],
      "cp": [
        678,
        738,
        578,
        421,
        680,
        837,
        878,
        832,
        943,
        340
      ],
      "ca": [
        84,
        159,
        173,
        175,
        236,
        272,
        278,
        346,
        381,
        421,
        545,
        682
      ],
      "hb": [
        [
          76,
          12.5
        ],
        [
          84,
          15.4
        ],
        [
          159,
          16.4
        ],
        [
          173,
          20.8
        ],
        [
          175,
          21.5
        ],
        [
          236,
          19.8
        ],
        [
          272,
          9.6
        ],
        [
          278,
          18.2
        ],
        [
          346,
          18.6
        ],
        [
          381,
          16.2
        ],
        [
          421,
          9.8
        ],
        [
          545,
          24
        ],
        [
          682,
          24
        ],
        [
          736,
          12.4
        ],
        [
          741,
          16.8
        ],
        [
          784,
          20.9
        ],
        [
          838,
          15.1
        ],
        [
          839,
          22.6
        ],
        [
          840,
          22.7
        ],
        [
          870,
          13.3
        ],
        [
          880,
          24
        ],
        [
          913,
          21.7
        ],
        [
          983,
          19.6
        ],
        [
          1031,
          19.3
        ],
        [
          1033,
          22.8
        ],
        [
          1037,
          24
        ],
        [
          1053,
          14.4
        ],
        [
          1083,
          20
        ],
        [
          1117,
          20
        ],
        [
          1149,
          11
        ],
        [
          1151,
          15
        ]
      ],
      "sp": [
        [
          880,
          84
        ],
        [
          381,
          983
        ],
        [
          1037,
          913
        ],
        [
          682,
          84
        ],
        [
          545,
          236
        ],
        [
          682,
          278
        ],
        [
          159,
          545
        ],
        [
          173,
          736
        ],
        [
          175,
          236
        ],
        [
          175,
          913
        ]
      ],
      "dc": [
        [
          983,
          76,
          1,
          0.479,
          13,
          " (100% WR em 13 duelos cruzados)"
        ],
        [
          682,
          913,
          1,
          0.479,
          13,
          " (100% WR em 13 duelos cruzados)"
        ],
        [
          175,
          89,
          0.917,
          0.396,
          12,
          " (92% WR em 12 duelos cruzados)"
        ],
        [
          679,
          76,
          0.9,
          0.379,
          10,
          " (90% WR em 10 duelos cruzados)"
        ],
        [
          272,
          1033,
          0.875,
          0.354,
          8,
          " (88% WR em 8 duelos cruzados)"
        ],
        [
          274,
          741,
          0.875,
          0.354,
          8,
          " (88% WR em 8 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        1033,
        0.2848,
        0.1228,
        0.1621,
        0.875,
        0.784,
        16
      ],
      [
        1031,
        0.2059,
        -0.042,
        0.2479,
        0.8,
        0.861,
        10
      ],
      [
        682,
        0.1975,
        0.0681,
        0.1294,
        0.775,
        0.529,
        40
      ],
      [
        741,
        0.152,
        -0.0275,
        0.1795,
        0.739,
        0.723,
        23
      ],
      [
        175,
        0.1238,
        0.0082,
        0.1156,
        0.712,
        0.742,
        59
      ],
      [
        983,
        0.1235,
        0.0205,
        0.103,
        0.707,
        0.643,
        75
      ],
      [
        838,
        0.1096,
        -0.0026,
        0.1122,
        0.692,
        0.635,
        65
      ],
      [
        1053,
        0.0972,
        -0.1537,
        0.2509,
        0.692,
        0.883,
        13
      ],
      [
        159,
        0.0664,
        0.0097,
        0.0567,
        0.623,
        0.108,
        281
      ],
      [
        236,
        0.0551,
        0.0002,
        0.0549,
        0.609,
        0.05,
        304
      ],
      [
        76,
        0.0549,
        -0.0145,
        0.0694,
        0.614,
        0.156,
        189
      ],
      [
        736,
        0.0527,
        -0.0547,
        0.1074,
        0.636,
        0.653,
        77
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "AQEBAQEBAwMDBAMDAgICAAAAAQEBAwMDAAAABAIABAQEBAQCBAQAAAEBAQAAAAICBAQEAwMDBAQEAAAAAQEBAgIEBAMDBAEEAwQEAAAEBAQAAwQEAAMAAAABAgAAAAAAAQEDAxAQEKWlpWZmZn1AQD4+Puzs7BISEpGRkVRUVGPfW2NGRkZ9gmNiW1tUVFRZWVnf32JiVQUFBVVWVpOTkxYWFkBAkZGamlV3mqKamq6uoKCRrppWoJ4Gra2tG0Cfn5+ennd3+/s=",
        0,
        0,
        79,
        21,
        2.85,
        0.02,
        0.0096
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "AQEBAQEBAwMDBAMDAgICAAAAAQEBAwMDAAAABAIABAQEBAQEBAQCAgEBAQAAAAICBAQEAwMDBAQEAAAAAQEBAgIEBAMDBAEEAwQEAAAEBAQAAwQEAAMAAAAAAgAAAAAAAQEDAxAQEKWlpWZmZn1AQD4+Puzs7BISEpGRkVRUVGPfTGNGRkZ/HWNi4OBUVFRZWVnf32JiVQUFBVVWVpOTkxYWFkBAkZGamlV3mqKamq6uoKCRrppWoJ4Gra2tskCfn5+ennd3+/s=",
        0,
        6,
        73,
        21,
        2.88,
        0.278,
        0.029
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "AQEBAQEBAwMDBAMDAgICAAAAAQEBAwMDAAAABAAABAQEBAQEBAQCAgEBAQAAAAMDBAQEAwMDBAQEAAAAAQEBAgIEBAMDBAEDAwQEAAAEBAQAAwQEAAMAAAAAAgAAAAAAAQEDAxAQEKWlpWZmZn1AQD4+Puzs7BISEpGRkVRUVAlMTF1GO0Z/HUZj4OBUVFRZWVlFRWNjVQUFBVVWVpOTkxYWFkBAkZGamlV319eamq+voKCRmZpWoJ4Gra2tskCfn5+ennd3+/s=",
        3,
        14,
        62,
        21,
        2.99,
        0.615,
        0.0291
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "AQEBAQEBAwMDBAMDAgICAAAAAQEBAwMDAAAABAAABAEEAgQEBAQCAgEBAQAAAAMDBAIEAwMDBAEEAAAAAQEBAgIEBAMDBAQDAwAAAAAEBAAAAwQEAgIAAAAABAAAAAIAAQEDAxAQEKWlpWZmZn1AQD4+Puzs7BISEpGRkVRUVAlMTF1aO+V/HUZG4OBUVFRZWVlFRUbiDQUFBVV3VpOTkxYWFkBAkZGvr1VV19fGxq+voKCZmZpWVqenra2tsqCfn59Annd3+/s=",
        6,
        22,
        51,
        21,
        3.14,
        0.775,
        0.0248
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "AQEBAQEBAwMDBAMDAgICAAAAAQEBAwMDAAAABAAABAEEAgQEAwMCAgEBAQAAAAMDAgIEAwQCAgICAAAAAQEBAgIDAwMDAwMDAwAAAAADAwAAAwMDAgIAAAAAAgAAAAEBAgIDAxAQEKWlpWZmZn1AQD4+Puzs7BISEpGRkVRUVAlMTF1aO+V/HUZG4OBUVFRZWVlFReLiDXAHqkSoqJOTkxYWFqamEBCvr29v19fGxq+vDAyZmXpubqenra2tskKfn599famp+/s=",
        10,
        43,
        26,
        21,
        3.68,
        0.831,
        0.0225
      ]
    ]
  },
  "dual_red_blue": {
    "archetypeId": "dual_red_blue",
    "domains": [
      "red",
      "blue"
    ],
    "isAxialAlliance": false,
    "triadId": "vortex_alliances",
    "classicDeckId": "deck_dual_storm_dragon",
    "name": "Pacto do Fogo Astral",
    "subtitle": "Pacto Duplo 🔥+❄️ • Artilharia Arcana, Voo & Tempestade",
    "strategySummary": "Alinha feitiços piroclásticos, compra rúnica e Congelamento para abrir os céus para Dragões e Fênix de Voo e Alcance.",
    "tacticalIdentity": "tempo",
    "coverCardId": "red_99_senhor_balor_fogo",
    "generationsEvolved": 26,
    "matchesSimulated": 7436,
    "seedWinRate": 0.5,
    "championWinRate": 0.5,
    "vsMonocolorWinRate": 0.641,
    "championDeckJaccardStability": 0.905,
    "medianCardCi95HalfWidth": 0.18,
    "domainCardBreakdown": {
      "neutral": 10,
      "red": 36,
      "blue": 54
    },
    "crossDomainCombos": [
      [
        408,
        34,
        0.889,
        0.419,
        9,
        " (89% WR em 9 duelos cruzados)"
      ],
      [
        1035,
        913,
        0.875,
        0.405,
        8,
        " (88% WR em 8 duelos cruzados)"
      ],
      [
        1035,
        300,
        0.867,
        0.397,
        15,
        " (87% WR em 15 duelos cruzados)"
      ],
      [
        1035,
        218,
        0.889,
        0.389,
        9,
        " (89% WR em 9 duelos cruzados)"
      ],
      [
        1035,
        3,
        0.833,
        0.363,
        12,
        " (83% WR em 12 duelos cruzados)"
      ],
      [
        1035,
        11,
        0.813,
        0.343,
        16,
        " (81% WR em 16 duelos cruzados)"
      ]
    ],
    "learnedProfile": {
      "deckId": "dual_red_blue",
      "deckName": "Pacto do Fogo Astral",
      "archetypeTag": "tempo",
      "generationsTrained": 20,
      "matchesSimulated": 7372,
      "baselineWinRate": 0.5,
      "trainedWinRate": 0.5,
      "weights": {
        "aggroFaceBias": 1.18,
        "tradeValueBias": 0.99,
        "guardianPriority": 1.04,
        "flyingEvasionBias": 1.34,
        "stackConsolidationBias": 1,
        "antiAoeSpreadBias": 1,
        "spellHoldPatience": 1.16,
        "relicPriority": 1,
        "ascensionEagerness": 0.99,
        "bloodPactThresholdHp": 24,
        "domainExpansionEagerness": 1,
        "sovPowerTempoBias": 1.19,
        "synergyHoldBonus": 20,
        "mulliganCurveTarget": 2.8
      },
      "mk": [
        591,
        300,
        913,
        457,
        11,
        205
      ],
      "cp": [
        334,
        717,
        224,
        513,
        403,
        314,
        43,
        6,
        54,
        330
      ],
      "ca": [
        11,
        34,
        54,
        205,
        218,
        300,
        913,
        1029,
        1035
      ],
      "hb": [
        [
          11,
          13.5
        ],
        [
          34,
          15.2
        ],
        [
          54,
          23.6
        ],
        [
          205,
          12.7
        ],
        [
          218,
          8.9
        ],
        [
          221,
          6.3
        ],
        [
          300,
          23.1
        ],
        [
          508,
          15.7
        ],
        [
          591,
          12.2
        ],
        [
          913,
          13.9
        ],
        [
          1029,
          20.1
        ],
        [
          1035,
          24
        ],
        [
          1040,
          15
        ],
        [
          1056,
          22.9
        ],
        [
          1062,
          15
        ],
        [
          1116,
          20
        ],
        [
          1118,
          20
        ]
      ],
      "sp": [
        [
          1035,
          300
        ],
        [
          1035,
          54
        ],
        [
          1029,
          34
        ],
        [
          1035,
          34
        ],
        [
          54,
          300
        ],
        [
          1035,
          11
        ],
        [
          54,
          34
        ],
        [
          54,
          11
        ],
        [
          11,
          1034
        ],
        [
          54,
          913
        ]
      ],
      "dc": [
        [
          408,
          34,
          0.889,
          0.419,
          9,
          " (89% WR em 9 duelos cruzados)"
        ],
        [
          1035,
          913,
          0.875,
          0.405,
          8,
          " (88% WR em 8 duelos cruzados)"
        ],
        [
          1035,
          300,
          0.867,
          0.397,
          15,
          " (87% WR em 15 duelos cruzados)"
        ],
        [
          1035,
          218,
          0.889,
          0.389,
          9,
          " (89% WR em 9 duelos cruzados)"
        ],
        [
          1035,
          3,
          0.833,
          0.363,
          12,
          " (83% WR em 12 duelos cruzados)"
        ],
        [
          1035,
          11,
          0.813,
          0.343,
          16,
          " (81% WR em 16 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        1056,
        0.2857,
        -0.0125,
        0.2982,
        0.833,
        0.952,
        6
      ],
      [
        1035,
        0.2109,
        0.0661,
        0.1448,
        0.743,
        0.639,
        35
      ],
      [
        508,
        0.1271,
        0.0032,
        0.1239,
        0.649,
        0.441,
        57
      ],
      [
        1029,
        0.1061,
        -0.1211,
        0.2272,
        0.647,
        0.819,
        17
      ],
      [
        11,
        0.0784,
        0.0239,
        0.0545,
        0.588,
        0.189,
        313
      ],
      [
        54,
        0.0684,
        0.0142,
        0.0542,
        0.575,
        0.133,
        320
      ],
      [
        205,
        0.0589,
        0.0034,
        0.0555,
        0.569,
        0.195,
        306
      ],
      [
        591,
        0.0488,
        -0.0271,
        0.0759,
        0.577,
        0.558,
        163
      ],
      [
        913,
        0.0369,
        -0.0462,
        0.0831,
        0.543,
        0.132,
        138
      ],
      [
        34,
        0.0336,
        -0.0263,
        0.0598,
        0.545,
        0.231,
        266
      ],
      [
        32,
        0.0328,
        -0.1105,
        0.1433,
        0.565,
        0.649,
        46
      ],
      [
        314,
        0.0323,
        -0.1577,
        0.1899,
        0.577,
        0.893,
        26
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "AwMDAQEBAAAAAAAAAgICAwAAAAAAAAEBAQEBAQQEBAQEAAAAAAAAAQEBBAQEAAQEBAQEAQEEAgAEBAQEAAAAAgQAAAAAAAABAAAABAAAAAICAAAAAAAAAQEBBAQAAAMEAwMAAo2NjcnJyb6+vtra2k9PT5ELCwvd3d0sLCw+Pj4lPT2IiCIiIh8fHzg4OFg9JQ1YJVhSUkJCZMg0ZGRUVOjo6G5oKysrQEBAQiYmJlIDAwNubjY2Ns3NzZOTk2hoRTQsVCwsNMg=",
        0,
        0,
        72,
        28,
        2.69,
        0.081,
        0.0165
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "AwMDAQEBAAAAAAAAAgICAwAAAAAAAAEBAQEBAQQEBAQEAAAAAAAAAQEBBAQEAAQEBAQEAQEEBAQEBAEBAAAAAgQAAAAAAAABAAAABAAAAAICAAAAAAAAAQEBBAQAAAMCAwMAAo2NjcnJyb6+vtra2k9PT5ELCwvd3d0sLCw+Pj4lPT2IiCIiIh8fHzg4OFg9JQ1YJVhSUkJCZBAgZGRFRejo6G5oKysrQEBAQiYmJlIDAwNubjY2Ns3NzZOTk2hoRTQsyywsNMs=",
        0,
        6,
        66,
        28,
        2.73,
        0.233,
        0.0275
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "AwMDAQEBAAAAAAAAAgICAwAAAAAAAAEBAQEBAQQEBAQEAAAAAAAAAQEBBAQBBAQEBAQEAQEEBAQEAQEBAAAAAgIAAAAAAAABAAAABAAAAAQCAAAAAAAAAQEBAQEAAAMCAwMAAo2NjcnJyb6+vtra2k9PT5ELCwvd3d0sLCw+Pj5cWD09PSIiIh8fHzg4OFhY/CYlJSVSXkJCZBAgZE9FRejo6HZ2KysrQEBAQiYmJlIDAwNSbjY2Ns3NzZOTk0pKRUcsyywsR8s=",
        3,
        14,
        56,
        27,
        2.86,
        0.574,
        0.0294
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "AwMDAQEBAAAAAAAAAgICAwAAAAAAAAEBAQEBAQQBAQICAAAAAAAAAQEBBAABBAQEBAQEAQEABAQBAQEBAAAAAgIAAAAAAAABAAAAAwAAAAICAAAAAAAAAQEBAQEAAAICAwMAAo2NjcnJyb6+vtra2k9PT5ELCwvd3d0sLCw+Pj5cPT0BASIiIh8fHzg4OFjY/CYlJSULXkJCPxAgT09FRejo6HZ2KysrQEBAQiYmJiwDAwPNzTY2Ns3NzZOTk0pKRUcMyywsR8s=",
        6,
        22,
        47,
        25,
        3,
        0.773,
        0.026
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "AwMDAQEBAAAAAAAAAgICAwAAAAAAAAEBAQEBAQQBAQICAAAAAAAAAQEBAAABBAABAQQEAAMABAQBAQEBAAAAAgIAAAAAAAAEAAAAAAAAAAICAAAAAAAAAQEBAQEAAAICAwEAAo2NjcnJyb6+vtra2k9PT5ELCwvd3d0sLCw+Pj5cPT0BASIiIh8fHzg4ONjY/CYgOjoLXkQ4PxAgT09FRejo6HZ2KysrQEBABSYmJuADAwPNzTY2Ns3NzZOTk0pKRUcMyyyYR8s=",
        10,
        27,
        38,
        25,
        3.23,
        0.813,
        0.0237
      ]
    ]
  },
  "dual_green_neutral": {
    "archetypeId": "dual_green_neutral",
    "domains": [
      "green",
      "neutral"
    ],
    "isAxialAlliance": true,
    "triadId": "veridia_alliances",
    "name": "Aliança dos Engenhos Silvestres",
    "subtitle": "Aliança 🌿+⚙️ • Colossos de Madeira-Ferro & Guildas Axiais",
    "strategySummary": "Une a rampa e os Titãs de Veridia aos Constructos blindados e campeões da Cidade Franca em uma frente pesada de Atropelar e Armadura.",
    "tacticalIdentity": "midrange",
    "coverCardId": "neutral_54_dragao_etereo",
    "generationsEvolved": 26,
    "matchesSimulated": 7948,
    "seedWinRate": 0.595,
    "championWinRate": 0.592,
    "vsMonocolorWinRate": 0.797,
    "championDeckJaccardStability": 0.869,
    "medianCardCi95HalfWidth": 0.0518,
    "domainCardBreakdown": {
      "neutral": 50,
      "green": 50
    },
    "crossDomainCombos": [
      [
        863,
        983,
        1,
        0.438,
        9,
        " (100% WR em 9 duelos cruzados)"
      ],
      [
        862,
        935,
        1,
        0.438,
        9,
        " (100% WR em 9 duelos cruzados)"
      ],
      [
        267,
        591,
        1,
        0.438,
        8,
        " (100% WR em 8 duelos cruzados)"
      ],
      [
        267,
        270,
        1,
        0.408,
        9,
        " (100% WR em 9 duelos cruzados)"
      ],
      [
        862,
        265,
        1,
        0.408,
        12,
        " (100% WR em 12 duelos cruzados)"
      ],
      [
        935,
        983,
        1,
        0.408,
        23,
        " (100% WR em 23 duelos cruzados)"
      ]
    ],
    "learnedProfile": {
      "deckId": "dual_green_neutral",
      "deckName": "Aliança dos Engenhos Silvestres",
      "archetypeTag": "midrange",
      "generationsTrained": 20,
      "matchesSimulated": 7884,
      "baselineWinRate": 0.595,
      "trainedWinRate": 0.592,
      "weights": {
        "aggroFaceBias": 1.14,
        "tradeValueBias": 1.25,
        "guardianPriority": 1.15,
        "flyingEvasionBias": 1,
        "stackConsolidationBias": 1,
        "antiAoeSpreadBias": 1,
        "spellHoldPatience": 0.96,
        "relicPriority": 1.02,
        "ascensionEagerness": 1,
        "bloodPactThresholdHp": 24,
        "domainExpansionEagerness": 1.25,
        "sovPowerTempoBias": 1,
        "synergyHoldBonus": 20,
        "mulliganCurveTarget": 2.9
      },
      "mk": [
        118,
        910,
        126,
        897,
        591,
        913
      ],
      "cp": [
        365,
        564,
        921,
        863,
        1020,
        942,
        944,
        862,
        664,
        853
      ],
      "ca": [
        114,
        116,
        119,
        126,
        140,
        189,
        267,
        270,
        487,
        853,
        862,
        863
      ],
      "hb": [
        [
          114,
          17.3
        ],
        [
          116,
          15.4
        ],
        [
          119,
          16.3
        ],
        [
          126,
          15.3
        ],
        [
          140,
          19.9
        ],
        [
          189,
          24
        ],
        [
          267,
          24
        ],
        [
          270,
          20.7
        ],
        [
          487,
          24
        ],
        [
          571,
          19.4
        ],
        [
          769,
          13.1
        ],
        [
          853,
          14.9
        ],
        [
          862,
          24
        ],
        [
          863,
          24
        ],
        [
          864,
          24
        ],
        [
          897,
          13.5
        ],
        [
          902,
          13.2
        ],
        [
          910,
          19.6
        ],
        [
          913,
          18.3
        ],
        [
          922,
          11.9
        ],
        [
          935,
          17.8
        ],
        [
          938,
          18
        ],
        [
          940,
          6.8
        ],
        [
          942,
          14.3
        ],
        [
          983,
          21.2
        ],
        [
          984,
          24
        ],
        [
          1032,
          24
        ],
        [
          1036,
          24
        ],
        [
          1059,
          15
        ],
        [
          1076,
          20
        ],
        [
          1079,
          20
        ],
        [
          1115,
          20
        ],
        [
          1187,
          15
        ]
      ],
      "sp": [
        [
          119,
          189
        ],
        [
          119,
          862
        ],
        [
          487,
          984
        ],
        [
          189,
          913
        ],
        [
          862,
          897
        ],
        [
          1032,
          910
        ],
        [
          119,
          863
        ],
        [
          189,
          897
        ],
        [
          265,
          1032
        ],
        [
          114,
          862
        ]
      ],
      "dc": [
        [
          863,
          983,
          1,
          0.438,
          9,
          " (100% WR em 9 duelos cruzados)"
        ],
        [
          862,
          935,
          1,
          0.438,
          9,
          " (100% WR em 9 duelos cruzados)"
        ],
        [
          267,
          591,
          1,
          0.438,
          8,
          " (100% WR em 8 duelos cruzados)"
        ],
        [
          267,
          270,
          1,
          0.408,
          9,
          " (100% WR em 9 duelos cruzados)"
        ],
        [
          862,
          265,
          1,
          0.408,
          12,
          " (100% WR em 12 duelos cruzados)"
        ],
        [
          935,
          983,
          1,
          0.408,
          23,
          " (100% WR em 23 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        862,
        0.2217,
        0.1254,
        0.0964,
        0.849,
        0.706,
        53
      ],
      [
        571,
        0.2092,
        0.0131,
        0.1961,
        0.846,
        0.898,
        13
      ],
      [
        983,
        0.1919,
        0.1118,
        0.0801,
        0.813,
        0.584,
        91
      ],
      [
        267,
        0.1774,
        0.0343,
        0.1431,
        0.8,
        0.61,
        30
      ],
      [
        938,
        0.1769,
        -0.0143,
        0.1913,
        0.813,
        0.871,
        16
      ],
      [
        935,
        0.174,
        0.111,
        0.063,
        0.778,
        0.248,
        167
      ],
      [
        1032,
        0.1616,
        0.029,
        0.1326,
        0.784,
        0.602,
        37
      ],
      [
        270,
        0.1328,
        0.0699,
        0.0629,
        0.735,
        0.212,
        189
      ],
      [
        863,
        0.1182,
        0.0031,
        0.1151,
        0.745,
        0.704,
        55
      ],
      [
        910,
        0.0858,
        0.0334,
        0.0524,
        0.681,
        0.062,
        304
      ],
      [
        902,
        0.0714,
        -0.0477,
        0.1191,
        0.69,
        0.525,
        58
      ],
      [
        984,
        0.0676,
        -0.0244,
        0.092,
        0.691,
        0.621,
        97
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "AgICAwMDAwMDAwMDAwMDAgICAAAAAQEBAwMDBAQBBAQEBAQEBAEEAAQEAQEBAgIEAQEBAQQEBAQEBAQEBAQEAwMDAwMCBAECAAEBAQQEBAEAAQEEBAQEAwMDAwMBAQICAQMDA09PT5GRkY6OjlVVVY2NjY+Pj3d3d4aGhoGBgUNNBUNDTEx0dEwDTYpzc2ne3jGTdGlpAwNRSVFRSSgomiiamqqYmpqaMU0OMYoJCQlQUHPeigUFUE9PSZiYrKysDiYtkybShpQ=",
        0,
        0,
        74,
        26,
        2.98,
        0.048,
        0.0126
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "AgICAwMDAwMDAwMDAwMDAgICAAAAAQEBAwMDBAQBBAQEBAQEBAEEAAQEAQEBAgQEAQEBAQQEBAQEBAQEBAQEAwMDAwMCBAECAAEBAQMDBAEAAQEDAwQEAwMDAwMBAQICAQMDA09PT5GRkY6OjlVVVY2NjY+Pj3d3d4aGhoGBgUNNBUNDTEx0dEwDTYpzc2ne3jEjdGlpAwNRSVFRSSgomiiamqqYmpqaMU0OMYoJCQmvr3PeigUFp6ejSZiYrKysDiYtkybShpQ=",
        0,
        6,
        68,
        26,
        2.98,
        0.263,
        0.0286
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "AgICAwMDAwMDAwMDAwMDAgICAAAAAQEBAwMDBAEEBAQABAQEBAQEBAQEAQEBAQQEAQEBAQQEBAQCAwMDAwQDAwMDAwMABAEAAAEBAQMDBAEAAQEDAwQEBAQDAwMBAQIBAQMDA09PT5GRkY6OjlVVVY2NjY+Pj3d3d4aGhoGBgUMFN0NDikx0dExMTU1zc2lp3t4jdANpAwNRNFFRUa6u19ea2KqYmpqai00Oi4oJCQmvr3PeigUFp6ejSUlJrKysDiYtDSbShpQ=",
        3,
        14,
        57,
        26,
        3.11,
        0.631,
        0.0283
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "AgICAwMDAwMDAwMDAwMDAgICAAAAAQEBAwMDBAQEBAQAAAQEBAQEBAQEAAABAQQEAQAEAQQEBAECAwMDAwMDAwQDAwMAAQEABAEBAQMDAQEAAQEDAwQEBAQDAwMBAQIBAQMDA09PT5GRkY6OjlVVVY2NjY+Pj3d3d4aGhoGBgQxDN1tDiop0dExMTU10c3Jy4+MjQwN+TANRNFHzUa6u19fY2KpJmpqaiwUOi00JCQmvr+fnigUFp6ejUUlJrKysDiYtDSbShpQ=",
        6,
        22,
        46,
        26,
        3.2,
        0.732,
        0.0259
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "AgICAwMDAwMDAwMDAwMDAgICAAAAAQEBAwMDBAIEBAEDAwAAAAADAwMDAAABAQQCAAACAgQEAQECAwMDAwMDAwEDAwMAAwEAAQEBAQMDAQEBAQEDAwQDAwMDAwMBAQIBAQMDA09PT5GRkY6OjlVVVY2NjY+Pj3d3d4aGhoGBgQyZN1sLXl6Pj3NzX18BAXJy4+MjO35+mJgINCvzUa6u19fY2KqJmpqai1sOi20JCQmvr+fnbQUFp6ej/LCwrKysDiYtDSbShpQ=",
        9,
        44,
        21,
        26,
        3.58,
        0.808,
        0.0231
      ]
    ]
  },
  "dual_red_neutral": {
    "archetypeId": "dual_red_neutral",
    "domains": [
      "red",
      "neutral"
    ],
    "isAxialAlliance": true,
    "triadId": "pyros_alliances",
    "name": "Aliança da Artilharia de Mercúrio",
    "subtitle": "Aliança 🔥+⚙️ • Tropas de Choque & Assassinos Relojoeiros",
    "strategySummary": "Funde a velocidade vulcânica de Pyros com mercenários de Ímpeto/Toque Letal e autômatos de cerco da Cidade Franca.",
    "tacticalIdentity": "aggro",
    "coverCardId": "red_173_general_roda_chama",
    "generationsEvolved": 26,
    "matchesSimulated": 7548,
    "seedWinRate": 0.631,
    "championWinRate": 0.736,
    "vsMonocolorWinRate": 0.828,
    "championDeckJaccardStability": 0.905,
    "medianCardCi95HalfWidth": 0.0357,
    "domainCardBreakdown": {
      "neutral": 46,
      "red": 54
    },
    "crossDomainCombos": [
      [
        910,
        210,
        1,
        0.294,
        12,
        " (100% WR em 12 duelos cruzados)"
      ],
      [
        1032,
        205,
        1,
        0.294,
        8,
        " (100% WR em 8 duelos cruzados)"
      ],
      [
        935,
        35,
        1,
        0.294,
        13,
        " (100% WR em 13 duelos cruzados)"
      ],
      [
        935,
        1160,
        1,
        0.294,
        16,
        " (100% WR em 16 duelos cruzados)"
      ],
      [
        922,
        1034,
        1,
        0.294,
        8,
        " (100% WR em 8 duelos cruzados)"
      ],
      [
        1032,
        11,
        1,
        0.294,
        11,
        " (100% WR em 11 duelos cruzados)"
      ]
    ],
    "learnedProfile": {
      "deckId": "dual_red_neutral",
      "deckName": "Aliança da Artilharia de Mercúrio",
      "archetypeTag": "aggro",
      "generationsTrained": 20,
      "matchesSimulated": 7484,
      "baselineWinRate": 0.631,
      "trainedWinRate": 0.736,
      "weights": {
        "aggroFaceBias": 1.32,
        "tradeValueBias": 1.08,
        "guardianPriority": 0.96,
        "flyingEvasionBias": 1.26,
        "stackConsolidationBias": 1,
        "antiAoeSpreadBias": 1,
        "spellHoldPatience": 0.94,
        "relicPriority": 1,
        "ascensionEagerness": 0.93,
        "bloodPactThresholdHp": 24,
        "domainExpansionEagerness": 1.03,
        "sovPowerTempoBias": 1.24,
        "synergyHoldBonus": 18,
        "mulliganCurveTarget": 2.6
      },
      "mk": [
        300,
        913,
        205,
        910,
        591,
        791,
        892,
        917,
        922
      ],
      "cp": [
        899,
        1016,
        300,
        602,
        934,
        192,
        693,
        200,
        502,
        201
      ],
      "ca": [
        11,
        35,
        189,
        205,
        300,
        600,
        605,
        791,
        892,
        910,
        913,
        917
      ],
      "hb": [
        [
          2,
          7.2
        ],
        [
          3,
          12.1
        ],
        [
          11,
          12
        ],
        [
          35,
          12.8
        ],
        [
          189,
          22.4
        ],
        [
          205,
          14.4
        ],
        [
          210,
          12.1
        ],
        [
          300,
          19.2
        ],
        [
          600,
          12.6
        ],
        [
          605,
          11.5
        ],
        [
          791,
          11.5
        ],
        [
          892,
          14
        ],
        [
          910,
          14.5
        ],
        [
          913,
          16.8
        ],
        [
          917,
          14.4
        ],
        [
          922,
          12.4
        ],
        [
          935,
          14.2
        ],
        [
          1028,
          19.8
        ],
        [
          1032,
          16.5
        ],
        [
          1034,
          15.8
        ],
        [
          1061,
          11
        ],
        [
          1064,
          11
        ],
        [
          1112,
          11
        ],
        [
          1160,
          12.2
        ],
        [
          1178,
          11
        ]
      ],
      "sp": [
        [
          189,
          205
        ],
        [
          189,
          300
        ],
        [
          892,
          317
        ],
        [
          189,
          503
        ],
        [
          189,
          940
        ],
        [
          189,
          913
        ],
        [
          189,
          11
        ],
        [
          189,
          0
        ],
        [
          1032,
          892
        ],
        [
          605,
          35
        ]
      ],
      "dc": [
        [
          910,
          210,
          1,
          0.294,
          12,
          " (100% WR em 12 duelos cruzados)"
        ],
        [
          1032,
          205,
          1,
          0.294,
          8,
          " (100% WR em 8 duelos cruzados)"
        ],
        [
          935,
          35,
          1,
          0.294,
          13,
          " (100% WR em 13 duelos cruzados)"
        ],
        [
          935,
          1160,
          1,
          0.294,
          16,
          " (100% WR em 16 duelos cruzados)"
        ],
        [
          922,
          1034,
          1,
          0.294,
          8,
          " (100% WR em 8 duelos cruzados)"
        ],
        [
          1032,
          11,
          1,
          0.294,
          11,
          " (100% WR em 11 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        1028,
        0.2174,
        0.1298,
        0.0877,
        1,
        0.925,
        5
      ],
      [
        1032,
        0.1435,
        0.0234,
        0.1201,
        0.909,
        0.585,
        22
      ],
      [
        1034,
        0.128,
        -0.0035,
        0.1315,
        0.9,
        0.714,
        20
      ],
      [
        935,
        0.0937,
        0.0402,
        0.0536,
        0.833,
        0.065,
        186
      ],
      [
        35,
        0.0566,
        -0.0253,
        0.0819,
        0.821,
        0.569,
        84
      ],
      [
        922,
        0.0536,
        0.0035,
        0.0501,
        0.795,
        0.104,
        249
      ],
      [
        1160,
        0.049,
        -0.0447,
        0.0937,
        0.8,
        0.293,
        70
      ],
      [
        3,
        0.0474,
        0.0002,
        0.0472,
        0.786,
        0.049,
        290
      ],
      [
        210,
        0.0462,
        -0.0667,
        0.1128,
        0.796,
        0.269,
        49
      ],
      [
        11,
        0.045,
        -0.0026,
        0.0476,
        0.784,
        0.053,
        287
      ],
      [
        205,
        0.0396,
        -0.007,
        0.0466,
        0.778,
        0.038,
        306
      ],
      [
        913,
        0.0326,
        -0.0146,
        0.0472,
        0.77,
        0.032,
        305
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "AwMDAwMDAAAAAQEBAwMDBAEBAAAAAwMDAgICAwMDAAAAAwICAgAAAAAAAAEBAQQDAwMBBAQDAwMDAwMCAgIEAwMDAwMDBAQEAwMCAgIEBAQAAAAEBAAAAAAAAAABBAMAAQQEBJGRkY6OjgsLCywsLBcXF1j29snJyYODg1hYWJWVlQAAAPi1tbUDAwPNzc339/compqaI5ooqqqqrKysT09PKI2NjXx8fFgliPj4WlpaJViIAgICgiXIwMDAtbW1I4KGIiOaiJo=",
        0,
        0,
        46,
        54,
        2.25,
        0.043,
        0.0122
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "AwMDAwMDAAAAAQEBAwMDBAEBAAAAAwMDAgICAwMDAAAAAwICAgAAAAAAAAEBAQQDAwMDBAQDAwMDAwMCAgIEAwMDAwMDBAQEAwMCAgIEBAQAAAABBAAAAAAAAAADAQMAAwQABJGRkY6OjgsLCywsLBcXF1j29snJyYODg1hYWJWVlQAAAPi1tbUDAwPNzc339/compqap5ooqqqqrKysT09PKI2NjXx8fFgliPj4WlpaJViIAgICPSXIwMDAtbW1pz2GIq+aI5o=",
        0,
        6,
        45,
        49,
        2.33,
        0.276,
        0.0291
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "AwMDAwMDAAAAAQEBAwMDAAEBAAAAAwMDAgICAwMDAAAABAICAgAAAAAAAAEBAQQDAwMDBAQDAwMDAwMCAgIEAwMDAwMDBAQAAwMCAgIEBAQAAAABBAAAAAAAAAADAQMAAwEABJGRkY6OjgsLCywsLBcXF9L29snJyYODg1hYWJWVlQAAAAq1tbUDAwPNzc339/compqap5ooqqqqrKysT09PKI2NjXx8fFglI/j4WlpaJViIAgICPSXIwMDAtbW1pz2GIq+PI5o=",
        3,
        7,
        41,
        49,
        2.43,
        0.615,
        0.0283
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "AwMDAwMDAAAAAQEBAwMDAAEBAAAAAwMDAgICAwMDAAAABAICAgAAAAAAAAEBAQQDAwMDBAQDAwMDAwMCAgIEAwMDAwMDAAEAAwMCAgIEBAQAAAABBAAAAAAAAAADAQMAAwEAAZGRkY6OjgsLCywsLBcXF9L29snJyYODg1hYWJWVlQAAAAq1tbUDAwPNzc339/compqap5ooqqqqrKysT09PKI2NjXx8fNH9I/j4WlpaJViIAgICPSXIwMDAtbW1pz2GIq+PIys=",
        6,
        7,
        38,
        49,
        2.52,
        0.719,
        0.0273
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "AwMDAwMDAAAAAQEBAwMDAAEBAAAAAwMDAgICAwMDAAAABAICAgAAAAAAAAEBAQADAwMDBAQDAwMDAwMCAgIEAwMDAwMDAAEAAwMCAgIEBAQAAAABBAAAAAAAAAADAQMAAwEAAZGRkY6OjgsLCywsLBcXF9L29snJyYODg1hYWJWVlQAAAAq1tbUDAwPNzc339/e9mpqap5ooqqqqrKysT09PCI2NjXx8fNH9I/j4WlpaJViIAgICPQTIwMDAtbW1pz2GIq+PIys=",
        9,
        7,
        35,
        49,
        2.66,
        0.828,
        0.0219
      ]
    ]
  },
  "dual_blue_neutral": {
    "archetypeId": "dual_blue_neutral",
    "domains": [
      "blue",
      "neutral"
    ],
    "isAxialAlliance": true,
    "triadId": "vortex_alliances",
    "name": "Aliança do Astrolábio Arcano",
    "subtitle": "Aliança ❄️+⚙️ • Controle Horológico, Alcance & Voo",
    "strategySummary": "Coordena Congelamento glacial e compra de cartas com artilharia de Alcance e Constructos de Escudo Divino da Matriz Axial.",
    "tacticalIdentity": "tempo",
    "coverCardId": "blue_81_arconte_cronos",
    "generationsEvolved": 26,
    "matchesSimulated": 7852,
    "seedWinRate": 0.488,
    "championWinRate": 0.553,
    "vsMonocolorWinRate": 0.656,
    "championDeckJaccardStability": 0.905,
    "medianCardCi95HalfWidth": 0.18,
    "domainCardBreakdown": {
      "blue": 65,
      "neutral": 35
    },
    "crossDomainCombos": [
      [
        58,
        922,
        1,
        0.477,
        12,
        " (100% WR em 12 duelos cruzados)"
      ],
      [
        942,
        922,
        0.933,
        0.38,
        15,
        " (93% WR em 15 duelos cruzados)"
      ],
      [
        1035,
        54,
        0.929,
        0.375,
        14,
        " (93% WR em 14 duelos cruzados)"
      ],
      [
        811,
        226,
        0.929,
        0.375,
        14,
        " (93% WR em 14 duelos cruzados)"
      ],
      [
        226,
        922,
        0.889,
        0.365,
        9,
        " (89% WR em 9 duelos cruzados)"
      ],
      [
        37,
        922,
        0.882,
        0.359,
        17,
        " (88% WR em 17 duelos cruzados)"
      ]
    ],
    "learnedProfile": {
      "deckId": "dual_blue_neutral",
      "deckName": "Aliança do Astrolábio Arcano",
      "archetypeTag": "tempo",
      "generationsTrained": 20,
      "matchesSimulated": 7788,
      "baselineWinRate": 0.488,
      "trainedWinRate": 0.553,
      "weights": {
        "aggroFaceBias": 1.07,
        "tradeValueBias": 1.28,
        "guardianPriority": 0.96,
        "flyingEvasionBias": 1.28,
        "stackConsolidationBias": 1,
        "antiAoeSpreadBias": 1,
        "spellHoldPatience": 1.21,
        "relicPriority": 1,
        "ascensionEagerness": 1,
        "bloodPactThresholdHp": 24,
        "domainExpansionEagerness": 0.98,
        "sovPowerTempoBias": 1,
        "synergyHoldBonus": 18,
        "mulliganCurveTarget": 2.9
      },
      "mk": [
        37,
        47,
        892,
        591
      ],
      "cp": [
        815,
        942,
        715,
        330,
        57,
        403,
        892,
        321,
        943,
        401
      ],
      "ca": [
        37,
        54,
        58,
        189,
        226,
        816,
        892,
        922,
        942,
        1029,
        1032,
        1035
      ],
      "hb": [
        [
          37,
          22.3
        ],
        [
          54,
          19.5
        ],
        [
          58,
          22
        ],
        [
          189,
          24
        ],
        [
          226,
          19.1
        ],
        [
          811,
          7.4
        ],
        [
          816,
          24
        ],
        [
          892,
          16.4
        ],
        [
          922,
          15.8
        ],
        [
          935,
          15.6
        ],
        [
          942,
          15.7
        ],
        [
          1029,
          22.3
        ],
        [
          1032,
          22.6
        ],
        [
          1035,
          24
        ],
        [
          1064,
          11
        ],
        [
          1097,
          11
        ],
        [
          1118,
          20
        ],
        [
          1120,
          20
        ],
        [
          1187,
          15
        ]
      ],
      "sp": [
        [
          37,
          189
        ],
        [
          69,
          189
        ],
        [
          54,
          189
        ],
        [
          816,
          189
        ],
        [
          1035,
          892
        ],
        [
          189,
          922
        ],
        [
          1035,
          54
        ],
        [
          189,
          892
        ],
        [
          37,
          1035
        ],
        [
          58,
          922
        ]
      ],
      "dc": [
        [
          58,
          922,
          1,
          0.477,
          12,
          " (100% WR em 12 duelos cruzados)"
        ],
        [
          942,
          922,
          0.933,
          0.38,
          15,
          " (93% WR em 15 duelos cruzados)"
        ],
        [
          1035,
          54,
          0.929,
          0.375,
          14,
          " (93% WR em 14 duelos cruzados)"
        ],
        [
          811,
          226,
          0.929,
          0.375,
          14,
          " (93% WR em 14 duelos cruzados)"
        ],
        [
          226,
          922,
          0.889,
          0.365,
          9,
          " (89% WR em 9 duelos cruzados)"
        ],
        [
          37,
          922,
          0.882,
          0.359,
          17,
          " (88% WR em 17 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        226,
        0.2019,
        0.1008,
        0.1011,
        0.773,
        0.347,
        66
      ],
      [
        1035,
        0.1567,
        0.0119,
        0.1448,
        0.743,
        0.653,
        35
      ],
      [
        922,
        0.129,
        0.0107,
        0.1183,
        0.714,
        0.636,
        56
      ],
      [
        935,
        0.1239,
        0.0516,
        0.0724,
        0.697,
        0.387,
        155
      ],
      [
        942,
        0.1144,
        0.0349,
        0.0795,
        0.682,
        0.279,
        132
      ],
      [
        1032,
        0.0993,
        -0.0383,
        0.1376,
        0.682,
        0.581,
        44
      ],
      [
        58,
        0.073,
        -0.0134,
        0.0864,
        0.644,
        0.352,
        118
      ],
      [
        37,
        0.0623,
        0.009,
        0.0533,
        0.625,
        0.177,
        317
      ],
      [
        892,
        0.0387,
        -0.0149,
        0.0537,
        0.6,
        0.156,
        320
      ],
      [
        811,
        0.0369,
        -0.0388,
        0.0757,
        0.62,
        0.597,
        158
      ],
      [
        591,
        0.0369,
        -0.0317,
        0.0686,
        0.617,
        0.523,
        193
      ],
      [
        54,
        0.0118,
        -0.0452,
        0.057,
        0.574,
        0.181,
        289
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "AAAAAwMDAwMDBAEBAQEAAAAEAQEDAwMBAQECAgICBAQEAAICBAQCBAAAAAQABAAABAQAAAQEAwMEBAMEAwMDAAAAAQEBAAAABAQCAgMDAwEBAQQAAAAEAAQEAAQDBAQDAwADAN3d3Y2NjSsrK1JBQZSUvr6+UpGRfHx8Pj4+T09PblRTUzTIblNSblQmJiYotii1tUlJtrWampqaSSiamqysrCUlJUJCQjY2NkBAyMguLi6Tk5NURUVFQDRkZMBkLGhoLJ80LLY=",
        0,
        0,
        74,
        26,
        2.89,
        0.081,
        0.0165
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "AAAAAwMDAwMDBAEBAQEAAAAEAQEDAwMBAQECAgICBAQEAQECBAQCBAAAAAQABAAABAQAAAQEAwMEBAMEAwMDAAAAAQEBAAAABAQCAgMDAwEBAQQAAAAEAAQEAAQDBAQDBAADAN3d3Y2NjSsrK1JBQZSUvr6+UpGRfHx8Pj4+T09PblRTU0VFblNSblQmJiYotii1tUlJtrWamprqSSiamqysrCUlJUJCQjY2NkBAy8suLi6Tk5NURUVFQDRkZMBkLGhoLKM0LLY=",
        0,
        6,
        68,
        26,
        2.96,
        0.233,
        0.0275
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "AAAAAwMDAwMDBAEBAQEAAAAEAQEDAwMBAQECAgICBAQEAQECBAQCAQAAAAQEBAAABAQAAAQEAwMEBAMEAAMDAAAAAQEBAAAABAQCAgMDAwEBAQQAAAAEBAEBAAEDAQADBAADAN3d3Y2NjSsrK1NBQZSUvr6+UpGRfHx8Pj4+T09Pbl5UVEVFblNTbpgmJiYoYCi1tUlJtraamurqSSiamrWnpyUlJUJCQjY2NlJSy8suLi6Tk5NURUVFQEBKSsBPLE9HLKM0LLY=",
        3,
        14,
        60,
        23,
        3.13,
        0.574,
        0.0294
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "AAAAAwMDAwMDBAEBAQEAAAAEAQEDAwMBAQECAgIEBAIEAQEABAQCAQAAAAQEBAMDBAEAAAAAAwMEBAMDAwMDAAAAAQEBAAAABAQCAgMDAwEBAQIAAAADAwEBAAEDAQADBAADBN3d3Y2NjSsrK1NBQZSUvr6+U5GRfHx8Pj4+T09PC15uVEVF4lRUbpgmJiYoYCivr0nztrbGxurqSSia4+OnpyUlJUJCQjY2NlNSy8suLi6Tk5NuRUVF8/NKSsBPLE9HLKM0LEk=",
        6,
        22,
        49,
        23,
        3.26,
        0.773,
        0.026
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "AAAAAwMDAwMDAgEBAQEAAAACAQEDAwMBAQECAgIEBAMDAQEAAAADAQAAAAQEAQMDAQEDAwAAAwMEBAMDAwMDAAAAAQEBAAAAAgICAgMDAwEBAQAAAAADAwEBAAEDAQADBAADA93d3Y2NjSsrK3BBQZSUvr6+cJGRfHx8Pj4+T09PC14wMEVF4jo6MZgmJiYIYI+vryvzrq7GxurqSSia4+OnpyUlJUJCQjY2Ns3Ny8suLi6Tk5MoRUVF8/NKSsBPLE9HLKM0LLA=",
        10,
        34,
        33,
        23,
        3.58,
        0.813,
        0.0237
      ]
    ]
  },
  "dual_purple_neutral": {
    "archetypeId": "dual_purple_neutral",
    "domains": [
      "purple",
      "neutral"
    ],
    "isAxialAlliance": true,
    "triadId": "eclipse_alliances",
    "name": "Aliança da Guilda das Máscaras",
    "subtitle": "Aliança 💀+⚙️ • Lâminas Letais, Dreno & Submundo Axial",
    "strategySummary": "Opera assassinos furtivos da Cidade Franca ao lado de lordes necróticos de Eclipse com Toque Letal, Dreno de Vida e reanimação.",
    "tacticalIdentity": "midrange",
    "coverCardId": "purple_47_avatar_escuridao",
    "generationsEvolved": 26,
    "matchesSimulated": 7644,
    "seedWinRate": 0.452,
    "championWinRate": 0.506,
    "vsMonocolorWinRate": 0.484,
    "championDeckJaccardStability": 0.905,
    "medianCardCi95HalfWidth": 0.0751,
    "domainCardBreakdown": {
      "purple": 61,
      "neutral": 39
    },
    "crossDomainCombos": [
      [
        731,
        1033,
        1,
        0.494,
        8,
        " (100% WR em 8 duelos cruzados)"
      ],
      [
        76,
        1033,
        1,
        0.494,
        10,
        " (100% WR em 10 duelos cruzados)"
      ],
      [
        1033,
        101,
        1,
        0.494,
        10,
        " (100% WR em 10 duelos cruzados)"
      ],
      [
        346,
        349,
        1,
        0.494,
        12,
        " (100% WR em 12 duelos cruzados)"
      ],
      [
        741,
        101,
        1,
        0.494,
        8,
        " (100% WR em 8 duelos cruzados)"
      ],
      [
        934,
        736,
        0.9,
        0.424,
        10,
        " (90% WR em 10 duelos cruzados)"
      ]
    ],
    "learnedProfile": {
      "deckId": "dual_purple_neutral",
      "deckName": "Aliança da Guilda das Máscaras",
      "archetypeTag": "midrange",
      "generationsTrained": 20,
      "matchesSimulated": 7580,
      "baselineWinRate": 0.452,
      "trainedWinRate": 0.506,
      "weights": {
        "aggroFaceBias": 1.21,
        "tradeValueBias": 1.23,
        "guardianPriority": 1,
        "flyingEvasionBias": 1.04,
        "stackConsolidationBias": 1,
        "antiAoeSpreadBias": 1,
        "spellHoldPatience": 1,
        "relicPriority": 1,
        "ascensionEagerness": 1,
        "bloodPactThresholdHp": 19,
        "domainExpansionEagerness": 1.03,
        "sovPowerTempoBias": 1,
        "synergyHoldBonus": 21,
        "mulliganCurveTarget": 2.8
      },
      "mk": [
        922,
        913,
        591,
        101,
        294
      ],
      "cp": [
        1009,
        99,
        962,
        93,
        995,
        839,
        832,
        916,
        547,
        733
      ],
      "ca": [
        76,
        93,
        101,
        189,
        236,
        346,
        349,
        446,
        545,
        547,
        736,
        839
      ],
      "hb": [
        [
          76,
          9.9
        ],
        [
          93,
          10.9
        ],
        [
          101,
          22.8
        ],
        [
          189,
          24
        ],
        [
          236,
          13.6
        ],
        [
          246,
          13.6
        ],
        [
          346,
          24
        ],
        [
          349,
          21.6
        ],
        [
          446,
          22.2
        ],
        [
          545,
          24
        ],
        [
          547,
          19.5
        ],
        [
          736,
          24
        ],
        [
          741,
          15.3
        ],
        [
          834,
          9.5
        ],
        [
          839,
          23.6
        ],
        [
          913,
          24
        ],
        [
          922,
          23.3
        ],
        [
          1027,
          24
        ],
        [
          1032,
          17.2
        ],
        [
          1033,
          24
        ],
        [
          1066,
          20
        ],
        [
          1076,
          20
        ],
        [
          1098,
          15
        ],
        [
          1120,
          20
        ],
        [
          1187,
          15
        ]
      ],
      "sp": [
        [
          736,
          1027
        ],
        [
          1027,
          101
        ],
        [
          736,
          839
        ],
        [
          922,
          346
        ],
        [
          545,
          101
        ],
        [
          922,
          1033
        ],
        [
          547,
          349
        ],
        [
          189,
          236
        ],
        [
          189,
          736
        ],
        [
          189,
          349
        ]
      ],
      "dc": [
        [
          731,
          1033,
          1,
          0.494,
          8,
          " (100% WR em 8 duelos cruzados)"
        ],
        [
          76,
          1033,
          1,
          0.494,
          10,
          " (100% WR em 10 duelos cruzados)"
        ],
        [
          1033,
          101,
          1,
          0.494,
          10,
          " (100% WR em 10 duelos cruzados)"
        ],
        [
          346,
          349,
          1,
          0.494,
          12,
          " (100% WR em 12 duelos cruzados)"
        ],
        [
          741,
          101,
          1,
          0.494,
          8,
          " (100% WR em 8 duelos cruzados)"
        ],
        [
          934,
          736,
          0.9,
          0.424,
          10,
          " (90% WR em 10 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        1033,
        0.3511,
        0.2365,
        0.1146,
        0.893,
        0.711,
        28
      ],
      [
        1027,
        0.3261,
        0.1641,
        0.1621,
        0.875,
        0.853,
        16
      ],
      [
        446,
        0.1874,
        0.0708,
        0.1167,
        0.719,
        0.513,
        57
      ],
      [
        346,
        0.1476,
        0.0409,
        0.1067,
        0.667,
        0.257,
        75
      ],
      [
        839,
        0.1424,
        0.03,
        0.1124,
        0.682,
        0.665,
        66
      ],
      [
        741,
        0.1173,
        -0.0251,
        0.1425,
        0.651,
        0.552,
        43
      ],
      [
        736,
        0.1147,
        0.05,
        0.0647,
        0.631,
        0.199,
        214
      ],
      [
        349,
        0.1049,
        0.0186,
        0.0863,
        0.639,
        0.551,
        119
      ],
      [
        547,
        0.097,
        0.0023,
        0.0948,
        0.636,
        0.662,
        99
      ],
      [
        545,
        0.0918,
        -0.0683,
        0.1601,
        0.629,
        0.611,
        35
      ],
      [
        101,
        0.0857,
        0.0241,
        0.0616,
        0.61,
        0.361,
        241
      ],
      [
        246,
        0.0808,
        -0.0958,
        0.1766,
        0.621,
        0.674,
        29
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "AAAAAAAAAAACAgICAgIDAwMDAwMDAwMBAQEDAwAABAQAAgIAAAAABAACAgEBAQAAAAMDAwQEBAQEBAQEAwMDBAICAgIDAwMEAAAEBAAAAAACAgIBAQEBAQEAAAACAAEDAwIEBFNTU+zs7L6+T09P29vbjY2NwsLClJSU8PDwQEBbW2JiW4KCS0tZWX1ZHR23t7dlZWWamppRUUmaKChJSaKiolGC3d3dQkJCmvv7fX1h+2Fh39/fJiYmXFxc+Pj4iGTuSqYdYig=",
        0,
        0,
        78,
        22,
        2.86,
        0.036,
        0.0108
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "AAAAAAAAAAACAgICAgIDAwMDAwMDAwMBAQEDAwAABAQAAgIAAAAABAACAgEBAQAAAAMDAwQEBAQDAwQEAwMDBAICAgIDAwMEAQEEBAAAAAACAgIBAQEBAQEAAAACAAEDAwIEBFNTU+zs7L6+T09P29vbjY2NwsLClJSU8PDwQEBbW2JiW4KCS0tZWX1ZHR23t7dlZWWamppRUUmar69JSaKiolGC3d3dQkJCo15efX1h+2Fh39/fJiYmXFxc+Pj4iGTuSqYdYko=",
        0,
        6,
        72,
        22,
        2.9,
        0.297,
        0.0299
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "AAAAAAAAAAACAgICAgIDAwMDAwMDAwMBAQEDAwAABAQAAgIAAAIABAAAAgIBAQAAAAMDAwQEAAADAwQEAwMDBAACAgIDAwMEAQEEBAEBAgICAgIBAQEBAQEAAAACAAEDAwIEBFNTU+zs7L6+T09P29vbjY2NwsLClJSU8PDwQEBbW2JiW4KCTEyCWX1ZWR0dt7dlZWWamppgNMbGr69RUaKiolH23d3dQkJCo15efX1dXSMj39/fJiYmXFxc+Pj4iGTuSqYdYko=",
        3,
        14,
        61,
        22,
        2.99,
        0.624,
        0.0299
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "AAAAAAAAAAACAgICAgIDAwMDAwMDAwMBAQEDAwQABAQEAAAAAAICAAIAAgICAgAAAAMDAwQEAAADAwMDAwMDBAACAgIDAwMEAQEEBAEBAgICAgIBAQEBAQEAAAACAAEDAwAEBFNTU+zs7L6+T09P29vbjY2NwsLClJSU8PDwQEAJW2JiA1tbTEyCgmOCWeDgHx9lZWWamppgNMbGr6/j46Kioir23d3dQkJCo15efX1dXSMj39/fJiYmXFxc+Pj4iGTuSqZjYko=",
        6,
        22,
        50,
        22,
        3.15,
        0.761,
        0.0262
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "AAAAAAAAAAACAgICAgIDAwMDAwMDAwMBAQEDAwQBAgEEAwMAAAAAAAMDAgICAgAAAAMDAwQEAAADAwMDAwMDBAACAgIDAwMEAQEAAAEBAgICAgIBAQEBAQEAAAACAAEDAwACBFNTU+zs7L6+T09P29vbjY2NwsLClJSU8PDwQEAJWiG+A0dHTExdXWNGRuDgHx9lZWWamppgNMbGr6/j46Kioir23d3dQkJCo15e+vpdXSMj39/fJiYmXFxc+Pj4iGTuSqZj5Uo=",
        10,
        30,
        38,
        22,
        3.44,
        0.773,
        0.0253
      ]
    ]
  },
  "dual_gold_neutral": {
    "archetypeId": "dual_gold_neutral",
    "domains": [
      "gold",
      "neutral"
    ],
    "isAxialAlliance": true,
    "triadId": "solaria_alliances",
    "name": "Aliança do Bastião Relojoeiro",
    "subtitle": "Aliança ☀️+⚙️ • Falange de Ferro Meteórico & Escudo Real",
    "strategySummary": "Alinha Guardiões Imperiais de Solária e Golens Relojoeiros com Armadura pesada, Escudo Divino global e contra-ataques disciplinados.",
    "tacticalIdentity": "midrange",
    "coverCardId": "neutral_118_volothamp_cronista_mundos",
    "generationsEvolved": 26,
    "matchesSimulated": 7756,
    "seedWinRate": 0.44,
    "championWinRate": 0.593,
    "vsMonocolorWinRate": 0.625,
    "championDeckJaccardStability": 0.905,
    "medianCardCi95HalfWidth": 0.0451,
    "domainCardBreakdown": {
      "gold": 66,
      "neutral": 34
    },
    "crossDomainCombos": [
      [
        1068,
        910,
        0.933,
        0.37,
        15,
        " (93% WR em 15 duelos cruzados)"
      ],
      [
        279,
        931,
        0.917,
        0.353,
        12,
        " (92% WR em 12 duelos cruzados)"
      ],
      [
        171,
        576,
        0.923,
        0.33,
        13,
        " (92% WR em 13 duelos cruzados)"
      ],
      [
        874,
        931,
        0.889,
        0.326,
        9,
        " (89% WR em 9 duelos cruzados)"
      ],
      [
        1037,
        910,
        0.889,
        0.326,
        9,
        " (89% WR em 9 duelos cruzados)"
      ],
      [
        147,
        1032,
        0.875,
        0.312,
        8,
        " (88% WR em 8 duelos cruzados)"
      ]
    ],
    "learnedProfile": {
      "deckId": "dual_gold_neutral",
      "deckName": "Aliança do Bastião Relojoeiro",
      "archetypeTag": "midrange",
      "generationsTrained": 20,
      "matchesSimulated": 7692,
      "baselineWinRate": 0.44,
      "trainedWinRate": 0.593,
      "weights": {
        "aggroFaceBias": 1.04,
        "tradeValueBias": 1.28,
        "guardianPriority": 1.4,
        "flyingEvasionBias": 1,
        "stackConsolidationBias": 1,
        "antiAoeSpreadBias": 1,
        "spellHoldPatience": 1,
        "relicPriority": 1.14,
        "ascensionEagerness": 1,
        "bloodPactThresholdHp": 24,
        "domainExpansionEagerness": 1.02,
        "sovPowerTempoBias": 0.99,
        "synergyHoldBonus": 20,
        "mulliganCurveTarget": 2.9
      },
      "mk": [
        278,
        913,
        910,
        272,
        784,
        157,
        922
      ],
      "cp": [
        576,
        157,
        942,
        944,
        272,
        432,
        875,
        943,
        578,
        680
      ],
      "ca": [
        171,
        189,
        272,
        278,
        381,
        421,
        428,
        576,
        682,
        784,
        880,
        910
      ],
      "hb": [
        [
          147,
          5.9
        ],
        [
          157,
          9.1
        ],
        [
          171,
          17
        ],
        [
          189,
          24
        ],
        [
          272,
          16.7
        ],
        [
          278,
          19.4
        ],
        [
          381,
          19.3
        ],
        [
          421,
          12.6
        ],
        [
          428,
          20.6
        ],
        [
          576,
          13
        ],
        [
          678,
          8.1
        ],
        [
          682,
          20.8
        ],
        [
          784,
          24
        ],
        [
          880,
          20.2
        ],
        [
          910,
          21.6
        ],
        [
          913,
          18.6
        ],
        [
          922,
          20.2
        ],
        [
          935,
          16
        ],
        [
          942,
          20.8
        ],
        [
          983,
          24
        ],
        [
          1031,
          24
        ],
        [
          1032,
          24
        ],
        [
          1037,
          23.3
        ],
        [
          1050,
          15
        ],
        [
          1068,
          14.4
        ],
        [
          1076,
          20
        ],
        [
          1119,
          20
        ],
        [
          1187,
          15
        ]
      ],
      "sp": [
        [
          381,
          189
        ],
        [
          278,
          189
        ],
        [
          784,
          189
        ],
        [
          784,
          983
        ],
        [
          189,
          910
        ],
        [
          942,
          983
        ],
        [
          874,
          1032
        ],
        [
          272,
          983
        ],
        [
          171,
          983
        ],
        [
          678,
          171
        ]
      ],
      "dc": [
        [
          1068,
          910,
          0.933,
          0.37,
          15,
          " (93% WR em 15 duelos cruzados)"
        ],
        [
          279,
          931,
          0.917,
          0.353,
          12,
          " (92% WR em 12 duelos cruzados)"
        ],
        [
          171,
          576,
          0.923,
          0.33,
          13,
          " (92% WR em 13 duelos cruzados)"
        ],
        [
          874,
          931,
          0.889,
          0.326,
          9,
          " (89% WR em 9 duelos cruzados)"
        ],
        [
          1037,
          910,
          0.889,
          0.326,
          9,
          " (89% WR em 9 duelos cruzados)"
        ],
        [
          147,
          1032,
          0.875,
          0.312,
          8,
          " (88% WR em 8 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        935,
        0.1283,
        0.0695,
        0.0589,
        0.727,
        0.113,
        220
      ],
      [
        1032,
        0.1229,
        -0.0312,
        0.154,
        0.742,
        0.516,
        31
      ],
      [
        983,
        0.1024,
        0.0093,
        0.0931,
        0.727,
        0.632,
        88
      ],
      [
        1068,
        0.0979,
        -0.0307,
        0.1286,
        0.708,
        0.342,
        48
      ],
      [
        171,
        0.0966,
        0.0098,
        0.0869,
        0.718,
        0.571,
        103
      ],
      [
        1037,
        0.0946,
        -0.0814,
        0.176,
        0.72,
        0.643,
        25
      ],
      [
        682,
        0.0835,
        -0.0983,
        0.1818,
        0.708,
        0.631,
        24
      ],
      [
        910,
        0.0597,
        0.0059,
        0.0539,
        0.658,
        0.094,
        298
      ],
      [
        278,
        0.0588,
        0.004,
        0.0547,
        0.657,
        0.108,
        289
      ],
      [
        421,
        0.0587,
        0.0015,
        0.0572,
        0.662,
        0.193,
        263
      ],
      [
        784,
        0.0534,
        -0.0084,
        0.0618,
        0.651,
        0.08,
        229
      ],
      [
        913,
        0.05,
        -0.002,
        0.052,
        0.648,
        0.097,
        324
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "AQEBAwMDAQEBAQEDAwMDAwEBAQMDAwEBAQMDAwQEBAICAQEBAwMEBAAAAAQEBAQDAwQDBAQDAwMDAwMEBAQDBAQDAwMABAAAAwMDAwIEBAIEAQEBAQECAgIAAAADAwMEBAECBLCwsBERERsbdXV1wsKRkZEQEBCOjo6lpaV8fHxWVlZBQRYWFgQEkJCTk5NVVVFRmJhRpigoo6OjmpqaSUkomJpJoKCgn6Cfn2trawSjoKCjVRQUFxcXQEBAnZ2dampqkpIbQZA=",
        0,
        0,
        82,
        18,
        2.92,
        0.02,
        0.0096
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "AQEBAwMDAQEBAQEDAwMDAwEBAQMDAwEBAQMDAwQEBAICAQEBAwMEBAAAAAQEBAQDAwQDBAQDAwMDAwMEBAMDBAQDAwMABAAAAwMDAwIEBAQEAQEBAQECAgIAAAADAwMEBAECBLCwsBERERsbdXV1wsKRkZEQEBCOjo6lpaV8fHxWVlZBQRYWFgQEkJCTk5NVVVFRp6dRpigoo6OjmpqaSUmvr6NJoKCgn6Cfn2trawSjoKAaVRQUFxcXQEBAnZ2dampqkpIbQZA=",
        0,
        6,
        76,
        18,
        2.93,
        0.278,
        0.029
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "AQEBAwMDAQEBAQEDAwMDAwEBAQMDAwEBAQMDAwQEBAICAQEBAwMEBAAAAAQEBAQDAwMDAwMDAwMDAwMDAwMDBAQDAwMABAAAAwMDAwMEBAQEAQEBAQECAgIAAAADAwMAAAECBLCwsBERERsbdXV1wsKRkZEQEBCOjo6lpaV8fHxWLFZBQRYWFgQEkJCTk5NVVVE0p6ezpq6uo6Ojmpqa19evr6NRoKCgn6Cfn2tra21toKAaVhQUFxcXQEBAnZ2dampqmZkbQVU=",
        3,
        14,
        65,
        18,
        3.04,
        0.615,
        0.0291
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "AQEBAwMDAQEBAQEDAwMDAwEBAQMDAwEBAQMDAwQEBAICAQEBAgIEAwAAAAQEBAQDAwMDAwMDAwMDAwMDAwMDBAADAwMDAwQEAwMDAwMCAgQEAQEBAQECAgIAAAADAwMAAAECBLCwsBERERsbdXV1wsKRkZEQEBCOjo6lpaV8fHwNLF9BQRYWFqamkBCTk5NWVgg0p6ezpq6uo6Ojmpqa19evr6PGoKCgDAxVVWtra21tQkIaVhQUFxcXQEBAnZ2dampqmZkbQVU=",
        6,
        22,
        54,
        18,
        3.22,
        0.775,
        0.0248
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "AQEBAwMDAAABAQEDAwMDAwEBAQMDAwEBAQMDAwQEBAICAQEBAgIDAwAAAAICBAQDAwMDAwMDAwMDAwMDAwMDBAADAwMDAwEBAwMDAwMCAgQDAQEBAQECAgIAAAADAwMAAAABALCwsBEREaurdXV1wsKRkZEQEBCOjo6lpaV8fHwNLF+qRBYWFqamEBCTk5OoqAg0p6ezpq6uo6Ojmpqa19evr6PGoKCgDAx9fWtra21tQkIabxQUFxcXQEBAnZ2dampqmZmyrLI=",
        9,
        32,
        41,
        18,
        3.4,
        0.831,
        0.0225
      ]
    ]
  }
});
