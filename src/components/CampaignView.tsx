import React, { useState, useMemo } from 'react';
import { CampaignBoss, CardDefinition } from '../types/game';
import { CARDS_BY_ID } from '../data/cards';
import { CAMPAIGN_BOSSES, PREBUILT_DECKS } from '../data/decks';
import { DOMAIN_META, CardInspectModal } from './CardView';
import { CustomSavedDeck } from './BattleArena';
import { TacticalGuideView } from './TacticalGuideView';
import { VICTORY_GOLD_REWARD } from '../utils/multiplayerEngine';
import { VaeloriaWorldMap } from './VaeloriaWorldMap';
import { resolvePrimaryBossDomain, resolveStageMapNode } from '../data/vaeloriaMapData';
import { SovereignRelicSelectorBar } from './SovereignRelicSelectorBar';

export interface CampaignViewProps {
  defeatedBossIds: string[];
  arenaWins?: number;
  customDecks: CustomSavedDeck[];
  onStartBossBattle: (boss: CampaignBoss, playerDeckCardIds: string[]) => void;
  onRewardGold?: (amount: number, reason?: string) => void;
  onRewardShards?: (amount: number, reason?: string) => void;
  onOpenWeeklyRift?: () => void;
  isGuest?: boolean;
  onRequireAccount?: () => void;
  onRequireDeckSetup?: () => void;
}

function getActInfoForStage(stage: number): { actLabel: string; actTitle: string } {
  if (stage <= 4) {
    return { actLabel: 'ATO I', actTitle: 'As Fronteiras Despertas (Estágios 1–4)' };
  }
  if (stage <= 8) {
    return { actLabel: 'ATO II', actTitle: 'Os Pactos Dualistas (Estágios 5–8)' };
  }
  if (stage <= 12) {
    return { actLabel: 'ATO III', actTitle: 'Os Tronos Ancestrais (Estágios 9–12)' };
  }
  if (stage <= 14) {
    return { actLabel: 'ATO IV', actTitle: 'A Convergência do Tempo (Estágios 13–14)' };
  }
  if (stage <= 20) {
    return { actLabel: 'ATO V', actTitle: 'Os Tronos Tripartidos (Estágios 15–20)' };
  }
  if (stage <= 26) {
    return { actLabel: 'ATO VI', actTitle: 'As Armadas e o Julgamento das Rodas (Estágios 21–26)' };
  }
  return { actLabel: 'ATO VII', actTitle: 'Os Tronos Além do Véu • Fronteiras Profundas (Estágios 27–32)' };
}

