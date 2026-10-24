import { ALL_CARDS } from '../src/data/cards';
import { PREBUILT_DECKS } from '../src/data/decks';
import { createInitialGameState } from '../src/engine/gameEngine';
import { runFullTurnForActor } from '../src/engine/aiEngine';
import { CardDefinition, Domain } from '../src/types/game';

const cardMap = new Map<string, CardDefinition>();
for (const c of ALL_CARDS) {
  cardMap.set(c.id, c);
}

function resolveDeckCards(cardIds: string[]): CardDefinition[] {
  const cards: CardDefinition[] = [];
  for (const id of cardIds) {
    const found = cardMap.get(id);
    if (found) {
      cards.push(found);
    } else {
      console.warn(`Missing card ID in deck: ${id}`);
    }
  }
  return cards;
}

function simulateSingleMatch(
  p1Cards: CardDefinition[],
  p2Cards: CardDefinition[],
  p1Name: string,
  p2Name: string
): { winner: 'player' | 'ai'; turns: number } {
  let state = createInitialGameState(p1Cards, p2Cards, {
    playerName: p1Name,
    aiName: p2Name,
  });

  let maxHalfTurns = 80; // up to 40 full rounds
  while (state.phase !== 'gameover' && maxHalfTurns > 0) {
    maxHalfTurns -= 1;
    const active = state.activePlayer;
    state = runFullTurnForActor(state, active);
  }

  if (state.winner === 'player' || state.winner === 'ai') {
    return { winner: state.winner, turns: state.turn };
  }

  // Tiebreaker by remaining HP if turn cap reached
  if (state.player.hp !== state.ai.hp) {
    return {
      winner: state.player.hp > state.ai.hp ? 'player' : 'ai',
      turns: state.turn,
    };
  }
  return { winner: 'ai', turns: state.turn };
}

const GAMES_PER_DIRECTED_PAIR = Number(process.env.GAMES_PER_PAIR ?? 3);

