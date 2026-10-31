import React, { useState, useMemo } from 'react';
import {
  getEquippedRelicId,
  isRelicUnlocked,
  RelicUnlockContext,
  setEquippedRelicId,
  SOVEREIGN_RELICS,
  SOVEREIGN_RELICS_BY_ID,
} from '../data/sovereignRelics';
import { DOMAIN_META } from './CardView';
import { playSfx } from '../utils/soundEngine';

export interface SovereignRelicSelectorBarProps {
  defeatedBossCount?: number;
  arenaWins?: number;
}

export const SovereignRelicSelectorBar: React.FC<SovereignRelicSelectorBarProps> = ({
  defeatedBossCount = 0,
  arenaWins = 0,
}) => {
  const [equippedId, setEquippedId] = useState<string>(() => getEquippedRelicId());
  const [showModal, setShowModal] = useState<boolean>(false);

  const unlockCtx: RelicUnlockContext = useMemo(
    () => ({
      defeatedBossCount,
      arenaWins,
    }),
    [defeatedBossCount, arenaWins]
  );

  const unlockedCount = useMemo(
    () => SOVEREIGN_RELICS.filter((r) => isRelicUnlocked(r, unlockCtx)).length,
    [unlockCtx]
  );

  const activeRelic =
    equippedId !== 'none' ? SOVEREIGN_RELICS_BY_ID[equippedId] ?? SOVEREIGN_RELICS[0] : null;

  const handleSelectRelic = (nextId: string) => {
    setEquippedId(nextId);
    setEquippedRelicId(nextId);
    playSfx('channel');
    setShowModal(false);
  };

  return (
    <>
      <button
        type="button"
        className="sovereign-relic-bar-btn"
        onClick={() => {
          playSfx('channel');
          setShowModal(true);
        }}
        title={
          activeRelic
            ? `Relíquia Equipada: ${activeRelic.name} (${activeRelic.shortBonus}) — Clique para trocar`
            : 'Nenhuma Relíquia da Coroa equipada — Clique para equipar'
        }
      >
        <span className="srb-icon">{activeRelic ? activeRelic.icon : '👑'}</span>
        <span className="srb-texts">
          <strong>{activeRelic ? activeRelic.name : 'Sem Relíquia'}</strong>
          <small>{activeRelic ? activeRelic.shortBonus : 'Clique para equipar Relíquia Real'}</small>
        </span>
        <span className="srb-count-pill">
          {unlockedCount}/{SOVEREIGN_RELICS.length}
        </span>
      </button>

      {showModal && (
        <div
          className="modal-backdrop ow-event-backdrop"
          onClick={() => setShowModal(false)}
        >
          <div
            className="modal-panel sovereign-relics-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ow-event-header">
              <div>
                <span className="vwm-territory-kicker">
                  TESOURO REAL DE VAELORIA • {unlockedCount}/{SOVEREIGN_RELICS.length} DESBLOQUEADAS
                </span>
                <h3
                  className="font-cinzel gold-gradient-text"
                  style={{ margin: '2px 0 0', fontSize: '1.15rem' }}
                >
                  👑 Relíquias da Coroa do Soberano
                </h3>
              </div>
              <button
                type="button"
                className="ow-event-close-btn"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <p style={{ margin: 0, fontSize: '0.78rem', color: '#cbd5e1' }}>
              Equipe <strong>1 Relíquia Real</strong> para conceder seu decreto arcano no início de cada batalha de Campanha, Expedição, Conquista e Crisol.
            </p>

            <div className="sovereign-relics-grid">
              {SOVEREIGN_RELICS.map((relic) => {
                const unlocked = isRelicUnlocked(relic, unlockCtx);
                const isEquipped = activeRelic?.id === relic.id;
                const domMeta = DOMAIN_META[relic.domain];

                return (
                  <button
                    key={relic.id}
                    type="button"
                    disabled={!unlocked}
                    className={`sovereign-relic-card ${isEquipped ? 'is-equipped' : ''} ${
                      !unlocked ? 'is-locked' : ''
                    }`}
                    style={
                      {
                        '--relic-color': domMeta.color,
                      } as React.CSSProperties
                    }
                    onClick={() => handleSelectRelic(relic.id)}
                  >
                    <div className="src-top">
                      <span className="src-icon">{unlocked ? relic.icon : '🔒'}</span>
                      <div className="src-titles">
                        <strong className="font-cinzel">{relic.name}</strong>
                        <small style={{ color: domMeta.color }}>
                          {domMeta.icon} {domMeta.shortName}
                        </small>
                      </div>
                      {isEquipped && <span className="nav-popover-active-pill">EQUIPADA</span>}
                    </div>
                    <div className="src-bonus">{relic.shortBonus}</div>
                    <div className="src-lore">
                      {unlocked ? relic.loreSnippet : `🔒 ${relic.unlockRequirementLabel}`}
                    </div>
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="aaa-btn aaa-btn-ghost"
                onClick={() => handleSelectRelic('none')}
              >
                Desequipar Relíquia
              </button>
              <button
                type="button"
                className="aaa-btn aaa-btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
