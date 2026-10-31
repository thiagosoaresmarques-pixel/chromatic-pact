import React, { useState, useMemo, useEffect } from 'react';
import { TACTICAL_PROBLEMS, TacticalProblem } from '../data/problems';
import { CAMPAIGN_BOSSES } from '../data/decks';
import { loadDraftRunState } from '../data/vaeloriaDraftData';
import { getWeeklyFeaturedRift } from '../data/fractureRiftsData';
import {
  claimDailyQuestReward,
  DAILY_PROBLEM_BONUS_GOLD,
  DailyStateData,
  getDailyState,
} from '../utils/dailyQuestsEngine';
import { playSfx } from '../utils/soundEngine';
import { SovereignRelicSelectorBar } from './SovereignRelicSelectorBar';

const ROYAL_STRIP_COLLAPSED_KEY = 'chromatic_pact_royal_strip_collapsed_v1';

export type RoyalQuickDestination =
  | 'campaign'
  | 'expedition'
  | 'conquest'
  | 'draft'
  | 'rifts'
  | 'packs'
  | 'deckbuilder';

export interface SovereignRoyalCommandStripProps {
  isGuest: boolean;
  username: string;
  gold: number;
  astralShards: number;
  defeatedBossCount: number;
  arenaWins: number;
  onNavigate: (dest: RoyalQuickDestination) => void;
  onStartDailyProblem: (problem: TacticalProblem) => void;
  onClaimQuestGold: (amount: number, questTitle: string) => void;
  onOpenAccountModal: () => void;
}

