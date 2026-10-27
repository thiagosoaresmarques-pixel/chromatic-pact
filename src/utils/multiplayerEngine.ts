import { CardDefinition, Domain, DomainExpansionState, GameState, PlayerState, PrebuiltDeck } from '../types/game';
import { ALL_CARDS, CARDS_BY_ID } from '../data/cards';
import { PREBUILT_DECKS } from '../data/decks';
import { LEGENDARY_CREATURE_BIOGRAPHIES } from '../data/legendaryCreaturesLore';

export const VICTORY_GOLD_REWARD = 10;
export const STARTER_GOLD = 160;

export const MONOCHROMATIC_STARTER_DECKS: PrebuiltDeck[] = PREBUILT_DECKS.filter(
  (d) => d.domains.length === 1
);

export interface SovereignSavedDeck {
  id: string;
  name: string;
  domain?: Domain;
  cardIds: string[];
  updatedAt?: number;
}

/**
 * Builds a balanced 100-card starter deck combining Red (Pyros) and Neutral (Aço) cards,
 * respecting copy limits (1 for legendary, 2 for common/uncommon/rare).
 */
export function buildDefaultStarterDeck(): {
  id: string;
  name: string;
  domain: Domain;
  cardIds: string[];
  updatedAt: number;
} {
  const cardIds: string[] = [];
  const counts: Record<string, number> = {};
  let legendaryCount = 0;

  const redCards = ALL_CARDS.filter((c) => c.domain === 'red').sort((a, b) => a.cost - b.cost);
  const neutralCards = ALL_CARDS.filter((c) => c.domain === 'neutral').sort((a, b) => a.cost - b.cost);

  const addCardsFromPool = (pool: CardDefinition[], targetTotal: number) => {
    for (const card of pool) {
      if (cardIds.length >= targetTotal) break;
      const isLeg = card.rarity === 'legendary';
      if (isLeg && legendaryCount >= 8) continue;
      const maxCopies = isLeg ? 1 : 2;
      const current = counts[card.id] ?? 0;
      const toAdd = Math.min(maxCopies - current, targetTotal - cardIds.length);
      for (let i = 0; i < toAdd; i++) {
        cardIds.push(card.id);
        counts[card.id] = (counts[card.id] ?? 0) + 1;
        if (isLeg) legendaryCount += 1;
      }
    }
  };

  // 70 Red cards + 30 Neutral cards = 100 balanced cards
  addCardsFromPool(redCards, 70);
  addCardsFromPool(neutralCards, 100);
  if (cardIds.length < 100) {
    addCardsFromPool(ALL_CARDS, 100);
  }

  return {
    id: 'starter_deck_pyros_steel_100',
    name: 'Pacto Inicial de Pyros & Aço (100 Cartas)',
    domain: 'red',
    cardIds: cardIds.slice(0, 100),
    updatedAt: Date.now(),
  };
}

/**
 * Returns the initial starter card collection granted to every registered Sovereign.
 * Includes all copies required to play or edit any of the 5 Monochromatic Starter Decks,
 * the default 100-card starter deck, plus a starter reserve of common/uncommon cards.
 */
export function getStarterCollection(): Record<string, number> {
  const initial: Record<string, number> = {};
  for (const deck of MONOCHROMATIC_STARTER_DECKS) {
    const counts: Record<string, number> = {};
    for (const id of deck.cardIds) {
      counts[id] = (counts[id] ?? 0) + 1;
    }
    for (const [id, cnt] of Object.entries(counts)) {
      initial[id] = Math.max(initial[id] ?? 0, cnt);
    }
  }
  const defaultStarter = buildDefaultStarterDeck();
  const starterCounts: Record<string, number> = {};
  for (const id of defaultStarter.cardIds) {
    starterCounts[id] = (starterCounts[id] ?? 0) + 1;
  }
  for (const [id, cnt] of Object.entries(starterCounts)) {
    initial[id] = Math.max(initial[id] ?? 0, cnt);
  }
  // Grant neutral domain cards as flexible deckbuilding reserve for all Sovereigns
  for (const card of ALL_CARDS) {
    if (card.domain === 'neutral') {
      const copies = card.rarity === 'legendary' ? 1 : 2;
      initial[card.id] = Math.max(initial[card.id] ?? 0, copies);
    }
  }
  return initial;
}

export interface SovereignUserProfile {
  id: string;
  username: string;
  email?: string;
  passwordHash?: string;
  title: string;
  avatarCardId: string;
  eloRating: number;
  pvpWins: number;
  pvpLosses: number;
  preferredDeckId: string;
  gold?: number;
  customDecks?: SovereignSavedDeck[];
  starterDeckCardIds?: string[];
  extraUnlockedCards?: Record<string, number>;
  defeatedBossIds?: string[];
  arenaWins?: number;
  isAdmin?: boolean;
  createdAt?: number;
  lastActiveAt?: number;
}

export const MASTER_ADMIN_USERNAMES = ['tsm81'];
export const MASTER_ADMIN_EMAILS = ['thiago_actuary@yahoo.com.br'];

export function isAdminProfile(profile?: SovereignUserProfile | null): boolean {
  if (!profile || profile.id === 'unregistered' || profile.username === 'Sem Conta') {
    return false;
  }
  const cleanName = (profile.username || '').trim().toLowerCase();
  const cleanEmail = (profile.email || '').trim().toLowerCase();
  if (
    MASTER_ADMIN_USERNAMES.includes(cleanName) ||
    (cleanEmail && MASTER_ADMIN_EMAILS.includes(cleanEmail))
  ) {
    return true;
  }
  return Boolean(profile.isAdmin);
}

export interface MultiplayerRoom {
  code: string;
  status: 'waiting' | 'playing' | 'finished';
  isPublicQueue: boolean;
  createdAt: number;
  host: {
    id: string;
    username: string;
    title: string;
    avatarCardId: string;
    eloRating: number;
    deckId: string;
    cardIds: string[];
    mulliganDone?: boolean;
  };
  guest?: {
    id: string;
    username: string;
    title: string;
    avatarCardId: string;
    eloRating: number;
    deckId: string;
    cardIds: string[];
    mulliganDone?: boolean;
  };
  /** Canonical GameState always stored from Host's perspective ('player' = Host, 'ai' = Guest) */
  canonicalState?: GameState;
  stateVersion: number;
  lastActorId?: string;
  lastActivityAt?: number;
  hostHeartbeatAt?: number;
  guestHeartbeatAt?: number;
  forfeitedByRole?: 'host' | 'guest';
  forfeitReason?: string;
}

export type MpNetworkMessage =
  | { type: 'ROOMS_SNAPSHOT'; rooms: MultiplayerRoom[] }
  | { type: 'ROOM_UPSERT'; room: MultiplayerRoom }
  | { type: 'ROOM_REMOVE'; roomCode: string }
  | {
      type: 'MATCH_STATE_SYNC';
      roomCode: string;
      canonicalState: GameState;
      stateVersion: number;
      actorId: string;
      actionLabel?: string;
    }
  | {
      type: 'MULLIGAN_SIDE_SYNC';
      roomCode: string;
      role: 'host' | 'guest';
      hand: CardDefinition[];
      deck: CardDefinition[];
      actorId: string;
    }
  | {
      type: 'HEARTBEAT_PING';
      roomCode: string;
      role: 'host' | 'guest';
      actorId: string;
      timestamp: number;
    }
  | {
      type: 'MATCH_FORFEIT';
      roomCode: string;
      role: 'host' | 'guest';
      actorId: string;
      actorName: string;
      reason: 'surrender' | 'disconnect';
    }
  | {
      type: 'EMOTE_PING';
      roomCode: string;
      senderId: string;
      senderName: string;
      emote: string;
    };

