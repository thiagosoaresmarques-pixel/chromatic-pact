import { Domain } from '../types/game';
import type { MonocolorArchetypeId } from './aiMonocolorMasteryData';
import type { BicolorArchetypeId } from './aiBicolorMasteryData';
import type { PolycolorArchetypeId } from './aiPolycolorMasteryData';

/**
 * GERADO AUTOMATICAMENTE POR src/scripts/runEloCalibrationLeague.ts
 * Grande Torneio Unificado de Vaeloria (44 × 43 Campeões Tier V): 45408 duelos Beam Search (189.4s em 10 threads)
 * Margem de Erro Máxima IC 95% por Campeão: ±2.28%
 */

export type UnifiedFormatKind = 'monocolor' | 'bicolor' | 'tricolor' | 'pentachromatic';
export type UnifiedChampionId =
  | MonocolorArchetypeId
  | BicolorArchetypeId
  | PolycolorArchetypeId;

export interface UnifiedMatchupSnippet {
  opponentId: UnifiedChampionId;
  winRate: number;
  games: number;
}

export interface UnifiedChampionStanding {
  rank: number;
  archetypeId: UnifiedChampionId;
  name: string;
  subtitle: string;
  format: UnifiedFormatKind;
  domains: Domain[];
  coverCardId: string;
  classicDeckIds: string[];
  tierBadge: 'S' | 'A' | 'B';
  overallWinRate: number;
  ci95HalfWidth: number;
  matchesPlayed: number;
  vsFormatWinRates: Record<UnifiedFormatKind, number>;
  bestMatchups: UnifiedMatchupSnippet[];
  worstMatchups: UnifiedMatchupSnippet[];
}

export interface PatchedCardTournamentMetric {
  cardId: string;
  cardName: string;
  domain: Domain;
  cost: number;
  playedGames: number;
  playedWinRate: number;
}

export interface UnifiedTournamentSummary {
  generatedAt: string;
  totalChampions: number;
  totalUnorderedPairs: number;
  totalMatchesSimulated: number;
  numWorkers: number;
  elapsedSeconds: number;
  maxChampionCi95HalfWidth: number;
  convergedByMargin: boolean;
  tierCounts: { S: number; A: number; B: number };
  formatEcologyMatrix: Record<
    UnifiedFormatKind,
    {
      overallWinRate: number;
      totalGames: number;
      vsFormat: Record<UnifiedFormatKind, number>;
    }
  >;
  patchedCardsAudit: PatchedCardTournamentMetric[];
}

export const UNIFIED_TOURNAMENT_SUMMARY: UnifiedTournamentSummary = {
  "generatedAt": "2026-11-01T04:01:51.862Z",
  "totalChampions": 44,
  "totalUnorderedPairs": 946,
  "totalMatchesSimulated": 45408,
  "numWorkers": 10,
  "elapsedSeconds": 189.4,
  "maxChampionCi95HalfWidth": 0.0228,
  "convergedByMargin": true,
  "tierCounts": {
    "S": 18,
    "A": 12,
    "B": 14
  },
  "formatEcologyMatrix": {
    "monocolor": {
      "overallWinRate": 0.3712,
      "totalGames": 33024,
      "vsFormat": {
        "monocolor": 0.5,
        "bicolor": 0.3153,
        "tricolor": 0.2861,
        "pentachromatic": 0.2899
      }
    },
    "bicolor": {
      "overallWinRate": 0.5606,
      "totalGames": 30960,
      "vsFormat": {
        "monocolor": 0.6847,
        "bicolor": 0.5,
        "tricolor": 0.4671,
        "pentachromatic": 0.4931
      }
    },
    "tricolor": {
      "overallWinRate": 0.5927,
      "totalGames": 20640,
      "vsFormat": {
        "monocolor": 0.7139,
        "bicolor": 0.5329,
        "tricolor": 0.5,
        "pentachromatic": 0.5229
      }
    },
    "pentachromatic": {
      "overallWinRate": 0.5753,
      "totalGames": 6192,
      "vsFormat": {
        "monocolor": 0.7101,
        "bicolor": 0.5069,
        "tricolor": 0.4771,
        "pentachromatic": 0.5
      }
    }
  },
  "patchedCardsAudit": [
    {
      "cardId": "neutral_10_valkyra_pentacromatica",
      "cardName": "Valkyra, Imperatriz Pentacromática",
      "domain": "neutral",
      "cost": 8,
      "playedGames": 431,
      "playedWinRate": 0.8097
    },
    {
      "cardId": "red_76_salamandra_vapor",
      "cardName": "Serpente de Vapor Superaquecido",
      "domain": "red",
      "cost": 3,
      "playedGames": 3128,
      "playedWinRate": 0.4696
    },
    {
      "cardId": "red_55_diabrete_forja",
      "cardName": "Diabrete Soprador de Brasas",
      "domain": "red",
      "cost": 1,
      "playedGames": 8687,
      "playedWinRate": 0.575
    },
    {
      "cardId": "red_109_diabrete_fornalha",
      "cardName": "Diabrete da Fornalha",
      "domain": "red",
      "cost": 1,
      "playedGames": 2022,
      "playedWinRate": 0.5554
    },
    {
      "cardId": "neutral_88_espada_voadora_runica",
      "cardName": "Gládio Levitante do Salão",
      "domain": "neutral",
      "cost": 1,
      "playedGames": 713,
      "playedWinRate": 0.7349
    },
    {
      "cardId": "neutral_52_mercenario_planar",
      "cardName": "Mercenário das Lâminas Planais",
      "domain": "neutral",
      "cost": 2,
      "playedGames": 12294,
      "playedWinRate": 0.5777
    },
    {
      "cardId": "gold_32_estandarte_imperial",
      "cardName": "Estandarte da Legião Dourada",
      "domain": "gold",
      "cost": 4,
      "playedGames": 804,
      "playedWinRate": 0.6592
    },
    {
      "cardId": "gold_04_armadura_conjurada",
      "cardName": "Sentinela de Elmo Arcano",
      "domain": "gold",
      "cost": 3,
      "playedGames": 8373,
      "playedWinRate": 0.5491
    },
    {
      "cardId": "gold_02_gargula",
      "cardName": "Gárgula da Catedral Solar",
      "domain": "gold",
      "cost": 2,
      "playedGames": 4566,
      "playedWinRate": 0.5112
    },
    {
      "cardId": "gold_157_dragao_soberano_alvorada",
      "cardName": "Aurelius, Soberano Dragão da Alvorada",
      "domain": "gold",
      "cost": 8,
      "playedGames": 489,
      "playedWinRate": 0.8057
    },
    {
      "cardId": "blue_153_leviata_fenda_abissal",
      "cardName": "Zephyrus, Monarca do Ciclone",
      "domain": "blue",
      "cost": 6,
      "playedGames": 4169,
      "playedWinRate": 0.6397
    },
    {
      "cardId": "green_68_zaratan_ilha",
      "cardName": "Chelonia, A Tartaruga-Continente",
      "domain": "green",
      "cost": 7,
      "playedGames": 92,
      "playedWinRate": 0.5109
    },
    {
      "cardId": "red_167_arauto_prisma_chama",
      "cardName": "Arauto da Supernova Prismática",
      "domain": "red",
      "cost": 5,
      "playedGames": 0,
      "playedWinRate": 0.5
    },
    {
      "cardId": "blue_167_arauto_prisma_gelo",
      "cardName": "Arauto do Zero Prismático",
      "domain": "blue",
      "cost": 5,
      "playedGames": 0,
      "playedWinRate": 0.5
    },
    {
      "cardId": "purple_167_arauto_prisma_abismo",
      "cardName": "Arauto do Eclipse Prismático",
      "domain": "purple",
      "cost": 5,
      "playedGames": 152,
      "playedWinRate": 0.4868
    },
    {
      "cardId": "green_167_arauto_prisma_selva",
      "cardName": "Arauto da Raiz Prismática",
      "domain": "green",
      "cost": 5,
      "playedGames": 130,
      "playedWinRate": 0.4308
    },
    {
      "cardId": "gold_167_arauto_prisma_sol",
      "cardName": "Arauto do Zênite Prismático",
      "domain": "gold",
      "cost": 5,
      "playedGames": 137,
      "playedWinRate": 0.4307
    },
    {
      "cardId": "neutral_167_arauto_prisma_matriz",
      "cardName": "Matriz do Prisma Primordial",
      "domain": "neutral",
      "cost": 5,
      "playedGames": 0,
      "playedWinRate": 0.5
    },
    {
      "cardId": "blue_44_dragao_prateado",
      "cardName": "Aureon, Dragão da Geada Astral",
      "domain": "blue",
      "cost": 6,
      "playedGames": 0,
      "playedWinRate": 0.5
    },
    {
      "cardId": "gold_05_automato_guardiao",
      "cardName": "Autômato Égide da Cidadela",
      "domain": "gold",
      "cost": 4,
      "playedGames": 0,
      "playedWinRate": 0.5
    },
    {
      "cardId": "purple_19_conde_vampiro",
      "cardName": "Nosferatu, Soberano Carmesim",
      "domain": "purple",
      "cost": 5,
      "playedGames": 141,
      "playedWinRate": 0.6028
    },
    {
      "cardId": "purple_23_dracolich",
      "cardName": "Ossaurion, Dragão-Ossário Eterno",
      "domain": "purple",
      "cost": 7,
      "playedGames": 170,
      "playedWinRate": 0.8882
    },
    {
      "cardId": "purple_96_abominacao_costurada",
      "cardName": "Colosso de Carne Costurada",
      "domain": "purple",
      "cost": 4,
      "playedGames": 0,
      "playedWinRate": 0.5
    },
    {
      "cardId": "purple_97_arquidemonio_sombras",
      "cardName": "Malphas, O Arquidemônio das Sombras",
      "domain": "purple",
      "cost": 5,
      "playedGames": 180,
      "playedWinRate": 0.4389
    },
    {
      "cardId": "green_75_druida_ciclos",
      "cardName": "Guardião das Quatro Estações",
      "domain": "green",
      "cost": 2,
      "playedGames": 237,
      "playedWinRate": 0.3038
    },
    {
      "cardId": "neutral_35_colosso_adamantina",
      "cardName": "Titã Forjado em Adamantina",
      "domain": "neutral",
      "cost": 6,
      "playedGames": 0,
      "playedWinRate": 0.5
    },
    {
      "cardId": "neutral_172_armada_draconica_matriz",
      "cardName": "Armada Dracônica do Prisma",
      "domain": "neutral",
      "cost": 7,
      "playedGames": 0,
      "playedWinRate": 0.5
    },
    {
      "cardId": "purple_07_lich",
      "cardName": "Vesperion, Arquimago Lich Imortal",
      "domain": "purple",
      "cost": 6,
      "playedGames": 0,
      "playedWinRate": 0.5
    },
    {
      "cardId": "blue_171_pactuario_elemental_gelo",
      "cardName": "Pactuário do Espírito Glacial",
      "domain": "blue",
      "cost": 4,
      "playedGames": 205,
      "playedWinRate": 0.3317
    },
    {
      "cardId": "blue_168_tecelao_feixe_gelo",
      "cardName": "Tecelão do Feixe Astral",
      "domain": "blue",
      "cost": 3,
      "playedGames": 944,
      "playedWinRate": 0.3845
    },
    {
      "cardId": "purple_20_tecelao_profano",
      "cardName": "Aracnomante das Cavernas",
      "domain": "purple",
      "cost": 4,
      "playedGames": 711,
      "playedWinRate": 0.5387
    },
    {
      "cardId": "blue_17_bruxa_mar",
      "cardName": "Megera da Escuma Negra",
      "domain": "blue",
      "cost": 3,
      "playedGames": 1303,
      "playedWinRate": 0.5257
    },
    {
      "cardId": "neutral_106_reen_assassino_relojoeiro",
      "cardName": "Reen, Ceifador de Engrenagens",
      "domain": "neutral",
      "cost": 4,
      "playedGames": 3974,
      "playedWinRate": 0.695
    },
    {
      "cardId": "neutral_168_tecelao_feixe_matriz",
      "cardName": "Tecelão do Feixe Primordial",
      "domain": "neutral",
      "cost": 3,
      "playedGames": 0,
      "playedWinRate": 0.5
    },
    {
      "cardId": "green_46_ent_anciao",
      "cardName": "Carvalho-Mestre de Mil Invernos",
      "domain": "green",
      "cost": 5,
      "playedGames": 586,
      "playedWinRate": 0.4608
    },
    {
      "cardId": "green_116_ent_espinheiro_anciao",
      "cardName": "Ent Espinheiro Ancião",
      "domain": "green",
      "cost": 5,
      "playedGames": 123,
      "playedWinRate": 0.3902
    }
  ]
};

