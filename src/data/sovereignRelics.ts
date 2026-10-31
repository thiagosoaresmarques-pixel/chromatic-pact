import { ConquestBattleModifiers, Domain } from '../types/game';
import { getVisitedCampaignLandmarks } from './vaeloriaOverworldEvents';

export interface SovereignRelicDef {
  id: string;
  name: string;
  icon: string;
  domain: Domain;
  loreSnippet: string;
  shortBonus: string;
  unlockRequirementLabel: string;
  starterUnlocked?: boolean;
  bonusHp?: number;
  bonusEssence?: number;
  enemyOpeningDamage?: number;
  vanguardArmorBonus?: number;
  bonusOpeningDraw?: number;
  bonusAffinityDomain?: Domain | 'auto';
}

export const SOVEREIGN_RELICS: SovereignRelicDef[] = [
  {
    id: 'relic_axial_signet',
    name: 'Anel do Pacto Pentacromático',
    icon: '💍',
    domain: 'neutral',
    loreSnippet: 'Forjado nas fundações da Torre dos Cinco Selos para os primeiros portadores do Pacto.',
    shortBonus: '+3❤️ PV Máx & +1 Afinidade Inicial no domínio principal do deck',
    unlockRequirementLabel: 'Desbloqueada de início para todo Soberano',
    starterUnlocked: true,
    bonusHp: 3,
    bonusAffinityDomain: 'auto',
  },
  {
    id: 'relic_pyros_ember_crown',
    name: 'Coroa de Brasas de Ignaroth',
    icon: '🔥',
    domain: 'red',
    loreSnippet: 'Cinza viva da Caldera que incendeia o horizonte antes da primeira carga.',
    shortBonus: 'Causa 3🔥 de dano inicial ao Soberano inimigo na abertura',
    unlockRequirementLabel: 'Desbloqueada de início para todo Soberano',
    starterUnlocked: true,
    enemyOpeningDamage: 3,
  },
  {
    id: 'relic_vortex_astrolabe',
    name: 'Astrolábio de Cristália',
    icon: '❄️',
    domain: 'blue',
    loreSnippet: 'Lentes de gelo astral capazes de prever o primeiro movimento do adversário.',
    shortBonus: 'Compra +1 Carta extra na mão inicial & +1 Afinidade Azul',
    unlockRequirementLabel: 'Derrote 1 Chefe de Campanha ou explore 2 Marcos Regionais',
    bonusOpeningDraw: 1,
    bonusAffinityDomain: 'blue',
  },
  {
    id: 'relic_veridia_heartroot',
    name: 'Raiz-Coração de Veridia',
    icon: '🌿',
    domain: 'green',
    loreSnippet: ' Âmbar pulsante colhido sob o dossel milenar de Sylvanor.',
    shortBonus: '+6❤️ PV Máximos iniciais ao Soberano',
    unlockRequirementLabel: 'Derrote 2 Chefes de Campanha ou vença 3 duelos na Arena',
    bonusHp: 6,
  },
  {
    id: 'relic_eclipse_censer',
    name: 'Turíbulo do Vale Umbral',
    icon: '🌑',
    domain: 'purple',
    loreSnippet: 'Exala névoa abissal que drena o vigor do trono inimigo antes do embate.',
    shortBonus: '+3❤️ PV Máx ao Soberano & 2💀 de dano inicial ao rival',
    unlockRequirementLabel: 'Explore 3 Marcos Vivos de Vaeloria ou derrote 4 Chefes',
    bonusHp: 3,
    enemyOpeningDamage: 2,
  },
  {
    id: 'relic_solaria_aegis',
    name: 'Égide Solar de Aethelgard',
    icon: '☀️',
    domain: 'gold',
    loreSnippet: 'Escudo cerimonial banhado na luz perpétua da Cidadela Dourada.',
    shortBonus: '+4❤️ PV Máx & +1🛡️ Armadura nas unidades da Vanguarda',
    unlockRequirementLabel: 'Derrote 5 Chefes de Campanha ou conquiste vitórias no Crisol',
    bonusHp: 4,
    vanguardArmorBonus: 1,
  },
  {
    id: 'relic_pyros_obsidian_horn',
    name: 'Trompa de Obsidiana Bélica',
    icon: '📯',
    domain: 'red',
    loreSnippet: 'Seu clamor racha muralhas antes mesmo que as falanges cruzem o passo.',
    shortBonus: '4🔥 de dano inicial ao inimigo & +1 Afinidade Vermelha',
    unlockRequirementLabel: 'Derrote 6 Chefes de Campanha ou explore 6 Marcos Regionais',
    enemyOpeningDamage: 4,
    bonusAffinityDomain: 'red',
  },
  {
    id: 'relic_vortex_chrono_prism',
    name: 'Prisma Cronomântico Polar',
    icon: '⏳',
    domain: 'blue',
    loreSnippet: 'Dilata os segundos iniciais da batalha, condensando Essência pura.',
    shortBonus: '+1⚡ Essência Máxima já no Turno 1',
    unlockRequirementLabel: 'Derrote 8 Chefes de Campanha ou alcance 3+ vitórias no Crisol',
    bonusEssence: 1,
  },
  {
    id: 'relic_veridia_amber_fang',
    name: 'Presa Primordial Engastada',
    icon: '🐾',
    domain: 'green',
    loreSnippet: 'Relíquia ancestral dos predadores alfa das matas profundas.',
    shortBonus: '+4❤️ PV Máx, +1 Carta inicial & +1 Afinidade Verde',
    unlockRequirementLabel: 'Derrote 10 Chefes de Campanha ou explore 10 Marcos Regionais',
    bonusHp: 4,
    bonusOpeningDraw: 1,
    bonusAffinityDomain: 'green',
  },
  {
    id: 'relic_eclipse_abyssal_lantern',
    name: 'Lanterna das Almas Veladas',
    icon: '🕯️',
    domain: 'purple',
    loreSnippet: 'Guia ecos esquecidos da Cripta diretamente para a mão do portador.',
    shortBonus: '+1 Carta comprada na abertura, 2💀 ao rival & +1 Afinidade Púrpura',
    unlockRequirementLabel: 'Derrote 12 Chefes de Campanha ou vença 10 partidas',
    bonusOpeningDraw: 1,
    enemyOpeningDamage: 2,
    bonusAffinityDomain: 'purple',
  },
  {
    id: 'relic_solaria_imperial_scepter',
    name: 'Cetro Radiante do Zênite',
    icon: '👑',
    domain: 'gold',
    loreSnippet: 'Insígnia máxima dos arcontes solares que governam pelo decreto da luz.',
    shortBonus: '+1⚡ Essência Inicial, +3❤️ PV Máx & +1 Afinidade Dourada',
    unlockRequirementLabel: 'Derrote 15 Chefes de Campanha ou conquiste 5+ vitórias no Crisol',
    bonusEssence: 1,
    bonusHp: 3,
    bonusAffinityDomain: 'gold',
  },
  {
    id: 'relic_axial_wheel_shard',
    name: 'Estilhaço da Roda Suprema',
    icon: '☸️',
    domain: 'neutral',
    loreSnippet: 'Fragmento cristalizado do eixo onde convergem os cinco tronos cromáticos.',
    shortBonus: '+1⚡ Essência Inicial, +4❤️ PV Máx & +1 Carta na abertura',
    unlockRequirementLabel: 'Derrote 20 Chefes de Campanha ou alcance 7 Vitórias no Crisol',
    bonusEssence: 1,
    bonusHp: 4,
    bonusOpeningDraw: 1,
  },
];

