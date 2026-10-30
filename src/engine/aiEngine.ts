import { BoardUnit, CardDefinition, Domain, GameState, RowType } from '../types/game';
import {
  activateSimpleDomain,
  ascendUnit,
  breakDomainExpansionWithSacrifice,
  canAscendUnit,
  canBreakDomainExpansionWithSacrifice,
  canDeployToSlot,
  canInvokeDomainExpansion,
  canPlayCard,
  canUseSimpleDomain,
  canUseSovereignPower,
  channelCard,
  endTurn,
  executeAttack,
  findUnitOnBoard,
  getAllBoardUnits,
  getSovereignPowerInfo,
  getTotalAvailableSacrificePool,
  getValidAttackTargets,
  invokeDomainExpansion, isSureHitActiveFor,
  playCard,
  setUnitAttackTarget,
  toggleUnitStance,
  useSovereignPower,
} from './gameEngine';

/**
 * Selects the best card in AI's hand to channel as Essence & Domain Affinity.
 * Prioritizes:
 * 1. Domain affinity needed by other cards in hand
 * 2. Duplicates or expensive cards that cannot be played soon
 * 3. Avoids channeling the only playable turn-appropriate threat
 */
function chooseBestCardToChannel(state: GameState, actor: 'player' | 'ai' = 'ai'): number | null {
  const aiState = state[actor];
  if (aiState.hasChanneledThisTurn || aiState.hand.length === 0) {
    return null;
  }

  // If AI already has plenty of essence (>= 8) and a small hand (<= 2), save cards to play
  if (aiState.maxEssence >= 8 && aiState.hand.length <= 2) {
    return null;
  }

  const nextEssence = aiState.maxEssence + 1;

  // Count domain deficits in hand
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
  const expansionDeficitBonus = totalPactAffinity < 6 ? 24 : 8;

  let bestIndex = 0;
  let bestScore = -9999;

  for (let i = 0; i < aiState.hand.length; i++) {
    const card = aiState.hand[i];
    let score = expansionDeficitBonus;

    // Providing a needed domain affinity is high value
    if (card.domain !== 'neutral') {
      score += Math.min(24, domainNeed[card.domain] * 10);
    }

    // Prefer channeling duplicates
    if ((cardCountsById[card.id] ?? 0) > 1) {
      score += 20;
    }

    // Prefer channeling excess Relics if board already has 3+ Relics
    const activeRelicCount = getAllBoardUnits(aiState).filter((u) => !u.isTrap && u.card.type === 'relic').length;
    if (card.type === 'relic' && activeRelicCount >= 3) {
      score += 28;
    }

    // Protect creatures in spell-heavy decks so AI never channels away its only board presence
    const friendlyBoardCreatures = getAllBoardUnits(aiState).filter(
      (u) => !u.isTrap && u.card.type === 'creature'
    ).length;
    const handCreatures = aiState.hand.filter((c) => c.type === 'creature').length;
    const handSpells = aiState.hand.filter((c) => c.type === 'spell' || c.type === 'reaction').length;
    if (card.type === 'creature' && friendlyBoardCreatures + handCreatures <= 3) {
      score -= 28;
    } else if ((card.type === 'spell' || card.type === 'reaction') && handSpells >= 3) {
      score += 14;
    }

    // Prefer channeling cards too expensive to play for several turns
    const costGap = card.cost - nextEssence;
    if (costGap >= 3) {
      score += 25 + costGap * 3;
    } else if (costGap === 2) {
      score += 12;
    } else if (costGap <= 0) {
      // It would be playable this turn if we keep it
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

  // Only recycle a card if it is genuinely unhelpful right now (too expensive or needed for affinity)
  if (bestScore < 20) {
    return null;
  }

  return bestIndex;
}

/**
 * Evaluates whether a spell is worth casting right now and picks the best targetId if applicable.
 */
function evaluateCardPlayValue(
  state: GameState,
  card: CardDefinition,
  actor: 'player' | 'ai' = 'ai'
): {
  shouldPlay: boolean;
  score: number;
  row?: RowType;
  slotIndex?: number;
  targetId?: string;
  asTrap?: boolean;
} {
  const aiState = state[actor];
  const playerState = state[actor === 'player' ? 'ai' : 'player'];
  const enemyUnits = getAllBoardUnits(playerState).filter(
    (u) => !u.isTrap && !(state.roundSubPhase === 'deploy' && u.isConcealedDeploy)
  );
  const friendlyUnits = getAllBoardUnits(aiState).filter((u) => !u.isTrap);

  // Check if corruption backlash would kill AI
  if (card.corruptionCost && card.corruptionCost > 0) {
    const projectedCorruption = Math.min(10, aiState.corruption + card.corruptionCost);
    if (projectedCorruption >= 10 && aiState.hp <= 2) {
      return { shouldPlay: false, score: -999 };
    }
  }

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
      (col) => aiState.rearguard[col] === null && aiState.vanguard[col] !== null
    );
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
    return {
      shouldPlay: true,
      score: 52 + card.cost * 8 + allySynergyBonus,
      row: 'rearguard',
      slotIndex: protectedCols.length > 0 ? protectedCols[0] : undefined,
      targetId: bestTargetId,
    };
  }

  if (card.type === 'creature') {
    const allCols = [0, 1, 2, 3, 4, 5];
    const hasVisiblePlayerVanguard = (col: number) => {
      const u = playerState.vanguard[col];
      return u !== null && !(state.roundSubPhase === 'deploy' && u.isConcealedDeploy);
    };
    const hasVisiblePlayerRearguard = (col: number) => {
      const u = playerState.rearguard[col];
      return u !== null && !(state.roundSubPhase === 'deploy' && u.isConcealedDeploy);
    };

    // Check if any column has an unblocked visible Player Vanguard unit threatening AI Sovereign directly
    const unblockedThreatCols = allCols.filter(
      (col) => hasVisiblePlayerVanguard(col) && aiState.rearguard[col] === null
    );

    const prefersRearguard =
      card.keywords.includes('Alcance') ||
      card.preferredRow === 'rearguard' ||
      (unblockedThreatCols.length > 0 && aiState.hp <= 22 && !card.keywords.includes('Guardião'));

    const hasEmptyVanguard = allCols.some((c) => canDeployToSlot(aiState, 'vanguard', c));
    const hasEmptyRearguard = allCols.some((c) => canDeployToSlot(aiState, 'rearguard', c));

    let chosenRow: RowType = prefersRearguard ? 'rearguard' : 'vanguard';
    if (chosenRow === 'vanguard' && !hasEmptyVanguard) chosenRow = 'rearguard';
    if (chosenRow === 'rearguard' && !hasEmptyRearguard) chosenRow = 'vanguard';

    let chosenSlotIndex: number | undefined;
    if (chosenRow === 'rearguard' && unblockedThreatCols.length > 0) {
      // Block the column with the strongest invading Player Vanguard creature!
      unblockedThreatCols.sort(
        (a, b) => (playerState.vanguard[b]?.currentAtk ?? 0) - (playerState.vanguard[a]?.currentAtk ?? 0)
      );
      chosenSlotIndex = unblockedThreatCols[0];
    } else if (chosenRow === 'vanguard') {
      // First priority: capture an active Arena Column Rune if available!
      const runeCols = (state.columnRunes ?? [])
        .map((r) => r.slotIndex)
        .filter((col) => canDeployToSlot(aiState, 'vanguard', col));
      if (runeCols.length > 0) {
        chosenSlotIndex = runeCols[0];
      } else {
        // Prefer an open Vanguard column where visible Player Rearguard is also empty (Corredor Livre!)
        const openBreakthroughCols = allCols.filter(
          (col) => aiState.vanguard[col] === null && !hasVisiblePlayerRearguard(col)
        );
        if (openBreakthroughCols.length > 0) {
          chosenSlotIndex = openBreakthroughCols[0];
        }
      }
    }

    // Check if creature has targeted on_enter effect
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

    const hasPlayerDomainActive = Boolean(
      state.domainExpansion &&
        (state.domainExpansion.owner === 'player' ||
          state.domainExpansion.clashRival?.owner === 'player')
    );
    const domainBreakerBonus =
      hasPlayerDomainActive &&
      card.effects.some((e) => e.type === 'break_domain_expansion')
        ? 95
        : 0;
    const baseScore =
      40 + card.cost * 10 + card.atk * 4 + card.hp * 3 + domainBreakerBonus;
    return {
      shouldPlay: true,
      score: baseScore,
      row: chosenRow,
      slotIndex: chosenSlotIndex,
      targetId: bestTargetId,
    };
  }

  // Spell or Reaction
  let spellScore = 30 + card.cost * 8;
  let targetId: string | undefined;
  let usefulEffectFound = false;

  for (const eff of card.effects) {
    switch (eff.type) {
      case 'damage_enemy_row':
      case 'freeze_enemy_vanguard':
      case 'debuff_enemy_vanguard_atk': {
        if (enemyUnits.length > 0) {
          usefulEffectFound = true;
          spellScore += enemyUnits.length * 18;
        }
        break;
      }
      case 'damage_single_enemy': {
        if (enemyUnits.length > 0) {
          usefulEffectFound = true;
          // Prefer an enemy unit that dies to this damage or the biggest threat
          const killable = enemyUnits.filter(
            (u) => !u.hasDivineShield && u.currentHp <= Math.max(1, eff.value - u.currentArmor)
          );
          const pool = killable.length > 0 ? killable : enemyUnits;
          pool.sort((a, b) => b.currentAtk * 2 + b.currentHp - (a.currentAtk * 2 + a.currentHp));
          targetId = pool[0].instanceId;
          spellScore += 28;
        } else if (playerState.hp <= eff.value + 3) {
          usefulEffectFound = true;
          spellScore += 50;
        }
        break;
      }
      case 'destroy_enemy':
      case 'bounce_enemy':
      case 'freeze_enemy': {
        if (enemyUnits.length > 0) {
          usefulEffectFound = true;
          const sorted = [...enemyUnits].sort(
            (a, b) => b.currentAtk * 2 + b.currentHp - (a.currentAtk * 2 + a.currentHp)
          );
          targetId = sorted[0].instanceId;
          spellScore += sorted[0].card.cost * 10;
        }
        break;
      }
      case 'damage_all_units': {
        if (enemyUnits.length > friendlyUnits.length) {
          usefulEffectFound = true;
          spellScore += (enemyUnits.length - friendlyUnits.length) * 22;
        }
        break;
      }
      case 'damage_enemy_sovereign': {
        usefulEffectFound = true;
        if (playerState.hp <= eff.value) {
          spellScore += 200; // Lethal!
        } else {
          spellScore += 20;
        }
        break;
      }
      case 'heal_sovereign': {
        if (aiState.hp <= aiState.maxHp - 3) {
          usefulEffectFound = true;
          spellScore += 25;
        }
        break;
      }
      case 'heal_all_allies':
      case 'heal_target_ally': {
        const damagedAllies = friendlyUnits.filter((u) => u.currentHp < u.maxHp);
        if (damagedAllies.length > 0 || aiState.hp < aiState.maxHp - 3) {
          usefulEffectFound = true;
          if (damagedAllies.length > 0) {
            targetId = damagedAllies[0].instanceId;
          }
          spellScore += 22;
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
          spellScore += creatureAllies.length * 14;
        }
        break;
      }
      case 'revive_from_crypt': {
        const hasCryptCreature = aiState.crypt.some((c) => c.type === 'creature');
        const hasBoardSpace =
          aiState.vanguard.some((s) => s === null) || aiState.rearguard.some((s) => s === null);
        if (hasCryptCreature && hasBoardSpace) {
          usefulEffectFound = true;
          spellScore += 45;
        }
        break;
      }
      case 'break_domain_expansion': {
        if (
          state.domainExpansion &&
          (state.domainExpansion.owner === 'player' ||
            state.domainExpansion.clashRival?.owner === 'player')
        ) {
          usefulEffectFound = true;
          spellScore += 95;
        }
        break;
      }
      case 'draw_cards':
      case 'grant_bonus_essence':
      case 'summon_token': {
        usefulEffectFound = true;
        spellScore += 25;
        break;
      }
      case 'steal_small_enemy': {
        const maxAtk = eff.value > 0 ? eff.value : 3;
        const stealable = enemyUnits.filter(
          (u) => u.card.type === 'creature' && u.currentAtk <= maxAtk
        );
        if (stealable.length > 0) {
          usefulEffectFound = true;
          targetId = stealable[0].instanceId;
          spellScore += 45;
        }
        break;
      }
    }
  }

  if (card.type === 'reaction' && !usefulEffectFound) {
    const emptyRearSlots = [0, 1, 2, 3, 4, 5].filter((col) => aiState.rearguard[col] === null);
    if (emptyRearSlots.length > 0) {
      // Prefer placing trap in a column where Player has a Vanguard unit or empty Rearguard
      const priorityCol =
        emptyRearSlots.find((col) => playerState.vanguard[col] !== null) ?? emptyRearSlots[0];
      return {
        shouldPlay: true,
        score: 48 + card.cost * 6,
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
 * Chooses the best attack target for a given ready AI unit.
 */
function chooseBestTargetForAttacker(
  state: GameState,
  attacker: BoardUnit,
  validTargets: string[],
  actor: 'player' | 'ai' = 'ai'
): string | null {
  if (validTargets.length === 0) return null;

  const actorState = state[actor];
  const enemyActor: 'player' | 'ai' = actor === 'player' ? 'ai' : 'player';
  const enemyState = state[enemyActor];
  const enemySovId = `${enemyActor}-sovereign`;

  const canHitFace = validTargets.includes(enemySovId);

  // Check if all ready AI units combined have lethal on enemy Sovereign
  if (canHitFace && (isSureHitActiveFor(state, actor) || enemyState.hp <= attacker.currentAtk)) {
    return enemySovId;
  }

  const isRangedFreeHit =
    attacker.row === 'rearguard' && attacker.keywords.includes('Alcance');
  const hasLethalTouch = attacker.keywords.includes('Toque Letal');

  let bestTarget = validTargets[0];
  let bestScore = -9999;

  for (const targetId of validTargets) {
    if (targetId === enemySovId) {
      // Going face is solid, especially if enemy HP is getting low
      let faceScore = attacker.currentAtk * 4.5;
      if (enemyState.hp <= 10) {
        faceScore += 25;
      }
      if (attacker.keywords.includes('Dreno de Vida') && actorState.hp < actorState.maxHp) {
        faceScore += 10;
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
      tradeScore += 35 + defender.currentAtk * 6 + defender.card.cost * 4;
      if (attackerSurvives) {
        tradeScore += 25; // Value trade!
      } else {
        // 1-for-1 trade: evaluate if defender was worth more than attacker
        tradeScore += (defender.card.cost - attacker.card.cost) * 8;
      }
    } else if (defender.hasDivineShield && attacker.currentAtk <= 3) {
      // Popping divine shield with a small attacker is great
      tradeScore += 22;
    } else {
      // Chip damage
      tradeScore += dmgToDef * 3;
      if (!attackerSurvives) {
        tradeScore -= 30; // Avoid suiciding without killing defender unless forced by Guardião
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
  actor: 'player' | 'ai'
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

  const actorState = state[actor];
  const enemyActor: 'player' | 'ai' = actor === 'player' ? 'ai' : 'player';
  const enemyState = state[enemyActor];

  // Step 1: Channel a card if not yet channeled this turn
  if (!actorState.hasChanneledThisTurn) {
    const channelIdx = chooseBestCardToChannel(state, actor);
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
    .filter((u) => !u.isTrap && u.card.type === 'creature' && !u.isFrozen && !u.hasSummoningSickness)
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
    if (myCreatures.length >= 2 || state.turn >= 6) {
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

  // Step 2: Check if any unit on board can Ascend
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

    const evalResult = evaluateCardPlayValue(state, card, actor);
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

  // Step 3b: Use Sovereign Power if actor has 2+ leftover Essence
  if (canUseSovereignPower(state, actor)) {
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

  // Order attackers: Ranged and small units first (to pop shields), or lethal attackers
  readyUnits.sort((a, b) => {
    const aRanged = a.keywords.includes('Alcance') ? 1 : 0;
    const bRanged = b.keywords.includes('Alcance') ? 1 : 0;
    if (aRanged !== bRanged) return bRanged - aRanged;
    return b.currentAtk - a.currentAtk;
  });

  for (const attacker of readyUnits) {
    const validTargets = getValidAttackTargets(state, attacker.instanceId);
    const chosenTarget = chooseBestTargetForAttacker(state, attacker, validTargets, actor);
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
export function executeAiTurnStep(state: GameState): {
  nextState: GameState;
  done: boolean;
  actionSummary: string;
} {
  return executeTurnStepForActor(state, 'ai');
}

/**
 * Runs the entire turn for the specified actor synchronously for instant simulation or testing.
 */
export function runFullTurnForActor(state: GameState, actor: 'player' | 'ai'): GameState {
  let current = state;
  let safetySteps = 0;

  while (
    current.phase !== 'gameover' &&
    current.activePlayer === actor &&
    safetySteps < 25
  ) {
    safetySteps += 1;
    const step = executeTurnStepForActor(current, actor);
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
export function runFullAiTurn(state: GameState): GameState {
  return runFullTurnForActor(state, 'ai');
}

/**
 * ============================================================================
 * IA TÁTICA PARA O SISTEMA DE RODADAS EM FASES SIMULTÂNEAS
 * ============================================================================
 * - Fase 1 (executeAiDeployPhase):
 *   A IA recicla 1 carta no Altar (se vantajoso) e invoca suas Criaturas, Relíquias e Emboscadas
 *   em Névoa de Guerra (isConcealedDeploy = true), sem enxergar as invocações ocultas do Jogador!
 */
export function executeAiDeployPhase(state: GameState): GameState {
  if (state.phase === 'gameover') return state;
  let current = state;

  // 1. Channel 1 card if not yet channeled this round
  if (!current.ai.hasChanneledThisTurn) {
    const channelIdx = chooseBestCardToChannel(current);
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
      if (card.type === 'spell') continue; // Spells are cast in Phase 2!
      const check = canPlayCard(current, 'ai', card);
      if (!check.allowed) continue;

      const evalResult = evaluateCardPlayValue(current, card);
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

/**
 * Classifies a spell's Arcane Speed Priority for Wave 1 (Problema 4):
 * 1 = Protection / Shields / Healing / Buffs
 * 2 = Control / Freeze / Bounce / Debuffs
 * 3 = Direct Damage / Destruction
 */
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

/**
 * Fase 2 — Onda 1 & Posturas Táticas da IA (executeAiCombatPlanWave1):
 * 1. Avalia Contramedidas contra Expansão de Domínio do Jogador (Disputa de Domínio, Domínio Simples 2⚡ ou Quebra por Sacrifício 10❤️).
 * 2. Avalia ativar sua própria Expansão de Domínio (6+ Afinidade, 3⚡).
 * 3. Executa Ascensões, Feitiços (em ordem de Velocidade Arcana: 1. Proteção/Cura ➔ 2. Controle/Congelar ➔ 3. Dano) e Poder do Soberano.
 * 4. Define a Postura ('attack' vs 'defend' +1🛡️) e o Alvo Planejado (plannedTargetId) de cada criatura da IA.
 */
export function executeAiCombatPlanWave1(state: GameState): GameState {
  if (state.phase === 'gameover') return state;
  let current = state;

  // 1. Domain Expansion & Countermeasures
  const activeDom = current.domainExpansion;
  const playerTotalReadyAtk = getAllBoardUnits(current.player)
    .filter((u) => !u.isTrap && u.card.type === 'creature' && !u.isFrozen && !u.hasSummoningSickness)
    .reduce((sum, u) => sum + Math.max(0, u.currentAtk), 0);

  if (activeDom && activeDom.owner === 'player' && !activeDom.clashRival) {
    // Priority A: Invoke AI's own Domain Expansion to trigger a Domain Clash!
    if (canInvokeDomainExpansion(current, 'ai').allowed) {
      current = invokeDomainExpansion(current, 'ai');
    } else if (
      (playerTotalReadyAtk >= 5 || current.ai.hp <= 20) &&
      canUseSimpleDomain(current, 'ai')
    ) {
      // Priority B: Use Simple Domain (2⚡) to nullify Sure-Hit for this round
      current = activateSimpleDomain(current, 'ai');
    } else if (
      (playerTotalReadyAtk >= current.ai.hp ||
        (playerTotalReadyAtk >= 7 && getTotalAvailableSacrificePool(current, 'ai') >= 22)) &&
      canBreakDomainExpansionWithSacrifice(current, 'ai')
    ) {
      // Priority C: Break Player's Domain Expansion via 10❤️ distributed sacrifice!
      current = breakDomainExpansionWithSacrifice(current, 'ai');
    }
  } else if (!activeDom && canInvokeDomainExpansion(current, 'ai').allowed) {
    // AI expands its own Domain when it has creatures on board or strong affinity advantage
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

  // 3. Cast Spells in Arcane Speed Order (Tier 1: Protection/Heal -> Tier 2: Control/Freeze -> Tier 3: Damage)
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

        const evalResult = evaluateCardPlayValue(current, card);
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
  for (const unit of aiUnits) {
    if (unit.hasSummoningSickness || unit.isFrozen || unit.currentAtk <= 0) {
      if (unit.stance !== 'defend') {
        current = toggleUnitStance(current, 'ai', unit.instanceId);
      }
      continue;
    }

    // Check if this unit should hold defensive bastion stance (+1🛡️ Armor & column interception)
    const enemyInSameCol = [
      ...getAllBoardUnits(current.player).filter(
        (e) => !e.isTrap && e.card.type === 'creature' && e.slotIndex === unit.slotIndex
      ),
    ];
    const shouldHoldBastionDefense =
      unit.keywords.includes('Guardião') &&
      unit.currentAtk <= 2 &&
      enemyInSameCol.length > 0 &&
      current.ai.hp <= 16;

    if (shouldHoldBastionDefense) {
      if (unit.stance !== 'defend') {
        current = toggleUnitStance(current, 'ai', unit.instanceId);
      }
    } else {
      if (unit.stance === 'defend') {
        current = toggleUnitStance(current, 'ai', unit.instanceId);
      }
      const validTargets = getValidAttackTargets(current, unit.instanceId, true);
      const chosenTarget = chooseBestTargetForAttacker(current, unit, validTargets);
      if (chosenTarget) {
        current = setUnitAttackTarget(current, 'ai', unit.instanceId, chosenTarget);
      }
    }
  }

  return current;
}
