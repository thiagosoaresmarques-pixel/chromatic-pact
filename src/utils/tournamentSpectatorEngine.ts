import { ALL_CARDS, CARDS_BY_ID } from '../data/cards';
import {
  buildIndividualSovereignSignatureDeck,
  resolveChampionDeckAndProfile,
} from '../data/aiMonocolorMastery';
import { executeTurnStepForActor } from '../engine/aiEngine';
import {
  BOARD_COLS,
  cloneGameState,
  createInitialGameState,
  getDomainExpansionSpec,
  getSlotUnits,
} from '../engine/gameEngine';
import {
  AffinityMap,
  AiSkillTier,
  BoardUnit,
  CardDefinition,
  CombatLogEntry,
  Domain,
  FloatingFeedback,
  GameState,
  PlayerState,
  RowType,
} from '../types/game';
import { flipGameStatePerspective, getSupabaseConfig } from './multiplayerEngine';
import {
  computeCanonicalPairKey,
  ComputedRoundPairing,
  ComputedTournamentStanding,
  getRoundWindowTimestamps,
  hashTournamentSeed,
  resolveSovereignVsSovereignMatch,
  SwissTournamentDefinition,
  updateServerClockOffsetFromHeader,
} from './tournamentEngine';

// ============================================================================
// 1. COMPACT SERIALIZABLE REPLAY & LIVE STREAM DATA MODEL (~450B / FRAME)
// ============================================================================

export interface CompactBoardUnit {
  id: string;
  cid: string;
  atk: number;
  arm: number;
  hp: number;
  mhp: number;
  shd?: boolean;
  frz?: boolean;
  tap?: boolean;
  slp?: boolean;
  trp?: boolean;
  asc?: boolean;
  stn?: 'attack' | 'defend';
}

export interface CompactSideState {
  name: string;
  subtitle: string;
  avatarCardId: string;
  primaryDomain: Domain;
  hp: number;
  maxHp: number;
  essence: number;
  maxEssence: number;
  affinities: AffinityMap;
  deckCount: number;
  handCardIds: string[];
  channeledCardIds: string[];
  cryptCardIds: string[];
  vanguard: CompactBoardUnit[][];
  rearguard: CompactBoardUnit[][];
}

export type ReplayActionKind =
  | 'start'
  | 'channel'
  | 'play_card'
  | 'domain'
  | 'power'
  | 'ascend'
  | 'maneuver'
  | 'attack'
  | 'end_turn'
  | 'finish';

export interface TournamentReplayFrame {
  index: number;
  atMs: number;
  turn: number;
  activeSide: 'A' | 'B';
  actorSide: 'A' | 'B' | 'SYSTEM';
  kind: ReplayActionKind;
  cardId?: string;
  summary: string;
  clockSecA: number;
  clockSecB: number;
  thinkDurationMs: number;
  domainExpansion?: {
    owner: 'A' | 'B';
    domain: Domain;
    name: string;
    turnsRemaining: number;
    clashRival?: {
      owner: 'A' | 'B';
      domain: Domain;
      name: string;
      icon: string;
    } | null;
  } | null;
  feedbacks?: Array<{
    targetId: string;
    text: string;
    color: FloatingFeedback['color'];
  }>;
  sideA: CompactSideState;
  sideB: CompactSideState;
}

export interface TournamentMatchReplayLog {
  matchKey: string;
  tournamentId: string;
  round: number;
  tableNumber: number;
  isHumanRecorded: boolean;
  isCompleted: boolean;
  matchStartMs: number;
  matchFinishMs: number;
  turnTimeLimitSec: number;
  finalResult: 'A_WIN' | 'B_WIN' | 'DRAW' | 'IN_PROGRESS';
  frames: TournamentReplayFrame[];
}

// ============================================================================
// 2. SEEDED PRNG WRAPPER FOR 100% MULTI-CLIENT DETERMINISTIC ENGINE ROLLOUTS
// ============================================================================

function withSeededRandom<T>(seedInt: number, fn: () => T): T {
  const originalRandom = Math.random;
  let state = (seedInt >>> 0) || 0x6d2b79f5;
  Math.random = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  try {
    return fn();
  } finally {
    Math.random = originalRandom;
  }
}

