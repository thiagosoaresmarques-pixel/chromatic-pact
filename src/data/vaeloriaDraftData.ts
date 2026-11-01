import { ALL_CARDS, CARDS_BY_ID } from './cards';
import { PREBUILT_DECKS } from './decks';
import {
  AiSkillTier,
  ArenaWeatherType,
  CampaignBoss,
  CardDefinition,
  ConquestBattleModifiers,
  Domain,
} from '../types/game';
import { applyEquippedRelicToModifiers, recordBestDraftWins } from './sovereignRelics';
import {
  AI_SKILL_TIER_SPECS,
  resolveCampaignBossGraduatedSetup,
} from './aiMonocolorMastery';
import { getUnifiedStandingForDeckId, UnifiedChampionId } from './aiUnifiedTournament';

export const DRAFT_ENTRY_GOLD_COST = 100;
export const DRAFT_TOTAL_ROUNDS = 20;
export const DRAFT_MAX_WINS = 7;
export const DRAFT_MAX_LOSSES = 3;

const DRAFT_RUN_STORAGE_KEY = 'chromatic_pact_draft_run_v1';
const FREE_DRAFT_PASS_STORAGE_KEY = 'chromatic_pact_free_draft_v1';

export interface DraftBucketOption {
  id: string;
  label: string;
  cardIds: [string, string];
}

export interface DraftRewardSummary {
  gold: number;
  bonusCardIds: string[];
  tierTitle: string;
}

export interface DraftRunState {
  runId: string;
  phase: 'idle' | 'pick_sovereign' | 'drafting' | 'gauntlet' | 'completed';
  sovereignCandidates: string[];
  chosenSovereignId: string | null;
  primaryDomain: Domain;
  round: number; // 1..20
  currentBuckets: DraftBucketOption[];
  draftedCardIds: string[];
  wins: number;
  losses: number;
  rewardsClaimed: boolean;
  pendingReward: DraftRewardSummary | null;
}

export interface DraftBattleOutcome {
  outcomeId: string;
  didWin: boolean;
}

export function createIdleDraftState(): DraftRunState {
  return {
    runId: `draft_idle_${Date.now()}`,
    phase: 'idle',
    sovereignCandidates: [],
    chosenSovereignId: null,
    primaryDomain: 'red',
    round: 1,
    currentBuckets: [],
    draftedCardIds: [],
    wins: 0,
    losses: 0,
    rewardsClaimed: false,
    pendingReward: null,
  };
}

export function loadDraftRunState(): DraftRunState {
  if (typeof window === 'undefined') return createIdleDraftState();
  try {
    const raw = localStorage.getItem(DRAFT_RUN_STORAGE_KEY);
    if (!raw) return createIdleDraftState();
    const parsed = JSON.parse(raw) as Partial<DraftRunState>;
    if (!parsed || !parsed.phase) return createIdleDraftState();
    return {
      ...createIdleDraftState(),
      ...parsed,
    };
  } catch {
    return createIdleDraftState();
  }
}

export function saveDraftRunState(state: DraftRunState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DRAFT_RUN_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors
  }
}

export function hasClaimedFreeDraftPass(userId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(FREE_DRAFT_PASS_STORAGE_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
    return Boolean(map[userId || 'guest']);
  } catch {
    return false;
  }
}

