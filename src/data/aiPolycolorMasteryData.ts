import { unpackMasteryRecord } from './compactMasteryCodec';
import { AiSkillTier, Domain } from '../types/game';
import type { DeckLearnedAiProfile, DiscoveredCardCombo } from './aiLearnedProfiles';
import type { CardShapleyMetric, TierDeckMetadata } from './aiMonocolorMasteryData';

/**
 * GERADO AUTOMATICAMENTE POR src/scripts/trainPolycolorEvolution.ts (npm run train:polycolor)
 * Partidas Simuladas: 47.572 | Estados Treinados nas 13 Value MLPs: 195.000 (271s em 10 threads)
 * Margem de Erro Máxima IC 95% nos Tiers: ±2.98%
 */

export type PolycolorArchetypeId =
  | 'tri_red_blue_purple'
  | 'tri_red_green_gold'
  | 'tri_blue_purple_gold'
  | 'tri_red_purple_green'
  | 'tri_blue_green_gold'
  | 'tri_blue_purple_green'
  | 'tri_red_purple_gold'
  | 'tri_purple_green_gold'
  | 'tri_red_blue_green'
  | 'tri_red_blue_gold'
  | 'penta_prismatic_crater'
  | 'penta_free_city_sovereign'
  | 'penta_wheel_convergence';

export type PolycolorConclaveId =
  | 'cataclysm_triads'
  | 'imperial_triads'
  | 'pentachromatic_apex';

export interface PolycolorArchetypeMastery {
  archetypeId: PolycolorArchetypeId;
  tierFormat: 'tricolor' | 'pentachromatic';
  domains: Domain[];
  conclaveId: PolycolorConclaveId;
  classicDeckIds: string[];
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
  vsBicolorWinRate: number;
  championDeckJaccardStability: number;
  medianCardCi95HalfWidth: number;
  domainCardBreakdown: Record<string, number>;
  crossDomainCombos: DiscoveredCardCombo[];
  learnedProfile: DeckLearnedAiProfile;
  topShapleyCards: CardShapleyMetric[];
  tierDecks: Record<AiSkillTier, TierDeckMetadata>;
}

