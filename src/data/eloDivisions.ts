export type EloDivisionId =
  | 'ferro_axial'
  | 'prata_fronteira'
  | 'ouro_solar'
  | 'safira_vortex'
  | 'ametista_umbral'
  | 'rubi_draconico'
  | 'grao_mestre_penta';

export interface EloDivisionMeta {
  id: EloDivisionId;
  icon: string;
  label: string;
  shortLabel: string;
  rangeText: string;
  color: string;
  borderRgba: string;
  bgRgba: string;
  minElo: number;
  nextThreshold: number | null;
}

export const ELO_DIVISIONS: EloDivisionMeta[] = [
  {
    id: 'ferro_axial',
    icon: '◆',
    label: 'Ferro Axial',
    shortLabel: 'Ferro',
    rangeText: '< 1050',
    color: '#94a3b8',
    borderRgba: 'rgba(148, 163, 184, 0.45)',
    bgRgba: 'rgba(148, 163, 184, 0.14)',
    minElo: 0,
    nextThreshold: 1050,
  },
  {
    id: 'prata_fronteira',
    icon: '◆',
    label: 'Prata da Fronteira',
    shortLabel: 'Prata',
    rangeText: '1050–1199',
    color: '#cbd5e1',
    borderRgba: 'rgba(203, 213, 225, 0.5)',
    bgRgba: 'rgba(203, 213, 225, 0.15)',
    minElo: 1050,
    nextThreshold: 1200,
  },
  {
    id: 'ouro_solar',
    icon: '◆',
    label: 'Ouro Solar',
    shortLabel: 'Ouro',
    rangeText: '1200–1399',
    color: '#facc15',
    borderRgba: 'rgba(250, 204, 21, 0.55)',
    bgRgba: 'rgba(250, 204, 21, 0.16)',
    minElo: 1200,
    nextThreshold: 1400,
  },
  {
    id: 'safira_vortex',
    icon: '◆',
    label: 'Safira do Vórtex',
    shortLabel: 'Safira',
    rangeText: '1400–1599',
    color: '#38bdf8',
    borderRgba: 'rgba(56, 189, 248, 0.55)',
    bgRgba: 'rgba(56, 189, 248, 0.16)',
    minElo: 1400,
    nextThreshold: 1600,
  },
  {
    id: 'ametista_umbral',
    icon: '◆',
    label: 'Ametista Umbral',
    shortLabel: 'Ametista',
    rangeText: '1600–1799',
    color: '#c084fc',
    borderRgba: 'rgba(192, 132, 252, 0.58)',
    bgRgba: 'rgba(192, 132, 252, 0.17)',
    minElo: 1600,
    nextThreshold: 1800,
  },
  {
    id: 'rubi_draconico',
    icon: '◆',
    label: 'Rubi Dracônico',
    shortLabel: 'Rubi',
    rangeText: '1800–1999',
    color: '#f87171',
    borderRgba: 'rgba(248, 113, 113, 0.6)',
    bgRgba: 'rgba(248, 113, 113, 0.17)',
    minElo: 1800,
    nextThreshold: 2000,
  },
  {
    id: 'grao_mestre_penta',
    icon: '◆',
    label: 'Grão-Mestre Pentacromático',
    shortLabel: 'Grão-Mestre',
    rangeText: '2000+',
    color: '#fde047',
    borderRgba: 'rgba(253, 224, 71, 0.72)',
    bgRgba: 'rgba(253, 224, 71, 0.2)',
    minElo: 2000,
    nextThreshold: null,
  },
];

export function getEloDivisionMeta(elo: number): EloDivisionMeta {
  if (elo >= 2000) return ELO_DIVISIONS[6];
  if (elo >= 1800) return ELO_DIVISIONS[5];
  if (elo >= 1600) return ELO_DIVISIONS[4];
  if (elo >= 1400) return ELO_DIVISIONS[3];
  if (elo >= 1200) return ELO_DIVISIONS[2];
  if (elo >= 1050) return ELO_DIVISIONS[1];
  return ELO_DIVISIONS[0];
}

export function getEloDivisionProgressPct(elo: number): number {
  const div = getEloDivisionMeta(elo);
  if (div.nextThreshold === null) return 100;
  const span = Math.max(1, div.nextThreshold - div.minElo);
  return Math.max(0, Math.min(100, Math.round(((elo - div.minElo) / span) * 100)));
}

export function calculateFideRankedEloDelta(params: {
  playerElo: number;
  opponentElo: number;
  didWin: boolean;
  recentOpponentIds?: string[];
  opponentKey?: string;
}): {
  delta: number;
  kFactorUsed: number;
  expectedWinProb: number;
  repeatCount: number;
} {
  const { playerElo, opponentElo, didWin, recentOpponentIds = [], opponentKey } = params;
  const recentWindow = recentOpponentIds.slice(-5);
  const repeatCount = opponentKey
    ? recentWindow.filter((id) => id === opponentKey).length
    : 0;

  let kFactorUsed = 24;
  if (repeatCount === 1) kFactorUsed = 14;
  else if (repeatCount === 2) kFactorUsed = 8;
  else if (repeatCount >= 3) kFactorUsed = 4;

  const expectedWinProb = 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));
  const actualScore = didWin ? 1 : 0;
  let delta = Math.round(kFactorUsed * (actualScore - expectedWinProb));

  if (didWin && delta === 0 && opponentElo >= playerElo - 500 && repeatCount < 3) {
    delta = 1;
  } else if (!didWin && delta === 0 && opponentElo <= playerElo + 500) {
    delta = -1;
  }

  return {
    delta,
    kFactorUsed,
    expectedWinProb,
    repeatCount,
  };
}
