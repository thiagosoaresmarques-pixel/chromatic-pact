import { AiSkillTier, BoardUnit, CardDefinition, Domain, GameState, RowType } from '../types/game';
import {
  BASELINE_AI_PROFILE,
  DeckLearnedAiProfile,
  DEFAULT_AI_WEIGHTS,
  resolveLearnedProfileForActor,
} from '../data/aiLearnedProfiles';
import {
  AI_SKILL_TIER_SPECS,
  resolveDomainValueMlpForActor,
} from '../data/aiMonocolorMastery';
import {
  evaluateStateWithValueMlp,
  SerializedValueMlp,
} from './aiValueNetwork';
import {
  activateSimpleDomain,
  ascendUnit,
  bloodPactForEssence,
  breakDomainExpansionWithSacrifice,
  canAscendUnit,
  canBreakDomainExpansionWithSacrifice,
  canDeployToSlot,
  canInvokeDomainExpansion,
  canMoveUnitRow,
  canPlayCard,
  canUseBloodPact,
  canUseSimpleDomain,
  canUseSovereignPower,
  channelCard,
  cloneGameState,
  endTurn,
  executeAttack,
  findUnitOnBoard,
  getAllBoardUnits,
  getSlotUnits,
  getSovereignPowerInfo,
  getTotalAvailableSacrificePool,
  getValidAttackTargets,
  invokeDomainExpansion,
  isSureHitActiveFor,
  moveUnitRow,
  mulliganCards,
  playCard,
  setUnitAttackTarget,
  toggleUnitStance,
  useSovereignPower,
} from './gameEngine';

export interface AiProfileOverrides {
  player?: DeckLearnedAiProfile;
  ai?: DeckLearnedAiProfile;
  playerSkillTier?: AiSkillTier;
  aiSkillTier?: AiSkillTier;
  playerValueMlp?: SerializedValueMlp | null;
  aiValueMlp?: SerializedValueMlp | null;
  /** Skips multi-ply Beam Search during bulk deck-evolution rollouts while preserving MLP & profile logic */
  fastRollout?: boolean;
}

const TIER1_NAIVE_PROFILE: DeckLearnedAiProfile = {
  ...BASELINE_AI_PROFILE,
  deckId: 'tier1_patrol_naive',
  deckName: 'Patrulha Iniciante',
  archetypeTag: 'Iniciante',
  weights: {
    ...DEFAULT_AI_WEIGHTS,
    aggroFaceBias: 1.05,
    tradeValueBias: 0.72,
    guardianPriority: 0.75,
    spellHoldPatience: 0.55,
    synergyHoldBonus: 0,
    ascensionEagerness: 0.65,
    domainExpansionEagerness: 0.7,
    sovPowerTempoBias: 0.5,
    mulliganCurveTarget: 5,
  },
  mulliganKeepIds: [],
  channelPriorityIds: [],
  channelAvoidIds: [],
  highImpactCardBoosts: {},
  synergyPairs: [],
  discoveredCombos: [],
};

export function resolveSkillTierForActor(
  state: GameState,
  actor: 'player' | 'ai',
  overrides?: AiProfileOverrides
): AiSkillTier {
  const explicitOverride =
    actor === 'player' ? overrides?.playerSkillTier : overrides?.aiSkillTier;
  if (explicitOverride) return explicitOverride;

  const stateTier = actor === 'player' ? state.playerSkillTier : state.aiSkillTier;
  if (stateTier) return stateTier;

  if (actor === 'ai' && state.bossId) {
    const m = state.bossId.match(/_t([1-5])_/);
    if (m) return Number(m[1]) as AiSkillTier;
  }

  return 3;
}

function getValueMlpForActor(
  state: GameState,
  actor: 'player' | 'ai',
  overrides?: AiProfileOverrides
): SerializedValueMlp | null {
  const custom = actor === 'player' ? overrides?.playerValueMlp : overrides?.aiValueMlp;
  if (custom !== undefined) return custom;
  return resolveDomainValueMlpForActor(state, actor);
}

/**
 * Prepares a fair lookahead clone where hidden topdeck order is rotated so Beam Search / Value MLP
 * never peeks at exact upcoming card draws.
 */
function createFairLookaheadState(state: GameState, actor: 'player' | 'ai'): GameState {
  const cloned = cloneGameState(state);
  const deck = cloned[actor].deck;
  if (deck.length > 2) {
    // Rotate deck by half its length so draw effects in lookahead don't reveal real topdeck
    const pivot = deck.length >> 1;
    cloned[actor].deck = [...deck.slice(pivot), ...deck.slice(0, pivot)];
  }
  return cloned;
}

/**
 * Softmax selection over candidate indices given raw heuristic scores (~0..120 scale).
 * At temperature <= 0.01, strictly deterministic argmax.
 */
function selectIndexWithTemperature(scores: number[], temperature: number): number {
  if (scores.length === 0) return -1;
  if (scores.length === 1 || temperature <= 0.01) {
    let bestIdx = 0;
    for (let i = 1; i < scores.length; i++) {
      if (scores[i] > scores[bestIdx]) bestIdx = i;
    }
    return bestIdx;
  }

  let maxScore = scores[0];
  for (let i = 1; i < scores.length; i++) {
    if (scores[i] > maxScore) maxScore = scores[i];
  }

  const scale = Math.max(1.5, temperature * 18);
  const weights = new Float64Array(scores.length);
  let sum = 0;
  for (let i = 0; i < scores.length; i++) {
    const w = Math.exp(Math.max(-25, (scores[i] - maxScore) / scale));
    weights[i] = w;
    sum += w;
  }

  if (sum <= 0) return 0;
  let r = Math.random() * sum;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) return i;
  }
  return weights.length - 1;
}

function getProfileForActor(
  state: GameState,
  actor: 'player' | 'ai',
  overrides?: AiProfileOverrides
): DeckLearnedAiProfile {
  const skillTier = resolveSkillTierForActor(state, actor, overrides);
  if (skillTier === 1 && !(actor === 'player' ? overrides?.player : overrides?.ai)) {
    return TIER1_NAIVE_PROFILE;
  }
  const custom = actor === 'player' ? overrides?.player : overrides?.ai;
  const resolved = resolveLearnedProfileForActor(state, actor, custom);
  if (skillTier === 2 && !custom) {
    return {
      ...resolved,
      weights: {
        ...resolved.weights,
        synergyHoldBonus: 0,
      },
      highImpactCardBoosts: {},
      synergyPairs: [],
      discoveredCombos: [],
    };
  }
  return resolved;
}

function getPartnerCardIds(profile: DeckLearnedAiProfile, cardId: string): string[] {
  const partners: string[] = [];
  for (const [a, b] of profile.synergyPairs) {
    if (a === cardId) partners.push(b);
    else if (b === cardId) partners.push(a);
  }
  for (const combo of profile.discoveredCombos) {
    if (combo.cardAId === cardId && !partners.includes(combo.cardBId)) {
      partners.push(combo.cardBId);
    } else if (combo.cardBId === cardId && !partners.includes(combo.cardAId)) {
      partners.push(combo.cardAId);
    }
  }
  return partners;
}

/**
 * Evaluates opening hand (7 cards) and chooses optimal indices to swap in Mulligan.
 */
export function chooseMulliganIndicesForActor(
  state: GameState,
  actor: 'player' | 'ai' = 'ai',
  customProfile?: DeckLearnedAiProfile,
  skillTierOverride?: AiSkillTier
): number[] {
  const actorState = state[actor];
  const hand = actorState.hand;
  if (hand.length === 0) return [];

  const skillTier =
    skillTierOverride ??
    (actor === 'player' ? state.playerSkillTier : state.aiSkillTier) ??
    (actor === 'ai' && state.bossId?.match(/_t([1-5])_/)
      ? (Number(state.bossId.match(/_t([1-5])_/)![1]) as AiSkillTier)
      : 3);

  // Tier 1 (Patrol Novice): Naive mulligan — only swaps 7+ cost cards
  if (skillTier === 1 && !customProfile) {
    const naiveSwaps: number[] = [];
    for (let i = 0; i < hand.length; i++) {
      if (hand[i].cost >= 7) naiveSwaps.push(i);
    }
    return naiveSwaps;
  }

  // Tier 2 (Regular Garrison): Basic curve mulligan — swaps 6+ cost cards without channel-fodder planning
  if (skillTier === 2 && !customProfile) {
    const basicSwaps: number[] = [];
    for (let i = 0; i < hand.length; i++) {
      if (hand[i].cost >= 6) basicSwaps.push(i);
    }
    return basicSwaps;
  }

  const profile = resolveLearnedProfileForActor(state, actor, customProfile);
  const w = profile.weights;
  const keepSet = new Set(profile.mulliganKeepIds);
  const channelPrioSet = new Set(profile.channelPriorityIds);

  const curveCap = Math.max(2, Math.round(w.mulliganCurveTarget));
  const earlyCreatureIndices: number[] = [];
  const channelFodderCandidates: number[] = [];

  for (let i = 0; i < hand.length; i++) {
    const c = hand[i];
    if ((c.type === 'creature' || c.type === 'relic') && c.cost <= curveCap) {
      earlyCreatureIndices.push(i);
    }
    if (
      c.rarity !== 'legendary' &&
      (channelPrioSet.has(c.id) || (c.cost >= 5 && !c.effects.some((e) => e.type === 'break_domain_expansion')))
    ) {
      channelFodderCandidates.push(i);
    }
  }

  // Reserve up to 1 good Turn-1 channel card if we already have at least 1 early play
  const reservedChannelIdx =
    earlyCreatureIndices.length >= 1 && channelFodderCandidates.length > 0
      ? channelFodderCandidates[0]
      : -1;

  const seenCardCounts: Record<string, number> = {};
  const swapIndices: number[] = [];

  for (let i = 0; i < hand.length; i++) {
    const card = hand[i];
    seenCardCounts[card.id] = (seenCardCounts[card.id] ?? 0) + 1;
    const copyNum = seenCardCounts[card.id];

    if (i === reservedChannelIdx) continue;

    const isExplicitKeep = keepSet.has(card.id);
    const isEarlyBoard =
      (card.type === 'creature' || card.type === 'relic') && card.cost <= curveCap;

    // Never swap our first 2 early board plays or non-duplicate empirical keeps
    if ((isEarlyBoard || isExplicitKeep) && copyNum === 1) {
      continue;
    }
    if (isEarlyBoard && copyNum === 2 && earlyCreatureIndices.length <= 2) {
      continue;
    }

    // If hand has ZERO early creatures/relics, aggressively mulligan spells/reactions/expensive cards
    if (earlyCreatureIndices.length === 0 && card.type !== 'creature') {
      swapIndices.push(i);
      continue;
    }

    // Anti-Domain Wheel Generals (#173) are late-game counters; mulligan them if opening curve is weak
    if (
      card.effects.some((e) => e.type === 'break_domain_expansion') &&
      (earlyCreatureIndices.length < 2 || copyNum > 1)
    ) {
      swapIndices.push(i);
      continue;
    }

    // Swap cards significantly above target Mulligan curve
    if (card.cost > Math.round(w.mulliganCurveTarget + 1.2)) {
      swapIndices.push(i);
      continue;
    }

    // Swap duplicate 4+ cost cards or duplicate reactions in opening hand
    if (copyNum >= 2 && (card.cost >= 4 || card.type === 'reaction')) {
      swapIndices.push(i);
      continue;
    }
  }

  return swapIndices;
}

