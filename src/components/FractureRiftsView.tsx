import React, { useMemo, useState } from 'react';
import { CARDS_BY_ID } from '../data/cards';
import { PREBUILT_DECKS } from '../data/decks';
import {
  AI_SKILL_TIER_SPECS,
  BICOLOR_ARCHETYPE_MASTERY,
  BicolorArchetypeId,
  MONOCOLOR_ARCHETYPE_MASTERY,
  MonocolorArchetypeId,
  POLYCOLOR_ARCHETYPE_MASTERY,
  PolycolorArchetypeId,
} from '../data/aiMonocolorMastery';
import { getUnifiedStandingForDeckId } from '../data/aiUnifiedTournament';
import {
  FRACTURE_RIFTS,
  FractureRiftDef,
  getCurrentIsoWeekKey,
  getWeeklyFeaturedRift,
  loadRiftProgress,
  resolveDefaultRiftSkillTier,
  RIFT_TIER_GOLD_REWARD,
  STANDARD_RIFT_WIN_GOLD,
  WEEKLY_RIFT_GOLD_BONUS,
  WEEKLY_RIFT_SHARDS_BONUS,
} from '../data/fractureRiftsData';
import { AiSkillTier, RiftMutatorId } from '../types/game';
import { playSfx } from '../utils/soundEngine';
import type { CustomSavedDeck } from './BattleArena';
import { DOMAIN_META } from './CardView';
import { SovereignRelicSelectorBar } from './SovereignRelicSelectorBar';
import { TacticalGuideView } from './TacticalGuideView';

export interface FractureRiftsViewProps {
  customDecks: CustomSavedDeck[];
  isGuest: boolean;
  defeatedBossCount: number;
  arenaWins: number;
  onRequireAccount: () => void;
  onRequireDeckSetup: () => void;
  onStartRiftBattle: (
    riftId: RiftMutatorId,
    playerDeckCardIds: string[],
    aiSkillTier?: AiSkillTier
  ) => void;
}

function getChampionTitle(archetypeId: string): string {
  const mono = MONOCOLOR_ARCHETYPE_MASTERY[archetypeId as MonocolorArchetypeId];
  if (mono) return mono.name;
  const bi = BICOLOR_ARCHETYPE_MASTERY[archetypeId as BicolorArchetypeId];
  if (bi) return bi.name;
  const poly = POLYCOLOR_ARCHETYPE_MASTERY[archetypeId as PolycolorArchetypeId];
  if (poly) return poly.name;
  return archetypeId;
}

