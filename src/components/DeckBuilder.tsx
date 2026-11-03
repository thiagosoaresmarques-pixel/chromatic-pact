import React, { Suspense, useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { CardDefinition, CardType, Domain, Keyword, Rarity } from '../types/game';
import { ALL_CARDS, CARDS_BY_ID } from '../data/cards';
import { PREBUILT_DECKS, MAX_COPIES_BY_RARITY, MAX_LEGENDARIES_PER_DECK } from '../data/decks';
import {
  getTrainedBicolorPrebuiltDecks,
  getTrainedMonocolorPrebuiltDecks,
  getTrainedPolycolorPrebuiltDecks,
} from '../data/aiMonocolorMastery';
import {
  CardView,
  CardInspectModal,
  DOMAIN_META,
  RARITY_LABELS,
  CARD_TYPE_LABELS,
  formatCardFaceDescription,
} from './CardView';
import type { CustomSavedDeck } from './BattleArena';
const TacticalGuideView = React.lazy(() =>
  import('./TacticalGuideView').then((m) => ({ default: m.TacticalGuideView }))
);
import { TACTICAL_COMBOS_COMPENDIUM } from '../data/combosCompendium';
import {
  GRIMOIRE_REPLACEMENT_GOLD_COST,
  MONOCHROMATIC_STARTER_DECKS,
} from '../utils/multiplayerEngine';
import { buildShareableDeckUrl, decodeDeckCode } from '../utils/portableCodex';
import { canCraftCard, CRAFT_COST_BY_RARITY } from '../utils/craftingEngine';
import { playSfx } from '../utils/soundEngine';

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
  gold?: number;
  astralShards?: number;
  onCraftCard?: (card: CardDefinition) => void;
  salvageableInfo?: { totalShardsEarned: number; cardsSalvagedCount: number };
  onSalvageDuplicates?: () => void;
  onSaveCustomDeck: (deck: CustomSavedDeck, options?: { replaceBaseGrimoire?: boolean }) => void;
  onDeleteCustomDeck: (deckId: string) => void;
  isGuest?: boolean;
  username?: string;
  onRequireAccount?: () => void;
  initialTemplateDeckId?: string | null;
  onConsumeInitialTemplate?: () => void;
  initialSharedDeckCode?: string | null;
  onConsumeInitialSharedDeck?: () => void;
}

interface GalleryCardCellProps {
  card: CardDefinition;
  countInDeck: number;
  maxAllowed: number;
  ownedCopies: number;
  isGuest?: boolean;
  canAdd: boolean;
  craftCost?: number;
  canAffordCraft?: boolean;
  onCraft?: (card: CardDefinition) => void;
  onAdd: (card: CardDefinition) => void;
  onRemove: (cardId: string) => void;
  onInspect: (card: CardDefinition) => void;
}

const GalleryCardCell = React.memo<GalleryCardCellProps>(
  ({
    card,
    countInDeck,
    maxAllowed,
    ownedCopies,
    isGuest,
    canAdd,
    craftCost,
    canAffordCraft,
    onCraft,
    onAdd,
    onRemove,
    onInspect,
  }) => {
    const isLockedForUser = !isGuest && ownedCopies <= 0;
    const effectiveMax = isGuest ? maxAllowed : Math.min(maxAllowed, ownedCopies);
    const showCraftBtn = !isGuest && Boolean(onCraft) && ownedCopies < maxAllowed;
    return (
      <div
        className="db-card-cell"
        style={isLockedForUser ? { opacity: 0.56, filter: 'grayscale(0.55)' } : undefined}
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
                ? 'Carta bloqueada — forje com Estilhaços Astrais ou obtenha no Relicário'
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
        {showCraftBtn && craftCost !== undefined && (
          <button
            type="button"
            className={`db-craft-mini-btn ${canAffordCraft ? 'can-afford' : ''}`}
            disabled={!canAffordCraft}
            onClick={() => {
              playSfx('ascend');
              onCraft?.(card);
            }}
            title={
              canAffordCraft
                ? `Forjar +1 cópia de ${card.name} por ${craftCost} Estilhaços Astrais`
                : `Estilhaços insuficientes para forjar (${craftCost} 💎 necessários)`
            }
          >
            ⚒️ Forjar ({craftCost} 💎)
          </button>
        )}
      </div>
    );
  }
);

const INITIAL_VISIBLE_CARDS = 60;
const VISIBLE_BATCH_STEP = 60;

export type DeckSortMode =
  | 'domain_cost'
  | 'cost_domain'
  | 'cost_desc'
  | 'rarity_desc'
  | 'atk_desc'
  | 'hp_desc'
  | 'name_asc';

const DOMAIN_SORT_ORDER: Record<Domain, number> = {
  red: 0,
  blue: 1,
  purple: 2,
  green: 3,
  gold: 4,
  neutral: 5,
};

const RARITY_SORT_ORDER: Record<Rarity, number> = {
  common: 0,
  uncommon: 1,
  rare: 2,
  legendary: 3,
};

const TYPE_SORT_ORDER: Record<CardType, number> = {
  creature: 0,
  relic: 1,
  spell: 2,
  reaction: 3,
};

function compareDeckBuilderCards(a: CardDefinition, b: CardDefinition, sortMode: DeckSortMode): number {
  switch (sortMode) {
    case 'domain_cost':
      return (
        DOMAIN_SORT_ORDER[a.domain] - DOMAIN_SORT_ORDER[b.domain] ||
        a.cost - b.cost ||
        TYPE_SORT_ORDER[a.type] - TYPE_SORT_ORDER[b.type] ||
        RARITY_SORT_ORDER[a.rarity] - RARITY_SORT_ORDER[b.rarity] ||
        a.name.localeCompare(b.name, 'pt-BR')
      );
    case 'cost_domain':
      return (
        a.cost - b.cost ||
        DOMAIN_SORT_ORDER[a.domain] - DOMAIN_SORT_ORDER[b.domain] ||
        TYPE_SORT_ORDER[a.type] - TYPE_SORT_ORDER[b.type] ||
        RARITY_SORT_ORDER[a.rarity] - RARITY_SORT_ORDER[b.rarity] ||
        a.name.localeCompare(b.name, 'pt-BR')
      );
    case 'cost_desc':
      return (
        b.cost - a.cost ||
        DOMAIN_SORT_ORDER[a.domain] - DOMAIN_SORT_ORDER[b.domain] ||
        RARITY_SORT_ORDER[b.rarity] - RARITY_SORT_ORDER[a.rarity] ||
        a.name.localeCompare(b.name, 'pt-BR')
      );
    case 'rarity_desc':
      return (
        RARITY_SORT_ORDER[b.rarity] - RARITY_SORT_ORDER[a.rarity] ||
        DOMAIN_SORT_ORDER[a.domain] - DOMAIN_SORT_ORDER[b.domain] ||
        a.cost - b.cost ||
        a.name.localeCompare(b.name, 'pt-BR')
      );
    case 'atk_desc':
      return (
        b.atk - a.atk ||
        a.cost - b.cost ||
        DOMAIN_SORT_ORDER[a.domain] - DOMAIN_SORT_ORDER[b.domain] ||
        a.name.localeCompare(b.name, 'pt-BR')
      );
    case 'hp_desc':
      return (
        b.hp - a.hp ||
        a.cost - b.cost ||
        DOMAIN_SORT_ORDER[a.domain] - DOMAIN_SORT_ORDER[b.domain] ||
        a.name.localeCompare(b.name, 'pt-BR')
      );
    case 'name_asc':
      return (
        a.name.localeCompare(b.name, 'pt-BR') ||
        DOMAIN_SORT_ORDER[a.domain] - DOMAIN_SORT_ORDER[b.domain] ||
        a.cost - b.cost
      );
  }
}

