import { AiSkillTier, Domain } from '../types/game';
import { ALL_CARDS } from './cards';
import type { AiDecisionWeights, DeckLearnedAiProfile, DiscoveredCardCombo } from './aiLearnedProfiles';
import type { SerializedValueMlp } from '../engine/aiValueNetwork';
import type { CardShapleyMetric, TierDeckMetadata } from './aiMonocolorMasteryData';

const B64_LOOKUP = (() => {
  const table = new Uint8Array(128);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  for (let i = 0; i < chars.length; i++) {
    table[chars.charCodeAt(i)] = i;
  }
  return table;
})();

function decodeBase64Bytes(b64: string): Uint8Array {
  let len = b64.length;
  while (len > 0 && b64.charCodeAt(len - 1) === 61 /* '=' */) {
    len--;
  }
  const outLen = (len * 3) >> 2;
  const out = new Uint8Array(outLen);
  let outIdx = 0;
  let i = 0;
  while (i + 3 < len) {
    const a = B64_LOOKUP[b64.charCodeAt(i++)];
    const b = B64_LOOKUP[b64.charCodeAt(i++)];
    const c = B64_LOOKUP[b64.charCodeAt(i++)];
    const d = B64_LOOKUP[b64.charCodeAt(i++)];
    const triple = (a << 18) | (b << 12) | (c << 6) | d;
    out[outIdx++] = (triple >> 16) & 0xff;
    out[outIdx++] = (triple >> 8) & 0xff;
    out[outIdx++] = triple & 0xff;
  }
  const rem = len - i;
  if (rem === 2) {
    const a = B64_LOOKUP[b64.charCodeAt(i)];
    const b = B64_LOOKUP[b64.charCodeAt(i + 1)];
    out[outIdx++] = ((a << 2) | (b >> 4)) & 0xff;
  } else if (rem === 3) {
    const a = B64_LOOKUP[b64.charCodeAt(i)];
    const b = B64_LOOKUP[b64.charCodeAt(i + 1)];
    const c = B64_LOOKUP[b64.charCodeAt(i + 2)];
    const pair = (a << 12) | (b << 6) | c;
    out[outIdx++] = (pair >> 10) & 0xff;
    out[outIdx++] = (pair >> 2) & 0xff;
  }
  return out;
}

export interface CompactValueMlp {
  d: Domain;
  a: [number, number, number, 1];
  s: number;
  e: number;
  im: number;
  fm: number;
  sa: number;
  /** Byte-shuffled Int16 (x10000) Base64 of concatenated [w1, b1, w2, b2, w3] */
  wb: string;
  b3: number;
}

export function unpackValueMlpMap<K extends string>(
  raw: Partial<Record<K, CompactValueMlp>>
): Partial<Record<K, SerializedValueMlp>> {
  const out: Partial<Record<K, SerializedValueMlp>> = {};
  for (const key of Object.keys(raw) as K[]) {
    const item = raw[key];
    if (!item) continue;
    const [inDim, h1Dim, h2Dim] = item.a;
    const w1Len = h1Dim * inDim;
    const b1Len = h1Dim;
    const w2Len = h2Dim * h1Dim;
    const b2Len = h2Dim;
    const w3Len = h2Dim;
    const total = w1Len + b1Len + w2Len + b2Len + w3Len;
    const bytes = decodeBase64Bytes(item.wb);
    const all = new Array<number>(total);
    for (let i = 0; i < total; i++) {
      const zz = (bytes[i] << 8) | bytes[total + i];
      const q = (zz >>> 1) ^ -(zz & 1);
      all[i] = q / 10000;
    }
    let off = 0;
    const w1 = all.slice(off, (off += w1Len));
    const b1 = all.slice(off, (off += b1Len));
    const w2 = all.slice(off, (off += w2Len));
    const b2 = all.slice(off, (off += b2Len));
    const w3 = all.slice(off, (off += w3Len));
    out[key] = {
      domain: item.d,
      architecture: item.a,
      samplesTrained: item.s,
      epochs: item.e,
      initialMse: item.im,
      finalMse: item.fm,
      signAccuracy: item.sa,
      w1,
      b1,
      w2,
      b2,
      w3,
      b3: item.b3,
    };
  }
  return out;
}

/** [cardIdx, shapleyValue, shapleyLcb | null, ci95HalfWidth | null, playedWinRate, stuckInHandRate, samples, customName?] */
export type CompactShapleyTuple = [
  number,
  number,
  number | null,
  number | null,
  number,
  number,
  number,
  string?,
];

/** [cardAIdx, cardBIdx, coPlayWinRate, liftOverBaseline, sampleCount, noteSuffixOrFull, isFullNote?] */
export type CompactComboTuple = [number, number, number, number, number, string, 1?];

