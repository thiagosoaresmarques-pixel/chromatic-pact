import { AiSkillTier, CardDefinition, Domain, DomainExpansionState, GameState, PlayerState, PrebuiltDeck } from '../types/game';
import { ALL_CARDS, CARDS_BY_ID } from '../data/cards';
import { CAMPAIGN_BOSSES, PREBUILT_DECKS } from '../data/decks';
import { LEGENDARY_CREATURE_TITLES } from '../data/legendaryCreatureTitles';
import type { UnifiedFormatKind } from '../data/aiUnifiedTournamentData';
import {
  calculateFideRankedEloDelta,
  ELO_SCHEMA_VERSION,
  INITIAL_PLAYER_ELO,
} from '../data/eloDivisions';
import type { SovereignAiLeaderboardEntry } from '../data/sovereignEloLadderData';

export const VICTORY_GOLD_REWARD = 10;
export const STARTER_GOLD = 160;
export const GRIMOIRE_REPLACEMENT_GOLD_COST = 100;
export const CAMPAIGN_RESET_VERSION = 1;

export const MONOCHROMATIC_STARTER_DECKS: PrebuiltDeck[] = PREBUILT_DECKS.filter(
  (d) => d.domains.length === 1
);

export interface SovereignSavedDeck {
  id: string;
  name: string;
  domain?: Domain;
  cardIds: string[];
  updatedAt?: number;
  wins?: number;
  losses?: number;
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

export interface RankedMatchHistoryItem {
  id: string;
  timestamp: number;
  opponentName: string;
  opponentElo: number;
  opponentAvatarCardId?: string;
  mode: 'sovereign' | 'pvp';
  didWin: boolean;
  deltaElo: number;
  newElo: number;
  replayShareId?: string;
}

let latestPersonalMatchShareIdResolver: (() => string | undefined) | null = null;
export function registerPersonalMatchShareIdResolver(fn: () => string | undefined): void {
  latestPersonalMatchShareIdResolver = fn;
}

export interface SovereignUserProfile {
  id: string;
  username: string;
  email?: string;
  passwordHash?: string;
  title: string;
  avatarCardId: string;
  eloRating: number;
  eloBaseVersion?: number;
  campaignResetVersion?: number;
  pvpWins: number;
  pvpLosses: number;
  rankedSovereignWins?: number;
  rankedSovereignLosses?: number;
  recentRankedOpponentIds?: string[];
  recentRankedHistory?: RankedMatchHistoryItem[];
  preferredDeckId: string;
  gold?: number;
  astralShards?: number;
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
  GRIMOIRE_RESET_V4: 'chromatic_pact_grimoire_reset_v4',
  CAMPAIGN_RESET_V1: 'chromatic_pact_campaign_reset_v1',
};

function estimateCampaignBossRewardGold(bossId: string): number {
  const legacy = CAMPAIGN_BOSSES_GOLD_BY_ID.get(bossId);
  if (legacy !== undefined) return legacy;
  if (bossId.includes('_t1_')) return 16;
  if (bossId.includes('_t2_')) return 24;
  if (bossId.includes('_t3_')) return 35;
  if (bossId.includes('_t4_')) return 50;
  if (bossId.includes('_t5_')) return bossId.includes('capital_axial') ? 100 : 80;
  return VICTORY_GOLD_REWARD;
}

const CAMPAIGN_BOSSES_GOLD_BY_ID: Map<string, number> = new Map(
  CAMPAIGN_BOSSES.map((b) => [b.id, b.rewardGold ?? VICTORY_GOLD_REWARD])
);

/**
 * Reseta integralmente o progresso de Campanha e todos os seus efeitos derivados
 * (chefes vencidos, cartas desbloqueadas em campanha, ouro/estilhaços ganhos na campanha
 * e vitórias de campanha/relíquias associadas) para perfis anteriores ao CAMPAIGN_RESET_VERSION.
 */
export function resetCampaignProgressionForProfile(
  profile: SovereignUserProfile
): { profile: SovereignUserProfile; wasReset: boolean } {
  if (isUnregisteredProfile(profile)) {
    return {
      profile: {
        ...profile,
        campaignResetVersion: CAMPAIGN_RESET_VERSION,
      },
      wasReset: false,
    };
  }

  if ((profile.campaignResetVersion ?? 0) >= CAMPAIGN_RESET_VERSION) {
    return { profile, wasReset: false };
  }

  const prevBosses = profile.defeatedBossIds ?? [];
  if (prevBosses.length === 0) {
    return {
      profile: {
        ...profile,
        defeatedBossIds: [],
        campaignResetVersion: CAMPAIGN_RESET_VERSION,
      },
      wasReset: true,
    };
  }

  let bossGoldEarned = 0;
  for (const bid of prevBosses) {
    bossGoldEarned += estimateCampaignBossRewardGold(bid);
  }
  const extraLandmarkEvents = Math.max(0, (profile.arenaWins ?? 0) - prevBosses.length);
  const landmarkGoldEarned = extraLandmarkEvents * 20;
  const nextGold = Math.max(0, (profile.gold ?? 0) - bossGoldEarned - landmarkGoldEarned);

  return {
    profile: {
      ...profile,
      gold: nextGold,
      astralShards: 0,
      arenaWins: 0,
      defeatedBossIds: [],
      extraUnlockedCards: {},
      campaignResetVersion: CAMPAIGN_RESET_VERSION,
    },
    wasReset: true,
  };
}

// Purge legacy v1 pre-seeded profiles, Grimoire Reset v4, and Campaign Full Reset v1
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('chromatic_pact_accounts_roster_v1');
    localStorage.removeItem('chromatic_pact_mp_rooms_v1');
    sessionStorage.removeItem('chromatic_pact_tab_user_v1');

    if (localStorage.getItem(STORAGE_KEYS.GRIMOIRE_RESET_V4) !== 'done') {
      const rawRoster = localStorage.getItem(STORAGE_KEYS.ACCOUNTS_ROSTER);
      if (rawRoster) {
        const parsedRoster = JSON.parse(rawRoster) as SovereignUserProfile[];
        if (Array.isArray(parsedRoster)) {
          const resetRoster = parsedRoster.map((acc) => ({
            ...acc,
            customDecks: [],
            starterDeckCardIds: [],
            preferredDeckId: '',
          }));
          localStorage.setItem(STORAGE_KEYS.ACCOUNTS_ROSTER, JSON.stringify(resetRoster));
        }
      }
      const rawTab = sessionStorage.getItem(STORAGE_KEYS.TAB_ACTIVE_USER);
      if (rawTab) {
        const parsedTab = JSON.parse(rawTab) as SovereignUserProfile;
        if (parsedTab && typeof parsedTab === 'object') {
          const resetTab: SovereignUserProfile = {
            ...parsedTab,
            customDecks: [],
            starterDeckCardIds: [],
            preferredDeckId: '',
          };
          sessionStorage.setItem(STORAGE_KEYS.TAB_ACTIVE_USER, JSON.stringify(resetTab));
        }
      }
      localStorage.setItem(STORAGE_KEYS.GRIMOIRE_RESET_V4, 'done');
    }

    if (localStorage.getItem(STORAGE_KEYS.CAMPAIGN_RESET_V1) !== 'done') {
      // 1. Limpar todas as sessões de mapa, marcos visitados, bônus de campo, névoa e relíquias equipadas da Campanha
      localStorage.removeItem('chromatic_pact_campaign_map_session_v1');
      localStorage.removeItem('chromatic_pact_campaign_banner_v1');
      localStorage.removeItem('chromatic_pact_ow_campaign_visited_v1');
      localStorage.removeItem('chromatic_pact_ow_pending_buff_v1_campaign');
      localStorage.removeItem('chromatic_pact_map_visited_realms_v1');
      localStorage.removeItem('chromatic_pact_equipped_relic_v1');

      // 2. Limpar eventual duelo de Campanha suspenso na navegação local
      const rawNav = localStorage.getItem('chromatic_pact_app_nav_state_v1');
      if (rawNav) {
        try {
          const nav = JSON.parse(rawNav) as Record<string, unknown>;
          if (
            nav &&
            nav.activeCampaignBoss &&
            !nav.isExpeditionBattle &&
            !nav.isDraftBattle &&
            !nav.activeRiftId &&
            !nav.activeConquestContext &&
            !nav.activeRankedSovereign
          ) {
            nav.activeCampaignBoss = null;
            nav.campaignPlayerDeckIds = null;
            nav.activeGeoModifiers = null;
            if (nav.activeTab === 'arena') nav.activeTab = 'home';
            localStorage.setItem('chromatic_pact_app_nav_state_v1', JSON.stringify(nav));
            localStorage.removeItem('chromatic_pact_active_battle_v1');
          }
        } catch {
          // Ignore malformed nav state
        }
      }

      // 3. Remover notificações antigas de espólios da Campanha
      const rawNotifs = localStorage.getItem('chromatic_pact_notifications_v1');
      if (rawNotifs) {
        try {
          const parsedNotifs = JSON.parse(rawNotifs) as Array<{ kicker?: string }>;
          if (Array.isArray(parsedNotifs)) {
            const filtered = parsedNotifs.filter(
              (n) =>
                n?.kicker !== 'TERRITÓRIO PACIFICADO & ESPÓLIOS' &&
                n?.kicker !== 'ESPÓLIOS DE BATALHA'
            );
            localStorage.setItem('chromatic_pact_notifications_v1', JSON.stringify(filtered));
          }
        } catch {
          // Ignore
        }
      }

      // 4. Resetar perfis salvos localmente em localStorage e sessionStorage
      const rawRoster = localStorage.getItem(STORAGE_KEYS.ACCOUNTS_ROSTER);
      if (rawRoster) {
        const parsedRoster = JSON.parse(rawRoster) as SovereignUserProfile[];
        if (Array.isArray(parsedRoster)) {
          const cleaned = parsedRoster.map((acc) => resetCampaignProgressionForProfile(acc).profile);
          localStorage.setItem(STORAGE_KEYS.ACCOUNTS_ROSTER, JSON.stringify(cleaned));
        }
      }
      const rawTab = sessionStorage.getItem(STORAGE_KEYS.TAB_ACTIVE_USER);
      if (rawTab) {
        const parsedTab = JSON.parse(rawTab) as SovereignUserProfile;
        if (parsedTab && typeof parsedTab === 'object') {
          const cleanedTab = resetCampaignProgressionForProfile(parsedTab).profile;
          sessionStorage.setItem(STORAGE_KEYS.TAB_ACTIVE_USER, JSON.stringify(cleanedTab));
        }
      }

      localStorage.setItem(STORAGE_KEYS.CAMPAIGN_RESET_V1, 'done');
    }
  } catch {
    // Ignore
  }
}