export function sanitizeSummaryText(raw: string): string {
  return raw
    .replace(/[⚡❤️🛡️🗺️🔥❄️🌑🌿✨⚔️🃏]/gu, '')
    .replace(/\s*->\s*/g, ' → ')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function compressBoardUnit(u: BoardUnit): CompactBoardUnit {
  return {
    id: u.instanceId,
    cid: u.card.id,
    atk: u.currentAtk,
    arm: u.currentArmor ?? 0,
    hp: u.currentHp,
    mhp: u.maxHp,
    shd: u.hasDivineShield || undefined,
    frz: u.isFrozen || undefined,
    tap: u.hasAttackedThisTurn || undefined,
    slp: u.hasSummoningSickness || undefined,
    trp: u.isTrap || undefined,
    asc: u.isAscended || undefined,
    stn: u.stance,
  };
}

export function compressPlayerSide(
  pState: PlayerState,
  meta: { subtitle: string; primaryDomain: Domain }
): CompactSideState {
  const vanguard: CompactBoardUnit[][] = [];
  const rearguard: CompactBoardUnit[][] = [];
  for (let col = 0; col < BOARD_COLS; col += 1) {
    vanguard.push(getSlotUnits(pState, 'vanguard', col).map(compressBoardUnit));
    rearguard.push(getSlotUnits(pState, 'rearguard', col).map(compressBoardUnit));
  }
  return {
    name: pState.name,
    subtitle: meta.subtitle,
    avatarCardId: pState.avatarCardId,
    primaryDomain: meta.primaryDomain,
    hp: pState.hp,
    maxHp: pState.maxHp,
    essence: pState.currentEssence,
    maxEssence: pState.maxEssence,
    affinities: { ...pState.affinities },
    deckCount: pState.deck.length,
    handCardIds: pState.hand.slice(0, 12).map((c) => c.id),
    channeledCardIds: pState.channeledCards.slice(-10).map((c) => c.id),
    cryptCardIds: pState.crypt.slice(-10).map((c) => c.id),
    vanguard,
    rearguard,
  };
}

function classifyStepAction(
  prevState: GameState,
  nextState: GameState,
  actor: 'player' | 'ai',
  rawSummary: string
): { kind: ReplayActionKind; cardId?: string; weight: number } {
  const prevActor = prevState[actor];
  const nextActor = nextState[actor];

  if (rawSummary.includes('encerrou o turno')) {
    return { kind: 'end_turn', weight: 0.36 };
  }
  if (rawSummary.includes('canalizou')) {
    const ch = nextActor.channeledCards[nextActor.channeledCards.length - 1];
    return { kind: 'channel', cardId: ch?.id, weight: 0.62 };
  }
  if (
    rawSummary.includes('Expansão de Domínio') ||
    rawSummary.includes('Domínio Simples') ||
    rawSummary.includes('Quebra de Domínio')
  ) {
    return { kind: 'domain', weight: 1.25 };
  }
  if (rawSummary.includes('Poder do Soberano') || rawSummary.includes('Pacto de Sangue')) {
    return { kind: 'power', weight: 0.85 };
  }
  if (rawSummary.includes('ascendeu')) {
    return { kind: 'ascend', weight: 1.15 };
  }
  if (rawSummary.includes('reposicionou')) {
    return { kind: 'maneuver', weight: 0.55 };
  }
  if (rawSummary.includes('ataque')) {
    // Match bracketed card name [Card Name]
    const m = rawSummary.match(/\[([^\]]+)\]/);
    let cardId: string | undefined;
    if (m?.[1]) {
      for (let col = 0; col < BOARD_COLS; col += 1) {
        for (const u of [
          ...getSlotUnits(prevActor, 'vanguard', col),
          ...getSlotUnits(prevActor, 'rearguard', col),
        ]) {
          if (u.card.name === m[1]) {
            cardId = u.card.id;
            break;
          }
        }
      }
    }
    return { kind: 'attack', cardId, weight: 0.76 };
  }

  // Card played from hand
  if (nextActor.hand.length < prevActor.hand.length) {
    const nextCounts = new Map<string, number>();
    for (const c of nextActor.hand) {
      nextCounts.set(c.id, (nextCounts.get(c.id) ?? 0) + 1);
    }
    for (const c of prevActor.hand) {
      const rem = nextCounts.get(c.id) ?? 0;
      if (rem <= 0) {
        return {
          kind: 'play_card',
          cardId: c.id,
          weight: 1.05 + Math.min(0.75, c.cost * 0.1),
        };
      }
      nextCounts.set(c.id, rem - 1);
    }
  }

  return { kind: 'play_card', weight: 0.9 };
}

function buildParticipantDeckCards(standing: ComputedTournamentStanding): {
  cards: CardDefinition[];
  deckId?: string;
  skillTier: AiSkillTier;
} {
  if (standing.sovereignEntry) {
    const sov = standing.sovereignEntry;
    const sigIds = buildIndividualSovereignSignatureDeck(
      sov.avatarCardId,
      sov.archetypeId,
      sov.skillTier
    );
    const ids =
      sigIds.length >= 40
        ? sigIds
        : resolveChampionDeckAndProfile(sov.archetypeId, sov.skillTier)?.cardIds ?? [];
    const cards: CardDefinition[] = [];
    for (const cid of ids) {
      const c = CARDS_BY_ID[cid];
      if (c) cards.push(c);
    }
    if (cards.length >= 40) {
      return { cards, deckId: sov.archetypeId, skillTier: sov.skillTier };
    }
  }

  if (standing.humanEntry?.deckCardIds?.length) {
    const cards: CardDefinition[] = [];
    for (const cid of standing.humanEntry.deckCardIds) {
      const c = CARDS_BY_ID[cid];
      if (c) cards.push(c);
    }
    if (cards.length >= 40) {
      return { cards, deckId: standing.humanEntry.deckId, skillTier: 4 };
    }
  }

  // Fallback domain deck
  const domPool = ALL_CARDS.filter(
    (c) => c.domain === standing.primaryDomain || c.domain === 'neutral'
  );
  const fallback: CardDefinition[] = [];
  for (let i = 0; i < 100 && domPool.length > 0; i += 1) {
    fallback.push(domPool[i % domPool.length]);
  }
  return { cards: fallback, skillTier: 3 };
}

// ============================================================================
// 3. ON-DEMAND DETERMINISTIC MATCH SYNTHESIZER (LRU CACHED, ~8-15ms PER MATCH)
// ============================================================================

const SYNTH_CACHE_MAX = 24;
const synthesizedMatchCache = new Map<string, TournamentMatchReplayLog>();
const synthesizedArenaStatesCache = new Map<string, GameState[]>();

export function buildMatchStorageKey(
  tournamentId: string,
  round: number,
  idA: string,
  idB: string
): string {
  const pairKey = computeCanonicalPairKey(idA, idB);
  return `${tournamentId}::r${round}::${pairKey}`;
}

interface RawSimTrace {
  winner: 'A_WIN' | 'B_WIN' | 'DRAW';
  hpDiffA: number;
  steps: Array<{
    turn: number;
    activeSide: 'A' | 'B';
    actorSide: 'A' | 'B' | 'SYSTEM';
    kind: ReplayActionKind;
    cardId?: string;
    summary: string;
    weight: number;
    state: GameState;
  }>;
}