interface AbilityFilterOption {
  id: string;
  group: 'keywords' | 'mechanics' | 'effects' | 'triggers';
  label: string;
  matches: (card: CardDefinition) => boolean;
}

const hasKeywordOrAscension = (c: CardDefinition, kw: Keyword): boolean =>
  c.keywords.includes(kw) || Boolean(c.ascension?.addedKeywords?.includes(kw));

const ABILITY_FILTER_OPTIONS: AbilityFilterOption[] = [
  // 1. Palavras-Chave de Combate (11)
  { id: 'kw:Guardião', group: 'keywords', label: 'Guardião', matches: (c) => hasKeywordOrAscension(c, 'Guardião') },
  { id: 'kw:Voo', group: 'keywords', label: 'Voo', matches: (c) => hasKeywordOrAscension(c, 'Voo') },
  { id: 'kw:Alcance', group: 'keywords', label: 'Alcance', matches: (c) => hasKeywordOrAscension(c, 'Alcance') },
  { id: 'kw:Ímpeto', group: 'keywords', label: 'Ímpeto', matches: (c) => hasKeywordOrAscension(c, 'Ímpeto') },
  { id: 'kw:Atropelar', group: 'keywords', label: 'Atropelar', matches: (c) => hasKeywordOrAscension(c, 'Atropelar') },
  { id: 'kw:Toque Letal', group: 'keywords', label: 'Toque Letal', matches: (c) => hasKeywordOrAscension(c, 'Toque Letal') },
  { id: 'kw:Escudo Divino', group: 'keywords', label: 'Escudo Divino', matches: (c) => hasKeywordOrAscension(c, 'Escudo Divino') },
  { id: 'kw:Dreno de Vida', group: 'keywords', label: 'Dreno de Vida', matches: (c) => hasKeywordOrAscension(c, 'Dreno de Vida') },
  { id: 'kw:Renascer', group: 'keywords', label: 'Renascer', matches: (c) => hasKeywordOrAscension(c, 'Renascer') },
  { id: 'kw:Pele Incandescente', group: 'keywords', label: 'Pele Incandescente', matches: (c) => hasKeywordOrAscension(c, 'Pele Incandescente') },
  { id: 'kw:Fúria Crescente', group: 'keywords', label: 'Fúria Crescente', matches: (c) => hasKeywordOrAscension(c, 'Fúria Crescente') },

  // 2. Atributos, Mecânicas & Fileira
  {
    id: 'mech:armor',
    group: 'mechanics',
    label: 'Armadura',
    matches: (c) =>
      c.armor > 0 ||
      (c.ascension?.newArmor ?? 0) > 0 ||
      c.effects.some((e) => e.type === 'shield_all_allies' && (e.secondaryValue ?? 0) > 0),
  },
  { id: 'mech:regeneration', group: 'mechanics', label: 'Regeneração', matches: (c) => (c.regeneration ?? 0) > 0 },
  { id: 'mech:breath', group: 'mechanics', label: 'Sopro Elemental', matches: (c) => (c.breathDamage ?? 0) > 0 },
  { id: 'mech:ascension', group: 'mechanics', label: 'Ascensão (Evolução)', matches: (c) => Boolean(c.ascension) },
  {
    id: 'mech:break_domain',
    group: 'mechanics',
    label: 'Quebra-Domínio',
    matches: (c) => c.effects.some((e) => e.type === 'break_domain_expansion'),
  },
  { id: 'mech:corruption', group: 'mechanics', label: 'Custo de Corrupção', matches: (c) => (c.corruptionCost ?? 0) > 0 },
  {
    id: 'row:vanguard',
    group: 'mechanics',
    label: 'Fileira: Vanguarda',
    matches: (c) => c.type === 'creature' && c.preferredRow === 'vanguard',
  },
  {
    id: 'row:rearguard',
    group: 'mechanics',
    label: 'Fileira: Retaguarda',
    matches: (c) =>
      (c.type === 'creature' && c.preferredRow === 'rearguard') ||
      c.type === 'relic' ||
      c.type === 'reaction',
  },

  // 3. Efeitos Ativos
  {
    id: 'eff:freeze',
    group: 'effects',
    label: 'Congelar',
    matches: (c) => c.effects.some((e) => e.type === 'freeze_enemy' || e.type === 'freeze_enemy_vanguard'),
  },
  {
    id: 'eff:aoe_damage',
    group: 'effects',
    label: 'Dano em Área / Fileira',
    matches: (c) =>
      (c.breathDamage ?? 0) > 0 ||
      c.effects.some((e) => e.type === 'damage_enemy_row' || e.type === 'damage_all_units'),
  },
  {
    id: 'eff:single_damage',
    group: 'effects',
    label: 'Dano Direto (Alvo / Soberano)',
    matches: (c) =>
      c.effects.some((e) => e.type === 'damage_single_enemy' || e.type === 'damage_enemy_sovereign'),
  },
  {
    id: 'eff:removal',
    group: 'effects',
    label: 'Destruir / Devolver / Roubar',
    matches: (c) =>
      c.effects.some(
        (e) => e.type === 'destroy_enemy' || e.type === 'bounce_enemy' || e.type === 'steal_small_enemy'
      ),
  },
  {
    id: 'eff:draw',
    group: 'effects',
    label: 'Comprar Cartas',
    matches: (c) => c.effects.some((e) => e.type === 'draw_cards'),
  },
  {
    id: 'eff:essence',
    group: 'effects',
    label: 'Gerar Essência',
    matches: (c) => c.effects.some((e) => e.type === 'grant_bonus_essence'),
  },
  {
    id: 'eff:heal',
    group: 'effects',
    label: 'Cura / Restauração',
    matches: (c) =>
      c.effects.some(
        (e) => e.type === 'heal_sovereign' || e.type === 'heal_all_allies' || e.type === 'heal_target_ally'
      ),
  },
  {
    id: 'eff:buff',
    group: 'effects',
    label: 'Fortalecer / Escudar Aliados',
    matches: (c) =>
      c.effects.some(
        (e) => e.type === 'buff_target_ally' || e.type === 'buff_all_allies' || e.type === 'shield_all_allies'
      ),
  },
  {
    id: 'eff:debuff',
    group: 'effects',
    label: 'Reduzir Ataque (-ATQ)',
    matches: (c) => c.effects.some((e) => e.type === 'debuff_enemy_vanguard_atk'),
  },
  {
    id: 'eff:revive',
    group: 'effects',
    label: 'Reanimar da Cripta',
    matches: (c) => c.effects.some((e) => e.type === 'revive_from_crypt'),
  },
  {
    id: 'eff:summon',
    group: 'effects',
    label: 'Invocar Fichas',
    matches: (c) => c.effects.some((e) => e.type === 'summon_token'),
  },

  // 4. Gatilhos
  {
    id: 'trig:on_enter',
    group: 'triggers',
    label: 'Ao Entrar / Lançar',
    matches: (c) => c.effects.some((e) => e.trigger === 'on_enter'),
  },
  {
    id: 'trig:on_attack',
    group: 'triggers',
    label: 'Ao Atacar',
    matches: (c) => c.effects.some((e) => e.trigger === 'on_attack'),
  },
  {
    id: 'trig:on_death',
    group: 'triggers',
    label: 'Ao Morrer (Último Suspiro)',
    matches: (c) => c.effects.some((e) => e.trigger === 'on_death'),
  },
  {
    id: 'trig:spell_cast',
    group: 'triggers',
    label: 'Ao Conjurar Feitiço',
    matches: (c) => c.effects.some((e) => e.trigger === 'spell_cast'),
  },
  {
    id: 'trig:turn_cycle',
    group: 'triggers',
    label: 'Início / Fim do Turno',
    matches: (c) => c.effects.some((e) => e.trigger === 'turn_start' || e.trigger === 'turn_end'),
  },
];

