import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { isMainThread, parentPort, Worker } from 'node:worker_threads';
import { ALL_CARDS, CARDS_BY_ID } from '../data/cards';
import { PREBUILT_DECKS } from '../data/decks';
import { buildRiftBattleEncounter, FRACTURE_RIFTS } from '../data/fractureRiftsData';
import {
  buildDraftGauntletBoss,
  generateDraftRoundBuckets,
} from '../data/vaeloriaDraftData';
import { UNIFIED_CHAMPION_STANDINGS } from '../data/aiUnifiedTournamentData';
import { resolveChampionDeckAndProfile } from '../data/aiMonocolorMastery';
import {
  chooseMulliganIndicesForActor,
  executeTurnStepForActor,
} from '../engine/aiEngine';
import {
  createInitialGameState,
  getAllBoardUnits,
  mulliganCards,
} from '../engine/gameEngine';
import {
  AiSkillTier,
  ArenaWeatherType,
  CardDefinition,
  ConquestBattleModifiers,
  Domain,
  RiftMutatorId,
} from '../types/game';

interface CardDraftStat {
  draftedCount: number;
  playedGames: number;
  winSum: number;
}

type AsymmetricJobKind = 'draft_batch' | 'weather_batch' | 'rift_batch';

interface WorkerAsymmetricRequest {
  jobId: number;
  kind: AsymmetricJobKind;
  seedOffset: number;
  batchGames: number;
  weatherType?: ArenaWeatherType;
  riftId?: string;
}

