import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { isMainThread, parentPort, Worker } from 'node:worker_threads';
import {
  chooseMulliganIndicesForActor,
  executeTurnStepForActor,
} from '../engine/aiEngine';
import {
  createInitialGameState,
  getAllBoardUnits,
  mulliganCards,
} from '../engine/gameEngine';
import { ALL_CARDS, CARDS_BY_ID } from '../data/cards';
import {
  buildIndividualSovereignSignatureDeck,
  resolveChampionDeckAndProfile,
} from '../data/aiMonocolorMastery';
import {
  UNIFIED_CHAMPION_STANDINGS,
  UnifiedChampionId,
  UnifiedFormatKind,
} from '../data/aiUnifiedTournamentData';
import { LEGENDARY_CREATURE_BIOGRAPHIES } from '../data/legendaryCreaturesLore';
import {
  CANONICAL_SOVEREIGN_CARD_BY_ARCHETYPE,
  REALM_ORIGIN_BY_ARCHETYPE,
} from '../data/sovereignCardBindings';
import {
  ARCHETYPE_TIER_ELO_MAP,
  SOVEREIGN_ELO_CALIBRATION_SUMMARY,
  SovereignAiLeaderboardEntry,
  SovereignEloCalibrationSummary,
} from '../data/sovereignEloLadderData';
import { GRAND_CAMPAIGN_NODES } from '../data/vaeloriaGrandCampaign';
import { VAELORIA_REGIONAL_MAPS } from '../data/vaeloriaMultimapData';
import type { AiSkillTier, CardDefinition, Domain } from '../types/game';

interface SovereignContender {
  idx: number;
  sovereignId: string;
  sovereignName: string;
  sovereignTitle: string;
  realmOrigin: string;
  archetypeId: UnifiedChampionId;
  archetypeName: string;
  archetypeSubtitle: string;
  skillTier: AiSkillTier;
  isGrandSovereign: boolean;
  format: UnifiedFormatKind;
  domains: Domain[];
  avatarCardId: string;
  deckCardIds: string[];
  tournamentRankTierV?: number;
}

interface PairingSpec {
  i: number;
  j: number;
  mirrorPairs: number;
}

interface WorkerBatchRequest {
  jobId: number;
  pairings: Array<{
    i: number;
    j: number;
    mirrorPairs: number;
    nameA: string;
    nameB: string;
    deckIdA: string;
    deckIdB: string;
    tierA: AiSkillTier;
    tierB: AiSkillTier;
    cardsA: string[];
    cardsB: string[];
  }>;
}

