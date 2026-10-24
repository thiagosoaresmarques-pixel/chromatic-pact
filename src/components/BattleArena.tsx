import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  BoardUnit,
  CampaignBoss,
  CardDefinition,
  Domain,
  FloatingFeedback,
  GameState,
  RowType,
  SacrificeAllocation,
} from '../types/game';
import { ALL_CARDS, CARDS_BY_ID } from '../data/cards';
import { PREBUILT_DECKS } from '../data/decks';
import {
  activateSimpleDomain,
  ascendUnit,
  bloodPactForEssence,
  breakDomainExpansionWithSacrifice,
  buildAutoSacrificeAllocation,
  burnCardForEssence,
  canAscendUnit,
  canBreakDomainExpansionWithSacrifice,
  canDeployToSlot,
  canInvokeDomainExpansion,
  canMoveUnitRow,
  canPlayCard,
  canUseBloodPact,
  canUseSimpleDomain,
  canUseSovereignPower,
  channelCard,
  CombatPreviewResult,
  createInitialGameState,
  DOMAIN_BREAK_SACRIFICE_HP,
  endTurn,
  executeAttack,
  findUnitOnBoard,
  getAllBoardUnits,
  getBestExpandableDomain,
  getBiomeTerrainInfo,
  getDomainExpansionSpec,
  getRowUnits,
  getSlotUnits,
  getSovereignPowerInfo,
  getTotalAvailableSacrificePool,
  getValidAttackTargets,
  invokeDomainExpansion,
  isSureHitActiveFor,
  MAX_UNITS_PER_SLOT,
  moveUnitRow,
  mulliganCards,
  playCard,
  previewAttackOutcome,
  useSovereignPower,
} from '../engine/gameEngine';
import { executeAiTurnStep } from '../engine/aiEngine';
import { playSfx } from '../utils/soundEngine';
import { MusicIntensityStage, setMusicState } from '../utils/musicEngine';
import {
  flipGameStatePerspective,
  MONOCHROMATIC_STARTER_DECKS,
  MultiplayerRoom,
  publishMpMessage,
  SovereignUserProfile,
  subscribeMultiplayerBus,
  VICTORY_GOLD_REWARD,
} from '../utils/multiplayerEngine';
import { CardView, CardInspectModal, DOMAIN_META } from './CardView';
import { TacticalGuideView } from './TacticalGuideView';
import { TutorialCodexView } from './TutorialCodexView';

const ARENA_COACHMARK_STEPS = [
  {
    step: 1,
    badge: 'PASSO 1 DE 7 • TURNOS ALTERNADOS & BARRAS SIMÉTRICAS',
    title: 'Cada Jogador Joga no Seu Turno (40❤️, 3⚡ Inicial & 7 Cartas)',
    text: 'Em Chromatic Pact, cada Soberano joga no seu próprio turno! Você inicia com 40❤️ de Vida, 3⚡ de Essência Máxima e 7 cartas (com Mulligan inicial). Use as barras simétricas no topo (▾ Oponente) e na base (▴ Jogador) para inspecionar Terrenos Canalizados, Afinidades e Cripta, e passe o mouse ou clique em "🃏 MÃO" para abrir ou fixar suas cartas!',
  },
  {
    step: 2,
    badge: 'PASSO 2 DE 7 • PROGRESSÃO DE ESSÊNCIA, CANALIZAR & SACRIFICAR [C]',
    title: 'Essência Máxima Automática (+1⚡/Turno) & Canalizar 1 Carta (+1 Afinidade & Compra 1)',
    text: 'A cada turno, sua Essência Máxima sobe automaticamente em +1⚡ (até 10⚡) e sua Afinidade cresce +1! Além disso, 1x por turno, selecione uma carta da mão e pressione [C] para Canalizá-la em seus Terrenos: você ganha +1 de Afinidade Elemental extra daquela cor e compra +1 carta substituta! Precisa de mana extra imediata? Você pode Sacrificar/Queimar [C] cartas adicionais por +1⚡ temporário neste turno e +1 Afinidade.',
  },
  {
    step: 3,
    badge: 'PASSO 3 DE 7 • TABULEIRO 6×4, VANGUARDA [V] & RETAGUARDA [R]',
    title: 'Invocar Livremente, Invasão (+1⚔️), Cobertura (+1⚔️) & Falange (+1🛡️)',
    text: 'No seu turno, invoque Criaturas na Vanguarda [V] ou Retaguarda [R], instale Relíquias [R], arme Emboscadas/Reações [R] ou lance Feitiços imediatamente. Unidades na Vanguarda bloqueiam ataques terrestres contra sua Retaguarda, ganham +1⚔️ ATQ de Invasão se a Vanguarda inimiga da mesma coluna estiver vazia, +1⚔️ ATQ de Cobertura quando apoiadas pela Retaguarda e +1🛡️ Armadura de Falange ao lado de um Guardião!',
  },
  {
    step: 4,
    badge: 'PASSO 4 DE 7 • COMBATE IMEDIATO & PALAVRAS-CHAVE',
    title: 'Atacar no Seu Turno, Ímpeto & Botão "⚔️ ATACAR"',
    text: 'Criaturas recém-invocadas aguardam 1 turno para atacar, exceto unidades com ⚡ Ímpeto, que atacam imediatamente no turno em que entram! Para atacar, clique em uma criatura pronta e depois no alvo inimigo (ou no Soberano rival se a coluna estiver livre), ou clique em "⚔️ ATACAR" na barra inferior para disparar os ataques automaticamente.',
  },
  {
    step: 5,
    badge: 'PASSO 5 DE 7 • DOUTRINA 3x POR SLOT',
    title: 'Empilhamento de até 3 Unidades por Slot vs. Dano em Área',
    text: 'Cada slot da grade 6×4 comporta até 3 unidades empilhadas! Empilhe 1 Guardião + 2 Atacantes/Suportes contra inimigos de alvo único — mas espalhe 1 unidade por coluna contra Dragões com Sopro ou feras com Atropelar, que atingem todas as 3 cartas do slot!',
  },
  {
    step: 6,
    badge: 'PASSO 6 DE 7 • EXPANSÃO DE DOMÍNIO (⛩️ 6/6 AFINIDADE, 3⚡)',
    title: 'Transformação Visual & Prática da Mesa de Madeira',
    text: 'A batalha ocorre sobre a mesa de guerra de madeira em tela cheia. Acumule Afinidade Elemental para destravar cartas fortes e, ao atingir 6/6 de Afinidade e 3⚡, clique em "⛩️ 6/6" na barra inferior para invocar sua Expansão de Domínio por 3 rodadas — transformando toda a mesa de madeira no santuário visual e prático do seu Domínio com Potencial 120% e Acerto Garantido!',
  },
  {
    step: 7,
    badge: 'PASSO 7 DE 7 • RITUAIS DO SOBERANO & PASSAR TURNO',
    title: 'Poder do Soberano (🔥 2⚡), Pacto de Sangue (🩸 +1⚡) & [ESPAÇO]',
    text: 'Na barra inferior, ative o Poder do Soberano (🔥 2⚡), faça o Pacto de Sangue (🩸 +1⚡ pagando 3❤️), Ascenda campeões (★) ou mova unidades entre Vanguarda e Retaguarda (⇄). Quando concluir suas jogadas e ataques, clique em "⏭️ PASSAR TURNO [ESPAÇO]" para passar a vez ao oponente!',
  },
];

export interface CustomSavedDeck {
  id: string;
  name: string;
  cardIds: string[];
}

export interface BattleArenaProps {
  customDecks: CustomSavedDeck[];
  isGuest?: boolean;
  campaignBoss?: CampaignBoss | null;
  campaignPlayerDeckIds?: string[] | null;
  initialPlayerDeckId?: string;
  initialAiDeckId?: string;
  onCampaignVictory?: (boss: CampaignBoss) => void;
  onExitCampaign?: () => void;
  onRewardGold?: (amount: number, reason: string) => void;
  onlineMatch?: {
    room: MultiplayerRoom;
    role: 'host' | 'guest';
    currentUser: SovereignUserProfile;
    onExitPvp: () => void;
    onPvpResult: (didWin: boolean) => void;
  } | null;
}

function resolveDeckCards(cardIds: string[]): CardDefinition[] {
  const resolved: CardDefinition[] = [];
  for (const id of cardIds) {
    const found = CARDS_BY_ID[id];
    if (found) {
      resolved.push(found);
    }
  }
  if (resolved.length < 30 && ALL_CARDS.length > 0) {
    let i = 0;
    while (resolved.length < 100) {
      resolved.push(ALL_CARDS[i % ALL_CARDS.length]);
      i += 1;
    }
  }
  return resolved;
}

function doesCardUseTarget(card: CardDefinition): 'enemy' | 'ally' | 'any_row' | null {
  for (const eff of card.effects) {
    if (eff.trigger === 'on_enter' || eff.trigger === 'spell_cast') {
      if (
        eff.type === 'damage_single_enemy' ||
        eff.type === 'destroy_enemy' ||
        eff.type === 'freeze_enemy' ||
        eff.type === 'bounce_enemy' ||
        eff.type === 'steal_small_enemy' ||
        eff.type === 'damage_enemy_row'
      ) {
        return 'enemy';
      }
      if (eff.type === 'buff_target_ally' || eff.type === 'heal_target_ally') {
        return 'ally';
      }
    }
  }
  return null;
}

/**
 * Computes a deterministic, organic "hand-placed on a physical table" transform
 * for any card on the board so rows and columns remain clear, but cards have natural
 * variation in tilt (angle), vertical height, and horizontal placement.
 */
