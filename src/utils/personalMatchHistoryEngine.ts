import { ALL_CARDS } from '../data/cards';
import type { BoardUnit, Domain, GameState, PlayerState } from '../types/game';
import { getSupabaseConfig } from './multiplayerEngine';
import type {
  ComputedRoundPairing,
  ComputedTournamentStanding,
  SwissTournamentDefinition,
} from './tournamentEngine';
import type {
  CompactBoardUnit,
  CompactSideState,
  ReplayActionKind,
  TournamentMatchReplayLog,
  TournamentReplayFrame,
} from './tournamentSpectatorEngine';

function cleanLogSummary(raw: string): string {
  return raw
    .replace(/[⚡❤️🛡️🗺️🔥❄️🌑🌿✨⚔️🃏]/gu, '')
    .replace(/\s*->\s*/g, ' → ')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function compactUnit(u: BoardUnit): CompactBoardUnit {
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

function compactSide(
  pState: PlayerState,
  meta: { subtitle: string; primaryDomain: Domain }
): CompactSideState {
  const vanguard: CompactBoardUnit[][] = [];
  const rearguard: CompactBoardUnit[][] = [];
  for (let col = 0; col < 6; col += 1) {
    const vStack =
      pState.vanguardStacks?.[col] ??
      (pState.vanguard[col] ? [pState.vanguard[col]!] : []);
    const rStack =
      pState.rearguardStacks?.[col] ??
      (pState.rearguard[col] ? [pState.rearguard[col]!] : []);
    vanguard.push(vStack.map(compactUnit));
    rearguard.push(rStack.map(compactUnit));
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

const PERSONAL_REPLAYS_STORAGE_KEY = 'chromatic_pact_personal_replays_v1';
const MAX_SAVED_PERSONAL_MATCHES = 15;
const MAX_FRAMES_PER_PERSONAL_MATCH = 130;

export interface PersonalMatchHistoryEntry {
  id: string;
  modeLabel: string;
  playedAtMs: number;
  durationSec: number;
  playerName: string;
  playerSubtitle: string;
  playerAvatarCardId: string;
  playerPrimaryDomain: Domain;
  playerElo: number;
  opponentName: string;
  opponentSubtitle: string;
  opponentAvatarCardId: string;
  opponentPrimaryDomain: Domain;
  opponentElo: number;
  didWin: boolean | null;
  turns: number;
  finalPlayerHp: number;
  finalOpponentHp: number;
  replayLog: TournamentMatchReplayLog;
}

export interface PersonalMatchSessionMeta {
  sessionId: string;
  modeLabel: string;
  playerSubtitle?: string;
  playerElo?: number;
  opponentElo?: number;
  turnTimeLimitSec?: number;
}

const activeSessions = new Map<
  string,
  {
    startedAtMs: number;
    frames: TournamentReplayFrame[];
    savedFinal: boolean;
  }
>();

function inferDominantDomainFromState(state: GameState, actor: 'player' | 'ai'): Domain {
  const p = state[actor];
  const entries = (Object.entries(p.affinities) as Array<[Domain, number]>).filter(
    ([dom]) => dom !== 'neutral'
  );
  entries.sort((a, b) => b[1] - a[1]);
  if (entries.length > 0 && entries[0][1] > 0) {
    return entries[0][0];
  }
  const sample = [...p.hand, ...p.channeledCards, ...p.crypt].find(
    (c) => c.domain !== 'neutral'
  );
  return sample?.domain ?? 'gold';
}

export function getPersonalMatchHistory(): PersonalMatchHistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(PERSONAL_REPLAYS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return (parsed as PersonalMatchHistoryEntry[]).filter(
      (item) =>
        item &&
        typeof item.id === 'string' &&
        item.replayLog &&
        Array.isArray(item.replayLog.frames) &&
        item.replayLog.frames.length >= 2
    );
  } catch {
    return [];
  }
}

function savePersonalHistoryListSafe(list: PersonalMatchHistoryEntry[]): void {
  if (typeof window === 'undefined') return;
  let trimmed = list.slice(0, MAX_SAVED_PERSONAL_MATCHES);
  while (trimmed.length > 0) {
    try {
      window.localStorage.setItem(PERSONAL_REPLAYS_STORAGE_KEY, JSON.stringify(trimmed));
      return;
    } catch {
      // Quota tight: drop oldest match and retry
      trimmed = trimmed.slice(0, trimmed.length - 1);
    }
  }
}

export function deletePersonalMatchEntry(id: string): PersonalMatchHistoryEntry[] {
  const next = getPersonalMatchHistory().filter((m) => m.id !== id);
  savePersonalHistoryListSafe(next);
  return next;
}

/**
 * Records incremental frames of an active battle played by the local Sovereign (`state.player` = South,
 * `state.ai` = North). Persists to `localStorage` automatically as soon as `state.phase === 'gameover'`.
 */
export function recordPersonalMatchFrame(
  meta: PersonalMatchSessionMeta,
  state: GameState,
  turnTimeLeftSec = 60
): void {
  if (typeof window === 'undefined' || !meta.sessionId) return;

  const nowMs = Date.now();
  let session = activeSessions.get(meta.sessionId);
  if (!session) {
    session = {
      startedAtMs: nowMs,
      frames: [],
      savedFinal: false,
    };
    activeSessions.set(meta.sessionId, session);
    if (activeSessions.size > 8) {
      const oldestKey = activeSessions.keys().next().value;
      if (oldestKey && oldestKey !== meta.sessionId) {
        activeSessions.delete(oldestKey);
      }
    }
  }

  if (session.savedFinal) return;

  const newestLog = state.combatLog[0];
  const rawMessage = newestLog?.message || `Turno ${state.turn}`;
  const cleanMsg = cleanLogSummary(rawMessage);
  const lastFrame = session.frames[session.frames.length - 1];

  const isGameover = state.phase === 'gameover';

  if (
    lastFrame &&
    lastFrame.summary === cleanMsg &&
    lastFrame.turn === state.turn &&
    lastFrame.sideA.hp === state.player.hp &&
    lastFrame.sideB.hp === state.ai.hp &&
    !isGameover
  ) {
    return;
  }

  let inferredCardId: string | undefined;
  const bracketMatch = rawMessage.match(/\[([^\]]+)\]/);
  if (bracketMatch?.[1]) {
    const matchedCard = ALL_CARDS.find(
      (c) => c.name === bracketMatch[1] || c.ascension?.newName === bracketMatch[1]
    );
    if (matchedCard) inferredCardId = matchedCard.id;
  }

  const activeSide: 'A' | 'B' = state.activePlayer === 'player' ? 'A' : 'B';
  const isLethalCombatAttack = isGameover && newestLog?.category === 'combat';
  const actorSide: 'A' | 'B' | 'SYSTEM' =
    isGameover && !isLethalCombatAttack
      ? 'SYSTEM'
      : newestLog?.actor === 'player'
      ? 'A'
      : newestLog?.actor === 'ai'
      ? 'B'
      : activeSide;

  const resolvedKind: ReplayActionKind =
    isGameover && !isLethalCombatAttack
      ? 'finish'
      : session.frames.length === 0
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

  const playerDom = inferDominantDomainFromState(state, 'player');
  const oppDom = inferDominantDomainFromState(state, 'ai');
  const playerSub = meta.playerSubtitle || state.player.title || 'Soberano de Vaeloria';
  const oppSub = state.ai.title || 'Soberano Rival';
  const limit = meta.turnTimeLimitSec || 60;
  const prevAtMs = lastFrame?.atMs ?? nowMs;

  const newFrame: TournamentReplayFrame = {
    index: session.frames.length,
    atMs: nowMs,
    turn: state.turn,
    activeSide,
    actorSide,
    kind: resolvedKind,
    cardId: inferredCardId,
    summary: cleanMsg,
    clockSecA: activeSide === 'A' ? Math.max(1, turnTimeLeftSec) : limit,
    clockSecB: activeSide === 'B' ? Math.max(1, turnTimeLeftSec) : limit,
    thinkDurationMs: Math.max(0, nowMs - prevAtMs),
    domainExpansion: state.domainExpansion
      ? {
          owner: state.domainExpansion.owner === 'player' ? 'A' : 'B',
          domain: state.domainExpansion.domain,
          name: state.domainExpansion.name,
          turnsRemaining: state.domainExpansion.turnsRemaining,
          clashRival: state.domainExpansion.clashRival
            ? {
                owner: state.domainExpansion.clashRival.owner === 'player' ? 'A' : 'B',
                domain: state.domainExpansion.clashRival.domain,
                name: state.domainExpansion.clashRival.name,
                icon: state.domainExpansion.clashRival.icon,
              }
            : null,
        }
      : null,
    feedbacks:
      state.feedbacks && state.feedbacks.length > 0
        ? state.feedbacks.slice(0, 8).map((fb) => ({
            targetId:
              fb.targetId === 'player-sovereign'
                ? 'A-sovereign'
                : fb.targetId === 'ai-sovereign'
                ? 'B-sovereign'
                : fb.targetId,
            text: fb.text,
            color: fb.color,
          }))
        : undefined,
    sideA: compactSide(state.player, {
      subtitle: playerSub,
      primaryDomain: playerDom,
    }),
    sideB: compactSide(state.ai, {
      subtitle: oppSub,
      primaryDomain: oppDom,
    }),
  };

  if (session.frames.length >= MAX_FRAMES_PER_PERSONAL_MATCH) {
    session.frames = [
      ...session.frames.slice(0, 18),
      ...session.frames.slice(-(MAX_FRAMES_PER_PERSONAL_MATCH - 19)),
      newFrame,
    ].map((f, idx) => ({ ...f, index: idx }));
  } else {
    session.frames.push(newFrame);
  }

  if (isGameover && session.frames.length >= 2) {
    session.savedFinal = true;
    const didWin =
      state.winner === 'player' ? true : state.winner === 'ai' ? false : null;
    const finalResult: TournamentMatchReplayLog['finalResult'] =
      didWin === true ? 'A_WIN' : didWin === false ? 'B_WIN' : 'DRAW';

    const replayLog: TournamentMatchReplayLog = {
      matchKey: `personal::${meta.sessionId}`,
      tournamentId: `personal-archive-${meta.sessionId}`,
      round: 1,
      tableNumber: 1,
      isHumanRecorded: true,
      isCompleted: true,
      matchStartMs: session.startedAtMs,
      matchFinishMs: nowMs,
      turnTimeLimitSec: limit,
      finalResult,
      frames: session.frames,
    };

    const entry: PersonalMatchHistoryEntry = {
      id: meta.sessionId,
      modeLabel: meta.modeLabel,
      playedAtMs: nowMs,
      durationSec: Math.max(5, Math.round((nowMs - session.startedAtMs) / 1000)),
      playerName: state.player.name,
      playerSubtitle: playerSub,
      playerAvatarCardId: state.player.avatarCardId || 'gold_01',
      playerPrimaryDomain: playerDom,
      playerElo: meta.playerElo || 1500,
      opponentName: state.ai.name,
      opponentSubtitle: oppSub,
      opponentAvatarCardId: state.ai.avatarCardId || 'purple_01',
      opponentPrimaryDomain: oppDom,
      opponentElo: meta.opponentElo || 1500,
      didWin,
      turns: state.turn,
      finalPlayerHp: state.player.hp,
      finalOpponentHp: state.ai.hp,
      replayLog,
    };

    const prevList = getPersonalMatchHistory().filter((m) => m.id !== entry.id);
    savePersonalHistoryListSafe([entry, ...prevList]);
  }
}

export function buildPersonalReplaySpectatorContext(
  entry: PersonalMatchHistoryEntry,
  onExit: () => void,
  initialSpecFrame?: number
): {
  tournament: SwissTournamentDefinition;
  pairing: ComputedRoundPairing;
  preloadedReplayLog: TournamentMatchReplayLog;
  personalEntry: PersonalMatchHistoryEntry;
  initialSpecFrame?: number;
  variant: 'personal_replay';
  customTableBadge: string;
  exitButtonLabel: string;
  onExitSpectator: () => void;
} {
  const standingA: ComputedTournamentStanding = {
    participantId: `personal-p1-${entry.id}`,
    kind: 'human',
    rank: 1,
    displayName: entry.playerName,
    subtitle: entry.playerSubtitle,
    avatarCardId: entry.playerAvatarCardId,
    eloRating: entry.playerElo,
    primaryDomain: entry.playerPrimaryDomain,
    points: entry.didWin === true ? 1 : entry.didWin === null ? 0.5 : 0,
    buchholz: 0,
    hpDiff: entry.finalPlayerHp - entry.finalOpponentHp,
    wins: entry.didWin === true ? 1 : 0,
    draws: entry.didWin === null ? 1 : 0,
    losses: entry.didWin === false ? 1 : 0,
    roundsPlayed: 1,
    opponentIds: [`personal-p2-${entry.id}`],
    matchHistory: [],
  };

  const standingB: ComputedTournamentStanding = {
    participantId: `personal-p2-${entry.id}`,
    kind: 'sovereign',
    rank: 2,
    displayName: entry.opponentName,
    subtitle: entry.opponentSubtitle,
    avatarCardId: entry.opponentAvatarCardId,
    eloRating: entry.opponentElo,
    primaryDomain: entry.opponentPrimaryDomain,
    points: entry.didWin === false ? 1 : entry.didWin === null ? 0.5 : 0,
    buchholz: 0,
    hpDiff: entry.finalOpponentHp - entry.finalPlayerHp,
    wins: entry.didWin === false ? 1 : 0,
    draws: entry.didWin === null ? 1 : 0,
    losses: entry.didWin === true ? 1 : 0,
    roundsPlayed: 1,
    opponentIds: [`personal-p1-${entry.id}`],
    matchHistory: [],
  };

  const tournament: SwissTournamentDefinition = {
    id: entry.replayLog.tournamentId,
    title: entry.modeLabel,
    subtitle: 'Arquivo Pessoal de Combate',
    startsAtMs: entry.replayLog.matchStartMs,
    endsAtMs: entry.replayLog.matchFinishMs,
    totalRounds: 1,
    roundDurationMs: Math.max(60_000, entry.replayLog.matchFinishMs - entry.replayLog.matchStartMs),
    playWindowMs: Math.max(60_000, entry.replayLog.matchFinishMs - entry.replayLog.matchStartMs),
    timeControlId: 'standard_60s',
    turnTimeLimitSec: entry.replayLog.turnTimeLimitSec || 60,
    mulliganTimeLimitSec: 30,
    includeAllSovereigns: false,
    prizeSpec: {
      kind: 'gold_and_shards',
      label: entry.modeLabel,
      description: 'Reprise do Histórico Pessoal',
    },
    createdBy: 'archive',
    createdAtMs: entry.replayLog.matchStartMs,
  };

  const pairing: ComputedRoundPairing = {
    tableNumber: 1,
    round: 1,
    playerA: standingA,
    playerB: standingB,
    pointsBeforeA: 0,
    pointsBeforeB: 0,
    result: entry.replayLog.finalResult === 'IN_PROGRESS' ? 'DRAW' : entry.replayLog.finalResult,
    hpDiffA: entry.finalPlayerHp - entry.finalOpponentHp,
    turns: entry.turns,
    matchStartMs: entry.replayLog.matchStartMs,
    matchFinishMs: entry.replayLog.matchFinishMs,
    isHumanTable: true,
    isMyTable: true,
  };

  const dateFmt = new Date(entry.playedAtMs).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  });

  return {
    tournament,
    pairing,
    preloadedReplayLog: entry.replayLog,
    personalEntry: entry,
    initialSpecFrame,
    variant: 'personal_replay',
    customTableBadge: `${entry.modeLabel} · ${dateFmt}`,
    exitButtonLabel: 'Histórico',
    onExitSpectator: onExit,
  };
}

