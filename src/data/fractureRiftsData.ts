import { CampaignBoss, ConquestBattleModifiers, Domain, RiftMutatorId } from '../types/game';
import { CAMPAIGN_BOSSES, PREBUILT_DECKS } from './decks';

export const WEEKLY_RIFT_GOLD_BONUS = 45;
export const WEEKLY_RIFT_SHARDS_BONUS = 25;
export const STANDARD_RIFT_WIN_GOLD = 15;

const RIFT_PROGRESS_STORAGE_KEY = 'chromatic_pact_fracture_rifts_v1';

export interface FractureRiftDef {
  id: RiftMutatorId;
  name: string;
  kicker: string;
  icon: string;
  domain: Domain;
  accent: string;
  shortRule: string;
  detailedRule: string;
  tacticalTip: string;
  challengerName: string;
  challengerTitle: string;
  challengerAvatarId: string;
  challengerDeckId: string;
  challengerHp: number;
}

export const FRACTURE_RIFTS: FractureRiftDef[] = [
  {
    id: 'astral_torrent',
    name: 'Torrente Astral',
    kicker: 'FENDA DE HIPER-ESSÊNCIA',
    icon: '⚡',
    domain: 'blue',
    accent: '#38bdf8',
    shortRule: 'Início com 6⚡, +2⚡/rodada (teto 12⚡) e +1 carta comprada por turno.',
    detailedRule:
      'As linhas de força planar transbordam: ambos os Soberanos iniciam com 6⚡ de Essência, ganham +2⚡ de Essência máxima a cada rodada (até 12⚡) e compram +1 carta extra por turno.',
    tacticalTip: 'Inclua titãs de custo alto, combos de múltiplos feitiços e compras explosivas.',
    challengerName: 'Aethon, Senhor da Torrente',
    challengerTitle: 'Arconte da Fenda Safira',
    challengerAvatarId: 'blue_06_dragao_azul',
    challengerDeckId: 'deck_blue_tempest',
    challengerHp: 44,
  },
  {
    id: 'immortal_pantheon',
    name: 'Panteão dos Imortais',
    kicker: 'FENDA DE CONVERGÊNCIA LENDÁRIA',
    icon: '👑',
    domain: 'gold',
    accent: '#facc15',
    shortRule: 'Cartas Lendárias custam -2⚡ de Essência e entram com +1 ATQ / +1 PV.',
    detailedRule:
      'Os antigos tronos respondem ao chamado: todas as cartas de raridade Lendária custam -2⚡ de Essência (mínimo 1⚡) e criaturas Lendárias entram em campo fortalecidas com +1/+1.',
    tacticalTip: 'Maximize suas 10 Lendas no Grimório para dominar o tabuleiro cedo.',
    challengerName: 'Aurion, Vigia do Panteão',
    challengerTitle: 'Regente das Dez Coroas',
    challengerAvatarId: 'gold_09_serafim_solar',
    challengerDeckId: 'deck_gold_bastion',
    challengerHp: 46,
  },
  {
    id: 'eternal_cataclysm',
    name: 'Cataclismo Mutante',
    kicker: 'FENDA DE TEMPESTADE PERPÉTUA',
    icon: '🌪️',
    domain: 'red',
    accent: '#f97316',
    shortRule: 'O Clima Planar nunca expira e transmuta entre os 6 Climas a cada rodada.',
    detailedRule:
      'Cinzas rubras, nevascas astrais, eclipses e monções se alternam sem cessar: no início de cada rodada, a arena transmuta para um novo Clima Elemental ativo para ambos os lados.',
    tacticalTip: 'Adapte sua postura (Ataque/Bastião) conforme o clima da rodada atual.',
    challengerName: 'Ignarok da Fenda Vulcânica',
    challengerTitle: 'Arauto das Seis Tormentas',
    challengerAvatarId: 'red_08_dragao_vermelho',
    challengerDeckId: 'deck_red_inferno',
    challengerHp: 44,
  },
  {
    id: 'glass_thrones',
    name: 'Tronos de Vidro',
    kicker: 'FENDA DE MORTE SÚBITA REAL',
    icon: '🩸',
    domain: 'red',
    accent: '#ef4444',
    shortRule: 'Ambos os Soberanos têm 20 PV; todas as criaturas ganham +2 ATQ e Ímpeto.',
    detailedRule:
      'Nenhum bastião está seguro: os dois Soberanos iniciam com apenas 20 PV, enquanto toda criatura invocada entra em campo com +2 ATQ e Ímpeto imediato.',
    tacticalTip: 'Guardiões na Vanguarda, Escudo Divino e Reações de emboscada decidem em poucos turnos!',
    challengerName: 'Kaelen, Lâmina de Cristal',
    challengerTitle: 'Executor da Fenda Carmesim',
    challengerAvatarId: 'red_119_soberano_piroclasma',
    challengerDeckId: 'deck_red_inferno',
    challengerHp: 20,
  },
  {
    id: 'living_forge',
    name: 'Era das Relíquias',
    kicker: 'FENDA DA FORJA ANCESTRAL',
    icon: '🏛️',
    domain: 'gold',
    accent: '#f59e0b',
    shortRule: 'Relíquias custam -2⚡ de Essência e concedem +1🛡️ Armadura na mesma coluna.',
    detailedRule:
      'Os autômatos primordiais despertaram: cartas do tipo Relíquia custam -2⚡ de Essência (mínimo 0⚡) e concedem +1🛡️ de Armadura adicional a todas as criaturas aliadas na mesma coluna.',
    tacticalTip: 'Posicione Relíquias na Retaguarda atrás dos seus Guardiões principais.',
    challengerName: 'Vaelgor, Arquiteto de Bronze',
    challengerTitle: 'Mestre das Relíquias Vivas',
    challengerAvatarId: 'gold_07_dragao_ouro',
    challengerDeckId: 'deck_gold_bastion',
    challengerHp: 45,
  },
  {
    id: 'black_sun_night',
    name: 'Noite do Sol Negro',
    kicker: 'FENDA DA CRIPTA DESPERTA',
    icon: '💀',
    domain: 'purple',
    accent: '#a855f7',
    shortRule: 'Todas as criaturas invocadas recebem a palavra-chave Renascer.',
    detailedRule:
      'O véu entre a vida e a Cripta foi rasgado: toda criatura invocada por qualquer Soberano recebe automaticamente Renascer, retornando com 1 PV na primeira vez em que for destruída.',
    tacticalTip: 'Efeitos de morte (on_death), Atropelar e Sopro Elemental brilham contra fileiras imortais.',
    challengerName: 'Morvath do Eclipse Eterno',
    challengerTitle: 'Soberano da Fenda Umbral',
    challengerAvatarId: 'purple_08_lorde_abissal',
    challengerDeckId: 'deck_purple_abyss',
    challengerHp: 44,
  },
];