/**
 * Executes opening hand Mulligan for the specified actor ('ai' by default).
 */
export function executeAiMulligan(
  state: GameState,
  actor: 'player' | 'ai' = 'ai',
  customProfile?: DeckLearnedAiProfile
): GameState {
  if (state.phase === 'gameover') return state;
  const swapIndices = chooseMulliganIndicesForActor(state, actor, customProfile);
  return mulliganCards(state, actor, swapIndices);
}

/**
 * Selects the best card in actor's hand to channel as Essence & Domain Affinity.
 */
function chooseBestCardToChannel(
  state: GameState,
  actor: 'player' | 'ai' = 'ai',
  profile?: DeckLearnedAiProfile
): number | null {
  const aiState = state[actor];
  if (aiState.hasChanneledThisTurn || aiState.hand.length === 0) {
    return null;
  }

  const resolvedProfile = profile ?? resolveLearnedProfileForActor(state, actor);
  const w = resolvedProfile.weights;

  // If actor already has plenty of essence (>= 8) and a small hand (<= 2), save cards to play
  if (aiState.maxEssence >= 8 && aiState.hand.length <= 2) {
    return null;
  }

  const enemyActor: 'player' | 'ai' = actor === 'player' ? 'ai' : 'player';
  const enemyState = state[enemyActor];
  const enemyColoredAffinitySum =
    (enemyState.affinities.red ?? 0) +
    (enemyState.affinities.blue ?? 0) +
    (enemyState.affinities.purple ?? 0) +
    (enemyState.affinities.green ?? 0) +
    (enemyState.affinities.gold ?? 0);
  const maxEnemyDomainAffinity = Math.max(
    enemyState.affinities.red ?? 0,
    enemyState.affinities.blue ?? 0,
    enemyState.affinities.purple ?? 0,
    enemyState.affinities.green ?? 0,
    enemyState.affinities.gold ?? 0,
    enemyColoredAffinitySum === 0 ? enemyState.affinities.neutral ?? 0 : 0
  );
  const enemyDomainThreatImminent =
    maxEnemyDomainAffinity >= 4 ||
    Boolean(
      state.domainExpansion &&
        (state.domainExpansion.owner === enemyActor ||
          state.domainExpansion.clashRival?.owner === enemyActor)
    );

  const nextEssence = aiState.maxEssence + 1;

  const domainNeed: Record<Domain, number> = {
    red: 0,
    blue: 0,
    purple: 0,
    green: 0,
    gold: 0,
    neutral: 0,
  };

  const cardCountsById: Record<string, number> = {};
  const coloredList: Exclude<Domain, 'neutral'>[] = ['red', 'blue', 'purple', 'green', 'gold'];
  for (const c of aiState.hand) {
    cardCountsById[c.id] = (cardCountsById[c.id] ?? 0) + 1;
    if (c.domain !== 'neutral') {
      let otherColored = 0;
      for (const od of coloredList) {
        if (od !== c.domain) otherColored += aiState.affinities[od] ?? 0;
      }
      const currentAff = (aiState.affinities[c.domain] ?? 0) + Math.ceil(otherColored * 0.65);
      if (currentAff < c.affinityReq) {
        domainNeed[c.domain] += (c.affinityReq - currentAff) * 2 + 1;
      }
    }
  }
  const maxColoredDomainNeed = Math.max(
    domainNeed.red,
    domainNeed.blue,
    domainNeed.purple,
    domainNeed.green,
    domainNeed.gold
  );

  const coloredPactAffinity =
    (aiState.affinities.red ?? 0) +
    (aiState.affinities.blue ?? 0) +
    (aiState.affinities.purple ?? 0) +
    (aiState.affinities.green ?? 0) +
    (aiState.affinities.gold ?? 0);
  const totalPactAffinity =
    coloredPactAffinity > 0 ? coloredPactAffinity : aiState.affinities.neutral ?? 0;
  const expansionDeficitBonus =
    totalPactAffinity < 6 ? Math.round(24 * w.domainExpansionEagerness) : 8;

  const friendlyUnits = getAllBoardUnits(aiState).filter((u) => !u.isTrap);
  const activeRelicCount = friendlyUnits.filter((u) => u.card.type === 'relic').length;
  const friendlyBoardCreatures = friendlyUnits.filter((u) => u.card.type === 'creature').length;
  const handCreatures = aiState.hand.filter((c) => c.type === 'creature').length;
  const handSpells = aiState.hand.filter(
    (c) => c.type === 'spell' || c.type === 'reaction'
  ).length;

  const boardCardIds = new Set(friendlyUnits.map((u) => u.card.id));
  const prioSet = new Set(resolvedProfile.channelPriorityIds);
  const avoidSet = new Set(resolvedProfile.channelAvoidIds);

  let bestIndex = 0;
  let bestScore = -9999;

  for (let i = 0; i < aiState.hand.length; i++) {
    const card = aiState.hand[i];
    let score = expansionDeficitBonus;

    if (card.domain !== 'neutral') {
      score += Math.min(26, domainNeed[card.domain] * 10);
    } else if (coloredPactAffinity > 0 && maxColoredDomainNeed > 0) {
      // Neutral card acts as wildcard Affinity fixer for whichever colored Pact domain needs it most
      score += Math.min(24, maxColoredDomainNeed * 9);
    } else if (coloredPactAffinity === 0 && totalPactAffinity < 6) {
      // Pure Neutral Sovereign advances Axial Affinity toward Matriz Horológica do Ponto Zero (6/6)
      score += Math.round(14 * w.domainExpansionEagerness);
    }

    // Empirical learned channel guidance
    if (prioSet.has(card.id)) {
      score += 18;
    }
    if (avoidSet.has(card.id) && (cardCountsById[card.id] ?? 0) <= 1) {
      score -= 32;
    }

    // Prefer channeling duplicates
    if ((cardCountsById[card.id] ?? 0) > 1) {
      score += 20;
    }

    // Prefer channeling excess Relics if board already has 3+ Relics
    if (card.type === 'relic' && activeRelicCount >= 3) {
      score += 28;
    }

    // Protect creatures in spell-heavy decks so actor never channels away its only board presence
    if (card.type === 'creature' && friendlyBoardCreatures + handCreatures <= 3) {
      score -= 28;
    } else if ((card.type === 'spell' || card.type === 'reaction') && handSpells >= 3) {
      score += 14;
    }

    // Protect Wheel General (#173 / break_domain_expansion) when enemy Domain Expansion is imminent or active!
    if (
      card.effects.some((e) => e.type === 'break_domain_expansion') &&
      enemyDomainThreatImminent &&
      (cardCountsById[card.id] ?? 0) <= 1
    ) {
      score -= 55;
    }

    // Protect active Synergy / Discovered Combo pieces when partner is in hand or on board
    if ((cardCountsById[card.id] ?? 0) <= 1) {
      const partners = getPartnerCardIds(resolvedProfile, card.id);
      if (partners.length > 0) {
        const hasPartnerAvailable = partners.some(
          (pid) =>
            boardCardIds.has(pid) ||
            aiState.hand.some((hc, hIdx) => hIdx !== i && hc.id === pid)
        );
        if (hasPartnerAvailable) {
          score -= Math.round(w.synergyHoldBonus);
        }
      }
    }

    // Prefer channeling cards too expensive to play for several turns
    const costGap = card.cost - nextEssence;
    if (costGap >= 3) {
      score += 25 + costGap * 3;
    } else if (costGap === 2) {
      score += 12;
    } else if (costGap <= 0) {
      score -= 15;
    }

    // Avoid channeling Legendary cards unless desperate
    if (card.rarity === 'legendary') {
      score -= 22;
    }

    if (score > bestScore) {
      bestScore = score;
      bestIndex = i;
    }
  }

  if (bestScore < 20) {
    return null;
  }

  return bestIndex;
}

/**
 * Scores all legal (row, slotIndex) placements for a creature, dynamically balancing
 * 1x Anti-AoE/Breath spread against 2x-3x Phalanx Stacking behind Guardians.
 */
