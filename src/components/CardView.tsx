import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { CARDS_BY_ID } from '../data/cards';
import type { CardPoemAppearance } from '../data/epicPoemData';
import { dispatchNavigateToPoem } from '../data/epicPoemEvents';
import type { CardMythologyEntry } from '../data/mythologyLore';
import {
  formatCardDetailedRules,
  formatCardFaceDescription,
  getAscensionBonusNote,
} from '../utils/cardTextFormatter';
import { playCardHoverFoley, slotIndexToStereoPan } from '../utils/soundEngine';
import { resolvePrimaryBossDomain } from '../data/vaeloriaMapData';
import {
  BoardUnit,
  CardDefinition,
  Domain,
  FloatingFeedback,
  Keyword,
  Rarity,
} from '../types/game';

export { formatCardDetailedRules, formatCardFaceDescription, resolvePrimaryBossDomain };

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
    color: '#cbd5e1',
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
  Guardião:
    'Na Vanguarda: trava atacantes terrestres (todas as 6 colunas) e Alcance, e dá +1 ARM a vizinhos. Na Retaguarda: intercepta só Vanguarda terrestre até ±1 coluna. Só para Voo se tiver Guardião + Voo.',
  Voo:
    'Ataca qualquer coluna ignorando defensores sem Voo — só é bloqueado por Guardião + Voo. Ter apenas Voo não bloqueia voadores inimigos.',
  Alcance:
    'Atinge alvos terrestres ou com Voo em qualquer coluna (travado só por Guardião na Vanguarda). Na Retaguarda não sofre contra-ataque; na Vanguarda sofre.',
  Ímpeto:
    'Ataca no turno em que entra (criaturas ou Soberano) e age primeiro na Onda 2: se abater alvo sem Ímpeto, não sofre contra-ataque.',
  Atropelar:
    'Ao destruir o defensor, o dano excedente varre as demais cartas empilhadas no slot e depois atinge o Soberano rival.',
  'Toque Letal':
    'Ao causar 1+ de dano real: executa a criatura no corpo a corpo (ou atacando da Vanguarda); em disparo com Alcance na Retaguarda, aplica -1 de veneno extra.',
  'Escudo Divino':
    'Anula completamente a primeira instância de dano que sofreria (inclusive evitando Toque Letal nesse golpe).',
  'Dreno de Vida':
    'Restaura +2 PV no seu Soberano ao causar dano direto ao Soberano rival, ou +1 PV ao causar dano real a criaturas (atacando ou contra-atacando).',
  Renascer: 'Na primeira vez que morre, retorna imediatamente ao campo com 1 de Vida.',
  'Pele Incandescente':
    'Ao sofrer ataque engajado (sem Alcance da Retaguarda), causa +1 de dano de fogo de retorno ao atacante.',
  'Fúria Crescente': 'Ganha +2 de ATQ permanentemente sempre que sobrevive a dano.',
};