const STORAGE_KEYS = {
  ACCOUNTS_ROSTER: 'chromatic_pact_accounts_roster_v2',
  TAB_ACTIVE_USER: 'chromatic_pact_tab_user_v2',
  ROOMS_CACHE: 'chromatic_pact_mp_rooms_v2',
  SUPABASE_URL: 'chromatic_pact_supabase_url_v1',
  SUPABASE_KEY: 'chromatic_pact_supabase_key_v1',
};

// Purge legacy v1 pre-seeded profiles from browser storage
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('chromatic_pact_accounts_roster_v1');
    localStorage.removeItem('chromatic_pact_mp_rooms_v1');
    sessionStorage.removeItem('chromatic_pact_tab_user_v1');
  } catch {
    // Ignore
  }
}

/**
 * Returns the canonical Honorific Title bound to the chosen Creature / Legendary Avatar.
 */
export function getAvatarHonorificTitle(cardId: string): string {
  const bio = LEGENDARY_CREATURE_BIOGRAPHIES[cardId];
  if (bio?.properTitle) return bio.properTitle;
  const card = CARDS_BY_ID[cardId];
  if (card?.name) return card.name;
  return 'Valkyra, Imperatriz Pentacromática';
}

/**
 * Returns all selectable Avatar creatures (either all 73 Legendaries or all Creatures in the Codex).
 */
export function getSelectableAvatarCards(mode: 'legendary' | 'all_creatures' = 'legendary'): CardDefinition[] {
  if (mode === 'legendary') {
    return ALL_CARDS.filter(
      (c) => (c.rarity === 'legendary' || Boolean(LEGENDARY_CREATURE_BIOGRAPHIES[c.id])) && Boolean(c.imagePath)
    );
  }
  return ALL_CARDS.filter((c) => c.type === 'creature' && Boolean(c.imagePath));
}

// ============================================================================
// 1. PERSPECTIVE INVERSION (HOST <-> GUEST SYMMETRIC VIEW)
// ============================================================================

function flipActor(actor: 'player' | 'ai'): 'player' | 'ai' {
  return actor === 'player' ? 'ai' : 'player';
}

function flipDomainExpansion(
  exp: DomainExpansionState | null | undefined
): DomainExpansionState | null | undefined {
  if (!exp) return exp;
  return {
    ...exp,
    owner: flipActor(exp.owner),
    simpleDomainProtectedActor: exp.simpleDomainProtectedActor
      ? flipActor(exp.simpleDomainProtectedActor)
      : null,
    clashRival: exp.clashRival
      ? {
          ...exp.clashRival,
          owner: flipActor(exp.clashRival.owner),
        }
      : null,
  };
}

/**
 * Inverts a GameState between Host perspective ('player' = Host, 'ai' = Guest)
 * and Guest perspective ('player' = Guest, 'ai' = Host).
 * Involution property: flipGameStatePerspective(flipGameStatePerspective(S)) === S.
 */
export function flipGameStatePerspective(state: GameState): GameState {
  const nextPlayer: PlayerState = {
    ...state.ai,
    id: 'player',
  };
  const nextAi: PlayerState = {
    ...state.player,
    id: 'ai',
  };

  return {
    ...state,
    activePlayer: flipActor(state.activePlayer),
    initiativePlayer: state.initiativePlayer ? flipActor(state.initiativePlayer) : undefined,
    domainExpansion: flipDomainExpansion(state.domainExpansion),
    winner: state.winner ? flipActor(state.winner) : null,
    weather: state.weather
      ? {
          ...state.weather,
          owner:
            state.weather.owner === 'system'
              ? 'system'
              : flipActor(state.weather.owner),
        }
      : null,
    player: nextPlayer,
    ai: nextAi,
    combatLog: state.combatLog.map((entry) => ({
      ...entry,
      actor: entry.actor === 'system' ? 'system' : flipActor(entry.actor),
    })),
    feedbacks: state.feedbacks.map((fb) => ({
      ...fb,
      targetId:
        fb.targetId === 'player-sovereign'
          ? 'ai-sovereign'
          : fb.targetId === 'ai-sovereign'
          ? 'player-sovereign'
          : fb.targetId,
    })),
  };
}

// ============================================================================
// 2. USER ACCOUNTS & SOVEREIGN PROFILE MANAGEMENT (TAB-ISOLATED FOR 1v1 TESTING)
// ============================================================================

const UNREGISTERED_PLACEHOLDER: SovereignUserProfile = {
  id: 'unregistered',
  username: 'Sem Conta',
  title: 'Visitante sem Pacto',
  avatarCardId: 'neutral_10_valkyra_pentacromatica',
  eloRating: 1200,
  pvpWins: 0,
  pvpLosses: 0,
  preferredDeckId: 'deck_red_aggro',
};

export function isUnregisteredProfile(profile: SovereignUserProfile): boolean {
  return !profile || profile.id === 'unregistered' || profile.username === 'Sem Conta';
}

export function getSavedAccountsRoster(): SovereignUserProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACCOUNTS_ROSTER);
    if (raw) {
      const parsed = JSON.parse(raw) as SovereignUserProfile[];
      if (Array.isArray(parsed)) {
        return parsed.filter((a) => !isUnregisteredProfile(a));
      }
    }
  } catch {
    // Ignore storage error
  }
  return [];
}

export function saveAccountToRoster(profile: SovereignUserProfile): SovereignUserProfile[] {
  if (isUnregisteredProfile(profile)) return getSavedAccountsRoster();
  const current = getSavedAccountsRoster();
  const exists = current.some((a) => a.id === profile.id || a.username === profile.username);
  const next = exists
    ? current.map((a) =>
        a.id === profile.id || a.username === profile.username ? profile : a
      )
    : [...current, profile];

  try {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS_ROSTER, JSON.stringify(next));
  } catch {
    // Ignore
  }
  syncProfileToSupabaseIfConfigured(profile);
  return next;
}

export async function deleteSovereignAccount(profile: SovereignUserProfile): Promise<SovereignUserProfile[]> {
  const remaining = getSavedAccountsRoster().filter(
    (a) => a.id !== profile.id && a.username !== profile.username
  );
  try {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS_ROSTER, JSON.stringify(remaining));
    const tabRaw = sessionStorage.getItem(STORAGE_KEYS.TAB_ACTIVE_USER);
    if (tabRaw) {
      const tabParsed = JSON.parse(tabRaw) as SovereignUserProfile;
      if (tabParsed.id === profile.id || tabParsed.username === profile.username) {
        sessionStorage.removeItem(STORAGE_KEYS.TAB_ACTIVE_USER);
      }
    }
  } catch {
    // Ignore
  }

  const cfg = getSupabaseConfig();
  if (cfg.isConfigured && profile.username) {
    try {
      await fetch(
        `${cfg.url}/rest/v1/sovereign_profiles?username=eq.${encodeURIComponent(profile.username)}`,
        {
          method: 'DELETE',
          headers: getSupabaseHeaders(cfg.anonKey),
        }
      );
    } catch {
      // Ignore
    }
  }
  return remaining;
}

