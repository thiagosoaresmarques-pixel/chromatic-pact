import React, { useState, useMemo } from 'react';
import { AiSkillTier, CardDefinition, CardType, Domain, PrebuiltDeck } from '../types/game';
import { ALL_CARDS, CARDS_BY_ID } from '../data/cards';
import { PREBUILT_DECKS, CAMPAIGN_BOSSES } from '../data/decks';
import { DECK_TACTICAL_PROFILES, EMPIRICAL_WIN_RATES, getMatchupGuide } from '../data/tacticalGuide';
import { TACTICAL_COMBOS_COMPENDIUM, ComboColorTier } from '../data/combosCompendium';
import {
  AI_LEARNED_PROFILES,
  DeckLearnedAiProfile,
} from '../data/aiLearnedProfiles';
import {
  AI_SKILL_TIER_SPECS,
  BICOLOR_ARCHETYPE_MASTERY,
  getTrainedBicolorPrebuiltDecks,
  getTrainedMonocolorPrebuiltDecks,
  getTrainedPolycolorPrebuiltDecks,
  MONOCOLOR_ARCHETYPE_MASTERY,
  MonocolorArchetypeId,
  POLYCOLOR_ARCHETYPE_MASTERY,
  resolveBicolorArchetypeForDeckId,
  resolvePolycolorArchetypeForDeckId,
} from '../data/aiMonocolorMastery';
import {
  getEmpiricalUnifiedWinRatePct,
  getUnifiedStandingForDeckId,
  UNIFIED_CHAMPION_STANDINGS,
  UNIFIED_FORMAT_LABELS,
  UnifiedFormatKind,
} from '../data/aiUnifiedTournament';
import { CardInspectModal, DOMAIN_META, CARD_TYPE_LABELS } from './CardView';
import { CustomSavedDeck } from './BattleArena';

export interface TacticalGuideViewProps {
  customDecks?: CustomSavedDeck[];
  initialPlayerDeckId?: string;
  initialOpponentDeckId?: string;
  initialViewSection?:
    | 'deck_mastery'
    | 'matchup_duel'
    | 'matrix_all'
    | 'global_tier_list'
    | 'combos_compendium';
  isModal?: boolean;
  onClose?: () => void;
  onLaunchDuel?: (playerDeckId: string, opponentDeckId: string, aiSkillTier?: AiSkillTier) => void;
  onImportToDeckBuilder?: (templateDeckId: string) => void;
}

export interface DeckTacticalProfile {
  deck: PrebuiltDeck;
  cards: CardDefinition[];
  counts: Record<CardType, number>;
  pcts: Record<CardType, number>;
  curve: Record<number, number>;
  maxCurve: number;
  avgCost: string;
  vanguardCount: number;
  rearguardCount: number;
  breathAndAoECards: CardDefinition[];
  singleTargetKillCards: CardDefinition[];
  reactionCards: CardDefinition[];
  relicCards: CardDefinition[];
  ascensionCards: CardDefinition[];
  guardianCards: CardDefinition[];
  rangedAndFlyingCards: CardDefinition[];
  keyThreats: CardDefinition[];
  channelFodderCards: CardDefinition[];
  earlyKeepCards: CardDefinition[];
  asymmetryBadge: string;
  archetypeRole: string;
  openingPlan: string;
  midgamePlan: string;
  endgamePlan: string;
  channelingDoctrine: string;
  stackingDoctrineTitle: string;
  stackingDoctrineBody: string;
  signatureCombos: {
    title: string;
    cards: CardDefinition[];
    explanation: string;
  }[];
}

export interface MatchupGuideAnalysis {
  favorabilityScore: number; // 35 to 65
  favorabilityLabel: string;
  favorabilityColor: string;
  asymmetryHeadline: string;
  generalTactics: string;
  stackingRuleBadge: string;
  stackingRuleMode: 'spread_1x' | 'stack_3x' | 'selective_2x';
  stackingRuleDetail: string;
  mulliganAndChannelGuide: string;
  priorityTargets: { card: CardDefinition; reason: string }[];
  criticalThreatTurn: string;
  enemyTrapsToExpect: CardDefinition[];
  enemyAoEToExpect: CardDefinition[];
  winConditionPath: string;
}

const DOMAIN_EXPANSION_NAMES: Record<Domain, string> = {
  red: 'Caldeira do Sol Carmesim (6/6 Afinidade, custo 3)',
  blue: 'Vazio Infinito de Cronos (6/6 Afinidade, custo 3)',
  purple: 'Santuário Malevolente das Almas (6/6 Afinidade, custo 3)',
  green: 'Mar de Árvores Primordial (6/6 Afinidade, custo 3)',
  gold: 'Tribunal da Sentença Dourada (6/6 Afinidade, custo 3)',
  neutral: 'Matriz Horológica do Ponto Zero (6/6 Afinidade, custo 3)',
};

