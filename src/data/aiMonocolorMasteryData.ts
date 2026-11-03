import { unpackMasteryRecord } from './compactMasteryCodec';
import { DOMAIN_VALUE_NETWORKS } from './aiValueNetworksData';
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
  "generatedAt": "2026-11-01T03:58:00.920Z",
  "totalMatchesSimulated": 86048,
  "totalStateTrajectoriesTrained": 204569,
  "elapsedSeconds": 360.8,
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

export { DOMAIN_VALUE_NETWORKS };

export const MONOCOLOR_ARCHETYPE_MASTERY: Partial<Record<MonocolorArchetypeId, MonocolorArchetypeMastery>> = unpackMasteryRecord<MonocolorArchetypeId, MonocolorArchetypeMastery>({
  "mono_green_swarm": {
    "archetypeId": "mono_green_swarm",
    "domain": "green",
    "name": "Enxame & Matilha Silvestre",
    "subtitle": "Mono-Verde 🌿 • Aggro & Buff em Massa",
    "strategySummary": "Inunda as 6 colunas cedo com feras velozes, invocações de matilha e rugidos de fortalecimento coletivo para letal explosivo.",
    "tacticalIdentity": "aggro",
    "coverCardId": "green_141_soberano_fera_primordial",
    "generationsEvolved": 22,
    "matchesSimulated": 8608,
    "seedWinRate": 0.679,
    "championWinRate": 0.432,
    "championDeckJaccardStability": 0.923,
    "medianCardCi95HalfWidth": 0.034,
    "learnedProfile": {"deckId":"mono_green_swarm","deckName":"Enxame & Matilha Silvestre","archetypeTag":"aggro","generationsTrained":16,"matchesSimulated":7804,"baselineWinRate":0.679,"trainedWinRate":0.467,"weights":{"aggroFaceBias":1.27,"tradeValueBias":0.92,"guardianPriority":1.04,"flyingEvasionBias":1,"stackConsolidationBias":0.85,"antiAoeSpreadBias":1.25,"spellHoldPatience":1,"relicPriority":1,"ascensionEagerness":1,"bloodPactThresholdHp":24,"domainExpansionEagerness":1,"sovPowerTempoBias":1.04,"synergyHoldBonus":24,"mulliganCurveTarget":2.8},"mk":[126,270,254,119,853,554,110,268,108],"cp":[139,654,270,110,257,265,254,365,1012,754],"ca":[114,115,116,126,140,254,265,266,268,270,367,483],"hb":[[108,7],[114,20.1],[115,11.7],[116,22.6],[126,24],[140,11.6],[254,12.7],[265,17.6],[266,24],[268,12.5],[270,22.1],[354,7.5],[367,15.7],[483,14.8],[487,15.7],[554,11.8],[566,17.3],[666,22.4],[764,24],[769,10],[853,13],[866,9.6],[1036,12.1]],"sp":[[114,764],[266,555],[108,666],[116,270],[114,566],[266,487],[114,769],[126,266],[668,126],[769,126]],"dc":[[114,764,0.839,0.276,85," (+28% WR | IC95% ±7.5%, n=85)"],[266,555,0.823,0.259,37," (+26% WR | IC95% ±11.3%, n=37)"],[108,666,0.8,0.236,67," (+24% WR | IC95% ±9.1%, n=67)"],[116,270,0.819,0.255,36," (+25% WR | IC95% ±11.5%, n=36)"],[114,566,0.803,0.239,58," (+24% WR | IC95% ±9.7%, n=58)"],[266,487,0.791,0.227,83," (+23% WR | IC95% ±8.4%, n=83)"],[114,769,0.8,0.236,57," (+24% WR | IC95% ±9.8%, n=57)"],[126,266,0.776,0.213,122," (+21% WR | IC95% ±7.2%, n=122)"],[668,126,0.769,0.205,161," (+21% WR | IC95% ±6.4%, n=161)"],[769,126,0.783,0.219,89," (+22% WR | IC95% ±8.2%, n=89)"],[115,487,0.782,0.218,93," (+22% WR | IC95% ±8.1%, n=93)"],[265,266,0.765,0.201,171," (+20% WR | IC95% ±6.2%, n=171)"]]},
    "topShapleyCards": [[862,0.2138,-0.0134,0.2271,0.688,0.843,16],[1036,0.2052,0.0274,0.1778,0.667,0.597,27],[566,0.2042,0.0025,0.2016,0.667,0.618,21],[769,0.1786,0.0512,0.1274,0.648,0.759,54],[140,0.1756,0.0031,0.1724,0.633,0.524,30],[866,0.1645,0.055,0.1095,0.627,0.611,75],[266,0.1492,0.0225,0.1268,0.586,0.108,58],[483,0.1287,0.0393,0.0894,0.568,0.151,118],[764,0.1101,-0.0732,0.1833,0.571,0.594,28],[1012,0.1093,-0.0051,0.1144,0.569,0.571,72],[666,0.1089,-0.0684,0.1773,0.567,0.524,30],[114,0.0912,0.0196,0.0716,0.524,0.026,187]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AwMDAAAAAQEBAAAAAgICAQEBAgICAgIAAAADAwMCAgIDAwMBAQIBAgIBAQEBAQEAAAABAQEBAQEAAAIAAQEBAAAAAQECAAEAAAEBAQIAAQEDAwICAgECAgACAgAAAAABAAABAFVVVXl5eQAAAP7+/ioqKmJiYo+PjysrbGxsVFRUjo6OUlJSZGQtZywsZwEBAdjYbm5uCQkJBQUFenqSemfc3Hxvb9zYK3xkdXUMDAwsd2Nj+vr+/v4O8vJ8kpKIiHdvDo2IY3c=",0,0,42,58,2.34,0.088,0.018],[2,"Tier II • Guarnição Regular","AwMDAAAAAQEBAAAAAgICAQEBAgICAgIAAAADAwMCAgIDAwMBAQIBAgIBAQEBAAAAAAABAQEBAQEAAAIAAQEBAAAAAQMDAAEAAAEBAQIAAQEDAwICAgECAgACAgAAAAABAAABAFVVVXl5eQAAAP7+/ioqKmJiYo+PjysrbGxsVFRUjo6OUlJSZGQtZywsZwEBAX5+bm5uCQkJBQUFenqSemfc3Hxvb9wBAXxkj48MDAwsd2Nj+vr+/v4O8vJ8kpKIiHdvDo2IY3c=",0,6,40,54,2.38,0.258,0.0287],[3,"Tier III • Bastião Veterano","AwMDAAAAAQEBAAAAAgICAQEBAgICAgIAAAADAwMCAgIDAwMDAwIAAAAAAQEBAAAAAAABAQEBAQECAgECAQEBAAAAAQMDAgEAAAEBAQACAQEDAwICAgECAgABAQAAAwABAAACA1VVVXl5eQAAAP7+/ioqKmJiYo+PjysrbGxsVFRUjo6OUlJS9PQtfIiIdAEBAX5+bm5uCQkJBQUFkpLckgpnZ3xvb2cBAfwPj48MDAyILA0N+vr+/v4O8vJ83Nx6emJvDo16/2I=",3,14,40,43,2.65,0.634,0.0294],[4,"Tier IV • Elite do Alto Trono","AwMDAAAAAQEBAAAAAgICAQEBAgICAgIAAAADAwMCAgIDAwMDAwIAAAAAAQEBAAAAAAABAQEBAQEBAQEBAQAABAAEAAMDAgEAAAEBAQEBAQEDAwICAgECAgIBAQICAwABAAICA1VVVXl5eQAAAP7+/ioqKmJiYo+PjysrbGxsVFRUjo6OUlJS9PQtb3JydAEBAX5+bm5uCQkJBQUF3ONn3Ap8fAxvBnwBAfwPj48MDAzn5w0N+vr+/v4O8vI2Z2ecnGJvDo03/2I=",6,22,36,36,2.87,0.723,0.0276],[5,"Tier V • Campeão Soberano Ápice","AwMDAAAAAQEBAAAAAgICAQEBAgICAgIAAAADAwMCAgIDAwMDAwIDAAAAAQEBAAAAAAABAQEBAQEBAQMDAQEBBAAEAwMDAgEAAAEBAQEBAQEDAwICAgECAgIAAAICAwIBAAICA1VVVXl5eQAAAP7+/ioqKmJiYo+PjysrbGxsVFRUjo6OUlJS9PQtXnJydAEBAX5+bm5uCQkJBQUF4+NbWwptbQyMBl4BAfwPj48MDAzn5w0N+vr+/v4O8vI2c3OcnGKaDo03/2I=",8,31,25,36,3.21,0.772,0.0255]]
  },
  "mono_green_colossus": {
    "archetypeId": "mono_green_colossus",
    "domain": "green",
    "name": "Colossos Primordiais",
    "subtitle": "Mono-Verde 🌿 • Ramp & Atropelar",
    "strategySummary": "Acelera Essência com xamãs druídicos para esmagar linhas defensivas com dinossauros e titãs dotados de Atropelar.",
    "tacticalIdentity": "ramp",
    "coverCardId": "green_173_general_roda_selva",
    "generationsEvolved": 22,
    "matchesSimulated": 8556,
    "seedWinRate": 0.476,
    "championWinRate": 0.31,
    "championDeckJaccardStability": 0.942,
    "medianCardCi95HalfWidth": 0.0457,
    "learnedProfile": {"deckId":"mono_green_colossus","deckName":"Colossos Primordiais","archetypeTag":"ramp","generationsTrained":16,"matchesSimulated":7752,"baselineWinRate":0.476,"trainedWinRate":0.408,"weights":{"aggroFaceBias":1.15,"tradeValueBias":1.12,"guardianPriority":1,"flyingEvasionBias":1,"stackConsolidationBias":1,"antiAoeSpreadBias":1,"spellHoldPatience":1,"relicPriority":1,"ascensionEagerness":1.18,"bloodPactThresholdHp":24,"domainExpansionEagerness":1.22,"sovPowerTempoBias":1,"synergyHoldBonus":20,"mulliganCurveTarget":3.2},"mk":[118,126,120,1018,473],"cp":[127,130,115,135,664,858,139,663,264,365],"ca":[114,115,116,119,120,126,130,140,267,473,483,484],"hb":[[114,24],[115,19.5],[116,24],[118,17],[119,19.8],[120,18.5],[126,24],[130,11.9],[139,10.2],[140,24],[267,24],[473,15.6],[483,24],[484,13.4],[558,10.1],[655,8.9],[664,11.2],[665,24],[666,24],[765,24],[853,16.1],[862,24],[863,24],[1036,24]],"sp":[[119,862],[114,666],[119,1036],[1036,473],[119,863],[120,1036],[666,120],[666,119],[114,1036],[1036,558]],"dc":[[119,862,0.862,0.401,112," (+40% WR | IC95% ±6.2%, n=112)"],[114,666,0.855,0.394,44," (+39% WR | IC95% ±9.7%, n=44)"],[119,1036,0.833,0.371,97," (+37% WR | IC95% ±7.2%, n=97)"],[1036,473,0.826,0.365,122," (+36% WR | IC95% ±6.5%, n=122)"],[119,863,0.821,0.359,146," (+36% WR | IC95% ±6.1%, n=146)"],[120,1036,0.825,0.363,115," (+36% WR | IC95% ±6.7%, n=115)"],[666,120,0.821,0.359,118," (+36% WR | IC95% ±6.7%, n=118)"],[666,119,0.827,0.365,82," (+37% WR | IC95% ±7.9%, n=82)"],[114,1036,0.838,0.377,51," (+38% WR | IC95% ±9.5%, n=51)"],[1036,558,0.824,0.363,75," (+36% WR | IC95% ±8.2%, n=75)"],[119,140,0.813,0.352,81," (+35% WR | IC95% ±8.1%, n=81)"],[666,852,0.832,0.371,43," (+37% WR | IC95% ±10.4%, n=43)"]]},
    "topShapleyCards": [[1036,0.5287,0.3911,0.1376,0.87,0.623,23],[862,0.4814,0.3323,0.1491,0.833,0.844,24],[666,0.3805,0.2045,0.176,0.72,0.597,25],[267,0.3134,0.1187,0.1947,0.652,0.582,23],[116,0.2142,0.0578,0.1565,0.538,0.291,39],[365,0.2123,0.0097,0.2026,0.565,0.864,23],[140,0.1852,-0.0521,0.2373,0.529,0.691,17],[665,0.1832,-0.0878,0.271,0.538,0.91,13],[863,0.1666,-0.0153,0.1819,0.517,0.819,29],[664,0.1495,-0.0427,0.1922,0.5,0.817,26],[565,0.147,-0.1995,0.3465,0.5,0.867,8],[483,0.1279,0.0422,0.0857,0.442,0.085,129]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AgICAAAAAQEBAQEBAwMDAAAAAwMDAgICAgAAAwECAQEBAQEBAQICAQEBAQECAQECAgECAwMCAQICAwMAAAIDAAEBAQEBAAAAAwMCAgEBAgIAAAEBAQEAAAICAAACAgICAAEBA4+Pj3d3dwAAANnZ2VRUVHh4eFVVVS4uLpNvb/oEMWnf4N7eamr09ODgCQncLwUF8/MDMVlZLQXx81hYdXUxWG5pAwNpCXFvdfr6lJTc3C8vfX3f3wQEcXGU9G5u8fGTk31q3lk=",0,0,79,21,3.24,0.088,0.018],[2,"Tier II • Guarnição Regular","AgICAAAAAQEBAQEBAwMDAAAAAwMDAgICAgAAAwECAQEBAQEBAQICAQEBAQECAQECAgECAwMCAQICAwMAAAIDAAEBAQEBAAAAAwMCAgEBAgIAAAEBAQEAAAICAAACAgICAAEBA4+Pj3d3dwAAANnZ2VRUVHh4eFVVVS4uLpNycvoEMWnf4N7eamr09ODgCQncLwUF8/MDMVlZLQXx81hYj48xWG5pAwNpCXGHh/r6lJTc3C8vfX3f3wQEcXGU9G5u8fGTk31q3lk=",0,6,73,21,3.28,0.258,0.0287],[3,"Tier III • Bastião Veterano","AgICAAAAAQEBAQEBAwMDAAAAAwMDAgICAAAAAQEBAQEBAQEAAAICAAAAAAEBAwMCAgEDAgICAwICAgIAAAICAwEBAQEAAQAAAQECAgEBAQEAAAEBAgIBAQICAwMCAgICAAABAo+Pj3d3dwAAANnZ2VRUVHh4eFVVVS4uLnRycuPjCmne32pqfX2UlIuLbm4F3FlZ8fED6PT0LVkv8fPzj48x81hpAwNpbgmHh3Nzk5MFBdzccXHe3js7CQmTlFhYLy8xMXF9avQ=",3,14,62,21,3.37,0.634,0.0294],[4,"Tier IV • Elite do Alto Trono","AgICAAAAAQEBAQEBAwMDAAAAAwMDAgICAAAAAQEBAgMDAgIAAAICAAADAwMBAgICAgEDAgICAgECAgIAAAQCAgEBAQEDAAAAAQECAgMDAQEBAQAAAgIAAAICAgIBAQEBAQABAo+Pj3d3dwAAANnZ2VRUVHh4eFVVVS4uLnRycuPjCjVaWpiYcX+Tk4uLWFhZBfT0Ly8D6JSULfTcL/Hxj48M8fMLAwNpWG6Hh3NzMTFZWQUFCQlwcDs7bm4xk/Pz3NxpaQlx55Q=",6,22,51,21,3.52,0.723,0.0276],[5,"Tier V • Campeão Soberano Ápice","AgICAAAAAQEBAQEBAwMDAAAAAwMDAgICAAAAAQEBAgMDAgIAAAICAAABAQICAwMAAAEDAgICAgEBAgIAAAQDAwECAgADAwAAAQEBAQMDAgIAAAAAAgICAgICAwMBAQAAAgIBAo+Pj3d3dwAAANnZ2VRUVHh4eFVVVS4uLnRycuPjCjVaWpiYf3/6+ouLbW37+11dgoJu6DQ0LTNra5aWj48MXl4Lmv2MX1+Hh3NzBgZcXJmZc3NwcDs7l5f5+e7uCAh+fvX15/c=",10,65,4,21,4.47,0.772,0.0255]]
  },
  "mono_green_roots": {
    "archetypeId": "mono_green_roots",
    "domain": "green",
    "name": "Raízes Eternas",
    "subtitle": "Mono-Verde 🌿 • Guardião & Regeneração",
    "strategySummary": "Ergue muralhas vivas com Guardião, Regeneração e curas recorrentes, vencendo por atrito intransponível de Vanguarda.",
    "tacticalIdentity": "attrition",
    "coverCardId": "green_86_tarrasque_desperto",
    "generationsEvolved": 22,
    "matchesSimulated": 8112,
    "seedWinRate": 0.452,
    "championWinRate": 0.307,
    "championDeckJaccardStability": 1,
    "medianCardCi95HalfWidth": 0.0429,
    "learnedProfile": {"deckId":"mono_green_roots","deckName":"Raízes Eternas","archetypeTag":"attrition","generationsTrained":16,"matchesSimulated":7308,"baselineWinRate":0.452,"trainedWinRate":0.358,"weights":{"aggroFaceBias":0.86,"tradeValueBias":1.37,"guardianPriority":1.38,"flyingEvasionBias":1,"stackConsolidationBias":1,"antiAoeSpreadBias":1,"spellHoldPatience":1.06,"relicPriority":1.14,"ascensionEagerness":1,"bloodPactThresholdHp":24,"domainExpansionEagerness":0.97,"sovPowerTempoBias":1.02,"synergyHoldBonus":21,"mulliganCurveTarget":3.2},"mk":[126,554,254,853,256],"cp":[271,265,661,114,562,256,260,858,115,130],"ca":[114,115,116,121,126,140,254,260,265,267,271,483],"hb":[[114,24],[115,17.1],[116,24],[121,13.1],[126,24],[140,19.8],[254,13.8],[256,8.4],[258,9.9],[260,11.1],[265,17.3],[267,19],[271,19.8],[483,21.2],[554,16.2],[555,9],[566,18.7],[571,17.8],[666,24],[765,22.1],[769,23.6],[853,20.8],[862,24],[863,22.7],[864,24],[1036,22.3]],"sp":[[114,769],[666,126],[116,554],[116,126],[265,271],[116,483],[769,265],[769,126],[571,265],[271,483]],"dc":[[114,769,0.71,0.28,192," (+28% WR | IC95% ±6.3%, n=192)"],[666,126,0.714,0.285,90," (+28% WR | IC95% ±9.0%, n=90)"],[116,554,0.688,0.259,175," (+26% WR | IC95% ±6.7%, n=175)"],[116,126,0.701,0.271,109," (+27% WR | IC95% ±8.3%, n=109)"],[265,271,0.689,0.26,137," (+26% WR | IC95% ±7.6%, n=137)"],[116,483,0.711,0.281,68," (+28% WR | IC95% ±10.3%, n=68)"],[769,265,0.668,0.238,269," (+24% WR | IC95% ±5.6%, n=269)"],[769,126,0.673,0.243,203," (+24% WR | IC95% ±6.3%, n=203)"],[571,265,0.685,0.255,116," (+26% WR | IC95% ±8.2%, n=116)"],[271,483,0.706,0.276,60," (+28% WR | IC95% ±10.9%, n=60)"],[115,769,0.688,0.259,98," (+26% WR | IC95% ±8.9%, n=98)"],[114,571,0.69,0.26,92," (+26% WR | IC95% ±9.1%, n=92)"]]},
    "topShapleyCards": [[116,0.1834,0.0524,0.131,0.5,0.188,56],[769,0.1816,0.0753,0.1062,0.518,0.577,85],[126,0.1732,0.1048,0.0684,0.483,0.051,205],[666,0.1636,-0.0097,0.1732,0.5,0.584,32],[263,0.1514,0.059,0.0925,0.473,0.291,112],[862,0.1496,-0.0814,0.231,0.5,0.865,18],[370,0.1458,-0.2543,0.4001,0.5,0.941,6],[115,0.1345,0.0423,0.0922,0.455,0.273,112],[571,0.1286,-0.0225,0.151,0.476,0.808,42],[271,0.1266,0.0024,0.1242,0.468,0.679,62],[863,0.1258,-0.0878,0.2136,0.476,0.864,21],[765,0.1163,-0.083,0.1993,0.458,0.696,24]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AgICAwMDAAAAAgICAAAAAQEAAAACAgIAAAEBAwMDAwMDAQEBAwAAAAEBAQEBAQAAAAAAAAEBAQEBAQECAgIAAAAAAAAAAAAAAAAAAAABAQEBAQEBAQEBAQEBAQEBAQEBAQECAo+Pj1NTU////ysrK3l5eQAA/v7+Kioqc3MHB1dXV1ZWVmhoaFiKiooEBAQC2gx6enqIiIgCAmVlZdraLCwsbW1td3d3eHh4hYWFjY2NAAwMY2NjZGRkcHBw2NjY29vb5ubmLi4=",0,4,16,80,2.49,0.088,0.018],[2,"Tier II • Guarnição Regular","AgICAwMDAAAAAgICAAAAAQEAAAACAgIAAAEBAQEBAgICAgIDAwMDAwMAAQEBAwAAAAEBAQEBAQEBAgICAgICAgICAgICAgICAgICAwMBAQEAAAABAQEBAQEBAQEBAQEBAAAAAI+Pj1NTU////ysrK3l5eQAA/v7+Kioqc3MJCQkHB/v7Mvj4V1dXVlZWjGhoaFiKiooEBAQC2gwCAi0tLTAwMDExMZGRkfHx8fT09FhYZWVliYmJ3t7e2toMDAEBAXFxcXV1dYY=",1,9,55,35,3.11,0.258,0.0287],[3,"Tier III • Bastião Veterano","AgICAwMDAAAAAgICAwMDAAAAAQEAAAACAgIAAAEBAQEBAgICAgICAgICAAADAwMDAwMAAQIBAQEDAAAAAQEBAQEBAQECAgICAgIDAwICAgAAAAICAgICAgICAgEBAQEBAQEBAY+Pj1NTU////ysrK1VVVXl5eQAA/v7+Kioqc3MJCQkHB/v7Mvj4lZWYmICAV1dXVlZWjG/9aGhoWIqKigQEBALaDAICLS0tMDAwWFgxMTGJiYmRkZHx8fH09PRlZWUMDN7e3gE=",3,15,49,33,3.34,0.634,0.0294],[4,"Tier IV • Elite do Alto Trono","AgICAwMDAAAAAgICAwMDAAAAAQEAAAACAgIAAAEBAQEBAgICAgICAgEBAgIAAAMDAwMDAwABAAACAwMBBAEBAQMAAAABAQEBAQEBAQICAgICAgMDAgICAAAAAgICAgICAgICAY+Pj1NTU////ysrK1VVVXl5eQAA/v7+Kioqc3MJCQkHB/v7Mvj4lZXj45iYgIBXV1dWVlaMb4+P/V9f5QxoaGhYioqKBAQEAtoMAgItLS0wMDBYWDExMYmJiZGRkfHx8fT09GU=",5,21,45,29,3.53,0.723,0.0276],[5,"Tier V • Campeão Soberano Ápice","AgICAwMDAAAAAgICAwMDAAAAAQEAAAACAgIAAAAAAQEBAAABAQICAgICAgIBAQICAAADAwMDAwMAAQAAAgIDAwEDAwQBAQIBAgICAQEBAwAAAAMAAAABAQEBAQMCAwMCAQEBAI+Pj1NTU////ysrK1VVVXl5eQAA/v7+Kioqfn5zcwkJCXJyBwf7+zL4+JWV4+OYmICAV1dXVlZWjG+Pj5r9X1/lAQEMDw82Czs7n2hoaF10goJYioqKBAQEa3Jg/15e/wLaDH8=",10,42,22,26,3.91,0.772,0.0255]]
  },
  "mono_red_blitz": {
    "archetypeId": "mono_red_blitz",
    "domain": "red",
    "name": "Blitz Salamandra",
    "subtitle": "Mono-Vermelho 🔥 • Ímpeto & Pele Incandescente",
    "strategySummary": "Assalto relâmpago com tropas de Ímpeto, Fúria Crescente e Pele Incandescente que punem qualquer bloqueio inimigo.",
    "tacticalIdentity": "aggro",
    "coverCardId": "red_157_dragao_tiamat_carmesim",
    "generationsEvolved": 22,
    "matchesSimulated": 8752,
    "seedWinRate": 0.643,
    "championWinRate": 0.44,
    "championDeckJaccardStability": 1,
    "medianCardCi95HalfWidth": 0.0286,
    "learnedProfile": {"deckId":"mono_red_blitz","deckName":"Blitz Salamandra","archetypeTag":"aggro","generationsTrained":16,"matchesSimulated":7948,"baselineWinRate":0.643,"trainedWinRate":0.717,"weights":{"aggroFaceBias":1.46,"tradeValueBias":0.84,"guardianPriority":1,"flyingEvasionBias":0.96,"stackConsolidationBias":1,"antiAoeSpreadBias":1,"spellHoldPatience":0.99,"relicPriority":1,"ascensionEagerness":0.97,"bloodPactThresholdHp":20,"domainExpansionEagerness":1,"sovPowerTempoBias":1.21,"synergyHoldBonus":20,"mulliganCurveTarget":2.4},"mk":[694,205,3,11,600,0,201,693,457,1,791,502],"cp":[471,603,600,2,200,794,459,693,11,791],"ca":[0,1,2,3,11,201,205,460,502,508,600,692],"hb":[[0,11.7],[1,12.1],[2,12],[3,15.6],[11,16.8],[201,12],[205,18.4],[460,15.4],[502,9.1],[508,18.7],[600,15.2],[692,11.1],[693,12.8],[700,12.9],[791,16.1],[799,19.8],[800,15.4],[1028,24],[1034,19.4]],"sp":[[793,1034],[600,471],[692,1034],[791,508],[602,508],[1,693],[0,1034],[3,1034],[1034,502],[693,1034]],"dc":[[793,1034,0.843,0.219,53," (+22% WR | IC95% ±9.2%, n=53)"],[600,471,0.849,0.225,42," (+22% WR | IC95% ±10.0%, n=42)"],[692,1034,0.827,0.203,65," (+20% WR | IC95% ±8.7%, n=65)"],[791,508,0.806,0.182,109," (+18% WR | IC95% ±7.2%, n=109)"],[602,508,0.826,0.202,53," (+20% WR | IC95% ±9.6%, n=53)"],[1,693,0.771,0.147,406," (+15% WR | IC95% ±4.1%, n=406)"],[0,1034,0.802,0.178,76," (+18% WR | IC95% ±8.6%, n=76)"],[3,1034,0.805,0.181,67," (+18% WR | IC95% ±9.0%, n=67)"],[1034,502,0.814,0.189,49," (+19% WR | IC95% ±10.2%, n=49)"],[693,1034,0.802,0.178,71," (+18% WR | IC95% ±8.8%, n=71)"],[1,205,0.76,0.136,383," (+14% WR | IC95% ±4.2%, n=383)"],[11,460,0.751,0.127,745," (+13% WR | IC95% ±3.1%, n=745)"]]},
    "topShapleyCards": [[1028,0.3494,0.0512,0.2982,0.833,0.872,6],[516,0.349,0.1382,0.2109,0.833,0.88,12],[617,0.1834,-0.0552,0.2386,0.667,0.86,15],[471,0.1786,-0.1293,0.308,0.667,0.955,9],[799,0.1633,-0.0877,0.251,0.643,0.785,14],[200,0.163,0.0232,0.1399,0.644,0.822,45],[317,0.156,-0.095,0.251,0.643,0.931,14],[602,0.09,-0.0003,0.0903,0.56,0.601,116],[2,0.0695,0.0068,0.0627,0.516,0.132,244],[11,0.0662,0.0071,0.0591,0.509,0.052,275],[460,0.0586,-0.0007,0.0593,0.502,0.059,273],[1034,0.0576,-0.1466,0.2042,0.522,0.477,23]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AgICAQEBAAAAAQEBAQEBAAAAAQEBAQEDAwMDAwMBAgICAwMDAwMBAQEBAAAAAwMAAQAAAAAAAAEBAQAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQECAgICAlpaWsnJyQ8PD/b29vT09MjIyC4u9/f3HBwc+Pj4L1tbWxoaGRkZPcvLywoKCuzs2DDKysrT09PIyMgMDAwaGhodHR0eHh7Ly8stLS0uNzc3Ozs7x8fH0dHR1dXV9fX1AgICWVk=",0,4,25,71,2.37,0.051,0.0127],[2,"Tier II • Guarnição Regular","AgICAQEBAAAAAAAAAQEBAQEBAAAAAAAAAAAAAAABAQEBAQMDAwMDAwECAgIDAwMDAwEBAQECAgIAAAADAwAAAwMAAAEDAQEBAAEBAQEBAQEBAQMAAAACAgIBAQMDAwEBAQEBAVpaWsnJycnJyQ8PD/b29vT09AAAAMjIyAEBAgICLi739/ccHBz4+PgvW1tbGhoZGRk9y8vLtLS0CgoK7OzY2B0dz88wIC8vLgHHx8fGxsb4+PgaysrKsrKyMDAWFhb19fUtLS0=",1,9,36,54,2.4,0.308,0.0292],[3,"Tier III • Bastião Veterano","AgICAQEBAAAAAAAAAQEBAQEBAAAAAgICAAAAAAAAAAABAQEBAQICAgMDAwMDAwECAgIDAwMDAwEBAQECAgIAAAADAwAAAwMAAAIDAgEBAwECAAEBAAMBAQEBAQEBAAAAAQEBAFpaWsnJycnJyQ8PD/b29vT09AAAAFhYWMjIyAEBAgICLi739/e1tbUcHBz4+PgvW1tbGhoZGRk9y8vLtLS0CgoK7OzY2B0dz8+8H2kw1yDXBAEvL9IaLsfHx/j4+MrKysbGxiE=",2,15,38,45,2.61,0.622,0.0282],[4,"Tier IV • Elite do Alto Trono","AgICAQEBAAAAAAAAAQEBAQEBAAAAAgICAAAAAAAAAAABAQEBAQICAgAAAAMDAwMDAwECAgIDAwMDAwEBAQECAgIDAwMAAAABAQEDAwAAAwMAAAIDAgEBAwECAQABAQADAQMCAVpaWsnJycnJyQ8PD/b29vT09AAAAFhYWMjIyAEBAgICLi739/e1tbUDAwMcHBz4+PgvW1tbGhoZGRk9y8vLtLS0FxcXCgoKzMzM7OzY2B0dz8+8H2kw1yDXBD0BLy/SGi4fvMc=",2,18,40,40,2.77,0.725,0.0262],[5,"Tier V • Campeão Soberano Ápice","AgICAQEBAAAAAAAAAQEBAQEBAAAAAAAAAgICAAAAAAAAAAABAQEBAQICAgAAAAAAAAMDAwMDAwECAgIEAwMEAwMDAQEBAQECAgIDAwMAAAABAQEDAwAAAwMAAAIDAgEBAwECAVpaWsnJycnJyQ8PD/b29vT09AsLCwAAAFhYWMjIyAEBAgICLi739/e1tbXNzc0DAwMcHBz4+PgvW1tbChoaBBkZGT38y8vLtLS0FxcXCgoKzMzM7OzY2B0dz8+8H2kw1yDXBD0=",4,16,40,40,2.79,0.773,0.0245]]
  },
  "mono_red_pyroclasm": {
    "archetypeId": "mono_red_pyroclasm",
    "domain": "red",
    "name": "Artilharia Piroclástica",
    "subtitle": "Mono-Vermelho 🔥 • Queima Direta & Cataclismos",
    "strategySummary": "Varre fileiras inimigas com erupções vulcânicas, armadilhas de magma e dano direto letal contra o Soberano rival.",
    "tacticalIdentity": "control",
    "coverCardId": "red_138_colosso_vulcano_primordial",
    "generationsEvolved": 22,
    "matchesSimulated": 8612,
    "seedWinRate": 0.429,
    "championWinRate": 0.327,
    "championDeckJaccardStability": 1,
    "medianCardCi95HalfWidth": 0.0398,
    "learnedProfile": {"deckId":"mono_red_pyroclasm","deckName":"Artilharia Piroclástica","archetypeTag":"control","generationsTrained":16,"matchesSimulated":7808,"baselineWinRate":0.429,"trainedWinRate":0.517,"weights":{"aggroFaceBias":1.25,"tradeValueBias":1.14,"guardianPriority":0.99,"flyingEvasionBias":0.89,"stackConsolidationBias":1,"antiAoeSpreadBias":1,"spellHoldPatience":1.3,"relicPriority":1,"ascensionEagerness":1,"bloodPactThresholdHp":24,"domainExpansionEagerness":1,"sovPowerTempoBias":1,"synergyHoldBonus":25,"mulliganCurveTarget":3},"mk":[457,11,300,502],"cp":[1022,6,34,23,602,5,502,609,313,24],"ca":[1,6,11,29,34,201,207,209,215,300,463,502],"hb":[[1,10.2],[6,11.2],[11,23.4],[29,11.8],[34,14.5],[201,13.5],[207,14.6],[209,19.2],[215,24],[300,21.7],[463,24],[502,22.2],[508,22.6],[509,24],[609,7.9],[612,9],[701,14.8],[703,10.1],[707,20.2],[791,13.8],[792,13.2],[798,15.1],[800,24],[1034,23.3]],"sp":[[792,800],[791,800],[800,29],[1,800],[800,300],[11,800],[463,502],[792,463],[300,463],[201,463]],"dc":[[792,800,0.845,0.355,46," (+35% WR | IC95% ±9.7%, n=46)"],[791,800,0.847,0.356,40," (+36% WR | IC95% ±10.3%, n=40)"],[800,29,0.839,0.349,44," (+35% WR | IC95% ±10.1%, n=44)"],[1,800,0.822,0.332,45," (+33% WR | IC95% ±10.4%, n=45)"],[800,300,0.821,0.331,39," (+33% WR | IC95% ±11.1%, n=39)"],[11,800,0.814,0.324,48," (+32% WR | IC95% ±10.3%, n=48)"],[463,502,0.751,0.261,175," (+26% WR | IC95% ±6.3%, n=175)"],[792,463,0.744,0.254,174," (+25% WR | IC95% ±6.4%, n=174)"],[300,463,0.74,0.25,183," (+25% WR | IC95% ±6.2%, n=183)"],[201,463,0.729,0.239,201," (+24% WR | IC95% ±6.0%, n=201)"],[207,463,0.747,0.256,85," (+26% WR | IC95% ±8.9%, n=85)"],[29,463,0.723,0.232,178," (+23% WR | IC95% ±6.5%, n=178)"]]},
    "topShapleyCards": [[800,0.2544,-0.081,0.3355,0.625,0.869,8],[35,0.2075,0.0543,0.1532,0.575,0.807,40],[317,0.2063,-0.0157,0.222,0.579,0.911,19],[463,0.1806,0.0362,0.1444,0.522,0.281,46],[1034,0.1776,-0.0009,0.1785,0.533,0.571,30],[516,0.1451,-0.0205,0.1656,0.514,0.842,35],[509,0.1265,-0.062,0.1885,0.481,0.557,27],[798,0.1058,0.0057,0.1001,0.453,0.395,95],[701,0.0983,-0.0768,0.1752,0.452,0.523,31],[215,0.0827,-0.0257,0.1083,0.425,0.304,80],[11,0.0779,0.0219,0.056,0.409,0.075,296],[207,0.0778,-0.004,0.0818,0.41,0.103,139]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AAAAAwMDAQEBAgICAwMDAwAAAAAAAAICAgAAAAIAAAAAAAAAAQEBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAgICAgICAgICAgICAgEBARgYGMnJyVpaWh0d/v4hISEdHR1kZGQICAi/H8rKytPT08jIyAICAgoKCgwMDA8PDxoaGh4eHsjIyMvLyy0tLS4uLjc3Nzs7O8fHx9HR0dXV1fX19QICAllZWWNjY7Ozs74=",0,4,17,79,2.26,0.051,0.0127],[2,"Tier II • Guarnição Regular","AAAAAwMDAQEBAwMDAAAAAgICAwMDAwAAAwMAAAAAAAAAAAAAAgICAgAAAAIAAgIBAQEAAAAAAAACAgIAAAACAgICAgIAAAABAQEBAQEBAQICAgEBAQAAAAICAgEBAQMDAwAAAAEBARgYGMnJyRcXF8nJyVpaWh4eHR3Pz/7+FyIiIiEhIR0dHWZkZGQICAi/H7+/PDw81NTU09PTZ2dnGRkZAwMDvr6+Hh4eNzc3Ozs70dG1tbX39/fOzs63t7f5+fn4+PgEBAQ=",1,9,58,32,2.79,0.308,0.0292],[3,"Tier III • Bastião Veterano","AAAAAwMDAQEBAwMDAAAAAgICAAMDAwMAAAMDAAAAAAAAAgAAAAAAAAAAAAIDAgICAAAAAgIAAAAAAgICAgEBAQAAAAICAgAAAAAAAAICAgICAgAAAAEAAAACAgIBAQECAgIBAQEBARgYGMnJyRcXF8nJyVpaWtEeHh0dz8/+/hcXBQUGBmEiIiIhISEdHR1mJWRkZAgICL/DH9fX18PDv788PDzU1NRnZ2fT09MZGRkDAwO+vr4eHh43zs7OtbW19/f3t7e3+fk=",3,15,57,25,2.97,0.622,0.0282],[4,"Tier IV • Elite do Alto Trono","AAAAAwMDAQEBAwMDAAAAAgICAAMDAwMAAAMDAQAAAAAAAAICAQEEAAAAAAAAAAAAAAAAAgMCAgIAAAACAgAAAAACAgICAQEBAAAAAgICAAAAAAAAAgICAgIAAAACAgIBAQECAgEBARgYGMnJyRcXF8nJyVpaWtEeHh0dz8/+/vwXFwUFBgZhYT09CiPY2CIiIiEhIR0dHWYlZGRkCAgIv8Mf19fXw8O/vzw8PNTU1GdnZ9PT0xkZGQMDA76+zs7OtbW19/f3t7c=",5,21,54,20,3.09,0.725,0.0262],[5,"Tier V • Campeão Soberano Ápice","AAAAAAAAAQEBAwMDAQEBAwMDAAAAAgICAQEBAAMDAwMAAAEDAwEAAAAAAAACAgEBBAAAAAAAAQEAAAACAgAAAAAAAAICAwIDAAABAQEBAwMCAgICAgIAAAACAAAAAgMBAgAAAAsLCwEBASwsLBgYGMnJyRcXF8nJyVpaWvb29tEeHh0dz8/P/v78FxcFBQYGYWE9PQoj2NggIDo6IiIiBAQhISEdHR0BASBmJdnZOTn+/iQkZGRkvcTEGNbWwQgICL8p/cMfI9c=",10,44,22,24,3.55,0.773,0.0245]]
  },
  "mono_red_dragon": {
    "archetypeId": "mono_red_dragon",
    "domain": "red",
    "name": "Trono Dracônico",
    "subtitle": "Mono-Vermelho 🔥 • Voo, Sopro & Ascensão",
    "strategySummary": "Domina os céus com wyverns e dragões anciãos de Voo, Sopro Elemental e Ascensão, ignorando bloqueadores terrestres.",
    "tacticalIdentity": "midrange",
    "coverCardId": "red_08_dragao_vermelho",
    "generationsEvolved": 22,
    "matchesSimulated": 8128,
    "seedWinRate": 0.488,
    "championWinRate": 0.359,
    "championDeckJaccardStability": 0.961,
    "medianCardCi95HalfWidth": 0.0522,
    "learnedProfile": {"deckId":"mono_red_dragon","deckName":"Trono Dracônico","archetypeTag":"midrange","generationsTrained":16,"matchesSimulated":7324,"baselineWinRate":0.488,"trainedWinRate":0.6,"weights":{"aggroFaceBias":1.18,"tradeValueBias":1,"guardianPriority":1,"flyingEvasionBias":1.38,"stackConsolidationBias":1,"antiAoeSpreadBias":1,"spellHoldPatience":1.02,"relicPriority":0.96,"ascensionEagerness":1.28,"bloodPactThresholdHp":24,"domainExpansionEagerness":1.27,"sovPowerTempoBias":1,"synergyHoldBonus":19,"mulliganCurveTarget":3},"mk":[300,205,11,457],"cp":[35,217,206,300,23,700,20,699,798,796],"ca":[2,3,7,11,21,205,300,310,460,464,509,605],"hb":[[2,11.4],[3,12.9],[7,23.2],[11,17.5],[21,24],[205,14.3],[300,24],[310,24],[460,13.8],[464,24],[509,24],[605,19.3],[610,24],[791,15.2],[799,24],[1028,24],[1034,24]],"sp":[[2,1034],[605,1034],[11,1034],[300,464],[509,11],[610,300],[1034,300],[2,310],[610,205],[509,791]],"dc":[[2,1034,0.885,0.397,47," (+40% WR | IC95% ±8.5%, n=47)"],[605,1034,0.887,0.399,39," (+40% WR | IC95% ±9.1%, n=39)"],[11,1034,0.876,0.388,51," (+39% WR | IC95% ±8.5%, n=51)"],[300,464,0.858,0.37,79," (+37% WR | IC95% ±7.4%, n=79)"],[509,11,0.843,0.354,77," (+35% WR | IC95% ±7.8%, n=77)"],[610,300,0.842,0.354,64," (+35% WR | IC95% ±8.5%, n=64)"],[1034,300,0.84,0.351,63," (+35% WR | IC95% ±8.6%, n=63)"],[2,310,0.817,0.329,60," (+33% WR | IC95% ±9.3%, n=60)"],[610,205,0.805,0.317,56," (+32% WR | IC95% ±9.8%, n=56)"],[509,791,0.788,0.299,65," (+30% WR | IC95% ±9.4%, n=65)"],[21,300,0.786,0.297,69," (+30% WR | IC95% ±9.2%, n=69)"],[205,464,0.78,0.292,67," (+29% WR | IC95% ±9.4%, n=67)"]]},
    "topShapleyCards": [[509,0.3104,0.0938,0.2166,0.706,0.721,17],[310,0.2658,-0.0009,0.2667,0.667,0.829,12],[610,0.2424,-0.0086,0.251,0.643,0.821,14],[1034,0.2394,0.0384,0.201,0.636,0.75,22],[799,0.2376,-0.0134,0.251,0.643,0.916,14],[21,0.2361,0.0192,0.2169,0.632,0.721,19],[695,0.0863,-0.0253,0.1116,0.481,0.696,77],[605,0.0797,0.0174,0.0623,0.443,0.069,244],[300,0.0793,0.0269,0.0524,0.441,0.036,345],[463,0.0757,-0.109,0.1847,0.464,0.582,28],[11,0.0718,0.0211,0.0507,0.436,0.094,367],[205,0.0611,0.0061,0.055,0.423,0.04,310]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AQEBAAAAAAAAAQEBAwMDAAAAAQEBAQEBAAAAAAAAAwMDAgICAQADAQEBAgIAAgIAAAAAAgEAAQECAAACAAAAAQIAAgAAAAMDAwMAAAEBAQEAAAACAgMDAwEAAAICAAAAAQABAywsLAsLCwICAsnJyRcXFwwMDMfHxy0tLc3NzQMDAxwcHF1dXTAQG8zMzFxcEFy3BM7OzrX3EjAwXswSXhLMIta2EF7M1dX4+CMjBATLy/f3Dg4OtbUbG/jLIiK3tx8f1TgfOCM=",0,0,79,21,3.07,0.051,0.0127],[2,"Tier II • Guarnição Regular","AQEBAAAAAAAAAQEBAwMDAAAAAQEBAQEBAAAAAAAAAwMDAgICAQADAQEBAgIAAgIAAAAAAgEAAQECAAACAAAAAAIAAgAAAAMDAQEAAAEBAQEAAAACAgMDAwEAAAICAAAAAQABAywsLAsLCwICAsnJyRcXFwwMDMfHxy0tLc3NzQMDAxwcHF1dXTAQG8zMzFxcEFy3BM7OzrX3EjAwXswSXhLMIyO2EF7M1dX4+D09BATLy/f3Dg4OtbUbG/jLCQm3tx8f1TgfOCM=",0,6,73,21,3.11,0.308,0.0292],[3,"Tier III • Bastião Veterano","AQEBAAAAAAAAAQEBAwMDAAAAAQEBAQEBAAAAAAAAAwMDAgICAQEAAQEBAAAAAAIDAAAAAAIAAQEBAAACAAAAAAIDBAAAAAEBAQEDAwMDAgIAAAAAAAICAQMAAAICAAACAQABAiwsLAsLCwICAsnJyRcXFwwMDMfHxy0tLc3NzQMDAxwcHF1dXcsw0czMzBcXExO3G87OzgS1EsvL/cwSXhLMIyO6HQrM1dX39z09Gxv4+LW1Dg4OBAReXvf4CQm3tx8fATgfOAE=",3,14,62,21,3.36,0.622,0.0282],[4,"Tier IV • Elite do Alto Trono","AQEBAAAAAAAAAQEBAwMDAAAAAQEBAQEBAAAAAAAAAwMDAgICAwMAAQEBAAAAAAICAAAAAwAAAQEBAAABAAQAAAIDBAAAAAICAQECAgAAAAAAAAADAwAAAgEAAAICAAACAQABAiwsLAsLCwICAsnJyRcXFwwMDMfHxy0tLc3NzQMDAxwcHF1dXR4e0czMzBcXExO3Xs7OzhsEEjQ0/cwSNhIEIyO6HQoV2dm1tT09Xl7Q0AQEDg4OGxvMzLX3CQm3tx8fATgfOAE=",6,22,51,21,3.65,0.725,0.0262],[5,"Tier V • Campeão Soberano Ápice","AQEBAAAAAAAAAQEBAwMDAAAAAQEBAQEBAAAAAAAAAwMDAgICAwMAAQEBAAAAAAICAAAAAAABAQEBAAIBAQQAAAIDBAAAAAAAAQEDAwAAAgIAAAAAAAICAwMAAAICAAACAQABAiwsLAsLCwICAsnJyRcXFwwMDMfHxy0tLc3NzQMDAxwcHF1dXR4e0czMzBcXExO3vM7OzhYWzzQ0/QdiNtAEIyO6HQoV2dkFBT09Hx/Q0GBgDg4OFBS7u/LyCQm3tx8fATgfOAE=",10,37,32,21,4.06,0.773,0.0245]]
  },
  "mono_blue_frost": {
    "archetypeId": "mono_blue_frost",
    "domain": "blue",
    "name": "Inverno Eterno",
    "subtitle": "Mono-Azul ❄️ • Congelar & Estase Tática",
    "strategySummary": "Paralisa a Vanguarda inimiga turno após turno com Congelar em área e elementais glaciais enquanto dita o ritmo da mesa.",
    "tacticalIdentity": "tempo",
    "coverCardId": "blue_136_leviata_cronos",
    "generationsEvolved": 22,
    "matchesSimulated": 7768,
    "seedWinRate": 0.619,
    "championWinRate": 0.488,
    "championDeckJaccardStability": 0.887,
    "medianCardCi95HalfWidth": 0.0452,
    "learnedProfile": {"deckId":"mono_blue_frost","deckName":"Inverno Eterno","archetypeTag":"tempo","generationsTrained":16,"matchesSimulated":6964,"baselineWinRate":0.619,"trainedWinRate":0.567,"weights":{"aggroFaceBias":1.08,"tradeValueBias":1.22,"guardianPriority":1,"flyingEvasionBias":1,"stackConsolidationBias":1,"antiAoeSpreadBias":1,"spellHoldPatience":1.22,"relicPriority":1,"ascensionEagerness":1.03,"bloodPactThresholdHp":24,"domainExpansionEagerness":1,"sovPowerTempoBias":1,"synergyHoldBonus":27,"mulliganCurveTarget":2.9},"mk":[67,43,619,620,53,710],"cp":[534,321,620,519,54,57,38,530,625,401],"ca":[37,53,54,57,70,223,625,816,1029,1035],"hb":[[37,21],[53,11.1],[54,21.7],[57,15],[70,18.9],[223,13.1],[621,6.6],[625,11.5],[816,24],[1029,18],[1035,21.9]],"sp":[[816,70],[816,54],[816,223],[816,1029],[1029,223],[54,70],[1035,54],[54,57],[69,70],[816,57]],"dc":[[816,70,0.814,0.273,84," (+27% WR | IC95% ±8.0%, n=84)"],[816,54,0.756,0.215,513," (+21% WR | IC95% ±3.7%, n=513)"],[816,223,0.746,0.205,509," (+21% WR | IC95% ±3.8%, n=509)"],[816,1029,0.782,0.24,89," (+24% WR | IC95% ±8.3%, n=89)"],[1029,223,0.769,0.228,140," (+23% WR | IC95% ±6.8%, n=140)"],[54,70,0.765,0.224,142," (+22% WR | IC95% ±6.8%, n=142)"],[1035,54,0.758,0.217,187," (+22% WR | IC95% ±6.0%, n=187)"],[54,57,0.743,0.202,289," (+20% WR | IC95% ±5.0%, n=289)"],[69,70,0.752,0.211,134," (+21% WR | IC95% ±7.1%, n=134)"],[816,57,0.734,0.193,166," (+19% WR | IC95% ±6.6%, n=166)"],[1035,223,0.731,0.19,168," (+19% WR | IC95% ±6.6%, n=168)"],[53,70,0.741,0.2,109," (+20% WR | IC95% ±8.0%, n=109)"]]},
    "topShapleyCards": [[1035,0.1743,0.039,0.1353,0.689,0.541,45],[54,0.1081,0.0539,0.0541,0.602,0.125,314],[1029,0.0835,-0.116,0.1995,0.609,0.753,23],[816,0.0651,-0.0147,0.0798,0.568,0.299,148],[625,0.0626,-0.0394,0.102,0.578,0.552,90],[37,0.0533,-0.0457,0.0991,0.546,0.11,97],[53,0.0506,-0.0081,0.0587,0.551,0.252,276],[223,0.0475,-0.0118,0.0593,0.546,0.221,271],[57,0.032,-0.0651,0.0971,0.545,0.5,101],[811,0.0237,-0.0629,0.0866,0.543,0.64,127],[533,0.0186,-0.0374,0.056,0.516,0.203,306],[621,0.0177,-0.0467,0.0644,0.524,0.371,231]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AAAAAQEBAQEDAwMBAQECAgICAgICAgICAgIBAQEAAAICAAAAAgAAAAICAAAAAgICAwMDAgIDAgICAAAAAAEBAAAAAQEBAQEBAAAAAAACAgIAAAACAgIAAAACAQIAAwAAAAMAA93d3T8/P5GRKysrQUFBa2trxsbGBwcHbGxsQEBALy/JyTY2Nm4mJibIyDU1NW1tbS4uLm7ILAgIbiUzMzNCQujo6E1NQpOTkzQ0RUVFFRUVNC8lycrK5eXlyk0IJfnf398sQyw=",0,0,71,29,2.77,0.047,0.012],[2,"Tier II • Guarnição Regular","AAAAAQEBAQEDAwMBAQECAgICAgICAgICAgIBAQEAAAIBAAAAAgAAAAICAAAAAgICAwMDAgIDAgICAAAAAAEBAAAAAQEBAQEBAAAAAAACAgIAAAACAgIAAAACAQIAAgAAAAMAA93d3T8/P5GRKysrQUFBa2trxsbGBwcHbGxsQEBALy/JRTY2Nm4mJibIyDU1NW1tbS4uLm7ILAgIbiUzMzNCQujo6E1NQpOTkzQ0RUVFFRUVNC8lyxYW5eXle00IJXvf398sQyw=",0,6,65,29,2.81,0.36,0.0283],[3,"Tier III • Bastião Veterano","AAAAAQEBAQEDAwMBAQECAgICAgICAgICAgIBAQEAAwEBAAAAAQAAAAICAAAAAgICAwMDAwIAAAAEAAAAAAEBAAAAAQEBAQEBAgIAAAACAgICAAACAgIAAAACAgIAAgAAAAMAA93d3T8/P5GRKysrQUFBa2trxsbGBwcHbGxsQEBANDBFRTY2NpcmJiZubjU1NW1tbS4uLixuP0ZGCyUzMzNCQujo6E5OQpOTk8jIRUVFFRUVyDQlyxYW5eXle3l5JXvf398sQyw=",3,14,54,29,2.94,0.53,0.0291],[4,"Tier IV • Elite do Alto Trono","AAAAAQEBAQEDAwMBAQECAgICAgICAgICAgIBAQEDAwEBAAAAAQAAAAAAAAAAAgICAwMDAQIAAAAEAAAAAAEBAAAAAQEBAQIEAAAAAAACAgICAgACAgIAAAACAgIAAgAAAAMAAN3d3T8/P5GRKysrQUFBa2trxsbGBwcHbGxsQEBAMDBFRTY2NpcmJiY5OTU1NW1tbS4uLpNxP0ZGCyUzMzNCQujo6E5OQpPPBefnRUVFFRUV1NQlyxYW5eXle3l5JXvf398sQ+I=",6,22,43,29,3.26,0.772,0.0245],[5,"Tier V • Campeão Soberano Ápice","AAAAAQEBAQEDAwMBAQECAgICAgICAgICAgIBAQEDAwEBAAAAAQAAAAAAAAAAAgICAwMDAgIAAAAEAAAAAAADAAAAAQEDAgIEAAAAAAACAgICAgACAgIAAAACAgIAAgAAAAMAAN3d3T8/P5GRKysrQUFBa2trxsbGBwcHbGxsQEBAMDBFRTY2NpcmJiY5OTU1NW1tbS4uLnFxP0ZGCyUzMzNEOOjo6E5OMdXPBefnRUVFFRUV1NQlyxYW5eXle3l5JXvf398sQ+I=",10,23,38,29,3.43,0.794,0.0236]]
  },
  "mono_blue_chrono": {
    "archetypeId": "mono_blue_chrono",
    "domain": "blue",
    "name": "Conclave Cronomante",
    "subtitle": "Mono-Azul ⚡ • Compra, Reações & Feitiços",
    "strategySummary": "Gera vantagem massiva de cartas, aciona gatilhos de conjuração arcana e neutraliza jogadas rivais com reações e devoluções.",
    "tacticalIdentity": "control",
    "coverCardId": "blue_45_oraculo_abissal",
    "generationsEvolved": 22,
    "matchesSimulated": 8268,
    "seedWinRate": 0.369,
    "championWinRate": 0.391,
    "championDeckJaccardStability": 1,
    "medianCardCi95HalfWidth": 0.18,
    "learnedProfile": {"deckId":"mono_blue_chrono","deckName":"Conclave Cronomante","archetypeTag":"control","generationsTrained":16,"matchesSimulated":7464,"baselineWinRate":0.369,"trainedWinRate":0.517,"weights":{"aggroFaceBias":0.94,"tradeValueBias":1.3,"guardianPriority":1,"flyingEvasionBias":1,"stackConsolidationBias":1,"antiAoeSpreadBias":1,"spellHoldPatience":1.31,"relicPriority":1.12,"ascensionEagerness":1,"bloodPactThresholdHp":24,"domainExpansionEagerness":1,"sovPowerTempoBias":1,"synergyHoldBonus":20,"mulliganCurveTarget":3},"mk":[67,44,37,416,618],"cp":[230,224,1011,717,403,618,219,330,529,630],"ca":[37,224,226,1035],"hb":[[37,24],[218,6.5],[222,8.1],[224,9.9],[226,24],[1035,24]],"sp":[[1035,224],[224,226],[1035,226],[218,226],[222,226],[224,334],[226,334],[815,226],[1035,334],[222,224]],"dc":[[1035,224,0.719,0.263,98," (+26% WR | IC95% ±8.6%, n=98)"],[224,226,0.699,0.243,121," (+24% WR | IC95% ±7.9%, n=121)"],[1035,226,0.698,0.243,81," (+24% WR | IC95% ±9.6%, n=81)"],[218,226,0.655,0.2,409," (+20% WR | IC95% ±4.6%, n=409)"],[222,226,0.649,0.194,331," (+19% WR | IC95% ±5.1%, n=331)"],[224,334,0.693,0.238,60," (+24% WR | IC95% ±11.0%, n=60)"],[226,334,0.69,0.235,40," (+23% WR | IC95% ±13.2%, n=40)"],[815,226,0.674,0.219,50," (+22% WR | IC95% ±12.2%, n=50)"],[1035,334,0.683,0.228,39," (+23% WR | IC95% ±13.4%, n=39)"],[222,224,0.597,0.142,496," (+14% WR | IC95% ±4.3%, n=496)"],[222,334,0.595,0.14,175," (+14% WR | IC95% ±7.1%, n=175)"],[218,222,0.546,0.091,1360," (+9% WR | IC95% ±2.6%, n=1360)"]]},
    "topShapleyCards": [[1035,0.2621,0.131,0.1311,0.688,0.696,48],[334,0.1563,0.0055,0.1508,0.585,0.77,41],[226,0.0957,-0.0106,0.1063,0.506,0.393,85],[224,0.0482,-0.0313,0.0795,0.464,0.497,151],[222,0.0297,-0.0224,0.0521,0.432,0.241,347],[218,0.005,-0.0414,0.0464,0.401,0.108,429],[404,-0.0373,-0.1047,0.0674,0.374,0.411,198],[815,-0.056,-0.2237,0.1677,0.375,0.808,32]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AwMDAgICAQEBAgICAAAAAgICAQEBAQEAAAABAQECAgEBAQAAAAAAAAAAAAICAgICAgICAAIAAAAAAAAAAAAAAAABAQEBAQECAgIAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQICAioqKsjIyD4+PgYGBtvb22pqapKSkkVFJiYmQkJCzc2Tk5MzMzNDQ0Po6OgRERF0dHTS0kHSMTExNTU1QEBA3NzcSEhImpqaDw8PPT09Pj4+QUHj4+Pk5OQ/Pz9AQECRkZEHBwc=",0,4,30,66,2.46,0.047,0.012],[2,"Tier II • Guarnição Regular","AwMDAQECAgIBAQECAgIAAAACAgIBAQEDAQEAAAABAQECAgICAwMBAQEBAAAAAAAAAAAAAgICAgICAgIAAgEBAQAAAAAAAAAAAQEBAgICAwMDAQEBAgICAgIDAwMCAgIBAAAAACoqKpSUyMjIPj4+BgYG29vbampqkpKSL0VFJiYmQkJCzc3Ly/Pzk5OTSzMzM0NDQ+jo6BEREXR0dNLSQdJISEhBQSsrK0BAQJ+fn3V1dTQ0NJqamtbW1hAQLCwsbm5ulDY2NjU=",1,9,59,31,2.81,0.36,0.0283],[3,"Tier III • Bastião Veterano","AwMDAQECAgIBAQECAgIAAAACAgIBAQEDAQEAAAABAQECAgICAwMBAQEAAAAAAAABAAAAAAAAAAAAAAACAgICAgICAgACAQEBAAADAwMCAgIAAAAAAAABAQEDAwMCAgIBAAAAACoqKpSUyMjIPj4+BgYG29vbampqkpKSL0VFJiYmQkJCzc3Ly/Pzk5OTR0fr6y0tSz9EMzMzQ0ND6OjoERERdHR00tJB0khISEFBNDQ01tbWKysrQEBAn5+fLCwsbm5ulDY2NjU=",3,15,54,28,2.88,0.53,0.0291],[4,"Tier IV • Elite do Alto Trono","AwMDAQEAAAACAgIBAQECAgIAAAACAgIBAQEDAQEAAAABAQECAgICAwMBAQEAAAAAAAABAQEBAQEBAAADAAAAAAAAAAAAAgICAgICAgICAAIBAQEAAAMDAwICAgADAwMCAgIBACoqKpSU2trayMjIPj4+BgYG29vbampqkpKSL0VFJiYmQkJCzc3Ly/Pzk5OTR0fr6y0tSkpLT0+goD9EODMzM0NDQ+jo6NURERF0dHTS0kHSSEhIQUE0NDTW1tYrLCwsbm5ulDY=",5,21,47,27,2.9,0.772,0.0245],[5,"Tier V • Campeão Soberano Ápice","AwMDAQEAAAACAgIBAQECAgIAAAACAgIBAQEDAQEAAAAAAQEBAAACAgICAwMAAAABAQEAAAAAAAABAQEBAQEBBAAAAAADAQICAAAAAAAAAAAAAAADAwICAgICAgICAgICAAICAioqKpSU2trayMjIPj4+BgYG29vbampqkpKSL0VFJiYm4kJCQuDgzc3Ly/Pz3t7ek5OTR0fr6y0tSkpLT0+goAs/5+dEOE7U1DMzM0NDQ+jo6ObmNjbVdnYRERF0dHTS0kHSz3k=",8,35,35,22,3.24,0.794,0.0236]]
  },
  "mono_blue_abyssal": {
    "archetypeId": "mono_blue_abyssal",
    "domain": "blue",
    "name": "Frota Abissal",
    "subtitle": "Mono-Azul 🌊 • Voo, Alcance & Leviatãs",
    "strategySummary": "Combina batedores aéreos de Voo/Alcance na Retaguarda com leviatãs oceânicos colossais para pressão evasiva implacável.",
    "tacticalIdentity": "midrange",
    "coverCardId": "blue_06_dragao_azul",
    "generationsEvolved": 22,
    "matchesSimulated": 7696,
    "seedWinRate": 0.619,
    "championWinRate": 0.363,
    "championDeckJaccardStability": 0.887,
    "medianCardCi95HalfWidth": 0.0566,
    "learnedProfile": {"deckId":"mono_blue_abyssal","deckName":"Frota Abissal","archetypeTag":"midrange","generationsTrained":16,"matchesSimulated":6892,"baselineWinRate":0.619,"trainedWinRate":0.358,"weights":{"aggroFaceBias":1.18,"tradeValueBias":1.12,"guardianPriority":1,"flyingEvasionBias":1.42,"stackConsolidationBias":1,"antiAoeSpreadBias":1,"spellHoldPatience":1.05,"relicPriority":1,"ascensionEagerness":1,"bloodPactThresholdHp":24,"domainExpansionEagerness":1.22,"sovPowerTempoBias":1,"synergyHoldBonus":18,"mulliganCurveTarget":3},"mk":[37,36,318,811,218],"cp":[43,58,1023,811,70,622,406,54,715,36],"ca":[36,41,54,58,70,406,525,626,811,816,1029,1035],"hb":[[36,17.1],[37,19.4],[41,24],[54,24],[57,9.3],[58,24],[70,17.1],[218,5.6],[321,8.4],[406,14.4],[525,18.8],[626,24],[811,12.9],[813,9.1],[816,24],[1029,24],[1035,24]],"sp":[[816,54],[811,1035],[816,1035],[811,1029],[36,1035],[816,70],[1029,221],[1035,221],[811,816],[36,816]],"dc":[[816,54,0.769,0.293,346," (+29% WR | IC95% ±4.4%, n=346)"],[811,1035,0.792,0.316,86," (+32% WR | IC95% ±8.3%, n=86)"],[816,1035,0.81,0.333,42," (+33% WR | IC95% ±11.0%, n=42)"],[811,1029,0.805,0.329,46," (+33% WR | IC95% ±10.7%, n=46)"],[36,1035,0.763,0.286,100," (+29% WR | IC95% ±8.1%, n=100)"],[816,70,0.789,0.312,42," (+31% WR | IC95% ±11.4%, n=42)"],[1029,221,0.792,0.316,38," (+32% WR | IC95% ±11.9%, n=38)"],[1035,221,0.761,0.285,95," (+28% WR | IC95% ±8.3%, n=95)"],[811,816,0.732,0.256,308," (+26% WR | IC95% ±4.9%, n=308)"],[36,816,0.723,0.246,438," (+25% WR | IC95% ±4.2%, n=438)"],[626,58,0.775,0.299,48," (+30% WR | IC95% ±11.0%, n=48)"],[816,58,0.747,0.27,113," (+27% WR | IC95% ±7.8%, n=113)"]]},
    "topShapleyCards": [[1029,0.3966,0.2213,0.1753,0.8,0.804,20],[408,0.2624,0.0238,0.2386,0.667,0.821,15],[525,0.2153,0.0283,0.187,0.615,0.737,26],[41,0.1751,0.0111,0.164,0.571,0.663,35],[626,0.1635,-0.0034,0.1669,0.559,0.642,34],[57,0.1368,0.0084,0.1284,0.534,0.69,58],[1035,0.1276,-0.0861,0.2136,0.524,0.661,21],[58,0.1193,0.0241,0.0952,0.5,0.35,106],[624,0.1189,-0.0947,0.2136,0.524,0.835,21],[70,0.1057,-0.0265,0.1321,0.509,0.805,55],[406,0.0867,0.0118,0.0749,0.459,0.179,170],[718,0.0668,-0.0758,0.1427,0.468,0.761,47]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AAAAAQEBAAAAAAAAAQEBAwMDAAICAQEBAwAAAAIAAAAAAAECAgICAAADAwICAgIDAwMDAwAAAwMCAwIBAAAAAAEBAQAAAwACAgIAAAAAAgEBAQICAgICAAEBAgEBAwMDAAEBAN3d3ZSUlCQkJNra2pGRkSsrK9/IyEFBQS0u3y7HJiYm3NyVCQnKyt7eKiptbcfHLi4uLCze3Pn5yvltQzIy3zJDQ5M0NCoub29vNjY2NAlCQkIQEG5ubiuVlRBNkywtLSuTTSs=",0,0,76,24,2.89,0.047,0.012],[2,"Tier II • Guarnição Regular","AAAAAQEBAAAAAAAAAQEBAwMDAAICAQEBAwMAAQEAAAAAAAECAgICAAADAwICAgIDAwMDAwAAAwMCAwIBAAAAAAEBAQAAAwMCAgIAAAAAAgEBAQICAgICAAEBAgEBAwMDAAEBAN3d3ZSUlCQkJNra2pGRkSsrK9/IyEFBQS3t30VFJiYm3NyVCQnKyt7eKiptbcvLLi4uLCze3Pn5yvltQzIy3zJDQ5M0NCrtb29vNjY2NAlCQkIQEG5ubiuVlRBNkywtLSuTTSs=",0,6,76,18,2.99,0.36,0.0283],[3,"Tier III • Bastião Veterano","AAAAAQEBAAAAAAAAAQEBAwMDAAICAQEBAwMAAQEAAAAAAAIAAAICAwMCAgIBAgIDAwMBAQMAAgICAgQBAAAAAAEBAAICAgMCAgIAAAACAAEBAQICAgICAAEBAgEDAwMDAAEBAN3d3ZSUlCQkJNra2pGRkSsrK9/IyEFBQS3t30VFJiYm3t5wNDQJCfn5zc0Ml8vLLi4ulpb53srKCcoLQzIy3zJDQ9xtbXDtb29vNjY2bTRCQkIQEG5ubiuVlRBN//8tLSuTTSs=",3,14,70,13,3.26,0.53,0.0291],[4,"Tier IV • Elite do Alto Trono","AAAAAQEBAAAAAAAAAQEBAwMDAAICAQEBAwMAAQEAAAADAwICAgAAAgICAgIBAgIDAwMBAQIDAgIAAgQBAAAAAAIEAgEBAgMCAgIAAAABAgEBAQAAAgICAQEBAQEDAwMDAAEAAd3d3ZSUlCQkJNra2pGRkSsrK9/IyEFBQS3t30VFJiYm+flwbW00NMrKzc0Ml8vLLi4ulpbK+QkJNAkLmDIy3zLPBQtDQ3Dtb29vNjY2Q21CQkJGRm5ubk6VlU9P//8tLSuT604=",6,22,60,12,3.4,0.772,0.0245],[5,"Tier V • Campeão Soberano Ápice","AAAAAQEBAAAAAAAAAQEBAwMDAAICAQEBAwMAAQEAAAADAwIAAAAAAAACAgIBAgIDAwMBAQMDAAABAQQBAgADAgIEAgICAgMCAgIAAAAAAAEBAQAAAgICAQEBAQEDAwMDAQEAAd3d3ZSUlCQkJNra2pGRkSsrK9/IyEFBQS3t30VFJiYmMDBwOjrg4Dk5zc0Ml8vLLi4ulpbz8ygoREQLmHIpMQ3PBQvOznDtb29vNjY2PDxCQkJGRm5ubk6VlU9P//8tLaCT604=",10,41,37,12,3.94,0.794,0.0236]]
  },
  "mono_purple_crypt": {
    "archetypeId": "mono_purple_crypt",
    "domain": "purple",
    "name": "Culto da Cripta",
    "subtitle": "Mono-Roxo 💀 • Renascer & Reanimação",
    "strategySummary": "Transforma a Cripta em recurso infinito com tropas de Renascer, gatilhos de Último Suspiro e rituais de ressurreição.",
    "tacticalIdentity": "attrition",
    "coverCardId": "purple_99_lorde_vampiro_anciao",
    "generationsEvolved": 22,
    "matchesSimulated": 6384,
    "seedWinRate": 0.667,
    "championWinRate": 0.445,
    "championDeckJaccardStability": 1,
    "medianCardCi95HalfWidth": 0.0473,
    "learnedProfile": {"deckId":"mono_purple_crypt","deckName":"Culto da Cripta","archetypeTag":"attrition","generationsTrained":16,"matchesSimulated":5580,"baselineWinRate":0.667,"trainedWinRate":0.392,"weights":{"aggroFaceBias":1.05,"tradeValueBias":1.31,"guardianPriority":0.97,"flyingEvasionBias":1,"stackConsolidationBias":1,"antiAoeSpreadBias":1,"spellHoldPatience":0.95,"relicPriority":1.07,"ascensionEagerness":1.01,"bloodPactThresholdHp":24,"domainExpansionEagerness":1.22,"sovPowerTempoBias":0.98,"synergyHoldBonus":29,"mulliganCurveTarget":2.9},"mk":[743,1015,84,101,636],"cp":[1009,839,443,99,101,735,452,636,838,90],"ca":[76,84,101,103,346,446,545,731,735,741,839,1015],"hb":[[76,19.9],[84,12.8],[89,8.1],[93,8.3],[101,17.2],[103,16.5],[236,8.2],[346,21.9],[349,9.5],[446,24],[452,9.2],[545,24],[547,8.5],[636,7.8],[731,9.8],[735,16.5],[741,19],[839,24],[843,6.8],[1015,10.8],[1027,24],[1033,24]],"sp":[[545,84],[545,89],[545,636],[545,1015],[83,446],[76,839],[731,1033],[839,89],[642,446],[636,839]],"dc":[[545,84,0.915,0.334,71," (+33% WR | IC95% ±6.2%, n=71)"],[545,89,0.904,0.323,62," (+32% WR | IC95% ±6.9%, n=62)"],[545,636,0.884,0.303,50," (+30% WR | IC95% ±8.3%, n=50)"],[545,1015,0.875,0.294,70," (+29% WR | IC95% ±7.4%, n=70)"],[83,446,0.89,0.309,35," (+31% WR | IC95% ±9.5%, n=35)"],[76,839,0.861,0.28,106," (+28% WR | IC95% ±6.4%, n=106)"],[731,1033,0.87,0.289,67," (+29% WR | IC95% ±7.7%, n=67)"],[839,89,0.856,0.275,109," (+28% WR | IC95% ±6.4%, n=109)"],[642,446,0.865,0.284,57," (+28% WR | IC95% ±8.4%, n=57)"],[636,839,0.84,0.259,147," (+26% WR | IC95% ±5.8%, n=147)"],[735,839,0.846,0.264,88," (+26% WR | IC95% ±7.3%, n=88)"],[83,839,0.85,0.269,71," (+27% WR | IC95% ±7.9%, n=71)"]]},
    "topShapleyCards": [[1033,0.3605,0.2168,0.1437,0.84,0.684,25],[545,0.3597,0.238,0.1217,0.833,0.566,36],[839,0.3211,0.2154,0.1057,0.8,0.673,55],[446,0.2873,0.1521,0.1352,0.763,0.612,38],[741,0.28,0.1126,0.1674,0.76,0.695,25],[103,0.2666,0.1013,0.1653,0.741,0.578,27],[1027,0.261,-0.0391,0.3001,0.75,0.875,8],[99,0.2079,-0.0762,0.284,0.7,0.937,10],[346,0.1716,0.0513,0.1202,0.629,0.244,62],[644,0.1216,-0.0168,0.1383,0.604,0.746,48],[245,0.1158,-0.0695,0.1853,0.593,0.63,27],[452,0.1101,-0.0522,0.1623,0.6,0.893,35]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AAAAAwICAgEBAQAAAAMDAwEBAQMDAAACAgIBAQEDAwMBAQEAAAAAAgACAQACAQACAgAAAAAAAAEBAQICAgICAgICAgAAAAAAAAAAAAAAAAAAAAAAAQEBAQEBAQEBAQEBAQEBAVNTUz98fHzExMRISEhAQEBRUVFGRl1dgoKCYGBgS0tLU1NT7+/v+Ij4iFz4iFxkf+pKSkpVVVW2trYZGRkaGhoiIiJJSUliYmJkZGhoaO3t7e7u7lJSUltbW19fX7S0tLW1tb8=",0,4,28,68,2.56,0.015,0.0096],[2,"Tier II • Guarnição Regular","AAAAAAAAAwICAgEBAQAAAAAAAAMDAwICAgEBAQMDAwADAwAAAgICAgAAAAICAgABAQEDAwMBAQEAAAAAAgACAQACAQACAgMDAwICAgICAgICAQEBAwMAAAADAwMCAgIBAgICAFRUVFNTUz98fHzExMRISEjs7OxAQEDb29tRUVH39/f1RkZdXYSE4uJZWVmCgoJjYGBgS0tLU1NT7+/v+Ij4iFz4iFxkf+pDQ0N/fx0dHRoaGra2tj8/ampqQkJC5+fnXN3d3Wk=",1,9,56,34,3.01,0.362,0.0292],[3,"Tier III • Bastião Veterano","AAAAAAAAAwICAgEBAQAAAAAAAAMDAwICAgEBAQMDAwADAwIAAAICAQICAgICAAAAAgICAAAAAAEBAQEBAQMDAwEBAQAAAAACAAIBAAIBAAICAwMDAgICAgIDAwMDAwICAgECAlRUVFNTUz98fHzExMRISEjs7OxAQEDb29tRUVH39/f1RkYgXV2EhFjf39/i4llZWYKCgmNj+vrFxV1gYGBLS0tTU1Pv7+/4iPiIXPiIXGR/6kNDQ39/HR0dQkJCPz8aGhpc5+c=",3,15,51,31,3.19,0.635,0.0286],[4,"Tier IV • Elite do Alto Trono","AAAAAAAAAwICAgEBAQAAAAAAAAMDAwICAgEBAQEDAwMAAwMCAAACAgECAgICAgAAAAICAgAAAgAAAQEBAQICAQEBAAAAAwMDAQEBAAAAAAABAAIAAgEAAgEAAgIDAwMCAgICAlRUVFNTUz98fHzExMRISEjs7OxAQEDb29tRUVFa9/f39UZGIF1dhIRY39/f4uJZWVmCgoJjY+X6+sXFXV0jI2BgYGVlZUtLS1NTU0xM7+/vXviI+Ihc+IhcZH/qQ0NDf38dHR0=",5,21,48,26,3.34,0.709,0.027],[5,"Tier V • Campeão Soberano Ápice","AAAAAAAAAwICAgEBAQAAAAAAAAMDAwICAgEBAQEDAwMAAwMCAAACAgECAgICAgAAAAICAgQEAAACAgEAAAABAQMDAQECAgEBAQAAAAMDAwEBAQAAAAAAAQACAQACAQACAQACAlRUVFNTUz98fHzExMRISEjs7OxAQEDb29tRUVFa9/f39UZGIF1dhIRY39/f4uJZWVmCgoIJA2NjIeW+Z/r6xcVHR11dIyNgYGBlZWVLS0tTU1NMTO/v7174iF74iFz4iFxkf+o=",10,24,40,26,3.51,0.779,0.0245]]
  },
  "mono_purple_blood": {
    "archetypeId": "mono_purple_blood",
    "domain": "purple",
    "name": "Pacto Sanguíneo",
    "subtitle": "Mono-Roxo 🩸 • Dreno de Vida & Toque Letal",
    "strategySummary": "Sustenta pactos agressivos e Corrupção convertendo vida drenada em pressão letal com vampiros e assassinos de Toque Letal.",
    "tacticalIdentity": "aggro",
    "coverCardId": "purple_46_noiva_vampira",
    "generationsEvolved": 22,
    "matchesSimulated": 7016,
    "seedWinRate": 0.524,
    "championWinRate": 0.357,
    "championDeckJaccardStability": 0.923,
    "medianCardCi95HalfWidth": 0.0341,
    "learnedProfile": {"deckId":"mono_purple_blood","deckName":"Pacto Sanguíneo","archetypeTag":"aggro","generationsTrained":16,"matchesSimulated":6212,"baselineWinRate":0.524,"trainedWinRate":0.358,"weights":{"aggroFaceBias":1.28,"tradeValueBias":1.15,"guardianPriority":1,"flyingEvasionBias":1,"stackConsolidationBias":1,"antiAoeSpreadBias":1,"spellHoldPatience":1,"relicPriority":1,"ascensionEagerness":1.2,"bloodPactThresholdHp":18,"domainExpansionEagerness":1,"sovPowerTempoBias":1,"synergyHoldBonus":20,"mulliganCurveTarget":2.7},"mk":[101,236,1015,336,733,830,242],"cp":[832,644,242,236,336,734,1015,536,540,440],"ca":[76,83,93,94,101,236,242,245,246,336,446,545],"hb":[[76,24],[83,12.2],[93,20.4],[94,24],[99,13.8],[101,24],[236,16.1],[242,10.2],[245,17.4],[246,24],[336,11.2],[446,24],[536,7],[545,24],[644,11.4],[646,24],[653,15.8],[731,12.4],[733,16.2],[741,24],[830,12.4],[834,8.2],[838,15.7],[1015,15.1],[1033,24]],"sp":[[646,83],[1015,1033],[1033,242],[733,446],[1015,446],[83,1033],[76,246],[76,1033],[830,446],[76,446]],"dc":[[646,83,0.807,0.339,83," (+34% WR | IC95% ±8.2%, n=83)"],[1015,1033,0.8,0.333,50," (+33% WR | IC95% ±10.4%, n=50)"],[1033,242,0.778,0.311,76," (+31% WR | IC95% ±8.9%, n=76)"],[733,446,0.766,0.298,93," (+30% WR | IC95% ±8.3%, n=93)"],[1015,446,0.777,0.309,62," (+31% WR | IC95% ±9.8%, n=62)"],[83,1033,0.769,0.301,64," (+30% WR | IC95% ±9.8%, n=64)"],[76,246,0.751,0.283,75," (+28% WR | IC95% ±9.4%, n=75)"],[76,1033,0.744,0.277,73," (+28% WR | IC95% ±9.6%, n=73)"],[830,446,0.742,0.274,76," (+27% WR | IC95% ±9.4%, n=76)"],[76,446,0.741,0.273,68," (+27% WR | IC95% ±9.9%, n=68)"],[1033,437,0.757,0.289,40," (+29% WR | IC95% ±12.3%, n=40)"],[646,834,0.734,0.267,70," (+27% WR | IC95% ±9.9%, n=70)"]]},
    "topShapleyCards": [[94,0.5168,0.4286,0.0881,0.894,0.397,47],[252,0.429,0.1307,0.2982,0.833,0.948,6],[653,0.2114,-0.0531,0.2645,0.615,0.941,13],[246,0.1736,0.0155,0.1581,0.553,0.441,38],[646,0.1702,-0.0244,0.1946,0.56,0.658,25],[1033,0.1689,-0.0742,0.2431,0.563,0.733,16],[99,0.1356,-0.0374,0.1729,0.531,0.775,32],[76,0.102,0.0333,0.0687,0.46,0.029,202],[446,0.0947,-0.0641,0.1588,0.474,0.441,38],[845,0.092,-0.0758,0.1678,0.471,0.433,34],[245,0.079,-0.0649,0.1439,0.457,0.41,46],[1015,0.0768,-0.0066,0.0835,0.46,0.521,137]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AAAAAgICAwMDAQEBAAAAAgICAgICAQEBAwMDAQEBAAAAAwMDAgIDAwMBAQEAAAACAgAAAAMBAQICAgIBAgAAAAMBAQEAAAAAAgICAgIBAwIAAgACAgICAQAAAAICAgAAAAAAAOzs7Nvb20BAQFFRUVNTU9zc3BgYGFBQUD4+PrW1tUlJSUJCQhkZ9/f3uLi4SkrwGX/t7e1BUlLd3d2AuYBqampBVFRU+PhR+H+A3t7euUGISn9RHBwciLny8vIbGxtWVlbw8FE=",0,0,62,38,2.5,0.015,0.0096],[2,"Tier II • Guarnição Regular","AAAAAgICAwMDAQEBAAAAAgICAgICAQEBAwMDAQEBAAAAAwMDAgIDAwMBAQEAAAACAgAAAAMDAwICAgIBAgAAAAMBAQECAgAAAgICAgIBAwAAAgACAgIAAQAAAAICAgAAAAAAAOzs7Nvb20BAQFFRUVNTU9zc3BgYGFBQUD4+PrW1tUlJSUJCQhkZ9/f3uLi4SkrwGX/t7e1B6+vd3d2AuYBqampBVFRUjY1R+H+A3t7euUH8Sn9RHBwc/Lny8vIbGxtWVlbw8FE=",0,6,58,36,2.56,0.362,0.0292],[3,"Tier III • Bastião Veterano","AAAAAgICAwMDAQEBAAAAAgICAgICAQEBAwMDAQEBAAAAAwMDAAMDAwMBAQEAAAAAAgICAgADAwICAgIBAgAAAAMBAQECAgAAAgICAgIBAAACAgMCAgIAAQAAAAICAgAAAAMDAOzs7Nvb20BAQFFRUVNTU9zc3BgYGFBQUD4+PrW1tUlJSUJCQvBG9/f3uLi4XV3w8H+E4eH16+vd3d2AuYBqampBVFRUjY1RUX+A3t7euV78Hh5NHBwc/Lny8vIbGxtWVlZBQVE=",3,14,56,27,2.89,0.635,0.0286],[4,"Tier IV • Elite do Alto Trono","AAAAAgICAwMDAQEBAAAAAgICAgICAQEBAwMDAQEBAAAAAwMDAwMDAwMBAQEAAAAAAgICAgADAwICAgQBAgAAAAEBAQECAgAAAgQCAgIBAAACAgMCAgIAAQAAAAICAgAAAAMDAOzs7Nvb20BAQFFRUVNTU9zc3BgYGFBQUD4+PrW1tUlJSUJCQkZG9/f3uLi4XV1MTH+E4eH16+vd3d0JuYBqamq+VFRUjY1jY38D3t7euV78Hh5NHBwc/Lny8vIbGxtWVlZFRfo=",6,22,45,27,3.17,0.709,0.027],[5,"Tier V • Campeão Soberano Ápice","AAAAAgICAwMDAQEBAAAAAgICAgICAQEBAwMDAQEBAAAAAwMDAwMDAwMBAQEAAAAAAgICAgADAwICAgQAAgAAAAEBAQECAgAAAgQCAgICAAACAgMCAgIAAgAAAAICAgAAAAMDAOzs7Nvb20BAQFFRUVNTU9zc3BgYGFBQUD4+PrW1tUlJSUJCQkZG9/f3uLi4XV1MTH+E4eH16+vd3d0J9uVqamq+VFRUjY1jY38D3t7eIF78Hh5NHBwc/Iby8vIbGxtWVlZFRfo=",10,22,41,27,3.32,0.779,0.0245]]
  },
  "mono_purple_umbral": {
    "archetypeId": "mono_purple_umbral",
    "domain": "purple",
    "name": "Inquisição Umbral",
    "subtitle": "Mono-Roxo 🌑 • Destruição, Debuff & Controle",
    "strategySummary": "Aniquila ameaças-chave com destruição direta, drena o ATQ da Vanguarda inimiga e domina o fim de jogo com lordes abissais.",
    "tacticalIdentity": "control",
    "coverCardId": "purple_65_principe_mortos",
    "generationsEvolved": 22,
    "matchesSimulated": 7156,
    "seedWinRate": 0.452,
    "championWinRate": 0.409,
    "championDeckJaccardStability": 1,
    "medianCardCi95HalfWidth": 0.0371,
    "learnedProfile": {"deckId":"mono_purple_umbral","deckName":"Inquisição Umbral","archetypeTag":"control","generationsTrained":16,"matchesSimulated":6352,"baselineWinRate":0.452,"trainedWinRate":0.442,"weights":{"aggroFaceBias":0.92,"tradeValueBias":1.36,"guardianPriority":1,"flyingEvasionBias":0.99,"stackConsolidationBias":1,"antiAoeSpreadBias":1,"spellHoldPatience":1.28,"relicPriority":1.11,"ascensionEagerness":1,"bloodPactThresholdHp":24,"domainExpansionEagerness":1,"sovPowerTempoBias":1,"synergyHoldBonus":19,"mulliganCurveTarget":3.1},"mk":[105,842,82,638,236],"cp":[842,76,99,837,732,240,452,832,74,834],"ca":[76,82,93,99,103,105,236,243,245,346,349,452],"hb":[[76,24],[82,20.4],[92,9.2],[93,19],[99,21.2],[101,17.5],[103,16.2],[105,16.2],[236,8.8],[240,7.9],[243,10.9],[245,20.7],[346,24],[349,16.3],[452,17.1],[536,11.9],[547,15.6],[638,10.6],[653,17.2],[731,5.9],[736,24],[741,16.2],[837,17.2],[838,18],[840,24],[1033,24]],"sp":[[840,349],[638,840],[736,840],[76,349],[736,99],[840,105],[736,1033],[99,452],[736,103],[838,93]],"dc":[[840,349,0.834,0.36,43," (+36% WR | IC95% ±10.3%, n=43)"],[638,840,0.793,0.32,77," (+32% WR | IC95% ±8.7%, n=77)"],[736,840,0.787,0.313,65," (+31% WR | IC95% ±9.5%, n=65)"],[76,349,0.732,0.258,233," (+26% WR | IC95% ±5.6%, n=233)"],[736,99,0.744,0.271,108," (+27% WR | IC95% ±8.0%, n=108)"],[840,105,0.751,0.277,83," (+28% WR | IC95% ±8.9%, n=83)"],[736,1033,0.758,0.285,65," (+28% WR | IC95% ±9.9%, n=65)"],[99,452,0.746,0.272,85," (+27% WR | IC95% ±8.9%, n=85)"],[736,103,0.739,0.266,102," (+27% WR | IC95% ±8.2%, n=102)"],[838,93,0.741,0.267,95," (+27% WR | IC95% ±8.5%, n=95)"],[838,346,0.768,0.294,42," (+29% WR | IC95% ±11.8%, n=42)"],[736,346,0.729,0.255,109," (+26% WR | IC95% ±8.1%, n=109)"]]},
    "topShapleyCards": [[840,0.2933,0.1138,0.1795,0.739,0.733,23],[653,0.1795,-0.1047,0.2843,0.636,0.953,11],[99,0.1682,0.0155,0.1527,0.615,0.759,39],[1033,0.1654,-0.0155,0.1809,0.607,0.65,28],[346,0.16,0.0205,0.1395,0.583,0.284,48],[452,0.1525,0.0717,0.0808,0.592,0.597,142],[845,0.1386,-0.0301,0.1686,0.576,0.56,33],[349,0.1383,0.0427,0.0955,0.573,0.507,103],[103,0.1198,-0.0344,0.1542,0.55,0.42,40],[736,0.1031,0.0317,0.0714,0.521,0.179,188],[105,0.091,0.0324,0.0587,0.505,0.103,279],[76,0.0871,0.0205,0.0667,0.5,0.073,216]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AAAAAwMDAgICAQEBAAAAAgICAgICAgICAAAAAAAAAAAAAAAAAwMDAgICAAAAAAAAAAAAAgICAQEBAgAAAAAAAAABAQECAgICAgIAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEBAezs7EBAQNvb21FRUVNTU35+ftzc3BgYGFxc8PDw8/NKSkpXV0JCQiIiImpqamJiYvj4+IiIiFxcXOdkVVVV7+/vtra2GRkZGhoaSUlJZGRoaGjt7e3u7u5SUlJbW1tfX1+0tLQ=",0,4,27,69,2.47,0.015,0.0096],[2,"Tier II • Guarnição Regular","AAAAAwMDAgICAQEBAAAAAgICAgICAgICAwAAAAAAAAAAAAAAAAMDAwMDAAACAgICAAAAAAAAAAAAAgICAQEBAgAAAAACAgICAgMDAwAAAwMDAAAAAAAAAQEBAgICAAAAAAICAuzs7EBAQNvb21FRUVNTU35+ftzc3BgYGOVcXPDw8PPzSkpKV1dCQkJFRWZmKSIiImpqamJiYvj4+IiIiFxcXOdkZWVlGRkZ5+dLS0tkZEpKSmFhYfv7+8DAwCcnJ1dZWVnf398=",1,9,54,36,2.85,0.362,0.0292],[3,"Tier III • Bastião Veterano","AQEBAAAAAwMDAgICAQEBAAAAAgICAgICAgICAwAAAAAAAAAAAAADAwAAAwMDAwMAAAMAAAAAAgICAgIAAAAAAAAAAAIAAAACAgIBAQECAAAAAAICAAADAwMAAAACAgIAAAAAAsTExOzs7EBAQNvb21FRUVNTU35+ftzc3BgYGOVcXPDw8PPzSkpKRkZXV0JCQkVFZmZNZ2lpaSkpIiIiampq+vpiYmKN+Pj4iIiIXFxc52RlZWXn52RkSkpKUVFRGRkZV1lZWd8=",3,15,46,36,2.99,0.635,0.0286],[4,"Tier IV • Elite do Alto Trono","AQEBAAAAAwMDAgICAQEBAAAAAgICAgICAgICAwAAAAAAAAAAAAADAwAAAwMDAwMAAAAAAwAAAAACAgICAgAAAAICAAAAAAACAgAAAQAAAAICAgEBAQIAAAAAAgIAAAMCAgIAAMTExOzs7EBAQNvb21FRUVNTU35+ftzc3BgYGOVcXPDw8PPzSkpKRkZXV0JCQkVFXV1mZk1naWlpKSkiIiJqamrlivr6YmJijY1jY174+PiIiIhcXFznZGVlZefnZGRKGRkZV1k=",5,21,40,34,3.16,0.709,0.027],[5,"Tier V • Campeão Soberano Ápice","AQEBAAAAAwMDAgICAQEBAAAAAgICAgICAgICAwAAAAAAAAAAAAAAAAMDAAADAwMDAwECAgAABAAAAwAAAAACAgICAgAAAAMCAgAAAAAAAgIAAAEBAAAAAgICAQECAgEBAQIAAMTExOzs7EBAQNvb21FRUVNTU35+ftzc3BgYGOVcXExM8PDw8/NKSkpGRldXQkJCRUVa4OBdXQlmZk1naWlpKSkiIiJqampI5Yr6+mJiYo2NY2NeXvj4+IiIiF1dIyNcXFznZPU=",9,30,33,28,3.4,0.779,0.0245]]
  },
  "mono_gold_phalanx": {
    "archetypeId": "mono_gold_phalanx",
    "domain": "gold",
    "name": "Falange Impenetrável",
    "subtitle": "Mono-Dourado 🛡️ • Guardião, Armadura & Bastião",
    "strategySummary": "Forma linhas blindadas de Guardiões com alta Armadura e estandartes de comando que anulam investidas agressivas.",
    "tacticalIdentity": "midrange",
    "coverCardId": "gold_83_forjado_ancestral",
    "generationsEvolved": 22,
    "matchesSimulated": 6460,
    "seedWinRate": 0.583,
    "championWinRate": 0.423,
    "championDeckJaccardStability": 0.923,
    "medianCardCi95HalfWidth": 0.0513,
    "learnedProfile": {"deckId":"mono_gold_phalanx","deckName":"Falange Impenetrável","archetypeTag":"midrange","generationsTrained":16,"matchesSimulated":5656,"baselineWinRate":0.583,"trainedWinRate":0.708,"weights":{"aggroFaceBias":1.01,"tradeValueBias":1.26,"guardianPriority":1.42,"flyingEvasionBias":1,"stackConsolidationBias":1.22,"antiAoeSpreadBias":1,"spellHoldPatience":0.98,"relicPriority":0.98,"ascensionEagerness":1,"bloodPactThresholdHp":24,"domainExpansionEagerness":1.01,"sovPowerTempoBias":0.95,"synergyHoldBonus":19,"mulliganCurveTarget":2.8},"mk":[278,421,272,870,145],"cp":[380,777,679,421,424,164,146,876,878,163],"ca":[145,147,272,278,282,381,382,421,428,572,580,581],"hb":[[145,10.9],[147,13],[151,12],[163,14],[272,14.8],[278,20.5],[282,12.5],[381,19.6],[382,16.7],[421,17.9],[428,20.4],[572,11.2],[580,22.6],[581,20.4],[682,15.7],[780,10.9],[870,17.7],[871,7.5],[880,24],[881,16.9],[1031,24],[1037,24]],"sp":[[870,1037],[1037,278],[147,1037],[382,421],[581,278],[1037,421],[682,870],[421,580],[581,421],[871,580]],"dc":[[870,1037,0.845,0.332,84," (+33% WR | IC95% ±7.4%, n=84)"],[1037,278,0.832,0.319,77," (+32% WR | IC95% ±8.0%, n=77)"],[147,1037,0.796,0.283,72," (+28% WR | IC95% ±8.9%, n=72)"],[382,421,0.792,0.278,56," (+28% WR | IC95% ±10.0%, n=56)"],[581,278,0.784,0.271,63," (+27% WR | IC95% ±9.6%, n=63)"],[1037,421,0.777,0.264,61," (+26% WR | IC95% ±9.9%, n=61)"],[682,870,0.764,0.251,87," (+25% WR | IC95% ±8.6%, n=87)"],[421,580,0.753,0.239,119," (+24% WR | IC95% ±7.5%, n=119)"],[581,421,0.764,0.251,53," (+25% WR | IC95% ±10.7%, n=53)"],[871,580,0.751,0.238,66," (+24% WR | IC95% ±9.9%, n=66)"],[272,580,0.729,0.215,119," (+22% WR | IC95% ±7.8%, n=119)"],[428,572,0.728,0.215,93," (+21% WR | IC95% ±8.7%, n=93)"]]},
    "topShapleyCards": [[880,0.4067,0.1775,0.2292,0.875,0.908,8],[163,0.4046,0.1754,0.2292,0.875,0.951,8],[428,0.2918,0.147,0.1448,0.743,0.563,35],[382,0.2294,0.0564,0.173,0.679,0.525,28],[1031,0.2008,-0.1072,0.308,0.667,0.859,9],[581,0.1899,0.0525,0.1374,0.638,0.51,47],[1037,0.1891,0.0117,0.1775,0.643,0.616,28],[881,0.1801,0.0987,0.0814,0.625,0.44,136],[781,0.161,-0.0105,0.1715,0.613,0.581,31],[380,0.1554,-0.0523,0.2077,0.619,0.816,21],[784,0.1444,0.0576,0.0869,0.581,0.266,124],[282,0.12,-0.0203,0.1403,0.563,0.392,48]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AAAAAwMDAQEBAQEBAQEBAQEBAwMDAgICAwMDAgICAQMDAAAAAgIBAQEDAwIDAQEBAQABAAEBAQICAgICAwMDAAMAAAMAAAMAAAAAAgIBAQEDAwMAAQMBAQABAQMDAQMDAwADAJGRkWdnZ3V1dRAQEKWlpbCwsBERETw8PGZmZj4+PqcGBpOTk6WkqKioBgVBB6enFxefF6EWFhajo6OlpWxsbJIEoZIEoZIFraSkpEFBFBQUampqrXkErhufrhsFAhtxcQetB58=",0,0,76,24,2.94,0.018,0.0094],[2,"Tier II • Guarnição Regular","AAAAAwMDAQEBAQEBAQEBAQEBAwMDAgICAwMDAgICAQMDAAAAAgIBAQEDAwIDAQEBAQABAAEBAQICAgICAwMDAAMAAAMAAAMAAAAAAgIBAQEDAwMAAQMAAQAAAQMDAQMDAwADAJGRkWdnZ3V1dRAQEKWlpbCwsBERETw8PGZmZj4+PqcGBpOTk0JCqKioBgVBB6enFxefF6EWFhajo6OmpmxsbJIEoZIEoZIFraSkpEFBFBQUampqrXkEmRufmRsFAhtxcQetB58=",0,6,70,24,2.96,0.339,0.0291],[3,"Tier III • Bastião Veterano","AAAAAwMDAQEBAQEBAQEBAQEBAwMDAgICAwMDAgICAgMDAAAAAgIBAQEBAQECAAADAwMAAQEBAQICAgICAwMDAAMBAAMAAAEAAAAAAQEBAQEDAwMAAQMAAQMAAQEDAQMDAgACA5GRkWdnZ3V1dRAQEKWlpbCwsBERETw8PGZmZj4+PkQMDJOTk0JCqKiofX2nQaGhbm4HnxoWFhajo6OmpmxsbJIErJIEoZJ8raSkpKenFBQUampqrXkEmRsHmRt8AhtxcUGtQQc=",3,14,59,24,3.22,0.59,0.0287],[4,"Tier IV • Elite do Alto Trono","AAAAAwMDAQEBAQEBAQEBAQEBAwMDAgICAwMDAgICAgMDAAAAAgIBAQEBAQICAwMDAwICAQEBAQICAgICAwMDAAMBAAIEAAEAAAAAAAABAQEDAwMAAQMAAQMAAQEDAQMDAAACA5GRkWdnZ3V1dRAQEKWlpbCwsBERETw8PGZmZj4+PkQMDJOTk0JCqKiofX2oqAQEbm6npxoWFhajo6OmpmxsbJINrJJFDZJ8raSkpKGhFBQUampqrXkEmRsQmRt8AhtxcaatsBA=",6,22,48,24,3.36,0.751,0.0254],[5,"Tier V • Campeão Soberano Ápice","AAAAAwMDAQEBAQEBAQEBAQEBAwMDAgICAwMDAgICAgMDAAAAAgIBAQEBAQICAQEDAwICAQEBAQICAgICAwMDAgMBAwIEBAEAAAAAAAABAQEDAwMAAQEAAQMAAQEDAQMDAAACA5GRkWdnZ3V1dRAQEKWlpbCwsBERETw8PGZmZj4+PkQMDJOTk0JCqKiofX2oqBgYbm6npxoWFhajo6OmpmxsbKoNrHBFDQd8raSkpKOjFBQUampqrXl+mRsQmRt8AhtxcaatsBA=",10,26,40,24,3.66,0.8,0.0234]]
  },
  "mono_gold_celestial": {
    "archetypeId": "mono_gold_celestial",
    "domain": "gold",
    "name": "Legião Celeste",
    "subtitle": "Mono-Dourado ☀️ • Escudo Divino, Voo & Ascensão",
    "strategySummary": "Comanda serafins e arcontes de Voo protegidos por Escudo Divino que realizam trocas 2-por-1 e ascendem em campeões solares.",
    "tacticalIdentity": "tempo",
    "coverCardId": "gold_99_serafim_coroado",
    "generationsEvolved": 22,
    "matchesSimulated": 7288,
    "seedWinRate": 0.464,
    "championWinRate": 0.414,
    "championDeckJaccardStability": 1,
    "medianCardCi95HalfWidth": 0.0471,
    "learnedProfile": {"deckId":"mono_gold_celestial","deckName":"Legião Celeste","archetypeTag":"tempo","generationsTrained":16,"matchesSimulated":6484,"baselineWinRate":0.464,"trainedWinRate":0.642,"weights":{"aggroFaceBias":1.16,"tradeValueBias":1.19,"guardianPriority":1.05,"flyingEvasionBias":1.35,"stackConsolidationBias":1,"antiAoeSpreadBias":1,"spellHoldPatience":1,"relicPriority":1.05,"ascensionEagerness":1.26,"bloodPactThresholdHp":24,"domainExpansionEagerness":1,"sovPowerTempoBias":1.03,"synergyHoldBonus":18,"mulliganCurveTarget":3},"mk":[278,159,272,870,421,147],"cp":[575,680,678,427,579,774,421,275,166,432],"ca":[144,145,147,150,159,272,274,278,279,421,580,678],"hb":[[144,11.2],[145,9.7],[147,10.3],[150,20.4],[159,18.4],[166,9.3],[272,20.4],[274,9.7],[278,24],[279,10],[421,14],[572,8.6],[580,13.1],[678,18.1],[682,14.1],[780,9.1],[781,19.5],[870,13.4],[880,23.3],[1031,24],[1037,19.4]],"sp":[[1037,272],[272,278],[1019,279],[678,574],[870,1019],[772,278],[676,278],[145,580],[678,278],[781,274]],"dc":[[1037,272,0.828,0.274,56," (+27% WR | IC95% ±9.3%, n=56)"],[272,278,0.765,0.211,265," (+21% WR | IC95% ±5.0%, n=265)"],[1019,279,0.817,0.263,36," (+26% WR | IC95% ±11.6%, n=36)"],[678,574,0.796,0.242,61," (+24% WR | IC95% ±9.6%, n=61)"],[870,1019,0.786,0.232,72," (+23% WR | IC95% ±9.0%, n=72)"],[772,278,0.787,0.234,63," (+23% WR | IC95% ±9.6%, n=63)"],[676,278,0.779,0.225,74," (+23% WR | IC95% ±9.0%, n=74)"],[145,580,0.759,0.205,84," (+21% WR | IC95% ±8.8%, n=84)"],[678,278,0.751,0.197,105," (+20% WR | IC95% ±8.0%, n=105)"],[781,274,0.767,0.213,57," (+21% WR | IC95% ±10.4%, n=57)"],[781,279,0.768,0.214,53," (+21% WR | IC95% ±10.7%, n=53)"],[678,274,0.722,0.169,209," (+17% WR | IC95% ±6.0%, n=209)"]]},
    "topShapleyCards": [[781,0.3435,0.181,0.1625,0.792,0.68,24],[1037,0.2781,0.1154,0.1627,0.724,0.637,29],[682,0.2733,0.0664,0.2069,0.722,0.695,18],[150,0.2072,-0.17,0.3772,0.667,0.905,6],[282,0.156,0.0017,0.1544,0.59,0.391,39],[879,0.153,-0.0722,0.2252,0.611,0.878,18],[772,0.1367,0.0181,0.1186,0.591,0.801,66],[159,0.1144,0.0576,0.0567,0.532,0.069,297],[880,0.1124,-0.2542,0.3666,0.571,0.897,7],[278,0.0976,0.0078,0.0898,0.513,0.017,119],[144,0.08,0.0158,0.0642,0.506,0.246,233],[145,0.0774,-0.0059,0.0833,0.522,0.602,138]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AAAAAQEBAgICAQEBAgIBAQEAAAAAAwMDAAAAAQEBAgICAwMDAgICAwMDAQEBAwEBAwAAAAAAAAAAAAEBAQEBAQEBAQICAgAAAAAAAAAAAAAAAAEBAQEBAQEBAQEBAQEBAQEBAZGRkXV1dTw8PBISEj4+sLCwlZWmpmlpaaCgoHp6eqSkpAYGBj8/PwQEBBMTE/t3dxGbm5ucnJydnZ0VFRV4eHitra2ioqKpqamqqqqsrKyxsbERERF2dnZ/f3+jo6OkpKSvr68=",0,4,28,68,2.71,0.018,0.0094],[2,"Tier II • Guarnição Regular","AAAAAQEBAgICAQEBAAAAAgIBAQEAAAAAAAAAAwICAwMDAwMAAAABAQEDAQEBAgICAwMDAgICAwMDAQEBAwEBAwMDAQEBAQEBAQICAgIBAQECAgIAAAABAQEDAwMCAgIAAAADA5GRkXV1dTw8PBISEpCQkD4+sLCwk5OTlZWmpgtEqGlpaW5uoKCgenp6CRcXF6SkpAYGBj8/PwQEBBMTE/t3dxH7+3cUFBSmpqZAQEA+o6OjoqKinp6eeHh4aGhooKCgnJycamo=",1,9,54,36,3.02,0.339,0.0291],[3,"Tier III • Bastião Veterano","AQEBAAAAAQEBAgICAQEBAwMDAAAAAgIBAQEAAAAAAAAAAwICAwMDAwMBAAAAAQEBAwMCAgMDAQEBAAMCAgIDAwMCAgIDAwMBAQEDAQEDAwMBAQEBAQEBAgICAgMDAwAAAAEBAaWlpZGRkXV1dTw8PBISEmZmZpCQkD4+sLCwk5OTlZWmpgtEqGlpaW5uGqCgoHp6egkJQ0MKChcXF5ZvpKSkBgYGPz8/BAQEExMT+3d3Efv7dxQUFKampkBAQD5ra2uenp6jo6M=",3,15,55,27,3.27,0.59,0.0287],[4,"Tier IV • Elite do Alto Trono","AQEBAAAAAQEBAgICAQEBAwMDAAAAAgIBAQEAAAAAAAAAAwICAwMDAwMBAAAAAQEBAwMCAgMDAQEBBAABAwMBAQICAgMDAwICAgMDAwEBAQMDAgMBAQMDAwEBAQEBAQECAgICA6WlpZGRkXV1dTw8PBISEmZmZpCQkD4+sLCwk5OTlZWmpgtEqGlpaW5uGqCgoHp6egkJQ0MKChcXFw2WGW9vq6ukpKQGBgY/Pz8EBAQTExMMDKb7d3cR+/t3FBQUpqamQEBAPms=",5,21,50,24,3.54,0.751,0.0254],[5,"Tier V • Campeão Soberano Ápice","AQEBAQEBAAAAAQEBAgICAQEBAwMDAAAAAgIBAQEAAAAAAAAAAwICAwMDAwMBAAAAAQEBAwMCAgMDAQEBBAADBAEAAgMDAwEBAgICAwMDAgICAwMDAQEBAwMCAgAAAAEDAQABAxAQEKWlpZGRkXV1dTw8PBISEmZmZpCQkD4+sLCwk5OTlZWmpgtEqGlpaW5uGqCgoHp6egkJQ0MKChcXFw2WcAcZmKoNb2+rq6SkpAYGBj8/PwQEBBMTEwwMpqafn58W+3eZdxE=",10,23,41,26,3.73,0.8,0.0234]]
  },
  "mono_gold_judgment": {
    "archetypeId": "mono_gold_judgment",
    "domain": "gold",
    "name": "Julgamento Solar",
    "subtitle": "Mono-Dourado ⚖️ • Relíquias, Escudo Global & Cura",
    "strategySummary": "Sustenta Santuários e Relíquias imperiais na Retaguarda enquanto paladinos blindados, curas e Escudo Divino em massa selam o veredito final.",
    "tacticalIdentity": "control",
    "coverCardId": "gold_119_soberano_ordem_eterna",
    "generationsEvolved": 22,
    "matchesSimulated": 7112,
    "seedWinRate": 0.56,
    "championWinRate": 0.363,
    "championDeckJaccardStability": 1,
    "medianCardCi95HalfWidth": 0.0514,
    "learnedProfile": {"deckId":"mono_gold_judgment","deckName":"Julgamento Solar","archetypeTag":"control","generationsTrained":16,"matchesSimulated":6308,"baselineWinRate":0.56,"trainedWinRate":0.508,"weights":{"aggroFaceBias":0.98,"tradeValueBias":1.29,"guardianPriority":1.29,"flyingEvasionBias":0.98,"stackConsolidationBias":1,"antiAoeSpreadBias":1,"spellHoldPatience":1.2,"relicPriority":1.27,"ascensionEagerness":1,"bloodPactThresholdHp":24,"domainExpansionEagerness":1,"sovPowerTempoBias":0.98,"synergyHoldBonus":22,"mulliganCurveTarget":3.2},"mk":[272,159,274,421,147],"cp":[776,178,875,381,425,179,1013,871,883,674],"ca":[147,159,166,176,178,179,272,274,284,381,421,425],"hb":[[147,13.7],[159,15.5],[166,15],[171,10.1],[176,17.1],[178,19.3],[179,17.2],[272,20.2],[274,15.8],[284,11.3],[285,8.3],[381,24],[421,14.9],[425,14.2],[580,14.9],[678,19.7],[682,24],[683,21],[784,23.7],[789,21.9],[879,11.1],[880,24],[886,12.7],[1031,24],[1037,24]],"sp":[[880,274],[880,285],[886,381],[1037,381],[683,381],[284,381],[1037,274],[880,272],[784,381],[149,178]],"dc":[[880,274,0.834,0.358,61," (+36% WR | IC95% ±8.9%, n=61)"],[880,285,0.808,0.333,52," (+33% WR | IC95% ±10.1%, n=52)"],[886,381,0.755,0.28,170," (+28% WR | IC95% ±6.3%, n=170)"],[1037,381,0.801,0.326,35," (+33% WR | IC95% ±12.1%, n=35)"],[683,381,0.769,0.294,51," (+29% WR | IC95% ±10.8%, n=51)"],[284,381,0.731,0.256,158," (+26% WR | IC95% ±6.8%, n=158)"],[1037,274,0.741,0.266,99," (+27% WR | IC95% ±8.3%, n=99)"],[880,272,0.756,0.28,56," (+28% WR | IC95% ±10.6%, n=56)"],[784,381,0.696,0.221,294," (+22% WR | IC95% ±5.2%, n=294)"],[149,178,0.727,0.251,86," (+25% WR | IC95% ±9.1%, n=86)"],[789,272,0.752,0.277,35," (+28% WR | IC95% ±13.1%, n=35)"],[274,381,0.681,0.205,386," (+21% WR | IC95% ±4.6%, n=386)"]]},
    "topShapleyCards": [[682,0.2585,0.0979,0.1606,0.647,0.507,34],[789,0.2218,-0.0154,0.2372,0.625,0.8,16],[880,0.2,-0.0147,0.2147,0.6,0.737,20],[381,0.1953,0.1196,0.0757,0.564,0.103,165],[151,0.1901,-0.0154,0.2055,0.591,0.753,22],[1031,0.1786,-0.1003,0.2789,0.583,0.831,12],[1037,0.1362,-0.0367,0.1729,0.531,0.636,32],[683,0.1285,0.0259,0.1026,0.527,0.717,91],[281,0.1226,-0.0658,0.1885,0.519,0.654,27],[179,0.1088,0.0254,0.0834,0.493,0.415,138],[159,0.1048,0.0482,0.0566,0.472,0.071,299],[886,0.1016,0.0139,0.0877,0.496,0.625,125]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AQEBAwMDAAADAwMDAwMAAAAAAAMDAwMDAwEBAQMDAwAAAAICAQEBAAAAAAAAAAAAAAAAAAABAQEBAQEBAQEBAQECAAAAAAAAAAAAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAgICArCwsBEREaurZ2dndnZ2kZGRlZVpaWlra2t3d3f7+/uTk5Oioh0dHbGxsbOzm5ubnJycnZ2dExMTFRUVeHh4ra2toqmpqaqqqqysrBEREXV1dXZ2dn9/f6Ojo6SkpK+vrz09PT4=",0,4,26,70,2.48,0.018,0.0094],[2,"Tier II • Guarnição Regular","AQEBAwMDAAABAQEBAQEDAwMDAwMAAAAAAAICAgAAAAMDAwMDAwEBAQEBAwMDAwAAAAICAQEBAAAAAAAAAAACAAMDAwMDAwAAAAEBAQICAgICAgMBAQEDAwMBAQEDAwMCAgIBAbCwsBEREaurpaWlEhISZ2dndnZ2kZGRlZVEqKifn59paWlra2upqXd3d/v7+wiTk5Oioh0dHbGxsbOzra2torMODg5ycnKoqKiAgIBGRkatra1xFhYWAwMDFBQUampqo6OjdXU=",1,9,66,24,2.81,0.339,0.0291],[3,"Tier III • Bastião Veterano","AQEBAwMDAAABAQEBAQEDAwMDAwMAAAAAAAICAgAAAAMDAwMDAwEBAQEBAwMDAwMDAAAAAgIAAAMDAwABAQEAAAACAAIAAgAAAAIDAwMDAwMCAgIDAwMDAwMBAQEBAQECAgIBAbCwsBEREaurpaWlEhISZ2dndnZ2kZGRlZVEqKifn59paWlra2upqXd3d/v7++kICJOTk6KipqYLCxWZHR0dsbGxq7Ors6utrbOiDg4OcnJyra2tcXFxdHR0FhYWdXV1PDw8FBQ=",3,15,55,27,2.9,0.59,0.0287],[4,"Tier IV • Elite do Alto Trono","AQEBAwMDAAABAQEBAQEDAwMDAwMBAQEAAAAAAAICAgAAAAMDAwMDAwEBAQEBAwMDAwMDAAAAAgIAAAMDAwAEAAABAQMDAQEBAwAAAAIAAgACAAACAwMDAwMDAgICAwMBAQEBAbCwsBEREaurpaWlEhISZ2dndnZ2EBAQkZGRlZVEqKifn59paWlra2upqXd3d/v7++kICJOTk6KipqYLCxWwB5mZHBxvbx0dHXOxsbGrs6uzq62zog4ODnJycq2trXFxFhYWdXU=",5,21,49,25,3.15,0.751,0.0254],[5,"Tier V • Campeão Soberano Ápice","AQEBAwMDAAABAQEBAQEDAwMDAwMBAQEAAAAAAAICAgAAAAMDAwMDAwEBAQEBAwMDAwMDAAAAAQECAgAAAwMDBAADBAIAAAEBAwMDAwEBAQMDAAAAAAADAwIAAQIBAwIDAAIAArCwsBEREaurpaWlEhISZ2dndnZ2EBAQkZGRlZVEqKifn59paWlra2upqXd3d/v7++kICJOTk319oqKmpgsLFQ2wcAeqmZkcHG9vEBAdHR1zc7KysbGxdXWsl7OrGQymbrOrs6s=",10,35,35,20,3.58,0.8,0.0234]]
  },
  "mono_neutral_axial": {
    "archetypeId": "mono_neutral_axial",
    "domain": "neutral",
    "name": "Legião Axial Autômata",
    "subtitle": "Mono-Neutro ⚙️ • Constructos, Relíquias & Matriz Horológica",
    "strategySummary": "Opera com Constructos blindados, artilharia de Alcance, Pulso da Matriz (2⚡) e a Expansão de Domínio Matriz Horológica do Ponto Zero (6/6 Afinidade Axial).",
    "tacticalIdentity": "midrange",
    "coverCardId": "neutral_117_elminster_sabio_cinzento",
    "generationsEvolved": 22,
    "matchesSimulated": 7412,
    "seedWinRate": 0.35,
    "championWinRate": 0.412,
    "championDeckJaccardStability": 0.961,
    "medianCardCi95HalfWidth": 0.0512,
    "learnedProfile": {"deckId":"mono_neutral_axial","deckName":"Legião Axial Autômata","archetypeTag":"midrange","generationsTrained":16,"matchesSimulated":6608,"baselineWinRate":0.35,"trainedWinRate":0.442,"weights":{"aggroFaceBias":1.17,"tradeValueBias":1.2,"guardianPriority":1.18,"flyingEvasionBias":1,"stackConsolidationBias":1,"antiAoeSpreadBias":1,"spellHoldPatience":1.03,"relicPriority":1.05,"ascensionEagerness":1.02,"bloodPactThresholdHp":24,"domainExpansionEagerness":1.36,"sovPowerTempoBias":1.04,"synergyHoldBonus":20,"mulliganCurveTarget":3},"mk":[982,922,904,913,910,892],"cp":[182,899,194,984,1008,592,492,393,923,184],"ca":[189,194,593,892,894,899,904,910,913,922,923,928],"hb":[[189,24],[194,22.5],[593,7.4],[892,17.1],[894,21.4],[899,24],[904,23.1],[910,21.1],[913,22.4],[922,23.2],[923,10],[928,16.3],[935,20.6],[940,8.5],[942,24],[983,24],[984,24],[1032,14.5]],"sp":[[983,984],[189,984],[984,922],[984,194],[983,922],[942,984],[189,892],[189,922],[942,983],[189,942]],"dc":[[983,984,0.77,0.368,231," (+37% WR | IC95% ±5.3%, n=231)"],[189,984,0.77,0.368,53," (+37% WR | IC95% ±10.7%, n=53)"],[984,922,0.699,0.297,465," (+30% WR | IC95% ±4.1%, n=465)"],[984,194,0.722,0.32,115," (+32% WR | IC95% ±7.9%, n=115)"],[983,922,0.689,0.287,446," (+29% WR | IC95% ±4.3%, n=446)"],[942,984,0.693,0.291,315," (+29% WR | IC95% ±5.0%, n=315)"],[189,892,0.718,0.316,99," (+32% WR | IC95% ±8.6%, n=99)"],[189,922,0.722,0.32,86," (+32% WR | IC95% ±9.1%, n=86)"],[942,983,0.686,0.284,321," (+28% WR | IC95% ±5.0%, n=321)"],[189,942,0.727,0.325,62," (+32% WR | IC95% ±10.5%, n=62)"],[189,913,0.703,0.301,114," (+30% WR | IC95% ±8.1%, n=114)"],[189,940,0.718,0.316,60," (+32% WR | IC95% ±10.8%, n=60)"]]},
    "topShapleyCards": [[189,0.3711,0.2293,0.1419,0.821,0.772,28],[194,0.2465,0.1401,0.1064,0.694,0.724,72],[983,0.1719,0.0934,0.0785,0.604,0.409,149],[984,0.1715,0.0656,0.1059,0.617,0.682,81],[935,0.1677,0.1074,0.0603,0.584,0.085,257],[922,0.0876,0.0304,0.0572,0.509,0.184,293],[913,0.085,0.0298,0.0552,0.502,0.097,315],[932,0.0844,-0.0112,0.0955,0.524,0.555,105],[591,0.0778,-0.0067,0.0846,0.522,0.657,134],[899,0.0776,0.0024,0.0751,0.512,0.45,170],[892,0.0769,0.0221,0.0548,0.497,0.167,320],[923,0.0745,0.0004,0.0741,0.514,0.563,175]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AwMDAgICAwMDAwMDAwMDAwMDAQEBAAAAAwMDAQMDAQMDAAAAAAMDAQMDAwMBAwMBAQMDAwMDAQEDAwMDAwAAAQMDAAAAAAEDAwMBAQADAwMDAwMBAAADAAMDAwADAwMDAwMDAZGRkU9PT42NjZSUlHx8fIaGhoaGhr6+vo6Ojoimpoiqqru7t7eiooiampqDIpiYJCSjo6OFhSIimKysrPa7tSSFk7fAwMCMk5+fjIy1qpOim5ubJrW2n7b29qa2oIigg4N+fiY=",0,0,58,42,2.66,0.021,0.0096],[2,"Tier II • Guarnição Regular","AwMDAgICAwMDAwMDAwMDAwMDAQEBAAAAAwMDAQMDAQMDAAAAAAMDAQMDAwMDAwMBAQMDAwMDAwMDAwMDAwAAAQMDAAAAAAEDAwMBAQADAwMDAwMBAAADAAMDAwADAwMDAwMDAZGRkU9PT42NjZSUlHx8fIaGhoaGhr6+vo6Ojoimpoivr7u7t7eiooiamprq6piYJCSjo6OFhaenmKysrPa7tSSFk7fAwMCMk5+fjIy1qpOim5ubJrW2n7b29qa2oIigg4N+fiY=",0,6,56,38,2.72,0.3,0.0289],[3,"Tier III • Bastião Veterano","AwMDAgICAwMDAwMDAwMDAwMDAQEBAAAAAwMDAQMDAwMDAwMAAAMDAwMDAwMDAwMAAAMDAwADAwMDAwMDAQMAAAMDAAAAAAAAAQEDAAMDAwMDAwMBAAMBAwEBAwADAwMDAwMDAZGRkU9PT42NjZSUlHx8fIaGhoaGhr6+vo6OjiWmprOvr/b2t7euruSamprq6piYu7ujo6O2haenmKysrIj2tbuFhbfAwMDCwiQkn7bX19jYm5ubJrWfJJ+IiKa2oIigg4N+fiY=",3,14,48,35,2.88,0.605,0.029],[4,"Tier IV • Elite do Alto Trono","AwMDAgICAwMDAwMDAwMDAwMDAQEBAAAAAwMDAQMDAwMDAQEBAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAAEAAwMDBAAAAAAAAAAAAAMDAwMDAwMBAAEAAwAAAwADAwMDAwMDAZGRkU9PT42NjZSUlHx8fIaGhoaGhr6+vo6OjiWmprOvr4iI7bKuruSamprq6piY9vajo6OZmaenmKysrLeItfakpAjAwMDCwru7xsbX19jYm5ubJrWJu9W3t6a2oIigg4N+fiY=",6,22,40,32,2.99,0.733,0.0261],[5,"Tier V • Campeão Soberano Ápice","AwMDAgICAwMDAwMDAwMDAwMDAQEBAAAAAwMDAQIDAwMDAwMBAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAgIAAAMDBAAAAAAAAwMAAAMDAwMDAwMBAAEDAwMDAAADAwMDAwMDAZGRkU9PT42NjZSUlHx8fIaGhoaGhr6+vo6OjiVRsbOvr7Cw7bKuruSamprq6piYnp6jo6OZmaentqysrFBQtbikpAjAwMDCwuPjxsbX19jYm5ubJrWJ1dXw8L22oIigg4N+fiY=",10,34,24,32,3.29,0.84,0.0219]]
  }
});