function simulateSingleSeededGame(
  seedInt: number,
  standingA: ComputedTournamentStanding,
  standingB: ComputedTournamentStanding,
  deckInfoA: { cards: CardDefinition[]; deckId?: string; skillTier: AiSkillTier },
  deckInfoB: { cards: CardDefinition[]; deckId?: string; skillTier: AiSkillTier },
  maxFullRounds: number,
  favorSide?: 'A' | 'B' | null
): RawSimTrace {
  return withSeededRandom(seedInt, () => {
    let state = createInitialGameState(deckInfoA.cards, deckInfoB.cards, {
      playerName: standingA.displayName,
      aiName: standingB.displayName,
      aiTitle: standingB.subtitle,
      aiAvatarCardId: standingB.avatarCardId,
      playerDeckId: deckInfoA.deckId,
      aiDeckId: deckInfoB.deckId,
      playerSkillTier: favorSide === 'A' ? 5 : favorSide === 'B' ? 2 : deckInfoA.skillTier,
      aiSkillTier: favorSide === 'B' ? 5 : favorSide === 'A' ? 2 : deckInfoB.skillTier,
    });
    state.player.title = standingA.subtitle;
    state.player.avatarCardId = standingA.avatarCardId;

    const steps: RawSimTrace['steps'] = [
      {
        turn: state.turn,
        activeSide: state.activePlayer === 'player' ? 'A' : 'B',
        actorSide: 'SYSTEM',
        kind: 'start',
        summary: `Mesa aberta — ${standingA.displayName} vs ${standingB.displayName} (40 PV vs 40 PV).`,
        weight: 0.5,
        state: cloneGameState(state),
      },
    ];

    const maxActions = Math.max(48, maxFullRounds * 14);
    let actionCount = 0;

    while (
      state.phase !== 'gameover' &&
      state.turn <= maxFullRounds &&
      actionCount < maxActions
    ) {
      actionCount += 1;
      const actor = state.activePlayer;
      const prevState = state;
      const stepRes = executeTurnStepForActor(state, actor, {
        fastRollout: true,
        playerSkillTier: favorSide === 'A' ? 5 : favorSide === 'B' ? 2 : deckInfoA.skillTier,
        aiSkillTier: favorSide === 'B' ? 5 : favorSide === 'A' ? 2 : deckInfoB.skillTier,
      });

      state = stepRes.nextState;
      const classified = classifyStepAction(prevState, state, actor, stepRes.actionSummary);

      steps.push({
        turn: prevState.turn,
        activeSide: state.activePlayer === 'player' ? 'A' : 'B',
        actorSide: actor === 'player' ? 'A' : 'B',
        kind: classified.kind,
        cardId: classified.cardId,
        summary: sanitizeSummaryText(stepRes.actionSummary),
        weight: classified.weight,
        state: cloneGameState(state),
      });

      if (state.phase === 'gameover') break;
    }

    let winner: 'A_WIN' | 'B_WIN' | 'DRAW' = 'DRAW';
    if (state.phase === 'gameover') {
      winner = state.winner === 'player' ? 'A_WIN' : state.winner === 'ai' ? 'B_WIN' : 'DRAW';
    } else if (state.player.hp !== state.ai.hp) {
      winner = state.player.hp > state.ai.hp ? 'A_WIN' : 'B_WIN';
    }

    return {
      winner,
      hpDiffA: state.player.hp - state.ai.hp,
      steps,
    };
  });
}

