import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ALL_CARDS, CARDS_BY_ID } from '../data/cards';
import {
  addUnitToSlot,
  ascendUnit,
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
  cloneGameState,
  CombatPreviewResult,
  createInitialGameState,
  executeAttack,
  findUnitOnBoard,
  getAllBoardUnits,
  getDomainExpansionSpec,
  getSlotUnits,
  getValidAttackTargets,
  invokeDomainExpansion,
  isSureHitActiveFor,
  MAX_UNITS_PER_SLOT,
  playCard,
  previewAttackOutcome,
  recalculateFormationBonuses,
} from '../engine/gameEngine';
import {
  BoardUnit,
  CardDefinition,
  Domain,
  FloatingFeedback,
  GameState,
  RowType,
} from '../types/game';
import {
  getCurrentMusicState,
  MusicIntensityStage,
  MusicStateDescriptor,
  setMusicState,
  STAGE_TARGET_VOLUMES,
  startAdaptiveMusic,
  subscribeMusicState,
} from '../utils/musicEngine';
import { getSharedAudioContext, onAudioUnlocked, playSfx } from '../utils/soundEngine';
import {
  CARD_TYPE_LABELS,
  CardView,
  DOMAIN_META,
  KEYWORD_TOOLTIPS,
} from './CardView';

export type SimSubPhase = 'hand' | 'dock' | 'impact';

interface InitialUnitPlacement {
  cardId: string;
  row: RowType;
  slotIndex: number;
  damageTaken?: number;
}

interface SimEngineStep {
  id: string;
  stepBadge: string;
  title: string;
  narrative: string;
  turnNumber: number;
  p1Essence: number;
  p1MaxEssence: number;
  kind: 'play_card' | 'invoke_domain' | 'domain_clash' | 'domain_and_ascend' | 'attack_lethal';
  handIndex?: number;
  deployRow?: RowType;
  deploySlotIndex?: number;
  alsoInvokeDomainExpansion?: boolean;
  rivalInvokesDomain?: boolean;
  shatterRivalDomain?: boolean;
  ascendSlotIndex?: number;
  ascendRow?: RowType;
  spellTargetSlotIndex?: number;
  spellTargetRow?: RowType;
  spellTargetOwner?: 'player' | 'ai';
}

interface SimDuelScenario {
  id: string;
  shortTab: string;
  badge: string;
  title: string;
  subtitle: string;
  comboRef: string;
  accentColor: string;
  p1Name: string;
  p1AvatarCardId: string;
  p1Domain: Exclude<Domain, 'neutral'>;
  p1StartingHp: number;
  p2Name: string;
  p2AvatarCardId: string;
  p2Domain: Exclude<Domain, 'neutral'>;
  p2StartingHp: number;
  initialEnemyDomain?: Exclude<Domain, 'neutral'>;
  initialPlayerUnits: InitialUnitPlacement[];
  initialAiUnits: InitialUnitPlacement[];
  initialHandCardIds: string[];
  initialChanneledCardIds: string[];
  initialCryptCardIds: string[];
  steps: SimEngineStep[];
}

