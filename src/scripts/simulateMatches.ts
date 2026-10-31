import fs from 'fs';
import path from 'path';
import { ALL_CARDS, CARDS_BY_ID } from '../data/cards';
import { PREBUILT_DECKS, CAMPAIGN_BOSSES } from '../data/decks';
import {
  applyEquippedRelicToModifiers,
  SOVEREIGN_RELICS,
} from '../data/sovereignRelics';
import {
  buildDraftGauntletBoss,
  generateDraftRoundBuckets,
  generateSovereignDraftCandidates,
} from '../data/vaeloriaDraftData';
import { decodeDeckCode, encodeDeckCode } from '../utils/portableCodex';
import {
  craftSingleCardCopy,
  resolvePackDuplicatesWithShards,
  salvageAllExcessDuplicates,
} from '../utils/craftingEngine';
import {
  buildRiftBattleEncounter,
  FRACTURE_RIFTS,
  getWeeklyFeaturedRift,
} from '../data/fractureRiftsData';
import { computeMatchDossier } from '../utils/matchStatsTracker';
import { createInitialGameState, endTurn } from '../engine/gameEngine';
import { runFullAiTurn } from '../engine/aiEngine';
import {
  ArenaWeatherType,
  CardDefinition,
  GameState,
  PlayerState,
} from '../types/game';

function resolveDeck(cardIds: string[]): CardDefinition[] {
  return cardIds.map((id) => {
    const c = CARDS_BY_ID[id];
    if (!c) throw new Error(`Missing card ID in deck: ${id}`);
    return c;
  });
}

function reownPlayerSide(side: PlayerState, newOwner: 'player' | 'ai'): PlayerState {
  return {
    ...side,
    id: newOwner,
    vanguard: side.vanguard.map((u) => (u ? { ...u, owner: newOwner } : null)),
    rearguard: side.rearguard.map((u) => (u ? { ...u, owner: newOwner } : null)),
    vanguardStacks: (side.vanguardStacks ?? side.vanguard.map((u) => (u ? [u] : []))).map(
      (stack) => stack.map((u) => ({ ...u, owner: newOwner }))
    ),
    rearguardStacks: (side.rearguardStacks ?? side.rearguard.map((u) => (u ? [u] : []))).map(
      (stack) => stack.map((u) => ({ ...u, owner: newOwner }))
    ),
  };
}

function flipSideOwner<T extends 'player' | 'ai' | 'system'>(owner: T): T {
  if (owner === 'player') return 'ai' as T;
  if (owner === 'ai') return 'player' as T;
  return owner;
}

function swapPerspectiveAndRunAi(state: GameState): GameState {
  // Temporarily swap player/ai roles (including Opção C stacks & Domain Expansion) so runFullAiTurn plays for 'player'
  const swapped: GameState = {
    ...state,
    activePlayer: 'ai',
    initiativePlayer: state.initiativePlayer
      ? flipSideOwner(state.initiativePlayer)
      : undefined,
    domainExpansion: state.domainExpansion
      ? {
          ...state.domainExpansion,
          owner: flipSideOwner(state.domainExpansion.owner),
          clashRival: state.domainExpansion.clashRival
            ? {
                ...state.domainExpansion.clashRival,
                owner: flipSideOwner(state.domainExpansion.clashRival.owner),
              }
            : null,
        }
      : null,
    weather: state.weather
      ? {
          ...state.weather,
          owner: flipSideOwner(state.weather.owner),
        }
      : null,
    player: reownPlayerSide(state.ai, 'player'),
    ai: reownPlayerSide(state.player, 'ai'),
  };

  const afterAi = runFullAiTurn(swapped);

  return {
    ...afterAi,
    activePlayer: afterAi.phase === 'gameover' ? state.activePlayer : 'ai',
    initiativePlayer: afterAi.initiativePlayer
      ? flipSideOwner(afterAi.initiativePlayer)
      : undefined,
    domainExpansion: afterAi.domainExpansion
      ? {
          ...afterAi.domainExpansion,
          owner: flipSideOwner(afterAi.domainExpansion.owner),
          clashRival: afterAi.domainExpansion.clashRival
            ? {
                ...afterAi.domainExpansion.clashRival,
                owner: flipSideOwner(afterAi.domainExpansion.clashRival.owner),
              }
            : null,
        }
      : null,
    weather: afterAi.weather
      ? {
          ...afterAi.weather,
          owner: flipSideOwner(afterAi.weather.owner),
        }
      : null,
    winner:
      afterAi.winner === 'ai'
        ? 'player'
        : afterAi.winner === 'player'
        ? 'ai'
        : null,
    player: reownPlayerSide(afterAi.ai, 'player'),
    ai: reownPlayerSide(afterAi.player, 'ai'),
  };
}