function getOrganicTabletopPose(
  seedKey: string,
  owner: 'player' | 'ai',
  row: RowType,
  slotIdx: number,
  isTapped?: boolean,
  isInvading?: boolean,
  isClashingAtBorder?: boolean,
  stackIdx = 0,
  stackTotal = 1
): React.CSSProperties {
  let hash = 2166136261;
  const fullKey = `${seedKey}-${owner}-${row}-${slotIdx}-${stackIdx}`;
  for (let i = 0; i < fullKey.length; i += 1) {
    hash ^= fullKey.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const absHash = Math.abs(hash);

  const isInnerCol = slotIdx === 2 || slotIdx === 3;
  const isOuterCol = slotIdx === 0 || slotIdx === 5;
  const colArcY = isInnerCol
    ? owner === 'player'
      ? -4
      : 4
    : isOuterCol
    ? owner === 'player'
      ? 4
      : -4
    : 0;
  const colArcRot =
    slotIdx === 0
      ? owner === 'player'
        ? -1.2
        : 1.2
      : slotIdx === 5
      ? owner === 'player'
        ? 1.2
        : -1.2
      : 0;

  // Subtle organic placement when alone, or structured horizontal cascade when stacked (2..3 cards in the same slot)
  const rawRot = ((absHash % 45) - 22) / 10; // -2.2 to +2.2
  const jitterX = stackTotal > 1 ? 0 : ((absHash >> 4) % 9) - 4;
  const jitterY = stackTotal > 1 ? 0 : ((absHash >> 9) % 7) - 3;

  const midStack = (stackTotal - 1) / 2;
  const stackRel = stackIdx - midStack;
  const stackOffsetX = stackTotal > 1 ? Math.round(stackRel * 24) : 0;
  const stackOffsetY = stackTotal > 1 ? Math.round(stackIdx * -5) : 0;
  const stackRot = stackTotal > 1 ? stackRel * 3.4 : 0;

  let territoryAdvanceY = 0;
  if (row === 'vanguard') {
    if (isInvading) {
      territoryAdvanceY = owner === 'player' ? -8 : 8;
    } else if (isClashingAtBorder) {
      territoryAdvanceY = owner === 'player' ? -3 : 3;
    }
  }

  const finalRot = isTapped
    ? (owner === 'player' ? 12 : -12) + stackRot * 0.6
    : colArcRot + rawRot + stackRot;
  const finalX = jitterX + stackOffsetX;
  const finalY = colArcY + jitterY + territoryAdvanceY + stackOffsetY;

  return {
    transform: `translate(${finalX}px, ${finalY}px) rotate(${finalRot.toFixed(1)}deg)`,
    '--stack-rel': stackRel,
    '--stack-idx': stackIdx,
    zIndex: (isInvading ? 18 : isClashingAtBorder ? 14 : 10) + stackIdx * 2,
  } as React.CSSProperties;
}

export const BattleArena: React.FC<BattleArenaProps> = ({
  customDecks,
  isGuest = false,
  campaignBoss,
  campaignPlayerDeckIds,
  initialPlayerDeckId,
  initialAiDeckId,
  onCampaignVictory,
  onExitCampaign,
  onRewardGold,
  onlineMatch,
}) => {
  const allowedPlayerDecks = useMemo(
    () =>
      !isGuest && customDecks.length > 0
        ? customDecks.map((cd) => ({
            id: cd.id,
            name: `★ ${cd.name}`,
            subtitle: 'Grimório Autoral (100 Cartas)',
            coverCardId: cd.cardIds[0] ?? 'red_01',
            cardIds: cd.cardIds,
          }))
        : MONOCHROMATIC_STARTER_DECKS.map((d) => ({
            id: d.id,
            name: d.name,
            subtitle: d.subtitle,
            coverCardId: d.coverCardId,
            cardIds: d.cardIds,
          })),
    [isGuest, customDecks]
  );

  const [selectedPlayerDeckId, setSelectedPlayerDeckId] = useState<string>(
    initialPlayerDeckId ?? allowedPlayerDecks[0]?.id ?? 'deck_red_inferno'
  );
  const [selectedAiDeckId, setSelectedAiDeckId] = useState<string>(
    initialAiDeckId ?? PREBUILT_DECKS[1]?.id ?? 'deck_blue_tempest'
  );

  const [gameState, setGameState] = useState<GameState>(() => {
    if (onlineMatch?.room.canonicalState) {
      return onlineMatch.role === 'host'
        ? onlineMatch.room.canonicalState
        : flipGameStatePerspective(onlineMatch.room.canonicalState);
    }

    const defaultPlayerDeck =
      allowedPlayerDecks.find((d) => d.id === initialPlayerDeckId) ?? allowedPlayerDecks[0];

    const pDeckIds =
      campaignPlayerDeckIds && campaignPlayerDeckIds.length >= 30
        ? campaignPlayerDeckIds
        : defaultPlayerDeck?.cardIds ?? MONOCHROMATIC_STARTER_DECKS[0]?.cardIds ?? [];

    const bossDeckObj = campaignBoss
      ? PREBUILT_DECKS.find((d) => d.id === campaignBoss.deckId) ?? PREBUILT_DECKS[1]
      : PREBUILT_DECKS[1] ?? PREBUILT_DECKS[0];

    return createInitialGameState(
      resolveDeckCards(pDeckIds),
      resolveDeckCards(bossDeckObj?.cardIds ?? []),
      campaignBoss
        ? {
            playerName: 'Seu Soberano',
            aiName: campaignBoss.name,
            aiTitle: campaignBoss.title,
            aiAvatarCardId: campaignBoss.avatarCardId,
            aiStartingHp: campaignBoss.startingHp,
          }
        : {
            playerName: 'Seu Soberano',
            aiName: bossDeckObj?.name ?? 'Arconte Rival',
            aiTitle: bossDeckObj?.subtitle ?? 'Mestre do Domínio',
            aiAvatarCardId: bossDeckObj?.coverCardId,
          }
    );
  });

  const [selectedHandIndex, setSelectedHandIndex] = useState<number | null>(null);
  const [selectedAttackerId, setSelectedAttackerId] = useState<string | null>(null);
  const [hoveredAttackTargetId, setHoveredAttackTargetId] = useState<string | null>(null);
  const [inspectCard, setInspectCard] = useState<CardDefinition | null>(null);
  const [hoveredCardInfo, setHoveredCardInfo] = useState<{
    card: CardDefinition;
    unit?: BoardUnit;
  } | null>(null);
  const [cryptModalOwner, setCryptModalOwner] = useState<'player' | 'ai' | null>(null);
  const [showQuickRules, setShowQuickRules] = useState(false);
  const [arenaTutorialStep, setArenaTutorialStep] = useState<number | null>(null);
  const [showTacticalAdvisor, setShowTacticalAdvisor] = useState(false);
  const [showLogSidebar, setShowLogSidebar] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [gameoverStage, setGameoverStage] = useState<'none' | 'cinematic' | 'modal'>('none');
  const [isMulliganOpen, setIsMulliganOpen] = useState(true);
  const [mulliganSwapIndices, setMulliganSwapIndices] = useState<number[]>([]);
  const [isHandPinnedOpen, setIsHandPinnedOpen] = useState(false);
  const [isHandHovered, setIsHandHovered] = useState(false);
  const [isP2DrawerPinned, setIsP2DrawerPinned] = useState(false);
  const [isP1DrawerPinned, setIsP1DrawerPinned] = useState(false);
  const [activeRightDrawer, setActiveRightDrawer] = useState<'terrains' | 'guide' | 'menu' | null>(
    null
  );
  const [showSacrificeBreakModal, setShowSacrificeBreakModal] = useState(false);
  const [showSurrenderConfirm, setShowSurrenderConfirm] = useState(false);
  const [opponentOfflineSeconds, setOpponentOfflineSeconds] = useState(0);
  const lastOpponentSignalRef = useRef<number>(Date.now());
  const [sacrificeAlloc, setSacrificeAlloc] = useState<SacrificeAllocation>({
    sovereignHp: 0,
    unitDamages: {},
  });
  const [arenaShake, setArenaShake] = useState<'light' | 'heavy' | null>(null);
  const [domainExitAnim, setDomainExitAnim] = useState<{
    domain: Exclude<Domain, 'neutral'>;
    name: string;
    icon: string;
    mode: 'expire' | 'shatter';
    reasonText: string;
  } | null>(null);
  const prevDomainExpansionRef = useRef<GameState['domainExpansion']>(gameState.domainExpansion);
  const [combatAnim, setCombatAnim] = useState<{
    attackerId: string;
    targetId: string;
    startX: number;
    startY: number;
    lungeX: number;
    lungeY: number;
    impactX: number;
    impactY: number;
    angleDeg: number;
    distancePx: number;
    isRanged: boolean;
    isHeavyHit: boolean;
    domain: Domain;
  } | null>(null);

  const [spectacleFx, setSpectacleFx] = useState<{
    kind: 'breath' | 'spell' | 'legendary' | 'ascend' | 'sovereign';
    card: CardDefinition;
    domain: Domain;
    title: string;
    subtitle: string;
    targetLaneId?: string;
    startX?: number;
    startY?: number;
    targetX?: number;
    targetY?: number;
    angleDeg?: number;
    distancePx?: number;
  } | null>(null);

  const triggerScreenShake = (intensity: 'light' | 'heavy') => {
    setArenaShake(intensity);
    setTimeout(() => setArenaShake(null), intensity === 'heavy' ? 520 : 340);
  };

  const triggerCardPlaySpectacle = (
    actor: 'player' | 'ai',
    card: CardDefinition,
    prePlayState: GameState,
    targetId?: string
  ) => {
    const enemyActor: 'player' | 'ai' = actor === 'player' ? 'ai' : 'player';
    const enemyState = prePlayState[enemyActor];

    // Measure caster Sovereign origin coordinates for spell projectile beams
    let startX = window.innerWidth / 2;
    let startY = actor === 'player' ? window.innerHeight - 90 : 90;
    const casterEl = document.querySelector(
      `[data-combat-id="${actor}-sovereign"]`
    ) as HTMLElement | null;
    if (casterEl) {
      const cr = casterEl.getBoundingClientRect();
      startX = Math.round(cr.left + cr.width / 2);
      startY = Math.round(cr.top + cr.height / 2);
    }

    // Determine target coordinates if targetId is provided
    let targetX: number | undefined;
    let targetY: number | undefined;
    let angleDeg = 0;
    let distancePx = 0;
    if (targetId) {
      const el = document.querySelector(`[data-combat-id="${targetId}"]`) as HTMLElement | null;
      if (el) {
        const r = el.getBoundingClientRect();
        targetX = Math.round(r.left + r.width / 2);
        targetY = Math.round(r.top + r.height / 2);
        const dx = targetX - startX;
        const dy = targetY - startY;
        angleDeg = Math.round((Math.atan2(dy, dx) * 180) / Math.PI);
        distancePx = Math.round(Math.hypot(dx, dy));
      }
    }

    // 1. Dragon Breath / Row Wave (breathDamage > 0 or row-wide spell)
    const isRowSpell = card.effects.some(
      (e) =>
        e.type === 'damage_enemy_row' ||
        e.type === 'freeze_enemy_vanguard' ||
        e.type === 'debuff_enemy_vanguard_atk'
    );
    if ((card.breathDamage && card.breathDamage > 0) || isRowSpell) {
      const targetRowName: RowType = enemyState.vanguard.some((u) => u !== null)
        ? 'vanguard'
        : 'rearguard';
      const targetLaneId = `${enemyActor}-${targetRowName}`;
      const dmgVal =
        card.breathDamage ||
        card.effects.find((e) => e.type === 'damage_enemy_row')?.value ||
        0;

      triggerScreenShake('heavy');
      setSpectacleFx({
        kind: 'breath',
        card,
        domain: card.domain,
        title:
          card.breathDamage && card.breathDamage > 0
            ? `🐉 SOPRO ELEMENTAL: ${card.name.toUpperCase()}`
            : `🌊 ONDA ARCANA: ${card.name.toUpperCase()}`,
        subtitle:
          dmgVal > 0
            ? `Varrendo a ${
                targetRowName === 'vanguard' ? 'Vanguarda' : 'Retaguarda'
              } inimiga (-${dmgVal}🔥)!`
            : card.description,
        targetLaneId,
      });
      setTimeout(() => setSpectacleFx(null), 920);
      return;
    }

    // 2. Legendary Creature / Relic Summon
    if (card.rarity === 'legendary' && (card.type === 'creature' || card.type === 'relic')) {
      triggerScreenShake('heavy');
      setSpectacleFx({
        kind: 'legendary',
        card,
        domain: card.domain,
        title: `👑 ENTRADA LENDÁRIA: ${card.name.toUpperCase()}`,
        subtitle: card.description || card.flavorText,
      });
      setTimeout(() => setSpectacleFx(null), 1050);
      return;
    }

    // 3. Spell or Reaction Cast
    if (card.type === 'spell' || card.type === 'reaction') {
      triggerScreenShake('light');
      setSpectacleFx({
        kind: 'spell',
        card,
        domain: card.domain,
        title: `✨ ${card.name.toUpperCase()}`,
        subtitle: card.description,
        startX,
        startY,
        targetX,
        targetY,
        angleDeg,
        distancePx,
      });
      setTimeout(() => setSpectacleFx(null), 860);
    }
  };

  const triggerAscendSpectacle = (unit: BoardUnit) => {
    const el = document.querySelector(
      `[data-combat-id="${unit.instanceId}"]`
    ) as HTMLElement | null;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    if (el) {
      const r = el.getBoundingClientRect();
      targetX = Math.round(r.left + r.width / 2);
      targetY = Math.round(r.top + r.height / 2);
    }
    const spec = unit.card.ascension;
    triggerScreenShake('heavy');
    setSpectacleFx({
      kind: 'ascend',
      card: unit.card,
      domain: unit.card.domain,
      title: `🔥 ASCENSÃO: ★ ${(spec?.newName ?? unit.card.name).toUpperCase()}`,
      subtitle: spec
        ? `Evoluiu para ${spec.newAtk}/${spec.newMaxHp} (ARM ${spec.newArmor})!`
        : 'Poder Desperto!',
      targetX,
      targetY,
    });
    setTimeout(() => setSpectacleFx(null), 1020);
  };

  const triggerSovereignSpectacle = (actor: 'player' | 'ai', title: string, subtitle: string, domain: Domain, avatarCard: CardDefinition) => {
    const el = document.querySelector(
      `[data-combat-id="${actor}-sovereign"]`
    ) as HTMLElement | null;
    let targetX = window.innerWidth / 2;
    let targetY = actor === 'player' ? window.innerHeight - 90 : 90;
    if (el) {
      const r = el.getBoundingClientRect();
      targetX = Math.round(r.left + r.width / 2);
      targetY = Math.round(r.top + r.height / 2);
    }
    triggerScreenShake('heavy');
    setSpectacleFx({
      kind: 'sovereign',
      card: avatarCard,
      domain,
      title,
      subtitle,
      targetX,
      targetY,
    });
    setTimeout(() => setSpectacleFx(null), 960);
  };

  const measureAndTriggerLunge = (
    attackerId: string,
    targetId: string,
    domain: Domain,
    isRanged: boolean,
    onImpactCommit: () => void,
    isHeavyHit = false
  ) => {
    const attackerEl = document.querySelector(
      `[data-combat-id="${attackerId}"]`
    ) as HTMLElement | null;
    const targetEl = document.querySelector(
      `[data-combat-id="${targetId}"]`
    ) as HTMLElement | null;

    let startX = window.innerWidth / 2;
    let startY = window.innerHeight / 2 + 80;
    let lungeX = 0;
    let lungeY = -120;
    let impactX = window.innerWidth / 2;
    let impactY = window.innerHeight / 2 - 80;
    let angleDeg = -90;
    let distancePx = 160;

    if (attackerEl && targetEl) {
      const aRect = attackerEl.getBoundingClientRect();
      const tRect = targetEl.getBoundingClientRect();
      const ax = aRect.left + aRect.width / 2;
      const ay = aRect.top + aRect.height / 2;
      const tx = tRect.left + tRect.width / 2;
      const ty = tRect.top + tRect.height / 2;
      startX = Math.round(ax);
      startY = Math.round(ay);
      const dx = tx - ax;
      const dy = ty - ay;
      lungeX = Math.round(dx * (isRanged ? 0.14 : 0.84));
      lungeY = Math.round(dy * (isRanged ? 0.14 : 0.84));
      impactX = Math.round(tx);
      impactY = Math.round(ty);
      angleDeg = Math.round((Math.atan2(dy, dx) * 180) / Math.PI);
      distancePx = Math.max(40, Math.round(Math.hypot(dx, dy)));
    }

    playSfx('attack');
    setCombatAnim({
      attackerId,
      targetId,
      startX,
      startY,
      lungeX,
      lungeY,
      impactX,
      impactY,
      angleDeg,
      distancePx,
      isRanged,
      isHeavyHit,
      domain,
    });

    setTimeout(() => {
      playSfx('hit');
      triggerScreenShake(isHeavyHit ? 'heavy' : 'light');
      onImpactCommit();
    }, 230);

    setTimeout(() => {
      setCombatAnim(null);
    }, 480);
  };

  const handleHoverCard = (card: CardDefinition | null, unit?: BoardUnit) => {
    if (!card) {
      setHoveredCardInfo(null);
    } else {
      setHoveredCardInfo({ card, unit });
    }
  };

  useEffect(() => {
    if (campaignBoss) {
      const pDeckIds =
        campaignPlayerDeckIds && campaignPlayerDeckIds.length >= 30
          ? campaignPlayerDeckIds
          : PREBUILT_DECKS[0]?.cardIds ?? [];
      const bossDeck =
        PREBUILT_DECKS.find((d) => d.id === campaignBoss.deckId) ?? PREBUILT_DECKS[0];

      setGameState(
        createInitialGameState(
          resolveDeckCards(pDeckIds),
          resolveDeckCards(bossDeck?.cardIds ?? []),
          {
            playerName: 'Seu Soberano',
            aiName: campaignBoss.name,
            aiTitle: campaignBoss.title,
            aiAvatarCardId: campaignBoss.avatarCardId,
            aiStartingHp: campaignBoss.startingHp,
            bossId: campaignBoss.id,
          }
        )
      );
      setSelectedHandIndex(null);
      setSelectedAttackerId(null);
      setRewardClaimed(false);
      setIsMulliganOpen(true);
      setMulliganSwapIndices([]);
    }
  }, [campaignBoss, campaignPlayerDeckIds]);

  // Detect Domain Expansion lifecycle transitions: Entry (AI), Clash, Natural Expiration, and Shatter/Destruction
  useEffect(() => {
    const prev = prevDomainExpansionRef.current;
    const curr = gameState.domainExpansion;

    if (prev && !curr) {
      const recentLogsText = [
        ...gameState.combatLog.slice(0, 6),
        ...gameState.combatLog.slice(-6),
      ]
        .map((l) => l.message)
        .join(' ');
      const wasShattered =
        recentLogsText.includes('QUEBRA DE BARREIRA') ||
        recentLogsText.includes('QUEBRA DE CONCENTRAÇÃO') ||
        recentLogsText.includes('estilhaçar') ||
        recentLogsText.includes('colapsou');

      if (wasShattered) {
        triggerScreenShake('heavy');
        playSfx('hit');
        const reason = recentLogsText.includes('QUEBRA DE CONCENTRAÇÃO')
          ? `💥 QUEBRA DE CONCENTRAÇÃO! [${prev.name.toUpperCase()}] ESTILHAÇADO!`
          : `💥 BARREIRA ROMPIDA! [${prev.name.toUpperCase()}] ESTILHAÇADO!`;
        setDomainExitAnim({
          domain: prev.domain,
          name: prev.name,
          icon: prev.icon,
          mode: 'shatter',
          reasonText: reason,
        });
        const t = setTimeout(() => setDomainExitAnim(null), 1300);
        prevDomainExpansionRef.current = curr;
        return () => clearTimeout(t);
      } else {
        playSfx('spell');
        setDomainExitAnim({
          domain: prev.domain,
          name: prev.name,
          icon: prev.icon,
          mode: 'expire',
          reasonText: `${prev.icon} ${prev.name.toUpperCase()} — DURAÇÃO ENCERRADA`,
        });
        const t = setTimeout(() => setDomainExitAnim(null), 1150);
        prevDomainExpansionRef.current = curr;
        return () => clearTimeout(t);
      }
    }

    if (prev && curr && prev.owner !== curr.owner && !curr.clashRival) {
      // Overwhelming Affinity shattered the previous Domain Expansion and replaced it!
      triggerScreenShake('heavy');
      playSfx('hit');
      setDomainExitAnim({
        domain: prev.domain,
        name: prev.name,
        icon: prev.icon,
        mode: 'shatter',
        reasonText: `💥 [${curr.name.toUpperCase()}] ESTILHAÇOU [${prev.name.toUpperCase()}]!`,
      });
      const t = setTimeout(() => setDomainExitAnim(null), 1300);
      prevDomainExpansionRef.current = curr;
      return () => clearTimeout(t);
    }

    if (prev && curr && !prev.clashRival && curr.clashRival) {
      // Entered Domain Clash (Two Domains fighting on the table)!
      triggerScreenShake('heavy');
      playSfx('ascend');
      const rivalOwner = curr.clashRival.owner;
      const rivalCard =
        CARDS_BY_ID[gameState[rivalOwner].avatarCardId] ?? ALL_CARDS[0];
      triggerSovereignSpectacle(
        rivalOwner,
        `⚡⛩️ DISPUTA DE DOMÍNIOS: ${curr.name.toUpperCase()} vs ${curr.clashRival.name.toUpperCase()}`,
        'As duas barreiras colidem no centro da mesa! O Acerto Garantido de ambos foi anulado!',
        curr.clashRival.domain,
        rivalCard
      );
    } else if (!prev && curr && curr.owner === 'ai') {
      // AI invoked Domain Expansion on its turn
      const aiCard = CARDS_BY_ID[gameState.ai.avatarCardId] ?? ALL_CARDS[0];
      triggerSovereignSpectacle(
        'ai',
        `⛩️ EXPANSÃO DE DOMÍNIO INIMIGA: ${curr.name.toUpperCase()}`,
        `${curr.potencyDesc} • ${curr.sureHitDesc}`,
        curr.domain,
        aiCard
      );
    }

    prevDomainExpansionRef.current = curr;
  }, [gameState.domainExpansion, gameState.turn, gameState.combatLog.length]);

  const toggleMulliganCard = (idx: number) => {
    setMulliganSwapIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const isRemoteSyncRef = useRef<boolean>(false);
  const mpVersionRef = useRef<number>(onlineMatch?.room.stateVersion ?? 1);
  const mpMountedRef = useRef<boolean>(false);
  const latestPhaseRef = useRef<GameState['phase']>(gameState.phase);
  const onlineMatchRef = useRef<typeof onlineMatch>(onlineMatch);
  const hasForfeitedRef = useRef<boolean>(false);

  useEffect(() => {
    latestPhaseRef.current = gameState.phase;
    onlineMatchRef.current = onlineMatch;
  }, [gameState.phase, onlineMatch]);

  // If player leaves the Arena tab mid-1v1 match without finishing, forfeit automatically
  useEffect(() => {
    return () => {
      const om = onlineMatchRef.current;
      if (om && latestPhaseRef.current !== 'gameover' && !hasForfeitedRef.current) {
        hasForfeitedRef.current = true;
        publishMpMessage({
          type: 'MATCH_FORFEIT',
          roomCode: om.room.code,
          role: om.role,
          actorId: om.currentUser.id,
          actorName: om.currentUser.username,
          reason: 'disconnect',
        });
        om.onPvpResult(false);
      }
    };
  }, []);

  const handleConfirmMulligan = () => {
    const next = mulliganCards(gameState, 'player', mulliganSwapIndices);
    playSfx('draw');
    if (onlineMatch) {
      // Broadcast only our side's hand/deck update so both players can mulligan simultaneously
      isRemoteSyncRef.current = true;
      setGameState(next);
      publishMpMessage({
        type: 'MULLIGAN_SIDE_SYNC',
        roomCode: onlineMatch.room.code,
        role: onlineMatch.role,
        hand: next.player.hand,
        deck: next.player.deck,
        actorId: onlineMatch.currentUser.id,
      });
    } else {
      setGameState(next);
    }
    setIsMulliganOpen(false);
    setMulliganSwapIndices([]);
  };

  const handleConfirmSurrender = () => {
    setShowSurrenderConfirm(false);
    setIsMulliganOpen(false);
    setActiveRightDrawer(null);
    if (gameState.phase === 'gameover') return;

    const reasonText = `${gameState.player.name} rendeu-se na batalha. Vitória concedida a ${gameState.ai.name}!`;

    if (onlineMatch) {
      hasForfeitedRef.current = true;
      isRemoteSyncRef.current = true;
      publishMpMessage({
        type: 'MATCH_FORFEIT',
        roomCode: onlineMatch.room.code,
        role: onlineMatch.role,
        actorId: onlineMatch.currentUser.id,
        actorName: onlineMatch.currentUser.username,
        reason: 'surrender',
      });
    }

    setGameState((prev) => ({
      ...prev,
      phase: 'gameover',
      winner: 'ai',
      winReason: reasonText,
    }));
  };

  // Real-time 1v1 Multiplayer State Synchronization (Host <-> Guest)
  useEffect(() => {
    if (!onlineMatch) return;
    lastOpponentSignalRef.current = Date.now();
    setOpponentOfflineSeconds(0);

    const unsub = subscribeMultiplayerBus((msg) => {
      if (
        msg.type === 'MATCH_STATE_SYNC' &&
        msg.roomCode === onlineMatch.room.code &&
        msg.actorId !== onlineMatch.currentUser.id &&
        msg.stateVersion > mpVersionRef.current
      ) {
        lastOpponentSignalRef.current = Date.now();
        setOpponentOfflineSeconds(0);
        mpVersionRef.current = msg.stateVersion;
        isRemoteSyncRef.current = true;
        const localized =
          onlineMatch.role === 'host'
            ? msg.canonicalState
            : flipGameStatePerspective(msg.canonicalState);
        playSfx('draw');
        setGameState(localized);
      } else if (
        msg.type === 'MULLIGAN_SIDE_SYNC' &&
        msg.roomCode === onlineMatch.room.code &&
        msg.actorId !== onlineMatch.currentUser.id
      ) {
        lastOpponentSignalRef.current = Date.now();
        setOpponentOfflineSeconds(0);
        isRemoteSyncRef.current = true;
        setGameState((prev) => ({
          ...prev,
          ai: {
            ...prev.ai,
            hand: msg.hand,
            deck: msg.deck,
          },
        }));
      } else if (
        msg.type === 'HEARTBEAT_PING' &&
        msg.roomCode === onlineMatch.room.code &&
        msg.actorId !== onlineMatch.currentUser.id
      ) {
        lastOpponentSignalRef.current = Date.now();
        setOpponentOfflineSeconds(0);
      } else if (
        msg.type === 'MATCH_FORFEIT' &&
        msg.roomCode === onlineMatch.room.code &&
        msg.actorId !== onlineMatch.currentUser.id
      ) {
        lastOpponentSignalRef.current = Date.now();
        setOpponentOfflineSeconds(0);
        setIsMulliganOpen(false);
        isRemoteSyncRef.current = true;
        const winText =
          msg.reason === 'surrender'
            ? `${msg.actorName} rendeu-se na batalha! Vitória concedida a você.`
            : `${msg.actorName} abandonou a sala ou perdeu a conexão! Vitória por W.O.`;
        setGameState((prev) =>
          prev.phase === 'gameover'
            ? prev
            : {
                ...prev,
                phase: 'gameover',
                winner: 'player',
                winReason: winText,
              }
        );
      } else if (msg.type === 'ROOM_UPSERT' && msg.room.code === onlineMatch.room.code) {
        const oppHb =
          onlineMatch.role === 'host' ? msg.room.guestHeartbeatAt : msg.room.hostHeartbeatAt;
        if (oppHb && oppHb > lastOpponentSignalRef.current) {
          lastOpponentSignalRef.current = oppHb;
          setOpponentOfflineSeconds(0);
        }
        const opponentRole = onlineMatch.role === 'host' ? 'guest' : 'host';
        if (msg.room.forfeitedByRole === opponentRole) {
          setIsMulliganOpen(false);
          isRemoteSyncRef.current = true;
          setGameState((prev) =>
            prev.phase === 'gameover'
              ? prev
              : {
                  ...prev,
                  phase: 'gameover',
                  winner: 'player',
                  winReason:
                    msg.room.forfeitReason ||
                    'O oponente abandonou a sala ou perdeu a conexão! Vitória por W.O.',
                }
          );
        }
      }
    });

    return () => unsub();
  }, [onlineMatch]);

  // 1v1 Heartbeat, Connection Drop Detection (45s W.O.) & Tab-Close Abandonment Handler
  useEffect(() => {
    if (!onlineMatch || gameState.phase === 'gameover') {
      setOpponentOfflineSeconds(0);
      return;
    }

    const heartbeatTimer = window.setInterval(() => {
      publishMpMessage({
        type: 'HEARTBEAT_PING',
        roomCode: onlineMatch.room.code,
        role: onlineMatch.role,
        actorId: onlineMatch.currentUser.id,
        timestamp: Date.now(),
      });
    }, 5000);

    const watchdogTimer = window.setInterval(() => {
      const elapsedSec = Math.floor((Date.now() - lastOpponentSignalRef.current) / 1000);
      if (elapsedSec >= 45) {
        const oppRole = onlineMatch.role === 'host' ? 'guest' : 'host';
        const oppName = gameState.ai.name || 'Oponente';
        isRemoteSyncRef.current = true;
        publishMpMessage({
          type: 'MATCH_FORFEIT',
          roomCode: onlineMatch.room.code,
          role: oppRole,
          actorId:
            onlineMatch.role === 'host'
              ? onlineMatch.room.guest?.id ?? 'guest'
              : onlineMatch.room.host.id,
          actorName: oppName,
          reason: 'disconnect',
        });
        setIsMulliganOpen(false);
        setOpponentOfflineSeconds(0);
        setGameState((prev) =>
          prev.phase === 'gameover'
            ? prev
            : {
                ...prev,
                phase: 'gameover',
                winner: 'player',
                winReason: `${oppName} perdeu a conexão ou abandonou a sala (45s sem resposta). Vitória por W.O.!`,
              }
        );
      } else if (elapsedSec >= 18) {
        setOpponentOfflineSeconds(elapsedSec);
      } else {
        setOpponentOfflineSeconds(0);
      }
    }, 1000);

    const handleBeforeUnloadAbandon = () => {
      if (hasForfeitedRef.current) return;
      hasForfeitedRef.current = true;
      publishMpMessage({
        type: 'MATCH_FORFEIT',
        roomCode: onlineMatch.room.code,
        role: onlineMatch.role,
        actorId: onlineMatch.currentUser.id,
        actorName: onlineMatch.currentUser.username,
        reason: 'disconnect',
      });
      onlineMatch.onPvpResult(false);
    };

    window.addEventListener('beforeunload', handleBeforeUnloadAbandon);
    window.addEventListener('pagehide', handleBeforeUnloadAbandon);

    return () => {
      window.clearInterval(heartbeatTimer);
      window.clearInterval(watchdogTimer);
      window.removeEventListener('beforeunload', handleBeforeUnloadAbandon);
      window.removeEventListener('pagehide', handleBeforeUnloadAbandon);
    };
  }, [onlineMatch, gameState.phase, gameState.ai.name]);

  // Publish local player's actions to 1v1 opponent in real time
  useEffect(() => {
    if (!onlineMatch) return;
    if (!mpMountedRef.current) {
      mpMountedRef.current = true;
      return;
    }
    if (isRemoteSyncRef.current) {
      isRemoteSyncRef.current = false;
      return;
    }

    const nextVersion = mpVersionRef.current + 1;
    mpVersionRef.current = nextVersion;
    const canonicalState =
      onlineMatch.role === 'host' ? gameState : flipGameStatePerspective(gameState);

    publishMpMessage({
      type: 'MATCH_STATE_SYNC',
      roomCode: onlineMatch.room.code,
      canonicalState,
      stateVersion: nextVersion,
      actorId: onlineMatch.currentUser.id,
    });
  }, [gameState, onlineMatch]);

  const startNewQuickMatch = (pDeckId: string, aDeckId: string) => {
    const pDeck = allowedPlayerDecks.find((d) => d.id === pDeckId) ?? allowedPlayerDecks[0];
    const aDeck = PREBUILT_DECKS.find((d) => d.id === aDeckId) ?? PREBUILT_DECKS[1] ?? PREBUILT_DECKS[0];

    const nextState = createInitialGameState(
      resolveDeckCards(pDeck?.cardIds ?? []),
      resolveDeckCards(aDeck?.cardIds ?? []),
      {
        playerName: pDeck?.name ?? 'Seu Soberano',
        aiName: aDeck?.name ?? 'Arconte Rival',
        aiTitle: aDeck?.subtitle ?? 'Soberano Oponente',
        aiAvatarCardId: aDeck?.coverCardId,
      }
    );

    setGameState(nextState);
    setSelectedHandIndex(null);
    setSelectedAttackerId(null);
    setRewardClaimed(false);
    setIsMulliganOpen(true);
    setMulliganSwapIndices([]);
    playSfx('draw');
  };

  // AI step-by-step execution with Physical Lunge Animation on AI Attacks!
  useEffect(() => {
    if (
      onlineMatch ||
      gameState.phase === 'gameover' ||
      gameState.activePlayer !== 'ai' ||
      combatAnim
    ) {
      return;
    }

    const timer = setTimeout(() => {
      const prevAiUnits = getAllBoardUnits(gameState.ai);
      const step = executeAiTurnStep(gameState);

      if (step.actionSummary.includes('ataque')) {
        // Identify which AI unit just attacked and which player target was hit
        const nextAiUnits = getAllBoardUnits(step.nextState.ai);
        const aiAttacker = prevAiUnits.find((pu) => {
          if (pu.hasAttackedThisTurn) return false;
          const nu = nextAiUnits.find((x) => x.instanceId === pu.instanceId);
          return !nu || nu.hasAttackedThisTurn;
        });
        const hitTargetId = step.nextState.feedbacks[0]?.targetId ?? 'player-sovereign';

        if (aiAttacker) {
          const isRanged =
            aiAttacker.row === 'rearguard' && aiAttacker.keywords.includes('Alcance');
          measureAndTriggerLunge(
            aiAttacker.instanceId,
            hitTargetId,
            aiAttacker.card.domain,
            isRanged,
            () => {
              setGameState(step.nextState);
            }
          );
          return;
        }
        playSfx('attack');
      } else if (
        step.actionSummary.includes('canalizou') ||
        step.actionSummary.includes('reciclou')
      ) {
        playSfx('channel');
      } else if (step.actionSummary.includes('ascendeu')) {
        playSfx('ascend');
        const nextAiUnits = getAllBoardUnits(step.nextState.ai);
        const ascendedUnit = nextAiUnits.find((nu) => {
          const prev = prevAiUnits.find((pu) => pu.instanceId === nu.instanceId);
          return prev && !prev.isAscended && nu.isAscended;
        });
        if (ascendedUnit) {
          triggerAscendSpectacle(ascendedUnit);
        }
      } else if (step.actionSummary.includes('jogou')) {
        const playedCard = gameState.ai.hand.find(
          (c) =>
            step.actionSummary.includes(`[${c.name}]`) &&
            !step.nextState.ai.hand.some((nh) => nh === c)
        );
        if (playedCard) {
          playSfx(
            playedCard.type === 'spell' || playedCard.type === 'reaction' ? 'spell' : 'summon'
          );
          triggerCardPlaySpectacle('ai', playedCard, gameState);
        } else {
          playSfx('summon');
        }
      }
      setGameState(step.nextState);
    }, 580);

    return () => clearTimeout(timer);
  }, [gameState, combatAnim]);

  // Real-time Adaptive Music Intensity & Domain Escalation
  useEffect(() => {
    if (gameState.phase === 'gameover') {
      setMusicState('sanctuary', 'neutral', Boolean(campaignBoss));
      return;
    }

    const pUnits = getAllBoardUnits(gameState.player);
    const aiUnits = getAllBoardUnits(gameState.ai);
    const allUnits = [...pUnits, ...aiUnits];
    const hasAscendedUnit = allUnits.some((u) => u.isAscended);
    const hasLegendaryUnit = allUnits.some((u) => u.card.rarity === 'legendary');

    // Determine dominant musical domain
    let activeDomain: Domain = 'neutral';
    if (gameState.domainExpansion) {
      activeDomain = gameState.domainExpansion.domain;
    } else if (campaignBoss && campaignBoss.domains.length > 0) {
      activeDomain = campaignBoss.domains[0];
    } else {
      const pTerrain = getBiomeTerrainInfo(gameState.player);
      activeDomain = pTerrain.domain;
    }

    // Determine musical intensity stage (0..4)
    let stage: MusicIntensityStage = 'tactical';
    const isNearDeath = gameState.player.hp <= 14 || gameState.ai.hp <= 14;
    const isLateBossClimax = Boolean(campaignBoss) && gameState.turn >= 7;
    const isDomainClash = Boolean(gameState.domainExpansion?.clashRival);

    if (isNearDeath || hasAscendedUnit || isDomainClash || isLateBossClimax) {
      stage = 'climax';
    } else if (gameState.domainExpansion || hasLegendaryUnit) {
      stage = 'domain_clash';
    } else if (
      (!isMulliganOpen && gameState.turn >= 4) ||
      allUnits.length >= 4 ||
      (Boolean(campaignBoss) && !isMulliganOpen)
    ) {
      stage = 'battle';
    } else {
      stage = 'tactical';
    }

    setMusicState(stage, activeDomain, Boolean(campaignBoss));
  }, [gameState, isMulliganOpen, campaignBoss]);

  // Handle gameover cinematic finisher sequence, sound & rewards
  useEffect(() => {
    if (gameState.phase !== 'gameover') {
      setGameoverStage('none');
      return;
    }

    if (!rewardClaimed) {
      setRewardClaimed(true);
      setGameoverStage('cinematic');
      triggerScreenShake('heavy');

      if (gameState.winner === 'player') {
        playSfx('victory');
        if (onlineMatch) {
          onlineMatch.onPvpResult(true);
          if (onRewardGold) onRewardGold(VICTORY_GOLD_REWARD, 'Vitória em Duelo Online 1x1');
        } else if (campaignBoss && onCampaignVictory) {
          onCampaignVictory(campaignBoss);
        } else if (onRewardGold) {
          onRewardGold(VICTORY_GOLD_REWARD, 'Vitória em Duelo na Arena');
        }
      } else {
        playSfx('defeat');
        if (onlineMatch) {
          onlineMatch.onPvpResult(false);
        }
      }

      const timer = window.setTimeout(() => {
        setGameoverStage('modal');
      }, 2550);
      return () => window.clearTimeout(timer);
    }
  }, [
    gameState.phase,
    gameState.winner,
    rewardClaimed,
    campaignBoss,
    onCampaignVictory,
    onRewardGold,
  ]);

  const isPlayerTurn = gameState.activePlayer === 'player' && gameState.phase !== 'gameover';

  const selectedHandCard: CardDefinition | null =
    selectedHandIndex !== null ? gameState.player.hand[selectedHandIndex] ?? null : null;

  const canPlaySelectedHandCard = useMemo(() => {
    if (!selectedHandCard) return { allowed: false, reason: '' };
    return canPlayCard(gameState, 'player', selectedHandCard);
  }, [gameState, selectedHandCard]);

  const validAttackTargets = useMemo(() => {
    if (!selectedAttackerId) return [];
    return getValidAttackTargets(gameState, selectedAttackerId);
  }, [gameState, selectedAttackerId]);

  const allTargetPreviews = useMemo(() => {
    const map: Record<string, CombatPreviewResult> = {};
    if (!selectedAttackerId) return map;
    for (const tid of validAttackTargets) {
      const p = previewAttackOutcome(gameState, selectedAttackerId, tid);
      if (p) {
        map[tid] = p;
      }
    }
    return map;
  }, [gameState, selectedAttackerId, validAttackTargets]);

  const combatPreview = useMemo(() => {
    if (!selectedAttackerId) return null;
    if (hoveredAttackTargetId && allTargetPreviews[hoveredAttackTargetId]) {
      return allTargetPreviews[hoveredAttackTargetId];
    }
    // If no specific target is hovered yet, preview the first valid target so the player immediately sees tactical intel!
    if (validAttackTargets.length > 0) {
      const preferred = validAttackTargets.includes('ai-sovereign')
        ? 'ai-sovereign'
        : validAttackTargets[0];
      return allTargetPreviews[preferred] ?? null;
    }
    return null;
  }, [selectedAttackerId, hoveredAttackTargetId, allTargetPreviews, validAttackTargets]);

  useEffect(() => {
    setHoveredAttackTargetId(null);
  }, [selectedAttackerId]);

  const readyPlayerUnits = useMemo(() => {
    if (!isPlayerTurn) return [];
    return getAllBoardUnits(gameState.player).filter(
      (u) => getValidAttackTargets(gameState, u.instanceId).length > 0
    );
  }, [gameState, isPlayerTurn]);

  const feedbackMap = useMemo(() => {
    const map: Record<string, FloatingFeedback> = {};
    for (const fb of gameState.feedbacks) {
      map[fb.targetId] = fb;
    }
    return map;
  }, [gameState.feedbacks]);

  // Quick 1-click actions from Hand Card
  const findBestDeploySlot = (row: RowType): number => {
    // Prefer an empty slot first; if all 6 columns have at least 1 card, stack onto the least-populated slot (< MAX_UNITS_PER_SLOT)
    for (let i = 0; i < 6; i += 1) {
      if (getSlotUnits(gameState.player, row, i).length === 0) return i;
    }
    let bestIdx = -1;
    let minLen = MAX_UNITS_PER_SLOT;
    for (let i = 0; i < 6; i += 1) {
      const len = getSlotUnits(gameState.player, row, i).length;
      if (len < minLen) {
        minLen = len;
        bestIdx = i;
      }
    }
    return bestIdx;
  };

  const handleQuickDeployToRow = (handIdx: number, row: RowType) => {
    if (!isPlayerTurn) return;
    const card = gameState.player.hand[handIdx];
    if (!card) return;
    const slotIdx = findBestDeploySlot(row);
    if (slotIdx === -1) return;
    triggerCardPlaySpectacle('player', card, gameState);
    const next = playCard(gameState, 'player', handIdx, { row, slotIndex: slotIdx });
    playSfx('summon');
    setGameState(next);
    setSelectedHandIndex(null);
  };

  const handleQuickChannelCard = (handIdx: number) => {
    if (!isPlayerTurn || gameState.player.hasChanneledThisTurn) return;
    const next = channelCard(gameState, 'player', handIdx);
    playSfx('channel');
    setGameState(next);
    setSelectedHandIndex(null);
  };

  const handleQuickBurnCard = (handIdx: number) => {
    if (!isPlayerTurn) return;
    const next = burnCardForEssence(gameState, 'player', handIdx);
    playSfx('channel');
    setGameState(next);
    setSelectedHandIndex(null);
  };

  const handleBloodPact = () => {
    if (!canUseBloodPact(gameState, 'player')) return;
    const pCard = CARDS_BY_ID[gameState.player.avatarCardId] ?? ALL_CARDS[0];
    triggerSovereignSpectacle(
      'player',
      '🩸 PACTO DE SANGUE SOBERANO',
      'Sacrificou 3 PV (+1 Corrupção) em troca de +1 Essência imediata!',
      'purple',
      pCard
    );
    const next = bloodPactForEssence(gameState, 'player');
    playSfx('channel');
    setGameState(next);
  };

  const handleSovereignPower = () => {
    if (!canUseSovereignPower(gameState, 'player')) return;
    const pwr = getSovereignPowerInfo(gameState.player);
    const pCard = CARDS_BY_ID[gameState.player.avatarCardId] ?? ALL_CARDS[0];
    const pTerrain = getBiomeTerrainInfo(gameState.player);
    triggerSovereignSpectacle(
      'player',
      `👑 PODER SOBERANO: ${pwr.name.toUpperCase()}`,
      pwr.shortDesc,
      pTerrain.domain,
      pCard
    );
    const next = useSovereignPower(gameState, 'player');
    playSfx('spell');
    setGameState(next);
  };

  const handleInvokeDomainExpansion = () => {
    const check = canInvokeDomainExpansion(gameState, 'player');
    if (!check.allowed) return;
    const spec = getDomainExpansionSpec(check.domain);
    const pCard = CARDS_BY_ID[gameState.player.avatarCardId] ?? ALL_CARDS[0];
    triggerSovereignSpectacle(
      'player',
      `⛩️ EXPANSÃO DE DOMÍNIO: ${spec.name.toUpperCase()}`,
      `${spec.potencyDesc} • ${spec.sureHitDesc}`,
      check.domain,
      pCard
    );
    const next = invokeDomainExpansion(gameState, 'player');
    playSfx('ascend');
    setGameState(next);
  };

  const handleActivateSimpleDomain = () => {
    if (!canUseSimpleDomain(gameState, 'player')) return;
    const pCard = CARDS_BY_ID[gameState.player.avatarCardId] ?? ALL_CARDS[0];
    const pTerrain = getBiomeTerrainInfo(gameState.player);
    triggerSovereignSpectacle(
      'player',
      '💠 DOMÍNIO SIMPLES ATIVADO',
      'O Acerto Garantido da Expansão de Domínio inimiga no seu Soberano foi anulado nesta rodada!',
      pTerrain.domain,
      pCard
    );
    const next = activateSimpleDomain(gameState, 'player');
    playSfx('spell');
    setGameState(next);
  };

  const handleOpenSacrificeBreakModal = () => {
    if (!canBreakDomainExpansionWithSacrifice(gameState, 'player')) return;
    setSacrificeAlloc(buildAutoSacrificeAllocation(gameState, 'player'));
    setShowSacrificeBreakModal(true);
  };

  const handleConfirmSacrificeBreak = () => {
    const next = breakDomainExpansionWithSacrifice(gameState, 'player', sacrificeAlloc);
    if (next !== gameState) {
      const pCard = CARDS_BY_ID[gameState.player.avatarCardId] ?? ALL_CARDS[0];
      triggerSovereignSpectacle(
        'player',
        '💥 QUEBRA DE BARREIRA POR SACRIFÍCIO!',
        'Sacrificou 10❤️ distribuídos para estilhaçar a Expansão de Domínio inimiga!',
        'red',
        pCard
      );
      playSfx('hit');
      setGameState(next);
      setShowSacrificeBreakModal(false);
    }
  };

  const handleMoveFriendlyUnitRow = (unit: BoardUnit) => {
    if (!canMoveUnitRow(gameState, 'player', unit.instanceId)) return;
    const next = moveUnitRow(gameState, 'player', unit.instanceId);
    playSfx('summon');
    setGameState(next);
  };

  const handleQuickCastSpell = (handIdx: number, targetId?: string) => {
    if (!isPlayerTurn) return;
    const card = gameState.player.hand[handIdx];
    if (card) {
      triggerCardPlaySpectacle('player', card, gameState, targetId);
    }
    const next = playCard(gameState, 'player', handIdx, { targetId });
    playSfx('spell');
    setGameState(next);
    setSelectedHandIndex(null);
  };

  const handleQuickArmTrap = (handIdx: number, preferredSlot?: number) => {
    if (!isPlayerTurn) return;
    const card = gameState.player.hand[handIdx];
    if (!card || card.type !== 'reaction') return;
    const slotIdx =
      preferredSlot !== undefined && canDeployToSlot(gameState.player, 'rearguard', preferredSlot)
        ? preferredSlot
        : findBestDeploySlot('rearguard');
    if (slotIdx === -1) return;
    const next = playCard(gameState, 'player', handIdx, {
      row: 'rearguard',
      slotIndex: slotIdx,
      asTrap: true,
    });
    playSfx('summon');
    setGameState(next);
    setSelectedHandIndex(null);
  };

  // Auto-attack with all ready units
  const handleAutoAttackAll = () => {
    if (!isPlayerTurn || combatAnim) return;
    const units = getAllBoardUnits(gameState.player);
    const firstReady = units.find(
      (u) => getValidAttackTargets(gameState, u.instanceId).length > 0
    );
    if (!firstReady) return;

    const targets = getValidAttackTargets(gameState, firstReady.instanceId);
    let chosenTarget = targets.includes('ai-sovereign') ? 'ai-sovereign' : targets[0];
    const enemyUnits = getAllBoardUnits(gameState.ai).filter((eu) =>
      targets.includes(eu.instanceId)
    );
    const killableEnemy = enemyUnits.find((eu) => eu.currentHp <= firstReady.currentAtk);
    if (killableEnemy && gameState.ai.hp > firstReady.currentAtk) {
      chosenTarget = killableEnemy.instanceId;
    }

    const isRanged =
      firstReady.row === 'rearguard' && firstReady.keywords.includes('Alcance');
    const isHeavy = firstReady.currentAtk >= 5 || Boolean(killableEnemy);
    setSelectedAttackerId(null);

    measureAndTriggerLunge(
      firstReady.instanceId,
      chosenTarget,
      firstReady.card.domain,
      isRanged,
      () => {
        setGameState((prev) => executeAttack(prev, firstReady.instanceId, chosenTarget));
      },
      isHeavy
    );
  };

  const handleDeployToPlayerSlot = (row: RowType, slotIndex: number) => {
    if (!isPlayerTurn || combatAnim) return;
    if (selectedHandIndex === null || !selectedHandCard || !canPlaySelectedHandCard.allowed) return;
    if (!canDeployToSlot(gameState.player, row, slotIndex)) return;

    if (selectedHandCard.type === 'reaction' && row === 'rearguard') {
      handleQuickArmTrap(selectedHandIndex, slotIndex);
      return;
    }
    if (selectedHandCard.type === 'relic' && row !== 'rearguard') {
      return;
    }
    if (selectedHandCard.type === 'creature' || selectedHandCard.type === 'relic') {
      triggerCardPlaySpectacle('player', selectedHandCard, gameState);
      const next = playCard(gameState, 'player', selectedHandIndex, {
        row,
        slotIndex,
      });
      playSfx('summon');
      setGameState(next);
      setSelectedHandIndex(null);
    }
  };

  const handleClickFriendlyUnit = (unit: BoardUnit, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!isPlayerTurn || combatAnim) return;

    // 1. If holding an ally-targeted spell/reaction, cast it on this specific unit in the stack
    if (selectedHandIndex !== null && selectedHandCard && canPlaySelectedHandCard.allowed) {
      const targetMode = doesCardUseTarget(selectedHandCard);
      if (
        (selectedHandCard.type === 'spell' || selectedHandCard.type === 'reaction') &&
        targetMode === 'ally'
      ) {
        handleQuickCastSpell(selectedHandIndex, unit.instanceId);
        return;
      }
      // 2. If holding a Creature, Relic, or Trap and clicking a slot that can stack (< 3 cards), stack it right into this slot!
      if (
        (selectedHandCard.type === 'creature' ||
          (selectedHandCard.type === 'relic' && unit.row === 'rearguard') ||
          (selectedHandCard.type === 'reaction' && unit.row === 'rearguard')) &&
        canDeployToSlot(gameState.player, unit.row, unit.slotIndex)
      ) {
        handleDeployToPlayerSlot(unit.row, unit.slotIndex);
        return;
      }
    }

    // 3. Select / deselect ready creature to attack immediately!
    if (selectedAttackerId === unit.instanceId) {
      setSelectedAttackerId(null);
    } else {
      const targets = getValidAttackTargets(gameState, unit.instanceId);
      if (targets.length > 0) {
        setSelectedAttackerId(unit.instanceId);
        setSelectedHandIndex(null);
      }
    }
  };

  const handleSelectPlayerSlot = (row: RowType, slotIndex: number) => {
    if (!isPlayerTurn || combatAnim) return;
    if (selectedHandIndex !== null && selectedHandCard && canPlaySelectedHandCard.allowed) {
      handleDeployToPlayerSlot(row, slotIndex);
      return;
    }
    const slotUnits = getSlotUnits(gameState.player, row, slotIndex);
    if (slotUnits.length > 0) {
      const readyInSlot =
        slotUnits.find((u) => getValidAttackTargets(gameState, u.instanceId).length > 0) ??
        slotUnits[slotUnits.length - 1];
      handleClickFriendlyUnit(readyInSlot);
    }
  };

  const handleClickEnemyUnit = (enemyUnit: BoardUnit) => {
    if (!isPlayerTurn || combatAnim) return;

    if (selectedAttackerId && validAttackTargets.includes(enemyUnit.instanceId)) {
      const attackerUnit = getAllBoardUnits(gameState.player).find(
        (u) => u.instanceId === selectedAttackerId
      );
      const attackerIdToUse = selectedAttackerId;
      const isRanged = Boolean(
        attackerUnit &&
          attackerUnit.row === 'rearguard' &&
          attackerUnit.keywords.includes('Alcance')
      );
      const prevOut = allTargetPreviews[enemyUnit.instanceId];
      const isHeavy = Boolean(
        (attackerUnit && attackerUnit.currentAtk >= 5) || prevOut?.targetDies
      );
      setSelectedAttackerId(null);

      measureAndTriggerLunge(
        attackerIdToUse,
        enemyUnit.instanceId,
        attackerUnit?.card.domain ?? 'red',
        isRanged,
        () => {
          setGameState((prev) =>
            executeAttack(prev, attackerIdToUse, enemyUnit.instanceId)
          );
        },
        isHeavy
      );
      return;
    }

    if (
      selectedHandIndex !== null &&
      selectedHandCard &&
      canPlaySelectedHandCard.allowed &&
      (selectedHandCard.type === 'spell' || selectedHandCard.type === 'reaction')
    ) {
      handleQuickCastSpell(selectedHandIndex, enemyUnit.instanceId);
    }
  };

  const handleClickAiSovereign = () => {
    if (!isPlayerTurn || combatAnim) return;

    if (selectedAttackerId && validAttackTargets.includes('ai-sovereign')) {
      const attackerUnit = getAllBoardUnits(gameState.player).find(
        (u) => u.instanceId === selectedAttackerId
      );
      const attackerIdToUse = selectedAttackerId;
      const isRanged = Boolean(
        attackerUnit &&
          attackerUnit.row === 'rearguard' &&
          attackerUnit.keywords.includes('Alcance')
      );
      const prevOut = allTargetPreviews['ai-sovereign'];
      const isHeavy = Boolean(
        (attackerUnit && attackerUnit.currentAtk >= 5) || prevOut?.targetDies
      );
      setSelectedAttackerId(null);

      measureAndTriggerLunge(
        attackerIdToUse,
        'ai-sovereign',
        attackerUnit?.card.domain ?? 'red',
        isRanged,
        () => {
          setGameState((prev) => executeAttack(prev, attackerIdToUse, 'ai-sovereign'));
        },
        isHeavy
      );
      return;
    }

    if (
      selectedHandIndex !== null &&
      selectedHandCard &&
      canPlaySelectedHandCard.allowed &&
      (selectedHandCard.type === 'spell' || selectedHandCard.type === 'reaction')
    ) {
      handleQuickCastSpell(selectedHandIndex, 'ai-sovereign');
    }
  };

  const handleAscendFriendlyUnit = (unit: BoardUnit) => {
    if (!canAscendUnit(gameState, 'player', unit.instanceId)) return;
    triggerAscendSpectacle(unit);
    const next = ascendUnit(gameState, 'player', unit.instanceId);
    playSfx('ascend');
    setGameState(next);
  };

  const handleEndPlayerTurn = () => {
    if (!isPlayerTurn || combatAnim) return;
    setSelectedHandIndex(null);
    setSelectedAttackerId(null);
    const next = endTurn(gameState);
    playSfx('draw');
    setGameState(next);
  };

  // Keyboard shortcuts in Arena: Space = Advance Phase / Execute Combat, C = Channel selected card, V = Deploy Vanguard, R = Deploy Rearguard
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }
      if (isMulliganOpen || gameState.phase === 'gameover' || !isPlayerTurn || combatAnim) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleEndPlayerTurn();
        return;
      }

      const key = e.key.toLowerCase();
      if (selectedHandIndex !== null && selectedHandCard) {
        if (key === 'c') {
          e.preventDefault();
          if (!gameState.player.hasChanneledThisTurn) {
            handleQuickChannelCard(selectedHandIndex);
          } else {
            handleQuickBurnCard(selectedHandIndex);
          }
          return;
        }

        if (key === 'v' && canPlaySelectedHandCard.allowed && selectedHandCard.type === 'creature') {
          e.preventDefault();
          handleQuickDeployToRow(selectedHandIndex, 'vanguard');
          return;
        }

        if (key === 'r' && canPlaySelectedHandCard.allowed) {
          e.preventDefault();
          if (selectedHandCard.type === 'creature' || selectedHandCard.type === 'relic') {
            handleQuickDeployToRow(selectedHandIndex, 'rearguard');
          } else if (selectedHandCard.type === 'reaction') {
            handleQuickArmTrap(selectedHandIndex);
          }
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const getStepGuideText = (): string => {
    if (gameState.phase === 'gameover') return gameState.winReason;
    if (!isPlayerTurn) return `Turno de ${gameState.ai.name}...`;
    if (selectedAttackerId) {
      return 'Clique em uma unidade inimiga válida ou no Soberano adversário para atacar!';
    }
    if (selectedHandCard) {
      if (!canPlaySelectedHandCard.allowed) {
        return `[${selectedHandCard.name}]: ${canPlaySelectedHandCard.reason}`;
      }
      if (selectedHandCard.type === 'creature') {
        return `Posicionar [${selectedHandCard.name}]: Escolha qualquer slot (empilhamento até ${MAX_UNITS_PER_SLOT}x).`;
      }
      return `[${selectedHandCard.name}]: Clique em Lançar ou escolha a carta-alvo no tabuleiro.`;
    }
    return `Seu Turno: Canalize 1 carta [C], invoque Criaturas/Relíquias, lance Feitiços, ataque com suas criaturas prontas e pressione [ESPAÇO] para Passar o Turno!`;
  };

  const renderAffinityCounters = (affinities: Record<Domain, number>) => {
    const domains: Exclude<Domain, 'neutral'>[] = ['red', 'blue', 'purple', 'green', 'gold'];
    const activeList = domains.filter((dom) => (affinities[dom] ?? 0) > 0);
    if (activeList.length === 0) {
      return <span className="affinity-empty-tag">Sem afinidade ativa</span>;
    }
    return (
      <div className="affinity-counters">
        {activeList.map((dom) => {
          const val = affinities[dom] ?? 0;
          const meta = DOMAIN_META[dom];
          const isMax = val >= 6;
          return (
            <span
              key={dom}
              className={`affinity-badge domain-${dom} ${isMax ? 'is-max-affinity' : ''}`}
              style={{ borderColor: meta.color }}
              title={`Afinidade ${meta.name}: ${val}/6`}
            >
              <span className="affinity-icon">{meta.icon}</span>
              <span className="affinity-name">{meta.shortName}</span>
              <strong className="affinity-val">{val}</strong>
            </span>
          );
        })}
      </div>
    );
  };

  const renderTargetPreviewBadge = (targetId: string) => {
    const prev = allTargetPreviews[targetId];
    if (!prev) return null;
    const isHovered = hoveredAttackTargetId === targetId;
    const revideVal =
      prev.isSovereignTarget || prev.isRangedFreeHit || prev.breaksAttackerShield
        ? 0
        : prev.counterDamageToAttacker;
    return (
      <div
        className={`target-combat-preview-pill ${isHovered ? 'is-hovered' : ''} ${
          prev.targetDies ? 'is-lethal-hit' : ''
        } ${prev.attackerDies && !prev.attackerReborn ? 'is-risky-hit' : ''}`}
      >
        <span className="tcp-dmg-out">
          {prev.breaksTargetShield
            ? '⚔️ Quebra Escudo'
            : `⚔️ Causará ${prev.damageToTarget} dano`}
        </span>
        {!prev.isSovereignTarget && (
          <span className="tcp-dmg-in">
            {prev.breaksAttackerShield
              ? '• 🛡️ Escudo Absorve'
              : `• 🛡️ Sofrerá ${revideVal} revide`}
          </span>
        )}
        {(prev.targetDies || prev.lethalTouchTriggeredOnTarget) && (
          <span className="tcp-dmg-lethal">• ☠️ Abate Garantido</span>
        )}
        {prev.slotSplashCount > 0 && (
          <span
            className="tcp-dmg-splash"
          >
            • ÁREA ({prev.slotSplashCount + 1} no slot)
          </span>
        )}
      </div>
    );
  };

  const aiAvatarCard = CARDS_BY_ID[gameState.ai.avatarCardId] ?? ALL_CARDS[0];
  const playerAvatarCard = CARDS_BY_ID[gameState.player.avatarCardId] ?? ALL_CARDS[0];

  const canDeployCreature =
    isPlayerTurn &&
    selectedHandCard !== null &&
    canPlaySelectedHandCard.allowed &&
    selectedHandCard.type === 'creature';
  const canDeployRelic =
    isPlayerTurn &&
    selectedHandCard !== null &&
    canPlaySelectedHandCard.allowed &&
    selectedHandCard.type === 'relic';
  const canDeployTrap =
    isPlayerTurn &&
    selectedHandCard !== null &&
    canPlaySelectedHandCard.allowed &&
    selectedHandCard.type === 'reaction';

  const isSpellTargetingEnemy =
    isPlayerTurn &&
    selectedHandCard !== null &&
    canPlaySelectedHandCard.allowed &&
    (selectedHandCard.type === 'spell' || selectedHandCard.type === 'reaction') &&
    doesCardUseTarget(selectedHandCard) === 'enemy';

  const isSpellTargetingAlly =
    isPlayerTurn &&
    selectedHandCard !== null &&
    canPlaySelectedHandCard.allowed &&
    (selectedHandCard.type === 'spell' || selectedHandCard.type === 'reaction') &&
    doesCardUseTarget(selectedHandCard) === 'ally';

  const hasEmptyVanguard = [0, 1, 2, 3, 4, 5].some((i) =>
    canDeployToSlot(gameState.player, 'vanguard', i)
  );
  const hasEmptyRearguard = [0, 1, 2, 3, 4, 5].some((i) =>
    canDeployToSlot(gameState.player, 'rearguard', i)
  );

  return (
    <div className={`arena-wrapper ${showLogSidebar ? '' : 'log-collapsed'}`}>
      {/* CINEMATIC FLOATING MULLIGAN HUD (7 Cards in a Panoramic Arc Over the Battlefield!) */}
      {isMulliganOpen && gameState.turn === 1 && gameState.phase !== 'gameover' && (
        <div className="mulligan-modal-backdrop">
          <div className="mulligan-modal-panel">
            <div className="mulligan-header">
              <div className="mulligan-herald-crest">❖ PREPARAÇÃO DE BATALHA • ESCALA GUERRA TOTAL ❖</div>
              <div className="mulligan-title">ESCOLHA SUA MÃO INICIAL</div>
              <div className="mulligan-subtitle">
                Turno 1: <span className="mulligan-stat-pill">⚡ 3 Essência</span>{' '}
                <span className="mulligan-stat-pill">❤️ 40 Vida</span>{' '}
                <span className="mulligan-stat-pill">🃏 7 Cartas</span> — Clique nas cartas que deseja{' '}
                <strong>substituir no Grimório</strong> antes do combate começar.
              </div>
            </div>

            <div className="mulligan-cards-row">
              {gameState.player.hand.map((card, idx) => {
                const isMarkedForSwap = mulliganSwapIndices.includes(idx);
                const total = gameState.player.hand.length;
                const mid = (total - 1) / 2;
                const offset = idx - mid;
                const arcAngle = offset * 1.6;
                const arcY = Math.abs(offset) * Math.abs(offset) * 2.2;

                return (
                  <div
                    key={`mulligan-${card.id}-${idx}`}
                    className={`mulligan-card-slot ${isMarkedForSwap ? 'is-marked-swap' : ''}`}
                    style={
                      {
                        '--arc-angle': `${arcAngle}deg`,
                        '--arc-y': `${arcY}px`,
                      } as React.CSSProperties
                    }
                    onClick={() => toggleMulliganCard(idx)}
                  >
                    <div className="mulligan-card-inner">
                      <CardView
                        card={card}
                        mode="gallery"
                        onClick={() => toggleMulliganCard(idx)}
                      />
                      {isMarkedForSwap && (
                        <div className="mulligan-swap-slash-overlay">
                          <span className="swap-slash-icon">🔄</span>
                          <span className="swap-slash-text">SUBSTITUIR</span>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      className={`mulligan-swap-badge ${isMarkedForSwap ? 'swap' : 'keep'}`}
                    >
                      {isMarkedForSwap ? '🔄 TROCAR' : '✓ MANTER'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mulligan-actions-row">
              <button
                type="button"
                className="mulligan-confirm-btn"
                onClick={handleConfirmMulligan}
              >
                <span className="mulligan-btn-gem">⚔️</span>
                <span>
                  {mulliganSwapIndices.length === 0
                    ? 'Confirmar Mão Inicial & Iniciar Batalha'
                    : `Trocar ${mulliganSwapIndices.length} Carta(s) & Iniciar Batalha`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIVE SVG AIMING TRAJECTORY TETHER & ROTATING CROSSHAIR RETICLE */}
      {(() => {
        let sourceId: string | null = null;
        let destId: string | null = null;
        let domainColor = '#fbbf24';
        let isLethalAim = false;

        if (selectedAttackerId) {
          sourceId = selectedAttackerId;
          destId =
            hoveredAttackTargetId ??
            (validAttackTargets.includes('ai-sovereign')
              ? 'ai-sovereign'
              : validAttackTargets[0] ?? null);
          const attUnit = getAllBoardUnits(gameState.player).find(
            (u) => u.instanceId === selectedAttackerId
          );
          if (attUnit) {
            domainColor = DOMAIN_META[attUnit.card.domain]?.color ?? '#fbbf24';
          }
          if (destId && allTargetPreviews[destId]?.targetDies) {
            isLethalAim = true;
          }
        } else if (
          (isSpellTargetingEnemy || isSpellTargetingAlly) &&
          selectedHandCard &&
          hoveredCardInfo?.unit
        ) {
          sourceId = 'player-sovereign';
          destId = hoveredCardInfo.unit.instanceId;
          domainColor = DOMAIN_META[selectedHandCard.domain]?.color ?? '#38bdf8';
        }

        if (!sourceId || !destId) return null;
        const srcEl = document.querySelector(`[data-combat-id="${sourceId}"]`) as HTMLElement | null;
        const dstEl = document.querySelector(`[data-combat-id="${destId}"]`) as HTMLElement | null;
        if (!srcEl || !dstEl) return null;

        const sr = srcEl.getBoundingClientRect();
        const dr = dstEl.getBoundingClientRect();
        const sx = Math.round(sr.left + sr.width / 2);
        const sy = Math.round(sr.top + sr.height / 2);
        const dx = Math.round(dr.left + dr.width / 2);
        const dy = Math.round(dr.top + dr.height / 2);
        const mx = Math.round((sx + dx) / 2);
        const my = Math.round(Math.min(sy, dy) - 65);

        return (
          <svg className="aiming-trajectory-overlay" aria-hidden="true">
            <defs>
              <linearGradient id="aimTetherGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={domainColor} stopOpacity="0.35" />
                <stop offset="60%" stopColor={domainColor} stopOpacity="0.95" />
                <stop offset="100%" stopColor={isLethalAim ? '#ef4444' : '#fef08a'} stopOpacity="1" />
              </linearGradient>
            </defs>
            <path
              d={`M ${sx} ${sy} Q ${mx} ${my} ${dx} ${dy}`}
              fill="none"
              stroke="rgba(0,0,0,0.65)"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d={`M ${sx} ${sy} Q ${mx} ${my} ${dx} ${dy}`}
              fill="none"
              stroke="url(#aimTetherGrad)"
              strokeWidth="4"
              strokeDasharray="12 8"
              strokeLinecap="round"
              className="aim-tether-animated-path"
            />
            <circle cx={sx} cy={sy} r="7" fill={domainColor} opacity="0.85" />
            <g transform={`translate(${dx}, ${dy})`} className="aim-reticle-group">
              <circle
                r="28"
                fill="none"
                stroke={isLethalAim ? '#ef4444' : domainColor}
                strokeWidth="2.5"
                strokeDasharray="10 6"
                className="aim-reticle-spin"
              />
              <circle
                r="16"
                fill={isLethalAim ? 'rgba(239, 68, 68, 0.22)' : 'rgba(250, 204, 21, 0.16)'}
                stroke="#fef08a"
                strokeWidth="1.5"
              />
            </g>
          </svg>
        );
      })()}

      {/* DIRECTIONAL ELEMENTAL PROJECTILE & RANGED BEAM OVERLAY */}
      {combatAnim && combatAnim.isRanged && (
        <div
          className={`combat-projectile-beam domain-${combatAnim.domain}`}
          style={
            {
              left: `${combatAnim.startX}px`,
              top: `${combatAnim.startY}px`,
              width: `${combatAnim.distancePx}px`,
              transform: `rotate(${combatAnim.angleDeg}deg)`,
            } as React.CSSProperties
          }
        >
          <div className="projectile-energy-wake" />
          <div className="projectile-missile-head">
            <span className="projectile-missile-glyph">
              {combatAnim.domain === 'red'
                ? '☄️'
                : combatAnim.domain === 'blue'
                ? '⚡'
                : combatAnim.domain === 'purple'
                ? '💀'
                : combatAnim.domain === 'green'
                ? '🏹'
                : '✦'}
            </span>
          </div>
        </div>
      )}

      {/* VISCERAL COMBAT IMPACT SLASH, DUAL SHOCKWAVE & 12-PARTICLE SHATTER OVERLAY */}
      {combatAnim && (
        <div
          className={`combat-impact-fx domain-${combatAnim.domain} ${
            combatAnim.isRanged ? 'is-ranged-shot' : 'is-melee-slam'
          } ${combatAnim.isHeavyHit ? 'is-heavy-impact' : ''}`}
          style={{
            left: `${combatAnim.impactX}px`,
            top: `${combatAnim.impactY}px`,
          }}
        >
          <div className="impact-shockwave-ring" />
          <div className="impact-shockwave-ring secondary-ring" />
          <div className="impact-slash-cross" />
          <div className="impact-particles-ring">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((pIdx) => (
              <span
                key={pIdx}
                className="impact-particle-spark"
                style={
                  {
                    '--p-angle': `${pIdx * 30}deg`,
                    '--p-dist': `${pIdx % 2 === 0 ? 78 : 56}px`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
          <span className="impact-burst-icon">
            {combatAnim.isRanged ? '🏹💥' : combatAnim.isHeavyHit ? '⚔️🔥' : '⚔️💥'}
          </span>
        </div>
      )}

      {/* CINEMATIC SPELL, DRAGON BREATH, LEGENDARY ENTRANCE, SOVEREIGN POWER & ASCENSION OVERLAY */}
      {spectacleFx && (
        <>
          {/* Herald Banner at Top-Center of Battlefield */}
          <div
            className={`spectacle-herald-banner kind-${spectacleFx.kind} domain-${spectacleFx.domain}`}
          >
            <div className="spectacle-herald-art">
              {spectacleFx.card.imagePath ? (
                <img src={`${spectacleFx.card.imagePath}?v=5`} alt={spectacleFx.card.name} />
              ) : (
                <span>{DOMAIN_META[spectacleFx.domain]?.icon}</span>
              )}
            </div>
            <div className="spectacle-herald-text">
              <div className="spectacle-herald-title">{spectacleFx.title}</div>
              <div className="spectacle-herald-sub">{spectacleFx.subtitle}</div>
            </div>
          </div>

          {/* Directional Spell Projectile Beam from Sovereign Caster to Target */}
          {spectacleFx.kind === 'spell' &&
            spectacleFx.distancePx &&
            spectacleFx.distancePx > 30 && (
              <div
                className={`combat-projectile-beam spell-projectile-beam domain-${spectacleFx.domain}`}
                style={
                  {
                    left: `${spectacleFx.startX ?? window.innerWidth / 2}px`,
                    top: `${spectacleFx.startY ?? window.innerHeight - 90}px`,
                    width: `${spectacleFx.distancePx}px`,
                    transform: `rotate(${spectacleFx.angleDeg ?? -90}deg)`,
                  } as React.CSSProperties
                }
              >
                <div className="projectile-energy-wake" />
                <div className="projectile-missile-head">
                  <span className="projectile-missile-glyph">
                    {DOMAIN_META[spectacleFx.domain]?.icon ?? '✨'}
                  </span>
                </div>
              </div>
            )}

          {/* Targeted Spell Rune Circle, Sovereign Shockwave, or Ascension Pillar at Exact Screen Coordinates */}
          {(spectacleFx.kind === 'spell' ||
            spectacleFx.kind === 'ascend' ||
            spectacleFx.kind === 'sovereign') && (
            <div
              className={`spectacle-target-burst kind-${spectacleFx.kind} domain-${spectacleFx.domain}`}
              style={{
                left: `${spectacleFx.targetX ?? window.innerWidth / 2}px`,
                top: `${spectacleFx.targetY ?? window.innerHeight / 2}px`,
              }}
            >
              <div className="arcane-mandala-ring outer-ring" />
              <div className="arcane-mandala-ring inner-ring" />
              {(spectacleFx.kind === 'ascend' || spectacleFx.kind === 'sovereign') && (
                <div className="ascension-light-pillar" />
              )}
              <div className="impact-particles-ring">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((pIdx) => (
                  <span
                    key={pIdx}
                    className="impact-particle-spark"
                    style={
                      {
                        '--p-angle': `${pIdx * 30}deg`,
                        '--p-dist': `${pIdx % 2 === 0 ? 92 : 64}px`,
                      } as React.CSSProperties
                    }
                  />
                ))}
              </div>
              <span className="spectacle-burst-center-icon">
                {spectacleFx.kind === 'ascend'
                  ? '🔥★'
                  : spectacleFx.kind === 'sovereign'
                  ? '👑⚡'
                  : DOMAIN_META[spectacleFx.domain]?.icon ?? '✨'}
              </span>
            </div>
          )}

          {/* Legendary Golden Screen-Shake & Pillar Flash */}
          {spectacleFx.kind === 'legendary' && (
            <div className={`legendary-entrance-backdrop domain-${spectacleFx.domain}`}>
              <div className="legendary-rays-burst" />
            </div>
          )}
        </>
      )}

      {/* TACTICAL COMBAT PREVIEW HUD (Floating Damage & Counter-Attack Forecast When Aiming!) */}
      {combatPreview && (
        <div
          className={`tactical-combat-preview-hud ${
            combatPreview.targetDies ? 'preview-lethal' : ''
          } ${combatPreview.attackerDies && !combatPreview.attackerReborn ? 'preview-mutual-risk' : ''}`}
        >
          <div className="tcp-hud-header">
            <span className="tcp-hud-kicker">PREVISÃO TÁTICA DE COMBATE</span>
            <span className="tcp-hud-matchup">
              <strong>{combatPreview.attackerName}</strong> ➔{' '}
              <strong>{combatPreview.targetName}</strong>
            </span>
          </div>

          <div className="tcp-hud-columns">
            {/* Left Column: Damage Dealt to Target */}
            <div className="tcp-hud-col tcp-col-attack">
              <div className="tcp-col-label">IMPACTO NO ALVO</div>
              <div className="tcp-col-value">
                {combatPreview.breaksTargetShield ? (
                  <span className="tcp-tag-shield">Quebra Escudo Divino (0 PV)</span>
                ) : combatPreview.lethalTouchTriggeredOnTarget ? (
                  <span className="tcp-tag-lethal">Toque Letal (-{combatPreview.damageToTarget} PV)</span>
                ) : (
                  <span className="tcp-dmg-number">-{combatPreview.damageToTarget} PV</span>
                )}
                <span className="tcp-hp-transition">
                  ({combatPreview.targetHpBefore} → {combatPreview.targetHpAfter} PV)
                </span>
              </div>
              <div className="tcp-outcome-badges">
                {combatPreview.targetDies ? (
                  combatPreview.targetReborn ? (
                    <span className="tcp-badge badge-warn">Alvo Renasce com 1 PV</span>
                  ) : (
                    <span className="tcp-badge badge-kill">
                      {combatPreview.isSovereignTarget ? 'VITÓRIA LETAL' : 'ABATE CONFIRMADO'}
                    </span>
                  )
                ) : (
                  <span className="tcp-badge badge-neutral">
                    Alvo sobrevive ({combatPreview.targetHpAfter} PV)
                  </span>
                )}
                {combatPreview.slotSplashCount > 0 && (
                  <span className="tcp-badge badge-trample">
                    ATAQUE DE ÁREA NO SLOT: Atinge +{combatPreview.slotSplashCount} carta(s) empilhada(s) (-{combatPreview.slotSplashDamage} PV)
                  </span>
                )}
                {combatPreview.trampleExcessDamage > 0 && (
                  <span className="tcp-badge badge-trample">
                    +{combatPreview.trampleExcessDamage} Atropelar no Soberano
                  </span>
                )}
                {combatPreview.lifestealHealForAttacker > 0 && (
                  <span className="tcp-badge badge-heal">
                    Dreno: +{combatPreview.lifestealHealForAttacker} PV ao Soberano
                  </span>
                )}
                {combatPreview.furiaCrescenteGainTarget > 0 && (
                  <span className="tcp-badge badge-warn">
                    Alvo ganha +{combatPreview.furiaCrescenteGainTarget} ATQ (Fúria)
                  </span>
                )}
              </div>
            </div>

            {/* Right Column: Counter-Attack & Attacker Survival */}
            <div className="tcp-hud-col tcp-col-counter">
              <div className="tcp-col-label">REVIDE & SOBREVIVÊNCIA</div>
              <div className="tcp-col-value">
                {combatPreview.isSovereignTarget ? (
                  <span className="tcp-tag-safe">Ataque Direto (0 Revide)</span>
                ) : combatPreview.isRangedFreeHit ? (
                  <span className="tcp-tag-safe">Disparo à Distância (0 Revide)</span>
                ) : combatPreview.breaksAttackerShield ? (
                  <span className="tcp-tag-shield">Escudo Divino absorve</span>
                ) : combatPreview.lethalTouchTriggeredOnAttacker ? (
                  <span className="tcp-tag-danger">Revide com Toque Letal</span>
                ) : (
                  <>
                    <span className="tcp-counter-number">
                      -{combatPreview.counterDamageToAttacker} PV
                    </span>
                    <span className="tcp-hp-transition">
                      ({combatPreview.attackerHpBefore} → {combatPreview.attackerHpAfter} PV)
                    </span>
                  </>
                )}
              </div>
              <div className="tcp-outcome-badges">
                {!combatPreview.attackerDies ? (
                  <span className="tcp-badge badge-safe">
                    Atacante sobrevive ({combatPreview.attackerHpAfter} PV)
                  </span>
                ) : combatPreview.attackerReborn ? (
                  <span className="tcp-badge badge-heal">
                    Atacante Renasce com 1 PV
                  </span>
                ) : (
                  <span className="tcp-badge badge-danger">
                    {combatPreview.targetDies ? 'Troca Mútua (Ambos Tombam)' : 'Atacante Tombado'}
                  </span>
                )}
                {combatPreview.furiaCrescenteGainAttacker > 0 && (
                  <span className="tcp-badge badge-buff">
                    Ganha +{combatPreview.furiaCrescenteGainAttacker} ATQ (Fúria Crescente)
                  </span>
                )}
                {combatPreview.incandescentSkinDamage > 0 && (
                  <span className="tcp-badge badge-warn">
                    Inclui -1 PV de Pele Incandescente
                  </span>
                )}
                {combatPreview.hasEnemyTrapRisk && (
                  <span className="tcp-badge badge-danger">
                    Alerta: Emboscada Armada na Retaguarda
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING HOVER CARD ZOOM PANEL */}
      {hoveredCardInfo && (
        <div className="mtg-hover-zoom-panel">
          <CardView
            card={hoveredCardInfo.card}
            unit={hoveredCardInfo.unit}
            mode="inspect"
          />
          {hoveredCardInfo.unit && (
            <div className="mtg-hover-unit-status">
              <div style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: '2px' }}>
                Posição: {hoveredCardInfo.unit.row === 'vanguard' ? 'Vanguarda (Frente)' : 'Retaguarda (Suporte)'} • Coluna {hoveredCardInfo.unit.slotIndex + 1}
              </div>
              {hoveredCardInfo.unit.invasionAtkBonus ? (
                <div style={{ color: '#fdba74' }}>• Invasão de Território: +1 ATQ ativo</div>
              ) : null}
              {hoveredCardInfo.unit.formationAtkBonus ? (
                <div style={{ color: '#fef08a' }}>• Cobertura de Coluna: +1 ATQ ativo</div>
              ) : null}
              {hoveredCardInfo.unit.formationArmorBonus ? (
                <div style={{ color: '#fde68a' }}>• Formação em Falange: +1 Armadura ativa</div>
              ) : null}
              {hoveredCardInfo.card.ascension && !hoveredCardInfo.unit.isAscended && (
                <div style={{ color: '#fbbf24', marginTop: '3px' }}>
                  • Ascensão ({hoveredCardInfo.card.ascension.cost} Essência): Evolui para{' '}
                  <strong>{hoveredCardInfo.card.ascension.newName}</strong> (
                  {hoveredCardInfo.card.ascension.newAtk}/{hoveredCardInfo.card.ascension.newMaxHp})
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div
        className={`arena-main-column mtg-arena-table ${
          arenaShake ? `arena-shake-${arenaShake}` : ''
        }`}
      >
        {/* =========================================================
            FULL-SCREEN BATTLEFIELD STAGE (100% VIEWPORT) +
            AUTO-COLLAPSIBLE SYMMETRIC EDGE DRAWERS
            ========================================================= */}
        {(() => {
          const isAimingAnyTarget =
            selectedAttackerId !== null || isSpellTargetingEnemy || isSpellTargetingAlly;

          const aiDomExpCheck = canInvokeDomainExpansion(gameState, 'ai');
          const canPwr = canUseSovereignPower(gameState, 'player');
          const canBlood = canUseBloodPact(gameState, 'player');
          const domExpCheck = canInvokeDomainExpansion(gameState, 'player');
          const simpleDomCheck = canUseSimpleDomain(gameState, 'player');
          const canSacBreak = canBreakDomainExpansionWithSacrifice(gameState, 'player');
          const isAiSovereignTarget = validAttackTargets.includes('ai-sovereign');

          return (
            <div className="arena-fullscreen-stage">
              {/* =====================================================
                  1. TOP-CENTER SYMMETRIC P2 PILL (OPPONENT / SOVEREIGN 2)
                  One sleek flush pill at the top center; expands P2 details on hover/click.
                  ===================================================== */}
              <header
                className={`hud-unified-top-bar ${
                  isP2DrawerPinned || isAiSovereignTarget ? 'is-pinned-open' : ''
                }`}
              >
                <div
                  data-combat-id="ai-sovereign"
                  className={`hud-top-pill ${
                    isAiSovereignTarget ? 'is-valid-attack-target' : ''
                  } ${combatAnim?.targetId === 'ai-sovereign' ? 'is-hit-target' : ''}`}
                  onClick={handleClickAiSovereign}
                  onMouseEnter={() => {
                    if (selectedAttackerId && isAiSovereignTarget) {
                      setHoveredAttackTargetId('ai-sovereign');
                    }
                  }}
                  onMouseLeave={() =>
                    setHoveredAttackTargetId((prev) => (prev === 'ai-sovereign' ? null : prev))
                  }
                >
                  {feedbackMap['ai-sovereign'] && (
                    <div
                      className={`floating-feedback-pill color-${feedbackMap['ai-sovereign'].color}`}
                    >
                      {feedbackMap['ai-sovereign'].text}
                    </div>
                  )}

                  <div className="hud-mini-avatar opponent">
                    {aiAvatarCard?.imagePath ? (
                      <img src={aiAvatarCard.imagePath} alt={gameState.ai.name} />
                    ) : (
                      <span>⚔️</span>
                    )}
                  </div>

                  <span className="hud-pill-name">{gameState.ai.name}</span>
                  <span className="hud-pill-stat hp">❤️ {gameState.ai.hp}</span>
                  <span className="hud-pill-stat mana">
                    ⚡ {gameState.ai.currentEssence}/{gameState.ai.maxEssence}
                  </span>
                  <span className="hud-pill-stat hand">
                    🃏 {gameState.ai.hand.length}
                  </span>
                  <span className="hud-pill-stat deck">
                    📚 {gameState.ai.deck.length} • 🪦 {gameState.ai.crypt.length}
                  </span>

                  {gameState.weather && (
                    <span
                      className="hud-pill-env-chip"
                    >
                      {gameState.weather.icon} {gameState.weather.turnsRemaining}t
                    </span>
                  )}
                  {gameState.domainExpansion && (
                    <span
                      className="hud-pill-env-chip domain"
                    >
                      ⛩️ {gameState.domainExpansion.turnsRemaining}r
                    </span>
                  )}

                  <button
                    type="button"
                    className={`hud-pill-expand-btn ${isP2DrawerPinned ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsP2DrawerPinned((prev) => !prev);
                    }}
                  >
                    {isP2DrawerPinned ? '▴' : '▾'}
                  </button>

                  {isAiSovereignTarget && (
                    <div className="attack-sovereign-cta">
                      ⚔️ ATACAR SOBERANO
                      {allTargetPreviews['ai-sovereign']
                        ? ` (-${allTargetPreviews['ai-sovereign'].damageToTarget} PV${
                            allTargetPreviews['ai-sovereign'].targetDies ? ' • LETAL' : ''
                          })`
                        : ''}
                    </div>
                  )}
                </div>

                {/* Auto-Hidden Dropdown Panel for Sovereign 2 + Active Environment */}
                <div className="hud-top-dropdown">
                  <div className="hud-dropdown-row">
                    {/* Left Card: Channeled Lands, Elemental Affinities & Crypt */}
                    <div className="hud-dropdown-section hud-drawer-card">
                      <div className="hud-drawer-card-header">
                        <span className="hud-sec-label">
                          ⛰️ TERRENOS RIVAIS ({gameState.ai.channeledCards.length})
                        </span>
                        <button
                          type="button"
                          className="hud-inline-btn crypt-btn"
                          onClick={() => setCryptModalOwner('ai')}
                        >
                          🪦 Cripta ({gameState.ai.crypt.length})
                        </button>
                      </div>

                      <div className="hud-lands-showcase">
                        {gameState.ai.channeledCards.length === 0 ? (
                          <div className="hud-empty-lands-banner">
                            <span className="empty-lands-glyph">⛰️</span>
                            <span>Nenhum terreno canalizado pelo oponente</span>
                          </div>
                        ) : (
                          <div className="mtg-lands-stack">
                            {gameState.ai.channeledCards.slice(-6).map((c, i) => (
                              <div
                                key={`ai-land-${i}`}
                                className={`mtg-land-card domain-${c.domain}`}
                                style={{ marginLeft: i === 0 ? 0 : '-10px', zIndex: i + 1 }}
                                onMouseEnter={() => handleHoverCard(c)}
                                onMouseLeave={() => handleHoverCard(null)}
                                title={c.name}
                              >
                                {c.imagePath ? <img src={c.imagePath} alt={c.name} /> : null}
                                <span className="mtg-land-domain-pip">
                                  {DOMAIN_META[c.domain]?.icon}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="hud-affinities-footer">
                        <span className="hud-aff-kicker">AFINIDADES:</span>
                        {renderAffinityCounters(gameState.ai.affinities)}
                      </div>
                    </div>

                    {/* Right Card: Domain Expansion Sanctuary & 6-Pip Progress */}
                    <div className="hud-dropdown-section hud-drawer-card">
                      {(() => {
                        const spec = getDomainExpansionSpec(aiDomExpCheck.domain);
                        const aff = Math.min(6, aiDomExpCheck.affinity);
                        const isReady = aiDomExpCheck.affinity >= 6;
                        return (
                          <>
                            <div className="hud-drawer-card-header">
                              <span className="hud-sec-label">⛩️ EXPANSÃO DE DOMÍNIO</span>
                              <span
                                className={`hud-domain-status-chip domain-${spec.domain} ${
                                  isReady ? 'is-ready' : ''
                                }`}
                              >
                                {aiDomExpCheck.affinity}/6 AFINIDADE • 3⚡
                              </span>
                            </div>

                            <div className="hud-domain-pips-track" aria-hidden="true">
                              {[1, 2, 3, 4, 5, 6].map((pip) => (
                                <span
                                  key={pip}
                                  className={`hud-domain-pip domain-${spec.domain} ${
                                    pip <= aff ? 'is-filled' : ''
                                  }`}
                                />
                              ))}
                            </div>

                            <div
                              className={`hud-sanctuary-card domain-${spec.domain} ${
                                isReady ? 'is-ready' : 'is-locked'
                              }`}
                            >
                              <div className="hud-sanctuary-emblem">{spec.icon}</div>
                              <div className="hud-sanctuary-body">
                                <div className="hud-sanctuary-title">{spec.name}</div>
                                <div className="hud-sanctuary-desc">{spec.potencyDesc}</div>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {gameState.domainExpansion && (
                    <div className="hud-dropdown-env-row">
                      <div className="hud-env-inline-box domain">
                        <strong>
                          {gameState.domainExpansion.icon} {gameState.domainExpansion.name} (
                          {gameState.domainExpansion.turnsRemaining}r):
                        </strong>{' '}
                        <span>
                          {gameState.domainExpansion.potencyDesc} •{' '}
                          {gameState.domainExpansion.sureHitDesc} (Conc:{' '}
                          {gameState.domainExpansion.damageTakenByOwnerThisRound}/8)
                        </span>
                        {gameState.domainExpansion.owner === 'ai' && isPlayerTurn && (
                          <span className="hud-env-inline-actions">
                            {simpleDomCheck && (
                              <button
                                type="button"
                                className="hud-inline-btn"
                                onClick={handleActivateSimpleDomain}
                              >
                                💠 Domínio Simples (2⚡)
                              </button>
                            )}
                            {canSacBreak && (
                              <button
                                type="button"
                                className="hud-inline-btn danger"
                                onClick={handleOpenSacrificeBreakModal}
                              >
                                💥 Romper (10❤️)
                              </button>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </header>

              {/* =====================================================
                  2. TABULEIRO 6×4 EM TELA CHEIA (MESA DE MADEIRA + EXPANSÃO DE DOMÍNIO!)
                  ===================================================== */}
              <div
                className={`mtg-battlefield-surface wooden-tabletop-surface ${
                  gameState.domainExpansion
                    ? `has-domain-tabletop domain-tabletop-${gameState.domainExpansion.domain}`
                    : ''
                } ${isAimingAnyTarget ? 'is-aiming-target' : ''} ${
                  gameState.weather ? `has-arena-weather weather-${gameState.weather.type}` : ''
                }`}
              >
                {/* WOODEN TABLETOP & FULL-BOARD DOMAIN EXPANSION TRANSFORMATION LAYER */}
                <div className="tabletop-stone-engraving tabletop-wood-and-domain-layer" aria-hidden="true">
                  <div className="tabletop-wood-base-img" />

                  {/* 1. SINGLE ACTIVE DOMAIN EXPANSION (Full Table Takeover) */}
                  {gameState.domainExpansion && !gameState.domainExpansion.clashRival && (
                    <div
                      key={`domain-tabletop-${gameState.domainExpansion.domain}-${gameState.domainExpansion.owner}`}
                      className={`tabletop-domain-takeover-img domain-${gameState.domainExpansion.domain}`}
                    >
                      <div
                        className={`tabletop-domain-flow-fx domain-${gameState.domainExpansion.domain}`}
                      />
                    </div>
                  )}

                  {/* 2. DOMAIN CLASH: TWO DOMAINS FIGHTING (50/50 Split Table + Crackling Fault-Line Seam) */}
                  {gameState.domainExpansion && gameState.domainExpansion.clashRival && (() => {
                    const exp = gameState.domainExpansion;
                    const rival = exp.clashRival!;
                    const topDom = exp.owner === 'ai' ? exp : rival;
                    const bottomDom = exp.owner === 'player' ? exp : rival;
                    return (
                      <div
                        key={`domain-clash-${topDom.domain}-${bottomDom.domain}`}
                        className="tabletop-domain-clash-stage"
                      >
                        <div className={`tabletop-domain-clash-half top-half domain-${topDom.domain}`}>
                          <div className={`tabletop-domain-flow-fx domain-${topDom.domain}`} />
                          <div className="clash-half-domain-tag top-tag">
                            {topDom.icon} {topDom.name}
                          </div>
                        </div>

                        <div className={`tabletop-domain-clash-half bottom-half domain-${bottomDom.domain}`}>
                          <div className={`tabletop-domain-flow-fx domain-${bottomDom.domain}`} />
                          <div className="clash-half-domain-tag bottom-tag">
                            {bottomDom.icon} {bottomDom.name}
                          </div>
                        </div>

                        <div className="tabletop-domain-clash-faultline">
                          <div className="clash-faultline-core-beam" />
                          <div className="clash-faultline-sparks" />
                          <div className="clash-faultline-badge">
                            ⚡⛩️ DISPUTA DE DOMÍNIOS • ACERTO GARANTIDO ANULADO ⚡
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* 3. NATURAL EXPIRATION ANIMATION (Smooth Radial Retraction Back to Wooden Table) */}
                  {domainExitAnim && domainExitAnim.mode === 'expire' && (
                    <div
                      key={`domain-expire-${domainExitAnim.domain}`}
                      className={`tabletop-domain-expire-layer domain-${domainExitAnim.domain}`}
                    >
                      <div className={`tabletop-domain-flow-fx domain-${domainExitAnim.domain}`} />
                      <div className="domain-expire-retract-ring" />
                      <div className="domain-exit-status-banner expire-banner">
                        {domainExitAnim.reasonText}
                      </div>
                    </div>
                  )}

                  {/* 4. DESTRUCTION / SHATTER ANIMATION (8 Polygonal Barrier Shards + Fracture Flash) */}
                  {domainExitAnim && domainExitAnim.mode === 'shatter' && (
                    <div
                      key={`domain-shatter-${domainExitAnim.domain}`}
                      className={`tabletop-domain-shatter-layer domain-${domainExitAnim.domain}`}
                    >
                      <div className="domain-shatter-impact-flash" />
                      <div className="domain-shatter-fracture-web" />
                      {[0, 1, 2, 3, 4, 5, 6, 7].map((shardIdx) => (
                        <div
                          key={shardIdx}
                          className={`domain-shatter-shard shard-${shardIdx} domain-${domainExitAnim.domain}`}
                        />
                      ))}
                      <div className="domain-exit-status-banner shatter-banner">
                        {domainExitAnim.reasonText}
                      </div>
                    </div>
                  )}

                  <div className="tabletop-center-frontier-seam" />
                </div>

                {/* AMBIENT WEATHER PARTICLES (Non-blocking visual atmosphere) */}
                {gameState.weather && (
                  <div
                    className={`arena-weather-atmosphere weather-${gameState.weather.type}`}
                    aria-hidden="true"
                  >
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((idx) => (
                      <span
                        key={idx}
                        className="weather-ambient-mote"
                        style={
                          {
                            '--mote-left': `${6 + idx * 6.8}%`,
                            '--mote-delay': `${(idx % 5) * 0.65}s`,
                            '--mote-dur': `${3.2 + (idx % 4) * 0.7}s`,
                          } as React.CSSProperties
                        }
                      />
                    ))}
                  </div>
                )}

                {/* 1ª Fileira (Topo): AI Rearguard */}
                <div className="mtg-board-lane rearguard-lane ai-rearguard-lane">
                  {spectacleFx?.kind === 'breath' && spectacleFx.targetLaneId === 'ai-rearguard' && (
                    <div className={`dragon-breath-wave-fx domain-${spectacleFx.domain}`} />
                  )}
                  <div className="mtg-lane-slots">
                    {[0, 1, 2, 3, 4, 5].map((idx) => {
                      const slotUnits = getSlotUnits(gameState.ai, 'rearguard', idx);
                      return (
                        <div
                          key={`ai-rear-${idx}`}
                          className={`mtg-slot ${slotUnits.length > 1 ? 'has-stacked-units' : ''}`}
                        >
                          {slotUnits.length > 1 && (
                            <span
                              className="slot-stack-count-badge enemy-stack-badge"
                            >
                              {slotUnits.length}/{MAX_UNITS_PER_SLOT}
                            </span>
                          )}
                          <div className="slot-card-stack">
                            {slotUnits.map((unit, sIdx) => {
                              const isValidTarget =
                                validAttackTargets.includes(unit.instanceId) || isSpellTargetingEnemy;
                              const isLunging = combatAnim?.attackerId === unit.instanceId;
                              const isHit = combatAnim?.targetId === unit.instanceId;
                              return (
                                <div
                                  key={unit.instanceId}
                                  data-combat-id={unit.instanceId}
                                  className={`organic-tabletop-card stacked-card-item ${
                                    isLunging ? 'is-lunging-attacker' : ''
                                  } ${isHit ? 'is-hit-target' : ''}`}
                                  style={{
                                    ...getOrganicTabletopPose(
                                      unit.instanceId,
                                      'ai',
                                      'rearguard',
                                      idx,
                                      unit.hasAttackedThisTurn,
                                      false,
                                      false,
                                      sIdx,
                                      slotUnits.length
                                    ),
                                    ...(isLunging && combatAnim
                                      ? ({
                                          '--lunge-x': `${combatAnim.lungeX}px`,
                                          '--lunge-y': `${combatAnim.lungeY}px`,
                                        } as React.CSSProperties)
                                      : {}),
                                  }}
                                  onMouseEnter={() => {
                                    if (
                                      selectedAttackerId &&
                                      validAttackTargets.includes(unit.instanceId)
                                    ) {
                                      setHoveredAttackTargetId(unit.instanceId);
                                    }
                                  }}
                                  onMouseLeave={() =>
                                    setHoveredAttackTargetId((prev) =>
                                      prev === unit.instanceId ? null : prev
                                    )
                                  }
                                >
                                  {renderTargetPreviewBadge(unit.instanceId)}
                                  <CardView
                                    card={unit.card}
                                    unit={unit}
                                    mode="board"
                                    isValidTarget={isValidTarget}
                                    feedback={feedbackMap[unit.instanceId]}
                                    onClick={() => handleClickEnemyUnit(unit)}
                                    onInspect={setInspectCard}
                                    onHoverCard={handleHoverCard}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2ª Fileira: Player Vanguard */}
                <div className="mtg-board-lane vanguard-lane player-vanguard-in-enemy-field">
                  {spectacleFx?.kind === 'breath' &&
                    spectacleFx.targetLaneId === 'player-vanguard' && (
                      <div className={`dragon-breath-wave-fx domain-${spectacleFx.domain}`} />
                    )}
                  <div className="mtg-lane-slots">
                    {[0, 1, 2, 3, 4, 5].map((idx) => {
                      const slotUnits = getSlotUnits(gameState.player, 'vanguard', idx);
                      const aiRearUnits = getSlotUnits(gameState.ai, 'rearguard', idx);
                      const canStackHere =
                        canDeployCreature && canDeployToSlot(gameState.player, 'vanguard', idx);
                      const isInvading = slotUnits.length > 0 && aiRearUnits.length === 0;
                      const isClashing = slotUnits.length > 0 && aiRearUnits.length > 0;

                      return (
                        <div
                          key={`player-van-${idx}`}
                          className={`mtg-slot ${canStackHere ? 'can-deploy' : ''} ${
                            slotUnits.length > 1 ? 'has-stacked-units' : ''
                          }`}
                          onClick={() => handleSelectPlayerSlot('vanguard', idx)}
                        >
                          {slotUnits.length > 1 && (
                            <span className="slot-stack-count-badge ally-stack-badge">
                              {slotUnits.length}/{MAX_UNITS_PER_SLOT}
                            </span>
                          )}

                          {canStackHere && slotUnits.length > 0 && (
                            <button
                              type="button"
                              className="slot-stack-add-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeployToPlayerSlot('vanguard', idx);
                              }}
                            >
                              + Empilhar ({slotUnits.length + 1}/{MAX_UNITS_PER_SLOT})
                            </button>
                          )}

                          {slotUnits.length > 0 ? (
                            <div className="slot-card-stack">
                              {slotUnits.map((unit, sIdx) => {
                                const isReady =
                                  isPlayerTurn &&
                                  getValidAttackTargets(gameState, unit.instanceId).length > 0;
                                const canUnitAscend =
                                  isPlayerTurn &&
                                  canAscendUnit(gameState, 'player', unit.instanceId);
                                const canUnitMove =
                                  isPlayerTurn &&
                                  canMoveUnitRow(gameState, 'player', unit.instanceId);
                                const isLunging = combatAnim?.attackerId === unit.instanceId;
                                const isHit = combatAnim?.targetId === unit.instanceId;

                                return (
                                  <div
                                    key={unit.instanceId}
                                    data-combat-id={unit.instanceId}
                                    className={`organic-tabletop-card stacked-card-item ${
                                      isLunging ? 'is-lunging-attacker' : ''
                                    } ${isHit ? 'is-hit-target' : ''} ${
                                      isInvading ? 'is-crossing-border-player' : ''
                                    }`}
                                    style={{
                                      ...getOrganicTabletopPose(
                                        unit.instanceId,
                                        'player',
                                        'vanguard',
                                        idx,
                                        unit.hasAttackedThisTurn,
                                        isInvading,
                                        isClashing,
                                        sIdx,
                                        slotUnits.length
                                      ),
                                      ...(isLunging && combatAnim
                                        ? ({
                                            '--lunge-x': `${combatAnim.lungeX}px`,
                                            '--lunge-y': `${combatAnim.lungeY}px`,
                                          } as React.CSSProperties)
                                        : {}),
                                    }}
                                  >
                                    <CardView
                                      card={unit.card}
                                      unit={unit}
                                      mode="board"
                                      isSelected={selectedAttackerId === unit.instanceId}
                                      isReadyAttacker={isReady}
                                      isValidTarget={isSpellTargetingAlly}
                                      canAscend={canUnitAscend}
                                      canMoveRow={canUnitMove}
                                      feedback={feedbackMap[unit.instanceId]}
                                      onClick={(e) => handleClickFriendlyUnit(unit, e)}
                                      onAscendClick={() => handleAscendFriendlyUnit(unit)}
                                      onMoveRowClick={() => handleMoveFriendlyUnitRow(unit)}
                                      onInspect={setInspectCard}
                                      onHoverCard={handleHoverCard}
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          ) : canStackHere ? (
                            <span className="mtg-slot-watermark">+ Vanguarda (1/{MAX_UNITS_PER_SLOT})</span>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* FRONTEIRA CENTRAL DOS TERRITÓRIOS */}
                <div className="tabletop-clash-gap" />

                {/* 3ª Fileira: AI Vanguard */}
                <div className="mtg-board-lane vanguard-lane ai-vanguard-in-player-field">
                  {spectacleFx?.kind === 'breath' && spectacleFx.targetLaneId === 'ai-vanguard' && (
                    <div className={`dragon-breath-wave-fx domain-${spectacleFx.domain}`} />
                  )}
                  <div className="mtg-lane-slots">
                    {[0, 1, 2, 3, 4, 5].map((idx) => {
                      const slotUnits = getSlotUnits(gameState.ai, 'vanguard', idx);
                      const pRearUnits = getSlotUnits(gameState.player, 'rearguard', idx);
                      const isInvading = slotUnits.length > 0 && pRearUnits.length === 0;
                      const isClashing = slotUnits.length > 0 && pRearUnits.length > 0;

                      return (
                        <div
                          key={`ai-van-${idx}`}
                          className={`mtg-slot ${slotUnits.length > 1 ? 'has-stacked-units' : ''}`}
                        >
                          {slotUnits.length > 1 && (
                            <span className="slot-stack-count-badge enemy-stack-badge">
                              {slotUnits.length}/{MAX_UNITS_PER_SLOT}
                            </span>
                          )}
                          <div className="slot-card-stack">
                            {slotUnits.map((unit, sIdx) => {
                              const isValidTarget =
                                validAttackTargets.includes(unit.instanceId) || isSpellTargetingEnemy;
                              const isLunging = combatAnim?.attackerId === unit.instanceId;
                              const isHit = combatAnim?.targetId === unit.instanceId;
                              return (
                                <div
                                  key={unit.instanceId}
                                  data-combat-id={unit.instanceId}
                                  className={`organic-tabletop-card stacked-card-item ${
                                    isLunging ? 'is-lunging-attacker' : ''
                                  } ${isHit ? 'is-hit-target' : ''} ${
                                    isInvading ? 'is-crossing-border-ai' : ''
                                  }`}
                                  style={{
                                    ...getOrganicTabletopPose(
                                      unit.instanceId,
                                      'ai',
                                      'vanguard',
                                      idx,
                                      unit.hasAttackedThisTurn,
                                      isInvading,
                                      isClashing,
                                      sIdx,
                                      slotUnits.length
                                    ),
                                    ...(isLunging && combatAnim
                                      ? ({
                                          '--lunge-x': `${combatAnim.lungeX}px`,
                                          '--lunge-y': `${combatAnim.lungeY}px`,
                                        } as React.CSSProperties)
                                      : {}),
                                  }}
                                  onMouseEnter={() => {
                                    if (
                                      selectedAttackerId &&
                                      validAttackTargets.includes(unit.instanceId)
                                    ) {
                                      setHoveredAttackTargetId(unit.instanceId);
                                    }
                                  }}
                                  onMouseLeave={() =>
                                    setHoveredAttackTargetId((prev) =>
                                      prev === unit.instanceId ? null : prev
                                    )
                                  }
                                >
                                  {renderTargetPreviewBadge(unit.instanceId)}
                                  <CardView
                                    card={unit.card}
                                    unit={unit}
                                    mode="board"
                                    isValidTarget={isValidTarget}
                                    feedback={feedbackMap[unit.instanceId]}
                                    onClick={() => handleClickEnemyUnit(unit)}
                                    onInspect={setInspectCard}
                                    onHoverCard={handleHoverCard}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4ª Fileira (Base): Player Rearguard */}
                <div className="mtg-board-lane rearguard-lane player-lane">
                  {spectacleFx?.kind === 'breath' &&
                    spectacleFx.targetLaneId === 'player-rearguard' && (
                      <div className={`dragon-breath-wave-fx domain-${spectacleFx.domain}`} />
                    )}
                  <div className="mtg-lane-slots">
                    {[0, 1, 2, 3, 4, 5].map((idx) => {
                      const slotUnits = getSlotUnits(gameState.player, 'rearguard', idx);
                      const vanUnits = getSlotUnits(gameState.player, 'vanguard', idx);
                      const hasColumnCover = vanUnits.length > 0;
                      const canStackHere =
                        (canDeployCreature || canDeployRelic || canDeployTrap) &&
                        canDeployToSlot(gameState.player, 'rearguard', idx);

                      return (
                        <div
                          key={`player-rear-${idx}`}
                          className={`mtg-slot ${canStackHere ? 'can-deploy' : ''} ${
                            hasColumnCover && slotUnits.length === 0 ? 'has-column-cover' : ''
                          } ${slotUnits.length > 1 ? 'has-stacked-units' : ''}`}
                          onClick={() => handleSelectPlayerSlot('rearguard', idx)}
                        >
                          {slotUnits.length > 1 && (
                            <span
                              className="slot-stack-count-badge ally-stack-badge"
                            >
                              {slotUnits.length}/{MAX_UNITS_PER_SLOT}
                            </span>
                          )}

                          {canStackHere && slotUnits.length > 0 && (
                            <button
                              type="button"
                              className="slot-stack-add-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeployToPlayerSlot('rearguard', idx);
                              }}
                            >
                              + Empilhar ({slotUnits.length + 1}/{MAX_UNITS_PER_SLOT})
                            </button>
                          )}

                          {slotUnits.length > 0 ? (
                            <div className="slot-card-stack">
                              {slotUnits.map((unit, sIdx) => {
                                const isReady =
                                  isPlayerTurn &&
                                  getValidAttackTargets(gameState, unit.instanceId).length > 0;
                                const canUnitAscend =
                                  isPlayerTurn &&
                                  canAscendUnit(gameState, 'player', unit.instanceId);
                                const canUnitMove =
                                  isPlayerTurn &&
                                  canMoveUnitRow(gameState, 'player', unit.instanceId);
                                const isLunging = combatAnim?.attackerId === unit.instanceId;
                                const isHit = combatAnim?.targetId === unit.instanceId;

                                return (
                                  <div
                                    key={unit.instanceId}
                                    data-combat-id={unit.instanceId}
                                    className={`organic-tabletop-card stacked-card-item ${
                                      isLunging ? 'is-lunging-attacker' : ''
                                    } ${isHit ? 'is-hit-target' : ''}`}
                                    style={{
                                      ...getOrganicTabletopPose(
                                        unit.instanceId,
                                        'player',
                                        'rearguard',
                                        idx,
                                        unit.hasAttackedThisTurn,
                                        false,
                                        false,
                                        sIdx,
                                        slotUnits.length
                                      ),
                                      ...(isLunging && combatAnim
                                        ? ({
                                            '--lunge-x': `${combatAnim.lungeX}px`,
                                            '--lunge-y': `${combatAnim.lungeY}px`,
                                          } as React.CSSProperties)
                                        : {}),
                                    }}
                                  >
                                    <CardView
                                      card={unit.card}
                                      unit={unit}
                                      mode="board"
                                      isSelected={selectedAttackerId === unit.instanceId}
                                      isReadyAttacker={isReady}
                                      isValidTarget={isSpellTargetingAlly}
                                      canAscend={canUnitAscend}
                                      canMoveRow={canUnitMove}
                                      feedback={feedbackMap[unit.instanceId]}
                                      onClick={(e) => handleClickFriendlyUnit(unit, e)}
                                      onAscendClick={() => handleAscendFriendlyUnit(unit)}
                                      onMoveRowClick={() => handleMoveFriendlyUnitRow(unit)}
                                      onInspect={setInspectCard}
                                      onHoverCard={handleHoverCard}
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          ) : canStackHere ? (
                            <span className="mtg-slot-watermark">
                              {canDeployTrap
                                ? '+ Emboscada'
                                : hasColumnCover
                                ? '+ Retaguarda (+1 ATQ)'
                                : '+ Retaguarda'}
                            </span>
                          ) : hasColumnCover ? (
                            <span
                              className="mtg-slot-cover-rune"
                            >
                              +1 ATQ
                            </span>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* =====================================================
                  3. UNIFIED SYMMETRIC P1 + PHASE + MENU DOCK (BOTTOM EDGE)
                  Consolidates P1 Sovereign, Hand toggle, Phase button, and Match Menu into ONE sleek bar!
                  ===================================================== */}
              <footer className="hud-unified-bottom-bar">
                {/* Single Unified Bottom Strip: [P1 Sovereign + Rituals] | [Hand Toggle] | [Phase Action + Menu] */}
                <div className="hud-bottom-strip-inner">
                  {/* Left Segment: Sovereign 1 (Hover or click ▴ opens Seus Terrenos, Cripta & Cenário 1!) */}
                    <div
                      data-combat-id="player-sovereign"
                      className={`hud-p1-segment ${
                        isP1DrawerPinned ? 'is-pinned-open' : ''
                      } ${combatAnim?.targetId === 'player-sovereign' ? 'is-hit-target' : ''}`}
                      onMouseEnter={() => setIsHandHovered(false)}
                    >
                      {/* Auto-Hover & Pin Popover for Player 1 Details */}
                      <div className="hud-bottom-popover p1-details-popover">
                        <div className="hud-dropdown-row">
                          {/* Left Card: Channeled Lands, Elemental Affinities & Crypt */}
                          <div className="hud-dropdown-section hud-drawer-card">
                            <div className="hud-drawer-card-header">
                              <span className="hud-sec-label">
                                ⛰️ SEUS TERRENOS ({gameState.player.channeledCards.length})
                              </span>
                              <button
                                type="button"
                                className="hud-inline-btn crypt-btn"
                                onClick={() => setCryptModalOwner('player')}
                              >
                                🪦 Cripta ({gameState.player.crypt.length})
                              </button>
                            </div>

                            <div className="hud-lands-showcase">
                              {gameState.player.channeledCards.length === 0 ? (
                                <div className="hud-empty-lands-banner">
                                  <span className="empty-lands-glyph">⛰️</span>
                                  <span>
                                    0 terrenos canalizados • Selecione 1 carta na mão e pressione{' '}
                                    <strong>[C]</strong>
                                  </span>
                                </div>
                              ) : (
                                <div className="mtg-lands-stack">
                                  {gameState.player.channeledCards.slice(-6).map((c, i) => (
                                    <div
                                      key={`pl-land-${i}`}
                                      className={`mtg-land-card domain-${c.domain}`}
                                      style={{ marginLeft: i === 0 ? 0 : '-10px', zIndex: i + 1 }}
                                      onMouseEnter={() => handleHoverCard(c)}
                                      onMouseLeave={() => handleHoverCard(null)}
                                      title={c.name}
                                    >
                                      {c.imagePath ? <img src={c.imagePath} alt={c.name} /> : null}
                                      <span className="mtg-land-domain-pip">
                                        {DOMAIN_META[c.domain]?.icon}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="hud-affinities-footer">
                              <span className="hud-aff-kicker">AFINIDADES:</span>
                              {renderAffinityCounters(gameState.player.affinities)}
                            </div>
                          </div>

                          {/* Right Card: Domain Expansion Sanctuary & 6-Pip Progress */}
                          <div className="hud-dropdown-section hud-drawer-card">
                            {(() => {
                              const spec = getDomainExpansionSpec(domExpCheck.domain);
                              const aff = Math.min(6, domExpCheck.affinity);
                              const isReady = domExpCheck.affinity >= 6;
                              return (
                                <>
                                  <div className="hud-drawer-card-header">
                                    <span className="hud-sec-label">⛩️ EXPANSÃO DE DOMÍNIO</span>
                                    <span
                                      className={`hud-domain-status-chip domain-${spec.domain} ${
                                        isReady ? 'is-ready' : ''
                                      }`}
                                    >
                                      {domExpCheck.affinity}/6 AFINIDADE • 3⚡
                                    </span>
                                  </div>

                                  <div className="hud-domain-pips-track" aria-hidden="true">
                                    {[1, 2, 3, 4, 5, 6].map((pip) => (
                                      <span
                                        key={pip}
                                        className={`hud-domain-pip domain-${spec.domain} ${
                                          pip <= aff ? 'is-filled' : ''
                                        }`}
                                      />
                                    ))}
                                  </div>

                                  <div
                                    onClick={
                                      domExpCheck.allowed ? handleInvokeDomainExpansion : undefined
                                    }
                                    style={
                                      domExpCheck.allowed ? { cursor: 'pointer' } : undefined
                                    }
                                    className={`hud-sanctuary-card domain-${spec.domain} ${
                                      isReady ? 'is-ready' : 'is-locked'
                                    }`}
                                  >
                                    <div className="hud-sanctuary-emblem">{spec.icon}</div>
                                    <div className="hud-sanctuary-body">
                                      <div className="hud-sanctuary-title">
                                        {spec.name}
                                        {domExpCheck.allowed && (
                                          <span className="hud-sanctuary-invoke-cta">
                                            INVOCAR AGORA (3⚡)
                                          </span>
                                        )}
                                      </div>
                                      <div className="hud-sanctuary-desc">{spec.potencyDesc}</div>
                                    </div>
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        </div>

                        {gameState.domainExpansion && (
                          <div className="hud-dropdown-env-row">
                            <div className="hud-env-inline-box domain">
                              <strong>
                                {gameState.domainExpansion.icon} {gameState.domainExpansion.name} (
                                {gameState.domainExpansion.turnsRemaining}t):
                              </strong>{' '}
                              <span>
                                {gameState.domainExpansion.potencyDesc} •{' '}
                                {gameState.domainExpansion.sureHitDesc}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {feedbackMap['player-sovereign'] && (
                        <div
                          className={`floating-feedback-pill color-${feedbackMap['player-sovereign'].color}`}
                        >
                          {feedbackMap['player-sovereign'].text}
                        </div>
                      )}

                      <div className="hud-mini-avatar player">
                        {playerAvatarCard?.imagePath ? (
                          <img src={playerAvatarCard.imagePath} alt={gameState.player.name} />
                        ) : (
                          <span>👑</span>
                        )}
                      </div>

                      <span className="hud-pill-name player">{gameState.player.name}</span>
                      <span className="hud-pill-stat hp">❤️ {gameState.player.hp}</span>
                      <span className="hud-pill-stat mana">
                        ⚡ {gameState.player.currentEssence}/{gameState.player.maxEssence}
                      </span>
                      <span className="hud-pill-stat deck">
                        📚 {gameState.player.deck.length} • 🪦 {gameState.player.crypt.length}
                      </span>

                      <div className="hud-p1-rituals">
                        <button
                          type="button"
                          className="hud-ritual-chip"
                          disabled={!canPwr}
                          onClick={handleSovereignPower}
                        >
                          🔥 2⚡
                        </button>
                        <button
                          type="button"
                          className="hud-ritual-chip"
                          disabled={!canBlood}
                          onClick={handleBloodPact}
                        >
                          🩸 +1⚡
                        </button>
                        <button
                          type="button"
                          className={`hud-ritual-chip ${domExpCheck.allowed ? 'ready' : ''}`}
                          disabled={!domExpCheck.allowed}
                          onClick={handleInvokeDomainExpansion}
                        >
                          ⛩️ {domExpCheck.affinity}/6
                        </button>
                      </div>

                      <button
                        type="button"
                        className={`hud-pill-expand-btn ${isP1DrawerPinned ? 'active' : ''}`}
                        onClick={() => setIsP1DrawerPinned((prev) => !prev)}
                      >
                        {isP1DrawerPinned ? '▾' : '▴'}
                      </button>
                    </div>

                    <div className="hud-strip-divider" />

                    {/* Center Segment: Hand Drawer Handle */}
                    <button
                      type="button"
                      className={`hud-hand-trigger-btn ${
                        isHandPinnedOpen || isHandHovered ? 'active' : ''
                      }`}
                      onMouseEnter={() => setIsHandHovered(true)}
                      onClick={() => setIsHandPinnedOpen((prev) => !prev)}
                    >
                      🃏 MÃO ({gameState.player.hand.length}){' '}
                      {isHandPinnedOpen ? '📌' : '▴'}
                    </button>

                    <div className="hud-strip-divider" />

                    {/* Right Segment: Phase Action & Single Gear Menu (Hover or click ⚙️ opens Menu & Guide!) */}
                    <div
                      className="hud-phase-segment"
                      onMouseEnter={() => setIsHandHovered(false)}
                    >
                    <span className="hud-round-chip">
                      T{gameState.turn}
                    </span>

                    {isPlayerTurn && readyPlayerUnits.length > 0 && (
                      <button
                        type="button"
                        className="hud-action-cta attack-all"
                        disabled={Boolean(combatAnim)}
                        onClick={handleAutoAttackAll}
                      >
                        ⚔️ ATACAR ({readyPlayerUnits.length})
                      </button>
                    )}

                    <button
                      type="button"
                      className="hud-action-cta primary"
                      disabled={!isPlayerTurn || Boolean(combatAnim)}
                      onClick={handleEndPlayerTurn}
                    >
                      {!isPlayerTurn ? 'AGUARDE...' : '⏭️ PASSAR TURNO [ESPAÇO]'}
                    </button>

                    {gameState.phase !== 'gameover' && (
                      <button
                        type="button"
                        className="hud-action-cta"
                        style={{
                          background: 'rgba(127, 29, 29, 0.72)',
                          borderColor: 'rgba(248, 113, 113, 0.5)',
                          color: '#fecaca',
                          padding: '0 0.65rem',
                        }}
                        title="Render-se e encerrar a batalha"
                        onClick={() => setShowSurrenderConfirm(true)}
                      >
                        🏳️ DESISTIR
                      </button>
                    )}

                    <div
                      className={`hud-gear-menu-wrapper ${
                        activeRightDrawer === 'menu' ? 'is-pinned-open' : ''
                      }`}
                    >
                      <div
                        className="hud-bottom-popover menu-popover"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="menu-popover-guide">
                          <strong>
                            {isPlayerTurn
                              ? `⚔️ TURNO ${gameState.turn} • SEU TURNO`
                              : `⏳ TURNO ${gameState.turn} • TURNO DO ADVERSÁRIO`}
                          </strong>
                          <span>{getStepGuideText()}</span>
                        </div>

                        {!campaignBoss && (
                          <div className="awmt-decks-row">
                            <div className="awmt-deck-field">
                              <span className="awmt-deck-tag p1">VOCÊ</span>
                              <select
                                value={selectedPlayerDeckId}
                                onChange={(e) => {
                                  setSelectedPlayerDeckId(e.target.value);
                                  startNewQuickMatch(e.target.value, selectedAiDeckId);
                                }}
                                className="awmt-deck-select"
                              >
                                {allowedPlayerDecks.map((d) => (
                                  <option key={d.id} value={d.id}>
                                    {d.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="awmt-deck-field">
                              <span className="awmt-deck-tag p2">RIVAL</span>
                              <select
                                value={selectedAiDeckId}
                                onChange={(e) => {
                                  setSelectedAiDeckId(e.target.value);
                                  startNewQuickMatch(selectedPlayerDeckId, e.target.value);
                                }}
                                className="awmt-deck-select"
                              >
                                {PREBUILT_DECKS.map((d) => (
                                  <option key={d.id} value={d.id}>
                                    {d.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )}

                        <div className="awmt-actions-grid">
                          <button
                            type="button"
                            className="awmt-btn"
                            onClick={() => {
                              setShowTacticalAdvisor(true);
                              setActiveRightDrawer(null);
                            }}
                          >
                            📐 Conselheiro
                          </button>
                          <button
                            type="button"
                            className={`awmt-btn ${arenaTutorialStep !== null ? 'active' : ''}`}
                            onClick={() => {
                              setArenaTutorialStep((prev) => (prev === null ? 0 : null));
                              setActiveRightDrawer(null);
                            }}
                          >
                            🎓 Tutorial
                          </button>
                          <button
                            type="button"
                            className="awmt-btn"
                            onClick={() => {
                              setShowQuickRules(true);
                              setActiveRightDrawer(null);
                            }}
                          >
                            📖 Regras
                          </button>
                          {!onlineMatch && (
                            <button
                              type="button"
                              className="awmt-btn danger"
                              onClick={() => {
                                startNewQuickMatch(selectedPlayerDeckId, selectedAiDeckId);
                                setActiveRightDrawer(null);
                              }}
                            >
                              ↻ Reiniciar
                            </button>
                          )}
                          {gameState.phase !== 'gameover' && (
                            <button
                              type="button"
                              className="awmt-btn danger"
                              onClick={() => {
                                setActiveRightDrawer(null);
                                setShowSurrenderConfirm(true);
                              }}
                            >
                              🏳️ Desistir
                            </button>
                          )}
                          <button
                            type="button"
                            className={`awmt-btn full-width ${showLogSidebar ? 'active' : ''}`}
                            onClick={() => {
                              setShowLogSidebar((prev) => !prev);
                              setActiveRightDrawer(null);
                            }}
                          >
                            📜 Histórico de Combate (Log)
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        className={`hud-gear-btn ${activeRightDrawer === 'menu' ? 'active' : ''}`}
                        onClick={() =>
                          setActiveRightDrawer((prev) => (prev === 'menu' ? null : 'menu'))
                        }
                      >
                        ⚙️
                      </button>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          );
        })()}

        {/* =========================================================
            BOTTOM CENTER HAND DRAWER (Unobstructed — Left & Right HUDs live in the lateral wings!)
            ========================================================= */}
        {(() => {
          const isHandExpanded =
            selectedHandIndex === null && (isHandPinnedOpen || isHandHovered);
          const activeHandCard =
            selectedHandIndex !== null ? gameState.player.hand[selectedHandIndex] : null;
          const activePlayCheck =
            activeHandCard ? canPlayCard(gameState, 'player', activeHandCard) : { allowed: false };

          return (
            <div className="mtg-bottom-zone floating-bottom-hud">
              {/* Center: Auto-Retracting Fanned Player Hand Drawer OR Compact Selected Card Command Bar */}
              {activeHandCard && selectedHandIndex !== null ? (
                <div className="selected-card-command-dock">
                  <div
                    className="sccd-card-chip"
                    onMouseEnter={() => handleHoverCard(activeHandCard)}
                    onMouseLeave={() => handleHoverCard(null)}
                    onClick={() => setInspectCard(activeHandCard)}
                  >
                    <span className="sccd-cost">{activeHandCard.cost}</span>
                    {activeHandCard.imagePath && (
                      <img src={activeHandCard.imagePath} alt={activeHandCard.name} className="sccd-thumb" />
                    )}
                    <div className="sccd-meta">
                      <span className="sccd-name">{activeHandCard.name}</span>
                      <span className="sccd-hint">Clique em um slot na mesa ou escolha abaixo:</span>
                    </div>
                  </div>

                  <div className="sccd-actions">
                    {isPlayerTurn && activePlayCheck.allowed && activeHandCard.type === 'creature' && (
                      <>
                        {hasEmptyVanguard && (
                          <button
                            type="button"
                            className="quick-act-btn act-vanguard"
                            onClick={() => handleQuickDeployToRow(selectedHandIndex, 'vanguard')}
                          >
                            + Vanguarda [V]
                          </button>
                        )}
                        {hasEmptyRearguard && (
                          <button
                            type="button"
                            className="quick-act-btn act-rearguard"
                            onClick={() => handleQuickDeployToRow(selectedHandIndex, 'rearguard')}
                          >
                            + Retaguarda [R]
                          </button>
                        )}
                      </>
                    )}

                    {isPlayerTurn && activePlayCheck.allowed && activeHandCard.type === 'relic' && hasEmptyRearguard && (
                      <button
                        type="button"
                        className="quick-act-btn act-rearguard"
                        onClick={() => handleQuickDeployToRow(selectedHandIndex, 'rearguard')}
                      >
                        + Posicionar Relíquia [R]
                      </button>
                    )}

                    {isPlayerTurn &&
                      activePlayCheck.allowed &&
                      (activeHandCard.type === 'spell' || activeHandCard.type === 'reaction') && (
                        <button
                          type="button"
                          className="quick-act-btn act-spell"
                          onClick={() => handleQuickCastSpell(selectedHandIndex)}
                        >
                          Lançar Agora
                        </button>
                      )}

                    {isPlayerTurn &&
                      activePlayCheck.allowed &&
                      activeHandCard.type === 'reaction' &&
                      hasEmptyRearguard && (
                        <button
                          type="button"
                          className="quick-act-btn act-rearguard"
                          onClick={() => handleQuickArmTrap(selectedHandIndex)}
                        >
                          Armar Emboscada [R]
                        </button>
                      )}

                    {isPlayerTurn && !gameState.player.hasChanneledThisTurn && (
                      <button
                        type="button"
                        className="quick-act-btn act-channel"
                        onClick={() => handleQuickChannelCard(selectedHandIndex)}
                      >
                        Canalizar (+1 Afin. & Compra) [C]
                      </button>
                    )}

                    {isPlayerTurn && gameState.player.hasChanneledThisTurn && (
                      <button
                        type="button"
                        className="quick-act-btn act-burn"
                        onClick={() => handleQuickBurnCard(selectedHandIndex)}
                      >
                        Sacrificar (+1 Essência) [C]
                      </button>
                    )}

                    <button
                      type="button"
                      className="sccd-cancel-btn"
                      onClick={() => {
                        setSelectedHandIndex(null);
                      }}
                    >
                      ✕ Trocar Carta ({gameState.player.hand.length})
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className={`mtg-hand-drawer ${
                    isHandExpanded ? 'is-expanded' : 'is-collapsed'
                  }`}
                  onMouseEnter={() => setIsHandHovered(true)}
                  onMouseLeave={() => setIsHandHovered(false)}
                >
                  <div className="hand-drawer-handle-bar">
                    <button
                      type="button"
                      className={`hand-drawer-toggle-btn ${isHandPinnedOpen ? 'is-pinned' : ''}`}
                      onClick={() => setIsHandPinnedOpen((prev) => !prev)}
                    >
                      {isHandExpanded
                        ? `MÃO (${gameState.player.hand.length}) • ${
                            isHandPinnedOpen ? 'FIXADA ▼' : 'FIXAR'
                          }`
                        : `MÃO (${gameState.player.hand.length}) ▲`}
                    </button>
                  </div>

                  <div className="mtg-hand-fan">
                    {gameState.player.hand.length === 0 ? (
                      <div className="mtg-empty-hand-msg">
                        Mão vazia — passe o turno para comprar.
                      </div>
                    ) : (
                      gameState.player.hand.map((card, idx) => {
                        const playCheck = canPlayCard(gameState, 'player', card);
                        const isSelected = selectedHandIndex === idx;
                        const total = gameState.player.hand.length;
                        const mid = (total - 1) / 2;
                        const offsetIdx = idx - mid;
                        const rotDeg = isSelected ? 0 : offsetIdx * 2.2;
                        const liftY = isSelected ? -24 : Math.abs(offsetIdx) * 2.5;

                        return (
                          <div
                            key={`${card.id}-hand-${idx}`}
                            className={`mtg-hand-card-slot ${isSelected ? 'is-selected-slot' : ''}`}
                            style={{
                              transform: `translateY(${liftY}px) rotate(${rotDeg}deg)`,
                              zIndex: isSelected ? 60 : idx + 10,
                              marginLeft:
                                idx === 0
                                  ? '0px'
                                  : total >= 10
                                  ? '-68px'
                                  : total >= 7
                                  ? '-52px'
                                  : '-28px',
                            }}
                          >
                            <CardView
                              card={card}
                              mode="hand"
                              isPlayable={isPlayerTurn && playCheck.allowed}
                              isSelected={isSelected}
                              canChannel={isPlayerTurn && !gameState.player.hasChanneledThisTurn}
                              onClick={() => {
                                if (!isPlayerTurn) return;
                                setSelectedAttackerId(null);
                                setIsHandHovered(false);
                                setSelectedHandIndex(idx);
                              }}
                              onInspect={setInspectCard}
                              onHoverCard={handleHoverCard}
                            />
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* DISTRIBUTED 10 HP SACRIFICE MODAL TO BREAK ENEMY DOMAIN EXPANSION */}
      {showSacrificeBreakModal && gameState.domainExpansion && (
        <div className="modal-backdrop" onClick={() => setShowSacrificeBreakModal(false)}>
          <div
            className="modal-panel sacrifice-break-modal-panel"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const allUnits = getAllBoardUnits(gameState.player).filter(
                (u) => !u.isTrap && u.currentHp > 0
              );
              const unitTotal = Object.values(sacrificeAlloc.unitDamages).reduce(
                (acc, v) => acc + Math.max(0, v || 0),
                0
              );
              const totalAllocated = Math.max(0, sacrificeAlloc.sovereignHp) + unitTotal;
              const maxSovAlloc = Math.max(0, gameState.player.hp - 1);

              const adjustSovereignSac = (delta: number) => {
                setSacrificeAlloc((prev) => {
                  const nextVal = Math.max(0, Math.min(maxSovAlloc, prev.sovereignHp + delta));
                  return { ...prev, sovereignHp: nextVal };
                });
              };

              const adjustUnitSac = (instanceId: string, maxHp: number, delta: number) => {
                setSacrificeAlloc((prev) => {
                  const cur = prev.unitDamages[instanceId] ?? 0;
                  const nextVal = Math.max(0, Math.min(maxHp, cur + delta));
                  return {
                    ...prev,
                    unitDamages: {
                      ...prev.unitDamages,
                      [instanceId]: nextVal,
                    },
                  };
                });
              };

              return (
                <>
                  <div className="sbm-header">
                    <div>
                      <div className="sbm-kicker">CONTRAMEDIDA SUPREMA DE BARREIRA</div>
                      <h3 className="font-cinzel gold-gradient-text" style={{ fontSize: '1.25rem', margin: 0 }}>
                        💥 Romper Expansão de Domínio ({gameState.domainExpansion.name})
                      </h3>
                    </div>
                    <button
                      type="button"
                      className="btn-fantasy"
                      onClick={() => setShowSacrificeBreakModal(false)}
                    >
                      ✕ Fechar
                    </button>
                  </div>

                  <p className="sbm-desc">
                    Sacrifique <strong>10 pontos de vida/durabilidade</strong> distribuídos livremente entre seu{' '}
                    <strong>Soberano</strong>, suas <strong>Criaturas</strong> e suas <strong>Relíquias</strong> para
                    sobrecarregar e estilhaçar imediatamente a Expansão de Domínio inimiga!
                  </p>

                  <div className="sbm-progress-bar-row">
                    <span className="sbm-progress-label">
                      Vitalidade Alocada:{' '}
                      <strong style={{ color: totalAllocated >= 10 ? '#4ade80' : '#fbbf24' }}>
                        {totalAllocated} / 10 ❤️
                      </strong>
                    </span>
                    <button
                      type="button"
                      className="btn-fantasy"
                      style={{ padding: '3px 10px', fontSize: '0.72rem' }}
                      onClick={() =>
                        setSacrificeAlloc(buildAutoSacrificeAllocation(gameState, 'player'))
                      }
                    >
                      ⚡ Auto-Distribuir (10❤️)
                    </button>
                  </div>

                  <div className="sbm-allocation-list">
                    {/* Sovereign Row */}
                    <div className="sbm-alloc-item is-sovereign-row">
                      <div className="sbm-item-meta">
                        <span className="sbm-item-icon">👑</span>
                        <div>
                          <div className="sbm-item-name">
                            Seu Soberano ({gameState.player.name})
                          </div>
                          <div className="sbm-item-sub">
                            Vida Atual: {gameState.player.hp} PV (Mínimo restante: 1 PV)
                          </div>
                        </div>
                      </div>
                      <div className="sbm-item-controls">
                        <button
                          type="button"
                          className="sbm-step-btn"
                          disabled={sacrificeAlloc.sovereignHp <= 0}
                          onClick={() => adjustSovereignSac(-1)}
                        >
                          −
                        </button>
                        <span className="sbm-alloc-val">-{sacrificeAlloc.sovereignHp} ❤️</span>
                        <button
                          type="button"
                          className="sbm-step-btn"
                          disabled={sacrificeAlloc.sovereignHp >= maxSovAlloc}
                          onClick={() => adjustSovereignSac(1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Board Creatures & Relics */}
                    {allUnits.map((u) => {
                      const allocated = sacrificeAlloc.unitDamages[u.instanceId] ?? 0;
                      const willDie = allocated >= u.currentHp;
                      return (
                        <div
                          key={u.instanceId}
                          className={`sbm-alloc-item ${willDie ? 'will-be-sacrificed' : ''}`}
                        >
                          <div className="sbm-item-meta">
                            <span className="sbm-item-icon">
                              {u.card.type === 'relic' ? '🏺' : '🛡️'}
                            </span>
                            <div>
                              <div className="sbm-item-name">
                                {u.card.name}{' '}
                                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                                  ({u.row === 'vanguard' ? 'Vanguarda' : 'Retaguarda'} • Col {u.slotIndex + 1})
                                </span>
                              </div>
                              <div className="sbm-item-sub">
                                PV Atual: {u.currentHp}/{u.maxHp}{' '}
                                {willDie && (
                                  <strong style={{ color: '#f87171' }}>• (Será Sacrificado!)</strong>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="sbm-item-controls">
                            <button
                              type="button"
                              className="sbm-step-btn"
                              disabled={allocated <= 0}
                              onClick={() => adjustUnitSac(u.instanceId, u.currentHp, -1)}
                            >
                              −
                            </button>
                            <span className="sbm-alloc-val">-{allocated} ❤️</span>
                            <button
                              type="button"
                              className="sbm-step-btn"
                              disabled={allocated >= u.currentHp}
                              onClick={() => adjustUnitSac(u.instanceId, u.currentHp, 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="sbm-footer">
                    <button
                      type="button"
                      className="btn-fantasy"
                      onClick={() => setShowSacrificeBreakModal(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="btn-fantasy btn-fantasy-danger"
                      disabled={totalAllocated < 10}
                      onClick={handleConfirmSacrificeBreak}
                    >
                      💥 Confirmar Sacrifício ({totalAllocated}/10❤️) & Romper Domínio
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* COLLAPSIBLE COMBAT LOG SIDEBAR */}
      {showLogSidebar && (
        <aside className="combat-log-sidebar">
          <div
            style={{
              padding: '0.65rem 0.85rem',
              borderBottom: '1px solid rgba(212, 175, 55, 0.22)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span className="font-cinzel gold-gradient-text" style={{ fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.06em' }}>
              REGISTRO DE COMBATE
            </span>
            <button
              type="button"
              className="btn-fantasy"
              style={{ padding: '2px 7px', fontSize: '0.68rem' }}
              onClick={() => setShowLogSidebar(false)}
            >
              ✕
            </button>
          </div>
          <div className="combat-log-list">
            {gameState.combatLog.map((entry) => (
              <div key={entry.id} className={`combat-log-item actor-${entry.actor}`}>
                <div
                  style={{
                    fontSize: '0.62rem',
                    color: '#94a3b8',
                    marginBottom: '2px',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>Turno {entry.turn}</span>
                  <span style={{ textTransform: 'uppercase' }}>{entry.category}</span>
                </div>
                <div style={{ color: '#e2e8f0' }}>{entry.message}</div>
              </div>
            ))}
          </div>
        </aside>
      )}

      {/* 1. CINEMATIC SOVEREIGN FINISHER ANIMATION (PLAYS FOR 2.55s BEFORE GAME OVER CARD) */}
      {gameState.phase === 'gameover' && gameoverStage === 'cinematic' && (
        <div
          className={`sovereign-finisher-overlay ${
            gameState.winner === 'player' ? 'is-victory-finisher' : 'is-defeat-finisher'
          }`}
          onClick={() => setGameoverStage('modal')}
          title="Clique para avançar para o resumo da batalha"
        >
          <div className="finisher-impact-flash" />
          <div className="finisher-fracture-web" />

          {/* Exploding Bastion Shards Centered on the Fallen Sovereign */}
          <div
            className={`finisher-bastion-burst ${
              gameState.winner === 'player' ? 'burst-top-enemy' : 'burst-bottom-player'
            }`}
          >
            <div className="finisher-shockwave-ring primary" />
            <div className="finisher-shockwave-ring secondary" />
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((idx) => (
              <span
                key={idx}
                className="finisher-crystal-shard"
                style={
                  {
                    '--shard-angle': `${idx * 30}deg`,
                    '--shard-dist': `${idx % 2 === 0 ? 190 : 135}px`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>

          {/* Center Sweeping Herald Banner (Dark Souls / Legends of Runeterra Style) */}
          <div className="finisher-herald-banner">
            <div className="finisher-herald-Portrait">
              {gameState.winner === 'player' ? (
                playerAvatarCard?.imagePath ? (
                  <img src={playerAvatarCard.imagePath} alt={gameState.player.name} />
                ) : (
                  <span>👑</span>
                )
              ) : aiAvatarCard?.imagePath ? (
                <img src={aiAvatarCard.imagePath} alt={gameState.ai.name} />
              ) : (
                <span>💀</span>
              )}
            </div>
            <div className="finisher-herald-kicker font-cinzel">
              {gameState.winner === 'player'
                ? '⚔️ BASTIÃO INIMIGO DESTRUÍDO • TRIUNFO SOBERANO ⚔️'
                : '💀 SEU BASTIÃO SUCUMBIU • QUEDA DO SOBERANO 💀'}
            </div>
            <div className="finisher-herald-title font-cinzel">
              {gameState.winner === 'player' ? 'VITÓRIA DO SOBERANO' : 'DERROTA NA BATALHA'}
            </div>
            <div className="finisher-herald-sub">{gameState.winReason}</div>
          </div>
        </div>
      )}

      {/* 2. GAME OVER SUMMARY MODAL CARD (APPEARS AFTER FINISHER ANIMATION) */}
      {gameState.phase === 'gameover' && gameoverStage !== 'cinematic' && (
        <div className="modal-backdrop">
          <div
            className="modal-panel"
            style={{ maxWidth: '500px', textAlign: 'center', padding: '2rem' }}
          >
            <div
              className="font-cinzel"
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.18em',
                color: gameState.winner === 'player' ? '#d4af37' : '#ef4444',
                marginBottom: '0.5rem',
              }}
            >
              {gameState.winner === 'player' ? 'TRIUNFO SOBERANO' : 'QUEDA DO BASTIÃO'}
            </div>
            <h2
              className="font-cinzel gold-gradient-text"
              style={{ fontSize: '1.65rem', marginBottom: '0.5rem' }}
            >
              {gameState.winner === 'player' ? 'VITÓRIA DO SOBERANO' : 'DERROTA NA BATALHA'}
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.92rem', marginBottom: '1.2rem' }}>
              {gameState.winReason}
            </p>

            {gameState.winner === 'player' && (
              <div
                style={{
                  padding: '0.75rem',
                  borderRadius: '8px',
                  background: 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid rgba(212, 175, 55, 0.35)',
                  color: '#fde68a',
                  fontWeight: 700,
                  marginBottom: '1.25rem',
                }}
              >
                {isGuest
                  ? 'Modo Visitante: Crie sua Conta de Soberano para conquistar +10 Ouro por vitória!'
                  : `Recompensa: +${VICTORY_GOLD_REWARD} Ouro`}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              {!onlineMatch && (
                <button
                  type="button"
                  className="btn-fantasy btn-fantasy-primary"
                  onClick={() => startNewQuickMatch(selectedPlayerDeckId, selectedAiDeckId)}
                >
                  Jogar Novamente
                </button>
              )}
              {onlineMatch && (
                <button
                  type="button"
                  className="btn-fantasy btn-fantasy-primary"
                  onClick={onlineMatch.onExitPvp}
                >
                  Voltar ao Conclave 1×1
                </button>
              )}
              {campaignBoss && onExitCampaign && (
                <button type="button" className="btn-fantasy" onClick={onExitCampaign}>
                  Voltar à Campanha
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SURRENDER / CONCEDE CONFIRMATION MODAL */}
      {showSurrenderConfirm && gameState.phase !== 'gameover' && (
        <div className="modal-backdrop" onClick={() => setShowSurrenderConfirm(false)}>
          <div
            className="modal-panel"
            style={{ maxWidth: '440px', textAlign: 'center', padding: '1.75rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="font-cinzel"
              style={{
                fontSize: '0.74rem',
                letterSpacing: '0.16em',
                color: '#fca5a5',
                marginBottom: '0.4rem',
              }}
            >
              ENCERRAR COMBATE
            </div>
            <h3
              className="font-cinzel gold-gradient-text"
              style={{ fontSize: '1.35rem', marginBottom: '0.6rem' }}
            >
              RENDER-SE NA BATALHA?
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.86rem', lineHeight: 1.5, marginBottom: '1.35rem' }}>
              {onlineMatch
                ? `Ao desistir, a vitória será concedida imediatamente a ${gameState.ai.name} e sua Reputação será atualizada.`
                : `Ao desistir, seu Bastião se renderá imediatamente e a partida atual será encerrada.`}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn-fantasy"
                onClick={() => setShowSurrenderConfirm(false)}
              >
                Continuar Lutando
              </button>
              <button
                type="button"
                className="btn-fantasy btn-fantasy-danger"
                onClick={handleConfirmSurrender}
              >
                🏳️ Confirmar Desistência
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OPPONENT CONNECTION INSTABILITY / DISCONNECT COUNTDOWN BANNER */}
      {onlineMatch && opponentOfflineSeconds >= 18 && gameState.phase !== 'gameover' && (
        <div
          style={{
            position: 'fixed',
            top: '68px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1200,
            padding: '0.55rem 1.15rem',
            borderRadius: '999px',
            background: 'rgba(127, 29, 29, 0.92)',
            border: '1.5px solid #f87171',
            color: '#fef2f2',
            fontSize: '0.78rem',
            fontWeight: 700,
            boxShadow: '0 8px 24px rgba(0,0,0,0.65)',
            pointerEvents: 'none',
          }}
        >
          ⚠️ Conexão de {gameState.ai.name} instável ({opponentOfflineSeconds}s sem resposta) — Vitória por W.O. em{' '}
          {Math.max(0, 45 - opponentOfflineSeconds)}s...
        </div>
      )}

      {/* CRYPT (GRAVEYARD) INSPECTOR MODAL */}
      {cryptModalOwner && (
        <div className="modal-backdrop" onClick={() => setCryptModalOwner(null)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              <h3 className="font-cinzel gold-gradient-text" style={{ fontSize: '1.15rem' }}>
                Cripta de {gameState[cryptModalOwner].name} (
                {gameState[cryptModalOwner].crypt.length} cartas)
              </h3>
              <button
                type="button"
                className="btn-fantasy"
                onClick={() => setCryptModalOwner(null)}
              >
                ✕ Fechar
              </button>
            </div>
            {gameState[cryptModalOwner].crypt.length === 0 ? (
              <p style={{ color: '#94a3b8', padding: '1.5rem', textAlign: 'center' }}>
                Nenhuma carta na Cripta ainda.
              </p>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  justifyContent: 'center',
                }}
              >
                {gameState[cryptModalOwner].crypt.map((c, idx) => (
                  <CardView
                    key={`${c.id}-crypt-${idx}`}
                    card={c}
                    mode="gallery"
                    onInspect={setInspectCard}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* INTERACTIVE LIVE ARENA COACHMARK WALKTHROUGH BANNER */}
      {arenaTutorialStep !== null && (
        <div
          style={{
            position: 'fixed',
            top: '64px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1200,
            width: 'min(760px, 94vw)',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.97), rgba(30, 41, 59, 0.97))',
            border: '1.5px solid rgba(250, 204, 21, 0.8)',
            borderRadius: '12px',
            boxShadow: '0 14px 38px rgba(0, 0, 0, 0.82), 0 0 24px rgba(212, 175, 55, 0.28)',
            padding: '0.85rem 1.15rem',
            color: '#f8fafc',
          }}
        >
          {(() => {
            const cur =
              ARENA_COACHMARK_STEPS[arenaTutorialStep] ?? ARENA_COACHMARK_STEPS[0];
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      letterSpacing: '0.12em',
                      color: '#fde047',
                    }}
                  >
                    🎓 {cur.badge}
                  </span>
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    <button
                      type="button"
                      className="btn-fantasy"
                      style={{ padding: '2px 8px', fontSize: '0.68rem' }}
                      onClick={() => {
                        setArenaTutorialStep(null);
                        setShowQuickRules(true);
                      }}
                    >
                      📖 Abrir Códice Completo
                    </button>
                    <button
                      type="button"
                      className="btn-fantasy btn-fantasy-danger"
                      style={{ padding: '2px 8px', fontSize: '0.68rem' }}
                      onClick={() => setArenaTutorialStep(null)}
                    >
                      ✕ Fechar
                    </button>
                  </div>
                </div>

                <div className="font-cinzel" style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
                  {cur.title}
                </div>
                <p style={{ fontSize: '0.83rem', color: '#e2e8f0', lineHeight: 1.48, margin: 0 }}>
                  {cur.text}
                </p>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '0.3rem',
                    paddingTop: '0.45rem',
                    borderTop: '1px solid rgba(148, 163, 184, 0.2)',
                  }}
                >
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {ARENA_COACHMARK_STEPS.map((s, idx) => (
                      <button
                        key={s.step}
                        type="button"
                        onClick={() => setArenaTutorialStep(idx)}
                        style={{
                          width: idx === arenaTutorialStep ? '22px' : '8px',
                          height: '8px',
                          borderRadius: '999px',
                          border: 'none',
                          cursor: 'pointer',
                          background: idx === arenaTutorialStep ? '#facc15' : 'rgba(148, 163, 184, 0.4)',
                          transition: 'all 0.2s ease',
                        }}
                      />
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      className="btn-fantasy"
                      style={{ padding: '4px 10px', fontSize: '0.74rem' }}
                      disabled={arenaTutorialStep === 0}
                      onClick={() =>
                        setArenaTutorialStep((prev) => Math.max(0, (prev ?? 0) - 1))
                      }
                    >
                      ← Anterior
                    </button>
                    {arenaTutorialStep < ARENA_COACHMARK_STEPS.length - 1 ? (
                      <button
                        type="button"
                        className="btn-fantasy btn-fantasy-primary"
                        style={{ padding: '4px 12px', fontSize: '0.74rem' }}
                        onClick={() =>
                          setArenaTutorialStep((prev) =>
                            Math.min(ARENA_COACHMARK_STEPS.length - 1, (prev ?? 0) + 1)
                          )
                        }
                      >
                        Próximo Passo →
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn-fantasy btn-fantasy-primary"
                        style={{ padding: '4px 12px', fontSize: '0.74rem' }}
                        onClick={() => setArenaTutorialStep(null)}
                      >
                        ✓ Concluir Tutorial
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* FULL INTERACTIVE TUTORIAL & CODEX MODAL */}
      {showQuickRules && (
        <TutorialCodexView
          isModal={true}
          onClose={() => setShowQuickRules(false)}
          onStartPracticeDuel={() => {
            setShowQuickRules(false);
            setArenaTutorialStep(0);
          }}
          onInspectCard={setInspectCard}
        />
      )}

      {/* REAL-TIME TACTICAL ADVISOR OVERLAY MODAL */}
      {showTacticalAdvisor && (
        <TacticalGuideView
          customDecks={customDecks}
          initialPlayerDeckId={selectedPlayerDeckId}
          initialOpponentDeckId={campaignBoss ? campaignBoss.deckId : selectedAiDeckId}
          isModal={true}
          onClose={() => setShowTacticalAdvisor(false)}
          onLaunchDuel={(pId, aId) => {
            setShowTacticalAdvisor(false);
            setSelectedPlayerDeckId(pId);
            setSelectedAiDeckId(aId);
            startNewQuickMatch(pId, aId);
          }}
        />
      )}

      {/* CARD INSPECT MODAL */}
      {inspectCard && (
        <CardInspectModal card={inspectCard} onClose={() => setInspectCard(null)} />
      )}
    </div>
  );
};
