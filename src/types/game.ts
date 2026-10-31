export type Domain = 'red' | 'blue' | 'purple' | 'green' | 'gold' | 'neutral';

export type CardType = 'creature' | 'spell' | 'reaction' | 'relic';

export type Rarity = 'common' | 'uncommon' | 'rare' | 'legendary';

export type RowType = 'vanguard' | 'rearguard';

export type Keyword =
  | 'Guardião'
  | 'Voo'
  | 'Alcance'
  | 'Ímpeto'
  | 'Atropelar'
  | 'Toque Letal'
  | 'Escudo Divino'
  | 'Dreno de Vida'
  | 'Renascer'
  | 'Pele Incandescente'
  | 'Fúria Crescente';

export type TriggerEffectType =
  | 'damage_enemy_row'
  | 'damage_single_enemy'
  | 'damage_all_units'
  | 'damage_enemy_sovereign'
  | 'heal_sovereign'
  | 'heal_all_allies'
  | 'heal_target_ally'
  | 'draw_cards'
  | 'freeze_enemy'
  | 'freeze_enemy_vanguard'
  | 'bounce_enemy'
  | 'destroy_enemy'
  | 'revive_from_crypt'
  | 'buff_target_ally'
  | 'buff_all_allies'
  | 'debuff_enemy_vanguard_atk'
  | 'grant_bonus_essence'
  | 'summon_token'
  | 'shield_all_allies'
  | 'steal_small_enemy'
  | 'break_domain_expansion';

export interface CardEffect {
  trigger: 'on_enter' | 'on_death' | 'on_attack' | 'turn_start' | 'turn_end' | 'spell_cast';
  type: TriggerEffectType;
  value: number;
  secondaryValue?: number;
  description?: string;
}

export interface AscensionSpec {
  cost: number;
  newName: string;
  newAtk: number;
  newArmor: number;
  newMaxHp: number;
  addedKeywords: Keyword[];
}

export interface CardDefinition {
  id: string;
  name: string;
  originalInspiration: string;
  ipSafeNotes: string;
  domain: Domain;
  type: CardType;
  subtype: string;
  rarity: Rarity;
  cost: number;
  affinityReq: number; // How many points of this domain's affinity are required (0 for neutral)
  atk: number;
  armor: number;
  hp: number;
  preferredRow: RowType;
  keywords: Keyword[];
  regeneration?: number;
  breathDamage?: number;
  corruptionCost?: number;
  ascension?: AscensionSpec;
  effects: CardEffect[];
  description: string;
  flavorText: string;
  imagePath: string;
  aiArtPrompt: string;
}

export interface BoardUnit {
  instanceId: string;
  cardId: string;
  card: CardDefinition;
  owner: 'player' | 'ai';
  row: RowType;
  slotIndex: number;
  stackIndex?: number;
  currentAtk: number;
  currentArmor: number;
  currentHp: number;
  maxHp: number;
  keywords: Keyword[];
  regeneration: number;
  hasSummoningSickness: boolean;
  hasAttackedThisTurn: boolean;
  isFrozen: boolean;
  hasDivineShield: boolean;
  isAscended: boolean;
  hasRebornTriggered: boolean;
  formationAtkBonus?: number;
  formationArmorBonus?: number;
  invasionAtkBonus?: number;
  isInvading?: boolean;
  terrainAtkBonus?: number;
  terrainArmorBonus?: number;
  weatherAtkBonus?: number;
  domainExpansionAtkBonus?: number;
  domainExpansionArmorBonus?: number;
  domainExpansionHpBonus?: number;
  domainExpansionGrantedImpeto?: boolean;
  stance?: 'attack' | 'defend';
  plannedTargetId?: string | null;
  bastionArmorBonus?: number;
  isConcealedDeploy?: boolean;
  isTrap?: boolean;
}

export type AffinityMap = Record<Domain, number>;

export type RoundSubPhase = 'deploy' | 'combat_plan';

export interface DomainExpansionState {
  owner: 'player' | 'ai';
  domain: Exclude<Domain, 'neutral'>;
  name: string;
  subtitle: string;
  icon: string;
  potencyDesc: string;
  sureHitDesc: string;
  turnsRemaining: number;
  damageTakenByOwnerThisRound: number;
  simpleDomainProtectedActor: 'player' | 'ai' | null;
  clashRival?: {
    owner: 'player' | 'ai';
    domain: Exclude<Domain, 'neutral'>;
    name: string;
    icon: string;
  } | null;
}

export interface SacrificeAllocation {
  sovereignHp: number;
  unitDamages: Record<string, number>; // instanceId -> hp/durability sacrificed
}

