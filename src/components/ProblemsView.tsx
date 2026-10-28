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
import { CardDefinition } from '../types/game';
import { DOMAIN_META } from './CardView';

export interface ProblemsViewProps {
  onSelectProblem: (problem: TacticalProblem) => void;
  onInspectCard?: (card: CardDefinition) => void;
}

type HistoryFilterType = 'all' | 'pending' | 'failed' | 'solved' | 'first_try';

export const ProblemsView: React.FC<ProblemsViewProps> = ({ onSelectProblem }) => {
  const [selectedTier, setSelectedTier] = useState<'all' | ProblemDifficultyTier>('all');
  const [historyFilter, setHistoryFilter] = useState<HistoryFilterType>('all');
  const [solvedIds] = useState<string[]>(() => getSolvedProblemIds());
  const [historyMap] = useState<Record<string, ProblemHistoryEntry>>(() => getProblemHistoryMap());
  const [expandedHintId, setExpandedHintId] = useState<string | null>(null);

  const solvedSet = useMemo(() => new Set(solvedIds), [solvedIds]);

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

  // Próximo problema recomendado na trilha progressiva (primeiro não resolvido de um Grau desbloqueado)
  const nextTrailProblem = useMemo(() => {
    for (const p of TACTICAL_PROBLEMS) {
      if (!solvedSet.has(p.id) && isProblemTierUnlocked(p.difficulty, solvedIds)) {
        return p;
      }
    }
    return TACTICAL_PROBLEMS[0] ?? null;
  }, [solvedIds, solvedSet]);

  // Estatísticas globais do Histórico do Jogador
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

  const tiers: {
    id: 'all' | ProblemDifficultyTier;
    label: string;
    count: number;
    stars?: string;
    unlocked: boolean;
  }[] = [
    {
      id: 'all',
      label: 'Todos os Graus',
      count: TACTICAL_PROBLEMS.length,
      unlocked: true,
    },
    {
      id: 'iniciante',
      label: 'Grau I • Iniciante (2🪙)',
      count: 20,
      stars: '★☆☆☆☆',
      unlocked: isProblemTierUnlocked('iniciante', solvedIds),
    },
    {
      id: 'intermediario',
      label: 'Grau II • Intermediário (3🪙)',
      count: 20,
      stars: '★★☆☆☆',
      unlocked: isProblemTierUnlocked('intermediario', solvedIds),
    },
    {
      id: 'avancado',
      label: 'Grau III • Avançado (5🪙)',
      count: 20,
      stars: '★★★☆☆',
      unlocked: isProblemTierUnlocked('avancado', solvedIds),
    },
    {
      id: 'mestre',
      label: 'Grau IV • Mestre (7🪙)',
      count: 20,
      stars: '★★★★☆',
      unlocked: isProblemTierUnlocked('mestre', solvedIds),
    },
    {
      id: 'grao_mestre',
      label: 'Grau V • Grão-Mestre (10🪙)',
      count: 20,
      stars: '★★★★★',
      unlocked: isProblemTierUnlocked('grao_mestre', solvedIds),
    },
  ];

  return (
    <div
      style={{
        maxWidth: 1340,
        margin: '0 auto',
        padding: '24px 20px 64px',
        color: '#f8fafc',
      }}
    >
      {/* Hero Banner */}
      <div
        style={{
          background:
            'radial-gradient(circle at 18% 20%, rgba(234, 179, 8, 0.18), rgba(15, 23, 42, 0.96) 65%)',
          border: '1px solid rgba(250, 204, 21, 0.38)',
          borderRadius: 18,
          padding: '24px 28px',
          marginBottom: 18,
          boxShadow: '0 20px 48px rgba(0, 0, 0, 0.55)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
        }}
      >
        <div style={{ maxWidth: 680 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 12px',
              borderRadius: 999,
              background: 'rgba(250, 204, 21, 0.16)',
              border: '1px solid rgba(250, 204, 21, 0.45)',
              color: '#fde047',
              fontSize: '0.74rem',
              fontWeight: 900,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 10,
            }}
          >
            ♟️ TRILHA PROGRESSIVA • 100 PROBLEMAS TÁTICOS (ZERO RNG)
          </div>
          <h1
            style={{
              margin: '0 0 8px',
              fontSize: 'clamp(1.4rem, 2.3vw, 2.02rem)',
              fontFamily: 'Cinzel, serif',
              fontWeight: 900,
              color: '#fef08a',
              textShadow: '0 2px 12px rgba(0,0,0,0.7)',
            }}
          >
            {TACTICAL_PROBLEMS.length} Desafios de Xeque-Mate em 1 Único Turno
          </h1>
          <p
            style={{
              margin: '0 0 14px',
              fontSize: '0.9rem',
              lineHeight: 1.55,
              color: '#cbd5e1',
            }}
          >
            Inspirado nos problemas de Xadrez: a mesa, a mão, a Essência (⚡) e as Afinidades começam travadas num
            cenário determinístico. Complete todos os <strong style={{ color: '#fde047' }}>20 problemas de cada Grau</strong>{' '}
            para destravar o Grau seguinte! Se errar um exercício, você pode tentar novamente na hora ou pular para o
            próximo problema do mesmo Grau e voltar depois.
          </p>

          {nextTrailProblem && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => onSelectProblem(nextTrailProblem)}
                style={{
                  padding: '10px 18px',
                  borderRadius: 10,
                  border: '1px solid rgba(250, 204, 21, 0.85)',
                  background: 'linear-gradient(135deg, #facc15, #ca8a04)',
                  color: '#0f172a',
                  fontWeight: 900,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  boxShadow: '0 8px 22px rgba(234, 179, 8, 0.35)',
                }}
              >
                ▶️ CONTINUAR TRILHA: {nextTrailProblem.code} — {nextTrailProblem.title}
              </button>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700 }}>
                ({PROBLEM_DIFFICULTY_META[nextTrailProblem.difficulty].label})
              </span>
            </div>
          )}
        </div>

        {/* Player History & Gold Summary Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(148px, 1fr))',
            gap: 12,
          }}
        >
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.88)',
              border: '1px solid rgba(74, 222, 128, 0.35)',
              borderRadius: 14,
              padding: '12px 16px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>
              Resolvidos
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#4ade80', marginTop: 3 }}>
              {solvedIds.length} / {TACTICAL_PROBLEMS.length}
            </div>
          </div>

          <div
            style={{
              background: 'rgba(15, 23, 42, 0.88)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              borderRadius: 14,
              padding: '12px 16px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.68rem', color: '#7dd3fc', fontWeight: 800, textTransform: 'uppercase' }}>
              De 1ª (Sem Dica)
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#38bdf8', marginTop: 3 }}>
              🏆 {historyStats.totalFirstTry}
            </div>
          </div>

          <div
            style={{
              background: 'rgba(15, 23, 42, 0.88)',
              border: '1px solid rgba(248, 113, 113, 0.35)',
              borderRadius: 14,
              padding: '12px 16px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.68rem', color: '#fca5a5', fontWeight: 800, textTransform: 'uppercase' }}>
              Erros / Precisão
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#f87171', marginTop: 4 }}>
              ❌ {historyStats.totalFailures} • {historyStats.accuracyPct}%
            </div>
          </div>

          <div
            style={{
              background: 'rgba(15, 23, 42, 0.88)',
              border: '1px solid rgba(250, 204, 21, 0.38)',
              borderRadius: 14,
              padding: '12px 16px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.68rem', color: '#fde047', fontWeight: 800, textTransform: 'uppercase' }}>
              Ouro Conquistado
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#facc15', marginTop: 3 }}>
              🪙 {earnedGold} / {totalGoldAvailable}
            </div>
          </div>
        </div>
      </div>

      {/* Trilha Progressiva por Grau (5 Graus de 20 Problemas) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 12,
          marginBottom: 18,
        }}
      >
        {tierProgress.map((tp) => {
          const pct = tp.total > 0 ? Math.round((tp.solvedCount / tp.total) * 100) : 0;
          const isSelected = selectedTier === tp.tier;
          return (
            <div
              key={tp.tier}
              onClick={() => setSelectedTier(isSelected ? 'all' : tp.tier)}
              style={{
                background: tp.unlocked
                  ? 'linear-gradient(160deg, rgba(15, 23, 42, 0.92), rgba(2, 6, 23, 0.95))'
                  : 'rgba(15, 23, 42, 0.55)',
                border: isSelected
                  ? `2px solid ${tp.meta.color}`
                  : tp.unlocked
                    ? `1px solid ${tp.meta.border}`
                    : '1px dashed rgba(148, 163, 184, 0.25)',
                borderRadius: 14,
                padding: '12px 14px',
                cursor: 'pointer',
                opacity: tp.unlocked ? 1 : 0.72,
                transition: 'all 0.16s ease',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 6,
                  marginBottom: 6,
                }}
              >
                <span style={{ fontSize: '0.78rem', fontWeight: 900, color: tp.meta.color }}>
                  {tp.meta.label}
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 900,
                    color: tp.isCompleted ? '#4ade80' : tp.unlocked ? '#e2e8f0' : '#94a3b8',
                  }}
                >
                  {tp.isCompleted
                    ? '✅ 20/20'
                    : tp.unlocked
                      ? `🔓 ${tp.solvedCount}/${tp.total}`
                      : `🔒 ${tp.solvedCount}/${tp.total}`}
                </span>
              </div>

              {/* Barra de Progresso do Grau */}
              <div
                style={{
                  height: 7,
                  borderRadius: 999,
                  background: 'rgba(2, 6, 23, 0.85)',
                  overflow: 'hidden',
                  border: '1px solid rgba(148, 163, 184, 0.18)',
                  marginBottom: 6,
                }}
              >
                <div
                  style={{
                    width: `${pct}%`,
                    height: '100%',
                    background: tp.isCompleted ? '#4ade80' : tp.meta.color,
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>

              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                {tp.isCompleted
                  ? 'Grau dominado! Próximo Grau liberado.'
                  : tp.unlocked
                    ? `Faltam ${tp.total - tp.solvedCount} para liberar o próximo Grau`
                    : `Complete 20/20 do ${tp.prevTierLabel?.split('•')[0].trim()} para abrir`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Bars: Tier + Player History */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
          marginBottom: 20,
        }}
      >
        {/* Difficulty Filter Bar */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {tiers.map((t) => {
            const isActive = selectedTier === t.id;
            const meta = t.id !== 'all' ? PROBLEM_DIFFICULTY_META[t.id] : null;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTier(t.id)}
                style={{
                  padding: '8px 13px',
                  borderRadius: 10,
                  border: isActive
                    ? `1.5px solid ${meta?.color ?? '#facc15'}`
                    : '1px solid rgba(148, 163, 184, 0.25)',
                  background: isActive
                    ? meta?.bg ?? 'rgba(250, 204, 21, 0.18)'
                    : 'rgba(15, 23, 42, 0.78)',
                  color: isActive ? meta?.color ?? '#fef08a' : '#cbd5e1',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                }}
              >
                {!t.unlocked && <span>🔒</span>}
                {t.stars && <span style={{ letterSpacing: 1 }}>{t.stars}</span>}
                <span>{t.label}</span>
                <span
                  style={{
                    padding: '1px 7px',
                    borderRadius: 999,
                    background: 'rgba(0,0,0,0.35)',
                    fontSize: '0.7rem',
                  }}
                >
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* History Status Filter Bar */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(
            [
              { id: 'all', label: '📋 Todos' },
              { id: 'pending', label: `⏳ Pendentes (${TACTICAL_PROBLEMS.length - solvedIds.length})` },
              { id: 'failed', label: `❌ Com Erros (${historyStats.problemsWithErrors})` },
              { id: 'solved', label: `✅ Resolvidos (${solvedIds.length})` },
              { id: 'first_try', label: `🏆 De 1ª Sem Dica (${historyStats.totalFirstTry})` },
            ] as { id: HistoryFilterType; label: string }[]
          ).map((hf) => {
            const active = historyFilter === hf.id;
            return (
              <button
                key={hf.id}
                type="button"
                onClick={() => setHistoryFilter(hf.id)}
                style={{
                  padding: '7px 12px',
                  borderRadius: 999,
                  border: active
                    ? '1px solid rgba(56, 189, 248, 0.75)'
                    : '1px solid rgba(148, 163, 184, 0.25)',
                  background: active ? 'rgba(56, 189, 248, 0.18)' : 'rgba(15, 23, 42, 0.75)',
                  color: active ? '#7dd3fc' : '#94a3b8',
                  fontWeight: 800,
                  fontSize: '0.76rem',
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
            padding: '36px 24px',
            textAlign: 'center',
            borderRadius: 16,
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(148, 163, 184, 0.25)',
            color: '#94a3b8',
          }}
        >
          Nenhum problema encontrado para a combinação atual de filtros de Grau e Histórico.
        </div>
      )}

      {/* Problems Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          gap: 18,
        }}
      >
        {filteredProblems.map((prob) => {
          const isSolved = solvedSet.has(prob.id);
          const entry = historyMap[prob.id];
          const isTierUnlocked = isProblemTierUnlocked(prob.difficulty, solvedIds);
          const diffMeta = PROBLEM_DIFFICULTY_META[prob.difficulty];
          const domMeta = DOMAIN_META[prob.primaryDomain];
          const avatarCard = CARDS_BY_ID[prob.p1AvatarCardId];
          const isHintOpen = expandedHintId === prob.id;
          const tierIdx = PROBLEM_TIERS_ORDER.indexOf(prob.difficulty);
          const prevTierLabel =
            tierIdx > 0 ? PROBLEM_DIFFICULTY_META[PROBLEM_TIERS_ORDER[tierIdx - 1]].label : '';

          return (
            <div
              key={prob.id}
              style={{
                background:
                  'linear-gradient(165deg, rgba(15, 23, 42, 0.95), rgba(9, 13, 24, 0.98))',
                border: !isTierUnlocked
                  ? '1px dashed rgba(148, 163, 184, 0.28)'
                  : isSolved
                    ? '1.5px solid rgba(74, 222, 128, 0.55)'
                    : (entry?.failures ?? 0) > 0
                      ? '1.5px solid rgba(248, 113, 113, 0.5)'
                      : `1px solid ${diffMeta.border}`,
                borderRadius: 16,
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 14,
                boxShadow: '0 14px 32px rgba(0, 0, 0, 0.45)',
                position: 'relative',
                overflow: 'hidden',
                opacity: isTierUnlocked ? 1 : 0.78,
              }}
            >
              <div>
                {/* Top Badges */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    marginBottom: 10,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span
                      style={{
                        padding: '3px 9px',
                        borderRadius: 6,
                        background: diffMeta.bg,
                        border: `1px solid ${diffMeta.border}`,
                        color: diffMeta.color,
                        fontSize: '0.7rem',
                        fontWeight: 900,
                        letterSpacing: '0.05em',
                      }}
                    >
                      {prob.code} • {diffMeta.starsText}
                    </span>
                    <span
                      style={{
                        padding: '3px 9px',
                        borderRadius: 6,
                        background: 'rgba(30, 41, 59, 0.85)',
                        border: '1px solid rgba(148, 163, 184, 0.25)',
                        color: '#e2e8f0',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                      }}
                    >
                      {domMeta.icon} {prob.mechanicTag}
                    </span>
                  </div>

                  {!isTierUnlocked ? (
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: 999,
                        background: 'rgba(51, 65, 85, 0.65)',
                        border: '1px solid rgba(148, 163, 184, 0.4)',
                        color: '#cbd5e1',
                        fontSize: '0.7rem',
                        fontWeight: 900,
                      }}
                    >
                      🔒 BLOQUEADO (+{prob.goldReward}🪙)
                    </span>
                  ) : isSolved ? (
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: 999,
                        background: entry?.solvedOnFirstTry
                          ? 'rgba(56, 189, 248, 0.2)'
                          : 'rgba(34, 197, 94, 0.2)',
                        border: entry?.solvedOnFirstTry
                          ? '1px solid rgba(56, 189, 248, 0.6)'
                          : '1px solid rgba(74, 222, 128, 0.55)',
                        color: entry?.solvedOnFirstTry ? '#38bdf8' : '#4ade80',
                        fontSize: '0.7rem',
                        fontWeight: 900,
                      }}
                    >
                      {entry?.solvedOnFirstTry
                        ? '🏆 DE 1ª SEM DICA'
                        : `✅ RESOLVIDO (${entry?.attempts ?? 1}ª tent.)`}
                    </span>
                  ) : (entry?.failures ?? 0) > 0 ? (
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: 999,
                        background: 'rgba(239, 68, 68, 0.18)',
                        border: '1px solid rgba(248, 113, 113, 0.55)',
                        color: '#fca5a5',
                        fontSize: '0.7rem',
                        fontWeight: 900,
                      }}
                    >
                      ❌ {entry?.failures} ERRO(S) • +{prob.goldReward}🪙
                    </span>
                  ) : (
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: 999,
                        background: 'rgba(250, 204, 21, 0.16)',
                        border: '1px solid rgba(250, 204, 21, 0.45)',
                        color: '#fde047',
                        fontSize: '0.72rem',
                        fontWeight: 900,
                      }}
                    >
                      🪙 +{prob.goldReward} Ouro
                    </span>
                  )}
                </div>

                {/* Title & Subtitle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  {avatarCard?.imagePath && (
                    <img
                      src={avatarCard.imagePath}
                      alt={prob.title}
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 10,
                        objectFit: 'cover',
                        border: `1.5px solid ${diffMeta.color}`,
                        flexShrink: 0,
                        filter: isTierUnlocked ? 'none' : 'grayscale(0.65)',
                      }}
                    />
                  )}
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: '1.05rem',
                        fontFamily: 'Cinzel, serif',
                        fontWeight: 900,
                        color: '#f8fafc',
                      }}
                    >
                      {prob.title}
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: 2 }}>
                      {prob.subtitle}
                    </div>
                  </div>
                </div>

                {/* Scenario Lore */}
                <p
                  style={{
                    margin: '0 0 12px',
                    fontSize: '0.82rem',
                    lineHeight: 1.5,
                    color: '#cbd5e1',
                  }}
                >
                  {prob.scenarioLore}
                </p>

                {/* Matchup Snapshot Bar */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 8,
                    padding: '9px 12px',
                    borderRadius: 10,
                    background: 'rgba(2, 6, 23, 0.75)',
                    border: '1px solid rgba(148, 163, 184, 0.18)',
                    fontSize: '0.76rem',
                  }}
                >
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: '0.68rem', fontWeight: 700 }}>
                      SEU SOBERANO (TURNO {prob.turnNumber})
                    </div>
                    <div style={{ color: '#f8fafc', fontWeight: 800, marginTop: 2 }}>
                      ❤️ {prob.p1Hp} • ⚡ {prob.p1Essence}/{prob.p1MaxEssence} • 🃏 {prob.p1HandCardIds.length} Mão
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#94a3b8', fontSize: '0.68rem', fontWeight: 700 }}>
                      ALVO: {prob.p2Name.toUpperCase()}
                    </div>
                    <div style={{ color: '#f87171', fontWeight: 900, marginTop: 2 }}>
                      🎯 {prob.p2Hp} ❤️ (Xeque-Mate em 1T)
                    </div>
                  </div>
                </div>

                {/* History Detail Strip if attempted */}
                {entry && (entry.attempts > 0 || entry.maxHintStageUsed > 0) && (
                  <div
                    style={{
                      marginTop: 8,
                      padding: '6px 10px',
                      borderRadius: 8,
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.72rem',
                      color: '#94a3b8',
                    }}
                  >
                    <span>
                      📊 Tentativas: <strong style={{ color: '#e2e8f0' }}>{entry.attempts}</strong> • Erros:{' '}
                      <strong style={{ color: entry.failures > 0 ? '#f87171' : '#4ade80' }}>
                        {entry.failures}
                      </strong>
                    </span>
                    <span>
                      {entry.maxHintStageUsed === 0
                        ? '✨ Sem dicas usadas'
                        : `💡 Dica nível ${entry.maxHintStageUsed} consultada`}
                    </span>
                  </div>
                )}

                {/* Optional Hint Preview */}
                {isHintOpen && isTierUnlocked && (
                  <div
                    style={{
                      marginTop: 10,
                      padding: '10px 12px',
                      borderRadius: 10,
                      background: 'rgba(250, 204, 21, 0.1)',
                      border: '1px solid rgba(250, 204, 21, 0.35)',
                      fontSize: '0.78rem',
                      color: '#fef08a',
                      lineHeight: 1.45,
                    }}
                  >
                    <strong>💡 Pista Tática:</strong> {prob.hint1}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                {isTierUnlocked ? (
                  <>
                    <button
                      type="button"
                      onClick={() => onSelectProblem(prob)}
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        borderRadius: 10,
                        border: '1px solid rgba(250, 204, 21, 0.6)',
                        background:
                          'linear-gradient(135deg, rgba(234, 179, 8, 0.92), rgba(202, 138, 4, 0.95))',
                        color: '#0f172a',
                        fontWeight: 900,
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                        boxShadow: '0 6px 18px rgba(234, 179, 8, 0.28)',
                      }}
                    >
                      {isSolved
                        ? `♟️ REJOGAR PROBLEMA #${prob.number}`
                        : (entry?.failures ?? 0) > 0
                          ? `🔄 TENTAR NOVAMENTE (#${prob.number})`
                          : `♟️ RESOLVER PROBLEMA #${prob.number} NA MESA`}
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedHintId(isHintOpen ? null : prob.id)}
                      title="Ver Pista Conceitual"
                      style={{
                        padding: '10px 12px',
                        borderRadius: 10,
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        background: 'rgba(30, 41, 59, 0.85)',
                        color: '#fde047',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      💡 Pista
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    disabled
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: '1px solid rgba(148, 163, 184, 0.28)',
                      background: 'rgba(30, 41, 59, 0.65)',
                      color: '#94a3b8',
                      fontWeight: 800,
                      fontSize: '0.78rem',
                      cursor: 'not-allowed',
                    }}
                  >
                    🔒 RESOLVA 20/20 DO {prevTierLabel.toUpperCase()} PARA DESBLOQUEAR
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