export function buildDeckTacticalProfile(deck: PrebuiltDeck): DeckTacticalProfile {
  const cards: CardDefinition[] = [];
  for (const id of deck.cardIds) {
    const c = CARDS_BY_ID[id];
    if (c) cards.push(c);
  }
  if (cards.length === 0 && ALL_CARDS.length > 0) {
    cards.push(...ALL_CARDS.slice(0, 100));
  }

  const counts: Record<CardType, number> = {
    creature: 0,
    spell: 0,
    reaction: 0,
    relic: 0,
  };
  const curve: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };
  let totalCost = 0;
  let vanguardCount = 0;
  let rearguardCount = 0;

  const uniqueMap = new Map<string, CardDefinition>();
  for (const c of cards) {
    counts[c.type] += 1;
    totalCost += c.cost;
    const b = Math.min(7, Math.max(1, c.cost));
    curve[b] = (curve[b] ?? 0) + 1;
    if (c.type === 'creature') {
      if (c.preferredRow === 'vanguard') vanguardCount += 1;
      else rearguardCount += 1;
    } else if (c.type === 'relic' || c.type === 'reaction') {
      rearguardCount += 1;
    }
    if (!uniqueMap.has(c.id)) {
      uniqueMap.set(c.id, c);
    }
  }

  const uniqueCards = Array.from(uniqueMap.values());
  const total = Math.max(1, cards.length);
  const pcts: Record<CardType, number> = {
    creature: Math.round((counts.creature / total) * 100),
    spell: Math.round((counts.spell / total) * 100),
    reaction: Math.round((counts.reaction / total) * 100),
    relic: Math.max(
      0,
      100 -
        Math.round((counts.creature / total) * 100) -
        Math.round((counts.spell / total) * 100) -
        Math.round((counts.reaction / total) * 100)
    ),
  };

  const maxCurve = Math.max(1, ...Object.values(curve));
  const avgCost = (totalCost / total).toFixed(2);

  const breathAndAoECards = uniqueCards.filter(
    (c) =>
      (c.breathDamage ?? 0) > 0 ||
      c.keywords.includes('Atropelar') ||
      c.effects.some(
        (e) =>
          e.type === 'damage_enemy_row' ||
          e.type === 'damage_all_units' ||
          e.type === 'freeze_enemy_vanguard' ||
          e.type === 'debuff_enemy_vanguard_atk'
      )
  );

  const singleTargetKillCards = uniqueCards.filter(
    (c) =>
      c.keywords.includes('Toque Letal') ||
      c.keywords.includes('Ímpeto') ||
      c.effects.some(
        (e) =>
          e.type === 'destroy_enemy' ||
          e.type === 'damage_single_enemy' ||
          e.type === 'steal_small_enemy' ||
          e.type === 'bounce_enemy'
      )
  );

  const reactionCards = uniqueCards.filter((c) => c.type === 'reaction');
  const relicCards = uniqueCards.filter((c) => c.type === 'relic');
  const ascensionCards = uniqueCards.filter((c) => Boolean(c.ascension));
  const guardianCards = uniqueCards.filter(
    (c) => c.keywords.includes('Guardião') || c.armor >= 2 || c.keywords.includes('Escudo Divino')
  );
  const rangedAndFlyingCards = uniqueCards.filter(
    (c) => c.keywords.includes('Alcance') || c.keywords.includes('Voo')
  );

  // Key threats sorted by rarity and impact
  const keyThreats = [...uniqueCards]
    .sort((a, b) => {
      const rScore = (r: string) =>
        r === 'legendary' ? 40 : r === 'rare' ? 25 : r === 'uncommon' ? 12 : 5;
      const aScore =
        rScore(a.rarity) +
        a.cost * 2 +
        (a.ascension ? 8 : 0) +
        ((a.breathDamage ?? 0) > 0 ? 6 : 0) +
        (a.type === 'relic' ? 5 : 0);
      const bScore =
        rScore(b.rarity) +
        b.cost * 2 +
        (b.ascension ? 8 : 0) +
        ((b.breathDamage ?? 0) > 0 ? 6 : 0) +
        (b.type === 'relic' ? 5 : 0);
      return bScore - aScore;
    })
    .slice(0, 5);

  // Ideal cards to channel in Turns 1-3 (high cost non-legendary or situational spells)
  const channelFodderCards = [...uniqueCards]
    .filter((c) => c.rarity !== 'legendary' && (c.cost >= 5 || c.type === 'spell'))
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 4);

  // Ideal opening keeps (cost 1-3 creatures/relics)
  const earlyKeepCards = [...uniqueCards]
    .filter((c) => c.cost <= 3 && (c.type === 'creature' || c.type === 'relic'))
    .sort((a, b) => a.cost - b.cost)
    .slice(0, 4);

  // Determine Asymmetry Badge & Archetype Role
  const curatedProfile = DECK_TACTICAL_PROFILES[deck.id];
  let asymmetryBadge = `${counts.creature} Criaturas • ${counts.spell} Feitiços • ${counts.reaction} Reações • ${counts.relic} Relíquias`;
  let archetypeRole = curatedProfile?.archetypeTag ?? 'Falange Tática Assimétrica';

  if (!curatedProfile) {
    if (counts.creature >= 43) {
      archetypeRole = `Avalanche de Criaturas (${counts.creature}/100 Tropas)`;
    } else if (counts.spell + counts.reaction >= 25) {
      archetypeRole = `Grimório Arcano & Controle (${counts.spell} Feitiços + ${counts.reaction} Reações)`;
    } else if (counts.relic >= 12) {
      archetypeRole = `Cidadela de Relíquias (${counts.relic} Relíquias Contínuas)`;
    } else if (counts.reaction >= 8) {
      archetypeRole = `Rede de Emboscadas & Reações (${counts.reaction} Armadilhas)`;
    } else if (deck.domains.length >= 3) {
      archetypeRole = `Convergência Multi-Domínio (${deck.domains.length} Cores)`;
    } else {
      archetypeRole = `Assimetria Tática (${counts.creature} Criat. / ${counts.spell + counts.reaction} Magias / ${counts.relic} Relíq.)`;
    }
  }

  const effectiveDomainsForExpansion: Domain[] =
    deck.domains.some((d) => d !== 'neutral')
      ? deck.domains.filter((d) => d !== 'neutral')
      : ['neutral'];
  const domainExpansionText = effectiveDomainsForExpansion
    .map((d) => DOMAIN_EXPANSION_NAMES[d])
    .join(' | ');

  const openingNames = earlyKeepCards.map((c) => c.name).join(', ') || 'unidades de custo 1 a 3';
  const midNames =
    relicCards
      .concat(rangedAndFlyingCards)
      .slice(0, 3)
      .map((c) => c.name)
      .join(', ') || 'campeões de custo 4 e 5';
  const finisherNames =
    keyThreats
      .slice(0, 3)
      .map((c) => c.name)
      .join(', ') || 'titãs lendários';

  const openingPlan = curatedProfile
    ? curatedProfile.phasePlan.earlyGame
    : `Mantenha no Mulligan cartas de custo 1–3 (${openingNames}) e canalize 1 carta pesada por turno ([C]) para subir Afinidade.`;

  const midgamePlan = curatedProfile
    ? curatedProfile.phasePlan.midGame
    : `Posicione motores na Retaguarda (${midNames}) e acumule Afinidade para habilitar sua Expansão de Domínio (6/6).`;

  const endgamePlan = curatedProfile
    ? curatedProfile.phasePlan.lateGame
    : `Ative sua Expansão de Domínio (${domainExpansionText || '6/6 Afinidade, custo 3'}) e finalize com ${finisherNames}.`;

  const fodderList =
    channelFodderCards.map((c) => `${c.name} (custo ${c.cost})`).join(', ') ||
    'cópias duplicadas de custo 5+';
  const channelingDoctrine = curatedProfile
    ? curatedProfile.channelingStrategy
    : `Priorize canalizar ([C]): ${fodderList}. Preserve suas Lendárias (${keyThreats[0]?.name ?? 'Campeão'}) e custos baixos.`;

  const prefersStacking = guardianCards.length >= 4 || relicCards.length >= 5 || counts.creature >= 26;
  const stackingDoctrineTitle = prefersStacking
    ? 'Falange Empilhada (2×–3× em Colunas Protegidas)'
    : 'Linha Espalhada (1×–2× com Suporte de Retaguarda)';

  const stackingDoctrineBody = curatedProfile
    ? curatedProfile.positioningAndStackingGuide
    : prefersStacking
    ? `Posicione Guardiões na Vanguarda e concentre atacantes/Relíquias na mesma coluna para ganhar Cobertura (+1 ATQ).`
    : `Espalhe unidades na Vanguarda para evitar dano em área e proteja Relíquias/Alcance na Retaguarda.`;

  // Build 3 concrete Signature Combos from actual cards in the deck
  const signatureCombos: {
    title: string;
    cards: CardDefinition[];
    explanation: string;
  }[] = [];

  const combo1Cards = [
    guardianCards[0] ?? earlyKeepCards[0] ?? uniqueCards[0],
    rangedAndFlyingCards[0] ?? relicCards[0] ?? uniqueCards[1],
  ].filter((c): c is CardDefinition => Boolean(c));

  if (combo1Cards.length >= 2) {
    signatureCombos.push({
      title: '1. Trava de Coluna & Artilharia Protegida',
      cards: combo1Cards,
      explanation: `Posicione ${combo1Cards[0].name} na Vanguarda para trancar a coluna e coloque ${combo1Cards[1].name} logo atrás na Retaguarda (ou empilhado no mesmo slot). Além de proteger ${combo1Cards[1].name} contra ataques terrestres, a Cobertura de Coluna concede +1 ATQ gratuito!`,
    });
  }

  const spellOrRelic =
    uniqueCards.find((c) => c.type === 'spell' || c.type === 'relic') ?? uniqueCards[2];
  const finisher1 = keyThreats[0] ?? uniqueCards[0];
  if (spellOrRelic && finisher1 && spellOrRelic.id !== finisher1.id) {
    signatureCombos.push({
      title: '2. Abertura de Brecha & Execução Soberana',
      cards: [spellOrRelic, finisher1],
      explanation: `Use ${spellOrRelic.name} para quebrar a defesa ou paralisar o bloqueador principal da coluna inimiga antes de descer ${finisher1.name}. Com a coluna limpa, ${finisher1.name} invade o território rival recebendo bônus de Invasão e caminho livre ao Soberano!`,
    });
  }

  const thirdComboCards =
    ascensionCards.length > 0
      ? [
          ascensionCards[0],
          reactionCards[0] ?? relicCards[0] ?? keyThreats[1] ?? uniqueCards[3],
        ].filter((c): c is CardDefinition => Boolean(c))
      : [keyThreats[1] ?? uniqueCards[2], keyThreats[2] ?? uniqueCards[3]].filter(
          (c): c is CardDefinition => Boolean(c)
        );

  if (thirdComboCards.length >= 2) {
    signatureCombos.push({
      title:
        ascensionCards.length > 0
          ? `3. Escalada de Ascensão (${thirdComboCards[0].name})`
          : '3. Sinergia de Fim de Jogo & Empilhamento 3x',
      cards: thirdComboCards,
      explanation:
        ascensionCards.length > 0 && thirdComboCards[0].ascension
          ? `Mantenha ${thirdComboCards[0].name} protegido com ${thirdComboCards[1].name} até acumular ${thirdComboCards[0].ascension.cost} de Essência para Ascender em ★ ${thirdComboCards[0].ascension.newName} (${thirdComboCards[0].ascension.newAtk}/${thirdComboCards[0].ascension.newMaxHp}), dominando a partida.`
          : `Empilhe ${thirdComboCards[0].name} e ${thirdComboCards[1].name} no mesmo slot ofensivo quando o inimigo estiver sem magias de área: dois golpes consecutivos na mesma coluna eliminam o defensor e acertam o Soberano no mesmo turno.`,
    });
  }

  // Enrich with top matching combos from TACTICAL_COMBOS_COMPENDIUM
  const deckCardIdSet = new Set(deck.cardIds);
  const matchingCompendiumCombos = TACTICAL_COMBOS_COMPENDIUM.map((tc) => {
    const matchedIds = tc.cardIds.filter((cid) => deckCardIdSet.has(cid));
    const domainOverlap = tc.domains.filter((d) => deck.domains.includes(d)).length;
    return {
      combo: tc,
      matchedCount: matchedIds.length,
      domainOverlap,
    };
  })
    .filter((entry) => entry.matchedCount >= 2 || (entry.matchedCount >= 1 && entry.domainOverlap === entry.combo.domains.length))
    .sort((a, b) => b.matchedCount - a.matchedCount || b.domainOverlap - a.domainOverlap)
    .slice(0, 3);

  matchingCompendiumCombos.forEach((entry, idx) => {
    const cCards = entry.combo.cardIds
      .map((cid) => CARDS_BY_ID[cid])
      .filter((c): c is CardDefinition => Boolean(c));
    if (cCards.length >= 2) {
      signatureCombos.push({
        title: `${signatureCombos.length + 1}. Combo do Compêndio: ${entry.combo.title} (${entry.combo.archetypeTag})`,
        cards: cCards,
        explanation: `${entry.combo.mechanism} Resultado: ${entry.combo.payoff}`,
      });
    }
  });

  return {
    deck,
    cards,
    counts,
    pcts,
    curve,
    maxCurve,
    avgCost,
    vanguardCount,
    rearguardCount,
    breathAndAoECards,
    singleTargetKillCards,
    reactionCards,
    relicCards,
    ascensionCards,
    guardianCards,
    rangedAndFlyingCards,
    keyThreats,
    channelFodderCards,
    earlyKeepCards,
    asymmetryBadge,
    archetypeRole,
    openingPlan,
    midgamePlan,
    endgamePlan,
    channelingDoctrine,
    stackingDoctrineTitle,
    stackingDoctrineBody,
    signatureCombos,
  };
}