function chooseBestCreaturePlacement(
  state: GameState,
  card: CardDefinition,
  actor: 'player' | 'ai',
  profile: DeckLearnedAiProfile
): { row: RowType; slotIndex: number; placementBonus: number } | null {
  const aiState = state[actor];
  const enemyActor: 'player' | 'ai' = actor === 'player' ? 'ai' : 'player';
  const enemyState = state[enemyActor];
  const w = profile.weights;

  const getVisibleEnemySlot = (row: RowType, col: number): BoardUnit[] =>
    getSlotUnits(enemyState, row, col).filter(
      (u) => !u.isTrap && !(state.roundSubPhase === 'deploy' && u.isConcealedDeploy)
    );

  const visibleEnemies = [0, 1, 2, 3, 4, 5].flatMap((col) => [
    ...getVisibleEnemySlot('vanguard', col),
    ...getVisibleEnemySlot('rearguard', col),
  ]);

  const enemyHasActiveBreathOrTrample = visibleEnemies.some(
    (u) => (u.card.breathDamage ?? 0) > 0 || u.keywords.includes('Atropelar')
  );
  const enemyHasAoEAffinity =
    (enemyState.affinities.red ?? 0) >= 2 ||
    (enemyState.affinities.blue ?? 0) >= 3 ||
    (enemyState.affinities.purple ?? 0) >= 3;

  const aoeDanger =
    (enemyHasActiveBreathOrTrample ? 1.65 : enemyHasAoEAffinity ? 1.05 : 0.4) *
    w.antiAoeSpreadBias;

  const friendlyHasMassBuff =
    aiState.hand.some((c) =>
      c.effects.some((e) => e.type === 'buff_all_allies' || e.type === 'shield_all_allies')
    ) ||
    getAllBoardUnits(aiState).some(
      (u) => !u.isTrap && u.card.type === 'relic'
    );

  const stackDesire = w.stackConsolidationBias * (friendlyHasMassBuff ? 1.25 : 1.0);

  const isGuardian =
    card.keywords.includes('Guardião') ||
    card.armor >= 2 ||
    card.keywords.includes('Escudo Divino');
  const isRangedOrSupport =
    card.keywords.includes('Alcance') || card.preferredRow === 'rearguard';
  const isEvasiveStriker =
    card.keywords.includes('Voo') ||
    card.keywords.includes('Ímpeto') ||
    card.keywords.includes('Atropelar') ||
    card.atk >= 5;

  const runeColSet = new Set((state.columnRunes ?? []).map((r) => r.slotIndex));

  let bestChoice: { row: RowType; slotIndex: number; placementBonus: number } | null = null;

  for (const row of ['vanguard', 'rearguard'] as const) {
    for (let col = 0; col < 6; col++) {
      if (!canDeployToSlot(aiState, row, col)) continue;

      const myVan = getSlotUnits(aiState, 'vanguard', col).filter((u) => !u.isTrap);
      const myRear = getSlotUnits(aiState, 'rearguard', col).filter((u) => !u.isTrap);
      const currentStack = row === 'vanguard' ? myVan : myRear;
      const stackLen = currentStack.length;

      const enVan = getVisibleEnemySlot('vanguard', col);
      const enRear = getVisibleEnemySlot('rearguard', col);
      const enVanAtk = enVan.reduce((s, u) => s + u.currentAtk, 0);

      let slotScore = 0;

      // 1. Row Role Fitness
      if (row === 'vanguard') {
        if (isGuardian) slotScore += 16 * w.guardianPriority;
        if (isRangedOrSupport && !isGuardian) slotScore -= 14;
        if (runeColSet.has(col)) slotScore += 34;
      } else {
        if (isRangedOrSupport) slotScore += 18 * w.flyingEvasionBias;
        if (isGuardian && myVan.length === 0 && enVan.length === 0) slotScore -= 10;
      }

      // 2. Sovereign Column Defense against Unblocked Enemy Vanguard
      if (enVan.length > 0 && myVan.length === 0 && myRear.length === 0) {
        const urgency = aiState.hp <= 22 ? 1.55 : 1.0;
        if (row === 'vanguard' && isGuardian) {
          slotScore += (22 + enVanAtk * 2.5) * w.guardianPriority * urgency;
        } else if (row === 'rearguard' && !isGuardian) {
          slotScore += (16 + enVanAtk * 2) * urgency;
        } else {
          slotScore += 12 * urgency;
        }
      }

      // 3. Column Formation Cover (+1 ATQ) & Relic Protection
      if (row === 'vanguard' && myRear.length > 0 && myVan.length === 0) {
        const hasRelicBehind = myRear.some((u) => u.card.type === 'relic');
        slotScore += (hasRelicBehind ? 24 : 15) * w.guardianPriority;
      }
      if (row === 'rearguard' && myVan.length > 0) {
        slotScore += 14 * w.flyingEvasionBias;
      }

      // 4. Open Breakthrough / Invasion Corridor
      if (row === 'vanguard' && enVan.length === 0 && enRear.length === 0) {
        slotScore += (isEvasiveStriker ? 19 : 11) * w.flyingEvasionBias;
      }

      // 5. Dynamic 1x Anti-AoE Spread vs 2x-3x Phalanx Stacking
      if (stackLen === 0) {
        slotScore += 12 * aoeDanger;
      } else {
        const frontUnit = currentStack[0];
        const frontIsSturdy =
          frontUnit &&
          (frontUnit.keywords.includes('Guardião') ||
            frontUnit.hasDivineShield ||
            frontUnit.currentArmor >= 2 ||
            frontUnit.currentHp >= 6);

        if (frontIsSturdy && stackDesire >= aoeDanger * 0.85) {
          slotScore += (stackDesire * 16 - aoeDanger * 6) + (stackLen === 1 ? 6 : 2);
        } else {
          slotScore -= (aoeDanger * 18 - stackDesire * 7) * stackLen;
        }
      }

      if (!bestChoice || slotScore > bestChoice.placementBonus) {
        bestChoice = { row, slotIndex: col, placementBonus: slotScore };
      }
    }
  }

  return bestChoice;
}

/**
 * Evaluates whether a card is worth playing right now and picks the optimal slot/target.
 */
