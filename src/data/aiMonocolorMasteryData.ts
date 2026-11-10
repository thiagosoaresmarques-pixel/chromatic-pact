import { unpackMasteryRecord } from './compactMasteryCodec';
import { AiSkillTier, Domain } from '../types/game';
import type { DeckLearnedAiProfile } from './aiLearnedProfiles';

/**
 * GERADO AUTOMATICAMENTE POR src/scripts/trainMonocolorEvolution.ts (npm run train:mono)
 * Partidas Simuladas: 75,872 | Estados Treinados nas Value MLPs: 158,463 (328.1s em 10 threads)
 * Margem de Erro Máxima IC 95% nos Tiers: ±2.94%
 */

export type MonocolorArchetypeId =
  | 'mono_green_swarm'
  | 'mono_green_colossus'
  | 'mono_green_roots'
  | 'mono_red_blitz'
  | 'mono_red_pyroclasm'
  | 'mono_red_dragon'
  | 'mono_blue_frost'
  | 'mono_blue_chrono'
  | 'mono_blue_abyssal'
  | 'mono_purple_crypt'
  | 'mono_purple_blood'
  | 'mono_purple_umbral'
  | 'mono_gold_phalanx'
  | 'mono_gold_celestial'
  | 'mono_gold_judgment'
  | 'mono_neutral_axial';

export interface CardShapleyMetric {
  cardId: string;
  cardName: string;
  shapleyValue: number;
  shapleyLcb?: number;
  ci95HalfWidth?: number;
  playedWinRate: number;
  stuckInHandRate: number;
  samples: number;
}

export interface TierDeckMetadata {
  tier: AiSkillTier;
  tierLabel: string;
  cardIds: string[];
  legendaryCount: number;
  rareCount: number;
  uncommonCount: number;
  commonCount: number;
  avgCost: number;
  benchmarkWinRateVsLadder: number;
  benchmarkCi95HalfWidth?: number;
}

export interface MonocolorArchetypeMastery {
  archetypeId: MonocolorArchetypeId;
  domain: Domain;
  name: string;
  subtitle: string;
  strategySummary: string;
  tacticalIdentity: 'aggro' | 'midrange' | 'control' | 'ramp' | 'tempo' | 'attrition';
  coverCardId: string;
  generationsEvolved: number;
  matchesSimulated: number;
  seedWinRate: number;
  championWinRate: number;
  championDeckJaccardStability?: number;
  medianCardCi95HalfWidth?: number;
  learnedProfile: DeckLearnedAiProfile;
  topShapleyCards: CardShapleyMetric[];
  tierDecks: Record<AiSkillTier, TierDeckMetadata>;
}

export interface DomainTierLadderBenchmark {
  domain: Domain;
  matchesPerCell: number;
  totalLadderMatches?: number;
  tierOverallWinRates: Record<AiSkillTier, number>;
  tierCi95HalfWidths?: Record<AiSkillTier, number>;
  maxTierCi95HalfWidth?: number;
  convergedByMargin?: boolean;
  adjacentDominanceWinRates: {
    tier2VsTier1: number;
    tier3VsTier2: number;
    tier4VsTier3: number;
    tier5VsTier4: number;
    tier5VsTier1: number;
  };
}

export interface MonocolorConvergenceReport {
  workerThreadsUsed: number;
  targetTierCi95HalfWidth: number;
  achievedMaxTierCi95HalfWidth: number;
  targetDeckJaccardStability: number;
  achievedMeanDeckJaccardStability: number;
  achievedMaxMedianCardCi95HalfWidth: number;
  minComboCoPlays: number;
  generationsExecuted: number;
  convergedEarly: boolean;
}

export interface MonocolorTrainingSummary {
  generatedAt: string;
  totalMatchesSimulated: number;
  totalStateTrajectoriesTrained: number;
  elapsedSeconds: number;
  archetypesCount: number;
  convergenceReport?: MonocolorConvergenceReport;
  ladderByDomain: Partial<Record<Domain, DomainTierLadderBenchmark>>;
}

export const MONOCOLOR_TRAINING_SUMMARY: MonocolorTrainingSummary = {
  "generatedAt": "2026-11-10T20:32:54.770Z",
  "totalMatchesSimulated": 96512,
  "totalStateTrajectoriesTrained": 250687,
  "elapsedSeconds": 401.8,
  "archetypesCount": 16,
  "convergenceReport": {
    "workerThreadsUsed": 10,
    "targetTierCi95HalfWidth": 0.03,
    "achievedMaxTierCi95HalfWidth": 0.0294,
    "targetDeckJaccardStability": 0.975,
    "achievedMeanDeckJaccardStability": 0.994,
    "achievedMaxMedianCardCi95HalfWidth": 0.18,
    "minComboCoPlays": 35,
    "generationsExecuted": 16,
    "convergedEarly": false
  },
  "ladderByDomain": {
    "green": {
      "domain": "green",
      "matchesPerCell": 310,
      "totalLadderMatches": 3096,
      "tierOverallWinRates": {
        "1": 0.088,
        "2": 0.258,
        "3": 0.634,
        "4": 0.723,
        "5": 0.772
      },
      "tierCi95HalfWidths": {
        "1": 0.018,
        "2": 0.0287,
        "3": 0.0294,
        "4": 0.0276,
        "5": 0.0255
      },
      "maxTierCi95HalfWidth": 0.0294,
      "convergedByMargin": true,
      "adjacentDominanceWinRates": {
        "tier2VsTier1": 0.73,
        "tier3VsTier2": 0.842,
        "tier4VsTier3": 0.612,
        "tier5VsTier4": 0.583,
        "tier5VsTier1": 0.99
      }
    },
    "red": {
      "domain": "red",
      "matchesPerCell": 343,
      "totalLadderMatches": 3432,
      "tierOverallWinRates": {
        "1": 0.051,
        "2": 0.308,
        "3": 0.622,
        "4": 0.725,
        "5": 0.773
      },
      "tierCi95HalfWidths": {
        "1": 0.0127,
        "2": 0.0292,
        "3": 0.0282,
        "4": 0.0262,
        "5": 0.0245
      },
      "maxTierCi95HalfWidth": 0.0292,
      "convergedByMargin": true,
      "adjacentDominanceWinRates": {
        "tier2VsTier1": 0.853,
        "tier3VsTier2": 0.833,
        "tier4VsTier3": 0.629,
        "tier5VsTier4": 0.58,
        "tier5VsTier1": 0.99
      }
    },
    "blue": {
      "domain": "blue",
      "matchesPerCell": 358,
      "totalLadderMatches": 3576,
      "tierOverallWinRates": {
        "1": 0.047,
        "2": 0.36,
        "3": 0.53,
        "4": 0.772,
        "5": 0.794
      },
      "tierCi95HalfWidths": {
        "1": 0.012,
        "2": 0.0283,
        "3": 0.0291,
        "4": 0.0245,
        "5": 0.0236
      },
      "maxTierCi95HalfWidth": 0.0291,
      "convergedByMargin": true,
      "adjacentDominanceWinRates": {
        "tier2VsTier1": 0.871,
        "tier3VsTier2": 0.662,
        "tier4VsTier3": 0.758,
        "tier5VsTier4": 0.52,
        "tier5VsTier1": 1
      }
    },
    "purple": {
      "domain": "purple",
      "matchesPerCell": 343,
      "totalLadderMatches": 3432,
      "tierOverallWinRates": {
        "1": 0.015,
        "2": 0.362,
        "3": 0.635,
        "4": 0.709,
        "5": 0.779
      },
      "tierCi95HalfWidths": {
        "1": 0.0096,
        "2": 0.0292,
        "3": 0.0286,
        "4": 0.027,
        "5": 0.0245
      },
      "maxTierCi95HalfWidth": 0.0292,
      "convergedByMargin": true,
      "adjacentDominanceWinRates": {
        "tier2VsTier1": 0.96,
        "tier3VsTier2": 0.773,
        "tier4VsTier3": 0.58,
        "tier5VsTier4": 0.597,
        "tier5VsTier1": 1
      }
    },
    "gold": {
      "domain": "gold",
      "matchesPerCell": 358,
      "totalLadderMatches": 3576,
      "tierOverallWinRates": {
        "1": 0.018,
        "2": 0.339,
        "3": 0.59,
        "4": 0.751,
        "5": 0.8
      },
      "tierCi95HalfWidths": {
        "1": 0.0094,
        "2": 0.0291,
        "3": 0.0287,
        "4": 0.0254,
        "5": 0.0234
      },
      "maxTierCi95HalfWidth": 0.0291,
      "convergedByMargin": true,
      "adjacentDominanceWinRates": {
        "tier2VsTier1": 0.944,
        "tier3VsTier2": 0.788,
        "tier4VsTier3": 0.674,
        "tier5VsTier4": 0.56,
        "tier5VsTier1": 1
      }
    },
    "neutral": {
      "domain": "neutral",
      "matchesPerCell": 353,
      "totalLadderMatches": 3528,
      "tierOverallWinRates": {
        "1": 0.021,
        "2": 0.3,
        "3": 0.605,
        "4": 0.733,
        "5": 0.84
      },
      "tierCi95HalfWidths": {
        "1": 0.0096,
        "2": 0.0289,
        "3": 0.029,
        "4": 0.0261,
        "5": 0.0219
      },
      "maxTierCi95HalfWidth": 0.029,
      "convergedByMargin": true,
      "adjacentDominanceWinRates": {
        "tier2VsTier1": 0.934,
        "tier3VsTier2": 0.866,
        "tier4VsTier3": 0.636,
        "tier5VsTier4": 0.63,
        "tier5VsTier1": 1
      }
    }
  }
};

