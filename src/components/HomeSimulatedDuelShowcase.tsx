import React, { useEffect, useState } from 'react';
import { CARDS_BY_ID } from '../data/cards';
import { BoardUnit, CardDefinition, Domain, FloatingFeedback, Keyword, RowType } from '../types/game';
import { setMusicState, startAdaptiveMusic } from '../utils/musicEngine';
import { playSfx, SfxType } from '../utils/soundEngine';
import {
  CARD_TYPE_LABELS,
  CardView,
  DOMAIN_META,
  KEYWORD_TOOLTIPS,
} from './CardView';

type SoundEffectType =
  | 'summon_heavy'
  | 'domain_expand'
  | 'dragon_breath'
  | 'ascend'
  | 'freeze'
  | 'shield_up'
  | 'spell_arcane'
  | 'attack_hit'
  | 'victory'
  | 'card_draw'
  | 'button_click';

type BattleMusicTrackId =
  | 'ambient_battle'
  | 'domain_red'
  | 'domain_blue'
  | 'domain_purple'
  | 'domain_gold'
  | 'domain_clash';

function playSoundEffect(effect: SoundEffectType): void {
  const map: Record<SoundEffectType, SfxType> = {
    summon_heavy: 'summon',
    domain_expand: 'ascend',
    dragon_breath: 'spell',
    ascend: 'ascend',
    freeze: 'freeze',
    shield_up: 'heal',
    spell_arcane: 'spell',
    attack_hit: 'hit',
    victory: 'victory',
    card_draw: 'draw',
    button_click: 'channel',
  };
  playSfx(map[effect] ?? 'summon');
}

function setBattleMusicTrack(track: BattleMusicTrackId): void {
  startAdaptiveMusic();
  if (track === 'ambient_battle') {
    setMusicState('battle', 'neutral', false);
  } else if (track === 'domain_red') {
    setMusicState('domain_clash', 'red', false);
  } else if (track === 'domain_blue') {
    setMusicState('domain_clash', 'blue', false);
  } else if (track === 'domain_purple') {
    setMusicState('domain_clash', 'purple', false);
  } else if (track === 'domain_gold') {
    setMusicState('domain_clash', 'gold', false);
  } else {
    setMusicState('climax', 'gold', true);
  }
}

function stopBattleMusic(): void {
  setMusicState('sanctuary', 'neutral', false);
}

export type SimSubPhase = 'hand' | 'dock' | 'impact';

interface SimSlotSpec {
  slotIndex: number;
  cardId: string;
  atk?: number;
  hp?: number;
  maxHp?: number;
  armor?: number;
  hasDivineShield?: boolean;
  isFrozen?: boolean;
  isAscended?: boolean;
  stance?: 'attack' | 'defend';
  feedback?: { text: string; color: FloatingFeedback['color'] };
  isHitTarget?: boolean;
  isLunging?: boolean;
  isBurstTarget?: boolean;
  burstKind?: 'spell' | 'ascend';
}

interface SimStepBoardState {
  aiRearguard: SimSlotSpec[];
  playerVanguard: SimSlotSpec[];
  aiVanguard: SimSlotSpec[];
  playerRearguard: SimSlotSpec[];
  p1Hp: number;
  p1Essence: number;
  p1MaxEssence: number;
  p2Hp: number;
  p2Essence: number;
  p2MaxEssence: number;
  p1Feedback?: { text: string; color: FloatingFeedback['color'] };
  p2Feedback?: { text: string; color: FloatingFeedback['color'] };
}

interface SimDuelStep {
  id: string;
  stepBadge: string;
  title: string;
  narrative: string;
  sfx: SoundEffectType;
  musicTrack: BattleMusicTrackId;
  activeDomain?: Exclude<Domain, 'neutral'> | 'clash_gold_purple';
  domainBannerTitle?: string;
  domainBannerSubtitle?: string;
  // Player 1's hand before playing the card (5 cards in fan)
  handCardIds: string[];
  selectedHandIndex: number;
  // Action button shown & highlighted in the Command Dock
  dockActionLabel: string;
  dockActionType: 'vanguard' | 'rearguard' | 'spell' | 'ascend' | 'domain';
  dockStatusText: string;
  // Target highlight on the board during 'dock' subPhase
  targetLane?: 'aiRearguard' | 'playerVanguard' | 'aiVanguard' | 'playerRearguard';
  targetSlotIndex?: number;
  targetWatermark?: string;
  // Spectacle Herald & Breath Wave during 'impact' subPhase
  heraldTitle: string;
  heraldSubtitle: string;
  heraldDomain: Domain;
  breathWaveLane?: 'aiRearguard' | 'aiVanguard' | 'playerVanguard' | 'playerRearguard';
  breathWaveDomain?: Exclude<Domain, 'neutral'>;
  // Board state during 'hand' & 'dock' (BEFORE the card/action resolves)
  beforeBoard: SimStepBoardState;
  // Board state during 'impact' (AFTER the card/action resolves)
  afterBoard: SimStepBoardState;
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
  p2Name: string;
  p2AvatarCardId: string;
  p2Domain: Exclude<Domain, 'neutral'>;
  steps: SimDuelStep[];
}

