import React, { useState, useEffect, useMemo } from 'react';
import { CampaignBoss, CardDefinition } from './types/game';
import { ALL_CARDS, CARDS_BY_ID } from './data/cards';
import { PREBUILT_DECKS } from './data/decks';
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
  SovereignUserProfile,
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

const STORAGE_KEYS = {
  GOLD: 'chromatic_pact_gold_v1',
  COLLECTION: 'chromatic_pact_collection_v1',
  DEFEATED_BOSSES: 'chromatic_pact_bosses_v1',
  CUSTOM_DECKS: 'chromatic_pact_custom_decks_v1',
  ARENA_WINS: 'chromatic_pact_arena_wins_v1',
};

function getInitialCollection(): Record<string, number> {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.COLLECTION);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // Ignore localStorage parse errors
  }

  // Default starter collection: unlock starter copies from the first 2 prebuilt decks
  const initial: Record<string, number> = {};
  for (const deck of PREBUILT_DECKS.slice(0, 2)) {
    for (const id of deck.cardIds) {
      initial[id] = Math.min(3, (initial[id] ?? 0) + 1);
    }
  }
  return initial;
}

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [soundMuted, setSoundMuted] = useState<boolean>(() => isMuted());
  const [musicInfo, setMusicInfo] = useState<MusicStateDescriptor>(() => getCurrentMusicState());

  const [gold, setGold] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GOLD);
      return saved !== null ? Number(saved) : 500;
    } catch {
      return 500;
    }
  });

  const [unlockedCardIds, setUnlockedCardIds] = useState<Record<string, number>>(
    getInitialCollection
  );

  const [defeatedBossIds, setDefeatedBossIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DEFEATED_BOSSES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [customDecks, setCustomDecks] = useState<CustomSavedDeck[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_DECKS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [arenaWins, setArenaWins] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ARENA_WINS);
      return saved ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });

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

  // Sovereign User Profile & 1v1 Multiplayer State
  const [currentUser, setCurrentUser] = useState<SovereignUserProfile>(() =>
    getActiveTabUserProfile()
  );
  const [accountModalState, setAccountModalState] = useState<{
    open: boolean;
    tab: AccountModalTab;
  }>({ open: false, tab: 'profile' });
  const [activeOnlineMatch, setActiveOnlineMatch] = useState<{
    room: MultiplayerRoom;
    role: 'host' | 'guest';
  } | null>(null);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GOLD, String(gold));
    } catch {
      // Ignore storage error
    }
  }, [gold]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COLLECTION, JSON.stringify(unlockedCardIds));
    } catch {
      // Ignore storage error
    }
  }, [unlockedCardIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DEFEATED_BOSSES, JSON.stringify(defeatedBossIds));
    } catch {
      // Ignore storage error
    }
  }, [defeatedBossIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_DECKS, JSON.stringify(customDecks));
    } catch {
      // Ignore storage error
    }
  }, [customDecks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ARENA_WINS, String(arenaWins));
    } catch {
      // Ignore storage error
    }
  }, [arenaWins]);

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
    setGold((prev) => prev + boss.rewardGold);
    setArenaWins((prev) => prev + 1);
    if (isExpeditionBattle) {
      setLastClearedExpeditionBossId(boss.id);
    } else {
      setDefeatedBossIds((prev) => (prev.includes(boss.id) ? prev : [...prev, boss.id]));
    }
  };

  const handleRewardGold = (amount: number) => {
    setGold((prev) => prev + amount);
    setArenaWins((prev) => prev + 1);
  };

  const handleOpenPack = (packCost: number, drawnCards: CardDefinition[]) => {
    setGold((prev) => Math.max(0, prev - packCost));
    setUnlockedCardIds((prev) => {
      const next = { ...prev };
      for (const c of drawnCards) {
        next[c.id] = (next[c.id] ?? 0) + 1;
      }
      return next;
    });
  };

  const handleUnlockSandbox = () => {
    setGold((prev) => prev + 1000);
    const full: Record<string, number> = {};
    for (const c of ALL_CARDS) {
      full[c.id] = c.rarity === 'legendary' ? 1 : 3;
    }
    setUnlockedCardIds(full);
  };

  const handleSaveCustomDeck = (deck: CustomSavedDeck) => {
    setCustomDecks((prev) => {
      const exists = prev.some((d) => d.id === deck.id);
      if (exists) {
        return prev.map((d) => (d.id === deck.id ? deck : d));
      }
      return [...prev, deck];
    });
  };

  const handleDeleteCustomDeck = (deckId: string) => {
    setCustomDecks((prev) => prev.filter((d) => d.id !== deckId));
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
        icon: '⚔️',
        title: 'Sangue na Arena',
        desc: 'Conquiste sua primeira vitória em duelos na Arena ou na Campanha.',
        progress: `${arenaWins + defeatedBossIds.length} vitórias`,
        unlocked: arenaWins + defeatedBossIds.length >= 1,
      },
      {
        id: 'ach_act_v',
        icon: '👑',
        title: 'Regicida dos Cinco Atos',
        desc: 'Subjugue os Soberanos da Campanha até os Tronos Tripartidos.',
        progress: `${defeatedBossIds.length}/20 Soberanos`,
        unlocked: defeatedBossIds.length >= 20,
      },
      {
        id: 'ach_collector',
        icon: '💎',
        title: 'Guardião do Códice',
        desc: 'Reúna todas as criaturas, relíquias e feitiços dos Cinco Domínios.',
        progress: `${uniqueUnlockedCount}/${ALL_CARDS.length} Ecos`,
        unlocked: uniqueUnlockedCount >= ALL_CARDS.length,
      },
      {
        id: 'ach_decksmith',
        icon: '📜',
        title: 'Arquiteto do Pacto',
        desc: 'Forje e consagre um grimório autoral para os campos de batalha.',
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
            onClick={() => {
              setActiveCampaignBoss(null);
              setActiveOnlineMatch(null);
              setIsExpeditionBattle(false);
              setActiveTab('arena');
            }}
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
            className="gold-pill"
            onClick={() =>
              setAccountModalState({
                open: true,
                tab: isUnregisteredProfile(currentUser) ? 'create' : 'profile',
              })
            }
            style={{
              cursor: 'pointer',
              borderColor: 'rgba(250, 204, 21, 0.55)',
              background: 'linear-gradient(135deg, rgba(30, 22, 48, 0.92), rgba(15, 23, 42, 0.95))',
              color: '#fef08a',
              gap: '0.45rem',
            }}
            title="Clique para abrir seu Perfil do Soberano, Entrar ou Criar Conta"
          >
            <span>👤</span>
            {isUnregisteredProfile(currentUser) ? (
              <span style={{ fontWeight: 800 }}>ENTRAR / CRIAR CONTA</span>
            ) : (
              <>
                <span style={{ fontWeight: 800 }}>{currentUser.username}</span>
                <span style={{ opacity: 0.78, fontSize: '0.7rem' }}>({currentUser.eloRating})</span>
                <span
                  style={{
                    marginLeft: '0.2rem',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    background: 'rgba(250, 204, 21, 0.18)',
                    border: '1px solid rgba(250, 204, 21, 0.45)',
                    fontSize: '0.62rem',
                    color: '#fde047',
                    fontWeight: 800,
                  }}
                >
                  PERFIL
                </span>
              </>
            )}
          </div>

          <div
            className="gold-pill"
            onClick={() => setActiveTab('packs')}
            style={{ cursor: 'pointer' }}
          >
            <span className="gold-gem-dot" />
            <span>{gold} OURO</span>
          </div>

          <button
            type="button"
            className={`btn-fantasy ${
              !soundMuted && musicInfo.stage === 'climax' ? 'btn-fantasy-danger' : ''
            }`}
            style={{ padding: '0.35rem 0.7rem', fontSize: '0.72rem', letterSpacing: '0.05em' }}
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
                    onClick={() => {
                      setActiveCampaignBoss(null);
                      setActiveOnlineMatch(null);
                      setIsExpeditionBattle(false);
                      setActiveTab('arena');
                    }}
                  >
                    ENTRAR NA ARENA
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
                onClick={() => {
                  setActiveCampaignBoss(null);
                  setIsExpeditionBattle(false);
                  setActiveTab('arena');
                }}
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
                    <span className="exp-ach-icon">{ach.icon}</span>
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
                      const updated = recordPvpMatchResult(currentUser, didWin);
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
            onStartBossBattle={handleStartBossBattle}
          />
        )}

        {activeTab === 'expedition' && (
          <ExpeditionView
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
            onSaveCustomDeck={handleSaveCustomDeck}
            onDeleteCustomDeck={handleDeleteCustomDeck}
          />
        )}

        {activeTab === 'packs' && (
          <PackOpener
            gold={gold}
            unlockedCardIds={unlockedCardIds}
            onOpenPack={handleOpenPack}
            onUnlockSandbox={handleUnlockSandbox}
          />
        )}

        {activeTab === 'mythology' && (
          <MythologyAtlasView onInspectCard={setShowcaseInspectCard} />
        )}

        {activeTab === 'rules' && (
          <TutorialCodexView
            isModal={false}
            onStartPracticeDuel={() => {
              setActiveCampaignBoss(null);
              setIsExpeditionBattle(false);
              setActiveTab('arena');
            }}
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
          />
        )}
      </main>
    </div>
  );
};

export default App;
