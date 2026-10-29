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
      {/* Single Compact Toolbar: 5-Grau Tabs + Filter Pills + Daily Toggle + Continue */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          flexWrap: 'wrap',
          padding: '8px 12px',
          background: '#0b0f17',
          border: '1px solid rgba(148, 163, 184, 0.18)',
          borderRadius: 8,
        }}
      >
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`nav-tab-btn ${selectedTier === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedTier('all')}
            style={{ padding: '4px 9px', fontSize: '0.72rem' }}
          >
            Todos ({solvedIds.length}/{TACTICAL_PROBLEMS.length})
          </button>

          {tierProgress.map((tp) => {
            const isSelected = selectedTier === tp.tier;
            return (
              <button
                key={tp.tier}
                type="button"
                className={`nav-tab-btn ${isSelected ? 'active' : ''}`}
                onClick={() => setSelectedTier(tp.tier)}
                style={{
                  padding: '4px 9px',
                  fontSize: '0.72rem',
                  opacity: tp.unlocked ? 1 : 0.6,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <span>{tp.isCompleted ? '✓' : tp.unlocked ? '•' : '🔒'}</span>
                <span>{tp.meta.label.split('•')[0].trim()}</span>
                <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                  ({tp.solvedCount}/{tp.total})
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
          {(
            [
              { id: 'all', label: 'Todos' },
              { id: 'pending', label: `Pendentes` },
              { id: 'solved', label: `Resolvidos (${solvedIds.length})` },
            ] as { id: HistoryFilterType; label: string }[]
          ).map((hf) => {
            const active = historyFilter === hf.id;
            return (
              <button
                key={hf.id}
                type="button"
                className={`aaa-pill-tab ${active ? 'is-active' : ''}`}
                onClick={() => setHistoryFilter(hf.id)}
              >
                {hf.label}
              </button>
            );
          })}

          <button
            type="button"
            className={`aaa-pill-tab ${!isDailyPanelMinimized ? 'is-active' : ''}`}
            onClick={() => setIsDailyPanelMinimized((prev) => !prev)}
          >
            Diárias ({completedQuestsCount}/3)
            {unclaimedCompletedCount > 0 ? ` • +${unclaimedCompletedCount}` : ''}
          </button>

          {nextTrailProblem && (
            <button
              type="button"
              className="aaa-btn aaa-btn-primary"
              style={{ padding: '4px 10px', fontSize: '0.72rem' }}
              onClick={() => onSelectProblem(nextTrailProblem)}
            >
              ⚔️ Continuar #{String(nextTrailProblem.number).padStart(2, '0')}
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

      {/* Clean Clickable Problems Grid (No redundant buttons or micro-text) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 8,
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
                background: '#0b0f17',
                border: !isTierUnlocked
                  ? '1px dashed rgba(148, 163, 184, 0.14)'
                  : isSolved
                    ? '1px solid rgba(212, 175, 55, 0.42)'
                    : '1px solid rgba(148, 163, 184, 0.18)',
                borderRadius: 8,
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                opacity: isTierUnlocked ? 1 : 0.55,
                cursor: isTierUnlocked ? 'pointer' : 'not-allowed',
                transition: 'border-color 0.15s ease, background 0.15s ease',
              }}
            >
              {avatarCard?.imagePath && (
                <img
                  src={avatarCard.imagePath}
                  alt={prob.title}
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 6,
                    objectFit: 'cover',
                    border: '1px solid rgba(212, 175, 55, 0.28)',
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
                    marginBottom: 2,
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      color: '#94a3b8',
                    }}
                  >
                    #{String(prob.number).padStart(2, '0')} • {domMeta.shortName}
                  </span>

                  {!isTierUnlocked ? (
                    <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>
                      🔒
                    </span>
                  ) : isSolved ? (
                    <span style={{ fontSize: '0.7rem', color: '#e6c875', fontWeight: 800 }}>
                      ✓
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.68rem', color: '#e6c875', fontWeight: 700 }}>
                      +{prob.goldReward} Ouro
                    </span>
                  )}
                </div>

                <div
                  style={{
                    fontSize: '0.84rem',
                    fontFamily: 'Cinzel, serif',
                    fontWeight: 800,
                    color: '#f1f5f9',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  title={prob.title}
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
