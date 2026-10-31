import { CARDS_BY_ID } from '../data/cards';
import { MAX_COPIES_BY_RARITY } from '../data/decks';
import { CardDefinition, Rarity } from '../types/game';

export const CRAFT_COST_BY_RARITY: Record<Rarity, number> = {
  common: 20,
  uncommon: 50,
  rare: 140,
  legendary: 360,
};

export const DISENCHANT_YIELD_BY_RARITY: Record<Rarity, number> = {
  common: 5,
  uncommon: 15,
  rare: 40,
  legendary: 120,
};

export interface PackCardResolution {
  cardId: string;
  status: 'new' | 'added' | 'duplicate_shards';
  shardsGranted: number;
  resultingOwned: number;
}

export function resolvePackDuplicatesWithShards(
  currentTotalUnlocked: Record<string, number>,
  currentExtraUnlocked: Record<string, number>,
  drawnCards: CardDefinition[]
): {
  nextExtraUnlocked: Record<string, number>;
  shardsEarned: number;
  cardOutcomes: PackCardResolution[];
} {
  const runningTotal: Record<string, number> = { ...currentTotalUnlocked };
  const nextExtra: Record<string, number> = { ...currentExtraUnlocked };
  let shardsEarned = 0;
  const cardOutcomes: PackCardResolution[] = [];

  for (const card of drawnCards) {
    const prevTotal = runningTotal[card.id] ?? 0;
    const maxUseful = MAX_COPIES_BY_RARITY[card.rarity] ?? 3;

    if (prevTotal < maxUseful) {
      runningTotal[card.id] = prevTotal + 1;
      nextExtra[card.id] = (nextExtra[card.id] ?? 0) + 1;
      cardOutcomes.push({
        cardId: card.id,
        status: prevTotal === 0 ? 'new' : 'added',
        shardsGranted: 0,
        resultingOwned: prevTotal + 1,
      });
    } else {
      const yieldAmt = DISENCHANT_YIELD_BY_RARITY[card.rarity] ?? 5;
      shardsEarned += yieldAmt;
      cardOutcomes.push({
        cardId: card.id,
        status: 'duplicate_shards',
        shardsGranted: yieldAmt,
        resultingOwned: prevTotal,
      });
    }
  }

  return {
    nextExtraUnlocked: nextExtra,
    shardsEarned,
    cardOutcomes,
  };
}

export function salvageAllExcessDuplicates(
  baseCardIds: string[],
  extraUnlockedCards: Record<string, number>
): {
  cleanedExtraUnlocked: Record<string, number>;
  totalShardsEarned: number;
  cardsSalvagedCount: number;
} {
  const baseCounts: Record<string, number> = {};
  for (const cid of baseCardIds) {
    baseCounts[cid] = (baseCounts[cid] ?? 0) + 1;
  }

  const cleanedExtraUnlocked: Record<string, number> = {};
  let totalShardsEarned = 0;
  let cardsSalvagedCount = 0;

  for (const [cid, extraCnt] of Object.entries(extraUnlockedCards)) {
    if (!extraCnt || extraCnt <= 0) continue;
    const card = CARDS_BY_ID[cid];
    if (!card) {
      cleanedExtraUnlocked[cid] = extraCnt;
      continue;
    }
    const maxUseful = MAX_COPIES_BY_RARITY[card.rarity] ?? 3;
    const baseCnt = baseCounts[cid] ?? 0;
    const maxExtraUseful = Math.max(0, maxUseful - baseCnt);

    if (extraCnt > maxExtraUseful) {
      const excess = extraCnt - maxExtraUseful;
      const yieldAmt = DISENCHANT_YIELD_BY_RARITY[card.rarity] ?? 5;
      totalShardsEarned += excess * yieldAmt;
      cardsSalvagedCount += excess;
      if (maxExtraUseful > 0) {
        cleanedExtraUnlocked[cid] = maxExtraUseful;
      }
    } else {
      cleanedExtraUnlocked[cid] = extraCnt;
    }
  }

  return {
    cleanedExtraUnlocked,
    totalShardsEarned,
    cardsSalvagedCount,
  };
}

export function canCraftCard(
  card: CardDefinition,
  ownedCopies: number,
  astralShards: number
): {
  canCraft: boolean;
  maxAllowed: number;
  cost: number;
  isMaxCopiesReached: boolean;
} {
  const maxAllowed = MAX_COPIES_BY_RARITY[card.rarity] ?? 3;
  const cost = CRAFT_COST_BY_RARITY[card.rarity] ?? 20;
  const isMaxCopiesReached = ownedCopies >= maxAllowed;
  return {
    canCraft: !isMaxCopiesReached && astralShards >= cost,
    maxAllowed,
    cost,
    isMaxCopiesReached,
  };
}

export function craftSingleCardCopy(
  card: CardDefinition,
  ownedCopies: number,
  currentExtraUnlocked: Record<string, number>,
  currentAstralShards: number
): {
  ok: boolean;
  nextExtraUnlocked: Record<string, number>;
  nextAstralShards: number;
  costPaid: number;
} {
  const check = canCraftCard(card, ownedCopies, currentAstralShards);
  if (!check.canCraft) {
    return {
      ok: false,
      nextExtraUnlocked: currentExtraUnlocked,
      nextAstralShards: currentAstralShards,
      costPaid: 0,
    };
  }
  const nextExtra = {
    ...currentExtraUnlocked,
    [card.id]: (currentExtraUnlocked[card.id] ?? 0) + 1,
  };
  return {
    ok: true,
    nextExtraUnlocked: nextExtra,
    nextAstralShards: Math.max(0, currentAstralShards - check.cost),
    costPaid: check.cost,
  };
}
