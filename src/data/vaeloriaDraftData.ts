import { ALL_CARDS, CARDS_BY_ID } from './cards';
import { PREBUILT_DECKS } from './decks';
import { ArenaWeatherType, CampaignBoss, CardDefinition, ConquestBattleModifiers, Domain } from '../types/game';
import { applyEquippedRelicToModifiers, recordBestDraftWins } from './sovereignRelics';

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
  weather: ArenaWeatherType;
  passiveName: string;
  passiveDesc: string;
}> = [
  {
    name: 'Kaelen, Iniciado das Brasas',
    title: '1ª Provação do Crisol',
    hp: 20,
    weather: 'ash_storm',
    passiveName: 'Batismo das Cinzas',
    passiveDesc: 'Arena aquecida pela Tempestade de Cinzas nos 2 primeiros turnos.',
  },
  {
    name: 'Lyra, Vigia de Cristália',
    title: '2ª Provação do Crisol',
    hp: 22,
    weather: 'astral_blizzard',
    passiveName: 'Lente Polar',
    passiveDesc: 'Nevasca Astral inicial testa a resiliência da sua curva de Essência.',
  },
  {
    name: 'Thorn, Voz da Mata Antiga',
    title: '3ª Provação do Crisol',
    hp: 23,
    weather: 'sylvan_monsoon',
    passiveName: 'Seiva Crescente',
    passiveDesc: 'Monção Primordial regenera unidades em combate nos turnos iniciais.',
  },
  {
    name: 'Malakor, Tecelão do Eclipse',
    title: '4ª Provação do Crisol',
    hp: 25,
    weather: 'umbral_eclipse',
    passiveName: 'Véu Abissal',
    passiveDesc: 'Eclipse Umbral drena a vitalidade dos tronos a cada abertura.',
  },
  {
    name: 'Aurelia, Juíza do Zênite',
    title: '5ª Provação do Crisol',
    hp: 26,
    weather: 'solar_zenith',
    passiveName: 'Decreto Solar',
    passiveDesc: 'Zênite Solar concede armadura adicional à Vanguarda.',
  },
  {
    name: 'Draven, Marechal Ferrobruxo',
    title: '6ª Provação do Crisol',
    hp: 28,
    weather: 'ash_storm',
    passiveName: 'Forja Implacável',
    passiveDesc: 'Veterano de seis selos com grimório agressivo e pressão constante.',
  },
  {
    name: 'Vaelkor, Árbitro do Sétimo Selo',
    title: 'Provação Final • Campeão Imortal',
    hp: 30,
    weather: 'astral_convergence',
    passiveName: 'Convergência dos Cinco Selos',
    passiveDesc: 'Fluxo planar acelerado na batalha decisiva pela 7ª Vitória do Crisol!',
  },
];

export function buildDraftGauntletBoss(wins: number): {
  boss: CampaignBoss;
  modifiers: ConquestBattleModifiers | null;
} {
  const tierIdx = Math.max(0, Math.min(CRUCIBLE_CHALLENGERS.length - 1, wins));
  const tier = CRUCIBLE_CHALLENGERS[tierIdx];
  const deck = PREBUILT_DECKS[(wins * 4 + 1) % PREBUILT_DECKS.length] ?? PREBUILT_DECKS[0];
  const avatarId =
    deck.coverCardId && CARDS_BY_ID[deck.coverCardId]
      ? deck.coverCardId
      : deck.cardIds[0] ?? ALL_CARDS[0].id;

  const boss: CampaignBoss = {
    id: `crucible_stage_${wins + 1}`,
    stage: wins + 1,
    name: tier.name,
    title: tier.title,
    domains: deck.domains,
    avatarCardId: avatarId,
    startingHp: tier.hp,
    passiveName: tier.passiveName,
    passiveDescription: tier.passiveDesc,
    rewardGold: 15,
    loreIntro: `Rodada ${wins + 1} do Crisol dos Cinco Selos.`,
    deckId: deck.id,
  };

  const baseModifiers: ConquestBattleModifiers = {
    provinceId: `crucible_${wins + 1}`,
    provinceName: `Crisol dos Cinco Selos (${wins}V)`,
    provinceDomain: deck.domains[0] ?? 'neutral',
    isDefensiveSiege: false,
    isCapitalSiege: wins === 6,
    playerBonusHp: 0,
    playerBonusEssence: 0,
    enemyOpeningDamage: 0,
    vanguardArmorBonus: 0,
    relicDiscount: false,
    dragonSkyBonus: false,
    legendaryWheelBonus: false,
    landmarkLabel: `Crisol • ${wins + 1}ª Provação`,
    initialWeather: tier.weather,
    bannerSummary: `⚖️ Crisol (${wins} Vitórias): Clima inicial [${tier.passiveName}] por 2 rodadas.`,
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
