import React, { useMemo, useState } from 'react';
import { CARDS_BY_ID } from '../data/cards';
import { PREBUILT_DECKS } from '../data/decks';
import { AI_SKILL_TIER_SPECS } from '../data/aiSkillTierSpecs';
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

function stripInlineEmojis(text: string): string {
  return text
    .replace(/⚡\s*de\s*Essência/gi, ' de Essência')
    .replace(/⚡/g, ' Essência')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\uFE0F]/gu, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
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
    <div className="aaa-page-shell" style={{ maxWidth: 1180, margin: '0 auto', gap: 16 }}>
      {/* Clean Single-Row Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 14,
          padding: '14px 18px',
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(148, 163, 184, 0.12)',
          borderRadius: 10,
        }}
      >
        <div>
          <h1
            className="font-cinzel"
            style={{ margin: 0, fontSize: '1.25rem', color: '#f8fafc', fontWeight: 700 }}
          >
            Fendas da Fratura
          </h1>
          <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
            Duelos com leis especiais de campo ·{' '}
            {isWeeklyClaimed
              ? `Bônus semanal concluído (+${STANDARD_RIFT_WIN_GOLD} Ouro por vitória)`
              : `Destaque da semana rende +${WEEKLY_RIFT_GOLD_BONUS} Ouro e +${WEEKLY_RIFT_SHARDS_BONUS} Estilhaços extras`}
            {isGuest && (
              <>
                {' · '}
                <button
                  type="button"
                  onClick={onRequireAccount}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: '#e5c97b',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Criar conta para salvar recompensas
                </button>
              </>
            )}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {!isGuest && customDecks.length === 0 ? (
            <button
              type="button"
              className="aaa-btn aaa-btn-primary"
              onClick={onRequireDeckSetup}
            >
              Montar Grimório
            </button>
          ) : (
            <select
              aria-label="Grimório de combate"
              className="myth-select-compact"
              style={{ minWidth: 190 }}
              value={selectedDeckId}
              onChange={(e) => setSelectedDeckId(e.target.value)}
            >
              {customDecks.length > 0
                ? customDecks.map((cd) => (
                    <option key={cd.id} value={cd.id}>
                      {cd.name}
                    </option>
                  ))
                : PREBUILT_DECKS.filter((pd) => pd.domains.length === 1).map((pd) => (
                    <option key={pd.id} value={pd.id}>
                      {pd.name}
                    </option>
                  ))}
            </select>
          )}

          <select
            aria-label="Grau de Maestria"
            className="myth-select-compact"
            value={String(tierSelection)}
            onChange={(e) => {
              const val = e.target.value;
              setTierSelection(val === 'auto' ? 'auto' : (Number(val) as 3 | 4 | 5));
            }}
          >
            <option value="auto">Grau automático</option>
            <option value="3">Grau III · Veterano (+15 Ouro)</option>
            <option value="4">Grau IV · Mestre (+20 Ouro)</option>
            <option value="5">Grau V · Grão-Mestre (+25 Ouro)</option>
          </select>

          <SovereignRelicSelectorBar
            defeatedBossCount={defeatedBossCount}
            arenaWins={arenaWins}
          />
        </div>
      </header>

      {/* Clean 6-Card Grid (No Duplicate Weekly Banner, No Emoji Soup, 1 Action Button per Card) */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 14,
        }}
      >
        {FRACTURE_RIFTS.map((rift) => {
          const isWeekly = rift.id === weeklyRift.id;
          const clears = riftProgress.clearedRiftCounts[rift.id] ?? 0;
          const avatarCard = CARDS_BY_ID[rift.challengerAvatarId];
          const effTier = resolveEffectiveTier(rift);
          const tSpec = AI_SKILL_TIER_SPECS[effTier];
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
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 12,
                padding: '16px 18px',
                background: '#0b0f19',
                border: isWeekly
                  ? '1px solid rgba(212, 175, 55, 0.42)'
                  : '1px solid rgba(148, 163, 184, 0.12)',
                borderRadius: 10,
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                  }}
                >
                  <h2
                    className="font-cinzel"
                    style={{ margin: 0, fontSize: '1.02rem', color: '#f8fafc', fontWeight: 700 }}
                  >
                    {rift.name}
                  </h2>
                  {isWeekly ? (
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 600,
                        color: '#e5c97b',
                        padding: '2px 8px',
                        borderRadius: 999,
                        border: '1px solid rgba(212, 175, 55, 0.35)',
                        background: 'rgba(212, 175, 55, 0.08)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Destaque semanal
                    </span>
                  ) : clears > 0 ? (
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      Concluída {clears}×
                    </span>
                  ) : null}
                </div>

                <p style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.48 }}>
                  {stripInlineEmojis(rift.shortRule)}
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    paddingTop: 10,
                    borderTop: '1px solid rgba(148, 163, 184, 0.1)',
                  }}
                >
                  {avatarCard?.imagePath && (
                    <img
                      src={avatarCard.imagePath}
                      alt={rift.challengerName}
                      loading="lazy"
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 6,
                        objectFit: 'cover',
                        border: '1px solid rgba(148, 163, 184, 0.2)',
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: '#f1f5f9',
                      }}
                    >
                      <span>{rift.challengerName}</span>
                      <span style={{ display: 'inline-flex', gap: 3 }}>
                        {rift.domains.map((domKey) => (
                          <i
                            key={domKey}
                            title={DOMAIN_META[domKey].name}
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              background: DOMAIN_META[domKey].color,
                              display: 'inline-block',
                            }}
                          />
                        ))}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: 1 }}>
                      Grau {tSpec.roman} · {rift.challengerHp + hpScale} PV · +{tierGold} Ouro
                    </div>
                  </div>
                </div>

                <details style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                  <summary
                    style={{
                      cursor: 'pointer',
                      color: '#94a3b8',
                      userSelect: 'none',
                      fontSize: '0.74rem',
                    }}
                  >
                    Dica tática e análise do guardião
                  </summary>
                  <div style={{ marginTop: 6, lineHeight: 1.45, color: '#cbd5e1' }}>
                    <p style={{ margin: '0 0 6px' }}>{rift.tacticalTip}</p>
                    <button
                      type="button"
                      onClick={() => setOracleOpponentId(rift.archetypeId)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        color: '#e5c97b',
                        fontSize: '0.74rem',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      Abrir confronto no Oráculo →
                    </button>
                  </div>
                </details>
              </div>

              <button
                type="button"
                className="btn-fantasy btn-fantasy-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '8px 14px' }}
                onClick={() => handleLaunchRift(rift)}
              >
                Desafiar Fenda
              </button>
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
