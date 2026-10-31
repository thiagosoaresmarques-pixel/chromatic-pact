import React, { Suspense, useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { CampaignBoss, CardDefinition, ConquestBattleModifiers, RiftMutatorId } from './types/game';
import { ALL_CARDS, CARDS_BY_ID } from './data/cards';
import { getSharedAudioContext, isMuted, toggleMute } from './utils/soundEngine';
import {
  getCurrentMusicState,
  MusicStateDescriptor,
  setMusicState,
  startAdaptiveMusic,
  subscribeMusicState,
} from './utils/musicEngine';
import type { CustomSavedDeck } from './components/BattleArena';
import type { ConquestBattleOutcome } from './components/ConquestView';
import type { ConquestFactionId } from './data/vaeloriaConquestData';
import type { AccountModalTab } from './components/MultiplayerView';
import type { TacticalProblem } from './data/problems';
import {
  NAVIGATE_TO_POEM_EVENT,
  NavigateToPoemDetail,
} from './data/epicPoemData';
import { buildGeographicBattleModifiers } from './data/vaeloriaMultimapData';
import { consumePendingOverworldBuff } from './data/vaeloriaOverworldEvents';
import { applyEquippedRelicToModifiers } from './data/sovereignRelics';
import type { DraftBattleOutcome, DraftRewardSummary } from './data/vaeloriaDraftData';
import {
  buildRiftBattleEncounter,
  FRACTURE_RIFTS_BY_ID,
  recordRiftVictory,
  STANDARD_RIFT_WIN_GOLD,
  WEEKLY_RIFT_GOLD_BONUS,
  WEEKLY_RIFT_SHARDS_BONUS,
} from './data/fractureRiftsData';
import {
  craftSingleCardCopy,
  resolvePackDuplicatesWithShards,
  salvageAllExcessDuplicates,
} from './utils/craftingEngine';
import { recordDailyQuestEvent } from './utils/dailyQuestsEngine';
import { CardInspectModal } from './components/CardView';
import { HomeSimulatedDuelShowcase } from './components/HomeSimulatedDuelShowcase';
import { SovereignRoyalCommandStrip } from './components/SovereignRoyalCommandStrip';

// Lazy-loaded heavy modules for instant initial load & modular chunking (Onda 5)
const BattleArena = React.lazy(() =>
  import('./components/BattleArena').then((m) => ({ default: m.BattleArena }))
);
const DeckBuilder = React.lazy(() =>
  import('./components/DeckBuilder').then((m) => ({ default: m.DeckBuilder }))
);
const CampaignView = React.lazy(() =>
  import('./components/CampaignView').then((m) => ({ default: m.CampaignView }))
);
const PackOpener = React.lazy(() =>
  import('./components/PackOpener').then((m) => ({ default: m.PackOpener }))
);
const TacticalGuideView = React.lazy(() =>
  import('./components/TacticalGuideView').then((m) => ({ default: m.TacticalGuideView }))
);
const ExpeditionView = React.lazy(() =>
  import('./components/ExpeditionView').then((m) => ({ default: m.ExpeditionView }))
);
const ConquestView = React.lazy(() =>
  import('./components/ConquestView').then((m) => ({ default: m.ConquestView }))
);
const TutorialCodexView = React.lazy(() =>
  import('./components/TutorialCodexView').then((m) => ({ default: m.TutorialCodexView }))
);
const MythologyAtlasView = React.lazy(() =>
  import('./components/MythologyAtlasView').then((m) => ({ default: m.MythologyAtlasView }))
);
const MultiplayerView = React.lazy(() =>
  import('./components/MultiplayerView').then((m) => ({ default: m.MultiplayerView }))
);
const SovereignAccountModal = React.lazy(() =>
  import('./components/MultiplayerView').then((m) => ({ default: m.SovereignAccountModal }))
);
const AdminDashboardView = React.lazy(() =>
  import('./components/AdminDashboardView').then((m) => ({ default: m.AdminDashboardView }))
);
const ProblemsView = React.lazy(() =>
  import('./components/ProblemsView').then((m) => ({ default: m.ProblemsView }))
);
const DraftCrucibleView = React.lazy(() =>
  import('./components/DraftCrucibleView').then((m) => ({ default: m.DraftCrucibleView }))
);
const FractureRiftsView = React.lazy(() =>
  import('./components/FractureRiftsView').then((m) => ({ default: m.FractureRiftsView }))
);
import {
  adminSaveCloudProfile,
  ensureStarterDeckForUser,
  fetchGlobalAdminAnnouncement,
  getActiveTabUserProfile,
  getSavedAccountsRoster,
  GRIMOIRE_REPLACEMENT_GOLD_COST,
  isAdminProfile,
  isUnregisteredProfile,
  MultiplayerRoom,
  recordPvpMatchResult,
  setActiveTabUserProfile,
  SovereignUserProfile,
  subscribeMultiplayerBus,
  VICTORY_GOLD_REWARD,
} from './utils/multiplayerEngine';
import { initAdsTelemetry, trackAdsEvent } from './utils/adsTelemetry';

export interface SovereignNotification {
  id: string;
  kicker: string;
  title: string;
  message: string;
  createdAt: number;
  read: boolean;
  actionLabel?: string;
  actionTarget?: ActiveTab | 'account_modal';
}

type ActiveTab =
  | 'home'
  | 'arena'
  | 'draft'
  | 'rifts'
  | 'problems'
  | 'multiplayer'
  | 'campaign'
  | 'expedition'
  | 'conquest'
  | 'tactics'
  | 'deckbuilder'
  | 'packs'
  | 'mythology'
  | 'rules'
  | 'admin';

type NavPillarId = 'home' | 'battle' | 'vaeloria' | 'collection' | 'codex';

interface NavSubItem {
  tab: ActiveTab;
  icon: string;
  label: string;
  shortDesc: string;
}

interface NavPillarDef {
  id: NavPillarId;
  icon: string;
  label: string;
  defaultTab: ActiveTab;
  items: NavSubItem[];
}

const NAV_PILLARS: NavPillarDef[] = [
  {
    id: 'home',
    icon: '🏠',
    label: 'Início',
    defaultTab: 'home',
    items: [],
  },
  {
    id: 'battle',
    icon: '⚔️',
    label: 'Batalhar',
    defaultTab: 'arena',
    items: [
      {
        tab: 'arena',
        icon: '⚔️',
        label: 'Arena Solo',
        shortDesc: 'Duelos rápidos contra os 30 Grimórios da IA',
      },
      {
        tab: 'draft',
        icon: '⚖️',
        label: 'Crisol (Draft)',
        shortDesc: 'Forje 40 cartas na hora e dispute até 7 vitórias',
      },
      {
        tab: 'rifts',
        icon: '🌀',
        label: 'Fendas',
        shortDesc: 'Eventos com mutadores de regra e bônus semanal',
      },
      {
        tab: 'multiplayer',
        icon: '🌐',
        label: 'Conclave 1×1',
        shortDesc: 'Salas online em tempo real e Ranking de Reputação',
      },
      {
        tab: 'problems',
        icon: '♟️',
        label: 'Problemas Táticos',
        shortDesc: 'Desafios de xeque-mate em 1 turno e Problema do Dia',
      },
    ],
  },
  {
    id: 'vaeloria',
    icon: '🗺️',
    label: 'Vaeloria',
    defaultTab: 'campaign',
    items: [
      {
        tab: 'campaign',
        icon: '🏰',
        label: 'Campanha',
        shortDesc: 'Crônica dos 26 Soberanos pelo Multimapa de Vaeloria',
      },
      {
        tab: 'expedition',
        icon: '🧭',
        label: 'Expedição',
        shortDesc: 'Jornada Roguelite com bênçãos e evolução de grimório',
      },
      {
        tab: 'conquest',
        icon: '🗺️',
        label: 'Conquista',
        shortDesc: 'Guerra Continental das 30 Províncias e 6 Tronos',
      },
    ],
  },
  {
    id: 'collection',
    icon: '📖',
    label: 'Coleção',
    defaultTab: 'deckbuilder',
    items: [
      {
        tab: 'deckbuilder',
        icon: '📖',
        label: 'Grimório',
        shortDesc: 'Construtor de decks de 100 cartas e acervo desbloqueado',
      },
      {
        tab: 'packs',
        icon: '🎁',
        label: 'Relicário',
        shortDesc: 'Rompa Selos Astrais com Ouro para expandir sua coleção',
      },
    ],
  },
  {
    id: 'codex',
    icon: '📜',
    label: 'Códice',
    defaultTab: 'tactics',
    items: [
      {
        tab: 'tactics',
        icon: '🔮',
        label: 'Oráculo',
        shortDesc: 'Guia estratégico de combos, sinergias e arquétipos',
      },
      {
        tab: 'mythology',
        icon: '📜',
        label: 'Mitologia',
        shortDesc: 'Atlas dos Reinos e Epopeia completa em VII Cantos',
      },
      {
        tab: 'rules',
        icon: '🎓',
        label: 'Tutorial',
        shortDesc: 'Regras fundamentais, zonas de combate e glossário',
      },
    ],
  },
];

const LAST_PILLAR_TAB_STORAGE_KEY = 'chromatic_pact_last_pillar_tab_v1';

function resolvePillarForTab(tab: ActiveTab): NavPillarId | null {
  switch (tab) {
    case 'home':
      return 'home';
    case 'arena':
    case 'draft':
    case 'rifts':
    case 'multiplayer':
    case 'problems':
      return 'battle';
    case 'campaign':
    case 'expedition':
    case 'conquest':
      return 'vaeloria';
    case 'deckbuilder':
    case 'packs':
      return 'collection';
    case 'tactics':
    case 'mythology':
    case 'rules':
      return 'codex';
    default:
      return null;
  }
}

interface ActiveConquestContext {
  provinceId: string;
  isDefensive: boolean;
  attackerFactionId?: ConquestFactionId;
  modifiers: ConquestBattleModifiers;
}

const APP_NAV_STATE_STORAGE_KEY = 'chromatic_pact_app_nav_state_v1';
const ACTIVE_BATTLE_STORAGE_KEY = 'chromatic_pact_active_battle_v1';

interface SavedAppNavState {
  activeTab: ActiveTab;
  activeCampaignBoss: CampaignBoss | null;
  activeProblem: TacticalProblem | null;
  campaignPlayerDeckIds: string[] | null;
  isExpeditionBattle: boolean;
  isDraftBattle?: boolean;
  activeRiftId?: RiftMutatorId | null;
  expeditionBlessingId?: string | null;
  activeConquestContext?: ActiveConquestContext | null;
  activeGeoModifiers?: ConquestBattleModifiers | null;
  quickDuelDecks: {
    playerDeckId?: string;
    aiDeckId?: string;
  };
}

function loadSavedAppNavState(): SavedAppNavState | null {
  try {
    const raw = localStorage.getItem(APP_NAV_STATE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SavedAppNavState>;
    if (!parsed || typeof parsed.activeTab !== 'string') return null;
    return {
      activeTab: parsed.activeTab as ActiveTab,
      activeCampaignBoss: parsed.activeCampaignBoss ?? null,
      activeProblem: parsed.activeProblem ?? null,
      campaignPlayerDeckIds: Array.isArray(parsed.campaignPlayerDeckIds)
        ? parsed.campaignPlayerDeckIds
        : null,
      isExpeditionBattle: Boolean(parsed.isExpeditionBattle),
      isDraftBattle: Boolean(parsed.isDraftBattle),
      activeRiftId: parsed.activeRiftId ?? null,
      expeditionBlessingId: parsed.expeditionBlessingId ?? null,
      activeConquestContext: parsed.activeConquestContext ?? null,
      activeGeoModifiers: parsed.activeGeoModifiers ?? null,
      quickDuelDecks: parsed.quickDuelDecks ?? {},
    };
  } catch {
    return null;
  }
}

export const App: React.FC = () => {
  const initialNavState = useMemo(() => loadSavedAppNavState(), []);
  const [activeTab, setActiveTab] = useState<ActiveTab>(
    () => initialNavState?.activeTab ?? 'home'
  );
  const [soundMuted, setSoundMuted] = useState<boolean>(() => isMuted());
  const [musicInfo, setMusicInfo] = useState<MusicStateDescriptor>(() => getCurrentMusicState());

  // Sovereign User Profile & 1v1 Multiplayer State
  const [currentUser, setCurrentUser] = useState<SovereignUserProfile>(() =>
    getActiveTabUserProfile()
  );

  const isGuest = isUnregisteredProfile(currentUser);
  const savedAdminProfile = useMemo(
    () => getSavedAccountsRoster().find((acc) => isAdminProfile(acc)) ?? null,
    [currentUser]
  );
  const isAdmin = isAdminProfile(currentUser) || Boolean(savedAdminProfile);

  const handleOpenAdminTab = useCallback(() => {
    if (!isAdminProfile(currentUser) && savedAdminProfile) {
      const ensured = ensureStarterDeckForUser(savedAdminProfile);
      setActiveTabUserProfile(ensured);
      setCurrentUser(ensured);
    }
    setActiveCampaignBoss(null);
    setActiveOnlineMatch(null);
    setIsArenaNavExpanded(false);
    setActiveTab('admin');
  }, [currentUser, savedAdminProfile]);

  // Per-account economy & progression (Guests always remain at 0 Gold and 0 customDecks)
  const gold = isGuest ? 0 : currentUser.gold ?? 0;
  const astralShards = isGuest ? 0 : currentUser.astralShards ?? 0;
  const customDecks: CustomSavedDeck[] = useMemo(
    () => (isGuest ? [] : currentUser.customDecks ?? []),
    [isGuest, currentUser.customDecks]
  );
  const defeatedBossIds: string[] = useMemo(
    () => (isGuest ? [] : currentUser.defeatedBossIds ?? []),
    [isGuest, currentUser.defeatedBossIds]
  );
  const arenaWins = isGuest ? 0 : currentUser.arenaWins ?? 0;

  const baseStarterCardIds: string[] = useMemo(() => {
    if (isGuest) return [];
    return currentUser.starterDeckCardIds && currentUser.starterDeckCardIds.length > 0
      ? currentUser.starterDeckCardIds
      : customDecks[0]?.cardIds ?? [];
  }, [isGuest, currentUser.starterDeckCardIds, customDecks]);

  const unlockedCardIds: Record<string, number> = useMemo(() => {
    if (isGuest) return {};
    const merged: Record<string, number> = {};
    for (const cid of baseStarterCardIds) {
      merged[cid] = (merged[cid] ?? 0) + 1;
    }
    const extra = currentUser.extraUnlockedCards ?? {};
    for (const [cid, count] of Object.entries(extra)) {
      if (count > 0) {
        merged[cid] = (merged[cid] ?? 0) + count;
      }
    }
    return merged;
  }, [isGuest, baseStarterCardIds, currentUser.extraUnlockedCards]);

  const salvageableInfo = useMemo(() => {
    if (isGuest) return { totalShardsEarned: 0, cardsSalvagedCount: 0, cleanedExtraUnlocked: {} };
    return salvageAllExcessDuplicates(baseStarterCardIds, currentUser.extraUnlockedCards ?? {});
  }, [isGuest, baseStarterCardIds, currentUser.extraUnlockedCards]);

  // Active Campaign / Expedition / Tactical Problem Match State (Restored across page reloads)
  const [activeCampaignBoss, setActiveCampaignBoss] = useState<CampaignBoss | null>(
    () => initialNavState?.activeCampaignBoss ?? null
  );
  const [activeProblem, setActiveProblem] = useState<TacticalProblem | null>(
    () => initialNavState?.activeProblem ?? null
  );
  const [isOnboardingCalloutHidden, setIsOnboardingCalloutHidden] = useState<boolean>(false);
  const [campaignPlayerDeckIds, setCampaignPlayerDeckIds] = useState<string[] | null>(
    () => initialNavState?.campaignPlayerDeckIds ?? null
  );
  const [isExpeditionBattle, setIsExpeditionBattle] = useState<boolean>(
    () => initialNavState?.isExpeditionBattle ?? false
  );
  const [isDraftBattle, setIsDraftBattle] = useState<boolean>(
    () => Boolean(initialNavState?.isDraftBattle)
  );
  const [activeRiftId, setActiveRiftId] = useState<RiftMutatorId | null>(
    () => initialNavState?.activeRiftId ?? null
  );
  const [lastDraftOutcome, setLastDraftOutcome] = useState<DraftBattleOutcome | null>(null);
  const [expeditionBlessingId, setExpeditionBlessingId] = useState<string | null>(
    () => initialNavState?.expeditionBlessingId ?? null
  );
  const [lastClearedExpeditionBossId, setLastClearedExpeditionBossId] = useState<string | null>(
    null
  );
  const [activeConquestContext, setActiveConquestContext] = useState<ActiveConquestContext | null>(
    () => initialNavState?.activeConquestContext ?? null
  );
  const [activeGeoModifiers, setActiveGeoModifiers] = useState<ConquestBattleModifiers | null>(
    () => initialNavState?.activeGeoModifiers ?? null
  );
  const [lastConquestOutcome, setLastConquestOutcome] = useState<ConquestBattleOutcome | null>(
    null
  );
  const [quickDuelDecks, setQuickDuelDecks] = useState<{
    playerDeckId?: string;
    aiDeckId?: string;
  }>(() => initialNavState?.quickDuelDecks ?? {});
  const [showcaseInspectCard, setShowcaseInspectCard] = useState<CardDefinition | null>(null);
  const [poemJumpTarget, setPoemJumpTarget] = useState<NavigateToPoemDetail | null>(null);

  // Global Card -> Epic Poem bridge listener (works from any CardInspectModal across the app)
  useEffect(() => {
    const handlePoemNavigate = (ev: Event) => {
      const customEv = ev as CustomEvent<NavigateToPoemDetail>;
      if (!customEv.detail) return;
      setShowcaseInspectCard(null);
      setPoemJumpTarget({ ...customEv.detail });
      setActiveTab('mythology');
    };
    window.addEventListener(NAVIGATE_TO_POEM_EVENT, handlePoemNavigate);
    return () => window.removeEventListener(NAVIGATE_TO_POEM_EVENT, handlePoemNavigate);
  }, []);

  // Persist navigation & active match context across page reloads (F5 / mobile refresh)
  useEffect(() => {
    try {
      const stateToSave: SavedAppNavState = {
        activeTab,
        activeCampaignBoss,
        activeProblem,
        campaignPlayerDeckIds,
        isExpeditionBattle,
        isDraftBattle,
        activeRiftId,
        expeditionBlessingId,
        activeConquestContext,
        activeGeoModifiers,
        quickDuelDecks,
      };
      localStorage.setItem(APP_NAV_STATE_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch {
      // Ignore storage errors
    }
  }, [
    activeTab,
    activeCampaignBoss,
    activeProblem,
    campaignPlayerDeckIds,
    isExpeditionBattle,
    isDraftBattle,
    activeRiftId,
    expeditionBlessingId,
    activeConquestContext,
    activeGeoModifiers,
    quickDuelDecks,
  ]);

  const [accountModalState, setAccountModalState] = useState<{
    open: boolean;
    tab: AccountModalTab;
  }>({ open: false, tab: 'profile' });
  const [activeOnlineMatch, setActiveOnlineMatch] = useState<{
    room: MultiplayerRoom;
    role: 'host' | 'guest';
  } | null>(null);

  // Sovereign Notification Center State
  const [notifications, setNotifications] = useState<SovereignNotification[]>(() => {
    try {
      const saved = localStorage.getItem('chromatic_pact_notifications_v1');
      if (saved) {
        const parsed = JSON.parse(saved) as SovereignNotification[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed.slice(0, 25);
      }
    } catch {
      // Ignore
    }
    return [];
  });
  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  const [isArenaNavExpanded, setIsArenaNavExpanded] = useState<boolean>(false);
  const [liveToastNotif, setLiveToastNotif] = useState<SovereignNotification | null>(null);
  const seenRoomCodesRef = useRef<Set<string>>(new Set());

  const pushNotification = useCallback(
    (
      item: Omit<SovereignNotification, 'id' | 'createdAt' | 'read'>,
      showToast = true
    ) => {
      const created: SovereignNotification = {
        ...item,
        id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        createdAt: Date.now(),
        read: false,
      };
      setNotifications((prev) => {
        // Avoid duplicate consecutive titles
        if (prev[0] && prev[0].title === created.title && prev[0].message === created.message) {
          return prev;
        }
        const next = [created, ...prev].slice(0, 25);
        try {
          localStorage.setItem('chromatic_pact_notifications_v1', JSON.stringify(next));
        } catch {
          // Ignore
        }
        return next;
      });
      if (showToast) {
        setLiveToastNotif(created);
      }
    },
    []
  );

  useEffect(() => {
    if (!liveToastNotif) return;
    const t = window.setTimeout(() => setLiveToastNotif(null), 4500);
    return () => window.clearTimeout(t);
  }, [liveToastNotif]);

  useEffect(() => {
    if (!isNotifOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && !target.closest('.nav-notif-wrapper')) {
        setIsNotifOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsNotifOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isNotifOpen]);

  const markAllNotificationsRead = () => {
    setNotifications((prev) => {
      const next = prev.map((n) => ({ ...n, read: true }));
      try {
        localStorage.setItem('chromatic_pact_notifications_v1', JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    try {
      localStorage.removeItem('chromatic_pact_notifications_v1');
    } catch {
      // Ignore
    }
  };

  const handleNotificationAction = (n: SovereignNotification) => {
    setNotifications((prev) => {
      const next = prev.map((item) => (item.id === n.id ? { ...item, read: true } : item));
      try {
        localStorage.setItem('chromatic_pact_notifications_v1', JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
    setIsNotifOpen(false);
    setLiveToastNotif(null);
    if (!n.actionTarget) return;
    if (n.actionTarget === 'account_modal') {
      setAccountModalState({
        open: true,
        tab: isUnregisteredProfile(currentUser) ? 'create' : 'profile',
      });
    } else {
      setActiveTab(n.actionTarget);
    }
  };

  // Seed initial account / deck onboarding notification when user changes
  useEffect(() => {
    if (isGuest) {
      pushNotification(
        {
          kicker: 'CONCLAVE DOS SOBERANOS',
          title: 'Modo Visitante Ativo',
          message:
            'Crie sua Conta de Soberano para escolher seu Grimório de 100 cartas, ganhar +10 Ouro por vitória e disputar partidas 1×1.',
          actionLabel: 'Criar Conta / Entrar',
          actionTarget: 'account_modal',
        },
        false
      );
    } else if (customDecks.length === 0) {
      pushNotification(
        {
          kicker: `SOBERANO ${currentUser.username.toUpperCase()}`,
          title: 'Monte seu 1º Grimório (100 Cartas)',
          message:
            'Escolha um dos 5 decks iniciais, edite-o ou monte do zero no Grimório para receber suas 100 cartas iniciais na coleção.',
          actionLabel: 'Abrir Grimório',
          actionTarget: 'deckbuilder',
        },
        false
      );
    }
  }, [isGuest, currentUser.id, currentUser.username, customDecks.length, pushNotification]);

  // Listen for live 1v1 Multiplayer room events to notify user
  useEffect(() => {
    // Sync any local accounts (including tsm81) to Supabase Cloud on startup
    const roster = getSavedAccountsRoster();
    for (const acc of roster) {
      if (!isUnregisteredProfile(acc)) {
        adminSaveCloudProfile({
          ...acc,
          isAdmin: isAdminProfile(acc),
        });
      }
    }
    fetchGlobalAdminAnnouncement().then((ann) => {
      if (ann && ann.title) {
        pushNotification(
          {
            kicker: ann.kicker || 'COMUNICADO OFICIAL',
            title: ann.title,
            message: ann.message,
          },
          false
        );
      }
    });
  }, [pushNotification]);

  useEffect(() => {
    const unsub = subscribeMultiplayerBus((msg) => {
      if (msg.type === 'ROOM_UPSERT' && msg.room?.code) {
        const r = msg.room;
        if (
          r.status === 'waiting' &&
          r.host.id !== currentUser.id &&
          !seenRoomCodesRef.current.has(r.code)
        ) {
          seenRoomCodesRef.current.add(r.code);
          pushNotification({
            kicker: 'CONCLAVE 1×1 AO VIVO',
            title: `Nova Sala 1×1 Aberta (${r.code})`,
            message: `${r.host.username} (${r.host.eloRating} Reputação) aguarda um desafiante no Conclave.`,
            actionLabel: 'Ir ao Conclave 1×1',
            actionTarget: 'multiplayer',
          });
        }
      }
    });
    return () => unsub();
  }, [currentUser.id, pushNotification]);

  const unreadNotifCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const updateCurrentUserProgression = (
    patchOrUpdater:
      | Partial<SovereignUserProfile>
      | ((prev: SovereignUserProfile) => Partial<SovereignUserProfile>)
  ) => {
    setCurrentUser((prev) => {
      if (isUnregisteredProfile(prev)) return prev;
      const patch =
        typeof patchOrUpdater === 'function' ? patchOrUpdater(prev) : patchOrUpdater;
      const updated: SovereignUserProfile = {
        ...prev,
        ...patch,
      };
      setActiveTabUserProfile(updated);
      return updated;
    });
  };

  const handleOpenArenaSolo = () => {
    trackAdsEvent('start_duel', { mode: 'solo_arena', isGuest });
    setActiveCampaignBoss(null);
    setActiveProblem(null);
    setActiveOnlineMatch(null);
    setIsExpeditionBattle(false);
    setIsDraftBattle(false);
    setActiveRiftId(null);
    setActiveConquestContext(null);
    setActiveGeoModifiers(null);
    if (!isGuest && customDecks.length === 0) {
      setActiveTab('deckbuilder');
      return;
    }
    setActiveTab('arena');
  };

  const handleStartProblem = (problem: TacticalProblem) => {
    try {
      localStorage.removeItem(ACTIVE_BATTLE_STORAGE_KEY);
    } catch {
      // Ignore
    }
    setActiveCampaignBoss(null);
    setActiveOnlineMatch(null);
    setIsExpeditionBattle(false);
    setIsDraftBattle(false);
    setActiveRiftId(null);
    setActiveConquestContext(null);
    setActiveGeoModifiers(null);
    setActiveProblem(problem);
    setActiveTab('arena');
  };

  const handleToggleSound = () => {
    startAdaptiveMusic();
    const nextMuted = toggleMute();
    setSoundMuted(nextMuted);
  };

  // Initialize Google Ads / UTM attribution telemetry on mount
  useEffect(() => {
    initAdsTelemetry();
  }, []);

  // Subscribe to live music descriptor & start adaptive soundtrack on first user gesture
  useEffect(() => {
    const unsub = subscribeMusicState(setMusicInfo);
    const unlockAudio = () => {
      getSharedAudioContext();
      startAdaptiveMusic();
    };
    window.addEventListener('pointerdown', unlockAudio, { passive: true });
    window.addEventListener('touchstart', unlockAudio, { passive: true });
    window.addEventListener('keydown', unlockAudio, { passive: true });
    window.addEventListener('click', unlockAudio, { passive: true });
    return () => {
      unsub();
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('click', unlockAudio);
    };
  }, []);

  // Update non-arena tabs' ambient music mood
  useEffect(() => {
    if (activeTab === 'arena' || activeTab === 'home') return; // BattleArena & HomeSimulatedDuelShowcase manage real-time combat intensity
    if (
      activeTab === 'campaign' ||
      activeTab === 'expedition' ||
      activeTab === 'conquest' ||
      activeTab === 'draft' ||
      activeTab === 'rifts' ||
      activeTab === 'problems'
    ) {
      setMusicState('tactical', 'purple');
    } else if (activeTab === 'packs') {
      setMusicState('sanctuary', 'gold');
    } else if (activeTab === 'mythology') {
      setMusicState('sanctuary', 'blue');
    } else {
      setMusicState('sanctuary', 'neutral');
    }
  }, [activeTab]);

  const handleStartBossBattle = (boss: CampaignBoss, playerDeckIds: string[]) => {
    trackAdsEvent('start_campaign_boss', { bossId: boss.id, isExpedition: false });
    try {
      localStorage.removeItem(ACTIVE_BATTLE_STORAGE_KEY);
    } catch {
      // Ignore
    }
    const owBuff = consumePendingOverworldBuff('campaign');
    const geoMods = applyEquippedRelicToModifiers(
      buildGeographicBattleModifiers({
        mode: 'campaign',
        bossId: boss.id,
        stage: boss.stage,
        overworldBuff: owBuff,
      })
    );
    setActiveOnlineMatch(null);
    setActiveProblem(null);
    setIsExpeditionBattle(false);
    setIsDraftBattle(false);
    setActiveRiftId(null);
    setExpeditionBlessingId(null);
    setActiveConquestContext(null);
    setActiveGeoModifiers(geoMods);
    setActiveCampaignBoss(boss);
    setCampaignPlayerDeckIds(playerDeckIds);
    setActiveTab('arena');
  };

  const handleStartExpeditionBattle = (
    boss: CampaignBoss,
    playerDeckIds: string[],
    blessingId?: string | null
  ) => {
    trackAdsEvent('start_campaign_boss', { bossId: boss.id, isExpedition: true });
    try {
      localStorage.removeItem(ACTIVE_BATTLE_STORAGE_KEY);
    } catch {
      // Ignore
    }
    const owBuff = consumePendingOverworldBuff('expedition');
    const geoMods = applyEquippedRelicToModifiers(
      buildGeographicBattleModifiers({
        mode: 'expedition',
        bossId: boss.id,
        stage: boss.stage,
        overworldBuff: owBuff,
      })
    );
    setActiveOnlineMatch(null);
    setActiveProblem(null);
    setIsExpeditionBattle(true);
    setIsDraftBattle(false);
    setActiveRiftId(null);
    setExpeditionBlessingId(blessingId ?? null);
    setActiveConquestContext(null);
    setActiveGeoModifiers(geoMods);
    setActiveCampaignBoss(boss);
    setCampaignPlayerDeckIds(playerDeckIds);
    setActiveTab('arena');
  };

  const handleStartConquestBattle = (params: {
    boss: CampaignBoss;
    playerDeckCardIds: string[];
    modifiers: ConquestBattleModifiers;
    provinceId: string;
    isDefensive: boolean;
    attackerFactionId?: ConquestFactionId;
  }) => {
    trackAdsEvent('start_campaign_boss', { bossId: params.boss.id, isExpedition: false });
    try {
      localStorage.removeItem(ACTIVE_BATTLE_STORAGE_KEY);
    } catch {
      // Ignore
    }
    setActiveOnlineMatch(null);
    setActiveProblem(null);
    setIsExpeditionBattle(false);
    setIsDraftBattle(false);
    setActiveRiftId(null);
    setExpeditionBlessingId(null);
    setActiveGeoModifiers(null);
    setActiveConquestContext({
      provinceId: params.provinceId,
      isDefensive: params.isDefensive,
      attackerFactionId: params.attackerFactionId,
      modifiers: applyEquippedRelicToModifiers(params.modifiers) ?? params.modifiers,
    });
    setActiveCampaignBoss(params.boss);
    setCampaignPlayerDeckIds(params.playerDeckCardIds);
    setActiveTab('arena');
  };

  const handleStartDraftBattle = (
    boss: CampaignBoss,
    draftedDeckIds: string[],
    modifiers: ConquestBattleModifiers | null
  ) => {
    trackAdsEvent('start_duel', { mode: 'draft_crucible', isGuest });
    try {
      localStorage.removeItem(ACTIVE_BATTLE_STORAGE_KEY);
    } catch {
      // Ignore
    }
    setActiveOnlineMatch(null);
    setActiveProblem(null);
    setIsExpeditionBattle(false);
    setIsDraftBattle(true);
    setActiveRiftId(null);
    setExpeditionBlessingId(null);
    setActiveConquestContext(null);
    setActiveGeoModifiers(applyEquippedRelicToModifiers(modifiers));
    setActiveCampaignBoss(boss);
    setCampaignPlayerDeckIds(draftedDeckIds);
    setActiveTab('arena');
  };

  const handleStartRiftBattle = (riftId: RiftMutatorId, playerDeckCardIds: string[]) => {
    trackAdsEvent('start_duel', { mode: 'fracture_rift', riftId, isGuest });
    try {
      localStorage.removeItem(ACTIVE_BATTLE_STORAGE_KEY);
    } catch {
      // Ignore
    }
    const { boss, modifiers } = buildRiftBattleEncounter(riftId);
    setActiveOnlineMatch(null);
    setActiveProblem(null);
    setIsExpeditionBattle(false);
    setIsDraftBattle(false);
    setActiveRiftId(riftId);
    setExpeditionBlessingId(null);
    setActiveConquestContext(null);
    setActiveGeoModifiers(applyEquippedRelicToModifiers(modifiers));
    setActiveCampaignBoss(boss);
    setCampaignPlayerDeckIds(playerDeckCardIds);
    setActiveTab('arena');
  };

  const handleCampaignVictory = (boss: CampaignBoss) => {
    if (activeRiftId) {
      const { awardedWeeklyBonus } = recordRiftVictory(activeRiftId);
      const riftDef = FRACTURE_RIFTS_BY_ID[activeRiftId];
      const goldEarned =
        STANDARD_RIFT_WIN_GOLD + (awardedWeeklyBonus ? WEEKLY_RIFT_GOLD_BONUS : 0);
      const shardsEarned = awardedWeeklyBonus ? WEEKLY_RIFT_SHARDS_BONUS : 0;

      if (!isGuest) {
        updateCurrentUserProgression((prev) => ({
          gold: (prev.gold ?? 0) + goldEarned,
          astralShards: (prev.astralShards ?? 0) + shardsEarned,
          arenaWins: (prev.arenaWins ?? 0) + 1,
        }));
        pushNotification({
          kicker: 'FENDA DA FRATURA EXPURGADA',
          title: `${riftDef ? `${riftDef.icon} ${riftDef.name}` : boss.name} Subjugada!`,
          message: awardedWeeklyBonus
            ? `Bônus Semanal conquistado: +${goldEarned} Ouro e +${shardsEarned} 💎 Estilhaços Astrais!`
            : `Vitória em Fenda: +${goldEarned} Ouro creditados ao seu tesouro.`,
          actionLabel: shardsEarned > 0 ? 'Forjar Cartas' : 'Abrir Relicário',
          actionTarget: shardsEarned > 0 ? 'deckbuilder' : 'packs',
        });
      }
      return;
    }

    if (isDraftBattle) {
      setLastDraftOutcome({
        outcomeId: `dr_win_${boss.id}_${Date.now()}`,
        didWin: true,
      });
      if (!isGuest) {
        updateCurrentUserProgression((prev) => ({
          gold: (prev.gold ?? 0) + VICTORY_GOLD_REWARD,
          arenaWins: (prev.arenaWins ?? 0) + 1,
        }));
      }
      return;
    }
    if (isGuest) return;
    const nextGold = gold + VICTORY_GOLD_REWARD;
    if (activeConquestContext) {
      setLastConquestOutcome({
        outcomeId: `cq_win_${boss.id}_${Date.now()}`,
        provinceId: activeConquestContext.provinceId,
        isDefensive: activeConquestContext.isDefensive,
        attackerFactionId: activeConquestContext.attackerFactionId,
        didWin: true,
      });
      updateCurrentUserProgression((prev) => ({
        gold: (prev.gold ?? 0) + VICTORY_GOLD_REWARD,
        arenaWins: (prev.arenaWins ?? 0) + 1,
      }));
    } else if (isExpeditionBattle) {
      setLastClearedExpeditionBossId(boss.id);
      updateCurrentUserProgression((prev) => ({
        gold: (prev.gold ?? 0) + VICTORY_GOLD_REWARD,
        arenaWins: (prev.arenaWins ?? 0) + 1,
      }));
    } else {
      updateCurrentUserProgression((prev) => {
        const prevBosses = prev.defeatedBossIds ?? [];
        const nextBosses = prevBosses.includes(boss.id)
          ? prevBosses
          : [...prevBosses, boss.id];
        return {
          gold: (prev.gold ?? 0) + VICTORY_GOLD_REWARD,
          arenaWins: (prev.arenaWins ?? 0) + 1,
          defeatedBossIds: nextBosses,
        };
      });
    }
    pushNotification({
      kicker: 'TRIUNFO EM COMBATE',
      title: `Vitória sobre ${boss.name}! (+${VICTORY_GOLD_REWARD} Ouro)`,
      message:
        nextGold >= 30
          ? `Seu saldo chegou a ${nextGold} Ouro — você já pode abrir um pacote no Relicário (30 Ouro)!`
          : `Recompensa creditada. Saldo atual: ${nextGold} Ouro.`,
      actionLabel: nextGold >= 30 ? 'Abrir Relicário' : undefined,
      actionTarget: nextGold >= 30 ? 'packs' : undefined,
    });
  };

  const handleCampaignDefeat = (boss: CampaignBoss) => {
    if (isDraftBattle) {
      setLastDraftOutcome({
        outcomeId: `dr_loss_${boss.id}_${Date.now()}`,
        didWin: false,
      });
      return;
    }
    if (activeConquestContext) {
      setLastConquestOutcome({
        outcomeId: `cq_loss_${boss.id}_${Date.now()}`,
        provinceId: activeConquestContext.provinceId,
        isDefensive: activeConquestContext.isDefensive,
        attackerFactionId: activeConquestContext.attackerFactionId,
        didWin: false,
      });
    }
  };

  const handleClaimDraftRewards = (reward: DraftRewardSummary) => {
    if (isGuest) return;
    const nextExtra = { ...(currentUser.extraUnlockedCards ?? {}) };
    for (const cid of reward.bonusCardIds) {
      nextExtra[cid] = (nextExtra[cid] ?? 0) + 1;
    }
    const nextGold = gold + reward.gold;
    updateCurrentUserProgression({
      gold: nextGold,
      extraUnlockedCards: nextExtra,
    });
    const rewardCardNames = reward.bonusCardIds
      .map((cid) => CARDS_BY_ID[cid]?.name)
      .filter(Boolean)
      .join(', ');
    pushNotification({
      kicker: 'CRISOL DOS CINCO SELOS',
      title: `${reward.tierTitle} (+${reward.gold} Ouro)`,
      message: rewardCardNames
        ? `Cartas conquistadas no baú: ${rewardCardNames}.`
        : `Recompensa creditada ao seu tesouro. Saldo atual: ${nextGold} Ouro.`,
      actionLabel: 'Ver no Grimório',
      actionTarget: 'deckbuilder',
    });
  };

  const handleRewardGold = (amount: number, reason?: string) => {
    if (isGuest) return;
    const nextGold = gold + amount;
    updateCurrentUserProgression((prev) => ({
      gold: (prev.gold ?? 0) + amount,
      arenaWins: (prev.arenaWins ?? 0) + 1,
    }));
    pushNotification({
      kicker: 'ESPÓLIOS DE BATALHA',
      title: reason ? `${reason} (+${amount} Ouro)` : `+${amount} Ouro Conquistado`,
      message:
        nextGold >= 30
          ? `Saldo: ${nextGold} Ouro — suficiente para romper um Selo no Relicário (30 Ouro)!`
          : `Saldo atualizado: ${nextGold} Ouro.`,
      actionLabel: nextGold >= 30 ? 'Abrir Relicário' : undefined,
      actionTarget: nextGold >= 30 ? 'packs' : undefined,
    });
  };

  const handleRewardShards = (amount: number, reason?: string) => {
    if (isGuest || amount <= 0) return;
    const nextShards = astralShards + amount;
    updateCurrentUserProgression((prev) => ({
      astralShards: (prev.astralShards ?? 0) + amount,
    }));
    pushNotification({
      kicker: 'ESTILHAÇOS ASTRAIS DESCOBERTOS',
      title: reason ? `${reason} (+${amount} 💎)` : `+${amount} 💎 Estilhaços Astrais`,
      message: `Saldo Astral: ${nextShards} 💎 para Forjar Cartas diretamente no Grimório.`,
      actionLabel: 'Abrir Forja no Grimório',
      actionTarget: 'deckbuilder',
    });
  };

  const handleClaimQuestGold = (amount: number, questTitle: string) => {
    if (isGuest) return;
    const nextGold = gold + amount;
    updateCurrentUserProgression((prev) => ({
      gold: (prev.gold ?? 0) + amount,
    }));
    pushNotification({
      kicker: 'DECRETO REAL CONCLUÍDO',
      title: `${questTitle} (+${amount} Ouro)`,
      message: `Recompensa diária creditada! Saldo atual: ${nextGold} Ouro.`,
      actionLabel: nextGold >= 30 ? 'Abrir Relicário' : undefined,
      actionTarget: nextGold >= 30 ? 'packs' : undefined,
    });
  };

  const handleOpenPack = (packCost: number, drawnCards: CardDefinition[]) => {
    if (isGuest) return [];
    trackAdsEvent('open_pack', { packCost, cardsCount: drawnCards.length });
    recordDailyQuestEvent('pack_or_deck_action', 1);

    const { nextExtraUnlocked, shardsEarned, cardOutcomes } = resolvePackDuplicatesWithShards(
      unlockedCardIds,
      currentUser.extraUnlockedCards ?? {},
      drawnCards
    );

    updateCurrentUserProgression((prev) => ({
      gold: Math.max(0, (prev.gold ?? 0) - packCost),
      extraUnlockedCards: nextExtraUnlocked,
      astralShards: (prev.astralShards ?? 0) + shardsEarned,
    }));

    const newOrAddedCount = cardOutcomes.filter((o) => o.status !== 'duplicate_shards').length;
    pushNotification(
      {
        kicker: 'RELICÁRIO ASTRAL',
        title:
          shardsEarned > 0
            ? `+${newOrAddedCount} Cartas & +${shardsEarned} 💎 Estilhaços`
            : `+${drawnCards.length} Novas Cartas na Coleção`,
        message:
          shardsEarned > 0
            ? `Excedentes transmutados automaticamente em +${shardsEarned} 💎 Estilhaços Astrais para Forja!`
            : `Cartas integradas ao seu acervo: ${drawnCards.map((c) => c.name).join(', ')}.`,
        actionLabel: 'Ver no Grimório',
        actionTarget: 'deckbuilder',
      },
      false
    );

    return cardOutcomes;
  };

  const handleSalvageExcessDuplicates = () => {
    if (isGuest || salvageableInfo.totalShardsEarned <= 0) return;
    const earned = salvageableInfo.totalShardsEarned;
    const count = salvageableInfo.cardsSalvagedCount;
    const cleaned = salvageableInfo.cleanedExtraUnlocked;

    updateCurrentUserProgression((prev) => ({
      extraUnlockedCards: cleaned,
      astralShards: (prev.astralShards ?? 0) + earned,
    }));

    pushNotification({
      kicker: 'FORJA DE ESTILHAÇOS ASTRAIS',
      title: `💎 +${earned} Estilhaços Astrais Transmutados!`,
      message: `${count} cópia(s) excedente(s) acima do limite útil foram convertidas sem afetar seus Grimórios.`,
      actionLabel: 'Forjar Cartas',
      actionTarget: 'deckbuilder',
    });
  };

  const handleCraftCard = (card: CardDefinition) => {
    if (isGuest) return;
    const owned = unlockedCardIds[card.id] ?? 0;
    const res = craftSingleCardCopy(
      card,
      owned,
      currentUser.extraUnlockedCards ?? {},
      astralShards
    );
    if (!res.ok) return;

    recordDailyQuestEvent('pack_or_deck_action', 1);
    updateCurrentUserProgression((prev) => ({
      extraUnlockedCards: res.nextExtraUnlocked,
      astralShards: res.nextAstralShards,
    }));

    pushNotification({
      kicker: 'FORJA ASTRAL CONCLUÍDA',
      title: `⚒️ [${card.name}] Forjada! (-${res.costPaid} 💎)`,
      message: `Nova cópia integrada ao seu acervo! Saldo restante: ${res.nextAstralShards} 💎 Estilhaços.`,
    });
  };

  const handleMatchConcluded = useCallback(
    ({ didWin, usedDeckId }: { didWin: boolean; usedDeckId: string | null }) => {
      if (isGuest || isDraftBattle) return;
      updateCurrentUserProgression((prev) => {
        const decks = prev.customDecks ?? [];
        if (decks.length === 0) return {};
        const targetId =
          usedDeckId && decks.some((d) => d.id === usedDeckId) ? usedDeckId : decks[0].id;
        return {
          customDecks: decks.map((d) =>
            d.id === targetId
              ? {
                  ...d,
                  wins: (d.wins ?? 0) + (didWin ? 1 : 0),
                  losses: (d.losses ?? 0) + (didWin ? 0 : 1),
                }
              : d
          ),
        };
      });
    },
    [isGuest, isDraftBattle]
  );

  const handleSaveCustomDeck = (
    deck: CustomSavedDeck,
    options?: { replaceBaseGrimoire?: boolean }
  ) => {
    if (isGuest) return;
    trackAdsEvent('save_deck', { deckName: deck.name, cardsCount: deck.cardIds.length });
    recordDailyQuestEvent('pack_or_deck_action', 1);
    const isFirst = customDecks.length === 0;
    const isReplacingBase = Boolean(options?.replaceBaseGrimoire && !isFirst);
    if (isReplacingBase && gold < GRIMOIRE_REPLACEMENT_GOLD_COST) {
      return;
    }
    const exists = customDecks.some((d) => d.id === deck.id);
    const nextDecks = isReplacingBase
      ? [deck]
      : exists
      ? customDecks.map((d) =>
          d.id === deck.id
            ? { ...deck, wins: d.wins ?? deck.wins, losses: d.losses ?? deck.losses }
            : d
        )
      : [...customDecks, deck];
    const hasStarterCollection =
      currentUser.starterDeckCardIds && currentUser.starterDeckCardIds.length > 0;
    const nextGold = isReplacingBase ? Math.max(0, gold - GRIMOIRE_REPLACEMENT_GOLD_COST) : gold;
    updateCurrentUserProgression({
      gold: nextGold,
      customDecks: nextDecks,
      starterDeckCardIds:
        isReplacingBase || !hasStarterCollection ? deck.cardIds : currentUser.starterDeckCardIds,
      preferredDeckId: deck.id,
    });
    pushNotification({
      kicker: 'GRIMÓRIO CONSAGRADO',
      title: isReplacingBase
        ? `Grimório Substituído (-${GRIMOIRE_REPLACEMENT_GOLD_COST} Ouro): "${deck.name}"`
        : isFirst
        ? `1º Grimório Salvo: "${deck.name}" (100 Cartas)`
        : `Grimório Atualizado: "${deck.name}"`,
      message: isReplacingBase
        ? `Seu novo Grimório Base de 100 cartas foi consagrado (Saldo: ${nextGold} Ouro) e todas as suas cartas do Relicário continuam na sua coleção!`
        : isFirst
        ? 'As 100 cartas do seu deck inicial foram adicionadas à sua coleção e todos os modos de combate estão liberados!'
        : 'Sua lista de 100 cartas foi salva para combate (suas demais cartas da coleção permanecem disponíveis para troca livre).',
      actionLabel: 'Entrar na Arena',
      actionTarget: 'arena',
    });
  };

  const handleDeleteCustomDeck = (deckId: string) => {
    if (isGuest || customDecks.length <= 1) return;
    const nextDecks = customDecks.filter((d) => d.id !== deckId);
    updateCurrentUserProgression({
      customDecks: nextDecks,
      preferredDeckId: nextDecks[0]?.id ?? '',
    });
  };

  const uniqueUnlockedCount = useMemo(
    () => Object.values(unlockedCardIds).filter((v) => v > 0).length,
    [unlockedCardIds]
  );

  // Sovereign Achievements Tracker
  const achievements = useMemo(
    () => [
      {
        id: 'ach_first_blood',
        icon: 'I',
        title: 'Sangue na Arena',
        desc: 'Conquiste sua primeira vitória em duelos na Arena ou na Campanha.',
        progress: `${arenaWins + defeatedBossIds.length} vitórias`,
        unlocked: arenaWins + defeatedBossIds.length >= 1,
      },
      {
        id: 'ach_act_v',
        icon: 'II',
        title: 'Regicida dos Cinco Atos',
        desc: 'Subjugue os Soberanos da Campanha até os Tronos Tripartidos.',
        progress: `${defeatedBossIds.length}/20 Soberanos`,
        unlocked: defeatedBossIds.length >= 20,
      },
      {
        id: 'ach_collector',
        icon: 'III',
        title: 'Guardião do Códice',
        desc: 'Reúna todas as criaturas, relíquias e feitiços dos Cinco Domínios.',
        progress: `${uniqueUnlockedCount}/${ALL_CARDS.length} Ecos`,
        unlocked: uniqueUnlockedCount >= ALL_CARDS.length,
      },
      {
        id: 'ach_decksmith',
        icon: 'IV',
        title: 'Arquiteto do Pacto',
        desc: 'Forje e consagre um grimório autoral de 100 cartas para os campos de batalha.',
        progress: `${customDecks.length} criados`,
        unlocked: customDecks.length >= 1,
      },
    ],
    [arenaWins, defeatedBossIds.length, uniqueUnlockedCount, customDecks.length]
  );

  const navTabsRef = useRef<HTMLElement | null>(null);
  const navHoverCloseTimerRef = useRef<number | null>(null);
  const [openNavPillar, setOpenNavPillar] = useState<Exclude<NavPillarId, 'home'> | null>(null);
  const [popoverCoords, setPopoverCoords] = useState<{ top: number; left: number }>({
    top: 56,
    left: 24,
  });
  const [lastSubTabByPillar, setLastSubTabByPillar] = useState<
    Partial<Record<NavPillarId, ActiveTab>>
  >(() => {
    try {
      const raw = localStorage.getItem(LAST_PILLAR_TAB_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Partial<Record<NavPillarId, ActiveTab>>) : {};
    } catch {
      return {};
    }
  });

  const effectiveNavTab: ActiveTab = useMemo(() => {
    if (activeTab === 'arena') {
      if (activeOnlineMatch) return 'multiplayer';
      if (activeProblem) return 'problems';
      if (activeCampaignBoss && activeRiftId) return 'rifts';
      if (activeCampaignBoss && isDraftBattle) return 'draft';
      if (activeCampaignBoss && activeConquestContext) return 'conquest';
      if (activeCampaignBoss && isExpeditionBattle) return 'expedition';
      if (activeCampaignBoss) return 'campaign';
      return 'arena';
    }
    return activeTab;
  }, [
    activeTab,
    activeOnlineMatch,
    activeProblem,
    activeCampaignBoss,
    activeRiftId,
    isDraftBattle,
    activeConquestContext,
    isExpeditionBattle,
  ]);

  const activePillarId = useMemo(
    () => resolvePillarForTab(effectiveNavTab),
    [effectiveNavTab]
  );

  const activePillarDef = useMemo(
    () => (activePillarId ? NAV_PILLARS.find((p) => p.id === activePillarId) ?? null : null),
    [activePillarId]
  );

  const openPillarDef = useMemo(
    () => (openNavPillar ? NAV_PILLARS.find((p) => p.id === openNavPillar) ?? null : null),
    [openNavPillar]
  );

  useEffect(() => {
    const pid = resolvePillarForTab(effectiveNavTab);
    if (!pid || pid === 'home') return;
    setLastSubTabByPillar((prev) => {
      if (prev[pid] === effectiveNavTab) return prev;
      const next = { ...prev, [pid]: effectiveNavTab };
      try {
        localStorage.setItem(LAST_PILLAR_TAB_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage quota errors
      }
      return next;
    });
  }, [effectiveNavTab]);

  const clearNavHoverCloseTimer = useCallback(() => {
    if (navHoverCloseTimerRef.current !== null) {
      window.clearTimeout(navHoverCloseTimerRef.current);
      navHoverCloseTimerRef.current = null;
    }
  }, []);

  const scheduleNavHoverClose = useCallback(() => {
    clearNavHoverCloseTimer();
    navHoverCloseTimerRef.current = window.setTimeout(() => {
      if (window.innerWidth > 768) {
        setOpenNavPillar(null);
      }
    }, 160);
  }, [clearNavHoverCloseTimer]);

  useEffect(() => {
    if (!openNavPillar) return;
    const handleKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        setOpenNavPillar(null);
      }
    };
    const handleResize = () => setOpenNavPillar(null);
    const handleDocClick = (ev: MouseEvent) => {
      const target = ev.target as HTMLElement | null;
      if (
        target?.closest('.nav-tab-btn') ||
        target?.closest('.nav-group-popover') ||
        target?.closest('.nav-mobile-sheet')
      ) {
        return;
      }
      setOpenNavPillar(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleDocClick);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleDocClick);
    };
  }, [openNavPillar]);

  const handleSelectSubTab = (targetTab: ActiveTab) => {
    clearNavHoverCloseTimer();
    setOpenNavPillar(null);
    setIsNotifOpen(false);
    setIsArenaNavExpanded(false);

    if (targetTab === 'home') {
      setActiveCampaignBoss(null);
      setActiveOnlineMatch(null);
      setActiveTab('home');
      return;
    }
    if (targetTab === 'arena') {
      handleOpenArenaSolo();
      return;
    }
    if (targetTab === 'problems') {
      setActiveProblem(null);
      setActiveTab('problems');
      return;
    }
    setActiveTab(targetTab);
  };

  const openPopoverAtButton = (
    pillarId: Exclude<NavPillarId, 'home'>,
    btnEl: HTMLElement
  ) => {
    const rect = btnEl.getBoundingClientRect();
    const popoverWidth = 304;
    const clampedLeft = Math.max(
      12,
      Math.min(window.innerWidth - popoverWidth - 12, rect.left + rect.width / 2 - popoverWidth / 2)
    );
    setPopoverCoords({
      top: Math.round(rect.bottom + 6),
      left: Math.round(clampedLeft),
    });
    setOpenNavPillar(pillarId);
  };

  return (
    <div className="app-shell">
      {/* Top Navigation Bar */}
      <header
        className={`top-navbar ${activeTab === 'arena' ? 'is-arena-active' : ''} ${
          isArenaNavExpanded ? 'is-arena-nav-expanded' : ''
        }`}
      >
        <div
          className="brand-logo"
          onClick={() => handleSelectSubTab('home')}
        >
          <div className="brand-emblem">❖</div>
          <div>
            <div className="brand-title gold-gradient-text">CHROMATIC PACT</div>
            <div className="brand-subtitle">DARK FANTASY TACTICAL CARD GAME</div>
          </div>
        </div>

        <nav
          ref={navTabsRef}
          className={`nav-tabs is-grouped-pillars ${activeTab === 'arena' ? 'is-arena-tabs' : ''} ${
            isArenaNavExpanded ? 'is-expanded-mobile' : ''
          }`}
        >
          {NAV_PILLARS.map((pillar) => {
            const isActivePillar = activePillarId === pillar.id;
            const isOpenPillar = openNavPillar === pillar.id;
            const hasSubItems = pillar.items.length > 0;
            const activeSubDef = pillar.items.find((it) => it.tab === effectiveNavTab);

            return (
              <button
                key={pillar.id}
                type="button"
                className={`nav-tab-btn ${isActivePillar ? 'active' : ''} ${
                  isOpenPillar ? 'is-open-pillar' : ''
                }`}
                aria-expanded={hasSubItems ? isOpenPillar : undefined}
                aria-haspopup={hasSubItems ? 'menu' : undefined}
                onMouseEnter={(e) => {
                  if (!hasSubItems || window.innerWidth <= 768) return;
                  clearNavHoverCloseTimer();
                  openPopoverAtButton(
                    pillar.id as Exclude<NavPillarId, 'home'>,
                    e.currentTarget
                  );
                }}
                onMouseLeave={() => {
                  if (!hasSubItems || window.innerWidth <= 768) return;
                  scheduleNavHoverClose();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!hasSubItems) {
                    handleSelectSubTab('home');
                    return;
                  }
                  const pid = pillar.id as Exclude<NavPillarId, 'home'>;
                  if (window.innerWidth <= 768) {
                    setIsNotifOpen(false);
                    setOpenNavPillar((prev) => (prev === pid ? null : pid));
                    return;
                  }
                  if (!isActivePillar) {
                    const preferredTab = lastSubTabByPillar[pid] ?? pillar.defaultTab;
                    handleSelectSubTab(preferredTab);
                  } else {
                    if (isOpenPillar) {
                      setOpenNavPillar(null);
                    } else {
                      openPopoverAtButton(pid, e.currentTarget);
                    }
                  }
                }}
              >
                <span className="nav-tab-icon">
                  {activeSubDef ? activeSubDef.icon : pillar.icon}
                </span>
                <span className="nav-pillar-label">{pillar.label}</span>
                {hasSubItems && (
                  <span className={`nav-pillar-caret ${isOpenPillar ? 'is-open' : ''}`}>▾</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Desktop Hover/Click Group Popover (Positioned outside overflow clipping) */}
        {openPillarDef && openPillarDef.items.length > 0 && (
          <div
            className="nav-group-popover"
            role="menu"
            style={{
              top: `${popoverCoords.top}px`,
              left: `${popoverCoords.left}px`,
            }}
            onMouseEnter={clearNavHoverCloseTimer}
            onMouseLeave={scheduleNavHoverClose}
          >
            <div className="nav-popover-header">
              <span>
                {openPillarDef.icon} {openPillarDef.label.toUpperCase()}
              </span>
            </div>
            <div className="nav-popover-list">
              {openPillarDef.items.map((sub) => {
                const isSubActive = effectiveNavTab === sub.tab;
                return (
                  <button
                    key={sub.tab}
                    type="button"
                    role="menuitem"
                    className={`nav-popover-item ${isSubActive ? 'is-active' : ''}`}
                    onClick={() => handleSelectSubTab(sub.tab)}
                  >
                    <span className="nav-popover-item-icon">{sub.icon}</span>
                    <span className="nav-popover-item-copy">
                      <span className="nav-popover-item-title-row">
                        <strong className="font-cinzel">{sub.label}</strong>
                        {isSubActive && <em className="nav-popover-active-pill">ATIVO</em>}
                      </span>
                      <small>{sub.shortDesc}</small>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="nav-right-controls">
          {isAdmin && (
            <button
              type="button"
              className={`btn-fantasy nav-admin-btn ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => {
                setOpenNavPillar(null);
                handleOpenAdminTab();
              }}
              title="Painel de Administração"
            >
              <span>👑</span>
            </button>
          )}
          {activeTab === 'arena' && (
            <button
              type="button"
              className="btn-fantasy nav-arena-exit-btn show-on-mobile-inline"
              style={{
                padding: '0 0.5rem',
                height: '30px',
                fontSize: '0.64rem',
                fontWeight: 800,
                borderColor: 'rgba(248, 113, 113, 0.7)',
                color: '#fecaca',
              }}
              onClick={() => {
                setIsNotifOpen(false);
                setIsArenaNavExpanded(false);
                if (activeOnlineMatch) {
                  setActiveOnlineMatch(null);
                  setActiveTab('multiplayer');
                } else if (activeProblem) {
                  setActiveProblem(null);
                  setActiveTab('problems');
                } else if (activeCampaignBoss) {
                  const wasRift = Boolean(activeRiftId);
                  const wasDraft = isDraftBattle;
                  const wasConquest = Boolean(activeConquestContext);
                  const wasExp = isExpeditionBattle;
                  setActiveCampaignBoss(null);
                  setActiveRiftId(null);
                  setIsDraftBattle(false);
                  setIsExpeditionBattle(false);
                  setActiveConquestContext(null);
                  setActiveTab(
                    wasRift
                      ? 'rifts'
                      : wasDraft
                      ? 'draft'
                      : wasConquest
                      ? 'conquest'
                      : wasExp
                      ? 'expedition'
                      : 'campaign'
                  );
                } else {
                  setActiveTab('home');
                }
              }}
              title="Sair da Arena e voltar ao menu anterior"
            >
              ← Sair
            </button>
          )}

          <div
            className="gold-pill nav-account-pill"
            onClick={() =>
              setAccountModalState({
                open: true,
                tab: isUnregisteredProfile(currentUser) ? 'create' : 'profile',
              })
            }
            title="Clique para abrir seu Perfil do Soberano, Entrar ou Criar Conta"
          >
            <span className={`nav-account-dot ${isGuest ? 'is-guest' : ''}`} />
            {isUnregisteredProfile(currentUser) ? (
              <span className="nav-account-label" style={{ fontWeight: 800 }}>
                ENTRAR<span className="hide-on-mobile"> / CRIAR CONTA</span>
              </span>
            ) : (
              <>
                <span className="nav-account-label" style={{ fontWeight: 800 }}>
                  {isAdmin ? '👑 ' : ''}
                  {currentUser.username}
                </span>
                <span
                  className="hide-on-mobile nav-account-elo"
                  style={{ opacity: 0.78, fontSize: '0.68rem' }}
                >
                  ({currentUser.eloRating})
                </span>
                <span className="nav-account-badge hide-on-mobile">
                  {isAdmin ? 'ADMIN' : 'PERFIL'}
                </span>
              </>
            )}
          </div>

          <div
            className="gold-pill nav-gold-pill"
            onClick={() => setActiveTab('packs')}
            style={{ cursor: 'pointer' }}
            title={`Saldo: ${gold.toLocaleString('pt-BR')} Ouro (+10 Ouro por vitória) — Clique para abrir o Relicário`}
          >
            <span className="gold-gem-dot" />
            <span className="nav-gold-amount">
              {gold >= 1000000
                ? `${(gold / 1000000).toFixed(1).replace('.0', '')}M`
                : gold >= 100000
                ? `${Math.floor(gold / 1000)}k`
                : gold.toLocaleString('pt-BR')}
              <span className="hide-on-mobile nav-gold-word"> OURO</span>
            </span>
          </div>

          {!isGuest && (
            <div
              className="gold-pill astral-shards-pill hide-on-mobile"
              onClick={() => setActiveTab('deckbuilder')}
              style={{ cursor: 'pointer' }}
              title={`Estilhaços Astrais: ${astralShards.toLocaleString('pt-BR')} 💎 — Clique para Forjar Cartas no Grimório`}
            >
              <span>💎</span>
              <span className="nav-gold-amount">{astralShards.toLocaleString('pt-BR')}</span>
            </div>
          )}

          {/* Sovereign Notification Center (Bell + Unread Counter + Popover) */}
          <div className="nav-notif-wrapper">
            <button
              type="button"
              className={`nav-notif-btn ${isNotifOpen ? 'is-open' : ''} ${
                unreadNotifCount > 0 ? 'has-unread' : ''
              }`}
              onClick={() => {
                setIsArenaNavExpanded(false);
                setIsNotifOpen((prev) => {
                  const nextOpen = !prev;
                  if (nextOpen) markAllNotificationsRead();
                  return nextOpen;
                });
              }}
              title="Central de Notificações do Soberano"
            >
              <span>🔔</span>
              <span className="hide-on-mobile nav-notif-label">AVISOS</span>
              {unreadNotifCount > 0 && (
                <span className="nav-notif-badge">
                  {unreadNotifCount > 99 ? '99+' : unreadNotifCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="nav-notif-popover" onClick={(e) => e.stopPropagation()}>
                <div className="nav-notif-header">
                  <span className="nav-notif-title">
                    Central de Notificações ({notifications.length})
                  </span>
                  <div className="nav-notif-header-actions">
                    {notifications.length > 0 && (
                      <button
                        type="button"
                        className="nav-notif-mini-btn"
                        onClick={clearAllNotifications}
                      >
                        Limpar
                      </button>
                    )}
                    <button
                      type="button"
                      className="nav-notif-mini-btn"
                      onClick={() => setIsNotifOpen(false)}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="nav-notif-list">
                  {notifications.length === 0 ? (
                    <div className="nav-notif-empty">
                      Nenhuma notificação no momento. Seus alertas de vitórias, Ouro, Reputação e
                      salas 1×1 aparecerão aqui.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`nav-notif-item ${!n.read ? 'is-unread' : ''}`}
                      >
                        <div className="nav-notif-item-top">
                          <span className="nav-notif-item-kicker">{n.kicker}</span>
                          <span className="nav-notif-item-time">
                            {new Date(n.createdAt).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <div className="nav-notif-item-title">{n.title}</div>
                        <div className="nav-notif-item-desc">{n.message}</div>
                        {n.actionLabel && n.actionTarget && (
                          <div className="nav-notif-item-footer">
                            <button
                              type="button"
                              className="nav-notif-mini-btn"
                              onClick={() => handleNotificationAction(n)}
                            >
                              {n.actionLabel} →
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            className={`btn-fantasy nav-audio-btn ${
              !soundMuted && musicInfo.stage === 'climax' ? 'btn-fantasy-danger' : ''
            }`}
            onClick={handleToggleSound}
            title={
              soundMuted
                ? 'Clique para ativar Trilha Adaptativa & Efeitos Sonoros'
                : `Trilha Adaptativa Ativa: ${musicInfo.label}`
            }
          >
            <span className="show-on-mobile-inline nav-audio-icon">{soundMuted ? '🔇' : '🔊'}</span>
            <span className="hide-on-mobile nav-audio-label">
              {soundMuted
                ? 'ÁUDIO OFF'
                : `${musicInfo.stage === 'climax' ? 'CLÍMAX' : 'ÁUDIO ON'}`}
            </span>
          </button>
        </div>
      </header>

      {/* Mobile Native Bottom-Sheet Menu for Grouped Pillars (<= 768px) */}
      {openPillarDef && openPillarDef.items.length > 0 && (
        <>
          <div
            className="nav-mobile-sheet-backdrop"
            onClick={() => setOpenNavPillar(null)}
          />
          <div className="nav-mobile-sheet" role="dialog" aria-label={openPillarDef.label}>
            <div className="nav-mobile-sheet-header">
              <span className="font-cinzel">
                {openPillarDef.icon} {openPillarDef.label}
              </span>
              <button
                type="button"
                className="nav-notif-mini-btn"
                onClick={() => setOpenNavPillar(null)}
              >
                ✕
              </button>
            </div>
            <div className="nav-mobile-sheet-list">
              {openPillarDef.items.map((sub) => {
                const isSubActive = effectiveNavTab === sub.tab;
                return (
                  <button
                    key={sub.tab}
                    type="button"
                    className={`nav-mobile-sheet-item ${isSubActive ? 'is-active' : ''}`}
                    onClick={() => handleSelectSubTab(sub.tab)}
                  >
                    <span className="nav-popover-item-icon">{sub.icon}</span>
                    <span className="nav-popover-item-copy">
                      <span className="nav-popover-item-title-row">
                        <strong className="font-cinzel">{sub.label}</strong>
                        {isSubActive && <em className="nav-popover-active-pill">ATIVO</em>}
                      </span>
                      <small>{sub.shortDesc}</small>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Main Content View */}
      <main style={{ flex: 1 }}>
        {/* Contextual 1-Click Sibling Sub-Navigation Bar (Hidden inside fullscreen BattleArena to preserve 100% board height) */}
        {activeTab !== 'arena' &&
          activePillarDef &&
          activePillarDef.items.length > 0 && (
            <div className="section-subnav-shell">
              <div className="section-subnav-bar" role="navigation" aria-label={activePillarDef.label}>
                <span className="section-subnav-kicker">
                  <span>{activePillarDef.icon}</span>
                  <span>{activePillarDef.label.toUpperCase()}</span>
                </span>
                <div className="section-subnav-pills">
                  {activePillarDef.items.map((sub) => {
                    const isSubActive = effectiveNavTab === sub.tab;
                    return (
                      <button
                        key={sub.tab}
                        type="button"
                        className={`section-subnav-pill ${isSubActive ? 'is-active' : ''}`}
                        onClick={() => handleSelectSubTab(sub.tab)}
                        title={sub.shortDesc}
                      >
                        <span>{sub.icon}</span>
                        <span>{sub.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        {activeTab === 'admin' && (
          <div className="section-subnav-shell">
            <div className="section-subnav-bar">
              <span className="section-subnav-kicker">
                <span>👑</span>
                <span>ADMINISTRAÇÃO</span>
              </span>
              <div className="section-subnav-pills">
                <button
                  type="button"
                  className="section-subnav-pill"
                  onClick={() => handleSelectSubTab('home')}
                >
                  ← Voltar ao Salão Real
                </button>
              </div>
            </div>
          </div>
        )}
        {!isGuest &&
          customDecks.length === 0 &&
          activeTab !== 'deckbuilder' &&
          activeTab !== 'draft' &&
          activeTab !== 'arena' &&
          !isOnboardingCalloutHidden && (
            <div className="aaa-onboarding-shell">
              <div className="aaa-status-callout is-onboarding">
                <div className="aaa-callout-copy">
                  <span className="aaa-callout-kicker">
                    PASSO INICIAL OBRIGATÓRIO • CONTA: {currentUser.username.toUpperCase()}
                  </span>
                  <div className="aaa-callout-text">
                    Para entrar em combate, monte e confirme primeiro o seu{' '}
                    <strong>Grimório de Combate (100 cartas)</strong> escolhendo um dos 5 decks
                    iniciais, editando-o ou criando do zero.
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="aaa-btn aaa-btn-primary"
                    onClick={() => setActiveTab('deckbuilder')}
                  >
                    Forjar Meu Grimório (100 Cartas) →
                  </button>
                  <button
                    type="button"
                    className="aaa-btn aaa-btn-secondary"
                    onClick={() => setIsOnboardingCalloutHidden(true)}
                    title="Ocultar aviso"
                  >
                    ✕ Ocultar
                  </button>
                </div>
              </div>
            </div>
          )}

        {activeTab === 'home' && (
          <div className="aaa-page-shell aaa-home-lobby-shell">
            {/* Collapsible Royal Command Strip (1-Click Resume + Daily Quests + Crown Relics) */}
            <SovereignRoyalCommandStrip
              isGuest={isGuest}
              username={currentUser.username}
              gold={gold}
              astralShards={astralShards}
              defeatedBossCount={defeatedBossIds.length}
              arenaWins={arenaWins}
              onNavigate={(dest) => handleSelectSubTab(dest)}
              onStartDailyProblem={handleStartProblem}
              onClaimQuestGold={handleClaimQuestGold}
              onOpenAccountModal={() =>
                setAccountModalState({
                  open: true,
                  tab: isGuest ? 'create' : 'profile',
                })
              }
            />

            {/* Authentic BattleArena Combat Table Showcase */}
            <div className="aaa-home-showcase-hero">
              <HomeSimulatedDuelShowcase
                onInspectCard={setShowcaseInspectCard}
                onPlayDuelNow={handleOpenArenaSolo}
                onOpenCombosCompendium={() => setActiveTab('tactics')}
                soundMuted={soundMuted}
                onToggleSound={handleToggleSound}
              />
            </div>
          </div>
        )}

        <Suspense
          fallback={
            <div className="sovereign-lazy-loader">
              <span className="sll-glyph">☸</span>
              <span>Abrindo Salão Real...</span>
            </div>
          }
        >
        {activeTab === 'multiplayer' && (
          <MultiplayerView
            customDecks={customDecks}
            currentUser={currentUser}
            onUserChange={(updatedProfile) => {
              const ensured = ensureStarterDeckForUser(updatedProfile);
              setCurrentUser(ensured);
            }}
            onOpenAccountModal={(tab) => setAccountModalState({ open: true, tab })}
            onRequireDeckSetup={() => setActiveTab('deckbuilder')}
            onStartOnlineMatch={(room, role) => {
              setActiveCampaignBoss(null);
              setIsExpeditionBattle(false);
              setIsDraftBattle(false);
              setActiveRiftId(null);
              setActiveGeoModifiers(null);
              setActiveOnlineMatch({ room, role });
              setActiveTab('arena');
            }}
          />
        )}

        {activeTab === 'draft' && (
          <DraftCrucibleView
            userId={currentUser.id}
            gold={gold}
            isGuest={isGuest}
            defeatedBossCount={defeatedBossIds.length}
            arenaWins={arenaWins}
            lastDraftOutcome={lastDraftOutcome}
            onRequireAccount={() => setAccountModalState({ open: true, tab: 'create' })}
            onSpendEntryGold={(amount) => {
              if (isGuest) return;
              updateCurrentUserProgression((prev) => ({
                gold: Math.max(0, (prev.gold ?? 0) - amount),
              }));
            }}
            onStartDraftBattle={handleStartDraftBattle}
            onClaimDraftRewards={handleClaimDraftRewards}
          />
        )}

        {activeTab === 'rifts' && (
          <FractureRiftsView
            customDecks={customDecks}
            isGuest={isGuest}
            defeatedBossCount={defeatedBossIds.length}
            arenaWins={arenaWins}
            onRequireAccount={() => setAccountModalState({ open: true, tab: 'create' })}
            onRequireDeckSetup={() => setActiveTab('deckbuilder')}
            onStartRiftBattle={handleStartRiftBattle}
          />
        )}

        {activeTab === 'problems' && (
          <ProblemsView
            onSelectProblem={handleStartProblem}
            onInspectCard={setShowcaseInspectCard}
            onRewardGold={handleRewardGold}
          />
        )}

        {activeTab === 'arena' && (
          <BattleArena
            customDecks={customDecks}
            isGuest={isGuest}
            campaignBoss={activeCampaignBoss}
            campaignPlayerDeckIds={campaignPlayerDeckIds}
            expeditionBlessingId={isExpeditionBattle ? expeditionBlessingId : null}
            conquestModifiers={activeConquestContext?.modifiers ?? activeGeoModifiers}
            tacticalProblem={activeProblem}
            onSelectProblem={(nextProb) => setActiveProblem(nextProb)}
            onExitProblems={() => {
              setActiveProblem(null);
              setActiveTab('problems');
            }}
            initialPlayerDeckId={quickDuelDecks.playerDeckId}
            initialAiDeckId={quickDuelDecks.aiDeckId}
            onCampaignVictory={handleCampaignVictory}
            onCampaignDefeat={handleCampaignDefeat}
            onExitArena={() => {
              setActiveCampaignBoss(null);
              setActiveProblem(null);
              setActiveOnlineMatch(null);
              setIsExpeditionBattle(false);
              setIsDraftBattle(false);
              setActiveRiftId(null);
              setActiveConquestContext(null);
              setActiveGeoModifiers(null);
              setActiveTab('home');
            }}
            onExitCampaign={() => {
              const wasRift = Boolean(activeRiftId);
              const wasDraft = isDraftBattle;
              const wasConquest = Boolean(activeConquestContext);
              const wasExp = isExpeditionBattle;
              setActiveCampaignBoss(null);
              setActiveRiftId(null);
              setIsDraftBattle(false);
              setIsExpeditionBattle(false);
              setActiveConquestContext(null);
              setActiveGeoModifiers(null);
              setActiveTab(
                wasRift
                  ? 'rifts'
                  : wasDraft
                  ? 'draft'
                  : wasConquest
                  ? 'conquest'
                  : wasExp
                  ? 'expedition'
                  : 'campaign'
              );
            }}
            onRewardGold={handleRewardGold}
            onMatchConcluded={handleMatchConcluded}
            onlineMatch={
              activeOnlineMatch
                ? {
                    room: activeOnlineMatch.room,
                    role: activeOnlineMatch.role,
                    currentUser,
                    onExitPvp: () => {
                      setActiveOnlineMatch(null);
                      setActiveTab('multiplayer');
                    },
                    onPvpResult: (didWin) => {
                      const opponentRating =
                        activeOnlineMatch.role === 'host'
                          ? activeOnlineMatch.room.guest?.eloRating ?? 1200
                          : activeOnlineMatch.room.host.eloRating ?? 1200;
                      const prevRating = currentUser.eloRating;
                      const updated = recordPvpMatchResult(currentUser, didWin, opponentRating);
                      const delta = updated.eloRating - prevRating;
                      const sign = delta >= 0 ? `+${delta}` : `${delta}`;
                      setCurrentUser(updated);
                      pushNotification({
                        kicker: 'RANKING DE REPUTAÇÃO 1×1',
                        title: didWin
                          ? `Vitória no Conclave! (${sign} Reputação)`
                          : `Fim de Duelo 1×1 (${sign} Reputação)`,
                        message: `Sua Reputação agora é ${updated.eloRating} (${updated.pvpWins}V / ${updated.pvpLosses}D).`,
                        actionLabel: 'Ver Conclave 1×1',
                        actionTarget: 'multiplayer',
                      });
                    },
                  }
                : null
            }
          />
        )}

        {activeTab === 'campaign' && (
          <CampaignView
            defeatedBossIds={defeatedBossIds}
            arenaWins={arenaWins}
            customDecks={customDecks}
            isGuest={isGuest}
            onRequireAccount={() => setAccountModalState({ open: true, tab: 'create' })}
            onRequireDeckSetup={() => setActiveTab('deckbuilder')}
            onStartBossBattle={handleStartBossBattle}
            onRewardGold={handleRewardGold}
            onRewardShards={handleRewardShards}
            onOpenWeeklyRift={() => handleSelectSubTab('rifts')}
          />
        )}

        {activeTab === 'expedition' && (
          <ExpeditionView
            isGuest={isGuest}
            defeatedBossCount={defeatedBossIds.length}
            arenaWins={arenaWins}
            onRequireAccount={() => setAccountModalState({ open: true, tab: 'create' })}
            onStartExpeditionBattle={handleStartExpeditionBattle}
            onSaveCustomDeck={handleSaveCustomDeck}
            onRewardGold={handleRewardGold}
            onRewardShards={handleRewardShards}
            lastClearedExpeditionBossId={lastClearedExpeditionBossId}
          />
        )}

        {activeTab === 'conquest' && (
          <ConquestView
            customDecks={customDecks}
            isGuest={isGuest}
            defeatedBossCount={defeatedBossIds.length}
            arenaWins={arenaWins}
            onRequireAccount={() => setAccountModalState({ open: true, tab: 'create' })}
            onRequireDeckSetup={() => setActiveTab('deckbuilder')}
            onStartConquestBattle={handleStartConquestBattle}
            onRewardGold={handleRewardGold}
            onRewardShards={handleRewardShards}
            lastConquestOutcome={lastConquestOutcome}
          />
        )}

        {activeTab === 'tactics' && (
          <TacticalGuideView
            customDecks={customDecks}
            onLaunchDuel={(playerDeckId, opponentDeckId) => {
              if (!isGuest && customDecks.length === 0) {
                setActiveTab('deckbuilder');
                return;
              }
              setActiveCampaignBoss(null);
              setIsExpeditionBattle(false);
              setIsDraftBattle(false);
              setActiveRiftId(null);
              setQuickDuelDecks({ playerDeckId, aiDeckId: opponentDeckId });
              setActiveTab('arena');
            }}
          />
        )}

        {activeTab === 'deckbuilder' && (
          <DeckBuilder
            unlockedCardIds={unlockedCardIds}
            customDecks={customDecks}
            gold={gold}
            astralShards={astralShards}
            salvageableInfo={salvageableInfo}
            isGuest={isGuest}
            username={currentUser.username}
            onRequireAccount={() => setAccountModalState({ open: true, tab: 'create' })}
            onSaveCustomDeck={handleSaveCustomDeck}
            onDeleteCustomDeck={handleDeleteCustomDeck}
            onCraftCard={handleCraftCard}
            onSalvageDuplicates={handleSalvageExcessDuplicates}
          />
        )}

        {activeTab === 'packs' && (
          <PackOpener
            gold={gold}
            astralShards={astralShards}
            salvageableInfo={salvageableInfo}
            unlockedCardIds={unlockedCardIds}
            isGuest={isGuest}
            hasCustomDeck={!isGuest && customDecks.length > 0}
            onRequireAccount={() => setAccountModalState({ open: true, tab: 'create' })}
            onRequireDeckSetup={() => setActiveTab('deckbuilder')}
            onOpenPack={handleOpenPack}
            onSalvageDuplicates={handleSalvageExcessDuplicates}
          />
        )}

        {activeTab === 'mythology' && (
          <MythologyAtlasView
            onInspectCard={setShowcaseInspectCard}
            jumpTarget={poemJumpTarget}
            onConsumeJumpTarget={() => setPoemJumpTarget(null)}
          />
        )}

        {activeTab === 'rules' && (
          <TutorialCodexView
            isModal={false}
            onStartPracticeDuel={handleOpenArenaSolo}
            onInspectCard={setShowcaseInspectCard}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboardView
            currentUser={currentUser}
            onUpdateCurrentUser={(updatedProfile) => {
              const ensured = ensureStarterDeckForUser(updatedProfile);
              setCurrentUser(ensured);
            }}
            onOpenAccountModal={() =>
              setAccountModalState({
                open: true,
                tab: isUnregisteredProfile(currentUser) ? 'login' : 'profile',
              })
            }
            onNotify={(item) => pushNotification(item, true)}
          />
        )}

        {showcaseInspectCard && (
          <CardInspectModal
            card={CARDS_BY_ID[showcaseInspectCard.id] ?? showcaseInspectCard}
            onClose={() => setShowcaseInspectCard(null)}
          />
        )}

        {accountModalState.open && (
          <SovereignAccountModal
            currentUser={currentUser}
            customDecks={customDecks}
            onUserChange={(updatedProfile) => {
              const ensured = ensureStarterDeckForUser(updatedProfile);
              setCurrentUser(ensured);
            }}
            onAccountSuccess={(updatedProfile) => {
              const ensured = ensureStarterDeckForUser(updatedProfile);
              setCurrentUser(ensured);
              trackAdsEvent('register_account', { username: updatedProfile.username });
            }}
            initialTab={accountModalState.tab}
            onClose={() => setAccountModalState((prev) => ({ ...prev, open: false }))}
            onNeedsDeckSetup={() => setActiveTab('deckbuilder')}
            onOpenAdminPanel={handleOpenAdminTab}
          />
        )}
        </Suspense>

        {/* Live Floating Toast Notification */}
        {liveToastNotif && (
          <div className="nav-notif-toast">
            <div className="nav-notif-item-top">
              <span className="nav-notif-item-kicker">{liveToastNotif.kicker}</span>
              <button
                type="button"
                className="nav-notif-mini-btn"
                onClick={() => setLiveToastNotif(null)}
              >
                ✕
              </button>
            </div>
            <div className="nav-notif-item-title">{liveToastNotif.title}</div>
            <div className="nav-notif-item-desc">{liveToastNotif.message}</div>
            {liveToastNotif.actionLabel && liveToastNotif.actionTarget && (
              <div className="nav-notif-item-footer">
                <button
                  type="button"
                  className="nav-notif-mini-btn"
                  onClick={() => handleNotificationAction(liveToastNotif)}
                >
                  {liveToastNotif.actionLabel} →
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