export const FractureRiftsView: React.FC<FractureRiftsViewProps> = ({
  customDecks,
  isGuest,
  defeatedBossCount,
  arenaWins,
  onRequireAccount,
  onRequireDeckSetup,
  onStartRiftBattle,
}) => {
  const [selectedDeckId, setSelectedDeckId] = useState<string>(
    () => customDecks[0]?.id ?? PREBUILT_DECKS[0].id
  );
  const [tierSelection, setTierSelection] = useState<'auto' | 3 | 4 | 5>('auto');
  const [oracleOpponentId, setOracleOpponentId] = useState<string | null>(null);

  const weeklyRift = useMemo(() => getWeeklyFeaturedRift(), []);
  const currentWeekKey = useMemo(() => getCurrentIsoWeekKey(), []);
  const riftProgress = useMemo(() => loadRiftProgress(), []);
  const isWeeklyClaimed = riftProgress.claimedWeekKeys.includes(currentWeekKey);

  const totalRiftsCleared = useMemo(
    () =>
      Object.values(riftProgress.clearedRiftCounts).reduce(
        (sum, count) => sum + (count ?? 0),
        0
      ),
    [riftProgress.clearedRiftCounts]
  );

  const resolveEffectiveTier = (rift: FractureRiftDef): AiSkillTier => {
    if (tierSelection !== 'auto') return tierSelection;
    const clears = riftProgress.clearedRiftCounts[rift.id] ?? 0;
    return resolveDefaultRiftSkillTier(rift.id, clears);
  };

  const handleLaunchRift = (rift: FractureRiftDef) => {
    if (!isGuest && customDecks.length === 0) {
      onRequireDeckSetup();
      return;
    }
    const effectiveTier = resolveEffectiveTier(rift);
    playSfx('summon');
    if (customDecks.length > 0) {
      const chosen = customDecks.find((d) => d.id === selectedDeckId) ?? customDecks[0];
      onStartRiftBattle(rift.id, chosen.cardIds, effectiveTier);
    } else {
      const fallback = PREBUILT_DECKS.find((d) => d.id === selectedDeckId) ?? PREBUILT_DECKS[0];
      onStartRiftBattle(rift.id, fallback.cardIds, effectiveTier);
    }
  };

  return (
    <div className="aaa-page-shell rifts-page-shell">
      {/* Header & Weekly Spotlight */}
      <header className="rifts-hero-banner">
        <div className="rifts-hero-top">
          <div>
            <span className="aaa-kicker">EVENTOS TÁTICOS • MUTADORES DE REGRA</span>
            <h1 className="font-cinzel gold-gradient-text rifts-hero-title">
              Fendas da Fratura
            </h1>
            <p className="rifts-hero-sub">
              Anomalias planares distorcem as leis da Essência, do Clima e da Cripta. Escolha seu
              Grimório, equipe sua Relíquia da Coroa e subjugue os Arcontes de cada Fenda.
            </p>
          </div>

          <div className="rifts-hero-controls">
            <div className="rifts-deck-picker">
              <label htmlFor="rift-deck-select">Grimório de Combate</label>
              {!isGuest && customDecks.length === 0 ? (
                <button
                  type="button"
                  className="aaa-btn aaa-btn-primary"
                  onClick={onRequireDeckSetup}
                >
                  Montar Grimório (100) →
                </button>
              ) : (
                <select
                  id="rift-deck-select"
                  className="rifts-select"
                  value={selectedDeckId}
                  onChange={(e) => setSelectedDeckId(e.target.value)}
                >
                  {customDecks.length > 0
                    ? customDecks.map((cd) => {
                        const w = cd.wins ?? 0;
                        const l = cd.losses ?? 0;
                        const rec = w + l > 0 ? ` (${w}V/${l}D)` : '';
                        return (
                          <option key={cd.id} value={cd.id}>
                            ★ {cd.name}
                            {rec}
                          </option>
                        );
                      })
                    : PREBUILT_DECKS.filter((pd) => pd.domains.length === 1).map((pd) => (
                        <option key={pd.id} value={pd.id}>
                          {pd.name} (Visitante)
                        </option>
                      ))}
                </select>
              )}
            </div>

            <div className="rifts-deck-picker">
              <label htmlFor="rift-tier-select">Maestria do Guardião (IA)</label>
              <select
                id="rift-tier-select"
                className="rifts-select"
                value={String(tierSelection)}
                onChange={(e) => {
                  const val = e.target.value;
                  setTierSelection(val === 'auto' ? 'auto' : (Number(val) as 3 | 4 | 5));
                }}
              >
                <option value="auto">Automático por Progressão (T3 → T5)</option>
                <option value="3">Tier III • Veterano (+15 Ouro)</option>
                <option value="4">Tier IV • Mestre (+20 Ouro)</option>
                <option value="5">Tier V • Grão-Mestre (+25 Ouro)</option>
              </select>
            </div>

            <div className="rifts-progress-pill">
              <span>Vitórias em Fendas:</span>
              <strong>{totalRiftsCleared}</strong>
            </div>
          </div>
        </div>

        {/* Crown Relic Selector */}
        <div style={{ marginTop: '0.75rem' }}>
          <SovereignRelicSelectorBar
            defeatedBossCount={defeatedBossCount}
            arenaWins={arenaWins}
          />
        </div>

        {/* Weekly Featured Rift Spotlight */}
        <div className="rifts-weekly-spotlight">
          <div className="rifts-weekly-badge-col">
            <span className="rifts-weekly-tag">
              FENDA EM DESTAQUE DA SEMANA ({currentWeekKey})
            </span>
            <h2 className="font-cinzel rifts-weekly-name">
              {weeklyRift.name}
            </h2>
            <p className="rifts-weekly-rule">{weeklyRift.detailedRule}</p>
            <div className="rifts-weekly-tip">{weeklyRift.tacticalTip}</div>
          </div>

          <div className="rifts-weekly-cta-col">
            <div className={`rifts-weekly-reward-box ${isWeeklyClaimed ? 'is-claimed' : ''}`}>
              {isGuest ? (
                <>
                  <span className="rwr-label">MODO VISITANTE</span>
                  <strong>Crie sua conta para ganhar +{WEEKLY_RIFT_GOLD_BONUS} Ouro • +{WEEKLY_RIFT_SHARDS_BONUS} Estilhaços!</strong>
                  <button
                    type="button"
                    className="rifts-link-btn"
                    onClick={onRequireAccount}
                  >
                    Criar Conta Gratuita →
                  </button>
                </>
              ) : isWeeklyClaimed ? (
                <>
                  <span className="rwr-label">✓ BÔNUS SEMANAL CONQUISTADO</span>
                  <strong>Recompensa padrão ativa: +{STANDARD_RIFT_WIN_GOLD} Ouro por vitória</strong>
                </>
              ) : (
                <>
                  <span className="rwr-label">1ª VITÓRIA NESTA SEMANA</span>
                  <strong>
                    +{STANDARD_RIFT_WIN_GOLD + WEEKLY_RIFT_GOLD_BONUS} Ouro • +{WEEKLY_RIFT_SHARDS_BONUS} Estilhaços
                  </strong>
                </>
              )}
            </div>

            <button
              type="button"
              className="aaa-btn aaa-btn-primary rifts-enter-btn"
              onClick={() => handleLaunchRift(weeklyRift)}
            >
              Desafiar Fenda Semanal →
            </button>
          </div>
        </div>
      </header>

      {/* All 6 Fracture Rifts Grid */}
      <section className="rifts-grid">
        {FRACTURE_RIFTS.map((rift) => {
          const isWeekly = rift.id === weeklyRift.id;
          const clears = riftProgress.clearedRiftCounts[rift.id] ?? 0;
          const avatarCard = CARDS_BY_ID[rift.challengerAvatarId];
          const effTier = resolveEffectiveTier(rift);
          const tSpec = AI_SKILL_TIER_SPECS[effTier];
          const standing = getUnifiedStandingForDeckId(rift.archetypeId);
          const champTitle = getChampionTitle(rift.archetypeId);
          const hpScale =
            rift.id === 'glass_thrones'
              ? 0
              : effTier >= 5
                ? 4
                : effTier === 4
                  ? 2
                  : 0;
          const tierGold = RIFT_TIER_GOLD_REWARD[effTier] ?? STANDARD_RIFT_WIN_GOLD;

          return (
            <article
              key={rift.id}
              className={`rift-card ${isWeekly ? 'is-weekly-featured' : ''}`}
              style={{ borderTop: `2px solid ${rift.accent}` }}
            >
              <div className="rift-card-header">
                <div className="rift-icon-medal">{rift.icon}</div>
                <div className="rift-title-wrap">
                  <div className="rift-kicker-row">
                    <span className="rift-kicker">{rift.kicker}</span>
                    {isWeekly && <span className="rift-featured-pill">★ SEMANAL</span>}
                  </div>
                  <h3 className="font-cinzel rift-card-title">{rift.name}</h3>
                </div>
              </div>

              <div className="rift-rule-box">
                <strong>Lei da Fenda:</strong> {rift.shortRule}
              </div>

              <p className="rift-tip-text">{rift.tacticalTip}</p>

              <div className="rift-challenger-strip">
                {avatarCard?.imagePath && (
                  <img
                    src={avatarCard.imagePath}
                    alt={rift.challengerName}
                    className="rift-challenger-thumb"
                    loading="lazy"
                  />
                )}
                <div className="rift-challenger-copy">
                  <span className="rift-challenger-label">
                    GUARDIÃO ({rift.challengerHp + hpScale} PV • +{tierGold} OURO)
                  </span>
                  <strong>{rift.challengerName}</strong>
                  <small>{rift.challengerTitle}</small>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: '5px',
                      marginTop: '4px',
                      fontSize: '0.68rem',
                    }}
                    title={tSpec.description}
                  >
                    <span
                      style={{
                        padding: '1px 6px',
                        borderRadius: 4,
                        background: 'rgba(15, 23, 42, 0.85)',
                        border: '1px solid rgba(212, 175, 55, 0.45)',
                        color: '#fde68a',
                        fontWeight: 700,
                      }}
                    >
                      🧠 {tSpec.shortLabel}
                    </span>
                    <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{champTitle}</span>
                    {standing && (
                      <span style={{ color: '#93c5fd', fontWeight: 700 }}>
                        • #{standing.rank}/44 [Tier {standing.tierBadge}]
                      </span>
                    )}
                    <span style={{ display: 'inline-flex', gap: 3 }}>
                      {rift.domains.map((domKey) => (
                        <i
                          key={domKey}
                          title={DOMAIN_META[domKey].name}
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: '50%',
                            background: DOMAIN_META[domKey].color,
                            display: 'inline-block',
                          }}
                        />
                      ))}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rift-card-footer" style={{ gap: '0.45rem', flexWrap: 'wrap' }}>
                <span className="rift-clears-chip">
                  {clears > 0 ? `✓ Expurgada ${clears}×` : 'Ainda não expurgada'}
                </span>
                <div style={{ display: 'flex', gap: '0.4rem', marginLeft: 'auto' }}>
                  <button
                    type="button"
                    className="aaa-btn aaa-btn-secondary"
                    style={{ padding: '6px 10px', fontSize: '0.72rem' }}
                    onClick={() => setOracleOpponentId(rift.archetypeId)}
                    title="Consultar Matchup e contra-jogadas no Oráculo de Guerra"
                  >
                    Matchup
                  </button>
                  <button
                    type="button"
                    className="btn-fantasy btn-fantasy-primary rift-card-btn"
                    onClick={() => handleLaunchRift(rift)}
                  >
                    Entrar ({tSpec.roman}) →
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {oracleOpponentId && (
        <TacticalGuideView
          customDecks={customDecks}
          initialPlayerDeckId={selectedDeckId}
          initialOpponentDeckId={oracleOpponentId}
          isModal={true}
          onClose={() => setOracleOpponentId(null)}
        />
      )}
    </div>
  );
};
