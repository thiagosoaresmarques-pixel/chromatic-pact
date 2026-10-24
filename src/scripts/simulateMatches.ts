import fs from 'fs';
import path from 'path';
import { ALL_CARDS, CARDS_BY_ID } from '../data/cards';
import { PREBUILT_DECKS, CAMPAIGN_BOSSES } from '../data/decks';
import { createInitialGameState, endTurn } from '../engine/gameEngine';
import { runFullAiTurn } from '../engine/aiEngine';
import { CardDefinition, GameState } from '../types/game';

function resolveDeck(cardIds: string[]): CardDefinition[] {
  return cardIds.map((id) => {
    const c = CARDS_BY_ID[id];
    if (!c) throw new Error(`Missing card ID in deck: ${id}`);
    return c;
  });
}

function swapPerspective(state: GameState): GameState {
  // Allows running runFullAiTurn for 'player' by temporarily swapping player/ai roles
  const swapped: GameState = {
    ...state,
    activePlayer: 'ai',
    player: {
      ...state.ai,
      id: 'player',
      vanguard: state.ai.vanguard.map((u) => (u ? { ...u, owner: 'player' } : null)),
      rearguard: state.ai.rearguard.map((u) => (u ? { ...u, owner: 'player' } : null)),
    },
    ai: {
      ...state.player,
      id: 'ai',
      vanguard: state.player.vanguard.map((u) => (u ? { ...u, owner: 'ai' } : null)),
      rearguard: state.player.rearguard.map((u) => (u ? { ...u, owner: 'ai' } : null)),
    },
  };
  const afterAi = runFullAiTurn(swapped);
  return {
    ...afterAi,
    activePlayer: afterAi.phase === 'gameover' ? state.activePlayer : 'ai',
    winner:
      afterAi.winner === 'ai'
        ? 'player'
        : afterAi.winner === 'player'
        ? 'ai'
        : null,
    player: {
      ...afterAi.ai,
      id: 'player',
      vanguard: afterAi.ai.vanguard.map((u) => (u ? { ...u, owner: 'player' } : null)),
      rearguard: afterAi.ai.rearguard.map((u) => (u ? { ...u, owner: 'player' } : null)),
    },
    ai: {
      ...afterAi.player,
      id: 'ai',
      vanguard: afterAi.player.vanguard.map((u) => (u ? { ...u, owner: 'ai' } : null)),
      rearguard: afterAi.player.rearguard.map((u) => (u ? { ...u, owner: 'ai' } : null)),
    },
  };
}

function runAutomatedQA() {
  console.log('=== CHROMATIC PACT — AUTOMATED QA & SIMULATION ===');
  console.log(`Total Cards in Catalog: ${ALL_CARDS.length}`);

  const domainCounts: Record<string, number> = {};
  let missingImages = 0;
  for (const card of ALL_CARDS) {
    domainCounts[card.domain] = (domainCounts[card.domain] || 0) + 1;
    const relPath = card.imagePath.replace(/^\//, '');
    const fullImgPath = path.join(process.cwd(), 'public', relPath);
    if (!fs.existsSync(fullImgPath)) {
      console.error(`Missing image file for ${card.id}: ${fullImgPath}`);
      missingImages++;
    }
  }
  console.log('Cards per Domain:', domainCounts);
  console.log(`Missing Image Assets: ${missingImages}`);

  console.log(`\nValidating ${PREBUILT_DECKS.length} Prebuilt 40-Card Decks...`);
  for (const deck of PREBUILT_DECKS) {
    const resolved = resolveDeck(deck.cardIds);
    console.log(`  - [${deck.id}] ${deck.name}: ${resolved.length} cards (${deck.domains.join('/')})`);
    if (resolved.length !== 40) {
      throw new Error(`Deck ${deck.id} has ${resolved.length} cards instead of 40!`);
    }
  }

  console.log(`\nValidating ${CAMPAIGN_BOSSES.length} Campaign Bosses...`);
  for (const boss of CAMPAIGN_BOSSES) {
    if (!CARDS_BY_ID[boss.avatarCardId]) {
      throw new Error(`Boss ${boss.id} has invalid avatarCardId: ${boss.avatarCardId}`);
    }
    if (!PREBUILT_DECKS.find((d) => d.id === boss.deckId)) {
      throw new Error(`Boss ${boss.id} has invalid deckId: ${boss.deckId}`);
    }
    console.log(`  - Stage ${boss.stage}: ${boss.name} (${boss.startingHp} HP) -> Deck: ${boss.deckId}`);
  }

  console.log('\nRunning 8 AI vs AI Simulated Matches across all Prebuilt Decks...');
  for (let i = 0; i < PREBUILT_DECKS.length; i++) {
    const deckA = PREBUILT_DECKS[i];
    const deckB = PREBUILT_DECKS[(i + 1) % PREBUILT_DECKS.length];
    let state = createInitialGameState(resolveDeck(deckA.cardIds), resolveDeck(deckB.cardIds), {
      playerName: deckA.name,
      aiName: deckB.name,
    });

    let safetyTurns = 0;
    while (state.phase !== 'gameover' && safetyTurns < 60) {
      safetyTurns++;
      if (state.activePlayer === 'player') {
        state = swapPerspective(state);
        if (state.phase !== 'gameover' && state.activePlayer === 'player') {
          state = endTurn(state);
        }
      } else {
        state = runFullAiTurn(state);
        if (state.phase !== 'gameover' && state.activePlayer === 'ai') {
          state = endTurn(state);
        }
      }
    }

    const winnerName =
      state.winner === 'player'
        ? deckA.name
        : state.winner === 'ai'
        ? deckB.name
        : `Empate por Limite (${state.player.hp} vs ${state.ai.hp} HP)`;
    console.log(
      `  Match ${i + 1}: [${deckA.name}] vs [${deckB.name}] -> Winner: ${winnerName} in ${state.turn} turns (Final HP: ${state.player.hp} vs ${state.ai.hp})`
    );
  }

  console.log('\nALL QA CHECKS & SIMULATIONS PASSED!');
}

runAutomatedQA();