export function getActiveTabUserProfile(): SovereignUserProfile {
  try {
    const tabSaved = sessionStorage.getItem(STORAGE_KEYS.TAB_ACTIVE_USER);
    if (tabSaved) {
      const parsed = JSON.parse(tabSaved) as SovereignUserProfile;
      if (!isUnregisteredProfile(parsed)) return ensureStarterDeckForUser(parsed);
    }
  } catch {
    // Ignore
  }

  const roster = getSavedAccountsRoster();
  if (roster.length === 0) {
    return UNREGISTERED_PLACEHOLDER;
  }

  const existingRooms = getCachedRooms();
  const hostIdsInWaiting = new Set(existingRooms.map((r) => r.host.id));
  const adminAcc = roster.find((acc) => isAdminProfile(acc) && !hostIdsInWaiting.has(acc.id)) ??
    roster.find((acc) => isAdminProfile(acc));
  const picked = adminAcc ?? roster.find((acc) => !hostIdsInWaiting.has(acc.id)) ?? roster[0];

  const ensured = ensureStarterDeckForUser(picked);
  setActiveTabUserProfile(ensured);
  return ensured;
}

export function setActiveTabUserProfile(profile: SovereignUserProfile): void {
  if (isUnregisteredProfile(profile)) {
    try {
      sessionStorage.removeItem(STORAGE_KEYS.TAB_ACTIVE_USER);
    } catch {
      // Ignore
    }
    return;
  }
  try {
    sessionStorage.setItem(STORAGE_KEYS.TAB_ACTIVE_USER, JSON.stringify(profile));
  } catch {
    // Ignore
  }
  saveAccountToRoster(profile);
}

/**
 * Ensures any registered Sovereign account has at least 1 complete 100-card Starter Grimoire
 * so no player is ever blocked out of the Arena after registration.
 */
export function ensureStarterDeckForUser(profile: SovereignUserProfile): SovereignUserProfile {
  if (isUnregisteredProfile(profile)) {
    return profile;
  }
  const shouldBeAdmin = isAdminProfile(profile);
  if (profile.customDecks && profile.customDecks.length > 0) {
    if (shouldBeAdmin && !profile.isAdmin) {
      const upgraded = { ...profile, isAdmin: true };
      setActiveTabUserProfile(upgraded);
      return upgraded;
    }
    return profile;
  }
  const defaultDeck = buildDefaultStarterDeck();
  const updated: SovereignUserProfile = {
    ...profile,
    isAdmin: shouldBeAdmin,
    customDecks: [defaultDeck],
    starterDeckCardIds:
      profile.starterDeckCardIds && profile.starterDeckCardIds.length > 0
        ? profile.starterDeckCardIds
        : defaultDeck.cardIds,
    preferredDeckId: defaultDeck.id,
  };
  setActiveTabUserProfile(updated);
  return updated;
}

/**
 * Deterministic salted hash for Sovereign Account password verification across devices.
 */
