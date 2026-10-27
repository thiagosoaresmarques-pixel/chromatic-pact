import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { CARDS_BY_ID } from '../data/cards';
import {
  BoardUnit,
  CardDefinition,
  Domain,
  FloatingFeedback,
  Keyword,
  Rarity,
} from '../types/game';

export const DOMAIN_META: Record<
  Domain,
  { name: string; shortName: string; icon: string; color: string; badgeBg: string }
> = {
  red: {
    name: 'Chama & Escama',
    shortName: 'Chama',
    icon: '◆',
    color: '#ef4444',
    badgeBg: 'rgba(239, 68, 68, 0.16)',
  },
  blue: {
    name: 'Tempestade & Runa',
    shortName: 'Tempestade',
    icon: '◈',
    color: '#38bdf8',
    badgeBg: 'rgba(56, 189, 248, 0.16)',
  },
  purple: {
    name: 'Abismo & Sombra',
    shortName: 'Abismo',
    icon: '❖',
    color: '#a855f7',
    badgeBg: 'rgba(168, 85, 247, 0.16)',
  },
  green: {
    name: 'Selva & Fera',
    shortName: 'Selva',
    icon: '✦',
    color: '#10b981',
    badgeBg: 'rgba(16, 185, 129, 0.16)',
  },
  gold: {
    name: 'Ordem & Ferro',
    shortName: 'Ordem',
    icon: '⬢',
    color: '#f59e0b',
    badgeBg: 'rgba(245, 158, 11, 0.16)',
  },
  neutral: {
    name: 'Éter Arcano',
    shortName: 'Neutro',
    icon: '◇',
    color: '#94a3b8',
    badgeBg: 'rgba(148, 163, 184, 0.16)',
  },
};

export const RARITY_LABELS: Record<Rarity, string> = {
  common: 'Comum',
  uncommon: 'Incomum',
  rare: 'Rara',
  legendary: 'Lendária',
};

export const CARD_TYPE_LABELS: Record<CardDefinition['type'], string> = {
  creature: 'Criatura',
  spell: 'Feitiço',
  reaction: 'Reação',
  relic: 'Relíquia',
};

export const KEYWORD_TOOLTIPS: Record<Keyword, string> = {
  Guardião: 'Inimigos terrestres são obrigados a atacar esta unidade antes de outras.',
  Voo: 'Ignora a Vanguarda terrestre; só é bloqueado por Voo ou Alcance.',
  Alcance: 'Ataca a partir da Retaguarda sem sofrer dano de contra-ataque.',
  Ímpeto: 'Pode atacar criaturas inimigas no mesmo turno em que entra em campo.',
  Atropelar: 'O dano excedente ao destruir um defensor atinge o Soberano inimigo.',
  'Toque Letal': 'Qualquer dano causado à Vida de uma criatura a destrói imediatamente.',
  'Escudo Divino': 'Anula completamente a primeira instância de dano que sofreria.',
  'Dreno de Vida': 'Cura o seu Soberano em 2 PV sempre que esta unidade causar dano.',
  Renascer: 'Na primeira vez que morre, retorna ao campo com 1 de Vida.',
  'Pele Incandescente': 'Causa +1 de dano de fogo a quem atacá-la corpo-a-corpo.',
  'Fúria Crescente': 'Ganha +2 de ATQ permanentemente sempre que sobrevive a dano.',
};

export interface CardViewProps {
  card: CardDefinition;
  unit?: BoardUnit;
  mode: 'hand' | 'board' | 'gallery' | 'inspect';
  isPlayable?: boolean;
  isSelected?: boolean;
  isValidTarget?: boolean;
  isReadyAttacker?: boolean;
  canAscend?: boolean;
  canMoveRow?: boolean;
  feedback?: FloatingFeedback | null;
  onClick?: (e: React.MouseEvent) => void;
  onAscendClick?: (e: React.MouseEvent) => void;
  onMoveRowClick?: (e: React.MouseEvent) => void;
  onInspect?: (card: CardDefinition) => void;
  onHoverCard?: (card: CardDefinition | null, unit?: BoardUnit) => void;
  onQuickDeployVanguard?: () => void;
  onQuickDeployRearguard?: () => void;
  onQuickCast?: () => void;
  onQuickArmTrap?: () => void;
  onQuickChannel?: () => void;
  onQuickBurn?: () => void;
  canChannel?: boolean;
}

