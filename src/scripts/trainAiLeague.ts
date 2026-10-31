import fs from 'fs';
import path from 'path';
import { CARDS_BY_ID } from '../data/cards';
import { PREBUILT_DECKS } from '../data/decks';
import {
  AiDecisionWeights,
  AI_LEAGUE_SUMMARY,
  AI_LEARNED_PROFILES,
  BASELINE_AI_PROFILE,
  DeckLearnedAiProfile,
  DEFAULT_AI_WEIGHTS,
  DiscoveredCardCombo,
} from '../data/aiLearnedProfiles';
import { createInitialGameState, getAllBoardUnits, mulliganCards } from '../engine/gameEngine';
import {
  chooseMulliganIndicesForActor,
  executeTurnStepForActor,
} from '../engine/aiEngine';
import { CardDefinition, PrebuiltDeck } from '../types/game';

interface CardStatBucket {
  mulliganKeptGames: number;
  mulliganKeptWins: number;
  earlyChannelGames: number;
  earlyChannelWins: number;
  playedGames: number;
  playedWins: number;
}

interface PairStatBucket {
  cardAId: string;
  cardBId: string;
  games: number;
  wins: number;
}

interface DeckTelemetry {
  totalGames: number;
  totalWins: number;
  cards: Map<string, CardStatBucket>;
  pairs: Map<string, PairStatBucket>;
}

interface DuelResult {
  winner: 'player' | 'ai' | 'draw';
  scorePlayer: number; // 1, 0, or continuous tie-broken [0.15..0.85]
  hpDiffPlayer: number;
  turns: number;
  playerKeptIds: Set<string>;
  aiKeptIds: Set<string>;
  playerEarlyChannelIds: Set<string>;
  aiEarlyChannelIds: Set<string>;
  playerPlayedIds: Set<string>;
  aiPlayedIds: Set<string>;
}

const RESOLVED_DECK_CACHE = new Map<string, CardDefinition[]>();

function getDeckCards(deck: PrebuiltDeck): CardDefinition[] {
  let cached = RESOLVED_DECK_CACHE.get(deck.id);
  if (!cached) {
    cached = deck.cardIds.map((id) => {
      const c = CARDS_BY_ID[id];
      if (!c) throw new Error(`Missing card ${id} in deck ${deck.id}`);
      return c;
    });
    RESOLVED_DECK_CACHE.set(deck.id, cached);
  }
  return cached;
}

function getOrCreateCardBucket(telemetry: DeckTelemetry, cardId: string): CardStatBucket {
  let b = telemetry.cards.get(cardId);
  if (!b) {
    b = {
      mulliganKeptGames: 0,
      mulliganKeptWins: 0,
      earlyChannelGames: 0,
      earlyChannelWins: 0,
      playedGames: 0,
      playedWins: 0,
    };
    telemetry.cards.set(cardId, b);
  }
  return b;
}

function recordDuelTelemetry(
  telemetryMap: Map<string, DeckTelemetry>,
  deckId: string,
  won: number,
  keptIds: Set<string>,
  earlyChannelIds: Set<string>,
  playedIds: Set<string>
): void {
  const tel = telemetryMap.get(deckId);
  if (!tel) return;

  tel.totalGames += 1;
  tel.totalWins += won;

  for (const cid of keptIds) {
    const b = getOrCreateCardBucket(tel, cid);
    b.mulliganKeptGames += 1;
    b.mulliganKeptWins += won;
  }

  for (const cid of earlyChannelIds) {
    const b = getOrCreateCardBucket(tel, cid);
    b.earlyChannelGames += 1;
    b.earlyChannelWins += won;
  }

  const playedArr = Array.from(playedIds).sort();
  for (const cid of playedArr) {
    const b = getOrCreateCardBucket(tel, cid);
    b.playedGames += 1;
    b.playedWins += won;
  }

  for (let i = 0; i < playedArr.length; i++) {
    for (let j = i + 1; j < playedArr.length; j++) {
      const a = playedArr[i];
      const b = playedArr[j];
      const key = `${a}__${b}`;
      let pb = tel.pairs.get(key);
      if (!pb) {
        pb = { cardAId: a, cardBId: b, games: 0, wins: 0 };
        tel.pairs.set(key, pb);
      }
      pb.games += 1;
      pb.wins += won;
    }
  }
}

/**
 * Runs a complete symmetric AI vs AI match directly on the pure engine without perspective swapping,
 * collecting exact Mulligan, Turn 1-4 Channel, and Card/Combo Co-Play telemetry.
 */