export function hashPassword(rawPassword: string): string {
  const clean = rawPassword.trim();
  if (!clean) return '';
  const salted = `chromatic_pact_salt_v1::${clean}`;
  let h1 = 0xdeadbeef ^ salted.length;
  let h2 = 0x41c6ce57 ^ salted.length;
  for (let i = 0; i < salted.length; i++) {
    const ch = salted.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return `cpw_${(h2 >>> 0).toString(16).padStart(8, '0')}${(h1 >>> 0).toString(16).padStart(8, '0')}`;
}

function encodeCloudTitleMeta(profile: SovereignUserProfile): string {
  const honorific = getAvatarHonorificTitle(profile.avatarCardId);
  return JSON.stringify({
    t: honorific,
    e: (profile.email || '').trim().toLowerCase(),
    p: profile.passwordHash || '',
    g: profile.gold ?? 0,
    d: profile.customDecks ?? [],
    s: profile.starterDeckCardIds ?? [],
    u: profile.extraUnlockedCards ?? {},
    b: profile.defeatedBossIds ?? [],
    w: profile.arenaWins ?? 0,
    pref: profile.preferredDeckId || '',
    adm: isAdminProfile(profile),
    ca: profile.createdAt ?? Date.now(),
    la: Date.now(),
  });
}

function decodeCloudTitleMeta(
  rawTitle: string | null | undefined,
  avatarCardId: string
): {
  title: string;
  email?: string;
  passwordHash?: string;
  gold?: number;
  customDecks?: SovereignSavedDeck[];
  starterDeckCardIds?: string[];
  extraUnlockedCards?: Record<string, number>;
  defeatedBossIds?: string[];
  arenaWins?: number;
  preferredDeckId?: string;
  isAdmin?: boolean;
  createdAt?: number;
  lastActiveAt?: number;
} {
  const fallbackTitle = getAvatarHonorificTitle(avatarCardId);
  if (!rawTitle) return { title: fallbackTitle };
  if (rawTitle.startsWith('{')) {
    try {
      const parsed = JSON.parse(rawTitle) as {
        t?: string;
        e?: string;
        p?: string;
        g?: number;
        d?: SovereignSavedDeck[];
        s?: string[];
        u?: Record<string, number>;
        b?: string[];
        w?: number;
        pref?: string;
        adm?: boolean;
        ca?: number;
        la?: number;
      };
      return {
        title: fallbackTitle,
        email: parsed.e || undefined,
        passwordHash: parsed.p || undefined,
        gold: typeof parsed.g === 'number' ? parsed.g : undefined,
        customDecks: Array.isArray(parsed.d) ? parsed.d : undefined,
        starterDeckCardIds: Array.isArray(parsed.s) ? parsed.s : undefined,
        extraUnlockedCards: parsed.u && typeof parsed.u === 'object' ? parsed.u : undefined,
        defeatedBossIds: Array.isArray(parsed.b) ? parsed.b : undefined,
        arenaWins: typeof parsed.w === 'number' ? parsed.w : undefined,
        preferredDeckId: parsed.pref || undefined,
        isAdmin: Boolean(parsed.adm),
        createdAt: typeof parsed.ca === 'number' ? parsed.ca : undefined,
        lastActiveAt: typeof parsed.la === 'number' ? parsed.la : undefined,
      };
    } catch {
      return { title: fallbackTitle };
    }
  }
  return { title: fallbackTitle };
}

export function createNewSovereignAccount(params: {
  username: string;
  email: string;
  password: string;
  avatarCardId: string;
  preferredDeckId: string;
}): SovereignUserProfile {
  const cleanName = params.username.trim() || `Soberano_${Math.floor(100 + Math.random() * 900)}`;
  const chosenAvatar = params.avatarCardId || 'neutral_10_valkyra_pentacromatica';
  const defaultDeck = buildDefaultStarterDeck();
  const now = Date.now();
  const profile: SovereignUserProfile = {
    id: `sov_${now}_${Math.random().toString(36).slice(2, 7)}`,
    username: cleanName,
    email: params.email.trim().toLowerCase(),
    passwordHash: hashPassword(params.password),
    title: getAvatarHonorificTitle(chosenAvatar),
    avatarCardId: chosenAvatar,
    eloRating: 1200,
    pvpWins: 0,
    pvpLosses: 0,
    preferredDeckId: defaultDeck.id,
    gold: STARTER_GOLD,
    customDecks: [defaultDeck],
    starterDeckCardIds: defaultDeck.cardIds,
    extraUnlockedCards: {},
    defeatedBossIds: [],
    arenaWins: 0,
    isAdmin: MASTER_ADMIN_USERNAMES.includes(cleanName.toLowerCase()),
    createdAt: now,
    lastActiveAt: now,
  };
  const ensured = ensureStarterDeckForUser(profile);
  setActiveTabUserProfile(ensured);
  return ensured;
}

/**
 * Updates the active Sovereign user's profile (Avatar, Automatic Honorific Title, Email, Password, Preferred Deck)
 * while keeping the Nickname (`username`) strictly immutable.
 */
export function updateSovereignAccountProfile(
  currentProfile: SovereignUserProfile,
  updates: {
    email?: string;
    newPassword?: string;
    avatarCardId: string;
    preferredDeckId?: string;
  }
): SovereignUserProfile {
  const nextAvatar = updates.avatarCardId || currentProfile.avatarCardId;
  const nextPasswordHash =
    updates.newPassword && updates.newPassword.trim().length > 0
      ? hashPassword(updates.newPassword)
      : currentProfile.passwordHash;
  const updated: SovereignUserProfile = {
    ...currentProfile,
    // username is strictly preserved (immutable)
    username: currentProfile.username,
    email:
      updates.email !== undefined
        ? updates.email.trim().toLowerCase() || undefined
        : currentProfile.email,
    passwordHash: nextPasswordHash,
    avatarCardId: nextAvatar,
    title: getAvatarHonorificTitle(nextAvatar),
    preferredDeckId: updates.preferredDeckId ?? currentProfile.preferredDeckId,
  };
  setActiveTabUserProfile(updated);
  return updated;
}

/**
 * Calcula a variação de Reputação pelo modelo matemático de Elo (Xadrez FIDE / Tênis ATP).
 * Probabilidade esperada: E_A = 1 / (1 + 10 ^ ((R_B - R_A) / 400))
 * Atualização: Delta = round(K * (S_A - E_A)), onde S_A = 1 (vitória) ou 0 (derrota) e K = 32.
 */
export function calculateReputationDelta(
  playerRating: number,
  opponentRating: number,
  didWin: boolean,
  kFactor = 32
): number {
  const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
  const actualScore = didWin ? 1 : 0;
  return Math.round(kFactor * (actualScore - expectedScore));
}

export function recordPvpMatchResult(
  profile: SovereignUserProfile,
  didWin: boolean,
  opponentRating = 1200
): SovereignUserProfile {
  const reputationDelta = calculateReputationDelta(profile.eloRating, opponentRating, didWin, 32);
  const updated: SovereignUserProfile = {
    ...profile,
    eloRating: Math.max(100, profile.eloRating + reputationDelta),
    pvpWins: profile.pvpWins + (didWin ? 1 : 0),
    pvpLosses: profile.pvpLosses + (didWin ? 0 : 1),
  };
  setActiveTabUserProfile(updated);
  return updated;
}

// ============================================================================
// 3. SUPABASE CLOUD CONFIGURATION (ENV OR RUNTIME UI)
// ============================================================================

const DEFAULT_SUPABASE_URL = 'https://hpsrvsjcenkvikmipgik.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_Uk8HZmNDvhNLHIaosigqfA_raWP3k9l';

export function getSupabaseConfig(): { url: string; anonKey: string; isConfigured: boolean } {
  const envUrl = (import.meta as unknown as { env?: Record<string, string> }).env
    ?.VITE_SUPABASE_URL;
  const envKey = (import.meta as unknown as { env?: Record<string, string> }).env
    ?.VITE_SUPABASE_ANON_KEY;

  const localUrl =
    typeof localStorage !== 'undefined'
      ? localStorage.getItem(STORAGE_KEYS.SUPABASE_URL) || ''
      : '';
  const localKey =
    typeof localStorage !== 'undefined'
      ? localStorage.getItem(STORAGE_KEYS.SUPABASE_KEY) || ''
      : '';

  const url = (localUrl || envUrl || DEFAULT_SUPABASE_URL).trim().replace(/\/$/, '');
  const anonKey = (localKey || envKey || DEFAULT_SUPABASE_KEY).trim();

  return {
    url,
    anonKey,
    isConfigured: Boolean(url.startsWith('https://') && anonKey.length > 20),
  };
}

export function saveSupabaseConfig(url: string, anonKey: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SUPABASE_URL, url.trim());
    localStorage.setItem(STORAGE_KEYS.SUPABASE_KEY, anonKey.trim());
  } catch {
    // Ignore
  }
}

function getSupabaseHeaders(anonKey: string, extra?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = {
    apikey: anonKey,
    ...extra,
  };
  // Only attach Authorization: Bearer if the key is a JWT (starts with eyJ)
  if (anonKey.startsWith('eyJ')) {
    headers.Authorization = `Bearer ${anonKey}`;
  }
  return headers;
}

interface SupabaseProfileRow {
  id: string;
  username: string;
  title: string;
  avatar_card_id: string;
  elo_rating: number;
  pvp_wins: number;
  pvp_losses: number;
  gold?: number;
  updated_at?: string;
}

function hydrateProfileFromRow(
  row: SupabaseProfileRow,
  localMatch?: SovereignUserProfile
): SovereignUserProfile {
  const resolvedAvatar =
    row.avatar_card_id && CARDS_BY_ID[row.avatar_card_id]
      ? row.avatar_card_id
      : 'neutral_10_valkyra_pentacromatica';
  const meta = decodeCloudTitleMeta(row.title, resolvedAvatar);
  const updatedMs = row.updated_at ? new Date(row.updated_at).getTime() : undefined;
  const cleanName = (row.username || '').trim();
  const isMasterAdmin = MASTER_ADMIN_USERNAMES.includes(cleanName.toLowerCase());
  return {
    id: localMatch?.id ?? `sov_${row.id}`,
    username: row.username,
    email: meta.email || localMatch?.email,
    passwordHash: meta.passwordHash || localMatch?.passwordHash,
    title: meta.title,
    avatarCardId: resolvedAvatar,
    eloRating: row.elo_rating ?? 1200,
    pvpWins: row.pvp_wins ?? 0,
    pvpLosses: row.pvp_losses ?? 0,
    preferredDeckId: meta.preferredDeckId || localMatch?.preferredDeckId || 'deck_red_inferno',
    gold: meta.gold ?? row.gold ?? localMatch?.gold ?? 0,
    customDecks: meta.customDecks ?? localMatch?.customDecks ?? [],
    starterDeckCardIds: meta.starterDeckCardIds ?? localMatch?.starterDeckCardIds ?? [],
    extraUnlockedCards: meta.extraUnlockedCards ?? localMatch?.extraUnlockedCards ?? {},
    defeatedBossIds: meta.defeatedBossIds ?? localMatch?.defeatedBossIds ?? [],
    arenaWins: meta.arenaWins ?? localMatch?.arenaWins ?? 0,
    isAdmin: Boolean(isMasterAdmin || meta.isAdmin || localMatch?.isAdmin),
    createdAt: meta.createdAt ?? localMatch?.createdAt ?? updatedMs,
    lastActiveAt: meta.lastActiveAt ?? updatedMs ?? localMatch?.lastActiveAt,
  };
}