export const KEYWORD_ICONS: Record<Keyword, string> = {
  Guardião: '⛨',
  Voo: '▲',
  Alcance: '⌖',
  Ímpeto: '⚡',
  Atropelar: '◈',
  'Toque Letal': '☠',
  'Escudo Divino': '✦',
  'Dreno de Vida': '❖',
  Renascer: '↻',
  'Pele Incandescente': '◆',
  'Fúria Crescente': '▲',
};

export const CardView: React.FC<CardViewProps> = ({
  card,
  unit,
  mode,
  isPlayable = false,
  isSelected = false,
  isValidTarget = false,
  isReadyAttacker = false,
  canAscend = false,
  canMoveRow = false,
  feedback = null,
  onClick,
  onAscendClick,
  onMoveRowClick,
  onInspect,
  onHoverCard,
  onQuickDeployVanguard,
  onQuickDeployRearguard,
  onQuickCast,
  onQuickArmTrap,
  onQuickChannel,
  onQuickBurn,
  canChannel = false,
}) => {
  const [imgError, setImgError] = useState(false);
  const [internalInspectCard, setInternalInspectCard] = useState<CardDefinition | null>(null);
  const cardRef = React.useRef<HTMLDivElement | null>(null);

  const displayCard = unit?.card ?? (CARDS_BY_ID[card.id] ?? card);
  const domainInfo = DOMAIN_META[displayCard.domain] || DOMAIN_META.neutral;

  // Real-time 3D Tilt, Multi-Layer Parallax & Specular Foil Glare
  const handle3DMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = Math.max(0, Math.min(1, x / Math.max(1, rect.width)));
    const py = Math.max(0, Math.min(1, y / Math.max(1, rect.height)));

    const maxTilt = mode === 'board' ? 10 : 14;
    const rotY = ((px - 0.5) * maxTilt * 2).toFixed(2);
    const rotX = ((0.5 - py) * maxTilt * 2).toFixed(2);
    const parX = ((px - 0.5) * -14).toFixed(1);
    const parY = ((py - 0.5) * -14).toFixed(1);

    el.style.setProperty('--rx', `${rotX}deg`);
    el.style.setProperty('--ry', `${rotY}deg`);
    el.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
    el.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
    el.style.setProperty('--par-x', `${parX}px`);
    el.style.setProperty('--par-y', `${parY}px`);
    el.style.setProperty('--glare-opacity', '1');
  };

  const handle3DMouseLeave = () => {
    const el = cardRef.current;
    if (el) {
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
      el.style.setProperty('--gx', '50%');
      el.style.setProperty('--gy', '50%');
      el.style.setProperty('--par-x', '0px');
      el.style.setProperty('--par-y', '0px');
      el.style.setProperty('--glare-opacity', '0');
    }
    onHoverCard?.(null);
  };

  const displayName =
    unit?.isAscended && displayCard.ascension
      ? displayCard.ascension.newName
      : displayCard.name;

  const currentAtk = unit ? unit.currentAtk : displayCard.atk;
  const currentArmor = unit ? unit.currentArmor : displayCard.armor;
  const currentHp = unit ? unit.currentHp : displayCard.hp;
  const maxHp = unit ? unit.maxHp : displayCard.hp;
  const activeKeywords = unit ? unit.keywords : displayCard.keywords;

  const hasGuardian = activeKeywords.includes('Guardião');
  const isTapped = Boolean(mode === 'board' && unit?.hasAttackedThisTurn);
  const isSummoningSick = Boolean(
    mode === 'board' && unit?.hasSummoningSickness && !activeKeywords.includes('Ímpeto')
  );

  const isCreatureOrRelic = displayCard.type === 'creature' || displayCard.type === 'relic';

  const affinityIcons =
    displayCard.domain === 'neutral' || displayCard.affinityReq <= 0
      ? '◇'
      : domainInfo.icon.repeat(Math.min(3, displayCard.affinityReq));

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onInspect) {
      onInspect(displayCard);
    } else {
      setInternalInspectCard(displayCard);
    }
  };

  const handleOpenInspect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onInspect) {
      onInspect(displayCard);
    } else {
      setInternalInspectCard(displayCard);
    }
  };

  // Clean redundant keyword prefix from description so cards don't repeat keywords twice
  const cleanDescription = React.useMemo(() => {
    let desc = displayCard.description || '';
    activeKeywords.forEach((kw) => {
      const regex = new RegExp(`^${kw}\\s*(,|\\.|•)\\s*`, 'i');
      desc = desc.replace(regex, '');
    });
    activeKeywords.forEach((kw) => {
      const regex = new RegExp(`^${kw}\\s*(,|\\.|•)\\s*`, 'i');
      desc = desc.replace(regex, '');
    });
    desc = desc.replace(/^Armadura\s+\d+\.\s*/i, '');
    desc = desc.replace(/Relíquia\s+Contínua\s*(\([^)]*\))?\.\s*/gi, '');
    return desc.trim() || displayCard.description;
  }, [displayCard.description, activeKeywords]);

  // =========================================================================
  // TRUE VERTICAL CARD PROPORTIONS ON BOARD (mode === 'board')
  // =========================================================================
  if (mode === 'board') {
    const isBuffedAtk = Boolean(unit && unit.currentAtk > displayCard.atk);
    const isBuffedHp = Boolean(unit && unit.maxHp > displayCard.hp);
    const isDamagedHp = Boolean(unit && unit.currentHp < unit.maxHp);

    return (
      <>
        <div
          ref={cardRef}
          className={[
            'card-frame',
            'card-3d-interactive',
            'mode-board',
            'mtg-board-token',
            `domain-${displayCard.domain}`,
            `rarity-${displayCard.rarity}`,
            displayCard.type === 'relic' ? 'is-relic-arch' : '',
            isSelected ? 'is-selected' : '',
            isValidTarget ? 'is-valid-target' : '',
            isReadyAttacker ? 'is-ready-attacker' : '',
            hasGuardian ? 'has-guardian' : '',
            unit?.isInvading ? 'is-invading-territory' : '',
            isTapped ? 'is-tapped' : '',
            isSummoningSick ? 'is-summoning-sick' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={onClick}
          onContextMenu={handleContextMenu}
          onMouseEnter={() => onHoverCard?.(displayCard, unit)}
          onMouseMove={handle3DMouseMove}
          onMouseLeave={handle3DMouseLeave}
        >
          {/* Dynamic 3D Specular Glare Overlay */}
          <div className="card-3d-glare" />
          <div className="board-summon-shockwave" />

          {/* Floating Damage / Heal / Buff Feedback Pill */}
          {feedback && (
            <div className={`floating-feedback-pill color-${feedback.color}`}>
              {feedback.text}
            </div>
          )}

          {/* Divine Shield Halo */}
          {unit?.hasDivineShield && (
            <div className="divine-shield-halo" />
          )}

          {/* Frozen Ice Overlay */}
          {unit?.isFrozen && (
            <div className="frozen-ice-overlay">
              <span style={{ fontSize: '1.3rem', filter: 'drop-shadow(0 2px 6px #0284c7)' }}>
                ❄️
              </span>
            </div>
          )}

          {/* Hover-Only Tactical Action Strip Floating Above Card (Never covers creature art!) */}
          {unit &&
            !unit.isTrap &&
            (canMoveRow || (canAscend && !unit.isAscended && displayCard.ascension)) && (
            <div className="board-unit-action-strip" onClick={(e) => e.stopPropagation()}>
              {canMoveRow && (
                <button
                  type="button"
                  className="maneuver-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveRowClick?.(e);
                  }}
                >
                  ⇄ {unit.row === 'vanguard' ? 'Recuar' : 'Avançar'}
                </button>
              )}
              {canAscend && !unit.isAscended && displayCard.ascension && (
                <button
                  type="button"
                  className="ascend-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAscendClick?.(e);
                  }}
                >
                  🔥 {displayCard.ascension.cost}⚡
                </button>
              )}
            </div>
          )}

          {/* Compact Top Nameplate (Sitting cleanly ABOVE the artwork, never overlapping the head) */}
          <div className="mtg-token-header">
            <span
              className="mtg-token-cost"
            >
              {displayCard.cost}
            </span>
            <span className="mtg-token-name">
              {unit?.isAscended ? `★ ${displayName}` : displayName}
            </span>
          </div>

          {/* Full-Height Portrait Artwork Stage (Uncropped Creature Silhouette) */}
          <div className={`mtg-token-art aura-${displayCard.domain}`}>
            {!imgError && displayCard.imagePath ? (
              <img
                src={`${displayCard.imagePath}?v=41`}
                alt={displayName}
                className="mtg-token-img"
                onError={() => setImgError(true)}
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div style={{ fontSize: '1.8rem' }}>{domainInfo.icon}</div>
            )}

            {/* Tapped / Exhausted Curved Arrow Watermark (MTG Arena style) */}
            {isTapped && (
              <div className="mtg-tap-watermark">
                ⤵
              </div>
            )}

            {/* Summoning Sickness Subtle Zzz */}
            {isSummoningSick && !isTapped && !unit?.isTrap && (
              <div
                className="mtg-sick-indicator"
              >
                💤
              </div>
            )}

            {/* Armed Reaction Trap Banner */}
            {unit?.isTrap && (
              <div
                className="board-trap-banner"
              >
                🪤 EMBOSCADA
              </div>
            )}

            {/* Target Crosshair Banner only when actively targeting */}
            {isValidTarget && <div className="board-target-banner">🎯 ALVO</div>}
          </div>

          {/* Bottom-Left Mini Keyword Icons (Tucked neatly at the bottom-left edge) */}
          <div className="mtg-token-keywords">
            {(unit?.invasionAtkBonus || unit?.terrainAtkBonus || unit?.formationAtkBonus) ? (
              <span
                className="mtg-kw-hex bonus-invasion"
              >
                +1⚔️
              </span>
            ) : null}
            {activeKeywords.slice(0, 2).map((kw) => (
              <span key={kw} className="mtg-kw-hex">
                {KEYWORD_ICONS[kw] ?? '✦'}
              </span>
            ))}
          </div>

          {/* Bottom-Right Iconic MTG Arena Power/Toughness Plate (e.g. 3/2, 8/10) */}
          {isCreatureOrRelic && !unit?.isTrap && (
            <div className="mtg-token-pt-cluster">
              {(currentArmor > 0 || displayCard.armor > 0) && (
                <span
                  className="mtg-armor-shield"
                >
                  🛡️{currentArmor}
                </span>
              )}
              <div
                className={[
                  'mtg-pt-plate',
                  isDamagedHp ? 'is-damaged' : '',
                  isBuffedAtk || isBuffedHp ? 'is-buffed' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span className={isBuffedAtk ? 'pt-buffed-num' : ''}>{currentAtk}</span>
                <span className="pt-slash">/</span>
                <span
                  className={
                    isDamagedHp ? 'pt-damaged-num' : isBuffedHp ? 'pt-buffed-num' : ''
                  }
                >
                  {currentHp}
                </span>
              </div>
            </div>
          )}
        </div>

        {internalInspectCard && (
          <CardInspectModal
            card={internalInspectCard}
            onClose={() => setInternalInspectCard(null)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div
        ref={cardRef}
        className={[
          'card-frame',
          'card-3d-interactive',
          'sculpted-fantasy-card',
          `mode-${mode}`,
          `domain-${displayCard.domain}`,
          `rarity-${displayCard.rarity}`,
          isPlayable ? 'is-playable' : '',
          isSelected ? 'is-selected' : '',
          isValidTarget ? 'is-valid-target' : '',
          isReadyAttacker ? 'is-ready-attacker' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={onClick}
        onContextMenu={handleContextMenu}
        onMouseEnter={() => onHoverCard?.(displayCard, unit)}
        onMouseMove={handle3DMouseMove}
        onMouseLeave={handle3DMouseLeave}
      >
        {/* Dynamic 3D Specular Glare Overlay */}
        <div className="card-3d-glare" />

        {/* Floating Damage / Heal / Buff Feedback Pill */}
        {feedback && (
          <div className={`floating-feedback-pill color-${feedback.color}`}>
            {feedback.text}
          </div>
        )}

        {/* Top Floating Cost Medallion (Left) & Inspect Button (Right) */}
        <div className="card-floating-header">
          <div className="essence-cost-gem">
            {displayCard.cost}
          </div>
          {mode !== 'inspect' && (
            <button
              type="button"
              className="card-inspect-btn"
              onClick={handleOpenInspect}
              aria-label="Inspecionar detalhes da carta"
              title="Inspecionar detalhes da carta"
            >
              i
            </button>
          )}
        </div>

        {/* Heroic Full-Bleed Artwork Stage with Domain Radial Aura & Living Particles */}
        <div className={`card-art-stage aura-${displayCard.domain}`}>
          <div className={`card-elemental-particles particles-${displayCard.domain}`} />

          {!imgError && displayCard.imagePath ? (
            <img
              src={`${displayCard.imagePath}?v=41`}
              alt={displayName}
              className="card-cutout-img"
              onError={() => setImgError(true)}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div
              style={{
                fontSize: '2.2rem',
                color: domainInfo.color,
                filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.8))',
              }}
            >
              {domainInfo.icon}
            </div>
          )}

          {/* Sculpted Curved Nameplate Banner overlapping bottom of Artwork */}
          <div className="card-sculpted-nameplate">
            <div className="card-name-text">
              {unit?.isAscended ? `★ ${displayName}` : displayName}
            </div>
            <div className="card-sub-ribbon">
              <span
                className="affinity-pips"
                style={{ color: domainInfo.color }}
              >
                {affinityIcons}
              </span>
              <span className="card-type-label">
                {displayCard.subtype &&
                displayCard.subtype
                  .toLowerCase()
                  .startsWith(CARD_TYPE_LABELS[displayCard.type].toLowerCase())
                  ? displayCard.subtype
                  : `${CARD_TYPE_LABELS[displayCard.type]}${
                      displayCard.subtype ? ` • ${displayCard.subtype}` : ''
                    }`}
              </span>
              <span className={`rarity-gem ${displayCard.rarity}`}>
                {RARITY_LABELS[displayCard.rarity]}
              </span>
            </div>
          </div>
        </div>

        {/* Quick 1-Click Action Overlay when Card is Selected in Hand */}
        {mode === 'hand' && isSelected && (
          <div
            className="hand-quick-actions"
            onClick={(e) => e.stopPropagation()}
          >
            {isPlayable && displayCard.type === 'creature' && (
              <>
                {onQuickDeployVanguard && (
                  <button
                    type="button"
                    className="quick-act-btn act-vanguard"
                    onClick={onQuickDeployVanguard}
                  >
                    Vanguarda (Frente)
                  </button>
                )}
                {onQuickDeployRearguard && (
                  <button
                    type="button"
                    className="quick-act-btn act-rearguard"
                    onClick={onQuickDeployRearguard}
                  >
                    Retaguarda (Suporte)
                  </button>
                )}
              </>
            )}

            {isPlayable && displayCard.type === 'relic' && onQuickDeployRearguard && (
              <button
                type="button"
                className="quick-act-btn act-rearguard"
                onClick={onQuickDeployRearguard}
              >
                Posicionar Relíquia
              </button>
            )}

            {isPlayable &&
              (displayCard.type === 'spell' || displayCard.type === 'reaction') &&
              onQuickCast && (
                <button
                  type="button"
                  className="quick-act-btn act-spell"
                  onClick={onQuickCast}
                >
                  Lançar Agora
                </button>
              )}

            {isPlayable && displayCard.type === 'reaction' && onQuickArmTrap && (
              <button
                type="button"
                className="quick-act-btn act-rearguard"
                onClick={onQuickArmTrap}
              >
                Armar Emboscada
              </button>
            )}

            {canChannel && onQuickChannel && (
              <button
                type="button"
                className="quick-act-btn act-channel"
                onClick={onQuickChannel}
              >
                Canalizar (+1 Afin. & Compra)
              </button>
            )}

            {onQuickBurn && (
              <button
                type="button"
                className="quick-act-btn act-burn"
                onClick={onQuickBurn}
              >
                Sacrificar (+1 Essência)
              </button>
            )}
          </div>
        )}

        {/* Clean Scrollbar-Free Lore & Effect Parchment Box */}
        <div className="card-text-box">
          {activeKeywords.length > 0 && (
            <div className="keywords-row">
              {activeKeywords.map((kw) => (
                <span key={kw} className="keyword-pill">
                  {KEYWORD_ICONS[kw]} {kw}
                </span>
              ))}
            </div>
          )}
          <div className="card-ability-desc">
            {cleanDescription}
          </div>
        </div>

        {/* Sculpted Bottom Medallions: Always Visible ATK | ARM | HP */}
        <div className="card-bottom-bar">
          {isCreatureOrRelic ? (
            <>
              <div
                className={`stat-badge stat-atk ${
                  unit && unit.currentAtk > displayCard.atk ? 'stat-buffed' : ''
                }`}
              >
                <span className="stat-label-mini">ATQ</span>
                <span className="stat-num">{currentAtk}</span>
              </div>

              {(currentArmor > 0 || displayCard.armor > 0) ? (
                <div
                  className="stat-badge stat-arm"
                >
                  <span className="stat-label-mini">ARM</span>
                  <span className="stat-num">{currentArmor}</span>
                </div>
              ) : (
                <div className="card-bottom-gem-divider">❖</div>
              )}

              <div
                className={`stat-badge stat-hp ${
                  unit && unit.currentHp < unit.maxHp ? 'is-damaged' : ''
                } ${unit && unit.maxHp > displayCard.hp ? 'stat-buffed' : ''}`}
              >
                <span className="stat-label-mini">VID</span>
                <span className="stat-num">{currentHp}</span>
              </div>
            </>
          ) : (
            <div className="spell-bottom-ribbon">
              <span>{displayCard.type === 'spell' ? 'FEITIÇO ARCANO' : 'REAÇÃO / EMBOSCADA'}</span>
              {displayCard.corruptionCost ? (
                <span className="corruption-cost-tag">CORRUPÇÃO +{displayCard.corruptionCost}</span>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* Fallback Internal Inspect Modal if parent didn't pass onInspect */}
      {internalInspectCard && (
        <CardInspectModal
          card={internalInspectCard}
          onClose={() => setInternalInspectCard(null)}
        />
      )}
    </>
  );
};

export interface CardInspectModalProps {
  card: CardDefinition;
  onClose: () => void;
}

export const CardInspectModal: React.FC<CardInspectModalProps> = ({ card: rawCard, onClose }) => {
  const card = CARDS_BY_ID[rawCard.id] ?? rawCard;
  const domainInfo = DOMAIN_META[card.domain] || DOMAIN_META.neutral;

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const modalContent = (
    <div
      className="modal-backdrop"
      style={{ zIndex: 9999 }}
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div
        className="modal-panel"
        style={{ maxWidth: '720px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
            paddingBottom: '0.65rem',
          }}
        >
          <div>
            <h2 className="font-cinzel gold-gradient-text" style={{ fontSize: '1.35rem' }}>
              {card.name}
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              {domainInfo.icon} {domainInfo.name} • {CARD_TYPE_LABELS[card.type]} ({card.subtype}) •{' '}
              {RARITY_LABELS[card.rarity]}
            </p>
          </div>
          <button type="button" className="btn-fantasy" onClick={onClose}>
            ✕ Fechar
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Full Inspect Card Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <CardView card={card} mode="inspect" />
            {card.preferredRow && card.type === 'creature' && (
              <div
                style={{
                  fontSize: '0.76rem',
                  color: '#cbd5e1',
                  background: 'rgba(15, 23, 42, 0.85)',
                  padding: '0.35rem 0.8rem',
                  borderRadius: '999px',
                  border: '1px solid rgba(212, 175, 55, 0.35)',
                }}
              >
                Posição Recomendada:{' '}
                <strong style={{ color: '#fde68a' }}>
                  {card.preferredRow === 'vanguard' ? '🛡️ Vanguarda (Frente)' : '🏹 Retaguarda (Suporte)'}
                </strong>
              </div>
            )}
          </div>

          {/* Right Column: Pure In-Universe Rules, Keywords & Lore */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <div
              style={{
                padding: '1rem',
                borderRadius: '10px',
                background: 'rgba(15, 23, 42, 0.78)',
                border: '1px solid rgba(148, 163, 184, 0.25)',
              }}
            >
              <div
                style={{
                  fontSize: '0.74rem',
                  textTransform: 'uppercase',
                  color: '#f59e0b',
                  fontWeight: 700,
                  marginBottom: '0.45rem',
                }}
              >
                Efeitos & Habilidades de Combate
              </div>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.5, color: '#f1f5f9' }}>
                {card.description}
              </p>

              {card.keywords.length > 0 && (
                <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {card.keywords.map((kw) => (
                    <div key={kw} style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                      <strong style={{ color: '#fde68a' }}>• {kw}:</strong> {KEYWORD_TOOLTIPS[kw]}
                    </div>
                  ))}
                </div>
              )}

              {card.ascension && (
                <div
                  style={{
                    marginTop: '0.75rem',
                    paddingTop: '0.6rem',
                    borderTop: '1px dashed rgba(245, 158, 11, 0.35)',
                    fontSize: '0.82rem',
                    color: '#fde68a',
                  }}
                >
                  <strong>🔥 Ascensão ({card.ascension.cost} Essência):</strong>{' '}
                  Evolui em campo para <em>{card.ascension.newName}</em> (
                  <strong>
                    ⚔️ {card.ascension.newAtk} / 🛡️ {card.ascension.newArmor} / ❤️{' '}
                    {card.ascension.newMaxHp}
                  </strong>
                  ).
                </div>
              )}
            </div>

            {/* Flavor Text */}
            <div
              style={{
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                background: 'rgba(30, 41, 59, 0.5)',
                borderLeft: '3px solid #d4af37',
                fontStyle: 'italic',
                fontSize: '0.86rem',
                lineHeight: 1.45,
                color: '#cbd5e1',
              }}
            >
              “{card.flavorText}”
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
};