function playInstrumentedDuel(
  playerDeck: PrebuiltDeck,
  aiDeck: PrebuiltDeck,
  playerProfile: DeckLearnedAiProfile,
  aiProfile: DeckLearnedAiProfile,
  maxHalfTurns = 72
): DuelResult {
  let state = createInitialGameState(getDeckCards(playerDeck), getDeckCards(aiDeck), {
    playerName: playerDeck.name,
    aiName: aiDeck.name,
    playerDeckId: playerDeck.id,
    aiDeckId: aiDeck.id,
  });

  // Opening Mulligan for both sides
  const playerSwap = chooseMulliganIndicesForActor(state, 'player', playerProfile);
  const playerSwapSet = new Set(playerSwap);
  const playerKeptIds = new Set<string>();
  state.player.hand.forEach((c, idx) => {
    if (!playerSwapSet.has(idx)) playerKeptIds.add(c.id);
  });
  state = mulliganCards(state, 'player', playerSwap);

  const aiSwap = chooseMulliganIndicesForActor(state, 'ai', aiProfile);
  const aiSwapSet = new Set(aiSwap);
  const aiKeptIds = new Set<string>();
  state.ai.hand.forEach((c, idx) => {
    if (!aiSwapSet.has(idx)) aiKeptIds.add(c.id);
  });
  state = mulliganCards(state, 'ai', aiSwap);

  const playerEarlyChannelIds = new Set<string>();
  const aiEarlyChannelIds = new Set<string>();
  const playerPlayedIds = new Set<string>();
  const aiPlayedIds = new Set<string>();

  const overrides = { player: playerProfile, ai: aiProfile };
  let halfTurns = 0;

  while (state.phase !== 'gameover' && halfTurns < maxHalfTurns) {
    halfTurns += 1;
    const actor = state.activePlayer;
    let safety = 0;

    while (state.phase !== 'gameover' && state.activePlayer === actor && safety < 28) {
      safety += 1;
      const prevSide = state[actor];
      const prevChanneledLen = prevSide.channeledCards.length;
      const prevHand = prevSide.hand;
      const turnNum = state.turn;

      const step = executeTurnStepForActor(state, actor, overrides);
      const nextSide = step.nextState[actor];

      if (nextSide.channeledCards.length > prevChanneledLen) {
        const channeled = nextSide.channeledCards[nextSide.channeledCards.length - 1];
        if (channeled && turnNum <= 4) {
          if (actor === 'player') playerEarlyChannelIds.add(channeled.id);
          else aiEarlyChannelIds.add(channeled.id);
        }
      } else if (step.actionSummary.includes(' jogou [')) {
        for (let h = 0; h < prevHand.length; h++) {
          const cand = prevHand[h];
          if (step.actionSummary.includes(` jogou [${cand.name}]`)) {
            if (actor === 'player') playerPlayedIds.add(cand.id);
            else aiPlayedIds.add(cand.id);
            break;
          }
        }
      }

      state = step.nextState;
      if (step.done) break;
    }
  }

  const pBoardPower = getAllBoardUnits(state.player)
    .filter((u) => !u.isTrap)
    .reduce((s, u) => s + u.currentAtk * 1.2 + u.currentHp * 0.5, 0);
  const aBoardPower = getAllBoardUnits(state.ai)
    .filter((u) => !u.isTrap)
    .reduce((s, u) => s + u.currentAtk * 1.2 + u.currentHp * 0.5, 0);

  let winner: 'player' | 'ai' | 'draw' = 'draw';
  let scorePlayer = 0.5;

  if (state.winner === 'player') {
    winner = 'player';
    scorePlayer = 1.0;
  } else if (state.winner === 'ai') {
    winner = 'ai';
    scorePlayer = 0.0;
  } else {
    const netAdv = state.player.hp + pBoardPower * 0.45 - (state.ai.hp + aBoardPower * 0.45);
    if (netAdv > 2.5) {
      winner = 'player';
      scorePlayer = 0.8;
    } else if (netAdv < -2.5) {
      winner = 'ai';
      scorePlayer = 0.2;
    } else {
      scorePlayer = 0.5;
    }
  }

  return {
    winner,
    scorePlayer,
    hpDiffPlayer: state.player.hp - state.ai.hp,
    turns: state.turn,
    playerKeptIds,
    aiKeptIds,
    playerEarlyChannelIds,
    aiEarlyChannelIds,
    playerPlayedIds,
    aiPlayedIds,
  };
}

function buildComboSynergyNote(
  cardA: CardDefinition,
  cardB: CardDefinition,
  coPlayWr: number,
  lift: number
): string {
  const [first, second] = cardA.cost <= cardB.cost ? [cardA, cardB] : [cardB, cardA];
  const liftTxt = lift >= 0 ? `+${lift.toFixed(1)}%` : `${lift.toFixed(1)}%`;

  const hasGuardian =
    first.keywords.includes('Guardião') ||
    second.keywords.includes('Guardião') ||
    first.armor >= 2 ||
    second.armor >= 2;
  const hasRelicOrRanged =
    first.type === 'relic' ||
    second.type === 'relic' ||
    first.keywords.includes('Alcance') ||
    second.keywords.includes('Alcance');

  if (hasGuardian && hasRelicOrRanged) {
    return `${first.name} (${first.cost}⚡) trava a Vanguarda enquanto ${second.name} (${second.cost}⚡) opera protegido com +1 ATQ de Cobertura (${coPlayWr.toFixed(1)}% WR, ${liftTxt} Lift).`;
  }

  const hasControlOrRemoval = [...first.effects, ...second.effects].some(
    (e) =>
      e.type === 'freeze_enemy' ||
      e.type === 'freeze_enemy_vanguard' ||
      e.type === 'destroy_enemy' ||
      e.type === 'damage_enemy_row' ||
      e.type === 'damage_single_enemy' ||
      e.type === 'bounce_enemy'
  );
  const hasFinisher =
    first.atk >= 5 ||
    second.atk >= 5 ||
    first.keywords.includes('Ímpeto') ||
    second.keywords.includes('Ímpeto') ||
    first.keywords.includes('Voo') ||
    second.keywords.includes('Voo');

  if (hasControlOrRemoval && hasFinisher) {
    return `Abertura de corredor tático: ${first.name} neutraliza bloqueadores para a infiltração letal de ${second.name} (${coPlayWr.toFixed(1)}% WR, ${liftTxt} Lift).`;
  }

  const hasMassBuff = [...first.effects, ...second.effects].some(
    (e) =>
      e.type === 'buff_all_allies' ||
      e.type === 'buff_target_ally' ||
      e.type === 'shield_all_allies'
  );
  if (hasMassBuff) {
    return `Multiplicador de falange: escalona atributos e sobrevivência combinando ${first.name} + ${second.name} na mesma janela de pressão (${coPlayWr.toFixed(1)}% WR, ${liftTxt} Lift).`;
  }

  const hasRampOrDraw = [...first.effects, ...second.effects].some(
    (e) => e.type === 'grant_bonus_essence' || e.type === 'draw_cards'
  );
  if (hasRampOrDraw) {
    return `Motor de aceleração: ${first.name} antecipa recursos e fôlego para sustentar o impacto de ${second.name} (${coPlayWr.toFixed(1)}% WR, ${liftTxt} Lift).`;
  }

  const hasCrypt = [...first.effects, ...second.effects].some(
    (e) => e.type === 'revive_from_crypt'
  );
  if (hasCrypt) {
    return `Recursão da Cripta: recicla ameaças abatidas entre ${first.name} e ${second.name}, esgotando as remoções rivais (${coPlayWr.toFixed(1)}% WR, ${liftTxt} Lift).`;
  }

  return `Sinergia empírica de alta conversão: curvar ${first.name} (${first.cost}⚡) rumo a ${second.name} (${second.cost}⚡) eleva o domínio de mesa (${coPlayWr.toFixed(1)}% WR, ${liftTxt} Lift).`;
}