/**
 * Authenticates a Sovereign Account by Nickname or Email + Password.
 */
export async function authenticateSovereignAccount(
  identifierInput: string,
  rawPassword: string
): Promise<{ ok: boolean; profile?: SovereignUserProfile; error?: string }> {
  const cleanId = identifierInput.trim();
  const cleanLower = cleanId.toLowerCase();
  if (!cleanId) {
    return { ok: false, error: 'Informe seu Nickname ou E-mail.' };
  }
  if (!rawPassword.trim()) {
    return { ok: false, error: 'Informe sua Senha.' };
  }

  const inputHash = hashPassword(rawPassword);
  const localRoster = getSavedAccountsRoster();
  const localMatch = localRoster.find(
    (a) =>
      a.username.toLowerCase() === cleanLower ||
      (a.email && a.email.toLowerCase() === cleanLower)
  );

  const cfg = getSupabaseConfig();
  if (cfg.isConfigured) {
    try {
      const res = await fetch(
        `${cfg.url}/rest/v1/sovereign_profiles?select=*&limit=500`,
        {
          headers: getSupabaseHeaders(cfg.anonKey),
        }
      );
      if (res.ok) {
        const rows = (await res.json()) as SupabaseProfileRow[];
        const matchedRow = rows.find((r) => {
          if (!r.username || r.username.startsWith('__')) return false;
          if (r.username.toLowerCase() === cleanLower) return true;
          const meta = decodeCloudTitleMeta(r.title, r.avatar_card_id);
          return Boolean(meta.email && meta.email.toLowerCase() === cleanLower);
        });

        if (matchedRow) {
          const cloudProfile = hydrateProfileFromRow(matchedRow, localMatch);
          if (cloudProfile.passwordHash && cloudProfile.passwordHash !== inputHash) {
            return {
              ok: false,
              error: 'Senha incorreta. Verifique sua senha ou clique em "Esqueci minha senha".',
            };
          }
          // If legacy account had no passwordHash yet, bind this password now
          if (!cloudProfile.passwordHash) {
            cloudProfile.passwordHash = inputHash;
          }
          const ensuredCloud = ensureStarterDeckForUser(cloudProfile);
          setActiveTabUserProfile(ensuredCloud);
          return { ok: true, profile: ensuredCloud };
        }
      }
    } catch {
      // Fallback to local
    }
  }

  if (localMatch) {
    if (localMatch.passwordHash && localMatch.passwordHash !== inputHash) {
      return {
        ok: false,
        error: 'Senha incorreta. Verifique sua senha ou clique em "Esqueci minha senha".',
      };
    }
    const ensuredLocal = ensureStarterDeckForUser(localMatch);
    setActiveTabUserProfile(ensuredLocal);
    return { ok: true, profile: ensuredLocal };
  }

  return {
    ok: false,
    error: `Conta "${cleanId}" não encontrada. Clique na aba "✨ Criar Nova Conta" para se cadastrar!`,
  };
}

/**
 * Recovers and resets a Sovereign Account password by verifying Nickname + Registered Email.
 */
export async function recoverAndResetPassword(
  usernameInput: string,
  emailInput: string,
  newRawPassword: string
): Promise<{ ok: boolean; profile?: SovereignUserProfile; error?: string }> {
  const cleanUser = usernameInput.trim();
  const cleanEmail = emailInput.trim().toLowerCase();
  if (!cleanUser || !cleanEmail) {
    return { ok: false, error: 'Preencha o Nickname e o E-mail cadastrado na conta.' };
  }
  if (newRawPassword.trim().length < 4) {
    return { ok: false, error: 'A nova senha deve ter pelo menos 4 caracteres.' };
  }

  const localMatch = getSavedAccountsRoster().find(
    (a) => a.username.toLowerCase() === cleanUser.toLowerCase()
  );

  const cfg = getSupabaseConfig();
  if (cfg.isConfigured) {
    try {
      const res = await fetch(
        `${cfg.url}/rest/v1/sovereign_profiles?username=ilike.${encodeURIComponent(cleanUser)}&limit=1`,
        {
          headers: getSupabaseHeaders(cfg.anonKey),
        }
      );
      if (res.ok) {
        const rows = (await res.json()) as SupabaseProfileRow[];
        if (rows.length > 0) {
          const cloudProfile = hydrateProfileFromRow(rows[0], localMatch);
          if (cloudProfile.email && cloudProfile.email.toLowerCase() !== cleanEmail) {
            return {
              ok: false,
              error: 'O E-mail informado não corresponde ao E-mail cadastrado para este Nickname.',
            };
          }
          cloudProfile.email = cleanEmail;
          cloudProfile.passwordHash = hashPassword(newRawPassword);
          const ensuredCloud = ensureStarterDeckForUser(cloudProfile);
          setActiveTabUserProfile(ensuredCloud);
          return { ok: true, profile: ensuredCloud };
        }
      }
    } catch {
      // Fallback to local
    }
  }

  if (localMatch) {
    if (localMatch.email && localMatch.email.toLowerCase() !== cleanEmail) {
      return {
        ok: false,
        error: 'O E-mail informado não corresponde ao E-mail cadastrado para este Nickname.',
      };
    }
    const updated: SovereignUserProfile = {
      ...localMatch,
      email: cleanEmail,
      passwordHash: hashPassword(newRawPassword),
    };
    const ensuredUpdated = ensureStarterDeckForUser(updated);
    setActiveTabUserProfile(ensuredUpdated);
    return { ok: true, profile: ensuredUpdated };
  }

  return {
    ok: false,
    error: `Nickname "${cleanUser}" não encontrado.`,
  };
}

async function syncProfileToSupabaseIfConfigured(profile: SovereignUserProfile): Promise<void> {
  const cfg = getSupabaseConfig();
  if (!cfg.isConfigured) return;

  try {
    await fetch(`${cfg.url}/rest/v1/sovereign_profiles?on_conflict=username`, {
      method: 'POST',
      headers: getSupabaseHeaders(cfg.anonKey, {
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      }),
      body: JSON.stringify({
        username: profile.username,
        title: encodeCloudTitleMeta(profile),
        avatar_card_id: profile.avatarCardId,
        elo_rating: profile.eloRating,
        pvp_wins: profile.pvpWins,
        pvp_losses: profile.pvpLosses,
        gold: profile.gold ?? 0,
        updated_at: new Date().toISOString(),
      }),
    });
  } catch {
    // Non-blocking cloud sync
  }
}

async function syncRoomToSupabaseIfConfigured(
  room: MultiplayerRoom,
  keepalive = false
): Promise<void> {
  const cfg = getSupabaseConfig();
  if (!cfg.isConfigured) return;

  try {
    await fetch(`${cfg.url}/rest/v1/multiplayer_rooms?on_conflict=code`, {
      method: 'POST',
      keepalive,
      headers: getSupabaseHeaders(cfg.anonKey, {
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      }),
      body: JSON.stringify({
        code: room.code,
        status: room.status,
        is_public_queue: room.isPublicQueue,
        host_id: room.host.id,
        host_name: room.host.username,
        host_title: room.host.title,
        host_avatar: room.host.avatarCardId,
        host_elo: room.host.eloRating,
        host_deck_id: room.host.deckId,
        guest_id: room.guest?.id ?? null,
        guest_name: room.guest?.username ?? null,
        guest_title: room.guest?.title ?? null,
        guest_avatar: room.guest?.avatarCardId ?? null,
        guest_elo: room.guest?.eloRating ?? null,
        guest_deck_id: room.guest?.deckId ?? null,
        game_state: room,
        updated_at: new Date().toISOString(),
      }),
    });
  } catch {
    // Non-blocking cloud sync
  }
}

