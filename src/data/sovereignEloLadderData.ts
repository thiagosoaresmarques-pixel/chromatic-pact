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
  "generatedAt": "2026-11-01T18:15:45.053Z",
  "totalProfilesCalibrated": 276,
  "totalCalibrationMatches": 103676,
  "tier5ChampionshipMatches": 45408,
  "anchorDescription": "Mediana Tier II Regular = 1200 ELO (FIDE / Bradley-Terry MLE)",
  "bradleyTerryIterations": 501,
  "logLikelihood": -21305.05,
  "elapsedSeconds": 63.9,
  "tierEloDistribution": {
    "1": {
      "minElo": 520,
      "medianElo": 860,
      "meanElo": 831,
      "maxElo": 1006
    },
    "2": {
      "minElo": 942,
      "medianElo": 1200,
      "meanElo": 1199,
      "maxElo": 1558
    },
    "3": {
      "minElo": 1323,
      "medianElo": 1477,
      "meanElo": 1483,
      "maxElo": 1832
    },
    "4": {
      "minElo": 1371,
      "medianElo": 1624,
      "meanElo": 1613,
      "maxElo": 1760
    },
    "5": {
      "minElo": 1442,
      "medianElo": 1696,
      "meanElo": 1659,
      "maxElo": 1865
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
    "eloRating": 1865,
    "eloRd": 24,
    "simulatedGames": 180,
    "simulatedWins": 122,
    "simulatedLosses": 58,
    "simulatedWinRate": 0.6778,
    "tournamentRankTierV": 2
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
    "eloRating": 1843,
    "eloRd": 23,
    "simulatedGames": 186,
    "simulatedWins": 119,
    "simulatedLosses": 67,
    "simulatedWinRate": 0.6398,
    "tournamentRankTierV": 1
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
    "eloRating": 1832,
    "eloRd": 23,
    "simulatedGames": 196,
    "simulatedWins": 122,
    "simulatedLosses": 74,
    "simulatedWinRate": 0.6224
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
    "eloRd": 22,
    "simulatedGames": 210,
    "simulatedWins": 131,
    "simulatedLosses": 79,
    "simulatedWinRate": 0.6238
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
    "eloRating": 1797,
    "eloRd": 21,
    "simulatedGames": 236,
    "simulatedWins": 141,
    "simulatedLosses": 95,
    "simulatedWinRate": 0.5975
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
    "eloRating": 1785,
    "eloRd": 21,
    "simulatedGames": 236,
    "simulatedWins": 137,
    "simulatedLosses": 99,
    "simulatedWinRate": 0.5805,
    "tournamentRankTierV": 8
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
    "eloRating": 1783,
    "eloRd": 21,
    "simulatedGames": 242,
    "simulatedWins": 141,
    "simulatedLosses": 101,
    "simulatedWinRate": 0.5826,
    "tournamentRankTierV": 4
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
    "eloRating": 1777,
    "eloRd": 21,
    "simulatedGames": 230,
    "simulatedWins": 131,
    "simulatedLosses": 99,
    "simulatedWinRate": 0.5696
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
    "eloRating": 1776,
    "eloRd": 20,
    "simulatedGames": 264,
    "simulatedWins": 158,
    "simulatedLosses": 106,
    "simulatedWinRate": 0.5985,
    "tournamentRankTierV": 5
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
    "eloRating": 1764,
    "eloRd": 21,
    "simulatedGames": 236,
    "simulatedWins": 129,
    "simulatedLosses": 107,
    "simulatedWinRate": 0.5466,
    "tournamentRankTierV": 3
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
    "eloRating": 1760,
    "eloRd": 20,
    "simulatedGames": 250,
    "simulatedWins": 136,
    "simulatedLosses": 114,
    "simulatedWinRate": 0.544
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
    "eloRating": 1757,
    "eloRd": 20,
    "simulatedGames": 250,
    "simulatedWins": 138,
    "simulatedLosses": 112,
    "simulatedWinRate": 0.552,
    "tournamentRankTierV": 11
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
    "eloRating": 1751,
    "eloRd": 20,
    "simulatedGames": 266,
    "simulatedWins": 153,
    "simulatedLosses": 113,
    "simulatedWinRate": 0.5752,
    "tournamentRankTierV": 6
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
    "eloRating": 1740,
    "eloRd": 20,
    "simulatedGames": 254,
    "simulatedWins": 137,
    "simulatedLosses": 117,
    "simulatedWinRate": 0.5394,
    "tournamentRankTierV": 12
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
    "eloRating": 1731,
    "eloRd": 19,
    "simulatedGames": 280,
    "simulatedWins": 159,
    "simulatedLosses": 121,
    "simulatedWinRate": 0.5679
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
    "eloRating": 1727,
    "eloRd": 19,
    "simulatedGames": 276,
    "simulatedWins": 150,
    "simulatedLosses": 126,
    "simulatedWinRate": 0.5435,
    "tournamentRankTierV": 14
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
    "eloRating": 1725,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 129,
    "simulatedLosses": 123,
    "simulatedWinRate": 0.5119
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
    "eloRating": 1722,
    "eloRd": 19,
    "simulatedGames": 292,
    "simulatedWins": 174,
    "simulatedLosses": 118,
    "simulatedWinRate": 0.5959,
    "tournamentRankTierV": 18
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
    "eloRd": 19,
    "simulatedGames": 276,
    "simulatedWins": 148,
    "simulatedLosses": 128,
    "simulatedWinRate": 0.5362,
    "tournamentRankTierV": 17
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
    "eloRating": 1720,
    "eloRd": 19,
    "simulatedGames": 280,
    "simulatedWins": 155,
    "simulatedLosses": 125,
    "simulatedWinRate": 0.5536,
    "tournamentRankTierV": 15
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
    "eloRating": 1717,
    "eloRd": 19,
    "simulatedGames": 280,
    "simulatedWins": 152,
    "simulatedLosses": 128,
    "simulatedWinRate": 0.5429,
    "tournamentRankTierV": 10
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
    "eloRating": 1716,
    "eloRd": 19,
    "simulatedGames": 296,
    "simulatedWins": 168,
    "simulatedLosses": 128,
    "simulatedWinRate": 0.5676,
    "tournamentRankTierV": 9
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
    "eloRating": 1715,
    "eloRd": 19,
    "simulatedGames": 284,
    "simulatedWins": 163,
    "simulatedLosses": 121,
    "simulatedWinRate": 0.5739,
    "tournamentRankTierV": 16
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
    "eloRating": 1715,
    "eloRd": 20,
    "simulatedGames": 260,
    "simulatedWins": 136,
    "simulatedLosses": 124,
    "simulatedWinRate": 0.5231,
    "tournamentRankTierV": 19
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
    "eloRating": 1713,
    "eloRd": 19,
    "simulatedGames": 284,
    "simulatedWins": 157,
    "simulatedLosses": 127,
    "simulatedWinRate": 0.5528
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
    "eloRating": 1713,
    "eloRd": 19,
    "simulatedGames": 276,
    "simulatedWins": 148,
    "simulatedLosses": 128,
    "simulatedWinRate": 0.5362,
    "tournamentRankTierV": 21
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
    "eloRating": 1712,
    "eloRd": 19,
    "simulatedGames": 284,
    "simulatedWins": 155,
    "simulatedLosses": 129,
    "simulatedWinRate": 0.5458
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
    "eloRating": 1710,
    "eloRd": 19,
    "simulatedGames": 284,
    "simulatedWins": 155,
    "simulatedLosses": 129,
    "simulatedWinRate": 0.5458,
    "tournamentRankTierV": 20
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
    "eloRating": 1710,
    "eloRd": 20,
    "simulatedGames": 260,
    "simulatedWins": 136,
    "simulatedLosses": 124,
    "simulatedWinRate": 0.5231
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
    "eloRating": 1709,
    "eloRd": 19,
    "simulatedGames": 276,
    "simulatedWins": 148,
    "simulatedLosses": 128,
    "simulatedWinRate": 0.5362,
    "tournamentRankTierV": 13
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
    "eloRating": 1705,
    "eloRd": 19,
    "simulatedGames": 300,
    "simulatedWins": 169,
    "simulatedLosses": 131,
    "simulatedWinRate": 0.5633,
    "tournamentRankTierV": 27
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
    "eloRating": 1704,
    "eloRd": 19,
    "simulatedGames": 272,
    "simulatedWins": 140,
    "simulatedLosses": 132,
    "simulatedWinRate": 0.5147
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
    "eloRating": 1696,
    "eloRd": 19,
    "simulatedGames": 288,
    "simulatedWins": 158,
    "simulatedLosses": 130,
    "simulatedWinRate": 0.5486,
    "tournamentRankTierV": 24
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
    "eloRating": 1696,
    "eloRd": 19,
    "simulatedGames": 284,
    "simulatedWins": 154,
    "simulatedLosses": 130,
    "simulatedWinRate": 0.5423,
    "tournamentRankTierV": 7
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
    "eloRating": 1696,
    "eloRd": 19,
    "simulatedGames": 296,
    "simulatedWins": 159,
    "simulatedLosses": 137,
    "simulatedWinRate": 0.5372,
    "tournamentRankTierV": 22
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
    "eloRating": 1696,
    "eloRd": 19,
    "simulatedGames": 272,
    "simulatedWins": 140,
    "simulatedLosses": 132,
    "simulatedWinRate": 0.5147
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
    "eloRating": 1695,
    "eloRd": 20,
    "simulatedGames": 272,
    "simulatedWins": 142,
    "simulatedLosses": 130,
    "simulatedWinRate": 0.5221
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
    "eloRating": 1685,
    "eloRd": 19,
    "simulatedGames": 292,
    "simulatedWins": 158,
    "simulatedLosses": 134,
    "simulatedWinRate": 0.5411
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
    "eloRating": 1685,
    "eloRd": 20,
    "simulatedGames": 264,
    "simulatedWins": 130,
    "simulatedLosses": 134,
    "simulatedWinRate": 0.4924
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
    "eloRating": 1676,
    "eloRd": 19,
    "simulatedGames": 284,
    "simulatedWins": 139,
    "simulatedLosses": 145,
    "simulatedWinRate": 0.4894
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
    "eloRating": 1675,
    "eloRd": 19,
    "simulatedGames": 296,
    "simulatedWins": 159,
    "simulatedLosses": 137,
    "simulatedWinRate": 0.5372
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
    "eloRating": 1675,
    "eloRd": 19,
    "simulatedGames": 304,
    "simulatedWins": 157,
    "simulatedLosses": 147,
    "simulatedWinRate": 0.5164
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
    "eloRating": 1673,
    "eloRd": 19,
    "simulatedGames": 284,
    "simulatedWins": 142,
    "simulatedLosses": 142,
    "simulatedWinRate": 0.5
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
    "eloRating": 1670,
    "eloRd": 19,
    "simulatedGames": 288,
    "simulatedWins": 159,
    "simulatedLosses": 129,
    "simulatedWinRate": 0.5521
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
    "eloRating": 1666,
    "eloRd": 19,
    "simulatedGames": 304,
    "simulatedWins": 169,
    "simulatedLosses": 135,
    "simulatedWinRate": 0.5559
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
    "eloRating": 1665,
    "eloRd": 19,
    "simulatedGames": 296,
    "simulatedWins": 156,
    "simulatedLosses": 140,
    "simulatedWinRate": 0.527,
    "tournamentRankTierV": 23
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
    "eloRating": 1659,
    "eloRd": 19,
    "simulatedGames": 304,
    "simulatedWins": 160,
    "simulatedLosses": 144,
    "simulatedWinRate": 0.5263
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
    "eloRating": 1658,
    "eloRd": 19,
    "simulatedGames": 300,
    "simulatedWins": 161,
    "simulatedLosses": 139,
    "simulatedWinRate": 0.5367
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
    "eloRating": 1650,
    "eloRd": 19,
    "simulatedGames": 296,
    "simulatedWins": 154,
    "simulatedLosses": 142,
    "simulatedWinRate": 0.5203,
    "tournamentRankTierV": 25
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
    "eloRating": 1649,
    "eloRd": 19,
    "simulatedGames": 302,
    "simulatedWins": 161,
    "simulatedLosses": 141,
    "simulatedWinRate": 0.5331,
    "tournamentRankTierV": 30
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
    "eloRating": 1648,
    "eloRd": 19,
    "simulatedGames": 292,
    "simulatedWins": 149,
    "simulatedLosses": 143,
    "simulatedWinRate": 0.5103,
    "tournamentRankTierV": 28
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
    "eloRating": 1634,
    "eloRd": 19,
    "simulatedGames": 304,
    "simulatedWins": 149,
    "simulatedLosses": 155,
    "simulatedWinRate": 0.4901,
    "tournamentRankTierV": 26
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
    "eloRating": 1632,
    "eloRd": 18,
    "simulatedGames": 310,
    "simulatedWins": 168,
    "simulatedLosses": 142,
    "simulatedWinRate": 0.5419
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
    "eloRating": 1631,
    "eloRd": 19,
    "simulatedGames": 298,
    "simulatedWins": 157,
    "simulatedLosses": 141,
    "simulatedWinRate": 0.5268
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
    "eloRating": 1625,
    "eloRd": 19,
    "simulatedGames": 306,
    "simulatedWins": 168,
    "simulatedLosses": 138,
    "simulatedWinRate": 0.549
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
    "eloRating": 1624,
    "eloRd": 19,
    "simulatedGames": 296,
    "simulatedWins": 155,
    "simulatedLosses": 141,
    "simulatedWinRate": 0.5236
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
    "eloRating": 1623,
    "eloRd": 19,
    "simulatedGames": 302,
    "simulatedWins": 147,
    "simulatedLosses": 155,
    "simulatedWinRate": 0.4868
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
    "eloRating": 1617,
    "eloRd": 19,
    "simulatedGames": 292,
    "simulatedWins": 143,
    "simulatedLosses": 149,
    "simulatedWinRate": 0.4897
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
    "eloRating": 1611,
    "eloRd": 19,
    "simulatedGames": 286,
    "simulatedWins": 143,
    "simulatedLosses": 143,
    "simulatedWinRate": 0.5,
    "tournamentRankTierV": 29
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
    "eloRating": 1608,
    "eloRd": 19,
    "simulatedGames": 300,
    "simulatedWins": 158,
    "simulatedLosses": 142,
    "simulatedWinRate": 0.5267
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
    "eloRating": 1607,
    "eloRd": 19,
    "simulatedGames": 290,
    "simulatedWins": 149,
    "simulatedLosses": 141,
    "simulatedWinRate": 0.5138,
    "tournamentRankTierV": 31
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
    "eloRating": 1603,
    "eloRd": 20,
    "simulatedGames": 272,
    "simulatedWins": 143,
    "simulatedLosses": 129,
    "simulatedWinRate": 0.5257,
    "tournamentRankTierV": 33
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
    "eloRating": 1603,
    "eloRd": 19,
    "simulatedGames": 288,
    "simulatedWins": 147,
    "simulatedLosses": 141,
    "simulatedWinRate": 0.5104
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
    "eloRating": 1593,
    "eloRd": 19,
    "simulatedGames": 278,
    "simulatedWins": 137,
    "simulatedLosses": 141,
    "simulatedWinRate": 0.4928
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
    "eloRating": 1590,
    "eloRd": 21,
    "simulatedGames": 232,
    "simulatedWins": 107,
    "simulatedLosses": 125,
    "simulatedWinRate": 0.4612
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
    "eloRating": 1589,
    "eloRd": 21,
    "simulatedGames": 232,
    "simulatedWins": 111,
    "simulatedLosses": 121,
    "simulatedWinRate": 0.4784
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
    "eloRating": 1582,
    "eloRd": 21,
    "simulatedGames": 240,
    "simulatedWins": 126,
    "simulatedLosses": 114,
    "simulatedWinRate": 0.525
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
    "eloRating": 1582,
    "eloRd": 21,
    "simulatedGames": 240,
    "simulatedWins": 126,
    "simulatedLosses": 114,
    "simulatedWinRate": 0.525,
    "tournamentRankTierV": 32
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
    "eloRating": 1582,
    "eloRd": 21,
    "simulatedGames": 240,
    "simulatedWins": 125,
    "simulatedLosses": 115,
    "simulatedWinRate": 0.5208
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
    "eloRating": 1578,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 122,
    "simulatedLosses": 122,
    "simulatedWinRate": 0.5
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
    "eloRating": 1576,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 126,
    "simulatedLosses": 122,
    "simulatedWinRate": 0.5081,
    "tournamentRankTierV": 40
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
    "eloRating": 1573,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 133,
    "simulatedLosses": 119,
    "simulatedWinRate": 0.5278
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
    "eloRating": 1572,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 137,
    "simulatedLosses": 107,
    "simulatedWinRate": 0.5615,
    "tournamentRankTierV": 37
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
    "eloRating": 1568,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 138,
    "simulatedLosses": 110,
    "simulatedWinRate": 0.5565
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
    "eloRating": 1564,
    "eloRd": 20,
    "simulatedGames": 248,
    "simulatedWins": 138,
    "simulatedLosses": 110,
    "simulatedWinRate": 0.5565,
    "tournamentRankTierV": 34
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
    "eloRating": 1562,
    "eloRd": 21,
    "simulatedGames": 240,
    "simulatedWins": 119,
    "simulatedLosses": 121,
    "simulatedWinRate": 0.4958
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
    "eloRating": 1559,
    "eloRd": 20,
    "simulatedGames": 244,
    "simulatedWins": 126,
    "simulatedLosses": 118,
    "simulatedWinRate": 0.5164
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
    "eloRating": 1558,
    "eloRd": 20,
    "simulatedGames": 248,
    "simulatedWins": 128,
    "simulatedLosses": 120,
    "simulatedWinRate": 0.5161
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
    "eloRating": 1557,
    "eloRd": 20,
    "simulatedGames": 244,
    "simulatedWins": 124,
    "simulatedLosses": 120,
    "simulatedWinRate": 0.5082
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
    "eloRating": 1556,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 131,
    "simulatedLosses": 113,
    "simulatedWinRate": 0.5369,
    "tournamentRankTierV": 38
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
    "eloRating": 1556,
    "eloRd": 21,
    "simulatedGames": 240,
    "simulatedWins": 121,
    "simulatedLosses": 119,
    "simulatedWinRate": 0.5042
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
    "eloRating": 1552,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 139,
    "simulatedLosses": 113,
    "simulatedWinRate": 0.5516,
    "tournamentRankTierV": 42
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
    "eloRating": 1548,
    "eloRd": 21,
    "simulatedGames": 240,
    "simulatedWins": 116,
    "simulatedLosses": 124,
    "simulatedWinRate": 0.4833
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
    "eloRating": 1544,
    "eloRd": 20,
    "simulatedGames": 244,
    "simulatedWins": 125,
    "simulatedLosses": 119,
    "simulatedWinRate": 0.5123
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
    "eloRating": 1544,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 119,
    "simulatedLosses": 125,
    "simulatedWinRate": 0.4877,
    "tournamentRankTierV": 39
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
    "eloRating": 1544,
    "eloRd": 21,
    "simulatedGames": 240,
    "simulatedWins": 117,
    "simulatedLosses": 123,
    "simulatedWinRate": 0.4875
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
    "eloRating": 1540,
    "eloRd": 20,
    "simulatedGames": 248,
    "simulatedWins": 132,
    "simulatedLosses": 116,
    "simulatedWinRate": 0.5323,
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
    "eloRating": 1537,
    "eloRd": 20,
    "simulatedGames": 248,
    "simulatedWins": 129,
    "simulatedLosses": 119,
    "simulatedWinRate": 0.5202
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
    "eloRating": 1536,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 118,
    "simulatedLosses": 126,
    "simulatedWinRate": 0.4836
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
    "eloRating": 1535,
    "eloRd": 20,
    "simulatedGames": 248,
    "simulatedWins": 131,
    "simulatedLosses": 117,
    "simulatedWinRate": 0.5282,
    "tournamentRankTierV": 35
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
    "eloRating": 1532,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 131,
    "simulatedLosses": 113,
    "simulatedWinRate": 0.5369
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
    "eloRating": 1532,
    "eloRd": 20,
    "simulatedGames": 248,
    "simulatedWins": 124,
    "simulatedLosses": 124,
    "simulatedWinRate": 0.5,
    "tournamentRankTierV": 36
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
    "eloRating": 1532,
    "eloRd": 21,
    "simulatedGames": 240,
    "simulatedWins": 113,
    "simulatedLosses": 127,
    "simulatedWinRate": 0.4708
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
    "eloRating": 1532,
    "eloRd": 21,
    "simulatedGames": 232,
    "simulatedWins": 107,
    "simulatedLosses": 125,
    "simulatedWinRate": 0.4612
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
    "eloRating": 1530,
    "eloRd": 20,
    "simulatedGames": 248,
    "simulatedWins": 123,
    "simulatedLosses": 125,
    "simulatedWinRate": 0.496
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
    "eloRating": 1527,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 128,
    "simulatedLosses": 116,
    "simulatedWinRate": 0.5246
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
    "eloRating": 1526,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 136,
    "simulatedLosses": 116,
    "simulatedWinRate": 0.5397
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
    "eloRating": 1526,
    "eloRd": 20,
    "simulatedGames": 244,
    "simulatedWins": 113,
    "simulatedLosses": 131,
    "simulatedWinRate": 0.4631
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
    "eloRating": 1523,
    "eloRd": 20,
    "simulatedGames": 248,
    "simulatedWins": 134,
    "simulatedLosses": 114,
    "simulatedWinRate": 0.5403
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
    "eloRating": 1520,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 134,
    "simulatedLosses": 110,
    "simulatedWinRate": 0.5492
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
    "eloRating": 1517,
    "eloRd": 20,
    "simulatedGames": 248,
    "simulatedWins": 124,
    "simulatedLosses": 124,
    "simulatedWinRate": 0.5
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
    "eloRating": 1516,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 130,
    "simulatedLosses": 122,
    "simulatedWinRate": 0.5159
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
    "eloRating": 1515,
    "eloRd": 20,
    "simulatedGames": 244,
    "simulatedWins": 126,
    "simulatedLosses": 118,
    "simulatedWinRate": 0.5164
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
    "eloRating": 1508,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 137,
    "simulatedLosses": 115,
    "simulatedWinRate": 0.5437
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
    "eloRating": 1505,
    "eloRd": 20,
    "simulatedGames": 248,
    "simulatedWins": 131,
    "simulatedLosses": 117,
    "simulatedWinRate": 0.5282
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
    "eloRating": 1505,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 133,
    "simulatedLosses": 119,
    "simulatedWinRate": 0.5278
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
    "eloRating": 1503,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 140,
    "simulatedLosses": 112,
    "simulatedWinRate": 0.5556
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
    "eloRating": 1502,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 134,
    "simulatedLosses": 114,
    "simulatedWinRate": 0.5403
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
    "eloRating": 1501,
    "eloRd": 20,
    "simulatedGames": 244,
    "simulatedWins": 115,
    "simulatedLosses": 129,
    "simulatedWinRate": 0.4713
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
    "eloRating": 1499,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 131,
    "simulatedLosses": 117,
    "simulatedWinRate": 0.5282,
    "tournamentRankTierV": 44
  },
  {
    "sovereignId": "sov_purple_172_armada_draconica_abismo",
    "sovereignName": "Legião Dracônica do Eclipse",
    "sovereignTitle": "Grão-Soberano • Firmamento Sem Sol do Oeste (Eclipse)",
    "realmOrigin": "Catedral-Necrópole de Nocturnus",
    "archetypeId": "mono_purple_crypt",
    "archetypeName": "Culto da Cripta",
    "archetypeSubtitle": "Mono-Roxo 💀 • Renascer & Reanimação",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "avatarCardId": "purple_172_armada_draconica_abismo",
    "eloRating": 1498,
    "eloRd": 21,
    "simulatedGames": 240,
    "simulatedWins": 115,
    "simulatedLosses": 125,
    "simulatedWinRate": 0.4792
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
    "eloRating": 1495,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 128,
    "simulatedLosses": 120,
    "simulatedWinRate": 0.5161
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
    "eloRating": 1492,
    "eloRd": 20,
    "simulatedGames": 248,
    "simulatedWins": 136,
    "simulatedLosses": 112,
    "simulatedWinRate": 0.5484
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
    "eloRating": 1491,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 137,
    "simulatedLosses": 115,
    "simulatedWinRate": 0.5437
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
    "eloRating": 1489,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 128,
    "simulatedLosses": 124,
    "simulatedWinRate": 0.5079,
    "tournamentRankTierV": 43
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
    "eloRating": 1488,
    "eloRd": 20,
    "simulatedGames": 248,
    "simulatedWins": 119,
    "simulatedLosses": 129,
    "simulatedWinRate": 0.4798
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
    "eloRating": 1487,
    "eloRd": 21,
    "simulatedGames": 252,
    "simulatedWins": 143,
    "simulatedLosses": 109,
    "simulatedWinRate": 0.5675
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
    "eloRating": 1487,
    "eloRd": 20,
    "simulatedGames": 256,
    "simulatedWins": 140,
    "simulatedLosses": 116,
    "simulatedWinRate": 0.5469
  },
  {
    "sovereignId": "sov_purple_64_lorde_sem_rosto",
    "sovereignName": "Voraghor, O Vazio Gelatinoso",
    "sovereignTitle": "Comandante Regional • Baluarte — Cripta dos Juramentos",
    "realmOrigin": "Fossa Submersa da Catedral Afogada",
    "archetypeId": "mono_purple_blood",
    "archetypeName": "Pacto Sanguíneo",
    "archetypeSubtitle": "Mono-Roxo 🩸 • Dreno de Vida & Toque Letal",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "avatarCardId": "purple_64_lorde_sem_rosto",
    "eloRating": 1487,
    "eloRd": 21,
    "simulatedGames": 252,
    "simulatedWins": 131,
    "simulatedLosses": 121,
    "simulatedWinRate": 0.5198
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
    "eloRating": 1484,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 126,
    "simulatedLosses": 118,
    "simulatedWinRate": 0.5164
  },
  {
    "sovereignId": "sov_purple_157_dragao_sombra_abissal",
    "sovereignName": "Monarca dos Três Crânios",
    "sovereignTitle": "Grão-Soberano • Altar Tríplice da Catedral de Obsidiana",
    "realmOrigin": "Catedral-Necrópole de Nocturnus",
    "archetypeId": "mono_purple_blood",
    "archetypeName": "Pacto Sanguíneo",
    "archetypeSubtitle": "Mono-Roxo 🩸 • Dreno de Vida & Toque Letal",
    "skillTier": 5,
    "isGrandSovereign": true,
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "avatarCardId": "purple_157_dragao_sombra_abissal",
    "eloRating": 1483,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 135,
    "simulatedLosses": 117,
    "simulatedWinRate": 0.5357
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
    "eloRating": 1483,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 117,
    "simulatedLosses": 127,
    "simulatedWinRate": 0.4795
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
    "eloRating": 1482,
    "eloRd": 20,
    "simulatedGames": 256,
    "simulatedWins": 127,
    "simulatedLosses": 129,
    "simulatedWinRate": 0.4961
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
    "eloRating": 1477,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 134,
    "simulatedLosses": 118,
    "simulatedWinRate": 0.5317
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
    "eloRating": 1477,
    "eloRd": 20,
    "simulatedGames": 248,
    "simulatedWins": 126,
    "simulatedLosses": 122,
    "simulatedWinRate": 0.5081
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
    "eloRating": 1475,
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
    "eloRating": 1474,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 127,
    "simulatedLosses": 121,
    "simulatedWinRate": 0.5121
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
    "eloRating": 1471,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 127,
    "simulatedLosses": 117,
    "simulatedWinRate": 0.5205
  },
  {
    "sovereignId": "sov_purple_22_orbe_necrotico",
    "sovereignName": "Crânio Arcano da Morte",
    "sovereignTitle": "Comandante Regional • Cripta dos Juramentos",
    "realmOrigin": "Fossa Submersa da Catedral Afogada",
    "archetypeId": "mono_purple_crypt",
    "archetypeName": "Culto da Cripta",
    "archetypeSubtitle": "Mono-Roxo 💀 • Renascer & Reanimação",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "avatarCardId": "purple_22_orbe_necrotico",
    "eloRating": 1467,
    "eloRd": 20,
    "simulatedGames": 248,
    "simulatedWins": 127,
    "simulatedLosses": 121,
    "simulatedWinRate": 0.5121
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
    "eloRating": 1466,
    "eloRd": 20,
    "simulatedGames": 256,
    "simulatedWins": 125,
    "simulatedLosses": 131,
    "simulatedWinRate": 0.4883
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
    "eloRating": 1460,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 131,
    "simulatedLosses": 121,
    "simulatedWinRate": 0.5198
  },
  {
    "sovereignId": "sov_purple_117_conde_nosferatu",
    "sovereignName": "Nosferatu, Monarca Carmesim",
    "sovereignTitle": "Comandante Regional • Ponte do Ossário",
    "realmOrigin": "Catedral-Necrópole de Nocturnus",
    "archetypeId": "mono_purple_crypt",
    "archetypeName": "Culto da Cripta",
    "archetypeSubtitle": "Mono-Roxo 💀 • Renascer & Reanimação",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "avatarCardId": "purple_117_conde_nosferatu",
    "eloRating": 1460,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 125,
    "simulatedLosses": 127,
    "simulatedWinRate": 0.496
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
    "eloRating": 1456,
    "eloRd": 20,
    "simulatedGames": 248,
    "simulatedWins": 124,
    "simulatedLosses": 124,
    "simulatedWinRate": 0.5
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
    "eloRating": 1453,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 122,
    "simulatedLosses": 126,
    "simulatedWinRate": 0.4919
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
    "eloRating": 1452,
    "eloRd": 21,
    "simulatedGames": 252,
    "simulatedWins": 135,
    "simulatedLosses": 117,
    "simulatedWinRate": 0.5357
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
    "eloRating": 1450,
    "eloRd": 20,
    "simulatedGames": 252,
    "simulatedWins": 123,
    "simulatedLosses": 129,
    "simulatedWinRate": 0.4881
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
    "eloRating": 1447,
    "eloRd": 21,
    "simulatedGames": 252,
    "simulatedWins": 135,
    "simulatedLosses": 117,
    "simulatedWinRate": 0.5357
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
    "eloRating": 1442,
    "eloRd": 20,
    "simulatedGames": 256,
    "simulatedWins": 124,
    "simulatedLosses": 132,
    "simulatedWinRate": 0.4844
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
    "eloRating": 1441,
    "eloRd": 21,
    "simulatedGames": 252,
    "simulatedWins": 134,
    "simulatedLosses": 118,
    "simulatedWinRate": 0.5317
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
    "eloRating": 1440,
    "eloRd": 21,
    "simulatedGames": 252,
    "simulatedWins": 126,
    "simulatedLosses": 126,
    "simulatedWinRate": 0.5
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
    "eloRating": 1439,
    "eloRd": 21,
    "simulatedGames": 252,
    "simulatedWins": 140,
    "simulatedLosses": 112,
    "simulatedWinRate": 0.5556
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
    "simulatedWins": 128,
    "simulatedLosses": 124,
    "simulatedWinRate": 0.5079
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
    "eloRating": 1435,
    "eloRd": 21,
    "simulatedGames": 252,
    "simulatedWins": 127,
    "simulatedLosses": 125,
    "simulatedWinRate": 0.504
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
    "eloRating": 1432,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 118,
    "simulatedLosses": 130,
    "simulatedWinRate": 0.4758
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
    "eloRating": 1430,
    "eloRd": 21,
    "simulatedGames": 252,
    "simulatedWins": 134,
    "simulatedLosses": 118,
    "simulatedWinRate": 0.5317
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
    "eloRating": 1430,
    "eloRd": 20,
    "simulatedGames": 256,
    "simulatedWins": 123,
    "simulatedLosses": 133,
    "simulatedWinRate": 0.4805
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
    "eloRating": 1428,
    "eloRd": 21,
    "simulatedGames": 252,
    "simulatedWins": 133,
    "simulatedLosses": 119,
    "simulatedWinRate": 0.5278
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
    "eloRating": 1425,
    "eloRd": 21,
    "simulatedGames": 252,
    "simulatedWins": 114,
    "simulatedLosses": 138,
    "simulatedWinRate": 0.4524
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
    "eloRating": 1422,
    "eloRd": 21,
    "simulatedGames": 252,
    "simulatedWins": 138,
    "simulatedLosses": 114,
    "simulatedWinRate": 0.5476
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
    "eloRating": 1420,
    "eloRd": 21,
    "simulatedGames": 252,
    "simulatedWins": 129,
    "simulatedLosses": 123,
    "simulatedWinRate": 0.5119
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
    "eloRating": 1420,
    "eloRd": 21,
    "simulatedGames": 252,
    "simulatedWins": 123,
    "simulatedLosses": 129,
    "simulatedWinRate": 0.4881
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
    "eloRating": 1420,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 117,
    "simulatedLosses": 131,
    "simulatedWinRate": 0.4718
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
    "eloRating": 1414,
    "eloRd": 21,
    "simulatedGames": 252,
    "simulatedWins": 127,
    "simulatedLosses": 125,
    "simulatedWinRate": 0.504
  },
  {
    "sovereignId": "sov_purple_82_senhor_malogro",
    "sovereignName": "Nihil-Vael, Devorador de Linhas do Tempo",
    "sovereignTitle": "Grão-Soberano • Abismo Horológico do Oeste",
    "realmOrigin": "Vale do Eclipse — Oeste Profundo",
    "archetypeId": "mono_purple_blood",
    "archetypeName": "Pacto Sanguíneo",
    "archetypeSubtitle": "Mono-Roxo 🩸 • Dreno de Vida & Toque Letal",
    "skillTier": 3,
    "isGrandSovereign": true,
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "avatarCardId": "purple_82_senhor_malogro",
    "eloRating": 1412,
    "eloRd": 21,
    "simulatedGames": 252,
    "simulatedWins": 134,
    "simulatedLosses": 118,
    "simulatedWinRate": 0.5317
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
    "eloRating": 1409,
    "eloRd": 21,
    "simulatedGames": 252,
    "simulatedWins": 126,
    "simulatedLosses": 126,
    "simulatedWinRate": 0.5
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
    "eloRating": 1400,
    "eloRd": 21,
    "simulatedGames": 252,
    "simulatedWins": 124,
    "simulatedLosses": 128,
    "simulatedWinRate": 0.4921
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
    "eloRating": 1398,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 124,
    "simulatedLosses": 124,
    "simulatedWinRate": 0.5
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
    "eloRating": 1394,
    "eloRd": 21,
    "simulatedGames": 252,
    "simulatedWins": 127,
    "simulatedLosses": 125,
    "simulatedWinRate": 0.504
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
    "eloRating": 1382,
    "eloRd": 21,
    "simulatedGames": 252,
    "simulatedWins": 130,
    "simulatedLosses": 122,
    "simulatedWinRate": 0.5159
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
    "eloRating": 1374,
    "eloRd": 21,
    "simulatedGames": 252,
    "simulatedWins": 131,
    "simulatedLosses": 121,
    "simulatedWinRate": 0.5198
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
    "eloRating": 1373,
    "eloRd": 21,
    "simulatedGames": 252,
    "simulatedWins": 127,
    "simulatedLosses": 125,
    "simulatedWinRate": 0.504
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
    "eloRating": 1371,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 127,
    "simulatedLosses": 121,
    "simulatedWinRate": 0.5121
  },
  {
    "sovereignId": "sov_purple_136_dragao_espectral_abismo",
    "sovereignName": "Dragão Espectral do Abismo",
    "sovereignTitle": "Comandante Regional • Atalaia — Ponte do Ossário",
    "realmOrigin": "Catedral-Necrópole de Nocturnus",
    "archetypeId": "mono_purple_blood",
    "archetypeName": "Pacto Sanguíneo",
    "archetypeSubtitle": "Mono-Roxo 🩸 • Dreno de Vida & Toque Letal",
    "skillTier": 3,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "avatarCardId": "purple_136_dragao_espectral_abismo",
    "eloRating": 1362,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 129,
    "simulatedLosses": 119,
    "simulatedWinRate": 0.5202
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
    "eloRating": 1360,
    "eloRd": 21,
    "simulatedGames": 252,
    "simulatedWins": 132,
    "simulatedLosses": 120,
    "simulatedWinRate": 0.5238
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
    "eloRating": 1356,
    "eloRd": 21,
    "simulatedGames": 240,
    "simulatedWins": 120,
    "simulatedLosses": 120,
    "simulatedWinRate": 0.5
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
    "eloRating": 1352,
    "eloRd": 21,
    "simulatedGames": 252,
    "simulatedWins": 127,
    "simulatedLosses": 125,
    "simulatedWinRate": 0.504
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
    "eloRating": 1330,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 117,
    "simulatedLosses": 131,
    "simulatedWinRate": 0.4718
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
    "eloRating": 1327,
    "eloRd": 21,
    "simulatedGames": 252,
    "simulatedWins": 126,
    "simulatedLosses": 126,
    "simulatedWinRate": 0.5
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
    "eloRating": 1326,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 119,
    "simulatedLosses": 125,
    "simulatedWinRate": 0.4877
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
    "eloRating": 1323,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 126,
    "simulatedLosses": 122,
    "simulatedWinRate": 0.5081
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
    "eloRating": 1322,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 131,
    "simulatedLosses": 117,
    "simulatedWinRate": 0.5282
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
    "eloRating": 1319,
    "eloRd": 21,
    "simulatedGames": 240,
    "simulatedWins": 126,
    "simulatedLosses": 114,
    "simulatedWinRate": 0.525
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
    "eloRating": 1313,
    "eloRd": 21,
    "simulatedGames": 252,
    "simulatedWins": 113,
    "simulatedLosses": 139,
    "simulatedWinRate": 0.4484
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
    "eloRating": 1309,
    "eloRd": 21,
    "simulatedGames": 236,
    "simulatedWins": 115,
    "simulatedLosses": 121,
    "simulatedWinRate": 0.4873
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
    "eloRating": 1304,
    "eloRd": 20,
    "simulatedGames": 260,
    "simulatedWins": 120,
    "simulatedLosses": 140,
    "simulatedWinRate": 0.4615
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
    "eloRating": 1301,
    "eloRd": 21,
    "simulatedGames": 240,
    "simulatedWins": 132,
    "simulatedLosses": 108,
    "simulatedWinRate": 0.55
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
    "eloRating": 1295,
    "eloRd": 21,
    "simulatedGames": 240,
    "simulatedWins": 117,
    "simulatedLosses": 123,
    "simulatedWinRate": 0.4875
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
    "eloRating": 1291,
    "eloRd": 21,
    "simulatedGames": 252,
    "simulatedWins": 123,
    "simulatedLosses": 129,
    "simulatedWinRate": 0.4881
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
    "eloRating": 1288,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 122,
    "simulatedLosses": 126,
    "simulatedWinRate": 0.4919
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
    "eloRating": 1283,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 132,
    "simulatedLosses": 116,
    "simulatedWinRate": 0.5323
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
    "eloRating": 1279,
    "eloRd": 21,
    "simulatedGames": 252,
    "simulatedWins": 116,
    "simulatedLosses": 136,
    "simulatedWinRate": 0.4603
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
    "eloRating": 1271,
    "eloRd": 21,
    "simulatedGames": 240,
    "simulatedWins": 113,
    "simulatedLosses": 127,
    "simulatedWinRate": 0.4708
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
    "eloRating": 1263,
    "eloRd": 21,
    "simulatedGames": 240,
    "simulatedWins": 110,
    "simulatedLosses": 130,
    "simulatedWinRate": 0.4583
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
    "eloRating": 1261,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 113,
    "simulatedLosses": 135,
    "simulatedWinRate": 0.4556
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
    "eloRating": 1260,
    "eloRd": 21,
    "simulatedGames": 240,
    "simulatedWins": 118,
    "simulatedLosses": 122,
    "simulatedWinRate": 0.4917
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
    "eloRating": 1259,
    "eloRd": 21,
    "simulatedGames": 240,
    "simulatedWins": 125,
    "simulatedLosses": 115,
    "simulatedWinRate": 0.5208
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
    "eloRating": 1258,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 122,
    "simulatedLosses": 122,
    "simulatedWinRate": 0.5
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
    "eloRating": 1251,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 119,
    "simulatedLosses": 125,
    "simulatedWinRate": 0.4877
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
    "eloRating": 1248,
    "eloRd": 21,
    "simulatedGames": 236,
    "simulatedWins": 114,
    "simulatedLosses": 122,
    "simulatedWinRate": 0.4831
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
    "eloRating": 1241,
    "eloRd": 21,
    "simulatedGames": 240,
    "simulatedWins": 123,
    "simulatedLosses": 117,
    "simulatedWinRate": 0.5125
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
    "eloRating": 1237,
    "eloRd": 21,
    "simulatedGames": 236,
    "simulatedWins": 121,
    "simulatedLosses": 115,
    "simulatedWinRate": 0.5127
  },
  {
    "sovereignId": "sov_purple_118_serafim_caido",
    "sovereignName": "Serafim Caído do Vazio",
    "sovereignTitle": "Capitão da Ordem • Reduto — Capela das Sombras",
    "realmOrigin": "Fossa Submersa da Catedral Afogada",
    "archetypeId": "mono_purple_blood",
    "archetypeName": "Pacto Sanguíneo",
    "archetypeSubtitle": "Mono-Roxo 🩸 • Dreno de Vida & Toque Letal",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "avatarCardId": "purple_118_serafim_caido",
    "eloRating": 1233,
    "eloRd": 21,
    "simulatedGames": 236,
    "simulatedWins": 127,
    "simulatedLosses": 109,
    "simulatedWinRate": 0.5381
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
    "eloRating": 1233,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 117,
    "simulatedLosses": 127,
    "simulatedWinRate": 0.4795
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
    "eloRating": 1231,
    "eloRd": 21,
    "simulatedGames": 236,
    "simulatedWins": 123,
    "simulatedLosses": 113,
    "simulatedWinRate": 0.5212
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
    "eloRating": 1229,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 118,
    "simulatedLosses": 126,
    "simulatedWinRate": 0.4836
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
    "eloRating": 1223,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 115,
    "simulatedLosses": 133,
    "simulatedWinRate": 0.4637
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
    "eloRating": 1222,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 115,
    "simulatedLosses": 133,
    "simulatedWinRate": 0.4637
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
    "eloRating": 1222,
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
    "eloRating": 1218,
    "eloRd": 21,
    "simulatedGames": 240,
    "simulatedWins": 109,
    "simulatedLosses": 131,
    "simulatedWinRate": 0.4542
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
    "eloRating": 1212,
    "eloRd": 21,
    "simulatedGames": 236,
    "simulatedWins": 116,
    "simulatedLosses": 120,
    "simulatedWinRate": 0.4915
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
    "eloRating": 1212,
    "eloRd": 21,
    "simulatedGames": 236,
    "simulatedWins": 113,
    "simulatedLosses": 123,
    "simulatedWinRate": 0.4788
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
    "eloRating": 1212,
    "eloRd": 21,
    "simulatedGames": 248,
    "simulatedWins": 109,
    "simulatedLosses": 139,
    "simulatedWinRate": 0.4395
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
    "eloRating": 1211,
    "eloRd": 21,
    "simulatedGames": 240,
    "simulatedWins": 119,
    "simulatedLosses": 121,
    "simulatedWinRate": 0.4958
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
    "eloRating": 1210,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 108,
    "simulatedLosses": 136,
    "simulatedWinRate": 0.4426
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
    "eloRating": 1201,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 118,
    "simulatedLosses": 126,
    "simulatedWinRate": 0.4836
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
    "eloRating": 1200,
    "eloRd": 21,
    "simulatedGames": 236,
    "simulatedWins": 117,
    "simulatedLosses": 119,
    "simulatedWinRate": 0.4958
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
    "eloRating": 1198,
    "eloRd": 21,
    "simulatedGames": 240,
    "simulatedWins": 122,
    "simulatedLosses": 118,
    "simulatedWinRate": 0.5083
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
    "eloRating": 1195,
    "eloRd": 21,
    "simulatedGames": 240,
    "simulatedWins": 118,
    "simulatedLosses": 122,
    "simulatedWinRate": 0.4917
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
    "eloRating": 1193,
    "eloRd": 21,
    "simulatedGames": 236,
    "simulatedWins": 127,
    "simulatedLosses": 109,
    "simulatedWinRate": 0.5381
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
    "eloRating": 1192,
    "eloRd": 21,
    "simulatedGames": 240,
    "simulatedWins": 113,
    "simulatedLosses": 127,
    "simulatedWinRate": 0.4708
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
    "eloRating": 1188,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 106,
    "simulatedLosses": 138,
    "simulatedWinRate": 0.4344
  },
  {
    "sovereignId": "sov_purple_169_pressagio_revoada_abismo",
    "sovereignName": "Presságio da Revoada Umbral",
    "sovereignTitle": "Capitão da Ordem • Garganta do Crepúsculo",
    "realmOrigin": "Vale do Eclipse — Oeste Profundo",
    "archetypeId": "mono_purple_blood",
    "archetypeName": "Pacto Sanguíneo",
    "archetypeSubtitle": "Mono-Roxo 🩸 • Dreno de Vida & Toque Letal",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "avatarCardId": "purple_169_pressagio_revoada_abismo",
    "eloRating": 1186,
    "eloRd": 21,
    "simulatedGames": 232,
    "simulatedWins": 122,
    "simulatedLosses": 110,
    "simulatedWinRate": 0.5259
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
    "eloRating": 1178,
    "eloRd": 21,
    "simulatedGames": 236,
    "simulatedWins": 120,
    "simulatedLosses": 116,
    "simulatedWinRate": 0.5085
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
    "eloRating": 1178,
    "eloRd": 21,
    "simulatedGames": 232,
    "simulatedWins": 117,
    "simulatedLosses": 115,
    "simulatedWinRate": 0.5043
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
    "eloRating": 1175,
    "eloRd": 21,
    "simulatedGames": 240,
    "simulatedWins": 110,
    "simulatedLosses": 130,
    "simulatedWinRate": 0.4583
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
    "eloRating": 1169,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 122,
    "simulatedLosses": 122,
    "simulatedWinRate": 0.5
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
    "eloRating": 1167,
    "eloRd": 22,
    "simulatedGames": 224,
    "simulatedWins": 111,
    "simulatedLosses": 113,
    "simulatedWinRate": 0.4955
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
    "eloRating": 1164,
    "eloRd": 21,
    "simulatedGames": 244,
    "simulatedWins": 111,
    "simulatedLosses": 133,
    "simulatedWinRate": 0.4549
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
    "eloRating": 1163,
    "eloRd": 21,
    "simulatedGames": 236,
    "simulatedWins": 114,
    "simulatedLosses": 122,
    "simulatedWinRate": 0.4831
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
    "eloRating": 1162,
    "eloRd": 21,
    "simulatedGames": 252,
    "simulatedWins": 118,
    "simulatedLosses": 134,
    "simulatedWinRate": 0.4683
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
    "eloRating": 1159,
    "eloRd": 21,
    "simulatedGames": 232,
    "simulatedWins": 105,
    "simulatedLosses": 127,
    "simulatedWinRate": 0.4526
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
    "eloRating": 1155,
    "eloRd": 21,
    "simulatedGames": 240,
    "simulatedWins": 119,
    "simulatedLosses": 121,
    "simulatedWinRate": 0.4958
  },
  {
    "sovereignId": "sov_purple_45_dragao_sombras",
    "sovereignName": "Nyxarion, o Dragão do Eclipse",
    "sovereignTitle": "Capitão da Ordem • Ponte do Ossário",
    "realmOrigin": "Fossa Submersa da Catedral Afogada",
    "archetypeId": "mono_purple_crypt",
    "archetypeName": "Culto da Cripta",
    "archetypeSubtitle": "Mono-Roxo 💀 • Renascer & Reanimação",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "avatarCardId": "purple_45_dragao_sombras",
    "eloRating": 1155,
    "eloRd": 21,
    "simulatedGames": 240,
    "simulatedWins": 117,
    "simulatedLosses": 123,
    "simulatedWinRate": 0.4875
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
    "eloRating": 1150,
    "eloRd": 21,
    "simulatedGames": 236,
    "simulatedWins": 110,
    "simulatedLosses": 126,
    "simulatedWinRate": 0.4661
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
    "eloRating": 1146,
    "eloRd": 22,
    "simulatedGames": 232,
    "simulatedWins": 103,
    "simulatedLosses": 129,
    "simulatedWinRate": 0.444
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
    "eloRating": 1144,
    "eloRd": 22,
    "simulatedGames": 232,
    "simulatedWins": 110,
    "simulatedLosses": 122,
    "simulatedWinRate": 0.4741
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
    "eloRating": 1143,
    "eloRd": 22,
    "simulatedGames": 228,
    "simulatedWins": 114,
    "simulatedLosses": 114,
    "simulatedWinRate": 0.5
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
    "eloRating": 1134,
    "eloRd": 22,
    "simulatedGames": 224,
    "simulatedWins": 108,
    "simulatedLosses": 116,
    "simulatedWinRate": 0.4821
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
    "eloRating": 1131,
    "eloRd": 22,
    "simulatedGames": 224,
    "simulatedWins": 107,
    "simulatedLosses": 117,
    "simulatedWinRate": 0.4777
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
    "eloRating": 1109,
    "eloRd": 22,
    "simulatedGames": 220,
    "simulatedWins": 103,
    "simulatedLosses": 117,
    "simulatedWinRate": 0.4682
  },
  {
    "sovereignId": "sov_purple_06_tirano_ocular",
    "sovereignName": "Serafim dos Anéis Abissais",
    "sovereignTitle": "Capitão da Ordem • Cripta dos Juramentos",
    "realmOrigin": "Vale do Eclipse — Oeste Profundo",
    "archetypeId": "mono_purple_crypt",
    "archetypeName": "Culto da Cripta",
    "archetypeSubtitle": "Mono-Roxo 💀 • Renascer & Reanimação",
    "skillTier": 2,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "avatarCardId": "purple_06_tirano_ocular",
    "eloRating": 1108,
    "eloRd": 22,
    "simulatedGames": 224,
    "simulatedWins": 113,
    "simulatedLosses": 111,
    "simulatedWinRate": 0.5045
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
    "eloRating": 1108,
    "eloRd": 22,
    "simulatedGames": 236,
    "simulatedWins": 105,
    "simulatedLosses": 131,
    "simulatedWinRate": 0.4449
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
    "eloRating": 1106,
    "eloRd": 22,
    "simulatedGames": 228,
    "simulatedWins": 106,
    "simulatedLosses": 122,
    "simulatedWinRate": 0.4649
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
    "eloRating": 1104,
    "eloRd": 22,
    "simulatedGames": 220,
    "simulatedWins": 114,
    "simulatedLosses": 106,
    "simulatedWinRate": 0.5182
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
    "eloRating": 1101,
    "eloRd": 22,
    "simulatedGames": 232,
    "simulatedWins": 111,
    "simulatedLosses": 121,
    "simulatedWinRate": 0.4784
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
    "eloRating": 1101,
    "eloRd": 22,
    "simulatedGames": 228,
    "simulatedWins": 107,
    "simulatedLosses": 121,
    "simulatedWinRate": 0.4693
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
    "eloRating": 1100,
    "eloRd": 22,
    "simulatedGames": 232,
    "simulatedWins": 100,
    "simulatedLosses": 132,
    "simulatedWinRate": 0.431
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
    "eloRating": 1098,
    "eloRd": 22,
    "simulatedGames": 224,
    "simulatedWins": 102,
    "simulatedLosses": 122,
    "simulatedWinRate": 0.4554
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
    "eloRating": 1090,
    "eloRd": 22,
    "simulatedGames": 216,
    "simulatedWins": 110,
    "simulatedLosses": 106,
    "simulatedWinRate": 0.5093
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
    "eloRating": 1088,
    "eloRd": 22,
    "simulatedGames": 220,
    "simulatedWins": 106,
    "simulatedLosses": 114,
    "simulatedWinRate": 0.4818
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
    "eloRating": 1079,
    "eloRd": 22,
    "simulatedGames": 228,
    "simulatedWins": 109,
    "simulatedLosses": 119,
    "simulatedWinRate": 0.4781
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
    "eloRating": 1076,
    "eloRd": 22,
    "simulatedGames": 220,
    "simulatedWins": 101,
    "simulatedLosses": 119,
    "simulatedWinRate": 0.4591
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
    "eloRating": 1041,
    "eloRd": 23,
    "simulatedGames": 212,
    "simulatedWins": 96,
    "simulatedLosses": 116,
    "simulatedWinRate": 0.4528
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
    "eloRating": 1030,
    "eloRd": 23,
    "simulatedGames": 208,
    "simulatedWins": 93,
    "simulatedLosses": 115,
    "simulatedWinRate": 0.4471
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
    "eloRating": 1016,
    "eloRd": 23,
    "simulatedGames": 212,
    "simulatedWins": 100,
    "simulatedLosses": 112,
    "simulatedWinRate": 0.4717
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
    "eloRating": 1012,
    "eloRd": 22,
    "simulatedGames": 220,
    "simulatedWins": 87,
    "simulatedLosses": 133,
    "simulatedWinRate": 0.3955
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
    "eloRating": 1006,
    "eloRd": 23,
    "simulatedGames": 208,
    "simulatedWins": 93,
    "simulatedLosses": 115,
    "simulatedWinRate": 0.4471
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
    "eloRating": 986,
    "eloRd": 22,
    "simulatedGames": 216,
    "simulatedWins": 95,
    "simulatedLosses": 121,
    "simulatedWinRate": 0.4398
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
    "eloRating": 982,
    "eloRd": 23,
    "simulatedGames": 200,
    "simulatedWins": 97,
    "simulatedLosses": 103,
    "simulatedWinRate": 0.485
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
    "eloRating": 977,
    "eloRd": 23,
    "simulatedGames": 208,
    "simulatedWins": 100,
    "simulatedLosses": 108,
    "simulatedWinRate": 0.4808
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
    "eloRating": 971,
    "eloRd": 23,
    "simulatedGames": 212,
    "simulatedWins": 87,
    "simulatedLosses": 125,
    "simulatedWinRate": 0.4104
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
    "eloRating": 946,
    "eloRd": 24,
    "simulatedGames": 196,
    "simulatedWins": 87,
    "simulatedLosses": 109,
    "simulatedWinRate": 0.4439
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
    "eloRating": 946,
    "eloRd": 24,
    "simulatedGames": 192,
    "simulatedWins": 81,
    "simulatedLosses": 111,
    "simulatedWinRate": 0.4219
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
    "eloRating": 942,
    "eloRd": 23,
    "simulatedGames": 212,
    "simulatedWins": 78,
    "simulatedLosses": 134,
    "simulatedWinRate": 0.3679
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
    "eloRating": 941,
    "eloRd": 24,
    "simulatedGames": 196,
    "simulatedWins": 90,
    "simulatedLosses": 106,
    "simulatedWinRate": 0.4592
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
    "eloRating": 933,
    "eloRd": 23,
    "simulatedGames": 208,
    "simulatedWins": 88,
    "simulatedLosses": 120,
    "simulatedWinRate": 0.4231
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
    "eloRating": 933,
    "eloRd": 24,
    "simulatedGames": 200,
    "simulatedWins": 75,
    "simulatedLosses": 125,
    "simulatedWinRate": 0.375
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
    "eloRating": 923,
    "eloRd": 23,
    "simulatedGames": 204,
    "simulatedWins": 85,
    "simulatedLosses": 119,
    "simulatedWinRate": 0.4167
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
    "eloRating": 912,
    "eloRd": 24,
    "simulatedGames": 192,
    "simulatedWins": 79,
    "simulatedLosses": 113,
    "simulatedWinRate": 0.4115
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
    "eloRating": 899,
    "eloRd": 24,
    "simulatedGames": 196,
    "simulatedWins": 78,
    "simulatedLosses": 118,
    "simulatedWinRate": 0.398
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
    "eloRating": 860,
    "eloRd": 24,
    "simulatedGames": 184,
    "simulatedWins": 71,
    "simulatedLosses": 113,
    "simulatedWinRate": 0.3859
  },
  {
    "sovereignId": "sov_purple_80_necromante_entropia",
    "sovereignName": "Lich da Entropia Temporal",
    "sovereignTitle": "Sentinela de Fronteira • Baluarte — Capela das Sombras",
    "realmOrigin": "Vale do Eclipse — Oeste Profundo",
    "archetypeId": "mono_purple_blood",
    "archetypeName": "Pacto Sanguíneo",
    "archetypeSubtitle": "Mono-Roxo 🩸 • Dreno de Vida & Toque Letal",
    "skillTier": 1,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "avatarCardId": "purple_80_necromante_entropia",
    "eloRating": 860,
    "eloRd": 24,
    "simulatedGames": 184,
    "simulatedWins": 68,
    "simulatedLosses": 116,
    "simulatedWinRate": 0.3696
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
    "eloRating": 855,
    "eloRd": 24,
    "simulatedGames": 196,
    "simulatedWins": 69,
    "simulatedLosses": 127,
    "simulatedWinRate": 0.352
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
    "eloRating": 848,
    "eloRd": 24,
    "simulatedGames": 184,
    "simulatedWins": 71,
    "simulatedLosses": 113,
    "simulatedWinRate": 0.3859
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
    "eloRating": 839,
    "eloRd": 25,
    "simulatedGames": 180,
    "simulatedWins": 70,
    "simulatedLosses": 110,
    "simulatedWinRate": 0.3889
  },
  {
    "sovereignId": "sov_purple_168_tecelao_feixe_abismo",
    "sovereignName": "Tecelão do Feixe Umbral",
    "sovereignTitle": "Sentinela de Fronteira • Reduto — Ponte do Ossário",
    "realmOrigin": "Vale do Eclipse — Oeste Profundo",
    "archetypeId": "mono_purple_blood",
    "archetypeName": "Pacto Sanguíneo",
    "archetypeSubtitle": "Mono-Roxo 🩸 • Dreno de Vida & Toque Letal",
    "skillTier": 1,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "avatarCardId": "purple_168_tecelao_feixe_abismo",
    "eloRating": 803,
    "eloRd": 25,
    "simulatedGames": 176,
    "simulatedWins": 63,
    "simulatedLosses": 113,
    "simulatedWinRate": 0.358
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
    "eloRating": 778,
    "eloRd": 26,
    "simulatedGames": 168,
    "simulatedWins": 61,
    "simulatedLosses": 107,
    "simulatedWinRate": 0.3631
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
    "eloRating": 756,
    "eloRd": 27,
    "simulatedGames": 152,
    "simulatedWins": 48,
    "simulatedLosses": 104,
    "simulatedWinRate": 0.3158
  },
  {
    "sovereignId": "sov_purple_133_ceifador_tumular",
    "sovereignName": "Ceifador Executor Tumular",
    "sovereignTitle": "Sentinela de Fronteira • Altar do Miasma",
    "realmOrigin": "Vale do Eclipse — Oeste Profundo",
    "archetypeId": "mono_purple_crypt",
    "archetypeName": "Culto da Cripta",
    "archetypeSubtitle": "Mono-Roxo 💀 • Renascer & Reanimação",
    "skillTier": 1,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "avatarCardId": "purple_133_ceifador_tumular",
    "eloRating": 755,
    "eloRd": 26,
    "simulatedGames": 172,
    "simulatedWins": 58,
    "simulatedLosses": 114,
    "simulatedWinRate": 0.3372
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
    "eloRating": 739,
    "eloRd": 26,
    "simulatedGames": 176,
    "simulatedWins": 52,
    "simulatedLosses": 124,
    "simulatedWinRate": 0.2955
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
    "eloRating": 700,
    "eloRd": 27,
    "simulatedGames": 160,
    "simulatedWins": 47,
    "simulatedLosses": 113,
    "simulatedWinRate": 0.2938
  },
  {
    "sovereignId": "sov_purple_44_devorador_intelecto",
    "sovereignName": "Espectro Usurpador de Sombras",
    "sovereignTitle": "Sentinela de Fronteira • Ponte do Ossário",
    "realmOrigin": "Vale do Eclipse — Oeste Profundo",
    "archetypeId": "mono_purple_crypt",
    "archetypeName": "Culto da Cripta",
    "archetypeSubtitle": "Mono-Roxo 💀 • Renascer & Reanimação",
    "skillTier": 1,
    "isGrandSovereign": false,
    "format": "monocolor",
    "domains": [
      "purple"
    ],
    "avatarCardId": "purple_44_devorador_intelecto",
    "eloRating": 655,
    "eloRd": 28,
    "simulatedGames": 148,
    "simulatedWins": 39,
    "simulatedLosses": 109,
    "simulatedWinRate": 0.2635
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
    "eloRating": 648,
    "eloRd": 30,
    "simulatedGames": 132,
    "simulatedWins": 32,
    "simulatedLosses": 100,
    "simulatedWinRate": 0.2424
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
    "eloRating": 632,
    "eloRd": 29,
    "simulatedGames": 144,
    "simulatedWins": 33,
    "simulatedLosses": 111,
    "simulatedWinRate": 0.2292
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
    "eloRating": 629,
    "eloRd": 28,
    "simulatedGames": 164,
    "simulatedWins": 36,
    "simulatedLosses": 128,
    "simulatedWinRate": 0.2195
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
    "eloRating": 520,
    "eloRd": 31,
    "simulatedGames": 144,
    "simulatedWins": 20,
    "simulatedLosses": 124,
    "simulatedWinRate": 0.1389
  }
];