function evaluateCardPlayValue(
  state: GameState,
  card: CardDefinition,
  actor: 'player' | 'ai' = 'ai',
  profile?: DeckLearnedAiProfile
): {
  shouldPlay: boolean;
  score: number;
  row?: RowType;
  slotIndex?: number;
  targetId?: string;
  asTrap?: boolean;
} {
  const resolvedProfile = profile ?? resolveLearnedProfileForActor(state, actor);
  const w = resolvedProfile.weights;
  const aiState = state[actor];
  const enemyActor: 'player' | 'ai' = actor === 'player' ? 'ai' : 'player';
  const playerState = state[enemyActor];
  const enemyUnits = getAllBoardUnits(playerState).filter(
    (u) => !u.isTrap && !(state.roundSubPhase === 'deploy' && u.isConcealedDeploy)
  );
  const friendlyUnits = getAllBoardUnits(aiState).filter((u) => !u.isTrap);

  // Check if corruption backlash would kill actor
  if (card.corruptionCost && card.corruptionCost > 0) {
    const projectedCorruption = Math.min(10, aiState.corruption + card.corruptionCost);
    if (projectedCorruption >= 10 && aiState.hp <= 2) {
      return { shouldPlay: false, score: -999 };
    }
  }

  // Empirical card boost & synergy sequencing bonus
  const empiricalBoost = resolvedProfile.highImpactCardBoosts[card.id] ?? 0;
  let synergyBonus = 0;
  const partners = getPartnerCardIds(resolvedProfile, card.id);
  if (partners.length > 0) {
    const boardCardIds = new Set(friendlyUnits.map((u) => u.card.id));
    const partnerOnBoard = partners.some((pid) => boardCardIds.has(pid));
    if (partnerOnBoard) {
      synergyBonus += Math.round(w.synergyHoldBonus * 1.15);
    } else {
      const partnerInHand = aiState.hand.find(
        (hc) => hc.id !== card.id && partners.includes(hc.id)
      );
      if (partnerInHand) {
        if (
          (card.type === 'creature' || card.type === 'relic') &&
          (partnerInHand.type === 'spell' ||
            partnerInHand.type === 'reaction' ||
            card.cost <= partnerInHand.cost)
        ) {
          // Deploy the enabler / body first!
          synergyBonus += Math.round(w.synergyHoldBonus * 0.7);
        }
      }
    }
  }

  const hasEnemyDomainActive = Boolean(
    state.domainExpansion &&
      (state.domainExpansion.owner === enemyActor ||
        state.domainExpansion.clashRival?.owner === enemyActor)
  );

  if (card.type === 'relic') {
    const activeRelics = friendlyUnits.filter((u) => u.card.type === 'relic').length;
    if (activeRelics >= 4) {
      return { shouldPlay: false, score: -999 };
    }
    const alliedCreatures = friendlyUnits.filter((u) => u.card.type === 'creature').length;
    const needsAlliesOnEnter = card.effects.some(
      (e) =>
        e.trigger === 'on_enter' &&
        (e.type === 'buff_all_allies' ||
          e.type === 'buff_target_ally' ||
          e.type === 'shield_all_allies')
    );
    const allySynergyBonus =
      needsAlliesOnEnter && alliedCreatures === 0 ? -30 : alliedCreatures * 6;
    const protectedCols = [0, 1, 2, 3, 4, 5].filter(
      (col) =>
        canDeployToSlot(aiState, 'rearguard', col) &&
        getSlotUnits(aiState, 'vanguard', col).length > 0
    );
    const emptyRearCols = [0, 1, 2, 3, 4, 5].filter(
      (col) => getSlotUnits(aiState, 'rearguard', col).length === 0
    );
    const chosenRelicCol =
      protectedCols[0] ??
      emptyRearCols[0] ??
      [0, 1, 2, 3, 4, 5].find((col) => canDeployToSlot(aiState, 'rearguard', col));

    if (chosenRelicCol === undefined) {
      return { shouldPlay: false, score: -999 };
    }

    let bestTargetId: string | undefined;
    for (const eff of card.effects) {
      if (eff.trigger === 'on_enter') {
        if (
          eff.type === 'damage_single_enemy' ||
          eff.type === 'destroy_enemy' ||
          eff.type === 'freeze_enemy' ||
          eff.type === 'bounce_enemy' ||
          eff.type === 'vaelen_astral_stigma' ||
          eff.type === 'lyriel_astral_zero'
        ) {
          if (enemyUnits.length > 0) {
            const sorted = [...enemyUnits].sort(
              (a, b) => b.currentAtk * 2 + b.currentHp - (a.currentAtk * 2 + a.currentHp)
            );
            bestTargetId = sorted[0].instanceId;
          }
        } else if (
          eff.type === 'buff_target_ally' ||
          eff.type === 'heal_target_ally' ||
          eff.type === 'aelion_solar_edict'
        ) {
          const pool =
            eff.type === 'aelion_solar_edict'
              ? friendlyUnits.filter((u) => !u.hasDivineShield)
              : friendlyUnits;
          if (pool.length > 0) {
            const sorted = [...pool].sort((a, b) => b.currentAtk - a.currentAtk);
            bestTargetId = sorted[0].instanceId;
          }
        }
      }
    }
    const relicScore = Math.round(
      (50 + card.cost * 8) * w.relicPriority + allySynergyBonus + empiricalBoost + synergyBonus
    );
    return {
      shouldPlay: true,
      score: relicScore,
      row: 'rearguard',
      slotIndex: chosenRelicCol,
      targetId: bestTargetId,
    };
  }

  if (card.type === 'creature') {
    const placement = chooseBestCreaturePlacement(state, card, actor, resolvedProfile);
    if (!placement) {
      return { shouldPlay: false, score: -999 };
    }

    let bestTargetId: string | undefined;
    for (const eff of card.effects) {
      if (eff.trigger === 'on_enter') {
        if (
          eff.type === 'damage_single_enemy' ||
          eff.type === 'destroy_enemy' ||
          eff.type === 'freeze_enemy' ||
          eff.type === 'bounce_enemy' ||
          eff.type === 'vaelen_astral_stigma' ||
          eff.type === 'lyriel_astral_zero'
        ) {
          if (enemyUnits.length > 0) {
            const sorted = [...enemyUnits].sort(
              (a, b) => b.currentAtk * 2 + b.currentHp - (a.currentAtk * 2 + a.currentHp)
            );
            bestTargetId = sorted[0].instanceId;
          }
        } else if (
          eff.type === 'buff_target_ally' ||
          eff.type === 'heal_target_ally' ||
          eff.type === 'aelion_solar_edict'
        ) {
          const pool =
            eff.type === 'aelion_solar_edict'
              ? friendlyUnits.filter((u) => !u.hasDivineShield)
              : friendlyUnits;
          if (pool.length > 0) {
            const sorted = [...pool].sort((a, b) => b.currentAtk - a.currentAtk);
            bestTargetId = sorted[0].instanceId;
          }
        }
      }
    }

    const domainBreakerBonus =
      hasEnemyDomainActive && card.effects.some((e) => e.type === 'break_domain_expansion')
        ? 110
        : !hasEnemyDomainActive && card.effects.some((e) => e.type === 'break_domain_expansion')
        ? -14
        : 0;

    const guardianBonus = card.keywords.includes('Guardião')
      ? Math.round(10 * (w.guardianPriority - 1))
      : 0;
    const evasionBonus =
      card.keywords.includes('Voo') || card.keywords.includes('Alcance')
        ? Math.round(10 * (w.flyingEvasionBias - 1))
        : 0;
    const ascensionPotentialBonus = card.ascension
      ? Math.round(8 * w.ascensionEagerness)
      : 0;

    const baseScore = Math.round(
      40 +
        card.cost * 10 +
        card.atk * 4 +
        card.hp * 3 +
        placement.placementBonus * 0.35 +
        domainBreakerBonus +
        guardianBonus +
        evasionBonus +
        ascensionPotentialBonus +
        empiricalBoost +
        synergyBonus
    );
    return {
      shouldPlay: true,
      score: baseScore,
      row: placement.row,
      slotIndex: placement.slotIndex,
      targetId: bestTargetId,
    };
  }

  // Spell or Reaction
  let spellScore = 30 + card.cost * 8 + empiricalBoost + synergyBonus;
  let targetId: string | undefined;
  let usefulEffectFound = false;

  for (const eff of card.effects) {
    switch (eff.type) {
      case 'damage_enemy_row':
      case 'freeze_enemy_vanguard':
      case 'debuff_enemy_vanguard_atk': {
        if (enemyUnits.length > 0) {
          if (
            card.cost >= 5 &&
            enemyUnits.length === 1 &&
            enemyUnits[0].currentAtk <= 2 &&
            aiState.hp > 22 &&
            w.spellHoldPatience >= 1.25
          ) {
            spellScore -= Math.round((w.spellHoldPatience - 1.0) * 40);
          } else {
            usefulEffectFound = true;
            spellScore += enemyUnits.length * 19 - Math.round((w.spellHoldPatience - 1.0) * 10);
          }
        }
        break;
      }
      case 'damage_single_enemy': {
        if (enemyUnits.length > 0) {
          usefulEffectFound = true;
          const killable = enemyUnits.filter(
            (u) => !u.hasDivineShield && u.currentHp <= Math.max(1, eff.value - u.currentArmor)
          );
          const pool = killable.length > 0 ? killable : enemyUnits;
          const sorted = [...pool].sort(
            (a, b) => b.currentAtk * 2 + b.currentHp - (a.currentAtk * 2 + a.currentHp)
          );
          targetId = sorted[0].instanceId;
          spellScore += killable.length > 0 ? 34 : 22;
        } else if (playerState.hp <= eff.value + 3) {
          usefulEffectFound = true;
          spellScore += 55;
        }
        break;
      }
      case 'destroy_enemy':
      case 'bounce_enemy':
      case 'freeze_enemy': {
        if (enemyUnits.length > 0) {
          const sorted = [...enemyUnits].sort(
            (a, b) => b.currentAtk * 2 + b.currentHp - (a.currentAtk * 2 + a.currentHp)
          );
          if (
            eff.type === 'destroy_enemy' &&
            card.cost >= 4 &&
            sorted[0].card.cost <= 1 &&
            sorted[0].currentAtk <= 2 &&
            aiState.hp > 22 &&
            w.spellHoldPatience >= 1.2
          ) {
            spellScore -= 25;
          } else {
            usefulEffectFound = true;
            targetId = sorted[0].instanceId;
            spellScore += sorted[0].card.cost * 10 + sorted[0].currentAtk * 3;
          }
        }
        break;
      }
      case 'damage_all_units': {
        if (enemyUnits.length > friendlyUnits.length) {
          usefulEffectFound = true;
          spellScore += (enemyUnits.length - friendlyUnits.length) * 24;
        }
        break;
      }
      case 'damage_enemy_sovereign': {
        usefulEffectFound = true;
        if (playerState.hp <= eff.value) {
          spellScore += 240; // Immediate Lethal!
        } else {
          spellScore += Math.round(20 * w.aggroFaceBias);
        }
        break;
      }
      case 'heal_sovereign': {
        if (aiState.hp <= aiState.maxHp - 3) {
          usefulEffectFound = true;
          spellScore += aiState.hp <= 15 ? 42 : 25;
        }
        break;
      }
      case 'heal_all_allies':
      case 'heal_target_ally': {
        const damagedAllies = friendlyUnits.filter((u) => u.currentHp < u.maxHp);
        if (damagedAllies.length > 0 || aiState.hp < aiState.maxHp - 3) {
          usefulEffectFound = true;
          if (damagedAllies.length > 0) {
            damagedAllies.sort((a, b) => b.currentAtk - a.currentAtk);
            targetId = damagedAllies[0].instanceId;
          }
          spellScore += 24;
        }
        break;
      }
      case 'buff_target_ally':
      case 'buff_all_allies':
      case 'shield_all_allies': {
        const creatureAllies = friendlyUnits.filter((u) => u.card.type === 'creature');
        if (creatureAllies.length > 0) {
          usefulEffectFound = true;
          creatureAllies.sort((a, b) => b.currentAtk - a.currentAtk);
          targetId = creatureAllies[0].instanceId;
          spellScore += creatureAllies.length * 15;
        }
        break;
      }
      case 'revive_from_crypt': {
        const hasCryptCreature = aiState.crypt.some((c) => c.type === 'creature');
        const hasBoardSpace = [0, 1, 2, 3, 4, 5].some(
          (col) =>
            canDeployToSlot(aiState, 'vanguard', col) ||
            canDeployToSlot(aiState, 'rearguard', col)
        );
        if (hasCryptCreature && hasBoardSpace) {
          usefulEffectFound = true;
          spellScore += 48;
        }
        break;
      }
      case 'break_domain_expansion': {
        if (hasEnemyDomainActive) {
          usefulEffectFound = true;
          spellScore += 110;
        }
        break;
      }
      case 'draw_cards':
      case 'grant_bonus_essence':
      case 'summon_token': {
        usefulEffectFound = true;
        spellScore += 26;
        break;
      }
      case 'steal_small_enemy': {
        const maxAtk = eff.value > 0 ? eff.value : 3;
        const stealable = enemyUnits.filter(
          (u) => u.card.type === 'creature' && u.currentAtk <= maxAtk
        );
        if (stealable.length > 0) {
          usefulEffectFound = true;
          stealable.sort((a, b) => b.currentAtk - a.currentAtk);
          targetId = stealable[0].instanceId;
          spellScore += 48;
        }
        break;
      }
      case 'magmatic_subduction': {
        if (enemyUnits.length > 0) {
          const vanEnemies = enemyUnits.filter((u) => u.row === 'vanguard');
          const pool = vanEnemies.length > 0 ? vanEnemies : enemyUnits;
          const scored = pool
            .map((u) => {
              const rearOccupied = getSlotUnits(playerState, 'rearguard', u.slotIndex).some(
                (r) => !r.isTrap && r.currentHp > 0
              );
              const colArmor =
                u.currentArmor +
                getSlotUnits(playerState, 'rearguard', u.slotIndex).reduce(
                  (acc, r) => acc + r.currentArmor,
                  0
                );
              return {
                unit: u,
                val: u.currentAtk * 2 + colArmor * 6 + (rearOccupied ? 16 : 0),
              };
            })
            .sort((a, b) => b.val - a.val);
          usefulEffectFound = true;
          targetId = scored[0].unit.instanceId;
          spellScore += 34 + Math.min(30, scored[0].val);
        }
        break;
      }
      case 'crimson_anvil_march': {
        const creatureAllies = friendlyUnits.filter((u) => u.card.type === 'creature');
        if (creatureAllies.length >= 2 || (creatureAllies.length === 1 && playerState.hp <= 8)) {
          usefulEffectFound = true;
          spellScore += creatureAllies.length * 24 + (playerState.hp <= 10 ? 25 : 0);
        }
        break;
      }
      case 'coordinate_inversion': {
        if (enemyUnits.length > 0) {
          const scoredCols = [0, 1, 2, 3, 4, 5]
            .map((col) => {
              const van = enemyUnits.filter((u) => u.slotIndex === col && u.row === 'vanguard');
              const rear = enemyUnits.filter((u) => u.slotIndex === col && u.row === 'rearguard');
              if (van.length === 0 && rear.length === 0) return null;
              const guardianBonus = van.some((u) => u.keywords.includes('Guardião')) ? 20 : 0;
              const swapBonus = van.length > 0 && rear.length > 0 ? 18 : 0;
              const pick = van[0] ?? rear[0];
              return {
                pick,
                val: van.length * 14 + rear.length * 10 + guardianBonus + swapBonus,
              };
            })
            .filter((x): x is { pick: (typeof enemyUnits)[number]; val: number } => Boolean(x))
            .sort((a, b) => b.val - a.val);
          if (scoredCols.length > 0) {
            usefulEffectFound = true;
            targetId = scoredCols[0].pick.instanceId;
            spellScore += 24 + Math.min(36, scoredCols[0].val);
          }
        }
        break;
      }
      case 'horizon_singularity': {
        const vanEnemies = enemyUnits.filter((u) => u.row === 'vanguard');
        if (vanEnemies.length >= 2) {
          usefulEffectFound = true;
          spellScore += vanEnemies.length * 26;
        }
        break;
      }
      case 'shared_shadow_link': {
        const creatureAllies = friendlyUnits.filter((u) => u.card.type === 'creature');
        if (creatureAllies.length > 0 && enemyUnits.length > 0) {
          const sortedEnemies = [...enemyUnits].sort(
            (a, b) => b.currentAtk * 2 + b.currentHp - (a.currentAtk * 2 + a.currentHp)
          );
          usefulEffectFound = true;
          targetId = sortedEnemies[0].instanceId;
          spellScore += 36 + Math.min(24, sortedEnemies[0].currentHp * 3);
        }
        break;
      }
      case 'twilight_procession': {
        const distinctCryptCreatures = new Set(
          aiState.crypt.filter((c) => c.type === 'creature').map((c) => c.id)
        ).size;
        const hasBoardSpace = [0, 1, 2, 3, 4, 5].some(
          (col) =>
            canDeployToSlot(aiState, 'vanguard', col) ||
            canDeployToSlot(aiState, 'rearguard', col)
        );
        if (distinctCryptCreatures >= 2 && hasBoardSpace) {
          usefulEffectFound = true;
          spellScore += Math.min(3, distinctCryptCreatures) * 28;
        }
        break;
      }
      case 'food_chain_law': {
        const creatureAllies = friendlyUnits.filter((u) => u.card.type === 'creature');
        if (creatureAllies.length > 0 && enemyUnits.length > 0) {
          const sortedAllies = [...creatureAllies].sort(
            (a, b) => b.currentAtk - a.currentAtk || b.maxHp - a.maxHp
          );
          const predator = sortedAllies[0];
          const killablePrey = enemyUnits.filter(
            (e) =>
              !e.hasDivineShield &&
              e.currentHp <= Math.max(1, predator.currentAtk - e.currentArmor)
          );
          const pool = killablePrey.length > 0 ? killablePrey : enemyUnits;
          const sortedPrey = [...pool].sort(
            (a, b) =>
              b.keywords.length * 6 + b.currentAtk * 2 - (a.keywords.length * 6 + a.currentAtk * 2)
          );
          usefulEffectFound = true;
          targetId = sortedPrey[0].instanceId;
          spellScore += (killablePrey.length > 0 ? 44 : 26) + sortedPrey[0].keywords.length * 6;
        }
        break;
      }
      case 'primordial_evolution_apex': {
        const creatureAllies = friendlyUnits.filter((u) => u.card.type === 'creature');
        if (creatureAllies.length >= 2) {
          const unascendedCount = creatureAllies.filter(
            (u) => Boolean(u.card.ascension) && !u.isAscended
          ).length;
          usefulEffectFound = true;
          spellScore += creatureAllies.length * 25 + unascendedCount * 15;
        }
        break;
      }
      case 'solar_spear_phalanx': {
        const vanAllies = friendlyUnits.filter(
          (u) => u.card.type === 'creature' && u.row === 'vanguard'
        );
        if (vanAllies.length >= 2 && enemyUnits.length > 0) {
          usefulEffectFound = true;
          spellScore += vanAllies.length * 22;
        }
        break;
      }
      case 'unconquered_champion_oath': {
        const creatureAllies = friendlyUnits.filter(
          (u) => u.card.type === 'creature' && !u.isCrownProtector
        );
        if (creatureAllies.length > 0) {
          creatureAllies.sort(
            (a, b) =>
              (b.row === 'vanguard' ? 10 : 0) +
              b.maxHp * 2 +
              b.currentArmor * 4 -
              ((a.row === 'vanguard' ? 10 : 0) + a.maxHp * 2 + a.currentArmor * 4)
          );
          usefulEffectFound = true;
          targetId = creatureAllies[0].instanceId;
          spellScore += 48 + (aiState.hp <= 18 ? 26 : 0);
        }
        break;
      }
      case 'royal_prism_convergence': {
        const distinctColors = new Set(
          aiState.channeledCards.map((c) => c.domain).filter((d) => d !== 'neutral')
        ).size;
        if (distinctColors >= 2 || (distinctColors >= 1 && enemyUnits.length >= 2)) {
          usefulEffectFound = true;
          spellScore += distinctColors * 24;
        }
        break;
      }
    }
  }

  if (card.type === 'reaction' && !usefulEffectFound) {
    const openRearSlots = [0, 1, 2, 3, 4, 5].filter(
      (col) => getSlotUnits(aiState, 'rearguard', col).length === 0
    );
    if (openRearSlots.length > 0) {
      const priorityCol =
        openRearSlots.find((col) => getSlotUnits(playerState, 'vanguard', col).length > 0) ??
        openRearSlots[0];
      return {
        shouldPlay: true,
        score: 48 + card.cost * 6 + empiricalBoost,
        row: 'rearguard',
        slotIndex: priorityCol,
        asTrap: true,
      };
    }
  }

  return {
    shouldPlay: usefulEffectFound,
    score: spellScore,
    targetId,
  };
}