async function deleteRoomFromSupabaseIfConfigured(
  roomCode: string,
  keepalive = false
): Promise<void> {
  const cfg = getSupabaseConfig();
  if (!cfg.isConfigured) return;

  try {
    await fetch(
      `${cfg.url}/rest/v1/multiplayer_rooms?code=eq.${encodeURIComponent(roomCode)}`,
      {
        method: 'DELETE',
        keepalive,
        headers: getSupabaseHeaders(cfg.anonKey),
      }
    );
  } catch {
    // Non-blocking cloud delete
  }
}

async function pollRoomsFromSupabaseIfConfigured(): Promise<void> {
  const cfg = getSupabaseConfig();
  if (!cfg.isConfigured) return;

  try {
    const res = await fetch(
      `${cfg.url}/rest/v1/multiplayer_rooms?select=code,status,game_state,updated_at&order=updated_at.desc&limit=30`,
      {
        headers: getSupabaseHeaders(cfg.anonKey),
      }
    );
    if (!res.ok) return;
    const rows = (await res.json()) as Array<{
      code: string;
      status: string;
      game_state: MultiplayerRoom | null;
    }>;

    for (const row of rows) {
      const remoteRoom = row.game_state;
      if (!remoteRoom || !remoteRoom.code) continue;
      const localRoom = roomsMap.get(remoteRoom.code);

      if (
        !localRoom ||
        remoteRoom.stateVersion > localRoom.stateVersion ||
        (remoteRoom.hostHeartbeatAt ?? 0) > (localRoom.hostHeartbeatAt ?? 0) ||
        (remoteRoom.guestHeartbeatAt ?? 0) > (localRoom.guestHeartbeatAt ?? 0) ||
        Boolean(remoteRoom.forfeitedByRole && !localRoom.forfeitedByRole)
      ) {
        handleIncomingMessage({ type: 'ROOM_UPSERT', room: remoteRoom });
        if (
          remoteRoom.canonicalState &&
          (!localRoom || remoteRoom.stateVersion > localRoom.stateVersion)
        ) {
          handleIncomingMessage({
            type: 'MATCH_STATE_SYNC',
            roomCode: remoteRoom.code,
            canonicalState: remoteRoom.canonicalState,
            stateVersion: remoteRoom.stateVersion,
            actorId: remoteRoom.lastActorId ?? '',
          });
        }
      }
    }
  } catch {
    // Ignore transient network errors
  }
}

// ============================================================================
// 4. REAL-TIME MULTI-TRANSPORT BUS (VITE RELAY + BROADCASTCHANNEL + STORAGE)
// ============================================================================

let broadcastChan: BroadcastChannel | null = null;
let sseSource: EventSource | null = null;
let busInitialized = false;
const messageSubscribers = new Set<(msg: MpNetworkMessage) => void>();
const roomsMap = new Map<string, MultiplayerRoom>();

function getCachedRooms(): MultiplayerRoom[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ROOMS_CACHE);
    if (raw) {
      const parsed = JSON.parse(raw) as MultiplayerRoom[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Ignore
  }
  return [];
}

function persistRoomsCache(): void {
  try {
    const list = Array.from(roomsMap.values()).filter(
      (r) => Date.now() - r.createdAt < 1000 * 60 * 60 * 2 // Keep recent rooms (2h)
    );
    localStorage.setItem(STORAGE_KEYS.ROOMS_CACHE, JSON.stringify(list));
  } catch {
    // Ignore
  }
}

function handleIncomingMessage(msg: MpNetworkMessage): void {
  if (msg.type === 'ROOMS_SNAPSHOT') {
    for (const r of msg.rooms) {
      if (r && r.code) {
        const existing = roomsMap.get(r.code);
        if (!existing || r.stateVersion >= existing.stateVersion) {
          roomsMap.set(r.code, r);
        }
      }
    }
    persistRoomsCache();
  } else if (msg.type === 'ROOM_UPSERT' && msg.room?.code) {
    const existing = roomsMap.get(msg.room.code);
    if (
      !existing ||
      msg.room.stateVersion >= existing.stateVersion ||
      (msg.room.hostHeartbeatAt ?? 0) > (existing.hostHeartbeatAt ?? 0) ||
      (msg.room.guestHeartbeatAt ?? 0) > (existing.guestHeartbeatAt ?? 0) ||
      Boolean(msg.room.forfeitedByRole && !existing.forfeitedByRole)
    ) {
      roomsMap.set(msg.room.code, msg.room);
      persistRoomsCache();
    }
  } else if (msg.type === 'ROOM_REMOVE') {
    roomsMap.delete(msg.roomCode);
    persistRoomsCache();
  } else if (msg.type === 'MATCH_STATE_SYNC') {
    const r = roomsMap.get(msg.roomCode);
    if (r && msg.stateVersion >= r.stateVersion) {
      const now = Date.now();
      r.canonicalState = msg.canonicalState;
      r.stateVersion = msg.stateVersion;
      r.lastActorId = msg.actorId;
      r.lastActivityAt = now;
      if (r.host.id === msg.actorId) r.hostHeartbeatAt = now;
      if (r.guest?.id === msg.actorId) r.guestHeartbeatAt = now;
      roomsMap.set(r.code, { ...r });
      persistRoomsCache();
    }
  } else if (msg.type === 'HEARTBEAT_PING') {
    const r = roomsMap.get(msg.roomCode);
    if (r) {
      r.lastActivityAt = msg.timestamp;
      if (msg.role === 'host') r.hostHeartbeatAt = msg.timestamp;
      else r.guestHeartbeatAt = msg.timestamp;
      roomsMap.set(r.code, { ...r });
    }
  } else if (msg.type === 'MATCH_FORFEIT') {
    const r = roomsMap.get(msg.roomCode);
    if (r) {
      const reasonText =
        msg.reason === 'surrender'
          ? `${msg.actorName} rendeu-se na batalha.`
          : `${msg.actorName} abandonou a sala ou perdeu a conexão.`;
      r.status = 'finished';
      r.forfeitedByRole = msg.role;
      r.forfeitReason = reasonText;
      r.lastActorId = msg.actorId;
      r.lastActivityAt = Date.now();
      r.stateVersion += 10;
      if (r.canonicalState) {
        r.canonicalState = {
          ...r.canonicalState,
          phase: 'gameover',
          winner: msg.role === 'host' ? 'ai' : 'player',
          winReason: reasonText,
        };
      }
      roomsMap.set(r.code, { ...r });
      persistRoomsCache();
    }
  }

  for (const sub of messageSubscribers) {
    sub(msg);
  }
}