export const CampaignView: React.FC<CampaignViewProps> = ({
  defeatedBossIds,
  arenaWins = 0,
  customDecks,
  onStartBossBattle,
  onRewardGold,
  onRewardShards,
  onOpenWeeklyRift,
  isGuest = false,
  onRequireAccount,
  onRequireDeckSetup,
}) => {
  const fullBossRoster: CampaignBoss[] = useMemo(
    () => [...CAMPAIGN_BOSSES].sort((a, b) => a.stage - b.stage),
    []
  );

  const [selectedDeckId, setSelectedDeckId] = useState<string>(
    customDecks[0]?.id ?? PREBUILT_DECKS[0]?.id ?? 'deck_red_inferno'
  );
  const [selectedBossId, setSelectedBossId] = useState<string>(
    fullBossRoster[0]?.id ?? 'boss_1'
  );
  const [actFilter, setActFilter] = useState<'all' | 1 | 2 | 3 | 4 | 5 | 6 | 7>('all');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [isDossierCollapsed, setIsDossierCollapsed] = useState<boolean>(false);
  const [inspectCard, setInspectCard] = useState<CardDefinition | null>(null);
  const [showTacticalGuideModal, setShowTacticalGuideModal] = useState<boolean>(false);

  const getSelectedDeckCardIds = (): string[] => {
    const custom = customDecks.find((cd) => cd.id === selectedDeckId) ?? customDecks[0];
    if (custom) return custom.cardIds;
    const prebuilt = PREBUILT_DECKS.find((d) => d.id === selectedDeckId);
    if (prebuilt) return prebuilt.cardIds;
    return PREBUILT_DECKS[0]?.cardIds ?? [];
  };

  const selectedDeckMeta = useMemo(() => {
    const custom = customDecks.find((cd) => cd.id === selectedDeckId) ?? customDecks[0];
    const prebuilt = PREBUILT_DECKS.find((d) => d.id === selectedDeckId) ?? PREBUILT_DECKS[0];
    const cardIds = custom?.cardIds ?? prebuilt?.cardIds ?? [];
    const label = custom?.name ?? prebuilt?.name ?? 'Soberano';
    let bestAvatarId: string | undefined;
    let bestScore = -1;
    for (const id of cardIds) {
      const c = CARDS_BY_ID[id];
      if (!c?.imagePath) continue;
      const score = (c.rarity === 'legendary' ? 100 : 0) + c.cost;
      if (score > bestScore) {
        bestScore = score;
        bestAvatarId = c.id;
      }
    }
    return { label, avatarCardId: bestAvatarId };
  }, [customDecks, selectedDeckId]);

  const handleClickStartBoss = (boss: CampaignBoss) => {
    if (isGuest) {
      onRequireAccount?.();
      return;
    }
    if (customDecks.length === 0) {
      onRequireDeckSetup?.();
      return;
    }
    onStartBossBattle(boss, getSelectedDeckCardIds());
  };

  const filteredRoster = useMemo(() => {
    if (actFilter === 'all') return fullBossRoster;
    return fullBossRoster.filter((b) => {
      if (actFilter === 1) return b.stage >= 1 && b.stage <= 4;
      if (actFilter === 2) return b.stage >= 5 && b.stage <= 8;
      if (actFilter === 3) return b.stage >= 9 && b.stage <= 12;
      if (actFilter === 4) return b.stage >= 13 && b.stage <= 14;
      if (actFilter === 5) return b.stage >= 15 && b.stage <= 20;
      if (actFilter === 6) return b.stage >= 21 && b.stage <= 26;
      return b.stage >= 27 && b.stage <= 32;
    });
  }, [fullBossRoster, actFilter]);

  const activeBoss =
    fullBossRoster.find((b) => b.id === selectedBossId) ?? fullBossRoster[0];
  const activeBossCard = activeBoss ? CARDS_BY_ID[activeBoss.avatarCardId] : undefined;
  const activePrimaryDomain = resolvePrimaryBossDomain(activeBoss?.domains);
  const activeActInfo = activeBoss
    ? getActInfoForStage(activeBoss.stage)
    : { actLabel: 'ATO I', actTitle: '' };
  const activeMapNode = activeBoss
    ? resolveStageMapNode('campaign', activeBoss.id, activeBoss.stage)
    : null;

  const pct = Math.min(
    100,
    Math.round((defeatedBossIds.length / Math.max(1, fullBossRoster.length)) * 100)
  );

  return (
    <div className={`aaa-page-shell ${viewMode === 'map' ? 'is-widescreen-map-page' : ''}`}>
      {/* Single Compact Toolbar: Act Tabs + Map/List Toggle + Progress + Deck Picker */}
      <div
        className="aaa-campaign-toolbar"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.65rem',
          flexWrap: 'wrap',
          padding: '8px 12px',
          background: '#0b0f17',
          border: '1px solid rgba(148, 163, 184, 0.18)',
          borderRadius: 8,
        }}
      >
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {(
            [
              { id: 'all', label: `Todos (${defeatedBossIds.length}/${fullBossRoster.length})` },
              { id: 1, label: 'Ato I (1–4)' },
              { id: 2, label: 'Ato II (5–8)' },
              { id: 3, label: 'Ato III (9–12)' },
              { id: 4, label: 'Ato IV (13–14)' },
              { id: 5, label: 'Ato V (15–20)' },
              { id: 6, label: 'Ato VI (21–26)' },
              { id: 7, label: 'Ato VII (27–32)' },
            ] as const
          ).map((tab) => (
            <button
              key={String(tab.id)}
              type="button"
              className={`nav-tab-btn ${actFilter === tab.id ? 'active' : ''}`}
              onClick={() => {
                setActFilter(tab.id);
                if (tab.id !== 'all') {
                  const firstInAct = fullBossRoster.find((b) => {
                    if (tab.id === 1) return b.stage >= 1 && b.stage <= 4;
                    if (tab.id === 2) return b.stage >= 5 && b.stage <= 8;
                    if (tab.id === 3) return b.stage >= 9 && b.stage <= 12;
                    if (tab.id === 4) return b.stage >= 13 && b.stage <= 14;
                    if (tab.id === 5) return b.stage >= 15 && b.stage <= 20;
                    if (tab.id === 6) return b.stage >= 21 && b.stage <= 26;
                    return b.stage >= 27 && b.stage <= 32;
                  });
                  if (firstInAct) setSelectedBossId(firstInAct.id);
                }
              }}
              style={{ padding: '0.32rem 0.75rem', fontSize: '0.72rem' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <SovereignRelicSelectorBar
            defeatedBossCount={defeatedBossIds.length}
            arenaWins={arenaWins}
          />

          <div className="vwm-mode-switch">
            <button
              type="button"
              className={`vwm-mode-switch-btn ${viewMode === 'map' ? 'is-active' : ''}`}
              onClick={() => setViewMode('map')}
            >
              Mapa de Vaeloria
            </button>
            <button
              type="button"
              className={`vwm-mode-switch-btn ${viewMode === 'list' ? 'is-active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              Lista
            </button>
          </div>

          {!isGuest && customDecks.length > 0 && (
            <select
              value={selectedDeckId}
              onChange={(e) => setSelectedDeckId(e.target.value)}
              className="aaa-select aaa-toolbar-deck-select"
              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
            >
              {customDecks.map((cd) => (
                <option key={cd.id} value={cd.id}>
                  ★ {cd.name}
                </option>
              ))}
            </select>
          )}
          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#e6c875' }}>
            {pct}% Concluído
          </span>
        </div>
      </div>

      {/* Master-Detail Split Layout (Traversable Continent Map OR Stage Roster List) */}
      <div
        className={`aaa-campaign-workspace ${viewMode === 'map' ? 'is-map-mode' : ''} ${
          viewMode === 'map' && isDossierCollapsed ? 'is-dossier-collapsed' : ''
        }`}
      >
        {viewMode === 'map' ? (
          <VaeloriaWorldMap
            mode="campaign"
            bosses={filteredRoster}
            allBosses={fullBossRoster}
            selectedBossId={activeBoss?.id ?? ''}
            clearedBossIds={defeatedBossIds}
            sovereignAvatarCardId={selectedDeckMeta.avatarCardId}
            sovereignLabel={selectedDeckMeta.label}
            isDossierCollapsed={isDossierCollapsed}
            onToggleDossier={() => setIsDossierCollapsed((v) => !v)}
            onSelectBoss={(boss) => setSelectedBossId(boss.id)}
            onChallengeBoss={handleClickStartBoss}
            onRewardGold={onRewardGold}
            onRewardShards={onRewardShards}
            onOpenWeeklyRift={onOpenWeeklyRift}
          />
        ) : (
          <aside className="aaa-boss-roster">
            {filteredRoster.map((boss) => {
              const isDefeated = defeatedBossIds.includes(boss.id);
              const isSelected = boss.id === activeBoss?.id;
              const avatar = CARDS_BY_ID[boss.avatarCardId];
              const dom = resolvePrimaryBossDomain(boss.domains);
              const actInfo = getActInfoForStage(boss.stage);
              const nodeInfo = resolveStageMapNode('campaign', boss.id, boss.stage);

              return (
                <div
                  key={boss.id}
                  onClick={() => setSelectedBossId(boss.id)}
                  className={`aaa-boss-row ${isSelected ? 'is-selected' : ''} ${
                    isDefeated ? 'is-defeated' : ''
                  }`}
                >
                  <div
                    className="aaa-boss-row-accent"
                    style={{ backgroundColor: DOMAIN_META[dom].color }}
                  />
                  <div className="aaa-boss-row-thumb">
                    {avatar?.imagePath && <img src={avatar.imagePath} alt={boss.name} />}
                  </div>
                  <div className="aaa-boss-row-info">
                    <div className="aaa-boss-row-top">
                      <span className="aaa-boss-stage-num">
                        {actInfo.actLabel} • #{boss.stage}
                      </span>
                      {isDefeated && <span className="aaa-boss-cleared-tag">✓</span>}
                    </div>
                    <div className="font-cinzel aaa-boss-row-name">{boss.name}</div>
                    <div className="aaa-boss-row-geo">{nodeInfo.landmarkName}</div>
                  </div>
                  <div className="aaa-boss-row-stats">
                    <span>{boss.startingHp} PV</span>
                    <span className="gold-text">+{VICTORY_GOLD_REWARD}</span>
                  </div>
                </div>
              );
            })}
          </aside>
        )}

        {/* Right Column: Selected Boss Cinematic Dossier */}
        {activeBoss && (
          <section
            className="aaa-boss-dossier"
            style={
              {
                '--boss-accent': DOMAIN_META[activePrimaryDomain].color,
              } as React.CSSProperties
            }
          >
            <div className="aaa-dossier-visual">
              {activeBossCard?.imagePath && (
                <img
                  src={activeBossCard.imagePath}
                  alt={activeBoss.name}
                  className="aaa-dossier-portrait"
                  onClick={() => setInspectCard(activeBossCard)}
                />
              )}
              <div className="aaa-dossier-vignette" />
            </div>

            <div className="aaa-dossier-content">
              <div className="aaa-dossier-meta-row">
                <span className="aaa-dossier-stage-pill">
                  {activeActInfo.actLabel} • ESTÁGIO {activeBoss.stage}/{fullBossRoster.length}
                </span>
                <div className="aaa-dossier-domains">
                  {activeBoss.domains.length >= 5 ? (
                    <span className="aaa-domain-tag">
                      <i
                        className="aaa-domain-dot"
                        style={{ backgroundColor: '#d4af37' }}
                      />
                      Pentacromático • Matriz Axial
                    </span>
                  ) : (
                    activeBoss.domains.map((dom) => (
                      <span key={dom} className="aaa-domain-tag">
                        <i
                          className="aaa-domain-dot"
                          style={{ backgroundColor: DOMAIN_META[dom].color }}
                        />
                        {DOMAIN_META[dom].shortName}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <h2 className="font-cinzel aaa-dossier-title">{activeBoss.name}</h2>
              <div className="aaa-dossier-subtitle">{activeBoss.title}</div>
              {activeMapNode && (
                <div className="vwm-dossier-geo-badge">
                  <span>{activeMapNode.regionName}</span>
                  <span>•</span>
                  <strong>{activeMapNode.landmarkName}</strong>
                </div>
              )}

              {activeBoss.loreIntro && (
                <blockquote className="aaa-dossier-quote">{activeBoss.loreIntro}</blockquote>
              )}

              <div className="aaa-dossier-metrics">
                <div className="aaa-metric-box">
                  <span className="aaa-metric-lbl">VIDA</span>
                  <span className="aaa-metric-val">{activeBoss.startingHp} PV</span>
                </div>
                <div className="aaa-metric-box">
                  <span className="aaa-metric-lbl">RECOMPENSA</span>
                  <span className="aaa-metric-val gold-text">+{VICTORY_GOLD_REWARD} OURO</span>
                </div>
                <div className="aaa-metric-box">
                  <span className="aaa-metric-lbl">STATUS</span>
                  <span className="aaa-metric-val">
                    {defeatedBossIds.includes(activeBoss.id) ? '✓ CONCLUÍDO' : 'PENDENTE'}
                  </span>
                </div>
              </div>

              <div className="aaa-dossier-passive-panel">
                <div className="aaa-passive-kicker">
                  PASSIVA • {activeBoss.passiveName.toUpperCase()}
                </div>
                <p className="aaa-passive-desc">{activeBoss.passiveDescription}</p>
              </div>

              <div className="aaa-dossier-actions" style={{ flexWrap: 'wrap', gap: '0.65rem' }}>
                <button
                  type="button"
                  className="aaa-btn aaa-btn-primary aaa-btn-lg"
                  onClick={() => handleClickStartBoss(activeBoss)}
                >
                  Desafiar Soberano
                </button>
                <button
                  type="button"
                  className="aaa-btn aaa-btn-secondary"
                  onClick={() => setShowTacticalGuideModal(true)}
                >
                  Matchup
                </button>
                {activeBossCard && (
                  <button
                    type="button"
                    className="aaa-btn aaa-btn-ghost"
                    onClick={() => setInspectCard(activeBossCard)}
                  >
                    Carta-Chefe
                  </button>
                )}
              </div>
            </div>
          </section>
        )}
      </div>

      {showTacticalGuideModal && activeBoss && (
        <TacticalGuideView
          customDecks={customDecks}
          initialPlayerDeckId={selectedDeckId}
          initialOpponentDeckId={activeBoss.deckId}
          isModal={true}
          onClose={() => setShowTacticalGuideModal(false)}
        />
      )}

      {inspectCard && (
        <CardInspectModal card={inspectCard} onClose={() => setInspectCard(null)} />
      )}
    </div>
  );
};
