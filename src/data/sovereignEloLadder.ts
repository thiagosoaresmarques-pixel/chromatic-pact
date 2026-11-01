import { AiSkillTier, CampaignBoss, CardDefinition, Rarity } from '../types/game';
import { CARDS_BY_ID } from './cards';
import { resolveChampionDeckAndProfile } from './aiMonocolorMastery';
import { getUnifiedStandingForDeckId } from './aiUnifiedTournament';
import type { UnifiedChampionId } from './aiUnifiedTournamentData';
import {
  calculateFideRankedEloDelta,
  ELO_DIVISIONS,
  ELO_SCHEMA_VERSION,
  EloDivisionId,
  EloDivisionMeta,
  getEloDivisionMeta,
  getEloDivisionProgressPct,
  INITIAL_PLAYER_ELO,
} from './eloDivisions';
import {
  ARCHETYPE_TIER_ELO_MAP,
  CalibratedArchetypeTierCell,
  SOVEREIGN_AI_LEADERBOARD_ROSTER,
  SOVEREIGN_ELO_CALIBRATION_SUMMARY,
  SovereignAiLeaderboardEntry,
  SovereignEloCalibrationSummary,
} from './sovereignEloLadderData';

export {
  ARCHETYPE_TIER_ELO_MAP,
  calculateFideRankedEloDelta,
  ELO_DIVISIONS,
  ELO_SCHEMA_VERSION,
  getEloDivisionMeta,
  getEloDivisionProgressPct,
  INITIAL_PLAYER_ELO,
  SOVEREIGN_AI_LEADERBOARD_ROSTER,
  SOVEREIGN_ELO_CALIBRATION_SUMMARY,
};
export type {
  CalibratedArchetypeTierCell,
  EloDivisionId,
  EloDivisionMeta,
  SovereignAiLeaderboardEntry,
  SovereignEloCalibrationSummary,
};

/**
 * Resolve o ELO calibrado para qualquer Arquétipo Campeão (44) e grau de maestria (I–V).
 */
export function resolveCalibratedEloForArchetype(
  deckOrArchetypeId: string | null | undefined,
  skillTier: AiSkillTier = 5
): number | null {
  if (!deckOrArchetypeId) return null;
  if (deckOrArchetypeId in ARCHETYPE_TIER_ELO_MAP) {
    return ARCHETYPE_TIER_ELO_MAP[deckOrArchetypeId as UnifiedChampionId]?.[skillTier]?.elo ?? null;
  }
  const standing = getUnifiedStandingForDeckId(deckOrArchetypeId);
  if (standing && ARCHETYPE_TIER_ELO_MAP[standing.archetypeId]) {
    return ARCHETYPE_TIER_ELO_MAP[standing.archetypeId][skillTier]?.elo ?? null;
  }
  return null;
}

const RARITY_RANK: Record<Rarity, number> = {
  legendary: 4,
  rare: 3,
  uncommon: 2,
  common: 1,
};

/**
 * Extrai as cartas principais (assinatura) do grimório oficial de um Soberano,
 * priorizando sua carta de avatar, lendárias e raras de maior impacto.
 */
export function getSignatureCardsForSovereign(
  entry: SovereignAiLeaderboardEntry,
  limit = 8
): CardDefinition[] {
  const resolved = resolveChampionDeckAndProfile(entry.archetypeId, entry.skillTier);
  const cardIds = resolved?.cardIds ?? [];
  const counts = new Map<string, number>();
  for (const cid of cardIds) {
    counts.set(cid, (counts.get(cid) ?? 0) + 1);
  }

  const unique: CardDefinition[] = [];
  for (const cid of counts.keys()) {
    const c = CARDS_BY_ID[cid];
    if (c) unique.push(c);
  }

  const avatarCard = CARDS_BY_ID[entry.avatarCardId];
  if (avatarCard && !counts.has(avatarCard.id)) {
    unique.unshift(avatarCard);
  }

  unique.sort((a, b) => {
    if (a.id === entry.avatarCardId) return -1;
    if (b.id === entry.avatarCardId) return 1;
    const rDiff = RARITY_RANK[b.rarity] - RARITY_RANK[a.rarity];
    if (rDiff !== 0) return rDiff;
    return b.cost - a.cost || a.name.localeCompare(b.name, 'pt-BR');
  });

  return unique.slice(0, limit);
}

/**
 * Encontra o Soberano de ELO mais próximo para pareamento imediato na Fila 1×1,
 * evitando repetir adversários enfrentados recentemente.
 */
export function findClosestRankedSovereignForElo(
  playerElo: number,
  recentOpponentIds: string[] = []
): SovereignAiLeaderboardEntry {
  const recentSet = new Set(recentOpponentIds.slice(-4));
  const candidates = SOVEREIGN_AI_LEADERBOARD_ROSTER.filter(
    (s) => !recentSet.has(s.sovereignId)
  );
  const pool = candidates.length > 0 ? candidates : SOVEREIGN_AI_LEADERBOARD_ROSTER;
  let best = pool[0];
  let bestDiff = Math.abs(best.eloRating - playerElo);
  for (let i = 1; i < pool.length; i++) {
    const d = Math.abs(pool[i].eloRating - playerElo);
    if (d < bestDiff) {
      best = pool[i];
      bestDiff = d;
    }
  }
  return best;
}

/**
 * Constrói um encontro justo e simétrico (40 PV vs 40 PV, sem modificadores externos)
 * para Duelos Ranqueados Oficiais contra qualquer Soberano do Ranking Geral ELO.
 */
export function buildRankedSovereignBossEncounter(
  entry: SovereignAiLeaderboardEntry
): CampaignBoss {
  const resolved = resolveChampionDeckAndProfile(entry.archetypeId, entry.skillTier);
  const standing = getUnifiedStandingForDeckId(entry.archetypeId);
  const fallbackDeckId = standing?.classicDeckIds[0] ?? 'deck_red_inferno';

  return {
    id: `ranked_elo_${entry.sovereignId}`,
    stage: 20,
    name: entry.sovereignName,
    title: `${entry.sovereignTitle} (${entry.eloRating} ELO)`,
    domains: entry.domains,
    startingHp: 40,
    avatarCardId: entry.avatarCardId,
    passiveName: 'Duelo Ranqueado Oficial (40 PV vs 40 PV)',
    passiveDescription: `Confronto oficial simétrico valendo pontuação contra ${entry.realmOrigin} (${entry.eloRating} ELO).`,
    rewardGold: 15,
    loreIntro: `Duelo Ranqueado Oficial pelo Ranking Geral de Vaeloria contra ${entry.sovereignName} (${entry.eloRating} ELO).`,
    deckId: fallbackDeckId,
    archetypeId: entry.archetypeId,
    archetypeTitle: entry.archetypeName,
    difficultyTier: entry.skillTier,
    customDeckCardIds: resolved?.cardIds,
  };
}
