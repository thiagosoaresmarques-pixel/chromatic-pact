import { BoardUnit, Domain, GameState, PlayerState } from '../types/game';

/**
 * ============================================================================
 * REDE NEURAL LEVE DE VALOR TÁTICO (PURE-TS VALUE MLP: 48 -> 64 -> 32 -> 1)
 * ============================================================================
 * Avalia estados não-lineares de Chromatic Pact estimando V(s) em [-1, +1]
 * sob a perspectiva do ator ('player' | 'ai'), treinada offline via Self-Play
 * Temporal-Difference / Monte-Carlo Returns com otimizador Mini-Batch Adam.
 */

export const VALUE_MLP_INPUT_DIM = 48;
export const VALUE_MLP_H1_DIM = 64;
export const VALUE_MLP_H2_DIM = 32;
const LEAKY_SLOPE = 0.1;

export interface SerializedValueMlp {
  domain: Domain;
  architecture: [number, number, number, 1];
  samplesTrained: number;
  epochs: number;
  initialMse: number;
  finalMse: number;
  signAccuracy: number;
  /** Flattened row-major [H1 x IN] = 64 * 48 = 3072 */
  w1: number[];
  /** [H1] = 64 */
  b1: number[];
  /** Flattened row-major [H2 x H1] = 32 * 64 = 2048 */
  w2: number[];
  /** [H2] = 32 */
  b2: number[];
  /** [H2] = 32 */
  w3: number[];
  /** Scalar output bias */
  b3: number;
}