function extractEmpiricalListsIntoProfile(
  deck: PrebuiltDeck,
  profile: DeckLearnedAiProfile,
  telemetry: DeckTelemetry
): DeckLearnedAiProfile {
  const uniqueCardIds = Array.from(new Set(deck.cardIds));
  const baseWr =
    telemetry.totalGames > 0 ? telemetry.totalWins / telemetry.totalGames : 0.5;

  // 1. Mulligan Keeps (prefer cost <= 4 cards with strong empirical kept WR)
  const mulliganScored = uniqueCardIds
    .map((cid) => {
      const card = CARDS_BY_ID[cid]!;
      const b = telemetry.cards.get(cid);
      const games = b?.mulliganKeptGames ?? 0;
      const wins = b?.mulliganKeptWins ?? 0;
      const smoothedWr = (wins + 5 * baseWr) / (games + 5);
      const curveBonus = card.cost <= 3 && card.type !== 'spell' ? 0.035 : card.cost === 4 ? 0.01 : -0.04;
      return { cid, card, games, smoothedWr: smoothedWr + curveBonus };
    })
    .filter((x) => x.card.cost <= 4 && !x.card.effects.some((e) => e.type === 'break_domain_expansion'))
    .sort((a, b) => b.smoothedWr - a.smoothedWr);

  const mulliganKeepIds = mulliganScored.slice(0, 6).map((x) => x.cid);

  // 2. Early Channel Priority & Channel Avoid (Turns 1-4)
  const channelScored = uniqueCardIds.map((cid) => {
    const card = CARDS_BY_ID[cid]!;
    const b = telemetry.cards.get(cid);
    const chGames = b?.earlyChannelGames ?? 0;
    const chWins = b?.earlyChannelWins ?? 0;
    const plGames = b?.playedGames ?? 0;
    const plWins = b?.playedWins ?? 0;
    const chSmoothed = (chWins + 4 * baseWr) / (chGames + 4);
    const plSmoothed = (plWins + 5 * baseWr) / (plGames + 5);
    return {
      cid,
      card,
      chGames,
      plGames,
      chSmoothed,
      plSmoothed,
      netChannelAdvantage: chSmoothed - plSmoothed + (card.cost >= 5 && card.rarity !== 'legendary' ? 0.03 : 0),
    };
  });

  const channelPriorityIds = [...channelScored]
    .filter(
      (x) =>
        x.card.rarity !== 'legendary' &&
        !x.card.effects.some((e) => e.type === 'break_domain_expansion') &&
        x.card.cost >= 3
    )
    .sort((a, b) => b.netChannelAdvantage - a.netChannelAdvantage)
    .slice(0, 5)
    .map((x) => x.cid);

  const channelAvoidIds = [...channelScored]
    .sort((a, b) => b.plSmoothed - a.plSmoothed)
    .slice(0, 6)
    .map((x) => x.cid)
    .filter((cid) => !channelPriorityIds.includes(cid));

  // 3. High-Impact Card Play Boosts (-10 .. +18)
  const highImpactCardBoosts: Record<string, number> = {};
  const playRanked = [...channelScored]
    .filter((x) => x.plGames >= 3)
    .sort((a, b) => b.plSmoothed - a.plSmoothed);

  for (const item of playRanked.slice(0, 8)) {
    const liftPct = (item.plSmoothed - baseWr) * 100;
    const boost = Math.max(4, Math.min(18, Math.round(liftPct * 1.15 + 4)));
    highImpactCardBoosts[item.cid] = boost;
  }

  // 4. Co-Played Card Pairs & Top 5 Discovered Combos
  const minPairSamples = telemetry.totalGames >= 120 ? 6 : 3;
  let candidatePairs = Array.from(telemetry.pairs.values()).filter(
    (p) => p.games >= minPairSamples
  );
  if (candidatePairs.length < 5) {
    candidatePairs = Array.from(telemetry.pairs.values()).filter((p) => p.games >= 2);
  }

  const scoredPairs = candidatePairs
    .map((p) => {
      const rawWr = p.wins / p.games;
      const smoothedWr = (p.wins + 4.5 * baseWr) / (p.games + 4.5);
      const liftPct = (rawWr - baseWr) * 100;
      const smoothedLift = (smoothedWr - baseWr) * 100;
      return {
        ...p,
        rawWrPct: Math.round(rawWr * 1000) / 10,
        liftPct: Math.round(liftPct * 10) / 10,
        rankScore: smoothedLift + Math.min(4, p.games * 0.12),
      };
    })
    .sort((a, b) => b.rankScore - a.rankScore);

  const discoveredCombos: DiscoveredCardCombo[] = [];
  const usedComboCardCounts: Record<string, number> = {};

  for (const sp of scoredPairs) {
    if (discoveredCombos.length >= 5) break;
    // Encourage variety across the 5 discovered combos (max 2 appearances of the same card)
    if (
      (usedComboCardCounts[sp.cardAId] ?? 0) >= 2 ||
      (usedComboCardCounts[sp.cardBId] ?? 0) >= 2
    ) {
      continue;
    }
    const cardA = CARDS_BY_ID[sp.cardAId];
    const cardB = CARDS_BY_ID[sp.cardBId];
    if (!cardA || !cardB) continue;

    usedComboCardCounts[sp.cardAId] = (usedComboCardCounts[sp.cardAId] ?? 0) + 1;
    usedComboCardCounts[sp.cardBId] = (usedComboCardCounts[sp.cardBId] ?? 0) + 1;

    discoveredCombos.push({
      cardAId: sp.cardAId,
      cardBId: sp.cardBId,
      coPlayWinRate: sp.rawWrPct,
      liftOverBaseline: sp.liftPct,
      sampleCount: sp.games,
      synergyNote: buildComboSynergyNote(cardA, cardB, sp.rawWrPct, sp.liftPct),
    });
  }

  // Fallback if deck had fewer than 5 diverse pairs
  for (const sp of scoredPairs) {
    if (discoveredCombos.length >= 5) break;
    if (
      discoveredCombos.some(
        (dc) => dc.cardAId === sp.cardAId && dc.cardBId === sp.cardBId
      )
    ) {
      continue;
    }
    const cardA = CARDS_BY_ID[sp.cardAId];
    const cardB = CARDS_BY_ID[sp.cardBId];
    if (!cardA || !cardB) continue;
    discoveredCombos.push({
      cardAId: sp.cardAId,
      cardBId: sp.cardBId,
      coPlayWinRate: sp.rawWrPct,
      liftOverBaseline: sp.liftPct,
      sampleCount: sp.games,
      synergyNote: buildComboSynergyNote(cardA, cardB, sp.rawWrPct, sp.liftPct),
    });
  }

  const synergyPairs: Array<[string, string]> = discoveredCombos.map((dc) => [
    dc.cardAId,
    dc.cardBId,
  ]);

  return {
    ...profile,
    mulliganKeepIds,
    channelPriorityIds,
    channelAvoidIds,
    highImpactCardBoosts,
    synergyPairs,
    discoveredCombos,
  };
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(val * 100) / 100));
}

