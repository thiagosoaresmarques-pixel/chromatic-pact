import React, { useState, useMemo } from 'react';
import { CardDefinition, Domain } from '../types/game';
import { ALL_CARDS, CARDS_BY_ID } from '../data/cards';
import { playSfx } from '../utils/soundEngine';
import { CardView, CardInspectModal, RARITY_LABELS } from './CardView';

export interface PackOpenerProps {
  gold: number;
  unlockedCardIds: Record<string, number>;
  onOpenPack: (packCost: number, cards: CardDefinition[]) => void;
  isGuest?: boolean;
  hasCustomDeck?: boolean;
  onRequireAccount?: () => void;
  onRequireDeckSetup?: () => void;
}

interface PackTypeOption {
  id: string;
  name: string;
  kicker: string;
  subtitle: string;
  domain: Domain | 'all';
  cost: number;
  accent: string;
  coverCardId: string;
}

const PACK_OPTIONS: PackTypeOption[] = [
  {
    id: 'pack_all',
    name: 'Relicário Pentacromático',
    kicker: 'COLEÇÃO UNIVERSAL',
    subtitle: '5 cartas de qualquer Domínio • 1 Rara ou Lendária garantida',
    domain: 'all',
    cost: 30,
    accent: '#d4af37',
    coverCardId: 'neutral_10_valkyra_pentacromatica',
  },
  {
    id: 'pack_red',
    name: 'Chama & Escama',
    kicker: 'DOMÍNIO RUBRO',
    subtitle: 'Dragões, Piroclasmos, Sopro Elemental e Fúria Dracônica',
    domain: 'red',
    cost: 30,
    accent: '#ef4444',
    coverCardId: 'red_08_dragao_vermelho',
  },
  {
    id: 'pack_blue',
    name: 'Tempestade & Runa',
    kicker: 'DOMÍNIO SAFIRA',
    subtitle: 'Gigantes, Gelo, Voo, Cronomancia e Controle Arcano',
    domain: 'blue',
    cost: 30,
    accent: '#38bdf8',
    coverCardId: 'blue_06_dragao_azul',
  },
  {
    id: 'pack_purple',
    name: 'Abismo & Sombra',
    kicker: 'DOMÍNIO ABISSAL',
    subtitle: 'Demônios, Mortos-Vivos, Pactos de Sangue e Reanimação',
    domain: 'purple',
    cost: 30,
    accent: '#a855f7',
    coverCardId: 'purple_08_lorde_abissal',
  },
  {
    id: 'pack_green',
    name: 'Selva & Fera',
    kicker: 'DOMÍNIO ESMERALDA',
    subtitle: 'Predadores colossais, Toque Letal, Atropelar e Regeneração',
    domain: 'green',
    cost: 30,
    accent: '#10b981',
    coverCardId: 'green_09_hidra',
  },
  {
    id: 'pack_gold',
    name: 'Ordem & Ferro',
    kicker: 'DOMÍNIO SOLAR',
    subtitle: 'Paladinos, Golens, Escudo Divino, Armadura e Relíquias',
    domain: 'gold',
    cost: 30,
    accent: '#f59e0b',
    coverCardId: 'gold_09_serafim_solar',
  },
];

function generateBoosterCards(domainFilter: Domain | 'all'): CardDefinition[] {
  const pool =
    domainFilter === 'all'
      ? ALL_CARDS
      : ALL_CARDS.filter((c) => c.domain === domainFilter || c.domain === 'neutral');

  const safePool = pool.length >= 5 ? pool : ALL_CARDS;

  const commons = safePool.filter((c) => c.rarity === 'common');
  const uncommons = safePool.filter((c) => c.rarity === 'uncommon');
  const rares = safePool.filter((c) => c.rarity === 'rare');
  const legendaries = safePool.filter((c) => c.rarity === 'legendary');

  const pickRandom = (arr: CardDefinition[]): CardDefinition => {
    const target = arr.length > 0 ? arr : safePool;
    return target[Math.floor(Math.random() * target.length)];
  };

  const result: CardDefinition[] = [];
  result.push(pickRandom(commons));
  result.push(pickRandom(commons));
  result.push(Math.random() < 0.2 ? pickRandom(rares) : pickRandom(uncommons));
  result.push(Math.random() < 0.25 ? pickRandom(rares) : pickRandom(uncommons));

  if (Math.random() < 0.28 && legendaries.length > 0) {
    result.push(pickRandom(legendaries));
  } else {
    result.push(pickRandom(rares));
  }

  return result;
}

