import { ALL_CARDS, CARDS_BY_ID } from './cards';
import {
  AiSkillTier,
  CampaignBoss,
  CardDefinition,
  Domain,
  GameState,
  PrebuiltDeck,
  Rarity,
} from '../types/game';
import type { SerializedValueMlp } from '../engine/aiValueNetwork';
import {
  MONOCOLOR_ARCHETYPE_MASTERY,
  MONOCOLOR_TRAINING_SUMMARY,
  MonocolorArchetypeId,
  MonocolorArchetypeMastery,
} from './aiMonocolorMasteryData';
import {
  BICOLOR_ARCHETYPE_MASTERY,
  BicolorArchetypeId,
  resolveBicolorArchetypeForDeckId,
  resolveBicolorArchetypeForDomains,
} from './aiBicolorMastery';
import {
  POLYCOLOR_ARCHETYPE_MASTERY,
  PolycolorArchetypeId,
  resolvePentachromaticArchetypeForBoss,
  resolvePolycolorArchetypeForDeckId,
  resolveTricolorArchetypeForDomains,
} from './aiPolycolorMastery';
import {
  CACHED_BICOLOR_VALUE_NETWORKS,
  CACHED_DOMAIN_VALUE_NETWORKS,
  CACHED_POLYCOLOR_VALUE_NETWORKS,
  ensureAiValueNetworksLoaded,
  isAiValueNetworksLoaded,
  scheduleAiValueNetworksPreload,
} from './aiValueNetworksLoader';

export {
  ensureAiValueNetworksLoaded,
  isAiValueNetworksLoaded,
  scheduleAiValueNetworksPreload,
};

export * from './aiMonocolorMasteryData';
export * from './aiBicolorMastery';
export * from './aiPolycolorMastery';

const COPY_CAP_BY_RARITY: Record<Rarity, number> = {
  common: 3,
  uncommon: 3,
  rare: 2,
  legendary: 1,
};

const DECK_SIZE = 100;
const LEGENDARY_CAP = 10;

import { AI_SKILL_TIER_SPECS } from './aiSkillTierSpecs';
export type { AiSkillTierSpec } from './aiSkillTierSpecs';
export { AI_SKILL_TIER_SPECS };

export const ARCHETYPE_IDS_BY_DOMAIN: Record<Domain, MonocolorArchetypeId[]> = {
  green: ['mono_green_swarm', 'mono_green_colossus', 'mono_green_roots'],
  red: ['mono_red_blitz', 'mono_red_pyroclasm', 'mono_red_dragon'],
  blue: ['mono_blue_frost', 'mono_blue_chrono', 'mono_blue_abyssal'],
  purple: ['mono_purple_crypt', 'mono_purple_blood', 'mono_purple_umbral'],
  gold: ['mono_gold_phalanx', 'mono_gold_celestial', 'mono_gold_judgment'],
  neutral: ['mono_neutral_axial'],
};

const ARCHETYPE_FALLBACK_TITLES: Record<MonocolorArchetypeId, string> = {
  mono_green_swarm: 'Enxame & Matilha Silvestre',
  mono_green_colossus: 'Colossos Primordiais',
  mono_green_roots: 'Raízes Eternas',
  mono_red_blitz: 'Blitz Salamandra',
  mono_red_pyroclasm: 'Artilharia Piroclástica',
  mono_red_dragon: 'Trono Dracônico',
  mono_blue_frost: 'Inverno Eterno',
  mono_blue_chrono: 'Conclave Cronomante',
  mono_blue_abyssal: 'Frota Abissal',
  mono_purple_crypt: 'Culto da Cripta',
  mono_purple_blood: 'Pacto Sanguíneo',
  mono_purple_umbral: 'Inquisição Umbral',
  mono_gold_phalanx: 'Falange Impenetrável',
  mono_gold_celestial: 'Legião Celeste',
  mono_gold_judgment: 'Julgamento Solar',
  mono_neutral_axial: 'Legião Axial Autômata',
};