export function getOrSynthesizeSovereignMatchLog(
  def: SwissTournamentDefinition,
  pairing: ComputedRoundPairing
): TournamentMatchReplayLog {
  const playerA = pairing.playerA;
  const playerB = pairing.playerB ?? pairing.playerA;
  const matchKey = buildMatchStorageKey(
    def.id,
    pairing.round,
    playerA.participantId,
    playerB.participantId
  );

  const cached = synthesizedMatchCache.get(matchKey);
  if (cached) return cached;

  const rWin = getRoundWindowTimestamps(def, pairing.round);
  const sched = resolveSovereignVsSovereignMatch(
    def.id,
    pairing.round,
    playerA.participantId,
    playerA.eloRating,
    playerB.participantId,
    playerB.eloRating,
    rWin.startMs,
    def.playWindowMs
  );

  const targetResult: 'A_WIN' | 'B_WIN' | 'DRAW' =
    pairing.canonicalResult ??
    (pairing.result === 'A_WIN' || pairing.result === 'B_WIN' || pairing.result === 'DRAW'
      ? pairing.result
      : sched.result);
  const matchStartMs = pairing.matchStartMs ?? sched.matchStartMs;
  const matchFinishMs = pairing.matchFinishMs ?? sched.matchFinishMs;
  const targetRounds = Math.max(5, (pairing.canonicalTurns ?? sched.turns) + 2);

  const deckInfoA = buildParticipantDeckCards(playerA);
  const deckInfoB = buildParticipantDeckCards(playerB);
  const baseSeed = hashTournamentSeed(`spectate_v1::${matchKey}`);

  let chosenTrace: RawSimTrace | null = null;

  if (targetResult === 'DRAW') {
    chosenTrace = simulateSingleSeededGame(
      baseSeed,
      playerA,
      playerB,
      deckInfoA,
      deckInfoB,
      8,
      null
    );
    // Keep frames prior to any premature lethal if needed so the round reaches the bell as a technical draw
    const nonLethalSteps = chosenTrace.steps.filter((s) => s.state.phase !== 'gameover');
    if (nonLethalSteps.length >= 2) {
      const last = cloneGameState(nonLethalSteps[nonLethalSteps.length - 1].state);
      const avgHp = Math.max(6, Math.round((last.player.hp + last.ai.hp) / 2));
      last.player.hp = avgHp;
      last.ai.hp = avgHp;
      last.phase = 'gameover';
      last.winner = null;
      last.winReason = 'Tempo regulamentar da rodada encerrado em equilíbrio.';
      nonLethalSteps.push({
        turn: last.turn,
        activeSide: 'A',
        actorSide: 'SYSTEM',
        kind: 'finish',
        summary: `Sino da rodada — Empate técnico homologado (${avgHp} PV a ${avgHp} PV).`,
        weight: 0.4,
        state: last,
      });
      chosenTrace = {
        winner: 'DRAW',
        hpDiffA: 0,
        steps: nonLethalSteps,
      };
    }
  } else {
    const desiredSide: 'A' | 'B' = targetResult === 'A_WIN' ? 'A' : 'B';
    for (let attempt = 0; attempt < 4; attempt += 1) {
      const favor = attempt >= 1 ? desiredSide : null;
      const candidate = simulateSingleSeededGame(
        (baseSeed + attempt * 7919) >>> 0,
        playerA,
        playerB,
        deckInfoA,
        deckInfoB,
        Math.max(11, targetRounds + 3),
        favor
      );
      if (candidate.winner === targetResult) {
        chosenTrace = candidate;
        break;
      }
      if (!chosenTrace) {
        chosenTrace = candidate;
      }
    }

    // Ensure final terminal state matches canonical scoreboard 100%
    if (chosenTrace) {
      const lastIdx = chosenTrace.steps.length - 1;
      const lastStep = chosenTrace.steps[lastIdx];
      const finalState = cloneGameState(lastStep.state);
      const winnerName = targetResult === 'A_WIN' ? playerA.displayName : playerB.displayName;
      const loserName = targetResult === 'A_WIN' ? playerB.displayName : playerA.displayName;

      if (finalState.phase === 'gameover' && chosenTrace.winner === targetResult) {
        lastStep.state = finalState;
        if (!finalState.winReason) {
          finalState.winReason = `${winnerName} superou as defesas de ${loserName}.`;
        }
      } else {
        // Trim any contradictory terminal frame and close cleanly on decisive position / clock flag
        const cleanSteps = chosenTrace.steps.filter((s) => s.state.phase !== 'gameover');
        const baseFinal = cloneGameState(
          (cleanSteps[cleanSteps.length - 1] ?? lastStep).state
        );
        if (targetResult === 'A_WIN') {
          baseFinal.player.hp = Math.max(8, baseFinal.player.hp);
          baseFinal.ai.hp = 0;
          baseFinal.winner = 'player';
        } else {
          baseFinal.ai.hp = Math.max(8, baseFinal.ai.hp);
          baseFinal.player.hp = 0;
          baseFinal.winner = 'ai';
        }
        baseFinal.phase = 'gameover';
        baseFinal.winReason = `${winnerName} superou as defesas de ${loserName}.`;
        cleanSteps.push({
          turn: baseFinal.turn,
          activeSide: targetResult === 'A_WIN' ? 'A' : 'B',
          actorSide: targetResult === 'A_WIN' ? 'A' : 'B',
          kind: 'finish',
          summary: `Golpe decisivo — Vitória de ${winnerName} (${
            targetResult === 'A_WIN' ? '1 – 0' : '0 – 1'
          }).`,
          weight: 0.5,
          state: baseFinal,
        });
        chosenTrace = {
          winner: targetResult,
          hpDiffA: baseFinal.player.hp - baseFinal.ai.hp,
          steps: cleanSteps,
        };
      }
    }
  }

  const rawSteps = chosenTrace?.steps ?? [];
  const totalSpanMs = Math.max(30_000, matchFinishMs - matchStartMs);
  const totalWeight =
    rawSteps.reduce((acc, s, idx) => acc + (idx === 0 ? 0 : s.weight), 0) || 1;

  const turnLimit = def.turnTimeLimitSec || 45;
  let clockA = turnLimit;
  let clockB = turnLimit;
  let prevTurnKey = '';
  let elapsedAccumMs = 0;

  const frames: TournamentReplayFrame[] = rawSteps.map((step, idx) => {
    const thinkMs =
      idx === 0 ? 0 : Math.round((step.weight / totalWeight) * totalSpanMs);
    elapsedAccumMs += thinkMs;
    const atMs =
      idx === rawSteps.length - 1
        ? matchFinishMs
        : Math.min(matchFinishMs - 250, matchStartMs + elapsedAccumMs);

    const turnKey = `${step.turn}:${step.actorSide}`;
    if (step.actorSide === 'A' || step.actorSide === 'B') {
      if (turnKey !== prevTurnKey) {
        if (step.actorSide === 'A') clockA = turnLimit;
        else clockB = turnLimit;
        prevTurnKey = turnKey;
      }
      const spentSec = Math.min(
        turnLimit - 4,
        Math.max(2, Math.round(thinkMs / 1000))
      );
      if (step.actorSide === 'A') {
        clockA = Math.max(3, clockA - spentSec);
      } else {
        clockB = Math.max(3, clockB - spentSec);
      }
    }

    const domExp = step.state.domainExpansion
      ? {
          owner: (step.state.domainExpansion.owner === 'player' ? 'A' : 'B') as 'A' | 'B',
          domain: step.state.domainExpansion.domain,
          name: step.state.domainExpansion.name,
          turnsRemaining: step.state.domainExpansion.turnsRemaining,
          clashRival: step.state.domainExpansion.clashRival
            ? {
                owner: (step.state.domainExpansion.clashRival.owner === 'player'
                  ? 'A'
                  : 'B') as 'A' | 'B',
                domain: step.state.domainExpansion.clashRival.domain,
                name: step.state.domainExpansion.clashRival.name,
                icon: step.state.domainExpansion.clashRival.icon,
              }
            : null,
        }
      : null;

    return {
      index: idx,
      atMs,
      turn: step.turn,
      activeSide: step.activeSide,
      actorSide: step.actorSide,
      kind: step.kind,
      cardId: step.cardId,
      summary: step.summary,
      clockSecA: clockA,
      clockSecB: clockB,
      thinkDurationMs: thinkMs,
      domainExpansion: domExp,
      sideA: compressPlayerSide(step.state.player, {
        subtitle: playerA.subtitle,
        primaryDomain: playerA.primaryDomain,
      }),
      sideB: compressPlayerSide(step.state.ai, {
        subtitle: playerB.subtitle,
        primaryDomain: playerB.primaryDomain,
      }),
    };
  });

  const log: TournamentMatchReplayLog = {
    matchKey,
    tournamentId: def.id,
    round: pairing.round,
    tableNumber: pairing.tableNumber,
    isHumanRecorded: false,
    isCompleted: true,
    matchStartMs,
    matchFinishMs,
    turnTimeLimitSec: turnLimit,
    finalResult: targetResult,
    frames,
  };

  if (synthesizedMatchCache.size >= SYNTH_CACHE_MAX) {
    const oldestKey = synthesizedMatchCache.keys().next().value;
    if (oldestKey) {
      synthesizedMatchCache.delete(oldestKey);
      synthesizedArenaStatesCache.delete(oldestKey);
    }
  }
  synthesizedMatchCache.set(matchKey, log);
  synthesizedArenaStatesCache.set(
    matchKey,
    rawSteps.map((s) => s.state)
  );
  return log;
}