/**
 * Returns the canonical Honorific Title bound to the chosen Creature / Legendary Avatar.
 */
export function getAvatarHonorificTitle(cardId: string): string {
  const properTitle = LEGENDARY_CREATURE_TITLES[cardId];
  if (properTitle) return properTitle;
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
      (c) => (c.rarity === 'legendary' || Boolean(LEGENDARY_CREATURE_TITLES[c.id])) && Boolean(c.imagePath)
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
  eloRating: INITIAL_PLAYER_ELO,
  eloBaseVersion: ELO_SCHEMA_VERSION,
  pvpWins: 0,
  pvpLosses: 0,
  preferredDeckId: 'deck_red_aggro',
};

export function isUnregisteredProfile(profile: SovereignUserProfile): boolean {
  return !profile || profile.id === 'unregistered' || profile.username === 'Sem Conta';
}

const LEGACY_INITIAL_PLAYER_ELO = 1200;

/**
 * Recalcula retroativamente o ELO de qualquer perfil legado (base antiga 1200 -> nova base 1000),
 * reprocessando o histórico de partidas ranqueadas (com fator K provisório nas 10 primeiras)
 * ou reancorando contas 0V/0D diretamente em 1000 ELO.
 */
export function recalculateProfileEloFromInitialBase(
  profile: SovereignUserProfile
): { profile: SovereignUserProfile; wasRecalculated: boolean } {
  if (isUnregisteredProfile(profile)) {
    return {
      profile: {
        ...profile,
        eloRating: INITIAL_PLAYER_ELO,
        eloBaseVersion: ELO_SCHEMA_VERSION,
      },
      wasRecalculated: false,
    };
  }

  if ((profile.eloBaseVersion ?? 1) >= ELO_SCHEMA_VERSION) {
    return { profile, wasRecalculated: false };
  }

  const pvpGames = (profile.pvpWins ?? 0) + (profile.pvpLosses ?? 0);
  const sovGames = (profile.rankedSovereignWins ?? 0) + (profile.rankedSovereignLosses ?? 0);
  const totalRanked = pvpGames + sovGames;
  const historyChrono = [...(profile.recentRankedHistory ?? [])].reverse();
  const baseShift = LEGACY_INITIAL_PLAYER_ELO - INITIAL_PLAYER_ELO;

  if (totalRanked === 0 && historyChrono.length === 0) {
    const nextElo =
      (profile.eloRating ?? LEGACY_INITIAL_PLAYER_ELO) === LEGACY_INITIAL_PLAYER_ELO
        ? INITIAL_PLAYER_ELO
        : Math.max(100, (profile.eloRating ?? LEGACY_INITIAL_PLAYER_ELO) - baseShift);
    return {
      profile: {
        ...profile,
        eloRating: nextElo,
        eloBaseVersion: ELO_SCHEMA_VERSION,
      },
      wasRecalculated: true,
    };
  }

  const priorGames = Math.max(0, totalRanked - historyChrono.length);
  let runningElo: number;
  if (priorGames === 0) {
    runningElo = INITIAL_PLAYER_ELO;
  } else {
    const firstMatch = historyChrono[0];
    const preWindowLegacyElo = firstMatch
      ? firstMatch.newElo - firstMatch.deltaElo
      : profile.eloRating ?? LEGACY_INITIAL_PLAYER_ELO;
    runningElo = Math.max(100, preWindowLegacyElo - baseShift);
  }

  const recomputedChrono: RankedMatchHistoryItem[] = [];
  for (let i = 0; i < historyChrono.length; i++) {
    const item = historyChrono[i];
    const gameIdx = priorGames + i;
    const rawDelta =
      item.mode === 'pvp'
        ? calculateReputationDelta(runningElo, item.opponentElo, item.didWin, 32)
        : calculateFideRankedEloDelta({
            playerElo: runningElo,
            opponentElo: item.opponentElo,
            didWin: item.didWin,
            totalRankedGamesPlayed: gameIdx,
          }).delta;
    const nextMatchElo = Math.max(100, runningElo + rawDelta);
    recomputedChrono.push({
      ...item,
      deltaElo: nextMatchElo - runningElo,
      newElo: nextMatchElo,
    });
    runningElo = nextMatchElo;
  }

  return {
    profile: {
      ...profile,
      eloRating: runningElo,
      recentRankedHistory: recomputedChrono.reverse(),
      eloBaseVersion: ELO_SCHEMA_VERSION,
    },
    wasRecalculated: true,
  };
}

const RETIRED_EXACT_USERNAMES = new Set<string>();

export const TSM81_OPTIMIZED_PYROS_CHAMPS_100: string[] = [
  'red_01_kobold',
  'red_01_kobold',
  'red_01_kobold',
  'red_38_serpente_fogo',
  'red_38_serpente_fogo',
  'red_38_serpente_fogo',
  'red_91_batedor_salamandra',
  'red_91_batedor_salamandra',
  'red_91_batedor_salamandra',
  'red_109_diabrete_fornalha',
  'red_109_diabrete_fornalha',
  'red_109_diabrete_fornalha',
  'red_147_salamandra_vapor_rubro',
  'red_147_salamandra_vapor_rubro',
  'red_147_salamandra_vapor_rubro',
  'red_11_azer',
  'red_11_azer',
  'red_11_azer',
  'red_12_mephit_magma',
  'red_12_mephit_magma',
  'red_12_mephit_magma',
  'red_16_orc_saqueador',
  'red_16_orc_saqueador',
  'red_16_orc_saqueador',
  'red_27_frenesi_batalha',
  'red_27_frenesi_batalha',
  'red_27_frenesi_batalha',
  'red_30_furia_sangue',
  'red_30_furia_sangue',
  'red_30_furia_sangue',
  'red_37_saqueador_gith',
  'red_37_saqueador_gith',
  'red_37_saqueador_gith',
  'red_67_fornalha_interior',
  'red_67_fornalha_interior',
  'red_67_fornalha_interior',
  'red_129_cao_cinzas_alfa',
  'red_129_cao_cinzas_alfa',
  'red_129_cao_cinzas_alfa',
  'red_148_sapador_enxofre',
  'red_148_sapador_enxofre',
  'red_148_sapador_enxofre',
  'red_35_contra_ataque_igneo',
  'red_35_contra_ataque_igneo',
  'red_35_contra_ataque_igneo',
  'red_42_cavaleiro_draconico',
  'red_42_cavaleiro_draconico',
  'red_42_cavaleiro_draconico',
  'red_50_forjar_no_sangue',
  'red_50_forjar_no_sangue',
  'red_50_forjar_no_sangue',
  'red_76_salamandra_vapor',
  'red_76_salamandra_vapor',
  'red_76_salamandra_vapor',
  'red_90_nucleo_fragmento_rubro',
  'red_90_nucleo_fragmento_rubro',
  'red_94_berserker_draconico',
  'red_94_berserker_draconico',
  'red_94_berserker_draconico',
  'red_107_fornalha_draconica',
  'red_107_fornalha_draconica',
  'red_174_subduccao_magmatica',
  'red_174_subduccao_magmatica',
  'red_176_dancarino_plumas_brasa',
  'red_176_dancarino_plumas_brasa',
  'red_195_clamor_forja_guerra',
  'red_19_corcel_brasas',
  'red_19_corcel_brasas',
  'red_19_corcel_brasas',
  'red_36_bigorna_fogo',
  'red_36_bigorna_fogo',
  'red_79_draco_meteoro',
  'red_79_draco_meteoro',
  'red_79_draco_meteoro',
  'red_114_draco_escoria',
  'red_114_draco_escoria',
  'red_114_draco_escoria',
  'red_132_wyvern_escoria',
  'red_132_wyvern_escoria',
  'red_132_wyvern_escoria',
  'red_153_elemental_fornalha_viva',
  'red_153_elemental_fornalha_viva',
  'red_153_elemental_fornalha_viva',
  'red_186_carcereiro_jaula_ardente',
  'red_44_gigante_forja',
  'red_44_gigante_forja',
  'red_45_fenix_primordial',
  'red_45_fenix_primordial',
  'red_99_senhor_balor_fogo',
  'red_167_arauto_prisma_chama',
  'red_179_khorvus_tirano_mascara_auricrania',
  'red_47_arquiduque_ferro',
  'red_82_fenix_taquion',
  'red_137_dragao_cometa_rubro',
  'red_137_dragao_cometa_rubro',
  'red_180_malakor_general_lamina_colossal',
  'red_119_soberano_piroclasma',
  'red_173_general_roda_chama',
  'red_178_kaelith_principe_asas_fenix',
  'red_181_ignis_marechal_coroa_cinzas',
];