const SIM_DUEL_SCENARIOS: SimDuelScenario[] = [
  {
    id: 'crimson_forge_domain',
    shortTab: '🔥 Forja Carmesim',
    badge: 'COMBO #1 • EXPANSÃO DE DOMÍNIO & ASCENSÃO DRACÔNICA',
    title: 'Caldeira do Fogo Primordial',
    subtitle: 'Draconato Escama-Ardente + Forja de Obsidiana + Ignis Rex, Soberano das Cinzas',
    comboRef: 'Grimório: Fúria de Ignis • Combo Oficial #1',
    accentColor: '#ef4444',
    p1Name: 'Ignis Rex (Você)',
    p1AvatarCardId: 'red-011',
    p1Domain: 'red',
    p2Name: 'Vaelen, Rei-Lich',
    p2AvatarCardId: 'pur-010',
    p2Domain: 'purple',
    steps: [
      {
        id: 'red-step-1',
        stepBadge: 'PASSO 1/4 • RELÍQUIA CONTÍNUA',
        title: 'Posicionar Forja de Obsidiana na Retaguarda',
        narrative:
          'O Jogador 1 abre a mão em leque, escolhe a Relíquia Forja de Obsidiana (3⚡) e a posiciona na Retaguarda [R], concedendo +1/+1 no início do turno a um aliado e preparando a sinergia dracônica.',
        sfx: 'summon_heavy',
        musicTrack: 'ambient_battle',
        handCardIds: ['red-001', 'red-019', 'red-013', 'red-011', 'red-015'],
        selectedHandIndex: 1,
        dockActionLabel: '+ Posicionar Relíquia [R]',
        dockActionType: 'rearguard',
        dockStatusText: '✅ Casa de Retaguarda selecionada: Posicionando Forja de Obsidiana (0/5 PV, 1🛡️)!',
        targetLane: 'playerRearguard',
        targetSlotIndex: 2,
        targetWatermark: '+ Relíquia [R]',
        heraldTitle: '🏛️ FORJA DE OBSIDIANA ATIVADA!',
        heraldSubtitle: 'Relíquia em campo: +1/+1 ao Draconato Escama-Ardente (4/4 ⚔️)!',
        heraldDomain: 'red',
        beforeBoard: {
          aiRearguard: [{ slotIndex: 3, cardId: 'pur-005', atk: 2, hp: 3, maxHp: 3 }],
          playerVanguard: [
            { slotIndex: 1, cardId: 'red-001', atk: 3, hp: 3, maxHp: 3, stance: 'attack' },
            { slotIndex: 2, cardId: 'red-006', atk: 2, hp: 4, maxHp: 4, armor: 1, stance: 'defend' },
          ],
          aiVanguard: [
            { slotIndex: 1, cardId: 'pur-002', atk: 2, hp: 2, maxHp: 2, stance: 'attack' },
            { slotIndex: 3, cardId: 'pur-006', atk: 3, hp: 4, maxHp: 4, stance: 'defend' },
          ],
          playerRearguard: [],
          p1Hp: 26,
          p1Essence: 6,
          p1MaxEssence: 6,
          p2Hp: 24,
          p2Essence: 5,
          p2MaxEssence: 6,
        },
        afterBoard: {
          aiRearguard: [{ slotIndex: 3, cardId: 'pur-005', atk: 2, hp: 3, maxHp: 3 }],
          playerVanguard: [
            {
              slotIndex: 1,
              cardId: 'red-001',
              atk: 4,
              hp: 4,
              maxHp: 4,
              stance: 'attack',
              isBurstTarget: true,
              feedback: { text: '+1/+1 Forja!', color: 'buff' },
            },
            { slotIndex: 2, cardId: 'red-006', atk: 2, hp: 4, maxHp: 4, armor: 1, stance: 'defend' },
          ],
          aiVanguard: [
            { slotIndex: 1, cardId: 'pur-002', atk: 2, hp: 2, maxHp: 2, stance: 'attack' },
            { slotIndex: 3, cardId: 'pur-006', atk: 3, hp: 4, maxHp: 4, stance: 'defend' },
          ],
          playerRearguard: [
            {
              slotIndex: 2,
              cardId: 'red-019',
              atk: 0,
              hp: 5,
              maxHp: 5,
              armor: 1,
              isBurstTarget: true,
              feedback: { text: 'Relíquia Ativa!', color: 'shield' },
            },
          ],
          p1Hp: 26,
          p1Essence: 3,
          p1MaxEssence: 6,
          p2Hp: 24,
          p2Essence: 5,
          p2MaxEssence: 6,
        },
      },
      {
        id: 'red-step-2',
        stepBadge: 'PASSO 2/4 • EXPANSÃO DE DOMÍNIO',
        title: 'Expansão de Domínio: Caldeira do Fogo Primordial',
        narrative:
          'Com 6/6 de Afinidade Carmesim, o Jogador 1 ativa o Santuário Caldeira do Fogo Primordial e lança Chuva de Escória (3⚡), varrendo a Vanguarda inimiga com Acerto Garantido!',
        sfx: 'domain_expand',
        musicTrack: 'domain_red',
        activeDomain: 'red',
        domainBannerTitle: '⛩️ CALDEIRA DO FOGO PRIMORDIAL (3 TURNOS)',
        domainBannerSubtitle: 'Potência: Aliados +2 ATQ • Acerto Garantido: 1 de dano ígneo por turno!',
        handCardIds: ['red-001', 'red-013', 'red-011', 'red-015', 'red-014'],
        selectedHandIndex: 1,
        dockActionLabel: '🔥 Lançar Agora + Expandir Domínio',
        dockActionType: 'spell',
        dockStatusText: '⛩️ Domínio Carmesim 6/6 Pronto: Lançando Chuva de Escória em toda a Vanguarda inimiga!',
        targetLane: 'aiVanguard',
        targetSlotIndex: 3,
        heraldTitle: '⛩️ EXPANSÃO: CALDEIRA DO FOGO PRIMORDIAL',
        heraldSubtitle: 'O tabuleiro se transforma em magma vivo! Chuva de Escória incinera a Vanguarda rival!',
        heraldDomain: 'red',
        breathWaveLane: 'aiVanguard',
        breathWaveDomain: 'red',
        beforeBoard: {
          aiRearguard: [{ slotIndex: 3, cardId: 'pur-005', atk: 2, hp: 3, maxHp: 3 }],
          playerVanguard: [
            { slotIndex: 1, cardId: 'red-001', atk: 4, hp: 4, maxHp: 4, stance: 'attack' },
            { slotIndex: 2, cardId: 'red-006', atk: 2, hp: 4, maxHp: 4, armor: 1, stance: 'defend' },
          ],
          aiVanguard: [
            { slotIndex: 1, cardId: 'pur-002', atk: 2, hp: 2, maxHp: 2, stance: 'attack' },
            { slotIndex: 3, cardId: 'pur-006', atk: 3, hp: 4, maxHp: 4, stance: 'defend' },
          ],
          playerRearguard: [{ slotIndex: 2, cardId: 'red-019', atk: 0, hp: 5, maxHp: 5, armor: 1 }],
          p1Hp: 26,
          p1Essence: 6,
          p1MaxEssence: 6,
          p2Hp: 24,
          p2Essence: 5,
          p2MaxEssence: 6,
        },
        afterBoard: {
          aiRearguard: [{ slotIndex: 3, cardId: 'pur-005', atk: 2, hp: 3, maxHp: 3 }],
          playerVanguard: [
            {
              slotIndex: 1,
              cardId: 'red-001',
              atk: 6,
              hp: 4,
              maxHp: 4,
              stance: 'attack',
              feedback: { text: '+2 ATQ Domínio!', color: 'buff' },
            },
            {
              slotIndex: 2,
              cardId: 'red-006',
              atk: 4,
              hp: 4,
              maxHp: 4,
              armor: 1,
              stance: 'defend',
              feedback: { text: '+2 ATQ Domínio!', color: 'buff' },
            },
          ],
          aiVanguard: [
            {
              slotIndex: 3,
              cardId: 'pur-006',
              atk: 3,
              hp: 1,
              maxHp: 4,
              stance: 'defend',
              isHitTarget: true,
              feedback: { text: '-3 🔥 Escória!', color: 'damage' },
            },
          ],
          playerRearguard: [{ slotIndex: 2, cardId: 'red-019', atk: 0, hp: 5, maxHp: 5, armor: 1 }],
          p1Hp: 26,
          p1Essence: 3,
          p1MaxEssence: 6,
          p2Hp: 21,
          p2Essence: 5,
          p2MaxEssence: 6,
          p2Feedback: { text: '-3 🔥 Acerto Garantido', color: 'damage' },
        },
      },
      {
        id: 'red-step-3',
        stepBadge: 'PASSO 3/4 • INVOCAÇÃO LENDÁRIA',
        title: 'Invocar Ignis Rex, Soberano das Cinzas',
        narrative:
          'O Jogador 1 seleciona a carta Lendária Ignis Rex, Soberano das Cinzas (8⚡) na mão e a invoca na Vanguarda [V]. Ao Entrar, seu Sopro Dracônico varre todas as fileiras inimigas!',
        sfx: 'dragon_breath',
        musicTrack: 'domain_red',
        activeDomain: 'red',
        domainBannerTitle: '⛩️ CALDEIRA DO FOGO PRIMORDIAL (2 TURNOS)',
        domainBannerSubtitle: 'Potência: Aliados +2 ATQ • Acerto Garantido: 1 de dano ígneo por turno!',
        handCardIds: ['red-001', 'red-011', 'red-015', 'red-014', 'red-016'],
        selectedHandIndex: 1,
        dockActionLabel: '+ Vanguarda [V]',
        dockActionType: 'vanguard',
        dockStatusText: '🐉 Invocação Lendária: Posicionando Ignis Rex na Casa 3 da Vanguarda!',
        targetLane: 'playerVanguard',
        targetSlotIndex: 3,
        targetWatermark: '+ Vanguarda [V]',
        heraldTitle: '🐉 LENDÁRIA: IGNIS REX, SOBERANO DAS CINZAS',
        heraldSubtitle: 'Sopro Dracônico devasta as fileiras inimigas em 3 de dano de fogo!',
        heraldDomain: 'red',
        breathWaveLane: 'aiRearguard',
        breathWaveDomain: 'red',
        beforeBoard: {
          aiRearguard: [{ slotIndex: 3, cardId: 'pur-005', atk: 2, hp: 3, maxHp: 3 }],
          playerVanguard: [
            { slotIndex: 1, cardId: 'red-001', atk: 6, hp: 4, maxHp: 4, stance: 'attack' },
            { slotIndex: 2, cardId: 'red-006', atk: 4, hp: 4, maxHp: 4, armor: 1, stance: 'defend' },
          ],
          aiVanguard: [{ slotIndex: 3, cardId: 'pur-006', atk: 3, hp: 1, maxHp: 4, stance: 'defend' }],
          playerRearguard: [{ slotIndex: 2, cardId: 'red-019', atk: 0, hp: 5, maxHp: 5, armor: 1 }],
          p1Hp: 26,
          p1Essence: 8,
          p1MaxEssence: 8,
          p2Hp: 21,
          p2Essence: 6,
          p2MaxEssence: 8,
        },
        afterBoard: {
          aiRearguard: [
            {
              slotIndex: 3,
              cardId: 'pur-005',
              atk: 2,
              hp: 1,
              maxHp: 3,
              isHitTarget: true,
              feedback: { text: '-3 🔥 Sopro!', color: 'damage' },
            },
          ],
          playerVanguard: [
            { slotIndex: 1, cardId: 'red-001', atk: 6, hp: 4, maxHp: 4, stance: 'attack' },
            { slotIndex: 2, cardId: 'red-006', atk: 4, hp: 4, maxHp: 4, armor: 1, stance: 'defend' },
            {
              slotIndex: 3,
              cardId: 'red-011',
              atk: 10,
              hp: 8,
              maxHp: 8,
              armor: 2,
              stance: 'attack',
              isBurstTarget: true,
              feedback: { text: 'Sopro 3 🔥!', color: 'buff' },
            },
          ],
          aiVanguard: [],
          playerRearguard: [{ slotIndex: 2, cardId: 'red-019', atk: 0, hp: 5, maxHp: 5, armor: 1 }],
          p1Hp: 26,
          p1Essence: 0,
          p1MaxEssence: 8,
          p2Hp: 15,
          p2Essence: 6,
          p2MaxEssence: 8,
          p2Feedback: { text: '-6 🔥 Devastação', color: 'damage' },
        },
      },
      {
        id: 'red-step-4',
        stepBadge: 'PASSO 4/4 • ASCENSÃO & GOLPE LETAL',
        title: 'Ascensão do Draconato & Investida Final',
        narrative:
          'O Jogador 1 seleciona o Draconato Escama-Ardente já em campo, ativa 👑 Ascender (5⚡) para evoluí-lo em Campeão Draconato (8/6 com Voo & Atropelar) e desfere o golpe letal contra o Soberano rival!',
        sfx: 'ascend',
        musicTrack: 'domain_red',
        activeDomain: 'red',
        domainBannerTitle: '⛩️ CALDEIRA DO FOGO PRIMORDIAL (VITÓRIA IMINENTE)',
        domainBannerSubtitle: 'Ascensão preservou todos os bônus acumulados da Forja (+3/+1)!',
        handCardIds: ['red-015', 'red-014', 'red-016', 'red-004'],
        selectedHandIndex: 0,
        dockActionLabel: '👑 Ascender (5⚡) + Atacar Soberano',
        dockActionType: 'ascend',
        dockStatusText: '👑 Evoluindo Draconato Escama-Ardente → Campeão Draconato (8⚔️ / 6❤️, Voo, Atropelar)!',
        targetLane: 'playerVanguard',
        targetSlotIndex: 1,
        heraldTitle: '👑 ASCENSÃO: CAMPEÃO DRACONATO + ATAQUE TOTAL!',
        heraldSubtitle: 'Ignis Rex (10⚔️) + Campeão Draconato (8⚔️) zeram a Vida do Soberano rival!',
        heraldDomain: 'gold',
        beforeBoard: {
          aiRearguard: [{ slotIndex: 3, cardId: 'pur-005', atk: 2, hp: 1, maxHp: 3 }],
          playerVanguard: [
            { slotIndex: 1, cardId: 'red-001', atk: 6, hp: 4, maxHp: 4, stance: 'attack' },
            { slotIndex: 2, cardId: 'red-006', atk: 4, hp: 4, maxHp: 4, armor: 1, stance: 'defend' },
            { slotIndex: 3, cardId: 'red-011', atk: 10, hp: 8, maxHp: 8, armor: 2, stance: 'attack' },
          ],
          aiVanguard: [],
          playerRearguard: [{ slotIndex: 2, cardId: 'red-019', atk: 0, hp: 5, maxHp: 5, armor: 1 }],
          p1Hp: 26,
          p1Essence: 8,
          p1MaxEssence: 8,
          p2Hp: 15,
          p2Essence: 6,
          p2MaxEssence: 8,
        },
        afterBoard: {
          aiRearguard: [],
          playerVanguard: [
            {
              slotIndex: 1,
              cardId: 'red-001',
              atk: 8,
              hp: 6,
              maxHp: 6,
              armor: 1,
              isAscended: true,
              stance: 'attack',
              isLunging: true,
              isBurstTarget: true,
              burstKind: 'ascend',
              feedback: { text: '👑 Ascendido 8/6!', color: 'buff' },
            },
            { slotIndex: 2, cardId: 'red-006', atk: 4, hp: 4, maxHp: 4, armor: 1, stance: 'defend' },
            {
              slotIndex: 3,
              cardId: 'red-011',
              atk: 10,
              hp: 8,
              maxHp: 8,
              armor: 2,
              stance: 'attack',
              isLunging: true,
              feedback: { text: '⚔️ -10 Letal!', color: 'damage' },
            },
          ],
          aiVanguard: [],
          playerRearguard: [{ slotIndex: 2, cardId: 'red-019', atk: 0, hp: 5, maxHp: 5, armor: 1 }],
          p1Hp: 26,
          p1Essence: 3,
          p1MaxEssence: 8,
          p2Hp: 0,
          p2Essence: 6,
          p2MaxEssence: 8,
          p2Feedback: { text: '💥 -18 VITÓRIA!', color: 'damage' },
        },
      },
    ],
  },
  {
    id: 'eternal_frost_domain',
    shortTab: '❄️ Gelo Eterno',
    badge: 'COMBO #4 • CONGELAMENTO TOTAL & OLHO DO MAELSTROM',
    title: 'Olho do Maelstrom Astral',
    subtitle: 'Glacius, Sopro do Inverno + Prisão de Gelo + Astrolábio de Safira',
    comboRef: 'Grimório: Conclave da Geada • Combo Oficial #4',
    accentColor: '#38bdf8',
    p1Name: 'Glacius (Você)',
    p1AvatarCardId: 'blu-010',
    p1Domain: 'blue',
    p2Name: 'Kaelen, Senhor da Guerra',
    p2AvatarCardId: 'red-011',
    p2Domain: 'red',
    steps: [
      {
        id: 'blu-step-1',
        stepBadge: 'PASSO 1/4 • FEITIÇO DE CONTROLE',
        title: 'Lançar Prisão de Gelo na Vanguarda Inimiga',
        narrative:
          'O Jogador 1 escolhe Prisão de Gelo (2⚡) na mão e a lança sobre a Vanguarda agressiva inimiga, aplicando ❄️ Congelado a todas as unidades da fileira!',
        sfx: 'freeze',
        musicTrack: 'ambient_battle',
        handCardIds: ['blu-012', 'blu-019', 'blu-010', 'blu-016', 'blu-002'],
        selectedHandIndex: 0,
        dockActionLabel: '❄️ Lançar Agora',
        dockActionType: 'spell',
        dockStatusText: '❄️ Alvo em Área: Congelando toda a Vanguarda inimiga por 1 turno!',
        targetLane: 'aiVanguard',
        targetSlotIndex: 2,
        heraldTitle: '❄️ FEITIÇO: PRISÃO DE GELO',
        heraldSubtitle: 'Toda a Vanguarda inimiga foi Congelada e perde sua próxima ação de ataque!',
        heraldDomain: 'blue',
        breathWaveLane: 'aiVanguard',
        breathWaveDomain: 'blue',
        beforeBoard: {
          aiRearguard: [{ slotIndex: 4, cardId: 'red-003', atk: 3, hp: 2, maxHp: 2 }],
          playerVanguard: [
            { slotIndex: 2, cardId: 'blu-006', atk: 2, hp: 5, maxHp: 5, armor: 1, stance: 'defend' },
          ],
          aiVanguard: [
            { slotIndex: 1, cardId: 'red-002', atk: 3, hp: 2, maxHp: 2, stance: 'attack' },
            { slotIndex: 2, cardId: 'red-007', atk: 5, hp: 4, maxHp: 4, stance: 'attack' },
            { slotIndex: 4, cardId: 'red-005', atk: 4, hp: 3, maxHp: 3, stance: 'attack' },
          ],
          playerRearguard: [{ slotIndex: 1, cardId: 'blu-002', atk: 2, hp: 3, maxHp: 3 }],
          p1Hp: 24,
          p1Essence: 6,
          p1MaxEssence: 6,
          p2Hp: 25,
          p2Essence: 4,
          p2MaxEssence: 6,
        },
        afterBoard: {
          aiRearguard: [{ slotIndex: 4, cardId: 'red-003', atk: 3, hp: 2, maxHp: 2 }],
          playerVanguard: [
            { slotIndex: 2, cardId: 'blu-006', atk: 2, hp: 5, maxHp: 5, armor: 1, stance: 'defend' },
          ],
          aiVanguard: [
            {
              slotIndex: 1,
              cardId: 'red-002',
              atk: 3,
              hp: 2,
              maxHp: 2,
              isFrozen: true,
              isHitTarget: true,
              feedback: { text: '❄️ Congelado!', color: 'freeze' },
            },
            {
              slotIndex: 2,
              cardId: 'red-007',
              atk: 5,
              hp: 4,
              maxHp: 4,
              isFrozen: true,
              isHitTarget: true,
              feedback: { text: '❄️ Congelado!', color: 'freeze' },
            },
            {
              slotIndex: 4,
              cardId: 'red-005',
              atk: 4,
              hp: 3,
              maxHp: 3,
              isFrozen: true,
              isHitTarget: true,
              feedback: { text: '❄️ Congelado!', color: 'freeze' },
            },
          ],
          playerRearguard: [{ slotIndex: 1, cardId: 'blu-002', atk: 2, hp: 3, maxHp: 3 }],
          p1Hp: 24,
          p1Essence: 4,
          p1MaxEssence: 6,
          p2Hp: 25,
          p2Essence: 4,
          p2MaxEssence: 6,
        },
      },
      {
        id: 'blu-step-2',
        stepBadge: 'PASSO 2/4 • RELÍQUIA ASTRAL',
        title: 'Posicionar Astrolábio de Safira na Retaguarda',
        narrative:
          'O Jogador 1 seleciona o Astrolábio de Safira (3⚡) na mão e o posiciona na Retaguarda [R], comprando 1 carta extra todo início de turno.',
        sfx: 'shield_up',
        musicTrack: 'ambient_battle',
        handCardIds: ['blu-019', 'blu-010', 'blu-016', 'blu-002'],
        selectedHandIndex: 0,
        dockActionLabel: '+ Posicionar Relíquia [R]',
        dockActionType: 'rearguard',
        dockStatusText: '🏛️ Posicionando Astrolábio de Safira na Casa 3 da Retaguarda (+1 Carta/turno)!',
        targetLane: 'playerRearguard',
        targetSlotIndex: 3,
        targetWatermark: '+ Relíquia [R]',
        heraldTitle: '🏛️ RELÍQUIA: ASTROLÁBIO DE SAFIRA',
        heraldSubtitle: 'Motor de compra contínua ativado na Retaguarda (+1 carta no início de cada turno)!',
        heraldDomain: 'blue',
        beforeBoard: {
          aiRearguard: [{ slotIndex: 4, cardId: 'red-003', atk: 3, hp: 2, maxHp: 2 }],
          playerVanguard: [
            { slotIndex: 2, cardId: 'blu-006', atk: 2, hp: 5, maxHp: 5, armor: 1, stance: 'defend' },
          ],
          aiVanguard: [
            { slotIndex: 1, cardId: 'red-002', atk: 3, hp: 2, maxHp: 2, isFrozen: true },
            { slotIndex: 2, cardId: 'red-007', atk: 5, hp: 4, maxHp: 4, isFrozen: true },
            { slotIndex: 4, cardId: 'red-005', atk: 4, hp: 3, maxHp: 3, isFrozen: true },
          ],
          playerRearguard: [{ slotIndex: 1, cardId: 'blu-002', atk: 2, hp: 3, maxHp: 3 }],
          p1Hp: 24,
          p1Essence: 4,
          p1MaxEssence: 6,
          p2Hp: 25,
          p2Essence: 4,
          p2MaxEssence: 6,
        },
        afterBoard: {
          aiRearguard: [{ slotIndex: 4, cardId: 'red-003', atk: 3, hp: 2, maxHp: 2 }],
          playerVanguard: [
            { slotIndex: 2, cardId: 'blu-006', atk: 2, hp: 5, maxHp: 5, armor: 1, stance: 'defend' },
          ],
          aiVanguard: [
            { slotIndex: 1, cardId: 'red-002', atk: 3, hp: 2, maxHp: 2, isFrozen: true },
            { slotIndex: 2, cardId: 'red-007', atk: 5, hp: 4, maxHp: 4, isFrozen: true },
            { slotIndex: 4, cardId: 'red-005', atk: 4, hp: 3, maxHp: 3, isFrozen: true },
          ],
          playerRearguard: [
            { slotIndex: 1, cardId: 'blu-002', atk: 2, hp: 3, maxHp: 3 },
            {
              slotIndex: 3,
              cardId: 'blu-019',
              atk: 0,
              hp: 5,
              maxHp: 5,
              armor: 1,
              isBurstTarget: true,
              feedback: { text: '+1 Carta/Turno!', color: 'shield' },
            },
          ],
          p1Hp: 24,
          p1Essence: 1,
          p1MaxEssence: 6,
          p2Hp: 25,
          p2Essence: 4,
          p2MaxEssence: 6,
        },
      },
      {
        id: 'blu-step-3',
        stepBadge: 'PASSO 3/4 • EXPANSÃO DE DOMÍNIO',
        title: 'Expansão: Olho do Maelstrom Astral + Glacius',
        narrative:
          'Com 6/6 de Afinidade da Tempestade, o Jogador 1 expande o Olho do Maelstrom Astral e invoca Glacius, Sopro do Inverno (7⚡) na Vanguarda, congelando e varrendo a linha inimiga!',
        sfx: 'domain_expand',
        musicTrack: 'domain_blue',
        activeDomain: 'blue',
        domainBannerTitle: '⛩️ OLHO DO MAELSTROM ASTRAL (3 TURNOS)',
        domainBannerSubtitle: 'Acerto Garantido: Congela a maior ameaça inimiga e compra cartas extras!',
        handCardIds: ['blu-010', 'blu-016', 'blu-002', 'blu-014'],
        selectedHandIndex: 0,
        dockActionLabel: '+ Vanguarda [V] + Expandir Domínio',
        dockActionType: 'vanguard',
        dockStatusText: '🐉 Invocando Glacius, Sopro do Inverno na Vanguarda sob o Maelstrom Astral!',
        targetLane: 'playerVanguard',
        targetSlotIndex: 3,
        targetWatermark: '+ Vanguarda [V]',
        heraldTitle: '⛩️ OLHO DO MAELSTROM + GLACIUS!',
        heraldSubtitle: 'Sopro Glacial causa 2 de dano em área e mantém o campo inimigo paralisado!',
        heraldDomain: 'blue',
        breathWaveLane: 'aiVanguard',
        breathWaveDomain: 'blue',
        beforeBoard: {
          aiRearguard: [{ slotIndex: 4, cardId: 'red-003', atk: 3, hp: 2, maxHp: 2 }],
          playerVanguard: [
            { slotIndex: 2, cardId: 'blu-006', atk: 2, hp: 5, maxHp: 5, armor: 1, stance: 'defend' },
          ],
          aiVanguard: [
            { slotIndex: 1, cardId: 'red-002', atk: 3, hp: 2, maxHp: 2, isFrozen: true },
            { slotIndex: 2, cardId: 'red-007', atk: 5, hp: 4, maxHp: 4, isFrozen: true },
            { slotIndex: 4, cardId: 'red-005', atk: 4, hp: 3, maxHp: 3, isFrozen: true },
          ],
          playerRearguard: [
            { slotIndex: 1, cardId: 'blu-002', atk: 2, hp: 3, maxHp: 3 },
            { slotIndex: 3, cardId: 'blu-019', atk: 0, hp: 5, maxHp: 5, armor: 1 },
          ],
          p1Hp: 24,
          p1Essence: 7,
          p1MaxEssence: 7,
          p2Hp: 25,
          p2Essence: 5,
          p2MaxEssence: 7,
        },
        afterBoard: {
          aiRearguard: [{ slotIndex: 4, cardId: 'red-003', atk: 3, hp: 2, maxHp: 2, isFrozen: true }],
          playerVanguard: [
            { slotIndex: 2, cardId: 'blu-006', atk: 3, hp: 5, maxHp: 5, armor: 1, stance: 'defend' },
            {
              slotIndex: 3,
              cardId: 'blu-010',
              atk: 7,
              hp: 7,
              maxHp: 7,
              armor: 1,
              stance: 'attack',
              isBurstTarget: true,
              feedback: { text: 'Sopro Glacial!', color: 'freeze' },
            },
          ],
          aiVanguard: [
            {
              slotIndex: 2,
              cardId: 'red-007',
              atk: 5,
              hp: 2,
              maxHp: 4,
              isFrozen: true,
              isHitTarget: true,
              feedback: { text: '-2 ❄️ Sopro!', color: 'damage' },
            },
            {
              slotIndex: 4,
              cardId: 'red-005',
              atk: 4,
              hp: 1,
              maxHp: 3,
              isFrozen: true,
              isHitTarget: true,
              feedback: { text: '-2 ❄️ Sopro!', color: 'damage' },
            },
          ],
          playerRearguard: [
            { slotIndex: 1, cardId: 'blu-002', atk: 3, hp: 3, maxHp: 3 },
            { slotIndex: 3, cardId: 'blu-019', atk: 0, hp: 5, maxHp: 5, armor: 1 },
          ],
          p1Hp: 24,
          p1Essence: 0,
          p1MaxEssence: 7,
          p2Hp: 20,
          p2Essence: 5,
          p2MaxEssence: 7,
          p2Feedback: { text: '-5 ❄️ Tempestade', color: 'damage' },
        },
      },
      {
        id: 'blu-step-4',
        stepBadge: 'PASSO 4/4 • EXECUÇÃO EM ÁREA',
        title: 'Zero Absoluto Estilhaça o Tabuleiro Rival',
        narrative:
          'No turno seguinte, o Jogador 1 seleciona Zero Absoluto na mão e o lança para estilhaçar todas as unidades congeladas e atacar livremente com Glacius!',
        sfx: 'spell_arcane',
        musicTrack: 'domain_blue',
        activeDomain: 'blue',
        domainBannerTitle: '⛩️ OLHO DO MAELSTROM ASTRAL (DOMÍNIO TOTAL)',
        domainBannerSubtitle: 'Tabuleiro inimigo estilhaçado — ataque direto com Voo!',
        handCardIds: ['blu-016', 'blu-002', 'blu-014', 'blu-015'],
        selectedHandIndex: 0,
        dockActionLabel: '⚡ Lançar Zero Absoluto',
        dockActionType: 'spell',
        dockStatusText: '💥 Estilhaçando todas as unidades inimigas congeladas e atacando com Glacius!',
        targetLane: 'aiVanguard',
        targetSlotIndex: 2,
        heraldTitle: '❄️ ZERO ABSOLUTO + VOO DE GLACIUS!',
        heraldSubtitle: 'Unidades congeladas são estilhaçadas! Glacius e Arcanista atacam sem bloqueio!',
        heraldDomain: 'blue',
        breathWaveLane: 'aiVanguard',
        breathWaveDomain: 'blue',
        beforeBoard: {
          aiRearguard: [{ slotIndex: 4, cardId: 'red-003', atk: 3, hp: 2, maxHp: 2, isFrozen: true }],
          playerVanguard: [
            { slotIndex: 2, cardId: 'blu-006', atk: 3, hp: 5, maxHp: 5, armor: 1, stance: 'attack' },
            { slotIndex: 3, cardId: 'blu-010', atk: 7, hp: 7, maxHp: 7, armor: 1, stance: 'attack' },
          ],
          aiVanguard: [
            { slotIndex: 2, cardId: 'red-007', atk: 5, hp: 2, maxHp: 4, isFrozen: true },
            { slotIndex: 4, cardId: 'red-005', atk: 4, hp: 1, maxHp: 3, isFrozen: true },
          ],
          playerRearguard: [
            { slotIndex: 1, cardId: 'blu-002', atk: 3, hp: 3, maxHp: 3 },
            { slotIndex: 3, cardId: 'blu-019', atk: 0, hp: 5, maxHp: 5, armor: 1 },
          ],
          p1Hp: 24,
          p1Essence: 8,
          p1MaxEssence: 8,
          p2Hp: 20,
          p2Essence: 5,
          p2MaxEssence: 8,
        },
        afterBoard: {
          aiRearguard: [],
          playerVanguard: [
            {
              slotIndex: 2,
              cardId: 'blu-006',
              atk: 3,
              hp: 5,
              maxHp: 5,
              armor: 1,
              stance: 'attack',
              isLunging: true,
              feedback: { text: '⚔️ +3 Dano!', color: 'buff' },
            },
            {
              slotIndex: 3,
              cardId: 'blu-010',
              atk: 9,
              hp: 7,
              maxHp: 7,
              armor: 1,
              stance: 'attack',
              isLunging: true,
              isBurstTarget: true,
              feedback: { text: '❄️ -9 Direto!', color: 'damage' },
            },
          ],
          aiVanguard: [],
          playerRearguard: [
            { slotIndex: 1, cardId: 'blu-002', atk: 3, hp: 3, maxHp: 3, isLunging: true },
            { slotIndex: 3, cardId: 'blu-019', atk: 0, hp: 5, maxHp: 5, armor: 1 },
          ],
          p1Hp: 24,
          p1Essence: 3,
          p1MaxEssence: 8,
          p2Hp: 0,
          p2Essence: 5,
          p2MaxEssence: 8,
          p2Feedback: { text: '💥 -20 VITÓRIA!', color: 'damage' },
        },
      },
    ],
  },
  {
    id: 'abyssal_crypt_domain',
    shortTab: '💀 Cripta Abissal',
    badge: 'COMBO #7 • REANIMAÇÃO DA CRIPTA & ECLIPSE DO TRONO',
    title: 'Eclipse do Trono de Ossos',
    subtitle: 'Trono de Ossos + Vaelen, o Rei-Lich + Ceifador de Almas',
    comboRef: 'Grimório: Legião de Vaelen • Combo Oficial #7',
    accentColor: '#a855f7',
    p1Name: 'Vaelen, Rei-Lich (Você)',
    p1AvatarCardId: 'pur-010',
    p1Domain: 'purple',
    p2Name: 'Sylvanus, Titã',
    p2AvatarCardId: 'grn-010',
    p2Domain: 'green',
    steps: [
      {
        id: 'pur-step-1',
        stepBadge: 'PASSO 1/4 • RELÍQUIA NECRÓTICA',
        title: 'Posicionar Trono de Ossos na Retaguarda',
        narrative:
          'O Jogador 1 seleciona a Relíquia Trono de Ossos (3⚡) na mão e a posiciona na Retaguarda [R], drenando 1 PV do Soberano inimigo todo início de turno.',
        sfx: 'summon_heavy',
        musicTrack: 'ambient_battle',
        handCardIds: ['pur-019', 'pur-010', 'pur-014', 'pur-009', 'pur-001'],
        selectedHandIndex: 0,
        dockActionLabel: '+ Posicionar Relíquia [R]',
        dockActionType: 'rearguard',
        dockStatusText: '🏛️ Posicionando Trono de Ossos na Casa 2 da Retaguarda (Dreno Contínuo)!',
        targetLane: 'playerRearguard',
        targetSlotIndex: 2,
        targetWatermark: '+ Relíquia [R]',
        heraldTitle: '🏛️ RELÍQUIA: TRONO DE OSSOS',
        heraldSubtitle: 'Drena 1 PV do Soberano rival e fortalece a Cripta Abissal!',
        heraldDomain: 'purple',
        beforeBoard: {
          aiRearguard: [],
          playerVanguard: [
            { slotIndex: 1, cardId: 'pur-001', atk: 2, hp: 1, maxHp: 1, stance: 'attack' },
            { slotIndex: 3, cardId: 'pur-006', atk: 3, hp: 4, maxHp: 4, stance: 'defend' },
          ],
          aiVanguard: [
            { slotIndex: 2, cardId: 'grn-006', atk: 4, hp: 5, maxHp: 5, stance: 'attack' },
            { slotIndex: 4, cardId: 'grn-007', atk: 5, hp: 5, maxHp: 5, stance: 'attack' },
          ],
          playerRearguard: [],
          p1Hp: 22,
          p1Essence: 6,
          p1MaxEssence: 6,
          p2Hp: 22,
          p2Essence: 4,
          p2MaxEssence: 6,
        },
        afterBoard: {
          aiRearguard: [],
          playerVanguard: [
            { slotIndex: 1, cardId: 'pur-001', atk: 2, hp: 1, maxHp: 1, stance: 'attack' },
            { slotIndex: 3, cardId: 'pur-006', atk: 3, hp: 4, maxHp: 4, stance: 'defend' },
          ],
          aiVanguard: [
            { slotIndex: 2, cardId: 'grn-006', atk: 4, hp: 5, maxHp: 5, stance: 'attack' },
            { slotIndex: 4, cardId: 'grn-007', atk: 5, hp: 5, maxHp: 5, stance: 'attack' },
          ],
          playerRearguard: [
            {
              slotIndex: 2,
              cardId: 'pur-019',
              atk: 0,
              hp: 5,
              maxHp: 5,
              armor: 1,
              isBurstTarget: true,
              feedback: { text: 'Dreno Ativo!', color: 'heal' },
            },
          ],
          p1Hp: 23,
          p1Essence: 3,
          p1MaxEssence: 6,
          p2Hp: 21,
          p2Essence: 4,
          p2MaxEssence: 6,
          p1Feedback: { text: '+1 ❤️ Dreno', color: 'heal' },
          p2Feedback: { text: '-1 💀 Trono', color: 'damage' },
        },
      },
      {
        id: 'pur-step-2',
        stepBadge: 'PASSO 2/4 • EXPANSÃO DE DOMÍNIO',
        title: 'Expansão: Eclipse do Trono de Ossos',
        narrative:
          'Com 6/6 de Afinidade do Abismo, o Jogador 1 invoca a Expansão de Domínio Eclipse do Trono de Ossos: todas as unidades aliadas ganham Dreno de Vida e o Soberano inimigo sofre 1 de dano necrótico por turno!',
        sfx: 'domain_expand',
        musicTrack: 'domain_purple',
        activeDomain: 'purple',
        domainBannerTitle: '⛩️ ECLIPSE DO TRONO DE OSSOS (3 TURNOS)',
        domainBannerSubtitle: 'Potência: Aliados recebem +1 ATQ e Dreno de Vida • Acerto Garantido: Drena 1 PV/turno!',
        handCardIds: ['pur-010', 'pur-014', 'pur-009', 'pur-001'],
        selectedHandIndex: 2,
        dockActionLabel: '+ Vanguarda [V] + Expandir Domínio',
        dockActionType: 'domain',
        dockStatusText: '⛩️ Expandindo Eclipse do Trono de Ossos e invocando Ceifador de Almas (Toque Letal)!',
        targetLane: 'playerVanguard',
        targetSlotIndex: 2,
        targetWatermark: '+ Vanguarda [V]',
        heraldTitle: '⛩️ EXPANSÃO: ECLIPSE DO TRONO DE OSSOS',
        heraldSubtitle: 'O Abismo engole a arena! Ceifador de Almas entra com Toque Letal e Dreno de Vida!',
        heraldDomain: 'purple',
        beforeBoard: {
          aiRearguard: [],
          playerVanguard: [
            { slotIndex: 1, cardId: 'pur-001', atk: 2, hp: 1, maxHp: 1, stance: 'attack' },
            { slotIndex: 3, cardId: 'pur-006', atk: 3, hp: 4, maxHp: 4, stance: 'defend' },
          ],
          aiVanguard: [
            { slotIndex: 2, cardId: 'grn-006', atk: 4, hp: 5, maxHp: 5, stance: 'attack' },
            { slotIndex: 4, cardId: 'grn-007', atk: 5, hp: 5, maxHp: 5, stance: 'attack' },
          ],
          playerRearguard: [{ slotIndex: 2, cardId: 'pur-019', atk: 0, hp: 5, maxHp: 5, armor: 1 }],
          p1Hp: 23,
          p1Essence: 6,
          p1MaxEssence: 6,
          p2Hp: 21,
          p2Essence: 4,
          p2MaxEssence: 6,
        },
        afterBoard: {
          aiRearguard: [],
          playerVanguard: [
            { slotIndex: 1, cardId: 'pur-001', atk: 3, hp: 1, maxHp: 1, stance: 'attack' },
            {
              slotIndex: 2,
              cardId: 'pur-009',
              atk: 5,
              hp: 3,
              maxHp: 3,
              stance: 'attack',
              isBurstTarget: true,
              feedback: { text: '☠ Toque Letal!', color: 'buff' },
            },
            { slotIndex: 3, cardId: 'pur-006', atk: 4, hp: 4, maxHp: 4, stance: 'defend' },
          ],
          aiVanguard: [
            {
              slotIndex: 2,
              cardId: 'grn-006',
              atk: 4,
              hp: 2,
              maxHp: 5,
              isHitTarget: true,
              feedback: { text: '-3 💀 Eclipse!', color: 'damage' },
            },
            { slotIndex: 4, cardId: 'grn-007', atk: 5, hp: 5, maxHp: 5, stance: 'attack' },
          ],
          playerRearguard: [{ slotIndex: 2, cardId: 'pur-019', atk: 0, hp: 5, maxHp: 5, armor: 1 }],
          p1Hp: 25,
          p1Essence: 2,
          p1MaxEssence: 6,
          p2Hp: 18,
          p2Essence: 4,
          p2MaxEssence: 6,
          p1Feedback: { text: '+2 ❤️ Dreno', color: 'heal' },
          p2Feedback: { text: '-3 💀 Acerto Garantido', color: 'damage' },
        },
      },
      {
        id: 'pur-step-3',
        stepBadge: 'PASSO 3/4 • INVOCAÇÃO DO REI-LICH',
        title: 'Vaelen, o Rei-Lich Reanima a Cripta',
        narrative:
          'O Jogador 1 seleciona Vaelen, o Rei-Lich (7⚡) na mão e o invoca na Vanguarda [V]. Ao Entrar, Vaelen reanima automaticamente a criatura mais forte da Cripta para lutar ao seu lado!',
        sfx: 'summon_heavy',
        musicTrack: 'domain_purple',
        activeDomain: 'purple',
        domainBannerTitle: '⛩️ ECLIPSE DO TRONO DE OSSOS (2 TURNOS)',
        domainBannerSubtitle: 'Reanimação da Cripta ativa — o exército imortal se ergue!',
        handCardIds: ['pur-010', 'pur-014', 'pur-001'],
        selectedHandIndex: 0,
        dockActionLabel: '+ Vanguarda [V]',
        dockActionType: 'vanguard',
        dockStatusText: '👑 Invocando Vaelen, o Rei-Lich: Reanimando Cavaleiro da Morte da Cripta!',
        targetLane: 'playerVanguard',
        targetSlotIndex: 4,
        targetWatermark: '+ Vanguarda [V]',
        heraldTitle: '💀 LENDÁRIA: VAELEN, O REI-LICH',
        heraldSubtitle: 'Ao Entrar: Reanima uma criatura da Cripta diretamente para a sua Vanguarda!',
        heraldDomain: 'purple',
        beforeBoard: {
          aiRearguard: [],
          playerVanguard: [
            { slotIndex: 1, cardId: 'pur-001', atk: 3, hp: 1, maxHp: 1, stance: 'attack' },
            { slotIndex: 2, cardId: 'pur-009', atk: 5, hp: 3, maxHp: 3, stance: 'attack' },
            { slotIndex: 3, cardId: 'pur-006', atk: 4, hp: 4, maxHp: 4, stance: 'defend' },
          ],
          aiVanguard: [{ slotIndex: 4, cardId: 'grn-007', atk: 5, hp: 5, maxHp: 5, stance: 'attack' }],
          playerRearguard: [{ slotIndex: 2, cardId: 'pur-019', atk: 0, hp: 5, maxHp: 5, armor: 1 }],
          p1Hp: 25,
          p1Essence: 7,
          p1MaxEssence: 7,
          p2Hp: 18,
          p2Essence: 5,
          p2MaxEssence: 7,
        },
        afterBoard: {
          aiRearguard: [],
          playerVanguard: [
            { slotIndex: 1, cardId: 'pur-001', atk: 3, hp: 1, maxHp: 1, stance: 'attack' },
            { slotIndex: 2, cardId: 'pur-009', atk: 5, hp: 3, maxHp: 3, stance: 'attack' },
            { slotIndex: 3, cardId: 'pur-006', atk: 4, hp: 4, maxHp: 4, stance: 'defend' },
            {
              slotIndex: 4,
              cardId: 'pur-010',
              atk: 7,
              hp: 7,
              maxHp: 7,
              armor: 1,
              stance: 'attack',
              isBurstTarget: true,
              feedback: { text: 'Rei-Lich!', color: 'buff' },
            },
            {
              slotIndex: 5,
              cardId: 'pur-008',
              atk: 6,
              hp: 5,
              maxHp: 5,
              armor: 1,
              stance: 'attack',
              isBurstTarget: true,
              feedback: { text: '🪦 Reanimado!', color: 'heal' },
            },
          ],
          aiVanguard: [{ slotIndex: 4, cardId: 'grn-007', atk: 5, hp: 5, maxHp: 5, stance: 'attack' }],
          playerRearguard: [{ slotIndex: 2, cardId: 'pur-019', atk: 0, hp: 5, maxHp: 5, armor: 1 }],
          p1Hp: 27,
          p1Essence: 0,
          p1MaxEssence: 7,
          p2Hp: 14,
          p2Essence: 5,
          p2MaxEssence: 7,
        },
      },
      {
        id: 'pur-step-4',
        stepBadge: 'PASSO 4/4 • CEIFA ABISSAL',
        title: 'Toque Letal + Dreno de Vida Total',
        narrative:
          'O Jogador 1 lança Explosão Necrótica (4⚡) da mão e ordena Ataque Total com a Legião de Vaelen, abatendo o colosso inimigo com Toque Letal e drenando toda a Vida do Soberano rival!',
        sfx: 'attack_hit',
        musicTrack: 'domain_purple',
        activeDomain: 'purple',
        domainBannerTitle: '⛩️ ECLIPSE DO TRONO DE OSSOS (VITÓRIA IMORTAL)',
        domainBannerSubtitle: 'Dreno de Vida restaura o Soberano para 30 PV enquanto finaliza o oponente!',
        handCardIds: ['pur-014', 'pur-001', 'pur-012'],
        selectedHandIndex: 0,
        dockActionLabel: '💀 Lançar + Ataque Total',
        dockActionType: 'spell',
        dockStatusText: '⚔️ Ceifando a Vanguarda inimiga e desferindo 18 de dano necrótico ao Soberano rival!',
        targetLane: 'aiVanguard',
        targetSlotIndex: 4,
        heraldTitle: '💀 CEIFA IMORTAL DA LEGIÃO DE VAELEN!',
        heraldSubtitle: 'Toque Letal destrói o defensor e a Vanguarda drena os últimos 14 PV do rival!',
        heraldDomain: 'purple',
        breathWaveLane: 'aiVanguard',
        breathWaveDomain: 'purple',
        beforeBoard: {
          aiRearguard: [],
          playerVanguard: [
            { slotIndex: 1, cardId: 'pur-001', atk: 3, hp: 1, maxHp: 1, stance: 'attack' },
            { slotIndex: 2, cardId: 'pur-009', atk: 5, hp: 3, maxHp: 3, stance: 'attack' },
            { slotIndex: 3, cardId: 'pur-006', atk: 4, hp: 4, maxHp: 4, stance: 'attack' },
            { slotIndex: 4, cardId: 'pur-010', atk: 7, hp: 7, maxHp: 7, armor: 1, stance: 'attack' },
            { slotIndex: 5, cardId: 'pur-008', atk: 6, hp: 5, maxHp: 5, armor: 1, stance: 'attack' },
          ],
          aiVanguard: [{ slotIndex: 4, cardId: 'grn-007', atk: 5, hp: 5, maxHp: 5, stance: 'defend' }],
          playerRearguard: [{ slotIndex: 2, cardId: 'pur-019', atk: 0, hp: 5, maxHp: 5, armor: 1 }],
          p1Hp: 27,
          p1Essence: 8,
          p1MaxEssence: 8,
          p2Hp: 14,
          p2Essence: 5,
          p2MaxEssence: 8,
        },
        afterBoard: {
          aiRearguard: [],
          playerVanguard: [
            { slotIndex: 1, cardId: 'pur-001', atk: 3, hp: 1, maxHp: 1, stance: 'attack', isLunging: true },
            {
              slotIndex: 2,
              cardId: 'pur-009',
              atk: 5,
              hp: 3,
              maxHp: 3,
              stance: 'attack',
              isLunging: true,
              feedback: { text: '☠ Abate Letal!', color: 'damage' },
            },
            { slotIndex: 3, cardId: 'pur-006', atk: 4, hp: 4, maxHp: 4, stance: 'attack', isLunging: true },
            {
              slotIndex: 4,
              cardId: 'pur-010',
              atk: 7,
              hp: 7,
              maxHp: 7,
              armor: 1,
              stance: 'attack',
              isLunging: true,
              feedback: { text: '💀 -7 Dreno!', color: 'heal' },
            },
            {
              slotIndex: 5,
              cardId: 'pur-008',
              atk: 6,
              hp: 5,
              maxHp: 5,
              armor: 1,
              stance: 'attack',
              isLunging: true,
              feedback: { text: '⚔️ -6 Letal!', color: 'damage' },
            },
          ],
          aiVanguard: [],
          playerRearguard: [{ slotIndex: 2, cardId: 'pur-019', atk: 0, hp: 5, maxHp: 5, armor: 1 }],
          p1Hp: 30,
          p1Essence: 4,
          p1MaxEssence: 8,
          p2Hp: 0,
          p2Essence: 5,
          p2MaxEssence: 8,
          p1Feedback: { text: '+3 ❤️ Vida Máxima!', color: 'heal' },
          p2Feedback: { text: '💥 -14 VITÓRIA!', color: 'damage' },
        },
      },
    ],
  },
  {
    id: 'golden_citadel_clash',
    shortTab: '☀️ Cidadela & Colisão',
    badge: 'COMBO #13 • ESCUDO DIVINO EM MASSA & COLISÃO DE DOMÍNIOS 50/50',
    title: 'Cidadela da Aurora vs Eclipse Abissal',
    subtitle: 'Estandarte do Sol Invicto + Decreto de Égide + Aurelius, Arcanjo Solar',
    comboRef: 'Grimório: Bastião de Aurelius • Combo Oficial #13',
    accentColor: '#eab308',
    p1Name: 'Aurelius (Você)',
    p1AvatarCardId: 'gld-010',
    p1Domain: 'gold',
    p2Name: 'Malakor, Senhor do Abismo',
    p2AvatarCardId: 'pur-010',
    p2Domain: 'purple',
    steps: [
      {
        id: 'gld-step-1',
        stepBadge: 'PASSO 1/4 • RELÍQUIA SOLAR',
        title: 'Estandarte do Sol Invicto na Retaguarda',
        narrative:
          'Sob o domínio inimigo, o Jogador 1 escolhe a Relíquia Estandarte do Sol Invicto (3⚡) na mão e a posiciona na Retaguarda [R], concedendo +1/+1 contínuo e preparando a virada dourada!',
        sfx: 'shield_up',
        musicTrack: 'domain_purple',
        activeDomain: 'purple',
        domainBannerTitle: '⛩️ DOMÍNIO INIMIGO ATIVO: ECLIPSE DO TRONO DE OSSOS',
        domainBannerSubtitle: 'O oponente tenta dominar o tabuleiro — prepare sua resposta de Ordem & Ferro!',
        handCardIds: ['gld-019', 'gld-013', 'gld-010', 'gld-001', 'gld-006'],
        selectedHandIndex: 0,
        dockActionLabel: '+ Posicionar Relíquia [R]',
        dockActionType: 'rearguard',
        dockStatusText: '🏛️ Posicionando Estandarte do Sol Invicto na Casa 3 da Retaguarda!',
        targetLane: 'playerRearguard',
        targetSlotIndex: 3,
        targetWatermark: '+ Relíquia [R]',
        heraldTitle: '🏛️ RELÍQUIA: ESTANDARTE DO SOL INVICTO',
        heraldSubtitle: 'Aura Solar concede +1/+1 à Falange da Ordem na Vanguarda!',
        heraldDomain: 'gold',
        beforeBoard: {
          aiRearguard: [{ slotIndex: 2, cardId: 'pur-019', atk: 0, hp: 5, maxHp: 5, armor: 1 }],
          playerVanguard: [
            { slotIndex: 1, cardId: 'gld-001', atk: 2, hp: 3, maxHp: 3, armor: 1, stance: 'defend' },
            { slotIndex: 2, cardId: 'gld-006', atk: 3, hp: 4, maxHp: 4, armor: 1, stance: 'defend' },
          ],
          aiVanguard: [
            { slotIndex: 2, cardId: 'pur-008', atk: 5, hp: 4, maxHp: 5, armor: 1, stance: 'attack' },
            { slotIndex: 3, cardId: 'pur-010', atk: 6, hp: 6, maxHp: 7, armor: 1, stance: 'attack' },
          ],
          playerRearguard: [],
          p1Hp: 21,
          p1Essence: 6,
          p1MaxEssence: 6,
          p2Hp: 22,
          p2Essence: 4,
          p2MaxEssence: 6,
        },
        afterBoard: {
          aiRearguard: [{ slotIndex: 2, cardId: 'pur-019', atk: 0, hp: 5, maxHp: 5, armor: 1 }],
          playerVanguard: [
            {
              slotIndex: 1,
              cardId: 'gld-001',
              atk: 3,
              hp: 4,
              maxHp: 4,
              armor: 1,
              stance: 'defend',
              isBurstTarget: true,
              feedback: { text: '+1/+1 Estandarte!', color: 'buff' },
            },
            {
              slotIndex: 2,
              cardId: 'gld-006',
              atk: 4,
              hp: 5,
              maxHp: 5,
              armor: 1,
              stance: 'defend',
              feedback: { text: '+1/+1 Solar!', color: 'buff' },
            },
          ],
          aiVanguard: [
            { slotIndex: 2, cardId: 'pur-008', atk: 5, hp: 4, maxHp: 5, armor: 1, stance: 'attack' },
            { slotIndex: 3, cardId: 'pur-010', atk: 6, hp: 6, maxHp: 7, armor: 1, stance: 'attack' },
          ],
          playerRearguard: [
            {
              slotIndex: 3,
              cardId: 'gld-019',
              atk: 0,
              hp: 5,
              maxHp: 5,
              armor: 1,
              isBurstTarget: true,
              feedback: { text: 'Relíquia Solar!', color: 'shield' },
            },
          ],
          p1Hp: 21,
          p1Essence: 3,
          p1MaxEssence: 6,
          p2Hp: 22,
          p2Essence: 4,
          p2MaxEssence: 6,
        },
      },
      {
        id: 'gld-step-2',
        stepBadge: 'PASSO 2/4 • COLISÃO DE DOMÍNIOS 50/50!',
        title: 'Colisão de Domínios: Cidadela da Aurora Inabalável!',
        narrative:
          'O Jogador 1 responde com sua própria Expansão de Domínio! O tabuleiro racha ao meio em uma Colisão de Domínios 50/50 (anulando o Acerto Garantido inimigo) enquanto lança Decreto de Égide concedendo Escudo Divino a todos os aliados!',
        sfx: 'domain_expand',
        musicTrack: 'domain_clash',
        activeDomain: 'clash_gold_purple',
        domainBannerTitle: '⚡ COLISÃO DE DOMÍNIOS: CIDADELA DA AURORA vs ECLIPSE ABISSAL',
        domainBannerSubtitle: 'Fenda Central ativa! Acertos Garantidos anulados — Potências colidem 50/50!',
        handCardIds: ['gld-013', 'gld-010', 'gld-001', 'gld-006'],
        selectedHandIndex: 0,
        dockActionLabel: '⛩️ Expandir Domínio + Decreto de Égide',
        dockActionType: 'domain',
        dockStatusText: '⚡ Colisão de Domínios! Concedendo ✦ Escudo Divino a todas as unidades aliadas!',
        targetLane: 'playerVanguard',
        targetSlotIndex: 2,
        heraldTitle: '⚡ COLISÃO DE DOMÍNIOS + DECRETO DE ÉGIDE!',
        heraldSubtitle: 'Cidadela da Aurora divide o tabuleiro ao meio e blinda toda a sua tropa com Escudo Divino!',
        heraldDomain: 'gold',
        beforeBoard: {
          aiRearguard: [{ slotIndex: 2, cardId: 'pur-019', atk: 0, hp: 5, maxHp: 5, armor: 1 }],
          playerVanguard: [
            { slotIndex: 1, cardId: 'gld-001', atk: 3, hp: 4, maxHp: 4, armor: 1, stance: 'defend' },
            { slotIndex: 2, cardId: 'gld-006', atk: 4, hp: 5, maxHp: 5, armor: 1, stance: 'defend' },
          ],
          aiVanguard: [
            { slotIndex: 2, cardId: 'pur-008', atk: 5, hp: 4, maxHp: 5, armor: 1, stance: 'attack' },
            { slotIndex: 3, cardId: 'pur-010', atk: 6, hp: 6, maxHp: 7, armor: 1, stance: 'attack' },
          ],
          playerRearguard: [{ slotIndex: 3, cardId: 'gld-019', atk: 0, hp: 5, maxHp: 5, armor: 1 }],
          p1Hp: 21,
          p1Essence: 6,
          p1MaxEssence: 6,
          p2Hp: 22,
          p2Essence: 4,
          p2MaxEssence: 6,
        },
        afterBoard: {
          aiRearguard: [{ slotIndex: 2, cardId: 'pur-019', atk: 0, hp: 5, maxHp: 5, armor: 1 }],
          playerVanguard: [
            {
              slotIndex: 1,
              cardId: 'gld-001',
              atk: 4,
              hp: 4,
              maxHp: 4,
              armor: 2,
              hasDivineShield: true,
              stance: 'defend',
              isBurstTarget: true,
              feedback: { text: '✦ Escudo Divino!', color: 'shield' },
            },
            {
              slotIndex: 2,
              cardId: 'gld-006',
              atk: 5,
              hp: 5,
              maxHp: 5,
              armor: 2,
              hasDivineShield: true,
              stance: 'defend',
              isBurstTarget: true,
              feedback: { text: '✦ Escudo Divino!', color: 'shield' },
            },
          ],
          aiVanguard: [
            { slotIndex: 2, cardId: 'pur-008', atk: 5, hp: 4, maxHp: 5, armor: 1, stance: 'attack' },
            { slotIndex: 3, cardId: 'pur-010', atk: 6, hp: 6, maxHp: 7, armor: 1, stance: 'attack' },
          ],
          playerRearguard: [
            {
              slotIndex: 3,
              cardId: 'gld-019',
              atk: 0,
              hp: 5,
              maxHp: 5,
              armor: 2,
              hasDivineShield: true,
              feedback: { text: '✦ Protegida!', color: 'shield' },
            },
          ],
          p1Hp: 24,
          p1Essence: 3,
          p1MaxEssence: 6,
          p2Hp: 22,
          p2Essence: 4,
          p2MaxEssence: 6,
          p1Feedback: { text: '+3 ❤️ Égide Solar', color: 'heal' },
        },
      },
      {
        id: 'gld-step-3',
        stepBadge: 'PASSO 3/4 • DESCIDA DO ARCANJO',
        title: 'Invocar Aurelius, Arcanjo Solar & Quebrar o Domínio Inimigo',
        narrative:
          'O Jogador 1 seleciona Aurelius, Arcanjo Solar (8⚡) na mão e o invoca na Vanguarda [V]. Sua luz purificadora destrói a linha de frente inimiga e quebra o domínio rival, fazendo a Cidadela da Aurora reinar absoluta!',
        sfx: 'ascend',
        musicTrack: 'domain_gold',
        activeDomain: 'gold',
        domainBannerTitle: '⛩️ CIDADELA DA AURORA INABALÁVEL (DOMÍNIO SOBERANO)',
        domainBannerSubtitle: 'Domínio inimigo estilhaçado! Toda a sua tropa recebe +2/+2 e Escudo Divino!',
        handCardIds: ['gld-010', 'gld-001', 'gld-006', 'gld-015'],
        selectedHandIndex: 0,
        dockActionLabel: '+ Vanguarda [V]',
        dockActionType: 'vanguard',
        dockStatusText: '☀️ Invocação Lendária: Aurelius, Arcanjo Solar pousa na Casa 3 da Vanguarda!',
        targetLane: 'playerVanguard',
        targetSlotIndex: 3,
        targetWatermark: '+ Vanguarda [V]',
        heraldTitle: '☀️ LENDÁRIA: AURELIUS, ARCANJO SOLAR',
        heraldSubtitle: 'Domínio inimigo quebrado! Aurelius concede +2/+2 a todos os aliados e pune o Abismo!',
        heraldDomain: 'gold',
        breathWaveLane: 'aiVanguard',
        breathWaveDomain: 'gold',
        beforeBoard: {
          aiRearguard: [{ slotIndex: 2, cardId: 'pur-019', atk: 0, hp: 5, maxHp: 5, armor: 1 }],
          playerVanguard: [
            { slotIndex: 1, cardId: 'gld-001', atk: 4, hp: 4, maxHp: 4, armor: 2, hasDivineShield: true, stance: 'defend' },
            { slotIndex: 2, cardId: 'gld-006', atk: 5, hp: 5, maxHp: 5, armor: 2, hasDivineShield: true, stance: 'defend' },
          ],
          aiVanguard: [
            { slotIndex: 2, cardId: 'pur-008', atk: 5, hp: 4, maxHp: 5, armor: 1, stance: 'attack' },
            { slotIndex: 3, cardId: 'pur-010', atk: 6, hp: 6, maxHp: 7, armor: 1, stance: 'attack' },
          ],
          playerRearguard: [{ slotIndex: 3, cardId: 'gld-019', atk: 0, hp: 5, maxHp: 5, armor: 2, hasDivineShield: true }],
          p1Hp: 24,
          p1Essence: 8,
          p1MaxEssence: 8,
          p2Hp: 22,
          p2Essence: 4,
          p2MaxEssence: 8,
        },
        afterBoard: {
          aiRearguard: [],
          playerVanguard: [
            {
              slotIndex: 1,
              cardId: 'gld-001',
              atk: 6,
              hp: 6,
              maxHp: 6,
              armor: 2,
              hasDivineShield: true,
              stance: 'attack',
              feedback: { text: '+2/+2 Aurelius!', color: 'buff' },
            },
            {
              slotIndex: 2,
              cardId: 'gld-006',
              atk: 7,
              hp: 7,
              maxHp: 7,
              armor: 2,
              hasDivineShield: true,
              stance: 'attack',
              feedback: { text: '+2/+2 Aurelius!', color: 'buff' },
            },
            {
              slotIndex: 3,
              cardId: 'gld-010',
              atk: 9,
              hp: 9,
              maxHp: 9,
              armor: 2,
              hasDivineShield: true,
              stance: 'attack',
              isBurstTarget: true,
              burstKind: 'ascend',
              feedback: { text: '☀️ Arcanjo 9/9!', color: 'buff' },
            },
          ],
          aiVanguard: [
            {
              slotIndex: 3,
              cardId: 'pur-010',
              atk: 6,
              hp: 2,
              maxHp: 7,
              armor: 0,
              isHitTarget: true,
              feedback: { text: '-4 ☀️ Julgamento!', color: 'damage' },
            },
          ],
          playerRearguard: [{ slotIndex: 3, cardId: 'gld-019', atk: 0, hp: 5, maxHp: 5, armor: 2, hasDivineShield: true }],
          p1Hp: 28,
          p1Essence: 0,
          p1MaxEssence: 8,
          p2Hp: 14,
          p2Essence: 4,
          p2MaxEssence: 8,
          p1Feedback: { text: '+4 ❤️ Luz Solar', color: 'heal' },
          p2Feedback: { text: '-8 ☀️ Domínio Quebrado!', color: 'damage' },
        },
      },
      {
        id: 'gld-step-4',
        stepBadge: 'PASSO 4/4 • JULGAMENTO DA AURORA',
        title: 'Marcha Inabalável da Falange Dourada',
        narrative:
          'Com todas as unidades protegidas por Escudo Divino e fortalecidas pela Cidadela da Aurora, o Jogador 1 aciona ⚔️ ATACAR para desferir 22 de dano solar e conquistar a vitória!',
        sfx: 'victory',
        musicTrack: 'domain_gold',
        activeDomain: 'gold',
        domainBannerTitle: '⛩️ CIDADELA DA AURORA INABALÁVEL (VITÓRIA SUPREMA)',
        domainBannerSubtitle: '22 de Poder de Ataque com Escudo Divino intacto!',
        handCardIds: ['gld-001', 'gld-006', 'gld-015'],
        selectedHandIndex: 2,
        dockActionLabel: '⚔️ ATACAR COM TODOS (22 ⚔️)',
        dockActionType: 'spell',
        dockStatusText: '☀️ Marcha Solar: Aurelius (9⚔️) + Paladino (7⚔️) + Sentinela (6⚔️) atacam em formação!',
        targetLane: 'aiVanguard',
        targetSlotIndex: 3,
        heraldTitle: '☀️ VITÓRIA SOBERANA: JULGAMENTO DA AURORA!',
        heraldSubtitle: 'A Falange Dourada marcha invulnerável e reduz o Soberano rival a 0 PV!',
        heraldDomain: 'gold',
        beforeBoard: {
          aiRearguard: [],
          playerVanguard: [
            { slotIndex: 1, cardId: 'gld-001', atk: 6, hp: 6, maxHp: 6, armor: 2, hasDivineShield: true, stance: 'attack' },
            { slotIndex: 2, cardId: 'gld-006', atk: 7, hp: 7, maxHp: 7, armor: 2, hasDivineShield: true, stance: 'attack' },
            { slotIndex: 3, cardId: 'gld-010', atk: 9, hp: 9, maxHp: 9, armor: 2, hasDivineShield: true, stance: 'attack' },
          ],
          aiVanguard: [{ slotIndex: 3, cardId: 'pur-010', atk: 6, hp: 2, maxHp: 7, armor: 0, stance: 'defend' }],
          playerRearguard: [{ slotIndex: 3, cardId: 'gld-019', atk: 0, hp: 5, maxHp: 5, armor: 2, hasDivineShield: true }],
          p1Hp: 28,
          p1Essence: 8,
          p1MaxEssence: 8,
          p2Hp: 14,
          p2Essence: 4,
          p2MaxEssence: 8,
        },
        afterBoard: {
          aiRearguard: [],
          playerVanguard: [
            {
              slotIndex: 1,
              cardId: 'gld-001',
              atk: 6,
              hp: 6,
              maxHp: 6,
              armor: 2,
              hasDivineShield: true,
              stance: 'attack',
              isLunging: true,
              feedback: { text: '⚔️ -6 Solar!', color: 'buff' },
            },
            {
              slotIndex: 2,
              cardId: 'gld-006',
              atk: 7,
              hp: 7,
              maxHp: 7,
              armor: 2,
              hasDivineShield: true,
              stance: 'attack',
              isLunging: true,
              feedback: { text: '⚔️ -7 Solar!', color: 'buff' },
            },
            {
              slotIndex: 3,
              cardId: 'gld-010',
              atk: 9,
              hp: 9,
              maxHp: 9,
              armor: 2,
              hasDivineShield: true,
              stance: 'attack',
              isLunging: true,
              isBurstTarget: true,
              burstKind: 'ascend',
              feedback: { text: '☀️ -9 Letal!', color: 'damage' },
            },
          ],
          aiVanguard: [],
          playerRearguard: [{ slotIndex: 3, cardId: 'gld-019', atk: 0, hp: 5, maxHp: 5, armor: 2, hasDivineShield: true }],
          p1Hp: 30,
          p1Essence: 5,
          p1MaxEssence: 8,
          p2Hp: 0,
          p2Essence: 4,
          p2MaxEssence: 8,
          p2Feedback: { text: '💥 -20 VITÓRIA!', color: 'damage' },
        },
      },
    ],
  },
];