export interface CompactLearnedAiProfile {
  deckId: string;
  deckName: string;
  archetypeTag: string;
  generationsTrained: number;
  matchesSimulated: number;
  baselineWinRate: number;
  trainedWinRate: number;
  weights: AiDecisionWeights;
  mk: number[];
  cp: number[];
  ca: number[];
  hb: Array<[number, number]>;
  sp: Array<[number, number]>;
  dc: CompactComboTuple[];
}

/** [tier, tierLabel, cardIdsB64, legendaryCount, rareCount, uncommonCount, commonCount, avgCost, benchmarkWinRateVsLadder, benchmarkCi95HalfWidth | null] */
export type CompactTierDeckTuple = [
  AiSkillTier,
  string,
  string,
  number,
  number,
  number,
  number,
  number,
  number,
  number | null,
];

function decodeCardIndicesB64(b64: string): string[] {
  const bytes = decodeBase64Bytes(b64);
  const count = bytes.length >> 1;
  const ids = new Array<string>(count);
  for (let i = 0; i < count; i++) {
    const idx = (bytes[i] << 8) | bytes[count + i];
    ids[i] = ALL_CARDS[idx]?.id ?? '';
  }
  return ids;
}

export function unpackCombos(tuples: CompactComboTuple[]): DiscoveredCardCombo[] {
  return tuples.map((t) => {
    const cardA = ALL_CARDS[t[0]];
    const cardB = ALL_CARDS[t[1]];
    const synergyNote =
      t[6] === 1 ? t[5] : `${cardA?.name ?? ''} + ${cardB?.name ?? ''}${t[5]}`;
    return {
      cardAId: cardA?.id ?? '',
      cardBId: cardB?.id ?? '',
      coPlayWinRate: t[2],
      liftOverBaseline: t[3],
      sampleCount: t[4],
      synergyNote,
    };
  });
}

export function unpackShapleyList(tuples: CompactShapleyTuple[]): CardShapleyMetric[] {
  return tuples.map((t) => {
    const card = ALL_CARDS[t[0]];
    const metric: CardShapleyMetric = {
      cardId: card?.id ?? '',
      cardName: t[7] !== undefined ? t[7] : (card?.name ?? ''),
      shapleyValue: t[1],
      playedWinRate: t[4],
      stuckInHandRate: t[5],
      samples: t[6],
    };
    if (t[2] !== null) metric.shapleyLcb = t[2];
    if (t[3] !== null) metric.ci95HalfWidth = t[3];
    return metric;
  });
}

export function unpackLearnedProfile(c: CompactLearnedAiProfile): DeckLearnedAiProfile {
  const highImpactCardBoosts: Record<string, number> = {};
  for (const [idx, val] of c.hb) {
    const cid = ALL_CARDS[idx]?.id;
    if (cid) highImpactCardBoosts[cid] = val;
  }
  return {
    deckId: c.deckId,
    deckName: c.deckName,
    archetypeTag: c.archetypeTag,
    generationsTrained: c.generationsTrained,
    matchesSimulated: c.matchesSimulated,
    baselineWinRate: c.baselineWinRate,
    trainedWinRate: c.trainedWinRate,
    weights: c.weights,
    mulliganKeepIds: c.mk.map((i) => ALL_CARDS[i]?.id ?? ''),
    channelPriorityIds: c.cp.map((i) => ALL_CARDS[i]?.id ?? ''),
    channelAvoidIds: c.ca.map((i) => ALL_CARDS[i]?.id ?? ''),
    highImpactCardBoosts,
    synergyPairs: c.sp.map(([a, b]) => [ALL_CARDS[a]?.id ?? '', ALL_CARDS[b]?.id ?? '']),
    discoveredCombos: unpackCombos(c.dc),
  };
}

export function unpackTierDecks(
  tuples: CompactTierDeckTuple[]
): Record<AiSkillTier, TierDeckMetadata> {
  const out = {} as Record<AiSkillTier, TierDeckMetadata>;
  for (const t of tuples) {
    const meta: TierDeckMetadata = {
      tier: t[0],
      tierLabel: t[1],
      cardIds: decodeCardIndicesB64(t[2]),
      legendaryCount: t[3],
      rareCount: t[4],
      uncommonCount: t[5],
      commonCount: t[6],
      avgCost: t[7],
      benchmarkWinRateVsLadder: t[8],
    };
    if (t[9] !== null) meta.benchmarkCi95HalfWidth = t[9];
    out[t[0]] = meta;
  }
  return out;
}

export interface CompactMasteryFields {
  learnedProfile: CompactLearnedAiProfile;
  topShapleyCards: CompactShapleyTuple[];
  tierDecks: CompactTierDeckTuple[];
  crossDomainCombos?: CompactComboTuple[];
}