export const UNIFIED_CHAMPION_STANDINGS: UnifiedChampionStanding[] = [
  {
    "rank": 1,
    "archetypeId": "tri_red_blue_gold",
    "name": "Conclave da Chama Celeste",
    "subtitle": "Tríade ☀️+🔥+❄️ • Esquadra Aérea, Escudo Divino & Feitiçaria",
    "format": "tricolor",
    "domains": [
      "gold",
      "red",
      "blue"
    ],
    "coverCardId": "red_173_general_roda_chama",
    "classicDeckIds": [],
    "tierBadge": "S",
    "overallWinRate": 0.7476,
    "ci95HalfWidth": 0.0193,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.8529,
      "bicolor": 0.6861,
      "tricolor": 0.6736,
      "pentachromatic": 0.7153
    },
    "bestMatchups": [
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.9792,
        "games": 48
      },
      {
        "opponentId": "mono_red_dragon",
        "winRate": 0.9583,
        "games": 48
      },
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.9167,
        "games": 48
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.9167,
        "games": 48
      },
      {
        "opponentId": "mono_gold_celestial",
        "winRate": 0.9167,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.5,
        "games": 48
      },
      {
        "opponentId": "dual_green_neutral",
        "winRate": 0.5208,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.5625,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_green",
        "winRate": 0.5833,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.5833,
        "games": 48
      }
    ]
  },
  {
    "rank": 2,
    "archetypeId": "dual_red_neutral",
    "name": "Aliança da Artilharia de Mercúrio",
    "subtitle": "Aliança 🔥+⚙️ • Tropas de Choque & Assassinos Relojoeiros",
    "format": "bicolor",
    "domains": [
      "red",
      "neutral"
    ],
    "coverCardId": "red_173_general_roda_chama",
    "classicDeckIds": [],
    "tierBadge": "S",
    "overallWinRate": 0.7156,
    "ci95HalfWidth": 0.0201,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.8229,
      "bicolor": 0.6637,
      "tricolor": 0.6354,
      "pentachromatic": 0.6528
    },
    "bestMatchups": [
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.9375,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.9167,
        "games": 48
      },
      {
        "opponentId": "mono_blue_chrono",
        "winRate": 0.875,
        "games": 48
      },
      {
        "opponentId": "mono_purple_crypt",
        "winRate": 0.875,
        "games": 48
      },
      {
        "opponentId": "mono_purple_umbral",
        "winRate": 0.875,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "dual_purple_green",
        "winRate": 0.4583,
        "games": 48
      },
      {
        "opponentId": "tri_purple_green_gold",
        "winRate": 0.4792,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.5,
        "games": 48
      },
      {
        "opponentId": "dual_purple_gold",
        "winRate": 0.5,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.5208,
        "games": 48
      }
    ]
  },
  {
    "rank": 3,
    "archetypeId": "tri_red_purple_green",
    "name": "Corte da Lua Sangrenta",
    "subtitle": "Tríade 🔥+💀+🌿 • Frenesi Predatório, Cripta & Atropelar",
    "format": "tricolor",
    "domains": [
      "red",
      "purple",
      "green"
    ],
    "coverCardId": "purple_65_principe_mortos",
    "classicDeckIds": [
      "deck_tri_blood_moon"
    ],
    "tierBadge": "S",
    "overallWinRate": 0.6977,
    "ci95HalfWidth": 0.0197,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.7969,
      "bicolor": 0.6472,
      "tricolor": 0.6111,
      "pentachromatic": 0.6806
    },
    "bestMatchups": [
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.9167,
        "games": 48
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.8958,
        "games": 48
      },
      {
        "opponentId": "mono_purple_crypt",
        "winRate": 0.875,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.8542,
        "games": 48
      },
      {
        "opponentId": "mono_green_swarm",
        "winRate": 0.8333,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.4375,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.4792,
        "games": 48
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.4792,
        "games": 48
      },
      {
        "opponentId": "dual_gold_neutral",
        "winRate": 0.5833,
        "games": 48
      },
      {
        "opponentId": "penta_wheel_convergence",
        "winRate": 0.6042,
        "games": 48
      }
    ]
  },
  {
    "rank": 4,
    "archetypeId": "tri_red_purple_gold",
    "name": "Eclipse do Sol Carmesim",
    "subtitle": "Tríade ☀️+🔥+💀 • Serafins Sanguinários, Dreno & Artilharia",
    "format": "tricolor",
    "domains": [
      "gold",
      "red",
      "purple"
    ],
    "coverCardId": "gold_99_serafim_coroado",
    "classicDeckIds": [
      "deck_tri_crimson_sun"
    ],
    "tierBadge": "S",
    "overallWinRate": 0.6667,
    "ci95HalfWidth": 0.021,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.7956,
      "bicolor": 0.5958,
      "tricolor": 0.5671,
      "pentachromatic": 0.6319
    },
    "bestMatchups": [
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.9583,
        "games": 48
      },
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.9167,
        "games": 48
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.8542,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.8333,
        "games": 48
      },
      {
        "opponentId": "mono_purple_crypt",
        "winRate": 0.8333,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "dual_red_green",
        "winRate": 0.375,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.4167,
        "games": 48
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.4167,
        "games": 48
      },
      {
        "opponentId": "dual_red_gold",
        "winRate": 0.4375,
        "games": 48
      },
      {
        "opponentId": "tri_purple_green_gold",
        "winRate": 0.5,
        "games": 48
      }
    ]
  },
  {
    "rank": 5,
    "archetypeId": "dual_red_gold",
    "name": "Pacto das Escamas Imperiais",
    "subtitle": "Pacto Duplo 🔥+☀️ • Dragões Solares & Escudo Divino",
    "format": "bicolor",
    "domains": [
      "red",
      "gold"
    ],
    "coverCardId": "red_173_general_roda_chama",
    "classicDeckIds": [
      "deck_dual_draconic_pact"
    ],
    "tierBadge": "S",
    "overallWinRate": 0.6192,
    "ci95HalfWidth": 0.0219,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.7122,
      "bicolor": 0.5789,
      "tricolor": 0.5208,
      "pentachromatic": 0.6389
    },
    "bestMatchups": [
      {
        "opponentId": "dual_purple_neutral",
        "winRate": 0.8542,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.8333,
        "games": 48
      },
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.8125,
        "games": 48
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.8125,
        "games": 48
      },
      {
        "opponentId": "mono_red_dragon",
        "winRate": 0.7708,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.2917,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.375,
        "games": 48
      },
      {
        "opponentId": "tri_purple_green_gold",
        "winRate": 0.4375,
        "games": 48
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.4583,
        "games": 48
      },
      {
        "opponentId": "dual_blue_green",
        "winRate": 0.4792,
        "games": 48
      }
    ]
  },
  {
    "rank": 6,
    "archetypeId": "dual_green_neutral",
    "name": "Aliança dos Engenhos Silvestres",
    "subtitle": "Aliança 🌿+⚙️ • Colossos de Madeira-Ferro & Guildas Axiais",
    "format": "bicolor",
    "domains": [
      "green",
      "neutral"
    ],
    "coverCardId": "green_173_general_roda_selva",
    "classicDeckIds": [],
    "tierBadge": "S",
    "overallWinRate": 0.6066,
    "ci95HalfWidth": 0.0218,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.7227,
      "bicolor": 0.5536,
      "tricolor": 0.5208,
      "pentachromatic": 0.5208
    },
    "bestMatchups": [
      {
        "opponentId": "mono_purple_umbral",
        "winRate": 0.8542,
        "games": 48
      },
      {
        "opponentId": "mono_blue_chrono",
        "winRate": 0.7917,
        "games": 48
      },
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.7917,
        "games": 48
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.7917,
        "games": 48
      },
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.7708,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.3125,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.375,
        "games": 48
      },
      {
        "opponentId": "tri_purple_green_gold",
        "winRate": 0.4167,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.4583,
        "games": 48
      },
      {
        "opponentId": "tri_blue_green_gold",
        "winRate": 0.4583,
        "games": 48
      }
    ]
  },
  {
    "rank": 7,
    "archetypeId": "tri_purple_green_gold",
    "name": "Armada do Zênite Umbral",
    "subtitle": "Tríade ☀️+🌿+💀 • Bastião Imortal, Regeneração & Renascer",
    "format": "tricolor",
    "domains": [
      "gold",
      "green",
      "purple"
    ],
    "coverCardId": "gold_172_armada_draconica_sol",
    "classicDeckIds": [],
    "tierBadge": "S",
    "overallWinRate": 0.5998,
    "ci95HalfWidth": 0.0217,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.7253,
      "bicolor": 0.5556,
      "tricolor": 0.4954,
      "pentachromatic": 0.4653
    },
    "bestMatchups": [
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.8958,
        "games": 48
      },
      {
        "opponentId": "mono_gold_judgment",
        "winRate": 0.8542,
        "games": 48
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.8333,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.7917,
        "games": 48
      },
      {
        "opponentId": "mono_purple_umbral",
        "winRate": 0.7917,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.3333,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.3333,
        "games": 48
      },
      {
        "opponentId": "penta_wheel_convergence",
        "winRate": 0.4375,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_green",
        "winRate": 0.4375,
        "games": 48
      },
      {
        "opponentId": "dual_blue_green",
        "winRate": 0.4375,
        "games": 48
      }
    ]
  },
  {
    "rank": 8,
    "archetypeId": "penta_prismatic_crater",
    "name": "Soberania da Cratera Prismática",
    "subtitle": "Ápice Pentacromático 🔥❄️💀🌿☀️ • Dragões do Prisma & Primeira Fratura",
    "format": "pentachromatic",
    "domains": [
      "red",
      "blue",
      "purple",
      "green",
      "gold"
    ],
    "coverCardId": "neutral_167_arauto_prisma_matriz",
    "classicDeckIds": [
      "deck_spec_pentachromatic"
    ],
    "tierBadge": "S",
    "overallWinRate": 0.5984,
    "ci95HalfWidth": 0.0218,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.7057,
      "bicolor": 0.5486,
      "tricolor": 0.5188,
      "pentachromatic": 0.5104
    },
    "bestMatchups": [
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.8333,
        "games": 48
      },
      {
        "opponentId": "mono_gold_celestial",
        "winRate": 0.8333,
        "games": 48
      },
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.8125,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.8125,
        "games": 48
      },
      {
        "opponentId": "mono_gold_phalanx",
        "winRate": 0.7708,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.3125,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.3125,
        "games": 48
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.375,
        "games": 48
      },
      {
        "opponentId": "dual_red_gold",
        "winRate": 0.375,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.4375,
        "games": 48
      }
    ]
  },
  {
    "rank": 9,
    "archetypeId": "dual_red_green",
    "name": "Pacto da Ruína Selvagem",
    "subtitle": "Pacto Duplo 🔥+🌿 • Rampa Vulcânica, Ímpeto & Atropelar",
    "format": "bicolor",
    "domains": [
      "red",
      "green"
    ],
    "coverCardId": "red_173_general_roda_chama",
    "classicDeckIds": [
      "deck_dual_primal_fury"
    ],
    "tierBadge": "S",
    "overallWinRate": 0.5906,
    "ci95HalfWidth": 0.0214,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.6966,
      "bicolor": 0.5357,
      "tricolor": 0.5104,
      "pentachromatic": 0.5486
    },
    "bestMatchups": [
      {
        "opponentId": "mono_blue_chrono",
        "winRate": 0.7917,
        "games": 48
      },
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.7917,
        "games": 48
      },
      {
        "opponentId": "mono_purple_umbral",
        "winRate": 0.7917,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.7708,
        "games": 48
      },
      {
        "opponentId": "dual_purple_neutral",
        "winRate": 0.7708,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.2917,
        "games": 48
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.2917,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_green",
        "winRate": 0.3333,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.3958,
        "games": 48
      },
      {
        "opponentId": "dual_red_purple",
        "winRate": 0.4167,
        "games": 48
      }
    ]
  },
  {
    "rank": 10,
    "archetypeId": "tri_red_blue_green",
    "name": "Tempestade Elemental Primeva",
    "subtitle": "Tríade 🔥+🌿+❄️ • Rampa Relâmpago, Leviatãs & Sopro Glacial",
    "format": "tricolor",
    "domains": [
      "red",
      "green",
      "blue"
    ],
    "coverCardId": "green_173_general_roda_selva",
    "classicDeckIds": [],
    "tierBadge": "S",
    "overallWinRate": 0.5833,
    "ci95HalfWidth": 0.022,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.6797,
      "bicolor": 0.5361,
      "tricolor": 0.5116,
      "pentachromatic": 0.5208
    },
    "bestMatchups": [
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.8333,
        "games": 48
      },
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.7917,
        "games": 48
      },
      {
        "opponentId": "mono_green_swarm",
        "winRate": 0.7708,
        "games": 48
      },
      {
        "opponentId": "mono_gold_phalanx",
        "winRate": 0.75,
        "games": 48
      },
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.7292,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.2917,
        "games": 48
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.3125,
        "games": 48
      },
      {
        "opponentId": "penta_prismatic_crater",
        "winRate": 0.4167,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.4167,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.4167,
        "games": 48
      }
    ]
  },
  {
    "rank": 11,
    "archetypeId": "dual_blue_green",
    "name": "Pacto da Evolução Quimérica",
    "subtitle": "Pacto Duplo ❄️+🌿 • Rampa Arcana, Compra & Leviatãs",
    "format": "bicolor",
    "domains": [
      "blue",
      "green"
    ],
    "coverCardId": "blue_173_general_roda_gelo",
    "classicDeckIds": [
      "deck_dual_wild_evolution"
    ],
    "tierBadge": "S",
    "overallWinRate": 0.5814,
    "ci95HalfWidth": 0.0224,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.6966,
      "bicolor": 0.5238,
      "tricolor": 0.5083,
      "pentachromatic": 0.4792
    },
    "bestMatchups": [
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.9167,
        "games": 48
      },
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.8542,
        "games": 48
      },
      {
        "opponentId": "mono_gold_judgment",
        "winRate": 0.8542,
        "games": 48
      },
      {
        "opponentId": "mono_purple_crypt",
        "winRate": 0.7917,
        "games": 48
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.7917,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.25,
        "games": 48
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.2708,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.3125,
        "games": 48
      },
      {
        "opponentId": "penta_prismatic_crater",
        "winRate": 0.3542,
        "games": 48
      },
      {
        "opponentId": "dual_red_green",
        "winRate": 0.375,
        "games": 48
      }
    ]
  },
  {
    "rank": 12,
    "archetypeId": "tri_red_green_gold",
    "name": "Tríade dos Titãs da Forja Primordial",
    "subtitle": "Tríade 🔥+🌿+☀️ • Rampa Colossal, Escudo Divino & Sopro Dracônico",
    "format": "tricolor",
    "domains": [
      "red",
      "green",
      "gold"
    ],
    "coverCardId": "green_67_tiranossauro_alfa",
    "classicDeckIds": [
      "deck_tri_primal_titans",
      "deck_tri_primordial_forge"
    ],
    "tierBadge": "S",
    "overallWinRate": 0.5761,
    "ci95HalfWidth": 0.0223,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.7409,
      "bicolor": 0.4931,
      "tricolor": 0.4583,
      "pentachromatic": 0.4653
    },
    "bestMatchups": [
      {
        "opponentId": "mono_gold_judgment",
        "winRate": 0.8958,
        "games": 48
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.8333,
        "games": 48
      },
      {
        "opponentId": "mono_neutral_axial",
        "winRate": 0.8333,
        "games": 48
      },
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.8125,
        "games": 48
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.8125,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.2292,
        "games": 48
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.3125,
        "games": 48
      },
      {
        "opponentId": "dual_red_gold",
        "winRate": 0.3125,
        "games": 48
      },
      {
        "opponentId": "dual_blue_green",
        "winRate": 0.3542,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.375,
        "games": 48
      }
    ]
  },
  {
    "rank": 13,
    "archetypeId": "dual_blue_gold",
    "name": "Pacto da Forja do Zênite",
    "subtitle": "Pacto Duplo ❄️+☀️ • Cidadela Cronomante & Escudo Celeste",
    "format": "bicolor",
    "domains": [
      "blue",
      "gold"
    ],
    "coverCardId": "blue_173_general_roda_gelo",
    "classicDeckIds": [
      "deck_dual_arcane_forge"
    ],
    "tierBadge": "S",
    "overallWinRate": 0.5688,
    "ci95HalfWidth": 0.0221,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.7044,
      "bicolor": 0.5253,
      "tricolor": 0.4562,
      "pentachromatic": 0.4236
    },
    "bestMatchups": [
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.8958,
        "games": 48
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.875,
        "games": 48
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.7917,
        "games": 48
      },
      {
        "opponentId": "mono_red_blitz",
        "winRate": 0.7708,
        "games": 48
      },
      {
        "opponentId": "mono_gold_judgment",
        "winRate": 0.75,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.2917,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.3125,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.3333,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_green",
        "winRate": 0.3333,
        "games": 48
      },
      {
        "opponentId": "penta_prismatic_crater",
        "winRate": 0.3542,
        "games": 48
      }
    ]
  },
  {
    "rank": 14,
    "archetypeId": "dual_gold_neutral",
    "name": "Aliança do Bastião Relojoeiro",
    "subtitle": "Aliança ☀️+⚙️ • Falange de Ferro Meteórico & Escudo Real",
    "format": "bicolor",
    "domains": [
      "gold",
      "neutral"
    ],
    "coverCardId": "gold_173_general_roda_sol",
    "classicDeckIds": [],
    "tierBadge": "S",
    "overallWinRate": 0.5688,
    "ci95HalfWidth": 0.0225,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.7096,
      "bicolor": 0.5134,
      "tricolor": 0.4375,
      "pentachromatic": 0.5139
    },
    "bestMatchups": [
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.875,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.875,
        "games": 48
      },
      {
        "opponentId": "mono_gold_phalanx",
        "winRate": 0.8542,
        "games": 48
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.8333,
        "games": 48
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.7292,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.2708,
        "games": 48
      },
      {
        "opponentId": "dual_blue_gold",
        "winRate": 0.3125,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_green",
        "winRate": 0.3333,
        "games": 48
      },
      {
        "opponentId": "dual_red_gold",
        "winRate": 0.3542,
        "games": 48
      },
      {
        "opponentId": "dual_blue_green",
        "winRate": 0.375,
        "games": 48
      }
    ]
  },
  {
    "rank": 15,
    "archetypeId": "penta_wheel_convergence",
    "name": "Convergência da Roda Horológica",
    "subtitle": "Ápice Pentacromático ❄️☀️💀🔥🌿+⚙️ • Vaelkor & Generais da Roda",
    "format": "pentachromatic",
    "domains": [
      "blue",
      "gold",
      "purple",
      "red",
      "green"
    ],
    "coverCardId": "neutral_173_general_roda_matriz",
    "classicDeckIds": [],
    "tierBadge": "S",
    "overallWinRate": 0.5673,
    "ci95HalfWidth": 0.0219,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.7005,
      "bicolor": 0.5056,
      "tricolor": 0.4667,
      "pentachromatic": 0.4688
    },
    "bestMatchups": [
      {
        "opponentId": "mono_green_swarm",
        "winRate": 0.8542,
        "games": 48
      },
      {
        "opponentId": "mono_gold_judgment",
        "winRate": 0.8333,
        "games": 48
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.7917,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.7708,
        "games": 48
      },
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.75,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.2292,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.25,
        "games": 48
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.3125,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_green",
        "winRate": 0.3333,
        "games": 48
      },
      {
        "opponentId": "dual_blue_green",
        "winRate": 0.3542,
        "games": 48
      }
    ]
  },
  {
    "rank": 16,
    "archetypeId": "dual_purple_gold",
    "name": "Pacto da Inquisição Crepuscular",
    "subtitle": "Pacto Duplo 💀+☀️ • Dreno Solar, Renascer & Veredito",
    "format": "bicolor",
    "domains": [
      "purple",
      "gold"
    ],
    "coverCardId": "purple_173_general_roda_abismo",
    "classicDeckIds": [
      "deck_dual_iron_inquisition"
    ],
    "tierBadge": "S",
    "overallWinRate": 0.563,
    "ci95HalfWidth": 0.0223,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.6992,
      "bicolor": 0.5119,
      "tricolor": 0.4625,
      "pentachromatic": 0.4097
    },
    "bestMatchups": [
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.8542,
        "games": 48
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.8542,
        "games": 48
      },
      {
        "opponentId": "mono_purple_crypt",
        "winRate": 0.8125,
        "games": 48
      },
      {
        "opponentId": "mono_green_swarm",
        "winRate": 0.7917,
        "games": 48
      },
      {
        "opponentId": "mono_gold_judgment",
        "winRate": 0.7917,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.2708,
        "games": 48
      },
      {
        "opponentId": "tri_blue_green_gold",
        "winRate": 0.3125,
        "games": 48
      },
      {
        "opponentId": "penta_wheel_convergence",
        "winRate": 0.3542,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.375,
        "games": 48
      },
      {
        "opponentId": "penta_prismatic_crater",
        "winRate": 0.3958,
        "games": 48
      }
    ]
  },
  {
    "rank": 17,
    "archetypeId": "penta_free_city_sovereign",
    "name": "Concílio Supremo da Cidade Franca",
    "subtitle": "Ápice Pentacromático ☀️🌿🔥❄️💀+⚙️ • Valkyra & Torre dos Cinco Selos",
    "format": "pentachromatic",
    "domains": [
      "gold",
      "green",
      "red",
      "blue",
      "purple"
    ],
    "coverCardId": "neutral_10_valkyra_pentacromatica",
    "classicDeckIds": [
      "deck_penta_valkyra_pact"
    ],
    "tierBadge": "S",
    "overallWinRate": 0.5601,
    "ci95HalfWidth": 0.0225,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.724,
      "bicolor": 0.4667,
      "tricolor": 0.4458,
      "pentachromatic": 0.5208
    },
    "bestMatchups": [
      {
        "opponentId": "mono_purple_crypt",
        "winRate": 0.8542,
        "games": 48
      },
      {
        "opponentId": "mono_green_swarm",
        "winRate": 0.8125,
        "games": 48
      },
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.8125,
        "games": 48
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.8125,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.7708,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.25,
        "games": 48
      },
      {
        "opponentId": "dual_red_gold",
        "winRate": 0.25,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.2917,
        "games": 48
      },
      {
        "opponentId": "dual_red_green",
        "winRate": 0.2917,
        "games": 48
      },
      {
        "opponentId": "dual_gold_neutral",
        "winRate": 0.3333,
        "games": 48
      }
    ]
  },
  {
    "rank": 18,
    "archetypeId": "tri_blue_green_gold",
    "name": "Escamas do Horizonte Eterno",
    "subtitle": "Tríade ☀️+🌿+❄️ • Falange Radiante, Rampa & Voo Astral",
    "format": "tricolor",
    "domains": [
      "gold",
      "green",
      "blue"
    ],
    "coverCardId": "gold_100_dragao_imperial_ouro",
    "classicDeckIds": [
      "deck_tri_celestial_scales",
      "deck_tri_eternal_horizon"
    ],
    "tierBadge": "S",
    "overallWinRate": 0.5567,
    "ci95HalfWidth": 0.022,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.6823,
      "bicolor": 0.5,
      "tricolor": 0.4861,
      "pentachromatic": 0.3819
    },
    "bestMatchups": [
      {
        "opponentId": "mono_green_swarm",
        "winRate": 0.8333,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.8333,
        "games": 48
      },
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.7917,
        "games": 48
      },
      {
        "opponentId": "mono_gold_celestial",
        "winRate": 0.7708,
        "games": 48
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.75,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.2292,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.2917,
        "games": 48
      },
      {
        "opponentId": "penta_wheel_convergence",
        "winRate": 0.3125,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.375,
        "games": 48
      },
      {
        "opponentId": "penta_free_city_sovereign",
        "winRate": 0.3958,
        "games": 48
      }
    ]
  },
  {
    "rank": 19,
    "archetypeId": "dual_blue_neutral",
    "name": "Aliança do Astrolábio Arcano",
    "subtitle": "Aliança ❄️+⚙️ • Controle Horológico, Alcance & Voo",
    "format": "bicolor",
    "domains": [
      "blue",
      "neutral"
    ],
    "coverCardId": "blue_173_general_roda_gelo",
    "classicDeckIds": [],
    "tierBadge": "A",
    "overallWinRate": 0.5489,
    "ci95HalfWidth": 0.0221,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.6953,
      "bicolor": 0.4747,
      "tricolor": 0.4521,
      "pentachromatic": 0.4375
    },
    "bestMatchups": [
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.9375,
        "games": 48
      },
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.7917,
        "games": 48
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.7917,
        "games": 48
      },
      {
        "opponentId": "mono_purple_crypt",
        "winRate": 0.75,
        "games": 48
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.7083,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.2917,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.3542,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.3542,
        "games": 48
      },
      {
        "opponentId": "dual_red_purple",
        "winRate": 0.3542,
        "games": 48
      },
      {
        "opponentId": "penta_free_city_sovereign",
        "winRate": 0.375,
        "games": 48
      }
    ]
  },
  {
    "rank": 20,
    "archetypeId": "dual_red_blue",
    "name": "Pacto do Fogo Astral",
    "subtitle": "Pacto Duplo 🔥+❄️ • Artilharia Arcana, Voo & Tempestade",
    "format": "bicolor",
    "domains": [
      "red",
      "blue"
    ],
    "coverCardId": "red_173_general_roda_chama",
    "classicDeckIds": [
      "deck_dual_storm_dragon"
    ],
    "tierBadge": "A",
    "overallWinRate": 0.5344,
    "ci95HalfWidth": 0.0228,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.6432,
      "bicolor": 0.4762,
      "tricolor": 0.4479,
      "pentachromatic": 0.5139
    },
    "bestMatchups": [
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.7917,
        "games": 48
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.75,
        "games": 48
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.75,
        "games": 48
      },
      {
        "opponentId": "mono_gold_judgment",
        "winRate": 0.75,
        "games": 48
      },
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.7292,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.2083,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.2292,
        "games": 48
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.25,
        "games": 48
      },
      {
        "opponentId": "dual_blue_gold",
        "winRate": 0.3125,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.3333,
        "games": 48
      }
    ]
  },
  {
    "rank": 21,
    "archetypeId": "tri_blue_purple_gold",
    "name": "Relicário do Trono Eterno",
    "subtitle": "Tríade ☀️+❄️+💀 • Cidadela de Relíquias, Cronomancia & Veredito",
    "format": "tricolor",
    "domains": [
      "gold",
      "blue",
      "purple"
    ],
    "coverCardId": "gold_72_talisma_bem",
    "classicDeckIds": [
      "deck_tri_eternal_reliquary"
    ],
    "tierBadge": "A",
    "overallWinRate": 0.5344,
    "ci95HalfWidth": 0.0227,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.6589,
      "bicolor": 0.4806,
      "tricolor": 0.4144,
      "pentachromatic": 0.5
    },
    "bestMatchups": [
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.8542,
        "games": 48
      },
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.7917,
        "games": 48
      },
      {
        "opponentId": "mono_gold_judgment",
        "winRate": 0.7917,
        "games": 48
      },
      {
        "opponentId": "mono_red_blitz",
        "winRate": 0.75,
        "games": 48
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.7292,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.25,
        "games": 48
      },
      {
        "opponentId": "dual_green_gold",
        "winRate": 0.2917,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_green",
        "winRate": 0.3333,
        "games": 48
      },
      {
        "opponentId": "dual_green_neutral",
        "winRate": 0.3333,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.3542,
        "games": 48
      }
    ]
  },
  {
    "rank": 22,
    "archetypeId": "dual_green_gold",
    "name": "Pacto da Aurora Silvestre",
    "subtitle": "Pacto Duplo 🌿+☀️ • Falange dos Mil Escudos & Hinos Globais",
    "format": "bicolor",
    "domains": [
      "green",
      "gold"
    ],
    "coverCardId": "green_173_general_roda_selva",
    "classicDeckIds": [
      "deck_dual_solar_wild"
    ],
    "tierBadge": "A",
    "overallWinRate": 0.5325,
    "ci95HalfWidth": 0.0219,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.6706,
      "bicolor": 0.4643,
      "tricolor": 0.4229,
      "pentachromatic": 0.4792
    },
    "bestMatchups": [
      {
        "opponentId": "mono_purple_crypt",
        "winRate": 0.8333,
        "games": 48
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.8125,
        "games": 48
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.7917,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.7708,
        "games": 48
      },
      {
        "opponentId": "mono_purple_umbral",
        "winRate": 0.7708,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.2708,
        "games": 48
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.2917,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.3125,
        "games": 48
      },
      {
        "opponentId": "dual_blue_green",
        "winRate": 0.3125,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.3333,
        "games": 48
      }
    ]
  },
  {
    "rank": 23,
    "archetypeId": "dual_red_purple",
    "name": "Pacto da Chama Sangrenta",
    "subtitle": "Pacto Duplo 🔥+💀 • Blitz Sanguinária, Dreno & Último Suspiro",
    "format": "bicolor",
    "domains": [
      "red",
      "purple"
    ],
    "coverCardId": "red_173_general_roda_chama",
    "classicDeckIds": [
      "deck_dual_blood_flame"
    ],
    "tierBadge": "A",
    "overallWinRate": 0.5286,
    "ci95HalfWidth": 0.0219,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.6484,
      "bicolor": 0.4598,
      "tricolor": 0.4375,
      "pentachromatic": 0.5139
    },
    "bestMatchups": [
      {
        "opponentId": "mono_blue_chrono",
        "winRate": 0.8958,
        "games": 48
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.875,
        "games": 48
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.7292,
        "games": 48
      },
      {
        "opponentId": "mono_red_dragon",
        "winRate": 0.7083,
        "games": 48
      },
      {
        "opponentId": "mono_purple_umbral",
        "winRate": 0.7083,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.2292,
        "games": 48
      },
      {
        "opponentId": "dual_purple_gold",
        "winRate": 0.2917,
        "games": 48
      },
      {
        "opponentId": "tri_red_green_gold",
        "winRate": 0.3333,
        "games": 48
      },
      {
        "opponentId": "tri_purple_green_gold",
        "winRate": 0.375,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.375,
        "games": 48
      }
    ]
  },
  {
    "rank": 24,
    "archetypeId": "dual_purple_green",
    "name": "Pacto da Podridão Eterna",
    "subtitle": "Pacto Duplo 💀+🌿 • Cripta, Regeneração & Veneno",
    "format": "bicolor",
    "domains": [
      "purple",
      "green"
    ],
    "coverCardId": "purple_173_general_roda_abismo",
    "classicDeckIds": [
      "deck_dual_eternal_rot"
    ],
    "tierBadge": "A",
    "overallWinRate": 0.5247,
    "ci95HalfWidth": 0.0222,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.6615,
      "bicolor": 0.4494,
      "tricolor": 0.4271,
      "pentachromatic": 0.4722
    },
    "bestMatchups": [
      {
        "opponentId": "mono_purple_crypt",
        "winRate": 0.8333,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.8125,
        "games": 48
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.75,
        "games": 48
      },
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.7292,
        "games": 48
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.6875,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.25,
        "games": 48
      },
      {
        "opponentId": "dual_blue_green",
        "winRate": 0.2917,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_green",
        "winRate": 0.3542,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.3542,
        "games": 48
      },
      {
        "opponentId": "dual_green_neutral",
        "winRate": 0.3542,
        "games": 48
      }
    ]
  },
  {
    "rank": 25,
    "archetypeId": "dual_blue_purple",
    "name": "Pacto da Tormenta Abissal",
    "subtitle": "Pacto Duplo ❄️+💀 • Estase Glacial & Execução Umbral",
    "format": "bicolor",
    "domains": [
      "blue",
      "purple"
    ],
    "coverCardId": "blue_173_general_roda_gelo",
    "classicDeckIds": [
      "deck_dual_abyssal_storm"
    ],
    "tierBadge": "A",
    "overallWinRate": 0.4889,
    "ci95HalfWidth": 0.022,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.6094,
      "bicolor": 0.4435,
      "tricolor": 0.3812,
      "pentachromatic": 0.4167
    },
    "bestMatchups": [
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.8333,
        "games": 48
      },
      {
        "opponentId": "mono_gold_judgment",
        "winRate": 0.75,
        "games": 48
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.6875,
        "games": 48
      },
      {
        "opponentId": "mono_blue_frost",
        "winRate": 0.6875,
        "games": 48
      },
      {
        "opponentId": "mono_gold_phalanx",
        "winRate": 0.6875,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.1875,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.2292,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.2292,
        "games": 48
      },
      {
        "opponentId": "tri_purple_green_gold",
        "winRate": 0.25,
        "games": 48
      },
      {
        "opponentId": "dual_red_green",
        "winRate": 0.3125,
        "games": 48
      }
    ]
  },
  {
    "rank": 26,
    "archetypeId": "tri_red_blue_purple",
    "name": "Cataclismo da Convergência Astral",
    "subtitle": "Tríade ❄️+🔥+💀 • Estase, Fogo Piroclástico & Execução Umbral",
    "format": "tricolor",
    "domains": [
      "blue",
      "red",
      "purple"
    ],
    "coverCardId": "blue_98_soberano_mares",
    "classicDeckIds": [
      "deck_tri_arcane_cataclysm",
      "deck_tri_astral_cataclysm"
    ],
    "tierBadge": "A",
    "overallWinRate": 0.4859,
    "ci95HalfWidth": 0.0227,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.6055,
      "bicolor": 0.425,
      "tricolor": 0.3912,
      "pentachromatic": 0.4375
    },
    "bestMatchups": [
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.7708,
        "games": 48
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.7083,
        "games": 48
      },
      {
        "opponentId": "mono_gold_judgment",
        "winRate": 0.7083,
        "games": 48
      },
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.6875,
        "games": 48
      },
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.6667,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.2292,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.25,
        "games": 48
      },
      {
        "opponentId": "penta_prismatic_crater",
        "winRate": 0.2708,
        "games": 48
      },
      {
        "opponentId": "dual_green_neutral",
        "winRate": 0.3333,
        "games": 48
      },
      {
        "opponentId": "dual_blue_green",
        "winRate": 0.3333,
        "games": 48
      }
    ]
  },
  {
    "rank": 27,
    "archetypeId": "tri_blue_purple_green",
    "name": "Quimera da Fossa Abissal",
    "subtitle": "Tríade ❄️+💀+🌿 • Evolução Necrótica, Estase & Cripta Viva",
    "format": "tricolor",
    "domains": [
      "blue",
      "purple",
      "green"
    ],
    "coverCardId": "purple_100_dragao_necrotico",
    "classicDeckIds": [
      "deck_tri_abyssal_chimera"
    ],
    "tierBadge": "A",
    "overallWinRate": 0.4787,
    "ci95HalfWidth": 0.0222,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.6016,
      "bicolor": 0.4097,
      "tricolor": 0.3912,
      "pentachromatic": 0.4306
    },
    "bestMatchups": [
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.7083,
        "games": 48
      },
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.7083,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.6875,
        "games": 48
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.6875,
        "games": 48
      },
      {
        "opponentId": "mono_gold_judgment",
        "winRate": 0.6875,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.2083,
        "games": 48
      },
      {
        "opponentId": "tri_blue_green_gold",
        "winRate": 0.25,
        "games": 48
      },
      {
        "opponentId": "penta_prismatic_crater",
        "winRate": 0.2708,
        "games": 48
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.2708,
        "games": 48
      },
      {
        "opponentId": "dual_red_purple",
        "winRate": 0.3125,
        "games": 48
      }
    ]
  },
  {
    "rank": 28,
    "archetypeId": "mono_red_blitz",
    "name": "Blitz Salamandra",
    "subtitle": "Mono-Vermelho 🔥 • Ímpeto & Pele Incandescente",
    "format": "monocolor",
    "domains": [
      "red"
    ],
    "coverCardId": "red_173_general_roda_chama",
    "classicDeckIds": [
      "deck_aggro_blitz"
    ],
    "tierBadge": "A",
    "overallWinRate": 0.4675,
    "ci95HalfWidth": 0.0226,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.6153,
      "bicolor": 0.3972,
      "tricolor": 0.3521,
      "pentachromatic": 0.4653
    },
    "bestMatchups": [
      {
        "opponentId": "mono_blue_chrono",
        "winRate": 0.9167,
        "games": 48
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.7292,
        "games": 48
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.6875,
        "games": 48
      },
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.6875,
        "games": 48
      },
      {
        "opponentId": "mono_blue_frost",
        "winRate": 0.6667,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.1667,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.2292,
        "games": 48
      },
      {
        "opponentId": "dual_blue_gold",
        "winRate": 0.2292,
        "games": 48
      },
      {
        "opponentId": "tri_blue_purple_gold",
        "winRate": 0.25,
        "games": 48
      },
      {
        "opponentId": "dual_purple_gold",
        "winRate": 0.2917,
        "games": 48
      }
    ]
  },
  {
    "rank": 29,
    "archetypeId": "mono_blue_frost",
    "name": "Inverno Eterno",
    "subtitle": "Mono-Azul ❄️ • Congelar & Estase Tática",
    "format": "monocolor",
    "domains": [
      "blue"
    ],
    "coverCardId": "blue_80_senhor_tempo",
    "classicDeckIds": [
      "deck_blue_tempest"
    ],
    "tierBadge": "A",
    "overallWinRate": 0.4482,
    "ci95HalfWidth": 0.0225,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.5861,
      "bicolor": 0.3778,
      "tricolor": 0.3812,
      "pentachromatic": 0.3333
    },
    "bestMatchups": [
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.75,
        "games": 48
      },
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.7292,
        "games": 48
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.7083,
        "games": 48
      },
      {
        "opponentId": "mono_red_dragon",
        "winRate": 0.7083,
        "games": 48
      },
      {
        "opponentId": "mono_gold_phalanx",
        "winRate": 0.6875,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.1458,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.2292,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.2708,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.2708,
        "games": 48
      },
      {
        "opponentId": "dual_red_green",
        "winRate": 0.2708,
        "games": 48
      }
    ]
  },
  {
    "rank": 30,
    "archetypeId": "mono_blue_chrono",
    "name": "Conclave Cronomante",
    "subtitle": "Mono-Azul ⚡ • Compra, Reações & Feitiços",
    "format": "monocolor",
    "domains": [
      "blue"
    ],
    "coverCardId": "blue_45_oraculo_abissal",
    "classicDeckIds": [
      "deck_control_bastion"
    ],
    "tierBadge": "A",
    "overallWinRate": 0.4462,
    "ci95HalfWidth": 0.0224,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.5264,
      "bicolor": 0.3833,
      "tricolor": 0.4229,
      "pentachromatic": 0.4375
    },
    "bestMatchups": [
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.75,
        "games": 48
      },
      {
        "opponentId": "mono_gold_celestial",
        "winRate": 0.7083,
        "games": 48
      },
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.6458,
        "games": 48
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.6458,
        "games": 48
      },
      {
        "opponentId": "mono_gold_phalanx",
        "winRate": 0.6458,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "mono_red_blitz",
        "winRate": 0.0833,
        "games": 48
      },
      {
        "opponentId": "dual_red_purple",
        "winRate": 0.1042,
        "games": 48
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.125,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.1875,
        "games": 48
      },
      {
        "opponentId": "dual_green_neutral",
        "winRate": 0.2083,
        "games": 48
      }
    ]
  },
  {
    "rank": 31,
    "archetypeId": "dual_purple_neutral",
    "name": "Aliança da Guilda das Máscaras",
    "subtitle": "Aliança 💀+⚙️ • Lâminas Letais, Dreno & Submundo Axial",
    "format": "bicolor",
    "domains": [
      "purple",
      "neutral"
    ],
    "coverCardId": "purple_173_general_roda_abismo",
    "classicDeckIds": [],
    "tierBadge": "B",
    "overallWinRate": 0.437,
    "ci95HalfWidth": 0.0224,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.5781,
      "bicolor": 0.3259,
      "tricolor": 0.3854,
      "pentachromatic": 0.375
    },
    "bestMatchups": [
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.7708,
        "games": 48
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.7292,
        "games": 48
      },
      {
        "opponentId": "mono_purple_umbral",
        "winRate": 0.7083,
        "games": 48
      },
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.6875,
        "games": 48
      },
      {
        "opponentId": "mono_blue_frost",
        "winRate": 0.6458,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.1458,
        "games": 48
      },
      {
        "opponentId": "dual_red_gold",
        "winRate": 0.1458,
        "games": 48
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.2292,
        "games": 48
      },
      {
        "opponentId": "dual_red_green",
        "winRate": 0.2292,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.2708,
        "games": 48
      }
    ]
  },
  {
    "rank": 32,
    "archetypeId": "mono_neutral_axial",
    "name": "Legião Axial Autômata",
    "subtitle": "Mono-Neutro ⚙️ • Constructos, Relíquias & Matriz Horológica",
    "format": "monocolor",
    "domains": [
      "neutral"
    ],
    "coverCardId": "neutral_24_dragao_astral",
    "classicDeckIds": [
      "deck_neutral_watch"
    ],
    "tierBadge": "B",
    "overallWinRate": 0.4249,
    "ci95HalfWidth": 0.0223,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.5597,
      "bicolor": 0.3694,
      "tricolor": 0.3292,
      "pentachromatic": 0.3472
    },
    "bestMatchups": [
      {
        "opponentId": "dual_purple_neutral",
        "winRate": 0.7292,
        "games": 48
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.7083,
        "games": 48
      },
      {
        "opponentId": "mono_red_dragon",
        "winRate": 0.7083,
        "games": 48
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.7083,
        "games": 48
      },
      {
        "opponentId": "mono_blue_chrono",
        "winRate": 0.6042,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_green_gold",
        "winRate": 0.1667,
        "games": 48
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.2292,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.25,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.25,
        "games": 48
      },
      {
        "opponentId": "dual_purple_gold",
        "winRate": 0.25,
        "games": 48
      }
    ]
  },
  {
    "rank": 33,
    "archetypeId": "mono_gold_phalanx",
    "name": "Falange Impenetrável",
    "subtitle": "Mono-Dourado 🛡️ • Guardião, Armadura & Bastião",
    "format": "monocolor",
    "domains": [
      "gold"
    ],
    "coverCardId": "gold_99_serafim_coroado",
    "classicDeckIds": [
      "deck_gold_radiant"
    ],
    "tierBadge": "B",
    "overallWinRate": 0.4176,
    "ci95HalfWidth": 0.022,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.5847,
      "bicolor": 0.3431,
      "tricolor": 0.3271,
      "pentachromatic": 0.2569
    },
    "bestMatchups": [
      {
        "opponentId": "mono_purple_crypt",
        "winRate": 0.75,
        "games": 48
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.7292,
        "games": 48
      },
      {
        "opponentId": "mono_gold_judgment",
        "winRate": 0.7292,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.7083,
        "games": 48
      },
      {
        "opponentId": "mono_green_swarm",
        "winRate": 0.6458,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.1042,
        "games": 48
      },
      {
        "opponentId": "dual_gold_neutral",
        "winRate": 0.1458,
        "games": 48
      },
      {
        "opponentId": "penta_free_city_sovereign",
        "winRate": 0.2292,
        "games": 48
      },
      {
        "opponentId": "penta_prismatic_crater",
        "winRate": 0.2292,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_green",
        "winRate": 0.25,
        "games": 48
      }
    ]
  },
  {
    "rank": 34,
    "archetypeId": "mono_gold_celestial",
    "name": "Legião Celeste",
    "subtitle": "Mono-Dourado ☀️ • Escudo Divino, Voo & Ascensão",
    "format": "monocolor",
    "domains": [
      "gold"
    ],
    "coverCardId": "gold_99_serafim_coroado",
    "classicDeckIds": [],
    "tierBadge": "B",
    "overallWinRate": 0.3953,
    "ci95HalfWidth": 0.0218,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.5319,
      "bicolor": 0.3736,
      "tricolor": 0.2646,
      "pentachromatic": 0.2569
    },
    "bestMatchups": [
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.8333,
        "games": 48
      },
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.7292,
        "games": 48
      },
      {
        "opponentId": "mono_purple_crypt",
        "winRate": 0.6875,
        "games": 48
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.625,
        "games": 48
      },
      {
        "opponentId": "dual_purple_neutral",
        "winRate": 0.6042,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.0833,
        "games": 48
      },
      {
        "opponentId": "penta_prismatic_crater",
        "winRate": 0.1667,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.1875,
        "games": 48
      },
      {
        "opponentId": "tri_red_green_gold",
        "winRate": 0.2083,
        "games": 48
      },
      {
        "opponentId": "tri_blue_green_gold",
        "winRate": 0.2292,
        "games": 48
      }
    ]
  },
  {
    "rank": 35,
    "archetypeId": "mono_green_swarm",
    "name": "Enxame & Matilha Silvestre",
    "subtitle": "Mono-Verde 🌿 • Aggro & Buff em Massa",
    "format": "monocolor",
    "domains": [
      "green"
    ],
    "coverCardId": "green_09_hidra",
    "classicDeckIds": [],
    "tierBadge": "B",
    "overallWinRate": 0.3905,
    "ci95HalfWidth": 0.0217,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.5458,
      "bicolor": 0.3486,
      "tricolor": 0.275,
      "pentachromatic": 0.2083
    },
    "bestMatchups": [
      {
        "opponentId": "mono_purple_crypt",
        "winRate": 0.7292,
        "games": 48
      },
      {
        "opponentId": "mono_blue_chrono",
        "winRate": 0.7083,
        "games": 48
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.6042,
        "games": 48
      },
      {
        "opponentId": "mono_red_blitz",
        "winRate": 0.5833,
        "games": 48
      },
      {
        "opponentId": "mono_purple_umbral",
        "winRate": 0.5625,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.125,
        "games": 48
      },
      {
        "opponentId": "penta_wheel_convergence",
        "winRate": 0.1458,
        "games": 48
      },
      {
        "opponentId": "tri_blue_green_gold",
        "winRate": 0.1667,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.1667,
        "games": 48
      },
      {
        "opponentId": "penta_free_city_sovereign",
        "winRate": 0.1875,
        "games": 48
      }
    ]
  },
  {
    "rank": 36,
    "archetypeId": "mono_red_dragon",
    "name": "Trono Dracônico",
    "subtitle": "Mono-Vermelho 🔥 • Voo, Sopro & Ascensão",
    "format": "monocolor",
    "domains": [
      "red"
    ],
    "coverCardId": "red_46_tirano_carmesim",
    "classicDeckIds": [
      "deck_red_inferno"
    ],
    "tierBadge": "B",
    "overallWinRate": 0.3876,
    "ci95HalfWidth": 0.0215,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.5111,
      "bicolor": 0.35,
      "tricolor": 0.2833,
      "pentachromatic": 0.3056
    },
    "bestMatchups": [
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.6875,
        "games": 48
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.6667,
        "games": 48
      },
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.6458,
        "games": 48
      },
      {
        "opponentId": "mono_blue_chrono",
        "winRate": 0.6458,
        "games": 48
      },
      {
        "opponentId": "mono_gold_judgment",
        "winRate": 0.5833,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.0417,
        "games": 48
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.2083,
        "games": 48
      },
      {
        "opponentId": "tri_purple_green_gold",
        "winRate": 0.2292,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.2292,
        "games": 48
      },
      {
        "opponentId": "dual_red_gold",
        "winRate": 0.2292,
        "games": 48
      }
    ]
  },
  {
    "rank": 37,
    "archetypeId": "mono_purple_umbral",
    "name": "Inquisição Umbral",
    "subtitle": "Mono-Roxo 🌑 • Destruição, Debuff & Controle",
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "coverCardId": "purple_167_arauto_prisma_abismo",
    "classicDeckIds": [],
    "tierBadge": "B",
    "overallWinRate": 0.3784,
    "ci95HalfWidth": 0.0216,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.4833,
      "bicolor": 0.3125,
      "tricolor": 0.3292,
      "pentachromatic": 0.3472
    },
    "bestMatchups": [
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.625,
        "games": 48
      },
      {
        "opponentId": "mono_red_dragon",
        "winRate": 0.5833,
        "games": 48
      },
      {
        "opponentId": "tri_blue_purple_green",
        "winRate": 0.5625,
        "games": 48
      },
      {
        "opponentId": "mono_blue_chrono",
        "winRate": 0.5417,
        "games": 48
      },
      {
        "opponentId": "dual_blue_purple",
        "winRate": 0.5417,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.125,
        "games": 48
      },
      {
        "opponentId": "dual_green_neutral",
        "winRate": 0.1458,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.1875,
        "games": 48
      },
      {
        "opponentId": "tri_purple_green_gold",
        "winRate": 0.2083,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.2083,
        "games": 48
      }
    ]
  },
  {
    "rank": 38,
    "archetypeId": "mono_purple_crypt",
    "name": "Culto da Cripta",
    "subtitle": "Mono-Roxo 💀 • Renascer & Reanimação",
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "coverCardId": "purple_65_principe_mortos",
    "classicDeckIds": [
      "deck_purple_shadow",
      "deck_crypt_reanimator"
    ],
    "tierBadge": "B",
    "overallWinRate": 0.3435,
    "ci95HalfWidth": 0.0214,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.4625,
      "bicolor": 0.2681,
      "tricolor": 0.3063,
      "pentachromatic": 0.25
    },
    "bestMatchups": [
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.7083,
        "games": 48
      },
      {
        "opponentId": "mono_neutral_axial",
        "winRate": 0.625,
        "games": 48
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.5833,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.5625,
        "games": 48
      },
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.5417,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.125,
        "games": 48
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.125,
        "games": 48
      },
      {
        "opponentId": "penta_free_city_sovereign",
        "winRate": 0.1458,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.1667,
        "games": 48
      },
      {
        "opponentId": "dual_green_gold",
        "winRate": 0.1667,
        "games": 48
      }
    ]
  },
  {
    "rank": 39,
    "archetypeId": "mono_gold_judgment",
    "name": "Julgamento Solar",
    "subtitle": "Mono-Dourado ⚖️ • Relíquias, Escudo Global & Cura",
    "format": "monocolor",
    "domains": [
      "gold"
    ],
    "coverCardId": "gold_99_serafim_coroado",
    "classicDeckIds": [
      "deck_relic_artificer"
    ],
    "tierBadge": "B",
    "overallWinRate": 0.3328,
    "ci95HalfWidth": 0.0215,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.4833,
      "bicolor": 0.2819,
      "tricolor": 0.2146,
      "pentachromatic": 0.2292
    },
    "bestMatchups": [
      {
        "opponentId": "mono_purple_crypt",
        "winRate": 0.6458,
        "games": 48
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.6458,
        "games": 48
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.6042,
        "games": 48
      },
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.5625,
        "games": 48
      },
      {
        "opponentId": "mono_blue_frost",
        "winRate": 0.5208,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_green_gold",
        "winRate": 0.1042,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.1458,
        "games": 48
      },
      {
        "opponentId": "tri_purple_green_gold",
        "winRate": 0.1458,
        "games": 48
      },
      {
        "opponentId": "dual_blue_green",
        "winRate": 0.1458,
        "games": 48
      },
      {
        "opponentId": "penta_wheel_convergence",
        "winRate": 0.1667,
        "games": 48
      }
    ]
  },
  {
    "rank": 40,
    "archetypeId": "mono_blue_abyssal",
    "name": "Frota Abissal",
    "subtitle": "Mono-Azul 🌊 • Voo, Alcance & Leviatãs",
    "format": "monocolor",
    "domains": [
      "blue"
    ],
    "coverCardId": "blue_97_draco_relampago",
    "classicDeckIds": [],
    "tierBadge": "B",
    "overallWinRate": 0.3217,
    "ci95HalfWidth": 0.0207,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.4583,
      "bicolor": 0.2722,
      "tricolor": 0.2229,
      "pentachromatic": 0.2153
    },
    "bestMatchups": [
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.6875,
        "games": 48
      },
      {
        "opponentId": "mono_gold_celestial",
        "winRate": 0.5833,
        "games": 48
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.5625,
        "games": 48
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.5417,
        "games": 48
      },
      {
        "opponentId": "mono_red_dragon",
        "winRate": 0.5417,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.0625,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.0833,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.1042,
        "games": 48
      },
      {
        "opponentId": "penta_prismatic_crater",
        "winRate": 0.1667,
        "games": 48
      },
      {
        "opponentId": "tri_red_green_gold",
        "winRate": 0.1875,
        "games": 48
      }
    ]
  },
  {
    "rank": 41,
    "archetypeId": "mono_green_colossus",
    "name": "Colossos Primordiais",
    "subtitle": "Mono-Verde 🌿 • Ramp & Atropelar",
    "format": "monocolor",
    "domains": [
      "green"
    ],
    "coverCardId": "green_09_hidra",
    "classicDeckIds": [
      "deck_green_wild",
      "deck_midrange_beasts"
    ],
    "tierBadge": "B",
    "overallWinRate": 0.3188,
    "ci95HalfWidth": 0.0204,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.4347,
      "bicolor": 0.2861,
      "tricolor": 0.2188,
      "pentachromatic": 0.2361
    },
    "bestMatchups": [
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.6042,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.5833,
        "games": 48
      },
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.5417,
        "games": 48
      },
      {
        "opponentId": "mono_purple_crypt",
        "winRate": 0.5,
        "games": 48
      },
      {
        "opponentId": "mono_green_swarm",
        "winRate": 0.4792,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.0833,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.0833,
        "games": 48
      },
      {
        "opponentId": "dual_gold_neutral",
        "winRate": 0.125,
        "games": 48
      },
      {
        "opponentId": "tri_blue_purple_gold",
        "winRate": 0.1458,
        "games": 48
      },
      {
        "opponentId": "dual_purple_gold",
        "winRate": 0.1458,
        "games": 48
      }
    ]
  },
  {
    "rank": 42,
    "archetypeId": "mono_red_pyroclasm",
    "name": "Artilharia Piroclástica",
    "subtitle": "Mono-Vermelho 🔥 • Queima Direta & Cataclismos",
    "format": "monocolor",
    "domains": [
      "red"
    ],
    "coverCardId": "red_46_tirano_carmesim",
    "classicDeckIds": [],
    "tierBadge": "B",
    "overallWinRate": 0.3164,
    "ci95HalfWidth": 0.0208,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.4319,
      "bicolor": 0.2625,
      "tricolor": 0.2313,
      "pentachromatic": 0.2917
    },
    "bestMatchups": [
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.6667,
        "games": 48
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.625,
        "games": 48
      },
      {
        "opponentId": "mono_purple_umbral",
        "winRate": 0.5625,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.5208,
        "games": 48
      },
      {
        "opponentId": "mono_green_swarm",
        "winRate": 0.4792,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.1042,
        "games": 48
      },
      {
        "opponentId": "dual_red_purple",
        "winRate": 0.125,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.1458,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.1458,
        "games": 48
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.1458,
        "games": 48
      }
    ]
  },
  {
    "rank": 43,
    "archetypeId": "mono_purple_blood",
    "name": "Pacto Sanguíneo",
    "subtitle": "Mono-Roxo 🩸 • Dreno de Vida & Toque Letal",
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "coverCardId": "purple_46_noiva_vampira",
    "classicDeckIds": [],
    "tierBadge": "B",
    "overallWinRate": 0.2771,
    "ci95HalfWidth": 0.0195,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.3653,
      "bicolor": 0.2319,
      "tricolor": 0.2229,
      "pentachromatic": 0.2431
    },
    "bestMatchups": [
      {
        "opponentId": "mono_purple_umbral",
        "winRate": 0.5,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_purple",
        "winRate": 0.5,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.4792,
        "games": 48
      },
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.4375,
        "games": 48
      },
      {
        "opponentId": "mono_blue_frost",
        "winRate": 0.4167,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.0417,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.0833,
        "games": 48
      },
      {
        "opponentId": "tri_purple_green_gold",
        "winRate": 0.1042,
        "games": 48
      },
      {
        "opponentId": "dual_blue_gold",
        "winRate": 0.125,
        "games": 48
      },
      {
        "opponentId": "dual_purple_gold",
        "winRate": 0.1458,
        "games": 48
      }
    ]
  },
  {
    "rank": 44,
    "archetypeId": "mono_green_roots",
    "name": "Raízes Eternas",
    "subtitle": "Mono-Verde 🌿 • Guardião & Regeneração",
    "format": "monocolor",
    "domains": [
      "green"
    ],
    "coverCardId": "green_33_behemoth_primordial",
    "classicDeckIds": [],
    "tierBadge": "B",
    "overallWinRate": 0.2718,
    "ci95HalfWidth": 0.0201,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.4194,
      "bicolor": 0.1861,
      "tricolor": 0.1958,
      "pentachromatic": 0.2153
    },
    "bestMatchups": [
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.5208,
        "games": 48
      },
      {
        "opponentId": "mono_purple_umbral",
        "winRate": 0.5,
        "games": 48
      },
      {
        "opponentId": "mono_gold_judgment",
        "winRate": 0.5,
        "games": 48
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.4792,
        "games": 48
      },
      {
        "opponentId": "mono_green_swarm",
        "winRate": 0.4583,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.0208,
        "games": 48
      },
      {
        "opponentId": "dual_blue_neutral",
        "winRate": 0.0625,
        "games": 48
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.0833,
        "games": 48
      },
      {
        "opponentId": "dual_blue_green",
        "winRate": 0.0833,
        "games": 48
      },
      {
        "opponentId": "dual_blue_gold",
        "winRate": 0.1042,
        "games": 48
      }
    ]
  }
];