export const SovereignRoyalCommandStrip: React.FC<SovereignRoyalCommandStripProps> = ({
  isGuest,
  username,
  gold,
  astralShards,
  defeatedBossCount,
  arenaWins,
  onNavigate,
  onStartDailyProblem,
  onClaimQuestGold,
  onOpenAccountModal,
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ROYAL_STRIP_COLLAPSED_KEY) === '1';
    } catch {
      return false;
    }
  });

  const [dailyState, setDailyState] = useState<DailyStateData>(() => getDailyState());

  useEffect(() => {
    setDailyState(getDailyState());
  }, [gold, arenaWins, defeatedBossCount]);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(ROYAL_STRIP_COLLAPSED_KEY, next ? '1' : '0');
      } catch {
        // Ignore storage error
      }
      return next;
    });
  };

  const dailyProblem = useMemo(
    () =>
      TACTICAL_PROBLEMS.find((p) => p.id === dailyState.dailyProblemId) ?? TACTICAL_PROBLEMS[0],
    [dailyState.dailyProblemId]
  );

  const claimableCount = useMemo(
    () => dailyState.quests.filter((q) => q.progress >= q.target && !q.claimed).length,
    [dailyState.quests]
  );

  const completedQuestsCount = useMemo(
    () => dailyState.quests.filter((q) => q.claimed || q.progress >= q.target).length,
    [dailyState.quests]
  );

  const savedRunsSummary = useMemo(() => {
    const draft = loadDraftRunState();
    let conquestSeason: number | null = null;
    let expeditionStageCount: number | null = null;

    try {
      const cqRaw = localStorage.getItem('chromatic_pact_conquest_v1');
      if (cqRaw) {
        const parsed = JSON.parse(cqRaw) as { phase?: string; season?: number };
        if (parsed?.phase === 'war_room' && typeof parsed.season === 'number') {
          conquestSeason = parsed.season;
        }
      }
    } catch {
      // Ignore
    }

    try {
      const expRaw = localStorage.getItem('chromatic_pact_expedition_v1');
      if (expRaw) {
        const parsed = JSON.parse(expRaw) as { phase?: string; clearedStages?: number[] };
        if (parsed?.phase && parsed.phase !== 'blessing') {
          expeditionStageCount = Array.isArray(parsed.clearedStages)
            ? parsed.clearedStages.length
            : 0;
        }
      }
    } catch {
      // Ignore
    }

    return {
      draft,
      conquestSeason,
      expeditionStageCount,
      weeklyRift: getWeeklyFeaturedRift(),
    };
  }, []);

  const handleClaimQuest = (questId: string) => {
    if (isGuest) {
      onOpenAccountModal();
      return;
    }
    const { state: nextDaily, claimedQuest } = claimDailyQuestReward(questId);
    setDailyState(nextDaily);
    if (claimedQuest) {
      playSfx('victory');
      onClaimQuestGold(claimedQuest.goldReward, claimedQuest.title);
    }
  };

  return (
    <section className={`royal-command-strip ${collapsed ? 'is-collapsed' : ''}`}>
      <div className="rcs-topbar">
        <div className="rcs-title-group">
          <span className="rcs-crown">👑</span>
          <span className="font-cinzel rcs-kicker">
            {isGuest ? 'COMANDO REAL • MODO VISITANTE' : `COMANDO REAL • ${username.toUpperCase()}`}
          </span>
          {claimableCount > 0 && (
            <span className="rcs-alert-pill">
              🔔 {claimableCount} Decreto(s) Pronto(s)!
            </span>
          )}
          {collapsed && (
            <span className="rcs-collapsed-meta hide-on-mobile">
              Missões {completedQuestsCount}/3 • Campanha {defeatedBossCount}/{CAMPAIGN_BOSSES.length} •{' '}
              {savedRunsSummary.weeklyRift.icon} Fenda: {savedRunsSummary.weeklyRift.name}
            </span>
          )}
        </div>

        <div className="rcs-topbar-right">
          {!isGuest ? (
            <>
              <span className="rcs-currency-chip gold" title="Saldo de Ouro Real">
                🪙 <strong>{gold.toLocaleString('pt-BR')}</strong>
              </span>
              <span className="rcs-currency-chip shards" title="Estilhaços Astrais para Forja de Cartas">
                💎 <strong>{astralShards.toLocaleString('pt-BR')}</strong>
              </span>
              {gold >= 30 && (
                <button
                  type="button"
                  className="rcs-mini-cta is-gold"
                  onClick={() => onNavigate('packs')}
                  title="Você tem Ouro suficiente para abrir um pacote no Relicário (30 Ouro)"
                >
                  🎁 Abrir Pacote
                </button>
              )}
            </>
          ) : (
            <button
              type="button"
              className="rcs-mini-cta is-gold"
              onClick={onOpenAccountModal}
            >
              ✨ Criar Conta (+160 🪙)
            </button>
          )}

          <button
            type="button"
            className="rcs-collapse-btn"
            onClick={toggleCollapsed}
            title={collapsed ? 'Expandir painel Comando Real' : 'Recolher painel Comando Real'}
          >
            {collapsed ? '▼ Expandir' : '▲ Ocultar'}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="rcs-body-grid">
          {/* COLUMN 1: 1-CLICK JOURNEY RESUME */}
          <div className="rcs-col">
            <div className="rcs-col-header">
              <span>🗺️ CONTINUAR JORNADA (1 CLIQUE)</span>
            </div>
            <div className="rcs-resume-pills">
              <button
                type="button"
                className="rcs-resume-btn"
                onClick={() => onNavigate('campaign')}
              >
                <span>🏰 Campanha</span>
                <strong>{defeatedBossCount}/{CAMPAIGN_BOSSES.length}</strong>
              </button>

              <button
                type="button"
                className="rcs-resume-btn"
                onClick={() => onNavigate('draft')}
              >
                <span>⚖️ Crisol</span>
                <strong>
                  {savedRunsSummary.draft.phase === 'gauntlet'
                    ? `${savedRunsSummary.draft.wins}V/${savedRunsSummary.draft.losses}D`
                    : savedRunsSummary.draft.phase === 'drafting'
                    ? `${savedRunsSummary.draft.round}/20`
                    : 'Draft'}
                </strong>
              </button>

              <button
                type="button"
                className="rcs-resume-btn is-rift"
                onClick={() => onNavigate('rifts')}
                title={`Fenda Semanal: ${savedRunsSummary.weeklyRift.name} — ${savedRunsSummary.weeklyRift.shortRule}`}
              >
                <span>{savedRunsSummary.weeklyRift.icon} Fendas</span>
                <strong>Semanal</strong>
              </button>

              <button
                type="button"
                className="rcs-resume-btn"
                onClick={() => onNavigate('conquest')}
              >
                <span>🗺️ Conquista</span>
                <strong>
                  {savedRunsSummary.conquestSeason
                    ? `Est. ${savedRunsSummary.conquestSeason}`
                    : '30 Prov.'}
                </strong>
              </button>

              {savedRunsSummary.expeditionStageCount !== null && (
                <button
                  type="button"
                  className="rcs-resume-btn"
                  onClick={() => onNavigate('expedition')}
                >
                  <span>🧭 Expedição</span>
                  <strong>{savedRunsSummary.expeditionStageCount}/9</strong>
                </button>
              )}
            </div>
          </div>

          {/* COLUMN 2: DAILY DECREES & DAILY PROBLEM */}
          <div className="rcs-col rcs-col-quests">
            <div className="rcs-col-header">
              <span>📜 DECRETOS DIÁRIOS ({completedQuestsCount}/3)</span>
              <button
                type="button"
                className={`rcs-daily-prob-btn ${
                  dailyState.dailyProblemSolvedToday ? 'is-solved' : ''
                }`}
                onClick={() => onStartDailyProblem(dailyProblem)}
                title={`${dailyProblem.code}: ${dailyProblem.title}`}
              >
                ♟️ Problema do Dia{' '}
                {dailyState.dailyProblemSolvedToday
                  ? '✓'
                  : `(+${DAILY_PROBLEM_BONUS_GOLD}🪙)`}
              </button>
            </div>

            <div className="rcs-quests-list">
              {dailyState.quests.map((q) => {
                const isReadyToClaim = q.progress >= q.target && !q.claimed;
                return (
                  <div
                    key={q.id}
                    className={`rcs-quest-chip ${q.claimed ? 'is-claimed' : ''} ${
                      isReadyToClaim ? 'is-ready' : ''
                    }`}
                    title={q.description}
                  >
                    <span className="rcs-q-icon">{q.icon}</span>
                    <div className="rcs-q-copy">
                      <span className="rcs-q-title">{q.title}</span>
                      <small className="rcs-q-prog">
                        {q.progress}/{q.target} • +{q.goldReward}🪙
                      </small>
                    </div>
                    {isReadyToClaim ? (
                      <button
                        type="button"
                        className="rcs-q-claim-btn"
                        onClick={() => handleClaimQuest(q.id)}
                      >
                        Resgatar
                      </button>
                    ) : q.claimed ? (
                      <span className="rcs-q-done">✓</span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          {/* COLUMN 3: CROWN RELIC & FORGE SHORTCUT */}
          <div className="rcs-col rcs-col-relic">
            <div className="rcs-col-header">
              <span>👑 RELÍQUIA & FORJA</span>
            </div>
            <div className="rcs-relic-actions">
              <SovereignRelicSelectorBar
                defeatedBossCount={defeatedBossCount}
                arenaWins={arenaWins}
              />
              <button
                type="button"
                className="rcs-mini-cta"
                onClick={() => onNavigate('deckbuilder')}
                title="Abrir Grimório e Forja de Cartas com Estilhaços Astrais"
              >
                ⚒️ Forjar no Grimório
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