/**
 * Checks whether triggering Sovereign Blood Pact (-3 HP, +1 Corruption -> +1 Essence)
 * immediately unlocks a high-impact card or lethal play this turn.
 */
function shouldTriggerBloodPact(
  state: GameState,
  actor: 'player' | 'ai',
  profile: DeckLearnedAiProfile,
  enemyTotalReadyAtk: number
): boolean {
  if (!canUseBloodPact(state, actor)) return false;
  const actorState = state[actor];
  const w = profile.weights;

  if (actorState.hp < w.bloodPactThresholdHp) return false;
  if (actorState.corruption >= 8) return false;
  if (actorState.hp - 3 <= enemyTotalReadyAtk + 3) return false;

  const targetCost = actorState.currentEssence + 1;
  for (const card of actorState.hand) {
    if (card.cost !== targetCost) continue;
    if (card.domain !== 'neutral') {
      const aff = (actorState.affinities[card.domain] ?? 0) + (actorState.affinities.neutral ?? 0);
      if (aff < card.affinityReq) continue;
    }
    const evalRes = evaluateCardPlayValue(state, card, actor, profile);
    if (evalRes.shouldPlay && evalRes.score >= 88) {
      return true;
    }
  }

  return false;
}

/**
 * Evaluates free 0-Essence Tactical Row Maneuver (1x/turn) to protect wounded/ranged units
 * or advance healthy Vanguard bruisers into open invasion lanes.
 */
function chooseTacticalRowManeuver(
  state: GameState,
  actor: 'player' | 'ai'
): string | null {
  const actorState = state[actor];
  if (actorState.hasMovedThisTurn) return null;
  const enemyActor: 'player' | 'ai' = actor === 'player' ? 'ai' : 'player';
  const enemyState = state[enemyActor];

  for (const unit of getAllBoardUnits(actorState)) {
    if (unit.isTrap || unit.card.type !== 'creature' || unit.isFrozen) continue;
    if (!canMoveUnitRow(state, actor, unit.instanceId)) continue;

    const col = unit.slotIndex;
    const enVan = getSlotUnits(enemyState, 'vanguard', col).filter((u) => !u.isTrap);
    const myVan = getSlotUnits(actorState, 'vanguard', col).filter((u) => !u.isTrap);
    const myRear = getSlotUnits(actorState, 'rearguard', col).filter((u) => !u.isTrap);

    // Case A: Retreat a Ranged / Ascension / wounded high-ATK unit from Vanguard when Rearguard in same col is open
    if (
      unit.row === 'vanguard' &&
      myRear.length === 0 &&
      (unit.keywords.includes('Alcance') ||
        (unit.currentHp <= 2 && unit.currentAtk >= 4 && enVan.length > 0))
    ) {
      return unit.instanceId;
    }

    // Case B: Advance a healthy non-Ranged melee bruiser from Rearguard into an empty Vanguard invasion lane
    if (
      unit.row === 'rearguard' &&
      !unit.keywords.includes('Alcance') &&
      unit.currentAtk >= 3 &&
      unit.currentHp >= 3 &&
      myVan.length === 0 &&
      enVan.length === 0
    ) {
      return unit.instanceId;
    }
  }

  return null;
}

/**
 * Estimates the unblocked face damage `enemyActor` threatens on their upcoming turn
 * (1-ply Anti-Lethal Minimax safety check for Tier V Sovereign Apex AI).
 */
function estimateEnemyCounterLethalDamage(
  state: GameState,
  actor: 'player' | 'ai'
): number {
  const enemyActor: 'player' | 'ai' = actor === 'player' ? 'ai' : 'player';
  const mySide = state[actor];
  const enemySide = state[enemyActor];

  const myUnits = getAllBoardUnits(mySide).filter(
    (u) => !u.isTrap && u.card.type === 'creature' && u.currentHp > 0
  );
  const enemyUnits = getAllBoardUnits(enemySide).filter(
    (u) => !u.isTrap && u.card.type === 'creature' && u.currentHp > 0 && !u.isFrozen
  );
  if (enemyUnits.length === 0) return 0;

  if (isSureHitActiveFor(state, enemyActor)) {
    return enemyUnits.reduce((sum, u) => sum + Math.max(0, u.currentAtk), 0);
  }

  let guardianEhpPool = 0;
  const colVanguardEhp = new Float64Array(mySide.vanguardStacks.length);
  const colAirBlocker = new Uint8Array(mySide.vanguardStacks.length);

  for (const u of myUnits) {
    const ehp = u.currentHp + Math.max(0, u.currentArmor) + (u.hasDivineShield ? 3 : 0);
    if (!u.isFrozen && u.keywords.includes('Guardião')) {
      guardianEhpPool += ehp;
    } else if (u.row === 'vanguard') {
      colVanguardEhp[u.slotIndex] += ehp;
    }
    if (!u.isFrozen && (u.keywords.includes('Voo') || u.keywords.includes('Alcance'))) {
      colAirBlocker[u.slotIndex] = 1;
    }
  }

  let projectedFaceDmg = 0;
  // Sort enemy attackers strongest-first to simulate optimal enemy breakthrough
  const sortedEnemy = enemyUnits.slice().sort((a, b) => b.currentAtk - a.currentAtk);

  for (const eu of sortedEnemy) {
    const atk = Math.max(0, eu.currentAtk);
    if (atk <= 0) continue;

    if (guardianEhpPool > 0) {
      if (eu.keywords.includes('Atropelar') && atk > guardianEhpPool) {
        projectedFaceDmg += atk - guardianEhpPool;
      }
      guardianEhpPool = Math.max(0, guardianEhpPool - atk);
      continue;
    }

    const col = eu.slotIndex;
    const isFlying = eu.keywords.includes('Voo');
    if (isFlying && !colAirBlocker[col]) {
      projectedFaceDmg += atk;
      continue;
    }

    if (colVanguardEhp[col] > 0) {
      if (eu.keywords.includes('Atropelar') && atk > colVanguardEhp[col]) {
        projectedFaceDmg += atk - colVanguardEhp[col];
      }
      colVanguardEhp[col] = Math.max(0, colVanguardEhp[col] - atk);
    } else {
      projectedFaceDmg += atk;
    }
  }

  return projectedFaceDmg;
}

/**
 * Chooses the best attack target for a ready unit, factoring in combined multi-unit lethal,
 * learned aggro vs value-trade weights, Tier Softmax temperature, and Tier V Anti-Lethal check.
 */