const SHARED_REPLAY_CLOUD_PREFIX = '__shared_replay__:';
const SHARED_REPLAY_LOCAL_CACHE_KEY = 'chromatic_pact_shared_replays_v1';

export function computePersonalReplayShareId(entry: PersonalMatchHistoryEntry): string {
  const raw = `${entry.id}::${entry.playedAtMs}::${entry.playerName}::${entry.opponentName}`;
  let h1 = 0x811c9dc5 >>> 0;
  let h2 = 0x9e3779b9 >>> 0;
  for (let i = 0; i < raw.length; i += 1) {
    const c = raw.charCodeAt(i);
    h1 ^= c;
    h1 = Math.imul(h1, 0x01000193) >>> 0;
    h2 ^= c + (i & 0xff);
    h2 = Math.imul(h2, 0x85ebca6b) >>> 0;
  }
  return `${h1.toString(36)}${h2.toString(36)}`.slice(0, 11);
}

function saveSharedReplayLocalCache(shareId: string, entry: PersonalMatchHistoryEntry): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(SHARED_REPLAY_LOCAL_CACHE_KEY);
    const map: Record<string, PersonalMatchHistoryEntry> = raw ? JSON.parse(raw) : {};
    map[shareId] = entry;
    const keys = Object.keys(map);
    if (keys.length > 8) {
      delete map[keys[0]];
    }
    localStorage.setItem(SHARED_REPLAY_LOCAL_CACHE_KEY, JSON.stringify(map));
  } catch {
    // ignore quota issues
  }
}