function hydrateBoardRowFromCompact(
  compactCols: CompactBoardUnit[][],
  row: RowType,
  owner: 'player' | 'ai'
): { primaries: (BoardUnit | null)[]; stacks: BoardUnit[][] } {
  const primaries: (BoardUnit | null)[] = Array(BOARD_COLS).fill(null);
  const stacks: BoardUnit[][] = Array.from({ length: BOARD_COLS }, () => []);
  for (let col = 0; col < BOARD_COLS; col += 1) {
    const stack = compactCols[col] ?? [];
    if (stack.length === 0) continue;
    const units: BoardUnit[] = stack.map((cu, sIdx) => {
      const card = CARDS_BY_ID[cu.cid] ?? ALL_CARDS[0];
      const mergedKeywords =
        cu.asc && card.ascension?.addedKeywords
          ? Array.from(new Set([...card.keywords, ...card.ascension.addedKeywords]))
          : [...card.keywords];
      return {
        instanceId: cu.id,
        cardId: card.id,
        card,
        owner,
        row,
        slotIndex: col,
        stackIndex: sIdx,
        currentAtk: cu.atk,
        currentArmor: cu.arm,
        currentHp: cu.hp,
        maxHp: cu.mhp,
        keywords: mergedKeywords,
        regeneration: card.regeneration ?? 0,
        hasDivineShield: Boolean(cu.shd),
        isFrozen: Boolean(cu.frz),
        hasAttackedThisTurn: Boolean(cu.tap),
        hasSummoningSickness: Boolean(cu.slp),
        isTrap: Boolean(cu.trp),
        isAscended: Boolean(cu.asc),
        hasRebornTriggered: false,
        stance: cu.stn ?? 'attack',
      };
    });
    primaries[col] = units[0];
    stacks[col] = units;
  }
  return { primaries, stacks };
}

function reconstructArenaStateFromCompactFrame(
  log: TournamentMatchReplayLog,
  frameIdx: number
): GameState {
  const safeIdx = Math.max(0, Math.min(log.frames.length - 1, frameIdx));
  const frame = log.frames[safeIdx];
  const fillerCard = ALL_CARDS[0];
  const base = createInitialGameState([fillerCard], [fillerCard], {
    playerName: frame.sideA.name,
    aiName: frame.sideB.name,
    aiTitle: frame.sideB.subtitle,
    aiAvatarCardId: frame.sideB.avatarCardId,
  });

  const hydrateSide = (
    target: PlayerState,
    compact: CompactSideState,
    owner: 'player' | 'ai'
  ) => {
    target.name = compact.name;
    target.title = compact.subtitle;
    target.avatarCardId = compact.avatarCardId;
    target.hp = compact.hp;
    target.maxHp = compact.maxHp;
    target.currentEssence = compact.essence;
    target.maxEssence = compact.maxEssence;
    target.affinities = { ...compact.affinities };
    target.hand = compact.handCardIds.map((id) => CARDS_BY_ID[id] ?? fillerCard);
    target.channeledCards = compact.channeledCardIds.map(
      (id) => CARDS_BY_ID[id] ?? fillerCard
    );
    target.crypt = compact.cryptCardIds.map((id) => CARDS_BY_ID[id] ?? fillerCard);
    target.deck = Array.from({ length: Math.max(0, compact.deckCount) }, () => fillerCard);
    const vg = hydrateBoardRowFromCompact(compact.vanguard, 'vanguard', owner);
    const rg = hydrateBoardRowFromCompact(compact.rearguard, 'rearguard', owner);
    target.vanguard = vg.primaries;
    target.vanguardStacks = vg.stacks;
    target.rearguard = rg.primaries;
    target.rearguardStacks = rg.stacks;
  };

  hydrateSide(base.player, frame.sideA, 'player');
  hydrateSide(base.ai, frame.sideB, 'ai');

  base.turn = frame.turn;
  base.activePlayer = frame.activeSide === 'A' ? 'player' : 'ai';

  if (frame.domainExpansion) {
    const spec = getDomainExpansionSpec(frame.domainExpansion.domain);
    base.domainExpansion = {
      owner: frame.domainExpansion.owner === 'A' ? 'player' : 'ai',
      domain: frame.domainExpansion.domain,
      name: frame.domainExpansion.name || spec.name,
      subtitle: spec.subtitle,
      icon: spec.icon,
      turnsRemaining: frame.domainExpansion.turnsRemaining,
      potencyDesc: spec.potencyDesc,
      sureHitDesc: spec.sureHitDesc,
      damageTakenByOwnerThisRound: 0,
      simpleDomainProtectedActor: null,
      clashRival: frame.domainExpansion.clashRival
        ? {
            owner: frame.domainExpansion.clashRival.owner === 'A' ? 'player' : 'ai',
            domain: frame.domainExpansion.clashRival.domain,
            name: frame.domainExpansion.clashRival.name,
            icon: frame.domainExpansion.clashRival.icon,
          }
        : null,
    };
  } else {
    base.domainExpansion = null;
  }

  const logs: CombatLogEntry[] = [];
  for (let i = safeIdx; i >= Math.max(0, safeIdx - 24); i -= 1) {
    const f = log.frames[i];
    logs.push({
      id: `tv-log-${i}`,
      turn: f.turn,
      actor: f.actorSide === 'A' ? 'player' : f.actorSide === 'B' ? 'ai' : 'system',
      category:
        f.kind === 'attack'
          ? 'combat'
          : f.kind === 'channel'
          ? 'channel'
          : f.kind === 'end_turn' || f.kind === 'start' || f.kind === 'finish'
          ? 'turn'
          : f.kind === 'play_card'
          ? 'summon'
          : 'effect',
      message: f.summary,
    });
  }
  base.combatLog = logs;
  base.feedbacks = (frame.feedbacks ?? []).map((fb, idx) => ({
    id: `tv-fb-${safeIdx}-${idx}`,
    targetId:
      fb.targetId === 'A-sovereign'
        ? 'player-sovereign'
        : fb.targetId === 'B-sovereign'
        ? 'ai-sovereign'
        : fb.targetId,
    text: fb.text,
    color: fb.color,
  }));

  const isTerminalFrame =
    log.isCompleted && safeIdx === log.frames.length - 1 && log.finalResult !== 'IN_PROGRESS';
  if (isTerminalFrame) {
    base.phase = 'gameover';
    base.winner =
      log.finalResult === 'A_WIN'
        ? 'player'
        : log.finalResult === 'B_WIN'
        ? 'ai'
        : null;
    base.winReason = frame.summary;
  } else {
    base.phase = 'main';
    base.winner = null;
    base.winReason = '';
  }

  return base;
}