export const SOVEREIGN_RELICS_BY_ID: Record<string, SovereignRelicDef> = Object.fromEntries(
  SOVEREIGN_RELICS.map((r) => [r.id, r])
);

const EQUIPPED_RELIC_STORAGE_KEY = 'chromatic_pact_equipped_relic_v1';
const DRAFT_BEST_WINS_STORAGE_KEY = 'chromatic_pact_draft_best_wins_v1';

export function getBestDraftWins(): number {
  if (typeof window === 'undefined') return 0;
  try {
    return Math.max(0, Number(localStorage.getItem(DRAFT_BEST_WINS_STORAGE_KEY) || '0') || 0);
  } catch {
    return 0;
  }
}

export function recordBestDraftWins(wins: number): void {
  if (typeof window === 'undefined') return;
  try {
    const prev = getBestDraftWins();
    if (wins > prev) {
      localStorage.setItem(DRAFT_BEST_WINS_STORAGE_KEY, String(wins));
    }
  } catch {
    // Ignore storage errors
  }
}

export interface RelicUnlockContext {
  defeatedBossCount: number;
  arenaWins: number;
  visitedLandmarksCount?: number;
  bestDraftWins?: number;
}

export function isRelicUnlocked(relic: SovereignRelicDef, ctx: RelicUnlockContext): boolean {
  if (relic.starterUnlocked) return true;
  const landmarks = ctx.visitedLandmarksCount ?? getVisitedCampaignLandmarks().size;
  const draftBest = ctx.bestDraftWins ?? getBestDraftWins();
  const totalWins = ctx.arenaWins + ctx.defeatedBossCount;

  switch (relic.id) {
    case 'relic_vortex_astrolabe':
      return ctx.defeatedBossCount >= 1 || landmarks >= 2;
    case 'relic_veridia_heartroot':
      return ctx.defeatedBossCount >= 2 || totalWins >= 3;
    case 'relic_eclipse_censer':
      return landmarks >= 3 || ctx.defeatedBossCount >= 4;
    case 'relic_solaria_aegis':
      return ctx.defeatedBossCount >= 5 || draftBest >= 1;
    case 'relic_pyros_obsidian_horn':
      return ctx.defeatedBossCount >= 6 || landmarks >= 6;
    case 'relic_vortex_chrono_prism':
      return ctx.defeatedBossCount >= 8 || draftBest >= 3;
    case 'relic_veridia_amber_fang':
      return ctx.defeatedBossCount >= 10 || landmarks >= 10;
    case 'relic_eclipse_abyssal_lantern':
      return ctx.defeatedBossCount >= 12 || totalWins >= 10;
    case 'relic_solaria_imperial_scepter':
      return ctx.defeatedBossCount >= 15 || draftBest >= 5;
    case 'relic_axial_wheel_shard':
      return ctx.defeatedBossCount >= 20 || draftBest >= 7;
    default:
      return false;
  }
}