function readSharedReplayLocalCache(shareId: string): PersonalMatchHistoryEntry | null {
  if (typeof window === 'undefined') return null;
  try {
    const fromHistory = getPersonalMatchHistory().find(
      (item) => computePersonalReplayShareId(item) === shareId || item.id === shareId
    );
    if (fromHistory) return fromHistory;

    const raw = localStorage.getItem(SHARED_REPLAY_LOCAL_CACHE_KEY);
    if (!raw) return null;
    const map = JSON.parse(raw) as Record<string, PersonalMatchHistoryEntry>;
    return map?.[shareId] ?? null;
  } catch {
    return null;
  }
}

export async function publishPersonalReplayShareToCloud(
  entry: PersonalMatchHistoryEntry
): Promise<string> {
  const shareId = computePersonalReplayShareId(entry);
  saveSharedReplayLocalCache(shareId, entry);

  const cfg = getSupabaseConfig();
  if (!cfg.isConfigured) return shareId;

  try {
    await fetch(`${cfg.url}/rest/v1/sovereign_profiles?on_conflict=username`, {
      method: 'POST',
      headers: {
        apikey: cfg.anonKey,
        Authorization: `Bearer ${cfg.anonKey}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        username: `${SHARED_REPLAY_CLOUD_PREFIX}${shareId}`,
        title: JSON.stringify(entry),
        avatar_card_id: entry.playerAvatarCardId || 'gold_01',
        elo_rating: entry.playerElo || 1500,
        pvp_wins: entry.didWin === true ? 1 : 0,
        pvp_losses: entry.didWin === false ? 1 : 0,
        gold: 0,
        updated_at: new Date().toISOString(),
      }),
    });
  } catch {
    // Local cache still resolves in-browser if offline
  }

  return shareId;
}

export async function fetchSharedPersonalReplay(
  shareId: string
): Promise<PersonalMatchHistoryEntry | null> {
  const cleanId = shareId.trim();
  if (!cleanId) return null;

  const localHit = readSharedReplayLocalCache(cleanId);
  if (localHit && Array.isArray(localHit.replayLog?.frames) && localHit.replayLog.frames.length >= 2) {
    return localHit;
  }

  const cfg = getSupabaseConfig();
  if (!cfg.isConfigured) return null;

  try {
    const encodedUser = encodeURIComponent(`${SHARED_REPLAY_CLOUD_PREFIX}${cleanId}`);
    const res = await fetch(
      `${cfg.url}/rest/v1/sovereign_profiles?username=eq.${encodedUser}&select=title&limit=1`,
      {
        headers: {
          apikey: cfg.anonKey,
          Authorization: `Bearer ${cfg.anonKey}`,
        },
      }
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as Array<{ title?: string }>;
    const rawTitle = rows?.[0]?.title;
    if (!rawTitle) return null;
    const parsed = JSON.parse(rawTitle) as PersonalMatchHistoryEntry;
    if (parsed && Array.isArray(parsed.replayLog?.frames) && parsed.replayLog.frames.length >= 2) {
      saveSharedReplayLocalCache(cleanId, parsed);
      return parsed;
    }
  } catch {
    // ignore
  }
  return null;
}
