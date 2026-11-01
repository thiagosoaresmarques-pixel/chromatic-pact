import React, { useState, useEffect, useMemo, useRef } from 'react';
import { CARDS_BY_ID } from '../data/cards';
import {
  buildDraftGauntletBoss,
  computeDraftRewards,
  createIdleDraftState,
  DRAFT_ENTRY_GOLD_COST,
  DRAFT_MAX_LOSSES,
  DRAFT_MAX_WINS,
  DRAFT_TOTAL_ROUNDS,
  DraftBattleOutcome,
  DraftBucketOption,
  DraftRewardSummary,
  DraftRunState,
  generateDraftRoundBuckets,
  generateSovereignDraftCandidates,
  hasClaimedFreeDraftPass,
  loadDraftRunState,
  markFreeDraftPassClaimed,
  saveDraftRunState,
} from '../data/vaeloriaDraftData';
import { CampaignBoss, CardDefinition, ConquestBattleModifiers, Domain } from '../types/game';
import { getDraftCardPickRating } from '../data/asymmetricAuditData';
import { CardInspectModal, CardView, DOMAIN_META } from './CardView';

const DRAFT_DOMAIN_SORT: Record<Domain, number> = {
  red: 0,
  blue: 1,
  purple: 2,
  green: 3,
  gold: 4,
  neutral: 5,
};
import { SovereignRelicSelectorBar } from './SovereignRelicSelectorBar';
import { recordBestDraftWins } from '../data/sovereignRelics';
import { playSfx } from '../utils/soundEngine';
import { AI_SKILL_TIER_SPECS } from '../data/aiMonocolorMastery';
import { getUnifiedStandingForDeckId } from '../data/aiUnifiedTournament';
import { TacticalGuideView } from './TacticalGuideView';

export interface DraftCrucibleViewProps {
  userId: string;
  gold: number;
  isGuest: boolean;
  defeatedBossCount: number;
  arenaWins: number;
  lastDraftOutcome: DraftBattleOutcome | null;
  onRequireAccount: () => void;
  onSpendEntryGold: (amount: number) => void;
  onStartDraftBattle: (
    boss: CampaignBoss,
    draftedDeckIds: string[],
    modifiers: ConquestBattleModifiers | null
  ) => void;
  onClaimDraftRewards: (reward: DraftRewardSummary) => void;
}