export type UnitKeywordFxType =
  | 'shield_shatter'
  | 'reborn_rise'
  | 'lifedrain_pulse'
  | 'molten_burst'
  | 'fury_surge';

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
  keywordFx?: UnitKeywordFxType | null;
  concealEnemyTrap?: boolean;
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
  Ímpeto: '↯',
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
  keywordFx = null,
  concealEnemyTrap = false,
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

  // Generate clear, natural Portuguese sentence description from the card's actual engine parameters
  const isAscendedUnit = Boolean(unit?.isAscended);
  const cleanDescription = React.useMemo(() => {
    return formatCardFaceDescription(displayCard, activeKeywords, isAscendedUnit);
  }, [displayCard, activeKeywords, isAscendedUnit]);

  // =========================================================================
  // TRUE VERTICAL CARD PROPORTIONS ON BOARD (mode === 'board')
  // =========================================================================
  if (mode === 'board') {
    if (concealEnemyTrap && unit?.isTrap && unit.owner === 'ai') {
      return (
        <div
          ref={cardRef}
          className={[
            'tabletop-facedown-card',
            'is-concealed-trap',
            isValidTarget ? 'is-valid-target' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={onClick}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          title="Reação Oculta na Retaguarda"
        >
          {feedback && (
            <div className={`floating-feedback-pill color-${feedback.color}`}>
              {feedback.text}
            </div>
          )}
          <svg
            viewBox="0 0 96 130"
            className="facedown-card-svg"
            aria-hidden="true"
          >
            <rect
              x="6"
              y="6"
              width="84"
              height="118"
              rx="6"
              fill="none"
              stroke="rgba(212, 175, 55, 0.42)"
              strokeWidth="1.2"
            />
            <polygon
              points="48,22 72,65 48,108 24,65"
              fill="rgba(212, 175, 55, 0.08)"
              stroke="rgba(212, 175, 55, 0.55)"
              strokeWidth="1.3"
            />
            <circle
              cx="48"
              cy="65"
              r="14"
              fill="rgba(15, 23, 42, 0.9)"
              stroke="rgba(253, 224, 71, 0.68)"
              strokeWidth="1.4"
            />
            <polygon
              points="48,55 55,65 48,75 41,65"
              fill="rgba(253, 224, 71, 0.78)"
            />
          </svg>
          <span className="concealed-trap-seal">Oculta</span>
          {isValidTarget && <div className="board-target-banner">ALVO</div>}
        </div>
      );
    }

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
            'cpa-board-token',
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
            keywordFx === 'reborn_rise' ? 'is-kw-reborn-rising' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={onClick}
          onContextMenu={handleContextMenu}
          onMouseEnter={() => {
            playCardHoverFoley(unit ? slotIndexToStereoPan(unit.slotIndex) : 0);
            onHoverCard?.(displayCard, unit);
          }}
          onMouseMove={handle3DMouseMove}
          onMouseLeave={handle3DMouseLeave}
        >
          {/* Dynamic 3D Specular Glare Overlay */}
          <div className="card-3d-glare" />
          <div className="board-summon-shockwave" />

          {/* Keyword Combat Micro-VFX Layer (GPU-composited, pointer-events: none) */}
          {keywordFx && (
            <div className={`kw-vfx-layer fx-${keywordFx}`} aria-hidden="true">
              {keywordFx === 'shield_shatter' && (
                <>
                  <span className="kw-shatter-ring" />
                  {[0, 1, 2, 3, 4, 5].map((sIdx) => (
                    <span
                      key={sIdx}
                      className="kw-shatter-shard"
                      style={{ '--shard-idx': sIdx } as React.CSSProperties}
                    />
                  ))}
                </>
              )}
              {keywordFx === 'reborn_rise' && (
                <>
                  <span className="kw-reborn-aura" />
                  <span className="kw-reborn-crest" />
                </>
              )}
              {keywordFx === 'lifedrain_pulse' && <span className="kw-lifedrain-ring" />}
              {keywordFx === 'molten_burst' && (
                <>
                  <span className="kw-molten-wave" />
                  {[0, 1, 2, 3].map((eIdx) => (
                    <span
                      key={eIdx}
                      className="kw-molten-ember"
                      style={{ '--ember-idx': eIdx } as React.CSSProperties}
                    />
                  ))}
                </>
              )}
              {keywordFx === 'fury_surge' && <span className="kw-fury-flare" />}
            </div>
          )}

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
          <div className="cpa-token-header">
            <span
              className="cpa-token-cost"
            >
              {displayCard.cost}
            </span>
            <span className="cpa-token-name">
              {unit?.isCrownProtector
                ? `♛ ${displayName}`
                : unit?.isEphemeralSpecter
                ? `❖ ${displayName}`
                : unit?.isAscended
                ? `★ ${displayName}`
                : displayName}
            </span>
          </div>

          {/* Full-Height Portrait Artwork Stage (Uncropped Creature Silhouette) */}
          <div className={`cpa-token-art aura-${displayCard.domain}`}>
            {!imgError && displayCard.imagePath ? (
              <img
                src={`${displayCard.imagePath}?v=75`}
                alt={displayName}
                className="cpa-token-img"
                onError={() => setImgError(true)}
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div style={{ fontSize: '1.8rem' }}>{domainInfo.icon}</div>
            )}

            {/* Tapped / Exhausted Curved Arrow Watermark */}
            {isTapped && (
              <div className="cpa-tap-watermark">
                ⤵
              </div>
            )}

            {/* Summoning Sickness Subtle Zzz */}
            {isSummoningSick && !isTapped && !unit?.isTrap && (
              <div
                className="cpa-sick-indicator"
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
          <div className="cpa-token-keywords">
            {(unit?.invasionAtkBonus || unit?.terrainAtkBonus || unit?.formationAtkBonus) ? (
              <span
                className="cpa-kw-hex bonus-invasion"
              >
                +1⚔️
              </span>
            ) : null}
            {activeKeywords.slice(0, 2).map((kw) => {
              const isSpentKw =
                (kw === 'Renascer' && Boolean(unit?.hasRebornTriggered)) ||
                (kw === 'Escudo Divino' && Boolean(unit && !unit.hasDivineShield));
              return (
                <span
                  key={kw}
                  className={`cpa-kw-hex ${isSpentKw ? 'is-spent-keyword' : ''}`}
                >
                  {KEYWORD_ICONS[kw] ?? '✦'}
                </span>
              );
            })}
          </div>

          {/* Bottom-Right Iconic Power/Toughness Plate (e.g. 3/2, 8/10) */}
          {isCreatureOrRelic && !unit?.isTrap && (
            <div className="cpa-token-pt-cluster">
              {(currentArmor > 0 || displayCard.armor > 0) && (
                <span
                  className="cpa-armor-shield"
                >
                  🛡️{currentArmor}
                </span>
              )}
              <div
                className={[
                  'cpa-pt-plate',
                  isDamagedHp ? 'is-damaged' : '',
                  isBuffedAtk || isBuffedHp ? 'is-buffed' : '',
                  keywordFx === 'fury_surge' ? 'is-fury-surge' : '',
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
        onMouseEnter={() => {
          if (mode === 'hand') {
            playCardHoverFoley(0);
          }
          onHoverCard?.(displayCard, unit);
        }}
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
              ⊕
            </button>
          )}
        </div>

        {/* Heroic Full-Bleed Artwork Stage with Domain Radial Aura & Living Particles */}
        <div className={`card-art-stage aura-${displayCard.domain}`}>
          <div className={`card-elemental-particles particles-${displayCard.domain}`} />

          {!imgError && displayCard.imagePath ? (
            <img
              src={`${displayCard.imagePath}?v=75`}
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
        {mode === 'hand' &&
          isSelected &&
          Boolean(
            (isPlayable &&
              displayCard.type === 'creature' &&
              (onQuickDeployVanguard || onQuickDeployRearguard)) ||
              (isPlayable && displayCard.type === 'relic' && onQuickDeployRearguard) ||
              (isPlayable &&
                (displayCard.type === 'spell' || displayCard.type === 'reaction') &&
                onQuickCast) ||
              (isPlayable && displayCard.type === 'reaction' && onQuickArmTrap) ||
              (canChannel && onQuickChannel) ||
              onQuickBurn,
          ) && (
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
                <span className="corruption-cost-tag">SOBRECARGA +{displayCard.corruptionCost}</span>
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

export interface CardInspectCraftInfo {
  ownedCopies: number;
  maxAllowed: number;
  cost: number;
  astralShards: number;
  canCraft: boolean;
  onCraft: (card: CardDefinition) => void;
}

export interface CardInspectModalProps {
  card: CardDefinition;
  onClose: () => void;
  craftInfo?: CardInspectCraftInfo | null;
}

export const CardInspectModal: React.FC<CardInspectModalProps> = ({
  card: rawCard,
  onClose,
  craftInfo,
}) => {
  const card = CARDS_BY_ID[rawCard.id] ?? rawCard;
  const domainInfo = DOMAIN_META[card.domain] || DOMAIN_META.neutral;
  const [poemState, setPoemState] = useState<{
    appearances: CardPoemAppearance[];
    fallbackChronicle: CardMythologyEntry | null;
    parallelByParent: typeof import('../data/epicPoemData').PARALLEL_CANTOS_BY_PARENT_ID | null;
  }>({ appearances: [], fallbackChronicle: null, parallelByParent: null });

  React.useEffect(() => {
    let cancelled = false;
    Promise.all([import('../data/epicPoemData'), import('../data/mythologyLore')])
      .then(([poemMod, loreMod]) => {
        if (cancelled) return;
        const apps = poemMod.EPIC_POEM_APPEARANCES_BY_CARD_ID[card.id] ?? [];
        const fallback = apps[0] ? null : loreMod.getCardChronicleAndSong(card);
        setPoemState({
          appearances: apps,
          fallbackChronicle: fallback,
          parallelByParent: poemMod.PARALLEL_CANTOS_BY_PARENT_ID,
        });
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [card]);

  const poemAppearances = poemState.appearances;
  const primaryPoem = poemAppearances[0] ?? null;
  const fallbackChronicle = poemState.fallbackChronicle;

  const resolveEraCantoId = (eraTitle: string): string => {
    if (eraTitle.startsWith('Era Zero')) return 'canto_1_vigilia';
    if (eraTitle.startsWith('Iª Era')) return 'canto_2_fratura';
    if (eraTitle.startsWith('IIª Era')) return 'canto_3_cidadelas';
    if (eraTitle.startsWith('IIIª Era')) return 'canto_4_guerra';
    if (eraTitle.startsWith('IVª Era')) return 'canto_5_pacto';
    if (eraTitle.startsWith('Vª Era')) return 'canto_6_tratados';
    return 'canto_7_presente';
  };

  const handleJumpToPoem = (
    cantoId: string,
    chapterId: string,
    nodeId: string
  ) => {
    onClose();
    dispatchNavigateToPoem({
      cardId: card.id,
      cantoId,
      chapterId,
      nodeId,
    });
  };

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
              { RARITY_LABELS[card.rarity] }
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {craftInfo && (
              <button
                type="button"
                className="btn-fantasy btn-fantasy-primary"
                disabled={!craftInfo.canCraft}
                onClick={() => craftInfo.onCraft(card)}
                title={
                  craftInfo.ownedCopies >= craftInfo.maxAllowed
                    ? `Limite máximo atingido na coleção (${craftInfo.ownedCopies}/${craftInfo.maxAllowed})`
                    : craftInfo.canCraft
                    ? `Forjar +1 cópia desta carta por ${craftInfo.cost} Estilhaços Astrais`
                    : `Estilhaços insuficientes (${craftInfo.astralShards}/${craftInfo.cost})`
                }
                style={{ fontSize: '0.75rem', padding: '5px 12px' }}
              >
                {craftInfo.ownedCopies >= craftInfo.maxAllowed
                  ? `✓ Coleção Completa (${craftInfo.ownedCopies}/${craftInfo.maxAllowed})`
                  : `Forjar Cópia (-${craftInfo.cost} Estilhaços • ${craftInfo.ownedCopies}/${craftInfo.maxAllowed})`}
              </button>
            )}
            <button type="button" className="btn-fantasy" onClick={onClose}>
              ✕ Fechar
            </button>
          </div>
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
                <strong style={{ color: '#e5c97b' }}>
                  {card.preferredRow === 'vanguard' ? 'Vanguarda (Frente)' : 'Retaguarda (Suporte)'}
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
                border: '1px solid rgba(148, 163, 184, 0.22)',
              }}
            >
              <div
                style={{
                  fontSize: '0.74rem',
                  textTransform: 'uppercase',
                  color: '#d4af37',
                  fontWeight: 700,
                  marginBottom: '0.45rem',
                }}
              >
                Efeitos & Habilidades de Combate
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {formatCardDetailedRules(card).map((sentence, idx) => (
                  <p
                    key={idx}
                    style={{
                      fontSize: '0.9rem',
                      lineHeight: 1.5,
                      color: '#f1f5f9',
                      margin: 0,
                    }}
                  >
                    {sentence}
                  </p>
                ))}
              </div>

              {card.keywords.length > 0 && (
                <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {card.keywords.map((kw) => (
                    <div key={kw} style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                      <strong style={{ color: '#e5c97b' }}>• {kw}:</strong> {KEYWORD_TOOLTIPS[kw]}
                    </div>
                  ))}
                </div>
              )}

              {card.ascension && (() => {
                const newlyAddedKws = card.ascension.addedKeywords.filter(
                  (kw) => !card.keywords.includes(kw)
                );
                const bonusNote = getAscensionBonusNote(card.id);
                return (
                  <div
                    style={{
                      marginTop: '0.75rem',
                      paddingTop: '0.6rem',
                      borderTop: '1px dashed rgba(212, 175, 55, 0.32)',
                      fontSize: '0.82rem',
                      color: '#e5c97b',
                    }}
                  >
                    <strong>Ascensão ({card.ascension.cost} Essência):</strong>{' '}
                    Evolui para <em>{card.ascension.newName}</em> (
                    <strong>
                      ATQ {card.ascension.newAtk} • ARM {card.ascension.newArmor} • PV{' '}
                      {card.ascension.newMaxHp}
                      {newlyAddedKws.length > 0 ? ` • +${newlyAddedKws.join(', +')}` : ''}
                    </strong>
                    ).{bonusNote ? ` ${bonusNote}` : ''}
                  </div>
                );
              })()}
            </div>

            {/* Flavor Text */}
            <div
              style={{
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                background: 'rgba(15, 23, 42, 0.65)',
                borderLeft: '2px solid rgba(212, 175, 55, 0.5)',
                fontStyle: 'italic',
                fontSize: '0.86rem',
                lineHeight: 1.45,
                color: '#cbd5e1',
              }}
            >
              “{card.flavorText}”
            </div>

            {/* Direct Bridge Card <-> Epic Poem of Vaeloria */}
            {primaryPoem ? (
              <div className="inspect-poem-bridge-card">
                <div className="inspect-poem-bridge-header">
                  <span className="inspect-poem-kicker">
                    Cap. {primaryPoem.chapterCode} • {primaryPoem.node.yearLabel}
                  </span>
                  <span className="inspect-poem-loc">
                    {primaryPoem.node.locationLabel}
                  </span>
                </div>
                {primaryPoem.node.stanzas[0] && (
                  <div className="inspect-poem-stanza-preview">
                    {primaryPoem.node.stanzas[0].map((line, lIdx) => (
                      <div key={lIdx}>{line}</div>
                    ))}
                  </div>
                )}
                <div className="inspect-poem-actions">
                  <button
                    type="button"
                    className="btn-fantasy inspect-poem-jump-btn"
                    onClick={() =>
                      handleJumpToPoem(
                        primaryPoem.cantoId,
                        primaryPoem.chapterId,
                        primaryPoem.node.id
                      )
                    }
                  >
                    Ler no Grande Poema (Cap. {primaryPoem.chapterCode}) →
                  </button>
                  {poemAppearances.length > 1 && (
                    <div className="inspect-poem-extra-chapters">
                      <span>Também em:</span>
                      {poemAppearances.slice(1, 5).map((alt) => (
                        <button
                          key={`${alt.chapterId}-${alt.node.id}`}
                          type="button"
                          className="inspect-poem-alt-pill"
                          onClick={() =>
                            handleJumpToPoem(alt.cantoId, alt.chapterId, alt.node.id)
                          }
                          title={`${alt.chapterTitle} (${alt.periodLabel})`}
                        >
                          Cap. {alt.chapterCode}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : fallbackChronicle ? (
              <div className="inspect-poem-bridge-card is-era-fallback">
                <div className="inspect-poem-bridge-header">
                  <span className="inspect-poem-kicker">
                    {fallbackChronicle.eraTitle}
                  </span>
                  <span className="inspect-poem-loc">
                    {fallbackChronicle.yearLabel} • {fallbackChronicle.locationLabel}
                  </span>
                </div>
                <div className="inspect-poem-actions">
                  <button
                    type="button"
                    className="btn-fantasy inspect-poem-jump-btn"
                    onClick={() => {
                      const targetCantoId = resolveEraCantoId(fallbackChronicle.eraTitle);
                      const chapters = poemState.parallelByParent?.[targetCantoId] || [];
                      const domainMatch =
                        chapters.find((ch) =>
                          ch.nodes.some((n) => n.domain === card.domain)
                        ) || chapters[0];
                      handleJumpToPoem(
                        targetCantoId,
                        domainMatch?.id || '',
                        domainMatch?.nodes[0]?.id || ''
                      );
                    }}
                  >
                    Explorar Era no Grande Poema →
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
};
