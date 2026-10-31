import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ALL_CARDS, CARDS_BY_ID } from '../data/cards';
import { MAX_COPIES_BY_RARITY, MAX_LEGENDARIES_PER_DECK, REQUIRED_DECK_SIZE } from '../data/decks';
import {
  AiDecisionWeights,
  DeckLearnedAiProfile,
  DEFAULT_AI_WEIGHTS,
  DiscoveredCardCombo,
} from '../data/aiLearnedProfiles';
import {
  CardShapleyMetric,
  DomainTierLadderBenchmark,
  MonocolorArchetypeId,
  MonocolorArchetypeMastery,
  MonocolorTrainingSummary,
  TierDeckMetadata,
} from '../data/aiMonocolorMasteryData';
import { createInitialGameState, getAllBoardUnits, mulliganCards } from '../engine/gameEngine';
import {
  AiProfileOverrides,
  chooseMulliganIndicesForActor,
  executeTurnStepForActor,
} from '../engine/aiEngine';
import {
  extractNormalizedStateFeatures,
  SerializedValueMlp,
  trainValueMlpWithAdam,
  ValueTrainingSample,
} from '../engine/aiValueNetwork';
import { AiSkillTier, CardDefinition, Domain, Rarity } from '../types/game';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ArchetypeBlueprint {
  id: MonocolorArchetypeId;
  domain: Domain;
  name: string;
  subtitle: string;
  strategySummary: string;
  tacticalIdentity: 'aggro' | 'midrange' | 'control' | 'ramp' | 'tempo' | 'attrition';
  seedWeights: AiDecisionWeights;
  targetAvgCost: number;
  minEarlyDrops: number;
  minCreatures: number;
}

const ARCHETYPE_BLUEPRINTS: ArchetypeBlueprint[] = [
  // ======================== GREEN (VERIDIA) ========================
  {
    id: 'mono_green_swarm',
    domain: 'green',
    name: 'Enxame & Matilha Silvestre',
    subtitle: 'Mono-Verde 🌿 • Aggro & Buff em Massa',
    strategySummary:
      'Inunda as 6 colunas cedo com feras velozes, invocações de matilha e rugidos de fortalecimento coletivo para letal explosivo.',
    tacticalIdentity: 'aggro',
    targetAvgCost: 2.7,
    minEarlyDrops: 34,
    minCreatures: 64,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.32,
      tradeValueBias: 0.92,
      stackConsolidationBias: 0.85,
      antiAoeSpreadBias: 1.25,
      synergyHoldBonus: 24,
      mulliganCurveTarget: 2.6,
    },
  },
  {
    id: 'mono_green_colossus',
    domain: 'green',
    name: 'Colossos Primordiais',
    subtitle: 'Mono-Verde 🌿 • Ramp & Atropelar',
    strategySummary:
      'Acelera Essência com xamãs druídicos para esmagar linhas defensivas com dinossauros e titãs dotados de Atropelar.',
    tacticalIdentity: 'ramp',
    targetAvgCost: 3.9,
    minEarlyDrops: 24,
    minCreatures: 58,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.15,
      tradeValueBias: 1.12,
      ascensionEagerness: 1.18,
      domainExpansionEagerness: 1.22,
      mulliganCurveTarget: 3.2,
    },
  },
  {
    id: 'mono_green_roots',
    domain: 'green',
    name: 'Raízes Eternas',
    subtitle: 'Mono-Verde 🌿 • Guardião & Regeneração',
    strategySummary:
      'Ergue muralhas vivas com Guardião, Regeneração e curas recorrentes, vencendo por atrito intransponível de Vanguarda.',
    tacticalIdentity: 'attrition',
    targetAvgCost: 3.4,
    minEarlyDrops: 26,
    minCreatures: 58,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 0.86,
      tradeValueBias: 1.28,
      guardianPriority: 1.38,
      relicPriority: 1.15,
      mulliganCurveTarget: 3.0,
    },
  },

  // ======================== RED (PYROS) ========================
  {
    id: 'mono_red_blitz',
    domain: 'red',
    name: 'Blitz Salamandra',
    subtitle: 'Mono-Vermelho 🔥 • Ímpeto & Pele Incandescente',
    strategySummary:
      'Assalto relâmpago com tropas de Ímpeto, Fúria Crescente e Pele Incandescente que punem qualquer bloqueio inimigo.',
    tacticalIdentity: 'aggro',
    targetAvgCost: 2.5,
    minEarlyDrops: 38,
    minCreatures: 62,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.45,
      tradeValueBias: 0.84,
      bloodPactThresholdHp: 20,
      sovPowerTempoBias: 1.2,
      mulliganCurveTarget: 2.4,
    },
  },
  {
    id: 'mono_red_pyroclasm',
    domain: 'red',
    name: 'Artilharia Piroclástica',
    subtitle: 'Mono-Vermelho 🔥 • Queima Direta & Cataclismos',
    strategySummary:
      'Varre fileiras inimigas com erupções vulcânicas, armadilhas de magma e dano direto letal contra o Soberano rival.',
    tacticalIdentity: 'control',
    targetAvgCost: 3.3,
    minEarlyDrops: 26,
    minCreatures: 46,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.25,
      tradeValueBias: 1.15,
      spellHoldPatience: 1.24,
      synergyHoldBonus: 26,
      mulliganCurveTarget: 3.0,
    },
  },
  {
    id: 'mono_red_dragon',
    domain: 'red',
    name: 'Trono Dracônico',
    subtitle: 'Mono-Vermelho 🔥 • Voo, Sopro & Ascensão',
    strategySummary:
      'Domina os céus com wyverns e dragões anciãos de Voo, Sopro Elemental e Ascensão, ignorando bloqueadores terrestres.',
    tacticalIdentity: 'midrange',
    targetAvgCost: 3.8,
    minEarlyDrops: 24,
    minCreatures: 56,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.18,
      flyingEvasionBias: 1.38,
      ascensionEagerness: 1.28,
      domainExpansionEagerness: 1.25,
      mulliganCurveTarget: 3.1,
    },
  },

  // ======================== BLUE (VÓRTEX) ========================
  {
    id: 'mono_blue_frost',
    domain: 'blue',
    name: 'Inverno Eterno',
    subtitle: 'Mono-Azul ❄️ • Congelar & Estase Tática',
    strategySummary:
      'Paralisa a Vanguarda inimiga turno após turno com Congelar em área e elementais glaciais enquanto dita o ritmo da mesa.',
    tacticalIdentity: 'tempo',
    targetAvgCost: 3.1,
    minEarlyDrops: 28,
    minCreatures: 52,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.08,
      tradeValueBias: 1.22,
      spellHoldPatience: 1.22,
      synergyHoldBonus: 26,
      mulliganCurveTarget: 2.9,
    },
  },
  {
    id: 'mono_blue_chrono',
    domain: 'blue',
    name: 'Conclave Cronomante',
    subtitle: 'Mono-Azul ⚡ • Compra, Reações & Feitiços',
    strategySummary:
      'Gera vantagem massiva de cartas, aciona gatilhos de conjuração arcana e neutraliza jogadas rivais com reações e devoluções.',
    tacticalIdentity: 'control',
    targetAvgCost: 3.2,
    minEarlyDrops: 26,
    minCreatures: 46,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 0.94,
      tradeValueBias: 1.30,
      spellHoldPatience: 1.32,
      relicPriority: 1.2,
      mulliganCurveTarget: 3.0,
    },
  },
  {
    id: 'mono_blue_abyssal',
    domain: 'blue',
    name: 'Frota Abissal',
    subtitle: 'Mono-Azul 🌊 • Voo, Alcance & Leviatãs',
    strategySummary:
      'Combina batedores aéreos de Voo/Alcance na Retaguarda com leviatãs oceânicos colossais para pressão evasiva implacável.',
    tacticalIdentity: 'midrange',
    targetAvgCost: 3.6,
    minEarlyDrops: 26,
    minCreatures: 58,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.18,
      flyingEvasionBias: 1.42,
      tradeValueBias: 1.12,
      domainExpansionEagerness: 1.22,
      mulliganCurveTarget: 3.0,
    },
  },

  // ======================== PURPLE (ECLIPSE) ========================
  {
    id: 'mono_purple_crypt',
    domain: 'purple',
    name: 'Culto da Cripta',
    subtitle: 'Mono-Roxo 💀 • Renascer & Reanimação',
    strategySummary:
      'Transforma a Cripta em recurso infinito com tropas de Renascer, gatilhos de Último Suspiro e rituais de ressurreição.',
    tacticalIdentity: 'attrition',
    targetAvgCost: 3.2,
    minEarlyDrops: 30,
    minCreatures: 60,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.05,
      tradeValueBias: 1.28,
      synergyHoldBonus: 25,
      domainExpansionEagerness: 1.22,
      mulliganCurveTarget: 2.9,
    },
  },
  {
    id: 'mono_purple_blood',
    domain: 'purple',
    name: 'Pacto Sanguíneo',
    subtitle: 'Mono-Roxo 🩸 • Dreno de Vida & Toque Letal',
    strategySummary:
      'Sustenta pactos agressivos e Corrupção convertendo vida drenada em pressão letal com vampiros e assassinos de Toque Letal.',
    tacticalIdentity: 'aggro',
    targetAvgCost: 2.9,
    minEarlyDrops: 32,
    minCreatures: 58,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.28,
      tradeValueBias: 1.15,
      bloodPactThresholdHp: 18,
      ascensionEagerness: 1.2,
      mulliganCurveTarget: 2.7,
    },
  },
  {
    id: 'mono_purple_umbral',
    domain: 'purple',
    name: 'Inquisição Umbral',
    subtitle: 'Mono-Roxo 🌑 • Destruição, Debuff & Controle',
    strategySummary:
      'Aniquila ameaças-chave com destruição direta, drena o ATQ da Vanguarda inimiga e domina o fim de jogo com lordes abissais.',
    tacticalIdentity: 'control',
    targetAvgCost: 3.5,
    minEarlyDrops: 25,
    minCreatures: 48,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 0.92,
      tradeValueBias: 1.36,
      spellHoldPatience: 1.28,
      relicPriority: 1.18,
      mulliganCurveTarget: 3.1,
    },
  },

  // ======================== GOLD (SOLÁRIA) ========================
  {
    id: 'mono_gold_phalanx',
    domain: 'gold',
    name: 'Falange Impenetrável',
    subtitle: 'Mono-Dourado 🛡️ • Guardião, Armadura & Bastião',
    strategySummary:
      'Forma linhas blindadas de Guardiões com alta Armadura e estandartes de comando que anulam investidas agressivas.',
    tacticalIdentity: 'midrange',
    targetAvgCost: 3.1,
    minEarlyDrops: 30,
    minCreatures: 60,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 0.98,
      tradeValueBias: 1.26,
      guardianPriority: 1.42,
      stackConsolidationBias: 1.22,
      mulliganCurveTarget: 2.9,
    },
  },
  {
    id: 'mono_gold_celestial',
    domain: 'gold',
    name: 'Legião Celeste',
    subtitle: 'Mono-Dourado ☀️ • Escudo Divino, Voo & Ascensão',
    strategySummary:
      'Comanda serafins e arcontes de Voo protegidos por Escudo Divino que realizam trocas 2-por-1 e ascendem em campeões solares.',
    tacticalIdentity: 'tempo',
    targetAvgCost: 3.4,
    minEarlyDrops: 28,
    minCreatures: 58,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.16,
      flyingEvasionBias: 1.35,
      ascensionEagerness: 1.30,
      tradeValueBias: 1.18,
      mulliganCurveTarget: 3.0,
    },
  },
  {
    id: 'mono_gold_judgment',
    domain: 'gold',
    name: 'Julgamento Solar',
    subtitle: 'Mono-Dourado ⚖️ • Relíquias, Escudo Global & Cura',
    strategySummary:
      'Acumula Relíquias imperiais, restaura a vida do Soberano e concede Escudo Divino em massa antes do veredito final.',
    tacticalIdentity: 'control',
    targetAvgCost: 3.5,
    minEarlyDrops: 25,
    minCreatures: 50,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 0.90,
      tradeValueBias: 1.32,
      guardianPriority: 1.28,
      relicPriority: 1.38,
      spellHoldPatience: 1.22,
      mulliganCurveTarget: 3.1,
    },
  },

  // ======================== NEUTRAL (MATRIZ AXIAL) ========================
  {
    id: 'mono_neutral_axial',
    domain: 'neutral',
    name: 'Legião Axial Autômata',
    subtitle: 'Mono-Neutro ⚙️ • Constructos, Relíquias & Matriz',
    strategySummary:
      ' Opera sem restrição cromática com autômatos blindados, artilharia de Alcance e relíquias táticas de alta eficiência.',
    tacticalIdentity: 'midrange',
    targetAvgCost: 3.2,
    minEarlyDrops: 28,
    minCreatures: 58,
    seedWeights: {
      ...DEFAULT_AI_WEIGHTS,
      aggroFaceBias: 1.08,
      tradeValueBias: 1.20,
      relicPriority: 1.25,
      guardianPriority: 1.15,
      mulliganCurveTarget: 2.9,
    },
  },
];