export const UNIFIED_MATCHUP_MATRIX: Record<UnifiedChampionId, Record<UnifiedChampionId, number>> = {
  "mono_green_swarm": {
    "mono_green_swarm": 0.5,
    "mono_green_colossus": 0.5208,
    "mono_green_roots": 0.5417,
    "mono_red_blitz": 0.5833,
    "mono_red_pyroclasm": 0.5208,
    "mono_red_dragon": 0.5208,
    "mono_blue_frost": 0.4167,
    "mono_blue_chrono": 0.7083,
    "mono_blue_abyssal": 0.5208,
    "mono_purple_crypt": 0.7292,
    "mono_purple_blood": 0.6042,
    "mono_purple_umbral": 0.5625,
    "mono_gold_phalanx": 0.3542,
    "mono_gold_celestial": 0.5625,
    "mono_gold_judgment": 0.5625,
    "mono_neutral_axial": 0.4792,
    "dual_red_gold": 0.2917,
    "dual_blue_purple": 0.4583,
    "dual_red_green": 0.4375,
    "dual_blue_gold": 0.2917,
    "dual_purple_green": 0.3542,
    "dual_red_purple": 0.4167,
    "dual_blue_green": 0.3542,
    "dual_green_gold": 0.3333,
    "dual_purple_gold": 0.2083,
    "dual_red_blue": 0.5417,
    "dual_green_neutral": 0.2708,
    "dual_red_neutral": 0.1875,
    "dual_blue_neutral": 0.375,
    "dual_purple_neutral": 0.4167,
    "dual_gold_neutral": 0.2917,
    "tri_red_blue_purple": 0.4375,
    "tri_red_green_gold": 0.25,
    "tri_blue_purple_gold": 0.4792,
    "tri_red_purple_green": 0.1667,
    "tri_blue_green_gold": 0.1667,
    "tri_blue_purple_green": 0.4583,
    "tri_red_purple_gold": 0.2083,
    "tri_purple_green_gold": 0.2292,
    "tri_red_blue_green": 0.2292,
    "tri_red_blue_gold": 0.125,
    "penta_prismatic_crater": 0.2917,
    "penta_free_city_sovereign": 0.1875,
    "penta_wheel_convergence": 0.1458
  },
  "mono_green_colossus": {
    "mono_green_swarm": 0.4792,
    "mono_green_colossus": 0.5,
    "mono_green_roots": 0.5833,
    "mono_red_blitz": 0.4167,
    "mono_red_pyroclasm": 0.3333,
    "mono_red_dragon": 0.3542,
    "mono_blue_frost": 0.2708,
    "mono_blue_chrono": 0.3542,
    "mono_blue_abyssal": 0.5417,
    "mono_purple_crypt": 0.5,
    "mono_purple_blood": 0.6042,
    "mono_purple_umbral": 0.4792,
    "mono_gold_phalanx": 0.4167,
    "mono_gold_celestial": 0.2708,
    "mono_gold_judgment": 0.4375,
    "mono_neutral_axial": 0.4792,
    "dual_red_gold": 0.1875,
    "dual_blue_purple": 0.3542,
    "dual_red_green": 0.3333,
    "dual_blue_gold": 0.3333,
    "dual_purple_green": 0.2708,
    "dual_red_purple": 0.4167,
    "dual_blue_green": 0.1458,
    "dual_green_gold": 0.3958,
    "dual_purple_gold": 0.1458,
    "dual_red_blue": 0.4792,
    "dual_green_neutral": 0.2292,
    "dual_red_neutral": 0.1875,
    "dual_blue_neutral": 0.3125,
    "dual_purple_neutral": 0.375,
    "dual_gold_neutral": 0.125,
    "tri_red_blue_purple": 0.3333,
    "tri_red_green_gold": 0.2083,
    "tri_blue_purple_gold": 0.1458,
    "tri_red_purple_green": 0.2083,
    "tri_blue_green_gold": 0.2083,
    "tri_blue_purple_green": 0.4375,
    "tri_red_purple_gold": 0.0833,
    "tri_purple_green_gold": 0.2708,
    "tri_red_blue_green": 0.2083,
    "tri_red_blue_gold": 0.0833,
    "penta_prismatic_crater": 0.1875,
    "penta_free_city_sovereign": 0.1875,
    "penta_wheel_convergence": 0.3333
  },
  "mono_green_roots": {
    "mono_green_swarm": 0.4583,
    "mono_green_colossus": 0.4167,
    "mono_green_roots": 0.5,
    "mono_red_blitz": 0.4375,
    "mono_red_pyroclasm": 0.4792,
    "mono_red_dragon": 0.3125,
    "mono_blue_frost": 0.3333,
    "mono_blue_chrono": 0.4583,
    "mono_blue_abyssal": 0.3125,
    "mono_purple_crypt": 0.4375,
    "mono_purple_blood": 0.5208,
    "mono_purple_umbral": 0.5,
    "mono_gold_phalanx": 0.2917,
    "mono_gold_celestial": 0.4167,
    "mono_gold_judgment": 0.5,
    "mono_neutral_axial": 0.4167,
    "dual_red_gold": 0.1667,
    "dual_blue_purple": 0.1667,
    "dual_red_green": 0.2292,
    "dual_blue_gold": 0.1042,
    "dual_purple_green": 0.1875,
    "dual_red_purple": 0.3958,
    "dual_blue_green": 0.0833,
    "dual_green_gold": 0.2292,
    "dual_purple_gold": 0.2708,
    "dual_red_blue": 0.2083,
    "dual_green_neutral": 0.25,
    "dual_red_neutral": 0.0833,
    "dual_blue_neutral": 0.0625,
    "dual_purple_neutral": 0.2292,
    "dual_gold_neutral": 0.125,
    "tri_red_blue_purple": 0.2292,
    "tri_red_green_gold": 0.2292,
    "tri_blue_purple_gold": 0.3125,
    "tri_red_purple_green": 0.1458,
    "tri_blue_green_gold": 0.1667,
    "tri_blue_purple_green": 0.3125,
    "tri_red_purple_gold": 0.1667,
    "tri_purple_green_gold": 0.2083,
    "tri_red_blue_green": 0.1667,
    "tri_red_blue_gold": 0.0208,
    "penta_prismatic_crater": 0.1875,
    "penta_free_city_sovereign": 0.2292,
    "penta_wheel_convergence": 0.2292
  },
  "mono_red_blitz": {
    "mono_green_swarm": 0.4167,
    "mono_green_colossus": 0.5833,
    "mono_green_roots": 0.5625,
    "mono_red_blitz": 0.5,
    "mono_red_pyroclasm": 0.6875,
    "mono_red_dragon": 0.625,
    "mono_blue_frost": 0.6667,
    "mono_blue_chrono": 0.9167,
    "mono_blue_abyssal": 0.6875,
    "mono_purple_crypt": 0.6042,
    "mono_purple_blood": 0.7292,
    "mono_purple_umbral": 0.6458,
    "mono_gold_phalanx": 0.4792,
    "mono_gold_celestial": 0.5417,
    "mono_gold_judgment": 0.625,
    "mono_neutral_axial": 0.4583,
    "dual_red_gold": 0.3333,
    "dual_blue_purple": 0.5625,
    "dual_red_green": 0.5208,
    "dual_blue_gold": 0.2292,
    "dual_purple_green": 0.4792,
    "dual_red_purple": 0.3333,
    "dual_blue_green": 0.3333,
    "dual_green_gold": 0.3125,
    "dual_purple_gold": 0.2917,
    "dual_red_blue": 0.5625,
    "dual_green_neutral": 0.5,
    "dual_red_neutral": 0.3333,
    "dual_blue_neutral": 0.3542,
    "dual_purple_neutral": 0.5,
    "dual_gold_neutral": 0.3125,
    "tri_red_blue_purple": 0.5208,
    "tri_red_green_gold": 0.3125,
    "tri_blue_purple_gold": 0.25,
    "tri_red_purple_green": 0.3542,
    "tri_blue_green_gold": 0.4167,
    "tri_blue_purple_green": 0.4792,
    "tri_red_purple_gold": 0.2292,
    "tri_purple_green_gold": 0.3333,
    "tri_red_blue_green": 0.4583,
    "tri_red_blue_gold": 0.1667,
    "penta_prismatic_crater": 0.5625,
    "penta_free_city_sovereign": 0.3958,
    "penta_wheel_convergence": 0.4375
  },
  "mono_red_pyroclasm": {
    "mono_green_swarm": 0.4792,
    "mono_green_colossus": 0.6667,
    "mono_green_roots": 0.5208,
    "mono_red_blitz": 0.3125,
    "mono_red_pyroclasm": 0.5,
    "mono_red_dragon": 0.4583,
    "mono_blue_frost": 0.2917,
    "mono_blue_chrono": 0.3542,
    "mono_blue_abyssal": 0.4583,
    "mono_purple_crypt": 0.4167,
    "mono_purple_blood": 0.625,
    "mono_purple_umbral": 0.5625,
    "mono_gold_phalanx": 0.2708,
    "mono_gold_celestial": 0.375,
    "mono_gold_judgment": 0.3958,
    "mono_neutral_axial": 0.2917,
    "dual_red_gold": 0.2917,
    "dual_blue_purple": 0.3125,
    "dual_red_green": 0.25,
    "dual_blue_gold": 0.2083,
    "dual_purple_green": 0.3125,
    "dual_red_purple": 0.125,
    "dual_blue_green": 0.3125,
    "dual_green_gold": 0.1875,
    "dual_purple_gold": 0.3958,
    "dual_red_blue": 0.25,
    "dual_green_neutral": 0.3125,
    "dual_red_neutral": 0.1458,
    "dual_blue_neutral": 0.2917,
    "dual_purple_neutral": 0.2708,
    "dual_gold_neutral": 0.2708,
    "tri_red_blue_purple": 0.2917,
    "tri_red_green_gold": 0.1667,
    "tri_blue_purple_gold": 0.2708,
    "tri_red_purple_green": 0.1042,
    "tri_blue_green_gold": 0.375,
    "tri_blue_purple_green": 0.2917,
    "tri_red_purple_gold": 0.1458,
    "tri_purple_green_gold": 0.1667,
    "tri_red_blue_green": 0.3542,
    "tri_red_blue_gold": 0.1458,
    "penta_prismatic_crater": 0.3125,
    "penta_free_city_sovereign": 0.3542,
    "penta_wheel_convergence": 0.2083
  },
  "mono_red_dragon": {
    "mono_green_swarm": 0.4792,
    "mono_green_colossus": 0.6458,
    "mono_green_roots": 0.6875,
    "mono_red_blitz": 0.375,
    "mono_red_pyroclasm": 0.5417,
    "mono_red_dragon": 0.5,
    "mono_blue_frost": 0.2917,
    "mono_blue_chrono": 0.6458,
    "mono_blue_abyssal": 0.4583,
    "mono_purple_crypt": 0.5625,
    "mono_purple_blood": 0.6667,
    "mono_purple_umbral": 0.4167,
    "mono_gold_phalanx": 0.5208,
    "mono_gold_celestial": 0.5,
    "mono_gold_judgment": 0.5833,
    "mono_neutral_axial": 0.2917,
    "dual_red_gold": 0.2292,
    "dual_blue_purple": 0.3542,
    "dual_red_green": 0.3542,
    "dual_blue_gold": 0.3333,
    "dual_purple_green": 0.3333,
    "dual_red_purple": 0.2917,
    "dual_blue_green": 0.3125,
    "dual_green_gold": 0.5208,
    "dual_purple_gold": 0.5,
    "dual_red_blue": 0.4583,
    "dual_green_neutral": 0.3333,
    "dual_red_neutral": 0.2083,
    "dual_blue_neutral": 0.3333,
    "dual_purple_neutral": 0.375,
    "dual_gold_neutral": 0.3125,
    "tri_red_blue_purple": 0.4167,
    "tri_red_green_gold": 0.25,
    "tri_blue_purple_gold": 0.3125,
    "tri_red_purple_green": 0.2292,
    "tri_blue_green_gold": 0.375,
    "tri_blue_purple_green": 0.375,
    "tri_red_purple_gold": 0.3125,
    "tri_purple_green_gold": 0.2292,
    "tri_red_blue_green": 0.2917,
    "tri_red_blue_gold": 0.0417,
    "penta_prismatic_crater": 0.25,
    "penta_free_city_sovereign": 0.3542,
    "penta_wheel_convergence": 0.3125
  },
  "mono_blue_frost": {
    "mono_green_swarm": 0.5833,
    "mono_green_colossus": 0.7292,
    "mono_green_roots": 0.6667,
    "mono_red_blitz": 0.3333,
    "mono_red_pyroclasm": 0.7083,
    "mono_red_dragon": 0.7083,
    "mono_blue_frost": 0.5,
    "mono_blue_chrono": 0.4167,
    "mono_blue_abyssal": 0.75,
    "mono_purple_crypt": 0.5208,
    "mono_purple_blood": 0.5833,
    "mono_purple_umbral": 0.5625,
    "mono_gold_phalanx": 0.6875,
    "mono_gold_celestial": 0.5,
    "mono_gold_judgment": 0.4792,
    "mono_neutral_axial": 0.5625,
    "dual_red_gold": 0.4792,
    "dual_blue_purple": 0.3125,
    "dual_red_green": 0.2708,
    "dual_blue_gold": 0.375,
    "dual_purple_green": 0.4792,
    "dual_red_purple": 0.4375,
    "dual_blue_green": 0.3542,
    "dual_green_gold": 0.5625,
    "dual_purple_gold": 0.375,
    "dual_red_blue": 0.3958,
    "dual_green_neutral": 0.3542,
    "dual_red_neutral": 0.1458,
    "dual_blue_neutral": 0.3542,
    "dual_purple_neutral": 0.3542,
    "dual_gold_neutral": 0.4167,
    "tri_red_blue_purple": 0.4167,
    "tri_red_green_gold": 0.5417,
    "tri_blue_purple_gold": 0.4583,
    "tri_red_purple_green": 0.2292,
    "tri_blue_green_gold": 0.5417,
    "tri_blue_purple_green": 0.3542,
    "tri_red_purple_gold": 0.2708,
    "tri_purple_green_gold": 0.3958,
    "tri_red_blue_green": 0.3333,
    "tri_red_blue_gold": 0.2708,
    "penta_prismatic_crater": 0.375,
    "penta_free_city_sovereign": 0.2917,
    "penta_wheel_convergence": 0.3333
  },
  "mono_blue_chrono": {
    "mono_green_swarm": 0.2917,
    "mono_green_colossus": 0.6458,
    "mono_green_roots": 0.5417,
    "mono_red_blitz": 0.0833,
    "mono_red_pyroclasm": 0.6458,
    "mono_red_dragon": 0.3542,
    "mono_blue_frost": 0.5833,
    "mono_blue_chrono": 0.5,
    "mono_blue_abyssal": 0.75,
    "mono_purple_crypt": 0.5833,
    "mono_purple_blood": 0.5833,
    "mono_purple_umbral": 0.4583,
    "mono_gold_phalanx": 0.6458,
    "mono_gold_celestial": 0.7083,
    "mono_gold_judgment": 0.625,
    "mono_neutral_axial": 0.3958,
    "dual_red_gold": 0.2917,
    "dual_blue_purple": 0.5833,
    "dual_red_green": 0.2083,
    "dual_blue_gold": 0.5,
    "dual_purple_green": 0.4375,
    "dual_red_purple": 0.1042,
    "dual_blue_green": 0.6042,
    "dual_green_gold": 0.5208,
    "dual_purple_gold": 0.5,
    "dual_red_blue": 0.3542,
    "dual_green_neutral": 0.2083,
    "dual_red_neutral": 0.125,
    "dual_blue_neutral": 0.3958,
    "dual_purple_neutral": 0.4792,
    "dual_gold_neutral": 0.4375,
    "tri_red_blue_purple": 0.5208,
    "tri_red_green_gold": 0.4167,
    "tri_blue_purple_gold": 0.6042,
    "tri_red_purple_green": 0.1875,
    "tri_blue_green_gold": 0.5833,
    "tri_blue_purple_green": 0.4583,
    "tri_red_purple_gold": 0.2292,
    "tri_purple_green_gold": 0.4792,
    "tri_red_blue_green": 0.4792,
    "tri_red_blue_gold": 0.2708,
    "penta_prismatic_crater": 0.2708,
    "penta_free_city_sovereign": 0.4583,
    "penta_wheel_convergence": 0.5833
  },
  "mono_blue_abyssal": {
    "mono_green_swarm": 0.4792,
    "mono_green_colossus": 0.4583,
    "mono_green_roots": 0.6875,
    "mono_red_blitz": 0.3125,
    "mono_red_pyroclasm": 0.5417,
    "mono_red_dragon": 0.5417,
    "mono_blue_frost": 0.25,
    "mono_blue_chrono": 0.25,
    "mono_blue_abyssal": 0.5,
    "mono_purple_crypt": 0.4583,
    "mono_purple_blood": 0.5625,
    "mono_purple_umbral": 0.375,
    "mono_gold_phalanx": 0.4167,
    "mono_gold_celestial": 0.5833,
    "mono_gold_judgment": 0.5417,
    "mono_neutral_axial": 0.4167,
    "dual_red_gold": 0.25,
    "dual_blue_purple": 0.4167,
    "dual_red_green": 0.2083,
    "dual_blue_gold": 0.3333,
    "dual_purple_green": 0.3333,
    "dual_red_purple": 0.3125,
    "dual_blue_green": 0.2708,
    "dual_green_gold": 0.3125,
    "dual_purple_gold": 0.2708,
    "dual_red_blue": 0.2708,
    "dual_green_neutral": 0.2083,
    "dual_red_neutral": 0.0625,
    "dual_blue_neutral": 0.2083,
    "dual_purple_neutral": 0.3125,
    "dual_gold_neutral": 0.3125,
    "tri_red_blue_purple": 0.3125,
    "tri_red_green_gold": 0.1875,
    "tri_blue_purple_gold": 0.2083,
    "tri_red_purple_green": 0.0833,
    "tri_blue_green_gold": 0.2917,
    "tri_blue_purple_green": 0.2917,
    "tri_red_purple_gold": 0.2083,
    "tri_purple_green_gold": 0.2708,
    "tri_red_blue_green": 0.2708,
    "tri_red_blue_gold": 0.1042,
    "penta_prismatic_crater": 0.1667,
    "penta_free_city_sovereign": 0.2292,
    "penta_wheel_convergence": 0.25
  },
  "mono_purple_crypt": {
    "mono_green_swarm": 0.2708,
    "mono_green_colossus": 0.5,
    "mono_green_roots": 0.5625,
    "mono_red_blitz": 0.3958,
    "mono_red_pyroclasm": 0.5833,
    "mono_red_dragon": 0.4375,
    "mono_blue_frost": 0.4792,
    "mono_blue_chrono": 0.4167,
    "mono_blue_abyssal": 0.5417,
    "mono_purple_crypt": 0.5,
    "mono_purple_blood": 0.7083,
    "mono_purple_umbral": 0.5,
    "mono_gold_phalanx": 0.25,
    "mono_gold_celestial": 0.3125,
    "mono_gold_judgment": 0.3542,
    "mono_neutral_axial": 0.625,
    "dual_red_gold": 0.2708,
    "dual_blue_purple": 0.4167,
    "dual_red_green": 0.2708,
    "dual_blue_gold": 0.375,
    "dual_purple_green": 0.1667,
    "dual_red_purple": 0.3125,
    "dual_blue_green": 0.2083,
    "dual_green_gold": 0.1667,
    "dual_purple_gold": 0.1875,
    "dual_red_blue": 0.3125,
    "dual_green_neutral": 0.2917,
    "dual_red_neutral": 0.125,
    "dual_blue_neutral": 0.25,
    "dual_purple_neutral": 0.3958,
    "dual_gold_neutral": 0.2708,
    "tri_red_blue_purple": 0.4375,
    "tri_red_green_gold": 0.2708,
    "tri_blue_purple_gold": 0.4792,
    "tri_red_purple_green": 0.125,
    "tri_blue_green_gold": 0.2917,
    "tri_blue_purple_green": 0.5208,
    "tri_red_purple_gold": 0.1667,
    "tri_purple_green_gold": 0.2917,
    "tri_red_blue_green": 0.2917,
    "tri_red_blue_gold": 0.1875,
    "penta_prismatic_crater": 0.3125,
    "penta_free_city_sovereign": 0.1458,
    "penta_wheel_convergence": 0.2917
  },
  "mono_purple_blood": {
    "mono_green_swarm": 0.3958,
    "mono_green_colossus": 0.3958,
    "mono_green_roots": 0.4792,
    "mono_red_blitz": 0.2708,
    "mono_red_pyroclasm": 0.375,
    "mono_red_dragon": 0.3333,
    "mono_blue_frost": 0.4167,
    "mono_blue_chrono": 0.4167,
    "mono_blue_abyssal": 0.4375,
    "mono_purple_crypt": 0.2917,
    "mono_purple_blood": 0.5,
    "mono_purple_umbral": 0.5,
    "mono_gold_phalanx": 0.3542,
    "mono_gold_celestial": 0.1667,
    "mono_gold_judgment": 0.3542,
    "mono_neutral_axial": 0.2917,
    "dual_red_gold": 0.1875,
    "dual_blue_purple": 0.3958,
    "dual_red_green": 0.2708,
    "dual_blue_gold": 0.125,
    "dual_purple_green": 0.25,
    "dual_red_purple": 0.2708,
    "dual_blue_green": 0.2083,
    "dual_green_gold": 0.2083,
    "dual_purple_gold": 0.1458,
    "dual_red_blue": 0.25,
    "dual_green_neutral": 0.2083,
    "dual_red_neutral": 0.1667,
    "dual_blue_neutral": 0.2083,
    "dual_purple_neutral": 0.4167,
    "dual_gold_neutral": 0.1667,
    "tri_red_blue_purple": 0.5,
    "tri_red_green_gold": 0.1875,
    "tri_blue_purple_gold": 0.2708,
    "tri_red_purple_green": 0.1875,
    "tri_blue_green_gold": 0.25,
    "tri_blue_purple_green": 0.3125,
    "tri_red_purple_gold": 0.0417,
    "tri_purple_green_gold": 0.1042,
    "tri_red_blue_green": 0.2917,
    "tri_red_blue_gold": 0.0833,
    "penta_prismatic_crater": 0.2917,
    "penta_free_city_sovereign": 0.1875,
    "penta_wheel_convergence": 0.25
  },
  "mono_purple_umbral": {
    "mono_green_swarm": 0.4375,
    "mono_green_colossus": 0.5208,
    "mono_green_roots": 0.5,
    "mono_red_blitz": 0.3542,
    "mono_red_pyroclasm": 0.4375,
    "mono_red_dragon": 0.5833,
    "mono_blue_frost": 0.4375,
    "mono_blue_chrono": 0.5417,
    "mono_blue_abyssal": 0.625,
    "mono_purple_crypt": 0.5,
    "mono_purple_blood": 0.5,
    "mono_purple_umbral": 0.5,
    "mono_gold_phalanx": 0.4583,
    "mono_gold_celestial": 0.4583,
    "mono_gold_judgment": 0.5,
    "mono_neutral_axial": 0.3958,
    "dual_red_gold": 0.5208,
    "dual_blue_purple": 0.5417,
    "dual_red_green": 0.2083,
    "dual_blue_gold": 0.3333,
    "dual_purple_green": 0.3333,
    "dual_red_purple": 0.2917,
    "dual_blue_green": 0.4167,
    "dual_green_gold": 0.2292,
    "dual_purple_gold": 0.2917,
    "dual_red_blue": 0.3542,
    "dual_green_neutral": 0.1458,
    "dual_red_neutral": 0.125,
    "dual_blue_neutral": 0.2917,
    "dual_purple_neutral": 0.2917,
    "dual_gold_neutral": 0.3125,
    "tri_red_blue_purple": 0.4375,
    "tri_red_green_gold": 0.25,
    "tri_blue_purple_gold": 0.4167,
    "tri_red_purple_green": 0.2083,
    "tri_blue_green_gold": 0.2917,
    "tri_blue_purple_green": 0.5625,
    "tri_red_purple_gold": 0.1875,
    "tri_purple_green_gold": 0.2083,
    "tri_red_blue_green": 0.4583,
    "tri_red_blue_gold": 0.2708,
    "penta_prismatic_crater": 0.4792,
    "penta_free_city_sovereign": 0.2708,
    "penta_wheel_convergence": 0.2917
  },
  "mono_gold_phalanx": {
    "mono_green_swarm": 0.6458,
    "mono_green_colossus": 0.5833,
    "mono_green_roots": 0.7083,
    "mono_red_blitz": 0.5208,
    "mono_red_pyroclasm": 0.7292,
    "mono_red_dragon": 0.4792,
    "mono_blue_frost": 0.3125,
    "mono_blue_chrono": 0.3542,
    "mono_blue_abyssal": 0.5833,
    "mono_purple_crypt": 0.75,
    "mono_purple_blood": 0.6458,
    "mono_purple_umbral": 0.5417,
    "mono_gold_phalanx": 0.5,
    "mono_gold_celestial": 0.625,
    "mono_gold_judgment": 0.7292,
    "mono_neutral_axial": 0.5625,
    "dual_red_gold": 0.2917,
    "dual_blue_purple": 0.3125,
    "dual_red_green": 0.3333,
    "dual_blue_gold": 0.2917,
    "dual_purple_green": 0.3958,
    "dual_red_purple": 0.4792,
    "dual_blue_green": 0.3542,
    "dual_green_gold": 0.3125,
    "dual_purple_gold": 0.4375,
    "dual_red_blue": 0.2917,
    "dual_green_neutral": 0.2708,
    "dual_red_neutral": 0.2708,
    "dual_blue_neutral": 0.3958,
    "dual_purple_neutral": 0.5625,
    "dual_gold_neutral": 0.1458,
    "tri_red_blue_purple": 0.3333,
    "tri_red_green_gold": 0.3958,
    "tri_blue_purple_gold": 0.4167,
    "tri_red_purple_green": 0.2708,
    "tri_blue_green_gold": 0.25,
    "tri_blue_purple_green": 0.3958,
    "tri_red_purple_gold": 0.4167,
    "tri_purple_green_gold": 0.4375,
    "tri_red_blue_green": 0.25,
    "tri_red_blue_gold": 0.1042,
    "penta_prismatic_crater": 0.2292,
    "penta_free_city_sovereign": 0.2292,
    "penta_wheel_convergence": 0.3125
  },
  "mono_gold_celestial": {
    "mono_green_swarm": 0.4375,
    "mono_green_colossus": 0.7292,
    "mono_green_roots": 0.5833,
    "mono_red_blitz": 0.4583,
    "mono_red_pyroclasm": 0.625,
    "mono_red_dragon": 0.5,
    "mono_blue_frost": 0.5,
    "mono_blue_chrono": 0.2917,
    "mono_blue_abyssal": 0.4167,
    "mono_purple_crypt": 0.6875,
    "mono_purple_blood": 0.8333,
    "mono_purple_umbral": 0.5417,
    "mono_gold_phalanx": 0.375,
    "mono_gold_celestial": 0.5,
    "mono_gold_judgment": 0.5208,
    "mono_neutral_axial": 0.4792,
    "dual_red_gold": 0.25,
    "dual_blue_purple": 0.3542,
    "dual_red_green": 0.375,
    "dual_blue_gold": 0.3958,
    "dual_purple_green": 0.3958,
    "dual_red_purple": 0.4792,
    "dual_blue_green": 0.3125,
    "dual_green_gold": 0.3542,
    "dual_purple_gold": 0.3333,
    "dual_red_blue": 0.3542,
    "dual_green_neutral": 0.3125,
    "dual_red_neutral": 0.2708,
    "dual_blue_neutral": 0.3958,
    "dual_purple_neutral": 0.6042,
    "dual_gold_neutral": 0.4167,
    "tri_red_blue_purple": 0.3542,
    "tri_red_green_gold": 0.2083,
    "tri_blue_purple_gold": 0.2708,
    "tri_red_purple_green": 0.2917,
    "tri_blue_green_gold": 0.2292,
    "tri_blue_purple_green": 0.3958,
    "tri_red_purple_gold": 0.1875,
    "tri_purple_green_gold": 0.2708,
    "tri_red_blue_green": 0.3542,
    "tri_red_blue_gold": 0.0833,
    "penta_prismatic_crater": 0.1667,
    "penta_free_city_sovereign": 0.2917,
    "penta_wheel_convergence": 0.3125
  },
  "mono_gold_judgment": {
    "mono_green_swarm": 0.4375,
    "mono_green_colossus": 0.5625,
    "mono_green_roots": 0.5,
    "mono_red_blitz": 0.375,
    "mono_red_pyroclasm": 0.6042,
    "mono_red_dragon": 0.4167,
    "mono_blue_frost": 0.5208,
    "mono_blue_chrono": 0.375,
    "mono_blue_abyssal": 0.4583,
    "mono_purple_crypt": 0.6458,
    "mono_purple_blood": 0.6458,
    "mono_purple_umbral": 0.5,
    "mono_gold_phalanx": 0.2708,
    "mono_gold_celestial": 0.4792,
    "mono_gold_judgment": 0.5,
    "mono_neutral_axial": 0.4583,
    "dual_red_gold": 0.25,
    "dual_blue_purple": 0.25,
    "dual_red_green": 0.2708,
    "dual_blue_gold": 0.25,
    "dual_purple_green": 0.3125,
    "dual_red_purple": 0.375,
    "dual_blue_green": 0.1458,
    "dual_green_gold": 0.2917,
    "dual_purple_gold": 0.2083,
    "dual_red_blue": 0.25,
    "dual_green_neutral": 0.25,
    "dual_red_neutral": 0.1667,
    "dual_blue_neutral": 0.3125,
    "dual_purple_neutral": 0.4375,
    "dual_gold_neutral": 0.4583,
    "tri_red_blue_purple": 0.2917,
    "tri_red_green_gold": 0.1042,
    "tri_blue_purple_gold": 0.2083,
    "tri_red_purple_green": 0.1667,
    "tri_blue_green_gold": 0.3125,
    "tri_blue_purple_green": 0.3125,
    "tri_red_purple_gold": 0.1667,
    "tri_purple_green_gold": 0.1458,
    "tri_red_blue_green": 0.2917,
    "tri_red_blue_gold": 0.1458,
    "penta_prismatic_crater": 0.2708,
    "penta_free_city_sovereign": 0.25,
    "penta_wheel_convergence": 0.1667
  },
  "mono_neutral_axial": {
    "mono_green_swarm": 0.5208,
    "mono_green_colossus": 0.5208,
    "mono_green_roots": 0.5833,
    "mono_red_blitz": 0.5417,
    "mono_red_pyroclasm": 0.7083,
    "mono_red_dragon": 0.7083,
    "mono_blue_frost": 0.4375,
    "mono_blue_chrono": 0.6042,
    "mono_blue_abyssal": 0.5833,
    "mono_purple_crypt": 0.375,
    "mono_purple_blood": 0.7083,
    "mono_purple_umbral": 0.6042,
    "mono_gold_phalanx": 0.4375,
    "mono_gold_celestial": 0.5208,
    "mono_gold_judgment": 0.5417,
    "mono_neutral_axial": 0.5,
    "dual_red_gold": 0.3125,
    "dual_blue_purple": 0.4583,
    "dual_red_green": 0.3125,
    "dual_blue_gold": 0.25,
    "dual_purple_green": 0.375,
    "dual_red_purple": 0.5833,
    "dual_blue_green": 0.4375,
    "dual_green_gold": 0.3333,
    "dual_purple_gold": 0.25,
    "dual_red_blue": 0.375,
    "dual_green_neutral": 0.2917,
    "dual_red_neutral": 0.2292,
    "dual_blue_neutral": 0.3333,
    "dual_purple_neutral": 0.7292,
    "dual_gold_neutral": 0.2708,
    "tri_red_blue_purple": 0.4792,
    "tri_red_green_gold": 0.1667,
    "tri_blue_purple_gold": 0.3542,
    "tri_red_purple_green": 0.2917,
    "tri_blue_green_gold": 0.3333,
    "tri_blue_purple_green": 0.4167,
    "tri_red_purple_gold": 0.25,
    "tri_purple_green_gold": 0.3542,
    "tri_red_blue_green": 0.3958,
    "tri_red_blue_gold": 0.25,
    "penta_prismatic_crater": 0.3542,
    "penta_free_city_sovereign": 0.3542,
    "penta_wheel_convergence": 0.3333
  },
  "dual_red_gold": {
    "mono_green_swarm": 0.7083,
    "mono_green_colossus": 0.8125,
    "mono_green_roots": 0.8333,
    "mono_red_blitz": 0.6667,
    "mono_red_pyroclasm": 0.7083,
    "mono_red_dragon": 0.7708,
    "mono_blue_frost": 0.5208,
    "mono_blue_chrono": 0.7083,
    "mono_blue_abyssal": 0.75,
    "mono_purple_crypt": 0.7292,
    "mono_purple_blood": 0.8125,
    "mono_purple_umbral": 0.4792,
    "mono_gold_phalanx": 0.7083,
    "mono_gold_celestial": 0.75,
    "mono_gold_judgment": 0.75,
    "mono_neutral_axial": 0.6875,
    "dual_red_gold": 0.5,
    "dual_blue_purple": 0.5208,
    "dual_red_green": 0.5833,
    "dual_blue_gold": 0.6042,
    "dual_purple_green": 0.6458,
    "dual_red_purple": 0.5208,
    "dual_blue_green": 0.4792,
    "dual_green_gold": 0.5833,
    "dual_purple_gold": 0.5417,
    "dual_red_blue": 0.5625,
    "dual_green_neutral": 0.5417,
    "dual_red_neutral": 0.4583,
    "dual_blue_neutral": 0.5625,
    "dual_purple_neutral": 0.8542,
    "dual_gold_neutral": 0.6458,
    "tri_red_blue_purple": 0.6667,
    "tri_red_green_gold": 0.6875,
    "tri_blue_purple_gold": 0.5417,
    "tri_red_purple_green": 0.2917,
    "tri_blue_green_gold": 0.5,
    "tri_blue_purple_green": 0.6458,
    "tri_red_purple_gold": 0.5625,
    "tri_purple_green_gold": 0.4375,
    "tri_red_blue_green": 0.5,
    "tri_red_blue_gold": 0.375,
    "penta_prismatic_crater": 0.625,
    "penta_free_city_sovereign": 0.75,
    "penta_wheel_convergence": 0.5417
  },
  "dual_blue_purple": {
    "mono_green_swarm": 0.5417,
    "mono_green_colossus": 0.6458,
    "mono_green_roots": 0.8333,
    "mono_red_blitz": 0.4375,
    "mono_red_pyroclasm": 0.6875,
    "mono_red_dragon": 0.6458,
    "mono_blue_frost": 0.6875,
    "mono_blue_chrono": 0.4167,
    "mono_blue_abyssal": 0.5833,
    "mono_purple_crypt": 0.5833,
    "mono_purple_blood": 0.6042,
    "mono_purple_umbral": 0.4583,
    "mono_gold_phalanx": 0.6875,
    "mono_gold_celestial": 0.6458,
    "mono_gold_judgment": 0.75,
    "mono_neutral_axial": 0.5417,
    "dual_red_gold": 0.4792,
    "dual_blue_purple": 0.5,
    "dual_red_green": 0.3125,
    "dual_blue_gold": 0.3542,
    "dual_purple_green": 0.5208,
    "dual_red_purple": 0.4792,
    "dual_blue_green": 0.5208,
    "dual_green_gold": 0.5417,
    "dual_purple_gold": 0.5833,
    "dual_red_blue": 0.3958,
    "dual_green_neutral": 0.4792,
    "dual_red_neutral": 0.1875,
    "dual_blue_neutral": 0.4167,
    "dual_purple_neutral": 0.4792,
    "dual_gold_neutral": 0.4583,
    "tri_red_blue_purple": 0.5417,
    "tri_red_green_gold": 0.4167,
    "tri_blue_purple_gold": 0.4167,
    "tri_red_purple_green": 0.2292,
    "tri_blue_green_gold": 0.4167,
    "tri_blue_purple_green": 0.4167,
    "tri_red_purple_gold": 0.3958,
    "tri_purple_green_gold": 0.25,
    "tri_red_blue_green": 0.5,
    "tri_red_blue_gold": 0.2292,
    "penta_prismatic_crater": 0.3333,
    "penta_free_city_sovereign": 0.5,
    "penta_wheel_convergence": 0.4167
  },
  "dual_red_green": {
    "mono_green_swarm": 0.5625,
    "mono_green_colossus": 0.6667,
    "mono_green_roots": 0.7708,
    "mono_red_blitz": 0.4792,
    "mono_red_pyroclasm": 0.75,
    "mono_red_dragon": 0.6458,
    "mono_blue_frost": 0.7292,
    "mono_blue_chrono": 0.7917,
    "mono_blue_abyssal": 0.7917,
    "mono_purple_crypt": 0.7292,
    "mono_purple_blood": 0.7292,
    "mono_purple_umbral": 0.7917,
    "mono_gold_phalanx": 0.6667,
    "mono_gold_celestial": 0.625,
    "mono_gold_judgment": 0.7292,
    "mono_neutral_axial": 0.6875,
    "dual_red_gold": 0.4167,
    "dual_blue_purple": 0.6875,
    "dual_red_green": 0.5,
    "dual_blue_gold": 0.6042,
    "dual_purple_green": 0.5833,
    "dual_red_purple": 0.4167,
    "dual_blue_green": 0.625,
    "dual_green_gold": 0.6458,
    "dual_purple_gold": 0.5625,
    "dual_red_blue": 0.5,
    "dual_green_neutral": 0.4375,
    "dual_red_neutral": 0.2917,
    "dual_blue_neutral": 0.5,
    "dual_purple_neutral": 0.7708,
    "dual_gold_neutral": 0.4583,
    "tri_red_blue_purple": 0.6458,
    "tri_red_green_gold": 0.5417,
    "tri_blue_purple_gold": 0.5208,
    "tri_red_purple_green": 0.2917,
    "tri_blue_green_gold": 0.5625,
    "tri_blue_purple_green": 0.6667,
    "tri_red_purple_gold": 0.625,
    "tri_purple_green_gold": 0.5208,
    "tri_red_blue_green": 0.3333,
    "tri_red_blue_gold": 0.3958,
    "penta_prismatic_crater": 0.4375,
    "penta_free_city_sovereign": 0.7083,
    "penta_wheel_convergence": 0.5
  },
  "dual_blue_gold": {
    "mono_green_swarm": 0.7083,
    "mono_green_colossus": 0.6667,
    "mono_green_roots": 0.8958,
    "mono_red_blitz": 0.7708,
    "mono_red_pyroclasm": 0.7917,
    "mono_red_dragon": 0.6667,
    "mono_blue_frost": 0.625,
    "mono_blue_chrono": 0.5,
    "mono_blue_abyssal": 0.6667,
    "mono_purple_crypt": 0.625,
    "mono_purple_blood": 0.875,
    "mono_purple_umbral": 0.6667,
    "mono_gold_phalanx": 0.7083,
    "mono_gold_celestial": 0.6042,
    "mono_gold_judgment": 0.75,
    "mono_neutral_axial": 0.75,
    "dual_red_gold": 0.3958,
    "dual_blue_purple": 0.6458,
    "dual_red_green": 0.3958,
    "dual_blue_gold": 0.5,
    "dual_purple_green": 0.5,
    "dual_red_purple": 0.625,
    "dual_blue_green": 0.6042,
    "dual_green_gold": 0.4375,
    "dual_purple_gold": 0.5,
    "dual_red_blue": 0.6875,
    "dual_green_neutral": 0.3958,
    "dual_red_neutral": 0.2917,
    "dual_blue_neutral": 0.5,
    "dual_purple_neutral": 0.6875,
    "dual_gold_neutral": 0.6875,
    "tri_red_blue_purple": 0.5625,
    "tri_red_green_gold": 0.4375,
    "tri_blue_purple_gold": 0.5417,
    "tri_red_purple_green": 0.3125,
    "tri_blue_green_gold": 0.5208,
    "tri_blue_purple_green": 0.625,
    "tri_red_purple_gold": 0.4167,
    "tri_purple_green_gold": 0.4792,
    "tri_red_blue_green": 0.3333,
    "tri_red_blue_gold": 0.3333,
    "penta_prismatic_crater": 0.3542,
    "penta_free_city_sovereign": 0.3958,
    "penta_wheel_convergence": 0.5208
  },
  "dual_purple_green": {
    "mono_green_swarm": 0.6458,
    "mono_green_colossus": 0.7292,
    "mono_green_roots": 0.8125,
    "mono_red_blitz": 0.5208,
    "mono_red_pyroclasm": 0.6875,
    "mono_red_dragon": 0.6667,
    "mono_blue_frost": 0.5208,
    "mono_blue_chrono": 0.5625,
    "mono_blue_abyssal": 0.6667,
    "mono_purple_crypt": 0.8333,
    "mono_purple_blood": 0.75,
    "mono_purple_umbral": 0.6667,
    "mono_gold_phalanx": 0.6042,
    "mono_gold_celestial": 0.6042,
    "mono_gold_judgment": 0.6875,
    "mono_neutral_axial": 0.625,
    "dual_red_gold": 0.3542,
    "dual_blue_purple": 0.4792,
    "dual_red_green": 0.4167,
    "dual_blue_gold": 0.5,
    "dual_purple_green": 0.5,
    "dual_red_purple": 0.6042,
    "dual_blue_green": 0.2917,
    "dual_green_gold": 0.4583,
    "dual_purple_gold": 0.3958,
    "dual_red_blue": 0.375,
    "dual_green_neutral": 0.3542,
    "dual_red_neutral": 0.5417,
    "dual_blue_neutral": 0.4583,
    "dual_purple_neutral": 0.6458,
    "dual_gold_neutral": 0.4167,
    "tri_red_blue_purple": 0.5208,
    "tri_red_green_gold": 0.4167,
    "tri_blue_purple_gold": 0.375,
    "tri_red_purple_green": 0.375,
    "tri_blue_green_gold": 0.5,
    "tri_blue_purple_green": 0.625,
    "tri_red_purple_gold": 0.3542,
    "tri_purple_green_gold": 0.5,
    "tri_red_blue_green": 0.3542,
    "tri_red_blue_gold": 0.25,
    "penta_prismatic_crater": 0.4583,
    "penta_free_city_sovereign": 0.5417,
    "penta_wheel_convergence": 0.4167
  },
  "dual_red_purple": {
    "mono_green_swarm": 0.5833,
    "mono_green_colossus": 0.5833,
    "mono_green_roots": 0.6042,
    "mono_red_blitz": 0.6667,
    "mono_red_pyroclasm": 0.875,
    "mono_red_dragon": 0.7083,
    "mono_blue_frost": 0.5625,
    "mono_blue_chrono": 0.8958,
    "mono_blue_abyssal": 0.6875,
    "mono_purple_crypt": 0.6875,
    "mono_purple_blood": 0.7292,
    "mono_purple_umbral": 0.7083,
    "mono_gold_phalanx": 0.5208,
    "mono_gold_celestial": 0.5208,
    "mono_gold_judgment": 0.625,
    "mono_neutral_axial": 0.4167,
    "dual_red_gold": 0.4792,
    "dual_blue_purple": 0.5208,
    "dual_red_green": 0.5833,
    "dual_blue_gold": 0.375,
    "dual_purple_green": 0.3958,
    "dual_red_purple": 0.5,
    "dual_blue_green": 0.4583,
    "dual_green_gold": 0.3958,
    "dual_purple_gold": 0.2917,
    "dual_red_blue": 0.5208,
    "dual_green_neutral": 0.375,
    "dual_red_neutral": 0.3958,
    "dual_blue_neutral": 0.6458,
    "dual_purple_neutral": 0.625,
    "dual_gold_neutral": 0.375,
    "tri_red_blue_purple": 0.5625,
    "tri_red_green_gold": 0.3333,
    "tri_blue_purple_gold": 0.4375,
    "tri_red_purple_green": 0.375,
    "tri_blue_green_gold": 0.5208,
    "tri_blue_purple_green": 0.6875,
    "tri_red_purple_gold": 0.375,
    "tri_purple_green_gold": 0.375,
    "tri_red_blue_green": 0.4792,
    "tri_red_blue_gold": 0.2292,
    "penta_prismatic_crater": 0.5625,
    "penta_free_city_sovereign": 0.4792,
    "penta_wheel_convergence": 0.5
  },
  "dual_blue_green": {
    "mono_green_swarm": 0.6458,
    "mono_green_colossus": 0.8542,
    "mono_green_roots": 0.9167,
    "mono_red_blitz": 0.6667,
    "mono_red_pyroclasm": 0.6875,
    "mono_red_dragon": 0.6875,
    "mono_blue_frost": 0.6458,
    "mono_blue_chrono": 0.3958,
    "mono_blue_abyssal": 0.7292,
    "mono_purple_crypt": 0.7917,
    "mono_purple_blood": 0.7917,
    "mono_purple_umbral": 0.5833,
    "mono_gold_phalanx": 0.6458,
    "mono_gold_celestial": 0.6875,
    "mono_gold_judgment": 0.8542,
    "mono_neutral_axial": 0.5625,
    "dual_red_gold": 0.5208,
    "dual_blue_purple": 0.4792,
    "dual_red_green": 0.375,
    "dual_blue_gold": 0.3958,
    "dual_purple_green": 0.7083,
    "dual_red_purple": 0.5417,
    "dual_blue_green": 0.5,
    "dual_green_gold": 0.6875,
    "dual_purple_gold": 0.5417,
    "dual_red_blue": 0.5625,
    "dual_green_neutral": 0.5417,
    "dual_red_neutral": 0.2708,
    "dual_blue_neutral": 0.4583,
    "dual_purple_neutral": 0.625,
    "dual_gold_neutral": 0.625,
    "tri_red_blue_purple": 0.6667,
    "tri_red_green_gold": 0.6458,
    "tri_blue_purple_gold": 0.6458,
    "tri_red_purple_green": 0.3125,
    "tri_blue_green_gold": 0.5208,
    "tri_blue_purple_green": 0.5208,
    "tri_red_purple_gold": 0.25,
    "tri_purple_green_gold": 0.5625,
    "tri_red_blue_green": 0.5625,
    "tri_red_blue_gold": 0.3958,
    "penta_prismatic_crater": 0.3542,
    "penta_free_city_sovereign": 0.4375,
    "penta_wheel_convergence": 0.6458
  },
  "dual_green_gold": {
    "mono_green_swarm": 0.6667,
    "mono_green_colossus": 0.6042,
    "mono_green_roots": 0.7708,
    "mono_red_blitz": 0.6875,
    "mono_red_pyroclasm": 0.8125,
    "mono_red_dragon": 0.4792,
    "mono_blue_frost": 0.4375,
    "mono_blue_chrono": 0.4792,
    "mono_blue_abyssal": 0.6875,
    "mono_purple_crypt": 0.8333,
    "mono_purple_blood": 0.7917,
    "mono_purple_umbral": 0.7708,
    "mono_gold_phalanx": 0.6875,
    "mono_gold_celestial": 0.6458,
    "mono_gold_judgment": 0.7083,
    "mono_neutral_axial": 0.6667,
    "dual_red_gold": 0.4167,
    "dual_blue_purple": 0.4583,
    "dual_red_green": 0.3542,
    "dual_blue_gold": 0.5625,
    "dual_purple_green": 0.5417,
    "dual_red_purple": 0.6042,
    "dual_blue_green": 0.3125,
    "dual_green_gold": 0.5,
    "dual_purple_gold": 0.4375,
    "dual_red_blue": 0.5,
    "dual_green_neutral": 0.4583,
    "dual_red_neutral": 0.2917,
    "dual_blue_neutral": 0.5,
    "dual_purple_neutral": 0.6667,
    "dual_gold_neutral": 0.3958,
    "tri_red_blue_purple": 0.4792,
    "tri_red_green_gold": 0.4792,
    "tri_blue_purple_gold": 0.7083,
    "tri_red_purple_green": 0.3125,
    "tri_blue_green_gold": 0.4167,
    "tri_blue_purple_green": 0.5208,
    "tri_red_purple_gold": 0.3333,
    "tri_purple_green_gold": 0.3542,
    "tri_red_blue_green": 0.3542,
    "tri_red_blue_gold": 0.2708,
    "penta_prismatic_crater": 0.4583,
    "penta_free_city_sovereign": 0.5417,
    "penta_wheel_convergence": 0.4375
  },
  "dual_purple_gold": {
    "mono_green_swarm": 0.7917,
    "mono_green_colossus": 0.8542,
    "mono_green_roots": 0.7292,
    "mono_red_blitz": 0.7083,
    "mono_red_pyroclasm": 0.6042,
    "mono_red_dragon": 0.5,
    "mono_blue_frost": 0.625,
    "mono_blue_chrono": 0.5,
    "mono_blue_abyssal": 0.7292,
    "mono_purple_crypt": 0.8125,
    "mono_purple_blood": 0.8542,
    "mono_purple_umbral": 0.7083,
    "mono_gold_phalanx": 0.5625,
    "mono_gold_celestial": 0.6667,
    "mono_gold_judgment": 0.7917,
    "mono_neutral_axial": 0.75,
    "dual_red_gold": 0.4583,
    "dual_blue_purple": 0.4167,
    "dual_red_green": 0.4375,
    "dual_blue_gold": 0.5,
    "dual_purple_green": 0.6042,
    "dual_red_purple": 0.7083,
    "dual_blue_green": 0.4583,
    "dual_green_gold": 0.5625,
    "dual_purple_gold": 0.5,
    "dual_red_blue": 0.4375,
    "dual_green_neutral": 0.3958,
    "dual_red_neutral": 0.5,
    "dual_blue_neutral": 0.5833,
    "dual_purple_neutral": 0.6875,
    "dual_gold_neutral": 0.4167,
    "tri_red_blue_purple": 0.5833,
    "tri_red_green_gold": 0.4792,
    "tri_blue_purple_gold": 0.4375,
    "tri_red_purple_green": 0.375,
    "tri_blue_green_gold": 0.3125,
    "tri_blue_purple_green": 0.6458,
    "tri_red_purple_gold": 0.4167,
    "tri_purple_green_gold": 0.5417,
    "tri_red_blue_green": 0.5625,
    "tri_red_blue_gold": 0.2708,
    "penta_prismatic_crater": 0.3958,
    "penta_free_city_sovereign": 0.4792,
    "penta_wheel_convergence": 0.3542
  },
  "dual_red_blue": {
    "mono_green_swarm": 0.4583,
    "mono_green_colossus": 0.5208,
    "mono_green_roots": 0.7917,
    "mono_red_blitz": 0.4375,
    "mono_red_pyroclasm": 0.75,
    "mono_red_dragon": 0.5417,
    "mono_blue_frost": 0.6042,
    "mono_blue_chrono": 0.6458,
    "mono_blue_abyssal": 0.7292,
    "mono_purple_crypt": 0.6875,
    "mono_purple_blood": 0.75,
    "mono_purple_umbral": 0.6458,
    "mono_gold_phalanx": 0.7083,
    "mono_gold_celestial": 0.6458,
    "mono_gold_judgment": 0.75,
    "mono_neutral_axial": 0.625,
    "dual_red_gold": 0.4375,
    "dual_blue_purple": 0.6042,
    "dual_red_green": 0.5,
    "dual_blue_gold": 0.3125,
    "dual_purple_green": 0.625,
    "dual_red_purple": 0.4792,
    "dual_blue_green": 0.4375,
    "dual_green_gold": 0.5,
    "dual_purple_gold": 0.5625,
    "dual_red_blue": 0.5,
    "dual_green_neutral": 0.4375,
    "dual_red_neutral": 0.25,
    "dual_blue_neutral": 0.4583,
    "dual_purple_neutral": 0.625,
    "dual_gold_neutral": 0.4375,
    "tri_red_blue_purple": 0.4792,
    "tri_red_green_gold": 0.5208,
    "tri_blue_purple_gold": 0.5417,
    "tri_red_purple_green": 0.3333,
    "tri_blue_green_gold": 0.5208,
    "tri_blue_purple_green": 0.625,
    "tri_red_purple_gold": 0.2292,
    "tri_purple_green_gold": 0.4792,
    "tri_red_blue_green": 0.5417,
    "tri_red_blue_gold": 0.2083,
    "penta_prismatic_crater": 0.4792,
    "penta_free_city_sovereign": 0.5208,
    "penta_wheel_convergence": 0.5417
  },
  "dual_green_neutral": {
    "mono_green_swarm": 0.7292,
    "mono_green_colossus": 0.7708,
    "mono_green_roots": 0.75,
    "mono_red_blitz": 0.5,
    "mono_red_pyroclasm": 0.6875,
    "mono_red_dragon": 0.6667,
    "mono_blue_frost": 0.6458,
    "mono_blue_chrono": 0.7917,
    "mono_blue_abyssal": 0.7917,
    "mono_purple_crypt": 0.7083,
    "mono_purple_blood": 0.7917,
    "mono_purple_umbral": 0.8542,
    "mono_gold_phalanx": 0.7292,
    "mono_gold_celestial": 0.6875,
    "mono_gold_judgment": 0.75,
    "mono_neutral_axial": 0.7083,
    "dual_red_gold": 0.4583,
    "dual_blue_purple": 0.5208,
    "dual_red_green": 0.5625,
    "dual_blue_gold": 0.6042,
    "dual_purple_green": 0.6458,
    "dual_red_purple": 0.625,
    "dual_blue_green": 0.4583,
    "dual_green_gold": 0.5417,
    "dual_purple_gold": 0.6042,
    "dual_red_blue": 0.5625,
    "dual_green_neutral": 0.5,
    "dual_red_neutral": 0.3125,
    "dual_blue_neutral": 0.6042,
    "dual_purple_neutral": 0.7292,
    "dual_gold_neutral": 0.5208,
    "tri_red_blue_purple": 0.6667,
    "tri_red_green_gold": 0.5625,
    "tri_blue_purple_gold": 0.6667,
    "tri_red_purple_green": 0.375,
    "tri_blue_green_gold": 0.4583,
    "tri_blue_purple_green": 0.5625,
    "tri_red_purple_gold": 0.4583,
    "tri_purple_green_gold": 0.4167,
    "tri_red_blue_green": 0.5625,
    "tri_red_blue_gold": 0.4792,
    "penta_prismatic_crater": 0.5,
    "penta_free_city_sovereign": 0.5417,
    "penta_wheel_convergence": 0.5208
  },
  "dual_red_neutral": {
    "mono_green_swarm": 0.8125,
    "mono_green_colossus": 0.8125,
    "mono_green_roots": 0.9167,
    "mono_red_blitz": 0.6667,
    "mono_red_pyroclasm": 0.8542,
    "mono_red_dragon": 0.7917,
    "mono_blue_frost": 0.8542,
    "mono_blue_chrono": 0.875,
    "mono_blue_abyssal": 0.9375,
    "mono_purple_crypt": 0.875,
    "mono_purple_blood": 0.8333,
    "mono_purple_umbral": 0.875,
    "mono_gold_phalanx": 0.7292,
    "mono_gold_celestial": 0.7292,
    "mono_gold_judgment": 0.8333,
    "mono_neutral_axial": 0.7708,
    "dual_red_gold": 0.5417,
    "dual_blue_purple": 0.8125,
    "dual_red_green": 0.7083,
    "dual_blue_gold": 0.7083,
    "dual_purple_green": 0.4583,
    "dual_red_purple": 0.6042,
    "dual_blue_green": 0.7292,
    "dual_green_gold": 0.7083,
    "dual_purple_gold": 0.5,
    "dual_red_blue": 0.75,
    "dual_green_neutral": 0.6875,
    "dual_red_neutral": 0.5,
    "dual_blue_neutral": 0.7083,
    "dual_purple_neutral": 0.7708,
    "dual_gold_neutral": 0.6042,
    "tri_red_blue_purple": 0.7708,
    "tri_red_green_gold": 0.6875,
    "tri_blue_purple_gold": 0.625,
    "tri_red_purple_green": 0.5208,
    "tri_blue_green_gold": 0.7708,
    "tri_blue_purple_green": 0.7292,
    "tri_red_purple_gold": 0.5833,
    "tri_purple_green_gold": 0.4792,
    "tri_red_blue_green": 0.6875,
    "tri_red_blue_gold": 0.5,
    "penta_prismatic_crater": 0.625,
    "penta_free_city_sovereign": 0.6458,
    "penta_wheel_convergence": 0.6875
  },
  "dual_blue_neutral": {
    "mono_green_swarm": 0.625,
    "mono_green_colossus": 0.6875,
    "mono_green_roots": 0.9375,
    "mono_red_blitz": 0.6458,
    "mono_red_pyroclasm": 0.7083,
    "mono_red_dragon": 0.6667,
    "mono_blue_frost": 0.6458,
    "mono_blue_chrono": 0.6042,
    "mono_blue_abyssal": 0.7917,
    "mono_purple_crypt": 0.75,
    "mono_purple_blood": 0.7917,
    "mono_purple_umbral": 0.7083,
    "mono_gold_phalanx": 0.6042,
    "mono_gold_celestial": 0.6042,
    "mono_gold_judgment": 0.6875,
    "mono_neutral_axial": 0.6667,
    "dual_red_gold": 0.4375,
    "dual_blue_purple": 0.5833,
    "dual_red_green": 0.5,
    "dual_blue_gold": 0.5,
    "dual_purple_green": 0.5417,
    "dual_red_purple": 0.3542,
    "dual_blue_green": 0.5417,
    "dual_green_gold": 0.5,
    "dual_purple_gold": 0.4167,
    "dual_red_blue": 0.5417,
    "dual_green_neutral": 0.3958,
    "dual_red_neutral": 0.2917,
    "dual_blue_neutral": 0.5,
    "dual_purple_neutral": 0.5417,
    "dual_gold_neutral": 0.5,
    "tri_red_blue_purple": 0.375,
    "tri_red_green_gold": 0.6042,
    "tri_blue_purple_gold": 0.4792,
    "tri_red_purple_green": 0.3958,
    "tri_blue_green_gold": 0.4792,
    "tri_blue_purple_green": 0.6667,
    "tri_red_purple_gold": 0.3542,
    "tri_purple_green_gold": 0.4167,
    "tri_red_blue_green": 0.3958,
    "tri_red_blue_gold": 0.3542,
    "penta_prismatic_crater": 0.375,
    "penta_free_city_sovereign": 0.375,
    "penta_wheel_convergence": 0.5625
  },
  "dual_purple_neutral": {
    "mono_green_swarm": 0.5833,
    "mono_green_colossus": 0.625,
    "mono_green_roots": 0.7708,
    "mono_red_blitz": 0.5,
    "mono_red_pyroclasm": 0.7292,
    "mono_red_dragon": 0.625,
    "mono_blue_frost": 0.6458,
    "mono_blue_chrono": 0.5208,
    "mono_blue_abyssal": 0.6875,
    "mono_purple_crypt": 0.6042,
    "mono_purple_blood": 0.5833,
    "mono_purple_umbral": 0.7083,
    "mono_gold_phalanx": 0.4375,
    "mono_gold_celestial": 0.3958,
    "mono_gold_judgment": 0.5625,
    "mono_neutral_axial": 0.2708,
    "dual_red_gold": 0.1458,
    "dual_blue_purple": 0.5208,
    "dual_red_green": 0.2292,
    "dual_blue_gold": 0.3125,
    "dual_purple_green": 0.3542,
    "dual_red_purple": 0.375,
    "dual_blue_green": 0.375,
    "dual_green_gold": 0.3333,
    "dual_purple_gold": 0.3125,
    "dual_red_blue": 0.375,
    "dual_green_neutral": 0.2708,
    "dual_red_neutral": 0.2292,
    "dual_blue_neutral": 0.4583,
    "dual_purple_neutral": 0.5,
    "dual_gold_neutral": 0.2708,
    "tri_red_blue_purple": 0.6042,
    "tri_red_green_gold": 0.2708,
    "tri_blue_purple_gold": 0.4375,
    "tri_red_purple_green": 0.375,
    "tri_blue_green_gold": 0.5833,
    "tri_blue_purple_green": 0.3125,
    "tri_red_purple_gold": 0.2708,
    "tri_purple_green_gold": 0.3958,
    "tri_red_blue_green": 0.4583,
    "tri_red_blue_gold": 0.1458,
    "penta_prismatic_crater": 0.375,
    "penta_free_city_sovereign": 0.4167,
    "penta_wheel_convergence": 0.3333
  },
  "dual_gold_neutral": {
    "mono_green_swarm": 0.7083,
    "mono_green_colossus": 0.875,
    "mono_green_roots": 0.875,
    "mono_red_blitz": 0.6875,
    "mono_red_pyroclasm": 0.7292,
    "mono_red_dragon": 0.6875,
    "mono_blue_frost": 0.5833,
    "mono_blue_chrono": 0.5625,
    "mono_blue_abyssal": 0.6875,
    "mono_purple_crypt": 0.7292,
    "mono_purple_blood": 0.8333,
    "mono_purple_umbral": 0.6875,
    "mono_gold_phalanx": 0.8542,
    "mono_gold_celestial": 0.5833,
    "mono_gold_judgment": 0.5417,
    "mono_neutral_axial": 0.7292,
    "dual_red_gold": 0.3542,
    "dual_blue_purple": 0.5417,
    "dual_red_green": 0.5417,
    "dual_blue_gold": 0.3125,
    "dual_purple_green": 0.5833,
    "dual_red_purple": 0.625,
    "dual_blue_green": 0.375,
    "dual_green_gold": 0.6042,
    "dual_purple_gold": 0.5833,
    "dual_red_blue": 0.5625,
    "dual_green_neutral": 0.4792,
    "dual_red_neutral": 0.3958,
    "dual_blue_neutral": 0.5,
    "dual_purple_neutral": 0.7292,
    "dual_gold_neutral": 0.5,
    "tri_red_blue_purple": 0.5,
    "tri_red_green_gold": 0.5208,
    "tri_blue_purple_gold": 0.4167,
    "tri_red_purple_green": 0.4167,
    "tri_blue_green_gold": 0.4167,
    "tri_blue_purple_green": 0.6042,
    "tri_red_purple_gold": 0.4375,
    "tri_purple_green_gold": 0.4583,
    "tri_red_blue_green": 0.3333,
    "tri_red_blue_gold": 0.2708,
    "penta_prismatic_crater": 0.4375,
    "penta_free_city_sovereign": 0.6667,
    "penta_wheel_convergence": 0.4375
  },
  "tri_red_blue_purple": {
    "mono_green_swarm": 0.5625,
    "mono_green_colossus": 0.6667,
    "mono_green_roots": 0.7708,
    "mono_red_blitz": 0.4792,
    "mono_red_pyroclasm": 0.7083,
    "mono_red_dragon": 0.5833,
    "mono_blue_frost": 0.5833,
    "mono_blue_chrono": 0.4792,
    "mono_blue_abyssal": 0.6875,
    "mono_purple_crypt": 0.5625,
    "mono_purple_blood": 0.5,
    "mono_purple_umbral": 0.5625,
    "mono_gold_phalanx": 0.6667,
    "mono_gold_celestial": 0.6458,
    "mono_gold_judgment": 0.7083,
    "mono_neutral_axial": 0.5208,
    "dual_red_gold": 0.3333,
    "dual_blue_purple": 0.4583,
    "dual_red_green": 0.3542,
    "dual_blue_gold": 0.4375,
    "dual_purple_green": 0.4792,
    "dual_red_purple": 0.4375,
    "dual_blue_green": 0.3333,
    "dual_green_gold": 0.5208,
    "dual_purple_gold": 0.4167,
    "dual_red_blue": 0.5208,
    "dual_green_neutral": 0.3333,
    "dual_red_neutral": 0.2292,
    "dual_blue_neutral": 0.625,
    "dual_purple_neutral": 0.3958,
    "dual_gold_neutral": 0.5,
    "tri_red_blue_purple": 0.5,
    "tri_red_green_gold": 0.4792,
    "tri_blue_purple_gold": 0.3542,
    "tri_red_purple_green": 0.375,
    "tri_blue_green_gold": 0.375,
    "tri_blue_purple_green": 0.4375,
    "tri_red_purple_gold": 0.3958,
    "tri_purple_green_gold": 0.4375,
    "tri_red_blue_green": 0.4167,
    "tri_red_blue_gold": 0.25,
    "penta_prismatic_crater": 0.2708,
    "penta_free_city_sovereign": 0.5208,
    "penta_wheel_convergence": 0.5208
  },
  "tri_red_green_gold": {
    "mono_green_swarm": 0.75,
    "mono_green_colossus": 0.7917,
    "mono_green_roots": 0.7708,
    "mono_red_blitz": 0.6875,
    "mono_red_pyroclasm": 0.8333,
    "mono_red_dragon": 0.75,
    "mono_blue_frost": 0.4583,
    "mono_blue_chrono": 0.5833,
    "mono_blue_abyssal": 0.8125,
    "mono_purple_crypt": 0.7292,
    "mono_purple_blood": 0.8125,
    "mono_purple_umbral": 0.75,
    "mono_gold_phalanx": 0.6042,
    "mono_gold_celestial": 0.7917,
    "mono_gold_judgment": 0.8958,
    "mono_neutral_axial": 0.8333,
    "dual_red_gold": 0.3125,
    "dual_blue_purple": 0.5833,
    "dual_red_green": 0.4583,
    "dual_blue_gold": 0.5625,
    "dual_purple_green": 0.5833,
    "dual_red_purple": 0.6667,
    "dual_blue_green": 0.3542,
    "dual_green_gold": 0.5208,
    "dual_purple_gold": 0.5208,
    "dual_red_blue": 0.4792,
    "dual_green_neutral": 0.4375,
    "dual_red_neutral": 0.3125,
    "dual_blue_neutral": 0.3958,
    "dual_purple_neutral": 0.7292,
    "dual_gold_neutral": 0.4792,
    "tri_red_blue_purple": 0.5208,
    "tri_red_green_gold": 0.5,
    "tri_blue_purple_gold": 0.5,
    "tri_red_purple_green": 0.3958,
    "tri_blue_green_gold": 0.5833,
    "tri_blue_purple_green": 0.625,
    "tri_red_purple_gold": 0.375,
    "tri_purple_green_gold": 0.4583,
    "tri_red_blue_green": 0.4375,
    "tri_red_blue_gold": 0.2292,
    "penta_prismatic_crater": 0.4167,
    "penta_free_city_sovereign": 0.5625,
    "penta_wheel_convergence": 0.4167
  },
  "tri_blue_purple_gold": {
    "mono_green_swarm": 0.5208,
    "mono_green_colossus": 0.8542,
    "mono_green_roots": 0.6875,
    "mono_red_blitz": 0.75,
    "mono_red_pyroclasm": 0.7292,
    "mono_red_dragon": 0.6875,
    "mono_blue_frost": 0.5417,
    "mono_blue_chrono": 0.3958,
    "mono_blue_abyssal": 0.7917,
    "mono_purple_crypt": 0.5208,
    "mono_purple_blood": 0.7292,
    "mono_purple_umbral": 0.5833,
    "mono_gold_phalanx": 0.5833,
    "mono_gold_celestial": 0.7292,
    "mono_gold_judgment": 0.7917,
    "mono_neutral_axial": 0.6458,
    "dual_red_gold": 0.4583,
    "dual_blue_purple": 0.5833,
    "dual_red_green": 0.4792,
    "dual_blue_gold": 0.4583,
    "dual_purple_green": 0.625,
    "dual_red_purple": 0.5625,
    "dual_blue_green": 0.3542,
    "dual_green_gold": 0.2917,
    "dual_purple_gold": 0.5625,
    "dual_red_blue": 0.4583,
    "dual_green_neutral": 0.3333,
    "dual_red_neutral": 0.375,
    "dual_blue_neutral": 0.5208,
    "dual_purple_neutral": 0.5625,
    "dual_gold_neutral": 0.5833,
    "tri_red_blue_purple": 0.6458,
    "tri_red_green_gold": 0.5,
    "tri_blue_purple_gold": 0.5,
    "tri_red_purple_green": 0.3542,
    "tri_blue_green_gold": 0.4375,
    "tri_blue_purple_green": 0.3958,
    "tri_red_purple_gold": 0.3958,
    "tri_purple_green_gold": 0.4167,
    "tri_red_blue_green": 0.3333,
    "tri_red_blue_gold": 0.25,
    "penta_prismatic_crater": 0.5625,
    "penta_free_city_sovereign": 0.5625,
    "penta_wheel_convergence": 0.375
  },
  "tri_red_purple_green": {
    "mono_green_swarm": 0.8333,
    "mono_green_colossus": 0.7917,
    "mono_green_roots": 0.8542,
    "mono_red_blitz": 0.6458,
    "mono_red_pyroclasm": 0.8958,
    "mono_red_dragon": 0.7708,
    "mono_blue_frost": 0.7708,
    "mono_blue_chrono": 0.8125,
    "mono_blue_abyssal": 0.9167,
    "mono_purple_crypt": 0.875,
    "mono_purple_blood": 0.8125,
    "mono_purple_umbral": 0.7917,
    "mono_gold_phalanx": 0.7292,
    "mono_gold_celestial": 0.7083,
    "mono_gold_judgment": 0.8333,
    "mono_neutral_axial": 0.7083,
    "dual_red_gold": 0.7083,
    "dual_blue_purple": 0.7708,
    "dual_red_green": 0.7083,
    "dual_blue_gold": 0.6875,
    "dual_purple_green": 0.625,
    "dual_red_purple": 0.625,
    "dual_blue_green": 0.6875,
    "dual_green_gold": 0.6875,
    "dual_purple_gold": 0.625,
    "dual_red_blue": 0.6667,
    "dual_green_neutral": 0.625,
    "dual_red_neutral": 0.4792,
    "dual_blue_neutral": 0.6042,
    "dual_purple_neutral": 0.625,
    "dual_gold_neutral": 0.5833,
    "tri_red_blue_purple": 0.625,
    "tri_red_green_gold": 0.6042,
    "tri_blue_purple_gold": 0.6458,
    "tri_red_purple_green": 0.5,
    "tri_blue_green_gold": 0.7083,
    "tri_blue_purple_green": 0.625,
    "tri_red_purple_gold": 0.4792,
    "tri_purple_green_gold": 0.6667,
    "tri_red_blue_green": 0.7083,
    "tri_red_blue_gold": 0.4375,
    "penta_prismatic_crater": 0.6875,
    "penta_free_city_sovereign": 0.75,
    "penta_wheel_convergence": 0.6042
  },
  "tri_blue_green_gold": {
    "mono_green_swarm": 0.8333,
    "mono_green_colossus": 0.7917,
    "mono_green_roots": 0.8333,
    "mono_red_blitz": 0.5833,
    "mono_red_pyroclasm": 0.625,
    "mono_red_dragon": 0.625,
    "mono_blue_frost": 0.4583,
    "mono_blue_chrono": 0.4167,
    "mono_blue_abyssal": 0.7083,
    "mono_purple_crypt": 0.7083,
    "mono_purple_blood": 0.75,
    "mono_purple_umbral": 0.7083,
    "mono_gold_phalanx": 0.75,
    "mono_gold_celestial": 0.7708,
    "mono_gold_judgment": 0.6875,
    "mono_neutral_axial": 0.6667,
    "dual_red_gold": 0.5,
    "dual_blue_purple": 0.5833,
    "dual_red_green": 0.4375,
    "dual_blue_gold": 0.4792,
    "dual_purple_green": 0.5,
    "dual_red_purple": 0.4792,
    "dual_blue_green": 0.4792,
    "dual_green_gold": 0.5833,
    "dual_purple_gold": 0.6875,
    "dual_red_blue": 0.4792,
    "dual_green_neutral": 0.5417,
    "dual_red_neutral": 0.2292,
    "dual_blue_neutral": 0.5208,
    "dual_purple_neutral": 0.4167,
    "dual_gold_neutral": 0.5833,
    "tri_red_blue_purple": 0.625,
    "tri_red_green_gold": 0.4167,
    "tri_blue_purple_gold": 0.5625,
    "tri_red_purple_green": 0.2917,
    "tri_blue_green_gold": 0.5,
    "tri_blue_purple_green": 0.75,
    "tri_red_purple_gold": 0.375,
    "tri_purple_green_gold": 0.4792,
    "tri_red_blue_green": 0.4792,
    "tri_red_blue_gold": 0.3958,
    "penta_prismatic_crater": 0.4375,
    "penta_free_city_sovereign": 0.3958,
    "penta_wheel_convergence": 0.3125
  },
  "tri_blue_purple_green": {
    "mono_green_swarm": 0.5417,
    "mono_green_colossus": 0.5625,
    "mono_green_roots": 0.6875,
    "mono_red_blitz": 0.5208,
    "mono_red_pyroclasm": 0.7083,
    "mono_red_dragon": 0.625,
    "mono_blue_frost": 0.6458,
    "mono_blue_chrono": 0.5417,
    "mono_blue_abyssal": 0.7083,
    "mono_purple_crypt": 0.4792,
    "mono_purple_blood": 0.6875,
    "mono_purple_umbral": 0.4375,
    "mono_gold_phalanx": 0.6042,
    "mono_gold_celestial": 0.6042,
    "mono_gold_judgment": 0.6875,
    "mono_neutral_axial": 0.5833,
    "dual_red_gold": 0.3542,
    "dual_blue_purple": 0.5833,
    "dual_red_green": 0.3333,
    "dual_blue_gold": 0.375,
    "dual_purple_green": 0.375,
    "dual_red_purple": 0.3125,
    "dual_blue_green": 0.4792,
    "dual_green_gold": 0.4792,
    "dual_purple_gold": 0.3542,
    "dual_red_blue": 0.375,
    "dual_green_neutral": 0.4375,
    "dual_red_neutral": 0.2708,
    "dual_blue_neutral": 0.3333,
    "dual_purple_neutral": 0.6875,
    "dual_gold_neutral": 0.3958,
    "tri_red_blue_purple": 0.5625,
    "tri_red_green_gold": 0.375,
    "tri_blue_purple_gold": 0.6042,
    "tri_red_purple_green": 0.375,
    "tri_blue_green_gold": 0.25,
    "tri_blue_purple_green": 0.5,
    "tri_red_purple_gold": 0.375,
    "tri_purple_green_gold": 0.3542,
    "tri_red_blue_green": 0.4167,
    "tri_red_blue_gold": 0.2083,
    "penta_prismatic_crater": 0.2708,
    "penta_free_city_sovereign": 0.5417,
    "penta_wheel_convergence": 0.4792
  },
  "tri_red_purple_gold": {
    "mono_green_swarm": 0.7917,
    "mono_green_colossus": 0.9167,
    "mono_green_roots": 0.8333,
    "mono_red_blitz": 0.7708,
    "mono_red_pyroclasm": 0.8542,
    "mono_red_dragon": 0.6875,
    "mono_blue_frost": 0.7292,
    "mono_blue_chrono": 0.7708,
    "mono_blue_abyssal": 0.7917,
    "mono_purple_crypt": 0.8333,
    "mono_purple_blood": 0.9583,
    "mono_purple_umbral": 0.8125,
    "mono_gold_phalanx": 0.5833,
    "mono_gold_celestial": 0.8125,
    "mono_gold_judgment": 0.8333,
    "mono_neutral_axial": 0.75,
    "dual_red_gold": 0.4375,
    "dual_blue_purple": 0.6042,
    "dual_red_green": 0.375,
    "dual_blue_gold": 0.5833,
    "dual_purple_green": 0.6458,
    "dual_red_purple": 0.625,
    "dual_blue_green": 0.75,
    "dual_green_gold": 0.6667,
    "dual_purple_gold": 0.5833,
    "dual_red_blue": 0.7708,
    "dual_green_neutral": 0.5417,
    "dual_red_neutral": 0.4167,
    "dual_blue_neutral": 0.6458,
    "dual_purple_neutral": 0.7292,
    "dual_gold_neutral": 0.5625,
    "tri_red_blue_purple": 0.6042,
    "tri_red_green_gold": 0.625,
    "tri_blue_purple_gold": 0.6042,
    "tri_red_purple_green": 0.5208,
    "tri_blue_green_gold": 0.625,
    "tri_blue_purple_green": 0.625,
    "tri_red_purple_gold": 0.5,
    "tri_purple_green_gold": 0.5,
    "tri_red_blue_green": 0.5833,
    "tri_red_blue_gold": 0.4167,
    "penta_prismatic_crater": 0.5625,
    "penta_free_city_sovereign": 0.5625,
    "penta_wheel_convergence": 0.7708
  },
  "tri_purple_green_gold": {
    "mono_green_swarm": 0.7708,
    "mono_green_colossus": 0.7292,
    "mono_green_roots": 0.7917,
    "mono_red_blitz": 0.6667,
    "mono_red_pyroclasm": 0.8333,
    "mono_red_dragon": 0.7708,
    "mono_blue_frost": 0.6042,
    "mono_blue_chrono": 0.5208,
    "mono_blue_abyssal": 0.7292,
    "mono_purple_crypt": 0.7083,
    "mono_purple_blood": 0.8958,
    "mono_purple_umbral": 0.7917,
    "mono_gold_phalanx": 0.5625,
    "mono_gold_celestial": 0.7292,
    "mono_gold_judgment": 0.8542,
    "mono_neutral_axial": 0.6458,
    "dual_red_gold": 0.5625,
    "dual_blue_purple": 0.75,
    "dual_red_green": 0.4792,
    "dual_blue_gold": 0.5208,
    "dual_purple_green": 0.5,
    "dual_red_purple": 0.625,
    "dual_blue_green": 0.4375,
    "dual_green_gold": 0.6458,
    "dual_purple_gold": 0.4583,
    "dual_red_blue": 0.5208,
    "dual_green_neutral": 0.5833,
    "dual_red_neutral": 0.5208,
    "dual_blue_neutral": 0.5833,
    "dual_purple_neutral": 0.6042,
    "dual_gold_neutral": 0.5417,
    "tri_red_blue_purple": 0.5625,
    "tri_red_green_gold": 0.5417,
    "tri_blue_purple_gold": 0.5833,
    "tri_red_purple_green": 0.3333,
    "tri_blue_green_gold": 0.5208,
    "tri_blue_purple_green": 0.6458,
    "tri_red_purple_gold": 0.5,
    "tri_purple_green_gold": 0.5,
    "tri_red_blue_green": 0.4375,
    "tri_red_blue_gold": 0.3333,
    "penta_prismatic_crater": 0.5,
    "penta_free_city_sovereign": 0.4583,
    "penta_wheel_convergence": 0.4375
  },
  "tri_red_blue_green": {
    "mono_green_swarm": 0.7708,
    "mono_green_colossus": 0.7917,
    "mono_green_roots": 0.8333,
    "mono_red_blitz": 0.5417,
    "mono_red_pyroclasm": 0.6458,
    "mono_red_dragon": 0.7083,
    "mono_blue_frost": 0.6667,
    "mono_blue_chrono": 0.5208,
    "mono_blue_abyssal": 0.7292,
    "mono_purple_crypt": 0.7083,
    "mono_purple_blood": 0.7083,
    "mono_purple_umbral": 0.5417,
    "mono_gold_phalanx": 0.75,
    "mono_gold_celestial": 0.6458,
    "mono_gold_judgment": 0.7083,
    "mono_neutral_axial": 0.6042,
    "dual_red_gold": 0.5,
    "dual_blue_purple": 0.5,
    "dual_red_green": 0.6667,
    "dual_blue_gold": 0.6667,
    "dual_purple_green": 0.6458,
    "dual_red_purple": 0.5208,
    "dual_blue_green": 0.4375,
    "dual_green_gold": 0.6458,
    "dual_purple_gold": 0.4375,
    "dual_red_blue": 0.4583,
    "dual_green_neutral": 0.4375,
    "dual_red_neutral": 0.3125,
    "dual_blue_neutral": 0.6042,
    "dual_purple_neutral": 0.5417,
    "dual_gold_neutral": 0.6667,
    "tri_red_blue_purple": 0.5833,
    "tri_red_green_gold": 0.5625,
    "tri_blue_purple_gold": 0.6667,
    "tri_red_purple_green": 0.2917,
    "tri_blue_green_gold": 0.5208,
    "tri_blue_purple_green": 0.5833,
    "tri_red_purple_gold": 0.4167,
    "tri_purple_green_gold": 0.5625,
    "tri_red_blue_green": 0.5,
    "tri_red_blue_gold": 0.4167,
    "penta_prismatic_crater": 0.4167,
    "penta_free_city_sovereign": 0.4792,
    "penta_wheel_convergence": 0.6667
  },
  "tri_red_blue_gold": {
    "mono_green_swarm": 0.875,
    "mono_green_colossus": 0.9167,
    "mono_green_roots": 0.9792,
    "mono_red_blitz": 0.8333,
    "mono_red_pyroclasm": 0.8542,
    "mono_red_dragon": 0.9583,
    "mono_blue_frost": 0.7292,
    "mono_blue_chrono": 0.7292,
    "mono_blue_abyssal": 0.8958,
    "mono_purple_crypt": 0.8125,
    "mono_purple_blood": 0.9167,
    "mono_purple_umbral": 0.7292,
    "mono_gold_phalanx": 0.8958,
    "mono_gold_celestial": 0.9167,
    "mono_gold_judgment": 0.8542,
    "mono_neutral_axial": 0.75,
    "dual_red_gold": 0.625,
    "dual_blue_purple": 0.7708,
    "dual_red_green": 0.6042,
    "dual_blue_gold": 0.6667,
    "dual_purple_green": 0.75,
    "dual_red_purple": 0.7708,
    "dual_blue_green": 0.6042,
    "dual_green_gold": 0.7292,
    "dual_purple_gold": 0.7292,
    "dual_red_blue": 0.7917,
    "dual_green_neutral": 0.5208,
    "dual_red_neutral": 0.5,
    "dual_blue_neutral": 0.6458,
    "dual_purple_neutral": 0.8542,
    "dual_gold_neutral": 0.7292,
    "tri_red_blue_purple": 0.75,
    "tri_red_green_gold": 0.7708,
    "tri_blue_purple_gold": 0.75,
    "tri_red_purple_green": 0.5625,
    "tri_blue_green_gold": 0.6042,
    "tri_blue_purple_green": 0.7917,
    "tri_red_purple_gold": 0.5833,
    "tri_purple_green_gold": 0.6667,
    "tri_red_blue_green": 0.5833,
    "tri_red_blue_gold": 0.5,
    "penta_prismatic_crater": 0.6875,
    "penta_free_city_sovereign": 0.7083,
    "penta_wheel_convergence": 0.75
  },
  "penta_prismatic_crater": {
    "mono_green_swarm": 0.7083,
    "mono_green_colossus": 0.8125,
    "mono_green_roots": 0.8125,
    "mono_red_blitz": 0.4375,
    "mono_red_pyroclasm": 0.6875,
    "mono_red_dragon": 0.75,
    "mono_blue_frost": 0.625,
    "mono_blue_chrono": 0.7292,
    "mono_blue_abyssal": 0.8333,
    "mono_purple_crypt": 0.6875,
    "mono_purple_blood": 0.7083,
    "mono_purple_umbral": 0.5208,
    "mono_gold_phalanx": 0.7708,
    "mono_gold_celestial": 0.8333,
    "mono_gold_judgment": 0.7292,
    "mono_neutral_axial": 0.6458,
    "dual_red_gold": 0.375,
    "dual_blue_purple": 0.6667,
    "dual_red_green": 0.5625,
    "dual_blue_gold": 0.6458,
    "dual_purple_green": 0.5417,
    "dual_red_purple": 0.4375,
    "dual_blue_green": 0.6458,
    "dual_green_gold": 0.5417,
    "dual_purple_gold": 0.6042,
    "dual_red_blue": 0.5208,
    "dual_green_neutral": 0.5,
    "dual_red_neutral": 0.375,
    "dual_blue_neutral": 0.625,
    "dual_purple_neutral": 0.625,
    "dual_gold_neutral": 0.5625,
    "tri_red_blue_purple": 0.7292,
    "tri_red_green_gold": 0.5833,
    "tri_blue_purple_gold": 0.4375,
    "tri_red_purple_green": 0.3125,
    "tri_blue_green_gold": 0.5625,
    "tri_blue_purple_green": 0.7292,
    "tri_red_purple_gold": 0.4375,
    "tri_purple_green_gold": 0.5,
    "tri_red_blue_green": 0.5833,
    "tri_red_blue_gold": 0.3125,
    "penta_prismatic_crater": 0.5,
    "penta_free_city_sovereign": 0.4792,
    "penta_wheel_convergence": 0.5417
  },
  "penta_free_city_sovereign": {
    "mono_green_swarm": 0.8125,
    "mono_green_colossus": 0.8125,
    "mono_green_roots": 0.7708,
    "mono_red_blitz": 0.6042,
    "mono_red_pyroclasm": 0.6458,
    "mono_red_dragon": 0.6458,
    "mono_blue_frost": 0.7083,
    "mono_blue_chrono": 0.5417,
    "mono_blue_abyssal": 0.7708,
    "mono_purple_crypt": 0.8542,
    "mono_purple_blood": 0.8125,
    "mono_purple_umbral": 0.7292,
    "mono_gold_phalanx": 0.7708,
    "mono_gold_celestial": 0.7083,
    "mono_gold_judgment": 0.75,
    "mono_neutral_axial": 0.6458,
    "dual_red_gold": 0.25,
    "dual_blue_purple": 0.5,
    "dual_red_green": 0.2917,
    "dual_blue_gold": 0.6042,
    "dual_purple_green": 0.4583,
    "dual_red_purple": 0.5208,
    "dual_blue_green": 0.5625,
    "dual_green_gold": 0.4583,
    "dual_purple_gold": 0.5208,
    "dual_red_blue": 0.4792,
    "dual_green_neutral": 0.4583,
    "dual_red_neutral": 0.3542,
    "dual_blue_neutral": 0.625,
    "dual_purple_neutral": 0.5833,
    "dual_gold_neutral": 0.3333,
    "tri_red_blue_purple": 0.4792,
    "tri_red_green_gold": 0.4375,
    "tri_blue_purple_gold": 0.4375,
    "tri_red_purple_green": 0.25,
    "tri_blue_green_gold": 0.6042,
    "tri_blue_purple_green": 0.4583,
    "tri_red_purple_gold": 0.4375,
    "tri_purple_green_gold": 0.5417,
    "tri_red_blue_green": 0.5208,
    "tri_red_blue_gold": 0.2917,
    "penta_prismatic_crater": 0.5208,
    "penta_free_city_sovereign": 0.5,
    "penta_wheel_convergence": 0.5208
  },
  "penta_wheel_convergence": {
    "mono_green_swarm": 0.8542,
    "mono_green_colossus": 0.6667,
    "mono_green_roots": 0.7708,
    "mono_red_blitz": 0.5625,
    "mono_red_pyroclasm": 0.7917,
    "mono_red_dragon": 0.6875,
    "mono_blue_frost": 0.6667,
    "mono_blue_chrono": 0.4167,
    "mono_blue_abyssal": 0.75,
    "mono_purple_crypt": 0.7083,
    "mono_purple_blood": 0.75,
    "mono_purple_umbral": 0.7083,
    "mono_gold_phalanx": 0.6875,
    "mono_gold_celestial": 0.6875,
    "mono_gold_judgment": 0.8333,
    "mono_neutral_axial": 0.6667,
    "dual_red_gold": 0.4583,
    "dual_blue_purple": 0.5833,
    "dual_red_green": 0.5,
    "dual_blue_gold": 0.4792,
    "dual_purple_green": 0.5833,
    "dual_red_purple": 0.5,
    "dual_blue_green": 0.3542,
    "dual_green_gold": 0.5625,
    "dual_purple_gold": 0.6458,
    "dual_red_blue": 0.4583,
    "dual_green_neutral": 0.4792,
    "dual_red_neutral": 0.3125,
    "dual_blue_neutral": 0.4375,
    "dual_purple_neutral": 0.6667,
    "dual_gold_neutral": 0.5625,
    "tri_red_blue_purple": 0.4792,
    "tri_red_green_gold": 0.5833,
    "tri_blue_purple_gold": 0.625,
    "tri_red_purple_green": 0.3958,
    "tri_blue_green_gold": 0.6875,
    "tri_blue_purple_green": 0.5208,
    "tri_red_purple_gold": 0.2292,
    "tri_purple_green_gold": 0.5625,
    "tri_red_blue_green": 0.3333,
    "tri_red_blue_gold": 0.25,
    "penta_prismatic_crater": 0.4583,
    "penta_free_city_sovereign": 0.4792,
    "penta_wheel_convergence": 0.5
  }
};