export const MONOCOLOR_ARCHETYPE_MASTERY: Partial<Record<MonocolorArchetypeId, MonocolorArchetypeMastery>> = unpackMasteryRecord<MonocolorArchetypeId, MonocolorArchetypeMastery>({
  "mono_green_swarm": {
    "archetypeId": "mono_green_swarm",
    "domain": "green",
    "name": "Enxame & Matilha Silvestre",
    "subtitle": "Mono-Verde 🌿 • Aggro & Buff em Massa",
    "strategySummary": "Inunda as 6 colunas cedo com feras velozes, invocações de matilha e rugidos de fortalecimento coletivo para letal explosivo.",
    "tacticalIdentity": "aggro",
    "coverCardId": "green_141_soberano_fera_primordial",
    "generationsEvolved": 28,
    "matchesSimulated": 9412,
    "seedWinRate": 0.679,
    "championWinRate": 0.379,
    "championDeckJaccardStability": 0.869,
    "medianCardCi95HalfWidth": 0.034,
    "learnedProfile": {
      "deckId": "mono_green_swarm",
      "deckName": "Enxame & Matilha Silvestre",
      "archetypeTag": "aggro",
      "generationsTrained": 22,
      "matchesSimulated": 8608,
      "baselineWinRate": 0.679,
      "trainedWinRate": 0.379,
      "weights": {
        "aggroFaceBias": 1.27,
        "tradeValueBias": 0.92,
        "guardianPriority": 1.04,
        "flyingEvasionBias": 1,
        "stackConsolidationBias": 0.85,
        "antiAoeSpreadBias": 1.25,
        "spellHoldPatience": 1,
        "relicPriority": 1,
        "ascensionEagerness": 1,
        "bloodPactThresholdHp": 24,
        "domainExpansionEagerness": 1,
        "sovPowerTempoBias": 1.04,
        "synergyHoldBonus": 24,
        "mulliganCurveTarget": 2.8
      },
      "mk": [
        126,
        270,
        254,
        119,
        853,
        554,
        110,
        268,
        108
      ],
      "cp": [
        139,
        654,
        270,
        110,
        257,
        265,
        254,
        365,
        1012,
        754
      ],
      "ca": [
        114,
        115,
        116,
        126,
        140,
        254,
        265,
        266,
        268,
        270,
        367,
        483
      ],
      "hb": [
        [
          108,
          7
        ],
        [
          114,
          20.1
        ],
        [
          115,
          11.7
        ],
        [
          116,
          22.6
        ],
        [
          126,
          24
        ],
        [
          140,
          11.6
        ],
        [
          254,
          12.7
        ],
        [
          265,
          17.6
        ],
        [
          266,
          24
        ],
        [
          268,
          12.5
        ],
        [
          270,
          22.1
        ],
        [
          354,
          7.5
        ],
        [
          367,
          15.7
        ],
        [
          483,
          14.8
        ],
        [
          487,
          15.7
        ],
        [
          554,
          11.8
        ],
        [
          566,
          17.3
        ],
        [
          666,
          22.4
        ],
        [
          668,
          15.8
        ],
        [
          764,
          24
        ],
        [
          769,
          20.2
        ],
        [
          853,
          13
        ],
        [
          866,
          9.6
        ],
        [
          1036,
          12.1
        ],
        [
          1044,
          16.9
        ],
        [
          1059,
          15
        ],
        [
          1100,
          11
        ],
        [
          1102,
          11
        ],
        [
          1115,
          20
        ]
      ],
      "sp": [
        [
          114,
          764
        ],
        [
          266,
          555
        ],
        [
          108,
          666
        ],
        [
          116,
          270
        ],
        [
          114,
          566
        ],
        [
          266,
          487
        ],
        [
          114,
          769
        ],
        [
          126,
          266
        ],
        [
          668,
          126
        ],
        [
          769,
          126
        ]
      ],
      "dc": [
        [
          114,
          1044,
          1,
          0.621,
          10,
          " (100% WR em 10 duelos cruzados)"
        ],
        [
          666,
          266,
          0.875,
          0.496,
          8,
          " (88% WR em 8 duelos cruzados)"
        ],
        [
          859,
          1059,
          0.875,
          0.496,
          8,
          " (88% WR em 8 duelos cruzados)"
        ],
        [
          566,
          354,
          0.8,
          0.421,
          10,
          " (80% WR em 10 duelos cruzados)"
        ],
        [
          769,
          261,
          0.8,
          0.421,
          10,
          " (80% WR em 10 duelos cruzados)"
        ],
        [
          654,
          852,
          0.778,
          0.398,
          9,
          " (78% WR em 9 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        769,
        0.2272,
        0.0919,
        0.1353,
        0.646,
        0.785,
        48
      ],
      [
        666,
        0.1943,
        0.032,
        0.1623,
        0.6,
        0.527,
        35
      ],
      [
        1044,
        0.1527,
        0.0273,
        0.1254,
        0.567,
        0.692,
        60
      ],
      [
        764,
        0.1297,
        -0.0619,
        0.1916,
        0.538,
        0.587,
        26
      ],
      [
        566,
        0.1297,
        -0.0696,
        0.1993,
        0.542,
        0.652,
        24
      ],
      [
        668,
        0.1285,
        -0.0186,
        0.1471,
        0.545,
        0.751,
        44
      ],
      [
        266,
        0.1239,
        0.0059,
        0.118,
        0.507,
        0.08,
        69
      ],
      [
        126,
        0.0918,
        0.0188,
        0.0729,
        0.472,
        0.022,
        180
      ],
      [
        483,
        0.0856,
        -0.0034,
        0.0889,
        0.471,
        0.123,
        121
      ],
      [
        114,
        0.081,
        0.0093,
        0.0717,
        0.462,
        0.041,
        186
      ],
      [
        270,
        0.0756,
        0.0025,
        0.0731,
        0.464,
        0.175,
        179
      ],
      [
        487,
        0.0736,
        -0.0147,
        0.0882,
        0.472,
        0.372,
        123
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "AwMDAAAAAQEBAAAAAgICAQEBAgICAgIAAAADAwMCAgIDAwMCAgQEAAABAQEBAAAAAAAEBAEBAQECAgICAAEBAAAAAAQEAQQEAQEBAQAABAQDAwICAgECAgABAQIAAAABAAIEAlVVVXl5eQAAAP7+/ioqKmJiYo+PjysrbGxsVFRUjo6OUlJSLCxDQ3p63AEBAXd3bm5uTE4JBQUFkvOSknxnZ3x8b3dzc2dzQ2MMDAyIiHJy+vr+/v4O8vJv3NzzeohvDo3zciw=",
        0,
        0,
        51,
        49,
        2.44,
        0.088,
        0.018
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "AwMDAAAAAQEBAAAAAgICAQEBAgICAgIAAAADAwMCAgIDAwMCAgQEAAABAQEBAAAAAAAEBAEBAQECAgICAAEBAAAABAQDAQQAAAEBAQAABAQDAwICAgECAgABAQIAAAABAAIEAlVVVXl5eQAAAP7+/ioqKmJiYo+PjysrbGxsVFRUjo6OUlJSLCwUFHp63AEBAXd3bm5uTE4JBQUFkvOSknxnZ3x8byNzAWdzj48MDAyIiHJy+vr+/v4O8vJv3NzzeohvDo3zciw=",
        0,
        6,
        47,
        47,
        2.44,
        0.258,
        0.0287
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "AwMDAAAAAQEBAAAAAgICAQEBAgICAgIAAAADAwMCAgIDAwMAAwQEAgIBAQEBAAAAAAAEBAEBAQEBAgEBAQAAAAQABAMDAgEAAAEBAQAAAQEDAwICAgECAgABAQICAAABAAICAFVVVXl5eQAAAP7+/ioqKmJiYo+PjysrbGxsVFRUjo6OUlJSiPQUFPPzZwEBAX5+bm5uTE4JBQUF3JLc3Ap8fHxbbyMBAfwPj48MDAx6eg0N+vr+/v4O8vJvZ2eS83pvDo2S/4g=",
        3,
        14,
        42,
        41,
        2.59,
        0.634,
        0.0294
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "AwMDAAAAAQEBAAAAAgICAQEBAgICAgIAAAADAwMCAgIDAwMDAwQEAAAAAQEBAAAAAAAEBAEBAQEBAQEBAQAABAQEBAMDAgEAAAEBAQEBAQEDAwICAgECAgIAAAECAwABAAECA1VVVXl5eQAAAP7+/ioqKmJiYo+PjysrbGxsVFRUjo6OUlJS9PQUFHJyfAEBAX5+bm5uTE4JBQUFZ9xnZwpvbwxbBiMBAfwPj48MDAzn5w0N+vr+/v4O8vI2fHzcnGJvDo3c/2I=",
        6,
        22,
        36,
        36,
        2.81,
        0.723,
        0.0276
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "AwMDAAAAAQEBAAAAAgICAQEBAgICAgIAAAADAwMCAgIDAwMDAwQEAAACAQEBAAAAAAAEBAEBAQEBAQMDAQEBBAQEBAMDAgEAAAEBAQEBAQEDAwICAgECAgIAAAICAwIBAAICA1VVVXl5eQAAAP7+/ioqKmJiYo+PjysrbGxsVFRUjo6OUlJS9PQUFHJymQEBAX5+bm5uTE4JBQUF4+NbWwptbQxbBiMBAfwPj48MDAzn5w0N+vr+/v4O8vI2c3OcnGKaDo03/2I=",
        7,
        33,
        24,
        36,
        3.11,
        0.772,
        0.0255
      ]
    ]
  },
  "mono_green_colossus": {
    "archetypeId": "mono_green_colossus",
    "domain": "green",
    "name": "Colossos Primordiais",
    "subtitle": "Mono-Verde 🌿 • Ramp & Atropelar",
    "strategySummary": "Acelera Essência com xamãs druídicos para esmagar linhas defensivas com dinossauros e titãs dotados de Atropelar.",
    "tacticalIdentity": "ramp",
    "coverCardId": "green_173_general_roda_selva",
    "generationsEvolved": 28,
    "matchesSimulated": 9360,
    "seedWinRate": 0.476,
    "championWinRate": 0.382,
    "championDeckJaccardStability": 0.835,
    "medianCardCi95HalfWidth": 0.0457,
    "learnedProfile": {
      "deckId": "mono_green_colossus",
      "deckName": "Colossos Primordiais",
      "archetypeTag": "ramp",
      "generationsTrained": 22,
      "matchesSimulated": 8556,
      "baselineWinRate": 0.476,
      "trainedWinRate": 0.382,
      "weights": {
        "aggroFaceBias": 1.15,
        "tradeValueBias": 1.12,
        "guardianPriority": 1,
        "flyingEvasionBias": 1,
        "stackConsolidationBias": 1,
        "antiAoeSpreadBias": 1,
        "spellHoldPatience": 1,
        "relicPriority": 1,
        "ascensionEagerness": 1.18,
        "bloodPactThresholdHp": 24,
        "domainExpansionEagerness": 1.22,
        "sovPowerTempoBias": 1,
        "synergyHoldBonus": 20,
        "mulliganCurveTarget": 3.2
      },
      "mk": [
        118,
        126,
        120,
        1018,
        473
      ],
      "cp": [
        127,
        130,
        115,
        135,
        664,
        858,
        139,
        663,
        264,
        365
      ],
      "ca": [
        114,
        115,
        116,
        119,
        120,
        126,
        130,
        140,
        267,
        473,
        483,
        484
      ],
      "hb": [
        [
          114,
          24
        ],
        [
          115,
          19.5
        ],
        [
          116,
          24
        ],
        [
          118,
          17
        ],
        [
          119,
          19.8
        ],
        [
          120,
          18.5
        ],
        [
          126,
          24
        ],
        [
          130,
          11.9
        ],
        [
          139,
          10.2
        ],
        [
          140,
          24
        ],
        [
          266,
          16.2
        ],
        [
          267,
          24
        ],
        [
          473,
          15.6
        ],
        [
          483,
          24
        ],
        [
          484,
          13.4
        ],
        [
          487,
          15.9
        ],
        [
          558,
          17.5
        ],
        [
          655,
          8.9
        ],
        [
          664,
          11.2
        ],
        [
          665,
          24
        ],
        [
          666,
          24
        ],
        [
          765,
          24
        ],
        [
          853,
          16.1
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
          15.2
        ],
        [
          1036,
          24
        ],
        [
          1079,
          21.4
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
          119,
          862
        ],
        [
          114,
          666
        ],
        [
          119,
          1036
        ],
        [
          1036,
          473
        ],
        [
          119,
          863
        ],
        [
          120,
          1036
        ],
        [
          666,
          120
        ],
        [
          666,
          119
        ],
        [
          114,
          1036
        ],
        [
          1036,
          558
        ]
      ],
      "dc": [
        [
          765,
          558,
          1,
          0.618,
          11,
          " (100% WR em 11 duelos cruzados)"
        ],
        [
          862,
          256,
          1,
          0.618,
          11,
          " (100% WR em 11 duelos cruzados)"
        ],
        [
          114,
          140,
          1,
          0.618,
          10,
          " (100% WR em 10 duelos cruzados)"
        ],
        [
          664,
          558,
          1,
          0.618,
          9,
          " (100% WR em 9 duelos cruzados)"
        ],
        [
          140,
          256,
          0.9,
          0.518,
          10,
          " (90% WR em 10 duelos cruzados)"
        ],
        [
          1036,
          473,
          0.9,
          0.518,
          10,
          " (90% WR em 10 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        1036,
        0.3478,
        0.1461,
        0.2016,
        0.765,
        0.702,
        17
      ],
      [
        140,
        0.3424,
        0.1924,
        0.15,
        0.75,
        0.515,
        32
      ],
      [
        665,
        0.3416,
        0.1126,
        0.229,
        0.769,
        0.916,
        13
      ],
      [
        862,
        0.3377,
        0.1994,
        0.1382,
        0.757,
        0.745,
        37
      ],
      [
        765,
        0.2669,
        0.0723,
        0.1946,
        0.682,
        0.662,
        22
      ],
      [
        1079,
        0.2531,
        0.0993,
        0.1538,
        0.649,
        0.275,
        37
      ],
      [
        863,
        0.2354,
        0.0708,
        0.1646,
        0.656,
        0.781,
        32
      ],
      [
        558,
        0.1659,
        0.1069,
        0.059,
        0.563,
        0.295,
        272
      ],
      [
        266,
        0.1368,
        -0.0059,
        0.1427,
        0.532,
        0.266,
        47
      ],
      [
        487,
        0.1303,
        0.0091,
        0.1212,
        0.538,
        0.526,
        65
      ],
      [
        483,
        0.1239,
        0.042,
        0.0819,
        0.51,
        0.095,
        143
      ],
      [
        866,
        0.1154,
        -0.1371,
        0.2525,
        0.533,
        0.722,
        15
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "AgICAAAAAQEBAQEBAwMDAAAABAQDAgICAQEBAQEBAQQEAQEAAAQEAQECAgMDAgIDBAQBAgICAQEBAgIBAQIDAwIBBAEBAQQEBAQCAgICAAADAQEBBAQEAgICAgIEAgECAAAEAY+Pj3d3dwAAANnZ2VRUVHh4eENNVS4uLgPf32reaQNDcgkJcX0iIt7eLy9ZWfPzWSJNaZT0Ldzc3PHx3+AxWFgxaU0DBQV0b29v9PSTk3FxWAlqanR0ci+TlPHzQ5TgMX19cgU=",
        0,
        0,
        76,
        24,
        3.22,
        0.088,
        0.018
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "AgICAAAAAQEBAQEBAwMDAAAABAQDAgICAQEBAQEBAQQEAQEAAAQEAQECAgMDAgIDBAQBAgICAQEBAgIAAAIDAwIBBAEBAQQAAQECAgICAAADAQEBBAQEAgICAgIEAgQCAAAEAY+Pj3d3dwAAANnZ2VRUVHh4eENNVS4uLgPf32reaQNDcgkJcX0iIt7eLy9ZWfPzWSJNaZT0Ldzc3PHxj48xWFgxaU0DBQV0h3Nz9PSTk3FxWAlqanR0ci+TlPHzQ5REMX19cgU=",
        0,
        6,
        73,
        21,
        3.31,
        0.258,
        0.0287
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "AgICAAAAAQEBAQEBAwMDAAAABAQDAgICAQAAAQEBAQQEAwMBAAMDAAABAQICAgICAwQBAgICAQEBAgIAAAQCAgQEBAEEBAAAAQECAgICAQECAwAABAIEAQICAgIEAgQBAAAEBI+Pj3d3dwAAANnZ2VRUVHh4eENNVS4uLgNycuPjaQNDclhYCXFZWYuL3Nz09PHx9FlNaZOULQUFBS8vj48M8/M3W00DIiKHh3NzlJQxMQkJ81h9fXQ7ctwxky/xQ5NEaXFxciI=",
        3,
        14,
        62,
        21,
        3.39,
        0.634,
        0.0294
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "AgICAAAAAQEBAQEBAwMDAAAABAQDAgICAQAAAQEBAQQEAgIAAAICAAABAQICAgICAgQDAgICBAQEAQEAAAQCAgQEBAADAwAAAQECAgEBAwMCAgAAAgIDAQECAQIEAgQBAgIEA4+Pj3d3dwAAANnZ2VRUVHh4eENNVS4uLgNycuPjCgNDcvPzf3/09IuLBQWUlC8vlPRN6DGTLSIiItzcj48M8fE3W02MWVmHh3Nzk5NpaVhY8fNwcDs7YgVpMdwvQzFEA/X1clk=",
        6,
        22,
        51,
        21,
        3.46,
        0.723,
        0.0276
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "AgICAAAAAQEBAQEBAwMDAAAABAQDAgICAAAAAQEBAgQBAgIAAAICAAABAQICAwMAAAEDAgICAgEBAgIAAAQDAwQEAgADAwAAAQEBAQMDAgIAAAAAAgIDAgICAwMEAQQAAgIBAo+Pj3d3dwAAANnZ2VRUVHh4eENNVS4uLnRycuPjCjVD55iYf3/6+ouLbW37+11dgoJu6DQ0LTNra5aWj48MXl43W/2MX1+Hh3NzBgZcXJmZc3NwcDs7Ypf5+e7uQwhEfvX15/c=",
        10,
        63,
        6,
        21,
        4.45,
        0.772,
        0.0255
      ]
    ]
  },
  "mono_green_roots": {
    "archetypeId": "mono_green_roots",
    "domain": "green",
    "name": "Raízes Eternas",
    "subtitle": "Mono-Verde 🌿 • Guardião & Regeneração",
    "strategySummary": "Ergue muralhas vivas com Guardião, Regeneração e curas recorrentes, vencendo por atrito intransponível de Vanguarda.",
    "tacticalIdentity": "attrition",
    "coverCardId": "green_86_tarrasque_desperto",
    "generationsEvolved": 28,
    "matchesSimulated": 8916,
    "seedWinRate": 0.452,
    "championWinRate": 0.316,
    "championDeckJaccardStability": 0.887,
    "medianCardCi95HalfWidth": 0.0429,
    "learnedProfile": {
      "deckId": "mono_green_roots",
      "deckName": "Raízes Eternas",
      "archetypeTag": "attrition",
      "generationsTrained": 22,
      "matchesSimulated": 8112,
      "baselineWinRate": 0.452,
      "trainedWinRate": 0.316,
      "weights": {
        "aggroFaceBias": 0.86,
        "tradeValueBias": 1.37,
        "guardianPriority": 1.38,
        "flyingEvasionBias": 1,
        "stackConsolidationBias": 1,
        "antiAoeSpreadBias": 1,
        "spellHoldPatience": 1.06,
        "relicPriority": 1.14,
        "ascensionEagerness": 1,
        "bloodPactThresholdHp": 24,
        "domainExpansionEagerness": 0.97,
        "sovPowerTempoBias": 1.02,
        "synergyHoldBonus": 21,
        "mulliganCurveTarget": 3.2
      },
      "mk": [
        126,
        554,
        254,
        853,
        256
      ],
      "cp": [
        271,
        265,
        661,
        114,
        562,
        256,
        260,
        858,
        115,
        130
      ],
      "ca": [
        114,
        115,
        116,
        121,
        126,
        140,
        254,
        260,
        265,
        267,
        271,
        483
      ],
      "hb": [
        [
          114,
          24
        ],
        [
          115,
          17.1
        ],
        [
          116,
          24
        ],
        [
          121,
          13.1
        ],
        [
          126,
          24
        ],
        [
          140,
          19.8
        ],
        [
          254,
          13.8
        ],
        [
          256,
          8.4
        ],
        [
          258,
          9.9
        ],
        [
          260,
          11.1
        ],
        [
          265,
          17.3
        ],
        [
          267,
          22.2
        ],
        [
          268,
          12.9
        ],
        [
          271,
          19.8
        ],
        [
          483,
          21.2
        ],
        [
          554,
          16.2
        ],
        [
          555,
          9
        ],
        [
          566,
          18.7
        ],
        [
          571,
          17.8
        ],
        [
          661,
          17.7
        ],
        [
          666,
          24
        ],
        [
          765,
          22.1
        ],
        [
          769,
          23.6
        ],
        [
          853,
          20.8
        ],
        [
          862,
          24
        ],
        [
          863,
          22.7
        ],
        [
          864,
          24
        ],
        [
          866,
          18.9
        ],
        [
          1036,
          22.3
        ],
        [
          1059,
          17
        ],
        [
          1079,
          16.3
        ],
        [
          1081,
          24
        ],
        [
          1102,
          11
        ],
        [
          1115,
          20
        ]
      ],
      "sp": [
        [
          114,
          769
        ],
        [
          666,
          126
        ],
        [
          116,
          554
        ],
        [
          116,
          126
        ],
        [
          265,
          271
        ],
        [
          116,
          483
        ],
        [
          769,
          265
        ],
        [
          769,
          126
        ],
        [
          571,
          265
        ],
        [
          271,
          483
        ]
      ],
      "dc": [
        [
          765,
          554,
          0.889,
          0.573,
          9,
          " (89% WR em 9 duelos cruzados)"
        ],
        [
          121,
          1081,
          0.8,
          0.484,
          10,
          " (80% WR em 10 duelos cruzados)"
        ],
        [
          258,
          474,
          0.778,
          0.462,
          9,
          " (78% WR em 9 duelos cruzados)"
        ],
        [
          765,
          855,
          0.778,
          0.462,
          9,
          " (78% WR em 9 duelos cruzados)"
        ],
        [
          1081,
          554,
          0.778,
          0.462,
          9,
          " (78% WR em 9 duelos cruzados)"
        ],
        [
          363,
          554,
          0.75,
          0.434,
          8,
          " (75% WR em 8 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        1081,
        0.351,
        0.163,
        0.188,
        0.696,
        0.574,
        23
      ],
      [
        267,
        0.2719,
        0.0849,
        0.187,
        0.615,
        0.552,
        26
      ],
      [
        866,
        0.1986,
        -0.126,
        0.3246,
        0.556,
        0.82,
        9
      ],
      [
        765,
        0.1753,
        -0.0206,
        0.1958,
        0.52,
        0.576,
        25
      ],
      [
        661,
        0.1709,
        0.0233,
        0.1476,
        0.523,
        0.718,
        44
      ],
      [
        1059,
        0.1557,
        0.0143,
        0.1415,
        0.5,
        0.568,
        48
      ],
      [
        1079,
        0.1389,
        -0.0198,
        0.1588,
        0.474,
        0.377,
        38
      ],
      [
        571,
        0.1263,
        -0.0442,
        0.1705,
        0.485,
        0.853,
        33
      ],
      [
        116,
        0.1038,
        -0.0258,
        0.1296,
        0.429,
        0.176,
        56
      ],
      [
        853,
        0.0946,
        0.0303,
        0.0644,
        0.42,
        0.196,
        226
      ],
      [
        554,
        0.0761,
        0.0181,
        0.058,
        0.398,
        0.116,
        274
      ],
      [
        268,
        0.0647,
        -0.0341,
        0.0988,
        0.394,
        0.26,
        94
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "AgICAwMDAAAAAgICBAMDAAAAAQEAAAACAgIBAQICAQEBAQECAAACAwQEAAABAQQEAgIDAwMDAwMEBAQCAAACBAAEBAEEBAABBAQEAQEBAgECAgMAAAABAQECBAAAAQEAAQEBBI+Pj1NTU////ysrK05VVXl5eQAA/v7+KioqZGQsLAkJCdvb8G17kVVDQ21tAgJNTfDwV1dXVlZWTk5zkHFxkEN7cnNqdHRxanJyc2hoaJBqkZFYioqKBAQELHR7fWTbfQLaDE0=",
        0,
        0,
        57,
        43,
        2.78,
        0.088,
        0.018
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "AgICAwMDAAAAAgICBAMDAAAAAQEAAAACAgIBAQICAQEBAQECAAACAwQEAAABAQQEAgIDAwMDAwMEBAAAAAAEBAAEBAEEBAABBAQEAQEBAwECAgMAAAABAQECBAACAQECAQEBBI+Pj1NTU////ysrK05VVXl5eQAA/v7+KioqZGQsLAkJCdvb8G17kVVDQ21tAgJNTfDwV1dXVlZWTk6Pj3FxI0N7cnNqdHRxanJyc2hoaGJqkZFYioqKBAQELHR7/2Tb/wLaDE0=",
        0,
        6,
        54,
        40,
        2.83,
        0.258,
        0.0287
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "AgICAwMDAAAAAgICBAMDAAAAAQEAAAACAgIAAAQEAQEBAAAEAgQAAwICAgIAAAICBAQDAwMDAwMEBAAAAAAEAgEDAwEEBAABBAQCAQEBAwEAAAMAAAABAQEEBAQCAwMCAQEBAo+Pj1NTU////ysrK05VVXl5eQAA/v7+KioqbX5DQwkJCXJyTfBOe1WRkfDwbW0sLE1NV1dXVlZWOU6Pj3FxI5HlAQFqdHRxanJyn2hoaGJqe3tYioqKBAQEQ3Rb/15e/wLaDCw=",
        3,
        14,
        51,
        32,
        3.1,
        0.634,
        0.0294
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "AgICAwMDAAAAAgICBAMDAAAAAQEAAAACAgIAAAICAQEBAAAEBAEBAwAAAgIBAQQEAgQDAwMDAwMEBAAAAAAEAAEDAwQCAgABAgICAQEBAwAEBAMAAAABAQECAQQCAwMCAQEBBI+Pj1NTU////ysrK05VVXl5eQAA/v7+Kioqfn6RkQkJCXJyTU1qalV7e5WV4+NDQyxNV1dXVlZWOTePj3FxI3vlAQEMLCxxajs7n2hoaGJ0Tk5YioqKBAQEkXJb/15e/wLaDEM=",
        6,
        22,
        43,
        29,
        3.3,
        0.723,
        0.0276
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "AgICAwMDAAAAAgICBAMDAAAAAQEAAAACAgIAAAAAAQEBAAABAQICAwICAgIBAQICAAADAwMDAwMEBAAAAgIEAwEDAwQBAQIBAgICAQEBAwAAAAMAAAABAQEBAQQCAwMCAQEBAI+Pj1NTU////ysrK05VVXl5eQAA/v7+Kioqfn5zcwkJCXJyBwf7+1X4+JWV4+OYmICAV1dXVlZWOTePj5r9I1/lAQEMDw82Czs7n2hoaGJ0goJYioqKBAQEa3Jb/15e/wLaDH8=",
        10,
        41,
        23,
        26,
        3.78,
        0.772,
        0.0255
      ]
    ]
  },
  "mono_red_blitz": {
    "archetypeId": "mono_red_blitz",
    "domain": "red",
    "name": "Blitz Salamandra",
    "subtitle": "Mono-Vermelho 🔥 • Ímpeto & Pele Incandescente",
    "strategySummary": "Assalto relâmpago com tropas de Ímpeto, Fúria Crescente e Pele Incandescente que punem qualquer bloqueio inimigo.",
    "tacticalIdentity": "aggro",
    "coverCardId": "red_157_dragao_tiamat_carmesim",
    "generationsEvolved": 28,
    "matchesSimulated": 9556,
    "seedWinRate": 0.643,
    "championWinRate": 0.442,
    "championDeckJaccardStability": 0.869,
    "medianCardCi95HalfWidth": 0.0286,
    "learnedProfile": {
      "deckId": "mono_red_blitz",
      "deckName": "Blitz Salamandra",
      "archetypeTag": "aggro",
      "generationsTrained": 22,
      "matchesSimulated": 8752,
      "baselineWinRate": 0.643,
      "trainedWinRate": 0.442,
      "weights": {
        "aggroFaceBias": 1.46,
        "tradeValueBias": 0.84,
        "guardianPriority": 1,
        "flyingEvasionBias": 0.96,
        "stackConsolidationBias": 1,
        "antiAoeSpreadBias": 1,
        "spellHoldPatience": 0.99,
        "relicPriority": 1,
        "ascensionEagerness": 0.97,
        "bloodPactThresholdHp": 20,
        "domainExpansionEagerness": 1,
        "sovPowerTempoBias": 1.21,
        "synergyHoldBonus": 20,
        "mulliganCurveTarget": 2.4
      },
      "mk": [
        694,
        205,
        3,
        11,
        600,
        0,
        201,
        693,
        457,
        1,
        791,
        502
      ],
      "cp": [
        471,
        603,
        600,
        2,
        200,
        794,
        459,
        693,
        11,
        791
      ],
      "ca": [
        0,
        1,
        2,
        3,
        11,
        201,
        205,
        460,
        502,
        508,
        600,
        692
      ],
      "hb": [
        [
          0,
          11.7
        ],
        [
          1,
          12.1
        ],
        [
          2,
          12
        ],
        [
          3,
          15.6
        ],
        [
          11,
          16.8
        ],
        [
          200,
          13.3
        ],
        [
          201,
          12
        ],
        [
          205,
          18.4
        ],
        [
          317,
          14.1
        ],
        [
          460,
          15.4
        ],
        [
          471,
          15
        ],
        [
          502,
          9.1
        ],
        [
          508,
          18.7
        ],
        [
          516,
          16.8
        ],
        [
          600,
          15.2
        ],
        [
          692,
          11.1
        ],
        [
          693,
          12.8
        ],
        [
          700,
          12.9
        ],
        [
          791,
          16.1
        ],
        [
          799,
          19.8
        ],
        [
          800,
          19.8
        ],
        [
          1028,
          24
        ],
        [
          1034,
          19.4
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
          1116,
          20
        ],
        [
          1154,
          11
        ],
        [
          1160,
          17.6
        ]
      ],
      "sp": [
        [
          793,
          1034
        ],
        [
          600,
          471
        ],
        [
          692,
          1034
        ],
        [
          791,
          508
        ],
        [
          602,
          508
        ],
        [
          1,
          693
        ],
        [
          0,
          1034
        ],
        [
          3,
          1034
        ],
        [
          1034,
          502
        ],
        [
          693,
          1034
        ]
      ],
      "dc": [
        [
          693,
          1160,
          0.867,
          0.425,
          15,
          " (87% WR em 15 duelos cruzados)"
        ],
        [
          602,
          791,
          0.813,
          0.371,
          16,
          " (81% WR em 16 duelos cruzados)"
        ],
        [
          201,
          508,
          0.8,
          0.358,
          15,
          " (80% WR em 15 duelos cruzados)"
        ],
        [
          1160,
          503,
          0.8,
          0.358,
          10,
          " (80% WR em 10 duelos cruzados)"
        ],
        [
          500,
          508,
          0.8,
          0.358,
          10,
          " (80% WR em 10 duelos cruzados)"
        ],
        [
          3,
          791,
          0.789,
          0.348,
          38,
          " (79% WR em 38 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        800,
        0.2187,
        -0.0654,
        0.284,
        0.7,
        0.796,
        10
      ],
      [
        1160,
        0.1679,
        0.0408,
        0.1271,
        0.636,
        0.538,
        55
      ],
      [
        516,
        0.1502,
        -0.1341,
        0.2843,
        0.636,
        0.892,
        11
      ],
      [
        1034,
        0.1415,
        -0.0837,
        0.2252,
        0.611,
        0.561,
        18
      ],
      [
        791,
        0.1211,
        0.0389,
        0.0822,
        0.587,
        0.487,
        138
      ],
      [
        460,
        0.12,
        0.0592,
        0.0609,
        0.565,
        0.063,
        255
      ],
      [
        471,
        0.1111,
        -0.1925,
        0.3036,
        0.6,
        0.947,
        10
      ],
      [
        508,
        0.0993,
        -0.0549,
        0.1542,
        0.55,
        0.184,
        40
      ],
      [
        205,
        0.0975,
        0.0385,
        0.059,
        0.54,
        0.021,
        274
      ],
      [
        3,
        0.0936,
        0.0334,
        0.0603,
        0.536,
        0.019,
        263
      ],
      [
        317,
        0.0919,
        -0.1301,
        0.222,
        0.579,
        0.91,
        19
      ],
      [
        200,
        0.0742,
        -0.0742,
        0.1484,
        0.558,
        0.848,
        43
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "AgICAQEBAAAAAAAAAQEBAQEBAAAAAAAAAgICAAAABAAAAAABAQEBAQICAgAAAAAAAAQEBAMDAwECAgIEAwMEAwMDAAQEAQECAgIDAwMAAAABAQEBAQQEAQEEAAAAAgECBAECAFpaWsnJycnJyQ8PD/b29vT09AsLCwAAAFhYWMjIyIIBAgICLi739/e1tbXNzc0DAwMlWIj4+PgvW1tbJRoaWBkZGdMliMvLtLS0FxcXCgoKzMzMyjCCgsrKiA0NDcMww1gww9M=",
        0,
        0,
        56,
        44,
        2.42,
        0.051,
        0.0127
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "AgICAQEBAAAAAAAAAQEBAQEBAAAAAAAAAgICAAAABAAAAAABAQEBAQICAgAAAAAAAAQEBAMDAwECAgIEAwMEAwMDAQQEAQECAgIDAwMAAAABAQEBAQQEAQEEAAAAAgEBBAECAVpaWsnJycnJyQ8PD/b29vT09AsLCwAAAFhYWMjIyIIBAgICLi739/e1tbXNzc0DAwMlWIj4+PgvW1tbJRoaWBkZGT0liMvLtLS0FxcXCgoKzMzMyjCCgsrKiA0NDWkw11jXBD0=",
        0,
        6,
        52,
        42,
        2.45,
        0.308,
        0.0292
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "AgICAQEBAAAAAAAAAQEBAQEBAAAAAAAAAgICAAAABAAAAAABAQEBAQICAgAAAAAAAAQEBAMDAwECAgIEAwMEAwMDAQEEAQECAgIDAwMAAAABAQEDAwAAAwMEBAIDAgEBAwECAVpaWsnJycnJyQ8PD/b29vT09AsLCwAAAFhYWMjIyIIBAgICLi739/e1tbXNzc0DAwMlWIj4+PgvW1tbJRoaXBkZGT38iMvLtLS0FxcXCgoKzMzM7OzY2B0diCW8H2kw1yDXBD0=",
        3,
        14,
        43,
        40,
        2.69,
        0.622,
        0.0282
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "AgICAQEBAAAAAAAAAQEBAQEBAAAAAAAAAgICAAAABAAAAAABAQEBAQICAgAAAAAAAAQEBAMDAwECAgIEAwMEAwMDAQEEAQECAgIDAwMAAAABAQEDAwAAAwMEAAIDAgEBAwECAVpaWsnJycnJyQ8PD/b29vT09AsLCwAAAFhYWMjIyIIBAgICLi739/e1tbXNzc0DAwMlWIj4+PgvW1tbChoaXBkZGT38iMvLtLS0FxcXCgoKzMzM7OzY2B0diM+8H2kw1yDXBD0=",
        4,
        15,
        41,
        40,
        2.75,
        0.725,
        0.0262
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "AgICAQEBAAAAAAAAAQEBAQEBAAAAAAAAAgICAAAABAAAAAABAQEBAQICAgAAAAAAAAQEBAMDAwECAgIEAwMEAwMDAQEEAQECAgIDAwMAAAABAQEDAwAAAwMEAAIDAgEBAwECAVpaWsnJycnJyQ8PD/b29vT09AsLCwAAAFhYWMjIyIIBAgICLi739/e1tbXNzc0DAwMlWIj4+PgvW1tbChoaXBkZGT38iMvLtLS0FxcXCgoKzMzM7OzY2B0diM+8H2kw1yDXBD0=",
        4,
        15,
        41,
        40,
        2.75,
        0.773,
        0.0245
      ]
    ]
  },
  "mono_red_pyroclasm": {
    "archetypeId": "mono_red_pyroclasm",
    "domain": "red",
    "name": "Artilharia Piroclástica",
    "subtitle": "Mono-Vermelho 🔥 • Queima Direta & Cataclismos",
    "strategySummary": "Varre fileiras inimigas com erupções vulcânicas, armadilhas de magma e dano direto letal contra o Soberano rival.",
    "tacticalIdentity": "control",
    "coverCardId": "red_138_colosso_vulcano_primordial",
    "generationsEvolved": 28,
    "matchesSimulated": 9416,
    "seedWinRate": 0.429,
    "championWinRate": 0.311,
    "championDeckJaccardStability": 0.905,
    "medianCardCi95HalfWidth": 0.0398,
    "learnedProfile": {
      "deckId": "mono_red_pyroclasm",
      "deckName": "Artilharia Piroclástica",
      "archetypeTag": "control",
      "generationsTrained": 22,
      "matchesSimulated": 8612,
      "baselineWinRate": 0.429,
      "trainedWinRate": 0.311,
      "weights": {
        "aggroFaceBias": 1.25,
        "tradeValueBias": 1.14,
        "guardianPriority": 0.99,
        "flyingEvasionBias": 0.89,
        "stackConsolidationBias": 1,
        "antiAoeSpreadBias": 1,
        "spellHoldPatience": 1.3,
        "relicPriority": 1,
        "ascensionEagerness": 1,
        "bloodPactThresholdHp": 24,
        "domainExpansionEagerness": 1,
        "sovPowerTempoBias": 1,
        "synergyHoldBonus": 25,
        "mulliganCurveTarget": 3
      },
      "mk": [
        457,
        11,
        300,
        502
      ],
      "cp": [
        1022,
        6,
        34,
        23,
        602,
        5,
        502,
        609,
        313,
        24
      ],
      "ca": [
        1,
        6,
        11,
        29,
        34,
        201,
        207,
        209,
        215,
        300,
        463,
        502
      ],
      "hb": [
        [
          1,
          10.2
        ],
        [
          6,
          11.2
        ],
        [
          11,
          23.4
        ],
        [
          29,
          11.8
        ],
        [
          34,
          14.5
        ],
        [
          35,
          17.5
        ],
        [
          201,
          14.1
        ],
        [
          207,
          14.6
        ],
        [
          209,
          19.2
        ],
        [
          215,
          24
        ],
        [
          300,
          21.7
        ],
        [
          463,
          24
        ],
        [
          502,
          22.2
        ],
        [
          508,
          22.6
        ],
        [
          509,
          24
        ],
        [
          516,
          16.5
        ],
        [
          609,
          7.9
        ],
        [
          612,
          9
        ],
        [
          701,
          20.3
        ],
        [
          703,
          10.1
        ],
        [
          707,
          20.2
        ],
        [
          708,
          15.8
        ],
        [
          791,
          13.8
        ],
        [
          792,
          13.2
        ],
        [
          798,
          15.1
        ],
        [
          800,
          24
        ],
        [
          1034,
          23.3
        ],
        [
          1038,
          15
        ],
        [
          1113,
          11
        ],
        [
          1116,
          20
        ],
        [
          1158,
          11
        ],
        [
          1161,
          15
        ]
      ],
      "sp": [
        [
          792,
          800
        ],
        [
          791,
          800
        ],
        [
          800,
          29
        ],
        [
          1,
          800
        ],
        [
          800,
          300
        ],
        [
          11,
          800
        ],
        [
          463,
          502
        ],
        [
          792,
          463
        ],
        [
          300,
          463
        ],
        [
          201,
          463
        ]
      ],
      "dc": [
        [
          1,
          800,
          0.875,
          0.564,
          8,
          " (88% WR em 8 duelos cruzados)"
        ],
        [
          707,
          33,
          0.818,
          0.507,
          11,
          " (82% WR em 11 duelos cruzados)"
        ],
        [
          11,
          701,
          0.778,
          0.467,
          9,
          " (78% WR em 9 duelos cruzados)"
        ],
        [
          708,
          207,
          0.75,
          0.439,
          8,
          " (75% WR em 8 duelos cruzados)"
        ],
        [
          701,
          300,
          0.75,
          0.439,
          8,
          " (75% WR em 8 duelos cruzados)"
        ],
        [
          1022,
          23,
          0.75,
          0.439,
          8,
          " (75% WR em 8 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        800,
        0.5055,
        0.3222,
        0.1833,
        0.857,
        0.813,
        14
      ],
      [
        701,
        0.2299,
        0.0466,
        0.1833,
        0.571,
        0.611,
        28
      ],
      [
        35,
        0.1669,
        -0.0372,
        0.2042,
        0.522,
        0.877,
        23
      ],
      [
        516,
        0.1449,
        -0.0403,
        0.1852,
        0.5,
        0.884,
        28
      ],
      [
        707,
        0.1432,
        0.0074,
        0.1358,
        0.481,
        0.532,
        52
      ],
      [
        215,
        0.1332,
        0.0211,
        0.1121,
        0.461,
        0.327,
        76
      ],
      [
        708,
        0.129,
        -0.0123,
        0.1413,
        0.479,
        0.785,
        48
      ],
      [
        1034,
        0.1128,
        -0.0571,
        0.1699,
        0.455,
        0.616,
        33
      ],
      [
        209,
        0.0983,
        -0.0321,
        0.1304,
        0.418,
        0.179,
        55
      ],
      [
        201,
        0.0904,
        0.0299,
        0.0605,
        0.407,
        0.115,
        253
      ],
      [
        11,
        0.0833,
        0.028,
        0.0553,
        0.399,
        0.088,
        301
      ],
      [
        502,
        0.0694,
        0.0087,
        0.0607,
        0.391,
        0.215,
        248
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "AAAAAAAAAQEBBAMDAQEBAwMDAAAAAgICAQEBBAMEBAQBAQIDBAIEBAMDBAQEBAABAgADAwAAAAAAAAAEAAQAAAAAAAAAAgICBAQEBAADBAACAgIDBAQABAQAAAAAAgQDAgAAAAsLCwEBASwsLFkYGMnJyRcXF8nJyVpaWvb29lkbJT09zMxdGT1eJSUZGVpaWlgZzF7LIyPNGR/VIiIiWBmGISEdHR3NzV5dXYeHh1jVI4gfZGRkG4aGy4iI1QgICL9ZG8Mfy9c=",
        0,
        0,
        73,
        27,
        2.79,
        0.051,
        0.0127
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "AAAAAAAAAQEBBAMDAQEBAwMDAAAAAgICAQEBBAMEBAQBAQIDBAIEBAMDBAQEBAABAgADAwQAAAAAAAAEAAQAAAAAAAICAgICBAQEBAADBAACAgIDBAQABAQAAAAAAgQDAgAAAAsLCwEBASwsLFkYGMnJyRcXF8nJyVpaWvb29lkbJT09zMxdGT1eJSUZGVpaWlgZzF4jIyMOGR/VIiIiWBmGISEdHR0BAV5dXYeHh1jVI4gfZGRkG4aGGIiI1QgICL9ZG8MfI9c=",
        0,
        6,
        70,
        24,
        2.88,
        0.308,
        0.0292
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "AAAAAAAAAQEBBAMDAQEBAwMDAAAAAgICAQEBBAIDAwMAAAIEAwIDAwQEBAQEBAEBAgADAwQEAAAAAAACAgQAAAAAAAICAwICBAQEAQADBAACAgICBAQABAQAAAAAAgQEAgAAAAsLCwEBASwsLFkYGMnJyRcXF8nJyVpaWvb29lleGxkZz89dJRleGxslJT09PVo9PV4jIyMOiR/VIiIiBASGISEdHR0BASBdXVpahznVI4gfZGRkvYaGGIiI1QgICL9ZXMMfI9c=",
        3,
        14,
        59,
        24,
        3.04,
        0.622,
        0.0282
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "AAAAAAAAAQEBBAMDAQEBAwMDAAAAAgICAQEBBAQCAwMAAAIEBAECAgMEAwQEAgEBBAAAAAQEBAAAAAACAgQAAAAAAAICAwICAAABAQAABAQCAgICAgIAAwMAAAAAAgMEAgAAAAsLCwEBASwsLFkYGMnJyRcXF8nJyVpaWvb29llZXhkZz89dJSX8Xl4bJRk9PWE9PQoj2NgOiYgfIiIiBASGISEdHR0BASBdXdnZOTnV1YiIZGRkvcTEGBsbHwgICL8pXMMfI9c=",
        6,
        22,
        48,
        24,
        3.13,
        0.725,
        0.0262
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "AAAAAAAAAQEBBAMDAQEBAwMDAAAAAgICAQEBAAMDAwMAAAEDAwEAAAAAAAACAgEBBAAAAAQEAQEAAAACAgQAAAAAAAICAwIDAAABAQEBAwMCAgICAgIAAAACAAAAAgMEAgAAAAsLCwEBASwsLFkYGMnJyRcXF8nJyVpaWvb29tEeHh0dz8/P/v78FxcFBQYGYWE9PQoj2NgOiTo6IiIiBASGISEdHR0BASBmJdnZOTn+/iQkZGRkvcTEGNbWwQgICL8pXMMfI9c=",
        10,
        44,
        22,
        24,
        3.57,
        0.773,
        0.0245
      ]
    ]
  },
  "mono_red_dragon": {
    "archetypeId": "mono_red_dragon",
    "domain": "red",
    "name": "Trono Dracônico",
    "subtitle": "Mono-Vermelho 🔥 • Voo, Sopro & Ascensão",
    "strategySummary": "Domina os céus com wyverns e dragões anciãos de Voo, Sopro Elemental e Ascensão, ignorando bloqueadores terrestres.",
    "tacticalIdentity": "midrange",
    "coverCardId": "red_08_dragao_vermelho",
    "generationsEvolved": 28,
    "matchesSimulated": 8932,
    "seedWinRate": 0.488,
    "championWinRate": 0.316,
    "championDeckJaccardStability": 0.835,
    "medianCardCi95HalfWidth": 0.0522,
    "learnedProfile": {
      "deckId": "mono_red_dragon",
      "deckName": "Trono Dracônico",
      "archetypeTag": "midrange",
      "generationsTrained": 22,
      "matchesSimulated": 8128,
      "baselineWinRate": 0.488,
      "trainedWinRate": 0.316,
      "weights": {
        "aggroFaceBias": 1.18,
        "tradeValueBias": 1,
        "guardianPriority": 1,
        "flyingEvasionBias": 1.38,
        "stackConsolidationBias": 1,
        "antiAoeSpreadBias": 1,
        "spellHoldPatience": 1.02,
        "relicPriority": 0.96,
        "ascensionEagerness": 1.28,
        "bloodPactThresholdHp": 24,
        "domainExpansionEagerness": 1.27,
        "sovPowerTempoBias": 1,
        "synergyHoldBonus": 19,
        "mulliganCurveTarget": 3
      },
      "mk": [
        300,
        205,
        11,
        457
      ],
      "cp": [
        35,
        217,
        206,
        300,
        23,
        700,
        20,
        699,
        798,
        796
      ],
      "ca": [
        2,
        3,
        7,
        11,
        21,
        205,
        300,
        310,
        460,
        464,
        509,
        605
      ],
      "hb": [
        [
          2,
          11.4
        ],
        [
          3,
          12.9
        ],
        [
          7,
          23.2
        ],
        [
          11,
          17.5
        ],
        [
          21,
          24
        ],
        [
          205,
          14.3
        ],
        [
          300,
          24
        ],
        [
          308,
          14.4
        ],
        [
          310,
          24
        ],
        [
          317,
          16.2
        ],
        [
          460,
          13.8
        ],
        [
          464,
          24
        ],
        [
          509,
          24
        ],
        [
          605,
          19.3
        ],
        [
          610,
          24
        ],
        [
          700,
          23.9
        ],
        [
          791,
          15.2
        ],
        [
          799,
          24
        ],
        [
          1028,
          24
        ],
        [
          1034,
          24
        ],
        [
          1070,
          20
        ],
        [
          1071,
          20.3
        ],
        [
          1072,
          24
        ],
        [
          1113,
          11
        ],
        [
          1116,
          20
        ],
        [
          1160,
          21
        ]
      ],
      "sp": [
        [
          2,
          1034
        ],
        [
          605,
          1034
        ],
        [
          11,
          1034
        ],
        [
          300,
          464
        ],
        [
          509,
          11
        ],
        [
          610,
          300
        ],
        [
          1034,
          300
        ],
        [
          2,
          310
        ],
        [
          610,
          205
        ],
        [
          509,
          791
        ]
      ],
      "dc": [
        [
          2,
          1071,
          0.75,
          0.434,
          8,
          " (75% WR em 8 duelos cruzados)"
        ],
        [
          695,
          12,
          0.714,
          0.398,
          14,
          " (71% WR em 14 duelos cruzados)"
        ],
        [
          1071,
          205,
          0.667,
          0.351,
          9,
          " (67% WR em 9 duelos cruzados)"
        ],
        [
          2,
          464,
          0.667,
          0.351,
          9,
          " (67% WR em 9 duelos cruzados)"
        ],
        [
          205,
          206,
          0.667,
          0.351,
          12,
          " (67% WR em 12 duelos cruzados)"
        ],
        [
          605,
          14,
          0.647,
          0.331,
          17,
          " (65% WR em 17 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        1072,
        0.4429,
        0.1949,
        0.2479,
        0.8,
        0.825,
        10
      ],
      [
        700,
        0.3095,
        0.0709,
        0.2386,
        0.667,
        0.826,
        15
      ],
      [
        1034,
        0.3081,
        0.0001,
        0.308,
        0.667,
        0.852,
        9
      ],
      [
        464,
        0.2961,
        0.0871,
        0.209,
        0.65,
        0.759,
        20
      ],
      [
        1160,
        0.2453,
        0.0113,
        0.234,
        0.588,
        0.541,
        17
      ],
      [
        1071,
        0.2298,
        0.0399,
        0.1899,
        0.577,
        0.623,
        26
      ],
      [
        7,
        0.1825,
        -0.0885,
        0.271,
        0.538,
        0.8,
        13
      ],
      [
        799,
        0.1377,
        -0.1722,
        0.3099,
        0.5,
        0.927,
        10
      ],
      [
        317,
        0.1367,
        -0.1462,
        0.2829,
        0.5,
        0.948,
        12
      ],
      [
        21,
        0.1053,
        -0.1657,
        0.271,
        0.462,
        0.806,
        13
      ],
      [
        308,
        0.0967,
        -0.0455,
        0.1421,
        0.447,
        0.685,
        47
      ],
      [
        310,
        0.085,
        -0.2396,
        0.3246,
        0.444,
        0.87,
        9
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "AQEBAAAAAAAAAQEBAwMDAAAAAQEBAQEBBAAAAAAAAwMDAgICAQEEAQEBBAMDAAICAAAAAAIEAgIEAAAEBAQEAAMABAQAAAMAAAMDAgIBAAAAAAAEAwQAAAAEBAICAAADAQABAywsLAsLCwICAsnJyRcXFwwMDMfHxy0tLVnNzQMDAxwcHF1dXff3PczMzIj4+BC3Xs7OzsxeWbW1WRISWlo9hyL4ED1a1dUbBNUjG1619wQEDg4OiBuIEszMh4e3tx8fIzgfOCM=",
        0,
        0,
        79,
        21,
        3.19,
        0.051,
        0.0127
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "AQEBAAAAAAAAAQEBAwMDAAAAAQEBAQEBBAAAAAAAAwMDAgICAQEEAQEBBAMDAAICAAAAAAIEAgIEAAAEBAQAAAMABAQAAAMAAAMDAgIBAAAAAAAEAwQAAAAAAAICAAACAQABAiwsLAsLCwICAsnJyRcXFwwMDMfHxy0tLVnNzQMDAxwcHF1dXff3PczMzIj4+BC3Xs7OzsxeWbW1WRISWlo9IyP4ED1a1dUbBNUjG1619wQEDg4OiBuIEszMCQm3tx8fATgfOAE=",
        0,
        6,
        73,
        21,
        3.22,
        0.308,
        0.0292
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "AQEBAAAAAAAAAQEBAwMDAAAAAQEBAQEBBAAAAAAAAwMDAgICAgIEAQEBBAEAAAIAAAAAAAAEAAAEAAQEBAQAAAIDBAQAAAIDAQECAAACAwMAAAAEAgQEAAAAAAICAAACAQABAiwsLAsLCwICAsnJyRcXFwwMDMfHxy0tLVnNzQMDAxwcHF1dXbW1PczMzIj3ExO3zM7OzhLMWQQEMAcvWlo9IyO6HT1a2dleGz09XswEtRsbDg4OiF6IWRISCQm3tx8fATgfOAE=",
        3,
        14,
        62,
        21,
        3.43,
        0.622,
        0.0282
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "AQEBAAAAAAAAAQEBAwMDAAAAAQEBAQEBBAAAAAAAAwMDAgICAwMEAQEBBAAAAAIAAAAABAAEAQEEAAQEBAQAAAIDBAQAAAACAQEAAAAAAgIAAAAEAAQEBAQAAAICAAACAQABAiwsLAsLCwICAsnJyRcXFwwMDMfHxy0tLVnNzQMDAxwcHF1dXR4ePczMzIgXExO3Es7OzlkSXDQ0MAcvWlouIyO6HQpa2dnMXj09zBLQ0F5gDg4OiMyIPT1ZCQm3tx8fATgfOAE=",
        6,
        22,
        51,
        21,
        3.62,
        0.725,
        0.0262
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "AQEBAAAAAAAAAQEBAwMDAAAAAQEBAQEBBAAAAAAAAwMDAgICAwMAAQEBBAAAAAICAAAAAAAEAQEEAAQBAQQAAAIDBAAAAAAAAQECAwAAAgIAAAAEAAQCAwMAAAICAAACAQABAiwsLAsLCwICAsnJyRcXFwwMDMfHxy0tLVnNzQMDAxwcHF1dXR4e0czMzIgXExO3vM7OzhYWXDQ0MAcvNtAuIyO6HQoV2dkFBT09vB/Q0GBgDg4OiBSIu/LyCQm3tx8fATgfOAE=",
        10,
        34,
        35,
        21,
        3.93,
        0.773,
        0.0245
      ]
    ]
  },
  "mono_blue_frost": {
    "archetypeId": "mono_blue_frost",
    "domain": "blue",
    "name": "Inverno Eterno",
    "subtitle": "Mono-Azul ❄️ • Congelar & Estase Tática",
    "strategySummary": "Paralisa a Vanguarda inimiga turno após turno com Congelar em área e elementais glaciais enquanto dita o ritmo da mesa.",
    "tacticalIdentity": "tempo",
    "coverCardId": "blue_136_leviata_cronos",
    "generationsEvolved": 28,
    "matchesSimulated": 8572,
    "seedWinRate": 0.619,
    "championWinRate": 0.451,
    "championDeckJaccardStability": 0.869,
    "medianCardCi95HalfWidth": 0.0452,
    "learnedProfile": {
      "deckId": "mono_blue_frost",
      "deckName": "Inverno Eterno",
      "archetypeTag": "tempo",
      "generationsTrained": 22,
      "matchesSimulated": 7768,
      "baselineWinRate": 0.619,
      "trainedWinRate": 0.451,
      "weights": {
        "aggroFaceBias": 1.08,
        "tradeValueBias": 1.22,
        "guardianPriority": 1,
        "flyingEvasionBias": 1,
        "stackConsolidationBias": 1,
        "antiAoeSpreadBias": 1,
        "spellHoldPatience": 1.22,
        "relicPriority": 1,
        "ascensionEagerness": 1.03,
        "bloodPactThresholdHp": 24,
        "domainExpansionEagerness": 1,
        "sovPowerTempoBias": 1,
        "synergyHoldBonus": 27,
        "mulliganCurveTarget": 2.9
      },
      "mk": [
        67,
        43,
        619,
        620,
        53,
        710
      ],
      "cp": [
        534,
        321,
        620,
        519,
        54,
        57,
        38,
        530,
        625,
        401
      ],
      "ca": [
        37,
        53,
        54,
        57,
        70,
        223,
        625,
        816,
        1029,
        1035
      ],
      "hb": [
        [
          37,
          21
        ],
        [
          53,
          14.1
        ],
        [
          54,
          21.7
        ],
        [
          57,
          15
        ],
        [
          70,
          18.9
        ],
        [
          223,
          13.1
        ],
        [
          226,
          14.6
        ],
        [
          621,
          12.7
        ],
        [
          625,
          11.5
        ],
        [
          811,
          12
        ],
        [
          814,
          12.1
        ],
        [
          816,
          24
        ],
        [
          1029,
          18
        ],
        [
          1035,
          21.9
        ],
        [
          1040,
          15
        ],
        [
          1055,
          11
        ],
        [
          1056,
          15
        ],
        [
          1106,
          11
        ],
        [
          1118,
          20
        ]
      ],
      "sp": [
        [
          816,
          70
        ],
        [
          816,
          54
        ],
        [
          816,
          223
        ],
        [
          816,
          1029
        ],
        [
          1029,
          223
        ],
        [
          54,
          70
        ],
        [
          1035,
          54
        ],
        [
          54,
          57
        ],
        [
          69,
          70
        ],
        [
          816,
          57
        ]
      ],
      "dc": [
        [
          1035,
          223,
          0.909,
          0.458,
          11,
          " (91% WR em 11 duelos cruzados)"
        ],
        [
          619,
          1029,
          0.889,
          0.437,
          9,
          " (89% WR em 9 duelos cruzados)"
        ],
        [
          223,
          334,
          0.875,
          0.424,
          8,
          " (88% WR em 8 duelos cruzados)"
        ],
        [
          226,
          320,
          0.818,
          0.367,
          11,
          " (82% WR em 11 duelos cruzados)"
        ],
        [
          710,
          57,
          0.792,
          0.34,
          24,
          " (79% WR em 24 duelos cruzados)"
        ],
        [
          1035,
          53,
          0.786,
          0.334,
          14,
          " (79% WR em 14 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        1029,
        0.166,
        -0.0168,
        0.1829,
        0.654,
        0.726,
        26
      ],
      [
        1035,
        0.1552,
        -0.0017,
        0.1569,
        0.639,
        0.644,
        36
      ],
      [
        70,
        0.1092,
        0.0109,
        0.0982,
        0.594,
        0.662,
        96
      ],
      [
        226,
        0.1013,
        -0.0401,
        0.1414,
        0.574,
        0.434,
        47
      ],
      [
        53,
        0.0921,
        0.0295,
        0.0627,
        0.56,
        0.331,
        241
      ],
      [
        37,
        0.0623,
        0.0048,
        0.0575,
        0.524,
        0.208,
        290
      ],
      [
        621,
        0.0592,
        -0.0088,
        0.068,
        0.531,
        0.414,
        207
      ],
      [
        54,
        0.0537,
        0.0011,
        0.0526,
        0.51,
        0.099,
        347
      ],
      [
        814,
        0.047,
        -0.0351,
        0.0821,
        0.528,
        0.594,
        142
      ],
      [
        811,
        0.0444,
        -0.0372,
        0.0815,
        0.528,
        0.638,
        144
      ],
      [
        816,
        0.0443,
        -0.0315,
        0.0758,
        0.509,
        0.264,
        167
      ],
      [
        223,
        0.0398,
        -0.0177,
        0.0574,
        0.502,
        0.209,
        291
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "BAQAAQEBAAEDAwMAAQECAgICAgICAgICAgIBAQEEBAICAAAAAQAAAAIEAAAAAgICAwMDBAADBAQDAAAAAAEBAAAABAQCAQIBBAQAAAACAgIEBAACBAEAAAAEBAQABAAAAAMAAR9S3T8/PzSRKysrNEFBa2trxsbGBwcHbGxsQEBAVFTIyDY2NpMmJiZuUjU1NW1tbS4uLmg0LGhoLCUzMzNCQujo6FRTbkJuk2RkRUVFFRUVZFIlyECU5eXlQFNTJUDf398sQ5M=",
        0,
        0,
        69,
        31,
        2.86,
        0.047,
        0.012
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "BAQAAQEBAAEDAwMAAQECAgICAgICAgICAgIBAQEEBAIBAAAAAQAAAAIEAAAAAgICAwMDBAADBAQDAAAAAAEBAAAABAQCAQIBBAQAAAACAgIEBAACAgIAAAACBAQAAgAAAAMAAR9S3T8/PzSRKysrNEFBa2trxsbGBwcHbGxsQEBAVFTIRTY2NpMmJiZuUjU1NW1tbS4uLmg0LGhoLCUzMzNCQujo6FRTbkJuk2RkRUVFFRUVZFIlyxYW5eXle1NTJXvf398sQ5M=",
        0,
        6,
        63,
        31,
        2.9,
        0.36,
        0.0283
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "BAQAAQEBAAEDAwMAAQECAgICAgICAgICAgIBAQEEBAEBAAAAAQAAAAMCAAAAAgICAwMDBAQDAAAEAAAAAAEBAAAABAEEAQIBAgIAAAACAgIEBAACAgIAAAACAgIAAgAAAAMAAR9S3T8/PzSRKysrNEFBa2trxsbGBwcHbGxsQEBAUlJFRTY2NpMmJiYsbjU1NW1tbS4uLhAgLEZGCyUzMzNCQujo6GROXkLPk25uRUVFFRUVZGQlyxYW5eXle3l5JXvf398sQ5M=",
        3,
        14,
        52,
        31,
        2.97,
        0.53,
        0.0291
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "BAQAAQEBAAEDAwMAAQECAgICAgICAgICAgIBAQEDAwEBAAAAAQAAAAEAAAAAAgICAwMDBAQAAAAEAAAAAAEBAAAAAQEEAQIBAAAAAAACAgICAgACAgIAAAACAgIAAgAAAAMAAB9S3T8/PzSRKysrNEFBa2trxsbGBwcHbGxsQEBAMDBFRTY2NpcmJiaTOTU1NW1tbS4uLhAgP0ZGCyUzMzNCQujo6E5OXkLPk+fnRUVFFRUV1NQlyxYW5eXle3l5JXvf398sQ+I=",
        6,
        22,
        44,
        28,
        3.22,
        0.772,
        0.0245
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "BAQAAQEBAAEDAwMAAQECAgICAgICAgICAgIBAQEDAwEBAAAAAQAAAAAAAAAAAgICAwMDBAQAAAAEAAAAAAADAAAAAQEEAgIEAAAAAAACAgICAgACAgIAAAACAgIAAgAAAAMAAB9S3T8/PzSRKysrNEFBa2trxsbGBwcHbGxsQEBAMDBFRTY2NpcmJiY5OTU1NW1tbS4uLhAgP0ZGCyUzMzNEOOjo6E5OXtXPBefnRUVFFRUV1NQlyxYW5eXle3l5JXvf398sQ+I=",
        10,
        23,
        39,
        28,
        3.39,
        0.794,
        0.0236
      ]
    ]
  },
  "mono_blue_chrono": {
    "archetypeId": "mono_blue_chrono",
    "domain": "blue",
    "name": "Conclave Cronomante",
    "subtitle": "Mono-Azul ⚡ • Compra, Reações & Feitiços",
    "strategySummary": "Gera vantagem massiva de cartas, aciona gatilhos de conjuração arcana e neutraliza jogadas rivais com reações e devoluções.",
    "tacticalIdentity": "control",
    "coverCardId": "blue_45_oraculo_abissal",
    "generationsEvolved": 28,
    "matchesSimulated": 9072,
    "seedWinRate": 0.369,
    "championWinRate": 0.389,
    "championDeckJaccardStability": 0.905,
    "medianCardCi95HalfWidth": 0.18,
    "learnedProfile": {
      "deckId": "mono_blue_chrono",
      "deckName": "Conclave Cronomante",
      "archetypeTag": "control",
      "generationsTrained": 22,
      "matchesSimulated": 8268,
      "baselineWinRate": 0.369,
      "trainedWinRate": 0.389,
      "weights": {
        "aggroFaceBias": 0.94,
        "tradeValueBias": 1.3,
        "guardianPriority": 1,
        "flyingEvasionBias": 1,
        "stackConsolidationBias": 1,
        "antiAoeSpreadBias": 1,
        "spellHoldPatience": 1.31,
        "relicPriority": 1.12,
        "ascensionEagerness": 1,
        "bloodPactThresholdHp": 24,
        "domainExpansionEagerness": 1,
        "sovPowerTempoBias": 1,
        "synergyHoldBonus": 20,
        "mulliganCurveTarget": 3
      },
      "mk": [
        67,
        44,
        37,
        416,
        618
      ],
      "cp": [
        230,
        224,
        1011,
        717,
        403,
        618,
        219,
        330,
        529,
        630
      ],
      "ca": [
        37,
        224,
        226,
        1035
      ],
      "hb": [
        [
          37,
          24
        ],
        [
          218,
          6.5
        ],
        [
          222,
          8.1
        ],
        [
          224,
          9.9
        ],
        [
          226,
          24
        ],
        [
          1035,
          24
        ],
        [
          1055,
          11
        ],
        [
          1074,
          15.4
        ],
        [
          1088,
          11
        ],
        [
          1106,
          11
        ],
        [
          1124,
          11
        ]
      ],
      "sp": [
        [
          1035,
          224
        ],
        [
          224,
          226
        ],
        [
          1035,
          226
        ],
        [
          218,
          226
        ],
        [
          222,
          226
        ],
        [
          224,
          334
        ],
        [
          226,
          334
        ],
        [
          815,
          226
        ],
        [
          1035,
          334
        ],
        [
          222,
          224
        ]
      ],
      "dc": [
        [
          1035,
          226,
          0.875,
          0.486,
          8,
          " (88% WR em 8 duelos cruzados)"
        ],
        [
          1035,
          218,
          0.677,
          0.288,
          31,
          " (68% WR em 31 duelos cruzados)"
        ],
        [
          1035,
          224,
          0.611,
          0.222,
          18,
          " (61% WR em 18 duelos cruzados)"
        ],
        [
          218,
          226,
          0.563,
          0.173,
          48,
          " (56% WR em 48 duelos cruzados)"
        ],
        [
          815,
          226,
          0.556,
          0.166,
          9,
          " (56% WR em 9 duelos cruzados)"
        ],
        [
          1035,
          222,
          0.556,
          0.166,
          27,
          " (56% WR em 27 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        1035,
        0.2679,
        0.1517,
        0.1162,
        0.689,
        0.626,
        61
      ],
      [
        226,
        0.1262,
        0.0231,
        0.1031,
        0.533,
        0.357,
        90
      ],
      [
        1074,
        0.1209,
        0.0135,
        0.1074,
        0.53,
        0.399,
        83
      ],
      [
        218,
        0.0242,
        -0.0219,
        0.0461,
        0.418,
        0.093,
        440
      ],
      [
        1106,
        0.0152,
        -0.1063,
        0.1215,
        0.438,
        0.66,
        64
      ],
      [
        815,
        0.0009,
        -0.1631,
        0.164,
        0.429,
        0.768,
        35
      ],
      [
        224,
        -0.0287,
        -0.1058,
        0.0771,
        0.386,
        0.5,
        153
      ],
      [
        222,
        -0.0288,
        -0.0808,
        0.052,
        0.373,
        0.259,
        332
      ],
      [
        1088,
        -0.0349,
        -0.1594,
        0.1244,
        0.39,
        0.709,
        59
      ],
      [
        334,
        -0.0583,
        -0.2183,
        0.1601,
        0.371,
        0.808,
        35
      ],
      [
        1055,
        -0.1021,
        -0.2213,
        0.1192,
        0.322,
        0.696,
        59
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "AwMDBAQAAAAEAgIBAQECAgIAAAACAgIBAQEAAAAAAAAEAQEBBAQAAAQEBAQAAAABAQECAgIEAwMEAQQBAQMABAQEBAMDAAQEAAAAAAAAAAAAAgICAgQCAgICAgICAgICBAIDACoqKh9S2traQMjIPj4+BgYG29vbampqkpKSNTU1JiYmVEJCQlRUNDQfH1NT3t7ek5OTbW1tQPn5QE1STU35RVJkU2gsLDRoaDMzM0NDQ+jo6AkJCcpkysoRERF0dHTS0mTSLEU=",
        0,
        0,
        73,
        27,
        2.68,
        0.047,
        0.012
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "AwMDBAQAAAAEAgIBAQECAgIAAAACAgIBAQEDAQEAAAAEAQEBBAQAAAQEBAQAAAABAQECAgIEAwMEAQQBAQEBBAQEBAMDAAQEAAAAAAAAAAAAAgICAgQCAgICAgICAgICBAIDAioqKh9S2traQMjIPj4+BgYG29vbampqkpKSL0VFJiYmVEJCQlRUNDQfH1NT3t7ek5OTbW1tQPn5QE1STU2goFJkU2gsLDRoaDMzM0NDQ+jo6AkJCcpkysoRERF0dHTS0mTSLHk=",
        0,
        6,
        70,
        24,
        2.72,
        0.36,
        0.0283
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "AwMDBAQAAAAEAgIBAQECAgIAAAACAgIBAQEDAQEAAAAAAQEBBAQEBAQEAAAAAAABAQEEBAQCAAACAgQEBAEBBAQABAMDBAQEAAAAAAAAAAAAAAADAwQCAgICAgICAgICBAIDAioqKh9S2traQMjIPj4+BgYG29vbampqkpKSL0VFJiYm4kJCQlJSVFQfHzQ03t7ek5OTaGhobS0tbW0yQECgoAtkNFMsLFRTUzMzM0NDQ+jo6ObmNjZkdnYRERF0dHTS0mTSLHk=",
        3,
        14,
        59,
        24,
        2.87,
        0.53,
        0.0291
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "AwMDBAQAAAAEAgIBAQECAgIAAAACAgIBAQEDAQEAAAAAAQEBAwQEBAQEBAQAAAABAQEAAAAAAAABAQQBAQEBBAAEAAMDBAAAAAAAAAAAAAAAAAADAwICAgICAgICAgICBAIDAioqKh9S2traQMjIPj4+BgYG29vbampqkpKSL0VFJiYm4kJCQixSUlRTU1RU3t7ek5OTR0fr6y0tSkoyT0+goAs/ZDQsOGQ0NDMzM0NDQ+jo6ObmNjbVdnYRERF0dHTS0mTSLHk=",
        6,
        22,
        48,
        24,
        3,
        0.772,
        0.0245
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "AwMDBAQAAAAEAgIBAQECAgIAAAACAgIBAQEDAQEAAAAAAQEBAAACAgICAwMAAAABAQEAAAAAAAABAQQBAQEBBAAAAAADAQICAAAAAAAAAAAAAAADAwICAgICAgICAgICBAICAioqKh9S2traQMjIPj4+BgYG29vbampqkpKSL0VFJiYm4kJCQuDgzc3Ly/Pz3t7ek5OTR0fr6y0tSkoyT0+goAs/5+dEOE7U1DMzM0NDQ+jo6ObmNjbVdnYRERF0dHTS0mTSz3k=",
        8,
        35,
        35,
        22,
        3.26,
        0.794,
        0.0236
      ]
    ]
  },
  "mono_blue_abyssal": {
    "archetypeId": "mono_blue_abyssal",
    "domain": "blue",
    "name": "Frota Abissal",
    "subtitle": "Mono-Azul 🌊 • Voo, Alcance & Leviatãs",
    "strategySummary": "Combina batedores aéreos de Voo/Alcance na Retaguarda com leviatãs oceânicos colossais para pressão evasiva implacável.",
    "tacticalIdentity": "midrange",
    "coverCardId": "blue_06_dragao_azul",
    "generationsEvolved": 28,
    "matchesSimulated": 8500,
    "seedWinRate": 0.619,
    "championWinRate": 0.402,
    "championDeckJaccardStability": 0.869,
    "medianCardCi95HalfWidth": 0.0566,
    "learnedProfile": {
      "deckId": "mono_blue_abyssal",
      "deckName": "Frota Abissal",
      "archetypeTag": "midrange",
      "generationsTrained": 22,
      "matchesSimulated": 7696,
      "baselineWinRate": 0.619,
      "trainedWinRate": 0.402,
      "weights": {
        "aggroFaceBias": 1.18,
        "tradeValueBias": 1.12,
        "guardianPriority": 1,
        "flyingEvasionBias": 1.42,
        "stackConsolidationBias": 1,
        "antiAoeSpreadBias": 1,
        "spellHoldPatience": 1.05,
        "relicPriority": 1,
        "ascensionEagerness": 1,
        "bloodPactThresholdHp": 24,
        "domainExpansionEagerness": 1.22,
        "sovPowerTempoBias": 1,
        "synergyHoldBonus": 18,
        "mulliganCurveTarget": 3
      },
      "mk": [
        37,
        36,
        318,
        811,
        218
      ],
      "cp": [
        43,
        58,
        1023,
        811,
        70,
        622,
        406,
        54,
        715,
        36
      ],
      "ca": [
        36,
        41,
        54,
        58,
        70,
        406,
        525,
        626,
        811,
        816,
        1029,
        1035
      ],
      "hb": [
        [
          36,
          17.1
        ],
        [
          37,
          19.4
        ],
        [
          41,
          24
        ],
        [
          54,
          24
        ],
        [
          57,
          9.3
        ],
        [
          58,
          24
        ],
        [
          70,
          19.1
        ],
        [
          218,
          5.6
        ],
        [
          321,
          8.4
        ],
        [
          406,
          14.4
        ],
        [
          408,
          19
        ],
        [
          525,
          18.8
        ],
        [
          626,
          24
        ],
        [
          718,
          18.6
        ],
        [
          811,
          12.9
        ],
        [
          813,
          9.1
        ],
        [
          816,
          24
        ],
        [
          1005,
          13.5
        ],
        [
          1029,
          24
        ],
        [
          1035,
          24
        ],
        [
          1073,
          20
        ],
        [
          1074,
          20.7
        ],
        [
          1075,
          24
        ],
        [
          1088,
          11
        ],
        [
          1108,
          11
        ],
        [
          1118,
          20
        ]
      ],
      "sp": [
        [
          816,
          54
        ],
        [
          811,
          1035
        ],
        [
          816,
          1035
        ],
        [
          811,
          1029
        ],
        [
          36,
          1035
        ],
        [
          816,
          70
        ],
        [
          1029,
          221
        ],
        [
          1035,
          221
        ],
        [
          811,
          816
        ],
        [
          36,
          816
        ]
      ],
      "dc": [
        [
          36,
          1075,
          0.917,
          0.515,
          12,
          " (92% WR em 12 duelos cruzados)"
        ],
        [
          41,
          221,
          0.875,
          0.473,
          8,
          " (88% WR em 8 duelos cruzados)"
        ],
        [
          1074,
          58,
          0.875,
          0.473,
          8,
          " (88% WR em 8 duelos cruzados)"
        ],
        [
          41,
          406,
          0.875,
          0.473,
          8,
          " (88% WR em 8 duelos cruzados)"
        ],
        [
          1074,
          406,
          0.846,
          0.444,
          13,
          " (85% WR em 13 duelos cruzados)"
        ],
        [
          1075,
          218,
          0.846,
          0.444,
          13,
          " (85% WR em 13 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        1075,
        0.3223,
        0.1549,
        0.1674,
        0.76,
        0.719,
        25
      ],
      [
        1074,
        0.2368,
        0.1075,
        0.1293,
        0.654,
        0.307,
        52
      ],
      [
        1035,
        0.2291,
        0.0275,
        0.2016,
        0.667,
        0.716,
        21
      ],
      [
        70,
        0.2022,
        0.0415,
        0.1606,
        0.647,
        0.863,
        34
      ],
      [
        408,
        0.1998,
        -0.0512,
        0.251,
        0.643,
        0.827,
        14
      ],
      [
        718,
        0.1903,
        0.0369,
        0.1534,
        0.632,
        0.791,
        38
      ],
      [
        41,
        0.1801,
        0.0307,
        0.1493,
        0.61,
        0.559,
        41
      ],
      [
        58,
        0.1348,
        0.0338,
        0.1009,
        0.559,
        0.453,
        93
      ],
      [
        816,
        0.1038,
        0.0064,
        0.0974,
        0.525,
        0.384,
        101
      ],
      [
        1005,
        0.0768,
        0.0009,
        0.0758,
        0.497,
        0.37,
        167
      ],
      [
        36,
        0.0748,
        0.0224,
        0.0524,
        0.481,
        0.096,
        349
      ],
      [
        54,
        0.0523,
        -0.0066,
        0.0589,
        0.458,
        0.083,
        275
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "BAAAAQEBAAAAAAAAAQEBAwMDAAICAQEBAwMAAAAAAAACAgQBAQQAAgIBAwQEAAADAwMDAwICAQIAAAQEBAAEBAQEAwABAQMCAgIAAAAAAAEBAQQEAgICAAEBBAQCAgMDAAEEAEDd3ZSUlCQkJNra2pGRkSsrK9/IyEFBQS0s39zcJiYmCQlUQ0NUMm1tkyxTU9zeLi4u+fkJypVtNDRAU1IyQFJUUvkyQ5Msb29vNjY23zRCQkJoaG5ubiuVlWpqysotLSuTais=",
        0,
        0,
        85,
        15,
        3.08,
        0.047,
        0.012
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "BAAAAQEBAAAAAAAAAQEBAwMDAAICAQEBAwMAAQEAAAACAgQBAQQAAgIBAwQEAgIDAwMDAwICAQIAAAQEBAAEBAQEAwABAQMCAgIAAAAAAAEBAQQEAgICAAEBBAQCAgMDAAEEAEDd3ZSUlCQkJNra2pGRkSsrK9/IyEFBQS3t30VFJiYmCQlUQ0NUMm1tkyxTU8vLLi4u+fkJypVtNDRAU1IyQFJUUvkyQ5Ptb29vNjY23zRCQkJoaG5ubiuVlWpqysotLSuTais=",
        0,
        6,
        82,
        12,
        3.12,
        0.36,
        0.0283
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "BAAAAQEBAAAAAAAAAQEBAwMDAAICAQEBAwMAAQEAAAACAgQAAAQEAAECAgQEAgIDAwMBAQICAAABAAQEBAAEBAQEAgQAAgMCAgIAAAABAQEBAQAAAgICAAEBBAQCAgMDAAEAAEDd3ZSUlCQkJNra2pGRkSsrK9/IyEFBQS3t30VFJiYmbW1UMjJUUjSVzc1TU8vLLi4ulpZtCTQ0Q99AUzIpQF5UUspSMnDtb29vNjY2Q0NCQkJGRm5ubiuVlWpqCQktLSuT6ys=",
        3,
        14,
        71,
        12,
        3.29,
        0.53,
        0.0291
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "BAAAAQEBAAAAAAAAAQEBAwMDAAICAQEBAwMAAQEAAAAAAAQEBAQEAAACAgQEAgIDAwMBAQMDAQEAAQQEBAAEBAQEAgQEAgMCAgIAAAAAAAEBAQAAAgICAAEBAQEDAwMDAQEAAEDd3ZSUlCQkJNra2pGRkSsrK9/IyEFBQS3t30VFJiYmNDRUUlJUQN80zc1TU8vLLi4ulpbz80NDMkMLUzIpMV5UMwtAUnDtb29vNjY2MjJCQkJGRm5ubiuVlU9P//8tLaCT6ys=",
        6,
        22,
        60,
        12,
        3.48,
        0.772,
        0.0245
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "BAAAAQEBAAAAAAAAAQEBAwMDAAICAQEBAwMAAQEAAAADAwQAAAQAAAACAgIBAgIDAwMBAQMDAAABAQQBBAAEBAIEAgICAgMCAgIAAAAAAAEBAQAAAgICAQEBAQEDAwMDAQEAAUDd3ZSUlCQkJNra2pGRkSsrK9/IyEFBQS3t30VFJiYmMDBUOjpU4Dk5zc0Ml8vLLi4ulpbz8ygoREQLmDIpMV7PMwvOznDtb29vNjY2PDxCQkJGRm5ubk6VlU9P//8tLaCT604=",
        10,
        39,
        39,
        12,
        3.87,
        0.794,
        0.0236
      ]
    ]
  },
  "mono_purple_crypt": {
    "archetypeId": "mono_purple_crypt",
    "domain": "purple",
    "name": "Guardiões da Cripta",
    "subtitle": "Mono-Roxo 💀 • Renascer & Reanimação",
    "strategySummary": "Transforma a Cripta em recurso infinito com tropas de Renascer, gatilhos de Último Suspiro e feitiços de reanimação.",
    "tacticalIdentity": "attrition",
    "coverCardId": "purple_99_lorde_vampiro_anciao",
    "generationsEvolved": 28,
    "matchesSimulated": 7188,
    "seedWinRate": 0.667,
    "championWinRate": 0.438,
    "championDeckJaccardStability": 0.852,
    "medianCardCi95HalfWidth": 0.0473,
    "learnedProfile": {
      "deckId": "mono_purple_crypt",
      "deckName": "Guardiões da Cripta",
      "archetypeTag": "attrition",
      "generationsTrained": 22,
      "matchesSimulated": 6384,
      "baselineWinRate": 0.667,
      "trainedWinRate": 0.438,
      "weights": {
        "aggroFaceBias": 1.05,
        "tradeValueBias": 1.31,
        "guardianPriority": 0.97,
        "flyingEvasionBias": 1,
        "stackConsolidationBias": 1,
        "antiAoeSpreadBias": 1,
        "spellHoldPatience": 0.95,
        "relicPriority": 1.07,
        "ascensionEagerness": 1.01,
        "bloodPactThresholdHp": 24,
        "domainExpansionEagerness": 1.22,
        "sovPowerTempoBias": 0.98,
        "synergyHoldBonus": 29,
        "mulliganCurveTarget": 2.9
      },
      "mk": [
        743,
        1015,
        84,
        101,
        636
      ],
      "cp": [
        1009,
        839,
        443,
        99,
        101,
        735,
        452,
        636,
        838,
        90
      ],
      "ca": [
        76,
        84,
        101,
        103,
        346,
        446,
        545,
        731,
        735,
        741,
        839,
        1015
      ],
      "hb": [
        [
          76,
          19.9
        ],
        [
          84,
          12.8
        ],
        [
          89,
          8.1
        ],
        [
          93,
          8.3
        ],
        [
          99,
          15.2
        ],
        [
          101,
          17.2
        ],
        [
          103,
          22.3
        ],
        [
          236,
          8.2
        ],
        [
          346,
          21.9
        ],
        [
          349,
          9.5
        ],
        [
          352,
          24
        ],
        [
          446,
          24
        ],
        [
          452,
          16.9
        ],
        [
          453,
          21.9
        ],
        [
          545,
          24
        ],
        [
          547,
          8.5
        ],
        [
          636,
          7.8
        ],
        [
          644,
          15.4
        ],
        [
          731,
          9.8
        ],
        [
          735,
          16.5
        ],
        [
          741,
          19
        ],
        [
          839,
          24
        ],
        [
          843,
          6.8
        ],
        [
          1015,
          10.8
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
          1042,
          15
        ],
        [
          1053,
          18.7
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
          545,
          84
        ],
        [
          545,
          89
        ],
        [
          545,
          636
        ],
        [
          545,
          1015
        ],
        [
          83,
          446
        ],
        [
          76,
          839
        ],
        [
          731,
          1033
        ],
        [
          839,
          89
        ],
        [
          642,
          446
        ],
        [
          636,
          839
        ]
      ],
      "dc": [
        [
          89,
          103,
          1,
          0.562,
          9,
          " (100% WR em 9 duelos cruzados)"
        ],
        [
          545,
          636,
          0.917,
          0.479,
          12,
          " (92% WR em 12 duelos cruzados)"
        ],
        [
          642,
          1033,
          0.9,
          0.462,
          10,
          " (90% WR em 10 duelos cruzados)"
        ],
        [
          735,
          1033,
          0.9,
          0.462,
          10,
          " (90% WR em 10 duelos cruzados)"
        ],
        [
          1015,
          346,
          0.889,
          0.451,
          9,
          " (89% WR em 9 duelos cruzados)"
        ],
        [
          545,
          735,
          0.889,
          0.451,
          9,
          " (89% WR em 9 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        352,
        0.3704,
        0.1112,
        0.2592,
        0.857,
        0.978,
        7
      ],
      [
        103,
        0.2732,
        0.1249,
        0.1483,
        0.735,
        0.485,
        34
      ],
      [
        453,
        0.2647,
        0.0197,
        0.245,
        0.75,
        0.95,
        12
      ],
      [
        545,
        0.2451,
        0.1059,
        0.1393,
        0.707,
        0.487,
        41
      ],
      [
        1033,
        0.2388,
        0.0856,
        0.1532,
        0.706,
        0.585,
        34
      ],
      [
        346,
        0.2051,
        0.0651,
        0.1401,
        0.659,
        0.323,
        44
      ],
      [
        1053,
        0.1931,
        0.0506,
        0.1426,
        0.667,
        0.714,
        42
      ],
      [
        741,
        0.1653,
        -0.0072,
        0.1724,
        0.633,
        0.605,
        30
      ],
      [
        452,
        0.1529,
        -0.0481,
        0.201,
        0.636,
        0.913,
        22
      ],
      [
        446,
        0.1516,
        -0.0117,
        0.1633,
        0.618,
        0.564,
        34
      ],
      [
        644,
        0.1206,
        -0.0047,
        0.1253,
        0.593,
        0.696,
        59
      ],
      [
        99,
        0.115,
        -0.1886,
        0.3036,
        0.6,
        0.944,
        10
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "AAAAAAAAAwICAgQBAQAAAAAAAAMDAwICAgEEAQQDAwMEBAMEBAQCAwQCAgIEAgAAAAICAgQEAgIEBAQEBAAEAgICBAQCBAEBAQAAAAMDAwEBAQMDAAAAAAACAAACAQACAQACAlRUVFNTUz98fHx9xMRISEjs7OxAQEDb29vEflFG9/f3Rn4/YWJif0Jj39/fYn9ZWVmCgoJhYefnRmNjfX1Rft3d3Xx853xgYGBlZWVLS0tTU1NCQu/v71H4iFH4iFz4iFxbf+o=",
        0,
        0,
        76,
        24,
        2.8,
        0.015,
        0.0096
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "AAAAAAAAAwICAgQBAQAAAAAAAAMDAwICAgEEAQQDAwMEBAMEBAQCAwQCAgIEAgAAAAICAgQEAgIEBAQEBAABAQQEBAQCBAEBAQAAAAMDAwEBAQMDAAAAAAACAAACAQACAQQCAlRUVFNTUz98fHx9xMRISEjs7OxAQEDb29vEflFG9/f3RhI/YWJif0Jj39/fYn9ZWVmCgoJhYefnRmNjfX1RxcV/HXx853xgYGBlZWVLS0tTU1NCQu/v71H4iFH4iFz4iFwdf+o=",
        0,
        6,
        70,
        24,
        2.83,
        0.362,
        0.0292
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "AAAAAAAAAwICAgQBAQAAAAAAAAMDAwICAgEEAQQDAwMEBAMCBAQEBAQCAgIEBAAAAAICAgQEAgAEBAQEBAABAQQEAQECAgEBAQAAAAMDAwEBAQAAAAAAAAACAAACAQACAQQCAlRUVFNTUz98fHx9xMRISEjs7OxAQEDb29vEElFG9/f3RhI/IGFhYmJj39/fYWJZWVmCgoIJXedjRmNjfX1RxcV/HV1dIyNgYGBlZWVLS0tTU1NMTO/v71H4iFH4iFz4iFwdf+o=",
        3,
        14,
        59,
        24,
        2.99,
        0.635,
        0.0286
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "AAAAAAAAAwICAgQBAQAAAAAAAAMDAwICAgEEAQEDAwMEBAMCBAQCAgQCAgIEAgAAAAICAgQEAAACBAQAAAABAQQEAQECAgEBAQAAAAMDAwEBAQAAAAAAAQACAQACAQACAQQCAlRUVFNTUz98fHx9xMRISEjs7OxAQEDb29vEElFa9/f3RhI/IEZGhIRj39/fYeJZWVmCgoIJXWNjIWNjZ/r6xcV/HV1dIyNgYGBlZWVLS0tTU1NMTO/v7174iF74iFz4iFwdf+o=",
        6,
        22,
        48,
        24,
        3.21,
        0.709,
        0.027
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "AAAAAAAAAwICAgQBAQAAAAAAAAMDAwICAgEEAQEDAwMABAMCAAACAgECAgICAgAAAAICAgQEAAACAgEAAAABAQQEAQECAgEBAQAAAAMDAwEBAQAAAAAAAQACAQACAQACAQQCAlRUVFNTUz98fHx9xMRISEjs7OxAQEDb29vEElFa9/f39RI/IF1dhIRY39/f4uJZWVmCgoIJXWNjIeW+Z/r6xcV/HV1dIyNgYGBlZWVLS0tTU1NMTO/v7174iF74iFz4iFwdf+o=",
        10,
        25,
        41,
        24,
        3.4,
        0.779,
        0.0245
      ]
    ]
  },
  "mono_purple_blood": {
    "archetypeId": "mono_purple_blood",
    "domain": "purple",
    "name": "Tributo Vital",
    "subtitle": "Mono-Roxo ⚡ • Dreno de Vida & Toque Letal",
    "strategySummary": "Sustenta Sacrifício Vital e Sobrecarga convertendo vida drenada em pressão letal com vampiros e assassinos de Toque Letal.",
    "tacticalIdentity": "aggro",
    "coverCardId": "purple_46_noiva_vampira",
    "generationsEvolved": 28,
    "matchesSimulated": 7820,
    "seedWinRate": 0.524,
    "championWinRate": 0.336,
    "championDeckJaccardStability": 0.905,
    "medianCardCi95HalfWidth": 0.0341,
    "learnedProfile": {
      "deckId": "mono_purple_blood",
      "deckName": "Tributo Vital",
      "archetypeTag": "aggro",
      "generationsTrained": 22,
      "matchesSimulated": 7016,
      "baselineWinRate": 0.524,
      "trainedWinRate": 0.336,
      "weights": {
        "aggroFaceBias": 1.28,
        "tradeValueBias": 1.15,
        "guardianPriority": 1,
        "flyingEvasionBias": 1,
        "stackConsolidationBias": 1,
        "antiAoeSpreadBias": 1,
        "spellHoldPatience": 1,
        "relicPriority": 1,
        "ascensionEagerness": 1.2,
        "bloodPactThresholdHp": 18,
        "domainExpansionEagerness": 1,
        "sovPowerTempoBias": 1,
        "synergyHoldBonus": 20,
        "mulliganCurveTarget": 2.7
      },
      "mk": [
        101,
        236,
        1015,
        336,
        733,
        830,
        242
      ],
      "cp": [
        832,
        644,
        242,
        236,
        336,
        734,
        1015,
        536,
        540,
        440
      ],
      "ca": [
        76,
        83,
        93,
        94,
        101,
        236,
        242,
        245,
        246,
        336,
        446,
        545
      ],
      "hb": [
        [
          76,
          24
        ],
        [
          83,
          12.2
        ],
        [
          93,
          20.4
        ],
        [
          94,
          24
        ],
        [
          99,
          15.6
        ],
        [
          101,
          24
        ],
        [
          236,
          16.1
        ],
        [
          242,
          10.2
        ],
        [
          245,
          17.4
        ],
        [
          246,
          24
        ],
        [
          252,
          17.3
        ],
        [
          336,
          11.2
        ],
        [
          446,
          24
        ],
        [
          536,
          7
        ],
        [
          545,
          24
        ],
        [
          644,
          23.3
        ],
        [
          646,
          24
        ],
        [
          653,
          15.8
        ],
        [
          731,
          12.4
        ],
        [
          732,
          16
        ],
        [
          733,
          16.2
        ],
        [
          741,
          24
        ],
        [
          830,
          12.4
        ],
        [
          834,
          14.6
        ],
        [
          838,
          15.7
        ],
        [
          1015,
          19.1
        ],
        [
          1027,
          22.9
        ],
        [
          1033,
          24
        ],
        [
          1117,
          20
        ],
        [
          1121,
          11
        ],
        [
          1123,
          11
        ],
        [
          1145,
          11
        ],
        [
          1149,
          11
        ]
      ],
      "sp": [
        [
          646,
          83
        ],
        [
          1015,
          1033
        ],
        [
          1033,
          242
        ],
        [
          733,
          446
        ],
        [
          1015,
          446
        ],
        [
          83,
          1033
        ],
        [
          76,
          246
        ],
        [
          76,
          1033
        ],
        [
          830,
          446
        ],
        [
          76,
          446
        ]
      ],
      "dc": [
        [
          242,
          446,
          1,
          0.664,
          8,
          " (100% WR em 8 duelos cruzados)"
        ],
        [
          94,
          242,
          0.9,
          0.564,
          10,
          " (90% WR em 10 duelos cruzados)"
        ],
        [
          86,
          536,
          0.9,
          0.564,
          10,
          " (90% WR em 10 duelos cruzados)"
        ],
        [
          93,
          245,
          0.875,
          0.539,
          8,
          " (88% WR em 8 duelos cruzados)"
        ],
        [
          834,
          544,
          0.875,
          0.539,
          8,
          " (88% WR em 8 duelos cruzados)"
        ],
        [
          1015,
          99,
          0.875,
          0.539,
          8,
          " (88% WR em 8 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        94,
        0.3347,
        0.1948,
        0.1398,
        0.69,
        0.4,
        42
      ],
      [
        1033,
        0.3263,
        0.1382,
        0.188,
        0.696,
        0.671,
        23
      ],
      [
        644,
        0.2958,
        0.0781,
        0.2178,
        0.667,
        0.7,
        18
      ],
      [
        1027,
        0.2858,
        -0.0914,
        0.3772,
        0.667,
        0.902,
        6
      ],
      [
        446,
        0.2269,
        0.0416,
        0.1853,
        0.593,
        0.597,
        27
      ],
      [
        1015,
        0.2022,
        0.1226,
        0.0796,
        0.564,
        0.515,
        149
      ],
      [
        646,
        0.1733,
        -0.0183,
        0.1916,
        0.538,
        0.587,
        26
      ],
      [
        252,
        0.1626,
        -0.1317,
        0.2943,
        0.545,
        0.941,
        11
      ],
      [
        732,
        0.1328,
        0.0196,
        0.1132,
        0.507,
        0.762,
        75
      ],
      [
        99,
        0.1255,
        -0.0477,
        0.1732,
        0.5,
        0.773,
        32
      ],
      [
        653,
        0.1175,
        -0.1444,
        0.2619,
        0.5,
        0.933,
        14
      ],
      [
        834,
        0.102,
        0.0371,
        0.0649,
        0.451,
        0.271,
        226
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "AAAAAgICBAQEAQEBAAAAAgICBAICAQEBAwMDAQEBAAAAAwMDAgIDAwMBAQEDAwIAAgAAAAIEBAICAgQCBAAAAAEBAQECAgACAgQCAgIBAQEAAAACAgIBBAAAAAICAgAAAAIDAOzs7Nvb22FjfVFRUVNTU9zc3HkYGFBQUD4+PrW1tUlJSUJCQhkZ9/f3uLi4QUEZ8H9K8PCARkbd3d1hgGFqamq5VFRUiIj4iH9j3t7eublcSkr4HBwcXGPy8vIbGxtWVlaAQfg=",
        0,
        0,
        67,
        33,
        2.58,
        0.015,
        0.0096
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "AAAAAgICBAQEAQEBAAAAAgICBAICAQEBAwMDAQEBAAAAAwMDAgIDAwMBAQEDAwIAAgAAAAIDAwICAgQCBAAAAAEBAQECAgACAgQCAgIBAQAAAAACAgIABAAAAAICAgAAAAIDAOzs7Nvb22FjfVFRUVNTU9zc3HkYGFBQUD4+PrW1tUlJSUJCQhkZ9/f3uLi4QUEZ8H9K8PCA6+vd3d1hgGFqamq5VFRUjY34iH9j3t7eubn8Skr4HBwc/GPy8vIbGxtWVlaAQfg=",
        0,
        6,
        61,
        33,
        2.62,
        0.362,
        0.0292
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "AAAAAgICBAQEAQEBAAAAAgICBAICAQEBAwMDAQEBAAAAAwMDAwMDAwMBAQECAgAAAgICAgADAwICAgQEBAAAAAEBAQECAgACAgQCAgIBAAACAgACAgIABAAAAAICAgAAAAECAOzs7Nvb22FjfVFRUVNTU9zc3HkYGFBQUD4+PrW1tUlJSUJCQkFG9/f3uLi4gIBMTH+E4eH16+vd3d1hXWFqamq5VFRUjY34iH9j3t7euV78Hh74HBwc/GPy8vIbGxtWVla5gPg=",
        3,
        14,
        56,
        27,
        2.87,
        0.635,
        0.0286
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "AAAAAgICBAQEAQEBAAAAAgICBAICAQEBAwMDAQEBAAAAAwMDAwMDAwMBAQEAAAAAAgICAgADAwICAgQEBAAAAAEBAQECAgAAAgQCAgICAAACAgMCAgIABAAAAAICAgAAAAMDAOzs7Nvb22FjfVFRUVNTU9zc3HkYGFBQUD4+PrW1tUlJSUJCQkZG9/f3uLi4XV1MTH+E4eH16+vd3d1hXWFqamq+VFRUjY1jY39j3t7eIF78Hh5NHBwc/GPy8vIbGxtWVlZFRfo=",
        6,
        22,
        45,
        27,
        3.16,
        0.709,
        0.027
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "AAAAAgICBAQEAQEBAAAAAgICBAICAQEBAwMDAQEBAAAAAwMDAwMDAwMBAQEAAAAAAgICAgADAwICAgQEAgAAAAEBAQECAgAAAgQCAgICAAACAgMCAgIAAgAAAAICAgAAAAMDAOzs7Nvb22FjfVFRUVNTU9zc3HkYGFBQUD4+PrW1tUlJSUJCQkZG9/f3uLi4XV1MTH+E4eH16+vd3d0JXeVqamq+VFRUjY1jY38D3t7eIF78Hh5NHBwc/Iby8vIbGxtWVlZFRfo=",
        10,
        22,
        41,
        27,
        3.33,
        0.779,
        0.0245
      ]
    ]
  },
  "mono_purple_umbral": {
    "archetypeId": "mono_purple_umbral",
    "domain": "purple",
    "name": "Inquisição Umbral",
    "subtitle": "Mono-Roxo 🌑 • Destruição, Debuff & Controle",
    "strategySummary": "Aniquila ameaças-chave com destruição direta, drena o ATQ da Vanguarda inimiga e domina o fim de jogo com lordes abissais.",
    "tacticalIdentity": "control",
    "coverCardId": "purple_65_principe_mortos",
    "generationsEvolved": 28,
    "matchesSimulated": 7960,
    "seedWinRate": 0.452,
    "championWinRate": 0.428,
    "championDeckJaccardStability": 0.887,
    "medianCardCi95HalfWidth": 0.0371,
    "learnedProfile": {
      "deckId": "mono_purple_umbral",
      "deckName": "Inquisição Umbral",
      "archetypeTag": "control",
      "generationsTrained": 22,
      "matchesSimulated": 7156,
      "baselineWinRate": 0.452,
      "trainedWinRate": 0.428,
      "weights": {
        "aggroFaceBias": 0.92,
        "tradeValueBias": 1.36,
        "guardianPriority": 1,
        "flyingEvasionBias": 0.99,
        "stackConsolidationBias": 1,
        "antiAoeSpreadBias": 1,
        "spellHoldPatience": 1.28,
        "relicPriority": 1.11,
        "ascensionEagerness": 1,
        "bloodPactThresholdHp": 24,
        "domainExpansionEagerness": 1,
        "sovPowerTempoBias": 1,
        "synergyHoldBonus": 19,
        "mulliganCurveTarget": 3.1
      },
      "mk": [
        105,
        842,
        82,
        638,
        236
      ],
      "cp": [
        842,
        76,
        99,
        837,
        732,
        240,
        452,
        832,
        74,
        834
      ],
      "ca": [
        76,
        82,
        93,
        99,
        103,
        105,
        236,
        243,
        245,
        346,
        349,
        452
      ],
      "hb": [
        [
          76,
          24
        ],
        [
          82,
          20.4
        ],
        [
          92,
          9.2
        ],
        [
          93,
          19
        ],
        [
          94,
          22.1
        ],
        [
          99,
          24
        ],
        [
          101,
          17.5
        ],
        [
          103,
          16.2
        ],
        [
          105,
          16.2
        ],
        [
          236,
          8.8
        ],
        [
          240,
          7.9
        ],
        [
          243,
          10.9
        ],
        [
          245,
          20.7
        ],
        [
          346,
          24
        ],
        [
          349,
          16.3
        ],
        [
          452,
          17.1
        ],
        [
          536,
          11.9
        ],
        [
          547,
          15.6
        ],
        [
          638,
          10.6
        ],
        [
          653,
          17.9
        ],
        [
          731,
          5.9
        ],
        [
          732,
          16.9
        ],
        [
          736,
          24
        ],
        [
          741,
          16.2
        ],
        [
          837,
          17.2
        ],
        [
          838,
          18
        ],
        [
          840,
          24
        ],
        [
          997,
          14.2
        ],
        [
          1033,
          24
        ],
        [
          1082,
          14.8
        ],
        [
          1117,
          20
        ],
        [
          1122,
          11
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
          840,
          349
        ],
        [
          638,
          840
        ],
        [
          736,
          840
        ],
        [
          76,
          349
        ],
        [
          736,
          99
        ],
        [
          840,
          105
        ],
        [
          736,
          1033
        ],
        [
          99,
          452
        ],
        [
          736,
          103
        ],
        [
          838,
          93
        ]
      ],
      "dc": [
        [
          638,
          99,
          0.929,
          0.501,
          14,
          " (93% WR em 14 duelos cruzados)"
        ],
        [
          731,
          99,
          0.923,
          0.495,
          13,
          " (92% WR em 13 duelos cruzados)"
        ],
        [
          1033,
          98,
          0.909,
          0.481,
          11,
          " (91% WR em 11 duelos cruzados)"
        ],
        [
          99,
          349,
          0.909,
          0.481,
          11,
          " (91% WR em 11 duelos cruzados)"
        ],
        [
          736,
          99,
          0.889,
          0.461,
          18,
          " (89% WR em 18 duelos cruzados)"
        ],
        [
          732,
          349,
          0.889,
          0.461,
          9,
          " (89% WR em 9 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        99,
        0.3765,
        0.2684,
        0.1081,
        0.841,
        0.732,
        44
      ],
      [
        1033,
        0.2903,
        0.1489,
        0.1415,
        0.75,
        0.636,
        36
      ],
      [
        94,
        0.2682,
        -0.0664,
        0.3347,
        0.714,
        0.364,
        7
      ],
      [
        840,
        0.2441,
        0.0623,
        0.1818,
        0.708,
        0.727,
        24
      ],
      [
        653,
        0.1763,
        -0.0328,
        0.209,
        0.65,
        0.917,
        20
      ],
      [
        732,
        0.1526,
        0.0355,
        0.117,
        0.621,
        0.816,
        66
      ],
      [
        76,
        0.1307,
        0.0632,
        0.0674,
        0.563,
        0.08,
        208
      ],
      [
        736,
        0.1153,
        0.0435,
        0.0718,
        0.554,
        0.224,
        184
      ],
      [
        349,
        0.1125,
        0.0315,
        0.081,
        0.563,
        0.442,
        144
      ],
      [
        1082,
        0.1056,
        -0.0284,
        0.134,
        0.547,
        0.274,
        53
      ],
      [
        346,
        0.0989,
        -0.0242,
        0.1231,
        0.54,
        0.259,
        63
      ],
      [
        997,
        0.0923,
        -0.0432,
        0.1355,
        0.538,
        0.366,
        52
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "BAQBAAAAAwMDAgICAQEBAAAAAgICAgICAgICAAAAAQEAAAACAQAAAAAAAAADAwMCAgICAgAAAgEBBAQAAAAAAAICAgAAAAQAAgQBAAAAAAIBAQIBAAAAAgICAAAAAgEBAQIEAGJ9xOzs7EBAQNvb21FRUVNTU35+ftzc3BgYGFtZWVRU8PDwHVNKSkpLS1dXQkJCHR2CHBxZS4LAwH19aWlpVVUiIiJqampiW4JjwGJiYlHnU1PnVPj4+IiIiFFRVRzEXFznYls=",
        0,
        0,
        70,
        30,
        2.83,
        0.015,
        0.0096
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "BAQBAAAAAwMDAgICAQEBAAAAAgICAgICAgICAAAAAAAAAAACAQAAAAAAAAADAwMCAgICAgAAAgEBBAQAAAAAAAICAgAAAAQAAgQBAAAAAAIBAQEBAAAAAgICAAAAAgEBAQIEAGJ9xOzs7EBAQNvb21FRUVNTU35+ftzc3BgYGFtZWUxM8PDwHVNKSkpLS1dXQkJCHR2CHBxZS4LAwH19aWlpVVUiIiJqampiW4J/wGJiYlGNU1NeXvj4+IiIiFFRVRzEXFznYls=",
        0,
        6,
        64,
        30,
        2.88,
        0.362,
        0.0292
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "BAQBAAAAAwMDAgICAQEBAAAAAgICAgICAgICAAICAAAAAAAAAgAAAAAAAAADAwMAAAECAgIABAEBBAQAAAABAgICAgAAAAQABAQBAAAAAgICAgEBAAAAAgICAQECAgEBAQIEAGJ9xOzs7EBAQNvb21FRUVNTU35+ftzc3BgYGFuCgkxM8PDwSx1KSkpZWVdXQkJCS0ta4OCCWQnAwH19aWlpUykiIiJqampiW11/wGJiYo2NHR1eXvj4+IiIiF1dIyPEXFznYls=",
        3,
        14,
        56,
        27,
        3.05,
        0.635,
        0.0286
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "BAQBAAAAAwMDAgICAQEBAAAAAgICAgICAgICAAACAAAAAAAAAAAAAAAAAAADAwMAAwECAgICBAAAAwAAAAACAgICAgAAAAQABAQEAAAAAgIAAAEBAAAAAgICAQECAgEBAQIEBGJ9xOzs7EBAQNvb21FRUVNTU35+ftzc3BgYGFtbgkxM8PDw8/NKSkpZWVdXQkJCWUVa4OCCgglmZk1naWlpKSkiIiJqampiW11/fWJiYo2NY2NeXvj4+IiIiF1dIyPEXFznYjo=",
        6,
        22,
        45,
        27,
        3.2,
        0.709,
        0.027
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "BAQBAAAAAwMDAgICAQEBAAAAAgICAgICAgICAwAAAAAAAAAAAAAAAAMDAAADAwMDAwECAgAABAAAAwAAAAACAgICAgAAAAMCBAQAAAAAAgIAAAEBAAAAAgICAQECAgEBAQIABGJ9xOzs7EBAQNvb21FRUVNTU35+ftzc3BgYGOVcXExM8PDw8/NKSkpGRldXQkJCRUVa4OBdXQlmZk1naWlpKSkiIiJqampI5V1/+mJiYo2NY2NeXvj4+IiIiF1dIyPEXFznXjo=",
        10,
        30,
        33,
        27,
        3.46,
        0.779,
        0.0245
      ]
    ]
  },
  "mono_gold_phalanx": {
    "archetypeId": "mono_gold_phalanx",
    "domain": "gold",
    "name": "Falange Impenetrável",
    "subtitle": "Mono-Dourado 🛡️ • Guardião, Armadura & Bastião",
    "strategySummary": "Forma linhas blindadas de Guardiões com alta Armadura e estandartes de comando que anulam investidas agressivas.",
    "tacticalIdentity": "midrange",
    "coverCardId": "gold_83_forjado_ancestral",
    "generationsEvolved": 28,
    "matchesSimulated": 7264,
    "seedWinRate": 0.583,
    "championWinRate": 0.407,
    "championDeckJaccardStability": 0.905,
    "medianCardCi95HalfWidth": 0.0513,
    "learnedProfile": {
      "deckId": "mono_gold_phalanx",
      "deckName": "Falange Impenetrável",
      "archetypeTag": "midrange",
      "generationsTrained": 22,
      "matchesSimulated": 6460,
      "baselineWinRate": 0.583,
      "trainedWinRate": 0.407,
      "weights": {
        "aggroFaceBias": 1.01,
        "tradeValueBias": 1.26,
        "guardianPriority": 1.42,
        "flyingEvasionBias": 1,
        "stackConsolidationBias": 1.22,
        "antiAoeSpreadBias": 1,
        "spellHoldPatience": 0.98,
        "relicPriority": 0.98,
        "ascensionEagerness": 1,
        "bloodPactThresholdHp": 24,
        "domainExpansionEagerness": 1.01,
        "sovPowerTempoBias": 0.95,
        "synergyHoldBonus": 19,
        "mulliganCurveTarget": 2.8
      },
      "mk": [
        278,
        421,
        272,
        870,
        145
      ],
      "cp": [
        380,
        777,
        679,
        421,
        424,
        164,
        146,
        876,
        878,
        163
      ],
      "ca": [
        145,
        147,
        272,
        278,
        282,
        381,
        382,
        421,
        428,
        572,
        580,
        581
      ],
      "hb": [
        [
          145,
          14.2
        ],
        [
          147,
          13
        ],
        [
          151,
          12
        ],
        [
          163,
          14
        ],
        [
          173,
          20.7
        ],
        [
          272,
          14.8
        ],
        [
          278,
          20.5
        ],
        [
          280,
          15.4
        ],
        [
          282,
          14.9
        ],
        [
          380,
          14.3
        ],
        [
          381,
          19.6
        ],
        [
          382,
          20.6
        ],
        [
          421,
          17.9
        ],
        [
          428,
          20.4
        ],
        [
          572,
          11.2
        ],
        [
          580,
          22.6
        ],
        [
          581,
          20.4
        ],
        [
          682,
          19.6
        ],
        [
          780,
          10.9
        ],
        [
          781,
          17.9
        ],
        [
          870,
          17.7
        ],
        [
          871,
          7.5
        ],
        [
          880,
          24
        ],
        [
          881,
          16.9
        ],
        [
          1031,
          24
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
          1051,
          20
        ],
        [
          1067,
          14.8
        ],
        [
          1068,
          17.8
        ],
        [
          1119,
          20
        ]
      ],
      "sp": [
        [
          870,
          1037
        ],
        [
          1037,
          278
        ],
        [
          147,
          1037
        ],
        [
          382,
          421
        ],
        [
          581,
          278
        ],
        [
          1037,
          421
        ],
        [
          682,
          870
        ],
        [
          421,
          580
        ],
        [
          581,
          421
        ],
        [
          871,
          580
        ]
      ],
      "dc": [
        [
          373,
          382,
          1,
          0.593,
          9,
          " (100% WR em 9 duelos cruzados)"
        ],
        [
          581,
          870,
          1,
          0.593,
          9,
          " (100% WR em 9 duelos cruzados)"
        ],
        [
          145,
          280,
          1,
          0.593,
          10,
          " (100% WR em 10 duelos cruzados)"
        ],
        [
          780,
          381,
          0.923,
          0.516,
          13,
          " (92% WR em 13 duelos cruzados)"
        ],
        [
          145,
          282,
          0.889,
          0.482,
          9,
          " (89% WR em 9 duelos cruzados)"
        ],
        [
          278,
          382,
          0.875,
          0.468,
          8,
          " (88% WR em 8 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        173,
        0.2377,
        -0.0132,
        0.2509,
        0.692,
        0.958,
        13
      ],
      [
        382,
        0.2357,
        0.0817,
        0.154,
        0.667,
        0.486,
        36
      ],
      [
        581,
        0.2156,
        0.021,
        0.1947,
        0.652,
        0.596,
        23
      ],
      [
        682,
        0.214,
        0.0533,
        0.1606,
        0.647,
        0.528,
        34
      ],
      [
        781,
        0.1753,
        0.0039,
        0.1715,
        0.613,
        0.617,
        31
      ],
      [
        1068,
        0.1736,
        0.0333,
        0.1403,
        0.596,
        0.309,
        47
      ],
      [
        428,
        0.1394,
        -0.0246,
        0.164,
        0.571,
        0.507,
        35
      ],
      [
        280,
        0.1194,
        0.0046,
        0.1148,
        0.556,
        0.589,
        72
      ],
      [
        282,
        0.1088,
        -0.0339,
        0.1427,
        0.532,
        0.329,
        47
      ],
      [
        1067,
        0.1066,
        -0.0391,
        0.1458,
        0.533,
        0.4,
        45
      ],
      [
        380,
        0.095,
        -0.1131,
        0.2081,
        0.545,
        0.876,
        22
      ],
      [
        145,
        0.0936,
        0.0085,
        0.0851,
        0.53,
        0.599,
        132
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "AAAAAwMDAQEBAQEBAQEBAQEBAwMDAgICAwMDAgICBAICAAAAAwABAQEBAQQAAAMBAgMDBAEBAQICAgAAAwMDAgIEBAQEBAMAAAAAAQQBAQEDAwMAAQIEAQQEAQMDAQMDAAAEBJGRkWdnZ3V1dRAQEKWlpbCwsBERETw8PGZmZj4+PlWkpJOTkwShqKioFxegn58GF6QGBlUWFhajo6OhoWxsbEFBoFZVVlYEraSkpKegFBQUampqrXlBkhuQkhsEAhtxcZ+tkJA=",
        0,
        0,
        76,
        24,
        2.92,
        0.018,
        0.0094
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "AAAAAwMDAQEBAQEBAQEBAQEBAwMDAgICAwMDAgICBAICAAAAAwIBAQEBAQQAAAMBAgMDBAEBAQICAgICAwMDAgIEBAQEBAMAAAAABAQBAQEDAwMAAQIAAQQAAQMDAQMDAAAEBJGRkWdnZ3V1dRAQEKWlpbCwsBERETw8PGZmZj4+PlWkpJOTkwRCqKioFxegn58GF6QGBlUWFhajo6OmpmxsbEFBoFZVVlYEraSkpBqgFBQUampqrXlBmRuQmRsEAhtxcZ+tkJA=",
        0,
        6,
        70,
        24,
        2.95,
        0.339,
        0.0291
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "AAAAAwMDAQEBAQEBAQEBAQEBAwMDAgICAwMDAgICBAMDAAAAAgIBAQEDAQQEBAADAwAABAEBAQICAgICAwMDAgIBBAQEBAEAAAAABAQBAQEDAwMAAQIAAQQAAQEDAQMDBAAEBJGRkWdnZ3V1dRAQEKWlpbCwsBERETw8PGZmZj4+PlUMDJOTk0JCqKioBn1WoKCfbm6fn1UWFhajo6OmpmxsbEFBrCxVVl98raSkpBpWFBQUampqrXlBmRuQmRt8AhtxcaCtkJA=",
        3,
        14,
        59,
        24,
        3.17,
        0.59,
        0.0287
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "AAAAAwMDAQEBAQEBAQEBAQEBAwMDAgICAwMDAgICBAMDAAAAAgIBAQEBAQQEAQEDAwICBAEBAQICAgICAwMDAgIBBAIEBAEAAAAABAQBAQEDAwMAAQIAAQMAAQEDAQMDBAACA5GRkWdnZ3V1dRAQEKWlpbCwsBERETw8PGZmZj4+PhsMDJOTk0JCqKiofX1VVhgYbm6np1UWFhajo6OmpmxsbEFBrCxFK198raSkpBpVFBQUampqrXlBmRsQmRt8AhtxcVatsBA=",
        6,
        22,
        48,
        24,
        3.34,
        0.751,
        0.0254
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "AAAAAwMDAQEBAQEBAQEBAQEBAwMDAgICAwMDAgICBAMDAAAAAgIBAQEBAQICAQEDAwICAQEBAQICAgICAwMDAgMBBAIEBAEAAAAABAABAQEDAwMAAQEAAQMAAQEDAQMDAAACA5GRkWdnZ3V1dRAQEKWlpbCwsBERETw8PGZmZj4+PhsMDJOTk0JCqKiofX2oqBgYbm6npxoWFhajo6OmpmxsbKoNrCxFK198raSkpBqjFBQUampqrXl+mRsQmRt8AhtxcaatsBA=",
        10,
        26,
        40,
        24,
        3.56,
        0.8,
        0.0234
      ]
    ]
  },
  "mono_gold_celestial": {
    "archetypeId": "mono_gold_celestial",
    "domain": "gold",
    "name": "Legião Celeste",
    "subtitle": "Mono-Dourado ☀️ • Escudo Divino, Voo & Ascensão",
    "strategySummary": "Comanda serafins e arcontes de Voo protegidos por Escudo Divino que realizam trocas 2-por-1 e ascendem em campeões solares.",
    "tacticalIdentity": "tempo",
    "coverCardId": "gold_99_serafim_coroado",
    "generationsEvolved": 28,
    "matchesSimulated": 8092,
    "seedWinRate": 0.464,
    "championWinRate": 0.386,
    "championDeckJaccardStability": 0.802,
    "medianCardCi95HalfWidth": 0.0471,
    "learnedProfile": {
      "deckId": "mono_gold_celestial",
      "deckName": "Legião Celeste",
      "archetypeTag": "tempo",
      "generationsTrained": 22,
      "matchesSimulated": 7288,
      "baselineWinRate": 0.464,
      "trainedWinRate": 0.386,
      "weights": {
        "aggroFaceBias": 1.16,
        "tradeValueBias": 1.19,
        "guardianPriority": 1.05,
        "flyingEvasionBias": 1.35,
        "stackConsolidationBias": 1,
        "antiAoeSpreadBias": 1,
        "spellHoldPatience": 1,
        "relicPriority": 1.05,
        "ascensionEagerness": 1.26,
        "bloodPactThresholdHp": 24,
        "domainExpansionEagerness": 1,
        "sovPowerTempoBias": 1.03,
        "synergyHoldBonus": 18,
        "mulliganCurveTarget": 3
      },
      "mk": [
        278,
        159,
        272,
        870,
        421,
        147
      ],
      "cp": [
        575,
        680,
        678,
        427,
        579,
        774,
        421,
        275,
        166,
        432
      ],
      "ca": [
        144,
        145,
        147,
        150,
        159,
        272,
        274,
        278,
        279,
        421,
        580,
        678
      ],
      "hb": [
        [
          144,
          11.2
        ],
        [
          145,
          9.7
        ],
        [
          147,
          10.3
        ],
        [
          150,
          20.4
        ],
        [
          152,
          15.2
        ],
        [
          159,
          18.4
        ],
        [
          166,
          9.3
        ],
        [
          175,
          24
        ],
        [
          272,
          20.4
        ],
        [
          274,
          9.7
        ],
        [
          275,
          14.7
        ],
        [
          278,
          24
        ],
        [
          279,
          10
        ],
        [
          421,
          14
        ],
        [
          572,
          8.6
        ],
        [
          580,
          13.1
        ],
        [
          676,
          14.1
        ],
        [
          678,
          18.1
        ],
        [
          682,
          14.1
        ],
        [
          772,
          14.8
        ],
        [
          774,
          14.2
        ],
        [
          779,
          13.7
        ],
        [
          780,
          9.1
        ],
        [
          781,
          19.5
        ],
        [
          870,
          13.4
        ],
        [
          880,
          23.3
        ],
        [
          1031,
          24
        ],
        [
          1037,
          19.4
        ],
        [
          1046,
          15
        ],
        [
          1050,
          20.5
        ],
        [
          1051,
          20
        ],
        [
          1119,
          20
        ],
        [
          1184,
          11
        ]
      ],
      "sp": [
        [
          1037,
          272
        ],
        [
          272,
          278
        ],
        [
          1019,
          279
        ],
        [
          678,
          574
        ],
        [
          870,
          1019
        ],
        [
          772,
          278
        ],
        [
          676,
          278
        ],
        [
          145,
          580
        ],
        [
          678,
          278
        ],
        [
          781,
          274
        ]
      ],
      "dc": [
        [
          678,
          774,
          1,
          0.614,
          9,
          " (100% WR em 9 duelos cruzados)"
        ],
        [
          781,
          272,
          0.9,
          0.514,
          10,
          " (90% WR em 10 duelos cruzados)"
        ],
        [
          147,
          275,
          0.889,
          0.503,
          9,
          " (89% WR em 9 duelos cruzados)"
        ],
        [
          159,
          275,
          0.875,
          0.489,
          8,
          " (88% WR em 8 duelos cruzados)"
        ],
        [
          149,
          278,
          0.857,
          0.472,
          14,
          " (86% WR em 14 duelos cruzados)"
        ],
        [
          678,
          574,
          0.833,
          0.448,
          12,
          " (83% WR em 12 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        175,
        0.3514,
        0.0798,
        0.2716,
        0.778,
        0.816,
        9
      ],
      [
        1031,
        0.3449,
        0.1158,
        0.229,
        0.769,
        0.776,
        13
      ],
      [
        1050,
        0.2333,
        -0.1439,
        0.3772,
        0.667,
        0.957,
        6
      ],
      [
        278,
        0.1185,
        0.0259,
        0.0926,
        0.509,
        0.097,
        112
      ],
      [
        152,
        0.1164,
        -0.1779,
        0.2943,
        0.545,
        0.871,
        11
      ],
      [
        772,
        0.1073,
        -0.019,
        0.1262,
        0.533,
        0.81,
        60
      ],
      [
        275,
        0.1044,
        -0.0803,
        0.1847,
        0.536,
        0.914,
        28
      ],
      [
        774,
        0.0937,
        -0.0476,
        0.1413,
        0.521,
        0.832,
        48
      ],
      [
        676,
        0.0906,
        -0.0115,
        0.1021,
        0.511,
        0.693,
        92
      ],
      [
        159,
        0.0887,
        0.03,
        0.0587,
        0.478,
        0.083,
        278
      ],
      [
        779,
        0.0827,
        -0.0854,
        0.1681,
        0.5,
        0.634,
        34
      ],
      [
        781,
        0.0749,
        -0.0861,
        0.1611,
        0.486,
        0.519,
        37
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "AQEBBAEBAAAAAQEBAgICAQEBAwMDAAAAAgIBAQEAAAABAQEEAgIAAwMDAQEEAgAAAQEBBAQBAgADAQEBAAAAAgICAAQAAQMAAgICAwMDAQICAwMDAQEBAAICAwAAAAEDAQABAxAQEKClpZGRkXV1dTw8PBISEmZmZpCQkD4+sLCwk5OTdnamGaWlkmlpaaamoD2goHp6ehkZdj2daxcXF56enkBAQJKgnRZrkqSkpAYGBhY/PwQEBBMTE5w9pWufn58W+3eddxE=",
        0,
        0,
        64,
        36,
        2.73,
        0.018,
        0.0094
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "AQEBBAEBAAAAAQEBAgICAQEBAwMDAAAAAgIBAQEAAAABAQEEAgIAAwMDAQEEAAAAAQEBBAQBAgADAQEBAAAAAgICAAQEAQMAAgICAwMDAQICAwMDAQEBBAQCAwAAAAEDAQABAxAQEKClpZGRkXV1dTw8PBISEmZmZpCQkD4+sLCwk5OTdnamGaWlkmlpaaamoK+goHp6ehkZdj2vaxcXF56enkBAQJKgGhZrkqSkpAYGBhY/PwQEBBMTExoWpWufn58W+3eZdxE=",
        0,
        6,
        64,
        30,
        2.8,
        0.339,
        0.0291
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "AQEBBAEBAAAAAQEBAgICAQEBAwMDAAAAAgIBAQEAAAAAAAAAAAIDAwMDAAAEAAAAAQEBAwMCAgACAQEBBAQAAgICAwQEAQIDAgICAwMDAQICAwMDAQEBBAQAAgAAAAEDAQABAxAQEKClpZGRkXV1dTw8PBISEmZmZpCQkD4+sLCwk5OTlZWmpp5Ea2lpaZKSoK+goHp6egkJQ0OvpRcXFw1fnkBAQGugGhala6SkpAYGBhY/PwQEBBMTExoWnqWfn58W+3eZdxE=",
        3,
        14,
        57,
        26,
        3.14,
        0.59,
        0.0287
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "AQEBBAEBAAAAAQEBAgICAQEBAwMDAAAAAgIBAQEAAAAAAAAABAICAwMDAwMBAAAAAQEBAwMCAgADAQEBBAQEAgICAgMEAQEBAgICAwMDAQICAwMDAQEBBAQEAgAAAAEDAQABAxAQEKClpZGRkXV1dTw8PBISEmZmZpCQkD4+sLCwk5OTlZWmpqBEqGlpaW5uGq+goHp6egkJQ0OvChcXFw1fG0BAQKgNGharq6SkpAYGBhY/PwQEBBMTExoWoKafn58W+3eZdxE=",
        6,
        22,
        46,
        26,
        3.4,
        0.751,
        0.0254
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "AQEBBAEBAAAAAQEBAgICAQEBAwMDAAAAAgIBAQEAAAAAAAAAAwICAwMDAwMBAAAAAQEBAwMCAgADAQEBBAQEBAEAAgMEAQEBAgICAwMDAQICAwMDAQEBBAQCAgAAAAEDAQABAxAQEKClpZGRkXV1dTw8PBISEmZmZpCQkD4+sLCwk5OTlZWmpgtEqGlpaW5uGq+goHp6egkJQ0OvChcXFw1fGwcZmKgNGharq6SkpAYGBhY/PwQEBBMTExoWpqafn58W+3eZdxE=",
        9,
        24,
        41,
        26,
        3.57,
        0.8,
        0.0234
      ]
    ]
  },
  "mono_gold_judgment": {
    "archetypeId": "mono_gold_judgment",
    "domain": "gold",
    "name": "Julgamento Solar",
    "subtitle": "Mono-Dourado ⚖️ • Relíquias, Escudo Global & Cura",
    "strategySummary": "Sustenta Santuários e Relíquias imperiais na Retaguarda enquanto paladinos blindados, curas e Escudo Divino em massa selam o veredito final.",
    "tacticalIdentity": "control",
    "coverCardId": "gold_119_soberano_ordem_eterna",
    "generationsEvolved": 28,
    "matchesSimulated": 7916,
    "seedWinRate": 0.56,
    "championWinRate": 0.377,
    "championDeckJaccardStability": 0.905,
    "medianCardCi95HalfWidth": 0.0514,
    "learnedProfile": {
      "deckId": "mono_gold_judgment",
      "deckName": "Julgamento Solar",
      "archetypeTag": "control",
      "generationsTrained": 22,
      "matchesSimulated": 7112,
      "baselineWinRate": 0.56,
      "trainedWinRate": 0.377,
      "weights": {
        "aggroFaceBias": 0.98,
        "tradeValueBias": 1.29,
        "guardianPriority": 1.29,
        "flyingEvasionBias": 0.98,
        "stackConsolidationBias": 1,
        "antiAoeSpreadBias": 1,
        "spellHoldPatience": 1.2,
        "relicPriority": 1.27,
        "ascensionEagerness": 1,
        "bloodPactThresholdHp": 24,
        "domainExpansionEagerness": 1,
        "sovPowerTempoBias": 0.98,
        "synergyHoldBonus": 22,
        "mulliganCurveTarget": 3.2
      },
      "mk": [
        272,
        159,
        274,
        421,
        147
      ],
      "cp": [
        776,
        178,
        875,
        381,
        425,
        179,
        1013,
        871,
        883,
        674
      ],
      "ca": [
        147,
        159,
        166,
        176,
        178,
        179,
        272,
        274,
        284,
        381,
        421,
        425
      ],
      "hb": [
        [
          147,
          13.7
        ],
        [
          151,
          21.3
        ],
        [
          159,
          15.5
        ],
        [
          166,
          15
        ],
        [
          171,
          17
        ],
        [
          176,
          17.1
        ],
        [
          178,
          19.3
        ],
        [
          179,
          17.2
        ],
        [
          272,
          20.2
        ],
        [
          274,
          15.8
        ],
        [
          284,
          11.3
        ],
        [
          285,
          8.3
        ],
        [
          381,
          24
        ],
        [
          421,
          14.9
        ],
        [
          425,
          14.2
        ],
        [
          580,
          14.9
        ],
        [
          678,
          19.7
        ],
        [
          682,
          24
        ],
        [
          683,
          21
        ],
        [
          776,
          16.7
        ],
        [
          784,
          23.7
        ],
        [
          789,
          21.9
        ],
        [
          878,
          15.4
        ],
        [
          879,
          15.6
        ],
        [
          880,
          24
        ],
        [
          886,
          16.6
        ],
        [
          1031,
          24
        ],
        [
          1037,
          24
        ],
        [
          1068,
          16.5
        ],
        [
          1109,
          11
        ],
        [
          1111,
          11
        ],
        [
          1119,
          20
        ],
        [
          1184,
          11
        ]
      ],
      "sp": [
        [
          880,
          274
        ],
        [
          880,
          285
        ],
        [
          886,
          381
        ],
        [
          1037,
          381
        ],
        [
          683,
          381
        ],
        [
          284,
          381
        ],
        [
          1037,
          274
        ],
        [
          880,
          272
        ],
        [
          784,
          381
        ],
        [
          149,
          178
        ]
      ],
      "dc": [
        [
          886,
          1184,
          1,
          0.623,
          9,
          " (100% WR em 9 duelos cruzados)"
        ],
        [
          683,
          166,
          0.941,
          0.564,
          17,
          " (94% WR em 17 duelos cruzados)"
        ],
        [
          678,
          683,
          0.929,
          0.552,
          14,
          " (93% WR em 14 duelos cruzados)"
        ],
        [
          886,
          1109,
          0.9,
          0.523,
          10,
          " (90% WR em 10 duelos cruzados)"
        ],
        [
          149,
          683,
          0.9,
          0.523,
          10,
          " (90% WR em 10 duelos cruzados)"
        ],
        [
          1037,
          381,
          0.889,
          0.512,
          9,
          " (89% WR em 9 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        1037,
        0.3011,
        0.1193,
        0.1818,
        0.708,
        0.607,
        24
      ],
      [
        151,
        0.2517,
        0.0631,
        0.1886,
        0.667,
        0.762,
        24
      ],
      [
        789,
        0.2508,
        0.033,
        0.2178,
        0.667,
        0.78,
        18
      ],
      [
        683,
        0.2056,
        0.1143,
        0.0914,
        0.615,
        0.644,
        109
      ],
      [
        171,
        0.1551,
        0.0347,
        0.1204,
        0.569,
        0.745,
        65
      ],
      [
        776,
        0.1492,
        -0.0625,
        0.2117,
        0.571,
        0.908,
        21
      ],
      [
        886,
        0.1457,
        0.0511,
        0.0946,
        0.557,
        0.682,
        106
      ],
      [
        1068,
        0.1446,
        0.0204,
        0.1242,
        0.532,
        0.215,
        62
      ],
      [
        880,
        0.1349,
        -0.1898,
        0.3246,
        0.556,
        0.877,
        9
      ],
      [
        1031,
        0.1255,
        -0.1688,
        0.2943,
        0.545,
        0.863,
        11
      ],
      [
        879,
        0.125,
        -0.0356,
        0.1606,
        0.541,
        0.774,
        37
      ],
      [
        878,
        0.121,
        -0.0377,
        0.1588,
        0.526,
        0.568,
        38
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "AQEBAwMDAwIBAQEBAQEDAwMDAwMBAQEAAAADAwEAAAAAAAMDAwMDAwICAQEBAwMDAQQDAAAAAQECAgICAQIEAQAEBAABAQEBAQEDAwQEBAMEAwEAAAADAQADBAIAAwEDAAIAArCwsBEREWqjpaWlEhISZ2dndnZ2EBAQkZGRBwcWkpKfn59paWlra2ujo3d3d/v7+xZXbJOTk3l5oqJBQadBoBahVaChFHmoqKenampVoFcFV2wUsbGxB6iSbFWroQUUBbOrs6s=",
        0,
        0,
        80,
        20,
        2.98,
        0.018,
        0.0094
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "AQEBAwMDAwIBAQEBAQEDAwMDAwMBAQEAAAADAwEAAAAAAAMDAwMDAwICAQEBAwMDAQQDAAAAAQECAgICAQIEAQAEBAAAAAEBAQEDAwQEBAMEAwAAAAADAQADBAIAAwIDAAIAArCwsBEREWqjpaWlEhISZ2dndnZ2EBAQkZGRBwcWkpKfn59paWlra2ujo3d3d/v7+xZXbJOTk319oqJBQadBoBahVaChmZmoqKenampVoFcFV2yysbGxB6iSbFWroQWmBbOrs6s=",
        0,
        6,
        74,
        20,
        3.02,
        0.339,
        0.0291
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "AQEBAwMDAQMBAQEBAQEDAwMDAwMBAQEAAAACAgECAgAAAAMDAwMDAwMDAQEBAwMDAQMDAAAAAQECAgEBAAEEAQQEBAIAAAMDAAABAQQEBAMDAAAAAAACAwIABAIEAwIDAAIAArCwsBEREahqpaWlEhISZ2dndnZ2EBAQkZGRQUEWo6Ofn59paWlra2tqand3d/v7+xYICJOTk319oqKnp6GnoBYsVaCqmZkHB6GhqKhVoFdzc7KysbGxQQejl1WrXwymbrOrs6s=",
        3,
        14,
        63,
        20,
        3.24,
        0.59,
        0.0287
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "AQEBAwMDAAABAQEBAQEDAwMDAwMBAQEAAAABAQICAgAAAAMDAwMDAwEBAQEBAwMDAwMDAAAAAQECAgAAAQAEBAQEBAIAAAICAQEDAwQEBAMDAAAAAAABAgIABAIEAwIDAAIAArCwsBEREaurpaWlEhISZ2dndnZ2EBAQkZGRp6dEqKifn59paWlra2upqXd3d/v7++kICJOTk319oqKhoRahoA0sVaCqmZlBQRYWBxBVoFdzc7KysbGxp0Gsl1WrXwymbrOrs6s=",
        6,
        22,
        52,
        20,
        3.34,
        0.751,
        0.0254
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "AQEBAwMDAAABAQEBAQEDAwMDAwMBAQEAAAAAAAICAgAAAAMDAwMDAwEBAQEBAwMDAwMDAAAAAQECAgAAAwMDBAQDBAIAAAEBAwMDAwQEBAMDAAAAAAADAwIAAQIEAwIDAAIAArCwsBEREaurpaWlEhISZ2dndnZ2EBAQkZGRlZVEqKifn59paWlra2upqXd3d/v7++kICJOTk319oqKmpgsLFQ0scAeqmZkcHG9vEBBVoFdzc7KysbGxdXWsl7OrXwymbrOrs6s=",
        10,
        35,
        35,
        20,
        3.59,
        0.8,
        0.0234
      ]
    ]
  },
  "mono_neutral_axial": {
    "archetypeId": "mono_neutral_axial",
    "domain": "neutral",
    "name": "Legião Axial Autômata",
    "subtitle": "Mono-Neutro ⚙️ • Constructos, Relíquias & Matriz Horológica",
    "strategySummary": "Opera com Constructos blindados, artilharia de Alcance, Pulso da Matriz (2⚡) e a Expansão de Domínio Matriz Horológica do Ponto Zero (6/6 Afinidade Axial).",
    "tacticalIdentity": "midrange",
    "coverCardId": "neutral_117_elminster_sabio_cinzento",
    "generationsEvolved": 28,
    "matchesSimulated": 8216,
    "seedWinRate": 0.35,
    "championWinRate": 0.432,
    "championDeckJaccardStability": 0.802,
    "medianCardCi95HalfWidth": 0.0512,
    "learnedProfile": {
      "deckId": "mono_neutral_axial",
      "deckName": "Legião Axial Autômata",
      "archetypeTag": "midrange",
      "generationsTrained": 22,
      "matchesSimulated": 7412,
      "baselineWinRate": 0.35,
      "trainedWinRate": 0.432,
      "weights": {
        "aggroFaceBias": 1.17,
        "tradeValueBias": 1.2,
        "guardianPriority": 1.18,
        "flyingEvasionBias": 1,
        "stackConsolidationBias": 1,
        "antiAoeSpreadBias": 1,
        "spellHoldPatience": 1.03,
        "relicPriority": 1.05,
        "ascensionEagerness": 1.02,
        "bloodPactThresholdHp": 24,
        "domainExpansionEagerness": 1.36,
        "sovPowerTempoBias": 1.04,
        "synergyHoldBonus": 20,
        "mulliganCurveTarget": 3
      },
      "mk": [
        982,
        922,
        904,
        913,
        910,
        892
      ],
      "cp": [
        182,
        899,
        194,
        984,
        1008,
        592,
        492,
        393,
        923,
        184
      ],
      "ca": [
        189,
        194,
        593,
        892,
        894,
        899,
        904,
        910,
        913,
        922,
        923,
        928
      ],
      "hb": [
        [
          189,
          24
        ],
        [
          194,
          22.5
        ],
        [
          593,
          7.4
        ],
        [
          892,
          17.1
        ],
        [
          894,
          21.4
        ],
        [
          899,
          24
        ],
        [
          904,
          23.1
        ],
        [
          910,
          21.1
        ],
        [
          913,
          22.4
        ],
        [
          922,
          23.2
        ],
        [
          923,
          10
        ],
        [
          928,
          16.3
        ],
        [
          935,
          20.6
        ],
        [
          938,
          20.7
        ],
        [
          940,
          8.5
        ],
        [
          942,
          24
        ],
        [
          983,
          24
        ],
        [
          984,
          24
        ],
        [
          1032,
          14.5
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
          1120,
          20
        ],
        [
          1183,
          20
        ],
        [
          1187,
          15
        ]
      ],
      "sp": [
        [
          983,
          984
        ],
        [
          189,
          984
        ],
        [
          984,
          922
        ],
        [
          984,
          194
        ],
        [
          983,
          922
        ],
        [
          942,
          984
        ],
        [
          189,
          892
        ],
        [
          189,
          922
        ],
        [
          942,
          983
        ],
        [
          189,
          942
        ]
      ],
      "dc": [
        [
          1032,
          920,
          0.909,
          0.477,
          11,
          " (91% WR em 11 duelos cruzados)"
        ],
        [
          984,
          591,
          0.875,
          0.443,
          16,
          " (88% WR em 16 duelos cruzados)"
        ],
        [
          181,
          920,
          0.875,
          0.443,
          16,
          " (88% WR em 16 duelos cruzados)"
        ],
        [
          984,
          920,
          0.875,
          0.443,
          8,
          " (88% WR em 8 duelos cruzados)"
        ],
        [
          935,
          1032,
          0.842,
          0.411,
          19,
          " (84% WR em 19 duelos cruzados)"
        ],
        [
          984,
          928,
          0.833,
          0.402,
          18,
          " (83% WR em 18 duelos cruzados)"
        ]
      ]
    },
    "topShapleyCards": [
      [
        938,
        0.237,
        0.0003,
        0.2366,
        0.714,
        0.914,
        14
      ],
      [
        984,
        0.2122,
        0.1123,
        0.0999,
        0.679,
        0.696,
        84
      ],
      [
        935,
        0.1838,
        0.1232,
        0.0606,
        0.619,
        0.082,
        247
      ],
      [
        983,
        0.1572,
        0.0874,
        0.0698,
        0.606,
        0.352,
        188
      ],
      [
        194,
        0.1275,
        0.01,
        0.1175,
        0.597,
        0.759,
        67
      ],
      [
        1032,
        0.0919,
        -0.0474,
        0.1393,
        0.551,
        0.55,
        49
      ],
      [
        928,
        0.0914,
        0.0165,
        0.0749,
        0.541,
        0.363,
        170
      ],
      [
        899,
        0.0869,
        0.0178,
        0.0691,
        0.54,
        0.43,
        200
      ],
      [
        910,
        0.0843,
        0.0319,
        0.0524,
        0.521,
        0.112,
        349
      ],
      [
        942,
        0.0803,
        0.008,
        0.0724,
        0.525,
        0.253,
        183
      ],
      [
        913,
        0.0707,
        0.0196,
        0.0511,
        0.505,
        0.064,
        368
      ],
      [
        922,
        0.0671,
        0.0089,
        0.0582,
        0.509,
        0.203,
        283
      ]
    ],
    "tierDecks": [
      [
        1,
        "Tier I • Patrulha de Fronteira",
        "AwMDAgICAwMDAwMDAwMDAwMDAwEBAAAAAwMDBAQEBAAABAMEBAMDBAMDAwMDAwMDBAMDAwAAAwMEAwMDAwMAAwQDBAAAAAQEBAQEAAEDAQEAAwMBAAMEBAIEBAADAwMDAwMDAZGRkU9PT42NjZSUlHx8fIaGhqqGhr6+vo6OjlFJmkm2tk+YUSj29kmampqiopiYqk+jo6O3t6KbKKysrKaDtaZQplHAwMCcnJqanLeI9oiItZubJrWqUFBTTyi2oIigg4N+fiY=",
        0,
        0,
        68,
        32,
        2.73,
        0.021,
        0.0096
      ],
      [
        2,
        "Tier II • Guarnição Regular",
        "AwMDAgICAwMDAwMDAwMDAwMDAwEBAAAAAwMDBAQEBAADBAMEBAMDBAMDAwMDAwMDBAMDAwAAAwMEAwMDAwMAAwQDBAAAAAQEBAQEAAEDAQEAAwMBAAMEBAQEBAADAwMDAwMDAZGRkU9PT42NjZSUlHx8fIaGhqqGhr6+vo6OjlFJmkm2r0+YUSj29kmamprq6piYqk+jo6O3t6enKKysrKaDtaZQplHAwMCcnJqanLeI9oiItZubJrWqUFCjTyi2oIigg4N+fiY=",
        0,
        6,
        62,
        32,
        2.77,
        0.3,
        0.0289
      ],
      [
        3,
        "Tier III • Bastião Veterano",
        "AwMDAgICAwMDAwMDAwMDAwMDAwEBAAAAAwMDBAQEBAMDBAQEAwMDBAMDAwMDAwMDBAMDAwMDAwMEAwMDAwMAAwMEBAAAAAQEBAQEBAMDAwMAAwMBAAMEBAQEBAADAwMDAwMDAZGRkU9PT42NjZSUlHx8fIaGhqqGhr6+vo6OjlFJmkmvryhPUbKurkmamprq6piYqiijo6OmmaenYKysrKaDtaaYUFHAwMBQUJqanJzX19jYtZubJrWqT0+jKDS2oIigg4N+fiY=",
        3,
        14,
        51,
        32,
        2.93,
        0.605,
        0.029
      ],
      [
        4,
        "Tier IV • Elite do Alto Trono",
        "AwMDAgICAwMDAwMDAwMDAwMDAwEBAAAAAwMDBAQEAwMDBAQEAwMDBAMDAwMDAwMDBAMDAwMDAwMEAwMDAAMAAAQDBAAAAAAABAQAAAMDAwMAAwMBAAMEBAQEBAADAwMDAwMDAZGRkU9PT42NjZSUlHx8fIaGhqqGhr6+vo6OjlEqn7OvrygoUbKurkmamprq6piYqkmjo6OZmaenYKysrLiDtbhPpFHAwMDCwpqaxsbX19jYtZubJrWqmiijSTS2oIigg4N+fiY=",
        6,
        22,
        40,
        32,
        3.02,
        0.733,
        0.0261
      ],
      [
        5,
        "Tier V • Campeão Soberano Ápice",
        "AwMDAgICAwMDAwMDAwMDAwMDAwEBAAAAAwMDAQQEAwMDAwMBAwMDAwMDAwMDAwMDAwMDAwMDAwMEAwMDAAMAAAMDBAAAAAAAAwMAAAMDAwMAAwMBAAMDAwQDBAADAwMDAwMDAZGRkU9PT42NjZSUlHx8fIaGhqqGhr6+vo6OjiUqn7Ovr7Cw7bKuruSamprq6piYqp6jo6OZmaenYKysrLiDtbikpAjAwMDCwuPjxsbX19jYtZubJrWq1dWj8DS2oIigg4N+fiY=",
        10,
        31,
        27,
        32,
        3.21,
        0.84,
        0.0219
      ]
    ]
  }
});