export const DraftCrucibleView: React.FC<DraftCrucibleViewProps> = ({
  userId,
  gold,
  isGuest,
  defeatedBossCount,
  arenaWins,
  lastDraftOutcome,
  onRequireAccount,
  onSpendEntryGold,
  onStartDraftBattle,
  onClaimDraftRewards,
}) => {
  const [runState, setRunState] = useState<DraftRunState>(() => loadDraftRunState());
  const [inspectCard, setInspectCard] = useState<CardDefinition | null>(null);
  const [showDeckDrawer, setShowDeckDrawer] = useState<boolean>(false);
  const [showMatchupModal, setShowMatchupModal] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const processedOutcomeRef = useRef<string | null>(null);

  useEffect(() => {
    saveDraftRunState(runState);
  }, [runState]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    window.setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 3600);
  };

  // Process battle outcome returning from BattleArena
  useEffect(() => {
    if (!lastDraftOutcome) return;
    if (processedOutcomeRef.current === lastDraftOutcome.outcomeId) return;
    processedOutcomeRef.current = lastDraftOutcome.outcomeId;

    setRunState((prev) => {
      if (prev.phase !== 'gauntlet') return prev;
      const nextWins = lastDraftOutcome.didWin ? prev.wins + 1 : prev.wins;
      const nextLosses = lastDraftOutcome.didWin ? prev.losses : prev.losses + 1;
      recordBestDraftWins(nextWins);
      const isFinished = nextWins >= DRAFT_MAX_WINS || nextLosses >= DRAFT_MAX_LOSSES;

      if (isFinished) {
        const reward = computeDraftRewards(nextWins);
        return {
          ...prev,
          wins: nextWins,
          losses: nextLosses,
          phase: 'completed',
          pendingReward: reward,
          rewardsClaimed: false,
        };
      }
      return {
        ...prev,
        wins: nextWins,
        losses: nextLosses,
      };
    });
  }, [lastDraftOutcome]);

  const isFreePassAvailable = !hasClaimedFreeDraftPass(userId);

  const handleEnterCrucible = () => {
    if (!isFreePassAvailable) {
      if (isGuest) {
        onRequireAccount();
        return;
      }
      if (gold < DRAFT_ENTRY_GOLD_COST) {
        showToast(`Ouro insuficiente (${gold}/${DRAFT_ENTRY_GOLD_COST} Ouro).`);
        return;
      }
      onSpendEntryGold(DRAFT_ENTRY_GOLD_COST);
    } else {
      markFreeDraftPassClaimed(userId);
    }

    playSfx('channel');
    const candidates = generateSovereignDraftCandidates();
    setRunState({
      runId: `draft_${Date.now()}`,
      phase: 'pick_sovereign',
      sovereignCandidates: candidates,
      chosenSovereignId: null,
      primaryDomain: 'red',
      round: 1,
      currentBuckets: [],
      draftedCardIds: [],
      wins: 0,
      losses: 0,
      rewardsClaimed: false,
      pendingReward: null,
    });
  };

  const handleChooseSovereign = (cardId: string) => {
    const card = CARDS_BY_ID[cardId];
    if (!card) return;
    playSfx('landmark_discover');
    const dom = card.domain === 'neutral' ? 'red' : card.domain;
    const firstBuckets = generateDraftRoundBuckets(dom, 1, []);
    setRunState((prev) => ({
      ...prev,
      phase: 'drafting',
      chosenSovereignId: card.id,
      primaryDomain: dom,
      round: 1,
      currentBuckets: firstBuckets,
      draftedCardIds: [],
    }));
  };

  const handlePickBucket = (bucket: DraftBucketOption) => {
    playSfx('channel');
    setRunState((prev) => {
      const nextCards = [...prev.draftedCardIds, ...bucket.cardIds];
      if (prev.round >= DRAFT_TOTAL_ROUNDS || nextCards.length >= 40) {
        return {
          ...prev,
          draftedCardIds: nextCards.slice(0, 40),
          currentBuckets: [],
          phase: 'gauntlet',
        };
      }
      const nextRound = prev.round + 1;
      const nextBuckets = generateDraftRoundBuckets(prev.primaryDomain, nextRound, nextCards);
      return {
        ...prev,
        round: nextRound,
        draftedCardIds: nextCards,
        currentBuckets: nextBuckets,
      };
    });
  };

  const handleLaunchGauntletMatch = () => {
    const { boss, modifiers } = buildDraftGauntletBoss(runState.wins, runState.runId);
    const fullDeckIds = runState.chosenSovereignId
      ? [
          runState.chosenSovereignId,
          ...runState.draftedCardIds.filter((id) => id !== runState.chosenSovereignId),
        ].slice(0, 40)
      : runState.draftedCardIds.slice(0, 40);
    onStartDraftBattle(boss, fullDeckIds, modifiers);
  };

  const handleClaimChest = () => {
    if (!runState.pendingReward || runState.rewardsClaimed) return;
    playSfx('victory');
    if (!isGuest) {
      onClaimDraftRewards(runState.pendingReward);
    }
    setRunState(createIdleDraftState());
    showToast(
      isGuest
        ? 'Provação concluída. Crie sua conta gratuita para acumular Ouro e Cartas no seu acervo.'
        : `Recompensas do Crisol resgatadas (+${runState.pendingReward.gold} Ouro + ${runState.pendingReward.bonusCardIds.length} Cartas).`
    );
  };

  const handleRetireRun = () => {
    const reward = computeDraftRewards(runState.wins);
    setRunState((prev) => ({
      ...prev,
      phase: 'completed',
      pendingReward: reward,
      rewardsClaimed: false,
    }));
  };

  const curveCounts = useMemo(() => {
    const bins = [0, 0, 0, 0, 0, 0, 0]; // 1, 2, 3, 4, 5, 6, 7+
    for (const cid of runState.draftedCardIds) {
      const c = CARDS_BY_ID[cid];
      if (!c) continue;
      const idx = Math.max(0, Math.min(6, c.cost - 1));
      bins[idx] += 1;
    }
    return bins;
  }, [runState.draftedCardIds]);

  const maxCurveBin = Math.max(1, ...curveCounts);
  const sortedDraftedCards = useMemo(() => {
    return runState.draftedCardIds
      .map((cid) => CARDS_BY_ID[cid])
      .filter((c): c is CardDefinition => Boolean(c))
      .sort(
        (a, b) =>
          DRAFT_DOMAIN_SORT[a.domain] - DRAFT_DOMAIN_SORT[b.domain] ||
          a.cost - b.cost ||
          a.name.localeCompare(b.name, 'pt-BR')
      );
  }, [runState.draftedCardIds]);
  const chosenSovereignCard = runState.chosenSovereignId
    ? CARDS_BY_ID[runState.chosenSovereignId]
    : undefined;
  const nextPreview = useMemo(
    () => buildDraftGauntletBoss(runState.wins, runState.runId),
    [runState.wins, runState.runId]
  );
  const nextStanding = useMemo(
    () =>
      getUnifiedStandingForDeckId(
        nextPreview.boss.archetypeId ?? nextPreview.boss.deckId
      ),
    [nextPreview.boss.archetypeId, nextPreview.boss.deckId]
  );
  const nextTierSpec =
    AI_SKILL_TIER_SPECS[nextPreview.boss.difficultyTier ?? 3];

  return (
    <div className="aaa-page-shell draft-crucible-shell">
      {toastMsg && <div className="aaa-toast-banner">{toastMsg}</div>}

      {/* =====================================================================
          PHASE 0: CRUCIBLE LOBBY
          ===================================================================== */}
      {runState.phase === 'idle' && (
        <div className="draft-lobby-card">
          <div className="draft-lobby-header">
            <div>
              <span className="vwm-territory-kicker">
                ARENA SELADA COMPETITIVA • 20 ESCOLHAS • ATÉ 7 VITÓRIAS
              </span>
              <h2
                className="font-cinzel gold-gradient-text"
                style={{ margin: '4px 0 6px', fontSize: '1.45rem' }}
              >
                Crisol dos Cinco Selos
              </h2>
              <p style={{ margin: 0, fontSize: '0.84rem', color: '#cbd5e1', maxWidth: 740, lineHeight: 1.5 }}>
                Entre de mãos vazias na forja planar: escolha <strong>1 Soberano Lendário entre 3</strong> e forje um Grimório tático inédito de <strong>40 cartas</strong> ao longo de <strong>20 escolhas de pares sinérgicos</strong>. Em seguida, enfrente desafiantes crescentes até conquistar <strong>7 Vitórias</strong> (ou sofrer 3 derrotas).
              </p>
            </div>

            <SovereignRelicSelectorBar
              defeatedBossCount={defeatedBossCount}
              arenaWins={arenaWins}
            />
          </div>

          <div className="draft-prize-tiers-grid">
            <div className="draft-tier-box">
              <strong>0–1 Vitórias</strong>
              <span>25 Ouro + 1 Carta</span>
            </div>
            <div className="draft-tier-box">
              <strong>2–3 Vitórias</strong>
              <span>65 Ouro + 1 Rara+</span>
            </div>
            <div className="draft-tier-box is-profit">
              <strong>4–5 Vitórias</strong>
              <span>125 Ouro + 2 Raras+</span>
            </div>
            <div className="draft-tier-box is-profit">
              <strong>6 Vitórias</strong>
              <span>185 Ouro + 3 Cartas (1 Lenda)</span>
            </div>
            <div className="draft-tier-box is-grand">
              <strong>7 Vitórias</strong>
              <span>260 Ouro + 4 Cartas (1 Lenda)</span>
            </div>
          </div>

          <div className="draft-lobby-cta-row">
            <button
              type="button"
              className="aaa-btn aaa-btn-primary"
              style={{ padding: '10px 22px', fontSize: '0.88rem' }}
              onClick={handleEnterCrucible}
            >
              {isFreePassAvailable
                ? 'Entrar no Crisol (1º Passe Grátis)'
                : `Forjar Nova Entrada (${DRAFT_ENTRY_GOLD_COST} Ouro)`}
            </button>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              {isGuest
                ? 'Visitantes têm 1 Passe Demonstrativo Grátis. Crie uma conta gratuita para guardar Ouro e Cartas!'
                : `Seu saldo atual: ${gold.toLocaleString('pt-BR')} Ouro`}
            </span>
          </div>
        </div>
      )}

      {/* =====================================================================
          PHASE 1: PICK 1 OF 3 LEGENDARY SOVEREIGNS
          ===================================================================== */}
      {runState.phase === 'pick_sovereign' && (
        <div className="draft-stage-panel">
          <div className="draft-stage-topbar">
            <div>
              <span className="vwm-territory-kicker">ETAPA 1 DE 2 • ESCOLHA SEU SOBERANO</span>
              <h3 className="font-cinzel gold-gradient-text" style={{ margin: '2px 0 0', fontSize: '1.22rem' }}>
                Qual Lenda Liderará seu Pacto no Crisol?
              </h3>
            </div>
          </div>

          <div className="draft-sovereign-grid">
            {runState.sovereignCandidates.map((cid) => {
              const card = CARDS_BY_ID[cid];
              if (!card) return null;
              const dom = DOMAIN_META[card.domain];
              return (
                <div
                  key={cid}
                  className="draft-sovereign-option"
                  style={{ borderColor: `${dom.color}66` }}
                >
                  <div className="draft-card-preview-wrap">
                    <CardView
                      card={card}
                      mode="gallery"
                      onInspect={(c) => setInspectCard(c)}
                    />
                  </div>
                  <div className="draft-sov-meta">
                    <span style={{ color: dom.color, fontSize: '0.7rem', fontWeight: 800 }}>
                      {dom.icon} Domínio Principal: {dom.name}
                    </span>
                    <button
                      type="button"
                      className="aaa-btn aaa-btn-primary"
                      style={{ width: '100%' }}
                      onClick={() => handleChooseSovereign(cid)}
                    >
                      Jurar Pacto a {card.name.split(',')[0]}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          PHASE 2: 20-ROUND SYNERGISTIC BUCKET FORGE (40 CARDS)
          ===================================================================== */}
      {runState.phase === 'drafting' && (
        <div className="draft-stage-panel">
          <div className="draft-stage-topbar">
            <div>
              <span className="vwm-territory-kicker">
                FORJA DO CRISOL • ESCOLHA {runState.round} DE {DRAFT_TOTAL_ROUNDS} ({runState.draftedCardIds.length}/40 CARTAS)
              </span>
              <h3 className="font-cinzel gold-gradient-text" style={{ margin: '2px 0 0', fontSize: '1.15rem' }}>
                Escolha 1 Par Sinérgico para integrar ao seu Grimório
              </h3>
            </div>

            <div className="draft-curve-and-drawer">
              <div className="draft-mini-curve" title="Curva de Essência (Custos 1 a 7+)">
                {curveCounts.map((cnt, idx) => (
                  <div key={idx} className="dmc-col">
                    <div className="dmc-bar-track">
                      <div
                        className="dmc-bar-fill"
                        style={{ height: `${Math.round((cnt / maxCurveBin) * 100)}%` }}
                      />
                    </div>
                    <span>{idx === 6 ? '7+' : idx + 1}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="aaa-btn aaa-btn-secondary"
                onClick={() => setShowDeckDrawer((v) => !v)}
              >
                Ver Grimório ({runState.draftedCardIds.length}/40)
              </button>
            </div>
          </div>

          {showDeckDrawer && (
            <div className="draft-deck-drawer">
              {sortedDraftedCards.length === 0 ? (
                <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                  Nenhuma carta escolhida ainda.
                </span>
              ) : (
                sortedDraftedCards.map((c, i) => (
                  <button
                    key={`${c.id}_${i}`}
                    type="button"
                    className="draft-drawer-chip"
                    onClick={() => setInspectCard(c)}
                  >
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        background: DOMAIN_META[c.domain].color,
                        flexShrink: 0,
                      }}
                    />
                    <span className="ddc-cost">{c.cost}⚡</span>
                    <span>{c.name}</span>
                  </button>
                ))
              )}
            </div>
          )}

          <div className="draft-buckets-grid">
            {runState.currentBuckets.map((bucket) => {
              const c1 = CARDS_BY_ID[bucket.cardIds[0]];
              const c2 = CARDS_BY_ID[bucket.cardIds[1]];
              if (!c1 || !c2) return null;
              const p1 = getDraftCardPickRating(c1.id);
              const p2 = getDraftCardPickRating(c2.id);
              const avgScore = Math.round((p1.score + p2.score) / 2);
              const renderPickPill = (p: ReturnType<typeof getDraftCardPickRating>) => {
                const bg =
                  p.tier === 'S'
                    ? 'rgba(250, 204, 21, 0.22)'
                    : p.tier === 'A'
                    ? 'rgba(56, 189, 248, 0.2)'
                    : p.tier === 'B'
                    ? 'rgba(148, 163, 184, 0.18)'
                    : 'rgba(100, 116, 139, 0.16)';
                const fg =
                  p.tier === 'S'
                    ? '#fde047'
                    : p.tier === 'A'
                    ? '#7dd3fc'
                    : p.tier === 'B'
                    ? '#e2e8f0'
                    : '#94a3b8';
                const bd =
                  p.tier === 'S'
                    ? 'rgba(250, 204, 21, 0.6)'
                    : p.tier === 'A'
                    ? 'rgba(56, 189, 248, 0.5)'
                    : 'rgba(148, 163, 184, 0.35)';
                return (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginBottom: '4px',
                      padding: '1px 7px',
                      borderRadius: '999px',
                      background: bg,
                      border: `1px solid ${bd}`,
                      color: fg,
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                    }}
                    title={`Avaliação no Crisol: Grau ${p.tier} · Afinidade ${p.score.toFixed(1)}`}
                  >
                    <span>Grau {p.tier}</span>
                    <span style={{ opacity: 0.8 }}>({Math.round(p.score)})</span>
                  </div>
                );
              };
              return (
                <div key={bucket.id} className="draft-bucket-card">
                  <div
                    className="draft-bucket-title"
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}
                  >
                    <span>{bucket.label}</span>
                    <span
                      style={{
                        fontSize: '0.64rem',
                        color: avgScore >= 70 ? '#fde047' : '#cbd5e1',
                        fontWeight: 800,
                      }}
                    >
                      Sinergia {avgScore}
                    </span>
                  </div>
                  <div className="draft-bucket-pair">
                    <div className="draft-bucket-slot" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      {renderPickPill(p1)}
                      <CardView
                        card={c1}
                        mode="gallery"
                        onInspect={(c) => setInspectCard(c)}
                      />
                    </div>
                    <div className="draft-bucket-slot" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      {renderPickPill(p2)}
                      <CardView
                        card={c2}
                        mode="gallery"
                        onInspect={(c) => setInspectCard(c)}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="aaa-btn aaa-btn-primary"
                    style={{ width: '100%' }}
                    onClick={() => handlePickBucket(bucket)}
                  >
                    + Escolher Par (+2 Cartas)
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          PHASE 3: GAUNTLET PROVING GROUNDS (UP TO 7 WINS OR 3 LOSSES)
          ===================================================================== */}
      {runState.phase === 'gauntlet' && (
        <div className="draft-gauntlet-panel">
          <div className="draft-stage-topbar">
            <div>
              <span className="vwm-territory-kicker">
                ARENA DO CRISOL • DECK FORJADO (40 CARTAS)
              </span>
              <h3 className="font-cinzel gold-gradient-text" style={{ margin: '2px 0 0', fontSize: '1.25rem' }}>
                Provação dos Sete Selos — {runState.wins}V / {runState.losses}D
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <SovereignRelicSelectorBar
                defeatedBossCount={defeatedBossCount}
                arenaWins={arenaWins}
              />
              <button
                type="button"
                className="aaa-btn aaa-btn-secondary"
                onClick={() => setShowDeckDrawer((v) => !v)}
              >
                Grimório ({runState.draftedCardIds.length})
              </button>
            </div>
          </div>

          <div className="draft-record-track">
            <div className="drt-group">
              <span className="drt-label">SELOS DE VITÓRIA ({runState.wins}/7)</span>
              <div className="drt-pips">
                {Array.from({ length: DRAFT_MAX_WINS }).map((_, idx) => (
                  <span
                    key={idx}
                    className={`drt-pip win ${idx < runState.wins ? 'is-lit' : ''}`}
                  >
                    {idx < runState.wins ? '✦' : idx + 1}
                  </span>
                ))}
              </div>
            </div>

            <div className="drt-group">
              <span className="drt-label">FRATURAS ({runState.losses}/3)</span>
              <div className="drt-pips">
                {Array.from({ length: DRAFT_MAX_LOSSES }).map((_, idx) => (
                  <span
                    key={idx}
                    className={`drt-pip loss ${idx < runState.losses ? 'is-lit' : ''}`}
                  >
                    {idx < runState.losses ? '✕' : '○'}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {showDeckDrawer && (
            <div className="draft-deck-drawer">
              {sortedDraftedCards.map((c, i) => (
                <button
                  key={`${c.id}_${i}`}
                  type="button"
                  className="draft-drawer-chip"
                  onClick={() => setInspectCard(c)}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: DOMAIN_META[c.domain].color,
                      flexShrink: 0,
                    }}
                  />
                  <span className="ddc-cost">{c.cost}⚡</span>
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          )}

          <div className="draft-matchup-card">
            <div className="dmc-side">
              {chosenSovereignCard?.imagePath && (
                <img
                  src={chosenSovereignCard.imagePath}
                  alt={chosenSovereignCard.name}
                  className="conquest-faction-avatar"
                />
              )}
              <div>
                <span className="vwm-territory-kicker">SEU PORTADOR</span>
                <strong className="font-cinzel" style={{ display: 'block', color: '#fef08a' }}>
                  {chosenSovereignCard?.name ?? 'Soberano do Crisol'}
                </strong>
                <small style={{ color: '#94a3b8' }}>40 Cartas Forjadas</small>
              </div>
            </div>

            <div className="dmc-vs font-cinzel">VS</div>

            <div className="dmc-side">
              {CARDS_BY_ID[nextPreview.boss.avatarCardId]?.imagePath && (
                <img
                  src={CARDS_BY_ID[nextPreview.boss.avatarCardId].imagePath}
                  alt={nextPreview.boss.name}
                  className="conquest-faction-avatar"
                />
              )}
              <div>
                <span className="vwm-territory-kicker">{nextPreview.boss.title.toUpperCase()}</span>
                <strong className="font-cinzel" style={{ display: 'block', color: '#fca5a5' }}>
                  {nextPreview.boss.name} ({nextPreview.boss.startingHp} PV)
                </strong>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '6px',
                    margin: '4px 0',
                    fontSize: '0.72rem',
                  }}
                >
                  <span
                    style={{
                      padding: '2px 7px',
                      borderRadius: '6px',
                      background: 'rgba(15, 23, 42, 0.85)',
                      border: '1px solid rgba(212, 175, 55, 0.35)',
                      color: '#fde68a',
                      fontWeight: 700,
                    }}
                    title={nextTierSpec.description}
                  >
                    Grau {nextTierSpec.roman} ({nextTierSpec.title})
                  </span>
                  {nextStanding && (
                    <span style={{ color: '#94a3b8', fontWeight: 600 }}>
                      · #{nextStanding.rank} no Ranking · {nextStanding.name}
                    </span>
                  )}
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                    {nextPreview.boss.domains.map((dom) => (
                      <span
                        key={dom}
                        title={DOMAIN_META[dom].name}
                        style={{
                          width: 9,
                          height: 9,
                          borderRadius: '50%',
                          backgroundColor: DOMAIN_META[dom].color,
                          border: '1px solid rgba(255,255,255,0.45)',
                          display: 'inline-block',
                        }}
                      />
                    ))}
                  </span>
                </div>
                <small style={{ color: '#cbd5e1', display: 'block' }}>
                  {nextPreview.boss.passiveName}: {nextPreview.boss.passiveDescription}
                </small>
              </div>
            </div>
          </div>

          <div className="draft-lobby-cta-row">
            <button
              type="button"
              className="aaa-btn aaa-btn-primary"
              style={{ padding: '10px 24px', fontSize: '0.9rem' }}
              onClick={handleLaunchGauntletMatch}
            >
              Iniciar {runState.wins + 1}ª Batalha do Crisol
            </button>
            <button
              type="button"
              className="aaa-btn aaa-btn-secondary"
              onClick={() => setShowMatchupModal(true)}
              title="Abrir dossiê tático do Oráculo de Guerra contra este Soberano"
            >
              Matchup
            </button>
            <button
              type="button"
              className="aaa-btn aaa-btn-ghost"
              onClick={handleRetireRun}
              title="Encerrar jornada atual e resgatar recompensas proporcionais às suas vitórias"
            >
              Encerrar e Resgatar ({runState.wins}V)
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          PHASE 4: COMPLETED RUN REWARD CHEST
          ===================================================================== */}
      {runState.phase === 'completed' && runState.pendingReward && (
        <div className="draft-lobby-card">
          <span className="vwm-territory-kicker">
            JORNADA ENCERRADA • PLACAR FINAL: {runState.wins} VITÓRIAS / {runState.losses} DERROTAS
          </span>
          <h2 className="font-cinzel gold-gradient-text" style={{ margin: '4px 0 6px', fontSize: '1.38rem' }}>
            {runState.pendingReward.tierTitle}
          </h2>
          <p style={{ margin: 0, fontSize: '0.84rem', color: '#cbd5e1' }}>
            Recompensa conquistada: <strong style={{ color: '#fde047' }}>+{runState.pendingReward.gold} Ouro</strong> e{' '}
            <strong>+{runState.pendingReward.bonusCardIds.length} Cartas</strong> integradas ao seu acervo!
          </p>

          <div className="draft-reward-cards-row">
            {runState.pendingReward.bonusCardIds.map((cid, idx) => {
              const card = CARDS_BY_ID[cid];
              if (!card) return null;
              return (
                <div key={`${cid}_${idx}`} className="draft-reward-card-cell">
                  <CardView
                    card={card}
                    mode="gallery"
                    onInspect={(c) => setInspectCard(c)}
                  />
                </div>
              );
            })}
          </div>

          <div>
            <button
              type="button"
              className="aaa-btn aaa-btn-primary"
              style={{ padding: '10px 24px', fontSize: '0.9rem' }}
              onClick={handleClaimChest}
            >
              Resgatar Espólios do Crisol
            </button>
          </div>
        </div>
      )}

      {showMatchupModal && (
        <TacticalGuideView
          initialOpponentDeckId={nextPreview.boss.archetypeId ?? nextPreview.boss.deckId}
          initialViewSection="matchup_duel"
          isModal={true}
          onClose={() => setShowMatchupModal(false)}
        />
      )}

      {inspectCard && (
        <CardInspectModal card={inspectCard} onClose={() => setInspectCard(null)} />
      )}
    </div>
  );
};