function mutateWeights(base: AiDecisionWeights, scale: number): AiDecisionWeights {
  const next: AiDecisionWeights = { ...base };
  const keys: Array<{
    key: keyof AiDecisionWeights;
    min: number;
    max: number;
    step: number;
  }> = [
    { key: 'aggroFaceBias', min: 0.55, max: 1.95, step: 0.24 },
    { key: 'tradeValueBias', min: 0.55, max: 1.95, step: 0.24 },
    { key: 'guardianPriority', min: 0.55, max: 1.95, step: 0.24 },
    { key: 'flyingEvasionBias', min: 0.55, max: 1.95, step: 0.24 },
    { key: 'stackConsolidationBias', min: 0.45, max: 1.95, step: 0.26 },
    { key: 'antiAoeSpreadBias', min: 0.45, max: 1.95, step: 0.26 },
    { key: 'spellHoldPatience', min: 0.55, max: 1.75, step: 0.22 },
    { key: 'relicPriority', min: 0.55, max: 1.95, step: 0.24 },
    { key: 'ascensionEagerness', min: 0.55, max: 1.95, step: 0.24 },
    { key: 'bloodPactThresholdHp', min: 12, max: 36, step: 4.5 },
    { key: 'domainExpansionEagerness', min: 0.6, max: 1.95, step: 0.24 },
    { key: 'sovPowerTempoBias', min: 0.5, max: 1.85, step: 0.22 },
    { key: 'synergyHoldBonus', min: 8, max: 40, step: 5.5 },
    { key: 'mulliganCurveTarget', min: 2.1, max: 4.3, step: 0.38 },
  ];

  // Mutate 4 randomly chosen dimensions per offspring
  const shuffled = [...keys].sort(() => Math.random() - 0.5);
  const count = 3 + Math.floor(Math.random() * 3); // 3 to 5 genes
  for (let i = 0; i < count; i++) {
    const spec = shuffled[i];
    const delta = (Math.random() - 0.5) * 2 * spec.step * scale;
    const raw = next[spec.key] + delta;
    next[spec.key] =
      spec.key === 'bloodPactThresholdHp' || spec.key === 'synergyHoldBonus'
        ? Math.round(clamp(raw, spec.min, spec.max))
        : clamp(raw, spec.min, spec.max);
  }

  return next;
}

const SPARRING_GAUNTLET_IDS = [
  'deck_red_inferno',
  'deck_blue_tempest',
  'deck_purple_abyss',
  'deck_green_wild',
  'deck_gold_bastion',
  'deck_squad_thousand_shields',
  'deck_tri_arcane_cataclysm',
  'deck_penta_valkyra_pact',
];

function getSparringOpponentsForDeck(deck: PrebuiltDeck): PrebuiltDeck[] {
  const list: PrebuiltDeck[] = [];
  for (const gid of SPARRING_GAUNTLET_IDS) {
    const found = PREBUILT_DECKS.find((d) => d.id === gid);
    if (found && found.id !== deck.id) {
      list.push(found);
    }
  }
  if (list.length < 8) {
    for (const d of PREBUILT_DECKS) {
      if (d.id !== deck.id && !list.some((x) => x.id === d.id)) {
        list.push(d);
        if (list.length >= 8) break;
      }
    }
  }
  return list.slice(0, 8);
}

function evaluateCandidateOnGauntlet(
  deck: PrebuiltDeck,
  candidateProfile: DeckLearnedAiProfile,
  opponents: PrebuiltDeck[],
  profilesById: Map<string, DeckLearnedAiProfile>,
  telemetryMap: Map<string, DeckTelemetry>,
  pairsPerOpponent: number
): { fitness: number; winRate: number; gamesPlayed: number } {
  let totalScore = 0;
  let totalHpDiff = 0;
  let games = 0;

  for (const opp of opponents) {
    const oppProfile = profilesById.get(opp.id) ?? BASELINE_AI_PROFILE;
    for (let r = 0; r < pairsPerOpponent; r++) {
      // Game A: candidate goes 1st ('player')
      const g1 = playInstrumentedDuel(deck, opp, candidateProfile, oppProfile);
      totalScore += g1.scorePlayer;
      totalHpDiff += Math.max(-25, Math.min(25, g1.hpDiffPlayer));
      games += 1;
      recordDuelTelemetry(
        telemetryMap,
        deck.id,
        g1.scorePlayer,
        g1.playerKeptIds,
        g1.playerEarlyChannelIds,
        g1.playerPlayedIds
      );

      // Game B: candidate goes 2nd ('ai')
      const g2 = playInstrumentedDuel(opp, deck, oppProfile, candidateProfile);
      const cScore2 = 1 - g2.scorePlayer;
      totalScore += cScore2;
      totalHpDiff += Math.max(-25, Math.min(25, -g2.hpDiffPlayer));
      games += 1;
      recordDuelTelemetry(
        telemetryMap,
        deck.id,
        cScore2,
        g2.aiKeptIds,
        g2.aiEarlyChannelIds,
        g2.aiPlayedIds
      );
    }
  }

  const winRate = (totalScore / Math.max(1, games)) * 100;
  const avgHpDiff = totalHpDiff / Math.max(1, games);
  const fitness = winRate + avgHpDiff * 0.16;
  return { fitness, winRate, gamesPlayed: games };
}

function runDirectMirrorComparison(
  deck: PrebuiltDeck,
  challenger: DeckLearnedAiProfile,
  incumbent: DeckLearnedAiProfile,
  pairCount: number
): number {
  let challengerPts = 0;
  let games = 0;
  for (let i = 0; i < pairCount; i++) {
    const m1 = playInstrumentedDuel(deck, deck, challenger, incumbent);
    challengerPts += m1.scorePlayer;
    games += 1;

    const m2 = playInstrumentedDuel(deck, deck, incumbent, challenger);
    challengerPts += 1 - m2.scorePlayer;
    games += 1;
  }
  return (challengerPts / Math.max(1, games)) * 100;
}