export function analyzeMatchupPair(
  playerProfile: DeckTacticalProfile,
  enemyProfile: DeckTacticalProfile
): MatchupGuideAnalysis {
  const p = playerProfile;
  const e = enemyProfile;
  const curatedMatchup =
    DECK_TACTICAL_PROFILES[p.deck.id] && DECK_TACTICAL_PROFILES[e.deck.id]
      ? getMatchupGuide(p.deck.id, e.deck.id)
      : null;

  // Calculate tactical favorability score using the Grand Unified 44x43 Tournament Matrix when available
  const unifiedWr = getEmpiricalUnifiedWinRatePct(p.deck.id, e.deck.id);
  let score = unifiedWr ?? EMPIRICAL_WIN_RATES[p.deck.id]?.[e.deck.id] ?? 50;

  const pEarly = (p.curve[1] ?? 0) + (p.curve[2] ?? 0);
  const eEarly = (e.curve[1] ?? 0) + (e.curve[2] ?? 0);

  if (unifiedWr === null) {
    // Fallback structural adjustments only for custom unmeasured player decks
    if (p.breathAndAoECards.length >= 8 && e.counts.creature >= 50) score += 1;
    if (e.breathAndAoECards.length >= 8 && p.counts.creature >= 50) score -= 1;

    if (pEarly >= 20 && e.counts.relic >= 14) score += 1;
    if (eEarly >= 20 && p.counts.relic >= 14) score -= 1;

    if (p.counts.relic >= 14 && eEarly <= 14) score += 1;
    if (e.counts.relic >= 14 && pEarly <= 14) score -= 1;

    score = Math.round(Math.max(45, Math.min(55, score)));
  } else {
    score = Math.round(Math.max(15, Math.min(85, score)));
  }

  let favorabilityLabel = 'Equilibrado · 50%';
  let favorabilityColor = '#cbd5e1';
  if (score >= 58) {
    favorabilityLabel = `Vantagem clara · ${score}%`;
    favorabilityColor = '#4ade80';
  } else if (score >= 53) {
    favorabilityLabel = `Favorável · ${score}%`;
    favorabilityColor = '#86efac';
  } else if (score >= 51) {
    favorabilityLabel = `Leve vantagem · ${score}%`;
    favorabilityColor = '#bbf7d0';
  } else if (score <= 42) {
    favorabilityLabel = `Desfavorável · ${score}%`;
    favorabilityColor = '#f87171';
  } else if (score <= 47) {
    favorabilityLabel = `Desafiador · ${score}%`;
    favorabilityColor = '#fbbf24';
  } else if (score !== 50) {
    favorabilityLabel = `Equilibrado · ${score}%`;
    favorabilityColor = '#cbd5e1';
  }

  const asymmetryHeadline = `${p.counts.creature} Criaturas · ${p.counts.spell} Feitiços · ${p.counts.reaction} Reações · ${p.counts.relic} Relíquias`;

  // Determine Slot Stacking Rule for this specific opponent!
  const enemyAoECount = e.breathAndAoECards.length;
  let stackingRuleMode: 'spread_1x' | 'stack_3x' | 'selective_2x' = 'selective_2x';
  let stackingRuleBadge = 'Formação seletiva (até 2 por slot)';
  let stackingRuleDetail = '';

  if (enemyAoECount >= 6) {
    stackingRuleMode = 'spread_1x';
    stackingRuleBadge = 'Espalhar 1 unidade por coluna';
    const aoeNames = e.breathAndAoECards
      .slice(0, 3)
      .map((c) => c.name)
      .join(', ');
    stackingRuleDetail = `O baralho oponente conta com ${enemyAoECount} cartas de dano em área ou Sopro (${aoeNames}). Espalhe suas tropas em colunas separadas para evitar perder múltiplas unidades no mesmo slot.`;
  } else if (e.singleTargetKillCards.length >= 8 || e.counts.creature >= 50) {
    stackingRuleMode = 'stack_3x';
    stackingRuleBadge = 'Empilhar até 3 unidades no slot';
    const singleNames = e.singleTargetKillCards
      .slice(0, 3)
      .map((c) => c.name)
      .join(', ');
    stackingRuleDetail = `O oponente depende de alvos únicos (${
      singleNames || 'golpes diretos'
    }) e possui pouco dano em área. Concentre 1 Guardião com até 2 atacantes na mesma coluna para ganhar cobertura e revidar em conjunto.`;
  } else {
    stackingRuleMode = 'selective_2x';
    stackingRuleBadge = 'Formação em pares (2× na Retaguarda)';
    stackingRuleDetail = `Contra ${e.deck.name}, mantenha 1 bloqueador por coluna na Vanguarda e agrupe até 2 cartas de suporte ou alcance na Retaguarda das colunas protegidas.`;
  }

  // General Tactics against enemy structure (100-card decks)
  let generalTactics = '';
  if (e.counts.creature >= 65) {
    generalTactics = `${e.deck.name} utiliza ${e.counts.creature} criaturas (${e.pcts.creature}% do grimório). Posicione bloqueadores resistentes cedo e guarde feitiços de área ou Sopro para punir colunas empilhadas.`;
  } else if (e.counts.spell + e.counts.reaction >= 38) {
    generalTactics = `${e.deck.name} concentra ${e.counts.spell} Feitiços e ${e.counts.reaction} Reações, com menos bloqueadores em campo. Pressione múltiplas colunas e teste emboscadas atacando primeiro com unidades leves.`;
  } else if (e.counts.relic >= 18) {
    generalTactics = `${e.deck.name} apoia seu jogo longo em ${e.counts.relic} Relíquias na Retaguarda. Abra rapidamente uma coluna na Vanguarda rival para destruir as Relíquias antes do Turno 8.`;
  } else {
    generalTactics = `${e.deck.name} equilibra ${e.counts.creature} criaturas, ${e.counts.spell} feitiços, ${e.counts.reaction} reações e ${e.counts.relic} relíquias (custo médio ${e.avgCost}). Dispute as colunas centrais, alcance 6/6 de Afinidade para sua Expansão de Domínio e reserve remoções para ameaças de custo 5+.`;
  }
  if (curatedMatchup) {
    generalTactics = `${curatedMatchup.keyObjective} ${generalTactics}`;
  }

  // Mulligan & Channeling priority for this matchup
  const keepNames =
    p.earlyKeepCards
      .slice(0, 3)
      .map((c) => c.name)
      .join(', ') || 'unidades de custo 1–3';
  const removalOrAoE =
    (e.counts.creature >= 25 ? p.breathAndAoECards : p.singleTargetKillCards)
      .slice(0, 2)
      .map((c) => c.name)
      .join(' e ');

  const mulliganAndChannelGuide = `Na mão inicial (7 cartas, 40 PV e 3 de Essência), busque ${keepNames}${
    removalOrAoE ? ` e guarde ${removalOrAoE} como resposta central` : ''
  }. Nos Turnos 1 a 3, canalize ([C]) cartas pesadas (${
    p.channelFodderCards
      .slice(0, 2)
      .map((c) => c.name)
      .join(', ') || 'custo 6+'
  }) para ganhar +1 Afinidade e comprar 1 carta de reposição, avançando rumo à Expansão de Domínio (6/6 Afinidade). ${
    eEarly >= 11
      ? 'Como o oponente pressiona cedo, evite guardar cartas de custo 5+.'
      : 'O oponente tem início cadenciado, permitindo canalizar até o Turno 5 com segurança.'
  }`;

  // Priority enemy targets
  const priorityTargets = e.keyThreats.slice(0, 4).map((card) => {
    let reason = `Ameaça central (custo ${card.cost}) do grimório oponente.`;
    if (card.type === 'relic') {
      reason = `Relíquia na Retaguarda: gera vantagem contínua se não for destruída.`;
    } else if ((card.breathDamage ?? 0) > 0) {
      reason = `Sopro (-${card.breathDamage} na fileira): atinge múltiplas cartas no mesmo slot.`;
    } else if (card.ascension) {
      reason = `Evolui por Ascensão para ${card.ascension.newName} (${card.ascension.newAtk}/${card.ascension.newMaxHp}) se permanecer em campo.`;
    } else if (
      card.keywords.includes('Toque Letal') ||
      card.keywords.includes('Dreno de Vida')
    ) {
      reason = `Especialista de combate (${card.keywords.join(', ')}): priorize remover com feitiço ou Alcance.`;
    }
    return { card, reason };
  });

  const trapNames =
    e.reactionCards.map((c) => `${c.name} (custo ${c.cost})`).join(', ') ||
    'Nenhuma reação pesada registrada';
  const aoeNames =
    e.breathAndAoECards.map((c) => `${c.name} (custo ${c.cost})`).join(', ') ||
    'Sem varreduras globais pesadas';

  const criticalThreatTurn = `Turnos 4 a 6 (6–8 de Essência e proximidade da Expansão de Domínio 6/6). Observe possíveis Reações na Retaguarda (${trapNames}) e cartas de área (${aoeNames}).`;

  const winConditionPath = `Utilize ${
    p.keyThreats
      .slice(0, 2)
      .map((c) => c.name)
      .join(' e ') || 'seus campeões principais'
  } junto à Expansão de Domínio (6/6 Afinidade, custo 3) para fortalecer sua linha por 3 rodadas. ${
    stackingRuleMode === 'stack_3x'
      ? 'Concentre uma coluna protegida para abrir brecha e pressionar o Soberano rival.'
      : 'Mantenha pressão em colunas distintas para preservar atacantes após remoções em área.'
  }`;

  return {
    favorabilityScore: score,
    favorabilityLabel,
    favorabilityColor,
    asymmetryHeadline,
    generalTactics,
    stackingRuleBadge,
    stackingRuleMode,
    stackingRuleDetail,
    mulliganAndChannelGuide,
    priorityTargets,
    criticalThreatTurn,
    enemyTrapsToExpect: e.reactionCards,
    enemyAoEToExpect: e.breathAndAoECards,
    winConditionPath,
  };
}

