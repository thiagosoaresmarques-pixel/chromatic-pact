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
  recordProblemHintUsed,
  TACTICAL_PROBLEMS,
  TacticalProblem,
} from '../data/problems';
import {
  claimDailyQuestReward,
  DAILY_PROBLEM_BONUS_GOLD,
  DailyStateData,
  getDailyState,
  getTimeUntilNextDailyReset,
  recordDailyProblemAttemptResult,
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
  const [historyMap, setHistoryMap] = useState<Record<string, ProblemHistoryEntry>>(() =>
    getProblemHistoryMap()
  );
  const [dailyState, setDailyState] = useState<DailyStateData>(() => getDailyState());
  const [isDailyPanelMinimized, setIsDailyPanelMinimized] = useState<boolean>(false);
  const [expandedHintId, setExpandedHintId] = useState<string | null>(null);

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

  const historyStats = useMemo(() => {
    const entries = Object.values(historyMap);
    const totalAttempts = entries.reduce((acc, e) => acc + e.attempts, 0);
    const totalFailures = entries.reduce((acc, e) => acc + e.failures, 0);
    const totalFirstTry = entries.filter((e) => e.solved && e.solvedOnFirstTry).length;
    const problemsWithErrors = TACTICAL_PROBLEMS.filter(
      (p) => (historyMap[p.id]?.failures ?? 0) > 0
    ).length;
    const accuracyPct =
      totalAttempts > 0
        ? Math.round(((totalAttempts - totalFailures) / totalAttempts) * 100)
        : 100;

    return {
      totalAttempts,
      totalFailures,
      totalFirstTry,
      problemsWithErrors,
      accuracyPct,
    };
  }, [historyMap]);

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

  const totalGoldAvailable = useMemo(
    () => TACTICAL_PROBLEMS.reduce((acc, p) => acc + p.goldReward, 0),
    []
  );

  const earnedGold = useMemo(
    () =>
      TACTICAL_PROBLEMS.filter((p) => solvedSet.has(p.id)).reduce(
        (acc, p) => acc + p.goldReward,
        0
      ),
    [solvedSet]
  );

  return (
    <div
      style={{
        maxWidth: 1380,
        margin: '0 auto',
        padding: '14px 16px 48px',
        color: '#f8fafc',
      }}
    >
      {/* Compact Header Strip */}
      <div
        style={{
          background:
            'radial-gradient(circle at 15% 20%, rgba(234, 179, 8, 0.14), rgba(15, 23, 42, 0.95) 70%)',
          border: '1px solid rgba(250, 204, 21, 0.32)',
          borderRadius: 12,
          padding: '12px 16px',
          marginBottom: 10,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  fontSize: '1.1rem',
                  fontFamily: 'Cinzel, serif',
                  fontWeight: 900,
                  color: '#fef08a',
                }}
              >
                ♟️ 100 Problemas Táticos (Xeque-Mate em 1T)
              </span>
              <span
                style={{
                  fontSize: '0.7rem',
                  padding: '2px 8px',
                  borderRadius: 999,
                  background: 'rgba(250, 204, 21, 0.14)',
                  border: '1px solid rgba(250, 204, 21, 0.4)',
                  color: '#fde047',
                  fontWeight: 800,
                }}
              >
                Trilha Progressiva (20/20 por Grau)
              </span>
            </div>
            <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: 2 }}>
              Sem spoilers no enunciado: analise a mesa e encontre o letal em 1 turno (use 💡 Dica apenas se precisar).
            </div>
          </div>

          {nextTrailProblem && (
            <button
              type="button"
              onClick={() => onSelectProblem(nextTrailProblem)}
              style={{
                padding: '7px 13px',
                borderRadius: 8,
                border: '1px solid rgba(250, 204, 21, 0.85)',
                background: 'linear-gradient(135deg, #facc15, #ca8a04)',
                color: '#0f172a',
                fontWeight: 900,
                fontSize: '0.78rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              ▶️ Continuar: #{String(nextTrailProblem.number).padStart(2, '0')} {nextTrailProblem.title}
            </button>
          )}
        </div>

        {/* Inline Compact KPIs */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(74, 222, 128, 0.35)',
              borderRadius: 8,
              padding: '5px 10px',
              fontSize: '0.75rem',
            }}
          >
            <span style={{ color: '#94a3b8' }}>Resolvidos: </span>
            <strong style={{ color: '#4ade80' }}>
              {solvedIds.length}/{TACTICAL_PROBLEMS.length}
            </strong>
          </div>
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              borderRadius: 8,
              padding: '5px 10px',
              fontSize: '0.75rem',
            }}
          >
            <span style={{ color: '#94a3b8' }}>De 1ª s/ Dica: </span>
            <strong style={{ color: '#38bdf8' }}>🏆 {historyStats.totalFirstTry}</strong>
          </div>
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(248, 113, 113, 0.35)',
              borderRadius: 8,
              padding: '5px 10px',
              fontSize: '0.75rem',
            }}
          >
            <span style={{ color: '#94a3b8' }}>Erros: </span>
            <strong style={{ color: '#f87171' }}>
              ❌ {historyStats.totalFailures} ({historyStats.accuracyPct}%)
            </strong>
          </div>
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(250, 204, 21, 0.38)',
              borderRadius: 8,
              padding: '5px 10px',
              fontSize: '0.75rem',
            }}
          >
            <span style={{ color: '#94a3b8' }}>Ouro: </span>
            <strong style={{ color: '#facc15' }}>
              🪙 {earnedGold}/{totalGoldAvailable}
            </strong>
          </div>
        </div>
      </div>

      {/* Collapsible Daily Problem & 3 Daily Quests Strip */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.88)',
          border: '1px solid rgba(56, 189, 248, 0.32)',
          borderRadius: 11,
          padding: isDailyPanelMinimized ? '7px 14px' : '10px 14px',
          marginBottom: 12,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 900, color: '#7dd3fc' }}>
              🎯 PROBLEMA DO DIA & CONTRATOS DIÁRIOS ({completedQuestsCount}/3 concluídos)
            </span>
            {unclaimedCompletedCount > 0 && (
              <span
                style={{
                  padding: '1px 8px',
                  borderRadius: 999,
                  background: 'rgba(34, 197, 94, 0.22)',
                  border: '1px solid rgba(74, 222, 128, 0.6)',
                  color: '#4ade80',
                  fontSize: '0.68rem',
                  fontWeight: 900,
                }}
              >
                🎁 {unclaimedCompletedCount} Recompensa(s) para Resgatar!
              </span>
            )}
            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
              ⏱️ Renova em {getTimeUntilNextDailyReset()}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsDailyPanelMinimized((prev) => !prev)}
            style={{
              padding: '4px 10px',
              borderRadius: 7,
              border: '1px solid rgba(148, 163, 184, 0.3)',
              background: 'rgba(30, 41, 59, 0.8)',
              color: '#cbd5e1',
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            {isDailyPanelMinimized ? '▾ Mostrar Diárias' : '▴ Ocultar'}
          </button>
        </div>

        {!isDailyPanelMinimized && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(235px, 1fr))',
              gap: 8,
              marginTop: 9,
            }}
          >
            {/* Card 0: Problema Tático do Dia */}
            {dailyProblem && (
              <div
                style={{
                  background:
                    'linear-gradient(135deg, rgba(234, 179, 8, 0.14), rgba(15, 23, 42, 0.95))',
                  border: '1px solid rgba(250, 204, 21, 0.48)',
                  borderRadius: 9,
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
                  <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#fde047' }}>
                    🎯 PROBLEMA DO DIA (#{String(dailyProblem.number).padStart(2, '0')})
                  </span>
                  <span
                    style={{
                      fontSize: '0.66rem',
                      fontWeight: 900,
                      color: dailyState.dailyProblemBonusClaimed
                        ? '#4ade80'
                        : dailyState.dailyProblemFailedToday || dailyState.dailyProblemHintUsedToday
                          ? '#94a3b8'
                          : '#fde047',
                    }}
                  >
                    {dailyState.dailyProblemBonusClaimed
                      ? '🏆 +3🪙 GANHO'
                      : dailyState.dailyProblemFailedToday || dailyState.dailyProblemHintUsedToday
                        ? 'Sem bônus de 1ª hoje'
                        : `🪙 +${DAILY_PROBLEM_BONUS_GOLD} Bônus (1ª s/ Dica)`}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f8fafc' }}>
                  {dailyProblem.title}{' '}
                  <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600 }}>
                    ({PROBLEM_DIFFICULTY_META[dailyProblem.difficulty].starsText})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectProblem(dailyProblem)}
                  style={{
                    padding: '5px 9px',
                    borderRadius: 6,
                    border: '1px solid rgba(250, 204, 21, 0.7)',
                    background: 'rgba(250, 204, 21, 0.2)',
                    color: '#fef08a',
                    fontWeight: 900,
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                  }}
                >
                  {dailyState.dailyProblemSolvedToday
                    ? `✅ Rejogar Problema do Dia (#${dailyProblem.number})`
                    : `▶️ Jogar Problema do Dia (#${dailyProblem.number})`}
                </button>
              </div>
            )}

            {/* 3 Contratos Diários */}
            {dailyState.quests.map((q) => {
              const isDone = q.progress >= q.target;
              return (
                <div
                  key={q.id}
                  style={{
                    background: 'rgba(2, 6, 23, 0.75)',
                    border: q.claimed
                      ? '1px solid rgba(74, 222, 128, 0.35)'
                      : isDone
                        ? '1.5px solid rgba(250, 204, 21, 0.75)'
                        : '1px solid rgba(148, 163, 184, 0.22)',
                    borderRadius: 9,
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
                    <span style={{ fontSize: '0.74rem', fontWeight: 900, color: '#e2e8f0' }}>
                      {q.icon} {q.title}
                    </span>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 900,
                        color: q.claimed ? '#4ade80' : '#facc15',
                      }}
                    >
                      {q.claimed ? '✅ Resgatado' : `🪙 +${q.goldReward}`}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', lineHeight: 1.3 }}>
                    {q.description}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        color: isDone ? '#4ade80' : '#cbd5e1',
                      }}
                    >
                      Progresso: {q.progress}/{q.target}
                    </span>
                    {isDone && !q.claimed && (
                      <button
                        type="button"
                        onClick={() => handleClaimQuest(q.id)}
                        style={{
                          padding: '3px 9px',
                          borderRadius: 6,
                          border: '1px solid rgba(250, 204, 21, 0.85)',
                          background: 'linear-gradient(135deg, #facc15, #ca8a04)',
                          color: '#0f172a',
                          fontWeight: 900,
                          fontSize: '0.7rem',
                          cursor: 'pointer',
                        }}
                      >
                        🪙 Resgatar +{q.goldReward}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Compact 5-Grau Progressive Strip + Status Filters */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          flexWrap: 'wrap',
          marginBottom: 12,
        }}
      >
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setSelectedTier('all')}
            style={{
              padding: '6px 11px',
              borderRadius: 8,
              border:
                selectedTier === 'all'
                  ? '1.5px solid #facc15'
                  : '1px solid rgba(148, 163, 184, 0.25)',
              background:
                selectedTier === 'all'
                  ? 'rgba(250, 204, 21, 0.16)'
                  : 'rgba(15, 23, 42, 0.8)',
              color: selectedTier === 'all' ? '#fef08a' : '#cbd5e1',
              fontWeight: 800,
              fontSize: '0.74rem',
              cursor: 'pointer',
            }}
          >
            Todos (100)
          </button>

          {tierProgress.map((tp) => {
            const isSelected = selectedTier === tp.tier;
            return (
              <button
                key={tp.tier}
                type="button"
                onClick={() => setSelectedTier(tp.tier)}
                style={{
                  padding: '6px 11px',
                  borderRadius: 8,
                  border: isSelected
                    ? `1.5px solid ${tp.meta.color}`
                    : tp.unlocked
                      ? `1px solid ${tp.meta.border}`
                      : '1px dashed rgba(148, 163, 184, 0.25)',
                  background: isSelected
                    ? tp.meta.bg
                    : tp.unlocked
                      ? 'rgba(15, 23, 42, 0.85)'
                      : 'rgba(15, 23, 42, 0.5)',
                  color: isSelected ? tp.meta.color : tp.unlocked ? '#e2e8f0' : '#94a3b8',
                  fontWeight: 800,
                  fontSize: '0.74rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>{tp.isCompleted ? '✅' : tp.unlocked ? '🔓' : '🔒'}</span>
                <span>{tp.meta.label}</span>
                <span
                  style={{
                    padding: '1px 6px',
                    borderRadius: 999,
                    background: 'rgba(0,0,0,0.4)',
                    fontSize: '0.68rem',
                    color: tp.isCompleted ? '#4ade80' : tp.meta.color,
                  }}
                >
                  {tp.solvedCount}/{tp.total}
                </span>
              </button>
            );
          })}
        </div>

        {/* History Filter Pills */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {(
            [
              { id: 'all', label: '📋 Todos' },
              { id: 'pending', label: `⏳ Pendentes (${TACTICAL_PROBLEMS.length - solvedIds.length})` },
              { id: 'failed', label: `❌ Com Erros (${historyStats.problemsWithErrors})` },
              { id: 'solved', label: `✅ Resolvidos (${solvedIds.length})` },
              { id: 'first_try', label: `🏆 De 1ª (${historyStats.totalFirstTry})` },
            ] as { id: HistoryFilterType; label: string }[]
          ).map((hf) => {
            const active = historyFilter === hf.id;
            return (
              <button
                key={hf.id}
                type="button"
                onClick={() => setHistoryFilter(hf.id)}
                style={{
                  padding: '5px 10px',
                  borderRadius: 999,
                  border: active
                    ? '1px solid rgba(56, 189, 248, 0.75)'
                    : '1px solid rgba(148, 163, 184, 0.25)',
                  background: active ? 'rgba(56, 189, 248, 0.18)' : 'rgba(15, 23, 42, 0.75)',
                  color: active ? '#7dd3fc' : '#94a3b8',
                  fontWeight: 800,
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                }}
              >
                {hf.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Empty Filter State */}
      {filteredProblems.length === 0 && (
        <div
          style={{
            padding: '24px',
            textAlign: 'center',
            borderRadius: 12,
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(148, 163, 184, 0.25)',
            color: '#94a3b8',
            fontSize: '0.84rem',
          }}
        >
          Nenhum problema encontrado para este filtro.
        </div>
      )}

      {/* Compact Spoiler-Free Problems Grid (Fits 4-5 per row on Desktop) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(252px, 1fr))',
          gap: 10,
        }}
      >
        {filteredProblems.map((prob) => {
          const isSolved = solvedSet.has(prob.id);
          const isDaily = prob.id === dailyState.dailyProblemId;
          const entry = historyMap[prob.id];
          const isTierUnlocked = isProblemTierUnlocked(prob.difficulty, solvedIds);
          const diffMeta = PROBLEM_DIFFICULTY_META[prob.difficulty];
          const domMeta = DOMAIN_META[prob.primaryDomain];
          const avatarCard = CARDS_BY_ID[prob.p1AvatarCardId];
          const isHintOpen = expandedHintId === prob.id;
          const tierIdx = PROBLEM_TIERS_ORDER.indexOf(prob.difficulty);
          const prevTierLabel =
            tierIdx > 0
              ? PROBLEM_DIFFICULTY_META[PROBLEM_TIERS_ORDER[tierIdx - 1]].label.split('•')[0].trim()
              : '';

          return (
            <div
              key={prob.id}
              style={{
                background:
                  'linear-gradient(165deg, rgba(15, 23, 42, 0.94), rgba(9, 13, 24, 0.98))',
                border: !isTierUnlocked
                  ? '1px dashed rgba(148, 163, 184, 0.24)'
                  : isDaily
                    ? '1.5px solid rgba(250, 204, 21, 0.85)'
                    : isSolved
                      ? '1.5px solid rgba(74, 222, 128, 0.5)'
                      : (entry?.failures ?? 0) > 0
                        ? '1.5px solid rgba(248, 113, 113, 0.48)'
                        : `1px solid ${diffMeta.border}`,
                borderRadius: 11,
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 8,
                opacity: isTierUnlocked ? 1 : 0.72,
              }}
            >
              <div>
                {/* Row 1: Compact Code + Stars + Domain + Status Badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 6,
                    marginBottom: 6,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span
                      style={{
                        padding: '2px 6px',
                        borderRadius: 5,
                        background: diffMeta.bg,
                        border: `1px solid ${diffMeta.border}`,
                        color: diffMeta.color,
                        fontSize: '0.66rem',
                        fontWeight: 900,
                      }}
                    >
                      #{String(prob.number).padStart(2, '0')} • {diffMeta.starsText}
                    </span>
                    <span
                      title={`Domínio ${domMeta.name}`}
                      style={{ fontSize: '0.78rem' }}
                    >
                      {domMeta.icon}
                    </span>
                    {isDaily && (
                      <span
                        style={{
                          padding: '1px 5px',
                          borderRadius: 4,
                          background: 'rgba(250, 204, 21, 0.2)',
                          color: '#fde047',
                          fontSize: '0.62rem',
                          fontWeight: 900,
                        }}
                      >
                        🎯 DO DIA
                      </span>
                    )}
                  </div>

                  {!isTierUnlocked ? (
                    <span
                      style={{
                        fontSize: '0.66rem',
                        color: '#94a3b8',
                        fontWeight: 800,
                      }}
                    >
                      🔒 +{prob.goldReward}🪙
                    </span>
                  ) : isSolved ? (
                    <span
                      style={{
                        padding: '1px 7px',
                        borderRadius: 999,
                        background: entry?.solvedOnFirstTry
                          ? 'rgba(56, 189, 248, 0.18)'
                          : 'rgba(34, 197, 94, 0.18)',
                        color: entry?.solvedOnFirstTry ? '#38bdf8' : '#4ade80',
                        fontSize: '0.66rem',
                        fontWeight: 900,
                      }}
                    >
                      {entry?.solvedOnFirstTry ? '🏆 1ª s/ Dica' : '✅ Resolvido'}
                    </span>
                  ) : (entry?.failures ?? 0) > 0 ? (
                    <span
                      style={{
                        padding: '1px 7px',
                        borderRadius: 999,
                        background: 'rgba(239, 68, 68, 0.18)',
                        color: '#fca5a5',
                        fontSize: '0.66rem',
                        fontWeight: 900,
                      }}
                    >
                      ❌ {entry?.failures} erro(s) • +{prob.goldReward}🪙
                    </span>
                  ) : (
                    <span
                      style={{
                        padding: '1px 7px',
                        borderRadius: 999,
                        background: 'rgba(250, 204, 21, 0.14)',
                        color: '#fde047',
                        fontSize: '0.68rem',
                        fontWeight: 900,
                      }}
                    >
                      🪙 +{prob.goldReward}
                    </span>
                  )}
                </div>

                {/* Row 2: Avatar + Clean Title + Compact 1-Line Matchup Stats (ZERO SPOILERS) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  {avatarCard?.imagePath && (
                    <img
                      src={avatarCard.imagePath}
                      alt={prob.title}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        objectFit: 'cover',
                        border: `1px solid ${diffMeta.color}`,
                        flexShrink: 0,
                        filter: isTierUnlocked ? 'none' : 'grayscale(0.7)',
                      }}
                    />
                  )}
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        fontSize: '0.86rem',
                        fontFamily: 'Cinzel, serif',
                        fontWeight: 900,
                        color: '#f8fafc',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      title={prob.title}
                    >
                      {prob.title}
                    </div>
                    <div
                      style={{
                        fontSize: '0.71rem',
                        color: '#94a3b8',
                        marginTop: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 4,
                      }}
                    >
                      <span>
                        T{prob.turnNumber} • ⚡{prob.p1Essence}/{prob.p1MaxEssence} • 🃏{prob.p1HandCardIds.length}
                      </span>
                      <strong style={{ color: '#f87171' }}>🎯 {prob.p2Hp} ❤️</strong>
                    </div>
                  </div>
                </div>

                {/* Optional Hint Preview (Only shown when player clicks 💡 Dica) */}
                {isHintOpen && isTierUnlocked && (
                  <div
                    style={{
                      marginTop: 7,
                      padding: '7px 9px',
                      borderRadius: 8,
                      background: 'rgba(250, 204, 21, 0.1)',
                      border: '1px solid rgba(250, 204, 21, 0.35)',
                      fontSize: '0.72rem',
                      color: '#fef08a',
                      lineHeight: 1.4,
                    }}
                  >
                    <strong>💡 Dica:</strong> {prob.hint1}
                  </div>
                )}
              </div>

              {/* Row 3: Compact Action Buttons */}
              <div style={{ display: 'flex', gap: 6 }}>
                {isTierUnlocked ? (
                  <>
                    <button
                      type="button"
                      onClick={() => onSelectProblem(prob)}
                      style={{
                        flex: 1,
                        padding: '6px 10px',
                        borderRadius: 7,
                        border: '1px solid rgba(250, 204, 21, 0.55)',
                        background:
                          'linear-gradient(135deg, rgba(234, 179, 8, 0.92), rgba(202, 138, 4, 0.95))',
                        color: '#0f172a',
                        fontWeight: 900,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                      }}
                    >
                      {isSolved
                        ? `♟️ Rejogar #${prob.number}`
                        : (entry?.failures ?? 0) > 0
                          ? `🔄 Tentar #${prob.number}`
                          : `♟️ Resolver #${prob.number}`}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!isHintOpen) {
                          const updated = recordProblemHintUsed(prob.id, 1);
                          setHistoryMap((prev) => ({ ...prev, [prob.id]: updated }));
                          const dRes = recordDailyProblemAttemptResult(prob.id, 'hint_used');
                          setDailyState({ ...dRes.state });
                        }
                        setExpandedHintId(isHintOpen ? null : prob.id);
                      }}
                      title="Consultar Dica Conceitual"
                      style={{
                        padding: '6px 9px',
                        borderRadius: 7,
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        background: isHintOpen
                          ? 'rgba(250, 204, 21, 0.22)'
                          : 'rgba(30, 41, 59, 0.85)',
                        color: '#fde047',
                        fontWeight: 800,
                        fontSize: '0.73rem',
                        cursor: 'pointer',
                      }}
                    >
                      {isHintOpen ? '✕' : '💡 Dica'}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    disabled
                    style={{
                      flex: 1,
                      padding: '6px 8px',
                      borderRadius: 7,
                      border: '1px solid rgba(148, 163, 184, 0.22)',
                      background: 'rgba(30, 41, 59, 0.55)',
                      color: '#94a3b8',
                      fontWeight: 800,
                      fontSize: '0.7rem',
                      cursor: 'not-allowed',
                    }}
                  >
                    🔒 Complete 20/20 do {prevTierLabel}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
