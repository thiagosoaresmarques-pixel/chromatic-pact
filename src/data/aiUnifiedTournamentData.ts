import { Domain } from '../types/game';
import type { MonocolorArchetypeId } from './aiMonocolorMasteryData';
import type { BicolorArchetypeId } from './aiBicolorMasteryData';
import type { PolycolorArchetypeId } from './aiPolycolorMasteryData';

/**
 * GERADO AUTOMATICAMENTE POR src/scripts/runEloCalibrationLeague.ts
 * Grande Torneio Unificado de Vaeloria (44 × 43 Campeões Tier V): 45402 duelos Beam Search (287.8s em 10 threads)
 * Margem de Erro Máxima IC 95% por Campeão: ±2.27%
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
  "generatedAt": "2026-11-10T20:38:02.647Z",
  "totalChampions": 44,
  "totalUnorderedPairs": 946,
  "totalMatchesSimulated": 45402,
  "numWorkers": 10,
  "elapsedSeconds": 287.8,
  "maxChampionCi95HalfWidth": 0.0227,
  "convergedByMargin": true,
  "tierCounts": {
    "S": 18,
    "A": 11,
    "B": 15
  },
  "formatEcologyMatrix": {
    "monocolor": {
      "overallWinRate": 0.3753,
      "totalGames": 33018,
      "vsFormat": {
        "monocolor": 0.5,
        "bicolor": 0.3178,
        "tricolor": 0.2979,
        "pentachromatic": 0.2973
      }
    },
    "bicolor": {
      "overallWinRate": 0.5597,
      "totalGames": 30960,
      "vsFormat": {
        "monocolor": 0.6822,
        "bicolor": 0.5,
        "tricolor": 0.4665,
        "pentachromatic": 0.4954
      }
    },
    "tricolor": {
      "overallWinRate": 0.5872,
      "totalGames": 20634,
      "vsFormat": {
        "monocolor": 0.7021,
        "bicolor": 0.5335,
        "tricolor": 0.5,
        "pentachromatic": 0.5049
      }
    },
    "pentachromatic": {
      "overallWinRate": 0.5759,
      "totalGames": 6192,
      "vsFormat": {
        "monocolor": 0.7027,
        "bicolor": 0.5046,
        "tricolor": 0.4951,
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
      "playedGames": 159,
      "playedWinRate": 0.8805
    },
    {
      "cardId": "red_76_salamandra_vapor",
      "cardName": "Serpente de Vapor Superaquecido",
      "domain": "red",
      "cost": 3,
      "playedGames": 3083,
      "playedWinRate": 0.4921
    },
    {
      "cardId": "red_55_diabrete_forja",
      "cardName": "Diabrete Soprador de Brasas",
      "domain": "red",
      "cost": 1,
      "playedGames": 8772,
      "playedWinRate": 0.5718
    },
    {
      "cardId": "red_109_diabrete_fornalha",
      "cardName": "Diabrete da Fornalha",
      "domain": "red",
      "cost": 1,
      "playedGames": 1999,
      "playedWinRate": 0.5548
    },
    {
      "cardId": "neutral_88_espada_voadora_runica",
      "cardName": "Gládio Levitante do Salão",
      "domain": "neutral",
      "cost": 1,
      "playedGames": 754,
      "playedWinRate": 0.7493
    },
    {
      "cardId": "neutral_52_mercenario_planar",
      "cardName": "Mercenário das Lâminas Planais",
      "domain": "neutral",
      "cost": 2,
      "playedGames": 12495,
      "playedWinRate": 0.5806
    },
    {
      "cardId": "gold_32_estandarte_imperial",
      "cardName": "Estandarte da Legião Dourada",
      "domain": "gold",
      "cost": 4,
      "playedGames": 1051,
      "playedWinRate": 0.6984
    },
    {
      "cardId": "gold_04_armadura_conjurada",
      "cardName": "Sentinela de Elmo Arcano",
      "domain": "gold",
      "cost": 3,
      "playedGames": 7930,
      "playedWinRate": 0.5422
    },
    {
      "cardId": "gold_02_gargula",
      "cardName": "Gárgula da Catedral Solar",
      "domain": "gold",
      "cost": 2,
      "playedGames": 4722,
      "playedWinRate": 0.5078
    },
    {
      "cardId": "gold_157_dragao_soberano_alvorada",
      "cardName": "Aurelius, Soberano Dragão da Alvorada",
      "domain": "gold",
      "cost": 8,
      "playedGames": 139,
      "playedWinRate": 0.8058
    },
    {
      "cardId": "blue_153_leviata_fenda_abissal",
      "cardName": "Zephyrus, Monarca do Ciclone",
      "domain": "blue",
      "cost": 6,
      "playedGames": 3595,
      "playedWinRate": 0.6239
    },
    {
      "cardId": "green_68_zaratan_ilha",
      "cardName": "Chelonia, A Tartaruga-Continente",
      "domain": "green",
      "cost": 7,
      "playedGames": 46,
      "playedWinRate": 0.5
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
      "playedGames": 146,
      "playedWinRate": 0.5
    },
    {
      "cardId": "green_167_arauto_prisma_selva",
      "cardName": "Arauto da Raiz Prismática",
      "domain": "green",
      "cost": 5,
      "playedGames": 111,
      "playedWinRate": 0.3874
    },
    {
      "cardId": "gold_167_arauto_prisma_sol",
      "cardName": "Arauto do Zênite Prismático",
      "domain": "gold",
      "cost": 5,
      "playedGames": 102,
      "playedWinRate": 0.4314
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
      "playedGames": 89,
      "playedWinRate": 0.5955
    },
    {
      "cardId": "purple_23_dracolich",
      "cardName": "Ossaurion, Dragão-Ossário Eterno",
      "domain": "purple",
      "cost": 7,
      "playedGames": 311,
      "playedWinRate": 0.7685
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
      "playedGames": 182,
      "playedWinRate": 0.5
    },
    {
      "cardId": "green_75_druida_ciclos",
      "cardName": "Guardião das Quatro Estações",
      "domain": "green",
      "cost": 2,
      "playedGames": 255,
      "playedWinRate": 0.3529
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
      "playedGames": 151,
      "playedWinRate": 0.3709
    },
    {
      "cardId": "blue_168_tecelao_feixe_gelo",
      "cardName": "Tecelão do Feixe Astral",
      "domain": "blue",
      "cost": 3,
      "playedGames": 871,
      "playedWinRate": 0.4225
    },
    {
      "cardId": "purple_20_tecelao_profano",
      "cardName": "Aracnomante das Cavernas",
      "domain": "purple",
      "cost": 4,
      "playedGames": 538,
      "playedWinRate": 0.539
    },
    {
      "cardId": "blue_17_bruxa_mar",
      "cardName": "Megera da Escuma Negra",
      "domain": "blue",
      "cost": 3,
      "playedGames": 1943,
      "playedWinRate": 0.5383
    },
    {
      "cardId": "neutral_106_reen_assassino_relojoeiro",
      "cardName": "Reen, Ceifador de Engrenagens",
      "domain": "neutral",
      "cost": 4,
      "playedGames": 4339,
      "playedWinRate": 0.7082
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
      "playedGames": 502,
      "playedWinRate": 0.506
    },
    {
      "cardId": "green_116_ent_espinheiro_anciao",
      "cardName": "Ent Espinheiro Ancião",
      "domain": "green",
      "cost": 5,
      "playedGames": 139,
      "playedWinRate": 0.4101
    }
  ]
};

export const UNIFIED_CHAMPION_STANDINGS: UnifiedChampionStanding[] = [
  {
    "rank": 1,
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
    "overallWinRate": 0.7287,
    "ci95HalfWidth": 0.02,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.8255,
      "bicolor": 0.6905,
      "tricolor": 0.6417,
      "pentachromatic": 0.6806
    },
    "bestMatchups": [
      {
        "opponentId": "mono_purple_blood",
        "winRate": 1,
        "games": 48
      },
      {
        "opponentId": "dual_purple_neutral",
        "winRate": 0.9167,
        "games": 48
      },
      {
        "opponentId": "mono_blue_chrono",
        "winRate": 0.8958,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.875,
        "games": 48
      },
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.8542,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.5208,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.5208,
        "games": 48
      },
      {
        "opponentId": "dual_red_gold",
        "winRate": 0.5208,
        "games": 48
      },
      {
        "opponentId": "penta_prismatic_crater",
        "winRate": 0.6042,
        "games": 48
      },
      {
        "opponentId": "tri_purple_green_gold",
        "winRate": 0.6042,
        "games": 48
      }
    ]
  },
  {
    "rank": 2,
    "archetypeId": "tri_red_blue_gold",
    "name": "Conclave da Chama Celeste",
    "subtitle": "Tríade ☀️+🔥+❄️ • Esquadra Aérea, Escudo Divino & Feitiçaria",
    "format": "tricolor",
    "domains": [
      "gold",
      "red",
      "blue"
    ],
    "coverCardId": "gold_173_general_roda_sol",
    "classicDeckIds": [],
    "tierBadge": "S",
    "overallWinRate": 0.725,
    "ci95HalfWidth": 0.0194,
    "matchesPlayed": 2058,
    "vsFormatWinRates": {
      "monocolor": 0.832,
      "bicolor": 0.6625,
      "tricolor": 0.6435,
      "pentachromatic": 0.7153
    },
    "bestMatchups": [
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.9375,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.9286,
        "games": 42
      },
      {
        "opponentId": "mono_gold_judgment",
        "winRate": 0.9167,
        "games": 48
      },
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.8958,
        "games": 48
      },
      {
        "opponentId": "mono_green_swarm",
        "winRate": 0.8542,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.4375,
        "games": 48
      },
      {
        "opponentId": "dual_red_gold",
        "winRate": 0.4583,
        "games": 48
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.4792,
        "games": 48
      },
      {
        "opponentId": "dual_green_neutral",
        "winRate": 0.4792,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.5417,
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
    "coverCardId": "purple_138_soberano_carnica",
    "classicDeckIds": [
      "deck_tri_blood_moon"
    ],
    "tierBadge": "S",
    "overallWinRate": 0.673,
    "ci95HalfWidth": 0.0209,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.7773,
      "bicolor": 0.6389,
      "tricolor": 0.581,
      "pentachromatic": 0.5625
    },
    "bestMatchups": [
      {
        "opponentId": "mono_green_swarm",
        "winRate": 0.9167,
        "games": 48
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.9167,
        "games": 48
      },
      {
        "opponentId": "mono_red_dragon",
        "winRate": 0.8958,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.8333,
        "games": 48
      },
      {
        "opponentId": "dual_blue_purple",
        "winRate": 0.8333,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_purple_green_gold",
        "winRate": 0.4375,
        "games": 48
      },
      {
        "opponentId": "dual_gold_neutral",
        "winRate": 0.4583,
        "games": 48
      },
      {
        "opponentId": "penta_prismatic_crater",
        "winRate": 0.4792,
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
    "coverCardId": "red_119_soberano_piroclasma",
    "classicDeckIds": [
      "deck_tri_crimson_sun"
    ],
    "tierBadge": "S",
    "overallWinRate": 0.6541,
    "ci95HalfWidth": 0.0208,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.75,
      "bicolor": 0.6111,
      "tricolor": 0.5694,
      "pentachromatic": 0.6111
    },
    "bestMatchups": [
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.9167,
        "games": 48
      },
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.8542,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.8333,
        "games": 48
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.8333,
        "games": 48
      },
      {
        "opponentId": "mono_red_dragon",
        "winRate": 0.8333,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.3542,
        "games": 48
      },
      {
        "opponentId": "dual_red_green",
        "winRate": 0.4375,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.4583,
        "games": 48
      },
      {
        "opponentId": "tri_purple_green_gold",
        "winRate": 0.4583,
        "games": 48
      },
      {
        "opponentId": "tri_blue_green_gold",
        "winRate": 0.5,
        "games": 48
      }
    ]
  },
  {
    "rank": 5,
    "archetypeId": "dual_green_neutral",
    "name": "Aliança dos Engenhos Silvestres",
    "subtitle": "Aliança 🌿+⚙️ • Colossos de Madeira-Ferro & Guildas Axiais",
    "format": "bicolor",
    "domains": [
      "green",
      "neutral"
    ],
    "coverCardId": "neutral_54_dragao_etereo",
    "classicDeckIds": [],
    "tierBadge": "S",
    "overallWinRate": 0.6303,
    "ci95HalfWidth": 0.0213,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.75,
      "bicolor": 0.5774,
      "tricolor": 0.5271,
      "pentachromatic": 0.5833
    },
    "bestMatchups": [
      {
        "opponentId": "mono_neutral_axial",
        "winRate": 0.875,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.8125,
        "games": 48
      },
      {
        "opponentId": "mono_gold_judgment",
        "winRate": 0.8125,
        "games": 48
      },
      {
        "opponentId": "mono_purple_umbral",
        "winRate": 0.7917,
        "games": 48
      },
      {
        "opponentId": "mono_green_swarm",
        "winRate": 0.7708,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.3333,
        "games": 48
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.3542,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.3958,
        "games": 48
      },
      {
        "opponentId": "tri_purple_green_gold",
        "winRate": 0.4167,
        "games": 48
      },
      {
        "opponentId": "dual_red_blue",
        "winRate": 0.4583,
        "games": 48
      }
    ]
  },
  {
    "rank": 6,
    "archetypeId": "dual_red_gold",
    "name": "Pacto das Escamas Imperiais",
    "subtitle": "Pacto Duplo 🔥+☀️ • Dragões Solares & Escudo Divino",
    "format": "bicolor",
    "domains": [
      "red",
      "gold"
    ],
    "coverCardId": "red_100_dragao_vulcanico_anciao",
    "classicDeckIds": [
      "deck_dual_draconic_pact"
    ],
    "tierBadge": "S",
    "overallWinRate": 0.6284,
    "ci95HalfWidth": 0.0213,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.7487,
      "bicolor": 0.5625,
      "tricolor": 0.5354,
      "pentachromatic": 0.6042
    },
    "bestMatchups": [
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.8333,
        "games": 48
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.8333,
        "games": 48
      },
      {
        "opponentId": "mono_neutral_axial",
        "winRate": 0.8333,
        "games": 48
      },
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.8125,
        "games": 48
      },
      {
        "opponentId": "mono_red_dragon",
        "winRate": 0.8125,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "dual_green_neutral",
        "winRate": 0.3542,
        "games": 48
      },
      {
        "opponentId": "tri_purple_green_gold",
        "winRate": 0.4167,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.4375,
        "games": 48
      },
      {
        "opponentId": "tri_blue_purple_gold",
        "winRate": 0.4583,
        "games": 48
      },
      {
        "opponentId": "dual_red_green",
        "winRate": 0.4583,
        "games": 48
      }
    ]
  },
  {
    "rank": 7,
    "archetypeId": "dual_red_green",
    "name": "Pacto da Ruína Selvagem",
    "subtitle": "Pacto Duplo 🔥+🌿 • Rampa Vulcânica, Ímpeto & Atropelar",
    "format": "bicolor",
    "domains": [
      "red",
      "green"
    ],
    "coverCardId": "red_46_tirano_carmesim",
    "classicDeckIds": [
      "deck_dual_primal_fury"
    ],
    "tierBadge": "S",
    "overallWinRate": 0.5998,
    "ci95HalfWidth": 0.0217,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.7031,
      "bicolor": 0.5625,
      "tricolor": 0.4979,
      "pentachromatic": 0.5625
    },
    "bestMatchups": [
      {
        "opponentId": "mono_blue_chrono",
        "winRate": 0.8542,
        "games": 48
      },
      {
        "opponentId": "mono_red_dragon",
        "winRate": 0.8333,
        "games": 48
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.7708,
        "games": 48
      },
      {
        "opponentId": "mono_gold_phalanx",
        "winRate": 0.75,
        "games": 48
      },
      {
        "opponentId": "mono_gold_celestial",
        "winRate": 0.75,
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
        "opponentId": "tri_red_blue_purple",
        "winRate": 0.3542,
        "games": 48
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.3542,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_green",
        "winRate": 0.3958,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_green",
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
    "overallWinRate": 0.594,
    "ci95HalfWidth": 0.0218,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.7135,
      "bicolor": 0.5306,
      "tricolor": 0.5125,
      "pentachromatic": 0.5208
    },
    "bestMatchups": [
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.8542,
        "games": 48
      },
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.8542,
        "games": 48
      },
      {
        "opponentId": "mono_green_colossus",
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
        "winRate": 0.7708,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.2917,
        "games": 48
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.3958,
        "games": 48
      },
      {
        "opponentId": "dual_red_gold",
        "winRate": 0.3958,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.4167,
        "games": 48
      },
      {
        "opponentId": "tri_red_green_gold",
        "winRate": 0.4375,
        "games": 48
      }
    ]
  },
  {
    "rank": 9,
    "archetypeId": "tri_purple_green_gold",
    "name": "Armada do Zênite Umbral",
    "subtitle": "Tríade ☀️+🌿+💀 • Bastião Imortal, Regeneração & Renascer",
    "format": "tricolor",
    "domains": [
      "gold",
      "green",
      "purple"
    ],
    "coverCardId": "gold_138_imperador_sol_supremo",
    "classicDeckIds": [],
    "tierBadge": "S",
    "overallWinRate": 0.5882,
    "ci95HalfWidth": 0.0211,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.7031,
      "bicolor": 0.525,
      "tricolor": 0.5231,
      "pentachromatic": 0.4861
    },
    "bestMatchups": [
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
        "opponentId": "mono_green_roots",
        "winRate": 0.7708,
        "games": 48
      },
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.7708,
        "games": 48
      },
      {
        "opponentId": "mono_purple_crypt",
        "winRate": 0.75,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.2917,
        "games": 48
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.3958,
        "games": 48
      },
      {
        "opponentId": "dual_blue_green",
        "winRate": 0.3958,
        "games": 48
      },
      {
        "opponentId": "dual_red_blue",
        "winRate": 0.4167,
        "games": 48
      },
      {
        "opponentId": "dual_blue_gold",
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
    "coverCardId": "red_47_arquiduque_ferro",
    "classicDeckIds": [],
    "tierBadge": "S",
    "overallWinRate": 0.578,
    "ci95HalfWidth": 0.0219,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.6628,
      "bicolor": 0.5292,
      "tricolor": 0.5185,
      "pentachromatic": 0.5486
    },
    "bestMatchups": [
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.875,
        "games": 48
      },
      {
        "opponentId": "mono_gold_judgment",
        "winRate": 0.7708,
        "games": 48
      },
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.7292,
        "games": 48
      },
      {
        "opponentId": "mono_gold_phalanx",
        "winRate": 0.7292,
        "games": 48
      },
      {
        "opponentId": "mono_green_colossus",
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
        "winRate": 0.3333,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.3542,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.3958,
        "games": 48
      },
      {
        "opponentId": "dual_purple_neutral",
        "winRate": 0.4375,
        "games": 48
      }
    ]
  },
  {
    "rank": 11,
    "archetypeId": "dual_gold_neutral",
    "name": "Aliança do Bastião Relojoeiro",
    "subtitle": "Aliança ☀️+⚙️ • Falange de Ferro Meteórico & Escudo Real",
    "format": "bicolor",
    "domains": [
      "gold",
      "neutral"
    ],
    "coverCardId": "neutral_118_volothamp_cronista_mundos",
    "classicDeckIds": [],
    "tierBadge": "S",
    "overallWinRate": 0.5775,
    "ci95HalfWidth": 0.0219,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.724,
      "bicolor": 0.5119,
      "tricolor": 0.4604,
      "pentachromatic": 0.4931
    },
    "bestMatchups": [
      {
        "opponentId": "mono_green_swarm",
        "winRate": 0.875,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.875,
        "games": 48
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.8333,
        "games": 48
      },
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.7917,
        "games": 48
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.7917,
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
        "opponentId": "dual_red_neutral",
        "winRate": 0.3333,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.375,
        "games": 48
      },
      {
        "opponentId": "dual_blue_green",
        "winRate": 0.375,
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
    "overallWinRate": 0.5712,
    "ci95HalfWidth": 0.0221,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.6771,
      "bicolor": 0.5222,
      "tricolor": 0.4771,
      "pentachromatic": 0.5625
    },
    "bestMatchups": [
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.7917,
        "games": 48
      },
      {
        "opponentId": "mono_purple_crypt",
        "winRate": 0.7708,
        "games": 48
      },
      {
        "opponentId": "mono_gold_phalanx",
        "winRate": 0.7708,
        "games": 48
      },
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.75,
        "games": 48
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.7292,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.2917,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_gold",
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
        "winRate": 0.3542,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_green",
        "winRate": 0.3958,
        "games": 48
      }
    ]
  },
  {
    "rank": 13,
    "archetypeId": "dual_blue_neutral",
    "name": "Aliança do Astrolábio Arcano",
    "subtitle": "Aliança ❄️+⚙️ • Controle Horológico, Alcance & Voo",
    "format": "bicolor",
    "domains": [
      "blue",
      "neutral"
    ],
    "coverCardId": "blue_81_arconte_cronos",
    "classicDeckIds": [],
    "tierBadge": "S",
    "overallWinRate": 0.5664,
    "ci95HalfWidth": 0.0219,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.6706,
      "bicolor": 0.5208,
      "tricolor": 0.4813,
      "pentachromatic": 0.5069
    },
    "bestMatchups": [
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.9167,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.8125,
        "games": 48
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.8125,
        "games": 48
      },
      {
        "opponentId": "mono_purple_crypt",
        "winRate": 0.7708,
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
        "winRate": 0.4167,
        "games": 48
      },
      {
        "opponentId": "dual_red_gold",
        "winRate": 0.4167,
        "games": 48
      },
      {
        "opponentId": "penta_prismatic_crater",
        "winRate": 0.4375,
        "games": 48
      }
    ]
  },
  {
    "rank": 14,
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
    "overallWinRate": 0.5664,
    "ci95HalfWidth": 0.0218,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.7083,
      "bicolor": 0.5069,
      "tricolor": 0.4398,
      "pentachromatic": 0.4861
    },
    "bestMatchups": [
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.875,
        "games": 48
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.8125,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.7917,
        "games": 48
      },
      {
        "opponentId": "mono_green_swarm",
        "winRate": 0.7708,
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
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.3125,
        "games": 48
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.3125,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.3542,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.3542,
        "games": 48
      },
      {
        "opponentId": "dual_red_gold",
        "winRate": 0.3542,
        "games": 48
      }
    ]
  },
  {
    "rank": 15,
    "archetypeId": "dual_blue_gold",
    "name": "Pacto da Forja do Zênite",
    "subtitle": "Pacto Duplo ❄️+☀️ • Cidadela Cronomante & Escudo Celeste",
    "format": "bicolor",
    "domains": [
      "blue",
      "gold"
    ],
    "coverCardId": "gold_157_dragao_soberano_alvorada",
    "classicDeckIds": [
      "deck_dual_arcane_forge"
    ],
    "tierBadge": "S",
    "overallWinRate": 0.5659,
    "ci95HalfWidth": 0.0226,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.7005,
      "bicolor": 0.5045,
      "tricolor": 0.4729,
      "pentachromatic": 0.4444
    },
    "bestMatchups": [
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.875,
        "games": 48
      },
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.8333,
        "games": 48
      },
      {
        "opponentId": "mono_red_blitz",
        "winRate": 0.8125,
        "games": 48
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.8125,
        "games": 48
      },
      {
        "opponentId": "dual_red_purple",
        "winRate": 0.7917,
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
        "opponentId": "dual_green_neutral",
        "winRate": 0.2708,
        "games": 48
      },
      {
        "opponentId": "dual_blue_neutral",
        "winRate": 0.3125,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_green",
        "winRate": 0.3333,
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
    "rank": 16,
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
    "overallWinRate": 0.5649,
    "ci95HalfWidth": 0.0222,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.7044,
      "bicolor": 0.4911,
      "tricolor": 0.4625,
      "pentachromatic": 0.5069
    },
    "bestMatchups": [
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.8542,
        "games": 48
      },
      {
        "opponentId": "mono_gold_celestial",
        "winRate": 0.8125,
        "games": 48
      },
      {
        "opponentId": "mono_green_swarm",
        "winRate": 0.7917,
        "games": 48
      },
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.7917,
        "games": 48
      },
      {
        "opponentId": "mono_gold_phalanx",
        "winRate": 0.7917,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.25,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.2708,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.2917,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.2917,
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
    "overallWinRate": 0.5635,
    "ci95HalfWidth": 0.0223,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.681,
      "bicolor": 0.5056,
      "tricolor": 0.4861,
      "pentachromatic": 0.4583
    },
    "bestMatchups": [
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.8542,
        "games": 48
      },
      {
        "opponentId": "mono_gold_phalanx",
        "winRate": 0.7708,
        "games": 48
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.75,
        "games": 48
      },
      {
        "opponentId": "mono_gold_celestial",
        "winRate": 0.75,
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
        "opponentId": "dual_red_gold",
        "winRate": 0.2708,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_green",
        "winRate": 0.2917,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.3125,
        "games": 48
      },
      {
        "opponentId": "penta_free_city_sovereign",
        "winRate": 0.3958,
        "games": 48
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.3958,
        "games": 48
      }
    ]
  },
  {
    "rank": 18,
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
    "overallWinRate": 0.5625,
    "ci95HalfWidth": 0.0224,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.7174,
      "bicolor": 0.4611,
      "tricolor": 0.4958,
      "pentachromatic": 0.4167
    },
    "bestMatchups": [
      {
        "opponentId": "mono_red_pyroclasm",
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
        "winRate": 0.8125,
        "games": 48
      },
      {
        "opponentId": "mono_gold_judgment",
        "winRate": 0.8125,
        "games": 48
      },
      {
        "opponentId": "mono_neutral_axial",
        "winRate": 0.7917,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.2083,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.2708,
        "games": 48
      },
      {
        "opponentId": "dual_red_gold",
        "winRate": 0.3333,
        "games": 48
      },
      {
        "opponentId": "dual_green_neutral",
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
    "rank": 19,
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
    "tierBadge": "A",
    "overallWinRate": 0.5484,
    "ci95HalfWidth": 0.0224,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.6875,
      "bicolor": 0.4896,
      "tricolor": 0.4458,
      "pentachromatic": 0.4236
    },
    "bestMatchups": [
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.9375,
        "games": 48
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.875,
        "games": 48
      },
      {
        "opponentId": "mono_purple_crypt",
        "winRate": 0.8333,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.7917,
        "games": 48
      },
      {
        "opponentId": "mono_neutral_axial",
        "winRate": 0.7917,
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
        "opponentId": "tri_blue_green_gold",
        "winRate": 0.3333,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_green",
        "winRate": 0.3542,
        "games": 48
      },
      {
        "opponentId": "dual_gold_neutral",
        "winRate": 0.3542,
        "games": 48
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.375,
        "games": 48
      }
    ]
  },
  {
    "rank": 20,
    "archetypeId": "tri_blue_purple_gold",
    "name": "Relicário do Trono Eterno",
    "subtitle": "Tríade ☀️+❄️+💀 • Cidadela de Relíquias, Cronomancia & Veredito",
    "format": "tricolor",
    "domains": [
      "gold",
      "blue",
      "purple"
    ],
    "coverCardId": "blue_97_draco_relampago",
    "classicDeckIds": [
      "deck_tri_eternal_reliquary"
    ],
    "tierBadge": "A",
    "overallWinRate": 0.5368,
    "ci95HalfWidth": 0.0222,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.6862,
      "bicolor": 0.4542,
      "tricolor": 0.4468,
      "pentachromatic": 0.4236
    },
    "bestMatchups": [
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.8333,
        "games": 48
      },
      {
        "opponentId": "mono_red_dragon",
        "winRate": 0.7917,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.7708,
        "games": 48
      },
      {
        "opponentId": "mono_gold_celestial",
        "winRate": 0.7708,
        "games": 48
      },
      {
        "opponentId": "mono_green_swarm",
        "winRate": 0.75,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_purple_green_gold",
        "winRate": 0.3125,
        "games": 48
      },
      {
        "opponentId": "tri_blue_green_gold",
        "winRate": 0.3125,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.3333,
        "games": 48
      },
      {
        "opponentId": "dual_green_neutral",
        "winRate": 0.3542,
        "games": 48
      },
      {
        "opponentId": "dual_purple_gold",
        "winRate": 0.3542,
        "games": 48
      }
    ]
  },
  {
    "rank": 21,
    "archetypeId": "dual_red_blue",
    "name": "Pacto do Fogo Astral",
    "subtitle": "Pacto Duplo 🔥+❄️ • Artilharia Arcana, Voo & Tempestade",
    "format": "bicolor",
    "domains": [
      "red",
      "blue"
    ],
    "coverCardId": "red_99_senhor_balor_fogo",
    "classicDeckIds": [
      "deck_dual_storm_dragon"
    ],
    "tierBadge": "A",
    "overallWinRate": 0.5165,
    "ci95HalfWidth": 0.0216,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.6068,
      "bicolor": 0.4613,
      "tricolor": 0.4542,
      "pentachromatic": 0.5
    },
    "bestMatchups": [
      {
        "opponentId": "mono_gold_phalanx",
        "winRate": 0.7917,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.7292,
        "games": 48
      },
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.6875,
        "games": 48
      },
      {
        "opponentId": "mono_blue_frost",
        "winRate": 0.6875,
        "games": 48
      },
      {
        "opponentId": "mono_gold_judgment",
        "winRate": 0.6667,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.2708,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.3125,
        "games": 48
      },
      {
        "opponentId": "dual_red_green",
        "winRate": 0.3333,
        "games": 48
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.3542,
        "games": 48
      },
      {
        "opponentId": "mono_red_blitz",
        "winRate": 0.375,
        "games": 48
      }
    ]
  },
  {
    "rank": 22,
    "archetypeId": "dual_purple_green",
    "name": "Pacto da Podridão Eterna",
    "subtitle": "Pacto Duplo 💀+🌿 • Cripta, Regeneração & Veneno",
    "format": "bicolor",
    "domains": [
      "purple",
      "green"
    ],
    "coverCardId": "green_49_dragao_esmeralda",
    "classicDeckIds": [
      "deck_dual_eternal_rot"
    ],
    "tierBadge": "A",
    "overallWinRate": 0.5063,
    "ci95HalfWidth": 0.022,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.638,
      "bicolor": 0.4479,
      "tricolor": 0.4167,
      "pentachromatic": 0.375
    },
    "bestMatchups": [
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.875,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.8125,
        "games": 48
      },
      {
        "opponentId": "mono_gold_judgment",
        "winRate": 0.7292,
        "games": 48
      },
      {
        "opponentId": "mono_purple_umbral",
        "winRate": 0.7083,
        "games": 48
      },
      {
        "opponentId": "mono_red_blitz",
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
        "opponentId": "tri_red_purple_green",
        "winRate": 0.25,
        "games": 48
      },
      {
        "opponentId": "penta_free_city_sovereign",
        "winRate": 0.2708,
        "games": 48
      },
      {
        "opponentId": "dual_green_neutral",
        "winRate": 0.2917,
        "games": 48
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.3333,
        "games": 48
      }
    ]
  },
  {
    "rank": 23,
    "archetypeId": "dual_green_gold",
    "name": "Pacto da Aurora Silvestre",
    "subtitle": "Pacto Duplo 🌿+☀️ • Falange dos Mil Escudos & Hinos Globais",
    "format": "bicolor",
    "domains": [
      "green",
      "gold"
    ],
    "coverCardId": "green_50_avatar_gaia",
    "classicDeckIds": [
      "deck_dual_solar_wild"
    ],
    "tierBadge": "A",
    "overallWinRate": 0.5039,
    "ci95HalfWidth": 0.0225,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.6497,
      "bicolor": 0.4345,
      "tricolor": 0.3917,
      "pentachromatic": 0.4236
    },
    "bestMatchups": [
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.7708,
        "games": 48
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.7708,
        "games": 48
      },
      {
        "opponentId": "mono_gold_phalanx",
        "winRate": 0.7292,
        "games": 48
      },
      {
        "opponentId": "mono_green_swarm",
        "winRate": 0.6667,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.6667,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.2083,
        "games": 48
      },
      {
        "opponentId": "tri_red_green_gold",
        "winRate": 0.2708,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.2917,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.3333,
        "games": 48
      },
      {
        "opponentId": "dual_red_green",
        "winRate": 0.3333,
        "games": 48
      }
    ]
  },
  {
    "rank": 24,
    "archetypeId": "dual_blue_purple",
    "name": "Pacto da Tormenta Abissal",
    "subtitle": "Pacto Duplo ❄️+💀 • Estase Glacial & Execução Umbral",
    "format": "bicolor",
    "domains": [
      "blue",
      "purple"
    ],
    "coverCardId": "blue_80_senhor_tempo",
    "classicDeckIds": [
      "deck_dual_abyssal_storm"
    ],
    "tierBadge": "A",
    "overallWinRate": 0.5005,
    "ci95HalfWidth": 0.0219,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.6055,
      "bicolor": 0.4494,
      "tricolor": 0.4104,
      "pentachromatic": 0.4792
    },
    "bestMatchups": [
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.75,
        "games": 48
      },
      {
        "opponentId": "mono_gold_phalanx",
        "winRate": 0.7292,
        "games": 48
      },
      {
        "opponentId": "mono_green_swarm",
        "winRate": 0.7083,
        "games": 48
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.7083,
        "games": 48
      },
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.6875,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.1667,
        "games": 48
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.1875,
        "games": 48
      },
      {
        "opponentId": "dual_red_purple",
        "winRate": 0.3125,
        "games": 48
      },
      {
        "opponentId": "dual_purple_neutral",
        "winRate": 0.3333,
        "games": 48
      },
      {
        "opponentId": "dual_blue_neutral",
        "winRate": 0.3333,
        "games": 48
      }
    ]
  },
  {
    "rank": 25,
    "archetypeId": "dual_red_purple",
    "name": "Pacto da Chama Sangrenta",
    "subtitle": "Pacto Duplo 🔥+💀 • Blitz Sanguinária, Dreno & Último Suspiro",
    "format": "bicolor",
    "domains": [
      "red",
      "purple"
    ],
    "coverCardId": "purple_23_dracolich",
    "classicDeckIds": [
      "deck_dual_blood_flame"
    ],
    "tierBadge": "A",
    "overallWinRate": 0.4961,
    "ci95HalfWidth": 0.0226,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.6224,
      "bicolor": 0.4271,
      "tricolor": 0.4104,
      "pentachromatic": 0.4306
    },
    "bestMatchups": [
      {
        "opponentId": "mono_blue_chrono",
        "winRate": 0.8542,
        "games": 48
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.7917,
        "games": 48
      },
      {
        "opponentId": "mono_red_dragon",
        "winRate": 0.7292,
        "games": 48
      },
      {
        "opponentId": "mono_red_blitz",
        "winRate": 0.7083,
        "games": 48
      },
      {
        "opponentId": "dual_blue_purple",
        "winRate": 0.6875,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "dual_blue_gold",
        "winRate": 0.2083,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.2292,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.25,
        "games": 48
      },
      {
        "opponentId": "tri_purple_green_gold",
        "winRate": 0.3125,
        "games": 48
      },
      {
        "opponentId": "dual_green_neutral",
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
    "overallWinRate": 0.4942,
    "ci95HalfWidth": 0.0223,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.5781,
      "bicolor": 0.4792,
      "tricolor": 0.4074,
      "pentachromatic": 0.3819
    },
    "bestMatchups": [
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.6875,
        "games": 48
      },
      {
        "opponentId": "mono_red_dragon",
        "winRate": 0.6875,
        "games": 48
      },
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.6667,
        "games": 48
      },
      {
        "opponentId": "mono_gold_phalanx",
        "winRate": 0.6667,
        "games": 48
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.6458,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.25,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.2917,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.3333,
        "games": 48
      },
      {
        "opponentId": "penta_free_city_sovereign",
        "winRate": 0.3542,
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
    "coverCardId": "purple_83_arquidemonio_tempo",
    "classicDeckIds": [
      "deck_tri_abyssal_chimera"
    ],
    "tierBadge": "A",
    "overallWinRate": 0.4932,
    "ci95HalfWidth": 0.0216,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.6432,
      "bicolor": 0.4222,
      "tricolor": 0.3843,
      "pentachromatic": 0.375
    },
    "bestMatchups": [
      {
        "opponentId": "mono_neutral_axial",
        "winRate": 0.75,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.7292,
        "games": 48
      },
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.7083,
        "games": 48
      },
      {
        "opponentId": "mono_red_dragon",
        "winRate": 0.7083,
        "games": 48
      },
      {
        "opponentId": "mono_gold_judgment",
        "winRate": 0.7083,
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
        "winRate": 0.2708,
        "games": 48
      },
      {
        "opponentId": "penta_prismatic_crater",
        "winRate": 0.2917,
        "games": 48
      },
      {
        "opponentId": "dual_green_neutral",
        "winRate": 0.2917,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.3125,
        "games": 48
      }
    ]
  },
  {
    "rank": 28,
    "archetypeId": "dual_purple_neutral",
    "name": "Aliança da Guilda das Máscaras",
    "subtitle": "Aliança 💀+⚙️ • Lâminas Letais, Dreno & Submundo Axial",
    "format": "bicolor",
    "domains": [
      "purple",
      "neutral"
    ],
    "coverCardId": "purple_47_avatar_escuridao",
    "classicDeckIds": [],
    "tierBadge": "A",
    "overallWinRate": 0.4617,
    "ci95HalfWidth": 0.0226,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.5964,
      "bicolor": 0.369,
      "tricolor": 0.3896,
      "pentachromatic": 0.4167
    },
    "bestMatchups": [
      {
        "opponentId": "mono_purple_umbral",
        "winRate": 0.7708,
        "games": 48
      },
      {
        "opponentId": "mono_blue_frost",
        "winRate": 0.6875,
        "games": 48
      },
      {
        "opponentId": "mono_red_dragon",
        "winRate": 0.6667,
        "games": 48
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.6667,
        "games": 48
      },
      {
        "opponentId": "dual_blue_purple",
        "winRate": 0.6667,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.0833,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.1875,
        "games": 48
      },
      {
        "opponentId": "dual_red_gold",
        "winRate": 0.25,
        "games": 48
      },
      {
        "opponentId": "dual_green_neutral",
        "winRate": 0.2708,
        "games": 48
      },
      {
        "opponentId": "tri_purple_green_gold",
        "winRate": 0.2917,
        "games": 48
      }
    ]
  },
  {
    "rank": 29,
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
    "overallWinRate": 0.4535,
    "ci95HalfWidth": 0.0227,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.5667,
      "bicolor": 0.3972,
      "tricolor": 0.3875,
      "pentachromatic": 0.3889
    },
    "bestMatchups": [
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.8125,
        "games": 48
      },
      {
        "opponentId": "mono_blue_frost",
        "winRate": 0.7708,
        "games": 48
      },
      {
        "opponentId": "mono_gold_judgment",
        "winRate": 0.7083,
        "games": 48
      },
      {
        "opponentId": "mono_gold_celestial",
        "winRate": 0.6875,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.6667,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.1042,
        "games": 48
      },
      {
        "opponentId": "dual_red_purple",
        "winRate": 0.1458,
        "games": 48
      },
      {
        "opponentId": "dual_red_green",
        "winRate": 0.1458,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.1875,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.2292,
        "games": 48
      }
    ]
  },
  {
    "rank": 30,
    "archetypeId": "mono_red_blitz",
    "name": "Blitz Salamandra",
    "subtitle": "Mono-Vermelho 🔥 • Ímpeto & Pele Incandescente",
    "format": "monocolor",
    "domains": [
      "red"
    ],
    "coverCardId": "red_157_dragao_tiamat_carmesim",
    "classicDeckIds": [
      "deck_aggro_blitz"
    ],
    "tierBadge": "B",
    "overallWinRate": 0.4399,
    "ci95HalfWidth": 0.0227,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.575,
      "bicolor": 0.3792,
      "tricolor": 0.3521,
      "pentachromatic": 0.3611
    },
    "bestMatchups": [
      {
        "opponentId": "mono_blue_frost",
        "winRate": 0.7292,
        "games": 48
      },
      {
        "opponentId": "mono_blue_chrono",
        "winRate": 0.7292,
        "games": 48
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.7292,
        "games": 48
      },
      {
        "opponentId": "mono_red_dragon",
        "winRate": 0.6875,
        "games": 48
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.6458,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "dual_blue_gold",
        "winRate": 0.1875,
        "games": 48
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.2083,
        "games": 48
      },
      {
        "opponentId": "tri_red_green_gold",
        "winRate": 0.2292,
        "games": 48
      },
      {
        "opponentId": "tri_blue_purple_gold",
        "winRate": 0.25,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.2708,
        "games": 48
      }
    ]
  },
  {
    "rank": 31,
    "archetypeId": "mono_blue_frost",
    "name": "Inverno Eterno",
    "subtitle": "Mono-Azul ❄️ • Congelar & Estase Tática",
    "format": "monocolor",
    "domains": [
      "blue"
    ],
    "coverCardId": "blue_136_leviata_cronos",
    "classicDeckIds": [
      "deck_blue_tempest"
    ],
    "tierBadge": "B",
    "overallWinRate": 0.4356,
    "ci95HalfWidth": 0.022,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.5139,
      "bicolor": 0.3681,
      "tricolor": 0.4229,
      "pentachromatic": 0.4236
    },
    "bestMatchups": [
      {
        "opponentId": "mono_green_swarm",
        "winRate": 0.6875,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.6875,
        "games": 48
      },
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.6875,
        "games": 48
      },
      {
        "opponentId": "mono_gold_phalanx",
        "winRate": 0.625,
        "games": 48
      },
      {
        "opponentId": "mono_gold_celestial",
        "winRate": 0.625,
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
        "opponentId": "mono_blue_chrono",
        "winRate": 0.2292,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.2708,
        "games": 48
      },
      {
        "opponentId": "mono_red_blitz",
        "winRate": 0.2708,
        "games": 48
      },
      {
        "opponentId": "dual_purple_neutral",
        "winRate": 0.3125,
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
    "coverCardId": "neutral_117_elminster_sabio_cinzento",
    "classicDeckIds": [
      "deck_neutral_watch"
    ],
    "tierBadge": "B",
    "overallWinRate": 0.4157,
    "ci95HalfWidth": 0.0222,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.5778,
      "bicolor": 0.3542,
      "tricolor": 0.3063,
      "pentachromatic": 0.2778
    },
    "bestMatchups": [
      {
        "opponentId": "mono_blue_chrono",
        "winRate": 0.7708,
        "games": 48
      },
      {
        "opponentId": "mono_red_dragon",
        "winRate": 0.75,
        "games": 48
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.7292,
        "games": 48
      },
      {
        "opponentId": "mono_purple_umbral",
        "winRate": 0.6667,
        "games": 48
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.6458,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "dual_green_neutral",
        "winRate": 0.125,
        "games": 48
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.1667,
        "games": 48
      },
      {
        "opponentId": "dual_red_gold",
        "winRate": 0.1667,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.1875,
        "games": 48
      },
      {
        "opponentId": "penta_wheel_convergence",
        "winRate": 0.2083,
        "games": 48
      }
    ]
  },
  {
    "rank": 33,
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
    "overallWinRate": 0.405,
    "ci95HalfWidth": 0.0215,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.5444,
      "bicolor": 0.3514,
      "tricolor": 0.3,
      "pentachromatic": 0.3264
    },
    "bestMatchups": [
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.7917,
        "games": 48
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.6667,
        "games": 48
      },
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.6458,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.6458,
        "games": 48
      },
      {
        "opponentId": "mono_purple_crypt",
        "winRate": 0.5833,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.1875,
        "games": 48
      },
      {
        "opponentId": "dual_blue_green",
        "winRate": 0.1875,
        "games": 48
      },
      {
        "opponentId": "dual_red_gold",
        "winRate": 0.2083,
        "games": 48
      },
      {
        "opponentId": "tri_blue_purple_gold",
        "winRate": 0.2292,
        "games": 48
      },
      {
        "opponentId": "dual_gold_neutral",
        "winRate": 0.2292,
        "games": 48
      }
    ]
  },
  {
    "rank": 34,
    "archetypeId": "mono_purple_umbral",
    "name": "Inquisição Umbral",
    "subtitle": "Mono-Roxo 🌑 • Destruição, Debuff & Controle",
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "coverCardId": "purple_65_principe_mortos",
    "classicDeckIds": [],
    "tierBadge": "B",
    "overallWinRate": 0.4007,
    "ci95HalfWidth": 0.0221,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.5278,
      "bicolor": 0.3236,
      "tricolor": 0.3688,
      "pentachromatic": 0.2569
    },
    "bestMatchups": [
      {
        "opponentId": "mono_purple_crypt",
        "winRate": 0.6458,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.625,
        "games": 48
      },
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.625,
        "games": 48
      },
      {
        "opponentId": "mono_blue_chrono",
        "winRate": 0.6042,
        "games": 48
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.6042,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.1667,
        "games": 48
      },
      {
        "opponentId": "dual_red_gold",
        "winRate": 0.1875,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.2083,
        "games": 48
      },
      {
        "opponentId": "dual_green_neutral",
        "winRate": 0.2083,
        "games": 48
      },
      {
        "opponentId": "penta_prismatic_crater",
        "winRate": 0.2292,
        "games": 48
      }
    ]
  },
  {
    "rank": 35,
    "archetypeId": "mono_gold_phalanx",
    "name": "Falange Impenetrável",
    "subtitle": "Mono-Dourado 🛡️ • Guardião, Armadura & Bastião",
    "format": "monocolor",
    "domains": [
      "gold"
    ],
    "coverCardId": "gold_83_forjado_ancestral",
    "classicDeckIds": [
      "deck_gold_radiant"
    ],
    "tierBadge": "B",
    "overallWinRate": 0.3978,
    "ci95HalfWidth": 0.0223,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.5542,
      "bicolor": 0.3333,
      "tricolor": 0.2854,
      "pentachromatic": 0.3125
    },
    "bestMatchups": [
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.7708,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.6458,
        "games": 48
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.6458,
        "games": 48
      },
      {
        "opponentId": "mono_purple_crypt",
        "winRate": 0.6458,
        "games": 48
      },
      {
        "opponentId": "mono_green_swarm",
        "winRate": 0.625,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_purple_green_gold",
        "winRate": 0.1458,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.1875,
        "games": 48
      },
      {
        "opponentId": "dual_red_blue",
        "winRate": 0.2083,
        "games": 48
      },
      {
        "opponentId": "dual_blue_green",
        "winRate": 0.2083,
        "games": 48
      },
      {
        "opponentId": "penta_free_city_sovereign",
        "winRate": 0.2292,
        "games": 48
      }
    ]
  },
  {
    "rank": 36,
    "archetypeId": "mono_green_colossus",
    "name": "Colossos Primordiais",
    "subtitle": "Mono-Verde 🌿 • Ramp & Atropelar",
    "format": "monocolor",
    "domains": [
      "green"
    ],
    "coverCardId": "green_173_general_roda_selva",
    "classicDeckIds": [
      "deck_green_wild",
      "deck_midrange_beasts"
    ],
    "tierBadge": "B",
    "overallWinRate": 0.3721,
    "ci95HalfWidth": 0.0216,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.5208,
      "bicolor": 0.2903,
      "tricolor": 0.2896,
      "pentachromatic": 0.3125
    },
    "bestMatchups": [
      {
        "opponentId": "mono_purple_crypt",
        "winRate": 0.6875,
        "games": 48
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.6875,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.6667,
        "games": 48
      },
      {
        "opponentId": "mono_purple_umbral",
        "winRate": 0.6667,
        "games": 48
      },
      {
        "opponentId": "mono_green_swarm",
        "winRate": 0.6042,
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
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.1667,
        "games": 48
      },
      {
        "opponentId": "dual_blue_gold",
        "winRate": 0.1667,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.1875,
        "games": 48
      },
      {
        "opponentId": "dual_red_gold",
        "winRate": 0.1875,
        "games": 48
      }
    ]
  },
  {
    "rank": 37,
    "archetypeId": "mono_purple_crypt",
    "name": "Guardiões da Cripta",
    "subtitle": "Mono-Roxo 💀 • Renascer & Reanimação",
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "coverCardId": "purple_99_lorde_vampiro_anciao",
    "classicDeckIds": [
      "deck_purple_shadow",
      "deck_crypt_reanimator"
    ],
    "tierBadge": "B",
    "overallWinRate": 0.3697,
    "ci95HalfWidth": 0.0212,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.4833,
      "bicolor": 0.3083,
      "tricolor": 0.3167,
      "pentachromatic": 0.2847
    },
    "bestMatchups": [
      {
        "opponentId": "mono_blue_frost",
        "winRate": 0.6667,
        "games": 48
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.6042,
        "games": 48
      },
      {
        "opponentId": "mono_red_dragon",
        "winRate": 0.6042,
        "games": 48
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.6042,
        "games": 48
      },
      {
        "opponentId": "mono_green_swarm",
        "winRate": 0.5625,
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
        "opponentId": "dual_purple_gold",
        "winRate": 0.1667,
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
        "opponentId": "tri_red_purple_green",
        "winRate": 0.2292,
        "games": 48
      }
    ]
  },
  {
    "rank": 38,
    "archetypeId": "mono_red_dragon",
    "name": "Trono Dracônico",
    "subtitle": "Mono-Vermelho 🔥 • Voo, Sopro & Ascensão",
    "format": "monocolor",
    "domains": [
      "red"
    ],
    "coverCardId": "red_08_dragao_vermelho",
    "classicDeckIds": [
      "deck_red_inferno"
    ],
    "tierBadge": "B",
    "overallWinRate": 0.3643,
    "ci95HalfWidth": 0.0212,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.4722,
      "bicolor": 0.3264,
      "tricolor": 0.2583,
      "pentachromatic": 0.3681
    },
    "bestMatchups": [
      {
        "opponentId": "mono_gold_phalanx",
        "winRate": 0.6667,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.6458,
        "games": 48
      },
      {
        "opponentId": "mono_gold_celestial",
        "winRate": 0.6458,
        "games": 48
      },
      {
        "opponentId": "mono_blue_chrono",
        "winRate": 0.5625,
        "games": 48
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.5417,
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
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.1667,
        "games": 48
      },
      {
        "opponentId": "dual_red_green",
        "winRate": 0.1667,
        "games": 48
      },
      {
        "opponentId": "dual_red_gold",
        "winRate": 0.1875,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.2083,
        "games": 48
      }
    ]
  },
  {
    "rank": 39,
    "archetypeId": "mono_green_swarm",
    "name": "Enxame & Matilha Silvestre",
    "subtitle": "Mono-Verde 🌿 • Aggro & Buff em Massa",
    "format": "monocolor",
    "domains": [
      "green"
    ],
    "coverCardId": "green_141_soberano_fera_primordial",
    "classicDeckIds": [],
    "tierBadge": "B",
    "overallWinRate": 0.36,
    "ci95HalfWidth": 0.0219,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.4778,
      "bicolor": 0.3083,
      "tricolor": 0.2771,
      "pentachromatic": 0.3056
    },
    "bestMatchups": [
      {
        "opponentId": "mono_red_dragon",
        "winRate": 0.625,
        "games": 48
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.625,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.6042,
        "games": 48
      },
      {
        "opponentId": "dual_red_blue",
        "winRate": 0.5625,
        "games": 48
      },
      {
        "opponentId": "mono_purple_umbral",
        "winRate": 0.5417,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.0833,
        "games": 48
      },
      {
        "opponentId": "dual_gold_neutral",
        "winRate": 0.125,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.1458,
        "games": 48
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.2083,
        "games": 48
      },
      {
        "opponentId": "dual_blue_green",
        "winRate": 0.2083,
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
    "coverCardId": "blue_06_dragao_azul",
    "classicDeckIds": [],
    "tierBadge": "B",
    "overallWinRate": 0.3561,
    "ci95HalfWidth": 0.0212,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.4819,
      "bicolor": 0.3222,
      "tricolor": 0.2604,
      "pentachromatic": 0.2153
    },
    "bestMatchups": [
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.7083,
        "games": 48
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.6458,
        "games": 48
      },
      {
        "opponentId": "mono_gold_judgment",
        "winRate": 0.6042,
        "games": 48
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.5625,
        "games": 48
      },
      {
        "opponentId": "mono_neutral_axial",
        "winRate": 0.5625,
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
        "opponentId": "penta_prismatic_crater",
        "winRate": 0.1458,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.1458,
        "games": 48
      },
      {
        "opponentId": "dual_red_gold",
        "winRate": 0.1667,
        "games": 48
      },
      {
        "opponentId": "mono_blue_chrono",
        "winRate": 0.1875,
        "games": 48
      }
    ]
  },
  {
    "rank": 41,
    "archetypeId": "mono_gold_judgment",
    "name": "Julgamento Solar",
    "subtitle": "Mono-Dourado ⚖️ • Relíquias, Escudo Global & Cura",
    "format": "monocolor",
    "domains": [
      "gold"
    ],
    "coverCardId": "gold_119_soberano_ordem_eterna",
    "classicDeckIds": [
      "deck_relic_artificer"
    ],
    "tierBadge": "B",
    "overallWinRate": 0.3551,
    "ci95HalfWidth": 0.0211,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.4972,
      "bicolor": 0.3028,
      "tricolor": 0.2542,
      "pentachromatic": 0.2431
    },
    "bestMatchups": [
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.7083,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.6458,
        "games": 48
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.6458,
        "games": 48
      },
      {
        "opponentId": "mono_green_swarm",
        "winRate": 0.6042,
        "games": 48
      },
      {
        "opponentId": "mono_red_blitz",
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
        "opponentId": "penta_wheel_convergence",
        "winRate": 0.1875,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.1875,
        "games": 48
      },
      {
        "opponentId": "dual_green_neutral",
        "winRate": 0.1875,
        "games": 48
      },
      {
        "opponentId": "dual_blue_green",
        "winRate": 0.2083,
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
    "coverCardId": "red_138_colosso_vulcano_primordial",
    "classicDeckIds": [],
    "tierBadge": "B",
    "overallWinRate": 0.3266,
    "ci95HalfWidth": 0.0212,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.4458,
      "bicolor": 0.2653,
      "tricolor": 0.2542,
      "pentachromatic": 0.2778
    },
    "bestMatchups": [
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.6458,
        "games": 48
      },
      {
        "opponentId": "mono_red_dragon",
        "winRate": 0.625,
        "games": 48
      },
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.5417,
        "games": 48
      },
      {
        "opponentId": "mono_blue_frost",
        "winRate": 0.5417,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.5,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.0833,
        "games": 48
      },
      {
        "opponentId": "dual_blue_neutral",
        "winRate": 0.0833,
        "games": 48
      },
      {
        "opponentId": "dual_purple_gold",
        "winRate": 0.125,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_gold",
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
    "rank": 43,
    "archetypeId": "mono_green_roots",
    "name": "Raízes Eternas",
    "subtitle": "Mono-Verde 🌿 • Guardião & Regeneração",
    "format": "monocolor",
    "domains": [
      "green"
    ],
    "coverCardId": "green_86_tarrasque_desperto",
    "classicDeckIds": [],
    "tierBadge": "B",
    "overallWinRate": 0.2804,
    "ci95HalfWidth": 0.0197,
    "matchesPlayed": 2058,
    "vsFormatWinRates": {
      "monocolor": 0.3931,
      "bicolor": 0.2444,
      "tricolor": 0.1941,
      "pentachromatic": 0.1806
    },
    "bestMatchups": [
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.5417,
        "games": 48
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.5,
        "games": 48
      },
      {
        "opponentId": "mono_red_blitz",
        "winRate": 0.4792,
        "games": 48
      },
      {
        "opponentId": "mono_purple_crypt",
        "winRate": 0.4792,
        "games": 48
      },
      {
        "opponentId": "dual_red_purple",
        "winRate": 0.4792,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.0714,
        "games": 42
      },
      {
        "opponentId": "tri_red_blue_green",
        "winRate": 0.125,
        "games": 48
      },
      {
        "opponentId": "dual_gold_neutral",
        "winRate": 0.125,
        "games": 48
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.125,
        "games": 48
      },
      {
        "opponentId": "dual_blue_gold",
        "winRate": 0.125,
        "games": 48
      }
    ]
  },
  {
    "rank": 44,
    "archetypeId": "mono_purple_blood",
    "name": "Tributo Vital",
    "subtitle": "Mono-Roxo ⚡ • Dreno de Vida & Toque Letal",
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "coverCardId": "purple_46_noiva_vampira",
    "classicDeckIds": [],
    "tierBadge": "B",
    "overallWinRate": 0.2723,
    "ci95HalfWidth": 0.0199,
    "matchesPlayed": 2064,
    "vsFormatWinRates": {
      "monocolor": 0.3681,
      "bicolor": 0.2097,
      "tricolor": 0.2375,
      "pentachromatic": 0.2222
    },
    "bestMatchups": [
      {
        "opponentId": "mono_blue_frost",
        "winRate": 0.5208,
        "games": 48
      },
      {
        "opponentId": "mono_blue_chrono",
        "winRate": 0.4792,
        "games": 48
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.4583,
        "games": 48
      },
      {
        "opponentId": "mono_red_dragon",
        "winRate": 0.4583,
        "games": 48
      },
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.4375,
        "games": 48
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0,
        "games": 48
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.0625,
        "games": 48
      },
      {
        "opponentId": "dual_purple_gold",
        "winRate": 0.0625,
        "games": 48
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.0833,
        "games": 48
      },
      {
        "opponentId": "tri_red_green_gold",
        "winRate": 0.125,
        "games": 48
      }
    ]
  }
];

export const UNIFIED_MATCHUP_MATRIX: Record<UnifiedChampionId, Record<UnifiedChampionId, number>> = {
  "mono_green_swarm": {
    "mono_green_swarm": 0.5,
    "mono_green_colossus": 0.3958,
    "mono_green_roots": 0.6042,
    "mono_red_blitz": 0.5208,
    "mono_red_pyroclasm": 0.5208,
    "mono_red_dragon": 0.625,
    "mono_blue_frost": 0.3125,
    "mono_blue_chrono": 0.4792,
    "mono_blue_abyssal": 0.4583,
    "mono_purple_crypt": 0.4375,
    "mono_purple_blood": 0.625,
    "mono_purple_umbral": 0.5417,
    "mono_gold_phalanx": 0.375,
    "mono_gold_celestial": 0.4583,
    "mono_gold_judgment": 0.3958,
    "mono_neutral_axial": 0.4167,
    "dual_red_gold": 0.2708,
    "dual_blue_purple": 0.2917,
    "dual_red_green": 0.3542,
    "dual_blue_gold": 0.2708,
    "dual_purple_green": 0.3542,
    "dual_red_purple": 0.4583,
    "dual_blue_green": 0.2083,
    "dual_green_gold": 0.3333,
    "dual_purple_gold": 0.3125,
    "dual_red_blue": 0.5625,
    "dual_green_neutral": 0.2292,
    "dual_red_neutral": 0.2083,
    "dual_blue_neutral": 0.2917,
    "dual_purple_neutral": 0.3542,
    "dual_gold_neutral": 0.125,
    "tri_red_blue_purple": 0.3958,
    "tri_red_green_gold": 0.2292,
    "tri_blue_purple_gold": 0.25,
    "tri_red_purple_green": 0.0833,
    "tri_blue_green_gold": 0.3125,
    "tri_blue_purple_green": 0.3958,
    "tri_red_purple_gold": 0.3333,
    "tri_purple_green_gold": 0.2708,
    "tri_red_blue_green": 0.3542,
    "tri_red_blue_gold": 0.1458,
    "penta_prismatic_crater": 0.3125,
    "penta_free_city_sovereign": 0.3542,
    "penta_wheel_convergence": 0.25
  },
  "mono_green_colossus": {
    "mono_green_swarm": 0.6042,
    "mono_green_colossus": 0.5,
    "mono_green_roots": 0.6667,
    "mono_red_blitz": 0.4375,
    "mono_red_pyroclasm": 0.4583,
    "mono_red_dragon": 0.5417,
    "mono_blue_frost": 0.4583,
    "mono_blue_chrono": 0.375,
    "mono_blue_abyssal": 0.5208,
    "mono_purple_crypt": 0.6875,
    "mono_purple_blood": 0.6875,
    "mono_purple_umbral": 0.6667,
    "mono_gold_phalanx": 0.3958,
    "mono_gold_celestial": 0.3542,
    "mono_gold_judgment": 0.5833,
    "mono_neutral_axial": 0.375,
    "dual_red_gold": 0.1875,
    "dual_blue_purple": 0.3125,
    "dual_red_green": 0.2917,
    "dual_blue_gold": 0.1667,
    "dual_purple_green": 0.3958,
    "dual_red_purple": 0.4583,
    "dual_blue_green": 0.2292,
    "dual_green_gold": 0.3958,
    "dual_purple_gold": 0.25,
    "dual_red_blue": 0.3125,
    "dual_green_neutral": 0.2708,
    "dual_red_neutral": 0.1458,
    "dual_blue_neutral": 0.2917,
    "dual_purple_neutral": 0.4375,
    "dual_gold_neutral": 0.2083,
    "tri_red_blue_purple": 0.5,
    "tri_red_green_gold": 0.2292,
    "tri_blue_purple_gold": 0.2708,
    "tri_red_purple_green": 0.1875,
    "tri_blue_green_gold": 0.3542,
    "tri_blue_purple_green": 0.2917,
    "tri_red_purple_gold": 0.2292,
    "tri_purple_green_gold": 0.375,
    "tri_red_blue_green": 0.2917,
    "tri_red_blue_gold": 0.1667,
    "penta_prismatic_crater": 0.2083,
    "penta_free_city_sovereign": 0.375,
    "penta_wheel_convergence": 0.3542
  },
  "mono_green_roots": {
    "mono_green_swarm": 0.3958,
    "mono_green_colossus": 0.3333,
    "mono_green_roots": 0.5,
    "mono_red_blitz": 0.4792,
    "mono_red_pyroclasm": 0.5,
    "mono_red_dragon": 0.3542,
    "mono_blue_frost": 0.3125,
    "mono_blue_chrono": 0.3333,
    "mono_blue_abyssal": 0.2917,
    "mono_purple_crypt": 0.4792,
    "mono_purple_blood": 0.5417,
    "mono_purple_umbral": 0.375,
    "mono_gold_phalanx": 0.3542,
    "mono_gold_celestial": 0.3542,
    "mono_gold_judgment": 0.3542,
    "mono_neutral_axial": 0.4375,
    "dual_red_gold": 0.3125,
    "dual_blue_purple": 0.25,
    "dual_red_green": 0.3125,
    "dual_blue_gold": 0.125,
    "dual_purple_green": 0.1875,
    "dual_red_purple": 0.4792,
    "dual_blue_green": 0.1458,
    "dual_green_gold": 0.3333,
    "dual_purple_gold": 0.2083,
    "dual_red_blue": 0.2708,
    "dual_green_neutral": 0.1875,
    "dual_red_neutral": 0.125,
    "dual_blue_neutral": 0.1875,
    "dual_purple_neutral": 0.4167,
    "dual_gold_neutral": 0.125,
    "tri_red_blue_purple": 0.3125,
    "tri_red_green_gold": 0.2083,
    "tri_blue_purple_gold": 0.2292,
    "tri_red_purple_green": 0.1667,
    "tri_blue_green_gold": 0.1458,
    "tri_blue_purple_green": 0.2708,
    "tri_red_purple_gold": 0.1667,
    "tri_purple_green_gold": 0.2292,
    "tri_red_blue_green": 0.125,
    "tri_red_blue_gold": 0.0714,
    "penta_prismatic_crater": 0.1458,
    "penta_free_city_sovereign": 0.2083,
    "penta_wheel_convergence": 0.1875
  },
  "mono_red_blitz": {
    "mono_green_swarm": 0.4792,
    "mono_green_colossus": 0.5625,
    "mono_green_roots": 0.5208,
    "mono_red_blitz": 0.5,
    "mono_red_pyroclasm": 0.6458,
    "mono_red_dragon": 0.6875,
    "mono_blue_frost": 0.7292,
    "mono_blue_chrono": 0.7292,
    "mono_blue_abyssal": 0.5833,
    "mono_purple_crypt": 0.5417,
    "mono_purple_blood": 0.7292,
    "mono_purple_umbral": 0.5833,
    "mono_gold_phalanx": 0.5,
    "mono_gold_celestial": 0.4375,
    "mono_gold_judgment": 0.3958,
    "mono_neutral_axial": 0.5,
    "dual_red_gold": 0.4167,
    "dual_blue_purple": 0.5,
    "dual_red_green": 0.4583,
    "dual_blue_gold": 0.1875,
    "dual_purple_green": 0.3125,
    "dual_red_purple": 0.2917,
    "dual_blue_green": 0.6042,
    "dual_green_gold": 0.3333,
    "dual_purple_gold": 0.3125,
    "dual_red_blue": 0.625,
    "dual_green_neutral": 0.3125,
    "dual_red_neutral": 0.2083,
    "dual_blue_neutral": 0.3958,
    "dual_purple_neutral": 0.4583,
    "dual_gold_neutral": 0.2708,
    "tri_red_blue_purple": 0.4583,
    "tri_red_green_gold": 0.2292,
    "tri_blue_purple_gold": 0.25,
    "tri_red_purple_green": 0.2917,
    "tri_blue_green_gold": 0.375,
    "tri_blue_purple_green": 0.4792,
    "tri_red_purple_gold": 0.3333,
    "tri_purple_green_gold": 0.375,
    "tri_red_blue_green": 0.4583,
    "tri_red_blue_gold": 0.2708,
    "penta_prismatic_crater": 0.4792,
    "penta_free_city_sovereign": 0.3125,
    "penta_wheel_convergence": 0.2917
  },
  "mono_red_pyroclasm": {
    "mono_green_swarm": 0.4792,
    "mono_green_colossus": 0.5417,
    "mono_green_roots": 0.5,
    "mono_red_blitz": 0.3542,
    "mono_red_pyroclasm": 0.5,
    "mono_red_dragon": 0.625,
    "mono_blue_frost": 0.5417,
    "mono_blue_chrono": 0.4792,
    "mono_blue_abyssal": 0.3542,
    "mono_purple_crypt": 0.3958,
    "mono_purple_blood": 0.6458,
    "mono_purple_umbral": 0.4375,
    "mono_gold_phalanx": 0.3542,
    "mono_gold_celestial": 0.3333,
    "mono_gold_judgment": 0.2917,
    "mono_neutral_axial": 0.3542,
    "dual_red_gold": 0.2083,
    "dual_blue_purple": 0.2917,
    "dual_red_green": 0.375,
    "dual_blue_gold": 0.2292,
    "dual_purple_green": 0.375,
    "dual_red_purple": 0.375,
    "dual_blue_green": 0.3125,
    "dual_green_gold": 0.2292,
    "dual_purple_gold": 0.125,
    "dual_red_blue": 0.4167,
    "dual_green_neutral": 0.2292,
    "dual_red_neutral": 0.1667,
    "dual_blue_neutral": 0.0833,
    "dual_purple_neutral": 0.3542,
    "dual_gold_neutral": 0.2083,
    "tri_red_blue_purple": 0.3542,
    "tri_red_green_gold": 0.1875,
    "tri_blue_purple_gold": 0.1667,
    "tri_red_purple_green": 0.0833,
    "tri_blue_green_gold": 0.3542,
    "tri_blue_purple_green": 0.375,
    "tri_red_purple_gold": 0.1667,
    "tri_purple_green_gold": 0.3333,
    "tri_red_blue_green": 0.375,
    "tri_red_blue_gold": 0.1458,
    "penta_prismatic_crater": 0.2917,
    "penta_free_city_sovereign": 0.375,
    "penta_wheel_convergence": 0.1667
  },
  "mono_red_dragon": {
    "mono_green_swarm": 0.375,
    "mono_green_colossus": 0.4583,
    "mono_green_roots": 0.6458,
    "mono_red_blitz": 0.3125,
    "mono_red_pyroclasm": 0.375,
    "mono_red_dragon": 0.5,
    "mono_blue_frost": 0.4375,
    "mono_blue_chrono": 0.5625,
    "mono_blue_abyssal": 0.4792,
    "mono_purple_crypt": 0.3958,
    "mono_purple_blood": 0.5417,
    "mono_purple_umbral": 0.4583,
    "mono_gold_phalanx": 0.6667,
    "mono_gold_celestial": 0.6458,
    "mono_gold_judgment": 0.4792,
    "mono_neutral_axial": 0.25,
    "dual_red_gold": 0.1875,
    "dual_blue_purple": 0.3958,
    "dual_red_green": 0.1667,
    "dual_blue_gold": 0.3333,
    "dual_purple_green": 0.4583,
    "dual_red_purple": 0.2708,
    "dual_blue_green": 0.25,
    "dual_green_gold": 0.3958,
    "dual_purple_gold": 0.4792,
    "dual_red_blue": 0.3958,
    "dual_green_neutral": 0.3333,
    "dual_red_neutral": 0.2083,
    "dual_blue_neutral": 0.3958,
    "dual_purple_neutral": 0.3333,
    "dual_gold_neutral": 0.2917,
    "tri_red_blue_purple": 0.3125,
    "tri_red_green_gold": 0.3125,
    "tri_blue_purple_gold": 0.2083,
    "tri_red_purple_green": 0.1042,
    "tri_blue_green_gold": 0.2917,
    "tri_blue_purple_green": 0.2917,
    "tri_red_purple_gold": 0.1667,
    "tri_purple_green_gold": 0.3958,
    "tri_red_blue_green": 0.2917,
    "tri_red_blue_gold": 0.2083,
    "penta_prismatic_crater": 0.4167,
    "penta_free_city_sovereign": 0.3333,
    "penta_wheel_convergence": 0.3542
  },
  "mono_blue_frost": {
    "mono_green_swarm": 0.6875,
    "mono_green_colossus": 0.5417,
    "mono_green_roots": 0.6875,
    "mono_red_blitz": 0.2708,
    "mono_red_pyroclasm": 0.4583,
    "mono_red_dragon": 0.5625,
    "mono_blue_frost": 0.5,
    "mono_blue_chrono": 0.2292,
    "mono_blue_abyssal": 0.6875,
    "mono_purple_crypt": 0.3333,
    "mono_purple_blood": 0.4792,
    "mono_purple_umbral": 0.4167,
    "mono_gold_phalanx": 0.625,
    "mono_gold_celestial": 0.625,
    "mono_gold_judgment": 0.5833,
    "mono_neutral_axial": 0.5208,
    "dual_red_gold": 0.3958,
    "dual_blue_purple": 0.4375,
    "dual_red_green": 0.3542,
    "dual_blue_gold": 0.5,
    "dual_purple_green": 0.375,
    "dual_red_purple": 0.3333,
    "dual_blue_green": 0.3958,
    "dual_green_gold": 0.4792,
    "dual_purple_gold": 0.4375,
    "dual_red_blue": 0.3125,
    "dual_green_neutral": 0.3125,
    "dual_red_neutral": 0.1458,
    "dual_blue_neutral": 0.3542,
    "dual_purple_neutral": 0.3125,
    "dual_gold_neutral": 0.375,
    "tri_red_blue_purple": 0.5833,
    "tri_red_green_gold": 0.5625,
    "tri_blue_purple_gold": 0.5,
    "tri_red_purple_green": 0.3542,
    "tri_blue_green_gold": 0.4375,
    "tri_blue_purple_green": 0.3333,
    "tri_red_purple_gold": 0.3542,
    "tri_purple_green_gold": 0.4583,
    "tri_red_blue_green": 0.375,
    "tri_red_blue_gold": 0.2708,
    "penta_prismatic_crater": 0.375,
    "penta_free_city_sovereign": 0.5417,
    "penta_wheel_convergence": 0.3542
  },
  "mono_blue_chrono": {
    "mono_green_swarm": 0.5208,
    "mono_green_colossus": 0.625,
    "mono_green_roots": 0.6667,
    "mono_red_blitz": 0.2708,
    "mono_red_pyroclasm": 0.5208,
    "mono_red_dragon": 0.4375,
    "mono_blue_frost": 0.7708,
    "mono_blue_chrono": 0.5,
    "mono_blue_abyssal": 0.8125,
    "mono_purple_crypt": 0.6667,
    "mono_purple_blood": 0.5208,
    "mono_purple_umbral": 0.3958,
    "mono_gold_phalanx": 0.6667,
    "mono_gold_celestial": 0.6875,
    "mono_gold_judgment": 0.7083,
    "mono_neutral_axial": 0.2292,
    "dual_red_gold": 0.25,
    "dual_blue_purple": 0.5833,
    "dual_red_green": 0.1458,
    "dual_blue_gold": 0.5,
    "dual_purple_green": 0.5208,
    "dual_red_purple": 0.1458,
    "dual_blue_green": 0.5833,
    "dual_green_gold": 0.4583,
    "dual_purple_gold": 0.5,
    "dual_red_blue": 0.375,
    "dual_green_neutral": 0.3125,
    "dual_red_neutral": 0.1042,
    "dual_blue_neutral": 0.5417,
    "dual_purple_neutral": 0.4375,
    "dual_gold_neutral": 0.5,
    "tri_red_blue_purple": 0.6042,
    "tri_red_green_gold": 0.375,
    "tri_blue_purple_gold": 0.5,
    "tri_red_purple_green": 0.2292,
    "tri_blue_green_gold": 0.5,
    "tri_blue_purple_green": 0.4375,
    "tri_red_purple_gold": 0.2708,
    "tri_purple_green_gold": 0.375,
    "tri_red_blue_green": 0.3958,
    "tri_red_blue_gold": 0.1875,
    "penta_prismatic_crater": 0.25,
    "penta_free_city_sovereign": 0.4583,
    "penta_wheel_convergence": 0.4583
  },
  "mono_blue_abyssal": {
    "mono_green_swarm": 0.5417,
    "mono_green_colossus": 0.4792,
    "mono_green_roots": 0.7083,
    "mono_red_blitz": 0.4167,
    "mono_red_pyroclasm": 0.6458,
    "mono_red_dragon": 0.5208,
    "mono_blue_frost": 0.3125,
    "mono_blue_chrono": 0.1875,
    "mono_blue_abyssal": 0.5,
    "mono_purple_crypt": 0.4583,
    "mono_purple_blood": 0.5625,
    "mono_purple_umbral": 0.375,
    "mono_gold_phalanx": 0.4167,
    "mono_gold_celestial": 0.4375,
    "mono_gold_judgment": 0.6042,
    "mono_neutral_axial": 0.5625,
    "dual_red_gold": 0.1667,
    "dual_blue_purple": 0.4375,
    "dual_red_green": 0.3125,
    "dual_blue_gold": 0.2708,
    "dual_purple_green": 0.4375,
    "dual_red_purple": 0.3333,
    "dual_blue_green": 0.2083,
    "dual_green_gold": 0.3542,
    "dual_purple_gold": 0.4583,
    "dual_red_blue": 0.4375,
    "dual_green_neutral": 0.2292,
    "dual_red_neutral": 0.2292,
    "dual_blue_neutral": 0.2708,
    "dual_purple_neutral": 0.3542,
    "dual_gold_neutral": 0.3333,
    "tri_red_blue_purple": 0.3333,
    "tri_red_green_gold": 0.2917,
    "tri_blue_purple_gold": 0.2708,
    "tri_red_purple_green": 0.2083,
    "tri_blue_green_gold": 0.3958,
    "tri_blue_purple_green": 0.3542,
    "tri_red_purple_gold": 0.1458,
    "tri_purple_green_gold": 0.2292,
    "tri_red_blue_green": 0.2708,
    "tri_red_blue_gold": 0.1042,
    "penta_prismatic_crater": 0.1458,
    "penta_free_city_sovereign": 0.25,
    "penta_wheel_convergence": 0.25
  },
  "mono_purple_crypt": {
    "mono_green_swarm": 0.5625,
    "mono_green_colossus": 0.3125,
    "mono_green_roots": 0.5208,
    "mono_red_blitz": 0.4583,
    "mono_red_pyroclasm": 0.6042,
    "mono_red_dragon": 0.6042,
    "mono_blue_frost": 0.6667,
    "mono_blue_chrono": 0.3333,
    "mono_blue_abyssal": 0.5417,
    "mono_purple_crypt": 0.5,
    "mono_purple_blood": 0.6042,
    "mono_purple_umbral": 0.3542,
    "mono_gold_phalanx": 0.3542,
    "mono_gold_celestial": 0.4167,
    "mono_gold_judgment": 0.4583,
    "mono_neutral_axial": 0.4583,
    "dual_red_gold": 0.25,
    "dual_blue_purple": 0.4167,
    "dual_red_green": 0.2917,
    "dual_blue_gold": 0.3333,
    "dual_purple_green": 0.4167,
    "dual_red_purple": 0.3958,
    "dual_blue_green": 0.25,
    "dual_green_gold": 0.375,
    "dual_purple_gold": 0.1667,
    "dual_red_blue": 0.3542,
    "dual_green_neutral": 0.2292,
    "dual_red_neutral": 0.2292,
    "dual_blue_neutral": 0.2292,
    "dual_purple_neutral": 0.3958,
    "dual_gold_neutral": 0.2917,
    "tri_red_blue_purple": 0.4375,
    "tri_red_green_gold": 0.375,
    "tri_blue_purple_gold": 0.375,
    "tri_red_purple_green": 0.2292,
    "tri_blue_green_gold": 0.2708,
    "tri_blue_purple_green": 0.4167,
    "tri_red_purple_gold": 0.3125,
    "tri_purple_green_gold": 0.25,
    "tri_red_blue_green": 0.3333,
    "tri_red_blue_gold": 0.1667,
    "penta_prismatic_crater": 0.2292,
    "penta_free_city_sovereign": 0.2292,
    "penta_wheel_convergence": 0.3958
  },
  "mono_purple_blood": {
    "mono_green_swarm": 0.375,
    "mono_green_colossus": 0.3125,
    "mono_green_roots": 0.4583,
    "mono_red_blitz": 0.2708,
    "mono_red_pyroclasm": 0.3542,
    "mono_red_dragon": 0.4583,
    "mono_blue_frost": 0.5208,
    "mono_blue_chrono": 0.4792,
    "mono_blue_abyssal": 0.4375,
    "mono_purple_crypt": 0.3958,
    "mono_purple_blood": 0.5,
    "mono_purple_umbral": 0.3958,
    "mono_gold_phalanx": 0.2292,
    "mono_gold_celestial": 0.2083,
    "mono_gold_judgment": 0.3542,
    "mono_neutral_axial": 0.2708,
    "dual_red_gold": 0.1667,
    "dual_blue_purple": 0.3542,
    "dual_red_green": 0.2292,
    "dual_blue_gold": 0.1875,
    "dual_purple_green": 0.125,
    "dual_red_purple": 0.2083,
    "dual_blue_green": 0.3125,
    "dual_green_gold": 0.2292,
    "dual_purple_gold": 0.0625,
    "dual_red_blue": 0.3542,
    "dual_green_neutral": 0.2292,
    "dual_red_neutral": 0,
    "dual_blue_neutral": 0.1875,
    "dual_purple_neutral": 0.3333,
    "dual_gold_neutral": 0.1667,
    "tri_red_blue_purple": 0.3542,
    "tri_red_green_gold": 0.125,
    "tri_blue_purple_gold": 0.4167,
    "tri_red_purple_green": 0.2083,
    "tri_blue_green_gold": 0.25,
    "tri_blue_purple_green": 0.375,
    "tri_red_purple_gold": 0.0833,
    "tri_purple_green_gold": 0.1667,
    "tri_red_blue_green": 0.3333,
    "tri_red_blue_gold": 0.0625,
    "penta_prismatic_crater": 0.2083,
    "penta_free_city_sovereign": 0.2708,
    "penta_wheel_convergence": 0.1875
  },
  "mono_purple_umbral": {
    "mono_green_swarm": 0.4583,
    "mono_green_colossus": 0.3333,
    "mono_green_roots": 0.625,
    "mono_red_blitz": 0.4167,
    "mono_red_pyroclasm": 0.5625,
    "mono_red_dragon": 0.5417,
    "mono_blue_frost": 0.5833,
    "mono_blue_chrono": 0.6042,
    "mono_blue_abyssal": 0.625,
    "mono_purple_crypt": 0.6458,
    "mono_purple_blood": 0.6042,
    "mono_purple_umbral": 0.5,
    "mono_gold_phalanx": 0.4167,
    "mono_gold_celestial": 0.5625,
    "mono_gold_judgment": 0.6042,
    "mono_neutral_axial": 0.3333,
    "dual_red_gold": 0.1875,
    "dual_blue_purple": 0.5625,
    "dual_red_green": 0.2917,
    "dual_blue_gold": 0.3958,
    "dual_purple_green": 0.2917,
    "dual_red_purple": 0.3333,
    "dual_blue_green": 0.25,
    "dual_green_gold": 0.375,
    "dual_purple_gold": 0.2917,
    "dual_red_blue": 0.4167,
    "dual_green_neutral": 0.2083,
    "dual_red_neutral": 0.1667,
    "dual_blue_neutral": 0.4583,
    "dual_purple_neutral": 0.2292,
    "dual_gold_neutral": 0.3958,
    "tri_red_blue_purple": 0.5208,
    "tri_red_green_gold": 0.4167,
    "tri_blue_purple_gold": 0.3542,
    "tri_red_purple_green": 0.3333,
    "tri_blue_green_gold": 0.375,
    "tri_blue_purple_green": 0.375,
    "tri_red_purple_gold": 0.3125,
    "tri_purple_green_gold": 0.3542,
    "tri_red_blue_green": 0.4375,
    "tri_red_blue_gold": 0.2083,
    "penta_prismatic_crater": 0.2292,
    "penta_free_city_sovereign": 0.2917,
    "penta_wheel_convergence": 0.25
  },
  "mono_gold_phalanx": {
    "mono_green_swarm": 0.625,
    "mono_green_colossus": 0.6042,
    "mono_green_roots": 0.6458,
    "mono_red_blitz": 0.5,
    "mono_red_pyroclasm": 0.6458,
    "mono_red_dragon": 0.3333,
    "mono_blue_frost": 0.375,
    "mono_blue_chrono": 0.3333,
    "mono_blue_abyssal": 0.5833,
    "mono_purple_crypt": 0.6458,
    "mono_purple_blood": 0.7708,
    "mono_purple_umbral": 0.5833,
    "mono_gold_phalanx": 0.5,
    "mono_gold_celestial": 0.4583,
    "mono_gold_judgment": 0.5833,
    "mono_neutral_axial": 0.625,
    "dual_red_gold": 0.3542,
    "dual_blue_purple": 0.2708,
    "dual_red_green": 0.25,
    "dual_blue_gold": 0.3333,
    "dual_purple_green": 0.3542,
    "dual_red_purple": 0.5833,
    "dual_blue_green": 0.2083,
    "dual_green_gold": 0.2708,
    "dual_purple_gold": 0.3958,
    "dual_red_blue": 0.2083,
    "dual_green_neutral": 0.2917,
    "dual_red_neutral": 0.2292,
    "dual_blue_neutral": 0.3958,
    "dual_purple_neutral": 0.5833,
    "dual_gold_neutral": 0.2708,
    "tri_red_blue_purple": 0.3333,
    "tri_red_green_gold": 0.2917,
    "tri_blue_purple_gold": 0.3542,
    "tri_red_purple_green": 0.3333,
    "tri_blue_green_gold": 0.2292,
    "tri_blue_purple_green": 0.3958,
    "tri_red_purple_gold": 0.3125,
    "tri_purple_green_gold": 0.1458,
    "tri_red_blue_green": 0.2708,
    "tri_red_blue_gold": 0.1875,
    "penta_prismatic_crater": 0.4167,
    "penta_free_city_sovereign": 0.2292,
    "penta_wheel_convergence": 0.2917
  },
  "mono_gold_celestial": {
    "mono_green_swarm": 0.5417,
    "mono_green_colossus": 0.6458,
    "mono_green_roots": 0.6458,
    "mono_red_blitz": 0.5625,
    "mono_red_pyroclasm": 0.6667,
    "mono_red_dragon": 0.3542,
    "mono_blue_frost": 0.375,
    "mono_blue_chrono": 0.3125,
    "mono_blue_abyssal": 0.5625,
    "mono_purple_crypt": 0.5833,
    "mono_purple_blood": 0.7917,
    "mono_purple_umbral": 0.4375,
    "mono_gold_phalanx": 0.5417,
    "mono_gold_celestial": 0.5,
    "mono_gold_judgment": 0.5833,
    "mono_neutral_axial": 0.5625,
    "dual_red_gold": 0.2083,
    "dual_blue_purple": 0.4375,
    "dual_red_green": 0.25,
    "dual_blue_gold": 0.3542,
    "dual_purple_green": 0.5417,
    "dual_red_purple": 0.4583,
    "dual_blue_green": 0.1875,
    "dual_green_gold": 0.3542,
    "dual_purple_gold": 0.4375,
    "dual_red_blue": 0.3542,
    "dual_green_neutral": 0.3125,
    "dual_red_neutral": 0.2292,
    "dual_blue_neutral": 0.4167,
    "dual_purple_neutral": 0.5,
    "dual_gold_neutral": 0.2292,
    "tri_red_blue_purple": 0.4375,
    "tri_red_green_gold": 0.25,
    "tri_blue_purple_gold": 0.2292,
    "tri_red_purple_green": 0.25,
    "tri_blue_green_gold": 0.25,
    "tri_blue_purple_green": 0.375,
    "tri_red_purple_gold": 0.3542,
    "tri_purple_green_gold": 0.2708,
    "tri_red_blue_green": 0.3958,
    "tri_red_blue_gold": 0.1875,
    "penta_prismatic_crater": 0.2917,
    "penta_free_city_sovereign": 0.3542,
    "penta_wheel_convergence": 0.3333
  },
  "mono_gold_judgment": {
    "mono_green_swarm": 0.6042,
    "mono_green_colossus": 0.4167,
    "mono_green_roots": 0.6458,
    "mono_red_blitz": 0.6042,
    "mono_red_pyroclasm": 0.7083,
    "mono_red_dragon": 0.5208,
    "mono_blue_frost": 0.4167,
    "mono_blue_chrono": 0.2917,
    "mono_blue_abyssal": 0.3958,
    "mono_purple_crypt": 0.5417,
    "mono_purple_blood": 0.6458,
    "mono_purple_umbral": 0.3958,
    "mono_gold_phalanx": 0.4167,
    "mono_gold_celestial": 0.4167,
    "mono_gold_judgment": 0.5,
    "mono_neutral_axial": 0.4375,
    "dual_red_gold": 0.2917,
    "dual_blue_purple": 0.3125,
    "dual_red_green": 0.3125,
    "dual_blue_gold": 0.2708,
    "dual_purple_green": 0.2708,
    "dual_red_purple": 0.4583,
    "dual_blue_green": 0.2083,
    "dual_green_gold": 0.3333,
    "dual_purple_gold": 0.3542,
    "dual_red_blue": 0.3333,
    "dual_green_neutral": 0.1875,
    "dual_red_neutral": 0.2292,
    "dual_blue_neutral": 0.3125,
    "dual_purple_neutral": 0.4375,
    "dual_gold_neutral": 0.2292,
    "tri_red_blue_purple": 0.375,
    "tri_red_green_gold": 0.2917,
    "tri_blue_purple_gold": 0.2708,
    "tri_red_purple_green": 0.3125,
    "tri_blue_green_gold": 0.25,
    "tri_blue_purple_green": 0.2917,
    "tri_red_purple_gold": 0.1875,
    "tri_purple_green_gold": 0.25,
    "tri_red_blue_green": 0.2292,
    "tri_red_blue_gold": 0.0833,
    "penta_prismatic_crater": 0.2292,
    "penta_free_city_sovereign": 0.3125,
    "penta_wheel_convergence": 0.1875
  },
  "mono_neutral_axial": {
    "mono_green_swarm": 0.5833,
    "mono_green_colossus": 0.625,
    "mono_green_roots": 0.5625,
    "mono_red_blitz": 0.5,
    "mono_red_pyroclasm": 0.6458,
    "mono_red_dragon": 0.75,
    "mono_blue_frost": 0.4792,
    "mono_blue_chrono": 0.7708,
    "mono_blue_abyssal": 0.4375,
    "mono_purple_crypt": 0.5417,
    "mono_purple_blood": 0.7292,
    "mono_purple_umbral": 0.6667,
    "mono_gold_phalanx": 0.375,
    "mono_gold_celestial": 0.4375,
    "mono_gold_judgment": 0.5625,
    "mono_neutral_axial": 0.5,
    "dual_red_gold": 0.1667,
    "dual_blue_purple": 0.4583,
    "dual_red_green": 0.3542,
    "dual_blue_gold": 0.3333,
    "dual_purple_green": 0.375,
    "dual_red_purple": 0.4583,
    "dual_blue_green": 0.375,
    "dual_green_gold": 0.3542,
    "dual_purple_gold": 0.2083,
    "dual_red_blue": 0.5625,
    "dual_green_neutral": 0.125,
    "dual_red_neutral": 0.1667,
    "dual_blue_neutral": 0.4583,
    "dual_purple_neutral": 0.5208,
    "dual_gold_neutral": 0.3958,
    "tri_red_blue_purple": 0.4375,
    "tri_red_green_gold": 0.2917,
    "tri_blue_purple_gold": 0.375,
    "tri_red_purple_green": 0.1875,
    "tri_blue_green_gold": 0.3125,
    "tri_blue_purple_green": 0.25,
    "tri_red_purple_gold": 0.2708,
    "tri_purple_green_gold": 0.2708,
    "tri_red_blue_green": 0.4583,
    "tri_red_blue_gold": 0.2083,
    "penta_prismatic_crater": 0.3542,
    "penta_free_city_sovereign": 0.2708,
    "penta_wheel_convergence": 0.2083
  },
  "dual_red_gold": {
    "mono_green_swarm": 0.7292,
    "mono_green_colossus": 0.8125,
    "mono_green_roots": 0.6875,
    "mono_red_blitz": 0.5833,
    "mono_red_pyroclasm": 0.7917,
    "mono_red_dragon": 0.8125,
    "mono_blue_frost": 0.6042,
    "mono_blue_chrono": 0.75,
    "mono_blue_abyssal": 0.8333,
    "mono_purple_crypt": 0.75,
    "mono_purple_blood": 0.8333,
    "mono_purple_umbral": 0.8125,
    "mono_gold_phalanx": 0.6458,
    "mono_gold_celestial": 0.7917,
    "mono_gold_judgment": 0.7083,
    "mono_neutral_axial": 0.8333,
    "dual_red_gold": 0.5,
    "dual_blue_purple": 0.6458,
    "dual_red_green": 0.4583,
    "dual_blue_gold": 0.5833,
    "dual_purple_green": 0.5417,
    "dual_red_purple": 0.5833,
    "dual_blue_green": 0.5833,
    "dual_green_gold": 0.625,
    "dual_purple_gold": 0.5,
    "dual_red_blue": 0.5625,
    "dual_green_neutral": 0.3542,
    "dual_red_neutral": 0.4792,
    "dual_blue_neutral": 0.5833,
    "dual_purple_neutral": 0.75,
    "dual_gold_neutral": 0.625,
    "tri_red_blue_purple": 0.5417,
    "tri_red_green_gold": 0.6458,
    "tri_blue_purple_gold": 0.4583,
    "tri_red_purple_green": 0.4792,
    "tri_blue_green_gold": 0.7292,
    "tri_blue_purple_green": 0.5625,
    "tri_red_purple_gold": 0.4375,
    "tri_purple_green_gold": 0.4167,
    "tri_red_blue_green": 0.5417,
    "tri_red_blue_gold": 0.5417,
    "penta_prismatic_crater": 0.6042,
    "penta_free_city_sovereign": 0.5417,
    "penta_wheel_convergence": 0.6667
  },
  "dual_blue_purple": {
    "mono_green_swarm": 0.7083,
    "mono_green_colossus": 0.6875,
    "mono_green_roots": 0.75,
    "mono_red_blitz": 0.5,
    "mono_red_pyroclasm": 0.7083,
    "mono_red_dragon": 0.6042,
    "mono_blue_frost": 0.5625,
    "mono_blue_chrono": 0.4167,
    "mono_blue_abyssal": 0.5625,
    "mono_purple_crypt": 0.5833,
    "mono_purple_blood": 0.6458,
    "mono_purple_umbral": 0.4375,
    "mono_gold_phalanx": 0.7292,
    "mono_gold_celestial": 0.5625,
    "mono_gold_judgment": 0.6875,
    "mono_neutral_axial": 0.5417,
    "dual_red_gold": 0.3542,
    "dual_blue_purple": 0.5,
    "dual_red_green": 0.5208,
    "dual_blue_gold": 0.5625,
    "dual_purple_green": 0.5417,
    "dual_red_purple": 0.3125,
    "dual_blue_green": 0.5417,
    "dual_green_gold": 0.5625,
    "dual_purple_gold": 0.6042,
    "dual_red_blue": 0.4792,
    "dual_green_neutral": 0.4375,
    "dual_red_neutral": 0.1875,
    "dual_blue_neutral": 0.3333,
    "dual_purple_neutral": 0.3333,
    "dual_gold_neutral": 0.5208,
    "tri_red_blue_purple": 0.4375,
    "tri_red_green_gold": 0.5417,
    "tri_blue_purple_gold": 0.5,
    "tri_red_purple_green": 0.1667,
    "tri_blue_green_gold": 0.4167,
    "tri_blue_purple_green": 0.4375,
    "tri_red_purple_gold": 0.3958,
    "tri_purple_green_gold": 0.3958,
    "tri_red_blue_green": 0.4583,
    "tri_red_blue_gold": 0.3542,
    "penta_prismatic_crater": 0.5417,
    "penta_free_city_sovereign": 0.5,
    "penta_wheel_convergence": 0.3958
  },
  "dual_red_green": {
    "mono_green_swarm": 0.6458,
    "mono_green_colossus": 0.7083,
    "mono_green_roots": 0.6875,
    "mono_red_blitz": 0.5417,
    "mono_red_pyroclasm": 0.625,
    "mono_red_dragon": 0.8333,
    "mono_blue_frost": 0.6458,
    "mono_blue_chrono": 0.8542,
    "mono_blue_abyssal": 0.6875,
    "mono_purple_crypt": 0.7083,
    "mono_purple_blood": 0.7708,
    "mono_purple_umbral": 0.7083,
    "mono_gold_phalanx": 0.75,
    "mono_gold_celestial": 0.75,
    "mono_gold_judgment": 0.6875,
    "mono_neutral_axial": 0.6458,
    "dual_red_gold": 0.5417,
    "dual_blue_purple": 0.4792,
    "dual_red_green": 0.5,
    "dual_blue_gold": 0.4375,
    "dual_purple_green": 0.5625,
    "dual_red_purple": 0.6875,
    "dual_blue_green": 0.5625,
    "dual_green_gold": 0.6667,
    "dual_purple_gold": 0.5625,
    "dual_red_blue": 0.6667,
    "dual_green_neutral": 0.5208,
    "dual_red_neutral": 0.3542,
    "dual_blue_neutral": 0.5417,
    "dual_purple_neutral": 0.6667,
    "dual_gold_neutral": 0.625,
    "tri_red_blue_purple": 0.3542,
    "tri_red_green_gold": 0.4792,
    "tri_blue_purple_gold": 0.6042,
    "tri_red_purple_green": 0.4375,
    "tri_blue_green_gold": 0.5833,
    "tri_blue_purple_green": 0.6667,
    "tri_red_purple_gold": 0.5625,
    "tri_purple_green_gold": 0.5625,
    "tri_red_blue_green": 0.3958,
    "tri_red_blue_gold": 0.3333,
    "penta_prismatic_crater": 0.5625,
    "penta_free_city_sovereign": 0.5417,
    "penta_wheel_convergence": 0.5833
  },
  "dual_blue_gold": {
    "mono_green_swarm": 0.7292,
    "mono_green_colossus": 0.8333,
    "mono_green_roots": 0.875,
    "mono_red_blitz": 0.8125,
    "mono_red_pyroclasm": 0.7708,
    "mono_red_dragon": 0.6667,
    "mono_blue_frost": 0.5,
    "mono_blue_chrono": 0.5,
    "mono_blue_abyssal": 0.7292,
    "mono_purple_crypt": 0.6667,
    "mono_purple_blood": 0.8125,
    "mono_purple_umbral": 0.6042,
    "mono_gold_phalanx": 0.6667,
    "mono_gold_celestial": 0.6458,
    "mono_gold_judgment": 0.7292,
    "mono_neutral_axial": 0.6667,
    "dual_red_gold": 0.4167,
    "dual_blue_purple": 0.4375,
    "dual_red_green": 0.5625,
    "dual_blue_gold": 0.5,
    "dual_purple_green": 0.5417,
    "dual_red_purple": 0.7917,
    "dual_blue_green": 0.3333,
    "dual_green_gold": 0.5625,
    "dual_purple_gold": 0.6042,
    "dual_red_blue": 0.5833,
    "dual_green_neutral": 0.2708,
    "dual_red_neutral": 0.3958,
    "dual_blue_neutral": 0.3125,
    "dual_purple_neutral": 0.6875,
    "dual_gold_neutral": 0.5625,
    "tri_red_blue_purple": 0.4792,
    "tri_red_green_gold": 0.5625,
    "tri_blue_purple_gold": 0.625,
    "tri_red_purple_green": 0.3958,
    "tri_blue_green_gold": 0.5208,
    "tri_blue_purple_green": 0.6458,
    "tri_red_purple_gold": 0.3333,
    "tri_purple_green_gold": 0.5833,
    "tri_red_blue_green": 0.3333,
    "tri_red_blue_gold": 0.25,
    "penta_prismatic_crater": 0.4167,
    "penta_free_city_sovereign": 0.4167,
    "penta_wheel_convergence": 0.5
  },
  "dual_purple_green": {
    "mono_green_swarm": 0.6458,
    "mono_green_colossus": 0.6042,
    "mono_green_roots": 0.8125,
    "mono_red_blitz": 0.6875,
    "mono_red_pyroclasm": 0.625,
    "mono_red_dragon": 0.5417,
    "mono_blue_frost": 0.625,
    "mono_blue_chrono": 0.4792,
    "mono_blue_abyssal": 0.5625,
    "mono_purple_crypt": 0.5833,
    "mono_purple_blood": 0.875,
    "mono_purple_umbral": 0.7083,
    "mono_gold_phalanx": 0.6458,
    "mono_gold_celestial": 0.4583,
    "mono_gold_judgment": 0.7292,
    "mono_neutral_axial": 0.625,
    "dual_red_gold": 0.4583,
    "dual_blue_purple": 0.4583,
    "dual_red_green": 0.4375,
    "dual_blue_gold": 0.4583,
    "dual_purple_green": 0.5,
    "dual_red_purple": 0.625,
    "dual_blue_green": 0.375,
    "dual_green_gold": 0.5,
    "dual_purple_gold": 0.4792,
    "dual_red_blue": 0.4583,
    "dual_green_neutral": 0.2917,
    "dual_red_neutral": 0.3333,
    "dual_blue_neutral": 0.4792,
    "dual_purple_neutral": 0.5625,
    "dual_gold_neutral": 0.3542,
    "tri_red_blue_purple": 0.4375,
    "tri_red_green_gold": 0.5208,
    "tri_blue_purple_gold": 0.4583,
    "tri_red_purple_green": 0.25,
    "tri_blue_green_gold": 0.3958,
    "tri_blue_purple_green": 0.5208,
    "tri_red_purple_gold": 0.3958,
    "tri_purple_green_gold": 0.5208,
    "tri_red_blue_green": 0.4583,
    "tri_red_blue_gold": 0.2083,
    "penta_prismatic_crater": 0.375,
    "penta_free_city_sovereign": 0.2708,
    "penta_wheel_convergence": 0.4792
  },
  "dual_red_purple": {
    "mono_green_swarm": 0.5417,
    "mono_green_colossus": 0.5417,
    "mono_green_roots": 0.5208,
    "mono_red_blitz": 0.7083,
    "mono_red_pyroclasm": 0.625,
    "mono_red_dragon": 0.7292,
    "mono_blue_frost": 0.6667,
    "mono_blue_chrono": 0.8542,
    "mono_blue_abyssal": 0.6667,
    "mono_purple_crypt": 0.6042,
    "mono_purple_blood": 0.7917,
    "mono_purple_umbral": 0.6667,
    "mono_gold_phalanx": 0.4167,
    "mono_gold_celestial": 0.5417,
    "mono_gold_judgment": 0.5417,
    "mono_neutral_axial": 0.5417,
    "dual_red_gold": 0.4167,
    "dual_blue_purple": 0.6875,
    "dual_red_green": 0.3125,
    "dual_blue_gold": 0.2083,
    "dual_purple_green": 0.375,
    "dual_red_purple": 0.5,
    "dual_blue_green": 0.5417,
    "dual_green_gold": 0.4375,
    "dual_purple_gold": 0.3333,
    "dual_red_blue": 0.6042,
    "dual_green_neutral": 0.3125,
    "dual_red_neutral": 0.3542,
    "dual_blue_neutral": 0.4583,
    "dual_purple_neutral": 0.5625,
    "dual_gold_neutral": 0.375,
    "tri_red_blue_purple": 0.5833,
    "tri_red_green_gold": 0.4167,
    "tri_blue_purple_gold": 0.4792,
    "tri_red_purple_green": 0.3333,
    "tri_blue_green_gold": 0.4375,
    "tri_blue_purple_green": 0.5,
    "tri_red_purple_gold": 0.25,
    "tri_purple_green_gold": 0.3125,
    "tri_red_blue_green": 0.5625,
    "tri_red_blue_gold": 0.2292,
    "penta_prismatic_crater": 0.4375,
    "penta_free_city_sovereign": 0.4167,
    "penta_wheel_convergence": 0.4375
  },
  "dual_blue_green": {
    "mono_green_swarm": 0.7917,
    "mono_green_colossus": 0.7708,
    "mono_green_roots": 0.8542,
    "mono_red_blitz": 0.3958,
    "mono_red_pyroclasm": 0.6875,
    "mono_red_dragon": 0.75,
    "mono_blue_frost": 0.6042,
    "mono_blue_chrono": 0.4167,
    "mono_blue_abyssal": 0.7917,
    "mono_purple_crypt": 0.75,
    "mono_purple_blood": 0.6875,
    "mono_purple_umbral": 0.75,
    "mono_gold_phalanx": 0.7917,
    "mono_gold_celestial": 0.8125,
    "mono_gold_judgment": 0.7917,
    "mono_neutral_axial": 0.625,
    "dual_red_gold": 0.4167,
    "dual_blue_purple": 0.4583,
    "dual_red_green": 0.4375,
    "dual_blue_gold": 0.6667,
    "dual_purple_green": 0.625,
    "dual_red_purple": 0.4583,
    "dual_blue_green": 0.5,
    "dual_green_gold": 0.5625,
    "dual_purple_gold": 0.4792,
    "dual_red_blue": 0.4792,
    "dual_green_neutral": 0.4583,
    "dual_red_neutral": 0.25,
    "dual_blue_neutral": 0.4583,
    "dual_purple_neutral": 0.5,
    "dual_gold_neutral": 0.625,
    "tri_red_blue_purple": 0.5,
    "tri_red_green_gold": 0.5,
    "tri_blue_purple_gold": 0.625,
    "tri_red_purple_green": 0.2708,
    "tri_blue_green_gold": 0.5208,
    "tri_blue_purple_green": 0.5833,
    "tri_red_purple_gold": 0.2917,
    "tri_purple_green_gold": 0.6042,
    "tri_red_blue_green": 0.4375,
    "tri_red_blue_gold": 0.2917,
    "penta_prismatic_crater": 0.3958,
    "penta_free_city_sovereign": 0.5417,
    "penta_wheel_convergence": 0.5833
  },
  "dual_green_gold": {
    "mono_green_swarm": 0.6667,
    "mono_green_colossus": 0.6042,
    "mono_green_roots": 0.6667,
    "mono_red_blitz": 0.6667,
    "mono_red_pyroclasm": 0.7708,
    "mono_red_dragon": 0.6042,
    "mono_blue_frost": 0.5208,
    "mono_blue_chrono": 0.5417,
    "mono_blue_abyssal": 0.6458,
    "mono_purple_crypt": 0.625,
    "mono_purple_blood": 0.7708,
    "mono_purple_umbral": 0.625,
    "mono_gold_phalanx": 0.7292,
    "mono_gold_celestial": 0.6458,
    "mono_gold_judgment": 0.6667,
    "mono_neutral_axial": 0.6458,
    "dual_red_gold": 0.375,
    "dual_blue_purple": 0.4375,
    "dual_red_green": 0.3333,
    "dual_blue_gold": 0.4375,
    "dual_purple_green": 0.5,
    "dual_red_purple": 0.5625,
    "dual_blue_green": 0.4375,
    "dual_green_gold": 0.5,
    "dual_purple_gold": 0.375,
    "dual_red_blue": 0.6042,
    "dual_green_neutral": 0.3958,
    "dual_red_neutral": 0.2083,
    "dual_blue_neutral": 0.3958,
    "dual_purple_neutral": 0.625,
    "dual_gold_neutral": 0.3958,
    "tri_red_blue_purple": 0.3958,
    "tri_red_green_gold": 0.2708,
    "tri_blue_purple_gold": 0.4583,
    "tri_red_purple_green": 0.2917,
    "tri_blue_green_gold": 0.3958,
    "tri_blue_purple_green": 0.5417,
    "tri_red_purple_gold": 0.3333,
    "tri_purple_green_gold": 0.4583,
    "tri_red_blue_green": 0.3958,
    "tri_red_blue_gold": 0.375,
    "penta_prismatic_crater": 0.4375,
    "penta_free_city_sovereign": 0.4375,
    "penta_wheel_convergence": 0.3958
  },
  "dual_purple_gold": {
    "mono_green_swarm": 0.6875,
    "mono_green_colossus": 0.75,
    "mono_green_roots": 0.7917,
    "mono_red_blitz": 0.6875,
    "mono_red_pyroclasm": 0.875,
    "mono_red_dragon": 0.5208,
    "mono_blue_frost": 0.5625,
    "mono_blue_chrono": 0.5,
    "mono_blue_abyssal": 0.5417,
    "mono_purple_crypt": 0.8333,
    "mono_purple_blood": 0.9375,
    "mono_purple_umbral": 0.7083,
    "mono_gold_phalanx": 0.6042,
    "mono_gold_celestial": 0.5625,
    "mono_gold_judgment": 0.6458,
    "mono_neutral_axial": 0.7917,
    "dual_red_gold": 0.5,
    "dual_blue_purple": 0.3958,
    "dual_red_green": 0.4375,
    "dual_blue_gold": 0.3958,
    "dual_purple_green": 0.5208,
    "dual_red_purple": 0.6667,
    "dual_blue_green": 0.5208,
    "dual_green_gold": 0.625,
    "dual_purple_gold": 0.5,
    "dual_red_blue": 0.5208,
    "dual_green_neutral": 0.4375,
    "dual_red_neutral": 0.375,
    "dual_blue_neutral": 0.4792,
    "dual_purple_neutral": 0.625,
    "dual_gold_neutral": 0.3542,
    "tri_red_blue_purple": 0.5833,
    "tri_red_green_gold": 0.4167,
    "tri_blue_purple_gold": 0.6458,
    "tri_red_purple_green": 0.3958,
    "tri_blue_green_gold": 0.3333,
    "tri_blue_purple_green": 0.5417,
    "tri_red_purple_gold": 0.4792,
    "tri_purple_green_gold": 0.4792,
    "tri_red_blue_green": 0.3542,
    "tri_red_blue_gold": 0.2292,
    "penta_prismatic_crater": 0.4375,
    "penta_free_city_sovereign": 0.4375,
    "penta_wheel_convergence": 0.3958
  },
  "dual_red_blue": {
    "mono_green_swarm": 0.4375,
    "mono_green_colossus": 0.6875,
    "mono_green_roots": 0.7292,
    "mono_red_blitz": 0.375,
    "mono_red_pyroclasm": 0.5833,
    "mono_red_dragon": 0.6042,
    "mono_blue_frost": 0.6875,
    "mono_blue_chrono": 0.625,
    "mono_blue_abyssal": 0.5625,
    "mono_purple_crypt": 0.6458,
    "mono_purple_blood": 0.6458,
    "mono_purple_umbral": 0.5833,
    "mono_gold_phalanx": 0.7917,
    "mono_gold_celestial": 0.6458,
    "mono_gold_judgment": 0.6667,
    "mono_neutral_axial": 0.4375,
    "dual_red_gold": 0.4375,
    "dual_blue_purple": 0.5208,
    "dual_red_green": 0.3333,
    "dual_blue_gold": 0.4167,
    "dual_purple_green": 0.5417,
    "dual_red_purple": 0.3958,
    "dual_blue_green": 0.5208,
    "dual_green_gold": 0.3958,
    "dual_purple_gold": 0.4792,
    "dual_red_blue": 0.5,
    "dual_green_neutral": 0.5417,
    "dual_red_neutral": 0.3542,
    "dual_blue_neutral": 0.4792,
    "dual_purple_neutral": 0.5833,
    "dual_gold_neutral": 0.4583,
    "tri_red_blue_purple": 0.5417,
    "tri_red_green_gold": 0.5,
    "tri_blue_purple_gold": 0.4792,
    "tri_red_purple_green": 0.2708,
    "tri_blue_green_gold": 0.4583,
    "tri_blue_purple_green": 0.5625,
    "tri_red_purple_gold": 0.3958,
    "tri_purple_green_gold": 0.5833,
    "tri_red_blue_green": 0.4375,
    "tri_red_blue_gold": 0.3125,
    "penta_prismatic_crater": 0.4167,
    "penta_free_city_sovereign": 0.4583,
    "penta_wheel_convergence": 0.625
  },
  "dual_green_neutral": {
    "mono_green_swarm": 0.7708,
    "mono_green_colossus": 0.7292,
    "mono_green_roots": 0.8125,
    "mono_red_blitz": 0.6875,
    "mono_red_pyroclasm": 0.7708,
    "mono_red_dragon": 0.6667,
    "mono_blue_frost": 0.6875,
    "mono_blue_chrono": 0.6875,
    "mono_blue_abyssal": 0.7708,
    "mono_purple_crypt": 0.7708,
    "mono_purple_blood": 0.7708,
    "mono_purple_umbral": 0.7917,
    "mono_gold_phalanx": 0.7083,
    "mono_gold_celestial": 0.6875,
    "mono_gold_judgment": 0.8125,
    "mono_neutral_axial": 0.875,
    "dual_red_gold": 0.6458,
    "dual_blue_purple": 0.5625,
    "dual_red_green": 0.4792,
    "dual_blue_gold": 0.7292,
    "dual_purple_green": 0.7083,
    "dual_red_purple": 0.6875,
    "dual_blue_green": 0.5417,
    "dual_green_gold": 0.6042,
    "dual_purple_gold": 0.5625,
    "dual_red_blue": 0.4583,
    "dual_green_neutral": 0.5,
    "dual_red_neutral": 0.3542,
    "dual_blue_neutral": 0.5208,
    "dual_purple_neutral": 0.7292,
    "dual_gold_neutral": 0.5,
    "tri_red_blue_purple": 0.625,
    "tri_red_green_gold": 0.5417,
    "tri_blue_purple_gold": 0.6458,
    "tri_red_purple_green": 0.3333,
    "tri_blue_green_gold": 0.6042,
    "tri_blue_purple_green": 0.7083,
    "tri_red_purple_gold": 0.3958,
    "tri_purple_green_gold": 0.4167,
    "tri_red_blue_green": 0.4792,
    "tri_red_blue_gold": 0.5208,
    "penta_prismatic_crater": 0.5625,
    "penta_free_city_sovereign": 0.5417,
    "penta_wheel_convergence": 0.6458
  },
  "dual_red_neutral": {
    "mono_green_swarm": 0.7917,
    "mono_green_colossus": 0.8542,
    "mono_green_roots": 0.875,
    "mono_red_blitz": 0.7917,
    "mono_red_pyroclasm": 0.8333,
    "mono_red_dragon": 0.7917,
    "mono_blue_frost": 0.8542,
    "mono_blue_chrono": 0.8958,
    "mono_blue_abyssal": 0.7708,
    "mono_purple_crypt": 0.7708,
    "mono_purple_blood": 1,
    "mono_purple_umbral": 0.8333,
    "mono_gold_phalanx": 0.7708,
    "mono_gold_celestial": 0.7708,
    "mono_gold_judgment": 0.7708,
    "mono_neutral_axial": 0.8333,
    "dual_red_gold": 0.5208,
    "dual_blue_purple": 0.8125,
    "dual_red_green": 0.6458,
    "dual_blue_gold": 0.6042,
    "dual_purple_green": 0.6667,
    "dual_red_purple": 0.6458,
    "dual_blue_green": 0.75,
    "dual_green_gold": 0.7917,
    "dual_purple_gold": 0.625,
    "dual_red_blue": 0.6458,
    "dual_green_neutral": 0.6458,
    "dual_red_neutral": 0.5,
    "dual_blue_neutral": 0.7292,
    "dual_purple_neutral": 0.9167,
    "dual_gold_neutral": 0.6667,
    "tri_red_blue_purple": 0.75,
    "tri_red_green_gold": 0.6875,
    "tri_blue_purple_gold": 0.6042,
    "tri_red_purple_green": 0.5208,
    "tri_blue_green_gold": 0.6042,
    "tri_blue_purple_green": 0.7708,
    "tri_red_purple_gold": 0.6458,
    "tri_purple_green_gold": 0.6042,
    "tri_red_blue_green": 0.7083,
    "tri_red_blue_gold": 0.5208,
    "penta_prismatic_crater": 0.6042,
    "penta_free_city_sovereign": 0.6458,
    "penta_wheel_convergence": 0.7917
  },
  "dual_blue_neutral": {
    "mono_green_swarm": 0.7083,
    "mono_green_colossus": 0.7083,
    "mono_green_roots": 0.8125,
    "mono_red_blitz": 0.6042,
    "mono_red_pyroclasm": 0.9167,
    "mono_red_dragon": 0.6042,
    "mono_blue_frost": 0.6458,
    "mono_blue_chrono": 0.4583,
    "mono_blue_abyssal": 0.7292,
    "mono_purple_crypt": 0.7708,
    "mono_purple_blood": 0.8125,
    "mono_purple_umbral": 0.5417,
    "mono_gold_phalanx": 0.6042,
    "mono_gold_celestial": 0.5833,
    "mono_gold_judgment": 0.6875,
    "mono_neutral_axial": 0.5417,
    "dual_red_gold": 0.4167,
    "dual_blue_purple": 0.6667,
    "dual_red_green": 0.4583,
    "dual_blue_gold": 0.6875,
    "dual_purple_green": 0.5208,
    "dual_red_purple": 0.5417,
    "dual_blue_green": 0.5417,
    "dual_green_gold": 0.6042,
    "dual_purple_gold": 0.5208,
    "dual_red_blue": 0.5208,
    "dual_green_neutral": 0.4792,
    "dual_red_neutral": 0.2708,
    "dual_blue_neutral": 0.5,
    "dual_purple_neutral": 0.5833,
    "dual_gold_neutral": 0.4792,
    "tri_red_blue_purple": 0.5833,
    "tri_red_green_gold": 0.5417,
    "tri_blue_purple_gold": 0.625,
    "tri_red_purple_green": 0.4167,
    "tri_blue_green_gold": 0.5,
    "tri_blue_purple_green": 0.5417,
    "tri_red_purple_gold": 0.25,
    "tri_purple_green_gold": 0.4375,
    "tri_red_blue_green": 0.4583,
    "tri_red_blue_gold": 0.4583,
    "penta_prismatic_crater": 0.4375,
    "penta_free_city_sovereign": 0.5208,
    "penta_wheel_convergence": 0.5625
  },
  "dual_purple_neutral": {
    "mono_green_swarm": 0.6458,
    "mono_green_colossus": 0.5625,
    "mono_green_roots": 0.5833,
    "mono_red_blitz": 0.5417,
    "mono_red_pyroclasm": 0.6458,
    "mono_red_dragon": 0.6667,
    "mono_blue_frost": 0.6875,
    "mono_blue_chrono": 0.5625,
    "mono_blue_abyssal": 0.6458,
    "mono_purple_crypt": 0.6042,
    "mono_purple_blood": 0.6667,
    "mono_purple_umbral": 0.7708,
    "mono_gold_phalanx": 0.4167,
    "mono_gold_celestial": 0.5,
    "mono_gold_judgment": 0.5625,
    "mono_neutral_axial": 0.4792,
    "dual_red_gold": 0.25,
    "dual_blue_purple": 0.6667,
    "dual_red_green": 0.3333,
    "dual_blue_gold": 0.3125,
    "dual_purple_green": 0.4375,
    "dual_red_purple": 0.4375,
    "dual_blue_green": 0.5,
    "dual_green_gold": 0.375,
    "dual_purple_gold": 0.375,
    "dual_red_blue": 0.4167,
    "dual_green_neutral": 0.2708,
    "dual_red_neutral": 0.0833,
    "dual_blue_neutral": 0.4167,
    "dual_purple_neutral": 0.5,
    "dual_gold_neutral": 0.2917,
    "tri_red_blue_purple": 0.5,
    "tri_red_green_gold": 0.2917,
    "tri_blue_purple_gold": 0.4167,
    "tri_red_purple_green": 0.3125,
    "tri_blue_green_gold": 0.4583,
    "tri_blue_purple_green": 0.5833,
    "tri_red_purple_gold": 0.2917,
    "tri_purple_green_gold": 0.2917,
    "tri_red_blue_green": 0.5625,
    "tri_red_blue_gold": 0.1875,
    "penta_prismatic_crater": 0.3958,
    "penta_free_city_sovereign": 0.3125,
    "penta_wheel_convergence": 0.5417
  },
  "dual_gold_neutral": {
    "mono_green_swarm": 0.875,
    "mono_green_colossus": 0.7917,
    "mono_green_roots": 0.875,
    "mono_red_blitz": 0.7292,
    "mono_red_pyroclasm": 0.7917,
    "mono_red_dragon": 0.7083,
    "mono_blue_frost": 0.625,
    "mono_blue_chrono": 0.5,
    "mono_blue_abyssal": 0.6667,
    "mono_purple_crypt": 0.7083,
    "mono_purple_blood": 0.8333,
    "mono_purple_umbral": 0.6042,
    "mono_gold_phalanx": 0.7292,
    "mono_gold_celestial": 0.7708,
    "mono_gold_judgment": 0.7708,
    "mono_neutral_axial": 0.6042,
    "dual_red_gold": 0.375,
    "dual_blue_purple": 0.4792,
    "dual_red_green": 0.375,
    "dual_blue_gold": 0.4375,
    "dual_purple_green": 0.6458,
    "dual_red_purple": 0.625,
    "dual_blue_green": 0.375,
    "dual_green_gold": 0.6042,
    "dual_purple_gold": 0.6458,
    "dual_red_blue": 0.5417,
    "dual_green_neutral": 0.5,
    "dual_red_neutral": 0.3333,
    "dual_blue_neutral": 0.5208,
    "dual_purple_neutral": 0.7083,
    "dual_gold_neutral": 0.5,
    "tri_red_blue_purple": 0.5,
    "tri_red_green_gold": 0.4792,
    "tri_blue_purple_gold": 0.5625,
    "tri_red_purple_green": 0.5417,
    "tri_blue_green_gold": 0.4583,
    "tri_blue_purple_green": 0.5,
    "tri_red_purple_gold": 0.375,
    "tri_purple_green_gold": 0.4583,
    "tri_red_blue_green": 0.4792,
    "tri_red_blue_gold": 0.25,
    "penta_prismatic_crater": 0.4167,
    "penta_free_city_sovereign": 0.5833,
    "penta_wheel_convergence": 0.4792
  },
  "tri_red_blue_purple": {
    "mono_green_swarm": 0.6042,
    "mono_green_colossus": 0.5,
    "mono_green_roots": 0.6875,
    "mono_red_blitz": 0.5417,
    "mono_red_pyroclasm": 0.6458,
    "mono_red_dragon": 0.6875,
    "mono_blue_frost": 0.4167,
    "mono_blue_chrono": 0.3958,
    "mono_blue_abyssal": 0.6667,
    "mono_purple_crypt": 0.5625,
    "mono_purple_blood": 0.6458,
    "mono_purple_umbral": 0.4792,
    "mono_gold_phalanx": 0.6667,
    "mono_gold_celestial": 0.5625,
    "mono_gold_judgment": 0.625,
    "mono_neutral_axial": 0.5625,
    "dual_red_gold": 0.4583,
    "dual_blue_purple": 0.5625,
    "dual_red_green": 0.6458,
    "dual_blue_gold": 0.5208,
    "dual_purple_green": 0.5625,
    "dual_red_purple": 0.4167,
    "dual_blue_green": 0.5,
    "dual_green_gold": 0.6042,
    "dual_purple_gold": 0.4167,
    "dual_red_blue": 0.4583,
    "dual_green_neutral": 0.375,
    "dual_red_neutral": 0.25,
    "dual_blue_neutral": 0.4167,
    "dual_purple_neutral": 0.5,
    "dual_gold_neutral": 0.5,
    "tri_red_blue_purple": 0.5,
    "tri_red_green_gold": 0.5208,
    "tri_blue_purple_gold": 0.4167,
    "tri_red_purple_green": 0.3542,
    "tri_blue_green_gold": 0.4792,
    "tri_blue_purple_green": 0.4375,
    "tri_red_purple_gold": 0.3333,
    "tri_purple_green_gold": 0.4375,
    "tri_red_blue_green": 0.3958,
    "tri_red_blue_gold": 0.2917,
    "penta_prismatic_crater": 0.375,
    "penta_free_city_sovereign": 0.3542,
    "penta_wheel_convergence": 0.4167
  },
  "tri_red_green_gold": {
    "mono_green_swarm": 0.7708,
    "mono_green_colossus": 0.7708,
    "mono_green_roots": 0.7917,
    "mono_red_blitz": 0.7708,
    "mono_red_pyroclasm": 0.8125,
    "mono_red_dragon": 0.6875,
    "mono_blue_frost": 0.4375,
    "mono_blue_chrono": 0.625,
    "mono_blue_abyssal": 0.7083,
    "mono_purple_crypt": 0.625,
    "mono_purple_blood": 0.875,
    "mono_purple_umbral": 0.5833,
    "mono_gold_phalanx": 0.7083,
    "mono_gold_celestial": 0.75,
    "mono_gold_judgment": 0.7083,
    "mono_neutral_axial": 0.7083,
    "dual_red_gold": 0.3542,
    "dual_blue_purple": 0.4583,
    "dual_red_green": 0.5208,
    "dual_blue_gold": 0.4375,
    "dual_purple_green": 0.4792,
    "dual_red_purple": 0.5833,
    "dual_blue_green": 0.5,
    "dual_green_gold": 0.7292,
    "dual_purple_gold": 0.5833,
    "dual_red_blue": 0.5,
    "dual_green_neutral": 0.4583,
    "dual_red_neutral": 0.3125,
    "dual_blue_neutral": 0.4583,
    "dual_purple_neutral": 0.7083,
    "dual_gold_neutral": 0.5208,
    "tri_red_blue_purple": 0.4792,
    "tri_red_green_gold": 0.5,
    "tri_blue_purple_gold": 0.5208,
    "tri_red_purple_green": 0.3542,
    "tri_blue_green_gold": 0.5208,
    "tri_blue_purple_green": 0.6458,
    "tri_red_purple_gold": 0.3542,
    "tri_purple_green_gold": 0.3958,
    "tri_red_blue_green": 0.375,
    "tri_red_blue_gold": 0.3125,
    "penta_prismatic_crater": 0.5625,
    "penta_free_city_sovereign": 0.4167,
    "penta_wheel_convergence": 0.4792
  },
  "tri_blue_purple_gold": {
    "mono_green_swarm": 0.75,
    "mono_green_colossus": 0.7292,
    "mono_green_roots": 0.7708,
    "mono_red_blitz": 0.75,
    "mono_red_pyroclasm": 0.8333,
    "mono_red_dragon": 0.7917,
    "mono_blue_frost": 0.5,
    "mono_blue_chrono": 0.5,
    "mono_blue_abyssal": 0.7292,
    "mono_purple_crypt": 0.625,
    "mono_purple_blood": 0.5833,
    "mono_purple_umbral": 0.6458,
    "mono_gold_phalanx": 0.6458,
    "mono_gold_celestial": 0.7708,
    "mono_gold_judgment": 0.7292,
    "mono_neutral_axial": 0.625,
    "dual_red_gold": 0.5417,
    "dual_blue_purple": 0.5,
    "dual_red_green": 0.3958,
    "dual_blue_gold": 0.375,
    "dual_purple_green": 0.5417,
    "dual_red_purple": 0.5208,
    "dual_blue_green": 0.375,
    "dual_green_gold": 0.5417,
    "dual_purple_gold": 0.3542,
    "dual_red_blue": 0.5208,
    "dual_green_neutral": 0.3542,
    "dual_red_neutral": 0.3958,
    "dual_blue_neutral": 0.375,
    "dual_purple_neutral": 0.5833,
    "dual_gold_neutral": 0.4375,
    "tri_red_blue_purple": 0.5833,
    "tri_red_green_gold": 0.4792,
    "tri_blue_purple_gold": 0.5,
    "tri_red_purple_green": 0.4792,
    "tri_blue_green_gold": 0.3125,
    "tri_blue_purple_green": 0.6042,
    "tri_red_purple_gold": 0.3958,
    "tri_purple_green_gold": 0.3125,
    "tri_red_blue_green": 0.5208,
    "tri_red_blue_gold": 0.3333,
    "penta_prismatic_crater": 0.4583,
    "penta_free_city_sovereign": 0.4375,
    "penta_wheel_convergence": 0.375
  },
  "tri_red_purple_green": {
    "mono_green_swarm": 0.9167,
    "mono_green_colossus": 0.8125,
    "mono_green_roots": 0.8333,
    "mono_red_blitz": 0.7083,
    "mono_red_pyroclasm": 0.9167,
    "mono_red_dragon": 0.8958,
    "mono_blue_frost": 0.6458,
    "mono_blue_chrono": 0.7708,
    "mono_blue_abyssal": 0.7917,
    "mono_purple_crypt": 0.7708,
    "mono_purple_blood": 0.7917,
    "mono_purple_umbral": 0.6667,
    "mono_gold_phalanx": 0.6667,
    "mono_gold_celestial": 0.75,
    "mono_gold_judgment": 0.6875,
    "mono_neutral_axial": 0.8125,
    "dual_red_gold": 0.5208,
    "dual_blue_purple": 0.8333,
    "dual_red_green": 0.5625,
    "dual_blue_gold": 0.6042,
    "dual_purple_green": 0.75,
    "dual_red_purple": 0.6667,
    "dual_blue_green": 0.7292,
    "dual_green_gold": 0.7083,
    "dual_purple_gold": 0.6042,
    "dual_red_blue": 0.7292,
    "dual_green_neutral": 0.6667,
    "dual_red_neutral": 0.4792,
    "dual_blue_neutral": 0.5833,
    "dual_purple_neutral": 0.6875,
    "dual_gold_neutral": 0.4583,
    "tri_red_blue_purple": 0.6458,
    "tri_red_green_gold": 0.6458,
    "tri_blue_purple_gold": 0.5208,
    "tri_red_purple_green": 0.5,
    "tri_blue_green_gold": 0.5625,
    "tri_blue_purple_green": 0.7292,
    "tri_red_purple_gold": 0.4792,
    "tri_purple_green_gold": 0.4375,
    "tri_red_blue_green": 0.6458,
    "tri_red_blue_gold": 0.5625,
    "penta_prismatic_crater": 0.4792,
    "penta_free_city_sovereign": 0.6875,
    "penta_wheel_convergence": 0.5208
  },
  "tri_blue_green_gold": {
    "mono_green_swarm": 0.6875,
    "mono_green_colossus": 0.6458,
    "mono_green_roots": 0.8542,
    "mono_red_blitz": 0.625,
    "mono_red_pyroclasm": 0.6458,
    "mono_red_dragon": 0.7083,
    "mono_blue_frost": 0.5625,
    "mono_blue_chrono": 0.5,
    "mono_blue_abyssal": 0.6042,
    "mono_purple_crypt": 0.7292,
    "mono_purple_blood": 0.75,
    "mono_purple_umbral": 0.625,
    "mono_gold_phalanx": 0.7708,
    "mono_gold_celestial": 0.75,
    "mono_gold_judgment": 0.75,
    "mono_neutral_axial": 0.6875,
    "dual_red_gold": 0.2708,
    "dual_blue_purple": 0.5833,
    "dual_red_green": 0.4167,
    "dual_blue_gold": 0.4792,
    "dual_purple_green": 0.6042,
    "dual_red_purple": 0.5625,
    "dual_blue_green": 0.4792,
    "dual_green_gold": 0.6042,
    "dual_purple_gold": 0.6667,
    "dual_red_blue": 0.5417,
    "dual_green_neutral": 0.3958,
    "dual_red_neutral": 0.3958,
    "dual_blue_neutral": 0.5,
    "dual_purple_neutral": 0.5417,
    "dual_gold_neutral": 0.5417,
    "tri_red_blue_purple": 0.5208,
    "tri_red_green_gold": 0.4792,
    "tri_blue_purple_gold": 0.6875,
    "tri_red_purple_green": 0.4375,
    "tri_blue_green_gold": 0.5,
    "tri_blue_purple_green": 0.6667,
    "tri_red_purple_gold": 0.5,
    "tri_purple_green_gold": 0.4792,
    "tri_red_blue_green": 0.2917,
    "tri_red_blue_gold": 0.3125,
    "penta_prismatic_crater": 0.4792,
    "penta_free_city_sovereign": 0.3958,
    "penta_wheel_convergence": 0.5
  },
  "tri_blue_purple_green": {
    "mono_green_swarm": 0.6042,
    "mono_green_colossus": 0.7083,
    "mono_green_roots": 0.7292,
    "mono_red_blitz": 0.5208,
    "mono_red_pyroclasm": 0.625,
    "mono_red_dragon": 0.7083,
    "mono_blue_frost": 0.6667,
    "mono_blue_chrono": 0.5625,
    "mono_blue_abyssal": 0.6458,
    "mono_purple_crypt": 0.5833,
    "mono_purple_blood": 0.625,
    "mono_purple_umbral": 0.625,
    "mono_gold_phalanx": 0.6042,
    "mono_gold_celestial": 0.625,
    "mono_gold_judgment": 0.7083,
    "mono_neutral_axial": 0.75,
    "dual_red_gold": 0.4375,
    "dual_blue_purple": 0.5625,
    "dual_red_green": 0.3333,
    "dual_blue_gold": 0.3542,
    "dual_purple_green": 0.4792,
    "dual_red_purple": 0.5,
    "dual_blue_green": 0.4167,
    "dual_green_gold": 0.4583,
    "dual_purple_gold": 0.4583,
    "dual_red_blue": 0.4375,
    "dual_green_neutral": 0.2917,
    "dual_red_neutral": 0.2292,
    "dual_blue_neutral": 0.4583,
    "dual_purple_neutral": 0.4167,
    "dual_gold_neutral": 0.5,
    "tri_red_blue_purple": 0.5625,
    "tri_red_green_gold": 0.3542,
    "tri_blue_purple_gold": 0.3958,
    "tri_red_purple_green": 0.2708,
    "tri_blue_green_gold": 0.3333,
    "tri_blue_purple_green": 0.5,
    "tri_red_purple_gold": 0.3333,
    "tri_purple_green_gold": 0.5,
    "tri_red_blue_green": 0.3958,
    "tri_red_blue_gold": 0.3125,
    "penta_prismatic_crater": 0.2917,
    "penta_free_city_sovereign": 0.4375,
    "penta_wheel_convergence": 0.3958
  },
  "tri_red_purple_gold": {
    "mono_green_swarm": 0.6667,
    "mono_green_colossus": 0.7708,
    "mono_green_roots": 0.8333,
    "mono_red_blitz": 0.6667,
    "mono_red_pyroclasm": 0.8333,
    "mono_red_dragon": 0.8333,
    "mono_blue_frost": 0.6458,
    "mono_blue_chrono": 0.7292,
    "mono_blue_abyssal": 0.8542,
    "mono_purple_crypt": 0.6875,
    "mono_purple_blood": 0.9167,
    "mono_purple_umbral": 0.6875,
    "mono_gold_phalanx": 0.6875,
    "mono_gold_celestial": 0.6458,
    "mono_gold_judgment": 0.8125,
    "mono_neutral_axial": 0.7292,
    "dual_red_gold": 0.5625,
    "dual_blue_purple": 0.6042,
    "dual_red_green": 0.4375,
    "dual_blue_gold": 0.6667,
    "dual_purple_green": 0.6042,
    "dual_red_purple": 0.75,
    "dual_blue_green": 0.7083,
    "dual_green_gold": 0.6667,
    "dual_purple_gold": 0.5208,
    "dual_red_blue": 0.6042,
    "dual_green_neutral": 0.6042,
    "dual_red_neutral": 0.3542,
    "dual_blue_neutral": 0.75,
    "dual_purple_neutral": 0.7083,
    "dual_gold_neutral": 0.625,
    "tri_red_blue_purple": 0.6667,
    "tri_red_green_gold": 0.6458,
    "tri_blue_purple_gold": 0.6042,
    "tri_red_purple_green": 0.5208,
    "tri_blue_green_gold": 0.5,
    "tri_blue_purple_green": 0.6667,
    "tri_red_purple_gold": 0.5,
    "tri_purple_green_gold": 0.4583,
    "tri_red_blue_green": 0.6042,
    "tri_red_blue_gold": 0.4583,
    "penta_prismatic_crater": 0.5833,
    "penta_free_city_sovereign": 0.6875,
    "penta_wheel_convergence": 0.5625
  },
  "tri_purple_green_gold": {
    "mono_green_swarm": 0.7292,
    "mono_green_colossus": 0.625,
    "mono_green_roots": 0.7708,
    "mono_red_blitz": 0.625,
    "mono_red_pyroclasm": 0.6667,
    "mono_red_dragon": 0.6042,
    "mono_blue_frost": 0.5417,
    "mono_blue_chrono": 0.625,
    "mono_blue_abyssal": 0.7708,
    "mono_purple_crypt": 0.75,
    "mono_purple_blood": 0.8333,
    "mono_purple_umbral": 0.6458,
    "mono_gold_phalanx": 0.8542,
    "mono_gold_celestial": 0.7292,
    "mono_gold_judgment": 0.75,
    "mono_neutral_axial": 0.7292,
    "dual_red_gold": 0.5833,
    "dual_blue_purple": 0.6042,
    "dual_red_green": 0.4375,
    "dual_blue_gold": 0.4167,
    "dual_purple_green": 0.4792,
    "dual_red_purple": 0.6875,
    "dual_blue_green": 0.3958,
    "dual_green_gold": 0.5417,
    "dual_purple_gold": 0.5208,
    "dual_red_blue": 0.4167,
    "dual_green_neutral": 0.5833,
    "dual_red_neutral": 0.3958,
    "dual_blue_neutral": 0.5625,
    "dual_purple_neutral": 0.7083,
    "dual_gold_neutral": 0.5417,
    "tri_red_blue_purple": 0.5625,
    "tri_red_green_gold": 0.6042,
    "tri_blue_purple_gold": 0.6875,
    "tri_red_purple_green": 0.5625,
    "tri_blue_green_gold": 0.5208,
    "tri_blue_purple_green": 0.5,
    "tri_red_purple_gold": 0.5417,
    "tri_purple_green_gold": 0.5,
    "tri_red_blue_green": 0.4375,
    "tri_red_blue_gold": 0.2917,
    "penta_prismatic_crater": 0.4375,
    "penta_free_city_sovereign": 0.5,
    "penta_wheel_convergence": 0.5208
  },
  "tri_red_blue_green": {
    "mono_green_swarm": 0.6458,
    "mono_green_colossus": 0.7083,
    "mono_green_roots": 0.875,
    "mono_red_blitz": 0.5417,
    "mono_red_pyroclasm": 0.625,
    "mono_red_dragon": 0.7083,
    "mono_blue_frost": 0.625,
    "mono_blue_chrono": 0.6042,
    "mono_blue_abyssal": 0.7292,
    "mono_purple_crypt": 0.6667,
    "mono_purple_blood": 0.6667,
    "mono_purple_umbral": 0.5625,
    "mono_gold_phalanx": 0.7292,
    "mono_gold_celestial": 0.6042,
    "mono_gold_judgment": 0.7708,
    "mono_neutral_axial": 0.5417,
    "dual_red_gold": 0.4583,
    "dual_blue_purple": 0.5417,
    "dual_red_green": 0.6042,
    "dual_blue_gold": 0.6667,
    "dual_purple_green": 0.5417,
    "dual_red_purple": 0.4375,
    "dual_blue_green": 0.5625,
    "dual_green_gold": 0.6042,
    "dual_purple_gold": 0.6458,
    "dual_red_blue": 0.5625,
    "dual_green_neutral": 0.5208,
    "dual_red_neutral": 0.2917,
    "dual_blue_neutral": 0.5417,
    "dual_purple_neutral": 0.4375,
    "dual_gold_neutral": 0.5208,
    "tri_red_blue_purple": 0.6042,
    "tri_red_green_gold": 0.625,
    "tri_blue_purple_gold": 0.4792,
    "tri_red_purple_green": 0.3542,
    "tri_blue_green_gold": 0.7083,
    "tri_blue_purple_green": 0.6042,
    "tri_red_purple_gold": 0.3958,
    "tri_purple_green_gold": 0.5625,
    "tri_red_blue_green": 0.5,
    "tri_red_blue_gold": 0.3333,
    "penta_prismatic_crater": 0.5,
    "penta_free_city_sovereign": 0.6042,
    "penta_wheel_convergence": 0.5417
  },
  "tri_red_blue_gold": {
    "mono_green_swarm": 0.8542,
    "mono_green_colossus": 0.8333,
    "mono_green_roots": 0.9286,
    "mono_red_blitz": 0.7292,
    "mono_red_pyroclasm": 0.8542,
    "mono_red_dragon": 0.7917,
    "mono_blue_frost": 0.7292,
    "mono_blue_chrono": 0.8125,
    "mono_blue_abyssal": 0.8958,
    "mono_purple_crypt": 0.8333,
    "mono_purple_blood": 0.9375,
    "mono_purple_umbral": 0.7917,
    "mono_gold_phalanx": 0.8125,
    "mono_gold_celestial": 0.8125,
    "mono_gold_judgment": 0.9167,
    "mono_neutral_axial": 0.7917,
    "dual_red_gold": 0.4583,
    "dual_blue_purple": 0.6458,
    "dual_red_green": 0.6667,
    "dual_blue_gold": 0.75,
    "dual_purple_green": 0.7917,
    "dual_red_purple": 0.7708,
    "dual_blue_green": 0.7083,
    "dual_green_gold": 0.625,
    "dual_purple_gold": 0.7708,
    "dual_red_blue": 0.6875,
    "dual_green_neutral": 0.4792,
    "dual_red_neutral": 0.4792,
    "dual_blue_neutral": 0.5417,
    "dual_purple_neutral": 0.8125,
    "dual_gold_neutral": 0.75,
    "tri_red_blue_purple": 0.7083,
    "tri_red_green_gold": 0.6875,
    "tri_blue_purple_gold": 0.6667,
    "tri_red_purple_green": 0.4375,
    "tri_blue_green_gold": 0.6875,
    "tri_blue_purple_green": 0.6875,
    "tri_red_purple_gold": 0.5417,
    "tri_purple_green_gold": 0.7083,
    "tri_red_blue_green": 0.6667,
    "tri_red_blue_gold": 0.5,
    "penta_prismatic_crater": 0.7083,
    "penta_free_city_sovereign": 0.7083,
    "penta_wheel_convergence": 0.7292
  },
  "penta_prismatic_crater": {
    "mono_green_swarm": 0.6875,
    "mono_green_colossus": 0.7917,
    "mono_green_roots": 0.8542,
    "mono_red_blitz": 0.5208,
    "mono_red_pyroclasm": 0.7083,
    "mono_red_dragon": 0.5833,
    "mono_blue_frost": 0.625,
    "mono_blue_chrono": 0.75,
    "mono_blue_abyssal": 0.8542,
    "mono_purple_crypt": 0.7708,
    "mono_purple_blood": 0.7917,
    "mono_purple_umbral": 0.7708,
    "mono_gold_phalanx": 0.5833,
    "mono_gold_celestial": 0.7083,
    "mono_gold_judgment": 0.7708,
    "mono_neutral_axial": 0.6458,
    "dual_red_gold": 0.3958,
    "dual_blue_purple": 0.4583,
    "dual_red_green": 0.4375,
    "dual_blue_gold": 0.5833,
    "dual_purple_green": 0.625,
    "dual_red_purple": 0.5625,
    "dual_blue_green": 0.6042,
    "dual_green_gold": 0.5625,
    "dual_purple_gold": 0.5625,
    "dual_red_blue": 0.5833,
    "dual_green_neutral": 0.4375,
    "dual_red_neutral": 0.3958,
    "dual_blue_neutral": 0.5625,
    "dual_purple_neutral": 0.6042,
    "dual_gold_neutral": 0.5833,
    "tri_red_blue_purple": 0.625,
    "tri_red_green_gold": 0.4375,
    "tri_blue_purple_gold": 0.5417,
    "tri_red_purple_green": 0.5208,
    "tri_blue_green_gold": 0.5208,
    "tri_blue_purple_green": 0.7083,
    "tri_red_purple_gold": 0.4167,
    "tri_purple_green_gold": 0.5625,
    "tri_red_blue_green": 0.5,
    "tri_red_blue_gold": 0.2917,
    "penta_prismatic_crater": 0.5,
    "penta_free_city_sovereign": 0.5,
    "penta_wheel_convergence": 0.5417
  },
  "penta_free_city_sovereign": {
    "mono_green_swarm": 0.6458,
    "mono_green_colossus": 0.625,
    "mono_green_roots": 0.7917,
    "mono_red_blitz": 0.6875,
    "mono_red_pyroclasm": 0.625,
    "mono_red_dragon": 0.6667,
    "mono_blue_frost": 0.4583,
    "mono_blue_chrono": 0.5417,
    "mono_blue_abyssal": 0.75,
    "mono_purple_crypt": 0.7708,
    "mono_purple_blood": 0.7292,
    "mono_purple_umbral": 0.7083,
    "mono_gold_phalanx": 0.7708,
    "mono_gold_celestial": 0.6458,
    "mono_gold_judgment": 0.6875,
    "mono_neutral_axial": 0.7292,
    "dual_red_gold": 0.4583,
    "dual_blue_purple": 0.5,
    "dual_red_green": 0.4583,
    "dual_blue_gold": 0.5833,
    "dual_purple_green": 0.7292,
    "dual_red_purple": 0.5833,
    "dual_blue_green": 0.4583,
    "dual_green_gold": 0.5625,
    "dual_purple_gold": 0.5625,
    "dual_red_blue": 0.5417,
    "dual_green_neutral": 0.4583,
    "dual_red_neutral": 0.3542,
    "dual_blue_neutral": 0.4792,
    "dual_purple_neutral": 0.6875,
    "dual_gold_neutral": 0.4167,
    "tri_red_blue_purple": 0.6458,
    "tri_red_green_gold": 0.5833,
    "tri_blue_purple_gold": 0.5625,
    "tri_red_purple_green": 0.3125,
    "tri_blue_green_gold": 0.6042,
    "tri_blue_purple_green": 0.5625,
    "tri_red_purple_gold": 0.3125,
    "tri_purple_green_gold": 0.5,
    "tri_red_blue_green": 0.3958,
    "tri_red_blue_gold": 0.2917,
    "penta_prismatic_crater": 0.5,
    "penta_free_city_sovereign": 0.5,
    "penta_wheel_convergence": 0.625
  },
  "penta_wheel_convergence": {
    "mono_green_swarm": 0.75,
    "mono_green_colossus": 0.6458,
    "mono_green_roots": 0.8125,
    "mono_red_blitz": 0.7083,
    "mono_red_pyroclasm": 0.8333,
    "mono_red_dragon": 0.6458,
    "mono_blue_frost": 0.6458,
    "mono_blue_chrono": 0.5417,
    "mono_blue_abyssal": 0.75,
    "mono_purple_crypt": 0.6042,
    "mono_purple_blood": 0.8125,
    "mono_purple_umbral": 0.75,
    "mono_gold_phalanx": 0.7083,
    "mono_gold_celestial": 0.6667,
    "mono_gold_judgment": 0.8125,
    "mono_neutral_axial": 0.7917,
    "dual_red_gold": 0.3333,
    "dual_blue_purple": 0.6042,
    "dual_red_green": 0.4167,
    "dual_blue_gold": 0.5,
    "dual_purple_green": 0.5208,
    "dual_red_purple": 0.5625,
    "dual_blue_green": 0.4167,
    "dual_green_gold": 0.6042,
    "dual_purple_gold": 0.6042,
    "dual_red_blue": 0.375,
    "dual_green_neutral": 0.3542,
    "dual_red_neutral": 0.2083,
    "dual_blue_neutral": 0.4375,
    "dual_purple_neutral": 0.4583,
    "dual_gold_neutral": 0.5208,
    "tri_red_blue_purple": 0.5833,
    "tri_red_green_gold": 0.5208,
    "tri_blue_purple_gold": 0.625,
    "tri_red_purple_green": 0.4792,
    "tri_blue_green_gold": 0.5,
    "tri_blue_purple_green": 0.6042,
    "tri_red_purple_gold": 0.4375,
    "tri_purple_green_gold": 0.4792,
    "tri_red_blue_green": 0.4583,
    "tri_red_blue_gold": 0.2708,
    "penta_prismatic_crater": 0.4583,
    "penta_free_city_sovereign": 0.375,
    "penta_wheel_convergence": 0.5
  }
};
