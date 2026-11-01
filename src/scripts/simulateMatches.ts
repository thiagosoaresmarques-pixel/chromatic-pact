import fs from 'fs';
import path from 'path';
import { ALL_CARDS, CARDS_BY_ID } from '../data/cards';
import { PREBUILT_DECKS, CAMPAIGN_BOSSES } from '../data/decks';
import {
  ARCHETYPE_TIER_ELO_MAP,
  buildRankedSovereignBossEncounter,
  calculateFideRankedEloDelta,
  getEloDivisionMeta,
  SOVEREIGN_AI_LEADERBOARD_ROSTER,
  SOVEREIGN_ELO_CALIBRATION_SUMMARY,
} from '../data/sovereignEloLadder';
import {
  ASYMMETRIC_AUDIT_SUMMARY,
  DRAFT_CARD_PICK_TIERS,
} from '../data/asymmetricAuditData';
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
  VAELORIA_IMPERIAL_CAPITALS,
  VAELORIA_TRANSIT_CORRIDORS,
  VAELORIA_REALM_ORDER,
  VAELORIA_REGIONAL_MAPS,
  STAGE_REGIONAL_COORDS,
  PROVINCE_REGIONAL_COORDS,
  buildGeographicBattleModifiers,
} from '../data/vaeloriaMultimapData';
import {
  VAELORIA_CARTOGRAPHIC_PATHS,
  VAELORIA_CARTOGRAPHIC_TOPONYMS,
  VAELORIA_HISTORICAL_BATTLEFIELDS,
} from '../data/vaeloriaCartographyDetails';
import {
  VAELORIA_CAPITAL_DISTRICTS,
  getVaeloriaGazetteerIndex,
} from '../data/vaeloriaCapitalDistricts';
import {
  GRAND_CAMPAIGN_BOSSES,
  GRAND_CAMPAIGN_NODES,
  GRAND_CAMPAIGN_SUBMAP_GRAPHS,
  computeUnlockedCampaignSubmaps,
  computeSubmapReachability,
} from '../data/vaeloriaGrandCampaign';
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
  buildConquestBossForProvince,
  computeEmpireSupplyStatus,
  getConquestMapGeometries,
} from '../data/vaeloriaConquestData';
import { UNIFIED_CHAMPION_STANDINGS } from '../data/aiUnifiedTournamentData';
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
  // WAVE 1 QA: 21-Map Quadri-Scale Atlas (1 World + 6 Cardinal + 6 Deep Frontiers + 2 Corridors + 6 Capitals)
  // =========================================================================
  console.log('\n[Wave 1] Validating 21-Map Quadri-Scale Atlas & Bidirectional Portals...');
  if (
    VAELORIA_CARDINAL_REALMS.length !== 6 ||
    VAELORIA_DEEP_FRONTIERS.length !== 6 ||
    VAELORIA_TRANSIT_CORRIDORS.length !== 2 ||
    VAELORIA_IMPERIAL_CAPITALS.length !== 6 ||
    VAELORIA_REALM_ORDER.length !== 20
  ) {
    throw new Error(
      `Expected 6 Cardinal + 6 Frontiers + 2 Corridors + 6 Capitals = 20 Realms, got ${VAELORIA_REALM_ORDER.length}`
    );
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
      if (
        portal.x < 0 ||
        portal.x > 100 ||
        portal.y < 0 ||
        portal.y > 100 ||
        portal.arrivalX < 0 ||
        portal.arrivalX > 100 ||
        portal.arrivalY < 0 ||
        portal.arrivalY > 100
      ) {
        throw new Error(`Out-of-bounds portal coordinates in ${realmId} (${portal.id})`);
      }
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
    `  OK — All 21 high-res map assets verified, bidirectional portals intact across 4 tiers, ${totalLandmarksCount} Overworld landmarks registered.`
  );

  // =========================================================================
  // WAVE 2 QA: 48-Province Conquest 2.0, 162 Unified Settlements, BFS Supply & Cartography
  // =========================================================================
  console.log('\n[Wave 2] Validating 48-Province Conquest Graph, 162 Settlements, Living Hydrography & LOD 1-4 Toponyms...');
  if (CONQUEST_PROVINCES.length !== 48) {
    throw new Error(`Expected 48 Conquest provinces, got ${CONQUEST_PROVINCES.length}`);
  }
  if (PROVINCE_BUILDING_ORDER.length !== 5) {
    throw new Error(`Expected 5 Province Buildings, got ${PROVINCE_BUILDING_ORDER.length}`);
  }
  if (CONQUEST_CRISES.length !== 8) {
    throw new Error(`Expected 8 Conquest Crises, got ${CONQUEST_CRISES.length}`);
  }

  let totalSettlements = 0;
  for (const prov of CONQUEST_PROVINCES) {
    if (!PROVINCE_REGIONAL_COORDS[prov.id]) {
      throw new Error(`Province ${prov.id} missing PROVINCE_REGIONAL_COORDS entry`);
    }
    totalSettlements += prov.microSettlements.length;
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
  if (totalSettlements < 160) {
    throw new Error(`Expected >= 160 unified micro-settlements, got ${totalSettlements}`);
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

  // Validate Living Hydrography, Multi-LOD Toponyms, 36 Capital Districts, 15 Battlefields & Gazetteer
  if (VAELORIA_CARTOGRAPHIC_PATHS.length < 85) {
    throw new Error(`Expected >= 85 cartographic curves, got ${VAELORIA_CARTOGRAPHIC_PATHS.length}`);
  }
  if (VAELORIA_CARTOGRAPHIC_TOPONYMS.length < 240) {
    throw new Error(`Expected >= 240 LOD 1-4 toponyms, got ${VAELORIA_CARTOGRAPHIC_TOPONYMS.length}`);
  }
  if (VAELORIA_CAPITAL_DISTRICTS.length !== 36) {
    throw new Error(`Expected 36 Capital Districts, got ${VAELORIA_CAPITAL_DISTRICTS.length}`);
  }
  if (VAELORIA_HISTORICAL_BATTLEFIELDS.length < 15) {
    throw new Error(
      `Expected >= 15 Historical Battlefields, got ${VAELORIA_HISTORICAL_BATTLEFIELDS.length}`
    );
  }
  for (const p of VAELORIA_CARTOGRAPHIC_PATHS) {
    for (const cid of p.nativeCardIds) {
      if (!CARDS_BY_ID[cid]) throw new Error(`Path ${p.id} references unknown cardId ${cid}`);
    }
  }
  for (const top of VAELORIA_CARTOGRAPHIC_TOPONYMS) {
    for (const cid of top.nativeCardIds) {
      if (!CARDS_BY_ID[cid]) throw new Error(`Toponym ${top.id} references unknown cardId ${cid}`);
    }
  }
  for (const dist of VAELORIA_CAPITAL_DISTRICTS) {
    for (const cid of dist.nativeCardIds) {
      if (!CARDS_BY_ID[cid]) throw new Error(`District ${dist.id} references unknown cardId ${cid}`);
    }
  }
  for (const bf of VAELORIA_HISTORICAL_BATTLEFIELDS) {
    for (const cid of bf.nativeCardIds) {
      if (!CARDS_BY_ID[cid]) throw new Error(`Battlefield ${bf.id} references unknown cardId ${cid}`);
    }
  }
  const gazetteer = getVaeloriaGazetteerIndex();
  if (gazetteer.length < 500) {
    throw new Error(`Expected >= 500 Gazetteer locations, got ${gazetteer.length}`);
  }
  console.log(
    `  OK — 48 provinces (${totalSettlements} settlements), ${VAELORIA_CARTOGRAPHIC_PATHS.length} living routes/rivers, ${VAELORIA_CARTOGRAPHIC_TOPONYMS.length} LOD 1-4 toponyms, ${VAELORIA_CAPITAL_DISTRICTS.length} districts, ${VAELORIA_HISTORICAL_BATTLEFIELDS.length} historical battlefields & ${gazetteer.length} Gazetteer entries verified.`
  );

  // =========================================================================
  // WAVE 3 QA: Act VII (32 Bosses) & 120 Overworld Landmarks + 3-Choice Events
  // =========================================================================
  console.log('\n[Wave 3] Validating 32 Campaign Bosses (Acts I-VII) & 120 Overworld Events...');
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

  if (totalLandmarksCount !== 120) {
    throw new Error(`Expected 120 Overworld landmarks across 20 realms, got ${totalLandmarksCount}`);
  }
  for (const realmId of VAELORIA_REALM_ORDER) {
    const rDef = VAELORIA_REGIONAL_MAPS[realmId];
    for (const lm of rDef.localLandmarks) {
      const ev = getLandmarkEventDef(realmId, lm);
      if (
        rDef.tier === 'deep_frontier' ||
        rDef.tier === 'transit_corridor' ||
        rDef.tier === 'imperial_capital'
      ) {
        const choiceC = ev.choices.find((c) => c.id === 'choice_c');
        if (!choiceC) {
          throw new Error(`Expanded Realm landmark ${lm.id} in ${realmId} missing choice_c!`);
        }
        const previewC = resolveLandmarkChoicePreview(ev, choiceC, 'campaign');
        if (previewC.shardsDelta <= 0 && !previewC.recruitedCard && !previewC.fieldBuff) {
          throw new Error(`Expanded Realm choice_c on ${lm.id} granted no reward!`);
        }
      }
    }
  }
  console.log(
    '  OK — All 32 Campaign Bosses & 120 Overworld Landmarks across 20 Realms verified.'
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

  console.log(`\nValidating Wave 6 Grand Campaign (190 Encounters / 276 Rare+Legendary / BFS Road March)...`);

  if (GRAND_CAMPAIGN_BOSSES.length !== 190 || GRAND_CAMPAIGN_NODES.length !== 190) {
    throw new Error(
      `Expected 190 Grand Campaign encounters, got bosses=${GRAND_CAMPAIGN_BOSSES.length}, nodes=${GRAND_CAMPAIGN_NODES.length}`
    );
  }

  const allRareAndLegendaryCreatures = ALL_CARDS.filter(
    (c) => c.type === 'creature' && (c.rarity === 'rare' || c.rarity === 'legendary')
  );
  const featuredCreatureSet = new Set<string>();
  for (const boss of GRAND_CAMPAIGN_BOSSES) {
    if (!boss.customDeckCardIds || boss.customDeckCardIds.length !== 100) {
      throw new Error(
        `Grand Campaign boss ${boss.id} must have a 100-card customDeckCardIds, got ${boss.customDeckCardIds?.length}`
      );
    }
    const rdef = boss.submapId ? VAELORIA_REGIONAL_MAPS[boss.submapId] : undefined;
    if (!rdef) {
      throw new Error(`Grand Campaign boss ${boss.id} has invalid submapId ${boss.submapId}`);
    }
    const commanderIds = [boss.avatarCardId, ...(boss.companionCardId ? [boss.companionCardId] : [])];
    for (const cid of commanderIds) {
      const card = CARDS_BY_ID[cid];
      if (!card) throw new Error(`Missing commander creature ${cid} on boss ${boss.id}`);
      if (card.domain !== rdef.domain) {
        throw new Error(
          `Domain mismatch on ${boss.id}: creature ${cid} (${card.domain}) placed in submap ${rdef.id} (${rdef.domain})`
        );
      }
      featuredCreatureSet.add(cid);
    }
    for (const rcid of boss.rewardCardIds ?? []) {
      if (!CARDS_BY_ID[rcid]) {
        throw new Error(`Missing reward card ${rcid} on boss ${boss.id}`);
      }
    }
  }
  if (featuredCreatureSet.size !== allRareAndLegendaryCreatures.length) {
    throw new Error(
      `Expected all ${allRareAndLegendaryCreatures.length} Rare+Legendary creatures featured, got ${featuredCreatureSet.size}`
    );
  }

  // Verify full 190/190 step-by-step road conquest from every starting Sovereign color
  const startingColors = ['green', 'red', 'blue', 'purple', 'gold'] as const;
  for (const startDom of startingColors) {
    const cleared = new Set<string>();
    let progressed = true;
    while (progressed) {
      progressed = false;
      const clearedArr = Array.from(cleared);
      const unlockedMaps = computeUnlockedCampaignSubmaps(clearedArr, startDom);
      for (const rid of unlockedMaps) {
        const reach = computeSubmapReachability(rid, clearedArr);
        for (const nid of reach.accessibleNodeIds) {
          if (!cleared.has(nid)) {
            cleared.add(nid);
            progressed = true;
          }
        }
      }
    }
    if (cleared.size !== 190) {
      throw new Error(
        `Starting from ${startDom}, only ${cleared.size}/190 encounters were reachable via planar road progression!`
      );
    }
  }

  // Simulate a Tier 5 Apex Throne Duel (Gorgonoth in capital_axial) with custom 40-card deck + geographic modifier
  const apexBoss =
    GRAND_CAMPAIGN_BOSSES[GRAND_CAMPAIGN_BOSSES.length - 1];
  const apexState = createInitialGameState(
    resolveDeck(PREBUILT_DECKS[0].cardIds),
    resolveDeck(apexBoss.customDeckCardIds!),
    {
      playerName: PREBUILT_DECKS[0].name,
      aiName: apexBoss.name,
      aiStartingHp: apexBoss.startingHp,
      bossId: apexBoss.id,
      playerDeckId: PREBUILT_DECKS[0].id,
      aiDeckId: apexBoss.deckId,
      conquestModifiers: buildGeographicBattleModifiers({
        mode: 'campaign',
        bossId: apexBoss.id,
        stage: apexBoss.stage,
        submapId: apexBoss.submapId ?? 'capital_axial',
        landmarkName: apexBoss.landmarkName,
        isThroneSiege: true,
      }),
    }
  );
  const apexFinal = runSingleAiDuel(apexState, 70);
  console.log(
    `  OK — Grand Campaign verified: 190 encounters (${Object.keys(GRAND_CAMPAIGN_SUBMAP_GRAPHS).length} submaps), ${featuredCreatureSet.size}/${allRareAndLegendaryCreatures.length} Rare+Legendary creatures (0 domain mismatches), 190/190 BFS from all 5 colors | Apex Duel [${apexBoss.name}] Turn ${apexFinal.turn}.`
  );

  // Validate Tier I–V Co-Evolved Champion Coverage across Grand Campaign, Conquest, and Fracture Rifts
  const campaignChampionSet = new Set(GRAND_CAMPAIGN_BOSSES.map((b) => b.archetypeId));
  for (const st of UNIFIED_CHAMPION_STANDINGS) {
    if (!campaignChampionSet.has(st.archetypeId)) {
      throw new Error(`Grand Campaign missing Co-Evolved Champion archetype: ${st.archetypeId}`);
    }
  }
  for (const prov of CONQUEST_PROVINCES) {
    const cqBoss = buildConquestBossForProvince(prov, prov.initialOwner, 0, 1, false);
    if (!cqBoss.customDeckCardIds || cqBoss.customDeckCardIds.length !== 100 || !cqBoss.archetypeId) {
      throw new Error(`Invalid Conquest boss setup for province ${prov.id}`);
    }
  }
  for (const rift of FRACTURE_RIFTS) {
    for (const t of [3, 4, 5] as const) {
      const { boss: rBoss } = buildRiftBattleEncounter(rift.id, t);
      if (
        !rBoss.customDeckCardIds ||
        rBoss.customDeckCardIds.length !== 100 ||
        rBoss.difficultyTier !== t ||
        !rBoss.archetypeId
      ) {
        throw new Error(`Invalid Fracture Rift boss setup for ${rift.id} at Tier ${t}`);
      }
    }
  }
  console.log(
    `  OK — Tier I–V Co-Evolved Champions verified across Campaign (44/44 archetypes), Conquest (48/48 provinces), and Fracture Rifts (6×3 Tiers).`
  );

  // ============================================================================
  // WAVE 7: BRADLEY-TERRY ELO LADDER, RANKED SOVEREIGN DUELS & ASYMMETRIC AUDIT
  // ============================================================================
  console.log('\n[Wave 7] Auditing Bradley-Terry ELO Calibration, 68 Sovereigns & Draft Pick Tiers...');
  let calibratedCellsCount = 0;
  for (const st of UNIFIED_CHAMPION_STANDINGS) {
    const tierRow = ARCHETYPE_TIER_ELO_MAP[st.archetypeId];
    if (!tierRow) {
      throw new Error(`Missing calibrated ELO row for archetype ${st.archetypeId}`);
    }
    for (const t of [1, 2, 3, 4, 5] as const) {
      const cell = tierRow[t];
      if (!cell || cell.elo < 200 || cell.elo > 2800 || cell.games <= 0) {
        throw new Error(`Invalid ELO cell for ${st.archetypeId} Tier ${t}`);
      }
      calibratedCellsCount += 1;
    }
  }
  if (calibratedCellsCount !== 220) {
    throw new Error(`Expected 220 calibrated ELO cells, found ${calibratedCellsCount}`);
  }
  const dist = SOVEREIGN_ELO_CALIBRATION_SUMMARY.tierEloDistribution;
  if (
    !(
      dist[1].meanElo < dist[2].meanElo &&
      dist[2].meanElo < dist[3].meanElo &&
      dist[3].meanElo < dist[4].meanElo &&
      dist[4].meanElo < dist[5].meanElo
    )
  ) {
    throw new Error('Tier I–V mean ELO curve failed strict monotonicity check!');
  }
  if (dist[2].medianElo !== 1200) {
    throw new Error(`Expected Tier II median ELO anchor at 1200, got ${dist[2].medianElo}`);
  }

  const grandSovereigns = SOVEREIGN_AI_LEADERBOARD_ROSTER.filter((s) => s.isGrandSovereign);
  if (grandSovereigns.length !== 44) {
    throw new Error(`Expected 44 Grand Sovereigns on ELO leaderboard, got ${grandSovereigns.length}`);
  }
  for (const sov of SOVEREIGN_AI_LEADERBOARD_ROSTER) {
    if (!CARDS_BY_ID[sov.avatarCardId]) {
      throw new Error(`Invalid avatarCardId ${sov.avatarCardId} on Sovereign ${sov.sovereignId}`);
    }
    const bossEnc = buildRankedSovereignBossEncounter(sov);
    if (
      bossEnc.startingHp !== 40 ||
      !bossEnc.customDeckCardIds ||
      bossEnc.customDeckCardIds.length !== 100
    ) {
      throw new Error(`Ranked Sovereign encounter invalid for ${sov.sovereignId}`);
    }
  }

  if (Object.keys(DRAFT_CARD_PICK_TIERS).length !== ALL_CARDS.length) {
    throw new Error(
      `Draft Pick Tiers mismatch: ${Object.keys(DRAFT_CARD_PICK_TIERS).length} vs ${ALL_CARDS.length}`
    );
  }
  const freshDelta = calculateFideRankedEloDelta({
    playerElo: 1200,
    opponentElo: 1600,
    didWin: true,
    recentOpponentIds: [],
    opponentKey: 'sov_test',
  });
  const repeatDelta = calculateFideRankedEloDelta({
    playerElo: 1200,
    opponentElo: 1600,
    didWin: true,
    recentOpponentIds: ['sov_test', 'sov_test'],
    opponentKey: 'sov_test',
  });
  if (!(freshDelta.delta > repeatDelta.delta && repeatDelta.delta > 0)) {
    throw new Error('FIDE anti-farm K-factor decay validation failed!');
  }
  if (getEloDivisionMeta(1200).id !== 'ouro_solar' || getEloDivisionMeta(2050).id !== 'grao_mestre_penta') {
    throw new Error('ELO Division threshold lookup validation failed!');
  }
  console.log(
    `  OK — 220/220 ELO cells verified (T1=${dist[1].meanElo} < T2=${dist[2].meanElo} < T3=${dist[3].meanElo} < T4=${dist[4].meanElo} < T5=${dist[5].meanElo}), ${SOVEREIGN_AI_LEADERBOARD_ROSTER.length} Leaderboard Sovereigns, ${ASYMMETRIC_AUDIT_SUMMARY.totalAsymmetricMatches} Asymmetric Audit matches & 1,038 Draft Pick Tiers.`
  );

  console.log('\nALL 7-WAVE QA CHECKS & SIMULATIONS PASSED!');
}

runAutomatedQA();