export function initMultiplayerNetworkBus(): void {
  if (typeof window === 'undefined' || busInitialized) return;
  busInitialized = true;

  // Hydrate initial rooms from localStorage
  for (const r of getCachedRooms()) {
    roomsMap.set(r.code, r);
  }

  // 1. BroadcastChannel (Instant cross-tab sync)
  if ('BroadcastChannel' in window) {
    broadcastChan = new BroadcastChannel('chromatic_pact_mp_v1');
    broadcastChan.onmessage = (ev) => {
      if (ev.data && typeof ev.data === 'object') {
        handleIncomingMessage(ev.data as MpNetworkMessage);
      }
    };
  }

  // 2. Window storage listener (Fallback cross-tab sync)
  window.addEventListener('storage', (ev) => {
    if (ev.key === STORAGE_KEYS.ROOMS_CACHE && ev.newValue) {
      try {
        const rooms = JSON.parse(ev.newValue) as MultiplayerRoom[];
        handleIncomingMessage({ type: 'ROOMS_SNAPSHOT', rooms });
      } catch {
        // Ignore
      }
    }
  });

  // 3. Vite Built-in SSE Relay (Cross-browser / Incognito / LAN sync)
  try {
    sseSource = new EventSource('/api/mp/stream');
    sseSource.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data) as MpNetworkMessage;
        handleIncomingMessage(msg);
      } catch {
        // Ignore
      }
    };
    sseSource.onerror = () => {
      // Static hosting without Vite dev server will silently use BroadcastChannel/Supabase
    };
  } catch {
    // Ignore
  }

  // 4. Supabase Cloud Sync Loop (Cross-Internet global 1v1 sync)
  pollRoomsFromSupabaseIfConfigured();
  window.setInterval(() => {
    pollRoomsFromSupabaseIfConfigured();
  }, 1500);
}

export function publishMpMessage(msg: MpNetworkMessage): void {
  initMultiplayerNetworkBus();
  handleIncomingMessage(msg);

  if (broadcastChan) {
    try {
      broadcastChan.postMessage(msg);
    } catch {
      // Ignore
    }
  }

  // Post to Vite Relay for cross-browser / LAN players
  const isUrgentLifecycle = msg.type === 'MATCH_FORFEIT' || msg.type === 'ROOM_REMOVE';
  fetch('/api/mp/publish', {
    method: 'POST',
    keepalive: isUrgentLifecycle,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(msg),
  }).catch(() => {
    // Ignore on static build
  });

  if (msg.type === 'ROOM_UPSERT') {
    syncRoomToSupabaseIfConfigured(msg.room);
  } else if (
    msg.type === 'MATCH_STATE_SYNC' ||
    msg.type === 'HEARTBEAT_PING' ||
    msg.type === 'MATCH_FORFEIT'
  ) {
    const updatedRoom = roomsMap.get(msg.roomCode);
    if (updatedRoom) {
      syncRoomToSupabaseIfConfigured(updatedRoom, msg.type === 'MATCH_FORFEIT');
    }
  } else if (msg.type === 'MULLIGAN_SIDE_SYNC') {
    const r = roomsMap.get(msg.roomCode);
    if (r && r.canonicalState) {
      const nextCanonical: GameState =
        msg.role === 'host'
          ? {
              ...r.canonicalState,
              player: { ...r.canonicalState.player, hand: msg.hand, deck: msg.deck },
            }
          : {
              ...r.canonicalState,
              ai: { ...r.canonicalState.ai, hand: msg.hand, deck: msg.deck },
            };
      r.canonicalState = nextCanonical;
      r.stateVersion += 1;
      roomsMap.set(r.code, { ...r });
      syncRoomToSupabaseIfConfigured(r);
    }
  } else if (msg.type === 'ROOM_REMOVE') {
    deleteRoomFromSupabaseIfConfigured(msg.roomCode, true);
  }
}

export function subscribeMultiplayerBus(cb: (msg: MpNetworkMessage) => void): () => void {
  initMultiplayerNetworkBus();
  messageSubscribers.add(cb);
  cb({ type: 'ROOMS_SNAPSHOT', rooms: Array.from(roomsMap.values()) });
  return () => {
    messageSubscribers.delete(cb);
  };
}

