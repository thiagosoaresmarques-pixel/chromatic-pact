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
import {
  VAELORIA_CARDINAL_REALMS,
  VAELORIA_DEEP_FRONTIERS,
  VAELORIA_REALM_ORDER,
  VAELORIA_REGIONAL_MAPS,
  STAGE_REGIONAL_COORDS,
  PROVINCE_REGIONAL_COORDS,
} from '../data/vaeloriaMultimapData';
import {
  VAELORIA_WORLD_MAP_IMAGE,
  resolveStageMapNode,
} from '../data/vaeloriaMapData';
import {
  CONQUEST_CRISES,
  CONQUEST_FACTION_ORDER,
  CONQUEST_PROVINCES,
  CONQUEST_PROVINCES_BY_ID,
  PROVINCE_BUILDING_ORDER,
  computeEmpireSupplyStatus,
  getConquestMapGeometries,
} from '../data/vaeloriaConquestData';
import {
  getLandmarkEventDef,
  resolveLandmarkChoicePreview,
} from '../data/vaeloriaOverworldEvents';
import {
  AI_LEAGUE_SUMMARY,
  AI_LEARNED_PROFILES,
} from '../data/aiLearnedProfiles';
import { computeMatchDossier } from '../utils/matchStatsTracker';
import { createInitialGameState, endTurn } from '../engine/gameEngine';
import {
  executeAiMulligan,
  runFullTurnForActor,
} from '../engine/aiEngine';
import {
  ArenaWeatherType,
  CardDefinition,
  GameState,
} from '../types/game';

function resolveDeck(cardIds: string[]): CardDefinition[] {
  return cardIds.map((id) => {
    const c = CARDS_BY_ID[id];
    if (!c) throw new Error(`Missing card ID in deck: ${id}`);
    return c;
  });
}

function runSingleAiDuel(state: GameState, maxSafetySteps = 80): GameState {
  let current = executeAiMulligan(state, 'player');
  current = executeAiMulligan(current, 'ai');

  let safetySteps = 0;
  while (current.phase !== 'gameover' && safetySteps < maxSafetySteps) {
    safetySteps++;
    const actor = current.activePlayer;
    current = runFullTurnForActor(current, actor);
    if (current.phase !== 'gameover' && current.activePlayer === actor) {
      current = endTurn(current);
    }
  }
  return current;
}