function setDeterministicSeed(seed: number) {
  let a = seed >>> 0;
  Math.random = () => {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function runBenchmark() {
  const startTime = Date.now();
  const deckCardsCache = new Map<string, CardDefinition[]>();
  for (const d of PREBUILT_DECKS) {
    deckCardsCache.set(d.id, resolveDeckCards(d.cardIds));
  }

  const deckStats: Record<
    string,
    {
      id: string;
      name: string;
      domains: Domain[];
      wins: number;
      losses: number;
      p1Wins: number;
      p1Games: number;
      p2Wins: number;
      p2Games: number;
    }
  > = {};

  for (const d of PREBUILT_DECKS) {
    deckStats[d.id] = {
      id: d.id,
      name: d.name,
      domains: d.domains,
      wins: 0,
      losses: 0,
      p1Wins: 0,
      p1Games: 0,
      p2Wins: 0,
      p2Games: 0,
    };
  }

  const domainStats: Record<
    Exclude<Domain, 'neutral'>,
    { wins: number; games: number; monoWins: number; monoGames: number }
  > = {
    red: { wins: 0, games: 0, monoWins: 0, monoGames: 0 },
    blue: { wins: 0, games: 0, monoWins: 0, monoGames: 0 },
    purple: { wins: 0, games: 0, monoWins: 0, monoGames: 0 },
    green: { wins: 0, games: 0, monoWins: 0, monoGames: 0 },
    gold: { wins: 0, games: 0, monoWins: 0, monoGames: 0 },
  };

  let totalGames = 0;
  let totalP1Wins = 0;
  let totalTurns = 0;

  for (let i = 0; i < PREBUILT_DECKS.length; i++) {
    for (let j = 0; j < PREBUILT_DECKS.length; j++) {
      if (i === j) continue;
      const deckA = PREBUILT_DECKS[i];
      const deckB = PREBUILT_DECKS[j];
      const cardsA = deckCardsCache.get(deckA.id)!;
      const cardsB = deckCardsCache.get(deckB.id)!;

      for (let g = 0; g < GAMES_PER_DIRECTED_PAIR; g++) {
        setDeterministicSeed((i + 1) * 100003 + (j + 1) * 1009 + (g + 1) * 37);
        const res = simulateSingleMatch(cardsA, cardsB, deckA.name, deckB.name);
        totalGames += 1;
        totalTurns += res.turns;

        deckStats[deckA.id].p1Games += 1;
        deckStats[deckB.id].p2Games += 1;

        const aWon = res.winner === 'player';
        if (aWon) {
          totalP1Wins += 1;
          deckStats[deckA.id].wins += 1;
          deckStats[deckA.id].p1Wins += 1;
          deckStats[deckB.id].losses += 1;
        } else {
          deckStats[deckB.id].wins += 1;
          deckStats[deckB.id].p2Wins += 1;
          deckStats[deckA.id].losses += 1;
        }

        // Credit domain stats (for non-overlapping domains or all domains in deck)
        for (const dom of deckA.domains) {
          if (dom === 'neutral') continue;
          domainStats[dom].games += 1;
          if (aWon) domainStats[dom].wins += 1;
          if (deckA.domains.length === 1) {
            domainStats[dom].monoGames += 1;
            if (aWon) domainStats[dom].monoWins += 1;
          }
        }
        for (const dom of deckB.domains) {
          if (dom === 'neutral') continue;
          domainStats[dom].games += 1;
          if (!aWon) domainStats[dom].wins += 1;
          if (deckB.domains.length === 1) {
            domainStats[dom].monoGames += 1;
            if (!aWon) domainStats[dom].monoWins += 1;
          }
        }
      }
    }
  }

  const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n=============================================================`);
  console.log(`CHROMATIC PACT — AI vs AI BALANCE SIMULATION (${totalGames} games in ${elapsedSec}s)`);
  console.log(`Average Game Length: ${(totalTurns / totalGames).toFixed(2)} turns`);
  console.log(
    `Turn Order Balance: P1 Win Rate = ${((totalP1Wins / totalGames) * 100).toFixed(2)}% | P2 Win Rate = ${(
      ((totalGames - totalP1Wins) / totalGames) *
      100
    ).toFixed(2)}%`
  );
  console.log(`=============================================================\n`);

  console.log(`--- DOMAIN WIN RATES (Target: 45.0% - 55.0%) ---`);
  for (const dom of ['red', 'blue', 'purple', 'green', 'gold'] as const) {
    const st = domainStats[dom];
    const wr = ((st.wins / st.games) * 100).toFixed(2);
    const monoWr = ((st.monoWins / st.monoGames) * 100).toFixed(2);
    console.log(
      `${dom.toUpperCase().padEnd(8)} | Overall WR: ${wr}% (${st.wins}/${st.games}) | Mono-Deck WR: ${monoWr}% (${st.monoWins}/${st.monoGames})`
    );
  }

  console.log(`\n--- ALL 30 PREBUILT DECKS WIN RATES ---`);
  const sortedDecks = Object.values(deckStats).sort(
    (a, b) => b.wins / (b.wins + b.losses) - a.wins / (a.wins + a.losses)
  );
  for (const d of sortedDecks) {
    const games = d.wins + d.losses;
    const wr = ((d.wins / games) * 100).toFixed(2);
    const p1Wr = ((d.p1Wins / d.p1Games) * 100).toFixed(1);
    const p2Wr = ((d.p2Wins / d.p2Games) * 100).toFixed(1);
    const status =
      Number(wr) >= 45 && Number(wr) <= 55 ? 'OK' : Number(wr) > 55 ? 'HIGH' : 'LOW';
    console.log(
      `[${status.padEnd(4)}] ${d.id.padEnd(30)} | WR: ${wr.padStart(6)}% (${String(d.wins).padStart(3)}/${games}) | P1: ${p1Wr}% | P2: ${p2Wr}% | Domains: ${d.domains.join(',')}`
    );
  }
}

runBenchmark();
