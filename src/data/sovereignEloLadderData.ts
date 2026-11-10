import { AiSkillTier, Domain } from '../types/game';
import type { UnifiedChampionId, UnifiedFormatKind } from './aiUnifiedTournamentData';

/**
 * GERADO AUTOMATICAMENTE POR src/scripts/calibrate276SovereignsLeague.ts
 * Liga Oficial de Calibração ELO Multi-Tier (276 Soberanos Individuais: 100 Lendárias + 176 Raras).
 * Âncora: Mediana Grau II = 1200 ELO (Novos jogadores iniciam em 1000 ELO — Ferro Axial).
 * Cada um dos 276 Soberanos possui vínculo 1-para-1 exclusivo com sua própria carta e Grimório Assinatura de 100 cartas.
 */

export interface CalibratedArchetypeTierCell {
  elo: number;
  rd: number;
  games: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
}

export interface SovereignAiLeaderboardEntry {
  sovereignId: string;
  sovereignName: string;
  sovereignTitle: string;
  realmOrigin: string;
  archetypeId: UnifiedChampionId;
  archetypeName: string;
  archetypeSubtitle: string;
  skillTier: AiSkillTier;
  isGrandSovereign: boolean;
  format: UnifiedFormatKind;
  domains: Domain[];
  avatarCardId: string;
  eloRating: number;
  eloRd: number;
  simulatedGames: number;
  simulatedWins: number;
  simulatedLosses: number;
  simulatedWinRate: number;
  tournamentRankTierV?: number;
}

export interface SovereignEloCalibrationSummary {
  generatedAt: string;
  totalProfilesCalibrated: number;
  totalCalibrationMatches: number;
  tier5ChampionshipMatches: number;
  anchorDescription: string;
  bradleyTerryIterations: number;
  logLikelihood: number;
  elapsedSeconds: number;
  tierEloDistribution: Record<
    AiSkillTier,
    { minElo: number; medianElo: number; meanElo: number; maxElo: number }
  >;
}

export const SOVEREIGN_ELO_CALIBRATION_SUMMARY: SovereignEloCalibrationSummary = {
  "generatedAt": "2026-11-10T20:41:00.068Z",
  "totalProfilesCalibrated": 276,
  "totalCalibrationMatches": 103640,
  "tier5ChampionshipMatches": 45402,
  "anchorDescription": "Mediana Tier II Regular = 1200 ELO (FIDE / Bradley-Terry MLE)",
  "bradleyTerryIterations": 501,
  "logLikelihood": -21473.21,
  "elapsedSeconds": 113,
  "tierEloDistribution": {
    "1": {
      "minElo": 653,
      "medianElo": 895,
      "meanElo": 873,
      "maxElo": 1013
    },
    "2": {
      "minElo": 912,
      "medianElo": 1200,
      "meanElo": 1190,
      "maxElo": 1413
    },
    "3": {
      "minElo": 1244,
      "medianElo": 1453,
      "meanElo": 1456,
      "maxElo": 1741
    },
    "4": {
      "minElo": 1375,
      "medianElo": 1603,
      "meanElo": 1601,
      "maxElo": 1713
    },
    "5": {
      "minElo": 1414,
      "medianElo": 1649,
      "meanElo": 1637,
      "maxElo": 1837
    }
  }
};

export const ARCHETYPE_TIER_ELO_MAP: Record<
  UnifiedChampionId,
  Record<AiSkillTier, CalibratedArchetypeTierCell>
> = {
  "mono_green_swarm": {
    "1": {
      "elo": 738,
      "rd": 29,
      "games": 220,
      "wins": 30,
      "losses": 190,
      "draws": 0,
      "winRate": 0.1364
    },
    "2": {
      "elo": 1053,
      "rd": 23,
      "games": 280,
      "wins": 88,
      "losses": 192,
      "draws": 0,
      "winRate": 0.3143
    },
    "3": {
      "elo": 1426,
      "rd": 21,
      "games": 280,
      "wins": 164,
      "losses": 116,
      "draws": 0,
      "winRate": 0.5857
    },
    "4": {
      "elo": 1489,
      "rd": 21,
      "games": 250,
      "wins": 139,
      "losses": 111,
      "draws": 0,
      "winRate": 0.556
    },
    "5": {
      "elo": 1496,
      "rd": 12,
      "games": 2152,
      "wins": 800,
      "losses": 1352,
      "draws": 0,
      "winRate": 0.3717
    }
  },
  "mono_green_colossus": {
    "1": {
      "elo": 556,
      "rd": 33,
      "games": 220,
      "wins": 18,
      "losses": 202,
      "draws": 0,
      "winRate": 0.0818
    },
    "2": {
      "elo": 872,
      "rd": 28,
      "games": 280,
      "wins": 41,
      "losses": 239,
      "draws": 0,
      "winRate": 0.1464
    },
    "3": {
      "elo": 1319,
      "rd": 21,
      "games": 280,
      "wins": 138,
      "losses": 142,
      "draws": 0,
      "winRate": 0.4929
    },
    "4": {
      "elo": 1363,
      "rd": 22,
      "games": 250,
      "wins": 102,
      "losses": 148,
      "draws": 0,
      "winRate": 0.408
    },
    "5": {
      "elo": 1506,
      "rd": 12,
      "games": 2152,
      "wins": 830,
      "losses": 1322,
      "draws": 0,
      "winRate": 0.3857
    }
  },
  "mono_green_roots": {
    "1": {
      "elo": 796,
      "rd": 28,
      "games": 220,
      "wins": 35,
      "losses": 185,
      "draws": 0,
      "winRate": 0.1591
    },
    "2": {
      "elo": 1084,
      "rd": 22,
      "games": 280,
      "wins": 91,
      "losses": 189,
      "draws": 0,
      "winRate": 0.325
    },
    "3": {
      "elo": 1313,
      "rd": 21,
      "games": 280,
      "wins": 132,
      "losses": 148,
      "draws": 0,
      "winRate": 0.4714
    },
    "4": {
      "elo": 1371,
      "rd": 22,
      "games": 250,
      "wins": 113,
      "losses": 137,
      "draws": 0,
      "winRate": 0.452
    },
    "5": {
      "elo": 1431,
      "rd": 12,
      "games": 2146,
      "wins": 629,
      "losses": 1517,
      "draws": 0,
      "winRate": 0.2931
    }
  },
  "mono_red_blitz": {
    "1": {
      "elo": 803,
      "rd": 28,
      "games": 220,
      "wins": 40,
      "losses": 180,
      "draws": 0,
      "winRate": 0.1818
    },
    "2": {
      "elo": 1160,
      "rd": 22,
      "games": 280,
      "wins": 119,
      "losses": 161,
      "draws": 0,
      "winRate": 0.425
    },
    "3": {
      "elo": 1395,
      "rd": 21,
      "games": 280,
      "wins": 149,
      "losses": 131,
      "draws": 0,
      "winRate": 0.5321
    },
    "4": {
      "elo": 1505,
      "rd": 22,
      "games": 250,
      "wins": 146,
      "losses": 104,
      "draws": 0,
      "winRate": 0.584
    },
    "5": {
      "elo": 1554,
      "rd": 12,
      "games": 2152,
      "wins": 959,
      "losses": 1193,
      "draws": 0,
      "winRate": 0.4456
    }
  },
  "mono_red_pyroclasm": {
    "1": {
      "elo": 835,
      "rd": 27,
      "games": 220,
      "wins": 42,
      "losses": 178,
      "draws": 0,
      "winRate": 0.1909
    },
    "2": {
      "elo": 976,
      "rd": 24,
      "games": 280,
      "wins": 60,
      "losses": 220,
      "draws": 0,
      "winRate": 0.2143
    },
    "3": {
      "elo": 1298,
      "rd": 21,
      "games": 280,
      "wins": 127,
      "losses": 153,
      "draws": 0,
      "winRate": 0.4536
    },
    "4": {
      "elo": 1337,
      "rd": 23,
      "games": 250,
      "wins": 95,
      "losses": 155,
      "draws": 0,
      "winRate": 0.38
    },
    "5": {
      "elo": 1467,
      "rd": 12,
      "games": 2152,
      "wins": 722,
      "losses": 1430,
      "draws": 0,
      "winRate": 0.3355
    }
  },
  "mono_red_dragon": {
    "1": {
      "elo": 860,
      "rd": 25,
      "games": 220,
      "wins": 49,
      "losses": 171,
      "draws": 0,
      "winRate": 0.2227
    },
    "2": {
      "elo": 925,
      "rd": 25,
      "games": 280,
      "wins": 55,
      "losses": 225,
      "draws": 0,
      "winRate": 0.1964
    },
    "3": {
      "elo": 1329,
      "rd": 21,
      "games": 280,
      "wins": 141,
      "losses": 139,
      "draws": 0,
      "winRate": 0.5036
    },
    "4": {
      "elo": 1369,
      "rd": 22,
      "games": 250,
      "wins": 108,
      "losses": 142,
      "draws": 0,
      "winRate": 0.432
    },
    "5": {
      "elo": 1499,
      "rd": 12,
      "games": 2152,
      "wins": 812,
      "losses": 1340,
      "draws": 0,
      "winRate": 0.3773
    }
  },
  "mono_blue_frost": {
    "1": {
      "elo": 900,
      "rd": 25,
      "games": 220,
      "wins": 51,
      "losses": 169,
      "draws": 0,
      "winRate": 0.2318
    },
    "2": {
      "elo": 1238,
      "rd": 22,
      "games": 280,
      "wins": 142,
      "losses": 138,
      "draws": 0,
      "winRate": 0.5071
    },
    "3": {
      "elo": 1410,
      "rd": 21,
      "games": 280,
      "wins": 151,
      "losses": 129,
      "draws": 0,
      "winRate": 0.5393
    },
    "4": {
      "elo": 1575,
      "rd": 22,
      "games": 250,
      "wins": 167,
      "losses": 83,
      "draws": 0,
      "winRate": 0.668
    },
    "5": {
      "elo": 1552,
      "rd": 12,
      "games": 2152,
      "wins": 958,
      "losses": 1194,
      "draws": 0,
      "winRate": 0.4452
    }
  },
  "mono_blue_chrono": {
    "1": {
      "elo": 588,
      "rd": 34,
      "games": 220,
      "wins": 13,
      "losses": 207,
      "draws": 0,
      "winRate": 0.0591
    },
    "2": {
      "elo": 1123,
      "rd": 22,
      "games": 280,
      "wins": 103,
      "losses": 177,
      "draws": 0,
      "winRate": 0.3679
    },
    "3": {
      "elo": 1391,
      "rd": 21,
      "games": 280,
      "wins": 145,
      "losses": 135,
      "draws": 0,
      "winRate": 0.5179
    },
    "4": {
      "elo": 1570,
      "rd": 22,
      "games": 250,
      "wins": 162,
      "losses": 88,
      "draws": 0,
      "winRate": 0.648
    },
    "5": {
      "elo": 1565,
      "rd": 12,
      "games": 2152,
      "wins": 994,
      "losses": 1158,
      "draws": 0,
      "winRate": 0.4619
    }
  },
  "mono_blue_abyssal": {
    "1": {
      "elo": 890,
      "rd": 26,
      "games": 220,
      "wins": 54,
      "losses": 166,
      "draws": 0,
      "winRate": 0.2455
    },
    "2": {
      "elo": 1196,
      "rd": 21,
      "games": 280,
      "wins": 110,
      "losses": 170,
      "draws": 0,
      "winRate": 0.3929
    },
    "3": {
      "elo": 1408,
      "rd": 21,
      "games": 280,
      "wins": 159,
      "losses": 121,
      "draws": 0,
      "winRate": 0.5679
    },
    "4": {
      "elo": 1516,
      "rd": 21,
      "games": 250,
      "wins": 149,
      "losses": 101,
      "draws": 0,
      "winRate": 0.596
    },
    "5": {
      "elo": 1492,
      "rd": 12,
      "games": 2152,
      "wins": 787,
      "losses": 1365,
      "draws": 0,
      "winRate": 0.3657
    }
  },
  "mono_purple_crypt": {
    "1": {
      "elo": 872,
      "rd": 26,
      "games": 220,
      "wins": 48,
      "losses": 172,
      "draws": 0,
      "winRate": 0.2182
    },
    "2": {
      "elo": 1119,
      "rd": 22,
      "games": 280,
      "wins": 95,
      "losses": 185,
      "draws": 0,
      "winRate": 0.3393
    },
    "3": {
      "elo": 1442,
      "rd": 21,
      "games": 280,
      "wins": 168,
      "losses": 112,
      "draws": 0,
      "winRate": 0.6
    },
    "4": {
      "elo": 1517,
      "rd": 21,
      "games": 250,
      "wins": 152,
      "losses": 98,
      "draws": 0,
      "winRate": 0.608
    },
    "5": {
      "elo": 1505,
      "rd": 12,
      "games": 2152,
      "wins": 824,
      "losses": 1328,
      "draws": 0,
      "winRate": 0.3829
    }
  },
  "mono_purple_blood": {
    "1": {
      "elo": 471,
      "rd": 35,
      "games": 220,
      "wins": 11,
      "losses": 209,
      "draws": 0,
      "winRate": 0.05
    },
    "2": {
      "elo": 997,
      "rd": 24,
      "games": 280,
      "wins": 72,
      "losses": 208,
      "draws": 0,
      "winRate": 0.2571
    },
    "3": {
      "elo": 1341,
      "rd": 21,
      "games": 280,
      "wins": 136,
      "losses": 144,
      "draws": 0,
      "winRate": 0.4857
    },
    "4": {
      "elo": 1401,
      "rd": 22,
      "games": 250,
      "wins": 117,
      "losses": 133,
      "draws": 0,
      "winRate": 0.468
    },
    "5": {
      "elo": 1419,
      "rd": 12,
      "games": 2152,
      "wins": 600,
      "losses": 1552,
      "draws": 0,
      "winRate": 0.2788
    }
  },
  "mono_purple_umbral": {
    "1": {
      "elo": 643,
      "rd": 32,
      "games": 220,
      "wins": 17,
      "losses": 203,
      "draws": 0,
      "winRate": 0.0773
    },
    "2": {
      "elo": 1109,
      "rd": 22,
      "games": 280,
      "wins": 87,
      "losses": 193,
      "draws": 0,
      "winRate": 0.3107
    },
    "3": {
      "elo": 1465,
      "rd": 21,
      "games": 280,
      "wins": 176,
      "losses": 104,
      "draws": 0,
      "winRate": 0.6286
    },
    "4": {
      "elo": 1490,
      "rd": 21,
      "games": 250,
      "wins": 136,
      "losses": 114,
      "draws": 0,
      "winRate": 0.544
    },
    "5": {
      "elo": 1524,
      "rd": 12,
      "games": 2152,
      "wins": 873,
      "losses": 1279,
      "draws": 0,
      "winRate": 0.4057
    }
  },
  "mono_gold_phalanx": {
    "1": {
      "elo": 939,
      "rd": 25,
      "games": 220,
      "wins": 61,
      "losses": 159,
      "draws": 0,
      "winRate": 0.2773
    },
    "2": {
      "elo": 1259,
      "rd": 22,
      "games": 280,
      "wins": 144,
      "losses": 136,
      "draws": 0,
      "winRate": 0.5143
    },
    "3": {
      "elo": 1450,
      "rd": 21,
      "games": 280,
      "wins": 173,
      "losses": 107,
      "draws": 0,
      "winRate": 0.6179
    },
    "4": {
      "elo": 1514,
      "rd": 21,
      "games": 250,
      "wins": 138,
      "losses": 112,
      "draws": 0,
      "winRate": 0.552
    },
    "5": {
      "elo": 1525,
      "rd": 12,
      "games": 2152,
      "wins": 874,
      "losses": 1278,
      "draws": 0,
      "winRate": 0.4061
    }
  },
  "mono_gold_celestial": {
    "1": {
      "elo": 980,
      "rd": 25,
      "games": 220,
      "wins": 64,
      "losses": 156,
      "draws": 0,
      "winRate": 0.2909
    },
    "2": {
      "elo": 1277,
      "rd": 21,
      "games": 280,
      "wins": 151,
      "losses": 129,
      "draws": 0,
      "winRate": 0.5393
    },
    "3": {
      "elo": 1428,
      "rd": 21,
      "games": 280,
      "wins": 156,
      "losses": 124,
      "draws": 0,
      "winRate": 0.5571
    },
    "4": {
      "elo": 1482,
      "rd": 21,
      "games": 250,
      "wins": 131,
      "losses": 119,
      "draws": 0,
      "winRate": 0.524
    },
    "5": {
      "elo": 1526,
      "rd": 12,
      "games": 2152,
      "wins": 878,
      "losses": 1274,
      "draws": 0,
      "winRate": 0.408
    }
  },
  "mono_gold_judgment": {
    "1": {
      "elo": 918,
      "rd": 25,
      "games": 220,
      "wins": 62,
      "losses": 158,
      "draws": 0,
      "winRate": 0.2818
    },
    "2": {
      "elo": 1179,
      "rd": 21,
      "games": 280,
      "wins": 113,
      "losses": 167,
      "draws": 0,
      "winRate": 0.4036
    },
    "3": {
      "elo": 1415,
      "rd": 21,
      "games": 280,
      "wins": 157,
      "losses": 123,
      "draws": 0,
      "winRate": 0.5607
    },
    "4": {
      "elo": 1463,
      "rd": 21,
      "games": 250,
      "wins": 129,
      "losses": 121,
      "draws": 0,
      "winRate": 0.516
    },
    "5": {
      "elo": 1493,
      "rd": 12,
      "games": 2152,
      "wins": 789,
      "losses": 1363,
      "draws": 0,
      "winRate": 0.3666
    }
  },
  "mono_neutral_axial": {
    "1": {
      "elo": 932,
      "rd": 25,
      "games": 220,
      "wins": 68,
      "losses": 152,
      "draws": 0,
      "winRate": 0.3091
    },
    "2": {
      "elo": 1164,
      "rd": 22,
      "games": 280,
      "wins": 111,
      "losses": 169,
      "draws": 0,
      "winRate": 0.3964
    },
    "3": {
      "elo": 1372,
      "rd": 21,
      "games": 280,
      "wins": 150,
      "losses": 130,
      "draws": 0,
      "winRate": 0.5357
    },
    "4": {
      "elo": 1485,
      "rd": 21,
      "games": 250,
      "wins": 139,
      "losses": 111,
      "draws": 0,
      "winRate": 0.556
    },
    "5": {
      "elo": 1539,
      "rd": 12,
      "games": 2152,
      "wins": 919,
      "losses": 1233,
      "draws": 0,
      "winRate": 0.427
    }
  },
  "dual_red_gold": {
    "1": {
      "elo": 1073,
      "rd": 24,
      "games": 220,
      "wins": 90,
      "losses": 130,
      "draws": 0,
      "winRate": 0.4091
    },
    "2": {
      "elo": 1259,
      "rd": 21,
      "games": 280,
      "wins": 139,
      "losses": 141,
      "draws": 0,
      "winRate": 0.4964
    },
    "3": {
      "elo": 1475,
      "rd": 21,
      "games": 280,
      "wins": 165,
      "losses": 115,
      "draws": 0,
      "winRate": 0.5893
    },
    "4": {
      "elo": 1575,
      "rd": 22,
      "games": 250,
      "wins": 161,
      "losses": 89,
      "draws": 0,
      "winRate": 0.644
    },
    "5": {
      "elo": 1693,
      "rd": 12,
      "games": 2152,
      "wins": 1364,
      "losses": 788,
      "draws": 0,
      "winRate": 0.6338
    }
  },
  "dual_blue_purple": {
    "1": {
      "elo": 900,
      "rd": 26,
      "games": 220,
      "wins": 62,
      "losses": 158,
      "draws": 0,
      "winRate": 0.2818
    },
    "2": {
      "elo": 1251,
      "rd": 21,
      "games": 280,
      "wins": 134,
      "losses": 146,
      "draws": 0,
      "winRate": 0.4786
    },
    "3": {
      "elo": 1481,
      "rd": 21,
      "games": 280,
      "wins": 170,
      "losses": 110,
      "draws": 0,
      "winRate": 0.6071
    },
    "4": {
      "elo": 1551,
      "rd": 21,
      "games": 250,
      "wins": 154,
      "losses": 96,
      "draws": 0,
      "winRate": 0.616
    },
    "5": {
      "elo": 1601,
      "rd": 12,
      "games": 2152,
      "wins": 1096,
      "losses": 1056,
      "draws": 0,
      "winRate": 0.5093
    }
  },
  "dual_red_green": {
    "1": {
      "elo": 932,
      "rd": 25,
      "games": 220,
      "wins": 64,
      "losses": 156,
      "draws": 0,
      "winRate": 0.2909
    },
    "2": {
      "elo": 1118,
      "rd": 22,
      "games": 280,
      "wins": 87,
      "losses": 193,
      "draws": 0,
      "winRate": 0.3107
    },
    "3": {
      "elo": 1402,
      "rd": 21,
      "games": 280,
      "wins": 160,
      "losses": 120,
      "draws": 0,
      "winRate": 0.5714
    },
    "4": {
      "elo": 1590,
      "rd": 22,
      "games": 250,
      "wins": 163,
      "losses": 87,
      "draws": 0,
      "winRate": 0.652
    },
    "5": {
      "elo": 1671,
      "rd": 12,
      "games": 2152,
      "wins": 1305,
      "losses": 847,
      "draws": 0,
      "winRate": 0.6064
    }
  },
  "dual_blue_gold": {
    "1": {
      "elo": 1021,
      "rd": 25,
      "games": 220,
      "wins": 85,
      "losses": 135,
      "draws": 0,
      "winRate": 0.3864
    },
    "2": {
      "elo": 1271,
      "rd": 22,
      "games": 280,
      "wins": 139,
      "losses": 141,
      "draws": 0,
      "winRate": 0.4964
    },
    "3": {
      "elo": 1394,
      "rd": 21,
      "games": 280,
      "wins": 153,
      "losses": 127,
      "draws": 0,
      "winRate": 0.5464
    },
    "4": {
      "elo": 1533,
      "rd": 22,
      "games": 250,
      "wins": 146,
      "losses": 104,
      "draws": 0,
      "winRate": 0.584
    },
    "5": {
      "elo": 1647,
      "rd": 12,
      "games": 2152,
      "wins": 1237,
      "losses": 915,
      "draws": 0,
      "winRate": 0.5748
    }
  },
  "dual_purple_green": {
    "1": {
      "elo": 910,
      "rd": 26,
      "games": 220,
      "wins": 54,
      "losses": 166,
      "draws": 0,
      "winRate": 0.2455
    },
    "2": {
      "elo": 1246,
      "rd": 21,
      "games": 280,
      "wins": 141,
      "losses": 139,
      "draws": 0,
      "winRate": 0.5036
    },
    "3": {
      "elo": 1484,
      "rd": 21,
      "games": 280,
      "wins": 173,
      "losses": 107,
      "draws": 0,
      "winRate": 0.6179
    },
    "4": {
      "elo": 1503,
      "rd": 21,
      "games": 250,
      "wins": 139,
      "losses": 111,
      "draws": 0,
      "winRate": 0.556
    },
    "5": {
      "elo": 1606,
      "rd": 12,
      "games": 2152,
      "wins": 1111,
      "losses": 1041,
      "draws": 0,
      "winRate": 0.5163
    }
  },
  "dual_red_purple": {
    "1": {
      "elo": 916,
      "rd": 26,
      "games": 220,
      "wins": 59,
      "losses": 161,
      "draws": 0,
      "winRate": 0.2682
    },
    "2": {
      "elo": 1225,
      "rd": 21,
      "games": 280,
      "wins": 134,
      "losses": 146,
      "draws": 0,
      "winRate": 0.4786
    },
    "3": {
      "elo": 1527,
      "rd": 22,
      "games": 280,
      "wins": 195,
      "losses": 85,
      "draws": 0,
      "winRate": 0.6964
    },
    "4": {
      "elo": 1575,
      "rd": 21,
      "games": 250,
      "wins": 154,
      "losses": 96,
      "draws": 0,
      "winRate": 0.616
    },
    "5": {
      "elo": 1595,
      "rd": 12,
      "games": 2152,
      "wins": 1078,
      "losses": 1074,
      "draws": 0,
      "winRate": 0.5009
    }
  },
  "dual_blue_green": {
    "1": {
      "elo": 924,
      "rd": 26,
      "games": 220,
      "wins": 59,
      "losses": 161,
      "draws": 0,
      "winRate": 0.2682
    },
    "2": {
      "elo": 1182,
      "rd": 22,
      "games": 280,
      "wins": 113,
      "losses": 167,
      "draws": 0,
      "winRate": 0.4036
    },
    "3": {
      "elo": 1453,
      "rd": 21,
      "games": 280,
      "wins": 174,
      "losses": 106,
      "draws": 0,
      "winRate": 0.6214
    },
    "4": {
      "elo": 1566,
      "rd": 21,
      "games": 250,
      "wins": 154,
      "losses": 96,
      "draws": 0,
      "winRate": 0.616
    },
    "5": {
      "elo": 1646,
      "rd": 12,
      "games": 2152,
      "wins": 1230,
      "losses": 922,
      "draws": 0,
      "winRate": 0.5716
    }
  },
  "dual_green_gold": {
    "1": {
      "elo": 967,
      "rd": 25,
      "games": 220,
      "wins": 71,
      "losses": 149,
      "draws": 0,
      "winRate": 0.3227
    },
    "2": {
      "elo": 1224,
      "rd": 22,
      "games": 280,
      "wins": 133,
      "losses": 147,
      "draws": 0,
      "winRate": 0.475
    },
    "3": {
      "elo": 1447,
      "rd": 21,
      "games": 280,
      "wins": 161,
      "losses": 119,
      "draws": 0,
      "winRate": 0.575
    },
    "4": {
      "elo": 1476,
      "rd": 21,
      "games": 250,
      "wins": 133,
      "losses": 117,
      "draws": 0,
      "winRate": 0.532
    },
    "5": {
      "elo": 1604,
      "rd": 12,
      "games": 2152,
      "wins": 1111,
      "losses": 1041,
      "draws": 0,
      "winRate": 0.5163
    }
  },
  "dual_purple_gold": {
    "1": {
      "elo": 1003,
      "rd": 25,
      "games": 220,
      "wins": 88,
      "losses": 132,
      "draws": 0,
      "winRate": 0.4
    },
    "2": {
      "elo": 1251,
      "rd": 21,
      "games": 280,
      "wins": 136,
      "losses": 144,
      "draws": 0,
      "winRate": 0.4857
    },
    "3": {
      "elo": 1484,
      "rd": 21,
      "games": 280,
      "wins": 173,
      "losses": 107,
      "draws": 0,
      "winRate": 0.6179
    },
    "4": {
      "elo": 1516,
      "rd": 21,
      "games": 250,
      "wins": 145,
      "losses": 105,
      "draws": 0,
      "winRate": 0.58
    },
    "5": {
      "elo": 1636,
      "rd": 12,
      "games": 2152,
      "wins": 1205,
      "losses": 947,
      "draws": 0,
      "winRate": 0.5599
    }
  },
  "dual_red_blue": {
    "1": {
      "elo": 991,
      "rd": 25,
      "games": 220,
      "wins": 75,
      "losses": 145,
      "draws": 0,
      "winRate": 0.3409
    },
    "2": {
      "elo": 1185,
      "rd": 21,
      "games": 280,
      "wins": 108,
      "losses": 172,
      "draws": 0,
      "winRate": 0.3857
    },
    "3": {
      "elo": 1365,
      "rd": 21,
      "games": 280,
      "wins": 142,
      "losses": 138,
      "draws": 0,
      "winRate": 0.5071
    },
    "4": {
      "elo": 1514,
      "rd": 21,
      "games": 250,
      "wins": 142,
      "losses": 108,
      "draws": 0,
      "winRate": 0.568
    },
    "5": {
      "elo": 1609,
      "rd": 12,
      "games": 2152,
      "wins": 1124,
      "losses": 1028,
      "draws": 0,
      "winRate": 0.5223
    }
  },
  "dual_green_neutral": {
    "1": {
      "elo": 873,
      "rd": 26,
      "games": 220,
      "wins": 52,
      "losses": 168,
      "draws": 0,
      "winRate": 0.2364
    },
    "2": {
      "elo": 1198,
      "rd": 22,
      "games": 280,
      "wins": 121,
      "losses": 159,
      "draws": 0,
      "winRate": 0.4321
    },
    "3": {
      "elo": 1510,
      "rd": 21,
      "games": 280,
      "wins": 180,
      "losses": 100,
      "draws": 0,
      "winRate": 0.6429
    },
    "4": {
      "elo": 1664,
      "rd": 23,
      "games": 250,
      "wins": 181,
      "losses": 69,
      "draws": 0,
      "winRate": 0.724
    },
    "5": {
      "elo": 1695,
      "rd": 12,
      "games": 2152,
      "wins": 1369,
      "losses": 783,
      "draws": 0,
      "winRate": 0.6362
    }
  },
  "dual_red_neutral": {
    "1": {
      "elo": 1115,
      "rd": 25,
      "games": 220,
      "wins": 97,
      "losses": 123,
      "draws": 0,
      "winRate": 0.4409
    },
    "2": {
      "elo": 1427,
      "rd": 23,
      "games": 280,
      "wins": 182,
      "losses": 98,
      "draws": 0,
      "winRate": 0.65
    },
    "3": {
      "elo": 1655,
      "rd": 23,
      "games": 280,
      "wins": 218,
      "losses": 62,
      "draws": 0,
      "winRate": 0.7786
    },
    "4": {
      "elo": 1720,
      "rd": 23,
      "games": 250,
      "wins": 191,
      "losses": 59,
      "draws": 0,
      "winRate": 0.764
    },
    "5": {
      "elo": 1771,
      "rd": 12,
      "games": 2152,
      "wins": 1564,
      "losses": 588,
      "draws": 0,
      "winRate": 0.7268
    }
  },
  "dual_blue_neutral": {
    "1": {
      "elo": 886,
      "rd": 26,
      "games": 220,
      "wins": 58,
      "losses": 162,
      "draws": 0,
      "winRate": 0.2636
    },
    "2": {
      "elo": 1173,
      "rd": 22,
      "games": 280,
      "wins": 111,
      "losses": 169,
      "draws": 0,
      "winRate": 0.3964
    },
    "3": {
      "elo": 1420,
      "rd": 21,
      "games": 280,
      "wins": 167,
      "losses": 113,
      "draws": 0,
      "winRate": 0.5964
    },
    "4": {
      "elo": 1582,
      "rd": 22,
      "games": 250,
      "wins": 158,
      "losses": 92,
      "draws": 0,
      "winRate": 0.632
    },
    "5": {
      "elo": 1648,
      "rd": 12,
      "games": 2152,
      "wins": 1237,
      "losses": 915,
      "draws": 0,
      "winRate": 0.5748
    }
  },
  "dual_purple_neutral": {
    "1": {
      "elo": 813,
      "rd": 27,
      "games": 220,
      "wins": 41,
      "losses": 179,
      "draws": 0,
      "winRate": 0.1864
    },
    "2": {
      "elo": 1200,
      "rd": 22,
      "games": 280,
      "wins": 118,
      "losses": 162,
      "draws": 0,
      "winRate": 0.4214
    },
    "3": {
      "elo": 1456,
      "rd": 21,
      "games": 280,
      "wins": 171,
      "losses": 109,
      "draws": 0,
      "winRate": 0.6107
    },
    "4": {
      "elo": 1537,
      "rd": 21,
      "games": 250,
      "wins": 149,
      "losses": 101,
      "draws": 0,
      "winRate": 0.596
    },
    "5": {
      "elo": 1573,
      "rd": 12,
      "games": 2152,
      "wins": 1014,
      "losses": 1138,
      "draws": 0,
      "winRate": 0.4712
    }
  },
  "dual_gold_neutral": {
    "1": {
      "elo": 1126,
      "rd": 25,
      "games": 220,
      "wins": 103,
      "losses": 117,
      "draws": 0,
      "winRate": 0.4682
    },
    "2": {
      "elo": 1293,
      "rd": 21,
      "games": 280,
      "wins": 156,
      "losses": 124,
      "draws": 0,
      "winRate": 0.5571
    },
    "3": {
      "elo": 1538,
      "rd": 21,
      "games": 280,
      "wins": 188,
      "losses": 92,
      "draws": 0,
      "winRate": 0.6714
    },
    "4": {
      "elo": 1594,
      "rd": 22,
      "games": 250,
      "wins": 162,
      "losses": 88,
      "draws": 0,
      "winRate": 0.648
    },
    "5": {
      "elo": 1656,
      "rd": 12,
      "games": 2152,
      "wins": 1259,
      "losses": 893,
      "draws": 0,
      "winRate": 0.585
    }
  },
  "tri_red_blue_purple": {
    "1": {
      "elo": 987,
      "rd": 26,
      "games": 220,
      "wins": 77,
      "losses": 143,
      "draws": 0,
      "winRate": 0.35
    },
    "2": {
      "elo": 1246,
      "rd": 21,
      "games": 280,
      "wins": 133,
      "losses": 147,
      "draws": 0,
      "winRate": 0.475
    },
    "3": {
      "elo": 1421,
      "rd": 21,
      "games": 280,
      "wins": 161,
      "losses": 119,
      "draws": 0,
      "winRate": 0.575
    },
    "4": {
      "elo": 1547,
      "rd": 21,
      "games": 250,
      "wins": 152,
      "losses": 98,
      "draws": 0,
      "winRate": 0.608
    },
    "5": {
      "elo": 1595,
      "rd": 12,
      "games": 2152,
      "wins": 1083,
      "losses": 1069,
      "draws": 0,
      "winRate": 0.5033
    }
  },
  "tri_red_green_gold": {
    "1": {
      "elo": 1020,
      "rd": 24,
      "games": 220,
      "wins": 82,
      "losses": 138,
      "draws": 0,
      "winRate": 0.3727
    },
    "2": {
      "elo": 1183,
      "rd": 22,
      "games": 280,
      "wins": 105,
      "losses": 175,
      "draws": 0,
      "winRate": 0.375
    },
    "3": {
      "elo": 1437,
      "rd": 21,
      "games": 280,
      "wins": 165,
      "losses": 115,
      "draws": 0,
      "winRate": 0.5893
    },
    "4": {
      "elo": 1541,
      "rd": 22,
      "games": 250,
      "wins": 145,
      "losses": 105,
      "draws": 0,
      "winRate": 0.58
    },
    "5": {
      "elo": 1647,
      "rd": 12,
      "games": 2152,
      "wins": 1238,
      "losses": 914,
      "draws": 0,
      "winRate": 0.5753
    }
  },
  "tri_blue_purple_gold": {
    "1": {
      "elo": 961,
      "rd": 25,
      "games": 220,
      "wins": 76,
      "losses": 144,
      "draws": 0,
      "winRate": 0.3455
    },
    "2": {
      "elo": 1317,
      "rd": 22,
      "games": 280,
      "wins": 162,
      "losses": 118,
      "draws": 0,
      "winRate": 0.5786
    },
    "3": {
      "elo": 1587,
      "rd": 22,
      "games": 280,
      "wins": 201,
      "losses": 79,
      "draws": 0,
      "winRate": 0.7179
    },
    "4": {
      "elo": 1592,
      "rd": 22,
      "games": 250,
      "wins": 159,
      "losses": 91,
      "draws": 0,
      "winRate": 0.636
    },
    "5": {
      "elo": 1626,
      "rd": 12,
      "games": 2152,
      "wins": 1172,
      "losses": 980,
      "draws": 0,
      "winRate": 0.5446
    }
  },
  "tri_red_purple_green": {
    "1": {
      "elo": 990,
      "rd": 25,
      "games": 220,
      "wins": 71,
      "losses": 149,
      "draws": 0,
      "winRate": 0.3227
    },
    "2": {
      "elo": 1264,
      "rd": 21,
      "games": 280,
      "wins": 146,
      "losses": 134,
      "draws": 0,
      "winRate": 0.5214
    },
    "3": {
      "elo": 1503,
      "rd": 22,
      "games": 280,
      "wins": 177,
      "losses": 103,
      "draws": 0,
      "winRate": 0.6321
    },
    "4": {
      "elo": 1672,
      "rd": 23,
      "games": 250,
      "wins": 179,
      "losses": 71,
      "draws": 0,
      "winRate": 0.716
    },
    "5": {
      "elo": 1728,
      "rd": 12,
      "games": 2152,
      "wins": 1461,
      "losses": 691,
      "draws": 0,
      "winRate": 0.6789
    }
  },
  "tri_blue_green_gold": {
    "1": {
      "elo": 1046,
      "rd": 25,
      "games": 220,
      "wins": 89,
      "losses": 131,
      "draws": 0,
      "winRate": 0.4045
    },
    "2": {
      "elo": 1241,
      "rd": 21,
      "games": 280,
      "wins": 126,
      "losses": 154,
      "draws": 0,
      "winRate": 0.45
    },
    "3": {
      "elo": 1418,
      "rd": 21,
      "games": 280,
      "wins": 160,
      "losses": 120,
      "draws": 0,
      "winRate": 0.5714
    },
    "4": {
      "elo": 1524,
      "rd": 21,
      "games": 250,
      "wins": 137,
      "losses": 113,
      "draws": 0,
      "winRate": 0.548
    },
    "5": {
      "elo": 1644,
      "rd": 12,
      "games": 2152,
      "wins": 1227,
      "losses": 925,
      "draws": 0,
      "winRate": 0.5702
    }
  },
  "tri_blue_purple_green": {
    "1": {
      "elo": 1051,
      "rd": 24,
      "games": 220,
      "wins": 89,
      "losses": 131,
      "draws": 0,
      "winRate": 0.4045
    },
    "2": {
      "elo": 1227,
      "rd": 21,
      "games": 280,
      "wins": 128,
      "losses": 152,
      "draws": 0,
      "winRate": 0.4571
    },
    "3": {
      "elo": 1507,
      "rd": 21,
      "games": 280,
      "wins": 184,
      "losses": 96,
      "draws": 0,
      "winRate": 0.6571
    },
    "4": {
      "elo": 1540,
      "rd": 21,
      "games": 250,
      "wins": 146,
      "losses": 104,
      "draws": 0,
      "winRate": 0.584
    },
    "5": {
      "elo": 1596,
      "rd": 12,
      "games": 2152,
      "wins": 1084,
      "losses": 1068,
      "draws": 0,
      "winRate": 0.5037
    }
  },
  "tri_red_purple_gold": {
    "1": {
      "elo": 1131,
      "rd": 25,
      "games": 220,
      "wins": 107,
      "losses": 113,
      "draws": 0,
      "winRate": 0.4864
    },
    "2": {
      "elo": 1332,
      "rd": 22,
      "games": 280,
      "wins": 158,
      "losses": 122,
      "draws": 0,
      "winRate": 0.5643
    },
    "3": {
      "elo": 1627,
      "rd": 22,
      "games": 280,
      "wins": 210,
      "losses": 70,
      "draws": 0,
      "winRate": 0.75
    },
    "4": {
      "elo": 1615,
      "rd": 22,
      "games": 250,
      "wins": 169,
      "losses": 81,
      "draws": 0,
      "winRate": 0.676
    },
    "5": {
      "elo": 1712,
      "rd": 12,
      "games": 2152,
      "wins": 1414,
      "losses": 738,
      "draws": 0,
      "winRate": 0.6571
    }
  },
  "tri_purple_green_gold": {
    "1": {
      "elo": 986,
      "rd": 26,
      "games": 220,
      "wins": 81,
      "losses": 139,
      "draws": 0,
      "winRate": 0.3682
    },
    "2": {
      "elo": 1198,
      "rd": 22,
      "games": 280,
      "wins": 106,
      "losses": 174,
      "draws": 0,
      "winRate": 0.3786
    },
    "3": {
      "elo": 1473,
      "rd": 21,
      "games": 280,
      "wins": 174,
      "losses": 106,
      "draws": 0,
      "winRate": 0.6214
    },
    "4": {
      "elo": 1568,
      "rd": 22,
      "games": 250,
      "wins": 155,
      "losses": 95,
      "draws": 0,
      "winRate": 0.62
    },
    "5": {
      "elo": 1663,
      "rd": 12,
      "games": 2152,
      "wins": 1279,
      "losses": 873,
      "draws": 0,
      "winRate": 0.5943
    }
  },
  "tri_red_blue_green": {
    "1": {
      "elo": 1014,
      "rd": 24,
      "games": 220,
      "wins": 79,
      "losses": 141,
      "draws": 0,
      "winRate": 0.3591
    },
    "2": {
      "elo": 1116,
      "rd": 22,
      "games": 280,
      "wins": 90,
      "losses": 190,
      "draws": 0,
      "winRate": 0.3214
    },
    "3": {
      "elo": 1461,
      "rd": 21,
      "games": 280,
      "wins": 168,
      "losses": 112,
      "draws": 0,
      "winRate": 0.6
    },
    "4": {
      "elo": 1618,
      "rd": 22,
      "games": 250,
      "wins": 167,
      "losses": 83,
      "draws": 0,
      "winRate": 0.668
    },
    "5": {
      "elo": 1657,
      "rd": 12,
      "games": 2152,
      "wins": 1265,
      "losses": 887,
      "draws": 0,
      "winRate": 0.5878
    }
  },
  "tri_red_blue_gold": {
    "1": {
      "elo": 1093,
      "rd": 25,
      "games": 220,
      "wins": 95,
      "losses": 125,
      "draws": 0,
      "winRate": 0.4318
    },
    "2": {
      "elo": 1285,
      "rd": 22,
      "games": 280,
      "wins": 147,
      "losses": 133,
      "draws": 0,
      "winRate": 0.525
    },
    "3": {
      "elo": 1496,
      "rd": 21,
      "games": 280,
      "wins": 170,
      "losses": 110,
      "draws": 0,
      "winRate": 0.6071
    },
    "4": {
      "elo": 1727,
      "rd": 24,
      "games": 250,
      "wins": 196,
      "losses": 54,
      "draws": 0,
      "winRate": 0.784
    },
    "5": {
      "elo": 1771,
      "rd": 12,
      "games": 2146,
      "wins": 1563,
      "losses": 583,
      "draws": 0,
      "winRate": 0.7283
    }
  },
  "penta_prismatic_crater": {
    "1": {
      "elo": 1088,
      "rd": 25,
      "games": 220,
      "wins": 91,
      "losses": 129,
      "draws": 0,
      "winRate": 0.4136
    },
    "2": {
      "elo": 1252,
      "rd": 22,
      "games": 280,
      "wins": 132,
      "losses": 148,
      "draws": 0,
      "winRate": 0.4714
    },
    "3": {
      "elo": 1479,
      "rd": 21,
      "games": 280,
      "wins": 173,
      "losses": 107,
      "draws": 0,
      "winRate": 0.6179
    },
    "4": {
      "elo": 1596,
      "rd": 22,
      "games": 250,
      "wins": 160,
      "losses": 90,
      "draws": 0,
      "winRate": 0.64
    },
    "5": {
      "elo": 1667,
      "rd": 12,
      "games": 2152,
      "wins": 1293,
      "losses": 859,
      "draws": 0,
      "winRate": 0.6008
    }
  },
  "penta_free_city_sovereign": {
    "1": {
      "elo": 986,
      "rd": 25,
      "games": 220,
      "wins": 78,
      "losses": 142,
      "draws": 0,
      "winRate": 0.3545
    },
    "2": {
      "elo": 1120,
      "rd": 22,
      "games": 280,
      "wins": 93,
      "losses": 187,
      "draws": 0,
      "winRate": 0.3321
    },
    "3": {
      "elo": 1479,
      "rd": 21,
      "games": 280,
      "wins": 178,
      "losses": 102,
      "draws": 0,
      "winRate": 0.6357
    },
    "4": {
      "elo": 1569,
      "rd": 22,
      "games": 250,
      "wins": 154,
      "losses": 96,
      "draws": 0,
      "winRate": 0.616
    },
    "5": {
      "elo": 1649,
      "rd": 12,
      "games": 2152,
      "wins": 1240,
      "losses": 912,
      "draws": 0,
      "winRate": 0.5762
    }
  },
  "penta_wheel_convergence": {
    "1": {
      "elo": 1115,
      "rd": 24,
      "games": 220,
      "wins": 96,
      "losses": 124,
      "draws": 0,
      "winRate": 0.4364
    },
    "2": {
      "elo": 1311,
      "rd": 22,
      "games": 280,
      "wins": 157,
      "losses": 123,
      "draws": 0,
      "winRate": 0.5607
    },
    "3": {
      "elo": 1474,
      "rd": 21,
      "games": 280,
      "wins": 170,
      "losses": 110,
      "draws": 0,
      "winRate": 0.6071
    },
    "4": {
      "elo": 1619,
      "rd": 22,
      "games": 250,
      "wins": 173,
      "losses": 77,
      "draws": 0,
      "winRate": 0.692
    },
    "5": {
      "elo": 1645,
      "rd": 12,
      "games": 2152,
      "wins": 1228,
      "losses": 924,
      "draws": 0,
      "winRate": 0.5706
    }
  }
};

