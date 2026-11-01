import fs from 'node:fs';
import path from 'node:path';
import {
  BICOLOR_ARCHETYPE_MASTERY,
  MONOCOLOR_ARCHETYPE_MASTERY,
  POLYCOLOR_ARCHETYPE_MASTERY,
} from '../data/aiMonocolorMastery';
import {
  UNIFIED_CHAMPION_STANDINGS,
  UnifiedChampionId,
} from '../data/aiUnifiedTournamentData';
import { CARDS_BY_ID } from '../data/cards';
import {
  CANONICAL_SOVEREIGN_CARD_BY_ARCHETYPE,
  resolveCanonicalGrandSovereignIdentity,
  resolveUniqueRegionalCommanderIdentity,
} from '../data/sovereignCardBindings';
import {
  ARCHETYPE_TIER_ELO_MAP,
  SOVEREIGN_AI_LEADERBOARD_ROSTER,
  SOVEREIGN_ELO_CALIBRATION_SUMMARY,
  SovereignAiLeaderboardEntry,
} from '../data/sovereignEloLadderData';

function updateCoverCardIdsInMasteryFile(relPath: string): number {
  const fullPath = path.resolve(process.cwd(), relPath);
  const original = fs.readFileSync(fullPath, 'utf8');
  let updatedCount = 0;

  // Replace "coverCardId": "..." inside each archetype block tracked by "archetypeId": "<id>"
  const lines = original.split('\n');
  let activeArchId: UnifiedChampionId | null = null;

  for (let i = 0; i < lines.length; i++) {
    const archMatch = lines[i].match(/"archetypeId":\s*"([^"]+)"/);
    if (archMatch) {
      const candidate = archMatch[1] as UnifiedChampionId;
      if (candidate in CANONICAL_SOVEREIGN_CARD_BY_ARCHETYPE) {
        activeArchId = candidate;
      }
    }
    if (activeArchId && lines[i].includes('"coverCardId":')) {
      const targetCard = CANONICAL_SOVEREIGN_CARD_BY_ARCHETYPE[activeArchId];
      const nextLine = lines[i].replace(
        /"coverCardId":\s*"[^"]+"/,
        `"coverCardId": "${targetCard}"`
      );
      if (nextLine !== lines[i]) {
        lines[i] = nextLine;
        updatedCount += 1;
      }
      activeArchId = null;
    }
  }

  fs.writeFileSync(fullPath, lines.join('\n'), 'utf8');
  return updatedCount;
}

