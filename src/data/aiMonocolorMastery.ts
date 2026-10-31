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
  DOMAIN_VALUE_NETWORKS,
  MONOCOLOR_ARCHETYPE_MASTERY,
  MONOCOLOR_TRAINING_SUMMARY,
  MonocolorArchetypeId,
  MonocolorArchetypeMastery,
} from './aiMonocolorMasteryData';
import {
  BICOLOR_ARCHETYPE_MASTERY,
  BICOLOR_VALUE_NETWORKS,
  BicolorArchetypeId,
  resolveBicolorArchetypeForDeckId,
  resolveBicolorArchetypeForDomains,
} from './aiBicolorMastery';

export * from './aiMonocolorMasteryData';
export * from './aiBicolorMastery';

const COPY_CAP_BY_RARITY: Record<Rarity, number> = {
  common: 3,
  uncommon: 3,
  rare: 2,
  legendary: 1,
};

const DECK_SIZE = 100;
const LEGENDARY_CAP = 10;

export interface AiSkillTierSpec {
  tier: AiSkillTier;
  roman: 'I' | 'II' | 'III' | 'IV' | 'V';
  shortLabel: string;
  title: string;
  description: string;
  temperature: number;
  useValueMlp: boolean;
  beamWidth: number;
  beamDepth: number;
  antiLethalLookahead: boolean;
  allowBloodPact: boolean;
  allowRowManeuver: boolean;
}

export const AI_SKILL_TIER_SPECS: Record<AiSkillTier, AiSkillTierSpec> = {
  1: {
    tier: 1,
    roman: 'I',
    shortLabel: 'Tier I • Iniciante',
    title: 'Patrulha de Fronteira',
    description:
      'Grimório básico (0 Lendárias, foco em Comuns/Incomuns) e IA impulsiva (τ=1.35) sem Rede Neural nem busca multi-passo.',
    temperature: 1.35,
    useValueMlp: false,
    beamWidth: 1,
    beamDepth: 1,
    antiLethalLookahead: false,
    allowBloodPact: false,
    allowRowManeuver: false,
  },
  2: {
    tier: 2,
    roman: 'II',
    shortLabel: 'Tier II • Regular',
    title: 'Guarnição Regular',
    description:
      'Grimório intermediário (1–2 Lendárias) e heurística posicional padrão da cor (τ=0.70) sem retenção avançada de combos.',
    temperature: 0.7,
    useValueMlp: false,
    beamWidth: 1,
    beamDepth: 1,
    antiLethalLookahead: false,
    allowBloodPact: false,
    allowRowManeuver: true,
  },
  3: {
    tier: 3,
    roman: 'III',
    shortLabel: 'Tier III • Veterano',
    title: 'Bastião Veterano',
    description:
      'Grimório temático sinérgico (4–5 Lendárias) guiado pela Rede Neural Value MLP da cor e combos Shapley (τ=0.25).',
    temperature: 0.25,
    useValueMlp: true,
    beamWidth: 1,
    beamDepth: 1,
    antiLethalLookahead: false,
    allowBloodPact: true,
    allowRowManeuver: true,
  },
  4: {
    tier: 4,
    roman: 'IV',
    shortLabel: 'Tier IV • Mestre',
    title: 'Elite do Alto Trono',
    description:
      'Grimório de elite (7–8 Lendárias) com Value MLP + Beam Search tático (largura 4, prof. 3) otimizando a sequência do turno (τ=0.06).',
    temperature: 0.06,
    useValueMlp: true,
    beamWidth: 4,
    beamDepth: 3,
    antiLethalLookahead: false,
    allowBloodPact: true,
    allowRowManeuver: true,
  },
  5: {
    tier: 5,
    roman: 'V',
    shortLabel: 'Tier V • Grão-Mestre',
    title: 'Soberano Ápice',
    description:
      'Grimório Campeão Co-Evoluído (10/10 Lendárias + General da Roda) com Value MLP + Beam Search completo + Check Anti-Letal 1-ply (τ=0.00).',
    temperature: 0,
    useValueMlp: true,
    beamWidth: 5,
    beamDepth: 4,
    antiLethalLookahead: true,
    allowBloodPact: true,
    allowRowManeuver: true,
  },
};

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
 * for any CampaignBoss in Vaeloria (Monocolor, Bicolor, or Multicolor/Prismatic).
 */