export function unpackMasteryRecord<
  K extends string,
  T extends {
    learnedProfile: DeckLearnedAiProfile;
    topShapleyCards: CardShapleyMetric[];
    tierDecks: Record<AiSkillTier, TierDeckMetadata>;
    crossDomainCombos?: DiscoveredCardCombo[];
  },
>(
  raw: Record<K, Omit<T, keyof CompactMasteryFields> & CompactMasteryFields>
): Record<K, T> {
  const out = {} as Record<K, T>;
  for (const key of Object.keys(raw) as K[]) {
    const entry = raw[key];
    const unpacked: Record<string, unknown> = {
      ...entry,
      learnedProfile: unpackLearnedProfile(entry.learnedProfile),
      topShapleyCards: unpackShapleyList(entry.topShapleyCards),
      tierDecks: unpackTierDecks(entry.tierDecks),
    };
    if (entry.crossDomainCombos !== undefined) {
      unpacked.crossDomainCombos = unpackCombos(entry.crossDomainCombos);
    }
    out[key] = unpacked as T;
  }
  return out;
}

const B64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function encodeBase64Bytes(bytes: Uint8Array): string {
  let out = '';
  const len = bytes.length;
  let i = 0;
  while (i + 2 < len) {
    const triple = (bytes[i++] << 16) | (bytes[i++] << 8) | bytes[i++];
    out +=
      B64_CHARS[(triple >> 18) & 0x3f] +
      B64_CHARS[(triple >> 12) & 0x3f] +
      B64_CHARS[(triple >> 6) & 0x3f] +
      B64_CHARS[triple & 0x3f];
  }
  const rem = len - i;
  if (rem === 1) {
    const a = bytes[i];
    out += B64_CHARS[(a >> 2) & 0x3f] + B64_CHARS[(a << 4) & 0x3f] + '==';
  } else if (rem === 2) {
    const pair = (bytes[i] << 8) | bytes[i + 1];
    out +=
      B64_CHARS[(pair >> 10) & 0x3f] +
      B64_CHARS[(pair >> 4) & 0x3f] +
      B64_CHARS[(pair << 2) & 0x3f] +
      '=';
  }
  return out;
}

const CARD_INDEX_BY_ID: Record<string, number> = (() => {
  const m: Record<string, number> = {};
  for (let i = 0; i < ALL_CARDS.length; i++) {
    m[ALL_CARDS[i].id] = i;
  }
  return m;
})();

function encodeCardIndicesB64(cardIds: string[]): string {
  const count = cardIds.length;
  const bytes = new Uint8Array(count * 2);
  for (let i = 0; i < count; i++) {
    const idx = CARD_INDEX_BY_ID[cardIds[i]] ?? 0;
    bytes[i] = (idx >> 8) & 0xff;
    bytes[count + i] = idx & 0xff;
  }
  return encodeBase64Bytes(bytes);
}

export function packValueMlpMap<K extends string>(
  raw: Partial<Record<K, SerializedValueMlp>>
): Partial<Record<K, CompactValueMlp>> {
  const out: Partial<Record<K, CompactValueMlp>> = {};
  for (const key of Object.keys(raw) as K[]) {
    const mlp = raw[key];
    if (!mlp) continue;
    const all = [...mlp.w1, ...mlp.b1, ...mlp.w2, ...mlp.b2, ...mlp.w3];
    const total = all.length;
    const bytes = new Uint8Array(total * 2);
    for (let i = 0; i < total; i++) {
      const q = Math.max(-32768, Math.min(32767, Math.round(all[i] * 10000)));
      const zz = ((q << 1) ^ (q >> 31)) & 0xffff;
      bytes[i] = (zz >> 8) & 0xff;
      bytes[total + i] = zz & 0xff;
    }
    out[key] = {
      d: mlp.domain,
      a: mlp.architecture,
      s: mlp.samplesTrained,
      e: mlp.epochs,
      im: Number(mlp.initialMse.toFixed(4)),
      fm: Number(mlp.finalMse.toFixed(4)),
      sa: Number(mlp.signAccuracy.toFixed(4)),
      wb: encodeBase64Bytes(bytes),
      b3: Number(mlp.b3.toFixed(4)),
    };
  }
  return out;
}

export function packCombos(combos: DiscoveredCardCombo[]): CompactComboTuple[] {
  return combos.map((c) => {
    const idxA = CARD_INDEX_BY_ID[c.cardAId] ?? 0;
    const idxB = CARD_INDEX_BY_ID[c.cardBId] ?? 0;
    const cardA = ALL_CARDS[idxA];
    const cardB = ALL_CARDS[idxB];
    const prefix = `${cardA?.name ?? ''} + ${cardB?.name ?? ''}`;
    if (c.synergyNote.startsWith(prefix)) {
      return [
        idxA,
        idxB,
        Number(c.coPlayWinRate.toFixed(3)),
        Number(c.liftOverBaseline.toFixed(3)),
        c.sampleCount,
        c.synergyNote.slice(prefix.length),
      ];
    }
    return [
      idxA,
      idxB,
      Number(c.coPlayWinRate.toFixed(3)),
      Number(c.liftOverBaseline.toFixed(3)),
      c.sampleCount,
      c.synergyNote,
      1,
    ];
  });
}