const ABILITY_FILTER_BY_ID: Record<string, AbilityFilterOption> = Object.fromEntries(
  ABILITY_FILTER_OPTIONS.map((opt) => [opt.id, opt])
);

const ABILITY_GROUP_LABELS: Record<AbilityFilterOption['group'], string> = {
  keywords: 'Palavras-Chave de Combate',
  mechanics: 'Atributos, Mecânicas & Fileira',
  effects: 'Habilidades & Efeitos Ativos',
  triggers: 'Gatilhos de Ativação',
};

export const DeckBuilder: React.FC<DeckBuilderProps> = ({
  unlockedCardIds,
  customDecks,
  gold = 0,
  astralShards = 0,
  onCraftCard,
  salvageableInfo,
  onSalvageDuplicates,
  onSaveCustomDeck,
  onDeleteCustomDeck,
  isGuest = false,
  onRequireAccount,
  initialTemplateDeckId,
  onConsumeInitialTemplate,
  initialSharedDeckCode,
  onConsumeInitialSharedDeck,
}) => {
  // First-time deck setup is 100% free; from the 2nd time onward, full editing/reforging costs 100 Gold
  const isFirstDeckSetup = !isGuest && customDecks.length === 0;
  const [isReplacingGrimoire, setIsReplacingGrimoire] = useState<boolean>(false);
  const [lastRequestedTemplateId, setLastRequestedTemplateId] = useState<string | null>(null);
  const hasFreeCatalogSelection = isGuest || isFirstDeckSetup || isReplacingGrimoire;
  const totalOwnedCopies = useMemo(
    () => Object.values(unlockedCardIds).reduce((sum, n) => sum + n, 0),
    [unlockedCardIds]
  );
  const canModifySavedGrimoire =
    isGuest || isFirstDeckSetup || isReplacingGrimoire || totalOwnedCopies > 100;

  // Filters & Sorting
  const [domainFilter, setDomainFilter] = useState<Domain | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<CardType | 'all'>('all');
  const [rarityFilter, setRarityFilter] = useState<Rarity | 'all'>('all');
  const [abilityFilter, setAbilityFilter] = useState<string>('all');
  const [secondaryAbilityFilter, setSecondaryAbilityFilter] = useState<string>('all');
  const [sortMode, setSortMode] = useState<DeckSortMode>('domain_cost');
  const [costFilter, setCostFilter] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyUnlocked, setOnlyUnlocked] = useState<boolean>(false);
  const [onlyMissingCopies, setOnlyMissingCopies] = useState<boolean>(false);
  const [synergyFilterId, setSynergyFilterId] = useState<string | 'all' | 'recommended'>('all');
  const [showSynergyPanel, setShowSynergyPanel] = useState<boolean>(false);
  const [isMobileDeckListOpen, setIsMobileDeckListOpen] = useState<boolean>(false);

  // Active Deck Being Edited (starts empty 0/100 when user has no saved Grimoire yet)
  const [deckName, setDeckName] = useState<string>(() =>
    customDecks[0]?.name ?? (isGuest ? MONOCHROMATIC_STARTER_DECKS[0]?.name ?? 'Grimório Visitante' : 'Meu 1º Grimório')
  );
  const [editingDeckId, setEditingDeckId] = useState<string>(
    () => customDecks[0]?.id ?? `custom_${Date.now()}`
  );
  const [deckCardIds, setDeckCardIds] = useState<string[]>(
    () => customDecks[0]?.cardIds ?? (isGuest ? MONOCHROMATIC_STARTER_DECKS[0]?.cardIds ?? [] : [])
  );

  // Sync active deck when user switches account, resets Grimoire, or saves their first Grimório
  useEffect(() => {
    if (customDecks.length > 0 && !customDecks.some((d) => d.id === editingDeckId)) {
      setDeckName(customDecks[0].name);
      setEditingDeckId(customDecks[0].id);
      setDeckCardIds([...customDecks[0].cardIds]);
    } else if (!isGuest && customDecks.length === 0 && editingDeckId === 'starter_deck_pyros_steel_100') {
      setDeckName('Meu 1º Grimório');
      setEditingDeckId(`custom_${Date.now()}`);
      setDeckCardIds([]);
    }
  }, [customDecks, editingDeckId, isGuest]);

  // Modals
  const [inspectCard, setInspectCard] = useState<CardDefinition | null>(null);
  const [showPromptsModal, setShowPromptsModal] = useState<boolean>(false);
  const [lazyArtPrompts, setLazyArtPrompts] = useState<Record<string, string> | null>(null);
  const [showTacticalGuideModal, setShowTacticalGuideModal] = useState<boolean>(false);

  useEffect(() => {
    if (!showPromptsModal || lazyArtPrompts) return;
    import('../data/cardArtPrompts')
      .then((m) => setLazyArtPrompts(m.CARD_ART_PROMPTS))
      .catch(() => setLazyArtPrompts({}));
  }, [showPromptsModal, lazyArtPrompts]);
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
    abilityFilter,
    secondaryAbilityFilter,
    sortMode,
    costFilter,
    onlyUnlocked,
    onlyMissingCopies,
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

  // Grouped deck entries sorted by Color -> Cost (or active sortMode)
  const groupedDeckList = useMemo(() => {
    const uniqueIds = Object.keys(deckCountsById);
    const items = uniqueIds
      .map((id) => ({
        card: CARDS_BY_ID[id],
        count: deckCountsById[id],
      }))
      .filter((item): item is { card: CardDefinition; count: number } => Boolean(item.card));

    items.sort((a, b) => compareDeckBuilderCards(a.card, b.card, sortMode));
    return items;
  }, [deckCountsById, sortMode]);

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

  // Filtered & sorted 500-card catalog (default: Color -> Cost)
  const filteredCards = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const activePrimaryAbility =
      abilityFilter !== 'all' ? ABILITY_FILTER_BY_ID[abilityFilter] ?? null : null;
    const activeSecondaryAbility =
      abilityFilter !== 'all' && secondaryAbilityFilter !== 'all'
        ? ABILITY_FILTER_BY_ID[secondaryAbilityFilter] ?? null
        : null;
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
      if (activePrimaryAbility && !activePrimaryAbility.matches(card)) return false;
      if (activeSecondaryAbility && !activeSecondaryAbility.matches(card)) return false;
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
      if (onlyMissingCopies && (unlockedCardIds[card.id] ?? 0) >= MAX_COPIES_BY_RARITY[card.rarity]) {
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
          formatCardFaceDescription(card),
          card.originalInspiration ?? '',
          ...card.keywords,
          ...(card.ascension?.addedKeywords ?? []),
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    }).sort((a, b) => compareDeckBuilderCards(a, b, sortMode));
  }, [
    domainFilter,
    typeFilter,
    rarityFilter,
    abilityFilter,
    secondaryAbilityFilter,
    sortMode,
    costFilter,
    onlyUnlocked,
    onlyMissingCopies,
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
          `Carta bloqueada na coleção. Clique em "Editar (${GRIMOIRE_REPLACEMENT_GOLD_COST} 🪙)" para liberar todo o catálogo ou abra pacotes no Relicário!`
        );
        setTimeout(() => setSaveBanner(null), 3500);
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
          `🔒 Clique em "Editar (${GRIMOIRE_REPLACEMENT_GOLD_COST} 🪙)" para editar livremente seu Grimório com qualquer carta do catálogo ou desbloqueie novas cartas no Relicário!`
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
    playSfx('channel');
    setSaveBanner(
      nextIds.length === 100
        ? 'Grimório completado para 100/100 cartas — toque em Salvar grimório.'
        : `Adicionadas ${nextIds.length - deckCardIds.length} cartas disponíveis (${nextIds.length}/100).`
    );
    setTimeout(() => setSaveBanner(null), 3200);
  };

  const handleLoadPrebuilt = useCallback(
    (prebuiltId: string, forceFullCatalog = false) => {
      const allTemplates = [
        ...getTrainedPolycolorPrebuiltDecks(5),
        ...getTrainedBicolorPrebuiltDecks(5),
        ...getTrainedMonocolorPrebuiltDecks(5),
        ...PREBUILT_DECKS,
      ];
      const found = allTemplates.find((d) => d.id === prebuiltId);
      if (!found) return;

      setActiveGuideDeckId(prebuiltId);
      setLastRequestedTemplateId(prebuiltId);

      if (forceFullCatalog || isGuest || isFirstDeckSetup || isReplacingGrimoire) {
        setDeckName(`${found.name}`);
        setEditingDeckId(customDecks[0]?.id ?? `custom_${Date.now()}`);
        setDeckCardIds([...found.cardIds]);
        setSaveBanner(`✨ Modelo "${found.name}" (100/100 cartas) carregado na Forja!`);
        setTimeout(() => setSaveBanner(null), 3500);
        return;
      }

      // Registered account with an existing consecrated Base Grimoire:
      // Load the subset of cards currently owned in collection & offer 1-click Substituir Grimório (100 Gold) for full 100/100
      const accepted: string[] = [];
      const usedCounts: Record<string, number> = {};
      let legs = 0;
      for (const cid of found.cardIds) {
        const card = CARDS_BY_ID[cid];
        if (!card || accepted.length >= 100) continue;
        const maxRarity = MAX_COPIES_BY_RARITY[card.rarity] ?? 2;
        const owned = unlockedCardIds[cid] ?? 0;
        const cur = usedCounts[cid] ?? 0;
        if (card.rarity === 'legendary' && legs >= MAX_LEGENDARIES_PER_DECK) continue;
        if (cur < maxRarity && cur < owned) {
          accepted.push(cid);
          usedCounts[cid] = cur + 1;
          if (card.rarity === 'legendary') legs += 1;
        }
      }
      setDeckName(`${found.name}`);
      setEditingDeckId(customDecks[0]?.id ?? `custom_${Date.now()}`);
      setDeckCardIds(accepted);
      setSaveBanner(
        accepted.length === 100
          ? `"${found.name}" (100/100 cartas da sua coleção) carregado na Forja.`
          : `"${found.name}": ${accepted.length}/100 cartas disponíveis na sua coleção carregadas. Clique em "Editar (${GRIMOIRE_REPLACEMENT_GOLD_COST} Ouro)" para liberar as 100 cartas completas deste Soberano.`
      );
      setTimeout(() => setSaveBanner(null), 4500);
    },
    [customDecks, isFirstDeckSetup, isGuest, isReplacingGrimoire, unlockedCardIds]
  );

  useEffect(() => {
    if (!initialTemplateDeckId) return;
    handleLoadPrebuilt(initialTemplateDeckId);
    onConsumeInitialTemplate?.();
  }, [initialTemplateDeckId, handleLoadPrebuilt, onConsumeInitialTemplate]);

  const handleStartReplaceGrimoire = () => {
    if (isGuest) {
      onRequireAccount?.();
      return;
    }
    if (gold < GRIMOIRE_REPLACEMENT_GOLD_COST) {
      setSaveBanner(
        `Saldo insuficiente! São necessários ${GRIMOIRE_REPLACEMENT_GOLD_COST} Ouro para substituir seu Grimório Base (Saldo atual: ${gold} Ouro).`
      );
      setTimeout(() => setSaveBanner(null), 3800);
      return;
    }
    setIsReplacingGrimoire(true);
    setOnlyUnlocked(false);
    if (lastRequestedTemplateId) {
      handleLoadPrebuilt(lastRequestedTemplateId, true);
      setSaveBanner(
        `Modo de Substituição ativado! As 100 cartas completas do Campeão selecionado foram liberadas — clique em Confirmar (-${GRIMOIRE_REPLACEMENT_GOLD_COST} Ouro).`
      );
    } else {
      setSaveBanner(
        `Modo de Substituição ativado! Escolha um novo Grimório de 100 cartas e clique em Confirmar (-${GRIMOIRE_REPLACEMENT_GOLD_COST} Ouro).`
      );
    }
    setTimeout(() => setSaveBanner(null), 4000);
  };

  const handleCancelReplaceGrimoire = () => {
    setIsReplacingGrimoire(false);
    setLastRequestedTemplateId(null);
    if (customDecks[0]) {
      setDeckName(customDecks[0].name);
      setEditingDeckId(customDecks[0].id);
      setDeckCardIds([...customDecks[0].cardIds]);
    }
    setSaveBanner('Substituição cancelada. Seu Grimório atual e seu Ouro foram mantidos.');
    setTimeout(() => setSaveBanner(null), 3000);
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
    if (isReplacingGrimoire && gold < GRIMOIRE_REPLACEMENT_GOLD_COST) {
      setSaveBanner(
        `Saldo insuficiente (${gold}/${GRIMOIRE_REPLACEMENT_GOLD_COST} Ouro) para confirmar a substituição do Grimório Base.`
      );
      setTimeout(() => setSaveBanner(null), 3500);
      return;
    }
    if (!isFirstDeckSetup && !isReplacingGrimoire) {
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
    const wasReplacing = isReplacingGrimoire;
    if (wasReplacing) {
      setIsReplacingGrimoire(false);
    }
    setLastRequestedTemplateId(null);
    onSaveCustomDeck(
      {
        id: editingDeckId,
        name: cleanName,
        cardIds: deckCardIds,
      },
      wasReplacing ? { replaceBaseGrimoire: true } : undefined
    );
    setSaveBanner(
      wasReplacing
        ? `Novo Grimório Base "${cleanName}" (100 cartas) consagrado por ${GRIMOIRE_REPLACEMENT_GOLD_COST} Ouro!`
        : `Grimório "${cleanName}" (100 cartas) salvo! Todos os modos de combate estão liberados.`
    );
    setTimeout(() => setSaveBanner(null), 3500);
  };

  const handleLoadCustom = (custom: CustomSavedDeck) => {
    setActiveGuideDeckId(custom.id);
    setDeckName(custom.name);
    setEditingDeckId(custom.id);
    setDeckCardIds([...custom.cardIds]);
  };

  const [showImportCodeBox, setShowImportCodeBox] = useState<boolean>(false);
  const [importCodeInput, setImportCodeInput] = useState<string>('');
  const [deckLinkCopied, setDeckLinkCopied] = useState<'none' | 'url' | 'discord'>('none');
  const [lastSharedDeckUrl, setLastSharedDeckUrl] = useState<string>('');

  const handleShareDeckLink = async (mode: 'url' | 'discord' = 'url') => {
    if (deckCardIds.length === 0) {
      setSaveBanner('Adicione cartas ao Grimório antes de gerar o link.');
      setTimeout(() => setSaveBanner(null), 2800);
      return;
    }
    const shareUrl = buildShareableDeckUrl(deckName, deckCardIds);
    setLastSharedDeckUrl(shareUrl);

    const safeTitle = (deckName || 'Grimório Cromático').replace(/[[\]]/g, '').trim();
    const clipboardText =
      mode === 'discord'
        ? `[Grimório: ${safeTitle} (${deckCardIds.length} cartas)](${shareUrl})`
        : shareUrl;

    let copiedOk = false;
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(clipboardText);
        copiedOk = true;
      } catch {
        copiedOk = false;
      }
    }
    if (!copiedOk) {
      const ta = document.createElement('textarea');
      ta.value = clipboardText;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }

    if (
      mode === 'url' &&
      typeof navigator.share === 'function' &&
      typeof window !== 'undefined' &&
      window.innerWidth <= 768
    ) {
      void navigator
        .share({
          title: `Grimório: ${deckName || 'Chromatic Pact'}`,
          url: shareUrl,
        })
        .catch(() => {});
    }

    setDeckLinkCopied(mode);
    setTimeout(() => setDeckLinkCopied('none'), 2400);
    setSaveBanner(
      mode === 'discord'
        ? 'Texto formatado para Discord copiado (sem URL exposta).'
        : `Link compartilhável do Grimório copiado (${deckCardIds.length} cartas).`
    );
    setTimeout(() => setSaveBanner(null), 3200);
  };

  const applyDecodedDeckInput = useCallback(
    (rawInput: string, source: 'manual' | 'link'): boolean => {
      const res = decodeDeckCode(rawInput);
      if (!res.ok) {
        setSaveBanner(res.error);
        setTimeout(() => setSaveBanner(null), 3500);
        return false;
      }
      const { name, cardIds } = res.data;
      const enforceOwnedOnLoad =
        source === 'manual' && !isGuest && !isFirstDeckSetup && !isReplacingGrimoire;
      const accepted: string[] = [];
      const usedCounts: Record<string, number> = {};
      let omitted = 0;
      let missingFromCollection = 0;

      for (const cid of cardIds) {
        const card = CARDS_BY_ID[cid];
        if (!card || accepted.length >= 100) continue;
        const maxRarity = MAX_COPIES_BY_RARITY[card.rarity] ?? 2;
        const cur = usedCounts[cid] ?? 0;
        const owned = unlockedCardIds[cid] ?? 0;
        if (cur >= maxRarity) {
          omitted += 1;
          continue;
        }
        if (enforceOwnedOnLoad && cur >= owned) {
          omitted += 1;
          continue;
        }
        if (!isGuest && !isFirstDeckSetup && !isReplacingGrimoire && cur >= owned) {
          missingFromCollection += 1;
        }
        accepted.push(cid);
        usedCounts[cid] = cur + 1;
      }

      setDeckName(name);
      setDeckCardIds(accepted);
      setShowImportCodeBox(false);
      setImportCodeInput('');
      setSaveBanner(
        source === 'link'
          ? missingFromCollection > 0
            ? `Grimório compartilhado "${name}" (${accepted.length} cartas) carregado (${missingFromCollection} fora da sua coleção atual).`
            : `Grimório compartilhado "${name}" (${accepted.length} cartas) carregado com sucesso.`
          : omitted > 0
          ? `"${name}" importado com ${accepted.length} cartas disponíveis (${omitted} fora da sua coleção atual).`
          : `Grimório "${name}" (${accepted.length} cartas) importado com sucesso.`
      );
      setTimeout(() => setSaveBanner(null), 4200);
      return true;
    },
    [isGuest, isFirstDeckSetup, isReplacingGrimoire, unlockedCardIds]
  );

  const handleApplyImportedDeckCode = () => {
    applyDecodedDeckInput(importCodeInput, 'manual');
  };

  useEffect(() => {
    if (!initialSharedDeckCode) return;
    applyDecodedDeckInput(initialSharedDeckCode, 'link');
    onConsumeInitialSharedDeck?.();
  }, [initialSharedDeckCode, applyDecodedDeckInput, onConsumeInitialSharedDeck]);

  const promptCardsList = useMemo(() => {
    if (promptDomainFilter === 'all') return ALL_CARDS;
    return ALL_CARDS.filter((c) => c.domain === promptDomainFilter);
  }, [promptDomainFilter]);

  const handleCopyAllPrompts = async () => {
    const promptsMap =
      lazyArtPrompts ??
      (await import('../data/cardArtPrompts').then((m) => {
        setLazyArtPrompts(m.CARD_ART_PROMPTS);
        return m.CARD_ART_PROMPTS;
      }));
    const text = promptCardsList
      .map(
        (c) =>
          `### ${c.id} — ${c.name} (${DOMAIN_META[c.domain].name})\nArquivo: ${c.imagePath}\nPrompt: ${promptsMap?.[c.id] ?? c.aiArtPrompt ?? ''}\n`
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

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const activeSecondaryFilterCount =
    (typeFilter !== 'all' ? 1 : 0) +
    (rarityFilter !== 'all' ? 1 : 0) +
    (abilityFilter !== 'all' ? 1 : 0) +
    (secondaryAbilityFilter !== 'all' ? 1 : 0) +
    (sortMode !== 'domain_cost' ? 1 : 0) +
    (costFilter !== 'all' ? 1 : 0) +
    (onlyUnlocked ? 1 : 0) +
    (onlyMissingCopies ? 1 : 0);

  const hasActiveFilters =
    domainFilter !== 'all' ||
    typeFilter !== 'all' ||
    rarityFilter !== 'all' ||
    abilityFilter !== 'all' ||
    secondaryAbilityFilter !== 'all' ||
    sortMode !== 'domain_cost' ||
    costFilter !== 'all' ||
    onlyUnlocked ||
    onlyMissingCopies ||
    searchQuery.trim() !== '' ||
    synergyFilterId !== 'all';

  const handleResetFilters = () => {
    setDomainFilter('all');
    setTypeFilter('all');
    setRarityFilter('all');
    setAbilityFilter('all');
    setSecondaryAbilityFilter('all');
    setSortMode('domain_cost');
    setCostFilter('all');
    setOnlyUnlocked(false);
    setOnlyMissingCopies(false);
    setSearchQuery('');
    setSynergyFilterId('all');
  };

  return (
    <div className="db-modern-shell">
      {/* LEFT CATALOG AREA */}
      <div className="db-catalog-area">
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

          {/* Unified Search Input + Mobile Progressive-Disclosure Filter Toggle */}
          <div className="db-search-row-mobile">
            <div className="db-search-wrap">
              <input
                type="text"
                className="db-modern-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar carta..."
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
            <button
              type="button"
              className={`db-analytics-toggle-btn db-mobile-filters-btn show-on-mobile-inline ${
                isMobileFiltersOpen || activeSecondaryFilterCount > 0 ? 'is-open' : ''
              }`}
              onClick={() => setIsMobileFiltersOpen((prev) => !prev)}
            >
              <span>
                Filtros{activeSecondaryFilterCount > 0 ? ` (${activeSecondaryFilterCount})` : ''}{' '}
                {isMobileFiltersOpen ? '▴' : '▾'}
              </span>
            </button>
          </div>

          <div
            className={`db-advanced-filters-group ${
              isMobileFiltersOpen ? 'is-mobile-open' : ''
            }`}
          >
          <select
            className={`db-modern-select ${typeFilter !== 'all' ? 'is-highlighted' : ''}`}
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
            className={`db-modern-select ${rarityFilter !== 'all' ? 'is-highlighted' : ''}`}
            value={rarityFilter}
            onChange={(e) => setRarityFilter(e.target.value as Rarity | 'all')}
          >
            <option value="all">Raridade: Todas</option>
            <option value="common">Comum</option>
            <option value="uncommon">Incomum</option>
            <option value="rare">Rara</option>
            <option value="legendary">Lendária</option>
          </select>

          <select
            className={`db-modern-select ${abilityFilter !== 'all' ? 'is-highlighted' : ''}`}
            value={abilityFilter}
            title="Filtrar cartas por Palavra-Chave, Mecânica, Efeito ou Gatilho"
            onChange={(e) => {
              const val = e.target.value;
              setAbilityFilter(val);
              if (val === 'all' || val === secondaryAbilityFilter) {
                setSecondaryAbilityFilter('all');
              }
            }}
          >
            <option value="all">Habilidade: Todas</option>
            {(['keywords', 'mechanics', 'effects', 'triggers'] as const).map((grp) => (
              <optgroup key={grp} label={ABILITY_GROUP_LABELS[grp]}>
                {ABILITY_FILTER_OPTIONS.filter((opt) => opt.group === grp).map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          {abilityFilter !== 'all' && (
            <select
              className={`db-modern-select ${secondaryAbilityFilter !== 'all' ? 'is-highlighted' : ''}`}
              value={secondaryAbilityFilter}
              title="Combinar com uma segunda habilidade (filtro E)"
              onChange={(e) => setSecondaryAbilityFilter(e.target.value)}
            >
              <option value="all">+ 2ª Habilidade (Opcional)</option>
              {(['keywords', 'mechanics', 'effects', 'triggers'] as const).map((grp) => (
                <optgroup key={grp} label={ABILITY_GROUP_LABELS[grp]}>
                  {ABILITY_FILTER_OPTIONS.filter(
                    (opt) => opt.group === grp && opt.id !== abilityFilter
                  ).map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          )}

          <select
            className={`db-modern-select ${sortMode !== 'domain_cost' ? 'is-highlighted' : ''}`}
            value={sortMode}
            title="Ordenar catálogo e lista do grimório"
            onChange={(e) => setSortMode(e.target.value as DeckSortMode)}
          >
            <option value="domain_cost">Ordem: Cor ➔ Custo</option>
            <option value="cost_domain">Ordem: Custo ➔ Cor</option>
            <option value="cost_desc">Ordem: Maior Custo</option>
            <option value="rarity_desc">Ordem: Raridade</option>
            <option value="atk_desc">Ordem: Maior Ataque</option>
            <option value="hp_desc">Ordem: Maior Vida</option>
            <option value="name_asc">Ordem: Nome (A–Z)</option>
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
              onChange={(e) => {
                setOnlyUnlocked(e.target.checked);
                if (e.target.checked) setOnlyMissingCopies(false);
              }}
            />
            <span>Coleção</span>
          </label>

          {!isGuest && (
            <label className="db-collection-toggle" title="Exibir cartas que ainda faltam cópias para forjar com Estilhaços Astrais">
              <input
                type="checkbox"
                checked={onlyMissingCopies}
                onChange={(e) => {
                  setOnlyMissingCopies(e.target.checked);
                  if (e.target.checked) setOnlyUnlocked(false);
                }}
              />
              <span>Forjáveis</span>
            </label>
          )}
          </div>

          {/* Sleek Analytics Drawer Toggle + Count */}
          <div className="db-toolbar-right">
            {!isGuest && (
              <span
                className="astral-shards-pill"
                title="Estilhaços Astrais disponíveis para forjar cartas específicas"
              >
                <strong>{astralShards.toLocaleString('pt-BR')}</strong> Estilhaços
              </span>
            )}
            {!isGuest && salvageableInfo && salvageableInfo.totalShardsEarned > 0 && onSalvageDuplicates && (
              <button
                type="button"
                className="db-analytics-toggle-btn is-open"
                onClick={() => {
                  playSfx('ascend');
                  onSalvageDuplicates();
                }}
                title={`Transmutar ${salvageableInfo.cardsSalvagedCount} cópias excedentes em +${salvageableInfo.totalShardsEarned} Estilhaços Astrais`}
              >
                <span>+{salvageableInfo.totalShardsEarned} Estilhaços</span>
              </button>
            )}
            <span className="db-results-count">{filteredCards.length}</span>
            {hasActiveFilters && (
              <button
                type="button"
                className="db-analytics-toggle-btn"
                onClick={handleResetFilters}
                title="Limpar filtros"
              >
                <span>Limpar</span>
              </button>
            )}
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
              <span>Análise</span>
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
                  Ver {deckAnalysis.recommendedCardIds.size} Cartas Sugeridas
                </button>
                <button
                  type="button"
                  className="db-synergy-chip"
                  onClick={() => {
                    setGuideModalSection('combos_compendium');
                    setShowTacticalGuideModal(true);
                  }}
                >
                  Compêndio de Combos (1–5 Cores)
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
                Nenhuma carta encontrada para os filtros selecionados
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', maxWidth: '420px' }}>
                Ajuste a busca, desative o filtro "Coleção" para ver todas as {ALL_CARDS.length} cartas ou limpe os filtros atuais.
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
              const craftCost = CRAFT_COST_BY_RARITY[card.rarity];
              const canAffordCraft = !hasFreeCatalogSelection && ownedCopies < maxAllowed && astralShards >= craftCost;

              return (
                <GalleryCardCell
                  key={card.id}
                  card={card}
                  countInDeck={countInDeck}
                  maxAllowed={maxAllowed}
                  ownedCopies={ownedCopies}
                  isGuest={hasFreeCatalogSelection}
                  canAdd={canAdd}
                  craftCost={craftCost}
                  canAffordCraft={canAffordCraft}
                  onCraft={onCraftCard}
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
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
            }}
          >
            <input
              type="text"
              className="db-deck-title-input"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              placeholder="Nome do Grimório..."
              style={{ width: '100%' }}
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem',
                fontSize: '0.73rem',
                color: '#94a3b8',
              }}
            >
              <span title={`${deckAnalysis.uniqueCount} cartas distintas (Comum/Incomum até 3×, Rara até 2×, Lendária 1×)`}>
                <strong style={{ color: deckCardIds.length === 100 ? '#fde68a' : '#e2e8f0' }}>
                  {deckCardIds.length}/100
                </strong>{' '}
                cartas
              </span>
              <span title="Máximo de 10 cartas Lendárias (1× cada) por Grimório de 100 cartas">
                Lendas{' '}
                <strong style={{ color: '#cbd5e1' }}>
                  {deckAnalysis.legendaryCount}/{MAX_LEGENDARIES_PER_DECK}
                </strong>
              </span>
            </div>
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
          </div>

          {(isGuest || isFirstDeckSetup || isReplacingGrimoire) && (
            <select
              className="db-prebuilt-select"
              value=""
              onChange={(e) => {
                if (e.target.value) handleLoadPrebuilt(e.target.value);
              }}
            >
              <option value="" disabled>
                Carregar modelo de grimório...
              </option>
              <optgroup label="Grimórios Monocolores (16)">
                {getTrainedMonocolorPrebuiltDecks(5).map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Grimórios Bicolores (15)">
                {getTrainedBicolorPrebuiltDecks(5).map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Grimórios Tricolores e Pentacromáticos (13)">
                {getTrainedPolycolorPrebuiltDecks(5).map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Grimórios Clássicos">
                {PREBUILT_DECKS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </optgroup>
            </select>
          )}

          {customDecks.length > 0 && (
            <div className="db-saved-decks-row">
              {customDecks.map((cd) => {
                const w = cd.wins ?? 0;
                const l = cd.losses ?? 0;
                const totalGames = w + l;
                const wrPct = totalGames > 0 ? Math.round((w / totalGames) * 100) : null;
                return (
                  <div key={cd.id} className="db-saved-deck-chip">
                    <button
                      type="button"
                      className="db-saved-load-btn"
                      onClick={() => handleLoadCustom(cd)}
                      title={
                        totalGames > 0
                          ? `${cd.name} — Histórico: ${w} Vitórias / ${l} Derrotas (${wrPct}%)`
                          : cd.name
                      }
                    >
                      <span>{cd.name}</span>
                      {totalGames > 0 && (
                        <small className="db-deck-wr-badge">
                          {wrPct}%
                        </small>
                      )}
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
                );
              })}
            </div>
          )}

          <div
            className="db-sidebar-actions"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              position: 'relative',
            }}
          >
            <button
              type="button"
              className="db-action-btn primary"
              style={{ flex: 1 }}
              onClick={handleSaveCurrentDeck}
              title={
                deckCardIds.length === 100
                  ? 'Salvar este Grimório de 100 cartas para todos os modos de combate'
                  : 'Complete 100 cartas para salvar seu Grimório de Combate'
              }
            >
              {isReplacingGrimoire
                ? `Confirmar (-${GRIMOIRE_REPLACEMENT_GOLD_COST} Ouro)`
                : deckCardIds.length === 100
                ? 'Salvar grimório'
                : `Salvar (${deckCardIds.length}/100)`}
            </button>

            {deckCardIds.length < 100 && (
              <button
                type="button"
                className="db-action-btn"
                onClick={handleAutoCompleteDeck}
                title="Preencher automaticamente as cartas restantes até 100 respeitando domínio e raridade"
              >
                Completar 100
              </button>
            )}

            <details className="cp-floating-details" style={{ position: 'relative' }}>
              <summary
                className="db-action-btn"
                style={{
                  listStyle: 'none',
                  cursor: 'pointer',
                  userSelect: 'none',
                  padding: '0.42rem 0.68rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.28rem',
                }}
              >
                Opções ▾
              </summary>
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  right: 0,
                  zIndex: 90,
                  minWidth: '205px',
                  padding: '0.4rem',
                  borderRadius: '8px',
                  background: '#0b0f19',
                  border: '1px solid rgba(148, 163, 184, 0.22)',
                  boxShadow: '0 14px 32px rgba(0, 0, 0, 0.85)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                }}
              >
                <button
                  type="button"
                  className="db-action-btn"
                  style={{ width: '100%', justifyContent: 'flex-start', textAlign: 'left' }}
                  onClick={handleAutoCompleteDeck}
                  disabled={deckCardIds.length >= 100}
                >
                  Completar até 100 cartas
                </button>
                {isReplacingGrimoire ? (
                  <>
                    <button
                      type="button"
                      className="db-action-btn subtle-danger"
                      style={{ width: '100%', justifyContent: 'flex-start', textAlign: 'left' }}
                      onClick={() => setDeckCardIds([])}
                    >
                      Limpar cartas
                    </button>
                    <button
                      type="button"
                      className="db-action-btn subtle-danger"
                      style={{ width: '100%', justifyContent: 'flex-start', textAlign: 'left' }}
                      onClick={handleCancelReplaceGrimoire}
                    >
                      Cancelar edição
                    </button>
                  </>
                ) : (isGuest || isFirstDeckSetup) ? (
                  <button
                    type="button"
                    className="db-action-btn subtle-danger"
                    style={{ width: '100%', justifyContent: 'flex-start', textAlign: 'left' }}
                    onClick={() => setDeckCardIds([])}
                  >
                    Limpar cartas
                  </button>
                ) : (
                  <button
                    type="button"
                    className="db-action-btn"
                    style={{ width: '100%', justifyContent: 'flex-start', textAlign: 'left' }}
                    onClick={handleStartReplaceGrimoire}
                    title={`Editar ou substituir Grimório completo por ${GRIMOIRE_REPLACEMENT_GOLD_COST} Ouro`}
                  >
                    Editar grimório ({GRIMOIRE_REPLACEMENT_GOLD_COST} Ouro)
                  </button>
                )}
                <div style={{ height: '1px', background: 'rgba(148, 163, 184, 0.12)', margin: '0.15rem 0' }} />
                <button
                  type="button"
                  className="db-action-btn"
                  style={{ width: '100%', justifyContent: 'flex-start', textAlign: 'left' }}
                  data-shared-deck-url={lastSharedDeckUrl || undefined}
                  onClick={() => void handleShareDeckLink('url')}
                  title="Copiar link direto compartilhável deste Grimório"
                >
                  {deckLinkCopied === 'url' ? 'Link copiado' : 'Compartilhar link'}
                </button>
                <button
                  type="button"
                  className="db-action-btn"
                  style={{ width: '100%', justifyContent: 'flex-start', textAlign: 'left' }}
                  onClick={() => void handleShareDeckLink('discord')}
                  title="Copiar título clicável para colar no Discord ocultando a URL longa"
                >
                  {deckLinkCopied === 'discord' ? 'Copiado p/ Discord' : 'Copiar p/ Discord'}
                </button>
                <button
                  type="button"
                  className="db-action-btn"
                  style={{ width: '100%', justifyContent: 'flex-start', textAlign: 'left' }}
                  onClick={() => setShowImportCodeBox((v) => !v)}
                  title="Importar um Grimório colando um link ou código CPDECK1-..."
                >
                  {showImportCodeBox ? 'Ocultar importação' : 'Importar link ou código'}
                </button>
              </div>
            </details>

            <button
              type="button"
              className="db-action-btn show-on-mobile-inline"
              onClick={() => setIsMobileDeckListOpen((prev) => !prev)}
              title="Expandir ou recolher a lista de cartas do Grimório no smartphone"
            >
              Lista ({deckCardIds.length}) {isMobileDeckListOpen ? '▴' : '▾'}
            </button>
          </div>

          {showImportCodeBox && (
            <div className="db-deckcode-import-box">
              <input
                type="text"
                className="db-modern-search"
                placeholder="Cole o link compartilhado ou código CPDECK1-..."
                value={importCodeInput}
                onChange={(e) => setImportCodeInput(e.target.value)}
              />
              <button
                type="button"
                className="db-action-btn primary"
                onClick={handleApplyImportedDeckCode}
              >
                Aplicar
              </button>
            </div>
          )}

          {saveBanner && <div className="db-save-toast">{saveBanner}</div>}
        </div>

        {/* Minimalist Composition Bar & Mana Curve (Only when Análise is open) */}
        {showSynergyPanel && (
          <div className="db-sidebar-metrics">
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
              <span className="db-avg-cost">{deckAnalysis.avgCost}⚡</span>
            </div>

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
        )}

        {/* Sleek Arena-Style Card Tiles List */}
        <div className={`db-deck-list ${isMobileDeckListOpen ? 'is-mobile-open' : ''}`}>
          {groupedDeckList.length === 0 ? (
            <div className="db-empty-state">
              0/100 cartas
            </div>
          ) : (
            groupedDeckList.map(({ card, count }) => {
              const maxAllowed = MAX_COPIES_BY_RARITY[card.rarity];
              const ownedCopies = hasFreeCatalogSelection
                ? maxAllowed
                : unlockedCardIds[card.id] ?? 0;
              const effectiveMax = Math.min(maxAllowed, ownedCopies);
              const legCapReached =
                card.rarity === 'legendary' &&
                deckAnalysis.legendaryCount >= MAX_LEGENDARIES_PER_DECK;
              const canAddMore =
                count < effectiveMax && !legCapReached && deckCardIds.length < 100;

              return (
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
                    <button
                      type="button"
                      className="db-tile-btn"
                      onClick={() => handleRemoveCardFromDeck(card.id)}
                      title="Remover 1 cópia"
                    >
                      −
                    </button>
                    <span className="db-tile-count">×{count}</span>
                    <button
                      type="button"
                      className="db-tile-btn"
                      onClick={() => handleAddCardToDeck(card)}
                      disabled={!canAddMore}
                      title="Adicionar +1 cópia"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })
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
                  Compêndio Ilustrado — {ALL_CARDS.length} Cartas
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
                    ? 'Todos copiados'
                    : `Copiar lista (${promptCardsList.length})`}
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
                        {card.originalInspiration ?? 'Códice Autoral de Vaeloria'}
                      </span>
                    </span>
                    <button
                      type="button"
                      className="btn-fantasy"
                      style={{ padding: '0.2rem 0.6rem', fontSize: '0.7rem' }}
                      onClick={() => {
                        navigator.clipboard.writeText(lazyArtPrompts?.[card.id] ?? card.aiArtPrompt ?? '');
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
                    {lazyArtPrompts?.[card.id] ?? card.aiArtPrompt ?? 'Carregando...'}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TACTICAL GUIDE & MATCHUPS MODAL */}
      {showTacticalGuideModal && (
        <Suspense fallback={null}>
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
            onImportToDeckBuilder={(templateDeckId) => {
              setShowTacticalGuideModal(false);
              handleLoadPrebuilt(templateDeckId);
            }}
            onClose={() => {
              setShowTacticalGuideModal(false);
              setGuideModalSection('deck_mastery');
            }}
          />
        </Suspense>
      )}

      {/* CARD INSPECT MODAL */}
      {inspectCard && (
        <CardInspectModal
          card={inspectCard}
          onClose={() => setInspectCard(null)}
          craftInfo={
            !isGuest && onCraftCard
              ? (() => {
                  const owned = unlockedCardIds[inspectCard.id] ?? 0;
                  const check = canCraftCard(inspectCard, owned, astralShards);
                  return {
                    ownedCopies: owned,
                    maxAllowed: check.maxAllowed,
                    cost: check.cost,
                    astralShards,
                    canCraft: check.canCraft,
                    onCraft: (c) => {
                      playSfx('ascend');
                      onCraftCard(c);
                    },
                  };
                })()
              : null
          }
        />
      )}
    </div>
  );
};
