import React, { useState, useMemo } from 'react';
import { CardDefinition, CardType, Domain, PrebuiltDeck } from '../types/game';
import { ALL_CARDS, CARDS_BY_ID } from '../data/cards';
import { PREBUILT_DECKS, CAMPAIGN_BOSSES } from '../data/decks';
import { DECK_TACTICAL_PROFILES, EMPIRICAL_WIN_RATES, getMatchupGuide } from '../data/tacticalGuide';
import { CardView, CardInspectModal, DOMAIN_META, CARD_TYPE_LABELS } from './CardView';
import { CustomSavedDeck } from './BattleArena';

export interface TacticalGuideViewProps {
  customDecks?: CustomSavedDeck[];
  initialPlayerDeckId?: string;
  initialOpponentDeckId?: string;
  isModal?: boolean;
  onClose?: () => void;
  onLaunchDuel?: (playerDeckId: string, opponentDeckId: string) => void;
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

const DOMAIN_EXPANSION_NAMES: Record<Exclude<Domain, 'neutral'>, string> = {
  red: 'Caldeira do Sol Carmesim (6/6 Afinidade + 3⚡: mesa rachada por rios de lava derretida, Potencial 120% e Acerto Garantido por 3 rodadas)',
  blue: 'Vazio Infinito de Cronos (6/6 Afinidade + 3⚡: santuário glacial e tempestade astral, Potencial 120% e Acerto Garantido por 3 rodadas)',
  purple: 'Santuário Malevolente das Almas (6/6 Afinidade + 3⚡: cemitério gótico e névoa necrótica, Potencial 120% e Acerto Garantido por 3 rodadas)',
  green: 'Mar de Árvores Primordial (6/6 Afinidade + 3⚡: solo de floresta primordial com raízes vivas, Potencial 120% e Acerto Garantido por 3 rodadas)',
  gold: 'Tribunal da Sentença Dourada (6/6 Afinidade + 3⚡: santuário imperial com canais de ouro derretido, Potencial 120% e Acerto Garantido por 3 rodadas)',
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

  const primaryDomainsText = deck.domains
    .filter((d): d is Exclude<Domain, 'neutral'> => d !== 'neutral')
    .map((d) => `${DOMAIN_META[d].icon} ${DOMAIN_META[d].name}`)
    .join(' + ');

  const domainExpansionText = deck.domains
    .filter((d): d is Exclude<Domain, 'neutral'> => d !== 'neutral')
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
    ? `${curatedProfile.phasePlan.earlyGame} (Cada jogador joga no seu turno iniciando com 40❤️, 3⚡ de Essência que sobe +1⚡ por turno e 7 cartas; mantenha no Mulligan: ${openingNames}, canalize 1 carta [C] por turno para +1 Afinidade e compra de 1 carta substituta, e ocupe a Vanguarda [V] para garantir +1⚔️ ATQ de Invasão de Coluna).`
    : `Mantenha no Mulligan cartas de curva baixa como ${openingNames}. Nos Turnos 1 a 3 (iniciando com 40❤️ e 3⚡ de Essência que cresce +1⚡ a cada turno), canalize 1 carta pesada por turno ([C]) para ganhar +1 de Afinidade em ${primaryDomainsText || 'seu Domínio'} e comprar 1 carta substituta. Posicione na Vanguarda [V] de colunas livres para ativar Invasão de Coluna (+1⚔️ ATQ) e Cobertura (+1⚔️ ATQ)!`;

  const midgamePlan = curatedProfile
    ? `${curatedProfile.phasePlan.midGame} Acumule Afinidade Elemental para destravar suas cartas fortes e carregar o ritual de Expansão de Domínio (⛩️ X/6), usando Poder do Soberano (🔥 2⚡) e ataques imediatos (⚔️ ATACAR) para controlar a mesa 6×4.`
    : `Nos Turnos 4 a 6, continue acumulando Afinidade Elemental para destravar suas cartas de alto impacto e carregar o contador "⛩️ X/6" na barra inferior, posicionando motores de valor na Retaguarda [R] (${midNames}). ${
        counts.relic >= 5
          ? `Com ${counts.relic} Relíquias no baralho, proteja suas colunas de Retaguarda com Guardiões na Vanguarda [V] para acumular vantagem contínua a cada turno.`
          : counts.spell >= 11
          ? `Use seus ${counts.spell} Feitiços e ${counts.reaction} Reações para punir slots onde o oponente empilhar 2 ou 3 unidades.`
          : `Pressione no seu turno com suas ${counts.creature} criaturas forçando trocas favoráveis e preparando Ascensões (★).`
      }`;

  const endgamePlan = curatedProfile
    ? `${curatedProfile.phasePlan.lateGame} Ao atingir 6/6 de Afinidade e 3⚡, invoque sua Expansão de Domínio (${domainExpansionText || 'Potencial 120% e Acerto Garantido por 3 rodadas'})${
        ascensionCards.length > 0
          ? ` e ative a Ascensão de ${ascensionCards
              .slice(0, 2)
              .map((c) => `${c.name} ➔ ★ ${c.ascension?.newName}`)
              .join(' ou ')}.`
          : '.'
      }`
    : `Nos Turnos 6+, atinja 6/6 de Afinidade e pague 3⚡ para invocar sua Expansão de Domínio (${domainExpansionText || 'transformando toda a mesa de madeira por 3 rodadas com Potencial 120% e Acerto Garantido'}), descendo ${finisherNames}${
        ascensionCards.length > 0
          ? ` e ativando a Ascensão de ${ascensionCards
              .slice(0, 2)
              .map((c) => `${c.name} ➔ ★ ${c.ascension?.newName}`)
              .join(' ou ')}`
          : ''
      }. Concentre seus atacantes prontos (ou use "⚔️ ATACAR" na barra inferior) para desferir golpes diretos letais ao Soberano rival!`;

  const fodderList =
    channelFodderCards.map((c) => `${c.name} (${c.cost}⚡)`).join(', ') ||
    'cópias duplicadas de custo 5+';
  const channelingDoctrine = curatedProfile
    ? `${curatedProfile.channelingStrategy} (Candidatas ideais para Canalizar [C]: ${fodderList}; lembre-se que você também pode Sacrificar/Queimar cartas extras por +1⚡ temporário e +1 Afinidade para fechar 6/6 da Expansão de Domínio!).`
    : `Priorize canalizar ([C], 1x por turno para +1 Afinidade e +1 compra): ${fodderList}. Evite canalizar suas cartas Lendárias (${
        keyThreats[0]?.name ?? 'seu Campeão'
      }) ou seus Guardiões de turno 1–2. A Afinidade acumulada serve para destravar cartas com requisito de afinidade e para atingir 6/6 ("⛩️ 6/6", custo 3⚡), ativando a Expansão de Domínio!`;

  const prefersStacking = guardianCards.length >= 4 || relicCards.length >= 5 || counts.creature >= 26;
  const stackingDoctrineTitle = prefersStacking
    ? 'Formação Recomendada: Falange Empilhada 2x–3x em Colunas Blindadas'
    : 'Formação Recomendada: Linha Espalhada 1x–2x com Artilharia de Retaguarda';

  const stackingDoctrineBody = curatedProfile
    ? `${curatedProfile.positioningAndStackingGuide} — ${curatedProfile.playstyleOverview}`
    : prefersStacking
    ? `Este grimório brilha ao empilhar até 3 cartas na mesma coluna: coloque 1 unidade blindada (${
        guardianCards
          .slice(0, 2)
          .map((c) => c.name)
          .join(' ou ') || 'Guardião'
      }) liderando o slot da Vanguarda e empilhe 2 atacantes ou Relíquias atrás/junto dela. Isso garante o bônus de Cobertura de Coluna (+1 ATQ na Retaguarda) e concentra até 3 ataques na mesma brecha para derrubar o Soberano inimigo. Cuidado apenas contra dragões com Sopro ou magias de fileira!`
    : `Como este grimório opera com ${counts.spell} Feitiços e ${counts.reaction} Reações, espalhe suas unidades em 1 carta por coluna na Vanguarda para anular o valor de Sopro Elemental e Atropelar do oponente. Reserve o empilhamento 2x–3x para a sua Retaguarda, combinando Relíquias (${
        relicCards
          .slice(0, 2)
          .map((c) => c.name)
          .join(', ') || 'artefatos'
      }) e unidades com Alcance/Voo fora do alcance terrestre.`;

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

  // Calculate tactical favorability score (45..55) based on calibrated 80-card simulation & matchup dynamics
  let score = EMPIRICAL_WIN_RATES[p.deck.id]?.[e.deck.id] ?? 50;

  // Spell-heavy / AoE decks punish super creature-heavy swarm decks (scaled for 80-card decks)
  if (p.breathAndAoECards.length >= 8 && e.counts.creature >= 50) score += 1;
  if (e.breathAndAoECards.length >= 8 && p.counts.creature >= 50) score -= 1;

  // Fast creature swarm pressures slow Relic/Spell decks
  const pEarly = (p.curve[1] ?? 0) + (p.curve[2] ?? 0);
  const eEarly = (e.curve[1] ?? 0) + (e.curve[2] ?? 0);
  if (pEarly >= 20 && e.counts.relic >= 14) score += 1;
  if (eEarly >= 20 && p.counts.relic >= 14) score -= 1;

  // Relic engines out-value low-aggression midrange/control in long games
  if (p.counts.relic >= 14 && eEarly <= 14) score += 1;
  if (e.counts.relic >= 14 && pEarly <= 14) score -= 1;

  score = Math.round(Math.max(45, Math.min(55, score)));

  let favorabilityLabel = 'CONFRONTO EQUILIBRADO (50/50)';
  let favorabilityColor = '#fde047';
  if (score >= 53) {
    favorabilityLabel = `FAVORÁVEL (${score}/${100 - score})`;
    favorabilityColor = '#4ade80';
  } else if (score >= 51) {
    favorabilityLabel = `LEVE VANTAGEM (${score}/${100 - score})`;
    favorabilityColor = '#86efac';
  } else if (score <= 47) {
    favorabilityLabel = `DESAFIADOR (${score}/${100 - score})`;
    favorabilityColor = '#fb923c';
  } else if (score < 50) {
    favorabilityLabel = `EQUILÍBRIO TÁTICO (${score}/${100 - score})`;
    favorabilityColor = '#fde047';
  }

  const asymmetryHeadline = `Assimetria do Duelo: Seu Deck (${p.counts.creature} Criat. / ${
    p.counts.spell
  } Feit. / ${p.counts.reaction} Reaç. / ${p.counts.relic} Relíq.) vs ${e.deck.name} (${
    e.counts.creature
  } Criat. / ${e.counts.spell} Feit. / ${e.counts.reaction} Reaç. / ${e.counts.relic} Relíq.)`;

  // Determine Slot Stacking Rule for this specific opponent!
  const enemyAoECount = e.breathAndAoECards.length;
  let stackingRuleMode: 'spread_1x' | 'stack_3x' | 'selective_2x' = 'selective_2x';
  let stackingRuleBadge = '⚖️ EMPILHAMENTO SELETIVO (MÁX. 2 UNIDADES / SLOT)';
  let stackingRuleDetail = '';

  if (enemyAoECount >= 6) {
    stackingRuleMode = 'spread_1x';
    stackingRuleBadge = '⚠️ PROIBIDO EMPILHAR 3x: ESPALHE 1 UNIDADE POR COLUNA!';
    const aoeNames = e.breathAndAoECards
      .slice(0, 3)
      .map((c) => c.name)
      .join(', ');
    stackingRuleDetail = `O baralho inimigo possui alto poder de Dano em Área / Sopro / Atropelar (${enemyAoECount} cartas, incluindo ${aoeNames}). No sistema de Empilhamento 3x, ataques de Sopro e explosões atingem TODAS as cartas do mesmo slot simultaneamente! Portanto, espalhe suas tropas em 4 a 6 colunas separadas (1 unidade por slot) e jamais agrupe 3 unidades sem Escudo Divino.`;
  } else if (e.singleTargetKillCards.length >= 8 || e.counts.creature >= 50) {
    stackingRuleMode = 'stack_3x';
    stackingRuleBadge = '🛡️ EMPILHAMENTO 3x RECOMENDADO (GUARDIÃO + 2 ATACANTES NO SLOT)';
    const singleNames = e.singleTargetKillCards
      .slice(0, 3)
      .map((c) => c.name)
      .join(', ');
    stackingRuleDetail = `O oponente depende de abates de alvo único ou pressão física (${
      singleNames || 'golpes diretos'
    }) e possui pouquíssimo dano em área (${enemyAoECount} fontes). Empilhe até 3 unidades na sua melhor coluna colocando 1 Guardião/Blindado na frente e 2 causadores de dano juntos: o inimigo só conseguirá atingir 1 carta por vez enquanto sua pilha inteira revida no turno seguinte!`;
  } else {
    stackingRuleMode = 'selective_2x';
    stackingRuleBadge = '📐 FORMAÇÃO EM PARES (2x NA RETAGUARDA, 1x NA VANGUARDA)';
    stackingRuleDetail = `Contra ${e.deck.name}, mantenha 1 bloqueador por coluna na Vanguarda para cobrir o campo e empilhe até 2 cartas (1 Relíquia + 1 Atirador/Suporte) na Retaguarda das colunas protegidas para ganhar +1 ATQ de Cobertura sem se expor a varreduras completas.`;
  }

  // General Tactics against enemy structure (100-card decks)
  let generalTactics = '';
  if (e.counts.creature >= 65) {
    generalTactics = `${e.deck.name} joga com ${e.counts.creature} criaturas (${e.pcts.creature}% do baralho de 100 cartas) e apenas ${e.counts.spell} feitiços. Ele tentará inundar a Vanguarda [V] e ganhar +1 ATQ de Invasão. Não troque vida cedo: posicione bloqueadores com alta Armadura/HP, force a IA a empilhar 2–3 criaturas no mesmo slot e limpe a pilha inteira com Sopro, Atropelar ou feitiços de fileira!`;
  } else if (e.counts.spell + e.counts.reaction >= 38) {
    generalTactics = `${e.deck.name} é um Grimório pesado em magias (${e.counts.spell} Feitiços e ${e.counts.reaction} Reações em 100 cartas) com menos criaturas (${e.counts.creature}). A fraqueza estrutural dele é a falta de corpos para bloquear todas as 6 colunas. Pressione 3 colunas diferentes ao mesmo tempo e teste as Emboscadas na Retaguarda [R] inimiga atacando primeiro com sua unidade mais barata antes de comprometer seu campeão principal.`;
  } else if (e.counts.relic >= 18) {
    generalTactics = `${e.deck.name} constrói uma fortaleza de longo prazo com ${e.counts.relic} Relíquias na Retaguarda [R] dentro das 100 cartas. Se o duelo passar do Turno 8 com a Retaguarda inimiga intacta, o valor contínuo dele será esmagador. Sua prioridade absoluta é abrir 1 ou 2 colunas na Vanguarda inimiga e invadir diretamente as Relíquias na Retaguarda dele antes que se acumulem!`;
  } else {
    generalTactics = `${e.deck.name} combina ${e.counts.creature} criaturas, ${e.counts.spell} feitiços, ${e.counts.reaction} reações e ${e.counts.relic} relíquias (100 cartas • custo médio ${e.avgCost}⚡). Dispute o controle das colunas centrais (Colunas 3 e 4), acumule 6/6 de Afinidade para ativar sua Expansão de Domínio (⛩️ 3⚡) — ou provocar um Choque de Domínios 50/50 se o rival expandir primeiro — e guarde suas remoções diretas para os campeões de custo 5+ dele.`;
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

  const mulliganAndChannelGuide = `Na Mão Inicial (7 cartas, com 40❤️ e 3⚡ inicial), busque ${keepNames}${
    removalOrAoE ? ` e guarde ${removalOrAoE} como resposta chave` : ''
  }. Nos Turnos 1 a 3, canalize ([C]) cartas lentas (${
    p.channelFodderCards
      .slice(0, 2)
      .map((c) => c.name)
      .join(', ') || 'custo 6+'
  }) para ganhar +1 Afinidade e comprar 1 carta de reposição (somando-se ao +1⚡ de Essência Máxima automático por turno), destravando suas cartas fortes e avançando rumo à Expansão de Domínio (⛩️ 6/6, 3⚡). ${
    eEarly >= 11
      ? 'Como o oponente é muito agressivo nos primeiros turnos, NÃO guarde mãos pesadas de custo 5+!'
      : 'O oponente tem início cadenciado, permitindo canalizar até o Turno 5–6 para alcançar 6/6 de Afinidade com segurança.'
  }`;

  // Priority enemy targets
  const priorityTargets = e.keyThreats.slice(0, 4).map((card) => {
    let reason = `Ameaça central (${card.cost}⚡) do grimório inimigo.`;
    if (card.type === 'relic') {
      reason = `Relíquia contínua na Retaguarda [R]: gera vantagem todo turno se não for destruída.`;
    } else if ((card.breathDamage ?? 0) > 0) {
      reason = `Sopro (-${card.breathDamage}🔥 na fileira): dizima slots empilhados ao entrar ou atacar!`;
    } else if (card.ascension) {
      reason = `Perigo de Ascensão: evolui para ★ ${card.ascension.newName} (${card.ascension.newAtk}/${card.ascension.newMaxHp}) se sobreviver em campo.`;
    } else if (
      card.keywords.includes('Toque Letal') ||
      card.keywords.includes('Dreno de Vida')
    ) {
      reason = `Especialista de combate (${card.keywords.join(', ')}): elimine com feitiço ou Alcance sem sofrer revide.`;
    }
    return { card, reason };
  });

  const trapNames =
    e.reactionCards.map((c) => `${c.name} (${c.cost}⚡)`).join(', ') ||
    'Nenhuma reação pesada registrada';
  const aoeNames =
    e.breathAndAoECards.map((c) => `${c.name} (${c.cost}⚡)`).join(', ') ||
    'Sem varreduras globais pesadas';

  const criticalThreatTurn = `Turno Crítico Inimigo: Turnos 4 a 6 (6–8 de Essência e proximidade da Expansão de Domínio ⛩️ 6/6). Fique atento às Reações/Emboscadas deste deck (${trapNames}) armadas na Retaguarda [R] e às cartas de impacto em área (${aoeNames}).`;

  const winConditionPath = `Fechamento da Partida: Use ${
    p.keyThreats
      .slice(0, 2)
      .map((c) => c.name)
      .join(' + ') || 'seus campeões principais'
  } e invoque sua Expansão de Domínio (⛩️ 6/6 Afinidade e 3⚡) para transformar a mesa de madeira por 3 rodadas com Potencial 120% e Acerto Garantido! ${
    stackingRuleMode === 'stack_3x'
      ? 'Agrupe uma coluna 3x com Vanguarda invasora para somar +1 ATQ de Invasão em cada unidade da pilha e finalizar o Soberano inimigo em uma única investida.'
      : 'Mantenha pressão distribuída em múltiplas colunas para que mesmo uma magia de área inimiga deixe atacantes prontos para o golpe letal.'
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
  isModal = false,
  onClose,
  onLaunchDuel,
}) => {
  const allDecks: PrebuiltDeck[] = useMemo(() => {
    const customConverted: PrebuiltDeck[] = customDecks.map((cd) => {
      const domainsSet = new Set<Domain>();
      for (const cid of cd.cardIds) {
        const c = CARDS_BY_ID[cid];
        if (c && c.domain !== 'neutral') domainsSet.add(c.domain);
      }
      return {
        id: cd.id,
        name: `★ ${cd.name}`,
        subtitle: 'Grimório Personalizado do Jogador',
        domains: domainsSet.size > 0 ? Array.from(domainsSet) : ['neutral'],
        strategy: 'Grimório forjado sob medida no Construtor de Decks.',
        coverCardId: cd.cardIds[0] ?? 'neutral_10_valkyra_pentacromatica',
        cardIds: cd.cardIds,
      };
    });
    return [...PREBUILT_DECKS, ...customConverted];
  }, [customDecks]);

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

  const [viewSection, setViewSection] = useState<'deck_mastery' | 'matchup_duel' | 'matrix_all'>(
    initialOpponentDeckId ? 'matchup_duel' : 'deck_mastery'
  );
  const [domainFilter, setDomainFilter] = useState<Domain | 'all'>('all');
  const [inspectCard, setInspectCard] = useState<CardDefinition | null>(null);

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

  const content = (
    <div className={isModal ? 'tg-modal-inner' : 'aaa-page-shell'}>
      {/* HEADER */}
      <header className="aaa-page-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="aaa-kicker">
            ORÁCULO DE GUERRA • ANÁLISE DE GRIMÓRIOS & CONFRONTOS
          </div>
          <h1 className="aaa-page-title font-cinzel">
            Oráculo Estratégico & Matchups
          </h1>
        </div>

        <div className="aaa-header-actions" style={{ flexWrap: 'wrap', gap: '0.6rem' }}>
          <button
            type="button"
            className={`btn-fantasy ${viewSection === 'deck_mastery' ? 'btn-fantasy-primary' : ''}`}
            onClick={() => setViewSection('deck_mastery')}
          >
            Manual do Grimório
          </button>
          <button
            type="button"
            className={`btn-fantasy ${viewSection === 'matchup_duel' ? 'btn-fantasy-primary' : ''}`}
            onClick={() => setViewSection('matchup_duel')}
          >
            Simulador 1×1
          </button>
          <button
            type="button"
            className={`btn-fantasy ${viewSection === 'matrix_all' ? 'btn-fantasy-primary' : ''}`}
            onClick={() => setViewSection('matrix_all')}
          >
            Matriz de Confrontos ({allDecks.length - 1})
          </button>
          {isModal && onClose && (
            <button type="button" className="btn-fantasy btn-fantasy-danger" onClick={onClose}>
              Fechar
            </button>
          )}
        </div>
      </header>

      {/* DUAL DECK SELECTOR BAR (100% SYMMETRICAL LEFT & RIGHT) */}
      <div className="tg-selector-banner">
        {/* Player Deck Selector */}
        <div className="tg-selector-card player-side">
          <div className="tg-selector-thumb">
            {coverCardPlayer?.imagePath && (
              <img src={coverCardPlayer.imagePath} alt={playerProfile.deck.name} />
            )}
          </div>
          <div className="tg-selector-body">
            <div className="tg-selector-kicker-row">
              <span className="tg-selector-kicker">SEU GRIMÓRIO EM ANÁLISE</span>
              <span
                className="tg-winrate-mini-pill"
                style={{
                  color: activeMatchup.favorabilityColor,
                  borderColor: activeMatchup.favorabilityColor,
                }}
              >
                Favorabilidade: {activeMatchup.favorabilityScore}%
              </span>
            </div>
            <select
              className="aaa-select tg-deck-select"
              value={selectedPlayerDeckId}
              onChange={(e) => setSelectedPlayerDeckId(e.target.value)}
            >
              <optgroup label="Grimórios Oficiais">
                {PREBUILT_DECKS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} — {d.subtitle}
                  </option>
                ))}
              </optgroup>
              {customDecks.length > 0 && (
                <optgroup label="Grimórios Autorais">
                  {customDecks.map((cd) => (
                    <option key={cd.id} value={cd.id}>
                      ★ {cd.name}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
            <div className="tg-selector-meta">
              <span className="tg-role-pill" title={playerProfile.archetypeRole}>
                {playerProfile.archetypeRole}
              </span>
              <span className="tg-cost-pill">Custo Médio {playerProfile.avgCost}</span>
            </div>
          </div>
        </div>

        {/* Center VS & Duel Controls */}
        <div className="tg-vs-center">
          <button
            type="button"
            className="btn-fantasy"
            onClick={() => {
              const temp = selectedPlayerDeckId;
              setSelectedPlayerDeckId(selectedOpponentDeckId);
              setSelectedOpponentDeckId(temp);
            }}
            title="Inverter Grimórios em Análise"
          >
            ⇄ Inverter ({activeMatchup.favorabilityScore}/{100 - activeMatchup.favorabilityScore})
          </button>
          {onLaunchDuel && (
            <button
              type="button"
              className="btn-fantasy btn-fantasy-primary"
              onClick={() => onLaunchDuel(selectedPlayerDeckId, selectedOpponentDeckId)}
            >
              Testar na Arena
            </button>
          )}
        </div>

        {/* Opponent Deck Selector (Mirrored Symmetrical Structure) */}
        <div className="tg-selector-card enemy-side">
          <div className="tg-selector-thumb">
            {coverCardOpponent?.imagePath && (
              <img src={coverCardOpponent.imagePath} alt={opponentProfile.deck.name} />
            )}
          </div>
          <div className="tg-selector-body">
            <div className="tg-selector-kicker-row">
              <span className="tg-selector-kicker">GRIMÓRIO / CHEFE OPONENTE</span>
              <span
                className="tg-winrate-mini-pill"
                style={{
                  color: activeMatchup.favorabilityColor,
                  borderColor: activeMatchup.favorabilityColor,
                }}
              >
                Favorabilidade: {100 - activeMatchup.favorabilityScore}%
              </span>
            </div>
            <select
              className="aaa-select tg-deck-select"
              value={selectedOpponentDeckId}
              onChange={(e) => {
                setSelectedOpponentDeckId(e.target.value);
                if (viewSection === 'matrix_all') setViewSection('matchup_duel');
              }}
            >
              <optgroup label="Grimórios Oficiais">
                {PREBUILT_DECKS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} — {d.subtitle}
                  </option>
                ))}
              </optgroup>
              {customDecks.length > 0 && (
                <optgroup label="Grimórios Autorais">
                  {customDecks.map((cd) => (
                    <option key={cd.id} value={cd.id}>
                      ★ {cd.name}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
            <div className="tg-selector-meta">
              <span className="tg-role-pill" title={opponentProfile.archetypeRole}>
                {opponentProfile.archetypeRole}
              </span>
              <span className="tg-cost-pill">Custo Médio {opponentProfile.avgCost}</span>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          TAB 1: MANUAL COMPLETO DO SEU DECK (ASSIMETRIA, PLANO, CANALIZAÇÃO, COMBOS)
          ===================================================================== */}
      {viewSection === 'deck_mastery' && (
        <div className="tg-grid-layout">
          {/* Left Column: Asymmetric Breakdown & Essence Curve */}
          <div className="tg-panel">
            <div className="aaa-kicker">RADAR DE ASSIMETRIA ESTRUTURAL (100 CARTAS)</div>
            <h2 className="font-cinzel tg-panel-title">{playerProfile.deck.name}</h2>
            <p className="tg-panel-subtitle">{playerProfile.deck.strategy}</p>

            {/* Asymmetric Type Breakdown Bars */}
            <div className="tg-asymmetry-bars">
              <div className="tg-asym-row">
                <div className="tg-asym-label">
                  <span><i className="dot-c" /> Criaturas ({playerProfile.vanguardCount} Vang. / {playerProfile.rearguardCount - playerProfile.counts.relic - playerProfile.counts.reaction} Ret.)</span>
                  <strong>{playerProfile.counts.creature} cartas ({playerProfile.pcts.creature}%)</strong>
                </div>
                <div className="tg-asym-track">
                  <div
                    className="tg-asym-fill fill-creature"
                    style={{ width: `${playerProfile.pcts.creature}%` }}
                  />
                </div>
              </div>

              <div className="tg-asym-row">
                <div className="tg-asym-label">
                  <span><i className="dot-s" /> Feitiços (Magias de Ação & Área)</span>
                  <strong>{playerProfile.counts.spell} cartas ({playerProfile.pcts.spell}%)</strong>
                </div>
                <div className="tg-asym-track">
                  <div
                    className="tg-asym-fill fill-spell"
                    style={{ width: `${playerProfile.pcts.spell}%` }}
                  />
                </div>
              </div>

              <div className="tg-asym-row">
                <div className="tg-asym-label">
                  <span><i className="dot-r" /> Reações (Emboscadas de Retaguarda)</span>
                  <strong>{playerProfile.counts.reaction} cartas ({playerProfile.pcts.reaction}%)</strong>
                </div>
                <div className="tg-asym-track">
                  <div
                    className="tg-asym-fill fill-reaction"
                    style={{ width: `${playerProfile.pcts.reaction}%` }}
                  />
                </div>
              </div>

              <div className="tg-asym-row">
                <div className="tg-asym-label">
                  <span><i className="dot-l" /> Relíquias (Motores Contínuos)</span>
                  <strong>{playerProfile.counts.relic} cartas ({playerProfile.pcts.relic}%)</strong>
                </div>
                <div className="tg-asym-track">
                  <div
                    className="tg-asym-fill fill-relic"
                    style={{ width: `${playerProfile.pcts.relic}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Essence Curve */}
            <div style={{ marginTop: '1.1rem' }}>
              <div className="aaa-kicker" style={{ marginBottom: '0.45rem' }}>
                CURVA DE ESSÊNCIA (CUSTO MÉDIO: {playerProfile.avgCost}⚡)
              </div>
              <div className="db-mini-curve" style={{ height: '78px' }}>
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
                      <span className="db-curve-lbl">{bucket === 7 ? '7+' : `${bucket}⚡`}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Doctrine of Slot Stacking (1x vs 3x) */}
            <div className="tg-doctrine-box" style={{ marginTop: '1.1rem' }}>
              <div className="aaa-kicker">DOUTRINA DE POSICIONAMENTO & EMPILHAMENTO 3x</div>
              <h4 className="font-cinzel" style={{ color: '#fde68a', margin: '0.25rem 0' }}>
                {playerProfile.stackingDoctrineTitle}
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.55 }}>
                {playerProfile.stackingDoctrineBody}
              </p>
            </div>

            {/* Channeling Guide */}
            <div className="tg-doctrine-box channel-box" style={{ marginTop: '0.85rem' }}>
              <div className="aaa-kicker">GUIA DE CANALIZAÇÃO (O QUE SACRIFICAR POR ESSÊNCIA)</div>
              <p style={{ fontSize: '0.82rem', color: '#e9d5ff', lineHeight: 1.55, marginTop: '0.25rem' }}>
                {playerProfile.channelingDoctrine}
              </p>
            </div>
          </div>

          {/* Right Column: Turn-by-Turn Gameplan & Signature Combos */}
          <div className="tg-panel">
            <div className="aaa-kicker">PLANO GERAL DE JOGO (TURNOS 1 A 7+)</div>
            <h2 className="font-cinzel tg-panel-title">Roteiro Tático de Vitória</h2>

            <div className="tg-phases-list">
              <div className="tg-phase-card phase-early">
                <div className="tg-phase-badge">ABERTURA • TURNOS 1 A 3 (CANALIZAR [C] & CONTROLE DE VANGUARDA)</div>
                <p>{playerProfile.openingPlan}</p>
              </div>

              <div className="tg-phase-card phase-mid">
                <div className="tg-phase-badge">MEIO DE JOGO • TURNOS 4 A 6 (AFINIDADE & RITUAIS DO SOBERANO)</div>
                <p>{playerProfile.midgamePlan}</p>
              </div>

              <div className="tg-phase-card phase-late">
                <div className="tg-phase-badge">FINALIZAÇÃO • TURNOS 6+ (EXPANSÃO DE DOMÍNIO ⛩️ 6/6 & EXECUÇÃO)</div>
                <p>{playerProfile.endgamePlan}</p>
              </div>
            </div>

            {/* Signature Combos with Interactive Card Previews */}
            <div style={{ marginTop: '1.25rem' }}>
              <div className="aaa-kicker" style={{ marginBottom: '0.6rem' }}>
                COMBOS ASSINATURA DESTE GRIMÓRIO (CLIQUE NAS CARTAS PARA INSPECIONAR)
              </div>
              <div className="tg-combos-list">
                {playerProfile.signatureCombos.map((combo, idx) => (
                  <div key={idx} className="tg-combo-card">
                    <div className="tg-combo-header">
                      <h4 className="font-cinzel" style={{ color: '#fde68a', fontSize: '0.9rem' }}>
                        {combo.title}
                      </h4>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '0.65rem' }}>
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
                              {c.cost}⚡ • {CARD_TYPE_LABELS[c.type]}
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
          TAB 2: SIMULADOR DE MATCHUP ESPECÍFICO (SEU DECK VS DECK INIMIGO)
          ===================================================================== */}
      {viewSection === 'matchup_duel' && (
        <div className="tg-grid-layout">
          {/* Left Column: Tactical Blueprint to Beat This Opponent */}
          <div className="tg-panel">
            <div className="aaa-kicker">{activeMatchup.asymmetryHeadline}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h2 className="font-cinzel tg-panel-title">
                Como Vencer: {opponentProfile.deck.name}
              </h2>
              <span
                className="tg-favor-badge"
                style={{
                  borderColor: activeMatchup.favorabilityColor,
                  color: activeMatchup.favorabilityColor,
                }}
              >
                {activeMatchup.favorabilityLabel}
              </span>
            </div>

            {/* Stacking Rule Directive Banner */}
            <div className={`tg-stack-directive mode-${activeMatchup.stackingRuleMode}`}>
              <div className="tg-stack-directive-title">{activeMatchup.stackingRuleBadge}</div>
              <p>{activeMatchup.stackingRuleDetail}</p>
            </div>

            {/* General Tactics vs Enemy Composition */}
            <div className="tg-section-block">
              <h4 className="font-cinzel tg-sec-heading">
                I. Tática Geral & Como Explorar a Assimetria Inimiga
              </h4>
              <p>{activeMatchup.generalTactics}</p>
            </div>

            {/* Mulligan & Channeling Priority */}
            <div className="tg-section-block">
              <h4 className="font-cinzel tg-sec-heading">
                II. Mão Inicial (Mulligan) & Prioridade de Canalização
              </h4>
              <p>{activeMatchup.mulliganAndChannelGuide}</p>
            </div>

            {/* Critical Threat Turn & Enemy Traps */}
            <div className="tg-section-block warn-block">
              <h4 className="font-cinzel tg-sec-heading">
                III. Turno de Perigo & O Que Antecipar (Emboscadas / Área)
              </h4>
              <p>{activeMatchup.criticalThreatTurn}</p>
            </div>

            {/* Win Condition Path */}
            <div className="tg-section-block win-block">
              <h4 className="font-cinzel tg-sec-heading">
                IV. Caminho para a Vitória no Duelo
              </h4>
              <p>{activeMatchup.winConditionPath}</p>
            </div>
          </div>

          {/* Right Column: Priority Enemy Targets & Interactive Card Previews */}
          <div className="tg-panel">
            <div className="aaa-kicker">DOSSIÊ DE AMEAÇAS DO OPONENTE</div>
            <h2 className="font-cinzel tg-panel-title">
              Alvos Prioritários de {opponentProfile.deck.name}
            </h2>
            <p className="tg-panel-subtitle">
              Guarde seus feitiços de remoção, congelamento ou golpes de Alcance para neutralizar imediatamente estas cartas-chave do adversário:
            </p>

            <div className="tg-targets-list">
              {activeMatchup.priorityTargets.map(({ card, reason }) => (
                <div
                  key={card.id}
                  className="tg-target-row"
                  onClick={() => setInspectCard(card)}
                >
                  <div className="tg-target-art">
                    {card.imagePath && <img src={card.imagePath} alt={card.name} />}
                    <span className="tg-target-cost">{card.cost}⚡</span>
                  </div>
                  <div className="tg-target-info">
                    <div className="tg-target-name-line">
                      <strong className="font-cinzel" style={{ color: '#fde68a' }}>
                        {card.name}
                      </strong>
                      <span className="tg-target-type">
                        {DOMAIN_META[card.domain].icon} {CARD_TYPE_LABELS[card.type]}
                        {card.type === 'creature' ? ` • ${card.atk}/${card.hp} (ARM ${card.armor})` : ''}
                      </span>
                    </div>
                    <div className="tg-target-reason">{reason}</div>
                    <div className="tg-target-desc">{card.description}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Comparison of Structural Asymmetry */}
            <div className="tg-doctrine-box" style={{ marginTop: '1.1rem' }}>
              <div className="aaa-kicker">COMPARATIVO DIRETO DE COMPOSIÇÃO (100 CARTAS)</div>
              <div className="tg-compare-grid">
                <div>
                  <strong style={{ color: '#fef08a' }}>Seu Deck ({playerProfile.deck.name})</strong>
                  <div>• {playerProfile.counts.creature} Criaturas ({playerProfile.pcts.creature}%)</div>
                  <div>• {playerProfile.counts.spell} Feitiços ({playerProfile.pcts.spell}%)</div>
                  <div>• {playerProfile.counts.reaction} Reações ({playerProfile.pcts.reaction}%)</div>
                  <div>• {playerProfile.counts.relic} Relíquias ({playerProfile.pcts.relic}%)</div>
                </div>
                <div>
                  <strong style={{ color: '#fca5a5' }}>Inimigo ({opponentProfile.deck.name})</strong>
                  <div>• {opponentProfile.counts.creature} Criaturas ({opponentProfile.pcts.creature}%)</div>
                  <div>• {opponentProfile.counts.spell} Feitiços ({opponentProfile.pcts.spell}%)</div>
                  <div>• {opponentProfile.counts.reaction} Reações ({opponentProfile.pcts.reaction}%)</div>
                  <div>• {opponentProfile.counts.relic} Relíquias ({opponentProfile.pcts.relic}%)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: MATRIZ COMPLETA CONTRA TODOS OS OUTROS GRIMÓRIOS
          ===================================================================== */}
      {viewSection === 'matrix_all' && (
        <div className="tg-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <div className="aaa-kicker">TABELA TÁTICA COMPLETA DE CONFRONTOS</div>
              <h2 className="font-cinzel tg-panel-title">
                {playerProfile.deck.name} vs Todos os {allDecks.length - 1} Oponentes
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {(['all', 'red', 'blue', 'purple', 'green', 'gold'] as const).map((dom) => (
                <button
                  key={dom}
                  type="button"
                  className={`nav-tab-btn ${domainFilter === dom ? 'active' : ''}`}
                  style={{ padding: '0.3rem 0.65rem', fontSize: '0.72rem' }}
                  onClick={() => setDomainFilter(dom)}
                >
                  {dom === 'all' ? 'Todos' : `${DOMAIN_META[dom].icon} ${DOMAIN_META[dom].shortName}`}
                </button>
              ))}
            </div>
          </div>

          <div className="tg-matrix-table-wrap">
            <table className="tg-matrix-table">
              <thead>
                <tr>
                  <th>Oponente / Chefe</th>
                  <th>Assimetria Inimiga</th>
                  <th>Favorabilidade</th>
                  <th>Regra de Empilhamento (1x vs 3x)</th>
                  <th>Alvo Prioritário</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {allMatchupsList.map(({ deck, profile, analysis, bossUsingDeck }) => (
                  <tr
                    key={deck.id}
                    onClick={() => {
                      setSelectedOpponentDeckId(deck.id);
                      setViewSection('matchup_duel');
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <div style={{ fontWeight: 700, color: '#f8fafc' }}>
                        {deck.domains.map((d) => DOMAIN_META[d].icon).join('')} {deck.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                        {bossUsingDeck
                          ? `Ato ${bossUsingDeck.stage}: ${bossUsingDeck.name}`
                          : deck.subtitle}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.76rem', color: '#cbd5e1' }}>
                      {profile.counts.creature}C / {profile.counts.spell}M / {profile.counts.reaction}R /{' '}
                      {profile.counts.relic}Rel
                    </td>
                    <td>
                      <span
                        style={{
                          color: analysis.favorabilityColor,
                          fontWeight: 800,
                          fontSize: '0.76rem',
                        }}
                      >
                        {analysis.favorabilityLabel}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.75rem', color: '#fde68a' }}>
                      {analysis.stackingRuleBadge}
                    </td>
                    <td style={{ fontSize: '0.76rem', color: '#fca5a5' }}>
                      {analysis.priorityTargets[0]?.card.name ?? 'Campeão Rival'}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn-fantasy"
                        style={{ padding: '0.25rem 0.6rem', fontSize: '0.68rem' }}
                        onClick={(ev) => {
                          ev.stopPropagation();
                          setSelectedOpponentDeckId(deck.id);
                          setViewSection('matchup_duel');
                        }}
                      >
                        Ver Tática →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
          style={{ maxWidth: '1220px', width: '95vw', maxHeight: '90vh', overflowY: 'auto' }}
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </div>
      </div>
    );
  }

  return content;
};