// ============================================================================
// DETERMINISTIC PRNG
// ============================================================================
function createRng(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

// ============================================================================
// SEMANTIC CARD SCORER FOR ARCHETYPE CLUSTERING & INTRINSIC QUALITY
// ============================================================================
function computeIntrinsicCardQuality(card: CardDefinition): number {
  let q = 0;
  const cost = Math.max(1, card.cost);
  if (card.type === 'creature') {
    const statBudget =
      card.atk * 1.15 +
      card.hp * 1.0 +
      card.armor * 2.1 +
      (card.regeneration ?? 0) * 1.6 +
      (card.breathDamage ?? 0) * 1.8;
    q += (statBudget / (cost + 1.1)) * 3.2;
    q += card.keywords.length * 1.35;
    if (card.ascension) q += 1.4;
  } else if (card.type === 'relic') {
    q += 4.2 + card.hp * 0.35 + card.effects.length * 1.8;
  } else {
    q += 4.0 + card.effects.length * 1.9;
  }

  for (const eff of card.effects) {
    if (eff.type === 'draw_cards') q += eff.value * 1.6;
    else if (eff.type === 'destroy_enemy') q += 2.6;
    else if (eff.type === 'damage_all_units' || eff.type === 'damage_enemy_row') q += 2.1;
    else if (eff.type === 'revive_from_crypt' || eff.type === 'summon_token') q += 2.0;
    else if (eff.type === 'shield_all_allies' || eff.type === 'buff_all_allies') q += 2.1;
    else if (eff.type === 'break_domain_expansion') q += 2.8;
    else q += 1.2;
  }

  const rarityBonus: Record<Rarity, number> = {
    common: 0,
    uncommon: 0.9,
    rare: 2.1,
    legendary: 3.6,
  };
  q += rarityBonus[card.rarity];
  if ((card.corruptionCost ?? 0) >= 2) q -= 0.7;

  return q;
}

function computeArchetypeSynergyAffinity(
  card: CardDefinition,
  bp: ArchetypeBlueprint
): number {
  const kw = new Set(card.keywords);
  const effs = new Set(card.effects.map((e) => e.type));
  let s = 0;

  // Curve distance alignment
  s -= Math.abs(card.cost - bp.targetAvgCost) * 0.65;

  switch (bp.id) {
    case 'mono_green_swarm':
      if (card.type === 'creature' && card.cost <= 3) s += 4.2;
      if (effs.has('summon_token') || effs.has('buff_all_allies')) s += 6.5;
      if (kw.has('Ímpeto') || kw.has('Fúria Crescente')) s += 3.8;
      if (card.cost >= 6) s -= 3.5;
      break;
    case 'mono_green_colossus':
      if (effs.has('grant_bonus_essence')) s += 7.0;
      if (kw.has('Atropelar')) s += 5.5;
      if (card.type === 'creature' && card.cost >= 5) s += 4.2;
      if (effs.has('buff_target_ally')) s += 3.0;
      break;
    case 'mono_green_roots':
      if (kw.has('Guardião')) s += 6.2;
      if ((card.regeneration ?? 0) > 0 || card.armor >= 1) s += 4.5;
      if (effs.has('heal_sovereign') || effs.has('heal_all_allies') || effs.has('heal_target_ally'))
        s += 5.0;
      break;

    case 'mono_red_blitz':
      if (card.type === 'creature' && card.cost <= 3) s += 4.8;
      if (kw.has('Ímpeto')) s += 6.0;
      if (kw.has('Pele Incandescente') || kw.has('Fúria Crescente')) s += 4.5;
      if (effs.has('damage_enemy_sovereign') && card.cost <= 3) s += 4.0;
      if (card.cost >= 6) s -= 4.0;
      break;
    case 'mono_red_pyroclasm':
      if (card.type === 'spell' || card.type === 'reaction') s += 4.6;
      if (
        effs.has('damage_enemy_sovereign') ||
        effs.has('damage_enemy_row') ||
        effs.has('damage_all_units') ||
        effs.has('damage_single_enemy')
      ) {
        s += 5.8;
      }
      if (card.effects.some((e) => e.trigger === 'spell_cast')) s += 5.2;
      break;
    case 'mono_red_dragon':
      if (kw.has('Voo')) s += 6.0;
      if ((card.breathDamage ?? 0) > 0) s += 5.8;
      if (card.ascension) s += 4.5;
      if (effs.has('grant_bonus_essence') || card.type === 'relic') s += 2.5;
      break;

    case 'mono_blue_frost':
      if (effs.has('freeze_enemy') || effs.has('freeze_enemy_vanguard')) s += 7.5;
      if (effs.has('bounce_enemy') || effs.has('debuff_enemy_vanguard_atk')) s += 3.8;
      break;
    case 'mono_blue_chrono':
      if (effs.has('draw_cards')) s += 6.5;
      if (card.effects.some((e) => e.trigger === 'spell_cast')) s += 6.5;
      if (card.type === 'spell' || card.type === 'reaction' || card.type === 'relic') s += 3.5;
      break;
    case 'mono_blue_abyssal':
      if (kw.has('Voo') || kw.has('Alcance')) s += 6.2;
      if (card.type === 'creature' && card.cost >= 4) s += 3.5;
      break;

    case 'mono_purple_crypt':
      if (kw.has('Renascer') || effs.has('revive_from_crypt')) s += 7.2;
      if (card.effects.some((e) => e.trigger === 'on_death')) s += 5.8;
      if (effs.has('summon_token')) s += 3.5;
      break;
    case 'mono_purple_blood':
      if (kw.has('Dreno de Vida') || kw.has('Toque Letal')) s += 6.2;
      if ((card.corruptionCost ?? 0) > 0 || effs.has('damage_enemy_sovereign')) s += 4.2;
      if (card.type === 'creature' && card.cost <= 3) s += 3.2;
      break;
    case 'mono_purple_umbral':
      if (
        effs.has('destroy_enemy') ||
        effs.has('debuff_enemy_vanguard_atk') ||
        effs.has('damage_all_units') ||
        effs.has('steal_small_enemy')
      ) {
        s += 6.8;
      }
      if (card.type === 'spell' || card.type === 'reaction' || card.type === 'relic') s += 3.2;
      break;

    case 'mono_gold_phalanx':
      if (kw.has('Guardião')) s += 6.8;
      if (card.armor >= 2) s += 5.2;
      if (effs.has('buff_all_allies') || effs.has('buff_target_ally')) s += 3.5;
      break;
    case 'mono_gold_celestial':
      if (kw.has('Escudo Divino')) s += 6.2;
      if (kw.has('Voo') || card.ascension) s += 5.8;
      break;
    case 'mono_gold_judgment':
      if (card.type === 'relic') s += 6.5;
      if (effs.has('shield_all_allies') || effs.has('heal_sovereign') || effs.has('heal_all_allies'))
        s += 6.0;
      if (effs.has('destroy_enemy') || effs.has('damage_all_units')) s += 4.0;
      break;

    case 'mono_neutral_axial':
      if (kw.has('Alcance') || kw.has('Guardião') || card.armor >= 1) s += 3.5;
      if (card.type === 'relic' || effs.has('draw_cards')) s += 3.5;
      break;
  }

  return s;
}

/**
 * Validates that a 100-card list strictly obeys Chromatic Pact's pure monocolor & rarity rules.
 */
function assertValid100MonocolorDeck(
  cardIds: string[],
  expectedDomain: Domain,
  maxAllowedLegendaries = MAX_LEGENDARIES_PER_DECK,
  label = ''
): void {
  if (cardIds.length !== REQUIRED_DECK_SIZE) {
    throw new Error(`[${label}] Expected ${REQUIRED_DECK_SIZE} cards, got ${cardIds.length}`);
  }
  const counts = new Map<string, number>();
  let legCount = 0;
  for (const id of cardIds) {
    const c = CARDS_BY_ID[id];
    if (!c) throw new Error(`[${label}] Unknown card ID: ${id}`);
    if (c.domain !== expectedDomain) {
      throw new Error(`[${label}] Impure domain card ${id} (${c.domain} !== ${expectedDomain})`);
    }
    const next = (counts.get(id) ?? 0) + 1;
    if (next > MAX_COPIES_BY_RARITY[c.rarity]) {
      throw new Error(`[${label}] Copy cap exceeded for ${id} (${c.rarity}): ${next}`);
    }
    counts.set(id, next);
    if (c.rarity === 'legendary') legCount += 1;
  }
  if (legCount > maxAllowedLegendaries) {
    throw new Error(
      `[${label}] Legendary cap exceeded: ${legCount} > ${maxAllowedLegendaries}`
    );
  }
}

/**
 * Constructs a balanced, strictly valid 100-card pure monocolor seed deck for an archetype blueprint.
 */
function buildSeed100DeckForBlueprint(
  bp: ArchetypeBlueprint,
  domainPool: CardDefinition[],
  alreadyUsedLegendariesInColor: Set<string>
): string[] {
  const scored = domainPool
    .map((card) => {
      const intrinsic = computeIntrinsicCardQuality(card);
      const fit = computeArchetypeSynergyAffinity(card, bp);
      // Encourage distinct Legendary flagships across the 3 archetypes of the same color while allowing #173 General
      const isWheelGeneral = card.effects.some((e) => e.type === 'break_domain_expansion');
      const dupLegPenalty =
        card.rarity === 'legendary' && !isWheelGeneral && alreadyUsedLegendariesInColor.has(card.id)
          ? 3.2
          : 0;
      return {
        card,
        totalScore: intrinsic + fit - dupLegPenalty,
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore);

  const deck: string[] = [];
  const counts = new Map<string, number>();
  let legCount = 0;
  let earlyDropSlots = 0;
  let creatureSlots = 0;

  const addCopies = (card: CardDefinition, maxWanted: number) => {
    const cap = Math.min(MAX_COPIES_BY_RARITY[card.rarity], maxWanted);
    while ((counts.get(card.id) ?? 0) < cap && deck.length < REQUIRED_DECK_SIZE) {
      if (card.rarity === 'legendary' && legCount >= MAX_LEGENDARIES_PER_DECK) break;
      deck.push(card.id);
      counts.set(card.id, (counts.get(card.id) ?? 0) + 1);
      if (card.rarity === 'legendary') {
        legCount += 1;
        alreadyUsedLegendariesInColor.add(card.id);
      }
      if (card.cost <= 2 && (card.type === 'creature' || card.type === 'relic')) {
        earlyDropSlots += 1;
      }
      if (card.type === 'creature') creatureSlots += 1;
    }
  };

  // Pass 1: Guarantee early curve (1-2 cost creatures/relics)
  for (const item of scored) {
    if (earlyDropSlots >= bp.minEarlyDrops) break;
    if (item.card.cost <= 2 && (item.card.type === 'creature' || item.card.type === 'relic')) {
      addCopies(item.card, MAX_COPIES_BY_RARITY[item.card.rarity]);
    }
  }

  // Pass 2: Guarantee creature backbone
  for (const item of scored) {
    if (creatureSlots >= bp.minCreatures || deck.length >= 82) break;
    if (item.card.type === 'creature' && item.card.cost <= 6) {
      addCopies(item.card, MAX_COPIES_BY_RARITY[item.card.rarity]);
    }
  }

  // Pass 3: Fill remaining slots up to 100 by highest archetype score
  for (const item of scored) {
    if (deck.length >= REQUIRED_DECK_SIZE) break;
    addCopies(item.card, MAX_COPIES_BY_RARITY[item.card.rarity]);
  }

  assertValid100MonocolorDeck(deck, bp.domain, MAX_LEGENDARIES_PER_DECK, `seed:${bp.id}`);
  return deck;
}

// ============================================================================
// TELEMETRY & UCB1 / SHAPLEY DATA STRUCTURES
// ============================================================================
interface CardEvoTelemetry {
  drawnGames: number;
  playedGames: number;
  playedScoreSum: number;
  stuckInHandGames: number;
  keptMulliganGames: number;
  keptMulliganScoreSum: number;
  channeledEarlyGames: number;
  channeledEarlyScoreSum: number;
}

interface PairEvoTelemetry {
  cardA: string;
  cardB: string;
  coPlayGames: number;
  coPlayScoreSum: number;
}

interface ArchetypeEvoState {
  bp: ArchetypeBlueprint;
  domainPool: CardDefinition[];
  cardIds: string[];
  weights: AiDecisionWeights;
  profile: DeckLearnedAiProfile;
  cardStats: Map<string, CardEvoTelemetry>;
  pairStats: Map<string, PairEvoTelemetry>;
  ucbPulls: Map<string, number>;
  ucbRewardSum: Map<string, number>;
  totalGames: number;
  totalWinsScore: number;
  seedWinRate: number;
  latestWinRate: number;
}

function resolveDeckDefinitions(cardIds: string[]): CardDefinition[] {
  const arr = new Array<CardDefinition>(cardIds.length);
  for (let i = 0; i < cardIds.length; i++) {
    arr[i] = CARDS_BY_ID[cardIds[i]];
  }
  return arr;
}

function getOrCreateCardEvo(
  map: Map<string, CardEvoTelemetry>,
  cardId: string
): CardEvoTelemetry {
  let b = map.get(cardId);
  if (!b) {
    b = {
      drawnGames: 0,
      playedGames: 0,
      playedScoreSum: 0,
      stuckInHandGames: 0,
      keptMulliganGames: 0,
      keptMulliganScoreSum: 0,
      channeledEarlyGames: 0,
      channeledEarlyScoreSum: 0,
    };
    map.set(cardId, b);
  }
  return b;
}

interface InstrumentedMatchOutcome {
  scorePlayer: number; // [0..1]
  turns: number;
}

/**
 * Plays a full 100-card self-play match, recording per-card Shapley/brick telemetry,
 * pairwise co-play synergy, and TD(λ) state trajectories for the Value MLP trainer.
 */
function runInstrumentedCoEvoMatch(
  playerDeckCards: CardDefinition[],
  aiDeckCards: CardDefinition[],
  playerArch: ArchetypeEvoState | null,
  aiArch: ArchetypeEvoState | null,
  overrides: AiProfileOverrides,
  trajectorySinkByDomain?: Map<Domain, ValueTrainingSample[]>,
  maxTrajectoryCapPerDomain = 22000
): InstrumentedMatchOutcome {
  let state = createInitialGameState(playerDeckCards, aiDeckCards, {
    playerName: playerArch?.bp.name ?? 'Soberano A',
    aiName: aiArch?.bp.name ?? 'Soberano B',
    playerDeckId: playerArch?.bp.id,
    aiDeckId: aiArch?.bp.id,
    playerSkillTier: overrides.playerSkillTier ?? 3,
    aiSkillTier: overrides.aiSkillTier ?? 3,
  });

  // Mulligan tracking
  const pSwap = chooseMulliganIndicesForActor(
    state,
    'player',
    overrides.player,
    overrides.playerSkillTier
  );
  const pSwapSet = new Set(pSwap);
  const pKept = new Set<string>();
  state.player.hand.forEach((c, idx) => {
    if (!pSwapSet.has(idx)) pKept.add(c.id);
  });
  state = mulliganCards(state, 'player', pSwap);

  const aSwap = chooseMulliganIndicesForActor(
    state,
    'ai',
    overrides.ai,
    overrides.aiSkillTier
  );
  const aSwapSet = new Set(aSwap);
  const aKept = new Set<string>();
  state.ai.hand.forEach((c, idx) => {
    if (!aSwapSet.has(idx)) aKept.add(c.id);
  });
  state = mulliganCards(state, 'ai', aSwap);

  const pSeenInHand = new Set<string>(state.player.hand.map((c) => c.id));
  const aSeenInHand = new Set<string>(state.ai.hand.map((c) => c.id));
  const pPlayed = new Set<string>();
  const aPlayed = new Set<string>();
  const pEarlyChanneled = new Set<string>();
  const aEarlyChanneled = new Set<string>();

  const recordedSnaps: Array<{
    actor: 'player' | 'ai';
    domain: Domain;
    turn: number;
    features: Float64Array;
  }> = [];

  const maxTurns = 34;
  let guardSteps = 0;

  while (state.phase !== 'gameover' && state.turn <= maxTurns && guardSteps < 900) {
    guardSteps += 1;
    const active = state.activePlayer;

    for (const c of state.player.hand) pSeenInHand.add(c.id);
    for (const c of state.ai.hand) aSeenInHand.add(c.id);

    const prevHand = state[active].hand;
    const prevChanLen = state[active].channeledCards.length;
    const prevTurn = state.turn;

    // Sample trajectory state at the start of turns 2, 4, 6, 8, ... (before channel)
    if (
      trajectorySinkByDomain &&
      !state[active].hasChanneledThisTurn &&
      state.turn >= 2 &&
      state.turn % 2 === 0
    ) {
      const dom = active === 'player' ? playerArch?.bp.domain : aiArch?.bp.domain;
      if (dom) {
        const buf = trajectorySinkByDomain.get(dom);
        if (buf && buf.length < maxTrajectoryCapPerDomain) {
          recordedSnaps.push({
            actor: active,
            domain: dom,
            turn: state.turn,
            features: extractNormalizedStateFeatures(state, active),
          });
        }
      }
    }

    const step = executeTurnStepForActor(state, active, overrides);
    const next = step.nextState;

    if (next[active].channeledCards.length > prevChanLen && prevTurn <= 3) {
      const ch = next[active].channeledCards[next[active].channeledCards.length - 1];
      if (ch) {
        if (active === 'player') pEarlyChanneled.add(ch.id);
        else aEarlyChanneled.add(ch.id);
      }
    } else if (next[active].hand.length < prevHand.length) {
      const remCounts = new Map<string, number>();
      for (const c of next[active].hand) remCounts.set(c.id, (remCounts.get(c.id) ?? 0) + 1);
      for (const c of prevHand) {
        const cnt = remCounts.get(c.id) ?? 0;
        if (cnt > 0) {
          remCounts.set(c.id, cnt - 1);
        } else {
          if (active === 'player') pPlayed.add(c.id);
          else aPlayed.add(c.id);
          break;
        }
      }
    }

    state = next;
  }

  let scorePlayer = 0.5;
  if (state.phase === 'gameover' && state.winner === 'player') {
    scorePlayer = 1;
  } else if (state.phase === 'gameover' && state.winner === 'ai') {
    scorePlayer = 0;
  } else {
    const pBoard = getAllBoardUnits(state.player).reduce(
      (s, u) => s + u.currentAtk + u.currentHp,
      0
    );
    const aBoard = getAllBoardUnits(state.ai).reduce(
      (s, u) => s + u.currentAtk + u.currentHp,
      0
    );
    const adv = state.player.hp - state.ai.hp + (pBoard - aBoard) * 0.4;
    scorePlayer = clamp(0.5 + adv / 60, 0.15, 0.85);
  }
  const scoreAi = 1 - scorePlayer;

  // Commit state trajectories with discounted Monte-Carlo/TD return in [-1, +1]
  if (trajectorySinkByDomain && recordedSnaps.length > 0) {
    const finalTurn = Math.max(2, state.turn);
    const zPlayer = (scorePlayer - 0.5) * 2; // [-1, +1]
    for (const snap of recordedSnaps) {
      const zActor = snap.actor === 'player' ? zPlayer : -zPlayer;
      const dist = Math.max(0, finalTurn - snap.turn);
      const lambdaDiscount = Math.pow(0.94, dist);
      const target = clamp(zActor * lambdaDiscount, -1, 1);
      const importance = 0.65 + 0.35 * clamp(snap.turn / finalTurn, 0, 1);
      trajectorySinkByDomain.get(snap.domain)?.push({
        features: snap.features,
        target,
        weight: importance,
      });
    }
  }

  const recordForSide = (
    arch: ArchetypeEvoState | null,
    score: number,
    seen: Set<string>,
    played: Set<string>,
    kept: Set<string>,
    earlyChan: Set<string>,
    endHand: CardDefinition[]
  ) => {
    if (!arch) return;
    arch.totalGames += 1;
    arch.totalWinsScore += score;

    const stuckSet = new Set<string>();
    for (const c of endHand) {
      if (!played.has(c.id) && !earlyChan.has(c.id)) stuckSet.add(c.id);
    }

    for (const cid of seen) {
      const st = getOrCreateCardEvo(arch.cardStats, cid);
      st.drawnGames += 1;
      if (stuckSet.has(cid)) st.stuckInHandGames += 1;
    }
    for (const cid of kept) {
      const st = getOrCreateCardEvo(arch.cardStats, cid);
      st.keptMulliganGames += 1;
      st.keptMulliganScoreSum += score;
    }
    for (const cid of earlyChan) {
      const st = getOrCreateCardEvo(arch.cardStats, cid);
      st.channeledEarlyGames += 1;
      st.channeledEarlyScoreSum += score;
    }
    for (const cid of played) {
      const st = getOrCreateCardEvo(arch.cardStats, cid);
      st.playedGames += 1;
      st.playedScoreSum += score;
      arch.ucbPulls.set(cid, (arch.ucbPulls.get(cid) ?? 0) + 1);
      arch.ucbRewardSum.set(cid, (arch.ucbRewardSum.get(cid) ?? 0) + score);
    }

    const playedArr = Array.from(played).sort();
    for (let i = 0; i < playedArr.length; i++) {
      for (let j = i + 1; j < playedArr.length; j++) {
        const key = `${playedArr[i]}|${playedArr[j]}`;
        let p = arch.pairStats.get(key);
        if (!p) {
          p = { cardA: playedArr[i], cardB: playedArr[j], coPlayGames: 0, coPlayScoreSum: 0 };
          arch.pairStats.set(key, p);
        }
        p.coPlayGames += 1;
        p.coPlayScoreSum += score;
      }
    }
  };

  recordForSide(
    playerArch,
    scorePlayer,
    pSeenInHand,
    pPlayed,
    pKept,
    pEarlyChanneled,
    state.player.hand
  );
  recordForSide(aiArch, scoreAi, aSeenInHand, aPlayed, aKept, aEarlyChanneled, state.ai.hand);

  return { scorePlayer, turns: state.turn };
}

/**
 * Extracts Empirical Bayes Shapley rankings, Mulligan keeps, Channel priorities,
 * and Pairwise Lift combos from an archetype's accumulated telemetry.
 */
function synthesizeLearnedProfileAndShapley(arch: ArchetypeEvoState, gen: number): {
  profile: DeckLearnedAiProfile;
  shapleyRanking: CardShapleyMetric[];
} {
  const baseWr = arch.totalGames > 0 ? arch.totalWinsScore / arch.totalGames : 0.5;
  const kShrink = 10;

  // Compute max pairwise lift per card
  const bestPairLiftForCard = new Map<string, number>();
  const discoveredCombos: DiscoveredCardCombo[] = [];

  for (const pair of arch.pairStats.values()) {
    if (pair.coPlayGames < 6) continue;
    const pairWr = (pair.coPlayScoreSum + 4 * baseWr) / (pair.coPlayGames + 4);
    const stA = arch.cardStats.get(pair.cardA);
    const stB = arch.cardStats.get(pair.cardB);
    const wrA = stA ? (stA.playedScoreSum + kShrink * baseWr) / (stA.playedGames + kShrink) : baseWr;
    const wrB = stB ? (stB.playedScoreSum + kShrink * baseWr) / (stB.playedGames + kShrink) : baseWr;
    const lift = pairWr - Math.max(wrA, wrB);

    if (lift > (bestPairLiftForCard.get(pair.cardA) ?? -1)) {
      bestPairLiftForCard.set(pair.cardA, lift);
    }
    if (lift > (bestPairLiftForCard.get(pair.cardB) ?? -1)) {
      bestPairLiftForCard.set(pair.cardB, lift);
    }

    if (pair.coPlayGames >= 8 && lift >= 0.025) {
      const cA = CARDS_BY_ID[pair.cardA];
      const cB = CARDS_BY_ID[pair.cardB];
      if (cA && cB) {
        discoveredCombos.push({
          cardAId: pair.cardA,
          cardBId: pair.cardB,
          coPlayWinRate: Math.round(pairWr * 1000) / 1000,
          liftOverBaseline: Math.round((pairWr - baseWr) * 1000) / 1000,
          sampleCount: pair.coPlayGames,
          synergyNote: `${cA.name} + ${cB.name} (+${Math.round((pairWr - baseWr) * 100)}% WR em ${arch.bp.name})`,
        });
      }
    }
  }

  discoveredCombos.sort((a, b) => b.liftOverBaseline - a.liftOverBaseline);
  const topCombos = discoveredCombos.slice(0, 12);

  const shapleyRanking: CardShapleyMetric[] = [];
  const mulliganKeepCandidates: Array<{ id: string; score: number }> = [];
  const channelPrioCandidates: Array<{ id: string; score: number }> = [];
  const channelAvoidIds: string[] = [];
  const highImpactCardBoosts: Record<string, number> = {};

  const uniqueInDomain = arch.domainPool;
  for (const card of uniqueInDomain) {
    const st = arch.cardStats.get(card.id);
    const playedGames = st?.playedGames ?? 0;
    const playedWr =
      ( (st?.playedScoreSum ?? 0) + kShrink * baseWr ) / (playedGames + kShrink);
    const drawnGames = Math.max(1, st?.drawnGames ?? 0);
    const stuckRate = st && st.drawnGames >= 5 ? st.stuckInHandGames / drawnGames : 0.15;
    const pairLift = Math.max(0, bestPairLiftForCard.get(card.id) ?? 0);

    const shapley =
      (playedWr - baseWr) - 0.16 * (stuckRate - 0.15) + 0.35 * pairLift;

    if (playedGames >= 4) {
      shapleyRanking.push({
        cardId: card.id,
        cardName: card.name,
        shapleyValue: Math.round(shapley * 10000) / 10000,
        playedWinRate: Math.round(playedWr * 1000) / 1000,
        stuckInHandRate: Math.round(stuckRate * 1000) / 1000,
        samples: playedGames,
      });
    }

    if (playedGames >= 6 && shapley >= 0.03) {
      highImpactCardBoosts[card.id] = Math.round(clamp(shapley * 180, 4, 24) * 10) / 10;
      if (card.rarity === 'legendary' || shapley >= 0.055) {
        channelAvoidIds.push(card.id);
      }
    }

    if (st && st.keptMulliganGames >= 5 && card.cost <= 3) {
      const keptWr = (st.keptMulliganScoreSum + 6 * baseWr) / (st.keptMulliganGames + 6);
      if (keptWr >= baseWr + 0.015) {
        mulliganKeepCandidates.push({ id: card.id, score: keptWr });
      }
    }

    if (st && st.channeledEarlyGames >= 4 && card.rarity !== 'legendary') {
      const chanWr = (st.channeledEarlyScoreSum + 6 * baseWr) / (st.channeledEarlyGames + 6);
      if (chanWr >= baseWr) {
        channelPrioCandidates.push({ id: card.id, score: chanWr + stuckRate * 0.2 });
      }
    }
  }

  shapleyRanking.sort((a, b) => b.shapleyValue - a.shapleyValue);
  mulliganKeepCandidates.sort((a, b) => b.score - a.score);
  channelPrioCandidates.sort((a, b) => b.score - a.score);

  const profile: DeckLearnedAiProfile = {
    deckId: arch.bp.id,
    deckName: arch.bp.name,
    archetypeTag: arch.bp.tacticalIdentity,
    generationsTrained: gen,
    matchesSimulated: arch.totalGames,
    baselineWinRate: Math.round(arch.seedWinRate * 1000) / 1000,
    trainedWinRate: Math.round(arch.latestWinRate * 1000) / 1000,
    weights: { ...arch.weights },
    mulliganKeepIds: mulliganKeepCandidates.slice(0, 12).map((x) => x.id),
    channelPriorityIds: channelPrioCandidates.slice(0, 10).map((x) => x.id),
    channelAvoidIds: channelAvoidIds.slice(0, 12),
    highImpactCardBoosts,
    synergyPairs: topCombos.slice(0, 10).map((c) => [c.cardAId, c.cardBId]),
    discoveredCombos: topCombos,
  };

  return { profile, shapleyRanking };
}

/**
 * Mutates an archetype's 100-card deck via Shapley pruning + UCB1 Contextual Bandit exploration,
 * plus Gaussian tactical weight perturbation.
 */
function proposeChallengerDeckAndWeights(
  arch: ArchetypeEvoState,
  shapleyRanking: CardShapleyMetric[],
  rng: () => number
): { challengerCardIds: string[]; challengerWeights: AiDecisionWeights } {
  const currentIds = arch.cardIds.slice();
  const counts = new Map<string, number>();
  let legCount = 0;
  for (const id of currentIds) {
    counts.set(id, (counts.get(id) ?? 0) + 1);
    if (CARDS_BY_ID[id]?.rarity === 'legendary') legCount += 1;
  }

  const shapleyById = new Map<string, number>();
  for (const s of shapleyRanking) shapleyById.set(s.cardId, s.shapleyValue);

  // Rank currently included unique cards from weakest (lowest Shapley + archetype fit) to strongest
  const uniqueInDeck = Array.from(counts.keys());
  uniqueInDeck.sort((a, b) => {
    const ca = CARDS_BY_ID[a]!;
    const cb = CARDS_BY_ID[b]!;
    const sa = (shapleyById.get(a) ?? -0.01) + computeArchetypeSynergyAffinity(ca, arch.bp) * 0.008;
    const sb = (shapleyById.get(b) ?? -0.01) + computeArchetypeSynergyAffinity(cb, arch.bp) * 0.008;
    return sa - sb;
  });

  // Remove 3..4 slots from the bottom-performing cards
  const slotsToSwap = 3 + Math.floor(rng() * 2);
  let removed = 0;
  for (const weakId of uniqueInDeck) {
    if (removed >= slotsToSwap) break;
    const card = CARDS_BY_ID[weakId]!;
    // Don't strip #173 Anti-Domain Wheel General if already included
    if (card.effects.some((e) => e.type === 'break_domain_expansion')) continue;
    const idx = currentIds.indexOf(weakId);
    if (idx !== -1) {
      currentIds.splice(idx, 1);
      counts.set(weakId, (counts.get(weakId) ?? 1) - 1);
      if (card.rarity === 'legendary') legCount -= 1;
      removed += 1;
    }
  }

  // UCB1 Contextual Bandit selection from the 173-card pure domain pool
  const totalPulls = Math.max(10, arch.totalGames);
  const baseWr = arch.totalGames > 0 ? arch.totalWinsScore / arch.totalGames : 0.5;

  const ucbCandidates = arch.domainPool
    .map((card) => {
      const pulls = arch.ucbPulls.get(card.id) ?? 0;
      const rew = arch.ucbRewardSum.get(card.id) ?? 0;
      const empMean = (rew + 4 * baseWr) / (pulls + 4);
      const exploration = 0.14 * Math.sqrt(Math.log(totalPulls) / (pulls + 1));
      const prior =
        (computeIntrinsicCardQuality(card) + computeArchetypeSynergyAffinity(card, arch.bp)) *
        0.012;
      const noise = (rng() - 0.5) * 0.025;
      return {
        card,
        ucbScore: empMean + exploration + prior + noise,
      };
    })
    .sort((a, b) => b.ucbScore - a.ucbScore);

  for (const cand of ucbCandidates) {
    if (currentIds.length >= REQUIRED_DECK_SIZE) break;
    const c = cand.card;
    const curCopies = counts.get(c.id) ?? 0;
    if (curCopies >= MAX_COPIES_BY_RARITY[c.rarity]) continue;
    if (c.rarity === 'legendary' && legCount >= MAX_LEGENDARIES_PER_DECK) continue;

    currentIds.push(c.id);
    counts.set(c.id, curCopies + 1);
    if (c.rarity === 'legendary') legCount += 1;
  }

  // Pad if needed
  for (const c of arch.domainPool) {
    if (currentIds.length >= REQUIRED_DECK_SIZE) break;
    const curCopies = counts.get(c.id) ?? 0;
    if (curCopies >= MAX_COPIES_BY_RARITY[c.rarity]) continue;
    if (c.rarity === 'legendary' && legCount >= MAX_LEGENDARIES_PER_DECK) continue;
    currentIds.push(c.id);
    counts.set(c.id, curCopies + 1);
    if (c.rarity === 'legendary') legCount += 1;
  }

  assertValid100MonocolorDeck(
    currentIds,
    arch.bp.domain,
    MAX_LEGENDARIES_PER_DECK,
    `challenger:${arch.bp.id}`
  );

  // Perturb 4 weights slightly
  const wNext: AiDecisionWeights = { ...arch.weights };
  const keys: Array<keyof AiDecisionWeights> = [
    'aggroFaceBias',
    'tradeValueBias',
    'guardianPriority',
    'flyingEvasionBias',
    'spellHoldPatience',
    'relicPriority',
    'ascensionEagerness',
    'domainExpansionEagerness',
    'sovPowerTempoBias',
    'synergyHoldBonus',
    'mulliganCurveTarget',
  ];
  for (let m = 0; m < 4; m++) {
    const k = keys[Math.floor(rng() * keys.length)];
    const delta = (rng() - 0.5) * 0.16;
    if (k === 'synergyHoldBonus') {
      wNext[k] = Math.round(clamp(wNext[k] + delta * 35, 6, 36));
    } else if (k === 'mulliganCurveTarget') {
      wNext[k] = Math.round(clamp(wNext[k] + delta * 2.5, 2.2, 3.8) * 10) / 10;
    } else {
      wNext[k] = Math.round(clamp(wNext[k] + delta, 0.65, 1.55) * 100) / 100;
    }
  }

  return { challengerCardIds: currentIds, challengerWeights: wNext };
}

/**
 * Distills graduated Tier I..V 100-card pure monocolor decks from the Champion Tier V list
 * and the domain's Shapley + Intrinsic rankings.
 */
function distillGraduatedTierDecksForArchetype(
  arch: ArchetypeEvoState,
  shapleyRanking: CardShapleyMetric[]
): Record<AiSkillTier, TierDeckMetadata> {
  const shapleyMap = new Map<string, number>();
  for (const s of shapleyRanking) shapleyMap.set(s.cardId, s.shapleyValue);

  const tierSpecs: Record<
    AiSkillTier,
    { label: string; maxLeg: number; maxRare: number; dropTopSynergyCount: number }
  > = {
    1: {
      label: 'Tier I • Patrulha de Fronteira',
      maxLeg: 0,
      maxRare: 4,
      dropTopSynergyCount: 16,
    },
    2: {
      label: 'Tier II • Guarnição Regular',
      maxLeg: 1,
      maxRare: 9,
      dropTopSynergyCount: 11,
    },
    3: {
      label: 'Tier III • Bastião Veterano',
      maxLeg: 4,
      maxRare: 18,
      dropTopSynergyCount: 6,
    },
    4: {
      label: 'Tier IV • Elite do Alto Trono',
      maxLeg: 6,
      maxRare: 26,
      dropTopSynergyCount: 3,
    },
    5: {
      label: 'Tier V • Campeão Soberano Ápice',
      maxLeg: 10,
      maxRare: 99,
      dropTopSynergyCount: 0,
    },
  };

  const computeMeta = (tier: AiSkillTier, ids: string[]): TierDeckMetadata => {
    let leg = 0;
    let rare = 0;
    let unc = 0;
    let com = 0;
    let costSum = 0;
    for (const id of ids) {
      const c = CARDS_BY_ID[id]!;
      costSum += c.cost;
      if (c.rarity === 'legendary') leg += 1;
      else if (c.rarity === 'rare') rare += 1;
      else if (c.rarity === 'uncommon') unc += 1;
      else com += 1;
    }
    return {
      tier,
      tierLabel: tierSpecs[tier].label,
      cardIds: ids,
      legendaryCount: leg,
      rareCount: rare,
      uncommonCount: unc,
      commonCount: com,
      avgCost: Math.round((costSum / ids.length) * 100) / 100,
      benchmarkWinRateVsLadder: 0,
    };
  };

  // Tier 5 is the exact co-evolved Champion 100-card deck!
  const out: Partial<Record<AiSkillTier, TierDeckMetadata>> = {
    5: computeMeta(5, arch.cardIds.slice()),
  };

  // Identify top synergy combo cards so Tier 1 & Tier 2 don't assemble oppressive Tier 5 combos
  const comboPowerSet = new Set<string>();
  for (const combo of arch.profile.discoveredCombos.slice(0, 8)) {
    comboPowerSet.add(combo.cardAId);
    comboPowerSet.add(combo.cardBId);
  }
  const topShapleyIds = shapleyRanking.map((s) => s.cardId);

  for (const tier of [4, 3, 2, 1] as AiSkillTier[]) {
    const spec = tierSpecs[tier];
    const excludedIds = new Set<string>();

    // Never give #173 Wheel Anti-Domain General to Tiers 1..3
    if (tier <= 3) {
      for (const c of arch.domainPool) {
        if (c.effects.some((e) => e.type === 'break_domain_expansion')) {
          excludedIds.add(c.id);
        }
      }
    }

    // Drop top non-legendary synergy powerhouses in Tier 1 & Tier 2
    let dropped = 0;
    for (const sid of topShapleyIds) {
      if (dropped >= spec.dropTopSynergyCount) break;
      const c = CARDS_BY_ID[sid];
      if (!c) continue;
      if (c.rarity === 'legendary' || comboPowerSet.has(sid) || dropped < spec.dropTopSynergyCount) {
        excludedIds.add(sid);
        dropped += 1;
      }
    }

    // Start from Champion list filtered by rarity caps & exclusions
    const deck: string[] = [];
    const counts = new Map<string, number>();
    let legCount = 0;
    let rareCount = 0;

    for (const cid of arch.cardIds) {
      if (excludedIds.has(cid)) continue;
      const c = CARDS_BY_ID[cid]!;
      if (c.rarity === 'legendary' && legCount >= spec.maxLeg) continue;
      if (c.rarity === 'rare' && rareCount >= spec.maxRare) continue;
      deck.push(cid);
      counts.set(cid, (counts.get(cid) ?? 0) + 1);
      if (c.rarity === 'legendary') legCount += 1;
      if (c.rarity === 'rare') rareCount += 1;
    }

    // Fill remaining slots up to 100 with domain Commons & Uncommons (and Rares up to cap)
    // Tier 1 favors straightforward vanilla/simple curve cards; Tier 3-4 favor best remaining archetype cards
    const fillCandidates = arch.domainPool
      .filter((c) => !excludedIds.has(c.id))
      .sort((a, b) => {
        if (tier === 1) {
          // Tier 1 prefers Common/Uncommon curve fillers with moderate power
          const ra = a.rarity === 'common' ? 3 : a.rarity === 'uncommon' ? 2.5 : 0.5;
          const rb = b.rarity === 'common' ? 3 : b.rarity === 'uncommon' ? 2.5 : 0.5;
          const curveA = -Math.abs(a.cost - 3.2) * 0.4;
          const curveB = -Math.abs(b.cost - 3.2) * 0.4;
          return rb + curveB - (ra + curveA);
        }
        const sa =
          computeArchetypeSynergyAffinity(a, arch.bp) +
          computeIntrinsicCardQuality(a) * (tier >= 3 ? 0.8 : 0.35) +
          (shapleyMap.get(a.id) ?? 0) * 15;
        const sb =
          computeArchetypeSynergyAffinity(b, arch.bp) +
          computeIntrinsicCardQuality(b) * (tier >= 3 ? 0.8 : 0.35) +
          (shapleyMap.get(b.id) ?? 0) * 15;
        return sb - sa;
      });

    const addUpTo = (allowExcludedFallback: boolean) => {
      const source = allowExcludedFallback ? arch.domainPool : fillCandidates;
      for (const c of source) {
        if (deck.length >= REQUIRED_DECK_SIZE) break;
        if (c.rarity === 'legendary' && legCount >= spec.maxLeg) continue;
        if (c.rarity === 'rare' && rareCount >= spec.maxRare) continue;
        const cap = MAX_COPIES_BY_RARITY[c.rarity];
        while ((counts.get(c.id) ?? 0) < cap && deck.length < REQUIRED_DECK_SIZE) {
          if (c.rarity === 'legendary' && legCount >= spec.maxLeg) break;
          if (c.rarity === 'rare' && rareCount >= spec.maxRare) break;
          deck.push(c.id);
          counts.set(c.id, (counts.get(c.id) ?? 0) + 1);
          if (c.rarity === 'legendary') legCount += 1;
          if (c.rarity === 'rare') rareCount += 1;
        }
      }
    };

    addUpTo(false);
    if (deck.length < REQUIRED_DECK_SIZE) {
      addUpTo(true);
    }

    assertValid100MonocolorDeck(deck, arch.bp.domain, spec.maxLeg, `tier${tier}:${arch.bp.id}`);
    out[tier] = computeMeta(tier, deck);
  }

  return out as Record<AiSkillTier, TierDeckMetadata>;
}

// ============================================================================
// MAIN CO-EVOLUTION + NEURAL VALUE MLP + TIER LADDER TRAINING PIPELINE
// ============================================================================
async function main() {
  const tStart = Date.now();
  const rng = createRng(20261031);
  console.log('========================================================================');
  console.log(' CHROMATIC PACT — CO-EVOLUÇÃO MONOCOLOR + VALUE MLP + ESCADA TIER I..V');
  console.log('========================================================================');

  // 1. Seed all 16 Pure Monocolor Archetypes (100 cards each)
  const poolByDomain = new Map<Domain, CardDefinition[]>();
  for (const dom of ['green', 'red', 'blue', 'purple', 'gold', 'neutral'] as Domain[]) {
    const cards = ALL_CARDS.filter((c) => c.domain === dom);
    poolByDomain.set(dom, cards);
    console.log(`[Pool] ${dom.toUpperCase().padEnd(7)} -> ${cards.length} cartas exclusivas elegíveis.`);
  }

  const usedLegsByDomain = new Map<Domain, Set<string>>();
  const archetypes: ArchetypeEvoState[] = [];

  for (const bp of ARCHETYPE_BLUEPRINTS) {
    if (!usedLegsByDomain.has(bp.domain)) usedLegsByDomain.set(bp.domain, new Set());
    const domPool = poolByDomain.get(bp.domain)!;
    const seedIds = buildSeed100DeckForBlueprint(bp, domPool, usedLegsByDomain.get(bp.domain)!);

    const initProfile: DeckLearnedAiProfile = {
      deckId: bp.id,
      deckName: bp.name,
      archetypeTag: bp.tacticalIdentity,
      generationsTrained: 0,
      matchesSimulated: 0,
      baselineWinRate: 0.5,
      trainedWinRate: 0.5,
      weights: { ...bp.seedWeights },
      mulliganKeepIds: [],
      channelPriorityIds: [],
      channelAvoidIds: [],
      highImpactCardBoosts: {},
      synergyPairs: [],
      discoveredCombos: [],
    };

    archetypes.push({
      bp,
      domainPool: domPool,
      cardIds: seedIds,
      weights: { ...bp.seedWeights },
      profile: initProfile,
      cardStats: new Map(),
      pairStats: new Map(),
      ucbPulls: new Map(),
      ucbRewardSum: new Map(),
      totalGames: 0,
      totalWinsScore: 0,
      seedWinRate: 0.5,
      latestWinRate: 0.5,
    });
  }

  console.log(`\n[Etapa 1] ${archetypes.length} arquétipos monocolor puros de 100 cartas inicializados.`);

  const trajectoriesByDomain = new Map<Domain, ValueTrainingSample[]>();
  for (const dom of ['green', 'red', 'blue', 'purple', 'gold', 'neutral'] as Domain[]) {
    trajectoriesByDomain.set(dom, []);
  }

  const trainedMlps = new Map<Domain, SerializedValueMlp>();
  let totalMatchesSimulated = 0;

  // Helper: pick sparring partners for an archetype (2 intra-color siblings + 5 cross-color rivals)
  const getSparringPartners = (arch: ArchetypeEvoState): ArchetypeEvoState[] => {
    const sameColor = archetypes.filter(
      (a) => a.bp.domain === arch.bp.domain && a.bp.id !== arch.bp.id
    );
    const crossColor: ArchetypeEvoState[] = [];
    for (const dom of ['green', 'red', 'blue', 'purple', 'gold', 'neutral'] as Domain[]) {
      if (dom === arch.bp.domain) continue;
      const candidates = archetypes.filter((a) => a.bp.domain === dom);
      if (candidates.length > 0) {
        crossColor.push(candidates[Math.floor(rng() * candidates.length)]);
      }
    }
    return [...sameColor, ...crossColor];
  };

  // 2. Multi-Generation Shapley-UCB Co-Evolution + Mid-Training Neural Value MLP Refresh
  const NUM_GENERATIONS = 8;
  for (let gen = 1; gen <= NUM_GENERATIONS; gen++) {
    const genStart = Date.now();
    // Refresh Domain Value MLPs after Gen 3 and Gen 6 so co-evolution tracks neural improvements!
    if (gen === 4 || gen === 7) {
      console.log('\n[Motor Neural Intermédio] Treinando 1ª onda das Value MLPs (48->64->32->1) via Adam...');
      for (const [dom, samples] of trajectoriesByDomain.entries()) {
        if (samples.length >= 200) {
          const mlp = trainValueMlpWithAdam(dom, samples, {
            epochs: 14,
            batchSize: 64,
            learningRate: 0.0028,
            seed: 1000 + dom.length,
          });
          trainedMlps.set(dom, mlp);
          console.log(
            `   • MLP [${dom.toUpperCase().padEnd(7)}]: ${samples.length} estados | MSE ${mlp.initialMse.toFixed(4)} -> ${mlp.finalMse.toFixed(4)} | SignAcc ${(mlp.signAccuracy * 100).toFixed(1)}%`
          );
        }
      }
    }

    let promotedInGen = 0;
    for (const arch of archetypes) {
      const partners = getSparringPartners(arch);
      const myCards = resolveDeckDefinitions(arch.cardIds);
      let genScoreSum = 0;
      let genGames = 0;

      // Telemetry league round (both seats vs each sparring partner)
      for (const opp of partners) {
        const oppCards = resolveDeckDefinitions(opp.cardIds);
        for (let rep = 0; rep < 2; rep++) {
          const m1 = runInstrumentedCoEvoMatch(
            myCards,
            oppCards,
            arch,
            opp,
            {
              player: arch.profile,
              ai: opp.profile,
              playerSkillTier: 3,
              aiSkillTier: 3,
              playerValueMlp: trainedMlps.get(arch.bp.domain) ?? null,
              aiValueMlp: trainedMlps.get(opp.bp.domain) ?? null,
              fastRollout: true,
            },
            trajectoriesByDomain
          );
          const m2 = runInstrumentedCoEvoMatch(
            oppCards,
            myCards,
            opp,
            arch,
            {
              player: opp.profile,
              ai: arch.profile,
              playerSkillTier: 3,
              aiSkillTier: 3,
              playerValueMlp: trainedMlps.get(opp.bp.domain) ?? null,
              aiValueMlp: trainedMlps.get(arch.bp.domain) ?? null,
              fastRollout: true,
            },
            trajectoriesByDomain
          );
          genScoreSum += m1.scorePlayer + (1 - m2.scorePlayer);
          genGames += 2;
          totalMatchesSimulated += 2;
        }
      }

      const genWr = genScoreSum / Math.max(1, genGames);
      if (gen === 1) arch.seedWinRate = genWr;
      arch.latestWinRate = genWr;

      // Synthesize updated Shapley + Combos
      const { profile: updatedProfile, shapleyRanking } = synthesizeLearnedProfileAndShapley(
        arch,
        gen
      );
      arch.profile = updatedProfile;

      // Propose Shapley-UCB Challenger (swap 3-4 low-Shapley/brick cards + perturb weights)
      const { challengerCardIds, challengerWeights } = proposeChallengerDeckAndWeights(
        arch,
        shapleyRanking,
        rng
      );
      const challengerProfile: DeckLearnedAiProfile = {
        ...arch.profile,
        weights: challengerWeights,
      };
      const challCards = resolveDeckDefinitions(challengerCardIds);
      const incCards = resolveDeckDefinitions(arch.cardIds);

      // Direct Head-to-Head + Gauntlet verification (Challenger vs Incumbent)
      let challScore = 0;
      let incScore = 0;
      let evalMatches = 0;

      // 6 direct mirror duels (3 seat pairs) between Challenger and Incumbent!
      for (let d = 0; d < 3; d++) {
        const d1 = runInstrumentedCoEvoMatch(
          challCards,
          incCards,
          null,
          null,
          {
            player: challengerProfile,
            ai: arch.profile,
            playerSkillTier: 3,
            aiSkillTier: 3,
            playerValueMlp: trainedMlps.get(arch.bp.domain) ?? null,
            aiValueMlp: trainedMlps.get(arch.bp.domain) ?? null,
            fastRollout: true,
          },
          trajectoriesByDomain
        );
        const d2 = runInstrumentedCoEvoMatch(
          incCards,
          challCards,
          null,
          null,
          {
            player: arch.profile,
            ai: challengerProfile,
            playerSkillTier: 3,
            aiSkillTier: 3,
            playerValueMlp: trainedMlps.get(arch.bp.domain) ?? null,
            aiValueMlp: trainedMlps.get(arch.bp.domain) ?? null,
            fastRollout: true,
          },
          trajectoriesByDomain
        );
        challScore += d1.scorePlayer + (1 - d2.scorePlayer);
        incScore += 1 - d1.scorePlayer + d2.scorePlayer;
        evalMatches += 2;
        totalMatchesSimulated += 2;
      }

      // Plus 4 cross-archetype gauntlet duels
      const gauntPartners = partners.slice(0, 4);
      for (const gp of gauntPartners) {
        const gpCards = resolveDeckDefinitions(gp.cardIds);
        const cRes = runInstrumentedCoEvoMatch(challCards, gpCards, arch, gp, {
          player: challengerProfile,
          ai: gp.profile,
          playerSkillTier: 3,
          aiSkillTier: 3,
          fastRollout: true,
        });
        const iRes = runInstrumentedCoEvoMatch(incCards, gpCards, arch, gp, {
          player: arch.profile,
          ai: gp.profile,
          playerSkillTier: 3,
          aiSkillTier: 3,
          fastRollout: true,
        });
        challScore += cRes.scorePlayer;
        incScore += iRes.scorePlayer;
        evalMatches += 1;
        totalMatchesSimulated += 2;
      }

      if (challScore / evalMatches >= incScore / evalMatches + 0.015) {
        arch.cardIds = challengerCardIds;
        arch.weights = challengerWeights;
        arch.latestWinRate = Math.max(arch.latestWinRate, challScore / evalMatches);
        promotedInGen += 1;
      }
    }

    const genSec = ((Date.now() - genStart) / 1000).toFixed(1);
    console.log(
      `[Geração ${gen}/${NUM_GENERATIONS}] Concluída em ${genSec}s | ${promotedInGen}/${archetypes.length} grimórios evoluídos | Total: ${totalMatchesSimulated} duelos.`
    );
  }

  // 3. Final Deep Training of all 6 Domain Value MLPs (48 -> 64 -> 32 -> 1)
  console.log('\n[Etapa 3] Treinamento Final das 6 Redes Neurais Value MLP (Adam + L2 Decay)...');
  let totalTrajectories = 0;
  const domainNetworksOut: Record<string, SerializedValueMlp> = {};

  for (const dom of ['green', 'red', 'blue', 'purple', 'gold', 'neutral'] as Domain[]) {
    const samples = trajectoriesByDomain.get(dom) ?? [];
    totalTrajectories += samples.length;
    const mlp = trainValueMlpWithAdam(dom, samples, {
      epochs: 26,
      batchSize: 64,
      learningRate: 0.0026,
      weightDecay: 0.00015,
      seed: 202600 + dom.charCodeAt(0),
    });
    trainedMlps.set(dom, mlp);
    domainNetworksOut[dom] = mlp;
    console.log(
      `   ✓ Rede Neural [${dom.toUpperCase().padEnd(7)}]: ${samples.length} trajetórias | MSE ${mlp.initialMse.toFixed(4)} -> ${mlp.finalMse.toFixed(4)} | Acurácia de Sinal: ${(mlp.signAccuracy * 100).toFixed(1)}%`
    );
  }

  // 4. Synthesize Final Profiles & Distill Tier I..V 100-Card Decks for all 16 Archetypes
  console.log('\n[Etapa 4] Destilando Grimórios Graduados (Tiers I, II, III, IV e V) para os 16 Arquétipos...');
  const masteryById: Record<string, MonocolorArchetypeMastery> = {};

  for (const arch of archetypes) {
    const { profile, shapleyRanking } = synthesizeLearnedProfileAndShapley(arch, NUM_GENERATIONS);
    arch.profile = profile;
    const tierDecks = distillGraduatedTierDecksForArchetype(arch, shapleyRanking);

    // Choose iconic Legendary cover card from Champion deck
    const coverCardId =
      arch.cardIds.find((id) => CARDS_BY_ID[id]?.rarity === 'legendary') ?? arch.cardIds[0];

    masteryById[arch.bp.id] = {
      archetypeId: arch.bp.id,
      domain: arch.bp.domain,
      name: arch.bp.name,
      subtitle: arch.bp.subtitle,
      strategySummary: arch.bp.strategySummary,
      tacticalIdentity: arch.bp.tacticalIdentity,
      coverCardId,
      generationsEvolved: NUM_GENERATIONS,
      matchesSimulated: arch.totalGames,
      seedWinRate: Math.round(arch.seedWinRate * 1000) / 1000,
      championWinRate: Math.round(arch.latestWinRate * 1000) / 1000,
      learnedProfile: profile,
      topShapleyCards: shapleyRanking.slice(0, 18),
      tierDecks,
    };
  }

  // 5. Empirical 5-Tier Ladder Verification Gauntlet (Deck Tier I..V + AI Cognition Tier I..V)
  console.log(
    '\n[Etapa 5] Executando Benchmark Empírico da Escada de Soberanos (Tier I -> Tier V com Beam Search & Anti-Letal)...'
  );
  const ladderByDomain: Partial<Record<Domain, DomainTierLadderBenchmark>> = {};
  const MATCHES_PER_CELL = 30; // 15 balanced mirror-seat pairs across all 3 archetypes of the domain

  for (const dom of ['green', 'red', 'blue', 'purple', 'gold', 'neutral'] as Domain[]) {
    const domArchetypes = archetypes.filter((a) => a.bp.domain === dom);
    const tierWins: Record<AiSkillTier, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const tierGames: Record<AiSkillTier, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const pairScoreHigherTier = new Map<string, { wins: number; games: number }>();

    const tiers: AiSkillTier[] = [1, 2, 3, 4, 5];
    for (let i = 0; i < tiers.length; i++) {
      for (let j = i + 1; j < tiers.length; j++) {
        const lowT = tiers[i];
        const highT = tiers[j];
        const key = `${highT}v${lowT}`;
        let highWins = 0;
        let games = 0;

        for (let pairIdx = 0; pairIdx < MATCHES_PER_CELL / 2; pairIdx++) {
          const archHigh = domArchetypes[pairIdx % domArchetypes.length];
          const archLow = archHigh;
          const mHigh = masteryById[archHigh.bp.id];
          const mLow = masteryById[archLow.bp.id];

          const highCards = resolveDeckDefinitions(mHigh.tierDecks[highT].cardIds);
          const lowCards = resolveDeckDefinitions(mLow.tierDecks[lowT].cardIds);
          const domMlp = trainedMlps.get(dom) ?? null;

          // Seat 1: High Tier starts first (NO fastRollout -> real Beam Search & Anti-Lethal active!)
          const g1 = runInstrumentedCoEvoMatch(highCards, lowCards, null, null, {
            player: highT >= 3 ? mHigh.learnedProfile : undefined,
            ai: lowT >= 3 ? mLow.learnedProfile : undefined,
            playerSkillTier: highT,
            aiSkillTier: lowT,
            playerValueMlp: domMlp,
            aiValueMlp: domMlp,
            fastRollout: false,
          });
          // Seat 2: Low Tier starts first
          const g2 = runInstrumentedCoEvoMatch(lowCards, highCards, null, null, {
            player: lowT >= 3 ? mLow.learnedProfile : undefined,
            ai: highT >= 3 ? mHigh.learnedProfile : undefined,
            playerSkillTier: lowT,
            aiSkillTier: highT,
            playerValueMlp: domMlp,
            aiValueMlp: domMlp,
            fastRollout: false,
          });

          const highPts = g1.scorePlayer + (1 - g2.scorePlayer);
          const lowPts = 1 - g1.scorePlayer + g2.scorePlayer;

          highWins += highPts;
          games += 2;
          totalMatchesSimulated += 2;

          tierWins[highT] += highPts;
          tierGames[highT] += 2;
          tierWins[lowT] += lowPts;
          tierGames[lowT] += 2;
        }

        pairScoreHigherTier.set(key, { wins: highWins, games });
      }
    }

    const r3 = (v: number) => Math.round(v * 1000) / 1000;
    const tierOverallWinRates: Record<AiSkillTier, number> = {
      1: r3(tierWins[1] / Math.max(1, tierGames[1])),
      2: r3(tierWins[2] / Math.max(1, tierGames[2])),
      3: r3(tierWins[3] / Math.max(1, tierGames[3])),
      4: r3(tierWins[4] / Math.max(1, tierGames[4])),
      5: r3(tierWins[5] / Math.max(1, tierGames[5])),
    };

    // Store overall ladder WR back into each archetype's tierDecks metadata
    for (const da of domArchetypes) {
      const m = masteryById[da.bp.id];
      for (const t of tiers) {
        m.tierDecks[t].benchmarkWinRateVsLadder = tierOverallWinRates[t];
      }
    }

    const getAdj = (k: string) => {
      const rec = pairScoreHigherTier.get(k);
      return rec && rec.games > 0 ? r3(rec.wins / rec.games) : 0.5;
    };

    ladderByDomain[dom] = {
      domain: dom,
      matchesPerCell: MATCHES_PER_CELL,
      tierOverallWinRates,
      adjacentDominanceWinRates: {
        tier2VsTier1: getAdj('2v1'),
        tier3VsTier2: getAdj('3v2'),
        tier4VsTier3: getAdj('4v3'),
        tier5VsTier4: getAdj('5v4'),
        tier5VsTier1: getAdj('5v1'),
      },
    };

    console.log(
      `   [${dom.toUpperCase().padEnd(7)}] Escada WR Geral: T1=${(tierOverallWinRates[1] * 100).toFixed(1)}% < T2=${(tierOverallWinRates[2] * 100).toFixed(1)}% < T3=${(tierOverallWinRates[3] * 100).toFixed(1)}% < T4=${(tierOverallWinRates[4] * 100).toFixed(1)}% < T5=${(tierOverallWinRates[5] * 100).toFixed(1)}% | T5 vs T1: ${(getAdj('5v1') * 100).toFixed(1)}%`
    );
  }

  const elapsedSeconds = Math.round(((Date.now() - tStart) / 1000) * 10) / 10;
  const summary: MonocolorTrainingSummary = {
    generatedAt: new Date().toISOString(),
    totalMatchesSimulated,
    totalStateTrajectoriesTrained: totalTrajectories,
    elapsedSeconds,
    archetypesCount: archetypes.length,
    ladderByDomain,
  };

  // 6. Write generated TypeScript data module `src/data/aiMonocolorMasteryData.ts`
  const targetPath = path.resolve(__dirname, '../data/aiMonocolorMasteryData.ts');
  const fileContent = `import { AiSkillTier, Domain } from '../types/game';
import type { DeckLearnedAiProfile } from './aiLearnedProfiles';
import type { SerializedValueMlp } from '../engine/aiValueNetwork';

/**
 * GERADO AUTOMATICAMENTE POR src/scripts/trainMonocolorEvolution.ts (npm run train:mono)
 * Partidas Simuladas: ${totalMatchesSimulated.toLocaleString('en-US')} | Estados Treinados nas Value MLPs: ${totalTrajectories.toLocaleString('en-US')} (${elapsedSeconds}s)
 */

export type MonocolorArchetypeId =
  | 'mono_green_swarm'
  | 'mono_green_colossus'
  | 'mono_green_roots'
  | 'mono_red_blitz'
  | 'mono_red_pyroclasm'
  | 'mono_red_dragon'
  | 'mono_blue_frost'
  | 'mono_blue_chrono'
  | 'mono_blue_abyssal'
  | 'mono_purple_crypt'
  | 'mono_purple_blood'
  | 'mono_purple_umbral'
  | 'mono_gold_phalanx'
  | 'mono_gold_celestial'
  | 'mono_gold_judgment'
  | 'mono_neutral_axial';

export interface CardShapleyMetric {
  cardId: string;
  cardName: string;
  shapleyValue: number;
  playedWinRate: number;
  stuckInHandRate: number;
  samples: number;
}

export interface TierDeckMetadata {
  tier: AiSkillTier;
  tierLabel: string;
  cardIds: string[];
  legendaryCount: number;
  rareCount: number;
  uncommonCount: number;
  commonCount: number;
  avgCost: number;
  benchmarkWinRateVsLadder: number;
}

export interface MonocolorArchetypeMastery {
  archetypeId: MonocolorArchetypeId;
  domain: Domain;
  name: string;
  subtitle: string;
  strategySummary: string;
  tacticalIdentity: 'aggro' | 'midrange' | 'control' | 'ramp' | 'tempo' | 'attrition';
  coverCardId: string;
  generationsEvolved: number;
  matchesSimulated: number;
  seedWinRate: number;
  championWinRate: number;
  learnedProfile: DeckLearnedAiProfile;
  topShapleyCards: CardShapleyMetric[];
  tierDecks: Record<AiSkillTier, TierDeckMetadata>;
}

export interface DomainTierLadderBenchmark {
  domain: Domain;
  matchesPerCell: number;
  tierOverallWinRates: Record<AiSkillTier, number>;
  adjacentDominanceWinRates: {
    tier2VsTier1: number;
    tier3VsTier2: number;
    tier4VsTier3: number;
    tier5VsTier4: number;
    tier5VsTier1: number;
  };
}

export interface MonocolorTrainingSummary {
  generatedAt: string;
  totalMatchesSimulated: number;
  totalStateTrajectoriesTrained: number;
  elapsedSeconds: number;
  archetypesCount: number;
  ladderByDomain: Partial<Record<Domain, DomainTierLadderBenchmark>>;
}

export const MONOCOLOR_TRAINING_SUMMARY: MonocolorTrainingSummary = ${JSON.stringify(summary, null, 2)};

export const DOMAIN_VALUE_NETWORKS: Partial<Record<Domain, SerializedValueMlp>> = ${JSON.stringify(domainNetworksOut)};

export const MONOCOLOR_ARCHETYPE_MASTERY: Partial<Record<MonocolorArchetypeId, MonocolorArchetypeMastery>> = ${JSON.stringify(masteryById, null, 2)};
`;

  fs.writeFileSync(targetPath, fileContent, 'utf-8');
  console.log(`\n========================================================================`);
  console.log(` TREINAMENTO CONCLUÍDO EM ${elapsedSeconds}s!`);
  console.log(` • Duelos completos simulados: ${totalMatchesSimulated}`);
  console.log(` • Estados treinados nas Value MLPs: ${totalTrajectories}`);
  console.log(` • Artefato salvo em: ${targetPath}`);
  console.log(`========================================================================`);
}

main().catch((err) => {
  console.error('Erro fatal no treinamento monocolor:', err);
  process.exit(1);
});
