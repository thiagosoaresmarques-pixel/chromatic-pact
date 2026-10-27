import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { CampaignBoss, CardDefinition } from './types/game';
import { ALL_CARDS, CARDS_BY_ID } from './data/cards';
import { isMuted, toggleMute } from './utils/soundEngine';
import {
  getCurrentMusicState,
  MusicStateDescriptor,
  setMusicState,
  startAdaptiveMusic,
  subscribeMusicState,
} from './utils/musicEngine';
import { BattleArena, CustomSavedDeck } from './components/BattleArena';
import { DeckBuilder } from './components/DeckBuilder';
import { CampaignView } from './components/CampaignView';
import { PackOpener } from './components/PackOpener';
import { TacticalGuideView } from './components/TacticalGuideView';
import { ExpeditionView } from './components/ExpeditionView';
import { TutorialCodexView } from './components/TutorialCodexView';
import { MythologyAtlasView } from './components/MythologyAtlasView';
import {
  AccountModalTab,
  MultiplayerView,
  SovereignAccountModal,
} from './components/MultiplayerView';
import { WelcomeVisitorBanner } from './components/WelcomeVisitorBanner';
import { AdminDashboardView } from './components/AdminDashboardView';
import { CardView, CardInspectModal } from './components/CardView';
import {
  adminSaveCloudProfile,
  ensureStarterDeckForUser,
  fetchGlobalAdminAnnouncement,
  getActiveTabUserProfile,
  getSavedAccountsRoster,
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
  | 'multiplayer'
  | 'campaign'
  | 'expedition'
  | 'tactics'
  | 'deckbuilder'
  | 'packs'
  | 'mythology'
  | 'rules'
  | 'admin';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
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
  const customDecks: CustomSavedDeck[] = useMemo(
    () => (isGuest ? [] : currentUser.customDecks ?? []),
    [isGuest, currentUser.customDecks]
  );
  const defeatedBossIds: string[] = useMemo(
    () => (isGuest ? [] : currentUser.defeatedBossIds ?? []),
    [isGuest, currentUser.defeatedBossIds]
  );
  const arenaWins = isGuest ? 0 : currentUser.arenaWins ?? 0;

  const unlockedCardIds: Record<string, number> = useMemo(() => {
    if (isGuest) return {};
    const baseCardIds =
      currentUser.starterDeckCardIds && currentUser.starterDeckCardIds.length > 0
        ? currentUser.starterDeckCardIds
        : customDecks[0]?.cardIds ?? [];
    const merged: Record<string, number> = {};
    for (const cid of baseCardIds) {
      merged[cid] = (merged[cid] ?? 0) + 1;
    }
    // Always ensure the neutral domain cards (neutral_01..166) are available in the Sovereign's Grimoire collection
    for (const card of ALL_CARDS) {
      if (card.domain === 'neutral') {
        const copies = card.rarity === 'legendary' ? 1 : 2;
        merged[card.id] = Math.max(merged[card.id] ?? 0, copies);
      }
    }
    const extra = currentUser.extraUnlockedCards ?? {};
    for (const [cid, count] of Object.entries(extra)) {
      if (count > 0) {
        merged[cid] = (merged[cid] ?? 0) + count;
      }
    }
    return merged;
  }, [isGuest, currentUser.starterDeckCardIds, customDecks, currentUser.extraUnlockedCards]);

  // Active Campaign / Expedition Match State
  const [activeCampaignBoss, setActiveCampaignBoss] = useState<CampaignBoss | null>(null);
  const [campaignPlayerDeckIds, setCampaignPlayerDeckIds] = useState<string[] | null>(null);
  const [isExpeditionBattle, setIsExpeditionBattle] = useState<boolean>(false);
  const [lastClearedExpeditionBossId, setLastClearedExpeditionBossId] = useState<string | null>(
    null
  );
  const [quickDuelDecks, setQuickDuelDecks] = useState<{
    playerDeckId?: string;
    aiDeckId?: string;
  }>({});
  const [showcaseInspectCard, setShowcaseInspectCard] = useState<CardDefinition | null>(null);

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

  const updateCurrentUserProgression = (patch: Partial<SovereignUserProfile>) => {
    if (isUnregisteredProfile(currentUser)) return;
    const updated: SovereignUserProfile = {
      ...currentUser,
      ...patch,
    };
    setActiveTabUserProfile(updated);
    setCurrentUser(updated);
  };

  const handleOpenArenaSolo = () => {
    trackAdsEvent('start_duel', { mode: 'solo_arena', isGuest });
    setActiveCampaignBoss(null);
    setActiveOnlineMatch(null);
    setIsExpeditionBattle(false);
    if (!isGuest && customDecks.length === 0) {
      const ensured = ensureStarterDeckForUser(currentUser);
      setCurrentUser(ensured);
    }
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
      startAdaptiveMusic();
    };
    window.addEventListener('pointerdown', unlockAudio);
    window.addEventListener('keydown', unlockAudio);
    return () => {
      unsub();
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  // Update non-arena tabs' ambient music mood
  useEffect(() => {
    if (activeTab === 'arena') return; // BattleArena manages real-time combat intensity
    if (activeTab === 'campaign' || activeTab === 'expedition') {
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
    setActiveOnlineMatch(null);
    setIsExpeditionBattle(false);
    setActiveCampaignBoss(boss);
    setCampaignPlayerDeckIds(playerDeckIds);
    setActiveTab('arena');
  };

  const handleStartExpeditionBattle = (boss: CampaignBoss, playerDeckIds: string[]) => {
    trackAdsEvent('start_campaign_boss', { bossId: boss.id, isExpedition: true });
    setActiveOnlineMatch(null);
    setIsExpeditionBattle(true);
    setActiveCampaignBoss(boss);
    setCampaignPlayerDeckIds(playerDeckIds);
    setActiveTab('arena');
  };

  const handleCampaignVictory = (boss: CampaignBoss) => {
    if (isGuest) return;
    const nextGold = gold + VICTORY_GOLD_REWARD;
    if (isExpeditionBattle) {
      setLastClearedExpeditionBossId(boss.id);
      updateCurrentUserProgression({
        gold: nextGold,
        arenaWins: arenaWins + 1,
      });
    } else {
      const nextBosses = defeatedBossIds.includes(boss.id)
        ? defeatedBossIds
        : [...defeatedBossIds, boss.id];
      updateCurrentUserProgression({
        gold: nextGold,
        arenaWins: arenaWins + 1,
        defeatedBossIds: nextBosses,
      });
    }
    pushNotification({
      kicker: 'TRIUNFO EM COMBATE',
      title: `Vitória sobre ${boss.name}! (+${VICTORY_GOLD_REWARD} Ouro)`,
      message:
        nextGold >= 80
          ? `Seu saldo chegou a ${nextGold} Ouro — você já pode abrir um pacote no Relicário!`
          : `Recompensa creditada. Saldo atual: ${nextGold} Ouro.`,
      actionLabel: nextGold >= 80 ? 'Abrir Relicário' : undefined,
      actionTarget: nextGold >= 80 ? 'packs' : undefined,
    });
  };

  const handleRewardGold = (amount: number) => {
    if (isGuest) return;
    const nextGold = gold + amount;
    updateCurrentUserProgression({
      gold: nextGold,
      arenaWins: arenaWins + 1,
    });
    pushNotification({
      kicker: 'ESPÓLIOS DE BATALHA',
      title: `+${amount} Ouro Conquistado`,
      message:
        nextGold >= 80
          ? `Saldo: ${nextGold} Ouro — suficiente para romper um Selo no Relicário!`
          : `Saldo atualizado: ${nextGold} Ouro.`,
      actionLabel: nextGold >= 80 ? 'Abrir Relicário' : undefined,
      actionTarget: nextGold >= 80 ? 'packs' : undefined,
    });
  };

  const handleOpenPack = (packCost: number, drawnCards: CardDefinition[]) => {
    if (isGuest) return;
    trackAdsEvent('open_pack', { packCost, cardsCount: drawnCards.length });
    const nextExtra = { ...(currentUser.extraUnlockedCards ?? {}) };
    for (const c of drawnCards) {
      nextExtra[c.id] = (nextExtra[c.id] ?? 0) + 1;
    }
    updateCurrentUserProgression({
      gold: Math.max(0, gold - packCost),
      extraUnlockedCards: nextExtra,
    });
    pushNotification(
      {
        kicker: 'RELICÁRIO ASTRAL',
        title: `+${drawnCards.length} Novas Cartas na Coleção`,
        message: `Cartas integradas ao seu acervo: ${drawnCards.map((c) => c.name).join(', ')}.`,
        actionLabel: 'Ver no Grimório',
        actionTarget: 'deckbuilder',
      },
      false
    );
  };

  const handleSaveCustomDeck = (deck: CustomSavedDeck) => {
    if (isGuest) return;
    trackAdsEvent('save_deck', { deckName: deck.name, cardsCount: deck.cardIds.length });
    const isFirst = customDecks.length === 0;
    const exists = customDecks.some((d) => d.id === deck.id);
    const nextDecks = exists
      ? customDecks.map((d) => (d.id === deck.id ? deck : d))
      : [...customDecks, deck];
    const hasStarterCollection =
      currentUser.starterDeckCardIds && currentUser.starterDeckCardIds.length > 0;
    updateCurrentUserProgression({
      customDecks: nextDecks,
      starterDeckCardIds: hasStarterCollection ? currentUser.starterDeckCardIds : deck.cardIds,
      preferredDeckId: deck.id,
    });
    pushNotification({
      kicker: 'GRIMÓRIO CONSAGRADO',
      title: isFirst
        ? `1º Grimório Salvo: "${deck.name}" (100 Cartas)`
        : `Grimório Atualizado: "${deck.name}"`,
      message: isFirst
        ? 'As 100 cartas do seu deck inicial foram adicionadas à sua coleção e todos os modos de combate estão liberados!'
        : 'Sua lista de 100 cartas foi salva e definida como ativa para combate.',
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
          onClick={() => {
            setActiveCampaignBoss(null);
            setIsArenaNavExpanded(false);
            setActiveTab('home');
          }}
        >
          <div className="brand-emblem">❖</div>
          <div>
            <div className="brand-title gold-gradient-text">CHROMATIC PACT</div>
            <div className="brand-subtitle">DARK FANTASY TACTICAL CARD GAME</div>
          </div>
        </div>

        <nav
          className={`nav-tabs ${activeTab === 'arena' ? 'is-arena-tabs' : ''} ${
            isArenaNavExpanded ? 'is-expanded-mobile' : ''
          }`}
          onClick={() => setIsArenaNavExpanded(false)}
        >
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => {
              setActiveCampaignBoss(null);
              setActiveOnlineMatch(null);
              setActiveTab('home');
            }}
          >
            <span className="nav-tab-icon">🏠</span>
            <span>Início</span>
          </button>

          <button
            type="button"
            className={`nav-tab-btn ${
              activeTab === 'arena' && !activeCampaignBoss && !activeOnlineMatch ? 'active' : ''
            }`}
            onClick={handleOpenArenaSolo}
          >
            <span className="nav-tab-icon">⚔️</span>
            <span>Arena Solo</span>
          </button>

          <button
            type="button"
            className={`nav-tab-btn ${
              activeTab === 'multiplayer' || (activeTab === 'arena' && !!activeOnlineMatch)
                ? 'active'
                : ''
            }`}
            onClick={() => setActiveTab('multiplayer')}
          >
            <span className="nav-tab-icon">🌐</span>
            <span>Conclave 1×1</span>
          </button>

          <button
            type="button"
            className={`nav-tab-btn ${
              activeTab === 'campaign' ||
              (activeTab === 'arena' && activeCampaignBoss && !isExpeditionBattle)
                ? 'active'
                : ''
            }`}
            onClick={() => setActiveTab('campaign')}
          >
            <span className="nav-tab-icon">🏰</span>
            <span>Campanha</span>
          </button>

          <button
            type="button"
            className={`nav-tab-btn ${
              activeTab === 'expedition' ||
              (activeTab === 'arena' && activeCampaignBoss && isExpeditionBattle)
                ? 'active'
                : ''
            }`}
            onClick={() => setActiveTab('expedition')}
          >
            <span className="nav-tab-icon">🧭</span>
            <span>Expedição</span>
          </button>

          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'tactics' ? 'active' : ''}`}
            onClick={() => setActiveTab('tactics')}
          >
            <span className="nav-tab-icon">🔮</span>
            <span>Oráculo</span>
          </button>

          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'deckbuilder' ? 'active' : ''}`}
            onClick={() => setActiveTab('deckbuilder')}
          >
            <span className="nav-tab-icon">📖</span>
            <span>Grimório</span>
          </button>

          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'packs' ? 'active' : ''}`}
            onClick={() => setActiveTab('packs')}
          >
            <span className="nav-tab-icon">🎁</span>
            <span>Relicário</span>
          </button>

          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'mythology' ? 'active' : ''}`}
            onClick={() => setActiveTab('mythology')}
          >
            <span className="nav-tab-icon">📜</span>
            <span>Mitologia</span>
          </button>

          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'rules' ? 'active' : ''}`}
            onClick={() => setActiveTab('rules')}
          >
            <span className="nav-tab-icon">🎓</span>
            <span>Tutorial</span>
          </button>

          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={handleOpenAdminTab}
            style={{
              borderColor:
                activeTab === 'admin'
                  ? 'rgba(251, 191, 36, 0.95)'
                  : 'rgba(251, 191, 36, 0.5)',
              background:
                activeTab === 'admin'
                  ? 'linear-gradient(180deg, rgba(217, 119, 6, 0.35) 0%, rgba(146, 64, 14, 0.55) 100%)'
                  : 'rgba(251, 191, 36, 0.1)',
              color: '#fde047',
              fontWeight: 800,
            }}
            title="Painel de Administração Exclusivo (tsm81)"
          >
            <span>👑 Admin</span>
          </button>
        </nav>

        <div className="nav-right-controls">
          <button
            type="button"
            className="btn-fantasy"
            onClick={handleOpenAdminTab}
            style={{
              borderColor:
                activeTab === 'admin'
                  ? 'rgba(253, 224, 71, 0.95)'
                  : 'rgba(251, 191, 36, 0.65)',
              background:
                activeTab === 'admin'
                  ? 'linear-gradient(180deg, rgba(217, 119, 6, 0.55) 0%, rgba(120, 53, 15, 0.85) 100%)'
                  : 'linear-gradient(180deg, rgba(120, 53, 15, 0.45) 0%, rgba(69, 26, 3, 0.75) 100%)',
              color: '#fde047',
              fontWeight: 800,
              cursor: 'pointer',
            }}
            title="Abrir Painel de Administração do Site (tsm81)"
          >
            <span>👑</span>
            <span className="hide-on-mobile">ADMIN</span>
          </button>
          {activeTab === 'arena' && (
            <button
              type="button"
              className="btn-fantasy show-on-mobile-inline"
              style={{
                padding: '0 0.55rem',
                height: '30px',
                fontSize: '0.66rem',
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
                } else if (activeCampaignBoss) {
                  const wasExp = isExpeditionBattle;
                  setActiveCampaignBoss(null);
                  setIsExpeditionBattle(false);
                  setActiveTab(wasExp ? 'expedition' : 'campaign');
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
              <span style={{ fontWeight: 800 }}>
                ENTRAR<span className="hide-on-mobile"> / CRIAR CONTA</span>
              </span>
            ) : (
              <>
                <span style={{ fontWeight: 800 }}>
                  {isAdmin ? '👑 ' : ''}
                  {currentUser.username}
                </span>
                <span className="hide-on-mobile" style={{ opacity: 0.78, fontSize: '0.68rem' }}>
                  ({currentUser.eloRating})
                </span>
                <span className="nav-account-badge hide-on-mobile">
                  {isAdmin ? 'ADMIN' : 'PERFIL'}
                </span>
              </>
            )}
          </div>

          <div
            className="gold-pill"
            onClick={() => setActiveTab('packs')}
            style={{ cursor: 'pointer' }}
            title="Saldo de Ouro (+10 Ouro por vitória) — Clique para abrir o Relicário"
          >
            <span className="gold-gem-dot" />
            <span>
              {gold}
              <span className="hide-on-mobile"> OURO</span>
            </span>
          </div>

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
              <span className="hide-on-mobile">AVISOS</span>
              {unreadNotifCount > 0 && (
                <span className="nav-notif-badge">{unreadNotifCount}</span>
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
            <span className="show-on-mobile-inline">{soundMuted ? '🔇' : '🔊'}</span>
            <span className="hide-on-mobile">
              {soundMuted
                ? 'ÁUDIO OFF'
                : `${musicInfo.stage === 'climax' ? 'CLÍMAX' : 'ÁUDIO ON'}`}
            </span>
          </button>
        </div>
      </header>

      {/* Main Content View */}
      <main style={{ flex: 1 }}>
        {!isGuest && customDecks.length === 0 && activeTab !== 'deckbuilder' && (
          <div style={{ maxWidth: '1380px', margin: '0.85rem auto 0', padding: '0 1.75rem' }}>
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
              <button
                type="button"
                className="aaa-btn aaa-btn-primary"
                onClick={() => setActiveTab('deckbuilder')}
              >
                Forjar Meu Grimório (100 Cartas) →
              </button>
            </div>
          </div>
        )}

        {activeTab === 'home' && (
          <div className="aaa-page-shell">
            {isGuest && (
              <WelcomeVisitorBanner
                onQuickPlayArena={() => {
                  trackAdsEvent('quick_play_clicked', { source: 'welcome_banner' });
                  handleOpenArenaSolo();
                }}
                onOpenCreateAccount={() => setAccountModalState({ open: true, tab: 'create' })}
                onOpenCampaign={() => setActiveTab('campaign')}
              />
            )}

            {/* Split Cinematic Hero with Interactive 3D Card Fan */}
            <div className="aaa-home-showcase-hero">
              <div className="aaa-home-hero-copy">
                <div className="aaa-kicker aaa-hero-badge">
                  OS CINCO DOMÍNIOS AGUARDAM O SEU PACTO
                </div>
                <h1 className="font-cinzel gold-gradient-text aaa-home-hero-heading">
                  CHROMATIC PACT
                </h1>
                <div className="font-cinzel aaa-home-hero-tagline">
                  Quebre o Selo. Domine os Elementos. Governe o Tabuleiro.
                </div>
                <p className="aaa-home-hero-lead">
                  Forje alianças profanas entre o Fogo, o Gelo, a Sombra, a Vida e o Sol.
                  Comande legiões em um campo de batalha vivo onde cada formação decide a guerra,
                  expanda seu Domínio sobre a arena e derrube os Soberanos que despedaçaram o mundo.
                </p>

                <div className="aaa-home-cta-group">
                  <button
                    type="button"
                    className="aaa-btn aaa-btn-primary aaa-btn-lg aaa-hero-cta-main"
                    onClick={handleOpenArenaSolo}
                  >
                    {!isGuest && customDecks.length === 0
                      ? 'FORJAR GRIMÓRIO (100 CARTAS)'
                      : 'ENTRAR NA ARENA'}
                  </button>
                  <button
                    type="button"
                    className="aaa-btn aaa-btn-secondary aaa-btn-lg aaa-hero-cta-alt"
                    onClick={() => setActiveTab('multiplayer')}
                  >
                    CONCLAVE 1×1 ONLINE
                  </button>
                  <button
                    type="button"
                    className="aaa-btn aaa-btn-secondary aaa-btn-lg aaa-hero-cta-alt"
                    onClick={() => setActiveTab('campaign')}
                  >
                    MODO CAMPANHA
                  </button>
                  <button
                    type="button"
                    className="aaa-btn aaa-btn-secondary aaa-btn-lg aaa-hero-cta-alt"
                    onClick={() =>
                      setAccountModalState({
                        open: true,
                        tab: isUnregisteredProfile(currentUser) ? 'create' : 'profile',
                      })
                    }
                  >
                    {isUnregisteredProfile(currentUser) ? 'CRIAR CONTA / LOGIN' : 'MEU PERFIL'}
                  </button>
                </div>

                <div className="aaa-home-domain-pillars">
                  <span className="domain-pillar-item pillar-red">Fúria Rubra</span>
                  <span className="domain-pillar-sep">•</span>
                  <span className="domain-pillar-item pillar-blue">Véu Glacial</span>
                  <span className="domain-pillar-sep">•</span>
                  <span className="domain-pillar-item pillar-purple">Ecos Umbrais</span>
                  <span className="domain-pillar-sep">•</span>
                  <span className="domain-pillar-item pillar-green">Seiva Ancestral</span>
                  <span className="domain-pillar-sep">•</span>
                  <span className="domain-pillar-item pillar-gold">Zênite Solar</span>
                </div>
              </div>

              {/* Interactive 3D Fanned Cards Showcase */}
              <div className="aaa-home-card-fan-stage">
                {[
                  'red_08_dragao_vermelho',
                  'neutral_10_valkyra_pentacromatica',
                  'gold_09_serafim_solar',
                ].map((cid, idx) => {
                  const c = CARDS_BY_ID[cid] ?? ALL_CARDS[idx];
                  if (!c) return null;
                  return (
                    <div key={c.id} className={`aaa-fan-card-slot fan-pos-${idx}`}>
                      <CardView
                        card={c}
                        mode="gallery"
                        isPlayable={idx === 1}
                        onClick={() => setShowcaseInspectCard(c)}
                        onInspect={setShowcaseInspectCard}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 6 Illustrated Client Portals */}
            <div className="aaa-home-portals-grid">
              <div
                className="aaa-portal-card"
                onClick={handleOpenArenaSolo}
              >
                <img
                  src="/assets/cards/red_08_dragao_vermelho.png"
                  alt="Arena"
                  className="aaa-portal-bg-art"
                />
                <div className="aaa-portal-content">
                  <span className="aaa-kicker">DUELOS ESTRATÉGICOS</span>
                  <h3 className="font-cinzel">Arena de Batalha</h3>
                  <p>Comande grimórios lendários ou listas autorais em combates táticos de vanguarda e retaguarda.</p>
                  <span className="aaa-portal-cta">Entrar em Combate →</span>
                </div>
              </div>

              <div className="aaa-portal-card" onClick={() => setActiveTab('campaign')}>
                <img
                  src="/assets/cards/neutral_10_valkyra_pentacromatica.png"
                  alt="Campanha"
                  className="aaa-portal-bg-art"
                />
                <div className="aaa-portal-content">
                  <span className="aaa-kicker">CAMPANHA SOLO • 5 ATOS</span>
                  <h3 className="font-cinzel">Queda dos Soberanos</h3>
                  <p>Marche contra os vinte tiranos da Fratura Cromática até o julgamento nos Tronos Tripartidos.</p>
                  <span className="aaa-portal-cta">Crônica: {defeatedBossIds.length}/20 Soberanos →</span>
                </div>
              </div>

              <div className="aaa-portal-card" onClick={() => setActiveTab('expedition')}>
                <img
                  src="/assets/cards/purple_07_lich.png"
                  alt="Expedição"
                  className="aaa-portal-bg-art"
                />
                <div className="aaa-portal-content">
                  <span className="aaa-kicker">ROGUELIKE & DRAFT</span>
                  <h3 className="font-cinzel">Expedição do Vazio</h3>
                  <p>Reivindique bênçãos ancestrais, molde seu baralho a cada escolha e sobreviva à travessia abissal.</p>
                  <span className="aaa-portal-cta">Iniciar Travessia →</span>
                </div>
              </div>

              <div className="aaa-portal-card" onClick={() => setActiveTab('tactics')}>
                <img
                  src="/assets/cards/gold_07_dragao_ouro.png"
                  alt="Táticas"
                  className="aaa-portal-bg-art"
                />
                <div className="aaa-portal-content">
                  <span className="aaa-kicker">DOUTRINAS & ARQUÉTIPOS</span>
                  <h3 className="font-cinzel">Oráculo de Guerra</h3>
                  <p>Desvende as sinergias secretas dos Cinco Domínios e estude os confrontos entre cada linhagem.</p>
                  <span className="aaa-portal-cta">Consultar Oráculo →</span>
                </div>
              </div>

              <div className="aaa-portal-card" onClick={() => setActiveTab('deckbuilder')}>
                <img
                  src="/assets/cards/blue_06_dragao_azul.png"
                  alt="Grimório"
                  className="aaa-portal-bg-art"
                />
                <div className="aaa-portal-content">
                  <span className="aaa-kicker">COLEÇÃO & FORJA DE DECKS</span>
                  <h3 className="font-cinzel">Grimório Ancestral</h3>
                  <p>Contemple o acervo de criaturas, relíquias e feitiços em 3D e forje sua própria arma de guerra.</p>
                  <span className="aaa-portal-cta">Abrir Grimório →</span>
                </div>
              </div>

              <div className="aaa-portal-card" onClick={() => setActiveTab('packs')}>
                <img
                  src="/assets/cards/gold_09_serafim_solar.png"
                  alt="Relicário"
                  className="aaa-portal-bg-art"
                />
                <div className="aaa-portal-content">
                  <span className="aaa-kicker">TESOUROS & INVOCAÇÕES</span>
                  <h3 className="font-cinzel">Relicário Astral</h3>
                  <p>Rompa selos elementais para despertar novos ecos para sua coleção. Saldo: {gold} Ouro.</p>
                  <span className="aaa-portal-cta">Romper Selos →</span>
                </div>
              </div>
            </div>

            {/* Achievements / Conquistas do Soberano Strip */}
            <div className="tg-panel" style={{ marginTop: '0.5rem' }}>
              <div className="aaa-kicker">LEGADO DO SOBERANO • MARCOS DE GLÓRIA</div>
              <div className="exp-achievements-grid">
                {achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className={`exp-achievement-card ${ach.unlocked ? 'is-unlocked' : ''}`}
                  >
                    <span className="exp-ach-emblem">{ach.icon}</span>
                    <div>
                      <div className="font-cinzel exp-ach-title">{ach.title}</div>
                      <div className="exp-ach-desc">{ach.desc}</div>
                      <div className="exp-ach-prog">{ach.progress}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

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
              setActiveOnlineMatch({ room, role });
              setActiveTab('arena');
            }}
          />
        )}

        {activeTab === 'arena' && (
          <BattleArena
            customDecks={customDecks}
            isGuest={isGuest}
            campaignBoss={activeCampaignBoss}
            campaignPlayerDeckIds={campaignPlayerDeckIds}
            initialPlayerDeckId={quickDuelDecks.playerDeckId}
            initialAiDeckId={quickDuelDecks.aiDeckId}
            onCampaignVictory={handleCampaignVictory}
            onExitArena={() => {
              setActiveCampaignBoss(null);
              setActiveOnlineMatch(null);
              setIsExpeditionBattle(false);
              setActiveTab('home');
            }}
            onExitCampaign={() => {
              const wasExp = isExpeditionBattle;
              setActiveCampaignBoss(null);
              setIsExpeditionBattle(false);
              setActiveTab(wasExp ? 'expedition' : 'campaign');
            }}
            onRewardGold={handleRewardGold}
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
            customDecks={customDecks}
            isGuest={isGuest}
            onRequireAccount={() => setAccountModalState({ open: true, tab: 'create' })}
            onRequireDeckSetup={() => setActiveTab('deckbuilder')}
            onStartBossBattle={handleStartBossBattle}
          />
        )}

        {activeTab === 'expedition' && (
          <ExpeditionView
            isGuest={isGuest}
            onRequireAccount={() => setAccountModalState({ open: true, tab: 'create' })}
            onStartExpeditionBattle={handleStartExpeditionBattle}
            onSaveCustomDeck={handleSaveCustomDeck}
            onRewardGold={handleRewardGold}
            lastClearedExpeditionBossId={lastClearedExpeditionBossId}
          />
        )}

        {activeTab === 'tactics' && (
          <TacticalGuideView
            customDecks={customDecks}
            onLaunchDuel={(playerDeckId, opponentDeckId) => {
              if (!isGuest && customDecks.length === 0) {
                const ensured = ensureStarterDeckForUser(currentUser);
                setCurrentUser(ensured);
              }
              setActiveCampaignBoss(null);
              setIsExpeditionBattle(false);
              setQuickDuelDecks({ playerDeckId, aiDeckId: opponentDeckId });
              setActiveTab('arena');
            }}
          />
        )}

        {activeTab === 'deckbuilder' && (
          <DeckBuilder
            unlockedCardIds={unlockedCardIds}
            customDecks={customDecks}
            isGuest={isGuest}
            username={currentUser.username}
            onRequireAccount={() => setAccountModalState({ open: true, tab: 'create' })}
            onSaveCustomDeck={handleSaveCustomDeck}
            onDeleteCustomDeck={handleDeleteCustomDeck}
          />
        )}

        {activeTab === 'packs' && (
          <PackOpener
            gold={gold}
            unlockedCardIds={unlockedCardIds}
            isGuest={isGuest}
            hasCustomDeck={!isGuest && customDecks.length > 0}
            onRequireAccount={() => setAccountModalState({ open: true, tab: 'create' })}
            onRequireDeckSetup={() => setActiveTab('deckbuilder')}
            onOpenPack={handleOpenPack}
          />
        )}

        {activeTab === 'mythology' && (
          <MythologyAtlasView onInspectCard={setShowcaseInspectCard} />
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
            onOpenAdminPanel={() => setActiveTab('admin')}
          />
        )}

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