function main(): void {
  const monoChanges = updateCoverCardIdsInMasteryFile('src/data/aiMonocolorMasteryData.ts');
  const biChanges = updateCoverCardIdsInMasteryFile('src/data/aiBicolorMasteryData.ts');
  const polyChanges = updateCoverCardIdsInMasteryFile('src/data/aiPolycolorMasteryData.ts');
  const tourChanges = updateCoverCardIdsInMasteryFile('src/data/aiUnifiedTournamentData.ts');

  console.log(
    `Updated coverCardId across mastery/tournament files: mono=${monoChanges}, bi=${biChanges}, poly=${polyChanges}, unified=${tourChanges}`
  );

  const masteryByArch = (id: UnifiedChampionId): any =>
    (MONOCOLOR_ARCHETYPE_MASTERY as any)[id] ||
    (BICOLOR_ARCHETYPE_MASTERY as any)[id] ||
    (POLYCOLOR_ARCHETYPE_MASTERY as any)[id];

  const standingRankByArch = new Map<UnifiedChampionId, number>();
  for (const st of UNIFIED_CHAMPION_STANDINGS) {
    standingRankByArch.set(st.archetypeId, st.rank);
  }

  const usedCardIds = new Set<string>();
  const nextRoster: SovereignAiLeaderboardEntry[] = [];

  // 1. All 44 Grand Sovereigns (Tier V)
  const grandEntries = SOVEREIGN_AI_LEADERBOARD_ROSTER.filter((e) => e.isGrandSovereign);
  for (const prev of grandEntries) {
    const m = masteryByArch(prev.archetypeId);
    const deck5: string[] = m?.tierDecks?.[5]?.cardIds ?? [];
    const ident = resolveCanonicalGrandSovereignIdentity(prev.archetypeId, deck5);
    usedCardIds.add(ident.avatarCardId);

    nextRoster.push({
      ...prev,
      sovereignName: ident.sovereignName,
      sovereignTitle: ident.sovereignTitle,
      realmOrigin: ident.realmOrigin,
      avatarCardId: ident.avatarCardId,
      tournamentRankTierV: standingRankByArch.get(prev.archetypeId) ?? prev.tournamentRankTierV,
    });
  }

  // 2. All 24 Regional Commanders (6 per Tier I–IV), stratified by ELO quantiles so every division (including Ferro & Prata) is continuously populated
  const QUANTILE_INDICES = [3, 11, 18, 25, 33, 40];
  const commanderSeeds: Array<{ tier: 1 | 2 | 3 | 4; st: (typeof UNIFIED_CHAMPION_STANDINGS)[number] }> = [];
  for (const tier of [4, 3, 2, 1] as const) {
    const sortedByTierElo = [...UNIFIED_CHAMPION_STANDINGS].sort(
      (a, b) => ARCHETYPE_TIER_ELO_MAP[a.archetypeId][tier].elo - ARCHETYPE_TIER_ELO_MAP[b.archetypeId][tier].elo
    );
    for (const qIdx of QUANTILE_INDICES) {
      const picked = sortedByTierElo[Math.min(sortedByTierElo.length - 1, qIdx)];
      commanderSeeds.push({ tier, st: picked });
    }
  }
  commanderSeeds.sort(
    (a, b) =>
      ARCHETYPE_TIER_ELO_MAP[b.st.archetypeId][b.tier].elo -
      ARCHETYPE_TIER_ELO_MAP[a.st.archetypeId][a.tier].elo
  );

  for (const { tier, st } of commanderSeeds) {
    const archId = st.archetypeId;
    const cell = ARCHETYPE_TIER_ELO_MAP[archId][tier];
    const m = masteryByArch(archId);
    const deckT: string[] = m?.tierDecks?.[tier]?.cardIds ?? [];
    const ident = resolveUniqueRegionalCommanderIdentity({
      archetypeId: archId,
      skillTier: tier,
      domains: st.domains,
      deckCardIds: deckT,
      usedCardIds,
    });

    nextRoster.push({
      sovereignId: `sov_t${tier}_${archId}`,
      sovereignName: ident.sovereignName,
      sovereignTitle: ident.sovereignTitle,
      realmOrigin: ident.realmOrigin,
      archetypeId: archId,
      archetypeName: st.name,
      archetypeSubtitle: st.subtitle,
      skillTier: tier,
      isGrandSovereign: false,
      format: st.format,
      domains: st.domains,
      avatarCardId: ident.avatarCardId,
      eloRating: cell.elo,
      eloRd: cell.rd,
      simulatedGames: cell.games,
      simulatedWins: cell.wins,
      simulatedLosses: cell.losses,
      simulatedWinRate: cell.winRate,
    });
  }

  nextRoster.sort((a, b) => b.eloRating - a.eloRating || b.simulatedWinRate - a.simulatedWinRate);

  // Strict uniqueness & card-existence assertions
  const uniqueIds = new Set(nextRoster.map((r) => r.avatarCardId));
  const uniqueImages = new Set(nextRoster.map((r) => CARDS_BY_ID[r.avatarCardId]?.imagePath));
  if (uniqueIds.size !== nextRoster.length || uniqueImages.size !== nextRoster.length) {
    throw new Error(
      `Uniqueness check failed: entries=${nextRoster.length}, uniqueIds=${uniqueIds.size}, uniqueImages=${uniqueImages.size}`
    );
  }

  const eloOutPath = path.resolve(process.cwd(), 'src/data/sovereignEloLadderData.ts');
  const eloFileContent = `import { AiSkillTier, Domain } from '../types/game';
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

export const SOVEREIGN_ELO_CALIBRATION_SUMMARY: SovereignEloCalibrationSummary = ${JSON.stringify(
    SOVEREIGN_ELO_CALIBRATION_SUMMARY,
    null,
    2
  )};

export const ARCHETYPE_TIER_ELO_MAP: Record<
  UnifiedChampionId,
  Record<AiSkillTier, CalibratedArchetypeTierCell>
> = ${JSON.stringify(ARCHETYPE_TIER_ELO_MAP, null, 2)};

export const SOVEREIGN_AI_LEADERBOARD_ROSTER: SovereignAiLeaderboardEntry[] = ${JSON.stringify(
    nextRoster,
    null,
    2
  )};
`;

  fs.writeFileSync(eloOutPath, eloFileContent, 'utf8');
  console.log(
    `Successfully updated src/data/sovereignEloLadderData.ts (${nextRoster.length} Sovereigns/Commanders, ${uniqueIds.size}/${nextRoster.length} unique cards & artworks).`
  );
  console.log('Top 5 Podium preview:');
  for (const [idx, e] of nextRoster.slice(0, 5).entries()) {
    console.log(
      `  #${idx + 1} [${e.eloRating} ELO | T${e.skillTier}] ${e.sovereignName} (${e.avatarCardId}) — ${e.archetypeName}`
    );
  }
}

main();