function scoreCardArchetypeFit(card: CardDefinition, archId: MonocolorArchetypeId): number {
  const kw = new Set(card.keywords);
  const effTypes = new Set(card.effects.map((e) => e.type));
  let s = 0;

  switch (archId) {
    case 'mono_green_swarm':
      if (card.cost <= 3 && card.type === 'creature') s += 4;
      if (effTypes.has('summon_token') || effTypes.has('buff_all_allies')) s += 6;
      if (kw.has('Ímpeto') || kw.has('Fúria Crescente')) s += 4;
      break;
    case 'mono_green_colossus':
      if (card.cost >= 5 && card.type === 'creature') s += 5;
      if (kw.has('Atropelar')) s += 6;
      if (effTypes.has('grant_bonus_essence') || effTypes.has('buff_target_ally')) s += 5;
      break;
    case 'mono_green_roots':
      if (kw.has('Guardião') || (card.regeneration ?? 0) > 0) s += 6;
      if (effTypes.has('heal_sovereign') || effTypes.has('heal_all_allies')) s += 5;
      if (card.armor >= 1) s += 3;
      break;

    case 'mono_red_blitz':
      if (card.cost <= 3 && card.type === 'creature') s += 4;
      if (kw.has('Ímpeto') || kw.has('Pele Incandescente') || kw.has('Fúria Crescente')) s += 6;
      break;
    case 'mono_red_pyroclasm':
      if (card.type === 'spell' || card.type === 'reaction') s += 5;
      if (
        effTypes.has('damage_enemy_sovereign') ||
        effTypes.has('damage_enemy_row') ||
        effTypes.has('damage_all_units') ||
        effTypes.has('damage_single_enemy')
      ) {
        s += 6;
      }
      break;
    case 'mono_red_dragon':
      if (kw.has('Voo') || (card.breathDamage ?? 0) > 0 || card.ascension) s += 6;
      if (card.cost >= 4 && card.type === 'creature') s += 3;
      break;

    case 'mono_blue_frost':
      if (effTypes.has('freeze_enemy') || effTypes.has('freeze_enemy_vanguard')) s += 8;
      if (effTypes.has('bounce_enemy')) s += 4;
      break;
    case 'mono_blue_chrono':
      if (card.type === 'spell' || card.type === 'reaction') s += 4;
      if (effTypes.has('draw_cards') || card.effects.some((e) => e.trigger === 'spell_cast')) {
        s += 7;
      }
      break;
    case 'mono_blue_abyssal':
      if (kw.has('Voo') || kw.has('Alcance')) s += 6;
      if (card.cost >= 4 && card.type === 'creature') s += 4;
      break;

    case 'mono_purple_crypt':
      if (
        kw.has('Renascer') ||
        effTypes.has('revive_from_crypt') ||
        card.effects.some((e) => e.trigger === 'on_death')
      ) {
        s += 7;
      }
      break;
    case 'mono_purple_blood':
      if (kw.has('Dreno de Vida') || kw.has('Toque Letal') || (card.corruptionCost ?? 0) > 0) {
        s += 6;
      }
      if (effTypes.has('damage_enemy_sovereign') || effTypes.has('steal_small_enemy')) s += 4;
      break;
    case 'mono_purple_umbral':
      if (
        effTypes.has('destroy_enemy') ||
        effTypes.has('debuff_enemy_vanguard_atk') ||
        effTypes.has('damage_all_units')
      ) {
        s += 7;
      }
      break;

    case 'mono_gold_phalanx':
      if (kw.has('Guardião') || card.armor >= 2) s += 7;
      if (effTypes.has('buff_all_allies') || effTypes.has('buff_target_ally')) s += 3;
      break;
    case 'mono_gold_celestial':
      if (kw.has('Escudo Divino') || kw.has('Voo') || card.ascension) s += 7;
      break;
    case 'mono_gold_judgment':
      if (card.type === 'relic' || effTypes.has('shield_all_allies')) s += 6;
      if (effTypes.has('heal_sovereign') || effTypes.has('heal_all_allies')) s += 5;
      break;

    case 'mono_neutral_axial':
      s += 5;
      break;
  }

  return s;
}

/**
 * Selects the best thematic & mechanical MonocolorArchetypeId for a CampaignBoss.
 */
export function resolveArchetypeIdForBoss(boss: CampaignBoss): MonocolorArchetypeId {
  const primaryDomain: Domain = boss.domains[0] ?? 'neutral';
  if (boss.domains.length > 1) {
    return 'mono_neutral_axial';
  }

  const candidates = ARCHETYPE_IDS_BY_DOMAIN[primaryDomain] ?? ['mono_neutral_axial'];
  if (candidates.length === 1) return candidates[0];

  const sigCards: CardDefinition[] = [];
  const av = CARDS_BY_ID[boss.avatarCardId];
  if (av) sigCards.push(av);
  if (boss.companionCardId && CARDS_BY_ID[boss.companionCardId]) {
    sigCards.push(CARDS_BY_ID[boss.companionCardId]);
  }

  // Submap affinity bonus to ensure geographic flavor when signature cards tie
  let submapPreferredIdx = boss.stage % candidates.length;
  if (boss.submapId === 'deep_roots') submapPreferredIdx = 1;
  else if (boss.submapId === 'capital_veridia') submapPreferredIdx = 2;
  else if (boss.submapId === 'underforge' && primaryDomain === 'red') submapPreferredIdx = 1;
  else if (boss.submapId === 'capital_pyros') submapPreferredIdx = 2;
  else if (boss.submapId === 'astral_isles' && primaryDomain === 'blue') submapPreferredIdx = 1;
  else if (boss.submapId === 'sea_of_storms' || boss.submapId === 'sunken_abyss') {
    submapPreferredIdx = primaryDomain === 'blue' ? 2 : 1;
  } else if (boss.submapId === 'capital_eclipse') submapPreferredIdx = 2;
  else if (boss.submapId === 'sky_bastions' || boss.submapId === 'capital_solaria') {
    submapPreferredIdx = 1;
  }

  let bestArch = candidates[submapPreferredIdx] ?? candidates[0];
  let bestScore = -1;

  for (let i = 0; i < candidates.length; i++) {
    const cand = candidates[i];
    let score = i === submapPreferredIdx ? 1.5 : 0;
    for (const c of sigCards) {
      score += scoreCardArchetypeFit(c, cand);
    }
    if (score > bestScore) {
      bestScore = score;
      bestArch = cand;
    }
  }

  return bestArch;
}