export const SOVEREIGN_AI_LEADERBOARD_ROSTER: SovereignAiLeaderboardEntry[] = [
  {
    "sovereignId": "sov_t5_dual_red_neutral",
    "sovereignName": "Pyrrakon, General da Roda Vulcânica",
    "sovereignTitle": "Grão-Soberano • Bigorna Suprema de Pyros",
    "realmOrigin": "Pacto Pyros-Axial",
    "archetypeId": "dual_red_neutral",
    "archetypeName": "Aliança da Artilharia de Mercúrio",
    "archetypeSubtitle": "Aliança 🔥+⚙️ • Tropas de Choque & Assassinos Relojoeiros",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "bicolor",
    "domains": [
      "red",
      "neutral"
    ],
    "avatarCardId": "red_173_general_roda_chama",
    "eloRating": 1837,
    "eloRd": 24,
    "simulatedGames": 184,
    "simulatedWins": 122,
    "simulatedLosses": 62,
    "simulatedWinRate": 0.663,
    "tournamentRankTierV": 1
  },
  {
    "sovereignId": "sov_gold_07_dragao_ouro",
    "sovereignName": "Aurarius, Majestade do Sol",
    "sovereignTitle": "Grão-Soberano • Pico da Alvorada em Solária",
    "realmOrigin": "Bastião Dourado de Aethelgard",
    "archetypeId": "tri_red_blue_gold",
    "archetypeName": "Conclave da Chama Celeste",
    "archetypeSubtitle": "Tríade ☀️+🔥+❄️ • Esquadra Aérea, Escudo Divino & Feitiçaria",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "tricolor",
    "domains": [
      "gold",
      "red",
      "blue"
    ],
    "avatarCardId": "gold_07_dragao_ouro",
    "eloRating": 1831,
    "eloRd": 23,
    "simulatedGames": 188,
    "simulatedWins": 125,
    "simulatedLosses": 63,
    "simulatedWinRate": 0.6649
  },
  {
    "sovereignId": "sov_t5_tri_red_purple_green",
    "sovereignName": "Necrothor, Monarca do Trono de Ossos",
    "sovereignTitle": "Grão-Soberano • Ossário Real do Vale do Eclipse",
    "realmOrigin": "Tríade Pyros-Eclipse-Veridia",
    "archetypeId": "tri_red_purple_green",
    "archetypeName": "Corte da Lua Sangrenta",
    "archetypeSubtitle": "Tríade 🔥+💀+🌿 • Frenesi Predatório, Cripta & Atropelar",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "tricolor",
    "domains": [
      "red",
      "purple",
      "green"
    ],
    "avatarCardId": "purple_138_soberano_carnica",
    "eloRating": 1814,
    "eloRd": 22,
    "simulatedGames": 210,
    "simulatedWins": 133,
    "simulatedLosses": 77,
    "simulatedWinRate": 0.6333,
    "tournamentRankTierV": 3
  },
  {
    "sovereignId": "sov_t5_tri_red_blue_gold",
    "sovereignName": "Heliokar, General da Roda Celeste",
    "sovereignTitle": "Grão-Soberano • Zimbório Dourado de Solária",
    "realmOrigin": "Tríade Pyros-Vórtex-Solária",
    "archetypeId": "tri_red_blue_gold",
    "archetypeName": "Conclave da Chama Celeste",
    "archetypeSubtitle": "Tríade ☀️+🔥+❄️ • Esquadra Aérea, Escudo Divino & Feitiçaria",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "tricolor",
    "domains": [
      "gold",
      "red",
      "blue"
    ],
    "avatarCardId": "gold_173_general_roda_sol",
    "eloRating": 1811,
    "eloRd": 23,
    "simulatedGames": 198,
    "simulatedWins": 125,
    "simulatedLosses": 73,
    "simulatedWinRate": 0.6313,
    "tournamentRankTierV": 2
  },
  {
    "sovereignId": "sov_t5_dual_red_gold",
    "sovereignName": "Khorvath, O Dragão Vulcânico Ancião",
    "sovereignTitle": "Grão-Soberano • Trono da Cratera Alta (Pyros)",
    "realmOrigin": "Aliança Pyros-Solária",
    "archetypeId": "dual_red_gold",
    "archetypeName": "Pacto das Escamas Imperiais",
    "archetypeSubtitle": "Pacto Duplo 🔥+☀️ • Dragões Solares & Escudo Divino",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "bicolor",
    "domains": [
      "red",
      "gold"
    ],
    "avatarCardId": "red_100_dragao_vulcanico_anciao",
    "eloRating": 1783,
    "eloRd": 22,
    "simulatedGames": 210,
    "simulatedWins": 126,
    "simulatedLosses": 84,
    "simulatedWinRate": 0.6,
    "tournamentRankTierV": 6
  },
  {
    "sovereignId": "sov_t5_dual_red_green",
    "sovereignName": "Ignarok, o Devorador de Reinos",
    "sovereignTitle": "Grão-Soberano • Planícies Calcinadas do Centro",
    "realmOrigin": "Aliança Pyros-Veridia",
    "archetypeId": "dual_red_green",
    "archetypeName": "Pacto da Ruína Selvagem",
    "archetypeSubtitle": "Pacto Duplo 🔥+🌿 • Rampa Vulcânica, Ímpeto & Atropelar",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "bicolor",
    "domains": [
      "red",
      "green"
    ],
    "avatarCardId": "red_46_tirano_carmesim",
    "eloRating": 1754,
    "eloRd": 20,
    "simulatedGames": 266,
    "simulatedWins": 162,
    "simulatedLosses": 104,
    "simulatedWinRate": 0.609,
    "tournamentRankTierV": 7
  },
  {
    "sovereignId": "sov_neutral_97_caracol_mangual_prisma",
    "sovereignName": "Caracol-Mangual de Casco Prismático",
    "sovereignTitle": "Comandante Regional • Coliseu Externo dos Selos",
    "realmOrigin": "Fronteira Cinzenta — Centro Axial",
    "archetypeId": "dual_red_neutral",
    "archetypeName": "Aliança da Artilharia de Mercúrio",
    "archetypeSubtitle": "Aliança 🔥+⚙️ • Tropas de Choque & Assassinos Relojoeiros",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "red",
      "neutral"
    ],
    "avatarCardId": "neutral_97_caracol_mangual_prisma",
    "eloRating": 1741,
    "eloRd": 21,
    "simulatedGames": 236,
    "simulatedWins": 132,
    "simulatedLosses": 104,
    "simulatedWinRate": 0.5593
  },
  {
    "sovereignId": "sov_t5_dual_green_neutral",
    "sovereignName": "Aetherion, O Dragão do Vácuo Astral",
    "sovereignTitle": "Grão-Soberano • Horizonte Estelar da Fronteira Cinzenta",
    "realmOrigin": "Pacto Veridia-Axial",
    "archetypeId": "dual_green_neutral",
    "archetypeName": "Aliança dos Engenhos Silvestres",
    "archetypeSubtitle": "Aliança 🌿+⚙️ • Colossos de Madeira-Ferro & Guildas Axiais",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "bicolor",
    "domains": [
      "green",
      "neutral"
    ],
    "avatarCardId": "neutral_54_dragao_etereo",
    "eloRating": 1736,
    "eloRd": 21,
    "simulatedGames": 232,
    "simulatedWins": 124,
    "simulatedLosses": 108,
    "simulatedWinRate": 0.5345,
    "tournamentRankTierV": 5
  },
  {
    "sovereignId": "sov_t5_tri_blue_green_gold",
    "sovereignName": "Aurion-Sol, O Dragão Imperial do Zênite",
    "sovereignTitle": "Grão-Soberano • Trono Alto do Bastião dos Sete Sóis",
    "realmOrigin": "Tríade Vórtex-Veridia-Solária",
    "archetypeId": "tri_blue_green_gold",
    "archetypeName": "Escamas do Horizonte Eterno",
    "archetypeSubtitle": "Tríade ☀️+🌿+❄️ • Falange Radiante, Rampa & Voo Astral",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "tricolor",
    "domains": [
      "gold",
      "green",
      "blue"
    ],
    "avatarCardId": "gold_100_dragao_imperial_ouro",
    "eloRating": 1732,
    "eloRd": 20,
    "simulatedGames": 262,
    "simulatedWins": 151,
    "simulatedLosses": 111,
    "simulatedWinRate": 0.5763,
    "tournamentRankTierV": 17
  },
  {
    "sovereignId": "sov_neutral_172_armada_draconica_matriz",
    "sovereignName": "Armada Dracônica do Prisma",
    "sovereignTitle": "Grão-Soberano • Zênite Cinzento sobre a Torre Axial",
    "realmOrigin": "Cidade Franca & Torre dos Cinco Selos",
    "archetypeId": "tri_red_green_gold",
    "archetypeName": "Tríade dos Titãs da Forja Primordial",
    "archetypeSubtitle": "Tríade 🔥+🌿+☀️ • Rampa Colossal, Escudo Divino & Sopro Dracônico",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "tricolor",
    "domains": [
      "red",
      "green",
      "gold"
    ],
    "avatarCardId": "neutral_172_armada_draconica_matriz",
    "eloRating": 1731,
    "eloRd": 20,
    "simulatedGames": 250,
    "simulatedWins": 138,
    "simulatedLosses": 112,
    "simulatedWinRate": 0.552
  },
  {
    "sovereignId": "sov_red_137_dragao_cometa_rubro",
    "sovereignName": "Dragão do Cometa Carmesim",
    "sovereignTitle": "Comandante Regional • Atalaia — Fornalhas de Escamas Eternas",
    "realmOrigin": "Infraforja Magmática de Ignaroth",
    "archetypeId": "dual_red_neutral",
    "archetypeName": "Aliança da Artilharia de Mercúrio",
    "archetypeSubtitle": "Aliança 🔥+⚙️ • Tropas de Choque & Assassinos Relojoeiros",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "red",
      "neutral"
    ],
    "avatarCardId": "red_137_dragao_cometa_rubro",
    "eloRating": 1731,
    "eloRd": 20,
    "simulatedGames": 250,
    "simulatedWins": 137,
    "simulatedLosses": 113,
    "simulatedWinRate": 0.548
  },
  {
    "sovereignId": "sov_neutral_119_colosso_vonindod_fragmento",
    "sovereignName": "Titã Ferrostor, O Devastador de Dragões",
    "sovereignTitle": "Grão-Soberano • Cratera de Adamantina (Fronteira Cinzenta)",
    "realmOrigin": "Cidade Franca & Torre dos Cinco Selos",
    "archetypeId": "tri_red_purple_green",
    "archetypeName": "Corte da Lua Sangrenta",
    "archetypeSubtitle": "Tríade 🔥+💀+🌿 • Frenesi Predatório, Cripta & Atropelar",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "tricolor",
    "domains": [
      "red",
      "purple",
      "green"
    ],
    "avatarCardId": "neutral_119_colosso_vonindod_fragmento",
    "eloRating": 1728,
    "eloRd": 20,
    "simulatedGames": 250,
    "simulatedWins": 135,
    "simulatedLosses": 115,
    "simulatedWinRate": 0.54
  },
  {
    "sovereignId": "sov_t5_penta_free_city_sovereign",
    "sovereignName": "Valkyra, Imperatriz Pentacromática",
    "sovereignTitle": "Grão-Soberano • Cume do Monte Axial (Fronteira Cinzenta)",
    "realmOrigin": "Cidade Franca Axial",
    "archetypeId": "penta_free_city_sovereign",
    "archetypeName": "Concílio Supremo da Cidade Franca",
    "archetypeSubtitle": "Ápice Pentacromático ☀️🌿🔥❄️💀+⚙️ • Valkyra & Torre dos Cinco Selos",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "pentachromatic",
    "domains": [
      "gold",
      "green",
      "red",
      "blue",
      "purple"
    ],
    "avatarCardId": "neutral_10_valkyra_pentacromatica",
    "eloRating": 1722,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 137,
    "simulatedLosses": 115,
    "simulatedWinRate": 0.5437,
    "tournamentRankTierV": 12
  },
  {
    "sovereignId": "sov_red_118_tita_basalto",
    "sovereignName": "Titã do Núcleo de Basalto",
    "sovereignTitle": "Comandante Regional • Reduto — Forte da Escória",
    "realmOrigin": "Infraforja Magmática de Ignaroth",
    "archetypeId": "dual_red_neutral",
    "archetypeName": "Aliança da Artilharia de Mercúrio",
    "archetypeSubtitle": "Aliança 🔥+⚙️ • Tropas de Choque & Assassinos Relojoeiros",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "red",
      "neutral"
    ],
    "avatarCardId": "red_118_tita_basalto",
    "eloRating": 1721,
    "eloRd": 19,
    "simulatedGames": 280,
    "simulatedWins": 158,
    "simulatedLosses": 122,
    "simulatedWinRate": 0.5643
  },
  {
    "sovereignId": "sov_t5_penta_wheel_convergence",
    "sovereignName": "Vaelkor, General da Roda Prismática",
    "sovereignTitle": "Grão-Soberano • Átrio Axial da Torre dos Cinco Selos",
    "realmOrigin": "Ápice da Roda",
    "archetypeId": "penta_wheel_convergence",
    "archetypeName": "Convergência da Roda Horológica",
    "archetypeSubtitle": "Ápice Pentacromático ❄️☀️💀🔥🌿+⚙️ • Vaelkor & Generais da Roda",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "pentachromatic",
    "domains": [
      "blue",
      "gold",
      "purple",
      "red",
      "green"
    ],
    "avatarCardId": "neutral_173_general_roda_matriz",
    "eloRating": 1719,
    "eloRd": 20,
    "simulatedGames": 272,
    "simulatedWins": 156,
    "simulatedLosses": 116,
    "simulatedWinRate": 0.5735,
    "tournamentRankTierV": 18
  },
  {
    "sovereignId": "sov_t5_tri_red_green_gold",
    "sovereignName": "Rex Primordial da Cratera Perdida",
    "sovereignTitle": "Grão-Soberano • Cratera Perdida do Sul de Veridia",
    "realmOrigin": "Tríade Pyros-Veridia-Solária",
    "archetypeId": "tri_red_green_gold",
    "archetypeName": "Tríade dos Titãs da Forja Primordial",
    "archetypeSubtitle": "Tríade 🔥+🌿+☀️ • Rampa Colossal, Escudo Divino & Sopro Dracônico",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "tricolor",
    "domains": [
      "red",
      "green",
      "gold"
    ],
    "avatarCardId": "green_67_tiranossauro_alfa",
    "eloRating": 1717,
    "eloRd": 20,
    "simulatedGames": 260,
    "simulatedWins": 144,
    "simulatedLosses": 116,
    "simulatedWinRate": 0.5538,
    "tournamentRankTierV": 14
  },
  {
    "sovereignId": "sov_t5_tri_red_purple_gold",
    "sovereignName": "Pyroclasmos, Imperador das Chamas",
    "sovereignTitle": "Grão-Soberano • Cidadela Superior de Pyros",
    "realmOrigin": "Tríade Pyros-Eclipse-Solária",
    "archetypeId": "tri_red_purple_gold",
    "archetypeName": "Eclipse do Sol Carmesim",
    "archetypeSubtitle": "Tríade ☀️+🔥+💀 • Serafins Sanguinários, Dreno & Artilharia",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "tricolor",
    "domains": [
      "gold",
      "red",
      "purple"
    ],
    "avatarCardId": "red_119_soberano_piroclasma",
    "eloRating": 1714,
    "eloRd": 20,
    "simulatedGames": 268,
    "simulatedWins": 145,
    "simulatedLosses": 123,
    "simulatedWinRate": 0.541,
    "tournamentRankTierV": 4
  },
  {
    "sovereignId": "sov_neutral_44_dragao_relogio",
    "sovereignName": "Draco Horológico de Aeternus",
    "sovereignTitle": "Grão-Soberano • Oficinas da Torre Cinzenta",
    "realmOrigin": "Fronteira Cinzenta — Centro Axial",
    "archetypeId": "penta_prismatic_crater",
    "archetypeName": "Soberania da Cratera Prismática",
    "archetypeSubtitle": "Ápice Pentacromático 🔥❄️💀🌿☀️ • Dragões do Prisma & Primeira Fratura",
    "skillTier": 4,
    "isGrandSovereign": true,
    "format": "pentachromatic",
    "domains": [
      "red",
      "blue",
      "purple",
      "green",
      "gold"
    ],
    "avatarCardId": "neutral_44_dragao_relogio",
    "eloRating": 1713,
    "eloRd": 19,
    "simulatedGames": 284,
    "simulatedWins": 166,
    "simulatedLosses": 118,
    "simulatedWinRate": 0.5845
  },
  {
    "sovereignId": "sov_t5_penta_prismatic_crater",
    "sovereignName": "Matriz do Prisma Primordial",
    "sovereignTitle": "Grão-Soberano • Eixo Partido do Zênite (Monte Axial)",
    "realmOrigin": "Cratera Prismática",
    "archetypeId": "penta_prismatic_crater",
    "archetypeName": "Soberania da Cratera Prismática",
    "archetypeSubtitle": "Ápice Pentacromático 🔥❄️💀🌿☀️ • Dragões do Prisma & Primeira Fratura",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "pentachromatic",
    "domains": [
      "red",
      "blue",
      "purple",
      "green",
      "gold"
    ],
    "avatarCardId": "neutral_167_arauto_prisma_matriz",
    "eloRating": 1713,
    "eloRd": 20,
    "simulatedGames": 264,
    "simulatedWins": 145,
    "simulatedLosses": 119,
    "simulatedWinRate": 0.5492,
    "tournamentRankTierV": 8
  },
  {
    "sovereignId": "sov_t5_dual_purple_gold",
    "sovereignName": "Nyxaroth, General da Roda Fúnebre",
    "sovereignTitle": "Grão-Soberano • Nave Sem Luz da Catedral de Obsidiana",
    "realmOrigin": "Aliança Eclipse-Solária",
    "archetypeId": "dual_purple_gold",
    "archetypeName": "Pacto da Inquisição Crepuscular",
    "archetypeSubtitle": "Pacto Duplo 💀+☀️ • Dreno Solar, Renascer & Veredito",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "bicolor",
    "domains": [
      "purple",
      "gold"
    ],
    "avatarCardId": "purple_173_general_roda_abismo",
    "eloRating": 1711,
    "eloRd": 20,
    "simulatedGames": 264,
    "simulatedWins": 140,
    "simulatedLosses": 124,
    "simulatedWinRate": 0.5303,
    "tournamentRankTierV": 19
  },
  {
    "sovereignId": "sov_t5_tri_red_blue_green",
    "sovereignName": "Belphegor, Regente da Cidadela Ardente",
    "sovereignTitle": "Grão-Soberano • Bastilha de Ferro de Pyros",
    "realmOrigin": "Tríade Pyros-Vórtex-Veridia",
    "archetypeId": "tri_red_blue_green",
    "archetypeName": "Tempestade Elemental Primeva",
    "archetypeSubtitle": "Tríade 🔥+🌿+❄️ • Rampa Relâmpago, Leviatãs & Sopro Glacial",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "tricolor",
    "domains": [
      "red",
      "green",
      "blue"
    ],
    "avatarCardId": "red_47_arquiduque_ferro",
    "eloRating": 1707,
    "eloRd": 20,
    "simulatedGames": 268,
    "simulatedWins": 144,
    "simulatedLosses": 124,
    "simulatedWinRate": 0.5373,
    "tournamentRankTierV": 10
  },
  {
    "sovereignId": "sov_neutral_113_gigante_pedra_entalhador",
    "sovereignName": "Gigante Entalhador de Monólitos",
    "sovereignTitle": "Comandante Regional • Reduto — Monólito da Trégua",
    "realmOrigin": "Cratera da Fratura Prismática",
    "archetypeId": "dual_red_neutral",
    "archetypeName": "Aliança da Artilharia de Mercúrio",
    "archetypeSubtitle": "Aliança 🔥+⚙️ • Tropas de Choque & Assassinos Relojoeiros",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "red",
      "neutral"
    ],
    "avatarCardId": "neutral_113_gigante_pedra_entalhador",
    "eloRating": 1699,
    "eloRd": 20,
    "simulatedGames": 256,
    "simulatedWins": 137,
    "simulatedLosses": 119,
    "simulatedWinRate": 0.5352
  },
  {
    "sovereignId": "sov_neutral_116_harshnag_machado_inverno",
    "sovereignName": "Skrym-Khor, O Gigante Quebra-Tronos",
    "sovereignTitle": "Grão-Soberano • Cordilheira da Espinha Cinzenta",
    "realmOrigin": "Cratera da Fratura Prismática",
    "archetypeId": "tri_red_purple_gold",
    "archetypeName": "Eclipse do Sol Carmesim",
    "archetypeSubtitle": "Tríade ☀️+🔥+💀 • Serafins Sanguinários, Dreno & Artilharia",
    "skillTier": 4,
    "isGrandSovereign": true,
    "format": "tricolor",
    "domains": [
      "gold",
      "red",
      "purple"
    ],
    "avatarCardId": "neutral_116_harshnag_machado_inverno",
    "eloRating": 1694,
    "eloRd": 19,
    "simulatedGames": 284,
    "simulatedWins": 162,
    "simulatedLosses": 122,
    "simulatedWinRate": 0.5704
  },
  {
    "sovereignId": "sov_t5_tri_blue_purple_gold",
    "sovereignName": "Zephyros, O Dragão da Tempestade Astral",
    "sovereignTitle": "Grão-Soberano • Estreito das Tempestades (Vórtex)",
    "realmOrigin": "Tríade Vórtex-Eclipse-Solária",
    "archetypeId": "tri_blue_purple_gold",
    "archetypeName": "Relicário do Trono Eterno",
    "archetypeSubtitle": "Tríade ☀️+❄️+💀 • Cidadela de Relíquias, Cronomancia & Veredito",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "tricolor",
    "domains": [
      "gold",
      "blue",
      "purple"
    ],
    "avatarCardId": "blue_97_draco_relampago",
    "eloRating": 1689,
    "eloRd": 19,
    "simulatedGames": 292,
    "simulatedWins": 161,
    "simulatedLosses": 131,
    "simulatedWinRate": 0.5514,
    "tournamentRankTierV": 20
  },
  {
    "sovereignId": "sov_t5_dual_blue_gold",
    "sovereignName": "Aurelius, Soberano Dragão da Alvorada",
    "sovereignTitle": "Grão-Soberano • Catedral dos Sete Sóis (Solária)",
    "realmOrigin": "Aliança Vórtex-Solária",
    "archetypeId": "dual_blue_gold",
    "archetypeName": "Pacto da Forja do Zênite",
    "archetypeSubtitle": "Pacto Duplo ❄️+☀️ • Cidadela Cronomante & Escudo Celeste",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "bicolor",
    "domains": [
      "blue",
      "gold"
    ],
    "avatarCardId": "gold_157_dragao_soberano_alvorada",
    "eloRating": 1687,
    "eloRd": 19,
    "simulatedGames": 276,
    "simulatedWins": 150,
    "simulatedLosses": 126,
    "simulatedWinRate": 0.5435,
    "tournamentRankTierV": 15
  },
  {
    "sovereignId": "sov_t5_dual_blue_green",
    "sovereignName": "Cryonax, General da Roda Astral",
    "sovereignTitle": "Grão-Soberano • Câmara do Astrolábio Frio (Vórtex)",
    "realmOrigin": "Aliança Vórtex-Veridia",
    "archetypeId": "dual_blue_green",
    "archetypeName": "Pacto da Evolução Quimérica",
    "archetypeSubtitle": "Pacto Duplo ❄️+🌿 • Rampa Arcana, Compra & Leviatãs",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "bicolor",
    "domains": [
      "blue",
      "green"
    ],
    "avatarCardId": "blue_173_general_roda_gelo",
    "eloRating": 1687,
    "eloRd": 19,
    "simulatedGames": 280,
    "simulatedWins": 148,
    "simulatedLosses": 132,
    "simulatedWinRate": 0.5286,
    "tournamentRankTierV": 16
  },
  {
    "sovereignId": "sov_neutral_120_xanathar_senhor_crime",
    "sovereignName": "Oculus-Vex, O Olho Mecânico do Submundo",
    "sovereignTitle": "Grão-Soberano • Galerias Subterrâneas do Porto Neutro",
    "realmOrigin": "Cratera da Fratura Prismática",
    "archetypeId": "penta_prismatic_crater",
    "archetypeName": "Soberania da Cratera Prismática",
    "archetypeSubtitle": "Ápice Pentacromático 🔥❄️💀🌿☀️ • Dragões do Prisma & Primeira Fratura",
    "skillTier": 4,
    "isGrandSovereign": true,
    "format": "pentachromatic",
    "domains": [
      "red",
      "blue",
      "purple",
      "green",
      "gold"
    ],
    "avatarCardId": "neutral_120_xanathar_senhor_crime",
    "eloRating": 1685,
    "eloRd": 19,
    "simulatedGames": 288,
    "simulatedWins": 158,
    "simulatedLosses": 130,
    "simulatedWinRate": 0.5486
  },
  {
    "sovereignId": "sov_t5_tri_purple_green_gold",
    "sovereignName": "Hyperion, Deus-Imperador da Aurora",
    "sovereignTitle": "Grão-Soberano • Cúpula Dourada de Solária",
    "realmOrigin": "Tríade Eclipse-Veridia-Solária",
    "archetypeId": "tri_purple_green_gold",
    "archetypeName": "Armada do Zênite Umbral",
    "archetypeSubtitle": "Tríade ☀️+🌿+💀 • Bastião Imortal, Regeneração & Renascer",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "tricolor",
    "domains": [
      "gold",
      "green",
      "purple"
    ],
    "avatarCardId": "gold_138_imperador_sol_supremo",
    "eloRating": 1681,
    "eloRd": 19,
    "simulatedGames": 288,
    "simulatedWins": 159,
    "simulatedLosses": 129,
    "simulatedWinRate": 0.5521,
    "tournamentRankTierV": 9
  },
  {
    "sovereignId": "sov_t5_dual_blue_neutral",
    "sovereignName": "Chronos, Guardião do Eixo Eterno",
    "sovereignTitle": "Grão-Soberano • Pináculo Polar de Vórtex",
    "realmOrigin": "Pacto Vórtex-Axial",
    "archetypeId": "dual_blue_neutral",
    "archetypeName": "Aliança do Astrolábio Arcano",
    "archetypeSubtitle": "Aliança ❄️+⚙️ • Controle Horológico, Alcance & Voo",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "bicolor",
    "domains": [
      "blue",
      "neutral"
    ],
    "avatarCardId": "blue_81_arconte_cronos",
    "eloRating": 1679,
    "eloRd": 19,
    "simulatedGames": 288,
    "simulatedWins": 159,
    "simulatedLosses": 129,
    "simulatedWinRate": 0.5521,
    "tournamentRankTierV": 13
  },
  {
    "sovereignId": "sov_t5_dual_red_blue",
    "sovereignName": "Bael-Khor, General do Chicote Ígneo",
    "sovereignTitle": "Grão-Soberano • Fronteira de Basalto",
    "realmOrigin": "Aliança Pyros-Vórtex",
    "archetypeId": "dual_red_blue",
    "archetypeName": "Pacto do Fogo Astral",
    "archetypeSubtitle": "Pacto Duplo 🔥+❄️ • Artilharia Arcana, Voo & Tempestade",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "bicolor",
    "domains": [
      "red",
      "blue"
    ],
    "avatarCardId": "red_99_senhor_balor_fogo",
    "eloRating": 1678,
    "eloRd": 19,
    "simulatedGames": 280,
    "simulatedWins": 142,
    "simulatedLosses": 138,
    "simulatedWinRate": 0.5071,
    "tournamentRankTierV": 21
  },
  {
    "sovereignId": "sov_purple_119_soberano_entropia",
    "sovereignName": "Malakor, Imperador da Entropia",
    "sovereignTitle": "Grão-Soberano • Catedral de Obsidiana (Vale do Eclipse)",
    "realmOrigin": "Fossa Submersa da Catedral Afogada",
    "archetypeId": "tri_red_purple_green",
    "archetypeName": "Corte da Lua Sangrenta",
    "archetypeSubtitle": "Tríade 🔥+💀+🌿 • Frenesi Predatório, Cripta & Atropelar",
    "skillTier": 4,
    "isGrandSovereign": true,
    "format": "tricolor",
    "domains": [
      "red",
      "purple",
      "green"
    ],
    "avatarCardId": "purple_119_soberano_entropia",
    "eloRating": 1673,
    "eloRd": 20,
    "simulatedGames": 264,
    "simulatedWins": 136,
    "simulatedLosses": 128,
    "simulatedWinRate": 0.5152
  },
  {
    "sovereignId": "sov_blue_63_leviata_primordial",
    "sovereignName": "Thalassia, A Maré Devoradora",
    "sovereignTitle": "Grão-Soberano • Mar Circular de Vórtex",
    "realmOrigin": "Arquipélago Astral das Estrelas Mortas",
    "archetypeId": "tri_red_blue_green",
    "archetypeName": "Tempestade Elemental Primeva",
    "archetypeSubtitle": "Tríade 🔥+🌿+❄️ • Rampa Relâmpago, Leviatãs & Sopro Glacial",
    "skillTier": 4,
    "isGrandSovereign": true,
    "format": "tricolor",
    "domains": [
      "red",
      "green",
      "blue"
    ],
    "avatarCardId": "blue_63_leviata_primordial",
    "eloRating": 1667,
    "eloRd": 19,
    "simulatedGames": 292,
    "simulatedWins": 157,
    "simulatedLosses": 135,
    "simulatedWinRate": 0.5377
  },
  {
    "sovereignId": "sov_blue_117_arconte_astral",
    "sovereignName": "Orion, Arconte da Tempestade Astral",
    "sovereignTitle": "Grão-Soberano • Observatório Superior de Vórtex",
    "realmOrigin": "Arquipélago Astral das Estrelas Mortas",
    "archetypeId": "tri_blue_purple_gold",
    "archetypeName": "Relicário do Trono Eterno",
    "archetypeSubtitle": "Tríade ☀️+❄️+💀 • Cidadela de Relíquias, Cronomancia & Veredito",
    "skillTier": 4,
    "isGrandSovereign": true,
    "format": "tricolor",
    "domains": [
      "gold",
      "blue",
      "purple"
    ],
    "avatarCardId": "blue_117_arconte_astral",
    "eloRating": 1665,
    "eloRd": 19,
    "simulatedGames": 284,
    "simulatedWins": 149,
    "simulatedLosses": 135,
    "simulatedWinRate": 0.5246
  },
  {
    "sovereignId": "sov_red_172_armada_draconica_chama",
    "sovereignName": "Hoste Dracônica da Cratera",
    "sovereignTitle": "Grão-Soberano • Abóbada Vulcânica do Norte (Pyros)",
    "realmOrigin": "Caldeira Imperial de Vulcanor",
    "archetypeId": "tri_red_green_gold",
    "archetypeName": "Tríade dos Titãs da Forja Primordial",
    "archetypeSubtitle": "Tríade 🔥+🌿+☀️ • Rampa Colossal, Escudo Divino & Sopro Dracônico",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "tricolor",
    "domains": [
      "red",
      "green",
      "gold"
    ],
    "avatarCardId": "red_172_armada_draconica_chama",
    "eloRating": 1664,
    "eloRd": 19,
    "simulatedGames": 296,
    "simulatedWins": 165,
    "simulatedLosses": 131,
    "simulatedWinRate": 0.5574
  },
  {
    "sovereignId": "sov_neutral_09_baphometis_abismo",
    "sovereignName": "Tauron-Khor, Titã Quebra-Tronos",
    "sovereignTitle": "Grão-Soberano • Labirinto de Ferro da Fronteira Cinzenta",
    "realmOrigin": "Cidade Franca & Torre dos Cinco Selos",
    "archetypeId": "penta_prismatic_crater",
    "archetypeName": "Soberania da Cratera Prismática",
    "archetypeSubtitle": "Ápice Pentacromático 🔥❄️💀🌿☀️ • Dragões do Prisma & Primeira Fratura",
    "skillTier": 4,
    "isGrandSovereign": true,
    "format": "pentachromatic",
    "domains": [
      "red",
      "blue",
      "purple",
      "green",
      "gold"
    ],
    "avatarCardId": "neutral_09_baphometis_abismo",
    "eloRating": 1664,
    "eloRd": 19,
    "simulatedGames": 296,
    "simulatedWins": 164,
    "simulatedLosses": 132,
    "simulatedWinRate": 0.5541
  },
  {
    "sovereignId": "sov_t5_dual_green_gold",
    "sovereignName": "Sylvanor, o Coração do Mundo",
    "sovereignTitle": "Grão-Soberano • Bosque Matriz de Veridia",
    "realmOrigin": "Aliança Veridia-Solária",
    "archetypeId": "dual_green_gold",
    "archetypeName": "Pacto da Aurora Silvestre",
    "archetypeSubtitle": "Pacto Duplo 🌿+☀️ • Falange dos Mil Escudos & Hinos Globais",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "bicolor",
    "domains": [
      "green",
      "gold"
    ],
    "avatarCardId": "green_50_avatar_gaia",
    "eloRating": 1662,
    "eloRd": 19,
    "simulatedGames": 284,
    "simulatedWins": 143,
    "simulatedLosses": 141,
    "simulatedWinRate": 0.5035,
    "tournamentRankTierV": 23
  },
  {
    "sovereignId": "sov_red_83_dragao_cataclismo",
    "sovereignName": "Pyraxis, Soberano da Ruína Solar",
    "sovereignTitle": "Grão-Soberano • Pico da Cinza Negra (Pyros)",
    "realmOrigin": "Caldeira Imperial de Vulcanor",
    "archetypeId": "dual_red_purple",
    "archetypeName": "Pacto da Chama Sangrenta",
    "archetypeSubtitle": "Pacto Duplo 🔥+💀 • Blitz Sanguinária, Dreno & Último Suspiro",
    "skillTier": 4,
    "isGrandSovereign": true,
    "format": "bicolor",
    "domains": [
      "red",
      "purple"
    ],
    "avatarCardId": "red_83_dragao_cataclismo",
    "eloRating": 1661,
    "eloRd": 19,
    "simulatedGames": 304,
    "simulatedWins": 172,
    "simulatedLosses": 132,
    "simulatedWinRate": 0.5658
  },
  {
    "sovereignId": "sov_blue_172_armada_draconica_gelo",
    "sovereignName": "Esquadra Dracônica da Nevasca",
    "sovereignTitle": "Grão-Soberano • Frente Ciclônica de Vórtex",
    "realmOrigin": "Pináculo Polar de Cristália",
    "archetypeId": "tri_red_blue_purple",
    "archetypeName": "Cataclismo da Convergência Astral",
    "archetypeSubtitle": "Tríade ❄️+🔥+💀 • Estase, Fogo Piroclástico & Execução Umbral",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "tricolor",
    "domains": [
      "blue",
      "red",
      "purple"
    ],
    "avatarCardId": "blue_172_armada_draconica_gelo",
    "eloRating": 1656,
    "eloRd": 19,
    "simulatedGames": 288,
    "simulatedWins": 150,
    "simulatedLosses": 138,
    "simulatedWinRate": 0.5208
  },
  {
    "sovereignId": "sov_t5_tri_blue_purple_green",
    "sovereignName": "Mephistar, O Demônio do Pacto Eterno",
    "sovereignTitle": "Grão-Soberano • Arquivo Negro da Catedral de Obsidiana",
    "realmOrigin": "Tríade Vórtex-Eclipse-Veridia",
    "archetypeId": "tri_blue_purple_green",
    "archetypeName": "Quimera da Fossa Abissal",
    "archetypeSubtitle": "Tríade ❄️+💀+🌿 • Evolução Necrótica, Estase & Cripta Viva",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "tricolor",
    "domains": [
      "blue",
      "purple",
      "green"
    ],
    "avatarCardId": "purple_83_arquidemonio_tempo",
    "eloRating": 1653,
    "eloRd": 19,
    "simulatedGames": 284,
    "simulatedWins": 144,
    "simulatedLosses": 140,
    "simulatedWinRate": 0.507,
    "tournamentRankTierV": 27
  },
  {
    "sovereignId": "sov_red_65_dragao_magma_anciao",
    "sovereignName": "Magmarok, o Tirano Piroclástico",
    "sovereignTitle": "Grão-Soberano • Rio de Lava da Concordata Rubro-Solar",
    "realmOrigin": "Caldeira Imperial de Vulcanor",
    "archetypeId": "dual_red_blue",
    "archetypeName": "Pacto do Fogo Astral",
    "archetypeSubtitle": "Pacto Duplo 🔥+❄️ • Artilharia Arcana, Voo & Tempestade",
    "skillTier": 4,
    "isGrandSovereign": true,
    "format": "bicolor",
    "domains": [
      "red",
      "blue"
    ],
    "avatarCardId": "red_65_dragao_magma_anciao",
    "eloRating": 1652,
    "eloRd": 19,
    "simulatedGames": 288,
    "simulatedWins": 159,
    "simulatedLosses": 129,
    "simulatedWinRate": 0.5521
  },
  {
    "sovereignId": "sov_green_24_verme_purpura",
    "sovereignName": "Leviatã Verme das Fendas",
    "sovereignTitle": "Grão-Soberano • Galerias Tectônicas de Veridia",
    "realmOrigin": "Galhada Viva — Cidadela da Árvore-Mãe",
    "archetypeId": "tri_red_green_gold",
    "archetypeName": "Tríade dos Titãs da Forja Primordial",
    "archetypeSubtitle": "Tríade 🔥+🌿+☀️ • Rampa Colossal, Escudo Divino & Sopro Dracônico",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "tricolor",
    "domains": [
      "red",
      "green",
      "gold"
    ],
    "avatarCardId": "green_24_verme_purpura",
    "eloRating": 1652,
    "eloRd": 19,
    "simulatedGames": 288,
    "simulatedWins": 145,
    "simulatedLosses": 143,
    "simulatedWinRate": 0.5035
  },
  {
    "sovereignId": "sov_t5_dual_gold_neutral",
    "sovereignName": "Aldous, Grande Cronista do Bestiário",
    "sovereignTitle": "Grão-Soberano • Grande Biblioteca da Fronteira",
    "realmOrigin": "Pacto Solária-Axial",
    "archetypeId": "dual_gold_neutral",
    "archetypeName": "Aliança do Bastião Relojoeiro",
    "archetypeSubtitle": "Aliança ☀️+⚙️ • Falange de Ferro Meteórico & Escudo Real",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "bicolor",
    "domains": [
      "gold",
      "neutral"
    ],
    "avatarCardId": "neutral_118_volothamp_cronista_mundos",
    "eloRating": 1649,
    "eloRd": 19,
    "simulatedGames": 296,
    "simulatedWins": 163,
    "simulatedLosses": 133,
    "simulatedWinRate": 0.5507,
    "tournamentRankTierV": 11
  },
  {
    "sovereignId": "sov_green_103_dragao_floresta_anciao",
    "sovereignName": "Silvathor, O Dragão-Floresta Ancião",
    "sovereignTitle": "Grão-Soberano • Coração de Raiz-Ferro (Veridia)",
    "realmOrigin": "Galhada Viva — Cidadela da Árvore-Mãe",
    "archetypeId": "dual_blue_green",
    "archetypeName": "Pacto da Evolução Quimérica",
    "archetypeSubtitle": "Pacto Duplo ❄️+🌿 • Rampa Arcana, Compra & Leviatãs",
    "skillTier": 4,
    "isGrandSovereign": true,
    "format": "bicolor",
    "domains": [
      "blue",
      "green"
    ],
    "avatarCardId": "green_103_dragao_floresta_anciao",
    "eloRating": 1648,
    "eloRd": 19,
    "simulatedGames": 312,
    "simulatedWins": 178,
    "simulatedLosses": 134,
    "simulatedWinRate": 0.5705
  },
  {
    "sovereignId": "sov_gold_172_armada_draconica_sol",
    "sovereignName": "Armada Dracônica do Zênite",
    "sovereignTitle": "Grão-Soberano • Cunha Celeste de Solária",
    "realmOrigin": "Bastião Dourado de Aethelgard",
    "archetypeId": "tri_blue_purple_gold",
    "archetypeName": "Relicário do Trono Eterno",
    "archetypeSubtitle": "Tríade ☀️+❄️+💀 • Cidadela de Relíquias, Cronomancia & Veredito",
    "skillTier": 4,
    "isGrandSovereign": true,
    "format": "tricolor",
    "domains": [
      "gold",
      "blue",
      "purple"
    ],
    "avatarCardId": "gold_172_armada_draconica_sol",
    "eloRating": 1647,
    "eloRd": 19,
    "simulatedGames": 300,
    "simulatedWins": 161,
    "simulatedLosses": 139,
    "simulatedWinRate": 0.5367
  },
  {
    "sovereignId": "sov_neutral_122_rei_hekaton_neutro_arbitro",
    "sovereignName": "Atlas-Khor, O Regente do Ordenamento",
    "sovereignTitle": "Grão-Soberano • Trono da Rocha Submersa",
    "realmOrigin": "Cidade Franca & Torre dos Cinco Selos",
    "archetypeId": "penta_free_city_sovereign",
    "archetypeName": "Concílio Supremo da Cidade Franca",
    "archetypeSubtitle": "Ápice Pentacromático ☀️🌿🔥❄️💀+⚙️ • Valkyra & Torre dos Cinco Selos",
    "skillTier": 4,
    "isGrandSovereign": true,
    "format": "pentachromatic",
    "domains": [
      "gold",
      "green",
      "red",
      "blue",
      "purple"
    ],
    "avatarCardId": "neutral_122_rei_hekaton_neutro_arbitro",
    "eloRating": 1642,
    "eloRd": 19,
    "simulatedGames": 304,
    "simulatedWins": 172,
    "simulatedLosses": 132,
    "simulatedWinRate": 0.5658
  },
  {
    "sovereignId": "sov_green_172_armada_draconica_selva",
    "sovereignName": "Enxame Dracônico Ancestral",
    "sovereignTitle": "Grão-Soberano • Dossel Ascendente de Veridia",
    "realmOrigin": "Galhada Viva — Cidadela da Árvore-Mãe",
    "archetypeId": "tri_purple_green_gold",
    "archetypeName": "Armada do Zênite Umbral",
    "archetypeSubtitle": "Tríade ☀️+🌿+💀 • Bastião Imortal, Regeneração & Renascer",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "tricolor",
    "domains": [
      "gold",
      "green",
      "purple"
    ],
    "avatarCardId": "green_172_armada_draconica_selva",
    "eloRating": 1641,
    "eloRd": 19,
    "simulatedGames": 282,
    "simulatedWins": 147,
    "simulatedLosses": 135,
    "simulatedWinRate": 0.5213
  },
  {
    "sovereignId": "sov_neutral_121_vizeran_arquimago_exilado",
    "sovereignName": "Malphas, O Tecelão do Ritual Abissal",
    "sovereignTitle": "Grão-Soberano • Torre da Estalagmite Oca",
    "realmOrigin": "Fronteira Cinzenta — Centro Axial",
    "archetypeId": "penta_wheel_convergence",
    "archetypeName": "Convergência da Roda Horológica",
    "archetypeSubtitle": "Ápice Pentacromático ❄️☀️💀🔥🌿+⚙️ • Vaelkor & Generais da Roda",
    "skillTier": 4,
    "isGrandSovereign": true,
    "format": "pentachromatic",
    "domains": [
      "blue",
      "gold",
      "purple",
      "red",
      "green"
    ],
    "avatarCardId": "neutral_121_vizeran_arquimago_exilado",
    "eloRating": 1639,
    "eloRd": 19,
    "simulatedGames": 300,
    "simulatedWins": 156,
    "simulatedLosses": 144,
    "simulatedWinRate": 0.52
  },
  {
    "sovereignId": "sov_t5_tri_red_blue_purple",
    "sovereignName": "Aegirion, Soberano das Fendas Abissais",
    "sovereignTitle": "Grão-Soberano • Muralha Marítima de Vórtex",
    "realmOrigin": "Tríade Pyros-Vórtex-Eclipse",
    "archetypeId": "tri_red_blue_purple",
    "archetypeName": "Cataclismo da Convergência Astral",
    "archetypeSubtitle": "Tríade ❄️+🔥+💀 • Estase, Fogo Piroclástico & Execução Umbral",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "tricolor",
    "domains": [
      "blue",
      "red",
      "purple"
    ],
    "avatarCardId": "blue_98_soberano_mares",
    "eloRating": 1635,
    "eloRd": 19,
    "simulatedGames": 300,
    "simulatedWins": 158,
    "simulatedLosses": 142,
    "simulatedWinRate": 0.5267,
    "tournamentRankTierV": 26
  },
  {
    "sovereignId": "sov_t5_dual_blue_purple",
    "sovereignName": "Thaddeus, Senhor do Tempo",
    "sovereignTitle": "Grão-Soberano • Câmara Horológica de Vórtex",
    "realmOrigin": "Aliança Vórtex-Eclipse",
    "archetypeId": "dual_blue_purple",
    "archetypeName": "Pacto da Tormenta Abissal",
    "archetypeSubtitle": "Pacto Duplo ❄️+💀 • Estase Glacial & Execução Umbral",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "bicolor",
    "domains": [
      "blue",
      "purple"
    ],
    "avatarCardId": "blue_80_senhor_tempo",
    "eloRating": 1630,
    "eloRd": 19,
    "simulatedGames": 296,
    "simulatedWins": 152,
    "simulatedLosses": 144,
    "simulatedWinRate": 0.5135,
    "tournamentRankTierV": 24
  },
  {
    "sovereignId": "sov_t5_dual_red_purple",
    "sovereignName": "Ossaurion, Dragão-Ossário Eterno",
    "sovereignTitle": "Grão-Soberano • Fenda Abissal do Vale do Eclipse",
    "realmOrigin": "Aliança Pyros-Eclipse",
    "archetypeId": "dual_red_purple",
    "archetypeName": "Pacto da Chama Sangrenta",
    "archetypeSubtitle": "Pacto Duplo 🔥+💀 • Blitz Sanguinária, Dreno & Último Suspiro",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "bicolor",
    "domains": [
      "red",
      "purple"
    ],
    "avatarCardId": "purple_23_dracolich",
    "eloRating": 1629,
    "eloRd": 19,
    "simulatedGames": 296,
    "simulatedWins": 149,
    "simulatedLosses": 147,
    "simulatedWinRate": 0.5034,
    "tournamentRankTierV": 25
  },
  {
    "sovereignId": "sov_neutral_124_tarrasque_despertar_neutro",
    "sovereignName": "Gorgonoth, O Devorador de Continentes",
    "sovereignTitle": "Grão-Soberano • Fenda Axial Profunda",
    "realmOrigin": "Cidade Franca & Torre dos Cinco Selos",
    "archetypeId": "penta_wheel_convergence",
    "archetypeName": "Convergência da Roda Horológica",
    "archetypeSubtitle": "Ápice Pentacromático ❄️☀️💀🔥🌿+⚙️ • Vaelkor & Generais da Roda",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "pentachromatic",
    "domains": [
      "blue",
      "gold",
      "purple",
      "red",
      "green"
    ],
    "avatarCardId": "neutral_124_tarrasque_despertar_neutro",
    "eloRating": 1621,
    "eloRd": 19,
    "simulatedGames": 296,
    "simulatedWins": 152,
    "simulatedLosses": 144,
    "simulatedWinRate": 0.5135
  },
  {
    "sovereignId": "sov_neutral_24_dragao_astral",
    "sovereignName": "Astrolon, Dragão do Vácuo Estelar",
    "sovereignTitle": "Grão-Soberano • Cúpula Astral da Torre Cinzenta",
    "realmOrigin": "Cratera da Fratura Prismática",
    "archetypeId": "penta_wheel_convergence",
    "archetypeName": "Convergência da Roda Horológica",
    "archetypeSubtitle": "Ápice Pentacromático ❄️☀️💀🔥🌿+⚙️ • Vaelkor & Generais da Roda",
    "skillTier": 4,
    "isGrandSovereign": true,
    "format": "pentachromatic",
    "domains": [
      "blue",
      "gold",
      "purple",
      "red",
      "green"
    ],
    "avatarCardId": "neutral_24_dragao_astral",
    "eloRating": 1618,
    "eloRd": 19,
    "simulatedGames": 300,
    "simulatedWins": 156,
    "simulatedLosses": 144,
    "simulatedWinRate": 0.52
  },
  {
    "sovereignId": "sov_t5_dual_purple_green",
    "sovereignName": "Smaragda, Soberana da Selva Fechada",
    "sovereignTitle": "Grão-Soberano • Copa Real de Veridia",
    "realmOrigin": "Aliança Eclipse-Veridia",
    "archetypeId": "dual_purple_green",
    "archetypeName": "Pacto da Podridão Eterna",
    "archetypeSubtitle": "Pacto Duplo 💀+🌿 • Cripta, Regeneração & Veneno",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "bicolor",
    "domains": [
      "purple",
      "green"
    ],
    "avatarCardId": "green_49_dragao_esmeralda",
    "eloRating": 1604,
    "eloRd": 19,
    "simulatedGames": 300,
    "simulatedWins": 156,
    "simulatedLosses": 144,
    "simulatedWinRate": 0.52,
    "tournamentRankTierV": 22
  },
  {
    "sovereignId": "sov_red_22_tirano_fogo",
    "sovereignName": "Baelgor, Senhor do Fosso Ardente",
    "sovereignTitle": "Grão-Soberano • Fosso Inferior da Cidadela da Caldeira",
    "realmOrigin": "Infraforja Magmática de Ignaroth",
    "archetypeId": "tri_red_green_gold",
    "archetypeName": "Tríade dos Titãs da Forja Primordial",
    "archetypeSubtitle": "Tríade 🔥+🌿+☀️ • Rampa Colossal, Escudo Divino & Sopro Dracônico",
    "skillTier": 4,
    "isGrandSovereign": true,
    "format": "tricolor",
    "domains": [
      "red",
      "green",
      "gold"
    ],
    "avatarCardId": "red_22_tirano_fogo",
    "eloRating": 1603,
    "eloRd": 19,
    "simulatedGames": 280,
    "simulatedWins": 146,
    "simulatedLosses": 134,
    "simulatedWinRate": 0.5214
  },
  {
    "sovereignId": "sov_t5_mono_red_blitz",
    "sovereignName": "Vulcanis, Titã da Bigorna Primordial",
    "sovereignTitle": "Grão-Soberano • Fornalha Axial de Pyros",
    "realmOrigin": "Pyros",
    "archetypeId": "mono_red_blitz",
    "archetypeName": "Blitz Salamandra",
    "archetypeSubtitle": "Mono-Vermelho 🔥 • Ímpeto & Pele Incandescente",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "monocolor",
    "domains": [
      "red"
    ],
    "avatarCardId": "red_157_dragao_tiamat_carmesim",
    "eloRating": 1602,
    "eloRd": 19,
    "simulatedGames": 292,
    "simulatedWins": 150,
    "simulatedLosses": 142,
    "simulatedWinRate": 0.5137,
    "tournamentRankTierV": 30
  },
  {
    "sovereignId": "sov_t5_mono_blue_chrono",
    "sovereignName": "Nereus, Soberano das Sete Marés",
    "sovereignTitle": "Grão-Soberano • Trono Submerso de Vórtex",
    "realmOrigin": "Vórtex",
    "archetypeId": "mono_blue_chrono",
    "archetypeName": "Conclave Cronomante",
    "archetypeSubtitle": "Mono-Azul ⚡ • Compra, Reações & Feitiços",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "monocolor",
    "domains": [
      "blue"
    ],
    "avatarCardId": "blue_45_oraculo_abissal",
    "eloRating": 1600,
    "eloRd": 19,
    "simulatedGames": 302,
    "simulatedWins": 155,
    "simulatedLosses": 147,
    "simulatedWinRate": 0.5132,
    "tournamentRankTierV": 29
  },
  {
    "sovereignId": "sov_neutral_35_colosso_adamantina",
    "sovereignName": "Titã Forjado em Adamantina",
    "sovereignTitle": "Grão-Soberano • Portões da Torre Cinzenta",
    "realmOrigin": "Fronteira Cinzenta — Centro Axial",
    "archetypeId": "penta_wheel_convergence",
    "archetypeName": "Convergência da Roda Horológica",
    "archetypeSubtitle": "Ápice Pentacromático ❄️☀️💀🔥🌿+⚙️ • Vaelkor & Generais da Roda",
    "skillTier": 4,
    "isGrandSovereign": true,
    "format": "pentachromatic",
    "domains": [
      "blue",
      "gold",
      "purple",
      "red",
      "green"
    ],
    "avatarCardId": "neutral_35_colosso_adamantina",
    "eloRating": 1599,
    "eloRd": 19,
    "simulatedGames": 290,
    "simulatedWins": 139,
    "simulatedLosses": 151,
    "simulatedWinRate": 0.4793
  },
  {
    "sovereignId": "sov_t5_mono_blue_frost",
    "sovereignName": "Chronoleviatã, Soberano do Tempo",
    "sovereignTitle": "Grão-Soberano • Fenda Temporal do Mar de Vórtex",
    "realmOrigin": "Vórtex",
    "archetypeId": "mono_blue_frost",
    "archetypeName": "Inverno Eterno",
    "archetypeSubtitle": "Mono-Azul ❄️ • Congelar & Estase Tática",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "monocolor",
    "domains": [
      "blue"
    ],
    "avatarCardId": "blue_136_leviata_cronos",
    "eloRating": 1594,
    "eloRd": 19,
    "simulatedGames": 296,
    "simulatedWins": 149,
    "simulatedLosses": 147,
    "simulatedWinRate": 0.5034,
    "tournamentRankTierV": 31
  },
  {
    "sovereignId": "sov_gold_46_arcanjo_supremo",
    "sovereignName": "Caelestius, o Serafim de Seis Asas",
    "sovereignTitle": "Grão-Soberano • Cerco do Vale Dourado",
    "realmOrigin": "Bastilhas Celestes do Zênite",
    "archetypeId": "tri_blue_green_gold",
    "archetypeName": "Escamas do Horizonte Eterno",
    "archetypeSubtitle": "Tríade ☀️+🌿+❄️ • Falange Radiante, Rampa & Voo Astral",
    "skillTier": 4,
    "isGrandSovereign": true,
    "format": "tricolor",
    "domains": [
      "gold",
      "green",
      "blue"
    ],
    "avatarCardId": "gold_46_arcanjo_supremo",
    "eloRating": 1593,
    "eloRd": 20,
    "simulatedGames": 268,
    "simulatedWins": 144,
    "simulatedLosses": 124,
    "simulatedWinRate": 0.5373
  },
  {
    "sovereignId": "sov_neutral_115_golem_ferro_fornalha_neutra",
    "sovereignName": "Colosso de Ferro da Cidadela",
    "sovereignTitle": "Arconte Tático • Embaixada Esmeralda dos Jardins (Setor S)",
    "realmOrigin": "Cidade Franca & Torre dos Cinco Selos",
    "archetypeId": "tri_purple_green_gold",
    "archetypeName": "Armada do Zênite Umbral",
    "archetypeSubtitle": "Tríade ☀️+🌿+💀 • Bastião Imortal, Regeneração & Renascer",
    "skillTier": 4,
    "isGrandSovereign": false,
    "format": "tricolor",
    "domains": [
      "gold",
      "green",
      "purple"
    ],
    "avatarCardId": "neutral_115_golem_ferro_fornalha_neutra",
    "eloRating": 1593,
    "eloRd": 19,
    "simulatedGames": 302,
    "simulatedWins": 157,
    "simulatedLosses": 145,
    "simulatedWinRate": 0.5199
  },
  {
    "sovereignId": "sov_t5_mono_gold_phalanx",
    "sovereignName": "Aeternus, O Primeiro Forjado de Guerra",
    "sovereignTitle": "Grão-Soberano • Fundação do Bastião de Solária",
    "realmOrigin": "Solária",
    "archetypeId": "mono_gold_phalanx",
    "archetypeName": "Falange Impenetrável",
    "archetypeSubtitle": "Mono-Dourado 🛡️ • Guardião, Armadura & Bastião",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "monocolor",
    "domains": [
      "gold"
    ],
    "avatarCardId": "gold_83_forjado_ancestral",
    "eloRating": 1588,
    "eloRd": 20,
    "simulatedGames": 274,
    "simulatedWins": 132,
    "simulatedLosses": 142,
    "simulatedWinRate": 0.4818,
    "tournamentRankTierV": 35
  },
  {
    "sovereignId": "sov_t5_dual_purple_neutral",
    "sovereignName": "Nocturnus, Avatar da Noite Sem Fim",
    "sovereignTitle": "Grão-Soberano • Fenda Abissal do Vale do Eclipse",
    "realmOrigin": "Pacto Eclipse-Axial",
    "archetypeId": "dual_purple_neutral",
    "archetypeName": "Aliança da Guilda das Máscaras",
    "archetypeSubtitle": "Aliança 💀+⚙️ • Lâminas Letais, Dreno & Submundo Axial",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "bicolor",
    "domains": [
      "purple",
      "neutral"
    ],
    "avatarCardId": "purple_47_avatar_escuridao",
    "eloRating": 1580,
    "eloRd": 19,
    "simulatedGames": 290,
    "simulatedWins": 149,
    "simulatedLosses": 141,
    "simulatedWinRate": 0.5138,
    "tournamentRankTierV": 28
  },
  {
    "sovereignId": "sov_t5_mono_gold_celestial",
    "sovereignName": "Seraphiel, A Imperatriz das Seis Asas",
    "sovereignTitle": "Grão-Soberano • Santuário Coral de Solária",
    "realmOrigin": "Solária",
    "archetypeId": "mono_gold_celestial",
    "archetypeName": "Legião Celeste",
    "archetypeSubtitle": "Mono-Dourado ☀️ • Escudo Divino, Voo & Ascensão",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "monocolor",
    "domains": [
      "gold"
    ],
    "avatarCardId": "gold_99_serafim_coroado",
    "eloRating": 1579,
    "eloRd": 19,
    "simulatedGames": 294,
    "simulatedWins": 138,
    "simulatedLosses": 156,
    "simulatedWinRate": 0.4694,
    "tournamentRankTierV": 33
  },
  {
    "sovereignId": "sov_green_68_zaratan_ilha",
    "sovereignName": "Chelonia, A Tartaruga-Continente",
    "sovereignTitle": "Grão-Soberano • Costa Esmeralda de Veridia",
    "realmOrigin": "Raízes Abissais da Árvore-Mãe",
    "archetypeId": "tri_blue_green_gold",
    "archetypeName": "Escamas do Horizonte Eterno",
    "archetypeSubtitle": "Tríade ☀️+🌿+❄️ • Falange Radiante, Rampa & Voo Astral",
    "skillTier": 4,
    "isGrandSovereign": true,
    "format": "tricolor",
    "domains": [
      "gold",
      "green",
      "blue"
    ],
    "avatarCardId": "green_68_zaratan_ilha",
    "eloRating": 1577,
    "eloRd": 21,
    "simulatedGames": 240,
    "simulatedWins": 124,
    "simulatedLosses": 116,
    "simulatedWinRate": 0.5167
  },
  {
    "sovereignId": "sov_green_33_behemoth_primordial",
    "sovereignName": "Gorgoroth, Behemoth Devorador de Montanhas",
    "sovereignTitle": "Grão-Soberano • Cordilheira Sul de Veridia",
    "realmOrigin": "Galhada Viva — Cidadela da Árvore-Mãe",
    "archetypeId": "tri_blue_purple_green",
    "archetypeName": "Quimera da Fossa Abissal",
    "archetypeSubtitle": "Tríade ❄️+💀+🌿 • Evolução Necrótica, Estase & Cripta Viva",
    "skillTier": 4,
    "isGrandSovereign": true,
    "format": "tricolor",
    "domains": [
      "blue",
      "purple",
      "green"
    ],
    "avatarCardId": "green_33_behemoth_primordial",
    "eloRating": 1572,
    "eloRd": 20,
    "simulatedGames": 274,
    "simulatedWins": 134,
    "simulatedLosses": 140,
    "simulatedWinRate": 0.4891
  },
  {
    "sovereignId": "sov_neutral_106_reen_assassino_relojoeiro",
    "sovereignName": "Reen, Ceifador de Engrenagens",
    "sovereignTitle": "Comandante Regional • Entreposto das Caravanas Neutras",
    "realmOrigin": "Fronteira Cinzenta — Centro Axial",
    "archetypeId": "dual_green_neutral",
    "archetypeName": "Aliança dos Engenhos Silvestres",
    "archetypeSubtitle": "Aliança 🌿+⚙️ • Colossos de Madeira-Ferro & Guildas Axiais",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "green",
      "neutral"
    ],
    "avatarCardId": "neutral_106_reen_assassino_relojoeiro",
    "eloRating": 1568,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 130,
    "simulatedLosses": 114,
    "simulatedWinRate": 0.5328
  },
  {
    "sovereignId": "sov_gold_09_serafim_solar",
    "sovereignName": "Zephaniel, Arcanjo Solar do Zênite",
    "sovereignTitle": "Grão-Soberano • Torre Zênite de Solária",
    "realmOrigin": "Bastião Dourado de Aethelgard",
    "archetypeId": "dual_blue_gold",
    "archetypeName": "Pacto da Forja do Zênite",
    "archetypeSubtitle": "Pacto Duplo ❄️+☀️ • Cidadela Cronomante & Escudo Celeste",
    "skillTier": 4,
    "isGrandSovereign": true,
    "format": "bicolor",
    "domains": [
      "blue",
      "gold"
    ],
    "avatarCardId": "gold_09_serafim_solar",
    "eloRating": 1568,
    "eloRd": 20,
    "simulatedGames": 244,
    "simulatedWins": 124,
    "simulatedLosses": 120,
    "simulatedWinRate": 0.5082
  },
  {
    "sovereignId": "sov_green_142_patriarca_selva_eterna",
    "sovereignName": "Sylvanhorn, Patriarca da Selva Eterna",
    "sovereignTitle": "Grão-Soberano • Clareira Sagrada de Raiz-Ferro",
    "realmOrigin": "Galhada Viva — Cidadela da Árvore-Mãe",
    "archetypeId": "dual_green_gold",
    "archetypeName": "Pacto da Aurora Silvestre",
    "archetypeSubtitle": "Pacto Duplo 🌿+☀️ • Falange dos Mil Escudos & Hinos Globais",
    "skillTier": 4,
    "isGrandSovereign": true,
    "format": "bicolor",
    "domains": [
      "green",
      "gold"
    ],
    "avatarCardId": "green_142_patriarca_selva_eterna",
    "eloRating": 1567,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 133,
    "simulatedLosses": 111,
    "simulatedWinRate": 0.5451
  },
  {
    "sovereignId": "sov_blue_154_dragao_safira_soberano",
    "sovereignName": "Dragão de Safira Sônico",
    "sovereignTitle": "Grão-Soberano • Pináculo Acústico de Vórtex",
    "realmOrigin": "Pináculo Polar de Cristália",
    "archetypeId": "mono_blue_chrono",
    "archetypeName": "Conclave Cronomante",
    "archetypeSubtitle": "Mono-Azul ⚡ • Compra, Reações & Feitiços",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "monocolor",
    "domains": [
      "blue"
    ],
    "avatarCardId": "blue_154_dragao_safira_soberano",
    "eloRating": 1563,
    "eloRd": 21,
    "simulatedGames": 236,
    "simulatedWins": 107,
    "simulatedLosses": 129,
    "simulatedWinRate": 0.4534
  },
  {
    "sovereignId": "sov_purple_100_dragao_necrotico",
    "sovereignName": "Morgath, O Dragão da Chama Necrótica",
    "sovereignTitle": "Grão-Soberano • Fronteira do Pacto do Inverno Umbral",
    "realmOrigin": "Catedral-Necrópole de Nocturnus",
    "archetypeId": "tri_purple_green_gold",
    "archetypeName": "Armada do Zênite Umbral",
    "archetypeSubtitle": "Tríade ☀️+🌿+💀 • Bastião Imortal, Regeneração & Renascer",
    "skillTier": 4,
    "isGrandSovereign": true,
    "format": "tricolor",
    "domains": [
      "gold",
      "green",
      "purple"
    ],
    "avatarCardId": "purple_100_dragao_necrotico",
    "eloRating": 1562,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 134,
    "simulatedLosses": 110,
    "simulatedWinRate": 0.5492
  },
  {
    "sovereignId": "sov_green_121_avatar_gaia",
    "sovereignName": "Tellurion, Avatar Primordial da Terra Viva",
    "sovereignTitle": "Grão-Soberano • Santuário Central de Veridia",
    "realmOrigin": "Galhada Viva — Cidadela da Árvore-Mãe",
    "archetypeId": "dual_purple_green",
    "archetypeName": "Pacto da Podridão Eterna",
    "archetypeSubtitle": "Pacto Duplo 💀+🌿 • Cripta, Regeneração & Veneno",
    "skillTier": 4,
    "isGrandSovereign": true,
    "format": "bicolor",
    "domains": [
      "purple",
      "green"
    ],
    "avatarCardId": "green_121_avatar_gaia",
    "eloRating": 1560,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 134,
    "simulatedLosses": 110,
    "simulatedWinRate": 0.5492
  },
  {
    "sovereignId": "sov_blue_07_kraken",
    "sovereignName": "Kraken da Fossa Abissal",
    "sovereignTitle": "Grão-Soberano • Trincheira Submarina de Vórtex",
    "realmOrigin": "Pináculo Polar de Cristália",
    "archetypeId": "tri_blue_purple_green",
    "archetypeName": "Quimera da Fossa Abissal",
    "archetypeSubtitle": "Tríade ❄️+💀+🌿 • Evolução Necrótica, Estase & Cripta Viva",
    "skillTier": 4,
    "isGrandSovereign": true,
    "format": "tricolor",
    "domains": [
      "blue",
      "purple",
      "green"
    ],
    "avatarCardId": "blue_07_kraken",
    "eloRating": 1558,
    "eloRd": 21,
    "simulatedGames": 240,
    "simulatedWins": 127,
    "simulatedLosses": 113,
    "simulatedWinRate": 0.5292
  },
  {
    "sovereignId": "sov_purple_07_lich",
    "sovereignName": "Vesperion, Arquimago Lich Imortal",
    "sovereignTitle": "Grão-Soberano • Torre Capitular da Catedral de Obsidiana",
    "realmOrigin": "Fossa Submersa da Catedral Afogada",
    "archetypeId": "tri_blue_purple_green",
    "archetypeName": "Quimera da Fossa Abissal",
    "archetypeSubtitle": "Tríade ❄️+💀+🌿 • Evolução Necrótica, Estase & Cripta Viva",
    "skillTier": 4,
    "isGrandSovereign": true,
    "format": "tricolor",
    "domains": [
      "blue",
      "purple",
      "green"
    ],
    "avatarCardId": "purple_07_lich",
    "eloRating": 1557,
    "eloRd": 21,
    "simulatedGames": 236,
    "simulatedWins": 123,
    "simulatedLosses": 113,
    "simulatedWinRate": 0.5212
  },
  {
    "sovereignId": "sov_t5_mono_blue_abyssal",
    "sovereignName": "Vorthurion, Tempestade do Deserto",
    "sovereignTitle": "Grão-Soberano • Deserto de Vidro ao Sul de Vórtex",
    "realmOrigin": "Vórtex",
    "archetypeId": "mono_blue_abyssal",
    "archetypeName": "Frota Abissal",
    "archetypeSubtitle": "Mono-Azul 🌊 • Voo, Alcance & Leviatãs",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "monocolor",
    "domains": [
      "blue"
    ],
    "avatarCardId": "blue_06_dragao_azul",
    "eloRating": 1556,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 145,
    "simulatedLosses": 103,
    "simulatedWinRate": 0.5847,
    "tournamentRankTierV": 40
  },
  {
    "sovereignId": "sov_t5_mono_purple_umbral",
    "sovereignName": "Malakor-Vael, Soberano da Não-Vida",
    "sovereignTitle": "Grão-Soberano • Trono de Obsidiana do Eclipse",
    "realmOrigin": "Eclipse",
    "archetypeId": "mono_purple_umbral",
    "archetypeName": "Inquisição Umbral",
    "archetypeSubtitle": "Mono-Roxo 🌑 • Destruição, Debuff & Controle",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "avatarCardId": "purple_65_principe_mortos",
    "eloRating": 1556,
    "eloRd": 21,
    "simulatedGames": 236,
    "simulatedWins": 120,
    "simulatedLosses": 116,
    "simulatedWinRate": 0.5085,
    "tournamentRankTierV": 34
  },
  {
    "sovereignId": "sov_t5_mono_purple_crypt",
    "sovereignName": "Vladislaus, O Patriarca de Sangue",
    "sovereignTitle": "Grão-Soberano • Cripta Real da Corte Carmesim",
    "realmOrigin": "Eclipse",
    "archetypeId": "mono_purple_crypt",
    "archetypeName": "Guardiões da Cripta",
    "archetypeSubtitle": "Mono-Roxo 💀 • Renascer & Reanimação",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "avatarCardId": "purple_99_lorde_vampiro_anciao",
    "eloRating": 1555,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 134,
    "simulatedLosses": 110,
    "simulatedWinRate": 0.5492,
    "tournamentRankTierV": 37
  },
  {
    "sovereignId": "sov_red_82_fenix_taquion",
    "sovereignName": "Ignis-Aeterna, A Fênix do Tempo Emprestado",
    "sovereignTitle": "Grão-Soberano • Pináculo Vulcânico da Fronteira Norte",
    "realmOrigin": "Infraforja Magmática de Ignaroth",
    "archetypeId": "dual_red_gold",
    "archetypeName": "Pacto das Escamas Imperiais",
    "archetypeSubtitle": "Pacto Duplo 🔥+☀️ • Dragões Solares & Escudo Divino",
    "skillTier": 3,
    "isGrandSovereign": true,
    "format": "bicolor",
    "domains": [
      "red",
      "gold"
    ],
    "avatarCardId": "red_82_fenix_taquion",
    "eloRating": 1554,
    "eloRd": 20,
    "simulatedGames": 256,
    "simulatedWins": 140,
    "simulatedLosses": 116,
    "simulatedWinRate": 0.5469
  },
  {
    "sovereignId": "sov_neutral_100_morkoth_ilha_errante",
    "sovereignName": "Espectro Abissal Colecionador de Relíquias",
    "sovereignTitle": "Comandante Regional • Baluarte — Encruzilhada das Cinco Linhas de Ley",
    "realmOrigin": "Fronteira Cinzenta — Centro Axial",
    "archetypeId": "dual_gold_neutral",
    "archetypeName": "Aliança do Bastião Relojoeiro",
    "archetypeSubtitle": "Aliança ☀️+⚙️ • Falange de Ferro Meteórico & Escudo Real",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "gold",
      "neutral"
    ],
    "avatarCardId": "neutral_100_morkoth_ilha_errante",
    "eloRating": 1554,
    "eloRd": 20,
    "simulatedGames": 244,
    "simulatedWins": 124,
    "simulatedLosses": 120,
    "simulatedWinRate": 0.5082
  },
  {
    "sovereignId": "sov_t5_mono_neutral_axial",
    "sovereignName": "Valerius, Arquimago dos Sete Selos",
    "sovereignTitle": "Grão-Soberano • Torre dos Cinco Selos (Fronteira Cinzenta)",
    "realmOrigin": "Cidade Franca Axial",
    "archetypeId": "mono_neutral_axial",
    "archetypeName": "Legião Axial Autômata",
    "archetypeSubtitle": "Mono-Neutro ⚙️ • Constructos, Relíquias & Matriz Horológica",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "monocolor",
    "domains": [
      "neutral"
    ],
    "avatarCardId": "neutral_117_elminster_sabio_cinzento",
    "eloRating": 1552,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 131,
    "simulatedLosses": 113,
    "simulatedWinRate": 0.5369,
    "tournamentRankTierV": 32
  },
  {
    "sovereignId": "sov_neutral_123_emissario_relojoeiro_supremo",
    "sovereignName": "Deus-Máquina de Aeternus",
    "sovereignTitle": "Grão-Soberano • Santuário Horológico da Fronteira",
    "realmOrigin": "Cidade Franca & Torre dos Cinco Selos",
    "archetypeId": "penta_wheel_convergence",
    "archetypeName": "Convergência da Roda Horológica",
    "archetypeSubtitle": "Ápice Pentacromático ❄️☀️💀🔥🌿+⚙️ • Vaelkor & Generais da Roda",
    "skillTier": 4,
    "isGrandSovereign": true,
    "format": "pentachromatic",
    "domains": [
      "blue",
      "gold",
      "purple",
      "red",
      "green"
    ],
    "avatarCardId": "neutral_123_emissario_relojoeiro_supremo",
    "eloRating": 1548,
    "eloRd": 21,
    "simulatedGames": 228,
    "simulatedWins": 107,
    "simulatedLosses": 121,
    "simulatedWinRate": 0.4693
  },
  {
    "sovereignId": "sov_gold_24_tita_empirico",
    "sovereignName": "Titã Primogênito da Alvorada",
    "sovereignTitle": "Grão-Soberano • Planalto Oriental de Solária",
    "realmOrigin": "Bastião Dourado de Aethelgard",
    "archetypeId": "tri_blue_green_gold",
    "archetypeName": "Escamas do Horizonte Eterno",
    "archetypeSubtitle": "Tríade ☀️+🌿+❄️ • Falange Radiante, Rampa & Voo Astral",
    "skillTier": 4,
    "isGrandSovereign": true,
    "format": "tricolor",
    "domains": [
      "gold",
      "green",
      "blue"
    ],
    "avatarCardId": "gold_24_tita_empirico",
    "eloRating": 1541,
    "eloRd": 21,
    "simulatedGames": 232,
    "simulatedWins": 110,
    "simulatedLosses": 122,
    "simulatedWinRate": 0.4741
  },
  {
    "sovereignId": "sov_gold_65_emperion_solar",
    "sovereignName": "Aurelion, O Titã Empíreo",
    "sovereignTitle": "Grão-Soberano • Praça das Dez Alianças (Solária)",
    "realmOrigin": "Corredor Boreal das Nuvens & Correntes Dracônicas",
    "archetypeId": "dual_red_gold",
    "archetypeName": "Pacto das Escamas Imperiais",
    "archetypeSubtitle": "Pacto Duplo 🔥+☀️ • Dragões Solares & Escudo Divino",
    "skillTier": 3,
    "isGrandSovereign": true,
    "format": "bicolor",
    "domains": [
      "red",
      "gold"
    ],
    "avatarCardId": "gold_65_emperion_solar",
    "eloRating": 1534,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 141,
    "simulatedLosses": 111,
    "simulatedWinRate": 0.5595
  },
  {
    "sovereignId": "sov_gold_115_leao_celestial_rei",
    "sovereignName": "Leão-Rei Celestial",
    "sovereignTitle": "Comandante Regional • Baluarte — Porto Real do Sol Nascente",
    "realmOrigin": "Solária — O Leste Alto",
    "archetypeId": "mono_gold_celestial",
    "archetypeName": "Legião Celeste",
    "archetypeSubtitle": "Mono-Dourado ☀️ • Escudo Divino, Voo & Ascensão",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "gold"
    ],
    "avatarCardId": "gold_115_leao_celestial_rei",
    "eloRating": 1531,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 125,
    "simulatedLosses": 119,
    "simulatedWinRate": 0.5123
  },
  {
    "sovereignId": "sov_purple_172_armada_draconica_abismo",
    "sovereignName": "Legião Dracônica do Eclipse",
    "sovereignTitle": "Grão-Soberano • Firmamento Sem Sol do Oeste (Eclipse)",
    "realmOrigin": "Catedral-Necrópole de Nocturnus",
    "archetypeId": "mono_purple_crypt",
    "archetypeName": "Guardiões da Cripta",
    "archetypeSubtitle": "Mono-Roxo 💀 • Renascer & Reanimação",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "avatarCardId": "purple_172_armada_draconica_abismo",
    "eloRating": 1525,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 115,
    "simulatedLosses": 129,
    "simulatedWinRate": 0.4713
  },
  {
    "sovereignId": "sov_t5_mono_green_colossus",
    "sovereignName": "Sylvarok, General da Roda Primeva",
    "sovereignTitle": "Grão-Soberano • Trono de Pau-Ferro (Veridia)",
    "realmOrigin": "Veridia",
    "archetypeId": "mono_green_colossus",
    "archetypeName": "Colossos Primordiais",
    "archetypeSubtitle": "Mono-Verde 🌿 • Ramp & Atropelar",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "monocolor",
    "domains": [
      "green"
    ],
    "avatarCardId": "green_173_general_roda_selva",
    "eloRating": 1523,
    "eloRd": 20,
    "simulatedGames": 244,
    "simulatedWins": 123,
    "simulatedLosses": 121,
    "simulatedWinRate": 0.5041,
    "tournamentRankTierV": 36
  },
  {
    "sovereignId": "sov_gold_136_dragao_platina_celeste",
    "sovereignName": "Dragão Celestial de Platina e Ouro",
    "sovereignTitle": "Comandante Regional • Reduto — Terraço dos Espelhos",
    "realmOrigin": "Bastilhas Celestes do Zênite",
    "archetypeId": "dual_purple_gold",
    "archetypeName": "Pacto da Inquisição Crepuscular",
    "archetypeSubtitle": "Pacto Duplo 💀+☀️ • Dreno Solar, Renascer & Veredito",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "purple",
      "gold"
    ],
    "avatarCardId": "gold_136_dragao_platina_celeste",
    "eloRating": 1522,
    "eloRd": 20,
    "simulatedGames": 248,
    "simulatedWins": 130,
    "simulatedLosses": 118,
    "simulatedWinRate": 0.5242
  },
  {
    "sovereignId": "sov_purple_155_lorde_vampiro_soberano",
    "sovereignName": "Ceifador Gigante do Eclipse",
    "sovereignTitle": "Comandante Regional • Cidadela da Ordem Sangue-Negro",
    "realmOrigin": "Catedral-Necrópole de Nocturnus",
    "archetypeId": "dual_purple_gold",
    "archetypeName": "Pacto da Inquisição Crepuscular",
    "archetypeSubtitle": "Pacto Duplo 💀+☀️ • Dreno Solar, Renascer & Veredito",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "purple",
      "gold"
    ],
    "avatarCardId": "purple_155_lorde_vampiro_soberano",
    "eloRating": 1522,
    "eloRd": 21,
    "simulatedGames": 240,
    "simulatedWins": 124,
    "simulatedLosses": 116,
    "simulatedWinRate": 0.5167
  },
  {
    "sovereignId": "sov_red_167_arauto_prisma_chama",
    "sovereignName": "Arauto da Supernova Prismática",
    "sovereignTitle": "Grão-Soberano • Abóbada Ardente do Norte",
    "realmOrigin": "Pyros — O Norte Vulcânico",
    "archetypeId": "dual_red_gold",
    "archetypeName": "Pacto das Escamas Imperiais",
    "archetypeSubtitle": "Pacto Duplo 🔥+☀️ • Dragões Solares & Escudo Divino",
    "skillTier": 3,
    "isGrandSovereign": true,
    "format": "bicolor",
    "domains": [
      "red",
      "gold"
    ],
    "avatarCardId": "red_167_arauto_prisma_chama",
    "eloRating": 1519,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 133,
    "simulatedLosses": 119,
    "simulatedWinRate": 0.5278
  },
  {
    "sovereignId": "sov_gold_137_colosso_cidadela_eterna",
    "sovereignName": "Colosso da Cidadela Viva",
    "sovereignTitle": "Comandante Regional • Atalaia — Atalaia da Alvorada",
    "realmOrigin": "Bastilhas Celestes do Zênite",
    "archetypeId": "dual_purple_gold",
    "archetypeName": "Pacto da Inquisição Crepuscular",
    "archetypeSubtitle": "Pacto Duplo 💀+☀️ • Dreno Solar, Renascer & Veredito",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "purple",
      "gold"
    ],
    "avatarCardId": "gold_137_colosso_cidadela_eterna",
    "eloRating": 1516,
    "eloRd": 20,
    "simulatedGames": 244,
    "simulatedWins": 126,
    "simulatedLosses": 118,
    "simulatedWinRate": 0.5164
  },
  {
    "sovereignId": "sov_t5_mono_gold_judgment",
    "sovereignName": "Justinian, Soberano da Ordem Eterna",
    "sovereignTitle": "Grão-Soberano • Salão do Tratado (Torre dos Cinco Selos)",
    "realmOrigin": "Solária",
    "archetypeId": "mono_gold_judgment",
    "archetypeName": "Julgamento Solar",
    "archetypeSubtitle": "Mono-Dourado ⚖️ • Relíquias, Escudo Global & Cura",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "monocolor",
    "domains": [
      "gold"
    ],
    "avatarCardId": "gold_119_soberano_ordem_eterna",
    "eloRating": 1513,
    "eloRd": 20,
    "simulatedGames": 248,
    "simulatedWins": 127,
    "simulatedLosses": 121,
    "simulatedWinRate": 0.5121,
    "tournamentRankTierV": 41
  },
  {
    "sovereignId": "sov_green_25_dragao_verde",
    "sovereignName": "Viperia, Tirana da Selva Tóxica",
    "sovereignTitle": "Grão-Soberano • Vale dos Vapores de Veridia",
    "realmOrigin": "Galhada Viva — Cidadela da Árvore-Mãe",
    "archetypeId": "mono_green_swarm",
    "archetypeName": "Enxame & Matilha Silvestre",
    "archetypeSubtitle": "Mono-Verde 🌿 • Aggro & Buff em Massa",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "monocolor",
    "domains": [
      "green"
    ],
    "avatarCardId": "green_25_dragao_verde",
    "eloRating": 1512,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 140,
    "simulatedLosses": 112,
    "simulatedWinRate": 0.5556
  },
  {
    "sovereignId": "sov_purple_157_dragao_sombra_abissal",
    "sovereignName": "Monarca dos Três Crânios",
    "sovereignTitle": "Grão-Soberano • Altar Tríplice da Catedral de Obsidiana",
    "realmOrigin": "Catedral-Necrópole de Nocturnus",
    "archetypeId": "mono_purple_blood",
    "archetypeName": "Tributo Vital",
    "archetypeSubtitle": "Mono-Roxo ⚡ • Dreno de Vida & Toque Letal",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "avatarCardId": "purple_157_dragao_sombra_abissal",
    "eloRating": 1512,
    "eloRd": 21,
    "simulatedGames": 252,
    "simulatedWins": 140,
    "simulatedLosses": 112,
    "simulatedWinRate": 0.5556
  },
  {
    "sovereignId": "sov_gold_45_gigante_tempestade",
    "sovereignName": "Titã da Cidadela do Zênite",
    "sovereignTitle": "Comandante Regional • Baluarte — Terraço dos Espelhos",
    "realmOrigin": "Corredor Boreal das Nuvens & Correntes Dracônicas",
    "archetypeId": "dual_purple_gold",
    "archetypeName": "Pacto da Inquisição Crepuscular",
    "archetypeSubtitle": "Pacto Duplo 💀+☀️ • Dreno Solar, Renascer & Veredito",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "purple",
      "gold"
    ],
    "avatarCardId": "gold_45_gigante_tempestade",
    "eloRating": 1511,
    "eloRd": 20,
    "simulatedGames": 248,
    "simulatedWins": 123,
    "simulatedLosses": 125,
    "simulatedWinRate": 0.496
  },
  {
    "sovereignId": "sov_t5_mono_red_dragon",
    "sovereignName": "Igniskar, Tirano da Cratera",
    "sovereignTitle": "Grão-Soberano • Grande Cratera de Pyros",
    "realmOrigin": "Pyros",
    "archetypeId": "mono_red_dragon",
    "archetypeName": "Trono Dracônico",
    "archetypeSubtitle": "Mono-Vermelho 🔥 • Voo, Sopro & Ascensão",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "monocolor",
    "domains": [
      "red"
    ],
    "avatarCardId": "red_08_dragao_vermelho",
    "eloRating": 1507,
    "eloRd": 20,
    "simulatedGames": 248,
    "simulatedWins": 127,
    "simulatedLosses": 121,
    "simulatedWinRate": 0.5121,
    "tournamentRankTierV": 38
  },
  {
    "sovereignId": "sov_red_21_diabo_chifres",
    "sovereignName": "Arconte de Chifres e Brasa",
    "sovereignTitle": "Comandante Regional • Forte da Escória",
    "realmOrigin": "Infraforja Magmática de Ignaroth",
    "archetypeId": "dual_red_purple",
    "archetypeName": "Pacto da Chama Sangrenta",
    "archetypeSubtitle": "Pacto Duplo 🔥+💀 • Blitz Sanguinária, Dreno & Último Suspiro",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "red",
      "purple"
    ],
    "avatarCardId": "red_21_diabo_chifres",
    "eloRating": 1505,
    "eloRd": 20,
    "simulatedGames": 244,
    "simulatedWins": 119,
    "simulatedLosses": 125,
    "simulatedWinRate": 0.4877
  },
  {
    "sovereignId": "sov_gold_155_arconte_lanca_solar",
    "sovereignName": "General Angelical da Espada Solar",
    "sovereignTitle": "Comandante Regional • Atalaia da Alvorada",
    "realmOrigin": "Bastilhas Celestes do Zênite",
    "archetypeId": "dual_gold_neutral",
    "archetypeName": "Aliança do Bastião Relojoeiro",
    "archetypeSubtitle": "Aliança ☀️+⚙️ • Falange de Ferro Meteórico & Escudo Real",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "gold",
      "neutral"
    ],
    "avatarCardId": "gold_155_arconte_lanca_solar",
    "eloRating": 1505,
    "eloRd": 20,
    "simulatedGames": 248,
    "simulatedWins": 117,
    "simulatedLosses": 131,
    "simulatedWinRate": 0.4718
  },
  {
    "sovereignId": "sov_t5_mono_green_swarm",
    "sovereignName": "Fenris-Gorgon, Imperador das Feras",
    "sovereignTitle": "Grão-Soberano • Fronteira Selvagem de Veridia",
    "realmOrigin": "Veridia",
    "archetypeId": "mono_green_swarm",
    "archetypeName": "Enxame & Matilha Silvestre",
    "archetypeSubtitle": "Mono-Verde 🌿 • Aggro & Buff em Massa",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "monocolor",
    "domains": [
      "green"
    ],
    "avatarCardId": "green_141_soberano_fera_primordial",
    "eloRating": 1503,
    "eloRd": 20,
    "simulatedGames": 248,
    "simulatedWins": 123,
    "simulatedLosses": 125,
    "simulatedWinRate": 0.496,
    "tournamentRankTierV": 39
  },
  {
    "sovereignId": "sov_purple_137_arauto_sol_negro",
    "sovereignName": "Arauto Supremo do Sol Negro",
    "sovereignTitle": "Comandante Regional • Garganta do Crepúsculo",
    "realmOrigin": "Fossa Submersa da Catedral Afogada",
    "archetypeId": "dual_blue_purple",
    "archetypeName": "Pacto da Tormenta Abissal",
    "archetypeSubtitle": "Pacto Duplo ❄️+💀 • Estase Glacial & Execução Umbral",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "blue",
      "purple"
    ],
    "avatarCardId": "purple_137_arauto_sol_negro",
    "eloRating": 1500,
    "eloRd": 21,
    "simulatedGames": 236,
    "simulatedWins": 115,
    "simulatedLosses": 121,
    "simulatedWinRate": 0.4873
  },
  {
    "sovereignId": "sov_blue_23_dragao_bronze",
    "sovereignName": "Auronautilus, Dragão de Bronze",
    "sovereignTitle": "Comandante Regional • Reduto — Ancoradouro de Safira Boreal",
    "realmOrigin": "Arquipélago Astral das Estrelas Mortas",
    "archetypeId": "dual_blue_purple",
    "archetypeName": "Pacto da Tormenta Abissal",
    "archetypeSubtitle": "Pacto Duplo ❄️+💀 • Estase Glacial & Execução Umbral",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "blue",
      "purple"
    ],
    "avatarCardId": "blue_23_dragao_bronze",
    "eloRating": 1493,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 128,
    "simulatedLosses": 116,
    "simulatedWinRate": 0.5246
  },
  {
    "sovereignId": "sov_t5_mono_green_roots",
    "sovereignName": "Kragmorth, O Devorador de Eras",
    "sovereignTitle": "Grão-Soberano • Fenda Continental de Vaeloria",
    "realmOrigin": "Veridia",
    "archetypeId": "mono_green_roots",
    "archetypeName": "Raízes Eternas",
    "archetypeSubtitle": "Mono-Verde 🌿 • Guardião & Regeneração",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "monocolor",
    "domains": [
      "green"
    ],
    "avatarCardId": "green_86_tarrasque_desperto",
    "eloRating": 1492,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 143,
    "simulatedLosses": 105,
    "simulatedWinRate": 0.5766,
    "tournamentRankTierV": 43
  },
  {
    "sovereignId": "sov_neutral_107_colosso_forja_vapor",
    "sovereignName": "Juggernaut de Caldeira e Bronze",
    "sovereignTitle": "Comandante Regional • Monólito da Trégua",
    "realmOrigin": "Cratera da Fratura Prismática",
    "archetypeId": "dual_gold_neutral",
    "archetypeName": "Aliança do Bastião Relojoeiro",
    "archetypeSubtitle": "Aliança ☀️+⚙️ • Falange de Ferro Meteórico & Escudo Real",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "gold",
      "neutral"
    ],
    "avatarCardId": "neutral_107_colosso_forja_vapor",
    "eloRating": 1490,
    "eloRd": 20,
    "simulatedGames": 244,
    "simulatedWins": 119,
    "simulatedLosses": 125,
    "simulatedWinRate": 0.4877
  },
  {
    "sovereignId": "sov_green_84_brontossauro_colosso",
    "sovereignName": "Brontossauro Trovejante (-3351 C.V.)",
    "sovereignTitle": "Comandante Regional • Forte de Pau-Ferro",
    "realmOrigin": "Raízes Abissais da Árvore-Mãe",
    "archetypeId": "dual_green_neutral",
    "archetypeName": "Aliança dos Engenhos Silvestres",
    "archetypeSubtitle": "Aliança 🌿+⚙️ • Colossos de Madeira-Ferro & Guildas Axiais",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "green",
      "neutral"
    ],
    "avatarCardId": "green_84_brontossauro_colosso",
    "eloRating": 1488,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 115,
    "simulatedLosses": 129,
    "simulatedWinRate": 0.4713
  },
  {
    "sovereignId": "sov_blue_116_kraken_tempestade",
    "sovereignName": "Kraken Couraçado da Tempestade",
    "sovereignTitle": "Comandante Regional • Ponte de Gelo Astral",
    "realmOrigin": "Arquipélago Astral das Estrelas Mortas",
    "archetypeId": "mono_blue_frost",
    "archetypeName": "Inverno Eterno",
    "archetypeSubtitle": "Mono-Azul ❄️ • Congelar & Estase Tática",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "blue"
    ],
    "avatarCardId": "blue_116_kraken_tempestade",
    "eloRating": 1485,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 122,
    "simulatedLosses": 126,
    "simulatedWinRate": 0.4919
  },
  {
    "sovereignId": "sov_blue_167_arauto_prisma_gelo",
    "sovereignName": "Arauto do Zero Prismático",
    "sovereignTitle": "Grão-Soberano • Zênite Polar de Vórtex",
    "realmOrigin": "Vórtex — Polos Setentrionais",
    "archetypeId": "mono_blue_frost",
    "archetypeName": "Inverno Eterno",
    "archetypeSubtitle": "Mono-Azul ❄️ • Congelar & Estase Tática",
    "skillTier": 3,
    "isGrandSovereign": true,
    "format": "monocolor",
    "domains": [
      "blue"
    ],
    "avatarCardId": "blue_167_arauto_prisma_gelo",
    "eloRating": 1485,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 121,
    "simulatedLosses": 127,
    "simulatedWinRate": 0.4879
  },
  {
    "sovereignId": "sov_red_23_dragao_latao",
    "sovereignName": "Soberano de Latão do Deserto",
    "sovereignTitle": "Comandante Regional • Ponte das Correntes Rubras",
    "realmOrigin": "Caldeira Imperial de Vulcanor",
    "archetypeId": "mono_red_blitz",
    "archetypeName": "Blitz Salamandra",
    "archetypeSubtitle": "Mono-Vermelho 🔥 • Ímpeto & Pele Incandescente",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "red"
    ],
    "avatarCardId": "red_23_dragao_latao",
    "eloRating": 1484,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 143,
    "simulatedLosses": 105,
    "simulatedWinRate": 0.5766
  },
  {
    "sovereignId": "sov_t5_mono_red_pyroclasm",
    "sovereignName": "Vulcanor, Colosso da Caldeira Primordial",
    "sovereignTitle": "Grão-Soberano • Caldeira Fumegante do Norte",
    "realmOrigin": "Pyros",
    "archetypeId": "mono_red_pyroclasm",
    "archetypeName": "Artilharia Piroclástica",
    "archetypeSubtitle": "Mono-Vermelho 🔥 • Queima Direta & Cataclismos",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "monocolor",
    "domains": [
      "red"
    ],
    "avatarCardId": "red_138_colosso_vulcano_primordial",
    "eloRating": 1481,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 125,
    "simulatedLosses": 127,
    "simulatedWinRate": 0.496,
    "tournamentRankTierV": 42
  },
  {
    "sovereignId": "sov_purple_25_dama_seis_laminas",
    "sovereignName": "Serpente Abissal de Seis Espadas",
    "sovereignTitle": "Comandante Regional • Vanguarda — Garganta do Crepúsculo",
    "realmOrigin": "Fossa Submersa da Catedral Afogada",
    "archetypeId": "dual_purple_green",
    "archetypeName": "Pacto da Podridão Eterna",
    "archetypeSubtitle": "Pacto Duplo 💀+🌿 • Cripta, Regeneração & Veneno",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "purple",
      "green"
    ],
    "avatarCardId": "purple_25_dama_seis_laminas",
    "eloRating": 1477,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 120,
    "simulatedLosses": 124,
    "simulatedWinRate": 0.4918
  },
  {
    "sovereignId": "sov_green_138_giganotossauro_apex",
    "sovereignName": "Giganotossauro Predador Ápex",
    "sovereignTitle": "Comandante Regional • Terraço da Seiva Dourada",
    "realmOrigin": "Raízes Abissais da Árvore-Mãe",
    "archetypeId": "dual_green_gold",
    "archetypeName": "Pacto da Aurora Silvestre",
    "archetypeSubtitle": "Pacto Duplo 🌿+☀️ • Falange dos Mil Escudos & Hinos Globais",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "green",
      "gold"
    ],
    "avatarCardId": "green_138_giganotossauro_apex",
    "eloRating": 1471,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 134,
    "simulatedLosses": 118,
    "simulatedWinRate": 0.5317
  },
  {
    "sovereignId": "sov_blue_22_dragao_branco",
    "sovereignName": "Kryonax, Flagelo do Inverno",
    "sovereignTitle": "Comandante Regional • Ancoradouro de Safira Boreal",
    "realmOrigin": "Arquipélago Astral das Estrelas Mortas",
    "archetypeId": "dual_blue_gold",
    "archetypeName": "Pacto da Forja do Zênite",
    "archetypeSubtitle": "Pacto Duplo ❄️+☀️ • Cidadela Cronomante & Escudo Celeste",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "blue",
      "gold"
    ],
    "avatarCardId": "blue_22_dragao_branco",
    "eloRating": 1471,
    "eloRd": 20,
    "simulatedGames": 256,
    "simulatedWins": 136,
    "simulatedLosses": 120,
    "simulatedWinRate": 0.5313
  },
  {
    "sovereignId": "sov_blue_24_tartaruga_dragao",
    "sovereignName": "Quelônio-Titã dos Mares",
    "sovereignTitle": "Comandante Regional • Ponte de Gelo Astral",
    "realmOrigin": "Pináculo Polar de Cristália",
    "archetypeId": "mono_blue_frost",
    "archetypeName": "Inverno Eterno",
    "archetypeSubtitle": "Mono-Azul ❄️ • Congelar & Estase Tática",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "blue"
    ],
    "avatarCardId": "blue_24_tartaruga_dragao",
    "eloRating": 1468,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 132,
    "simulatedLosses": 116,
    "simulatedWinRate": 0.5323
  },
  {
    "sovereignId": "sov_purple_63_rainha_fungos",
    "sovereignName": "Mycoria, Dama da Podridão",
    "sovereignTitle": "Grão-Soberano • Jardins Subterrâneos do Eclipse",
    "realmOrigin": "Vale do Eclipse — Oeste Profundo",
    "archetypeId": "dual_purple_green",
    "archetypeName": "Pacto da Podridão Eterna",
    "archetypeSubtitle": "Pacto Duplo 💀+🌿 • Cripta, Regeneração & Veneno",
    "skillTier": 3,
    "isGrandSovereign": true,
    "format": "bicolor",
    "domains": [
      "purple",
      "green"
    ],
    "avatarCardId": "purple_63_rainha_fungos",
    "eloRating": 1468,
    "eloRd": 20,
    "simulatedGames": 248,
    "simulatedWins": 127,
    "simulatedLosses": 121,
    "simulatedWinRate": 0.5121
  },
  {
    "sovereignId": "sov_gold_118_colosso_sol_invicto",
    "sovereignName": "Colosso do Sol Invicto",
    "sovereignTitle": "Comandante Regional • Baluarte — Torre Alabastro",
    "realmOrigin": "Bastilhas Celestes do Zênite",
    "archetypeId": "dual_red_gold",
    "archetypeName": "Pacto das Escamas Imperiais",
    "archetypeSubtitle": "Pacto Duplo 🔥+☀️ • Dragões Solares & Escudo Divino",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "red",
      "gold"
    ],
    "avatarCardId": "gold_118_colosso_sol_invicto",
    "eloRating": 1468,
    "eloRd": 20,
    "simulatedGames": 248,
    "simulatedWins": 127,
    "simulatedLosses": 121,
    "simulatedWinRate": 0.5121
  },
  {
    "sovereignId": "sov_green_118_espinossauro_abissal",
    "sovereignName": "Espinossauro Alfa Primordial",
    "sovereignTitle": "Comandante Regional • Atalaia — Forte de Pau-Ferro",
    "realmOrigin": "Raízes Abissais da Árvore-Mãe",
    "archetypeId": "dual_green_gold",
    "archetypeName": "Pacto da Aurora Silvestre",
    "archetypeSubtitle": "Pacto Duplo 🌿+☀️ • Falange dos Mil Escudos & Hinos Globais",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "green",
      "gold"
    ],
    "avatarCardId": "green_118_espinossauro_abissal",
    "eloRating": 1467,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 137,
    "simulatedLosses": 115,
    "simulatedWinRate": 0.5437
  },
  {
    "sovereignId": "sov_blue_44_dragao_prateado",
    "sovereignName": "Aureon, Dragão da Geada Astral",
    "sovereignTitle": "Grão-Soberano • Cúpula Alta do Observatório de Safira",
    "realmOrigin": "Arquipélago Astral das Estrelas Mortas",
    "archetypeId": "mono_blue_chrono",
    "archetypeName": "Conclave Cronomante",
    "archetypeSubtitle": "Mono-Azul ⚡ • Compra, Reações & Feitiços",
    "skillTier": 3,
    "isGrandSovereign": true,
    "format": "monocolor",
    "domains": [
      "blue"
    ],
    "avatarCardId": "blue_44_dragao_prateado",
    "eloRating": 1463,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 137,
    "simulatedLosses": 115,
    "simulatedWinRate": 0.5437
  },
  {
    "sovereignId": "sov_blue_153_leviata_fenda_abissal",
    "sovereignName": "Zephyrus, Monarca do Ciclone",
    "sovereignTitle": "Comandante Regional • Vanguarda — Ponte de Gelo Astral",
    "realmOrigin": "Arquipélago Astral das Estrelas Mortas",
    "archetypeId": "dual_blue_purple",
    "archetypeName": "Pacto da Tormenta Abissal",
    "archetypeSubtitle": "Pacto Duplo ❄️+💀 • Estase Glacial & Execução Umbral",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "blue",
      "purple"
    ],
    "avatarCardId": "blue_153_leviata_fenda_abissal",
    "eloRating": 1461,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 124,
    "simulatedLosses": 128,
    "simulatedWinRate": 0.4921
  },
  {
    "sovereignId": "sov_neutral_06_cultista_ofidio",
    "sovereignName": "Grão-Ofídio de Sangue Frio",
    "sovereignTitle": "Comandante Regional • Baluarte — Ponte Cinzenta do Pacto",
    "realmOrigin": "Cratera da Fratura Prismática",
    "archetypeId": "dual_purple_neutral",
    "archetypeName": "Aliança da Guilda das Máscaras",
    "archetypeSubtitle": "Aliança 💀+⚙️ • Lâminas Letais, Dreno & Submundo Axial",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "purple",
      "neutral"
    ],
    "avatarCardId": "neutral_06_cultista_ofidio",
    "eloRating": 1460,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 133,
    "simulatedLosses": 115,
    "simulatedWinRate": 0.5363
  },
  {
    "sovereignId": "sov_neutral_92_senhor_guerra_fronteira",
    "sovereignName": "Marechal Mercenário da Fronteira",
    "sovereignTitle": "Comandante Regional • Guarita dos Cinco Selos",
    "realmOrigin": "Cratera da Fratura Prismática",
    "archetypeId": "dual_purple_neutral",
    "archetypeName": "Aliança da Guilda das Máscaras",
    "archetypeSubtitle": "Aliança 💀+⚙️ • Lâminas Letais, Dreno & Submundo Axial",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "purple",
      "neutral"
    ],
    "avatarCardId": "neutral_92_senhor_guerra_fronteira",
    "eloRating": 1459,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 130,
    "simulatedLosses": 122,
    "simulatedWinRate": 0.5159
  },
  {
    "sovereignId": "sov_purple_167_arauto_prisma_abismo",
    "sovereignName": "Arauto do Eclipse Prismático",
    "sovereignTitle": "Grão-Soberano • Fenda Ocidental do Firmamento",
    "realmOrigin": "Vale do Eclipse — Oeste Profundo",
    "archetypeId": "dual_blue_purple",
    "archetypeName": "Pacto da Tormenta Abissal",
    "archetypeSubtitle": "Pacto Duplo ❄️+💀 • Estase Glacial & Execução Umbral",
    "skillTier": 3,
    "isGrandSovereign": true,
    "format": "bicolor",
    "domains": [
      "blue",
      "purple"
    ],
    "avatarCardId": "purple_167_arauto_prisma_abismo",
    "eloRating": 1457,
    "eloRd": 20,
    "simulatedGames": 244,
    "simulatedWins": 116,
    "simulatedLosses": 128,
    "simulatedWinRate": 0.4754
  },
  {
    "sovereignId": "sov_green_119_behemoth_cratera_verde",
    "sovereignName": "Behemoth da Cratera Verde",
    "sovereignTitle": "Comandante Regional • Ponte do Musgo Antigo",
    "realmOrigin": "Galhada Viva — Cidadela da Árvore-Mãe",
    "archetypeId": "mono_green_swarm",
    "archetypeName": "Enxame & Matilha Silvestre",
    "archetypeSubtitle": "Mono-Verde 🌿 • Aggro & Buff em Massa",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "green"
    ],
    "avatarCardId": "green_119_behemoth_cratera_verde",
    "eloRating": 1456,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 133,
    "simulatedLosses": 119,
    "simulatedWinRate": 0.5278
  },
  {
    "sovereignId": "sov_gold_20_androesfinge",
    "sovereignName": "Esfinge Juíza do Templo Solar",
    "sovereignTitle": "Comandante Regional • Ponte de Alabastro",
    "realmOrigin": "Bastião Dourado de Aethelgard",
    "archetypeId": "mono_gold_phalanx",
    "archetypeName": "Falange Impenetrável",
    "archetypeSubtitle": "Mono-Dourado 🛡️ • Guardião, Armadura & Bastião",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "gold"
    ],
    "avatarCardId": "gold_20_androesfinge",
    "eloRating": 1456,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 128,
    "simulatedLosses": 124,
    "simulatedWinRate": 0.5079
  },
  {
    "sovereignId": "sov_blue_05_gigante_nuvens",
    "sovereignName": "Soberano das Nuvens Altas",
    "sovereignTitle": "Comandante Regional • Reduto — Farol dos Recifes Sudoeste",
    "realmOrigin": "Mar Interior das Tormentas & Estreito das Frotas",
    "archetypeId": "dual_blue_neutral",
    "archetypeName": "Aliança do Astrolábio Arcano",
    "archetypeSubtitle": "Aliança ❄️+⚙️ • Controle Horológico, Alcance & Voo",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "blue",
      "neutral"
    ],
    "avatarCardId": "blue_05_gigante_nuvens",
    "eloRating": 1455,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 133,
    "simulatedLosses": 119,
    "simulatedWinRate": 0.5278
  },
  {
    "sovereignId": "sov_gold_08_golem_ferro",
    "sovereignName": "Golem de Ferro Inexpugnável",
    "sovereignTitle": "Comandante Regional • Aquedutos & Jardins em Cascata",
    "realmOrigin": "Bastião Dourado de Aethelgard",
    "archetypeId": "dual_green_gold",
    "archetypeName": "Pacto da Aurora Silvestre",
    "archetypeSubtitle": "Pacto Duplo 🌿+☀️ • Falange dos Mil Escudos & Hinos Globais",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "green",
      "gold"
    ],
    "avatarCardId": "gold_08_golem_ferro",
    "eloRating": 1453,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 137,
    "simulatedLosses": 115,
    "simulatedWinRate": 0.5437
  },
  {
    "sovereignId": "sov_green_45_verme_roxo",
    "sovereignName": "Titã Escavador das Raízes",
    "sovereignTitle": "Comandante Regional • Bosque dos Fungos Luminescentes",
    "realmOrigin": "Raízes Abissais da Árvore-Mãe",
    "archetypeId": "dual_purple_green",
    "archetypeName": "Pacto da Podridão Eterna",
    "archetypeSubtitle": "Pacto Duplo 💀+🌿 • Cripta, Regeneração & Veneno",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "purple",
      "green"
    ],
    "avatarCardId": "green_45_verme_roxo",
    "eloRating": 1452,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 132,
    "simulatedLosses": 120,
    "simulatedWinRate": 0.5238
  },
  {
    "sovereignId": "sov_gold_47_dragao_solar",
    "sovereignName": "Heliodor, Dragão do Sol Nascente",
    "sovereignTitle": "Grão-Soberano • Muralha Leste de Solária",
    "realmOrigin": "Corredor Boreal das Nuvens & Correntes Dracônicas",
    "archetypeId": "dual_purple_gold",
    "archetypeName": "Pacto da Inquisição Crepuscular",
    "archetypeSubtitle": "Pacto Duplo 💀+☀️ • Dreno Solar, Renascer & Veredito",
    "skillTier": 3,
    "isGrandSovereign": true,
    "format": "bicolor",
    "domains": [
      "purple",
      "gold"
    ],
    "avatarCardId": "gold_47_dragao_solar",
    "eloRating": 1452,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 121,
    "simulatedLosses": 131,
    "simulatedWinRate": 0.4802
  },
  {
    "sovereignId": "sov_green_161_dragao_esmeralda_primordial",
    "sovereignName": "Dragão Esmeralda de Galhada Viva",
    "sovereignTitle": "Grão-Soberano • Santuário do Dossel Antigo",
    "realmOrigin": "Galhada Viva — Cidadela da Árvore-Mãe",
    "archetypeId": "mono_green_colossus",
    "archetypeName": "Colossos Primordiais",
    "archetypeSubtitle": "Mono-Verde 🌿 • Ramp & Atropelar",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "monocolor",
    "domains": [
      "green"
    ],
    "avatarCardId": "green_161_dragao_esmeralda_primordial",
    "eloRating": 1450,
    "eloRd": 20,
    "simulatedGames": 248,
    "simulatedWins": 112,
    "simulatedLosses": 136,
    "simulatedWinRate": 0.4516
  },
  {
    "sovereignId": "sov_green_158_hidra_pantano_ancestral",
    "sovereignName": "Brontossauro do Santuário Vivo",
    "sovereignTitle": "Comandante Regional • Vanguarda — Santuário dos Druidas",
    "realmOrigin": "Raízes Abissais da Árvore-Mãe",
    "archetypeId": "dual_green_neutral",
    "archetypeName": "Aliança dos Engenhos Silvestres",
    "archetypeSubtitle": "Aliança 🌿+⚙️ • Colossos de Madeira-Ferro & Guildas Axiais",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "green",
      "neutral"
    ],
    "avatarCardId": "green_158_hidra_pantano_ancestral",
    "eloRating": 1446,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 115,
    "simulatedLosses": 133,
    "simulatedWinRate": 0.4637
  },
  {
    "sovereignId": "sov_gold_81_colosso_engrenagem",
    "sovereignName": "Titã do Pêndulo Dourado",
    "sovereignTitle": "Comandante Regional • Porto Real do Sol Nascente",
    "realmOrigin": "Solária — O Leste Alto",
    "archetypeId": "dual_blue_gold",
    "archetypeName": "Pacto da Forja do Zênite",
    "archetypeSubtitle": "Pacto Duplo ❄️+☀️ • Cidadela Cronomante & Escudo Celeste",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "blue",
      "gold"
    ],
    "avatarCardId": "gold_81_colosso_engrenagem",
    "eloRating": 1438,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 136,
    "simulatedLosses": 116,
    "simulatedWinRate": 0.5397
  },
  {
    "sovereignId": "sov_green_85_fenrir_primordial",
    "sovereignName": "Fenris-Vael, O Lobo do Fim das Eras",
    "sovereignTitle": "Grão-Soberano • Tundra Selvagem do Norte de Veridia",
    "realmOrigin": "Raízes Abissais da Árvore-Mãe",
    "archetypeId": "dual_blue_green",
    "archetypeName": "Pacto da Evolução Quimérica",
    "archetypeSubtitle": "Pacto Duplo ❄️+🌿 • Rampa Arcana, Compra & Leviatãs",
    "skillTier": 3,
    "isGrandSovereign": true,
    "format": "bicolor",
    "domains": [
      "blue",
      "green"
    ],
    "avatarCardId": "green_85_fenrir_primordial",
    "eloRating": 1438,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 132,
    "simulatedLosses": 116,
    "simulatedWinRate": 0.5323
  },
  {
    "sovereignId": "sov_neutral_53_colosso_prismantico",
    "sovereignName": "Colosso de Vidro Prismático",
    "sovereignTitle": "Comandante Regional • Atalaia — Guarita dos Cinco Selos",
    "realmOrigin": "Cratera da Fratura Prismática",
    "archetypeId": "mono_neutral_axial",
    "archetypeName": "Legião Axial Autômata",
    "archetypeSubtitle": "Mono-Neutro ⚙️ • Constructos, Relíquias & Matriz Horológica",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "neutral"
    ],
    "avatarCardId": "neutral_53_colosso_prismantico",
    "eloRating": 1438,
    "eloRd": 20,
    "simulatedGames": 256,
    "simulatedWins": 123,
    "simulatedLosses": 133,
    "simulatedWinRate": 0.4805
  },
  {
    "sovereignId": "sov_gold_167_arauto_prisma_sol",
    "sovereignName": "Arauto do Zênite Prismático",
    "sovereignTitle": "Grão-Soberano • Céu Oriental sobre Solária",
    "realmOrigin": "Solária — O Leste Alto",
    "archetypeId": "mono_gold_judgment",
    "archetypeName": "Julgamento Solar",
    "archetypeSubtitle": "Mono-Dourado ⚖️ • Relíquias, Escudo Global & Cura",
    "skillTier": 3,
    "isGrandSovereign": true,
    "format": "monocolor",
    "domains": [
      "gold"
    ],
    "avatarCardId": "gold_167_arauto_prisma_sol",
    "eloRating": 1437,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 123,
    "simulatedLosses": 129,
    "simulatedWinRate": 0.4881
  },
  {
    "sovereignId": "sov_green_09_hidra",
    "sovereignName": "Vorágine, Hidra Voraz do Pântano",
    "sovereignTitle": "Grão-Soberano • Pântanos Limítrofes de Veridia",
    "realmOrigin": "Raízes Abissais da Árvore-Mãe",
    "archetypeId": "dual_red_green",
    "archetypeName": "Pacto da Ruína Selvagem",
    "archetypeSubtitle": "Pacto Duplo 🔥+🌿 • Rampa Vulcânica, Ímpeto & Atropelar",
    "skillTier": 3,
    "isGrandSovereign": true,
    "format": "bicolor",
    "domains": [
      "red",
      "green"
    ],
    "avatarCardId": "green_09_hidra",
    "eloRating": 1436,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 132,
    "simulatedLosses": 120,
    "simulatedWinRate": 0.5238
  },
  {
    "sovereignId": "sov_neutral_112_caranguejo_colossal_costa",
    "sovereignName": "Caranguejo-Bastião das Rochas",
    "sovereignTitle": "Comandante Regional • Reduto — Entreposto das Caravanas Neutras",
    "realmOrigin": "Fronteira Cinzenta — Centro Axial",
    "archetypeId": "dual_purple_neutral",
    "archetypeName": "Aliança da Guilda das Máscaras",
    "archetypeSubtitle": "Aliança 💀+⚙️ • Lâminas Letais, Dreno & Submundo Axial",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "purple",
      "neutral"
    ],
    "avatarCardId": "neutral_112_caranguejo_colossal_costa",
    "eloRating": 1435,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 114,
    "simulatedLosses": 134,
    "simulatedWinRate": 0.4597
  },
  {
    "sovereignId": "sov_green_23_colosso_escavador",
    "sovereignName": "Tatu-Titã Quebra-Rochas",
    "sovereignTitle": "Comandante Regional • Guarita das Raízes Vivas",
    "realmOrigin": "Galhada Viva — Cidadela da Árvore-Mãe",
    "archetypeId": "mono_green_swarm",
    "archetypeName": "Enxame & Matilha Silvestre",
    "archetypeSubtitle": "Mono-Verde 🌿 • Aggro & Buff em Massa",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "green"
    ],
    "avatarCardId": "green_23_colosso_escavador",
    "eloRating": 1434,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 136,
    "simulatedLosses": 116,
    "simulatedWinRate": 0.5397
  },
  {
    "sovereignId": "sov_green_120_hidra_primordial_rei",
    "sovereignName": "Hidra-Rei de Sete Cabeças",
    "sovereignTitle": "Comandante Regional • Vanguarda — Clareira dos Espinhos",
    "realmOrigin": "Galhada Viva — Cidadela da Árvore-Mãe",
    "archetypeId": "mono_green_swarm",
    "archetypeName": "Enxame & Matilha Silvestre",
    "archetypeSubtitle": "Mono-Verde 🌿 • Aggro & Buff em Massa",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "green"
    ],
    "avatarCardId": "green_120_hidra_primordial_rei",
    "eloRating": 1434,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 129,
    "simulatedLosses": 119,
    "simulatedWinRate": 0.5202
  },
  {
    "sovereignId": "sov_gold_117_arcanjo_egide",
    "sovereignName": "Arcanjo da Égide Dourada",
    "sovereignTitle": "Comandante Regional • Torre Alabastro",
    "realmOrigin": "Bastilhas Celestes do Zênite",
    "archetypeId": "mono_gold_phalanx",
    "archetypeName": "Falange Impenetrável",
    "archetypeSubtitle": "Mono-Dourado 🛡️ • Guardião, Armadura & Bastião",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "gold"
    ],
    "avatarCardId": "gold_117_arcanjo_egide",
    "eloRating": 1431,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 126,
    "simulatedLosses": 126,
    "simulatedWinRate": 0.5
  },
  {
    "sovereignId": "sov_red_156_fenix_coroa_solar",
    "sovereignName": "Pyrokor, Monarca do Fogo Vivo",
    "sovereignTitle": "Comandante Regional • Garganta Piroclástica",
    "realmOrigin": "Caldeira Imperial de Vulcanor",
    "archetypeId": "mono_red_pyroclasm",
    "archetypeName": "Artilharia Piroclástica",
    "archetypeSubtitle": "Mono-Vermelho 🔥 • Queima Direta & Cataclismos",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "red"
    ],
    "avatarCardId": "red_156_fenix_coroa_solar",
    "eloRating": 1428,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 143,
    "simulatedLosses": 105,
    "simulatedWinRate": 0.5766
  },
  {
    "sovereignId": "sov_purple_117_conde_nosferatu",
    "sovereignName": "Nosferatu, Monarca Carmesim",
    "sovereignTitle": "Comandante Regional • Ponte do Ossário",
    "realmOrigin": "Catedral-Necrópole de Nocturnus",
    "archetypeId": "mono_purple_crypt",
    "archetypeName": "Guardiões da Cripta",
    "archetypeSubtitle": "Mono-Roxo 💀 • Renascer & Reanimação",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "avatarCardId": "purple_117_conde_nosferatu",
    "eloRating": 1428,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 135,
    "simulatedLosses": 113,
    "simulatedWinRate": 0.5444
  },
  {
    "sovereignId": "sov_purple_22_orbe_necrotico",
    "sovereignName": "Crânio Arcano da Morte",
    "sovereignTitle": "Comandante Regional • Cripta dos Juramentos",
    "realmOrigin": "Fossa Submersa da Catedral Afogada",
    "archetypeId": "mono_purple_crypt",
    "archetypeName": "Guardiões da Cripta",
    "archetypeSubtitle": "Mono-Roxo 💀 • Renascer & Reanimação",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "avatarCardId": "purple_22_orbe_necrotico",
    "eloRating": 1427,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 125,
    "simulatedLosses": 127,
    "simulatedWinRate": 0.496
  },
  {
    "sovereignId": "sov_purple_156_lich_coroa_entropia",
    "sovereignName": "Dragão Umbral do Eclipse",
    "sovereignTitle": "Comandante Regional • Baluarte — Cidadela da Ordem Sangue-Negro",
    "realmOrigin": "Catedral-Necrópole de Nocturnus",
    "archetypeId": "dual_purple_green",
    "archetypeName": "Pacto da Podridão Eterna",
    "archetypeSubtitle": "Pacto Duplo 💀+🌿 • Cripta, Regeneração & Veneno",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "purple",
      "green"
    ],
    "avatarCardId": "purple_156_lich_coroa_entropia",
    "eloRating": 1426,
    "eloRd": 20,
    "simulatedGames": 248,
    "simulatedWins": 118,
    "simulatedLosses": 130,
    "simulatedWinRate": 0.4758
  },
  {
    "sovereignId": "sov_gold_156_serafim_coroa_radiante",
    "sovereignName": "Arcanjo Supremo das Seis Asas",
    "sovereignTitle": "Comandante Regional • Vanguarda — Ponte de Alabastro",
    "realmOrigin": "Bastião Dourado de Aethelgard",
    "archetypeId": "mono_gold_judgment",
    "archetypeName": "Julgamento Solar",
    "archetypeSubtitle": "Mono-Dourado ⚖️ • Relíquias, Escudo Global & Cura",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "gold"
    ],
    "avatarCardId": "gold_156_serafim_coroa_radiante",
    "eloRating": 1423,
    "eloRd": 20,
    "simulatedGames": 248,
    "simulatedWins": 120,
    "simulatedLosses": 128,
    "simulatedWinRate": 0.4839
  },
  {
    "sovereignId": "sov_green_08_ente",
    "sovereignName": "Guardião Carvalho-Ancião",
    "sovereignTitle": "Comandante Regional • Clareira dos Espinhos",
    "realmOrigin": "Galhada Viva — Cidadela da Árvore-Mãe",
    "archetypeId": "mono_green_roots",
    "archetypeName": "Raízes Eternas",
    "archetypeSubtitle": "Mono-Verde 🌿 • Guardião & Regeneração",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "green"
    ],
    "avatarCardId": "green_08_ente",
    "eloRating": 1420,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 121,
    "simulatedLosses": 127,
    "simulatedWinRate": 0.4879
  },
  {
    "sovereignId": "sov_t5_mono_purple_blood",
    "sovereignName": "Carmilla, Condessa de Sangue e Ouro",
    "sovereignTitle": "Grão-Soberano • Palácio Carmesim do Vale do Eclipse",
    "realmOrigin": "Eclipse",
    "archetypeId": "mono_purple_blood",
    "archetypeName": "Tributo Vital",
    "archetypeSubtitle": "Mono-Roxo ⚡ • Dreno de Vida & Toque Letal",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "avatarCardId": "purple_46_noiva_vampira",
    "eloRating": 1414,
    "eloRd": 20,
    "simulatedGames": 248,
    "simulatedWins": 127,
    "simulatedLosses": 121,
    "simulatedWinRate": 0.5121,
    "tournamentRankTierV": 44
  },
  {
    "sovereignId": "sov_neutral_05_corsario_astral",
    "sovereignName": "Corsário da Lâmina Prateada",
    "sovereignTitle": "Capitão da Ordem • Vanguarda — Estalagem das Caravanas",
    "realmOrigin": "Fronteira Cinzenta — Centro Axial",
    "archetypeId": "dual_red_neutral",
    "archetypeName": "Aliança da Artilharia de Mercúrio",
    "archetypeSubtitle": "Aliança 🔥+⚙️ • Tropas de Choque & Assassinos Relojoeiros",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "red",
      "neutral"
    ],
    "avatarCardId": "neutral_05_corsario_astral",
    "eloRating": 1413,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 130,
    "simulatedLosses": 114,
    "simulatedWinRate": 0.5328
  },
  {
    "sovereignId": "sov_gold_82_arcanjo_cronos",
    "sovereignName": "Serafim da Décima Segunda Hora",
    "sovereignTitle": "Comandante Regional • Terraço dos Espelhos",
    "realmOrigin": "Corredor Boreal das Nuvens & Correntes Dracônicas",
    "archetypeId": "dual_blue_gold",
    "archetypeName": "Pacto da Forja do Zênite",
    "archetypeSubtitle": "Pacto Duplo ❄️+☀️ • Cidadela Cronomante & Escudo Celeste",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "blue",
      "gold"
    ],
    "avatarCardId": "gold_82_arcanjo_cronos",
    "eloRating": 1411,
    "eloRd": 20,
    "simulatedGames": 256,
    "simulatedWins": 139,
    "simulatedLosses": 117,
    "simulatedWinRate": 0.543
  },
  {
    "sovereignId": "sov_neutral_169_pressagio_revoada_matriz",
    "sovereignName": "Presságio da Revoada Primordial",
    "sovereignTitle": "Comandante Regional • Ponte Cinzenta do Pacto",
    "realmOrigin": "Cratera da Fratura Prismática",
    "archetypeId": "mono_neutral_axial",
    "archetypeName": "Legião Axial Autômata",
    "archetypeSubtitle": "Mono-Neutro ⚙️ • Constructos, Relíquias & Matriz Horológica",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "neutral"
    ],
    "avatarCardId": "neutral_169_pressagio_revoada_matriz",
    "eloRating": 1407,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 135,
    "simulatedLosses": 113,
    "simulatedWinRate": 0.5444
  },
  {
    "sovereignId": "sov_green_66_gorila_rei",
    "sovereignName": "Baphgor, O Rei Primata Ancestral",
    "sovereignTitle": "Comandante Regional • Baluarte — Bosque dos Fungos Luminescentes",
    "realmOrigin": "Raízes Abissais da Árvore-Mãe",
    "archetypeId": "mono_green_swarm",
    "archetypeName": "Enxame & Matilha Silvestre",
    "archetypeSubtitle": "Mono-Verde 🌿 • Aggro & Buff em Massa",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "green"
    ],
    "avatarCardId": "green_66_gorila_rei",
    "eloRating": 1405,
    "eloRd": 21,
    "simulatedGames": 252,
    "simulatedWins": 113,
    "simulatedLosses": 139,
    "simulatedWinRate": 0.4484
  },
  {
    "sovereignId": "sov_red_20_quimera",
    "sovereignName": "Quimera da Garganta Vulcânica",
    "sovereignTitle": "Capitão da Ordem • Tumba dos Primeiros Ferreiros",
    "realmOrigin": "Infraforja Magmática de Ignaroth",
    "archetypeId": "dual_red_neutral",
    "archetypeName": "Aliança da Artilharia de Mercúrio",
    "archetypeSubtitle": "Aliança 🔥+⚙️ • Tropas de Choque & Assassinos Relojoeiros",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "red",
      "neutral"
    ],
    "avatarCardId": "red_20_quimera",
    "eloRating": 1403,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 127,
    "simulatedLosses": 121,
    "simulatedWinRate": 0.5121
  },
  {
    "sovereignId": "sov_blue_135_dragao_glaciar_eterno",
    "sovereignName": "Dragão do Glaciar Eterno",
    "sovereignTitle": "Comandante Regional • Farol dos Recifes Sudoeste",
    "realmOrigin": "Mar Interior das Tormentas & Estreito das Frotas",
    "archetypeId": "dual_red_blue",
    "archetypeName": "Pacto do Fogo Astral",
    "archetypeSubtitle": "Pacto Duplo 🔥+❄️ • Artilharia Arcana, Voo & Tempestade",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "red",
      "blue"
    ],
    "avatarCardId": "blue_135_dragao_glaciar_eterno",
    "eloRating": 1401,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 132,
    "simulatedLosses": 120,
    "simulatedWinRate": 0.5238
  },
  {
    "sovereignId": "sov_green_140_colosso_pangeia",
    "sovereignName": "Tartaruga-Titã de Pangeia",
    "sovereignTitle": "Comandante Regional • Atalaia — Guarita das Raízes Vivas",
    "realmOrigin": "Galhada Viva — Cidadela da Árvore-Mãe",
    "archetypeId": "dual_green_neutral",
    "archetypeName": "Aliança dos Engenhos Silvestres",
    "archetypeSubtitle": "Aliança 🌿+⚙️ • Colossos de Madeira-Ferro & Guildas Axiais",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "green",
      "neutral"
    ],
    "avatarCardId": "green_140_colosso_pangeia",
    "eloRating": 1398,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 106,
    "simulatedLosses": 142,
    "simulatedWinRate": 0.4274
  },
  {
    "sovereignId": "sov_gold_23_dragao_prata",
    "sovereignName": "Argentum, Sentinela Alabastro",
    "sovereignTitle": "Comandante Regional • Terraço dos Espelhos",
    "realmOrigin": "Bastilhas Celestes do Zênite",
    "archetypeId": "mono_gold_judgment",
    "archetypeName": "Julgamento Solar",
    "archetypeSubtitle": "Mono-Dourado ⚖️ • Relíquias, Escudo Global & Cura",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "gold"
    ],
    "avatarCardId": "gold_23_dragao_prata",
    "eloRating": 1396,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 117,
    "simulatedLosses": 127,
    "simulatedWinRate": 0.4795
  },
  {
    "sovereignId": "sov_purple_08_lorde_abissal",
    "sovereignName": "Balgorath, Flagelo do Abismo",
    "sovereignTitle": "Grão-Soberano • Garganta de Cinzas do Oeste",
    "realmOrigin": "Vale do Eclipse — Oeste Profundo",
    "archetypeId": "dual_purple_neutral",
    "archetypeName": "Aliança da Guilda das Máscaras",
    "archetypeSubtitle": "Aliança 💀+⚙️ • Lâminas Letais, Dreno & Submundo Axial",
    "skillTier": 3,
    "isGrandSovereign": true,
    "format": "bicolor",
    "domains": [
      "purple",
      "neutral"
    ],
    "avatarCardId": "purple_08_lorde_abissal",
    "eloRating": 1394,
    "eloRd": 21,
    "simulatedGames": 252,
    "simulatedWins": 123,
    "simulatedLosses": 129,
    "simulatedWinRate": 0.4881
  },
  {
    "sovereignId": "sov_green_160_behemoth_cratera_viva",
    "sovereignName": "Terrakhor, Monarca da Rocha Eterna",
    "sovereignTitle": "Arconte Tático • Santuário dos Druidas",
    "realmOrigin": "Galhada Viva — Cidadela da Árvore-Mãe",
    "archetypeId": "mono_green_roots",
    "archetypeName": "Raízes Eternas",
    "archetypeSubtitle": "Mono-Verde 🌿 • Guardião & Regeneração",
    "skillTier": 4,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "green"
    ],
    "avatarCardId": "green_160_behemoth_cratera_viva",
    "eloRating": 1391,
    "eloRd": 20,
    "simulatedGames": 256,
    "simulatedWins": 135,
    "simulatedLosses": 121,
    "simulatedWinRate": 0.5273
  },
  {
    "sovereignId": "sov_purple_82_senhor_malogro",
    "sovereignName": "Nihil-Vael, Devorador de Linhas do Tempo",
    "sovereignTitle": "Grão-Soberano • Abismo Horológico do Oeste",
    "realmOrigin": "Vale do Eclipse — Oeste Profundo",
    "archetypeId": "mono_purple_blood",
    "archetypeName": "Tributo Vital",
    "archetypeSubtitle": "Mono-Roxo ⚡ • Dreno de Vida & Toque Letal",
    "skillTier": 3,
    "isGrandSovereign": true,
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "avatarCardId": "purple_82_senhor_malogro",
    "eloRating": 1380,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 140,
    "simulatedLosses": 108,
    "simulatedWinRate": 0.5645
  },
  {
    "sovereignId": "sov_green_139_dragao_floresta_antiga",
    "sovereignName": "Dragão da Floresta Primordial",
    "sovereignTitle": "Comandante Regional • Baluarte — Ponte do Musgo Antigo",
    "realmOrigin": "Galhada Viva — Cidadela da Árvore-Mãe",
    "archetypeId": "dual_blue_green",
    "archetypeName": "Pacto da Evolução Quimérica",
    "archetypeSubtitle": "Pacto Duplo ❄️+🌿 • Rampa Arcana, Compra & Leviatãs",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "blue",
      "green"
    ],
    "avatarCardId": "green_139_dragao_floresta_antiga",
    "eloRating": 1380,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 118,
    "simulatedLosses": 134,
    "simulatedWinRate": 0.4683
  },
  {
    "sovereignId": "sov_neutral_07_mutante_caos",
    "sovereignName": "Devorador Mutante do Limbo",
    "sovereignTitle": "Comandante Regional • Atalaia — Coliseu Externo dos Selos",
    "realmOrigin": "Fronteira Cinzenta — Centro Axial",
    "archetypeId": "dual_purple_neutral",
    "archetypeName": "Aliança da Guilda das Máscaras",
    "archetypeSubtitle": "Aliança 💀+⚙️ • Lâminas Letais, Dreno & Submundo Axial",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "purple",
      "neutral"
    ],
    "avatarCardId": "neutral_07_mutante_caos",
    "eloRating": 1377,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 120,
    "simulatedLosses": 132,
    "simulatedWinRate": 0.4762
  },
  {
    "sovereignId": "sov_green_159_tiranossauro_imperador",
    "sovereignName": "Hidra de Peçonha Esmeralda",
    "sovereignTitle": "Arconte Tático • Atalaia — Santuário dos Druidas",
    "realmOrigin": "Galhada Viva — Cidadela da Árvore-Mãe",
    "archetypeId": "mono_green_colossus",
    "archetypeName": "Colossos Primordiais",
    "archetypeSubtitle": "Mono-Verde 🌿 • Ramp & Atropelar",
    "skillTier": 4,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "green"
    ],
    "avatarCardId": "green_159_tiranossauro_imperador",
    "eloRating": 1375,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 131,
    "simulatedLosses": 121,
    "simulatedWinRate": 0.5198
  },
  {
    "sovereignId": "sov_red_155_senhor_efreeti_chama",
    "sovereignName": "Dragão Tectônico de Lava",
    "sovereignTitle": "Comandante Regional • Baluarte — Ponte das Correntes Rubras",
    "realmOrigin": "Caldeira Imperial de Vulcanor",
    "archetypeId": "mono_red_pyroclasm",
    "archetypeName": "Artilharia Piroclástica",
    "archetypeSubtitle": "Mono-Vermelho 🔥 • Queima Direta & Cataclismos",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "red"
    ],
    "avatarCardId": "red_155_senhor_efreeti_chama",
    "eloRating": 1372,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 130,
    "simulatedLosses": 122,
    "simulatedWinRate": 0.5159
  },
  {
    "sovereignId": "sov_neutral_171_pactuario_elemental_matriz",
    "sovereignName": "Pactuário do Éter Primordial",
    "sovereignTitle": "Comandante Regional • Encruzilhada das Cinco Linhas de Ley",
    "realmOrigin": "Fronteira Cinzenta — Centro Axial",
    "archetypeId": "dual_blue_neutral",
    "archetypeName": "Aliança do Astrolábio Arcano",
    "archetypeSubtitle": "Aliança ❄️+⚙️ • Controle Horológico, Alcance & Voo",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "blue",
      "neutral"
    ],
    "avatarCardId": "neutral_171_pactuario_elemental_matriz",
    "eloRating": 1364,
    "eloRd": 21,
    "simulatedGames": 256,
    "simulatedWins": 141,
    "simulatedLosses": 115,
    "simulatedWinRate": 0.5508
  },
  {
    "sovereignId": "sov_red_64_principe_fogo",
    "sovereignName": "Ignis-Vael, Príncipe do Núcleo Ardente",
    "sovereignTitle": "Grão-Soberano • Câmara Magmática de Pyros",
    "realmOrigin": "Pyros — O Norte Vulcânico",
    "archetypeId": "mono_red_dragon",
    "archetypeName": "Trono Dracônico",
    "archetypeSubtitle": "Mono-Vermelho 🔥 • Voo, Sopro & Ascensão",
    "skillTier": 3,
    "isGrandSovereign": true,
    "format": "monocolor",
    "domains": [
      "red"
    ],
    "avatarCardId": "red_64_principe_fogo",
    "eloRating": 1362,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 129,
    "simulatedLosses": 119,
    "simulatedWinRate": 0.5202
  },
  {
    "sovereignId": "sov_green_102_hidra_venenosa",
    "sovereignName": "Polydra, A Hidra de Nove Cabeças",
    "sovereignTitle": "Grão-Soberano • Delta Esmeralda de Veridia",
    "realmOrigin": "Veridia — O Sul Selvagem",
    "archetypeId": "mono_green_roots",
    "archetypeName": "Raízes Eternas",
    "archetypeSubtitle": "Mono-Verde 🌿 • Guardião & Regeneração",
    "skillTier": 3,
    "isGrandSovereign": true,
    "format": "monocolor",
    "domains": [
      "green"
    ],
    "avatarCardId": "green_102_hidra_venenosa",
    "eloRating": 1361,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 126,
    "simulatedLosses": 126,
    "simulatedWinRate": 0.5
  },
  {
    "sovereignId": "sov_red_169_pressagio_revoada_chama",
    "sovereignName": "Presságio da Revoada Cinzenta",
    "sovereignTitle": "Capitão da Ordem • Bastião de Basalto",
    "realmOrigin": "Pyros — O Norte Vulcânico",
    "archetypeId": "dual_red_neutral",
    "archetypeName": "Aliança da Artilharia de Mercúrio",
    "archetypeSubtitle": "Aliança 🔥+⚙️ • Tropas de Choque & Assassinos Relojoeiros",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "red",
      "neutral"
    ],
    "avatarCardId": "red_169_pressagio_revoada_chama",
    "eloRating": 1360,
    "eloRd": 20,
    "simulatedGames": 256,
    "simulatedWins": 123,
    "simulatedLosses": 133,
    "simulatedWinRate": 0.4805
  },
  {
    "sovereignId": "sov_green_101_tiranossauro_alfa",
    "sovereignName": "Rex Primordial da Cratera Verde",
    "sovereignTitle": "Comandante Regional • Santuário dos Druidas",
    "realmOrigin": "Raízes Abissais da Árvore-Mãe",
    "archetypeId": "mono_green_roots",
    "archetypeName": "Raízes Eternas",
    "archetypeSubtitle": "Mono-Verde 🌿 • Guardião & Regeneração",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "green"
    ],
    "avatarCardId": "green_101_tiranossauro_alfa",
    "eloRating": 1350,
    "eloRd": 20,
    "simulatedGames": 260,
    "simulatedWins": 133,
    "simulatedLosses": 127,
    "simulatedWinRate": 0.5115
  },
  {
    "sovereignId": "sov_purple_64_lorde_sem_rosto",
    "sovereignName": "Voraghor, O Vazio Gelatinoso",
    "sovereignTitle": "Comandante Regional • Baluarte — Cripta dos Juramentos",
    "realmOrigin": "Fossa Submersa da Catedral Afogada",
    "archetypeId": "mono_purple_blood",
    "archetypeName": "Tributo Vital",
    "archetypeSubtitle": "Mono-Roxo ⚡ • Dreno de Vida & Toque Letal",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "avatarCardId": "purple_64_lorde_sem_rosto",
    "eloRating": 1340,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 126,
    "simulatedLosses": 122,
    "simulatedWinRate": 0.5081
  },
  {
    "sovereignId": "sov_gold_64_rei_hekton",
    "sovereignName": "Hekaton, Monarca do Trono do Trovão",
    "sovereignTitle": "Capitão da Ordem • Vanguarda — Forte do Zênite",
    "realmOrigin": "Corredor Boreal das Nuvens & Correntes Dracônicas",
    "archetypeId": "dual_blue_gold",
    "archetypeName": "Pacto da Forja do Zênite",
    "archetypeSubtitle": "Pacto Duplo ❄️+☀️ • Cidadela Cronomante & Escudo Celeste",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "blue",
      "gold"
    ],
    "avatarCardId": "gold_64_rei_hekton",
    "eloRating": 1320,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 127,
    "simulatedLosses": 117,
    "simulatedWinRate": 0.5205
  },
  {
    "sovereignId": "sov_green_167_arauto_prisma_selva",
    "sovereignName": "Arauto da Raiz Prismática",
    "sovereignTitle": "Grão-Soberano • Abóbada Meridional sobre Veridia",
    "realmOrigin": "Veridia — O Sul Selvagem",
    "archetypeId": "mono_green_colossus",
    "archetypeName": "Colossos Primordiais",
    "archetypeSubtitle": "Mono-Verde 🌿 • Ramp & Atropelar",
    "skillTier": 3,
    "isGrandSovereign": true,
    "format": "monocolor",
    "domains": [
      "green"
    ],
    "avatarCardId": "green_167_arauto_prisma_selva",
    "eloRating": 1319,
    "eloRd": 21,
    "simulatedGames": 252,
    "simulatedWins": 118,
    "simulatedLosses": 134,
    "simulatedWinRate": 0.4683
  },
  {
    "sovereignId": "sov_purple_05_cavaleiro_morte",
    "sovereignName": "Paladino do Juramento Quebrado",
    "sovereignTitle": "Capitão da Ordem • Escarpa do Sol Carmesim",
    "realmOrigin": "Vale do Eclipse — Oeste Profundo",
    "archetypeId": "dual_red_purple",
    "archetypeName": "Pacto da Chama Sangrenta",
    "archetypeSubtitle": "Pacto Duplo 🔥+💀 • Blitz Sanguinária, Dreno & Último Suspiro",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "red",
      "purple"
    ],
    "avatarCardId": "purple_05_cavaleiro_morte",
    "eloRating": 1316,
    "eloRd": 21,
    "simulatedGames": 236,
    "simulatedWins": 121,
    "simulatedLosses": 115,
    "simulatedWinRate": 0.5127
  },
  {
    "sovereignId": "sov_gold_134_esfinge_sentenca_real",
    "sovereignName": "Esfinge da Sentença Real",
    "sovereignTitle": "Capitão da Ordem • Mina de Ouro Sagrado",
    "realmOrigin": "Solária — O Leste Alto",
    "archetypeId": "dual_gold_neutral",
    "archetypeName": "Aliança do Bastião Relojoeiro",
    "archetypeSubtitle": "Aliança ☀️+⚙️ • Falange de Ferro Meteórico & Escudo Real",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "gold",
      "neutral"
    ],
    "avatarCardId": "gold_134_esfinge_sentenca_real",
    "eloRating": 1315,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 120,
    "simulatedLosses": 124,
    "simulatedWinRate": 0.4918
  },
  {
    "sovereignId": "sov_purple_136_dragao_espectral_abismo",
    "sovereignName": "Dragão Espectral do Abismo",
    "sovereignTitle": "Comandante Regional • Atalaia — Ponte do Ossário",
    "realmOrigin": "Catedral-Necrópole de Nocturnus",
    "archetypeId": "mono_purple_blood",
    "archetypeName": "Tributo Vital",
    "archetypeSubtitle": "Mono-Roxo ⚡ • Dreno de Vida & Toque Letal",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "avatarCardId": "purple_136_dragao_espectral_abismo",
    "eloRating": 1314,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 122,
    "simulatedLosses": 126,
    "simulatedWinRate": 0.4919
  },
  {
    "sovereignId": "sov_gold_06_deva",
    "sovereignName": "Arauto Seráfico da Alvorada",
    "sovereignTitle": "Capitão da Ordem • Viaduto Imperial das Nuvens",
    "realmOrigin": "Corredor Boreal das Nuvens & Correntes Dracônicas",
    "archetypeId": "dual_gold_neutral",
    "archetypeName": "Aliança do Bastião Relojoeiro",
    "archetypeSubtitle": "Aliança ☀️+⚙️ • Falange de Ferro Meteórico & Escudo Real",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "gold",
      "neutral"
    ],
    "avatarCardId": "gold_06_deva",
    "eloRating": 1301,
    "eloRd": 21,
    "simulatedGames": 252,
    "simulatedWins": 122,
    "simulatedLosses": 130,
    "simulatedWinRate": 0.4841
  },
  {
    "sovereignId": "sov_gold_05_automato_guardiao",
    "sovereignName": "Autômato Égide da Cidadela",
    "sovereignTitle": "Capitão da Ordem • Forte do Zênite",
    "realmOrigin": "Corredor Boreal das Nuvens & Correntes Dracônicas",
    "archetypeId": "mono_gold_celestial",
    "archetypeName": "Legião Celeste",
    "archetypeSubtitle": "Mono-Dourado ☀️ • Escudo Divino, Voo & Ascensão",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "gold"
    ],
    "avatarCardId": "gold_05_automato_guardiao",
    "eloRating": 1293,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 118,
    "simulatedLosses": 130,
    "simulatedWinRate": 0.4758
  },
  {
    "sovereignId": "sov_gold_154_colosso_marmore_sagrado",
    "sovereignName": "Leão Sagrado de Juba Solar",
    "sovereignTitle": "Capitão da Ordem • Reduto — Colunata dos Reis Antigos",
    "realmOrigin": "Solária — O Leste Alto",
    "archetypeId": "mono_gold_phalanx",
    "archetypeName": "Falange Impenetrável",
    "archetypeSubtitle": "Mono-Dourado 🛡️ • Guardião, Armadura & Bastião",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "gold"
    ],
    "avatarCardId": "gold_154_colosso_marmore_sagrado",
    "eloRating": 1291,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 118,
    "simulatedLosses": 126,
    "simulatedWinRate": 0.4836
  },
  {
    "sovereignId": "sov_purple_135_colosso_catacumba",
    "sovereignName": "Colosso Gótico da Catacumba",
    "sovereignTitle": "Capitão da Ordem • Vanguarda — Bastilha de Sangue-Ferro",
    "realmOrigin": "Vale do Eclipse — Oeste Profundo",
    "archetypeId": "dual_purple_green",
    "archetypeName": "Pacto da Podridão Eterna",
    "archetypeSubtitle": "Pacto Duplo 💀+🌿 • Cripta, Regeneração & Veneno",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "purple",
      "green"
    ],
    "avatarCardId": "purple_135_colosso_catacumba",
    "eloRating": 1291,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 114,
    "simulatedLosses": 134,
    "simulatedWinRate": 0.4597
  },
  {
    "sovereignId": "sov_green_116_ent_espinheiro_anciao",
    "sovereignName": "Ent Espinheiro Ancião",
    "sovereignTitle": "Capitão da Ordem • Atalaia — Guarita das Raízes Vivas",
    "realmOrigin": "Raízes Abissais da Árvore-Mãe",
    "archetypeId": "dual_green_gold",
    "archetypeName": "Pacto da Aurora Silvestre",
    "archetypeSubtitle": "Pacto Duplo 🌿+☀️ • Falange dos Mil Escudos & Hinos Globais",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "green",
      "gold"
    ],
    "avatarCardId": "green_116_ent_espinheiro_anciao",
    "eloRating": 1286,
    "eloRd": 20,
    "simulatedGames": 256,
    "simulatedWins": 132,
    "simulatedLosses": 124,
    "simulatedWinRate": 0.5156
  },
  {
    "sovereignId": "sov_purple_153_arquidemonio_malogro",
    "sovereignName": "Arquidemônio do Miasma Eterno",
    "sovereignTitle": "Capitão da Ordem • Bastilha de Sangue-Ferro",
    "realmOrigin": "Vale do Eclipse — Oeste Profundo",
    "archetypeId": "dual_purple_gold",
    "archetypeName": "Pacto da Inquisição Crepuscular",
    "archetypeSubtitle": "Pacto Duplo 💀+☀️ • Dreno Solar, Renascer & Veredito",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "purple",
      "gold"
    ],
    "avatarCardId": "purple_153_arquidemonio_malogro",
    "eloRating": 1282,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 124,
    "simulatedLosses": 120,
    "simulatedWinRate": 0.5082
  },
  {
    "sovereignId": "sov_purple_98_cavaleiro_apocalipse",
    "sovereignName": "Cavaleiro Pálido da Ruína",
    "sovereignTitle": "Capitão da Ordem • Atalaia — Escarpa do Sol Carmesim",
    "realmOrigin": "Vale do Eclipse — Oeste Profundo",
    "archetypeId": "dual_purple_green",
    "archetypeName": "Pacto da Podridão Eterna",
    "archetypeSubtitle": "Pacto Duplo 💀+🌿 • Cripta, Regeneração & Veneno",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "purple",
      "green"
    ],
    "avatarCardId": "purple_98_cavaleiro_apocalipse",
    "eloRating": 1273,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 123,
    "simulatedLosses": 121,
    "simulatedWinRate": 0.5041
  },
  {
    "sovereignId": "sov_gold_135_serafim_seis_asas",
    "sovereignName": "Serafim de Seis Asas do Zênite",
    "sovereignTitle": "Capitão da Ordem • Cidadela da Guarda Dourada",
    "realmOrigin": "Solária — O Leste Alto",
    "archetypeId": "mono_gold_phalanx",
    "archetypeName": "Falange Impenetrável",
    "archetypeSubtitle": "Mono-Dourado 🛡️ • Guardião, Armadura & Bastião",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "gold"
    ],
    "avatarCardId": "gold_135_serafim_seis_asas",
    "eloRating": 1272,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 121,
    "simulatedLosses": 127,
    "simulatedWinRate": 0.4879
  },
  {
    "sovereignId": "sov_green_157_quimera_tres_presas",
    "sovereignName": "Tiranossauro Soberano da Selva",
    "sovereignTitle": "Comandante Regional • Reduto — Terraço da Seiva Dourada",
    "realmOrigin": "Raízes Abissais da Árvore-Mãe",
    "archetypeId": "mono_green_colossus",
    "archetypeName": "Colossos Primordiais",
    "archetypeSubtitle": "Mono-Verde 🌿 • Ramp & Atropelar",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "green"
    ],
    "avatarCardId": "green_157_quimera_tres_presas",
    "eloRating": 1260,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 115,
    "simulatedLosses": 133,
    "simulatedWinRate": 0.4637
  },
  {
    "sovereignId": "sov_red_06_efreeti",
    "sovereignName": "Soberano Ígneo da Cidadela de Bronze",
    "sovereignTitle": "Capitão da Ordem • Ponte das Correntes Rubras",
    "realmOrigin": "Infraforja Magmática de Ignaroth",
    "archetypeId": "mono_red_blitz",
    "archetypeName": "Blitz Salamandra",
    "archetypeSubtitle": "Mono-Vermelho 🔥 • Ímpeto & Pele Incandescente",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "red"
    ],
    "avatarCardId": "red_06_efreeti",
    "eloRating": 1255,
    "eloRd": 21,
    "simulatedGames": 228,
    "simulatedWins": 120,
    "simulatedLosses": 108,
    "simulatedWinRate": 0.5263
  },
  {
    "sovereignId": "sov_purple_21_abolete",
    "sovereignName": "Leviatã Psíquico Primordial",
    "sovereignTitle": "Capitão da Ordem • Atalaia — Forte da Névoa Negra",
    "realmOrigin": "Fossa Submersa da Catedral Afogada",
    "archetypeId": "dual_purple_gold",
    "archetypeName": "Pacto da Inquisição Crepuscular",
    "archetypeSubtitle": "Pacto Duplo 💀+☀️ • Dreno Solar, Renascer & Veredito",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "purple",
      "gold"
    ],
    "avatarCardId": "purple_21_abolete",
    "eloRating": 1255,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 121,
    "simulatedLosses": 123,
    "simulatedWinRate": 0.4959
  },
  {
    "sovereignId": "sov_purple_97_arquidemonio_sombras",
    "sovereignName": "Malphas, O Arquidemônio das Sombras",
    "sovereignTitle": "Capitão da Ordem • Reduto — Garganta do Crepúsculo",
    "realmOrigin": "Vale do Eclipse — Oeste Profundo",
    "archetypeId": "dual_red_purple",
    "archetypeName": "Pacto da Chama Sangrenta",
    "archetypeSubtitle": "Pacto Duplo 🔥+💀 • Blitz Sanguinária, Dreno & Último Suspiro",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "red",
      "purple"
    ],
    "avatarCardId": "purple_97_arquidemonio_sombras",
    "eloRating": 1255,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 112,
    "simulatedLosses": 136,
    "simulatedWinRate": 0.4516
  },
  {
    "sovereignId": "sov_red_117_arauto_erupcao",
    "sovereignName": "Arauto Demoníaco da Erupção",
    "sovereignTitle": "Capitão da Ordem • Ponte de Ferro sobre o Rio de Lava",
    "realmOrigin": "Pyros — O Norte Vulcânico",
    "archetypeId": "dual_red_purple",
    "archetypeName": "Pacto da Chama Sangrenta",
    "archetypeSubtitle": "Pacto Duplo 🔥+💀 • Blitz Sanguinária, Dreno & Último Suspiro",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "red",
      "purple"
    ],
    "avatarCardId": "red_117_arauto_erupcao",
    "eloRating": 1250,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 113,
    "simulatedLosses": 131,
    "simulatedWinRate": 0.4631
  },
  {
    "sovereignId": "sov_blue_95_leviata_abissal",
    "sovereignName": "Serpente Leviatã das Fendas",
    "sovereignTitle": "Capitão da Ordem • Ponte de Gelo Astral",
    "realmOrigin": "Mar Interior das Tormentas & Estreito das Frotas",
    "archetypeId": "mono_blue_frost",
    "archetypeName": "Inverno Eterno",
    "archetypeSubtitle": "Mono-Azul ❄️ • Congelar & Estase Tática",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "blue"
    ],
    "avatarCardId": "blue_95_leviata_abissal",
    "eloRating": 1249,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 117,
    "simulatedLosses": 131,
    "simulatedWinRate": 0.4718
  },
  {
    "sovereignId": "sov_gold_19_touro_ferreo",
    "sovereignName": "Touro Couraçado de Bronze",
    "sovereignTitle": "Capitão da Ordem • Reduto — Ponte de Alabastro",
    "realmOrigin": "Corredor Boreal das Nuvens & Correntes Dracônicas",
    "archetypeId": "dual_blue_gold",
    "archetypeName": "Pacto da Forja do Zênite",
    "archetypeSubtitle": "Pacto Duplo ❄️+☀️ • Cidadela Cronomante & Escudo Celeste",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "blue",
      "gold"
    ],
    "avatarCardId": "gold_19_touro_ferreo",
    "eloRating": 1245,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 121,
    "simulatedLosses": 123,
    "simulatedWinRate": 0.4959
  },
  {
    "sovereignId": "sov_purple_134_matriarca_noite_eterna",
    "sovereignName": "Matriarca da Noite Eterna",
    "sovereignTitle": "Capitão da Ordem • Reduto — Cripta dos Juramentos",
    "realmOrigin": "Vale do Eclipse — Oeste Profundo",
    "archetypeId": "dual_red_purple",
    "archetypeName": "Pacto da Chama Sangrenta",
    "archetypeSubtitle": "Pacto Duplo 🔥+💀 • Blitz Sanguinária, Dreno & Último Suspiro",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "red",
      "purple"
    ],
    "avatarCardId": "purple_134_matriarca_noite_eterna",
    "eloRating": 1245,
    "eloRd": 21,
    "simulatedGames": 240,
    "simulatedWins": 116,
    "simulatedLosses": 124,
    "simulatedWinRate": 0.4833
  },
  {
    "sovereignId": "sov_red_07_gigante_fogo",
    "sovereignName": "Colosso Forjador do Vulcão",
    "sovereignTitle": "Comandante Regional • Fornalhas de Escamas Eternas",
    "realmOrigin": "Infraforja Magmática de Ignaroth",
    "archetypeId": "mono_red_dragon",
    "archetypeName": "Trono Dracônico",
    "archetypeSubtitle": "Mono-Vermelho 🔥 • Voo, Sopro & Ascensão",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "red"
    ],
    "avatarCardId": "red_07_gigante_fogo",
    "eloRating": 1244,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 111,
    "simulatedLosses": 137,
    "simulatedWinRate": 0.4476
  },
  {
    "sovereignId": "sov_gold_116_centuriao_forja_dourada",
    "sovereignName": "Centurião da Forja Dourada",
    "sovereignTitle": "Capitão da Ordem • Ponte de Alabastro",
    "realmOrigin": "Corredor Boreal das Nuvens & Correntes Dracônicas",
    "archetypeId": "mono_gold_phalanx",
    "archetypeName": "Falange Impenetrável",
    "archetypeSubtitle": "Mono-Dourado 🛡️ • Guardião, Armadura & Bastião",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "gold"
    ],
    "avatarCardId": "gold_116_centuriao_forja_dourada",
    "eloRating": 1240,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 119,
    "simulatedLosses": 133,
    "simulatedWinRate": 0.4722
  },
  {
    "sovereignId": "sov_gold_63_esfinge_dourada",
    "sovereignName": "Esfinge Guardiã do Templo Dourado",
    "sovereignTitle": "Capitão da Ordem • Baluarte — Viaduto Imperial das Nuvens",
    "realmOrigin": "Corredor Boreal das Nuvens & Correntes Dracônicas",
    "archetypeId": "mono_gold_judgment",
    "archetypeName": "Julgamento Solar",
    "archetypeSubtitle": "Mono-Dourado ⚖️ • Relíquias, Escudo Global & Cura",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "gold"
    ],
    "avatarCardId": "gold_63_esfinge_dourada",
    "eloRating": 1239,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 116,
    "simulatedLosses": 128,
    "simulatedWinRate": 0.4754
  },
  {
    "sovereignId": "sov_gold_97_colosso_celestial",
    "sovereignName": "Colosso de Mármore e Ouro",
    "sovereignTitle": "Capitão da Ordem • Baluarte — Cidadela da Guarda Dourada",
    "realmOrigin": "Solária — O Leste Alto",
    "archetypeId": "dual_red_gold",
    "archetypeName": "Pacto das Escamas Imperiais",
    "archetypeSubtitle": "Pacto Duplo 🔥+☀️ • Dragões Solares & Escudo Divino",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "red",
      "gold"
    ],
    "avatarCardId": "gold_97_colosso_celestial",
    "eloRating": 1235,
    "eloRd": 21,
    "simulatedGames": 236,
    "simulatedWins": 114,
    "simulatedLosses": 122,
    "simulatedWinRate": 0.4831
  },
  {
    "sovereignId": "sov_red_44_gigante_forja",
    "sovereignName": "Titã Encouraçado da Caldeira",
    "sovereignTitle": "Capitão da Ordem • Reduto — Ponte das Correntes Rubras",
    "realmOrigin": "Infraforja Magmática de Ignaroth",
    "archetypeId": "dual_red_blue",
    "archetypeName": "Pacto do Fogo Astral",
    "archetypeSubtitle": "Pacto Duplo 🔥+❄️ • Artilharia Arcana, Voo & Tempestade",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "red",
      "blue"
    ],
    "avatarCardId": "red_44_gigante_forja",
    "eloRating": 1230,
    "eloRd": 21,
    "simulatedGames": 240,
    "simulatedWins": 121,
    "simulatedLosses": 119,
    "simulatedWinRate": 0.5042
  },
  {
    "sovereignId": "sov_gold_22_soberano_dao",
    "sovereignName": "Grão-Cã das Minas de Ouro",
    "sovereignTitle": "Capitão da Ordem • Vanguarda — Mina de Ouro Sagrado",
    "realmOrigin": "Solária — O Leste Alto",
    "archetypeId": "dual_green_gold",
    "archetypeName": "Pacto da Aurora Silvestre",
    "archetypeSubtitle": "Pacto Duplo 🌿+☀️ • Falange dos Mil Escudos & Hinos Globais",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "green",
      "gold"
    ],
    "avatarCardId": "gold_22_soberano_dao",
    "eloRating": 1229,
    "eloRd": 21,
    "simulatedGames": 236,
    "simulatedWins": 112,
    "simulatedLosses": 124,
    "simulatedWinRate": 0.4746
  },
  {
    "sovereignId": "sov_red_24_dragao_cobre",
    "sovereignName": "Draco de Cobre das Ravinas",
    "sovereignTitle": "Capitão da Ordem • Bastilha do Vapor",
    "realmOrigin": "Pyros — O Norte Vulcânico",
    "archetypeId": "dual_red_blue",
    "archetypeName": "Pacto do Fogo Astral",
    "archetypeSubtitle": "Pacto Duplo 🔥+❄️ • Artilharia Arcana, Voo & Tempestade",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "red",
      "blue"
    ],
    "avatarCardId": "red_24_dragao_cobre",
    "eloRating": 1226,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 120,
    "simulatedLosses": 124,
    "simulatedWinRate": 0.4918
  },
  {
    "sovereignId": "sov_green_156_mamute_brasa_selvagem",
    "sovereignName": "Arquidruida da Coroa de Galhada",
    "sovereignTitle": "Capitão da Ordem • Reduto — Arco do Cipó Real",
    "realmOrigin": "Veridia — O Sul Selvagem",
    "archetypeId": "mono_green_swarm",
    "archetypeName": "Enxame & Matilha Silvestre",
    "archetypeSubtitle": "Mono-Verde 🌿 • Aggro & Buff em Massa",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "green"
    ],
    "avatarCardId": "green_156_mamute_brasa_selvagem",
    "eloRating": 1226,
    "eloRd": 21,
    "simulatedGames": 240,
    "simulatedWins": 117,
    "simulatedLosses": 123,
    "simulatedWinRate": 0.4875
  },
  {
    "sovereignId": "sov_red_135_behemoth_piroclastico",
    "sovereignName": "Behemoth dos Gêiseres de Fogo",
    "sovereignTitle": "Capitão da Ordem • Vanguarda — Tumba dos Primeiros Ferreiros",
    "realmOrigin": "Infraforja Magmática de Ignaroth",
    "archetypeId": "dual_red_blue",
    "archetypeName": "Pacto do Fogo Astral",
    "archetypeSubtitle": "Pacto Duplo 🔥+❄️ • Artilharia Arcana, Voo & Tempestade",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "red",
      "blue"
    ],
    "avatarCardId": "red_135_behemoth_piroclastico",
    "eloRating": 1223,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 116,
    "simulatedLosses": 132,
    "simulatedWinRate": 0.4677
  },
  {
    "sovereignId": "sov_gold_169_pressagio_revoada_sol",
    "sovereignName": "Presságio da Revoada Solar",
    "sovereignTitle": "Capitão da Ordem • Aqueduto Imperial de Alabastro",
    "realmOrigin": "Solária — O Leste Alto",
    "archetypeId": "mono_gold_judgment",
    "archetypeName": "Julgamento Solar",
    "archetypeSubtitle": "Mono-Dourado ⚖️ • Relíquias, Escudo Global & Cura",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "gold"
    ],
    "avatarCardId": "gold_169_pressagio_revoada_sol",
    "eloRating": 1221,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 124,
    "simulatedLosses": 120,
    "simulatedWinRate": 0.5082
  },
  {
    "sovereignId": "sov_green_169_pressagio_revoada_selva",
    "sovereignName": "Presságio da Revoada Espinhosa",
    "sovereignTitle": "Capitão da Ordem • Passagem das Copas",
    "realmOrigin": "Veridia — O Sul Selvagem",
    "archetypeId": "dual_green_gold",
    "archetypeName": "Pacto da Aurora Silvestre",
    "archetypeSubtitle": "Pacto Duplo 🌿+☀️ • Falange dos Mil Escudos & Hinos Globais",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "green",
      "gold"
    ],
    "avatarCardId": "green_169_pressagio_revoada_selva",
    "eloRating": 1221,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 115,
    "simulatedLosses": 129,
    "simulatedWinRate": 0.4713
  },
  {
    "sovereignId": "sov_red_80_gigante_caldeira",
    "sovereignName": "Forjador Real de Surtur",
    "sovereignTitle": "Capitão da Ordem • Vanguarda — Bastilha do Vapor",
    "realmOrigin": "Pyros — O Norte Vulcânico",
    "archetypeId": "dual_red_purple",
    "archetypeName": "Pacto da Chama Sangrenta",
    "archetypeSubtitle": "Pacto Duplo 🔥+💀 • Blitz Sanguinária, Dreno & Último Suspiro",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "red",
      "purple"
    ],
    "avatarCardId": "red_80_gigante_caldeira",
    "eloRating": 1221,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 113,
    "simulatedLosses": 135,
    "simulatedWinRate": 0.4556
  },
  {
    "sovereignId": "sov_red_116_hidra_vulcanica",
    "sovereignName": "Hidra de Magma Vulcânica",
    "sovereignTitle": "Capitão da Ordem • Altar da Chama Primordial",
    "realmOrigin": "Pyros — O Norte Vulcânico",
    "archetypeId": "mono_red_blitz",
    "archetypeName": "Blitz Salamandra",
    "archetypeSubtitle": "Mono-Vermelho 🔥 • Ímpeto & Pele Incandescente",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "red"
    ],
    "avatarCardId": "red_116_hidra_vulcanica",
    "eloRating": 1216,
    "eloRd": 21,
    "simulatedGames": 240,
    "simulatedWins": 114,
    "simulatedLosses": 126,
    "simulatedWinRate": 0.475
  },
  {
    "sovereignId": "sov_red_63_wyvern_imperial",
    "sovereignName": "Serpe Real de Escama Rubra",
    "sovereignTitle": "Capitão da Ordem • Baluarte — Altar da Chama Primordial",
    "realmOrigin": "Pyros — O Norte Vulcânico",
    "archetypeId": "dual_red_gold",
    "archetypeName": "Pacto das Escamas Imperiais",
    "archetypeSubtitle": "Pacto Duplo 🔥+☀️ • Dragões Solares & Escudo Divino",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "red",
      "gold"
    ],
    "avatarCardId": "red_63_wyvern_imperial",
    "eloRating": 1214,
    "eloRd": 21,
    "simulatedGames": 240,
    "simulatedWins": 116,
    "simulatedLosses": 124,
    "simulatedWinRate": 0.4833
  },
  {
    "sovereignId": "sov_blue_152_arquimago_vortice",
    "sovereignName": "Hydrissa, Soberana do Redemoinho",
    "sovereignTitle": "Capitão da Ordem • Atalaia — Observatório da Geada",
    "realmOrigin": "Mar Interior das Tormentas & Estreito das Frotas",
    "archetypeId": "mono_blue_frost",
    "archetypeName": "Inverno Eterno",
    "archetypeSubtitle": "Mono-Azul ❄️ • Congelar & Estase Tática",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "blue"
    ],
    "avatarCardId": "blue_152_arquimago_vortice",
    "eloRating": 1212,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 119,
    "simulatedLosses": 125,
    "simulatedWinRate": 0.4877
  },
  {
    "sovereignId": "sov_neutral_43_guardiao_fragmento",
    "sovereignName": "Sentinela do Fragmento do Tempo",
    "sovereignTitle": "Capitão da Ordem • Reduto — Ponte Cinzenta do Pacto",
    "realmOrigin": "Fronteira Cinzenta — Centro Axial",
    "archetypeId": "dual_purple_neutral",
    "archetypeName": "Aliança da Guilda das Máscaras",
    "archetypeSubtitle": "Aliança 💀+⚙️ • Lâminas Letais, Dreno & Submundo Axial",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "purple",
      "neutral"
    ],
    "avatarCardId": "neutral_43_guardiao_fragmento",
    "eloRating": 1211,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 122,
    "simulatedLosses": 122,
    "simulatedWinRate": 0.5
  },
  {
    "sovereignId": "sov_gold_98_arconte_julgamento",
    "sovereignName": "Raziel, Arconte da Espada Flamejante",
    "sovereignTitle": "Capitão da Ordem • Colunata dos Reis Antigos",
    "realmOrigin": "Solária — O Leste Alto",
    "archetypeId": "dual_green_gold",
    "archetypeName": "Pacto da Aurora Silvestre",
    "archetypeSubtitle": "Pacto Duplo 🌿+☀️ • Falange dos Mil Escudos & Hinos Globais",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "green",
      "gold"
    ],
    "avatarCardId": "gold_98_arconte_julgamento",
    "eloRating": 1210,
    "eloRd": 21,
    "simulatedGames": 240,
    "simulatedWins": 126,
    "simulatedLosses": 114,
    "simulatedWinRate": 0.525
  },
  {
    "sovereignId": "sov_red_81_efreeti_sultao",
    "sovereignName": "Sultão da Cidadela de Bronze",
    "sovereignTitle": "Capitão da Ordem • Vanguarda — Garganta Piroclástica",
    "realmOrigin": "Pyros — O Norte Vulcânico",
    "archetypeId": "dual_red_purple",
    "archetypeName": "Pacto da Chama Sangrenta",
    "archetypeSubtitle": "Pacto Duplo 🔥+💀 • Blitz Sanguinária, Dreno & Último Suspiro",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "red",
      "purple"
    ],
    "avatarCardId": "red_81_efreeti_sultao",
    "eloRating": 1210,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 122,
    "simulatedLosses": 126,
    "simulatedWinRate": 0.4919
  },
  {
    "sovereignId": "sov_blue_169_pressagio_revoada_gelo",
    "sovereignName": "Presságio da Revoada Glacial",
    "sovereignTitle": "Capitão da Ordem • Ponte de Gelo Eterno",
    "realmOrigin": "Vórtex — Polos Setentrionais",
    "archetypeId": "dual_blue_neutral",
    "archetypeName": "Aliança do Astrolábio Arcano",
    "archetypeSubtitle": "Aliança ❄️+⚙️ • Controle Horológico, Alcance & Voo",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "blue",
      "neutral"
    ],
    "avatarCardId": "blue_169_pressagio_revoada_gelo",
    "eloRating": 1207,
    "eloRd": 21,
    "simulatedGames": 240,
    "simulatedWins": 130,
    "simulatedLosses": 110,
    "simulatedWinRate": 0.5417
  },
  {
    "sovereignId": "sov_red_45_fenix_primordial",
    "sovereignName": "Fênix da Coroa Solar",
    "sovereignTitle": "Capitão da Ordem • Reduto — Ponte de Ferro sobre o Rio de Lava",
    "realmOrigin": "Pyros — O Norte Vulcânico",
    "archetypeId": "dual_red_blue",
    "archetypeName": "Pacto do Fogo Astral",
    "archetypeSubtitle": "Pacto Duplo 🔥+❄️ • Artilharia Arcana, Voo & Tempestade",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "red",
      "blue"
    ],
    "avatarCardId": "red_45_fenix_primordial",
    "eloRating": 1203,
    "eloRd": 21,
    "simulatedGames": 236,
    "simulatedWins": 119,
    "simulatedLosses": 117,
    "simulatedWinRate": 0.5042
  },
  {
    "sovereignId": "sov_green_20_tubarao_terrestre",
    "sovereignName": "Tubarão Terrestre Couraçado",
    "sovereignTitle": "Capitão da Ordem • Vanguarda — Clareira dos Espinhos",
    "realmOrigin": "Raízes Abissais da Árvore-Mãe",
    "archetypeId": "dual_green_gold",
    "archetypeName": "Pacto da Aurora Silvestre",
    "archetypeSubtitle": "Pacto Duplo 🌿+☀️ • Falange dos Mil Escudos & Hinos Globais",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "green",
      "gold"
    ],
    "avatarCardId": "green_20_tubarao_terrestre",
    "eloRating": 1202,
    "eloRd": 21,
    "simulatedGames": 240,
    "simulatedWins": 115,
    "simulatedLosses": 125,
    "simulatedWinRate": 0.4792
  },
  {
    "sovereignId": "sov_blue_171_pactuario_elemental_gelo",
    "sovereignName": "Pactuário do Espírito Glacial",
    "sovereignTitle": "Capitão da Ordem • Reduto — Cais dos Baleeiros Polares",
    "realmOrigin": "Vórtex — Polos Setentrionais",
    "archetypeId": "mono_blue_frost",
    "archetypeName": "Inverno Eterno",
    "archetypeSubtitle": "Mono-Azul ❄️ • Congelar & Estase Tática",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "blue"
    ],
    "avatarCardId": "blue_171_pactuario_elemental_gelo",
    "eloRating": 1200,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 116,
    "simulatedLosses": 128,
    "simulatedWinRate": 0.4754
  },
  {
    "sovereignId": "sov_purple_62_beholder_morte",
    "sovereignName": "Soberano do Crânio Abissal",
    "sovereignTitle": "Capitão da Ordem • Baluarte — Forte da Névoa Negra",
    "realmOrigin": "Vale do Eclipse — Oeste Profundo",
    "archetypeId": "dual_purple_neutral",
    "archetypeName": "Aliança da Guilda das Máscaras",
    "archetypeSubtitle": "Aliança 💀+⚙️ • Lâminas Letais, Dreno & Submundo Axial",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "purple",
      "neutral"
    ],
    "avatarCardId": "purple_62_beholder_morte",
    "eloRating": 1199,
    "eloRd": 21,
    "simulatedGames": 240,
    "simulatedWins": 108,
    "simulatedLosses": 132,
    "simulatedWinRate": 0.45
  },
  {
    "sovereignId": "sov_green_21_colosso_pantano",
    "sovereignName": "Colosso de Vinhas do Pântano",
    "sovereignTitle": "Capitão da Ordem • Ponte do Musgo Antigo",
    "realmOrigin": "Raízes Abissais da Árvore-Mãe",
    "archetypeId": "mono_green_swarm",
    "archetypeName": "Enxame & Matilha Silvestre",
    "archetypeSubtitle": "Mono-Verde 🌿 • Aggro & Buff em Massa",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "green"
    ],
    "avatarCardId": "green_21_colosso_pantano",
    "eloRating": 1196,
    "eloRd": 21,
    "simulatedGames": 224,
    "simulatedWins": 119,
    "simulatedLosses": 105,
    "simulatedWinRate": 0.5313
  },
  {
    "sovereignId": "sov_green_155_ente_carvalho_anciao",
    "sovereignName": "Crocodilo-Monólito do Pântano",
    "sovereignTitle": "Capitão da Ordem • Clareira dos Espinhos",
    "realmOrigin": "Raízes Abissais da Árvore-Mãe",
    "archetypeId": "mono_green_roots",
    "archetypeName": "Raízes Eternas",
    "archetypeSubtitle": "Mono-Verde 🌿 • Guardião & Regeneração",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "green"
    ],
    "avatarCardId": "green_155_ente_carvalho_anciao",
    "eloRating": 1193,
    "eloRd": 21,
    "simulatedGames": 236,
    "simulatedWins": 121,
    "simulatedLosses": 115,
    "simulatedWinRate": 0.5127
  },
  {
    "sovereignId": "sov_green_99_guardiao_sequoia",
    "sovereignName": "Ancião da Sequoia Milenar",
    "sovereignTitle": "Capitão da Ordem • Arco do Cipó Real",
    "realmOrigin": "Veridia — O Sul Selvagem",
    "archetypeId": "dual_green_neutral",
    "archetypeName": "Aliança dos Engenhos Silvestres",
    "archetypeSubtitle": "Aliança 🌿+⚙️ • Colossos de Madeira-Ferro & Guildas Axiais",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "green",
      "neutral"
    ],
    "avatarCardId": "green_99_guardiao_sequoia",
    "eloRating": 1191,
    "eloRd": 21,
    "simulatedGames": 236,
    "simulatedWins": 120,
    "simulatedLosses": 116,
    "simulatedWinRate": 0.5085
  },
  {
    "sovereignId": "sov_purple_19_conde_vampiro",
    "sovereignName": "Nosferatu, Soberano Carmesim",
    "sovereignTitle": "Capitão da Ordem • Forte da Névoa Negra",
    "realmOrigin": "Fossa Submersa da Catedral Afogada",
    "archetypeId": "dual_purple_neutral",
    "archetypeName": "Aliança da Guilda das Máscaras",
    "archetypeSubtitle": "Aliança 💀+⚙️ • Lâminas Letais, Dreno & Submundo Axial",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "purple",
      "neutral"
    ],
    "avatarCardId": "purple_19_conde_vampiro",
    "eloRating": 1189,
    "eloRd": 21,
    "simulatedGames": 236,
    "simulatedWins": 119,
    "simulatedLosses": 117,
    "simulatedWinRate": 0.5042
  },
  {
    "sovereignId": "sov_gold_62_gigante_pedra_rei",
    "sovereignName": "Thane das Colunas de Mármore",
    "sovereignTitle": "Capitão da Ordem • Atalaia — Aqueduto Imperial de Alabastro",
    "realmOrigin": "Solária — O Leste Alto",
    "archetypeId": "mono_gold_celestial",
    "archetypeName": "Legião Celeste",
    "archetypeSubtitle": "Mono-Dourado ☀️ • Escudo Divino, Voo & Ascensão",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "gold"
    ],
    "avatarCardId": "gold_62_gigante_pedra_rei",
    "eloRating": 1187,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 112,
    "simulatedLosses": 136,
    "simulatedWinRate": 0.4516
  },
  {
    "sovereignId": "sov_blue_62_principe_ar",
    "sovereignName": "Yan-Vael, Senhor do Furacão",
    "sovereignTitle": "Capitão da Ordem • Baluarte — Vila Boreal dos Relojoeiros",
    "realmOrigin": "Vórtex — Polos Setentrionais",
    "archetypeId": "mono_blue_abyssal",
    "archetypeName": "Frota Abissal",
    "archetypeSubtitle": "Mono-Azul 🌊 • Voo, Alcance & Leviatãs",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "blue"
    ],
    "avatarCardId": "blue_62_principe_ar",
    "eloRating": 1185,
    "eloRd": 21,
    "simulatedGames": 240,
    "simulatedWins": 111,
    "simulatedLosses": 129,
    "simulatedWinRate": 0.4625
  },
  {
    "sovereignId": "sov_purple_06_tirano_ocular",
    "sovereignName": "Serafim dos Anéis Abissais",
    "sovereignTitle": "Capitão da Ordem • Cripta dos Juramentos",
    "realmOrigin": "Vale do Eclipse — Oeste Profundo",
    "archetypeId": "mono_purple_crypt",
    "archetypeName": "Guardiões da Cripta",
    "archetypeSubtitle": "Mono-Roxo 💀 • Renascer & Reanimação",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "avatarCardId": "purple_06_tirano_ocular",
    "eloRating": 1184,
    "eloRd": 21,
    "simulatedGames": 236,
    "simulatedWins": 124,
    "simulatedLosses": 112,
    "simulatedWinRate": 0.5254
  },
  {
    "sovereignId": "sov_blue_21_executor_glacial",
    "sovereignName": "Arconte da Geada Inflexível",
    "sovereignTitle": "Capitão da Ordem • Reduto — Forte do Estreito Polar",
    "realmOrigin": "Mar Interior das Tormentas & Estreito das Frotas",
    "archetypeId": "dual_blue_gold",
    "archetypeName": "Pacto da Forja do Zênite",
    "archetypeSubtitle": "Pacto Duplo ❄️+☀️ • Cidadela Cronomante & Escudo Celeste",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "blue",
      "gold"
    ],
    "avatarCardId": "blue_21_executor_glacial",
    "eloRating": 1183,
    "eloRd": 22,
    "simulatedGames": 232,
    "simulatedWins": 113,
    "simulatedLosses": 119,
    "simulatedWinRate": 0.4871
  },
  {
    "sovereignId": "sov_green_64_mamute_guerra",
    "sovereignName": "Mamute Lanoso de Batalha",
    "sovereignTitle": "Capitão da Ordem • Atalaia — Passagem das Copas",
    "realmOrigin": "Veridia — O Sul Selvagem",
    "archetypeId": "mono_green_roots",
    "archetypeName": "Raízes Eternas",
    "archetypeSubtitle": "Mono-Verde 🌿 • Guardião & Regeneração",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "green"
    ],
    "avatarCardId": "green_64_mamute_guerra",
    "eloRating": 1179,
    "eloRd": 21,
    "simulatedGames": 228,
    "simulatedWins": 114,
    "simulatedLosses": 114,
    "simulatedWinRate": 0.5
  },
  {
    "sovereignId": "sov_green_65_catoblepas_pantano",
    "sovereignName": "Fera-Peste do Brejo Negro",
    "sovereignTitle": "Capitão da Ordem • Santuário dos Druidas",
    "realmOrigin": "Veridia — O Sul Selvagem",
    "archetypeId": "mono_green_swarm",
    "archetypeName": "Enxame & Matilha Silvestre",
    "archetypeSubtitle": "Mono-Verde 🌿 • Aggro & Buff em Massa",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "green"
    ],
    "avatarCardId": "green_65_catoblepas_pantano",
    "eloRating": 1179,
    "eloRd": 21,
    "simulatedGames": 240,
    "simulatedWins": 118,
    "simulatedLosses": 122,
    "simulatedWinRate": 0.4917
  },
  {
    "sovereignId": "sov_green_32_gorila_alfa",
    "sovereignName": "Kongor, Rei de Costas Prateadas",
    "sovereignTitle": "Capitão da Ordem • Terraço da Seiva Dourada",
    "realmOrigin": "Veridia — O Sul Selvagem",
    "archetypeId": "mono_green_swarm",
    "archetypeName": "Enxame & Matilha Silvestre",
    "archetypeSubtitle": "Mono-Verde 🌿 • Aggro & Buff em Massa",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "green"
    ],
    "avatarCardId": "green_32_gorila_alfa",
    "eloRating": 1172,
    "eloRd": 21,
    "simulatedGames": 224,
    "simulatedWins": 114,
    "simulatedLosses": 110,
    "simulatedWinRate": 0.5089
  },
  {
    "sovereignId": "sov_blue_79_semblante_atemporal",
    "sovereignName": "Miragem do Relógio Astral",
    "sovereignTitle": "Capitão da Ordem • Cais dos Baleeiros Polares",
    "realmOrigin": "Vórtex — Polos Setentrionais",
    "archetypeId": "mono_blue_abyssal",
    "archetypeName": "Frota Abissal",
    "archetypeSubtitle": "Mono-Azul 🌊 • Voo, Alcance & Leviatãs",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "blue"
    ],
    "avatarCardId": "blue_79_semblante_atemporal",
    "eloRating": 1168,
    "eloRd": 21,
    "simulatedGames": 240,
    "simulatedWins": 113,
    "simulatedLosses": 127,
    "simulatedWinRate": 0.4708
  },
  {
    "sovereignId": "sov_blue_25_roca",
    "sovereignName": "Roca das Nuvens Trovejantes",
    "sovereignTitle": "Capitão da Ordem • Estreito das Estrelas Mortas",
    "realmOrigin": "Vórtex — Polos Setentrionais",
    "archetypeId": "dual_blue_purple",
    "archetypeName": "Pacto da Tormenta Abissal",
    "archetypeSubtitle": "Pacto Duplo ❄️+💀 • Estase Glacial & Execução Umbral",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "blue",
      "purple"
    ],
    "avatarCardId": "blue_25_roca",
    "eloRating": 1166,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 103,
    "simulatedLosses": 141,
    "simulatedWinRate": 0.4221
  },
  {
    "sovereignId": "sov_neutral_114_emissario_conselho_aguas",
    "sovereignName": "Emissário Real do Conselho",
    "sovereignTitle": "Capitão da Ordem • Ponte Cinzenta do Pacto",
    "realmOrigin": "Fronteira Cinzenta — Centro Axial",
    "archetypeId": "mono_neutral_axial",
    "archetypeName": "Legião Axial Autômata",
    "archetypeSubtitle": "Mono-Neutro ⚙️ • Constructos, Relíquias & Matriz Horológica",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "neutral"
    ],
    "avatarCardId": "neutral_114_emissario_conselho_aguas",
    "eloRating": 1160,
    "eloRd": 22,
    "simulatedGames": 228,
    "simulatedWins": 120,
    "simulatedLosses": 108,
    "simulatedWinRate": 0.5263
  },
  {
    "sovereignId": "sov_neutral_103_lamina_cantante_cinza",
    "sovereignName": "Mestre da Lâmina Cantante",
    "sovereignTitle": "Capitão da Ordem • Baluarte — Vigia do Prisma",
    "realmOrigin": "Fronteira Cinzenta — Centro Axial",
    "archetypeId": "dual_blue_neutral",
    "archetypeName": "Aliança do Astrolábio Arcano",
    "archetypeSubtitle": "Aliança ❄️+⚙️ • Controle Horológico, Alcance & Voo",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "blue",
      "neutral"
    ],
    "avatarCardId": "neutral_103_lamina_cantante_cinza",
    "eloRating": 1152,
    "eloRd": 21,
    "simulatedGames": 236,
    "simulatedWins": 108,
    "simulatedLosses": 128,
    "simulatedWinRate": 0.4576
  },
  {
    "sovereignId": "sov_blue_04_behir",
    "sovereignName": "Serpe Trovejante de Doze Patas",
    "sovereignTitle": "Capitão da Ordem • Forte do Estreito Polar",
    "realmOrigin": "Mar Interior das Tormentas & Estreito das Frotas",
    "archetypeId": "dual_blue_neutral",
    "archetypeName": "Aliança do Astrolábio Arcano",
    "archetypeSubtitle": "Aliança ❄️+⚙️ • Controle Horológico, Alcance & Voo",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "blue",
      "neutral"
    ],
    "avatarCardId": "blue_04_behir",
    "eloRating": 1146,
    "eloRd": 21,
    "simulatedGames": 236,
    "simulatedWins": 110,
    "simulatedLosses": 126,
    "simulatedWinRate": 0.4661
  },
  {
    "sovereignId": "sov_red_136_arquidemonio_brasas",
    "sovereignName": "Arquidemônio das Correntes Solares",
    "sovereignTitle": "Capitão da Ordem • Baluarte — Garganta Piroclástica",
    "realmOrigin": "Infraforja Magmática de Ignaroth",
    "archetypeId": "dual_red_blue",
    "archetypeName": "Pacto do Fogo Astral",
    "archetypeSubtitle": "Pacto Duplo 🔥+❄️ • Artilharia Arcana, Voo & Tempestade",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "red",
      "blue"
    ],
    "avatarCardId": "red_136_arquidemonio_brasas",
    "eloRating": 1145,
    "eloRd": 21,
    "simulatedGames": 232,
    "simulatedWins": 112,
    "simulatedLosses": 120,
    "simulatedWinRate": 0.4828
  },
  {
    "sovereignId": "sov_green_117_mamute_esmeralda",
    "sovereignName": "Mamute de Presas Esmeralda",
    "sovereignTitle": "Capitão da Ordem • Delta dos Rios de Jade",
    "realmOrigin": "Veridia — O Sul Selvagem",
    "archetypeId": "dual_blue_green",
    "archetypeName": "Pacto da Evolução Quimérica",
    "archetypeSubtitle": "Pacto Duplo ❄️+🌿 • Rampa Arcana, Compra & Leviatãs",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "blue",
      "green"
    ],
    "avatarCardId": "green_117_mamute_esmeralda",
    "eloRating": 1137,
    "eloRd": 21,
    "simulatedGames": 240,
    "simulatedWins": 103,
    "simulatedLosses": 137,
    "simulatedWinRate": 0.4292
  },
  {
    "sovereignId": "sov_blue_133_serpente_fenda_marinha",
    "sovereignName": "Serpente da Fossa Abissal",
    "sovereignTitle": "Capitão da Ordem • Vila Boreal dos Relojoeiros",
    "realmOrigin": "Vórtex — Polos Setentrionais",
    "archetypeId": "mono_blue_chrono",
    "archetypeName": "Conclave Cronomante",
    "archetypeSubtitle": "Mono-Azul ⚡ • Compra, Reações & Feitiços",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "blue"
    ],
    "avatarCardId": "blue_133_serpente_fenda_marinha",
    "eloRating": 1134,
    "eloRd": 21,
    "simulatedGames": 228,
    "simulatedWins": 108,
    "simulatedLosses": 120,
    "simulatedWinRate": 0.4737
  },
  {
    "sovereignId": "sov_purple_154_cavaleiro_morte_eterna",
    "sovereignName": "Behemoth Ossário das Catacumbas",
    "sovereignTitle": "Capitão da Ordem • Capela das Sombras",
    "realmOrigin": "Fossa Submersa da Catedral Afogada",
    "archetypeId": "mono_purple_umbral",
    "archetypeName": "Inquisição Umbral",
    "archetypeSubtitle": "Mono-Roxo 🌑 • Destruição, Debuff & Controle",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "avatarCardId": "purple_154_cavaleiro_morte_eterna",
    "eloRating": 1133,
    "eloRd": 21,
    "simulatedGames": 232,
    "simulatedWins": 114,
    "simulatedLosses": 118,
    "simulatedWinRate": 0.4914
  },
  {
    "sovereignId": "sov_neutral_34_cavaleiro_planar",
    "sovereignName": "Cavaleiro do Horizonte Estelar",
    "sovereignTitle": "Capitão da Ordem • Vigia do Prisma",
    "realmOrigin": "Fronteira Cinzenta — Centro Axial",
    "archetypeId": "mono_neutral_axial",
    "archetypeName": "Legião Axial Autômata",
    "archetypeSubtitle": "Mono-Neutro ⚙️ • Constructos, Relíquias & Matriz Horológica",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "neutral"
    ],
    "avatarCardId": "neutral_34_cavaleiro_planar",
    "eloRating": 1129,
    "eloRd": 22,
    "simulatedGames": 224,
    "simulatedWins": 114,
    "simulatedLosses": 110,
    "simulatedWinRate": 0.5089
  },
  {
    "sovereignId": "sov_green_22_wyvern",
    "sovereignName": "Serpe Wyvern do Ferrão",
    "sovereignTitle": "Capitão da Ordem • Vanguarda — Santuário dos Druidas",
    "realmOrigin": "Veridia — O Sul Selvagem",
    "archetypeId": "mono_green_roots",
    "archetypeName": "Raízes Eternas",
    "archetypeSubtitle": "Mono-Verde 🌿 • Guardião & Regeneração",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "green"
    ],
    "avatarCardId": "green_22_wyvern",
    "eloRating": 1128,
    "eloRd": 21,
    "simulatedGames": 236,
    "simulatedWins": 121,
    "simulatedLosses": 115,
    "simulatedWinRate": 0.5127
  },
  {
    "sovereignId": "sov_green_137_lorde_treant_espinhos",
    "sovereignName": "Lorde Treant de Pau-Ferro",
    "sovereignTitle": "Capitão da Ordem • Baluarte — Ponte do Musgo Antigo",
    "realmOrigin": "Raízes Abissais da Árvore-Mãe",
    "archetypeId": "mono_green_roots",
    "archetypeName": "Raízes Eternas",
    "archetypeSubtitle": "Mono-Verde 🌿 • Guardião & Regeneração",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "green"
    ],
    "avatarCardId": "green_137_lorde_treant_espinhos",
    "eloRating": 1127,
    "eloRd": 21,
    "simulatedGames": 232,
    "simulatedWins": 109,
    "simulatedLosses": 123,
    "simulatedWinRate": 0.4698
  },
  {
    "sovereignId": "sov_green_46_ent_anciao",
    "sovereignName": "Carvalho-Mestre de Mil Invernos",
    "sovereignTitle": "Capitão da Ordem • Guarita das Raízes Vivas",
    "realmOrigin": "Raízes Abissais da Árvore-Mãe",
    "archetypeId": "mono_green_roots",
    "archetypeName": "Raízes Eternas",
    "archetypeSubtitle": "Mono-Verde 🌿 • Guardião & Regeneração",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "green"
    ],
    "avatarCardId": "green_46_ent_anciao",
    "eloRating": 1119,
    "eloRd": 22,
    "simulatedGames": 216,
    "simulatedWins": 105,
    "simulatedLosses": 111,
    "simulatedWinRate": 0.4861
  },
  {
    "sovereignId": "sov_blue_43_arconte_tempestade",
    "sovereignName": "Arconte do Relâmpago Vivo",
    "sovereignTitle": "Capitão da Ordem • Observatório da Geada",
    "realmOrigin": "Mar Interior das Tormentas & Estreito das Frotas",
    "archetypeId": "mono_blue_chrono",
    "archetypeName": "Conclave Cronomante",
    "archetypeSubtitle": "Mono-Azul ⚡ • Compra, Reações & Feitiços",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "blue"
    ],
    "avatarCardId": "blue_43_arconte_tempestade",
    "eloRating": 1118,
    "eloRd": 22,
    "simulatedGames": 224,
    "simulatedWins": 116,
    "simulatedLosses": 108,
    "simulatedWinRate": 0.5179
  },
  {
    "sovereignId": "sov_green_47_roc_tempestade",
    "sovereignName": "Ave Roc das Cumeadas",
    "sovereignTitle": "Capitão da Ordem • Baluarte — Forte de Pau-Ferro",
    "realmOrigin": "Veridia — O Sul Selvagem",
    "archetypeId": "dual_blue_green",
    "archetypeName": "Pacto da Evolução Quimérica",
    "archetypeSubtitle": "Pacto Duplo ❄️+🌿 • Rampa Arcana, Compra & Leviatãs",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "blue",
      "green"
    ],
    "avatarCardId": "green_47_roc_tempestade",
    "eloRating": 1116,
    "eloRd": 21,
    "simulatedGames": 232,
    "simulatedWins": 102,
    "simulatedLosses": 130,
    "simulatedWinRate": 0.4397
  },
  {
    "sovereignId": "sov_green_100_quimera_selvagem",
    "sovereignName": "Quimera Alfa de Três Presas",
    "sovereignTitle": "Capitão da Ordem • Vanguarda — Delta dos Rios de Jade",
    "realmOrigin": "Veridia — O Sul Selvagem",
    "archetypeId": "mono_green_roots",
    "archetypeName": "Raízes Eternas",
    "archetypeSubtitle": "Mono-Verde 🌿 • Guardião & Regeneração",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "green"
    ],
    "avatarCardId": "green_100_quimera_selvagem",
    "eloRating": 1115,
    "eloRd": 22,
    "simulatedGames": 220,
    "simulatedWins": 107,
    "simulatedLosses": 113,
    "simulatedWinRate": 0.4864
  },
  {
    "sovereignId": "sov_neutral_168_tecelao_feixe_matriz",
    "sovereignName": "Tecelão do Feixe Primordial",
    "sovereignTitle": "Capitão da Ordem • Estalagem das Caravanas",
    "realmOrigin": "Fronteira Cinzenta — Centro Axial",
    "archetypeId": "mono_neutral_axial",
    "archetypeName": "Legião Axial Autômata",
    "archetypeSubtitle": "Mono-Neutro ⚙️ • Constructos, Relíquias & Matriz Horológica",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "neutral"
    ],
    "avatarCardId": "neutral_168_tecelao_feixe_matriz",
    "eloRating": 1113,
    "eloRd": 22,
    "simulatedGames": 228,
    "simulatedWins": 112,
    "simulatedLosses": 116,
    "simulatedWinRate": 0.4912
  },
  {
    "sovereignId": "sov_purple_45_dragao_sombras",
    "sovereignName": "Nyxarion, o Dragão do Eclipse",
    "sovereignTitle": "Capitão da Ordem • Ponte do Ossário",
    "realmOrigin": "Fossa Submersa da Catedral Afogada",
    "archetypeId": "mono_purple_crypt",
    "archetypeName": "Guardiões da Cripta",
    "archetypeSubtitle": "Mono-Roxo 💀 • Renascer & Reanimação",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "avatarCardId": "purple_45_dragao_sombras",
    "eloRating": 1113,
    "eloRd": 22,
    "simulatedGames": 224,
    "simulatedWins": 110,
    "simulatedLosses": 114,
    "simulatedWinRate": 0.4911
  },
  {
    "sovereignId": "sov_blue_115_oraculo_mar_profundo",
    "sovereignName": "Oráculo das Fossas Marinhas",
    "sovereignTitle": "Capitão da Ordem • Vanguarda — Estreito das Estrelas Mortas",
    "realmOrigin": "Vórtex — Polos Setentrionais",
    "archetypeId": "dual_blue_green",
    "archetypeName": "Pacto da Evolução Quimérica",
    "archetypeSubtitle": "Pacto Duplo ❄️+🌿 • Rampa Arcana, Compra & Leviatãs",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "blue",
      "green"
    ],
    "avatarCardId": "blue_115_oraculo_mar_profundo",
    "eloRating": 1113,
    "eloRd": 21,
    "simulatedGames": 232,
    "simulatedWins": 104,
    "simulatedLosses": 128,
    "simulatedWinRate": 0.4483
  },
  {
    "sovereignId": "sov_purple_24_dragao_sombras",
    "sovereignName": "Nocturnus, Dragão do Eclipse",
    "sovereignTitle": "Capitão da Ordem • Vanguarda — Ponte do Ossário",
    "realmOrigin": "Fossa Submersa da Catedral Afogada",
    "archetypeId": "mono_purple_umbral",
    "archetypeName": "Inquisição Umbral",
    "archetypeSubtitle": "Mono-Roxo 🌑 • Destruição, Debuff & Controle",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "avatarCardId": "purple_24_dragao_sombras",
    "eloRating": 1105,
    "eloRd": 22,
    "simulatedGames": 224,
    "simulatedWins": 104,
    "simulatedLosses": 120,
    "simulatedWinRate": 0.4643
  },
  {
    "sovereignId": "sov_purple_169_pressagio_revoada_abismo",
    "sovereignName": "Presságio da Revoada Umbral",
    "sovereignTitle": "Capitão da Ordem • Garganta do Crepúsculo",
    "realmOrigin": "Vale do Eclipse — Oeste Profundo",
    "archetypeId": "mono_purple_blood",
    "archetypeName": "Tributo Vital",
    "archetypeSubtitle": "Mono-Roxo ⚡ • Dreno de Vida & Toque Letal",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "avatarCardId": "purple_169_pressagio_revoada_abismo",
    "eloRating": 1101,
    "eloRd": 21,
    "simulatedGames": 236,
    "simulatedWins": 99,
    "simulatedLosses": 137,
    "simulatedWinRate": 0.4195
  },
  {
    "sovereignId": "sov_purple_116_devorador_mentes",
    "sovereignName": "Soberano da Coroa Psiônica",
    "sovereignTitle": "Capitão da Ordem • Forte da Névoa Negra",
    "realmOrigin": "Vale do Eclipse — Oeste Profundo",
    "archetypeId": "mono_purple_umbral",
    "archetypeName": "Inquisição Umbral",
    "archetypeSubtitle": "Mono-Roxo 🌑 • Destruição, Debuff & Controle",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "avatarCardId": "purple_116_devorador_mentes",
    "eloRating": 1086,
    "eloRd": 22,
    "simulatedGames": 224,
    "simulatedWins": 101,
    "simulatedLosses": 123,
    "simulatedWinRate": 0.4509
  },
  {
    "sovereignId": "sov_blue_20_remorhaz",
    "sovereignName": "Centopeia Térmica da Geleira",
    "sovereignTitle": "Capitão da Ordem • Atalaia — Ponte de Gelo Eterno",
    "realmOrigin": "Vórtex — Polos Setentrionais",
    "archetypeId": "mono_blue_chrono",
    "archetypeName": "Conclave Cronomante",
    "archetypeSubtitle": "Mono-Azul ⚡ • Compra, Reações & Feitiços",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "blue"
    ],
    "avatarCardId": "blue_20_remorhaz",
    "eloRating": 1068,
    "eloRd": 22,
    "simulatedGames": 216,
    "simulatedWins": 101,
    "simulatedLosses": 115,
    "simulatedWinRate": 0.4676
  },
  {
    "sovereignId": "sov_blue_134_arquimago_singularidade",
    "sovereignName": "Arquimago da Singularidade",
    "sovereignTitle": "Capitão da Ordem • Baluarte — Ponte de Gelo Astral",
    "realmOrigin": "Mar Interior das Tormentas & Estreito das Frotas",
    "archetypeId": "mono_blue_chrono",
    "archetypeName": "Conclave Cronomante",
    "archetypeSubtitle": "Mono-Azul ⚡ • Compra, Reações & Feitiços",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "blue"
    ],
    "avatarCardId": "blue_134_arquimago_singularidade",
    "eloRating": 1066,
    "eloRd": 22,
    "simulatedGames": 220,
    "simulatedWins": 94,
    "simulatedLosses": 126,
    "simulatedWinRate": 0.4273
  },
  {
    "sovereignId": "sov_red_98_colosso_escoria",
    "sovereignName": "Colosso de Escória e Brasa",
    "sovereignTitle": "Capitão da Ordem • Atalaia — Bastião de Basalto",
    "realmOrigin": "Pyros — O Norte Vulcânico",
    "archetypeId": "mono_red_dragon",
    "archetypeName": "Trono Dracônico",
    "archetypeSubtitle": "Mono-Vermelho 🔥 • Voo, Sopro & Ascensão",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "red"
    ],
    "avatarCardId": "red_98_colosso_escoria",
    "eloRating": 1059,
    "eloRd": 22,
    "simulatedGames": 216,
    "simulatedWins": 101,
    "simulatedLosses": 115,
    "simulatedWinRate": 0.4676
  },
  {
    "sovereignId": "sov_red_154_juggernaut_escoria",
    "sovereignName": "Sultão das Lâminas de Brasa",
    "sovereignTitle": "Capitão da Ordem • Garganta Piroclástica",
    "realmOrigin": "Infraforja Magmática de Ignaroth",
    "archetypeId": "mono_red_pyroclasm",
    "archetypeName": "Artilharia Piroclástica",
    "archetypeSubtitle": "Mono-Vermelho 🔥 • Queima Direta & Cataclismos",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "red"
    ],
    "avatarCardId": "red_154_juggernaut_escoria",
    "eloRating": 1052,
    "eloRd": 23,
    "simulatedGames": 208,
    "simulatedWins": 96,
    "simulatedLosses": 112,
    "simulatedWinRate": 0.4615
  },
  {
    "sovereignId": "sov_purple_118_serafim_caido",
    "sovereignName": "Serafim Caído do Vazio",
    "sovereignTitle": "Capitão da Ordem • Reduto — Capela das Sombras",
    "realmOrigin": "Fossa Submersa da Catedral Afogada",
    "archetypeId": "mono_purple_blood",
    "archetypeName": "Tributo Vital",
    "archetypeSubtitle": "Mono-Roxo ⚡ • Dreno de Vida & Toque Letal",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "avatarCardId": "purple_118_serafim_caido",
    "eloRating": 1044,
    "eloRd": 22,
    "simulatedGames": 220,
    "simulatedWins": 100,
    "simulatedLosses": 120,
    "simulatedWinRate": 0.4545
  },
  {
    "sovereignId": "sov_red_134_senhor_guerra_rubro",
    "sovereignName": "General Senhor da Guerra Rubro",
    "sovereignTitle": "Capitão da Ordem • Garganta Piroclástica",
    "realmOrigin": "Pyros — O Norte Vulcânico",
    "archetypeId": "mono_red_pyroclasm",
    "archetypeName": "Artilharia Piroclástica",
    "archetypeSubtitle": "Mono-Vermelho 🔥 • Queima Direta & Cataclismos",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "red"
    ],
    "avatarCardId": "red_134_senhor_guerra_rubro",
    "eloRating": 1040,
    "eloRd": 22,
    "simulatedGames": 212,
    "simulatedWins": 96,
    "simulatedLosses": 116,
    "simulatedWinRate": 0.4528
  },
  {
    "sovereignId": "sov_gold_133_mestre_forja_imperial",
    "sovereignName": "Mestre-Ferreiro da Forja Imperial",
    "sovereignTitle": "Sentinela de Fronteira • Vila dos Aquedutos",
    "realmOrigin": "Solária — O Leste Alto",
    "archetypeId": "mono_gold_phalanx",
    "archetypeName": "Falange Impenetrável",
    "archetypeSubtitle": "Mono-Dourado 🛡️ • Guardião, Armadura & Bastião",
    "skillTier": 1,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "gold"
    ],
    "avatarCardId": "gold_133_mestre_forja_imperial",
    "eloRating": 1013,
    "eloRd": 23,
    "simulatedGames": 212,
    "simulatedWins": 93,
    "simulatedLosses": 119,
    "simulatedWinRate": 0.4387
  },
  {
    "sovereignId": "sov_gold_168_tecelao_feixe_sol",
    "sovereignName": "Tecelão do Feixe Solar",
    "sovereignTitle": "Sentinela de Fronteira • Baluarte — Vila dos Aquedutos",
    "realmOrigin": "Solária — O Leste Alto",
    "archetypeId": "mono_gold_judgment",
    "archetypeName": "Julgamento Solar",
    "archetypeSubtitle": "Mono-Dourado ⚖️ • Relíquias, Escudo Global & Cura",
    "skillTier": 1,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "gold"
    ],
    "avatarCardId": "gold_168_tecelao_feixe_sol",
    "eloRating": 997,
    "eloRd": 22,
    "simulatedGames": 212,
    "simulatedWins": 98,
    "simulatedLosses": 114,
    "simulatedWinRate": 0.4623
  },
  {
    "sovereignId": "sov_gold_80_paladino_destino",
    "sovereignName": "Justicar da Aurora Eterna",
    "sovereignTitle": "Sentinela de Fronteira • Atalaia da Garganta Dourada",
    "realmOrigin": "Solária — O Leste Alto",
    "archetypeId": "mono_gold_celestial",
    "archetypeName": "Legião Celeste",
    "archetypeSubtitle": "Mono-Dourado ☀️ • Escudo Divino, Voo & Ascensão",
    "skillTier": 1,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "gold"
    ],
    "avatarCardId": "gold_80_paladino_destino",
    "eloRating": 989,
    "eloRd": 23,
    "simulatedGames": 208,
    "simulatedWins": 84,
    "simulatedLosses": 124,
    "simulatedWinRate": 0.4038
  },
  {
    "sovereignId": "sov_gold_171_pactuario_elemental_sol",
    "sovereignName": "Pactuário do Espírito Solar",
    "sovereignTitle": "Sentinela de Fronteira • Atalaia — Atalaia da Garganta Dourada",
    "realmOrigin": "Solária — O Leste Alto",
    "archetypeId": "mono_gold_phalanx",
    "archetypeName": "Falange Impenetrável",
    "archetypeSubtitle": "Mono-Dourado 🛡️ • Guardião, Armadura & Bastião",
    "skillTier": 1,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "gold"
    ],
    "avatarCardId": "gold_171_pactuario_elemental_sol",
    "eloRating": 979,
    "eloRd": 23,
    "simulatedGames": 204,
    "simulatedWins": 84,
    "simulatedLosses": 120,
    "simulatedWinRate": 0.4118
  },
  {
    "sovereignId": "sov_purple_133_ceifador_tumular",
    "sovereignName": "Ceifador Executor Tumular",
    "sovereignTitle": "Sentinela de Fronteira • Altar do Miasma",
    "realmOrigin": "Vale do Eclipse — Oeste Profundo",
    "archetypeId": "mono_purple_crypt",
    "archetypeName": "Guardiões da Cripta",
    "archetypeSubtitle": "Mono-Roxo 💀 • Renascer & Reanimação",
    "skillTier": 1,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "avatarCardId": "purple_133_ceifador_tumular",
    "eloRating": 942,
    "eloRd": 23,
    "simulatedGames": 196,
    "simulatedWins": 85,
    "simulatedLosses": 111,
    "simulatedWinRate": 0.4337
  },
  {
    "sovereignId": "sov_green_82_estegossauro_anciao",
    "sovereignName": "Estegossauro de Placas Esmeralda",
    "sovereignTitle": "Capitão da Ordem • Forte de Pau-Ferro",
    "realmOrigin": "Veridia — O Sul Selvagem",
    "archetypeId": "mono_green_colossus",
    "archetypeName": "Colossos Primordiais",
    "archetypeSubtitle": "Mono-Verde 🌿 • Ramp & Atropelar",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "green"
    ],
    "avatarCardId": "green_82_estegossauro_anciao",
    "eloRating": 931,
    "eloRd": 23,
    "simulatedGames": 208,
    "simulatedWins": 87,
    "simulatedLosses": 121,
    "simulatedWinRate": 0.4183
  },
  {
    "sovereignId": "sov_green_136_rinoceronte_monolito",
    "sovereignName": "Rinoceronte Chifre-de-Monólito",
    "sovereignTitle": "Sentinela de Fronteira • Atalaia — Clareira dos Espinhos",
    "realmOrigin": "Veridia — O Sul Selvagem",
    "archetypeId": "mono_green_swarm",
    "archetypeName": "Enxame & Matilha Silvestre",
    "archetypeSubtitle": "Mono-Verde 🌿 • Aggro & Buff em Massa",
    "skillTier": 1,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "green"
    ],
    "avatarCardId": "green_136_rinoceronte_monolito",
    "eloRating": 931,
    "eloRd": 23,
    "simulatedGames": 196,
    "simulatedWins": 77,
    "simulatedLosses": 119,
    "simulatedWinRate": 0.3929
  },
  {
    "sovereignId": "sov_blue_168_tecelao_feixe_gelo",
    "sovereignName": "Tecelão do Feixe Astral",
    "sovereignTitle": "Sentinela de Fronteira • Ponte de Gelo Astral",
    "realmOrigin": "Vórtex — Polos Setentrionais",
    "archetypeId": "mono_blue_frost",
    "archetypeName": "Inverno Eterno",
    "archetypeSubtitle": "Mono-Azul ❄️ • Congelar & Estase Tática",
    "skillTier": 1,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "blue"
    ],
    "avatarCardId": "blue_168_tecelao_feixe_gelo",
    "eloRating": 923,
    "eloRd": 23,
    "simulatedGames": 204,
    "simulatedWins": 83,
    "simulatedLosses": 121,
    "simulatedWinRate": 0.4069
  },
  {
    "sovereignId": "sov_green_07_troll",
    "sovereignName": "Troll Regenerador do Pântano",
    "sovereignTitle": "Sentinela de Fronteira • Clareira dos Espinhos",
    "realmOrigin": "Veridia — O Sul Selvagem",
    "archetypeId": "mono_green_roots",
    "archetypeName": "Raízes Eternas",
    "archetypeSubtitle": "Mono-Verde 🌿 • Guardião & Regeneração",
    "skillTier": 1,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "green"
    ],
    "avatarCardId": "green_07_troll",
    "eloRating": 919,
    "eloRd": 23,
    "simulatedGames": 196,
    "simulatedWins": 76,
    "simulatedLosses": 120,
    "simulatedWinRate": 0.3878
  },
  {
    "sovereignId": "sov_red_168_tecelao_feixe_chama",
    "sovereignName": "Tecelão do Feixe Ígneo",
    "sovereignTitle": "Sentinela de Fronteira • Ponte das Correntes Rubras",
    "realmOrigin": "Pyros — O Norte Vulcânico",
    "archetypeId": "mono_red_blitz",
    "archetypeName": "Blitz Salamandra",
    "archetypeSubtitle": "Mono-Vermelho 🔥 • Ímpeto & Pele Incandescente",
    "skillTier": 1,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "red"
    ],
    "avatarCardId": "red_168_tecelao_feixe_chama",
    "eloRating": 918,
    "eloRd": 24,
    "simulatedGames": 188,
    "simulatedWins": 73,
    "simulatedLosses": 115,
    "simulatedWinRate": 0.3883
  },
  {
    "sovereignId": "sov_green_171_pactuario_elemental_selva",
    "sovereignName": "Pactuário do Espírito Silvestre",
    "sovereignTitle": "Capitão da Ordem • Atalaia — Terraço da Seiva Dourada",
    "realmOrigin": "Veridia — O Sul Selvagem",
    "archetypeId": "mono_green_colossus",
    "archetypeName": "Colossos Primordiais",
    "archetypeSubtitle": "Mono-Verde 🌿 • Ramp & Atropelar",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "green"
    ],
    "avatarCardId": "green_171_pactuario_elemental_selva",
    "eloRating": 912,
    "eloRd": 23,
    "simulatedGames": 204,
    "simulatedWins": 77,
    "simulatedLosses": 127,
    "simulatedWinRate": 0.3775
  },
  {
    "sovereignId": "sov_red_62_colosso_obsidiana",
    "sovereignName": "Destruidor de Obsidiana Fundida",
    "sovereignTitle": "Sentinela de Fronteira • Grande Caldeira Primordial",
    "realmOrigin": "Pyros — O Norte Vulcânico",
    "archetypeId": "mono_red_pyroclasm",
    "archetypeName": "Artilharia Piroclástica",
    "archetypeSubtitle": "Mono-Vermelho 🔥 • Queima Direta & Cataclismos",
    "skillTier": 1,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "red"
    ],
    "avatarCardId": "red_62_colosso_obsidiana",
    "eloRating": 904,
    "eloRd": 23,
    "simulatedGames": 192,
    "simulatedWins": 79,
    "simulatedLosses": 113,
    "simulatedWinRate": 0.4115
  },
  {
    "sovereignId": "sov_red_133_juggernaut_fornalha",
    "sovereignName": "Juggernaut de Ferro da Fornalha",
    "sovereignTitle": "Sentinela de Fronteira • Forte da Escória",
    "realmOrigin": "Pyros — O Norte Vulcânico",
    "archetypeId": "mono_red_blitz",
    "archetypeName": "Blitz Salamandra",
    "archetypeSubtitle": "Mono-Vermelho 🔥 • Ímpeto & Pele Incandescente",
    "skillTier": 1,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "red"
    ],
    "avatarCardId": "red_133_juggernaut_fornalha",
    "eloRating": 900,
    "eloRd": 24,
    "simulatedGames": 184,
    "simulatedWins": 75,
    "simulatedLosses": 109,
    "simulatedWinRate": 0.4076
  },
  {
    "sovereignId": "sov_green_134_anquilossauro_fortaleza",
    "sovereignName": "Anquilossauro Fortaleza de Cristal",
    "sovereignTitle": "Sentinela de Fronteira • Ponte do Musgo Antigo",
    "realmOrigin": "Veridia — O Sul Selvagem",
    "archetypeId": "mono_green_roots",
    "archetypeName": "Raízes Eternas",
    "archetypeSubtitle": "Mono-Verde 🌿 • Guardião & Regeneração",
    "skillTier": 1,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "green"
    ],
    "avatarCardId": "green_134_anquilossauro_fortaleza",
    "eloRating": 897,
    "eloRd": 24,
    "simulatedGames": 188,
    "simulatedWins": 75,
    "simulatedLosses": 113,
    "simulatedWinRate": 0.3989
  },
  {
    "sovereignId": "sov_green_168_tecelao_feixe_selva",
    "sovereignName": "Tecelão do Feixe Silvestre",
    "sovereignTitle": "Sentinela de Fronteira • Reduto — Enseada da Presa",
    "realmOrigin": "Veridia — O Sul Selvagem",
    "archetypeId": "mono_green_roots",
    "archetypeName": "Raízes Eternas",
    "archetypeSubtitle": "Mono-Verde 🌿 • Guardião & Regeneração",
    "skillTier": 1,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "green"
    ],
    "avatarCardId": "green_168_tecelao_feixe_selva",
    "eloRating": 896,
    "eloRd": 24,
    "simulatedGames": 184,
    "simulatedWins": 72,
    "simulatedLosses": 112,
    "simulatedWinRate": 0.3913
  },
  {
    "sovereignId": "sov_green_135_serpente_emplumada_selva",
    "sovereignName": "Serpente Emplumada do Dossel",
    "sovereignTitle": "Sentinela de Fronteira • Enseada da Presa",
    "realmOrigin": "Veridia — O Sul Selvagem",
    "archetypeId": "mono_green_swarm",
    "archetypeName": "Enxame & Matilha Silvestre",
    "archetypeSubtitle": "Mono-Verde 🌿 • Aggro & Buff em Massa",
    "skillTier": 1,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "green"
    ],
    "avatarCardId": "green_135_serpente_emplumada_selva",
    "eloRating": 895,
    "eloRd": 24,
    "simulatedGames": 188,
    "simulatedWins": 68,
    "simulatedLosses": 120,
    "simulatedWinRate": 0.3617
  },
  {
    "sovereignId": "sov_red_171_pactuario_elemental_chama",
    "sovereignName": "Pactuário do Espírito Magmático",
    "sovereignTitle": "Sentinela de Fronteira • Atalaia — Grande Caldeira Primordial",
    "realmOrigin": "Pyros — O Norte Vulcânico",
    "archetypeId": "mono_red_blitz",
    "archetypeName": "Blitz Salamandra",
    "archetypeSubtitle": "Mono-Vermelho 🔥 • Ímpeto & Pele Incandescente",
    "skillTier": 1,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "red"
    ],
    "avatarCardId": "red_171_pactuario_elemental_chama",
    "eloRating": 894,
    "eloRd": 24,
    "simulatedGames": 184,
    "simulatedWins": 71,
    "simulatedLosses": 113,
    "simulatedWinRate": 0.3859
  },
  {
    "sovereignId": "sov_blue_132_esfinge_nebulosa",
    "sovereignName": "Esfinge da Nebulosa Safira",
    "sovereignTitle": "Sentinela de Fronteira • Baluarte — Forte da Geada Negra",
    "realmOrigin": "Vórtex — Polos Setentrionais",
    "archetypeId": "mono_blue_abyssal",
    "archetypeName": "Frota Abissal",
    "archetypeSubtitle": "Mono-Azul 🌊 • Voo, Alcance & Leviatãs",
    "skillTier": 1,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "blue"
    ],
    "avatarCardId": "blue_132_esfinge_nebulosa",
    "eloRating": 894,
    "eloRd": 24,
    "simulatedGames": 188,
    "simulatedWins": 71,
    "simulatedLosses": 117,
    "simulatedWinRate": 0.3777
  },
  {
    "sovereignId": "sov_purple_44_devorador_intelecto",
    "sovereignName": "Espectro Usurpador de Sombras",
    "sovereignTitle": "Sentinela de Fronteira • Ponte do Ossário",
    "realmOrigin": "Vale do Eclipse — Oeste Profundo",
    "archetypeId": "mono_purple_crypt",
    "archetypeName": "Guardiões da Cripta",
    "archetypeSubtitle": "Mono-Roxo 💀 • Renascer & Reanimação",
    "skillTier": 1,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "avatarCardId": "purple_44_devorador_intelecto",
    "eloRating": 885,
    "eloRd": 24,
    "simulatedGames": 176,
    "simulatedWins": 70,
    "simulatedLosses": 106,
    "simulatedWinRate": 0.3977
  },
  {
    "sovereignId": "sov_red_18_marechal_rubro",
    "sovereignName": "Marechal da Legião Férrea",
    "sovereignTitle": "Sentinela de Fronteira • Reduto — Forte da Escória",
    "realmOrigin": "Pyros — O Norte Vulcânico",
    "archetypeId": "mono_red_pyroclasm",
    "archetypeName": "Artilharia Piroclástica",
    "archetypeSubtitle": "Mono-Vermelho 🔥 • Queima Direta & Cataclismos",
    "skillTier": 1,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "red"
    ],
    "avatarCardId": "red_18_marechal_rubro",
    "eloRating": 875,
    "eloRd": 24,
    "simulatedGames": 184,
    "simulatedWins": 71,
    "simulatedLosses": 113,
    "simulatedWinRate": 0.3859
  },
  {
    "sovereignId": "sov_blue_61_quimera_tempestade",
    "sovereignName": "Grifo-Tormenta de Asas Elétricas",
    "sovereignTitle": "Sentinela de Fronteira • Forte da Geada Negra",
    "realmOrigin": "Vórtex — Polos Setentrionais",
    "archetypeId": "mono_blue_frost",
    "archetypeName": "Inverno Eterno",
    "archetypeSubtitle": "Mono-Azul ❄️ • Congelar & Estase Tática",
    "skillTier": 1,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "blue"
    ],
    "avatarCardId": "blue_61_quimera_tempestade",
    "eloRating": 873,
    "eloRd": 25,
    "simulatedGames": 176,
    "simulatedWins": 65,
    "simulatedLosses": 111,
    "simulatedWinRate": 0.3693
  },
  {
    "sovereignId": "sov_green_83_troll_duas_cabecas",
    "sovereignName": "Troll Dire de Sangue Eterno",
    "sovereignTitle": "Sentinela de Fronteira • Guarita das Raízes Vivas",
    "realmOrigin": "Veridia — O Sul Selvagem",
    "archetypeId": "mono_green_swarm",
    "archetypeName": "Enxame & Matilha Silvestre",
    "archetypeSubtitle": "Mono-Verde 🌿 • Aggro & Buff em Massa",
    "skillTier": 1,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "green"
    ],
    "avatarCardId": "green_83_troll_duas_cabecas",
    "eloRating": 848,
    "eloRd": 25,
    "simulatedGames": 168,
    "simulatedWins": 64,
    "simulatedLosses": 104,
    "simulatedWinRate": 0.381
  },
  {
    "sovereignId": "sov_red_97_lancador_chamas",
    "sovereignName": "Piromante Lança-Chamas",
    "sovereignTitle": "Sentinela de Fronteira • Vanguarda — Ponte das Correntes Rubras",
    "realmOrigin": "Pyros — O Norte Vulcânico",
    "archetypeId": "mono_red_dragon",
    "archetypeName": "Trono Dracônico",
    "archetypeSubtitle": "Mono-Vermelho 🔥 • Voo, Sopro & Ascensão",
    "skillTier": 1,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "red"
    ],
    "avatarCardId": "red_97_lancador_chamas",
    "eloRating": 846,
    "eloRd": 24,
    "simulatedGames": 184,
    "simulatedWins": 65,
    "simulatedLosses": 119,
    "simulatedWinRate": 0.3533
  },
  {
    "sovereignId": "sov_purple_81_aberracao_relogio",
    "sovereignName": "Astrolábio Vivo do Eclipse",
    "sovereignTitle": "Sentinela de Fronteira • Vanguarda — Altar do Miasma",
    "realmOrigin": "Vale do Eclipse — Oeste Profundo",
    "archetypeId": "mono_purple_umbral",
    "archetypeName": "Inquisição Umbral",
    "archetypeSubtitle": "Mono-Roxo 🌑 • Destruição, Debuff & Controle",
    "skillTier": 1,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "avatarCardId": "purple_81_aberracao_relogio",
    "eloRating": 838,
    "eloRd": 26,
    "simulatedGames": 160,
    "simulatedWins": 57,
    "simulatedLosses": 103,
    "simulatedWinRate": 0.3563
  },
  {
    "sovereignId": "sov_blue_96_arquimago_tempestade",
    "sovereignName": "Arquimago da Cidadela Flutuante",
    "sovereignTitle": "Sentinela de Fronteira • Atalaia — Ponte de Gelo Astral",
    "realmOrigin": "Vórtex — Polos Setentrionais",
    "archetypeId": "mono_blue_chrono",
    "archetypeName": "Conclave Cronomante",
    "archetypeSubtitle": "Mono-Azul ⚡ • Compra, Reações & Feitiços",
    "skillTier": 1,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "blue"
    ],
    "avatarCardId": "blue_96_arquimago_tempestade",
    "eloRating": 835,
    "eloRd": 25,
    "simulatedGames": 164,
    "simulatedWins": 60,
    "simulatedLosses": 104,
    "simulatedWinRate": 0.3659
  },
  {
    "sovereignId": "sov_purple_80_necromante_entropia",
    "sovereignName": "Lich da Entropia Temporal",
    "sovereignTitle": "Sentinela de Fronteira • Baluarte — Capela das Sombras",
    "realmOrigin": "Vale do Eclipse — Oeste Profundo",
    "archetypeId": "mono_purple_blood",
    "archetypeName": "Tributo Vital",
    "archetypeSubtitle": "Mono-Roxo ⚡ • Dreno de Vida & Toque Letal",
    "skillTier": 1,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "avatarCardId": "purple_80_necromante_entropia",
    "eloRating": 768,
    "eloRd": 27,
    "simulatedGames": 148,
    "simulatedWins": 46,
    "simulatedLosses": 102,
    "simulatedWinRate": 0.3108
  },
  {
    "sovereignId": "sov_purple_171_pactuario_elemental_abismo",
    "sovereignName": "Pactuário do Espírito Umbral",
    "sovereignTitle": "Sentinela de Fronteira • Capela das Sombras",
    "realmOrigin": "Vale do Eclipse — Oeste Profundo",
    "archetypeId": "mono_purple_umbral",
    "archetypeName": "Inquisição Umbral",
    "archetypeSubtitle": "Mono-Roxo 🌑 • Destruição, Debuff & Controle",
    "skillTier": 1,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "avatarCardId": "purple_171_pactuario_elemental_abismo",
    "eloRating": 737,
    "eloRd": 27,
    "simulatedGames": 152,
    "simulatedWins": 42,
    "simulatedLosses": 110,
    "simulatedWinRate": 0.2763
  },
  {
    "sovereignId": "sov_purple_168_tecelao_feixe_abismo",
    "sovereignName": "Tecelão do Feixe Umbral",
    "sovereignTitle": "Sentinela de Fronteira • Reduto — Ponte do Ossário",
    "realmOrigin": "Vale do Eclipse — Oeste Profundo",
    "archetypeId": "mono_purple_blood",
    "archetypeName": "Tributo Vital",
    "archetypeSubtitle": "Mono-Roxo ⚡ • Dreno de Vida & Toque Letal",
    "skillTier": 1,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "avatarCardId": "purple_168_tecelao_feixe_abismo",
    "eloRating": 708,
    "eloRd": 28,
    "simulatedGames": 140,
    "simulatedWins": 35,
    "simulatedLosses": 105,
    "simulatedWinRate": 0.25
  },
  {
    "sovereignId": "sov_green_05_minotauro",
    "sovereignName": "Minotauro Quebra-Muros",
    "sovereignTitle": "Sentinela de Fronteira • Baluarte — Ponte do Musgo Antigo",
    "realmOrigin": "Veridia — O Sul Selvagem",
    "archetypeId": "mono_green_colossus",
    "archetypeName": "Colossos Primordiais",
    "archetypeSubtitle": "Mono-Verde 🌿 • Ramp & Atropelar",
    "skillTier": 1,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "green"
    ],
    "avatarCardId": "green_05_minotauro",
    "eloRating": 695,
    "eloRd": 29,
    "simulatedGames": 136,
    "simulatedWins": 32,
    "simulatedLosses": 104,
    "simulatedWinRate": 0.2353
  },
  {
    "sovereignId": "sov_green_19_guardiao_ursino",
    "sovereignName": "Patriarca Urso-Ancestral",
    "sovereignTitle": "Sentinela de Fronteira • Vanguarda — Guarita das Raízes Vivas",
    "realmOrigin": "Veridia — O Sul Selvagem",
    "archetypeId": "mono_green_colossus",
    "archetypeName": "Colossos Primordiais",
    "archetypeSubtitle": "Mono-Verde 🌿 • Ramp & Atropelar",
    "skillTier": 1,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "green"
    ],
    "avatarCardId": "green_19_guardiao_ursino",
    "eloRating": 653,
    "eloRd": 30,
    "simulatedGames": 132,
    "simulatedWins": 26,
    "simulatedLosses": 106,
    "simulatedWinRate": 0.197
  }
];