export interface ValueTrainingSample {
  features: Float64Array;
  target: number; // [-1, +1] discounted outcome from actor's perspective
  weight: number; // Sample importance (e.g. late-game / decisive turns weighted higher)
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

function collectSideBoardMetrics(side: PlayerState): {
  vanAtk: number;
  vanEhp: number;
  rearAtk: number;
  rearEhp: number;
  creatureCount: number;
  relicCount: number;
  trapCount: number;
  guardianCount: number;
  flyingOrReachCount: number;
  combatKwCount: number;
  eliteCount: number;
  frozenCount: number;
  readyColAtk: Float64Array;
  readyEvasiveAtk: number;
  hasVanguardInCol: Uint8Array;
  hasAirBlockerInCol: Uint8Array;
  hasGuardianAnywhere: boolean;
} {
  let vanAtk = 0;
  let vanEhp = 0;
  let rearAtk = 0;
  let rearEhp = 0;
  let creatureCount = 0;
  let relicCount = 0;
  let trapCount = 0;
  let guardianCount = 0;
  let flyingOrReachCount = 0;
  let combatKwCount = 0;
  let eliteCount = 0;
  let frozenCount = 0;
  let readyEvasiveAtk = 0;
  let hasGuardianAnywhere = false;

  const numCols = side.vanguardStacks.length;
  const readyColAtk = new Float64Array(numCols);
  const hasVanguardInCol = new Uint8Array(numCols);
  const hasAirBlockerInCol = new Uint8Array(numCols);

  const processStack = (stack: BoardUnit[], isVanguard: boolean, col: number) => {
    for (let i = 0; i < stack.length; i++) {
      const u = stack[i];
      if (!u || u.currentHp <= 0) continue;
      if (u.isTrap) {
        trapCount += 1;
        continue;
      }
      if (u.card.type === 'relic') {
        relicCount += 1;
        continue;
      }
      creatureCount += 1;
      const atk = Math.max(0, u.currentAtk);
      const ehp =
        u.currentHp +
        Math.max(0, u.currentArmor) * 2.2 +
        (u.hasDivineShield ? 3.5 : 0) +
        (u.regeneration > 0 ? u.regeneration * 1.5 : 0);

      if (isVanguard) {
        vanAtk += atk;
        vanEhp += ehp;
        hasVanguardInCol[col] = 1;
      } else {
        rearAtk += atk;
        rearEhp += ehp;
      }

      const kws = u.keywords;
      let isFlying = false;
      let isReach = false;
      for (let k = 0; k < kws.length; k++) {
        const kw = kws[k];
        if (kw === 'Guardião') {
          guardianCount += 1;
          if (!u.isFrozen) hasGuardianAnywhere = true;
        } else if (kw === 'Voo') {
          isFlying = true;
          flyingOrReachCount += 1;
        } else if (kw === 'Alcance') {
          isReach = true;
          flyingOrReachCount += 1;
        } else if (kw === 'Toque Letal' || kw === 'Atropelar' || kw === 'Dreno de Vida') {
          combatKwCount += 1;
        }
      }

      if ((isFlying || isReach) && !u.isFrozen) {
        hasAirBlockerInCol[col] = 1;
      }
      if (u.isAscended || u.card.rarity === 'legendary') {
        eliteCount += 1;
      }
      if (u.isFrozen) {
        frozenCount += 1;
      }

      const canStrikeSoon = !u.isFrozen && (!u.hasSummoningSickness || kws.includes('Ímpeto'));
      if (canStrikeSoon && atk > 0) {
        readyColAtk[col] += atk;
        if (isFlying || isReach) {
          readyEvasiveAtk += atk;
        }
      }
    }
  };

  for (let col = 0; col < numCols; col++) {
    processStack(side.vanguardStacks[col] ?? [], true, col);
    processStack(side.rearguardStacks[col] ?? [], false, col);
  }

  return {
    vanAtk,
    vanEhp,
    rearAtk,
    rearEhp,
    creatureCount,
    relicCount,
    trapCount,
    guardianCount,
    flyingOrReachCount,
    combatKwCount,
    eliteCount,
    frozenCount,
    readyColAtk,
    readyEvasiveAtk,
    hasVanguardInCol,
    hasAirBlockerInCol,
    hasGuardianAnywhere,
  };
}

function getPeakDomainAffinity(side: PlayerState): number {
  const a = side.affinities;
  const coloredSum =
    (a.red ?? 0) + (a.blue ?? 0) + (a.purple ?? 0) + (a.green ?? 0) + (a.gold ?? 0);
  if (coloredSum === 0 && (a.neutral ?? 0) > 0) {
    return a.neutral ?? 0;
  }
  return Math.max(a.red ?? 0, a.blue ?? 0, a.purple ?? 0, a.green ?? 0, a.gold ?? 0);
}

// Reusable scratch buffers for zero-allocation inference in tight search loops
const SCRATCH_FEATURES = new Float64Array(VALUE_MLP_INPUT_DIM);
const SCRATCH_H1 = new Float64Array(VALUE_MLP_H1_DIM);
const SCRATCH_H2 = new Float64Array(VALUE_MLP_H2_DIM);

/**
 * Extracts 48 normalized [-1, +1] tactical state features from `actor`'s perspective.
 */
export function extractNormalizedStateFeatures(
  state: GameState,
  actor: 'player' | 'ai',
  out?: Float64Array
): Float64Array {
  const f = out ?? new Float64Array(VALUE_MLP_INPUT_DIM);
  const enemyActor: 'player' | 'ai' = actor === 'player' ? 'ai' : 'player';
  const me = state[actor];
  const opp = state[enemyActor];

  const myBoard = collectSideBoardMetrics(me);
  const oppBoard = collectSideBoardMetrics(opp);

  const numCols = me.vanguardStacks.length;
  let myUnblockedFaceDmg = 0;
  let oppUnblockedFaceDmg = 0;
  let myOpenCols = 0;
  let oppOpenCols = 0;

  for (let col = 0; col < numCols; col++) {
    if (myBoard.readyColAtk[col] > 0) {
      if (!oppBoard.hasVanguardInCol[col] && !oppBoard.hasGuardianAnywhere) {
        myUnblockedFaceDmg += myBoard.readyColAtk[col];
        myOpenCols += 1;
      } else if (!oppBoard.hasAirBlockerInCol[col] && !oppBoard.hasGuardianAnywhere) {
        myUnblockedFaceDmg += myBoard.readyColAtk[col] * 0.45;
      }
    }
    if (oppBoard.readyColAtk[col] > 0) {
      if (!myBoard.hasVanguardInCol[col] && !myBoard.hasGuardianAnywhere) {
        oppUnblockedFaceDmg += oppBoard.readyColAtk[col];
        oppOpenCols += 1;
      } else if (!myBoard.hasAirBlockerInCol[col] && !myBoard.hasGuardianAnywhere) {
        oppUnblockedFaceDmg += oppBoard.readyColAtk[col] * 0.45;
      }
    }
  }

  const myDirectThreat = Math.max(myUnblockedFaceDmg, myBoard.readyEvasiveAtk * 0.8);
  const oppDirectThreat = Math.max(oppUnblockedFaceDmg, oppBoard.readyEvasiveAtk * 0.8);

  let myAffordableHand = 0;
  let myBurnOrRemoval = 0;
  let myDefenseInHand = 0;
  let hasAntiDomainCard = 0;
  const refEssence = Math.max(me.currentEssence, me.maxEssence);

  for (let i = 0; i < me.hand.length; i++) {
    const c = me.hand[i];
    const reqAff = c.domain === 'neutral' ? 0 : c.affinityReq;
    const curAff = c.domain === 'neutral' ? 99 : me.affinities[c.domain] ?? 0;
    if (c.cost <= refEssence && curAff >= reqAff) {
      myAffordableHand += 1;
    }
    if (c.keywords.includes('Guardião') || c.keywords.includes('Escudo Divino')) {
      myDefenseInHand += 1;
    }
    for (let eIdx = 0; eIdx < c.effects.length; eIdx++) {
      const eff = c.effects[eIdx].type;
      if (
        eff === 'damage_enemy_sovereign' ||
        eff === 'damage_single_enemy' ||
        eff === 'damage_enemy_row' ||
        eff === 'damage_all_units' ||
        eff === 'destroy_enemy' ||
        eff === 'freeze_enemy' ||
        eff === 'freeze_enemy_vanguard'
      ) {
        myBurnOrRemoval += 1;
      } else if (
        eff === 'heal_sovereign' ||
        eff === 'heal_all_allies' ||
        eff === 'shield_all_allies'
      ) {
        myDefenseInHand += 1;
      } else if (eff === 'break_domain_expansion') {
        hasAntiDomainCard = 1;
      }
    }
  }

  let domainExpFeature = 0;
  if (state.domainExpansion) {
    if (state.domainExpansion.clashRival) {
      domainExpFeature = 0;
    } else {
      const sign = state.domainExpansion.owner === actor ? 1 : -1;
      domainExpFeature = sign * clamp(state.domainExpansion.turnsRemaining / 3, 0.33, 1);
    }
  }

  const myPeakAff = getPeakDomainAffinity(me);
  const oppPeakAff = getPeakDomainAffinity(opp);
  const myDomainReady =
    hasAntiDomainCard || (myPeakAff >= 5 && me.maxEssence >= 6 && (me.domainExhaustionTurns ?? 0) === 0)
      ? 1
      : myPeakAff / 6;

  f[0] = clamp(me.hp / Math.max(20, me.maxHp), 0, 1.5) - 0.5;
  f[1] = clamp(opp.hp / Math.max(20, opp.maxHp), 0, 1.5) - 0.5;
  f[2] = clamp((me.hp - opp.hp) / 30, -1, 1);
  f[3] = clamp((14 - me.hp) / 14, 0, 1);
  f[4] = clamp((14 - opp.hp) / 14, 0, 1);
  f[5] = clamp(me.corruption / 10, 0, 1);
  f[6] = clamp(opp.corruption / 10, 0, 1);
  f[7] = clamp(me.maxEssence / 10, 0, 1);
  f[8] = clamp((me.maxEssence - opp.maxEssence) / 6, -1, 1);
  f[9] = clamp(me.currentEssence / 10, 0, 1);
  f[10] = clamp(me.hand.length / 8, 0, 1);
  f[11] = clamp((me.hand.length - opp.hand.length) / 6, -1, 1);
  f[12] = clamp(me.crypt.length / 15, 0, 1);
  f[13] = clamp(opp.crypt.length / 15, 0, 1);
  f[14] = clamp(myPeakAff / 6, 0, 1);
  f[15] = clamp(oppPeakAff / 6, 0, 1);
  f[16] = clamp(myBoard.vanAtk / 24, 0, 1);
  f[17] = clamp(myBoard.vanEhp / 36, 0, 1);
  f[18] = clamp(myBoard.rearAtk / 20, 0, 1);
  f[19] = clamp(myBoard.rearEhp / 28, 0, 1);
  f[20] = clamp(oppBoard.vanAtk / 24, 0, 1);
  f[21] = clamp(oppBoard.vanEhp / 36, 0, 1);
  f[22] = clamp(oppBoard.rearAtk / 20, 0, 1);
  f[23] = clamp(oppBoard.rearEhp / 28, 0, 1);
  f[24] = clamp(
    (myBoard.vanAtk + myBoard.rearAtk - (oppBoard.vanAtk + oppBoard.rearAtk)) / 24,
    -1,
    1
  );
  f[25] = clamp(
    (myBoard.vanEhp + myBoard.rearEhp - (oppBoard.vanEhp + oppBoard.rearEhp)) / 36,
    -1,
    1
  );
  f[26] = clamp((myBoard.creatureCount - oppBoard.creatureCount) / 8, -1, 1);
  f[27] = clamp((myBoard.relicCount + myBoard.trapCount) / 4, 0, 1);
  f[28] = clamp((oppBoard.relicCount + oppBoard.trapCount) / 4, 0, 1);
  f[29] = clamp(myBoard.guardianCount / 4, 0, 1);
  f[30] = clamp(oppBoard.guardianCount / 4, 0, 1);
  f[31] = clamp(myBoard.flyingOrReachCount / 5, 0, 1);
  f[32] = clamp(oppBoard.flyingOrReachCount / 5, 0, 1);
  f[33] = clamp(myBoard.combatKwCount / 5, 0, 1);
  f[34] = clamp(oppBoard.combatKwCount / 5, 0, 1);
  f[35] = clamp(myBoard.eliteCount / 3, 0, 1);
  f[36] = clamp(oppBoard.eliteCount / 3, 0, 1);
  f[37] = clamp((oppBoard.frozenCount - myBoard.frozenCount) / 4, -1, 1);
  f[38] = clamp(myDirectThreat / Math.max(1, opp.hp), 0, 1.5) - 0.5;
  f[39] = clamp(oppDirectThreat / Math.max(1, me.hp), 0, 1.5) - 0.5;
  f[40] = clamp((myOpenCols - oppOpenCols) / 4, -1, 1);
  f[41] = domainExpFeature;
  f[42] = clamp(myAffordableHand / 5, 0, 1);
  f[43] = clamp(myBurnOrRemoval / 4, 0, 1);
  f[44] = clamp(myDefenseInHand / 4, 0, 1);
  f[45] = clamp(myDomainReady, 0, 1);
  f[46] = clamp(state.turn / 14, 0, 1);
  f[47] = state.activePlayer === actor ? 0.5 : -0.5;

  return f;
}

/**
 * Analytical tactical state anchor in [-1, +1] ensuring smooth monotonic sanity on unseen edge states.
 */
export function computeAnalyticalTacticalValue(
  state: GameState,
  actor: 'player' | 'ai',
  precomputedFeatures?: Float64Array
): number {
  const enemyActor: 'player' | 'ai' = actor === 'player' ? 'ai' : 'player';
  if (state.phase === 'gameover') {
    if (state.winner === actor) return 1;
    if (state.winner === enemyActor) return -1;
    return 0;
  }

  const f = precomputedFeatures ?? extractNormalizedStateFeatures(state, actor, SCRATCH_FEATURES);
  const raw =
    0.85 * f[2] + // HP differential
    0.95 * f[24] + // Total ATK differential
    0.80 * f[25] + // Total EHP differential
    0.45 * f[26] + // Creature count differential
    0.32 * f[11] + // Hand differential
    0.28 * f[8] + // Essence ramp differential
    0.42 * f[41] + // Domain expansion advantage
    0.55 * (f[38] - f[39]) + // Lethal pressure ratio differential
    0.25 * (f[27] - f[28]) + // Relics & Traps differential
    0.20 * f[37]; // Freeze tempo differential

  return Math.tanh(raw * 0.85);
}

/**
 * Fast forward pass of a SerializedValueMlp on a 48-dim feature vector -> [-1, +1].
 */
export function forwardValueMlp(
  features: Float64Array,
  mlp: SerializedValueMlp
): number {
  const w1 = mlp.w1;
  const b1 = mlp.b1;
  const w2 = mlp.w2;
  const b2 = mlp.b2;
  const w3 = mlp.w3;

  for (let i = 0; i < VALUE_MLP_H1_DIM; i++) {
    let sum = b1[i];
    const rowOffset = i * VALUE_MLP_INPUT_DIM;
    for (let j = 0; j < VALUE_MLP_INPUT_DIM; j++) {
      sum += w1[rowOffset + j] * features[j];
    }
    SCRATCH_H1[i] = sum >= 0 ? sum : LEAKY_SLOPE * sum;
  }

  for (let i = 0; i < VALUE_MLP_H2_DIM; i++) {
    let sum = b2[i];
    const rowOffset = i * VALUE_MLP_H1_DIM;
    for (let j = 0; j < VALUE_MLP_H1_DIM; j++) {
      sum += w2[rowOffset + j] * SCRATCH_H1[j];
    }
    SCRATCH_H2[i] = sum >= 0 ? sum : LEAKY_SLOPE * sum;
  }

  let out = mlp.b3;
  for (let j = 0; j < VALUE_MLP_H2_DIM; j++) {
    out += w3[j] * SCRATCH_H2[j];
  }

  return Math.tanh(out);
}

/**
 * Evaluates a GameState in [-1, +1] for `actor` combining exact terminal outcomes,
 * the domain's trained non-linear Value MLP (when provided), and the analytical anchor.
 */
export function evaluateStateWithValueMlp(
  state: GameState,
  actor: 'player' | 'ai',
  mlp?: SerializedValueMlp | null
): number {
  const enemyActor: 'player' | 'ai' = actor === 'player' ? 'ai' : 'player';
  if (state.phase === 'gameover') {
    if (state.winner === actor) return 1;
    if (state.winner === enemyActor) return -1;
    return 0;
  }

  const features = extractNormalizedStateFeatures(state, actor, SCRATCH_FEATURES);
  const anchor = computeAnalyticalTacticalValue(state, actor, features);

  if (!mlp || mlp.w1.length !== VALUE_MLP_H1_DIM * VALUE_MLP_INPUT_DIM) {
    return anchor;
  }

  const nnPred = forwardValueMlp(features, mlp);
  return clamp(0.22 * anchor + 0.78 * nnPred, -0.999, 0.999);
}

/**
 * Deterministic PRNG (Mulberry32) for reproducible neural initialization and mini-batch shuffling.
 */
function createSeededRng(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Initializes a fresh Value MLP using He/Xavier normal-approximation weights.
 */
export function createUntrainedValueMlp(domain: Domain, seed = 1337): SerializedValueMlp {
  const rng = createSeededRng(seed);
  const randSym = (scale: number) => ((rng() + rng() + rng()) / 1.5 - 1) * scale;

  const s1 = Math.sqrt(2 / VALUE_MLP_INPUT_DIM);
  const s2 = Math.sqrt(2 / VALUE_MLP_H1_DIM);
  const s3 = Math.sqrt(1 / VALUE_MLP_H2_DIM);

  const w1 = new Array<number>(VALUE_MLP_H1_DIM * VALUE_MLP_INPUT_DIM);
  for (let i = 0; i < w1.length; i++) w1[i] = randSym(s1);
  const b1 = new Array<number>(VALUE_MLP_H1_DIM).fill(0);

  const w2 = new Array<number>(VALUE_MLP_H2_DIM * VALUE_MLP_H1_DIM);
  for (let i = 0; i < w2.length; i++) w2[i] = randSym(s2);
  const b2 = new Array<number>(VALUE_MLP_H2_DIM).fill(0);

  const w3 = new Array<number>(VALUE_MLP_H2_DIM);
  for (let i = 0; i < w3.length; i++) w3[i] = randSym(s3);

  return {
    domain,
    architecture: [VALUE_MLP_INPUT_DIM, VALUE_MLP_H1_DIM, VALUE_MLP_H2_DIM, 1],
    samplesTrained: 0,
    epochs: 0,
    initialMse: 0,
    finalMse: 0,
    signAccuracy: 0,
    w1,
    b1,
    w2,
    b2,
    w3,
    b3: 0,
  };
}

/**
 * Trains a domain Value MLP via Mini-Batch Adam with L2 weight decay on self-play trajectories,
 * returning quantized compact weights (4 decimal places) and validation telemetry.
 */
export function trainValueMlpWithAdam(
  domain: Domain,
  samples: ValueTrainingSample[],
  options?: {
    epochs?: number;
    batchSize?: number;
    learningRate?: number;
    weightDecay?: number;
    seed?: number;
    warmStartMlp?: SerializedValueMlp | null;
  }
): SerializedValueMlp {
  const epochs = options?.epochs ?? 24;
  const batchSize = options?.batchSize ?? 64;
  const baseLr = options?.learningRate ?? 0.0025;
  const weightDecay = options?.weightDecay ?? 0.00015;
  const seed = options?.seed ?? 20261031;

  const warm = options?.warmStartMlp;
  const mlp =
    warm &&
    warm.w1.length === VALUE_MLP_H1_DIM * VALUE_MLP_INPUT_DIM &&
    warm.w2.length === VALUE_MLP_H2_DIM * VALUE_MLP_H1_DIM &&
    warm.w3.length === VALUE_MLP_H2_DIM
      ? warm
      : createUntrainedValueMlp(domain, seed);
  if (samples.length === 0) return { ...mlp, domain };

  const w1 = Float64Array.from(mlp.w1);
  const b1 = Float64Array.from(mlp.b1);
  const w2 = Float64Array.from(mlp.w2);
  const b2 = Float64Array.from(mlp.b2);
  const w3 = Float64Array.from(mlp.w3);
  let b3 = mlp.b3;

  // Adam 1st & 2nd moment buffers
  const mW1 = new Float64Array(w1.length);
  const vW1 = new Float64Array(w1.length);
  const mB1 = new Float64Array(b1.length);
  const vB1 = new Float64Array(b1.length);
  const mW2 = new Float64Array(w2.length);
  const vW2 = new Float64Array(w2.length);
  const mB2 = new Float64Array(b2.length);
  const vB2 = new Float64Array(b2.length);
  const mW3 = new Float64Array(w3.length);
  const vW3 = new Float64Array(w3.length);
  let mB3 = 0;
  let vB3 = 0;

  // Batch gradient accumulators
  const gW1 = new Float64Array(w1.length);
  const gB1 = new Float64Array(b1.length);
  const gW2 = new Float64Array(w2.length);
  const gB2 = new Float64Array(b2.length);
  const gW3 = new Float64Array(w3.length);
  let gB3 = 0;

  const z1 = new Float64Array(VALUE_MLP_H1_DIM);
  const a1 = new Float64Array(VALUE_MLP_H1_DIM);
  const z2 = new Float64Array(VALUE_MLP_H2_DIM);
  const a2 = new Float64Array(VALUE_MLP_H2_DIM);
  const dZ2 = new Float64Array(VALUE_MLP_H2_DIM);
  const dZ1 = new Float64Array(VALUE_MLP_H1_DIM);

  const evalDataset = (subset: ValueTrainingSample[]) => {
    let mseSum = 0;
    let signHits = 0;
    let signTotal = 0;
    for (let s = 0; s < subset.length; s++) {
      const x = subset[s].features;
      for (let i = 0; i < VALUE_MLP_H1_DIM; i++) {
        let sum = b1[i];
        const off = i * VALUE_MLP_INPUT_DIM;
        for (let j = 0; j < VALUE_MLP_INPUT_DIM; j++) sum += w1[off + j] * x[j];
        a1[i] = sum >= 0 ? sum : LEAKY_SLOPE * sum;
      }
      for (let i = 0; i < VALUE_MLP_H2_DIM; i++) {
        let sum = b2[i];
        const off = i * VALUE_MLP_H1_DIM;
        for (let j = 0; j < VALUE_MLP_H1_DIM; j++) sum += w2[off + j] * a1[j];
        a2[i] = sum >= 0 ? sum : LEAKY_SLOPE * sum;
      }
      let out = b3;
      for (let j = 0; j < VALUE_MLP_H2_DIM; j++) out += w3[j] * a2[j];
      const pred = Math.tanh(out);
      const diff = pred - subset[s].target;
      mseSum += diff * diff;
      if (Math.abs(subset[s].target) >= 0.15) {
        signTotal += 1;
        if ((pred >= 0 && subset[s].target >= 0) || (pred < 0 && subset[s].target < 0)) {
          signHits += 1;
        }
      }
    }
    return {
      mse: mseSum / Math.max(1, subset.length),
      signAccuracy: signTotal > 0 ? signHits / signTotal : 0.5,
    };
  };

  const rng = createSeededRng(seed ^ 0x9e3779b9);
  const indices = new Int32Array(samples.length);
  for (let i = 0; i < samples.length; i++) indices[i] = i;
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = indices[i];
    indices[i] = indices[j];
    indices[j] = tmp;
  }

  // Hold out 12% validation split if enough samples
  const valCount = samples.length >= 200 ? Math.max(40, Math.floor(samples.length * 0.12)) : 0;
  const trainLen = samples.length - valCount;
  const valSamples: ValueTrainingSample[] = [];
  for (let i = trainLen; i < samples.length; i++) {
    valSamples.push(samples[indices[i]]);
  }
  const evalSet = valSamples.length > 0 ? valSamples : samples;
  const initialStats = evalDataset(evalSet);

  const beta1 = 0.9;
  const beta2 = 0.999;
  const eps = 1e-8;
  let stepT = 0;

  const trainOrder = new Int32Array(trainLen);
  for (let i = 0; i < trainLen; i++) trainOrder[i] = indices[i];

  for (let epoch = 0; epoch < epochs; epoch++) {
    const lr = baseLr * Math.pow(0.95, epoch);
    // Shuffle training indices
    for (let i = trainLen - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const tmp = trainOrder[i];
      trainOrder[i] = trainOrder[j];
      trainOrder[j] = tmp;
    }

    for (let start = 0; start < trainLen; start += batchSize) {
      const end = Math.min(trainLen, start + batchSize);
      const curBatch = end - start;
      gW1.fill(0);
      gB1.fill(0);
      gW2.fill(0);
      gB2.fill(0);
      gW3.fill(0);
      gB3 = 0;

      for (let bIdx = start; bIdx < end; bIdx++) {
        const sample = samples[trainOrder[bIdx]];
        const x = sample.features;
        const y = sample.target;
        const sw = sample.weight;

        // Forward
        for (let i = 0; i < VALUE_MLP_H1_DIM; i++) {
          let sum = b1[i];
          const off = i * VALUE_MLP_INPUT_DIM;
          for (let j = 0; j < VALUE_MLP_INPUT_DIM; j++) sum += w1[off + j] * x[j];
          z1[i] = sum;
          a1[i] = sum >= 0 ? sum : LEAKY_SLOPE * sum;
        }
        for (let i = 0; i < VALUE_MLP_H2_DIM; i++) {
          let sum = b2[i];
          const off = i * VALUE_MLP_H1_DIM;
          for (let j = 0; j < VALUE_MLP_H1_DIM; j++) sum += w2[off + j] * a1[j];
          z2[i] = sum;
          a2[i] = sum >= 0 ? sum : LEAKY_SLOPE * sum;
        }
        let z3 = b3;
        for (let j = 0; j < VALUE_MLP_H2_DIM; j++) z3 += w3[j] * a2[j];
        const pred = Math.tanh(z3);

        // dL/dz3 = 2 * sw * (pred - y) * (1 - pred^2)
        const dZ3 = 2 * sw * (pred - y) * (1 - pred * pred);
        gB3 += dZ3;
        for (let j = 0; j < VALUE_MLP_H2_DIM; j++) {
          gW3[j] += dZ3 * a2[j];
          const dA2 = dZ3 * w3[j];
          dZ2[j] = dA2 * (z2[j] >= 0 ? 1 : LEAKY_SLOPE);
        }

        for (let i = 0; i < VALUE_MLP_H1_DIM; i++) {
          let dA1 = 0;
          for (let k = 0; k < VALUE_MLP_H2_DIM; k++) {
            dA1 += dZ2[k] * w2[k * VALUE_MLP_H1_DIM + i];
          }
          dZ1[i] = dA1 * (z1[i] >= 0 ? 1 : LEAKY_SLOPE);
        }

        for (let k = 0; k < VALUE_MLP_H2_DIM; k++) {
          const dz = dZ2[k];
          gB2[k] += dz;
          const off = k * VALUE_MLP_H1_DIM;
          for (let i = 0; i < VALUE_MLP_H1_DIM; i++) {
            gW2[off + i] += dz * a1[i];
          }
        }

        for (let i = 0; i < VALUE_MLP_H1_DIM; i++) {
          const dz = dZ1[i];
          gB1[i] += dz;
          const off = i * VALUE_MLP_INPUT_DIM;
          for (let j = 0; j < VALUE_MLP_INPUT_DIM; j++) {
            gW1[off + j] += dz * x[j];
          }
        }
      }

      // Adam update
      stepT += 1;
      const invBatch = 1 / curBatch;
      const corr1 = 1 - Math.pow(beta1, stepT);
      const corr2 = 1 - Math.pow(beta2, stepT);
      const stepSize = (lr * Math.sqrt(corr2)) / corr1;

      for (let i = 0; i < w1.length; i++) {
        const g = gW1[i] * invBatch + weightDecay * w1[i];
        mW1[i] = beta1 * mW1[i] + (1 - beta1) * g;
        vW1[i] = beta2 * vW1[i] + (1 - beta2) * g * g;
        w1[i] -= (stepSize * mW1[i]) / (Math.sqrt(vW1[i]) + eps);
      }
      for (let i = 0; i < b1.length; i++) {
        const g = gB1[i] * invBatch;
        mB1[i] = beta1 * mB1[i] + (1 - beta1) * g;
        vB1[i] = beta2 * vB1[i] + (1 - beta2) * g * g;
        b1[i] -= (stepSize * mB1[i]) / (Math.sqrt(vB1[i]) + eps);
      }
      for (let i = 0; i < w2.length; i++) {
        const g = gW2[i] * invBatch + weightDecay * w2[i];
        mW2[i] = beta1 * mW2[i] + (1 - beta1) * g;
        vW2[i] = beta2 * vW2[i] + (1 - beta2) * g * g;
        w2[i] -= (stepSize * mW2[i]) / (Math.sqrt(vW2[i]) + eps);
      }
      for (let i = 0; i < b2.length; i++) {
        const g = gB2[i] * invBatch;
        mB2[i] = beta1 * mB2[i] + (1 - beta1) * g;
        vB2[i] = beta2 * vB2[i] + (1 - beta2) * g * g;
        b2[i] -= (stepSize * mB2[i]) / (Math.sqrt(vB2[i]) + eps);
      }
      for (let i = 0; i < w3.length; i++) {
        const g = gW3[i] * invBatch + weightDecay * w3[i];
        mW3[i] = beta1 * mW3[i] + (1 - beta1) * g;
        vW3[i] = beta2 * vW3[i] + (1 - beta2) * g * g;
        w3[i] -= (stepSize * mW3[i]) / (Math.sqrt(vW3[i]) + eps);
      }
      {
        const g = gB3 * invBatch;
        mB3 = beta1 * mB3 + (1 - beta1) * g;
        vB3 = beta2 * vB3 + (1 - beta2) * g * g;
        b3 -= (stepSize * mB3) / (Math.sqrt(vB3) + eps);
      }
    }
  }

  const finalStats = evalDataset(evalSet);
  const q4 = (v: number) => Math.round(v * 10000) / 10000;

  return {
    domain,
    architecture: [VALUE_MLP_INPUT_DIM, VALUE_MLP_H1_DIM, VALUE_MLP_H2_DIM, 1],
    samplesTrained: samples.length,
    epochs,
    initialMse: q4(initialStats.mse),
    finalMse: q4(finalStats.mse),
    signAccuracy: q4(finalStats.signAccuracy),
    w1: Array.from(w1, q4),
    b1: Array.from(b1, q4),
    w2: Array.from(w2, q4),
    b2: Array.from(b2, q4),
    w3: Array.from(w3, q4),
    b3: q4(b3),
  };
}
