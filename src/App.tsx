import React, { useState, useEffect, useMemo } from 'react';
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
import { CardView, CardInspectModal } from './components/CardView';
import {
  getActiveTabUserProfile,
  isUnregisteredProfile,
  MultiplayerRoom,
  recordPvpMatchResult,
  setActiveTabUserProfile,
  SovereignUserProfile,
  VICTORY_GOLD_REWARD,
} from './utils/multiplayerEngine';

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
  | 'rules';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [soundMuted, setSoundMuted] = useState<boolean>(() => isMuted());
  const [musicInfo, setMusicInfo] = useState<MusicStateDescriptor>(() => getCurrentMusicState());

  // Sovereign User Profile & 1v1 Multiplayer State
  const [currentUser, setCurrentUser] = useState<SovereignUserProfile>(() =>
    getActiveTabUserProfile()
  );

  const isGuest = isUnregisteredProfile(currentUser);

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
    setActiveCampaignBoss(null);
    setActiveOnlineMatch(null);
    setIsExpeditionBattle(false);
    // Registered users (including tsm81 and new users) must first confirm/save their 100-card combat deck
    if (!isGuest && customDecks.length === 0) {
      setActiveTab('deckbuilder');
      return;
    }
    setActiveTab('arena');
  };

  const handleToggleSound = () => {
    startAdaptiveMusic();
    const nextMuted = toggleMute();
    setSoundMuted(nextMuted);
  };

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
    setActiveOnlineMatch(null);
    setIsExpeditionBattle(false);
    setActiveCampaignBoss(boss);
    setCampaignPlayerDeckIds(playerDeckIds);
    setActiveTab('arena');
  };

  const handleStartExpeditionBattle = (boss: CampaignBoss, playerDeckIds: string[]) => {
    setActiveOnlineMatch(null);
    setIsExpeditionBattle(true);
    setActiveCampaignBoss(boss);
    setCampaignPlayerDeckIds(playerDeckIds);
    setActiveTab('arena');
  };

  const handleCampaignVictory = (boss: CampaignBoss) => {
    if (isGuest) return;
    if (isExpeditionBattle) {
      setLastClearedExpeditionBossId(boss.id);
      updateCurrentUserProgression({
        gold: gold + VICTORY_GOLD_REWARD,
        arenaWins: arenaWins + 1,
      });
    } else {
      const nextBosses = defeatedBossIds.includes(boss.id)
        ? defeatedBossIds
        : [...defeatedBossIds, boss.id];
      updateCurrentUserProgression({
        gold: gold + VICTORY_GOLD_REWARD,
        arenaWins: arenaWins + 1,
        defeatedBossIds: nextBosses,
      });
    }
  };

  const handleRewardGold = (amount: number) => {
    if (isGuest) return;
    updateCurrentUserProgression({
      gold: gold + amount,
      arenaWins: arenaWins + 1,
    });
  };

  const handleOpenPack = (packCost: number, drawnCards: CardDefinition[]) => {
    if (isGuest) return;
    const nextExtra = { ...(currentUser.extraUnlockedCards ?? {}) };
    for (const c of drawnCards) {
      nextExtra[c.id] = (nextExtra[c.id] ?? 0) + 1;
    }
    updateCurrentUserProgression({
      gold: Math.max(0, gold - packCost),
      extraUnlockedCards: nextExtra,
    });
  };

  const handleSaveCustomDeck = (deck: CustomSavedDeck) => {
    if (isGuest) return;
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
  };

  const handleDeleteCustomDeck = (deckId: string) => {
    if (isGuest) return;
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
      <header className="top-navbar">
        <div
          className="brand-logo"
          onClick={() => {
            setActiveCampaignBoss(null);
            setActiveTab('home');
          }}
        >
          <div className="brand-emblem">❖</div>
          <div>
            <div className="brand-title gold-gradient-text">CHROMATIC PACT</div>
            <div className="brand-subtitle">DARK FANTASY TACTICAL CARD GAME</div>
          </div>
        </div>

        <nav className="nav-tabs">
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => {
              setActiveCampaignBoss(null);
              setActiveOnlineMatch(null);
              setActiveTab('home');
            }}
          >
            Início
          </button>

          <button
            type="button"
            className={`nav-tab-btn ${
              activeTab === 'arena' && !activeCampaignBoss && !activeOnlineMatch ? 'active' : ''
            }`}
            onClick={handleOpenArenaSolo}
          >
            Arena Solo
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
            Conclave 1×1
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
            Campanha
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
            Expedição
          </button>

          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'tactics' ? 'active' : ''}`}
            onClick={() => setActiveTab('tactics')}
          >
            Oráculo
          </button>

          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'deckbuilder' ? 'active' : ''}`}
            onClick={() => setActiveTab('deckbuilder')}
          >
            Grimório
          </button>

          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'packs' ? 'active' : ''}`}
            onClick={() => setActiveTab('packs')}
          >
            Relicário
          </button>

          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'mythology' ? 'active' : ''}`}
            onClick={() => setActiveTab('mythology')}
          >
            Mitologia
          </button>

          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'rules' ? 'active' : ''}`}
            onClick={() => setActiveTab('rules')}
          >
            Tutorial
          </button>
        </nav>

        <div className="nav-right-controls">
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
              <span style={{ fontWeight: 800 }}>ENTRAR / CRIAR CONTA</span>
            ) : (
              <>
                <span style={{ fontWeight: 800 }}>{currentUser.username}</span>
                <span style={{ opacity: 0.78, fontSize: '0.68rem' }}>({currentUser.eloRating})</span>
                <span className="nav-account-badge">PERFIL</span>
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
            <span>{gold} OURO</span>
          </div>

          <button
            type="button"
            className={`btn-fantasy ${
              !soundMuted && musicInfo.stage === 'climax' ? 'btn-fantasy-danger' : ''
            }`}
            onClick={handleToggleSound}
            title={
              soundMuted
                ? 'Clique para ativar Trilha Adaptativa & Efeitos Sonoros'
                : `Trilha Adaptativa Ativa: ${musicInfo.label}`
            }
          >
            {soundMuted
              ? 'ÁUDIO OFF'
              : `${musicInfo.stage === 'climax' ? 'CLÍMAX' : 'ÁUDIO ON'}`}
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
            onUserChange={setCurrentUser}
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
                      const updated = recordPvpMatchResult(currentUser, didWin, opponentRating);
                      setCurrentUser(updated);
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
                setActiveTab('deckbuilder');
                return;
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

        {showcaseInspectCard && (
          <CardInspectModal
            card={showcaseInspectCard}
            onClose={() => setShowcaseInspectCard(null)}
          />
        )}

        {accountModalState.open && (
          <SovereignAccountModal
            currentUser={currentUser}
            customDecks={customDecks}
            onUserChange={setCurrentUser}
            initialTab={accountModalState.tab}
            onClose={() => setAccountModalState((prev) => ({ ...prev, open: false }))}
            onNeedsDeckSetup={() => setActiveTab('deckbuilder')}
          />
        )}
      </main>
    </div>
  );
};

export default App;
