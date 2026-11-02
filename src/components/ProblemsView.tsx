import React, { useMemo, useState } from 'react';
import { CARDS_BY_ID } from '../data/cards';
import {
  getProblemHistoryMap,
  getSolvedProblemIds,
  isProblemTierUnlocked,
  PROBLEM_DIFFICULTY_META,
  PROBLEM_TIERS_ORDER,
  ProblemDifficultyTier,
  ProblemHistoryEntry,
  TACTICAL_PROBLEMS,
  TacticalProblem,
} from '../data/problems';
import {
  claimDailyQuestReward,
  DAILY_PROBLEM_BONUS_GOLD,
  DailyStateData,
  getDailyState,
} from '../utils/dailyQuestsEngine';
import { CardDefinition } from '../types/game';
import { DOMAIN_META } from './CardView';

export interface ProblemsViewProps {
  onSelectProblem: (problem: TacticalProblem) => void;
  onInspectCard?: (card: CardDefinition) => void;
  onRewardGold?: (amount: number, reason: string) => void;
}

type HistoryFilterType = 'all' | 'pending' | 'failed' | 'solved' | 'first_try';

export const ProblemsView: React.FC<ProblemsViewProps> = ({ onSelectProblem, onRewardGold }) => {
  const [selectedTier, setSelectedTier] = useState<'all' | ProblemDifficultyTier>('iniciante');
  const [historyFilter, setHistoryFilter] = useState<HistoryFilterType>('all');
  const [solvedIds] = useState<string[]>(() => getSolvedProblemIds());
  const [historyMap] = useState<Record<string, ProblemHistoryEntry>>(() =>
    getProblemHistoryMap()
  );
  const [dailyState, setDailyState] = useState<DailyStateData>(() => getDailyState());
  const [isDailyPanelMinimized, setIsDailyPanelMinimized] = useState<boolean>(true);

  const solvedSet = useMemo(() => new Set(solvedIds), [solvedIds]);

  const dailyProblem = useMemo(
    () =>
      TACTICAL_PROBLEMS.find((p) => p.id === dailyState.dailyProblemId) ?? TACTICAL_PROBLEMS[0],
    [dailyState.dailyProblemId]
  );

  const completedQuestsCount = useMemo(
    () => dailyState.quests.filter((q) => q.progress >= q.target).length,
    [dailyState.quests]
  );

  const unclaimedCompletedCount = useMemo(
    () => dailyState.quests.filter((q) => q.progress >= q.target && !q.claimed).length,
    [dailyState.quests]
  );

  const handleClaimQuest = (questId: string) => {
    const { state, claimedQuest } = claimDailyQuestReward(questId);
    setDailyState({ ...state });
    if (claimedQuest && onRewardGold) {
      onRewardGold(claimedQuest.goldReward, `Contrato Diário: ${claimedQuest.title}`);
    }
  };

  const tierProgress = useMemo(() => {
    return PROBLEM_TIERS_ORDER.map((tier, idx) => {
      const problemsInTier = TACTICAL_PROBLEMS.filter((p) => p.difficulty === tier);
      const solvedCount = problemsInTier.filter((p) => solvedSet.has(p.id)).length;
      const unlocked = isProblemTierUnlocked(tier, solvedIds);
      const prevTier = idx > 0 ? PROBLEM_TIERS_ORDER[idx - 1] : null;
      return {
        tier,
        meta: PROBLEM_DIFFICULTY_META[tier],
        total: problemsInTier.length,
        solvedCount,
        unlocked,
        isCompleted: solvedCount === problemsInTier.length && problemsInTier.length > 0,
        prevTierLabel: prevTier ? PROBLEM_DIFFICULTY_META[prevTier].label : null,
      };
    });
  }, [solvedIds, solvedSet]);

  const nextTrailProblem = useMemo(() => {
    for (const p of TACTICAL_PROBLEMS) {
      if (!solvedSet.has(p.id) && isProblemTierUnlocked(p.difficulty, solvedIds)) {
        return p;
      }
    }
    return TACTICAL_PROBLEMS[0] ?? null;
  }, [solvedIds, solvedSet]);

  const filteredProblems = useMemo(() => {
    return TACTICAL_PROBLEMS.filter((p) => {
      if (selectedTier !== 'all' && p.difficulty !== selectedTier) return false;
      const entry = historyMap[p.id];
      const isSolved = solvedSet.has(p.id);
      if (historyFilter === 'pending') return !isSolved;
      if (historyFilter === 'failed') return (entry?.failures ?? 0) > 0;
      if (historyFilter === 'solved') return isSolved;
      if (historyFilter === 'first_try') return Boolean(isSolved && entry?.solvedOnFirstTry);
      return true;
    });
  }, [selectedTier, historyFilter, historyMap, solvedSet]);

  return (
    <div className="aaa-page-shell">
      {/* Single-Row Clean Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          flexWrap: 'wrap',
          padding: '10px 14px',
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(148, 163, 184, 0.12)',
          borderRadius: 10,
        }}
      >
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            type="button"
            className={`nav-tab-btn ${selectedTier === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedTier('all')}
            style={{
              padding: '5px 10px',
              fontSize: '0.76rem',
              textTransform: 'none',
              letterSpacing: '0.01em',
            }}
          >
            Todos ({solvedIds.length}/{TACTICAL_PROBLEMS.length})
          </button>

          {tierProgress.map((tp) => {
            const isSelected = selectedTier === tp.tier;
            const cleanTierLabel = tp.meta.label
              .split('•')[0]
              .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
              .trim();
            return (
              <button
                key={tp.tier}
                type="button"
                className={`nav-tab-btn ${isSelected ? 'active' : ''}`}
                onClick={() => setSelectedTier(tp.tier)}
                style={{
                  padding: '5px 10px',
                  fontSize: '0.76rem',
                  textTransform: 'none',
                  letterSpacing: '0.01em',
                  opacity: tp.unlocked ? 1 : 0.55,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <span>{cleanTierLabel}</span>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                  {tp.solvedCount}/{tp.total}
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <select
            aria-label="Filtrar situação"
            className="myth-select-compact"
            value={historyFilter}
            onChange={(e) => setHistoryFilter(e.target.value as HistoryFilterType)}
          >
            <option value="all">Todos os estados</option>
            <option value="pending">Pendentes</option>
            <option value="solved">Resolvidos ({solvedIds.length})</option>
          </select>

          <button
            type="button"
            className={`aaa-pill-tab ${!isDailyPanelMinimized ? 'is-active' : ''}`}
            onClick={() => setIsDailyPanelMinimized((prev) => !prev)}
          >
            Diárias ({completedQuestsCount}/3)
            {unclaimedCompletedCount > 0 ? ` · +${unclaimedCompletedCount}` : ''}
          </button>

          {nextTrailProblem && (
            <button
              type="button"
              className="btn-fantasy btn-fantasy-primary"
              style={{ padding: '5px 12px', fontSize: '0.76rem', textTransform: 'none' }}
              onClick={() => onSelectProblem(nextTrailProblem)}
            >
              Continuar #{String(nextTrailProblem.number).padStart(2, '0')}
            </button>
          )}
        </div>
      </div>

      {/* Collapsible Daily Quests Drawer (only when toggled open) */}
      {!isDailyPanelMinimized && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(235px, 1fr))',
            gap: 8,
            padding: '10px 12px',
            background: '#0b0f17',
            border: '1px solid rgba(148, 163, 184, 0.18)',
            borderRadius: 8,
          }}
        >
          {dailyProblem && (
            <div
              style={{
                background: '#101520',
                border: '1px solid rgba(212, 175, 55, 0.32)',
                borderRadius: 6,
                padding: '8px 10px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 6,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 6,
                }}
              >
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#e6c875' }}>
                  PROBLEMA DO DIA (#{String(dailyProblem.number).padStart(2, '0')})
                </span>
                <span style={{ fontSize: '0.66rem', fontWeight: 700, color: '#94a3b8' }}>
                  {dailyState.dailyProblemBonusClaimed
                    ? '+3 Ouro Ganho'
                    : `+${DAILY_PROBLEM_BONUS_GOLD} Ouro`}
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f1f5f9' }}>
                {dailyProblem.title}
              </div>
              <button
                type="button"
                className="aaa-btn aaa-btn-secondary"
                onClick={() => onSelectProblem(dailyProblem)}
                style={{ padding: '4px 9px', fontSize: '0.72rem' }}
              >
                Jogar #{dailyProblem.number}
              </button>
            </div>
          )}

          {dailyState.quests.map((q) => {
            const isDone = q.progress >= q.target;
            return (
              <div
                key={q.id}
                style={{
                  background: '#0e131d',
                  border:
                    isDone && !q.claimed
                      ? '1px solid rgba(212, 175, 55, 0.5)'
                      : '1px solid rgba(148, 163, 184, 0.16)',
                  borderRadius: 6,
                  padding: '8px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 5,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 6,
                  }}
                >
                  <span style={{ fontSize: '0.73rem', fontWeight: 800, color: '#e2e8f0' }}>
                    {q.title} ({q.progress}/{q.target})
                  </span>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#e6c875' }}>
                    {q.claimed ? 'Concluído' : `+${q.goldReward} Ouro`}
                  </span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', lineHeight: 1.3 }}>
                  {q.description}
                </div>
                {isDone && !q.claimed && (
                  <button
                    type="button"
                    className="aaa-btn aaa-btn-primary"
                    onClick={() => handleClaimQuest(q.id)}
                    style={{ padding: '3px 9px', fontSize: '0.68rem', alignSelf: 'flex-end' }}
                  >
                    Resgatar +{q.goldReward}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Grandmaster Champions Showcase Strip */}
      {selectedTier === 'campeoes_torneio' && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: 8,
            background:
              'linear-gradient(135deg, rgba(30, 27, 75, 0.72), rgba(15, 23, 42, 0.92))',
            border: '1px solid rgba(250, 204, 21, 0.45)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            fontSize: '0.78rem',
            color: '#e2e8f0',
          }}
        >
          <div>
            <strong className="font-cinzel" style={{ color: '#fde047', marginRight: 6 }}>
              Problemas dos Grão-Soberanos (#111–#116):
            </strong>
            <span>
              Quebra-cabeças letais em 1 turno inspirados nas sequências de combate dos
              Grão-Soberanos de Vaeloria. Desbloqueados desde o início.
            </span>
          </div>
          <span
            style={{
              padding: '3px 9px',
              borderRadius: 999,
              background: 'rgba(234, 179, 8, 0.14)',
              border: '1px solid rgba(250, 204, 21, 0.35)',
              color: '#fde68a',
              fontWeight: 700,
              fontSize: '0.7rem',
            }}
          >
            +12 Ouro cada
          </span>
        </div>
      )}

      {/* Empty Filter State */}
      {filteredProblems.length === 0 && (
        <div
          style={{
            padding: '24px',
            textAlign: 'center',
            borderRadius: 8,
            background: '#0b0f17',
            border: '1px solid rgba(148, 163, 184, 0.18)',
            color: '#94a3b8',
            fontSize: '0.84rem',
          }}
        >
          Nenhum problema encontrado para este filtro.
        </div>
      )}

      {/* Clean Clickable Problems Grid (Zero Title Truncation, Zero Emoji Clutter) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
          gap: 10,
        }}
      >
        {filteredProblems.map((prob) => {
          const isSolved = solvedSet.has(prob.id);
          const isTierUnlocked = isProblemTierUnlocked(prob.difficulty, solvedIds);
          const domMeta = DOMAIN_META[prob.primaryDomain];
          const avatarCard = CARDS_BY_ID[prob.p1AvatarCardId];

          return (
            <div
              key={prob.id}
              onClick={() => {
                if (isTierUnlocked) onSelectProblem(prob);
              }}
              style={{
                background: '#0b0f19',
                border: !isTierUnlocked
                  ? '1px dashed rgba(148, 163, 184, 0.12)'
                  : isSolved
                    ? '1px solid rgba(212, 175, 55, 0.38)'
                    : '1px solid rgba(148, 163, 184, 0.12)',
                borderRadius: 8,
                padding: '11px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                opacity: isTierUnlocked ? 1 : 0.5,
                cursor: isTierUnlocked ? 'pointer' : 'not-allowed',
                transition: 'border-color 0.15s ease, background 0.15s ease',
              }}
            >
              {avatarCard?.imagePath && (
                <img
                  src={avatarCard.imagePath}
                  alt={prob.title}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 6,
                    objectFit: 'cover',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    flexShrink: 0,
                    filter: isTierUnlocked ? 'none' : 'grayscale(0.8)',
                  }}
                />
              )}

              <div style={{ minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 6,
                    marginBottom: 3,
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      fontSize: '0.72rem',
                      color: '#94a3b8',
                    }}
                  >
                    <i
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: domMeta.color,
                        display: 'inline-block',
                      }}
                    />
                    <span>
                      #{String(prob.number).padStart(2, '0')} · {domMeta.shortName}
                    </span>
                  </span>

                  {!isTierUnlocked ? (
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Bloqueado</span>
                  ) : isSolved ? (
                    <span style={{ fontSize: '0.72rem', color: '#e6c875', fontWeight: 600 }}>
                      Resolvido
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.72rem', color: '#e6c875' }}>
                      +{prob.goldReward} Ouro
                    </span>
                  )}
                </div>

                <div
                  style={{
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    color: '#f1f5f9',
                    lineHeight: 1.32,
                  }}
                >
                  {prob.title}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