/**
 * Ensures signature cards (`avatarCardId` & `companionCardId`) are present in a 100-card list
 * while strictly maintaining 100 cards, copy limits (3/3/2/1), and <= 10 Legendaries.
 */
function injectSignatureCardsInto100Deck(
  baseIds: string[],
  signatureIds: string[]
): string[] {
  const result = baseIds.slice(0, DECK_SIZE);
  if (result.length < DECK_SIZE) return result;

  const counts = new Map<string, number>();
  let legCount = 0;
  for (const id of result) {
    counts.set(id, (counts.get(id) ?? 0) + 1);
    if (CARDS_BY_ID[id]?.rarity === 'legendary') legCount += 1;
  }

  const protectedSet = new Set<string>();
  for (const sigId of signatureIds) {
    const sigCard = CARDS_BY_ID[sigId];
    if (!sigCard) continue;
    protectedSet.add(sigId);

    if ((counts.get(sigId) ?? 0) > 0) continue;

    // Need to replace 1 slot in `result`
    let replaceIdx = -1;
    if (sigCard.rarity === 'legendary' && legCount >= LEGENDARY_CAP) {
      for (let i = result.length - 1; i >= 0; i--) {
        const cid = result[i];
        if (!protectedSet.has(cid) && CARDS_BY_ID[cid]?.rarity === 'legendary') {
          replaceIdx = i;
          break;
        }
      }
    }

    if (replaceIdx === -1) {
      // Prefer replacing a card with >=2 copies of similar cost and non-legendary rarity
      let bestCostDiff = 999;
      for (let i = result.length - 1; i >= 0; i--) {
        const cid = result[i];
        if (protectedSet.has(cid)) continue;
        const c = CARDS_BY_ID[cid];
        if (!c || c.rarity === 'legendary') continue;
        const diff = Math.abs(c.cost - sigCard.cost) - ((counts.get(cid) ?? 1) >= 2 ? 1.5 : 0);
        if (diff < bestCostDiff) {
          bestCostDiff = diff;
          replaceIdx = i;
        }
      }
    }

    if (replaceIdx !== -1) {
      const removedId = result[replaceIdx];
      if (CARDS_BY_ID[removedId]?.rarity === 'legendary') legCount -= 1;
      counts.set(removedId, Math.max(0, (counts.get(removedId) ?? 1) - 1));

      result[replaceIdx] = sigId;
      counts.set(sigId, (counts.get(sigId) ?? 0) + 1);
      if (sigCard.rarity === 'legendary') legCount += 1;
    }
  }

  return result;
}

/**
 * Fallback procedural 100-card builder used BEFORE `train:mono` populates `MONOCOLOR_ARCHETYPE_MASTERY`,
 * or for multi-domain (5-color Prismatic/Axial) bosses.
 */
function buildFallbackOrMulticolorTierDeck(
  domains: Domain[],
  tier: AiSkillTier,
  signatureIds: string[]
): string[] {
  const maxLegsByTier: Record<AiSkillTier, number> = {
    1: 0,
    2: 2,
    3: 5,
    4: 8,
    5: 10,
  };
  const maxRaresByTier: Record<AiSkillTier, number> = {
    1: 6,
    2: 14,
    3: 26,
    4: 38,
    5: 60,
  };

  const allowedSet = new Set<Domain>(domains.length > 0 ? domains : ['neutral']);
  // Pull ranked cards from trained mastery when available for multicolor bosses
  const shapleyBonus = new Map<string, number>();
  for (const dom of allowedSet) {
    for (const archId of ARCHETYPE_IDS_BY_DOMAIN[dom] ?? []) {
      const m = MONOCOLOR_ARCHETYPE_MASTERY[archId];
      if (!m) continue;
      for (const sm of m.topShapleyCards) {
        shapleyBonus.set(sm.cardId, Math.max(shapleyBonus.get(sm.cardId) ?? -99, sm.shapleyValue));
      }
    }
  }

  const pool = ALL_CARDS.filter((c) => allowedSet.has(c.domain));
  const deck: string[] = [];
  const counts = new Map<string, number>();
  let legCount = 0;
  let rareCount = 0;

  const tryAdd = (card: CardDefinition, maxWantedCopies: number) => {
    if (deck.length >= DECK_SIZE) return;
    if (card.rarity === 'legendary' && legCount >= maxLegsByTier[tier]) return;
    if (card.rarity === 'rare' && rareCount >= maxRaresByTier[tier]) return;
    const cap = Math.min(COPY_CAP_BY_RARITY[card.rarity], maxWantedCopies);
    while ((counts.get(card.id) ?? 0) < cap && deck.length < DECK_SIZE) {
      if (card.rarity === 'legendary' && legCount >= maxLegsByTier[tier]) break;
      if (card.rarity === 'rare' && rareCount >= maxRaresByTier[tier]) break;
      deck.push(card.id);
      counts.set(card.id, (counts.get(card.id) ?? 0) + 1);
      if (card.rarity === 'legendary') legCount += 1;
      if (card.rarity === 'rare') rareCount += 1;
    }
  };

  for (const sigId of signatureIds) {
    const sc = CARDS_BY_ID[sigId];
    if (sc) {
      // Always allow boss's own avatar/companion even if rare/legendary
      if ((counts.get(sc.id) ?? 0) === 0 && deck.length < DECK_SIZE) {
        deck.push(sc.id);
        counts.set(sc.id, 1);
        if (sc.rarity === 'legendary') legCount += 1;
        if (sc.rarity === 'rare') rareCount += 1;
      }
    }
  }

  const rarityPriority: Record<Rarity, number> =
    tier >= 4
      ? { legendary: 4, rare: 3, uncommon: 2, common: 1 }
      : tier === 3
        ? { legendary: 3, rare: 3, uncommon: 2.5, common: 1.5 }
        : { legendary: 1, rare: 2, uncommon: 3, common: 3.2 };

  const scoredPool = pool
    .slice()
    .sort((a, b) => {
      const sa =
        rarityPriority[a.rarity] * 10 +
        (shapleyBonus.get(a.id) ?? 0) * 25 -
        Math.abs(a.cost - 3.2);
      const sb =
        rarityPriority[b.rarity] * 10 +
        (shapleyBonus.get(b.id) ?? 0) * 25 -
        Math.abs(b.cost - 3.2);
      return sb - sa;
    });

  for (const c of scoredPool) {
    if (deck.length >= DECK_SIZE) break;
    const copies = domains.length > 1 ? 2 : COPY_CAP_BY_RARITY[c.rarity];
    tryAdd(c, copies);
  }

  // Final pad if needed
  for (const c of pool) {
    if (deck.length >= DECK_SIZE) break;
    const cap = COPY_CAP_BY_RARITY[c.rarity];
    while (
      (counts.get(c.id) ?? 0) < cap &&
      deck.length < DECK_SIZE &&
      (c.rarity !== 'legendary' || legCount < LEGENDARY_CAP)
    ) {
      deck.push(c.id);
      counts.set(c.id, (counts.get(c.id) ?? 0) + 1);
      if (c.rarity === 'legendary') legCount += 1;
    }
  }

  return deck;
}