export function getEquippedRelicId(): string {
  if (typeof window === 'undefined') return SOVEREIGN_RELICS[0].id;
  try {
    const saved = localStorage.getItem(EQUIPPED_RELIC_STORAGE_KEY);
    if (saved && (saved === 'none' || SOVEREIGN_RELICS_BY_ID[saved])) {
      return saved;
    }
  } catch {
    // Ignore
  }
  return SOVEREIGN_RELICS[0].id;
}

export function setEquippedRelicId(relicId: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(EQUIPPED_RELIC_STORAGE_KEY, relicId);
  } catch {
    // Ignore
  }
}

export function applyEquippedRelicToModifiers(
  base: ConquestBattleModifiers | null | undefined,
  relicId?: string | null
): ConquestBattleModifiers | null {
  const effectiveId = relicId ?? getEquippedRelicId();
  if (!effectiveId || effectiveId === 'none') {
    return base ?? null;
  }
  const relic = SOVEREIGN_RELICS_BY_ID[effectiveId];
  if (!relic) return base ?? null;

  const fallbackBase: ConquestBattleModifiers = base ?? {
    provinceId: 'relic_field',
    provinceName: 'Campo de Vaeloria',
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
    bannerSummary: `${relic.icon} ${relic.name}: ${relic.shortBonus}`,
  };

  const summaryParts = [fallbackBase.bannerSummary];
  if (base) {
    summaryParts.push(`${relic.icon} Relíquia [${relic.name}]: ${relic.shortBonus}`);
  }

  return {
    ...fallbackBase,
    playerBonusHp: fallbackBase.playerBonusHp + (relic.bonusHp ?? 0),
    playerBonusEssence: fallbackBase.playerBonusEssence + (relic.bonusEssence ?? 0),
    enemyOpeningDamage: fallbackBase.enemyOpeningDamage + (relic.enemyOpeningDamage ?? 0),
    vanguardArmorBonus: fallbackBase.vanguardArmorBonus + (relic.vanguardArmorBonus ?? 0),
    bannerSummary: summaryParts.filter(Boolean).join(' • '),
    equippedRelic: {
      id: relic.id,
      name: relic.name,
      icon: relic.icon,
      shortBonus: relic.shortBonus,
      bonusOpeningDraw: relic.bonusOpeningDraw,
      bonusAffinityDomain: relic.bonusAffinityDomain,
    },
  };
}
