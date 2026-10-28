import React, { useMemo, useState } from 'react';
import { CARDS_BY_ID } from '../data/cards';
import {
  getSolvedProblemIds,
  PROBLEM_DIFFICULTY_META,
  ProblemDifficultyTier,
  TACTICAL_PROBLEMS,
  TacticalProblem,
} from '../data/problems';
import { CardDefinition } from '../types/game';
import { DOMAIN_META } from './CardView';

export interface ProblemsViewProps {
  onSelectProblem: (problem: TacticalProblem) => void;
  onInspectCard?: (card: CardDefinition) => void;
}

export const ProblemsView: React.FC<ProblemsViewProps> = ({ onSelectProblem }) => {
  const [selectedTier, setSelectedTier] = useState<'all' | ProblemDifficultyTier>('all');
  const [solvedIds] = useState<string[]>(() => getSolvedProblemIds());
  const [expandedHintId, setExpandedHintId] = useState<string | null>(null);

  const filteredProblems = useMemo(() => {
    if (selectedTier === 'all') return TACTICAL_PROBLEMS;
    return TACTICAL_PROBLEMS.filter((p) => p.difficulty === selectedTier);
  }, [selectedTier]);

  const totalGoldAvailable = useMemo(
    () => TACTICAL_PROBLEMS.reduce((acc, p) => acc + p.goldReward, 0),
    []
  );

  const earnedGold = useMemo(
    () =>
      TACTICAL_PROBLEMS.filter((p) => solvedIds.includes(p.id)).reduce(
        (acc, p) => acc + p.goldReward,
        0
      ),
    [solvedIds]
  );

  const tiers: { id: 'all' | ProblemDifficultyTier; label: string; count: number; stars?: string }[] = [
    { id: 'all', label: 'Todos os Problemas', count: TACTICAL_PROBLEMS.length },
    { id: 'iniciante', label: 'Grau I • Iniciante', count: 3, stars: '★☆☆☆☆' },
    { id: 'intermediario', label: 'Grau II • Intermediário', count: 3, stars: '★★☆☆☆' },
    { id: 'avancado', label: 'Grau III • Avançado', count: 3, stars: '★★★☆☆' },
    { id: 'mestre', label: 'Grau IV • Mestre', count: 3, stars: '★★★★☆' },
    { id: 'grao_mestre', label: 'Grau V • Grão-Mestre', count: 3, stars: '★★★★★' },
  ];

  return (
    <div
      style={{
        maxWidth: 1320,
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
          marginBottom: 22,
          boxShadow: '0 20px 48px rgba(0, 0, 0, 0.55)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
        }}
      >
        <div style={{ maxWidth: 780 }}>
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
            ♟️ PROBLEMAS TÁTICOS • XEQUE-MATE EM 1 TURNO (ZERO RNG)
          </div>
          <h1
            style={{
              margin: '0 0 8px',
              fontSize: 'clamp(1.45rem, 2.4vw, 2.1rem)',
              fontFamily: 'Cinzel, serif',
              fontWeight: 900,
              color: '#fef08a',
              textShadow: '0 2px 12px rgba(0,0,0,0.7)',
            }}
          >
            15 Problemas de Letal Garantido em 1 Único Turno
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: '0.92rem',
              lineHeight: 1.55,
              color: '#cbd5e1',
            }}
          >
            Inspirado nos problemas clássicos de Xadrez: a mesa, a mão, a Essência (⚡) e as Afinidades começam
            travadas num cenário cirúrgico. Existe{' '}
            <strong style={{ color: '#fde047' }}>apenas uma sequência exata e indefensável</strong> que reduz o
            Soberano rival a <strong style={{ color: '#f87171' }}>0 ❤️ neste mesmo turno</strong>. Se errar a
            ordem por 1⚡ ou 1 coluna, o rival sobrevive!
          </p>
        </div>

        {/* Progress & Gold Summary */}
        <div
          style={{
            display: 'flex',
            gap: 14,
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.88)',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              borderRadius: 14,
              padding: '14px 18px',
              minWidth: 155,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>
              Problemas Resolvidos
            </div>
            <div style={{ fontSize: '1.55rem', fontWeight: 900, color: '#4ade80', marginTop: 4 }}>
              {solvedIds.length} / {TACTICAL_PROBLEMS.length}
            </div>
          </div>

          <div
            style={{
              background: 'rgba(15, 23, 42, 0.88)',
              border: '1px solid rgba(250, 204, 21, 0.35)',
              borderRadius: 14,
              padding: '14px 18px',
              minWidth: 165,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.7rem', color: '#fde047', fontWeight: 800, textTransform: 'uppercase' }}>
              Recompensas de Ouro
            </div>
            <div style={{ fontSize: '1.55rem', fontWeight: 900, color: '#facc15', marginTop: 4 }}>
              🪙 {earnedGold} / {totalGoldAvailable}
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty Filter Bar */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          marginBottom: 20,
        }}
      >
        {tiers.map((t) => {
          const isActive = selectedTier === t.id;
          const meta = t.id !== 'all' ? PROBLEM_DIFFICULTY_META[t.id] : null;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedTier(t.id)}
              style={{
                padding: '9px 15px',
                borderRadius: 10,
                border: isActive
                  ? `1.5px solid ${meta?.color ?? '#facc15'}`
                  : '1px solid rgba(148, 163, 184, 0.25)',
                background: isActive
                  ? meta?.bg ?? 'rgba(250, 204, 21, 0.18)'
                  : 'rgba(15, 23, 42, 0.78)',
                color: isActive ? meta?.color ?? '#fef08a' : '#cbd5e1',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.16s ease',
              }}
            >
              {t.stars && <span style={{ letterSpacing: 1 }}>{t.stars}</span>}
              <span>{t.label}</span>
              <span
                style={{
                  padding: '1px 7px',
                  borderRadius: 999,
                  background: 'rgba(0,0,0,0.35)',
                  fontSize: '0.72rem',
                }}
              >
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Problems Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          gap: 18,
        }}
      >
        {filteredProblems.map((prob) => {
          const isSolved = solvedIds.includes(prob.id);
          const diffMeta = PROBLEM_DIFFICULTY_META[prob.difficulty];
          const domMeta = DOMAIN_META[prob.primaryDomain];
          const avatarCard = CARDS_BY_ID[prob.p1AvatarCardId];
          const isHintOpen = expandedHintId === prob.id;

          return (
            <div
              key={prob.id}
              style={{
                background:
                  'linear-gradient(165deg, rgba(15, 23, 42, 0.95), rgba(9, 13, 24, 0.98))',
                border: isSolved
                  ? '1.5px solid rgba(74, 222, 128, 0.55)'
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

                  {isSolved ? (
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: 999,
                        background: 'rgba(34, 197, 94, 0.2)',
                        border: '1px solid rgba(74, 222, 128, 0.55)',
                        color: '#4ade80',
                        fontSize: '0.72rem',
                        fontWeight: 900,
                      }}
                    >
                      ✅ RESOLVIDO
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
                      }}
                    />
                  )}
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: '1.06rem',
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

                {/* Optional Hint Preview */}
                {isHintOpen && (
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
                  ♟️ RESOLVER PROBLEMA #{prob.number} NA MESA
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
