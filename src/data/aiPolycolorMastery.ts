import { AiSkillTier, CampaignBoss, Domain, PrebuiltDeck } from '../types/game';
import {
  POLYCOLOR_ARCHETYPE_MASTERY,
  POLYCOLOR_TRAINING_SUMMARY,
  POLYCOLOR_VALUE_NETWORKS,
  PolycolorArchetypeId,
} from './aiPolycolorMasteryData';

export * from './aiPolycolorMasteryData';

export const ORDERED_POLYCOLOR_ARCHETYPE_IDS: PolycolorArchetypeId[] = [
  'tri_red_blue_purple',
  'tri_red_green_gold',
  'tri_blue_purple_gold',
  'tri_red_purple_green',
  'tri_blue_green_gold',
  'tri_blue_purple_green',
  'tri_red_purple_gold',
  'tri_purple_green_gold',
  'tri_red_blue_green',
  'tri_red_blue_gold',
  'penta_prismatic_crater',
  'penta_free_city_sovereign',
  'penta_wheel_convergence',
];

export const CLASSIC_DECK_ID_TO_POLYCOLOR_ARCHETYPE: Record<string, PolycolorArchetypeId> = {
  deck_tri_arcane_cataclysm: 'tri_red_blue_purple',
  deck_tri_astral_cataclysm: 'tri_red_blue_purple',
  deck_tri_primal_titans: 'tri_red_green_gold',
  deck_tri_primordial_forge: 'tri_red_green_gold',
  deck_tri_eternal_reliquary: 'tri_blue_purple_gold',
  deck_tri_blood_moon: 'tri_red_purple_green',
  deck_tri_celestial_scales: 'tri_blue_green_gold',
  deck_tri_eternal_horizon: 'tri_blue_green_gold',
  deck_tri_abyssal_chimera: 'tri_blue_purple_green',
  deck_tri_crimson_sun: 'tri_red_purple_gold',
  deck_tri_zenith_armada: 'tri_red_blue_gold',
  deck_tri_tempest_primordial: 'tri_red_blue_green',
  deck_tri_eclipse_bastion: 'tri_purple_green_gold',
  deck_spec_pentachromatic: 'penta_prismatic_crater',
  deck_penta_valkyra_pact: 'penta_free_city_sovereign',
  deck_penta_wheel_convergence: 'penta_wheel_convergence',
};

const TRICOLOR_KEY_LOOKUP: Record<string, PolycolorArchetypeId> = (() => {
  const map: Record<string, PolycolorArchetypeId> = {};
  for (const id of ORDERED_POLYCOLOR_ARCHETYPE_IDS) {
    const m = POLYCOLOR_ARCHETYPE_MASTERY[id];
    if (!m || m.tierFormat !== 'tricolor') continue;
    const key = [...m.domains].sort().join('+');
    map[key] = id;
  }
  return map;
})();

/**
 * Resolves the exact trained Tricolor `PolycolorArchetypeId` for any unordered triad of 3 colored Domains.
 */
export function resolveTricolorArchetypeForDomains(
  domains: Domain[]
): PolycolorArchetypeId | null {
  const colored = Array.from(new Set(domains.filter((d) => d !== 'neutral'))).sort();
  if (colored.length !== 3) return null;
  return TRICOLOR_KEY_LOOKUP[colored.join('+')] ?? null;
}

/**
 * Resolves the thematic & mechanical Pentachromatic Apex `PolycolorArchetypeId` for a 4+ domain CampaignBoss
 * (routing Prismatic Crater, Free City Citadel, and Horological Matrix / Wheel Generals cleanly).
 */
export function resolvePentachromaticArchetypeForBoss(
  boss: Pick<CampaignBoss, 'id' | 'deckId' | 'submapId' | 'avatarCardId'>
): PolycolorArchetypeId {
  const av = boss.avatarCardId ?? '';
  if (
    boss.submapId === 'prismatic_crater' ||
    boss.deckId === 'deck_spec_pentachromatic' ||
    av.includes('167_') ||
    av.includes('dragao_astral') ||
    av.includes('dragao_etereo')
  ) {
    return 'penta_prismatic_crater';
  }
  if (
    boss.submapId === 'matrix' ||
    av.includes('173_') ||
    av.includes('relogio') ||
    av.includes('relojoeiro')
  ) {
    return 'penta_wheel_convergence';
  }
  return 'penta_free_city_sovereign';
}

/**
 * Resolves a `PolycolorArchetypeId` from either an explicit `tri_*` / `penta_*` ID or a classic `deck_tri_*` / `deck_penta_*` / `deck_spec_pentachromatic` ID.
 */
export function resolvePolycolorArchetypeForDeckId(
  deckId?: string | null
): PolycolorArchetypeId | null {
  if (!deckId) return null;
  if (POLYCOLOR_ARCHETYPE_MASTERY[deckId as PolycolorArchetypeId]) {
    return deckId as PolycolorArchetypeId;
  }
  return CLASSIC_DECK_ID_TO_POLYCOLOR_ARCHETYPE[deckId] ?? null;
}

export function getPolycolorTrainingSummary() {
  return POLYCOLOR_TRAINING_SUMMARY;
}

/**
 * Returns the 13 Co-Evolved Polycolor decks (10 Tricolor Cataclysms + 3 Pentachromatic Apex Sovereigns)
 * at the requested Skill Tier (default Tier V Champion) for Quick Duel, DeckBuilder, and War Oracle.
 */
export function getTrainedPolycolorPrebuiltDecks(tier: AiSkillTier = 5): PrebuiltDeck[] {
  const list: PrebuiltDeck[] = [];
  for (const id of ORDERED_POLYCOLOR_ARCHETYPE_IDS) {
    const m = POLYCOLOR_ARCHETYPE_MASTERY[id];
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