export function getActiveRoomsList(): MultiplayerRoom[] {
  initMultiplayerNetworkBus();
  const now = Date.now();
  return Array.from(roomsMap.values())
    .filter((r) => {
      if (r.status === 'waiting') {
        const lastSeen = r.hostHeartbeatAt ?? r.lastActivityAt ?? r.createdAt;
        return now - lastSeen < 1000 * 60 * 10; // Hide abandoned waiting rooms older than 10 min
      }
      return true;
    })
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function getRoomByCode(code: string): MultiplayerRoom | undefined {
  initMultiplayerNetworkBus();
  return roomsMap.get(code.trim().toUpperCase());
}

export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  for (let i = 0; i < 4; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `PACT-${suffix}`;
}

// ============================================================================
// 5. SOVEREIGN ADMINISTRATION & CLOUD TELEMETRY API (FOR ADMIN tsm81)
// ============================================================================

export interface CloudVisitorSessionEntry {
  sessionId: string;
  firstSeenAt: number;
  lastSeenAt: number;
  landingUrl: string;
  gclid?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  events: string[];
  registeredUsername?: string;
  userAgentSummary?: string;
  screenSize?: string;
}

export interface GlobalAdminAnnouncement {
  id: string;
  kicker: string;
  title: string;
  message: string;
  createdAt: number;
  author: string;
}

export async function fetchAllCloudProfilesForAdmin(): Promise<{
  profiles: SovereignUserProfile[];
  visitorSessions: CloudVisitorSessionEntry[];
  announcement: GlobalAdminAnnouncement | null;
  latencyMs: number;
  error?: string;
}> {
  const cfg = getSupabaseConfig();
  const localRoster = getSavedAccountsRoster();
  const startMs = performance.now();

  if (!cfg.isConfigured) {
    return {
      profiles: localRoster,
      visitorSessions: [],
      announcement: null,
      latencyMs: 0,
      error: 'Supabase não configurado.',
    };
  }

  try {
    const res = await fetch(
      `${cfg.url}/rest/v1/sovereign_profiles?select=*&order=updated_at.desc&limit=500`,
      {
        headers: getSupabaseHeaders(cfg.anonKey),
      }
    );
    const latencyMs = Math.round(performance.now() - startMs);
    if (!res.ok) {
      return {
        profiles: localRoster,
        visitorSessions: [],
        announcement: null,
        latencyMs,
        error: `HTTP ${res.status}`,
      };
    }

    const rows = (await res.json()) as SupabaseProfileRow[];
    const profiles: SovereignUserProfile[] = [];
    const visitorSessions: CloudVisitorSessionEntry[] = [];
    let announcement: GlobalAdminAnnouncement | null = null;
    const seenUsernames = new Set<string>();

    for (const r of rows) {
      if (!r.username) continue;
      if (r.username.startsWith('__telemetry_session__:')) {
        try {
          const parsed = JSON.parse(r.title) as CloudVisitorSessionEntry;
          if (parsed && parsed.sessionId) {
            visitorSessions.push(parsed);
          }
        } catch {
          // Ignore malformed telemetry row
        }
        continue;
      }
      if (r.username === '__admin_global_announcement__') {
        try {
          const parsed = JSON.parse(r.title) as GlobalAdminAnnouncement;
          if (parsed && parsed.title) {
            announcement = parsed;
          }
        } catch {
          // Ignore
        }
        continue;
      }
      if (r.username.startsWith('__')) continue;

      const localMatch = localRoster.find(
        (a) => a.username.toLowerCase() === r.username.toLowerCase()
      );
      const hydrated = hydrateProfileFromRow(r, localMatch);
      profiles.push(hydrated);
      seenUsernames.add(r.username.toLowerCase());
    }

    for (const localAcc of localRoster) {
      if (!seenUsernames.has(localAcc.username.toLowerCase())) {
        profiles.push(localAcc);
      }
    }

    visitorSessions.sort((a, b) => b.lastSeenAt - a.lastSeenAt);

    return {
      profiles,
      visitorSessions,
      announcement,
      latencyMs,
    };
  } catch (err) {
    return {
      profiles: localRoster,
      visitorSessions: [],
      announcement: null,
      latencyMs: Math.round(performance.now() - startMs),
      error: err instanceof Error ? err.message : 'Erro de conexão com Supabase',
    };
  }
}

export async function adminSaveCloudProfile(
  profile: SovereignUserProfile
): Promise<{ ok: boolean; error?: string }> {
  const cfg = getSupabaseConfig();
  saveAccountToRoster(profile);

  // Also update active tab profile if it's the same user
  try {
    const active = getActiveTabUserProfile();
    if (active.username.toLowerCase() === profile.username.toLowerCase()) {
      setActiveTabUserProfile(profile);
    }
  } catch {
    // Ignore
  }

  if (!cfg.isConfigured) {
    return { ok: true };
  }

  try {
    const res = await fetch(`${cfg.url}/rest/v1/sovereign_profiles?on_conflict=username`, {
      method: 'POST',
      headers: getSupabaseHeaders(cfg.anonKey, {
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      }),
      body: JSON.stringify({
        username: profile.username,
        title: encodeCloudTitleMeta(profile),
        avatar_card_id: profile.avatarCardId,
        elo_rating: profile.eloRating,
        pvp_wins: profile.pvpWins,
        pvp_losses: profile.pvpLosses,
        gold: profile.gold ?? 0,
        updated_at: new Date().toISOString(),
      }),
    });
    if (!res.ok) {
      return { ok: false, error: `HTTP ${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Falha na gravação em nuvem' };
  }
}

export async function adminDeleteCloudProfile(username: string): Promise<boolean> {
  const cfg = getSupabaseConfig();
  try {
    const remaining = getSavedAccountsRoster().filter(
      (a) => a.username.toLowerCase() !== username.toLowerCase()
    );
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS_ROSTER, JSON.stringify(remaining));
  } catch {
    // Ignore
  }

  if (!cfg.isConfigured) return true;
  try {
    const res = await fetch(
      `${cfg.url}/rest/v1/sovereign_profiles?username=eq.${encodeURIComponent(username)}`,
      {
        method: 'DELETE',
        headers: getSupabaseHeaders(cfg.anonKey),
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}

export function buildFullUnlockedCollectionMap(): Record<string, number> {
  const full: Record<string, number> = {};
  for (const card of ALL_CARDS) {
    full[card.id] = card.rarity === 'legendary' ? 1 : 2;
  }
  return full;
}

export async function fetchAllCloudRoomsForAdmin(): Promise<
  Array<{
    code: string;
    status: string;
    isPublicQueue: boolean;
    updatedAt: string;
    room: MultiplayerRoom | null;
  }>
> {
  const cfg = getSupabaseConfig();
  if (!cfg.isConfigured) return [];
  try {
    const res = await fetch(
      `${cfg.url}/rest/v1/multiplayer_rooms?select=code,status,is_public_queue,game_state,updated_at&order=updated_at.desc&limit=100`,
      {
        headers: getSupabaseHeaders(cfg.anonKey),
      }
    );
    if (!res.ok) return [];
    const rows = (await res.json()) as Array<{
      code: string;
      status: string;
      is_public_queue: boolean;
      updated_at: string;
      game_state: MultiplayerRoom | null;
    }>;
    return rows.map((r) => ({
      code: r.code,
      status: r.status,
      isPublicQueue: r.is_public_queue,
      updatedAt: r.updated_at,
      room: r.game_state,
    }));
  } catch {
    return [];
  }
}

export async function adminDeleteCloudRoom(roomCode: string): Promise<boolean> {
  roomsMap.delete(roomCode);
  persistRoomsCache();
  await deleteRoomFromSupabaseIfConfigured(roomCode, true);
  return true;
}

export async function syncVisitorSessionToCloud(session: CloudVisitorSessionEntry): Promise<void> {
  const cfg = getSupabaseConfig();
  if (!cfg.isConfigured) return;
  try {
    await fetch(`${cfg.url}/rest/v1/sovereign_profiles?on_conflict=username`, {
      method: 'POST',
      headers: getSupabaseHeaders(cfg.anonKey, {
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      }),
      body: JSON.stringify({
        username: `__telemetry_session__:${session.sessionId}`,
        title: JSON.stringify(session),
        avatar_card_id: 'neutral_10_valkyra_pentacromatica',
        elo_rating: session.events.length,
        pvp_wins: session.registeredUsername ? 1 : 0,
        pvp_losses: 0,
        gold: 0,
        updated_at: new Date().toISOString(),
      }),
    });
  } catch {
    // Non-blocking
  }
}

export async function clearCloudVisitorTelemetryForAdmin(): Promise<boolean> {
  const cfg = getSupabaseConfig();
  if (!cfg.isConfigured) return false;
  try {
    const res = await fetch(
      `${cfg.url}/rest/v1/sovereign_profiles?username=like.__telemetry_session__:*`,
      {
        method: 'DELETE',
        headers: getSupabaseHeaders(cfg.anonKey),
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}

export async function publishGlobalAdminAnnouncement(
  announcement: GlobalAdminAnnouncement | null
): Promise<boolean> {
  const cfg = getSupabaseConfig();
  if (!cfg.isConfigured) return false;
  try {
    if (!announcement) {
      const res = await fetch(
        `${cfg.url}/rest/v1/sovereign_profiles?username=eq.__admin_global_announcement__`,
        {
          method: 'DELETE',
          headers: getSupabaseHeaders(cfg.anonKey),
        }
      );
      return res.ok;
    }
    const res = await fetch(`${cfg.url}/rest/v1/sovereign_profiles?on_conflict=username`, {
      method: 'POST',
      headers: getSupabaseHeaders(cfg.anonKey, {
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      }),
      body: JSON.stringify({
        username: '__admin_global_announcement__',
        title: JSON.stringify(announcement),
        avatar_card_id: 'neutral_10_valkyra_pentacromatica',
        elo_rating: 1200,
        pvp_wins: 0,
        pvp_losses: 0,
        gold: 0,
        updated_at: new Date().toISOString(),
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchGlobalAdminAnnouncement(): Promise<GlobalAdminAnnouncement | null> {
  const cfg = getSupabaseConfig();
  if (!cfg.isConfigured) return null;
  try {
    const res = await fetch(
      `${cfg.url}/rest/v1/sovereign_profiles?username=eq.__admin_global_announcement__&select=title&limit=1`,
      {
        headers: getSupabaseHeaders(cfg.anonKey),
      }
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as Array<{ title: string }>;
    if (rows.length > 0 && rows[0].title) {
      return JSON.parse(rows[0].title) as GlobalAdminAnnouncement;
    }
    return null;
  } catch {
    return null;
  }
}