function buildSyntheticUnit(
  spec: SimSlotSpec,
  owner: 'player' | 'ai',
  row: RowType,
): BoardUnit | null {
  const baseCard = CARDS_BY_ID[spec.cardId];
  if (!baseCard) return null;

  const isAscended = Boolean(spec.isAscended && baseCard.ascension);
  const effectiveCard: CardDefinition =
    isAscended && baseCard.ascension
      ? {
          ...baseCard,
          name: baseCard.ascension.newName,
          atk: baseCard.ascension.newAtk,
          armor: baseCard.ascension.newArmor,
          hp: baseCard.ascension.newMaxHp,
          keywords: Array.from(
            new Set([...baseCard.keywords, ...baseCard.ascension.addedKeywords]),
          ) as Keyword[],
        }
      : baseCard;

  return {
    instanceId: `sim-${owner}-${row}-${spec.slotIndex}-${spec.cardId}`,
    cardId: effectiveCard.id,
    card: effectiveCard,
    owner,
    row,
    slotIndex: spec.slotIndex,
    currentAtk: spec.atk ?? effectiveCard.atk,
    currentArmor: spec.armor ?? effectiveCard.armor,
    currentHp: spec.hp ?? effectiveCard.hp,
    maxHp: spec.maxHp ?? effectiveCard.hp,
    keywords: [...effectiveCard.keywords],
    regeneration: effectiveCard.regeneration ?? 0,
    hasSummoningSickness: false,
    hasAttackedThisTurn: false,
    isFrozen: Boolean(spec.isFrozen),
    hasDivineShield: Boolean(
      spec.hasDivineShield ?? effectiveCard.keywords.includes('Escudo Divino'),
    ),
    isAscended,
    hasRebornTriggered: false,
    stance: spec.stance ?? 'attack',
    isInvading: row === 'vanguard',
    invasionAtkBonus: row === 'vanguard' ? 1 : 0,
  };
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
  const [isAudioLive, setIsAudioLive] = useState<boolean>(false);

  const scenario = SIM_DUEL_SCENARIOS[scenarioIdx] ?? SIM_DUEL_SCENARIOS[0];
  const step = scenario.steps[stepIdx] ?? scenario.steps[0];

  // Auto-advance micro-phases: 'hand' (Player 1 choosing card in hand) -> 'dock' (Command Dock & Target selection) -> 'impact' (Card enters board + VFX + SFX)
  useEffect(() => {
    if (!isAutoPlaying) return undefined;

    const durationMs =
      subPhase === 'hand' ? 2100 : subPhase === 'dock' ? 2200 : 2800;

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
  }, [isAutoPlaying, subPhase, stepIdx, scenario.steps.length]);

  // Trigger real game audio when audio is enabled
  useEffect(() => {
    if (!isAudioLive) return;
    if (subPhase === 'hand') {
      playSoundEffect('card_draw');
    } else if (subPhase === 'dock') {
      playSoundEffect('button_click');
    } else if (subPhase === 'impact') {
      setBattleMusicTrack(step.musicTrack);
      playSoundEffect(step.sfx);
    }
  }, [isAudioLive, scenarioIdx, stepIdx, subPhase, step.musicTrack, step.sfx]);

  useEffect(() => {
    return () => {
      if (isAudioLive) {
        stopBattleMusic();
      }
    };
  }, [isAudioLive]);

  const handleToggleAudio = () => {
    const next = !isAudioLive;
    setIsAudioLive(next);
    if (next) {
      if (soundMuted && onToggleSound) {
        onToggleSound();
      }
      setBattleMusicTrack(step.musicTrack);
      playSoundEffect(step.sfx);
    } else {
      stopBattleMusic();
    }
  };

  const boardState = subPhase === 'impact' ? step.afterBoard : step.beforeBoard;
  const handCards = step.handCardIds
    .map((id) => CARDS_BY_ID[id])
    .filter((c): c is CardDefinition => Boolean(c));
  const selectedHandCard =
    handCards[step.selectedHandIndex] ?? handCards[0] ?? CARDS_BY_ID['red-011'];

  const p1AvatarCard = CARDS_BY_ID[scenario.p1AvatarCardId];
  const p2AvatarCard = CARDS_BY_ID[scenario.p2AvatarCardId];

  const renderAuthenticLane = (
    laneKey: 'aiRearguard' | 'playerVanguard' | 'aiVanguard' | 'playerRearguard',
    laneClassName: string,
    tagClassName: string,
    tagLabel: string,
    owner: 'player' | 'ai',
    row: RowType,
    slotsList: SimSlotSpec[],
  ) => {
    const hasBreathWave =
      subPhase === 'impact' &&
      step.breathWaveLane === laneKey &&
      Boolean(step.breathWaveDomain);

    return (
      <div className={`mtg-board-lane ${laneClassName}`}>
        <div className={`mtg-lane-tag ${tagClassName}`}>{tagLabel}</div>

        {hasBreathWave && step.breathWaveDomain && (
          <div className={`dragon-breath-wave-fx domain-${step.breathWaveDomain}`} />
        )}

        <div className="mtg-lane-slots">
          {[0, 1, 2, 3, 4, 5].map((slotIdx) => {
            const spec = slotsList.find((s) => s.slotIndex === slotIdx);
            const unit = spec ? buildSyntheticUnit(spec, owner, row) : null;
            const isTargetSlotInDock =
              subPhase === 'dock' &&
              step.targetLane === laneKey &&
              step.targetSlotIndex === slotIdx;

            const feedbackObj: FloatingFeedback | null =
              subPhase === 'impact' && spec?.feedback && unit
                ? {
                    id: `fb-${laneKey}-${slotIdx}-${step.id}`,
                    targetId: unit.instanceId,
                    text: spec.feedback.text,
                    color: spec.feedback.color,
                  }
                : null;

            return (
              <div
                key={`${laneKey}-slot-${slotIdx}`}
                className={`mtg-slot ${
                  isTargetSlotInDock && !unit ? 'can-deploy sim-slot-pulse-target' : ''
                }`}
              >
                {unit ? (
                  <div
                    className={`organic-tabletop-card ${
                      row === 'vanguard'
                        ? owner === 'player'
                          ? 'is-crossing-border-player'
                          : 'is-crossing-border-ai'
                        : ''
                    } ${subPhase === 'impact' && spec?.isLunging ? 'is-lunging-attacker' : ''} ${
                      subPhase === 'impact' && spec?.isHitTarget ? 'is-hit-target' : ''
                    }`}
                    style={
                      {
                        '--lunge-x': '0px',
                        '--lunge-y': owner === 'player' ? '-75px' : '75px',
                      } as React.CSSProperties
                    }
                  >
                    <CardView
                      card={unit.card}
                      unit={unit}
                      mode="board"
                      isSelected={isTargetSlotInDock && owner === 'player'}
                      isValidTarget={isTargetSlotInDock && owner === 'ai'}
                      feedback={feedbackObj}
                      onInspect={onInspectCard}
                      onClick={() => onInspectCard(unit.card)}
                    />

                    {unit.card.type === 'creature' && (
                      <div
                        className={`unit-stance-floating-pill ${
                          unit.stance === 'defend' ? 'stance-defend' : 'stance-attack'
                        }`}
                      >
                        {unit.stance === 'defend' ? '🛡️ DEF' : '⚔️ ATQ'}
                      </div>
                    )}

                    {isTargetSlotInDock && (
                      <div className="sim-board-target-indicator">
                        🎯 {owner === 'ai' ? 'ALVO MIRA' : 'UNIDADE ESCOLHIDA'}
                      </div>
                    )}
                  </div>
                ) : isTargetSlotInDock ? (
                  <span className="mtg-slot-watermark">
                    🎯 {step.targetWatermark || '+ Posicionar'}
                  </span>
                ) : null}

                {/* Authentic Spectacle Target Burst (Mandala Ring + Ascension Pillar) */}
                {subPhase === 'impact' && spec?.isBurstTarget && (
                  <div
                    className={`spectacle-target-burst sim-slot-centered-fx domain-${step.heraldDomain} ${
                      spec.burstKind === 'ascend' ? 'kind-ascend' : ''
                    }`}
                  >
                    <div className="arcane-mandala-ring outer-ring" />
                    <div className="arcane-mandala-ring inner-ring" />
                    {spec.burstKind === 'ascend' && <div className="ascension-light-pillar" />}
                    <span className="spectacle-burst-center-icon">
                      {spec.burstKind === 'ascend' ? '👑' : '✨'}
                    </span>
                  </div>
                )}

                {/* Authentic Combat Impact FX (Shockwave + Slash Cross + 12 Sparks) */}
                {subPhase === 'impact' && spec?.isHitTarget && (
                  <div
                    className={`combat-impact-fx sim-slot-centered-fx is-heavy-impact domain-${step.heraldDomain}`}
                  >
                    <div className="impact-shockwave-ring" />
                    <div className="impact-shockwave-ring secondary-ring" />
                    <div className="impact-particles-ring">
                      {Array.from({ length: 12 }).map((_, pIdx) => (
                        <span
                          key={pIdx}
                          className="impact-particle-spark"
                          style={
                            {
                              '--p-angle': `${pIdx * 30}deg`,
                              '--p-dist': `${54 + (pIdx % 3) * 14}px`,
                            } as React.CSSProperties
                          }
                        />
                      ))}
                    </div>
                    <div className="impact-slash-cross" />
                    <span className="impact-burst-icon">💥</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="home-simulated-arena">
      {/* Top Scenario Switcher & Live Controls */}
      <div className="sim-arena-top-controls">
        <div className="sim-arena-scenario-tabs" role="tablist" aria-label="Duelos Temáticos Simulados">
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
            {isAudioLive ? '🔊 Som da Partida: ON' : '🔇 Ativar Som & Música'}
          </button>
          <button
            type="button"
            className={`sim-arena-ctrl-btn ${isAutoPlaying ? 'is-active' : ''}`}
            onClick={() => setIsAutoPlaying((prev) => !prev)}
          >
            {isAutoPlaying ? '⏸ Pausar' : '▶ Auto'}
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

      {/* Step & Micro-Phase Strip: Lets user see or click 1. Mão -> 2. Comando/Alvo -> 3. Efeito na Mesa */}
      <div className="sim-arena-director-strip">
        <div className="sim-arena-step-pills">
          {scenario.steps.map((st, idx) => (
            <button
              key={st.id}
              type="button"
              className={`sim-step-pill-btn ${idx === stepIdx ? 'is-active' : ''}`}
              onClick={() => {
                setIsAutoPlaying(false);
                setStepIdx(idx);
                setSubPhase('hand');
              }}
            >
              Passo {idx + 1}/4
            </button>
          ))}
        </div>

        <div className="sim-arena-subphase-pills">
          <button
            type="button"
            className={`sim-subphase-btn ${subPhase === 'hand' ? 'is-active' : ''}`}
            onClick={() => {
              setIsAutoPlaying(false);
              setSubPhase('hand');
            }}
          >
            1. 🃏 Escolhendo na Mão
          </button>
          <span className="sim-subphase-arrow">→</span>
          <button
            type="button"
            className={`sim-subphase-btn ${subPhase === 'dock' ? 'is-active' : ''}`}
            onClick={() => {
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
              setIsAutoPlaying(false);
              setSubPhase('impact');
            }}
          >
            3. 💥 Efeitos na Mesa
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
          AUTHENTIC BATTLE ARENA STAGE (Uses exact BattleArena.tsx DOM & CSS!)
          ===================================================================== */}
      <div className="arena-main-column mtg-arena-table sim-authentic-arena-table">
        <div className="arena-fullscreen-stage sim-authentic-fullscreen-stage">
          {/* 1. TOP-CENTER UNIFIED P2 PILL (OPPONENT SOVEREIGN) */}
          <header className="hud-unified-top-bar">
            <div
              className={`hud-top-pill ${
                subPhase === 'impact' && boardState.p2Feedback ? 'is-valid-attack-target' : ''
              }`}
              onClick={() => p2AvatarCard && onInspectCard(p2AvatarCard)}
              title="Clique para inspecionar o Soberano Oponente"
            >
              <div className="hud-mini-avatar opponent">
                {p2AvatarCard?.imagePath ? (
                  <img src={p2AvatarCard.imagePath} alt={scenario.p2Name} />
                ) : (
                  <span>👑</span>
                )}
              </div>
              <span className="hud-pill-name">{scenario.p2Name}</span>
              <span className="hud-pill-stat hp">❤️ {boardState.p2Hp}</span>
              <span className="hud-pill-stat mana">
                ⚡ {boardState.p2Essence}/{boardState.p2MaxEssence}
              </span>
              <span className="hud-pill-stat">🃏 4</span>
              <span className="hud-pill-stat deck">📚 82 • 🪦 5</span>
              {step.activeDomain && (
                <span className="hud-pill-env-chip domain">
                  ⛩️{' '}
                  {step.activeDomain === 'clash_gold_purple'
                    ? 'Colisão 50/50'
                    : DOMAIN_META[step.activeDomain]?.shortName}
                </span>
              )}

              {subPhase === 'impact' && boardState.p2Feedback && (
                <div
                  className={`floating-feedback-pill color-${boardState.p2Feedback.color}`}
                  style={{ top: '34px' }}
                >
                  {boardState.p2Feedback.text}
                </div>
              )}
            </div>
          </header>

          {/* SPECTACLE HERALD BANNER DURING 'impact' SUB-PHASE */}
          {subPhase === 'impact' && (
            <div className={`spectacle-herald-banner domain-${step.heraldDomain}`}>
              <div className="spectacle-herald-art">
                {selectedHandCard?.imagePath ? (
                  <img src={selectedHandCard.imagePath} alt={selectedHandCard.name} />
                ) : (
                  <span>✨</span>
                )}
              </div>
              <div>
                <div className="spectacle-herald-title">{step.heraldTitle}</div>
                <div className="spectacle-herald-sub">{step.heraldSubtitle}</div>
              </div>
            </div>
          )}

          {/* 2. AUTHENTIC WOODEN TABLETOP & DOMAIN EXPANSION BATTLEFIELD (4 LANES) */}
          <div
            className={`mtg-battlefield-surface wooden-tabletop-surface ${
              step.activeDomain === 'clash_gold_purple'
                ? 'is-domain-clash-active'
                : step.activeDomain
                ? `is-domain-expanded domain-surface-${step.activeDomain}`
                : ''
            }`}
          >
            {/* Physical Wooden Tabletop Base + Domain Expansion Takeover / 50-50 Clash */}
            <div className="tabletop-wood-and-domain-layer" aria-hidden="true">
              <div className="tabletop-wood-base-img" />

              {step.activeDomain === 'clash_gold_purple' ? (
                <div className="tabletop-domain-clash-stage">
                  <div className="tabletop-domain-clash-half top-half domain-purple" />
                  <div className="tabletop-domain-clash-half bottom-half domain-gold" />
                  <div className="tabletop-domain-clash-faultline">
                    <span className="clash-faultline-core" />
                    <span className="clash-faultline-sparks" />
                  </div>
                </div>
              ) : step.activeDomain ? (
                <div className={`tabletop-domain-takeover-img domain-${step.activeDomain}`}>
                  <div className={`tabletop-domain-flow-fx domain-${step.activeDomain}`} />
                </div>
              ) : null}

              <div className="tabletop-center-frontier-seam" />
            </div>

            {/* Active Domain Expansion / Clash Top Ribbon inside Battlefield */}
            {step.domainBannerTitle && (
              <div className="sim-domain-active-ribbon">
                <strong>{step.domainBannerTitle}</strong>
                <span>{step.domainBannerSubtitle}</span>
              </div>
            )}

            {/* 1ª FILEIRA (TOPO): RETAGUARDA DA IA */}
            {renderAuthenticLane(
              'aiRearguard',
              'ai-rearguard-lane',
              'ai-tag',
              '🛡️ Retaguarda IA',
              'ai',
              'rearguard',
              boardState.aiRearguard,
            )}

            {/* 2ª FILEIRA: VANGUARDA DO JOGADOR 1 (INVASÃO) */}
            {renderAuthenticLane(
              'playerVanguard',
              'player-vanguard-in-enemy-field',
              'player-invader-tag',
              '⚔️ Sua Vanguarda (Invasão +1 ATQ)',
              'player',
              'vanguard',
              boardState.playerVanguard,
            )}

            {/* FRONTEIRA CENTRAL */}
            <div className="tabletop-clash-gap" />

            {/* 3ª FILEIRA: VANGUARDA DA IA (INVASÃO) */}
            {renderAuthenticLane(
              'aiVanguard',
              'ai-vanguard-in-player-field',
              'ai-invader-tag',
              '🔥 Vanguarda Inimiga (Invasão)',
              'ai',
              'vanguard',
              boardState.aiVanguard,
            )}

            {/* 4ª FILEIRA (BASE): RETAGUARDA DO JOGADOR 1 (ALCANCE / RELÍQUIAS) */}
            {renderAuthenticLane(
              'playerRearguard',
              'player-lane',
              'player-tag',
              '🏛️ Sua Retaguarda (Alcance / Relíquias)',
              'player',
              'rearguard',
              boardState.playerRearguard,
            )}
          </div>

          {/* 3. BOTTOM-CENTER UNIFIED COMMAND BAR (SOVEREIGN 1 + HAND BUTTON + PHASE) */}
          <footer className="hud-unified-bottom-bar">
            <div className="hud-bottom-strip-inner">
              <div className="hud-p1-segment">
                <div
                  className="hud-mini-avatar player"
                  onClick={() => p1AvatarCard && onInspectCard(p1AvatarCard)}
                  style={{ cursor: 'pointer' }}
                >
                  {p1AvatarCard?.imagePath ? (
                    <img src={p1AvatarCard.imagePath} alt={scenario.p1Name} />
                  ) : (
                    <span>🧙‍♂️</span>
                  )}
                </div>
                <span className="hud-pill-name player">{scenario.p1Name}</span>
                <span className="hud-pill-stat hp">❤️ {boardState.p1Hp}</span>
                <span className="hud-pill-stat mana">
                  ⚡ {boardState.p1Essence}/{boardState.p1MaxEssence}
                </span>
                <span className="hud-pill-stat deck">📚 84 • 🪦 4</span>

                <div className="hud-p1-rituals">
                  <button type="button" className="hud-ritual-chip" onClick={handleEnterArena}>
                    🔥 2⚡
                  </button>
                  <button type="button" className="hud-ritual-chip" onClick={handleEnterArena}>
                    🩸 +1⚡
                  </button>
                  <button
                    type="button"
                    className="hud-ritual-chip ready"
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setSubPhase('impact');
                    }}
                  >
                    ⛩️ 6/6
                  </button>
                </div>

                {subPhase === 'impact' && boardState.p1Feedback && (
                  <div
                    className={`floating-feedback-pill color-${boardState.p1Feedback.color}`}
                    style={{ top: '-28px' }}
                  >
                    {boardState.p1Feedback.text}
                  </div>
                )}
              </div>

              <div className="hud-strip-divider" />

              <button
                type="button"
                className={`hud-hand-trigger-btn ${subPhase === 'hand' ? 'active' : ''}`}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setSubPhase(subPhase === 'hand' ? 'dock' : 'hand');
                }}
              >
                🃏 MÃO ({handCards.length}) {subPhase === 'hand' ? '▼' : '▲'}
              </button>

              <div className="hud-strip-divider" />

              <div className="hud-phase-segment">
                <span className="hud-round-chip hud-turn-timer-chip">
                  <span>T6 • ⚔️ COMBATE</span>
                  <span className="hud-timer-sep">•</span>
                  <span className="hud-timer-val">⏱️ 48s</span>
                </span>

                <button
                  type="button"
                  className="hud-action-cta attack-all"
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setSubPhase('impact');
                  }}
                >
                  ⚔️ ATACAR
                </button>
                <button
                  type="button"
                  className="hud-action-cta primary combat"
                  onClick={handleEnterArena}
                >
                  ⚔️ JOGAR AGORA
                </button>
              </div>
            </div>
          </footer>
        </div>

        {/* =====================================================================
            4. AUTHENTIC PLAYER 1 HAND FAN ('hand') OR SELECTED CARD COMMAND DOCK ('dock')
            ===================================================================== */}
        <div className="mtg-bottom-zone floating-bottom-hud">
          {subPhase === 'dock' && selectedHandCard ? (
            <div
              className={`selected-card-command-dock domain-dock-${selectedHandCard.domain}`}
            >
              <div className="sccd-top-row">
                <div
                  className="sccd-card-chip"
                  onClick={() => onInspectCard(selectedHandCard)}
                >
                  <div className="sccd-thumb-wrap">
                    <span className="sccd-cost">{selectedHandCard.cost}</span>
                    {selectedHandCard.imagePath && (
                      <img
                        src={selectedHandCard.imagePath}
                        alt={selectedHandCard.name}
                        className="sccd-thumb"
                      />
                    )}
                    <span className="sccd-zoom-badge" title="Toque para ampliar a carta">
                      🔍
                    </span>
                  </div>
                  <div className="sccd-meta">
                    <span className="sccd-name">{selectedHandCard.name}</span>
                    <div className="sccd-stats-pills-row">
                      <span
                        className="sccd-stat-pill domain-pill"
                        style={{
                          borderColor: DOMAIN_META[selectedHandCard.domain]?.color,
                          color: DOMAIN_META[selectedHandCard.domain]?.color,
                        }}
                      >
                        {DOMAIN_META[selectedHandCard.domain]?.icon}{' '}
                        {DOMAIN_META[selectedHandCard.domain]?.shortName}
                        {selectedHandCard.affinityReq > 0
                          ? ` • Afin. ${selectedHandCard.affinityReq}`
                          : ''}
                      </span>
                      <span className="sccd-stat-pill type-pill">
                        {CARD_TYPE_LABELS[selectedHandCard.type]}
                        {selectedHandCard.subtype ? ` • ${selectedHandCard.subtype}` : ''}
                      </span>
                      {(selectedHandCard.type === 'creature' ||
                        selectedHandCard.type === 'relic') && (
                        <>
                          {selectedHandCard.type === 'creature' && (
                            <span className="sccd-stat-pill atk-pill">
                              ⚔️ {selectedHandCard.atk} ATQ
                            </span>
                          )}
                          {selectedHandCard.armor > 0 && (
                            <span className="sccd-stat-pill arm-pill">
                              🛡️ {selectedHandCard.armor} ARM
                            </span>
                          )}
                          <span className="sccd-stat-pill hp-pill">
                            ❤️ {selectedHandCard.hp} PV
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
                    onClick={() => onInspectCard(selectedHandCard)}
                  >
                    🔍 Ampliar Carta
                  </button>
                  <button
                    type="button"
                    className="sccd-toggle-btn"
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setSubPhase('hand');
                    }}
                  >
                    🃏 Voltar à Mão ({handCards.length})
                  </button>
                  <button
                    type="button"
                    className="sccd-toggle-btn"
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setSubPhase('impact');
                    }}
                  >
                    💥 Ver Efeito
                  </button>
                </div>
              </div>

              <div className="sccd-readable-card-box">
                {selectedHandCard.keywords.length > 0 && (
                  <div className="sccd-keywords-row">
                    {selectedHandCard.keywords.map((kw) => (
                      <span key={kw} className="sccd-kw-badge">
                        <strong>✦ {kw}:</strong> {KEYWORD_TOOLTIPS[kw]}
                      </span>
                    ))}
                  </div>
                )}
                <p className="sccd-description-text">{selectedHandCard.description}</p>
                {selectedHandCard.ascension && (
                  <div className="sccd-ascension-line">
                    <strong>👑 Ascensão ({selectedHandCard.ascension.cost}⚡):</strong> Evolui
                    para <em>{selectedHandCard.ascension.newName}</em> (
                    {selectedHandCard.ascension.newAtk}⚔️ /{' '}
                    {selectedHandCard.ascension.newArmor}🛡️ /{' '}
                    {selectedHandCard.ascension.newMaxHp}❤️)
                  </div>
                )}
                <div className="sccd-play-status-line is-ready">{step.dockStatusText}</div>
              </div>

              <div className="sccd-actions">
                <button
                  type="button"
                  className={`quick-act-btn ${
                    step.dockActionType === 'vanguard'
                      ? 'act-vanguard'
                      : step.dockActionType === 'rearguard'
                      ? 'act-rearguard'
                      : step.dockActionType === 'domain'
                      ? 'act-channel'
                      : 'act-spell'
                  } sim-dock-chosen-cta`}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setSubPhase('impact');
                  }}
                >
                  👆 {step.dockActionLabel}
                </button>
                <button
                  type="button"
                  className="quick-act-btn act-channel"
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setSubPhase('impact');
                  }}
                >
                  Canalizar (+1 Afin. & Compra) [C]
                </button>
              </div>
            </div>
          ) : (
            <div
              className={`mtg-hand-drawer ${
                subPhase === 'hand' ? 'is-expanded' : 'is-collapsed'
              }`}
            >
              <div className="hand-drawer-handle-bar">
                <button
                  type="button"
                  className="hand-drawer-toggle-btn is-pinned"
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setSubPhase(subPhase === 'hand' ? 'dock' : 'hand');
                  }}
                >
                  🃏 MÃO DO JOGADOR 1 ({handCards.length}) • 👆 ESCOLHENDO:{' '}
                  {selectedHandCard?.name.toUpperCase()}
                </button>
              </div>

              <div className="mtg-hand-fan">
                {handCards.map((card, idx) => {
                  const isSelected = idx === step.selectedHandIndex;
                  const total = handCards.length;
                  const mid = (total - 1) / 2;
                  const offsetIdx = idx - mid;
                  const rotDeg = isSelected ? 0 : offsetIdx * 2.4;
                  const liftY = isSelected ? -26 : Math.abs(offsetIdx) * 3;

                  return (
                    <div
                      key={`${card.id}-sim-hand-${idx}`}
                      className={`mtg-hand-card-slot ${isSelected ? 'is-selected-slot' : ''}`}
                      style={{
                        transform: `translateY(${liftY}px) rotate(${rotDeg}deg)`,
                        zIndex: isSelected ? 65 : idx + 10,
                        marginLeft: idx === 0 ? '0px' : '-26px',
                      }}
                    >
                      {isSelected && (
                        <div className="sim-hand-selected-pointer">
                          👆 CARTA ESCOLHIDA
                        </div>
                      )}
                      <CardView
                        card={card}
                        mode="hand"
                        isPlayable={true}
                        isSelected={isSelected}
                        onInspect={onInspectCard}
                        onClick={() => {
                          setIsAutoPlaying(false);
                          setSubPhase('dock');
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