function inferClassicStageSkillTier(stage: number): AiSkillTier {
  if (stage <= 3) return 2;
  if (stage <= 8) return 3;
  if (stage <= 18) return 4;
  return 5;
}

/**
 * Resolves the exact 100-card graduated grimoire (Tier I..V), archetype ID, title, and AI skill tier
 * for any CampaignBoss in Vaeloria (Monocolor, Bicolor, Tricolor, or Pentachromatic Apex).
 */
export function resolveCampaignBossGraduatedSetup(boss: CampaignBoss): {
  cardIds: string[];
  archetypeId: MonocolorArchetypeId | BicolorArchetypeId | PolycolorArchetypeId;
  archetypeTitle: string;
  skillTier: AiSkillTier;
} {
  const skillTier: AiSkillTier = (
    boss.difficultyTier ?? inferClassicStageSkillTier(boss.stage)
  ) as AiSkillTier;
  const signatureIds = [boss.avatarCardId];
  if (boss.companionCardId) signatureIds.push(boss.companionCardId);

  const explicitId = boss.archetypeId || boss.deckId;
  if (explicitId) {
    if (explicitId in MONOCOLOR_ARCHETYPE_MASTERY) {
      const m = MONOCOLOR_ARCHETYPE_MASTERY[explicitId as MonocolorArchetypeId];
      const tDeck = m?.tierDecks?.[skillTier] ?? m?.tierDecks?.[5];
      if (m && tDeck && tDeck.cardIds.length === DECK_SIZE) {
        return {
          cardIds: injectSignatureCardsInto100Deck(tDeck.cardIds, signatureIds),
          archetypeId: m.archetypeId,
          archetypeTitle: m.name,
          skillTier,
        };
      }
    }
    const explicitBi = resolveBicolorArchetypeForDeckId(explicitId);
    if (explicitBi) {
      const biMastery = BICOLOR_ARCHETYPE_MASTERY[explicitBi];
      const biTierDeck = biMastery?.tierDecks?.[skillTier] ?? biMastery?.tierDecks?.[5];
      if (biMastery && biTierDeck && biTierDeck.cardIds.length === DECK_SIZE) {
        return {
          cardIds: injectSignatureCardsInto100Deck(biTierDeck.cardIds, signatureIds),
          archetypeId: explicitBi,
          archetypeTitle: biMastery.name,
          skillTier,
        };
      }
    }
    const explicitPoly = resolvePolycolorArchetypeForDeckId(explicitId);
    if (explicitPoly) {
      const polyMastery = POLYCOLOR_ARCHETYPE_MASTERY[explicitPoly];
      const polyTierDeck = polyMastery?.tierDecks?.[skillTier] ?? polyMastery?.tierDecks?.[5];
      if (polyMastery && polyTierDeck && polyTierDeck.cardIds.length === DECK_SIZE) {
        return {
          cardIds: injectSignatureCardsInto100Deck(polyTierDeck.cardIds, signatureIds),
          archetypeId: explicitPoly,
          archetypeTitle: polyMastery.name,
          skillTier,
        };
      }
    }
  }

  if (boss.domains.length === 2) {
    const biArchId =
      resolveBicolorArchetypeForDomains(boss.domains) ??
      resolveBicolorArchetypeForDeckId(boss.deckId);
    if (biArchId) {
      const biMastery = BICOLOR_ARCHETYPE_MASTERY[biArchId];
      const biTierDeck = biMastery?.tierDecks?.[skillTier] ?? biMastery?.tierDecks?.[5];
      if (biMastery && biTierDeck && biTierDeck.cardIds.length === DECK_SIZE) {
        return {
          cardIds: injectSignatureCardsInto100Deck(biTierDeck.cardIds, signatureIds),
          archetypeId: biArchId,
          archetypeTitle: biMastery.name,
          skillTier,
        };
      }
    }
  }

  if (boss.domains.length === 3) {
    const triArchId =
      resolveTricolorArchetypeForDomains(boss.domains) ??
      resolvePolycolorArchetypeForDeckId(boss.deckId);
    if (triArchId) {
      const triMastery = POLYCOLOR_ARCHETYPE_MASTERY[triArchId];
      const triTierDeck = triMastery?.tierDecks?.[skillTier] ?? triMastery?.tierDecks?.[5];
      if (triMastery && triTierDeck && triTierDeck.cardIds.length === DECK_SIZE) {
        return {
          cardIds: injectSignatureCardsInto100Deck(triTierDeck.cardIds, signatureIds),
          archetypeId: triArchId,
          archetypeTitle: triMastery.name,
          skillTier,
        };
      }
    }
  }

  if (boss.domains.length >= 4) {
    const pentaArchId = resolvePentachromaticArchetypeForBoss(boss);
    const pentaMastery = POLYCOLOR_ARCHETYPE_MASTERY[pentaArchId];
    const pentaTierDeck = pentaMastery?.tierDecks?.[skillTier] ?? pentaMastery?.tierDecks?.[5];
    if (pentaMastery && pentaTierDeck && pentaTierDeck.cardIds.length === DECK_SIZE) {
      return {
        cardIds: injectSignatureCardsInto100Deck(pentaTierDeck.cardIds, signatureIds),
        archetypeId: pentaArchId,
        archetypeTitle: pentaMastery.name,
        skillTier,
      };
    }
  }

  if (boss.domains.length > 1) {
    return {
      cardIds: buildFallbackOrMulticolorTierDeck(boss.domains, skillTier, signatureIds),
      archetypeId: 'mono_neutral_axial',
      archetypeTitle:
        skillTier >= 5 ? 'Convergência Pentacromática Ápice' : 'Prisma Multicromático',
      skillTier,
    };
  }

  const archetypeId = resolveArchetypeIdForBoss(boss);
  const mastery: MonocolorArchetypeMastery | undefined = MONOCOLOR_ARCHETYPE_MASTERY[archetypeId];
  const tierDeck = mastery?.tierDecks?.[skillTier];

  if (tierDeck && tierDeck.cardIds.length === DECK_SIZE) {
    return {
      cardIds: injectSignatureCardsInto100Deck(tierDeck.cardIds, signatureIds),
      archetypeId,
      archetypeTitle: mastery.name,
      skillTier,
    };
  }

  return {
    cardIds: buildFallbackOrMulticolorTierDeck(boss.domains, skillTier, signatureIds),
    archetypeId,
    archetypeTitle: ARCHETYPE_FALLBACK_TITLES[archetypeId],
    skillTier,
  };
}