export function markFreeDraftPassClaimed(userId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(FREE_DRAFT_PASS_STORAGE_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
    map[userId || 'guest'] = true;
    localStorage.setItem(FREE_DRAFT_PASS_STORAGE_KEY, JSON.stringify(map));
  } catch {
    // Ignore
  }
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function generateSovereignDraftCandidates(): string[] {
  const domains: Array<Exclude<Domain, 'neutral'>> = shuffle([
    'red',
    'blue',
    'purple',
    'green',
    'gold',
  ]);
  const chosenDoms = domains.slice(0, 3);
  const result: string[] = [];

  for (const dom of chosenDoms) {
    const pool = ALL_CARDS.filter(
      (c) => c.domain === dom && c.type === 'creature' && c.rarity === 'legendary'
    );
    if (pool.length > 0) {
      result.push(pickRandom(pool).id);
    }
  }

  while (result.length < 3) {
    const fallback = ALL_CARDS.find(
      (c) => c.type === 'creature' && c.rarity === 'legendary' && !result.includes(c.id)
    );
    if (!fallback) break;
    result.push(fallback.id);
  }
  return result;
}

const BUCKET_LABELS_BY_THEME: Array<{
  label: string;
  filter: (c: CardDefinition) => boolean;
}> = [
  {
    label: '⚔️ Vanguarda de Choque',
    filter: (c) => c.type === 'creature' && c.cost <= 3,
  },
  {
    label: '⚡ Arcanismo & Feitiços',
    filter: (c) => c.type === 'spell' || c.type === 'reaction',
  },
  {
    label: '🛡️ Bastião & Relíquias',
    filter: (c) =>
      c.type === 'relic' ||
      c.armor >= 1 ||
      c.keywords.includes('Guardião') ||
      c.keywords.includes('Escudo Divino'),
  },
  {
    label: '🐉 Coliseu de Titãs',
    filter: (c) => c.type === 'creature' && c.cost >= 4,
  },
  {
    label: '🔥 Sinergia Tática',
    filter: (c) => c.effects.length > 0,
  },
  {
    label: '⚙️ Artilharia Axial & Armas',
    filter: (c) =>
      c.domain === 'neutral' ||
      c.keywords.includes('Alcance') ||
      c.keywords.includes('Ímpeto'),
  },
  {
    label: '🌈 Pontes do Prisma & Afinidade',
    filter: (c) =>
      c.id.includes('_167_arauto_prisma_') ||
      c.effects.some((e) => e.type === 'grant_bonus_essence' || e.type === 'draw_cards'),
  },
];

export function generateDraftRoundBuckets(
  primaryDomain: Domain,
  round: number,
  alreadyDraftedIds: string[]
): DraftBucketOption[] {
  const isPrestigeRound = round % 5 === 0;
  const counts: Record<string, number> = {};
  for (const cid of alreadyDraftedIds) {
    counts[cid] = (counts[cid] ?? 0) + 1;
  }

  const secondaryDomains = (['red', 'blue', 'purple', 'green', 'gold'] as const).filter(
    (d) => d !== primaryDomain
  );
  const splashDomain = secondaryDomains[(round * 3) % secondaryDomains.length];

  const eligiblePool = ALL_CARDS.filter((c) => {
    const allowedDomain =
      c.domain === primaryDomain || c.domain === 'neutral' || c.domain === splashDomain;
    if (!allowedDomain) return false;
    const maxCopies = c.rarity === 'legendary' ? 1 : 2;
    return (counts[c.id] ?? 0) < maxCopies;
  });

  const themes = shuffle(BUCKET_LABELS_BY_THEME).slice(0, 3);
  const usedInThisOffer = new Set<string>();

  return themes.map((theme, idx) => {
    let themedPool = eligiblePool.filter(
      (c) => !usedInThisOffer.has(c.id) && theme.filter(c)
    );
    if (themedPool.length < 4) {
      themedPool = eligiblePool.filter((c) => !usedInThisOffer.has(c.id));
    }

    let firstCard: CardDefinition;
    if (isPrestigeRound) {
      const highRarity = themedPool.filter(
        (c) => c.rarity === 'legendary' || c.rarity === 'rare'
      );
      firstCard = highRarity.length > 0 ? pickRandom(highRarity) : pickRandom(themedPool);
    } else {
      const curvePool =
        round <= 8
          ? themedPool.filter((c) => c.cost <= 3)
          : round <= 15
          ? themedPool.filter((c) => c.cost >= 2 && c.cost <= 5)
          : themedPool;
      firstCard = curvePool.length > 0 ? pickRandom(curvePool) : pickRandom(themedPool);
    }
    usedInThisOffer.add(firstCard.id);

    const companionPool = eligiblePool.filter(
      (c) =>
        !usedInThisOffer.has(c.id) &&
        (c.domain === primaryDomain || c.domain === 'neutral') &&
        c.rarity !== 'legendary'
    );
    const secondCard =
      companionPool.length > 0
        ? pickRandom(companionPool)
        : pickRandom(ALL_CARDS.filter((c) => c.id !== firstCard.id));
    usedInThisOffer.add(secondCard.id);

    return {
      id: `bucket_r${round}_${idx}_${firstCard.id}`,
      label: isPrestigeRound ? `✦ ALTO SELO • ${theme.label}` : theme.label,
      cardIds: [firstCard.id, secondCard.id],
    };
  });
}

const CRUCIBLE_CHALLENGERS: Array<{
  title: string;
  name: string;
  hp: number;
  skillTier: AiSkillTier;
  weather: ArenaWeatherType;
  passiveName: string;
  passiveDesc: string;
  championPool: UnifiedChampionId[];
}> = [
  {
    name: 'Kaelen, Iniciado das Brasas',
    title: '1ª Provação do Crisol • Grau I',
    hp: 20,
    skillTier: 1,
    weather: 'ash_storm',
    passiveName: 'Batismo das Cinzas',
    passiveDesc: 'Arena aquecida pela Tempestade de Cinzas nos 2 primeiros turnos.',
    championPool: [
      'mono_red_blitz',
      'mono_blue_frost',
      'mono_purple_crypt',
      'mono_green_swarm',
      'mono_gold_phalanx',
      'mono_neutral_axial',
    ],
  },
  {
    name: 'Lyra, Vigia de Cristália',
    title: '2ª Provação do Crisol • Grau II',
    hp: 22,
    skillTier: 2,
    weather: 'astral_blizzard',
    passiveName: 'Lente Polar',
    passiveDesc: 'Nevasca Astral inicial testa a resiliência da sua curva de Essência.',
    championPool: [
      'mono_blue_chrono',
      'mono_red_pyroclasm',
      'mono_purple_umbral',
      'mono_green_roots',
      'mono_gold_judgment',
      'dual_blue_neutral',
      'dual_green_neutral',
      'dual_gold_neutral',
    ],
  },
  {
    name: 'Thorn, Voz da Mata Antiga',
    title: '3ª Provação do Crisol • Grau III',
    hp: 23,
    skillTier: 3,
    weather: 'sylvan_monsoon',
    passiveName: 'Seiva Crescente',
    passiveDesc: 'Monção Primordial regenera unidades em combate nos turnos iniciais.',
    championPool: [
      'mono_green_colossus',
      'mono_red_dragon',
      'mono_blue_abyssal',
      'mono_purple_blood',
      'mono_gold_celestial',
      'dual_red_green',
      'dual_green_gold',
      'dual_purple_green',
    ],
  },
  {
    name: 'Malakor, Tecelão do Eclipse',
    title: '4ª Provação do Crisol • Grau III',
    hp: 25,
    skillTier: 3,
    weather: 'umbral_eclipse',
    passiveName: 'Véu Abissal',
    passiveDesc: 'Eclipse Umbral drena a vitalidade dos tronos a cada abertura.',
    championPool: [
      'dual_blue_purple',
      'dual_red_purple',
      'dual_purple_gold',
      'dual_purple_neutral',
      'dual_blue_gold',
      'dual_blue_green',
      'dual_red_gold',
      'dual_red_blue',
    ],
  },
  {
    name: 'Aurelia, Juíza do Zênite',
    title: '5ª Provação do Crisol • Grau IV',
    hp: 26,
    skillTier: 4,
    weather: 'solar_zenith',
    passiveName: 'Decreto Solar',
    passiveDesc: 'Zênite Solar concede armadura adicional à Vanguarda.',
    championPool: [
      'tri_blue_green_gold',
      'tri_blue_purple_gold',
      'tri_red_green_gold',
      'tri_red_purple_gold',
      'tri_red_blue_purple',
      'tri_blue_purple_green',
      'tri_purple_green_gold',
    ],
  },
  {
    name: 'Draven, Marechal Ferrobruxo',
    title: '6ª Provação do Crisol • Grau IV',
    hp: 28,
    skillTier: 4,
    weather: 'ash_storm',
    passiveName: 'Forja Implacável',
    passiveDesc: 'Contendor de elite com arquétipo Top 5 Global e pressão implacável.',
    championPool: [
      'dual_red_neutral',
      'tri_red_purple_green',
      'tri_red_blue_green',
      'tri_red_blue_gold',
    ],
  },
  {
    name: 'Vaelkor, Árbitro do Sétimo Selo',
    title: 'Provação Final • Grão-Mestre Grau V',
    hp: 30,
    skillTier: 5,
    weather: 'astral_convergence',
    passiveName: 'Convergência dos Cinco Selos',
    passiveDesc: 'Fluxo planar acelerado na batalha decisiva pela 7ª Vitória do Crisol!',
    championPool: [
      'penta_wheel_convergence',
      'tri_red_blue_gold',
      'penta_prismatic_crater',
      'penta_free_city_sovereign',
    ],
  },
];

function hashRunSeed(seedText: string): number {
  let h = 2166136261;
  for (let i = 0; i < seedText.length; i++) {
    h ^= seedText.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function resolveChampionMetaForDraft(champId: UnifiedChampionId): {
  prebuiltDeckId: string;
  domains: Domain[];
  avatarCardId: string;
  title: string;
} {
  const standing = getUnifiedStandingForDeckId(champId);
  if (standing) {
    const pb =
      PREBUILT_DECKS.find((d) => standing.classicDeckIds.includes(d.id)) ?? PREBUILT_DECKS[0];
    return {
      prebuiltDeckId: pb.id,
      domains: [...standing.domains],
      avatarCardId: standing.coverCardId,
      title: standing.name,
    };
  }
  const fallback = PREBUILT_DECKS[0];
  return {
    prebuiltDeckId: fallback.id,
    domains: fallback.domains,
    avatarCardId: fallback.coverCardId,
    title: fallback.name,
  };
}

/**
 * Condenses a 100-card Co-Evolved Champion list into a symmetric 40-card Draft Gauntlet deck
 * (<= 4 Legendaries, <= 2 copies per non-Legendary, preserving signature commander & curve).
 */
function condenseChampionListTo40(cardIds100: string[], avatarCardId: string): string[] {
  const result: string[] = [];
  const counts: Record<string, number> = {};
  let legCount = 0;

  const tryAdd = (cid: string): boolean => {
    const c = CARDS_BY_ID[cid];
    if (!c) return false;
    const isLeg = c.rarity === 'legendary';
    if (isLeg && legCount >= 4) return false;
    const maxCopies = isLeg ? 1 : 2;
    if ((counts[cid] ?? 0) >= maxCopies) return false;
    result.push(cid);
    counts[cid] = (counts[cid] ?? 0) + 1;
    if (isLeg) legCount += 1;
    return true;
  };

  if (CARDS_BY_ID[avatarCardId]) {
    tryAdd(avatarCardId);
  }

  // Stride across the 100-card list so early/mid/late curve proportions stay faithful
  for (let pass = 0; pass < 3 && result.length < 40; pass++) {
    for (let i = pass; i < cardIds100.length && result.length < 40; i += 3) {
      tryAdd(cardIds100[i]);
    }
  }
  for (const cid of cardIds100) {
    if (result.length >= 40) break;
    tryAdd(cid);
  }
  return result.slice(0, 40);
}

export function buildDraftGauntletBoss(
  wins: number,
  runId?: string
): {
  boss: CampaignBoss;
  modifiers: ConquestBattleModifiers | null;
} {
  const tierIdx = Math.max(0, Math.min(CRUCIBLE_CHALLENGERS.length - 1, wins));
  const tier = CRUCIBLE_CHALLENGERS[tierIdx];
  const poolIdx = runId
    ? hashRunSeed(`${runId}_w${wins}`) % tier.championPool.length
    : 0;
  const champId = tier.championPool[poolIdx] ?? tier.championPool[0];
  const champMeta = resolveChampionMetaForDraft(champId);
  const standing = getUnifiedStandingForDeckId(champId);
  const tSpec = AI_SKILL_TIER_SPECS[tier.skillTier];

  const avatarId =
    champMeta.avatarCardId && CARDS_BY_ID[champMeta.avatarCardId]
      ? champMeta.avatarCardId
      : ALL_CARDS[0].id;

  const stubBoss: CampaignBoss = {
    id: `crucible_t${tier.skillTier}_stage_${wins + 1}`,
    stage: wins + 1,
    name: tier.name,
    title: tier.title,
    domains: champMeta.domains,
    avatarCardId: avatarId,
    startingHp: tier.hp,
    passiveName: tier.passiveName,
    passiveDescription: tier.passiveDesc,
    rewardGold: 15,
    loreIntro: `Rodada ${wins + 1} do Crisol dos Cinco Selos.`,
    deckId: champMeta.prebuiltDeckId,
    difficultyTier: tier.skillTier,
    archetypeId: champId,
    archetypeTitle: standing?.name ?? champMeta.title,
  };

  const graduated = resolveCampaignBossGraduatedSetup(stubBoss);
  const condensed40 = condenseChampionListTo40(graduated.cardIds, avatarId);

  const boss: CampaignBoss = {
    ...stubBoss,
    customDeckCardIds: condensed40,
  };

  const baseModifiers: ConquestBattleModifiers = {
    provinceId: `crucible_${wins + 1}`,
    provinceName: `Crisol dos Cinco Selos (${wins}V)`,
    provinceDomain: champMeta.domains[0] ?? 'neutral',
    isDefensiveSiege: false,
    isCapitalSiege: wins === 6,
    playerBonusHp: 0,
    playerBonusEssence: 0,
    enemyOpeningDamage: 0,
    vanguardArmorBonus: 0,
    relicDiscount: false,
    dragonSkyBonus: false,
    legendaryWheelBonus: false,
    landmarkLabel: `Crisol • ${wins + 1}ª Provação (T${tSpec.roman})`,
    initialWeather: tier.weather,
    bannerSummary: `⚖️ Crisol (${wins}V • T${tSpec.roman} ${tSpec.title}${
      standing ? ` • #${standing.rank}/44` : ''
    }): Clima inicial [${tier.passiveName}] por 2 rodadas.`,
  };

  return {
    boss,
    modifiers: applyEquippedRelicToModifiers(baseModifiers),
  };
}

export function computeDraftRewards(wins: number): DraftRewardSummary {
  recordBestDraftWins(wins);

  const raresAndUp = ALL_CARDS.filter((c) => c.rarity === 'rare' || c.rarity === 'legendary');
  const legendaries = ALL_CARDS.filter((c) => c.rarity === 'legendary');

  if (wins >= 7) {
    return {
      gold: 260,
      tierTitle: '🏆 Triunfo Imortal dos Sete Selos (7 Vitórias!)',
      bonusCardIds: [
        pickRandom(legendaries).id,
        pickRandom(raresAndUp).id,
        pickRandom(raresAndUp).id,
        pickRandom(ALL_CARDS).id,
      ],
    };
  }
  if (wins === 6) {
    return {
      gold: 185,
      tierTitle: '👑 Mestre do Crisol (6 Vitórias)',
      bonusCardIds: [
        pickRandom(legendaries).id,
        pickRandom(raresAndUp).id,
        pickRandom(ALL_CARDS).id,
      ],
    };
  }
  if (wins >= 4) {
    return {
      gold: 125,
      tierTitle: '⚔️ Campeão Forjado (4–5 Vitórias)',
      bonusCardIds: [pickRandom(raresAndUp).id, pickRandom(raresAndUp).id],
    };
  }
  if (wins >= 2) {
    return {
      gold: 65,
      tierTitle: '🛡️ Veterano da Forja (2–3 Vitórias)',
      bonusCardIds: [pickRandom(raresAndUp).id],
    };
  }
  return {
    gold: 25,
    tierTitle: '🔥 Batismo do Crisol (0–1 Vitória)',
    bonusCardIds: [pickRandom(ALL_CARDS).id],
  };
}
