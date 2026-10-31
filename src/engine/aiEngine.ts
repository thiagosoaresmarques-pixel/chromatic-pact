import { BoardUnit, CardDefinition, Domain, GameState, RowType } from '../types/game';
import {
  DeckLearnedAiProfile,
  resolveLearnedProfileForActor,
} from '../data/aiLearnedProfiles';
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
}

function getProfileForActor(
  state: GameState,
  actor: 'player' | 'ai',
  overrides?: AiProfileOverrides
): DeckLearnedAiProfile {
  const custom = actor === 'player' ? overrides?.player : overrides?.ai;
  return resolveLearnedProfileForActor(state, actor, custom);
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
  customProfile?: DeckLearnedAiProfile
): number[] {
  const actorState = state[actor];
  const hand = actorState.hand;
  if (hand.length === 0) return [];

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
  const maxEnemyDomainAffinity = Math.max(
    enemyState.affinities.red ?? 0,
    enemyState.affinities.blue ?? 0,
    enemyState.affinities.purple ?? 0,
    enemyState.affinities.green ?? 0,
    enemyState.affinities.gold ?? 0
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
  for (const c of aiState.hand) {
    cardCountsById[c.id] = (cardCountsById[c.id] ?? 0) + 1;
    if (c.domain !== 'neutral') {
      const currentAff = aiState.affinities[c.domain] + aiState.affinities.neutral;
      if (currentAff < c.affinityReq) {
        domainNeed[c.domain] += (c.affinityReq - currentAff) * 2 + 1;
      }
    }
  }

  const totalPactAffinity =
    (aiState.affinities.red ?? 0) +
    (aiState.affinities.blue ?? 0) +
    (aiState.affinities.purple ?? 0) +
    (aiState.affinities.green ?? 0) +
    (aiState.affinities.gold ?? 0);
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
          eff.type === 'bounce_enemy'
        ) {
          if (enemyUnits.length > 0) {
            const sorted = [...enemyUnits].sort(
              (a, b) => b.currentAtk * 2 + b.currentHp - (a.currentAtk * 2 + a.currentHp)
            );
            bestTargetId = sorted[0].instanceId;
          }
        } else if (eff.type === 'buff_target_ally' || eff.type === 'heal_target_ally') {
          if (friendlyUnits.length > 0) {
            const sorted = [...friendlyUnits].sort((a, b) => b.currentAtk - a.currentAtk);
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
          eff.type === 'bounce_enemy'
        ) {
          if (enemyUnits.length > 0) {
            const sorted = [...enemyUnits].sort(
              (a, b) => b.currentAtk * 2 + b.currentHp - (a.currentAtk * 2 + a.currentHp)
            );
            bestTargetId = sorted[0].instanceId;
          }
        } else if (eff.type === 'buff_target_ally' || eff.type === 'heal_target_ally') {
          if (friendlyUnits.length > 0) {
            const sorted = [...friendlyUnits].sort((a, b) => b.currentAtk - a.currentAtk);
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
 * Chooses the best attack target for a ready unit, factoring in combined multi-unit lethal
 * and learned aggro vs value-trade weights.
 */
function chooseBestTargetForAttacker(
  state: GameState,
  attacker: BoardUnit,
  validTargets: string[],
  actor: 'player' | 'ai' = 'ai',
  profile?: DeckLearnedAiProfile,
  hasCombinedLethal = false
): string | null {
  if (validTargets.length === 0) return null;

  const resolvedProfile = profile ?? resolveLearnedProfileForActor(state, actor);
  const w = resolvedProfile.weights;
  const actorState = state[actor];
  const enemyActor: 'player' | 'ai' = actor === 'player' ? 'ai' : 'player';
  const enemyState = state[enemyActor];
  const enemySovId = `${enemyActor}-sovereign`;

  const canHitFace = validTargets.includes(enemySovId);

  if (
    canHitFace &&
    (hasCombinedLethal || isSureHitActiveFor(state, actor) || enemyState.hp <= attacker.currentAtk)
  ) {
    return enemySovId;
  }

  const isRangedFreeHit =
    attacker.row === 'rearguard' && attacker.keywords.includes('Alcance');
  const hasLethalTouch = attacker.keywords.includes('Toque Letal');

  let bestTarget = validTargets[0];
  let bestScore = -9999;

  for (const targetId of validTargets) {
    if (targetId === enemySovId) {
      let faceScore = attacker.currentAtk * 4.5 * w.aggroFaceBias;
      if (enemyState.hp <= 12) {
        faceScore += 26 * w.aggroFaceBias;
      }
      if (attacker.keywords.includes('Dreno de Vida') && actorState.hp < actorState.maxHp) {
        faceScore += 12;
      }
      if (faceScore > bestScore) {
        bestScore = faceScore;
        bestTarget = targetId;
      }
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
    } else if (defender.hasDivineShield && attacker.currentAtk <= 3) {
      tradeScore += 24 * w.tradeValueBias;
    } else if (defender.card.type === 'relic') {
      tradeScore += (18 + dmgToDef * 5) * w.tradeValueBias;
    } else {
      tradeScore += dmgToDef * 3 * w.tradeValueBias;
      if (!attackerSurvives) {
        tradeScore -= 30;
      }
    }

    if (isRangedFreeHit) {
      tradeScore += 15;
    }

    if (tradeScore > bestScore) {
      bestScore = tradeScore;
      bestTarget = targetId;
    }
  }

  return bestTarget;
}

/**
 * Executes a single tactical step for the specified actor ('player' or 'ai').
 */
export function executeTurnStepForActor(
  state: GameState,
  actor: 'player' | 'ai',
  overrides?: AiProfileOverrides
): {
  nextState: GameState;
  done: boolean;
  actionSummary: string;
} {
  if (state.phase === 'gameover') {
    return { nextState: state, done: true, actionSummary: 'Partida encerrada.' };
  }

  if (state.activePlayer !== actor) {
    return { nextState: state, done: true, actionSummary: 'Turno do oponente.' };
  }

  const profile = getProfileForActor(state, actor, overrides);
  const w = profile.weights;
  const actorState = state[actor];
  const enemyActor: 'player' | 'ai' = actor === 'player' ? 'ai' : 'player';
  const enemyState = state[enemyActor];

  // Step 1: Channel a card if not yet channeled this turn
  if (!actorState.hasChanneledThisTurn) {
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

  // Step 1b: Domain Expansion & Countermeasures
  const activeDom = state.domainExpansion;
  const enemyTotalReadyAtk = getAllBoardUnits(enemyState)
    .filter(
      (u) =>
        !u.isTrap && u.card.type === 'creature' && !u.isFrozen && !u.hasSummoningSickness
    )
    .reduce((sum, u) => sum + Math.max(0, u.currentAtk), 0);

  if (activeDom && activeDom.owner === enemyActor && !activeDom.clashRival) {
    if (canInvokeDomainExpansion(state, actor).allowed) {
      const nextState = invokeDomainExpansion(state, actor);
      if (nextState !== state) {
        return {
          nextState,
          done: nextState.phase === 'gameover',
          actionSummary: `${actorState.name} invocou Expansão de Domínio para Disputa de Barreiras!`,
        };
      }
    } else if (
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
  } else if (!activeDom && canInvokeDomainExpansion(state, actor).allowed) {
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

  // Step 1c: Sovereign Blood Pact (-3 HP, +1 Essence) if it unlocks a decisive play
  if (shouldTriggerBloodPact(state, actor, profile, enemyTotalReadyAtk)) {
    const nextState = bloodPactForEssence(state, actor);
    if (nextState !== state) {
      return {
        nextState,
        done: false,
        actionSummary: `${actorState.name} selou Pacto de Sangue (-3❤️ -> +1⚡)!`,
      };
    }
  }

  // Step 2: Check if any unit on board can Ascend (eager before cards if ascensionEagerness >= 0.95)
  if (w.ascensionEagerness >= 0.95) {
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

  // Step 3: Play the highest-value affordable card from hand
  let bestPlayIndex = -1;
  let bestPlayScore = -999;
  let bestPlayOptions:
    | { row?: RowType; slotIndex?: number; targetId?: string; asTrap?: boolean }
    | undefined;

  for (let i = 0; i < actorState.hand.length; i++) {
    const card = actorState.hand[i];
    const check = canPlayCard(state, actor, card);
    if (!check.allowed) continue;

    const evalResult = evaluateCardPlayValue(state, card, actor, profile);
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

  if (bestPlayIndex !== -1) {
    const card = actorState.hand[bestPlayIndex];
    const nextState = playCard(state, actor, bestPlayIndex, bestPlayOptions);
    if (nextState !== state) {
      return {
        nextState,
        done: nextState.phase === 'gameover',
        actionSummary: `${actorState.name} jogou [${card.name}] (-${card.cost}⚡ → ${nextState[actor].currentEssence}/${nextState[actor].maxEssence}⚡).`,
      };
    }
  }

  // Step 3a: Deferred Ascension if ascensionEagerness < 0.95
  if (w.ascensionEagerness < 0.95) {
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

  // Step 3b: Free Tactical Row Maneuver (0⚡, 1x/turn)
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

  // Step 3c: Use Sovereign Power if actor has leftover Essence
  if (canUseSovereignPower(state, actor) && w.sovPowerTempoBias >= 0.55) {
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

  // Step 4: Execute attacks with ready units
  const readyUnits = getAllBoardUnits(actorState).filter(
    (u) => getValidAttackTargets(state, u.instanceId).length > 0
  );

  const enemySovId = `${enemyActor}-sovereign`;
  const enemyHasShieldedBlocker = getAllBoardUnits(enemyState).some(
    (u) => !u.isTrap && u.hasDivineShield
  );

  // Check if combined ready units that can hit enemy Sovereign right now have lethal
  const totalReadyFaceDamage = readyUnits
    .filter((u) => getValidAttackTargets(state, u.instanceId).includes(enemySovId))
    .reduce((sum, u) => sum + Math.max(0, u.currentAtk), 0);
  const hasCombinedLethal = totalReadyFaceDamage >= enemyState.hp;

  // Order attackers: Ranged first, small shield-breakers first when enemy has Divine Shield, otherwise heavy hitters
  readyUnits.sort((a, b) => {
    const aRanged = a.keywords.includes('Alcance') ? 1 : 0;
    const bRanged = b.keywords.includes('Alcance') ? 1 : 0;
    if (aRanged !== bRanged) return bRanged - aRanged;
    if (enemyHasShieldedBlocker && !hasCombinedLethal) {
      return a.currentAtk - b.currentAtk;
    }
    return b.currentAtk - a.currentAtk;
  });

  for (const attacker of readyUnits) {
    const validTargets = getValidAttackTargets(state, attacker.instanceId);
    const chosenTarget = chooseBestTargetForAttacker(
      state,
      attacker,
      validTargets,
      actor,
      profile,
      hasCombinedLethal
    );
    if (chosenTarget) {
      const nextState = executeAttack(state, attacker.instanceId, chosenTarget);
      if (nextState !== state) {
        return {
          nextState,
          done: nextState.phase === 'gameover',
          actionSummary: `[${attacker.card.name}] realizou um ataque!`,
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
      eff.type === 'grant_bonus_essence'
    ) {
      return 1;
    }
    if (
      eff.type === 'freeze_enemy' ||
      eff.type === 'freeze_enemy_vanguard' ||
      eff.type === 'bounce_enemy' ||
      eff.type === 'debuff_enemy_vanguard_atk' ||
      eff.type === 'steal_small_enemy'
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