function chooseBestTargetForAttacker(
  state: GameState,
  attacker: BoardUnit,
  validTargets: string[],
  actor: 'player' | 'ai' = 'ai',
  profile?: DeckLearnedAiProfile,
  hasCombinedLethal = false,
  skillTier: AiSkillTier = 3
): string | null {
  if (validTargets.length === 0) return null;

  const tierSpec = AI_SKILL_TIER_SPECS[skillTier];
  const resolvedProfile = profile ?? resolveLearnedProfileForActor(state, actor);
  const w = resolvedProfile.weights;
  const actorState = state[actor];
  const enemyActor: 'player' | 'ai' = actor === 'player' ? 'ai' : 'player';
  const enemyState = state[enemyActor];
  const enemySovId = `${enemyActor}-sovereign`;

  const canHitFace = validTargets.includes(enemySovId);

  // Tier 2+ always spots exact lethal; Tier 1 may occasionally miss multi-unit lethal
  if (
    canHitFace &&
    skillTier >= 2 &&
    (hasCombinedLethal || isSureHitActiveFor(state, actor) || enemyState.hp <= attacker.currentAtk)
  ) {
    return enemySovId;
  }

  const projectedCounterDmg =
    tierSpec.antiLethalLookahead && !hasCombinedLethal
      ? estimateEnemyCounterLethalDamage(state, actor)
      : 0;
  // Trigger anti-lethal defensive trading strictly when enemy has true board lethal next turn
  // AND enemy Sovereign isn't already on the brink of falling to burn/follow-up
  const counterLethalDanger =
    projectedCounterDmg >= actorState.hp && enemyState.hp > attacker.currentAtk + 5;

  const isRangedFreeHit =
    attacker.row === 'rearguard' && attacker.keywords.includes('Alcance');
  const hasLethalTouch = attacker.keywords.includes('Toque Letal');

  const candidateIds: string[] = [];
  const candidateScores: number[] = [];

  for (const targetId of validTargets) {
    if (targetId === enemySovId) {
      let faceScore = attacker.currentAtk * 4.5 * w.aggroFaceBias;
      if (enemyState.hp <= 12) {
        faceScore += 26 * w.aggroFaceBias;
      }
      if (attacker.keywords.includes('Dreno de Vida') && actorState.hp < actorState.maxHp) {
        faceScore += 12;
      }
      if (counterLethalDanger && !attacker.keywords.includes('Dreno de Vida')) {
        faceScore -= 130;
      }
      candidateIds.push(targetId);
      candidateScores.push(faceScore);
      continue;
    }

    const found = findUnitOnBoard(state, targetId);
    if (!found) continue;
    const defender = found.unit;

    let tradeScore = 0;

    const dmgToDef = defender.hasDivineShield
      ? 0
      : defender.currentArmor < attacker.currentAtk
      ? Math.max(1, attacker.currentAtk - defender.currentArmor)
      : 0;

    const killsDefender =
      !defender.hasDivineShield &&
      (dmgToDef >= defender.currentHp || (dmgToDef > 0 && hasLethalTouch));

    const dmgToAttacker =
      isRangedFreeHit || attacker.hasDivineShield || defender.card.type === 'relic'
        ? 0
        : attacker.currentArmor < defender.currentAtk
        ? Math.max(1, defender.currentAtk - attacker.currentArmor)
        : 0;

    const attackerSurvives =
      dmgToAttacker < attacker.currentHp &&
      !(dmgToAttacker > 0 && defender.keywords.includes('Toque Letal'));

    if (killsDefender) {
      tradeScore +=
        (35 + defender.currentAtk * 6 + defender.card.cost * 4) * w.tradeValueBias;
      if (attackerSurvives) {
        tradeScore += 26 * w.tradeValueBias;
      } else {
        tradeScore += (defender.card.cost - attacker.card.cost) * 8;
      }
      if (counterLethalDanger && defender.currentAtk >= 2) {
        tradeScore += 65 + defender.currentAtk * 8;
      }
    } else if (defender.hasDivineShield && attacker.currentAtk <= 3) {
      tradeScore += 24 * w.tradeValueBias;
      if (counterLethalDanger && defender.currentAtk >= 3) {
        tradeScore += 25;
      }
    } else if (defender.card.type === 'relic') {
      tradeScore += (18 + dmgToDef * 5) * w.tradeValueBias;
    } else {
      tradeScore += dmgToDef * 3 * w.tradeValueBias;
      if (!attackerSurvives && skillTier >= 2) {
        tradeScore -= 30;
      }
    }

    if (isRangedFreeHit && skillTier >= 2) {
      tradeScore += 15;
    }

    candidateIds.push(targetId);
    candidateScores.push(tradeScore);
  }

  const pickedIdx = selectIndexWithTemperature(candidateScores, tierSpec.temperature);
  return pickedIdx >= 0 ? candidateIds[pickedIdx] : validTargets[0];
}

type MainPhaseCandidateAction =
  | {
      kind: 'play_card';
      handIndex: number;
      cardId: string;
      cardName: string;
      cardCost: number;
      options: { row?: RowType; slotIndex?: number; targetId?: string; asTrap?: boolean };
      heuristicScore: number;
    }
  | {
      kind: 'ascend';
      unitId: string;
      unitName: string;
      newName: string;
      heuristicScore: number;
    }
  | {
      kind: 'maneuver';
      unitId: string;
      heuristicScore: number;
    }
  | {
      kind: 'sov_power';
      powerName: string;
      heuristicScore: number;
    };

function enumerateMainPhaseCandidates(
  state: GameState,
  actor: 'player' | 'ai',
  profile: DeckLearnedAiProfile,
  allowRowManeuver: boolean
): MainPhaseCandidateAction[] {
  const actorState = state[actor];
  const w = profile.weights;
  const actions: MainPhaseCandidateAction[] = [];
  const seenHandCardIds = new Set<string>();

  for (let i = 0; i < actorState.hand.length; i++) {
    const card = actorState.hand[i];
    if (seenHandCardIds.has(card.id)) continue;
    if (!canPlayCard(state, actor, card).allowed) continue;

    const evalResult = evaluateCardPlayValue(state, card, actor, profile);
    if (!evalResult.shouldPlay) continue;
    seenHandCardIds.add(card.id);
    actions.push({
      kind: 'play_card',
      handIndex: i,
      cardId: card.id,
      cardName: card.name,
      cardCost: card.cost,
      options: {
        row: evalResult.row,
        slotIndex: evalResult.slotIndex,
        targetId: evalResult.targetId,
        asTrap: evalResult.asTrap,
      },
      heuristicScore: evalResult.score,
    });
  }

  for (const unit of getAllBoardUnits(actorState)) {
    if (canAscendUnit(state, actor, unit.instanceId)) {
      actions.push({
        kind: 'ascend',
        unitId: unit.instanceId,
        unitName: unit.card.name,
        newName: unit.card.ascension?.newName ?? unit.card.name,
        heuristicScore: 42 * w.ascensionEagerness,
      });
    }
  }

  if (allowRowManeuver) {
    const maneuverId = chooseTacticalRowManeuver(state, actor);
    if (maneuverId) {
      actions.push({
        kind: 'maneuver',
        unitId: maneuverId,
        heuristicScore: 22,
      });
    }
  }

  if (canUseSovereignPower(state, actor) && w.sovPowerTempoBias >= 0.55) {
    const pwr = getSovereignPowerInfo(actorState);
    actions.push({
      kind: 'sov_power',
      powerName: pwr.name,
      heuristicScore: 18 * w.sovPowerTempoBias,
    });
  }

  return actions;
}

function applyCandidateAction(
  state: GameState,
  actor: 'player' | 'ai',
  action: MainPhaseCandidateAction
): GameState {
  switch (action.kind) {
    case 'play_card':
      return playCard(state, actor, action.handIndex, action.options);
    case 'ascend':
      return ascendUnit(state, actor, action.unitId);
    case 'maneuver':
      return moveUnitRow(state, actor, action.unitId);
    case 'sov_power':
      return useSovereignPower(state, actor);
  }
}

/**
 * Multi-step Turn Beam Search (Tier IV & V) over non-greedy Main Phase action orderings
 * evaluated with the trained Domain Value MLP on fair deck-rotated lookahead states.
 */
function findBestMainPhaseActionViaBeamSearch(
  state: GameState,
  actor: 'player' | 'ai',
  profile: DeckLearnedAiProfile,
  mlp: SerializedValueMlp | null,
  beamWidth: number,
  beamDepth: number,
  temperature: number
): MainPhaseCandidateAction | null {
  const fairRoot = createFairLookaheadState(state, actor);
  const rootCandidates = enumerateMainPhaseCandidates(fairRoot, actor, profile, true);
  if (rootCandidates.length === 0) return null;

  const baseValue = evaluateStateWithValueMlp(fairRoot, actor, mlp);

  interface BeamNode {
    state: GameState;
    rootAction: MainPhaseCandidateAction;
    cumHeuristic: number;
    score: number;
  }

  let beam: BeamNode[] = [];
  for (const cand of rootCandidates) {
    const nextS = applyCandidateAction(fairRoot, actor, cand);
    if (nextS === fairRoot) continue;
    const v = evaluateStateWithValueMlp(nextS, actor, mlp);
    const score = (v - baseValue) * 115 + cand.heuristicScore * 0.45;
    beam.push({
      state: nextS,
      rootAction: cand,
      cumHeuristic: cand.heuristicScore,
      score,
    });
  }

  if (beam.length === 0) return null;
  beam.sort((a, b) => b.score - a.score);
  if (beam.length > beamWidth) beam = beam.slice(0, beamWidth);

  for (let d = 1; d < beamDepth; d++) {
    const nextBeam: BeamNode[] = [];
    let anyExpanded = false;

    for (const node of beam) {
      if (node.state.phase === 'gameover') {
        nextBeam.push(node);
        continue;
      }
      const nextActions = enumerateMainPhaseCandidates(node.state, actor, profile, true);
      if (nextActions.length === 0) {
        nextBeam.push(node);
        continue;
      }

      // Expand top 4 heuristic follow-ups per beam state to keep search ultra-fast (< 1ms)
      nextActions.sort((a, b) => b.heuristicScore - a.heuristicScore);
      const limit = Math.min(4, nextActions.length);
      for (let k = 0; k < limit; k++) {
        const act = nextActions[k];
        const s2 = applyCandidateAction(node.state, actor, act);
        if (s2 === node.state) continue;
        anyExpanded = true;
        const v2 = evaluateStateWithValueMlp(s2, actor, mlp);
        const stepH = act.kind === 'maneuver' ? 4 : act.heuristicScore * 0.35;
        const cumH = node.cumHeuristic + stepH * Math.pow(0.75, d);
        const totalScore = (v2 - baseValue) * 140 + cumH * 0.42;
        nextBeam.push({
          state: s2,
          rootAction: node.rootAction,
          cumHeuristic: cumH,
          score: totalScore,
        });
      }
    }

    if (!anyExpanded) break;
    nextBeam.sort((a, b) => b.score - a.score);
    beam = nextBeam.slice(0, beamWidth);
  }

  // Group best leaf score by distinct rootAction
  const bestByRoot = new Map<MainPhaseCandidateAction, number>();
  for (const b of beam) {
    const prev = bestByRoot.get(b.rootAction);
    if (prev === undefined || b.score > prev) {
      bestByRoot.set(b.rootAction, b.score);
    }
  }

  const rootList = Array.from(bestByRoot.keys());
  const rootScores = rootList.map((r) => bestByRoot.get(r)!);
  const chosenIdx = selectIndexWithTemperature(rootScores, temperature);
  return chosenIdx >= 0 ? rootList[chosenIdx] : rootList[0];
}

/**
 * Executes a single tactical step for the specified actor ('player' or 'ai'),
 * scaling decision quality, Value MLP evaluation, Beam Search, and Anti-Lethal defense
 * across Tiers I..V.
 */