/**
 * Resolves the primary trained Monocolor, Bicolor, Tricolor, or Pentachromatic Value MLP for `actor` in `O(1)`.
 */
export function resolveDomainValueMlpForActor(
  state: GameState,
  actor: 'player' | 'ai'
): SerializedValueMlp | null {
  if (!isAiValueNetworksLoaded()) {
    scheduleAiValueNetworksPreload();
    return null;
  }

  const side = state[actor];
  const deckId = actor === 'player' ? state.playerDeckId : state.aiDeckId;

  if (deckId) {
    const polyArchId = resolvePolycolorArchetypeForDeckId(deckId);
    if (polyArchId && CACHED_POLYCOLOR_VALUE_NETWORKS[polyArchId]) {
      return CACHED_POLYCOLOR_VALUE_NETWORKS[polyArchId] ?? null;
    }

    const biArchId = resolveBicolorArchetypeForDeckId(deckId);
    if (biArchId && CACHED_BICOLOR_VALUE_NETWORKS[biArchId]) {
      return CACHED_BICOLOR_VALUE_NETWORKS[biArchId] ?? null;
    }

    const mastery = MONOCOLOR_ARCHETYPE_MASTERY[deckId as MonocolorArchetypeId];
    if (mastery && CACHED_DOMAIN_VALUE_NETWORKS[mastery.domain]) {
      return CACHED_DOMAIN_VALUE_NETWORKS[mastery.domain] ?? null;
    }
    if (deckId.includes('green')) return CACHED_DOMAIN_VALUE_NETWORKS.green ?? null;
    if (deckId.includes('red')) return CACHED_DOMAIN_VALUE_NETWORKS.red ?? null;
    if (deckId.includes('blue')) return CACHED_DOMAIN_VALUE_NETWORKS.blue ?? null;
    if (deckId.includes('purple')) return CACHED_DOMAIN_VALUE_NETWORKS.purple ?? null;
    if (deckId.includes('gold')) return CACHED_DOMAIN_VALUE_NETWORKS.gold ?? null;
    if (deckId.includes('neutral')) return CACHED_DOMAIN_VALUE_NETWORKS.neutral ?? null;
  }

  // Fallback: inspect actor's active domain affinities (supports custom 1–5 color decks)
  const domains: Domain[] = ['green', 'red', 'blue', 'purple', 'gold'];
  const activeColored = domains
    .map((d) => ({ domain: d, val: side.affinities[d] ?? 0 }))
    .filter((x) => x.val > 0)
    .sort((a, b) => b.val - a.val);

  if (activeColored.length >= 4 && CACHED_POLYCOLOR_VALUE_NETWORKS.penta_free_city_sovereign) {
    return CACHED_POLYCOLOR_VALUE_NETWORKS.penta_free_city_sovereign ?? null;
  }
  if (activeColored.length === 3) {
    const triFallback = resolveTricolorArchetypeForDomains([
      activeColored[0].domain,
      activeColored[1].domain,
      activeColored[2].domain,
    ]);
    if (triFallback && CACHED_POLYCOLOR_VALUE_NETWORKS[triFallback]) {
      return CACHED_POLYCOLOR_VALUE_NETWORKS[triFallback] ?? null;
    }
  }
  if (activeColored.length === 2) {
    const biFallback = resolveBicolorArchetypeForDomains([
      activeColored[0].domain,
      activeColored[1].domain,
    ]);
    if (biFallback && CACHED_BICOLOR_VALUE_NETWORKS[biFallback]) {
      return CACHED_BICOLOR_VALUE_NETWORKS[biFallback] ?? null;
    }
  } else if (activeColored.length === 1 && (side.affinities.neutral ?? 0) >= 2) {
    const axialFallback = resolveBicolorArchetypeForDomains([activeColored[0].domain, 'neutral']);
    if (axialFallback && CACHED_BICOLOR_VALUE_NETWORKS[axialFallback]) {
      return CACHED_BICOLOR_VALUE_NETWORKS[axialFallback] ?? null;
    }
  }

  const bestDom: Domain = activeColored[0]?.domain ?? 'neutral';
  return CACHED_DOMAIN_VALUE_NETWORKS[bestDom] ?? CACHED_DOMAIN_VALUE_NETWORKS.neutral ?? null;
}

