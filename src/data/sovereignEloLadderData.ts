import { AiSkillTier, Domain } from '../types/game';
import type { UnifiedChampionId, UnifiedFormatKind } from './aiUnifiedTournamentData';

/**
 * GERADO AUTOMATICAMENTE POR src/scripts/runEloCalibrationLeague.ts
 * Liga Oficial de Calibração ELO Multi-Tier (Bradley-Terry MLE + Escala FIDE).
 * Âncora: Mediana Tier II Regular = 1200 ELO.
 * Cada Grão-Soberano (44) e Comandante Regional (24) possui vínculo 1-para-1 exclusivo com sua própria carta.
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
  "generatedAt": "2026-11-01T04:01:52.025Z",
  "totalProfilesCalibrated": 220,
  "totalCalibrationMatches": 70004,
  "tier5ChampionshipMatches": 45408,
  "anchorDescription": "Mediana Tier II Regular = 1200 ELO (FIDE / Bradley-Terry MLE)",
  "bradleyTerryIterations": 451,
  "logLikelihood": -41086.98,
  "elapsedSeconds": 189.4,
  "tierEloDistribution": {
    "1": {
      "minElo": 434,
      "medianElo": 886,
      "meanElo": 862,
      "maxElo": 1214
    },
    "2": {
      "minElo": 884,
      "medianElo": 1200,
      "meanElo": 1205,
      "maxElo": 1489
    },
    "3": {
      "minElo": 1234,
      "medianElo": 1435,
      "meanElo": 1437,
      "maxElo": 1724
    },
    "4": {
      "minElo": 1308,
      "medianElo": 1542,
      "meanElo": 1533,
      "maxElo": 1752
    },
    "5": {
      "minElo": 1419,
      "medianElo": 1619,
      "meanElo": 1595,
      "maxElo": 1788
    }
  }
};

export const ARCHETYPE_TIER_ELO_MAP: Record<
  UnifiedChampionId,
  Record<AiSkillTier, CalibratedArchetypeTierCell>
> = {
  "mono_green_swarm": {
    "1": {
      "elo": 820,
      "rd": 27,
      "games": 220,
      "wins": 48,
      "losses": 172,
      "draws": 0,
      "winRate": 0.2182
    },
    "2": {
      "elo": 1207,
      "rd": 22,
      "games": 280,
      "wins": 130,
      "losses": 150,
      "draws": 0,
      "winRate": 0.4643
    },
    "3": {
      "elo": 1435,
      "rd": 21,
      "games": 280,
      "wins": 165,
      "losses": 115,
      "draws": 0,
      "winRate": 0.5893
    },
    "4": {
      "elo": 1460,
      "rd": 21,
      "games": 250,
      "wins": 130,
      "losses": 120,
      "draws": 0,
      "winRate": 0.52
    },
    "5": {
      "elo": 1511,
      "rd": 12,
      "games": 2152,
      "wins": 850,
      "losses": 1302,
      "draws": 0,
      "winRate": 0.395
    }
  },
  "mono_green_colossus": {
    "1": {
      "elo": 602,
      "rd": 30,
      "games": 220,
      "wins": 27,
      "losses": 193,
      "draws": 0,
      "winRate": 0.1227
    },
    "2": {
      "elo": 884,
      "rd": 27,
      "games": 280,
      "wins": 51,
      "losses": 229,
      "draws": 0,
      "winRate": 0.1821
    },
    "3": {
      "elo": 1234,
      "rd": 22,
      "games": 280,
      "wins": 117,
      "losses": 163,
      "draws": 0,
      "winRate": 0.4179
    },
    "4": {
      "elo": 1348,
      "rd": 23,
      "games": 250,
      "wins": 100,
      "losses": 150,
      "draws": 0,
      "winRate": 0.4
    },
    "5": {
      "elo": 1459,
      "rd": 12,
      "games": 2152,
      "wins": 714,
      "losses": 1438,
      "draws": 0,
      "winRate": 0.3318
    }
  },
  "mono_green_roots": {
    "1": {
      "elo": 836,
      "rd": 27,
      "games": 220,
      "wins": 55,
      "losses": 165,
      "draws": 0,
      "winRate": 0.25
    },
    "2": {
      "elo": 1023,
      "rd": 24,
      "games": 280,
      "wins": 75,
      "losses": 205,
      "draws": 0,
      "winRate": 0.2679
    },
    "3": {
      "elo": 1345,
      "rd": 21,
      "games": 280,
      "wins": 147,
      "losses": 133,
      "draws": 0,
      "winRate": 0.525
    },
    "4": {
      "elo": 1308,
      "rd": 23,
      "games": 250,
      "wins": 98,
      "losses": 152,
      "draws": 0,
      "winRate": 0.392
    },
    "5": {
      "elo": 1419,
      "rd": 12,
      "games": 2152,
      "wins": 612,
      "losses": 1540,
      "draws": 0,
      "winRate": 0.2844
    }
  },
  "mono_red_blitz": {
    "1": {
      "elo": 434,
      "rd": 35,
      "games": 220,
      "wins": 12,
      "losses": 208,
      "draws": 0,
      "winRate": 0.0545
    },
    "2": {
      "elo": 1180,
      "rd": 22,
      "games": 280,
      "wins": 124,
      "losses": 156,
      "draws": 0,
      "winRate": 0.4429
    },
    "3": {
      "elo": 1399,
      "rd": 22,
      "games": 280,
      "wins": 149,
      "losses": 131,
      "draws": 0,
      "winRate": 0.5321
    },
    "4": {
      "elo": 1521,
      "rd": 22,
      "games": 250,
      "wins": 152,
      "losses": 98,
      "draws": 0,
      "winRate": 0.608
    },
    "5": {
      "elo": 1569,
      "rd": 12,
      "games": 2152,
      "wins": 1017,
      "losses": 1135,
      "draws": 0,
      "winRate": 0.4726
    }
  },
  "mono_red_pyroclasm": {
    "1": {
      "elo": 530,
      "rd": 34,
      "games": 220,
      "wins": 17,
      "losses": 203,
      "draws": 0,
      "winRate": 0.0773
    },
    "2": {
      "elo": 1072,
      "rd": 23,
      "games": 280,
      "wins": 87,
      "losses": 193,
      "draws": 0,
      "winRate": 0.3107
    },
    "3": {
      "elo": 1341,
      "rd": 21,
      "games": 280,
      "wins": 137,
      "losses": 143,
      "draws": 0,
      "winRate": 0.4893
    },
    "4": {
      "elo": 1408,
      "rd": 22,
      "games": 250,
      "wins": 114,
      "losses": 136,
      "draws": 0,
      "winRate": 0.456
    },
    "5": {
      "elo": 1457,
      "rd": 12,
      "games": 2152,
      "wins": 708,
      "losses": 1444,
      "draws": 0,
      "winRate": 0.329
    }
  },
  "mono_red_dragon": {
    "1": {
      "elo": 924,
      "rd": 25,
      "games": 220,
      "wins": 66,
      "losses": 154,
      "draws": 0,
      "winRate": 0.3
    },
    "2": {
      "elo": 1066,
      "rd": 23,
      "games": 280,
      "wins": 83,
      "losses": 197,
      "draws": 0,
      "winRate": 0.2964
    },
    "3": {
      "elo": 1317,
      "rd": 21,
      "games": 280,
      "wins": 140,
      "losses": 140,
      "draws": 0,
      "winRate": 0.5
    },
    "4": {
      "elo": 1441,
      "rd": 22,
      "games": 250,
      "wins": 133,
      "losses": 117,
      "draws": 0,
      "winRate": 0.532
    },
    "5": {
      "elo": 1512,
      "rd": 12,
      "games": 2152,
      "wins": 858,
      "losses": 1294,
      "draws": 0,
      "winRate": 0.3987
    }
  },
  "mono_blue_frost": {
    "1": {
      "elo": 847,
      "rd": 27,
      "games": 220,
      "wins": 49,
      "losses": 171,
      "draws": 0,
      "winRate": 0.2227
    },
    "2": {
      "elo": 1250,
      "rd": 22,
      "games": 280,
      "wins": 141,
      "losses": 139,
      "draws": 0,
      "winRate": 0.5036
    },
    "3": {
      "elo": 1440,
      "rd": 21,
      "games": 280,
      "wins": 167,
      "losses": 113,
      "draws": 0,
      "winRate": 0.5964
    },
    "4": {
      "elo": 1516,
      "rd": 21,
      "games": 250,
      "wins": 153,
      "losses": 97,
      "draws": 0,
      "winRate": 0.612
    },
    "5": {
      "elo": 1555,
      "rd": 12,
      "games": 2152,
      "wins": 980,
      "losses": 1172,
      "draws": 0,
      "winRate": 0.4554
    }
  },
  "mono_blue_chrono": {
    "1": {
      "elo": 729,
      "rd": 29,
      "games": 220,
      "wins": 29,
      "losses": 191,
      "draws": 0,
      "winRate": 0.1318
    },
    "2": {
      "elo": 1071,
      "rd": 22,
      "games": 280,
      "wins": 89,
      "losses": 191,
      "draws": 0,
      "winRate": 0.3179
    },
    "3": {
      "elo": 1349,
      "rd": 21,
      "games": 280,
      "wins": 130,
      "losses": 150,
      "draws": 0,
      "winRate": 0.4643
    },
    "4": {
      "elo": 1484,
      "rd": 21,
      "games": 250,
      "wins": 140,
      "losses": 110,
      "draws": 0,
      "winRate": 0.56
    },
    "5": {
      "elo": 1556,
      "rd": 12,
      "games": 2152,
      "wins": 980,
      "losses": 1172,
      "draws": 0,
      "winRate": 0.4554
    }
  },
  "mono_blue_abyssal": {
    "1": {
      "elo": 744,
      "rd": 29,
      "games": 220,
      "wins": 37,
      "losses": 183,
      "draws": 0,
      "winRate": 0.1682
    },
    "2": {
      "elo": 1147,
      "rd": 22,
      "games": 280,
      "wins": 101,
      "losses": 179,
      "draws": 0,
      "winRate": 0.3607
    },
    "3": {
      "elo": 1413,
      "rd": 21,
      "games": 280,
      "wins": 166,
      "losses": 114,
      "draws": 0,
      "winRate": 0.5929
    },
    "4": {
      "elo": 1510,
      "rd": 22,
      "games": 250,
      "wins": 150,
      "losses": 100,
      "draws": 0,
      "winRate": 0.6
    },
    "5": {
      "elo": 1461,
      "rd": 12,
      "games": 2152,
      "wins": 717,
      "losses": 1435,
      "draws": 0,
      "winRate": 0.3332
    }
  },
  "mono_purple_crypt": {
    "1": {
      "elo": 483,
      "rd": 36,
      "games": 220,
      "wins": 9,
      "losses": 211,
      "draws": 0,
      "winRate": 0.0409
    },
    "2": {
      "elo": 1149,
      "rd": 22,
      "games": 280,
      "wins": 103,
      "losses": 177,
      "draws": 0,
      "winRate": 0.3679
    },
    "3": {
      "elo": 1422,
      "rd": 21,
      "games": 280,
      "wins": 167,
      "losses": 113,
      "draws": 0,
      "winRate": 0.5964
    },
    "4": {
      "elo": 1475,
      "rd": 21,
      "games": 250,
      "wins": 139,
      "losses": 111,
      "draws": 0,
      "winRate": 0.556
    },
    "5": {
      "elo": 1479,
      "rd": 12,
      "games": 2152,
      "wins": 765,
      "losses": 1387,
      "draws": 0,
      "winRate": 0.3555
    }
  },
  "mono_purple_blood": {
    "1": {
      "elo": 553,
      "rd": 31,
      "games": 220,
      "wins": 26,
      "losses": 194,
      "draws": 0,
      "winRate": 0.1182
    },
    "2": {
      "elo": 1051,
      "rd": 23,
      "games": 280,
      "wins": 83,
      "losses": 197,
      "draws": 0,
      "winRate": 0.2964
    },
    "3": {
      "elo": 1294,
      "rd": 22,
      "games": 280,
      "wins": 124,
      "losses": 156,
      "draws": 0,
      "winRate": 0.4429
    },
    "4": {
      "elo": 1415,
      "rd": 22,
      "games": 250,
      "wins": 122,
      "losses": 128,
      "draws": 0,
      "winRate": 0.488
    },
    "5": {
      "elo": 1425,
      "rd": 12,
      "games": 2152,
      "wins": 627,
      "losses": 1525,
      "draws": 0,
      "winRate": 0.2914
    }
  },
  "mono_purple_umbral": {
    "1": {
      "elo": 437,
      "rd": 36,
      "games": 220,
      "wins": 9,
      "losses": 211,
      "draws": 0,
      "winRate": 0.0409
    },
    "2": {
      "elo": 1121,
      "rd": 22,
      "games": 280,
      "wins": 97,
      "losses": 183,
      "draws": 0,
      "winRate": 0.3464
    },
    "3": {
      "elo": 1340,
      "rd": 21,
      "games": 280,
      "wins": 137,
      "losses": 143,
      "draws": 0,
      "winRate": 0.4893
    },
    "4": {
      "elo": 1410,
      "rd": 22,
      "games": 250,
      "wins": 114,
      "losses": 136,
      "draws": 0,
      "winRate": 0.456
    },
    "5": {
      "elo": 1503,
      "rd": 12,
      "games": 2152,
      "wins": 828,
      "losses": 1324,
      "draws": 0,
      "winRate": 0.3848
    }
  },
  "mono_gold_phalanx": {
    "1": {
      "elo": 901,
      "rd": 26,
      "games": 220,
      "wins": 63,
      "losses": 157,
      "draws": 0,
      "winRate": 0.2864
    },
    "2": {
      "elo": 1186,
      "rd": 22,
      "games": 280,
      "wins": 121,
      "losses": 159,
      "draws": 0,
      "winRate": 0.4321
    },
    "3": {
      "elo": 1382,
      "rd": 21,
      "games": 280,
      "wins": 155,
      "losses": 125,
      "draws": 0,
      "winRate": 0.5536
    },
    "4": {
      "elo": 1490,
      "rd": 21,
      "games": 250,
      "wins": 137,
      "losses": 113,
      "draws": 0,
      "winRate": 0.548
    },
    "5": {
      "elo": 1535,
      "rd": 12,
      "games": 2152,
      "wins": 919,
      "losses": 1233,
      "draws": 0,
      "winRate": 0.427
    }
  },
  "mono_gold_celestial": {
    "1": {
      "elo": 684,
      "rd": 30,
      "games": 220,
      "wins": 30,
      "losses": 190,
      "draws": 0,
      "winRate": 0.1364
    },
    "2": {
      "elo": 1200,
      "rd": 21,
      "games": 280,
      "wins": 129,
      "losses": 151,
      "draws": 0,
      "winRate": 0.4607
    },
    "3": {
      "elo": 1340,
      "rd": 21,
      "games": 280,
      "wins": 132,
      "losses": 148,
      "draws": 0,
      "winRate": 0.4714
    },
    "4": {
      "elo": 1411,
      "rd": 21,
      "games": 250,
      "wins": 115,
      "losses": 135,
      "draws": 0,
      "winRate": 0.46
    },
    "5": {
      "elo": 1522,
      "rd": 12,
      "games": 2152,
      "wins": 882,
      "losses": 1270,
      "draws": 0,
      "winRate": 0.4099
    }
  },
  "mono_gold_judgment": {
    "1": {
      "elo": 779,
      "rd": 28,
      "games": 220,
      "wins": 34,
      "losses": 186,
      "draws": 0,
      "winRate": 0.1545
    },
    "2": {
      "elo": 1151,
      "rd": 22,
      "games": 280,
      "wins": 114,
      "losses": 166,
      "draws": 0,
      "winRate": 0.4071
    },
    "3": {
      "elo": 1364,
      "rd": 21,
      "games": 280,
      "wins": 144,
      "losses": 136,
      "draws": 0,
      "winRate": 0.5143
    },
    "4": {
      "elo": 1436,
      "rd": 21,
      "games": 250,
      "wins": 126,
      "losses": 124,
      "draws": 0,
      "winRate": 0.504
    },
    "5": {
      "elo": 1469,
      "rd": 12,
      "games": 2152,
      "wins": 736,
      "losses": 1416,
      "draws": 0,
      "winRate": 0.342
    }
  },
  "mono_neutral_axial": {
    "1": {
      "elo": 880,
      "rd": 26,
      "games": 220,
      "wins": 65,
      "losses": 155,
      "draws": 0,
      "winRate": 0.2955
    },
    "2": {
      "elo": 1159,
      "rd": 22,
      "games": 280,
      "wins": 108,
      "losses": 172,
      "draws": 0,
      "winRate": 0.3857
    },
    "3": {
      "elo": 1417,
      "rd": 21,
      "games": 280,
      "wins": 165,
      "losses": 115,
      "draws": 0,
      "winRate": 0.5893
    },
    "4": {
      "elo": 1526,
      "rd": 21,
      "games": 250,
      "wins": 152,
      "losses": 98,
      "draws": 0,
      "winRate": 0.608
    },
    "5": {
      "elo": 1544,
      "rd": 12,
      "games": 2152,
      "wins": 945,
      "losses": 1207,
      "draws": 0,
      "winRate": 0.4391
    }
  },
  "dual_red_gold": {
    "1": {
      "elo": 822,
      "rd": 27,
      "games": 220,
      "wins": 51,
      "losses": 169,
      "draws": 0,
      "winRate": 0.2318
    },
    "2": {
      "elo": 1067,
      "rd": 23,
      "games": 280,
      "wins": 82,
      "losses": 198,
      "draws": 0,
      "winRate": 0.2929
    },
    "3": {
      "elo": 1354,
      "rd": 22,
      "games": 280,
      "wins": 134,
      "losses": 146,
      "draws": 0,
      "winRate": 0.4786
    },
    "4": {
      "elo": 1567,
      "rd": 22,
      "games": 250,
      "wins": 162,
      "losses": 88,
      "draws": 0,
      "winRate": 0.648
    },
    "5": {
      "elo": 1681,
      "rd": 12,
      "games": 2152,
      "wins": 1341,
      "losses": 811,
      "draws": 0,
      "winRate": 0.6231
    }
  },
  "dual_blue_purple": {
    "1": {
      "elo": 963,
      "rd": 27,
      "games": 220,
      "wins": 81,
      "losses": 139,
      "draws": 0,
      "winRate": 0.3682
    },
    "2": {
      "elo": 1332,
      "rd": 21,
      "games": 280,
      "wins": 156,
      "losses": 124,
      "draws": 0,
      "winRate": 0.5571
    },
    "3": {
      "elo": 1508,
      "rd": 21,
      "games": 280,
      "wins": 180,
      "losses": 100,
      "draws": 0,
      "winRate": 0.6429
    },
    "4": {
      "elo": 1559,
      "rd": 21,
      "games": 250,
      "wins": 156,
      "losses": 94,
      "draws": 0,
      "winRate": 0.624
    },
    "5": {
      "elo": 1586,
      "rd": 12,
      "games": 2152,
      "wins": 1063,
      "losses": 1089,
      "draws": 0,
      "winRate": 0.494
    }
  },
  "dual_red_green": {
    "1": {
      "elo": 921,
      "rd": 27,
      "games": 220,
      "wins": 66,
      "losses": 154,
      "draws": 0,
      "winRate": 0.3
    },
    "2": {
      "elo": 1185,
      "rd": 22,
      "games": 280,
      "wins": 110,
      "losses": 170,
      "draws": 0,
      "winRate": 0.3929
    },
    "3": {
      "elo": 1445,
      "rd": 21,
      "games": 280,
      "wins": 171,
      "losses": 109,
      "draws": 0,
      "winRate": 0.6107
    },
    "4": {
      "elo": 1523,
      "rd": 21,
      "games": 250,
      "wins": 142,
      "losses": 108,
      "draws": 0,
      "winRate": 0.568
    },
    "5": {
      "elo": 1663,
      "rd": 12,
      "games": 2152,
      "wins": 1293,
      "losses": 859,
      "draws": 0,
      "winRate": 0.6008
    }
  },
  "dual_blue_gold": {
    "1": {
      "elo": 702,
      "rd": 29,
      "games": 220,
      "wins": 39,
      "losses": 181,
      "draws": 0,
      "winRate": 0.1773
    },
    "2": {
      "elo": 1125,
      "rd": 23,
      "games": 280,
      "wins": 97,
      "losses": 183,
      "draws": 0,
      "winRate": 0.3464
    },
    "3": {
      "elo": 1372,
      "rd": 21,
      "games": 280,
      "wins": 151,
      "losses": 129,
      "draws": 0,
      "winRate": 0.5393
    },
    "4": {
      "elo": 1559,
      "rd": 22,
      "games": 250,
      "wins": 156,
      "losses": 94,
      "draws": 0,
      "winRate": 0.624
    },
    "5": {
      "elo": 1645,
      "rd": 12,
      "games": 2152,
      "wins": 1241,
      "losses": 911,
      "draws": 0,
      "winRate": 0.5767
    }
  },
  "dual_purple_green": {
    "1": {
      "elo": 823,
      "rd": 29,
      "games": 220,
      "wins": 50,
      "losses": 170,
      "draws": 0,
      "winRate": 0.2273
    },
    "2": {
      "elo": 1267,
      "rd": 22,
      "games": 280,
      "wins": 146,
      "losses": 134,
      "draws": 0,
      "winRate": 0.5214
    },
    "3": {
      "elo": 1534,
      "rd": 21,
      "games": 280,
      "wins": 190,
      "losses": 90,
      "draws": 0,
      "winRate": 0.6786
    },
    "4": {
      "elo": 1519,
      "rd": 21,
      "games": 250,
      "wins": 141,
      "losses": 109,
      "draws": 0,
      "winRate": 0.564
    },
    "5": {
      "elo": 1615,
      "rd": 12,
      "games": 2152,
      "wins": 1147,
      "losses": 1005,
      "draws": 0,
      "winRate": 0.533
    }
  },
  "dual_red_purple": {
    "1": {
      "elo": 985,
      "rd": 25,
      "games": 220,
      "wins": 71,
      "losses": 149,
      "draws": 0,
      "winRate": 0.3227
    },
    "2": {
      "elo": 1286,
      "rd": 22,
      "games": 280,
      "wins": 158,
      "losses": 122,
      "draws": 0,
      "winRate": 0.5643
    },
    "3": {
      "elo": 1486,
      "rd": 21,
      "games": 280,
      "wins": 180,
      "losses": 100,
      "draws": 0,
      "winRate": 0.6429
    },
    "4": {
      "elo": 1598,
      "rd": 21,
      "games": 250,
      "wins": 161,
      "losses": 89,
      "draws": 0,
      "winRate": 0.644
    },
    "5": {
      "elo": 1617,
      "rd": 12,
      "games": 2152,
      "wins": 1157,
      "losses": 995,
      "draws": 0,
      "winRate": 0.5376
    }
  },
  "dual_blue_green": {
    "1": {
      "elo": 770,
      "rd": 28,
      "games": 220,
      "wins": 45,
      "losses": 175,
      "draws": 0,
      "winRate": 0.2045
    },
    "2": {
      "elo": 1137,
      "rd": 23,
      "games": 280,
      "wins": 96,
      "losses": 184,
      "draws": 0,
      "winRate": 0.3429
    },
    "3": {
      "elo": 1382,
      "rd": 21,
      "games": 280,
      "wins": 151,
      "losses": 129,
      "draws": 0,
      "winRate": 0.5393
    },
    "4": {
      "elo": 1556,
      "rd": 22,
      "games": 250,
      "wins": 153,
      "losses": 97,
      "draws": 0,
      "winRate": 0.612
    },
    "5": {
      "elo": 1656,
      "rd": 12,
      "games": 2152,
      "wins": 1271,
      "losses": 881,
      "draws": 0,
      "winRate": 0.5906
    }
  },
  "dual_green_gold": {
    "1": {
      "elo": 886,
      "rd": 26,
      "games": 220,
      "wins": 60,
      "losses": 160,
      "draws": 0,
      "winRate": 0.2727
    },
    "2": {
      "elo": 1194,
      "rd": 22,
      "games": 280,
      "wins": 119,
      "losses": 161,
      "draws": 0,
      "winRate": 0.425
    },
    "3": {
      "elo": 1416,
      "rd": 21,
      "games": 280,
      "wins": 154,
      "losses": 126,
      "draws": 0,
      "winRate": 0.55
    },
    "4": {
      "elo": 1505,
      "rd": 21,
      "games": 250,
      "wins": 142,
      "losses": 108,
      "draws": 0,
      "winRate": 0.568
    },
    "5": {
      "elo": 1621,
      "rd": 12,
      "games": 2152,
      "wins": 1168,
      "losses": 984,
      "draws": 0,
      "winRate": 0.5428
    }
  },
  "dual_purple_gold": {
    "1": {
      "elo": 933,
      "rd": 26,
      "games": 220,
      "wins": 83,
      "losses": 137,
      "draws": 0,
      "winRate": 0.3773
    },
    "2": {
      "elo": 1276,
      "rd": 21,
      "games": 280,
      "wins": 148,
      "losses": 132,
      "draws": 0,
      "winRate": 0.5286
    },
    "3": {
      "elo": 1488,
      "rd": 21,
      "games": 280,
      "wins": 174,
      "losses": 106,
      "draws": 0,
      "winRate": 0.6214
    },
    "4": {
      "elo": 1510,
      "rd": 21,
      "games": 250,
      "wins": 144,
      "losses": 106,
      "draws": 0,
      "winRate": 0.576
    },
    "5": {
      "elo": 1640,
      "rd": 12,
      "games": 2152,
      "wins": 1225,
      "losses": 927,
      "draws": 0,
      "winRate": 0.5692
    }
  },
  "dual_red_blue": {
    "1": {
      "elo": 782,
      "rd": 28,
      "games": 220,
      "wins": 50,
      "losses": 170,
      "draws": 0,
      "winRate": 0.2273
    },
    "2": {
      "elo": 1083,
      "rd": 23,
      "games": 280,
      "wins": 84,
      "losses": 196,
      "draws": 0,
      "winRate": 0.3
    },
    "3": {
      "elo": 1384,
      "rd": 22,
      "games": 280,
      "wins": 149,
      "losses": 131,
      "draws": 0,
      "winRate": 0.5321
    },
    "4": {
      "elo": 1585,
      "rd": 22,
      "games": 250,
      "wins": 164,
      "losses": 86,
      "draws": 0,
      "winRate": 0.656
    },
    "5": {
      "elo": 1619,
      "rd": 12,
      "games": 2152,
      "wins": 1162,
      "losses": 990,
      "draws": 0,
      "winRate": 0.54
    }
  },
  "dual_green_neutral": {
    "1": {
      "elo": 811,
      "rd": 28,
      "games": 220,
      "wins": 52,
      "losses": 168,
      "draws": 0,
      "winRate": 0.2364
    },
    "2": {
      "elo": 1188,
      "rd": 22,
      "games": 280,
      "wins": 114,
      "losses": 166,
      "draws": 0,
      "winRate": 0.4071
    },
    "3": {
      "elo": 1458,
      "rd": 21,
      "games": 280,
      "wins": 172,
      "losses": 108,
      "draws": 0,
      "winRate": 0.6143
    },
    "4": {
      "elo": 1589,
      "rd": 22,
      "games": 250,
      "wins": 161,
      "losses": 89,
      "draws": 0,
      "winRate": 0.644
    },
    "5": {
      "elo": 1672,
      "rd": 12,
      "games": 2152,
      "wins": 1315,
      "losses": 837,
      "draws": 0,
      "winRate": 0.6111
    }
  },
  "dual_red_neutral": {
    "1": {
      "elo": 1214,
      "rd": 25,
      "games": 220,
      "wins": 118,
      "losses": 102,
      "draws": 0,
      "winRate": 0.5364
    },
    "2": {
      "elo": 1489,
      "rd": 24,
      "games": 280,
      "wins": 198,
      "losses": 82,
      "draws": 0,
      "winRate": 0.7071
    },
    "3": {
      "elo": 1724,
      "rd": 25,
      "games": 280,
      "wins": 232,
      "losses": 48,
      "draws": 0,
      "winRate": 0.8286
    },
    "4": {
      "elo": 1684,
      "rd": 22,
      "games": 250,
      "wins": 181,
      "losses": 69,
      "draws": 0,
      "winRate": 0.724
    },
    "5": {
      "elo": 1761,
      "rd": 12,
      "games": 2152,
      "wins": 1545,
      "losses": 607,
      "draws": 0,
      "winRate": 0.7179
    }
  },
  "dual_blue_neutral": {
    "1": {
      "elo": 919,
      "rd": 26,
      "games": 220,
      "wins": 62,
      "losses": 158,
      "draws": 0,
      "winRate": 0.2818
    },
    "2": {
      "elo": 1242,
      "rd": 22,
      "games": 280,
      "wins": 131,
      "losses": 149,
      "draws": 0,
      "winRate": 0.4679
    },
    "3": {
      "elo": 1500,
      "rd": 22,
      "games": 280,
      "wins": 192,
      "losses": 88,
      "draws": 0,
      "winRate": 0.6857
    },
    "4": {
      "elo": 1563,
      "rd": 22,
      "games": 250,
      "wins": 155,
      "losses": 95,
      "draws": 0,
      "winRate": 0.62
    },
    "5": {
      "elo": 1632,
      "rd": 12,
      "games": 2152,
      "wins": 1199,
      "losses": 953,
      "draws": 0,
      "winRate": 0.5572
    }
  },
  "dual_purple_neutral": {
    "1": {
      "elo": 581,
      "rd": 31,
      "games": 220,
      "wins": 22,
      "losses": 198,
      "draws": 0,
      "winRate": 0.1
    },
    "2": {
      "elo": 1174,
      "rd": 22,
      "games": 280,
      "wins": 103,
      "losses": 177,
      "draws": 0,
      "winRate": 0.3679
    },
    "3": {
      "elo": 1461,
      "rd": 21,
      "games": 280,
      "wins": 176,
      "losses": 104,
      "draws": 0,
      "winRate": 0.6286
    },
    "4": {
      "elo": 1564,
      "rd": 22,
      "games": 250,
      "wins": 156,
      "losses": 94,
      "draws": 0,
      "winRate": 0.624
    },
    "5": {
      "elo": 1548,
      "rd": 12,
      "games": 2152,
      "wins": 953,
      "losses": 1199,
      "draws": 0,
      "winRate": 0.4428
    }
  },
  "dual_gold_neutral": {
    "1": {
      "elo": 1044,
      "rd": 25,
      "games": 220,
      "wins": 93,
      "losses": 127,
      "draws": 0,
      "winRate": 0.4227
    },
    "2": {
      "elo": 1287,
      "rd": 22,
      "games": 280,
      "wins": 155,
      "losses": 125,
      "draws": 0,
      "winRate": 0.5536
    },
    "3": {
      "elo": 1543,
      "rd": 22,
      "games": 280,
      "wins": 189,
      "losses": 91,
      "draws": 0,
      "winRate": 0.675
    },
    "4": {
      "elo": 1648,
      "rd": 22,
      "games": 250,
      "wins": 177,
      "losses": 73,
      "draws": 0,
      "winRate": 0.708
    },
    "5": {
      "elo": 1644,
      "rd": 12,
      "games": 2152,
      "wins": 1233,
      "losses": 919,
      "draws": 0,
      "winRate": 0.573
    }
  },
  "tri_red_blue_purple": {
    "1": {
      "elo": 972,
      "rd": 27,
      "games": 220,
      "wins": 80,
      "losses": 140,
      "draws": 0,
      "winRate": 0.3636
    },
    "2": {
      "elo": 1257,
      "rd": 21,
      "games": 280,
      "wins": 138,
      "losses": 142,
      "draws": 0,
      "winRate": 0.4929
    },
    "3": {
      "elo": 1473,
      "rd": 21,
      "games": 280,
      "wins": 177,
      "losses": 103,
      "draws": 0,
      "winRate": 0.6321
    },
    "4": {
      "elo": 1547,
      "rd": 22,
      "games": 250,
      "wins": 151,
      "losses": 99,
      "draws": 0,
      "winRate": 0.604
    },
    "5": {
      "elo": 1585,
      "rd": 12,
      "games": 2152,
      "wins": 1065,
      "losses": 1087,
      "draws": 0,
      "winRate": 0.4949
    }
  },
  "tri_red_green_gold": {
    "1": {
      "elo": 1024,
      "rd": 26,
      "games": 220,
      "wins": 90,
      "losses": 130,
      "draws": 0,
      "winRate": 0.4091
    },
    "2": {
      "elo": 1201,
      "rd": 22,
      "games": 280,
      "wins": 107,
      "losses": 173,
      "draws": 0,
      "winRate": 0.3821
    },
    "3": {
      "elo": 1411,
      "rd": 21,
      "games": 280,
      "wins": 156,
      "losses": 124,
      "draws": 0,
      "winRate": 0.5571
    },
    "4": {
      "elo": 1559,
      "rd": 21,
      "games": 250,
      "wins": 150,
      "losses": 100,
      "draws": 0,
      "winRate": 0.6
    },
    "5": {
      "elo": 1650,
      "rd": 12,
      "games": 2152,
      "wins": 1255,
      "losses": 897,
      "draws": 0,
      "winRate": 0.5832
    }
  },
  "tri_blue_purple_gold": {
    "1": {
      "elo": 595,
      "rd": 31,
      "games": 220,
      "wins": 28,
      "losses": 192,
      "draws": 0,
      "winRate": 0.1273
    },
    "2": {
      "elo": 1270,
      "rd": 22,
      "games": 280,
      "wins": 149,
      "losses": 131,
      "draws": 0,
      "winRate": 0.5321
    },
    "3": {
      "elo": 1439,
      "rd": 21,
      "games": 280,
      "wins": 161,
      "losses": 119,
      "draws": 0,
      "winRate": 0.575
    },
    "4": {
      "elo": 1594,
      "rd": 22,
      "games": 250,
      "wins": 163,
      "losses": 87,
      "draws": 0,
      "winRate": 0.652
    },
    "5": {
      "elo": 1623,
      "rd": 12,
      "games": 2152,
      "wins": 1174,
      "losses": 978,
      "draws": 0,
      "winRate": 0.5455
    }
  },
  "tri_red_purple_green": {
    "1": {
      "elo": 1171,
      "rd": 25,
      "games": 220,
      "wins": 114,
      "losses": 106,
      "draws": 0,
      "winRate": 0.5182
    },
    "2": {
      "elo": 1319,
      "rd": 22,
      "games": 280,
      "wins": 164,
      "losses": 116,
      "draws": 0,
      "winRate": 0.5857
    },
    "3": {
      "elo": 1564,
      "rd": 22,
      "games": 280,
      "wins": 195,
      "losses": 85,
      "draws": 0,
      "winRate": 0.6964
    },
    "4": {
      "elo": 1636,
      "rd": 22,
      "games": 250,
      "wins": 171,
      "losses": 79,
      "draws": 0,
      "winRate": 0.684
    },
    "5": {
      "elo": 1744,
      "rd": 12,
      "games": 2152,
      "wins": 1507,
      "losses": 645,
      "draws": 0,
      "winRate": 0.7003
    }
  },
  "tri_blue_green_gold": {
    "1": {
      "elo": 999,
      "rd": 25,
      "games": 220,
      "wins": 81,
      "losses": 139,
      "draws": 0,
      "winRate": 0.3682
    },
    "2": {
      "elo": 1207,
      "rd": 22,
      "games": 280,
      "wins": 118,
      "losses": 162,
      "draws": 0,
      "winRate": 0.4214
    },
    "3": {
      "elo": 1416,
      "rd": 21,
      "games": 280,
      "wins": 163,
      "losses": 117,
      "draws": 0,
      "winRate": 0.5821
    },
    "4": {
      "elo": 1513,
      "rd": 21,
      "games": 250,
      "wins": 135,
      "losses": 115,
      "draws": 0,
      "winRate": 0.54
    },
    "5": {
      "elo": 1637,
      "rd": 12,
      "games": 2152,
      "wins": 1215,
      "losses": 937,
      "draws": 0,
      "winRate": 0.5646
    }
  },
  "tri_blue_purple_green": {
    "1": {
      "elo": 1132,
      "rd": 25,
      "games": 220,
      "wins": 112,
      "losses": 108,
      "draws": 0,
      "winRate": 0.5091
    },
    "2": {
      "elo": 1291,
      "rd": 21,
      "games": 280,
      "wins": 143,
      "losses": 137,
      "draws": 0,
      "winRate": 0.5107
    },
    "3": {
      "elo": 1466,
      "rd": 21,
      "games": 280,
      "wins": 174,
      "losses": 106,
      "draws": 0,
      "winRate": 0.6214
    },
    "4": {
      "elo": 1523,
      "rd": 21,
      "games": 250,
      "wins": 139,
      "losses": 111,
      "draws": 0,
      "winRate": 0.556
    },
    "5": {
      "elo": 1583,
      "rd": 12,
      "games": 2152,
      "wins": 1055,
      "losses": 1097,
      "draws": 0,
      "winRate": 0.4902
    }
  },
  "tri_red_purple_gold": {
    "1": {
      "elo": 1197,
      "rd": 26,
      "games": 220,
      "wins": 123,
      "losses": 97,
      "draws": 0,
      "winRate": 0.5591
    },
    "2": {
      "elo": 1374,
      "rd": 22,
      "games": 280,
      "wins": 168,
      "losses": 112,
      "draws": 0,
      "winRate": 0.6
    },
    "3": {
      "elo": 1609,
      "rd": 22,
      "games": 280,
      "wins": 203,
      "losses": 77,
      "draws": 0,
      "winRate": 0.725
    },
    "4": {
      "elo": 1732,
      "rd": 24,
      "games": 250,
      "wins": 199,
      "losses": 51,
      "draws": 0,
      "winRate": 0.796
    },
    "5": {
      "elo": 1719,
      "rd": 12,
      "games": 2152,
      "wins": 1438,
      "losses": 714,
      "draws": 0,
      "winRate": 0.6682
    }
  },
  "tri_purple_green_gold": {
    "1": {
      "elo": 983,
      "rd": 27,
      "games": 220,
      "wins": 87,
      "losses": 133,
      "draws": 0,
      "winRate": 0.3955
    },
    "2": {
      "elo": 1372,
      "rd": 22,
      "games": 280,
      "wins": 156,
      "losses": 124,
      "draws": 0,
      "winRate": 0.5571
    },
    "3": {
      "elo": 1539,
      "rd": 22,
      "games": 280,
      "wins": 190,
      "losses": 90,
      "draws": 0,
      "winRate": 0.6786
    },
    "4": {
      "elo": 1542,
      "rd": 21,
      "games": 250,
      "wins": 143,
      "losses": 107,
      "draws": 0,
      "winRate": 0.572
    },
    "5": {
      "elo": 1668,
      "rd": 12,
      "games": 2152,
      "wins": 1301,
      "losses": 851,
      "draws": 0,
      "winRate": 0.6046
    }
  },
  "tri_red_blue_green": {
    "1": {
      "elo": 1079,
      "rd": 25,
      "games": 220,
      "wins": 108,
      "losses": 112,
      "draws": 0,
      "winRate": 0.4909
    },
    "2": {
      "elo": 1172,
      "rd": 22,
      "games": 280,
      "wins": 100,
      "losses": 180,
      "draws": 0,
      "winRate": 0.3571
    },
    "3": {
      "elo": 1404,
      "rd": 21,
      "games": 280,
      "wins": 151,
      "losses": 129,
      "draws": 0,
      "winRate": 0.5393
    },
    "4": {
      "elo": 1641,
      "rd": 22,
      "games": 250,
      "wins": 173,
      "losses": 77,
      "draws": 0,
      "winRate": 0.692
    },
    "5": {
      "elo": 1656,
      "rd": 12,
      "games": 2152,
      "wins": 1272,
      "losses": 880,
      "draws": 0,
      "winRate": 0.5911
    }
  },
  "tri_red_blue_gold": {
    "1": {
      "elo": 1114,
      "rd": 26,
      "games": 220,
      "wins": 105,
      "losses": 115,
      "draws": 0,
      "winRate": 0.4773
    },
    "2": {
      "elo": 1388,
      "rd": 23,
      "games": 280,
      "wins": 171,
      "losses": 109,
      "draws": 0,
      "winRate": 0.6107
    },
    "3": {
      "elo": 1562,
      "rd": 22,
      "games": 280,
      "wins": 189,
      "losses": 91,
      "draws": 0,
      "winRate": 0.675
    },
    "4": {
      "elo": 1752,
      "rd": 25,
      "games": 250,
      "wins": 202,
      "losses": 48,
      "draws": 0,
      "winRate": 0.808
    },
    "5": {
      "elo": 1788,
      "rd": 12,
      "games": 2152,
      "wins": 1614,
      "losses": 538,
      "draws": 0,
      "winRate": 0.75
    }
  },
  "penta_prismatic_crater": {
    "1": {
      "elo": 1089,
      "rd": 26,
      "games": 220,
      "wins": 93,
      "losses": 127,
      "draws": 0,
      "winRate": 0.4227
    },
    "2": {
      "elo": 1267,
      "rd": 22,
      "games": 280,
      "wins": 142,
      "losses": 138,
      "draws": 0,
      "winRate": 0.5071
    },
    "3": {
      "elo": 1446,
      "rd": 21,
      "games": 280,
      "wins": 162,
      "losses": 118,
      "draws": 0,
      "winRate": 0.5786
    },
    "4": {
      "elo": 1579,
      "rd": 22,
      "games": 250,
      "wins": 156,
      "losses": 94,
      "draws": 0,
      "winRate": 0.624
    },
    "5": {
      "elo": 1667,
      "rd": 12,
      "games": 2152,
      "wins": 1302,
      "losses": 850,
      "draws": 0,
      "winRate": 0.605
    }
  },
  "penta_free_city_sovereign": {
    "1": {
      "elo": 1159,
      "rd": 26,
      "games": 220,
      "wins": 115,
      "losses": 105,
      "draws": 0,
      "winRate": 0.5227
    },
    "2": {
      "elo": 1296,
      "rd": 21,
      "games": 280,
      "wins": 139,
      "losses": 141,
      "draws": 0,
      "winRate": 0.4964
    },
    "3": {
      "elo": 1525,
      "rd": 21,
      "games": 280,
      "wins": 189,
      "losses": 91,
      "draws": 0,
      "winRate": 0.675
    },
    "4": {
      "elo": 1574,
      "rd": 21,
      "games": 250,
      "wins": 154,
      "losses": 96,
      "draws": 0,
      "winRate": 0.616
    },
    "5": {
      "elo": 1640,
      "rd": 12,
      "games": 2152,
      "wins": 1221,
      "losses": 931,
      "draws": 0,
      "winRate": 0.5674
    }
  },
  "penta_wheel_convergence": {
    "1": {
      "elo": 1085,
      "rd": 26,
      "games": 220,
      "wins": 91,
      "losses": 129,
      "draws": 0,
      "winRate": 0.4136
    },
    "2": {
      "elo": 1344,
      "rd": 22,
      "games": 280,
      "wins": 165,
      "losses": 115,
      "draws": 0,
      "winRate": 0.5893
    },
    "3": {
      "elo": 1506,
      "rd": 22,
      "games": 280,
      "wins": 188,
      "losses": 92,
      "draws": 0,
      "winRate": 0.6714
    },
    "4": {
      "elo": 1584,
      "rd": 22,
      "games": 250,
      "wins": 163,
      "losses": 87,
      "draws": 0,
      "winRate": 0.652
    },
    "5": {
      "elo": 1644,
      "rd": 12,
      "games": 2152,
      "wins": 1235,
      "losses": 917,
      "draws": 0,
      "winRate": 0.5739
    }
  }
};

export const SOVEREIGN_AI_LEADERBOARD_ROSTER: SovereignAiLeaderboardEntry[] = [
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
    "eloRating": 1788,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 1614,
    "simulatedLosses": 538,
    "simulatedWinRate": 0.75,
    "tournamentRankTierV": 1
  },
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
    "eloRating": 1761,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 1545,
    "simulatedLosses": 607,
    "simulatedWinRate": 0.7179,
    "tournamentRankTierV": 2
  },
  {
    "sovereignId": "sov_t4_tri_red_blue_gold",
    "sovereignName": "Auronautilus, Dragão de Bronze",
    "sovereignTitle": "Arconte Tático do Conselho (Tier IV) • Tríade Pyros-Vórtex-Solária",
    "realmOrigin": "Tríade Pyros-Vórtex-Solária",
    "archetypeId": "tri_red_blue_gold",
    "archetypeName": "Conclave da Chama Celeste",
    "archetypeSubtitle": "Tríade ☀️+🔥+❄️ • Esquadra Aérea, Escudo Divino & Feitiçaria",
    "skillTier": 4,
    "isGrandSovereign": false,
    "format": "tricolor",
    "domains": [
      "gold",
      "red",
      "blue"
    ],
    "avatarCardId": "blue_23_dragao_bronze",
    "eloRating": 1752,
    "eloRd": 25,
    "simulatedGames": 250,
    "simulatedWins": 202,
    "simulatedLosses": 48,
    "simulatedWinRate": 0.808
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
    "eloRating": 1744,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 1507,
    "simulatedLosses": 645,
    "simulatedWinRate": 0.7003,
    "tournamentRankTierV": 3
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
    "eloRating": 1719,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 1438,
    "simulatedLosses": 714,
    "simulatedWinRate": 0.6682,
    "tournamentRankTierV": 4
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
    "eloRating": 1681,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 1341,
    "simulatedLosses": 811,
    "simulatedWinRate": 0.6231,
    "tournamentRankTierV": 5
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
    "eloRating": 1672,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 1315,
    "simulatedLosses": 837,
    "simulatedWinRate": 0.6111,
    "tournamentRankTierV": 6
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
    "eloRating": 1668,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 1301,
    "simulatedLosses": 851,
    "simulatedWinRate": 0.6046,
    "tournamentRankTierV": 7
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
    "eloRating": 1667,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 1302,
    "simulatedLosses": 850,
    "simulatedWinRate": 0.605,
    "tournamentRankTierV": 8
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
    "eloRating": 1663,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 1293,
    "simulatedLosses": 859,
    "simulatedWinRate": 0.6008,
    "tournamentRankTierV": 9
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
    "eloRating": 1656,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 1272,
    "simulatedLosses": 880,
    "simulatedWinRate": 0.5911,
    "tournamentRankTierV": 10
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
    "eloRating": 1656,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 1271,
    "simulatedLosses": 881,
    "simulatedWinRate": 0.5906,
    "tournamentRankTierV": 11
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
    "eloRating": 1650,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 1255,
    "simulatedLosses": 897,
    "simulatedWinRate": 0.5832,
    "tournamentRankTierV": 12
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
    "eloRating": 1645,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 1241,
    "simulatedLosses": 911,
    "simulatedWinRate": 0.5767,
    "tournamentRankTierV": 13
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
    "eloRating": 1644,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 1235,
    "simulatedLosses": 917,
    "simulatedWinRate": 0.5739,
    "tournamentRankTierV": 15
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
    "eloRating": 1644,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 1233,
    "simulatedLosses": 919,
    "simulatedWinRate": 0.573,
    "tournamentRankTierV": 14
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
    "eloRating": 1640,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 1225,
    "simulatedLosses": 927,
    "simulatedWinRate": 0.5692,
    "tournamentRankTierV": 16
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
    "eloRating": 1640,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 1221,
    "simulatedLosses": 931,
    "simulatedWinRate": 0.5674,
    "tournamentRankTierV": 17
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
    "eloRating": 1637,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 1215,
    "simulatedLosses": 937,
    "simulatedWinRate": 0.5646,
    "tournamentRankTierV": 18
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
    "eloRating": 1632,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 1199,
    "simulatedLosses": 953,
    "simulatedWinRate": 0.5572,
    "tournamentRankTierV": 19
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
    "eloRating": 1623,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 1174,
    "simulatedLosses": 978,
    "simulatedWinRate": 0.5455,
    "tournamentRankTierV": 21
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
    "eloRating": 1621,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 1168,
    "simulatedLosses": 984,
    "simulatedWinRate": 0.5428,
    "tournamentRankTierV": 22
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
    "eloRating": 1619,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 1162,
    "simulatedLosses": 990,
    "simulatedWinRate": 0.54,
    "tournamentRankTierV": 20
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
    "eloRating": 1617,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 1157,
    "simulatedLosses": 995,
    "simulatedWinRate": 0.5376,
    "tournamentRankTierV": 23
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
    "eloRating": 1615,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 1147,
    "simulatedLosses": 1005,
    "simulatedWinRate": 0.533,
    "tournamentRankTierV": 24
  },
  {
    "sovereignId": "sov_t3_tri_red_purple_gold",
    "sovereignName": "General Angelical da Espada Solar",
    "sovereignTitle": "Comandante Regional (Tier III) • Tríade Pyros-Eclipse-Solária",
    "realmOrigin": "Tríade Pyros-Eclipse-Solária",
    "archetypeId": "tri_red_purple_gold",
    "archetypeName": "Eclipse do Sol Carmesim",
    "archetypeSubtitle": "Tríade ☀️+🔥+💀 • Serafins Sanguinários, Dreno & Artilharia",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "tricolor",
    "domains": [
      "gold",
      "red",
      "purple"
    ],
    "avatarCardId": "gold_155_arconte_lanca_solar",
    "eloRating": 1609,
    "eloRd": 22,
    "simulatedGames": 280,
    "simulatedWins": 203,
    "simulatedLosses": 77,
    "simulatedWinRate": 0.725
  },
  {
    "sovereignId": "sov_t4_tri_blue_purple_gold",
    "sovereignName": "Soberano das Nuvens Altas",
    "sovereignTitle": "Arconte Tático do Conselho (Tier IV) • Tríade Vórtex-Eclipse-Solária",
    "realmOrigin": "Tríade Vórtex-Eclipse-Solária",
    "archetypeId": "tri_blue_purple_gold",
    "archetypeName": "Relicário do Trono Eterno",
    "archetypeSubtitle": "Tríade ☀️+❄️+💀 • Cidadela de Relíquias, Cronomancia & Veredito",
    "skillTier": 4,
    "isGrandSovereign": false,
    "format": "tricolor",
    "domains": [
      "gold",
      "blue",
      "purple"
    ],
    "avatarCardId": "blue_05_gigante_nuvens",
    "eloRating": 1594,
    "eloRd": 22,
    "simulatedGames": 250,
    "simulatedWins": 163,
    "simulatedLosses": 87,
    "simulatedWinRate": 0.652
  },
  {
    "sovereignId": "sov_t4_dual_green_neutral",
    "sovereignName": "Kongor, Rei de Costas Prateadas",
    "sovereignTitle": "Arconte Tático do Conselho (Tier IV) • Pacto Veridia-Axial",
    "realmOrigin": "Pacto Veridia-Axial",
    "archetypeId": "dual_green_neutral",
    "archetypeName": "Aliança dos Engenhos Silvestres",
    "archetypeSubtitle": "Aliança 🌿+⚙️ • Colossos de Madeira-Ferro & Guildas Axiais",
    "skillTier": 4,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "green",
      "neutral"
    ],
    "avatarCardId": "green_32_gorila_alfa",
    "eloRating": 1589,
    "eloRd": 22,
    "simulatedGames": 250,
    "simulatedWins": 161,
    "simulatedLosses": 89,
    "simulatedWinRate": 0.644
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
    "eloRating": 1586,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 1063,
    "simulatedLosses": 1089,
    "simulatedWinRate": 0.494,
    "tournamentRankTierV": 25
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
    "eloRating": 1585,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 1065,
    "simulatedLosses": 1087,
    "simulatedWinRate": 0.4949,
    "tournamentRankTierV": 26
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
    "eloRating": 1583,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 1055,
    "simulatedLosses": 1097,
    "simulatedWinRate": 0.4902,
    "tournamentRankTierV": 27
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
    "eloRating": 1569,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 1017,
    "simulatedLosses": 1135,
    "simulatedWinRate": 0.4726,
    "tournamentRankTierV": 28
  },
  {
    "sovereignId": "sov_t4_dual_blue_gold",
    "sovereignName": "Arcanjo Supremo das Seis Asas",
    "sovereignTitle": "Arconte Tático do Conselho (Tier IV) • Aliança Vórtex-Solária",
    "realmOrigin": "Aliança Vórtex-Solária",
    "archetypeId": "dual_blue_gold",
    "archetypeName": "Pacto da Forja do Zênite",
    "archetypeSubtitle": "Pacto Duplo ❄️+☀️ • Cidadela Cronomante & Escudo Celeste",
    "skillTier": 4,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "blue",
      "gold"
    ],
    "avatarCardId": "gold_156_serafim_coroa_radiante",
    "eloRating": 1559,
    "eloRd": 22,
    "simulatedGames": 250,
    "simulatedWins": 156,
    "simulatedLosses": 94,
    "simulatedWinRate": 0.624
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
    "eloRating": 1556,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 980,
    "simulatedLosses": 1172,
    "simulatedWinRate": 0.4554,
    "tournamentRankTierV": 30
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
    "eloRating": 1555,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 980,
    "simulatedLosses": 1172,
    "simulatedWinRate": 0.4554,
    "tournamentRankTierV": 29
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
    "eloRating": 1548,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 953,
    "simulatedLosses": 1199,
    "simulatedWinRate": 0.4428,
    "tournamentRankTierV": 31
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
    "eloRating": 1544,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 945,
    "simulatedLosses": 1207,
    "simulatedWinRate": 0.4391,
    "tournamentRankTierV": 32
  },
  {
    "sovereignId": "sov_t3_dual_gold_neutral",
    "sovereignName": "Colosso de Mármore e Ouro",
    "sovereignTitle": "Comandante Regional (Tier III) • Pacto Solária-Axial",
    "realmOrigin": "Pacto Solária-Axial",
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
    "avatarCardId": "gold_97_colosso_celestial",
    "eloRating": 1543,
    "eloRd": 22,
    "simulatedGames": 280,
    "simulatedWins": 189,
    "simulatedLosses": 91,
    "simulatedWinRate": 0.675
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
    "eloRating": 1535,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 919,
    "simulatedLosses": 1233,
    "simulatedWinRate": 0.427,
    "tournamentRankTierV": 33
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
    "eloRating": 1522,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 882,
    "simulatedLosses": 1270,
    "simulatedWinRate": 0.4099,
    "tournamentRankTierV": 34
  },
  {
    "sovereignId": "sov_t4_mono_red_blitz",
    "sovereignName": "Pyrokor, Monarca do Fogo Vivo",
    "sovereignTitle": "Arconte Tático do Conselho (Tier IV) • Pyros",
    "realmOrigin": "Pyros",
    "archetypeId": "mono_red_blitz",
    "archetypeName": "Blitz Salamandra",
    "archetypeSubtitle": "Mono-Vermelho 🔥 • Ímpeto & Pele Incandescente",
    "skillTier": 4,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "red"
    ],
    "avatarCardId": "red_156_fenix_coroa_solar",
    "eloRating": 1521,
    "eloRd": 22,
    "simulatedGames": 250,
    "simulatedWins": 152,
    "simulatedLosses": 98,
    "simulatedWinRate": 0.608
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
    "eloRating": 1512,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 858,
    "simulatedLosses": 1294,
    "simulatedWinRate": 0.3987,
    "tournamentRankTierV": 36
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
    "eloRating": 1511,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 850,
    "simulatedLosses": 1302,
    "simulatedWinRate": 0.395,
    "tournamentRankTierV": 35
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
    "eloRating": 1503,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 828,
    "simulatedLosses": 1324,
    "simulatedWinRate": 0.3848,
    "tournamentRankTierV": 37
  },
  {
    "sovereignId": "sov_t4_mono_gold_phalanx",
    "sovereignName": "Colosso da Cidadela Viva",
    "sovereignTitle": "Arconte Tático do Conselho (Tier IV) • Solária",
    "realmOrigin": "Solária",
    "archetypeId": "mono_gold_phalanx",
    "archetypeName": "Falange Impenetrável",
    "archetypeSubtitle": "Mono-Dourado 🛡️ • Guardião, Armadura & Bastião",
    "skillTier": 4,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "gold"
    ],
    "avatarCardId": "gold_137_colosso_cidadela_eterna",
    "eloRating": 1490,
    "eloRd": 21,
    "simulatedGames": 250,
    "simulatedWins": 137,
    "simulatedLosses": 113,
    "simulatedWinRate": 0.548
  },
  {
    "sovereignId": "sov_t2_dual_red_neutral",
    "sovereignName": "Draco de Escória Vulcânica",
    "sovereignTitle": "Capitão Regular da Ordem (Tier II) • Pacto Pyros-Axial",
    "realmOrigin": "Pacto Pyros-Axial",
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
    "avatarCardId": "red_114_draco_escoria",
    "eloRating": 1489,
    "eloRd": 24,
    "simulatedGames": 280,
    "simulatedWins": 198,
    "simulatedLosses": 82,
    "simulatedWinRate": 0.7071
  },
  {
    "sovereignId": "sov_t5_mono_purple_crypt",
    "sovereignName": "Vladislaus, O Patriarca de Sangue",
    "sovereignTitle": "Grão-Soberano • Cripta Real da Corte Carmesim",
    "realmOrigin": "Eclipse",
    "archetypeId": "mono_purple_crypt",
    "archetypeName": "Culto da Cripta",
    "archetypeSubtitle": "Mono-Roxo 💀 • Renascer & Reanimação",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "avatarCardId": "purple_99_lorde_vampiro_anciao",
    "eloRating": 1479,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 765,
    "simulatedLosses": 1387,
    "simulatedWinRate": 0.3555,
    "tournamentRankTierV": 38
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
    "eloRating": 1469,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 736,
    "simulatedLosses": 1416,
    "simulatedWinRate": 0.342,
    "tournamentRankTierV": 39
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
    "eloRating": 1461,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 717,
    "simulatedLosses": 1435,
    "simulatedWinRate": 0.3332,
    "tournamentRankTierV": 40
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
    "eloRating": 1459,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 714,
    "simulatedLosses": 1438,
    "simulatedWinRate": 0.3318,
    "tournamentRankTierV": 41
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
    "eloRating": 1457,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 708,
    "simulatedLosses": 1444,
    "simulatedWinRate": 0.329,
    "tournamentRankTierV": 42
  },
  {
    "sovereignId": "sov_t3_mono_green_swarm",
    "sovereignName": "Khan Centauro da Estepe Verde",
    "sovereignTitle": "Comandante Regional (Tier III) • Veridia",
    "realmOrigin": "Veridia",
    "archetypeId": "mono_green_swarm",
    "archetypeName": "Enxame & Matilha Silvestre",
    "archetypeSubtitle": "Mono-Verde 🌿 • Aggro & Buff em Massa",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "green"
    ],
    "avatarCardId": "green_44_centauro_chefe",
    "eloRating": 1435,
    "eloRd": 21,
    "simulatedGames": 280,
    "simulatedWins": 165,
    "simulatedLosses": 115,
    "simulatedWinRate": 0.5893
  },
  {
    "sovereignId": "sov_t5_mono_purple_blood",
    "sovereignName": "Carmilla, Condessa de Sangue e Ouro",
    "sovereignTitle": "Grão-Soberano • Palácio Carmesim do Vale do Eclipse",
    "realmOrigin": "Eclipse",
    "archetypeId": "mono_purple_blood",
    "archetypeName": "Pacto Sanguíneo",
    "archetypeSubtitle": "Mono-Roxo 🩸 • Dreno de Vida & Toque Letal",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "avatarCardId": "purple_46_noiva_vampira",
    "eloRating": 1425,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 627,
    "simulatedLosses": 1525,
    "simulatedWinRate": 0.2914,
    "tournamentRankTierV": 43
  },
  {
    "sovereignId": "sov_t3_mono_purple_crypt",
    "sovereignName": "Ceifador Gigante do Eclipse",
    "sovereignTitle": "Comandante Regional (Tier III) • Eclipse",
    "realmOrigin": "Eclipse",
    "archetypeId": "mono_purple_crypt",
    "archetypeName": "Culto da Cripta",
    "archetypeSubtitle": "Mono-Roxo 💀 • Renascer & Reanimação",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "avatarCardId": "purple_155_lorde_vampiro_soberano",
    "eloRating": 1422,
    "eloRd": 21,
    "simulatedGames": 280,
    "simulatedWins": 167,
    "simulatedLosses": 113,
    "simulatedWinRate": 0.5964
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
    "eloRating": 1419,
    "eloRd": 12,
    "simulatedGames": 2152,
    "simulatedWins": 612,
    "simulatedLosses": 1540,
    "simulatedWinRate": 0.2844,
    "tournamentRankTierV": 44
  },
  {
    "sovereignId": "sov_t3_dual_green_gold",
    "sovereignName": "Esfinge Guardiã do Templo Dourado",
    "sovereignTitle": "Comandante Regional (Tier III) • Aliança Veridia-Solária",
    "realmOrigin": "Aliança Veridia-Solária",
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
    "avatarCardId": "gold_63_esfinge_dourada",
    "eloRating": 1416,
    "eloRd": 21,
    "simulatedGames": 280,
    "simulatedWins": 154,
    "simulatedLosses": 126,
    "simulatedWinRate": 0.55
  },
  {
    "sovereignId": "sov_t3_dual_red_gold",
    "sovereignName": "Dragão Tectônico de Lava",
    "sovereignTitle": "Comandante Regional (Tier III) • Aliança Pyros-Solária",
    "realmOrigin": "Aliança Pyros-Solária",
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
    "avatarCardId": "red_155_senhor_efreeti_chama",
    "eloRating": 1354,
    "eloRd": 22,
    "simulatedGames": 280,
    "simulatedWins": 134,
    "simulatedLosses": 146,
    "simulatedWinRate": 0.4786
  },
  {
    "sovereignId": "sov_t2_tri_red_purple_green",
    "sovereignName": "Draco de Impacto Meteórico",
    "sovereignTitle": "Capitão Regular da Ordem (Tier II) • Tríade Pyros-Eclipse-Veridia",
    "realmOrigin": "Tríade Pyros-Eclipse-Veridia",
    "archetypeId": "tri_red_purple_green",
    "archetypeName": "Corte da Lua Sangrenta",
    "archetypeSubtitle": "Tríade 🔥+💀+🌿 • Frenesi Predatório, Cripta & Atropelar",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "tricolor",
    "domains": [
      "red",
      "purple",
      "green"
    ],
    "avatarCardId": "red_79_draco_meteoro",
    "eloRating": 1319,
    "eloRd": 22,
    "simulatedGames": 280,
    "simulatedWins": 164,
    "simulatedLosses": 116,
    "simulatedWinRate": 0.5857
  },
  {
    "sovereignId": "sov_t2_dual_purple_green",
    "sovereignName": "Ceifador Etéreo de Meia-Noite",
    "sovereignTitle": "Capitão Regular da Ordem (Tier II) • Aliança Eclipse-Veridia",
    "realmOrigin": "Aliança Eclipse-Veridia",
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
    "avatarCardId": "purple_61_sombra_assassina",
    "eloRating": 1267,
    "eloRd": 22,
    "simulatedGames": 280,
    "simulatedWins": 146,
    "simulatedLosses": 134,
    "simulatedWinRate": 0.5214
  },
  {
    "sovereignId": "sov_t2_penta_prismatic_crater",
    "sovereignName": "Oráculo Esfinge do Pináculo",
    "sovereignTitle": "Capitão Regular da Ordem (Tier II) • Cratera Prismática",
    "realmOrigin": "Cratera Prismática",
    "archetypeId": "penta_prismatic_crater",
    "archetypeName": "Soberania da Cratera Prismática",
    "archetypeSubtitle": "Ápice Pentacromático 🔥❄️💀🌿☀️ • Dragões do Prisma & Primeira Fratura",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "pentachromatic",
    "domains": [
      "red",
      "blue",
      "purple",
      "green",
      "gold"
    ],
    "avatarCardId": "blue_03_esfinge",
    "eloRating": 1267,
    "eloRd": 22,
    "simulatedGames": 280,
    "simulatedWins": 142,
    "simulatedLosses": 138,
    "simulatedWinRate": 0.5071
  },
  {
    "sovereignId": "sov_t2_mono_blue_frost",
    "sovereignName": "Gigante Oráculo do Trovão",
    "sovereignTitle": "Capitão Regular da Ordem (Tier II) • Vórtex",
    "realmOrigin": "Vórtex",
    "archetypeId": "mono_blue_frost",
    "archetypeName": "Inverno Eterno",
    "archetypeSubtitle": "Mono-Azul ❄️ • Congelar & Estase Tática",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "blue"
    ],
    "avatarCardId": "blue_151_draco_tempestade_astral",
    "eloRating": 1250,
    "eloRd": 22,
    "simulatedGames": 280,
    "simulatedWins": 141,
    "simulatedLosses": 139,
    "simulatedWinRate": 0.5036
  },
  {
    "sovereignId": "sov_t2_mono_gold_celestial",
    "sovereignName": "Arconte da Lança Celestial",
    "sovereignTitle": "Capitão Regular da Ordem (Tier II) • Solária",
    "realmOrigin": "Solária",
    "archetypeId": "mono_gold_celestial",
    "archetypeName": "Legião Celeste",
    "archetypeSubtitle": "Mono-Dourado ☀️ • Escudo Divino, Voo & Ascensão",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "gold"
    ],
    "avatarCardId": "gold_61_arconte_justica",
    "eloRating": 1200,
    "eloRd": 21,
    "simulatedGames": 280,
    "simulatedWins": 129,
    "simulatedLosses": 151,
    "simulatedWinRate": 0.4607
  },
  {
    "sovereignId": "sov_t1_tri_purple_green_gold",
    "sovereignName": "Arconte da Trombeta Dourada",
    "sovereignTitle": "Sentinela de Fronteira (Tier I) • Tríade Eclipse-Veridia-Solária",
    "realmOrigin": "Tríade Eclipse-Veridia-Solária",
    "archetypeId": "tri_purple_green_gold",
    "archetypeName": "Armada do Zênite Umbral",
    "archetypeSubtitle": "Tríade ☀️+🌿+💀 • Bastião Imortal, Regeneração & Renascer",
    "skillTier": 1,
    "isGrandSovereign": false,
    "format": "tricolor",
    "domains": [
      "gold",
      "green",
      "purple"
    ],
    "avatarCardId": "gold_152_mestre_forja_celestial",
    "eloRating": 983,
    "eloRd": 27,
    "simulatedGames": 220,
    "simulatedWins": 87,
    "simulatedLosses": 133,
    "simulatedWinRate": 0.3955
  },
  {
    "sovereignId": "sov_t1_tri_red_blue_purple",
    "sovereignName": "Jarl da Geleira Eterna",
    "sovereignTitle": "Sentinela de Fronteira (Tier I) • Tríade Pyros-Vórtex-Eclipse",
    "realmOrigin": "Tríade Pyros-Vórtex-Eclipse",
    "archetypeId": "tri_red_blue_purple",
    "archetypeName": "Cataclismo da Convergência Astral",
    "archetypeSubtitle": "Tríade ❄️+🔥+💀 • Estase, Fogo Piroclástico & Execução Umbral",
    "skillTier": 1,
    "isGrandSovereign": false,
    "format": "tricolor",
    "domains": [
      "blue",
      "red",
      "purple"
    ],
    "avatarCardId": "blue_60_gigante_gelo_jarl",
    "eloRating": 972,
    "eloRd": 27,
    "simulatedGames": 220,
    "simulatedWins": 80,
    "simulatedLosses": 140,
    "simulatedWinRate": 0.3636
  },
  {
    "sovereignId": "sov_t1_dual_blue_purple",
    "sovereignName": "Colosso de Carne Costurada",
    "sovereignTitle": "Sentinela de Fronteira (Tier I) • Aliança Vórtex-Eclipse",
    "realmOrigin": "Aliança Vórtex-Eclipse",
    "archetypeId": "dual_blue_purple",
    "archetypeName": "Pacto da Tormenta Abissal",
    "archetypeSubtitle": "Pacto Duplo ❄️+💀 • Estase Glacial & Execução Umbral",
    "skillTier": 1,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "blue",
      "purple"
    ],
    "avatarCardId": "purple_96_abominacao_costurada",
    "eloRating": 963,
    "eloRd": 27,
    "simulatedGames": 220,
    "simulatedWins": 81,
    "simulatedLosses": 139,
    "simulatedWinRate": 0.3682
  },
  {
    "sovereignId": "sov_t1_dual_purple_gold",
    "sovereignName": "Ceifador da Adaga Chorosa",
    "sovereignTitle": "Sentinela de Fronteira (Tier I) • Aliança Eclipse-Solária",
    "realmOrigin": "Aliança Eclipse-Solária",
    "archetypeId": "dual_purple_gold",
    "archetypeName": "Pacto da Inquisição Crepuscular",
    "archetypeSubtitle": "Pacto Duplo 💀+☀️ • Dreno Solar, Renascer & Veredito",
    "skillTier": 1,
    "isGrandSovereign": false,
    "format": "bicolor",
    "domains": [
      "purple",
      "gold"
    ],
    "avatarCardId": "purple_79_assassino_lamento",
    "eloRating": 933,
    "eloRd": 26,
    "simulatedGames": 220,
    "simulatedWins": 83,
    "simulatedLosses": 137,
    "simulatedWinRate": 0.3773
  },
  {
    "sovereignId": "sov_t1_mono_purple_blood",
    "sovereignName": "Arcanista das Correntes Umbrosas",
    "sovereignTitle": "Sentinela de Fronteira (Tier I) • Eclipse",
    "realmOrigin": "Eclipse",
    "archetypeId": "mono_purple_blood",
    "archetypeName": "Pacto Sanguíneo",
    "archetypeSubtitle": "Mono-Roxo 🩸 • Dreno de Vida & Toque Letal",
    "skillTier": 1,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "avatarCardId": "purple_151_inquisidor_umbral",
    "eloRating": 553,
    "eloRd": 31,
    "simulatedGames": 220,
    "simulatedWins": 26,
    "simulatedLosses": 194,
    "simulatedWinRate": 0.1182
  },
  {
    "sovereignId": "sov_t1_mono_red_blitz",
    "sovereignName": "Berserker de Escama Carmesim",
    "sovereignTitle": "Sentinela de Fronteira (Tier I) • Pyros",
    "realmOrigin": "Pyros",
    "archetypeId": "mono_red_blitz",
    "archetypeName": "Blitz Salamandra",
    "archetypeSubtitle": "Mono-Vermelho 🔥 • Ímpeto & Pele Incandescente",
    "skillTier": 1,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "red"
    ],
    "avatarCardId": "red_94_berserker_draconico",
    "eloRating": 434,
    "eloRd": 35,
    "simulatedGames": 220,
    "simulatedWins": 12,
    "simulatedLosses": 208,
    "simulatedWinRate": 0.0545
  }
];