function runAutomatedQA() {
  console.log('=== CHROMATIC PACT — AUTOMATED QA & SIMULATION SUITE (5-WAVE EXPANSION) ===');
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

  // =========================================================================
  // WAVE 1 QA: 13-Map Tri-Scale Atlas (1 World + 6 Cardinal + 6 Deep Frontiers)
  // =========================================================================
  console.log('\n[Wave 1] Validating 13-Map Tri-Scale Atlas & Bidirectional Portals...');
  if (
    VAELORIA_CARDINAL_REALMS.length !== 6 ||
    VAELORIA_DEEP_FRONTIERS.length !== 6 ||
    VAELORIA_REALM_ORDER.length !== 12
  ) {
    throw new Error(`Expected 6 Cardinal + 6 Deep Frontiers = 12 Realms, got ${VAELORIA_REALM_ORDER.length}`);
  }
  const worldMapFull = path.join(process.cwd(), 'public', VAELORIA_WORLD_MAP_IMAGE.replace(/^\//, ''));
  if (!fs.existsSync(worldMapFull)) {
    throw new Error(`Missing World Map image: ${worldMapFull}`);
  }
  let totalLandmarksCount = 0;
  for (const realmId of VAELORIA_REALM_ORDER) {
    const def = VAELORIA_REGIONAL_MAPS[realmId];
    if (!def) throw new Error(`Missing regional map def for ${realmId}`);
    const mapFile = path.join(process.cwd(), 'public', def.imagePath.replace(/^\//, ''));
    if (!fs.existsSync(mapFile)) {
      throw new Error(`Missing map image for realm ${realmId}: ${mapFile}`);
    }
    if (def.portals.length < 2) {
      throw new Error(`Realm ${realmId} has fewer than 2 portals`);
    }
    for (const portal of def.portals) {
      const targetDef = VAELORIA_REGIONAL_MAPS[portal.targetRealm];
      if (!targetDef) throw new Error(`Invalid portal targetRealm ${portal.targetRealm} in ${realmId}`);
      const hasReturn = targetDef.portals.some((p) => p.targetRealm === realmId);
      if (!hasReturn) {
        throw new Error(`Asymmetric portal: ${realmId} -> ${portal.targetRealm} has no return portal!`);
      }
    }
    totalLandmarksCount += def.localLandmarks.length;
  }
  console.log(
    `  OK — All 13 high-res map assets verified, bidirectional portals intact, ${totalLandmarksCount} Overworld landmarks registered.`
  );

  // =========================================================================
  // WAVE 2 QA: 48-Province Conquest 2.0, BFS Supply Network, 5 Buildings, 8 Crises
  // =========================================================================
  console.log('\n[Wave 2] Validating 48-Province Conquest Graph, Voronoi Silhouettes & BFS Supply...');
  if (CONQUEST_PROVINCES.length !== 48) {
    throw new Error(`Expected 48 Conquest provinces, got ${CONQUEST_PROVINCES.length}`);
  }
  if (PROVINCE_BUILDING_ORDER.length !== 5) {
    throw new Error(`Expected 5 Province Buildings, got ${PROVINCE_BUILDING_ORDER.length}`);
  }
  if (CONQUEST_CRISES.length !== 8) {
    throw new Error(`Expected 8 Conquest Crises, got ${CONQUEST_CRISES.length}`);
  }

  for (const prov of CONQUEST_PROVINCES) {
    if (!PROVINCE_REGIONAL_COORDS[prov.id]) {
      throw new Error(`Province ${prov.id} missing PROVINCE_REGIONAL_COORDS entry`);
    }
    for (const nId of prov.neighbors) {
      const neighbor = CONQUEST_PROVINCES_BY_ID[nId];
      if (!neighbor) {
        throw new Error(`Province ${prov.id} references unknown neighbor ${nId}`);
      }
      if (!neighbor.neighbors.includes(prov.id)) {
        throw new Error(`Asymmetric province neighbor edge: ${prov.id} -> ${nId}`);
      }
    }
  }

  const worldGeom = getConquestMapGeometries();
  if (Object.keys(worldGeom.provinces).length !== 48) {
    throw new Error(
      `Expected 48 Voronoi SVG paths, got ${Object.keys(worldGeom.provinces).length}`
    );
  }
  for (const prov of CONQUEST_PROVINCES) {
    const g = worldGeom.provinces[prov.id];
    if (!g || !g.svgPath || g.svgPath.length < 10) {
      throw new Error(`Empty Voronoi SVG path for province ${prov.id}`);
    }
  }

  const defaultOwners: Record<string, (typeof CONQUEST_FACTION_ORDER)[number]> = {};
  for (const p of CONQUEST_PROVINCES) defaultOwners[p.id] = p.initialOwner;
  for (const fac of CONQUEST_FACTION_ORDER) {
    const supply = computeEmpireSupplyStatus(fac, defaultOwners, {});
    if (supply.isolatedIds.size > 0) {
      throw new Error(
        `Faction ${fac} starts with isolated provinces at campaign start: ${Array.from(supply.isolatedIds).join(', ')}`
      );
    }
  }
  // Test artificial enclave pocket isolation detection
  const deepPyrosProv = CONQUEST_PROVINCES.find(
    (p) => p.frontierGroup === 'underforge' && !p.isCapital
  )!;
  const pocketOwners = { ...defaultOwners, [deepPyrosProv.id]: 'veridia' as const };
  const veridiaPocketSupply = computeEmpireSupplyStatus('veridia', pocketOwners, {});
  if (!veridiaPocketSupply.isolatedIds.has(deepPyrosProv.id)) {
    throw new Error('BFS Supply Network failed to flag disconnected enclave pocket as isolated!');
  }
  console.log(
    '  OK — All 48 provinces symmetric, 48 Voronoi paths valid, 5 buildings & 8 crises active, BFS logistics verified.'
  );

  // =========================================================================
  // WAVE 3 QA: Act VII (32 Bosses) & 72 Overworld Landmarks + Choice C
  // =========================================================================
  console.log('\n[Wave 3] Validating 32 Campaign Bosses (Acts I-VII) & 72 Overworld Events...');
  if (CAMPAIGN_BOSSES.length !== 32) {
    throw new Error(`Expected 32 Campaign Bosses, got ${CAMPAIGN_BOSSES.length}`);
  }
  for (const boss of CAMPAIGN_BOSSES) {
    if (!CARDS_BY_ID[boss.avatarCardId]) {
      throw new Error(`Boss ${boss.id} has invalid avatarCardId: ${boss.avatarCardId}`);
    }
    if (!PREBUILT_DECKS.find((d) => d.id === boss.deckId)) {
      throw new Error(`Boss ${boss.id} has invalid deckId: ${boss.deckId}`);
    }
    const worldNode = resolveStageMapNode('campaign', boss.id, boss.stage);
    if (!worldNode) {
      throw new Error(`Missing world map stage node for stage ${boss.stage}`);
    }
    if (!STAGE_REGIONAL_COORDS[boss.id]) {
      throw new Error(`Missing STAGE_REGIONAL_COORDS for ${boss.id}`);
    }
  }

  if (totalLandmarksCount !== 72) {
    throw new Error(`Expected 72 Overworld landmarks across 12 realms, got ${totalLandmarksCount}`);
  }
  for (const realmId of VAELORIA_REALM_ORDER) {
    const rDef = VAELORIA_REGIONAL_MAPS[realmId];
    for (const lm of rDef.localLandmarks) {
      const ev = getLandmarkEventDef(realmId, lm);
      if (rDef.tier === 'deep_frontier') {
        const choiceC = ev.choices.find((c) => c.id === 'choice_c');
        if (!choiceC) {
          throw new Error(`Deep Frontier landmark ${lm.id} in ${realmId} missing choice_c!`);
        }
        const previewC = resolveLandmarkChoicePreview(ev, choiceC, 'campaign');
        if (previewC.shardsDelta <= 0 && !previewC.recruitedCard) {
          throw new Error(`Deep Frontier choice_c on ${lm.id} granted neither shards nor card!`);
        }
      }
    }
  }
  console.log(
    '  OK — All 32 Campaign Bosses & 72 Overworld Landmarks (including Deep Frontier Choice C) verified.'
  );

  // =========================================================================
  // WAVE 4 & 5 QA: 30 Prebuilt Decks & Learned AI Profiles / Extracted Combos
  // =========================================================================
  console.log(`\n[Wave 4 & 5] Validating ${PREBUILT_DECKS.length} Prebuilt Grimoires & Learned AI Profiles...`);
  for (const deck of PREBUILT_DECKS) {
    const resolved = resolveDeck(deck.cardIds);
    if (resolved.length < 40) {
      throw new Error(`Deck ${deck.id} has only ${resolved.length} cards (minimum 40)!`);
    }
    const learned = AI_LEARNED_PROFILES[deck.id];
    if (!learned) {
      throw new Error(`Missing AI_LEARNED_PROFILES entry for deck ${deck.id}`);
    }
    if (learned.discoveredCombos.length < 3) {
      throw new Error(
        `Deck ${deck.id} has only ${learned.discoveredCombos.length} discoveredCombos (expected >= 3)`
      );
    }
    for (const combo of learned.discoveredCombos) {
      if (!CARDS_BY_ID[combo.cardAId] || !CARDS_BY_ID[combo.cardBId]) {
        throw new Error(
          `Invalid card ID in discoveredCombos for ${deck.id}: ${combo.cardAId} + ${combo.cardBId}`
        );
      }
    }
  }
  console.log(
    `  OK — All ${PREBUILT_DECKS.length} learned profiles & empirical combos verified (League Total: ${AI_LEAGUE_SUMMARY.totalMatchesSimulated.toLocaleString('en-US')} matches).`
  );

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
    `\nRunning ${matchCount} Trained AI vs AI Simulated Matches (with Weather & Sovereign Relics)...`
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
        playerDeckId: deckA.id,
        aiDeckId: deckB.id,
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

  console.log(`\nRunning Act VII Final Boss #32 Encounter Simulation...`);
  const boss32 = CAMPAIGN_BOSSES[31];
  const boss32Deck = PREBUILT_DECKS.find((d) => d.id === boss32.deckId) ?? PREBUILT_DECKS[0];
  const heroDeck = PREBUILT_DECKS[29];
  const boss32State = createInitialGameState(
    resolveDeck(heroDeck.cardIds),
    resolveDeck(boss32Deck.cardIds),
    {
      playerName: heroDeck.name,
      aiName: boss32.name,
      aiStartingHp: boss32.startingHp,
      bossId: boss32.id,
      playerDeckId: heroDeck.id,
      aiDeckId: boss32.deckId,
    }
  );
  const boss32Final = runSingleAiDuel(boss32State, 75);
  console.log(
    `  Act VII Boss #32 [${boss32.name} (${boss32.startingHp} HP)] -> Turn ${boss32Final.turn} (HP: ${boss32Final.player.hp} vs ${boss32Final.ai.hp})`
  );

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
      aiDeckId: gauntletEncounter.boss.deckId,
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
        playerDeckId: playerDeck.id,
        aiDeckId: challengerDeck.id,
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

  console.log('\nALL 5-WAVE QA CHECKS & SIMULATIONS PASSED!');
}

runAutomatedQA();