export function getMonocolorTrainingSummary() {
  return MONOCOLOR_TRAINING_SUMMARY;
}

/**
 * Returns the 16 Co-Evolved Monocolor Champion (Tier V) decks as standard PrebuiltDeck entries
 * for Quick Duel, DeckBuilder inspiration, and the War Oracle (TacticalGuideView).
 */
export function getTrainedMonocolorPrebuiltDecks(tier: AiSkillTier = 5): PrebuiltDeck[] {
  const orderedIds: MonocolorArchetypeId[] = [
    'mono_green_swarm',
    'mono_green_colossus',
    'mono_green_roots',
    'mono_red_blitz',
    'mono_red_pyroclasm',
    'mono_red_dragon',
    'mono_blue_frost',
    'mono_blue_chrono',
    'mono_blue_abyssal',
    'mono_purple_crypt',
    'mono_purple_blood',
    'mono_purple_umbral',
    'mono_gold_phalanx',
    'mono_gold_celestial',
    'mono_gold_judgment',
    'mono_neutral_axial',
  ];

  const list: PrebuiltDeck[] = [];
  for (const id of orderedIds) {
    const m = MONOCOLOR_ARCHETYPE_MASTERY[id];
    if (!m) continue;
    const tDeck = m.tierDecks[tier] ?? m.tierDecks[5];
    if (!tDeck || tDeck.cardIds.length === 0) continue;
    list.push({
      id: m.archetypeId,
      name: `${m.name}`,
      subtitle: m.subtitle,
      domains: [m.domain],
      strategy: m.strategySummary,
      coverCardId: m.coverCardId,
      cardIds: tDeck.cardIds,
    });
  }
  return list;
}

/**
 * Resolves the exact 100-card graduated grimoire and metadata for any of the 44 Unified Champions
 * (16 Monocolor + 15 Bicolor + 10 Tricolor + 3 Pentachromatic) at Skill Tier I–V.
 */
export function resolveChampionDeckAndProfile(
  archetypeId: string,
  skillTier: AiSkillTier = 5
): {
  cardIds: string[];
  archetypeId: MonocolorArchetypeId | BicolorArchetypeId | PolycolorArchetypeId;
  name: string;
  subtitle: string;
  domains: Domain[];
  coverCardId: string;
  skillTier: AiSkillTier;
} | null {
  if (archetypeId in MONOCOLOR_ARCHETYPE_MASTERY) {
    const m = MONOCOLOR_ARCHETYPE_MASTERY[archetypeId as MonocolorArchetypeId];
    const tDeck = m?.tierDecks?.[skillTier] ?? m?.tierDecks?.[5];
    if (m && tDeck && tDeck.cardIds.length === DECK_SIZE) {
      return {
        cardIds: tDeck.cardIds,
        archetypeId: m.archetypeId,
        name: m.name,
        subtitle: m.subtitle,
        domains: [m.domain],
        coverCardId: m.coverCardId,
        skillTier,
      };
    }
  }

  const biId = resolveBicolorArchetypeForDeckId(archetypeId);
  if (biId) {
    const bm = BICOLOR_ARCHETYPE_MASTERY[biId];
    const tDeck = bm?.tierDecks?.[skillTier] ?? bm?.tierDecks?.[5];
    if (bm && tDeck && tDeck.cardIds.length === DECK_SIZE) {
      return {
        cardIds: tDeck.cardIds,
        archetypeId: bm.archetypeId,
        name: bm.name,
        subtitle: bm.subtitle,
        domains: bm.domains,
        coverCardId: bm.coverCardId,
        skillTier,
      };
    }
  }

  const polyId = resolvePolycolorArchetypeForDeckId(archetypeId);
  if (polyId) {
    const pm = POLYCOLOR_ARCHETYPE_MASTERY[polyId];
    const tDeck = pm?.tierDecks?.[skillTier] ?? pm?.tierDecks?.[5];
    if (pm && tDeck && tDeck.cardIds.length === DECK_SIZE) {
      return {
        cardIds: tDeck.cardIds,
        archetypeId: pm.archetypeId,
        name: pm.name,
        subtitle: pm.subtitle,
        domains: pm.domains,
        coverCardId: pm.coverCardId,
        skillTier,
      };
    }
  }

  return null;
}

