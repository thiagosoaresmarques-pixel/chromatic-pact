import {
  MONOCOLOR_ARCHETYPE_MASTERY,
  MonocolorArchetypeId,
} from './aiMonocolorMasteryData';
import {
  BICOLOR_ARCHETYPE_MASTERY,
  BicolorArchetypeId,
  resolveBicolorArchetypeForDeckId,
} from './aiBicolorMastery';
import {
  POLYCOLOR_ARCHETYPE_MASTERY,
  PolycolorArchetypeId,
  resolvePolycolorArchetypeForDeckId,
} from './aiPolycolorMastery';
import {
  UNIFIED_CHAMPION_STANDINGS,
  UNIFIED_MATCHUP_MATRIX,
  UNIFIED_TOURNAMENT_SUMMARY,
  UnifiedChampionId,
  UnifiedChampionStanding,
  UnifiedFormatKind,
} from './aiUnifiedTournamentData';

export * from './aiUnifiedTournamentData';

const CLASSIC_DECK_FALLBACK_TO_UNIFIED: Record<string, UnifiedChampionId> = {
  deck_red_inferno: 'mono_red_dragon',
  deck_blue_tempest: 'mono_blue_frost',
  deck_purple_abyss: 'mono_purple_crypt',
  deck_green_wild: 'mono_green_colossus',
  deck_gold_bastion: 'mono_gold_phalanx',
  deck_spec_chronomancer: 'dual_blue_gold',
  deck_squad_thousand_shields: 'dual_green_gold',
  deck_squad_siege_battery: 'dual_red_blue',
};

const STANDINGS_BY_ID: Record<UnifiedChampionId, UnifiedChampionStanding> = (() => {
  const map = {} as Record<UnifiedChampionId, UnifiedChampionStanding>;
  for (const st of UNIFIED_CHAMPION_STANDINGS) {
    map[st.archetypeId] = st;
  }
  return map;
})();

export const UNIFIED_FORMAT_LABELS: Record<UnifiedFormatKind, string> = {
  monocolor: '1 Cor • Monocolor',
  bicolor: '2 Cores • Pacto Bicolor',
  tricolor: '3 Cores • Tríade / Cataclismo',
  pentachromatic: '5 Cores • Soberano Pentacromático',
};

export function resolveUnifiedChampionIdForDeckId(
  deckId: string | undefined
): UnifiedChampionId | undefined {
  if (!deckId) return undefined;
  if (deckId in MONOCOLOR_ARCHETYPE_MASTERY) {
    return deckId as MonocolorArchetypeId;
  }
  if (deckId in BICOLOR_ARCHETYPE_MASTERY) {
    return deckId as BicolorArchetypeId;
  }
  if (deckId in POLYCOLOR_ARCHETYPE_MASTERY) {
    return deckId as PolycolorArchetypeId;
  }
  const bi = resolveBicolorArchetypeForDeckId(deckId);
  if (bi) return bi;
  const poly = resolvePolycolorArchetypeForDeckId(deckId);
  if (poly) return poly;
  return CLASSIC_DECK_FALLBACK_TO_UNIFIED[deckId];
}

export function getUnifiedStandingForDeckId(
  deckId: string | undefined
): UnifiedChampionStanding | undefined {
  const champId = resolveUnifiedChampionIdForDeckId(deckId);
  return champId ? STANDINGS_BY_ID[champId] : undefined;
}

/**
 * Returns empirical win rate (0..100 scale, e.g. 58.3) of `myDeckId` vs `enemyDeckId`
 * from the Grand Unified 44×43 Tier V Tournament, or null if either deck is custom/unmapped.
 */
export function getEmpiricalUnifiedWinRatePct(
  myDeckId: string | undefined,
  enemyDeckId: string | undefined
): number | null {
  const idA = resolveUnifiedChampionIdForDeckId(myDeckId);
  const idB = resolveUnifiedChampionIdForDeckId(enemyDeckId);
  if (!idA || !idB) return null;
  if (idA === idB) return 50;
  const wr = UNIFIED_MATCHUP_MATRIX[idA]?.[idB];
  if (typeof wr !== 'number') return null;
  return Number((wr * 100).toFixed(1));
}

export function getUnifiedTournamentSummary() {
  return UNIFIED_TOURNAMENT_SUMMARY;
}
