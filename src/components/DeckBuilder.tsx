import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { CardDefinition, CardType, Domain, Rarity } from '../types/game';
import { ALL_CARDS, CARDS_BY_ID } from '../data/cards';
import { PREBUILT_DECKS, MAX_COPIES_BY_RARITY, MAX_LEGENDARIES_PER_DECK } from '../data/decks';
import {
  CardView,
  CardInspectModal,
  DOMAIN_META,
  RARITY_LABELS,
  CARD_TYPE_LABELS,
} from './CardView';
import { CustomSavedDeck } from './BattleArena';
import { TacticalGuideView } from './TacticalGuideView';
import { TACTICAL_COMBOS_COMPENDIUM } from '../data/combosCompendium';
import { MONOCHROMATIC_STARTER_DECKS } from '../utils/multiplayerEngine';

export interface SynergyPackageDef {
  id: string;
  icon: string;
  label: string;
  shortDesc: string;
  matches: (card: CardDefinition) => boolean;
}

const SYNERGY_PACKAGES: SynergyPackageDef[] = [
  {
    id: 'chrono_freeze',
    icon: '⏳',
    label: 'Cronomancia & Congelamento',
    shortDesc: 'Congela inimigos, manipula turnos, compra cartas ou pune alvos paralisados.',
    matches: (c) =>
      c.effects.some(
        (e) =>
          e.type === 'freeze_enemy' ||
          e.type === 'freeze_enemy_vanguard' ||
          e.type === 'bounce_enemy'
      ) ||
      /congel|tempo|crono|ampulheta|paradoxo|temporal|relógio|eterno/i.test(
        `${c.name} ${c.subtype} ${c.description}`
      ),
  },
  {
    id: 'spell_engine',
    icon: '⚡',
    label: 'Motor de Feitiços & Condutor',
    shortDesc: 'Feitiços, Reações e unidades que disparam bônus ao conjurar magias (spell_cast).',
    matches: (c) =>
      c.type === 'spell' ||
      c.type === 'reaction' ||
      c.effects.some((e) => e.trigger === 'spell_cast' || e.type === 'draw_cards'),
  },
  {
    id: 'relic_forge',
    icon: '🏛️',
    label: 'Forja de Relíquias & Baluarte',
    shortDesc: 'Relíquias contínuas na Retaguarda, Armadura pesada, Guardiões e Escudo Divino.',
    matches: (c) =>
      c.type === 'relic' ||
      c.armor >= 2 ||
      c.keywords.includes('Escudo Divino') ||
      c.keywords.includes('Guardião') ||
      c.effects.some((e) => e.type === 'shield_all_allies'),
  },
  {
    id: 'crypt_reborn',
    icon: '💀',
    label: 'Cripta, Renascer & Ecos',
    shortDesc: 'Unidades com Renascer, gatilhos de morte (on_death) e reanimação da Cripta.',
    matches: (c) =>
      c.keywords.includes('Renascer') ||
      c.effects.some((e) => e.trigger === 'on_death' || e.type === 'revive_from_crypt'),
  },
  {
    id: 'abyssal_corruption',
    icon: '🩸',
    label: 'Pacto de Sangue & Dreno',
    shortDesc: 'Corrupção Abissal (5+ concede +1 ATQ/+1 Dano), Dreno de Vida e Toque Letal.',
    matches: (c) =>
      (c.corruptionCost ?? 0) > 0 ||
      c.keywords.includes('Dreno de Vida') ||
      c.keywords.includes('Toque Letal') ||
      c.effects.some((e) => e.type === 'damage_enemy_sovereign'),
  },
  {
    id: 'dragon_breath',
    icon: '🐉',
    label: 'Sopro Elemental & Fúria',
    shortDesc: 'Dragões com Sopro em fileira, Pele Incandescente, Fúria Crescente e Dano em Área.',
    matches: (c) =>
      (c.breathDamage ?? 0) > 0 ||
      c.keywords.includes('Pele Incandescente') ||
      c.keywords.includes('Fúria Crescente') ||
      c.effects.some((e) => e.type === 'damage_enemy_row' || e.type === 'damage_all_units'),
  },
  {
    id: 'primal_swarm',
    icon: '🐾',
    label: 'Enxame Predatório & Seiva',
    shortDesc: 'Criaturas com Ímpeto, Atropelar, Regeneração e fortalecimento coletivo da matilha.',
    matches: (c) =>
      c.keywords.includes('Atropelar') ||
      c.keywords.includes('Ímpeto') ||
      (c.regeneration ?? 0) > 0 ||
      c.effects.some((e) => e.type === 'buff_all_allies' || e.type === 'summon_token'),
  },
  {
    id: 'ascension_evo',
    icon: '🔥',
    label: 'Ascensão & Aceleração de Mana',
    shortDesc: 'Criaturas que evoluem em campo (Ascensão) e cartas que geram Essência extra.',
    matches: (c) =>
      Boolean(c.ascension) || c.effects.some((e) => e.type === 'grant_bonus_essence'),
  },
];

export interface DeckBuilderProps {
  unlockedCardIds: Record<string, number>;
  customDecks: CustomSavedDeck[];
  onSaveCustomDeck: (deck: CustomSavedDeck) => void;
  onDeleteCustomDeck: (deckId: string) => void;
  isGuest?: boolean;
  username?: string;
  onRequireAccount?: () => void;
}

interface GalleryCardCellProps {
  card: CardDefinition;
  countInDeck: number;
  maxAllowed: number;
  ownedCopies: number;
  isGuest?: boolean;
  canAdd: boolean;
  onAdd: (card: CardDefinition) => void;
  onRemove: (cardId: string) => void;
  onInspect: (card: CardDefinition) => void;
}

const GalleryCardCell = React.memo<GalleryCardCellProps>(
  ({ card, countInDeck, maxAllowed, ownedCopies, isGuest, canAdd, onAdd, onRemove, onInspect }) => {
    const isLockedForUser = !isGuest && ownedCopies <= 0;
    const effectiveMax = isGuest ? maxAllowed : Math.min(maxAllowed, ownedCopies);
    return (
      <div
        className="db-card-cell"
        style={isLockedForUser ? { opacity: 0.45, filter: 'grayscale(0.65)' } : undefined}
      >
        <CardView
          card={card}
          mode="gallery"
          isPlayable={countInDeck > 0}
          onClick={() => onAdd(card)}
          onInspect={onInspect}
        />
        <div className={`db-card-stepper ${countInDeck > 0 ? 'has-copies' : ''}`}>
          <button
            type="button"
            className="db-step-btn"
            disabled={countInDeck <= 0}
            onClick={() => onRemove(card.id)}
          >
            −
          </button>
          <div
            className="db-step-pips"
            title={
              isLockedForUser
                ? 'Carta bloqueada — obtenha no Relicário'
                : `No Deck: ${countInDeck}/${effectiveMax} (Limite da Raridade: ${maxAllowed}×)`
            }
          >
            {Array.from({ length: maxAllowed }).map((_, idx) => (
              <span
                key={idx}
                className={`db-copy-pip ${idx < countInDeck ? 'is-filled' : ''}`}
                style={
                  !isGuest && idx >= ownedCopies
                    ? { opacity: 0.25, borderStyle: 'dashed' }
                    : undefined
                }
              />
            ))}
          </div>
          <button
            type="button"
            className="db-step-btn"
            disabled={!canAdd}
            onClick={() => onAdd(card)}
          >
            +
          </button>
        </div>
      </div>
    );
  }
);