export function executeTurnStepForActor(
  state: GameState,
  actor: 'player' | 'ai',
  overrides?: AiProfileOverrides
): {
  nextState: GameState;
  done: boolean;
  actionSummary: string;
  attackerId?: string;
  targetId?: string;
} {
  if (state.phase === 'gameover') {
    return { nextState: state, done: true, actionSummary: 'Partida encerrada.' };
  }

  if (state.activePlayer !== actor) {
    return { nextState: state, done: true, actionSummary: 'Turno do oponente.' };
  }

  const skillTier = resolveSkillTierForActor(state, actor, overrides);
  const tierSpec = AI_SKILL_TIER_SPECS[skillTier];
  const profile = getProfileForActor(state, actor, overrides);
  const valueMlp = tierSpec.useValueMlp ? getValueMlpForActor(state, actor, overrides) : null;
  const w = profile.weights;
  const actorState = state[actor];
  const enemyActor: 'player' | 'ai' = actor === 'player' ? 'ai' : 'player';
  const enemyState = state[enemyActor];

  // Step 1: Channel a card if not yet channeled this turn
  if (!actorState.hasChanneledThisTurn) {
    // Tier 1 occasionally skips channeling after reaching 6 Essence (~22% chance) like a careless novice
    const skipChannelNovice =
      skillTier === 1 && actorState.maxEssence >= 6 && Math.random() < 0.22;
    if (!skipChannelNovice) {
      const channelIdx = chooseBestCardToChannel(state, actor, profile);
      if (channelIdx !== null) {
        const card = actorState.hand[channelIdx];
        const nextState = channelCard(state, actor, channelIdx);
        return {
          nextState,
          done: false,
          actionSummary: `${actorState.name} canalizou [${card.name}].`,
        };
      }
    }
  }

  // Step 1b: Domain Expansion & Countermeasures (Tier 2+ uses Domain Expansion & Simple Domain; Tier 1 ignores Simple Domain/Sacrifice Break)
  const activeDom = state.domainExpansion;
  const enemyTotalReadyAtk = getAllBoardUnits(enemyState)
    .filter(
      (u) =>
        !u.isTrap && u.card.type === 'creature' && !u.isFrozen && !u.hasSummoningSickness
    )
    .reduce((sum, u) => sum + Math.max(0, u.currentAtk), 0);

  if (activeDom && activeDom.owner === enemyActor && !activeDom.clashRival) {
    if (skillTier >= 2 && canInvokeDomainExpansion(state, actor).allowed) {
      const nextState = invokeDomainExpansion(state, actor);
      if (nextState !== state) {
        return {
          nextState,
          done: nextState.phase === 'gameover',
          actionSummary: `${actorState.name} invocou Expansão de Domínio para Disputa de Barreiras!`,
        };
      }
    } else if (
      skillTier >= 2 &&
      (enemyTotalReadyAtk >= 5 || actorState.hp <= 20) &&
      canUseSimpleDomain(state, actor)
    ) {
      const nextState = activateSimpleDomain(state, actor);
      if (nextState !== state) {
        return {
          nextState,
          done: nextState.phase === 'gameover',
          actionSummary: `${actorState.name} ergueu um Domínio Simples!`,
        };
      }
    } else if (
      skillTier >= 3 &&
      (enemyTotalReadyAtk >= actorState.hp ||
        (enemyTotalReadyAtk >= 7 && getTotalAvailableSacrificePool(state, actor) >= 22)) &&
      canBreakDomainExpansionWithSacrifice(state, actor)
    ) {
      const nextState = breakDomainExpansionWithSacrifice(state, actor);
      if (nextState !== state) {
        return {
          nextState,
          done: nextState.phase === 'gameover',
          actionSummary: `${actorState.name} rompeu a Expansão de Domínio rival por Sacrifício!`,
        };
      }
    }
  } else if (skillTier >= 2 && !activeDom && canInvokeDomainExpansion(state, actor).allowed) {
    const myCreatures = getAllBoardUnits(actorState).filter(
      (u) => !u.isTrap && u.card.type === 'creature'
    );
    const minCreaturesNeeded = w.domainExpansionEagerness >= 1.2 ? 1 : 2;
    const minTurnNeeded = w.domainExpansionEagerness >= 1.2 ? 5 : 6;
    if (myCreatures.length >= minCreaturesNeeded || state.turn >= minTurnNeeded) {
      const nextState = invokeDomainExpansion(state, actor);
      if (nextState !== state) {
        return {
          nextState,
          done: nextState.phase === 'gameover',
          actionSummary: `${actorState.name} ativou Expansão de Domínio!`,
        };
      }
    }
  }

  // Step 1c: Sovereign Blood Pact (-3 HP, +1 Essence) — Tier 3+ only
  if (
    tierSpec.allowBloodPact &&
    shouldTriggerBloodPact(state, actor, profile, enemyTotalReadyAtk)
  ) {
    const nextState = bloodPactForEssence(state, actor);
    if (nextState !== state) {
      return {
        nextState,
        done: false,
        actionSummary: `${actorState.name} ativou Sacrifício Vital (-3❤️ -> +1⚡)!`,
      };
    }
  }

  // Tier 4 & Tier 5 Multi-Step Turn Beam Search (when not in bulk fastRollout mode)
  if (!overrides?.fastRollout && tierSpec.beamWidth > 1) {
    const beamAction = findBestMainPhaseActionViaBeamSearch(
      state,
      actor,
      profile,
      valueMlp,
      tierSpec.beamWidth,
      tierSpec.beamDepth,
      tierSpec.temperature
    );
    if (beamAction) {
      const nextState = applyCandidateAction(state, actor, beamAction);
      if (nextState !== state) {
        const summary =
          beamAction.kind === 'play_card'
            ? `${actorState.name} jogou [${beamAction.cardName}] (-${beamAction.cardCost}⚡ → ${nextState[actor].currentEssence}/${nextState[actor].maxEssence}⚡).`
            : beamAction.kind === 'ascend'
              ? `${actorState.name} ascendeu [${beamAction.unitName}] para [${beamAction.newName}]!`
              : beamAction.kind === 'maneuver'
                ? `${actorState.name} reposicionou uma tropa taticamente!`
                : `${actorState.name} ativou o Poder do Soberano [${beamAction.powerName}]!`;
        return {
          nextState,
          done: nextState.phase === 'gameover',
          actionSummary: summary,
        };
      }
    }
  } else {
    // Tier 1..3 (or fastRollout): Single-step evaluation with optional 1-ply Value MLP delta + Softmax temperature
    if (w.ascensionEagerness >= 0.95 && skillTier >= 2) {
      for (const unit of getAllBoardUnits(actorState)) {
        if (canAscendUnit(state, actor, unit.instanceId)) {
          const nextState = ascendUnit(state, actor, unit.instanceId);
          const newName = unit.card.ascension?.newName ?? unit.card.name;
          return {
            nextState,
            done: false,
            actionSummary: `${actorState.name} ascendeu [${unit.card.name}] para [${newName}]!`,
          };
        }
      }
    }

    const playCandidates: Array<{
      index: number;
      score: number;
      options: { row?: RowType; slotIndex?: number; targetId?: string; asTrap?: boolean };
    }> = [];

    const fairLookahead = tierSpec.useValueMlp ? createFairLookaheadState(state, actor) : null;
    const baseMlpVal =
      fairLookahead && tierSpec.useValueMlp
        ? evaluateStateWithValueMlp(fairLookahead, actor, valueMlp)
        : 0;

    for (let i = 0; i < actorState.hand.length; i++) {
      const card = actorState.hand[i];
      const check = canPlayCard(state, actor, card);
      if (!check.allowed) continue;

      const evalResult = evaluateCardPlayValue(state, card, actor, profile);
      if (!evalResult.shouldPlay) continue;

      let combinedScore = evalResult.score;
      const opts = {
        row: evalResult.row,
        slotIndex: evalResult.slotIndex,
        targetId: evalResult.targetId,
        asTrap: evalResult.asTrap,
      };

      if (fairLookahead && tierSpec.useValueMlp) {
        const simAfter = playCard(fairLookahead, actor, i, opts);
        if (simAfter !== fairLookahead) {
          const afterVal = evaluateStateWithValueMlp(simAfter, actor, valueMlp);
          combinedScore += (afterVal - baseMlpVal) * 85;
        }
      }

      playCandidates.push({
        index: i,
        score: combinedScore,
        options: opts,
      });
    }

    if (playCandidates.length > 0) {
      const chosenSlot = selectIndexWithTemperature(
        playCandidates.map((c) => c.score),
        tierSpec.temperature
      );
      const chosen = playCandidates[chosenSlot >= 0 ? chosenSlot : 0];
      const card = actorState.hand[chosen.index];
      const nextState = playCard(state, actor, chosen.index, chosen.options);
      if (nextState !== state) {
        return {
          nextState,
          done: nextState.phase === 'gameover',
          actionSummary: `${actorState.name} jogou [${card.name}] (-${card.cost}⚡ → ${nextState[actor].currentEssence}/${nextState[actor].maxEssence}⚡).`,
        };
      }
    }

    // Deferred Ascension
    if (w.ascensionEagerness < 0.95 || skillTier === 1) {
      for (const unit of getAllBoardUnits(actorState)) {
        if (canAscendUnit(state, actor, unit.instanceId)) {
          const nextState = ascendUnit(state, actor, unit.instanceId);
          const newName = unit.card.ascension?.newName ?? unit.card.name;
          return {
            nextState,
            done: false,
            actionSummary: `${actorState.name} ascendeu [${unit.card.name}] para [${newName}]!`,
          };
        }
      }
    }

    // Free Tactical Row Maneuver (Tier 2+ only)
    if (tierSpec.allowRowManeuver) {
      const maneuverUnitId = chooseTacticalRowManeuver(state, actor);
      if (maneuverUnitId) {
        const nextState = moveUnitRow(state, actor, maneuverUnitId);
        if (nextState !== state) {
          return {
            nextState,
            done: false,
            actionSummary: `${actorState.name} reposicionou uma tropa taticamente!`,
          };
        }
      }
    }

    // Sovereign Power
    if (canUseSovereignPower(state, actor) && (skillTier >= 2 ? w.sovPowerTempoBias >= 0.55 : Math.random() < 0.4)) {
      const pwr = getSovereignPowerInfo(actorState);
      const nextState = useSovereignPower(state, actor);
      if (nextState !== state) {
        return {
          nextState,
          done: nextState.phase === 'gameover',
          actionSummary: `${actorState.name} ativou o Poder do Soberano [${pwr.name}]!`,
        };
      }
    }
  }

  // Step 4: Execute attacks with ready units
  const readyUnits = getAllBoardUnits(actorState).filter(
    (u) => getValidAttackTargets(state, u.instanceId).length > 0
  );

  const enemySovId = `${enemyActor}-sovereign`;
  const enemyHasShieldedBlocker = getAllBoardUnits(enemyState).some(
    (u) => !u.isTrap && u.hasDivineShield
  );

  const totalReadyFaceDamage = readyUnits
    .filter((u) => getValidAttackTargets(state, u.instanceId).includes(enemySovId))
    .reduce((sum, u) => sum + Math.max(0, u.currentAtk), 0);
  const hasCombinedLethal = totalReadyFaceDamage >= enemyState.hp;

  // Tier 2+ orders attackers smartly (Ranged first, small shield-breakers first vs Divine Shield); Tier 1 attacks in slot order
  if (skillTier >= 2) {
    readyUnits.sort((a, b) => {
      const aRanged = a.keywords.includes('Alcance') ? 1 : 0;
      const bRanged = b.keywords.includes('Alcance') ? 1 : 0;
      if (aRanged !== bRanged) return bRanged - aRanged;
      if (enemyHasShieldedBlocker && !hasCombinedLethal) {
        return a.currentAtk - b.currentAtk;
      }
      return b.currentAtk - a.currentAtk;
    });
  }

  for (const attacker of readyUnits) {
    const validTargets = getValidAttackTargets(state, attacker.instanceId);
    const chosenTarget = chooseBestTargetForAttacker(
      state,
      attacker,
      validTargets,
      actor,
      profile,
      hasCombinedLethal,
      skillTier
    );
    if (chosenTarget) {
      const nextState = executeAttack(state, attacker.instanceId, chosenTarget);
      if (nextState !== state) {
        return {
          nextState,
          done: nextState.phase === 'gameover',
          actionSummary: `[${attacker.card.name}] realizou um ataque!`,
          attackerId: attacker.instanceId,
          targetId: chosenTarget,
        };
      }
    }
  }

  // Step 5: End turn cleanly
  const finalState = endTurn(state);
  return {
    nextState: finalState,
    done: true,
    actionSummary: `${actorState.name} encerrou o turno.`,
  };
}