export const TacticalGuideView: React.FC<TacticalGuideViewProps> = ({
  customDecks = [],
  initialPlayerDeckId,
  initialOpponentDeckId,
  initialViewSection,
  isModal = false,
  onClose,
  onLaunchDuel,
  onImportToDeckBuilder,
}) => {
  const trainedMonoDecks = useMemo(() => getTrainedMonocolorPrebuiltDecks(5), []);
  const trainedBiDecks = useMemo(() => getTrainedBicolorPrebuiltDecks(5), []);
  const trainedPolyDecks = useMemo(() => getTrainedPolycolorPrebuiltDecks(5), []);

  const allDecks: PrebuiltDeck[] = useMemo(() => {
    const customConverted: PrebuiltDeck[] = customDecks.map((cd) => {
      const domainsSet = new Set<Domain>();
      for (const cid of cd.cardIds) {
        const c = CARDS_BY_ID[cid];
        if (c && c.domain !== 'neutral') domainsSet.add(c.domain);
      }
      return {
        id: cd.id,
        name: cd.name,
        subtitle: 'Grimório Personalizado do Jogador',
        domains: domainsSet.size > 0 ? Array.from(domainsSet) : ['neutral'],
        strategy: 'Grimório forjado sob medida no Construtor de Decks.',
        coverCardId: cd.cardIds[0] ?? 'neutral_10_valkyra_pentacromatica',
        cardIds: cd.cardIds,
      };
    });
    return [
      ...trainedMonoDecks,
      ...trainedBiDecks,
      ...trainedPolyDecks,
      ...PREBUILT_DECKS,
      ...customConverted,
    ];
  }, [customDecks, trainedMonoDecks, trainedBiDecks, trainedPolyDecks]);

  const [selectedPlayerDeckId, setSelectedPlayerDeckId] = useState<string>(
    initialPlayerDeckId && allDecks.some((d) => d.id === initialPlayerDeckId)
      ? initialPlayerDeckId
      : allDecks[0]?.id ?? 'deck_red_inferno'
  );

  const [selectedOpponentDeckId, setSelectedOpponentDeckId] = useState<string>(() => {
    if (initialOpponentDeckId && allDecks.some((d) => d.id === initialOpponentDeckId)) {
      return initialOpponentDeckId;
    }
    const second = allDecks.find((d) => d.id !== selectedPlayerDeckId);
    return second?.id ?? allDecks[0]?.id ?? 'deck_blue_tempest';
  });

  const [viewSection, setViewSection] = useState<
    'deck_mastery' | 'matchup_duel' | 'matrix_all' | 'global_tier_list' | 'combos_compendium'
  >(initialViewSection ?? (initialOpponentDeckId ? 'matchup_duel' : 'deck_mastery'));
  const [domainFilter, setDomainFilter] = useState<Domain | 'all'>('all');
  const [unifiedFormatFilter, setUnifiedFormatFilter] = useState<UnifiedFormatKind | 'all'>('all');
  const [unifiedTierFilter, setUnifiedTierFilter] = useState<'all' | 'S' | 'A' | 'B'>('all');
  const [challengeAiTier, setChallengeAiTier] = useState<AiSkillTier>(5);
  const [comboTierFilter, setComboTierFilter] = useState<ComboColorTier | 'all'>('all');
  const [comboSearchQuery, setComboSearchQuery] = useState<string>('');
  const [onlyInDeckCombos, setOnlyInDeckCombos] = useState<boolean>(false);
  const [inspectCard, setInspectCard] = useState<CardDefinition | null>(null);

  const customDeckIdSet = useMemo(() => new Set(customDecks.map((cd) => cd.id)), [customDecks]);
  const resolvePlayerDeckForChallenge = (preferredId: string): string => {
    if (customDecks.length > 0) {
      if (customDeckIdSet.has(preferredId)) return preferredId;
      return customDecks[0].id;
    }
    return preferredId;
  };

  const comboTierCounts = useMemo(() => {
    const counts: Record<ComboColorTier, number> = { mono: 0, dual: 0, tri: 0, poly: 0 };
    for (const c of TACTICAL_COMBOS_COMPENDIUM) {
      counts[c.tier] = (counts[c.tier] ?? 0) + 1;
    }
    return counts;
  }, []);

  const profilesById = useMemo(() => {
    const map: Record<string, DeckTacticalProfile> = {};
    for (const d of allDecks) {
      map[d.id] = buildDeckTacticalProfile(d);
    }
    return map;
  }, [allDecks]);

  const playerProfile =
    profilesById[selectedPlayerDeckId] ??
    profilesById[allDecks[0]?.id] ??
    buildDeckTacticalProfile(PREBUILT_DECKS[0]);

  const opponentProfile =
    profilesById[selectedOpponentDeckId] ??
    profilesById[allDecks[1]?.id] ??
    buildDeckTacticalProfile(PREBUILT_DECKS[1] ?? PREBUILT_DECKS[0]);

  const activeMatchup = useMemo(
    () => analyzeMatchupPair(playerProfile, opponentProfile),
    [playerProfile, opponentProfile]
  );

  const learnedAiProfile = useMemo<DeckLearnedAiProfile | null>(() => {
    const monoDirect =
      MONOCOLOR_ARCHETYPE_MASTERY[playerProfile.deck.id as MonocolorArchetypeId]?.learnedProfile;
    if (monoDirect) return monoDirect;
    const biId = resolveBicolorArchetypeForDeckId(playerProfile.deck.id);
    if (biId && BICOLOR_ARCHETYPE_MASTERY[biId]?.learnedProfile) {
      return BICOLOR_ARCHETYPE_MASTERY[biId].learnedProfile;
    }
    const polyId = resolvePolycolorArchetypeForDeckId(playerProfile.deck.id);
    if (polyId && POLYCOLOR_ARCHETYPE_MASTERY[polyId]?.learnedProfile) {
      return POLYCOLOR_ARCHETYPE_MASTERY[polyId].learnedProfile;
    }
    const direct = AI_LEARNED_PROFILES[playerProfile.deck.id];
    if (direct) return direct;

    // Match custom player decks to their closest trained official grimoire by unique card overlap
    const idSet = new Set(playerProfile.deck.cardIds);
    const referenceDecks = [
      ...getTrainedMonocolorPrebuiltDecks(5),
      ...getTrainedBicolorPrebuiltDecks(5),
      ...getTrainedPolycolorPrebuiltDecks(5),
      ...PREBUILT_DECKS,
    ];
    let bestId: string | null = null;
    let bestOverlap = 0;
    for (const d of referenceDecks) {
      let overlap = 0;
      const seen = new Set<string>();
      for (const cid of d.cardIds) {
        if (!seen.has(cid) && idSet.has(cid)) {
          seen.add(cid);
          overlap += 1;
        }
      }
      if (overlap > bestOverlap) {
        bestOverlap = overlap;
        bestId = d.id;
      }
    }
    if (!bestId) return null;
    const monoMatch = MONOCOLOR_ARCHETYPE_MASTERY[bestId as MonocolorArchetypeId];
    if (monoMatch?.learnedProfile) {
      return monoMatch.learnedProfile;
    }
    const bestBiId = resolveBicolorArchetypeForDeckId(bestId);
    const biMatch = bestBiId ? BICOLOR_ARCHETYPE_MASTERY[bestBiId] : undefined;
    if (biMatch?.learnedProfile) {
      return biMatch.learnedProfile;
    }
    const bestPolyId = resolvePolycolorArchetypeForDeckId(bestId);
    const polyMatch = bestPolyId ? POLYCOLOR_ARCHETYPE_MASTERY[bestPolyId] : undefined;
    if (polyMatch?.learnedProfile) {
      return polyMatch.learnedProfile;
    }
    return AI_LEARNED_PROFILES[bestId] ?? null;
  }, [playerProfile]);

  const allMatchupsList = useMemo(() => {
    return allDecks
      .filter((d) => d.id !== playerProfile.deck.id)
      .filter((d) => domainFilter === 'all' || d.domains.includes(domainFilter))
      .map((d) => {
        const oppProf = profilesById[d.id];
        const analysis = analyzeMatchupPair(playerProfile, oppProf);
        const bossUsingDeck = CAMPAIGN_BOSSES.find((b) => b.deckId === d.id);
        return {
          deck: d,
          profile: oppProf,
          analysis,
          bossUsingDeck,
        };
      });
  }, [allDecks, playerProfile, profilesById, domainFilter]);

  const coverCardPlayer = CARDS_BY_ID[playerProfile.deck.coverCardId] ?? ALL_CARDS[0];
  const coverCardOpponent = CARDS_BY_ID[opponentProfile.deck.coverCardId] ?? ALL_CARDS[1];

  const isTableSection = viewSection === 'matrix_all' || viewSection === 'global_tier_list';
  const playerStanding = getUnifiedStandingForDeckId(playerProfile.deck.id);
  const canImportPlayerDeck =
    Boolean(onImportToDeckBuilder) && !customDeckIdSet.has(playerProfile.deck.id);

  const renderDeckOptions = () => (
    <>
      <optgroup label="Grão-Soberanos Tricolores e Pentacromáticos">
        {trainedPolyDecks.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </optgroup>
      <optgroup label="Soberanos Bicolores">
        {trainedBiDecks.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </optgroup>
      <optgroup label="Soberanos Monocolores">
        {trainedMonoDecks.map((d) => (
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
      {customDecks.length > 0 && (
        <optgroup label="Grimórios Pessoais">
          {customDecks.map((cd) => (
            <option key={cd.id} value={cd.id}>
              {cd.name}
            </option>
          ))}
        </optgroup>
      )}
    </>
  );

  const renderDomainDots = (domains: Domain[]) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      {domains.map((dom) => (
        <i
          key={dom}
          title={DOMAIN_META[dom].name}
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: DOMAIN_META[dom].color,
            display: 'inline-block',
          }}
        />
      ))}
    </span>
  );

  const openingRecommendedCards = useMemo(() => {
    if (learnedAiProfile && learnedAiProfile.mulliganKeepIds.length > 0) {
      const mapped = learnedAiProfile.mulliganKeepIds
        .map((cid) => CARDS_BY_ID[cid])
        .filter((c): c is CardDefinition => Boolean(c));
      if (mapped.length > 0) return mapped.slice(0, 4);
    }
    return playerProfile.earlyKeepCards.slice(0, 4);
  }, [learnedAiProfile, playerProfile.earlyKeepCards]);

  const channelRecommendedCards = useMemo(() => {
    if (learnedAiProfile && learnedAiProfile.channelPriorityIds.length > 0) {
      const mapped = learnedAiProfile.channelPriorityIds
        .map((cid) => CARDS_BY_ID[cid])
        .filter((c): c is CardDefinition => Boolean(c));
      if (mapped.length > 0) return mapped.slice(0, 4);
    }
    return playerProfile.channelFodderCards.slice(0, 4);
  }, [learnedAiProfile, playerProfile.channelFodderCards]);

  const content = (
    <div
      className={isModal ? 'tg-modal-inner' : 'aaa-page-shell'}
      style={{ maxWidth: 1180, margin: '0 auto', gap: 14 }}
    >
      {/* Clean Single-Row Top Navigation */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          padding: '12px 16px',
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(148, 163, 184, 0.12)',
          borderRadius: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`nav-tab-btn ${viewSection === 'deck_mastery' ? 'active' : ''}`}
            onClick={() => setViewSection('deck_mastery')}
            style={{ textTransform: 'none', letterSpacing: '0.01em', fontSize: '0.8rem', padding: '6px 12px' }}
          >
            Guia do Grimório
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${viewSection === 'matchup_duel' ? 'active' : ''}`}
            onClick={() => setViewSection('matchup_duel')}
            style={{ textTransform: 'none', letterSpacing: '0.01em', fontSize: '0.8rem', padding: '6px 12px' }}
          >
            Confronto 1×1
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${isTableSection ? 'active' : ''}`}
            onClick={() => setViewSection('matrix_all')}
            style={{ textTransform: 'none', letterSpacing: '0.01em', fontSize: '0.8rem', padding: '6px 12px' }}
          >
            Tabela de Confrontos
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${viewSection === 'combos_compendium' ? 'active' : ''}`}
            onClick={() => setViewSection('combos_compendium')}
            style={{ textTransform: 'none', letterSpacing: '0.01em', fontSize: '0.8rem', padding: '6px 12px' }}
          >
            Combos ({TACTICAL_COMBOS_COMPENDIUM.length})
          </button>
        </div>

        {/* Single-Deck Context Picker (shown when NOT on Confronto 1×1 or Combos) */}
        {(viewSection === 'deck_mastery' || viewSection === 'matrix_all') && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <select
              aria-label="Selecionar Grimório"
              className="myth-select-compact"
              style={{ minWidth: 220 }}
              value={selectedPlayerDeckId}
              onChange={(e) => setSelectedPlayerDeckId(e.target.value)}
            >
              {renderDeckOptions()}
            </select>
            {canImportPlayerDeck && (
              <button
                type="button"
                className="aaa-btn aaa-btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.76rem' }}
                onClick={() => onImportToDeckBuilder?.(playerProfile.deck.id)}
              >
                Abrir no Grimório
              </button>
            )}
            {onLaunchDuel && viewSection === 'deck_mastery' && (
              <button
                type="button"
                className="btn-fantasy btn-fantasy-primary"
                style={{ padding: '6px 14px', fontSize: '0.76rem' }}
                onClick={() =>
                  onLaunchDuel(
                    resolvePlayerDeckForChallenge(selectedPlayerDeckId),
                    selectedOpponentDeckId,
                    challengeAiTier
                  )
                }
              >
                Praticar na Arena
              </button>
            )}
          </div>
        )}

        {isModal && onClose && (
          <button type="button" className="aaa-btn aaa-btn-secondary" onClick={onClose}>
            Fechar
          </button>
        )}
      </header>

      {/* =====================================================================
          1. GUIA DO GRIMÓRIO (SINGLE DECK FOCUS — ZERO 1v1 CLUTTER, ZERO LAB NOISE)
          ===================================================================== */}
      {viewSection === 'deck_mastery' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Clean Identity Strip */}
          <section
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 14,
              padding: '16px 20px',
              background: '#0b0f19',
              border: '1px solid rgba(148, 163, 184, 0.12)',
              borderRadius: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0, flex: 1 }}>
              {coverCardPlayer?.imagePath && (
                <img
                  src={coverCardPlayer.imagePath}
                  alt={playerProfile.deck.name}
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 8,
                    objectFit: 'cover',
                    border: '1px solid rgba(212, 175, 55, 0.35)',
                    flexShrink: 0,
                  }}
                />
              )}
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <h1
                    className="font-cinzel"
                    style={{ margin: 0, fontSize: '1.18rem', color: '#f8fafc', fontWeight: 700 }}
                  >
                    {playerProfile.deck.name}
                  </h1>
                  {renderDomainDots(playerProfile.deck.domains)}
                  {playerStanding && (
                    <span
                      style={{
                        fontSize: '0.72rem',
                        color: '#e5c97b',
                        padding: '1px 8px',
                        borderRadius: 999,
                        border: '1px solid rgba(212, 175, 55, 0.28)',
                        background: 'rgba(212, 175, 55, 0.06)',
                      }}
                    >
                      Tier {playerStanding.tierBadge} · #{playerStanding.rank}
                    </span>
                  )}
                </div>
                <p
                  style={{
                    margin: '4px 0 0',
                    fontSize: '0.82rem',
                    color: '#94a3b8',
                    lineHeight: 1.45,
                  }}
                >
                  {playerProfile.deck.strategy}
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                flexWrap: 'wrap',
                fontSize: '0.78rem',
                color: '#cbd5e1',
              }}
            >
              <span>
                <strong style={{ color: '#f8fafc' }}>{playerProfile.counts.creature}</strong> Criaturas
              </span>
              <span>
                <strong style={{ color: '#f8fafc' }}>{playerProfile.counts.spell}</strong> Feitiços
              </span>
              <span>
                <strong style={{ color: '#f8fafc' }}>{playerProfile.counts.reaction}</strong> Reações
              </span>
              <span>
                <strong style={{ color: '#f8fafc' }}>{playerProfile.counts.relic}</strong> Relíquias
              </span>
              <span style={{ color: '#e5c97b' }}>Custo médio {playerProfile.avgCost}</span>
            </div>
          </section>

          {/* Calm 2-Column Editorial Layout */}
          <div className="tg-grid-layout" style={{ gap: 16 }}>
            {/* Left Column: Curve + Phase Plan + Progressive Disclosure Details */}
            <div
              style={{
                background: '#0b0f19',
                border: '1px solid rgba(148, 163, 184, 0.12)',
                borderRadius: 10,
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}
                >
                  <h2
                    className="font-cinzel"
                    style={{ margin: 0, fontSize: '0.96rem', color: '#f8fafc' }}
                  >
                    Curva de Essência
                  </h2>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    Vanguarda {playerProfile.vanguardCount} · Retaguarda {playerProfile.rearguardCount}
                  </span>
                </div>
                <div className="db-mini-curve" style={{ height: 64 }}>
                  {[1, 2, 3, 4, 5, 6, 7].map((bucket) => {
                    const cnt = playerProfile.curve[bucket] ?? 0;
                    const hPct = Math.round((cnt / playerProfile.maxCurve) * 100);
                    return (
                      <div key={bucket} className="db-curve-col">
                        <span className="db-curve-val">{cnt > 0 ? cnt : ''}</span>
                        <div className="db-curve-track">
                          <div
                            className="db-curve-fill"
                            style={{ height: `${cnt > 0 ? Math.max(14, hPct) : 0}%` }}
                          />
                        </div>
                        <span className="db-curve-lbl">{bucket === 7 ? '7+' : String(bucket)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  paddingTop: 14,
                  borderTop: '1px solid rgba(148, 163, 184, 0.12)',
                }}
              >
                <h2
                  className="font-cinzel"
                  style={{ margin: 0, fontSize: '0.96rem', color: '#f8fafc' }}
                >
                  Plano por Fase
                </h2>

                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#e5c97b', marginBottom: 3 }}>
                    Abertura · Turnos 1 a 3
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.48 }}>
                    {playerProfile.openingPlan}
                  </p>
                </div>

                <div style={{ paddingTop: 10, borderTop: '1px solid rgba(148, 163, 184, 0.08)' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#e5c97b', marginBottom: 3 }}>
                    Meio de Jogo · Turnos 4 a 6
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.48 }}>
                    {playerProfile.midgamePlan}
                  </p>
                </div>

                <div style={{ paddingTop: 10, borderTop: '1px solid rgba(148, 163, 184, 0.08)' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#e5c97b', marginBottom: 3 }}>
                    Fim de Jogo · Turno 7+
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.48 }}>
                    {playerProfile.endgamePlan}
                  </p>
                </div>
              </div>

              {/* Progressive Disclosure for Channeling & Positioning Doctrine */}
              <details
                style={{
                  paddingTop: 12,
                  borderTop: '1px solid rgba(148, 163, 184, 0.12)',
                  fontSize: '0.78rem',
                  color: '#94a3b8',
                }}
              >
                <summary
                  style={{
                    cursor: 'pointer',
                    color: '#cbd5e1',
                    fontWeight: 600,
                    userSelect: 'none',
                  }}
                >
                  Posicionamento de colunas e canalização [C]
                </summary>
                <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: 2 }}>
                      {playerProfile.stackingDoctrineTitle}
                    </div>
                    <p style={{ margin: 0, color: '#cbd5e1', lineHeight: 1.45 }}>
                      {playerProfile.stackingDoctrineBody}
                    </p>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: 2 }}>
                      Prioridade de Canalização [C]
                    </div>
                    <p style={{ margin: 0, color: '#cbd5e1', lineHeight: 1.45 }}>
                      {playerProfile.channelingDoctrine}
                    </p>
                    {channelRecommendedCards.length > 0 && (
                      <div className="tg-combo-cards-row" style={{ marginTop: 8 }}>
                        {channelRecommendedCards.map((c) => (
                          <div
                            key={c.id}
                            className="tg-mini-card-pill"
                            onClick={() => setInspectCard(c)}
                          >
                            {c.imagePath && <img src={c.imagePath} alt={c.name} />}
                            <div>
                              <div className="tg-mini-card-name">{c.name}</div>
                              <div className="tg-mini-card-sub">
                                Custo {c.cost} · Canalizar [C]
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </details>
            </div>

            {/* Right Column: Recommended Opening Hand + Key Combos */}
            <div
              style={{
                background: '#0b0f19',
                border: '1px solid rgba(148, 163, 184, 0.12)',
                borderRadius: 10,
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              {openingRecommendedCards.length > 0 && (
                <div>
                  <h2
                    className="font-cinzel"
                    style={{ margin: '0 0 8px', fontSize: '0.96rem', color: '#f8fafc' }}
                  >
                    Mão Inicial Recomendada
                  </h2>
                  <div className="tg-combo-cards-row">
                    {openingRecommendedCards.map((c) => (
                      <div
                        key={c.id}
                        className="tg-mini-card-pill"
                        onClick={() => setInspectCard(c)}
                      >
                        {c.imagePath && <img src={c.imagePath} alt={c.name} />}
                        <div>
                          <div className="tg-mini-card-name">{c.name}</div>
                          <div className="tg-mini-card-sub">
                            Custo {c.cost} · {CARD_TYPE_LABELS[c.type]}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div
                style={{
                  paddingTop: openingRecommendedCards.length > 0 ? 14 : 0,
                  borderTop:
                    openingRecommendedCards.length > 0
                      ? '1px solid rgba(148, 163, 184, 0.12)'
                      : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}
              >
                <h2
                  className="font-cinzel"
                  style={{ margin: 0, fontSize: '0.96rem', color: '#f8fafc' }}
                >
                  Sinergias Principais
                </h2>

                {playerProfile.signatureCombos.slice(0, 3).map((combo, idx) => (
                  <div
                    key={idx}
                    style={{
                      paddingTop: idx > 0 ? 12 : 0,
                      borderTop: idx > 0 ? '1px solid rgba(148, 163, 184, 0.08)' : 'none',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: '#e5c97b',
                        marginBottom: 4,
                      }}
                    >
                      {combo.title}
                    </div>
                    <p
                      style={{
                        fontSize: '0.79rem',
                        color: '#cbd5e1',
                        lineHeight: 1.46,
                        margin: '0 0 8px',
                      }}
                    >
                      {combo.explanation}
                    </p>
                    <div className="tg-combo-cards-row">
                      {combo.cards.map((c) => (
                        <div
                          key={c.id}
                          className="tg-mini-card-pill"
                          onClick={() => setInspectCard(c)}
                        >
                          {c.imagePath && <img src={c.imagePath} alt={c.name} />}
                          <div>
                            <div className="tg-mini-card-name">{c.name}</div>
                            <div className="tg-mini-card-sub">
                              Custo {c.cost} · {CARD_TYPE_LABELS[c.type]}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          2. CONFRONTO 1×1 (ONLY HERE WE SHOW THE TWO-DECK COMPARISON BAR)
          ===================================================================== */}
      {viewSection === 'matchup_duel' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <section
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              alignItems: 'center',
              gap: 12,
              padding: '14px 18px',
              background: '#0b0f19',
              border: '1px solid rgba(148, 163, 184, 0.12)',
              borderRadius: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              {coverCardPlayer?.imagePath && (
                <img
                  src={coverCardPlayer.imagePath}
                  alt={playerProfile.deck.name}
                  style={{ width: 42, height: 42, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }}
                />
              )}
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: 3 }}>
                  Seu Grimório
                </div>
                <select
                  className="myth-select-compact"
                  style={{ width: '100%', fontSize: '0.8rem' }}
                  value={selectedPlayerDeckId}
                  onChange={(e) => setSelectedPlayerDeckId(e.target.value)}
                >
                  {renderDeckOptions()}
                </select>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                padding: '0 8px',
              }}
            >
              <button
                type="button"
                className="aaa-btn aaa-btn-secondary"
                style={{ padding: '4px 12px', fontSize: '0.76rem' }}
                onClick={() => {
                  const temp = selectedPlayerDeckId;
                  setSelectedPlayerDeckId(selectedOpponentDeckId);
                  setSelectedOpponentDeckId(temp);
                }}
                title="Inverter Grimórios"
              >
                {activeMatchup.favorabilityScore}% vs {100 - activeMatchup.favorabilityScore}% · Inverter
              </button>
              {onLaunchDuel && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <select
                    aria-label="Grau do Soberano"
                    className="myth-select-compact"
                    style={{ padding: '4px 8px', fontSize: '0.73rem' }}
                    value={challengeAiTier}
                    onChange={(e) => setChallengeAiTier(Number(e.target.value) as AiSkillTier)}
                  >
                    {([1, 2, 3, 4, 5] as AiSkillTier[]).map((t) => (
                      <option key={t} value={t}>
                        Grau {AI_SKILL_TIER_SPECS[t].roman}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="btn-fantasy btn-fantasy-primary"
                    style={{ padding: '5px 12px', fontSize: '0.75rem' }}
                    onClick={() =>
                      onLaunchDuel(
                        resolvePlayerDeckForChallenge(selectedPlayerDeckId),
                        selectedOpponentDeckId,
                        challengeAiTier
                      )
                    }
                  >
                    Desafiar
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              {coverCardOpponent?.imagePath && (
                <img
                  src={coverCardOpponent.imagePath}
                  alt={opponentProfile.deck.name}
                  style={{ width: 42, height: 42, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }}
                />
              )}
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: 3 }}>
                  Grimório Oponente
                </div>
                <select
                  className="myth-select-compact"
                  style={{ width: '100%', fontSize: '0.8rem' }}
                  value={selectedOpponentDeckId}
                  onChange={(e) => setSelectedOpponentDeckId(e.target.value)}
                >
                  {renderDeckOptions()}
                </select>
              </div>
            </div>
          </section>

          <div className="tg-grid-layout" style={{ gap: 16 }}>
            <div
              style={{
                background: '#0b0f19',
                border: '1px solid rgba(148, 163, 184, 0.12)',
                borderRadius: 10,
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                <h2 className="font-cinzel" style={{ margin: 0, fontSize: '1rem', color: '#f8fafc' }}>
                  Plano de Confronto
                </h2>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: activeMatchup.favorabilityColor,
                  }}
                >
                  {activeMatchup.favorabilityLabel}
                </span>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#e5c97b', marginBottom: 3 }}>
                  {activeMatchup.stackingRuleBadge}
                </div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.48 }}>
                  {activeMatchup.stackingRuleDetail}
                </p>
              </div>

              <div style={{ paddingTop: 12, borderTop: '1px solid rgba(148, 163, 184, 0.08)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#e2e8f0', marginBottom: 3 }}>
                  Diretriz Tática
                </div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.48 }}>
                  {activeMatchup.generalTactics}
                </p>
              </div>

              <div style={{ paddingTop: 12, borderTop: '1px solid rgba(148, 163, 184, 0.08)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#e2e8f0', marginBottom: 3 }}>
                  Mão Inicial e Canalização [C]
                </div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.48 }}>
                  {activeMatchup.mulliganAndChannelGuide}
                </p>
              </div>

              <div style={{ paddingTop: 12, borderTop: '1px solid rgba(148, 163, 184, 0.08)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#e2e8f0', marginBottom: 3 }}>
                  Janela de Atenção e Vitória
                </div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.48 }}>
                  {activeMatchup.criticalThreatTurn} {activeMatchup.winConditionPath}
                </p>
              </div>
            </div>

            <div
              style={{
                background: '#0b0f19',
                border: '1px solid rgba(148, 163, 184, 0.12)',
                borderRadius: 10,
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <h2 className="font-cinzel" style={{ margin: 0, fontSize: '1rem', color: '#f8fafc' }}>
                Alvos Prioritários Oponentes
              </h2>

              <div className="tg-targets-list">
                {activeMatchup.priorityTargets.map(({ card, reason }) => (
                  <div
                    key={card.id}
                    className="tg-target-row"
                    onClick={() => setInspectCard(card)}
                  >
                    <div className="tg-target-art">
                      {card.imagePath && <img src={card.imagePath} alt={card.name} />}
                      <span className="tg-target-cost">{card.cost}</span>
                    </div>
                    <div className="tg-target-info">
                      <div className="tg-target-name-line">
                        <strong className="font-cinzel" style={{ color: '#f8fafc' }}>
                          {card.name}
                        </strong>
                        <span className="tg-target-type">
                          {DOMAIN_META[card.domain].shortName} · {CARD_TYPE_LABELS[card.type]}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.76rem', color: '#94a3b8', margin: '3px 0 0', lineHeight: 1.4 }}>
                        {reason}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <details
                style={{
                  paddingTop: 12,
                  borderTop: '1px solid rgba(148, 163, 184, 0.12)',
                  fontSize: '0.78rem',
                  color: '#94a3b8',
                }}
              >
                <summary
                  style={{
                    cursor: 'pointer',
                    color: '#cbd5e1',
                    fontWeight: 600,
                    userSelect: 'none',
                  }}
                >
                  Sinergias para explorar e neutralizar neste duelo
                </summary>
                <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {playerProfile.signatureCombos.slice(0, 2).map((combo, idx) => (
                    <div key={`p-c-${idx}`}>
                      <div style={{ fontWeight: 600, color: '#e5c97b', marginBottom: 2 }}>
                        Seu Grimório · {combo.title}
                      </div>
                      <p style={{ margin: '0 0 6px', color: '#cbd5e1', lineHeight: 1.4 }}>
                        {combo.explanation}
                      </p>
                    </div>
                  ))}
                  {opponentProfile.signatureCombos.slice(0, 2).map((combo, idx) => (
                    <div key={`o-c-${idx}`} style={{ paddingTop: 8, borderTop: '1px solid rgba(148, 163, 184, 0.08)' }}>
                      <div style={{ fontWeight: 600, color: '#fca5a5', marginBottom: 2 }}>
                        Neutralizar · {combo.title}
                      </div>
                      <p style={{ margin: 0, color: '#cbd5e1', lineHeight: 1.4 }}>
                        {combo.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          3. TABELA DE CONFRONTOS (CLEAN TABLE — 1 BUTTON PER ROW, ZERO EMOJIS)
          ===================================================================== */}
      {isTableSection && (
        <section
          style={{
            background: '#0b0f19',
            border: '1px solid rgba(148, 163, 184, 0.12)',
            borderRadius: 10,
            padding: '16px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`aaa-pill-tab ${viewSection === 'matrix_all' ? 'is-active' : ''}`}
                onClick={() => setViewSection('matrix_all')}
              >
                Contra {playerProfile.deck.name}
              </button>
              <button
                type="button"
                className={`aaa-pill-tab ${viewSection === 'global_tier_list' ? 'is-active' : ''}`}
                onClick={() => setViewSection('global_tier_list')}
              >
                Desempenho Geral ({UNIFIED_CHAMPION_STANDINGS.length} Grimórios)
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {viewSection === 'global_tier_list' && (
                <>
                  <select
                    aria-label="Formato"
                    className="myth-select-compact"
                    value={unifiedFormatFilter}
                    onChange={(e) =>
                      setUnifiedFormatFilter(e.target.value as UnifiedFormatKind | 'all')
                    }
                  >
                    <option value="all">Todos os formatos</option>
                    <option value="monocolor">1 Domínio</option>
                    <option value="bicolor">2 Domínios</option>
                    <option value="tricolor">3 Domínios</option>
                    <option value="pentachromatic">5 Domínios</option>
                  </select>
                  <select
                    aria-label="Tier"
                    className="myth-select-compact"
                    value={unifiedTierFilter}
                    onChange={(e) =>
                      setUnifiedTierFilter(e.target.value as 'all' | 'S' | 'A' | 'B')
                    }
                  >
                    <option value="all">Todos os Tiers</option>
                    <option value="S">Tier S</option>
                    <option value="A">Tier A</option>
                    <option value="B">Tier B</option>
                  </select>
                </>
              )}

              <select
                aria-label="Domínio"
                className="myth-select-compact"
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value as Domain | 'all')}
              >
                <option value="all">Todos os domínios</option>
                {(['red', 'blue', 'purple', 'green', 'gold', 'neutral'] as Domain[]).map((dom) => (
                  <option key={dom} value={dom}>
                    {DOMAIN_META[dom].shortName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {viewSection === 'matrix_all' ? (
            <div className="tg-matrix-table-wrap">
              <table className="tg-matrix-table">
                <thead>
                  <tr>
                    <th>Grimório Oponente</th>
                    <th>Domínio</th>
                    <th>Tendência</th>
                    <th>Formação Recomendada</th>
                    <th>Alvo Prioritário</th>
                    <th style={{ textAlign: 'right' }}>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {allMatchupsList.map(({ deck, analysis, bossUsingDeck }) => (
                    <tr
                      key={deck.id}
                      onClick={() => {
                        setSelectedOpponentDeckId(deck.id);
                        setViewSection('matchup_duel');
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        <div style={{ fontWeight: 600, color: '#f8fafc' }}>{deck.name}</div>
                        <div style={{ fontSize: '0.73rem', color: '#94a3b8' }}>
                          {(bossUsingDeck ? bossUsingDeck.name : deck.subtitle)
                            .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\uFE0F]/gu, '')
                            .replace(/\s{2,}/g, ' ')
                            .trim()}
                        </div>
                      </td>
                      <td>{renderDomainDots(deck.domains)}</td>
                      <td>
                        <span
                          style={{
                            color: analysis.favorabilityColor,
                            fontWeight: 600,
                            fontSize: '0.78rem',
                          }}
                        >
                          {analysis.favorabilityLabel}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.76rem', color: '#cbd5e1' }}>
                        {analysis.stackingRuleBadge}
                      </td>
                      <td style={{ fontSize: '0.76rem', color: '#cbd5e1' }}>
                        {analysis.priorityTargets[0]?.card.name ?? 'Campeão principal'}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="aaa-btn aaa-btn-secondary"
                          style={{ padding: '4px 10px', fontSize: '0.74rem' }}
                          onClick={(ev) => {
                            ev.stopPropagation();
                            setSelectedOpponentDeckId(deck.id);
                            setViewSection('matchup_duel');
                          }}
                        >
                          Analisar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="tg-matrix-table-wrap">
              <table className="tg-matrix-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Grimório Soberano</th>
                    <th>Domínio</th>
                    <th>Tier</th>
                    <th>Aproveitamento</th>
                    <th>Confronto Favorável</th>
                    <th style={{ textAlign: 'right' }}>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {UNIFIED_CHAMPION_STANDINGS.filter((st) => {
                    if (unifiedFormatFilter !== 'all' && st.format !== unifiedFormatFilter)
                      return false;
                    if (unifiedTierFilter !== 'all' && st.tierBadge !== unifiedTierFilter)
                      return false;
                    if (domainFilter !== 'all' && !st.domains.includes(domainFilter)) return false;
                    return true;
                  }).map((st) => {
                    const best = st.bestMatchups[0];
                    const worst = st.worstMatchups[0];
                    const bestDeck = best
                      ? getUnifiedStandingForDeckId(best.opponentId)
                      : undefined;
                    return (
                      <tr
                        key={st.archetypeId}
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setSelectedPlayerDeckId(st.archetypeId);
                          if (worst) setSelectedOpponentDeckId(worst.opponentId);
                          setViewSection('deck_mastery');
                        }}
                      >
                        <td style={{ fontWeight: 600, color: '#94a3b8' }}>{st.rank}</td>
                        <td>
                          <div style={{ fontWeight: 600, color: '#f8fafc' }}>{st.name}</div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                            {UNIFIED_FORMAT_LABELS[st.format]}
                          </div>
                        </td>
                        <td>{renderDomainDots(st.domains)}</td>
                        <td style={{ fontWeight: 600, color: '#e5c97b' }}>Tier {st.tierBadge}</td>
                        <td style={{ fontWeight: 600, color: '#e2e8f0' }}>
                          {(st.overallWinRate * 100).toFixed(1)}%
                        </td>
                        <td style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                          {bestDeck ? bestDeck.name : '—'}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            className="aaa-btn aaa-btn-secondary"
                            style={{ padding: '4px 10px', fontSize: '0.74rem' }}
                            onClick={(ev) => {
                              ev.stopPropagation();
                              setSelectedPlayerDeckId(st.archetypeId);
                              setViewSection('deck_mastery');
                            }}
                          >
                            Ver guia
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* =====================================================================
          4. COMPÊNDIO DE COMBOS (SINGLE-ROW TOOLBAR, CLEAN CARDS, ZERO EMOJI SOUP)
          ===================================================================== */}
      {viewSection === 'combos_compendium' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 10,
              padding: '10px 14px',
              background: '#0b0f19',
              border: '1px solid rgba(148, 163, 184, 0.12)',
              borderRadius: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <select
                aria-label="Quantidade de domínios"
                className="myth-select-compact"
                value={comboTierFilter}
                onChange={(e) => setComboTierFilter(e.target.value as ComboColorTier | 'all')}
              >
                <option value="all">Todas as combinações ({TACTICAL_COMBOS_COMPENDIUM.length})</option>
                <option value="mono">1 Domínio ({comboTierCounts.mono})</option>
                <option value="dual">2 Domínios ({comboTierCounts.dual})</option>
                <option value="tri">3 Domínios ({comboTierCounts.tri})</option>
                <option value="poly">4–5 Domínios ({comboTierCounts.poly})</option>
              </select>

              <select
                aria-label="Filtrar domínio"
                className="myth-select-compact"
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value as Domain | 'all')}
              >
                <option value="all">Todos os domínios</option>
                {(['red', 'blue', 'purple', 'green', 'gold', 'neutral'] as Domain[]).map((dom) => (
                  <option key={dom} value={dom}>
                    {DOMAIN_META[dom].shortName}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className={`aaa-pill-tab ${onlyInDeckCombos ? 'is-active' : ''}`}
                onClick={() => setOnlyInDeckCombos((prev) => !prev)}
              >
                Presentes no grimório atual
              </button>
            </div>

            <input
              type="text"
              value={comboSearchQuery}
              onChange={(e) => setComboSearchQuery(e.target.value)}
              placeholder="Buscar combo ou carta..."
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                background: '#111622',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                color: '#f8fafc',
                fontSize: '0.78rem',
                minWidth: 220,
              }}
            />
          </div>

          <div className="tg-grid-layout" style={{ alignItems: 'stretch', gap: 14 }}>
            {TACTICAL_COMBOS_COMPENDIUM.filter((combo) => {
              if (comboTierFilter !== 'all' && combo.tier !== comboTierFilter) return false;
              if (domainFilter !== 'all' && !combo.domains.includes(domainFilter)) return false;
              const deckIdSet = new Set(playerProfile.deck.cardIds);
              if (onlyInDeckCombos && !combo.cardIds.some((cid) => deckIdSet.has(cid))) {
                return false;
              }
              if (comboSearchQuery.trim()) {
                const q = comboSearchQuery.trim().toLowerCase();
                const cardNamesMatch = combo.cardIds.some((cid) =>
                  CARDS_BY_ID[cid]?.name.toLowerCase().includes(q)
                );
                const textMatch =
                  combo.title.toLowerCase().includes(q) ||
                  combo.archetypeTag.toLowerCase().includes(q) ||
                  combo.mechanism.toLowerCase().includes(q) ||
                  combo.payoff.toLowerCase().includes(q);
                if (!cardNamesMatch && !textMatch) return false;
              }
              return true;
            }).map((combo) => {
              const comboCards = combo.cardIds
                .map((cid) => CARDS_BY_ID[cid])
                .filter((c): c is CardDefinition => Boolean(c));
              const deckIdSet = new Set(playerProfile.deck.cardIds);
              const inDeckCount = comboCards.filter((c) => deckIdSet.has(c.id)).length;

              return (
                <div
                  key={combo.id}
                  style={{
                    background: '#0b0f19',
                    border: '1px solid rgba(148, 163, 184, 0.12)',
                    borderRadius: 10,
                    padding: '16px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 12,
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: 6,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {renderDomainDots(combo.domains)}
                        <span style={{ fontSize: '0.73rem', color: '#94a3b8' }}>
                          {combo.domains.map((d) => DOMAIN_META[d].shortName).join(' · ')}
                        </span>
                      </div>
                      {inDeckCount > 0 && (
                        <span style={{ fontSize: '0.72rem', color: '#e5c97b' }}>
                          {inDeckCount}/{comboCards.length} no grimório
                        </span>
                      )}
                    </div>

                    <h3
                      className="font-cinzel"
                      style={{ color: '#f8fafc', fontSize: '0.94rem', margin: '0 0 6px' }}
                    >
                      {combo.title}
                    </h3>

                    <p style={{ fontSize: '0.79rem', color: '#cbd5e1', lineHeight: 1.46, margin: 0 }}>
                      {combo.mechanism}
                    </p>
                    <p style={{ fontSize: '0.76rem', color: '#94a3b8', lineHeight: 1.44, margin: '6px 0 0' }}>
                      <strong style={{ color: '#e5c97b', fontWeight: 600 }}>Impacto:</strong>{' '}
                      {combo.payoff}
                    </p>
                  </div>

                  <div className="tg-combo-cards-row">
                    {comboCards.map((c) => (
                      <div
                        key={c.id}
                        className="tg-mini-card-pill"
                        onClick={() => setInspectCard(c)}
                      >
                        {c.imagePath && <img src={c.imagePath} alt={c.name} />}
                        <div>
                          <div className="tg-mini-card-name">{c.name}</div>
                          <div className="tg-mini-card-sub">
                            Custo {c.cost} · {CARD_TYPE_LABELS[c.type]}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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

  if (isModal) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div
          className="modal-panel tg-modal-shell"
          style={{ maxWidth: 1180, width: '95vw', maxHeight: '90vh', overflowY: 'auto' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-sticky-close-bar">
            <span className="font-cinzel" style={{ fontSize: '0.84rem', fontWeight: 700, color: '#f8fafc' }}>
              Oráculo Estratégico
            </span>
            <button type="button" className="aaa-btn aaa-btn-secondary" onClick={onClose}>
              Fechar
            </button>
          </div>
          {content}
        </div>
      </div>
    );
  }

  return content;
};