interface WorkerAsymmetricResponse {
  jobId: number;
  kind: AsymmetricJobKind;
  weatherType?: ArenaWeatherType;
  riftId?: string;
  gamesPlayed: number;
  playerScoreSum: number;
  totalTurnsSum: number;
  domainWins: Record<Domain, { games: number; scoreSum: number }>;
  cardStats: Array<[string, CardDraftStat]>;
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

function resolveDeckCards(ids: string[]): CardDefinition[] {
  const out: CardDefinition[] = [];
  for (const cid of ids) {
    const c = CARDS_BY_ID[cid];
    if (c) out.push(c);
  }
  return out;
}

function runFastTierDuel(
  pCards: CardDefinition[],
  aCards: CardDefinition[],
  pTier: AiSkillTier,
  aTier: AiSkillTier,
  modifiers: ConquestBattleModifiers | null,
  aiStartingHp?: number,
  playedPOut?: Set<string>
): { scoreP: number; turns: number } {
  let state = createInitialGameState(pCards, aCards, {
    playerName: 'Desafiante',
    aiName: 'Guardião',
    aiStartingHp,
    playerSkillTier: pTier,
    aiSkillTier: aTier,
    conquestModifiers: modifiers ?? undefined,
  });

  const pSwap = chooseMulliganIndicesForActor(state, 'player', undefined, pTier);
  state = mulliganCards(state, 'player', pSwap);
  const aSwap = chooseMulliganIndicesForActor(state, 'ai', undefined, aTier);
  state = mulliganCards(state, 'ai', aSwap);

  let steps = 0;
  while (state.phase !== 'gameover' && state.turn <= 32 && steps < 750) {
    steps += 1;
    const active = state.activePlayer;
    const prevHandP = state.player.hand;
    const prevChanP = state.player.channeledCards.length;

    const step = executeTurnStepForActor(state, active, {
      playerSkillTier: pTier,
      aiSkillTier: aTier,
      fastRollout: true,
    });
    const next = step.nextState;

    if (
      playedPOut &&
      next.player.channeledCards.length === prevChanP &&
      next.player.hand.length < prevHandP.length
    ) {
      const rem = new Map<string, number>();
      for (const c of next.player.hand) rem.set(c.id, (rem.get(c.id) ?? 0) + 1);
      for (const c of prevHandP) {
        const cnt = rem.get(c.id) ?? 0;
        if (cnt > 0) rem.set(c.id, cnt - 1);
        else playedPOut.add(c.id);
      }
    }
    state = next;
  }

  let scoreP = 0.5;
  if (state.phase === 'gameover' && state.winner === 'player') scoreP = 1;
  else if (state.phase === 'gameover' && state.winner === 'ai') scoreP = 0;
  else {
    const pB = getAllBoardUnits(state.player).reduce((s, u) => s + u.currentAtk + u.currentHp, 0);
    const aB = getAllBoardUnits(state.ai).reduce((s, u) => s + u.currentAtk + u.currentHp, 0);
    scoreP = clamp(0.5 + (state.player.hp - state.ai.hp + (pB - aB) * 0.4) / 60, 0.15, 0.85);
  }
  return { scoreP, turns: state.turn };
}

function scoreDraftBucketAnalytical(cardIds: [string, string]): number {
  let total = 0;
  for (const cid of cardIds) {
    const c = CARDS_BY_ID[cid];
    if (!c) continue;
    let s = (c.atk + c.hp) / Math.max(1.4, c.cost + 0.8);
    if (c.rarity === 'legendary') s += 1.4;
    else if (c.rarity === 'rare') s += 0.8;
    else if (c.rarity === 'uncommon') s += 0.35;
    if (c.keywords.includes('Voo') || c.keywords.includes('Escudo Divino')) s += 0.65;
    if (c.keywords.includes('Guardião') || c.keywords.includes('Ímpeto')) s += 0.45;
    if (c.keywords.includes('Dreno de Vida') || c.keywords.includes('Toque Letal')) s += 0.55;
    if (c.effects.some((e) => e.type === 'draw_cards' || e.type === 'destroy_enemy')) s += 0.65;
    total += s;
  }
  return total;
}

// ============================================================================
// WORKER ENTRYPOINT
// ============================================================================
if (!isMainThread && parentPort) {
  const coloredDomains: Domain[] = ['red', 'blue', 'purple', 'green', 'gold'];
  const allLegendsByDomain: Record<Domain, CardDefinition[]> = {
    red: ALL_CARDS.filter((c) => c.domain === 'red' && c.rarity === 'legendary'),
    blue: ALL_CARDS.filter((c) => c.domain === 'blue' && c.rarity === 'legendary'),
    purple: ALL_CARDS.filter((c) => c.domain === 'purple' && c.rarity === 'legendary'),
    green: ALL_CARDS.filter((c) => c.domain === 'green' && c.rarity === 'legendary'),
    gold: ALL_CARDS.filter((c) => c.domain === 'gold' && c.rarity === 'legendary'),
    neutral: ALL_CARDS.filter((c) => c.domain === 'neutral' && c.rarity === 'legendary'),
  };

  parentPort.on('message', (req: WorkerAsymmetricRequest) => {
    const domainWins: Record<Domain, { games: number; scoreSum: number }> = {
      red: { games: 0, scoreSum: 0 },
      blue: { games: 0, scoreSum: 0 },
      purple: { games: 0, scoreSum: 0 },
      green: { games: 0, scoreSum: 0 },
      gold: { games: 0, scoreSum: 0 },
      neutral: { games: 0, scoreSum: 0 },
    };
    const cardStats = new Map<string, CardDraftStat>();
    let playerScoreSum = 0;
    let totalTurnsSum = 0;

    if (req.kind === 'draft_batch') {
      for (let g = 0; g < req.batchGames; g++) {
        const dom = coloredDomains[(req.seedOffset + g) % coloredDomains.length];
        const sovPool = allLegendsByDomain[dom];
        const sovCard = sovPool[(req.seedOffset + g * 3) % sovPool.length];
        const drafted: string[] = [];

        for (let round = 1; round <= 20; round++) {
          const buckets = generateDraftRoundBuckets(dom, round, drafted);
          // Smart drafter with slight exploration temperature
          buckets.sort(
            (a, b) =>
              scoreDraftBucketAnalytical(b.cardIds) -
              scoreDraftBucketAnalytical(a.cardIds) +
              (Math.random() - 0.5) * 0.9
          );
          const pick = buckets[0];
          drafted.push(...pick.cardIds);
        }

        const deckIds = [sovCard.id, ...drafted.filter((x) => x !== sovCard.id)].slice(0, 40);
        for (const cid of new Set(deckIds)) {
          const st = cardStats.get(cid) ?? { draftedCount: 0, playedGames: 0, winSum: 0 };
          st.draftedCount += 1;
          cardStats.set(cid, st);
        }

        const winsStage = (req.seedOffset + g) % 7; // 0..6
        const { boss, modifiers } = buildDraftGauntletBoss(winsStage, `sim_${req.seedOffset}_${g}`);
        const bossDeckIds =
          boss.customDeckCardIds && boss.customDeckCardIds.length >= 40
            ? boss.customDeckCardIds
            : (PREBUILT_DECKS.find((d) => d.id === boss.deckId)?.cardIds ?? PREBUILT_DECKS[0].cardIds);

        const playedP = new Set<string>();
        const aiTier = (clamp(Math.floor(winsStage / 2) + 2, 2, 5) as AiSkillTier);
        const res = runFastTierDuel(
          resolveDeckCards(deckIds),
          resolveDeckCards(bossDeckIds),
          4,
          aiTier,
          modifiers,
          boss.startingHp,
          playedP
        );

        playerScoreSum += res.scoreP;
        totalTurnsSum += res.turns;
        domainWins[dom].games += 1;
        domainWins[dom].scoreSum += res.scoreP;

        for (const cid of playedP) {
          const st = cardStats.get(cid) ?? { draftedCount: 1, playedGames: 0, winSum: 0 };
          st.playedGames += 1;
          st.winSum += res.scoreP;
          cardStats.set(cid, st);
        }
      }
    } else if (req.kind === 'weather_batch' && req.weatherType) {
      const N = UNIFIED_CHAMPION_STANDINGS.length;
      for (let g = 0; g < req.batchGames; g++) {
        const stA = UNIFIED_CHAMPION_STANDINGS[(req.seedOffset + g * 5) % N];
        const stB = UNIFIED_CHAMPION_STANDINGS[(req.seedOffset + g * 5 + 11) % N];
        const setupA = resolveChampionDeckAndProfile(stA.archetypeId, 4);
        const setupB = resolveChampionDeckAndProfile(stB.archetypeId, 4);
        if (!setupA || !setupB) continue;

        const mods: ConquestBattleModifiers = {
          provinceId: `weather_audit_${req.weatherType}`,
          provinceName: `Auditoria Climática (${req.weatherType})`,
          provinceDomain: stA.domains[0],
          isDefensiveSiege: false,
          isCapitalSiege: false,
          playerBonusHp: 0,
          playerBonusEssence: 0,
          enemyOpeningDamage: 0,
          vanguardArmorBonus: 0,
          relicDiscount: false,
          dragonSkyBonus: false,
          legendaryWheelBonus: false,
          bannerSummary: `Clima: ${req.weatherType}`,
          initialWeather: req.weatherType,
        };

        const res = runFastTierDuel(
          resolveDeckCards(setupA.cardIds),
          resolveDeckCards(setupB.cardIds),
          4,
          4,
          mods
        );
        playerScoreSum += res.scoreP;
        totalTurnsSum += res.turns;
        const dA = stA.domains[0];
        const dB = stB.domains[0];
        domainWins[dA].games += 1;
        domainWins[dA].scoreSum += res.scoreP;
        domainWins[dB].games += 1;
        domainWins[dB].scoreSum += 1 - res.scoreP;
      }
    } else if (req.kind === 'rift_batch' && req.riftId) {
      const N = UNIFIED_CHAMPION_STANDINGS.length;
      for (let g = 0; g < req.batchGames; g++) {
        const stA = UNIFIED_CHAMPION_STANDINGS[(req.seedOffset + g * 3) % N];
        const setupA = resolveChampionDeckAndProfile(stA.archetypeId, 4);
        if (!setupA) continue;
        const { boss, modifiers } = buildRiftBattleEncounter(req.riftId as RiftMutatorId);
        const bossDeckIds =
          boss.customDeckCardIds && boss.customDeckCardIds.length >= 40
            ? boss.customDeckCardIds
            : (PREBUILT_DECKS.find((d) => d.id === boss.deckId)?.cardIds ?? PREBUILT_DECKS[0].cardIds);

        const res = runFastTierDuel(
          resolveDeckCards(setupA.cardIds),
          resolveDeckCards(bossDeckIds),
          4,
          (boss.difficultyTier ?? 4) as AiSkillTier,
          modifiers,
          boss.startingHp
        );
        playerScoreSum += res.scoreP;
        totalTurnsSum += res.turns;
        const dA = stA.domains[0];
        domainWins[dA].games += 1;
        domainWins[dA].scoreSum += res.scoreP;
      }
    }

    const out: WorkerAsymmetricResponse = {
      jobId: req.jobId,
      kind: req.kind,
      weatherType: req.weatherType,
      riftId: req.riftId,
      gamesPlayed: req.batchGames,
      playerScoreSum,
      totalTurnsSum,
      domainWins,
      cardStats: Array.from(cardStats.entries()),
    };
    parentPort!.postMessage(out);
  });
}

class AsymmetricPool {
  private workers: Worker[] = [];
  private idle: Worker[] = [];
  private queue: Array<{
    req: WorkerAsymmetricRequest;
    resolve: (r: WorkerAsymmetricResponse) => void;
    reject: (e: Error) => void;
  }> = [];
  private pending = new Map<
    number,
    { resolve: (r: WorkerAsymmetricResponse) => void; reject: (e: Error) => void }
  >();
  private seq = 1;