export function upgradeTsm81ChampionGrimoire(profile: SovereignUserProfile): {
  profile: SovereignUserProfile;
  wasUpgraded: boolean;
} {
  if ((profile.username || '').trim().toLowerCase() !== 'tsm81') {
    return { profile, wasUpgraded: false };
  }
  const decks = profile.customDecks ?? [];
  const targetIdx = decks.findIndex(
    (d) => d.id === 'custom_1793565793825' || d.name.includes('Pyros Campeão')
  );
  if (targetIdx === -1) {
    return { profile, wasUpgraded: false };
  }
  const targetDeck = decks[targetIdx];
  if (
    targetDeck.cardIds.length === 100 &&
    targetDeck.cardIds.includes('red_174_subduccao_magmatica') &&
    targetDeck.cardIds.includes('red_181_ignis_marechal_coroa_cinzas')
  ) {
    return { profile, wasUpgraded: false };
  }

  // Preserve all previously owned starter cards in extraUnlockedCards so nothing is lost
  const prevCounts: Record<string, number> = {};
  for (const cid of profile.starterDeckCardIds ?? targetDeck.cardIds) {
    prevCounts[cid] = (prevCounts[cid] ?? 0) + 1;
  }
  const newCounts: Record<string, number> = {};
  for (const cid of TSM81_OPTIMIZED_PYROS_CHAMPS_100) {
    newCounts[cid] = (newCounts[cid] ?? 0) + 1;
  }
  const nextExtra: Record<string, number> = { ...(profile.extraUnlockedCards ?? {}) };
  for (const [cid, oldCnt] of Object.entries(prevCounts)) {
    const newCnt = newCounts[cid] ?? 0;
    if (oldCnt > newCnt) {
      nextExtra[cid] = Math.max(nextExtra[cid] ?? 0, oldCnt - newCnt);
    }
  }

  const nextDecks = decks.map((d, idx) =>
    idx === targetIdx
      ? {
          ...d,
          cardIds: [...TSM81_OPTIMIZED_PYROS_CHAMPS_100],
          updatedAt: Date.now(),
        }
      : d
  );

  return {
    profile: {
      ...profile,
      customDecks: nextDecks,
      starterDeckCardIds: [...TSM81_OPTIMIZED_PYROS_CHAMPS_100],
      extraUnlockedCards: nextExtra,
    },
    wasUpgraded: true,
  };
}

export function getSavedAccountsRoster(): SovereignUserProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACCOUNTS_ROSTER);
    if (raw) {
      const parsed = JSON.parse(raw) as SovereignUserProfile[];
      if (Array.isArray(parsed)) {
        let anyCleaned = false;
        const seenLocal = new Set<string>();
        const validFiltered = parsed.filter((a) => {
          if (isUnregisteredProfile(a)) return false;
          if (RETIRED_EXACT_USERNAMES.has(a.username)) {
            anyCleaned = true;
            return false;
          }
          const key = (a.username || '').trim().toLowerCase();
          if (!key || seenLocal.has(key)) {
            anyCleaned = true;
            return false;
          }
          seenLocal.add(key);
          return true;
        });
        const cleanedRoster = validFiltered.map((acc) => {
          const { cleaned, wasModified } = stripImposedStarterGrimoire(acc);
          const { profile: rebased, wasRecalculated } =
            recalculateProfileEloFromInitialBase(cleaned);
          const { profile: campClean, wasReset } =
            resetCampaignProgressionForProfile(rebased);
          const { profile: tsmUpgraded, wasUpgraded } =
            upgradeTsm81ChampionGrimoire(campClean);
          if (wasModified || wasRecalculated || wasReset || wasUpgraded) anyCleaned = true;
          return tsmUpgraded;
        });
        if (anyCleaned) {
          try {
            localStorage.setItem(STORAGE_KEYS.ACCOUNTS_ROSTER, JSON.stringify(cleanedRoster));
          } catch {
            // Ignore
          }
        }
        return cleanedRoster;
      }
    }
  } catch {
    // Ignore storage error
  }
  return [];
}