const INITIAL_VISIBLE_CARDS = 60;
const VISIBLE_BATCH_STEP = 60;

export const DeckBuilder: React.FC<DeckBuilderProps> = ({
  unlockedCardIds,
  customDecks,
  onSaveCustomDeck,
  onDeleteCustomDeck,
  isGuest = false,
  username,
  onRequireAccount,
}) => {
  const isFirstDeckSetup = !isGuest && customDecks.length === 0;
  const hasFreeCatalogSelection = isGuest || isFirstDeckSetup;
  const totalOwnedCopies = useMemo(
    () => Object.values(unlockedCardIds).reduce((acc, v) => acc + (v > 0 ? v : 0), 0),
    [unlockedCardIds]
  );
  const canModifySavedGrimoire = isGuest || isFirstDeckSetup || totalOwnedCopies > 100;

  // Filters
  const [domainFilter, setDomainFilter] = useState<Domain | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<CardType | 'all'>('all');
  const [rarityFilter, setRarityFilter] = useState<Rarity | 'all'>('all');
  const [costFilter, setCostFilter] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyUnlocked, setOnlyUnlocked] = useState<boolean>(() => !isGuest && customDecks.length > 0);
  const [synergyFilterId, setSynergyFilterId] = useState<string | 'all' | 'recommended'>('all');
  const [showSynergyPanel, setShowSynergyPanel] = useState<boolean>(false);

  useEffect(() => {
    setOnlyUnlocked(!isGuest && customDecks.length > 0);
  }, [isGuest, customDecks.length]);

  // Active Deck Being Edited
  const [deckName, setDeckName] = useState<string>(() =>
    customDecks[0]?.name ?? `${MONOCHROMATIC_STARTER_DECKS[0]?.name ?? 'Grimório Inicial'}`
  );
  const [editingDeckId, setEditingDeckId] = useState<string>(
    () => customDecks[0]?.id ?? `custom_${Date.now()}`
  );
  const [deckCardIds, setDeckCardIds] = useState<string[]>(
    () => customDecks[0]?.cardIds ?? MONOCHROMATIC_STARTER_DECKS[0]?.cardIds ?? PREBUILT_DECKS[0]?.cardIds ?? []
  );

  // Sync active deck when user switches account or saves their first Grimório
  useEffect(() => {
    if (customDecks.length > 0 && !customDecks.some((d) => d.id === editingDeckId)) {
      setDeckName(customDecks[0].name);
      setEditingDeckId(customDecks[0].id);
      setDeckCardIds([...customDecks[0].cardIds]);
    }
  }, [customDecks, editingDeckId]);

  // Modals
  const [inspectCard, setInspectCard] = useState<CardDefinition | null>(null);
  const [showPromptsModal, setShowPromptsModal] = useState<boolean>(false);
  const [showTacticalGuideModal, setShowTacticalGuideModal] = useState<boolean>(false);
  const [guideModalSection, setGuideModalSection] = useState<
    'deck_mastery' | 'matchup_duel' | 'matrix_all' | 'combos_compendium'
  >('deck_mastery');
  const [activeGuideDeckId, setActiveGuideDeckId] = useState<string>(
    () => PREBUILT_DECKS[0]?.id ?? 'deck_red_inferno'
  );
  const [promptDomainFilter, setPromptDomainFilter] = useState<Domain | 'all'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [saveBanner, setSaveBanner] = useState<string | null>(null);
  const [visibleLimit, setVisibleLimit] = useState<number>(INITIAL_VISIBLE_CARDS);
  const loadMoreSentinelRef = useRef<HTMLDivElement | null>(null);

  // Reset progressive batch limit when filters change so initial render is ultra-fast
  useEffect(() => {
    setVisibleLimit(INITIAL_VISIBLE_CARDS);
  }, [
    domainFilter,
    typeFilter,
    rarityFilter,
    costFilter,
    onlyUnlocked,
    searchQuery,
    synergyFilterId,
  ]);

  // Count copies in current deck
  const deckCountsById = useMemo(() => {
    const map: Record<string, number> = {};
    for (const id of deckCardIds) {
      map[id] = (map[id] ?? 0) + 1;
    }
    return map;
  }, [deckCardIds]);

  // Grouped deck entries sorted by cost then name
  const groupedDeckList = useMemo(() => {
    const uniqueIds = Object.keys(deckCountsById);
    const items = uniqueIds
      .map((id) => ({
        card: CARDS_BY_ID[id],
        count: deckCountsById[id],
      }))
      .filter((item): item is { card: CardDefinition; count: number } => Boolean(item.card));

    items.sort((a, b) => a.card.cost - b.card.cost || a.card.name.localeCompare(b.card.name));
    return items;
  }, [deckCountsById]);

  // Mana curve & domain stats for current deck
  const deckStats = useMemo(() => {
    const curve: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };
    const domains: Record<Domain, number> = {
      red: 0,
      blue: 0,
      purple: 0,
      green: 0,
      gold: 0,
      neutral: 0,
    };

    for (const id of deckCardIds) {
      const c = CARDS_BY_ID[id];
      if (!c) continue;
      const bucket = Math.min(7, Math.max(1, c.cost));
      curve[bucket] = (curve[bucket] ?? 0) + 1;
      domains[c.domain] = (domains[c.domain] ?? 0) + 1;
    }

    const maxCurveBucket = Math.max(1, ...Object.values(curve));
    return { curve, domains, maxCurveBucket };
  }, [deckCardIds]);

  // Comprehensive Synergy & Tactical Diagnostics Analysis for the Current Deck
  const deckAnalysis = useMemo(() => {
    const resolvedCards = deckCardIds
      .map((id) => CARDS_BY_ID[id])
      .filter((c): c is CardDefinition => Boolean(c));

    const typeCounts: Record<CardType, number> = {
      creature: 0,
      spell: 0,
      reaction: 0,
      relic: 0,
    };

    let vanguardUnits = 0;
    let rearguardUnits = 0;
    let totalCost = 0;
    const ascensionsInDeck: { card: CardDefinition; count: number }[] = [];
    const seenAscensionIds = new Set<string>();

    const packageCounts: Record<string, number> = {};
    for (const pkg of SYNERGY_PACKAGES) {
      packageCounts[pkg.id] = 0;
    }

    const maxAffinityReqByDomain: Record<Exclude<Domain, 'neutral'>, number> = {
      red: 0,
      blue: 0,
      purple: 0,
      green: 0,
      gold: 0,
    };

    for (const c of resolvedCards) {
      typeCounts[c.type] += 1;
      totalCost += c.cost;

      if (c.type === 'creature') {
        if (c.preferredRow === 'vanguard') vanguardUnits += 1;
        else rearguardUnits += 1;
      } else if (c.type === 'relic' || c.type === 'reaction') {
        rearguardUnits += 1;
      }

      if (c.ascension && !seenAscensionIds.has(c.id)) {
        seenAscensionIds.add(c.id);
        ascensionsInDeck.push({ card: c, count: deckCountsById[c.id] ?? 1 });
      }

      if (c.domain !== 'neutral') {
        maxAffinityReqByDomain[c.domain] = Math.max(
          maxAffinityReqByDomain[c.domain],
          c.affinityReq
        );
      }

      for (const pkg of SYNERGY_PACKAGES) {
        if (pkg.matches(c)) {
          packageCounts[pkg.id] += 1;
        }
      }
    }

    const avgCost = resolvedCards.length > 0 ? (totalCost / resolvedCards.length).toFixed(2) : '0.00';

    const rankedPackages = SYNERGY_PACKAGES.map((pkg) => ({
      ...pkg,
      count: packageCounts[pkg.id] ?? 0,
    })).sort((a, b) => b.count - a.count);

    // Determine Archetype Title & Description (scaled for 100-card decks)
    let archetypeTitle = '⚔️ Falange Tática Equilibrada';
    let archetypeSubtitle = 'Equilíbrio versátil entre linha de frente, magias de suporte e relíquias.';

    if ((packageCounts['chrono_freeze'] ?? 0) >= 12) {
      archetypeTitle = '⏳ Ordem Cronomante & Stasis';
      archetypeSubtitle = 'Paralisia temporal, controle de turnos e relíquias de precisão.';
    } else if (typeCounts.relic >= 12) {
      archetypeTitle = '🏛️ Fortaleza de Relíquias & Forja';
      archetypeSubtitle = 'Alta densidade de Relíquias contínuas na Retaguarda gerando valor por turno.';
    } else if (typeCounts.spell + typeCounts.reaction >= 26) {
      archetypeTitle = '✨ Grimório Arcano (Spell-Heavy)';
      archetypeSubtitle = 'Domínio tático via Feitiços, Reações de Emboscada e Condutor Rúnico.';
    } else if (typeCounts.creature >= 50) {
      archetypeTitle = '🐾 Enxame Predatório (Creature-Heavy)';
      archetypeSubtitle = 'Pressão implacável de criaturas, Atropelar e evolução de matilha.';
    } else if ((packageCounts['abyssal_corruption'] ?? 0) >= 12) {
      archetypeTitle = '🩸 Pacto Abissal & Dreno';
      archetypeSubtitle = 'Usa Corrupção (5+) para amplificar ataques e drena a vida do Soberano rival.';
    } else if ((packageCounts['crypt_reborn'] ?? 0) >= 12) {
      archetypeTitle = '💀 Necromancia & Cripta Eterna';
      archetypeSubtitle = 'Reciclagem de criaturas com Renascer, Eco Necrótico e reanimação.';
    }

    // Domain consistency & Domain Expansion (6/6 Affinity) check
    const coloredDomains: Exclude<Domain, 'neutral'>[] = ['red', 'blue', 'purple', 'green', 'gold'];
    const activeColoredDomains = coloredDomains.filter((d) => deckStats.domains[d] > 0);

    const domainConsistency = activeColoredDomains.map((dom) => {
      const directCards = deckStats.domains[dom];
      const effectiveSources = directCards + deckStats.domains.neutral;
      const maxReq = maxAffinityReqByDomain[dom];
      // Recommended minimum sources in an 100-card deck
      const minRecommended = maxReq >= 3 ? 16 : maxReq === 2 ? 10 : 6;
      const status: 'optimal' | 'warn' = effectiveSources >= minRecommended ? 'optimal' : 'warn';
      return {
        domain: dom,
        directCards,
        effectiveSources,
        maxReq,
        minRecommended,
        status,
      };
    });

    // Tactical Diagnostics (Warnings & Strengths)
    const warnings: string[] = [];
    const strengths: string[] = [];

    if (resolvedCards.length > 0) {
      if (vanguardUnits < 6) {
        warnings.push(
          `⚠️ Linha de Frente Frágil (${vanguardUnits} unidades de Vanguarda): seu Soberano pode ficar exposto a Invasões diretas.`
        );
      } else if (vanguardUnits >= 12) {
        strengths.push(
          `🛡️ Muralha de Vanguarda Sólida (${vanguardUnits} combatentes frontais para bloquear colunas e invadir).`
        );
      }

      if (typeCounts.spell + typeCounts.reaction < 4) {
        warnings.push(
          `⚠️ Pouca Interação (${typeCounts.spell + typeCounts.reaction} Feitiços/Reações): difícil remover ameaças na Retaguarda inimiga.`
        );
      } else if (typeCounts.spell + typeCounts.reaction >= 12) {
        strengths.push(
          `✨ Alto Poder de Resposta (${typeCounts.spell} Feitiços + ${typeCounts.reaction} Reações/Emboscadas).`
        );
      }

      if (typeCounts.relic >= 5) {
        strengths.push(
          `🏛️ Motor de Relíquias Contínuas (${typeCounts.relic} Relíquias gerando vantagens todo turno).`
        );
      }

      for (const dc of domainConsistency) {
        if (dc.status === 'warn') {
          warnings.push(
            `⚠️ Consistência ${DOMAIN_META[dc.domain].icon} ${DOMAIN_META[dc.domain].name}: apenas ${dc.directCards} cartas da cor para exigir Afinidade ${dc.maxReq} (recomendado ${dc.minRecommended}+ fontes).`
          );
        }
      }

      if (ascensionsInDeck.length >= 2) {
        strengths.push(
          `🔥 ${ascensionsInDeck.length} Linhagens de Ascensão no deck para escalada de fim de jogo.`
        );
      }
    }

    // Compute Smart Recommended Cards from the 500-card pool
    const topTwoPackageIds = rankedPackages
      .filter((p) => p.count > 0)
      .slice(0, 2)
      .map((p) => p.id);

    const recommendedCardIds = new Set<string>();
    const legendaryCount = resolvedCards.filter((c) => c.rarity === 'legendary').length;
    for (const card of ALL_CARDS) {
      const currentCopies = deckCountsById[card.id] ?? 0;
      const maxAllowed = MAX_COPIES_BY_RARITY[card.rarity];
      if (currentCopies >= maxAllowed) continue;
      if (card.rarity === 'legendary' && legendaryCount >= MAX_LEGENDARIES_PER_DECK) continue;

      // Must match active domains (or be neutral) if deck already has cards
      if (
        activeColoredDomains.length > 0 &&
        card.domain !== 'neutral' &&
        !activeColoredDomains.includes(card.domain)
      ) {
        continue;
      }

      // Matches at least one of the deck's top synergy packages, or fills a missing Vanguard/Removal role
      const matchesTopSynergy = topTwoPackageIds.some((pid) => {
        const pkg = SYNERGY_PACKAGES.find((p) => p.id === pid);
        return pkg ? pkg.matches(card) : false;
      });

      const fillsVanguardGap =
        vanguardUnits < 8 && card.type === 'creature' && card.preferredRow === 'vanguard';

      if (matchesTopSynergy || fillsVanguardGap) {
        recommendedCardIds.add(card.id);
      }
    }

    return {
      totalCards: resolvedCards.length,
      legendaryCount,
      uniqueCount: Object.keys(deckCountsById).length,
      typeCounts,
      vanguardUnits,
      rearguardUnits,
      avgCost,
      archetypeTitle,
      archetypeSubtitle,
      rankedPackages,
      ascensionsInDeck,
      domainConsistency,
      warnings,
      strengths,
      recommendedCardIds,
    };
  }, [deckCardIds, deckCountsById, deckStats]);

  // Filtered 500-card catalog
  const filteredCards = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const activeSynergyPkg =
      synergyFilterId !== 'all' &&
      synergyFilterId !== 'recommended' &&
      !synergyFilterId.startsWith('combo:')
        ? SYNERGY_PACKAGES.find((p) => p.id === synergyFilterId)
        : null;
    const activeCombo = synergyFilterId.startsWith('combo:')
      ? TACTICAL_COMBOS_COMPENDIUM.find((c) => `combo:${c.id}` === synergyFilterId)
      : null;

    return ALL_CARDS.filter((card) => {
      if (activeCombo && !activeCombo.cardIds.includes(card.id)) return false;
      if (domainFilter !== 'all' && card.domain !== domainFilter) return false;
      if (typeFilter !== 'all' && card.type !== typeFilter) return false;
      if (rarityFilter !== 'all' && card.rarity !== rarityFilter) return false;
      if (costFilter !== 'all') {
        if (costFilter === 7) {
          if (card.cost < 7) return false;
        } else if (card.cost !== costFilter) {
          return false;
        }
      }
      if (onlyUnlocked && (unlockedCardIds[card.id] ?? 0) <= 0) {
        return false;
      }
      if (synergyFilterId === 'recommended' && !deckAnalysis.recommendedCardIds.has(card.id)) {
        return false;
      }
      if (activeSynergyPkg && !activeSynergyPkg.matches(card)) {
        return false;
      }
      if (q) {
        const haystack = [
          card.name,
          card.subtype,
          card.description,
          card.originalInspiration,
          ...card.keywords,
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [
    domainFilter,
    typeFilter,
    rarityFilter,
    costFilter,
    onlyUnlocked,
    unlockedCardIds,
    searchQuery,
    synergyFilterId,
    deckAnalysis.recommendedCardIds,
  ]);

  const visibleCards = useMemo(
    () => filteredCards.slice(0, visibleLimit),
    [filteredCards, visibleLimit]
  );

  // Auto-load next batch of cards smoothly when scrolling near bottom of catalog
  useEffect(() => {
    const sentinel = loadMoreSentinelRef.current;
    if (!sentinel || visibleLimit >= filteredCards.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleLimit((prev) => Math.min(filteredCards.length, prev + VISIBLE_BATCH_STEP));
        }
      },
      { rootMargin: '420px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleLimit, filteredCards.length]);

  const handleAddCardToDeck = useCallback(
    (card: CardDefinition) => {
      if (deckCardIds.length >= 100) return;
      const currentCopies = deckCountsById[card.id] ?? 0;
      const maxAllowed = MAX_COPIES_BY_RARITY[card.rarity];
      const ownedCopies = hasFreeCatalogSelection ? maxAllowed : unlockedCardIds[card.id] ?? 0;
      if (!hasFreeCatalogSelection && ownedCopies <= 0) {
        setSaveBanner(
          `Carta bloqueada na sua coleção. Abra pacotes no Relicário para desbloquear novas cartas!`
        );
        setTimeout(() => setSaveBanner(null), 3200);
        return;
      }
      if (currentCopies >= Math.min(maxAllowed, ownedCopies)) {
        if (!hasFreeCatalogSelection && currentCopies >= ownedCopies && ownedCopies < maxAllowed) {
          setSaveBanner(
            `Você possui ${ownedCopies} cópia(s) desta carta na sua coleção. Desbloqueie mais no Relicário!`
          );
          setTimeout(() => setSaveBanner(null), 3200);
        }
        return;
      }
      if (card.rarity === 'legendary' && deckAnalysis.legendaryCount >= MAX_LEGENDARIES_PER_DECK) {
        setSaveBanner(
          `Limite máximo de ${MAX_LEGENDARIES_PER_DECK} cartas Lendárias por Grimório atingido!`
        );
        setTimeout(() => setSaveBanner(null), 3000);
        return;
      }
      setDeckCardIds((prev) => [...prev, card.id]);
    },
    [deckCardIds.length, deckCountsById, deckAnalysis.legendaryCount, hasFreeCatalogSelection, unlockedCardIds]
  );

  const handleRemoveCardFromDeck = useCallback(
    (cardId: string) => {
      if (!canModifySavedGrimoire) {
        setSaveBanner(
          '🔒 Grimório Consagrado! Adquira novas cartas no Relicário (+10 Ouro por vitória) para poder substituir cartas do seu Grimório.'
        );
        setTimeout(() => setSaveBanner(null), 3500);
        return;
      }
      setDeckCardIds((prev) => {
        const idx = prev.indexOf(cardId);
        if (idx === -1) return prev;
        const copy = [...prev];
        copy.splice(idx, 1);
        return copy;
      });
    },
    [canModifySavedGrimoire]
  );

  const handleAutoCompleteDeck = () => {
    if (deckCardIds.length >= 100) return;
    const nextIds = [...deckCardIds];
    const counts: Record<string, number> = { ...deckCountsById };
    let legsCount = deckAnalysis.legendaryCount;

    // Determine primary domains in current deck
    const domainPriority = (Object.keys(deckStats.domains) as Domain[])
      .filter((d) => d !== 'neutral' && deckStats.domains[d] > 0)
      .sort((a, b) => deckStats.domains[b] - deckStats.domains[a]);

    const pool = ALL_CARDS.filter(
      (c) =>
        (hasFreeCatalogSelection || (unlockedCardIds[c.id] ?? 0) > 0) &&
        (domainPriority.length === 0 ||
          domainPriority.slice(0, 2).includes(c.domain) ||
          c.domain === 'neutral')
    );

    for (const card of pool) {
      if (nextIds.length >= 100) break;
      const maxAllowed = MAX_COPIES_BY_RARITY[card.rarity];
      const owned = hasFreeCatalogSelection ? maxAllowed : unlockedCardIds[card.id] ?? 0;
      const effectiveCap = Math.min(maxAllowed, owned);
      while ((counts[card.id] ?? 0) < effectiveCap && nextIds.length < 100) {
        if (card.rarity === 'legendary' && legsCount >= MAX_LEGENDARIES_PER_DECK) break;
        nextIds.push(card.id);
        counts[card.id] = (counts[card.id] ?? 0) + 1;
        if (card.rarity === 'legendary') legsCount += 1;
      }
    }

    setDeckCardIds(nextIds);
  };

  const handleSaveCurrentDeck = () => {
    if (isGuest) {
      setSaveBanner('Entre ou crie sua Conta de Soberano para salvar seu Grimório de 100 cartas!');
      setTimeout(() => setSaveBanner(null), 3500);
      onRequireAccount?.();
      return;
    }
    if (deckCardIds.length !== 100) {
      setSaveBanner('O Grimório de Combate deve ter exatamente 100 cartas (use Completar ou adicione cartas da sua coleção).');
      setTimeout(() => setSaveBanner(null), 3500);
      return;
    }
    if (!isFirstDeckSetup) {
      for (const [cardId, count] of Object.entries(deckCountsById)) {
        const owned = unlockedCardIds[cardId] ?? 0;
        if (count > owned) {
          setSaveBanner(
            'Apenas cartas presentes na sua coleção (Grimório Inicial + aquisições no Relicário) podem compor seu Grimório!'
          );
          setTimeout(() => setSaveBanner(null), 3500);
          return;
        }
      }
    }
    const cleanName = deckName.trim() || 'Grimório do Soberano';
    onSaveCustomDeck({
      id: editingDeckId,
      name: cleanName,
      cardIds: deckCardIds,
    });
    setSaveBanner(`Grimório "${cleanName}" (100 cartas) salvo! Todos os modos de combate estão liberados.`);
    setTimeout(() => setSaveBanner(null), 3500);
  };

  const handleLoadPrebuilt = (prebuiltId: string) => {
    if (!isGuest && !isFirstDeckSetup) {
      setSaveBanner(
        '🔒 Seu Grimório inicial já foi consagrado! Novos cards só podem ser integrados mediante aquisições no Relicário.'
      );
      setTimeout(() => setSaveBanner(null), 3500);
      return;
    }
    const found = PREBUILT_DECKS.find((d) => d.id === prebuiltId);
    if (!found) return;
    setActiveGuideDeckId(prebuiltId);
    setDeckName(`${found.name}`);
    setEditingDeckId(customDecks[0]?.id ?? `custom_${Date.now()}`);
    setDeckCardIds([...found.cardIds]);
  };

  const handleLoadCustom = (custom: CustomSavedDeck) => {
    setActiveGuideDeckId(custom.id);
    setDeckName(custom.name);
    setEditingDeckId(custom.id);
    setDeckCardIds([...custom.cardIds]);
  };

  const promptCardsList = useMemo(() => {
    if (promptDomainFilter === 'all') return ALL_CARDS;
    return ALL_CARDS.filter((c) => c.domain === promptDomainFilter);
  }, [promptDomainFilter]);

  const handleCopyAllPrompts = () => {
    const text = promptCardsList
      .map(
        (c) =>
          `### ${c.id} — ${c.name} (${DOMAIN_META[c.domain].name})\nArquivo: ${c.imagePath}\nPrompt: ${c.aiArtPrompt}\n`
      )
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopiedId('ALL');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const totalForBar = Math.max(1, deckAnalysis.totalCards);
  const creaturePct = Math.round((deckAnalysis.typeCounts.creature / totalForBar) * 100);
  const spellPct = Math.round((deckAnalysis.typeCounts.spell / totalForBar) * 100);
  const reactionPct = Math.round((deckAnalysis.typeCounts.reaction / totalForBar) * 100);
  const relicPct = Math.max(0, 100 - creaturePct - spellPct - reactionPct);

  const hasActiveFilters =
    domainFilter !== 'all' ||
    typeFilter !== 'all' ||
    rarityFilter !== 'all' ||
    costFilter !== 'all' ||
    searchQuery.trim() !== '' ||
    synergyFilterId !== 'all';

  const handleResetFilters = () => {
    setDomainFilter('all');
    setTypeFilter('all');
    setRarityFilter('all');
    setCostFilter('all');
    setSearchQuery('');
    setSynergyFilterId('all');
  };

  return (
    <div className="db-modern-shell">
      {/* LEFT CATALOG AREA */}
      <div className="db-catalog-area">
        {/* GUEST OR MANDATORY FIRST DECK ONBOARDING BANNER */}
        {isGuest ? (
          <div className="aaa-status-callout is-guest" style={{ marginBottom: '0.75rem' }}>
            <div className="aaa-callout-copy">
              <span className="aaa-callout-kicker">MODO VISITANTE • EXPLORAÇÃO DO ACERVO</span>
              <div className="aaa-callout-text">
                Você pode explorar e inspecionar todas as 890 cartas. Para montar e salvar seu{' '}
                <strong>Grimório de Combate (100 cartas)</strong> e liberar os demais modos, entre
                ou crie sua conta.
              </div>
            </div>
            {onRequireAccount && (
              <button
                type="button"
                className="aaa-btn aaa-btn-primary"
                onClick={onRequireAccount}
              >
                Entrar / Criar Conta
              </button>
            )}
          </div>
        ) : customDecks.length === 0 ? (
          <div
            className="aaa-status-callout is-onboarding"
            style={{
              marginBottom: '0.85rem',
              flexDirection: 'column',
              alignItems: 'stretch',
              gap: '0.6rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              <div>
                <div className="aaa-callout-kicker">
                  PASSO INICIAL OBRIGATÓRIO DO SOBERANO{' '}
                  {username ? `• ${username.toUpperCase()}` : ''}
                </div>
                <div className="aaa-callout-title">
                  Monte e Salve seu Grimório de Combate (100 Cartas)
                </div>
              </div>
              <button
                type="button"
                className="aaa-btn aaa-btn-primary"
                onClick={handleSaveCurrentDeck}
              >
                Confirmar & Salvar Grimório ({deckCardIds.length}/100)
              </button>
            </div>
            <div className="aaa-callout-text">
              Escolha um dos <strong>5 Grimórios Monocromáticos Iniciais</strong> abaixo para usar
              como está, edite-o livremente com seu acervo inicial ou clique em{' '}
              <strong>Criar do Zero</strong> (respeitando até 3× Comum/Incomum, 2× Rara e 1×
              Lendária, máx. 10 Lendas):
            </div>
            <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
              {MONOCHROMATIC_STARTER_DECKS.map((sd) => {
                const dom = sd.domains[0] ?? 'red';
                return (
                  <button
                    key={sd.id}
                    type="button"
                    className="db-action-btn"
                    style={{
                      borderColor: `${DOMAIN_META[dom].color}88`,
                      color: '#f8fafc',
                      padding: '0.35rem 0.7rem',
                      fontSize: '0.74rem',
                      flex: 'none',
                    }}
                    onClick={() => handleLoadPrebuilt(sd.id)}
                  >
                    {DOMAIN_META[dom].shortName}: {sd.name}
                  </button>
                );
              })}
              <button
                type="button"
                className="db-action-btn subtle-danger"
                style={{ padding: '0.35rem 0.7rem', fontSize: '0.74rem', flex: 'none' }}
                onClick={() => {
                  setDeckName(username ? `Grimório de ${username}` : 'Meu Grimório');
                  setDeckCardIds([]);
                  setOnlyUnlocked(true);
                }}
              >
                Criar do Zero (0/100)
              </button>
            </div>
          </div>
        ) : !canModifySavedGrimoire ? (
          <div className="aaa-status-callout" style={{ marginBottom: '0.85rem' }}>
            <div>
              <div className="aaa-callout-kicker">
                GRIMÓRIO CONSAGRADO (100/100 CARTAS){' '}
                {username ? `• ${username.toUpperCase()}` : ''}
              </div>
              <div className="aaa-callout-title">
                Alterações no Grimório apenas mediante aquisições no Relicário
              </div>
              <div className="aaa-callout-text">
                Seu Grimório inicial de 100 cartas está selado. Conquiste vitórias (+10 Ouro por
                vitória) e abra pacotes no <strong>Relicário</strong> para desbloquear novas cartas
                e poder substituí-las no seu Grimório.
              </div>
            </div>
          </div>
        ) : null}

        {/* SINGLE ULTRA-CLEAN STICKY TOOLBAR */}
        <div className="db-modern-toolbar">
          {/* Domain Orbs */}
          <div className="db-domain-orbs">
            <button
              type="button"
              className={`db-orb-btn orb-all ${domainFilter === 'all' ? 'is-active' : ''}`}
              onClick={() => setDomainFilter('all')}
            >
              Todos
            </button>
            {(['red', 'blue', 'purple', 'green', 'gold', 'neutral'] as Domain[]).map((dom) => (
              <button
                key={dom}
                type="button"
                className={`db-orb-btn domain-${dom} ${domainFilter === dom ? 'is-active' : ''}`}
                onClick={() => setDomainFilter((prev) => (prev === dom ? 'all' : dom))}
              >
                <span className="db-orb-dot" style={{ background: DOMAIN_META[dom].color }} />
                <span>{DOMAIN_META[dom].shortName}</span>
              </button>
            ))}
          </div>

          <div className="db-toolbar-divider" />

          {/* Unified Search Input */}
          <div className="db-search-wrap">
            <input
              type="text"
              className="db-modern-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar carta, palavra-chave ou habilidade..."
            />
            {searchQuery && (
              <button
                type="button"
                className="db-search-clear"
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>

          {/* Compact Selects: Synergy / Type / Rarity */}
          <select
            className={`db-modern-select ${synergyFilterId !== 'all' ? 'is-highlighted' : ''}`}
            value={synergyFilterId}
            onChange={(e) => setSynergyFilterId(e.target.value)}
          >
            <option value="all">Sinergia: Todas ({ALL_CARDS.length})</option>
            <option value="recommended">
              ✨ Sugeridas p/ Este Deck ({deckAnalysis.recommendedCardIds.size})
            </option>
            {SYNERGY_PACKAGES.map((pkg) => {
              const cnt =
                deckAnalysis.rankedPackages.find((p) => p.id === pkg.id)?.count ?? 0;
              return (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.label} ({cnt} no deck)
                </option>
              );
            })}
          </select>

          <select
            className="db-modern-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as CardType | 'all')}
          >
            <option value="all">Tipo: Todos</option>
            <option value="creature">Criaturas</option>
            <option value="spell">Feitiços</option>
            <option value="reaction">Reações</option>
            <option value="relic">Relíquias</option>
          </select>

          <select
            className="db-modern-select"
            value={rarityFilter}
            onChange={(e) => setRarityFilter(e.target.value as Rarity | 'all')}
          >
            <option value="all">Raridade: Todas</option>
            <option value="common">Comum</option>
            <option value="uncommon">Incomum</option>
            <option value="rare">Rara</option>
            <option value="legendary">Lendária</option>
          </select>

          {/* Compact Mana Cost Filter */}
          <div className="db-cost-strip">
            {(['all', 1, 2, 3, 4, 5, 6, 7] as const).map((cost) => (
              <button
                key={String(cost)}
                type="button"
                className={`db-cost-pill ${costFilter === cost ? 'is-active' : ''}`}
                onClick={() => setCostFilter((prev) => (prev === cost ? 'all' : cost))}
              >
                {cost === 'all' ? '∞' : cost === 7 ? '7+' : cost}
              </button>
            ))}
          </div>

          <label className="db-collection-toggle">
            <input
              type="checkbox"
              checked={onlyUnlocked}
              onChange={(e) => setOnlyUnlocked(e.target.checked)}
            />
            <span>Coleção</span>
          </label>

          {/* Sleek Analytics Drawer Toggle + Count */}
          <div className="db-toolbar-right">
            <span className="db-results-count">{filteredCards.length} cartas</span>
            {hasActiveFilters && (
              <button
                type="button"
                className="db-analytics-toggle-btn"
                onClick={handleResetFilters}
                title="Limpar todos os filtros ativos"
              >
                <span>Limpar Filtros</span>
              </button>
            )}
            <button
              type="button"
              className="db-analytics-toggle-btn"
              onClick={() => setShowTacticalGuideModal(true)}
            >
              <span>Guia Tático</span>
            </button>
            <button
              type="button"
              className={`db-analytics-toggle-btn ${showSynergyPanel ? 'is-open' : ''}`}
              onClick={() => setShowSynergyPanel((prev) => !prev)}
            >
              <span
                className={`db-status-dot ${
                  deckAnalysis.warnings.length > 0 ? 'dot-warn' : 'dot-ok'
                }`}
              />
              <span>Análise do Deck</span>
            </button>
          </div>
        </div>

        {/* SLEEK COLLAPSIBLE GLASSMORPHIC ANALYTICS DRAWER (Only visible when toggled!) */}
        {showSynergyPanel && (
          <div className="db-analytics-drawer">
            <div className="db-drawer-col">
              <div className="db-drawer-kicker">ARQUÉTIPO DETECTADO</div>
              <div className="db-drawer-title">{deckAnalysis.archetypeTitle}</div>
              <p className="db-drawer-desc">{deckAnalysis.archetypeSubtitle}</p>
              <div className="db-drawer-Chips" style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className={`db-synergy-chip ${
                    synergyFilterId === 'recommended' ? 'is-active' : ''
                  }`}
                  onClick={() =>
                    setSynergyFilterId((prev) =>
                      prev === 'recommended' ? 'all' : 'recommended'
                    )
                  }
                >
                  ✨ Ver {deckAnalysis.recommendedCardIds.size} Cartas Sugeridas
                </button>
                <button
                  type="button"
                  className="db-synergy-chip"
                  onClick={() => {
                    setGuideModalSection('combos_compendium');
                    setShowTacticalGuideModal(true);
                  }}
                >
                  ⚡ Compêndio de Combos (1–5 Cores)
                </button>
              </div>
              <div style={{ marginTop: '0.45rem', display: 'flex', flexDirection: 'column', gap: '0.28rem' }}>
                <div className="db-drawer-kicker">COMBOS COMPATÍVEIS (CLIQUE P/ FILTRAR CARTAS)</div>
                {TACTICAL_COMBOS_COMPENDIUM.map((combo) => {
                  const inDeck = combo.cardIds.filter((cid) => (deckCountsById[cid] ?? 0) > 0).length;
                  return { combo, inDeck };
                })
                  .sort((a, b) => b.inDeck - a.inDeck)
                  .slice(0, 3)
                  .map(({ combo, inDeck }) => {
                    const filterKey = `combo:${combo.id}`;
                    return (
                      <button
                        key={combo.id}
                        type="button"
                        className={`db-synergy-mini-btn ${
                          synergyFilterId === filterKey ? 'is-active' : ''
                        }`}
                        onClick={() => {
                          if (synergyFilterId === filterKey) {
                            setSynergyFilterId('all');
                          } else {
                            setDomainFilter('all');
                            setTypeFilter('all');
                            setRarityFilter('all');
                            setCostFilter('all');
                            setOnlyUnlocked(false);
                            setSynergyFilterId(filterKey);
                          }
                        }}
                      >
                        <span>
                          {combo.domains.map((d) => DOMAIN_META[d].icon).join('')} {combo.title}
                        </span>
                        <strong>
                          {inDeck}/{combo.cardIds.length}
                        </strong>
                      </button>
                    );
                  })}
              </div>
            </div>

            <div className="db-drawer-col">
              <div className="db-drawer-kicker">PACOTES SINÉRGICOS (CLIQUE P/ FILTRAR)</div>
              <div className="db-synergy-grid">
                {deckAnalysis.rankedPackages.slice(0, 6).map((pkg) => (
                  <button
                    key={pkg.id}
                    type="button"
                    className={`db-synergy-mini-btn ${
                      synergyFilterId === pkg.id ? 'is-active' : ''
                    }`}
                    onClick={() =>
                      setSynergyFilterId((prev) => (prev === pkg.id ? 'all' : pkg.id))
                    }
                  >
                    <span>
                      {pkg.icon} {pkg.label}
                    </span>
                    <strong>{pkg.count}</strong>
                  </button>
                ))}
              </div>
            </div>

            <div className="db-drawer-col">
              <div className="db-drawer-kicker">ESTABILIDADE DE AFINIDADE & DIAGNÓSTICO</div>
              <div className="db-diagnostics-list">
                {deckAnalysis.domainConsistency.map((dc) => (
                  <div
                    key={dc.domain}
                    className={`db-diag-row ${dc.status === 'optimal' ? 'is-ok' : 'is-warn'}`}
                  >
                    <span>
                      {DOMAIN_META[dc.domain].icon} {DOMAIN_META[dc.domain].shortName} (Afin.{' '}
                      {dc.maxReq})
                    </span>
                    <strong>
                      {dc.effectiveSources} fontes{' '}
                      {dc.status === 'optimal' ? '✓' : `(Rec. ${dc.minRecommended}+)`}
                    </strong>
                  </div>
                ))}
                {deckAnalysis.warnings.map((w, i) => (
                  <div key={`w-${i}`} className="db-diag-note note-warn">
                    {w}
                  </div>
                ))}
                {deckAnalysis.strengths.slice(0, 2).map((s, i) => (
                  <div key={`s-${i}`} className="db-diag-note note-ok">
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CLEAN CARDS GRID — IMMEDIATELY FRONT AND CENTER (PROGRESSIVE VIRTUALIZED BATCHES) */}
        <div className="db-cards-grid">
          {filteredCards.length === 0 ? (
            <div className="db-catalog-empty-state">
              <div className="font-cinzel gold-gradient-text" style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                NENHUMA CARTA ENCONTRADA PARA OS FILTROS SELECIONADOS
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', maxWidth: '420px' }}>
                Ajuste a busca, desative o filtro "Coleção" para ver todas as 890 cartas ou limpe os filtros atuais.
              </div>
              <button
                type="button"
                className="aaa-btn aaa-btn-primary"
                onClick={handleResetFilters}
              >
                Limpar Filtros
              </button>
            </div>
          ) : (
            visibleCards.map((card) => {
              const countInDeck = deckCountsById[card.id] ?? 0;
              const maxAllowed = MAX_COPIES_BY_RARITY[card.rarity];
              const ownedCopies = hasFreeCatalogSelection ? maxAllowed : unlockedCardIds[card.id] ?? 0;
              const effectiveMax = Math.min(maxAllowed, ownedCopies);
              const legCapReached =
                card.rarity === 'legendary' &&
                countInDeck === 0 &&
                deckAnalysis.legendaryCount >= MAX_LEGENDARIES_PER_DECK;
              const canAdd =
                countInDeck < effectiveMax && !legCapReached && deckCardIds.length < 100;

              return (
                <GalleryCardCell
                  key={card.id}
                  card={card}
                  countInDeck={countInDeck}
                  maxAllowed={maxAllowed}
                  ownedCopies={ownedCopies}
                  isGuest={hasFreeCatalogSelection}
                  canAdd={canAdd}
                  onAdd={handleAddCardToDeck}
                  onRemove={handleRemoveCardFromDeck}
                  onInspect={setInspectCard}
                />
              );
            })
          )}
        </div>

        {/* Progressive Scroll Sentinel & Manual Load More Bar */}
        {visibleLimit < filteredCards.length && (
          <div
            ref={loadMoreSentinelRef}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              padding: '1rem',
              margin: '0.5rem 0 1.25rem',
              borderRadius: '8px',
              background: 'rgba(11, 15, 25, 0.85)',
              border: '1px solid rgba(212, 175, 55, 0.28)',
            }}
          >
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Exibindo <strong style={{ color: '#fde68a' }}>{visibleCards.length}</strong> de{' '}
              <strong style={{ color: '#fde68a' }}>{filteredCards.length}</strong> cartas
            </span>
            <button
              type="button"
              className="db-action-btn primary"
              onClick={() =>
                setVisibleLimit((prev) => Math.min(filteredCards.length, prev + VISIBLE_BATCH_STEP))
              }
            >
              + Carregar Mais {Math.min(VISIBLE_BATCH_STEP, filteredCards.length - visibleLimit)}
            </button>
            <button
              type="button"
              className="db-action-btn"
              onClick={() => setVisibleLimit(filteredCards.length)}
            >
              Mostrar Todas ({filteredCards.length})
            </button>
          </div>
        )}
      </div>

      {/* RIGHT SIDEBAR: MODERN SLEEK 100-CARD DECK PANEL */}
      <aside className="db-modern-sidebar">
        {/* Top Deck Header & Prebuilt Selector */}
        <div className="db-sidebar-top">
          <div className="db-sidebar-title-row">
            <input
              type="text"
              className="db-deck-title-input"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              placeholder="Nome do Grimório..."
            />
            <span
              className="db-deck-counter-pill"
              title="Máximo de 10 cartas Lendárias (1× cada) por Grimório de 100 cartas"
              style={{ fontSize: '0.68rem', padding: '0.18rem 0.45rem' }}
            >
              Lendas {deckAnalysis.legendaryCount}/{MAX_LEGENDARIES_PER_DECK}
            </span>
            <span
              className={`db-deck-counter-pill ${
                deckCardIds.length === 100 ? 'is-complete' : ''
              }`}
              title={`${deckAnalysis.uniqueCount} cartas distintas (Comum/Incomum até 3×, Rara até 2×, Lendária 1×)`}
            >
              {deckCardIds.length}/100
            </span>
          </div>

          <div className="db-deck-progress-wrap">
            <div className="db-deck-progress-bar">
              <div
                className={`db-deck-progress-fill ${
                  deckCardIds.length === 100 ? 'is-complete' : ''
                }`}
                style={{ width: `${Math.min(100, deckCardIds.length)}%` }}
              />
            </div>
            <div className="db-deck-progress-meta">
              <span>{deckAnalysis.uniqueCount} cartas distintas</span>
              <strong className={deckCardIds.length === 100 ? 'is-complete' : ''}>
                {deckCardIds.length === 100
                  ? '✓ 100/100 Pronto p/ Combate'
                  : `Faltam ${Math.max(0, 100 - deckCardIds.length)} carta(s)`}
              </strong>
            </div>
          </div>

          {(isGuest || isFirstDeckSetup) && (
            <select
              className="db-prebuilt-select"
              value=""
              onChange={(e) => {
                if (e.target.value) handleLoadPrebuilt(e.target.value);
              }}
            >
              <option value="" disabled>
                Carregar um dos 5 Grimórios Iniciais...
              </option>
              {MONOCHROMATIC_STARTER_DECKS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} — {d.subtitle}
                </option>
              ))}
            </select>
          )}

          {customDecks.length > 0 && (
            <div className="db-saved-decks-row">
              {customDecks.map((cd) => (
                <div key={cd.id} className="db-saved-deck-chip">
                  <button
                    type="button"
                    className="db-saved-load-btn"
                    onClick={() => handleLoadCustom(cd)}
                  >
                    {cd.name}
                  </button>
                  {customDecks.length > 1 && (
                    <button
                      type="button"
                      className="db-saved-del-btn"
                      onClick={() => onDeleteCustomDeck(cd.id)}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="db-sidebar-actions">
            <button
              type="button"
              className="db-action-btn primary"
              onClick={handleSaveCurrentDeck}
              title={
                deckCardIds.length === 100
                  ? 'Salvar este Grimório de 100 cartas para todos os modos de combate'
                  : 'Complete 100 cartas para salvar seu Grimório de Combate'
              }
            >
              {deckCardIds.length === 100 ? 'Salvar (100)' : `Salvar (${deckCardIds.length}/100)`}
            </button>
            <button
              type="button"
              className="db-action-btn"
              onClick={() => setShowTacticalGuideModal(true)}
            >
              Guia
            </button>
            <button
              type="button"
              className="db-action-btn"
              onClick={handleAutoCompleteDeck}
              disabled={deckCardIds.length >= 100}
            >
              Completar
            </button>
            {(isGuest || isFirstDeckSetup) && (
              <button
                type="button"
                className="db-action-btn subtle-danger"
                onClick={() => setDeckCardIds([])}
              >
                Limpar
              </button>
            )}
          </div>

          {saveBanner && <div className="db-save-toast">{saveBanner}</div>}
        </div>

        {/* Minimalist Composition Bar & Mana Curve */}
        <div className="db-sidebar-metrics">
          <div className="db-metrics-header">
            <span className="db-archetype-tag">{deckAnalysis.archetypeTitle}</span>
            <span className="db-avg-cost">Média {deckAnalysis.avgCost}⚡</span>
          </div>

          {/* Thin Segmented Type Proportion Bar */}
          <div className="db-proportion-bar">
            <div
              className="db-seg seg-creature"
              style={{ width: `${creaturePct}%` }}
            />
            <div
              className="db-seg seg-spell"
              style={{ width: `${spellPct}%` }}
            />
            <div
              className="db-seg seg-reaction"
              style={{ width: `${reactionPct}%` }}
            />
            <div
              className="db-seg seg-relic"
              style={{ width: `${relicPct}%` }}
            />
          </div>

          <div className="db-metrics-legend">
            <span>
              <i className="dot-c" /> {deckAnalysis.typeCounts.creature} Criat.
            </span>
            <span>
              <i className="dot-s" /> {deckAnalysis.typeCounts.spell} Feit.
            </span>
            <span>
              <i className="dot-r" /> {deckAnalysis.typeCounts.reaction} Reaç.
            </span>
            <span>
              <i className="dot-l" /> {deckAnalysis.typeCounts.relic} Relíq.
            </span>
          </div>

          {/* Sleek Mana Curve */}
          <div className="db-mini-curve">
            {[1, 2, 3, 4, 5, 6, 7].map((bucket) => {
              const count = deckStats.curve[bucket] ?? 0;
              const heightPct = Math.round((count / deckStats.maxCurveBucket) * 100);
              return (
                <div key={bucket} className="db-curve-col">
                  <span className="db-curve-val">{count > 0 ? count : ''}</span>
                  <div className="db-curve-track">
                    <div
                      className="db-curve-fill"
                      style={{ height: `${count > 0 ? Math.max(12, heightPct) : 0}%` }}
                    />
                  </div>
                  <span className="db-curve-lbl">{bucket === 7 ? '7+' : bucket}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sleek MTG Arena-Style Card Tiles List */}
        <div className="db-deck-list">
          {groupedDeckList.length === 0 ? (
            <div className="db-empty-state">
              Selecione cartas no catálogo ao lado para construir seu Grimório de 100 cartas.
            </div>
          ) : (
            groupedDeckList.map(({ card, count }) => (
              <div
                key={card.id}
                className={`db-deck-tile domain-${card.domain}`}
                onClick={() => setInspectCard(card)}
              >
                <span
                  className="db-tile-domain-bar"
                  style={{ background: DOMAIN_META[card.domain].color }}
                />
                <span className="db-tile-cost">{card.cost}</span>
                <span
                  className={`db-tile-name ${
                    card.rarity === 'legendary' ? 'is-legendary' : ''
                  }`}
                >
                  {card.name}
                </span>
                <div
                  className="db-tile-controls"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="db-tile-count">×{count}</span>
                  <button
                    type="button"
                    className="db-tile-btn"
                    onClick={() => handleRemoveCardFromDeck(card.id)}
                  >
                    −
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* EXPORT AI PROMPTS MODAL */}
      {showPromptsModal && (
        <div className="modal-backdrop" onClick={() => setShowPromptsModal(false)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
                paddingBottom: '0.65rem',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              <div>
                <h3 className="font-cinzel gold-gradient-text" style={{ fontSize: '1.3rem' }}>
                  🎨 Compêndio Ilustrado — {ALL_CARDS.length} Cartas
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  Catálogo completo das {ALL_CARDS.length} cartas ilustradas dos 5 Domínios e Neutras.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="btn-fantasy btn-fantasy-primary"
                  onClick={handleCopyAllPrompts}
                >
                  {copiedId === 'ALL'
                    ? '✅ Todos Copiados!'
                    : `📋 Copiar Lista (${promptCardsList.length})`}
                </button>
                <button
                  type="button"
                  className="btn-fantasy"
                  onClick={() => setShowPromptsModal(false)}
                >
                  ✕ Fechar
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.85rem', flexWrap: 'wrap' }}>
              {(['all', 'red', 'blue', 'purple', 'green', 'gold', 'neutral'] as const).map((dom) => (
                <button
                  key={dom}
                  type="button"
                  className={`nav-tab-btn ${promptDomainFilter === dom ? 'active' : ''}`}
                  onClick={() => setPromptDomainFilter(dom)}
                  style={{ padding: '0.3rem 0.65rem', fontSize: '0.72rem' }}
                >
                  {dom === 'all'
                    ? `Todos (${ALL_CARDS.length})`
                    : `${DOMAIN_META[dom].icon} ${DOMAIN_META[dom].name}`}
                </button>
              ))}
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
                maxHeight: '62vh',
                overflowY: 'auto',
                paddingRight: '0.35rem',
              }}
            >
              {promptCardsList.map((card) => (
                <div
                  key={card.id}
                  style={{
                    padding: '0.7rem',
                    borderRadius: '8px',
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.3rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: '#fde68a', fontSize: '0.84rem' }}>
                      {DOMAIN_META[card.domain].icon} [{card.id}] {card.name} —{' '}
                      <span style={{ color: '#94a3b8', fontWeight: 400 }}>
                        {CARD_TYPE_LABELS[card.type]} ({RARITY_LABELS[card.rarity]}) • Inspiração:{' '}
                        {card.originalInspiration}
                      </span>
                    </span>
                    <button
                      type="button"
                      className="btn-fantasy"
                      style={{ padding: '0.2rem 0.6rem', fontSize: '0.7rem' }}
                      onClick={() => {
                        navigator.clipboard.writeText(card.aiArtPrompt);
                        setCopiedId(card.id);
                        setTimeout(() => setCopiedId(null), 1800);
                      }}
                    >
                      {copiedId === card.id ? '✅ Copiado!' : '📋 Copiar'}
                    </button>
                  </div>
                  <code
                    style={{
                      fontSize: '0.72rem',
                      color: '#cbd5e1',
                      background: 'rgba(0,0,0,0.35)',
                      padding: '0.4rem 0.55rem',
                      borderRadius: '4px',
                      userSelect: 'all',
                    }}
                  >
                    {card.aiArtPrompt}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TACTICAL GUIDE & MATCHUPS MODAL */}
      {showTacticalGuideModal && (
        <TacticalGuideView
          customDecks={[
            ...customDecks.filter((cd) => cd.id !== editingDeckId),
            ...(deckCardIds.length > 0
              ? [{ id: editingDeckId, name: deckName || 'Deck em Edição', cardIds: deckCardIds }]
              : []),
          ]}
          initialPlayerDeckId={deckCardIds.length > 0 ? editingDeckId : activeGuideDeckId}
          initialViewSection={guideModalSection}
          isModal={true}
          onClose={() => {
            setShowTacticalGuideModal(false);
            setGuideModalSection('deck_mastery');
          }}
        />
      )}

      {/* CARD INSPECT MODAL */}
      {inspectCard && (
        <CardInspectModal card={inspectCard} onClose={() => setInspectCard(null)} />
      )}
    </div>
  );
};