/**
 * Executes a single tactical step for the AI turn so the UI can animate each move sequentially.
 */
export function executeAiTurnStep(
  state: GameState,
  overrides?: AiProfileOverrides
): {
  nextState: GameState;
  done: boolean;
  actionSummary: string;
  attackerId?: string;
  targetId?: string;
} {
  return executeTurnStepForActor(state, 'ai', overrides);
}

/**
 * Runs the entire turn for the specified actor synchronously for instant simulation or testing.
 */
export function runFullTurnForActor(
  state: GameState,
  actor: 'player' | 'ai',
  overrides?: AiProfileOverrides
): GameState {
  let current = state;
  let safetySteps = 0;

  while (
    current.phase !== 'gameover' &&
    current.activePlayer === actor &&
    safetySteps < 28
  ) {
    safetySteps += 1;
    const step = executeTurnStepForActor(current, actor, overrides);
    current = step.nextState;
    if (step.done) {
      break;
    }
  }

  return current;
}

/**
 * Runs the entire AI turn synchronously for instant simulation or testing.
 */
export function runFullAiTurn(
  state: GameState,
  overrides?: AiProfileOverrides
): GameState {
  return runFullTurnForActor(state, 'ai', overrides);
}

/**
 * ============================================================================
 * IA TÁTICA PARA O SISTEMA DE RODADAS EM FASES SIMULTÂNEAS
 * ============================================================================
 */
export function executeAiDeployPhase(
  state: GameState,
  overrides?: AiProfileOverrides
): GameState {
  if (state.phase === 'gameover') return state;
  let current = state;
  const profile = getProfileForActor(current, 'ai', overrides);

  // 1. Channel 1 card if not yet channeled this round
  if (!current.ai.hasChanneledThisTurn) {
    const channelIdx = chooseBestCardToChannel(current, 'ai', profile);
    if (channelIdx !== null) {
      current = channelCard(current, 'ai', channelIdx);
    }
  }

  // 2. Deploy affordable Creatures, Relics, and Ambush Traps in Phase 1
  let safety = 0;
  while (current.phase !== 'gameover' && safety < 10) {
    safety += 1;
    let bestPlayIndex = -1;
    let bestPlayScore = -999;
    let bestPlayOptions:
      | { row?: RowType; slotIndex?: number; targetId?: string; asTrap?: boolean }
      | undefined;

    for (let i = 0; i < current.ai.hand.length; i++) {
      const card = current.ai.hand[i];
      if (card.type === 'spell') continue;
      const check = canPlayCard(current, 'ai', card);
      if (!check.allowed) continue;

      const evalResult = evaluateCardPlayValue(current, card, 'ai', profile);
      if (card.type === 'reaction' && !evalResult.asTrap) continue;

      if (evalResult.shouldPlay && evalResult.score > bestPlayScore) {
        bestPlayScore = evalResult.score;
        bestPlayIndex = i;
        bestPlayOptions = {
          row: evalResult.row,
          slotIndex: evalResult.slotIndex,
          targetId: evalResult.targetId,
          asTrap: evalResult.asTrap,
        };
      }
    }

    if (bestPlayIndex === -1) break;
    const next = playCard(current, 'ai', bestPlayIndex, bestPlayOptions);
    if (next === current) break;
    current = next;
  }

  return current;
}

function getSpellArcaneSpeedTier(card: CardDefinition): 1 | 2 | 3 {
  for (const eff of card.effects) {
    if (
      eff.type === 'heal_sovereign' ||
      eff.type === 'heal_all_allies' ||
      eff.type === 'heal_target_ally' ||
      eff.type === 'buff_target_ally' ||
      eff.type === 'buff_all_allies' ||
      eff.type === 'shield_all_allies' ||
      eff.type === 'grant_bonus_essence' ||
      eff.type === 'solar_spear_phalanx' ||
      eff.type === 'unconquered_champion_oath' ||
      eff.type === 'primordial_evolution_apex' ||
      eff.type === 'twilight_procession'
    ) {
      return 1;
    }
    if (
      eff.type === 'freeze_enemy' ||
      eff.type === 'freeze_enemy_vanguard' ||
      eff.type === 'bounce_enemy' ||
      eff.type === 'debuff_enemy_vanguard_atk' ||
      eff.type === 'steal_small_enemy' ||
      eff.type === 'coordinate_inversion' ||
      eff.type === 'horizon_singularity' ||
      eff.type === 'shared_shadow_link'
    ) {
      return 2;
    }
  }
  return 3;
}

export function executeAiCombatPlanWave1(
  state: GameState,
  overrides?: AiProfileOverrides
): GameState {
  if (state.phase === 'gameover') return state;
  let current = state;
  const profile = getProfileForActor(current, 'ai', overrides);

  // 1. Domain Expansion & Countermeasures
  const activeDom = current.domainExpansion;
  const playerTotalReadyAtk = getAllBoardUnits(current.player)
    .filter(
      (u) =>
        !u.isTrap && u.card.type === 'creature' && !u.isFrozen && !u.hasSummoningSickness
    )
    .reduce((sum, u) => sum + Math.max(0, u.currentAtk), 0);

  if (activeDom && activeDom.owner === 'player' && !activeDom.clashRival) {
    if (canInvokeDomainExpansion(current, 'ai').allowed) {
      current = invokeDomainExpansion(current, 'ai');
    } else if (
      (playerTotalReadyAtk >= 5 || current.ai.hp <= 20) &&
      canUseSimpleDomain(current, 'ai')
    ) {
      current = activateSimpleDomain(current, 'ai');
    } else if (
      (playerTotalReadyAtk >= current.ai.hp ||
        (playerTotalReadyAtk >= 7 && getTotalAvailableSacrificePool(current, 'ai') >= 22)) &&
      canBreakDomainExpansionWithSacrifice(current, 'ai')
    ) {
      current = breakDomainExpansionWithSacrifice(current, 'ai');
    }
  } else if (!activeDom && canInvokeDomainExpansion(current, 'ai').allowed) {
    const aiCreatures = getAllBoardUnits(current.ai).filter(
      (u) => !u.isTrap && u.card.type === 'creature'
    );
    if (aiCreatures.length >= 1 || current.turn >= 5) {
      current = invokeDomainExpansion(current, 'ai');
    }
  }

  // 2. Ascend eligible AI units on board
  for (const unit of getAllBoardUnits(current.ai)) {
    if (canAscendUnit(current, 'ai', unit.instanceId)) {
      current = ascendUnit(current, 'ai', unit.instanceId);
    }
  }

  // 3. Cast Spells in Arcane Speed Order
  for (const speedTier of [1, 2, 3] as const) {
    let safety = 0;
    while (current.phase !== 'gameover' && safety < 8) {
      safety += 1;
      let bestIdx = -1;
      let bestScore = -999;
      let bestTargetId: string | undefined;

      for (let i = 0; i < current.ai.hand.length; i++) {
        const card = current.ai.hand[i];
        if (card.type !== 'spell' && card.type !== 'reaction') continue;
        if (getSpellArcaneSpeedTier(card) !== speedTier) continue;
        const check = canPlayCard(current, 'ai', card);
        if (!check.allowed) continue;

        const evalResult = evaluateCardPlayValue(current, card, 'ai', profile);
        if (evalResult.asTrap) continue;
        if (evalResult.shouldPlay && evalResult.score > bestScore) {
          bestScore = evalResult.score;
          bestIdx = i;
          bestTargetId = evalResult.targetId;
        }
      }

      if (bestIdx === -1) break;
      const next = playCard(current, 'ai', bestIdx, { targetId: bestTargetId });
      if (next === current) break;
      current = next;
    }
  }

  // 4. Use AI Sovereign Power if Essence remains
  if (canUseSovereignPower(current, 'ai')) {
    current = useSovereignPower(current, 'ai');
  }

  // 5. Assign AI Unit Stances ('attack' vs 'defend' +1🛡️) and Planned Targets
  const aiUnits = getAllBoardUnits(current.ai).filter(
    (u) => !u.isTrap && u.card.type === 'creature'
  );
  const enemySovId = 'player-sovereign';
  const totalReadyFace = aiUnits
    .filter(
      (u) =>
        !u.hasSummoningSickness &&
        !u.isFrozen &&
        getValidAttackTargets(current, u.instanceId, true).includes(enemySovId)
    )
    .reduce((s, u) => s + Math.max(0, u.currentAtk), 0);
  const hasCombinedLethal = totalReadyFace >= current.player.hp;

  for (const unit of aiUnits) {
    if (unit.hasSummoningSickness || unit.isFrozen || unit.currentAtk <= 0) {
      if (unit.stance !== 'defend') {
        current = toggleUnitStance(current, 'ai', unit.instanceId);
      }
      continue;
    }

    const enemyInSameCol = getAllBoardUnits(current.player).filter(
      (e) => !e.isTrap && e.card.type === 'creature' && e.slotIndex === unit.slotIndex
    );
    const shouldHoldBastionDefense =
      !hasCombinedLethal &&
      unit.keywords.includes('Guardião') &&
      unit.currentAtk <= 2 &&
      enemyInSameCol.length > 0 &&
      current.ai.hp <= 16 * profile.weights.guardianPriority;

    if (shouldHoldBastionDefense) {
      if (unit.stance !== 'defend') {
        current = toggleUnitStance(current, 'ai', unit.instanceId);
      }
    } else {
      if (unit.stance === 'defend') {
        current = toggleUnitStance(current, 'ai', unit.instanceId);
      }
      const validTargets = getValidAttackTargets(current, unit.instanceId, true);
      const chosenTarget = chooseBestTargetForAttacker(
        current,
        unit,
        validTargets,
        'ai',
        profile,
        hasCombinedLethal
      );
      if (chosenTarget) {
        current = setUnitAttackTarget(current, 'ai', unit.instanceId, chosenTarget);
      }
    }
  }

  return current;
}
