import { ALL_CARDS, CARDS_BY_ID } from '../data/cards';
import { CardDefinition, GameState } from '../types/game';

export interface PostMatchDossier {
  mvpCard: CardDefinition;
  mvpKicker: string;
  mvpReason: string;
  turnsPlayed: number;
  playerUnitsSummoned: number;
  playerSpellsAndReactions: number;
  playerDomainsInvoked: number;
  combatClashesCount: number;
  playerFinalHp: number;
  aiFinalHp: number;
}

export function computeMatchDossier(state: GameState): PostMatchDossier {
  let playerUnitsSummoned = 0;
  let playerSpellsAndReactions = 0;
  let playerDomainsInvoked = 0;
  let combatClashesCount = 0;

  const cardMentionScores = new Map<string, { score: number; summons: number; combatHits: number }>();

  const bumpCard = (card: CardDefinition, delta: number, isSummon = false, isCombat = false) => {
    const prev = cardMentionScores.get(card.id) ?? { score: 0, summons: 0, combatHits: 0 };
    cardMentionScores.set(card.id, {
      score: prev.score + delta,
      summons: prev.summons + (isSummon ? 1 : 0),
      combatHits: prev.combatHits + (isCombat ? 1 : 0),
    });
  };

  // 1. Score surviving player units on board (strong indicator of board dominance)
  const survivingBoardUnits = [
    ...(state.player.vanguardStacks ?? []).flat(),
    ...(state.player.rearguardStacks ?? []).flat(),
  ];
  for (const u of survivingBoardUnits) {
    if (u.isTrap) continue;
    const rarityBonus = u.card.rarity === 'legendary' ? 8 : u.card.rarity === 'rare' ? 4 : 2;
    const ascendedBonus = u.isAscended ? 7 : 0;
    bumpCard(u.card, 10 + u.currentAtk + rarityBonus + ascendedBonus, false, true);
  }

  // 2. Scan player's crypt for fallen heroes / spells cast
  for (const c of state.player.crypt) {
    const rarityBonus = c.rarity === 'legendary' ? 5 : c.rarity === 'rare' ? 3 : 1;
    bumpCard(c, 3 + rarityBonus);
  }

  // 3. Parse combatLog for exact counts & hero highlights
  const candidateCards = new Map<string, CardDefinition>();
  for (const u of survivingBoardUnits) candidateCards.set(u.card.id, u.card);
  for (const c of state.player.crypt) candidateCards.set(c.id, c);
  for (const c of state.player.hand) candidateCards.set(c.id, c);
  for (const c of state.player.channeledCards) candidateCards.set(c.id, c);

  for (const entry of state.combatLog) {
    if (entry.actor === 'player') {
      if (entry.category === 'summon') playerUnitsSummoned += 1;
      if (entry.category === 'spell') playerSpellsAndReactions += 1;
      if (entry.category === 'effect' && entry.message.includes('EXPANSÃO DE DOMÍNIO')) {
        playerDomainsInvoked += 1;
      }
    }
    if (entry.category === 'combat') {
      combatClashesCount += 1;
    }

    if (entry.actor === 'player' || entry.category === 'combat') {
      for (const card of candidateCards.values()) {
        if (entry.message.includes(card.name)) {
          if (entry.category === 'combat') {
            bumpCard(card, 6, false, true);
          } else if (entry.category === 'summon') {
            bumpCard(card, 4, true, false);
          } else if (entry.category === 'spell' || entry.category === 'effect') {
            bumpCard(card, 5, false, true);
          }
        }
      }
    }
  }

  let bestCard: CardDefinition | null = null;
  let bestStats = { score: -1, summons: 0, combatHits: 0 };

  for (const [cid, stats] of cardMentionScores.entries()) {
    const c = CARDS_BY_ID[cid];
    if (c && stats.score > bestStats.score) {
      bestCard = c;
      bestStats = stats;
    }
  }

  if (!bestCard) {
    bestCard =
      CARDS_BY_ID[state.player.avatarCardId] ??
      survivingBoardUnits[0]?.card ??
      state.player.hand[0] ??
      ALL_CARDS[0];
  }

  const survivedOnBoard = survivingBoardUnits.some((u) => u.card.id === bestCard!.id);
  const mvpKicker =
    state.winner === 'player' ? '🏅 CARTA MVP DO TRIUNFO' : '⚔️ DESTAQUE DE RESISTÊNCIA';

  let mvpReason = 'Protagonista tático nas trocas decisivas do duelo.';
  if (survivedOnBoard && bestStats.combatHits >= 2) {
    mvpReason = `Dominou o tabuleiro com ${bestStats.combatHits} participações decisivas em combate e permaneceu de pé no encerramento.`;
  } else if (survivedOnBoard) {
    mvpReason = 'Sustentou a linha de frente até o desfecho da batalha.';
  } else if (bestCard.type === 'spell' || bestCard.type === 'reaction') {
    mvpReason = 'Intervenção arcana de alto impacto nos momentos críticos da partida.';
  } else if (bestStats.combatHits >= 2) {
    mvpReason = `Participou de ${bestStats.combatHits} confrontos e efeitos chave antes de tombar com honra.`;
  }

  return {
    mvpCard: bestCard,
    mvpKicker,
    mvpReason,
    turnsPlayed: state.turn,
    playerUnitsSummoned,
    playerSpellsAndReactions,
    playerDomainsInvoked,
    combatClashesCount,
    playerFinalHp: Math.max(0, state.player.hp),
    aiFinalHp: Math.max(0, state.ai.hp),
  };
}
