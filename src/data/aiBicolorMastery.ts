import { AiSkillTier, Domain, PrebuiltDeck } from '../types/game';
import {
  BICOLOR_ARCHETYPE_MASTERY,
  BICOLOR_TRAINING_SUMMARY,
  BICOLOR_VALUE_NETWORKS,
  BicolorArchetypeId,
} from './aiBicolorMasteryData';

export * from './aiBicolorMasteryData';

export const ORDERED_BICOLOR_ARCHETYPE_IDS: BicolorArchetypeId[] = [
  'dual_red_gold',
  'dual_blue_purple',
  'dual_red_green',
  'dual_blue_gold',
  'dual_purple_green',
  'dual_red_purple',
  'dual_blue_green',
  'dual_green_gold',
  'dual_purple_gold',
  'dual_red_blue',
  'dual_green_neutral',
  'dual_red_neutral',
  'dual_blue_neutral',
  'dual_purple_neutral',
  'dual_gold_neutral',
];

export const CLASSIC_DECK_ID_TO_BICOLOR_ARCHETYPE: Record<string, BicolorArchetypeId> = {
  deck_dual_draconic_pact: 'dual_red_gold',
  deck_dual_abyssal_storm: 'dual_blue_purple',
  deck_dual_primal_fury: 'dual_red_green',
  deck_dual_arcane_forge: 'dual_blue_gold',
  deck_dual_eternal_rot: 'dual_purple_green',
  deck_dual_blood_flame: 'dual_red_purple',
  deck_dual_wild_evolution: 'dual_blue_green',
  deck_dual_solar_wild: 'dual_green_gold',
  deck_dual_iron_inquisition: 'dual_purple_gold',
  deck_dual_storm_dragon: 'dual_red_blue',
  deck_spec_chronomancer: 'dual_blue_gold',
  deck_squad_thousand_shields: 'dual_green_gold',
  deck_squad_siege_battery: 'dual_red_blue',
};

const DOMAIN_PAIR_LOOKUP: Record<string, BicolorArchetypeId> = (() => {
  const map: Record<string, BicolorArchetypeId> = {};
  for (const id of ORDERED_BICOLOR_ARCHETYPE_IDS) {
    const m = BICOLOR_ARCHETYPE_MASTERY[id];
    if (!m) continue;
    const [a, b] = m.domains;
    map[`${a}+${b}`] = id;
    map[`${b}+${a}`] = id;
  }
  return map;
})();

/**
 * Resolves the exact trained BicolorArchetypeId for any unordered pair of Domains.
 */
export function resolveBicolorArchetypeForDomains(domains: Domain[]): BicolorArchetypeId | null {
  const unique = Array.from(new Set(domains));
  if (unique.length !== 2) return null;
  return DOMAIN_PAIR_LOOKUP[`${unique[0]}+${unique[1]}`] ?? null;
}

/**
 * Resolves a BicolorArchetypeId from either an explicit `dual_*` ID or a classic `deck_dual_*` / `deck_spec_*` / `deck_squad_*` ID.
 */
export function resolveBicolorArchetypeForDeckId(
  deckId?: string | null
): BicolorArchetypeId | null {
  if (!deckId) return null;
  if (BICOLOR_ARCHETYPE_MASTERY[deckId as BicolorArchetypeId]) {
    return deckId as BicolorArchetypeId;
  }
  return CLASSIC_DECK_ID_TO_BICOLOR_ARCHETYPE[deckId] ?? null;
}

export function getBicolorTrainingSummary() {
  return BICOLOR_TRAINING_SUMMARY;
}

export function getBicolorValueNetwork(archetypeId: BicolorArchetypeId) {
  return BICOLOR_VALUE_NETWORKS[archetypeId] ?? null;
}

/**
 * Returns the 15 Co-Evolved Bicolor Pact decks (10 Dual Chromatic + 5 Chromatic-Axial Alliances)
 * at the requested Skill Tier (default Tier V Champion) for Quick Duel, DeckBuilder, and War Oracle.
 */
export function getTrainedBicolorPrebuiltDecks(tier: AiSkillTier = 5): PrebuiltDeck[] {
  const list: PrebuiltDeck[] = [];
  for (const id of ORDERED_BICOLOR_ARCHETYPE_IDS) {
    const m = BICOLOR_ARCHETYPE_MASTERY[id];
    if (!m) continue;
    const tDeck = m.tierDecks[tier] ?? m.tierDecks[5];
    if (!tDeck || tDeck.cardIds.length === 0) continue;
    list.push({
      id: m.archetypeId,
      name: m.name,
      subtitle: `${m.subtitle} • Co-Evoluído IA`,
      domains: [...m.domains],
      strategy: m.strategySummary,
      coverCardId: m.coverCardId,
      cardIds: tDeck.cardIds,
    });
  }
  return list;
}
