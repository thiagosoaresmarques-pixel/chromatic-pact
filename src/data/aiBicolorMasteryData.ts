import { unpackMasteryRecord } from './compactMasteryCodec';
import { BICOLOR_VALUE_NETWORKS } from './aiValueNetworksData';
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
  "generatedAt": "2026-11-01T03:58:00.932Z",
  "totalMatchesSimulated": 72672,
  "totalStateTrajectoriesTrained": 210089,
  "elapsedSeconds": 302.6,
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

export { BICOLOR_VALUE_NETWORKS };

export const BICOLOR_ARCHETYPE_MASTERY: Partial<Record<BicolorArchetypeId, BicolorArchetypeMastery>> = unpackMasteryRecord<BicolorArchetypeId, BicolorArchetypeMastery>({
  "dual_red_gold": {
    "archetypeId": "dual_red_gold",
    "domains": ["red","gold"],
    "isAxialAlliance": false,
    "triadId": "pyros_alliances",
    "classicDeckId": "deck_dual_draconic_pact",
    "name": "Pacto das Escamas Imperiais",
    "subtitle": "Pacto Duplo 🔥+☀️ • Dragões Solares & Escudo Divino",
    "strategySummary": "Combina Guardiões e Escudo Divino de Solária com Fúria Crescente, Voo e Sopro Dracônico de Pyros para trocas invencíveis.",
    "tacticalIdentity": "midrange",
    "coverCardId": "red_100_dragao_vulcanico_anciao",
    "generationsEvolved": 20,
    "matchesSimulated": 7192,
    "seedWinRate": 0.548,
    "championWinRate": 0.551,
    "vsMonocolorWinRate": 0.766,
    "championDeckJaccardStability": 1,
    "medianCardCi95HalfWidth": 0.0561,
    "domainCardBreakdown": {"gold":42,"red":48,"neutral":10},
    "crossDomainCombos": [[682,205,1,0.479,10," (100% WR em 10 duelos cruzados)"],[605,699,1,0.449,8," (100% WR em 8 duelos cruzados)"],[175,3,0.9,0.379,10," (90% WR em 10 duelos cruzados)"],[682,11,0.875,0.354,8," (88% WR em 8 duelos cruzados)"],[381,457,0.867,0.346,15," (87% WR em 15 duelos cruzados)"],[175,381,0.889,0.338,9," (89% WR em 9 duelos cruzados)"]],
    "learnedProfile": {"deckId":"dual_red_gold","deckName":"Pacto das Escamas Imperiais","archetypeTag":"midrange","generationsTrained":14,"matchesSimulated":7128,"baselineWinRate":0.548,"trainedWinRate":0.67,"weights":{"aggroFaceBias":1.19,"tradeValueBias":1,"guardianPriority":1.24,"flyingEvasionBias":1.32,"stackConsolidationBias":1,"antiAoeSpreadBias":1,"spellHoldPatience":1,"relicPriority":1,"ascensionEagerness":1.18,"bloodPactThresholdHp":24,"domainExpansionEagerness":1.03,"sovPowerTempoBias":1,"synergyHoldBonus":20,"mulliganCurveTarget":2.9},"mk":[278,205,272,913,910,144],"cp":[605,149,23,272,878,796,460,166,798,797],"ca":[11,144,145,175,205,272,278,381,509,605,800,910],"hb":[[11,17.3],[144,12],[145,9.5],[175,24],[205,14.6],[272,18],[278,20.7],[381,12.8],[460,9],[509,18.4],[572,7.8],[605,14.7],[799,15.6],[800,18.7],[910,17.7],[913,21.1],[1034,24],[1037,17.8]],"sp":[[175,11],[175,272],[175,605],[175,910],[145,1034],[175,205],[1037,913],[145,175],[278,910],[278,11]],"dc":[[682,205,1,0.479,10," (100% WR em 10 duelos cruzados)"],[605,699,1,0.449,8," (100% WR em 8 duelos cruzados)"],[175,3,0.9,0.379,10," (90% WR em 10 duelos cruzados)"],[682,11,0.875,0.354,8," (88% WR em 8 duelos cruzados)"],[381,457,0.867,0.346,15," (87% WR em 15 duelos cruzados)"],[175,381,0.889,0.338,9," (89% WR em 9 duelos cruzados)"]]},
    "topShapleyCards": [[800,0.2373,-0.0609,0.2982,0.833,0.902,6],[175,0.1878,0.0663,0.1215,0.778,0.78,45],[935,0.1853,0.0931,0.0922,0.744,0.157,86],[682,0.1788,0.0114,0.1674,0.76,0.603,25],[209,0.1097,-0.0509,0.1606,0.688,0.536,32],[11,0.0933,0.0394,0.0538,0.651,0.138,301],[381,0.0823,-0.0035,0.0859,0.647,0.274,119],[158,0.0732,-0.1653,0.2386,0.667,0.848,15],[205,0.065,0.0105,0.0545,0.62,0.073,305],[3,0.0613,-0.0091,0.0704,0.633,0.421,180],[508,0.0578,-0.1147,0.1724,0.633,0.492,30],[272,0.053,0.0006,0.0523,0.606,0.04,335]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AwMDAgICAQEBAAAAAwMDAAADAwAAAAAAAAMDAwEBAQMDAgAAAAAAAAAAAAAAAAAAAAABAQEBAQEBAQEBAQEBAQECAgIDAwMDAwMDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI2NjTw8PMnJyQMDAxwcHCMjHh7Ozs6Tk5NpaWnMzMxra0Cem5ubnJycnZ2dysrK09PTExMTFRUVeHh4ra2tyMjIoqKihYWFk5OTlwICAgoKCgwMDA8PDxoaGh0dHR4eHqmpqao=",0,4,25,71,2.82,0.043,0.0122],[2,"Tier II • Guarnição Regular","AAAAAwMDAgICAAAAAQEBAAAAAAMDAwMDAAADAwAAAAAAAAAAAwMDAAEBAQMDAgACAgAAAAEBAQEBAQMDAwAAAAICAgMDAwMDAwICAgAAAQEBAQEBAQEBAQEBAwMDAAAAAAAAApGRkY2NjTw8PJCQkMnJydEDAwMfHxwcHCMjHh7Ozs6Tk5OVlWlpaabMzMxra0CeQECgoKAXFxd6enqsrKydnZ2kpKQGBgYEBAS3t7eenvf393d3d3h4eBQUFGhoaJycnMzMzFs=",1,9,69,21,3.34,0.276,0.0291],[3,"Tier III • Bastião Veterano","AAAAAwMDAgICAAAAAQEBAAAAAAADAwMDAwMAAAICAgMDAAAAAAAAAAADAwMAAAICAwMBAQEBAwMCAAMDAwICAAAAAQEBAQEBAQEBAwMDAAAAAQEBAQEBAQEBAAACAgIDAwMCApGRkY2NjTw8PJCQkMnJydEDAwMHIB8fHBwcIyNdXV0eHs7OzpOTk5WVaWlppqaoqAsLfczMzGtrQJ6srKxAQKCgoBcXF3p6evf395qamp2dnXd3dxQUFHV1dZ6epKSkBgYGt7c=",3,15,64,18,3.59,0.615,0.0283],[4,"Tier IV • Elite do Alto Trono","AAAAAAAAAwMDAgICAAAAAQEBAwMDAAAAAAAAAAADAQMDAwMDAAACAgIDAwAAAAQAAAAAAAMDAwAAAgIDAwEBAQEBAgIDAwMDAwIAAwMDAgIAAAABAQEBAQEBAQEAAAABAQEBAZGRkQsLC42NjTw8PJCQkMnJyY6OjtEDAwPNzc0HIPwfHxwcHCMjXV1dHh7Ozs4Nk5OTlZVpaWmmpqioCwt9fczMzLu7HR2na2tAnqysrEBAoKCgFxcXenp69/f3nZ2dd3d3FBQ=",5,21,53,21,3.64,0.719,0.0273],[5,"Tier V • Campeão Soberano Ápice","AQEBAAAAAAAAAwMDAgICAAAAAQEBAwMDAwMDBAAAAAAAAAAAAwEDAwMDAwAAAgICAwMAAAAEAAAAAwQCAAADAwMAAAICAwMBAQEBAQICAwMDAgIAAAAAAAIDAwMDAAABAQACABAQEJGRkQsLC42NjTw8PJCQkMnJyZGRkY6OjgrRAwMDzc3NByD8Hx8cHBwjI11dXR4ezs7ODZOTk3AHqpWVaWlppqaoqAsLfX3MzMy7ux0dp7y8FwUFExO6bm5ra6+vFv2jQJ4=",10,34,32,24,3.93,0.828,0.0219]]
  },
  "dual_blue_purple": {
    "archetypeId": "dual_blue_purple",
    "domains": ["blue","purple"],
    "isAxialAlliance": false,
    "triadId": "eclipse_alliances",
    "classicDeckId": "deck_dual_abyssal_storm",
    "name": "Pacto da Tormenta Abissal",
    "subtitle": "Pacto Duplo ❄️+💀 • Estase Glacial & Execução Umbral",
    "strategySummary": "Trava a Vanguarda rival com Congelamento e Alcance enquanto ceifadores de Toque Letal, remoções umbrais e compra arcana esmagam por atrito.",
    "tacticalIdentity": "control",
    "coverCardId": "blue_80_senhor_tempo",
    "generationsEvolved": 20,
    "matchesSimulated": 6776,
    "seedWinRate": 0.345,
    "championWinRate": 0.481,
    "vsMonocolorWinRate": 0.578,
    "championDeckJaccardStability": 0.961,
    "medianCardCi95HalfWidth": 0.1511,
    "domainCardBreakdown": {"blue":58,"neutral":10,"purple":32},
    "crossDomainCombos": [[816,1029,1,0.519,8," (100% WR em 8 duelos cruzados)"],[935,831,0.917,0.465,12," (92% WR em 12 duelos cruzados)"],[1029,91,0.9,0.449,10," (90% WR em 10 duelos cruzados)"],[401,103,0.875,0.424,8," (88% WR em 8 duelos cruzados)"],[52,935,0.833,0.382,12," (83% WR em 12 duelos cruzados)"],[1015,103,0.846,0.365,13," (85% WR em 13 duelos cruzados)"]],
    "learnedProfile": {"deckId":"dual_blue_purple","deckName":"Pacto da Tormenta Abissal","archetypeTag":"control","generationsTrained":14,"matchesSimulated":6712,"baselineWinRate":0.345,"trainedWinRate":0.286,"weights":{"aggroFaceBias":0.96,"tradeValueBias":1.36,"guardianPriority":1,"flyingEvasionBias":1.02,"stackConsolidationBias":1,"antiAoeSpreadBias":1,"spellHoldPatience":1.26,"relicPriority":1,"ascensionEagerness":1.04,"bloodPactThresholdHp":24,"domainExpansionEagerness":0.96,"sovPowerTempoBias":1,"synergyHoldBonus":24,"mulliganCurveTarget":2.8},"mk":[591,1015,52,909],"cp":[736,52,1015,812,724,838,83,633,629,591],"ca":[54,93,103,545,741,816,840,1015,1027,1029,1033,1035],"hb":[[54,21.7],[91,6.2],[93,16.4],[103,15.8],[545,24],[736,8.8],[741,24],[816,24],[838,9.5],[840,24],[1015,15.3],[1027,24],[1029,24],[1033,24],[1035,24]],"sp":[[816,93],[545,91],[816,545],[1029,54],[1035,54],[1035,91],[816,1029],[1035,1015],[816,54],[545,1015]],"dc":[[816,1029,1,0.519,8," (100% WR em 8 duelos cruzados)"],[935,831,0.917,0.465,12," (92% WR em 12 duelos cruzados)"],[1029,91,0.9,0.449,10," (90% WR em 10 duelos cruzados)"],[401,103,0.875,0.424,8," (88% WR em 8 duelos cruzados)"],[52,935,0.833,0.382,12," (83% WR em 12 duelos cruzados)"],[1015,103,0.846,0.365,13," (85% WR em 13 duelos cruzados)"]]},
    "topShapleyCards": [[1029,0.3037,0.1618,0.1419,0.821,0.728,28],[1027,0.1979,-0.009,0.2069,0.722,0.859,18],[935,0.1899,0.0998,0.09,0.686,0.301,102],[1035,0.1117,-0.0299,0.1417,0.622,0.583,45],[93,0.1073,0.0198,0.0875,0.613,0.496,119],[840,0.0819,-0.0934,0.1753,0.6,0.735,30],[1005,0.0806,-0.0207,0.1013,0.582,0.409,91],[103,0.0789,-0.0755,0.1544,0.59,0.589,39],[1015,0.0786,0.0152,0.0635,0.582,0.438,232],[838,0.0749,-0.0654,0.1403,0.596,0.79,47],[591,0.0451,-0.0305,0.0756,0.554,0.555,166],[1033,0.0346,-0.1464,0.181,0.552,0.716,29]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AAAAAwAAAgICAwMDAwEBAQEBAAAAAgICAwMDAQABAAAAAAACAgMDAgIBAgAAAAIAAAAAAAICAQEAAAICAwMDAAAAAAECAwMDAgIAAAAAAAAAAAADAAAAAAICAgEBAQAAAAAAAt3d3ay+vk9PT6yNjcJBQUGRkVNTU2pqaj8/P0PfQ9/fJiYmCQkuLhUVQ20zMzMdS1tbW0sdHVNTS2mCgvf392lZWVlTgiwsLG1tNDQ06OjoNjY2LuVFRUV1dXVCQkLlamnlagk=",0,0,82,18,3.02,0.036,0.0108],[2,"Tier II • Guarnição Regular","AAAAAwAAAgICAwMDAwEBAQEBAAAAAgICAwMDAQABAAAAAAABAQMDAgIBAgAAAAIAAAAAAAICAQEAAAICAwMDAAAAAAECAwMDAgIAAAAAAAAAAAADAAAAAAICAgEBAQIAAAIAAt3d3ay+vk9PT6yNjcJBQUGRkVNTU2pqaj8/P0PfQ9/fJiYmRUUuLnt7Q20zMzMdS1tbW0sdHVNTS2mCgvf392lZWVlTgiwsLG1tNDQ06OjoNjY2LuVFRUV1dXVCQkIWamkWagk=",0,6,76,18,3.04,0.297,0.0299],[3,"Tier III • Bastião Veterano","AAAAAwAAAgICAwMDAwEBAQEBAAAAAgICAwMDBAAAAAAAAAABAQIDAgIBAQAAAAQAAAAAAAICAgEAAAICAwMDAQAAAAEBAwMDAQIAAAAAAAAAAAACAgAAAAICAgEBAQIAAQIAA93d3ae+vk9PT6eNjcJBQUGRkVNTU2pqaj8/PwvfP9/fJiYmRUVtMHt7Q0MzMzMJS1tbW0sdHR1TS2mCgvf3915ZWVlTUywsLENtNDQ06OjoNjY2eXlFRUV1dXVCQkIWal4Wau0=",3,14,65,18,3.14,0.624,0.0299],[4,"Tier IV • Elite do Alto Trono","AAAAAwAAAgICAwMDAwEBAQEBAAAAAgICAwMDBAAAAQAAAAABAQMDAgIAAAAAAAQAAAAAAwACAgIAAAICAwMDAQAAAAEDAwMDAgIAAAAAAAAAAAACAgAAAAICAgEBAQIAAQIAA93d3ae+vk9PT6eNjcJBQUGRkVNTU2pqaj8/PwvfP5ffJiYmRUUwMHt75+czMzMJS1tbW0hLHR0dS2fg4Pf3915ZWVlTRSwsLNTUNDQ06OjoNjY2eXlFRUV1dXVCQkIWal4Wau0=",6,22,54,18,3.35,0.761,0.0262],[5,"Tier V • Campeão Soberano Ápice","AAAAAwAAAgICAwMDAwEBAQEBAAAAAgICAwMDBAQAAQEAAAABAQMDAgIAAAAAAAQEAAAAAwMDAAACAAICAwMDAQAAAAMDAwMDAgIAAAAAAAAAAAACAgAAAAICAgEBAQIAAQIAA93d3ae+vk9PT6eNjcJBQUGRkVNTU2pqaj8/PwsFP5dLJiYmRUUwMHt75+czMzMJA1tbW0hGRl1dIWfg4Pf3915ZWVlFRSwsLNTUNDQ06OjoNjY2eXlFRUV1dXVCQkIWal4Wau0=",10,27,45,18,3.59,0.773,0.0253]]
  },
  "dual_red_green": {
    "archetypeId": "dual_red_green",
    "domains": ["red","green"],
    "isAxialAlliance": false,
    "triadId": "veridia_alliances",
    "classicDeckId": "deck_dual_primal_fury",
    "name": "Pacto da Ruína Selvagem",
    "subtitle": "Pacto Duplo 🔥+🌿 • Rampa Vulcânica, Ímpeto & Atropelar",
    "strategySummary": "Acelera Essência com rampa silvestre para lançar Behemoths e Dragões com Ímpeto e Atropelar antes que a defesa inimiga se estabilize.",
    "tacticalIdentity": "ramp",
    "coverCardId": "red_46_tirano_carmesim",
    "generationsEvolved": 20,
    "matchesSimulated": 7000,
    "seedWinRate": 0.607,
    "championWinRate": 0.555,
    "vsMonocolorWinRate": 0.859,
    "championDeckJaccardStability": 0.961,
    "medianCardCi95HalfWidth": 0.06,
    "domainCardBreakdown": {"neutral":10,"red":51,"green":39},
    "crossDomainCombos": [[119,799,1,0.475,9," (100% WR em 9 duelos cruzados)"],[913,1034,1,0.475,8," (100% WR em 8 duelos cruzados)"],[509,300,1,0.445,10," (100% WR em 10 duelos cruzados)"],[1034,300,1,0.445,8," (100% WR em 8 duelos cruzados)"],[910,209,0.929,0.404,14," (93% WR em 14 duelos cruzados)"],[910,799,0.917,0.392,12," (92% WR em 12 duelos cruzados)"]],
    "learnedProfile": {"deckId":"dual_red_green","deckName":"Pacto da Ruína Selvagem","archetypeTag":"ramp","generationsTrained":14,"matchesSimulated":6936,"baselineWinRate":0.607,"trainedWinRate":0.571,"weights":{"aggroFaceBias":1.24,"tradeValueBias":1.12,"guardianPriority":1,"flyingEvasionBias":1,"stackConsolidationBias":1,"antiAoeSpreadBias":1,"spellHoldPatience":1,"relicPriority":1,"ascensionEagerness":1.28,"bloodPactThresholdHp":24,"domainExpansionEagerness":1.22,"sovPowerTempoBias":1,"synergyHoldBonus":20,"mulliganCurveTarget":2.9},"mk":[300,591,913,910],"cp":[300,23,797,665,862,143,609,798,700,762],"ca":[2,11,114,116,119,140,205,300,509,605,665,799],"hb":[[2,14],[11,17.6],[114,18.3],[115,10.9],[116,16.2],[119,10.5],[140,24],[205,15.1],[300,24],[509,24],[605,14.2],[665,24],[700,11.4],[799,24],[853,18.1],[862,24],[863,24],[910,18.3],[913,22.9],[1034,24],[1036,24]],"sp":[[853,509],[11,1034],[910,509],[1036,11],[863,910],[1034,300],[1036,910],[863,913],[863,11],[140,2]],"dc":[[119,799,1,0.475,9," (100% WR em 9 duelos cruzados)"],[913,1034,1,0.475,8," (100% WR em 8 duelos cruzados)"],[509,300,1,0.445,10," (100% WR em 10 duelos cruzados)"],[1034,300,1,0.445,8," (100% WR em 8 duelos cruzados)"],[910,209,0.929,0.404,14," (93% WR em 14 duelos cruzados)"],[910,799,0.917,0.392,12," (92% WR em 12 duelos cruzados)"]]},
    "topShapleyCards": [[1034,0.2896,0.1364,0.1532,0.882,0.761,17],[509,0.274,0.102,0.172,0.867,0.758,15],[862,0.2729,0.0437,0.2292,0.875,0.948,8],[863,0.2298,0.1017,0.1281,0.824,0.779,34],[762,0.1968,-0.1538,0.3506,0.8,0.97,5],[132,0.1509,-0.1492,0.3001,0.75,0.887,8],[1036,0.1461,-0.0519,0.198,0.737,0.721,19],[866,0.1351,0.001,0.1341,0.721,0.623,43],[209,0.1309,-0.0188,0.1497,0.714,0.573,35],[799,0.1146,-0.0452,0.1598,0.71,0.806,31],[571,0.1019,-0.0621,0.164,0.7,0.868,30],[605,0.1003,0.0377,0.0626,0.665,0.201,218]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AgICAQEBAwMDAwMDAAAAAwMDAwAAAAICAgAAAAAAAAAAAgICAAAAAQMDAwMDAAAAAwMAAAEBAQEBAgIBAgICAgIBAQICAQECAgMDAQECAgEBAAAAAQEBAwIDAQECAgIAAAECA09PTywsLJGRkY6OjgsLC41VVVV3d3ePj48CAgISzc3Nzl1dXc4Szvkb+PgbGwMDAxwczMxpA2kDA5OT3C+TlC8vBQUxMdzc9PRZWfn5tbXS0h8fH8zMzBy1+MsF9JSUEsxpMVk=",0,0,75,25,3.09,0.048,0.0126],[2,"Tier II • Guarnição Regular","AgICAQEBAwMDAwMDAAAAAwMDAwAAAAICAgAAAAAAAAAAAgICAAAAAQMDAwMDAAAAAwMAAAEBAQEBAgIAAAICAAABAQICAgICAgMDAQECAgEBAAAAAQEBAwIDAQECAgIAAAECA09PTywsLJGRkY6OjgsLC41VVVV3d3ePj48CAgISzc3Nzl1dXc4Szvkb+PgbGwMDAxwczMxpA2kDA5OTcnKTlI+PBQUxMTs79PRZWfn5tbXS0h8fH8zMzBy1+MsF9JSUEsxpMVk=",0,6,69,25,3.11,0.263,0.0286],[3,"Tier III • Bastião Veterano","AgICAQEBAwMDAwMDAAAAAwMDAwAAAAICAgAAAAQAAAAAAgICAAAAAQECAwMDAAAAAwMAAAQBAQEBAgIAAAICAAABAQECAgICAgMCAAECAgAAAAAAAQEBAwMCAgMCAgIAAAEBAk9PTywsLJGRkY6OjgsLC41VVVV3d3ePj48CAgIKzc3Nzl1dXc4Szvn5tfgbGwMDAxsczMwMAwoDAzExcnKTk4+P4+NpMTs7lPRi9Mz5tbUjIx8fH8zMzBwcurpilJOUEhJpafQ=",3,14,58,25,3.29,0.631,0.0283],[4,"Tier IV • Elite do Alto Trono","AgICAQEBAwMDAwMDAAAAAwMDAwAAAAICAgAAAAQAAAAAAgICAAEAAAEAAAEBAAAAAwMAAAQAAQEBAgIAAAICAAABAQEBAgICAgMDAAAAAAAAAAAAAQEBAAACAgMCAgIAAAEBAE9PTywsLJGRkY6OjgsLC41VVVV3d3ePj48CAgIKzc3Nzl1dXdH8zsz5z8/5+QMDAxsbEhIMdAoDAzExcnIxk4+P4+NpaTs7lJRiWszMFxcjIx8fH8zMzBMTurpilJOTzhIDaYs=",6,22,47,25,3.46,0.732,0.0259],[5,"Tier V • Campeão Soberano Ápice","AgICAQEBAwMDAwMDAAAAAwMDAwAAAAICAgAAAAQAAAADAgICAAEBAwMAAAMDAAAAAwMAAAQAAQAAAwMAAAMDAAABAQICAgICAgMDAgIAAAAAAAAAAQEBAAACAgMAAAACAgICAE9PTywsLJGRkY6OjgsLC41VVVV3d3ePj48CAgIKzc3NIF1dXdH8/R4ez88fHwMDAx0dBgYMdAqMhF5ecnJfX4+P4+OZmTs7mJhiWry8FxcjIx8fH8zMzBMTurpif3NzYWH6+os=",10,47,18,25,4.14,0.808,0.0231]]
  },
  "dual_blue_gold": {
    "archetypeId": "dual_blue_gold",
    "domains": ["blue","gold"],
    "isAxialAlliance": false,
    "triadId": "solaria_alliances",
    "classicDeckId": "deck_dual_arcane_forge",
    "name": "Pacto da Forja do Zênite",
    "subtitle": "Pacto Duplo ❄️+☀️ • Cidadela Cronomante & Escudo Celeste",
    "strategySummary": "Ergue muralhas de Armadura e Escudo Divino sustentadas por compra de cartas cronomante, Congelamento cirúrgico e arcontes aéreos.",
    "tacticalIdentity": "control",
    "coverCardId": "gold_157_dragao_soberano_alvorada",
    "generationsEvolved": 20,
    "matchesSimulated": 7072,
    "seedWinRate": 0.512,
    "championWinRate": 0.52,
    "vsMonocolorWinRate": 0.781,
    "championDeckJaccardStability": 1,
    "medianCardCi95HalfWidth": 0.0782,
    "domainCardBreakdown": {"neutral":10,"gold":45,"blue":45},
    "crossDomainCombos": [[1035,278,1,0.51,15," (100% WR em 15 duelos cruzados)"],[880,278,1,0.48,12," (100% WR em 12 duelos cruzados)"],[784,880,1,0.48,9," (100% WR em 9 duelos cruzados)"],[880,421,1,0.48,11," (100% WR em 11 duelos cruzados)"],[1035,272,0.952,0.462,21," (95% WR em 21 duelos cruzados)"],[1035,421,0.909,0.419,22," (91% WR em 22 duelos cruzados)"]],
    "learnedProfile": {"deckId":"dual_blue_gold","deckName":"Pacto da Forja do Zênite","archetypeTag":"control","generationsTrained":14,"matchesSimulated":7008,"baselineWinRate":0.512,"trainedWinRate":0.5,"weights":{"aggroFaceBias":0.98,"tradeValueBias":1.32,"guardianPriority":1.34,"flyingEvasionBias":0.96,"stackConsolidationBias":1,"antiAoeSpreadBias":1,"spellHoldPatience":1.22,"relicPriority":1.18,"ascensionEagerness":1.15,"bloodPactThresholdHp":24,"domainExpansionEagerness":1,"sovPowerTempoBias":1,"synergyHoldBonus":22,"mulliganCurveTarget":2.9},"mk":[278,37,272,784,421,810],"cp":[70,715,909,573,40,57,278,416,816,717],"ca":[54,70,226,272,278,381,421,784,816,880,1031,1035],"hb":[[54,21.3],[70,17.9],[221,9],[226,22.5],[272,16],[278,15],[381,10.3],[421,9.8],[784,24],[816,24],[880,20.7],[1031,24],[1035,24],[1037,24]],"sp":[[1035,784],[816,1035],[54,1037],[816,784],[221,1037],[816,381],[54,1031],[226,784],[1035,54],[816,421]],"dc":[[1035,278,1,0.51,15," (100% WR em 15 duelos cruzados)"],[880,278,1,0.48,12," (100% WR em 12 duelos cruzados)"],[784,880,1,0.48,9," (100% WR em 9 duelos cruzados)"],[880,421,1,0.48,11," (100% WR em 11 duelos cruzados)"],[1035,272,0.952,0.462,21," (95% WR em 21 duelos cruzados)"],[1035,421,0.909,0.419,22," (91% WR em 22 duelos cruzados)"]]},
    "topShapleyCards": [[880,0.4412,0.3974,0.0438,1,0.778,20],[1035,0.322,0.2171,0.1049,0.872,0.598,39],[1037,0.1791,0.036,0.1431,0.73,0.615,37],[879,0.146,-0.1887,0.3347,0.714,0.968,7],[70,0.1196,-0.0751,0.1946,0.682,0.847,22],[166,0.1075,-0.035,0.1426,0.667,0.785,42],[784,0.0919,0.0275,0.0645,0.619,0.148,218],[781,0.0806,-0.1205,0.201,0.636,0.718,22],[682,0.0765,-0.0836,0.1601,0.629,0.643,35],[1031,0.066,-0.1277,0.1937,0.625,0.782,24],[226,0.0634,-0.0513,0.1148,0.6,0.333,70],[272,0.0549,0.0025,0.0524,0.578,0.058,341]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AwMDAAAAAwMDAwMDAQEDAwMBAQAAAAEBAQICAAAAAgICAwMDAAEAAgEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQEBAQEBAQEBAQEBAQEBAQECAgICAgIDAwMDAAAAAAAAAJSUlJGRkY2NjSoqKrCwERERRUUmJiZCQkLNzZOTk21tbWlpaUUbnz0bJSUlMTExNTU1QEBAm5ubnJycnZ2d3NzcExMTFRUVSEhIeHh4mpqara2tDw8PoqKihYWFky4uLj09PT4=",0,4,24,72,2.81,0.02,0.0096],[2,"Tier II • Guarnição Regular","AwMDAAAAAAAAAwMDAwMDAQEDAwMBAQEBAQMAAAABAQECAgICAgIAAAADAgICAwMDAAEAAgEDAwMDAwMAAAACAgIDAwMBAQEDAwMDAwMAAAABAQEAAgIBAQEDAwMCAgICAgIDA5SUlJGRkd3d3Y2NjSoqKrCwERERpaWlRUUxJiYmQkJCzc3Ly6iok5OTb21tbWlpaUUbnz0bo6Oj+fn53NzcysrKa2trk5OTLS0tLi4uoKCgFxcXtj09enp6LCwsb29vpKSkBgY=",1,9,72,18,3.2,0.278,0.029],[3,"Tier III • Bastião Veterano","AwMDAAAAAAAAAwMDAwMDAQEDAwMBAQEBAQMCAAAAAQEBAgIAAgIDAgIAAAADAwAAAwMCAgIBAQEDAwMAAQACAQMDAwMDAAAAAAACAgIDAwMAAAADAwMCAgAAAAMDAwEBAQEBAZSUlJGRkd3d3Y2NjSoqKrCwERERpaWlRUUxzyYmJkJCQs3NRsvLcKiok5OTb2+mpq+vbW1tFhYWaWlpRRufPRujo/n5+UVF3NzcysrKa2trra2tLS0tPT2goKAuLi4bFxcXk5M=",3,15,64,18,3.28,0.615,0.0291],[4,"Tier IV • Elite do Alto Trono","AwMDAAAAAAAAAwMDAwMDAQEDAwMBAQEBAQEBAQADAgAAAAAAAAEBAQICAAICAwICAgAAAAMDAAADAwMDAAACAgIAAAEBAQMDAwABAAIBAwMDAAAAAAACAgIDAwMAAAADAwMCApSUlJGRkd3d3Y2NjSoqKrCwEREREBAQpaWlRUXiMc8mJiY2NjZCQkLNzUbLy3CqqKiTk5Nvb6amr6/q6igobW1tOTkWFhZpaWlFG589G/n5+UVF3NzcysrKa2trra2tLS0tPT0=",5,21,53,21,3.37,0.775,0.0248],[5,"Tier V • Campeão Soberano Ápice","AwMDAAAAAAAAAwMDAwMDAQEDAwMBAQEBAQEEAwMBAQADAgAAAAAAAAEBAQICAAICBAMEAgICAAAAAwMDAwAAAwMDAwAAAgICAAABAQEBAQEBAQECAwMDAAADAAEBAAECAQEAAZSUlJGRkd3d3Y2NjSoqKrCwEREREBAQpaWlCzAwRUXiMc8mJiY2NjZCQkLNzUbLyw1wB6qoqJOTk29vEBCmpq+v6uooKG1tbTk5fX1PTxYWFqCgCmlpaZmZDUWyG59KPZdK6xs=",10,38,36,16,3.72,0.831,0.0225]]
  },
  "dual_purple_green": {
    "archetypeId": "dual_purple_green",
    "domains": ["purple","green"],
    "isAxialAlliance": false,
    "triadId": "eclipse_alliances",
    "classicDeckId": "deck_dual_eternal_rot",
    "name": "Pacto da Podridão Eterna",
    "subtitle": "Pacto Duplo 💀+🌿 • Cripta, Regeneração & Veneno",
    "strategySummary": "Funde Renascer e reanimação da Cripta com Guardiões regenerativos e Toque Letal em um ciclo inesgotável de vida e decomposição.",
    "tacticalIdentity": "attrition",
    "coverCardId": "green_49_dragao_esmeralda",
    "generationsEvolved": 20,
    "matchesSimulated": 6712,
    "seedWinRate": 0.417,
    "championWinRate": 0.541,
    "vsMonocolorWinRate": 0.672,
    "championDeckJaccardStability": 0.961,
    "medianCardCi95HalfWidth": 0.0472,
    "domainCardBreakdown": {"purple":42,"neutral":10,"green":48},
    "crossDomainCombos": [[897,839,0.917,0.406,12," (92% WR em 12 duelos cruzados)"],[897,1033,0.9,0.389,10," (90% WR em 10 duelos cruzados)"],[367,910,0.889,0.378,9," (89% WR em 9 duelos cruzados)"],[910,545,0.889,0.378,9," (89% WR em 9 duelos cruzados)"],[140,913,0.889,0.378,9," (89% WR em 9 duelos cruzados)"],[639,84,0.917,0.376,24," (92% WR em 24 duelos cruzados)"]],
    "learnedProfile": {"deckId":"dual_purple_green","deckName":"Pacto da Podridão Eterna","archetypeTag":"attrition","generationsTrained":14,"matchesSimulated":6648,"baselineWinRate":0.417,"trainedWinRate":0.482,"weights":{"aggroFaceBias":1.04,"tradeValueBias":1.34,"guardianPriority":1.28,"flyingEvasionBias":1,"stackConsolidationBias":1,"antiAoeSpreadBias":1,"spellHoldPatience":1,"relicPriority":1,"ascensionEagerness":0.99,"bloodPactThresholdHp":24,"domainExpansionEagerness":1,"sovPowerTempoBias":0.99,"synergyHoldBonus":24,"mulliganCurveTarget":2.6},"mk":[913,1015,126,910,639,101],"cp":[562,99,76,738,835,128,858,93,861,831],"ca":[76,84,101,114,126,140,265,266,267,346,349,483],"hb":[[76,20.8],[83,8.8],[84,9.4],[101,20.9],[114,24],[126,16.9],[140,24],[265,11.9],[266,16.3],[267,24],[346,24],[349,24],[483,24],[545,24],[639,18.1],[736,19.5],[831,23.4],[838,16.7],[839,24],[862,20.7],[863,22.2],[897,15.8],[910,20.2],[913,17.6],[1015,24],[1027,24],[1033,24],[1036,24]],"sp":[[910,545],[1015,346],[265,1033],[910,839],[913,1033],[545,101],[114,346],[897,1033],[114,839],[545,1015]],"dc":[[897,839,0.917,0.406,12," (92% WR em 12 duelos cruzados)"],[897,1033,0.9,0.389,10," (90% WR em 10 duelos cruzados)"],[367,910,0.889,0.378,9," (89% WR em 9 duelos cruzados)"],[910,545,0.889,0.378,9," (89% WR em 9 duelos cruzados)"],[140,913,0.889,0.378,9," (89% WR em 9 duelos cruzados)"],[639,84,0.917,0.376,24," (92% WR em 24 duelos cruzados)"]]},
    "topShapleyCards": [[1027,0.2903,0.0611,0.2292,0.875,0.873,8],[665,0.2693,0.0101,0.2592,0.857,0.936,7],[367,0.2329,0.0649,0.168,0.81,0.712,21],[545,0.2183,0.0558,0.1625,0.792,0.647,24],[863,0.212,0.0904,0.1216,0.791,0.753,43],[1033,0.1883,0.0325,0.1557,0.759,0.586,29],[861,0.1627,-0.0823,0.245,0.75,0.925,12],[839,0.1586,-0.0067,0.1653,0.741,0.821,27],[639,0.1503,0.0337,0.1167,0.719,0.558,57],[346,0.1417,0.0213,0.1204,0.696,0.273,56],[140,0.1324,-0.018,0.1505,0.694,0.419,36],[1036,0.1218,-0.0663,0.188,0.696,0.657,23]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AAAAAwMDAwMDAwMDAwMDAwICAgMDAAAAAAAAAgADAwMBAQEBAAICAAICAQEBAAAAAQEBAgIBAAAAAAABAAADAwMDAwICAgAAAAAAAgEBAQEBAQICAgICAQEAAAAAAgICAgICAlRUVJGRkY6OjoGBgZQ/Pz+Pj49AQP///1NTU99b9/f3VlZWulsdHVsd31Vqam19cQkJCSzwam1tcXt7BHt9V1dWVlaRkZGKillZWfBoaAQEVVUsLC0tLbq6ZWVxioGBgfB/gt8=",0,0,69,31,2.97,0.036,0.0108],[2,"Tier II • Guarnição Regular","AAAAAwMDAwMDAwMDAwMDAwICAgMDAAAAAAAAAgADAwMBAQEBAAIAAAICAQEBAAAAAQEBAgIBAAAAAAABAAEDAwMDAwICAgAAAAAAAgEBAQEBAQICAgICAQEAAAAAAgECAgIBAlRUVJGRkY6OjoGBgZQ/Pz+Pj49AQP///1NTU99b9/f3VlZWulsdTFsd31Vqam19cQkJCSzwam1tcXt7BHvnV1dWVlaRkZGKillZWfBoaAQEVVUsLC0tLbq6ZWVxiuBd4PB/Xd8=",0,6,63,31,2.97,0.297,0.0299],[3,"Tier III • Bastião Veterano","AAAAAwMDAwMDAwMDAwMDAwICAgMDAAAAAAAABAADAwMBAQAAAQAAAAAAAgEBAAAAAQEBAgIBAgAAAAABAQEDAwMDAwIAAgIAAAAAAgEBAQECAQACAgICAgIAAAAAAgECAgIBAlRUVJGRkY6OjoGBgZQ/Pz+Pj49AQP///1NTUwlb9/f3VVVdXVpMTFtjW99qCnJycQkJCSwsavBtcXt7BATnV1dWVlaRe5GRillZWfBoaGoE31WKLC0tLeLiZWVxiuBd4PB/Xd8=",3,14,54,29,3.14,0.624,0.0299],[4,"Tier IV • Elite do Alto Trono","AAAAAwMDAwMDAwMDAwMDAwICAgMDAAAAAAAABAQDAwMDAwAAAQAAAgABAQQBAAAAAQEBAgIBAwMAAQABAQEDAwMDAwIAAAICAAAAAgEBAQEDAwAAAgICAgIAAAAAAgECAgIBAlRUVJGRkY6OjoGBgZQ/Pz+Pj49AQP///1NTUwkD9/f3RkZdXVpMTCFjWVkMCnJycQkJCSwsal5ecQR7BATnV1dWVlaRe3uRkVlZWSxoaGpqR0eKii0tLeLiZWVxiuBd4PB/Xd8=",6,22,44,28,3.5,0.761,0.0262],[5,"Tier V • Campeão Soberano Ápice","AAAAAwMDAwMDAwMDAwMDAwICAgMDAAAAAAAABAQDAwMDAwAAAQAAAgABAQQBAAAAAQEBAAAAAwMBAAADAwEDAwMDAwMAAAEBAAAAAgEBAwMDAwMDAgICAgIAAAEBAgECAgIBAlRUVJGRkY6OjoGBgZQ/Pz+Pj49AQP///1NTUwkD9/f3RkZdXVpMTCFjWVkMCnJyjAkJCX5+dF5eC3NzX1/nV1dWVlZagIAHB1lZWZloaF1dR0f09C0tLeLiZWVv4+Bd4Jl/Xd8=",10,40,25,25,3.98,0.773,0.0253]]
  },
  "dual_red_purple": {
    "archetypeId": "dual_red_purple",
    "domains": ["red","purple"],
    "isAxialAlliance": false,
    "triadId": "pyros_alliances",
    "classicDeckId": "deck_dual_blood_flame",
    "name": "Pacto da Chama Sangrenta",
    "subtitle": "Pacto Duplo 🔥+💀 • Blitz Sanguinária, Dreno & Último Suspiro",
    "strategySummary": "Pressiona incessantemente o Soberano rival com Ímpeto, Dreno de Vida, gatilhos explosivos de Último Suspiro e queima direta.",
    "tacticalIdentity": "aggro",
    "coverCardId": "purple_23_dracolich",
    "generationsEvolved": 20,
    "matchesSimulated": 7144,
    "seedWinRate": 0.476,
    "championWinRate": 0.521,
    "vsMonocolorWinRate": 0.703,
    "championDeckJaccardStability": 0.923,
    "medianCardCi95HalfWidth": 0.0369,
    "domainCardBreakdown": {"neutral":10,"purple":39,"red":51},
    "crossDomainCombos": [[791,1034,1,0.479,8," (100% WR em 8 duelos cruzados)"],[200,208,1,0.479,8," (100% WR em 8 duelos cruzados)"],[832,693,0.944,0.453,18," (94% WR em 18 duelos cruzados)"],[910,446,0.909,0.418,11," (91% WR em 11 duelos cruzados)"],[791,208,0.933,0.412,15," (93% WR em 15 duelos cruzados)"],[653,693,0.889,0.398,9," (89% WR em 9 duelos cruzados)"]],
    "learnedProfile": {"deckId":"dual_red_purple","deckName":"Pacto da Chama Sangrenta","archetypeTag":"aggro","generationsTrained":14,"matchesSimulated":7080,"baselineWinRate":0.476,"trainedWinRate":0.545,"weights":{"aggroFaceBias":1.38,"tradeValueBias":1.05,"guardianPriority":1,"flyingEvasionBias":1,"stackConsolidationBias":1,"antiAoeSpreadBias":1,"spellHoldPatience":1,"relicPriority":1,"ascensionEagerness":1,"bloodPactThresholdHp":17,"domainExpansionEagerness":0.98,"sovPowerTempoBias":1.19,"synergyHoldBonus":19,"mulliganCurveTarget":2.5},"mk":[591,913,910,2,733,11,236],"cp":[737,733,502,591,208,106,731,838,236,0],"ca":[2,11,76,205,236,446,460,502,545,731,733,791],"hb":[[0,7.6],[1,8.7],[2,17.1],[11,15.6],[76,14.6],[205,11],[236,12.4],[446,19.6],[460,24],[502,12.8],[545,14.9],[600,7.4],[693,8.7],[731,9.9],[733,11.8],[791,14.8],[799,14],[910,23.7],[913,23.5],[1028,24],[1034,11.4]],"sp":[[913,2],[910,913],[446,693],[904,502],[910,545],[913,1034],[910,791],[731,460],[545,600],[913,693]],"dc":[[791,1034,1,0.479,8," (100% WR em 8 duelos cruzados)"],[200,208,1,0.479,8," (100% WR em 8 duelos cruzados)"],[832,693,0.944,0.453,18," (94% WR em 18 duelos cruzados)"],[910,446,0.909,0.418,11," (91% WR em 11 duelos cruzados)"],[791,208,0.933,0.412,15," (93% WR em 15 duelos cruzados)"],[653,693,0.889,0.398,9," (89% WR em 9 duelos cruzados)"]]},
    "topShapleyCards": [[1033,0.2467,0.0443,0.2024,0.8,0.643,15],[1034,0.2354,0.0669,0.1686,0.783,0.521,23],[1028,0.1855,-0.1145,0.3001,0.75,0.867,8],[446,0.1428,-0.005,0.1478,0.684,0.406,38],[210,0.133,-0.2442,0.3772,0.667,0.25,6],[653,0.1149,-0.0581,0.173,0.679,0.85,28],[208,0.1053,-0.0301,0.1355,0.66,0.662,47],[11,0.0963,0.0365,0.0598,0.621,0.063,253],[913,0.0881,0.0287,0.0594,0.61,0.015,259],[545,0.0771,-0.1398,0.2169,0.632,0.667,19],[791,0.0632,0.0021,0.0611,0.59,0.12,249],[3,0.055,-0.0053,0.0603,0.58,0.072,257]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AwMDAAAAAgICAQEBAAAAAwMDAAAAAgICAgICAwAAAAICAgECAgIAAAAAAQMDAwAAAAEBAQIDAwMDAwMBAQICAgIBAQECAAAAAAABAgAAAAEBAAAAAQEAAAAAAAMDAwIDAgEBAI6Ojuzs7Nvb2/b29lNTU5GRkQsLC09PT1hYWIgAAABaWlowtbW1zc3NDTD4+PgDAwP39/feQkJC9/f3ubne3d3duLi4HGpqalFRuYABAQFUVMjIyMowAgICDQ0XFxfeQBzJzFE=",0,0,54,46,2.35,0.043,0.0122],[2,"Tier II • Guarnição Regular","AwMDAAAAAgICAQEBAAAAAwMDAAAAAgICAgICAwAAAAICAgECAgIAAAAAAQMDAwAAAAEBAQIDAwMDAwMBAQICAgIBAQECAAAAAgIBAgAAAAEBAAAAAQEAAAAAAAMDAwIDAgEBAo6Ojuzs7Nvb2/b29lNTU5GRkQsLC09PT1hYWIgAAABaWlowtbW1zc3NIzD4+PgDAwP39/feQkJC9/f3ubne3d3duLi4HGpqao2NuYABAQFUVMjIyD0wAgICDdAXFxfeQBzJzCg=",0,6,48,46,2.41,0.276,0.0291],[3,"Tier III • Bastião Veterano","AwMDAAAAAgICAQEBAAAAAwMDAAAAAgICAgICAwAAAAICAgQCAgIAAAAAAQMDAwAAAAEBAQIDAwMDAwMAAAICAgIBAQECAAAAAgIAAwAAAAEBAAAAAQAAAAAAAAMDAwIDAgEBAo6Ojuzs7Nvb2/b29lNTU5GRkQsLC09PT1hYWIgAAABaWloKtbW1zc3NIzD4+PgDAwP39/feQkJC9/f3TEze3d3duLi4HGpqao2NXkYBAQFUVMjIyD3SAgIC0NAXFxfeQBzJzCg=",3,10,41,46,2.59,0.615,0.0283],[4,"Tier IV • Elite do Alto Trono","AwMDAAAAAgICAQEBAAAAAwMDAAAAAgICAgICAwAAAAICAgQCAgIAAAAABAMDAwAAAAEBAQIDAwMDAwMAAAECAgIBAQECAAAAAgIAAwAAAAEBAAAAAQAAAAAAAAMDAwIDAgEBAo6Ojuzs7Nvb2/b29lNTU5GRkQsLC09PT1hYWIgAAABaWloKtbW1zc3NIwT4+PgDAwP39/feQkJC9/f3TEy+3d3duLi4HGpqao2NXkYBAQFUVMjIyD3SAgIC0NAXFxchQBzJzCg=",6,10,38,46,2.72,0.719,0.0273],[5,"Tier V • Campeão Soberano Ápice","AwMDAAAAAgICAQEBAAAAAwMDAAAAAgICAgICAwAAAAICAgQCAgIAAAAABAMDAwAAAAEBAQQDAwMDAwMAAAECAgIBAQECAAAAAgIAAwAAAAEBAAAAAQAAAAAAAAMDAwIDAgEBAo6Ojuzs7Nvb2/b29lNTU5GRkQsLC09PT1hYWIgAAABaWloKtbW1zc3NIwT4+PgDAwP39/cJQkJC9/f3TEy+3d3duLi4HGpqao2NXkYBAQFUVMjIyD3SAgIC0NAXFxchQBzJzCg=",7,10,37,46,2.76,0.828,0.0219]]
  },
  "dual_blue_green": {
    "archetypeId": "dual_blue_green",
    "domains": ["blue","green"],
    "isAxialAlliance": false,
    "triadId": "vortex_alliances",
    "classicDeckId": "deck_dual_wild_evolution",
    "name": "Pacto da Evolução Quimérica",
    "subtitle": "Pacto Duplo ❄️+🌿 • Rampa Arcana, Compra & Leviatãs",
    "strategySummary": "Une aceleração de Essência silvestre e compra de cartas glacial para evoluir quimeras, congelar bloqueadores e dominar com Titãs e Leviatãs.",
    "tacticalIdentity": "ramp",
    "coverCardId": "blue_173_general_roda_gelo",
    "generationsEvolved": 20,
    "matchesSimulated": 6852,
    "seedWinRate": 0.524,
    "championWinRate": 0.57,
    "vsMonocolorWinRate": 0.688,
    "championDeckJaccardStability": 0.942,
    "medianCardCi95HalfWidth": 0.18,
    "domainCardBreakdown": {"neutral":10,"blue":58,"green":32},
    "crossDomainCombos": [[816,863,1,0.46,13," (100% WR em 13 duelos cruzados)"],[1035,853,0.929,0.389,14," (93% WR em 14 duelos cruzados)"],[1035,126,0.909,0.369,11," (91% WR em 11 duelos cruzados)"],[54,130,0.9,0.36,10," (90% WR em 10 duelos cruzados)"],[223,863,0.9,0.36,10," (90% WR em 10 duelos cruzados)"],[408,114,0.9,0.36,10," (90% WR em 10 duelos cruzados)"]],
    "learnedProfile": {"deckId":"dual_blue_green","deckName":"Pacto da Evolução Quimérica","archetypeTag":"ramp","generationsTrained":14,"matchesSimulated":6788,"baselineWinRate":0.524,"trainedWinRate":0.518,"weights":{"aggroFaceBias":1.09,"tradeValueBias":1.28,"guardianPriority":0.95,"flyingEvasionBias":1.23,"stackConsolidationBias":1,"antiAoeSpreadBias":1,"spellHoldPatience":1,"relicPriority":1.03,"ascensionEagerness":1.3,"bloodPactThresholdHp":24,"domainExpansionEagerness":1.02,"sovPowerTempoBias":1.02,"synergyHoldBonus":19,"mulliganCurveTarget":3},"mk":[108,110,126,67,591,909,955],"cp":[112,715,368,130,38,863,861,767,862,141],"ca":[54,58,114,116,119,132,140,408,816,853,863,1035],"hb":[[37,18.8],[54,14.9],[57,10.1],[58,23],[114,16.7],[116,13],[119,12.4],[126,9.2],[132,12.2],[140,13.7],[408,11],[665,14.8],[816,24],[853,13.9],[862,12.9],[863,21.8],[1035,24],[1036,19.6]],"sp":[[1035,58],[816,116],[1035,54],[1035,853],[816,119],[1035,855],[816,853],[54,1036],[1035,126],[816,58]],"dc":[[816,863,1,0.46,13," (100% WR em 13 duelos cruzados)"],[1035,853,0.929,0.389,14," (93% WR em 14 duelos cruzados)"],[1035,126,0.909,0.369,11," (91% WR em 11 duelos cruzados)"],[54,130,0.9,0.36,10," (90% WR em 10 duelos cruzados)"],[223,863,0.9,0.36,10," (90% WR em 10 duelos cruzados)"],[408,114,0.9,0.36,10," (90% WR em 10 duelos cruzados)"]]},
    "topShapleyCards": [[1035,0.2095,0.0833,0.1262,0.811,0.634,37],[1029,0.1828,-0.1678,0.3506,0.8,0.95,5],[816,0.1569,0.083,0.0739,0.75,0.47,132],[863,0.1038,0.0008,0.103,0.707,0.664,75],[130,0.1004,-0.0928,0.1932,0.714,0.885,21],[1036,0.0993,-0.0825,0.1818,0.708,0.788,24],[126,0.0816,0.0198,0.0618,0.662,0.219,225],[54,0.0633,0.0101,0.0532,0.643,0.203,311],[58,0.0364,-0.0427,0.0791,0.625,0.379,144],[408,0.0362,-0.1413,0.1775,0.643,0.741,28],[119,0.0243,-0.0409,0.0652,0.609,0.306,215],[853,0.0205,-0.0353,0.0558,0.603,0.264,295]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AwMDAwMDAAAAAAAAAAABAQEBAQEBAgICAwMDAAICAAAAAgACAAAAAAMCAwMCAgMDAQEDAQIBAgICAgICAgICAgMDAQIBAQEAAAACAgICAAABAQECAgAAAAAAAgIAAQABAAEBAI2Njbu7u93d3Xd3vr6+jJSUlD4+PgYGBlVVVTIRCCYmJm41CN82NjYuby4ub280NAMDWQUxA/STk5OU9PQxlJRZWWkxQkJCQ0NDEXRubjIyk5OTdHTo6Ojf3wgRM2mNaY1wcI0=",0,0,80,20,3.01,0.081,0.0165],[2,"Tier II • Guarnição Regular","AwMDAwMDAAAAAAAAAAABAQEBAQEBAgICAwMDAAICAAAAAQECAAAAAAMCAwMCAgICAQEAAAIBAgICAgICAgICAgMDAQIBAQEAAAACAgICAAABAQECAgAAAAAAAgIAAQABAAEBAI2Njbu7u93d3Xd3vr6+jJSUlD4+PgYGBlVVVTIRCCYmJkVFCN82NjYuby4ub297ewMDcnIxA/STk5OU9PQxlJRZWWkxQkJCQ0NDEXRubjIyk5OTdHTo6Ojf3wgRM2mNaY1wcI0=",0,6,75,19,3.06,0.233,0.0275],[3,"Tier III • Bastião Veterano","AwMDAwMDAAAAAAAAAAADAQEBAQEBAgICAwMDBAICAAAAAQECAQAAAAMDAAADAgICBAEAAAIBAgICAgICAgICAgIBAQEBAQEAAAADAwICAAABAQEBAQAAAAAAAgIAAQABAAEBAI2Njbu7u93d3Xd3vr6+epSUlD4+PgYGBlVVVQsRCCYmJkVFCJg2NjYuLjIyLm97ewwDcnIxA5Qxk5OU9PQxk5T0DWlpQkJCQ0NDNjbLy98yk5OTSkro6Ojf3wgRMwONaY1wcI0=",3,14,64,19,3.19,0.574,0.0294],[4,"Tier IV • Elite do Alto Trono","AwMDAwMDAAAAAAAAAAADAQEBAQEBAgICAwMDBAAEAAAAAQECAQAAAAADAAAAAAICBAAAAAEBAwICAgECAgICAgEBAQEBAQEAAAADAwICAgABAQEBAQAAAAAAAgIAAQABAAEBAI2Njbu7u93d3Xd3vr6+epSUlD4+PgYGBlVVVQs/BSYmJkVFCJg2NjYyMDIyOjp7ewx0cnJpA2IxMZPj//8xk5MNDWlpQkJCQ0NDNjbLywjfk5OTSkro6Ojf3wgRMwONA41wcI0=",6,22,53,19,3.34,0.773,0.026],[5,"Tier V • Campeão Soberano Ápice","AwMDAwMDAAAAAAAAAAADAQEBAQEBAgICAwMDBAAEAAAAAQEDAQAAAAMDAwMAAAICBAAAAAAAAwMDAwECAgAAAAEBAgIBAQEAAAADAwICAAABAQEBAQAAAAAAAgAAAwADAAEBAI2Njbu7u93d3Xd3vr6+epSUlD4+PgYGBlVVVQs/BSYmJkVFMZg2NjYwMPPzOjp7ewx0cnKChGJeX1/j//+Cfn4NDZmZQkJCQ0NDNjbLyzk5k5OTSkro6Ojf38/nM12NXY1wcI0=",9,39,33,19,3.78,0.813,0.0237]]
  },
  "dual_green_gold": {
    "archetypeId": "dual_green_gold",
    "domains": ["green","gold"],
    "isAxialAlliance": false,
    "triadId": "veridia_alliances",
    "classicDeckId": "deck_dual_solar_wild",
    "name": "Pacto da Aurora Silvestre",
    "subtitle": "Pacto Duplo 🌿+☀️ • Falange dos Mil Escudos & Hinos Globais",
    "strategySummary": "Multiplica aliados protegidos por Guardião, Regeneração e Escudo Divino em massa, esmagando em frente ampla com bônus globais +ATQ/+VIDA.",
    "tacticalIdentity": "midrange",
    "coverCardId": "green_50_avatar_gaia",
    "generationsEvolved": 20,
    "matchesSimulated": 7076,
    "seedWinRate": 0.631,
    "championWinRate": 0.537,
    "vsMonocolorWinRate": 0.75,
    "championDeckJaccardStability": 0.961,
    "medianCardCi95HalfWidth": 0.0562,
    "domainCardBreakdown": {"gold":57,"neutral":10,"green":33},
    "crossDomainCombos": [[114,769,1,0.463,13," (100% WR em 13 duelos cruzados)"],[655,769,1,0.463,10," (100% WR em 10 duelos cruzados)"],[1037,910,0.917,0.409,12," (92% WR em 12 duelos cruzados)"],[380,913,0.909,0.402,11," (91% WR em 11 duelos cruzados)"],[682,853,0.889,0.382,9," (89% WR em 9 duelos cruzados)"],[115,910,0.882,0.375,17," (88% WR em 17 duelos cruzados)"]],
    "learnedProfile": {"deckId":"dual_green_gold","deckName":"Pacto da Aurora Silvestre","archetypeTag":"midrange","generationsTrained":14,"matchesSimulated":7012,"baselineWinRate":0.631,"trainedWinRate":0.518,"weights":{"aggroFaceBias":1.12,"tradeValueBias":1.25,"guardianPriority":1.38,"flyingEvasionBias":1.02,"stackConsolidationBias":1.22,"antiAoeSpreadBias":1,"spellHoldPatience":1.02,"relicPriority":1,"ascensionEagerness":1.01,"bloodPactThresholdHp":24,"domainExpansionEagerness":1,"sovPowerTempoBias":1,"synergyHoldBonus":21,"mulliganCurveTarget":2.8},"mk":[913,278,272,853,126,910,145,159,784],"cp":[862,769,780,151,664,879,680,115,863,145],"ca":[114,126,145,159,272,278,381,421,678,682,769,784],"hb":[[114,18.6],[126,14.2],[145,14.8],[159,10.6],[272,12],[278,17],[381,16],[421,9.2],[664,10.3],[678,13.4],[682,22.5],[769,17.3],[784,21.3],[853,23],[862,23.7],[871,6.8],[880,24],[910,15.1],[913,19.4],[1036,17.6],[1037,24]],"sp":[[1037,853],[880,913],[880,910],[871,862],[145,1036],[682,278],[862,913],[145,880],[880,278],[145,862]],"dc":[[114,769,1,0.463,13," (100% WR em 13 duelos cruzados)"],[655,769,1,0.463,10," (100% WR em 10 duelos cruzados)"],[1037,910,0.917,0.409,12," (92% WR em 12 duelos cruzados)"],[380,913,0.909,0.402,11," (91% WR em 11 duelos cruzados)"],[682,853,0.889,0.382,9," (89% WR em 9 duelos cruzados)"],[115,910,0.882,0.375,17," (88% WR em 17 duelos cruzados)"]]},
    "topShapleyCards": [[880,0.2345,0.0432,0.1913,0.813,0.814,16],[271,0.1942,-0.0774,0.2716,0.778,0.925,9],[769,0.1779,0.0523,0.1256,0.756,0.807,45],[267,0.1255,-0.0753,0.2008,0.7,0.744,20],[115,0.1069,-0.0308,0.1376,0.682,0.753,44],[784,0.0962,0.0328,0.0634,0.638,0.091,221],[1037,0.0915,-0.0594,0.1508,0.658,0.582,38],[272,0.0714,0.0167,0.0548,0.612,0.062,304],[853,0.0702,0.0034,0.0668,0.624,0.324,202],[913,0.0659,0.0103,0.0556,0.606,0.057,297],[655,0.0631,-0.0094,0.0725,0.622,0.434,172],[151,0.0625,-0.115,0.1775,0.643,0.861,28]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AQEBAwMDAQEBAwMDAwMDAwMDAwICAgMDAwMDAwABAQEBAQEBAgIBAQECAgICAQEBAQICAAAAAAAAAwECAgAAAAEBAwMBAQMBAQEBAQEDAwEBAQEBAAAAAAAAAQIAAwMBAAMBA7CwsBERERAQEJGRkY6OjpSUlHyPj49nZ2dVVVWKBQVp3gVpaZSUCQkJk5MxMQMD3t4xk4qhkpKhkgaoQUGTk5OoqAQEp6cHFxYWFhcXBwcbG6WlpZ+fn5GRkadBoVYGG4oGAwQ=",0,0,78,22,3.04,0.048,0.0126],[2,"Tier II • Guarnição Regular","AQEBAwMDAQEBAwMDAwMDAwMDAwICAgMDAwMDAwABAQEBAQEBAQEBAQECAgICAQEBAQICAAAAAAAAAwECAgAAAAEDAgIBAQMBAQEBAQEDAwEBAQEBAAAAAAAAAQIAAwMBAAMBALCwsBERERAQEJGRkY6OjpSUlHyPj49nZ2dVVVWKBQVp3gVpaePjCQkJk5MxMQMD3t4xk4qhkpKhkgaoQUGTk5OobUJCp6cHFxYWFhcXBwcbG6WlpZ+fn5GRkadBoVYGG4oGA68=",0,6,72,22,3.12,0.263,0.0286],[3,"Tier III • Bastião Veterano","AQEBAwMDAQEBAwMDAwMDAwMDAwICAgMDAwMDAwQBAQEBAQEBAQEBAQEAAAECAQEBAQICAAQAAAAAAgIBAgAAAAMDAgIAAAMDAQEBAwECAgEBAQEBAAAAAAAAAQECAwABAAAAALCwsBERERAQEJGRkY6OjpSUlHyPj49nZ2dVVVUMBQVpaQUDaePjCQkJcnLeMQMD3t4xMYoNkpKhkqamp0GTk5NtbUJCoaEHBxYWFgd8QUEbG6WlpZ+fn5GRkaenRVaZG4qZiq8=",3,14,61,22,3.24,0.631,0.0283],[4,"Tier IV • Elite do Alto Trono","AQEBAwMDAQEBAwMDAwMDAwMDAwICAgMDAwMDAwQBAgEAAQEBAQEBAQEAAAAAAAACAgMDAQQAAAIAAgIBAQAAAAMDAgIAAAIDAQEBAQECAgEBAQEBAAAAAAAAAAECAwABAQAAALCwsBERERAQEJGRkY6OjpSUlHyPj49nZ2dVVVUMC5oDcwUDA+PjCQkJcnJ+foqKmJgBAQUNkpKqkqamp6eTk5NtbUJCoaFBBxYWFnx8QUEbG6WlpZ+fn5GRkaGnRVaZGwWZiq8=",6,22,50,22,3.37,0.732,0.0259],[5,"Tier V • Campeão Soberano Ápice","AQEBAwMDAQEBAwMDAwMDAwMDAwICAgMDAwMDAwQBAgAAAgMDAQEBAQEAAAAAAwMCAgMDAQQDBAICAgICAgAAAAMDAgIDAwEBAQEBAQEBAQMDAQEBAAAAAAAAAAACAwABAwABALCwsBERERAQEJGRkY6OjpSUlHyPj49nZ2dVVVUMC5pzczZfX+PjCQkJcnJ+fl5emJgBAQ8NcAeqRKamqKiTk5NtbUJCb299fRYWFnx8q6sQEKWlpZ+fn5GRkZeXRVaZG/SZD68=",10,42,26,22,3.86,0.808,0.0231]]
  },
  "dual_purple_gold": {
    "archetypeId": "dual_purple_gold",
    "domains": ["purple","gold"],
    "isAxialAlliance": false,
    "triadId": "solaria_alliances",
    "classicDeckId": "deck_dual_iron_inquisition",
    "name": "Pacto da Inquisição Crepuscular",
    "subtitle": "Pacto Duplo 💀+☀️ • Dreno Solar, Renascer & Veredito",
    "strategySummary": "Combina campeões imortais com Renascer, Escudo Divino e Dreno de Vida ao lado de destruição inquisitorial e Relíquias consagradas.",
    "tacticalIdentity": "attrition",
    "coverCardId": "purple_173_general_roda_abismo",
    "generationsEvolved": 20,
    "matchesSimulated": 6532,
    "seedWinRate": 0.524,
    "championWinRate": 0.573,
    "vsMonocolorWinRate": 0.703,
    "championDeckJaccardStability": 0.961,
    "medianCardCi95HalfWidth": 0.0477,
    "domainCardBreakdown": {"gold":58,"purple":32,"neutral":10},
    "crossDomainCombos": [[680,84,1,0.457,8," (100% WR em 8 duelos cruzados)"],[983,76,1,0.457,14," (100% WR em 14 duelos cruzados)"],[173,983,1,0.457,10," (100% WR em 10 duelos cruzados)"],[1037,913,1,0.457,12," (100% WR em 12 duelos cruzados)"],[76,741,1,0.427,8," (100% WR em 8 duelos cruzados)"],[913,545,0.909,0.366,11," (91% WR em 11 duelos cruzados)"]],
    "learnedProfile": {"deckId":"dual_purple_gold","deckName":"Pacto da Inquisição Crepuscular","archetypeTag":"attrition","generationsTrained":14,"matchesSimulated":6468,"baselineWinRate":0.524,"trainedWinRate":0.58,"weights":{"aggroFaceBias":1,"tradeValueBias":1.34,"guardianPriority":1.28,"flyingEvasionBias":1,"stackConsolidationBias":1,"antiAoeSpreadBias":1,"spellHoldPatience":1,"relicPriority":1.18,"ascensionEagerness":1,"bloodPactThresholdHp":24,"domainExpansionEagerness":1,"sovPowerTempoBias":1,"synergyHoldBonus":20,"mulliganCurveTarget":2.9},"mk":[278,159,834,913,236,784,84],"cp":[678,738,578,421,680,837,878,832,943,340],"ca":[84,159,173,175,236,272,278,346,381,421,545,682],"hb":[[76,6.3],[84,15.4],[159,16.4],[173,20.8],[175,21.5],[236,19.8],[272,9.6],[278,18.2],[346,18.6],[381,16.2],[421,9.8],[545,24],[682,24],[741,11.2],[784,20.9],[838,15.1],[839,22.6],[840,22.7],[870,13.3],[880,24],[913,21.7],[983,19.6],[1033,18.2],[1037,24]],"sp":[[880,84],[381,983],[1037,913],[682,84],[545,236],[682,278],[159,545],[173,736],[175,236],[175,913]],"dc":[[680,84,1,0.457,8," (100% WR em 8 duelos cruzados)"],[983,76,1,0.457,14," (100% WR em 14 duelos cruzados)"],[173,983,1,0.457,10," (100% WR em 10 duelos cruzados)"],[1037,913,1,0.457,12," (100% WR em 12 duelos cruzados)"],[76,741,1,0.427,8," (100% WR em 8 duelos cruzados)"],[913,545,0.909,0.366,11," (91% WR em 11 duelos cruzados)"]]},
    "topShapleyCards": [[840,0.2829,0.0969,0.1859,0.9,0.875,10],[1037,0.2292,0.0958,0.1334,0.833,0.615,30],[680,0.1927,0.0248,0.168,0.81,0.869,21],[983,0.1911,0.0995,0.0916,0.797,0.656,74],[545,0.1795,0.0363,0.1432,0.781,0.568,32],[839,0.1683,0.0251,0.1432,0.781,0.791,32],[1031,0.135,-0.11,0.245,0.75,0.833,12],[346,0.1019,-0.0354,0.1373,0.698,0.449,43],[741,0.1019,-0.08,0.1818,0.708,0.662,24],[278,0.0938,0.0398,0.054,0.672,0.105,290],[879,0.0914,-0.0904,0.1818,0.708,0.87,24],[838,0.0908,-0.0328,0.1236,0.698,0.679,53]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AQEBAQEBAwMDAwMDAgICAAAAAQEBAwMDAAAAAAEBAgACAgACAgIBAQEBAQAAAAEBAQEBAwMDAQMDAAAAAQEBAQEAAAMDAQADAwMDAQEAAAABAAMAAgIAAAABAQAAAAICAAADAxAQEKWlpWZmZkBAQD4+Puzs7BISEpGRkVRUVFtWVn9bf39b39/furpUVFRZWVlVVVVWdwUFBXdra5OTkxYWFqenrq6amneeoqKaohsboaGuG7VroUGlra2tgqefn59BQZ6e+/s=",0,0,79,21,2.89,0.02,0.0096],[2,"Tier II • Guarnição Regular","AQEBAQEBAwMDAwMDAgICAAAAAQEBAwMDAAAAAAAAAgACAgACAgICAgEBAQAAAAEBAQEBAwMDAQMDAAAAAQEBAQEAAAMDAQADAwMDAQEAAAABAAMAAgIAAAAAAQAAAAICAAADAxAQEKWlpWZmZkBAQD4+Puzs7BISEpGRkVRUVFtMTH9bf39b39/f4OBUVFRZWVlVVVVWdwUFBXdra5OTkxYWFqenrq6amneeoqKaohsboaGuG7VroUGnra2tsqefn59BQZ6e+/s=",0,6,73,21,2.9,0.278,0.029],[3,"Tier III • Bastião Veterano","AQEBAQEBAwMDAwMDAgICAAAAAQEBAwMDAAAABAAAAgECAgIAAAACAgEBAQAAAAICAgIBAwMDAQMDAAAAAQEBAQEAAAMDAQADAwMDAAAAAAABAwMAAgIAAAAAAQAAAAICAAADAxAQEKWlpWZmZkBAQD4+Puzs7BISEpGRkVRUVAlMTH9aIX9/W1tb4OBUVFRZWVnf3+LidwUFBXdra5OTkxYWFqenrq6amnee19eaoq+voaGuG3proaenra2tsqefn59BQZ6e+/s=",3,14,62,21,3.05,0.615,0.0291],[4,"Tier IV • Elite do Alto Trono","AQEBAQEBAwMDAwMDAgICAAAAAQEBAwMDAAAABAAAAwECAgICAgACAgEBAQAAAAMDAgIEAwMDAQADAAAAAQEBAAEAAAMDAQEDAwAAAAAAAAAAAwMDAgIAAAAAAQAAAAECAAADAxAQEKWlpWZmZkBAQD4+Puzs7BISEpGRkVRUVAlMTEhaIeV/f39b4OBUVFRZWVlFReLiDQUFBXeea5OTkxYWFqGnrq6vr3d319fGxq+voaGZmXpra6enra2tsqefn5+nQZ6e+/s=",6,22,51,21,3.17,0.775,0.0248],[5,"Tier V • Campeão Soberano Ápice","AQEBAQEBAwMDAwMDAgICAAAAAQEBAwMDAAAABAAAAwECAgMDAwMCAgEBAQAAAAMDAgIEAwQCAgICAAAAAQEBAgIDAwMDAwMDAwAAAAADAwAAAwMDAgIAAAAAAgAAAAEBAgIDAxAQEKWlpWZmZkBAQD4+Puzs7BISEpGRkVRUVAlMTEhaIeVHR0ZG4OBUVFRZWVlFReLiDXAHqkSoqJOTkxYWFqamEBCvr29v19fGxq+vDAyZmXpubqenra2tskKfn599famp+/s=",10,43,26,21,3.77,0.831,0.0225]]
  },
  "dual_red_blue": {
    "archetypeId": "dual_red_blue",
    "domains": ["red","blue"],
    "isAxialAlliance": false,
    "triadId": "vortex_alliances",
    "classicDeckId": "deck_dual_storm_dragon",
    "name": "Pacto do Fogo Astral",
    "subtitle": "Pacto Duplo 🔥+❄️ • Artilharia Arcana, Voo & Tempestade",
    "strategySummary": "Alinha feitiços piroclásticos, compra rúnica e Congelamento para abrir os céus para Dragões e Fênix de Voo e Alcance.",
    "tacticalIdentity": "tempo",
    "coverCardId": "red_99_senhor_balor_fogo",
    "generationsEvolved": 20,
    "matchesSimulated": 6632,
    "seedWinRate": 0.5,
    "championWinRate": 0.48,
    "vsMonocolorWinRate": 0.641,
    "championDeckJaccardStability": 1,
    "medianCardCi95HalfWidth": 0.18,
    "domainCardBreakdown": {"neutral":10,"red":36,"blue":54},
    "crossDomainCombos": [[1035,11,1,0.55,16," (100% WR em 16 duelos cruzados)"],[1035,300,1,0.55,14," (100% WR em 14 duelos cruzados)"],[1035,34,0.917,0.467,12," (92% WR em 12 duelos cruzados)"],[408,913,0.875,0.425,8," (88% WR em 8 duelos cruzados)"],[1035,3,0.875,0.425,8," (88% WR em 8 duelos cruzados)"],[1035,205,0.867,0.417,15," (87% WR em 15 duelos cruzados)"]],
    "learnedProfile": {"deckId":"dual_red_blue","deckName":"Pacto do Fogo Astral","archetypeTag":"tempo","generationsTrained":14,"matchesSimulated":6568,"baselineWinRate":0.5,"trainedWinRate":0.58,"weights":{"aggroFaceBias":1.18,"tradeValueBias":0.99,"guardianPriority":1.04,"flyingEvasionBias":1.34,"stackConsolidationBias":1,"antiAoeSpreadBias":1,"spellHoldPatience":1.16,"relicPriority":1,"ascensionEagerness":0.99,"bloodPactThresholdHp":24,"domainExpansionEagerness":1,"sovPowerTempoBias":1.19,"synergyHoldBonus":20,"mulliganCurveTarget":2.8},"mk":[591,300,913,457,11,205],"cp":[334,717,224,513,403,314,43,6,54,330],"ca":[11,34,54,205,218,300,913,1029,1035],"hb":[[11,13.4],[34,15.2],[54,23.6],[205,9.3],[218,8.9],[221,6.3],[300,23.1],[913,13.9],[1029,20.1],[1035,24]],"sp":[[1035,300],[1035,54],[1029,34],[1035,34],[54,300],[1035,11],[54,34],[54,11],[11,1034],[54,913]],"dc":[[1035,11,1,0.55,16," (100% WR em 16 duelos cruzados)"],[1035,300,1,0.55,14," (100% WR em 14 duelos cruzados)"],[1035,34,0.917,0.467,12," (92% WR em 12 duelos cruzados)"],[408,913,0.875,0.425,8," (88% WR em 8 duelos cruzados)"],[1035,3,0.875,0.425,8," (88% WR em 8 duelos cruzados)"],[1035,205,0.867,0.417,15," (87% WR em 15 duelos cruzados)"]]},
    "topShapleyCards": [[1035,0.3658,0.2608,0.1049,0.872,0.519,39],[224,0.1432,-0.0954,0.2386,0.667,0.867,15],[317,0.1376,-0.2396,0.3772,0.667,0.978,6],[1029,0.0914,-0.173,0.2645,0.615,0.877,13],[408,0.077,-0.1083,0.1853,0.593,0.71,27],[913,0.0719,-0.0155,0.0874,0.556,0.088,124],[34,0.0719,0.0133,0.0586,0.564,0.232,275],[54,0.0643,0.0096,0.0547,0.55,0.119,318],[205,0.0577,-0.0002,0.0579,0.549,0.23,284],[11,0.0507,-0.0057,0.0564,0.54,0.185,300],[218,0.0357,-0.0164,0.0521,0.521,0.109,353],[591,0.0274,-0.044,0.0713,0.532,0.489,188]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AwMDAQEBAAAAAgICAQEBAQECAgAAAAEBAQAAAAAAAAAAAAAAAAEBAQMAAAAAAAAAAAAAAAAAAAAAAAABAQEBAQEBAQECAgIDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI2NjcnJyb6+vk9PTz4+Pj09AQEfHx84ODjo6OgrKytAQEAmJiaTk5MsJSUlMTExNTU1ysrK09PT3NzcSEhImpqayMjIDw8PhQICAgoKCgwMDA8PDxoaGh0dHR4eHi4uLsjIyMs=",0,4,22,74,2.53,0.081,0.0165],[2,"Tier II • Guarnição Regular","AwMDAQEBAAAAAgICAQEBAQECAgAAAAEBAQAAAQAAAQAAAAAAAAAAAAAAAAAAAAEBAQADAAAAAgICAwMDAgICAQAAAAAAAwMAAAABAQEAAAACAgIBAQEAAAADAwMAAAACAgIBAY2NjcnJyb6+vk9PTz4+Pj09AQEfHx84ODjY2PwgIDro6OgrKytAQEAmJiYDAwOTk5NFLOTk5NHR0Tk5OQ4ODiYzMzNDQyws29vbQkJC3t7eXV1dzMzMNTU1HBwcJSUlbW1t9/c=",1,9,54,36,2.79,0.233,0.0275],[3,"Tier III • Bastião Veterano","AwMDAQEBAAAAAAAAAgICAAAAAQEBAQECAgAAAAEBAQAAAQAAAQEBAAAAAQEBAAAAAAAAAAAAAAAAAAAAAQEBAAMAAAACAgIDAwMBAgMDAgICAQEBAAAAAAAAAwMDAQEBAAAAAI2NjcnJyb6+vtra2k9PT93d3T4+Pj09AQEfHx84ODjY2PwgIDo6S0Tn509PRejo6CsrK0BAQCYmJgMDA5OTk0Us5OTk0dHROTk5Jg4sLF1dXczMzNvb2zU1NRwcHEJCQt7e3iU=",3,15,47,35,2.9,0.574,0.0294],[4,"Tier IV • Elite do Alto Trono","AwMDAQEBAAAAAAAAAgICAwAAAAAAAAEBAQQBAQICAAAAAQEBAAABAAABAQEAAwAAAQEBAQAAAAICAAAAAAAAAAAAAAAAAAICAAAAAQEBAAMAAAACAgIDAwMDAgICAQEBAAAAAI2NjcnJyb6+vtra2k9PT5ELCwvd3d0+Pj4KPT0BAR8fHzg4ONjY/CAgOjpLRDjn509PRUXo6Oh2disrK0BAQCYmJuADAwPNzc3NzZOTk0Us5OTk0dHROTksLF1dXczMzNvb2zU=",5,21,40,34,3.02,0.773,0.026],[5,"Tier V • Campeão Soberano Ápice","AwMDAQEBAAAAAAAAAgICAwAAAAAAAAEBAQEBAQQBAQICAAAAAAAAAQEBAAABAAABAQQBAAMAAAABAQEBAAAAAgIAAAAAAAAEAAAAAAAAAAICAAAAAAAAAQEBAQEAAAICAwEAAo2NjcnJyb6+vtra2k9PT5ELCwvd3d0sLCw+Pj4KPT0BASIiIh8fHzg4ONjY/CAgOjoLS0Q4P+fnT09FRejo6HZ2KysrQEBABSYmJuADAwPNzTY2Ns3NzZOTk0pKRUcMyyyYR8s=",10,27,38,25,3.28,0.813,0.0237]]
  },
  "dual_green_neutral": {
    "archetypeId": "dual_green_neutral",
    "domains": ["green","neutral"],
    "isAxialAlliance": true,
    "triadId": "veridia_alliances",
    "name": "Aliança dos Engenhos Silvestres",
    "subtitle": "Aliança 🌿+⚙️ • Colossos de Madeira-Ferro & Guildas Axiais",
    "strategySummary": "Une a rampa e os Titãs de Veridia aos Constructos blindados e campeões da Cidade Franca em uma frente pesada de Atropelar e Armadura.",
    "tacticalIdentity": "midrange",
    "coverCardId": "neutral_54_dragao_etereo",
    "generationsEvolved": 20,
    "matchesSimulated": 7144,
    "seedWinRate": 0.595,
    "championWinRate": 0.621,
    "vsMonocolorWinRate": 0.797,
    "championDeckJaccardStability": 0.923,
    "medianCardCi95HalfWidth": 0.0518,
    "domainCardBreakdown": {"neutral":50,"green":50},
    "crossDomainCombos": [[571,910,1,0.409,9," (100% WR em 9 duelos cruzados)"],[655,1032,1,0.409,10," (100% WR em 10 duelos cruzados)"],[126,1032,1,0.409,9," (100% WR em 9 duelos cruzados)"],[1036,913,1,0.409,8," (100% WR em 8 duelos cruzados)"],[267,910,1,0.409,10," (100% WR em 10 duelos cruzados)"],[664,853,1,0.379,10," (100% WR em 10 duelos cruzados)"]],
    "learnedProfile": {"deckId":"dual_green_neutral","deckName":"Aliança dos Engenhos Silvestres","archetypeTag":"midrange","generationsTrained":14,"matchesSimulated":7080,"baselineWinRate":0.595,"trainedWinRate":0.563,"weights":{"aggroFaceBias":1.14,"tradeValueBias":1.25,"guardianPriority":1.15,"flyingEvasionBias":1,"stackConsolidationBias":1,"antiAoeSpreadBias":1,"spellHoldPatience":0.96,"relicPriority":1.02,"ascensionEagerness":1,"bloodPactThresholdHp":24,"domainExpansionEagerness":1.25,"sovPowerTempoBias":1,"synergyHoldBonus":20,"mulliganCurveTarget":2.9},"mk":[118,910,126,897,591,913],"cp":[365,564,921,863,1020,942,944,862,664,853],"ca":[114,116,119,126,140,189,267,270,487,853,862,863],"hb":[[114,17.3],[116,15.4],[119,16.3],[126,15.3],[140,19.9],[189,24],[267,24],[270,20.7],[487,24],[769,13.1],[853,14.9],[862,24],[863,24],[864,24],[897,13.5],[910,19.6],[913,18.3],[922,11.9],[940,6.8],[942,14.3],[983,21.2],[984,24],[1032,24],[1036,24]],"sp":[[119,189],[119,862],[487,984],[189,913],[862,897],[1032,910],[119,863],[189,897],[265,1032],[114,862]],"dc":[[571,910,1,0.409,9," (100% WR em 9 duelos cruzados)"],[655,1032,1,0.409,10," (100% WR em 10 duelos cruzados)"],[126,1032,1,0.409,9," (100% WR em 9 duelos cruzados)"],[1036,913,1,0.409,8," (100% WR em 8 duelos cruzados)"],[267,910,1,0.409,10," (100% WR em 10 duelos cruzados)"],[664,853,1,0.379,10," (100% WR em 10 duelos cruzados)"]]},
    "topShapleyCards": [[189,0.3336,0.2536,0.08,1,0.914,6],[1032,0.2693,0.1669,0.1024,0.923,0.662,26],[1036,0.2491,0.1236,0.1256,0.905,0.7,21],[267,0.2375,0.119,0.1185,0.889,0.614,27],[664,0.1687,0.0196,0.1491,0.833,0.879,24],[863,0.129,0.0119,0.117,0.787,0.753,47],[769,0.1265,0.0388,0.0877,0.779,0.639,86],[571,0.111,-0.0811,0.1921,0.778,0.923,18],[983,0.1102,0.0274,0.0828,0.757,0.53,103],[862,0.0879,-0.0317,0.1196,0.745,0.73,51],[270,0.0814,0.0133,0.0681,0.712,0.194,170],[487,0.0756,0.0057,0.0699,0.71,0.274,162]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AgICAwMDAwMDAwMDAwMDAgICAAAAAQEBAwMDAQABAAABAQEBAgICAgIDAwMAAQEBAgICAgMDAwMDAQEBAwAAAwADAwMBAQECAgEBAQMDAAACAQEDAwMDAwMDAwMBAQIBAQMDA09PT5GRkY6OjlVVVY2NjY+Pj3d3d4aGhoGBgQOKBYqKad7e3pOTMZP0WVlZb9wDA/T0lJSYmKammCQkJJ+7u6q7mpqaaWkOlDEJCQmfn29vMQUFhoamfHx8rKysDiYt3CbShpQ=",0,0,69,31,2.94,0.048,0.0126],[2,"Tier II • Guarnição Regular","AgICAwMDAwMDAwMDAwMDAgICAAAAAQEBAwMDAQABAAABAQEBAgICAgIDAwMAAQEBAgICAgMDAwMDAQEBAwAAAwADAwMBAQECAgEBAQMDAAACAQEDAwMDAwMDAwMBAQIBAQMDA09PT5GRkY6OjlVVVY2NjY+Pj3d3d4aGhoGBgQOKBYqKad7e3pOTMZP0WVlZb9wDA/T0lJSYmKammCQkJNe7u6q7mpqaaWkOlDEJCQmvr29vMQUFp6emfHx8rKysDiYtDSbShpQ=",0,6,65,29,2.97,0.263,0.0286],[3,"Tier III • Bastião Veterano","AgICAwMDAwMDAwMDAwMDAgICAAAAAQEBAwMDBAABAAABAQEBAgICAgICAwMBAQEBAgICAgMDAQEDAwMDAwMDAwMDAwMBAQECAQEBAQMDAQECAQEDAwMDAwMDAwMBAQIBAQMDA09PT5GRkY6OjlVVVY2NjY+Pj3d3d4aGhoGBgQyKBYqKaWne3pOTMTH09FlZ4+MDA5T0k5SYmCvzmK6u19d82Kp8mpqaA2kOlN4JCQmvr+fnMQUFp6empqZ8rKysDiYtDSbShpQ=",3,14,54,29,3.1,0.631,0.0283],[4,"Tier IV • Elite do Alto Trono","AgICAwMDAwMDAwMDAwMDAgICAAAAAQEBAwMDBAABAAEBAQEBAgIBAgMDAAABAQAAAAACAgQDAQEDAwMDAwMDAwMDAwMBAQEAAQEBAQMDAQEBAQEDAwMDAwMDAwMBAQIBAQMDA09PT5GRkY6OjlVVVY2NjY+Pj3d3d4aGhoGBgQyMBYoLA2lpaTEx3jEBAXJy4+OKin5+k5MImCvzmK6u19fY2Kp8mpqaAwMOi94JCQmvr+fn3gUFp6eYpqamrKysDiYtDSbShpQ=",6,22,45,27,3.2,0.732,0.0259],[5,"Tier V • Campeão Soberano Ápice","AgICAwMDAwMDAwMDAwMDAgICAAAAAQEBAwMDBAADAAEDAwAAAAADAwMDAAABAQICAAACAgQAAQECAwMDAwMDAwEDAwMDAwEAAQEBAQMDAQEBAQEDAwMDAwMDAwMBAQIBAQMDA09PT5GRkY6OjlVVVY2NjY+Pj3d3d4aGhoGBgQyMYHQLXl6Pj3NzX18BAXJy4+M7O35+mJgIvSvzUa6u19fY2KqJmpqaW1sOi20JCQmvr+fnbQUFp6f8/LCwrKysDiYtDSbShpQ=",10,43,21,26,3.65,0.808,0.0231]]
  },
  "dual_red_neutral": {
    "archetypeId": "dual_red_neutral",
    "domains": ["red","neutral"],
    "isAxialAlliance": true,
    "triadId": "pyros_alliances",
    "name": "Aliança da Artilharia de Mercúrio",
    "subtitle": "Aliança 🔥+⚙️ • Tropas de Choque & Assassinos Relojoeiros",
    "strategySummary": "Funde a velocidade vulcânica de Pyros com mercenários de Ímpeto/Toque Letal e autômatos de cerco da Cidade Franca.",
    "tacticalIdentity": "aggro",
    "coverCardId": "red_173_general_roda_chama",
    "generationsEvolved": 20,
    "matchesSimulated": 6744,
    "seedWinRate": 0.631,
    "championWinRate": 0.759,
    "vsMonocolorWinRate": 0.828,
    "championDeckJaccardStability": 0.923,
    "medianCardCi95HalfWidth": 0.0357,
    "domainCardBreakdown": {"neutral":46,"red":54},
    "crossDomainCombos": [[1032,3,1,0.271,8," (100% WR em 8 duelos cruzados)"],[1032,605,1,0.271,8," (100% WR em 8 duelos cruzados)"],[910,509,1,0.271,8," (100% WR em 8 duelos cruzados)"],[934,35,1,0.271,8," (100% WR em 8 duelos cruzados)"],[181,209,1,0.271,9," (100% WR em 9 duelos cruzados)"],[935,317,1,0.271,9," (100% WR em 9 duelos cruzados)"]],
    "learnedProfile": {"deckId":"dual_red_neutral","deckName":"Aliança da Artilharia de Mercúrio","archetypeTag":"aggro","generationsTrained":14,"matchesSimulated":6680,"baselineWinRate":0.631,"trainedWinRate":0.616,"weights":{"aggroFaceBias":1.32,"tradeValueBias":1.08,"guardianPriority":0.96,"flyingEvasionBias":1.26,"stackConsolidationBias":1,"antiAoeSpreadBias":1,"spellHoldPatience":0.94,"relicPriority":1,"ascensionEagerness":0.93,"bloodPactThresholdHp":24,"domainExpansionEagerness":1.03,"sovPowerTempoBias":1.24,"synergyHoldBonus":18,"mulliganCurveTarget":2.6},"mk":[300,913,205,910,591,791,892,917,922],"cp":[899,1016,300,602,934,192,693,200,502,201],"ca":[11,35,189,205,300,600,605,791,892,910,913,917],"hb":[[2,7.2],[11,10.4],[35,12.8],[189,22.4],[205,14.4],[300,19.2],[600,12.6],[605,11.5],[791,11.5],[892,14],[910,14.5],[913,16.8],[917,14.4],[922,11.4],[1032,11.9]],"sp":[[189,205],[189,300],[892,317],[189,503],[189,940],[189,913],[189,11],[189,0],[1032,892],[605,35]],"dc":[[1032,3,1,0.271,8," (100% WR em 8 duelos cruzados)"],[1032,605,1,0.271,8," (100% WR em 8 duelos cruzados)"],[910,509,1,0.271,8," (100% WR em 8 duelos cruzados)"],[934,35,1,0.271,8," (100% WR em 8 duelos cruzados)"],[181,209,1,0.271,9," (100% WR em 9 duelos cruzados)"],[935,317,1,0.271,9," (100% WR em 9 duelos cruzados)"]]},
    "topShapleyCards": [[1032,0.1648,0.0778,0.087,0.955,0.621,22],[935,0.1196,0.0714,0.0482,0.883,0.095,171],[509,0.0873,-0.0308,0.118,0.871,0.5,31],[910,0.0675,0.0216,0.0459,0.829,0.065,258],[11,0.0437,-0.0025,0.0462,0.807,0.094,280],[913,0.0392,-0.0065,0.0456,0.8,0.042,295],[35,0.0339,-0.0393,0.0733,0.815,0.443,108],[205,0.0285,-0.018,0.0465,0.788,0.013,297],[300,0.0236,-0.0226,0.0462,0.784,0.026,305],[917,0.0219,-0.0276,0.0495,0.785,0.086,265],[1034,0.0172,-0.1507,0.168,0.81,0.672,21],[922,0.0137,-0.0352,0.0489,0.777,0.092,278]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AwMDAwMDAAAAAQEBAwMDAQEBAAAAAwMDAgICAwMDAAAAAAICAgAAAAAAAAEBAQEDAwMBAwMDAwMDAwMCAgIBAwMDAwMDAQEAAwMCAgICAgIAAAABAwAAAAAAAAABAQMAAwEAAZGRkY6OjgsLCywsLBcXFzD29snJyYODg1hYWJWVlQAAAA21tbUDAwPNzc339/cjmpqaiKamqqqqrKysT09PI42NjXx8fDAwDfj4WlpaXV1dAgICyvjIwMDAtbW1iMqGIpOIDSM=",0,0,47,53,2.3,0.043,0.0122],[2,"Tier II • Guarnição Regular","AwMDAwMDAAAAAQEBAwMDAQEBAAAAAwMDAgICAwMDAAAAAAICAgAAAAAAAAEBAQEDAwMBAwMDAwMDAwMCAgIBAwMDAwMDAQEAAwMCAgICAgIAAAABAwAAAAAAAAADAQMAAwEAAZGRkY6OjgsLCywsLBcXFzD29snJyYODg1hYWJWVlQAAAA21tbUDAwPNzc339/cjmpqaiKamqqqqrKysT09PI42NjXx8fDAwI/j4WlpaXV1dAgICPfjIwMDAtbW1pz2GIq+IIyM=",0,6,42,52,2.33,0.276,0.0291],[3,"Tier III • Bastião Veterano","AwMDAwMDAAAAAQEBAwMDAAEBAAAAAwMDAgICAwMDAAAABAICAgAAAAAAAAEBAQEDAwMDAwMDAwMDAwMCAgIBAwMDAwMDAQEAAwMCAgICAgIAAAABAwAAAAAAAAADAQMAAwEAAZGRkY6OjgsLCywsLBcXF9L29snJyYODg1hYWJWVlQAAAAq1tbUDAwPNzc339/cjmpqap6amqqqqrKysT09PI42NjXx8fDAwI/j4WlpaXV1dAgICPfjIwMDAtbW1pz2GIq+PIyM=",3,7,38,52,2.43,0.615,0.0283],[4,"Tier IV • Elite do Alto Trono","AwMDAwMDAAAAAQEBAwMDAAEBAAAAAwMDAgICAwMDAAAABAICAgAAAAAAAAEBAQEDAwMDAwMDAwMDAwMCAgIBAwMDAwMDAAEAAwMCAgICAgIAAAABAwAAAAAAAAADAQMAAwEAAZGRkY6OjgsLCywsLBcXF9L29snJyYODg1hYWJWVlQAAAAq1tbUDAwPNzc339/cjmpqap6amqqqqrKysT09PI42NjXx8fNH9I/j4WlpaXV1dAgICPfjIwMDAtbW1pz2GIq+PIys=",6,7,36,51,2.53,0.719,0.0273],[5,"Tier V • Campeão Soberano Ápice","AwMDAwMDAAAAAQEBAwMDAAEBAAAAAwMDAgICAwMDAAAABAICAgAAAAAAAAEBAQADAwMDAwMDAwMDAwMCAgIEAwMDAwMDAAEAAwMCAgICAgIAAAABBAAAAAAAAAADAQMAAwEAAZGRkY6OjgsLCywsLBcXF9L29snJyYODg1hYWJWVlQAAAAq1tbUDAwPNzc339/e9mpqap6amqqqqrKysT09PCI2NjXx8fNH9I/j4WlpaXV1dAgICPQTIwMDAtbW1pz2GIq+PIys=",9,7,35,49,2.69,0.828,0.0219]]
  },
  "dual_blue_neutral": {
    "archetypeId": "dual_blue_neutral",
    "domains": ["blue","neutral"],
    "isAxialAlliance": true,
    "triadId": "vortex_alliances",
    "name": "Aliança do Astrolábio Arcano",
    "subtitle": "Aliança ❄️+⚙️ • Controle Horológico, Alcance & Voo",
    "strategySummary": "Coordena Congelamento glacial e compra de cartas com artilharia de Alcance e Constructos de Escudo Divino da Matriz Axial.",
    "tacticalIdentity": "tempo",
    "coverCardId": "blue_81_arconte_cronos",
    "generationsEvolved": 20,
    "matchesSimulated": 7048,
    "seedWinRate": 0.488,
    "championWinRate": 0.55,
    "vsMonocolorWinRate": 0.656,
    "championDeckJaccardStability": 0.961,
    "medianCardCi95HalfWidth": 0.18,
    "domainCardBreakdown": {"blue":65,"neutral":35},
    "crossDomainCombos": [[54,1032,1,0.48,11," (100% WR em 11 duelos cruzados)"],[1035,54,0.938,0.388,16," (94% WR em 16 duelos cruzados)"],[811,1032,0.889,0.369,9," (89% WR em 9 duelos cruzados)"],[816,922,0.857,0.337,14," (86% WR em 14 duelos cruzados)"],[226,922,0.818,0.298,11," (82% WR em 11 duelos cruzados)"],[1035,942,0.818,0.298,11," (82% WR em 11 duelos cruzados)"]],
    "learnedProfile": {"deckId":"dual_blue_neutral","deckName":"Aliança do Astrolábio Arcano","archetypeTag":"tempo","generationsTrained":14,"matchesSimulated":6984,"baselineWinRate":0.488,"trainedWinRate":0.339,"weights":{"aggroFaceBias":1.07,"tradeValueBias":1.28,"guardianPriority":0.96,"flyingEvasionBias":1.28,"stackConsolidationBias":1,"antiAoeSpreadBias":1,"spellHoldPatience":1.21,"relicPriority":1,"ascensionEagerness":1,"bloodPactThresholdHp":24,"domainExpansionEagerness":0.98,"sovPowerTempoBias":1,"synergyHoldBonus":18,"mulliganCurveTarget":2.9},"mk":[37,47,892,591],"cp":[815,942,715,330,57,403,892,321,943,401],"ca":[37,54,58,189,226,816,892,922,942,1029,1032,1035],"hb":[[37,22.3],[54,19.5],[58,22],[189,24],[226,18.3],[811,7.4],[816,24],[892,16.4],[922,12.8],[942,15.7],[1029,22.3],[1032,22.6],[1035,24]],"sp":[[37,189],[69,189],[54,189],[816,189],[1035,892],[189,922],[1035,54],[189,892],[37,1035],[58,922]],"dc":[[54,1032,1,0.48,11," (100% WR em 11 duelos cruzados)"],[1035,54,0.938,0.388,16," (94% WR em 16 duelos cruzados)"],[811,1032,0.889,0.369,9," (89% WR em 9 duelos cruzados)"],[816,922,0.857,0.337,14," (86% WR em 14 duelos cruzados)"],[226,922,0.818,0.298,11," (82% WR em 11 duelos cruzados)"],[1035,942,0.818,0.298,11," (82% WR em 11 duelos cruzados)"]]},
    "topShapleyCards": [[1029,0.1932,-0.0218,0.2149,0.786,0.856,14],[1032,0.1752,0.029,0.1462,0.758,0.653,33],[1035,0.1594,0.0358,0.1236,0.735,0.51,49],[189,0.1391,-0.047,0.1861,0.727,0.768,22],[935,0.0745,-0.0011,0.0757,0.643,0.371,154],[37,0.0665,0.0144,0.0521,0.623,0.144,332],[54,0.0587,0.0008,0.058,0.621,0.246,269],[922,0.0438,-0.0401,0.0839,0.625,0.629,128],[226,0.042,-0.0692,0.1112,0.608,0.327,74],[892,0.0392,-0.0136,0.0528,0.596,0.149,332],[58,0.0391,-0.0442,0.0834,0.606,0.343,132],[816,0.0377,-0.0483,0.0861,0.605,0.347,124]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AAAAAwMDAwMDAgEBAQEAAAACAQEDAwMBAQECAgIAAgICAgAAAgICAgAAAAAAAAMDAAADAwMDAQEDAwMDAwEDAAAAAQEBAAAAAAAAAAMDAwEBAQAAAAACAgAAAAADAAADAAADA93d3Y2NjSsrK21BQZSUvr6+bZGRfHx8Pj4+T09P327IyG8v38htbm4mJia2trafn7W1rKyfm4iImpqam5uInCUlJUJCQjY2NjQ0Ly8uLi6Tk5PfRUVFb2/l5cDlLOjoLLU0LKw=",0,0,77,23,2.89,0.081,0.0165],[2,"Tier II • Guarnição Regular","AAAAAwMDAwMDAgEBAQEAAAACAQEDAwMBAQECAgIAAgICAQEAAgICAgAAAAAAAAMDAAADAwMDAQEDAwMDAwMDAAAAAQEBAAAAAAACAgMDAwEBAQAAAAACAgAAAAADAAADAAADA93d3Y2NjSsrK21BQZSUvr6+bZGRfHx8Pj4+T09P327IyEVF38htbm4mJia2trafn7W1rKyfm4iImpqam5unpyUlJUJCQjY2NjQ0y8suLi6Tk5PfRUVFb2/l5cDlLOjoLLU0LKw=",0,6,71,23,2.94,0.233,0.0275],[3,"Tier III • Bastião Veterano","AAAAAwMDAwMDAgEBAQEAAAACAQEDAwMBAQECAgIEAgAAAQEAAAICAQAAAAAAAAMDAAADAwMDAwMDAwMDAwMDAAAAAQEBAAAAAgICAgMDAwEBAQIAAAACAAEBAAEDAQADAAADA93d3Y2NjSsrK8hBQZSUvr6+yJGRfHx8Pj4+T09PC27f30VF4t/IbpgmJia2trafn7W1rKyfm+rqmpqam+OnpyUlJUJCQjY2Nm1ty8suLi6Tk5NuRUVFbTRKSsBPLE9HLLU0LKw=",3,14,60,23,3.08,0.574,0.0294],[4,"Tier IV • Elite do Alto Trono","AAAAAwMDAwMDAgEBAQEAAAACAQEDAwMBAQECAgIEBAIAAQEAAAACAQAAAAAAAAMDAQEAAwMAAwMDAwMDAwMDAAAAAQEBAAAAAgICAgMDAwEBAQIAAAADAwEBAAEDAQADAAADAN3d3Y2NjSsrK3BBQZSUvr6+cJGRfHx8Pj4+T09PCwVu30VF4t/fbpgmJia2trasrCvztayfxurqmpqa4+OnpyUlJUJCQjY2Ns3Ny8suLi6Tk5NuRUVF8/NKSsBPLE9HLLU0LLU=",6,22,49,23,3.31,0.773,0.026],[5,"Tier V • Campeão Soberano Ápice","AAAAAwMDAwMDAgEBAQEAAAACAQEDAwMBAQECAgIEBAMDAQEAAAADAQAAAAQAAQMDAQEDAwAAAwMDAwMDAwMDAAAAAQEBAAAAAgICAgMDAwEBAQAAAAADAwEBAAEDAQADAwADA93d3Y2NjSsrK3BBQZSUvr6+cJGRfHx8Pj4+T09PCwUwMEVF4jo6MZgmJiYIvY+vryvzrq7Gxurqmpqa4+OnpyUlJUJCQjY2Ns3Ny8suLi6Tk5MoRUVF8/NKSsBPLE9HLLA0LLA=",10,34,33,23,3.65,0.813,0.0237]]
  },
  "dual_purple_neutral": {
    "archetypeId": "dual_purple_neutral",
    "domains": ["purple","neutral"],
    "isAxialAlliance": true,
    "triadId": "eclipse_alliances",
    "name": "Aliança da Guilda das Máscaras",
    "subtitle": "Aliança 💀+⚙️ • Lâminas Letais, Dreno & Submundo Axial",
    "strategySummary": "Opera assassinos furtivos da Cidade Franca ao lado de lordes necróticos de Eclipse com Toque Letal, Dreno de Vida e reanimação.",
    "tacticalIdentity": "midrange",
    "coverCardId": "purple_47_avatar_escuridao",
    "generationsEvolved": 20,
    "matchesSimulated": 6840,
    "seedWinRate": 0.452,
    "championWinRate": 0.493,
    "vsMonocolorWinRate": 0.484,
    "championDeckJaccardStability": 1,
    "medianCardCi95HalfWidth": 0.0751,
    "domainCardBreakdown": {"purple":61,"neutral":39},
    "crossDomainCombos": [[922,246,0.929,0.466,14," (93% WR em 14 duelos cruzados)"],[189,736,0.909,0.447,11," (91% WR em 11 duelos cruzados)"],[922,1033,0.909,0.447,11," (91% WR em 11 duelos cruzados)"],[547,250,0.917,0.424,12," (92% WR em 12 duelos cruzados)"],[189,101,0.875,0.412,16," (88% WR em 16 duelos cruzados)"],[922,1027,0.875,0.412,8," (88% WR em 8 duelos cruzados)"]],
    "learnedProfile": {"deckId":"dual_purple_neutral","deckName":"Aliança da Guilda das Máscaras","archetypeTag":"midrange","generationsTrained":14,"matchesSimulated":6776,"baselineWinRate":0.452,"trainedWinRate":0.411,"weights":{"aggroFaceBias":1.21,"tradeValueBias":1.23,"guardianPriority":1,"flyingEvasionBias":1.04,"stackConsolidationBias":1,"antiAoeSpreadBias":1,"spellHoldPatience":1,"relicPriority":1,"ascensionEagerness":1,"bloodPactThresholdHp":19,"domainExpansionEagerness":1.03,"sovPowerTempoBias":1,"synergyHoldBonus":21,"mulliganCurveTarget":2.8},"mk":[922,913,591,101,294],"cp":[1009,99,962,93,995,839,832,916,547,733],"ca":[76,93,101,189,236,346,349,446,545,547,736,839],"hb":[[76,9.9],[93,10.9],[101,22.8],[189,24],[236,13.6],[346,24],[349,21.6],[446,22.2],[545,24],[547,19.5],[736,24],[834,9.5],[839,23.6],[913,24],[922,23.3],[1027,24],[1032,17.2],[1033,24]],"sp":[[736,1027],[1027,101],[736,839],[922,346],[545,101],[922,1033],[547,349],[189,236],[189,736],[189,349]],"dc":[[922,246,0.929,0.466,14," (93% WR em 14 duelos cruzados)"],[189,736,0.909,0.447,11," (91% WR em 11 duelos cruzados)"],[922,1033,0.909,0.447,11," (91% WR em 11 duelos cruzados)"],[547,250,0.917,0.424,12," (92% WR em 12 duelos cruzados)"],[189,101,0.875,0.412,16," (88% WR em 16 duelos cruzados)"],[922,1027,0.875,0.412,8," (88% WR em 8 duelos cruzados)"]]},
    "topShapleyCards": [[1027,0.3318,0.1598,0.172,0.867,0.847,15],[189,0.3081,0.1864,0.1217,0.833,0.654,36],[547,0.2349,0.1512,0.0837,0.76,0.652,100],[246,0.2235,0.0734,0.15,0.75,0.68,32],[1033,0.1791,-0.0027,0.1818,0.708,0.733,24],[349,0.1451,0.0574,0.0877,0.667,0.581,111],[446,0.1203,0.0069,0.1134,0.638,0.496,69],[1032,0.0964,-0.0714,0.1677,0.625,0.722,32],[545,0.0913,-0.058,0.1493,0.61,0.518,41],[839,0.0893,-0.0247,0.114,0.614,0.648,70],[76,0.0861,0.0213,0.0648,0.586,0.14,222],[736,0.0861,0.0207,0.0654,0.587,0.171,218]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AAAAAAACAgICAgIDAwMDAwMDAwMBAQEDAwAAAAMDAwMCAgIDAwMCAgIBAQEBAQEAAAACAAEDAwAAAAAAAAAAAAEBAQICAgICAgICAgMDAwMDAwMDAwAAAAAAAAAAAAAAAAAAAFNTU76+T09P29vbjY2NwsLClJSU8PDwQEBMTGNGoqKi3d3dQkJC39/fJiYmXFxc+Pj4iGTuSqZKSkpVVVXv7++2trYZGRkaGhoiIiKFhYWTk5OXl5dJSUliYmJkZGhoaLS0tL4=",0,4,32,64,2.61,0.036,0.0108],[2,"Tier II • Guarnição Regular","AAAAAAAAAAACAgICAgIDAwMDAwMDAwMBAQEDAwAAAAAAAwMCAgMDAwMCAgIDAwMCAgIBAQEBAQEAAAACAAEDAwADAwMBAQEAAAACAgAAAAAAAAEBAQICAgICAgICAgADAwMDA1NTU+zs7L6+T09P29vbjY2NwsLClJSU8PDwQEBMTF1dY0ZGHx+ioqKz3d3dQkJC39/fJiYmXFxc+Pj4iGTuSqZq9/f3VFRUtbW1iIhpaWlZWVlTU1McHBze3t4bGxtWoKCgl5c=",1,9,66,24,2.9,0.297,0.0299],[3,"Tier III • Bastião Veterano","AAAAAAAAAAACAgICAgIDAwMDAwMDAwMBAQEDAwEAAAAAAAMDAgIAAAMDAwMDAwMDAAICAgMDAwICAgEBAQEBAQAAAAIAAQMDAAICAwMDAAAAAQEBAAADAwAAAAMDAwAAAAEBAVNTU+zs7L6+T09P29vbjY2NwsLClJSU8PDwQEC+TExdXWNGRh8fxsavr+PjoqKis/bd3d1CQkLf398mJiZcXFz4+PiIZO5KpmqIiPf392lpaVRUVGRkSkpZWVmRkZG1tbXu7lM=",3,15,53,29,2.85,0.624,0.0299],[4,"Tier IV • Elite do Alto Trono","AAAAAAAAAAACAgICAgIDAwMDAwMDAwMBAQEDAwQCAQMDAAAAAAADAwICAAAABAAAAwMDAwMDAwMCAgIDAwMDAQEAAgICAQEBAQEBAAAAAgABAwMAAgIDAwMAAAABAQEAAAADA1NTU+zs7L6+T09P29vbjY2NwsLClJSU8PDwQEAJIb5HR0xMXV1jRkYfH2VlZQjGxq+v4+OioqKz3d3dQkJCsF5e+t/f3yYmJlxcXPj4+Ihk7kqmaoiI9/f3aWlpVFRUWVlZkZE=",5,21,50,24,3.14,0.761,0.0262],[5,"Tier V • Campeão Soberano Ápice","AAAAAAAAAAACAgICAgIDAwMDAwMDAwMBAQEDAwQBAgEEAwMAAAAAAAMDAgICAgAAAAMDAwQAAAADAwMDAwMDAwACAgIDAwMDAQEAAAEBAgICAgIBAQEBAQEAAAACAAEDAwACA1NTU+zs7L6+T09P29vbjY2NwsLClJSU8PDwQEAJWiG+A0dHTExdXWNGRuDgHx9lZWWampoIvcbGr6/j46KiorP23d3dQkJCsF5e+vpdXSMj39/fJiYmXFxc+Pj4iGTuSqZj5bA=",10,30,38,22,3.48,0.773,0.0253]]
  },
  "dual_gold_neutral": {
    "archetypeId": "dual_gold_neutral",
    "domains": ["gold","neutral"],
    "isAxialAlliance": true,
    "triadId": "solaria_alliances",
    "name": "Aliança do Bastião Relojoeiro",
    "subtitle": "Aliança ☀️+⚙️ • Falange de Ferro Meteórico & Escudo Real",
    "strategySummary": "Alinha Guardiões Imperiais de Solária e Golens Relojoeiros com Armadura pesada, Escudo Divino global e contra-ataques disciplinados.",
    "tacticalIdentity": "midrange",
    "coverCardId": "neutral_118_volothamp_cronista_mundos",
    "generationsEvolved": 20,
    "matchesSimulated": 6952,
    "seedWinRate": 0.44,
    "championWinRate": 0.532,
    "vsMonocolorWinRate": 0.625,
    "championDeckJaccardStability": 0.961,
    "medianCardCi95HalfWidth": 0.0451,
    "domainCardBreakdown": {"gold":66,"neutral":34},
    "crossDomainCombos": [[780,983,1,0.498,8," (100% WR em 8 duelos cruzados)"],[428,913,0.929,0.426,14," (93% WR em 14 duelos cruzados)"],[935,942,0.944,0.412,18," (94% WR em 18 duelos cruzados)"],[1037,935,0.9,0.398,10," (90% WR em 10 duelos cruzados)"],[880,910,0.9,0.398,10," (90% WR em 10 duelos cruzados)"],[576,983,0.9,0.398,10," (90% WR em 10 duelos cruzados)"]],
    "learnedProfile": {"deckId":"dual_gold_neutral","deckName":"Aliança do Bastião Relojoeiro","archetypeTag":"midrange","generationsTrained":14,"matchesSimulated":6888,"baselineWinRate":0.44,"trainedWinRate":0.321,"weights":{"aggroFaceBias":1.04,"tradeValueBias":1.28,"guardianPriority":1.4,"flyingEvasionBias":1,"stackConsolidationBias":1,"antiAoeSpreadBias":1,"spellHoldPatience":1,"relicPriority":1.14,"ascensionEagerness":1,"bloodPactThresholdHp":24,"domainExpansionEagerness":1.02,"sovPowerTempoBias":0.99,"synergyHoldBonus":20,"mulliganCurveTarget":2.9},"mk":[278,913,910,272,784,157,922],"cp":[576,157,942,944,272,432,875,943,578,680],"ca":[171,189,272,278,381,421,428,576,682,784,880,910],"hb":[[147,5.9],[157,9.1],[171,17],[189,24],[272,16.7],[278,19.4],[381,19.3],[421,11.9],[428,20.6],[576,13],[678,8.1],[682,20.8],[784,24],[880,20.2],[910,21.6],[913,18.6],[922,20.2],[935,16],[942,20.8],[983,24],[1031,24],[1032,24],[1037,23.3]],"sp":[[381,189],[278,189],[784,189],[784,983],[189,910],[942,983],[874,1032],[272,983],[171,983],[678,171]],"dc":[[780,983,1,0.498,8," (100% WR em 8 duelos cruzados)"],[428,913,0.929,0.426,14," (93% WR em 14 duelos cruzados)"],[935,942,0.944,0.412,18," (94% WR em 18 duelos cruzados)"],[1037,935,0.9,0.398,10," (90% WR em 10 duelos cruzados)"],[880,910,0.9,0.398,10," (90% WR em 10 duelos cruzados)"],[576,983,0.9,0.398,10," (90% WR em 10 duelos cruzados)"]]},
    "topShapleyCards": [[934,0.4212,0.3335,0.0877,1,0.93,5],[880,0.2268,0.0244,0.2024,0.8,0.817,15],[189,0.2249,-0.023,0.2479,0.8,0.855,10],[428,0.1761,0.0361,0.14,0.737,0.568,38],[1037,0.1517,-0.0157,0.1673,0.714,0.606,28],[935,0.1495,0.0844,0.065,0.691,0.178,194],[983,0.1428,0.0398,0.103,0.707,0.631,75],[157,0.1118,-0.0566,0.1684,0.69,0.911,29],[913,0.107,0.0522,0.0548,0.647,0.159,292],[784,0.0886,0.0238,0.0648,0.626,0.105,214],[178,0.0626,-0.0769,0.1395,0.63,0.711,46],[682,0.056,-0.1206,0.1766,0.621,0.646,29]],
    "tierDecks": [[1,"Tier I • Patrulha de Fronteira","AQEBAwMDAQEBAQEDAwMDAwEBAQMDAwEBAQMDAwMAAAMAAQEBAgMAAQAAAAAAAwMAAAMDAwMDAwMDAwMDAwMDAwMDAwMBAQICAwMDAwMDAwAAAQEBAQECAgIAAAADAwMDAQEDALCwsBERERsbdXV1wsKRkZEQEBCOjo6lpaV8fHwEkpIEkhYWFkEHoaeTk5OfoZiYu7uYpqymo6OjmpqapoaGhqysoKCgp6dBQWtrawcHBQWfnxQUFxcXQEBAnZ2dampqBRQbBKE=",0,0,79,21,2.88,0.02,0.0096],[2,"Tier II • Guarnição Regular","AQEBAwMDAQEBAQEDAwMDAwEBAQMDAwEBAQMDAwMAAAMAAQEBAgMAAQAAAAAAAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMBAQICAwMDAwMDAwAAAQEBAQECAgIAAAADAwMAAAEDALCwsBERERsbdXV1wsKRkZEQEBCOjo6lpaV8fHwEkpIEkhYWFkEHoaeTk5OfoZiYp6eYpqymo6Ojmpqapoavr6ysoKCgp6dBQWtrawcHBQWfnxQUFxcXQEBAnZ2dampqmZkbBKE=",0,6,75,19,2.9,0.278,0.029],[3,"Tier III • Bastião Veterano","AQEBAwMDAQEBAQEDAwMDAwEBAQMDAwEBAQMDAwQAAAMAAQEBAgIAAAAAAAAAAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMAAQEBAwMDAwMCAgMDAQEBAQECAgIAAAADAwMAAAEBALCwsBERERsbdXV1wsKRkZEQEBCOjo6lpaV8fHwNkpIEkhYWFkFBoaGTk5Ofn5iYp6ezpq6uo6Ojmpqa19evr5isoKCgoaenp2tra21tQkIEBBQUFxcXQEBAnZ2dampqmZkbrJ8=",3,14,65,18,3.1,0.615,0.0291],[4,"Tier IV • Elite do Alto Trono","AQEBAwMDAQEBAQEDAwMDAwEBAQMDAwEBAQMDAwQAAAICAQEBAgIAAAAAAAMDBAMDAwMDAwMDAwMDAwMDAwMDAAADAwMDAwEBAwMDAwMCAgADAQEBAQECAgIAAAADAwMAAAEBALCwsBERERsbdXV1wsKRkZEQEBCOjo6lpaV8fHwNkpKqRBYWFqamn5+Tk5MEBAiYp6ezpq6uo6Ojmpqa19evr8bGoKCgDAx9fWtra21tQkKSBBQUFxcXQEBAnZ2dampqmZkbrJ8=",6,22,54,18,3.25,0.775,0.0248],[5,"Tier V • Campeão Soberano Ápice","AQEBAwMDAAABAQEDAwMDAwEBAQMDAwEBAQMDAwQDBAICAQEBAgIDAwAAAAICBAADAwMDAwMDAwMDAwMDAwMDAAADAwMDAwEBAwMDAwMCAgMDAQEBAQECAgIAAAADAwMAAAABALCwsBEREaurdXV1wsKRkZEQEBCOjo6lpaV8fHwNcAeqRBYWFqamEBCTk5OoqAi9p6ezpq6uo6Ojmpqa19evr8bGoKCgDAx9fWtra21tQkJvbxQUFxcXQEBAnZ2dampqmZmyrLI=",9,32,41,18,3.51,0.831,0.0225]]
  }
});