function buildArchetypeSeedProfile(deck: PrebuiltDeck): DeckLearnedAiProfile {
  const isRed = deck.domains.includes('red');
  const isBlue = deck.domains.includes('blue');
  const isGold = deck.domains.includes('gold');
  const isGreen = deck.domains.includes('green');
  const isPurple = deck.domains.includes('purple');
  const isSquad = deck.id.includes('squad');

  return {
    deckId: deck.id,
    deckName: deck.name,
    archetypeTag: deck.subtitle,
    generationsTrained: 0,
    matchesSimulated: 0,
    baselineWinRate: 50,
    trainedWinRate: 50,
    weights: {
      aggroFaceBias: isRed ? 1.28 : isBlue ? 0.86 : 1.02,
      tradeValueBias: isBlue || isGold ? 1.2 : 1.02,
      guardianPriority: isGold || isGreen ? 1.26 : 1.0,
      flyingEvasionBias: isRed || isBlue ? 1.2 : 1.02,
      stackConsolidationBias: isSquad || isGold ? 1.38 : 0.94,
      antiAoeSpreadBias: isSquad ? 0.84 : 1.15,
      spellHoldPatience: isBlue || isPurple ? 1.24 : 0.96,
      relicPriority: isGold || isPurple ? 1.22 : 1.0,
      ascensionEagerness: isGreen || isGold ? 1.24 : 1.05,
      bloodPactThresholdHp: isPurple || isRed ? 20 : 26,
      domainExpansionEagerness: deck.domains.length === 1 ? 1.28 : 1.08,
      sovPowerTempoBias: 1.0,
      synergyHoldBonus: 22,
      mulliganCurveTarget: isRed || isSquad ? 2.8 : isGreen ? 3.5 : 3.2,
    },
    mulliganKeepIds: [],
    channelPriorityIds: [],
    channelAvoidIds: [],
    highImpactCardBoosts: {},
    synergyPairs: [],
    discoveredCombos: [],
  };
}

function serializeLearnedProfilesTs(
  profiles: Record<string, DeckLearnedAiProfile>,
  totalLeagueMatches: number,
  elapsedSec: string
): string {
  const profilesJson = JSON.stringify(profiles, null, 2);

  return `import { CAMPAIGN_BOSSES, PREBUILT_DECKS } from './decks';
import { GameState } from '../types/game';

/**
 * GERADO AUTOMATICAMENTE POR src/scripts/trainAiLeague.ts
 * Total da Maratona IA vs IA: ${totalLeagueMatches.toLocaleString('en-US')} partidas completas simuladas (${elapsedSec}s).
 */

export interface AiDecisionWeights {
  aggroFaceBias: number;
  tradeValueBias: number;
  guardianPriority: number;
  flyingEvasionBias: number;
  stackConsolidationBias: number;
  antiAoeSpreadBias: number;
  spellHoldPatience: number;
  relicPriority: number;
  ascensionEagerness: number;
  bloodPactThresholdHp: number;
  domainExpansionEagerness: number;
  sovPowerTempoBias: number;
  synergyHoldBonus: number;
  mulliganCurveTarget: number;
}

export interface DiscoveredCardCombo {
  cardAId: string;
  cardBId: string;
  coPlayWinRate: number;
  liftOverBaseline: number;
  sampleCount: number;
  synergyNote: string;
}

export interface DeckLearnedAiProfile {
  deckId: string;
  deckName: string;
  archetypeTag: string;
  generationsTrained: number;
  matchesSimulated: number;
  baselineWinRate: number;
  trainedWinRate: number;
  weights: AiDecisionWeights;
  mulliganKeepIds: string[];
  channelPriorityIds: string[];
  channelAvoidIds: string[];
  highImpactCardBoosts: Record<string, number>;
  synergyPairs: Array<[string, string]>;
  discoveredCombos: DiscoveredCardCombo[];
}

export const DEFAULT_AI_WEIGHTS: AiDecisionWeights = ${JSON.stringify(DEFAULT_AI_WEIGHTS, null, 2)};

export const BASELINE_AI_PROFILE: DeckLearnedAiProfile = {
  deckId: 'baseline_default',
  deckName: 'Doutrina Base Vaeloriana',
  archetypeTag: 'Equilíbrio Tático Padrão',
  generationsTrained: 0,
  matchesSimulated: 0,
  baselineWinRate: 50,
  trainedWinRate: 50,
  weights: { ...DEFAULT_AI_WEIGHTS },
  mulliganKeepIds: [],
  channelPriorityIds: [],
  channelAvoidIds: [],
  highImpactCardBoosts: {},
  synergyPairs: [],
  discoveredCombos: [],
};

export const AI_LEAGUE_SUMMARY = {
  totalMatchesSimulated: ${totalLeagueMatches},
  decksTrained: ${Object.keys(profiles).length},
  elapsedSeconds: ${Number(elapsedSec)},
} as const;

export const AI_LEARNED_PROFILES: Record<string, DeckLearnedAiProfile> = ${profilesJson};

/**
 * Resolves the learned AI tactical profile for either 'player' or 'ai' in O(1) when deckId/bossId
 * is present, or via fast card-overlap matching for custom/restored decks.
 */
export function resolveLearnedProfileForActor(
  state: GameState,
  actor: 'player' | 'ai',
  overrideProfile?: DeckLearnedAiProfile
): DeckLearnedAiProfile {
  if (overrideProfile) return overrideProfile;

  const explicitDeckId = actor === 'player' ? state.playerDeckId : state.aiDeckId;
  if (explicitDeckId && AI_LEARNED_PROFILES[explicitDeckId]) {
    return AI_LEARNED_PROFILES[explicitDeckId];
  }

  if (actor === 'ai' && state.bossId) {
    const boss = CAMPAIGN_BOSSES.find((b) => b.id === state.bossId);
    if (boss && AI_LEARNED_PROFILES[boss.deckId]) {
      return AI_LEARNED_PROFILES[boss.deckId];
    }
  }

  const actorState = state[actor];
  const sampleIds = new Set<string>();
  for (const c of actorState.hand) sampleIds.add(c.id);
  for (const c of actorState.channeledCards) sampleIds.add(c.id);
  for (const c of actorState.crypt) sampleIds.add(c.id);
  const deckSliceLen = Math.min(28, actorState.deck.length);
  for (let i = 0; i < deckSliceLen; i++) {
    sampleIds.add(actorState.deck[i].id);
  }

  if (sampleIds.size === 0) return BASELINE_AI_PROFILE;

  let bestDeckId: string | null = null;
  let bestHits = 0;

  for (const deck of PREBUILT_DECKS) {
    let hits = 0;
    const seenInDeck = new Set<string>();
    for (const cid of deck.cardIds) {
      if (!seenInDeck.has(cid) && sampleIds.has(cid)) {
        seenInDeck.add(cid);
        hits += 1;
      }
    }
    if (hits > bestHits) {
      bestHits = hits;
      bestDeckId = deck.id;
    }
  }

  if (bestDeckId && bestHits >= 4 && AI_LEARNED_PROFILES[bestDeckId]) {
    return AI_LEARNED_PROFILES[bestDeckId];
  }

  return BASELINE_AI_PROFILE;
}
`;
}