export interface PlayerState {
  id: 'player' | 'ai';
  name: string;
  title: string;
  avatarCardId: string;
  hp: number;
  maxHp: number;
  corruption: number; // 0 to 10
  currentEssence: number;
  maxEssence: number;
  hasChanneledThisTurn: boolean;
  hasMovedThisTurn?: boolean;
  hasUsedSovereignPowerThisTurn?: boolean;
  hasUsedBloodPactThisTurn?: boolean;
  hasUsedSimpleDomainThisTurn?: boolean;
  domainExhaustionTurns?: number;
  affinities: AffinityMap;
  channeledCards: CardDefinition[];
  deck: CardDefinition[];
  hand: CardDefinition[];
  crypt: CardDefinition[];
  vanguard: (BoardUnit | null)[]; // 6 slots (primary/front unit per slot)
  rearguard: (BoardUnit | null)[]; // 6 slots (primary/front unit per slot)
  vanguardStacks: BoardUnit[][]; // 6 slots, each holding up to 3 stacked units (Opção C)
  rearguardStacks: BoardUnit[][]; // 6 slots, each holding up to 3 stacked units (Opção C)
}

export interface CombatLogEntry {
  id: string;
  turn: number;
  actor: 'player' | 'ai' | 'system';
  category: 'channel' | 'summon' | 'spell' | 'combat' | 'effect' | 'corruption' | 'turn';
  message: string;
}

export interface FloatingFeedback {
  id: string;
  targetId: string; // unit instanceId or 'player-sovereign' | 'ai-sovereign'
  text: string;
  color: 'damage' | 'heal' | 'buff' | 'freeze' | 'shield' | 'ess';
}

export type ArenaWeatherType =
  | 'ash_storm'
  | 'astral_blizzard'
  | 'umbral_eclipse'
  | 'sylvan_monsoon'
  | 'solar_zenith'
  | 'astral_convergence';

export interface ArenaWeatherState {
  type: ArenaWeatherType;
  domain: Domain;
  name: string;
  icon: string;
  shortDesc: string;
  owner: 'player' | 'ai' | 'system';
  turnsRemaining: number;
}

export type ArenaRuneType = 'forge' | 'bastion' | 'leyline' | 'vitality';

export interface ArenaColumnRune {
  slotIndex: number;
  type: ArenaRuneType;
  name: string;
  icon: string;
  shortDesc: string;
  color: Domain;
}

export interface OverworldFieldBuff {
  id: string;
  sourceLandmarkName: string;
  realm: 'veridia' | 'eclipse' | 'matrix' | 'solaria' | 'pyros' | 'vortex';
  bonusHp: number;
  bonusOpeningEssence: number;
  vanguardArmorBonus: number;
  bonusOpeningDraw?: number;
  summaryLabel: string;
}

export interface ConquestBattleModifiers {
  provinceId: string;
  provinceName: string;
  provinceDomain: Domain;
  isDefensiveSiege: boolean;
  isCapitalSiege: boolean;
  playerBonusHp: number;
  playerBonusEssence: number;
  enemyOpeningDamage: number;
  vanguardArmorBonus: number;
  relicDiscount: boolean;
  dragonSkyBonus: boolean;
  legendaryWheelBonus: boolean;
  bannerSummary: string;
  /** Reino geográfico onde a batalha está ocorrendo (Campanha, Expedição ou Conquista) */
  biomeRealm?: 'veridia' | 'eclipse' | 'matrix' | 'solaria' | 'pyros' | 'vortex';
  /** Marco geográfico local exibido na arena */
  landmarkLabel?: string;
  /** Clima regional inicial aplicado ao campo de batalha */
  initialWeather?: ArenaWeatherType;
  /** Bônus temporário obtido ao explorar um Marco Vivo no mapa antes da batalha */
  overworldBuff?: OverworldFieldBuff | null;
  /** Relíquia da Coroa equipada pelo Soberano nesta partida */
  equippedRelic?: {
    id: string;
    name: string;
    icon: string;
    shortBonus: string;
    bonusOpeningDraw?: number;
    bonusAffinityDomain?: Domain | 'auto';
  } | null;
}

export interface GameState {
  turn: number;
  activePlayer: 'player' | 'ai';
  phase: 'main' | 'gameover';
  roundSubPhase?: RoundSubPhase;
  initiativePlayer?: 'player' | 'ai';
  domainExpansion?: DomainExpansionState | null;
  winner: 'player' | 'ai' | null;
  winReason: string;
  bossId?: string;
  expeditionBlessingId?: string;
  conquestModifiers?: ConquestBattleModifiers | null;
  weather?: ArenaWeatherState | null;
  columnRunes?: ArenaColumnRune[];
  player: PlayerState;
  ai: PlayerState;
  combatLog: CombatLogEntry[];
  feedbacks: FloatingFeedback[];
}

export interface PrebuiltDeck {
  id: string;
  name: string;
  subtitle: string;
  domains: Domain[];
  strategy: string;
  coverCardId: string;
  cardIds: string[]; // 40 cards total
}

export interface CampaignBoss {
  id: string;
  stage: number;
  name: string;
  title: string;
  domains: Domain[];
  avatarCardId: string;
  startingHp: number;
  passiveName: string;
  passiveDescription: string;
  rewardGold: number;
  loreIntro: string;
  deckId: string;
}
