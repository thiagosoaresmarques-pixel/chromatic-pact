import React, { useState, useMemo } from 'react';
import { CardDefinition, Domain } from '../types/game';
import { ALL_CARDS, CARDS_BY_ID } from '../data/cards';
import { playSfx } from '../utils/soundEngine';
import { CardView, CardInspectModal, RARITY_LABELS } from './CardView';

export interface PackOpenerProps {
  gold: number;
  unlockedCardIds: Record<string, number>;
  onOpenPack: (packCost: number, cards: CardDefinition[]) => void;
  onUnlockSandbox: () => void;
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
    cost: 100,
    accent: '#d4af37',
    coverCardId: 'neutral_10_valkyra_pentacromatica',
  },
  {
    id: 'pack_red',
    name: 'Chama & Escama',
    kicker: 'DOMÍNIO RUBRO',
    subtitle: 'Dragões, Piroclasmos, Sopro Elemental e Fúria Dracônica',
    domain: 'red',
    cost: 100,
    accent: '#ef4444',
    coverCardId: 'red_08_dragao_vermelho',
  },
  {
    id: 'pack_blue',
    name: 'Tempestade & Runa',
    kicker: 'DOMÍNIO SAFIRA',
    subtitle: 'Gigantes, Gelo, Voo, Cronomancia e Controle Arcano',
    domain: 'blue',
    cost: 100,
    accent: '#38bdf8',
    coverCardId: 'blue_06_dragao_azul',
  },
  {
    id: 'pack_purple',
    name: 'Abismo & Sombra',
    kicker: 'DOMÍNIO ABISSAL',
    subtitle: 'Demônios, Mortos-Vivos, Pactos de Sangue e Reanimação',
    domain: 'purple',
    cost: 100,
    accent: '#a855f7',
    coverCardId: 'purple_08_lorde_abissal',
  },
  {
    id: 'pack_green',
    name: 'Selva & Fera',
    kicker: 'DOMÍNIO ESMERALDA',
    subtitle: ' predadores colossais, Toque Letal, Atropelar e Regeneração',
    domain: 'green',
    cost: 100,
    accent: '#10b981',
    coverCardId: 'green_09_hidra',
  },
  {
    id: 'pack_gold',
    name: 'Ordem & Ferro',
    kicker: 'DOMÍNIO SOLAR',
    subtitle: 'Paladinos, Golens, Escudo Divino, Armadura e Relíquias',
    domain: 'gold',
    cost: 100,
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
  onUnlockSandbox,
}) => {
  const [selectedPackId, setSelectedPackId] = useState<string>('pack_all');
  const [currentPackCards, setCurrentPackCards] = useState<CardDefinition[]>([]);
  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);
  const [inspectCard, setInspectCard] = useState<CardDefinition | null>(null);
  const [sandboxToast, setSandboxToast] = useState<boolean>(false);

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

  const handleSandboxClick = () => {
    onUnlockSandbox();
    playSfx('victory');
    setSandboxToast(true);
    setTimeout(() => setSandboxToast(false), 3500);
  };

  const pct = Math.min(
    100,
    Math.round((collectionStats.uniqueUnlocked / Math.max(1, collectionStats.totalCards)) * 100)
  );

  return (
    <div className="aaa-page-shell">
      {/* Compact Header Bar */}
      <header className="aaa-page-header">
        <div>
          <div className="aaa-kicker">RELICÁRIO & FORJA</div>
          <h1 className="aaa-page-title font-cinzel">Pacotes de Expansão</h1>
        </div>

        <div className="aaa-header-actions">
          <div className="aaa-stat-block">
            <span className="aaa-stat-label">COLEÇÃO</span>
            <span className="aaa-stat-val">
              {collectionStats.uniqueUnlocked}/{collectionStats.totalCards} ({pct}%)
            </span>
          </div>

          <div className="aaa-stat-block">
            <span className="aaa-stat-label">SALDO</span>
            <span className="aaa-stat-val gold-text">{gold} OURO</span>
          </div>

          <button type="button" className="aaa-btn aaa-btn-ghost" onClick={handleSandboxClick}>
            Desbloquear Coleção Completa (Sandbox)
          </button>
        </div>
      </header>

      {sandboxToast && (
        <div className="aaa-toast-banner">
          Modo Sandbox ativado: todas as {ALL_CARDS.length} cartas (3 cópias) e +1.000 Ouro foram liberados.
        </div>
      )}

      {/* Minimalist Collection Progress Strip */}
      <div className="aaa-collection-strip">
        <div className="aaa-rarity-counts">
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
                <span className="aaa-pack-kicker">{pack.kicker}</span>
              </div>

              <div className="aaa-pack-body">
                <h3 className="font-cinzel aaa-pack-title">{pack.name}</h3>
                <p className="aaa-pack-desc">{pack.subtitle}</p>
                <div className="aaa-pack-footer">
                  <span className="aaa-pack-price">{pack.cost} OURO</span>
                  <span className="aaa-pack-select-indicator">
                    {isSelected ? 'SELECIONADO' : 'SELECIONAR'}
                  </span>
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
          disabled={gold < selectedPack.cost}
          onClick={handleBuyAndOpenPack}
        >
          ABRIR {selectedPack.name.toUpperCase()} — {selectedPack.cost} OURO
        </button>

        {currentPackCards.length > 0 && revealedIndices.length < currentPackCards.length && (
          <button
            type="button"
            className="aaa-btn aaa-btn-secondary aaa-btn-lg"
            onClick={handleRevealAll}
          >
            REVELAR TODAS ({currentPackCards.length})
          </button>
        )}
      </div>

      {/* Pack Reveal Stage */}
      {currentPackCards.length > 0 && (
        <div className="aaa-pack-reveal-stage">
          <div className="aaa-stage-header">
            <span className="font-cinzel">CARTAS OBTIDAS</span>
            <span className="aaa-stage-hint">
              Clique nas cartas seladas para revelar ou clique com o botão direito para inspecionar
            </span>
          </div>

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
