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
  "generatedAt": "2026-11-01T03:58:00.948Z",
  "totalMatchesSimulated": 55840,
  "totalStateTrajectoriesTrained": 233969,
  "elapsedSeconds": 298.2,
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

export const POLYCOLOR_ARCHETYPE_MASTERY: Record<PolycolorArchetypeId, PolycolorArchetypeMastery> = unpackMasteryRecord<PolycolorArchetypeId, PolycolorArchetypeMastery>({
  "tri_red_blue_purple": {
    "archetypeId": "tri_red_blue_purple",
    "tierFormat": "tricolor",
    "domains": ["blue","red","purple"],
    "conclaveId": "cataclysm_triads",
    "classicDeckIds": ["deck_tri_arcane_cataclysm","deck_tri_astral_cataclysm"],
    "name": "Cataclismo da Convergência Astral",
    "subtitle": "Tríade ❄️+🔥+💀 • Estase, Fogo Piroclástico & Execução Umbral",
    "strategySummary": "Une Congelamento e compra rúnica de Vórtex à artilharia vulcânica de Pyros e ceifadores letais de Eclipse para domínio absoluto de tempo e remoção.",
    "tacticalIdentity": "control",
    "coverCardId": "blue_98_soberano_mares",
    "generationsEvolved": 19,
    "matchesSimulated": 6224,
    "seedWinRate": 0.458,
    "championWinRate": 0.463,
    "vsMonocolorWinRate": 0.594,
    "vsBicolorWinRate": 0.5,
    "championDeckJaccardStability": 0.961,
    "medianCardCi95HalfWidth": 0.0893,
    "domainCardBreakdown": {"blue":43,"neutral":12,"red":23,"purple":22},
    "crossDomainCombos": [[816,839,1,0.567,8," (100% WR em 8 duelos cruzados)"],[811,1033,0.889,0.456,9," (89% WR em 9 duelos cruzados)"],[54,1033,0.889,0.456,9," (89% WR em 9 duelos cruzados)"],[209,300,0.909,0.446,11," (91% WR em 11 duelos cruzados)"],[591,839,0.875,0.442,8," (88% WR em 8 duelos cruzados)"],[811,839,0.875,0.442,8," (88% WR em 8 duelos cruzados)"]],
    "learnedProfile": {"deckId":"tri_red_blue_purple","deckName":"Cataclismo da Convergência Astral","archetypeTag":"control","generationsTrained":13,"matchesSimulated":6224,"baselineWinRate":0.458,"trainedWinRate":0.458,"weights":{"aggroFaceBias":1.11,"tradeValueBias":1.28,"guardianPriority":1,"flyingEvasionBias":1.28,"stackConsolidationBias":1,"antiAoeSpreadBias":1,"spellHoldPatience":1.27,"relicPriority":1,"ascensionEagerness":1,"bloodPactThresholdHp":24,"domainExpansionEagerness":1.02,"sovPowerTempoBias":1.04,"synergyHoldBonus":26,"mulliganCurveTarget":2.9},"mk":[300,591,648,909,922],"cp":[106,816,22,715,93,838,717,839,38,190],"ca":[54,93,205,300,346,605,800,811,816,839,922,1029],"hb":[[11,6.7],[54,17.7],[93,24],[205,9.1],[221,6.9],[300,24],[346,13.4],[605,23.7],[800,23.2],[811,22.6],[816,24],[839,17],[922,18.7],[1029,24],[1033,24],[1034,19.6],[1035,24]],"sp":[[1033,300],[816,922],[816,300],[922,1033],[816,54],[816,3],[816,1034],[1029,221],[54,1033],[816,221]],"dc":[[816,839,1,0.567,8," (100% WR em 8 duelos cruzados)"],[811,1033,0.889,0.456,9," (89% WR em 9 duelos cruzados)"],[54,1033,0.889,0.456,9," (89% WR em 9 duelos cruzados)"],[209,300,0.909,0.446,11," (91% WR em 11 duelos cruzados)"],[591,839,0.875,0.442,8," (88% WR em 8 duelos cruzados)"],[811,839,0.875,0.442,8," (88% WR em 8 duelos cruzados)"]]},
    "topShapleyCards": [[1029,0.4306,0.3044,0.1262,0.933,0.8,15],[800,0.367,0.1378,0.2292,0.875,0.907,8],[1034,0.2488,0.059,0.1898,0.75,0.77,20],[839,0.2048,0.0656,0.1393,0.707,0.796,41],[1033,0.1667,-0.0219,0.1886,0.667,0.745,24],[838,0.1588,-0.059,0.2178,0.667,0.904,18],[209,0.1392,-0.0333,0.1724,0.633,0.63,30],[816,0.1263,0.0389,0.0873,0.608,0.388,120],[54,0.1124,0.0523,0.06,0.583,0.159,259],[346,0.0965,-0.0543,0.1508,0.585,0.523,41],[93,0.0848,-0.0565,0.1414,0.574,0.539,47],[605,0.0796,-0.0109,0.0905,0.552,0.189,116]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AAADAwEBAAAAAAAAAwMDAgICAAAAAAAAAQEBAwMDAwMAAAAAAgIAAAABAwICAgAAAAAAAAMDAAICAAAAAAICAAIAAAMDAwAAAAAAAQEAAAAAAgICAQEBAgACAQAAAgEAAAIAAN+7jY3Jyb6+vlNTUysrK09PT93d3QsLCywsLCwsLC4u5eXo6G1tJiYmQy5eXl0DAwPNzc0bG1mCgllZW1sdHUsdW0uamprf3zY2NkNDRUVF5W9dXpOTk29qb8xA+IhcakBdS+g=",0,0,78,22,3.15,0.049,0.025],[2,"Tier II • Guarnição Regular","AAADAwEBAAAAAAAAAwMDAgICAAAAAAAAAQEBAwMDAwMAAAAAAQEAAAABAwICAgAAAAAAAAMDAAAAAAAAAAEBAAIAAAMDAwAAAAAAAQEAAAAAAgICAQEBAgACAQAAAgEAAAIAAN+7jY3Jyb6+vlNTUysrK09PT93d3QsLCywsLCwsLC4u5eXo6EVFJiYmQy5eXl0DAwPNzc0bG1lMTFlZW1u8vEsdW0uamprf3zY2NkNDRUVF5W9dXpOTk29qb8xA+IhcakBdS+g=",0,6,72,22,3.17,0.341,0.025],[3,"Tier III • Bastião Veterano","AgMDAwEBAAAAAAAAAwMDAgICAAAAAAAAAQEBBAMDAQMDAwAAAQEAAAABAQICAgAAAAAAAAMDBAAAAAAAAAEBAAAAAAMDAwMAAAAAAAAAAAACAgICAQEBAgACAQAAAgEAAAIAAQ16jY3Jyb6+vlNTUysrK09PT93d3QsLCywsLAssLEMuLi5GRkVFJiYmQ0NeXl0DAwPNzc0bGwlMTFlZWVu8vEtLW1uampos3zY2Nt/fRUVFdnZdXpOTk8tqy8xA+IhcakBdS0o=",3,14,61,22,3.29,0.651,0.025],[4,"Tier IV • Elite do Alto Trono","AgMDAwEBAAAAAAAAAwMDAgICAAAAAAAAAQEBBAMDAwMBAQAAAQEAAAABAQQDAgAAAAAAAAICBAAAAwAAAAEBAQEAAAMDAwMAAAAAAAAAAAACAgICAQEBAgACAQAAAgEAAAIAAQ16jY3Jyb6+vlNTUysrK09PT93d3QsLCywsLAssLDAwT09GRkVFJiYmQ0MKIF0DAwPNzc0BAQlMTFFZWVm8vF5eW1uampos3zY2Nt/fRUVFdnZdXpOTk8tqy8xA+IhcakBdW0o=",6,22,50,22,3.39,0.703,0.025],[5,"Tier V • Campeão Soberano Ápice","AgMDAwEBAAAAAAAAAwMDAgICAAAAAAAAAQEBBAQBAwMBAQAAAQEAAAAAAAQDAAAAAAAAAAICBAAAAwEDAwEBAQEDAwMDAwAAAAAAAgIAAAACAgIAAQEBAgACAQAAAgEAAAIAAQ16jY3Jyb6+vlNTUysrK09PT93d3QsLCywsLAsFSzAwT09GRkVFJiYmOTkKINEDAwPNzc0BAQlMTFFaR0e8vF5eRkaamprn5zY2Ns3NRUVFdnZdFpOTk8tqy8xA+IhcakBdXUo=",10,34,34,22,3.75,0.739,0.025]]
  },
  "tri_red_green_gold": {
    "archetypeId": "tri_red_green_gold",
    "tierFormat": "tricolor",
    "domains": ["red","green","gold"],
    "conclaveId": "cataclysm_triads",
    "classicDeckIds": ["deck_tri_primal_titans","deck_tri_primordial_forge"],
    "name": "Tríade dos Titãs da Forja Primordial",
    "subtitle": "Tríade 🔥+🌿+☀️ • Rampa Colossal, Escudo Divino & Sopro Dracônico",
    "strategySummary": "Acelera Essência com rampa de Veridia para erguer Colossos e Dragões de Pyros blindados pelos Escudos Divinos e hinos imperiais de Solária.",
    "tacticalIdentity": "ramp",
    "coverCardId": "green_67_tiranossauro_alfa",
    "generationsEvolved": 19,
    "matchesSimulated": 6328,
    "seedWinRate": 0.556,
    "championWinRate": 0.509,
    "vsMonocolorWinRate": 0.656,
    "vsBicolorWinRate": 0.533,
    "championDeckJaccardStability": 0.961,
    "medianCardCi95HalfWidth": 0.0671,
    "domainCardBreakdown": {"green":22,"gold":41,"neutral":12,"red":25},
    "crossDomainCombos": [[421,116,1,0.521,10," (100% WR em 10 duelos cruzados)"],[159,1034,1,0.521,8," (100% WR em 8 duelos cruzados)"],[114,116,1,0.491,9," (100% WR em 9 duelos cruzados)"],[126,707,0.941,0.462,17," (94% WR em 17 duelos cruzados)"],[116,300,0.917,0.438,12," (92% WR em 12 duelos cruzados)"],[116,126,0.929,0.42,14," (93% WR em 14 duelos cruzados)"]],
    "learnedProfile": {"deckId":"tri_red_green_gold","deckName":"Tríade dos Titãs da Forja Primordial","archetypeTag":"ramp","generationsTrained":13,"matchesSimulated":6328,"baselineWinRate":0.556,"trainedWinRate":0.49,"weights":{"aggroFaceBias":1.14,"tradeValueBias":1.18,"guardianPriority":1.26,"flyingEvasionBias":0.94,"stackConsolidationBias":1,"antiAoeSpreadBias":1,"spellHoldPatience":0.95,"relicPriority":1,"ascensionEagerness":1.3,"bloodPactThresholdHp":24,"domainExpansionEagerness":1.28,"sovPowerTempoBias":0.93,"synergyHoldBonus":21,"mulliganCurveTarget":3},"mk":[278,300,591,159,784,126],"cp":[665,300,178,664,798,151,799,278,680,432],"ca":[114,116,126,151,159,178,272,278,300,421,473,664],"hb":[[114,10.5],[116,24],[126,17.3],[151,24],[159,12.9],[166,13],[178,14.4],[272,19],[278,20.7],[300,24],[421,10.7],[473,18.3],[664,22.6],[784,20],[798,17.6],[799,24],[800,24],[862,24],[863,24],[880,24],[881,24],[892,11.1],[983,24],[1031,24],[1034,24],[1036,19],[1037,24]],"sp":[[862,300],[1034,300],[1037,272],[421,799],[147,1034],[892,799],[1037,421],[126,1034],[421,116],[421,862]],"dc":[[421,116,1,0.521,10," (100% WR em 10 duelos cruzados)"],[159,1034,1,0.521,8," (100% WR em 8 duelos cruzados)"],[114,116,1,0.491,9," (100% WR em 9 duelos cruzados)"],[126,707,0.941,0.462,17," (94% WR em 17 duelos cruzados)"],[116,300,0.917,0.438,12," (92% WR em 12 duelos cruzados)"],[116,126,0.929,0.42,14," (93% WR em 14 duelos cruzados)"]]},
    "topShapleyCards": [[880,0.4473,0.3853,0.062,1,0.88,10],[800,0.3479,0.1619,0.1859,0.9,0.868,10],[1036,0.3473,0.1614,0.1859,0.9,0.88,10],[1034,0.3429,0.1977,0.1452,0.889,0.746,18],[1037,0.3365,0.1834,0.1532,0.882,0.742,17],[1031,0.3034,0.0441,0.2592,0.857,0.901,7],[116,0.2884,0.1603,0.1281,0.824,0.528,34],[799,0.2298,0.0613,0.1686,0.783,0.881,23],[879,0.2148,-0.0143,0.229,0.769,0.915,13],[151,0.1746,-0.0323,0.2069,0.722,0.778,18],[863,0.1572,-0.0247,0.1818,0.708,0.849,24],[707,0.1557,0.0383,0.1175,0.695,0.609,59]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AQAAAAEBAQAAAQEBAQEBAQICAQEBAwMDAAAAAAAAAAICAgEBAQIAAQEBAgICAgEBAgICAgICAgIAAQEAAQMDAAAAAAABAQEBAQEBAAADAwICAAAAAAAAAQEAAAIBAgEAAgMAA2l3d3ewsLCurhAQEKWlpSZPTywsLHx8fAICAs7Nzc1dXV3MzMzDzgMDA5T09PRpaTExlJSTkzGTnnd3rhtra5OTk56eFhYWjCaMjK2tn59AQJ+fnx8fHxsbzhJAd8PZ16txrWs=",0,0,81,19,2.96,0.049,0.025],[2,"Tier II • Guarnição Regular","AQAAAAEBAQAAAQEBAQEBAAICAQEBAwMDAAAAAAAAAAICAgEBAQIAAQEBAgAAAAEBAgICAgICAgIAAQEAAQMDAAAAAAABAQEBAQEBAAADAwAAAAAAAAAAAQEAAAIBAgEAAgMAA2l3d3ewsLCurhAQEKWlpcJPTywsLHx8fAICAs7Nzc1dXV3MzMzDzgMDA5Ryj49paTExlJSTkzGTnnd3rhtra5OTk56eFhYWjCaMjK2tn5+lpZ+fnx8fHxsbzhJAd8PZ16txrWs=",0,6,75,19,3,0.341,0.025],[3,"Tier III • Bastião Veterano","AQAAAAEBAQAAAQEBAQEBAAICAQEBAwMDAAAABAAAAAICAgEBAQIAAQEBAAAAAAEBAQEBAQICAgIAAQEAAQMDAAAAAAABAQEDAwEBAAADAwAAAAAAAAAAAQEAAAIBAgEAAgMAA253d3ewsLCurhAQEKWlpcJPTywsLHx8fAICAgrNzc1dXV3MzMzDzgMDCnJyj48DaWlp4+MxkzExnnd3rhtra5OTk56eFhYW19eMjK2tr6+lpZ+fnx8fHxsbzs5Ad8PZ16txr2s=",3,14,64,19,3.1,0.651,0.025],[4,"Tier IV • Elite do Alto Trono","AQAAAAEBAQAAAQEBAQEBAAICAQEBAwMDAAAABAAAAAICAgEBAQIABAABAAAAAAEBAQEBAQAAAQEEAQEAAQMDAAAAAAABAQEDAwAAAAADAwAAAAAAAAAAAAAAAAMBAgEAAgMAAG53d3ewsLCurhAQEKWlpcJPTywsLHx8fAICAgrNzc1dXV3MzMzDzgx0CnJyj48DAwNp4+N+fmlpDXd3rhtra5OTk56eFhYW19fGxpmZr6+lpZ+fnx8fH7Kyzs5rd8PZ16txr54=",6,22,53,19,3.19,0.703,0.025],[5,"Tier V • Campeão Soberano Ápice","AQAAAAEBAQAAAQEBAQEBAAICAQEBAwMDAAAABAAAAAICAgMBAQIDBAABAAAAAAMDAwMBAQAAAgIEAwQDAwICAAAAAwMBAQEDAwAAAAADAwAAAAAAAAAAAAADAwADAgEAAgMAAG53d3ewsLCrqxAQEKWlpcJPTywsLHx8fAICAgrNzc1dXV0gzMzDHgx0CnJyj49eXl9f4+N+fpiYDXAHEBCoqJOTk29vFhYW19fGxpmZr6+lpZ+fnx8fH7KyHx+mDcPZ16txr5c=",10,41,30,19,3.75,0.739,0.025]]
  },
  "tri_blue_purple_gold": {
    "archetypeId": "tri_blue_purple_gold",
    "tierFormat": "tricolor",
    "domains": ["gold","blue","purple"],
    "conclaveId": "imperial_triads",
    "classicDeckIds": ["deck_tri_eternal_reliquary"],
    "name": "Relicário do Trono Eterno",
    "subtitle": "Tríade ☀️+❄️+💀 • Cidadela de Relíquias, Cronomancia & Veredito",
    "strategySummary": "Fortifica o Soberano com Guardiões celestes, Relíquias imperiais, Congelamento e reanimação inquisitorial em uma muralha intransponível.",
    "tacticalIdentity": "control",
    "coverCardId": "blue_97_draco_relampago",
    "generationsEvolved": 19,
    "matchesSimulated": 6108,
    "seedWinRate": 0.486,
    "championWinRate": 0.577,
    "vsMonocolorWinRate": 0.766,
    "vsBicolorWinRate": 0.533,
    "championDeckJaccardStability": 1,
    "medianCardCi95HalfWidth": 0.18,
    "domainCardBreakdown": {"gold":24,"neutral":12,"blue":42,"purple":22},
    "crossDomainCombos": [[816,226,1,0.423,8," (100% WR em 8 duelos cruzados)"],[1035,76,0.917,0.37,12," (92% WR em 12 duelos cruzados)"],[48,226,0.944,0.367,18," (94% WR em 18 duelos cruzados)"],[54,1033,0.9,0.353,10," (90% WR em 10 duelos cruzados)"],[69,1037,0.882,0.335,17," (88% WR em 17 duelos cruzados)"],[816,1037,0.875,0.328,8," (88% WR em 8 duelos cruzados)"]],
    "learnedProfile": {"deckId":"tri_blue_purple_gold","deckName":"Relicário do Trono Eterno","archetypeTag":"control","generationsTrained":13,"matchesSimulated":6108,"baselineWinRate":0.486,"trainedWinRate":0.417,"weights":{"aggroFaceBias":0.97,"tradeValueBias":1.41,"guardianPriority":1.38,"flyingEvasionBias":1,"stackConsolidationBias":1,"antiAoeSpreadBias":1,"spellHoldPatience":1.22,"relicPriority":1.2,"ascensionEagerness":1.01,"bloodPactThresholdHp":24,"domainExpansionEagerness":1,"sovPowerTempoBias":1.06,"synergyHoldBonus":21,"mulliganCurveTarget":2.9},"mk":[913,105,272,714],"cp":[145,717,815,322,432,37,40,48,190,38],"ca":[54,105,226,272,816,880,913,1033,1035,1037],"hb":[[54,14],[105,20.2],[226,23.3],[272,12.6],[816,24],[880,22.9],[913,18.6],[1033,22.4],[1035,24],[1037,16.7]],"sp":[[816,1035],[1035,105],[816,913],[1035,272],[1035,913],[816,105],[54,1037],[621,1033],[226,105],[816,1033]],"dc":[[816,226,1,0.423,8," (100% WR em 8 duelos cruzados)"],[1035,76,0.917,0.37,12," (92% WR em 12 duelos cruzados)"],[48,226,0.944,0.367,18," (94% WR em 18 duelos cruzados)"],[54,1033,0.9,0.353,10," (90% WR em 10 duelos cruzados)"],[69,1037,0.882,0.335,17," (88% WR em 17 duelos cruzados)"],[816,1037,0.875,0.328,8," (88% WR em 8 duelos cruzados)"]]},
    "topShapleyCards": [[1035,0.1703,0.0577,0.1127,0.774,0.523,53],[1037,0.1396,-0.0019,0.1415,0.75,0.667,36],[226,0.1256,0.0131,0.1125,0.721,0.371,61],[880,0.0888,-0.0835,0.1722,0.704,0.757,27],[272,0.0684,0.0185,0.0499,0.65,0.081,351],[816,0.0569,-0.0204,0.0773,0.651,0.333,146],[1033,0.0559,-0.1128,0.1687,0.667,0.674,30],[913,0.0532,0.0034,0.0498,0.633,0.06,360],[105,0.0487,-0.009,0.0577,0.637,0.217,267],[54,0.0248,-0.0298,0.0546,0.611,0.184,306],[40,0.0193,-0.1228,0.1421,0.636,0.799,44],[278,0.0187,-0.0423,0.061,0.612,0.329,245]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AQEBAwMDAAAAAwMDAwMDAwMAAAAAAQEAAAABAQEAAAACAgIAAAABAQEBAQMBAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEBAQEBAQEBAQEBArCwsBEREb6+vsLClJSUKioqk5OZmUVFJiYmXFxc+Pj4iIiIZGRkQkJCGxtKG0olJSUxMTE1NTVAQEBKSkpVVVWbm5ucnJydnZ3c3Nzv7+8TExMVFRVISEh4eHiampqtrba2thk=",0,4,28,68,2.77,0.029,null],[2,"Tier II • Guarnição Regular","AQEBAQMDAwAAAAMDAwMDAwMDAAAAAAAAAAABAQAAAQEAAAAAAAEBAQEAAAACAgIAAAACAgIBAQEAAAABAQMBAwMDAwAAAAICAgMDAwMAAAAAAAAAAAAAAAAAAAAAAgICAAAAAIWwsLARERG+vr7CwpSUlCoqKt3d3TAwMJOTfX2ZmUVFJiYmTExeXFxc+Pj4iIiIZGRkbW1tQkJCRUVFGxtKG0r5+fnc3NzKysqampqWk5+fn5GRkTU1NTMzM0NDQ3R051tbW1k=",1,9,63,27,2.76,0.363,null],[3,"Tier III • Bastião Veterano","AQEBAQMDAwAAAAMDAwMDAwMDAQEBAAAAAAAAAAABAQEBAQAAAQEBAAAAAAABAQEBAQAAAAICAgAAAAMCAgIBAQECAgICAAAAAQEDAwEDAwMDAAMDAwAAAAAAAAAAAAICAwICAoWwsLARERG+vr7CwpSUlCoqKhAQEN3d3TAwMJOTfX0WFhaZmZhFRSYmJkxMXl5cXFz4+PiIiIhkZGSvbW1tQkJCzc3Ly0VFRRsbMUobSpqampP5+fnc3Nyfn5+RkZHKykrn5+c=",3,15,55,27,2.81,0.67,null],[4,"Tier IV • Elite do Alto Trono","AQEBAQMDAwAAAAMDAwMDAwMDAQEBAwMDAAAAAAAABAMAAAEBAQEBAAAAAAABAQEAAAAAAAEBAQEBAAAAAgICAAAAAwICAgEBAQICAgIAAAAAAAIBAQMDAQMBAAMDAwICAwICAoWwsLARERG+vr7CwpSUlCoqKhAQEJGRkd3d3TAwMA1wk5N9fRYWFpmZNjY2mEVFJiYmTExeXlxcXPj4+IiIiGRkZK9tbW1CQkLNzcvLRUVFKCgKGxsxShtKSpP5+flwcErn5+c=",5,21,50,24,3.03,0.712,null],[5,"Tier V • Campeão Soberano Ápice","AQEBAQMDAwAAAAMDAwMDAwMDAQEBAwMDAAAAAAAABAMAAAEBAQEBAAAEAAAAAwMAAQEBAAAABAAAAQEBAQEAAAAAAAACAgIAAAADAgICAQEBAgICAgAAAAAAAgEBAwIDAQMBAYWwsLARERG+vr7CwpSUlCoqKhAQEJGRkd3d3TAwMA1wk5N9fRYWFpmZCzY2NjAw4phFRSYmJglMTF5eXFxcaWlp+Pj4iIiIZGRkr21tbUJCQs3Ny8tFRUUoKAobGzEMShtKl0o=",10,21,46,23,3.23,0.75,null]]
  },
  "tri_red_purple_green": {
    "archetypeId": "tri_red_purple_green",
    "tierFormat": "tricolor",
    "domains": ["red","purple","green"],
    "conclaveId": "cataclysm_triads",
    "classicDeckIds": ["deck_tri_blood_moon"],
    "name": "Corte da Lua Sangrenta",
    "subtitle": "Tríade 🔥+💀+🌿 • Frenesi Predatório, Cripta & Atropelar",
    "strategySummary": "Alimenta enxames ferozes com Ímpeto, Toque Letal, Dreno de Vida e reanimação da Cripta para esmagar linhas defensivas por pressão incessante.",
    "tacticalIdentity": "aggro",
    "coverCardId": "purple_138_soberano_carnica",
    "generationsEvolved": 19,
    "matchesSimulated": 6092,
    "seedWinRate": 0.694,
    "championWinRate": 0.693,
    "vsMonocolorWinRate": 0.844,
    "vsBicolorWinRate": 0.583,
    "championDeckJaccardStability": 0.961,
    "medianCardCi95HalfWidth": 0.0463,
    "domainCardBreakdown": {"purple":43,"green":23,"neutral":12,"red":22},
    "crossDomainCombos": [[554,644,1,0.337,11," (100% WR em 11 duelos cruzados)"],[644,34,1,0.337,10," (100% WR em 10 duelos cruzados)"],[554,210,1,0.337,11," (100% WR em 11 duelos cruzados)"],[910,644,1,0.337,12," (100% WR em 12 duelos cruzados)"],[838,205,1,0.337,8," (100% WR em 8 duelos cruzados)"],[336,210,1,0.337,10," (100% WR em 10 duelos cruzados)"]],
    "learnedProfile": {"deckId":"tri_red_purple_green","deckName":"Corte da Lua Sangrenta","archetypeTag":"aggro","generationsTrained":13,"matchesSimulated":6092,"baselineWinRate":0.694,"trainedWinRate":0.625,"weights":{"aggroFaceBias":1.26,"tradeValueBias":1.14,"guardianPriority":1,"flyingEvasionBias":1,"stackConsolidationBias":1,"antiAoeSpreadBias":1,"spellHoldPatience":1,"relicPriority":1,"ascensionEagerness":1,"bloodPactThresholdHp":18,"domainExpansionEagerness":1,"sovPowerTempoBias":1.22,"synergyHoldBonus":20,"mulliganCurveTarget":2.7},"mk":[591,913,922,910,11],"cp":[35,90,99,644,236,838,862,734,736,460],"ca":[11,34,101,114,346,487,545,830,853,910,913,922],"hb":[[2,8.7],[11,13.6],[34,9.4],[93,8.2],[101,14.9],[114,16.1],[236,6.3],[346,16.5],[487,14.6],[545,21.5],[554,7.7],[830,13.9],[839,10.7],[853,14.4],[910,16.7],[913,21.5],[922,14],[1033,19.3]],"sp":[[853,1033],[830,1033],[545,11],[910,1033],[554,545],[487,736],[913,545],[545,34],[853,913],[922,346]],"dc":[[554,644,1,0.337,11," (100% WR em 11 duelos cruzados)"],[644,34,1,0.337,10," (100% WR em 10 duelos cruzados)"],[554,210,1,0.337,11," (100% WR em 11 duelos cruzados)"],[910,644,1,0.337,12," (100% WR em 12 duelos cruzados)"],[838,205,1,0.337,8," (100% WR em 8 duelos cruzados)"],[336,210,1,0.337,10," (100% WR em 10 duelos cruzados)"]]},
    "topShapleyCards": [[1034,0.262,0.1879,0.0741,1,0.904,7],[1033,0.2117,0.0998,0.1119,0.941,0.734,17],[210,0.1577,0.0464,0.1114,0.879,0.566,33],[644,0.1541,0.0356,0.1185,0.889,0.839,27],[545,0.1356,0.0338,0.1018,0.851,0.453,47],[799,0.1167,-0.1425,0.2592,0.857,0.953,7],[101,0.0983,0.0267,0.0716,0.8,0.178,120],[1028,0.095,-0.2032,0.2982,0.833,0.912,6],[862,0.0939,-0.117,0.2109,0.833,0.933,12],[866,0.0866,-0.1413,0.2279,0.818,0.776,11],[853,0.0751,0.0226,0.0525,0.782,0.272,238],[336,0.0697,0.016,0.0537,0.776,0.268,232]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AwMDAwMDAwMDAwAAAAICAgMDAwAAAAEBAQAAAAICAgEAAgEBAAAAAQEBAAAAAAADAwMBAQAAAgIDAwMDAAAAAgABAQAAAAABAQEBAgIBAgICAgAAAwMDAAADAAICAgICAgAAAEJVVVWRkZGOjo4LCwtPT08+Pj7s7OxQUFACAgIqKir3A7X3983NzczMzCIiIgMD9/f3ubnwVoCAQkJBQW9vfJJvZ2d6enx83Nxn3JKSuYDd3d1RUZqamlFqQfDe3t4bGxtl8GU=",0,0,71,29,2.55,0.049,0.025],[2,"Tier II • Guarnição Regular","AwMDAwMDAwMDAwAAAAICAgMDAwAAAAEBAQAAAAICAgEAAAEBAAAAAQEBAAAAAAADAwMBAQICAgIDAwMDAAAAAgABAQAAAAABAQEBAgIBAgICAgAAAwMDAgIDAAICAgICAgAAAEJVVVWRkZGOjo4LCwtPT08+Pj7s7OxQUFACAgIqKir3IyP3983NzczMzCIiIgMD9/f3ubng4ICAQkJBQW9vfJJvZ2d6enx83Nxn3JKSuYDd3d1RUZqamo2NQfDe3t4bGxtl8GU=",0,6,65,29,2.61,0.341,0.025],[3,"Tier III • Bastião Veterano","AQMDAwMDAwMDAwAAAAICAgMDAwAAAAEBAQAAAAICAgEAAAABAAAAAQEBAAAAAQADAwMDAQICAgIDAwIDAAAAAwEAAQMDAAABAQEBAQEBAQICAgAAAwMDAgICAgICAgICAgAAAFpVVVWRkZGOjo4LCwtPT08+Pj7s7OxQUFACAgIqKir3IyPS983NzczMzCIiIvcD9/f3Qrng4ICAQkKAQW9vb2IKfGcBAXx83NxnZ+fnubnd3d1RUZqamo2NhITe3t4bGxtlWmU=",3,14,56,27,2.8,0.651,0.025],[4,"Tier IV • Elite do Alto Trono","AQMDAwMDAwMDAwAAAAICAgMDAwAAAAEBAQAAAAICAgQAAAAEAAAAAQEBAAAAAQEDAgMDAwICAwMDAwAAAAAAAwEAAQMDAAAAAAEBAQEAAAICAgAAAwMDAgICAgICAgICAgAAAFpVVVWRkZGOjo4LCwtPT08+Pj7s7OxQUFACAgIqKioKIyPSBM3NzczMzCIiIvf39yH3QkLg4EZG90JdXW9vb2IKfGcBAXx8cnJnZ+fnTEzd3d1RUZqamo2NhITe3t4bGxtlWmU=",6,22,45,27,3.09,0.703,0.025],[5,"Tier V • Campeão Soberano Ápice","AQMDAwMDAwMDAwAAAAICAgMDAwAAAAEBAQAAAAICAgQAAAAEAAAAAQEBAAAAAwMEAgIDAwICAwMDAwAABAMDAwEAAAMDAwMAAAEBAQEAAAICAgAAAwMDAgICAgICAgICAgAAAFpVVVWRkZGOjo4LCwtPT08+Pj7s7OxQUFACAgIqKioKIyPSBM3NzczMzCIiIh8fCSHlR0fg4EZGRUVdXQxeXmIKc3MBAV9fcnLj4+fnTEzd3d1jY5qamo2NhITe3t4bGxtlWmU=",9,38,26,27,3.71,0.739,0.025]]
  },
  "tri_blue_green_gold": {
    "archetypeId": "tri_blue_green_gold",
    "tierFormat": "tricolor",
    "domains": ["gold","green","blue"],
    "conclaveId": "imperial_triads",
    "classicDeckIds": ["deck_tri_celestial_scales","deck_tri_eternal_horizon"],
    "name": "Escamas do Horizonte Eterno",
    "subtitle": "Tríade ☀️+🌿+❄️ • Falange Radiante, Rampa & Voo Astral",
    "strategySummary": "Une rampa silvestre e compra arcana aos Serafins e Dragões Imperiais de Solária, dominando chão e ar com Escudo Divino e Regeneração.",
    "tacticalIdentity": "midrange",
    "coverCardId": "gold_100_dragao_imperial_ouro",
    "generationsEvolved": 19,
    "matchesSimulated": 6328,
    "seedWinRate": 0.486,
    "championWinRate": 0.56,
    "vsMonocolorWinRate": 0.547,
    "vsBicolorWinRate": 0.467,
    "championDeckJaccardStability": 0.923,
    "medianCardCi95HalfWidth": 0.0882,
    "domainCardBreakdown": {"gold":28,"neutral":12,"green":24,"blue":36},
    "crossDomainCombos": [[1035,591,1,0.47,8," (100% WR em 8 duelos cruzados)"],[1035,278,1,0.47,10," (100% WR em 10 duelos cruzados)"],[581,114,1,0.47,10," (100% WR em 10 duelos cruzados)"],[421,853,1,0.47,12," (100% WR em 12 duelos cruzados)"],[226,487,1,0.47,8," (100% WR em 8 duelos cruzados)"],[784,983,0.933,0.404,15," (93% WR em 15 duelos cruzados)"]],
    "learnedProfile": {"deckId":"tri_blue_green_gold","deckName":"Escamas do Horizonte Eterno","archetypeTag":"midrange","generationsTrained":13,"matchesSimulated":6328,"baselineWinRate":0.486,"trainedWinRate":0.417,"weights":{"aggroFaceBias":1.08,"tradeValueBias":1.22,"guardianPriority":1.33,"flyingEvasionBias":1.27,"stackConsolidationBias":1,"antiAoeSpreadBias":1,"spellHoldPatience":0.99,"relicPriority":1,"ascensionEagerness":1.21,"bloodPactThresholdHp":24,"domainExpansionEagerness":0.96,"sovPowerTempoBias":0.92,"synergyHoldBonus":20,"mulliganCurveTarget":3.1},"mk":[278,272,591,909,126],"cp":[1011,767,421,862,578,190,717,115,909,780],"ca":[58,115,226,272,278,487,581,682,781,784,816,862],"hb":[[54,6],[58,18.3],[114,8.2],[115,13.4],[126,8.6],[226,11.6],[270,18.5],[272,18.2],[278,17.3],[487,17.9],[581,24],[682,12.3],[781,16.6],[784,13.5],[816,24],[853,8.6],[862,22.3],[863,13.3],[864,17.4],[983,24],[1035,24],[1037,23.1]],"sp":[[581,119],[816,1035],[1035,784],[1035,54],[816,278],[278,983],[1035,126],[581,853],[272,983],[1035,272]],"dc":[[1035,591,1,0.47,8," (100% WR em 8 duelos cruzados)"],[1035,278,1,0.47,10," (100% WR em 10 duelos cruzados)"],[581,114,1,0.47,10," (100% WR em 10 duelos cruzados)"],[421,853,1,0.47,12," (100% WR em 12 duelos cruzados)"],[226,487,1,0.47,8," (100% WR em 8 duelos cruzados)"],[784,983,0.933,0.404,15," (93% WR em 15 duelos cruzados)"]]},
    "topShapleyCards": [[1035,0.3058,0.1984,0.1074,0.9,0.691,30],[581,0.1932,0.0691,0.1241,0.786,0.656,42],[226,0.154,0.0236,0.1304,0.744,0.609,43],[862,0.1474,-0.013,0.1604,0.75,0.858,28],[983,0.1346,0.0088,0.1257,0.729,0.698,48],[58,0.1333,0.0464,0.0869,0.718,0.51,103],[816,0.1076,0.0189,0.0887,0.692,0.5,104],[784,0.1024,0.0406,0.0618,0.671,0.181,222],[780,0.0885,-0.0889,0.1774,0.692,0.881,26],[864,0.0645,-0.174,0.2386,0.667,0.848,15],[863,0.064,-0.1047,0.1687,0.667,0.859,30],[278,0.0419,-0.0145,0.0564,0.61,0.163,287]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AAMDAwMDAwAAAAEBAQMDAwEBAQAAAAICAgABAQAAAAABAAEBAQEBAQEAAAABAQEBAQEAAAACAgAAAAEBAQICAAAAAQIBAQEDAwABAQECAgIAAQEBAAAAAAABAQEBAAEAAQABAKGYjY1VVVV3d3ewsLAREREQEBC+vr5PT0/fPj6hkpKhp5Onp94FBQUJioqKA2kDA97eMt/fbW0mJiZCQkJubjY2NkNuk5OTmJi7FhYWQUFtNBsbGysrMjKSQ2lDaTOlMwkzCSs=",0,0,84,16,3.17,0.029,0.025],[2,"Tier II • Guarnição Regular","AAMDAwMDAwAAAAEBAQMDAwEBAQAAAAICAgABAQAAAAABAAEBAQEBAQEAAAABAQEBAQEAAAABAQAAAAEBAQICAAAAAQIBAQEDAwABAQECAgICAQEBAQEAAAABAQEBAAEAAQABAKGYjY1VVVV3d3ewsLAREREQEBC+vr5PT0/fPj6hkpKhp5Onp94FBQUJioqKA2kDA97eMt/fRUUmJiZCQkJubjY2NkNuk5OTmJi7FhYWQUHLyxsbG0pKMjKSQ2lDaTOlMwkzCSs=",0,6,78,16,3.23,0.363,0.025],[3,"Tier III • Bastião Veterano","AgMDAwMDAwAAAAEBAQMDAwEBAQAAAAICAgABAQAAAAAAAAEBAwEBAQEAAAABAQEBAQEEAAABAQAAAAEBAQECAAAAAQEBAQEDAwMBAQEBAgICAQEBAQEAAAAAAQABAAEAAQABAEXXjY1VVVV3d3ewsLAREREQEBC+vr5PT0/fPj6hkpKhoZOnp2IFBQUJioqKA2kDA+PjC9/iRUUmJiZCQkJDbjY2NkNDk5OTr6/XFhYWp0HLyxsbG0pK3zKSMmky5zOlMwkzCSs=",3,14,67,16,3.31,0.67,0.025],[4,"Tier IV • Elite do Alto Trono","AgMDAwMDAwAAAAEBAQMDAwEBAQAAAAICAgABAQQAAwAAAAAAAwEBAQEAAAAAAAEAAQEEAAABAQAAAAEBAQICAAAAAQEBAQEDAwMBAQEAAAICAQEBAQEAAAMAAQABAAEAAQABAEXXjY1VVVV3d3ewsLAREREQEBC+vr5PT0/fPj4Nkg2SkpOhoWIFBQUJioqKcnIDfuPjC9/iRUUmJiZCQkLNzTY2NkNDk5OTr6/XFhYWmZnLyxsbG0pK3zIVMucy5zOlMwkzCSs=",6,22,56,16,3.37,0.712,0.025],[5,"Tier V • Campeão Soberano Ápice","AgMDAwMDAwAAAAEBAQMDAwEBAQAAAAICAgIBAQQCAwMDAAMDAwMDAwIAAwMAAAAAAQEEBAABAQAAAAEBAQICAAAAAwMBAQEDAwMBAQEAAAICAQEBAQEAAAMDAQMBAAEAAgACAEXXjY1VVVV3d3ewsLAREREQEBC+vr5PT08NPj4Nqg0QEJMMDGJgXl6Yc19fcnJ+fuPjCwXiRUUmJiZCQkLNzTY2NjAwk5OTr6/XFhYWmZnLyxsbG0pKOjoV8+fz5zOlM/8zmOc=",10,42,32,16,3.83,0.75,0.025]]
  },
  "tri_blue_purple_green": {
    "archetypeId": "tri_blue_purple_green",
    "tierFormat": "tricolor",
    "domains": ["blue","purple","green"],
    "conclaveId": "imperial_triads",
    "classicDeckIds": ["deck_tri_abyssal_chimera"],
    "name": "Quimera da Fossa Abissal",
    "subtitle": "Tríade ❄️+💀+🌿 • Evolução Necrótica, Estase & Cripta Viva",
    "strategySummary": "Recicla feras primordiais e Leviatãs da Cripta enquanto congela a frente inimiga e acumula vantagem de cartas e Essência.",
    "tacticalIdentity": "attrition",
    "coverCardId": "purple_83_arquidemonio_tempo",
    "generationsEvolved": 19,
    "matchesSimulated": 5720,
    "seedWinRate": 0.569,
    "championWinRate": 0.558,
    "vsMonocolorWinRate": 0.703,
    "vsBicolorWinRate": 0.533,
    "championDeckJaccardStability": 0.961,
    "medianCardCi95HalfWidth": 0.0687,
    "domainCardBreakdown": {"purple":22,"neutral":12,"blue":40,"green":26},
    "crossDomainCombos": [[52,446,1,0.472,8," (100% WR em 8 duelos cruzados)"],[126,547,1,0.472,8," (100% WR em 8 duelos cruzados)"],[922,839,1,0.472,18," (100% WR em 18 duelos cruzados)"],[54,1033,1,0.472,9," (100% WR em 9 duelos cruzados)"],[487,839,1,0.472,10," (100% WR em 10 duelos cruzados)"],[1035,69,1,0.442,9," (100% WR em 9 duelos cruzados)"]],
    "learnedProfile": {"deckId":"tri_blue_purple_green","deckName":"Quimera da Fossa Abissal","archetypeTag":"attrition","generationsTrained":13,"matchesSimulated":5720,"baselineWinRate":0.569,"trainedWinRate":0.49,"weights":{"aggroFaceBias":1.01,"tradeValueBias":1.35,"guardianPriority":1.15,"flyingEvasionBias":1.02,"stackConsolidationBias":1,"antiAoeSpreadBias":1,"spellHoldPatience":1,"relicPriority":1.01,"ascensionEagerness":1.13,"bloodPactThresholdHp":24,"domainExpansionEagerness":1.05,"sovPowerTempoBias":1,"synergyHoldBonus":25,"mulliganCurveTarget":2.9},"mk":[591,84,126,922,101,810],"cp":[838,36,335,349,816,543,93,487,736,91],"ca":[54,84,101,116,266,349,446,487,736,816,839,922],"hb":[[54,14.3],[84,16.9],[101,23.9],[116,17.7],[266,11.6],[349,20.7],[446,10.9],[487,23.7],[736,11.5],[816,24],[839,19.5],[922,14.5],[1029,24],[1033,24],[1035,22.9]],"sp":[[816,101],[1029,109],[487,101],[101,349],[839,349],[816,1033],[69,1033],[816,93],[816,839],[816,487]],"dc":[[52,446,1,0.472,8," (100% WR em 8 duelos cruzados)"],[126,547,1,0.472,8," (100% WR em 8 duelos cruzados)"],[922,839,1,0.472,18," (100% WR em 18 duelos cruzados)"],[54,1033,1,0.472,9," (100% WR em 9 duelos cruzados)"],[487,839,1,0.472,10," (100% WR em 10 duelos cruzados)"],[1035,69,1,0.442,9," (100% WR em 9 duelos cruzados)"]]},
    "topShapleyCards": [[1027,0.3944,0.3144,0.08,1,0.942,6],[1029,0.2053,0.0786,0.1267,0.795,0.621,39],[1035,0.187,0.0398,0.1472,0.774,0.575,31],[866,0.1749,-0.0172,0.1921,0.778,0.889,18],[487,0.1743,0.0977,0.0766,0.758,0.512,120],[1033,0.1739,0.012,0.162,0.769,0.737,26],[547,0.1621,-0.0201,0.1822,0.762,0.828,21],[446,0.1594,0.0179,0.1415,0.75,0.644,36],[545,0.1407,-0.0573,0.198,0.737,0.753,19],[736,0.1372,0.0581,0.079,0.724,0.559,123],[349,0.121,0.0333,0.0877,0.709,0.585,103],[839,0.1162,0.0131,0.103,0.707,0.641,75]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AAAAAAICAgAAAAMDAwAAAAMDAwMDAwAAAAIAAAACAgIAAgIAAAACAgIAAAAAAAAAAAAAAgIAAAIAAgEBAQAAAQEBAQEBAwMDAAAAAAEBAQACAgIAAAEBAAAAAAAAAAACAgEBAFm+vr5PT0/d3d2NjY1tbW0qKiorKytUVFRuNjY2EBAQNG5uM0Mrf39/WVlbW2VlZXFxcZGRe3uReyxqamqKigQEBAkJCZqamkVFRUNCVVVb39/fNDRCQiY1JiszJjNDLCxcVSs=",0,0,75,25,3.07,0.029,0.025],[2,"Tier II • Guarnição Regular","AAAAAAICAgAAAAMDAwAAAAMDAwMDAwAAAAIAAAACAgIAAgIAAAACAgIAAAAAAAAAAAAAAgIAAAIAAgEBAQEBAQEBAQEBAwMDAAAAAAEBAQACAgIAAAEBAAAAAAAAAAACAgECAFm+vr5PT0/d3d2NjY1tbW0qKiorKytUVFRuNjY2EBAQNG5uM0Mrf39/WVlbW2VlZXFxcZGRe3uReyxqamrn5wQEBAkJCZqamkVFRUNCXV1b39/gNDRCQiY1JiszJjNDLCxcIys=",0,6,69,25,3.07,0.363,0.025],[3,"Tier III • Bastião Veterano","AgAAAAICAgAAAAMDAwAAAAMDAwMDAwAAAAIAAAACAgIAAgIAAQAEAgICAAAAAAAAAAABAAIBAAIAAgEAAQEBAQEBAQEBAwMDAAAAAQEBAQAAAgIAAAEBAAAAAAAAAAACAgECACG+vr5PT0/d3d2NjY1tbW0qKiorKytUVFRuNjY2EBAQNG5uM08rCX9/f1lZWWVlZXFxCnuRanuRe5FqcWrn5wQEBAkJCZqamkVFRUpKXV1bW+DgNDRFRSY1JiszJjND//9cIys=",3,14,61,22,3.22,0.67,0.025],[4,"Tier IV • Elite do Alto Trono","AgAAAAICAgAAAAMDAwAAAAMDAwMDAwAAAAQAAAACAgAAAgIBAQEEAQICAgAAAAAAAAABAAABAAMAAwEAAQEBAQEBAQEBAwMDAAAAAQEBAQEBAgIAAAEBAAAAAgAAAAACAgECAiG+vr5PT0/d3d2NjY1tbW0qKiorKytUVFQLNjY2EBA/NG5uT0+gCb5/f39ZWWVlZXFxCnJyantie2JqcWrn5wQEBAkJCZqamkVFRUpKXV1eXuDgNDRFRSY1JhAzJjND//9cI24=",6,22,50,22,3.34,0.712,0.025],[5,"Tier V • Campeão Soberano Ápice","AgAAAAICAgAAAAMDAwAAAAMDAwMDAwAAAAQAAAAAAAAEAwMBAQEEAQQDAwAAAAAABAABAAAAAAMDAwADAwEBAQEBAQEBAwMDAAAAAQEBAQEBAgIAAAEBAAAAAAAAAAACAgECACG+vr5PT0/d3d2NjY1tbW0qKiorKytUVFQLNjY2RkY/BTAwT0+gCb4DR0ddXWVlZQx0CnJyfn5iXmJzX1/n5wQEBAkJCZqamkVFRUpKXV1eXuDgNDRFRSY1JuczJjND//9cI+c=",10,38,30,22,3.76,0.75,0.025]]
  },
  "tri_red_purple_gold": {
    "archetypeId": "tri_red_purple_gold",
    "tierFormat": "tricolor",
    "domains": ["gold","red","purple"],
    "conclaveId": "cataclysm_triads",
    "classicDeckIds": ["deck_tri_crimson_sun"],
    "name": "Eclipse do Sol Carmesim",
    "subtitle": "Tríade ☀️+🔥+💀 • Serafins Sanguinários, Dreno & Artilharia",
    "strategySummary": "Marcha sob estandartes de Escudo Divino e Renascer enquanto drena vida e incinera bloqueadores com fogo vulcânico e vereditos sombrios.",
    "tacticalIdentity": "midrange",
    "coverCardId": "red_119_soberano_piroclasma",
    "generationsEvolved": 19,
    "matchesSimulated": 6252,
    "seedWinRate": 0.514,
    "championWinRate": 0.618,
    "vsMonocolorWinRate": 0.719,
    "vsBicolorWinRate": 0.583,
    "championDeckJaccardStability": 0.961,
    "medianCardCi95HalfWidth": 0.0539,
    "domainCardBreakdown": {"gold":34,"neutral":12,"red":32,"purple":22},
    "crossDomainCombos": [[272,346,1,0.412,8," (100% WR em 8 duelos cruzados)"],[278,839,1,0.412,8," (100% WR em 8 duelos cruzados)"],[576,935,1,0.412,9," (100% WR em 9 duelos cruzados)"],[576,503,1,0.412,10," (100% WR em 10 duelos cruzados)"],[1037,272,1,0.382,9," (100% WR em 9 duelos cruzados)"],[784,935,0.95,0.362,20," (95% WR em 20 duelos cruzados)"]],
    "learnedProfile": {"deckId":"tri_red_purple_gold","deckName":"Eclipse do Sol Carmesim","archetypeTag":"midrange","generationsTrained":13,"matchesSimulated":6252,"baselineWinRate":0.514,"trainedWinRate":0.542,"weights":{"aggroFaceBias":1.24,"tradeValueBias":1.24,"guardianPriority":1.27,"flyingEvasionBias":1.28,"stackConsolidationBias":1,"antiAoeSpreadBias":1,"spellHoldPatience":1.11,"relicPriority":1,"ascensionEagerness":1,"bloodPactThresholdHp":24,"domainExpansionEagerness":1.05,"sovPowerTempoBias":1,"synergyHoldBonus":18,"mulliganCurveTarget":2.9},"mk":[278,913,317,272,201,784,421,11],"cp":[680,95,839,791,278,935,779,144,149,913],"ca":[3,11,83,144,201,205,272,278,346,421,460,576],"hb":[[3,17.6],[11,18.8],[83,11.4],[144,15.2],[201,14.7],[205,11],[272,16.8],[278,16.6],[346,19.8],[421,14.7],[460,17.3],[576,13.7],[580,10.9],[644,18.2],[735,8.9],[784,24],[791,10.9],[834,10.8],[839,24],[880,24],[892,7.4],[913,18.3],[1031,24],[1033,24]],"sp":[[913,1033],[278,1033],[784,201],[580,83],[644,11],[784,791],[346,460],[735,460],[1033,11],[791,460]],"dc":[[272,346,1,0.412,8," (100% WR em 8 duelos cruzados)"],[278,839,1,0.412,8," (100% WR em 8 duelos cruzados)"],[576,935,1,0.412,9," (100% WR em 9 duelos cruzados)"],[576,503,1,0.412,10," (100% WR em 10 duelos cruzados)"],[1037,272,1,0.382,9," (100% WR em 9 duelos cruzados)"],[784,935,0.95,0.362,20," (95% WR em 20 duelos cruzados)"]]},
    "topShapleyCards": [[880,0.3363,0.2563,0.08,1,0.91,6],[839,0.2652,0.1303,0.1349,0.929,0.904,14],[610,0.2651,0.1202,0.1449,0.923,0.797,13],[739,0.2273,0.022,0.2053,0.889,0.868,9],[935,0.2005,0.1335,0.0669,0.842,0.47,114],[1037,0.1888,0.0248,0.164,0.842,0.703,19],[346,0.1548,0.0189,0.1359,0.794,0.424,34],[317,0.1525,-0.0755,0.2279,0.818,0.951,11],[1034,0.1362,-0.2145,0.3506,0.8,0.914,5],[503,0.1132,0.0043,0.1089,0.772,0.811,57],[460,0.0704,0.012,0.0584,0.697,0.179,238],[576,0.058,-0.0298,0.0877,0.709,0.652,103]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AAMDAwAAAAMDAwMDAwAAAAEBAQEBAQMDAwAAAAAAAAAAAQAAAAMDAQECAgAAAAEBAQMDAwICAAAAAAACAgMDAwICAgEBAQIDAwMDAwAAAAEBAQICAgAAAQEBAwEAAwICAAAAAJKRkZELCwuNjY18fHyQkJAQEBClpaUXFxfJyclTU1OSkhuTk5MEBBsbXV3Nzc3MzMwcHBy1tVlZWVtbHYJCQkLf399TU1MdmJhpaWkDAwMWFhZAQECtn/f395gXWwQdXdXV1Z8=",0,0,73,27,2.84,0.049,0.025],[2,"Tier II • Guarnição Regular","AAMDAwAAAAMDAwMDAwAAAAEBAQEBAQMDAwAAAAAAAAAAAAAAAAMDAQECAgAAAAEBAQMDAwICAAAAAAACAgMDAwICAgEBAQIDAwMDAwAAAAEBAQICAgAAAQEBAwEAAwICAAAAAJKRkZELCwuNjY18fHyQkJAQEBClpaUXFxfJyclTU1OSkq+Tk5MEBBsbXV3Nzc3MzMwcHBy1tVlZWVtbHYJCQkLf399TU1Mdp6dpaWkDAwMWFhZAQECtn/f3968XWwQdXdXVI68=",0,6,67,27,2.86,0.341,0.025],[3,"Tier III • Bastião Veterano","AgMDAwAAAAMDAwMDAwAAAAEBAQEBAQMDAwAAAAAAAAAAAAAAAAMDAwMEAgAAAAEBAQMDAwICBAAAAAAAAAMDAwICAgABAQEDAwMDAwAAAAEBAQICAgADAQEBAwEAAAICAQEAAESRkZELCwuNjY18fHyQkJAQEBClpaUXFxfJyclTU1OSkq+Tk5MEBBAQCl3Nzc3MzMwcHBxdtQlZWVtbTExCQkLf399bU1NTp6dpaWkDAwMWFhZAQECtbvf3968XWZLgXT09I68=",3,14,56,27,2.97,0.651,0.025],[4,"Tier IV • Elite do Alto Trono","AgMDAwAAAAMDAwMDAwAAAAEBAQEBAQMDAwAAAAAAAAQDAAAAAAAAAwMEBAAAAAEBAQMDAwICBAAAAAMAAAMDAwICAgICAgIDAwMDAwAAAAEBAQICAgADAQEBAwEAAwICAQEAAESRkZELCwuNjY18fHyQkJAQEBClpaUXFxfJyclTU1MNcK+Tk5OmphAQCgTNzc3MzMwcHBxdXQlZWVtHTExCQkLf39+EhOHhp6dpaWkDAwMWFhZAQECtbvf3968XWW/gXT09I68=",6,22,45,27,3.33,0.703,0.025],[5,"Tier V • Campeão Soberano Ápice","AgMDAwAAAAMDAwMDAwAAAAEBAQEBAQMDAwAAAAAAAAQDAAAAAAAAAwMEBAAAAAEBAQMDAwICBAECAwMAAAMDAwICAgICAgIDAwMDAwAAAAEBAQICAgADAQEBAwECAwICAQEAAESRkZELCwuNjY18fHyQkJAQEBClpaUXFxfJyclTU1MNcK+Tk5OmphAQCgTNzc3MzMwcHBy8vAlaIUdHTExCQkLf39+EhOHhp6dpaWkDAwMWFhZAQECtbvf3968X42/gYj09I68=",9,26,38,27,3.5,0.739,0.025]]
  },
  "tri_purple_green_gold": {
    "archetypeId": "tri_purple_green_gold",
    "tierFormat": "tricolor",
    "domains": ["gold","green","purple"],
    "conclaveId": "imperial_triads",
    "classicDeckIds": [],
    "name": "Armada do Zênite Umbral",
    "subtitle": "Tríade ☀️+🌿+💀 • Bastião Imortal, Regeneração & Renascer",
    "strategySummary": "Ergue a linha de frente mais resiliente de Vaeloria unindo Guardiões dourados, Regeneração silvestre, Toque Letal e ressurreição da Cripta.",
    "tacticalIdentity": "attrition",
    "coverCardId": "gold_138_imperador_sol_supremo",
    "generationsEvolved": 19,
    "matchesSimulated": 6352,
    "seedWinRate": 0.417,
    "championWinRate": 0.616,
    "vsMonocolorWinRate": 0.734,
    "vsBicolorWinRate": 0.517,
    "championDeckJaccardStability": 0.961,
    "medianCardCi95HalfWidth": 0.0592,
    "domainCardBreakdown": {"gold":33,"neutral":12,"green":33,"purple":22},
    "crossDomainCombos": [[1037,853,1,0.414,8," (100% WR em 8 duelos cruzados)"],[272,267,1,0.414,10," (100% WR em 10 duelos cruzados)"],[381,140,1,0.414,8," (100% WR em 8 duelos cruzados)"],[655,140,1,0.384,10," (100% WR em 10 duelos cruzados)"],[863,126,1,0.384,9," (100% WR em 9 duelos cruzados)"],[678,101,0.929,0.343,14," (93% WR em 14 duelos cruzados)"]],
    "learnedProfile": {"deckId":"tri_purple_green_gold","deckName":"Armada do Zênite Umbral","archetypeTag":"attrition","generationsTrained":13,"matchesSimulated":6352,"baselineWinRate":0.417,"trainedWinRate":0.573,"weights":{"aggroFaceBias":1.06,"tradeValueBias":1.32,"guardianPriority":1.37,"flyingEvasionBias":1,"stackConsolidationBias":1.22,"antiAoeSpreadBias":1,"spellHoldPatience":1,"relicPriority":1.02,"ascensionEagerness":1,"bloodPactThresholdHp":24,"domainExpansionEagerness":1.05,"sovPowerTempoBias":1.04,"synergyHoldBonus":20,"mulliganCurveTarget":2.9},"mk":[910,913,278,126,272,784,421],"cp":[380,858,916,678,944,126,780,90,101,854],"ca":[99,101,114,119,126,140,145,175,272,278,421,483],"hb":[[99,24],[101,21.3],[114,21.1],[119,20.6],[126,13.3],[140,17.3],[145,15.9],[175,14.2],[272,13.4],[278,14.4],[421,13.6],[483,13.2],[545,20.9],[682,17.4],[781,12.7],[784,22],[838,13.7],[839,17.4],[853,12.2],[863,15.8],[910,20.4],[913,19.4],[1031,24],[1033,24],[1036,15.3],[1037,24]],"sp":[[421,1033],[145,1033],[784,1033],[119,1033],[1037,126],[910,1033],[119,863],[1037,853],[1033,101],[545,101]],"dc":[[1037,853,1,0.414,8," (100% WR em 8 duelos cruzados)"],[272,267,1,0.414,10," (100% WR em 10 duelos cruzados)"],[381,140,1,0.414,8," (100% WR em 8 duelos cruzados)"],[655,140,1,0.384,10," (100% WR em 10 duelos cruzados)"],[863,126,1,0.384,9," (100% WR em 9 duelos cruzados)"],[678,101,0.929,0.343,14," (93% WR em 14 duelos cruzados)"]]},
    "topShapleyCards": [[1015,0.2163,0.0542,0.1621,0.875,0.861,16],[140,0.1886,0.0638,0.1249,0.829,0.485,35],[99,0.1745,0.0254,0.1491,0.833,0.864,24],[1033,0.1586,-0.0327,0.1913,0.813,0.765,16],[781,0.1473,-0.028,0.1753,0.8,0.74,20],[1036,0.1391,-0.0442,0.1833,0.789,0.694,19],[862,0.1374,-0.2132,0.3506,0.8,0.939,5],[863,0.1084,-0.0204,0.1288,0.762,0.757,42],[119,0.0894,0.0365,0.0529,0.71,0.104,283],[678,0.0816,-0.0476,0.1292,0.733,0.72,45],[483,0.0743,-0.0102,0.0844,0.705,0.309,112],[1037,0.0724,-0.1036,0.176,0.72,0.638,25]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AQEBAQMDAwEBAQMDAwAAAAMDAwMDAwICAgAAAAMDAwMDAwEBAAMAAAAAAAABAQACAgABAQAAAAAAAwABAQICAAACAgICAAAAAQEBAgEDAwMBAwMDAwMBAQEBAAADAAADAQMBA3cQEBCRkZGlpaWOjo6RkZGUlJRVVVWPj493d3dAQEAFBQUbG55rrq6Tk5NxBARxkZFxamp7e1lZWfdbVVXf31tbf39/32VlZQkJCZFqV1dXBFZWVmtrFhYWd557mq6emhv3d5o=",0,0,79,21,2.87,0.029,0.025],[2,"Tier II • Guarnição Regular","AQEBAQMDAwEBAQMDAwAAAAMDAwMDAwICAgAAAAMDAwMDAwEBAAMAAAAAAAABAQACAgABAQAAAAAAAwAAAAAAAAACAgAAAAAAAQEBAgEDAwMBAwMDAwMBAQEBAAADAAADAQMBA3cQEBCRkZGlpaWOjo6RkZGUlJRVVVWPj493d3dAQEAFBQUbG55rrq6Tk5NxBARxkZFxamp7e1lZWfdbTExjY1tbf39aWmVlZQkJCZFqV1dXBFZWVmtrFhYWd557mq6emhv3d5o=",0,6,73,21,2.92,0.363,0.025],[3,"Tier III • Bastião Veterano","BAEBAQMDAwEBAQMDAwAAAAMDAwMDAwICAgAAAAMDAwMDAwAAAAAAAAAAAAAAAAACAgABAQAABAIAAwAAAAAAAAAAAAAAAAAAAQEBAgEDAwMBAwMDAwMBAQEBAQADAAADAAMBAwcQEBCRkZGlpaWOjo6RkZGUlJRVVVWPj493d3dAQEAFBQWvr56erq6Tk5NxcnJxkZFxamp7ewkhWfdbTExjY1lZW1taWmVlZQkJCZFqV1dXBFZWVmtrFhYWd3d7r5mer5n3d5o=",3,14,62,21,3.06,0.67,0.025],[4,"Tier IV • Elite do Alto Trono","BAEBAQMDAwEBAQMDAwAAAAMDAwMDAwICAgAAAAMDAwQDAwAAAAAAAAAAAAQAAAAAAAAAAQAABAIBAwMAAAAAAQEDAwAAAAAAAQEBAwEDAwMDAwMDAAMBAQEBAQEDAAEDAAMDAwcQEBCRkZGlpaWOjo6RkZGUlJRVVVWPj493d3dAQEANBQWvr56erq6Tk5MMcnJxe35xcWp7ewkhvvdHTExjY1lZRkZaWmVlZQkJCV5qV1dXXlZWVp5rFhYWd3dqr5l3r5n3BZo=",6,22,51,21,3.34,0.712,0.025],[5,"Tier V • Campeão Soberano Ápice","BAEBAQMDAwEBAQMDAwAAAAMDAwMDAwICAgAAAAMDAwQCAwAAAgIDAwAAAAQAAAAAAAEDAwEBBAIBAwMAAAAAAQEDAwAAAAAAAQEBAwIDAwMDAwMDAQEBAQEDAwMDAAADAAMAAwcQEBCRkZGlpaWOjo6RkZGUlJRVVVWPj493d3dAQEANqg2vr6amEBCTk5MMcnKMfn4LX1/j4wkhvvdHTExjY1lZRkZaWmVlZQkJCV6YV1dXXlZWVn19FhYWDAxar5mmr5n3l7A=",10,40,29,21,3.82,0.75,0.025]]
  },
  "tri_red_blue_green": {
    "archetypeId": "tri_red_blue_green",
    "tierFormat": "tricolor",
    "domains": ["red","green","blue"],
    "conclaveId": "cataclysm_triads",
    "classicDeckIds": [],
    "name": "Tempestade Elemental Primeva",
    "subtitle": "Tríade 🔥+🌿+❄️ • Rampa Relâmpago, Leviatãs & Sopro Glacial",
    "strategySummary": "Acelera Essência e compra cartas simultaneamente para despejar Dragões, Hidras e Arcontes com Ímpeto, Voo e Congelamento de linha.",
    "tacticalIdentity": "tempo",
    "coverCardId": "red_47_arquiduque_ferro",
    "generationsEvolved": 19,
    "matchesSimulated": 6336,
    "seedWinRate": 0.444,
    "championWinRate": 0.586,
    "vsMonocolorWinRate": 0.766,
    "vsBicolorWinRate": 0.567,
    "championDeckJaccardStability": 0.923,
    "medianCardCi95HalfWidth": 0.18,
    "domainCardBreakdown": {"green":22,"neutral":12,"red":22,"blue":44},
    "crossDomainCombos": [[862,126,1,0.414,8," (100% WR em 8 duelos cruzados)"],[1035,300,0.917,0.361,12," (92% WR em 12 duelos cruzados)"],[116,922,0.875,0.319,8," (88% WR em 8 duelos cruzados)"],[1035,54,0.889,0.303,9," (89% WR em 9 duelos cruzados)"],[114,863,0.875,0.289,8," (88% WR em 8 duelos cruzados)"],[58,114,0.828,0.272,29," (83% WR em 29 duelos cruzados)"]],
    "learnedProfile": {"deckId":"tri_red_blue_green","deckName":"Tempestade Elemental Primeva","archetypeTag":"tempo","generationsTrained":13,"matchesSimulated":6336,"baselineWinRate":0.444,"trainedWinRate":0.51,"weights":{"aggroFaceBias":1.16,"tradeValueBias":1.24,"guardianPriority":1.01,"flyingEvasionBias":1.28,"stackConsolidationBias":1,"antiAoeSpreadBias":1,"spellHoldPatience":1.03,"relicPriority":1,"ascensionEagerness":1.37,"bloodPactThresholdHp":24,"domainExpansionEagerness":0.99,"sovPowerTempoBias":1.01,"synergyHoldBonus":20,"mulliganCurveTarget":2.9},"mk":[300,126,318,457,11,591],"cp":[1011,798,664,38,767,190,909,403,269,483],"ca":[58,126,300,816,1035],"hb":[[54,8.8],[58,16.9],[114,9],[126,12],[300,23],[605,6.1],[816,21.7],[922,6.7],[1035,23.7]],"sp":[[1035,11],[58,300],[816,1035],[816,119],[1035,114],[1036,3],[816,605],[1036,300],[816,126],[1035,58]],"dc":[[862,126,1,0.414,8," (100% WR em 8 duelos cruzados)"],[1035,300,0.917,0.361,12," (92% WR em 12 duelos cruzados)"],[116,922,0.875,0.319,8," (88% WR em 8 duelos cruzados)"],[1035,54,0.889,0.303,9," (89% WR em 9 duelos cruzados)"],[114,863,0.875,0.289,8," (88% WR em 8 duelos cruzados)"],[58,114,0.828,0.272,29," (83% WR em 29 duelos cruzados)"]]},
    "topShapleyCards": [[1035,0.2781,0.1466,0.1315,0.9,0.722,20],[58,0.1083,0.0297,0.0785,0.711,0.337,128],[1036,0.0963,-0.1106,0.2069,0.722,0.802,18],[922,0.0911,0.0112,0.0799,0.71,0.655,124],[126,0.073,0.0107,0.0622,0.668,0.188,220],[1034,0.0598,-0.1673,0.2271,0.688,0.837,16],[11,0.0567,-0.0035,0.0602,0.66,0.343,238],[37,0.0534,-0.0362,0.0895,0.657,0.365,108],[54,0.0397,-0.0163,0.0561,0.636,0.209,283],[816,0.0389,-0.0418,0.0807,0.64,0.299,136],[300,0.038,-0.0108,0.0488,0.626,0.043,377],[114,0.0196,-0.0501,0.0697,0.615,0.19,187]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AAICAgEBAQMDAwAAAAEBAQAAAAAAAAEBAQEAAAACAgIBAAAAAAAAAAEBAAEAAAEBAQACAgAAAAAAAAAAAAEAAwMDAQEBAAACAgICAAAAAAADAwMCAgEAAgABAAMAAAAAAgAAAnFPT08sLCyNjY13d3fMycm+vr4LCws+Pj7Mzc3NXV1dzAMDcXt7fHzf33vfiYng4EIlbW0mJibo6Og2NjZC35qampOTkzQ0yG3IyN/fRUVFLCwsbm5CiW404I05H3xxH9EfJdE=",0,0,73,27,2.9,0.049,0.025],[2,"Tier II • Guarnição Regular","AAICAgEBAQMDAwAAAAEBAQAAAAAAAAEBAQEAAAACAgIBAAAAAAAAAAEBAAEAAAEBAQABAQAAAAAAAAAAAAEAAwMDAQEBAgICAgICAAAAAAADAwMCAgEBAgIBAAMAAAAAAgAAAnFPT08sLCyNjY13d3fMycm+vr4LCws+Pj7Mzc3NXV1dzAMDcXt7fHzf33vfiYng4EIlRUUmJibo6Og2NjZC35qampOTk8vLyG3IyN/fRUVFLCwsbm5CDW574I05H3xxH9EfJdE=",0,6,67,27,2.96,0.341,0.025],[3,"Tier III • Bastião Veterano","BAICAgEBAQMDAwAAAAEBAQAAAAAAAAEBAQEAAAACAgIBAAAAAQAAAAABAAECAgEBBAABAQAAAAAAAAAAAAEBAwMDAQEBAgIBAQMDAQAAAAADAwMCAgABAgIBAAMAAAAAAgAAAgxPT08sLCyNjY13d3fMycm+vr4LCws+Pj7Mzc3NXV1dzAMDceB7j49x33vf///g4AslRUUmJibo6Og2NjZCQpqampOTk8vLSkrz80LfRUVFLCwsbm4/DW573405H3txH9EfJdE=",3,14,56,27,3.15,0.651,0.025],[4,"Tier IV • Elite do Alto Trono","BAICAgEBAQMDAwAAAAABAQAAAAAAAAEBAQEAAAACAgIBAAAAAAAAAAAAAwECAgAABAABAQAAAAAAAAAAAAIBAwMDAQEBAgIBAQMDAAAAAAADAwMCAgABAgIBAAMAAwAAAgAAAgxPT08sLCyNjY13d3fSycm+vr4LCws+Pj7Mzc3NXV1dzAMDdHJyj49xcQHf//9+fgslRUUmJibo6Og2NjZuQpqampOTk8vLSkrz8zo6RUVFLCwsbm4/DQx73405H2JxH9EfJdE=",6,22,45,27,3.27,0.703,0.025],[5,"Tier V • Campeão Soberano Ápice","BAICAgEBAQMDAwAAAAABAQAAAAAAAAEBAQQAAAACAgIDAAAAAAAAAAMDAwMCAgAABAABAQAAAAAAAAAAAAMDAwMDAQEBAgIBAQMDAAAAAAADAwMDAgABAgIBAAMAAwIAAgAAAgxPT08sLCyNjY13d3fSycm+vr4LCws+Pj4Kzc3NXV1dIAMDdHJyj49eXgFf//9+fgslRUUmJibo6Og2NjYwMJqampOTk8vLSkrz8zo6RUVFLCwsMc8/DQx7c405H2KZH9EfJdE=",10,29,34,27,3.58,0.739,0.025]]
  },
  "tri_red_blue_gold": {
    "archetypeId": "tri_red_blue_gold",
    "tierFormat": "tricolor",
    "domains": ["gold","red","blue"],
    "conclaveId": "imperial_triads",
    "classicDeckIds": [],
    "name": "Conclave da Chama Celeste",
    "subtitle": "Tríade ☀️+🔥+❄️ • Esquadra Aérea, Escudo Divino & Feitiçaria",
    "strategySummary": "Domina os céus com Dragões Solares e Fênix protegidos por Escudo Divino, Congelamento tático e rajadas piroclásticas precisas.",
    "tacticalIdentity": "tempo",
    "coverCardId": "gold_173_general_roda_sol",
    "generationsEvolved": 19,
    "matchesSimulated": 6300,
    "seedWinRate": 0.472,
    "championWinRate": 0.695,
    "vsMonocolorWinRate": 0.797,
    "vsBicolorWinRate": 0.567,
    "championDeckJaccardStability": 0.961,
    "medianCardCi95HalfWidth": 0.0862,
    "domainCardBreakdown": {"red":22,"blue":41,"neutral":12,"gold":25},
    "crossDomainCombos": [[1035,784,1,0.335,9," (100% WR em 9 duelos cruzados)"],[816,159,1,0.335,19," (100% WR em 19 duelos cruzados)"],[1035,272,1,0.335,9," (100% WR em 9 duelos cruzados)"],[1037,913,1,0.335,9," (100% WR em 9 duelos cruzados)"],[54,1037,1,0.335,9," (100% WR em 9 duelos cruzados)"],[272,1034,1,0.335,8," (100% WR em 8 duelos cruzados)"]],
    "learnedProfile": {"deckId":"tri_red_blue_gold","deckName":"Conclave da Chama Celeste","archetypeTag":"tempo","generationsTrained":13,"matchesSimulated":6300,"baselineWinRate":0.472,"trainedWinRate":0.583,"weights":{"aggroFaceBias":1.16,"tradeValueBias":1.2,"guardianPriority":0.94,"flyingEvasionBias":1.41,"stackConsolidationBias":1,"antiAoeSpreadBias":1,"spellHoldPatience":1.19,"relicPriority":1.04,"ascensionEagerness":0.98,"bloodPactThresholdHp":24,"domainExpansionEagerness":0.96,"sovPowerTempoBias":1,"synergyHoldBonus":22,"mulliganCurveTarget":2.8},"mk":[300,159,913,272,784,70],"cp":[335,70,403,715,457,943,278,942,1011,57],"ca":[11,58,159,272,300,460,784,816,880,892,913,1029],"hb":[[11,12.1],[54,7.7],[58,14],[159,18.6],[272,16.8],[278,7],[300,20.8],[421,7.4],[460,10.4],[784,20.3],[816,24],[880,24],[892,13],[913,18.2],[1029,15.8],[1034,13.2],[1035,17],[1037,13]],"sp":[[816,159],[816,784],[816,892],[816,278],[913,1034],[816,300],[816,272],[816,913],[1035,272],[816,11]],"dc":[[1035,784,1,0.335,9," (100% WR em 9 duelos cruzados)"],[816,159,1,0.335,19," (100% WR em 19 duelos cruzados)"],[1035,272,1,0.335,9," (100% WR em 9 duelos cruzados)"],[1037,913,1,0.335,9," (100% WR em 9 duelos cruzados)"],[54,1037,1,0.335,9," (100% WR em 9 duelos cruzados)"],[272,1034,1,0.335,8," (100% WR em 8 duelos cruzados)"]]},
    "topShapleyCards": [[1035,0.1931,0.0907,0.1024,0.923,0.694,26],[226,0.185,0.0151,0.1699,0.909,0.577,11],[816,0.0955,0.023,0.0724,0.807,0.325,114],[1034,0.0882,-0.073,0.1612,0.818,0.694,22],[784,0.0826,0.0303,0.0523,0.782,0.091,239],[159,0.0665,-0.0111,0.0776,0.77,0.163,113],[880,0.0612,-0.1867,0.2479,0.8,0.87,10],[913,0.0607,0.015,0.0456,0.76,0.074,337],[300,0.057,0.0118,0.0452,0.759,0.129,344],[421,0.0544,-0.0037,0.0581,0.771,0.429,201],[22,0.0335,-0.0875,0.121,0.766,0.743,47],[37,0.0327,-0.1277,0.1604,0.75,0.44,28]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AgEBAQAAAAAAAAEBAQMDAwMDAwICAgEBAQEBAQMDAwAAAAIDAAAAAgIBAQEAAAAAAAACAAMCAAACAgAAAAAAAAEBAQAAAAAAAAICAQEBAAIBAQEAAAAAAwMCAwIAAwIDAwAAAl3JyckLCwvd3d0sLCyNjY18fHw9PT0QEBClpaWRkZGenp5ABJOTk0BAFhYWAwMDzc3NXc4sbt/fbm00NDQmJiZCQkI2Nja2trbIyJOTk9/IzMzM6OglJS4ubgRdnyxtBCwl6G0=",0,0,76,24,2.79,0.029,0.025],[2,"Tier II • Guarnição Regular","AgEBAQAAAAAAAAEBAQMDAwMDAwICAgEBAQEBAQMDAwAAAAIDAAAAAgIBAQEAAAAAAAACAAMCAAACAAABAQAAAAEBAQAAAAAAAAICAQEBAAIBAQEAAAICAwMCAwIAAwIDAwAAAl3JyckLCwvd3d0sLCyNjY18fHw9PT0QEBClpaWRkZGenp5ABJOTk0BAFhYWAwMDzc3NXc4sbt/fbkZGRUUmJiZCQkI2Nja2trbIyJOTk9/IzMzM6OjLyy4ubgRdnyxtBCwl6G0=",0,6,72,22,2.83,0.363,0.025],[3,"Tier III • Bastião Veterano","BAEBAQAAAAAAAAEBAQMDAwMDAwICAgEBAQEBAQMDAwAAAAIDAAAAAgIBAQEAAAAAAAACAgQCAwMCAAABAQAAAAEBAQAAAAMDAAACAQEBAAABAQEBAQICAwMCAAIAAAIAAwABAwrJyckLCwvd3d0sLCyNjY18fHw9PT0QEBClpaWRkZGenp5ABJOTk0BAFhYWAwMDzc3NXV0LbiwsbkZGRUUmJiZCQkI2Njavr7bfyJOTk9/fzMzMT0/Lyy4ubpldn+LImSwloPM=",3,14,61,22,3.01,0.67,0.025],[4,"Tier IV • Elite do Alto Trono","BAEBAQAAAAAAAAEBAQMDAwMDAwICAgEBAQEBAQMDAwQAAAMDAAAAAAIBAQEAAAAAAAACAgQEAgICAAABAQAAAAEBAQAAAAMDAwICAQEBAAABAQEBAQICAwMBAAIAAAMAAwABAwrJyckLCwvd3d0sLCyNjY18fHw9PT0QEBClpaWRkZENnp4QEJOTk55AFhYWAwMDzc3NXV0LBW5ubkZGRUUmJiZCQkI2Njavr67NzZOTkzo6zMzMT0/Lyy4umJldn+LzmSwloPM=",6,22,50,22,3.25,0.712,0.025],[5,"Tier V • Campeão Soberano Ápice","BAEBAQAAAAAAAAEBAQMDAwMDAwICAgEBAQEBAQMDAwQDBAMDAAAAAwMBAQEAAAAAAAAAAAQEAwMAAAABAQAAAAEBAQAAAAMDAwICAQEBAAABAQEBAQICAwMBAAMAAAMAAwABAwrJyckLCwvd3d0sLCyNjY18fHw9PT0QEBClpaWRkZENcAcQEJOTk25uFhYWAwMDzc3NFhYLBTAwKUZGRUUmJiZCQkI2Njavr67NzZOTkzo6zMzMT0/Lyy4umJken+LzmSwloPM=",9,29,40,22,3.54,0.75,0.025]]
  },
  "penta_prismatic_crater": {
    "archetypeId": "penta_prismatic_crater",
    "tierFormat": "pentachromatic",
    "domains": ["red","blue","purple","green","gold"],
    "conclaveId": "pentachromatic_apex",
    "classicDeckIds": ["deck_spec_pentachromatic"],
    "name": "Soberania da Cratera Prismática",
    "subtitle": "Ápice Pentacromático 🔥❄️💀🌿☀️ • Dragões do Prisma & Primeira Fratura",
    "strategySummary": "Canaliza os cinco domínios primordiais através de Arautos e Dragões da Cratera Prismática para desencadear Sopro, Voo e Expansão no Turno 4.",
    "tacticalIdentity": "ramp",
    "coverCardId": "neutral_167_arauto_prisma_matriz",
    "generationsEvolved": 19,
    "matchesSimulated": 6516,
    "seedWinRate": 0.542,
    "championWinRate": 0.545,
    "vsMonocolorWinRate": 0.672,
    "vsBicolorWinRate": 0.483,
    "championDeckJaccardStability": 0.923,
    "medianCardCi95HalfWidth": 0.086,
    "domainCardBreakdown": {"neutral":20,"gold":13,"red":26,"blue":15,"purple":13,"green":13},
    "crossDomainCombos": [[1035,11,1,0.485,8," (100% WR em 8 duelos cruzados)"],[1033,236,1,0.455,8," (100% WR em 8 duelos cruzados)"],[37,839,0.929,0.414,14," (93% WR em 14 duelos cruzados)"],[816,145,0.9,0.385,10," (90% WR em 10 duelos cruzados)"],[834,605,0.889,0.374,9," (89% WR em 9 duelos cruzados)"],[839,300,0.882,0.368,17," (88% WR em 17 duelos cruzados)"]],
    "learnedProfile": {"deckId":"penta_prismatic_crater","deckName":"Soberania da Cratera Prismática","archetypeTag":"ramp","generationsTrained":13,"matchesSimulated":6516,"baselineWinRate":0.542,"trainedWinRate":0.542,"weights":{"aggroFaceBias":1.18,"tradeValueBias":1.21,"guardianPriority":1,"flyingEvasionBias":1.25,"stackConsolidationBias":1,"antiAoeSpreadBias":1,"spellHoldPatience":0.94,"relicPriority":1.02,"ascensionEagerness":1.31,"bloodPactThresholdHp":24,"domainExpansionEagerness":1.32,"sovPowerTempoBias":1,"synergyHoldBonus":20,"mulliganCurveTarget":2.9},"mk":[37,300,126,591,145],"cp":[644,166,834,838,194,816,58,396,796,90],"ca":[11,37,126,145,189,272,300,816,839,853,862,1028],"hb":[[11,16.5],[37,24],[58,13.6],[126,17],[145,15.2],[189,24],[221,6.5],[236,7.4],[272,15.1],[300,24],[816,18.4],[839,24],[853,19.7],[862,18],[1028,24],[1031,23.7],[1032,17.4],[1033,24],[1035,24]],"sp":[[839,300],[1035,300],[839,11],[272,839],[1033,300],[189,300],[37,853],[126,1032],[853,300],[145,839]],"dc":[[1035,11,1,0.485,8," (100% WR em 8 duelos cruzados)"],[1033,236,1,0.455,8," (100% WR em 8 duelos cruzados)"],[37,839,0.929,0.414,14," (93% WR em 14 duelos cruzados)"],[816,145,0.9,0.385,10," (90% WR em 10 duelos cruzados)"],[834,605,0.889,0.374,9," (89% WR em 9 duelos cruzados)"],[839,300,0.882,0.368,17," (88% WR em 17 duelos cruzados)"]]},
    "topShapleyCards": [[1033,0.4149,0.3626,0.0524,1,0.806,14],[1028,0.4096,0.3355,0.0741,1,0.912,7],[175,0.4075,0.3198,0.0877,1,0.955,5],[1035,0.2978,0.1447,0.1532,0.882,0.795,17],[890,0.2976,0.0923,0.2053,0.889,0.931,9],[1034,0.2869,0.0577,0.2292,0.875,0.867,8],[58,0.2844,0.0552,0.2292,0.875,0.917,8],[1032,0.2304,0.0392,0.1913,0.813,0.746,16],[834,0.2139,0.0386,0.1753,0.8,0.826,20],[839,0.1603,0.0299,0.1304,0.744,0.783,43],[862,0.1427,-0.0811,0.2238,0.733,0.917,15],[816,0.0977,-0.0215,0.1192,0.678,0.709,59]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AwEBAQAAAAICAgAAAAMDAwEBAQAAAAAAAAMDAwMDAQEBAQAAAAAAAAAAAgIAAAAAAAACAAICAgACAgEBAgICAgEBAAAAAAMDAwMDAAEBAQEDAwICAgACAQEBAQIBAQMAAAEAA58QEBCRkZFPT08LCwuNjY0sLCzd3d3s7OxVVVWfn4uMjIzOzgMDA83NzQgIJiYmJSUlCDYdHX9ZHX8DaTGTMTFpaa6Tk65paRwcHDbMzMyLrKxdXV3OtSYmdyZ/iwNCQ2oDH0I=",0,0,76,24,2.92,0.051,0.025],[2,"Tier II • Guarnição Regular","AwEBAQAAAAICAgAAAAMDAwEBAQAAAAAAAAMDAwMDAAEBAQAAAAAAAAAAAgIAAAAAAAACAAICAgACAgEBAAAAAAEBAAAAAAMDAwMDAAEBAQEDAwICAgACAQEBAQIBAQMBAAEAA58QEBCRkZFPT08LCwuNjY0sLCzd3d3s7OxVVVWfn8KMjIzOzgMDA83NzQgIJiYmJSUlCDYdHX9ZHX8DaY+PcnJpaa6Tk65paRwcHDbMzMyLrKxdXV3OtSYmdyZ/iwNCoGoDH0I=",0,6,70,24,2.92,0.372,0.025],[3,"Tier III • Bastião Veterano","AwEBAQAAAAICAgAAAAMDAwEBAQAAAAAAAAMDAwQDAAEBAQAAAAAAAAAABAIAAAAAAAADAwICAgACAgEBAAAAAAEBAAAAAAMDAwMDAAEBAQMDAwICAgACAQEBAQIDAQMBAAEAA+QQEBCRkZFPT08LCwuNjY0sLCzd3d3s7OxVVVUIn8KMjIzOzgMDA83NzQsIJiYmJSUlMDAdHX9MHX8DaY+PcnJpaa+Tk69paRwcHDrMzMx6rKxdXV3OtSYmdyZ/egNCoGoDH0I=",3,14,59,24,3.11,0.666,0.025],[4,"Tier IV • Elite do Alto Trono","AwEBAQAAAAICAgAAAAMDAwEBAQAAAAAAAAMDAwQDAAEBAQQAAAAAAAAABAQAAAAAAAADAwIEAAADAwEBAAAAAAAAAAAAAAMDAwMDAAEBAQMDAwICAgMDAQEBAQADAQMBAAEAA+QQEBCRkZFPT08LCwuNjY0sLCzd3d3s7OxVVVUIn8KMjIwKzgMDA83NzQsFJiYmJSUlMDAdCUxMR0cDaY+PcnJ+fq+Tk69paRwcHDrMzMx6rKxdXV0eHiYmdyZdegNCoGoDH0I=",6,22,48,24,3.36,0.694,0.025],[5,"Tier V • Campeão Soberano Ápice","AwEBAQAAAAICAgAAAAMDAwEBAQAAAAAAAAMDAwQAAAEBAQQEAAAAAAAABAQAAAAAAAADAwQEAAADAwMDAAAAAAAAAAAAAAMDAwMDAAEBAQMDAwICAgMDAQEEAQADAgMBAAMAA+QQEBCRkZFPT08LCwuNjY0sLCzd3d3s7OxVVVUIvcKMjIwKBAMDA83NzQsFJiYmJSUlMDADCUxMR0deXo+PcnJ+fq+Tk69paRwcHDrMzMx6rKxdXV0eHiYmByZdeplCoGr0H0I=",10,26,40,24,3.63,0.726,0.025]]
  },
  "penta_free_city_sovereign": {
    "archetypeId": "penta_free_city_sovereign",
    "tierFormat": "pentachromatic",
    "domains": ["gold","green","red","blue","purple"],
    "conclaveId": "pentachromatic_apex",
    "classicDeckIds": ["deck_penta_valkyra_pact"],
    "name": "Concílio Supremo da Cidade Franca",
    "subtitle": "Ápice Pentacromático ☀️🌿🔥❄️💀+⚙️ • Valkyra & Torre dos Cinco Selos",
    "strategySummary": "Une Valkyra, os Cinco Anciões Cromáticos e a elite da Cidade Franca em uma falange pentacromática de Escudo Divino, Ímpeto e hinos globais.",
    "tacticalIdentity": "midrange",
    "coverCardId": "neutral_10_valkyra_pentacromatica",
    "generationsEvolved": 19,
    "matchesSimulated": 6304,
    "seedWinRate": 0.319,
    "championWinRate": 0.527,
    "vsMonocolorWinRate": 0.641,
    "vsBicolorWinRate": 0.4,
    "championDeckJaccardStability": 0.961,
    "medianCardCi95HalfWidth": 0.0894,
    "domainCardBreakdown": {"neutral":24,"green":17,"blue":18,"gold":15,"red":13,"purple":13},
    "crossDomainCombos": [[1035,126,1,0.503,9," (100% WR em 9 duelos cruzados)"],[784,863,0.929,0.431,14," (93% WR em 14 duelos cruzados)"],[349,205,0.917,0.419,12," (92% WR em 12 duelos cruzados)"],[984,11,0.917,0.419,12," (92% WR em 12 duelos cruzados)"],[272,314,0.913,0.416,23," (91% WR em 23 duelos cruzados)"],[863,11,0.909,0.412,11," (91% WR em 11 duelos cruzados)"]],
    "learnedProfile": {"deckId":"penta_free_city_sovereign","deckName":"Concílio Supremo da Cidade Franca","archetypeTag":"midrange","generationsTrained":13,"matchesSimulated":6304,"baselineWinRate":0.319,"trainedWinRate":0.438,"weights":{"aggroFaceBias":1.14,"tradeValueBias":1.2,"guardianPriority":1.32,"flyingEvasionBias":1.27,"stackConsolidationBias":1,"antiAoeSpreadBias":1,"spellHoldPatience":1.01,"relicPriority":1.01,"ascensionEagerness":1,"bloodPactThresholdHp":24,"domainExpansionEagerness":1.31,"sovPowerTempoBias":1.05,"synergyHoldBonus":21,"mulliganCurveTarget":2.5},"mk":[126,11,101,810,591,922],"cp":[175,126,717,483,349,680,11,38,205,916],"ca":[11,48,101,114,126,140,175,189,272,349,595,784],"hb":[[11,11.1],[48,11.6],[101,24],[114,20.6],[126,18.9],[140,24],[175,19.5],[189,24],[272,12.8],[349,18.7],[595,24],[680,14],[780,13.6],[784,24],[853,14.9],[863,24],[880,24],[922,15.8],[984,24],[1032,24],[1034,24],[1035,24],[1036,23.4],[1037,24]],"sp":[[189,595],[272,189],[784,1032],[101,1034],[189,101],[853,189],[140,922],[126,1032],[272,1032],[1035,101]],"dc":[[1035,126,1,0.503,9," (100% WR em 9 duelos cruzados)"],[784,863,0.929,0.431,14," (93% WR em 14 duelos cruzados)"],[349,205,0.917,0.419,12," (92% WR em 12 duelos cruzados)"],[984,11,0.917,0.419,12," (92% WR em 12 duelos cruzados)"],[272,314,0.913,0.416,23," (91% WR em 23 duelos cruzados)"],[863,11,0.909,0.412,11," (91% WR em 11 duelos cruzados)"]]},
    "topShapleyCards": [[1035,0.2686,0.1195,0.1491,0.833,0.747,24],[880,0.2593,-0.0389,0.2982,0.833,0.933,6],[1034,0.2474,0.0195,0.2279,0.818,0.867,11],[890,0.2244,-0.1262,0.3506,0.8,0.965,5],[1036,0.182,-0.0078,0.1898,0.75,0.813,20],[935,0.1745,0.0746,0.0999,0.718,0.322,78],[863,0.1705,0.0052,0.1653,0.741,0.858,27],[140,0.1557,0.0061,0.1497,0.714,0.624,35],[189,0.1555,-0.1077,0.2632,0.727,0.888,11],[210,0.1551,-0.0518,0.2069,0.722,0.795,18],[1037,0.1539,-0.0531,0.2069,0.722,0.82,18],[314,0.143,0.0286,0.1145,0.705,0.69,61]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AwICAgMDAwMDAwMDAwEBAQEBAQABAQAAAAICAgAAAAMDAwMDAAABAQEBAQEAAAEAAQECAgAAAAAAAAAAAAEBAQAAAAAAAAAAAAEBAwMDAwEBAgICAwMDAQMDAQAAAQAAAAABAZhPT098jY1VVVUqKioQEBCwsLDVyckLCwuPj48wMDCYmJqampKSGxYbGwUFiooFigkJXV3Nzc02398mJiZCQkJbW2VlZVlZWVtTU6amrKwDA1NTU5SUlAmsphaSapMf1TY2Flw=",0,0,76,24,2.87,0.051,0.025],[2,"Tier II • Guarnição Regular","AwICAgMDAwMDAwMDAwEBAQEBAQABAQAAAAICAgAAAAMDAwMDAAABAQEBAQEAAAEAAQECAgAAAAABAQAAAAEBAQAAAAAAAAAAAAEBAwMDAwEBAgICAwMDAQMDAQAAAQAAAAABAZhPT0+njY1VVVUqKioQEBCwsLDVyckLCwuPj48wMDCYmJqampKSGxYbGwUFiooFigkJXV3Nzc02RUUmJiZCQkJbW2VlZVlZWVtTXq+vrKwDA1NTU5SUlAmsphaSapMf1TY2Flw=",0,6,71,23,2.89,0.372,0.025],[3,"Tier III • Bastião Veterano","AAICAgMDAwMDAwMDAwEBAQEBAQABAQAAAAICAgAAAAMDAwMDAAAAAAEBBAEAAAEBAQECAgAAAAQBAQAAAAEBAQICAAAAAAAAAAEBAwMDAwAAAgICAwMDAAMDAQAAAQAAAAADAb1PT0+njY1VVVUqKioQEBCwsLDVyckLCwuPj48wMDCYmJqampKSr68bGwwFiooFBQkJXV3Nzc0LRUUmJiZCQkKNjWVlZVlZWVteXq+vmKx+flNTU5SUlIqsrBaSapMf1TY2bVw=",3,14,60,23,3.02,0.666,0.025],[4,"Tier IV • Elite do Alto Trono","AAICAgMDAwMDAwMDAwEBAQEBAQABAQAAAAICAgAAAAMDAwMDBAAAAAABBAEAAAEBAAAEAgAAAAQBAQAAAAEBAQICAAAAAAABAQEBAwMDAwAAAgICAwMDAAMDAQAAAQAAAgIDAb1PT0+njY1VVVUqKioQEBCwsLDVyckLCwuPj48wMDCY5Jqamg2Sr6+SGwwFiooFBXJyCl3Nzc0LRUUmJiZCQkKNjWVlZVlZXV1eXq+vmJh+flNTU5SUlIp62BaSapMf1c3NbVw=",6,22,49,23,3.14,0.694,0.025],[5,"Tier V • Campeão Soberano Ápice","AAICAgMDAwMDAwMDAwEBAQEBAQEBAQAAAAICAgAAAAQDAwMDBAMAAAMDBAAAAAMDAAAEAAAAAAQBAQAAAAEBAQICAAAAAgIBAQEBAwMDAwAAAgICAwMDAgMDAwIAAQABAgIDAb1PT0+njY1VVVUqKioQEBCwsLA6yckLCwuPj48wMDAI5Jqamg1wr68QEAyMc3NfX3JyCtLNzc0LRUUmJiZCQkKNjWVlZeDgXV1eXq+vsLB+flNTU5SUlJh62AyoapMfOs3NbVw=",10,37,30,23,3.51,0.726,0.025]]
  },
  "penta_wheel_convergence": {
    "archetypeId": "penta_wheel_convergence",
    "tierFormat": "pentachromatic",
    "domains": ["blue","gold","purple","red","green"],
    "conclaveId": "pentachromatic_apex",
    "classicDeckIds": [],
    "name": "Convergência da Roda Horológica",
    "subtitle": "Ápice Pentacromático ❄️☀️💀🔥🌿+⚙️ • Vaelkor & Generais da Roda",
    "strategySummary": "Orquestra os Generais da Roda dos seis domínios, Constructos de Aeternus e Relíquias cronomantes para controle absoluto e viradas inevitáveis.",
    "tacticalIdentity": "control",
    "coverCardId": "neutral_173_general_roda_matriz",
    "generationsEvolved": 19,
    "matchesSimulated": 6512,
    "seedWinRate": 0.472,
    "championWinRate": 0.53,
    "vsMonocolorWinRate": 0.703,
    "vsBicolorWinRate": 0.35,
    "championDeckJaccardStability": 0.905,
    "medianCardCi95HalfWidth": 0.18,
    "domainCardBreakdown": {"neutral":23,"gold":18,"red":13,"blue":20,"green":13,"purple":13},
    "crossDomainCombos": [[278,1033,1,0.5,9," (100% WR em 9 duelos cruzados)"],[115,922,1,0.5,8," (100% WR em 8 duelos cruzados)"],[816,115,0.923,0.423,13," (92% WR em 13 duelos cruzados)"],[1035,421,0.909,0.409,11," (91% WR em 11 duelos cruzados)"],[54,1036,0.889,0.389,9," (89% WR em 9 duelos cruzados)"],[272,115,0.882,0.383,17," (88% WR em 17 duelos cruzados)"]],
    "learnedProfile": {"deckId":"penta_wheel_convergence","deckName":"Convergência da Roda Horológica","archetypeTag":"control","generationsTrained":13,"matchesSimulated":6512,"baselineWinRate":0.472,"trainedWinRate":0.417,"weights":{"aggroFaceBias":0.94,"tradeValueBias":1.34,"guardianPriority":1.3,"flyingEvasionBias":1,"stackConsolidationBias":1,"antiAoeSpreadBias":1,"spellHoldPatience":1.28,"relicPriority":1.19,"ascensionEagerness":1,"bloodPactThresholdHp":24,"domainExpansionEagerness":1,"sovPowerTempoBias":1,"synergyHoldBonus":20,"mulliganCurveTarget":2.7},"mk":[105,810,272,278,922],"cp":[1002,862,922,962,767,717,322,816,312,943],"ca":[54,103,105,189,226,272,278,816,862,922,1032,1033],"hb":[[54,14.2],[103,23.6],[105,23.7],[115,8],[126,6.4],[189,24],[221,6],[226,12.8],[272,15.2],[278,10],[421,10.9],[816,24],[862,20.8],[922,12.1],[1032,24],[1033,24],[1034,14.7],[1035,19.1],[1037,24]],"sp":[[816,1033],[1033,105],[278,1033],[272,1033],[114,1033],[816,103],[816,1032],[189,76],[816,105],[816,421]],"dc":[[278,1033,1,0.5,9," (100% WR em 9 duelos cruzados)"],[115,922,1,0.5,8," (100% WR em 8 duelos cruzados)"],[816,115,0.923,0.423,13," (92% WR em 13 duelos cruzados)"],[1035,421,0.909,0.409,11," (91% WR em 11 duelos cruzados)"],[54,1036,0.889,0.389,9," (89% WR em 9 duelos cruzados)"],[272,115,0.882,0.383,17," (88% WR em 17 duelos cruzados)"]]},
    "topShapleyCards": [[1033,0.3663,0.2476,0.1186,0.938,0.828,16],[189,0.2138,0.0452,0.1686,0.783,0.779,23],[1034,0.1933,-0.0084,0.2016,0.765,0.832,17],[1036,0.1788,-0.0109,0.1898,0.75,0.826,20],[103,0.1193,-0.0047,0.124,0.673,0.471,55],[1035,0.1133,-0.0376,0.1508,0.676,0.651,37],[421,0.1097,0.0417,0.068,0.651,0.225,189],[115,0.0884,-0.0182,0.1066,0.649,0.623,77],[816,0.0858,0.0028,0.083,0.636,0.4,129],[278,0.0698,0.0135,0.0563,0.613,0.272,287],[226,0.0646,-0.0553,0.1199,0.619,0.492,63],[54,0.0289,-0.0252,0.054,0.567,0.157,323]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AwEBAQMDAwAAAAMDAgEBAAAAAAADAwMDAwEDAAAAAQEBAAMAAQAAAQEBAAAAAAAAAQEBAAAAAgAAAAEBAQEBAQEAAQEBAAABAQMDAwAAAAAAAQEDAwAAAQEBAAEDAAIDAQAAAqywsLARERG+vr7Cwl3Jyd3d3Xd3KiqsrJ+In7smJkJCQiYsk6WTkxYWFllZWVtbW1xcXGlpaV0fHx84ODjf397ecd4JCXFxiIiampo2Nja7uyQkLCzf3xAQCaEkn99dI6Wh+F4=",0,0,91,9,3.09,0.051,0.025],[2,"Tier II • Guarnição Regular","AwEBAQMDAwAAAAMDAgEBAAAAAAADAwMDAwMDAAAAAQEBAAMAAQAAAQEBAAAAAAAAAQEBAAAAAgAAAAEBAQAAAQEAAQEBAAADAwMDAwAAAAAAAQEDAwAAAQEBAAEDAAIDAQAAAqywsLARERG+vr7Cwl3Jyd3d3Xd3KiqsrK+vn7smJkJCQiYsk6WTkxYWFllZWVtbW1xcXGlpaV0fHx84ODhyct7ecd4JCXFx6uqampo2Nja7uyQkLCzf3xAQCaEkn99dI6Wh+F4=",0,6,85,9,3.08,0.372,0.025],[3,"Tier III • Bastião Veterano","BAEBAQMDAwAAAAMDAgEBAAAAAAADAwMDAwMDAwQAAQEBAAAAAQAAAQEBAAAAAAAAAQEBAAAAAgAAAAEBAQAAAAAAAQEBAAADAwMDAwAAAAMAAAADAwMAAQEBAAMDAAIDAQAAAgiwsLARERG+vr7Cwl3Jyd3d3Xd3Kiqs5K+veqwLJkJCQiYmk6WTkxYWFllZWVtMTFxcXGlpaV0fHx84ODhycn5+cd4JCXFx6uqampo2Njasu7u7LCws3xAQCaGwsN9dI6Wh+AE=",3,14,74,9,3.16,0.666,0.025],[4,"Tier IV • Elite do Alto Trono","BAEBAQMDAwAAAAMDAgEBAAAAAAADAwMDAwMDAwQAAQEBAAAAAQAAAQEBBAAAAAAAAQEBAAAAAgAAAAEBAQAAAAACAgEBAAADAwMDAwAAAAMAAwMAAwICAQEBAAMDAQIDAQAAAgiwsLARERG+vr7Cwl3Jyd3d3Xd3Kiqs5K+veqwL4kJCQiYmk6WTkxYWFglnWVlMTFxcXGlpaV0fHx84ODhycn5+//8JCXFx6uqampo2Njasu+PjJizLyxAQCaGwsEoBI6Wh+AE=",6,22,63,9,3.26,0.694,0.025],[5,"Tier V • Campeão Soberano Ápice","BAEBAQMDAwAAAAMDAgEBAAAAAAADAwADAwMDAwQAAQEBAgIDAQAAAQEBBAABAQAAAQEBAAAABAAAAAEBAQAAAAACAgMDAAADAwMDAwAAAAAAAwMDAwICAQEEAAMDAQIDAQAAAgiwsLARERG+vr7Cwl3Jyd3d3Xd3Kiq95K+veqcL4kJCQs3NcKWTkxYWFglnXl5MTFxcXGlpaQofHx84ODhycn5+//9eXnNz6uqampo2NjbGxuPjMDDLyxAQDJmwsEoBI6WZ+AE=",10,37,44,9,3.55,0.726,0.025]]
  }
});