const SIGNATURE_DECK_MEMO = new Map<string, string[]>();

function hashCardSeed(seedStr: string): number {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Constrói deterministicamente o Grimório Assinatura individual de 100 cartas de qualquer
 * Criatura Soberana (Lendária ou Rara), garantindo:
 * - Presença obrigatória da própria carta (`1×` Lendária ou `2×` Rara);
 * - Respeito estrito aos limites legais (`100` cartas, `<= 1×` Lendária, `<= 2×` Rara, `<= 3×` Comum/Incomum, teto de Lendárias do Grau);
 * - Pacote sinérgico exclusivo (12–16 cartas) alinhado às palavras-chave, efeitos, curva e domínio do Soberano,
 *   garantindo que cada um dos 276 Soberanos lidere seu próprio grimório distinto.
 */
export function buildIndividualSovereignSignatureDeck(
  avatarCardId: string,
  baseArchetypeId: string,
  skillTier: AiSkillTier
): string[] {
  const memoKey = `${avatarCardId}::${baseArchetypeId}::${skillTier}`;
  const cached = SIGNATURE_DECK_MEMO.get(memoKey);
  if (cached) return cached;

  const base =
    resolveChampionDeckAndProfile(baseArchetypeId, skillTier) ??
    resolveChampionDeckAndProfile('mono_neutral_axial', skillTier)!;
  const avatarCard = CARDS_BY_ID[avatarCardId];
  if (!avatarCard) {
    SIGNATURE_DECK_MEMO.set(memoKey, base.cardIds);
    return base.cardIds;
  }

  // Os 44 Campeões Canônicos no Grau V preservam seu grimório campeão co-evoluído intacto (desde que já contenha sua carta)
  if (skillTier === 5 && base.coverCardId === avatarCardId && base.cardIds.includes(avatarCardId)) {
    SIGNATURE_DECK_MEMO.set(memoKey, base.cardIds);
    return base.cardIds;
  }

  const allowedDomains = new Set<Domain>([...base.domains, avatarCard.domain, 'neutral']);
  const counts = new Map<string, number>();
  for (const cid of base.cardIds) {
    counts.set(cid, (counts.get(cid) ?? 0) + 1);
  }

  const seed = hashCardSeed(`${avatarCardId}#${base.archetypeId}#T${skillTier}`);
  const avatarKeywords = new Set(avatarCard.keywords);
  const avatarEffectTypes = new Set(avatarCard.effects.map((e) => e.type));
  const hasBreath = (avatarCard.breathDamage ?? 0) > 0;

  const scoreSynergy = (c: CardDefinition): number => {
    let s = 0;
    if (c.domain === avatarCard.domain && c.domain !== 'neutral') s += 18;
    else if (base.domains.includes(c.domain)) s += 10;
    for (const kw of c.keywords) {
      if (avatarKeywords.has(kw)) s += 14;
    }
    for (const ef of c.effects) {
      if (avatarEffectTypes.has(ef.type)) s += 12;
    }
    if (hasBreath && (c.breathDamage ?? 0) > 0) s += 12;
    if (avatarCard.cost >= 6 && c.cost <= 3) s += 6;
    if (avatarCard.cost <= 4 && c.cost <= 4) s += 6;
    const tie = (hashCardSeed(`${seed}:${c.id}`) % 1000) / 50; // 0..20 deterministic signature flavor
    return s + tie;
  };

  // Teto de Lendárias respeitando estritamente a raridade do Soberano e seu Grau:
  // Comandantes Regionais (Raras) comandam guarnições Raras/Incomuns/Comuns (sem empilhar Grão-Soberanos Lendários),
  // enquanto Grão-Soberanos (Lendárias) comandam hostes Lendárias completas escalonadas pelo Grau.
  let baseLegCount = 0;
  for (const [cid, cnt] of counts.entries()) {
    if (CARDS_BY_ID[cid]?.rarity === 'legendary') baseLegCount += cnt;
  }
  const tierLegCap =
    avatarCard.rarity !== 'legendary'
      ? skillTier <= 2
        ? 0
        : skillTier === 3
          ? 1
          : 2
      : skillTier === 1
        ? 1
        : skillTier === 2
          ? Math.max(2, Math.min(3, baseLegCount))
          : skillTier === 3
            ? Math.max(5, Math.min(8, baseLegCount))
            : skillTier === 4
              ? Math.max(9, Math.min(12, baseLegCount))
              : LEGENDARY_CAP;

  const currentTotal = () => {
    let t = 0;
    for (const v of counts.values()) t += v;
    return t;
  };
  const currentLegendaries = () => {
    let t = 0;
    for (const [cid, v] of counts.entries()) {
      if (CARDS_BY_ID[cid]?.rarity === 'legendary') t += v;
    }
    return t;
  };

  const removeLowestSynergySlot = (preferRarity?: Rarity, requireLegendaryRemoval = false): boolean => {
    let worstId: string | null = null;
    let worstScore = Infinity;
    for (const [cid, cnt] of counts.entries()) {
      if (cnt <= 0 || cid === avatarCardId) continue;
      const c = CARDS_BY_ID[cid];
      if (!c) continue;
      if (requireLegendaryRemoval && c.rarity !== 'legendary') continue;
      if (!requireLegendaryRemoval && c.rarity === 'legendary' && preferRarity !== 'legendary') {
        continue;
      }
      let sc = scoreSynergy(c);
      if (preferRarity && c.rarity === preferRarity) sc -= 25;
      if (cnt >= 3) sc -= 8;
      if (sc < worstScore) {
        worstScore = sc;
        worstId = cid;
      }
    }
    if (!worstId) return false;
    const nextCnt = (counts.get(worstId) ?? 1) - 1;
    if (nextCnt <= 0) counts.delete(worstId);
    else counts.set(worstId, nextCnt);
    return true;
  };

  // 0. Se o grimório base exceder o teto de Lendárias permitido para este Soberano, substituir excessos
  while (currentLegendaries() > tierLegCap) {
    if (!removeLowestSynergySlot('legendary', true)) break;
  }

  // 1. Garantir a própria carta do Soberano (1x se Lendária, 2x se Rara)
  const targetAvatarCopies = avatarCard.rarity === 'legendary' ? 1 : 2;
  while ((counts.get(avatarCardId) ?? 0) < targetAvatarCopies) {
    const needLegRoom =
      avatarCard.rarity === 'legendary' && currentLegendaries() >= Math.min(LEGENDARY_CAP, Math.max(1, tierLegCap));
    if (!removeLowestSynergySlot(avatarCard.rarity, needLegRoom)) {
      removeLowestSynergySlot(undefined, false);
    }
    counts.set(avatarCardId, (counts.get(avatarCardId) ?? 0) + 1);
  }

  // 2. Personalizar pacote assinatura de 14 cartas sinérgicas exclusivas deste Soberano
  const pool = ALL_CARDS.filter(
    (c) =>
      c.id !== avatarCardId &&
      allowedDomains.has(c.domain) &&
      (c.rarity !== 'legendary' || skillTier >= 3)
  ).sort((a, b) => scoreSynergy(b) - scoreSynergy(a));

  let swapsRemaining = 14;
  for (const cand of pool) {
    if (swapsRemaining <= 0) break;
    const cur = counts.get(cand.id) ?? 0;
    const cap = COPY_CAP_BY_RARITY[cand.rarity];
    if (cur >= cap) continue;
    if (cand.rarity === 'legendary' && currentLegendaries() >= Math.min(LEGENDARY_CAP, tierLegCap)) {
      continue;
    }
    // Se já está no grimório base no limite desejado, pular para trazer cartas novas de assinatura
    if (cur > 0 && cand.rarity !== 'rare') continue;

    const copiesToInject = cand.rarity === 'legendary' ? 1 : Math.min(2, cap - cur, swapsRemaining);
    for (let k = 0; k < copiesToInject; k++) {
      if (removeLowestSynergySlot(cand.rarity, false)) {
        counts.set(cand.id, (counts.get(cand.id) ?? 0) + 1);
        swapsRemaining -= 1;
      }
    }
  }

  // Garantir tamanho exato de 100 cartas
  while (currentTotal() > DECK_SIZE) {
    if (!removeLowestSynergySlot()) break;
  }
  if (currentTotal() < DECK_SIZE) {
    for (const cand of pool) {
      if (currentTotal() >= DECK_SIZE) break;
      if (cand.rarity === 'legendary') continue;
      const cap = COPY_CAP_BY_RARITY[cand.rarity];
      while ((counts.get(cand.id) ?? 0) < cap && currentTotal() < DECK_SIZE) {
        counts.set(cand.id, (counts.get(cand.id) ?? 0) + 1);
      }
    }
  }

  const finalIds: string[] = [];
  // Coloca a carta assinatura do Soberano no topo do grimório
  const avCnt = counts.get(avatarCardId) ?? 0;
  for (let i = 0; i < avCnt; i++) finalIds.push(avatarCardId);
  for (const [cid, cnt] of counts.entries()) {
    if (cid === avatarCardId) continue;
    for (let i = 0; i < cnt; i++) finalIds.push(cid);
  }

  const out = finalIds.slice(0, DECK_SIZE);
  SIGNATURE_DECK_MEMO.set(memoKey, out);
  return out;
}