export function packShapleyList(list: CardShapleyMetric[]): CompactShapleyTuple[] {
  return list.map((m) => {
    const idx = CARD_INDEX_BY_ID[m.cardId] ?? 0;
    const card = ALL_CARDS[idx];
    const customName = card && card.name !== m.cardName ? m.cardName : undefined;
    const tuple: CompactShapleyTuple = [
      idx,
      Number(m.shapleyValue.toFixed(4)),
      m.shapleyLcb !== undefined ? Number(m.shapleyLcb.toFixed(4)) : null,
      m.ci95HalfWidth !== undefined ? Number(m.ci95HalfWidth.toFixed(4)) : null,
      Number(m.playedWinRate.toFixed(3)),
      Number(m.stuckInHandRate.toFixed(3)),
      m.samples,
    ];
    if (customName !== undefined) tuple.push(customName);
    return tuple;
  });
}

export function packLearnedProfile(p: DeckLearnedAiProfile): CompactLearnedAiProfile {
  const hb: Array<[number, number]> = [];
  for (const [cid, val] of Object.entries(p.highImpactCardBoosts ?? {})) {
    const idx = CARD_INDEX_BY_ID[cid];
    if (idx !== undefined) {
      hb.push([idx, Number(val.toFixed(1))]);
    }
  }
  hb.sort((a, b) => a[0] - b[0]);
  return {
    deckId: p.deckId,
    deckName: p.deckName,
    archetypeTag: p.archetypeTag,
    generationsTrained: p.generationsTrained,
    matchesSimulated: p.matchesSimulated,
    baselineWinRate: Number(p.baselineWinRate.toFixed(3)),
    trainedWinRate: Number(p.trainedWinRate.toFixed(3)),
    weights: p.weights,
    mk: (p.mulliganKeepIds ?? []).map((id) => CARD_INDEX_BY_ID[id] ?? 0),
    cp: (p.channelPriorityIds ?? []).map((id) => CARD_INDEX_BY_ID[id] ?? 0),
    ca: (p.channelAvoidIds ?? []).map((id) => CARD_INDEX_BY_ID[id] ?? 0),
    hb,
    sp: (p.synergyPairs ?? []).map(([a, b]) => [
      CARD_INDEX_BY_ID[a] ?? 0,
      CARD_INDEX_BY_ID[b] ?? 0,
    ]),
    dc: packCombos(p.discoveredCombos ?? []),
  };
}

export function packTierDecks(
  tierDecks: Record<AiSkillTier, TierDeckMetadata>
): CompactTierDeckTuple[] {
  const tiers: AiSkillTier[] = [1, 2, 3, 4, 5];
  return tiers.map((t) => {
    const m = tierDecks[t];
    return [
      m.tier,
      m.tierLabel,
      encodeCardIndicesB64(m.cardIds),
      m.legendaryCount,
      m.rareCount,
      m.uncommonCount,
      m.commonCount,
      Number(m.avgCost.toFixed(2)),
      Number(m.benchmarkWinRateVsLadder.toFixed(3)),
      m.benchmarkCi95HalfWidth !== undefined ? Number(m.benchmarkCi95HalfWidth.toFixed(4)) : null,
    ];
  });
}

export function packMasteryRecord<
  K extends string,
  T extends {
    learnedProfile: DeckLearnedAiProfile;
    topShapleyCards: CardShapleyMetric[];
    tierDecks: Record<AiSkillTier, TierDeckMetadata>;
    crossDomainCombos?: DiscoveredCardCombo[];
  },
>(
  record: Partial<Record<K, T>>
): Record<K, Omit<T, keyof CompactMasteryFields> & CompactMasteryFields> {
  const out = {} as Record<K, Omit<T, keyof CompactMasteryFields> & CompactMasteryFields>;
  for (const key of Object.keys(record) as K[]) {
    const entry = record[key];
    if (!entry) continue;
    const packed: Record<string, unknown> = {
      ...entry,
      learnedProfile: packLearnedProfile(entry.learnedProfile),
      topShapleyCards: packShapleyList(entry.topShapleyCards),
      tierDecks: packTierDecks(entry.tierDecks),
    };
    if (entry.crossDomainCombos !== undefined) {
      packed.crossDomainCombos = packCombos(entry.crossDomainCombos);
    }
    out[key] = packed as Omit<T, keyof CompactMasteryFields> & CompactMasteryFields;
  }
  return out;
}