export function resolveCampaignBossGraduatedSetup(boss: CampaignBoss): {
  cardIds: string[];
  archetypeId: MonocolorArchetypeId | BicolorArchetypeId;
  archetypeTitle: string;
  skillTier: AiSkillTier;
} {
  const skillTier: AiSkillTier = (
    boss.difficultyTier ?? inferClassicStageSkillTier(boss.stage)
  ) as AiSkillTier;
  const signatureIds = [boss.avatarCardId];
  if (boss.companionCardId) signatureIds.push(boss.companionCardId);

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
 * Resolves the primary trained Domain or Bicolor Value MLP for `actor` in `O(1)`.
 */
export function resolveDomainValueMlpForActor(
  state: GameState,
  actor: 'player' | 'ai'
): SerializedValueMlp | null {
  const side = state[actor];
  const deckId = actor === 'player' ? state.playerDeckId : state.aiDeckId;

  if (deckId) {
    const biArchId = resolveBicolorArchetypeForDeckId(deckId);
    if (biArchId && BICOLOR_VALUE_NETWORKS[biArchId]) {
      return BICOLOR_VALUE_NETWORKS[biArchId] ?? null;
    }

    const mastery = MONOCOLOR_ARCHETYPE_MASTERY[deckId as MonocolorArchetypeId];
    if (mastery && DOMAIN_VALUE_NETWORKS[mastery.domain]) {
      return DOMAIN_VALUE_NETWORKS[mastery.domain] ?? null;
    }
    if (deckId.includes('green')) return DOMAIN_VALUE_NETWORKS.green ?? null;
    if (deckId.includes('red')) return DOMAIN_VALUE_NETWORKS.red ?? null;
    if (deckId.includes('blue')) return DOMAIN_VALUE_NETWORKS.blue ?? null;
    if (deckId.includes('purple')) return DOMAIN_VALUE_NETWORKS.purple ?? null;
    if (deckId.includes('gold')) return DOMAIN_VALUE_NETWORKS.gold ?? null;
    if (deckId.includes('neutral')) return DOMAIN_VALUE_NETWORKS.neutral ?? null;
  }

  // Fallback: inspect actor's active domain affinities (supports custom Bicolor & Monocolor decks)
  const domains: Domain[] = ['green', 'red', 'blue', 'purple', 'gold'];
  const activeColored = domains
    .map((d) => ({ domain: d, val: side.affinities[d] ?? 0 }))
    .filter((x) => x.val > 0)
    .sort((a, b) => b.val - a.val);

  if (activeColored.length === 2) {
    const biFallback = resolveBicolorArchetypeForDomains([
      activeColored[0].domain,
      activeColored[1].domain,
    ]);
    if (biFallback && BICOLOR_VALUE_NETWORKS[biFallback]) {
      return BICOLOR_VALUE_NETWORKS[biFallback] ?? null;
    }
  } else if (activeColored.length === 1 && (side.affinities.neutral ?? 0) >= 2) {
    const axialFallback = resolveBicolorArchetypeForDomains([activeColored[0].domain, 'neutral']);
    if (axialFallback && BICOLOR_VALUE_NETWORKS[axialFallback]) {
      return BICOLOR_VALUE_NETWORKS[axialFallback] ?? null;
    }
  }

  const bestDom: Domain = activeColored[0]?.domain ?? 'neutral';
  return DOMAIN_VALUE_NETWORKS[bestDom] ?? DOMAIN_VALUE_NETWORKS.neutral ?? null;
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
      subtitle: `${m.subtitle} • Co-Evoluído IA`,
      domains: [m.domain],
      strategy: m.strategySummary,
      coverCardId: m.coverCardId,
      cardIds: tDeck.cardIds,
    });
  }
  return list;
}

