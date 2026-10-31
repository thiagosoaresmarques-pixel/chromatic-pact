import React, { useMemo, useState } from 'react';
import { CARDS_BY_ID } from '../data/cards';
import { PREBUILT_DECKS } from '../data/decks';
import {
  FRACTURE_RIFTS,
  FractureRiftDef,
  getCurrentIsoWeekKey,
  getWeeklyFeaturedRift,
  loadRiftProgress,
  STANDARD_RIFT_WIN_GOLD,
  WEEKLY_RIFT_GOLD_BONUS,
  WEEKLY_RIFT_SHARDS_BONUS,
} from '../data/fractureRiftsData';
import { RiftMutatorId } from '../types/game';
import { playSfx } from '../utils/soundEngine';
import type { CustomSavedDeck } from './BattleArena';
import { SovereignRelicSelectorBar } from './SovereignRelicSelectorBar';

export interface FractureRiftsViewProps {
  customDecks: CustomSavedDeck[];
  isGuest: boolean;
  defeatedBossCount: number;
  arenaWins: number;
  onRequireAccount: () => void;
  onRequireDeckSetup: () => void;
  onStartRiftBattle: (riftId: RiftMutatorId, playerDeckCardIds: string[]) => void;
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

  const handleLaunchRift = (rift: FractureRiftDef) => {
    if (!isGuest && customDecks.length === 0) {
      onRequireDeckSetup();
      return;
    }
    playSfx('summon');
    if (customDecks.length > 0) {
      const chosen = customDecks.find((d) => d.id === selectedDeckId) ?? customDecks[0];
      onStartRiftBattle(rift.id, chosen.cardIds);
    } else {
      const fallback = PREBUILT_DECKS.find((d) => d.id === selectedDeckId) ?? PREBUILT_DECKS[0];
      onStartRiftBattle(rift.id, fallback.cardIds);
    }
  };

  return (
    <div className="aaa-page-shell rifts-page-shell">
      {/* Header & Weekly Spotlight */}
      <header className="rifts-hero-banner" style={{ '--rift-accent': weeklyRift.accent } as React.CSSProperties}>
        <div className="rifts-hero-top">
          <div>
            <span className="aaa-kicker">EVENTOS TÁTICOS • MUTADORES DE REGRA</span>
            <h1 className="font-cinzel gold-gradient-text rifts-hero-title">
              🌀 Fendas da Fratura
            </h1>
            <p className="rifts-hero-sub">
              Anomalias planares distorcem as leis da Essência, do Clima e da Cripta. Escolha seu
              Grimório, equipe sua Relíquia da Coroa e subjugue os Arcontes de cada Fenda.
            </p>
          </div>

          <div className="rifts-hero-controls">
            <div className="rifts-deck-picker">
              <label htmlFor="rift-deck-select">📖 Grimório de Combate</label>
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
                            📖 {cd.name}
                            {rec}
                          </option>
                        );
                      })
                    : PREBUILT_DECKS.slice(0, 5).map((pd) => (
                        <option key={pd.id} value={pd.id}>
                          ⚔️ {pd.name} (Visitante)
                        </option>
                      ))}
                </select>
              )}
            </div>

            <div className="rifts-progress-pill">
              <span>🏆 Vitórias em Fendas:</span>
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
              🌟 FENDA EM DESTAQUE DA SEMANA ({currentWeekKey})
            </span>
            <h2 className="font-cinzel rifts-weekly-name">
              <span>{weeklyRift.icon}</span> {weeklyRift.name}
            </h2>
            <p className="rifts-weekly-rule">{weeklyRift.detailedRule}</p>
            <div className="rifts-weekly-tip">💡 {weeklyRift.tacticalTip}</div>
          </div>

          <div className="rifts-weekly-cta-col">
            <div className={`rifts-weekly-reward-box ${isWeeklyClaimed ? 'is-claimed' : ''}`}>
              {isGuest ? (
                <>
                  <span className="rwr-label">MODO VISITANTE</span>
                  <strong>Crie sua conta para ganhar +{WEEKLY_RIFT_GOLD_BONUS} 🪙 + {WEEKLY_RIFT_SHARDS_BONUS} 💎!</strong>
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
                  <strong>Recompensa padrão ativa: +{STANDARD_RIFT_WIN_GOLD} 🪙 por vitória</strong>
                </>
              ) : (
                <>
                  <span className="rwr-label">🎁 1ª VITÓRIA NESTA SEMANA</span>
                  <strong>
                    +{STANDARD_RIFT_WIN_GOLD + WEEKLY_RIFT_GOLD_BONUS} 🪙 Ouro & +{WEEKLY_RIFT_SHARDS_BONUS} 💎 Estilhaços
                  </strong>
                </>
              )}
            </div>

            <button
              type="button"
              className="aaa-btn aaa-btn-primary rifts-enter-btn"
              onClick={() => handleLaunchRift(weeklyRift)}
            >
              {weeklyRift.icon} Desafiar Fenda Semanal →
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

          return (
            <article
              key={rift.id}
              className={`rift-card ${isWeekly ? 'is-weekly-featured' : ''}`}
              style={{ '--rift-accent': rift.accent } as React.CSSProperties}
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
                <strong>📜 Lei da Fenda:</strong> {rift.shortRule}
              </div>

              <p className="rift-tip-text">💡 {rift.tacticalTip}</p>

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
                  <span className="rift-challenger-label">GUARDIÃO DA FENDA ({rift.challengerHp}❤️)</span>
                  <strong>{rift.challengerName}</strong>
                  <small>{rift.challengerTitle}</small>
                </div>
              </div>

              <div className="rift-card-footer">
                <span className="rift-clears-chip">
                  {clears > 0 ? `✓ Expurgada ${clears}×` : 'Ainda não expurgada'}
                </span>
                <button
                  type="button"
                  className="btn-fantasy btn-fantasy-primary rift-card-btn"
                  onClick={() => handleLaunchRift(rift)}
                >
                  🌀 Entrar na Fenda
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
};
