import { Domain } from '../types/game';
import type { MonocolorArchetypeId } from './aiMonocolorMasteryData';
import type { BicolorArchetypeId } from './aiBicolorMasteryData';
import type { PolycolorArchetypeId } from './aiPolycolorMasteryData';

/**
 * GERADO AUTOMATICAMENTE POR src/scripts/runUnifiedTournament.ts (npm run tournament:unified)
 * Grande Torneio Unificado de Vaeloria (44 × 43 Campeões Tier V): 26440 duelos Beam Search (93.7s em 10 threads)
 * Margem de Erro Máxima IC 95% por Campeão: ±2.96%
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
  "generatedAt": "2026-11-01T00:57:23.815Z",
  "totalChampions": 44,
  "totalUnorderedPairs": 946,
  "totalMatchesSimulated": 26440,
  "numWorkers": 10,
  "elapsedSeconds": 93.7,
  "maxChampionCi95HalfWidth": 0.0296,
  "convergedByMargin": true,
  "tierCounts": {
    "S": 17,
    "A": 11,
    "B": 16
  },
  "formatEcologyMatrix": {
    "monocolor": {
      "overallWinRate": 0.3699,
      "totalGames": 19128,
      "vsFormat": {
        "monocolor": 0.5,
        "bicolor": 0.3038,
        "tricolor": 0.2866,
        "pentachromatic": 0.3333
      }
    },
    "bicolor": {
      "overallWinRate": 0.5652,
      "totalGames": 18000,
      "vsFormat": {
        "monocolor": 0.6962,
        "bicolor": 0.5,
        "tricolor": 0.4661,
        "pentachromatic": 0.5071
      }
    },
    "tricolor": {
      "overallWinRate": 0.5933,
      "totalGames": 12128,
      "vsFormat": {
        "monocolor": 0.7134,
        "bicolor": 0.5339,
        "tricolor": 0.5,
        "pentachromatic": 0.5376
      }
    },
    "pentachromatic": {
      "overallWinRate": 0.5505,
      "totalGames": 3624,
      "vsFormat": {
        "monocolor": 0.6667,
        "bicolor": 0.4929,
        "tricolor": 0.4624,
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
      "playedGames": 267,
      "playedWinRate": 0.809
    },
    {
      "cardId": "red_76_salamandra_vapor",
      "cardName": "Serpente de Vapor Superaquecido",
      "domain": "red",
      "cost": 3,
      "playedGames": 2084,
      "playedWinRate": 0.4688
    },
    {
      "cardId": "red_55_diabrete_forja",
      "cardName": "Diabrete Soprador de Brasas",
      "domain": "red",
      "cost": 1,
      "playedGames": 5062,
      "playedWinRate": 0.5798
    },
    {
      "cardId": "red_109_diabrete_fornalha",
      "cardName": "Diabrete da Fornalha",
      "domain": "red",
      "cost": 1,
      "playedGames": 1158,
      "playedWinRate": 0.5734
    },
    {
      "cardId": "neutral_88_espada_voadora_runica",
      "cardName": "Gládio Levitante do Salão",
      "domain": "neutral",
      "cost": 1,
      "playedGames": 388,
      "playedWinRate": 0.7526
    },
    {
      "cardId": "neutral_52_mercenario_planar",
      "cardName": "Mercenário das Lâminas Planais",
      "domain": "neutral",
      "cost": 2,
      "playedGames": 7673,
      "playedWinRate": 0.578
    },
    {
      "cardId": "gold_32_estandarte_imperial",
      "cardName": "Estandarte da Legião Dourada",
      "domain": "gold",
      "cost": 4,
      "playedGames": 518,
      "playedWinRate": 0.6892
    },
    {
      "cardId": "gold_04_armadura_conjurada",
      "cardName": "Sentinela de Elmo Arcano",
      "domain": "gold",
      "cost": 3,
      "playedGames": 5235,
      "playedWinRate": 0.5526
    },
    {
      "cardId": "gold_02_gargula",
      "cardName": "Gárgula da Catedral Solar",
      "domain": "gold",
      "cost": 2,
      "playedGames": 2672,
      "playedWinRate": 0.5266
    },
    {
      "cardId": "gold_157_dragao_soberano_alvorada",
      "cardName": "Aurelius, Soberano Dragão da Alvorada",
      "domain": "gold",
      "cost": 8,
      "playedGames": 277,
      "playedWinRate": 0.787
    },
    {
      "cardId": "blue_153_leviata_fenda_abissal",
      "cardName": "Zephyrus, Monarca do Ciclone",
      "domain": "blue",
      "cost": 6,
      "playedGames": 2304,
      "playedWinRate": 0.6224
    },
    {
      "cardId": "green_68_zaratan_ilha",
      "cardName": "Chelonia, A Tartaruga-Continente",
      "domain": "green",
      "cost": 7,
      "playedGames": 85,
      "playedWinRate": 0.4471
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
      "playedGames": 80,
      "playedWinRate": 0.4375
    },
    {
      "cardId": "green_167_arauto_prisma_selva",
      "cardName": "Arauto da Raiz Prismática",
      "domain": "green",
      "cost": 5,
      "playedGames": 70,
      "playedWinRate": 0.3857
    },
    {
      "cardId": "gold_167_arauto_prisma_sol",
      "cardName": "Arauto do Zênite Prismático",
      "domain": "gold",
      "cost": 5,
      "playedGames": 83,
      "playedWinRate": 0.2892
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
      "playedGames": 114,
      "playedWinRate": 0.5702
    },
    {
      "cardId": "purple_23_dracolich",
      "cardName": "Ossaurion, Dragão-Ossário Eterno",
      "domain": "purple",
      "cost": 7,
      "playedGames": 53,
      "playedWinRate": 0.7547
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
      "playedGames": 99,
      "playedWinRate": 0.4646
    },
    {
      "cardId": "green_75_druida_ciclos",
      "cardName": "Guardião das Quatro Estações",
      "domain": "green",
      "cost": 2,
      "playedGames": 149,
      "playedWinRate": 0.3624
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
      "playedGames": 82,
      "playedWinRate": 0.3293
    },
    {
      "cardId": "blue_168_tecelao_feixe_gelo",
      "cardName": "Tecelão do Feixe Astral",
      "domain": "blue",
      "cost": 3,
      "playedGames": 353,
      "playedWinRate": 0.4419
    },
    {
      "cardId": "purple_20_tecelao_profano",
      "cardName": "Aracnomante das Cavernas",
      "domain": "purple",
      "cost": 4,
      "playedGames": 326,
      "playedWinRate": 0.4816
    },
    {
      "cardId": "blue_17_bruxa_mar",
      "cardName": "Megera da Escuma Negra",
      "domain": "blue",
      "cost": 3,
      "playedGames": 622,
      "playedWinRate": 0.5225
    },
    {
      "cardId": "neutral_106_reen_assassino_relojoeiro",
      "cardName": "Reen, Ceifador de Engrenagens",
      "domain": "neutral",
      "cost": 4,
      "playedGames": 1523,
      "playedWinRate": 0.6802
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
      "playedGames": 355,
      "playedWinRate": 0.4789
    },
    {
      "cardId": "green_116_ent_espinheiro_anciao",
      "cardName": "Ent Espinheiro Ancião",
      "domain": "green",
      "cost": 5,
      "playedGames": 89,
      "playedWinRate": 0.4494
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
    "overallWinRate": 0.7346,
    "ci95HalfWidth": 0.0259,
    "matchesPlayed": 1168,
    "vsFormatWinRates": {
      "monocolor": 0.8154,
      "bicolor": 0.674,
      "tricolor": 0.7097,
      "pentachromatic": 0.6905
    },
    "bestMatchups": [
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.9643,
        "games": 28
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.9583,
        "games": 24
      },
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.9286,
        "games": 28
      },
      {
        "opponentId": "dual_blue_purple",
        "winRate": 0.8929,
        "games": 28
      },
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.875,
        "games": 24
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.375,
        "games": 24
      },
      {
        "opponentId": "dual_red_green",
        "winRate": 0.4643,
        "games": 28
      },
      {
        "opponentId": "tri_red_blue_green",
        "winRate": 0.5,
        "games": 28
      },
      {
        "opponentId": "dual_blue_green",
        "winRate": 0.5714,
        "games": 28
      },
      {
        "opponentId": "dual_green_gold",
        "winRate": 0.6071,
        "games": 28
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
    "overallWinRate": 0.7183,
    "ci95HalfWidth": 0.0264,
    "matchesPlayed": 1168,
    "vsFormatWinRates": {
      "monocolor": 0.8014,
      "bicolor": 0.7005,
      "tricolor": 0.6029,
      "pentachromatic": 0.75
    },
    "bestMatchups": [
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.9583,
        "games": 24
      },
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.8929,
        "games": 28
      },
      {
        "opponentId": "mono_blue_chrono",
        "winRate": 0.8929,
        "games": 28
      },
      {
        "opponentId": "dual_blue_purple",
        "winRate": 0.8929,
        "games": 28
      },
      {
        "opponentId": "penta_prismatic_crater",
        "winRate": 0.8929,
        "games": 28
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.25,
        "games": 24
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.4583,
        "games": 24
      },
      {
        "opponentId": "dual_green_neutral",
        "winRate": 0.5,
        "games": 24
      },
      {
        "opponentId": "penta_wheel_convergence",
        "winRate": 0.5357,
        "games": 28
      },
      {
        "opponentId": "dual_purple_gold",
        "winRate": 0.5357,
        "games": 28
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
    "overallWinRate": 0.6849,
    "ci95HalfWidth": 0.0272,
    "matchesPlayed": 1168,
    "vsFormatWinRates": {
      "monocolor": 0.8154,
      "bicolor": 0.5956,
      "tricolor": 0.5927,
      "pentachromatic": 0.7262
    },
    "bestMatchups": [
      {
        "opponentId": "mono_purple_crypt",
        "winRate": 0.9583,
        "games": 24
      },
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.8929,
        "games": 28
      },
      {
        "opponentId": "mono_blue_frost",
        "winRate": 0.8929,
        "games": 28
      },
      {
        "opponentId": "mono_blue_chrono",
        "winRate": 0.8929,
        "games": 28
      },
      {
        "opponentId": "mono_gold_celestial",
        "winRate": 0.8929,
        "games": 28
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.3333,
        "games": 24
      },
      {
        "opponentId": "dual_red_gold",
        "winRate": 0.4167,
        "games": 24
      },
      {
        "opponentId": "tri_red_green_gold",
        "winRate": 0.4286,
        "games": 28
      },
      {
        "opponentId": "dual_green_gold",
        "winRate": 0.4286,
        "games": 28
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.4583,
        "games": 24
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
    "overallWinRate": 0.6584,
    "ci95HalfWidth": 0.027,
    "matchesPlayed": 1168,
    "vsFormatWinRates": {
      "monocolor": 0.7453,
      "bicolor": 0.6225,
      "tricolor": 0.5766,
      "pentachromatic": 0.631
    },
    "bestMatchups": [
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.8929,
        "games": 28
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.875,
        "games": 24
      },
      {
        "opponentId": "dual_blue_gold",
        "winRate": 0.8571,
        "games": 28
      },
      {
        "opponentId": "mono_gold_judgment",
        "winRate": 0.8214,
        "games": 28
      },
      {
        "opponentId": "dual_blue_purple",
        "winRate": 0.8214,
        "games": 28
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.2917,
        "games": 24
      },
      {
        "opponentId": "tri_purple_green_gold",
        "winRate": 0.3929,
        "games": 28
      },
      {
        "opponentId": "dual_red_gold",
        "winRate": 0.4583,
        "games": 24
      },
      {
        "opponentId": "dual_green_gold",
        "winRate": 0.4643,
        "games": 28
      },
      {
        "opponentId": "penta_prismatic_crater",
        "winRate": 0.5,
        "games": 28
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
    "overallWinRate": 0.6413,
    "ci95HalfWidth": 0.0279,
    "matchesPlayed": 1168,
    "vsFormatWinRates": {
      "monocolor": 0.7617,
      "bicolor": 0.5599,
      "tricolor": 0.5772,
      "pentachromatic": 0.6071
    },
    "bestMatchups": [
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.9167,
        "games": 24
      },
      {
        "opponentId": "mono_red_dragon",
        "winRate": 0.8929,
        "games": 28
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.8571,
        "games": 28
      },
      {
        "opponentId": "mono_purple_crypt",
        "winRate": 0.8333,
        "games": 24
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.8333,
        "games": 24
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.2917,
        "games": 24
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.3333,
        "games": 24
      },
      {
        "opponentId": "dual_green_neutral",
        "winRate": 0.4167,
        "games": 24
      },
      {
        "opponentId": "dual_purple_gold",
        "winRate": 0.4286,
        "games": 28
      },
      {
        "opponentId": "dual_red_purple",
        "winRate": 0.4286,
        "games": 28
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
    "overallWinRate": 0.6173,
    "ci95HalfWidth": 0.0284,
    "matchesPlayed": 1168,
    "vsFormatWinRates": {
      "monocolor": 0.7383,
      "bicolor": 0.5885,
      "tricolor": 0.4853,
      "pentachromatic": 0.5595
    },
    "bestMatchups": [
      {
        "opponentId": "mono_purple_umbral",
        "winRate": 0.875,
        "games": 24
      },
      {
        "opponentId": "tri_blue_purple_green",
        "winRate": 0.8571,
        "games": 28
      },
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.8333,
        "games": 24
      },
      {
        "opponentId": "mono_purple_crypt",
        "winRate": 0.8333,
        "games": 24
      },
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.8214,
        "games": 28
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.2917,
        "games": 24
      },
      {
        "opponentId": "tri_red_green_gold",
        "winRate": 0.3214,
        "games": 28
      },
      {
        "opponentId": "tri_blue_green_gold",
        "winRate": 0.3929,
        "games": 28
      },
      {
        "opponentId": "tri_red_blue_purple",
        "winRate": 0.4286,
        "games": 28
      },
      {
        "opponentId": "dual_purple_gold",
        "winRate": 0.4286,
        "games": 28
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
    "coverCardId": "red_173_general_roda_chama",
    "classicDeckIds": [
      "deck_dual_primal_fury"
    ],
    "tierBadge": "S",
    "overallWinRate": 0.6142,
    "ci95HalfWidth": 0.0279,
    "matchesPlayed": 1208,
    "vsFormatWinRates": {
      "monocolor": 0.7366,
      "bicolor": 0.551,
      "tricolor": 0.4965,
      "pentachromatic": 0.6548
    },
    "bestMatchups": [
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.9286,
        "games": 28
      },
      {
        "opponentId": "mono_gold_celestial",
        "winRate": 0.8571,
        "games": 28
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.8214,
        "games": 28
      },
      {
        "opponentId": "mono_purple_umbral",
        "winRate": 0.8214,
        "games": 28
      },
      {
        "opponentId": "mono_gold_judgment",
        "winRate": 0.8214,
        "games": 28
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_blue_green",
        "winRate": 0.3214,
        "games": 28
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.3214,
        "games": 28
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.3571,
        "games": 28
      },
      {
        "opponentId": "dual_blue_green",
        "winRate": 0.3929,
        "games": 28
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.4286,
        "games": 28
      }
    ]
  },
  {
    "rank": 8,
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
    "overallWinRate": 0.6118,
    "ci95HalfWidth": 0.0286,
    "matchesPlayed": 1208,
    "vsFormatWinRates": {
      "monocolor": 0.7366,
      "bicolor": 0.5571,
      "tricolor": 0.5117,
      "pentachromatic": 0.5238
    },
    "bestMatchups": [
      {
        "opponentId": "mono_gold_judgment",
        "winRate": 0.8929,
        "games": 28
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.8214,
        "games": 28
      },
      {
        "opponentId": "mono_blue_frost",
        "winRate": 0.8214,
        "games": 28
      },
      {
        "opponentId": "mono_purple_crypt",
        "winRate": 0.8214,
        "games": 28
      },
      {
        "opponentId": "mono_gold_phalanx",
        "winRate": 0.8214,
        "games": 28
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.1429,
        "games": 28
      },
      {
        "opponentId": "penta_prismatic_crater",
        "winRate": 0.4286,
        "games": 28
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.4286,
        "games": 28
      },
      {
        "opponentId": "tri_red_green_gold",
        "winRate": 0.4286,
        "games": 28
      },
      {
        "opponentId": "dual_gold_neutral",
        "winRate": 0.4286,
        "games": 28
      }
    ]
  },
  {
    "rank": 9,
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
    "overallWinRate": 0.6118,
    "ci95HalfWidth": 0.0287,
    "matchesPlayed": 1208,
    "vsFormatWinRates": {
      "monocolor": 0.7299,
      "bicolor": 0.5429,
      "tricolor": 0.5176,
      "pentachromatic": 0.6607
    },
    "bestMatchups": [
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.9643,
        "games": 28
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.9286,
        "games": 28
      },
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.8571,
        "games": 28
      },
      {
        "opponentId": "dual_blue_purple",
        "winRate": 0.8214,
        "games": 28
      },
      {
        "opponentId": "mono_blue_frost",
        "winRate": 0.7857,
        "games": 28
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.1071,
        "games": 28
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.3214,
        "games": 28
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.3571,
        "games": 28
      },
      {
        "opponentId": "dual_blue_neutral",
        "winRate": 0.3929,
        "games": 28
      },
      {
        "opponentId": "dual_blue_green",
        "winRate": 0.3929,
        "games": 28
      }
    ]
  },
  {
    "rank": 10,
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
    "overallWinRate": 0.6002,
    "ci95HalfWidth": 0.0286,
    "matchesPlayed": 1208,
    "vsFormatWinRates": {
      "monocolor": 0.7254,
      "bicolor": 0.5357,
      "tricolor": 0.5078,
      "pentachromatic": 0.5357
    },
    "bestMatchups": [
      {
        "opponentId": "mono_purple_crypt",
        "winRate": 0.8929,
        "games": 28
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.8571,
        "games": 28
      },
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.8571,
        "games": 28
      },
      {
        "opponentId": "mono_gold_judgment",
        "winRate": 0.8571,
        "games": 28
      },
      {
        "opponentId": "dual_purple_neutral",
        "winRate": 0.8571,
        "games": 28
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.2143,
        "games": 28
      },
      {
        "opponentId": "dual_gold_neutral",
        "winRate": 0.2857,
        "games": 28
      },
      {
        "opponentId": "dual_blue_green",
        "winRate": 0.3571,
        "games": 28
      },
      {
        "opponentId": "dual_purple_gold",
        "winRate": 0.3929,
        "games": 28
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.4286,
        "games": 28
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
    "coverCardId": "gold_173_general_roda_sol",
    "classicDeckIds": [],
    "tierBadge": "S",
    "overallWinRate": 0.5969,
    "ci95HalfWidth": 0.0281,
    "matchesPlayed": 1208,
    "vsFormatWinRates": {
      "monocolor": 0.75,
      "bicolor": 0.5102,
      "tricolor": 0.5176,
      "pentachromatic": 0.4524
    },
    "bestMatchups": [
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.8929,
        "games": 28
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.8929,
        "games": 28
      },
      {
        "opponentId": "mono_green_swarm",
        "winRate": 0.8571,
        "games": 28
      },
      {
        "opponentId": "mono_purple_crypt",
        "winRate": 0.8571,
        "games": 28
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.8214,
        "games": 28
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "dual_green_neutral",
        "winRate": 0.2857,
        "games": 28
      },
      {
        "opponentId": "tri_blue_purple_gold",
        "winRate": 0.3125,
        "games": 32
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.3214,
        "games": 28
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.3214,
        "games": 28
      },
      {
        "opponentId": "penta_prismatic_crater",
        "winRate": 0.3929,
        "games": 28
      }
    ]
  },
  {
    "rank": 12,
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
    "overallWinRate": 0.5886,
    "ci95HalfWidth": 0.0282,
    "matchesPlayed": 1208,
    "vsFormatWinRates": {
      "monocolor": 0.7344,
      "bicolor": 0.5434,
      "tricolor": 0.4648,
      "pentachromatic": 0.4405
    },
    "bestMatchups": [
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.9286,
        "games": 28
      },
      {
        "opponentId": "mono_purple_crypt",
        "winRate": 0.8571,
        "games": 28
      },
      {
        "opponentId": "mono_green_swarm",
        "winRate": 0.7857,
        "games": 28
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.7857,
        "games": 28
      },
      {
        "opponentId": "mono_blue_frost",
        "winRate": 0.7857,
        "games": 28
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_purple_green_gold",
        "winRate": 0.3214,
        "games": 28
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.3571,
        "games": 28
      },
      {
        "opponentId": "penta_prismatic_crater",
        "winRate": 0.3929,
        "games": 28
      },
      {
        "opponentId": "tri_red_blue_green",
        "winRate": 0.3929,
        "games": 28
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.3929,
        "games": 28
      }
    ]
  },
  {
    "rank": 13,
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
    "overallWinRate": 0.5877,
    "ci95HalfWidth": 0.0287,
    "matchesPlayed": 1208,
    "vsFormatWinRates": {
      "monocolor": 0.721,
      "bicolor": 0.5179,
      "tricolor": 0.4824,
      "pentachromatic": 0.5595
    },
    "bestMatchups": [
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.8929,
        "games": 28
      },
      {
        "opponentId": "mono_gold_judgment",
        "winRate": 0.8929,
        "games": 28
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.8571,
        "games": 28
      },
      {
        "opponentId": "mono_purple_umbral",
        "winRate": 0.8571,
        "games": 28
      },
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.8214,
        "games": 28
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.1786,
        "games": 28
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.25,
        "games": 28
      },
      {
        "opponentId": "dual_red_purple",
        "winRate": 0.3214,
        "games": 28
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.3571,
        "games": 28
      },
      {
        "opponentId": "dual_red_blue",
        "winRate": 0.3571,
        "games": 28
      }
    ]
  },
  {
    "rank": 14,
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
    "tierBadge": "S",
    "overallWinRate": 0.5836,
    "ci95HalfWidth": 0.0284,
    "matchesPlayed": 1208,
    "vsFormatWinRates": {
      "monocolor": 0.7143,
      "bicolor": 0.523,
      "tricolor": 0.4542,
      "pentachromatic": 0.6071
    },
    "bestMatchups": [
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.8929,
        "games": 28
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.8929,
        "games": 28
      },
      {
        "opponentId": "mono_blue_frost",
        "winRate": 0.8571,
        "games": 28
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.8214,
        "games": 28
      },
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.8214,
        "games": 28
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.1786,
        "games": 28
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.2857,
        "games": 28
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.3214,
        "games": 28
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.3214,
        "games": 28
      },
      {
        "opponentId": "dual_purple_gold",
        "winRate": 0.3929,
        "games": 28
      }
    ]
  },
  {
    "rank": 15,
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
    "overallWinRate": 0.577,
    "ci95HalfWidth": 0.0294,
    "matchesPlayed": 1208,
    "vsFormatWinRates": {
      "monocolor": 0.7366,
      "bicolor": 0.4929,
      "tricolor": 0.4688,
      "pentachromatic": 0.4762
    },
    "bestMatchups": [
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.9286,
        "games": 28
      },
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.8571,
        "games": 28
      },
      {
        "opponentId": "mono_gold_phalanx",
        "winRate": 0.8571,
        "games": 28
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.7857,
        "games": 28
      },
      {
        "opponentId": "mono_blue_frost",
        "winRate": 0.7857,
        "games": 28
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.1786,
        "games": 28
      },
      {
        "opponentId": "dual_red_gold",
        "winRate": 0.3214,
        "games": 28
      },
      {
        "opponentId": "tri_blue_green_gold",
        "winRate": 0.3571,
        "games": 28
      },
      {
        "opponentId": "tri_purple_green_gold",
        "winRate": 0.3929,
        "games": 28
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.3929,
        "games": 28
      }
    ]
  },
  {
    "rank": 16,
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
    "overallWinRate": 0.5687,
    "ci95HalfWidth": 0.0279,
    "matchesPlayed": 1208,
    "vsFormatWinRates": {
      "monocolor": 0.683,
      "bicolor": 0.5167,
      "tricolor": 0.4609,
      "pentachromatic": 0.5476
    },
    "bestMatchups": [
      {
        "opponentId": "mono_gold_judgment",
        "winRate": 0.8214,
        "games": 28
      },
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.7857,
        "games": 28
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.7857,
        "games": 28
      },
      {
        "opponentId": "mono_gold_phalanx",
        "winRate": 0.7857,
        "games": 28
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.75,
        "games": 28
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.2143,
        "games": 28
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.25,
        "games": 28
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.3214,
        "games": 28
      },
      {
        "opponentId": "penta_prismatic_crater",
        "winRate": 0.3929,
        "games": 28
      },
      {
        "opponentId": "dual_red_blue",
        "winRate": 0.3929,
        "games": 28
      }
    ]
  },
  {
    "rank": 17,
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
    "tierBadge": "S",
    "overallWinRate": 0.5654,
    "ci95HalfWidth": 0.0289,
    "matchesPlayed": 1208,
    "vsFormatWinRates": {
      "monocolor": 0.6741,
      "bicolor": 0.5153,
      "tricolor": 0.493,
      "pentachromatic": 0.4643
    },
    "bestMatchups": [
      {
        "opponentId": "dual_purple_neutral",
        "winRate": 0.9286,
        "games": 28
      },
      {
        "opponentId": "mono_purple_crypt",
        "winRate": 0.8929,
        "games": 28
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.8571,
        "games": 28
      },
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.7857,
        "games": 28
      },
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.75,
        "games": 28
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "dual_blue_neutral",
        "winRate": 0.2857,
        "games": 28
      },
      {
        "opponentId": "penta_prismatic_crater",
        "winRate": 0.3214,
        "games": 28
      },
      {
        "opponentId": "tri_purple_green_gold",
        "winRate": 0.3214,
        "games": 28
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.3571,
        "games": 28
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.3929,
        "games": 28
      }
    ]
  },
  {
    "rank": 18,
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
    "overallWinRate": 0.5509,
    "ci95HalfWidth": 0.028,
    "matchesPlayed": 1376,
    "vsFormatWinRates": {
      "monocolor": 0.6816,
      "bicolor": 0.4979,
      "tricolor": 0.4375,
      "pentachromatic": 0.4583
    },
    "bestMatchups": [
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.9688,
        "games": 32
      },
      {
        "opponentId": "mono_blue_frost",
        "winRate": 0.9063,
        "games": 32
      },
      {
        "opponentId": "mono_gold_judgment",
        "winRate": 0.8438,
        "games": 32
      },
      {
        "opponentId": "mono_purple_umbral",
        "winRate": 0.7813,
        "games": 32
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.75,
        "games": 32
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.25,
        "games": 32
      },
      {
        "opponentId": "penta_wheel_convergence",
        "winRate": 0.2813,
        "games": 32
      },
      {
        "opponentId": "tri_purple_green_gold",
        "winRate": 0.3125,
        "games": 32
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.3125,
        "games": 32
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.3438,
        "games": 32
      }
    ]
  },
  {
    "rank": 19,
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
    "tierBadge": "A",
    "overallWinRate": 0.5488,
    "ci95HalfWidth": 0.0283,
    "matchesPlayed": 1208,
    "vsFormatWinRates": {
      "monocolor": 0.7009,
      "bicolor": 0.4847,
      "tricolor": 0.4155,
      "pentachromatic": 0.4881
    },
    "bestMatchups": [
      {
        "opponentId": "mono_purple_umbral",
        "winRate": 0.8571,
        "games": 28
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.8214,
        "games": 28
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.8214,
        "games": 28
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.8214,
        "games": 28
      },
      {
        "opponentId": "mono_green_swarm",
        "winRate": 0.7857,
        "games": 28
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.1429,
        "games": 28
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.25,
        "games": 28
      },
      {
        "opponentId": "dual_red_gold",
        "winRate": 0.25,
        "games": 28
      },
      {
        "opponentId": "tri_red_green_gold",
        "winRate": 0.2857,
        "games": 28
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.3571,
        "games": 28
      }
    ]
  },
  {
    "rank": 20,
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
    "overallWinRate": 0.5406,
    "ci95HalfWidth": 0.029,
    "matchesPlayed": 1208,
    "vsFormatWinRates": {
      "monocolor": 0.6652,
      "bicolor": 0.4974,
      "tricolor": 0.4401,
      "pentachromatic": 0.4167
    },
    "bestMatchups": [
      {
        "opponentId": "mono_blue_chrono",
        "winRate": 0.9286,
        "games": 28
      },
      {
        "opponentId": "mono_gold_celestial",
        "winRate": 0.8214,
        "games": 28
      },
      {
        "opponentId": "mono_red_dragon",
        "winRate": 0.7857,
        "games": 28
      },
      {
        "opponentId": "mono_blue_frost",
        "winRate": 0.7857,
        "games": 28
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.7857,
        "games": 28
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_purple_green_gold",
        "winRate": 0.2143,
        "games": 28
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.3214,
        "games": 28
      },
      {
        "opponentId": "dual_gold_neutral",
        "winRate": 0.3214,
        "games": 28
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.3571,
        "games": 28
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.3571,
        "games": 28
      }
    ]
  },
  {
    "rank": 21,
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
    "tierBadge": "A",
    "overallWinRate": 0.5257,
    "ci95HalfWidth": 0.0296,
    "matchesPlayed": 1208,
    "vsFormatWinRates": {
      "monocolor": 0.6295,
      "bicolor": 0.4881,
      "tricolor": 0.4472,
      "pentachromatic": 0.375
    },
    "bestMatchups": [
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.8214,
        "games": 28
      },
      {
        "opponentId": "mono_purple_umbral",
        "winRate": 0.8214,
        "games": 28
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.7857,
        "games": 28
      },
      {
        "opponentId": "mono_purple_crypt",
        "winRate": 0.7857,
        "games": 28
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.75,
        "games": 28
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.1786,
        "games": 28
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.3214,
        "games": 28
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.3214,
        "games": 28
      },
      {
        "opponentId": "tri_blue_green_gold",
        "winRate": 0.3214,
        "games": 28
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.3214,
        "games": 28
      }
    ]
  },
  {
    "rank": 22,
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
    "tierBadge": "A",
    "overallWinRate": 0.5141,
    "ci95HalfWidth": 0.0286,
    "matchesPlayed": 1208,
    "vsFormatWinRates": {
      "monocolor": 0.6406,
      "bicolor": 0.4476,
      "tricolor": 0.4225,
      "pentachromatic": 0.4643
    },
    "bestMatchups": [
      {
        "opponentId": "mono_gold_judgment",
        "winRate": 0.8571,
        "games": 28
      },
      {
        "opponentId": "mono_purple_crypt",
        "winRate": 0.8214,
        "games": 28
      },
      {
        "opponentId": "mono_gold_phalanx",
        "winRate": 0.8214,
        "games": 28
      },
      {
        "opponentId": "tri_blue_purple_gold",
        "winRate": 0.7188,
        "games": 32
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.6786,
        "games": 28
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.1786,
        "games": 28
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.25,
        "games": 28
      },
      {
        "opponentId": "penta_prismatic_crater",
        "winRate": 0.2857,
        "games": 28
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.2857,
        "games": 28
      },
      {
        "opponentId": "dual_red_green",
        "winRate": 0.2857,
        "games": 28
      }
    ]
  },
  {
    "rank": 23,
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
    "overallWinRate": 0.5124,
    "ci95HalfWidth": 0.0285,
    "matchesPlayed": 1208,
    "vsFormatWinRates": {
      "monocolor": 0.6384,
      "bicolor": 0.4209,
      "tricolor": 0.4577,
      "pentachromatic": 0.4524
    },
    "bestMatchups": [
      {
        "opponentId": "mono_red_dragon",
        "winRate": 0.75,
        "games": 28
      },
      {
        "opponentId": "mono_blue_frost",
        "winRate": 0.75,
        "games": 28
      },
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.75,
        "games": 28
      },
      {
        "opponentId": "mono_purple_crypt",
        "winRate": 0.75,
        "games": 28
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.75,
        "games": 28
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "dual_blue_neutral",
        "winRate": 0.1786,
        "games": 28
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.2143,
        "games": 28
      },
      {
        "opponentId": "dual_green_neutral",
        "winRate": 0.25,
        "games": 28
      },
      {
        "opponentId": "dual_red_gold",
        "winRate": 0.2857,
        "games": 28
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.3571,
        "games": 28
      }
    ]
  },
  {
    "rank": 24,
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
    "overallWinRate": 0.5099,
    "ci95HalfWidth": 0.0282,
    "matchesPlayed": 1208,
    "vsFormatWinRates": {
      "monocolor": 0.6119,
      "bicolor": 0.4714,
      "tricolor": 0.4472,
      "pentachromatic": 0.4048
    },
    "bestMatchups": [
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.8214,
        "games": 28
      },
      {
        "opponentId": "mono_red_dragon",
        "winRate": 0.7857,
        "games": 28
      },
      {
        "opponentId": "mono_blue_chrono",
        "winRate": 0.7143,
        "games": 28
      },
      {
        "opponentId": "mono_purple_umbral",
        "winRate": 0.7143,
        "games": 28
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.6786,
        "games": 28
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "dual_green_gold",
        "winRate": 0.2857,
        "games": 28
      },
      {
        "opponentId": "penta_wheel_convergence",
        "winRate": 0.3214,
        "games": 28
      },
      {
        "opponentId": "penta_prismatic_crater",
        "winRate": 0.3214,
        "games": 28
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.3214,
        "games": 28
      },
      {
        "opponentId": "tri_purple_green_gold",
        "winRate": 0.3571,
        "games": 28
      }
    ]
  },
  {
    "rank": 25,
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
    "overallWinRate": 0.4925,
    "ci95HalfWidth": 0.0293,
    "matchesPlayed": 1208,
    "vsFormatWinRates": {
      "monocolor": 0.6696,
      "bicolor": 0.3699,
      "tricolor": 0.4155,
      "pentachromatic": 0.381
    },
    "bestMatchups": [
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.9286,
        "games": 28
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.8571,
        "games": 28
      },
      {
        "opponentId": "mono_red_dragon",
        "winRate": 0.7857,
        "games": 28
      },
      {
        "opponentId": "mono_purple_crypt",
        "winRate": 0.75,
        "games": 28
      },
      {
        "opponentId": "mono_green_swarm",
        "winRate": 0.7143,
        "games": 28
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "dual_red_green",
        "winRate": 0.2143,
        "games": 28
      },
      {
        "opponentId": "dual_red_gold",
        "winRate": 0.2143,
        "games": 28
      },
      {
        "opponentId": "tri_red_blue_green",
        "winRate": 0.2857,
        "games": 28
      },
      {
        "opponentId": "tri_red_green_gold",
        "winRate": 0.2857,
        "games": 28
      },
      {
        "opponentId": "dual_gold_neutral",
        "winRate": 0.2857,
        "games": 28
      }
    ]
  },
  {
    "rank": 26,
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
    "overallWinRate": 0.4868,
    "ci95HalfWidth": 0.0291,
    "matchesPlayed": 1208,
    "vsFormatWinRates": {
      "monocolor": 0.6317,
      "bicolor": 0.4262,
      "tricolor": 0.3711,
      "pentachromatic": 0.369
    },
    "bestMatchups": [
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.7143,
        "games": 28
      },
      {
        "opponentId": "mono_gold_phalanx",
        "winRate": 0.7143,
        "games": 28
      },
      {
        "opponentId": "mono_green_swarm",
        "winRate": 0.6786,
        "games": 28
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.6786,
        "games": 28
      },
      {
        "opponentId": "mono_purple_umbral",
        "winRate": 0.6786,
        "games": 28
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "dual_green_neutral",
        "winRate": 0.1429,
        "games": 28
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.2143,
        "games": 28
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.25,
        "games": 28
      },
      {
        "opponentId": "penta_free_city_sovereign",
        "winRate": 0.2857,
        "games": 28
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.2857,
        "games": 28
      }
    ]
  },
  {
    "rank": 27,
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
    "overallWinRate": 0.476,
    "ci95HalfWidth": 0.0288,
    "matchesPlayed": 1208,
    "vsFormatWinRates": {
      "monocolor": 0.5781,
      "bicolor": 0.4333,
      "tricolor": 0.3828,
      "pentachromatic": 0.4286
    },
    "bestMatchups": [
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.8571,
        "games": 28
      },
      {
        "opponentId": "mono_green_swarm",
        "winRate": 0.7857,
        "games": 28
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.75,
        "games": 28
      },
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.7143,
        "games": 28
      },
      {
        "opponentId": "mono_red_dragon",
        "winRate": 0.6786,
        "games": 28
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.1429,
        "games": 28
      },
      {
        "opponentId": "dual_red_green",
        "winRate": 0.2143,
        "games": 28
      },
      {
        "opponentId": "tri_red_blue_green",
        "winRate": 0.2857,
        "games": 28
      },
      {
        "opponentId": "penta_prismatic_crater",
        "winRate": 0.3214,
        "games": 28
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.3214,
        "games": 28
      }
    ]
  },
  {
    "rank": 28,
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
    "overallWinRate": 0.4487,
    "ci95HalfWidth": 0.0288,
    "matchesPlayed": 1208,
    "vsFormatWinRates": {
      "monocolor": 0.5804,
      "bicolor": 0.3852,
      "tricolor": 0.3556,
      "pentachromatic": 0.3571
    },
    "bestMatchups": [
      {
        "opponentId": "mono_gold_judgment",
        "winRate": 0.7857,
        "games": 28
      },
      {
        "opponentId": "mono_gold_phalanx",
        "winRate": 0.75,
        "games": 28
      },
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.7143,
        "games": 28
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.6429,
        "games": 28
      },
      {
        "opponentId": "mono_blue_frost",
        "winRate": 0.6429,
        "games": 28
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.1071,
        "games": 28
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.1071,
        "games": 28
      },
      {
        "opponentId": "penta_prismatic_crater",
        "winRate": 0.1786,
        "games": 28
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.1786,
        "games": 28
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.25,
        "games": 28
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
    "tierBadge": "B",
    "overallWinRate": 0.4396,
    "ci95HalfWidth": 0.0293,
    "matchesPlayed": 1208,
    "vsFormatWinRates": {
      "monocolor": 0.5381,
      "bicolor": 0.3595,
      "tricolor": 0.4014,
      "pentachromatic": 0.4762
    },
    "bestMatchups": [
      {
        "opponentId": "mono_gold_judgment",
        "winRate": 0.8571,
        "games": 28
      },
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.75,
        "games": 28
      },
      {
        "opponentId": "mono_gold_phalanx",
        "winRate": 0.75,
        "games": 28
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.6786,
        "games": 28
      },
      {
        "opponentId": "mono_blue_frost",
        "winRate": 0.6786,
        "games": 28
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "dual_red_purple",
        "winRate": 0.0714,
        "games": 28
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.1071,
        "games": 28
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.1071,
        "games": 28
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.2143,
        "games": 28
      },
      {
        "opponentId": "dual_blue_neutral",
        "winRate": 0.25,
        "games": 28
      }
    ]
  },
  {
    "rank": 30,
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
    "overallWinRate": 0.4329,
    "ci95HalfWidth": 0.0293,
    "matchesPlayed": 1208,
    "vsFormatWinRates": {
      "monocolor": 0.5738,
      "bicolor": 0.3405,
      "tricolor": 0.3592,
      "pentachromatic": 0.4405
    },
    "bestMatchups": [
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.8571,
        "games": 28
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.7857,
        "games": 28
      },
      {
        "opponentId": "mono_purple_umbral",
        "winRate": 0.6429,
        "games": 28
      },
      {
        "opponentId": "tri_red_blue_purple",
        "winRate": 0.6429,
        "games": 28
      },
      {
        "opponentId": "mono_red_blitz",
        "winRate": 0.6071,
        "games": 28
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.1786,
        "games": 28
      },
      {
        "opponentId": "dual_red_gold",
        "winRate": 0.1786,
        "games": 28
      },
      {
        "opponentId": "tri_purple_green_gold",
        "winRate": 0.2143,
        "games": 28
      },
      {
        "opponentId": "dual_blue_neutral",
        "winRate": 0.2143,
        "games": 28
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.2143,
        "games": 28
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
    "overallWinRate": 0.4305,
    "ci95HalfWidth": 0.0292,
    "matchesPlayed": 1208,
    "vsFormatWinRates": {
      "monocolor": 0.567,
      "bicolor": 0.3393,
      "tricolor": 0.3451,
      "pentachromatic": 0.4167
    },
    "bestMatchups": [
      {
        "opponentId": "mono_blue_frost",
        "winRate": 0.7857,
        "games": 28
      },
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.7857,
        "games": 28
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.7143,
        "games": 28
      },
      {
        "opponentId": "mono_purple_umbral",
        "winRate": 0.6786,
        "games": 28
      },
      {
        "opponentId": "mono_gold_judgment",
        "winRate": 0.6786,
        "games": 28
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "dual_green_gold",
        "winRate": 0.0714,
        "games": 28
      },
      {
        "opponentId": "tri_red_green_gold",
        "winRate": 0.1429,
        "games": 28
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.1786,
        "games": 28
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.1786,
        "games": 28
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.25,
        "games": 28
      }
    ]
  },
  {
    "rank": 32,
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
    "overallWinRate": 0.4214,
    "ci95HalfWidth": 0.0294,
    "matchesPlayed": 1208,
    "vsFormatWinRates": {
      "monocolor": 0.6238,
      "bicolor": 0.3262,
      "tricolor": 0.2923,
      "pentachromatic": 0.3214
    },
    "bestMatchups": [
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.75,
        "games": 28
      },
      {
        "opponentId": "mono_red_dragon",
        "winRate": 0.75,
        "games": 28
      },
      {
        "opponentId": "mono_purple_crypt",
        "winRate": 0.75,
        "games": 28
      },
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.7143,
        "games": 28
      },
      {
        "opponentId": "mono_blue_frost",
        "winRate": 0.7143,
        "games": 28
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.1071,
        "games": 28
      },
      {
        "opponentId": "dual_red_green",
        "winRate": 0.1429,
        "games": 28
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.1786,
        "games": 28
      },
      {
        "opponentId": "dual_red_purple",
        "winRate": 0.1786,
        "games": 28
      },
      {
        "opponentId": "dual_red_gold",
        "winRate": 0.1786,
        "games": 28
      }
    ]
  },
  {
    "rank": 33,
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
    "overallWinRate": 0.4056,
    "ci95HalfWidth": 0.0281,
    "matchesPlayed": 1208,
    "vsFormatWinRates": {
      "monocolor": 0.5381,
      "bicolor": 0.3333,
      "tricolor": 0.3204,
      "pentachromatic": 0.3929
    },
    "bestMatchups": [
      {
        "opponentId": "mono_blue_chrono",
        "winRate": 0.6786,
        "games": 28
      },
      {
        "opponentId": "mono_red_dragon",
        "winRate": 0.6429,
        "games": 28
      },
      {
        "opponentId": "mono_purple_crypt",
        "winRate": 0.6071,
        "games": 28
      },
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.5714,
        "games": 28
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.5714,
        "games": 28
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "dual_gold_neutral",
        "winRate": 0.1429,
        "games": 28
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.1786,
        "games": 28
      },
      {
        "opponentId": "tri_red_blue_purple",
        "winRate": 0.2143,
        "games": 28
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.2143,
        "games": 28
      },
      {
        "opponentId": "dual_purple_gold",
        "winRate": 0.2143,
        "games": 28
      }
    ]
  },
  {
    "rank": 34,
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
    "overallWinRate": 0.4007,
    "ci95HalfWidth": 0.0291,
    "matchesPlayed": 1208,
    "vsFormatWinRates": {
      "monocolor": 0.5405,
      "bicolor": 0.3571,
      "tricolor": 0.2711,
      "pentachromatic": 0.3571
    },
    "bestMatchups": [
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.7143,
        "games": 28
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.7143,
        "games": 28
      },
      {
        "opponentId": "mono_blue_frost",
        "winRate": 0.6786,
        "games": 28
      },
      {
        "opponentId": "mono_purple_crypt",
        "winRate": 0.6786,
        "games": 28
      },
      {
        "opponentId": "mono_green_swarm",
        "winRate": 0.6071,
        "games": 28
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_blue_green",
        "winRate": 0.1429,
        "games": 28
      },
      {
        "opponentId": "penta_wheel_convergence",
        "winRate": 0.1786,
        "games": 28
      },
      {
        "opponentId": "tri_purple_green_gold",
        "winRate": 0.1786,
        "games": 28
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.1786,
        "games": 28
      },
      {
        "opponentId": "tri_blue_green_gold",
        "winRate": 0.2143,
        "games": 28
      }
    ]
  },
  {
    "rank": 35,
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
    "overallWinRate": 0.3659,
    "ci95HalfWidth": 0.0279,
    "matchesPlayed": 1208,
    "vsFormatWinRates": {
      "monocolor": 0.4619,
      "bicolor": 0.3,
      "tricolor": 0.2958,
      "pentachromatic": 0.4524
    },
    "bestMatchups": [
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.5714,
        "games": 28
      },
      {
        "opponentId": "mono_purple_crypt",
        "winRate": 0.5714,
        "games": 28
      },
      {
        "opponentId": "mono_purple_umbral",
        "winRate": 0.5714,
        "games": 28
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.5357,
        "games": 28
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.5357,
        "games": 28
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "dual_red_gold",
        "winRate": 0.1071,
        "games": 28
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.1429,
        "games": 28
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.2143,
        "games": 28
      },
      {
        "opponentId": "tri_red_green_gold",
        "winRate": 0.2143,
        "games": 28
      },
      {
        "opponentId": "dual_red_purple",
        "winRate": 0.2143,
        "games": 28
      }
    ]
  },
  {
    "rank": 36,
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
    "overallWinRate": 0.3622,
    "ci95HalfWidth": 0.0284,
    "matchesPlayed": 1168,
    "vsFormatWinRates": {
      "monocolor": 0.4876,
      "bicolor": 0.2966,
      "tricolor": 0.3051,
      "pentachromatic": 0.2619
    },
    "bestMatchups": [
      {
        "opponentId": "mono_blue_frost",
        "winRate": 0.7143,
        "games": 28
      },
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.6667,
        "games": 24
      },
      {
        "opponentId": "mono_blue_chrono",
        "winRate": 0.6071,
        "games": 28
      },
      {
        "opponentId": "mono_gold_judgment",
        "winRate": 0.6071,
        "games": 28
      },
      {
        "opponentId": "mono_green_swarm",
        "winRate": 0.5357,
        "games": 28
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.125,
        "games": 24
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.125,
        "games": 24
      },
      {
        "opponentId": "dual_green_neutral",
        "winRate": 0.125,
        "games": 24
      },
      {
        "opponentId": "dual_blue_green",
        "winRate": 0.1429,
        "games": 28
      },
      {
        "opponentId": "dual_blue_gold",
        "winRate": 0.1429,
        "games": 28
      }
    ]
  },
  {
    "rank": 37,
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
    "overallWinRate": 0.3609,
    "ci95HalfWidth": 0.0288,
    "matchesPlayed": 1208,
    "vsFormatWinRates": {
      "monocolor": 0.5071,
      "bicolor": 0.3214,
      "tricolor": 0.1901,
      "pentachromatic": 0.4048
    },
    "bestMatchups": [
      {
        "opponentId": "mono_blue_chrono",
        "winRate": 0.75,
        "games": 28
      },
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.6429,
        "games": 28
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.6429,
        "games": 28
      },
      {
        "opponentId": "mono_red_blitz",
        "winRate": 0.6071,
        "games": 28
      },
      {
        "opponentId": "dual_blue_green",
        "winRate": 0.6071,
        "games": 28
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_blue_purple_gold",
        "winRate": 0.0313,
        "games": 32
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.0357,
        "games": 28
      },
      {
        "opponentId": "tri_red_blue_purple",
        "winRate": 0.1429,
        "games": 28
      },
      {
        "opponentId": "dual_red_gold",
        "winRate": 0.1429,
        "games": 28
      },
      {
        "opponentId": "tri_purple_green_gold",
        "winRate": 0.1786,
        "games": 28
      }
    ]
  },
  {
    "rank": 38,
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
    "overallWinRate": 0.3377,
    "ci95HalfWidth": 0.0278,
    "matchesPlayed": 1208,
    "vsFormatWinRates": {
      "monocolor": 0.4667,
      "bicolor": 0.2738,
      "tricolor": 0.2465,
      "pentachromatic": 0.3214
    },
    "bestMatchups": [
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.6429,
        "games": 28
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.6429,
        "games": 28
      },
      {
        "opponentId": "mono_blue_frost",
        "winRate": 0.6071,
        "games": 28
      },
      {
        "opponentId": "mono_blue_chrono",
        "winRate": 0.5357,
        "games": 28
      },
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.5,
        "games": 28
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.0714,
        "games": 28
      },
      {
        "opponentId": "tri_red_blue_green",
        "winRate": 0.0714,
        "games": 28
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.1071,
        "games": 28
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.1071,
        "games": 28
      },
      {
        "opponentId": "dual_blue_neutral",
        "winRate": 0.1071,
        "games": 28
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
    "overallWinRate": 0.3361,
    "ci95HalfWidth": 0.0276,
    "matchesPlayed": 1208,
    "vsFormatWinRates": {
      "monocolor": 0.4857,
      "bicolor": 0.2762,
      "tricolor": 0.2324,
      "pentachromatic": 0.2381
    },
    "bestMatchups": [
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.6786,
        "games": 28
      },
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.6429,
        "games": 28
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.6429,
        "games": 28
      },
      {
        "opponentId": "mono_red_dragon",
        "winRate": 0.6071,
        "games": 28
      },
      {
        "opponentId": "mono_purple_crypt",
        "winRate": 0.6071,
        "games": 28
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_purple_green_gold",
        "winRate": 0.1071,
        "games": 28
      },
      {
        "opponentId": "dual_blue_green",
        "winRate": 0.1071,
        "games": 28
      },
      {
        "opponentId": "penta_wheel_convergence",
        "winRate": 0.1429,
        "games": 28
      },
      {
        "opponentId": "tri_red_green_gold",
        "winRate": 0.1429,
        "games": 28
      },
      {
        "opponentId": "mono_blue_chrono",
        "winRate": 0.1429,
        "games": 28
      }
    ]
  },
  {
    "rank": 40,
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
    "tierBadge": "B",
    "overallWinRate": 0.3303,
    "ci95HalfWidth": 0.0281,
    "matchesPlayed": 1208,
    "vsFormatWinRates": {
      "monocolor": 0.4476,
      "bicolor": 0.2738,
      "tricolor": 0.243,
      "pentachromatic": 0.3214
    },
    "bestMatchups": [
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.6429,
        "games": 28
      },
      {
        "opponentId": "mono_red_dragon",
        "winRate": 0.6071,
        "games": 28
      },
      {
        "opponentId": "mono_gold_judgment",
        "winRate": 0.6071,
        "games": 28
      },
      {
        "opponentId": "mono_purple_crypt",
        "winRate": 0.5714,
        "games": 28
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.5357,
        "games": 28
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_blue_purple_gold",
        "winRate": 0.0938,
        "games": 32
      },
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.1071,
        "games": 28
      },
      {
        "opponentId": "dual_blue_neutral",
        "winRate": 0.1429,
        "games": 28
      },
      {
        "opponentId": "tri_purple_green_gold",
        "winRate": 0.1786,
        "games": 28
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.1786,
        "games": 28
      }
    ]
  },
  {
    "rank": 41,
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
    "overallWinRate": 0.3134,
    "ci95HalfWidth": 0.0271,
    "matchesPlayed": 1168,
    "vsFormatWinRates": {
      "monocolor": 0.4406,
      "bicolor": 0.25,
      "tricolor": 0.2426,
      "pentachromatic": 0.2381
    },
    "bestMatchups": [
      {
        "opponentId": "mono_blue_abyssal",
        "winRate": 0.5833,
        "games": 24
      },
      {
        "opponentId": "dual_purple_neutral",
        "winRate": 0.5714,
        "games": 28
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.5417,
        "games": 24
      },
      {
        "opponentId": "mono_red_blitz",
        "winRate": 0.5357,
        "games": 28
      },
      {
        "opponentId": "mono_neutral_axial",
        "winRate": 0.5357,
        "games": 28
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_purple_green",
        "winRate": 0.0417,
        "games": 24
      },
      {
        "opponentId": "tri_red_green_gold",
        "winRate": 0.1071,
        "games": 28
      },
      {
        "opponentId": "dual_green_gold",
        "winRate": 0.1071,
        "games": 28
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.125,
        "games": 24
      },
      {
        "opponentId": "dual_gold_neutral",
        "winRate": 0.1429,
        "games": 28
      }
    ]
  },
  {
    "rank": 42,
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
    "overallWinRate": 0.3065,
    "ci95HalfWidth": 0.0275,
    "matchesPlayed": 1168,
    "vsFormatWinRates": {
      "monocolor": 0.4208,
      "bicolor": 0.2083,
      "tricolor": 0.2831,
      "pentachromatic": 0.3095
    },
    "bestMatchups": [
      {
        "opponentId": "mono_blue_frost",
        "winRate": 0.6429,
        "games": 28
      },
      {
        "opponentId": "mono_purple_umbral",
        "winRate": 0.625,
        "games": 24
      },
      {
        "opponentId": "tri_red_blue_purple",
        "winRate": 0.6071,
        "games": 28
      },
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.5417,
        "games": 24
      },
      {
        "opponentId": "mono_red_dragon",
        "winRate": 0.5357,
        "games": 28
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "dual_purple_gold",
        "winRate": 0.0714,
        "games": 28
      },
      {
        "opponentId": "dual_gold_neutral",
        "winRate": 0.1071,
        "games": 28
      },
      {
        "opponentId": "dual_blue_neutral",
        "winRate": 0.1071,
        "games": 28
      },
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.125,
        "games": 24
      },
      {
        "opponentId": "tri_red_purple_gold",
        "winRate": 0.125,
        "games": 24
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
    "coverCardId": "green_33_behemoth_primordial",
    "classicDeckIds": [],
    "tierBadge": "B",
    "overallWinRate": 0.2979,
    "ci95HalfWidth": 0.0274,
    "matchesPlayed": 1168,
    "vsFormatWinRates": {
      "monocolor": 0.4233,
      "bicolor": 0.2426,
      "tricolor": 0.2243,
      "pentachromatic": 0.2024
    },
    "bestMatchups": [
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.5714,
        "games": 28
      },
      {
        "opponentId": "mono_purple_crypt",
        "winRate": 0.5417,
        "games": 24
      },
      {
        "opponentId": "mono_purple_umbral",
        "winRate": 0.5417,
        "games": 24
      },
      {
        "opponentId": "mono_gold_phalanx",
        "winRate": 0.5357,
        "games": 28
      },
      {
        "opponentId": "mono_gold_judgment",
        "winRate": 0.5357,
        "games": 28
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "tri_red_blue_gold",
        "winRate": 0.0417,
        "games": 24
      },
      {
        "opponentId": "penta_prismatic_crater",
        "winRate": 0.0714,
        "games": 28
      },
      {
        "opponentId": "dual_red_gold",
        "winRate": 0.0833,
        "games": 24
      },
      {
        "opponentId": "dual_gold_neutral",
        "winRate": 0.1071,
        "games": 28
      },
      {
        "opponentId": "tri_red_green_gold",
        "winRate": 0.1429,
        "games": 28
      }
    ]
  },
  {
    "rank": 44,
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
    "overallWinRate": 0.2885,
    "ci95HalfWidth": 0.027,
    "matchesPlayed": 1168,
    "vsFormatWinRates": {
      "monocolor": 0.4208,
      "bicolor": 0.2206,
      "tricolor": 0.2243,
      "pentachromatic": 0.1905
    },
    "bestMatchups": [
      {
        "opponentId": "mono_green_roots",
        "winRate": 0.7917,
        "games": 24
      },
      {
        "opponentId": "mono_green_colossus",
        "winRate": 0.5,
        "games": 28
      },
      {
        "opponentId": "mono_red_pyroclasm",
        "winRate": 0.5,
        "games": 28
      },
      {
        "opponentId": "mono_purple_blood",
        "winRate": 0.5,
        "games": 24
      },
      {
        "opponentId": "mono_gold_phalanx",
        "winRate": 0.5,
        "games": 28
      }
    ],
    "worstMatchups": [
      {
        "opponentId": "penta_prismatic_crater",
        "winRate": 0.0357,
        "games": 28
      },
      {
        "opponentId": "dual_red_neutral",
        "winRate": 0.0417,
        "games": 24
      },
      {
        "opponentId": "dual_purple_green",
        "winRate": 0.0714,
        "games": 28
      },
      {
        "opponentId": "dual_red_green",
        "winRate": 0.0714,
        "games": 28
      },
      {
        "opponentId": "dual_blue_green",
        "winRate": 0.1071,
        "games": 28
      }
    ]
  }
];

export const UNIFIED_MATCHUP_MATRIX: Record<UnifiedChampionId, Record<UnifiedChampionId, number>> = {
  "mono_green_swarm": {
    "mono_green_swarm": 0.5,
    "mono_green_colossus": 0.5714,
    "mono_green_roots": 0.5714,
    "mono_red_blitz": 0.5,
    "mono_red_pyroclasm": 0.5357,
    "mono_red_dragon": 0.6429,
    "mono_blue_frost": 0.5714,
    "mono_blue_chrono": 0.6786,
    "mono_blue_abyssal": 0.5714,
    "mono_purple_crypt": 0.6071,
    "mono_purple_blood": 0.5714,
    "mono_purple_umbral": 0.4643,
    "mono_gold_phalanx": 0.3929,
    "mono_gold_celestial": 0.3571,
    "mono_gold_judgment": 0.5357,
    "mono_neutral_axial": 0.5,
    "dual_red_gold": 0.3214,
    "dual_blue_purple": 0.3929,
    "dual_red_green": 0.3214,
    "dual_blue_gold": 0.2143,
    "dual_purple_green": 0.2857,
    "dual_red_purple": 0.4286,
    "dual_blue_green": 0.3571,
    "dual_green_gold": 0.4643,
    "dual_purple_gold": 0.2143,
    "dual_red_blue": 0.5357,
    "dual_green_neutral": 0.3571,
    "dual_red_neutral": 0.2143,
    "dual_blue_neutral": 0.2857,
    "dual_purple_neutral": 0.4643,
    "dual_gold_neutral": 0.1429,
    "tri_red_blue_purple": 0.2143,
    "tri_red_green_gold": 0.2857,
    "tri_blue_purple_gold": 0.4063,
    "tri_red_purple_green": 0.1786,
    "tri_blue_green_gold": 0.5357,
    "tri_blue_purple_green": 0.3214,
    "tri_red_purple_gold": 0.25,
    "tri_purple_green_gold": 0.3929,
    "tri_red_blue_green": 0.2857,
    "tri_red_blue_gold": 0.3214,
    "penta_prismatic_crater": 0.3571,
    "penta_free_city_sovereign": 0.4643,
    "penta_wheel_convergence": 0.3571
  },
  "mono_green_colossus": {
    "mono_green_swarm": 0.4286,
    "mono_green_colossus": 0.5,
    "mono_green_roots": 0.6429,
    "mono_red_blitz": 0.3571,
    "mono_red_pyroclasm": 0.3571,
    "mono_red_dragon": 0.4286,
    "mono_blue_frost": 0.6071,
    "mono_blue_chrono": 0.5357,
    "mono_blue_abyssal": 0.5,
    "mono_purple_crypt": 0.5,
    "mono_purple_blood": 0.6429,
    "mono_purple_umbral": 0.4643,
    "mono_gold_phalanx": 0.3929,
    "mono_gold_celestial": 0.2857,
    "mono_gold_judgment": 0.3571,
    "mono_neutral_axial": 0.5,
    "dual_red_gold": 0.25,
    "dual_blue_purple": 0.2857,
    "dual_red_green": 0.3214,
    "dual_blue_gold": 0.3929,
    "dual_purple_green": 0.3929,
    "dual_red_purple": 0.3929,
    "dual_blue_green": 0.1786,
    "dual_green_gold": 0.25,
    "dual_purple_gold": 0.2857,
    "dual_red_blue": 0.3929,
    "dual_green_neutral": 0.1786,
    "dual_red_neutral": 0.1071,
    "dual_blue_neutral": 0.1071,
    "dual_purple_neutral": 0.3571,
    "dual_gold_neutral": 0.2143,
    "tri_red_blue_purple": 0.4286,
    "tri_red_green_gold": 0.3214,
    "tri_blue_purple_gold": 0.375,
    "tri_red_purple_green": 0.1071,
    "tri_blue_green_gold": 0.2143,
    "tri_blue_purple_green": 0.4286,
    "tri_red_purple_gold": 0.1071,
    "tri_purple_green_gold": 0.3214,
    "tri_red_blue_green": 0.0714,
    "tri_red_blue_gold": 0.0714,
    "penta_prismatic_crater": 0.1429,
    "penta_free_city_sovereign": 0.4643,
    "penta_wheel_convergence": 0.3571
  },
  "mono_green_roots": {
    "mono_green_swarm": 0.4286,
    "mono_green_colossus": 0.3571,
    "mono_green_roots": 0.5,
    "mono_red_blitz": 0.3571,
    "mono_red_pyroclasm": 0.5714,
    "mono_red_dragon": 0.4643,
    "mono_blue_frost": 0.3571,
    "mono_blue_chrono": 0.3214,
    "mono_blue_abyssal": 0.2083,
    "mono_purple_crypt": 0.5417,
    "mono_purple_blood": 0.4583,
    "mono_purple_umbral": 0.5417,
    "mono_gold_phalanx": 0.5357,
    "mono_gold_celestial": 0.4643,
    "mono_gold_judgment": 0.5357,
    "mono_neutral_axial": 0.2143,
    "dual_red_gold": 0.0833,
    "dual_blue_purple": 0.3571,
    "dual_red_green": 0.1786,
    "dual_blue_gold": 0.1786,
    "dual_purple_green": 0.2857,
    "dual_red_purple": 0.4286,
    "dual_blue_green": 0.1429,
    "dual_green_gold": 0.3214,
    "dual_purple_gold": 0.25,
    "dual_red_blue": 0.3214,
    "dual_green_neutral": 0.2083,
    "dual_red_neutral": 0.2917,
    "dual_blue_neutral": 0.1786,
    "dual_purple_neutral": 0.2857,
    "dual_gold_neutral": 0.1071,
    "tri_red_blue_purple": 0.25,
    "tri_red_green_gold": 0.1429,
    "tri_blue_purple_gold": 0.25,
    "tri_red_purple_green": 0.2083,
    "tri_blue_green_gold": 0.25,
    "tri_blue_purple_green": 0.3571,
    "tri_red_purple_gold": 0.2917,
    "tri_purple_green_gold": 0.2143,
    "tri_red_blue_green": 0.2143,
    "tri_red_blue_gold": 0.0417,
    "penta_prismatic_crater": 0.0714,
    "penta_free_city_sovereign": 0.2143,
    "penta_wheel_convergence": 0.3214
  },
  "mono_red_blitz": {
    "mono_green_swarm": 0.5,
    "mono_green_colossus": 0.6429,
    "mono_green_roots": 0.6429,
    "mono_red_blitz": 0.5,
    "mono_red_pyroclasm": 0.3929,
    "mono_red_dragon": 0.7857,
    "mono_blue_frost": 0.6429,
    "mono_blue_chrono": 0.7143,
    "mono_blue_abyssal": 0.8214,
    "mono_purple_crypt": 0.4643,
    "mono_purple_blood": 0.6786,
    "mono_purple_umbral": 0.7143,
    "mono_gold_phalanx": 0.6071,
    "mono_gold_celestial": 0.5714,
    "mono_gold_judgment": 0.6071,
    "mono_neutral_axial": 0.3929,
    "dual_red_gold": 0.4286,
    "dual_blue_purple": 0.6071,
    "dual_red_green": 0.4643,
    "dual_blue_gold": 0.5357,
    "dual_purple_green": 0.3929,
    "dual_red_purple": 0.5357,
    "dual_blue_green": 0.5357,
    "dual_green_gold": 0.2857,
    "dual_purple_gold": 0.3929,
    "dual_red_blue": 0.5714,
    "dual_green_neutral": 0.5,
    "dual_red_neutral": 0.3214,
    "dual_blue_neutral": 0.4643,
    "dual_purple_neutral": 0.6786,
    "dual_gold_neutral": 0.3571,
    "tri_red_blue_purple": 0.6071,
    "tri_red_green_gold": 0.3929,
    "tri_blue_purple_gold": 0.5625,
    "tri_red_purple_green": 0.3929,
    "tri_blue_green_gold": 0.3571,
    "tri_blue_purple_green": 0.3571,
    "tri_red_purple_gold": 0.4286,
    "tri_purple_green_gold": 0.3571,
    "tri_red_blue_green": 0.6071,
    "tri_red_blue_gold": 0.3929,
    "penta_prismatic_crater": 0.3214,
    "penta_free_city_sovereign": 0.5714,
    "penta_wheel_convergence": 0.3214
  },
  "mono_red_pyroclasm": {
    "mono_green_swarm": 0.4643,
    "mono_green_colossus": 0.6429,
    "mono_green_roots": 0.4286,
    "mono_red_blitz": 0.6071,
    "mono_red_pyroclasm": 0.5,
    "mono_red_dragon": 0.4643,
    "mono_blue_frost": 0.4643,
    "mono_blue_chrono": 0.75,
    "mono_blue_abyssal": 0.5,
    "mono_purple_crypt": 0.5714,
    "mono_purple_blood": 0.6429,
    "mono_purple_umbral": 0.5357,
    "mono_gold_phalanx": 0.2857,
    "mono_gold_celestial": 0.25,
    "mono_gold_judgment": 0.5,
    "mono_neutral_axial": 0.5,
    "dual_red_gold": 0.1429,
    "dual_blue_purple": 0.4286,
    "dual_red_green": 0.4643,
    "dual_blue_gold": 0.1786,
    "dual_purple_green": 0.3929,
    "dual_red_purple": 0.3214,
    "dual_blue_green": 0.6071,
    "dual_green_gold": 0.2857,
    "dual_purple_gold": 0.2143,
    "dual_red_blue": 0.3214,
    "dual_green_neutral": 0.2857,
    "dual_red_neutral": 0.1786,
    "dual_blue_neutral": 0.2857,
    "dual_purple_neutral": 0.5357,
    "dual_gold_neutral": 0.1786,
    "tri_red_blue_purple": 0.1429,
    "tri_red_green_gold": 0.25,
    "tri_blue_purple_gold": 0.0313,
    "tri_red_purple_green": 0.2143,
    "tri_blue_green_gold": 0.2143,
    "tri_blue_purple_green": 0.3571,
    "tri_red_purple_gold": 0.2143,
    "tri_purple_green_gold": 0.1786,
    "tri_red_blue_green": 0.2857,
    "tri_red_blue_gold": 0.0357,
    "penta_prismatic_crater": 0.3214,
    "penta_free_city_sovereign": 0.4643,
    "penta_wheel_convergence": 0.4286
  },
  "mono_red_dragon": {
    "mono_green_swarm": 0.3571,
    "mono_green_colossus": 0.5714,
    "mono_green_roots": 0.5357,
    "mono_red_blitz": 0.2143,
    "mono_red_pyroclasm": 0.5357,
    "mono_red_dragon": 0.5,
    "mono_blue_frost": 0.3929,
    "mono_blue_chrono": 0.5357,
    "mono_blue_abyssal": 0.5357,
    "mono_purple_crypt": 0.5714,
    "mono_purple_blood": 0.4643,
    "mono_purple_umbral": 0.5714,
    "mono_gold_phalanx": 0.5,
    "mono_gold_celestial": 0.25,
    "mono_gold_judgment": 0.3929,
    "mono_neutral_axial": 0.5,
    "dual_red_gold": 0.1071,
    "dual_blue_purple": 0.4643,
    "dual_red_green": 0.2857,
    "dual_blue_gold": 0.3571,
    "dual_purple_green": 0.2143,
    "dual_red_purple": 0.2143,
    "dual_blue_green": 0.2857,
    "dual_green_gold": 0.3929,
    "dual_purple_gold": 0.25,
    "dual_red_blue": 0.25,
    "dual_green_neutral": 0.2857,
    "dual_red_neutral": 0.25,
    "dual_blue_neutral": 0.3929,
    "dual_purple_neutral": 0.4643,
    "dual_gold_neutral": 0.2857,
    "tri_red_blue_purple": 0.3214,
    "tri_red_green_gold": 0.2143,
    "tri_blue_purple_gold": 0.2813,
    "tri_red_purple_green": 0.2143,
    "tri_blue_green_gold": 0.4643,
    "tri_blue_purple_green": 0.3571,
    "tri_red_purple_gold": 0.3571,
    "tri_purple_green_gold": 0.3214,
    "tri_red_blue_green": 0.2857,
    "tri_red_blue_gold": 0.1429,
    "penta_prismatic_crater": 0.3929,
    "penta_free_city_sovereign": 0.4643,
    "penta_wheel_convergence": 0.5
  },
  "mono_blue_frost": {
    "mono_green_swarm": 0.4286,
    "mono_green_colossus": 0.3929,
    "mono_green_roots": 0.6429,
    "mono_red_blitz": 0.3571,
    "mono_red_pyroclasm": 0.5357,
    "mono_red_dragon": 0.6071,
    "mono_blue_frost": 0.5,
    "mono_blue_chrono": 0.3214,
    "mono_blue_abyssal": 0.5357,
    "mono_purple_crypt": 0.5714,
    "mono_purple_blood": 0.3571,
    "mono_purple_umbral": 0.2857,
    "mono_gold_phalanx": 0.3214,
    "mono_gold_celestial": 0.2857,
    "mono_gold_judgment": 0.6071,
    "mono_neutral_axial": 0.4643,
    "dual_red_gold": 0.2857,
    "dual_blue_purple": 0.3571,
    "dual_red_green": 0.2857,
    "dual_blue_gold": 0.3571,
    "dual_purple_green": 0.4286,
    "dual_red_purple": 0.2143,
    "dual_blue_green": 0.1786,
    "dual_green_gold": 0.4643,
    "dual_purple_gold": 0.2143,
    "dual_red_blue": 0.25,
    "dual_green_neutral": 0.25,
    "dual_red_neutral": 0.1786,
    "dual_blue_neutral": 0.1429,
    "dual_purple_neutral": 0.2143,
    "dual_gold_neutral": 0.2857,
    "tri_red_blue_purple": 0.4286,
    "tri_red_green_gold": 0.2857,
    "tri_blue_purple_gold": 0.0938,
    "tri_red_purple_green": 0.1071,
    "tri_blue_green_gold": 0.25,
    "tri_blue_purple_green": 0.4286,
    "tri_red_purple_gold": 0.25,
    "tri_purple_green_gold": 0.1786,
    "tri_red_blue_green": 0.2143,
    "tri_red_blue_gold": 0.2143,
    "penta_prismatic_crater": 0.2143,
    "penta_free_city_sovereign": 0.4286,
    "penta_wheel_convergence": 0.3214
  },
  "mono_blue_chrono": {
    "mono_green_swarm": 0.3214,
    "mono_green_colossus": 0.4643,
    "mono_green_roots": 0.6786,
    "mono_red_blitz": 0.2857,
    "mono_red_pyroclasm": 0.25,
    "mono_red_dragon": 0.4643,
    "mono_blue_frost": 0.6786,
    "mono_blue_chrono": 0.5,
    "mono_blue_abyssal": 0.75,
    "mono_purple_crypt": 0.6429,
    "mono_purple_blood": 0.5,
    "mono_purple_umbral": 0.3929,
    "mono_gold_phalanx": 0.75,
    "mono_gold_celestial": 0.6429,
    "mono_gold_judgment": 0.8571,
    "mono_neutral_axial": 0.3929,
    "dual_red_gold": 0.3214,
    "dual_blue_purple": 0.5714,
    "dual_red_green": 0.25,
    "dual_blue_gold": 0.5,
    "dual_purple_green": 0.5357,
    "dual_red_purple": 0.0714,
    "dual_blue_green": 0.3571,
    "dual_green_gold": 0.5357,
    "dual_purple_gold": 0.5,
    "dual_red_blue": 0.3214,
    "dual_green_neutral": 0.2857,
    "dual_red_neutral": 0.1071,
    "dual_blue_neutral": 0.25,
    "dual_purple_neutral": 0.4643,
    "dual_gold_neutral": 0.3214,
    "tri_red_blue_purple": 0.5,
    "tri_red_green_gold": 0.5,
    "tri_blue_purple_gold": 0.5938,
    "tri_red_purple_green": 0.1071,
    "tri_blue_green_gold": 0.5,
    "tri_blue_purple_green": 0.4643,
    "tri_red_purple_gold": 0.2857,
    "tri_purple_green_gold": 0.4643,
    "tri_red_blue_green": 0.3571,
    "tri_red_blue_gold": 0.2143,
    "penta_prismatic_crater": 0.3571,
    "penta_free_city_sovereign": 0.4643,
    "penta_wheel_convergence": 0.6071
  },
  "mono_blue_abyssal": {
    "mono_green_swarm": 0.4286,
    "mono_green_colossus": 0.5,
    "mono_green_roots": 0.7917,
    "mono_red_blitz": 0.1786,
    "mono_red_pyroclasm": 0.5,
    "mono_red_dragon": 0.4643,
    "mono_blue_frost": 0.4643,
    "mono_blue_chrono": 0.25,
    "mono_blue_abyssal": 0.5,
    "mono_purple_crypt": 0.4167,
    "mono_purple_blood": 0.5,
    "mono_purple_umbral": 0.3333,
    "mono_gold_phalanx": 0.5,
    "mono_gold_celestial": 0.3214,
    "mono_gold_judgment": 0.3214,
    "mono_neutral_axial": 0.3929,
    "dual_red_gold": 0.2083,
    "dual_blue_purple": 0.4643,
    "dual_red_green": 0.0714,
    "dual_blue_gold": 0.3929,
    "dual_purple_green": 0.0714,
    "dual_red_purple": 0.25,
    "dual_blue_green": 0.1071,
    "dual_green_gold": 0.2143,
    "dual_purple_gold": 0.2857,
    "dual_red_blue": 0.25,
    "dual_green_neutral": 0.1667,
    "dual_red_neutral": 0.0417,
    "dual_blue_neutral": 0.1786,
    "dual_purple_neutral": 0.2143,
    "dual_gold_neutral": 0.3571,
    "tri_red_blue_purple": 0.2857,
    "tri_red_green_gold": 0.1429,
    "tri_blue_purple_gold": 0.3125,
    "tri_red_purple_green": 0.125,
    "tri_blue_green_gold": 0.3571,
    "tri_blue_purple_green": 0.2857,
    "tri_red_purple_gold": 0.2083,
    "tri_purple_green_gold": 0.2143,
    "tri_red_blue_green": 0.1429,
    "tri_red_blue_gold": 0.125,
    "penta_prismatic_crater": 0.0357,
    "penta_free_city_sovereign": 0.1786,
    "penta_wheel_convergence": 0.3571
  },
  "mono_purple_crypt": {
    "mono_green_swarm": 0.3929,
    "mono_green_colossus": 0.5,
    "mono_green_roots": 0.4583,
    "mono_red_blitz": 0.5357,
    "mono_red_pyroclasm": 0.4286,
    "mono_red_dragon": 0.4286,
    "mono_blue_frost": 0.4286,
    "mono_blue_chrono": 0.3571,
    "mono_blue_abyssal": 0.5833,
    "mono_purple_crypt": 0.5,
    "mono_purple_blood": 0.5417,
    "mono_purple_umbral": 0.5,
    "mono_gold_phalanx": 0.3214,
    "mono_gold_celestial": 0.25,
    "mono_gold_judgment": 0.3929,
    "mono_neutral_axial": 0.5357,
    "dual_red_gold": 0.1667,
    "dual_blue_purple": 0.4643,
    "dual_red_green": 0.25,
    "dual_blue_gold": 0.25,
    "dual_purple_green": 0.25,
    "dual_red_purple": 0.2857,
    "dual_blue_green": 0.25,
    "dual_green_gold": 0.1071,
    "dual_purple_gold": 0.1429,
    "dual_red_blue": 0.25,
    "dual_green_neutral": 0.1667,
    "dual_red_neutral": 0.25,
    "dual_blue_neutral": 0.1786,
    "dual_purple_neutral": 0.5714,
    "dual_gold_neutral": 0.1429,
    "tri_red_blue_purple": 0.5357,
    "tri_red_green_gold": 0.1071,
    "tri_blue_purple_gold": 0.25,
    "tri_red_purple_green": 0.0417,
    "tri_blue_green_gold": 0.25,
    "tri_blue_purple_green": 0.4286,
    "tri_red_purple_gold": 0.25,
    "tri_purple_green_gold": 0.1786,
    "tri_red_blue_green": 0.2143,
    "tri_red_blue_gold": 0.125,
    "penta_prismatic_crater": 0.3214,
    "penta_free_city_sovereign": 0.2143,
    "penta_wheel_convergence": 0.1786
  },
  "mono_purple_blood": {
    "mono_green_swarm": 0.4286,
    "mono_green_colossus": 0.3571,
    "mono_green_roots": 0.5417,
    "mono_red_blitz": 0.3214,
    "mono_red_pyroclasm": 0.3571,
    "mono_red_dragon": 0.5357,
    "mono_blue_frost": 0.6429,
    "mono_blue_chrono": 0.5,
    "mono_blue_abyssal": 0.5,
    "mono_purple_crypt": 0.4583,
    "mono_purple_blood": 0.5,
    "mono_purple_umbral": 0.625,
    "mono_gold_phalanx": 0.2857,
    "mono_gold_celestial": 0.3214,
    "mono_gold_judgment": 0.3571,
    "mono_neutral_axial": 0.1429,
    "dual_red_gold": 0.1667,
    "dual_blue_purple": 0.5,
    "dual_red_green": 0.2143,
    "dual_blue_gold": 0.1786,
    "dual_purple_green": 0.1429,
    "dual_red_purple": 0.2143,
    "dual_blue_green": 0.3214,
    "dual_green_gold": 0.1429,
    "dual_purple_gold": 0.0714,
    "dual_red_blue": 0.25,
    "dual_green_neutral": 0.2083,
    "dual_red_neutral": 0.125,
    "dual_blue_neutral": 0.1071,
    "dual_purple_neutral": 0.3571,
    "dual_gold_neutral": 0.1071,
    "tri_red_blue_purple": 0.6071,
    "tri_red_green_gold": 0.25,
    "tri_blue_purple_gold": 0.375,
    "tri_red_purple_green": 0.25,
    "tri_blue_green_gold": 0.25,
    "tri_blue_purple_green": 0.3214,
    "tri_red_purple_gold": 0.125,
    "tri_purple_green_gold": 0.2143,
    "tri_red_blue_green": 0.25,
    "tri_red_blue_gold": 0.125,
    "penta_prismatic_crater": 0.2857,
    "penta_free_city_sovereign": 0.25,
    "penta_wheel_convergence": 0.3929
  },
  "mono_purple_umbral": {
    "mono_green_swarm": 0.5357,
    "mono_green_colossus": 0.5357,
    "mono_green_roots": 0.4583,
    "mono_red_blitz": 0.2857,
    "mono_red_pyroclasm": 0.4643,
    "mono_red_dragon": 0.4286,
    "mono_blue_frost": 0.7143,
    "mono_blue_chrono": 0.6071,
    "mono_blue_abyssal": 0.6667,
    "mono_purple_crypt": 0.5,
    "mono_purple_blood": 0.375,
    "mono_purple_umbral": 0.5,
    "mono_gold_phalanx": 0.4643,
    "mono_gold_celestial": 0.3214,
    "mono_gold_judgment": 0.6071,
    "mono_neutral_axial": 0.3571,
    "dual_red_gold": 0.375,
    "dual_blue_purple": 0.4643,
    "dual_red_green": 0.1786,
    "dual_blue_gold": 0.1429,
    "dual_purple_green": 0.3214,
    "dual_red_purple": 0.4286,
    "dual_blue_green": 0.1429,
    "dual_green_gold": 0.25,
    "dual_purple_gold": 0.2857,
    "dual_red_blue": 0.5,
    "dual_green_neutral": 0.125,
    "dual_red_neutral": 0.1667,
    "dual_blue_neutral": 0.5,
    "dual_purple_neutral": 0.3214,
    "dual_gold_neutral": 0.2143,
    "tri_red_blue_purple": 0.5,
    "tri_red_green_gold": 0.3571,
    "tri_blue_purple_gold": 0.2188,
    "tri_red_purple_green": 0.125,
    "tri_blue_green_gold": 0.3929,
    "tri_blue_purple_green": 0.3214,
    "tri_red_purple_gold": 0.25,
    "tri_purple_green_gold": 0.4286,
    "tri_red_blue_green": 0.2857,
    "tri_red_blue_gold": 0.125,
    "penta_prismatic_crater": 0.2857,
    "penta_free_city_sovereign": 0.1786,
    "penta_wheel_convergence": 0.3214
  },
  "mono_gold_phalanx": {
    "mono_green_swarm": 0.6071,
    "mono_green_colossus": 0.6071,
    "mono_green_roots": 0.4643,
    "mono_red_blitz": 0.3929,
    "mono_red_pyroclasm": 0.7143,
    "mono_red_dragon": 0.5,
    "mono_blue_frost": 0.6786,
    "mono_blue_chrono": 0.25,
    "mono_blue_abyssal": 0.5,
    "mono_purple_crypt": 0.6786,
    "mono_purple_blood": 0.7143,
    "mono_purple_umbral": 0.5357,
    "mono_gold_phalanx": 0.5,
    "mono_gold_celestial": 0.3571,
    "mono_gold_judgment": 0.6071,
    "mono_neutral_axial": 0.5,
    "dual_red_gold": 0.3214,
    "dual_blue_purple": 0.25,
    "dual_red_green": 0.3929,
    "dual_blue_gold": 0.3214,
    "dual_purple_green": 0.3571,
    "dual_red_purple": 0.4286,
    "dual_blue_green": 0.2857,
    "dual_green_gold": 0.5,
    "dual_purple_gold": 0.3929,
    "dual_red_blue": 0.3214,
    "dual_green_neutral": 0.3214,
    "dual_red_neutral": 0.25,
    "dual_blue_neutral": 0.5,
    "dual_purple_neutral": 0.4643,
    "dual_gold_neutral": 0.25,
    "tri_red_blue_purple": 0.3929,
    "tri_red_green_gold": 0.2857,
    "tri_blue_purple_gold": 0.4063,
    "tri_red_purple_green": 0.1786,
    "tri_blue_green_gold": 0.2143,
    "tri_blue_purple_green": 0.2857,
    "tri_red_purple_gold": 0.2857,
    "tri_purple_green_gold": 0.1786,
    "tri_red_blue_green": 0.1429,
    "tri_red_blue_gold": 0.3214,
    "penta_prismatic_crater": 0.3214,
    "penta_free_city_sovereign": 0.5714,
    "penta_wheel_convergence": 0.1786
  },
  "mono_gold_celestial": {
    "mono_green_swarm": 0.6429,
    "mono_green_colossus": 0.7143,
    "mono_green_roots": 0.5357,
    "mono_red_blitz": 0.4286,
    "mono_red_pyroclasm": 0.75,
    "mono_red_dragon": 0.75,
    "mono_blue_frost": 0.7143,
    "mono_blue_chrono": 0.3571,
    "mono_blue_abyssal": 0.6786,
    "mono_purple_crypt": 0.75,
    "mono_purple_blood": 0.6786,
    "mono_purple_umbral": 0.6786,
    "mono_gold_phalanx": 0.6429,
    "mono_gold_celestial": 0.5,
    "mono_gold_judgment": 0.4643,
    "mono_neutral_axial": 0.5714,
    "dual_red_gold": 0.1786,
    "dual_blue_purple": 0.4643,
    "dual_red_green": 0.1429,
    "dual_blue_gold": 0.25,
    "dual_purple_green": 0.4286,
    "dual_red_purple": 0.1786,
    "dual_blue_green": 0.3214,
    "dual_green_gold": 0.3214,
    "dual_purple_gold": 0.2857,
    "dual_red_blue": 0.3929,
    "dual_green_neutral": 0.2857,
    "dual_red_neutral": 0.1786,
    "dual_blue_neutral": 0.4286,
    "dual_purple_neutral": 0.6786,
    "dual_gold_neutral": 0.3571,
    "tri_red_blue_purple": 0.3214,
    "tri_red_green_gold": 0.3571,
    "tri_blue_purple_gold": 0.375,
    "tri_red_purple_green": 0.1071,
    "tri_blue_green_gold": 0.3214,
    "tri_blue_purple_green": 0.3214,
    "tri_red_purple_gold": 0.25,
    "tri_purple_green_gold": 0.25,
    "tri_red_blue_green": 0.3214,
    "tri_red_blue_gold": 0.2857,
    "penta_prismatic_crater": 0.3214,
    "penta_free_city_sovereign": 0.25,
    "penta_wheel_convergence": 0.3929
  },
  "mono_gold_judgment": {
    "mono_green_swarm": 0.4643,
    "mono_green_colossus": 0.6429,
    "mono_green_roots": 0.4643,
    "mono_red_blitz": 0.3929,
    "mono_red_pyroclasm": 0.5,
    "mono_red_dragon": 0.6071,
    "mono_blue_frost": 0.3929,
    "mono_blue_chrono": 0.1429,
    "mono_blue_abyssal": 0.6786,
    "mono_purple_crypt": 0.6071,
    "mono_purple_blood": 0.6429,
    "mono_purple_umbral": 0.3929,
    "mono_gold_phalanx": 0.3929,
    "mono_gold_celestial": 0.5357,
    "mono_gold_judgment": 0.5,
    "mono_neutral_axial": 0.4286,
    "dual_red_gold": 0.25,
    "dual_blue_purple": 0.2143,
    "dual_red_green": 0.1786,
    "dual_blue_gold": 0.2143,
    "dual_purple_green": 0.3214,
    "dual_red_purple": 0.5714,
    "dual_blue_green": 0.1071,
    "dual_green_gold": 0.2857,
    "dual_purple_gold": 0.2143,
    "dual_red_blue": 0.3214,
    "dual_green_neutral": 0.25,
    "dual_red_neutral": 0.2857,
    "dual_blue_neutral": 0.3571,
    "dual_purple_neutral": 0.3214,
    "dual_gold_neutral": 0.25,
    "tri_red_blue_purple": 0.5714,
    "tri_red_green_gold": 0.1429,
    "tri_blue_purple_gold": 0.1563,
    "tri_red_purple_green": 0.1786,
    "tri_blue_green_gold": 0.1786,
    "tri_blue_purple_green": 0.3571,
    "tri_red_purple_gold": 0.1786,
    "tri_purple_green_gold": 0.1071,
    "tri_red_blue_green": 0.2857,
    "tri_red_blue_gold": 0.1786,
    "penta_prismatic_crater": 0.25,
    "penta_free_city_sovereign": 0.3214,
    "penta_wheel_convergence": 0.1429
  },
  "mono_neutral_axial": {
    "mono_green_swarm": 0.5,
    "mono_green_colossus": 0.5,
    "mono_green_roots": 0.7857,
    "mono_red_blitz": 0.6071,
    "mono_red_pyroclasm": 0.5,
    "mono_red_dragon": 0.5,
    "mono_blue_frost": 0.5357,
    "mono_blue_chrono": 0.6071,
    "mono_blue_abyssal": 0.6071,
    "mono_purple_crypt": 0.4643,
    "mono_purple_blood": 0.8571,
    "mono_purple_umbral": 0.6429,
    "mono_gold_phalanx": 0.5,
    "mono_gold_celestial": 0.4286,
    "mono_gold_judgment": 0.5714,
    "mono_neutral_axial": 0.5,
    "dual_red_gold": 0.1786,
    "dual_blue_purple": 0.4286,
    "dual_red_green": 0.2143,
    "dual_blue_gold": 0.3214,
    "dual_purple_green": 0.4643,
    "dual_red_purple": 0.3929,
    "dual_blue_green": 0.2857,
    "dual_green_gold": 0.3929,
    "dual_purple_gold": 0.25,
    "dual_red_blue": 0.5357,
    "dual_green_neutral": 0.25,
    "dual_red_neutral": 0.2143,
    "dual_blue_neutral": 0.2143,
    "dual_purple_neutral": 0.5357,
    "dual_gold_neutral": 0.4286,
    "tri_red_blue_purple": 0.6429,
    "tri_red_green_gold": 0.3571,
    "tri_blue_purple_gold": 0.4063,
    "tri_red_purple_green": 0.3929,
    "tri_blue_green_gold": 0.3214,
    "tri_blue_purple_green": 0.5,
    "tri_red_purple_gold": 0.3214,
    "tri_purple_green_gold": 0.2143,
    "tri_red_blue_green": 0.25,
    "tri_red_blue_gold": 0.1786,
    "penta_prismatic_crater": 0.3214,
    "penta_free_city_sovereign": 0.4286,
    "penta_wheel_convergence": 0.5714
  },
  "dual_red_gold": {
    "mono_green_swarm": 0.6786,
    "mono_green_colossus": 0.75,
    "mono_green_roots": 0.9167,
    "mono_red_blitz": 0.5714,
    "mono_red_pyroclasm": 0.8571,
    "mono_red_dragon": 0.8929,
    "mono_blue_frost": 0.7143,
    "mono_blue_chrono": 0.6786,
    "mono_blue_abyssal": 0.7917,
    "mono_purple_crypt": 0.8333,
    "mono_purple_blood": 0.8333,
    "mono_purple_umbral": 0.625,
    "mono_gold_phalanx": 0.6786,
    "mono_gold_celestial": 0.8214,
    "mono_gold_judgment": 0.75,
    "mono_neutral_axial": 0.8214,
    "dual_red_gold": 0.5,
    "dual_blue_purple": 0.75,
    "dual_red_green": 0.4643,
    "dual_blue_gold": 0.75,
    "dual_purple_green": 0.7857,
    "dual_red_purple": 0.4286,
    "dual_blue_green": 0.5,
    "dual_green_gold": 0.5,
    "dual_purple_gold": 0.4286,
    "dual_red_blue": 0.7143,
    "dual_green_neutral": 0.4167,
    "dual_red_neutral": 0.2917,
    "dual_blue_neutral": 0.6071,
    "dual_purple_neutral": 0.6786,
    "dual_gold_neutral": 0.4643,
    "tri_red_blue_purple": 0.6429,
    "tri_red_green_gold": 0.5714,
    "tri_blue_purple_gold": 0.5938,
    "tri_red_purple_green": 0.5833,
    "tri_blue_green_gold": 0.5357,
    "tri_blue_purple_green": 0.6786,
    "tri_red_purple_gold": 0.5417,
    "tri_purple_green_gold": 0.5714,
    "tri_red_blue_green": 0.6786,
    "tri_red_blue_gold": 0.3333,
    "penta_prismatic_crater": 0.4643,
    "penta_free_city_sovereign": 0.6786,
    "penta_wheel_convergence": 0.6786
  },
  "dual_blue_purple": {
    "mono_green_swarm": 0.6071,
    "mono_green_colossus": 0.7143,
    "mono_green_roots": 0.6429,
    "mono_red_blitz": 0.3929,
    "mono_red_pyroclasm": 0.5714,
    "mono_red_dragon": 0.5357,
    "mono_blue_frost": 0.6429,
    "mono_blue_chrono": 0.4286,
    "mono_blue_abyssal": 0.5357,
    "mono_purple_crypt": 0.5357,
    "mono_purple_blood": 0.5,
    "mono_purple_umbral": 0.5357,
    "mono_gold_phalanx": 0.75,
    "mono_gold_celestial": 0.5357,
    "mono_gold_judgment": 0.7857,
    "mono_neutral_axial": 0.5714,
    "dual_red_gold": 0.25,
    "dual_blue_purple": 0.5,
    "dual_red_green": 0.4286,
    "dual_blue_gold": 0.3929,
    "dual_purple_green": 0.6429,
    "dual_red_purple": 0.3214,
    "dual_blue_green": 0.3214,
    "dual_green_gold": 0.2857,
    "dual_purple_gold": 0.5,
    "dual_red_blue": 0.3929,
    "dual_green_neutral": 0.3929,
    "dual_red_neutral": 0.1071,
    "dual_blue_neutral": 0.3214,
    "dual_purple_neutral": 0.5,
    "dual_gold_neutral": 0.5357,
    "tri_red_blue_purple": 0.4286,
    "tri_red_green_gold": 0.3571,
    "tri_blue_purple_gold": 0.3438,
    "tri_red_purple_green": 0.25,
    "tri_blue_green_gold": 0.4643,
    "tri_blue_purple_green": 0.5,
    "tri_red_purple_gold": 0.1786,
    "tri_purple_green_gold": 0.4286,
    "tri_red_blue_green": 0.5,
    "tri_red_blue_gold": 0.1071,
    "penta_prismatic_crater": 0.1786,
    "penta_free_city_sovereign": 0.2857,
    "penta_wheel_convergence": 0.6071
  },
  "dual_red_green": {
    "mono_green_swarm": 0.6786,
    "mono_green_colossus": 0.6786,
    "mono_green_roots": 0.8214,
    "mono_red_blitz": 0.5357,
    "mono_red_pyroclasm": 0.5357,
    "mono_red_dragon": 0.7143,
    "mono_blue_frost": 0.7143,
    "mono_blue_chrono": 0.75,
    "mono_blue_abyssal": 0.9286,
    "mono_purple_crypt": 0.75,
    "mono_purple_blood": 0.7857,
    "mono_purple_umbral": 0.8214,
    "mono_gold_phalanx": 0.6071,
    "mono_gold_celestial": 0.8571,
    "mono_gold_judgment": 0.8214,
    "mono_neutral_axial": 0.7857,
    "dual_red_gold": 0.5357,
    "dual_blue_purple": 0.5714,
    "dual_red_green": 0.5,
    "dual_blue_gold": 0.5357,
    "dual_purple_green": 0.7857,
    "dual_red_purple": 0.4643,
    "dual_blue_green": 0.3929,
    "dual_green_gold": 0.5714,
    "dual_purple_gold": 0.6071,
    "dual_red_blue": 0.5714,
    "dual_green_neutral": 0.5714,
    "dual_red_neutral": 0.3214,
    "dual_blue_neutral": 0.5357,
    "dual_purple_neutral": 0.7143,
    "dual_gold_neutral": 0.5357,
    "tri_red_blue_purple": 0.7857,
    "tri_red_green_gold": 0.4643,
    "tri_blue_purple_gold": 0.5625,
    "tri_red_purple_green": 0.3571,
    "tri_blue_green_gold": 0.4643,
    "tri_blue_purple_green": 0.5714,
    "tri_red_purple_gold": 0.4286,
    "tri_purple_green_gold": 0.4643,
    "tri_red_blue_green": 0.3214,
    "tri_red_blue_gold": 0.5357,
    "penta_prismatic_crater": 0.6071,
    "penta_free_city_sovereign": 0.6429,
    "penta_wheel_convergence": 0.7143
  },
  "dual_blue_gold": {
    "mono_green_swarm": 0.7857,
    "mono_green_colossus": 0.6071,
    "mono_green_roots": 0.8214,
    "mono_red_blitz": 0.4643,
    "mono_red_pyroclasm": 0.8214,
    "mono_red_dragon": 0.6429,
    "mono_blue_frost": 0.6429,
    "mono_blue_chrono": 0.5,
    "mono_blue_abyssal": 0.6071,
    "mono_purple_crypt": 0.75,
    "mono_purple_blood": 0.8214,
    "mono_purple_umbral": 0.8571,
    "mono_gold_phalanx": 0.6786,
    "mono_gold_celestial": 0.75,
    "mono_gold_judgment": 0.7857,
    "mono_neutral_axial": 0.6786,
    "dual_red_gold": 0.25,
    "dual_blue_purple": 0.6071,
    "dual_red_green": 0.4643,
    "dual_blue_gold": 0.5,
    "dual_purple_green": 0.6429,
    "dual_red_purple": 0.6071,
    "dual_blue_green": 0.3571,
    "dual_green_gold": 0.5714,
    "dual_purple_gold": 0.3929,
    "dual_red_blue": 0.5357,
    "dual_green_neutral": 0.4643,
    "dual_red_neutral": 0.4286,
    "dual_blue_neutral": 0.3571,
    "dual_purple_neutral": 0.6429,
    "dual_gold_neutral": 0.4643,
    "tri_red_blue_purple": 0.5357,
    "tri_red_green_gold": 0.2857,
    "tri_blue_purple_gold": 0.5938,
    "tri_red_purple_green": 0.3571,
    "tri_blue_green_gold": 0.4286,
    "tri_blue_purple_green": 0.6429,
    "tri_red_purple_gold": 0.1429,
    "tri_purple_green_gold": 0.3929,
    "tri_red_blue_green": 0.5,
    "tri_red_blue_gold": 0.25,
    "penta_prismatic_crater": 0.3929,
    "penta_free_city_sovereign": 0.4643,
    "penta_wheel_convergence": 0.6071
  },
  "dual_purple_green": {
    "mono_green_swarm": 0.7143,
    "mono_green_colossus": 0.6071,
    "mono_green_roots": 0.7143,
    "mono_red_blitz": 0.6071,
    "mono_red_pyroclasm": 0.6071,
    "mono_red_dragon": 0.7857,
    "mono_blue_frost": 0.5714,
    "mono_blue_chrono": 0.4643,
    "mono_blue_abyssal": 0.9286,
    "mono_purple_crypt": 0.75,
    "mono_purple_blood": 0.8571,
    "mono_purple_umbral": 0.6786,
    "mono_gold_phalanx": 0.6429,
    "mono_gold_celestial": 0.5714,
    "mono_gold_judgment": 0.6786,
    "mono_neutral_axial": 0.5357,
    "dual_red_gold": 0.2143,
    "dual_blue_purple": 0.3571,
    "dual_red_green": 0.2143,
    "dual_blue_gold": 0.3571,
    "dual_purple_green": 0.5,
    "dual_red_purple": 0.3929,
    "dual_blue_green": 0.2857,
    "dual_green_gold": 0.4286,
    "dual_purple_gold": 0.3214,
    "dual_red_blue": 0.5714,
    "dual_green_neutral": 0.2857,
    "dual_red_neutral": 0.3214,
    "dual_blue_neutral": 0.4643,
    "dual_purple_neutral": 0.6786,
    "dual_gold_neutral": 0.2857,
    "tri_red_blue_purple": 0.4286,
    "tri_red_green_gold": 0.2857,
    "tri_blue_purple_gold": 0.5625,
    "tri_red_purple_green": 0.3214,
    "tri_blue_green_gold": 0.4286,
    "tri_blue_purple_green": 0.5,
    "tri_red_purple_gold": 0.4643,
    "tri_purple_green_gold": 0.5357,
    "tri_red_blue_green": 0.2857,
    "tri_red_blue_gold": 0.3214,
    "penta_prismatic_crater": 0.3214,
    "penta_free_city_sovereign": 0.3214,
    "penta_wheel_convergence": 0.5
  },
  "dual_red_purple": {
    "mono_green_swarm": 0.5714,
    "mono_green_colossus": 0.6071,
    "mono_green_roots": 0.5714,
    "mono_red_blitz": 0.4643,
    "mono_red_pyroclasm": 0.6786,
    "mono_red_dragon": 0.7857,
    "mono_blue_frost": 0.7857,
    "mono_blue_chrono": 0.9286,
    "mono_blue_abyssal": 0.75,
    "mono_purple_crypt": 0.7143,
    "mono_purple_blood": 0.7857,
    "mono_purple_umbral": 0.5714,
    "mono_gold_phalanx": 0.5714,
    "mono_gold_celestial": 0.8214,
    "mono_gold_judgment": 0.4286,
    "mono_neutral_axial": 0.6071,
    "dual_red_gold": 0.5714,
    "dual_blue_purple": 0.6786,
    "dual_red_green": 0.5357,
    "dual_blue_gold": 0.3929,
    "dual_purple_green": 0.6071,
    "dual_red_purple": 0.5,
    "dual_blue_green": 0.6786,
    "dual_green_gold": 0.3929,
    "dual_purple_gold": 0.4643,
    "dual_red_blue": 0.5,
    "dual_green_neutral": 0.4286,
    "dual_red_neutral": 0.3571,
    "dual_blue_neutral": 0.4286,
    "dual_purple_neutral": 0.6071,
    "dual_gold_neutral": 0.3214,
    "tri_red_blue_purple": 0.6071,
    "tri_red_green_gold": 0.5,
    "tri_blue_purple_gold": 0.375,
    "tri_red_purple_green": 0.4286,
    "tri_blue_green_gold": 0.6071,
    "tri_blue_purple_green": 0.5357,
    "tri_red_purple_gold": 0.3214,
    "tri_purple_green_gold": 0.2143,
    "tri_red_blue_green": 0.4643,
    "tri_red_blue_gold": 0.3571,
    "penta_prismatic_crater": 0.3929,
    "penta_free_city_sovereign": 0.4286,
    "penta_wheel_convergence": 0.4286
  },
  "dual_blue_green": {
    "mono_green_swarm": 0.6429,
    "mono_green_colossus": 0.8214,
    "mono_green_roots": 0.8571,
    "mono_red_blitz": 0.4643,
    "mono_red_pyroclasm": 0.3929,
    "mono_red_dragon": 0.7143,
    "mono_blue_frost": 0.8214,
    "mono_blue_chrono": 0.6429,
    "mono_blue_abyssal": 0.8929,
    "mono_purple_crypt": 0.75,
    "mono_purple_blood": 0.6786,
    "mono_purple_umbral": 0.8571,
    "mono_gold_phalanx": 0.7143,
    "mono_gold_celestial": 0.6786,
    "mono_gold_judgment": 0.8929,
    "mono_neutral_axial": 0.7143,
    "dual_red_gold": 0.5,
    "dual_blue_purple": 0.6786,
    "dual_red_green": 0.6071,
    "dual_blue_gold": 0.6429,
    "dual_purple_green": 0.7143,
    "dual_red_purple": 0.3214,
    "dual_blue_green": 0.5,
    "dual_green_gold": 0.5714,
    "dual_purple_gold": 0.5,
    "dual_red_blue": 0.3571,
    "dual_green_neutral": 0.4643,
    "dual_red_neutral": 0.1786,
    "dual_blue_neutral": 0.6071,
    "dual_purple_neutral": 0.5357,
    "dual_gold_neutral": 0.5714,
    "tri_red_blue_purple": 0.4643,
    "tri_red_green_gold": 0.6429,
    "tri_blue_purple_gold": 0.5313,
    "tri_red_purple_green": 0.3571,
    "tri_blue_green_gold": 0.6071,
    "tri_blue_purple_green": 0.5714,
    "tri_red_purple_gold": 0.25,
    "tri_purple_green_gold": 0.4643,
    "tri_red_blue_green": 0.5,
    "tri_red_blue_gold": 0.4286,
    "penta_prismatic_crater": 0.6071,
    "penta_free_city_sovereign": 0.5,
    "penta_wheel_convergence": 0.5714
  },
  "dual_green_gold": {
    "mono_green_swarm": 0.5357,
    "mono_green_colossus": 0.75,
    "mono_green_roots": 0.6786,
    "mono_red_blitz": 0.7143,
    "mono_red_pyroclasm": 0.7143,
    "mono_red_dragon": 0.6071,
    "mono_blue_frost": 0.5357,
    "mono_blue_chrono": 0.4643,
    "mono_blue_abyssal": 0.7857,
    "mono_purple_crypt": 0.8929,
    "mono_purple_blood": 0.8571,
    "mono_purple_umbral": 0.75,
    "mono_gold_phalanx": 0.5,
    "mono_gold_celestial": 0.6786,
    "mono_gold_judgment": 0.7143,
    "mono_neutral_axial": 0.6071,
    "dual_red_gold": 0.5,
    "dual_blue_purple": 0.7143,
    "dual_red_green": 0.4286,
    "dual_blue_gold": 0.4286,
    "dual_purple_green": 0.5714,
    "dual_red_purple": 0.6071,
    "dual_blue_green": 0.4286,
    "dual_green_gold": 0.5,
    "dual_purple_gold": 0.6071,
    "dual_red_blue": 0.3929,
    "dual_green_neutral": 0.3929,
    "dual_red_neutral": 0.3571,
    "dual_blue_neutral": 0.2857,
    "dual_purple_neutral": 0.9286,
    "dual_gold_neutral": 0.5714,
    "tri_red_blue_purple": 0.5357,
    "tri_red_green_gold": 0.5357,
    "tri_blue_purple_gold": 0.5313,
    "tri_red_purple_green": 0.5714,
    "tri_blue_green_gold": 0.4643,
    "tri_blue_purple_green": 0.5357,
    "tri_red_purple_gold": 0.5357,
    "tri_purple_green_gold": 0.3214,
    "tri_red_blue_green": 0.5,
    "tri_red_blue_gold": 0.3929,
    "penta_prismatic_crater": 0.3214,
    "penta_free_city_sovereign": 0.4643,
    "penta_wheel_convergence": 0.6071
  },
  "dual_purple_gold": {
    "mono_green_swarm": 0.7857,
    "mono_green_colossus": 0.7143,
    "mono_green_roots": 0.75,
    "mono_red_blitz": 0.6071,
    "mono_red_pyroclasm": 0.7857,
    "mono_red_dragon": 0.75,
    "mono_blue_frost": 0.7857,
    "mono_blue_chrono": 0.5,
    "mono_blue_abyssal": 0.7143,
    "mono_purple_crypt": 0.8571,
    "mono_purple_blood": 0.9286,
    "mono_purple_umbral": 0.7143,
    "mono_gold_phalanx": 0.6071,
    "mono_gold_celestial": 0.7143,
    "mono_gold_judgment": 0.7857,
    "mono_neutral_axial": 0.75,
    "dual_red_gold": 0.5714,
    "dual_blue_purple": 0.5,
    "dual_red_green": 0.3929,
    "dual_blue_gold": 0.6071,
    "dual_purple_green": 0.6786,
    "dual_red_purple": 0.5357,
    "dual_blue_green": 0.5,
    "dual_green_gold": 0.3929,
    "dual_purple_gold": 0.5,
    "dual_red_blue": 0.5357,
    "dual_green_neutral": 0.5714,
    "dual_red_neutral": 0.4643,
    "dual_blue_neutral": 0.6071,
    "dual_purple_neutral": 0.6429,
    "dual_gold_neutral": 0.6071,
    "tri_red_blue_purple": 0.6071,
    "tri_red_green_gold": 0.6071,
    "tri_blue_purple_gold": 0.5625,
    "tri_red_purple_green": 0.3929,
    "tri_blue_green_gold": 0.4286,
    "tri_blue_purple_green": 0.4643,
    "tri_red_purple_gold": 0.5,
    "tri_purple_green_gold": 0.3214,
    "tri_red_blue_green": 0.3929,
    "tri_red_blue_gold": 0.3571,
    "penta_prismatic_crater": 0.3929,
    "penta_free_city_sovereign": 0.4643,
    "penta_wheel_convergence": 0.4643
  },
  "dual_red_blue": {
    "mono_green_swarm": 0.4643,
    "mono_green_colossus": 0.6071,
    "mono_green_roots": 0.6786,
    "mono_red_blitz": 0.4286,
    "mono_red_pyroclasm": 0.6786,
    "mono_red_dragon": 0.75,
    "mono_blue_frost": 0.75,
    "mono_blue_chrono": 0.6786,
    "mono_blue_abyssal": 0.75,
    "mono_purple_crypt": 0.75,
    "mono_purple_blood": 0.75,
    "mono_purple_umbral": 0.5,
    "mono_gold_phalanx": 0.6786,
    "mono_gold_celestial": 0.6071,
    "mono_gold_judgment": 0.6786,
    "mono_neutral_axial": 0.4643,
    "dual_red_gold": 0.2857,
    "dual_blue_purple": 0.6071,
    "dual_red_green": 0.4286,
    "dual_blue_gold": 0.4643,
    "dual_purple_green": 0.4286,
    "dual_red_purple": 0.5,
    "dual_blue_green": 0.6429,
    "dual_green_gold": 0.6071,
    "dual_purple_gold": 0.4643,
    "dual_red_blue": 0.5,
    "dual_green_neutral": 0.25,
    "dual_red_neutral": 0.2143,
    "dual_blue_neutral": 0.1786,
    "dual_purple_neutral": 0.4643,
    "dual_gold_neutral": 0.3571,
    "tri_red_blue_purple": 0.5,
    "tri_red_green_gold": 0.5,
    "tri_blue_purple_gold": 0.5,
    "tri_red_purple_green": 0.3571,
    "tri_blue_green_gold": 0.6071,
    "tri_blue_purple_green": 0.5,
    "tri_red_purple_gold": 0.3929,
    "tri_purple_green_gold": 0.5,
    "tri_red_blue_green": 0.3571,
    "tri_red_blue_gold": 0.3571,
    "penta_prismatic_crater": 0.3929,
    "penta_free_city_sovereign": 0.3929,
    "penta_wheel_convergence": 0.5714
  },
  "dual_green_neutral": {
    "mono_green_swarm": 0.6429,
    "mono_green_colossus": 0.8214,
    "mono_green_roots": 0.7917,
    "mono_red_blitz": 0.5,
    "mono_red_pyroclasm": 0.7143,
    "mono_red_dragon": 0.7143,
    "mono_blue_frost": 0.75,
    "mono_blue_chrono": 0.7143,
    "mono_blue_abyssal": 0.8333,
    "mono_purple_crypt": 0.8333,
    "mono_purple_blood": 0.7917,
    "mono_purple_umbral": 0.875,
    "mono_gold_phalanx": 0.6786,
    "mono_gold_celestial": 0.7143,
    "mono_gold_judgment": 0.75,
    "mono_neutral_axial": 0.75,
    "dual_red_gold": 0.5833,
    "dual_blue_purple": 0.6071,
    "dual_red_green": 0.4286,
    "dual_blue_gold": 0.5357,
    "dual_purple_green": 0.7143,
    "dual_red_purple": 0.5714,
    "dual_blue_green": 0.5357,
    "dual_green_gold": 0.6071,
    "dual_purple_gold": 0.4286,
    "dual_red_blue": 0.75,
    "dual_green_neutral": 0.5,
    "dual_red_neutral": 0.5,
    "dual_blue_neutral": 0.5714,
    "dual_purple_neutral": 0.6786,
    "dual_gold_neutral": 0.7143,
    "tri_red_blue_purple": 0.4286,
    "tri_red_green_gold": 0.3214,
    "tri_blue_purple_gold": 0.5,
    "tri_red_purple_green": 0.4583,
    "tri_blue_green_gold": 0.3929,
    "tri_blue_purple_green": 0.8571,
    "tri_red_purple_gold": 0.5,
    "tri_purple_green_gold": 0.5,
    "tri_red_blue_green": 0.5714,
    "tri_red_blue_gold": 0.2917,
    "penta_prismatic_crater": 0.5,
    "penta_free_city_sovereign": 0.6786,
    "penta_wheel_convergence": 0.5
  },
  "dual_red_neutral": {
    "mono_green_swarm": 0.7857,
    "mono_green_colossus": 0.8929,
    "mono_green_roots": 0.7083,
    "mono_red_blitz": 0.6786,
    "mono_red_pyroclasm": 0.8214,
    "mono_red_dragon": 0.75,
    "mono_blue_frost": 0.8214,
    "mono_blue_chrono": 0.8929,
    "mono_blue_abyssal": 0.9583,
    "mono_purple_crypt": 0.75,
    "mono_purple_blood": 0.875,
    "mono_purple_umbral": 0.8333,
    "mono_gold_phalanx": 0.75,
    "mono_gold_celestial": 0.8214,
    "mono_gold_judgment": 0.7143,
    "mono_neutral_axial": 0.7857,
    "dual_red_gold": 0.7083,
    "dual_blue_purple": 0.8929,
    "dual_red_green": 0.6786,
    "dual_blue_gold": 0.5714,
    "dual_purple_green": 0.6786,
    "dual_red_purple": 0.6429,
    "dual_blue_green": 0.8214,
    "dual_green_gold": 0.6429,
    "dual_purple_gold": 0.5357,
    "dual_red_blue": 0.7857,
    "dual_green_neutral": 0.5,
    "dual_red_neutral": 0.5,
    "dual_blue_neutral": 0.8214,
    "dual_purple_neutral": 0.8214,
    "dual_gold_neutral": 0.6786,
    "tri_red_blue_purple": 0.6786,
    "tri_red_green_gold": 0.5714,
    "tri_blue_purple_gold": 0.6875,
    "tri_red_purple_green": 0.5417,
    "tri_blue_green_gold": 0.5714,
    "tri_blue_purple_green": 0.7857,
    "tri_red_purple_gold": 0.4583,
    "tri_purple_green_gold": 0.5714,
    "tri_red_blue_green": 0.8214,
    "tri_red_blue_gold": 0.25,
    "penta_prismatic_crater": 0.8929,
    "penta_free_city_sovereign": 0.8214,
    "penta_wheel_convergence": 0.5357
  },
  "dual_blue_neutral": {
    "mono_green_swarm": 0.7143,
    "mono_green_colossus": 0.8929,
    "mono_green_roots": 0.8214,
    "mono_red_blitz": 0.5357,
    "mono_red_pyroclasm": 0.7143,
    "mono_red_dragon": 0.6071,
    "mono_blue_frost": 0.8571,
    "mono_blue_chrono": 0.75,
    "mono_blue_abyssal": 0.8214,
    "mono_purple_crypt": 0.8214,
    "mono_purple_blood": 0.8929,
    "mono_purple_umbral": 0.5,
    "mono_gold_phalanx": 0.5,
    "mono_gold_celestial": 0.5714,
    "mono_gold_judgment": 0.6429,
    "mono_neutral_axial": 0.7857,
    "dual_red_gold": 0.3929,
    "dual_blue_purple": 0.6786,
    "dual_red_green": 0.4643,
    "dual_blue_gold": 0.6429,
    "dual_purple_green": 0.5357,
    "dual_red_purple": 0.5714,
    "dual_blue_green": 0.3929,
    "dual_green_gold": 0.7143,
    "dual_purple_gold": 0.3929,
    "dual_red_blue": 0.8214,
    "dual_green_neutral": 0.4286,
    "dual_red_neutral": 0.1786,
    "dual_blue_neutral": 0.5,
    "dual_purple_neutral": 0.6071,
    "dual_gold_neutral": 0.5,
    "tri_red_blue_purple": 0.6429,
    "tri_red_green_gold": 0.4643,
    "tri_blue_purple_gold": 0.5,
    "tri_red_purple_green": 0.2857,
    "tri_blue_green_gold": 0.5357,
    "tri_blue_purple_green": 0.4643,
    "tri_red_purple_gold": 0.3214,
    "tri_purple_green_gold": 0.4643,
    "tri_red_blue_green": 0.5357,
    "tri_red_blue_gold": 0.3214,
    "penta_prismatic_crater": 0.6071,
    "penta_free_city_sovereign": 0.6786,
    "penta_wheel_convergence": 0.5357
  },
  "dual_purple_neutral": {
    "mono_green_swarm": 0.5357,
    "mono_green_colossus": 0.6429,
    "mono_green_roots": 0.7143,
    "mono_red_blitz": 0.3214,
    "mono_red_pyroclasm": 0.4643,
    "mono_red_dragon": 0.5357,
    "mono_blue_frost": 0.7857,
    "mono_blue_chrono": 0.5357,
    "mono_blue_abyssal": 0.7857,
    "mono_purple_crypt": 0.4286,
    "mono_purple_blood": 0.6429,
    "mono_purple_umbral": 0.6786,
    "mono_gold_phalanx": 0.5357,
    "mono_gold_celestial": 0.3214,
    "mono_gold_judgment": 0.6786,
    "mono_neutral_axial": 0.4643,
    "dual_red_gold": 0.3214,
    "dual_blue_purple": 0.5,
    "dual_red_green": 0.2857,
    "dual_blue_gold": 0.3571,
    "dual_purple_green": 0.3214,
    "dual_red_purple": 0.3929,
    "dual_blue_green": 0.4643,
    "dual_green_gold": 0.0714,
    "dual_purple_gold": 0.3571,
    "dual_red_blue": 0.5357,
    "dual_green_neutral": 0.3214,
    "dual_red_neutral": 0.1786,
    "dual_blue_neutral": 0.3929,
    "dual_purple_neutral": 0.5,
    "dual_gold_neutral": 0.25,
    "tri_red_blue_purple": 0.5357,
    "tri_red_green_gold": 0.1429,
    "tri_blue_purple_gold": 0.375,
    "tri_red_purple_green": 0.3929,
    "tri_blue_green_gold": 0.3214,
    "tri_blue_purple_green": 0.3214,
    "tri_red_purple_gold": 0.1786,
    "tri_purple_green_gold": 0.3214,
    "tri_red_blue_green": 0.6071,
    "tri_red_blue_gold": 0.25,
    "penta_prismatic_crater": 0.3929,
    "penta_free_city_sovereign": 0.3214,
    "penta_wheel_convergence": 0.5357
  },
  "dual_gold_neutral": {
    "mono_green_swarm": 0.8571,
    "mono_green_colossus": 0.7857,
    "mono_green_roots": 0.8929,
    "mono_red_blitz": 0.6429,
    "mono_red_pyroclasm": 0.8214,
    "mono_red_dragon": 0.7143,
    "mono_blue_frost": 0.7143,
    "mono_blue_chrono": 0.6786,
    "mono_blue_abyssal": 0.6429,
    "mono_purple_crypt": 0.8571,
    "mono_purple_blood": 0.8929,
    "mono_purple_umbral": 0.7857,
    "mono_gold_phalanx": 0.75,
    "mono_gold_celestial": 0.6429,
    "mono_gold_judgment": 0.75,
    "mono_neutral_axial": 0.5714,
    "dual_red_gold": 0.5357,
    "dual_blue_purple": 0.4643,
    "dual_red_green": 0.4643,
    "dual_blue_gold": 0.5357,
    "dual_purple_green": 0.7143,
    "dual_red_purple": 0.6786,
    "dual_blue_green": 0.4286,
    "dual_green_gold": 0.4286,
    "dual_purple_gold": 0.3929,
    "dual_red_blue": 0.6429,
    "dual_green_neutral": 0.2857,
    "dual_red_neutral": 0.3214,
    "dual_blue_neutral": 0.5,
    "dual_purple_neutral": 0.75,
    "dual_gold_neutral": 0.5,
    "tri_red_blue_purple": 0.6786,
    "tri_red_green_gold": 0.7143,
    "tri_blue_purple_gold": 0.3125,
    "tri_red_purple_green": 0.4643,
    "tri_blue_green_gold": 0.3929,
    "tri_blue_purple_green": 0.6786,
    "tri_red_purple_gold": 0.5,
    "tri_purple_green_gold": 0.5714,
    "tri_red_blue_green": 0.5714,
    "tri_red_blue_gold": 0.3214,
    "penta_prismatic_crater": 0.3929,
    "penta_free_city_sovereign": 0.5357,
    "penta_wheel_convergence": 0.4286
  },
  "tri_red_blue_purple": {
    "mono_green_swarm": 0.7857,
    "mono_green_colossus": 0.5714,
    "mono_green_roots": 0.75,
    "mono_red_blitz": 0.3929,
    "mono_red_pyroclasm": 0.8571,
    "mono_red_dragon": 0.6786,
    "mono_blue_frost": 0.5714,
    "mono_blue_chrono": 0.5,
    "mono_blue_abyssal": 0.7143,
    "mono_purple_crypt": 0.4643,
    "mono_purple_blood": 0.3929,
    "mono_purple_umbral": 0.5,
    "mono_gold_phalanx": 0.6071,
    "mono_gold_celestial": 0.6786,
    "mono_gold_judgment": 0.4286,
    "mono_neutral_axial": 0.3571,
    "dual_red_gold": 0.3571,
    "dual_blue_purple": 0.5714,
    "dual_red_green": 0.2143,
    "dual_blue_gold": 0.4643,
    "dual_purple_green": 0.5714,
    "dual_red_purple": 0.3929,
    "dual_blue_green": 0.5357,
    "dual_green_gold": 0.4643,
    "dual_purple_gold": 0.3929,
    "dual_red_blue": 0.5,
    "dual_green_neutral": 0.5714,
    "dual_red_neutral": 0.3214,
    "dual_blue_neutral": 0.3571,
    "dual_purple_neutral": 0.4643,
    "dual_gold_neutral": 0.3214,
    "tri_red_blue_purple": 0.5,
    "tri_red_green_gold": 0.3929,
    "tri_blue_purple_gold": 0.5,
    "tri_red_purple_green": 0.3214,
    "tri_blue_green_gold": 0.3929,
    "tri_blue_purple_green": 0.6429,
    "tri_red_purple_gold": 0.3214,
    "tri_purple_green_gold": 0.4286,
    "tri_red_blue_green": 0.2857,
    "tri_red_blue_gold": 0.1429,
    "penta_prismatic_crater": 0.3214,
    "penta_free_city_sovereign": 0.4286,
    "penta_wheel_convergence": 0.5357
  },
  "tri_red_green_gold": {
    "mono_green_swarm": 0.7143,
    "mono_green_colossus": 0.6786,
    "mono_green_roots": 0.8571,
    "mono_red_blitz": 0.6071,
    "mono_red_pyroclasm": 0.75,
    "mono_red_dragon": 0.7857,
    "mono_blue_frost": 0.7143,
    "mono_blue_chrono": 0.5,
    "mono_blue_abyssal": 0.8571,
    "mono_purple_crypt": 0.8929,
    "mono_purple_blood": 0.75,
    "mono_purple_umbral": 0.6429,
    "mono_gold_phalanx": 0.7143,
    "mono_gold_celestial": 0.6429,
    "mono_gold_judgment": 0.8571,
    "mono_neutral_axial": 0.6429,
    "dual_red_gold": 0.4286,
    "dual_blue_purple": 0.6429,
    "dual_red_green": 0.5357,
    "dual_blue_gold": 0.7143,
    "dual_purple_green": 0.7143,
    "dual_red_purple": 0.5,
    "dual_blue_green": 0.3571,
    "dual_green_gold": 0.4643,
    "dual_purple_gold": 0.3929,
    "dual_red_blue": 0.5,
    "dual_green_neutral": 0.6786,
    "dual_red_neutral": 0.4286,
    "dual_blue_neutral": 0.5357,
    "dual_purple_neutral": 0.8571,
    "dual_gold_neutral": 0.2857,
    "tri_red_blue_purple": 0.6071,
    "tri_red_green_gold": 0.5,
    "tri_blue_purple_gold": 0.4375,
    "tri_red_purple_green": 0.5714,
    "tri_blue_green_gold": 0.5357,
    "tri_blue_purple_green": 0.6429,
    "tri_red_purple_gold": 0.5,
    "tri_purple_green_gold": 0.5714,
    "tri_red_blue_green": 0.5,
    "tri_red_blue_gold": 0.2143,
    "penta_prismatic_crater": 0.5357,
    "penta_free_city_sovereign": 0.5357,
    "penta_wheel_convergence": 0.5357
  },
  "tri_blue_purple_gold": {
    "mono_green_swarm": 0.5938,
    "mono_green_colossus": 0.625,
    "mono_green_roots": 0.75,
    "mono_red_blitz": 0.4375,
    "mono_red_pyroclasm": 0.9688,
    "mono_red_dragon": 0.7188,
    "mono_blue_frost": 0.9063,
    "mono_blue_chrono": 0.4063,
    "mono_blue_abyssal": 0.6875,
    "mono_purple_crypt": 0.75,
    "mono_purple_blood": 0.625,
    "mono_purple_umbral": 0.7813,
    "mono_gold_phalanx": 0.5938,
    "mono_gold_celestial": 0.625,
    "mono_gold_judgment": 0.8438,
    "mono_neutral_axial": 0.5938,
    "dual_red_gold": 0.4063,
    "dual_blue_purple": 0.6563,
    "dual_red_green": 0.4375,
    "dual_blue_gold": 0.4063,
    "dual_purple_green": 0.4375,
    "dual_red_purple": 0.625,
    "dual_blue_green": 0.4688,
    "dual_green_gold": 0.4688,
    "dual_purple_gold": 0.4375,
    "dual_red_blue": 0.5,
    "dual_green_neutral": 0.5,
    "dual_red_neutral": 0.3125,
    "dual_blue_neutral": 0.5,
    "dual_purple_neutral": 0.625,
    "dual_gold_neutral": 0.6875,
    "tri_red_blue_purple": 0.5,
    "tri_red_green_gold": 0.5625,
    "tri_blue_purple_gold": 0.5,
    "tri_red_purple_green": 0.4688,
    "tri_blue_green_gold": 0.4688,
    "tri_blue_purple_green": 0.5938,
    "tri_red_purple_gold": 0.3438,
    "tri_purple_green_gold": 0.3125,
    "tri_red_blue_green": 0.4375,
    "tri_red_blue_gold": 0.25,
    "penta_prismatic_crater": 0.5,
    "penta_free_city_sovereign": 0.5938,
    "penta_wheel_convergence": 0.2813
  },
  "tri_red_purple_green": {
    "mono_green_swarm": 0.8214,
    "mono_green_colossus": 0.8929,
    "mono_green_roots": 0.7917,
    "mono_red_blitz": 0.6071,
    "mono_red_pyroclasm": 0.7857,
    "mono_red_dragon": 0.7857,
    "mono_blue_frost": 0.8929,
    "mono_blue_chrono": 0.8929,
    "mono_blue_abyssal": 0.875,
    "mono_purple_crypt": 0.9583,
    "mono_purple_blood": 0.75,
    "mono_purple_umbral": 0.875,
    "mono_gold_phalanx": 0.8214,
    "mono_gold_celestial": 0.8929,
    "mono_gold_judgment": 0.8214,
    "mono_neutral_axial": 0.6071,
    "dual_red_gold": 0.4167,
    "dual_blue_purple": 0.75,
    "dual_red_green": 0.6429,
    "dual_blue_gold": 0.6429,
    "dual_purple_green": 0.6786,
    "dual_red_purple": 0.5714,
    "dual_blue_green": 0.6429,
    "dual_green_gold": 0.4286,
    "dual_purple_gold": 0.6071,
    "dual_red_blue": 0.6429,
    "dual_green_neutral": 0.5417,
    "dual_red_neutral": 0.4583,
    "dual_blue_neutral": 0.7143,
    "dual_purple_neutral": 0.6071,
    "dual_gold_neutral": 0.5357,
    "tri_red_blue_purple": 0.6786,
    "tri_red_green_gold": 0.4286,
    "tri_blue_purple_gold": 0.5313,
    "tri_red_purple_green": 0.5,
    "tri_blue_green_gold": 0.75,
    "tri_blue_purple_green": 0.7143,
    "tri_red_purple_gold": 0.7083,
    "tri_purple_green_gold": 0.5714,
    "tri_red_blue_green": 0.6071,
    "tri_red_blue_gold": 0.3333,
    "penta_prismatic_crater": 0.6786,
    "penta_free_city_sovereign": 0.6786,
    "penta_wheel_convergence": 0.8214
  },
  "tri_blue_green_gold": {
    "mono_green_swarm": 0.4643,
    "mono_green_colossus": 0.7857,
    "mono_green_roots": 0.75,
    "mono_red_blitz": 0.6429,
    "mono_red_pyroclasm": 0.7857,
    "mono_red_dragon": 0.5357,
    "mono_blue_frost": 0.75,
    "mono_blue_chrono": 0.5,
    "mono_blue_abyssal": 0.6429,
    "mono_purple_crypt": 0.75,
    "mono_purple_blood": 0.75,
    "mono_purple_umbral": 0.6071,
    "mono_gold_phalanx": 0.7857,
    "mono_gold_celestial": 0.6786,
    "mono_gold_judgment": 0.8214,
    "mono_neutral_axial": 0.6786,
    "dual_red_gold": 0.4643,
    "dual_blue_purple": 0.5357,
    "dual_red_green": 0.5357,
    "dual_blue_gold": 0.5714,
    "dual_purple_green": 0.5714,
    "dual_red_purple": 0.3929,
    "dual_blue_green": 0.3929,
    "dual_green_gold": 0.5357,
    "dual_purple_gold": 0.5714,
    "dual_red_blue": 0.3929,
    "dual_green_neutral": 0.6071,
    "dual_red_neutral": 0.4286,
    "dual_blue_neutral": 0.4643,
    "dual_purple_neutral": 0.6786,
    "dual_gold_neutral": 0.6071,
    "tri_red_blue_purple": 0.6071,
    "tri_red_green_gold": 0.4643,
    "tri_blue_purple_gold": 0.5313,
    "tri_red_purple_green": 0.25,
    "tri_blue_green_gold": 0.5,
    "tri_blue_purple_green": 0.5714,
    "tri_red_purple_gold": 0.3214,
    "tri_purple_green_gold": 0.5357,
    "tri_red_blue_green": 0.6429,
    "tri_red_blue_gold": 0.2143,
    "penta_prismatic_crater": 0.3929,
    "penta_free_city_sovereign": 0.6786,
    "penta_wheel_convergence": 0.5714
  },
  "tri_blue_purple_green": {
    "mono_green_swarm": 0.6786,
    "mono_green_colossus": 0.5714,
    "mono_green_roots": 0.6429,
    "mono_red_blitz": 0.6429,
    "mono_red_pyroclasm": 0.6429,
    "mono_red_dragon": 0.6429,
    "mono_blue_frost": 0.5714,
    "mono_blue_chrono": 0.5357,
    "mono_blue_abyssal": 0.7143,
    "mono_purple_crypt": 0.5714,
    "mono_purple_blood": 0.6786,
    "mono_purple_umbral": 0.6786,
    "mono_gold_phalanx": 0.7143,
    "mono_gold_celestial": 0.6786,
    "mono_gold_judgment": 0.6429,
    "mono_neutral_axial": 0.5,
    "dual_red_gold": 0.3214,
    "dual_blue_purple": 0.5,
    "dual_red_green": 0.4286,
    "dual_blue_gold": 0.3571,
    "dual_purple_green": 0.5,
    "dual_red_purple": 0.4643,
    "dual_blue_green": 0.4286,
    "dual_green_gold": 0.4643,
    "dual_purple_gold": 0.5357,
    "dual_red_blue": 0.5,
    "dual_green_neutral": 0.1429,
    "dual_red_neutral": 0.2143,
    "dual_blue_neutral": 0.5357,
    "dual_purple_neutral": 0.6786,
    "dual_gold_neutral": 0.3214,
    "tri_red_blue_purple": 0.3571,
    "tri_red_green_gold": 0.3571,
    "tri_blue_purple_gold": 0.4063,
    "tri_red_purple_green": 0.2857,
    "tri_blue_green_gold": 0.4286,
    "tri_blue_purple_green": 0.5,
    "tri_red_purple_gold": 0.2857,
    "tri_purple_green_gold": 0.3571,
    "tri_red_blue_green": 0.6071,
    "tri_red_blue_gold": 0.25,
    "penta_prismatic_crater": 0.3571,
    "penta_free_city_sovereign": 0.2857,
    "penta_wheel_convergence": 0.4643
  },
  "tri_red_purple_gold": {
    "mono_green_swarm": 0.75,
    "mono_green_colossus": 0.8929,
    "mono_green_roots": 0.7083,
    "mono_red_blitz": 0.5714,
    "mono_red_pyroclasm": 0.7857,
    "mono_red_dragon": 0.6429,
    "mono_blue_frost": 0.75,
    "mono_blue_chrono": 0.7143,
    "mono_blue_abyssal": 0.7917,
    "mono_purple_crypt": 0.75,
    "mono_purple_blood": 0.875,
    "mono_purple_umbral": 0.75,
    "mono_gold_phalanx": 0.7143,
    "mono_gold_celestial": 0.75,
    "mono_gold_judgment": 0.8214,
    "mono_neutral_axial": 0.6786,
    "dual_red_gold": 0.4583,
    "dual_blue_purple": 0.8214,
    "dual_red_green": 0.5714,
    "dual_blue_gold": 0.8571,
    "dual_purple_green": 0.5357,
    "dual_red_purple": 0.6786,
    "dual_blue_green": 0.75,
    "dual_green_gold": 0.4643,
    "dual_purple_gold": 0.5,
    "dual_red_blue": 0.6071,
    "dual_green_neutral": 0.5,
    "dual_red_neutral": 0.5417,
    "dual_blue_neutral": 0.6786,
    "dual_purple_neutral": 0.8214,
    "dual_gold_neutral": 0.5,
    "tri_red_blue_purple": 0.6786,
    "tri_red_green_gold": 0.5,
    "tri_blue_purple_gold": 0.6563,
    "tri_red_purple_green": 0.2917,
    "tri_blue_green_gold": 0.6786,
    "tri_blue_purple_green": 0.7143,
    "tri_red_purple_gold": 0.5,
    "tri_purple_green_gold": 0.3929,
    "tri_red_blue_green": 0.6071,
    "tri_red_blue_gold": 0.625,
    "penta_prismatic_crater": 0.5,
    "penta_free_city_sovereign": 0.6786,
    "penta_wheel_convergence": 0.7143
  },
  "tri_purple_green_gold": {
    "mono_green_swarm": 0.6071,
    "mono_green_colossus": 0.6786,
    "mono_green_roots": 0.7857,
    "mono_red_blitz": 0.6429,
    "mono_red_pyroclasm": 0.8214,
    "mono_red_dragon": 0.6786,
    "mono_blue_frost": 0.8214,
    "mono_blue_chrono": 0.5357,
    "mono_blue_abyssal": 0.7857,
    "mono_purple_crypt": 0.8214,
    "mono_purple_blood": 0.7857,
    "mono_purple_umbral": 0.5714,
    "mono_gold_phalanx": 0.8214,
    "mono_gold_celestial": 0.75,
    "mono_gold_judgment": 0.8929,
    "mono_neutral_axial": 0.7857,
    "dual_red_gold": 0.4286,
    "dual_blue_purple": 0.5714,
    "dual_red_green": 0.5357,
    "dual_blue_gold": 0.6071,
    "dual_purple_green": 0.4643,
    "dual_red_purple": 0.7857,
    "dual_blue_green": 0.5357,
    "dual_green_gold": 0.6786,
    "dual_purple_gold": 0.6786,
    "dual_red_blue": 0.5,
    "dual_green_neutral": 0.5,
    "dual_red_neutral": 0.4286,
    "dual_blue_neutral": 0.5357,
    "dual_purple_neutral": 0.6786,
    "dual_gold_neutral": 0.4286,
    "tri_red_blue_purple": 0.5714,
    "tri_red_green_gold": 0.4286,
    "tri_blue_purple_gold": 0.6875,
    "tri_red_purple_green": 0.4286,
    "tri_blue_green_gold": 0.4643,
    "tri_blue_purple_green": 0.6429,
    "tri_red_purple_gold": 0.6071,
    "tri_purple_green_gold": 0.5,
    "tri_red_blue_green": 0.6071,
    "tri_red_blue_gold": 0.1429,
    "penta_prismatic_crater": 0.4286,
    "penta_free_city_sovereign": 0.5,
    "penta_wheel_convergence": 0.6429
  },
  "tri_red_blue_green": {
    "mono_green_swarm": 0.7143,
    "mono_green_colossus": 0.9286,
    "mono_green_roots": 0.7857,
    "mono_red_blitz": 0.3929,
    "mono_red_pyroclasm": 0.7143,
    "mono_red_dragon": 0.7143,
    "mono_blue_frost": 0.7857,
    "mono_blue_chrono": 0.6429,
    "mono_blue_abyssal": 0.8571,
    "mono_purple_crypt": 0.7857,
    "mono_purple_blood": 0.75,
    "mono_purple_umbral": 0.7143,
    "mono_gold_phalanx": 0.8571,
    "mono_gold_celestial": 0.6786,
    "mono_gold_judgment": 0.7143,
    "mono_neutral_axial": 0.75,
    "dual_red_gold": 0.3214,
    "dual_blue_purple": 0.5,
    "dual_red_green": 0.6786,
    "dual_blue_gold": 0.5,
    "dual_purple_green": 0.7143,
    "dual_red_purple": 0.5357,
    "dual_blue_green": 0.5,
    "dual_green_gold": 0.5,
    "dual_purple_gold": 0.6071,
    "dual_red_blue": 0.6429,
    "dual_green_neutral": 0.4286,
    "dual_red_neutral": 0.1786,
    "dual_blue_neutral": 0.4643,
    "dual_purple_neutral": 0.3929,
    "dual_gold_neutral": 0.4286,
    "tri_red_blue_purple": 0.7143,
    "tri_red_green_gold": 0.5,
    "tri_blue_purple_gold": 0.5625,
    "tri_red_purple_green": 0.3929,
    "tri_blue_green_gold": 0.3571,
    "tri_blue_purple_green": 0.3929,
    "tri_red_purple_gold": 0.3929,
    "tri_purple_green_gold": 0.3929,
    "tri_red_blue_green": 0.5,
    "tri_red_blue_gold": 0.5,
    "penta_prismatic_crater": 0.4643,
    "penta_free_city_sovereign": 0.4643,
    "penta_wheel_convergence": 0.5
  },
  "tri_red_blue_gold": {
    "mono_green_swarm": 0.6786,
    "mono_green_colossus": 0.9286,
    "mono_green_roots": 0.9583,
    "mono_red_blitz": 0.6071,
    "mono_red_pyroclasm": 0.9643,
    "mono_red_dragon": 0.8571,
    "mono_blue_frost": 0.7857,
    "mono_blue_chrono": 0.7857,
    "mono_blue_abyssal": 0.875,
    "mono_purple_crypt": 0.875,
    "mono_purple_blood": 0.875,
    "mono_purple_umbral": 0.875,
    "mono_gold_phalanx": 0.6786,
    "mono_gold_celestial": 0.7143,
    "mono_gold_judgment": 0.8214,
    "mono_neutral_axial": 0.8214,
    "dual_red_gold": 0.6667,
    "dual_blue_purple": 0.8929,
    "dual_red_green": 0.4643,
    "dual_blue_gold": 0.75,
    "dual_purple_green": 0.6786,
    "dual_red_purple": 0.6429,
    "dual_blue_green": 0.5714,
    "dual_green_gold": 0.6071,
    "dual_purple_gold": 0.6429,
    "dual_red_blue": 0.6429,
    "dual_green_neutral": 0.7083,
    "dual_red_neutral": 0.75,
    "dual_blue_neutral": 0.6786,
    "dual_purple_neutral": 0.75,
    "dual_gold_neutral": 0.6786,
    "tri_red_blue_purple": 0.8571,
    "tri_red_green_gold": 0.7857,
    "tri_blue_purple_gold": 0.75,
    "tri_red_purple_green": 0.6667,
    "tri_blue_green_gold": 0.7857,
    "tri_blue_purple_green": 0.75,
    "tri_red_purple_gold": 0.375,
    "tri_purple_green_gold": 0.8571,
    "tri_red_blue_green": 0.5,
    "tri_red_blue_gold": 0.5,
    "penta_prismatic_crater": 0.6429,
    "penta_free_city_sovereign": 0.6786,
    "penta_wheel_convergence": 0.75
  },
  "penta_prismatic_crater": {
    "mono_green_swarm": 0.6429,
    "mono_green_colossus": 0.8571,
    "mono_green_roots": 0.9286,
    "mono_red_blitz": 0.6786,
    "mono_red_pyroclasm": 0.6786,
    "mono_red_dragon": 0.6071,
    "mono_blue_frost": 0.7857,
    "mono_blue_chrono": 0.6429,
    "mono_blue_abyssal": 0.9643,
    "mono_purple_crypt": 0.6786,
    "mono_purple_blood": 0.7143,
    "mono_purple_umbral": 0.7143,
    "mono_gold_phalanx": 0.6786,
    "mono_gold_celestial": 0.6786,
    "mono_gold_judgment": 0.75,
    "mono_neutral_axial": 0.6786,
    "dual_red_gold": 0.5357,
    "dual_blue_purple": 0.8214,
    "dual_red_green": 0.3929,
    "dual_blue_gold": 0.6071,
    "dual_purple_green": 0.6786,
    "dual_red_purple": 0.6071,
    "dual_blue_green": 0.3929,
    "dual_green_gold": 0.6786,
    "dual_purple_gold": 0.6071,
    "dual_red_blue": 0.6071,
    "dual_green_neutral": 0.5,
    "dual_red_neutral": 0.1071,
    "dual_blue_neutral": 0.3929,
    "dual_purple_neutral": 0.6071,
    "dual_gold_neutral": 0.6071,
    "tri_red_blue_purple": 0.6786,
    "tri_red_green_gold": 0.4643,
    "tri_blue_purple_gold": 0.5,
    "tri_red_purple_green": 0.3214,
    "tri_blue_green_gold": 0.6071,
    "tri_blue_purple_green": 0.6429,
    "tri_red_purple_gold": 0.5,
    "tri_purple_green_gold": 0.5714,
    "tri_red_blue_green": 0.5357,
    "tri_red_blue_gold": 0.3571,
    "penta_prismatic_crater": 0.5,
    "penta_free_city_sovereign": 0.6071,
    "penta_wheel_convergence": 0.7143
  },
  "penta_free_city_sovereign": {
    "mono_green_swarm": 0.5357,
    "mono_green_colossus": 0.5357,
    "mono_green_roots": 0.7857,
    "mono_red_blitz": 0.4286,
    "mono_red_pyroclasm": 0.5357,
    "mono_red_dragon": 0.5357,
    "mono_blue_frost": 0.5714,
    "mono_blue_chrono": 0.5357,
    "mono_blue_abyssal": 0.8214,
    "mono_purple_crypt": 0.7857,
    "mono_purple_blood": 0.75,
    "mono_purple_umbral": 0.8214,
    "mono_gold_phalanx": 0.4286,
    "mono_gold_celestial": 0.75,
    "mono_gold_judgment": 0.6786,
    "mono_neutral_axial": 0.5714,
    "dual_red_gold": 0.3214,
    "dual_blue_purple": 0.7143,
    "dual_red_green": 0.3571,
    "dual_blue_gold": 0.5357,
    "dual_purple_green": 0.6786,
    "dual_red_purple": 0.5714,
    "dual_blue_green": 0.5,
    "dual_green_gold": 0.5357,
    "dual_purple_gold": 0.5357,
    "dual_red_blue": 0.6071,
    "dual_green_neutral": 0.3214,
    "dual_red_neutral": 0.1786,
    "dual_blue_neutral": 0.3214,
    "dual_purple_neutral": 0.6786,
    "dual_gold_neutral": 0.4643,
    "tri_red_blue_purple": 0.5714,
    "tri_red_green_gold": 0.4643,
    "tri_blue_purple_gold": 0.4063,
    "tri_red_purple_green": 0.3214,
    "tri_blue_green_gold": 0.3214,
    "tri_blue_purple_green": 0.7143,
    "tri_red_purple_gold": 0.3214,
    "tri_purple_green_gold": 0.5,
    "tri_red_blue_green": 0.5357,
    "tri_red_blue_gold": 0.3214,
    "penta_prismatic_crater": 0.3929,
    "penta_free_city_sovereign": 0.5,
    "penta_wheel_convergence": 0.3571
  },
  "penta_wheel_convergence": {
    "mono_green_swarm": 0.6429,
    "mono_green_colossus": 0.6429,
    "mono_green_roots": 0.6786,
    "mono_red_blitz": 0.6786,
    "mono_red_pyroclasm": 0.5714,
    "mono_red_dragon": 0.5,
    "mono_blue_frost": 0.6786,
    "mono_blue_chrono": 0.3929,
    "mono_blue_abyssal": 0.6429,
    "mono_purple_crypt": 0.8214,
    "mono_purple_blood": 0.6071,
    "mono_purple_umbral": 0.6786,
    "mono_gold_phalanx": 0.8214,
    "mono_gold_celestial": 0.6071,
    "mono_gold_judgment": 0.8571,
    "mono_neutral_axial": 0.4286,
    "dual_red_gold": 0.3214,
    "dual_blue_purple": 0.3929,
    "dual_red_green": 0.2857,
    "dual_blue_gold": 0.3929,
    "dual_purple_green": 0.5,
    "dual_red_purple": 0.5714,
    "dual_blue_green": 0.4286,
    "dual_green_gold": 0.3929,
    "dual_purple_gold": 0.5357,
    "dual_red_blue": 0.4286,
    "dual_green_neutral": 0.5,
    "dual_red_neutral": 0.4643,
    "dual_blue_neutral": 0.4643,
    "dual_purple_neutral": 0.4643,
    "dual_gold_neutral": 0.5714,
    "tri_red_blue_purple": 0.4643,
    "tri_red_green_gold": 0.4643,
    "tri_blue_purple_gold": 0.7188,
    "tri_red_purple_green": 0.1786,
    "tri_blue_green_gold": 0.4286,
    "tri_blue_purple_green": 0.5357,
    "tri_red_purple_gold": 0.2857,
    "tri_purple_green_gold": 0.3571,
    "tri_red_blue_green": 0.5,
    "tri_red_blue_gold": 0.25,
    "penta_prismatic_crater": 0.2857,
    "penta_free_city_sovereign": 0.6429,
    "penta_wheel_convergence": 0.5
  }
};