/**
 * Returns a fresh cloned GameState for the Real Combat Tabletop (`BattleArena`),
 * oriented so `player` (Mesa Sul) = `pairing.playerA` and `ai` (Mesa Norte) = `pairing.playerB`.
 */
export function getArenaGameStateForReplayFrame(
  def: SwissTournamentDefinition,
  pairing: ComputedRoundPairing,
  log: TournamentMatchReplayLog,
  frameIdx: number
): GameState {
  if (!log.isHumanRecorded && !synthesizedArenaStatesCache.has(log.matchKey)) {
    getOrSynthesizeSovereignMatchLog(def, pairing);
  }
  const losslessList = synthesizedArenaStatesCache.get(log.matchKey);
  const safeIdx = Math.max(0, Math.min(log.frames.length - 1, frameIdx));

  let rawState: GameState;
  if (losslessList && losslessList[safeIdx]) {
    rawState = cloneGameState(losslessList[safeIdx]);
  } else {
    rawState = reconstructArenaStateFromCompactFrame(log, safeIdx);
  }

  // Ensure orientation matches pairing.playerA (South) vs pairing.playerB (North)
  const expectedSouthName = pairing.playerA.displayName.trim().toLowerCase();
  const actualSouthName = rawState.player.name.trim().toLowerCase();
  if (actualSouthName !== expectedSouthName) {
    return flipGameStatePerspective(rawState);
  }
  return rawState;
}

// ============================================================================
// 4. REAL HUMAN MATCH CLOUD TELEMETRY & LIVE TV BROADCAST
// ============================================================================

const CLOUD_MATCH_PREFIX = '__tournament_match__:';
const TV_BROADCAST_CHANNEL = 'chromatic_pact_tournament_tv_v1';

const localHumanMatchLogs = new Map<string, TournamentMatchReplayLog>();
const lastCloudFlushMsByKey = new Map<string, number>();

type TvListener = (log: TournamentMatchReplayLog) => void;
const tvListeners = new Set<TvListener>();
let sharedTvChannel: BroadcastChannel | null = null;

function ensureTvBroadcastChannel(): BroadcastChannel | null {
  if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') return null;
  if (!sharedTvChannel) {
    sharedTvChannel = new BroadcastChannel(TV_BROADCAST_CHANNEL);
    sharedTvChannel.onmessage = (ev) => {
      const payload = ev.data as TournamentMatchReplayLog | undefined;
      if (payload && payload.matchKey && Array.isArray(payload.frames)) {
        localHumanMatchLogs.set(payload.matchKey, payload);
        for (const fn of tvListeners) fn(payload);
      }
    };
  }
  return sharedTvChannel;
}

export function subscribeTournamentTvUpdates(listener: TvListener): () => void {
  ensureTvBroadcastChannel();
  tvListeners.add(listener);
  return () => {
    tvListeners.delete(listener);
  };
}

