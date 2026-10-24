import { CardDefinition, DomainExpansionState, GameState, PlayerState } from '../types/game';
import { ALL_CARDS, CARDS_BY_ID } from '../data/cards';
import { LEGENDARY_CREATURE_BIOGRAPHIES } from '../data/legendaryCreaturesLore';

export interface SovereignUserProfile {
  id: string;
  username: string;
  email?: string;
  title: string;
  avatarCardId: string;
  eloRating: number;
  pvpWins: number;
  pvpLosses: number;
  preferredDeckId: string;
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
      type: 'EMOTE_PING';
      roomCode: string;
      senderId: string;
      senderName: string;
      emote: string;
    };

const STORAGE_KEYS = {
  ACCOUNTS_ROSTER: 'chromatic_pact_accounts_roster_v1',
  TAB_ACTIVE_USER: 'chromatic_pact_tab_user_v1',
  ROOMS_CACHE: 'chromatic_pact_mp_rooms_v1',
  SUPABASE_URL: 'chromatic_pact_supabase_url_v1',
  SUPABASE_KEY: 'chromatic_pact_supabase_key_v1',
};

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

const DEFAULT_TEST_ACCOUNTS: SovereignUserProfile[] = [
  {
    id: 'sov_player_1',
    username: 'Kaelen_Soberano',
    title: 'Soberano da Fratura',
    avatarCardId: 'red_08_dragao_vermelho',
    eloRating: 1240,
    pvpWins: 3,
    pvpLosses: 1,
    preferredDeckId: 'deck_red_aggro',
  },
  {
    id: 'sov_player_2',
    username: 'Vaeloria_Astral',
    title: 'Oráculo do Véu Glacial',
    avatarCardId: 'neutral_54_dragao_etereo',
    eloRating: 1215,
    pvpWins: 2,
    pvpLosses: 1,
    preferredDeckId: 'deck_blue_control',
  },
];

export function getSavedAccountsRoster(): SovereignUserProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACCOUNTS_ROSTER);
    if (raw) {
      const parsed = JSON.parse(raw) as SovereignUserProfile[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // Ignore storage error
  }
  try {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS_ROSTER, JSON.stringify(DEFAULT_TEST_ACCOUNTS));
  } catch {
    // Ignore
  }
  return DEFAULT_TEST_ACCOUNTS;
}

