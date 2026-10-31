import React, { useState, useMemo, useEffect } from 'react';
import { CampaignBoss, CardDefinition, Domain } from '../types/game';
import { CARDS_BY_ID } from '../data/cards';
import { PREBUILT_DECKS } from '../data/decks';
import { DOMAIN_META, CardInspectModal } from './CardView';
import { CustomSavedDeck } from './BattleArena';
import { TacticalGuideView } from './TacticalGuideView';
import { VaeloriaWorldMap } from './VaeloriaWorldMap';
import { resolvePrimaryBossDomain } from '../data/vaeloriaMapData';
import { VAELORIA_REALM_ORDER, VAELORIA_REGIONAL_MAPS } from '../data/vaeloriaMultimapData';
import { SovereignRelicSelectorBar } from './SovereignRelicSelectorBar';
import {
  GRAND_CAMPAIGN_BOSSES,
  GRAND_CAMPAIGN_NODES_BY_ID,
  SOVEREIGN_BANNER_PALETTE,
  STARTING_REALM_BY_SOVEREIGN_DOMAIN,
  SovereignBannerDomain,
  computeSubmapReachability,
  computeUnlockedCampaignSubmaps,
  loadCampaignMapSession,
  saveCampaignMapSession,
} from '../data/vaeloriaGrandCampaign';

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

const BANNER_STORAGE_KEY = 'chromatic_pact_campaign_banner_v1';

function inferDeckSovereignDomain(cardIds: string[]): SovereignBannerDomain {
  const counts: Record<SovereignBannerDomain, number> = {
    green: 0,
    red: 0,
    blue: 0,
    purple: 0,
    gold: 0,
  };
  for (const id of cardIds) {
    const dom = CARDS_BY_ID[id]?.domain;
    if (dom && dom !== 'neutral') {
      counts[dom] += 1;
    }
  }
  let best: SovereignBannerDomain = 'green';
  let bestCount = -1;
  for (const dom of ['green', 'red', 'blue', 'purple', 'gold'] as SovereignBannerDomain[]) {
    if (counts[dom] > bestCount) {
      bestCount = counts[dom];
      best = dom;
    }
  }
  return best;
}