interface WorkerBatchResult {
  jobId: number;
  outcomes: Array<{
    i: number;
    j: number;
    games: number;
    scoreI: number;
    winsI: number;
    lossesI: number;
  }>;
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

function resolveCards(ids: string[]): CardDefinition[] {
  const out = new Array<CardDefinition>(ids.length);
  for (let k = 0; k < ids.length; k++) {
    out[k] = CARDS_BY_ID[ids[k]];
  }
  return out;
}

function runSingleSymmetricDuel(
  cardsP: CardDefinition[],
  cardsA: CardDefinition[],
  nameP: string,
  nameA: string,
  deckIdP: string,
  deckIdA: string,
  tierP: AiSkillTier,
  tierA: AiSkillTier
): { scoreP: number; winP: boolean; lossP: boolean } {
  let state = createInitialGameState(cardsP, cardsA, {
    playerName: nameP,
    aiName: nameA,
    playerDeckId: deckIdP,
    aiDeckId: deckIdA,
    playerSkillTier: tierP,
    aiSkillTier: tierA,
    playerStartingHp: 40,
    aiStartingHp: 40,
  });

  const pSwap = chooseMulliganIndicesForActor(state, 'player', undefined, tierP);
  state = mulliganCards(state, 'player', pSwap);
  const aSwap = chooseMulliganIndicesForActor(state, 'ai', undefined, tierA);
  state = mulliganCards(state, 'ai', aSwap);

  let steps = 0;
  // Full Multi-Ply Beam Search enabled for Tier 4 & Tier 5 so grandmasters outthink lower tiers
  const overrides = {
    playerSkillTier: tierP,
    aiSkillTier: tierA,
    fastRollout: false,
  };

  while (state.phase !== 'gameover' && state.turn <= 32 && steps < 780) {
    steps += 1;
    const active = state.activePlayer;
    state = executeTurnStepForActor(state, active, overrides).nextState;
  }

  if (state.phase === 'gameover' && state.winner === 'player') {
    return { scoreP: 1, winP: true, lossP: false };
  }
  if (state.phase === 'gameover' && state.winner === 'ai') {
    return { scoreP: 0, winP: false, lossP: true };
  }

  const pBoard = getAllBoardUnits(state.player).reduce(
    (s, u) => s + u.currentAtk + u.currentHp,
    0
  );
  const aBoard = getAllBoardUnits(state.ai).reduce(
    (s, u) => s + u.currentAtk + u.currentHp,
    0
  );
  const adv = state.player.hp - state.ai.hp + (pBoard - aBoard) * 0.4;
  const s = clamp(0.5 + adv / 60, 0.15, 0.85);
  return {
    scoreP: s,
    winP: s >= 0.5,
    lossP: s < 0.5,
  };
}

// ============================================================================
// WORKER THREAD ENTRYPOINT
// ============================================================================
if (!isMainThread && parentPort) {
  const deckCache = new Map<string, CardDefinition[]>();
  const getDeck = (key: string, ids: string[]) => {
    let d = deckCache.get(key);
    if (!d) {
      d = resolveCards(ids);
      deckCache.set(key, d);
    }
    return d;
  };

  parentPort.on('message', (req: WorkerBatchRequest) => {
    const outcomes: WorkerBatchResult['outcomes'] = [];
    for (const p of req.pairings) {
      const dA = getDeck(`${p.i}`, p.cardsA);
      const dB = getDeck(`${p.j}`, p.cardsB);
      let games = 0;
      let scoreI = 0;
      let winsI = 0;
      let lossesI = 0;

      for (let m = 0; m < p.mirrorPairs; m++) {
        const g1 = runSingleSymmetricDuel(
          dA,
          dB,
          p.nameA,
          p.nameB,
          p.deckIdA,
          p.deckIdB,
          p.tierA,
          p.tierB
        );
        games += 1;
        scoreI += g1.scoreP;
        if (g1.winP) winsI += 1;
        else if (g1.lossP) lossesI += 1;

        const g2 = runSingleSymmetricDuel(
          dB,
          dA,
          p.nameB,
          p.nameA,
          p.deckIdB,
          p.deckIdA,
          p.tierB,
          p.tierA
        );
        const sI2 = 1 - g2.scoreP;
        games += 1;
        scoreI += sI2;
        if (g2.lossP) winsI += 1;
        else if (g2.winP) lossesI += 1;
      }

      outcomes.push({ i: p.i, j: p.j, games, scoreI, winsI, lossesI });
    }
    parentPort!.postMessage({ jobId: req.jobId, outcomes } satisfies WorkerBatchResult);
  });
}

// ============================================================================
// BRADLEY-TERRY MLE SOLVER
// ============================================================================
function solveBradleyTerryElo(
  numNodes: number,
  gamesMat: Float64Array[],
  scoreMat: Float64Array[],
  anchorIndices: number[],
  anchorTargetElo = 1200
): { elo: number[]; rd: number[]; logLikelihood: number; iterations: number } {
  const logGamma = new Float64Array(numNodes).fill(0);
  const nextLogGamma = new Float64Array(numNodes).fill(0);

  const maxIter = 500;
  let iter = 0;

  for (iter = 1; iter <= maxIter; iter++) {
    let maxStep = 0;
    for (let i = 0; i < numNodes; i++) {
      let winSum = 0.35;
      let denomSum = 0;
      const gi = Math.exp(logGamma[i]);

      for (let j = 0; j < numNodes; j++) {
        if (i === j) continue;
        const nij = gamesMat[i][j];
        if (nij <= 0) continue;
        winSum += scoreMat[i][j];
        const gj = Math.exp(logGamma[j]);
        denomSum += nij / (gi + gj);
      }
      denomSum += 0.7 / (gi + 1);

      const updatedGi = denomSum > 0 ? winSum / denomSum : gi;
      const newLg = clamp(Math.log(Math.max(1e-6, updatedGi)), -8, 8);
      const step = Math.abs(newLg - logGamma[i]);
      if (step > maxStep) maxStep = step;
      nextLogGamma[i] = newLg;
    }

    let meanLg = 0;
    for (let i = 0; i < numNodes; i++) meanLg += nextLogGamma[i];
    meanLg /= numNodes;
    for (let i = 0; i < numNodes; i++) {
      logGamma[i] = nextLogGamma[i] - meanLg;
    }

    if (maxStep < 1e-6) break;
  }

  const scale = 400 / Math.LN10;
  const rawElo = new Array<number>(numNodes);
  for (let i = 0; i < numNodes; i++) {
    rawElo[i] = logGamma[i] * scale;
  }

  const anchorVals = anchorIndices.map((idx) => rawElo[idx]).sort((a, b) => a - b);
  const medianRaw = anchorVals.length > 0 ? anchorVals[Math.floor(anchorVals.length / 2)] : 0;
  const shift = anchorTargetElo - medianRaw;
  const elo = rawElo.map((r) => Math.round(r + shift));

  const ln10Over400 = Math.LN10 / 400;
  const rd = new Array<number>(numNodes);
  let logLikelihood = 0;

  for (let i = 0; i < numNodes; i++) {
    let fisherDiag = 0.0005;
    for (let j = 0; j < numNodes; j++) {
      if (i === j) continue;
      const nij = gamesMat[i][j];
      if (nij <= 0) continue;
      const eij = 1 / (1 + Math.pow(10, (elo[j] - elo[i]) / 400));
      fisherDiag += nij * eij * (1 - eij) * ln10Over400 * ln10Over400;
      if (i < j) {
        const sij = scoreMat[i][j];
        logLikelihood +=
          sij * Math.log(Math.max(1e-9, eij)) +
          (nij - sij) * Math.log(Math.max(1e-9, 1 - eij));
      }
    }
    rd[i] = Math.round(clamp(1 / Math.sqrt(fisherDiag), 10, 95));
  }

  return {
    elo,
    rd,
    logLikelihood: Math.round(logLikelihood * 100) / 100,
    iterations: iter,
  };
}

const RARE_ROLE_BY_TIER: Record<AiSkillTier, string> = {
  1: 'Sentinela de Fronteira',
  2: 'Capitão da Ordem',
  3: 'Comandante Regional',
  4: 'Arconte Tático',
  5: 'Grão-Comandante',
};

function buildAll276Contenders(): SovereignContender[] {
  const standingByArch = new Map<UnifiedChampionId, (typeof UNIFIED_CHAMPION_STANDINGS)[number]>();
  for (const st of UNIFIED_CHAMPION_STANDINGS) {
    standingByArch.set(st.archetypeId, st);
  }

  const canonicalArchByCard = new Map<string, UnifiedChampionId>();
  for (const [arch, cid] of Object.entries(CANONICAL_SOVEREIGN_CARD_BY_ARCHETYPE) as Array<
    [UnifiedChampionId, string]
  >) {
    canonicalArchByCard.set(cid, arch);
  }

  const nodeByCardId = new Map<string, (typeof GRAND_CAMPAIGN_NODES)[number]>();
  for (const n of GRAND_CAMPAIGN_NODES) {
    nodeByCardId.set(n.boss.avatarCardId, n);
  }

  const allRareLeg = ALL_CARDS.filter(
    (c) => c.type === 'creature' && (c.rarity === 'legendary' || c.rarity === 'rare')
  );
  if (allRareLeg.length !== 276) {
    throw new Error(`Expected 276 Rare+Legendary creatures, found ${allRareLeg.length}`);
  }

  const contenders: SovereignContender[] = [];
  for (let idx = 0; idx < allRareLeg.length; idx++) {
    const card = allRareLeg[idx];
    const gcNode = nodeByCardId.get(card.id);
    if (!gcNode) {
      throw new Error(`Creature ${card.id} missing from 276 Grand Campaign solo nodes!`);
    }

    const canonicalArch = canonicalArchByCard.get(card.id);
    const archetypeId: UnifiedChampionId =
      canonicalArch ?? ((gcNode.boss.archetypeId as UnifiedChampionId) || 'mono_neutral_axial');
    const st = standingByArch.get(archetypeId)!;

    const skillTier: AiSkillTier = canonicalArch
      ? 5
      : card.rarity === 'legendary'
        ? (Math.max(3, gcNode.tier) as AiSkillTier)
        : gcNode.tier;

    const resolvedProf = resolveChampionDeckAndProfile(archetypeId, skillTier)!;
    const deckCardIds = buildIndividualSovereignSignatureDeck(card.id, archetypeId, skillTier);
    if (!deckCardIds.includes(card.id) || deckCardIds.length !== 100) {
      throw new Error(`Invalid signature deck for ${card.id}`);
    }

    const bio = LEGENDARY_CREATURE_BIOGRAPHIES[card.id];
    const rdef = VAELORIA_REGIONAL_MAPS[gcNode.submapId];
    const realmOrigin = canonicalArch
      ? REALM_ORIGIN_BY_ARCHETYPE[canonicalArch] ?? rdef.name
      : rdef.name;
    const sovereignName = bio?.properTitle ?? gcNode.boss.name ?? card.name;
    const seatLabel = bio?.locationLabel ?? gcNode.landmarkName;
    const isGrandSovereign = card.rarity === 'legendary';
    const sovereignTitle = isGrandSovereign
      ? `Grão-Soberano • ${seatLabel}`
      : `${RARE_ROLE_BY_TIER[skillTier]} • ${gcNode.landmarkName}`;

    // Ensure card's own non-neutral domain is included for accurate Leaderboard domain filtering
    const domains: Domain[] =
      card.domain !== 'neutral' && !resolvedProf.domains.includes(card.domain)
        ? [card.domain, ...resolvedProf.domains.slice(0, 2)]
        : resolvedProf.domains;

    contenders.push({
      idx,
      sovereignId: canonicalArch ? `sov_t5_${canonicalArch}` : `sov_${card.id}`,
      sovereignName,
      sovereignTitle,
      realmOrigin,
      archetypeId,
      archetypeName: st.name,
      archetypeSubtitle: st.subtitle,
      skillTier,
      isGrandSovereign,
      format: st.format,
      domains,
      avatarCardId: card.id,
      deckCardIds,
      tournamentRankTierV: canonicalArch ? st.rank : undefined,
    });
  }

  return contenders;
}

function buildRoundPairings(
  orderedIndices: number[],
  offsets: number[],
  mirrorPairsPerEdge: number,
  pairCountUsed: Map<string, number>
): PairingSpec[] {
  const N = orderedIndices.length;
  const specs: PairingSpec[] = [];
  const addedThisRound = new Set<string>();

  for (let pos = 0; pos < N; pos++) {
    const u = orderedIndices[pos];
    for (const off of offsets) {
      let targetPos = pos + off;
      if (targetPos >= N) targetPos = pos - off;
      if (targetPos < 0 || targetPos >= N || targetPos === pos) continue;
      const v = orderedIndices[targetPos];
      const key = u < v ? `${u}:${v}` : `${v}:${u}`;
      if (addedThisRound.has(key)) continue;
      if ((pairCountUsed.get(key) ?? 0) >= 2) {
        // Look slightly nearby for a fresh opponent
        let altFound = -1;
        for (let delta = 1; delta <= 9; delta++) {
          for (const sgn of [1, -1]) {
            const p2 = targetPos + delta * sgn;
            if (p2 < 0 || p2 >= N || p2 === pos) continue;
            const cand = orderedIndices[p2];
            const ck = u < cand ? `${u}:${cand}` : `${cand}:${u}`;
            if (!addedThisRound.has(ck) && (pairCountUsed.get(ck) ?? 0) < 2) {
              altFound = cand;
              break;
            }
          }
          if (altFound >= 0) break;
        }
        if (altFound >= 0) {
          const ck = u < altFound ? `${u}:${altFound}` : `${altFound}:${u}`;
          addedThisRound.add(ck);
          pairCountUsed.set(ck, (pairCountUsed.get(ck) ?? 0) + 1);
          specs.push({ i: Math.min(u, altFound), j: Math.max(u, altFound), mirrorPairs: mirrorPairsPerEdge });
          continue;
        }
      }
      addedThisRound.add(key);
      pairCountUsed.set(key, (pairCountUsed.get(key) ?? 0) + 1);
      specs.push({ i: Math.min(u, v), j: Math.max(u, v), mirrorPairs: mirrorPairsPerEdge });
    }
  }
  return specs;
}

async function runMainLeague() {
  const t0 = performance.now();
  const contenders = buildAll276Contenders();
  const N = contenders.length;
  const numWorkers = Math.max(2, Math.min(os.cpus().length, 16));

  console.log(
    `=== LIGA OFICIAL DE CALIBRAÇÃO ELO — 276 SOBERANOS INDIVIDUAIS (100 LENDÁRIAS + 176 RARAS) ===`
  );
  console.log(
    `Workers paralelos: ${numWorkers} | Regras: 40 PV vs 40 PV simétricos | Grimórios Assinatura 100 cartas`
  );

  const gamesMat = Array.from({ length: N }, () => new Float64Array(N));
  const scoreMat = Array.from({ length: N }, () => new Float64Array(N));
  const totalGamesArr = new Int32Array(N);
  const totalWinsArr = new Int32Array(N);
  const totalLossesArr = new Int32Array(N);

  const tier2AnchorIndices = contenders
    .filter((c) => c.skillTier === 2)
    .map((c) => c.idx);

  // Spawn worker pool
  const url = new URL(import.meta.url);
  const workers: Worker[] = [];
  const idle: Worker[] = [];
  let jobSeq = 1;
  const pending = new Map<
    number,
    { resolve: (r: WorkerBatchResult) => void; reject: (e: Error) => void }
  >();
  const queue: WorkerBatchRequest[] = [];

  const pump = () => {
    while (idle.length > 0 && queue.length > 0) {
      const w = idle.pop()!;
      const req = queue.shift()!;
      w.postMessage(req);
    }
  };

  for (let wIdx = 0; wIdx < numWorkers; wIdx++) {
    const w = new Worker(url, { execArgv: ['--import', 'tsx'] });
    w.on('message', (msg: WorkerBatchResult) => {
      const p = pending.get(msg.jobId);
      if (p) {
        pending.delete(msg.jobId);
        p.resolve(msg);
      }
      idle.push(w);
      pump();
    });
    w.on('error', (err) => {
      for (const p of pending.values()) p.reject(err);
      pending.clear();
    });
    workers.push(w);
    idle.push(w);
  }

  const executePairings = async (stageLabel: string, specs: PairingSpec[]) => {
    const chunkSize = 12;
    const promises: Promise<WorkerBatchResult>[] = [];
    let completedGames = 0;
    const totalStageGames = specs.reduce((s, x) => s + x.mirrorPairs * 2, 0);

    for (let p = 0; p < specs.length; p += chunkSize) {
      const slice = specs.slice(p, p + chunkSize);
      const jobId = jobSeq++;
      const req: WorkerBatchRequest = {
        jobId,
        pairings: slice.map((sp) => {
          const A = contenders[sp.i];
          const B = contenders[sp.j];
          return {
            i: sp.i,
            j: sp.j,
            mirrorPairs: sp.mirrorPairs,
            nameA: A.sovereignName,
            nameB: B.sovereignName,
            deckIdA: A.archetypeId,
            deckIdB: B.archetypeId,
            tierA: A.skillTier,
            tierB: B.skillTier,
            cardsA: A.deckCardIds,
            cardsB: B.deckCardIds,
          };
        }),
      };

      promises.push(
        new Promise<WorkerBatchResult>((resolve, reject) => {
          pending.set(jobId, {
            resolve: (res) => {
              for (const o of res.outcomes) {
                gamesMat[o.i][o.j] += o.games;
                gamesMat[o.j][o.i] += o.games;
                scoreMat[o.i][o.j] += o.scoreI;
                scoreMat[o.j][o.i] += o.games - o.scoreI;
                totalGamesArr[o.i] += o.games;
                totalGamesArr[o.j] += o.games;
                totalWinsArr[o.i] += o.winsI;
                totalLossesArr[o.i] += o.lossesI;
                totalWinsArr[o.j] += o.lossesI;
                totalLossesArr[o.j] += o.winsI;
                completedGames += o.games;
              }
              resolve(res);
            },
            reject,
          });
          queue.push(req);
          pump();
        })
      );
    }

    await Promise.all(promises);
    const sec = ((performance.now() - t0) / 1000).toFixed(1);
    console.log(`  [${stageLabel}] Concluído: ${completedGames}/${totalStageGames} partidas (${sec}s acumulados)`);
  };

  const pairCountUsed = new Map<string, number>();

  // Stage 1: Initial Tier + Archetype Base ELO ordering with local + cross-tier bridges (~88 games/Sovereign)
  const initialOrder = [...contenders]
    .sort((a, b) => {
      const eloA = ARCHETYPE_TIER_ELO_MAP[a.archetypeId]?.[a.skillTier]?.elo ?? a.skillTier * 250;
      const eloB = ARCHETYPE_TIER_ELO_MAP[b.archetypeId]?.[b.skillTier]?.elo ?? b.skillTier * 250;
      return eloA - eloB || a.idx - b.idx;
    })
    .map((c) => c.idx);

  const stage1Specs = buildRoundPairings(
    initialOrder,
    [1, 3, 6, 10, 16, 25, 38, 55, 78, 105, 138],
    2,
    pairCountUsed
  );
  await executePairings('Etapa 1/4 — Semeadura Global & Pontes Entre Graus', stage1Specs);

  // Stage 2: Swiss ELO-Neighborhood Round 1 (~88 games/Sovereign)
  const bt1 = solveBradleyTerryElo(N, gamesMat, scoreMat, tier2AnchorIndices, 1200);
  const stage2Order = contenders
    .map((c) => c.idx)
    .sort((a, b) => bt1.elo[a] - bt1.elo[b] || a - b);
  const stage2Specs = buildRoundPairings(
    stage2Order,
    [1, 2, 4, 7, 11, 16, 22, 30, 42, 60, 88],
    2,
    pairCountUsed
  );
  await executePairings('Etapa 2/4 — Suíço por Vizinhança ELO I', stage2Specs);

  // Stage 3: Swiss ELO-Neighborhood Precision Round 2 (~80 games/Sovereign)
  const bt2 = solveBradleyTerryElo(N, gamesMat, scoreMat, tier2AnchorIndices, 1200);
  const stage3Order = contenders
    .map((c) => c.idx)
    .sort((a, b) => bt2.elo[a] - bt2.elo[b] || a - b);
  const stage3Specs = buildRoundPairings(
    stage3Order,
    [1, 2, 3, 5, 8, 12, 17, 24, 34, 48],
    2,
    pairCountUsed
  );
  await executePairings('Etapa 3/4 — Suíço de Alta Precisão II', stage3Specs);

  // Stage 4: Top-64 Championship Finisher (direct showdowns among top contenders)
  const bt3 = solveBradleyTerryElo(N, gamesMat, scoreMat, tier2AnchorIndices, 1200);
  const top64Order = contenders
    .map((c) => c.idx)
    .sort((a, b) => bt3.elo[b] - bt3.elo[a] || a - b)
    .slice(0, 64)
    .reverse();
  const stage4Specs = buildRoundPairings(
    top64Order,
    [1, 2, 3, 5, 8, 13],
    3,
    new Map<string, number>()
  );
  await executePairings('Etapa 4/4 — Playoffs Diretos Top-64', stage4Specs);

  for (const w of workers) {
    await w.terminate();
  }

  const btFinal = solveBradleyTerryElo(N, gamesMat, scoreMat, tier2AnchorIndices, 1200);
  const totalLeagueGames = Array.from(totalGamesArr).reduce((s, v) => s + v, 0) / 2;
  const minGamesPerSov = Math.min(...Array.from(totalGamesArr));
  const maxGamesPerSov = Math.max(...Array.from(totalGamesArr));

  const roster: SovereignAiLeaderboardEntry[] = contenders.map((c) => {
    const g = totalGamesArr[c.idx];
    const w = totalWinsArr[c.idx];
    const l = totalLossesArr[c.idx];
    return {
      sovereignId: c.sovereignId,
      sovereignName: c.sovereignName,
      sovereignTitle: c.sovereignTitle,
      realmOrigin: c.realmOrigin,
      archetypeId: c.archetypeId,
      archetypeName: c.archetypeName,
      archetypeSubtitle: c.archetypeSubtitle,
      skillTier: c.skillTier,
      isGrandSovereign: c.isGrandSovereign,
      format: c.format,
      domains: c.domains,
      avatarCardId: c.avatarCardId,
      eloRating: btFinal.elo[c.idx],
      eloRd: btFinal.rd[c.idx],
      simulatedGames: g,
      simulatedWins: w,
      simulatedLosses: l,
      simulatedWinRate: g > 0 ? Math.round((w / g) * 10000) / 10000 : 0.5,
      ...(c.tournamentRankTierV !== undefined ? { tournamentRankTierV: c.tournamentRankTierV } : {}),
    };
  });

  roster.sort((a, b) => b.eloRating - a.eloRating || b.simulatedWinRate - a.simulatedWinRate);

  const uniqueAvatars = new Set(roster.map((r) => r.avatarCardId));
  const uniqueImages = new Set(roster.map((r) => CARDS_BY_ID[r.avatarCardId]?.imagePath));
  if (roster.length !== 276 || uniqueAvatars.size !== 276 || uniqueImages.size !== 276) {
    throw new Error(
      `Uniqueness check failed: len=${roster.length}, cards=${uniqueAvatars.size}, images=${uniqueImages.size}`
    );
  }

  const tierDist = {} as SovereignEloCalibrationSummary['tierEloDistribution'];
  for (const t of [1, 2, 3, 4, 5] as AiSkillTier[]) {
    const vals = roster
      .filter((r) => r.skillTier === t)
      .map((r) => r.eloRating)
      .sort((a, b) => a - b);
    const sum = vals.reduce((s, v) => s + v, 0);
    tierDist[t] = {
      minElo: vals[0] ?? 1000,
      medianElo: vals[Math.floor(vals.length / 2)] ?? 1000,
      meanElo: vals.length > 0 ? Math.round(sum / vals.length) : 1000,
      maxElo: vals[vals.length - 1] ?? 1000,
    };
  }

  const elapsedSec = Math.round(((performance.now() - t0) / 1000) * 10) / 10;
  const updatedSummary = {
    ...SOVEREIGN_ELO_CALIBRATION_SUMMARY,
    generatedAt: new Date().toISOString(),
    totalProfilesCalibrated: 276,
    totalCalibrationMatches: 70004 + Math.round(totalLeagueGames),
    bradleyTerryIterations: btFinal.iterations,
    logLikelihood: Math.round(btFinal.logLikelihood * 100) / 100,
    elapsedSeconds: elapsedSec,
    tierEloDistribution: tierDist,
  };

  const outPath = path.resolve(process.cwd(), 'src/data/sovereignEloLadderData.ts');
  const outContent = `import { AiSkillTier, Domain } from '../types/game';
import type { UnifiedChampionId, UnifiedFormatKind } from './aiUnifiedTournamentData';

/**
 * GERADO AUTOMATICAMENTE POR src/scripts/calibrate276SovereignsLeague.ts
 * Liga Oficial de Calibração ELO Multi-Tier (276 Soberanos Individuais: 100 Lendárias + 176 Raras).
 * Âncora: Mediana Grau II = 1200 ELO (Novos jogadores iniciam em 1000 ELO — Ferro Axial).
 * Cada um dos 276 Soberanos possui vínculo 1-para-1 exclusivo com sua própria carta e Grimório Assinatura de 100 cartas.
 */

export interface CalibratedArchetypeTierCell {
  elo: number;
  rd: number;
  games: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
}

export interface SovereignAiLeaderboardEntry {
  sovereignId: string;
  sovereignName: string;
  sovereignTitle: string;
  realmOrigin: string;
  archetypeId: UnifiedChampionId;
  archetypeName: string;
  archetypeSubtitle: string;
  skillTier: AiSkillTier;
  isGrandSovereign: boolean;
  format: UnifiedFormatKind;
  domains: Domain[];
  avatarCardId: string;
  eloRating: number;
  eloRd: number;
  simulatedGames: number;
  simulatedWins: number;
  simulatedLosses: number;
  simulatedWinRate: number;
  tournamentRankTierV?: number;
}

export interface SovereignEloCalibrationSummary {
  generatedAt: string;
  totalProfilesCalibrated: number;
  totalCalibrationMatches: number;
  tier5ChampionshipMatches: number;
  anchorDescription: string;
  bradleyTerryIterations: number;
  logLikelihood: number;
  elapsedSeconds: number;
  tierEloDistribution: Record<
    AiSkillTier,
    { minElo: number; medianElo: number; meanElo: number; maxElo: number }
  >;
}

export const SOVEREIGN_ELO_CALIBRATION_SUMMARY: SovereignEloCalibrationSummary = ${JSON.stringify(
    updatedSummary,
    null,
    2
  )};

export const ARCHETYPE_TIER_ELO_MAP: Record<
  UnifiedChampionId,
  Record<AiSkillTier, CalibratedArchetypeTierCell>
> = ${JSON.stringify(ARCHETYPE_TIER_ELO_MAP, null, 2)};

export const SOVEREIGN_AI_LEADERBOARD_ROSTER: SovereignAiLeaderboardEntry[] = ${JSON.stringify(
    roster,
    null,
    2
  )};
`;

  fs.writeFileSync(outPath, outContent, 'utf8');

  console.log(
    `\n✓ Calibração dos 276 Soberanos salva em src/data/sovereignEloLadderData.ts!`
  );
  console.log(
    `  Partidas desta liga: ${Math.round(totalLeagueGames)} (${minGamesPerSov}..${maxGamesPerSov} jogos/Soberano) em ${elapsedSec}s`
  );
  console.log(
    `  Amplitude ELO: ${roster[roster.length - 1].eloRating} .. ${roster[0].eloRating} | RD mediano: ±${
      roster.map((r) => r.eloRd).sort((a, b) => a - b)[138]
    } ELO`
  );
  console.log(`  Top 5 Geral:`);
  for (let i = 0; i < 5; i++) {
    const r = roster[i];
    console.log(`    #${i + 1} [${r.eloRating} ELO | T${r.skillTier}] ${r.sovereignName} (${r.avatarCardId})`);
  }
}

if (isMainThread) {
  runMainLeague().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