  constructor(size: number) {
    const url = new URL(import.meta.url);
    for (let i = 0; i < size; i++) {
      const w = new Worker(url, { execArgv: ['--import', 'tsx'] });
      w.on('message', (msg: WorkerAsymmetricResponse) => {
        const p = this.pending.get(msg.jobId);
        if (p) {
          this.pending.delete(msg.jobId);
          p.resolve(msg);
        }
        this.idle.push(w);
        this.pump();
      });
      w.on('error', (err) => {
        for (const p of this.pending.values()) p.reject(err);
        this.pending.clear();
      });
      this.workers.push(w);
      this.idle.push(w);
    }
  }

  run(req: Omit<WorkerAsymmetricRequest, 'jobId'>): Promise<WorkerAsymmetricResponse> {
    const jobId = this.seq++;
    return new Promise((resolve, reject) => {
      this.queue.push({ req: { ...req, jobId }, resolve, reject });
      this.pump();
    });
  }

  private pump(): void {
    while (this.idle.length > 0 && this.queue.length > 0) {
      const w = this.idle.pop()!;
      const item = this.queue.shift()!;
      this.pending.set(item.req.jobId, { resolve: item.resolve, reject: item.reject });
      w.postMessage(item.req);
    }
  }

  async close(): Promise<void> {
    await Promise.all(this.workers.map((w) => w.terminate()));
  }
}

async function runStage3(): Promise<void> {
  const t0 = Date.now();
  const numWorkers = Math.max(2, Math.min(10, os.cpus().length - 2));

  console.log(
    `================================================================================\n` +
      ` ESTÁGIO 3 — AUDITORIA DE MODOS ASSIMÉTRICOS (CRISOL 40c, 6 CLIMAS & 6 FENDAS)\n` +
      ` Workers: ${numWorkers}\n` +
      `================================================================================`
  );

  const pool = new AsymmetricPool(numWorkers);
  const weatherTypes: ArenaWeatherType[] = [
    'ash_storm',
    'astral_blizzard',
    'umbral_eclipse',
    'sylvan_monsoon',
    'solar_zenith',
    'astral_convergence',
  ];

  const draftCardAgg = new Map<string, CardDraftStat>();
  let draftTotalGames = 0;
  let draftWinSum = 0;
  let draftTurnsSum = 0;

  const weatherAgg: Record<
    ArenaWeatherType,
    {
      games: number;
      scoreSum: number;
      turnsSum: number;
      domainWins: Record<Domain, { games: number; scoreSum: number }>;
    }
  > = {} as never;
  for (const w of weatherTypes) {
    weatherAgg[w] = {
      games: 0,
      scoreSum: 0,
      turnsSum: 0,
      domainWins: {
        red: { games: 0, scoreSum: 0 },
        blue: { games: 0, scoreSum: 0 },
        purple: { games: 0, scoreSum: 0 },
        green: { games: 0, scoreSum: 0 },
        gold: { games: 0, scoreSum: 0 },
        neutral: { games: 0, scoreSum: 0 },
      },
    };
  }

  const riftAgg: Record<
    string,
    {
      games: number;
      scoreSum: number;
      turnsSum: number;
      domainWins: Record<Domain, { games: number; scoreSum: number }>;
    }
  > = {};
  for (const r of FRACTURE_RIFTS) {
    riftAgg[r.id] = {
      games: 0,
      scoreSum: 0,
      turnsSum: 0,
      domainWins: {
        red: { games: 0, scoreSum: 0 },
        blue: { games: 0, scoreSum: 0 },
        purple: { games: 0, scoreSum: 0 },
        green: { games: 0, scoreSum: 0 },
        gold: { games: 0, scoreSum: 0 },
        neutral: { games: 0, scoreSum: 0 },
      },
    };
  }

  try {
    const jobs: Promise<void>[] = [];

    // 1. 40-Card Draft Crucible: 40 batches x 90 games = 3,600 full Draft Gauntlet games
    for (let b = 0; b < 40; b++) {
      jobs.push(
        pool
          .run({ kind: 'draft_batch', seedOffset: b * 97, batchGames: 90 })
          .then((res) => {
            draftTotalGames += res.gamesPlayed;
            draftWinSum += res.playerScoreSum;
            draftTurnsSum += res.totalTurnsSum;
            for (const [cid, st] of res.cardStats) {
              const cur = draftCardAgg.get(cid) ?? {
                draftedCount: 0,
                playedGames: 0,
                winSum: 0,
              };
              cur.draftedCount += st.draftedCount;
              cur.playedGames += st.playedGames;
              cur.winSum += st.winSum;
              draftCardAgg.set(cid, cur);
            }
          })
      );
    }

    // 2. 6 Weathers: 6 x 6 batches x 100 games = 3,600 Weather games
    weatherTypes.forEach((wt, wIdx) => {
      for (let b = 0; b < 6; b++) {
        jobs.push(
          pool
            .run({
              kind: 'weather_batch',
              weatherType: wt,
              seedOffset: wIdx * 500 + b * 83,
              batchGames: 100,
            })
            .then((res) => {
              const agg = weatherAgg[wt];
              agg.games += res.gamesPlayed;
              agg.scoreSum += res.playerScoreSum;
              agg.turnsSum += res.totalTurnsSum;
              for (const dom of Object.keys(res.domainWins) as Domain[]) {
                agg.domainWins[dom].games += res.domainWins[dom].games;
                agg.domainWins[dom].scoreSum += res.domainWins[dom].scoreSum;
              }
            })
        );
      }
    });

    // 3. 6 Fracture Rifts: 6 x 6 batches x 100 games = 3,600 Rift games
    FRACTURE_RIFTS.forEach((rift, rIdx) => {
      for (let b = 0; b < 6; b++) {
        jobs.push(
          pool
            .run({
              kind: 'rift_batch',
              riftId: rift.id,
              seedOffset: rIdx * 600 + b * 79,
              batchGames: 100,
            })
            .then((res) => {
              const agg = riftAgg[rift.id];
              agg.games += res.gamesPlayed;
              agg.scoreSum += res.playerScoreSum;
              agg.turnsSum += res.totalTurnsSum;
              for (const dom of Object.keys(res.domainWins) as Domain[]) {
                agg.domainWins[dom].games += res.domainWins[dom].games;
                agg.domainWins[dom].scoreSum += res.domainWins[dom].scoreSum;
              }
            })
        );
      }
    });

    await Promise.all(jobs);
  } finally {
    await pool.close();
  }

  const elapsedSeconds = Number(((Date.now() - t0) / 1000).toFixed(1));
  const totalMatches =
    draftTotalGames +
    Object.values(weatherAgg).reduce((s, x) => s + x.games, 0) +
    Object.values(riftAgg).reduce((s, x) => s + x.games, 0);

  // Compute Bayesian-shrunk Draft Pick Scores & Tiers (S / A / B / C) for all 1,038 cards
  const globalDraftWr = draftTotalGames > 0 ? draftWinSum / draftTotalGames : 0.52;
  const rawCardDraftRatings: Array<{
    cardId: string;
    score: number;
    playedGames: number;
    winRate: number;
  }> = [];

  for (const card of ALL_CARDS) {
    const st = draftCardAgg.get(card.id);
    const played = st?.playedGames ?? 0;
    const empWr = played > 0 ? st!.winSum / played : globalDraftWr;
    // Prior analytical draft value mapped around [0.44, 0.62]
    const analytical = clamp(0.42 + scoreDraftBucketAnalytical([card.id, card.id]) * 0.025, 0.42, 0.64);
    const blendedScore = (played * empWr + 14 * analytical) / (played + 14);
    rawCardDraftRatings.push({
      cardId: card.id,
      score: Number((blendedScore * 100).toFixed(1)),
      playedGames: played,
      winRate: Number(empWr.toFixed(3)),
    });
  }

  const sortedByScore = rawCardDraftRatings.slice().sort((a, b) => b.score - a.score);
  const sCutoff = sortedByScore[Math.floor(sortedByScore.length * 0.14)]?.score ?? 58;
  const aCutoff = sortedByScore[Math.floor(sortedByScore.length * 0.42)]?.score ?? 53;
  const bCutoff = sortedByScore[Math.floor(sortedByScore.length * 0.78)]?.score ?? 49;

  const draftPickTiers: Record<
    string,
    { tier: 'S' | 'A' | 'B' | 'C'; score: number; playedGames: number; winRate: number }
  > = {};
  for (const item of rawCardDraftRatings) {
    const tier: 'S' | 'A' | 'B' | 'C' =
      item.score >= sCutoff
        ? 'S'
        : item.score >= aCutoff
        ? 'A'
        : item.score >= bCutoff
        ? 'B'
        : 'C';
    draftPickTiers[item.cardId] = {
      tier,
      score: item.score,
      playedGames: item.playedGames,
      winRate: item.winRate,
    };
  }

  const weatherReport = weatherTypes.map((wt) => {
    const agg = weatherAgg[wt];
    let bestDomain: Domain = 'neutral';
    let bestDomWr = 0;
    for (const dom of Object.keys(agg.domainWins) as Domain[]) {
      const dw = agg.domainWins[dom];
      if (dw.games >= 20) {
        const wr = dw.scoreSum / dw.games;
        if (wr > bestDomWr) {
          bestDomWr = wr;
          bestDomain = dom;
        }
      }
    }
    return {
      weatherType: wt,
      gamesSimulated: agg.games,
      firstActorWinRate: Number((agg.scoreSum / Math.max(1, agg.games)).toFixed(4)),
      avgTurns: Number((agg.turnsSum / Math.max(1, agg.games)).toFixed(1)),
      topDomain: bestDomain,
      topDomainWinRate: Number(bestDomWr.toFixed(4)),
    };
  });

  const riftReport = FRACTURE_RIFTS.map((r) => {
    const agg = riftAgg[r.id];
    let bestDomain: Domain = 'neutral';
    let bestDomWr = 0;
    for (const dom of Object.keys(agg.domainWins) as Domain[]) {
      const dw = agg.domainWins[dom];
      if (dw.games >= 15) {
        const wr = dw.scoreSum / dw.games;
        if (wr > bestDomWr) {
          bestDomWr = wr;
          bestDomain = dom;
        }
      }
    }
    return {
      riftId: r.id,
      riftName: r.name,
      gamesSimulated: agg.games,
      challengerWinRate: Number((agg.scoreSum / Math.max(1, agg.games)).toFixed(4)),
      avgTurns: Number((agg.turnsSum / Math.max(1, agg.games)).toFixed(1)),
      bestCounterDomain: bestDomain,
      bestCounterWinRate: Number(bestDomWr.toFixed(4)),
    };
  });

  const summary = {
    generatedAt: new Date().toISOString(),
    totalAsymmetricMatches: totalMatches,
    draftMatches: draftTotalGames,
    draftChallengerAvgWinRate: Number(globalDraftWr.toFixed(4)),
    draftAvgTurns: Number((draftTurnsSum / Math.max(1, draftTotalGames)).toFixed(1)),
    elapsedSeconds,
    weatherReport,
    riftReport,
  };

  const outPath = path.resolve(process.cwd(), 'src/data/asymmetricAuditData.ts');
  const fileContent = `import { ArenaWeatherType, Domain } from '../types/game';

/**
 * GERADO AUTOMATICAMENTE POR src/scripts/runAsymmetricModesAudit.ts
 * Auditoria Assimétrica Pós-Evolução: ${totalMatches.toLocaleString()} partidas (${elapsedSeconds}s em ${numWorkers} threads)
 * • Crisol dos Cinco Selos (Draft 40 Cartas): ${draftTotalGames.toLocaleString()} duelos
 * • 6 Climas Regionais: ${(weatherTypes.length * 600).toLocaleString()} duelos
 * • 6 Fendas da Fratura: ${(FRACTURE_RIFTS.length * 600).toLocaleString()} duelos
 */

export type DraftPickTier = 'S' | 'A' | 'B' | 'C';

export interface DraftCardPickRating {
  tier: DraftPickTier;
  score: number;
  playedGames: number;
  winRate: number;
}

export interface WeatherAuditMetric {
  weatherType: ArenaWeatherType;
  gamesSimulated: number;
  firstActorWinRate: number;
  avgTurns: number;
  topDomain: Domain;
  topDomainWinRate: number;
}

export interface FractureRiftAuditMetric {
  riftId: string;
  riftName: string;
  gamesSimulated: number;
  challengerWinRate: number;
  avgTurns: number;
  bestCounterDomain: Domain;
  bestCounterWinRate: number;
}

export interface AsymmetricAuditSummary {
  generatedAt: string;
  totalAsymmetricMatches: number;
  draftMatches: number;
  draftChallengerAvgWinRate: number;
  draftAvgTurns: number;
  elapsedSeconds: number;
  weatherReport: WeatherAuditMetric[];
  riftReport: FractureRiftAuditMetric[];
}

export const ASYMMETRIC_AUDIT_SUMMARY: AsymmetricAuditSummary = ${JSON.stringify(summary, null, 2)};

export const DRAFT_CARD_PICK_TIERS: Record<string, DraftCardPickRating> = ${JSON.stringify(
    draftPickTiers
  )};

export function getDraftCardPickRating(cardId: string): DraftCardPickRating {
  return DRAFT_CARD_PICK_TIERS[cardId] ?? { tier: 'B', score: 50, playedGames: 0, winRate: 0.5 };
}
`;

  fs.writeFileSync(outPath, fileContent, 'utf-8');
  console.log(
    `\n================================================================================\n` +
      ` ESTÁGIO 3 CONCLUÍDO EM ${elapsedSeconds}s!\n` +
      ` • Total de Partidas Assimétricas: ${totalMatches.toLocaleString()}\n` +
      ` • Salvo em: ${outPath}\n` +
      `================================================================================`
  );
}

if (isMainThread) {
  runStage3().catch((err) => {
    console.error('Erro fatal no Estágio 3 (runAsymmetricModesAudit):', err);
    process.exit(1);
  });
}