const TIER_ROMAN: Record<number, string> = {
  1: 'TIER I • FRONTEIRA',
  2: 'TIER II • VANGUARDA',
  3: 'TIER III • BASTIÃO',
  4: 'TIER IV • ALTO TRONO',
  5: 'TIER V • SOBERANO ÁPICE',
};

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
    () => [...GRAND_CAMPAIGN_BOSSES].sort((a, b) => a.stage - b.stage),
    []
  );

  const [selectedDeckId, setSelectedDeckId] = useState<string>(
    customDecks[0]?.id ?? PREBUILT_DECKS[0]?.id ?? 'deck_green_wild'
  );

  const getSelectedDeckCardIds = (): string[] => {
    const custom = customDecks.find((cd) => cd.id === selectedDeckId) ?? customDecks[0];
    if (custom) return custom.cardIds;
    const prebuilt = PREBUILT_DECKS.find((d) => d.id === selectedDeckId);
    if (prebuilt) return prebuilt.cardIds;
    return PREBUILT_DECKS[0]?.cardIds ?? [];
  };

  const [sovereignDomain, setSovereignDomain] = useState<SovereignBannerDomain>(() => {
    try {
      const saved = localStorage.getItem(BANNER_STORAGE_KEY);
      if (
        saved === 'green' ||
        saved === 'red' ||
        saved === 'blue' ||
        saved === 'purple' ||
        saved === 'gold'
      ) {
        return saved;
      }
    } catch {
      // ignore
    }
    const initialCards =
      customDecks[0]?.cardIds ?? PREBUILT_DECKS[0]?.cardIds ?? [];
    return inferDeckSovereignDomain(initialCards);
  });

  useEffect(() => {
    try {
      localStorage.setItem(BANNER_STORAGE_KEY, sovereignDomain);
    } catch {
      // ignore
    }
  }, [sovereignDomain]);

  const startingRealm = STARTING_REALM_BY_SOVEREIGN_DOMAIN[sovereignDomain];

  const [selectedBossId, setSelectedBossId] = useState<string>(() => {
    const savedId = loadCampaignMapSession()?.selectedBossId;
    if (savedId && fullBossRoster.some((b) => b.id === savedId)) {
      return savedId;
    }
    const firstInStartRealm = fullBossRoster.find(
      (b) => GRAND_CAMPAIGN_NODES_BY_ID[b.id]?.submapId === startingRealm
    );
    return firstInStartRealm?.id ?? fullBossRoster[0]?.id ?? '';
  });

  const [isTheaterFullscreen, setIsTheaterFullscreen] = useState<boolean>(
    () => Boolean(loadCampaignMapSession()?.isTheaterFullscreen)
  );

  useEffect(() => {
    if (selectedBossId) {
      saveCampaignMapSession({ selectedBossId });
    }
  }, [selectedBossId]);

  const [domainFilter, setDomainFilter] = useState<'all' | Domain>('all');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  // Collapsed by default in Map mode so 100% of every map fits unobstructed on screen!
  const [isDossierCollapsed, setIsDossierCollapsed] = useState<boolean>(true);
  const [inspectCard, setInspectCard] = useState<CardDefinition | null>(null);
  const [showTacticalGuideModal, setShowTacticalGuideModal] = useState<boolean>(false);

  const defeatedSet = useMemo(() => new Set(defeatedBossIds), [defeatedBossIds]);

  const grandClearedIds = useMemo(
    () => fullBossRoster.filter((b) => defeatedSet.has(b.id)).map((b) => b.id),
    [fullBossRoster, defeatedSet]
  );

  const unlockedSubmaps = useMemo(
    () => computeUnlockedCampaignSubmaps(defeatedBossIds, sovereignDomain),
    [defeatedBossIds, sovereignDomain]
  );

  const reachBySubmap = useMemo(() => {
    const map = {} as Record<string, ReturnType<typeof computeSubmapReachability>>;
    for (const rid of VAELORIA_REALM_ORDER) {
      map[rid] = computeSubmapReachability(rid, defeatedBossIds);
    }
    return map;
  }, [defeatedBossIds]);

  const conqueredSubmapsCount = useMemo(
    () =>
      VAELORIA_REALM_ORDER.filter((rid) => reachBySubmap[rid]?.isSubmapConquered).length,
    [reachBySubmap]
  );

  const isBossAccessibleOnRoad = (bossId: string): boolean => {
    const gcn = GRAND_CAMPAIGN_NODES_BY_ID[bossId];
    if (!gcn) return true;
    if (!unlockedSubmaps.has(gcn.submapId)) return false;
    return Boolean(reachBySubmap[gcn.submapId]?.accessibleNodeIds.has(bossId));
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
    if (!isBossAccessibleOnRoad(boss.id)) {
      return;
    }
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
    if (domainFilter === 'all') return fullBossRoster;
    return fullBossRoster.filter((b) => resolvePrimaryBossDomain(b.domains) === domainFilter);
  }, [fullBossRoster, domainFilter]);

  const activeBoss =
    fullBossRoster.find((b) => b.id === selectedBossId) ?? fullBossRoster[0];
  const activeGcNode = activeBoss ? GRAND_CAMPAIGN_NODES_BY_ID[activeBoss.id] : undefined;
  const activeBossCard = activeBoss ? CARDS_BY_ID[activeBoss.avatarCardId] : undefined;
  const companionBossCard =
    activeBoss?.companionCardId ? CARDS_BY_ID[activeBoss.companionCardId] : undefined;
  const activePrimaryDomain = resolvePrimaryBossDomain(activeBoss?.domains);
  const activeSubmapDef = activeGcNode
    ? VAELORIA_REGIONAL_MAPS[activeGcNode.submapId]
    : null;
  const isActiveAccessible = activeBoss ? isBossAccessibleOnRoad(activeBoss.id) : false;
  const isActiveDefeated = activeBoss ? defeatedSet.has(activeBoss.id) : false;

  const pct = Math.min(
    100,
    Math.round((grandClearedIds.length / Math.max(1, fullBossRoster.length)) * 100)
  );
  const bannerMeta = SOVEREIGN_BANNER_PALETTE[sovereignDomain];

  return (
    <div className={`aaa-page-shell ${viewMode === 'map' ? 'is-widescreen-map-page' : ''}`}>
      {/* Ultra-Slim Single-Row Campaign Command Bar */}
      <div className="aaa-campaign-toolbar">
        <div className="aaa-campaign-toolbar-left">
          <span className="aaa-campaign-kpi-pill">
            Confrontos: <strong>{grandClearedIds.length}/{fullBossRoster.length}</strong> ({pct}%)
          </span>
          <span
            className="aaa-campaign-kpi-pill"
            style={{ borderColor: bannerMeta.borderRgba }}
          >
            Sub-mapas Unificados: <strong>{conqueredSubmapsCount}/20</strong>
          </span>

          {viewMode === 'list' && (
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value as 'all' | Domain)}
              className="aaa-select aaa-toolbar-deck-select"
              aria-label="Filtrar domínio na lista"
            >
              <option value="all">Todos os Domínios ({fullBossRoster.length})</option>
              <option value="green">Veridia • Esmeralda</option>
              <option value="red">Pyros • Rubro</option>
              <option value="blue">Vórtex • Safira</option>
              <option value="purple">Eclipse • Obsidiana</option>
              <option value="gold">Solária • Alvorada</option>
              <option value="neutral">Matriz Axial • Neutro</option>
            </select>
          )}
        </div>

        <div className="aaa-campaign-toolbar-right">
          <label className="aaa-sovereign-banner-picker" title="Cor do Estandarte Soberano (converte sub-mapas 100% vencidos para sua cor)">
            <span
              className="aaa-sovereign-banner-dot"
              style={{ background: bannerMeta.hex }}
            />
            <select
              value={sovereignDomain}
              onChange={(e) =>
                setSovereignDomain(e.target.value as SovereignBannerDomain)
              }
              className="aaa-select aaa-banner-select"
            >
              <option value="green">Estandarte: Veridia (Verde)</option>
              <option value="red">Estandarte: Pyros (Vermelho)</option>
              <option value="blue">Estandarte: Vórtex (Azul)</option>
              <option value="purple">Estandarte: Eclipse (Roxo)</option>
              <option value="gold">Estandarte: Solária (Dourado)</option>
            </select>
          </label>

          <SovereignRelicSelectorBar
            defeatedBossCount={grandClearedIds.length}
            arenaWins={arenaWins}
          />

          <div className="vwm-mode-switch">
            <button
              type="button"
              className={`vwm-mode-switch-btn ${viewMode === 'map' ? 'is-active' : ''}`}
              onClick={() => setViewMode('map')}
            >
              Mapa
            </button>
            <button
              type="button"
              className={`vwm-mode-switch-btn ${viewMode === 'list' ? 'is-active' : ''}`}
              onClick={() => {
                setViewMode('list');
                setIsDossierCollapsed(false);
              }}
            >
              Lista
            </button>
          </div>

          {!isGuest && customDecks.length > 0 && (
            <select
              value={selectedDeckId}
              onChange={(e) => {
                const nextId = e.target.value;
                setSelectedDeckId(nextId);
                const chosen = customDecks.find((d) => d.id === nextId);
                if (chosen) {
                  setSovereignDomain(inferDeckSovereignDomain(chosen.cardIds));
                }
              }}
              className="aaa-select aaa-toolbar-deck-select"
            >
              {customDecks.map((cd) => (
                <option key={cd.id} value={cd.id}>
                  ★ {cd.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Main Workspace: Full-Screen 16:9 Map Stage + Floating Collapsible Dossier Drawer */}
      <div
        className={`aaa-campaign-workspace ${viewMode === 'map' ? 'is-map-mode' : ''} ${
          viewMode === 'map' && isDossierCollapsed ? 'is-dossier-collapsed' : ''
        }`}
      >
        {viewMode === 'map' ? (
          <VaeloriaWorldMap
            mode="campaign"
            bosses={fullBossRoster}
            allBosses={fullBossRoster}
            selectedBossId={activeBoss?.id ?? ''}
            clearedBossIds={grandClearedIds}
            sovereignDomain={sovereignDomain}
            sovereignAvatarCardId={selectedDeckMeta.avatarCardId}
            sovereignLabel={selectedDeckMeta.label}
            isDossierCollapsed={isDossierCollapsed}
            onToggleDossier={() => setIsDossierCollapsed((v) => !v)}
            onOpenDossier={() => setIsDossierCollapsed(false)}
            onCloseDossier={() => setIsDossierCollapsed(true)}
            isTheaterFullscreen={isTheaterFullscreen}
            onChangeTheaterFullscreen={(next) => {
              setIsTheaterFullscreen(next);
              saveCampaignMapSession({ isTheaterFullscreen: next });
            }}
            onSelectBoss={(boss) => setSelectedBossId(boss.id)}
            onChallengeBoss={handleClickStartBoss}
            onRewardGold={onRewardGold}
            onRewardShards={onRewardShards}
            onOpenWeeklyRift={onOpenWeeklyRift}
          />
        ) : (
          <aside className="aaa-boss-roster">
            {filteredRoster.map((boss) => {
              const isDefeated = defeatedSet.has(boss.id);
              const isAccessible = isBossAccessibleOnRoad(boss.id);
              const isSelected = boss.id === activeBoss?.id;
              const avatar = CARDS_BY_ID[boss.avatarCardId];
              const dom = resolvePrimaryBossDomain(boss.domains);
              const gcn = GRAND_CAMPAIGN_NODES_BY_ID[boss.id];
              const rdef = gcn ? VAELORIA_REGIONAL_MAPS[gcn.submapId] : null;

              return (
                <div
                  key={boss.id}
                  onClick={() => setSelectedBossId(boss.id)}
                  className={`aaa-boss-row ${isSelected ? 'is-selected' : ''} ${
                    isDefeated ? 'is-defeated' : ''
                  } ${!isAccessible ? 'is-locked-boss-row' : ''}`}
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
                        TIER {gcn?.tier ?? boss.difficultyTier ?? 1} • #{boss.stage}
                      </span>
                      {isDefeated ? (
                        <span className="aaa-boss-cleared-tag">✓</span>
                      ) : !isAccessible ? (
                        <span className="aaa-boss-locked-tag">🔒</span>
                      ) : null}
                    </div>
                    <div className="font-cinzel aaa-boss-row-name">{boss.name}</div>
                    <div className="aaa-boss-row-geo">
                      {rdef ? `${rdef.shortName} • ` : ''}
                      {gcn?.landmarkName ?? boss.landmarkName ?? ''}
                    </div>
                  </div>
                  <div className="aaa-boss-row-stats">
                    <span>{boss.startingHp} PV</span>
                    <span className="gold-text">+{boss.rewardGold}</span>
                  </div>
                </div>
              );
            })}
          </aside>
        )}

        {/* Boss Dossier (Floating Overlay Drawer in Map Mode; Right Panel in List Mode) */}
        {activeBoss && !(viewMode === 'map' && isDossierCollapsed) && (
          <section
            className={`aaa-boss-dossier ${viewMode === 'map' ? 'is-floating-map-drawer' : ''} ${
              viewMode === 'map' && isTheaterFullscreen ? 'is-theater-overlay' : ''
            }`}
            style={
              {
                '--boss-accent': '#d4af37',
              } as React.CSSProperties
            }
          >
            {viewMode === 'map' && (
              <div className="aaa-floating-drawer-topbar">
                <span className="aaa-floating-drawer-kicker">
                  DOSSIÊ DE CONFRONTO #{activeBoss.stage}/{fullBossRoster.length}
                </span>
                <button
                  type="button"
                  className="aaa-floating-drawer-close"
                  onClick={() => setIsDossierCollapsed(true)}
                  title="Fechar Dossiê"
                >
                  ✕
                </button>
              </div>
            )}

            <div className={`aaa-dossier-visual ${companionBossCard ? 'is-duo-visual' : ''}`}>
              {activeBossCard?.imagePath && (
                <img
                  src={activeBossCard.imagePath}
                  alt={activeBoss.name}
                  className="aaa-dossier-portrait"
                  onClick={() => setInspectCard(activeBossCard)}
                  title={`Inspecionar ${activeBossCard.name}`}
                />
              )}
              {companionBossCard?.imagePath && (
                <img
                  src={companionBossCard.imagePath}
                  alt={companionBossCard.name}
                  className="aaa-dossier-portrait"
                  onClick={() => setInspectCard(companionBossCard)}
                  title={`Inspecionar ${companionBossCard.name}`}
                />
              )}
              <div className="aaa-dossier-vignette" />
            </div>

            <div className="aaa-dossier-content">
              <div className="aaa-dossier-meta-row">
                <span className="aaa-dossier-stage-pill">
                  {TIER_ROMAN[activeGcNode?.tier ?? activeBoss.difficultyTier ?? 1]}
                </span>
                <span className="aaa-domain-tag">
                  <i
                    className="aaa-domain-dot"
                    style={{ backgroundColor: DOMAIN_META[activePrimaryDomain].color }}
                  />
                  {DOMAIN_META[activePrimaryDomain].shortName}
                </span>
              </div>

              <h2 className="font-cinzel aaa-dossier-title">{activeBoss.name}</h2>
              <div className="aaa-dossier-subtitle">{activeBoss.title}</div>

              {activeSubmapDef && (
                <div className="vwm-dossier-geo-badge">
                  <span>{activeSubmapDef.shortName}</span>
                  <span>•</span>
                  <strong>{activeGcNode?.landmarkName ?? activeBoss.landmarkName}</strong>
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
                  <span className="aaa-metric-lbl">ESPÓLIO</span>
                  <span className="aaa-metric-val gold-text">
                    +{activeBoss.rewardGold} Ouro
                    {activeBoss.rewardShards ? ` • +${activeBoss.rewardShards} Est.` : ''}
                  </span>
                </div>
                <div className="aaa-metric-box">
                  <span className="aaa-metric-lbl">ESTRADA</span>
                  <span className="aaa-metric-val">
                    {isActiveDefeated
                      ? '✓ VENCIDO'
                      : isActiveAccessible
                        ? 'ACESSÍVEL'
                        : '🔒 BLOQUEADO'}
                  </span>
                </div>
              </div>

              {activeBoss.rewardCardIds && activeBoss.rewardCardIds.length > 0 && (
                <div className="aaa-dossier-passive-panel">
                  <div className="aaa-passive-kicker">
                    CARTA(S) LIBERADA(S) AO VENCER
                  </div>
                  <div className="aaa-dossier-reward-cards-row">
                    {activeBoss.rewardCardIds.map((cid) => {
                      const rc = CARDS_BY_ID[cid];
                      if (!rc) return null;
                      return (
                        <button
                          key={cid}
                          type="button"
                          className="aaa-reward-card-chip"
                          onClick={() => setInspectCard(rc)}
                          title="Clique para inspecionar a carta"
                        >
                          <span>
                            {rc.rarity === 'legendary' ? '♛' : '◈'} {rc.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="aaa-dossier-passive-panel">
                <div className="aaa-passive-kicker">
                  PASSIVA • {activeBoss.passiveName.toUpperCase()}
                </div>
                <p className="aaa-passive-desc">{activeBoss.passiveDescription}</p>
              </div>

              <div className="aaa-dossier-actions">
                <button
                  type="button"
                  className="aaa-btn aaa-btn-primary aaa-btn-lg"
                  disabled={!isActiveAccessible}
                  onClick={() => handleClickStartBoss(activeBoss)}
                >
                  {!isActiveAccessible
                    ? '🔒 Bloqueado pela Estrada Anterior'
                    : isActiveDefeated
                      ? 'Reenfrentar Soberano'
                      : 'Desafiar Soberano'}
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
                    Carta
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