export const FRACTURE_RIFTS_BY_ID: Record<RiftMutatorId, FractureRiftDef> =
  FRACTURE_RIFTS.reduce((acc, r) => {
    acc[r.id] = r;
    return acc;
  }, {} as Record<RiftMutatorId, FractureRiftDef>);

export function getCurrentIsoWeekKey(): string {
  const now = new Date();
  const utc = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const dayNum = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((utc.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${utc.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

export function getWeeklyFeaturedRift(): FractureRiftDef {
  const weekKey = getCurrentIsoWeekKey();
  let hash = 0;
  for (let i = 0; i < weekKey.length; i++) {
    hash = (hash * 31 + weekKey.charCodeAt(i)) >>> 0;
  }
  return FRACTURE_RIFTS[hash % FRACTURE_RIFTS.length] ?? FRACTURE_RIFTS[0];
}

export interface RiftProgressData {
  claimedWeekKeys: string[];
  clearedRiftCounts: Partial<Record<RiftMutatorId, number>>;
}

export function loadRiftProgress(): RiftProgressData {
  if (typeof window === 'undefined') {
    return { claimedWeekKeys: [], clearedRiftCounts: {} };
  }
  try {
    const raw = localStorage.getItem(RIFT_PROGRESS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<RiftProgressData>;
      return {
        claimedWeekKeys: Array.isArray(parsed.claimedWeekKeys) ? parsed.claimedWeekKeys : [],
        clearedRiftCounts: parsed.clearedRiftCounts ?? {},
      };
    }
  } catch {
    // Ignore storage error
  }
  return { claimedWeekKeys: [], clearedRiftCounts: {} };
}

export function recordRiftVictory(riftId: RiftMutatorId): {
  progress: RiftProgressData;
  awardedWeeklyBonus: boolean;
} {
  const current = loadRiftProgress();
  const weekKey = getCurrentIsoWeekKey();
  const featured = getWeeklyFeaturedRift();
  const isWeeklyFeatured = featured.id === riftId;
  const alreadyClaimedWeek = current.claimedWeekKeys.includes(weekKey);
  const awardedWeeklyBonus = isWeeklyFeatured && !alreadyClaimedWeek;

  const next: RiftProgressData = {
    claimedWeekKeys: awardedWeeklyBonus
      ? [...current.claimedWeekKeys, weekKey]
      : current.claimedWeekKeys,
    clearedRiftCounts: {
      ...current.clearedRiftCounts,
      [riftId]: (current.clearedRiftCounts[riftId] ?? 0) + 1,
    },
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(RIFT_PROGRESS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage error
    }
  }

  return { progress: next, awardedWeeklyBonus };
}

export function buildRiftBattleEncounter(riftId: RiftMutatorId): {
  boss: CampaignBoss;
  modifiers: ConquestBattleModifiers;
} {
  const rift = FRACTURE_RIFTS_BY_ID[riftId] ?? FRACTURE_RIFTS[0];
  const validDeck =
    PREBUILT_DECKS.find((d) => d.id === rift.challengerDeckId)?.id ??
    CAMPAIGN_BOSSES[0]?.deckId ??
    PREBUILT_DECKS[0].id;

  const boss: CampaignBoss = {
    id: `rift_boss_${rift.id}`,
    stage: 1,
    name: rift.challengerName,
    title: `${rift.icon} ${rift.name} • ${rift.challengerTitle}`,
    domains: [rift.domain],
    avatarCardId: rift.challengerAvatarId,
    startingHp: rift.challengerHp,
    passiveName: `Mutador: ${rift.name}`,
    passiveDescription: rift.shortRule,
    rewardGold: STANDARD_RIFT_WIN_GOLD,
    loreIntro: rift.detailedRule,
    deckId: validDeck,
  };

  const modifiers: ConquestBattleModifiers = {
    provinceId: `rift_${rift.id}`,
    provinceName: `Fenda: ${rift.name}`,
    provinceDomain: rift.domain,
    isDefensiveSiege: false,
    isCapitalSiege: false,
    playerBonusHp: 0,
    playerBonusEssence: 0,
    enemyOpeningDamage: 0,
    vanguardArmorBonus: 0,
    relicDiscount: false,
    dragonSkyBonus: false,
    legendaryWheelBonus: false,
    bannerSummary: `${rift.icon} Fenda [${rift.name}]: ${rift.shortRule}`,
    landmarkLabel: `Fenda: ${rift.name}`,
    initialWeather: rift.id === 'eternal_cataclysm' ? 'ash_storm' : undefined,
    riftMutator: rift.id,
    riftName: rift.name,
    riftIcon: rift.icon,
  };

  return { boss, modifiers };
}