export interface PolycolorConclaveLadderBenchmark {
  conclaveId: PolycolorConclaveId;
  conclaveTitle: string;
  archetypeIds: PolycolorArchetypeId[];
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

export interface PolycolorTrainingSummary {
  generatedAt: string;
  totalMatchesSimulated: number;
  totalStateTrajectoriesTrained: number;
  elapsedSeconds: number;
  archetypesCount: number;
  tricolorCount: number;
  pentachromaticCount: number;
  overallVsMonocolorTier5WinRate: number;
  overallVsBicolorTier5WinRate: number;
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
  ladderByConclave: Record<PolycolorConclaveId, PolycolorConclaveLadderBenchmark>;
}

export const POLYCOLOR_TRAINING_SUMMARY: PolycolorTrainingSummary = {
  "generatedAt": "2026-11-10T20:32:54.782Z",
  "totalMatchesSimulated": 64342,
  "totalStateTrajectoriesTrained": 272482,
  "elapsedSeconds": 332.4,
  "archetypesCount": 13,
  "tricolorCount": 10,
  "pentachromaticCount": 3,
  "overallVsMonocolorTier5WinRate": 0.703,
  "overallVsBicolorTier5WinRate": 0.509,
  "convergenceReport": {
    "workerThreadsUsed": 10,
    "targetTierCi95HalfWidth": 0.03,
    "achievedMaxTierCi95HalfWidth": 0.0298,
    "targetDeckJaccardStability": 0.975,
    "achievedMeanDeckJaccardStability": 0.994,
    "achievedMaxMedianCardCi95HalfWidth": 0.18,
    "minComboCoPlays": 24,
    "generationsExecuted": 13,
    "convergedEarly": false
  },
  "ladderByConclave": {
    "cataclysm_triads": {
      "conclaveId": "cataclysm_triads",
      "conclaveTitle": "Conclave dos Cataclismos Elementais (5 Tríades de Fúria & Ruína)",
      "archetypeIds": [
        "tri_red_blue_purple",
        "tri_red_green_gold",
        "tri_red_purple_green",
        "tri_red_purple_gold",
        "tri_red_blue_green"
      ],
      "matchesPerCell": 200,
      "totalLadderMatches": 3250,
      "tierOverallWinRates": {
        "1": 0.049,
        "2": 0.341,
        "3": 0.651,
        "4": 0.703,
        "5": 0.739
      },
      "tierCi95HalfWidths": {
        "1": 0.0124,
        "2": 0.0298,
        "3": 0.0281,
        "4": 0.028,
        "5": 0.0264
      },
      "maxTierCi95HalfWidth": 0.0298,
      "convergedByMargin": true,
      "adjacentDominanceWinRates": {
        "tier2VsTier1": 0.86,
        "tier3VsTier2": 0.78,
        "tier4VsTier3": 0.543,
        "tier5VsTier4": 0.547,
        "tier5VsTier1": 0.99
      }
    },
    "imperial_triads": {
      "conclaveId": "imperial_triads",
      "conclaveTitle": "Conclave das Ordens Imperiais & Abissais (5 Tríades de Trono & Estase)",
      "archetypeIds": [
        "tri_blue_purple_gold",
        "tri_blue_green_gold",
        "tri_blue_purple_green",
        "tri_purple_green_gold",
        "tri_red_blue_gold"
      ],
      "matchesPerCell": 250,
      "totalLadderMatches": 3350,
      "tierOverallWinRates": {
        "1": 0.029,
        "2": 0.363,
        "3": 0.67,
        "4": 0.712,
        "5": 0.75
      },
      "tierCi95HalfWidths": {
        "1": 0.0097,
        "2": 0.0286,
        "3": 0.028,
        "4": 0.0273,
        "5": 0.0255
      },
      "maxTierCi95HalfWidth": 0.0286,
      "convergedByMargin": true,
      "adjacentDominanceWinRates": {
        "tier2VsTier1": 0.94,
        "tier3VsTier2": 0.808,
        "tier4VsTier3": 0.557,
        "tier5VsTier4": 0.583,
        "tier5VsTier1": 0.988
      }
    },
    "pentachromatic_apex": {
      "conclaveId": "pentachromatic_apex",
      "conclaveTitle": "Conclave Pentacromático Ápice (Cratera Prismática, Cidade Franca & Matriz)",
      "archetypeIds": [
        "penta_prismatic_crater",
        "penta_free_city_sovereign",
        "penta_wheel_convergence"
      ],
      "matchesPerCell": 288,
      "totalLadderMatches": 3276,
      "tierOverallWinRates": {
        "1": 0.051,
        "2": 0.372,
        "3": 0.666,
        "4": 0.694,
        "5": 0.726
      },
      "tierCi95HalfWidths": {
        "1": 0.0122,
        "2": 0.0293,
        "3": 0.0285,
        "4": 0.0284,
        "5": 0.0265
      },
      "maxTierCi95HalfWidth": 0.0293,
      "convergedByMargin": true,
      "adjacentDominanceWinRates": {
        "tier2VsTier1": 0.858,
        "tier3VsTier2": 0.769,
        "tier4VsTier3": 0.506,
        "tier5VsTier4": 0.528,
        "tier5VsTier1": 0.986
      }
    }
  }
};

export const POLYCOLOR_ARCHETYPE_MASTERY: Record<
  PolycolorArchetypeId,
  PolycolorArchetypeMastery
> = unpackMasteryRecord<PolycolorArchetypeId, PolycolorArchetypeMastery>({
  "tri_red_blue_purple": {
    "archetypeId": "tri_red_blue_purple",
    "tierFormat": "tricolor",
    "domains": [
      "blue",
      "red",
      "purple"
    ],
    "conclaveId": "cataclysm_triads",
    "classicDeckIds": [
      "deck_tri_arcane_cataclysm",
      "deck_tri_astral_cataclysm"
    ],
    "name": "Cataclismo da Convergência Astral",
    "subtitle": "Tríade ❄️+🔥+💀 • Estase, Fogo Piroclástico & Execução Umbral",
    "strategySummary": "Une Congelamento e compra rúnica de Vórtex à artilharia vulcânica de Pyros e ceifadores letais de Eclipse para domínio absoluto de tempo e remoção.",
    "tacticalIdentity": "control",
    "coverCardId": "blue_98_soberano_mares",
    "generationsEvolved": 25,
    "matchesSimulated": 7028,
    "seedWinRate": 0.458,
    "championWinRate": 0.468,
    "vsMonocolorWinRate": 0.594,
    "vsBicolorWinRate": 0.5,
    "championDeckJaccardStability": 0.887,
    "medianCardCi95HalfWidth": 0.0893,
    "domainCardBreakdown": {
      "blue": 43,
      "neutral": 12,
      "red": 23,
      "purple": 22
    },
    "crossDomainCombos": [
      [
        811,
        1033,
        1,
        0.562,
        12,
        " (100% WR em 12 duelos cruzados)"
      ],
      [
        54,
        1033,
        0.923,
        0.485,
        13,
        " (92% WR em 13 duelos cruzados)"
      ],
      [
        69,
        1033,
        0.909,
        0.471,
        11,
        " (91% WR em 11 duelos cruzados)"
      ],
      [
        1033,
        300,
        0.909,
        0.471,
        11,
        " (91% WR em 11 duelos cruzados)"
      ],
      [
        1074,
        83,
        0.889,
        0.451,
        9,
        " (89% WR em 9 duelos cruzados)"
      ],
      [
        816,
        460,
        0.889,
        0.451,
        9,
        " (89% WR em 9 duelos cruzados)"
      ]
    ],
    "learnedProfile": {
      "deckId": "tri_red_blue_purple",
      "deckName": "Cataclismo da Convergência Astral",
      "archetypeTag": "control",
      "generationsTrained": 19,
      "matchesSimulated": 7028,
      "baselineWinRate": 0.458,
      "trainedWinRate": 0.468,
      "weights": {
        "aggroFaceBias": 1.11,
        "tradeValueBias": 1.28,
        "guardianPriority": 1,
        "flyingEvasionBias": 1.28,
        "stackConsolidationBias": 1,
        "antiAoeSpreadBias": 1,
        "spellHoldPatience": 1.27,
        "relicPriority": 1,
        "ascensionEagerness": 1,
        "bloodPactThresholdHp": 24,
        "domainExpansionEagerness": 1.02,
        "sovPowerTempoBias": 1.04,
        "synergyHoldBonus": 26,
        "mulliganCurveTarget": 2.9
      },
      "mk": [
        300,
        591,
        648,
        909,
        922
      ],
      "cp": [
        106,
        816,
        22,
        715,
        93,
        838,
        717,
        839,
        38,
        190
      ],
      "ca": [
        54,
        93,
        205,
        300,
        346,
        605,
        800,
        811,
        816,
        839,
        922,
        1029
      ],
      "hb": [
        [
          11,
          6.7
        ],
        [
          54,
          17.7
        ],
        [
          93,
          24
        ],
        [
          205,
          9.1
        ],
        [
          221,
          13.2
        ],
        [
          300,
          24
        ],
        [
          346,
          15.9
        ],
        [
          460,
          16.1
        ],
        [
          605,
          23.7
        ],
        [
          800,
          23.2
        ],
        [
          811,
          22.6
        ],
        [
          816,
          24
        ],
        [
          839,
          17
        ],
        [
          922,
          18.7
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
          1034,
          21.6
        ],
        [
          1035,
          24
        ],
        [
          1038,
          15
        ],
        [
          1071,
          13.5
        ],
        [
          1074,
          15.6
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
          1151,
          15
        ]
      ],
      "sp": [
        [
          1033,
          300
        ],
        [
          816,
          922
        ],
        [
          816,
          300
        ],
        [
          922,
          1033
        ],
        [
          816,
          54
        ],
        [
          816,
          3
        ],
        [
          816,
          1034
        ],
        [
          1029,
          221
        ],
        [
          54,
          1033
        ],
        [
          816,
          221
        ]
      ],
      "dc": [
        [
          811,
          1033,
          1,
          0.562,
          12,
          " (100% WR em 12 duelos cruzados)"
        ],
        [
          54,
          1033,
          0.923,
          0.485,
          13,
          " (92% WR em 13 duelos cruzados)"
        ],
        [
          69,
          1033,
          0.909,
          0.471,
          11,
          " (91% WR em 11 duelos cruzados)"
        ],
        [
          1033,
          300,
          0.909,
          0.471,
          11,
          " (91% WR em 11 duelos cruzados)"
        ],
        [
          1074,
          83,
          0.889,
          0.451,
          9,
          " (89% WR em 9 duelos cruzados)"
        ],
        [
          816,
          460,
          0.889,
          0.451,
          9,
          " (89% WR em 9 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        1033,
        0.4076,
        0.2925,
        0.1152,
        0.913,
        0.755,
        23
      ],
      [
        1034,
        0.2587,
        0.0297,
        0.229,
        0.769,
        0.857,
        13
      ],
      [
        816,
        0.1456,
        0.0641,
        0.0815,
        0.63,
        0.328,
        135
      ],
      [
        460,
        0.1356,
        0.0006,
        0.135,
        0.633,
        0.588,
        49
      ],
      [
        346,
        0.132,
        -0.018,
        0.15,
        0.625,
        0.506,
        40
      ],
      [
        1074,
        0.1245,
        -0.012,
        0.1364,
        0.612,
        0.402,
        49
      ],
      [
        839,
        0.0881,
        -0.0701,
        0.1582,
        0.595,
        0.776,
        37
      ],
      [
        1071,
        0.0779,
        -0.201,
        0.2789,
        0.583,
        0.755,
        12
      ],
      [
        221,
        0.0717,
        -0.0212,
        0.0929,
        0.555,
        0.304,
        110
      ],
      [
        922,
        0.0714,
        0.0055,
        0.066,
        0.555,
        0.319,
        218
      ],
      [
        1035,
        0.0635,
        -0.1957,
        0.2592,
        0.571,
        0.806,
        14
      ],
      [
        54,
        0.0601,
        0.0006,
        0.0595,
        0.533,
        0.112,
        270
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "BAQDAwEBAAAAAAAAAwMDAgICBAQAAAAAAQEBAwMDBAQEBAAAAAEAAAAEBAQEAgAAAAAAAAQCBAAABAQAAAAAAgIAAgMDAwQEAAAABAQAAAAEBAICAQEBAwADAQAAAgEAAAIAA1RJjY3Jyb6+vlNTUysrK09PT0BT3QsLCywsLCwsLFJSZGQ0NDRDJiYmVFRZWV0DAwPNzc1ZXmJZS2JiaVtZWYKCW4KamppTUzY2NkBARUVFZFJdXpOTky5qLsxA+IhcakBdWy4=",
        0,
        0,
        75,
        25,
        3.14,
        0.049,
        0.025
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "BAQDAwEBAAAAAAAAAwMDAgICBAQAAAAAAQEBAwMDBAQEBAAAAQEAAAAEBAQEAgAAAAAAAAQCBAAABAQEAAAAAgIAAgMDAwQEAAAABAQAAAAEBAICAQEBAwADAQAAAgEAAAIAA1RJjY3Jyb6+vlNTUysrK09PT0BT3QsLCywsLCwsLFJSZGQ0RkVFJiYmVFRZWV0DAwPNzc1ZXmJMTGJif1tZWYKCW4KamppTUzY2NkBARUVFZFJdXpOTky5qLsxA+IhcakBdWy4=",
        0,
        6,
        69,
        25,
        3.17,
        0.341,
        0.025
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "AgQDAwEBAAAAAAAAAwMDAgICBAQAAAAAAQEBBAQDBAQEBAAAAQEAAAADAwQEAgAAAAAAAAQCBAAABAQEAAEBAgIAAgMDAwQEAAAABAQAAAAEAgIEAQEBAgACAQAAAgEAAAIAAQ1JjY3Jyb6+vlNTUysrK09PT0BT3QsLCywsLAsyLFNAQGRGRkVFJiYmLCxZWV0DAwPNzc1ZXmJMTGJif1u8vIKCW4KamppUVDY2NlRTRUVFZHZdDpOTk8tqy8xA+IhcakBdW0o=",
        3,
        14,
        59,
        24,
        3.28,
        0.651,
        0.025
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "AgQDAwEBAAAAAAAAAwMDAgICBAQAAAAAAQEBBAQDBAMBAQAAAQEAAAADAwQEAgAAAAAAAAICBAAAAwQEBAEBAQEEAAMDAwQEAAAABAQAAAACAgIEAQEBAgACAQAAAgEAAAIAAQ1JjY3Jyb6+vlNTUysrK09PT0BT3QsLCywsLAsyLFMwT09GRkVFJiYmLCxZL10DAwPNzc0BAQlMTFFif2K8vF5eYluamppUVDY2NlRTRUVFdnZdDpOTk8tqy8xA+IhcakBdW0o=",
        6,
        22,
        50,
        22,
        3.38,
        0.703,
        0.025
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "AgMDAwEBAAAAAAAAAwMDAgICBAQAAAAAAQEBBAQBAwMBAQAAAQEAAAAAAAQEAAAAAAAAAAICBAAAAwEEAwEBAQEDAwMDAwAAAAAAAgIAAAACAgIEAQEBAgACAQAAAgEAAAIAAQ16jY3Jyb6+vlNTUysrK09PT0BT3QsLCywsLAsySzAwT09GRkVFJiYmOTkKL9EDAwPNzc0BAQlMTFFaf0e8vF5eR0aamprn5zY2Ns3NRUVFdnZdDpOTk8tqy8xA+IhcakBdXUo=",
        10,
        34,
        34,
        22,
        3.7,
        0.739,
        0.025
      ]
    ]
  },
  "tri_red_green_gold": {
    "archetypeId": "tri_red_green_gold",
    "tierFormat": "tricolor",
    "domains": [
      "red",
      "green",
      "gold"
    ],
    "conclaveId": "cataclysm_triads",
    "classicDeckIds": [
      "deck_tri_primal_titans",
      "deck_tri_primordial_forge"
    ],
    "name": "Tríade dos Titãs da Forja Primordial",
    "subtitle": "Tríade 🔥+🌿+☀️ • Rampa Colossal, Escudo Divino & Sopro Dracônico",
    "strategySummary": "Acelera Essência com rampa de Veridia para erguer Colossos e Dragões de Pyros blindados pelos Escudos Divinos e hinos imperiais de Solária.",
    "tacticalIdentity": "ramp",
    "coverCardId": "green_67_tiranossauro_alfa",
    "generationsEvolved": 25,
    "matchesSimulated": 7132,
    "seedWinRate": 0.556,
    "championWinRate": 0.525,
    "vsMonocolorWinRate": 0.656,
    "vsBicolorWinRate": 0.533,
    "championDeckJaccardStability": 0.869,
    "medianCardCi95HalfWidth": 0.0671,
    "domainCardBreakdown": {
      "green": 22,
      "gold": 41,
      "neutral": 12,
      "red": 25
    },
    "crossDomainCombos": [
      [
        278,
        799,
        1,
        0.505,
        8,
        " (100% WR em 8 duelos cruzados)"
      ],
      [
        159,
        1079,
        1,
        0.505,
        10,
        " (100% WR em 10 duelos cruzados)"
      ],
      [
        151,
        605,
        1,
        0.505,
        9,
        " (100% WR em 9 duelos cruzados)"
      ],
      [
        151,
        591,
        1,
        0.505,
        8,
        " (100% WR em 8 duelos cruzados)"
      ],
      [
        683,
        983,
        1,
        0.505,
        8,
        " (100% WR em 8 duelos cruzados)"
      ],
      [
        1079,
        983,
        1,
        0.505,
        9,
        " (100% WR em 9 duelos cruzados)"
      ]
    ],
    "learnedProfile": {
      "deckId": "tri_red_green_gold",
      "deckName": "Tríade dos Titãs da Forja Primordial",
      "archetypeTag": "ramp",
      "generationsTrained": 19,
      "matchesSimulated": 7132,
      "baselineWinRate": 0.556,
      "trainedWinRate": 0.525,
      "weights": {
        "aggroFaceBias": 1.14,
        "tradeValueBias": 1.18,
        "guardianPriority": 1.26,
        "flyingEvasionBias": 0.94,
        "stackConsolidationBias": 1,
        "antiAoeSpreadBias": 1,
        "spellHoldPatience": 0.95,
        "relicPriority": 1,
        "ascensionEagerness": 1.3,
        "bloodPactThresholdHp": 24,
        "domainExpansionEagerness": 1.28,
        "sovPowerTempoBias": 0.93,
        "synergyHoldBonus": 21,
        "mulliganCurveTarget": 3
      },
      "mk": [
        278,
        300,
        591,
        159,
        784,
        126
      ],
      "cp": [
        665,
        300,
        178,
        664,
        798,
        151,
        799,
        278,
        680,
        432
      ],
      "ca": [
        114,
        116,
        126,
        151,
        159,
        178,
        272,
        278,
        300,
        421,
        473,
        664
      ],
      "hb": [
        [
          114,
          10.5
        ],
        [
          116,
          24
        ],
        [
          126,
          17.3
        ],
        [
          151,
          24
        ],
        [
          159,
          12.9
        ],
        [
          166,
          13
        ],
        [
          175,
          24
        ],
        [
          178,
          14.4
        ],
        [
          272,
          19
        ],
        [
          278,
          20.7
        ],
        [
          300,
          24
        ],
        [
          421,
          10.7
        ],
        [
          473,
          18.3
        ],
        [
          664,
          22.6
        ],
        [
          683,
          18.6
        ],
        [
          781,
          19.2
        ],
        [
          784,
          20
        ],
        [
          798,
          17.6
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
          862,
          24
        ],
        [
          863,
          24
        ],
        [
          879,
          17
        ],
        [
          880,
          24
        ],
        [
          881,
          24
        ],
        [
          892,
          11.1
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
          1034,
          24
        ],
        [
          1036,
          19
        ],
        [
          1037,
          24
        ],
        [
          1059,
          15
        ],
        [
          1079,
          20
        ],
        [
          1081,
          20
        ],
        [
          1092,
          15
        ],
        [
          1115,
          20
        ]
      ],
      "sp": [
        [
          862,
          300
        ],
        [
          1034,
          300
        ],
        [
          1037,
          272
        ],
        [
          421,
          799
        ],
        [
          147,
          1034
        ],
        [
          892,
          799
        ],
        [
          1037,
          421
        ],
        [
          126,
          1034
        ],
        [
          421,
          116
        ],
        [
          421,
          862
        ]
      ],
      "dc": [
        [
          278,
          799,
          1,
          0.505,
          8,
          " (100% WR em 8 duelos cruzados)"
        ],
        [
          159,
          1079,
          1,
          0.505,
          10,
          " (100% WR em 10 duelos cruzados)"
        ],
        [
          151,
          605,
          1,
          0.505,
          9,
          " (100% WR em 9 duelos cruzados)"
        ],
        [
          151,
          591,
          1,
          0.505,
          8,
          " (100% WR em 8 duelos cruzados)"
        ],
        [
          683,
          983,
          1,
          0.505,
          8,
          " (100% WR em 8 duelos cruzados)"
        ],
        [
          1079,
          983,
          1,
          0.505,
          9,
          " (100% WR em 9 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        175,
        0.4271,
        0.3394,
        0.0877,
        1,
        0.961,
        5
      ],
      [
        1031,
        0.3063,
        0.0771,
        0.2292,
        0.875,
        0.877,
        8
      ],
      [
        799,
        0.3052,
        0.1431,
        0.1621,
        0.875,
        0.899,
        16
      ],
      [
        151,
        0.2849,
        0.179,
        0.1059,
        0.844,
        0.694,
        45
      ],
      [
        800,
        0.2621,
        -0.0361,
        0.2982,
        0.833,
        0.927,
        6
      ],
      [
        983,
        0.2392,
        0.16,
        0.0791,
        0.792,
        0.561,
        101
      ],
      [
        781,
        0.2034,
        -0.0257,
        0.229,
        0.769,
        0.819,
        13
      ],
      [
        1037,
        0.1933,
        0.0433,
        0.15,
        0.75,
        0.636,
        32
      ],
      [
        683,
        0.1905,
        0.0405,
        0.15,
        0.75,
        0.692,
        32
      ],
      [
        863,
        0.1802,
        -0.032,
        0.2122,
        0.75,
        0.899,
        16
      ],
      [
        879,
        0.1557,
        -0.1075,
        0.2632,
        0.727,
        0.934,
        11
      ],
      [
        664,
        0.1148,
        -0.0092,
        0.124,
        0.673,
        0.66,
        55
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "BAAAAAEBAQQEAQEBAQEBBAICAQEBAwMDAAAABAAAAAICAgQAAQIEBAQEAQEEBAIBBAQBAQQEBAEBBAQEBAQEAAAAAQEBAQEBBAEBAAAEBAQEAAAAAAAABAQBAQQEAgEAAgMABE13d3ewsLCSkRAQEKWlpZpPTywsLHx8fAICAlrNzc1dXV1a18zDWkNDQ2lpcnIxaU1NAwMiIiIDd1VVkpJWVpOTk3d3FhYWjE+MjK6uT0+goJ+fnx8fH5GRzMxWVcPZ16txrqA=",
        0,
        0,
        81,
        19,
        2.92,
        0.049,
        0.025
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "BAAAAAEBAQQEAQEBAQEBAAICAQEBAwMDAAAABAAAAAICAgQAAQIEBAQEAQEAAAQBBAQBAQQEBAEBBAQEBAQEAAAAAQEBAQEBBAEBAAAEBAAAAAAAAAAABAQBAQQEAgEAAgMABE13d3ewsLCSkRAQEKWlpcJPTywsLHx8fAICAlrNzc1dXV1a18zDWkNDQ2lpj49EaU1NAwMiIiIDd1VVkpJWVpOTk3d3FhYWjE+MjK6uT0+lpZ+fnx8fH5GRzMxWVcPZ16txrqA=",
        0,
        6,
        75,
        19,
        2.97,
        0.341,
        0.025
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "AQAAAAEBAQQEAQEBAQEBAAICAQEBAwMDAAAABAAAAAICAgQAAQIEBAQEAAAAAAQEBAQBAQQEBAQBBAQEBAQEAAAAAQEBAQEDAwEBAAAEBAAAAAAAAAAABAQBAQQEAgEAAgMABG53d3ewsLCSkRAQEKWlpcJPTywsLHx8fAICAlrNzc1dXV1a18zDWkM3OXJyj49EI0ND4+NNTU0id1VVkpJWVpOTk3d3FhYW19eMjK6uT0+lpZ+fnx8fH5GRzMxWVcPZ16txr6A=",
        3,
        14,
        64,
        19,
        3.12,
        0.651,
        0.025
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "AQAAAAEBAQQEAQEBAQEBAAICAQEBAwMDAAAABAAAAAICAgQAAQIEBAQEAAAAAAQEBAQBAQQEBAQEBAQEBAQBAAAAAQEBAQEDAwAAAAADAwAAAAAAAAAAAAAEAQQEAgEAAgMABG53d3ewsLCSkRAQEKWlpcJPTywsLHx8fAICAgrNzc1dXV1a18zDWls3OXJyj49EI0ND4+NDTU1NDVVVkpJWd5OTk3d3FhYW19fGxpmZr6+lpZ+fnx8fH7KyWsxWVcPZ16txr1Y=",
        6,
        22,
        53,
        19,
        3.21,
        0.703,
        0.025
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "AQAAAAEBAQAAAQEBAQEBAAICAQEBAwMDAAAABAAAAAICAgMAAQIDBAQEAAAAAAQEAwMBAQAAAgIEAwQDAwACAAAAAwMBAQEDAwAAAAADAwAAAAAAAAAAAAADAwADAgEAAgMAAG53d3ewsLCrqxAQEKWlpcJPTywsLHx8fAICAgrNzc1dXV0g18zDHls3OXJyj49EI19f4+N+fpiYDXAHEBCXqJOTk29vFhYW19fGxpmZr6+lpZ+fnx8fH7KyHx+mDcPZ16txr5c=",
        10,
        41,
        30,
        19,
        3.69,
        0.739,
        0.025
      ]
    ]
  },
  "tri_blue_purple_gold": {
    "archetypeId": "tri_blue_purple_gold",
    "tierFormat": "tricolor",
    "domains": [
      "gold",
      "blue",
      "purple"
    ],
    "conclaveId": "imperial_triads",
    "classicDeckIds": [
      "deck_tri_eternal_reliquary"
    ],
    "name": "Relicário do Trono Eterno",
    "subtitle": "Tríade ☀️+❄️+💀 • Cidadela de Relíquias, Cronomancia & Veredito",
    "strategySummary": "Fortifica o Soberano com Guardiões celestes, Relíquias imperiais, Congelamento e reanimação inquisitorial em uma muralha intransponível.",
    "tacticalIdentity": "control",
    "coverCardId": "blue_97_draco_relampago",
    "generationsEvolved": 25,
    "matchesSimulated": 6912,
    "seedWinRate": 0.486,
    "championWinRate": 0.598,
    "vsMonocolorWinRate": 0.766,
    "vsBicolorWinRate": 0.533,
    "championDeckJaccardStability": 0.887,
    "medianCardCi95HalfWidth": 0.18,
    "domainCardBreakdown": {
      "gold": 24,
      "neutral": 12,
      "blue": 42,
      "purple": 22
    },
    "crossDomainCombos": [
      [
        226,
        381,
        1,
        0.432,
        8,
        " (100% WR em 8 duelos cruzados)"
      ],
      [
        1035,
        913,
        0.962,
        0.393,
        26,
        " (96% WR em 26 duelos cruzados)"
      ],
      [
        1037,
        913,
        0.938,
        0.369,
        16,
        " (94% WR em 16 duelos cruzados)"
      ],
      [
        48,
        226,
        0.933,
        0.335,
        15,
        " (93% WR em 15 duelos cruzados)"
      ],
      [
        226,
        76,
        0.9,
        0.332,
        10,
        " (90% WR em 10 duelos cruzados)"
      ],
      [
        1035,
        278,
        0.9,
        0.332,
        10,
        " (90% WR em 10 duelos cruzados)"
      ]
    ],
    "learnedProfile": {
      "deckId": "tri_blue_purple_gold",
      "deckName": "Relicário do Trono Eterno",
      "archetypeTag": "control",
      "generationsTrained": 19,
      "matchesSimulated": 6912,
      "baselineWinRate": 0.486,
      "trainedWinRate": 0.598,
      "weights": {
        "aggroFaceBias": 0.97,
        "tradeValueBias": 1.41,
        "guardianPriority": 1.38,
        "flyingEvasionBias": 1,
        "stackConsolidationBias": 1,
        "antiAoeSpreadBias": 1,
        "spellHoldPatience": 1.22,
        "relicPriority": 1.2,
        "ascensionEagerness": 1.01,
        "bloodPactThresholdHp": 24,
        "domainExpansionEagerness": 1,
        "sovPowerTempoBias": 1.06,
        "synergyHoldBonus": 21,
        "mulliganCurveTarget": 2.9
      },
      "mk": [
        913,
        105,
        272,
        714
      ],
      "cp": [
        145,
        717,
        815,
        322,
        432,
        37,
        40,
        48,
        190,
        38
      ],
      "ca": [
        54,
        105,
        226,
        272,
        816,
        880,
        913,
        1033,
        1035,
        1037
      ],
      "hb": [
        [
          54,
          14
        ],
        [
          105,
          20.2
        ],
        [
          226,
          23.3
        ],
        [
          272,
          12.6
        ],
        [
          816,
          24
        ],
        [
          880,
          22.9
        ],
        [
          913,
          18.6
        ],
        [
          1033,
          22.4
        ],
        [
          1035,
          24
        ],
        [
          1037,
          16.7
        ],
        [
          1068,
          11.9
        ],
        [
          1074,
          20
        ],
        [
          1108,
          11
        ],
        [
          1119,
          20
        ],
        [
          1151,
          15
        ]
      ],
      "sp": [
        [
          816,
          1035
        ],
        [
          1035,
          105
        ],
        [
          816,
          913
        ],
        [
          1035,
          272
        ],
        [
          1035,
          913
        ],
        [
          816,
          105
        ],
        [
          54,
          1037
        ],
        [
          621,
          1033
        ],
        [
          226,
          105
        ],
        [
          816,
          1033
        ]
      ],
      "dc": [
        [
          226,
          381,
          1,
          0.432,
          8,
          " (100% WR em 8 duelos cruzados)"
        ],
        [
          1035,
          913,
          0.962,
          0.393,
          26,
          " (96% WR em 26 duelos cruzados)"
        ],
        [
          1037,
          913,
          0.938,
          0.369,
          16,
          " (94% WR em 16 duelos cruzados)"
        ],
        [
          48,
          226,
          0.933,
          0.335,
          15,
          " (93% WR em 15 duelos cruzados)"
        ],
        [
          226,
          76,
          0.9,
          0.332,
          10,
          " (90% WR em 10 duelos cruzados)"
        ],
        [
          1035,
          278,
          0.9,
          0.332,
          10,
          " (90% WR em 10 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        226,
        0.195,
        0.0914,
        0.1036,
        0.815,
        0.432,
        54
      ],
      [
        1035,
        0.1545,
        0.0436,
        0.1109,
        0.778,
        0.5,
        54
      ],
      [
        1033,
        0.103,
        -0.0327,
        0.1356,
        0.732,
        0.61,
        41
      ],
      [
        816,
        0.0863,
        0.0107,
        0.0756,
        0.697,
        0.253,
        142
      ],
      [
        1037,
        0.0839,
        -0.0658,
        0.1497,
        0.714,
        0.643,
        35
      ],
      [
        913,
        0.0766,
        0.0281,
        0.0485,
        0.68,
        0.099,
        356
      ],
      [
        105,
        0.0551,
        0.0026,
        0.0526,
        0.662,
        0.179,
        311
      ],
      [
        1068,
        0.0422,
        -0.0912,
        0.1334,
        0.667,
        0.525,
        48
      ],
      [
        1074,
        0.0247,
        -0.1027,
        0.1274,
        0.648,
        0.505,
        54
      ],
      [
        221,
        0.0206,
        -0.062,
        0.0827,
        0.643,
        0.49,
        129
      ],
      [
        278,
        0.0128,
        -0.0514,
        0.0642,
        0.631,
        0.405,
        217
      ],
      [
        272,
        0.0114,
        -0.0385,
        0.05,
        0.614,
        0.081,
        365
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "BAEBAQMDAwAAAAMDAwMDAwMDAQEBAwMDBAAAAAAABAQAAAMDAQEBAwAEAAAABAQDAwQCAAAABAQEBAQBAQEAAAAAAAACAgIAAAAEBAICAQEBAAQEBAAAAAAABAEBBAQDAQMDBFWwsLARERG+vr7CwpSUlCoqKhAQEJGRkVTd3TAwMFVVk5NqahYWFmqTUjY2NlNTLCwfbSYmJmJiYn19XFxcaWlp+Pj4iIiIZGRkSVRtbUJCQjRUHx9FRUU0NFMbG1JSShtKLGQ=",
        0,
        0,
        76,
        24,
        2.7,
        0.029,
        0.025
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "BAEBAQMDAwAAAAMDAwMDAwMDAQEBAwMDBAAAAAAABAQAAAMDAQEBAwAEAAAABAQDAwEBAAAABAAABAQBAQEAAAAAAAACAgIAAAADBAICAQEBAAQEBAAAAAAABAEBBAQDAQMDBFWwsLARERG+vr7CwpSUlCoqKhAQEJGRkVTd3TAwMFVVk5NqahYWFmqTUjY2NlNTLCxFRSYmJmJMTH99XFxcaWlp+Pj4iIiIZGRkr1RtbUJCQjRUHx9FRUU0NFMbG1JSShtKLGQ=",
        0,
        6,
        70,
        24,
        2.73,
        0.363,
        0.025
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "BAEBAQMDAwAAAAMDAwMDAwMDAQEBAwMDBAAAAAAABAQAAAEBAQEBAAAEAAAAAAQDAwEBAAAABAAABAEBAQEAAAAAAAACAgIAAAADBAICAQEBAAACAgAAAAQEBAEBBAIDAQMDAVWwsLARERG+vr7CwpSUlCoqKhAQEJGRkVTd3TAwMFVfk5N9fRYWFpmZCzY2NjRULCxFRSYmJmJMTH9eXFxcaWlp+Pj4iIiIZGRkr1RtbUJCQjQ0y8tFRUVSUlMbG1IMShtKLEo=",
        3,
        14,
        60,
        23,
        2.87,
        0.67,
        0.025
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "BAEBAQMDAwAAAAMDAwMDAwMDAQEBAwMDBAAAAAAABAQAAAEBAQEBAAAEAAAAAwMDAwEBAAAABAAABAEBAQEAAAAAAAACAgIAAAADBAICAQEBAgICAgAAAAAAAgEBBAIDAQMDASywsLARERG+vr7CwpSUlCoqKhAQEJGRkVTd3TAwMFVfk5N9fRYWFpmZCzY2NjAwLCxFRSYmJglMTH9eXFxcaWlp+Pj4iIiIZGRkr1RtbUJCQs3Ny8tFRUUoKAobGzIMShtKLEo=",
        6,
        21,
        50,
        23,
        3.09,
        0.712,
        0.025
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "BAEBAQMDAwAAAAMDAwMDAwMDAQEBAwMDBAAAAAAABAQAAAEBAQEBAAAEAAAAAwMAAQEBAAAABAAABAEBAQEAAAAAAAACAgIAAAADBAICAQEBAgICAgAAAAAAAgEBBAIDAQMBASywsLARERG+vr7CwpSUlCoqKhAQEJGRkVTd3TAwMA1fk5N9fRYWFpmZCzY2NjAw4phFRSYmJglMTH9eXFxcaWlp+Pj4iIiIZGRkr1RtbUJCQs3Ny8tFRUUoKAobGzIMShtKl0o=",
        10,
        21,
        46,
        23,
        3.22,
        0.75,
        0.025
      ]
    ]
  },
  "tri_red_purple_green": {
    "archetypeId": "tri_red_purple_green",
    "tierFormat": "tricolor",
    "domains": [
      "red",
      "purple",
      "green"
    ],
    "conclaveId": "cataclysm_triads",
    "classicDeckIds": [
      "deck_tri_blood_moon"
    ],
    "name": "Corte da Lua Sangrenta",
    "subtitle": "Tríade 🔥+💀+🌿 • Frenesi Predatório, Cripta & Atropelar",
    "strategySummary": "Alimenta enxames ferozes com Ímpeto, Toque Letal, Dreno de Vida e reanimação da Cripta para esmagar linhas defensivas por pressão incessante.",
    "tacticalIdentity": "aggro",
    "coverCardId": "purple_138_soberano_carnica",
    "generationsEvolved": 25,
    "matchesSimulated": 6896,
    "seedWinRate": 0.694,
    "championWinRate": 0.689,
    "vsMonocolorWinRate": 0.844,
    "vsBicolorWinRate": 0.583,
    "championDeckJaccardStability": 0.869,
    "medianCardCi95HalfWidth": 0.0463,
    "domainCardBreakdown": {
      "purple": 43,
      "green": 23,
      "neutral": 12,
      "red": 22
    },
    "crossDomainCombos": [
      [
        114,
        838,
        1,
        0.341,
        8,
        " (100% WR em 8 duelos cruzados)"
      ],
      [
        115,
        76,
        1,
        0.341,
        10,
        " (100% WR em 10 duelos cruzados)"
      ],
      [
        115,
        830,
        1,
        0.341,
        20,
        " (100% WR em 20 duelos cruzados)"
      ],
      [
        866,
        910,
        1,
        0.341,
        8,
        " (100% WR em 8 duelos cruzados)"
      ],
      [
        922,
        838,
        1,
        0.341,
        9,
        " (100% WR em 9 duelos cruzados)"
      ],
      [
        866,
        913,
        1,
        0.341,
        8,
        " (100% WR em 8 duelos cruzados)"
      ]
    ],
    "learnedProfile": {
      "deckId": "tri_red_purple_green",
      "deckName": "Corte da Lua Sangrenta",
      "archetypeTag": "aggro",
      "generationsTrained": 19,
      "matchesSimulated": 6896,
      "baselineWinRate": 0.694,
      "trainedWinRate": 0.689,
      "weights": {
        "aggroFaceBias": 1.26,
        "tradeValueBias": 1.14,
        "guardianPriority": 1,
        "flyingEvasionBias": 1,
        "stackConsolidationBias": 1,
        "antiAoeSpreadBias": 1,
        "spellHoldPatience": 1,
        "relicPriority": 1,
        "ascensionEagerness": 1,
        "bloodPactThresholdHp": 18,
        "domainExpansionEagerness": 1,
        "sovPowerTempoBias": 1.22,
        "synergyHoldBonus": 20,
        "mulliganCurveTarget": 2.7
      },
      "mk": [
        591,
        913,
        922,
        910,
        11
      ],
      "cp": [
        35,
        90,
        99,
        644,
        236,
        838,
        862,
        734,
        736,
        460
      ],
      "ca": [
        11,
        34,
        101,
        114,
        346,
        487,
        545,
        830,
        853,
        910,
        913,
        922
      ],
      "hb": [
        [
          2,
          8.7
        ],
        [
          11,
          13.6
        ],
        [
          34,
          9.4
        ],
        [
          93,
          8.2
        ],
        [
          101,
          14.9
        ],
        [
          114,
          16.1
        ],
        [
          115,
          14.2
        ],
        [
          236,
          6.3
        ],
        [
          346,
          16.5
        ],
        [
          487,
          14.6
        ],
        [
          545,
          21.5
        ],
        [
          554,
          7.7
        ],
        [
          653,
          15.4
        ],
        [
          830,
          13.9
        ],
        [
          838,
          12.4
        ],
        [
          839,
          15.2
        ],
        [
          853,
          14.4
        ],
        [
          866,
          16.5
        ],
        [
          910,
          16.7
        ],
        [
          913,
          21.5
        ],
        [
          922,
          14
        ],
        [
          1033,
          19.3
        ],
        [
          1034,
          16.5
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
          1115,
          20
        ],
        [
          1116,
          20
        ],
        [
          1117,
          20
        ]
      ],
      "sp": [
        [
          853,
          1033
        ],
        [
          830,
          1033
        ],
        [
          545,
          11
        ],
        [
          910,
          1033
        ],
        [
          554,
          545
        ],
        [
          487,
          736
        ],
        [
          913,
          545
        ],
        [
          545,
          34
        ],
        [
          853,
          913
        ],
        [
          922,
          346
        ]
      ],
      "dc": [
        [
          114,
          838,
          1,
          0.341,
          8,
          " (100% WR em 8 duelos cruzados)"
        ],
        [
          115,
          76,
          1,
          0.341,
          10,
          " (100% WR em 10 duelos cruzados)"
        ],
        [
          115,
          830,
          1,
          0.341,
          20,
          " (100% WR em 20 duelos cruzados)"
        ],
        [
          866,
          910,
          1,
          0.341,
          8,
          " (100% WR em 8 duelos cruzados)"
        ],
        [
          922,
          838,
          1,
          0.341,
          9,
          " (100% WR em 9 duelos cruzados)"
        ],
        [
          866,
          913,
          1,
          0.341,
          8,
          " (100% WR em 8 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        866,
        0.1446,
        -0.0174,
        0.1621,
        0.875,
        0.826,
        16
      ],
      [
        1034,
        0.1445,
        -0.0175,
        0.1621,
        0.875,
        0.828,
        16
      ],
      [
        653,
        0.1197,
        -0.1395,
        0.2592,
        0.857,
        0.967,
        7
      ],
      [
        839,
        0.1153,
        -0.0006,
        0.1159,
        0.842,
        0.755,
        38
      ],
      [
        545,
        0.1005,
        -0.0158,
        0.1163,
        0.814,
        0.488,
        43
      ],
      [
        115,
        0.0927,
        -0.0109,
        0.1036,
        0.815,
        0.66,
        54
      ],
      [
        101,
        0.0764,
        0.0144,
        0.062,
        0.776,
        0.209,
        174
      ],
      [
        487,
        0.0563,
        -0.011,
        0.0672,
        0.765,
        0.388,
        153
      ],
      [
        838,
        0.0529,
        -0.0903,
        0.1432,
        0.781,
        0.785,
        32
      ],
      [
        922,
        0.0526,
        -0.0023,
        0.0549,
        0.754,
        0.251,
        236
      ],
      [
        910,
        0.0494,
        -0.0008,
        0.0502,
        0.741,
        0.042,
        293
      ],
      [
        913,
        0.0482,
        -0.0005,
        0.0487,
        0.738,
        0.016,
        313
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "BAMDAwMDAwMDAwAAAAICAgMDAwAAAAEBAQAAAAICAgQEBAQEAAAAAQEBBAQABAIEBAMEBAIDAwMDAwQDAAAAAgAAAQECAQABAgEBAgIBAQICAgAAAwMDAAABAgICAgICAgACAGNVVVWRkZGOjo4LCwtPT08+Pj7s7OxQUFACAgIqKioliIglWM3NzczMzCVYIli1Y2P3YWGAQUJC9/dhQm98fPNvfGdn82dv3JLc3JKSubnd3d1qapqammr4uYDe3t4bGxtlgGU=",
        0,
        0,
        73,
        27,
        2.55,
        0.049,
        0.025
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "BAMDAwMDAwMDAwAAAAICAgMDAwAAAAEBAQAAAAICAgQAAAQEAAAAAQEBBAQABAIEBAMEBAICAwMDAwQDAAAAAgAAAQECAQABAgEBAgIBAQICAgAAAwMDAgIBAgICAgICAgACAGNVVVWRkZGOjo4LCwtPT08+Pj7s7OxQUFACAgIqKiolIyMlWM3NzczMzCVYIli1Y2P3YWHg4EJC9/dhQm98fPNvfGdn82dv3JLc3JKSubnd3d1qapqamo2NuYDe3t4bGxtlgGU=",
        0,
        6,
        67,
        27,
        2.61,
        0.341,
        0.025
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "BAMDAwMDAwMDAwAAAAICAgMDAwAAAAEBAQAAAAICAgQAAAQEAAAAAQEBBAQABAIEBAIDAwICBAMEAwQEBAAAAwAAAAEDAQABAAEBAQEDAwICAgAAAwMDAgICAgICAgICAgAAAGNVVVWRkZGOjo4LCwtPT08+Pj7s7OxQUFACAgIqKiolIyMlWM3NzczMzCVYIli1XWPl9/fg4GFCY/dhYVtvfGJvfHxnAWdv3HJn3OfnQkLd3d1qapqamo2NhITe3t4bGxtlWmU=",
        3,
        14,
        56,
        27,
        2.81,
        0.651,
        0.025
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "BAMDAwMDAwMDAwAAAAICAgMDAwAAAAEBAQAAAAICAgQAAAQEAAAAAQEBBAQAAwMEBAIDAwICAwMEAwQABAAAAwEAAAADAQAAAAEBAQEAAAICAgAAAwMDAgICAgICAgICAgAAAGNVVVWRkZGOjo4LCwtPT08+Pj7s7OxQUFACAgIqKioKIyMlXM3NzczMzCVYIh8fXWPl9/fg4EZGY/dhXVtvb2IKfHx8AWdvcnJnZ+fnTEzd3d1qapqamo2NhITe3t4bGxtlWmU=",
        6,
        22,
        45,
        27,
        3.09,
        0.703,
        0.025
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "AQMDAwMDAwMDAwAAAAICAgMDAwAAAAEBAQAAAAICAgQAAAAEAAAAAQEBBAQAAwMEAgIDAwICAwMDAwAABAMDAwEAAAIDAgMAAAEBAQEAAAICAgAAAwMDAgICAgICAgICAgAAAFpVVVWRkZGOjo4LCwtPT08+Pj7s7OxQUFACAgIqKioKIyPSXM3NzczMzCVYIh8fXSHlR0fg4EZGRUVdXVteXmIKc3OZAZlfcnLj4+fnTEzd3d1jY5qamo2NhITe3t4bGxtlWmU=",
        9,
        38,
        26,
        27,
        3.68,
        0.739,
        0.025
      ]
    ]
  },
  "tri_blue_green_gold": {
    "archetypeId": "tri_blue_green_gold",
    "tierFormat": "tricolor",
    "domains": [
      "gold",
      "green",
      "blue"
    ],
    "conclaveId": "imperial_triads",
    "classicDeckIds": [
      "deck_tri_celestial_scales",
      "deck_tri_eternal_horizon"
    ],
    "name": "Escamas do Horizonte Eterno",
    "subtitle": "Tríade ☀️+🌿+❄️ • Falange Radiante, Rampa & Voo Astral",
    "strategySummary": "Une rampa silvestre e compra arcana aos Serafins e Dragões Imperiais de Solária, dominando chão e ar com Escudo Divino e Regeneração.",
    "tacticalIdentity": "midrange",
    "coverCardId": "gold_100_dragao_imperial_ouro",
    "generationsEvolved": 25,
    "matchesSimulated": 7132,
    "seedWinRate": 0.486,
    "championWinRate": 0.52,
    "vsMonocolorWinRate": 0.547,
    "vsBicolorWinRate": 0.467,
    "championDeckJaccardStability": 0.905,
    "medianCardCi95HalfWidth": 0.0882,
    "domainCardBreakdown": {
      "gold": 28,
      "neutral": 12,
      "green": 24,
      "blue": 36
    },
    "crossDomainCombos": [
      [
        126,
        983,
        1,
        0.51,
        14,
        " (100% WR em 14 duelos cruzados)"
      ],
      [
        784,
        983,
        1,
        0.51,
        8,
        " (100% WR em 8 duelos cruzados)"
      ],
      [
        853,
        983,
        0.933,
        0.443,
        15,
        " (93% WR em 15 duelos cruzados)"
      ],
      [
        54,
        983,
        0.9,
        0.41,
        20,
        " (90% WR em 20 duelos cruzados)"
      ],
      [
        278,
        983,
        0.889,
        0.399,
        27,
        " (89% WR em 27 duelos cruzados)"
      ],
      [
        581,
        278,
        0.909,
        0.389,
        11,
        " (91% WR em 11 duelos cruzados)"
      ]
    ],
    "learnedProfile": {
      "deckId": "tri_blue_green_gold",
      "deckName": "Escamas do Horizonte Eterno",
      "archetypeTag": "midrange",
      "generationsTrained": 19,
      "matchesSimulated": 7132,
      "baselineWinRate": 0.486,
      "trainedWinRate": 0.52,
      "weights": {
        "aggroFaceBias": 1.08,
        "tradeValueBias": 1.22,
        "guardianPriority": 1.33,
        "flyingEvasionBias": 1.27,
        "stackConsolidationBias": 1,
        "antiAoeSpreadBias": 1,
        "spellHoldPatience": 0.99,
        "relicPriority": 1,
        "ascensionEagerness": 1.21,
        "bloodPactThresholdHp": 24,
        "domainExpansionEagerness": 0.96,
        "sovPowerTempoBias": 0.92,
        "synergyHoldBonus": 20,
        "mulliganCurveTarget": 3.1
      },
      "mk": [
        278,
        272,
        591,
        909,
        126
      ],
      "cp": [
        1011,
        767,
        421,
        862,
        578,
        190,
        717,
        115,
        909,
        780
      ],
      "ca": [
        58,
        115,
        226,
        272,
        278,
        487,
        581,
        682,
        781,
        784,
        816,
        862
      ],
      "hb": [
        [
          54,
          6
        ],
        [
          58,
          18.3
        ],
        [
          114,
          8.2
        ],
        [
          115,
          13.4
        ],
        [
          126,
          8.6
        ],
        [
          226,
          11.6
        ],
        [
          270,
          18.5
        ],
        [
          272,
          18.2
        ],
        [
          278,
          17.3
        ],
        [
          487,
          17.9
        ],
        [
          581,
          24
        ],
        [
          682,
          12.3
        ],
        [
          780,
          13.7
        ],
        [
          781,
          17.8
        ],
        [
          784,
          15.9
        ],
        [
          816,
          24
        ],
        [
          853,
          8.6
        ],
        [
          862,
          22.3
        ],
        [
          863,
          13.3
        ],
        [
          864,
          17.4
        ],
        [
          866,
          22
        ],
        [
          983,
          24
        ],
        [
          1035,
          24
        ],
        [
          1037,
          23.1
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
          20
        ],
        [
          1074,
          17
        ],
        [
          1079,
          20
        ]
      ],
      "sp": [
        [
          581,
          119
        ],
        [
          816,
          1035
        ],
        [
          1035,
          784
        ],
        [
          1035,
          54
        ],
        [
          816,
          278
        ],
        [
          278,
          983
        ],
        [
          1035,
          126
        ],
        [
          581,
          853
        ],
        [
          272,
          983
        ],
        [
          1035,
          272
        ]
      ],
      "dc": [
        [
          126,
          983,
          1,
          0.51,
          14,
          " (100% WR em 14 duelos cruzados)"
        ],
        [
          784,
          983,
          1,
          0.51,
          8,
          " (100% WR em 8 duelos cruzados)"
        ],
        [
          853,
          983,
          0.933,
          0.443,
          15,
          " (93% WR em 15 duelos cruzados)"
        ],
        [
          54,
          983,
          0.9,
          0.41,
          20,
          " (90% WR em 20 duelos cruzados)"
        ],
        [
          278,
          983,
          0.889,
          0.399,
          27,
          " (89% WR em 27 duelos cruzados)"
        ],
        [
          581,
          278,
          0.909,
          0.389,
          11,
          " (91% WR em 11 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        983,
        0.279,
        0.1861,
        0.0929,
        0.836,
        0.743,
        61
      ],
      [
        866,
        0.2658,
        -0.0324,
        0.2982,
        0.833,
        0.953,
        6
      ],
      [
        862,
        0.2238,
        0.0088,
        0.2149,
        0.786,
        0.841,
        14
      ],
      [
        581,
        0.192,
        0.0472,
        0.1448,
        0.743,
        0.62,
        35
      ],
      [
        1035,
        0.1823,
        0.0028,
        0.1795,
        0.739,
        0.739,
        23
      ],
      [
        781,
        0.1729,
        0.021,
        0.152,
        0.727,
        0.689,
        33
      ],
      [
        487,
        0.1614,
        0.0605,
        0.1009,
        0.714,
        0.659,
        77
      ],
      [
        1074,
        0.1547,
        0.0015,
        0.1532,
        0.706,
        0.626,
        34
      ],
      [
        784,
        0.1311,
        0.0478,
        0.0833,
        0.661,
        0.205,
        124
      ],
      [
        816,
        0.1026,
        0.0084,
        0.0942,
        0.646,
        0.479,
        99
      ],
      [
        780,
        0.0825,
        -0.0859,
        0.1684,
        0.645,
        0.855,
        31
      ],
      [
        278,
        0.064,
        0.004,
        0.06,
        0.595,
        0.228,
        257
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "BAQDAwMDAwAAAAEBAQMDAwEBAQAAAAICAgQBAQQCAgQEAAQEBAQBAQEBBAQAAAQEAAEEBAQAAAAAAAEBAQQEAAAABAQBAQEEBAQBAQEEBAABAQEBAAAEBAIEBAQEAAEABAAEAFVRjY1VVVV3d3ewsLAREREQEBC+vr5PT09TPj5VQUGgVZNWVnNDCQUFBUNDiopNTYoJVFRUMjImJiZCQkJSUjY2NkBAk5OTUVFJFhYWVqAyQxsbGysrU1NBQHRSdDOlM3QzTSs=",
        0,
        0,
        84,
        16,
        3.17,
        0.029,
        0.025
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "BAQDAwMDAwAAAAEBAQMDAwEBAQAAAAICAgQBAQQCAgQEAAQEBAQEAQEBBAQAAAQEAAEEBAQBAQAAAAEBAQQEAAAABAQBAQEEBAQBAQEEBAICAQEBAAAEBAIEBAQEAAEABAAEAFVRjY1VVVV3d3ewsLAREREQEBC+vr5PT09TPj5VQUEaVZNWVnNDIwUFBUNDiopNTYoJVFRURUUmJiZCQkJSUjY2NkBAk5OTUVFJFhYWVqDLyxsbGysrU1NBQHRSdDOlM3QzTSs=",
        0,
        6,
        78,
        16,
        3.17,
        0.363,
        0.025
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "AgMDAwMDAwAAAAEBAQMDAwEBAQAAAAICAgQBAQQCAgQEAAQEAwQEAQEBBAQAAAQEAAEEBAQBAQAAAAEBAQQEAAAABAQBAQEDAwMBAQEEBAICAQEBAQEEBAIEBAQEAAEABAAEAEXXjY1VVVV3d3ewsLAREREQEBC+vr5PT08yPj4sQUEaVZNVVWJDIwUFBUNDiopNTYrjVFRURUUmJiZCQkJSUjY2NlNAk5OTr6/XFhYWVlbLyxsbG0pKU1NBQHRAdDOlM3QzTSs=",
        3,
        14,
        67,
        16,
        3.26,
        0.67,
        0.025
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "AgMDAwMDAwAAAAEBAQMDAwEBAQAAAAICAgQBAQQCAgQEAAQEAwQEBAEBBAQEAAQEAQEEBAABAQAAAAEBAQICAAAABAQBAQEDAwMBAQEAAAICAQEBAQEEBAIEAQQBAAEABAABAEXXjY1VVVV3d3ewsLAREREQEBC+vr5PT08yPj4sQUEaVZNVVWI3I0MFBUNDTXJNTePjC1TiRUUmJiZCQkLNzTY2NlNTk5OTr6/XFhYWmZnLyxsbG0pKVFRBU+dA5zOlM3QzBSs=",
        6,
        22,
        56,
        16,
        3.37,
        0.712,
        0.025
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "AgMDAwMDAwAAAAEBAQMDAwEBAQAAAAICAgQBAQQCAwQDAAMDAwQEAwIAAwMAAAAAAQEEBAABAQAAAAEBAQICAAAAAwMBAQEDAwMBAQEAAAICAQEBAQEAAAMDAQMBAAEAAgACAEXXjY1VVVV3d3ewsLAREREQEBC+vr5PT08yPj4sqg0aEJMMDGI3I16Yc19fcnJ+fuPjCwXiRUUmJiZCQkLNzTY2NjAwk5OTr6/XFhYWmZnLyxsbG0pKOjoV8+fz5zOlM/8zmOc=",
        10,
        42,
        32,
        16,
        3.75,
        0.75,
        0.025
      ]
    ]
  },
  "tri_blue_purple_green": {
    "archetypeId": "tri_blue_purple_green",
    "tierFormat": "tricolor",
    "domains": [
      "blue",
      "purple",
      "green"
    ],
    "conclaveId": "imperial_triads",
    "classicDeckIds": [
      "deck_tri_abyssal_chimera"
    ],
    "name": "Quimera da Fossa Abissal",
    "subtitle": "Tríade ❄️+💀+🌿 • Evolução Necrótica, Estase & Cripta Viva",
    "strategySummary": "Recicla feras primordiais e Leviatãs da Cripta enquanto congela a frente inimiga e acumula vantagem de cartas e Essência.",
    "tacticalIdentity": "attrition",
    "coverCardId": "purple_83_arquidemonio_tempo",
    "generationsEvolved": 25,
    "matchesSimulated": 6524,
    "seedWinRate": 0.569,
    "championWinRate": 0.544,
    "vsMonocolorWinRate": 0.703,
    "vsBicolorWinRate": 0.533,
    "championDeckJaccardStability": 0.905,
    "medianCardCi95HalfWidth": 0.0687,
    "domainCardBreakdown": {
      "purple": 22,
      "neutral": 12,
      "blue": 40,
      "green": 26
    },
    "crossDomainCombos": [
      [
        53,
        487,
        1,
        0.486,
        12,
        " (100% WR em 12 duelos cruzados)"
      ],
      [
        811,
        866,
        1,
        0.486,
        9,
        " (100% WR em 9 duelos cruzados)"
      ],
      [
        53,
        349,
        1,
        0.486,
        11,
        " (100% WR em 11 duelos cruzados)"
      ],
      [
        109,
        866,
        1,
        0.456,
        13,
        " (100% WR em 13 duelos cruzados)"
      ],
      [
        866,
        265,
        1,
        0.456,
        9,
        " (100% WR em 9 duelos cruzados)"
      ],
      [
        69,
        1033,
        0.909,
        0.396,
        11,
        " (91% WR em 11 duelos cruzados)"
      ]
    ],
    "learnedProfile": {
      "deckId": "tri_blue_purple_green",
      "deckName": "Quimera da Fossa Abissal",
      "archetypeTag": "attrition",
      "generationsTrained": 19,
      "matchesSimulated": 6524,
      "baselineWinRate": 0.569,
      "trainedWinRate": 0.544,
      "weights": {
        "aggroFaceBias": 1.01,
        "tradeValueBias": 1.35,
        "guardianPriority": 1.15,
        "flyingEvasionBias": 1.02,
        "stackConsolidationBias": 1,
        "antiAoeSpreadBias": 1,
        "spellHoldPatience": 1,
        "relicPriority": 1.01,
        "ascensionEagerness": 1.13,
        "bloodPactThresholdHp": 24,
        "domainExpansionEagerness": 1.05,
        "sovPowerTempoBias": 1,
        "synergyHoldBonus": 25,
        "mulliganCurveTarget": 2.9
      },
      "mk": [
        591,
        84,
        126,
        922,
        101,
        810
      ],
      "cp": [
        838,
        36,
        335,
        349,
        816,
        543,
        93,
        487,
        736,
        91
      ],
      "ca": [
        54,
        84,
        101,
        116,
        266,
        349,
        446,
        487,
        736,
        816,
        839,
        922
      ],
      "hb": [
        [
          53,
          17.1
        ],
        [
          54,
          14.3
        ],
        [
          84,
          16.9
        ],
        [
          93,
          14.7
        ],
        [
          101,
          23.9
        ],
        [
          116,
          17.7
        ],
        [
          266,
          11.6
        ],
        [
          349,
          20.7
        ],
        [
          446,
          10.9
        ],
        [
          487,
          23.7
        ],
        [
          736,
          11.5
        ],
        [
          816,
          24
        ],
        [
          839,
          19.5
        ],
        [
          862,
          24
        ],
        [
          866,
          24
        ],
        [
          922,
          14.5
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
          22.9
        ],
        [
          1036,
          16
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
          816,
          101
        ],
        [
          1029,
          109
        ],
        [
          487,
          101
        ],
        [
          101,
          349
        ],
        [
          839,
          349
        ],
        [
          816,
          1033
        ],
        [
          69,
          1033
        ],
        [
          816,
          93
        ],
        [
          816,
          839
        ],
        [
          816,
          487
        ]
      ],
      "dc": [
        [
          53,
          487,
          1,
          0.486,
          12,
          " (100% WR em 12 duelos cruzados)"
        ],
        [
          811,
          866,
          1,
          0.486,
          9,
          " (100% WR em 9 duelos cruzados)"
        ],
        [
          53,
          349,
          1,
          0.486,
          11,
          " (100% WR em 11 duelos cruzados)"
        ],
        [
          109,
          866,
          1,
          0.456,
          13,
          " (100% WR em 13 duelos cruzados)"
        ],
        [
          866,
          265,
          1,
          0.456,
          9,
          " (100% WR em 9 duelos cruzados)"
        ],
        [
          69,
          1033,
          0.909,
          0.396,
          11,
          " (91% WR em 11 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        866,
        0.3416,
        0.2462,
        0.0954,
        0.929,
        0.87,
        28
      ],
      [
        862,
        0.3203,
        0.1504,
        0.1699,
        0.909,
        0.906,
        11
      ],
      [
        1029,
        0.2519,
        0.1028,
        0.1491,
        0.833,
        0.758,
        24
      ],
      [
        1033,
        0.1694,
        0.0246,
        0.1448,
        0.743,
        0.598,
        35
      ],
      [
        53,
        0.1569,
        0.0515,
        0.1054,
        0.725,
        0.485,
        69
      ],
      [
        816,
        0.1421,
        0.067,
        0.0751,
        0.704,
        0.372,
        142
      ],
      [
        1036,
        0.1323,
        -0.0609,
        0.1932,
        0.714,
        0.769,
        21
      ],
      [
        349,
        0.1071,
        0.0143,
        0.0928,
        0.68,
        0.596,
        97
      ],
      [
        487,
        0.1064,
        0.0298,
        0.0766,
        0.669,
        0.38,
        145
      ],
      [
        93,
        0.1049,
        -0.0262,
        0.1311,
        0.688,
        0.781,
        48
      ],
      [
        922,
        0.0985,
        0.0318,
        0.0667,
        0.663,
        0.424,
        193
      ],
      [
        101,
        0.0896,
        0.0293,
        0.0603,
        0.65,
        0.337,
        240
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "BAAAAAICAgAAAAMDAwAAAAMDAwMDAwAAAAIAAAAEBAQAAgIEBAIEBAQABAQEAAAAAAAAAAAEBAAEAgEBAQICAQEBAQEBAwMDAAAABAAEBAQEBAQAAAEBAAAAAgAAAAACAgQEAka+vr5PT0/d3d2NjY1tbW0qKiorKytUVFRuNjY2aGhoNG5uaWkQRmNGUWJjY2VlZXFxcXt7Tk57TpFqamosLAQEBAkJCZqamkVFRWkrfn59fWJiNDRCQiY1JhAzJjNDkZF9fhA=",
        0,
        0,
        76,
        24,
        3.06,
        0.029,
        0.025
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "BAAAAAICAgAAAAMDAwAAAAMDAwMDAwAAAAIAAAAEBAQAAgIEBAIEBAQEBAQEAAAAAAAAAAAEBAAEAgEBAQEBAQEBAQEBAwMDAAAABAABAQQEBAQAAAEBAAAAAgAAAAACAgQEAka+vr5PT0/d3d2NjY1tbW0qKiorKytUVFRuNjY2aGhoNG5uaWkQRmNGfx1jY2VlZXFxcXt7Tk57TpFqamrn5wQEBAkJCZqamkVFRWkrXV19fWJiNDRCQiY1JhAzJjNDkZF9fhA=",
        0,
        6,
        72,
        22,
        3.1,
        0.363,
        0.025
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "BAAAAAICAgAAAAMDAwAAAAMDAwMDAwAAAAIAAAAEBAQAAgIEBAIEAQQEBAQEAAAAAAAAAAAEBAAEAgEBAQEBAQEBAQEBAwMDAAAABAEBAQQEAgIAAAEBAAAAAgAAAAACAgQCAju+vr5PT0/d3d2NjY1tbW0qKiorKytUVFRuNjY2aGhoNG5uaWkQRr5dfx1GRmVlZXFxcXt7Tk57TpFqamrn5wQEBAkJCZqamkVFRWlKXV19feDgNDRFRSY1JhAzJjND//99IxA=",
        3,
        14,
        61,
        22,
        3.23,
        0.67,
        0.025
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "BAAAAAICAgAAAAMDAwAAAAMDAwMDAwAAAAQAAAAEBAQAAgIBAQEEAQQEBAQEAAAAAAABBAABBAMEAwEAAQEBAQEBAQEBAwMDAAAAAQEBAQEBAgIAAAEBAAAAAgAAAAACAgQCAju+vr5PT0/d3d2NjY1tbW0qKiorKytUVFQLNjY2aGhoNG5uT0+gCb5dfx1GRmVlZXFxCk57ak5iTmJqcWrn5wQEBAkJCZqamkVFRUpKXV1eXuDgNDRFRSY1JhAzJjND//99IxA=",
        6,
        22,
        50,
        22,
        3.32,
        0.712,
        0.025
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "BAAAAAICAgAAAAMDAwAAAAMDAwMDAwAAAAQAAAAAAAAEAwMBAQEEAQQEBAAAAAAABAABAAAAAAMDAwADAwEBAQEBAQEBAwMDAAAAAQEBAQEBAgIAAAEBAAAAAAAAAAACAgQCADu+vr5PT0/d3d2NjY1tbW0qKiorKytUVFQLNjY2RkY/BTAwT0+gCb5dfx1dXWVlZQx0CnJyfn5iXmJzX1/n5wQEBAkJCZqamkVFRUpKXV1eXuDgNDRFRSY1JuczJjND//99I+c=",
        10,
        38,
        30,
        22,
        3.67,
        0.75,
        0.025
      ]
    ]
  },
  "tri_red_purple_gold": {
    "archetypeId": "tri_red_purple_gold",
    "tierFormat": "tricolor",
    "domains": [
      "gold",
      "red",
      "purple"
    ],
    "conclaveId": "cataclysm_triads",
    "classicDeckIds": [
      "deck_tri_crimson_sun"
    ],
    "name": "Eclipse do Sol Carmesim",
    "subtitle": "Tríade ☀️+🔥+💀 • Serafins Sanguinários, Dreno & Artilharia",
    "strategySummary": "Marcha sob estandartes de Escudo Divino e Renascer enquanto drena vida e incinera bloqueadores com fogo vulcânico e vereditos sombrios.",
    "tacticalIdentity": "midrange",
    "coverCardId": "red_119_soberano_piroclasma",
    "generationsEvolved": 25,
    "matchesSimulated": 7056,
    "seedWinRate": 0.514,
    "championWinRate": 0.581,
    "vsMonocolorWinRate": 0.719,
    "vsBicolorWinRate": 0.583,
    "championDeckJaccardStability": 0.869,
    "medianCardCi95HalfWidth": 0.0539,
    "domainCardBreakdown": {
      "gold": 34,
      "neutral": 12,
      "red": 32,
      "purple": 22
    },
    "crossDomainCombos": [
      [
        278,
        346,
        1,
        0.449,
        11,
        " (100% WR em 11 duelos cruzados)"
      ],
      [
        892,
        1033,
        1,
        0.449,
        8,
        " (100% WR em 8 duelos cruzados)"
      ],
      [
        1068,
        892,
        1,
        0.449,
        10,
        " (100% WR em 10 duelos cruzados)"
      ],
      [
        1068,
        201,
        0.938,
        0.387,
        16,
        " (94% WR em 16 duelos cruzados)"
      ],
      [
        935,
        913,
        0.923,
        0.342,
        13,
        " (92% WR em 13 duelos cruzados)"
      ],
      [
        1068,
        11,
        0.889,
        0.338,
        18,
        " (89% WR em 18 duelos cruzados)"
      ]
    ],
    "learnedProfile": {
      "deckId": "tri_red_purple_gold",
      "deckName": "Eclipse do Sol Carmesim",
      "archetypeTag": "midrange",
      "generationsTrained": 19,
      "matchesSimulated": 7056,
      "baselineWinRate": 0.514,
      "trainedWinRate": 0.581,
      "weights": {
        "aggroFaceBias": 1.24,
        "tradeValueBias": 1.24,
        "guardianPriority": 1.27,
        "flyingEvasionBias": 1.28,
        "stackConsolidationBias": 1,
        "antiAoeSpreadBias": 1,
        "spellHoldPatience": 1.11,
        "relicPriority": 1,
        "ascensionEagerness": 1,
        "bloodPactThresholdHp": 24,
        "domainExpansionEagerness": 1.05,
        "sovPowerTempoBias": 1,
        "synergyHoldBonus": 18,
        "mulliganCurveTarget": 2.9
      },
      "mk": [
        278,
        913,
        317,
        272,
        201,
        784,
        421,
        11
      ],
      "cp": [
        680,
        95,
        839,
        791,
        278,
        935,
        779,
        144,
        149,
        913
      ],
      "ca": [
        3,
        11,
        83,
        144,
        201,
        205,
        272,
        278,
        346,
        421,
        460,
        576
      ],
      "hb": [
        [
          3,
          17.6
        ],
        [
          11,
          18.8
        ],
        [
          35,
          24
        ],
        [
          83,
          11.4
        ],
        [
          144,
          15.2
        ],
        [
          173,
          19.2
        ],
        [
          201,
          14.7
        ],
        [
          205,
          11
        ],
        [
          272,
          16.8
        ],
        [
          278,
          16.6
        ],
        [
          346,
          19.8
        ],
        [
          421,
          14.7
        ],
        [
          460,
          17.3
        ],
        [
          545,
          15.1
        ],
        [
          576,
          13.7
        ],
        [
          580,
          10.9
        ],
        [
          610,
          17.5
        ],
        [
          644,
          18.2
        ],
        [
          735,
          14.3
        ],
        [
          784,
          24
        ],
        [
          791,
          10.9
        ],
        [
          834,
          10.8
        ],
        [
          839,
          24
        ],
        [
          880,
          24
        ],
        [
          892,
          7.4
        ],
        [
          913,
          18.3
        ],
        [
          935,
          15.7
        ],
        [
          1031,
          24
        ],
        [
          1033,
          24
        ],
        [
          1034,
          18.8
        ],
        [
          1050,
          15
        ],
        [
          1051,
          20
        ],
        [
          1068,
          17.1
        ],
        [
          1071,
          20.2
        ],
        [
          1119,
          20
        ]
      ],
      "sp": [
        [
          913,
          1033
        ],
        [
          278,
          1033
        ],
        [
          784,
          201
        ],
        [
          580,
          83
        ],
        [
          644,
          11
        ],
        [
          784,
          791
        ],
        [
          346,
          460
        ],
        [
          735,
          460
        ],
        [
          1033,
          11
        ],
        [
          791,
          460
        ]
      ],
      "dc": [
        [
          278,
          346,
          1,
          0.449,
          11,
          " (100% WR em 11 duelos cruzados)"
        ],
        [
          892,
          1033,
          1,
          0.449,
          8,
          " (100% WR em 8 duelos cruzados)"
        ],
        [
          1068,
          892,
          1,
          0.449,
          10,
          " (100% WR em 10 duelos cruzados)"
        ],
        [
          1068,
          201,
          0.938,
          0.387,
          16,
          " (94% WR em 16 duelos cruzados)"
        ],
        [
          935,
          913,
          0.923,
          0.342,
          13,
          " (92% WR em 13 duelos cruzados)"
        ],
        [
          1068,
          11,
          0.889,
          0.338,
          18,
          " (89% WR em 18 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        35,
        0.3711,
        0.2835,
        0.0877,
        1,
        0.96,
        5
      ],
      [
        1033,
        0.247,
        0.075,
        0.172,
        0.867,
        0.776,
        15
      ],
      [
        1071,
        0.2274,
        0.0634,
        0.164,
        0.842,
        0.678,
        19
      ],
      [
        173,
        0.2052,
        -0.093,
        0.2982,
        0.833,
        0.945,
        6
      ],
      [
        1034,
        0.1955,
        -0.0324,
        0.2279,
        0.818,
        0.836,
        11
      ],
      [
        610,
        0.1667,
        -0.0482,
        0.2149,
        0.786,
        0.763,
        14
      ],
      [
        1068,
        0.1578,
        0.0322,
        0.1256,
        0.756,
        0.338,
        45
      ],
      [
        935,
        0.1272,
        0.0439,
        0.0832,
        0.727,
        0.385,
        110
      ],
      [
        839,
        0.1233,
        -0.1217,
        0.245,
        0.75,
        0.917,
        12
      ],
      [
        545,
        0.1137,
        -0.1101,
        0.2238,
        0.733,
        0.776,
        15
      ],
      [
        735,
        0.096,
        0.0198,
        0.0762,
        0.703,
        0.521,
        138
      ],
      [
        201,
        0.0955,
        0.0375,
        0.058,
        0.684,
        0.157,
        247
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "AgMDAwAAAAMDAwMDAwAAAAEBAQEBAQMDAwAAAAAAAAICAQAAAAQEAQEEBAAAAAEBAQMDAwQEBAQEAAABAQMDAwICAgICAgAEBAMDAwAAAAEBAQICAgAEAQEBBAEEBAEEBAQEBEGRkZELCwuNjY18fHyQkJAQEBClpaUXFxfJyclTU1NBQRuTk5NWVhsbWlrNzc3MzMwcHBw9PWJiYltbt7dCQkLf39+CgoJbUVFpaWkDAwMWFhZAQECtVvf391EXfVW3WoiIiFU=",
        0,
        0,
        73,
        27,
        2.9,
        0.049,
        0.025
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "AgMDAwAAAAMDAwMDAwAAAAEBAQEBAQMDAwAAAAAAAAICAAAAAAQEAQEEBAAAAAEBAQMDAwQEBAQEAAABAQMDAwICAgICAgADAwMDAwAAAAEBAQICAgAEAQEBAwEEBAEEBAQEAEGRkZELCwuNjY18fHyQkJAQEBClpaUXFxfJyclTU1NBQa+Tk5NWVhsbWlrNzc3MzMwcHBw9PWJiYltbt7dCQkLf39+CgoJbp6dpaWkDAwMWFhZAQECtVvf3968XfRq3WoiIiK8=",
        0,
        6,
        67,
        27,
        2.9,
        0.341,
        0.025
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "BAMDAwAAAAMDAwMDAwAAAAEBAQEBAQMDAwAAAAAAAAIEAAAAAAICAwMEBAAAAAEBAQMDAwQEBAQEAAAAAAMDAwICAgICAgADAwMDAwAAAAEBAQICAgADAQEBAwEEBAECAQEAAF+RkZELCwuNjY18fHyQkJAQEBClpaUXFxfJyclTU1NBLK+Tk5NBQRAQWlrNzc3MzMwcHBxaPWJiYltbTExCQkLf39+CgoJbp6dpaWkDAwMWFhZAQECtbvf3968XfRq3Yj09I68=",
        3,
        14,
        56,
        27,
        3.01,
        0.651,
        0.025
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "BAMDAwAAAAMDAwMDAwAAAAEBAQEBAQMDAwAAAAAAAAQEAAAAAAAAAwMEBAAAAAEBAQMDAwQEBAQEBAAAAAMDAwICAgICAgIDAwMDAwAAAAEBAQICAgADAQEBAwEABAICAQEAAF+RkZELCwuNjY18fHyQkJAQEBClpaUXFxfJyclTU1MbLK+Tk5OmphAQWi/Nzc3MzMwcHBxaWgliYmJbTExCQkLf39+EhODhp6dpaWkDAwMWFhZAQECtbvf3968XYxrgYj09I68=",
        6,
        22,
        45,
        27,
        3.2,
        0.703,
        0.025
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "BAMDAwAAAAMDAwMDAwAAAAEBAQEBAQMDAwAAAAAAAAQEAAAAAAAAAwMEBAAAAAEBAQMDAwICBAECAwMAAAMDAwICAgICAgIDAwMDAwAAAAEBAQICAgADAQEBAwEABAICAQEAAF+RkZELCwuNjY18fHyQkJAQEBClpaUXFxfJyclTU1MbLK+Tk5OmphAQCi/Nzc3MzMwcHBy8vAlaIUdHTExCQkLf39+EhODhp6dpaWkDAwMWFhZAQECtbvf3968XYxrgYj09I68=",
        9,
        26,
        38,
        27,
        3.38,
        0.739,
        0.025
      ]
    ]
  },
  "tri_purple_green_gold": {
    "archetypeId": "tri_purple_green_gold",
    "tierFormat": "tricolor",
    "domains": [
      "gold",
      "green",
      "purple"
    ],
    "conclaveId": "imperial_triads",
    "classicDeckIds": [],
    "name": "Armada do Zênite Umbral",
    "subtitle": "Tríade ☀️+🌿+💀 • Bastião Imortal, Regeneração & Renascer",
    "strategySummary": "Ergue a linha de frente mais resiliente de Vaeloria unindo Guardiões dourados, Regeneração silvestre, Toque Letal e ressurreição da Cripta.",
    "tacticalIdentity": "attrition",
    "coverCardId": "gold_138_imperador_sol_supremo",
    "generationsEvolved": 25,
    "matchesSimulated": 7156,
    "seedWinRate": 0.417,
    "championWinRate": 0.612,
    "vsMonocolorWinRate": 0.734,
    "vsBicolorWinRate": 0.517,
    "championDeckJaccardStability": 0.869,
    "medianCardCi95HalfWidth": 0.0592,
    "domainCardBreakdown": {
      "gold": 33,
      "neutral": 12,
      "green": 33,
      "purple": 22
    },
    "crossDomainCombos": [
      [
        682,
        119,
        1,
        0.418,
        9,
        " (100% WR em 9 duelos cruzados)"
      ],
      [
        682,
        784,
        1,
        0.388,
        10,
        " (100% WR em 10 duelos cruzados)"
      ],
      [
        682,
        272,
        1,
        0.388,
        8,
        " (100% WR em 8 duelos cruzados)"
      ],
      [
        682,
        913,
        0.923,
        0.341,
        13,
        " (92% WR em 13 duelos cruzados)"
      ],
      [
        126,
        838,
        0.909,
        0.327,
        11,
        " (91% WR em 11 duelos cruzados)"
      ],
      [
        853,
        1033,
        0.909,
        0.327,
        11,
        " (91% WR em 11 duelos cruzados)"
      ]
    ],
    "learnedProfile": {
      "deckId": "tri_purple_green_gold",
      "deckName": "Armada do Zênite Umbral",
      "archetypeTag": "attrition",
      "generationsTrained": 19,
      "matchesSimulated": 7156,
      "baselineWinRate": 0.417,
      "trainedWinRate": 0.612,
      "weights": {
        "aggroFaceBias": 1.06,
        "tradeValueBias": 1.32,
        "guardianPriority": 1.37,
        "flyingEvasionBias": 1,
        "stackConsolidationBias": 1.22,
        "antiAoeSpreadBias": 1,
        "spellHoldPatience": 1,
        "relicPriority": 1.02,
        "ascensionEagerness": 1,
        "bloodPactThresholdHp": 24,
        "domainExpansionEagerness": 1.05,
        "sovPowerTempoBias": 1.04,
        "synergyHoldBonus": 20,
        "mulliganCurveTarget": 2.9
      },
      "mk": [
        910,
        913,
        278,
        126,
        272,
        784,
        421
      ],
      "cp": [
        380,
        858,
        916,
        678,
        944,
        126,
        780,
        90,
        101,
        854
      ],
      "ca": [
        99,
        101,
        114,
        119,
        126,
        140,
        145,
        175,
        272,
        278,
        421,
        483
      ],
      "hb": [
        [
          99,
          24
        ],
        [
          101,
          21.3
        ],
        [
          114,
          21.1
        ],
        [
          119,
          20.6
        ],
        [
          126,
          13.3
        ],
        [
          140,
          17.3
        ],
        [
          145,
          15.9
        ],
        [
          151,
          24
        ],
        [
          175,
          18.9
        ],
        [
          272,
          13.4
        ],
        [
          278,
          14.4
        ],
        [
          421,
          13.6
        ],
        [
          483,
          13.2
        ],
        [
          487,
          16.9
        ],
        [
          545,
          20.9
        ],
        [
          682,
          24
        ],
        [
          781,
          20.5
        ],
        [
          784,
          22
        ],
        [
          838,
          13.7
        ],
        [
          839,
          17.4
        ],
        [
          853,
          12.2
        ],
        [
          862,
          20.3
        ],
        [
          863,
          15.8
        ],
        [
          910,
          20.4
        ],
        [
          913,
          19.4
        ],
        [
          1031,
          24
        ],
        [
          1033,
          24
        ],
        [
          1036,
          16.6
        ],
        [
          1037,
          24
        ],
        [
          1053,
          15
        ],
        [
          1083,
          16
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
          421,
          1033
        ],
        [
          145,
          1033
        ],
        [
          784,
          1033
        ],
        [
          119,
          1033
        ],
        [
          1037,
          126
        ],
        [
          910,
          1033
        ],
        [
          119,
          863
        ],
        [
          1037,
          853
        ],
        [
          1033,
          101
        ],
        [
          545,
          101
        ]
      ],
      "dc": [
        [
          682,
          119,
          1,
          0.418,
          9,
          " (100% WR em 9 duelos cruzados)"
        ],
        [
          682,
          784,
          1,
          0.388,
          10,
          " (100% WR em 10 duelos cruzados)"
        ],
        [
          682,
          272,
          1,
          0.388,
          8,
          " (100% WR em 8 duelos cruzados)"
        ],
        [
          682,
          913,
          0.923,
          0.341,
          13,
          " (92% WR em 13 duelos cruzados)"
        ],
        [
          126,
          838,
          0.909,
          0.327,
          11,
          " (91% WR em 11 duelos cruzados)"
        ],
        [
          853,
          1033,
          0.909,
          0.327,
          11,
          " (91% WR em 11 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        151,
        0.3426,
        0.2733,
        0.0693,
        1,
        0.909,
        8
      ],
      [
        682,
        0.3161,
        0.2421,
        0.0739,
        0.962,
        0.671,
        26
      ],
      [
        781,
        0.2327,
        0.0796,
        0.1532,
        0.882,
        0.754,
        17
      ],
      [
        862,
        0.2299,
        0.0245,
        0.2053,
        0.889,
        0.942,
        9
      ],
      [
        1031,
        0.2139,
        0.0418,
        0.172,
        0.867,
        0.817,
        15
      ],
      [
        175,
        0.1986,
        0.0152,
        0.1833,
        0.857,
        0.933,
        14
      ],
      [
        487,
        0.1542,
        -0.0607,
        0.2149,
        0.786,
        0.391,
        14
      ],
      [
        1036,
        0.1477,
        -0.0548,
        0.2024,
        0.8,
        0.808,
        15
      ],
      [
        1033,
        0.1371,
        -0.0315,
        0.1686,
        0.783,
        0.671,
        23
      ],
      [
        1083,
        0.1327,
        -0.0822,
        0.2149,
        0.786,
        0.821,
        14
      ],
      [
        863,
        0.1233,
        -0.0158,
        0.1391,
        0.771,
        0.724,
        35
      ],
      [
        101,
        0.1135,
        0.057,
        0.0564,
        0.738,
        0.256,
        233
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "AwEBAQMDAwEBAQMDAwAAAAMDAwMDAwICAgAAAAQDAwMDBAAAAQQEBAAAAAACAgAAAAABAQQEBAQEAwQEBAQEAgQEBAIEAAAAAQEBAAEBAwMCAwMDBAQBAQEEAQQDBAQDAAMBAwUQEBCRkZGlpaWOjo6RkZGUlJRVVVWPj493d3d9QEAFBVWurndWkZGTk5NxkZFxe3txampOTkZGRvd+YmJ9fd9jY2PfYmVlZQkJCXtqBFdXkVZWVlZWFhYWVXdOmpFVmq73d5o=",
        0,
        0,
        79,
        21,
        2.87,
        0.029,
        0.025
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "AwEBAQMDAwEBAQMDAwAAAAMDAwMDAwICAgAAAAQDAwMDBAAAAQQEBAAAAAACAgAAAAABAQQEBAQEAwQAAAQEBAQEBAQEAAAAAQEBAAEBAwMCAwMDBAQBAQEEAQQDBAQDAAMBAwUQEBCRkZGlpaWOjo6RkZGUlJRVVVWPj493d3d9QEAFBVWurndWkZGTk5NxkZFxe3txampOTkZGRvd/TEx9fR1jY2MdYmVlZQkJCXtq51dXkVZWVlZWFhYWVXdOmpFVmq73d5o=",
        0,
        6,
        73,
        21,
        2.88,
        0.363,
        0.025
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "AwEBAQMDAwEBAQMDAwAAAAMDAwMDAwICAgAAAAQDAwMDAwAAAQEEBAAAAAACAgAAAAABAQQEBAQEAwQAAAAABAQEBAQAAAAAAQEBAAEBAwMCAwMDBAQBAQEEBAQDAAQDAAMBAwUQEBCRkZGlpaWOjo6RkZGUlJRVVVWPj493d3d9QEAFBQ2vr3d3kZGTk5NxkZFxe3txampOTkZdO/d/TExjYx1jRkYdWmVlZQkJCXtq51dXkVZWVlZWFhYWVVVOmplVr5n3d5o=",
        3,
        14,
        62,
        21,
        3.02,
        0.67,
        0.025
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "AwEBAQMDAwEBAQMDAwAAAAMDAwMDAwICAgAAAAQDAwQDAwAAAQEEBAAAAAQAAAAEAAAAAQQEBAQEAwQAAAAABAEDAwQAAAAAAQEBAwEBAwMDAwMDAQQBAQEEBAEDAAMDAAMEAwUQEBCRkZGlpaWOjo6RkZGUlJRVVVWPj493d3d9QEANBQ2vr3d3kZGTk5MMcnJxTntxcWpOTgldO/d/TExjYx1ZRkYdWmVlZQkJCV5q51dXXlZWVndWFhYWVVVqr5kFr5n3VZo=",
        6,
        22,
        51,
        21,
        3.3,
        0.712,
        0.025
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "BAEBAQMDAwEBAQMDAwAAAAMDAwMDAwICAgAAAAQDAwQCAwAAAgIDAwAAAAQAAAAAAAEDAwEBBAQEAwQAAAAABAEDAwQAAAAAAQEBAwIBAwMDAwMDAQEBAQEDAwMDAAADAAMAAwcQEBCRkZGlpaWOjo6RkZGUlJRVVVWPj493d3d9QEANqg2vr6amEBCTk5MMcnKMfn4LX1/j4wldO/d/TExjYx1ZRkYdWmVlZQkJCV6Y51dXXlZWVn19FhYWDAxar5mmr5n3l7A=",
        10,
        41,
        28,
        21,
        3.75,
        0.75,
        0.025
      ]
    ]
  },
  "tri_red_blue_green": {
    "archetypeId": "tri_red_blue_green",
    "tierFormat": "tricolor",
    "domains": [
      "red",
      "green",
      "blue"
    ],
    "conclaveId": "cataclysm_triads",
    "classicDeckIds": [],
    "name": "Tempestade Elemental Primeva",
    "subtitle": "Tríade 🔥+🌿+❄️ • Rampa Relâmpago, Leviatãs & Sopro Glacial",
    "strategySummary": "Acelera Essência e compra cartas simultaneamente para despejar Dragões, Hidras e Arcontes com Ímpeto, Voo e Congelamento de linha.",
    "tacticalIdentity": "tempo",
    "coverCardId": "red_47_arquiduque_ferro",
    "generationsEvolved": 25,
    "matchesSimulated": 7140,
    "seedWinRate": 0.444,
    "championWinRate": 0.542,
    "vsMonocolorWinRate": 0.766,
    "vsBicolorWinRate": 0.567,
    "championDeckJaccardStability": 0.869,
    "medianCardCi95HalfWidth": 0.18,
    "domainCardBreakdown": {
      "green": 22,
      "neutral": 12,
      "red": 22,
      "blue": 44
    },
    "crossDomainCombos": [
      [
        816,
        58,
        1,
        0.458,
        12,
        " (100% WR em 12 duelos cruzados)"
      ],
      [
        119,
        210,
        0.9,
        0.388,
        10,
        " (90% WR em 10 duelos cruzados)"
      ],
      [
        866,
        605,
        0.875,
        0.363,
        8,
        " (88% WR em 8 duelos cruzados)"
      ],
      [
        54,
        210,
        0.833,
        0.321,
        12,
        " (83% WR em 12 duelos cruzados)"
      ],
      [
        58,
        11,
        0.781,
        0.269,
        32,
        " (78% WR em 32 duelos cruzados)"
      ],
      [
        54,
        863,
        0.778,
        0.265,
        9,
        " (78% WR em 9 duelos cruzados)"
      ]
    ],
    "learnedProfile": {
      "deckId": "tri_red_blue_green",
      "deckName": "Tempestade Elemental Primeva",
      "archetypeTag": "tempo",
      "generationsTrained": 19,
      "matchesSimulated": 7140,
      "baselineWinRate": 0.444,
      "trainedWinRate": 0.542,
      "weights": {
        "aggroFaceBias": 1.16,
        "tradeValueBias": 1.24,
        "guardianPriority": 1.01,
        "flyingEvasionBias": 1.28,
        "stackConsolidationBias": 1,
        "antiAoeSpreadBias": 1,
        "spellHoldPatience": 1.03,
        "relicPriority": 1,
        "ascensionEagerness": 1.37,
        "bloodPactThresholdHp": 24,
        "domainExpansionEagerness": 0.99,
        "sovPowerTempoBias": 1.01,
        "synergyHoldBonus": 20,
        "mulliganCurveTarget": 2.9
      },
      "mk": [
        300,
        126,
        318,
        457,
        11,
        591
      ],
      "cp": [
        1011,
        798,
        664,
        38,
        767,
        190,
        909,
        403,
        269,
        483
      ],
      "ca": [
        58,
        126,
        300,
        816,
        1035
      ],
      "hb": [
        [
          11,
          12.7
        ],
        [
          54,
          8.8
        ],
        [
          58,
          16.9
        ],
        [
          114,
          9
        ],
        [
          126,
          12
        ],
        [
          300,
          23
        ],
        [
          605,
          6.1
        ],
        [
          665,
          19.5
        ],
        [
          816,
          21.7
        ],
        [
          862,
          17.2
        ],
        [
          863,
          13
        ],
        [
          866,
          16.8
        ],
        [
          922,
          6.7
        ],
        [
          1035,
          23.7
        ],
        [
          1056,
          15
        ],
        [
          1059,
          15.5
        ],
        [
          1115,
          20
        ],
        [
          1116,
          20
        ],
        [
          1118,
          20
        ],
        [
          1160,
          11
        ]
      ],
      "sp": [
        [
          1035,
          11
        ],
        [
          58,
          300
        ],
        [
          816,
          1035
        ],
        [
          816,
          119
        ],
        [
          1035,
          114
        ],
        [
          1036,
          3
        ],
        [
          816,
          605
        ],
        [
          1036,
          300
        ],
        [
          816,
          126
        ],
        [
          1035,
          58
        ]
      ],
      "dc": [
        [
          816,
          58,
          1,
          0.458,
          12,
          " (100% WR em 12 duelos cruzados)"
        ],
        [
          119,
          210,
          0.9,
          0.388,
          10,
          " (90% WR em 10 duelos cruzados)"
        ],
        [
          866,
          605,
          0.875,
          0.363,
          8,
          " (88% WR em 8 duelos cruzados)"
        ],
        [
          54,
          210,
          0.833,
          0.321,
          12,
          " (83% WR em 12 duelos cruzados)"
        ],
        [
          58,
          11,
          0.781,
          0.269,
          32,
          " (78% WR em 32 duelos cruzados)"
        ],
        [
          54,
          863,
          0.778,
          0.265,
          9,
          " (78% WR em 9 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        665,
        0.212,
        -0.0359,
        0.2479,
        0.8,
        0.915,
        10
      ],
      [
        862,
        0.161,
        -0.139,
        0.3001,
        0.75,
        0.933,
        8
      ],
      [
        866,
        0.1512,
        -0.0468,
        0.198,
        0.737,
        0.866,
        19
      ],
      [
        1059,
        0.1213,
        -0.0509,
        0.1722,
        0.704,
        0.801,
        27
      ],
      [
        58,
        0.1107,
        0.0329,
        0.0778,
        0.671,
        0.369,
        140
      ],
      [
        863,
        0.0666,
        -0.1424,
        0.209,
        0.65,
        0.821,
        20
      ],
      [
        11,
        0.0595,
        -0.0014,
        0.0609,
        0.619,
        0.341,
        244
      ],
      [
        816,
        0.0495,
        -0.0618,
        0.1112,
        0.608,
        0.327,
        74
      ],
      [
        54,
        0.0388,
        -0.02,
        0.0588,
        0.593,
        0.243,
        268
      ],
      [
        922,
        0.0383,
        -0.0474,
        0.0857,
        0.613,
        0.646,
        124
      ],
      [
        114,
        0.021,
        -0.0474,
        0.0684,
        0.572,
        0.176,
        201
      ],
      [
        126,
        0.0205,
        -0.0488,
        0.0693,
        0.571,
        0.173,
        196
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "BAICAgEBAQMDAwAAAAQBAQAAAAAAAAEBAQQAAAACAgIEBAAEAAABAQEEAAQAAAAAAgAEBAAAAAAAAAAAAAQCAwMDAQEBBAQEBAQEBAQAAAADAwMCAQEAAQQEAAMAAAQAAgAAAkNPT08sLCyNjY13d3clycm+vr4LCws+Pj4lzc3NXV1dJYgDQ3t73d3dTnxDiYl7fG4lUlMmJibo6Og2NjZSbpqampOTk1NTZGRUUlRURUVFLCwsbkJCiUJkTo05H3xOH9EfJdE=",
        0,
        0,
        70,
        30,
        2.84,
        0.049,
        0.025
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "BAICAgEBAQMDAwAAAAQBAQAAAAAAAAEBAQQAAAACAgIEBAAEAAABAQEEAAQAAAAAAgABAQAAAAAAAAAAAAQCAwMDAQEBAgIEBAQEBAQAAAADAwMCAQEAAQIEAAMAAAQAAgAAAkNPT08sLCyNjY13d3clycm+vr4LCws+Pj4lzc3NXV1dJYgDQ3t73d3dTnxDiYl7fG4lRUUmJibo6Og2NjYgbpqampOTk8vLZGRUUlRURUVFLCwsbkJCiUJ7To05H3xOH9EfJdE=",
        0,
        6,
        65,
        29,
        2.88,
        0.341,
        0.025
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "BAICAgEBAQMDAwAAAAABAQAAAAAAAAEBAQQAAAACAgIEBAAEAAAAAAQEAAQCAgAAAgABAQAAAAAAAAAAAAQCAwMDAQEBAgIBAQQEAgQAAAADAwMEAQEBAQIEAAMAAAQAAgAAAkNPT08sLCyNjY13d3fSycm+vr4LCws+Pj4lzc3NXV1dXIgDQ3t7j48jTnxD//97fG4lRUUmJibo6Og2NjYgbpqampOTk8vLSkpUVG5URUVFLCwsXkJCDUJ7To05H3xOH9EfJdE=",
        3,
        14,
        56,
        27,
        3.03,
        0.651,
        0.025
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "BAICAgEBAQMDAwAAAAABAQAAAAAAAAEBAQQAAAACAgIEBAAEAAAAAAQEAwQCAgAABAABAQAAAAAAAAAAAAQBAwMDAQEBAgIBAQMDAgIAAAADAwMEAQABAQIEAAMAAwQAAgAAAltPT08sLCyNjY13d3fSycm+vr4LCws+Pj4lzc3NXV1dXIgDQ3Jyj48jQwFD//9+fgslRUUmJibo6Og2NjYgQpqampOTk8vLSkrz825uRUVFLCwsXkI/DUJ7To05H2JOH9EfJdE=",
        6,
        22,
        45,
        27,
        3.14,
        0.703,
        0.025
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "BAICAgEBAQMDAwAAAAABAQAAAAAAAAEBAQIAAAACAgIEBAAAAAAAAAQDAwMCAgAABAABAQAAAAAAAAAAAAQDAwMDAQEBAgIBAQMDAAAAAAADAwMEAgABAgIBAAMAAwIAAgAAAltPT08sLCyNjY13d3fSycm+vr4LCws+Pj5izc3NXV1dXIgDdHJyj48jXgFf//9+fgslRUUmJibo6Og2NjYgMJqampOTk8vLSkrz8zo6RUVFLCwsXs8/DQx7c405H2KZH9EfJdE=",
        10,
        29,
        34,
        27,
        3.45,
        0.739,
        0.025
      ]
    ]
  },
  "tri_red_blue_gold": {
    "archetypeId": "tri_red_blue_gold",
    "tierFormat": "tricolor",
    "domains": [
      "gold",
      "red",
      "blue"
    ],
    "conclaveId": "imperial_triads",
    "classicDeckIds": [],
    "name": "Conclave da Chama Celeste",
    "subtitle": "Tríade ☀️+🔥+❄️ • Esquadra Aérea, Escudo Divino & Feitiçaria",
    "strategySummary": "Domina os céus com Dragões Solares e Fênix protegidos por Escudo Divino, Congelamento tático e rajadas piroclásticas precisas.",
    "tacticalIdentity": "tempo",
    "coverCardId": "gold_173_general_roda_sol",
    "generationsEvolved": 25,
    "matchesSimulated": 7104,
    "seedWinRate": 0.472,
    "championWinRate": 0.657,
    "vsMonocolorWinRate": 0.797,
    "vsBicolorWinRate": 0.567,
    "championDeckJaccardStability": 0.869,
    "medianCardCi95HalfWidth": 0.0862,
    "domainCardBreakdown": {
      "red": 22,
      "blue": 41,
      "neutral": 12,
      "gold": 25
    },
    "crossDomainCombos": [
      [
        1037,
        300,
        1,
        0.373,
        8,
        " (100% WR em 8 duelos cruzados)"
      ],
      [
        226,
        11,
        1,
        0.373,
        8,
        " (100% WR em 8 duelos cruzados)"
      ],
      [
        816,
        278,
        0.923,
        0.296,
        13,
        " (92% WR em 13 duelos cruzados)"
      ],
      [
        892,
        22,
        0.909,
        0.282,
        11,
        " (91% WR em 11 duelos cruzados)"
      ],
      [
        54,
        457,
        0.909,
        0.282,
        11,
        " (91% WR em 11 duelos cruzados)"
      ],
      [
        58,
        11,
        0.903,
        0.277,
        31,
        " (90% WR em 31 duelos cruzados)"
      ]
    ],
    "learnedProfile": {
      "deckId": "tri_red_blue_gold",
      "deckName": "Conclave da Chama Celeste",
      "archetypeTag": "tempo",
      "generationsTrained": 19,
      "matchesSimulated": 7104,
      "baselineWinRate": 0.472,
      "trainedWinRate": 0.657,
      "weights": {
        "aggroFaceBias": 1.16,
        "tradeValueBias": 1.2,
        "guardianPriority": 0.94,
        "flyingEvasionBias": 1.41,
        "stackConsolidationBias": 1,
        "antiAoeSpreadBias": 1,
        "spellHoldPatience": 1.19,
        "relicPriority": 1.04,
        "ascensionEagerness": 0.98,
        "bloodPactThresholdHp": 24,
        "domainExpansionEagerness": 0.96,
        "sovPowerTempoBias": 1,
        "synergyHoldBonus": 22,
        "mulliganCurveTarget": 2.8
      },
      "mk": [
        300,
        159,
        913,
        272,
        784,
        70
      ],
      "cp": [
        335,
        70,
        403,
        715,
        457,
        943,
        278,
        942,
        1011,
        57
      ],
      "ca": [
        11,
        58,
        159,
        272,
        300,
        460,
        784,
        816,
        880,
        892,
        913,
        1029
      ],
      "hb": [
        [
          11,
          14.7
        ],
        [
          54,
          7.7
        ],
        [
          58,
          14
        ],
        [
          159,
          18.6
        ],
        [
          205,
          12.7
        ],
        [
          226,
          12.5
        ],
        [
          272,
          16.8
        ],
        [
          278,
          7
        ],
        [
          300,
          20.8
        ],
        [
          421,
          7.4
        ],
        [
          457,
          13.6
        ],
        [
          460,
          10.4
        ],
        [
          784,
          20.3
        ],
        [
          816,
          24
        ],
        [
          880,
          24
        ],
        [
          892,
          13
        ],
        [
          913,
          18.2
        ],
        [
          1029,
          15.8
        ],
        [
          1034,
          13.2
        ],
        [
          1035,
          17
        ],
        [
          1037,
          17.1
        ],
        [
          1050,
          13.4
        ],
        [
          1056,
          14.4
        ],
        [
          1116,
          20
        ],
        [
          1118,
          20
        ],
        [
          1119,
          20
        ]
      ],
      "sp": [
        [
          816,
          159
        ],
        [
          816,
          784
        ],
        [
          816,
          892
        ],
        [
          816,
          278
        ],
        [
          913,
          1034
        ],
        [
          816,
          300
        ],
        [
          816,
          272
        ],
        [
          816,
          913
        ],
        [
          1035,
          272
        ],
        [
          816,
          11
        ]
      ],
      "dc": [
        [
          1037,
          300,
          1,
          0.373,
          8,
          " (100% WR em 8 duelos cruzados)"
        ],
        [
          226,
          11,
          1,
          0.373,
          8,
          " (100% WR em 8 duelos cruzados)"
        ],
        [
          816,
          278,
          0.923,
          0.296,
          13,
          " (92% WR em 13 duelos cruzados)"
        ],
        [
          892,
          22,
          0.909,
          0.282,
          11,
          " (91% WR em 11 duelos cruzados)"
        ],
        [
          54,
          457,
          0.909,
          0.282,
          11,
          " (91% WR em 11 duelos cruzados)"
        ],
        [
          58,
          11,
          0.903,
          0.277,
          31,
          " (90% WR em 31 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        1037,
        0.1574,
        0.0009,
        0.1565,
        0.85,
        0.718,
        20
      ],
      [
        11,
        0.1054,
        0.0506,
        0.0548,
        0.781,
        0.374,
        219
      ],
      [
        1056,
        0.0978,
        -0.1501,
        0.2479,
        0.8,
        0.909,
        10
      ],
      [
        816,
        0.09,
        -0.0171,
        0.107,
        0.767,
        0.4,
        60
      ],
      [
        58,
        0.0853,
        0.0045,
        0.0808,
        0.764,
        0.442,
        106
      ],
      [
        457,
        0.0792,
        -0.064,
        0.1432,
        0.781,
        0.906,
        32
      ],
      [
        1050,
        0.0751,
        -0.1965,
        0.2716,
        0.778,
        0.919,
        9
      ],
      [
        205,
        0.0608,
        0.0005,
        0.0603,
        0.737,
        0.381,
        205
      ],
      [
        226,
        0.0551,
        -0.0989,
        0.154,
        0.742,
        0.603,
        31
      ],
      [
        784,
        0.0526,
        -0.0112,
        0.0639,
        0.717,
        0.159,
        191
      ],
      [
        1029,
        0.052,
        -0.1602,
        0.2122,
        0.75,
        0.826,
        16
      ],
      [
        1035,
        0.0504,
        -0.1291,
        0.1795,
        0.739,
        0.641,
        23
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "BAEBAQAAAAAAAAEBAQMDAwMDAwICAgEBAQEBAQMDAwICAgAAAAAABAQBAQEAAAAAAAAEBAIDAAQCBAQAAAAAAAEBAQAAAAQEBAQEAQEBBAQBAQEEBAICAwMDAAQAAgQEAwAEBCXJyckLCwvd3d0sLCyNjY18fHw9PT0QEBClpaWRkZFAQECenpOTk6CgFhYWAwMDzc3NJVhuLDRSblNTNDQmJiZCQkI2NjYoKChUVJOTk1JSzMzMZGTIyC4uLJ4ln25UoCwlZFM=",
        0,
        0,
        75,
        25,
        2.82,
        0.029,
        0.025
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "BAEBAQAAAAAAAAEBAQMDAwMDAwICAgEBAQEBAQMDAwICAgAAAAAABAQBAQEAAAAAAAAEBAIDBAQCBAQBAQAAAAEBAQAAAAQEBAQEAQEBBAQBAQEEBAICAwMDAAQAAgQEAwAEBCXJyckLCwvd3d0sLCyNjY18fHw9PT0QEBClpaWRkZFAQECenpOTk6AaFhYWAwMDzc3NJVhuLCBSblNTRUUmJiZCQkI2NjYoKChUVJOTk1JSzMzMZGTLyy4uLJ4ln25UoCwlZFM=",
        0,
        6,
        69,
        25,
        2.89,
        0.363,
        0.025
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "BAEBAQAAAAAAAAEBAQMDAwMDAwICAgEBAQEBAQMDAwQEAgICAAAABAQBAQEAAAAAAAAEBAIDBAIEAAABAQAAAAEBAQAAAAMDBAQEAQEBBAQBAQEEBAICAwMDAAQAAgQAAwABBCXJyckLCwvd3d0sLCyNjY18fHw9PT0QEBClpaWRkZENX0BAQJOTkxoaFhYWAwMDzc3NJVhuLCBuXkZGRUUmJiZCQkI2NjavryhSVJOTk1JSzMzMZGTLyy4uLJkln25UmSwloFQ=",
        3,
        14,
        59,
        24,
        2.94,
        0.67,
        0.025
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "BAEBAQAAAAAAAAEBAQMDAwMDAwICAgEBAQEBAQMDAwQEAgIDAAAABAQBAQEAAAAAAAAEBAQDBAIEAAABAQAAAAEBAQAAAAMDAwICAQEBAgIBAQEBAQICAwMDAAQAAAMAAwABA1zJyckLCwvd3d0sLCyNjY18fHw9PT0QEBClpaWRkZENX0BAEJOTkxoaFhYWAwMDzc3NJSULLCBuXkZGRUUmJiZCQkI2Njavr67NzZOTk25uzMzMT0/Lyy4uLJkln+LzmSwloPM=",
        6,
        22,
        50,
        22,
        3.13,
        0.712,
        0.025
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "BAEBAQAAAAAAAAEBAQMDAwMDAwICAgEBAQEBAQMDAwQEBAMDAAAABAQBAQEAAAAAAAAAAAQEBAMEAAABAQAAAAEBAQAAAAMDAwICAQEBAAABAQEBAQICAwMBAAIAAAMAAwABA1zJyckLCwvd3d0sLCyNjY18fHw9PT0QEBClpaWRkZENXwcQEJOTkxoaFhYWAwMDzc3NFhYLBSAwXkZGRUUmJiZCQkI2Njavr67NzZOTkzo6zMzMT0/Lyy4umJlin+LzmSwloPM=",
        10,
        28,
        40,
        22,
        3.42,
        0.75,
        0.025
      ]
    ]
  },
  "penta_prismatic_crater": {
    "archetypeId": "penta_prismatic_crater",
    "tierFormat": "pentachromatic",
    "domains": [
      "red",
      "blue",
      "purple",
      "green",
      "gold"
    ],
    "conclaveId": "pentachromatic_apex",
    "classicDeckIds": [
      "deck_spec_pentachromatic"
    ],
    "name": "Soberania da Cratera Prismática",
    "subtitle": "Ápice Pentacromático 🔥❄️💀🌿☀️ • Dragões do Prisma & Primeira Fratura",
    "strategySummary": "Canaliza os cinco domínios primordiais através de Arautos e Dragões da Cratera Prismática para desencadear Sopro, Voo e Expansão no Turno 4.",
    "tacticalIdentity": "ramp",
    "coverCardId": "neutral_167_arauto_prisma_matriz",
    "generationsEvolved": 25,
    "matchesSimulated": 7320,
    "seedWinRate": 0.542,
    "championWinRate": 0.517,
    "vsMonocolorWinRate": 0.672,
    "vsBicolorWinRate": 0.483,
    "championDeckJaccardStability": 0.905,
    "medianCardCi95HalfWidth": 0.086,
    "domainCardBreakdown": {
      "neutral": 20,
      "gold": 13,
      "red": 26,
      "blue": 15,
      "purple": 13,
      "green": 13
    },
    "crossDomainCombos": [
      [
        76,
        834,
        1,
        0.483,
        11,
        " (100% WR em 11 duelos cruzados)"
      ],
      [
        834,
        460,
        0.923,
        0.436,
        13,
        " (92% WR em 13 duelos cruzados)"
      ],
      [
        839,
        11,
        0.9,
        0.413,
        10,
        " (90% WR em 10 duelos cruzados)"
      ],
      [
        37,
        839,
        0.833,
        0.346,
        12,
        " (83% WR em 12 duelos cruzados)"
      ],
      [
        591,
        834,
        0.824,
        0.336,
        17,
        " (82% WR em 17 duelos cruzados)"
      ],
      [
        272,
        890,
        0.818,
        0.331,
        11,
        " (82% WR em 11 duelos cruzados)"
      ]
    ],
    "learnedProfile": {
      "deckId": "penta_prismatic_crater",
      "deckName": "Soberania da Cratera Prismática",
      "archetypeTag": "ramp",
      "generationsTrained": 19,
      "matchesSimulated": 7320,
      "baselineWinRate": 0.542,
      "trainedWinRate": 0.517,
      "weights": {
        "aggroFaceBias": 1.18,
        "tradeValueBias": 1.21,
        "guardianPriority": 1,
        "flyingEvasionBias": 1.25,
        "stackConsolidationBias": 1,
        "antiAoeSpreadBias": 1,
        "spellHoldPatience": 0.94,
        "relicPriority": 1.02,
        "ascensionEagerness": 1.31,
        "bloodPactThresholdHp": 24,
        "domainExpansionEagerness": 1.32,
        "sovPowerTempoBias": 1,
        "synergyHoldBonus": 20,
        "mulliganCurveTarget": 2.9
      },
      "mk": [
        37,
        300,
        126,
        591,
        145
      ],
      "cp": [
        644,
        166,
        834,
        838,
        194,
        816,
        58,
        396,
        796,
        90
      ],
      "ca": [
        11,
        37,
        126,
        145,
        189,
        272,
        300,
        816,
        839,
        853,
        862,
        1028
      ],
      "hb": [
        [
          11,
          16.5
        ],
        [
          37,
          24
        ],
        [
          58,
          13.6
        ],
        [
          126,
          17
        ],
        [
          145,
          15.2
        ],
        [
          189,
          24
        ],
        [
          221,
          6.5
        ],
        [
          236,
          7.4
        ],
        [
          272,
          15.1
        ],
        [
          300,
          24
        ],
        [
          816,
          18.4
        ],
        [
          834,
          17.5
        ],
        [
          839,
          24
        ],
        [
          853,
          19.7
        ],
        [
          862,
          18
        ],
        [
          866,
          19
        ],
        [
          890,
          15.5
        ],
        [
          1028,
          24
        ],
        [
          1031,
          23.7
        ],
        [
          1032,
          17.4
        ],
        [
          1033,
          24
        ],
        [
          1034,
          24
        ],
        [
          1035,
          24
        ],
        [
          1101,
          11
        ],
        [
          1131,
          15
        ],
        [
          1133,
          20
        ]
      ],
      "sp": [
        [
          839,
          300
        ],
        [
          1035,
          300
        ],
        [
          839,
          11
        ],
        [
          272,
          839
        ],
        [
          1033,
          300
        ],
        [
          189,
          300
        ],
        [
          37,
          853
        ],
        [
          126,
          1032
        ],
        [
          853,
          300
        ],
        [
          145,
          839
        ]
      ],
      "dc": [
        [
          76,
          834,
          1,
          0.483,
          11,
          " (100% WR em 11 duelos cruzados)"
        ],
        [
          834,
          460,
          0.923,
          0.436,
          13,
          " (92% WR em 13 duelos cruzados)"
        ],
        [
          839,
          11,
          0.9,
          0.413,
          10,
          " (90% WR em 10 duelos cruzados)"
        ],
        [
          37,
          839,
          0.833,
          0.346,
          12,
          " (83% WR em 12 duelos cruzados)"
        ],
        [
          591,
          834,
          0.824,
          0.336,
          17,
          " (82% WR em 17 duelos cruzados)"
        ],
        [
          272,
          890,
          0.818,
          0.331,
          11,
          " (82% WR em 11 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        1034,
        0.3405,
        0.1546,
        0.1859,
        0.9,
        0.841,
        10
      ],
      [
        189,
        0.2383,
        -0.0097,
        0.2479,
        0.8,
        0.886,
        10
      ],
      [
        866,
        0.2008,
        -0.0993,
        0.3001,
        0.75,
        0.636,
        8
      ],
      [
        1033,
        0.181,
        -0.017,
        0.198,
        0.737,
        0.768,
        19
      ],
      [
        834,
        0.1677,
        0.0729,
        0.0948,
        0.721,
        0.716,
        86
      ],
      [
        1035,
        0.1675,
        -0.0957,
        0.2632,
        0.727,
        0.847,
        11
      ],
      [
        1032,
        0.1576,
        -0.079,
        0.2366,
        0.714,
        0.785,
        14
      ],
      [
        862,
        0.1411,
        -0.0598,
        0.2008,
        0.7,
        0.831,
        20
      ],
      [
        890,
        0.1212,
        -0.0878,
        0.209,
        0.684,
        0.912,
        19
      ],
      [
        1031,
        0.1034,
        -0.2738,
        0.3772,
        0.667,
        0.918,
        6
      ],
      [
        11,
        0.0767,
        0.018,
        0.0587,
        0.603,
        0.178,
        267
      ],
      [
        37,
        0.0752,
        0.0182,
        0.057,
        0.596,
        0.078,
        285
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "BAEBAQAAAAICAgAAAAMDAwEBAQAAAAAAAAQEAwQEBAEBAQQEAAAAAAAABAAAAAAAAAAABAICBAQCBAQEBAQEBAQEBAAABAMDAwMDBAEBAQQDAwICAgQCAQEBAQMEBAMAAAQAA08QEBCRkZFPT08LCwuNjY0sLCzd3d3s7OxDTVVPT5qMjIxaWgMDA83NzVNDJiYmJSUlQ1MdHUZGHUZyQ3JyIiJNIpKTk5JpaRwcHFPMzMyarKxdXV1atSYmdyZCmk1CQ2pDH0I=",
        0,
        0,
        76,
        24,
        2.9,
        0.051,
        0.025
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "BAEBAQAAAAICAgAAAAMDAwEBAQAAAAAAAAQEAwQEAAEBAQQEAAAAAAAABAAAAAAAAAAEBAICBAQCBAQEAAAEAAQEBAAABAMDAwMDBAEBAQQDAwICAgQCAQEBAQMEBAMBAAQAA08QEBCRkZFPT08LCwuNjY0sLCzd3d3s7OxDTVVPT8KMjIxaWgMDA83NzVNDJiYmJSUla1MdHUZGHUZyQ4+PInJNIpKTk5JpaRwcHFPMzMyarKxdXV1atSYmdyZCmk1CoGpDH0I=",
        0,
        6,
        70,
        24,
        2.95,
        0.372,
        0.025
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "AwEBAQAAAAICAgAAAAMDAwEBAQAAAAAAAAQEAwQEAAEBAQQEAAAAAAAABAQAAAAAAAAEAwICAAACBAMEAAAAAAQEAAAAAAMDAwMDAAEBAQQDAwICAgQCAQEBAQMEBAMBAAQAA+QQEBCRkZFPT08LCwuNjY0sLCzd3d3s7OxDTVUIT8KMjIxaWgMDA83NzVNtJiYmJSUlazAdHUxMHUZiQ4+PcnJNIq+Tk69paRwcHDrMzMxPrKxdXV1atSYmdyZCT01CoGpDH0I=",
        3,
        14,
        59,
        24,
        3.14,
        0.666,
        0.025
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "AwEBAQAAAAICAgAAAAMDAwEBAQAAAAAAAAMEAwQEAAEBAQQEAAAAAAAABAQAAAAAAAAEAwIEAAACAwMDAAAAAAAAAAAAAAMDAwMDAAEBAQMDAwICAgQEAQEBAQMDAgMBAAQAA+QQEBCRkZFPT08LCwuNjY0sLCzd3d3s7OxeTVUIT8KMjIwKWgMDA83NzQttJiYmJSUlazAdCUxMHUdiXo+PcnJ+fq+Tk69paRwcHDrMzMx6rKxdXV1aWiYmdyZCeplCoGpDH0I=",
        6,
        22,
        48,
        24,
        3.36,
        0.694,
        0.025
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "AwEBAQAAAAICAgAAAAMDAwEBAQAAAAAAAAMEAwQAAAEBAQQEAAAAAAAABAQAAAAAAAAEAwQEAAADAwMDAAAAAAAAAAAAAAMDAwMDAAEBAQMDAwICAgMDAQEEAQMDAgMBAAMAA+QQEBCRkZFPT08LCwuNjY0sLCzd3d3s7OxeTVUIvcKMjIwKBAMDA83NzQttJiYmJSUlazADCUxMR0diXo+PcnJ+fq+Tk69paRwcHDrMzMx6rKxdXV0eHiYmByZCeplCoGr0H0I=",
        10,
        26,
        40,
        24,
        3.62,
        0.726,
        0.025
      ]
    ]
  },
  "penta_free_city_sovereign": {
    "archetypeId": "penta_free_city_sovereign",
    "tierFormat": "pentachromatic",
    "domains": [
      "gold",
      "green",
      "red",
      "blue",
      "purple"
    ],
    "conclaveId": "pentachromatic_apex",
    "classicDeckIds": [
      "deck_penta_valkyra_pact"
    ],
    "name": "Concílio Supremo da Cidade Franca",
    "subtitle": "Ápice Pentacromático ☀️🌿🔥❄️💀+⚙️ • Valkyra & Torre dos Cinco Selos",
    "strategySummary": "Une Valkyra, os Cinco Anciões Cromáticos e a elite da Cidade Franca em uma falange pentacromática de Escudo Divino, Ímpeto e hinos globais.",
    "tacticalIdentity": "midrange",
    "coverCardId": "neutral_10_valkyra_pentacromatica",
    "generationsEvolved": 25,
    "matchesSimulated": 7108,
    "seedWinRate": 0.319,
    "championWinRate": 0.53,
    "vsMonocolorWinRate": 0.641,
    "vsBicolorWinRate": 0.4,
    "championDeckJaccardStability": 0.905,
    "medianCardCi95HalfWidth": 0.0894,
    "domainCardBreakdown": {
      "neutral": 24,
      "green": 17,
      "blue": 18,
      "gold": 15,
      "red": 13,
      "purple": 13
    },
    "crossDomainCombos": [
      [
        780,
        655,
        1,
        0.5,
        8,
        " (100% WR em 8 duelos cruzados)"
      ],
      [
        784,
        984,
        0.909,
        0.409,
        11,
        " (91% WR em 11 duelos cruzados)"
      ],
      [
        784,
        736,
        0.889,
        0.389,
        27,
        " (89% WR em 27 duelos cruzados)"
      ],
      [
        1074,
        595,
        0.889,
        0.389,
        9,
        " (89% WR em 9 duelos cruzados)"
      ],
      [
        1059,
        935,
        0.875,
        0.375,
        8,
        " (88% WR em 8 duelos cruzados)"
      ],
      [
        736,
        101,
        0.897,
        0.367,
        29,
        " (90% WR em 29 duelos cruzados)"
      ]
    ],
    "learnedProfile": {
      "deckId": "penta_free_city_sovereign",
      "deckName": "Concílio Supremo da Cidade Franca",
      "archetypeTag": "midrange",
      "generationsTrained": 19,
      "matchesSimulated": 7108,
      "baselineWinRate": 0.319,
      "trainedWinRate": 0.53,
      "weights": {
        "aggroFaceBias": 1.14,
        "tradeValueBias": 1.2,
        "guardianPriority": 1.32,
        "flyingEvasionBias": 1.27,
        "stackConsolidationBias": 1,
        "antiAoeSpreadBias": 1,
        "spellHoldPatience": 1.01,
        "relicPriority": 1.01,
        "ascensionEagerness": 1,
        "bloodPactThresholdHp": 24,
        "domainExpansionEagerness": 1.31,
        "sovPowerTempoBias": 1.05,
        "synergyHoldBonus": 21,
        "mulliganCurveTarget": 2.5
      },
      "mk": [
        126,
        11,
        101,
        810,
        591,
        922
      ],
      "cp": [
        175,
        126,
        717,
        483,
        349,
        680,
        11,
        38,
        205,
        916
      ],
      "ca": [
        11,
        48,
        101,
        114,
        126,
        140,
        175,
        189,
        272,
        349,
        595,
        784
      ],
      "hb": [
        [
          11,
          11.1
        ],
        [
          48,
          11.6
        ],
        [
          101,
          24
        ],
        [
          114,
          20.6
        ],
        [
          126,
          18.9
        ],
        [
          140,
          24
        ],
        [
          175,
          19.5
        ],
        [
          189,
          24
        ],
        [
          272,
          12.8
        ],
        [
          349,
          18.7
        ],
        [
          595,
          24
        ],
        [
          664,
          18
        ],
        [
          680,
          14
        ],
        [
          780,
          17.7
        ],
        [
          784,
          24
        ],
        [
          853,
          14.9
        ],
        [
          863,
          24
        ],
        [
          880,
          24
        ],
        [
          922,
          15.8
        ],
        [
          935,
          14.9
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
          1034,
          24
        ],
        [
          1035,
          24
        ],
        [
          1036,
          23.4
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
          20
        ],
        [
          1074,
          20
        ],
        [
          1079,
          20
        ]
      ],
      "sp": [
        [
          189,
          595
        ],
        [
          272,
          189
        ],
        [
          784,
          1032
        ],
        [
          101,
          1034
        ],
        [
          189,
          101
        ],
        [
          853,
          189
        ],
        [
          140,
          922
        ],
        [
          126,
          1032
        ],
        [
          272,
          1032
        ],
        [
          1035,
          101
        ]
      ],
      "dc": [
        [
          780,
          655,
          1,
          0.5,
          8,
          " (100% WR em 8 duelos cruzados)"
        ],
        [
          784,
          984,
          0.909,
          0.409,
          11,
          " (91% WR em 11 duelos cruzados)"
        ],
        [
          784,
          736,
          0.889,
          0.389,
          27,
          " (89% WR em 27 duelos cruzados)"
        ],
        [
          1074,
          595,
          0.889,
          0.389,
          9,
          " (89% WR em 9 duelos cruzados)"
        ],
        [
          1059,
          935,
          0.875,
          0.375,
          8,
          " (88% WR em 8 duelos cruzados)"
        ],
        [
          736,
          101,
          0.897,
          0.367,
          29,
          " (90% WR em 29 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        1032,
        0.2354,
        0.0786,
        0.1568,
        0.8,
        0.695,
        25
      ],
      [
        863,
        0.1963,
        -0.0327,
        0.229,
        0.769,
        0.862,
        13
      ],
      [
        1037,
        0.1934,
        0.026,
        0.1674,
        0.76,
        0.734,
        25
      ],
      [
        664,
        0.178,
        -0.0342,
        0.2122,
        0.75,
        0.843,
        16
      ],
      [
        189,
        0.1758,
        -0.1243,
        0.3001,
        0.75,
        0.887,
        8
      ],
      [
        780,
        0.171,
        -0.0084,
        0.1795,
        0.739,
        0.765,
        23
      ],
      [
        175,
        0.1569,
        -0.0669,
        0.2238,
        0.733,
        0.932,
        15
      ],
      [
        1036,
        0.1522,
        -0.0548,
        0.2069,
        0.722,
        0.804,
        18
      ],
      [
        595,
        0.1342,
        0.0689,
        0.0653,
        0.686,
        0.429,
        194
      ],
      [
        935,
        0.1081,
        0.0198,
        0.0882,
        0.652,
        0.277,
        112
      ],
      [
        101,
        0.1014,
        0.0436,
        0.0578,
        0.644,
        0.254,
        264
      ],
      [
        1034,
        0.0961,
        -0.1425,
        0.2386,
        0.667,
        0.815,
        15
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "BAICAgQDAwMDAwMDAwEBAQEBAQQBAQAAAAICAgAAAAQEAwMDAgIBAQIBBAQBAQQEBAQEBAAAAAQEBAAAAAEBAQQEAAAABAQEBAEBBAQEBAQEAgICAwMDAQQEBAQAAQAEBAQEAVFPT08ojY1VVVUqKioQEBCwsLCIyckLCwuPj48wMDBRUZqamkFBGxtBG0NDBQVMQ01NWlrNzc1SVFQmJiZCQkJ9YmVlZWJifX1cXCgoSUlNTFNTU5SUlAVJmlZWapMfiFJSVlw=",
        0,
        0,
        77,
        23,
        2.84,
        0.051,
        0.025
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "BAICAgMDAwMDAwMDAwEBAQEBAQQBAQAAAAICAgAAAAQEAwMDAgIBAQIBBAQBAQQEBAQEBAAAAAQEBAAAAAEBAQQEAAAABAQEBAEBAwMEBAQEAgICAwMDAQQEBAQAAQAEBAQEAVFPT0+njY1VVVUqKioQEBCwsLCIyckLCwuPj48wMDBRUZqamkFBGxtBG0NDBQUjQ01NWlrNzc1SVFQmJiZCQkJ9YmVlZWJifX1cXq+vSUlNTFNTU5SUlAVJmlYaapMfiFJSVlw=",
        0,
        6,
        71,
        23,
        2.88,
        0.372,
        0.025
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "AAICAgMDAwMDAwMDAwEBAQEBAQQBAQAAAAICAgAAAAQEAwMDAgQAAAICBAQBAQQEBAQEBAAAAAQBAQAAAAEBAQQCAAAABAQEBAEBAwMEBAQEAgICAwMDAQQDBAQAAQAEBAQDAb1PT0+njY1VVVUqKioQEBCwsLCIyckLCwuPj48wMDBRUZqamkEsr69BQUNDBQUjQ01NWlrNzc0yRUUmJiZCQkJ9jWVlZWJifX1eXq+vSUlNTFNTU5SUlAVR2FYaapMfiFJSbVw=",
        3,
        14,
        60,
        23,
        3.02,
        0.666,
        0.025
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "AAICAgMDAwMDAwMDAwEBAQEBAQQBAQAAAAICAgAAAAQDAwMDAgQAAAICBAQEBAQEAQAEBAAAAAQBAQAAAAEBAQICAAAABAQBAQEBAwMEBAAAAgICAwMDAQQDBAQAAQAEAgIDAb1PT0+njY1VVVUqKioQEBCwsLCIyckLCwuPj48wMDBR5JqamkEsr69BQQw3Q0MjQwVyWlrNzc0yRUUmJiZCQkKNjWVlZWJiXV1eXq+vUUl+flNTU5SUlAVR2FYaapMfiM3NbVw=",
        6,
        22,
        49,
        23,
        3.13,
        0.694,
        0.025
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "AAICAgMDAwMDAwMDAwEBAQEBAQEBAQAAAAICAgAAAAQDAwMDBAQAAAMDBAQAAAQDAAAEAAAAAAQBAQAAAAEBAQICAAAAAgIBAQEBAwMDAwAAAgICAwMDAgMDAwQAAQABAgIDAb1PT0+njY1VVVUqKioQEBCwsLA6yckLCwuPj48wMDAI5Jqamg0sr68QEAw3c3MjX3JyCtLNzc0yRUUmJiZCQkKNjWVlZeDgXV1eXq+vsLB+flNTU5SUlJh62AwaapMfOs3NbVw=",
        10,
        37,
        30,
        23,
        3.39,
        0.726,
        0.025
      ]
    ]
  },
  "penta_wheel_convergence": {
    "archetypeId": "penta_wheel_convergence",
    "tierFormat": "pentachromatic",
    "domains": [
      "blue",
      "gold",
      "purple",
      "red",
      "green"
    ],
    "conclaveId": "pentachromatic_apex",
    "classicDeckIds": [],
    "name": "Convergência da Roda Horológica",
    "subtitle": "Ápice Pentacromático ❄️☀️💀🔥🌿+⚙️ • Vaelkor & Generais da Roda",
    "strategySummary": "Orquestra os Generais da Roda dos seis domínios, Constructos de Aeternus e Relíquias cronomantes para controle absoluto e viradas inevitáveis.",
    "tacticalIdentity": "control",
    "coverCardId": "neutral_173_general_roda_matriz",
    "generationsEvolved": 25,
    "matchesSimulated": 7316,
    "seedWinRate": 0.472,
    "championWinRate": 0.593,
    "vsMonocolorWinRate": 0.703,
    "vsBicolorWinRate": 0.35,
    "championDeckJaccardStability": 0.905,
    "medianCardCi95HalfWidth": 0.18,
    "domainCardBreakdown": {
      "neutral": 23,
      "gold": 18,
      "red": 13,
      "blue": 20,
      "green": 13,
      "purple": 13
    },
    "crossDomainCombos": [
      [
        126,
        1032,
        1,
        0.437,
        8,
        " (100% WR em 8 duelos cruzados)"
      ],
      [
        272,
        189,
        1,
        0.437,
        8,
        " (100% WR em 8 duelos cruzados)"
      ],
      [
        114,
        189,
        1,
        0.437,
        14,
        " (100% WR em 14 duelos cruzados)"
      ],
      [
        114,
        1034,
        1,
        0.437,
        9,
        " (100% WR em 9 duelos cruzados)"
      ],
      [
        1035,
        278,
        1,
        0.437,
        11,
        " (100% WR em 11 duelos cruzados)"
      ],
      [
        189,
        105,
        0.944,
        0.381,
        18,
        " (94% WR em 18 duelos cruzados)"
      ]
    ],
    "learnedProfile": {
      "deckId": "penta_wheel_convergence",
      "deckName": "Convergência da Roda Horológica",
      "archetypeTag": "control",
      "generationsTrained": 19,
      "matchesSimulated": 7316,
      "baselineWinRate": 0.472,
      "trainedWinRate": 0.593,
      "weights": {
        "aggroFaceBias": 0.94,
        "tradeValueBias": 1.34,
        "guardianPriority": 1.3,
        "flyingEvasionBias": 1,
        "stackConsolidationBias": 1,
        "antiAoeSpreadBias": 1,
        "spellHoldPatience": 1.28,
        "relicPriority": 1.19,
        "ascensionEagerness": 1,
        "bloodPactThresholdHp": 24,
        "domainExpansionEagerness": 1,
        "sovPowerTempoBias": 1,
        "synergyHoldBonus": 20,
        "mulliganCurveTarget": 2.7
      },
      "mk": [
        105,
        810,
        272,
        278,
        922
      ],
      "cp": [
        1002,
        862,
        922,
        962,
        767,
        717,
        322,
        816,
        312,
        943
      ],
      "ca": [
        54,
        103,
        105,
        189,
        226,
        272,
        278,
        816,
        862,
        922,
        1032,
        1033
      ],
      "hb": [
        [
          54,
          14.2
        ],
        [
          76,
          12.1
        ],
        [
          103,
          23.6
        ],
        [
          105,
          23.7
        ],
        [
          115,
          8
        ],
        [
          126,
          6.4
        ],
        [
          189,
          24
        ],
        [
          221,
          6
        ],
        [
          226,
          12.8
        ],
        [
          272,
          15.2
        ],
        [
          278,
          12.9
        ],
        [
          421,
          10.9
        ],
        [
          605,
          13.6
        ],
        [
          816,
          24
        ],
        [
          862,
          20.8
        ],
        [
          922,
          12.1
        ],
        [
          935,
          16.5
        ],
        [
          1032,
          24
        ],
        [
          1033,
          24
        ],
        [
          1034,
          15.7
        ],
        [
          1035,
          20.8
        ],
        [
          1037,
          24
        ],
        [
          1038,
          15
        ],
        [
          1074,
          20
        ],
        [
          1079,
          20
        ],
        [
          1119,
          20
        ],
        [
          1151,
          15
        ]
      ],
      "sp": [
        [
          816,
          1033
        ],
        [
          1033,
          105
        ],
        [
          278,
          1033
        ],
        [
          272,
          1033
        ],
        [
          114,
          1033
        ],
        [
          816,
          103
        ],
        [
          816,
          1032
        ],
        [
          189,
          76
        ],
        [
          816,
          105
        ],
        [
          816,
          421
        ]
      ],
      "dc": [
        [
          126,
          1032,
          1,
          0.437,
          8,
          " (100% WR em 8 duelos cruzados)"
        ],
        [
          272,
          189,
          1,
          0.437,
          8,
          " (100% WR em 8 duelos cruzados)"
        ],
        [
          114,
          189,
          1,
          0.437,
          14,
          " (100% WR em 14 duelos cruzados)"
        ],
        [
          114,
          1034,
          1,
          0.437,
          9,
          " (100% WR em 9 duelos cruzados)"
        ],
        [
          1035,
          278,
          1,
          0.437,
          11,
          " (100% WR em 11 duelos cruzados)"
        ],
        [
          189,
          105,
          0.944,
          0.381,
          18,
          " (94% WR em 18 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        1035,
        0.239,
        0.1174,
        0.1216,
        0.867,
        0.688,
        30
      ],
      [
        189,
        0.1793,
        0.05,
        0.1293,
        0.806,
        0.66,
        36
      ],
      [
        935,
        0.1454,
        0.0534,
        0.092,
        0.759,
        0.407,
        83
      ],
      [
        1033,
        0.1313,
        -0.0149,
        0.1462,
        0.758,
        0.66,
        33
      ],
      [
        1034,
        0.1276,
        -0.0281,
        0.1557,
        0.759,
        0.754,
        29
      ],
      [
        1032,
        0.1037,
        -0.0347,
        0.1384,
        0.725,
        0.56,
        40
      ],
      [
        605,
        0.0809,
        -0.0265,
        0.1074,
        0.7,
        0.517,
        70
      ],
      [
        103,
        0.0768,
        -0.0605,
        0.1373,
        0.698,
        0.552,
        43
      ],
      [
        278,
        0.0638,
        0.0079,
        0.0559,
        0.669,
        0.24,
        272
      ],
      [
        816,
        0.0603,
        -0.0245,
        0.0849,
        0.675,
        0.432,
        117
      ],
      [
        105,
        0.0481,
        -0.0047,
        0.0528,
        0.648,
        0.125,
        315
      ],
      [
        76,
        0.046,
        -0.0192,
        0.0651,
        0.654,
        0.288,
        205
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "BAEBAQMDAwAAAAMDAgEBAAAAAAADAwQEBAQEBAAAAQEBAAMEAQAAAQEBBAQEBAAAAQEBAAAAAgAAAAEBAQEBBAQEBAQEBAQEBAMDAwAAAAQEBAQDAwQEAQEEBAQEBAQDAQQAAkmwsLARERG+vr7Cwl3Jyd3d3Xd3KipJSVBRmk8mJkJCQiYsVaWTkxYWFmJifWJbW1xcXGlpaV0fHx84ODgJCU5OTE5NTUxMUVGampo2Njaamk9PLCxUVBAQTVVQUFSII6VV+F0=",
        0,
        0,
        91,
        9,
        3.02,
        0.051,
        0.025
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "BAEBAQMDAwAAAAMDAgEBAAAAAAADAwQEAwMEBAAAAQEBAAMEAQAAAQEBBAQEBAAAAQEBAAAAAgAAAAEBAQEABAQEBAQEBAQDAwMDAwAAAAQEBAQDAwQEAQEEBAQEBAQDAQQAAkmwsLARERG+vr7Cwl3Jyd3d3Xd3KipJSa+vmk8mJkJCQiYsVaWTkxYWFmJif2JbW1xcXGlpaV0fHx84ODgJck5OTE5NTUxM6uqampo2Njaamk9PLCxUVBAQTVVQUFSII6VV+F0=",
        0,
        6,
        85,
        9,
        3,
        0.372,
        0.025
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "BAEBAQMDAwAAAAMDAgEBAAAAAAADAwQEAwMEBAQAAQEBAAAEAQAAAQEBBAQEBAAAAQEBAAAAAgAAAAEBAQAAAAAEBAQEBAQDAwMDAwAAAAQEBAQDAwMEAQEEBAQEBAQDAQAAAgiwsLARERG+vr7Cwl3Jyd3d3Xd3KipJSa+vSU8LJkJCQiYmX6WTkxYWFmJif2JMTFxcXGlpaV0fHx84ODhycn5+TE5NTUxM6uqampo2NjaamppPLCwsVBAQTVVPUFQOI6WZ+AE=",
        3,
        14,
        74,
        9,
        3.06,
        0.666,
        0.025
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "BAEBAQMDAwAAAAMDAgEBAAAAAAADAwQDAwMEBAQEAQEBAAAEAQAAAQEBBAQEBAAAAQEBAAAAAgAAAAEBAQAAAAAEBAQEBAQDAwMDAwAAAAQEAwMAAwICAQEEAAMDAQQDAQAAAgiwsLARERG+vr7Cwl3Jyd3d3Xd3KipJ5K+vSUkLMkJCQiYmX6WTkxYWFmJif2JMTFxcXGlpaV0fHx84ODhycn5+TExNTU1M6uqampo2NjaamuPjJizLyxAQN5mwsEoOI6WZ+AE=",
        6,
        22,
        63,
        9,
        3.19,
        0.694,
        0.025
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "BAEBAQMDAwAAAAMDAgEBAAAAAAADAwADAwMDAwQEAQEBAgIEAQAAAQEBBAAEAQAAAQEBAAAABAAAAAEBAQAAAAACAgMDAAADAwMDAwAAAAAAAwMDAwICAQEEAAMDAQQDAQAAAgiwsLARERG+vr7Cwl3Jyd3d3Xd3Kiq95K+veqcLMkJCQs3NX6WTkxYWFglnf15MTFxcXGlpaQofHx84ODhycn5+//9eXnNz6uqampo2NjbGxuPjMDDLyxAQN5mwsEoOI6WZ+AE=",
        10,
        37,
        44,
        9,
        3.5,
        0.726,
        0.025
      ]
    ]
  }
});
