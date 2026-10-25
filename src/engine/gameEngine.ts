import {
  AffinityMap,
  ArenaColumnRune,
  ArenaRuneType,
  ArenaWeatherState,
  BoardUnit,
  CardDefinition,
  CardEffect,
  CombatLogEntry,
  Domain,
  DomainExpansionState,
  FloatingFeedback,
  GameState,
  Keyword,
  PlayerState,
  RoundSubPhase,
  RowType,
  SacrificeAllocation,
} from '../types/game';

let uniqueIdCounter = 1;

function nextId(prefix: string): string {
  uniqueIdCounter += 1;
  return `${prefix}-${Date.now()}-${uniqueIdCounter}-${Math.random().toString(36).slice(2, 6)}`;
}

export const BOARD_COLS = 6;
export const MAX_UNITS_PER_SLOT = 3;
export const STARTING_HAND_SIZE = 7;
export const MAX_HAND_SIZE = 12;
export const STARTING_ESSENCE = 3;
export const MAX_ESSENCE_CAP = 15;
export const STARTING_SOVEREIGN_HP = 40;

export function syncPlayerBoardSlots(pState: PlayerState): void {
  if (!pState.vanguardStacks || pState.vanguardStacks.length !== BOARD_COLS) {
    pState.vanguardStacks = Array.from({ length: BOARD_COLS }, (_, i) =>
      pState.vanguard[i] ? [pState.vanguard[i]!] : []
    );
  }
  if (!pState.rearguardStacks || pState.rearguardStacks.length !== BOARD_COLS) {
    pState.rearguardStacks = Array.from({ length: BOARD_COLS }, (_, i) =>
      pState.rearguard[i] ? [pState.rearguard[i]!] : []
    );
  }
  for (let i = 0; i < BOARD_COLS; i++) {
    const vStack = pState.vanguardStacks[i];
    for (let s = 0; s < vStack.length; s++) {
      vStack[s].row = 'vanguard';
      vStack[s].slotIndex = i;
      vStack[s].stackIndex = s;
    }
    pState.vanguard[i] = vStack[0] ?? null;

    const rStack = pState.rearguardStacks[i];
    for (let s = 0; s < rStack.length; s++) {
      rStack[s].row = 'rearguard';
      rStack[s].slotIndex = i;
      rStack[s].stackIndex = s;
    }
    pState.rearguard[i] = rStack[0] ?? null;
  }
}

export function getSlotUnits(
  playerState: PlayerState,
  row: RowType,
  slotIndex: number
): BoardUnit[] {
  if (slotIndex < 0 || slotIndex >= BOARD_COLS) return [];
  const stacks = row === 'vanguard' ? playerState.vanguardStacks : playerState.rearguardStacks;
  if (stacks && stacks[slotIndex]) {
    return stacks[slotIndex];
  }
  const single = playerState[row][slotIndex];
  return single ? [single] : [];
}

export function getRowUnits(playerState: PlayerState, row: RowType): BoardUnit[] {
  const units: BoardUnit[] = [];
  for (let i = 0; i < BOARD_COLS; i++) {
    for (const u of getSlotUnits(playerState, row, i)) {
      units.push(u);
    }
  }
  return units;
}

export function canDeployToSlot(
  playerState: PlayerState,
  row: RowType,
  slotIndex: number
): boolean {
  if (slotIndex < 0 || slotIndex >= BOARD_COLS) return false;
  return getSlotUnits(playerState, row, slotIndex).length < MAX_UNITS_PER_SLOT;
}

export function addUnitToSlot(
  playerState: PlayerState,
  row: RowType,
  slotIndex: number,
  unit: BoardUnit
): boolean {
  syncPlayerBoardSlots(playerState);
  const stacks = row === 'vanguard' ? playerState.vanguardStacks : playerState.rearguardStacks;
  const stack = stacks[slotIndex];
  if (!stack || stack.length >= MAX_UNITS_PER_SLOT) {
    return false;
  }
  unit.row = row;
  unit.slotIndex = slotIndex;
  unit.stackIndex = stack.length;
  stack.push(unit);
  syncPlayerBoardSlots(playerState);
  return true;
}

export function removeUnitFromBoard(
  playerState: PlayerState,
  instanceId: string
): BoardUnit | null {
  syncPlayerBoardSlots(playerState);
  for (const row of ['vanguard', 'rearguard'] as const) {
    const stacks = row === 'vanguard' ? playerState.vanguardStacks : playerState.rearguardStacks;
    for (let i = 0; i < BOARD_COLS; i++) {
      const stack = stacks[i];
      const idx = stack.findIndex((u) => u.instanceId === instanceId);
      if (idx !== -1) {
        const [removed] = stack.splice(idx, 1);
        syncPlayerBoardSlots(playerState);
        return removed;
      }
    }
  }
  return null;
}

export function cloneGameState(state: GameState): GameState {
  const cloneUnitObj = (u: BoardUnit): BoardUnit => ({
    ...u,
    keywords: [...u.keywords],
  });

  const clonePlayer = (p: PlayerState): PlayerState => {
    const vStacks = Array.from({ length: BOARD_COLS }, (_, i) =>
      getSlotUnits(p, 'vanguard', i).map(cloneUnitObj)
    );
    const rStacks = Array.from({ length: BOARD_COLS }, (_, i) =>
      getSlotUnits(p, 'rearguard', i).map(cloneUnitObj)
    );
    const cloned: PlayerState = {
      ...p,
      affinities: { ...p.affinities },
      channeledCards: [...p.channeledCards],
      deck: [...p.deck],
      hand: [...p.hand],
      crypt: [...p.crypt],
      vanguard: vStacks.map((st) => st[0] ?? null),
      rearguard: rStacks.map((st) => st[0] ?? null),
      vanguardStacks: vStacks,
      rearguardStacks: rStacks,
    };
    syncPlayerBoardSlots(cloned);
    return cloned;
  };

  return {
    ...state,
    domainExpansion: state.domainExpansion
      ? {
          ...state.domainExpansion,
          clashRival: state.domainExpansion.clashRival
            ? { ...state.domainExpansion.clashRival }
            : null,
        }
      : null,
    weather: state.weather ? { ...state.weather } : null,
    columnRunes: state.columnRunes ? state.columnRunes.map((r) => ({ ...r })) : [],
    player: clonePlayer(state.player),
    ai: clonePlayer(state.ai),
    combatLog: [...state.combatLog],
    feedbacks: [], // Fresh feedbacks per action step so UI displays current step animations cleanly
  };
}