async function persistMatchReplayLogToCloud(log: TournamentMatchReplayLog): Promise<void> {
  const cfg = getSupabaseConfig();
  if (!cfg.isConfigured) return;

  try {
    const res = await fetch(`${cfg.url}/rest/v1/sovereign_profiles?on_conflict=username`, {
      method: 'POST',
      headers: {
        apikey: cfg.anonKey,
        Authorization: `Bearer ${cfg.anonKey}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        username: `${CLOUD_MATCH_PREFIX}${log.matchKey}`,
        title: JSON.stringify(log),
        avatar_card_id: log.frames[0]?.sideA.avatarCardId || 'neutral_10_valkyra_pentacromatica',
        elo_rating: 1000,
        pvp_wins: log.round,
        pvp_losses: log.tableNumber,
        gold: 0,
        updated_at: new Date().toISOString(),
      }),
    });
    updateServerClockOffsetFromHeader(res.headers.get('date'));
  } catch {
    // Non-blocking telemetry
  }
}

export async function fetchCloudTournamentMatchLog(
  tournamentId: string,
  round: number,
  idA: string,
  idB: string
): Promise<TournamentMatchReplayLog | null> {
  const matchKey = buildMatchStorageKey(tournamentId, round, idA, idB);
  const cfg = getSupabaseConfig();
  if (!cfg.isConfigured) {
    return localHumanMatchLogs.get(matchKey) ?? null;
  }

  try {
    const usernameKey = `${CLOUD_MATCH_PREFIX}${matchKey}`;
    const res = await fetch(
      `${cfg.url}/rest/v1/sovereign_profiles?username=eq.${encodeURIComponent(
        usernameKey
      )}&select=title&limit=1`,
      {
        headers: {
          apikey: cfg.anonKey,
          Authorization: `Bearer ${cfg.anonKey}`,
        },
      }
    );
    updateServerClockOffsetFromHeader(res.headers.get('date'));
    if (!res.ok) return localHumanMatchLogs.get(matchKey) ?? null;
    const rows = (await res.json()) as Array<{ title: string }>;
    if (rows.length > 0 && rows[0].title) {
      const parsed = JSON.parse(rows[0].title) as TournamentMatchReplayLog;
      if (parsed && Array.isArray(parsed.frames) && parsed.frames.length > 0) {
        localHumanMatchLogs.set(matchKey, parsed);
        return parsed;
      }
    }
  } catch {
    // Ignore network glitch
  }
  return localHumanMatchLogs.get(matchKey) ?? null;
}

/**
 * Records a live move frame from a real player's BattleArena tournament match.
 * Automatically aligns Side A / Side B to match canonical table orientation.
 */
export function recordHumanTournamentMatchState(params: {
  tournament: SwissTournamentDefinition;
  roundNumber: number;
  tableNumber: number;
  myParticipantId: string;
  mySubtitle: string;
  myPrimaryDomain: Domain;
  opponentStanding: ComputedTournamentStanding;
  localPerspectiveRole: 'player_is_me' | 'ai_is_me';
  state: GameState;
  turnTimeLeftSec: number;
  nowMs: number;
}): void {
  const {
    tournament,
    roundNumber,
    tableNumber,
    myParticipantId,
    mySubtitle,
    myPrimaryDomain,
    opponentStanding,
    localPerspectiveRole,
    state,
    turnTimeLeftSec,
    nowMs,
  } = params;

  const matchKey = buildMatchStorageKey(
    tournament.id,
    roundNumber,
    myParticipantId,
    opponentStanding.participantId
  );

  // Canonical ordering: smaller participantId is Side A unless paired explicitly
  const meIsSideA = myParticipantId < opponentStanding.participantId;
  const meActorState =
    localPerspectiveRole === 'player_is_me' ? state.player : state.ai;
  const oppActorState =
    localPerspectiveRole === 'player_is_me' ? state.ai : state.player;

  const sideAState = meIsSideA ? meActorState : oppActorState;
  const sideBState = meIsSideA ? oppActorState : meActorState;
  const sideAMeta = meIsSideA
    ? { subtitle: mySubtitle, primaryDomain: myPrimaryDomain }
    : {
        subtitle: opponentStanding.subtitle,
        primaryDomain: opponentStanding.primaryDomain,
      };
  const sideBMeta = meIsSideA
    ? {
        subtitle: opponentStanding.subtitle,
        primaryDomain: opponentStanding.primaryDomain,
      }
    : { subtitle: mySubtitle, primaryDomain: myPrimaryDomain };

  const activeIsMe =
    (state.activePlayer === 'player') === (localPerspectiveRole === 'player_is_me');
  const activeSide: 'A' | 'B' = activeIsMe === meIsSideA ? 'A' : 'B';

  // In gameEngine.ts, addLog prepends entries, so combatLog[0] is the newest action!
  const newestLog = state.combatLog[0];
  const rawMessage = newestLog?.message || `Turno ${state.turn}`;
  const cleanMsg = sanitizeSummaryText(rawMessage);

  const existing = localHumanMatchLogs.get(matchKey);
  const prevFrames = existing?.frames ?? [];
  const lastFrame = prevFrames[prevFrames.length - 1];

  // Deduplicate identical consecutive snapshots
  if (
    lastFrame &&
    lastFrame.summary === cleanMsg &&
    lastFrame.turn === state.turn &&
    lastFrame.sideA.hp === sideAState.hp &&
    lastFrame.sideB.hp === sideBState.hp &&
    state.phase !== 'gameover'
  ) {
    return;
  }

  const prevAtMs = lastFrame?.atMs ?? nowMs;
  const thinkMs = Math.max(0, nowMs - prevAtMs);
  const limit = tournament.turnTimeLimitSec || 45;

  const isGameover = state.phase === 'gameover';
  let finalResult: TournamentMatchReplayLog['finalResult'] = 'IN_PROGRESS';
  if (isGameover) {
    if (!state.winner) {
      finalResult = 'DRAW';
    } else {
      const meWon =
        (state.winner === 'player') === (localPerspectiveRole === 'player_is_me');
      finalResult = meWon === meIsSideA ? 'A_WIN' : 'B_WIN';
    }
  }

  let inferredCardId: string | undefined;
  const bracketMatch = rawMessage.match(/\[([^\]]+)\]/);
  if (bracketMatch?.[1]) {
    const matchedCard = ALL_CARDS.find(
      (c) => c.name === bracketMatch[1] || c.ascension?.newName === bracketMatch[1]
    );
    if (matchedCard) inferredCardId = matchedCard.id;
  }

  const mapActorOwnerToSide = (owner: 'player' | 'ai'): 'A' | 'B' =>
    ((owner === 'player') === (localPerspectiveRole === 'player_is_me')) === meIsSideA
      ? 'A'
      : 'B';

  const actorSideForFrame: 'A' | 'B' | 'SYSTEM' = isGameover
    ? 'SYSTEM'
    : newestLog && newestLog.actor !== 'system'
    ? mapActorOwnerToSide(newestLog.actor)
    : activeSide;

  const resolvedKind: ReplayActionKind = isGameover
    ? 'finish'
    : prevFrames.length === 0
    ? 'start'
    : newestLog?.category === 'channel' || rawMessage.includes('canalizou')
    ? 'channel'
    : newestLog?.category === 'combat'
    ? 'attack'
    : rawMessage.includes('Expansão de Domínio') ||
      rawMessage.includes('Domínio Simples') ||
      rawMessage.includes('CHOQUE DE DOMÍNIOS')
    ? 'domain'
    : rawMessage.includes('ascendeu') || rawMessage.includes('ASCENSÃO')
    ? 'ascend'
    : rawMessage.includes('Poder do Soberano') || rawMessage.includes('Pacto de Sangue')
    ? 'power'
    : newestLog?.category === 'turn'
    ? 'end_turn'
    : 'play_card';

  const newFrame: TournamentReplayFrame = {
    index: prevFrames.length,
    atMs: nowMs,
    turn: state.turn,
    activeSide,
    actorSide: actorSideForFrame,
    kind: resolvedKind,
    cardId: inferredCardId,
    summary: cleanMsg,
    clockSecA: activeSide === 'A' ? turnTimeLeftSec : limit,
    clockSecB: activeSide === 'B' ? turnTimeLeftSec : limit,
    thinkDurationMs: thinkMs,
    domainExpansion: state.domainExpansion
      ? {
          owner: mapActorOwnerToSide(state.domainExpansion.owner),
          domain: state.domainExpansion.domain,
          name: state.domainExpansion.name,
          turnsRemaining: state.domainExpansion.turnsRemaining,
          clashRival: state.domainExpansion.clashRival
            ? {
                owner: mapActorOwnerToSide(state.domainExpansion.clashRival.owner),
                domain: state.domainExpansion.clashRival.domain,
                name: state.domainExpansion.clashRival.name,
                icon: state.domainExpansion.clashRival.icon,
              }
            : null,
        }
      : null,
    feedbacks:
      state.feedbacks && state.feedbacks.length > 0
        ? state.feedbacks.slice(0, 3).map((fb) => ({
            targetId:
              fb.targetId === 'player-sovereign'
                ? `${mapActorOwnerToSide('player')}-sovereign`
                : fb.targetId === 'ai-sovereign'
                ? `${mapActorOwnerToSide('ai')}-sovereign`
                : fb.targetId,
            text: fb.text,
            color: fb.color,
          }))
        : undefined,
    sideA: compressPlayerSide(sideAState, sideAMeta),
    sideB: compressPlayerSide(sideBState, sideBMeta),
  };

  // Cap stored frames at 120 so payload stays compact (< 45 KB)
  const nextFrames =
    prevFrames.length >= 120
      ? [...prevFrames.slice(0, 20), ...prevFrames.slice(-99), newFrame].map((f, i) => ({
          ...f,
          index: i,
        }))
      : [...prevFrames, newFrame];

  const updatedLog: TournamentMatchReplayLog = {
    matchKey,
    tournamentId: tournament.id,
    round: roundNumber,
    tableNumber,
    isHumanRecorded: true,
    isCompleted: isGameover,
    matchStartMs: existing?.matchStartMs ?? nowMs,
    matchFinishMs: isGameover ? nowMs : nowMs + 60_000,
    turnTimeLimitSec: limit,
    finalResult,
    frames: nextFrames,
  };

  localHumanMatchLogs.set(matchKey, updatedLog);

  // Instant local/tab broadcast
  const ch = ensureTvBroadcastChannel();
  ch?.postMessage(updatedLog);
  for (const fn of tvListeners) fn(updatedLog);

  // Throttled cloud persistence (every 2.5s during live play, immediate on start or gameover)
  const lastFlush = lastCloudFlushMsByKey.get(matchKey) ?? 0;
  if (isGameover || prevFrames.length === 0 || nowMs - lastFlush >= 2500) {
    lastCloudFlushMsByKey.set(matchKey, nowMs);
    void persistMatchReplayLogToCloud(updatedLog);
  }
}

export interface ReplayClimaxMarker {
  frameIndex: number;
  leadInIndex: number;
  turn: number;
  kind: 'legendary' | 'ascend' | 'domain' | 'critical' | 'finisher';
  label: string;
}

/**
 * Extracts up to 8 key dramatic turning points from a replay log so spectators and
 * social-video creators can jump straight to the most cinematic moments in 1 click.
 */
export function extractReplayClimaxMarkers(
  log: TournamentMatchReplayLog | null | undefined
): ReplayClimaxMarker[] {
  if (!log || !log.frames || log.frames.length < 3) return [];

  const rawMarkers: Array<ReplayClimaxMarker & { priority: number }> = [];
  let criticalRecorded = false;

  for (let i = 1; i < log.frames.length; i += 1) {
    const f = log.frames[i];
    const prev = log.frames[i - 1];

    if (f.kind === 'domain') {
      const isClash =
        f.summary.includes('CHOQUE') ||
        f.summary.includes('Disputa') ||
        Boolean(f.domainExpansion?.clashRival);
      rawMarkers.push({
        frameIndex: i,
        leadInIndex: Math.max(0, i - 1),
        turn: f.turn,
        kind: 'domain',
        label: isClash ? 'Choque de Domínios' : f.domainExpansion?.name || 'Expansão de Domínio',
        priority: 5,
      });
      continue;
    }

    if (f.kind === 'ascend') {
      rawMarkers.push({
        frameIndex: i,
        leadInIndex: Math.max(0, i - 1),
        turn: f.turn,
        kind: 'ascend',
        label: 'Ascensão em Campo',
        priority: 4,
      });
      continue;
    }

    if (f.kind === 'play_card' && f.cardId) {
      const card = CARDS_BY_ID[f.cardId];
      if (card && (card.rarity === 'legendary' || (card.breathDamage ?? 0) > 0)) {
        rawMarkers.push({
          frameIndex: i,
          leadInIndex: Math.max(0, i - 1),
          turn: f.turn,
          kind: 'legendary',
          label: card.name,
          priority: card.rarity === 'legendary' ? 3 : 2,
        });
        continue;
      }
    }

    if (!criticalRecorded && i < log.frames.length - 2) {
      const prevMinHp = Math.min(prev.sideA.hp, prev.sideB.hp);
      const curMinHp = Math.min(f.sideA.hp, f.sideB.hp);
      if (prevMinHp > 12 && curMinHp <= 12 && curMinHp > 0) {
        criticalRecorded = true;
        rawMarkers.push({
          frameIndex: i,
          leadInIndex: Math.max(0, i - 1),
          turn: f.turn,
          kind: 'critical',
          label: 'Clímax (Vida Crítica)',
          priority: 2,
        });
      }
    }
  }

  if (log.isCompleted && log.finalResult !== 'IN_PROGRESS') {
    const lastIdx = log.frames.length - 1;
    const lastFrame = log.frames[lastIdx];
    rawMarkers.push({
      frameIndex: lastIdx,
      leadInIndex: Math.max(0, lastIdx - 2),
      turn: lastFrame.turn,
      kind: 'finisher',
      label: 'Golpe Final',
      priority: 6,
    });
  }

  // Deduplicate markers within 2 frames of each other, keeping higher priority
  const filtered: Array<ReplayClimaxMarker & { priority: number }> = [];
  for (const m of rawMarkers) {
    const prev = filtered[filtered.length - 1];
    if (prev && Math.abs(m.frameIndex - prev.frameIndex) <= 2) {
      if (m.priority >= prev.priority) {
        filtered[filtered.length - 1] = m;
      }
    } else {
      filtered.push(m);
    }
  }

  if (filtered.length > 8) {
    filtered.sort((a, b) => b.priority - a.priority);
    const top = filtered.slice(0, 8);
    top.sort((a, b) => a.frameIndex - b.frameIndex);
    return top.map(({ priority: _p, ...rest }) => rest);
  }

  return filtered.map(({ priority: _p, ...rest }) => rest);
}