export const PackOpener: React.FC<PackOpenerProps> = ({
  gold,
  unlockedCardIds,
  onOpenPack,
  isGuest = false,
  onRequireAccount,
}) => {
  const [selectedPackId, setSelectedPackId] = useState<string>('pack_all');
  const [currentPackCards, setCurrentPackCards] = useState<CardDefinition[]>([]);
  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);
  const [inspectCard, setInspectCard] = useState<CardDefinition | null>(null);

  const selectedPack =
    PACK_OPTIONS.find((p) => p.id === selectedPackId) ?? PACK_OPTIONS[0];

  const collectionStats = useMemo(() => {
    let uniqueUnlocked = 0;
    let totalCopies = 0;
    const byRarity = { common: 0, uncommon: 0, rare: 0, legendary: 0 };

    for (const card of ALL_CARDS) {
      const count = unlockedCardIds[card.id] ?? 0;
      if (count > 0) {
        uniqueUnlocked += 1;
        totalCopies += count;
        byRarity[card.rarity] += 1;
      }
    }

    return {
      uniqueUnlocked,
      totalCards: ALL_CARDS.length,
      totalCopies,
      byRarity,
    };
  }, [unlockedCardIds]);

  const handleBuyAndOpenPack = () => {
    if (isGuest) {
      onRequireAccount?.();
      return;
    }
    if (gold < selectedPack.cost) return;
    const drawn = generateBoosterCards(selectedPack.domain);
    setCurrentPackCards(drawn);
    setRevealedIndices([]);
    onOpenPack(selectedPack.cost, drawn);
    playSfx('pack_open');
  };

  const handleRevealCard = (idx: number) => {
    if (revealedIndices.includes(idx)) return;
    const card = currentPackCards[idx];
    if (card?.rarity === 'legendary') {
      playSfx('ascend');
    } else {
      playSfx('draw');
    }
    setRevealedIndices((prev) => [...prev, idx]);
  };

  const handleRevealAll = () => {
    const allIdx = currentPackCards.map((_, idx) => idx);
    setRevealedIndices(allIdx);
    const hasLegendary = currentPackCards.some((c) => c.rarity === 'legendary');
    playSfx(hasLegendary ? 'ascend' : 'pack_open');
  };

  const pct = Math.min(
    100,
    Math.round((collectionStats.uniqueUnlocked / Math.max(1, collectionStats.totalCards)) * 100)
  );

  return (
    <div className="aaa-page-shell">
      {/* Minimalist Collection Progress Strip */}
      <div className="aaa-collection-strip">
        <div className="aaa-rarity-counts">
          <span>
            COLEÇÃO <strong>{collectionStats.uniqueUnlocked}/{collectionStats.totalCards}</strong>
          </span>
          <span>COMUNS <strong>{collectionStats.byRarity.common}</strong></span>
          <span>INCOMUNS <strong>{collectionStats.byRarity.uncommon}</strong></span>
          <span>RARAS <strong>{collectionStats.byRarity.rare}</strong></span>
          <span>LENDÁRIAS <strong className="gold-text">{collectionStats.byRarity.legendary}</strong></span>
        </div>
        <div className="aaa-progress-track">
          <div className="aaa-progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* 6 Booster Pack Foil Cards with Real Artwork */}
      <div className="aaa-packs-grid">
        {PACK_OPTIONS.map((pack) => {
          const isSelected = pack.id === selectedPackId;
          const coverCard = CARDS_BY_ID[pack.coverCardId] ?? ALL_CARDS[0];
          return (
            <div
              key={pack.id}
              onClick={() => setSelectedPackId(pack.id)}
              className={`aaa-pack-card ${isSelected ? 'is-selected' : ''}`}
              style={{ '--pack-accent': pack.accent } as React.CSSProperties}
            >
              <div className="aaa-pack-art-wrap">
                {coverCard?.imagePath && (
                  <img src={coverCard.imagePath} alt={pack.name} className="aaa-pack-art" />
                )}
                <div className="aaa-pack-vignette" />
              </div>

              <div className="aaa-pack-body" style={{ padding: '0.65rem 0.75rem', gap: '0.35rem' }}>
                <h3 className="font-cinzel aaa-pack-title" style={{ fontSize: '0.84rem' }}>{pack.name}</h3>
                <div className="aaa-pack-footer">
                  <span className="aaa-pack-price">{pack.cost} OURO</span>
                  {isSelected && <span className="aaa-pack-select-indicator">✓</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Bar */}
      <div className="aaa-pack-action-bar">
        <button
          type="button"
          className="aaa-btn aaa-btn-primary aaa-btn-lg"
          disabled={!isGuest && gold < selectedPack.cost}
          onClick={handleBuyAndOpenPack}
        >
          {isGuest
            ? `Entrar para Abrir (${selectedPack.cost} Ouro)`
            : `Abrir ${selectedPack.name} (${selectedPack.cost} Ouro)`}
        </button>

        {currentPackCards.length > 0 && revealedIndices.length < currentPackCards.length && (
          <button
            type="button"
            className="aaa-btn aaa-btn-secondary aaa-btn-lg"
            onClick={handleRevealAll}
          >
            Revelar Todas
          </button>
        )}
      </div>

      {/* Pack Reveal Stage */}
      {currentPackCards.length > 0 && (
        <div className="aaa-pack-reveal-stage">
          <div className="aaa-pack-cards-row">
            {currentPackCards.map((card, idx) => {
              const isRevealed = revealedIndices.includes(idx);
              const totalOwned = unlockedCardIds[card.id] ?? 1;

              return (
                <div key={`${card.id}-pack-${idx}`} className="aaa-revealed-slot">
                  {!isRevealed ? (
                    <div
                      onClick={() => handleRevealCard(idx)}
                      className={`aaa-card-back rarity-${card.rarity}`}
                    >
                      <div className="aaa-card-back-emblem">❖</div>
                      <div className="font-cinzel aaa-card-back-title">CHROMATIC PACT</div>
                      <div className={`aaa-card-back-rarity rarity-${card.rarity}`}>
                        {RARITY_LABELS[card.rarity]}
                      </div>
                      <span className="aaa-card-back-cta">REVELAR</span>
                    </div>
                  ) : (
                    <div className="aaa-revealed-card-wrap">
                      <CardView card={card} mode="gallery" onInspect={setInspectCard} />
                      <span className="aaa-owned-tag">Na Coleção: {totalOwned}x</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {inspectCard && (
        <CardInspectModal card={inspectCard} onClose={() => setInspectCard(null)} />
      )}
    </div>
  );
};