function runAiTrainingMarathon(): void {
  const isQuickCheck = process.argv.includes('--quick');
  const startMs = Date.now();

  console.log('========================================================================');
  console.log(' CHROMATIC PACT — MARATONA EVOLUCIONARIA IA vs IA (30 GRIMORIOS)');
  console.log('========================================================================');

  const profilesById = new Map<string, DeckLearnedAiProfile>();
  const telemetryMap = new Map<string, DeckTelemetry>();
  const matchesPerDeckCounter = new Map<string, number>();

  const isFreshReset = process.argv.includes('--fresh');
  const prevTotalMatches = isFreshReset ? 0 : (AI_LEAGUE_SUMMARY?.totalMatchesSimulated ?? 0);
  const prevElapsedSec = isFreshReset ? 0 : (AI_LEAGUE_SUMMARY?.elapsedSeconds ?? 0);

  for (const deck of PREBUILT_DECKS) {
    const existing = !isFreshReset ? AI_LEARNED_PROFILES[deck.id] : undefined;
    profilesById.set(deck.id, existing ? { ...existing, weights: { ...existing.weights } } : buildArchetypeSeedProfile(deck));
    telemetryMap.set(deck.id, {
      totalGames: 0,
      totalWins: 0,
      cards: new Map(),
      pairs: new Map(),
    });
    matchesPerDeckCounter.set(deck.id, existing?.matchesSimulated ?? 0);
  }

  let globalMatchesSimulated = prevTotalMatches;
  const addMatchCount = (deckAId: string, deckBId: string, count = 1) => {
    globalMatchesSimulated += count;
    matchesPerDeckCounter.set(deckAId, (matchesPerDeckCounter.get(deckAId) ?? 0) + count);
    if (deckBId !== deckAId) {
      matchesPerDeckCounter.set(deckBId, (matchesPerDeckCounter.get(deckBId) ?? 0) + count);
    }
  };

  // Warmup & speed calibration (30 duels)
  const warmStart = Date.now();
  for (let i = 0; i < 30; i++) {
    const dA = PREBUILT_DECKS[i % PREBUILT_DECKS.length];
    const dB = PREBUILT_DECKS[(i + 7) % PREBUILT_DECKS.length];
    playInstrumentedDuel(
      dA,
      dB,
      profilesById.get(dA.id)!,
      profilesById.get(dB.id)!
    );
  }
  const warmElapsedMs = Math.max(1, Date.now() - warmStart);
  const msPerMatch = warmElapsedMs / 30;
  console.log(
    `[Calibracao V8] 30 duelos iniciais concluidos em ${warmElapsedMs}ms (~${msPerMatch.toFixed(2)}ms/partida, ~${Math.round(1000 / msPerMatch)} partidas/seg).`
  );

  const roundRobinGamesPerDirectedPair = isQuickCheck ? 1 : 4;
  const generationsPerCycle = isQuickCheck ? 2 : 8;
  const offspringPerGen = isQuickCheck ? 2 : 3;
  const macroCycles = isQuickCheck ? 1 : 3;
  const benchmarkPairsPerOpponent = isQuickCheck ? 1 : 5; // 8 opponents * 2 sides * 5 = 80 games per contender!

  for (let cycle = 1; cycle <= macroCycles; cycle++) {
    console.log(
      `\n--- [CICLO CO-EVOLUCIONARIO ${cycle}/${macroCycles}] Fase A: Liga Todos-Contra-Todos (30 x 29 = 870 confrontos x ${roundRobinGamesPerDirectedPair}) ---`
    );
    const rrStart = Date.now();
    for (let i = 0; i < PREBUILT_DECKS.length; i++) {
      const deckA = PREBUILT_DECKS[i];
      const profA = profilesById.get(deckA.id)!;
      for (let j = 0; j < PREBUILT_DECKS.length; j++) {
        if (i === j) continue;
        const deckB = PREBUILT_DECKS[j];
        const profB = profilesById.get(deckB.id)!;

        for (let g = 0; g < roundRobinGamesPerDirectedPair; g++) {
          const res = playInstrumentedDuel(deckA, deckB, profA, profB);
          addMatchCount(deckA.id, deckB.id, 1);

          recordDuelTelemetry(
            telemetryMap,
            deckA.id,
            res.scorePlayer,
            res.playerKeptIds,
            res.playerEarlyChannelIds,
            res.playerPlayedIds
          );
          recordDuelTelemetry(
            telemetryMap,
            deckB.id,
            1 - res.scorePlayer,
            res.aiKeptIds,
            res.aiEarlyChannelIds,
            res.aiPlayedIds
          );
        }
      }
      if ((i + 1) % 6 === 0 || i === PREBUILT_DECKS.length - 1) {
        console.log(
          `  Progresso Liga Ciclo ${cycle}: ${i + 1}/${PREBUILT_DECKS.length} grimorios (${globalMatchesSimulated.toLocaleString('en-US')} partidas acumuladas, ${((Date.now() - rrStart) / 1000).toFixed(1)}s)...`
        );
      }
    }

    // Refresh empirical Mulligan, Channel, Card Boost & Combo tables for all 30 decks!
    for (const deck of PREBUILT_DECKS) {
      const updated = extractEmpiricalListsIntoProfile(
        deck,
        profilesById.get(deck.id)!,
        telemetryMap.get(deck.id)!
      );
      profilesById.set(deck.id, updated);
    }
    console.log(
      `  [Telemetria Ciclo ${cycle}] Tabelas de Mulligan, Canalizacao T1-T4 e Combos Sinergicos extraidas para os 30 grimorios!`
    );

    // Phase B: Evolutionary Strategy (1 + lambda) across Generations
    console.log(
      `\n--- [CICLO CO-EVOLUCIONARIO ${cycle}/${macroCycles}] Fase B: Evolucao Genetica de Pesos (${generationsPerCycle} Geracoes x ${offspringPerGen} Mutantes por Deck) ---`
    );
    for (let dIdx = 0; dIdx < PREBUILT_DECKS.length; dIdx++) {
      const deck = PREBUILT_DECKS[dIdx];
      const opponents = getSparringOpponentsForDeck(deck);
      let incumbent = profilesById.get(deck.id)!;

      let incumbentEval = evaluateCandidateOnGauntlet(
        deck,
        incumbent,
        opponents,
        profilesById,
        telemetryMap,
        1
      );
      for (const opp of opponents) addMatchCount(deck.id, opp.id, 2);

      if (cycle === 1) {
        const neutralAnchor: DeckLearnedAiProfile = {
          ...incumbent,
          weights: { ...DEFAULT_AI_WEIGHTS },
        };
        const neutralEval = evaluateCandidateOnGauntlet(
          deck,
          neutralAnchor,
          opponents,
          profilesById,
          telemetryMap,
          1
        );
        for (const opp of opponents) addMatchCount(deck.id, opp.id, 2);
        if (neutralEval.fitness > incumbentEval.fitness + 0.5) {
          incumbent = neutralAnchor;
          incumbentEval = neutralEval;
        }
      }

      for (let gen = 1; gen <= generationsPerCycle; gen++) {
        const coolingScale =
          cycle === 1
            ? Math.max(0.45, 1.05 - (gen - 1) * 0.07)
            : cycle === 2
            ? Math.max(0.3, 0.72 - (gen - 1) * 0.05)
            : Math.max(0.2, 0.48 - (gen - 1) * 0.035);

        let bestMutant: DeckLearnedAiProfile | null = null;
        let bestMutantEval: { fitness: number; winRate: number; gamesPlayed: number } | null =
          null;

        for (let m = 0; m < offspringPerGen; m++) {
          const candidate: DeckLearnedAiProfile = {
            ...incumbent,
            weights: mutateWeights(incumbent.weights, coolingScale),
          };
          const evalRes = evaluateCandidateOnGauntlet(
            deck,
            candidate,
            opponents,
            profilesById,
            telemetryMap,
            1
          );
          for (const opp of opponents) addMatchCount(deck.id, opp.id, 2);

          if (!bestMutantEval || evalRes.fitness > bestMutantEval.fitness) {
            bestMutant = candidate;
            bestMutantEval = evalRes;
          }
        }

        if (bestMutant && bestMutantEval && bestMutantEval.fitness > incumbentEval.fitness + 0.6) {
          // Confirm promotion with direct mirror duel + fresh incumbent re-check to prevent noise drift
          const mirrorWr = runDirectMirrorComparison(deck, bestMutant, incumbent, 3);
          addMatchCount(deck.id, deck.id, 6);

          if (mirrorWr >= 50) {
            incumbent = {
              ...bestMutant,
              generationsTrained: incumbent.generationsTrained + 1,
            };
            incumbentEval = {
              ...bestMutantEval,
              fitness: bestMutantEval.fitness * 0.75 + incumbentEval.fitness * 0.25,
            };
          } else {
            incumbent = {
              ...incumbent,
              generationsTrained: incumbent.generationsTrained + 1,
            };
          }
        } else {
          incumbent = {
            ...incumbent,
            generationsTrained: incumbent.generationsTrained + 1,
          };
        }
      }

      // Re-extract combos & empirical boosts using all new gauntlet telemetry gathered for this deck
      incumbent = extractEmpiricalListsIntoProfile(
        deck,
        incumbent,
        telemetryMap.get(deck.id)!
      );
      profilesById.set(deck.id, incumbent);

      if ((dIdx + 1) % 6 === 0 || dIdx === PREBUILT_DECKS.length - 1) {
        console.log(
          `  Evolucao Ciclo ${cycle}: ${dIdx + 1}/${PREBUILT_DECKS.length} grimorios otimizados (${globalMatchesSimulated.toLocaleString('en-US')} partidas totais)...`
        );
      }
    }
  }

  // Final Validation Benchmark: Evolved Profile vs Pure DEFAULT_AI_WEIGHTS Baseline
  console.log(
    `\n--- [FASE FINAL] Benchmark Oficial de Validacao: Perfil Treinado vs Baseline Padrao ---`
  );
  const finalOutputProfiles: Record<string, DeckLearnedAiProfile> = {};
  let sumBaselineWr = 0;
  let sumTrainedWr = 0;
  let sumMirrorH2HWr = 0;

  for (const deck of PREBUILT_DECKS) {
    const opponents = getSparringOpponentsForDeck(deck);
    let trained = profilesById.get(deck.id)!;

    // Also test conservative hybrids (Archetype Seed + Empirical, and Default Weights + Empirical)
    const seedWithEmpirical = extractEmpiricalListsIntoProfile(
      deck,
      {
        ...buildArchetypeSeedProfile(deck),
        generationsTrained: trained.generationsTrained,
      },
      telemetryMap.get(deck.id)!
    );
    const defaultWithEmpirical = extractEmpiricalListsIntoProfile(
      deck,
      {
        ...trained,
        weights: { ...DEFAULT_AI_WEIGHTS },
      },
      telemetryMap.get(deck.id)!
    );

    let basePts = 0;
    let baseGames = 0;
    let trainedPts = 0;
    let trainedGames = 0;
    let hybridPts = 0;
    let hybridGames = 0;
    let defEmpPts = 0;
    let defEmpGames = 0;

    for (const opp of opponents) {
      const oppRef = profilesById.get(opp.id) ?? BASELINE_AI_PROFILE;
      for (let r = 0; r < benchmarkPairsPerOpponent; r++) {
        // Baseline
        const b1 = playInstrumentedDuel(deck, opp, BASELINE_AI_PROFILE, oppRef);
        const b2 = playInstrumentedDuel(opp, deck, oppRef, BASELINE_AI_PROFILE);
        basePts += b1.scorePlayer + (1 - b2.scorePlayer);
        baseGames += 2;
        addMatchCount(deck.id, opp.id, 2);

        // Trained
        const t1 = playInstrumentedDuel(deck, opp, trained, oppRef);
        const t2 = playInstrumentedDuel(opp, deck, oppRef, trained);
        trainedPts += t1.scorePlayer + (1 - t2.scorePlayer);
        trainedGames += 2;
        addMatchCount(deck.id, opp.id, 2);

        // Archetype Seed + Empirical
        const h1 = playInstrumentedDuel(deck, opp, seedWithEmpirical, oppRef);
        const h2 = playInstrumentedDuel(opp, deck, oppRef, seedWithEmpirical);
        hybridPts += h1.scorePlayer + (1 - h2.scorePlayer);
        hybridGames += 2;
        addMatchCount(deck.id, opp.id, 2);

        // Default Weights + Empirical
        const d1 = playInstrumentedDuel(deck, opp, defaultWithEmpirical, oppRef);
        const d2 = playInstrumentedDuel(opp, deck, oppRef, defaultWithEmpirical);
        defEmpPts += d1.scorePlayer + (1 - d2.scorePlayer);
        defEmpGames += 2;
        addMatchCount(deck.id, opp.id, 2);
      }
    }

    const baseGauntletWr = (basePts / Math.max(1, baseGames)) * 100;
    const trainedGauntletWr = (trainedPts / Math.max(1, trainedGames)) * 100;
    const hybridGauntletWr = (hybridPts / Math.max(1, hybridGames)) * 100;
    const defEmpGauntletWr = (defEmpPts / Math.max(1, defEmpGames)) * 100;

    let selectedChampion = trained;
    let bestGauntletWr = trainedGauntletWr;
    if (hybridGauntletWr > bestGauntletWr + 1.0) {
      selectedChampion = seedWithEmpirical;
      bestGauntletWr = hybridGauntletWr;
    }
    if (defEmpGauntletWr > bestGauntletWr + 1.0) {
      selectedChampion = defaultWithEmpirical;
      bestGauntletWr = defEmpGauntletWr;
    }

    // Direct Mirror Head-to-Head: Selected Champion vs Unlearned Baseline (32 games: 16 Going 1st, 16 Going 2nd)
    const mirrorPairs = isQuickCheck ? 2 : 16;
    let directMirrorWr = runDirectMirrorComparison(
      deck,
      selectedChampion,
      BASELINE_AI_PROFILE,
      mirrorPairs
    );
    addMatchCount(deck.id, deck.id, mirrorPairs * 2);

    // If stochastic mirror sample dipped below 50%, also test Default+Empirical in the mirror and keep the stronger generalizer
    if (directMirrorWr < 50 && selectedChampion !== defaultWithEmpirical) {
      const defMirrorWr = runDirectMirrorComparison(
        deck,
        defaultWithEmpirical,
        BASELINE_AI_PROFILE,
        mirrorPairs
      );
      addMatchCount(deck.id, deck.id, mirrorPairs * 2);
      if (defMirrorWr > directMirrorWr && defEmpGauntletWr >= baseGauntletWr - 1.5) {
        selectedChampion = defaultWithEmpirical;
        bestGauntletWr = defEmpGauntletWr;
        directMirrorWr = defMirrorWr;
      }
    }

    // Combine Gauntlet WR and Direct Mirror H2H vs Baseline for clear, honest reporting
    const reportedBaselineWr = Math.round(((baseGauntletWr + (100 - directMirrorWr)) / 2) * 10) / 10;
    const reportedTrainedWr = Math.round(((bestGauntletWr + directMirrorWr) / 2) * 10) / 10;

    sumBaselineWr += reportedBaselineWr;
    sumTrainedWr += reportedTrainedWr;
    sumMirrorH2HWr += directMirrorWr;

    const finalProfile: DeckLearnedAiProfile = {
      ...selectedChampion,
      matchesSimulated: matchesPerDeckCounter.get(deck.id) ?? telemetryMap.get(deck.id)!.totalGames,
      baselineWinRate: reportedBaselineWr,
      trainedWinRate: reportedTrainedWr,
    };

    finalOutputProfiles[deck.id] = finalProfile;
    const delta = (reportedTrainedWr - reportedBaselineWr).toFixed(1);
    const topCombo = finalProfile.discoveredCombos[0];
    const comboStr = topCombo
      ? `${CARDS_BY_ID[topCombo.cardAId]?.name} + ${CARDS_BY_ID[topCombo.cardBId]?.name} (${topCombo.coPlayWinRate}% WR)`
      : 'N/A';

    console.log(
      `  [${deck.id.padEnd(28)}] Base: ${reportedBaselineWr.toFixed(1)}% -> Treinada: ${reportedTrainedWr.toFixed(1)}% (${Number(delta) >= 0 ? '+' : ''}${delta}% | Mirror H2H: ${directMirrorWr.toFixed(1)}%) | Top Combo: ${comboStr}`
    );
  }

  const totalElapsedSec = (prevElapsedSec + (Date.now() - startMs) / 1000).toFixed(1);
  const outPath = path.join(process.cwd(), 'src', 'data', 'aiLearnedProfiles.ts');
  const tsContent = serializeLearnedProfilesTs(
    finalOutputProfiles,
    globalMatchesSimulated,
    totalElapsedSec
  );
  fs.writeFileSync(outPath, tsContent, 'utf8');

  const avgBase = (sumBaselineWr / PREBUILT_DECKS.length).toFixed(2);
  const avgTrained = (sumTrainedWr / PREBUILT_DECKS.length).toFixed(2);
  const avgMirror = (sumMirrorH2HWr / PREBUILT_DECKS.length).toFixed(2);

  console.log('\n========================================================================');
  console.log(` TREINAMENTO IA vs IA CONCLUIDO E GRAVADO EM src/data/aiLearnedProfiles.ts!`);
  console.log(` - Partidas Completas Simuladas: ${globalMatchesSimulated.toLocaleString('en-US')} (${totalElapsedSec}s)`);
  console.log(` - Media Geral Baseline vs Treinada: ${avgBase}% -> ${avgTrained}%`);
  console.log(` - Taxa Media de Vitoria no Duelo Espelhado Direto (Treinada vs Base): ${avgMirror}%`);
  console.log('========================================================================');
}

runAiTrainingMarathon();