export function saveAccountToRoster(profile: SovereignUserProfile): SovereignUserProfile[] {
  if (isUnregisteredProfile(profile) || RETIRED_EXACT_USERNAMES.has(profile.username)) {
    return getSavedAccountsRoster();
  }
  const current = getSavedAccountsRoster();
  const normUser = (profile.username || '').trim().toLowerCase();
  const exists = current.some(
    (a) => a.id === profile.id || (a.username || '').trim().toLowerCase() === normUser
  );
  const next = exists
    ? current.map((a) =>
        a.id === profile.id || (a.username || '').trim().toLowerCase() === normUser ? profile : a
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
      const rpcRes = await invokeSupabaseRpc<{ ok?: boolean }>('rpc_delete_own_account', {
        p_username: profile.username,
        p_password_hash: profile.passwordHash || '',
      });
      if (rpcRes.status === 'missing_rpc') {
        await fetch(
          `${cfg.url}/rest/v1/sovereign_profiles?username=eq.${encodeURIComponent(profile.username)}`,
          {
            method: 'DELETE',
            headers: getSupabaseHeaders(cfg.anonKey),
          }
        );
      }
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
      if (RETIRED_EXACT_USERNAMES.has(parsed.username)) {
        sessionStorage.removeItem(STORAGE_KEYS.TAB_ACTIVE_USER);
      } else if (!isUnregisteredProfile(parsed)) {
        return ensureStarterDeckForUser(parsed);
      }
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

const IMPOSED_PYROS_DECK_SIGNATURE = buildDefaultStarterDeck().cardIds.join(',');

export function isImposedPyrosStarterDeck(
  deck?: { id?: string; name?: string; cardIds?: string[] } | null
): boolean {
  if (!deck) return false;
  if (deck.id === 'starter_deck_pyros_steel_100') return true;
  if (deck.name && deck.name.includes('Pacto Inicial de Pyros & Aço')) return true;
  if (
    Array.isArray(deck.cardIds) &&
    deck.cardIds.length === 100 &&
    deck.cardIds.join(',') === IMPOSED_PYROS_DECK_SIGNATURE
  ) {
    return true;
  }
  return false;
}

export function stripImposedStarterGrimoire(profile: SovereignUserProfile): {
  cleaned: SovereignUserProfile;
  wasModified: boolean;
} {
  if (isUnregisteredProfile(profile)) {
    return { cleaned: profile, wasModified: false };
  }
  const origDecks = profile.customDecks ?? [];
  const filteredDecks = origDecks.filter((d) => !isImposedPyrosStarterDeck(d));
  const hadImposedDeck = filteredDecks.length !== origDecks.length;
  const origStarterSig = (profile.starterDeckCardIds ?? []).join(',');
  const hadImposedStarterIds =
    origStarterSig === IMPOSED_PYROS_DECK_SIGNATURE ||
    (hadImposedDeck && filteredDecks.length === 0);

  if (!hadImposedDeck && !hadImposedStarterIds) {
    return { cleaned: profile, wasModified: false };
  }

  const nextStarterIds =
    filteredDecks.length > 0 && !hadImposedStarterIds
      ? profile.starterDeckCardIds ?? filteredDecks[0].cardIds
      : filteredDecks[0]?.cardIds ?? [];

  const nextPreferredId =
    filteredDecks.length > 0
      ? filteredDecks.some((d) => d.id === profile.preferredDeckId)
        ? profile.preferredDeckId
        : filteredDecks[0].id
      : '';

  return {
    cleaned: {
      ...profile,
      customDecks: filteredDecks,
      starterDeckCardIds: nextStarterIds,
      preferredDeckId: nextPreferredId,
    },
    wasModified: true,
  };
}

/**
 * Validates the registered Sovereign account profile and strips any legacy imposed starter deck
 * so the player always has the right to choose their own 100-card Grimoire.
 */
export function ensureStarterDeckForUser(profile: SovereignUserProfile): SovereignUserProfile {
  if (isUnregisteredProfile(profile)) {
    return profile;
  }
  const shouldBeAdmin = isAdminProfile(profile);
  const { cleaned, wasModified } = stripImposedStarterGrimoire(profile);
  const { profile: rebased, wasRecalculated } = recalculateProfileEloFromInitialBase(cleaned);
  const { profile: campClean, wasReset } = resetCampaignProgressionForProfile(rebased);
  const { profile: tsmUpgraded, wasUpgraded } = upgradeTsm81ChampionGrimoire(campClean);
  if (
    wasModified ||
    wasRecalculated ||
    wasReset ||
    wasUpgraded ||
    (shouldBeAdmin && !tsmUpgraded.isAdmin)
  ) {
    const updated: SovereignUserProfile = {
      ...tsmUpgraded,
      isAdmin: shouldBeAdmin,
    };
    setActiveTabUserProfile(updated);
    if (wasRecalculated || wasReset || wasUpgraded) {
      void syncProfileToSupabaseIfConfigured(updated);
    }
    return updated;
  }
  return tsmUpgraded;
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

function encodeCloudTitleMeta(
  profile: SovereignUserProfile,
  includeLegacySecrets = false
): string {
  const honorific = getAvatarHonorificTitle(profile.avatarCardId);
  const payload: Record<string, unknown> = {
    t: honorific,
    g: profile.gold ?? 0,
    as: profile.astralShards ?? 0,
    d: profile.customDecks ?? [],
    s: profile.starterDeckCardIds ?? [],
    u: profile.extraUnlockedCards ?? {},
    b: profile.defeatedBossIds ?? [],
    w: profile.arenaWins ?? 0,
    rsw: profile.rankedSovereignWins ?? 0,
    rsl: profile.rankedSovereignLosses ?? 0,
    rhist: (profile.recentRankedOpponentIds ?? []).slice(-6),
    rmh: (profile.recentRankedHistory ?? []).slice(0, 8),
    ebv: profile.eloBaseVersion ?? ELO_SCHEMA_VERSION,
    crv: profile.campaignResetVersion ?? CAMPAIGN_RESET_VERSION,
    pref: profile.preferredDeckId || '',
    adm: isAdminProfile(profile),
    ca: profile.createdAt ?? Date.now(),
    la: Date.now(),
  };
  if (includeLegacySecrets) {
    payload.e = (profile.email || '').trim().toLowerCase();
    payload.p = profile.passwordHash || '';
  }
  return JSON.stringify(payload);
}

function decodeCloudTitleMeta(
  rawTitle: string | null | undefined,
  avatarCardId: string
): {
  title: string;
  email?: string;
  passwordHash?: string;
  gold?: number;
  astralShards?: number;
  customDecks?: SovereignSavedDeck[];
  starterDeckCardIds?: string[];
  extraUnlockedCards?: Record<string, number>;
  defeatedBossIds?: string[];
  arenaWins?: number;
  rankedSovereignWins?: number;
  rankedSovereignLosses?: number;
  recentRankedOpponentIds?: string[];
  recentRankedHistory?: RankedMatchHistoryItem[];
  eloBaseVersion?: number;
  campaignResetVersion?: number;
  preferredDeckId?: string;
  isAdmin?: boolean;
  createdAt?: number;
  lastActiveAt?: number;
} {
  const fallbackTitle = getAvatarHonorificTitle(avatarCardId);
  if (!rawTitle) return { title: fallbackTitle, eloBaseVersion: 1, campaignResetVersion: 0 };
  if (rawTitle.startsWith('{')) {
    try {
      const parsed = JSON.parse(rawTitle) as {
        t?: string;
        e?: string;
        p?: string;
        g?: number;
        as?: number;
        d?: SovereignSavedDeck[];
        s?: string[];
        u?: Record<string, number>;
        b?: string[];
        w?: number;
        rsw?: number;
        rsl?: number;
        rhist?: string[];
        rmh?: RankedMatchHistoryItem[];
        ebv?: number;
        crv?: number;
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
        astralShards: typeof parsed.as === 'number' ? parsed.as : undefined,
        customDecks: Array.isArray(parsed.d) ? parsed.d : undefined,
        starterDeckCardIds: Array.isArray(parsed.s) ? parsed.s : undefined,
        extraUnlockedCards: parsed.u && typeof parsed.u === 'object' ? parsed.u : undefined,
        defeatedBossIds: Array.isArray(parsed.b) ? parsed.b : undefined,
        arenaWins: typeof parsed.w === 'number' ? parsed.w : undefined,
        rankedSovereignWins: typeof parsed.rsw === 'number' ? parsed.rsw : undefined,
        rankedSovereignLosses: typeof parsed.rsl === 'number' ? parsed.rsl : undefined,
        recentRankedOpponentIds: Array.isArray(parsed.rhist) ? parsed.rhist : undefined,
        recentRankedHistory: Array.isArray(parsed.rmh) ? parsed.rmh : undefined,
        eloBaseVersion: typeof parsed.ebv === 'number' ? parsed.ebv : 1,
        campaignResetVersion: typeof parsed.crv === 'number' ? parsed.crv : 0,
        preferredDeckId: parsed.pref || undefined,
        isAdmin: Boolean(parsed.adm),
        createdAt: typeof parsed.ca === 'number' ? parsed.ca : undefined,
        lastActiveAt: typeof parsed.la === 'number' ? parsed.la : undefined,
      };
    } catch {
      return { title: fallbackTitle, eloBaseVersion: 1, campaignResetVersion: 0 };
    }
  }
  return { title: fallbackTitle, eloBaseVersion: 1, campaignResetVersion: 0 };
}

export function createNewSovereignAccount(params: {
  username: string;
  email: string;
  password: string;
  avatarCardId: string;
  preferredDeckId: string;
  starterTemplateDeckId?: string;
  bonusGold?: number;
}): SovereignUserProfile {
  const cleanName = params.username.trim() || `Soberano_${Math.floor(100 + Math.random() * 900)}`;
  const chosenAvatar = params.avatarCardId || 'neutral_10_valkyra_pentacromatica';
  const now = Date.now();
  const templateId = params.starterTemplateDeckId ?? params.preferredDeckId;
  const chosenTemplate =
    templateId === 'empty'
      ? null
      : MONOCHROMATIC_STARTER_DECKS.find((d) => d.id === templateId) ??
        MONOCHROMATIC_STARTER_DECKS[0] ??
        null;

  const initialCustomDecks: SovereignSavedDeck[] = chosenTemplate
    ? [
        {
          id: `grimoire_starter_${chosenTemplate.domains[0] ?? 'red'}_${now}`,
          name: chosenTemplate.name,
          domain: chosenTemplate.domains[0] ?? 'red',
          cardIds: [...chosenTemplate.cardIds],
          updatedAt: now,
          wins: 0,
          losses: 0,
        },
      ]
    : [];

  const profile: SovereignUserProfile = {
    id: `sov_${now}_${Math.random().toString(36).slice(2, 7)}`,
    username: cleanName,
    email: params.email.trim().toLowerCase(),
    passwordHash: hashPassword(params.password),
    title: getAvatarHonorificTitle(chosenAvatar),
    avatarCardId: chosenAvatar,
    eloRating: INITIAL_PLAYER_ELO,
    eloBaseVersion: ELO_SCHEMA_VERSION,
    campaignResetVersion: CAMPAIGN_RESET_VERSION,
    pvpWins: 0,
    pvpLosses: 0,
    preferredDeckId: initialCustomDecks[0]?.id ?? '',
    gold: STARTER_GOLD + Math.max(0, Math.floor(params.bonusGold ?? 0)),
    customDecks: initialCustomDecks,
    starterDeckCardIds: chosenTemplate ? [...chosenTemplate.cardIds] : [],
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
  if (!isUnregisteredProfile(updated)) {
    void adminSaveCloudProfile(updated);
  }
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
  opponentRating = INITIAL_PLAYER_ELO,
  opponentMeta?: { name?: string; avatarCardId?: string }
): SovereignUserProfile {
  const prevElo = profile.eloRating ?? INITIAL_PLAYER_ELO;
  const reputationDelta = calculateReputationDelta(prevElo, opponentRating, didWin, 32);
  const newElo = Math.max(100, prevElo + reputationDelta);
  const entry: RankedMatchHistoryItem = {
    id: `pvp_${Date.now()}`,
    timestamp: Date.now(),
    opponentName: opponentMeta?.name || 'Jogador Online',
    opponentElo: opponentRating,
    opponentAvatarCardId: opponentMeta?.avatarCardId,
    mode: 'pvp',
    didWin,
    deltaElo: newElo - prevElo,
    newElo,
    replayShareId: latestPersonalMatchShareIdResolver?.(),
  };
  const updated: SovereignUserProfile = {
    ...profile,
    eloRating: newElo,
    eloBaseVersion: ELO_SCHEMA_VERSION,
    pvpWins: profile.pvpWins + (didWin ? 1 : 0),
    pvpLosses: profile.pvpLosses + (didWin ? 0 : 1),
    recentRankedHistory: [entry, ...(profile.recentRankedHistory ?? [])].slice(0, 10),
  };
  setActiveTabUserProfile(updated);
  if (!isUnregisteredProfile(updated)) {
    void adminSaveCloudProfile(updated);
  }
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

export type SupabaseRpcOutcome<T> =
  | { status: 'ok'; data: T; response: Response }
  | { status: 'missing_rpc'; response?: Response }
  | { status: 'error'; httpStatus?: number; errorText?: string };

export async function invokeSupabaseRpc<T = Record<string, unknown>>(
  rpcName: string,
  args: Record<string, unknown>,
  options?: { keepalive?: boolean }
): Promise<SupabaseRpcOutcome<T>> {
  const cfg = getSupabaseConfig();
  if (!cfg.isConfigured) {
    return { status: 'error', errorText: 'Supabase not configured' };
  }
  try {
    const res = await fetch(`${cfg.url}/rest/v1/rpc/${rpcName}`, {
      method: 'POST',
      keepalive: options?.keepalive,
      headers: getSupabaseHeaders(cfg.anonKey, {
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(args),
    });
    if (res.status === 404) {
      return { status: 'missing_rpc', response: res };
    }
    if (!res.ok) {
      return { status: 'error', httpStatus: res.status };
    }
    const data = (await res.json()) as T;
    return { status: 'ok', data, response: res };
  } catch (err) {
    return {
      status: 'error',
      errorText: err instanceof Error ? err.message : 'RPC network error',
    };
  }
}

export async function upsertCloudSystemRecord(params: {
  key: string;
  payload: string;
  avatarCardId?: string;
  eloRating?: number;
  pvpWins?: number;
  pvpLosses?: number;
}): Promise<{ ok: boolean; serverDateHeader: string | null }> {
  const cfg = getSupabaseConfig();
  if (!cfg.isConfigured) {
    return { ok: true, serverDateHeader: null };
  }

  let actorUsername: string | null = null;
  let actorPasswordHash: string | null = null;
  if (typeof window !== 'undefined') {
    try {
      const active = getActiveTabUserProfile();
      if (!isUnregisteredProfile(active)) {
        actorUsername = active.username || null;
        actorPasswordHash = active.passwordHash || null;
      }
    } catch {
      // Ignore in non-UI contexts
    }
  }

  const rpcRes = await invokeSupabaseRpc<{ ok?: boolean }>('rpc_upsert_system_record', {
    p_key: params.key,
    p_payload: params.payload,
    p_avatar_card_id: params.avatarCardId || 'neutral_10_valkyra_pentacromatica',
    p_elo_rating: params.eloRating ?? 1000,
    p_pvp_wins: params.pvpWins ?? 0,
    p_pvp_losses: params.pvpLosses ?? 0,
    p_actor_username: actorUsername,
    p_actor_password_hash: actorPasswordHash,
  });

  if (rpcRes.status === 'ok') {
    return {
      ok: Boolean(rpcRes.data?.ok),
      serverDateHeader: rpcRes.response.headers.get('date'),
    };
  }

  if (rpcRes.status === 'missing_rpc') {
    try {
      const fallbackRes = await fetch(`${cfg.url}/rest/v1/sovereign_profiles?on_conflict=username`, {
        method: 'POST',
        headers: getSupabaseHeaders(cfg.anonKey, {
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates',
        }),
        body: JSON.stringify({
          username: params.key,
          title: params.payload,
          avatar_card_id: params.avatarCardId || 'neutral_10_valkyra_pentacromatica',
          elo_rating: params.eloRating ?? 1000,
          pvp_wins: params.pvpWins ?? 0,
          pvp_losses: params.pvpLosses ?? 0,
          gold: 0,
          updated_at: new Date().toISOString(),
        }),
      });
      return {
        ok: fallbackRes.ok,
        serverDateHeader: fallbackRes.headers.get('date'),
      };
    } catch {
      return { ok: false, serverDateHeader: null };
    }
  }

  return { ok: false, serverDateHeader: null };
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
  email?: string;
  is_admin?: boolean;
}

function hydrateProfileFromRow(
  row: SupabaseProfileRow,
  localMatch?: SovereignUserProfile,
  secretOverlay?: { email?: string; passwordHash?: string; isAdmin?: boolean }
): SovereignUserProfile {
  const safeLocal = localMatch
    ? resetCampaignProgressionForProfile(localMatch).profile
    : undefined;
  const resolvedAvatar =
    row.avatar_card_id && CARDS_BY_ID[row.avatar_card_id]
      ? row.avatar_card_id
      : 'neutral_10_valkyra_pentacromatica';
  const meta = decodeCloudTitleMeta(row.title, resolvedAvatar);
  const updatedMs = row.updated_at ? new Date(row.updated_at).getTime() : undefined;
  const cleanName = (row.username || '').trim();
  const isMasterAdmin = MASTER_ADMIN_USERNAMES.includes(cleanName.toLowerCase());
  const rawProfile: SovereignUserProfile = {
    id: safeLocal?.id ?? `sov_${row.id}`,
    username: row.username,
    email: secretOverlay?.email || row.email || meta.email || safeLocal?.email,
    passwordHash: secretOverlay?.passwordHash || meta.passwordHash || safeLocal?.passwordHash,
    title: meta.title,
    avatarCardId: resolvedAvatar,
    eloRating: row.elo_rating ?? INITIAL_PLAYER_ELO,
    eloBaseVersion: meta.eloBaseVersion ?? 1,
    campaignResetVersion: meta.campaignResetVersion ?? 0,
    pvpWins: row.pvp_wins ?? 0,
    pvpLosses: row.pvp_losses ?? 0,
    rankedSovereignWins: meta.rankedSovereignWins ?? safeLocal?.rankedSovereignWins ?? 0,
    rankedSovereignLosses: meta.rankedSovereignLosses ?? safeLocal?.rankedSovereignLosses ?? 0,
    recentRankedOpponentIds:
      meta.recentRankedOpponentIds ?? safeLocal?.recentRankedOpponentIds ?? [],
    recentRankedHistory:
      meta.recentRankedHistory ?? safeLocal?.recentRankedHistory ?? [],
    preferredDeckId: meta.preferredDeckId || safeLocal?.preferredDeckId || '',
    gold: meta.gold ?? row.gold ?? safeLocal?.gold ?? 0,
    astralShards: meta.astralShards ?? safeLocal?.astralShards ?? 0,
    customDecks: meta.customDecks ?? safeLocal?.customDecks ?? [],
    starterDeckCardIds: meta.starterDeckCardIds ?? safeLocal?.starterDeckCardIds ?? [],
    extraUnlockedCards: meta.extraUnlockedCards ?? safeLocal?.extraUnlockedCards ?? {},
    defeatedBossIds: meta.defeatedBossIds ?? safeLocal?.defeatedBossIds ?? [],
    arenaWins: meta.arenaWins ?? 0,
    isAdmin: Boolean(
      isMasterAdmin || secretOverlay?.isAdmin || row.is_admin || meta.isAdmin || safeLocal?.isAdmin
    ),
    createdAt: meta.createdAt ?? safeLocal?.createdAt ?? updatedMs,
    lastActiveAt: meta.lastActiveAt ?? updatedMs ?? safeLocal?.lastActiveAt,
  };
  const { cleaned, wasModified } = stripImposedStarterGrimoire(rawProfile);
  const { profile: rebased, wasRecalculated } = recalculateProfileEloFromInitialBase(cleaned);
  const { profile: campClean, wasReset } = resetCampaignProgressionForProfile(rebased);
  const { profile: tsmUpgraded, wasUpgraded } = upgradeTsm81ChampionGrimoire(campClean);
  if (
    (wasModified || wasRecalculated || wasReset || wasUpgraded) &&
    Boolean(tsmUpgraded.passwordHash)
  ) {
    void syncProfileToSupabaseIfConfigured(tsmUpgraded);
  }
  return tsmUpgraded;
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
    const rpcRes = await invokeSupabaseRpc<{
      ok?: boolean;
      code?: string;
      row?: SupabaseProfileRow;
      email?: string;
      is_admin?: boolean;
    }>('rpc_auth_sovereign', {
      p_identifier: cleanId,
      p_password_hash: inputHash,
    });

    if (rpcRes.status === 'ok') {
      if (rpcRes.data?.ok && rpcRes.data.row) {
        const cloudProfile = hydrateProfileFromRow(rpcRes.data.row, localMatch, {
          email: rpcRes.data.email || undefined,
          passwordHash: inputHash,
          isAdmin: rpcRes.data.is_admin,
        });
        const ensuredCloud = ensureStarterDeckForUser(cloudProfile);
        setActiveTabUserProfile(ensuredCloud);
        return { ok: true, profile: ensuredCloud };
      }
      if (rpcRes.data?.code === 'INVALID_PASSWORD') {
        return {
          ok: false,
          error: 'Senha incorreta. Verifique sua senha ou clique em "Esqueci minha senha".',
        };
      }
      // If NOT_FOUND in cloud, fall through to check localMatch below
    } else if (rpcRes.status === 'missing_rpc') {
      try {
        let matchedRow: SupabaseProfileRow | undefined;

        // 1. Direct exact/case-insensitive username lookup first (fast, O(1), never touches other rows)
        if (!cleanId.includes('@')) {
          const directRes = await fetch(
            `${cfg.url}/rest/v1/sovereign_profiles?username=ilike.${encodeURIComponent(cleanId)}&select=*&limit=2`,
            {
              headers: getSupabaseHeaders(cfg.anonKey),
            }
          );
          if (directRes.ok) {
            const directRows = (await directRes.json()) as SupabaseProfileRow[];
            matchedRow = directRows.find(
              (r) =>
                Boolean(r.username) &&
                !r.username.startsWith('__') &&
                r.username.toLowerCase() === cleanLower
            );
          }
        }

        // 2. Email login fallback: strictly exclude all '__*' system/telemetry/tournament rows
        if (!matchedRow && cleanId.includes('@')) {
          const emailRes = await fetch(
            `${cfg.url}/rest/v1/sovereign_profiles?username=not.like.__*&select=*&limit=1000`,
            {
              headers: getSupabaseHeaders(cfg.anonKey),
            }
          );
          if (emailRes.ok) {
            const rows = (await emailRes.json()) as SupabaseProfileRow[];
            matchedRow = rows.find((r) => {
              if (!r.username || r.username.startsWith('__')) return false;
              const meta = decodeCloudTitleMeta(r.title, r.avatar_card_id);
              return Boolean(meta.email && meta.email.toLowerCase() === cleanLower);
            });
          }
        }

        if (matchedRow) {
          const cloudProfile = hydrateProfileFromRow(matchedRow, localMatch);
          if (cloudProfile.passwordHash && cloudProfile.passwordHash !== inputHash) {
            return {
              ok: false,
              error: 'Senha incorreta. Verifique sua senha ou clique em "Esqueci minha senha".',
            };
          }
          if (!cloudProfile.passwordHash) {
            cloudProfile.passwordHash = inputHash;
          }
          const ensuredCloud = ensureStarterDeckForUser(cloudProfile);
          setActiveTabUserProfile(ensuredCloud);
          return { ok: true, profile: ensuredCloud };
        }
      } catch {
        // Fallback to local
      }
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
    error: `Conta "${cleanId}" não encontrada. Use a aba "Criar Nova Conta" para se cadastrar.`,
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

  const newHash = hashPassword(newRawPassword);
  const cfg = getSupabaseConfig();
  if (cfg.isConfigured) {
    const rpcRes = await invokeSupabaseRpc<{
      ok?: boolean;
      code?: string;
      row?: SupabaseProfileRow;
      email?: string;
      is_admin?: boolean;
    }>('rpc_recover_password', {
      p_username: cleanUser,
      p_email: cleanEmail,
      p_new_password_hash: newHash,
    });

    if (rpcRes.status === 'ok') {
      if (rpcRes.data?.ok && rpcRes.data.row) {
        const cloudProfile = hydrateProfileFromRow(rpcRes.data.row, localMatch, {
          email: rpcRes.data.email || cleanEmail,
          passwordHash: newHash,
          isAdmin: rpcRes.data.is_admin,
        });
        const ensuredCloud = ensureStarterDeckForUser(cloudProfile);
        setActiveTabUserProfile(ensuredCloud);
        return { ok: true, profile: ensuredCloud };
      }
      if (rpcRes.data?.code === 'EMAIL_MISMATCH') {
        return {
          ok: false,
          error: 'O E-mail informado não corresponde ao E-mail cadastrado para este Nickname.',
        };
      }
    } else if (rpcRes.status === 'missing_rpc') {
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
            cloudProfile.passwordHash = newHash;
            const ensuredCloud = ensureStarterDeckForUser(cloudProfile);
            setActiveTabUserProfile(ensuredCloud);
            return { ok: true, profile: ensuredCloud };
          }
        }
      } catch {
        // Fallback to local
      }
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
  if (RETIRED_EXACT_USERNAMES.has(profile.username)) return;
  if (isUnregisteredProfile(profile)) return;
  const cfg = getSupabaseConfig();
  if (!cfg.isConfigured) return;

  const rpcRes = await invokeSupabaseRpc<{ ok?: boolean }>('rpc_sync_sovereign_profile', {
    p_username: profile.username,
    p_password_hash: profile.passwordHash || '',
    p_email: (profile.email || '').trim().toLowerCase(),
    p_title_json: encodeCloudTitleMeta(profile, false),
    p_avatar_card_id: profile.avatarCardId,
    p_elo_rating: profile.eloRating,
    p_pvp_wins: profile.pvpWins,
    p_pvp_losses: profile.pvpLosses,
    p_gold: profile.gold ?? 0,
  });

  if (rpcRes.status !== 'missing_rpc') return;

  try {
    await fetch(`${cfg.url}/rest/v1/sovereign_profiles?on_conflict=username`, {
      method: 'POST',
      headers: getSupabaseHeaders(cfg.anonKey, {
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      }),
      body: JSON.stringify({
        username: profile.username,
        title: encodeCloudTitleMeta(profile, true),
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

  let actorId = room.lastActorId || room.host.id;
  try {
    const active = getActiveTabUserProfile();
    if (!isUnregisteredProfile(active) && active.id) {
      actorId = active.id;
    }
  } catch {
    // Ignore
  }

  const rpcRes = await invokeSupabaseRpc<{ ok?: boolean }>(
    'rpc_sync_multiplayer_room',
    {
      p_room: room,
      p_actor_id: actorId,
    },
    { keepalive }
  );

  if (rpcRes.status !== 'missing_rpc') return;

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

  let actorId: string | null = null;
  let adminUsername: string | null = null;
  let adminPasswordHash: string | null = null;
  try {
    const active = getActiveTabUserProfile();
    if (!isUnregisteredProfile(active)) {
      actorId = active.id || null;
      if (isAdminProfile(active) && active.passwordHash) {
        adminUsername = active.username;
        adminPasswordHash = active.passwordHash;
      }
    }
  } catch {
    // Ignore
  }

  const rpcRes = await invokeSupabaseRpc<{ ok?: boolean }>(
    'rpc_close_multiplayer_room',
    {
      p_code: roomCode,
      p_actor_id: actorId,
      p_admin_username: adminUsername,
      p_admin_password_hash: adminPasswordHash,
    },
    { keepalive }
  );

  if (rpcRes.status !== 'missing_rpc') return;

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

let mpPollingActive = false;
let mpPollInFlight = false;
const IS_VITE_DEV = Boolean(
  (import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV
);

export function setMultiplayerPollingActive(active: boolean): void {
  const becameActive = active && !mpPollingActive;
  mpPollingActive = active;
  if (becameActive && typeof window !== 'undefined') {
    initMultiplayerNetworkBus();
    if (typeof document === 'undefined' || document.visibilityState === 'visible') {
      void pollRoomsFromSupabaseIfConfigured();
    }
  }
}

async function pollRoomsFromSupabaseIfConfigured(): Promise<void> {
  if (mpPollInFlight) return;
  const cfg = getSupabaseConfig();
  if (!cfg.isConfigured) return;

  mpPollInFlight = true;
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
  } finally {
    mpPollInFlight = false;
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

  // 3. Vite Built-in SSE Relay (Dev-only cross-browser / LAN sync)
  if (IS_VITE_DEV) {
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
        // Ignore dev SSE transient disconnects
      };
    } catch {
      // Ignore
    }
  }

  // 4. Adaptive Supabase Cloud Sync Loop (polls fast only when Multiplayer / Tournament PvP is active & tab visible)
  if (mpPollingActive && (typeof document === 'undefined' || document.visibilityState === 'visible')) {
    void pollRoomsFromSupabaseIfConfigured();
  }
  window.setInterval(() => {
    if (mpPollingActive && (typeof document === 'undefined' || document.visibilityState === 'visible')) {
      void pollRoomsFromSupabaseIfConfigured();
    }
  }, 1500);
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && mpPollingActive) {
        void pollRoomsFromSupabaseIfConfigured();
      }
    });
  }
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

  // Post to Vite Relay for local dev cross-browser / LAN players
  if (IS_VITE_DEV) {
    const isUrgentLifecycle = msg.type === 'MATCH_FORFEIT' || msg.type === 'ROOM_REMOVE';
    fetch('/api/mp/publish', {
      method: 'POST',
      keepalive: isUrgentLifecycle,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg),
    }).catch(() => {
      // Ignore
    });
  }

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
  visitCount?: number;
  activeDays?: string[];
  engagedSec?: number;
}

export interface GlobalAdminAnnouncement {
  id: string;
  kicker: string;
  title: string;
  message: string;
  createdAt: number;
  author: string;
}

export function getVerifiedActiveAdminCredentials(): {
  username: string;
  passwordHash: string;
} | null {
  if (typeof window === 'undefined') return null;
  try {
    const active = getActiveTabUserProfile();
    if (!isUnregisteredProfile(active) && isAdminProfile(active) && active.passwordHash) {
      return { username: active.username, passwordHash: active.passwordHash };
    }
    const adminInRoster = getSavedAccountsRoster().find(
      (a) => !isUnregisteredProfile(a) && isAdminProfile(a) && Boolean(a.passwordHash)
    );
    if (adminInRoster && adminInRoster.passwordHash) {
      return { username: adminInRoster.username, passwordHash: adminInRoster.passwordHash };
    }
  } catch {
    // Ignore
  }
  return null;
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

  const adminCreds = getVerifiedActiveAdminCredentials();
  if (adminCreds) {
    const rpcRes = await invokeSupabaseRpc<{
      ok?: boolean;
      code?: string;
      profiles?: SupabaseProfileRow[];
      telemetry?: Array<{ username: string; title: string }>;
      announcement_raw?: string | null;
    }>('rpc_admin_action', {
      p_admin_username: adminCreds.username,
      p_admin_password_hash: adminCreds.passwordHash,
      p_action: 'fetch_dashboard',
    });

    if (rpcRes.status === 'ok' && rpcRes.data?.ok) {
      const latencyMs = Math.round(performance.now() - startMs);
      const profileRows = rpcRes.data.profiles ?? [];
      const telemetryRows = rpcRes.data.telemetry ?? [];
      const profiles: SovereignUserProfile[] = [];
      const visitorSessions: CloudVisitorSessionEntry[] = [];
      let announcement: GlobalAdminAnnouncement | null = null;
      const seenUsernames = new Set<string>();

      if (rpcRes.data.announcement_raw) {
        try {
          const parsed = JSON.parse(rpcRes.data.announcement_raw) as GlobalAdminAnnouncement;
          if (parsed && parsed.title) announcement = parsed;
        } catch {
          // Ignore
        }
      }

      for (const tr of telemetryRows) {
        if (!tr.username || !tr.username.startsWith('__telemetry_session__:')) continue;
        try {
          const parsed = JSON.parse(tr.title) as CloudVisitorSessionEntry;
          if (parsed && parsed.sessionId) visitorSessions.push(parsed);
        } catch {
          // Ignore
        }
      }

      const profilesByKey = new Map<string, SovereignUserProfile>();
      for (const r of profileRows) {
        if (!r.username || r.username.startsWith('__')) continue;
        if (RETIRED_EXACT_USERNAMES.has(r.username)) continue;
        const normKey = r.username.trim().toLowerCase();
        if (!normKey) continue;
        const localMatch = localRoster.find(
          (a) => a.username.trim().toLowerCase() === normKey
        );
        const hydrated = hydrateProfileFromRow(r, localMatch);
        const prev = profilesByKey.get(normKey);
        if (!prev) {
          profilesByKey.set(normKey, hydrated);
        } else {
          profilesByKey.set(normKey, {
            ...prev,
            email: prev.email || hydrated.email,
            isAdmin: Boolean(prev.isAdmin || hydrated.isAdmin),
          });
        }
        seenUsernames.add(normKey);
      }
      profiles.push(...profilesByKey.values());

      for (const localAcc of localRoster) {
        if (!seenUsernames.has(localAcc.username.toLowerCase())) {
          profiles.push(localAcc);
        }
      }

      visitorSessions.sort((a, b) => b.lastSeenAt - a.lastSeenAt);
      return { profiles, visitorSessions, announcement, latencyMs };
    }
  }

  try {
    const [profilesRes, telemetryRes] = await Promise.all([
      fetch(
        `${cfg.url}/rest/v1/sovereign_profiles?or=(username.not.like.__*,username.eq.__admin_global_announcement__)&select=*&order=updated_at.desc&limit=1000`,
        {
          headers: getSupabaseHeaders(cfg.anonKey),
        }
      ),
      fetch(
        `${cfg.url}/rest/v1/sovereign_profiles?username=like.__telemetry_session__:*&select=username,title,updated_at&order=updated_at.desc&limit=1000`,
        {
          headers: getSupabaseHeaders(cfg.anonKey),
        }
      ),
    ]);
    const latencyMs = Math.round(performance.now() - startMs);
    if (!profilesRes.ok) {
      return {
        profiles: localRoster,
        visitorSessions: [],
        announcement: null,
        latencyMs,
        error: `HTTP ${profilesRes.status}`,
      };
    }

    const profileRows = (await profilesRes.json()) as SupabaseProfileRow[];
    const telemetryRows = telemetryRes.ok
      ? ((await telemetryRes.json()) as Array<{ username: string; title: string }>)
      : [];
    const profiles: SovereignUserProfile[] = [];
    const visitorSessions: CloudVisitorSessionEntry[] = [];
    let announcement: GlobalAdminAnnouncement | null = null;
    const seenUsernames = new Set<string>();

    for (const tr of telemetryRows) {
      if (!tr.username || !tr.username.startsWith('__telemetry_session__:')) continue;
      try {
        const parsed = JSON.parse(tr.title) as CloudVisitorSessionEntry;
        if (parsed && parsed.sessionId) {
          visitorSessions.push(parsed);
        }
      } catch {
        // Ignore malformed telemetry row
      }
    }

    const profilesByKey = new Map<string, SovereignUserProfile>();
    for (const r of profileRows) {
      if (!r.username) continue;
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
      if (RETIRED_EXACT_USERNAMES.has(r.username)) continue;

      const normKey = r.username.trim().toLowerCase();
      if (!normKey) continue;
      const localMatch = localRoster.find(
        (a) => a.username.trim().toLowerCase() === normKey
      );
      const hydrated = hydrateProfileFromRow(r, localMatch);
      const prev = profilesByKey.get(normKey);
      if (!prev) {
        profilesByKey.set(normKey, hydrated);
      } else {
        profilesByKey.set(normKey, {
          ...prev,
          email: prev.email || hydrated.email,
          isAdmin: Boolean(prev.isAdmin || hydrated.isAdmin),
        });
      }
      seenUsernames.add(normKey);
    }
    profiles.push(...profilesByKey.values());

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
  if (RETIRED_EXACT_USERNAMES.has(profile.username)) {
    return { ok: false, error: 'Conta arquivada.' };
  }
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

  const adminCreds = getVerifiedActiveAdminCredentials();
  if (adminCreds) {
    const adminRpc = await invokeSupabaseRpc<{ ok?: boolean; code?: string }>('rpc_admin_action', {
      p_admin_username: adminCreds.username,
      p_admin_password_hash: adminCreds.passwordHash,
      p_action: 'save_profile',
      p_target_username: profile.username,
      p_payload: {
        title: encodeCloudTitleMeta(profile, false),
        email: (profile.email || '').trim().toLowerCase(),
        password_hash: profile.passwordHash || '',
        is_admin: isAdminProfile(profile),
        avatar_card_id: profile.avatarCardId,
        elo_rating: profile.eloRating,
        pvp_wins: profile.pvpWins,
        pvp_losses: profile.pvpLosses,
        gold: profile.gold ?? 0,
      },
    });
    if (adminRpc.status === 'ok') {
      return adminRpc.data?.ok
        ? { ok: true }
        : { ok: false, error: adminRpc.data?.code || 'Acesso administrativo negado.' };
    }
    if (adminRpc.status !== 'missing_rpc') {
      return { ok: false, error: adminRpc.errorText || `HTTP ${adminRpc.httpStatus}` };
    }
  } else {
    // Regular user syncing their own local account on startup (App.tsx)
    const selfRpc = await invokeSupabaseRpc<{ ok?: boolean; code?: string }>(
      'rpc_sync_sovereign_profile',
      {
        p_username: profile.username,
        p_password_hash: profile.passwordHash || '',
        p_email: (profile.email || '').trim().toLowerCase(),
        p_title_json: encodeCloudTitleMeta(profile, false),
        p_avatar_card_id: profile.avatarCardId,
        p_elo_rating: profile.eloRating,
        p_pvp_wins: profile.pvpWins,
        p_pvp_losses: profile.pvpLosses,
        p_gold: profile.gold ?? 0,
      }
    );
    if (selfRpc.status === 'ok') {
      return selfRpc.data?.ok ? { ok: true } : { ok: false, error: selfRpc.data?.code };
    }
    if (selfRpc.status !== 'missing_rpc') {
      return { ok: false, error: selfRpc.errorText || `HTTP ${selfRpc.httpStatus}` };
    }
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
        title: encodeCloudTitleMeta(profile, true),
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
    const remaining = getSavedAccountsRoster().filter((a) => a.username !== username);
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS_ROSTER, JSON.stringify(remaining));
  } catch {
    // Ignore
  }

  if (!cfg.isConfigured) return true;

  const adminCreds = getVerifiedActiveAdminCredentials();
  if (adminCreds) {
    const rpcRes = await invokeSupabaseRpc<{ ok?: boolean }>('rpc_admin_action', {
      p_admin_username: adminCreds.username,
      p_admin_password_hash: adminCreds.passwordHash,
      p_action: 'delete_profile',
      p_target_username: username,
    });
    if (rpcRes.status === 'ok') return Boolean(rpcRes.data?.ok);
    if (rpcRes.status !== 'missing_rpc') return false;
  }

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
  await upsertCloudSystemRecord({
    key: `__telemetry_session__:${session.sessionId}`,
    payload: JSON.stringify(session),
    avatarCardId: 'neutral_10_valkyra_pentacromatica',
    eloRating: session.events.length,
    pvpWins: session.registeredUsername ? 1 : 0,
    pvpLosses: 0,
  });
}

export async function clearCloudVisitorTelemetryForAdmin(): Promise<boolean> {
  const cfg = getSupabaseConfig();
  if (!cfg.isConfigured) return false;

  const adminCreds = getVerifiedActiveAdminCredentials();
  if (adminCreds) {
    const rpcRes = await invokeSupabaseRpc<{ ok?: boolean }>('rpc_admin_action', {
      p_admin_username: adminCreds.username,
      p_admin_password_hash: adminCreds.passwordHash,
      p_action: 'clear_telemetry',
    });
    if (rpcRes.status === 'ok') return Boolean(rpcRes.data?.ok);
    if (rpcRes.status !== 'missing_rpc') return false;
  }

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

  const adminCreds = getVerifiedActiveAdminCredentials();
  if (adminCreds) {
    const rpcRes = await invokeSupabaseRpc<{ ok?: boolean }>('rpc_admin_action', {
      p_admin_username: adminCreds.username,
      p_admin_password_hash: adminCreds.passwordHash,
      p_action: 'set_announcement',
      p_payload: announcement,
    });
    if (rpcRes.status === 'ok') return Boolean(rpcRes.data?.ok);
    if (rpcRes.status !== 'missing_rpc') return false;
  }

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
        elo_rating: INITIAL_PLAYER_ELO,
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

// ============================================================================
// 8. UNIFIED GLOBAL ELO LEADERBOARD (PLATFORM HUMAN USERS + AI SOVEREIGNS)
// ============================================================================

export type UnifiedLeaderboardEntryKind = 'human' | 'sovereign_ai';

export interface UnifiedLeaderboardEntry {
  entryId: string;
  kind: UnifiedLeaderboardEntryKind;
  globalRank: number;
  categoryRank: number;
  displayName: string;
  subtitle: string;
  realmOrOrigin: string;
  avatarCardId: string;
  eloRating: number;
  eloRd?: number;
  wins: number;
  losses: number;
  totalGames: number;
  winRate: number;
  domains: Domain[];
  format?: UnifiedFormatKind;
  skillTier?: AiSkillTier;
  isGrandSovereign?: boolean;
  isCurrentUser?: boolean;
  isAdmin?: boolean;
  sovereignEntry?: SovereignAiLeaderboardEntry;
  humanProfile?: SovereignUserProfile;
  recentEloDelta?: number;
}

export interface UnifiedLeaderboardSnapshot {
  entries: UnifiedLeaderboardEntry[];
  humanCount: number;
  sovereignCount: number;
  currentUserEntry: UnifiedLeaderboardEntry | null;
  nextSovereignTarget: UnifiedLeaderboardEntry | null;
  isCloudConnected: boolean;
  latencyMs: number;
  error?: string;
}

function inferHumanDomains(profile: SovereignUserProfile): Domain[] {
  const prefDeck =
    profile.customDecks?.find((d) => d.id === profile.preferredDeckId) ??
    profile.customDecks?.[0];
  if (prefDeck && prefDeck.cardIds.length > 0) {
    const counts = new Map<Domain, number>();
    for (const cid of prefDeck.cardIds) {
      const c = CARDS_BY_ID[cid];
      if (c && c.domain !== 'neutral') {
        counts.set(c.domain, (counts.get(c.domain) ?? 0) + 1);
      }
    }
    const sorted = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([d]) => d);
    if (sorted.length > 0) return sorted.slice(0, 3);
  }
  const avatarCard = CARDS_BY_ID[profile.avatarCardId];
  return avatarCard ? [avatarCard.domain] : ['neutral'];
}

export async function fetchUnifiedPlatformLeaderboard(
  currentUser?: SovereignUserProfile | null,
  options?: { includeRegionalCommanders?: boolean }
): Promise<UnifiedLeaderboardSnapshot> {
  const includeCommanders = options?.includeRegionalCommanders ?? true;
  const cfg = getSupabaseConfig();
  const localRoster = getSavedAccountsRoster().filter((a) => !isUnregisteredProfile(a));
  const startMs = performance.now();

  let cloudProfiles: SovereignUserProfile[] = [];
  let isCloudConnected = false;
  let errorMsg: string | undefined;

  if (cfg.isConfigured) {
    try {
      const res = await fetch(
        `${cfg.url}/rest/v1/sovereign_profiles?username=not.like.__*&select=*&order=elo_rating.desc&limit=500`,
        {
          headers: getSupabaseHeaders(cfg.anonKey),
        }
      );
      if (res.ok) {
        const rows = (await res.json()) as SupabaseProfileRow[];
        isCloudConnected = true;
        for (const r of rows) {
          if (!r.username || r.username.startsWith('__')) continue;
          const localMatch = localRoster.find(
            (a) => a.username.toLowerCase() === r.username.toLowerCase()
          );
          cloudProfiles.push(hydrateProfileFromRow(r, localMatch));
        }
      } else {
        errorMsg = `HTTP ${res.status}`;
      }
    } catch (err) {
      errorMsg = err instanceof Error ? err.message : 'Modo local ativo';
    }
  }

  const latencyMs = Math.round(performance.now() - startMs);

  // Merge cloud + local + currentUser (so local active user always sees instant ELO updates)
  const humanByUsername = new Map<string, SovereignUserProfile>();
  for (const cp of cloudProfiles) {
    humanByUsername.set(cp.username.toLowerCase(), cp);
  }
  for (const lp of localRoster) {
    const key = lp.username.toLowerCase();
    const existing = humanByUsername.get(key);
    if (!existing || (lp.lastActiveAt ?? 0) >= (existing.lastActiveAt ?? 0)) {
      humanByUsername.set(key, lp);
    }
  }
  if (currentUser && !isUnregisteredProfile(currentUser)) {
    humanByUsername.set(currentUser.username.toLowerCase(), currentUser);
  }

  const rawEntries: UnifiedLeaderboardEntry[] = [];
  const currentUsernameLower =
    currentUser && !isUnregisteredProfile(currentUser)
      ? currentUser.username.toLowerCase()
      : null;

  for (const hp of humanByUsername.values()) {
    const rankedWins = (hp.pvpWins ?? 0) + (hp.rankedSovereignWins ?? 0);
    const rankedLosses = (hp.pvpLosses ?? 0) + (hp.rankedSovereignLosses ?? 0);
    const totalGames = rankedWins + rankedLosses;
    const winRate = totalGames > 0 ? rankedWins / totalGames : 0;
    const isMe = currentUsernameLower !== null && hp.username.toLowerCase() === currentUsernameLower;

    rawEntries.push({
      entryId: `human_${hp.username.toLowerCase()}`,
      kind: 'human',
      globalRank: 0,
      categoryRank: 0,
      displayName: hp.username,
      subtitle: hp.title || getAvatarHonorificTitle(hp.avatarCardId),
      realmOrOrigin: isMe ? 'Sua Conta de Soberano' : 'Soberano da Plataforma',
      avatarCardId:
        hp.avatarCardId && CARDS_BY_ID[hp.avatarCardId]
          ? hp.avatarCardId
          : 'neutral_10_valkyra_pentacromatica',
      eloRating: hp.eloRating ?? INITIAL_PLAYER_ELO,
      wins: rankedWins,
      losses: rankedLosses,
      totalGames,
      winRate,
      domains: inferHumanDomains(hp),
      isCurrentUser: isMe,
      isAdmin: isAdminProfile(hp),
      humanProfile: hp,
      recentEloDelta:
        hp.recentRankedHistory?.[0] &&
        Date.now() - hp.recentRankedHistory[0].timestamp <= 15 * 60_000
          ? hp.recentRankedHistory[0].deltaElo
          : 0,
    });
  }

  const { fetchHydratedLiveSovereignRoster } = await import('./sovereignLiveEloEngine');
  const liveSovereigns = await fetchHydratedLiveSovereignRoster();
  const aiSource = includeCommanders
    ? liveSovereigns.roster
    : liveSovereigns.roster.filter((s) => s.isGrandSovereign);

  for (const s of aiSource) {
    rawEntries.push({
      entryId: `ai_${s.sovereignId}`,
      kind: 'sovereign_ai',
      globalRank: 0,
      categoryRank: 0,
      displayName: s.sovereignName,
      subtitle: s.archetypeName,
      realmOrOrigin: s.realmOrigin,
      avatarCardId:
        s.avatarCardId && CARDS_BY_ID[s.avatarCardId]
          ? s.avatarCardId
          : 'neutral_10_valkyra_pentacromatica',
      eloRating: s.eloRating,
      eloRd: s.eloRd,
      wins: s.simulatedWins,
      losses: s.simulatedLosses,
      totalGames: s.simulatedGames,
      winRate: s.simulatedWinRate,
      domains: s.domains,
      format: s.format,
      skillTier: s.skillTier,
      isGrandSovereign: s.isGrandSovereign,
      sovereignEntry: s,
      recentEloDelta: liveSovereigns.recentDeltaById[s.sovereignId] ?? 0,
    });
  }

  rawEntries.sort((a, b) => {
    if (b.eloRating !== a.eloRating) return b.eloRating - a.eloRating;
    if (a.isCurrentUser && !b.isCurrentUser) return -1;
    if (!a.isCurrentUser && b.isCurrentUser) return 1;
    return b.winRate - a.winRate;
  });

  let humanIdx = 0;
  let sovIdx = 0;
  let currentUserEntry: UnifiedLeaderboardEntry | null = null;

  for (let i = 0; i < rawEntries.length; i++) {
    const e = rawEntries[i];
    e.globalRank = i + 1;
    if (e.kind === 'human') {
      humanIdx += 1;
      e.categoryRank = humanIdx;
      if (e.isCurrentUser) currentUserEntry = e;
    } else {
      sovIdx += 1;
      e.categoryRank = sovIdx;
    }
  }

  const refElo = currentUserEntry?.eloRating ?? currentUser?.eloRating ?? INITIAL_PLAYER_ELO;
  let nextSovereignTarget: UnifiedLeaderboardEntry | null = null;
  for (let i = rawEntries.length - 1; i >= 0; i--) {
    const e = rawEntries[i];
    if (e.kind === 'sovereign_ai' && e.eloRating > refElo) {
      nextSovereignTarget = e;
      break;
    }
  }
  if (!nextSovereignTarget) {
    nextSovereignTarget = rawEntries.find((e) => e.kind === 'sovereign_ai') ?? null;
  }

  return {
    entries: rawEntries,
    humanCount: humanIdx,
    sovereignCount: sovIdx,
    currentUserEntry,
    nextSovereignTarget,
    isCloudConnected,
    latencyMs,
    error: errorMsg,
  };
}

export interface RankedSovereignDuelUpdateResult {
  updatedProfile: SovereignUserProfile;
  previousElo: number;
  newElo: number;
  deltaElo: number;
  kFactorUsed: number;
  repeatCount: number;
  goldEarned: number;
}

export function recordRankedSovereignDuelResult(
  profile: SovereignUserProfile,
  opponentEntry: SovereignAiLeaderboardEntry,
  didWin: boolean,
  victoryGoldBonus = 15
): RankedSovereignDuelUpdateResult {
  const previousElo = profile.eloRating ?? INITIAL_PLAYER_ELO;
  const totalRankedGamesPlayed =
    (profile.pvpWins ?? 0) +
    (profile.pvpLosses ?? 0) +
    (profile.rankedSovereignWins ?? 0) +
    (profile.rankedSovereignLosses ?? 0);
  const calc = calculateFideRankedEloDelta({
    playerElo: previousElo,
    opponentElo: opponentEntry.eloRating,
    didWin,
    recentOpponentIds: profile.recentRankedOpponentIds ?? [],
    opponentKey: opponentEntry.sovereignId,
    totalRankedGamesPlayed,
  });

  const newElo = Math.max(100, previousElo + calc.delta);
  const goldEarned = !isUnregisteredProfile(profile) && didWin ? victoryGoldBonus : 0;
  const nextHistory = [...(profile.recentRankedOpponentIds ?? []), opponentEntry.sovereignId].slice(
    -6
  );
  const historyItem: RankedMatchHistoryItem = {
    id: `sov_${opponentEntry.sovereignId}_${Date.now()}`,
    timestamp: Date.now(),
    opponentName: opponentEntry.sovereignName,
    opponentElo: opponentEntry.eloRating,
    opponentAvatarCardId: opponentEntry.avatarCardId,
    mode: 'sovereign',
    didWin,
    deltaElo: newElo - previousElo,
    newElo,
    replayShareId: latestPersonalMatchShareIdResolver?.(),
  };

  const updatedProfile: SovereignUserProfile = {
    ...profile,
    eloRating: newElo,
    eloBaseVersion: ELO_SCHEMA_VERSION,
    rankedSovereignWins: (profile.rankedSovereignWins ?? 0) + (didWin ? 1 : 0),
    rankedSovereignLosses: (profile.rankedSovereignLosses ?? 0) + (didWin ? 0 : 1),
    recentRankedOpponentIds: nextHistory,
    recentRankedHistory: [historyItem, ...(profile.recentRankedHistory ?? [])].slice(0, 10),
    arenaWins: (profile.arenaWins ?? 0) + (didWin ? 1 : 0),
    gold: isUnregisteredProfile(profile) ? 0 : (profile.gold ?? 0) + goldEarned,
    lastActiveAt: Date.now(),
  };

  setActiveTabUserProfile(updatedProfile);
  if (!isUnregisteredProfile(updatedProfile)) {
    void adminSaveCloudProfile(updatedProfile);
    void import('./sovereignLiveEloEngine').then((m) =>
      m.recordHumanVsSovereignLiveMatch(
        opponentEntry.sovereignId,
        didWin,
        previousElo
      )
    );
  }

  return {
    updatedProfile,
    previousElo,
    newElo,
    deltaElo: newElo - previousElo,
    kFactorUsed: calc.kFactorUsed,
    repeatCount: calc.repeatCount,
    goldEarned,
  };
}