export function saveAccountToRoster(profile: SovereignUserProfile): SovereignUserProfile[] {
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

export function getActiveTabUserProfile(): SovereignUserProfile {
  try {
    const tabSaved = sessionStorage.getItem(STORAGE_KEYS.TAB_ACTIVE_USER);
    if (tabSaved) {
      return JSON.parse(tabSaved) as SovereignUserProfile;
    }
  } catch {
    // Ignore
  }

  // If this is a second tab opened for testing, automatically pick the 2nd account if Tab 1 is hosting!
  const roster = getSavedAccountsRoster();
  const existingRooms = getCachedRooms();
  const hostIdsInWaiting = new Set(existingRooms.map((r) => r.host.id));
  const picked =
    roster.find((acc) => !hostIdsInWaiting.has(acc.id)) ?? roster[0] ?? DEFAULT_TEST_ACCOUNTS[0];

  setActiveTabUserProfile(picked);
  return picked;
}

export function setActiveTabUserProfile(profile: SovereignUserProfile): void {
  try {
    sessionStorage.setItem(STORAGE_KEYS.TAB_ACTIVE_USER, JSON.stringify(profile));
  } catch {
    // Ignore
  }
  saveAccountToRoster(profile);
}

export function createNewSovereignAccount(params: {
  username: string;
  email?: string;
  avatarCardId: string;
  preferredDeckId: string;
}): SovereignUserProfile {
  const cleanName = params.username.trim() || `Soberano_${Math.floor(100 + Math.random() * 900)}`;
  const chosenAvatar = params.avatarCardId || 'neutral_10_valkyra_pentacromatica';
  const profile: SovereignUserProfile = {
    id: `sov_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    username: cleanName,
    email: params.email?.trim() || undefined,
    title: getAvatarHonorificTitle(chosenAvatar),
    avatarCardId: chosenAvatar,
    eloRating: 1200,
    pvpWins: 0,
    pvpLosses: 0,
    preferredDeckId: params.preferredDeckId,
  };
  setActiveTabUserProfile(profile);
  return profile;
}

/**
 * Updates the active Sovereign user's profile (Avatar, Automatic Honorific Title, Email, Preferred Deck)
 * while keeping the Nickname (`username`) strictly immutable.
 */
export function updateSovereignAccountProfile(
  currentProfile: SovereignUserProfile,
  updates: {
    email?: string;
    avatarCardId: string;
    preferredDeckId?: string;
  }
): SovereignUserProfile {
  const nextAvatar = updates.avatarCardId || currentProfile.avatarCardId;
  const updated: SovereignUserProfile = {
    ...currentProfile,
    // username is strictly preserved (immutable)
    username: currentProfile.username,
    email: updates.email !== undefined ? updates.email.trim() || undefined : currentProfile.email,
    avatarCardId: nextAvatar,
    title: getAvatarHonorificTitle(nextAvatar),
    preferredDeckId: updates.preferredDeckId ?? currentProfile.preferredDeckId,
  };
  setActiveTabUserProfile(updated);
  return updated;
}

export function recordPvpMatchResult(
  profile: SovereignUserProfile,
  didWin: boolean
): SovereignUserProfile {
  const eloDelta = didWin ? 25 : -18;
  const updated: SovereignUserProfile = {
    ...profile,
    eloRating: Math.max(800, profile.eloRating + eloDelta),
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

export async function loginOrFetchAccountFromSupabase(
  usernameInput: string
): Promise<SovereignUserProfile | null> {
  const clean = usernameInput.trim();
  if (!clean) return null;

  // Check local roster first
  const localMatch = getSavedAccountsRoster().find(
    (a) => a.username.toLowerCase() === clean.toLowerCase()
  );

  const cfg = getSupabaseConfig();
  if (cfg.isConfigured) {
    try {
      const res = await fetch(
        `${cfg.url}/rest/v1/sovereign_profiles?username=ilike.${encodeURIComponent(clean)}&limit=1`,
        {
          headers: getSupabaseHeaders(cfg.anonKey),
        }
      );
      if (res.ok) {
        const rows = (await res.json()) as Array<{
          id: string;
          username: string;
          title: string;
          avatar_card_id: string;
          elo_rating: number;
          pvp_wins: number;
          pvp_losses: number;
        }>;
        if (rows.length > 0) {
          const row = rows[0];
          const resolvedAvatar =
            row.avatar_card_id && CARDS_BY_ID[row.avatar_card_id]
              ? row.avatar_card_id
              : 'neutral_10_valkyra_pentacromatica';
          const cloudProfile: SovereignUserProfile = {
            id: localMatch?.id ?? `sov_${row.id}`,
            username: row.username,
            email: localMatch?.email,
            title: getAvatarHonorificTitle(resolvedAvatar),
            avatarCardId: resolvedAvatar,
            eloRating: row.elo_rating ?? 1200,
            pvpWins: row.pvp_wins ?? 0,
            pvpLosses: row.pvp_losses ?? 0,
            preferredDeckId: localMatch?.preferredDeckId || 'deck_red_aggro',
          };
          setActiveTabUserProfile(cloudProfile);
          return cloudProfile;
        }
      }
    } catch {
      // Fallback to local
    }
  }

  if (localMatch) {
    setActiveTabUserProfile(localMatch);
    return localMatch;
  }
  return null;
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
        title: profile.title,
        avatar_card_id: profile.avatarCardId,
        elo_rating: profile.eloRating,
        pvp_wins: profile.pvpWins,
        pvp_losses: profile.pvpLosses,
      }),
    });
  } catch {
    // Non-blocking cloud sync
  }
}

async function syncRoomToSupabaseIfConfigured(room: MultiplayerRoom): Promise<void> {
  const cfg = getSupabaseConfig();
  if (!cfg.isConfigured) return;

  try {
    await fetch(`${cfg.url}/rest/v1/multiplayer_rooms?on_conflict=code`, {
      method: 'POST',
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

async function deleteRoomFromSupabaseIfConfigured(roomCode: string): Promise<void> {
  const cfg = getSupabaseConfig();
  if (!cfg.isConfigured) return;

  try {
    await fetch(
      `${cfg.url}/rest/v1/multiplayer_rooms?code=eq.${encodeURIComponent(roomCode)}`,
      {
        method: 'DELETE',
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

      if (!localRoom || remoteRoom.stateVersion > localRoom.stateVersion) {
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
    if (!existing || msg.room.stateVersion >= existing.stateVersion) {
      roomsMap.set(msg.room.code, msg.room);
      persistRoomsCache();
    }
  } else if (msg.type === 'ROOM_REMOVE') {
    roomsMap.delete(msg.roomCode);
    persistRoomsCache();
  } else if (msg.type === 'MATCH_STATE_SYNC') {
    const r = roomsMap.get(msg.roomCode);
    if (r && msg.stateVersion >= r.stateVersion) {
      r.canonicalState = msg.canonicalState;
      r.stateVersion = msg.stateVersion;
      r.lastActorId = msg.actorId;
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
  fetch('/api/mp/publish', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(msg),
  }).catch(() => {
    // Ignore on static build
  });

  if (msg.type === 'ROOM_UPSERT') {
    syncRoomToSupabaseIfConfigured(msg.room);
  } else if (msg.type === 'MATCH_STATE_SYNC') {
    const updatedRoom = roomsMap.get(msg.roomCode);
    if (updatedRoom) {
      syncRoomToSupabaseIfConfigured(updatedRoom);
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
    deleteRoomFromSupabaseIfConfigured(msg.roomCode);
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
  return Array.from(roomsMap.values()).sort((a, b) => b.createdAt - a.createdAt);
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