function runSingleAiDuel(state: GameState, maxSafetySteps = 80): GameState {
  let current = state;
  let safetySteps = 0;
  while (current.phase !== 'gameover' && safetySteps < maxSafetySteps) {
    safetySteps++;
    if (current.activePlayer === 'player') {
      current = swapPerspectiveAndRunAi(current);
      if (current.phase !== 'gameover' && current.activePlayer === 'player') {
        current = endTurn(current);
      }
    } else {
      current = runFullAiTurn(current);
      if (current.phase !== 'gameover' && current.activePlayer === 'ai') {
        current = endTurn(current);
      }
    }
  }
  return current;
}

function runAutomatedQA() {
  console.log('=== CHROMATIC PACT — AUTOMATED QA & SIMULATION SUITE ===');
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
  if (missingImages > 0) {
    throw new Error(`Found ${missingImages} missing card image assets!`);
  }

  console.log(`\nValidating ${PREBUILT_DECKS.length} Prebuilt Grimoires...`);
  for (const deck of PREBUILT_DECKS) {
    const resolved = resolveDeck(deck.cardIds);
    if (resolved.length < 40) {
      throw new Error(`Deck ${deck.id} has only ${resolved.length} cards (minimum 40)!`);
    }
  }
  console.log(`  OK — All ${PREBUILT_DECKS.length} Prebuilt Grimoires resolved cleanly.`);

  console.log(`\nValidating ${CAMPAIGN_BOSSES.length} Campaign Bosses...`);
  for (const boss of CAMPAIGN_BOSSES) {
    if (!CARDS_BY_ID[boss.avatarCardId]) {
      throw new Error(`Boss ${boss.id} has invalid avatarCardId: ${boss.avatarCardId}`);
    }
    if (!PREBUILT_DECKS.find((d) => d.id === boss.deckId)) {
      throw new Error(`Boss ${boss.id} has invalid deckId: ${boss.deckId}`);
    }
  }
  console.log(`  OK — All ${CAMPAIGN_BOSSES.length} Campaign Bosses linked cleanly.`);

  console.log(`\nValidating Portable Deck Code (CPDECK1-...) Codec...`);
  const sampleDeck = PREBUILT_DECKS[0];
  const encodedCode = encodeDeckCode(sampleDeck.name, sampleDeck.cardIds);
  const decodedDeck = decodeDeckCode(encodedCode);
  if (!decodedDeck.ok || decodedDeck.data.cardIds.length !== sampleDeck.cardIds.length) {
    throw new Error(
      `Deck code roundtrip mismatch: ${decodedDeck.ok ? decodedDeck.data.cardIds.length : decodedDeck.error}`
    );
  }
  console.log(
    `  OK — Portable Deck Code roundtrip verified (${encodedCode.length} chars for ${decodedDeck.data.cardIds.length} cards).`
  );

  console.log(`\nValidating ${SOVEREIGN_RELICS.length} Sovereign Crown Relics...`);
  if (SOVEREIGN_RELICS.length !== 12) {
    throw new Error(`Expected 12 Sovereign Relics, got ${SOVEREIGN_RELICS.length}`);
  }
  for (const relic of SOVEREIGN_RELICS) {
    const mods = applyEquippedRelicToModifiers(null, relic.id);
    if (!mods?.equippedRelic || mods.equippedRelic.id !== relic.id) {
      throw new Error(`Failed to apply Sovereign Relic: ${relic.id}`);
    }
  }
  console.log(`  OK — All 12 Sovereign Crown Relics validated.`);

  console.log(`\nValidating Draft Crucible ("Crisol dos Cinco Selos") Forge...`);
  const sovCandidates = generateSovereignDraftCandidates();
  if (sovCandidates.length !== 3) {
    throw new Error(`Expected 3 Sovereign candidates, got ${sovCandidates.length}`);
  }
  const chosenSov = sovCandidates[0];
  const chosenSovDomain = CARDS_BY_ID[chosenSov]?.domain ?? 'red';
  const draftedIds: string[] = [];
  for (let round = 1; round <= 20; round++) {
    const buckets = generateDraftRoundBuckets(chosenSovDomain, round, draftedIds);
    if (buckets.length !== 3) {
      throw new Error(`Round ${round} generated ${buckets.length} buckets instead of 3`);
    }
    draftedIds.push(...buckets[0].cardIds);
  }
  if (draftedIds.length !== 40) {
    throw new Error(`Expected 40 drafted cards after 20 rounds, got ${draftedIds.length}`);
  }
  console.log(
    `  OK — Draft Crucible generated 40 synergistic cards led by [${CARDS_BY_ID[chosenSov]?.name}].`
  );

  const weatherCycle: ArenaWeatherType[] = [
    'ash_storm',
    'astral_blizzard',
    'umbral_eclipse',
    'sylvan_monsoon',
    'solar_zenith',
    'astral_convergence',
  ];

  const matchCount = Math.min(8, PREBUILT_DECKS.length);
  console.log(
    `\nRunning ${matchCount} AI vs AI Simulated Matches (with Weather & Sovereign Relics)...`
  );
  for (let i = 0; i < matchCount; i++) {
    const deckA = PREBUILT_DECKS[i];
    const deckB = PREBUILT_DECKS[(i + 3) % PREBUILT_DECKS.length];
    const relic = SOVEREIGN_RELICS[i % SOVEREIGN_RELICS.length];
    const weatherType = weatherCycle[i % weatherCycle.length];

    const mods = applyEquippedRelicToModifiers(
      {
        provinceId: `sim_prov_${i}`,
        provinceName: 'Campo Planar de Testes',
        provinceDomain: relic.domain,
        isDefensiveSiege: false,
        isCapitalSiege: false,
        playerBonusHp: 0,
        playerBonusEssence: 0,
        enemyOpeningDamage: 0,
        vanguardArmorBonus: 0,
        relicDiscount: false,
        dragonSkyBonus: false,
        legendaryWheelBonus: false,
        bannerSummary: 'Simulação QA',
        initialWeather: weatherType,
      },
      relic.id
    );

    const initialState = createInitialGameState(
      resolveDeck(deckA.cardIds),
      resolveDeck(deckB.cardIds),
      {
        playerName: deckA.name,
        aiName: deckB.name,
        conquestModifiers: mods,
      }
    );

    const finalState = runSingleAiDuel(initialState, 70);
    const winnerName =
      finalState.winner === 'player'
        ? deckA.name
        : finalState.winner === 'ai'
        ? deckB.name
        : `Limite de Turnos (${finalState.player.hp} vs ${finalState.ai.hp} HP)`;
    console.log(
      `  Match ${i + 1}: [${deckA.name} + ${relic.icon} ${relic.name}] vs [${deckB.name}] (${weatherType}) -> ${winnerName} in ${finalState.turn} turns (HP: ${finalState.player.hp} vs ${finalState.ai.hp})`
    );
  }

  console.log(`\nRunning Draft Crucible 40-Card Gauntlet Simulation...`);
  const gauntletEncounter = buildDraftGauntletBoss(6);
  const gauntletBossDeck =
    PREBUILT_DECKS.find((d) => d.id === gauntletEncounter.boss.deckId) ?? PREBUILT_DECKS[0];
  const draftState = createInitialGameState(
    resolveDeck([chosenSov, ...draftedIds.filter((id) => id !== chosenSov)].slice(0, 40)),
    resolveDeck(gauntletBossDeck.cardIds),
    {
      playerName: 'Campeão do Crisol',
      aiName: gauntletEncounter.boss.name,
      aiStartingHp: gauntletEncounter.boss.startingHp,
      bossId: gauntletEncounter.boss.id,
      conquestModifiers: applyEquippedRelicToModifiers(
        gauntletEncounter.modifiers,
        SOVEREIGN_RELICS[11].id
      ),
    }
  );
  const finalDraftDuel = runSingleAiDuel(draftState, 70);
  console.log(
    `  Draft Gauntlet Final: [Campeão do Crisol] vs [${gauntletEncounter.boss.name}] -> Turn ${finalDraftDuel.turn} (HP: ${finalDraftDuel.player.hp} vs ${finalDraftDuel.ai.hp})`
  );

  console.log(`\nValidating Astral Shards Forge & Duplicate Salvage Engine...`);
  const legendarySample = ALL_CARDS.find((c) => c.rarity === 'legendary')!;
  const commonSample = ALL_CARDS.find((c) => c.rarity === 'common')!;
  const packResolution = resolvePackDuplicatesWithShards(
    { [legendarySample.id]: 1, [commonSample.id]: 2 },
    {},
    [legendarySample, commonSample, commonSample]
  );
  if (packResolution.shardsEarned !== 125) {
    throw new Error(
      `Expected 125 Astral Shards from 1 excess Legendary (120) + 1 excess Common (5), got ${packResolution.shardsEarned}`
    );
  }
  const craftAttempt = craftSingleCardCopy(legendarySample, 0, {}, 500);
  if (!craftAttempt.ok || craftAttempt.nextAstralShards !== 140) {
    throw new Error(`Expected crafting Legendary to cost 360 shards and leave 140`);
  }
  const salvageRes = salvageAllExcessDuplicates([legendarySample.id], { [legendarySample.id]: 2 });
  if (salvageRes.totalShardsEarned !== 240 || salvageRes.cardsSalvagedCount !== 2) {
    throw new Error(`Expected salvaging 2 excess legendaries to yield 240 shards`);
  }
  console.log(
    `  OK — Astral Shards Forge verified (+125 shards on pack duplicates, -360 craft Legendary, +240 salvage).`
  );

  console.log(
    `\nRunning 6 Fracture Rift Mutator Simulations (Weekly Featured: ${getWeeklyFeaturedRift().name})...`
  );
  for (let rIdx = 0; rIdx < FRACTURE_RIFTS.length; rIdx++) {
    const rift = FRACTURE_RIFTS[rIdx];
    const { boss, modifiers } = buildRiftBattleEncounter(rift.id);
    const challengerDeck =
      PREBUILT_DECKS.find((d) => d.id === boss.deckId) ?? PREBUILT_DECKS[0];
    const playerDeck = PREBUILT_DECKS[(rIdx + 2) % PREBUILT_DECKS.length];

    const riftInitialState = createInitialGameState(
      resolveDeck(playerDeck.cardIds),
      resolveDeck(challengerDeck.cardIds),
      {
        playerName: playerDeck.name,
        aiName: boss.name,
        aiStartingHp: boss.startingHp,
        bossId: boss.id,
        conquestModifiers: modifiers,
      }
    );

    if (rift.id === 'glass_thrones' && (riftInitialState.player.hp !== 20 || riftInitialState.ai.hp !== 20)) {
      throw new Error(`Glass Thrones failed to enforce 20 HP on both Sovereigns`);
    }
    if (rift.id === 'astral_torrent' && riftInitialState.player.maxEssence !== 6) {
      throw new Error(`Astral Torrent failed to start at 6 maxEssence`);
    }

    const riftFinal = runSingleAiDuel(riftInitialState, 65);
    const dossier = computeMatchDossier(riftFinal);
    if (!dossier.mvpCard || !dossier.mvpCard.name) {
      throw new Error(`Post-match dossier failed to select MVP card for rift ${rift.id}`);
    }
    console.log(
      `  Rift ${rIdx + 1}/${FRACTURE_RIFTS.length} [${rift.icon} ${rift.name}]: Turn ${riftFinal.turn} (HP: ${riftFinal.player.hp} vs ${riftFinal.ai.hp}) | MVP: [${dossier.mvpCard.name}]`
    );
  }

  console.log('\nALL QA CHECKS & SIMULATIONS PASSED!');
}

runAutomatedQA();