function resolveRealCard(cardId: string): CardDefinition {
  return CARDS_BY_ID[cardId] ?? ALL_CARDS[0];
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
 * Exact deterministic organic tabletop card pose from BattleArena.tsx
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
  stackTotal = 1,
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

  const rawRot = ((absHash % 45) - 22) / 10;
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

const SIM_DUEL_SCENARIOS: SimDuelScenario[] = [
  {
    id: 'crimson_forge_domain',
    shortTab: '🔥 Forja Carmesim',
    badge: 'COMBO #2 • EXPANSÃO DE DOMÍNIO, CONFRONTO 50/50 & QUEBRA DE BARREIRA',
    title: 'Caldeira do Fogo Primordial',
    subtitle: 'Bigorna do Rei da Fornalha + Expansão Carmesim + Confronto 50/50 + Vulcanis',
    comboRef: 'Grimório: Fúria de Pyros • Combo Oficial #2',
    accentColor: '#ef4444',
    p1Name: 'Ignis Rex (Você)',
    p1AvatarCardId: 'red_157_dragao_tiamat_carmesim',
    p1Domain: 'red',
    p1StartingHp: 28,
    p2Name: 'Vesperion, Arquilich',
    p2AvatarCardId: 'purple_07_lich',
    p2Domain: 'purple',
    p2StartingHp: 22,
    initialPlayerUnits: [
      { cardId: 'red_04_meio_dragao', row: 'vanguard', slotIndex: 1 },
      { cardId: 'red_03_mastim_infernal', row: 'vanguard', slotIndex: 2 },
      { cardId: 'red_10_altar_draconico', row: 'rearguard', slotIndex: 1 },
    ],
    initialAiUnits: [
      { cardId: 'purple_25_dama_seis_laminas', row: 'vanguard', slotIndex: 1 },
      { cardId: 'purple_07_lich', row: 'vanguard', slotIndex: 3, damageTaken: 1 },
      { cardId: 'purple_126_campanario_mortos', row: 'rearguard', slotIndex: 3 },
    ],
    initialHandCardIds: [
      'red_36_bigorna_fogo',
      'red_157_dragao_tiamat_carmesim',
      'red_123_cataclismo_solar',
      'red_18_marechal_rubro',
      'red_01_kobold',
    ],
    initialChanneledCardIds: [
      'red_01_kobold',
      'red_02_magmin',
      'red_03_mastim_infernal',
      'red_04_meio_dragao',
      'red_10_altar_draconico',
      'red_18_marechal_rubro',
    ],
    initialCryptCardIds: ['red_01_kobold', 'red_02_magmin'],
    steps: [
      {
        id: 'red-step-1',
        stepBadge: 'PASSO 1/5 • RELÍQUIA DE FORJA',
        title: 'Posicionar Bigorna do Rei da Fornalha na Retaguarda',
        narrative:
          'O Jogador 1 abre sua mão, seleciona a Relíquia Bigorna do Rei da Fornalha e a posiciona na Retaguarda [R], concedendo +1/+1 aos seus aliados e forjando uma Cria Dracônica 2/1 com Ímpeto!',
        turnNumber: 6,
        p1Essence: 6,
        p1MaxEssence: 6,
        kind: 'play_card',
        handIndex: 0,
        deployRow: 'rearguard',
        deploySlotIndex: 2,
      },
      {
        id: 'red-step-2',
        stepBadge: 'PASSO 2/5 • ⛩️ ENTRADA DA EXPANSÃO DE DOMÍNIO (CLÍMAX SONORO 100%)',
        title: 'Invocar Expansão de Domínio: Caldeira do Fogo Primordial',
        narrative:
          'Com 6/6 de Afinidade Carmesim, o Jogador 1 abre seus Terrenos e invoca a Caldeira do Fogo Primordial (3⚡)! A onda vulcânica toma toda a mesa de madeira (+1/+1, Ímpeto e Acerto Garantido) e a música salta para intensidade máxima (CLÍMAX 100%)!',
        turnNumber: 7,
        p1Essence: 7,
        p1MaxEssence: 7,
        kind: 'invoke_domain',
      },
      {
        id: 'red-step-3',
        stepBadge: 'PASSO 3/5 • ⚡⛩️ CONFRONTO DE DOMÍNIOS 50/50 & ASCENSÃO',
        title: 'Confronto de Domínios (50/50): Caldeira vs Eclipse do Trono + Ascensão',
        narrative:
          'O Arquilich rival responde expandindo o Eclipse do Trono de Ossos! As duas barreiras colidem no centro da mesa numa Disputa 50/50 (anulando os Acertos Garantidos), enquanto o Jogador 1 ascende o Campeão Dracônico para ★ Soberano Meio-Dragão!',
        turnNumber: 7,
        p1Essence: 5,
        p1MaxEssence: 7,
        kind: 'domain_clash',
        rivalInvokesDomain: true,
        ascendRow: 'vanguard',
        ascendSlotIndex: 1,
      },
      {
        id: 'red-step-4',
        stepBadge: 'PASSO 4/5 • 💥 QUEBRA DO DOMÍNIO RIVAL (7 vs 6 AFINIDADE) & SOPRO DRACÔNICO',
        title: 'Canalizar 7ª Afinidade (Estilhaçar Barreira Rival) & Invocar Vulcanis',
        narrative:
          'O Jogador 1 canaliza seu 7º Terreno Carmesim (superando a Afinidade rival 7 vs 6 e estilhaçando o domínio inimigo em 8 fragmentos!) e invoca a Lendária Vulcanis, Soberano Carmesim na Vanguarda [V], varrendo a linha inimiga com Sopro Elemental!',
        turnNumber: 8,
        p1Essence: 9,
        p1MaxEssence: 9,
        kind: 'play_card',
        handIndex: 0,
        deployRow: 'vanguard',
        deploySlotIndex: 4,
        shatterRivalDomain: true,
      },
      {
        id: 'red-step-5',
        stepBadge: 'PASSO 5/5 • ⚔️ PREVISÃO TÁTICA & GOLPE FINAL',
        title: 'Ataque com Acerto Garantido Direto no Soberano Rival',
        narrative:
          'Com o domínio rival rompido e a Caldeira do Fogo Primordial soberana na mesa, toda a Vanguarda Dracônica ataca diretamente o Soberano rival com Acerto Garantido para conquistar a vitória!',
        turnNumber: 8,
        p1Essence: 3,
        p1MaxEssence: 9,
        kind: 'attack_lethal',
      },
    ],
  },
  {
    id: 'golden_citadel_clash',
    shortTab: '☀️ Cidadela & Colisão',
    badge: 'COMBO #15 • DISPUTA DE DOMÍNIOS 50/50 & ROMPIMENTO DE BARREIRA',
    title: 'Cidadela da Aurora vs Eclipse Abissal',
    subtitle: 'Trono do Imperador Eterno + Colisão de Domínios 50/50 + Aurelius, Soberano da Alvorada',
    comboRef: 'Grimório: Bastião de Aurelius • Combo Oficial #15',
    accentColor: '#eab308',
    p1Name: 'Aurelius (Você)',
    p1AvatarCardId: 'gold_157_dragao_soberano_alvorada',
    p1Domain: 'gold',
    p1StartingHp: 22,
    p2Name: 'Monarca dos Três Crânios',
    p2AvatarCardId: 'purple_157_dragao_sombra_abissal',
    p2Domain: 'purple',
    p2StartingHp: 18,
    initialEnemyDomain: 'purple',
    initialPlayerUnits: [
      { cardId: 'gold_26_muralha_aco', row: 'vanguard', slotIndex: 1 },
      { cardId: 'gold_07_dragao_ouro', row: 'vanguard', slotIndex: 2 },
    ],
    initialAiUnits: [
      { cardId: 'purple_138_soberano_carnica', row: 'vanguard', slotIndex: 2, damageTaken: 2 },
      { cardId: 'purple_126_campanario_mortos', row: 'rearguard', slotIndex: 2 },
    ],
    initialHandCardIds: [
      'gold_146_trono_imperador_eterno',
      'gold_157_dragao_soberano_alvorada',
      'gold_160_decreto_invulnerabilidade',
    ],
    initialChanneledCardIds: [
      'gold_26_muralha_aco',
      'gold_07_dragao_ouro',
      'gold_146_trono_imperador_eterno',
      'gold_160_decreto_invulnerabilidade',
      'gold_26_muralha_aco',
      'gold_07_dragao_ouro',
    ],
    initialCryptCardIds: ['gold_26_muralha_aco'],
    steps: [
      {
        id: 'gld-step-1',
        stepBadge: 'PASSO 1/4 • RELÍQUIA IMPERIAL SOB DOMÍNIO RIVAL',
        title: 'Posicionar Trono Supremo do Imperador Eterno na Retaguarda',
        narrative:
          'Sob o Eclipse do Trono de Ossos inimigo, o Jogador 1 escolhe a Relíquia Trono Supremo do Imperador Eterno na mão e a posiciona na Retaguarda [R], concedendo +1/+2 e Escudo Divino aos seus aliados!',
        turnNumber: 6,
        p1Essence: 6,
        p1MaxEssence: 6,
        kind: 'play_card',
        handIndex: 0,
        deployRow: 'rearguard',
        deploySlotIndex: 3,
      },
      {
        id: 'gld-step-2',
        stepBadge: 'PASSO 2/4 • ⚡⛩️ CONFRONTO DE DOMÍNIOS 50/50 (CLÍMAX SONORO 100%)',
        title: 'Confronto de Domínios: Cidadela da Aurora vs Eclipse do Trono de Ossos',
        narrative:
          'O Jogador 1 contra-ataca invocando sua própria Expansão de Domínio (3⚡)! O tabuleiro se divide 50/50 com o feixe sísmico central, anulando o Acerto Garantido inimigo e elevando a trilha ao CLÍMAX MÁXIMO (100%)!',
        turnNumber: 7,
        p1Essence: 8,
        p1MaxEssence: 8,
        kind: 'domain_clash',
      },
      {
        id: 'gld-step-3',
        stepBadge: 'PASSO 3/4 • 💥 QUEBRA DE BARREIRA (7 vs 6 AFINIDADE) & DRAGÃO DA ALVORADA',
        title: 'Canalizar 7ª Afinidade (Estilhaçar o Eclipse Rival) & Invocar Aurelius',
        narrative:
          'O Jogador 1 canaliza seu 7º Terreno Dourado (superando a Afinidade rival 7 vs 6 e rompendo a barreira roxa em 8 fragmentos!) e invoca Aurelius, Dragão Soberano da Alvorada na Vanguarda [V], fortalecendo toda a falange com +2/+2!',
        turnNumber: 8,
        p1Essence: 9,
        p1MaxEssence: 9,
        kind: 'play_card',
        handIndex: 0,
        deployRow: 'vanguard',
        deploySlotIndex: 3,
        shatterRivalDomain: true,
      },
      {
        id: 'gld-step-4',
        stepBadge: 'PASSO 4/4 • ⚔️ JULGAMENTO DA AURORA',
        title: 'Marcha Inabalável da Falange Dourada com Acerto Garantido',
        narrative:
          'Com todas as unidades fortalecidas pela Cidadela da Aurora e o domínio rival estilhaçado, o Jogador 1 ataca diretamente o Soberano inimigo para conquistar a Vitória Soberana!',
        turnNumber: 8,
        p1Essence: 2,
        p1MaxEssence: 9,
        kind: 'attack_lethal',
      },
    ],
  },
  {
    id: 'eternal_frost_domain',
    shortTab: '❄️ Gelo Eterno',
    badge: 'COMBO #6 • CONGELAMENTO TOTAL & OLHO DO MAELSTROM ASTRAL',
    title: 'Olho do Maelstrom Astral',
    subtitle: 'Ruptura do Relógio Astral + Expansão Glacial + Dragão de Safira Sônico',
    comboRef: 'Grimório: Conclave da Geada • Combo Oficial #6',
    accentColor: '#38bdf8',
    p1Name: 'Hydrissa (Você)',
    p1AvatarCardId: 'blue_154_dragao_safira_soberano',
    p1Domain: 'blue',
    p1StartingHp: 26,
    p2Name: 'Vulcanis, Senhor Rubro',
    p2AvatarCardId: 'red_157_dragao_tiamat_carmesim',
    p2Domain: 'red',
    p2StartingHp: 16,
    initialPlayerUnits: [
      { cardId: 'blue_152_arquimago_vortice', row: 'vanguard', slotIndex: 2 },
      { cardId: 'blue_37_mago_aprendiz', row: 'rearguard', slotIndex: 1 },
    ],
    initialAiUnits: [
      { cardId: 'red_04_meio_dragao', row: 'vanguard', slotIndex: 2 },
      { cardId: 'red_18_marechal_rubro', row: 'vanguard', slotIndex: 4 },
    ],
    initialHandCardIds: [
      'blue_141_ruptura_temporal',
      'blue_154_dragao_safira_soberano',
      'blue_146_trono_inverno_eterno',
      'blue_161_singularidade_temporal',
    ],
    initialChanneledCardIds: [
      'blue_37_mago_aprendiz',
      'blue_136_leviata_cronos',
      'blue_141_ruptura_temporal',
      'blue_152_arquimago_vortice',
      'blue_146_trono_inverno_eterno',
      'blue_161_singularidade_temporal',
    ],
    initialCryptCardIds: ['blue_37_mago_aprendiz'],
    steps: [
      {
        id: 'blu-step-1',
        stepBadge: 'PASSO 1/4 • FEITIÇO DE ESTASE',
        title: 'Lançar Ruptura do Relógio Astral na Vanguarda Inimiga',
        narrative:
          'O Jogador 1 escolhe Ruptura do Relógio Astral na mão e a lança sobre a Vanguarda inimiga, aplicando ❄️ Congelado a todos os inimigos, gerando +2⚡ e comprando 1 carta!',
        turnNumber: 6,
        p1Essence: 6,
        p1MaxEssence: 6,
        kind: 'play_card',
        handIndex: 0,
      },
      {
        id: 'blu-step-2',
        stepBadge: 'PASSO 2/4 • ⛩️ ENTRADA DA EXPANSÃO DE DOMÍNIO (CLÍMAX SONORO 100%)',
        title: 'Invocar Expansão de Domínio: Olho do Maelstrom Astral',
        narrative:
          'Com 6/6 de Afinidade Astral, o Jogador 1 invoca o Olho do Maelstrom Astral (3⚡)! A barreira glacial expande-se por toda a mesa (+1/+1, Ímpeto e Acerto Garantido) e a trilha sonora sobe para intensidade máxima (CLÍMAX 100%)!',
        turnNumber: 7,
        p1Essence: 7,
        p1MaxEssence: 7,
        kind: 'invoke_domain',
      },
      {
        id: 'blu-step-3',
        stepBadge: 'PASSO 3/4 • ENTRADA LENDÁRIA & SOPRO SÔNICO',
        title: 'Invocar Dragão de Safira Sônico na Vanguarda',
        narrative:
          'Sob o Maelstrom Astral ativo, o Jogador 1 seleciona o Dragão de Safira Sônico na mão e o invoca na Vanguarda [V], varrendo a linha inimiga com Sopro Sônico!',
        turnNumber: 8,
        p1Essence: 9,
        p1MaxEssence: 9,
        kind: 'play_card',
        handIndex: 0,
        deployRow: 'vanguard',
        deploySlotIndex: 3,
      },
      {
        id: 'blu-step-4',
        stepBadge: 'PASSO 4/4 • VOO & ACERTO GARANTIDO',
        title: 'Ataque Aéreo Letal sob o Maelstrom Astral',
        narrative:
          'Com os inimigos congelados e a Expansão de Domínio ativa, o Dragão de Safira Sônico e a tropa astral atacam diretamente o Soberano rival para vencer a partida!',
        turnNumber: 8,
        p1Essence: 2,
        p1MaxEssence: 9,
        kind: 'attack_lethal',
      },
    ],
  },
  {
    id: 'abyssal_crypt_domain',
    shortTab: '💀 Cripta Abissal',
    badge: 'COMBO #10 • ECLIPSE DO TRONO DE OSSOS & REANIMAÇÃO DA CRIPTA',
    title: 'Eclipse do Trono de Ossos',
    subtitle: 'Campanário dos Mortos + Expansão Abissal + Lich da Coroa da Entropia',
    comboRef: 'Grimório: Legião da Cripta • Combo Oficial #10',
    accentColor: '#a855f7',
    p1Name: 'Vesperion, Lich (Você)',
    p1AvatarCardId: 'purple_156_lich_coroa_entropia',
    p1Domain: 'purple',
    p1StartingHp: 24,
    p2Name: 'Vorágine, Titã Silvestre',
    p2AvatarCardId: 'green_09_hidra',
    p2Domain: 'green',
    p2StartingHp: 19,
    initialPlayerUnits: [
      { cardId: 'purple_25_dama_seis_laminas', row: 'vanguard', slotIndex: 1 },
      { cardId: 'purple_07_lich', row: 'vanguard', slotIndex: 3 },
    ],
    initialAiUnits: [
      { cardId: 'green_07_troll', row: 'vanguard', slotIndex: 2, damageTaken: 3 },
    ],
    initialHandCardIds: [
      'purple_126_campanario_mortos',
      'purple_156_lich_coroa_entropia',
      'purple_68_exumar_legiao',
      'purple_123_eclipse_abissal',
    ],
    initialChanneledCardIds: [
      'purple_07_lich',
      'purple_25_dama_seis_laminas',
      'purple_68_exumar_legiao',
      'purple_126_campanario_mortos',
      'purple_123_eclipse_abissal',
      'purple_138_soberano_carnica',
    ],
    initialCryptCardIds: ['purple_138_soberano_carnica', 'purple_25_dama_seis_laminas'],
    steps: [
      {
        id: 'pur-step-1',
        stepBadge: 'PASSO 1/4 • RELÍQUIA NECRÓTICA',
        title: 'Posicionar Campanário dos Mortos na Retaguarda',
        narrative:
          'O Jogador 1 escolhe a Relíquia Campanário dos Mortos na mão e a posiciona na Retaguarda [R], concedendo +1/+1 aos seus aliados ao entrar e drenando o Soberano rival todo turno!',
        turnNumber: 6,
        p1Essence: 6,
        p1MaxEssence: 6,
        kind: 'play_card',
        handIndex: 0,
        deployRow: 'rearguard',
        deploySlotIndex: 2,
      },
      {
        id: 'pur-step-2',
        stepBadge: 'PASSO 2/4 • ⛩️ ENTRADA DA EXPANSÃO DE DOMÍNIO (CLÍMAX SONORO 100%)',
        title: 'Invocar Expansão de Domínio: Eclipse do Trono de Ossos',
        narrative:
          'Com 6/6 de Afinidade do Abismo, o Jogador 1 expande o Eclipse do Trono de Ossos (3⚡)! O santuário necrótico envolve o tabuleiro (+1/+1, Ímpeto e Acerto Garantido) e leva a trilha sonora ao CLÍMAX MÁXIMO (100%)!',
        turnNumber: 7,
        p1Essence: 8,
        p1MaxEssence: 8,
        kind: 'invoke_domain',
      },
      {
        id: 'pur-step-3',
        stepBadge: 'PASSO 3/4 • DESCIDA DO ARQUILICH SUPREMO',
        title: 'Invocar Lich da Coroa da Entropia na Vanguarda',
        narrative:
          'Sob o Eclipse do Trono de Ossos, o Jogador 1 seleciona Lich da Coroa da Entropia na mão e o invoca na Vanguarda [V], fortalecendo toda a fileira imortal e drenando a vida inimiga!',
        turnNumber: 8,
        p1Essence: 9,
        p1MaxEssence: 9,
        kind: 'play_card',
        handIndex: 0,
        deployRow: 'vanguard',
        deploySlotIndex: 4,
      },
      {
        id: 'pur-step-4',
        stepBadge: 'PASSO 4/4 • CEIFA IMORTAL COM DRENO DE VIDA',
        title: 'Ataque Total da Legião do Eclipse ao Soberano Rival',
        narrative:
          'Com Acerto Garantido ativo pelo Eclipse do Trono de Ossos, toda a Legião Imortal ataca diretamente o Soberano rival, drenando seus últimos Pontos de Vida!',
        turnNumber: 8,
        p1Essence: 3,
        p1MaxEssence: 9,
        kind: 'attack_lethal',
      },
    ],
  },
];

function createInitialScenarioGameState(sc: SimDuelScenario): GameState {
  const pDeck = ALL_CARDS.filter((c) => c.domain === sc.p1Domain).slice(0, 24);
  const aiDeck = ALL_CARDS.filter((c) => c.domain === sc.p2Domain).slice(0, 24);

  const state = createInitialGameState(pDeck, aiDeck, {
    playerName: sc.p1Name,
    aiName: sc.p2Name,
    aiTitle: 'Soberano Rival',
    aiAvatarCardId: sc.p2AvatarCardId,
    aiStartingHp: sc.p2StartingHp,
  });

  state.turn = sc.steps[0]?.turnNumber ?? 6;
  state.activePlayer = 'player';
  state.phase = 'main';

  state.player.avatarCardId = sc.p1AvatarCardId;
  state.player.hp = sc.p1StartingHp;
  state.player.maxHp = 40;
  state.player.currentEssence = sc.steps[0]?.p1Essence ?? 6;
  state.player.maxEssence = sc.steps[0]?.p1MaxEssence ?? 6;
  state.player.deck = pDeck.slice(8);
  state.player.hand = sc.initialHandCardIds.map(resolveRealCard);
  state.player.channeledCards = sc.initialChanneledCardIds.map(resolveRealCard);
  state.player.crypt = sc.initialCryptCardIds.map(resolveRealCard);
  state.player.affinities = {
    red: sc.p1Domain === 'red' ? 6 : 0,
    blue: sc.p1Domain === 'blue' ? 6 : 0,
    purple: sc.p1Domain === 'purple' ? 6 : 0,
    green: sc.p1Domain === 'green' ? 6 : 0,
    gold: sc.p1Domain === 'gold' ? 6 : 0,
    neutral: 0,
  };
  state.player.vanguard = Array(6).fill(null);
  state.player.rearguard = Array(6).fill(null);
  state.player.vanguardStacks = Array.from({ length: 6 }, () => []);
  state.player.rearguardStacks = Array.from({ length: 6 }, () => []);

  state.ai.hp = sc.p2StartingHp;
  state.ai.maxHp = 40;
  state.ai.currentEssence = 4;
  state.ai.maxEssence = 6;
  state.ai.affinities = {
    red: sc.p2Domain === 'red' ? 6 : 0,
    blue: sc.p2Domain === 'blue' ? 6 : 0,
    purple: sc.p2Domain === 'purple' ? 6 : 0,
    green: sc.p2Domain === 'green' ? 6 : 0,
    gold: sc.p2Domain === 'gold' ? 6 : 0,
    neutral: 0,
  };
  state.ai.vanguard = Array(6).fill(null);
  state.ai.rearguard = Array(6).fill(null);
  state.ai.vanguardStacks = Array.from({ length: 6 }, () => []);
  state.ai.rearguardStacks = Array.from({ length: 6 }, () => []);

  const makeUnit = (
    placement: InitialUnitPlacement,
    owner: 'player' | 'ai',
    idx: number,
  ): BoardUnit => {
    const card = resolveRealCard(placement.cardId);
    const hp = Math.max(1, card.hp - (placement.damageTaken ?? 0));
    return {
      instanceId: `sim-unit-${owner}-${placement.row}-${placement.slotIndex}-${idx}`,
      cardId: card.id,
      card,
      owner,
      row: placement.row,
      slotIndex: placement.slotIndex,
      currentAtk: card.atk,
      currentArmor: card.armor,
      currentHp: hp,
      maxHp: card.hp,
      keywords: [...card.keywords],
      regeneration: card.regeneration ?? 0,
      hasSummoningSickness: false,
      hasAttackedThisTurn: false,
      isFrozen: false,
      hasDivineShield: card.keywords.includes('Escudo Divino'),
      isAscended: false,
      hasRebornTriggered: false,
      stance: 'attack',
    };
  };

  sc.initialPlayerUnits.forEach((p, idx) => {
    addUnitToSlot(state.player, p.row, p.slotIndex, makeUnit(p, 'player', idx));
  });

  sc.initialAiUnits.forEach((p, idx) => {
    addUnitToSlot(state.ai, p.row, p.slotIndex, makeUnit(p, 'ai', idx));
  });

  if (sc.initialEnemyDomain) {
    const spec = getDomainExpansionSpec(sc.initialEnemyDomain);
    state.domainExpansion = {
      owner: 'ai',
      domain: spec.domain,
      name: spec.name,
      subtitle: spec.subtitle,
      icon: spec.icon,
      potencyDesc: spec.potencyDesc,
      sureHitDesc: spec.sureHitDesc,
      turnsRemaining: 3,
      damageTakenByOwnerThisRound: 0,
      simpleDomainProtectedActor: null,
    };
  }

  state.feedbacks = [];
  recalculateFormationBonuses(state);
  return state;
}

function prepareStepBeforeState(baseState: GameState, step: SimEngineStep): GameState {
  const next = cloneGameState(baseState);
  next.turn = step.turnNumber;
  next.activePlayer = 'player';
  next.phase = 'main';
  next.player.currentEssence = step.p1Essence;
  next.player.maxEssence = Math.max(next.player.maxEssence, step.p1MaxEssence);
  next.player.hasChanneledThisTurn = false;
  next.feedbacks = [];
  for (const u of getAllBoardUnits(next.player)) {
    u.hasSummoningSickness = false;
    u.hasAttackedThisTurn = false;
  }
  recalculateFormationBonuses(next);
  return next;
}

function applyStepResolution(preState: GameState, step: SimEngineStep): GameState {
  let state = cloneGameState(preState);
  state.feedbacks = [];

  if (step.alsoInvokeDomainExpansion) {
    state.player.currentEssence = Math.max(state.player.currentEssence, 3);
    state = invokeDomainExpansion(state, 'player');
    state.player.currentEssence = step.p1Essence;
  }

  if (step.kind === 'invoke_domain') {
    state.player.currentEssence = Math.max(state.player.currentEssence, 3);
    state = invokeDomainExpansion(state, 'player');
  } else if (step.kind === 'domain_clash') {
    if (step.rivalInvokesDomain) {
      state.ai.currentEssence = Math.max(state.ai.currentEssence, 3);
      state = invokeDomainExpansion(state, 'ai');
    } else {
      state.player.currentEssence = Math.max(state.player.currentEssence, 3);
      state = invokeDomainExpansion(state, 'player');
    }
    if (step.ascendRow !== undefined && step.ascendSlotIndex !== undefined) {
      const targetUnit = getSlotUnits(state.player, step.ascendRow, step.ascendSlotIndex)[0];
      if (targetUnit) {
        const ascCost = targetUnit.card.ascension?.cost ?? 4;
        state.player.currentEssence = Math.max(state.player.currentEssence, ascCost);
        state = ascendUnit(state, 'player', targetUnit.instanceId);
      }
    }
  } else if (step.kind === 'play_card') {
    if (step.shatterRivalDomain && state.player.hand.length > 1) {
      state.player.hasChanneledThisTurn = false;
      state = channelCard(state, 'player', state.player.hand.length - 1);
      state.feedbacks.push({
        id: `fb-shatter-${Date.now()}`,
        targetId: 'ai-sovereign',
        text: '💥 BARREIRA ROMPIDA (7 vs 6)!',
        color: 'damage',
      });
    }
    const hIdx = step.handIndex ?? 0;
    const card = state.player.hand[hIdx];
    if (card) {
      state.player.currentEssence = Math.max(state.player.currentEssence, card.cost);
      let targetUnitId: string | undefined;
      if (step.spellTargetSlotIndex !== undefined && step.spellTargetRow) {
        const ownerState = step.spellTargetOwner === 'player' ? state.player : state.ai;
        const units = getSlotUnits(ownerState, step.spellTargetRow, step.spellTargetSlotIndex);
        targetUnitId = units[0]?.instanceId;
      }
      state = playCard(state, 'player', hIdx, {
        row: step.deployRow,
        slotIndex: step.deploySlotIndex,
        targetId: targetUnitId,
      });
    }
  } else if (step.kind === 'domain_and_ascend') {
    state.player.currentEssence = Math.max(state.player.currentEssence, 7);
    state = invokeDomainExpansion(state, 'player');
    const row = step.ascendRow ?? 'vanguard';
    const slotIdx = step.ascendSlotIndex ?? 1;
    const targetUnit = getSlotUnits(state.player, row, slotIdx)[0];
    if (targetUnit) {
      const ascCost = targetUnit.card.ascension?.cost ?? 4;
      state.player.currentEssence = Math.max(state.player.currentEssence, ascCost);
      state = ascendUnit(state, 'player', targetUnit.instanceId);
    }
  } else if (step.kind === 'attack_lethal') {
    const readyUnits = getAllBoardUnits(state.player);
    for (const u of readyUnits) {
      if (state.phase === 'gameover') break;
      const validTargets = getValidAttackTargets(state, u.instanceId);
      if (validTargets.length === 0) continue;
      const chosenTarget = validTargets.includes('ai-sovereign')
        ? 'ai-sovereign'
        : validTargets[0];
      state = executeAttack(state, u.instanceId, chosenTarget);
    }
  }

  recalculateFormationBonuses(state);
  return state;
}

export interface HomeSimulatedDuelShowcaseProps {
  onInspectCard: (card: CardDefinition) => void;
  onPlayDuelNow?: () => void;
  onEnterArena?: () => void;
  onOpenCombosCompendium?: () => void;
  onOpenCombosGuide?: () => void;
  soundMuted?: boolean;
  onToggleSound?: () => void;
}

export const HomeSimulatedDuelShowcase: React.FC<HomeSimulatedDuelShowcaseProps> = ({
  onInspectCard,
  onPlayDuelNow,
  onEnterArena,
  onOpenCombosCompendium,
  onOpenCombosGuide,
  soundMuted,
  onToggleSound,
}) => {
  const handleEnterArena = onPlayDuelNow ?? onEnterArena ?? (() => {});
  const handleOpenCombos = onOpenCombosCompendium ?? onOpenCombosGuide ?? (() => {});

  const [scenarioIdx, setScenarioIdx] = useState<number>(0);
  const [stepIdx, setStepIdx] = useState<number>(0);
  const [subPhase, setSubPhase] = useState<SimSubPhase>('hand');
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [paceMode, setPaceMode] = useState<'human' | 'fast'>('human');
  const [isAudioLive, setIsAudioLive] = useState<boolean>(() => !soundMuted);
  const [musicState, setLiveMusicState] = useState<MusicStateDescriptor>(() =>
    getCurrentMusicState(),
  );

  const [isP2DrawerPinned, setIsP2DrawerPinned] = useState<boolean>(false);
  const [isP1DrawerPinned, setIsP1DrawerPinned] = useState<boolean>(false);
  const [isCommandDockMinimized, setIsCommandDockMinimized] = useState<boolean>(false);
  const [userHoveredCardInfo, setUserHoveredCardInfo] = useState<{
    card: CardDefinition;
    unit?: BoardUnit;
  } | null>(null);

  const [arenaShake, setArenaShake] = useState<'light' | 'heavy' | null>(null);
  const [domainExitAnim, setDomainExitAnim] = useState<{
    domain: Exclude<Domain, 'neutral'>;
    name: string;
    icon: string;
    mode: 'expire' | 'shatter';
    reasonText: string;
  } | null>(null);
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

  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return subscribeMusicState(setLiveMusicState);
  }, []);

  const scenario = SIM_DUEL_SCENARIOS[scenarioIdx] ?? SIM_DUEL_SCENARIOS[0];
  const step = scenario.steps[stepIdx] ?? scenario.steps[0];

  // Compute exact beforeState and afterState using the real src/engine/gameEngine.ts
  const { beforeState, afterState } = useMemo(() => {
    let running = createInitialScenarioGameState(scenario);
    for (let i = 0; i < stepIdx; i += 1) {
      const priorStep = scenario.steps[i];
      if (priorStep) {
        const pre = prepareStepBeforeState(running, priorStep);
        running = applyStepResolution(pre, priorStep);
      }
    }
    const currentBefore = prepareStepBeforeState(running, step);
    const currentAfter = applyStepResolution(currentBefore, step);
    return { beforeState: currentBefore, afterState: currentAfter };
  }, [scenario, stepIdx, step]);

  const gameState: GameState = subPhase === 'impact' ? afterState : beforeState;
  const isPlayerTurn = true;

  // Derive authentic BattleArena UI states from current step & subPhase
  const selectedHandIndex: number | null =
    subPhase === 'dock' && step.kind === 'play_card' ? (step.handIndex ?? 0) : null;

  const isHandPinnedOpen: boolean =
    subPhase === 'hand' && step.kind === 'play_card' && !isP1DrawerPinned && !isP2DrawerPinned;

  const simHoveredHandIdx: number | null =
    subPhase === 'hand' && step.kind === 'play_card' ? (step.handIndex ?? 0) : null;

  const focusedBoardUnitId: string | null = useMemo(() => {
    if (
      (step.kind === 'domain_and_ascend' ||
        (step.kind === 'domain_clash' && step.ascendRow !== undefined)) &&
      subPhase === 'dock'
    ) {
      const u = getSlotUnits(
        beforeState.player,
        step.ascendRow ?? 'vanguard',
        step.ascendSlotIndex ?? 1,
      )[0];
      return u?.instanceId ?? null;
    }
    return null;
  }, [step, subPhase, beforeState]);

  const selectedAttackerId: string | null = useMemo(() => {
    if (step.kind === 'attack_lethal' && (subPhase === 'hand' || subPhase === 'dock')) {
      const ready = getAllBoardUnits(beforeState.player).filter(
        (u) => getValidAttackTargets(beforeState, u.instanceId).length > 0,
      );
      const best =
        ready.sort((a, b) => b.currentAtk - a.currentAtk)[0] ?? ready[0] ?? null;
      return best?.instanceId ?? null;
    }
    return null;
  }, [step, subPhase, beforeState]);

  const hoveredAttackTargetId: string | null = useMemo(() => {
    if (step.kind === 'attack_lethal' && subPhase === 'dock' && selectedAttackerId) {
      const targets = getValidAttackTargets(beforeState, selectedAttackerId);
      return targets.includes('ai-sovereign') ? 'ai-sovereign' : (targets[0] ?? null);
    }
    return null;
  }, [step, subPhase, beforeState, selectedAttackerId]);

  // Auto-open Sovereign 1 drawer during 'hand' phase of Domain Expansion invocation steps
  useEffect(() => {
    if (
      (step.kind === 'invoke_domain' ||
        (step.kind === 'domain_clash' && !step.rivalInvokesDomain) ||
        step.kind === 'domain_and_ascend') &&
      subPhase === 'hand'
    ) {
      setIsP1DrawerPinned(true);
      setIsP2DrawerPinned(false);
    } else if (step.kind === 'domain_clash' && step.rivalInvokesDomain && subPhase === 'hand') {
      setIsP2DrawerPinned(true);
      setIsP1DrawerPinned(false);
    } else {
      setIsP1DrawerPinned(false);
      setIsP2DrawerPinned(false);
    }
    setIsCommandDockMinimized(false);
  }, [scenarioIdx, stepIdx, subPhase, step.kind, step.rivalInvokesDomain]);

  // Keep showcase audio synced with global navbar mute button
  useEffect(() => {
    if (soundMuted !== undefined) {
      setIsAudioLive(!soundMuted);
    }
  }, [soundMuted]);

  // Real-time Adaptive Music Intensity & Domain Escalation:
  // Whenever Player 1's Domain Expansion or a 50/50 Domain Clash is active or being invoked, music reaches MAXIMUM INTENSITY ('climax' 100%)!
  useEffect(() => {
    if (!isAudioLive || soundMuted) return;

    const pUnits = getAllBoardUnits(gameState.player);
    const aiUnits = getAllBoardUnits(gameState.ai);
    const allUnits = [...pUnits, ...aiUnits];
    const hasAscendedUnit = allUnits.some((u) => u.isAscended);
    const hasLegendaryUnit = allUnits.some((u) => u.card.rarity === 'legendary');

    const activeDomain: Domain = gameState.domainExpansion
      ? gameState.domainExpansion.domain
      : scenario.p1Domain;

    const isPlayerDomainActive =
      gameState.domainExpansion?.owner === 'player' ||
      Boolean(gameState.domainExpansion?.clashRival);
    const isInvokingDomainStep =
      step.kind === 'invoke_domain' ||
      step.kind === 'domain_clash' ||
      step.kind === 'domain_and_ascend';
    const isNearDeath = gameState.player.hp <= 14 || gameState.ai.hp <= 14;

    let stage: MusicIntensityStage = 'battle';
    if (
      isPlayerDomainActive ||
      isInvokingDomainStep ||
      hasAscendedUnit ||
      isNearDeath ||
      gameState.phase === 'gameover'
    ) {
      stage = 'climax';
    } else if (gameState.domainExpansion || hasLegendaryUnit) {
      stage = 'domain_clash';
    } else {
      stage = 'battle';
    }

    setMusicState(stage, activeDomain, false);
    startAdaptiveMusic();
  }, [gameState, step.kind, isAudioLive, soundMuted, scenario.p1Domain]);

  // Helper to measure element coordinates relative to .arena-fullscreen-stage
  const getStageRelativeCenter = (selector: string): { x: number; y: number } | null => {
    const stageEl = stageRef.current;
    if (!stageEl) return null;
    const el = stageEl.querySelector(selector) as HTMLElement | null;
    if (!el) return null;
    const sRect = stageEl.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return {
      x: Math.round(r.left - sRect.left + r.width / 2),
      y: Math.round(r.top - sRect.top + r.height / 2),
    };
  };

  const triggerScreenShake = (intensity: 'light' | 'heavy') => {
    setArenaShake(intensity);
    window.setTimeout(() => setArenaShake(null), intensity === 'heavy' ? 520 : 340);
  };

  // Trigger authentic BattleArena.tsx spectacles, domain entrance/clash/shatter, combat lunges & soundEngine SFX on subPhase change
  useEffect(() => {
    setCombatAnim(null);
    setSpectacleFx(null);
    setDomainExitAnim(null);

    const canPlaySound = isAudioLive && !soundMuted;

    if (subPhase === 'hand') {
      if (canPlaySound) playSfx('draw');
      return;
    }

    if (subPhase === 'dock') {
      if (canPlaySound) playSfx('channel');
      return;
    }

    // subPhase === 'impact': Trigger authentic BattleArena.tsx visual & audio spectacles!
    const timers: number[] = [];

    if (step.kind === 'invoke_domain') {
      const spec = getDomainExpansionSpec(scenario.p1Domain);
      const pCard = CARDS_BY_ID[beforeState.player.avatarCardId] ?? ALL_CARDS[0];
      const sovPos = getStageRelativeCenter('[data-combat-id="player-sovereign"]') ?? {
        x: 420,
        y: 590,
      };
      triggerScreenShake('heavy');
      setSpectacleFx({
        kind: 'sovereign',
        card: pCard,
        domain: spec.domain,
        title: `⛩️ EXPANSÃO DE DOMÍNIO: ${spec.name.toUpperCase()}`,
        subtitle: `${spec.potencyDesc} • ${spec.sureHitDesc}`,
        targetX: sovPos.x,
        targetY: sovPos.y,
      });
      if (canPlaySound) {
        playSfx('domain_expand');
      }
    } else if (step.kind === 'domain_clash') {
      const pSpec = getDomainExpansionSpec(scenario.p1Domain);
      const aiSpec = getDomainExpansionSpec(scenario.p2Domain);
      const actorOwner = step.rivalInvokesDomain ? 'ai' : 'player';
      const actorCard =
        CARDS_BY_ID[beforeState[actorOwner].avatarCardId] ?? ALL_CARDS[0];
      const sovPos = getStageRelativeCenter(`[data-combat-id="${actorOwner}-sovereign"]`) ?? {
        x: 420,
        y: actorOwner === 'player' ? 590 : 32,
      };
      triggerScreenShake('heavy');
      setSpectacleFx({
        kind: 'sovereign',
        card: actorCard,
        domain: step.rivalInvokesDomain ? aiSpec.domain : pSpec.domain,
        title: `⚡⛩️ DISPUTA DE DOMÍNIOS: ${pSpec.name.toUpperCase()} vs ${aiSpec.name.toUpperCase()}`,
        subtitle:
          'As duas barreiras colidem 50/50 no centro da mesa! O Acerto Garantido de ambos os Soberanos foi ANULADO!',
        targetX: sovPos.x,
        targetY: sovPos.y,
      });
      if (canPlaySound) {
        playSfx('domain_clash');
        if (step.ascendRow !== undefined) {
          timers.push(window.setTimeout(() => playSfx('ascend'), 280));
        }
      }
    } else if (step.kind === 'play_card') {
      const card = beforeState.player.hand[step.handIndex ?? 0];
      if (card) {
        const isRowSpell = card.effects.some(
          (e) =>
            e.type === 'damage_enemy_row' ||
            e.type === 'freeze_enemy_vanguard' ||
            e.type === 'debuff_enemy_vanguard_atk',
        );

        if ((card.breathDamage && card.breathDamage > 0) || isRowSpell) {
          const targetRowName: RowType = beforeState.ai.vanguard.some((u) => u !== null)
            ? 'vanguard'
            : 'rearguard';
          const targetLaneId = `ai-${targetRowName}`;
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
          if (canPlaySound) {
            playSfx(card.type === 'creature' ? 'summon' : 'spell');
            timers.push(window.setTimeout(() => playSfx('spell'), 220));
          }
        } else if (
          card.rarity === 'legendary' &&
          (card.type === 'creature' || card.type === 'relic')
        ) {
          triggerScreenShake('heavy');
          setSpectacleFx({
            kind: 'legendary',
            card,
            domain: card.domain,
            title: `👑 ENTRADA LENDÁRIA: ${card.name.toUpperCase()}`,
            subtitle: card.description || card.flavorText,
          });
          if (canPlaySound) playSfx('summon');
        } else {
          const casterPos = getStageRelativeCenter('[data-combat-id="player-sovereign"]') ?? {
            x: 420,
            y: 590,
          };
          const targetPos = { x: 420, y: 310 };
          const dx = targetPos.x - casterPos.x;
          const dy = targetPos.y - casterPos.y;
          triggerScreenShake('light');
          setSpectacleFx({
            kind: 'spell',
            card,
            domain: card.domain,
            title: `✨ ${card.name.toUpperCase()}`,
            subtitle: card.description,
            startX: casterPos.x,
            startY: casterPos.y,
            targetX: targetPos.x,
            targetY: targetPos.y,
            angleDeg: Math.round((Math.atan2(dy, dx) * 180) / Math.PI),
            distancePx: Math.round(Math.hypot(dx, dy)),
          });
          if (canPlaySound) {
            playSfx(card.type === 'spell' || card.type === 'reaction' ? 'spell' : 'summon');
          }
        }

        if (step.shatterRivalDomain) {
          const rivalSpec = getDomainExpansionSpec(scenario.p2Domain);
          setDomainExitAnim({
            domain: rivalSpec.domain,
            name: rivalSpec.name,
            icon: rivalSpec.icon,
            mode: 'shatter',
            reasonText: `💥 BARREIRA RIVAL ROMPIDA! [${rivalSpec.name.toUpperCase()}] ESTILHAÇADO!`,
          });
          if (canPlaySound) {
            timers.push(window.setTimeout(() => playSfx('domain_shatter'), 240));
          }
        }
      }
    } else if (step.kind === 'domain_and_ascend') {
      const targetUnit = getSlotUnits(
        afterState.player,
        step.ascendRow ?? 'vanguard',
        step.ascendSlotIndex ?? 1,
      )[0];
      if (targetUnit) {
        const pos = getStageRelativeCenter(`[data-combat-id="${targetUnit.instanceId}"]`) ?? {
          x: 340,
          y: 260,
        };
        const spec = targetUnit.card.ascension;
        triggerScreenShake('heavy');
        setSpectacleFx({
          kind: 'ascend',
          card: targetUnit.card,
          domain: targetUnit.card.domain,
          title: `🔥 ASCENSÃO: ★ ${(spec?.newName ?? targetUnit.card.name).toUpperCase()}`,
          subtitle: spec
            ? `Evoluiu para ${spec.newAtk}/${spec.newMaxHp} (ARM ${spec.newArmor})!`
            : 'Poder Desperto!',
          targetX: pos.x,
          targetY: pos.y,
        });
      }
      if (canPlaySound) {
        playSfx('domain_expand');
        timers.push(window.setTimeout(() => playSfx('ascend'), 280));
      }
    } else if (step.kind === 'attack_lethal') {
      const ready = getAllBoardUnits(beforeState.player);
      const lead = ready.sort((a, b) => b.currentAtk - a.currentAtk)[0] ?? ready[0];
      if (lead) {
        const aPos = getStageRelativeCenter(`[data-combat-id="${lead.instanceId}"]`) ?? {
          x: 420,
          y: 270,
        };
        const tPos = getStageRelativeCenter('[data-combat-id="ai-sovereign"]') ?? {
          x: 420,
          y: 24,
        };
        const dx = tPos.x - aPos.x;
        const dy = tPos.y - aPos.y;
        const isRanged = lead.keywords.includes('Alcance') && lead.row === 'rearguard';
        triggerScreenShake('heavy');
        setCombatAnim({
          attackerId: lead.instanceId,
          targetId: 'ai-sovereign',
          startX: aPos.x,
          startY: aPos.y,
          lungeX: isRanged ? Math.round(dx * 0.12) : Math.round(dx * 0.72),
          lungeY: isRanged ? Math.round(dy * 0.12) : Math.round(dy * 0.72),
          impactX: tPos.x,
          impactY: tPos.y,
          angleDeg: Math.round((Math.atan2(dy, dx) * 180) / Math.PI),
          distancePx: Math.round(Math.hypot(dx, dy)),
          isRanged,
          isHeavyHit: true,
          domain: lead.card.domain,
        });
      }
      if (canPlaySound) {
        playSfx('attack');
        timers.push(window.setTimeout(() => playSfx('hit'), 260));
        timers.push(window.setTimeout(() => playSfx('victory'), 620));
      }
    }

    timers.push(
      window.setTimeout(() => {
        setSpectacleFx(null);
        setCombatAnim(null);
      }, 2150),
    );

    timers.push(
      window.setTimeout(() => {
        setDomainExitAnim(null);
      }, 2350),
    );

    return () => {
      for (const t of timers) window.clearTimeout(t);
    };
  }, [subPhase, step, beforeState, afterState, isAudioLive, soundMuted, scenario.p1Domain, scenario.p2Domain]);

  // Unlock Web Audio on first user interaction anywhere on the page
  useEffect(() => {
    let unlocked = false;
    const unsub = onAudioUnlocked(() => {
      if (unlocked) return;
      unlocked = true;
      if (isAudioLive && !soundMuted) {
        startAdaptiveMusic();
        playSfx('draw');
      }
    });
    return () => unsub();
  }, [isAudioLive, soundMuted]);

  // Automatic progression timer matching human tabletop cadence
  useEffect(() => {
    if (!isAutoPlaying) return undefined;

    const baseMs = subPhase === 'hand' ? 4300 : subPhase === 'dock' ? 4500 : 5200;
    const durationMs = paceMode === 'human' ? baseMs : Math.round(baseMs * 0.58);

    const timer = window.setTimeout(() => {
      if (subPhase === 'hand') {
        setSubPhase('dock');
      } else if (subPhase === 'dock') {
        setSubPhase('impact');
      } else {
        setSubPhase('hand');
        if (stepIdx < scenario.steps.length - 1) {
          setStepIdx((prev) => prev + 1);
        } else {
          setStepIdx(0);
          setScenarioIdx((prev) => (prev + 1) % SIM_DUEL_SCENARIOS.length);
        }
      }
    }, durationMs);

    return () => window.clearTimeout(timer);
  }, [isAutoPlaying, paceMode, subPhase, stepIdx, scenario.steps.length]);

  const handleToggleAudio = () => {
    getSharedAudioContext();
    const next = !isAudioLive;
    setIsAudioLive(next);
    if (next) {
      if (soundMuted && onToggleSound) onToggleSound();
      startAdaptiveMusic();
      playSfx('draw');
    } else if (!soundMuted && onToggleSound) {
      onToggleSound();
    }
  };

  const handlePrevStep = () => {
    setIsAutoPlaying(false);
    if (subPhase === 'impact') {
      setSubPhase('dock');
    } else if (subPhase === 'dock') {
      setSubPhase('hand');
    } else if (stepIdx > 0) {
      setStepIdx((prev) => prev - 1);
      setSubPhase('hand');
    } else {
      const prevSc = (scenarioIdx - 1 + SIM_DUEL_SCENARIOS.length) % SIM_DUEL_SCENARIOS.length;
      setScenarioIdx(prevSc);
      setStepIdx(SIM_DUEL_SCENARIOS[prevSc].steps.length - 1);
      setSubPhase('hand');
    }
  };

  const handleNextStep = () => {
    setIsAutoPlaying(false);
    if (subPhase === 'hand') {
      setSubPhase('dock');
    } else if (subPhase === 'dock') {
      setSubPhase('impact');
    } else if (stepIdx < scenario.steps.length - 1) {
      setStepIdx((prev) => prev + 1);
      setSubPhase('hand');
    } else {
      setScenarioIdx((prev) => (prev + 1) % SIM_DUEL_SCENARIOS.length);
      setStepIdx(0);
      setSubPhase('hand');
    }
  };

  // Authentic BattleArena derived combat & feedback maps
  const feedbackMap = useMemo(() => {
    const map: Record<string, FloatingFeedback> = {};
    for (const fb of gameState.feedbacks) {
      map[fb.targetId] = fb;
    }
    return map;
  }, [gameState.feedbacks]);

  const validAttackTargets = useMemo(() => {
    if (!selectedAttackerId) return [];
    return getValidAttackTargets(gameState, selectedAttackerId);
  }, [gameState, selectedAttackerId]);

  const allTargetPreviews = useMemo(() => {
    const map: Record<string, CombatPreviewResult> = {};
    if (!selectedAttackerId) return map;
    for (const tId of validAttackTargets) {
      const res = previewAttackOutcome(gameState, selectedAttackerId, tId);
      if (res) map[tId] = res;
    }
    return map;
  }, [gameState, selectedAttackerId, validAttackTargets]);

  const combatPreview: CombatPreviewResult | null = useMemo(() => {
    if (!selectedAttackerId) return null;
    const tId =
      hoveredAttackTargetId ??
      (validAttackTargets.includes('ai-sovereign')
        ? 'ai-sovereign'
        : (validAttackTargets[0] ?? null));
    if (!tId) return null;
    return allTargetPreviews[tId] ?? null;
  }, [selectedAttackerId, hoveredAttackTargetId, validAttackTargets, allTargetPreviews]);

  const selectedHandCard: CardDefinition | null =
    selectedHandIndex !== null ? (gameState.player.hand[selectedHandIndex] ?? null) : null;

  const canPlaySelectedHandCard = useMemo(
    () =>
      selectedHandCard
        ? canPlayCard(gameState, 'player', selectedHandCard)
        : { allowed: false },
    [gameState, selectedHandCard],
  );

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
    canDeployToSlot(gameState.player, 'vanguard', i),
  );
  const hasEmptyRearguard = [0, 1, 2, 3, 4, 5].some((i) =>
    canDeployToSlot(gameState.player, 'rearguard', i),
  );

  const readyPlayerUnits = useMemo(
    () =>
      getAllBoardUnits(gameState.player).filter(
        (u) => getValidAttackTargets(gameState, u.instanceId).length > 0,
      ),
    [gameState],
  );

  const aiAvatarCard = CARDS_BY_ID[gameState.ai.avatarCardId] ?? ALL_CARDS[0];
  const playerAvatarCard = CARDS_BY_ID[gameState.player.avatarCardId] ?? ALL_CARDS[0];

  // Hover card info: either user-hovered card or simulated player's hovered hand card during 'hand' phase
  const activeHoverCardInfo = useMemo(() => {
    if (userHoveredCardInfo) return userHoveredCardInfo;
    if (simHoveredHandIdx !== null) {
      const c = gameState.player.hand[simHoveredHandIdx];
      if (c) return { card: c };
    }
    return null;
  }, [userHoveredCardInfo, simHoveredHandIdx, gameState.player.hand]);

  const handleHoverCard = (card: CardDefinition | null, unit?: BoardUnit) => {
    if (!card) {
      setUserHoveredCardInfo(null);
    } else {
      setUserHoveredCardInfo({ card, unit });
    }
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
          <span className="tcp-dmg-splash">
            • ÁREA ({prev.slotSplashCount + 1} no slot)
          </span>
        )}
      </div>
    );
  };

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
    <div className="home-simulated-arena">
      {/* Top Scenario Switcher & Live Controls */}
      <div className="sim-arena-top-controls">
        <div
          className="sim-arena-scenario-tabs"
          role="tablist"
          aria-label="Duelos Temáticos Simulados"
        >
          {SIM_DUEL_SCENARIOS.map((sc, idx) => {
            const isActive = idx === scenarioIdx;
            return (
              <button
                key={sc.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`sim-arena-tab-btn ${isActive ? 'is-active' : ''}`}
                style={
                  isActive
                    ? ({
                        borderColor: sc.accentColor,
                        boxShadow: `0 0 14px ${sc.accentColor}44`,
                      } as React.CSSProperties)
                    : undefined
                }
                onClick={() => {
                  if (isAudioLive && !soundMuted) startAdaptiveMusic();
                  setScenarioIdx(idx);
                  setStepIdx(0);
                  setSubPhase('hand');
                }}
              >
                {sc.shortTab}
              </button>
            );
          })}
        </div>

        <div className="sim-arena-playback-bar">
          <button
            type="button"
            className={`sim-arena-ctrl-btn ${isAudioLive ? 'is-audio-live' : ''}`}
            onClick={handleToggleAudio}
            title="Ativar efeitos sonoros e trilha sonora real da Arena"
          >
            {isAudioLive ? '🔊 Som: ON' : '🔇 Ativar Som & Música'}
          </button>
          <span
            className={`sim-arena-ctrl-btn ${musicState.stage === 'climax' ? 'is-active' : ''}`}
            style={{
              cursor: 'default',
              borderColor:
                musicState.stage === 'climax'
                  ? 'rgba(239, 68, 68, 0.9)'
                  : 'rgba(148, 163, 184, 0.35)',
              background:
                musicState.stage === 'climax'
                  ? 'linear-gradient(135deg, rgba(153, 27, 27, 0.85), rgba(180, 83, 9, 0.85))'
                  : 'rgba(15, 23, 42, 0.78)',
              color: musicState.stage === 'climax' ? '#fef08a' : '#cbd5e1',
              fontWeight: 800,
            }}
            title={`Intensidade Musical Atual: ${musicState.label} (${Math.round(
              (STAGE_TARGET_VOLUMES[musicState.stage] ?? 0.65) * 100,
            )}% Volume)`}
          >
            {!isAudioLive || soundMuted
              ? '🔇 Trilha Silenciada'
              : musicState.stage === 'climax'
              ? '🎵🔥 Trilha: CLÍMAX MÁXIMO (100%)'
              : musicState.stage === 'domain_clash'
              ? '🎵⚡ Trilha: Pressão Arcana (82%)'
              : '🎵⚔️ Trilha: Combate (65%)'}
          </span>
          <button
            type="button"
            className="sim-arena-ctrl-btn"
            onClick={handlePrevStep}
            title="Voltar fase/passo anterior"
          >
            ⏮ Anterior
          </button>
          <button
            type="button"
            className={`sim-arena-ctrl-btn ${isAutoPlaying ? 'is-active' : ''}`}
            onClick={() => {
              if (isAudioLive && !soundMuted) startAdaptiveMusic();
              setIsAutoPlaying((prev) => !prev);
            }}
          >
            {isAutoPlaying ? '⏸ Pausar' : '▶ Continuar'}
          </button>
          <button
            type="button"
            className="sim-arena-ctrl-btn"
            onClick={handleNextStep}
            title="Avançar para a próxima fase/passo"
          >
            ⏭ Próximo
          </button>
          <button
            type="button"
            className={`sim-arena-ctrl-btn ${paceMode === 'human' ? 'is-active' : ''}`}
            onClick={() => setPaceMode((prev) => (prev === 'human' ? 'fast' : 'human'))}
            title="Alternar entre o ritmo natural de uma partida humana e ritmo rápido"
          >
            {paceMode === 'human' ? '🧑 Ritmo Humano (1x)' : '⚡ Rápido (1.8x)'}
          </button>
          <button
            type="button"
            className="sim-arena-ctrl-btn"
            onClick={handleOpenCombos}
            title="Ver os 62 Combos no Guia Tático"
          >
            📖 {scenario.comboRef}
          </button>
        </div>
      </div>

      {/* Step & Micro-Phase Strip */}
      <div className="sim-arena-director-strip">
        <div className="sim-arena-step-pills">
          {scenario.steps.map((st, idx) => (
            <button
              key={st.id}
              type="button"
              className={`sim-step-pill-btn ${idx === stepIdx ? 'is-active' : ''}`}
              onClick={() => {
                if (isAudioLive && !soundMuted) startAdaptiveMusic();
                setIsAutoPlaying(false);
                setStepIdx(idx);
                setSubPhase('hand');
              }}
            >
              Passo {idx + 1}/{scenario.steps.length}
            </button>
          ))}
        </div>

        <div className="sim-arena-subphase-pills">
          <button
            type="button"
            className={`sim-subphase-btn ${subPhase === 'hand' ? 'is-active' : ''}`}
            onClick={() => {
              if (isAudioLive && !soundMuted) startAdaptiveMusic();
              setIsAutoPlaying(false);
              setSubPhase('hand');
            }}
          >
            1. 🃏 Mão / Preparação
          </button>
          <span className="sim-subphase-arrow">→</span>
          <button
            type="button"
            className={`sim-subphase-btn ${subPhase === 'dock' ? 'is-active' : ''}`}
            onClick={() => {
              if (isAudioLive && !soundMuted) startAdaptiveMusic();
              setIsAutoPlaying(false);
              setSubPhase('dock');
            }}
          >
            2. 🎯 Comando & Alvo
          </button>
          <span className="sim-subphase-arrow">→</span>
          <button
            type="button"
            className={`sim-subphase-btn ${subPhase === 'impact' ? 'is-active' : ''}`}
            onClick={() => {
              if (isAudioLive && !soundMuted) startAdaptiveMusic();
              setIsAutoPlaying(false);
              setSubPhase('impact');
            }}
          >
            3. 💥 Resolução na Mesa
          </button>
        </div>
      </div>

      {/* Narrative Callout Banner */}
      <div className="sim-arena-narrative-bar">
        <div className="sim-narrative-main">
          <span className="sim-narrative-badge">{step.stepBadge}</span>
          <strong className="sim-narrative-title">{step.title}:</strong>{' '}
          <span className="sim-narrative-text">{step.narrative}</span>
        </div>
      </div>

      {/* =====================================================================
          AUTHENTIC BATTLE ARENA STAGE (100% IDENTICAL DOM, CSS & ENGINE TO BattleArena.tsx!)
          ===================================================================== */}
      <div
        className={`arena-main-column mtg-arena-table sim-authentic-arena-table ${
          arenaShake ? `arena-shake-${arenaShake}` : ''
        }`}
      >
        <div
          ref={stageRef}
          className="arena-fullscreen-stage sim-authentic-fullscreen-stage"
        >
          {/* LIVE SVG AIMING TRAJECTORY TETHER & ROTATING CROSSHAIR RETICLE (Exact BattleArena.tsx) */}
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
                  : (validAttackTargets[0] ?? null));
              const attUnit = getAllBoardUnits(gameState.player).find(
                (u) => u.instanceId === selectedAttackerId,
              );
              if (attUnit) {
                domainColor = DOMAIN_META[attUnit.card.domain]?.color ?? '#fbbf24';
              }
              if (destId && allTargetPreviews[destId]?.targetDies) {
                isLethalAim = true;
              }
            }

            if (!sourceId || !destId) return null;
            const srcPos = getStageRelativeCenter(`[data-combat-id="${sourceId}"]`);
            const dstPos = getStageRelativeCenter(`[data-combat-id="${destId}"]`);
            if (!srcPos || !dstPos) return null;

            const sx = srcPos.x;
            const sy = srcPos.y;
            const dx = dstPos.x;
            const dy = dstPos.y;
            const mx = Math.round((sx + dx) / 2);
            const my = Math.round(Math.min(sy, dy) - 55);

            return (
              <svg className="aiming-trajectory-overlay" aria-hidden="true">
                <defs>
                  <linearGradient id="simAimTetherGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={domainColor} stopOpacity="0.35" />
                    <stop offset="60%" stopColor={domainColor} stopOpacity="0.95" />
                    <stop
                      offset="100%"
                      stopColor={isLethalAim ? '#ef4444' : '#fef08a'}
                      stopOpacity="1"
                    />
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
                  stroke="url(#simAimTetherGrad)"
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

              {spectacleFx.kind === 'spell' &&
                spectacleFx.distancePx &&
                spectacleFx.distancePx > 30 && (
                  <div
                    className={`combat-projectile-beam spell-projectile-beam domain-${spectacleFx.domain}`}
                    style={
                      {
                        left: `${spectacleFx.startX ?? 420}px`,
                        top: `${spectacleFx.startY ?? 580}px`,
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

              {(spectacleFx.kind === 'spell' ||
                spectacleFx.kind === 'ascend' ||
                spectacleFx.kind === 'sovereign') && (
                <div
                  className={`spectacle-target-burst kind-${spectacleFx.kind} domain-${spectacleFx.domain}`}
                  style={{
                    left: `${spectacleFx.targetX ?? 420}px`,
                    top: `${spectacleFx.targetY ?? 280}px`,
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
                      : (DOMAIN_META[spectacleFx.domain]?.icon ?? '✨')}
                  </span>
                </div>
              )}

              {spectacleFx.kind === 'legendary' && (
                <div className={`legendary-entrance-backdrop domain-${spectacleFx.domain}`}>
                  <div className="legendary-rays-burst" />
                </div>
              )}
            </>
          )}

          {/* TACTICAL COMBAT PREVIEW HUD (Exact BattleArena.tsx Forecast HUD) */}
          {combatPreview && (
            <div
              className={`tactical-combat-preview-hud ${
                combatPreview.targetDies ? 'preview-lethal' : ''
              } ${
                combatPreview.attackerDies && !combatPreview.attackerReborn
                  ? 'preview-mutual-risk'
                  : ''
              }`}
            >
              <div className="tcp-hud-header">
                <span className="tcp-hud-kicker">PREVISÃO TÁTICA DE COMBATE</span>
                <span className="tcp-hud-matchup">
                  <strong>{combatPreview.attackerName}</strong> ➔{' '}
                  <strong>{combatPreview.targetName}</strong>
                </span>
              </div>

              <div className="tcp-hud-columns">
                <div className="tcp-hud-col tcp-col-attack">
                  <div className="tcp-col-label">IMPACTO NO ALVO</div>
                  <div className="tcp-col-value">
                    {combatPreview.breaksTargetShield ? (
                      <span className="tcp-tag-shield">Quebra Escudo Divino (0 PV)</span>
                    ) : combatPreview.lethalTouchTriggeredOnTarget ? (
                      <span className="tcp-tag-lethal">
                        Toque Letal (-{combatPreview.damageToTarget} PV)
                      </span>
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
                  </div>
                </div>

                <div className="tcp-hud-col tcp-col-counter">
                  <div className="tcp-col-label">REVIDE & SOBREVIVÊNCIA</div>
                  <div className="tcp-col-value">
                    {combatPreview.isSovereignTarget ? (
                      <span className="tcp-tag-safe">Ataque Direto (0 Revide)</span>
                    ) : combatPreview.isRangedFreeHit ? (
                      <span className="tcp-tag-safe">Disparo à Distância (0 Revide)</span>
                    ) : combatPreview.breaksAttackerShield ? (
                      <span className="tcp-tag-shield">Escudo Divino absorve</span>
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
                    ) : (
                      <span className="tcp-badge badge-danger">Atacante Tombado</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FLOATING HOVER CARD ZOOM PANEL (Exact BattleArena.tsx Left Preview) */}
          {activeHoverCardInfo && (
            <div className="mtg-hover-zoom-panel">
              <CardView
                card={activeHoverCardInfo.card}
                unit={activeHoverCardInfo.unit}
                mode="inspect"
              />
              {activeHoverCardInfo.unit && (
                <div className="mtg-hover-unit-status">
                  <div style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: '2px' }}>
                    Posição:{' '}
                    {activeHoverCardInfo.unit.row === 'vanguard'
                      ? 'Vanguarda (Frente)'
                      : 'Retaguarda (Suporte)'}{' '}
                    • Coluna {activeHoverCardInfo.unit.slotIndex + 1}
                  </div>
                  {activeHoverCardInfo.unit.invasionAtkBonus ? (
                    <div style={{ color: '#fdba74' }}>• Invasão de Território: +1 ATQ ativo</div>
                  ) : null}
                  {activeHoverCardInfo.unit.formationAtkBonus ? (
                    <div style={{ color: '#fef08a' }}>• Cobertura de Coluna: +1 ATQ ativo</div>
                  ) : null}
                  {activeHoverCardInfo.unit.formationArmorBonus ? (
                    <div style={{ color: '#fde68a' }}>• Formação em Falange: +1 Armadura ativa</div>
                  ) : null}
                </div>
              )}
            </div>
          )}

          {/* CINEMATIC SOVEREIGN FINISHER OVERLAY (Exact BattleArena.tsx Victory Finisher) */}
          {gameState.phase === 'gameover' && (
            <div
              className="sovereign-finisher-overlay is-victory-finisher"
              onClick={handleNextStep}
              title="Clique para avançar para o próximo duelo temático"
            >
              <div className="finisher-impact-flash" />
              <div className="finisher-fracture-web" />

              <div className="finisher-bastion-burst burst-top-enemy">
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

              <div className="finisher-herald-banner">
                <div className="finisher-herald-Portrait">
                  {playerAvatarCard?.imagePath ? (
                    <img src={playerAvatarCard.imagePath} alt={gameState.player.name} />
                  ) : (
                    <span>👑</span>
                  )}
                </div>
                <div className="finisher-herald-kicker font-cinzel">
                  ⚔️ BASTIÃO INIMIGO DESTRUÍDO • TRIUNFO SOBERANO ⚔️
                </div>
                <div className="finisher-herald-title font-cinzel">VITÓRIA DO SOBERANO</div>
                <div className="finisher-herald-sub">{gameState.winReason}</div>
              </div>
            </div>
          )}

          {/* 1. TOP-CENTER SYMMETRIC P2 PILL (OPPONENT / SOVEREIGN 2 — Exact BattleArena.tsx) */}
          <header
            className={`hud-unified-top-bar ${isP2DrawerPinned ? 'is-pinned-open' : ''}`}
          >
            <div
              data-combat-id="ai-sovereign"
              className={`hud-top-pill ${
                isAiSovereignTarget ? 'is-valid-attack-target' : ''
              } ${combatAnim?.targetId === 'ai-sovereign' ? 'is-hit-target' : ''}`}
              onClick={() => onInspectCard(aiAvatarCard)}
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
              <span className="hud-pill-stat hand">🃏 {gameState.ai.hand.length}</span>
              <span className="hud-pill-stat deck">
                📚 {gameState.ai.deck.length} • 🪦 {gameState.ai.crypt.length}
              </span>

              {gameState.domainExpansion && (
                <span
                  className="hud-pill-env-chip domain"
                  title={
                    gameState.domainExpansion.clashRival
                      ? `Disputa de Domínios: ${gameState.domainExpansion.name} vs ${gameState.domainExpansion.clashRival.name} (Acerto Garantido Anulado)`
                      : `${gameState.domainExpansion.name} (${gameState.domainExpansion.turnsRemaining} rodadas)`
                  }
                >
                  {gameState.domainExpansion.clashRival
                    ? `⛩️⚔️ Disputa (${gameState.domainExpansion.turnsRemaining}r)`
                    : `⛩️ ${gameState.domainExpansion.turnsRemaining}r`}
                </span>
              )}

              <button
                type="button"
                className={`hud-pill-expand-btn ${isP2DrawerPinned ? 'active' : ''}`}
                style={{ width: 'auto', padding: '0 6px', gap: '3px', fontWeight: 800 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsP2DrawerPinned((prev) => {
                    const next = !prev;
                    if (next) setIsP1DrawerPinned(false);
                    return next;
                  });
                }}
              >
                {isP2DrawerPinned ? '▴ Ocultar' : '▾ Info'}
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

            {/* Auto-Hidden Dropdown Panel for Sovereign 2 */}
            <div className="hud-top-dropdown" onClick={(e) => e.stopPropagation()}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '4px',
                  borderBottom: '1px solid rgba(248, 113, 113, 0.25)',
                }}
              >
                <span
                  className="font-cinzel"
                  style={{ fontSize: '0.64rem', fontWeight: 800, color: '#fca5a5' }}
                >
                  ⚔️ PAINEL DO OPONENTE ({gameState.ai.name.toUpperCase()})
                </span>
                <button
                  type="button"
                  className="hud-inline-btn danger"
                  onClick={() => setIsP2DrawerPinned(false)}
                >
                  ✕ Ocultar Painel
                </button>
              </div>
              <div className="hud-dropdown-row">
                <div className="hud-dropdown-section hud-drawer-card">
                  <div className="hud-drawer-card-header">
                    <span className="hud-sec-label">
                      ⛰️ TERRENOS RIVAIS ({gameState.ai.channeledCards.length})
                    </span>
                    <span className="hud-inline-btn crypt-btn">
                      🪦 Cripta ({gameState.ai.crypt.length})
                    </span>
                  </div>
                  <div className="hud-affinities-footer">
                    <span className="hud-aff-kicker">AFINIDADES:</span>
                    {renderAffinityCounters(gameState.ai.affinities)}
                  </div>
                </div>

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
                      {gameState.domainExpansion.sureHitDesc}
                    </span>
                    {gameState.domainExpansion.owner === 'ai' && (
                      <span className="hud-env-inline-actions">
                        {simpleDomCheck && (
                          <button type="button" className="hud-inline-btn" onClick={handleEnterArena}>
                            💠 Domínio Simples (2⚡)
                          </button>
                        )}
                        {canSacBreak && (
                          <button
                            type="button"
                            className="hud-inline-btn danger"
                            onClick={handleEnterArena}
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

          {/* FLOATING DOMAIN EXPANSION & 50/50 DOMAIN CLASH ARENA BANNER */}
          {gameState.domainExpansion && !isP1DrawerPinned && !isP2DrawerPinned && (
            <div
              className={`domain-expansion-arena-banner ${
                gameState.domainExpansion.owner === 'ai' ? 'owner-ai' : 'owner-player'
              } ${gameState.domainExpansion.clashRival ? 'is-domain-clash' : ''}`}
              style={{ top: '38px' }}
            >
              <span className="de-banner-icon">
                {gameState.domainExpansion.clashRival ? '⛩️⚔️' : gameState.domainExpansion.icon}
              </span>
              <div className="de-banner-info">
                <div className="de-banner-title-row">
                  <span className="de-banner-kicker">
                    {gameState.domainExpansion.clashRival
                      ? 'DISPUTA DE DOMÍNIOS 50/50'
                      : gameState.domainExpansion.owner === 'ai'
                      ? 'EXPANSÃO DE DOMÍNIO INIMIGA'
                      : 'EXPANSÃO DE DOMÍNIO ATIVA'}
                  </span>
                  <span className="de-banner-name">
                    {gameState.domainExpansion.clashRival
                      ? `${gameState.domainExpansion.name} vs ${gameState.domainExpansion.clashRival.name}`
                      : gameState.domainExpansion.name}
                  </span>
                  {gameState.domainExpansion.clashRival ? (
                    <span className="de-clash-pill">⚖️ ACERTO GARANTIDO ANULADO</span>
                  ) : (
                    <span className="de-surehit-pill">🎯 ACERTO GARANTIDO ATIVO</span>
                  )}
                </div>
                <div className="de-banner-desc">
                  {gameState.domainExpansion.clashRival
                    ? 'As duas barreiras colidem 50/50! Cause 8+ dano ao Soberano rival para estilhaçar a barreira inimiga!'
                    : `${gameState.domainExpansion.potencyDesc} • ${gameState.domainExpansion.sureHitDesc}`}
                </div>
              </div>
              {gameState.domainExpansion.owner === 'ai' &&
                !gameState.domainExpansion.clashRival && (
                  <div className="de-counter-actions">
                    <button
                      type="button"
                      className="de-counter-btn simple-domain-btn"
                      onClick={() => {
                        setIsAutoPlaying(false);
                        setSubPhase('impact');
                      }}
                    >
                      ⛩️ Confrontar (3⚡)
                    </button>
                  </div>
                )}
              <span className="de-banner-turns">{gameState.domainExpansion.turnsRemaining}r</span>
            </div>
          )}

          {/* 2. TABULEIRO 6×4 EM TELA CHEIA (MESA DE MADEIRA + EXPANSÃO DE DOMÍNIO — Exact BattleArena.tsx) */}
          <div
            className={`mtg-battlefield-surface wooden-tabletop-surface ${
              gameState.domainExpansion
                ? `has-domain-tabletop domain-tabletop-${gameState.domainExpansion.domain}`
                : ''
            } ${isAimingAnyTarget ? 'is-aiming-target' : ''}`}
            onClick={() => {
              if (isP2DrawerPinned || isP1DrawerPinned) {
                setIsP2DrawerPinned(false);
                setIsP1DrawerPinned(false);
              }
            }}
          >
            {/* WOODEN TABLETOP & FULL-BOARD DOMAIN EXPANSION TRANSFORMATION LAYER */}
            <div
              className="tabletop-stone-engraving tabletop-wood-and-domain-layer"
              aria-hidden="true"
            >
              <div className="tabletop-wood-base-img" />

              {/* 1. SINGLE ACTIVE DOMAIN EXPANSION */}
              {gameState.domainExpansion && !gameState.domainExpansion.clashRival && (
                <div
                  key={`domain-tabletop-${gameState.domainExpansion.domain}-${gameState.domainExpansion.owner}-${
                    step.kind === 'invoke_domain' && subPhase === 'impact' ? step.id : 'steady'
                  }`}
                  className={`tabletop-domain-takeover-img domain-${gameState.domainExpansion.domain}`}
                >
                  <div
                    className={`tabletop-domain-flow-fx domain-${gameState.domainExpansion.domain}`}
                  />
                </div>
              )}

              {/* 2. DOMAIN CLASH: TWO DOMAINS FIGHTING (50/50 Split + Faultline Beam) */}
              {gameState.domainExpansion &&
                gameState.domainExpansion.clashRival &&
                (() => {
                  const exp = gameState.domainExpansion;
                  const rival = exp.clashRival!;
                  const topDom = exp.owner === 'ai' ? exp : rival;
                  const bottomDom = exp.owner === 'player' ? exp : rival;
                  const topColor = DOMAIN_META[topDom.domain]?.color || '#38bdf8';
                  const bottomColor = DOMAIN_META[bottomDom.domain]?.color || '#ef4444';
                  return (
                    <div
                      key={`domain-clash-${topDom.domain}-${bottomDom.domain}-${step.id}-${subPhase}`}
                      className="tabletop-domain-clash-stage"
                      style={
                        {
                          '--top-clash-color': topColor,
                          '--bottom-clash-color': bottomColor,
                        } as React.CSSProperties
                      }
                    >
                      <div
                        className={`tabletop-domain-clash-half top-half domain-${topDom.domain}`}
                      >
                        <div className={`tabletop-domain-flow-fx domain-${topDom.domain}`} />
                      </div>

                      <div
                        className={`tabletop-domain-clash-half bottom-half domain-${bottomDom.domain}`}
                      >
                        <div className={`tabletop-domain-flow-fx domain-${bottomDom.domain}`} />
                      </div>

                      <div className="tabletop-domain-clash-faultline">
                        <div className="clash-faultline-core-beam" />
                        <div className="clash-faultline-impact-pulse" />
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

              {/* 4. DESTRUCTION / SHATTER ANIMATION (8 Polygonal Barrier Shards + Fracture Flash — Exact BattleArena.tsx) */}
              {domainExitAnim && domainExitAnim.mode === 'shatter' && (
                <div
                  key={`domain-shatter-${domainExitAnim.domain}-${step.id}`}
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
                                  slotUnits.length,
                                ),
                                ...(isLunging && combatAnim
                                  ? ({
                                      '--lunge-x': `${combatAnim.lungeX}px`,
                                      '--lunge-y': `${combatAnim.lungeY}px`,
                                    } as React.CSSProperties)
                                  : {}),
                              }}
                            >
                              {renderTargetPreviewBadge(unit.instanceId)}
                              <CardView
                                card={unit.card}
                                unit={unit}
                                mode="board"
                                isValidTarget={isValidTarget}
                                feedback={feedbackMap[unit.instanceId]}
                                onClick={() => onInspectCard(unit.card)}
                                onInspect={onInspectCard}
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
                  const isTargetDeploySlot =
                    canStackHere &&
                    step.deployRow === 'vanguard' &&
                    step.deploySlotIndex === idx;
                  const isInvading = slotUnits.length > 0 && aiRearUnits.length === 0;
                  const isClashing = slotUnits.length > 0 && aiRearUnits.length > 0;

                  return (
                    <div
                      key={`player-van-${idx}`}
                      className={`mtg-slot ${canStackHere ? 'can-deploy' : ''} ${
                        slotUnits.length > 1 ? 'has-stacked-units' : ''
                      }`}
                      onClick={() => {
                        if (isTargetDeploySlot) {
                          setIsAutoPlaying(false);
                          setSubPhase('impact');
                        }
                      }}
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
                            setIsAutoPlaying(false);
                            setSubPhase('impact');
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
                                    slotUnits.length,
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
                                  isSelected={
                                    selectedAttackerId === unit.instanceId ||
                                    focusedBoardUnitId === unit.instanceId
                                  }
                                  isReadyAttacker={isReady}
                                  isValidTarget={isSpellTargetingAlly}
                                  canAscend={canUnitAscend}
                                  canMoveRow={canUnitMove}
                                  feedback={feedbackMap[unit.instanceId]}
                                  onClick={() => onInspectCard(unit.card)}
                                  onAscendClick={() => {
                                    setIsAutoPlaying(false);
                                    setSubPhase('impact');
                                  }}
                                  onInspect={onInspectCard}
                                  onHoverCard={handleHoverCard}
                                />
                              </div>
                            );
                          })}
                        </div>
                      ) : canStackHere ? (
                        <span className="mtg-slot-watermark">
                          + Vanguarda (1/{MAX_UNITS_PER_SLOT})
                        </span>
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
                                  slotUnits.length,
                                ),
                                ...(isLunging && combatAnim
                                  ? ({
                                      '--lunge-x': `${combatAnim.lungeX}px`,
                                      '--lunge-y': `${combatAnim.lungeY}px`,
                                    } as React.CSSProperties)
                                  : {}),
                              }}
                            >
                              {renderTargetPreviewBadge(unit.instanceId)}
                              <CardView
                                card={unit.card}
                                unit={unit}
                                mode="board"
                                isValidTarget={isValidTarget}
                                feedback={feedbackMap[unit.instanceId]}
                                onClick={() => onInspectCard(unit.card)}
                                onInspect={onInspectCard}
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
                  const isTargetDeploySlot =
                    canStackHere &&
                    step.deployRow === 'rearguard' &&
                    step.deploySlotIndex === idx;

                  return (
                    <div
                      key={`player-rear-${idx}`}
                      className={`mtg-slot ${canStackHere ? 'can-deploy' : ''} ${
                        hasColumnCover && slotUnits.length === 0 ? 'has-column-cover' : ''
                      } ${slotUnits.length > 1 ? 'has-stacked-units' : ''}`}
                      onClick={() => {
                        if (isTargetDeploySlot) {
                          setIsAutoPlaying(false);
                          setSubPhase('impact');
                        }
                      }}
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
                            setIsAutoPlaying(false);
                            setSubPhase('impact');
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
                                    slotUnits.length,
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
                                  isSelected={
                                    selectedAttackerId === unit.instanceId ||
                                    focusedBoardUnitId === unit.instanceId
                                  }
                                  isReadyAttacker={isReady}
                                  isValidTarget={isSpellTargetingAlly}
                                  canAscend={canUnitAscend}
                                  canMoveRow={canUnitMove}
                                  feedback={feedbackMap[unit.instanceId]}
                                  onClick={() => onInspectCard(unit.card)}
                                  onAscendClick={() => {
                                    setIsAutoPlaying(false);
                                    setSubPhase('impact');
                                  }}
                                  onInspect={onInspectCard}
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
                        <span className="mtg-slot-cover-rune">+1 ATQ</span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. UNIFIED SYMMETRIC P1 + PHASE + MENU DOCK (BOTTOM EDGE — Exact BattleArena.tsx) */}
          <footer className="hud-unified-bottom-bar">
            <div className="hud-bottom-strip-inner">
              <div
                data-combat-id="player-sovereign"
                className={`hud-p1-segment ${isP1DrawerPinned ? 'is-pinned-open' : ''} ${
                  combatAnim?.targetId === 'player-sovereign' ? 'is-hit-target' : ''
                }`}
              >
                {/* Auto-Hover & Pin Popover for Player 1 Details */}
                <div
                  className="hud-bottom-popover p1-details-popover"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingBottom: '6px',
                      marginBottom: '6px',
                      borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
                    }}
                  >
                    <span
                      className="font-cinzel"
                      style={{ fontSize: '0.64rem', fontWeight: 800, color: '#fde68a' }}
                    >
                      👑 MEUS TERRENOS, AFINIDADES & DOMÍNIO
                    </span>
                    <button
                      type="button"
                      className="hud-inline-btn danger"
                      onClick={() => setIsP1DrawerPinned(false)}
                    >
                      ✕ Ocultar Painel
                    </button>
                  </div>
                  <div className="hud-dropdown-row">
                    <div className="hud-dropdown-section hud-drawer-card">
                      <div className="hud-drawer-card-header">
                        <span className="hud-sec-label">
                          ⛰️ SEUS TERRENOS ({gameState.player.channeledCards.length})
                        </span>
                        <span className="hud-inline-btn crypt-btn">
                          🪦 Cripta ({gameState.player.crypt.length})
                        </span>
                      </div>

                      <div className="hud-lands-showcase">
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
                      </div>

                      <div className="hud-affinities-footer">
                        <span className="hud-aff-kicker">AFINIDADES:</span>
                        {renderAffinityCounters(gameState.player.affinities)}
                      </div>
                    </div>

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
                              onClick={() => {
                                setIsAutoPlaying(false);
                                setSubPhase('impact');
                              }}
                              style={{ cursor: 'pointer' }}
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

                <div
                  className="hud-mini-avatar player"
                  onClick={() => onInspectCard(playerAvatarCard)}
                >
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
                    onClick={handleEnterArena}
                  >
                    🔥 2⚡
                  </button>
                  <button
                    type="button"
                    className="hud-ritual-chip"
                    disabled={!canBlood}
                    onClick={handleEnterArena}
                  >
                    🩸 +1⚡
                  </button>
                  <button
                    type="button"
                    className={`hud-ritual-chip ${domExpCheck.allowed ? 'ready' : ''}`}
                    disabled={!domExpCheck.allowed}
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setSubPhase('impact');
                    }}
                  >
                    ⛩️ {domExpCheck.affinity}/6
                  </button>
                </div>

                <button
                  type="button"
                  className={`hud-pill-expand-btn ${isP1DrawerPinned ? 'active' : ''}`}
                  style={{ width: 'auto', padding: '0 6px', gap: '3px', fontWeight: 800 }}
                  onClick={() =>
                    setIsP1DrawerPinned((prev) => {
                      const next = !prev;
                      if (next) setIsP2DrawerPinned(false);
                      return next;
                    })
                  }
                >
                  {isP1DrawerPinned ? '▾ Ocultar' : '▴ Terrenos'}
                </button>
              </div>

              <div className="hud-strip-divider" />

              {/* Center Segment: Hand Drawer Handle (Exact BattleArena.tsx text & classes) */}
              <button
                type="button"
                className={`hud-hand-trigger-btn ${isHandPinnedOpen ? 'active' : ''}`}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setSubPhase(subPhase === 'hand' ? 'dock' : 'hand');
                }}
              >
                🃏 MÃO ({gameState.player.hand.length}){' '}
                {isHandPinnedOpen ? '▾ Ocultar' : '▴ Mostrar'}
              </button>

              <div className="hud-strip-divider" />

              {/* Right Segment: Phase Action & Gear Menu (Exact BattleArena.tsx) */}
              <div className="hud-phase-segment">
                <span className="hud-round-chip hud-turn-timer-chip">
                  <span>T{gameState.turn}</span>
                  <span className="hud-timer-sep">•</span>
                  <span className="hud-timer-val">⏱️ 48s</span>
                </span>

                {isPlayerTurn && readyPlayerUnits.length > 0 && (
                  <button
                    type="button"
                    className="hud-action-cta attack-all"
                    disabled={Boolean(combatAnim)}
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setSubPhase('impact');
                    }}
                  >
                    ⚔️ ATACAR ({readyPlayerUnits.length})
                  </button>
                )}

                <button
                  type="button"
                  className="hud-action-cta primary"
                  onClick={handleNextStep}
                >
                  ⏭️ PASSAR TURNO<span className="hide-on-mobile"> [ESPAÇO]</span>
                </button>

                <button
                  type="button"
                  className="hud-action-cta hide-on-mobile"
                  style={{
                    background: 'rgba(127, 29, 29, 0.72)',
                    borderColor: 'rgba(248, 113, 113, 0.5)',
                    color: '#fecaca',
                    padding: '0 0.65rem',
                  }}
                  title="Entrar na Arena e jogar sua própria partida"
                  onClick={handleEnterArena}
                >
                  ⚔️ JOGAR 1×1 / ARENA
                </button>
              </div>
            </div>
          </footer>
        </div>

        {/* =========================================================
            4. BOTTOM CENTER HAND DRAWER OR SELECTED CARD COMMAND DOCK
               (Sibling of .arena-fullscreen-stage inside .arena-main-column, 100% identical to BattleArena.tsx!)
            ========================================================= */}
        {(() => {
          const anyHudPopoverOpen = isP1DrawerPinned || isP2DrawerPinned;
          const isHandExpanded =
            !anyHudPopoverOpen && selectedHandIndex === null && isHandPinnedOpen;
          const activeHandCard =
            !anyHudPopoverOpen && selectedHandIndex !== null
              ? (gameState.player.hand[selectedHandIndex] ?? null)
              : null;
          const activePlayCheck = activeHandCard
            ? canPlayCard(gameState, 'player', activeHandCard)
            : { allowed: false };
          const activeBoardUnitId =
            !anyHudPopoverOpen && selectedHandIndex === null && !isHandPinnedOpen
              ? (selectedAttackerId ?? focusedBoardUnitId)
              : null;
          const activeBoardUnitFound = activeBoardUnitId
            ? findUnitOnBoard(gameState, activeBoardUnitId)
            : null;
          const activeBoardUnit =
            activeBoardUnitFound && !activeBoardUnitFound.unit.isTrap
              ? activeBoardUnitFound.unit
              : null;
          const activeBoardUnitOwner = activeBoardUnitFound?.owner ?? null;

          const isDomainRitualDock =
            !anyHudPopoverOpen &&
            subPhase === 'dock' &&
            (step.kind === 'invoke_domain' ||
              (step.kind === 'domain_clash' && !step.rivalInvokesDomain));
          const domainDockSpec = getDomainExpansionSpec(scenario.p1Domain);
          const enemyDomainSpec = getDomainExpansionSpec(scenario.p2Domain);

          return (
            <div className="mtg-bottom-zone floating-bottom-hud">
              {isDomainRitualDock ? (
                <div
                  className={`selected-card-command-dock domain-dock-${domainDockSpec.domain} ${
                    isCommandDockMinimized ? 'is-minimized' : ''
                  }`}
                >
                  <div className="sccd-top-row">
                    <div
                      className="sccd-card-chip"
                      onClick={() => onInspectCard(playerAvatarCard)}
                    >
                      <div className="sccd-thumb-wrap">
                        <span className="sccd-cost">3</span>
                        {playerAvatarCard.imagePath && (
                          <img
                            src={playerAvatarCard.imagePath}
                            alt={playerAvatarCard.name}
                            className="sccd-thumb"
                          />
                        )}
                      </div>
                      <div className="sccd-meta">
                        <span className="sccd-name">
                          {domainDockSpec.icon} {domainDockSpec.name}
                        </span>
                        <div className="sccd-stats-pills-row">
                          <span
                            className="sccd-stat-pill domain-pill"
                            style={{
                              borderColor: DOMAIN_META[domainDockSpec.domain]?.color,
                              color: DOMAIN_META[domainDockSpec.domain]?.color,
                            }}
                          >
                            ⛩️ Afinidade 6/6 • Custo 3⚡
                          </span>
                          <span className="sccd-stat-pill atk-pill">⚔️ +1/+1 & Ímpeto</span>
                          <span className="sccd-stat-pill hp-pill">
                            {step.kind === 'domain_clash'
                              ? '⚖️ Disputa 50/50 (Anula Acerto Garantido)'
                              : '🎯 Acerto Garantido no Soberano'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="sccd-header-controls">
                      <button
                        type="button"
                        className="sccd-toggle-btn"
                        onClick={() => setIsP1DrawerPinned(true)}
                      >
                        ⛰️ Ver Terrenos (6/6)
                      </button>
                      <button
                        type="button"
                        className="sccd-toggle-btn"
                        onClick={() => setIsCommandDockMinimized((prev) => !prev)}
                      >
                        {isCommandDockMinimized ? '▲ Ler Texto' : '▼ Compactar'}
                      </button>
                    </div>
                  </div>

                  {!isCommandDockMinimized && (
                    <>
                      <div className="sccd-readable-card-box">
                        <p className="sccd-description-text">
                          {step.kind === 'domain_clash'
                            ? `Contra-ataque a Expansão de Domínio inimiga (${enemyDomainSpec.name})! As duas barreiras dividirão o tabuleiro em 50/50 e anularão o Acerto Garantido de ambos os Soberanos!`
                            : `${domainDockSpec.potencyDesc} • ${domainDockSpec.sureHitDesc}`}
                        </p>
                        <div className="sccd-play-status-line is-ready">
                          {step.kind === 'domain_clash'
                            ? '⚡⛩️ Pronto para Confronto de Domínios 50/50: Toque no botão abaixo para colidir sua barreira contra o domínio rival!'
                            : '⛩️ Ritual de Expansão Pronto (6/6 Afinidade): Toque abaixo para transformar a mesa e elevar a música ao Clímax (100%)!'}
                        </div>
                      </div>

                      <div className="sccd-actions">
                        <button
                          type="button"
                          className="quick-act-btn act-spell"
                          onClick={() => {
                            if (isAudioLive && !soundMuted) startAdaptiveMusic();
                            setIsAutoPlaying(false);
                            setSubPhase('impact');
                          }}
                        >
                          {step.kind === 'domain_clash'
                            ? `⚡⛩️ Colidir Domínio 50/50: ${domainDockSpec.name} (3⚡)`
                            : `⛩️ Invocar Expansão de Domínio: ${domainDockSpec.name} (3⚡)`}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : activeHandCard && selectedHandIndex !== null ? (
                <div
                  className={`selected-card-command-dock domain-dock-${activeHandCard.domain} ${
                    isCommandDockMinimized ? 'is-minimized' : ''
                  }`}
                >
                  <div className="sccd-top-row">
                    <div
                      className="sccd-card-chip"
                      onMouseEnter={() => handleHoverCard(activeHandCard)}
                      onMouseLeave={() => handleHoverCard(null)}
                      onClick={() => onInspectCard(activeHandCard)}
                    >
                      <div className="sccd-thumb-wrap">
                        <span className="sccd-cost">{activeHandCard.cost}</span>
                        {activeHandCard.imagePath && (
                          <img
                            src={activeHandCard.imagePath}
                            alt={activeHandCard.name}
                            className="sccd-thumb"
                          />
                        )}
                        <span className="sccd-zoom-badge" title="Toque para ampliar a carta">
                          🔍
                        </span>
                      </div>
                      <div className="sccd-meta">
                        <span className="sccd-name">{activeHandCard.name}</span>
                        <div className="sccd-stats-pills-row">
                          <span
                            className="sccd-stat-pill domain-pill"
                            style={{
                              borderColor: DOMAIN_META[activeHandCard.domain]?.color,
                              color: DOMAIN_META[activeHandCard.domain]?.color,
                            }}
                          >
                            {DOMAIN_META[activeHandCard.domain]?.icon}{' '}
                            {DOMAIN_META[activeHandCard.domain]?.shortName}
                            {activeHandCard.affinityReq > 0
                              ? ` • Afin. ${activeHandCard.affinityReq}`
                              : ''}
                          </span>
                          <span className="sccd-stat-pill type-pill">
                            {CARD_TYPE_LABELS[activeHandCard.type]}
                            {activeHandCard.subtype ? ` • ${activeHandCard.subtype}` : ''}
                          </span>
                          {(activeHandCard.type === 'creature' ||
                            activeHandCard.type === 'relic') && (
                            <>
                              {activeHandCard.type === 'creature' && (
                                <span className="sccd-stat-pill atk-pill">
                                  ⚔️ {activeHandCard.atk} ATQ
                                </span>
                              )}
                              {activeHandCard.armor > 0 && (
                                <span className="sccd-stat-pill arm-pill">
                                  🛡️ {activeHandCard.armor} ARM
                                </span>
                              )}
                              <span className="sccd-stat-pill hp-pill">
                                ❤️ {activeHandCard.hp} PV
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="sccd-header-controls">
                      <button
                        type="button"
                        className="sccd-toggle-btn"
                        onClick={() => onInspectCard(activeHandCard)}
                      >
                        🔍 Ampliar
                      </button>
                      <button
                        type="button"
                        className="sccd-toggle-btn"
                        onClick={() => setIsCommandDockMinimized((prev) => !prev)}
                      >
                        {isCommandDockMinimized ? '▲ Ler Texto' : '▼ Compactar'}
                      </button>
                      <button
                        type="button"
                        className="sccd-toggle-btn"
                        onClick={() => {
                          setIsAutoPlaying(false);
                          setSubPhase('hand');
                        }}
                      >
                        🃏 Mão ({gameState.player.hand.length})
                      </button>
                      <button
                        type="button"
                        className="sccd-cancel-btn"
                        onClick={() => {
                          setIsAutoPlaying(false);
                          setSubPhase('hand');
                        }}
                      >
                        ✕ Fechar
                      </button>
                    </div>
                  </div>

                  {!isCommandDockMinimized && (
                    <>
                      <div className="sccd-readable-card-box">
                        {activeHandCard.keywords.length > 0 && (
                          <div className="sccd-keywords-row">
                            {activeHandCard.keywords.map((kw) => (
                              <span
                                key={kw}
                                className="sccd-kw-badge"
                                title={KEYWORD_TOOLTIPS[kw] || kw}
                              >
                                <strong>✦ {kw}:</strong> {KEYWORD_TOOLTIPS[kw]}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="sccd-description-text">{activeHandCard.description}</p>
                        {activeHandCard.ascension && (
                          <div className="sccd-ascension-line">
                            <strong>👑 Ascensão ({activeHandCard.ascension.cost}⚡):</strong>{' '}
                            Evolui para <em>{activeHandCard.ascension.newName}</em> (
                            {activeHandCard.ascension.newAtk}⚔️ /{' '}
                            {activeHandCard.ascension.newArmor}🛡️ /{' '}
                            {activeHandCard.ascension.newMaxHp}❤️)
                          </div>
                        )}
                        <div className="sccd-play-status-line is-ready">
                          ✅ Pronta para jogar: Toque diretamente em uma casa do tabuleiro acima ou
                          use os botões rápidos abaixo!
                        </div>
                      </div>

                      <div className="sccd-actions">
                        {isPlayerTurn &&
                          activePlayCheck.allowed &&
                          activeHandCard.type === 'creature' && (
                            <>
                              {hasEmptyVanguard && (
                                <button
                                  type="button"
                                  className="quick-act-btn act-vanguard"
                                  onClick={() => {
                                    setIsAutoPlaying(false);
                                    setSubPhase('impact');
                                  }}
                                >
                                  + Vanguarda<span className="hide-on-mobile"> [V]</span>
                                </button>
                              )}
                              {hasEmptyRearguard && (
                                <button
                                  type="button"
                                  className="quick-act-btn act-rearguard"
                                  onClick={() => {
                                    setIsAutoPlaying(false);
                                    setSubPhase('impact');
                                  }}
                                >
                                  + Retaguarda<span className="hide-on-mobile"> [R]</span>
                                </button>
                              )}
                            </>
                          )}

                        {isPlayerTurn &&
                          activePlayCheck.allowed &&
                          activeHandCard.type === 'relic' &&
                          hasEmptyRearguard && (
                            <button
                              type="button"
                              className="quick-act-btn act-rearguard"
                              onClick={() => {
                                setIsAutoPlaying(false);
                                setSubPhase('impact');
                              }}
                            >
                              + Posicionar Relíquia<span className="hide-on-mobile"> [R]</span>
                            </button>
                          )}

                        {isPlayerTurn &&
                          activePlayCheck.allowed &&
                          (activeHandCard.type === 'spell' ||
                            activeHandCard.type === 'reaction') && (
                            <button
                              type="button"
                              className="quick-act-btn act-spell"
                              onClick={() => {
                                setIsAutoPlaying(false);
                                setSubPhase('impact');
                              }}
                            >
                              Lançar Agora
                            </button>
                          )}

                        {isPlayerTurn && !gameState.player.hasChanneledThisTurn && (
                          <button
                            type="button"
                            className="quick-act-btn act-channel"
                            onClick={() => {
                              setIsAutoPlaying(false);
                              setSubPhase('impact');
                            }}
                          >
                            Canalizar (+1 Afin. & Compra)<span className="hide-on-mobile"> [C]</span>
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ) : activeBoardUnit ? (
                <div
                  className={`selected-card-command-dock domain-dock-${activeBoardUnit.card.domain} ${
                    isCommandDockMinimized ? 'is-minimized' : ''
                  }`}
                >
                  <div className="sccd-top-row">
                    <div
                      className="sccd-card-chip"
                      onClick={() => onInspectCard(activeBoardUnit.card)}
                    >
                      <div className="sccd-thumb-wrap">
                        <span className="sccd-cost">{activeBoardUnit.card.cost}</span>
                        {activeBoardUnit.card.imagePath && (
                          <img
                            src={activeBoardUnit.card.imagePath}
                            alt={activeBoardUnit.card.name}
                            className="sccd-thumb"
                          />
                        )}
                        <span className="sccd-zoom-badge">🔍</span>
                      </div>
                      <div className="sccd-meta">
                        <span className="sccd-name">
                          {activeBoardUnit.card.name}{' '}
                          <small style={{ color: '#94a3b8', fontWeight: 600 }}>
                            ({activeBoardUnitOwner === 'player' ? 'Aliado' : 'Inimigo'} •{' '}
                            {activeBoardUnit.row === 'vanguard' ? 'Vanguarda' : 'Retaguarda'})
                          </small>
                        </span>
                        <div className="sccd-stats-pills-row">
                          <span className="sccd-stat-pill atk-pill">
                            ⚔️ {activeBoardUnit.currentAtk} ATQ
                          </span>
                          {activeBoardUnit.currentArmor > 0 && (
                            <span className="sccd-stat-pill arm-pill">
                              🛡️ {activeBoardUnit.currentArmor} ARM
                            </span>
                          )}
                          <span className="sccd-stat-pill hp-pill">
                            ❤️ {activeBoardUnit.currentHp}/{activeBoardUnit.maxHp} PV
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="sccd-header-controls">
                      <button
                        type="button"
                        className="sccd-toggle-btn"
                        onClick={() => onInspectCard(activeBoardUnit.card)}
                      >
                        🔍 Ampliar
                      </button>
                      <button
                        type="button"
                        className="sccd-toggle-btn"
                        onClick={() => setIsCommandDockMinimized((prev) => !prev)}
                      >
                        {isCommandDockMinimized ? '▲ Ler Texto' : '▼ Compactar'}
                      </button>
                      <button
                        type="button"
                        className="sccd-cancel-btn"
                        onClick={() => {
                          setIsAutoPlaying(false);
                          setSubPhase('hand');
                        }}
                      >
                        ✕ Fechar
                      </button>
                    </div>
                  </div>

                  {!isCommandDockMinimized && (
                    <>
                      <div className="sccd-readable-card-box">
                        {activeBoardUnit.keywords.length > 0 && (
                          <div className="sccd-keywords-row">
                            {activeBoardUnit.keywords.map((kw) => (
                              <span key={kw} className="sccd-kw-badge">
                                <strong>✦ {kw}:</strong> {KEYWORD_TOOLTIPS[kw]}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="sccd-description-text">
                          {activeBoardUnit.card.description}
                        </p>
                        {activeBoardUnitOwner === 'player' && (
                          <div
                            className={`sccd-play-status-line ${
                              selectedAttackerId === activeBoardUnit.instanceId
                                ? 'is-ready'
                                : 'is-warn'
                            }`}
                          >
                            {selectedAttackerId === activeBoardUnit.instanceId
                              ? '⚔️ Atacante Selecionado: Toque em uma unidade inimiga ou no Soberano rival no topo para atacar!'
                              : '👑 Unidade Selecionada: Escolha Ascender ou mover de fileira abaixo!'}
                          </div>
                        )}
                      </div>

                      {activeBoardUnitOwner === 'player' && isPlayerTurn && (
                        <div className="sccd-actions" style={{ flexWrap: 'wrap' }}>
                          {(() => {
                            const unitTargets = getValidAttackTargets(
                              gameState,
                              activeBoardUnit.instanceId,
                            );
                            const canHitSovereign = unitTargets.includes('ai-sovereign');
                            const targetableEnemies = getAllBoardUnits(gameState.ai).filter((eu) =>
                              unitTargets.includes(eu.instanceId),
                            );
                            return (
                              <>
                                {canHitSovereign && (
                                  <button
                                    type="button"
                                    className="quick-act-btn act-vanguard"
                                    onClick={() => {
                                      setIsAutoPlaying(false);
                                      setSubPhase('impact');
                                    }}
                                  >
                                    {isSureHitActiveFor(gameState, 'player') ? '⛩️ ' : '👑 '}
                                    Atacar Soberano ({gameState.ai.name} • ❤️ {gameState.ai.hp})
                                  </button>
                                )}
                                {targetableEnemies.map((eu) => (
                                  <button
                                    key={`unit-atk-tgt-${eu.instanceId}`}
                                    type="button"
                                    className="quick-act-btn act-burn"
                                    onClick={() => {
                                      setIsAutoPlaying(false);
                                      setSubPhase('impact');
                                    }}
                                  >
                                    ⚔️ Atacar {eu.card.name} (C{eu.slotIndex + 1} • {eu.currentAtk}/
                                    {eu.currentHp})
                                  </button>
                                ))}
                              </>
                            );
                          })()}
                          {canAscendUnit(gameState, 'player', activeBoardUnit.instanceId) && (
                            <button
                              type="button"
                              className="quick-act-btn act-spell"
                              onClick={() => {
                                setIsAutoPlaying(false);
                                setSubPhase('impact');
                              }}
                            >
                              👑 Ascender ({activeBoardUnit.card.ascension?.cost}⚡)
                            </button>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div
                  className={`mtg-hand-drawer ${
                    isHandExpanded ? 'is-expanded' : 'is-collapsed'
                  }`}
                >
                  <div className="hand-drawer-handle-bar">
                    <button
                      type="button"
                      className={`hand-drawer-toggle-btn ${isHandPinnedOpen ? 'is-pinned' : ''}`}
                      onClick={() => {
                        setIsAutoPlaying(false);
                        setSubPhase(subPhase === 'hand' ? 'dock' : 'hand');
                      }}
                    >
                      {isHandExpanded
                        ? `🃏 SUA MÃO (${gameState.player.hand.length}) • ▼ OCULTAR MÃO (VER TABULEIRO)`
                        : `🃏 MÃO (${gameState.player.hand.length}) ▲`}
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
                        const isHoveredInSim = simHoveredHandIdx === idx;
                        const total = gameState.player.hand.length;
                        const mid = (total - 1) / 2;
                        const offsetIdx = idx - mid;
                        const rotDeg = offsetIdx * 2.2;
                        const liftY = Math.abs(offsetIdx) * 2.5;

                        return (
                          <div
                            key={`${card.id}-hand-${idx}`}
                            className={`mtg-hand-card-slot ${
                              isHoveredInSim ? 'is-hovered-slot' : ''
                            }`}
                            style={{
                              transform: `translateY(${liftY}px) rotate(${rotDeg}deg)`,
                              zIndex: idx + 10,
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
                              isSelected={false}
                              canChannel={isPlayerTurn && !gameState.player.hasChanneledThisTurn}
                              onClick={() => {
                                setIsAutoPlaying(false);
                                setSubPhase('dock');
                              }}
                              onInspect={onInspectCard}
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
    </div>
  );
};