export function shuffleCards(cards: CardDefinition[]): CardDefinition[] {
  const arr = [...cards];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

function createEmptyAffinities(): AffinityMap {
  return {
    red: 0,
    blue: 0,
    purple: 0,
    green: 0,
    gold: 0,
    neutral: 0,
  };
}

function addLog(
  state: GameState,
  actor: 'player' | 'ai' | 'system',
  category: CombatLogEntry['category'],
  message: string
): void {
  state.combatLog = [
    {
      id: nextId('log'),
      turn: state.turn,
      actor,
      category,
      message,
    },
    ...state.combatLog,
  ].slice(0, 80);
}

function addFeedback(
  state: GameState,
  targetId: string,
  text: string,
  color: FloatingFeedback['color']
): void {
  state.feedbacks.push({
    id: nextId('fb'),
    targetId,
    text,
    color,
  });
}

export function getAllBoardUnits(playerState: PlayerState): BoardUnit[] {
  return [...getRowUnits(playerState, 'vanguard'), ...getRowUnits(playerState, 'rearguard')];
}

export function findUnitOnBoard(
  state: GameState,
  instanceId: string
): { unit: BoardUnit; owner: 'player' | 'ai'; row: RowType; slotIndex: number; stackIndex: number } | null {
  for (const owner of ['player', 'ai'] as const) {
    const pState = state[owner];
    for (let i = 0; i < BOARD_COLS; i++) {
      const vStack = getSlotUnits(pState, 'vanguard', i);
      for (let s = 0; s < vStack.length; s++) {
        if (vStack[s].instanceId === instanceId) {
          return { unit: vStack[s], owner, row: 'vanguard', slotIndex: i, stackIndex: s };
        }
      }
      const rStack = getSlotUnits(pState, 'rearguard', i);
      for (let s = 0; s < rStack.length; s++) {
        if (rStack[s].instanceId === instanceId) {
          return { unit: rStack[s], owner, row: 'rearguard', slotIndex: i, stackIndex: s };
        }
      }
    }
  }
  return null;
}

function drawCardsForActor(state: GameState, actor: 'player' | 'ai', count: number): void {
  const actorState = state[actor];
  for (let i = 0; i < count; i++) {
    if (actorState.deck.length === 0) {
      // Fatigue damage if deck is empty
      actorState.hp = Math.max(0, actorState.hp - 2);
      addFeedback(state, `${actor}-sovereign`, '-2 Fadiga', 'damage');
      addLog(
        state,
        actor,
        'turn',
        `${actorState.name} está com o Grimório vazio e sofreu 2 de dano de Fadiga!`
      );
      checkWinCondition(state);
      continue;
    }
    const nextCard = actorState.deck.shift()!;
    if (actorState.hand.length < MAX_HAND_SIZE) {
      actorState.hand.push(nextCard);
    } else {
      actorState.crypt.push(nextCard);
      addLog(
        state,
        actor,
        'turn',
        `Mão cheia (${MAX_HAND_SIZE})! ${nextCard.name} foi enviada para a Cripta.`
      );
    }
  }
}

function checkWinCondition(state: GameState): void {
  if (state.phase === 'gameover') return;
  if (state.ai.hp <= 0 && state.player.hp <= 0) {
    state.phase = 'gameover';
    state.winner = 'player';
    state.winReason = 'Colapso Mútuo — Você prevaleceu no último suspiro!';
    addLog(state, 'system', 'combat', state.winReason);
  } else if (state.ai.hp <= 0) {
    state.phase = 'gameover';
    state.winner = 'player';
    state.winReason = `${state.ai.name} foi derrotado! Vitória do Soberano!`;
    addLog(state, 'system', 'combat', state.winReason);
  } else if (state.player.hp <= 0) {
    state.phase = 'gameover';
    state.winner = 'ai';
    state.winReason = `${state.player.name} sucumbiu em batalha!`;
    addLog(state, 'system', 'combat', state.winReason);
  }
}

function buildBalancedOpeningHand(deck: CardDefinition[]): CardDefinition[] {
  const hand: CardDefinition[] = [];
  // Pull up to 2 low-cost cards (cost <= 2) first so Turn 1 always has immediate action
  for (let i = 0; i < deck.length && hand.length < 2; i++) {
    if (deck[i].cost <= 2) {
      hand.push(deck.splice(i, 1)[0]);
      i--;
    }
  }
  // Pull up to 2 early-curve cards (cost <= 3) since Turn 1 starts with 3⚡!
  for (let i = 0; i < deck.length && hand.length < 4; i++) {
    if (deck[i].cost <= 3) {
      hand.push(deck.splice(i, 1)[0]);
      i--;
    }
  }
  while (hand.length < STARTING_HAND_SIZE && deck.length > 0) {
    hand.push(deck.shift()!);
  }
  return hand;
}

function createStartingAffinitiesForDeck(deck: CardDefinition[]): Record<Domain, number> {
  const aff = createEmptyAffinities();
  const counts: Record<Domain, number> = {
    red: 0,
    blue: 0,
    purple: 0,
    green: 0,
    gold: 0,
    neutral: 0,
  };
  for (const c of deck) {
    if (c.domain !== 'neutral') {
      counts[c.domain] += 1;
    }
  }
  const sorted = (['red', 'blue', 'purple', 'green', 'gold'] as const)
    .filter((d) => counts[d] > 0)
    .sort((a, b) => counts[b] - counts[a]);

  if (sorted.length === 1) {
    aff[sorted[0]] = 2;
  } else if (sorted.length >= 2) {
    aff[sorted[0]] = 1;
    aff[sorted[1]] = 1;
  } else {
    aff.neutral = 2;
  }
  return aff;
}

export function buildWeatherForDomain(
  domain: Domain,
  owner: 'player' | 'ai' | 'system',
  turnsRemaining = 3
): ArenaWeatherState {
  switch (domain) {
    case 'red':
      return {
        type: 'ash_storm',
        domain: 'red',
        name: 'Tempestade de Cinzas Rubras',
        icon: '🌋',
        shortDesc: 'Todas as criaturas em campo ganham +1⚔️ ATQ. Início do turno: 1🔥 ao Soberano rival.',
        owner,
        turnsRemaining,
      };
    case 'blue':
      return {
        type: 'astral_blizzard',
        domain: 'blue',
        name: 'Nevasca Astral',
        icon: '❄️',
        shortDesc: 'Início do turno: reduz -1⚔️ ATQ do maior inimigo; o 1º Feitiço ou turno concede +1⚡ extra.',
        owner,
        turnsRemaining,
      };
    case 'purple':
      return {
        type: 'umbral_eclipse',
        domain: 'purple',
        name: 'Eclipse Umbral',
        icon: '🌑',
        shortDesc: 'Início do turno: drena 1❤️ do Soberano rival e restaura +1❤️ no controlador do Eclipse.',
        owner,
        turnsRemaining,
      };
    case 'green':
      return {
        type: 'sylvan_monsoon',
        domain: 'green',
        name: 'Monção da Selva Primordial',
        icon: '🌿',
        shortDesc: 'Início do turno: regenera +1❤️ em todas as criaturas aliadas (+1❤️ Vida Máx na Vanguarda).',
        owner,
        turnsRemaining,
      };
    case 'gold':
      return {
        type: 'solar_zenith',
        domain: 'gold',
        name: 'Zênite Solar Imperial',
        icon: '☀️',
        shortDesc: 'Início do turno: concede +1🛡️ Armadura a um campeão na Vanguarda e restaura +1❤️ no Soberano.',
        owner,
        turnsRemaining,
      };
    default:
      return {
        type: 'astral_convergence',
        domain: 'neutral',
        name: 'Convergência da Fenda Astral',
        icon: '🌀',
        shortDesc: 'Fluxo planar acelerado: o Soberano ativo recebe +1⚡ de Essência extra no início do turno.',
        owner,
        turnsRemaining,
      };
  }
}

function createRuneDefinition(slotIndex: number, type: ArenaRuneType): ArenaColumnRune {
  switch (type) {
    case 'forge':
      return {
        slotIndex,
        type: 'forge',
        name: 'Runa da Fornalha',
        icon: '🔥',
        shortDesc: 'Ocupar esta coluna na Vanguarda concede +2⚔️ ATQ à unidade e causa 1🔥 ao Soberano rival.',
        color: 'red',
      };
    case 'bastion':
      return {
        slotIndex,
        type: 'bastion',
        name: 'Runa do Bastião',
        icon: '🛡️',
        shortDesc: 'Ocupar esta coluna na Vanguarda concede Escudo Divino e +1🛡️ Armadura à unidade.',
        color: 'gold',
      };
    case 'leyline':
      return {
        slotIndex,
        type: 'leyline',
        name: 'Cristal da Fenda',
        icon: '⚡',
        shortDesc: 'Ocupar esta coluna na Vanguarda concede +1⚡ Essência imediata e compra 1 carta.',
        color: 'blue',
      };
    case 'vitality':
      return {
        slotIndex,
        type: 'vitality',
        name: 'Fonte de Seiva Ancestral',
        icon: '🌿',
        shortDesc: 'Ocupar esta coluna na Vanguarda concede +1⚔️/+2❤️ à unidade e cura +2❤️ no seu Soberano.',
        color: 'green',
      };
  }
}

export function spawnColumnRuneIfNeeded(state: GameState): void {
  // Runas Táticas de Coluna desativadas: apenas a Expansão de Domínio altera o ambiente da mesa!
  state.columnRunes = [];
}

export function consumeColumnRuneOnDeploy(
  state: GameState,
  actor: 'player' | 'ai',
  row: RowType,
  slotIndex: number,
  unit: BoardUnit
): void {
  if (row !== 'vanguard' || unit.card.type !== 'creature' || unit.isTrap) return;
  if (!state.columnRunes || state.columnRunes.length === 0) return;

  const idx = state.columnRunes.findIndex((r) => r.slotIndex === slotIndex);
  if (idx === -1) return;

  const [rune] = state.columnRunes.splice(idx, 1);
  const actorState = state[actor];
  const enemyActor: 'player' | 'ai' = actor === 'player' ? 'ai' : 'player';
  const enemyState = state[enemyActor];

  switch (rune.type) {
    case 'forge':
      unit.currentAtk += 2;
      enemyState.hp = Math.max(0, enemyState.hp - 1);
      addFeedback(state, unit.instanceId, '🔥 Runa da Fornalha (+2⚔️)!', 'buff');
      addFeedback(state, `${enemyActor}-sovereign`, '-1🔥 Runa da Fornalha', 'damage');
      addLog(
        state,
        actor,
        'effect',
        `🔥 [${unit.card.name}] capturou a [Runa da Fornalha] na Coluna ${slotIndex + 1} (+2⚔️ ATQ e 1🔥 de dano a ${enemyState.name})!`
      );
      break;
    case 'bastion':
      unit.hasDivineShield = true;
      unit.currentArmor += 1;
      addFeedback(state, unit.instanceId, '🛡️ Runa do Bastião (Escudo +1🛡️)!', 'shield');
      addLog(
        state,
        actor,
        'effect',
        `🛡️ [${unit.card.name}] capturou a [Runa do Bastião] na Coluna ${slotIndex + 1} (Escudo Divino + 1🛡️ Armadura)!`
      );
      break;
    case 'leyline':
      actorState.currentEssence += 1;
      drawCardsForActor(state, actor, 1);
      addFeedback(state, unit.instanceId, '⚡ Cristal da Fenda (+1⚡ & +1 Carta)!', 'ess');
      addLog(
        state,
        actor,
        'effect',
        `⚡ [${unit.card.name}] capturou o [Cristal da Fenda] na Coluna ${slotIndex + 1} (+1⚡ Essência e +1 Carta)!`
      );
      break;
    case 'vitality':
      unit.currentAtk += 1;
      unit.maxHp += 2;
      unit.currentHp += 2;
      actorState.hp = Math.min(actorState.maxHp, actorState.hp + 2);
      addFeedback(state, unit.instanceId, '🌿 Fonte de Seiva (+1⚔️/+2❤️)!', 'heal');
      addFeedback(state, `${actor}-sovereign`, '+2❤️ Fonte de Seiva', 'heal');
      addLog(
        state,
        actor,
        'effect',
        `🌿 [${unit.card.name}] capturou a [Fonte de Seiva Ancestral] na Coluna ${slotIndex + 1} (+1⚔️/+2❤️ e +2❤️ no Soberano)!`
      );
      break;
  }
}

export function checkAndTriggerArenaWeather(
  _state: GameState,
  _actor: 'player' | 'ai'
): void {
  // Clima de Arena (4+ Afinidade) desativado: apenas a Expansão de Domínio (6+ Afinidade) altera o ambiente da mesa!
  return;
}

export function createInitialGameState(
  playerDeck: CardDefinition[],
  aiDeck: CardDefinition[],
  options?: {
    playerName?: string;
    aiName?: string;
    aiTitle?: string;
    aiAvatarCardId?: string;
    aiStartingHp?: number;
    playerStartingHp?: number;
    bossId?: string;
  }
): GameState {
  const shuffledPlayerDeck = shuffleCards(playerDeck);
  const shuffledAiDeck = shuffleCards(aiDeck);

  const playerHand = buildBalancedOpeningHand(shuffledPlayerDeck);
  const aiHand = buildBalancedOpeningHand(shuffledAiDeck);

  const playerMaxHp = options?.playerStartingHp ?? STARTING_SOVEREIGN_HP;
  const aiMaxHp = options?.aiStartingHp ?? STARTING_SOVEREIGN_HP;

  const player: PlayerState = {
    id: 'player',
    name: options?.playerName ?? 'Soberano Arcano',
    title: 'Portador do Pacto Cromático',
    avatarCardId: playerDeck[0]?.id ?? 'red_01',
    hp: playerMaxHp,
    maxHp: playerMaxHp,
    corruption: 0,
    currentEssence: STARTING_ESSENCE,
    maxEssence: STARTING_ESSENCE,
    hasChanneledThisTurn: false,
    hasMovedThisTurn: false,
    hasUsedSovereignPowerThisTurn: false,
    hasUsedBloodPactThisTurn: false,
    hasUsedSimpleDomainThisTurn: false,
    domainExhaustionTurns: 0,
    affinities: createStartingAffinitiesForDeck(playerDeck),
    channeledCards: [],
    deck: shuffledPlayerDeck,
    hand: playerHand,
    crypt: [],
    vanguard: Array(BOARD_COLS).fill(null),
    rearguard: Array(BOARD_COLS).fill(null),
    vanguardStacks: Array.from({ length: BOARD_COLS }, () => []),
    rearguardStacks: Array.from({ length: BOARD_COLS }, () => []),
  };

  const ai: PlayerState = {
    id: 'ai',
    name: options?.aiName ?? 'Arconte Rival',
    title: options?.aiTitle ?? 'Senhor da Fenda',
    avatarCardId: options?.aiAvatarCardId ?? aiDeck[0]?.id ?? 'purple_01',
    hp: aiMaxHp,
    maxHp: aiMaxHp,
    corruption: 0,
    currentEssence: STARTING_ESSENCE,
    maxEssence: STARTING_ESSENCE,
    hasChanneledThisTurn: false,
    hasMovedThisTurn: false,
    hasUsedSovereignPowerThisTurn: false,
    hasUsedBloodPactThisTurn: false,
    hasUsedSimpleDomainThisTurn: false,
    domainExhaustionTurns: 0,
    affinities: createStartingAffinitiesForDeck(aiDeck),
    channeledCards: [],
    deck: shuffledAiDeck,
    hand: aiHand,
    crypt: [],
    vanguard: Array(BOARD_COLS).fill(null),
    rearguard: Array(BOARD_COLS).fill(null),
    vanguardStacks: Array.from({ length: BOARD_COLS }, () => []),
    rearguardStacks: Array.from({ length: BOARD_COLS }, () => []),
  };

  const state: GameState = {
    turn: 1,
    activePlayer: 'player',
    phase: 'main',
    initiativePlayer: 'player',
    domainExpansion: null,
    winner: null,
    winReason: '',
    bossId: options?.bossId,
    weather: null,
    columnRunes: [],
    player,
    ai,
    combatLog: [],
    feedbacks: [],
  };

  addLog(
    state,
    'system',
    'turn',
    `Partida iniciada! Você começa com ${STARTING_ESSENCE}⚡ de Essência, ${STARTING_HAND_SIZE} cartas na mão e ${BOARD_COLS} colunas táticas por fileira!`
  );

  spawnColumnRuneIfNeeded(state);

  return state;
}

/**
 * Mulligan (Troca de Mão Inicial antes do Turno 1):
 * Substitui as cartas selecionadas da mão inicial por novas cartas do grimório e reembaralha as devolvidas.
 */
export function mulliganCards(
  state: GameState,
  actor: 'player' | 'ai',
  indicesToSwap: number[]
): GameState {
  const uniqueSorted = Array.from(new Set(indicesToSwap))
    .filter((idx) => idx >= 0 && idx < state[actor].hand.length)
    .sort((a, b) => a - b);

  if (uniqueSorted.length === 0) {
    const nextKeep = cloneGameState(state);
    addLog(
      nextKeep,
      actor,
      'turn',
      `${nextKeep[actor].name} manteve todas as ${nextKeep[actor].hand.length} cartas da mão inicial.`
    );
    return nextKeep;
  }

  const next = cloneGameState(state);
  const actorState = next[actor];
  const returnedCards: CardDefinition[] = [];
  const newHand: CardDefinition[] = [];

  for (let i = 0; i < actorState.hand.length; i++) {
    if (uniqueSorted.includes(i)) {
      returnedCards.push(actorState.hand[i]);
    } else {
      newHand.push(actorState.hand[i]);
    }
  }

  // Draw replacement cards from the top of the deck first so the player doesn't immediately redraw the same card
  const countToDraw = returnedCards.length;
  for (let i = 0; i < countToDraw; i++) {
    if (actorState.deck.length > 0) {
      newHand.push(actorState.deck.shift()!);
    }
  }

  // Shuffle returned cards back into the deck
  actorState.deck = shuffleCards([...actorState.deck, ...returnedCards]);
  actorState.hand = newHand;

  addLog(
    next,
    actor,
    'turn',
    `${actorState.name} realizou Mulligan e trocou ${countToDraw} carta(s) da mão inicial!`
  );

  return next;
}

function pickMostNeededColoredDomain(actorState: PlayerState): Domain {
  const coloredDomains: Exclude<Domain, 'neutral'>[] = ['red', 'blue', 'purple', 'green', 'gold'];
  const deficitScore: Record<Exclude<Domain, 'neutral'>, number> = {
    red: 0,
    blue: 0,
    purple: 0,
    green: 0,
    gold: 0,
  };

  for (const c of actorState.hand) {
    if (c.domain !== 'neutral') {
      const currentAff = actorState.affinities[c.domain];
      const needed = Math.max(0, c.affinityReq - currentAff);
      deficitScore[c.domain] += needed * 3 + 1;
    }
  }

  for (const c of actorState.deck) {
    if (c.domain !== 'neutral') {
      deficitScore[c.domain] += 0.25;
    }
  }

  let bestDomain: Exclude<Domain, 'neutral'> = 'red';
  let bestScore = -1;
  for (const dom of coloredDomains) {
    const score = deficitScore[dom] + actorState.affinities[dom] * 0.5;
    if (score > bestScore) {
      bestScore = score;
      bestDomain = dom;
    }
  }

  return bestDomain;
}

export function channelCard(
  state: GameState,
  actor: 'player' | 'ai',
  handIndex: number
): GameState {
  if (state.phase === 'gameover' || (actor === 'player' && state.activePlayer !== 'player')) {
    return state;
  }

  const next = cloneGameState(state);
  const actorState = next[actor];

  if (actorState.hasChanneledThisTurn) {
    return state;
  }

  if (handIndex < 0 || handIndex >= actorState.hand.length) {
    return state;
  }

  const [card] = actorState.hand.splice(handIndex, 1);
  actorState.channeledCards.push(card);
  actorState.hasChanneledThisTurn = true;

  if (card.domain === 'neutral') {
    actorState.affinities.neutral += 1;
    const bonusDomain = pickMostNeededColoredDomain(actorState);
    actorState.affinities[bonusDomain] += 1;
    addLog(
      next,
      actor,
      'channel',
      `${actorState.name} reciclou [${card.name}] no Altar (+1 Afinidade e comprou 1 carta | Essência: ${actorState.currentEssence}/${actorState.maxEssence}⚡).`
    );
  } else {
    actorState.affinities[card.domain] += 1;
    addLog(
      next,
      actor,
      'channel',
      `${actorState.name} reciclou [${card.name}] no Altar (+1 Afinidade ${card.domain.toUpperCase()} e comprou 1 carta | Essência: ${actorState.currentEssence}/${actorState.maxEssence}⚡).`
    );
  }

  drawCardsForActor(next, actor, 1);
  addFeedback(next, `${actor}-sovereign`, '+1 Afinidade & +1 Carta', 'ess');
  checkAndTriggerArenaWeather(next, actor);
  checkAndResolveDomainClash(next);
  recalculateFormationBonuses(next);
  return next;
}

/**
 * M1 — Sinergia de Formação, Coluna & Invasão de Território (Nível 2):
 * - Disparo Apoiado (Coluna Vertical): Unidade na Retaguarda com um aliado exatamente à sua frente
 *   na mesma coluna da Vanguarda ganha +1 ATQ (formationAtkBonus = 1).
 * - Falange de Escudos (Adjacência na Vanguarda): Unidade na Vanguarda adjacente (slot -1 ou +1) a
 *   um aliado Guardião ganha +1 Armadura (formationArmorBonus = 1).
 * - Invasão de Território (Vanguarda Desimpedida): Criatura na Vanguarda cuja coluna oposta na
 *   Vanguarda inimiga esteja vazia avança para o terreno adversário e ganha +1 ATQ (invasionAtkBonus = 1, isInvading = true).
 */
export function recalculateFormationBonuses(state: GameState): void {
  const isAshStormActive = state.weather?.type === 'ash_storm';

  for (const owner of ['player', 'ai'] as const) {
    const pState = state[owner];
    const enemyOwner: 'player' | 'ai' = owner === 'player' ? 'ai' : 'player';
    const enemyState = state[enemyOwner];
    const isRedAwakened = isDomainTerrainAwakened(pState, 'red');
    const isGoldAwakened = isDomainTerrainAwakened(pState, 'gold');

    syncPlayerBoardSlots(pState);
    syncPlayerBoardSlots(enemyState);

    // 1. Strip previous formation, invasion, terrain & weather bonuses cleanly across ALL stacked units
    for (const u of getAllBoardUnits(pState)) {
      if (u.formationAtkBonus) {
        u.currentAtk = Math.max(0, u.currentAtk - u.formationAtkBonus);
        u.formationAtkBonus = 0;
      }
      if (u.formationArmorBonus) {
        u.currentArmor = Math.max(0, u.currentArmor - u.formationArmorBonus);
        u.formationArmorBonus = 0;
      }
      if (u.invasionAtkBonus) {
        u.currentAtk = Math.max(0, u.currentAtk - u.invasionAtkBonus);
        u.invasionAtkBonus = 0;
      }
      if (u.terrainAtkBonus) {
        u.currentAtk = Math.max(0, u.currentAtk - u.terrainAtkBonus);
        u.terrainAtkBonus = 0;
      }
      if (u.terrainArmorBonus) {
        u.currentArmor = Math.max(0, u.currentArmor - u.terrainArmorBonus);
        u.terrainArmorBonus = 0;
      }
      if (u.weatherAtkBonus) {
        u.currentAtk = Math.max(0, u.currentAtk - u.weatherAtkBonus);
        u.weatherAtkBonus = 0;
      }
      if (u.domainExpansionAtkBonus) {
        u.currentAtk = Math.max(0, u.currentAtk - u.domainExpansionAtkBonus);
        u.domainExpansionAtkBonus = 0;
      }
      if (u.domainExpansionArmorBonus) {
        u.currentArmor = Math.max(0, u.currentArmor - u.domainExpansionArmorBonus);
        u.domainExpansionArmorBonus = 0;
      }
      if (u.bastionArmorBonus) {
        u.currentArmor = Math.max(0, u.currentArmor - u.bastionArmorBonus);
        u.bastionArmorBonus = 0;
      }
      u.isInvading = false;
    }

    // 1a. Apply Domain Expansion 120% Potential Bonuses & Defensive Stance (+1 Armor Bastion)
    const activeDomExp = state.domainExpansion;
    const myExpandedDomain =
      activeDomExp?.owner === owner
        ? activeDomExp.domain
        : activeDomExp?.clashRival?.owner === owner
        ? activeDomExp.clashRival.domain
        : null;

    for (const u of getAllBoardUnits(pState)) {
      if (u.isTrap) continue;

      if (u.card.type === 'creature' && u.stance === 'defend' && !u.isFrozen) {
        u.bastionArmorBonus = 1;
        u.currentArmor += 1;
      }

      if (myExpandedDomain && u.card.type === 'creature') {
        if (myExpandedDomain === 'red') {
          u.domainExpansionAtkBonus = 2;
          u.currentAtk += 2;
        } else if (myExpandedDomain === 'blue') {
          u.domainExpansionAtkBonus = 1;
          u.domainExpansionArmorBonus = 1;
          u.currentAtk += 1;
          u.currentArmor += 1;
        } else if (myExpandedDomain === 'purple') {
          u.domainExpansionAtkBonus = 2;
          u.currentAtk += 2;
        } else if (myExpandedDomain === 'green') {
          u.domainExpansionAtkBonus = 2;
          u.domainExpansionArmorBonus = 1;
          u.currentAtk += 2;
          u.currentArmor += 1;
        } else if (myExpandedDomain === 'gold') {
          u.domainExpansionAtkBonus = 1;
          u.domainExpansionArmorBonus = 2;
          u.currentAtk += 1;
          u.currentArmor += 2;
        }
      }
    }

    // 1b. Apply Arena Weather global bonus (Tempestade de Cinzas Rubras: +1 ATK to all creatures)
    if (isAshStormActive) {
      for (const u of getAllBoardUnits(pState)) {
        if (u.card.type === 'creature' && !u.isTrap) {
          u.weatherAtkBonus = 1;
          u.currentAtk += 1;
        }
      }
    }

    // 2. Apply Vanguard Phalanx (+1 Armor if adjacent or stacked with an allied Guardião in Vanguard)
    //    AND Territorial Invasion (+1 ATK if opposing Rearguard slot in same column has no non-trap units)
    //    AND Red/Gold Biome Terrain Effects (+1 ATK / +1 Armor to Vanguard creatures when Terrain is awakened!)
    for (let i = 0; i < BOARD_COLS; i++) {
      const vStack = getSlotUnits(pState, 'vanguard', i);
      const leftStack = i > 0 ? getSlotUnits(pState, 'vanguard', i - 1) : [];
      const rightStack = i < BOARD_COLS - 1 ? getSlotUnits(pState, 'vanguard', i + 1) : [];
      const opposingRearUnits = getSlotUnits(enemyState, 'rearguard', i).filter((u) => !u.isTrap);
      const isOpposingRearEmpty = opposingRearUnits.length === 0;

      for (const vUnit of vStack) {
        if (vUnit.card.type === 'relic' || vUnit.isTrap) continue;

        const hasAdjacentOrStackedGuardian =
          vStack.some((other) => other.instanceId !== vUnit.instanceId && other.keywords.includes('Guardião')) ||
          leftStack.some((u) => u.keywords.includes('Guardião')) ||
          rightStack.some((u) => u.keywords.includes('Guardião'));

        if (hasAdjacentOrStackedGuardian) {
          vUnit.formationArmorBonus = 1;
          vUnit.currentArmor += 1;
        }

        if (isOpposingRearEmpty) {
          vUnit.isInvading = true;
          vUnit.invasionAtkBonus = 1;
          vUnit.currentAtk += 1;
        }

        if (isRedAwakened) {
          vUnit.terrainAtkBonus = 1;
          vUnit.currentAtk += 1;
        }
        if (isGoldAwakened) {
          vUnit.terrainArmorBonus = 1;
          vUnit.currentArmor += 1;
        }
      }
    }

    // 3. Apply Column Support (+1 ATK to Rearguard creatures when aligned with allied Vanguard in the same column)
    for (let i = 0; i < BOARD_COLS; i++) {
      const rStack = getSlotUnits(pState, 'rearguard', i);
      const vStack = getSlotUnits(pState, 'vanguard', i).filter((u) => !u.isTrap);
      const hasVanguardCover = vStack.length > 0;
      if (hasVanguardCover) {
        for (const rUnit of rStack) {
          if (rUnit.card.type === 'creature' && !rUnit.isTrap) {
            rUnit.formationAtkBonus = 1;
            rUnit.currentAtk += 1;
          }
        }
      }
    }
  }
}

export function isDomainTerrainAwakened(
  _actorState: PlayerState,
  _domain: Exclude<Domain, 'neutral'>
): boolean {
  // Terrenos Despertos (3+ Afinidade) foram substituídos exclusivamente pela Expansão de Domínio (6+ Afinidade).
  return false;
}

export interface TerrainStatusInfo {
  domain: Exclude<Domain, 'neutral'>;
  isAwakened: boolean;
  currentAffinity: number;
  icon: string;
  bonusTitle: string;
  shortBadge: string;
  bonusDesc: string;
}

export function getTerrainInfoForDomain(
  actorState: PlayerState,
  domain: Exclude<Domain, 'neutral'>
): TerrainStatusInfo {
  const primary = getPrimarySovereignDomain(actorState);
  const currentAffinity =
    (actorState.affinities[domain] ?? 0) +
    (domain === primary ? actorState.affinities.neutral ?? 0 : 0);
  const isAwakened = isDomainTerrainAwakened(actorState, domain);

  switch (domain) {
    case 'red':
      return {
        domain,
        isAwakened,
        currentAffinity,
        icon: '🔥',
        bonusTitle: 'Calor Vulcânico',
        shortBadge: '+1⚔️ Vanguarda',
        bonusDesc: 'Criaturas aliadas na Vanguarda ganham +1⚔️ ATQ extra (3+ Afinidade 🔴)',
      };
    case 'green':
      return {
        domain,
        isAwakened,
        currentAffinity,
        icon: '🌿',
        bonusTitle: 'Seiva Ancestral',
        shortBadge: 'Cura +2❤️ (x2)',
        bonusDesc: 'No início do turno, cura +2❤️ nas 2 criaturas aliadas mais feridas (3+ Afinidade 🟢)',
      };
    case 'purple':
      return {
        domain,
        isAwakened,
        currentAffinity,
        icon: '💀',
        bonusTitle: 'Eco Necrótico',
        shortBadge: 'Dreno 1❤️ na Morte',
        bonusDesc: 'Quando uma criatura aliada morre, drena 1❤️ do Soberano rival (3+ Afinidade 🟣)',
      };
    case 'gold':
      return {
        domain,
        isAwakened,
        currentAffinity,
        icon: '🛡️',
        bonusTitle: 'Têmpera Imperial',
        shortBadge: '+1🛡️ Vanguarda',
        bonusDesc: 'Criaturas aliadas na Vanguarda ganham +1🛡️ Armadura (3+ Afinidade 🟡)',
      };
    case 'blue':
      return {
        domain,
        isAwakened,
        currentAffinity,
        icon: '⚡',
        bonusTitle: 'Condutor Rúnico',
        shortBadge: '+1⚔️/+1❤️ p/ Feitiço',
        bonusDesc: 'Lançar um Feitiço concede +1⚔️/+1❤️ a um aliado em campo (3+ Afinidade 🔵)',
      };
  }
}

export function getAllTerrainStatuses(actorState: PlayerState): TerrainStatusInfo[] {
  const domains: Exclude<Domain, 'neutral'>[] = ['red', 'blue', 'purple', 'green', 'gold'];
  const primary = getPrimarySovereignDomain(actorState);
  const active = domains
    .filter((d) => (actorState.affinities[d] ?? 0) > 0 || d === primary)
    .map((d) => getTerrainInfoForDomain(actorState, d));
  active.sort((a, b) => {
    if (a.isAwakened !== b.isAwakened) return a.isAwakened ? -1 : 1;
    return b.currentAffinity - a.currentAffinity;
  });
  return active;
}

export function getBiomeTerrainInfo(actorState: PlayerState): TerrainStatusInfo {
  const domain = getPrimarySovereignDomain(actorState);
  return getTerrainInfoForDomain(actorState, domain);
}

/**
 * ============================================================================
 * EXPANSÃO DE DOMÍNIO (RYOIKI TENKAI — ESTÁGIO II DO TERRENO DESPERTO)
 * ============================================================================
 * Requer 6+ de Afinidade no Domínio e custa 3⚡ de Essência.
 * - Potencial 120%: Amplifica os atributos de todas as unidades aliadas daquele Domínio.
 * - Acerto Garantido (Sure-Hit): Enquanto ativo (e sem Disputa de Domínio ou Domínio Simples rival),
 *   criaturas aptas a atacar atravessam toda a Vanguarda/Guardião para atingir diretamente o Soberano adversário!
 *   (Atenção: NÃO anula condições negativas sobre as próprias cartas, como Congelamento ou Exaustão!).
 * - Contramedidas do Defensor:
 *   1) Romper a Barreira por Sacrifício Distribuído (10❤️ distribuídos entre Soberano, Criaturas e Relíquias)
 *   2) Domínio Simples (2⚡ — anula o Acerto Garantido no Soberano por 1 rodada)
 *   3) Disputa de Domínios (Ativar sua própria Expansão de Domínio com 6+ Afinidade)
 *   4) Quebra de Concentração (Causar 8+ de dano ao Soberano dono da Expansão na mesma rodada)
 */
export const DOMAIN_EXPANSION_COST = 3;
export const SIMPLE_DOMAIN_COST = 2;
export const DOMAIN_BREAK_SACRIFICE_HP = 10;
export const DOMAIN_CONCENTRATION_BREAK_DMG = 8;

export function getDomainExpansionSpec(domain: Exclude<Domain, 'neutral'>): {
  domain: Exclude<Domain, 'neutral'>;
  name: string;
  subtitle: string;
  icon: string;
  potencyDesc: string;
  sureHitDesc: string;
} {
  switch (domain) {
    case 'red':
      return {
        domain: 'red',
        name: 'Caldeira do Sol Carmesim',
        subtitle: 'Expansão de Domínio Rubra',
        icon: '⛩️🔥',
        potencyDesc: 'Potencial 120%: Aliados Rubros ganham +2⚔️ ATQ.',
        sureHitDesc:
          'Acerto Garantido: Suas criaturas aptas atravessam toda a defesa para atacar o Soberano rival + 2🔥 de queima vulcânica por rodada!',
      };
    case 'blue':
      return {
        domain: 'blue',
        name: 'Vazio Infinito de Cronos',
        subtitle: 'Expansão de Domínio Cobalto',
        icon: '⛩️❄️',
        potencyDesc: 'Potencial 120%: Aliados Cobalto ganham +1⚔️ ATQ e +1🛡️ Armadura.',
        sureHitDesc:
          'Acerto Garantido: Suas criaturas aptas atravessam toda a defesa para atacar o Soberano rival + Congela 1 inimigo e compra +1 carta!',
      };
    case 'purple':
      return {
        domain: 'purple',
        name: 'Santuário Malevolente das Almas',
        subtitle: 'Expansão de Domínio Umbral',
        icon: '⛩️💀',
        potencyDesc: 'Potencial 120%: Aliados Umbrais ganham +2⚔️ ATQ e Dreno de Vida.',
        sureHitDesc:
          'Acerto Garantido: Suas criaturas aptas atravessam toda a defesa para atacar o Soberano rival + Drena 2❤️ do Soberano inimigo por rodada!',
      };
    case 'green':
      return {
        domain: 'green',
        name: 'Mar de Árvores Primordial',
        subtitle: 'Expansão de Domínio Silvestre',
        icon: '⛩️🌿',
        potencyDesc: 'Potencial 120%: Aliados Silvestres ganham +2⚔️ ATQ, +1🛡️ ARM e Atropelar.',
        sureHitDesc:
          'Acerto Garantido: Suas criaturas aptas atravessam toda a defesa para atacar o Soberano rival + Regenera +2❤️ em todas as suas criaturas!',
      };
    case 'gold':
      return {
        domain: 'gold',
        name: 'Tribunal da Sentença Dourada',
        subtitle: 'Expansão de Domínio Solar',
        icon: '⛩️☀️',
        potencyDesc: 'Potencial 120%: Aliados Solares ganham +1⚔️ ATQ e +2🛡️ Armadura.',
        sureHitDesc:
          'Acerto Garantido: Suas criaturas aptas atravessam toda a defesa para atacar o Soberano rival + Escudo Divino no maior aliado e -2⚔️ ATQ no maior inimigo!',
      };
  }
}

export function getEffectiveDomainAffinity(
  actorState: PlayerState,
  domain: Exclude<Domain, 'neutral'>
): number {
  const primary = getPrimarySovereignDomain(actorState);
  const raw = actorState.affinities[domain] ?? 0;
  if (domain !== primary) {
    return raw;
  }
  const allColored: Exclude<Domain, 'neutral'>[] = ['red', 'blue', 'purple', 'green', 'gold'];
  let totalColored = 0;
  for (const d of allColored) {
    totalColored += actorState.affinities[d] ?? 0;
  }
  return totalColored;
}

export function getBestExpandableDomain(actorState: PlayerState): {
  domain: Exclude<Domain, 'neutral'>;
  affinity: number;
} {
  const domains: Exclude<Domain, 'neutral'>[] = ['red', 'blue', 'purple', 'green', 'gold'];
  let bestDomain: Exclude<Domain, 'neutral'> = getPrimarySovereignDomain(actorState);
  let bestAff = getEffectiveDomainAffinity(actorState, bestDomain);

  for (const d of domains) {
    const aff = getEffectiveDomainAffinity(actorState, d);
    if (aff > bestAff) {
      bestAff = aff;
      bestDomain = d;
    }
  }
  return { domain: bestDomain, affinity: bestAff };
}

export function isSureHitActiveFor(state: GameState, actor: 'player' | 'ai'): boolean {
  const exp = state.domainExpansion;
  if (!exp || exp.owner !== actor) return false;
  // Cancelled if currently locked in a Domain Clash!
  if (exp.clashRival) return false;
  // Cancelled for this round if the opposing Sovereign activated Simple Domain!
  const enemyActor: 'player' | 'ai' = actor === 'player' ? 'ai' : 'player';
  if (exp.simpleDomainProtectedActor === enemyActor) return false;
  return true;
}

export function canInvokeDomainExpansion(
  state: GameState,
  actor: 'player' | 'ai'
): { allowed: boolean; reason?: string; domain: Exclude<Domain, 'neutral'>; affinity: number } {
  const actorState = state[actor];
  const { domain, affinity } = getBestExpandableDomain(actorState);

  if (state.phase === 'gameover') {
    return { allowed: false, reason: 'A partida já terminou.', domain, affinity };
  }
  if ((actorState.domainExhaustionTurns ?? 0) > 0) {
    return {
      allowed: false,
      reason: `Técnica em Exaustão pós-Domínio (${actorState.domainExhaustionTurns} rodada(s)).`,
      domain,
      affinity,
    };
  }
  if (
    state.domainExpansion?.owner === actor ||
    state.domainExpansion?.clashRival?.owner === actor
  ) {
    return {
      allowed: false,
      reason: 'Sua Expansão de Domínio já está ativa na arena!',
      domain,
      affinity,
    };
  }
  if (affinity < 6) {
    return {
      allowed: false,
      reason: `Requer 6+ de Afinidade Elemental (Atual: ${affinity}/6).`,
      domain,
      affinity,
    };
  }
  if (actorState.currentEssence < DOMAIN_EXPANSION_COST) {
    return {
      allowed: false,
      reason: `Requer ${DOMAIN_EXPANSION_COST}⚡ de Essência (Atual: ${actorState.currentEssence}⚡).`,
      domain,
      affinity,
    };
  }
  return { allowed: true, domain, affinity };
}

export function applyDomainExpansionPulseEffects(
  state: GameState,
  actor: 'player' | 'ai',
  domain: Exclude<Domain, 'neutral'>
): void {
  const actorState = state[actor];
  const enemyActor: 'player' | 'ai' = actor === 'player' ? 'ai' : 'player';
  const enemyState = state[enemyActor];

  switch (domain) {
    case 'red': {
      enemyState.hp = Math.max(0, enemyState.hp - 2);
      addFeedback(state, `${enemyActor}-sovereign`, '-2🔥 Caldeira Carmesim!', 'damage');
      break;
    }
    case 'blue': {
      const enemies = getAllBoardUnits(enemyState).filter(
        (u) => !u.isTrap && !u.isConcealedDeploy && u.card.type === 'creature' && !u.isFrozen
      );
      if (enemies.length > 0) {
        enemies.sort((a, b) => b.currentAtk - a.currentAtk);
        enemies[0].isFrozen = true;
        addFeedback(state, enemies[0].instanceId, '❄️ Vazio Infinito!', 'freeze');
      }
      drawCardsForActor(state, actor, 1);
      break;
    }
    case 'purple': {
      enemyState.hp = Math.max(0, enemyState.hp - 2);
      actorState.hp = Math.min(actorState.maxHp, actorState.hp + 2);
      addFeedback(state, `${enemyActor}-sovereign`, '-2💀 Santuário Malevolente!', 'damage');
      addFeedback(state, `${actor}-sovereign`, '+2❤️ Santuário Malevolente', 'heal');
      for (const u of getAllBoardUnits(actorState)) {
        if (
          u.card.type === 'creature' &&
          !u.isTrap &&
          u.card.domain === 'purple' &&
          !u.keywords.includes('Dreno de Vida')
        ) {
          u.keywords.push('Dreno de Vida');
        }
      }
      break;
    }
    case 'green': {
      for (const u of getAllBoardUnits(actorState)) {
        if (u.card.type === 'creature' && !u.isTrap) {
          u.currentHp = Math.min(u.maxHp, u.currentHp + 2);
          addFeedback(state, u.instanceId, '+2🌿 Mar de Árvores', 'heal');
          if (u.card.domain === 'green' && !u.keywords.includes('Atropelar')) {
            u.keywords.push('Atropelar');
          }
        }
      }
      break;
    }
    case 'gold': {
      const allies = getAllBoardUnits(actorState).filter(
        (u) => u.card.type === 'creature' && !u.isTrap
      );
      if (allies.length > 0) {
        allies.sort((a, b) => b.currentAtk - a.currentAtk);
        allies[0].hasDivineShield = true;
        addFeedback(state, allies[0].instanceId, '✨ Sentença Dourada!', 'shield');
      }
      const enemies = getAllBoardUnits(enemyState).filter(
        (u) => !u.isTrap && !u.isConcealedDeploy && u.card.type === 'creature'
      );
      if (enemies.length > 0) {
        enemies.sort((a, b) => b.currentAtk - a.currentAtk);
        enemies[0].currentAtk = Math.max(0, enemies[0].currentAtk - 2);
        addFeedback(state, enemies[0].instanceId, '-2⚔️ Confisco!', 'freeze');
      }
      break;
    }
  }
}

export function invokeDomainExpansion(state: GameState, actor: 'player' | 'ai'): GameState {
  const check = canInvokeDomainExpansion(state, actor);
  if (!check.allowed) return state;

  const next = cloneGameState(state);
  const actorState = next[actor];
  const enemyActor: 'player' | 'ai' = actor === 'player' ? 'ai' : 'player';
  const enemyState = next[enemyActor];
  const spec = getDomainExpansionSpec(check.domain);

  actorState.currentEssence -= DOMAIN_EXPANSION_COST;

  // Check if opponent already has an active Domain Expansion -> DOMAIN CLASH!
  if (next.domainExpansion && next.domainExpansion.owner === enemyActor) {
    const enemyAff = getEffectiveDomainAffinity(enemyState, next.domainExpansion.domain);
    const myAff = check.affinity;

    if (myAff > enemyAff) {
      // Overwhelming Affinity shatters enemy Domain Expansion immediately!
      enemyState.hp = Math.max(0, enemyState.hp - 3);
      enemyState.domainExhaustionTurns = 2;
      addFeedback(next, `${enemyActor}-sovereign`, '-3💥 DOMÍNIO ESTILHAÇADO!', 'damage');
      addLog(
        next,
        actor,
        'spell',
        `⛩️💥 QUEBRA DE DOMÍNIO! [${spec.name}] de ${actorState.name} (Afinidade ${myAff} vs ${enemyAff}) estilhaçou a barreira de ${enemyState.name} causando 3 de dano e dominou a Arena!`
      );
      next.domainExpansion = {
        owner: actor,
        domain: spec.domain,
        name: spec.name,
        subtitle: spec.subtitle,
        icon: spec.icon,
        potencyDesc: spec.potencyDesc,
        sureHitDesc: spec.sureHitDesc,
        turnsRemaining: 3,
        damageTakenByOwnerThisRound: 0,
        simpleDomainProtectedActor: null,
        clashRival: null,
      };
      applyDomainExpansionPulseEffects(next, actor, spec.domain);
    } else {
      // Equal or contested Affinity -> Enter DOMAIN CLASH (Confronto de Barreiras)!
      next.domainExpansion.clashRival = {
        owner: actor,
        domain: spec.domain,
        name: spec.name,
        icon: spec.icon,
      };
      addFeedback(next, `${actor}-sovereign`, '⚡ CONFRONTO DE DOMÍNIOS!', 'ess');
      addLog(
        next,
        actor,
        'spell',
        `⚡⛩️ DISPUTA DE DOMÍNIOS! [${spec.name}] colidiu com [${next.domainExpansion.name}]! Os efeitos de Acerto Garantido de ambos os Soberanos foram anulados enquanto durar o empate de Afinidade!`
      );
    }
  } else {
    next.domainExpansion = {
      owner: actor,
      domain: spec.domain,
      name: spec.name,
      subtitle: spec.subtitle,
      icon: spec.icon,
      potencyDesc: spec.potencyDesc,
      sureHitDesc: spec.sureHitDesc,
      turnsRemaining: 3,
      damageTakenByOwnerThisRound: 0,
      simpleDomainProtectedActor: null,
      clashRival: null,
    };
    addFeedback(next, `${actor}-sovereign`, `${spec.icon} EXPANSÃO: ${spec.name}!`, 'buff');
    addLog(
      next,
      actor,
      'spell',
      `⛩️ EXPANSÃO DE DOMÍNIO: ${actorState.name} invocou [${spec.icon} ${spec.name}] por 3 rodadas! (${spec.sureHitDesc})`
    );
    applyDomainExpansionPulseEffects(next, actor, spec.domain);
  }

  recalculateFormationBonuses(next);
  cleanupDeadUnits(next);
  return next;
}

export function checkAndResolveDomainClash(state: GameState): void {
  const exp = state.domainExpansion;
  if (!exp || !exp.clashRival) return;

  const ownerState = state[exp.owner];
  const rivalState = state[exp.clashRival.owner];
  const ownerAff = getEffectiveDomainAffinity(ownerState, exp.domain);
  const rivalAff = getEffectiveDomainAffinity(rivalState, exp.clashRival.domain);

  if (ownerAff > rivalAff) {
    const lostOwner = exp.clashRival.owner;
    state[lostOwner].domainExhaustionTurns = 2;
    addFeedback(state, `${exp.owner}-sovereign`, '⛩️ Venceu Disputa de Domínio!', 'buff');
    addLog(
      state,
      exp.owner,
      'effect',
      `⛩️ [${exp.name}] superou a Afinidade rival (${ownerAff} vs ${rivalAff}) e venceu a Disputa de Domínios! O Acerto Garantido foi restaurado!`
    );
    exp.clashRival = null;
    recalculateFormationBonuses(state);
  } else if (rivalAff > ownerAff) {
    const newOwner = exp.clashRival.owner;
    const newSpec = getDomainExpansionSpec(exp.clashRival.domain);
    state[exp.owner].domainExhaustionTurns = 2;
    state.domainExpansion = {
      owner: newOwner,
      domain: newSpec.domain,
      name: newSpec.name,
      subtitle: newSpec.subtitle,
      icon: newSpec.icon,
      potencyDesc: newSpec.potencyDesc,
      sureHitDesc: newSpec.sureHitDesc,
      turnsRemaining: exp.turnsRemaining,
      damageTakenByOwnerThisRound: 0,
      simpleDomainProtectedActor: null,
      clashRival: null,
    };
    addFeedback(state, `${newOwner}-sovereign`, '⛩️ Venceu Disputa de Domínio!', 'buff');
    addLog(
      state,
      newOwner,
      'effect',
      `⛩️ [${newSpec.name}] superou a Afinidade rival (${rivalAff} vs ${ownerAff}) e conquistou a Arena na Disputa de Domínios!`
    );
    recalculateFormationBonuses(state);
  }
}

/**
 * Contramedida 2: Domínio Simples (Cúpula Anti-Domínio, Custo 2⚡)
 * Desativa o Acerto Garantido da Expansão de Domínio inimiga durante esta rodada.
 */
export function canUseSimpleDomain(state: GameState, actor: 'player' | 'ai'): boolean {
  if (state.phase === 'gameover') return false;
  const exp = state.domainExpansion;
  if (!exp || exp.owner === actor || exp.clashRival) return false;
  if (exp.simpleDomainProtectedActor === actor) return false;
  const actorState = state[actor];
  if (actorState.hasUsedSimpleDomainThisTurn) return false;
  return actorState.currentEssence >= SIMPLE_DOMAIN_COST;
}

export function activateSimpleDomain(state: GameState, actor: 'player' | 'ai'): GameState {
  if (!canUseSimpleDomain(state, actor)) return state;
  const next = cloneGameState(state);
  const actorState = next[actor];
  actorState.currentEssence -= SIMPLE_DOMAIN_COST;
  actorState.hasUsedSimpleDomainThisTurn = true;
  if (next.domainExpansion) {
    next.domainExpansion.simpleDomainProtectedActor = actor;
  }
  addFeedback(next, `${actor}-sovereign`, '💠 Domínio Simples Ativo!', 'shield');
  addLog(
    next,
    actor,
    'spell',
    `💠 CONTRAMEDIDA DE BARREIRA: ${actorState.name} ergueu um [Domínio Simples] (-${SIMPLE_DOMAIN_COST}⚡), anulando o Acerto Garantido inimigo nesta rodada!`
  );
  return next;
}

/**
 * Contramedida 1: Romper a Expansão de Domínio sacrificando 10 pontos de Vida distribuídos
 * entre o Soberano, suas Criaturas e suas Relíquias em campo!
 */
export function getTotalAvailableSacrificePool(
  state: GameState,
  actor: 'player' | 'ai'
): number {
  const actorState = state[actor];
  // Sovereign can sacrifice up to (hp - 1) so they don't die from their own sacrifice
  const maxFromSovereign = Math.max(0, actorState.hp - 1);
  const units = getAllBoardUnits(actorState).filter((u) => !u.isTrap && u.currentHp > 0);
  const maxFromUnits = units.reduce((acc, u) => acc + u.currentHp, 0);
  return maxFromSovereign + maxFromUnits;
}

export function canBreakDomainExpansionWithSacrifice(
  state: GameState,
  actor: 'player' | 'ai'
): boolean {
  if (state.phase === 'gameover') return false;
  const exp = state.domainExpansion;
  if (!exp || exp.owner === actor) return false;
  return getTotalAvailableSacrificePool(state, actor) >= DOMAIN_BREAK_SACRIFICE_HP;
}

export function buildAutoSacrificeAllocation(
  state: GameState,
  actor: 'player' | 'ai'
): SacrificeAllocation {
  const actorState = state[actor];
  let remaining = DOMAIN_BREAK_SACRIFICE_HP;
  const unitDamages: Record<string, number> = {};

  // First distribute across relics and high-HP creatures (preserving at least 1 HP on units when possible)
  const units = getAllBoardUnits(actorState).filter((u) => !u.isTrap && u.currentHp > 0);
  units.sort((a, b) => b.currentHp - a.currentHp);

  // Pass 1: Non-lethal chip damage from units (leaving >= 1 HP)
  for (const u of units) {
    if (remaining <= 0) break;
    const spareHp = Math.max(0, u.currentHp - 1);
    if (spareHp > 0) {
      const take = Math.min(remaining, spareHp);
      unitDamages[u.instanceId] = (unitDamages[u.instanceId] ?? 0) + take;
      remaining -= take;
    }
  }

  // Pass 2: Sovereign HP up to half of remaining (leaving >= 5 HP if possible)
  let sovereignHp = 0;
  if (remaining > 0) {
    const safeSov = Math.max(0, actorState.hp - 5);
    const takeSov = Math.min(remaining, safeSov);
    sovereignHp += takeSov;
    remaining -= takeSov;
  }

  // Pass 3: Full sacrifice of remaining HP from units if needed
  for (const u of units) {
    if (remaining <= 0) break;
    const already = unitDamages[u.instanceId] ?? 0;
    const leftOnUnit = u.currentHp - already;
    if (leftOnUnit > 0) {
      const take = Math.min(remaining, leftOnUnit);
      unitDamages[u.instanceId] = already + take;
      remaining -= take;
    }
  }

  // Pass 4: Remaining from Sovereign (as long as Sovereign stays at >= 1 HP)
  if (remaining > 0) {
    const maxSovExtra = Math.max(0, actorState.hp - 1 - sovereignHp);
    const take = Math.min(remaining, maxSovExtra);
    sovereignHp += take;
    remaining -= take;
  }

  return { sovereignHp, unitDamages };
}

export function breakDomainExpansionWithSacrifice(
  state: GameState,
  actor: 'player' | 'ai',
  allocation?: SacrificeAllocation
): GameState {
  if (!canBreakDomainExpansionWithSacrifice(state, actor)) return state;

  const chosenAlloc = allocation ?? buildAutoSacrificeAllocation(state, actor);
  const next = cloneGameState(state);
  const actorState = next[actor];
  const exp = next.domainExpansion;
  if (!exp) return state;

  let totalPaid = 0;
  const maxSov = Math.max(0, actorState.hp - 1);
  const sovPaid = Math.min(maxSov, Math.max(0, chosenAlloc.sovereignHp));
  if (sovPaid > 0) {
    actorState.hp -= sovPaid;
    totalPaid += sovPaid;
    addFeedback(next, `${actor}-sovereign`, `-${sovPaid}❤️ Tributo Anti-Domínio`, 'damage');
  }

  for (const [instId, dmgVal] of Object.entries(chosenAlloc.unitDamages)) {
    if (dmgVal <= 0) continue;
    const found = findUnitOnBoard(next, instId);
    if (found && found.owner === actor && !found.unit.isTrap) {
      const actual = Math.min(found.unit.currentHp, dmgVal);
      found.unit.currentHp -= actual;
      totalPaid += actual;
      addFeedback(next, found.unit.instanceId, `-${actual}❤️ Romper Domínio`, 'damage');
    }
  }

  if (totalPaid < DOMAIN_BREAK_SACRIFICE_HP) {
    return state;
  }

  const brokenName = exp.name;
  const brokenOwner = exp.owner;
  next[brokenOwner].domainExhaustionTurns = 2;
  next.domainExpansion = null;

  addFeedback(next, `${actor}-sovereign`, '💥 BARREIRA ROMPIDA!', 'shield');
  addLog(
    next,
    actor,
    'effect',
    `💥 QUEBRA DE BARREIRA POR SACRIFÍCIO! ${actorState.name} sacrificou ${totalPaid}❤️ distribuídos entre seu Soberano e suas tropas para estilhaçar a Expansão de Domínio [${brokenName}]!`
  );

  recalculateFormationBonuses(next);
  cleanupDeadUnits(next);
  return next;
}

function registerSovereignDamageForDomainConcentration(
  state: GameState,
  damagedOwner: 'player' | 'ai',
  damageAmount: number
): void {
  if (damageAmount <= 0 || !state.domainExpansion) return;
  if (state.domainExpansion.owner !== damagedOwner) return;
  state.domainExpansion.damageTakenByOwnerThisRound += damageAmount;
  if (state.domainExpansion.damageTakenByOwnerThisRound >= DOMAIN_CONCENTRATION_BREAK_DMG) {
    const brokenExp = state.domainExpansion;
    state.domainExpansion = null;
    state[damagedOwner].domainExhaustionTurns = 2;
    recalculateFormationBonuses(state);
    addFeedback(
      state,
      `${damagedOwner}-sovereign`,
      '💥 QUEBRA DE CONCENTRAÇÃO!',
      'damage'
    );
    addLog(
      state,
      damagedOwner === 'player' ? 'ai' : 'player',
      'effect',
      `🗡️ QUEBRA DE CONCENTRAÇÃO! ${state[damagedOwner].name} sofreu ${brokenExp.damageTakenByOwnerThisRound} de dano nesta rodada e sua Expansão de Domínio [${brokenExp.name}] colapsou!`
    );
  }
}

/**
 * Queimar Carta por Essência Temporária (+1⚡ neste turno + 1 Afinidade, sem limite de 1x por turno,
 * mas sacrifica a carta para a Cripta sem comprar carta de reposição).
 */
export function burnCardForEssence(
  state: GameState,
  actor: 'player' | 'ai',
  handIndex: number
): GameState {
  if (state.phase === 'gameover' || (actor === 'player' && state.activePlayer !== 'player')) {
    return state;
  }
  const actorStateInitial = state[actor];
  if (handIndex < 0 || handIndex >= actorStateInitial.hand.length) {
    return state;
  }

  const next = cloneGameState(state);
  const actorState = next[actor];
  const [card] = actorState.hand.splice(handIndex, 1);
  actorState.crypt.push(card);
  actorState.currentEssence += 1;

  if (card.domain === 'neutral') {
    actorState.affinities.neutral += 1;
    const bonusDomain = pickMostNeededColoredDomain(actorState);
    actorState.affinities[bonusDomain] += 1;
  } else {
    actorState.affinities[card.domain] += 1;
  }

  addFeedback(next, `${actor}-sovereign`, '+1⚡ (Pergaminho Queimado)', 'ess');
  addLog(
    next,
    actor,
    'channel',
    `${actorState.name} queimou [${card.name}] em um pulso arcano (+1⚡ Essência temporária e +1 Afinidade).`
  );
  checkAndTriggerArenaWeather(next, actor);
  checkAndResolveDomainClash(next);
  recalculateFormationBonuses(next);
  return next;
}

/**
 * Pacto de Sangue do Soberano: Sacrifica 3❤️ de Vida (+1 Corrupção) para ganhar +1⚡ Essência temporária (1x por turno).
 */
export function canUseBloodPact(state: GameState, actor: 'player' | 'ai'): boolean {
  if (state.phase === 'gameover' || (actor === 'player' && state.activePlayer !== 'player')) return false;
  const actorState = state[actor];
  return !actorState.hasUsedBloodPactThisTurn && actorState.hp > 3;
}

export function bloodPactForEssence(state: GameState, actor: 'player' | 'ai'): GameState {
  if (!canUseBloodPact(state, actor)) return state;

  const next = cloneGameState(state);
  const actorState = next[actor];
  actorState.hp -= 3;
  actorState.currentEssence += 1;
  actorState.hasUsedBloodPactThisTurn = true;
  actorState.corruption = Math.min(10, actorState.corruption + 1);

  addFeedback(next, `${actor}-sovereign`, '-3❤️ / +1⚡ Pacto de Sangue!', 'ess');
  addLog(
    next,
    actor,
    'corruption',
    `${actorState.name} selou um Pacto de Sangue (-3❤️ Vida, +1 Corrupção -> +1⚡ Essência imediata)!`
  );
  return next;
}

/**
 * M3 — Manobra Tática: Avançar (Retaguarda -> Vanguarda) ou Recuar (Vanguarda -> Retaguarda),
 * Custo 0⚡, 1x por turno.
 */
export function canMoveUnitRow(
  state: GameState,
  actor: 'player' | 'ai',
  instanceId: string
): boolean {
  if (state.phase === 'gameover' || (actor === 'player' && state.activePlayer !== 'player')) return false;
  const actorState = state[actor];
  if (actorState.hasMovedThisTurn) return false;

  const found = findUnitOnBoard(state, instanceId);
  if (!found || found.owner !== actor) return false;
  if (found.unit.card.type === 'relic' || found.unit.isFrozen) return false;

  const targetRow: RowType = found.row === 'vanguard' ? 'rearguard' : 'vanguard';
  for (let i = 0; i < BOARD_COLS; i++) {
    if (canDeployToSlot(actorState, targetRow, i)) return true;
  }
  return false;
}

export function moveUnitRow(
  state: GameState,
  actor: 'player' | 'ai',
  instanceId: string
): GameState {
  if (!canMoveUnitRow(state, actor, instanceId)) return state;

  const next = cloneGameState(state);
  const actorState = next[actor];
  const found = findUnitOnBoard(next, instanceId);
  if (!found) return state;

  const { unit, row: oldRow, slotIndex: oldSlot } = found;
  const newRow: RowType = oldRow === 'vanguard' ? 'rearguard' : 'vanguard';

  // Prefer keeping the same column index if space is available (< MAX_UNITS_PER_SLOT), otherwise first free/stackable slot
  let newSlot = canDeployToSlot(actorState, newRow, oldSlot) ? oldSlot : -1;
  if (newSlot === -1) {
    for (let i = 0; i < BOARD_COLS; i++) {
      if (getSlotUnits(actorState, newRow, i).length === 0) {
        newSlot = i;
        break;
      }
    }
  }
  if (newSlot === -1) {
    for (let i = 0; i < BOARD_COLS; i++) {
      if (canDeployToSlot(actorState, newRow, i)) {
        newSlot = i;
        break;
      }
    }
  }
  if (newSlot === -1) return state;

  removeUnitFromBoard(actorState, unit.instanceId);
  addUnitToSlot(actorState, newRow, newSlot, unit);
  actorState.hasMovedThisTurn = true;

  if (next.roundSubPhase !== 'deploy') {
    consumeColumnRuneOnDeploy(next, actor, newRow, newSlot, unit);
  }
  recalculateFormationBonuses(next);

  const actionVerb = newRow === 'vanguard' ? 'Avançou para a Vanguarda' : 'Recuou para a Retaguarda';
  addFeedback(next, unit.instanceId, `⇄ ${newRow === 'vanguard' ? 'Vanguarda' : 'Retaguarda'}`, 'buff');
  addLog(
    next,
    actor,
    'combat',
    `Manobra Tática: [${unit.card.name}] ${actionVerb} (Coluna ${newSlot + 1})!`
  );

  return next;
}

/**
 * M4 — Poder Ativo do Soberano (Custo 2⚡, 1x por turno), determinado pelo Domínio principal do Soberano.
 */
export function getPrimarySovereignDomain(actorState: PlayerState): Exclude<Domain, 'neutral'> {
  const domains: Exclude<Domain, 'neutral'>[] = ['red', 'blue', 'purple', 'green', 'gold'];
  let best: Exclude<Domain, 'neutral'> = 'red';
  let bestVal = -1;
  for (const d of domains) {
    if (actorState.affinities[d] > bestVal) {
      bestVal = actorState.affinities[d];
      best = d;
    }
  }
  return best;
}

export function getSovereignPowerInfo(actorState: PlayerState): {
  domain: Exclude<Domain, 'neutral'>;
  name: string;
  cost: number;
  icon: string;
  shortDesc: string;
} {
  const dom = getPrimarySovereignDomain(actorState);
  switch (dom) {
    case 'red':
      return {
        domain: 'red',
        name: 'Chama Soberana',
        cost: 2,
        icon: '🔥',
        shortDesc: 'Causa 2🔥 a um inimigo e 1🔥 ao Soberano rival (ou 3🔥 ao Soberano se o campo estiver vazio).',
      };
    case 'blue':
      return {
        domain: 'blue',
        name: 'Pulso Rúnico',
        cost: 2,
        icon: '❄️',
        shortDesc: 'Congela um inimigo e causa 2❄️ a ele (ou ao Soberano rival) + concede +1⚔️/+1❤️ a um aliado (ou compra 1 carta).',
      };
    case 'purple':
      return {
        domain: 'purple',
        name: 'Dreno Umbroso',
        cost: 2,
        icon: '🟣',
        shortDesc: 'Causa 2💀 a um inimigo (ou ao Soberano rival), cura +2❤️ no seu Soberano e gera +1 Corrupção.',
      };
    case 'green':
      return {
        domain: 'green',
        name: 'Rugido Alfa',
        cost: 2,
        icon: '🌿',
        shortDesc: 'Concede +1⚔️ ATQ e +2❤️ Vida ao aliado mais forte (ou cura +3❤️ no seu Soberano).',
      };
    case 'gold':
      return {
        domain: 'gold',
        name: 'Baluarte Imperial',
        cost: 2,
        icon: '☀️',
        shortDesc: 'Concede +1🛡️ Armadura e +2❤️ Vida ao aliado mais ferido (ou cura +3❤️ no seu Soberano).',
      };
  }
}

export function canUseSovereignPower(state: GameState, actor: 'player' | 'ai'): boolean {
  if (state.phase === 'gameover' || (actor === 'player' && state.activePlayer !== 'player')) return false;
  const actorState = state[actor];
  return !actorState.hasUsedSovereignPowerThisTurn && actorState.currentEssence >= 2;
}

export function useSovereignPower(state: GameState, actor: 'player' | 'ai'): GameState {
  if (!canUseSovereignPower(state, actor)) return state;

  const next = cloneGameState(state);
  const actorState = next[actor];
  const enemyActor: 'player' | 'ai' = actor === 'player' ? 'ai' : 'player';
  const enemyState = next[enemyActor];
  const info = getSovereignPowerInfo(actorState);

  actorState.currentEssence -= info.cost;
  actorState.hasUsedSovereignPowerThisTurn = true;

  switch (info.domain) {
    case 'red': {
      const enemies = getAllBoardUnits(enemyState).filter((u) => !u.isTrap);
      if (enemies.length > 0) {
        enemies.sort((a, b) => a.currentHp - b.currentHp || b.currentAtk - a.currentAtk);
        const target = enemies[0];
        dealEffectDamageToUnit(next, target, 2, info.name);
        enemyState.hp = Math.max(0, enemyState.hp - 1);
        registerSovereignDamageForDomainConcentration(next, enemyActor, 1);
        addFeedback(next, `${enemyActor}-sovereign`, '-1🔥 Chama Soberana', 'damage');
        addLog(next, actor, 'spell', `Poder do Soberano [${info.name}] queimou [${target.card.name}] em 2🔥 e ${enemyState.name} em 1🔥!`);
      } else {
        enemyState.hp = Math.max(0, enemyState.hp - 3);
        registerSovereignDamageForDomainConcentration(next, enemyActor, 3);
        addFeedback(next, `${enemyActor}-sovereign`, '-3🔥 Chama Soberana', 'damage');
        addLog(next, actor, 'spell', `Poder do Soberano [${info.name}] atingiu ${enemyState.name} em 3 de dano!`);
      }
      break;
    }
    case 'blue': {
      const enemies = getAllBoardUnits(enemyState).filter((u) => !u.isTrap && !u.isFrozen && u.card.type === 'creature');
      if (enemies.length > 0) {
        enemies.sort((a, b) => b.currentAtk - a.currentAtk);
        const target = enemies[0];
        target.isFrozen = true;
        dealEffectDamageToUnit(next, target, 2, info.name);
        addFeedback(next, target.instanceId, '❄️ Congelado (-2)!', 'freeze');
        addLog(next, actor, 'spell', `Poder do Soberano [${info.name}] congelou [${target.card.name}] e causou 2❄️ de dano!`);
      } else {
        enemyState.hp = Math.max(0, enemyState.hp - 2);
        registerSovereignDamageForDomainConcentration(next, enemyActor, 2);
        addFeedback(next, `${enemyActor}-sovereign`, '-2❄️ Pulso Rúnico', 'damage');
      }
      const allies = getAllBoardUnits(actorState).filter((u) => u.card.type === 'creature' && !u.isTrap);
      if (allies.length > 0) {
        allies.sort((a, b) => b.currentAtk - a.currentAtk);
        allies[0].currentAtk += 1;
        allies[0].maxHp += 1;
        allies[0].currentHp += 1;
        addFeedback(next, allies[0].instanceId, '+1⚔️/+1❤️ Pulso Rúnico', 'buff');
      } else {
        drawCardsForActor(next, actor, 1);
      }
      break;
    }
    case 'purple': {
      const enemies = getAllBoardUnits(enemyState).filter((u) => !u.isTrap && u.card.type === 'creature');
      if (enemies.length > 0) {
        enemies.sort((a, b) => a.currentHp - b.currentHp || b.currentAtk - a.currentAtk);
        const target = enemies[0];
        dealEffectDamageToUnit(next, target, 2, info.name);
        actorState.hp = Math.min(actorState.maxHp, actorState.hp + 2);
        actorState.corruption = Math.min(10, actorState.corruption + 1);
        addFeedback(next, `${actor}-sovereign`, '+2❤️ Dreno Umbroso', 'heal');
        addLog(next, actor, 'spell', `Poder do Soberano [${info.name}] drenou 2💀 de [${target.card.name}] e curou +2❤️!`);
      } else {
        enemyState.hp = Math.max(0, enemyState.hp - 2);
        registerSovereignDamageForDomainConcentration(next, enemyActor, 2);
        actorState.hp = Math.min(actorState.maxHp, actorState.hp + 2);
        actorState.corruption = Math.min(10, actorState.corruption + 1);
        addFeedback(next, `${enemyActor}-sovereign`, '-2💀 Dreno Umbroso', 'damage');
        addFeedback(next, `${actor}-sovereign`, '+2❤️ Dreno Umbroso', 'heal');
        addLog(next, actor, 'spell', `Poder do Soberano [${info.name}] drenou 2 de Vida de ${enemyState.name}!`);
      }
      break;
    }
    case 'green': {
      const allies = getAllBoardUnits(actorState).filter((u) => u.card.type === 'creature' && !u.isTrap);
      if (allies.length > 0) {
        allies.sort((a, b) => b.currentAtk - a.currentAtk);
        const ally = allies[0];
        ally.currentAtk += 1;
        ally.maxHp += 2;
        ally.currentHp += 2;
        addFeedback(next, ally.instanceId, '+1⚔️ / +2❤️ Rugido!', 'buff');
        addLog(next, actor, 'spell', `Poder do Soberano [${info.name}] fortaleceu [${ally.card.name}] (+1 ATQ / +2 VID)!`);
      } else {
        actorState.hp = Math.min(actorState.maxHp, actorState.hp + 3);
        addFeedback(next, `${actor}-sovereign`, '+3❤️ Regeneração Selvagem', 'heal');
        addLog(next, actor, 'spell', `Poder do Soberano [${info.name}] regenerou +3❤️ de ${actorState.name}!`);
      }
      break;
    }
    case 'gold': {
      const allies = getAllBoardUnits(actorState).filter((u) => u.card.type === 'creature' && !u.isTrap);
      if (allies.length > 0) {
        allies.sort((a, b) => (a.currentHp / a.maxHp) - (b.currentHp / b.maxHp));
        const ally = allies[0];
        ally.currentArmor += 1;
        ally.maxHp += 1;
        ally.currentHp = Math.min(ally.maxHp, ally.currentHp + 2);
        addFeedback(next, ally.instanceId, '+1🛡️/+2❤️ Baluarte!', 'shield');
        addLog(next, actor, 'spell', `Poder do Soberano [${info.name}] blindou [${ally.card.name}] (+1 ARM / +2 VID)!`);
      } else {
        actorState.hp = Math.min(actorState.maxHp, actorState.hp + 3);
        addFeedback(next, `${actor}-sovereign`, '+3❤️ Égide Imperial', 'heal');
        addLog(next, actor, 'spell', `Poder do Soberano [${info.name}] restaurou +3❤️ de ${actorState.name}!`);
      }
      break;
    }
  }

  recalculateFormationBonuses(next);
  cleanupDeadUnits(next);
  return next;
}

export function canPlayCard(
  state: GameState,
  actor: 'player' | 'ai',
  card: CardDefinition
): { allowed: boolean; reason?: string } {
  if (state.phase === 'gameover') {
    return { allowed: false, reason: 'A partida já terminou.' };
  }
  if (state.activePlayer !== actor && actor === 'player') {
    return { allowed: false, reason: 'Não é o seu turno.' };
  }

  const actorState = state[actor];

  if (actorState.currentEssence < card.cost) {
    return {
      allowed: false,
      reason: `Essência insuficiente (${actorState.currentEssence}/${card.cost}).`,
    };
  }

  if (card.domain !== 'neutral' && card.affinityReq > 0) {
    const colored: Exclude<Domain, 'neutral'>[] = ['red', 'blue', 'purple', 'green', 'gold'];
    let otherColored = 0;
    for (const d of colored) {
      if (d !== card.domain) {
        otherColored += actorState.affinities[d] ?? 0;
      }
    }
    const domainAff =
      actorState.affinities[card.domain] +
      Math.ceil(otherColored * 0.65);
    if (domainAff < card.affinityReq) {
      return {
        allowed: false,
        reason: `Afinidade insuficiente (${domainAff}/${card.affinityReq}).`,
      };
    }
  }

  if (card.type === 'creature') {
    let hasSpace = false;
    for (let i = 0; i < BOARD_COLS; i++) {
      if (canDeployToSlot(actorState, 'vanguard', i) || canDeployToSlot(actorState, 'rearguard', i)) {
        hasSpace = true;
        break;
      }
    }
    if (!hasSpace) {
      return {
        allowed: false,
        reason: `Tabuleiro cheio! Todos os slots atingiram o limite de ${MAX_UNITS_PER_SLOT} cartas empilhadas.`,
      };
    }
  } else if (card.type === 'relic') {
    let hasRearSpace = false;
    for (let i = 0; i < BOARD_COLS; i++) {
      if (canDeployToSlot(actorState, 'rearguard', i)) {
        hasRearSpace = true;
        break;
      }
    }
    if (!hasRearSpace) {
      return {
        allowed: false,
        reason: `Retaguarda cheia! Todos os slots atingiram o limite de ${MAX_UNITS_PER_SLOT} cartas empilhadas.`,
      };
    }
  }

  return { allowed: true };
}

function findAvailableSlot(
  actorState: PlayerState,
  preferredRow: RowType,
  requestedRow?: RowType,
  requestedSlot?: number,
  forceRearguard?: boolean
): { row: RowType; slotIndex: number } | null {
  if (forceRearguard) {
    if (
      requestedSlot !== undefined &&
      requestedSlot >= 0 &&
      requestedSlot < BOARD_COLS &&
      canDeployToSlot(actorState, 'rearguard', requestedSlot)
    ) {
      return { row: 'rearguard', slotIndex: requestedSlot };
    }
    // Prefer an empty slot first, then any stackable slot (< MAX_UNITS_PER_SLOT)
    for (let i = 0; i < BOARD_COLS; i++) {
      if (getSlotUnits(actorState, 'rearguard', i).length === 0) {
        return { row: 'rearguard', slotIndex: i };
      }
    }
    for (let i = 0; i < BOARD_COLS; i++) {
      if (canDeployToSlot(actorState, 'rearguard', i)) {
        return { row: 'rearguard', slotIndex: i };
      }
    }
    return null;
  }

  const primaryRow: RowType = requestedRow ?? preferredRow;
  const secondaryRow: RowType = primaryRow === 'vanguard' ? 'rearguard' : 'vanguard';

  if (
    requestedSlot !== undefined &&
    requestedSlot >= 0 &&
    requestedSlot < BOARD_COLS &&
    canDeployToSlot(actorState, primaryRow, requestedSlot)
  ) {
    return { row: primaryRow, slotIndex: requestedSlot };
  }

  // 1. Prefer empty slot in primaryRow
  for (let i = 0; i < BOARD_COLS; i++) {
    if (getSlotUnits(actorState, primaryRow, i).length === 0) {
      return { row: primaryRow, slotIndex: i };
    }
  }

  // 2. Prefer stackable slot in primaryRow (< MAX_UNITS_PER_SLOT)
  for (let i = 0; i < BOARD_COLS; i++) {
    if (canDeployToSlot(actorState, primaryRow, i)) {
      return { row: primaryRow, slotIndex: i };
    }
  }

  // 3. Prefer empty slot in secondaryRow
  for (let i = 0; i < BOARD_COLS; i++) {
    if (getSlotUnits(actorState, secondaryRow, i).length === 0) {
      return { row: secondaryRow, slotIndex: i };
    }
  }

  // 4. Prefer stackable slot in secondaryRow (< MAX_UNITS_PER_SLOT)
  for (let i = 0; i < BOARD_COLS; i++) {
    if (canDeployToSlot(actorState, secondaryRow, i)) {
      return { row: secondaryRow, slotIndex: i };
    }
  }

  return null;
}

function createBoardUnit(
  card: CardDefinition,
  owner: 'player' | 'ai',
  row: RowType,
  slotIndex: number,
  corruptionAtkBonus: number
): BoardUnit {
  const isRelic = card.type === 'relic';
  const hasImpeto = card.keywords.includes('Ímpeto');
  const hasDivineShield = card.keywords.includes('Escudo Divino');

  return {
    instanceId: nextId(`unit-${owner}`),
    cardId: card.id,
    card,
    owner,
    row,
    slotIndex,
    currentAtk: isRelic ? 0 : Math.max(0, card.atk + corruptionAtkBonus),
    currentArmor: card.armor,
    currentHp: Math.max(1, card.hp),
    maxHp: Math.max(1, card.hp),
    keywords: [...card.keywords],
    regeneration: card.regeneration ?? 0,
    hasSummoningSickness: isRelic ? true : !hasImpeto,
    hasAttackedThisTurn: false,
    isFrozen: false,
    hasDivineShield,
    isAscended: false,
    hasRebornTriggered: false,
  };
}

function dealEffectDamageToUnit(
  state: GameState,
  target: BoardUnit,
  rawDamage: number,
  sourceLabel: string
): number {
  if (rawDamage <= 0 || target.currentHp <= 0) return 0;

  if (target.hasDivineShield) {
    target.hasDivineShield = false;
    addFeedback(state, target.instanceId, 'Escudo Quebrado!', 'shield');
    addLog(
      state,
      'system',
      'effect',
      `Escudo Divino de [${target.card.name}] absorveu o dano de ${sourceLabel}!`
    );
    return 0;
  }

  const dmgAfterArmor =
    target.currentArmor < rawDamage
      ? Math.max(1, rawDamage - Math.floor(target.currentArmor / 2))
      : Math.max(1, rawDamage - target.currentArmor);

  if (dmgAfterArmor <= 0) {
    addFeedback(state, target.instanceId, '0 (Armadura)', 'shield');
    return 0;
  }

  target.currentHp -= dmgAfterArmor;
  addFeedback(state, target.instanceId, `-${dmgAfterArmor}`, 'damage');

  return dmgAfterArmor;
}

function createTokenDefinition(domain: Domain, atk: number, hp: number): CardDefinition {
  const tokenNames: Record<Domain, string> = {
    red: 'Cria Dracônica',
    blue: 'Elemental de Geada',
    purple: 'Sombra Faminta',
    green: 'Cria da Selva',
    gold: 'Sentinela de Ferro',
    neutral: 'Constructo Etéreo',
  };

  const tokenImages: Record<Domain, string> = {
    red: '/assets/cards/red_39_elemental_magma.png',
    blue: '/assets/cards/blue_39_elemental_gelo.png',
    purple: '/assets/cards/purple_38_espectro_faminto.png',
    green: '/assets/cards/green_37_lobo_atroz.png',
    gold: '/assets/cards/gold_05_automato_guardiao.png',
    neutral: '/assets/cards/neutral_31_automato_explorado.png',
  };

  return {
    id: `token_${domain}_${atk}_${hp}`,
    name: tokenNames[domain] ?? 'Espírito Invocado',
    originalInspiration: 'Token Invocado',
    ipSafeNotes: 'Unidade gerada por efeito mágico',
    domain,
    type: 'creature',
    subtype: 'Invocação',
    rarity: 'common',
    cost: 1,
    affinityReq: 0,
    atk,
    armor: 0,
    hp,
    preferredRow: 'vanguard',
    keywords: [],
    effects: [],
    description: 'Unidade invocada em batalha.',
    flavorText: 'Moldado a partir da pura essência elemental.',
    imagePath: tokenImages[domain] ?? '/assets/cards/neutral_31_automato_explorado.png',
    aiArtPrompt: 'Elemental summoned token creature',
  };
}

function executeCardEffect(
  state: GameState,
  actor: 'player' | 'ai',
  sourceCard: CardDefinition,
  effect: CardEffect,
  options?: { targetId?: string; sourceInstanceId?: string; spellDamageBonus?: number }
): void {
  const enemyActor: 'player' | 'ai' = actor === 'player' ? 'ai' : 'player';
  const actorState = state[actor];
  const enemyState = state[enemyActor];
  const bonusDmg = options?.spellDamageBonus ?? 0;

  switch (effect.type) {
    case 'damage_enemy_row': {
      const dmg = effect.value + bonusDmg;
      let targetRowName: RowType = 'vanguard';
      if (options?.targetId) {
        const found = findUnitOnBoard(state, options.targetId);
        if (found && found.owner === enemyActor) {
          targetRowName = found.row;
        }
      } else if (getRowUnits(enemyState, 'vanguard').filter((u) => !u.isTrap).length === 0) {
        targetRowName = 'rearguard';
      }

      const rowUnits = getRowUnits(enemyState, targetRowName).filter((u) => !u.isTrap);
      for (const unit of rowUnits) {
        dealEffectDamageToUnit(state, unit, dmg, sourceCard.name);
      }
      addLog(
        state,
        actor,
        'effect',
        `[${sourceCard.name}] varreu a fileira inimiga em área causando ${dmg} de dano a todas as cartas nos slots (${rowUnits.length} atingida(s))!`
      );
      break;
    }

    case 'damage_single_enemy': {
      const dmg = effect.value + bonusDmg;
      let targetUnit: BoardUnit | null = null;

      if (options?.targetId) {
        const found = findUnitOnBoard(state, options.targetId);
        if (
          found &&
          found.owner === enemyActor &&
          !(state.roundSubPhase === 'deploy' && found.unit.isConcealedDeploy)
        ) {
          targetUnit = found.unit;
        }
      }

      if (!targetUnit) {
        const allEnemies = getAllBoardUnits(enemyState).filter(
          (u) => !(state.roundSubPhase === 'deploy' && u.isConcealedDeploy)
        );
        if (allEnemies.length > 0) {
          allEnemies.sort((a, b) => b.currentAtk - a.currentAtk || a.currentHp - b.currentHp);
          targetUnit = allEnemies[0];
        }
      }

      if (targetUnit) {
        dealEffectDamageToUnit(state, targetUnit, dmg, sourceCard.name);
        addLog(
          state,
          actor,
          'effect',
          `[${sourceCard.name}] atingiu [${targetUnit.card.name}] com ${dmg} de dano!`
        );
      } else {
        enemyState.hp = Math.max(0, enemyState.hp - dmg);
        registerSovereignDamageForDomainConcentration(state, enemyActor, dmg);
        addFeedback(state, `${enemyActor}-sovereign`, `-${dmg}`, 'damage');
        addLog(
          state,
          actor,
          'effect',
          `[${sourceCard.name}] atingiu ${enemyState.name} diretamente com ${dmg} de dano!`
        );
      }
      break;
    }

    case 'damage_all_units': {
      const dmg = effect.value + bonusDmg;
      for (const owner of ['player', 'ai'] as const) {
        for (const unit of getAllBoardUnits(state[owner])) {
          if (unit.instanceId !== options?.sourceInstanceId) {
            dealEffectDamageToUnit(state, unit, dmg, sourceCard.name);
          }
        }
      }
      addLog(
        state,
        actor,
        'effect',
        `[${sourceCard.name}] desencadeou devastação em área (${dmg} de dano a todas as outras unidades)!`
      );
      break;
    }

    case 'damage_enemy_sovereign': {
      const dmg = effect.value + bonusDmg;
      enemyState.hp = Math.max(0, enemyState.hp - dmg);
      registerSovereignDamageForDomainConcentration(state, enemyActor, dmg);
      addFeedback(state, `${enemyActor}-sovereign`, `-${dmg}`, 'damage');
      addLog(
        state,
        actor,
        'effect',
        `[${sourceCard.name}] causou ${dmg} de dano direto a ${enemyState.name}!`
      );
      break;
    }

    case 'heal_sovereign': {
      const healAmount = effect.value;
      const before = actorState.hp;
      actorState.hp = Math.min(actorState.maxHp, actorState.hp + healAmount);
      const actualHeal = actorState.hp - before;
      addFeedback(state, `${actor}-sovereign`, `+${actualHeal || healAmount} Vida`, 'heal');
      addLog(
        state,
        actor,
        'effect',
        `[${sourceCard.name}] restaurou ${actualHeal || healAmount} de Vida de ${actorState.name}.`
      );
      break;
    }

    case 'heal_all_allies': {
      const healAmount = effect.value;
      for (const unit of getAllBoardUnits(actorState)) {
        unit.currentHp = Math.min(unit.maxHp, unit.currentHp + healAmount);
        addFeedback(state, unit.instanceId, `+${healAmount}`, 'heal');
      }
      actorState.hp = Math.min(actorState.maxHp, actorState.hp + healAmount);
      addFeedback(state, `${actor}-sovereign`, `+${healAmount}`, 'heal');
      addLog(
        state,
        actor,
        'effect',
        `[${sourceCard.name}] curou todos os aliados em +${healAmount} de Vida!`
      );
      break;
    }

    case 'heal_target_ally': {
      const healAmount = effect.value;
      let targetUnit: BoardUnit | null = null;
      if (options?.targetId) {
        const found = findUnitOnBoard(state, options.targetId);
        if (found && found.owner === actor) {
          targetUnit = found.unit;
        }
      }
      if (!targetUnit) {
        const allies = getAllBoardUnits(actorState);
        if (allies.length > 0) {
          allies.sort((a, b) => b.maxHp - b.currentHp - (a.maxHp - a.currentHp));
          targetUnit = allies[0];
        }
      }

      if (targetUnit) {
        targetUnit.currentHp = Math.min(targetUnit.maxHp, targetUnit.currentHp + healAmount);
        addFeedback(state, targetUnit.instanceId, `+${healAmount}`, 'heal');
        addLog(
          state,
          actor,
          'effect',
          `[${sourceCard.name}] curou [${targetUnit.card.name}] em +${healAmount} de Vida.`
        );
      } else {
        actorState.hp = Math.min(actorState.maxHp, actorState.hp + healAmount);
        addFeedback(state, `${actor}-sovereign`, `+${healAmount}`, 'heal');
      }
      break;
    }

    case 'draw_cards': {
      const count = Math.max(1, effect.value);
      drawCardsForActor(state, actor, count);
      addLog(
        state,
        actor,
        'effect',
        `[${sourceCard.name}] permitiu a ${actorState.name} comprar ${count} carta(s).`
      );
      break;
    }

    case 'freeze_enemy': {
      let targetUnit: BoardUnit | null = null;
      if (options?.targetId) {
        const found = findUnitOnBoard(state, options.targetId);
        if (found && found.owner === enemyActor) {
          targetUnit = found.unit;
        }
      }
      if (!targetUnit) {
        const enemies = getAllBoardUnits(enemyState).filter((u) => !u.isFrozen && u.card.type !== 'relic');
        const pool = enemies.length > 0 ? enemies : getAllBoardUnits(enemyState);
        if (pool.length > 0) {
          pool.sort((a, b) => b.currentAtk - a.currentAtk);
          targetUnit = pool[0];
        }
      }

      if (targetUnit) {
        targetUnit.isFrozen = true;
        addFeedback(state, targetUnit.instanceId, 'Congelado!', 'freeze');
        addLog(
          state,
          actor,
          'effect',
          `[${sourceCard.name}] congelou [${targetUnit.card.name}]!`
        );
      }
      break;
    }

    case 'freeze_enemy_vanguard': {
      const vanUnits = getRowUnits(enemyState, 'vanguard').filter((u) => !u.isTrap && !u.isFrozen);
      const rearUnits = getRowUnits(enemyState, 'rearguard').filter((u) => !u.isTrap && !u.isFrozen);
      const candidates = vanUnits.length > 0 ? vanUnits : rearUnits;
      candidates.sort((a, b) => b.currentAtk - a.currentAtk);
      const maxTargets = Math.max(3, effect.value > 1 ? effect.value * 2 : 3);
      for (const unit of candidates.slice(0, maxTargets)) {
        unit.isFrozen = true;
        addFeedback(state, unit.instanceId, 'Congelado!', 'freeze');
      }
      addLog(
        state,
        actor,
        'effect',
        `[${sourceCard.name}] congelou as cartas na linha de frente inimiga!`
      );
      break;
    }

    case 'bounce_enemy': {
      let targetFound: { unit: BoardUnit; row: RowType; slotIndex: number } | null = null;
      if (options?.targetId) {
        const found = findUnitOnBoard(state, options.targetId);
        if (found && found.owner === enemyActor) {
          targetFound = { unit: found.unit, row: found.row, slotIndex: found.slotIndex };
        }
      }
      if (!targetFound) {
        const enemies = getAllBoardUnits(enemyState);
        if (enemies.length > 0) {
          enemies.sort((a, b) => b.card.cost - a.card.cost || b.currentAtk - a.currentAtk);
          const pick = enemies[0];
          targetFound = { unit: pick, row: pick.row, slotIndex: pick.slotIndex };
        }
      }

      if (targetFound) {
        removeUnitFromBoard(enemyState, targetFound.unit.instanceId);
        if (enemyState.hand.length < 10) {
          enemyState.hand.push(targetFound.unit.card);
        } else {
          enemyState.crypt.push(targetFound.unit.card);
        }
        addLog(
          state,
          actor,
          'effect',
          `[${sourceCard.name}] devolveu [${targetFound.unit.card.name}] para a mão de ${enemyState.name}!`
        );
      }
      break;
    }

    case 'destroy_enemy': {
      let targetUnit: BoardUnit | null = null;
      if (options?.targetId) {
        const found = findUnitOnBoard(state, options.targetId);
        if (found && found.owner === enemyActor) {
          targetUnit = found.unit;
        }
      }
      if (!targetUnit) {
        const enemies = getAllBoardUnits(enemyState);
        if (enemies.length > 0) {
          enemies.sort((a, b) => b.currentAtk + b.currentHp - (a.currentAtk + a.currentHp));
          targetUnit = enemies[0];
        }
      }

      if (targetUnit) {
        targetUnit.hasDivineShield = false;
        targetUnit.currentHp = 0;
        addFeedback(state, targetUnit.instanceId, 'Destruído!', 'damage');
        addLog(
          state,
          actor,
          'effect',
          `[${sourceCard.name}] aniquilou [${targetUnit.card.name}]!`
        );
      }
      break;
    }

    case 'revive_from_crypt': {
      const creaturesInCrypt = actorState.crypt
        .map((c, idx) => ({ card: c, idx }))
        .filter((item) => item.card.type === 'creature');

      if (creaturesInCrypt.length > 0) {
        const maxCost = effect.value > 0 ? effect.value : 99;
        const eligible = creaturesInCrypt.filter((item) => item.card.cost <= maxCost);
        const pool = eligible.length > 0 ? eligible : creaturesInCrypt;
        pool.sort((a, b) => b.card.cost - a.card.cost || b.card.atk - a.card.atk);

        const chosen = pool[0];
        const slot = findAvailableSlot(actorState, chosen.card.preferredRow);
        if (slot) {
          actorState.crypt.splice(chosen.idx, 1);
          const revivedUnit = createBoardUnit(chosen.card, actor, slot.row, slot.slotIndex, 0);
          addUnitToSlot(actorState, slot.row, slot.slotIndex, revivedUnit);
          addFeedback(state, revivedUnit.instanceId, 'Reanimado!', 'buff');
          addLog(
            state,
            actor,
            'effect',
            `[${sourceCard.name}] reanimou [${chosen.card.name}] da Cripta!`
          );
        }
      }
      break;
    }

    case 'buff_target_ally': {
      const atkBuff = effect.value;
      const hpBuff = effect.secondaryValue ?? effect.value;
      let targetUnit: BoardUnit | null = null;

      if (options?.targetId) {
        const found = findUnitOnBoard(state, options.targetId);
        if (found && found.owner === actor && found.unit.card.type === 'creature') {
          targetUnit = found.unit;
        }
      }
      if (!targetUnit) {
        const allies = getAllBoardUnits(actorState).filter(
          (u) => u.card.type === 'creature' && u.instanceId !== options?.sourceInstanceId
        );
        const fallbackAllies =
          allies.length > 0
            ? allies
            : getAllBoardUnits(actorState).filter((u) => u.card.type === 'creature');
        if (fallbackAllies.length > 0) {
          fallbackAllies.sort((a, b) => b.currentAtk - a.currentAtk);
          targetUnit = fallbackAllies[0];
        }
      }

      if (targetUnit) {
        targetUnit.currentAtk += atkBuff;
        targetUnit.maxHp += hpBuff;
        targetUnit.currentHp += hpBuff;
        addFeedback(state, targetUnit.instanceId, `+${atkBuff}/+${hpBuff}`, 'buff');
        addLog(
          state,
          actor,
          'effect',
          `[${sourceCard.name}] fortaleceu [${targetUnit.card.name}] com +${atkBuff}/+${hpBuff}!`
        );
      }
      break;
    }

    case 'buff_all_allies': {
      const atkBuff = effect.value;
      const hpBuff = effect.secondaryValue ?? effect.value;
      const allies = getAllBoardUnits(actorState).filter((u) => u.card.type === 'creature');
      for (const unit of allies) {
        unit.currentAtk += atkBuff;
        unit.maxHp += hpBuff;
        unit.currentHp += hpBuff;
        addFeedback(state, unit.instanceId, `+${atkBuff}/+${hpBuff}`, 'buff');
      }
      if (allies.length > 0) {
        addLog(
          state,
          actor,
          'effect',
          `[${sourceCard.name}] concedeu +${atkBuff}/+${hpBuff} a todas as unidades aliadas!`
        );
      }
      break;
    }

    case 'debuff_enemy_vanguard_atk': {
      const debuff = effect.value;
      const targetUnits = getAllBoardUnits(enemyState);
      for (const unit of targetUnits) {
        unit.currentAtk = Math.max(0, unit.currentAtk - debuff);
        addFeedback(state, unit.instanceId, `-${debuff} ATQ`, 'freeze');
      }
      if (targetUnits.length > 0) {
        addLog(
          state,
          actor,
          'effect',
          `[${sourceCard.name}] reduziu o ATQ das tropas inimigas em -${debuff}!`
        );
      }
      break;
    }

    case 'grant_bonus_essence': {
      const bonus = Math.max(1, effect.value);
      actorState.currentEssence += bonus;
      if (effect.secondaryValue && effect.secondaryValue > 0) {
        actorState.maxEssence += effect.secondaryValue;
      }
      addFeedback(state, `${actor}-sovereign`, `+${bonus} Essência`, 'ess');
      addLog(
        state,
        actor,
        'effect',
        `[${sourceCard.name}] gerou +${bonus} de Essência extra neste turno!`
      );
      break;
    }

    case 'summon_token': {
      const tokenAtk = effect.secondaryValue ? effect.value : Math.max(1, effect.value || 2);
      const tokenHp = effect.secondaryValue ? effect.secondaryValue : Math.max(1, effect.value || 2);
      const count = effect.secondaryValue ? 1 : effect.value <= 2 ? effect.value : 1;

      for (let i = 0; i < count; i++) {
        const slot = findAvailableSlot(actorState, 'vanguard');
        if (!slot) break;
        const tokenDef = createTokenDefinition(sourceCard.domain, tokenAtk, tokenHp);
        const tokenUnit = createBoardUnit(tokenDef, actor, slot.row, slot.slotIndex, 0);
        addUnitToSlot(actorState, slot.row, slot.slotIndex, tokenUnit);
        consumeColumnRuneOnDeploy(state, actor, slot.row, slot.slotIndex, tokenUnit);
        addFeedback(state, tokenUnit.instanceId, 'Invocado!', 'buff');
        addLog(
          state,
          actor,
          'summon',
          `[${sourceCard.name}] invocou [${tokenDef.name} (${tokenAtk}/${tokenHp})]!`
        );
      }
      break;
    }

    case 'shield_all_allies': {
      const allies = getAllBoardUnits(actorState).filter((u) => u.card.type === 'creature');
      for (const unit of allies) {
        unit.hasDivineShield = true;
        if (effect.value > 0) {
          unit.currentArmor += effect.value;
        }
        addFeedback(state, unit.instanceId, 'Escudo Divino!', 'shield');
      }
      if (allies.length > 0) {
        addLog(
          state,
          actor,
          'effect',
          `[${sourceCard.name}] protegeu todos os aliados com Escudo Divino!`
        );
      }
      break;
    }

    case 'steal_small_enemy': {
      const maxAtk = effect.value > 0 ? effect.value : 3;
      let targetFound: { unit: BoardUnit; row: RowType; slotIndex: number } | null = null;

      if (options?.targetId) {
        const found = findUnitOnBoard(state, options.targetId);
        if (
          found &&
          found.owner === enemyActor &&
          found.unit.card.type === 'creature' &&
          found.unit.currentAtk <= maxAtk
        ) {
          targetFound = { unit: found.unit, row: found.row, slotIndex: found.slotIndex };
        }
      }

      if (!targetFound) {
        const candidates = getAllBoardUnits(enemyState).filter(
          (u) => u.card.type === 'creature' && u.currentAtk <= maxAtk
        );
        if (candidates.length > 0) {
          candidates.sort((a, b) => b.currentAtk + b.currentHp - (a.currentAtk + a.currentHp));
          const pick = candidates[0];
          targetFound = { unit: pick, row: pick.row, slotIndex: pick.slotIndex };
        }
      }

      if (targetFound) {
        const slot = findAvailableSlot(actorState, targetFound.unit.row);
        if (slot) {
          removeUnitFromBoard(enemyState, targetFound.unit.instanceId);
          const stolen = targetFound.unit;
          stolen.owner = actor;
          stolen.row = slot.row;
          stolen.slotIndex = slot.slotIndex;
          stolen.hasSummoningSickness = !stolen.keywords.includes('Ímpeto');
          addUnitToSlot(actorState, slot.row, slot.slotIndex, stolen);
          addFeedback(state, stolen.instanceId, 'Dominado!', 'buff');
          addLog(
            state,
            actor,
            'effect',
            `[${sourceCard.name}] dominou a mente de [${stolen.card.name}]!`
          );
        }
      }
      break;
    }
  }
}

function cleanupDeadUnits(state: GameState): void {
  // Loop in case on_death triggers cause further deaths
  let hadDeaths = true;
  let safetyCounter = 0;

  while (hadDeaths && safetyCounter < 10) {
    hadDeaths = false;
    safetyCounter += 1;

    const dyingQueue: { unit: BoardUnit; owner: 'player' | 'ai' }[] = [];

    for (const owner of ['player', 'ai'] as const) {
      const pState = state[owner];
      syncPlayerBoardSlots(pState);
      for (const row of ['vanguard', 'rearguard'] as const) {
        const stacks = row === 'vanguard' ? pState.vanguardStacks : pState.rearguardStacks;
        for (let i = 0; i < BOARD_COLS; i++) {
          const stack = stacks[i];
          for (let s = 0; s < stack.length; s++) {
            const unit = stack[s];
            if (unit && unit.currentHp <= 0) {
              // Check Renascer
              if (unit.keywords.includes('Renascer') && !unit.hasRebornTriggered) {
                unit.currentHp = 1;
                unit.hasRebornTriggered = true;
                unit.isFrozen = false;
                addFeedback(state, unit.instanceId, 'Renasceu (1 VID)!', 'heal');
                addLog(
                  state,
                  owner,
                  'effect',
                  `[${unit.card.name}] desafiou a morte e ativou Renascer com 1 de Vida!`
                );
              } else {
                stack.splice(s, 1);
                s--;
                if (!unit.card.id.startsWith('token_')) {
                  pState.crypt.push(unit.card);
                }
                dyingQueue.push({ unit, owner });
                hadDeaths = true;
              }
            }
          }
        }
      }
      syncPlayerBoardSlots(pState);
    }

    for (const { unit, owner } of dyingQueue) {
      addLog(state, owner, 'combat', `[${unit.card.name}] tombou e foi para a Cripta.`);
      for (const eff of unit.card.effects) {
        if (eff.trigger === 'on_death') {
          executeCardEffect(state, owner, unit.card, eff, {
            sourceInstanceId: unit.instanceId,
          });
        }
      }

      // Purple Biome Terrain Effect (Eco Necrótico): When an allied creature dies and Purple Terrain is awakened (3+), drain 1 HP from enemy Sovereign!
      if (unit.card.type === 'creature' && !unit.isTrap) {
        const ownerState = state[owner];
        const enemyOwner: 'player' | 'ai' = owner === 'player' ? 'ai' : 'player';
        const enemyState = state[enemyOwner];
        if (isDomainTerrainAwakened(ownerState, 'purple')) {
          enemyState.hp = Math.max(0, enemyState.hp - 1);
          addFeedback(state, `${enemyOwner}-sovereign`, '-1💀 Eco Necrótico', 'damage');
          addLog(
            state,
            owner,
            'effect',
            `Cenário [Cripta Abissal]: Eco Necrótico drenou 1❤️ de ${enemyState.name}!`
          );
        }

        // Boss Stage 4 Passive (Malakor — Colheita de Almas): Whenever a creature dies, Malakor heals +1 HP!
        if (state.bossId === 'boss_stage_4_lich_emperor' && state.ai.hp > 0) {
          state.ai.hp = Math.min(state.ai.maxHp, state.ai.hp + 1);
          addFeedback(state, 'ai-sovereign', '+1💀 Colheita de Almas', 'heal');
        }
      }
    }
  }

  recalculateFormationBonuses(state);
  checkWinCondition(state);
}

export function playCard(
  state: GameState,
  actor: 'player' | 'ai',
  handIndex: number,
  options?: { row?: RowType; slotIndex?: number; targetId?: string; asTrap?: boolean }
): GameState {
  if (state.phase === 'gameover' || (actor === 'player' && state.activePlayer !== 'player')) {
    return state;
  }

  const actorStateInitial = state[actor];
  if (handIndex < 0 || handIndex >= actorStateInitial.hand.length) {
    return state;
  }

  const cardToPlay = actorStateInitial.hand[handIndex];
  const check = canPlayCard(state, actor, cardToPlay);
  if (!check.allowed) {
    return state;
  }

  const next = cloneGameState(state);
  const actorState = next[actor];
  const enemyActor: 'player' | 'ai' = actor === 'player' ? 'ai' : 'player';
  const enemyState = next[enemyActor];

  const [card] = actorState.hand.splice(handIndex, 1);
  actorState.currentEssence -= card.cost;
  addFeedback(
    next,
    `${actor}-sovereign`,
    `-${card.cost}⚡ (${actorState.currentEssence}/${actorState.maxEssence})`,
    'ess'
  );

  // Process Corruption cost & Dark Power thresholds
  if (card.corruptionCost && card.corruptionCost > 0) {
    actorState.corruption = Math.min(10, actorState.corruption + card.corruptionCost);
    addLog(
      next,
      actor,
      'corruption',
      `${actorState.name} absorveu +${card.corruptionCost} de Corrupção (${actorState.corruption}/10).`
    );

    if (actorState.corruption >= 10) {
      actorState.hp = Math.max(0, actorState.hp - 2);
      addFeedback(next, `${actor}-sovereign`, '-2 Sobrecarga Abissal!', 'damage');
      addLog(
        next,
        actor,
        'corruption',
        `Sobrecarga Abissal (10/10)! ${actorState.name} sofreu 2 de dano de rebote sombrio!`
      );
    }
  }

  const hasDarkPower = actorState.corruption >= 5;
  const corruptionAtkBonus = hasDarkPower ? 1 : 0;
  const spellDamageBonus = hasDarkPower ? 1 : 0;

  let summonedInstanceId: string | undefined;

  if (card.type === 'creature' || card.type === 'relic') {
    const slot = findAvailableSlot(
      actorState,
      card.preferredRow,
      options?.row,
      options?.slotIndex,
      card.type === 'relic'
    );
    if (!slot) {
      return state;
    }

    const unit = createBoardUnit(card, actor, slot.row, slot.slotIndex, corruptionAtkBonus);

    // Campaign Boss Passives on AI Creature Summon
    if (actor === 'ai' && card.type === 'creature' && next.bossId) {
      if (next.bossId === 'boss_stage_1_goblin_king') {
        unit.regeneration += 1;
        addFeedback(next, unit.instanceId, '+1❤️ Regen (Passiva Chefe)', 'buff');
      } else if (next.bossId === 'boss_stage_3_solar_arbiter') {
        unit.currentArmor += 1;
        addFeedback(next, unit.instanceId, '+1🛡️ Égide (Passiva Chefe)', 'shield');
      } else if (next.bossId === 'boss_stage_5_crater_tyrant') {
        unit.currentAtk += 1;
        addFeedback(next, unit.instanceId, '+1⚔️ Fornalha (Passiva Chefe)', 'buff');
      }
    }

    addUnitToSlot(actorState, slot.row, slot.slotIndex, unit);
    consumeColumnRuneOnDeploy(next, actor, slot.row, slot.slotIndex, unit);
    summonedInstanceId = unit.instanceId;
    const newStackSize = getSlotUnits(actorState, slot.row, slot.slotIndex).length;

    const rowLabel = slot.row === 'vanguard' ? 'Vanguarda' : 'Retaguarda';
    addLog(
      next,
      actor,
      'summon',
      `${actorState.name} invocou [${card.name}] (Custo ${card.cost}⚡ → Restam ${actorState.currentEssence}/${actorState.maxEssence}⚡) na ${rowLabel} Coluna ${slot.slotIndex + 1}${
        newStackSize > 1 ? ` [Pilha ${newStackSize}/${MAX_UNITS_PER_SLOT}]` : ''
      }${corruptionAtkBonus > 0 ? ' (+1 ATQ do Pacto Abissal)' : ''}.`
    );

    if (card.breathDamage && card.breathDamage > 0) {
      const breathDmg = card.breathDamage + spellDamageBonus;
      const vanEnemies = getRowUnits(enemyState, 'vanguard').filter((u) => !u.isTrap);
      const rearEnemies = getRowUnits(enemyState, 'rearguard').filter((u) => !u.isTrap);
      const targetRowUnits = vanEnemies.length > 0 ? vanEnemies : rearEnemies;
      for (const enemyUnit of targetRowUnits) {
        dealEffectDamageToUnit(next, enemyUnit, breathDmg, `Sopro de ${card.name}`);
      }
      if (targetRowUnits.length > 0) {
        addLog(
          next,
          actor,
          'effect',
          `Sopro Elemental de [${card.name}] varreu a fileira inimiga causando ${breathDmg} de dano a todas as cartas empilhadas (${targetRowUnits.length} atingida(s))!`
        );
      }
    }

    const orderedOnEnter = [
      ...card.effects.filter((e) => e.trigger === 'on_enter' && e.type !== 'summon_token'),
      ...card.effects.filter((e) => e.trigger === 'on_enter' && e.type === 'summon_token'),
    ];
    for (const eff of orderedOnEnter) {
      executeCardEffect(next, actor, card, eff, {
        targetId: options?.targetId,
        sourceInstanceId: summonedInstanceId,
        spellDamageBonus,
      });
    }
  } else if (card.type === 'reaction' && options?.asTrap) {
    // 🪤 Armar Carta de Reação como Armadilha / Emboscada na Retaguarda!
    const slot = findAvailableSlot(
      actorState,
      'rearguard',
      'rearguard',
      options?.slotIndex,
      true
    );
    if (!slot) {
      return state;
    }
    const trapUnit = createBoardUnit(card, actor, 'rearguard', slot.slotIndex, 0);
    trapUnit.isTrap = true;
    trapUnit.currentAtk = 0;
    trapUnit.currentHp = 1;
    trapUnit.maxHp = 1;
    trapUnit.hasSummoningSickness = true;
    addUnitToSlot(actorState, 'rearguard', slot.slotIndex, trapUnit);

    addFeedback(next, trapUnit.instanceId, '🪤 Emboscada Armada!', 'shield');
    addLog(
      next,
      actor,
      'spell',
      `${actorState.name} armou a Reação [${card.name}] como Emboscada na Coluna ${
        slot.slotIndex + 1
      } da Retaguarda!`
    );
  } else {
    // Spell or Instant Reaction
    actorState.crypt.push(card);
    addLog(
      next,
      actor,
      'spell',
      `${actorState.name} conjurou [${card.name}] (Custo ${card.cost}⚡ → Restam ${actorState.currentEssence}/${actorState.maxEssence}⚡)${
        spellDamageBonus > 0 ? ' (Potencializado pelo Abismo +1)' : ''
      }!`
    );

    // Blue Biome Terrain Effect (Condutor Rúnico): Casting a spell when Blue Terrain is awakened (3+) grants +1 ATK and +1 HP to an allied creature!
    if (isDomainTerrainAwakened(actorState, 'blue')) {
      const alliedCreatures = getAllBoardUnits(actorState).filter(
        (u) => u.card.type === 'creature' && !u.isTrap
      );
      if (alliedCreatures.length > 0) {
        const targetAlly = alliedCreatures[0];
        targetAlly.currentAtk += 1;
        targetAlly.maxHp += 1;
        targetAlly.currentHp += 1;
        addFeedback(next, targetAlly.instanceId, '+1⚔️/+1❤️ Condutor Rúnico!', 'heal');
        addLog(
          next,
          actor,
          'effect',
          `Cenário [Santuário da Tempestade]: Condutor Rúnico concedeu +1⚔️/+1❤️ a [${targetAlly.card.name}]!`
        );
      }
    }

    if (card.breathDamage && card.breathDamage > 0) {
      const breathDmg = card.breathDamage + spellDamageBonus;
      const vanEnemies = getRowUnits(enemyState, 'vanguard').filter((u) => !u.isTrap);
      const rearEnemies = getRowUnits(enemyState, 'rearguard').filter((u) => !u.isTrap);
      const targetRowUnits = vanEnemies.length > 0 ? vanEnemies : rearEnemies;
      for (const enemyUnit of targetRowUnits) {
        dealEffectDamageToUnit(next, enemyUnit, breathDmg, card.name);
      }
    }

    const orderedSpellEffects = [
      ...card.effects.filter(
        (e) => (e.trigger === 'on_enter' || e.trigger === 'spell_cast') && e.type !== 'summon_token'
      ),
      ...card.effects.filter(
        (e) => (e.trigger === 'on_enter' || e.trigger === 'spell_cast') && e.type === 'summon_token'
      ),
    ];
    for (const eff of orderedSpellEffects) {
      executeCardEffect(next, actor, card, eff, {
        targetId: options?.targetId,
        spellDamageBonus,
      });
    }

    // Trigger spell_cast listeners on friendly board units (e.g., Arcanists / Relics)
    for (const boardUnit of getAllBoardUnits(actorState)) {
      for (const eff of boardUnit.card.effects) {
        if (eff.trigger === 'spell_cast') {
          executeCardEffect(next, actor, boardUnit.card, eff, {
            targetId: options?.targetId,
            sourceInstanceId: boardUnit.instanceId,
          });
        }
      }
    }
  }

  cleanupDeadUnits(next);
  return next;
}

export function canAscendUnit(
  state: GameState,
  actor: 'player' | 'ai',
  instanceId: string
): boolean {
  if (state.phase === 'gameover' || (actor === 'player' && state.activePlayer !== 'player')) {
    return false;
  }

  const found = findUnitOnBoard(state, instanceId);
  if (!found || found.owner !== actor) {
    return false;
  }

  const { unit } = found;
  if (unit.isAscended || !unit.card.ascension) {
    return false;
  }

  const actorState = state[actor];
  return actorState.currentEssence >= unit.card.ascension.cost;
}

export function ascendUnit(
  state: GameState,
  actor: 'player' | 'ai',
  instanceId: string
): GameState {
  if (!canAscendUnit(state, actor, instanceId)) {
    return state;
  }

  const next = cloneGameState(state);
  const found = findUnitOnBoard(next, instanceId);
  if (!found) return state;

  const { unit } = found;
  const spec = unit.card.ascension!;
  const actorState = next[actor];

  actorState.currentEssence -= spec.cost;

  const hpGain = Math.max(1, spec.newMaxHp - unit.maxHp);
  unit.isAscended = true;
  unit.currentAtk = Math.max(unit.currentAtk, spec.newAtk);
  unit.currentArmor = Math.max(unit.currentArmor, spec.newArmor);
  unit.maxHp = spec.newMaxHp;
  unit.currentHp = Math.min(unit.maxHp, unit.currentHp + hpGain);

  for (const kw of spec.addedKeywords) {
    if (!unit.keywords.includes(kw)) {
      unit.keywords.push(kw);
    }
    if (kw === 'Escudo Divino') {
      unit.hasDivineShield = true;
    }
    if (kw === 'Ímpeto') {
      unit.hasSummoningSickness = false;
    }
  }

  recalculateFormationBonuses(next);
  addFeedback(next, unit.instanceId, `Ascensão: ${spec.newName}!`, 'buff');
  addLog(
    next,
    actor,
    'summon',
    `[${unit.card.name}] ascendeu para [${spec.newName}] (${unit.currentAtk}/${unit.currentHp}, ARM ${unit.currentArmor})!`
  );

  return next;
}

export function getValidAttackTargets(
  state: GameState,
  attackerInstanceId: string,
  ignoreTurnOwner = false
): string[] {
  if (state.phase === 'gameover') return [];

  const found = findUnitOnBoard(state, attackerInstanceId);
  if (!found) {
    return [];
  }
  if (!ignoreTurnOwner && found.owner !== state.activePlayer) {
    return [];
  }

  const attacker = found.unit;

  // Regra Crítica: Expansão de Domínio NÃO anula efeitos/condições sobre as cartas!
  // Criaturas congeladas/paralisadas, sem ATQ ou exaustas (sem Ímpeto) não atacam!
  if (
    attacker.card.type === 'relic' ||
    attacker.isFrozen ||
    attacker.currentAtk <= 0 ||
    attacker.hasAttackedThisTurn
  ) {
    return [];
  }

  const hasImpeto = attacker.keywords.includes('Ímpeto');
  if (attacker.hasSummoningSickness && !hasImpeto) {
    return [];
  }

  const enemyActor: 'player' | 'ai' = found.owner === 'player' ? 'ai' : 'player';
  const enemyState = state[enemyActor];
  const enemySovereignId = `${enemyActor}-sovereign`;

  const enemyVanguard = getRowUnits(enemyState, 'vanguard').filter(
    (u) => !u.isTrap && !u.isConcealedDeploy
  );
  const enemyRearguard = getRowUnits(enemyState, 'rearguard').filter(
    (u) => !u.isTrap && !u.isConcealedDeploy
  );
  const allEnemyUnits = [...enemyVanguard, ...enemyRearguard];

  // ⛩️ ACERTO GARANTIDO (EXPANSÃO DE DOMÍNIO ATIVA E SEM CONTRAMEDIDA):
  // Atravessa todas as defesas, Vanguarda e Guardiões para atingir diretamente o Soberano adversário (ou qualquer unidade)!
  if (isSureHitActiveFor(state, found.owner)) {
    return [enemySovereignId, ...allEnemyUnits.map((u) => u.instanceId)];
  }

  const attackerHasVoo = attacker.keywords.includes('Voo');
  const attackerHasAlcance = attacker.keywords.includes('Alcance');

  if (attackerHasVoo) {
    // Flying units are only blocked by enemy Guardião with Voo
    const flyingGuardians = allEnemyUnits.filter(
      (u) => u.keywords.includes('Guardião') && u.keywords.includes('Voo')
    );
    if (flyingGuardians.length > 0) {
      return flyingGuardians.map((u) => u.instanceId);
    }
    const targets = allEnemyUnits.map((u) => u.instanceId);
    if (!attacker.hasSummoningSickness || hasImpeto) {
      targets.push(enemySovereignId);
    }
    return targets;
  }

  if (attackerHasAlcance) {
    // Ranged units can hit flying or ground units; if enemy Vanguard has Guardião, must target Guardião first
    const vanguardGuardians = enemyVanguard.filter((u) => u.keywords.includes('Guardião'));
    if (vanguardGuardians.length > 0) {
      return vanguardGuardians.map((u) => u.instanceId);
    }
    const targets = allEnemyUnits.map((u) => u.instanceId);
    if (!attacker.hasSummoningSickness || hasImpeto) {
      targets.push(enemySovereignId);
    }
    return targets;
  }

  // Ground melee attacker (neither Voo nor Alcance)
  const col = attacker.slotIndex;
  const groundVanguard = enemyVanguard.filter((u) => !u.keywords.includes('Voo'));
  const groundRearguard = enemyRearguard.filter((u) => !u.keywords.includes('Voo'));

  const targetSet = new Set<string>();

  if (attacker.row === 'vanguard') {
    const interceptingGuardians = [
      ...groundVanguard.filter((u) => u.keywords.includes('Guardião')),
      ...groundRearguard.filter(
        (u) => u.keywords.includes('Guardião') && Math.abs(u.slotIndex - col) <= 1
      ),
    ];
    if (interceptingGuardians.length > 0) {
      return interceptingGuardians.map((u) => u.instanceId);
    }

    const directColumnBlockers = [
      ...getSlotUnits(enemyState, 'vanguard', col),
      ...getSlotUnits(enemyState, 'rearguard', col),
    ].filter((u) => !u.isTrap && !u.isConcealedDeploy && !u.keywords.includes('Voo'));

    if (directColumnBlockers.length > 0) {
      for (const b of directColumnBlockers) {
        targetSet.add(b.instanceId);
      }
    } else if (!attacker.hasSummoningSickness || hasImpeto) {
      targetSet.add(enemySovereignId);
    }

    for (const ru of groundRearguard) {
      targetSet.add(ru.instanceId);
    }
    for (const vu of groundVanguard) {
      targetSet.add(vu.instanceId);
    }

    return Array.from(targetSet);
  }

  // Atacante está na RETAGUARDA
  const vanguardGuardians = groundVanguard.filter((u) => u.keywords.includes('Guardião'));
  if (vanguardGuardians.length > 0) {
    return vanguardGuardians.map((u) => u.instanceId);
  }

  for (const vu of groundVanguard) {
    targetSet.add(vu.instanceId);
  }

  const opposingVanGround = getSlotUnits(enemyState, 'vanguard', col).filter(
    (u) => !u.isTrap && !u.isConcealedDeploy && !u.keywords.includes('Voo')
  );
  if (opposingVanGround.length === 0) {
    const opposingRearGround = getSlotUnits(enemyState, 'rearguard', col).filter(
      (u) => !u.isTrap && !u.isConcealedDeploy && !u.keywords.includes('Voo')
    );
    if (opposingRearGround.length > 0) {
      for (const ru of opposingRearGround) {
        targetSet.add(ru.instanceId);
      }
    } else if (groundVanguard.length === 0 && (!attacker.hasSummoningSickness || hasImpeto)) {
      targetSet.add(enemySovereignId);
    }
  }

  if (groundVanguard.length === 0) {
    for (const ru of groundRearguard) {
      targetSet.add(ru.instanceId);
    }
  }

  return Array.from(targetSet);
}

export interface CombatPreviewResult {
  attackerId: string;
  targetId: string;
  isSovereignTarget: boolean;
  attackerName: string;
  targetName: string;
  damageToTarget: number;
  counterDamageToAttacker: number;
  targetHpBefore: number;
  targetHpAfter: number;
  attackerHpBefore: number;
  attackerHpAfter: number;
  targetDies: boolean;
  attackerDies: boolean;
  targetReborn: boolean;
  attackerReborn: boolean;
  breaksTargetShield: boolean;
  breaksAttackerShield: boolean;
  isRangedFreeHit: boolean;
  lethalTouchTriggeredOnTarget: boolean;
  lethalTouchTriggeredOnAttacker: boolean;
  trampleExcessDamage: number;
  slotSplashCount: number;
  slotSplashDamage: number;
  lifestealHealForAttacker: number;
  furiaCrescenteGainAttacker: number;
  furiaCrescenteGainTarget: number;
  incandescentSkinDamage: number;
  hasEnemyTrapRisk: boolean;
}

export function previewAttackOutcome(
  state: GameState,
  attackerInstanceId: string,
  targetId: string
): CombatPreviewResult | null {
  const validTargets = getValidAttackTargets(state, attackerInstanceId);
  if (!validTargets.includes(targetId)) {
    return null;
  }

  const attackerFound = findUnitOnBoard(state, attackerInstanceId);
  if (!attackerFound) return null;

  const { unit: attacker, owner: attackerOwner } = attackerFound;
  const defenderOwner: 'player' | 'ai' = attackerOwner === 'player' ? 'ai' : 'player';
  const defenderPlayer = state[defenderOwner];

  const attackerName =
    attacker.isAscended && attacker.card.ascension
      ? attacker.card.ascension.newName
      : attacker.card.name;

  // Check if enemy has an armed trap in this column or anywhere if attacking Sovereign
  let triggeredTrap =
    getSlotUnits(defenderPlayer, 'rearguard', attacker.slotIndex).find((u) => u.isTrap) ?? null;
  if (!triggeredTrap) {
    if (targetId === `${defenderOwner}-sovereign`) {
      triggeredTrap = getRowUnits(defenderPlayer, 'rearguard').find((u) => u.isTrap) ?? null;
    }
  }
  const hasEnemyTrapRisk = Boolean(triggeredTrap && triggeredTrap.isTrap);

  const isRangedFreeHit =
    attacker.row === 'rearguard' && attacker.keywords.includes('Alcance');

  if (targetId === `${defenderOwner}-sovereign`) {
    const dmg = Math.max(0, attacker.currentAtk);
    const targetHpBefore = defenderPlayer.hp;
    const targetHpAfter = Math.max(0, targetHpBefore - dmg);
    const lifestealHealForAttacker =
      attacker.keywords.includes('Dreno de Vida') && dmg > 0 ? 2 : 0;

    return {
      attackerId: attacker.instanceId,
      targetId,
      isSovereignTarget: true,
      attackerName,
      targetName: defenderPlayer.name,
      damageToTarget: dmg,
      counterDamageToAttacker: 0,
      targetHpBefore,
      targetHpAfter,
      attackerHpBefore: attacker.currentHp,
      attackerHpAfter: attacker.currentHp,
      targetDies: targetHpAfter <= 0,
      attackerDies: false,
      targetReborn: false,
      attackerReborn: false,
      breaksTargetShield: false,
      breaksAttackerShield: false,
      isRangedFreeHit,
      lethalTouchTriggeredOnTarget: false,
      lethalTouchTriggeredOnAttacker: false,
      trampleExcessDamage: 0,
      slotSplashCount: 0,
      slotSplashDamage: 0,
      lifestealHealForAttacker,
      furiaCrescenteGainAttacker: 0,
      furiaCrescenteGainTarget: 0,
      incandescentSkinDamage: 0,
      hasEnemyTrapRisk,
    };
  }

  const defenderFound = findUnitOnBoard(state, targetId);
  if (!defenderFound) return null;
  const { unit: defender } = defenderFound;
  const targetName =
    defender.isAscended && defender.card.ascension
      ? defender.card.ascension.newName
      : defender.card.name;

  const targetHpBefore = defender.currentHp;
  const attackerHpBefore = attacker.currentHp;

  const siblingUnitsInSlot = getSlotUnits(
    defenderPlayer,
    defender.row,
    defender.slotIndex
  ).filter((u) => u.instanceId !== defender.instanceId && !u.isTrap && u.currentHp > 0);

  let breaksTargetShield = false;
  let damageToTarget = 0;
  let lethalTouchTriggeredOnTarget = false;
  let trampleExcessDamage = 0;
  let slotSplashCount = 0;
  let slotSplashDamage = 0;

  // AoE on Slot: Attackers with Sopro Elemental (breathDamage > 0) splash all stacked cards in that slot!
  if (attacker.card.breathDamage && attacker.card.breathDamage > 0 && siblingUnitsInSlot.length > 0) {
    slotSplashCount = siblingUnitsInSlot.length;
    slotSplashDamage = attacker.card.breathDamage;
  }

  if (defender.hasDivineShield) {
    breaksTargetShield = true;
    damageToTarget = 0;
  } else {
    const rawAtk = attacker.currentAtk;
    const baseDmg =
      rawAtk > 0
        ? defender.currentArmor < rawAtk
          ? Math.max(1, rawAtk - defender.currentArmor)
          : 0
        : 0;

    damageToTarget = baseDmg;

    if (baseDmg > 0 && attacker.keywords.includes('Toque Letal')) {
      if (!isRangedFreeHit) {
        lethalTouchTriggeredOnTarget = true;
        damageToTarget = targetHpBefore;
      } else {
        damageToTarget = baseDmg + 1;
      }
    }

    if (baseDmg > targetHpBefore && attacker.keywords.includes('Atropelar')) {
      trampleExcessDamage = baseDmg - targetHpBefore;
      if (siblingUnitsInSlot.length > 0 && slotSplashCount === 0) {
        slotSplashCount = siblingUnitsInSlot.length;
        slotSplashDamage = trampleExcessDamage;
      }
    }
  }

  const lifestealHealForAttacker =
    !breaksTargetShield && damageToTarget > 0 && attacker.keywords.includes('Dreno de Vida')
      ? 1
      : 0;

  let breaksAttackerShield = false;
  let counterDamageToAttacker = 0;
  let lethalTouchTriggeredOnAttacker = false;
  let incandescentSkinDamage = 0;

  if (!isRangedFreeHit && defender.card.type !== 'relic') {
    const rawCounterAtk = defender.currentAtk;
    let shieldAvailable = attacker.hasDivineShield;

    if (rawCounterAtk > 0) {
      if (shieldAvailable) {
        breaksAttackerShield = true;
        shieldAvailable = false;
      } else {
        const dmgToAttacker =
          attacker.currentArmor < rawCounterAtk
            ? Math.max(1, rawCounterAtk - attacker.currentArmor)
            : 0;
        counterDamageToAttacker += dmgToAttacker;

        if (dmgToAttacker > 0 && defender.keywords.includes('Toque Letal')) {
          lethalTouchTriggeredOnAttacker = true;
          counterDamageToAttacker = attackerHpBefore;
        }
      }
    }

    const attackerHpAfterCounter = lethalTouchTriggeredOnAttacker
      ? 0
      : attackerHpBefore - counterDamageToAttacker;
    if (defender.keywords.includes('Pele Incandescente') && attackerHpAfterCounter > 0) {
      if (shieldAvailable) {
        breaksAttackerShield = true;
      } else {
        incandescentSkinDamage = 1;
        counterDamageToAttacker += 1;
      }
    }
  }

  const targetHpAfter = lethalTouchTriggeredOnTarget
    ? 0
    : Math.max(0, targetHpBefore - damageToTarget);
  const attackerHpAfter = lethalTouchTriggeredOnAttacker
    ? 0
    : Math.max(0, attackerHpBefore - counterDamageToAttacker);

  const targetDies = targetHpAfter <= 0;
  const attackerDies = attackerHpAfter <= 0;

  const targetReborn =
    targetDies && defender.keywords.includes('Renascer') && !defender.hasRebornTriggered;
  const attackerReborn =
    attackerDies && attacker.keywords.includes('Renascer') && !attacker.hasRebornTriggered;

  const furiaCrescenteGainTarget =
    !targetDies &&
    !breaksTargetShield &&
    damageToTarget > 0 &&
    defender.keywords.includes('Fúria Crescente')
      ? 2
      : 0;

  const furiaCrescenteGainAttacker =
    !attackerDies &&
    !isRangedFreeHit &&
    defender.currentAtk > 0 &&
    attacker.keywords.includes('Fúria Crescente')
      ? 2
      : 0;

  return {
    attackerId: attacker.instanceId,
    targetId,
    isSovereignTarget: false,
    attackerName,
    targetName,
    damageToTarget,
    counterDamageToAttacker,
    targetHpBefore,
    targetHpAfter,
    attackerHpBefore,
    attackerHpAfter,
    targetDies,
    attackerDies,
    targetReborn,
    attackerReborn,
    breaksTargetShield,
    breaksAttackerShield,
    isRangedFreeHit,
    lethalTouchTriggeredOnTarget,
    lethalTouchTriggeredOnAttacker,
    trampleExcessDamage,
    slotSplashCount,
    slotSplashDamage,
    lifestealHealForAttacker,
    furiaCrescenteGainAttacker,
    furiaCrescenteGainTarget,
    incandescentSkinDamage,
    hasEnemyTrapRisk,
  };
}

export function executeAttack(
  state: GameState,
  attackerInstanceId: string,
  targetId: string,
  options?: {
    isFirstStrikeWave?: boolean;
    deferCleanup?: boolean;
    allowZeroHpAttacker?: boolean;
  }
): GameState {
  const validTargets = getValidAttackTargets(state, attackerInstanceId, true);
  if (!validTargets.includes(targetId)) {
    return state;
  }

  const next = cloneGameState(state);
  const attackerFound = findUnitOnBoard(next, attackerInstanceId);
  if (!attackerFound) return state;

  const { unit: attacker, owner: attackerOwner } = attackerFound;
  if (!options?.allowZeroHpAttacker && attacker.currentHp <= 0) {
    return state;
  }

  const defenderOwner: 'player' | 'ai' = attackerOwner === 'player' ? 'ai' : 'player';
  const attackerPlayer = next[attackerOwner];
  const defenderPlayer = next[defenderOwner];

  attacker.hasAttackedThisTurn = true;
  attacker.hasSummoningSickness = false;
  attacker.plannedTargetId = null;

  // Trigger on_attack effects before combat resolution
  for (const eff of attacker.card.effects) {
    if (eff.trigger === 'on_attack') {
      executeCardEffect(next, attackerOwner, attacker.card, eff, {
        targetId,
        sourceInstanceId: attacker.instanceId,
      });
    }
  }

  const attackerDisplayName =
    attacker.isAscended && attacker.card.ascension
      ? attacker.card.ascension.newName
      : attacker.card.name;

  // === EMBOSCADA / ARMADILHA DE REAÇÃO ===
  let triggeredTrap =
    getSlotUnits(defenderPlayer, 'rearguard', attacker.slotIndex).find((u) => u.isTrap) ?? null;
  if (!triggeredTrap) {
    if (targetId === `${defenderOwner}-sovereign`) {
      triggeredTrap = getRowUnits(defenderPlayer, 'rearguard').find((u) => u.isTrap) ?? null;
    }
  }

  if (triggeredTrap && triggeredTrap.isTrap) {
    const trapCard = triggeredTrap.card;
    removeUnitFromBoard(defenderPlayer, triggeredTrap.instanceId);
    defenderPlayer.crypt.push(trapCard);

    addFeedback(next, attacker.instanceId, `Emboscada: ${trapCard.name}!`, 'damage');
    addLog(
      next,
      defenderOwner,
      'spell',
      `EMBOSCADA ATIVADA! [${trapCard.name}] surpreendeu [${attackerDisplayName}] antes do golpe!`
    );

    for (const eff of trapCard.effects) {
      executeCardEffect(next, defenderOwner, trapCard, eff, {
        targetId: attacker.instanceId,
        sourceInstanceId: triggeredTrap.instanceId,
      });
    }

    if (!options?.deferCleanup) {
      cleanupDeadUnits(next);
    }
    const stillAlive = findUnitOnBoard(next, attacker.instanceId);
    if (!stillAlive || stillAlive.unit.currentHp <= 0 || stillAlive.unit.isFrozen) {
      return next;
    }
  }

  // Case 1: Attacking Enemy Sovereign directly
  if (targetId === `${defenderOwner}-sovereign`) {
    const dmg = Math.max(0, attacker.currentAtk);
    defenderPlayer.hp = Math.max(0, defenderPlayer.hp - dmg);
    registerSovereignDamageForDomainConcentration(next, defenderOwner, dmg);
    const sureHitTag = isSureHitActiveFor(next, attackerOwner) ? ' [⛩️ Acerto Garantido!]' : '';
    addFeedback(next, targetId, `-${dmg}${sureHitTag ? ' ⛩️' : ''}`, 'damage');
    addLog(
      next,
      attackerOwner,
      'combat',
      `[${attackerDisplayName}] atacou ${defenderPlayer.name} causando ${dmg} de dano${sureHitTag}!`
    );

    if (attacker.keywords.includes('Dreno de Vida') && dmg > 0) {
      attackerPlayer.hp = Math.min(attackerPlayer.maxHp, attackerPlayer.hp + 2);
      addFeedback(next, `${attackerOwner}-sovereign`, '+2 Dreno de Vida', 'heal');
      addLog(
        next,
        attackerOwner,
        'effect',
        `Dreno de Vida de [${attackerDisplayName}] curou ${attackerPlayer.name} em +2!`
      );
    }

    if (!options?.deferCleanup) {
      cleanupDeadUnits(next);
    } else {
      checkWinCondition(next);
    }
    return next;
  }

  // Case 2: Attacking an Enemy BoardUnit (chosen individually from the slot stack!)
  const defenderFound = findUnitOnBoard(next, targetId);
  if (!defenderFound) {
    if (!options?.deferCleanup) {
      cleanupDeadUnits(next);
    }
    return next;
  }

  const { unit: defender } = defenderFound;
  const defenderDisplayName =
    defender.isAscended && defender.card.ascension
      ? defender.card.ascension.newName
      : defender.card.name;

  const siblingUnitsInSlot = getSlotUnits(
    defenderPlayer,
    defender.row,
    defender.slotIndex
  ).filter((u) => u.instanceId !== defender.instanceId && !u.isTrap && u.currentHp > 0);

  const defenderHpBefore = defender.currentHp;
  let actualDamageToDefender = 0;

  if (defender.hasDivineShield) {
    defender.hasDivineShield = false;
    addFeedback(next, defender.instanceId, 'Escudo Quebrado!', 'shield');
    addLog(
      next,
      attackerOwner,
      'combat',
      `[${attackerDisplayName}] atacou [${defenderDisplayName}], quebrando seu Escudo Divino!`
    );
  } else {
    const rawAtk = attacker.currentAtk;
    const dmgToDef =
      rawAtk > 0
        ? defender.currentArmor < rawAtk
          ? Math.max(1, rawAtk - defender.currentArmor)
          : 0
        : 0;

    actualDamageToDefender = dmgToDef;
    defender.currentHp -= dmgToDef;
    addFeedback(
      next,
      defender.instanceId,
      dmgToDef > 0 ? `-${dmgToDef}` : '0 (Armadura)',
      dmgToDef > 0 ? 'damage' : 'shield'
    );

    const isRangedShot =
      attacker.row === 'rearguard' && attacker.keywords.includes('Alcance');

    if (dmgToDef > 0 && attacker.keywords.includes('Toque Letal')) {
      if (!isRangedShot) {
        defender.currentHp = 0;
        addFeedback(next, defender.instanceId, 'Toque Letal!', 'damage');
        addLog(
          next,
          attackerOwner,
          'effect',
          `Toque Letal de [${attackerDisplayName}] executou [${defenderDisplayName}]!`
        );
      } else {
        defender.currentHp -= 1;
        addFeedback(next, defender.instanceId, '-1 (Veneno à Distância)', 'damage');
      }
    }

    // Overwhelm / Atropelar: Cleaves through other stacked cards in the same slot first, then hits Sovereign!
    if (
      dmgToDef > defenderHpBefore &&
      attacker.keywords.includes('Atropelar')
    ) {
      let remainingExcess = dmgToDef - defenderHpBefore;
      for (const sibling of siblingUnitsInSlot) {
        if (remainingExcess <= 0) break;
        const sibHpBefore = sibling.currentHp;
        const dealtToSib = dealEffectDamageToUnit(
          next,
          sibling,
          remainingExcess,
          `Atropelar de ${attackerDisplayName}`
        );
        remainingExcess = Math.max(0, remainingExcess - Math.max(1, dealtToSib || sibHpBefore));
      }
      if (remainingExcess > 0) {
        defenderPlayer.hp = Math.max(0, defenderPlayer.hp - remainingExcess);
        registerSovereignDamageForDomainConcentration(next, defenderOwner, remainingExcess);
        addFeedback(next, `${defenderOwner}-sovereign`, `-${remainingExcess} (Atropelar!)`, 'damage');
        addLog(
          next,
          attackerOwner,
          'combat',
          `Atropelar de [${attackerDisplayName}] varreu o slot e causou ${remainingExcess} de dano excedente a ${defenderPlayer.name}!`
        );
      } else if (siblingUnitsInSlot.length > 0) {
        addLog(
          next,
          attackerOwner,
          'combat',
          `Atropelar de [${attackerDisplayName}] atingiu as demais cartas empilhadas no slot!`
        );
      }
    }
  }

  // Attack Area Splash on Slot: Attackers with Sopro Elemental (breathDamage > 0) burn all other cards stacked in the target slot!
  if (attacker.card.breathDamage && attacker.card.breathDamage > 0 && siblingUnitsInSlot.length > 0) {
    const splashDmg = attacker.card.breathDamage;
    for (const sibling of siblingUnitsInSlot) {
      if (sibling.currentHp > 0) {
        dealEffectDamageToUnit(next, sibling, splashDmg, `Sopro de ${attackerDisplayName}`);
      }
    }
    addLog(
      next,
      attackerOwner,
      'effect',
      `Sopro de Combate de [${attackerDisplayName}] atingiu todas as cartas empilhadas no slot (${splashDmg} de dano em área)!`
    );
  }

  if (actualDamageToDefender > 0 && attacker.keywords.includes('Dreno de Vida')) {
    attackerPlayer.hp = Math.min(attackerPlayer.maxHp, attackerPlayer.hp + 1);
    addFeedback(next, `${attackerOwner}-sovereign`, '+1 Dreno de Vida', 'heal');
  }

  // Check if First-Strike Wave (Ímpeto) killed a non-Ímpeto defender before it could counter-attack!
  const killedBeforeCounterByFirstStrike =
    Boolean(options?.isFirstStrikeWave) &&
    attacker.keywords.includes('Ímpeto') &&
    !defender.keywords.includes('Ímpeto') &&
    defender.currentHp <= 0;

  if (killedBeforeCounterByFirstStrike) {
    addFeedback(next, defender.instanceId, '⚡ Abatido por Iniciativa!', 'damage');
    addLog(
      next,
      attackerOwner,
      'combat',
      `⚡ INICIATIVA DE ÍMPETO! [${attackerDisplayName}] abateu [${defenderDisplayName}] antes que pudesse contra-atacar!`
    );
  }

  // Counter-attack check: Ranged attackers in Rearguard with Alcance (or First-Strike lethal kills) do not suffer counter-attack!
  const isRangedFreeAttack =
    attacker.row === 'rearguard' && attacker.keywords.includes('Alcance');

  if (!isRangedFreeAttack && !killedBeforeCounterByFirstStrike && defender.card.type !== 'relic') {
    const rawCounterAtk = defender.currentAtk;
    if (rawCounterAtk > 0) {
      if (attacker.hasDivineShield) {
        attacker.hasDivineShield = false;
        addFeedback(next, attacker.instanceId, 'Escudo Quebrado!', 'shield');
      } else {
        const dmgToAttacker =
          attacker.currentArmor < rawCounterAtk
            ? Math.max(1, rawCounterAtk - attacker.currentArmor)
            : 0;

        attacker.currentHp -= dmgToAttacker;
        if (dmgToAttacker > 0) {
          addFeedback(next, attacker.instanceId, `-${dmgToAttacker}`, 'damage');
        }

        if (dmgToAttacker > 0 && defender.keywords.includes('Toque Letal')) {
          attacker.currentHp = 0;
          addFeedback(next, attacker.instanceId, 'Toque Letal!', 'damage');
        }

        if (dmgToAttacker > 0 && defender.keywords.includes('Dreno de Vida')) {
          defenderPlayer.hp = Math.min(defenderPlayer.maxHp, defenderPlayer.hp + 1);
          addFeedback(next, `${defenderOwner}-sovereign`, '+1 Dreno de Vida', 'heal');
        }
      }
    }

    // Pele Incandescente on defender deals +1 fire damage to melee attackers
    if (defender.keywords.includes('Pele Incandescente') && attacker.currentHp > 0) {
      if (attacker.hasDivineShield) {
        attacker.hasDivineShield = false;
        addFeedback(next, attacker.instanceId, 'Escudo Quebrado!', 'shield');
      } else {
        attacker.currentHp -= 1;
        addFeedback(next, attacker.instanceId, '-1 (Pele Incandescente)', 'damage');
      }
    }
  }

  // Fúria Crescente check for surviving units that took damage
  if (
    defender.currentHp > 0 &&
    actualDamageToDefender > 0 &&
    defender.keywords.includes('Fúria Crescente')
  ) {
    defender.currentAtk += 2;
    addFeedback(next, defender.instanceId, '+2 ATQ (Fúria!)', 'buff');
  }

  if (
    attacker.currentHp > 0 &&
    !isRangedFreeAttack &&
    !killedBeforeCounterByFirstStrike &&
    defender.currentAtk > 0 &&
    attacker.keywords.includes('Fúria Crescente')
  ) {
    attacker.currentAtk += 2;
    addFeedback(next, attacker.instanceId, '+2 ATQ (Fúria!)', 'buff');
  }

  if (!killedBeforeCounterByFirstStrike) {
    addLog(
      next,
      attackerOwner,
      'combat',
      `[${attackerDisplayName}] enfrentou [${defenderDisplayName}]${
        isRangedFreeAttack ? ' à distância (sem contra-ataque)' : ''
      }!`
    );
  }

  if (!options?.deferCleanup) {
    cleanupDeadUnits(next);
  } else {
    checkWinCondition(next);
  }
  return next;
}

export function endTurn(state: GameState): GameState {
  if (state.phase === 'gameover') {
    return state;
  }

  const next = cloneGameState(state);
  const endingActor = next.activePlayer;
  const endingPlayerState = next[endingActor];

  // 1. Run turn_end effects for active player's units & clear freeze on units that spent their turn frozen
  for (const unit of getAllBoardUnits(endingPlayerState)) {
    for (const eff of unit.card.effects) {
      if (eff.trigger === 'turn_end') {
        executeCardEffect(next, endingActor, unit.card, eff, {
          sourceInstanceId: unit.instanceId,
        });
      }
    }
    if (unit.isFrozen) {
      unit.isFrozen = false;
    }
  }

  cleanupDeadUnits(next);
  if (next.phase === 'gameover') {
    return next;
  }

  // 2. Switch activePlayer and increment turn when returning to 'player'
  const newActiveActor: 'player' | 'ai' = endingActor === 'player' ? 'ai' : 'player';
  next.activePlayer = newActiveActor;
  if (newActiveActor === 'player') {
    next.turn += 1;
    if (next.weather) {
      next.weather.turnsRemaining -= 1;
      if (next.weather.turnsRemaining <= 0) {
        addLog(
          next,
          'system',
          'turn',
          `🌤️ O evento climático [${next.weather.icon} ${next.weather.name}] dissipou-se da arena.`
        );
        next.weather = null;
      }
    }
    if (next.turn % 2 === 1 && (!next.columnRunes || next.columnRunes.length === 0)) {
      spawnColumnRuneIfNeeded(next);
    }
  } else if (next.turn === 1 || (next.turn % 2 === 0 && (!next.columnRunes || next.columnRunes.length === 0))) {
    spawnColumnRuneIfNeeded(next);
  }

  const newActiveState = next[newActiveActor];
  const opposingActor: 'player' | 'ai' = newActiveActor === 'player' ? 'ai' : 'player';
  const opposingState = next[opposingActor];

  if ((newActiveState.domainExhaustionTurns ?? 0) > 0) {
    newActiveState.domainExhaustionTurns = Math.max(0, (newActiveState.domainExhaustionTurns ?? 0) - 1);
  }
  newActiveState.hasUsedSimpleDomainThisTurn = false;

  if (next.domainExpansion && next.domainExpansion.owner === newActiveActor) {
    next.domainExpansion.turnsRemaining -= 1;
    next.domainExpansion.damageTakenByOwnerThisRound = 0;
    next.domainExpansion.simpleDomainProtectedActor = null;
    if (next.domainExpansion.turnsRemaining <= 0) {
      const expiredName = next.domainExpansion.name;
      next.domainExpansion = null;
      newActiveState.domainExhaustionTurns = 2;
      addLog(
        next,
        'system',
        'turn',
        `⛩️ A Expansão de Domínio [${expiredName}] de ${newActiveState.name} encerrou sua duração.`
      );
      recalculateFormationBonuses(next);
    } else if (!next.domainExpansion.clashRival) {
      applyDomainExpansionPulseEffects(
        next,
        next.domainExpansion.owner,
        next.domainExpansion.domain
      );
    }
  }

  // No Turno 1, o 2º jogador recebe +1⚡ de Essência Máxima de contra-iniciativa, mas a progressão automática de Afinidade ocorre a partir do Turno 2 para ambos os Soberanos em igualdade.
  const isSecondPlayerTurnOne = next.turn === 1 && newActiveActor === 'ai';
  if (newActiveState.maxEssence < MAX_ESSENCE_CAP) {
    newActiveState.maxEssence += 1;
  }
  if (!isSecondPlayerTurnOne) {
    const autoDomain = pickMostNeededColoredDomain(newActiveState);
    newActiveState.affinities[autoDomain] += 1;
  }
  newActiveState.currentEssence = newActiveState.maxEssence;
  newActiveState.hasChanneledThisTurn = false;
  newActiveState.hasMovedThisTurn = false;
  newActiveState.hasUsedSovereignPowerThisTurn = false;
  newActiveState.hasUsedBloodPactThisTurn = false;

  // Check if auto-affinity increase awakens an Arena Weather Event (disabled — only Domain Expansion modifies arena)
  checkAndTriggerArenaWeather(next, newActiveActor);

  // Trigger active Arena Weather start-of-turn effects
  if (next.weather) {
    const w = next.weather;
    if (w.type === 'ash_storm' && (w.owner === newActiveActor || w.owner === 'system')) {
      opposingState.hp = Math.max(0, opposingState.hp - 1);
      addFeedback(next, `${opposingActor}-sovereign`, '-1🌋 Cinzas Rubras', 'damage');
    } else if (w.type === 'astral_blizzard' && (w.owner === newActiveActor || w.owner === 'system')) {
      newActiveState.currentEssence += 1;
      addFeedback(next, `${newActiveActor}-sovereign`, '+1❄️ Nevasca Astral', 'ess');
      const enemies = getAllBoardUnits(opposingState).filter((u) => !u.isTrap && u.card.type === 'creature');
      if (enemies.length > 0) {
        enemies.sort((a, b) => b.currentAtk - a.currentAtk);
        enemies[0].currentAtk = Math.max(0, enemies[0].currentAtk - 1);
        addFeedback(next, enemies[0].instanceId, '-1⚔️ Nevasca', 'freeze');
      }
    } else if (w.type === 'umbral_eclipse' && (w.owner === newActiveActor || w.owner === 'system')) {
      opposingState.hp = Math.max(0, opposingState.hp - 1);
      newActiveState.hp = Math.min(newActiveState.maxHp, newActiveState.hp + 1);
      addFeedback(next, `${opposingActor}-sovereign`, '-1🌑 Eclipse Umbral', 'damage');
      addFeedback(next, `${newActiveActor}-sovereign`, '+1🌑 Eclipse Umbral', 'heal');
    } else if (w.type === 'sylvan_monsoon' && (w.owner === newActiveActor || w.owner === 'system')) {
      for (const ally of getAllBoardUnits(newActiveState)) {
        if (ally.card.type === 'creature' && !ally.isTrap) {
          if (ally.row === 'vanguard') {
            ally.maxHp += 1;
          }
          ally.currentHp = Math.min(ally.maxHp, ally.currentHp + 1);
          addFeedback(next, ally.instanceId, '+1🌿 Monção', 'heal');
        }
      }
    } else if (w.type === 'solar_zenith' && (w.owner === newActiveActor || w.owner === 'system')) {
      newActiveState.hp = Math.min(newActiveState.maxHp, newActiveState.hp + 1);
      addFeedback(next, `${newActiveActor}-sovereign`, '+1☀️ Zênite Solar', 'heal');
      const vanAllies = getRowUnits(newActiveState, 'vanguard').filter(
        (u) => u.card.type === 'creature' && !u.isTrap
      );
      if (vanAllies.length > 0) {
        vanAllies.sort((a, b) => b.currentAtk - a.currentAtk);
        vanAllies[0].currentArmor += 1;
        addFeedback(next, vanAllies[0].instanceId, '+1🛡️ Zênite Solar', 'shield');
      }
    } else if (w.type === 'astral_convergence') {
      newActiveState.currentEssence += 1;
      addFeedback(next, `${newActiveActor}-sovereign`, '+1🌀 Convergência', 'ess');
    }
  }

  // 3. Ready units, trigger regeneration and turn_start effects
  for (const unit of getAllBoardUnits(newActiveState)) {
    unit.hasSummoningSickness = false;
    unit.hasAttackedThisTurn = false;

    if (unit.regeneration > 0 && unit.currentHp < unit.maxHp) {
      const before = unit.currentHp;
      unit.currentHp = Math.min(unit.maxHp, unit.currentHp + unit.regeneration);
      const healed = unit.currentHp - before;
      if (healed > 0) {
        addFeedback(next, unit.instanceId, `+${healed} Regen`, 'heal');
      }
    }

    for (const eff of unit.card.effects) {
      if (eff.trigger === 'turn_start') {
        executeCardEffect(next, newActiveActor, unit.card, eff, {
          sourceInstanceId: unit.instanceId,
        });
      }
    }
  }

  // Efeito de Terreno Verde (Seiva Ancestral): cura +2❤️ nas 2 criaturas aliadas mais feridas no início do turno
  if (isDomainTerrainAwakened(newActiveState, 'green')) {
    const woundedAllies = getAllBoardUnits(newActiveState).filter(
      (u) => !u.isTrap && u.currentHp < u.maxHp
    );
    woundedAllies.sort((a, b) => a.currentHp - a.maxHp - (b.currentHp - b.maxHp));
    for (const targetUnit of woundedAllies.slice(0, 2)) {
      targetUnit.currentHp = Math.min(targetUnit.maxHp, targetUnit.currentHp + 2);
      addFeedback(next, targetUnit.instanceId, '🌲 +2❤️ (Seiva Ancestral)', 'heal');
    }
  }

  // Passivas de Início de Turno dos Chefes da Campanha (Estágios 2 e 6)
  if (newActiveActor === 'ai' && next.bossId) {
    if (next.bossId === 'boss_stage_2_storm_oracle') {
      const playerUnits = getAllBoardUnits(next.player).filter(
        (u) => !u.isTrap && !u.isFrozen && u.card.type === 'creature'
      );
      if (playerUnits.length > 0 && next.turn % 2 === 0) {
        const picked = playerUnits[0];
        picked.isFrozen = true;
        addFeedback(next, picked.instanceId, '❄️ Zero Absoluto!', 'freeze');
        addLog(
          next,
          'ai',
          'effect',
          `[Passiva de Chefe — Zero Absoluto] Zephyros congelou [${picked.card.name}]!`
        );
      }
    } else if (next.bossId === 'boss_stage_13_chronomancer') {
      // Thaddeus & Chronos, Senhores do Tempo: congela 1 inimigo em turnos pares e restaura +1❤️!
      newActiveState.hp = Math.min(newActiveState.maxHp, newActiveState.hp + 1);
      addFeedback(next, 'ai-sovereign', '+1⏳ Roda do Tempo', 'heal');
      const playerUnits = getAllBoardUnits(next.player).filter(
        (u) => !u.isTrap && !u.isFrozen && u.card.type === 'creature'
      );
      if (playerUnits.length > 0 && next.turn % 2 === 0) {
        const picked = playerUnits[0];
        picked.isFrozen = true;
        addFeedback(next, picked.instanceId, '⏳ Parar o Tempo!', 'freeze');
        addLog(
          next,
          'ai',
          'effect',
          `[Passiva de Chefe — Roda da Eternidade] Thaddeus & Chronos paralisaram [${picked.card.name}] no tempo!`
        );
      }
    } else if (
      next.bossId === 'boss_stage_6_valkyra' ||
      next.bossId === 'boss_stage_14_valkyra_eternal'
    ) {
      // Valkyra, Imperatriz Pentacromática: causa 1 de dano cromático e cura +1❤️ a cada turno!
      next.player.hp = Math.max(0, next.player.hp - 1);
      newActiveState.hp = Math.min(newActiveState.maxHp, newActiveState.hp + 1);
      addFeedback(next, 'player-sovereign', '-1🐉 Chama Pentacromática', 'damage');
      addFeedback(next, 'ai-sovereign', '+1🐉 Escama Imperial', 'heal');
      addLog(
        next,
        'ai',
        'effect',
        `[Passiva de Chefe — Convergência Pentacromática] Valkyra drenou 1❤️ de ${next.player.name}!`
      );
    }
  }

  // 4. Draw 1 card for new active player
  drawCardsForActor(next, newActiveActor, 1);

  addLog(
    next,
    newActiveActor,
    'turn',
    `Turno ${next.turn} — Vez de ${newActiveState.name} (${newActiveState.currentEssence}/${newActiveState.maxEssence} Essência).`
  );

  cleanupDeadUnits(next);
  return next;
}

export function clearFeedbacks(state: GameState): GameState {
  if (state.feedbacks.length === 0) return state;
  return {
    ...state,
    feedbacks: [],
  };
}

/**
 * ============================================================================
 * SISTEMA DE RODADAS EM FASES SIMULTÂNEAS (6 SOLUÇÕES TÁTICAS APROVADAS)
 * ============================================================================
 * - Fase 1 ('deploy'): Fase de Invocações Ocultas (Névoa de Guerra).
 *   Ambos os jogadores canalizam 1 carta e posicionam Criaturas, Relíquias e Emboscadas.
 *   As invocações da IA ficam ocultas (isConcealedDeploy = true) até o fim da Fase 1.
 *   - Problema 1: Criaturas sem Ímpeto entram em Postura de Guarda ('defend', +1🛡️ Armadura) na 1ª rodada.
 *     Criaturas com Ímpeto já podem atacar na Fase 2 da mesma rodada E atacam antes na Onda 2!
 *   - Problema 2: Efeitos on_enter de invocações ocultas disparam na revelação ao fim da Fase 1.
 *   - Problema 5: Disputa de Runas Táticas de Coluna resolvida na revelação por Velocidade de Batedor:
 *     (1º Ímpeto > 2º Menor Custo de Essência > 3º Token de Iniciativa da Rodada).
 * - Fase 2 ('combat_plan'): Planejamento de Combate, Defesas, Feitiços & Expansão de Domínio.
 *   - Problema 4: Unidades podem alternar entre 'attack' (⚔️ Atacar) e 'defend' (🛡️ Defender +1🛡️ e interceptação na coluna).
 *   - Problema 6: Posturas e alvos padrão inteligentes já vêm pré-selecionados para fluidez máxima.
 * - Resolução em 3 Ondas (resolveCombatPhaseAndAdvanceRound):
 *   - Onda 1: Feitiços, Poderes e Artefatos por Velocidade Arcana (1. Proteção/Cura ➔ 2. Controle/Congelar ➔ 3. Dano).
 *   - Onda 2: Iniciativa Rápida (Criaturas com Ímpeto atacam primeiro; se abaterem alvo sem Ímpeto, não sofrem contra-ataque).
 *   - Onda 3: Choque Simultâneo das demais criaturas sobreviventes, com Avanço Tático de Coluna (Problema 3) se o alvo original caiu antes!
 */

export function pickSmartDefaultTargetForUnit(
  state: GameState,
  attacker: BoardUnit
): string | null {
  const validTargets = getValidAttackTargets(state, attacker.instanceId, true);
  if (validTargets.length === 0) return null;

  const enemyOwner: 'player' | 'ai' = attacker.owner === 'player' ? 'ai' : 'player';
  const sovId = `${enemyOwner}-sovereign`;

  // If Sure-Hit from Domain Expansion is active or Sovereign is lethal, prioritize Sovereign!
  if (
    validTargets.includes(sovId) &&
    (isSureHitActiveFor(state, attacker.owner) || state[enemyOwner].hp <= attacker.currentAtk)
  ) {
    return sovId;
  }

  // Prefer enemy unit in the same column if valid
  for (const tid of validTargets) {
    if (tid === sovId) continue;
    const found = findUnitOnBoard(state, tid);
    if (found && found.slotIndex === attacker.slotIndex) {
      return tid;
    }
  }

  // Prefer Sovereign if open corridor
  if (validTargets.includes(sovId)) {
    return sovId;
  }

  return validTargets[0];
}

export function assignSmartDefaultCombatPlans(state: GameState): void {
  recalculateFormationBonuses(state);
  for (const owner of ['player', 'ai'] as const) {
    for (const unit of getAllBoardUnits(state[owner])) {
      if (unit.isTrap || unit.card.type === 'relic') {
        unit.stance = 'defend';
        unit.plannedTargetId = null;
        continue;
      }
      if (
        unit.hasSummoningSickness ||
        unit.isFrozen ||
        unit.currentAtk <= 0 ||
        unit.keywords.includes('Guardião')
      ) {
        // Problem 1 & 6: Summon-sick units without Ímpeto or pure 0-ATK / Guardião default to Defend (+1 Armor) unless toggled
        if (unit.hasSummoningSickness || unit.isFrozen || unit.currentAtk <= 0) {
          unit.stance = 'defend';
          unit.plannedTargetId = null;
          continue;
        }
      }
      if (!unit.stance) {
        unit.stance = 'attack';
      }
      if (unit.stance === 'attack') {
        const currentTargetValid =
          unit.plannedTargetId &&
          getValidAttackTargets(state, unit.instanceId, true).includes(unit.plannedTargetId);
        if (!currentTargetValid) {
          unit.plannedTargetId = pickSmartDefaultTargetForUnit(state, unit);
        }
      } else {
        unit.plannedTargetId = null;
      }
    }
  }
  recalculateFormationBonuses(state);
}

export function toggleUnitStance(
  state: GameState,
  actor: 'player' | 'ai',
  instanceId: string
): GameState {
  if (state.phase === 'gameover') return state;
  const next = cloneGameState(state);
  const found = findUnitOnBoard(next, instanceId);
  if (!found || found.owner !== actor) return state;

  const { unit } = found;
  if (unit.isTrap || unit.card.type === 'relic') return state;

  if (unit.hasSummoningSickness && !unit.keywords.includes('Ímpeto')) {
    unit.stance = 'defend';
    unit.plannedTargetId = null;
    recalculateFormationBonuses(next);
    return next;
  }

  if (unit.isFrozen) {
    return next;
  }

  if (unit.stance === 'defend') {
    unit.stance = 'attack';
    recalculateFormationBonuses(next);
    unit.plannedTargetId = pickSmartDefaultTargetForUnit(next, unit);
  } else {
    unit.stance = 'defend';
    unit.plannedTargetId = null;
    recalculateFormationBonuses(next);
  }

  // Re-validate opposing planned targets in case column interception changed
  for (const enemyUnit of getAllBoardUnits(next[actor === 'player' ? 'ai' : 'player'])) {
    if (enemyUnit.stance === 'attack' && enemyUnit.plannedTargetId) {
      const valid = getValidAttackTargets(next, enemyUnit.instanceId, true);
      if (!valid.includes(enemyUnit.plannedTargetId)) {
        enemyUnit.plannedTargetId = pickSmartDefaultTargetForUnit(next, enemyUnit);
      }
    }
  }

  return next;
}

export function setUnitAttackTarget(
  state: GameState,
  actor: 'player' | 'ai',
  attackerInstanceId: string,
  targetId: string
): GameState {
  if (state.phase === 'gameover') return state;
  const next = cloneGameState(state);
  const found = findUnitOnBoard(next, attackerInstanceId);
  if (!found || found.owner !== actor) return state;

  const { unit } = found;
  if (unit.isTrap || unit.card.type === 'relic' || unit.isFrozen) return state;
  if (unit.hasSummoningSickness && !unit.keywords.includes('Ímpeto')) return state;

  unit.stance = 'attack';
  recalculateFormationBonuses(next);

  const validTargets = getValidAttackTargets(next, attackerInstanceId, true);
  if (!validTargets.includes(targetId)) {
    return state;
  }

  unit.plannedTargetId = targetId;
  return next;
}

/**
 * Problema 3 — Avanço Tático de Coluna:
 * Se o alvo original planejado já morreu na Onda 1 (Feitiços) ou Onda 2 (Ímpeto),
 * redireciona automaticamente o golpe para o próximo inimigo válido naquela coluna ou para o Soberano!
 */
function resolveRedirectedTargetForAttacker(
  state: GameState,
  attacker: BoardUnit,
  originalPlannedTargetId: string | null | undefined,
  preferredColumn?: number
): string | null {
  const validTargets = getValidAttackTargets(state, attacker.instanceId, true);
  if (validTargets.length === 0) return null;

  if (originalPlannedTargetId && validTargets.includes(originalPlannedTargetId)) {
    return originalPlannedTargetId;
  }

  const enemyOwner: 'player' | 'ai' = attacker.owner === 'player' ? 'ai' : 'player';
  const sovId = `${enemyOwner}-sovereign`;

  if (isSureHitActiveFor(state, attacker.owner) && validTargets.includes(sovId)) {
    return sovId;
  }

  const colToSearch = preferredColumn ?? attacker.slotIndex;
  for (const tid of validTargets) {
    if (tid === sovId) continue;
    const found = findUnitOnBoard(state, tid);
    if (found && found.slotIndex === colToSearch) {
      return tid;
    }
  }

  if (validTargets.includes(sovId)) {
    return sovId;
  }

  return validTargets[0];
}

/**
 * Encerra a Fase 1 ('deploy' — Invocações Ocultas), executa as invocações da IA na Fase 1,
 * resolve disputas de Runas Táticas de Coluna por Velocidade de Batedor (Problema 5),
 * revela todas as invocações ocultas na Arena disparando seus efeitos on_enter (Problema 2),
 * e inicia a Fase 2 ('combat_plan' — Planejamento de Combate, Defesas e Feitiços).
 */
export function advanceToCombatPhase(
  state: GameState,
  aiDeployCallback?: (s: GameState) => GameState
): GameState {
  if (state.phase === 'gameover') return state;
  if (state.roundSubPhase === 'combat_plan') return state;

  let next = cloneGameState(state);

  // 1. Let AI perform its Phase 1 Channeling & Concealed Summons if callback provided
  if (aiDeployCallback) {
    next = cloneGameState(aiDeployCallback(next));
  }

  // 2. Problema 5: Resolve Column Runes on Revelation (Velocidade de Batedor: 1º Ímpeto > 2º Menor Custo > 3º Iniciativa)
  if (next.columnRunes && next.columnRunes.length > 0) {
    const runesCopy = [...next.columnRunes];
    for (const rune of runesCopy) {
      const col = rune.slotIndex;
      const playerCandidates = [
        ...getSlotUnits(next.player, 'vanguard', col),
        ...getSlotUnits(next.player, 'rearguard', col),
      ].filter((u) => !u.isTrap && u.card.type === 'creature' && u.isConcealedDeploy);

      const aiCandidates = [
        ...getSlotUnits(next.ai, 'vanguard', col),
        ...getSlotUnits(next.ai, 'rearguard', col),
      ].filter((u) => !u.isTrap && u.card.type === 'creature' && u.isConcealedDeploy);

      const pickFastestScout = (units: BoardUnit[]): BoardUnit | null => {
        if (units.length === 0) return null;
        const sorted = [...units].sort((a, b) => {
          const aImp = a.keywords.includes('Ímpeto') ? 1 : 0;
          const bImp = b.keywords.includes('Ímpeto') ? 1 : 0;
          if (aImp !== bImp) return bImp - aImp;
          return a.card.cost - b.card.cost;
        });
        return sorted[0];
      };

      const pScout = pickFastestScout(playerCandidates);
      const aScout = pickFastestScout(aiCandidates);

      if (pScout && !aScout) {
        consumeColumnRuneOnDeploy(next, 'player', pScout.row, col, pScout);
      } else if (aScout && !pScout) {
        consumeColumnRuneOnDeploy(next, 'ai', aScout.row, col, aScout);
      } else if (pScout && aScout) {
        const pImp = pScout.keywords.includes('Ímpeto');
        const aImp = aScout.keywords.includes('Ímpeto');
        let winnerOwner: 'player' | 'ai' = next.initiativePlayer ?? 'player';
        let tiebreakReason = 'Token de Iniciativa da Rodada';

        if (pImp !== aImp) {
          winnerOwner = pImp ? 'player' : 'ai';
          tiebreakReason = 'Velocidade de Ímpeto';
        } else if (pScout.card.cost !== aScout.card.cost) {
          winnerOwner = pScout.card.cost < aScout.card.cost ? 'player' : 'ai';
          tiebreakReason = `Menor Custo de Essência (${Math.min(pScout.card.cost, aScout.card.cost)}⚡)`;
        }

        const winnerUnit = winnerOwner === 'player' ? pScout : aScout;
        addLog(
          next,
          winnerOwner,
          'effect',
          `⚡ DISPUTA DE RUNA (Coluna ${col + 1}): [${winnerUnit.card.name}] venceu por ${tiebreakReason}!`
        );
        consumeColumnRuneOnDeploy(next, winnerOwner, winnerUnit.row, col, winnerUnit);
      }
    }
  }

  // 3. Problema 2: Reveal all Concealed Deployments & Trigger AI's deferred on_enter / breathDamage
  const newlyRevealedAiUnits: BoardUnit[] = [];
  for (const owner of ['player', 'ai'] as const) {
    for (const unit of getAllBoardUnits(next[owner])) {
      if (unit.isConcealedDeploy) {
        unit.isConcealedDeploy = false;
        if (owner === 'ai') {
          newlyRevealedAiUnits.push(unit);
        }
      }
    }
  }

  for (const aiUnit of newlyRevealedAiUnits) {
    const stillOnBoard = findUnitOnBoard(next, aiUnit.instanceId);
    if (!stillOnBoard) continue;
    const { unit } = stillOnBoard;
    const rowLabel = unit.row === 'vanguard' ? 'Vanguarda' : 'Retaguarda';
    const spellDamageBonus = next.ai.corruption >= 5 ? 1 : 0;

    addLog(
      next,
      'ai',
      'summon',
      `👁️ REVELAÇÃO: ${next.ai.name} revelou [${unit.card.name}] na ${rowLabel} Coluna ${unit.slotIndex + 1}!`
    );

    if (unit.card.breathDamage && unit.card.breathDamage > 0) {
      const breathDmg = unit.card.breathDamage + spellDamageBonus;
      const vanEnemies = getRowUnits(next.player, 'vanguard').filter((u) => !u.isTrap);
      const rearEnemies = getRowUnits(next.player, 'rearguard').filter((u) => !u.isTrap);
      const targetRowUnits = vanEnemies.length > 0 ? vanEnemies : rearEnemies;
      for (const enemyUnit of targetRowUnits) {
        dealEffectDamageToUnit(next, enemyUnit, breathDmg, `Sopro de ${unit.card.name}`);
      }
      if (targetRowUnits.length > 0) {
        addLog(
          next,
          'ai',
          'effect',
          `Sopro Elemental de [${unit.card.name}] varreu a fileira causando ${breathDmg} de dano (${targetRowUnits.length} atingida(s))!`
        );
      }
    }

    const orderedOnEnter = [
      ...unit.card.effects.filter((e) => e.trigger === 'on_enter' && e.type !== 'summon_token'),
      ...unit.card.effects.filter((e) => e.trigger === 'on_enter' && e.type === 'summon_token'),
    ];
    for (const eff of orderedOnEnter) {
      executeCardEffect(next, 'ai', unit.card, eff, {
        sourceInstanceId: unit.instanceId,
        spellDamageBonus,
      });
    }
  }

  cleanupDeadUnits(next);
  if (next.phase === 'gameover') {
    return next;
  }

  // 4. Transition to Phase 2 ('combat_plan') & pre-fill Smart Default Stances and Targets (Problema 6)
  next.roundSubPhase = 'combat_plan';
  next.activePlayer = 'player';
  assignSmartDefaultCombatPlans(next);

  addLog(
    next,
    'system',
    'turn',
    `⚔️ FASE 2 — PLANEJAMENTO DE COMBATE & FEITIÇOS: Escolha posturas (⚔️ Atacar / 🛡️ Defender +1🛡️), lance Feitiços ou Expansão de Domínio e clique em EXECUTAR COMBATE!`
  );

  return next;
}

/**
 * Executa a Resolução Ordenada em 3 Ondas da Fase 2:
 * - Onda 1: Feitiços, Artefatos, Poderes e Contramedidas por Velocidade Arcana (1. Proteção/Cura ➔ 2. Controle/Congelar ➔ 3. Dano)
 * - Onda 2: Iniciativa Rápida (Criaturas com Ímpeto atacam primeiro; se abaterem alvo sem Ímpeto, não sofrem contra-ataque)
 * - Onda 3: Choque Simultâneo das demais criaturas sobreviventes, com Avanço Tático de Coluna (Problema 3)
 * E em seguida avança para a próxima Rodada (Fase 1 'deploy').
 */
export function resolveCombatPhaseAndAdvanceRound(
  state: GameState,
  aiCombatPlanCallback?: (s: GameState) => GameState
): GameState {
  if (state.phase === 'gameover') return state;

  let next = cloneGameState(state);

  // =========================================================================
  // ONDA 1: FEITIÇOS, PODERES, ARTEFATOS & POSTURAS DA IA (VELOCIDADE ARCANA)
  // =========================================================================
  if (aiCombatPlanCallback) {
    next = cloneGameState(aiCombatPlanCallback(next));
  }
  cleanupDeadUnits(next);
  if (next.phase === 'gameover') {
    return next;
  }

  // Ensure all ready units have valid stances/targets after Wave 1 spells (e.g. if a spell froze or killed a target)
  recalculateFormationBonuses(next);

  // Helper to snapshot planned column for Tactical Column Redirection (Problema 3)
  const plannedColumnByAttackerId: Record<string, number> = {};
  for (const owner of ['player', 'ai'] as const) {
    for (const u of getAllBoardUnits(next[owner])) {
      if (u.plannedTargetId) {
        const foundTgt = findUnitOnBoard(next, u.plannedTargetId);
        plannedColumnByAttackerId[u.instanceId] = foundTgt ? foundTgt.slotIndex : u.slotIndex;
      } else {
        plannedColumnByAttackerId[u.instanceId] = u.slotIndex;
      }
    }
  }

  // =========================================================================
  // ONDA 2: INICIATIVA RÁPIDA (UNIDADES COM ÍMPETO) — PROBLEMA 1
  // =========================================================================
  const firstStrikeIds: string[] = [];
  const initActor: 'player' | 'ai' = next.initiativePlayer ?? 'player';
  const secondActor: 'player' | 'ai' = initActor === 'player' ? 'ai' : 'player';

  const getImpetoAttackers = (actor: 'player' | 'ai') =>
    getAllBoardUnits(next[actor])
      .filter(
        (u) =>
          !u.isTrap &&
          u.card.type === 'creature' &&
          u.stance !== 'defend' &&
          !u.hasSummoningSickness &&
          !u.hasAttackedThisTurn &&
          !u.isFrozen &&
          u.currentAtk > 0 &&
          u.keywords.includes('Ímpeto')
      )
      .sort((a, b) => b.currentAtk - a.currentAtk);

  const initImpeto = getImpetoAttackers(initActor);
  const secImpeto = getImpetoAttackers(secondActor);
  const maxImpLen = Math.max(initImpeto.length, secImpeto.length);
  for (let i = 0; i < maxImpLen; i++) {
    if (initImpeto[i]) firstStrikeIds.push(initImpeto[i].instanceId);
    if (secImpeto[i]) firstStrikeIds.push(secImpeto[i].instanceId);
  }

  if (firstStrikeIds.length > 0) {
    addLog(
      next,
      'system',
      'combat',
      `⚡ ONDA DE INICIATIVA (ÍMPETO): ${firstStrikeIds.length} criatura(s) veloz(es) atacam primeiro!`
    );
  }

  for (const atkId of firstStrikeIds) {
    if (next.phase === 'gameover') return next;
    const foundAtk = findUnitOnBoard(next, atkId);
    if (!foundAtk) continue;
    const { unit: attacker } = foundAtk;
    if (
      attacker.currentHp <= 0 ||
      attacker.isFrozen ||
      attacker.hasAttackedThisTurn ||
      attacker.stance === 'defend' ||
      attacker.currentAtk <= 0
    ) {
      continue;
    }

    const redirectedTarget = resolveRedirectedTargetForAttacker(
      next,
      attacker,
      attacker.plannedTargetId,
      plannedColumnByAttackerId[attacker.instanceId]
    );
    if (redirectedTarget) {
      next = executeAttack(next, attacker.instanceId, redirectedTarget, {
        isFirstStrikeWave: true,
      });
    }
  }

  cleanupDeadUnits(next);
  if (next.phase === 'gameover') {
    return next;
  }

  // =========================================================================
  // ONDA 3: CHOQUE SIMULTÂNEO DAS DEMAIS CRIATURAS — PROBLEMAS 1, 2, 3 E 4
  // =========================================================================
  const getSimultaneousAttackers = (actor: 'player' | 'ai') =>
    getAllBoardUnits(next[actor])
      .filter(
        (u) =>
          !u.isTrap &&
          u.card.type === 'creature' &&
          u.stance !== 'defend' &&
          !u.hasSummoningSickness &&
          !u.hasAttackedThisTurn &&
          !u.isFrozen &&
          u.currentAtk > 0
      )
      .sort((a, b) => {
        const aRanged = a.keywords.includes('Alcance') ? 1 : 0;
        const bRanged = b.keywords.includes('Alcance') ? 1 : 0;
        if (aRanged !== bRanged) return bRanged - aRanged;
        return b.currentAtk - a.currentAtk;
      });

  const initSim = getSimultaneousAttackers(initActor);
  const secSim = getSimultaneousAttackers(secondActor);
  const simultaneousQueue: { instanceId: string; plannedTargetId: string | null | undefined }[] = [];
  const maxSimLen = Math.max(initSim.length, secSim.length);
  for (let i = 0; i < maxSimLen; i++) {
    if (initSim[i]) {
      simultaneousQueue.push({
        instanceId: initSim[i].instanceId,
        plannedTargetId: initSim[i].plannedTargetId,
      });
    }
    if (secSim[i]) {
      simultaneousQueue.push({
        instanceId: secSim[i].instanceId,
        plannedTargetId: secSim[i].plannedTargetId,
      });
    }
  }

  if (simultaneousQueue.length > 0) {
    addLog(
      next,
      'system',
      'combat',
      `⚔️ CHOQUE SIMULTÂNEO: ${simultaneousQueue.length} criatura(s) engajam em combate!`
    );
  }

  for (const item of simultaneousQueue) {
    if (next.phase === 'gameover') break;
    const foundAtk = findUnitOnBoard(next, item.instanceId);
    if (!foundAtk) continue;
    const { unit: attacker } = foundAtk;
    if (
      attacker.isFrozen ||
      attacker.hasAttackedThisTurn ||
      attacker.stance === 'defend' ||
      attacker.currentAtk <= 0
    ) {
      continue;
    }

    const targetId = resolveRedirectedTargetForAttacker(
      next,
      attacker,
      item.plannedTargetId,
      plannedColumnByAttackerId[attacker.instanceId]
    );
    if (!targetId) continue;

    // Check if the target is an enemy creature whose own plannedTargetId was this exact attacker (mutual duel)
    const foundDef = findUnitOnBoard(next, targetId);
    const isMutualDuel =
      foundDef &&
      foundDef.unit.stance === 'attack' &&
      foundDef.unit.plannedTargetId === attacker.instanceId &&
      !(attacker.row === 'rearguard' && attacker.keywords.includes('Alcance'));

    next = executeAttack(next, attacker.instanceId, targetId, {
      deferCleanup: true,
      allowZeroHpAttacker: true,
    });

    if (isMutualDuel) {
      const defAfter = findUnitOnBoard(next, targetId);
      if (defAfter) {
        defAfter.unit.hasAttackedThisTurn = true;
      }
    }
  }

  cleanupDeadUnits(next);
  if (next.phase === 'gameover') {
    return next;
  }

  // =========================================================================
  // FIM DA RODADA & TRANSIÇÃO PARA A PRÓXIMA RODADA (FASE 1 'deploy')
  // =========================================================================
  for (const actor of ['player', 'ai'] as const) {
    for (const unit of getAllBoardUnits(next[actor])) {
      for (const eff of unit.card.effects) {
        if (eff.trigger === 'turn_end') {
          executeCardEffect(next, actor, unit.card, eff, {
            sourceInstanceId: unit.instanceId,
          });
        }
      }
      if (unit.isFrozen) {
        unit.isFrozen = false;
      }
    }
  }

  cleanupDeadUnits(next);
  if ((next.phase as string) === 'gameover') {
    return next;
  }

  next.turn += 1;
  next.activePlayer = 'player';
  next.roundSubPhase = 'deploy';
  next.initiativePlayer = (next.initiativePlayer ?? 'player') === 'player' ? 'ai' : 'player';

  // Weather countdown
  if (next.weather) {
    next.weather.turnsRemaining -= 1;
    if (next.weather.turnsRemaining <= 0) {
      addLog(
        next,
        'system',
        'turn',
        `🌤️ O evento climático [${next.weather.icon} ${next.weather.name}] dissipou-se da arena.`
      );
      next.weather = null;
    }
  }

  if (next.turn % 2 === 0 || !next.columnRunes || next.columnRunes.length === 0) {
    spawnColumnRuneIfNeeded(next);
  }

  // Domain Expansion start-of-round maintenance & pulse
  if (next.domainExpansion) {
    next.domainExpansion.simpleDomainProtectedActor = null;
    next.domainExpansion.damageTakenByOwnerThisRound = 0;
    if (!next.domainExpansion.clashRival) {
      applyDomainExpansionPulseEffects(
        next,
        next.domainExpansion.owner,
        next.domainExpansion.domain
      );
    }
  }

  // Advance resources, affinities, weather pulses, unit readiness, and draw 1 card for BOTH Sovereign players!
  for (const actor of ['player', 'ai'] as const) {
    const actorState = next[actor];
    const opposingActor: 'player' | 'ai' = actor === 'player' ? 'ai' : 'player';
    const opposingState = next[opposingActor];

    if ((actorState.domainExhaustionTurns ?? 0) > 0) {
      actorState.domainExhaustionTurns = Math.max(0, (actorState.domainExhaustionTurns ?? 0) - 1);
    }
    actorState.hasUsedSimpleDomainThisTurn = false;

    if (actorState.maxEssence < MAX_ESSENCE_CAP) {
      actorState.maxEssence += 1;
    }
    const autoDomain = pickMostNeededColoredDomain(actorState);
    actorState.affinities[autoDomain] += 1;
    actorState.currentEssence = actorState.maxEssence;
    actorState.hasChanneledThisTurn = false;
    actorState.hasMovedThisTurn = false;
    actorState.hasUsedSovereignPowerThisTurn = false;
    actorState.hasUsedBloodPactThisTurn = false;

    checkAndTriggerArenaWeather(next, actor);
    checkAndResolveDomainClash(next);

    if (next.weather) {
      const w = next.weather;
      if (w.type === 'ash_storm' && (w.owner === actor || w.owner === 'system')) {
        opposingState.hp = Math.max(0, opposingState.hp - 1);
        addFeedback(next, `${opposingActor}-sovereign`, '-1🌋 Cinzas Rubras', 'damage');
      } else if (w.type === 'astral_blizzard' && (w.owner === actor || w.owner === 'system')) {
        actorState.currentEssence += 1;
        addFeedback(next, `${actor}-sovereign`, '+1❄️ Nevasca Astral', 'ess');
        const enemies = getAllBoardUnits(opposingState).filter(
          (u) => !u.isTrap && u.card.type === 'creature'
        );
        if (enemies.length > 0) {
          enemies.sort((a, b) => b.currentAtk - a.currentAtk);
          enemies[0].currentAtk = Math.max(0, enemies[0].currentAtk - 1);
          addFeedback(next, enemies[0].instanceId, '-1⚔️ Nevasca', 'freeze');
        }
      } else if (w.type === 'umbral_eclipse' && (w.owner === actor || w.owner === 'system')) {
        opposingState.hp = Math.max(0, opposingState.hp - 1);
        actorState.hp = Math.min(actorState.maxHp, actorState.hp + 1);
        addFeedback(next, `${opposingActor}-sovereign`, '-1🌑 Eclipse Umbral', 'damage');
        addFeedback(next, `${actor}-sovereign`, '+1🌑 Eclipse Umbral', 'heal');
      } else if (w.type === 'sylvan_monsoon' && (w.owner === actor || w.owner === 'system')) {
        for (const ally of getAllBoardUnits(actorState)) {
          if (ally.card.type === 'creature' && !ally.isTrap) {
            if (ally.row === 'vanguard') {
              ally.maxHp += 1;
            }
            ally.currentHp = Math.min(ally.maxHp, ally.currentHp + 1);
            addFeedback(next, ally.instanceId, '+1🌿 Monção', 'heal');
          }
        }
      } else if (w.type === 'solar_zenith' && (w.owner === actor || w.owner === 'system')) {
        actorState.hp = Math.min(actorState.maxHp, actorState.hp + 1);
        addFeedback(next, `${actor}-sovereign`, '+1☀️ Zênite Solar', 'heal');
        const vanAllies = getRowUnits(actorState, 'vanguard').filter(
          (u) => u.card.type === 'creature' && !u.isTrap
        );
        if (vanAllies.length > 0) {
          vanAllies.sort((a, b) => b.currentAtk - a.currentAtk);
          vanAllies[0].currentArmor += 1;
          addFeedback(next, vanAllies[0].instanceId, '+1🛡️ Zênite Solar', 'shield');
        }
      } else if (w.type === 'astral_convergence') {
        actorState.currentEssence += 1;
        addFeedback(next, `${actor}-sovereign`, '+1🌀 Convergência', 'ess');
      }
    }

    for (const unit of getAllBoardUnits(actorState)) {
      unit.hasSummoningSickness = false;
      unit.hasAttackedThisTurn = false;
      unit.isConcealedDeploy = false;
      if (unit.card.type === 'creature' && !unit.isTrap) {
        unit.stance = 'attack';
      }

      if (unit.regeneration > 0 && unit.currentHp < unit.maxHp) {
        const before = unit.currentHp;
        unit.currentHp = Math.min(unit.maxHp, unit.currentHp + unit.regeneration);
        const healed = unit.currentHp - before;
        if (healed > 0) {
          addFeedback(next, unit.instanceId, `+${healed} Regen`, 'heal');
        }
      }

      for (const eff of unit.card.effects) {
        if (eff.trigger === 'turn_start') {
          executeCardEffect(next, actor, unit.card, eff, {
            sourceInstanceId: unit.instanceId,
          });
        }
      }
    }

    if (isDomainTerrainAwakened(actorState, 'green')) {
      const woundedAllies = getAllBoardUnits(actorState).filter(
        (u) => !u.isTrap && u.currentHp < u.maxHp
      );
      woundedAllies.sort((a, b) => a.currentHp - a.maxHp - (b.currentHp - b.maxHp));
      for (const targetUnit of woundedAllies.slice(0, 2)) {
        targetUnit.currentHp = Math.min(targetUnit.maxHp, targetUnit.currentHp + 2);
        addFeedback(next, targetUnit.instanceId, '🌲 +2❤️ (Seiva Ancestral)', 'heal');
      }
    }

    drawCardsForActor(next, actor, 1);
  }

  // Campaign Boss Start-of-Round Passives
  if (next.bossId) {
    if (next.bossId === 'boss_stage_2_storm_oracle') {
      const playerUnits = getAllBoardUnits(next.player).filter(
        (u) => !u.isTrap && !u.isFrozen && u.card.type === 'creature'
      );
      if (playerUnits.length > 0 && next.turn % 2 === 0) {
        const picked = playerUnits[0];
        picked.isFrozen = true;
        addFeedback(next, picked.instanceId, '❄️ Zero Absoluto!', 'freeze');
        addLog(
          next,
          'ai',
          'effect',
          `[Passiva de Chefe — Zero Absoluto] Zephyros congelou [${picked.card.name}]!`
        );
      }
    } else if (next.bossId === 'boss_stage_13_chronomancer') {
      next.ai.hp = Math.min(next.ai.maxHp, next.ai.hp + 1);
      addFeedback(next, 'ai-sovereign', '+1⏳ Roda do Tempo', 'heal');
      const playerUnits = getAllBoardUnits(next.player).filter(
        (u) => !u.isTrap && !u.isFrozen && u.card.type === 'creature'
      );
      if (playerUnits.length > 0 && next.turn % 2 === 0) {
        const picked = playerUnits[0];
        picked.isFrozen = true;
        addFeedback(next, picked.instanceId, '⏳ Parar o Tempo!', 'freeze');
        addLog(
          next,
          'ai',
          'effect',
          `[Passiva de Chefe — Roda da Eternidade] Thaddeus & Chronos paralisaram [${picked.card.name}] no tempo!`
        );
      }
    } else if (
      next.bossId === 'boss_stage_6_valkyra' ||
      next.bossId === 'boss_stage_14_valkyra_eternal'
    ) {
      next.player.hp = Math.max(0, next.player.hp - 1);
      next.ai.hp = Math.min(next.ai.maxHp, next.ai.hp + 1);
      addFeedback(next, 'player-sovereign', '-1🐉 Chama Pentacromática', 'damage');
      addFeedback(next, 'ai-sovereign', '+1🐉 Escama Imperial', 'heal');
      addLog(
        next,
        'ai',
        'effect',
        `[Passiva de Chefe — Convergência Pentacromática] Valkyra drenou 1❤️ de ${next.player.name}!`
      );
    }
  }

  addLog(
    next,
    'system',
    'turn',
    `🔮 RODADA ${next.turn} — FASE 1 (INVOCAÇÕES OCULTAS): Canalize 1 carta e posicione suas Criaturas e Relíquias (${next.player.currentEssence}/${next.player.maxEssence}⚡ | Iniciativa: ${
      next.initiativePlayer === 'player' ? next.player.name : next.ai.name
    }).`
  );

  cleanupDeadUnits(next);
  return next;
}
