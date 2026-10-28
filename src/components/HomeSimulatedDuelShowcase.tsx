import React, { useEffect, useState } from 'react';
import { ALL_CARDS, CARDS_BY_ID } from '../data/cards';
import { BoardUnit, CardDefinition, Domain, FloatingFeedback, Keyword, RowType } from '../types/game';
import { setMusicState, startAdaptiveMusic } from '../utils/musicEngine';
import { getSharedAudioContext, onAudioUnlocked, playSfx, SfxType } from '../utils/soundEngine';
import {
  CARD_TYPE_LABELS,
  CardView,
  DOMAIN_META,
  KEYWORD_TOOLTIPS,
} from './CardView';

export type SimSubPhase = 'hand' | 'dock' | 'impact';

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
  isNewlySummoned?: boolean;
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
  // Player 1's hand before playing the card (5 real cards in fan)
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

// 100% REAL VERIFIED CARD IDS FROM src/data/cards.ts & src/data/combosCompendium.ts
const SIM_DUEL_SCENARIOS: SimDuelScenario[] = [
  {
    id: 'crimson_forge_domain',
    shortTab: '🔥 Forja Carmesim',
    badge: 'COMBO #2 • EXPANSÃO DE DOMÍNIO & ASCENSÃO DRACÔNICA',
    title: 'Caldeira do Fogo Primordial',
    subtitle: 'Campeão Dracônico + Bigorna do Rei da Fornalha + Vulcanis, Soberano Carmesim',
    comboRef: 'Grimório: Fúria de Pyros • Combo Oficial #2',
    accentColor: '#ef4444',
    p1Name: 'Ignis Rex (Você)',
    p1AvatarCardId: 'red_157_dragao_tiamat_carmesim',
    p1Domain: 'red',
    p2Name: 'Vesperion, Arquilich',
    p2AvatarCardId: 'purple_07_lich',
    p2Domain: 'purple',
    steps: [
      {
        id: 'red-step-1',
        stepBadge: 'PASSO 1/4 • RELÍQUIA DE FORJA',
        title: 'Posicionar Bigorna do Rei da Fornalha na Retaguarda',
        narrative:
          'O Jogador 1 examina as 5 cartas da sua mão, escolhe a Relíquia Bigorna do Rei da Fornalha e a posiciona na Retaguarda [R], concedendo +1/+1 ao Campeão Dracônico na Vanguarda!',
        sfx: 'summon_heavy',
        musicTrack: 'ambient_battle',
        handCardIds: [
          'red_01_kobold',
          'red_36_bigorna_fogo',
          'red_123_cataclismo_solar',
          'red_157_dragao_tiamat_carmesim',
          'red_18_marechal_rubro',
        ],
        selectedHandIndex: 1,
        dockActionLabel: '+ Posicionar Relíquia [R]',
        dockActionType: 'rearguard',
        dockStatusText:
          '✅ Casa 3 da Retaguarda selecionada: Posicionando Bigorna do Rei da Fornalha (+1/+1 contínuo)!',
        targetLane: 'playerRearguard',
        targetSlotIndex: 2,
        targetWatermark: '+ Relíquia [R]',
        heraldTitle: '🏛️ RELÍQUIA: BIGORNA DO REI DA FORNALHA',
        heraldSubtitle: 'Relíquia posicionada na Retaguarda: Campeão Dracônico recebe +1/+1 (4/5 ⚔️)!',
        heraldDomain: 'red',
        beforeBoard: {
          aiRearguard: [
            { slotIndex: 3, cardId: 'purple_126_campanario_mortos', atk: 0, hp: 5, maxHp: 5, armor: 1 },
          ],
          playerVanguard: [
            { slotIndex: 1, cardId: 'red_04_meio_dragao', atk: 3, hp: 4, maxHp: 4, armor: 1, stance: 'attack' },
            { slotIndex: 2, cardId: 'red_03_mastim_infernal', atk: 3, hp: 4, maxHp: 4, stance: 'defend' },
          ],
          aiVanguard: [
            { slotIndex: 1, cardId: 'purple_25_dama_seis_laminas', atk: 4, hp: 3, maxHp: 3, stance: 'attack' },
            { slotIndex: 3, cardId: 'purple_07_lich', atk: 5, hp: 5, maxHp: 5, armor: 1, stance: 'defend' },
          ],
          playerRearguard: [
            { slotIndex: 1, cardId: 'red_10_altar_draconico', atk: 0, hp: 4, maxHp: 4, armor: 1 },
          ],
          p1Hp: 26,
          p1Essence: 6,
          p1MaxEssence: 6,
          p2Hp: 24,
          p2Essence: 5,
          p2MaxEssence: 6,
        },
        afterBoard: {
          aiRearguard: [
            { slotIndex: 3, cardId: 'purple_126_campanario_mortos', atk: 0, hp: 5, maxHp: 5, armor: 1 },
          ],
          playerVanguard: [
            {
              slotIndex: 1,
              cardId: 'red_04_meio_dragao',
              atk: 4,
              hp: 5,
              maxHp: 5,
              armor: 1,
              stance: 'attack',
              isBurstTarget: true,
              feedback: { text: '+1/+1 Bigorna!', color: 'buff' },
            },
            { slotIndex: 2, cardId: 'red_03_mastim_infernal', atk: 3, hp: 4, maxHp: 4, stance: 'defend' },
          ],
          aiVanguard: [
            { slotIndex: 1, cardId: 'purple_25_dama_seis_laminas', atk: 4, hp: 3, maxHp: 3, stance: 'attack' },
            { slotIndex: 3, cardId: 'purple_07_lich', atk: 5, hp: 5, maxHp: 5, armor: 1, stance: 'defend' },
          ],
          playerRearguard: [
            { slotIndex: 1, cardId: 'red_10_altar_draconico', atk: 0, hp: 4, maxHp: 4, armor: 1 },
            {
              slotIndex: 2,
              cardId: 'red_36_bigorna_fogo',
              atk: 0,
              hp: 5,
              maxHp: 5,
              armor: 1,
              isNewlySummoned: true,
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
        stepBadge: 'PASSO 2/4 • EXPANSÃO DE DOMÍNIO + CATACLISMO',
        title: 'Expansão: Caldeira do Fogo Primordial & Detonação Solar',
        narrative:
          'Com 6/6 de Afinidade Carmesim, o Jogador 1 expande o Domínio Caldeira do Fogo Primordial e lança Detonação do Sol Carmesim da mão, varrendo a Vanguarda inimiga com chamas vulcânicas!',
        sfx: 'domain_expand',
        musicTrack: 'domain_red',
        activeDomain: 'red',
        domainBannerTitle: '⛩️ CALDEIRA DO FOGO PRIMORDIAL (3 TURNOS)',
        domainBannerSubtitle: 'Bônus de Domínio: Aliados +1/+1 e Ímpeto • Acerto Garantido direto no Soberano!',
        handCardIds: [
          'red_01_kobold',
          'red_123_cataclismo_solar',
          'red_157_dragao_tiamat_carmesim',
          'red_18_marechal_rubro',
          'red_146_coroa_chama_eterna',
        ],
        selectedHandIndex: 1,
        dockActionLabel: '🔥 Lançar Agora + Expandir Domínio',
        dockActionType: 'spell',
        dockStatusText:
          '⛩️ Domínio Carmesim 6/6 Pronto: Lançando Detonação do Sol Carmesim em toda a Vanguarda inimiga!',
        targetLane: 'aiVanguard',
        targetSlotIndex: 3,
        heraldTitle: '⛩️ EXPANSÃO: CALDEIRA DO FOGO PRIMORDIAL',
        heraldSubtitle: 'O tabuleiro se transforma em magma vivo! Detonação Solar incinera a Vanguarda rival!',
        heraldDomain: 'red',
        breathWaveLane: 'aiVanguard',
        breathWaveDomain: 'red',
        beforeBoard: {
          aiRearguard: [
            { slotIndex: 3, cardId: 'purple_126_campanario_mortos', atk: 0, hp: 5, maxHp: 5, armor: 1 },
          ],
          playerVanguard: [
            { slotIndex: 1, cardId: 'red_04_meio_dragao', atk: 4, hp: 5, maxHp: 5, armor: 1, stance: 'attack' },
            { slotIndex: 2, cardId: 'red_03_mastim_infernal', atk: 3, hp: 4, maxHp: 4, stance: 'defend' },
          ],
          aiVanguard: [
            { slotIndex: 1, cardId: 'purple_25_dama_seis_laminas', atk: 4, hp: 3, maxHp: 3, stance: 'attack' },
            { slotIndex: 3, cardId: 'purple_07_lich', atk: 5, hp: 5, maxHp: 5, armor: 1, stance: 'defend' },
          ],
          playerRearguard: [
            { slotIndex: 1, cardId: 'red_10_altar_draconico', atk: 0, hp: 4, maxHp: 4, armor: 1 },
            { slotIndex: 2, cardId: 'red_36_bigorna_fogo', atk: 0, hp: 5, maxHp: 5, armor: 1 },
          ],
          p1Hp: 26,
          p1Essence: 6,
          p1MaxEssence: 6,
          p2Hp: 24,
          p2Essence: 5,
          p2MaxEssence: 6,
        },
        afterBoard: {
          aiRearguard: [
            { slotIndex: 3, cardId: 'purple_126_campanario_mortos', atk: 0, hp: 5, maxHp: 5, armor: 1 },
          ],
          playerVanguard: [
            {
              slotIndex: 1,
              cardId: 'red_04_meio_dragao',
              atk: 6,
              hp: 5,
              maxHp: 5,
              armor: 1,
              stance: 'attack',
              feedback: { text: '+2 ATQ Domínio!', color: 'buff' },
            },
            {
              slotIndex: 2,
              cardId: 'red_03_mastim_infernal',
              atk: 5,
              hp: 4,
              maxHp: 4,
              stance: 'defend',
              feedback: { text: '+2 ATQ Domínio!', color: 'buff' },
            },
          ],
          aiVanguard: [
            {
              slotIndex: 3,
              cardId: 'purple_07_lich',
              atk: 5,
              hp: 2,
              maxHp: 5,
              armor: 0,
              stance: 'defend',
              isHitTarget: true,
              feedback: { text: '-4 🔥 Cataclismo!', color: 'damage' },
            },
          ],
          playerRearguard: [
            { slotIndex: 1, cardId: 'red_10_altar_draconico', atk: 0, hp: 4, maxHp: 4, armor: 1 },
            { slotIndex: 2, cardId: 'red_36_bigorna_fogo', atk: 0, hp: 5, maxHp: 5, armor: 1 },
          ],
          p1Hp: 26,
          p1Essence: 1,
          p1MaxEssence: 6,
          p2Hp: 20,
          p2Essence: 5,
          p2MaxEssence: 6,
          p2Feedback: { text: '-4 🔥 Sol Carmesim', color: 'damage' },
        },
      },
      {
        id: 'red-step-3',
        stepBadge: 'PASSO 3/4 • INVOCAÇÃO LENDÁRIA',
        title: 'Invocar Vulcanis, Soberano Carmesim',
        narrative:
          'O Jogador 1 seleciona o Dragão Lendário na mão e o invoca na Casa 4 da Vanguarda [V]. Ao Entrar, seu Sopro Dracônico incinera as fileiras inimigas!',
        sfx: 'dragon_breath',
        musicTrack: 'domain_red',
        activeDomain: 'red',
        domainBannerTitle: '⛩️ CALDEIRA DO FOGO PRIMORDIAL (2 TURNOS)',
        domainBannerSubtitle: 'Bônus de Domínio: Aliados +1/+1 e Ímpeto • Acerto Garantido direto no Soberano!',
        handCardIds: [
          'red_01_kobold',
          'red_157_dragao_tiamat_carmesim',
          'red_18_marechal_rubro',
          'red_146_coroa_chama_eterna',
          'red_02_magmin',
        ],
        selectedHandIndex: 1,
        dockActionLabel: '+ Vanguarda [V]',
        dockActionType: 'vanguard',
        dockStatusText: '🐉 Invocação Lendária: Posicionando Dragão Soberano Carmesim na Casa 4 da Vanguarda!',
        targetLane: 'playerVanguard',
        targetSlotIndex: 3,
        targetWatermark: '+ Vanguarda [V]',
        heraldTitle: '🐉 LENDÁRIA: SOBERANO DRACÔNICO CARMESIM',
        heraldSubtitle: 'Sopro Dracônico devasta as fileiras inimigas em 3 de dano de fogo!',
        heraldDomain: 'red',
        breathWaveLane: 'aiRearguard',
        breathWaveDomain: 'red',
        beforeBoard: {
          aiRearguard: [
            { slotIndex: 3, cardId: 'purple_126_campanario_mortos', atk: 0, hp: 5, maxHp: 5, armor: 1 },
          ],
          playerVanguard: [
            { slotIndex: 1, cardId: 'red_04_meio_dragao', atk: 6, hp: 5, maxHp: 5, armor: 1, stance: 'attack' },
            { slotIndex: 2, cardId: 'red_03_mastim_infernal', atk: 5, hp: 4, maxHp: 4, stance: 'defend' },
          ],
          aiVanguard: [
            { slotIndex: 3, cardId: 'purple_07_lich', atk: 5, hp: 2, maxHp: 5, armor: 0, stance: 'defend' },
          ],
          playerRearguard: [
            { slotIndex: 1, cardId: 'red_10_altar_draconico', atk: 0, hp: 4, maxHp: 4, armor: 1 },
            { slotIndex: 2, cardId: 'red_36_bigorna_fogo', atk: 0, hp: 5, maxHp: 5, armor: 1 },
          ],
          p1Hp: 26,
          p1Essence: 8,
          p1MaxEssence: 8,
          p2Hp: 20,
          p2Essence: 6,
          p2MaxEssence: 8,
        },
        afterBoard: {
          aiRearguard: [
            {
              slotIndex: 3,
              cardId: 'purple_126_campanario_mortos',
              atk: 0,
              hp: 2,
              maxHp: 5,
              armor: 0,
              isHitTarget: true,
              feedback: { text: '-3 🔥 Sopro!', color: 'damage' },
            },
          ],
          playerVanguard: [
            { slotIndex: 1, cardId: 'red_04_meio_dragao', atk: 6, hp: 5, maxHp: 5, armor: 1, stance: 'attack' },
            { slotIndex: 2, cardId: 'red_03_mastim_infernal', atk: 5, hp: 4, maxHp: 4, stance: 'defend' },
            {
              slotIndex: 3,
              cardId: 'red_157_dragao_tiamat_carmesim',
              atk: 10,
              hp: 9,
              maxHp: 9,
              armor: 2,
              stance: 'attack',
              isNewlySummoned: true,
              isBurstTarget: true,
              feedback: { text: '🐉 Sopro 3 🔥!', color: 'buff' },
            },
          ],
          aiVanguard: [],
          playerRearguard: [
            { slotIndex: 1, cardId: 'red_10_altar_draconico', atk: 0, hp: 4, maxHp: 4, armor: 1 },
            { slotIndex: 2, cardId: 'red_36_bigorna_fogo', atk: 0, hp: 5, maxHp: 5, armor: 1 },
          ],
          p1Hp: 26,
          p1Essence: 0,
          p1MaxEssence: 8,
          p2Hp: 14,
          p2Essence: 6,
          p2MaxEssence: 8,
          p2Feedback: { text: '-6 🔥 Sopro Real', color: 'damage' },
        },
      },
      {
        id: 'red-step-4',
        stepBadge: 'PASSO 4/4 • ASCENSÃO & GOLPE LETAL',
        title: 'Ascensão do Campeão Dracônico & Ataque Final',
        narrative:
          'O Jogador 1 seleciona o Campeão Dracônico em campo, aciona 👑 Ascender (4⚡) para evoluí-lo em Soberano Meio-Dragão Ascendido (preservando os bônus da Bigorna para 9/8!) e ataca com toda a Vanguarda para vencer!',
        sfx: 'ascend',
        musicTrack: 'domain_red',
        activeDomain: 'red',
        domainBannerTitle: '⛩️ CALDEIRA DO FOGO PRIMORDIAL (VITÓRIA IMINENTE)',
        domainBannerSubtitle: 'Ascensão preservou todos os bônus acumulados da Bigorna (+2/+1)!',
        handCardIds: [
          'red_04_meio_dragao',
          'red_18_marechal_rubro',
          'red_146_coroa_chama_eterna',
          'red_02_magmin',
        ],
        selectedHandIndex: 0,
        dockActionLabel: '👑 Ascender (4⚡) + Atacar Soberano',
        dockActionType: 'ascend',
        dockStatusText:
          '👑 Evoluindo Campeão Dracônico → Soberano Meio-Dragão Ascendido (9⚔️ / 8❤️, Voo, Atropelar)!',
        targetLane: 'playerVanguard',
        targetSlotIndex: 1,
        heraldTitle: '👑 ASCENSÃO: SOBERANO MEIO-DRAGÃO + ATAQUE TOTAL!',
        heraldSubtitle: 'Soberano Meio-Dragão (9⚔️) + Dragão Carmesim (10⚔️) zeram a Vida do rival!',
        heraldDomain: 'gold',
        beforeBoard: {
          aiRearguard: [
            { slotIndex: 3, cardId: 'purple_126_campanario_mortos', atk: 0, hp: 2, maxHp: 5, armor: 0 },
          ],
          playerVanguard: [
            { slotIndex: 1, cardId: 'red_04_meio_dragao', atk: 6, hp: 5, maxHp: 5, armor: 1, stance: 'attack' },
            { slotIndex: 2, cardId: 'red_03_mastim_infernal', atk: 5, hp: 4, maxHp: 4, stance: 'attack' },
            {
              slotIndex: 3,
              cardId: 'red_157_dragao_tiamat_carmesim',
              atk: 10,
              hp: 9,
              maxHp: 9,
              armor: 2,
              stance: 'attack',
            },
          ],
          aiVanguard: [],
          playerRearguard: [
            { slotIndex: 1, cardId: 'red_10_altar_draconico', atk: 0, hp: 4, maxHp: 4, armor: 1 },
            { slotIndex: 2, cardId: 'red_36_bigorna_fogo', atk: 0, hp: 5, maxHp: 5, armor: 1 },
          ],
          p1Hp: 26,
          p1Essence: 8,
          p1MaxEssence: 8,
          p2Hp: 14,
          p2Essence: 6,
          p2MaxEssence: 8,
        },
        afterBoard: {
          aiRearguard: [],
          playerVanguard: [
            {
              slotIndex: 1,
              cardId: 'red_04_meio_dragao',
              atk: 9,
              hp: 8,
              maxHp: 8,
              armor: 2,
              isAscended: true,
              stance: 'attack',
              isLunging: true,
              isBurstTarget: true,
              burstKind: 'ascend',
              feedback: { text: '👑 Ascendido 9/8!', color: 'buff' },
            },
            {
              slotIndex: 2,
              cardId: 'red_03_mastim_infernal',
              atk: 5,
              hp: 4,
              maxHp: 4,
              stance: 'attack',
              isLunging: true,
            },
            {
              slotIndex: 3,
              cardId: 'red_157_dragao_tiamat_carmesim',
              atk: 10,
              hp: 9,
              maxHp: 9,
              armor: 2,
              stance: 'attack',
              isLunging: true,
              feedback: { text: '⚔️ -10 Letal!', color: 'damage' },
            },
          ],
          aiVanguard: [],
          playerRearguard: [
            { slotIndex: 1, cardId: 'red_10_altar_draconico', atk: 0, hp: 4, maxHp: 4, armor: 1 },
            { slotIndex: 2, cardId: 'red_36_bigorna_fogo', atk: 0, hp: 5, maxHp: 5, armor: 1 },
          ],
          p1Hp: 26,
          p1Essence: 4,
          p1MaxEssence: 8,
          p2Hp: 0,
          p2Essence: 6,
          p2MaxEssence: 8,
          p2Feedback: { text: '💥 -19 VITÓRIA!', color: 'damage' },
        },
      },
    ],
  },
  {
    id: 'eternal_frost_domain',
    shortTab: '❄️ Gelo Eterno',
    badge: 'COMBO #6 • CONGELAMENTO TOTAL & OLHO DO MAELSTROM',
    title: 'Olho do Maelstrom Astral',
    subtitle: 'Trono do Inverno Eterno + Ruptura do Relógio Astral + Dragão de Safira Sônico',
    comboRef: 'Grimório: Conclave da Geada • Combo Oficial #6',
    accentColor: '#38bdf8',
    p1Name: 'Hydrissa (Você)',
    p1AvatarCardId: 'blue_154_dragao_safira_soberano',
    p1Domain: 'blue',
    p2Name: 'Vulcanis, Senhor Rubro',
    p2AvatarCardId: 'red_157_dragao_tiamat_carmesim',
    p2Domain: 'red',
    steps: [
      {
        id: 'blu-step-1',
        stepBadge: 'PASSO 1/4 • FEITIÇO DE ESTASE',
        title: 'Lançar Ruptura do Relógio Astral na Vanguarda Inimiga',
        narrative:
          'O Jogador 1 escolhe Ruptura do Relógio Astral na mão e a lança sobre a Vanguarda agressiva inimiga, aplicando ❄️ Congelado a todas as unidades rivais e comprando 1 carta!',
        sfx: 'freeze',
        musicTrack: 'ambient_battle',
        handCardIds: [
          'blue_141_ruptura_temporal',
          'blue_146_trono_inverno_eterno',
          'blue_154_dragao_safira_soberano',
          'blue_161_singularidade_temporal',
          'blue_37_mago_aprendiz',
        ],
        selectedHandIndex: 0,
        dockActionLabel: '❄️ Lançar Agora',
        dockActionType: 'spell',
        dockStatusText: '❄️ Alvo em Área: Congelando toda a Vanguarda inimiga e comprando 1 carta!',
        targetLane: 'aiVanguard',
        targetSlotIndex: 2,
        heraldTitle: '❄️ FEITIÇO: RUPTURA DO RELÓGIO ASTRAL',
        heraldSubtitle: 'Toda a Vanguarda inimiga foi Congelada e perde sua próxima ação de ataque!',
        heraldDomain: 'blue',
        breathWaveLane: 'aiVanguard',
        breathWaveDomain: 'blue',
        beforeBoard: {
          aiRearguard: [{ slotIndex: 4, cardId: 'red_01_kobold', atk: 2, hp: 2, maxHp: 2 }],
          playerVanguard: [
            { slotIndex: 2, cardId: 'blue_152_arquimago_vortice', atk: 3, hp: 5, maxHp: 5, armor: 1, stance: 'defend' },
          ],
          aiVanguard: [
            { slotIndex: 1, cardId: 'red_02_magmin', atk: 2, hp: 1, maxHp: 1, stance: 'attack' },
            { slotIndex: 2, cardId: 'red_04_meio_dragao', atk: 4, hp: 4, maxHp: 4, armor: 1, stance: 'attack' },
            { slotIndex: 4, cardId: 'red_18_marechal_rubro', atk: 4, hp: 3, maxHp: 3, stance: 'attack' },
          ],
          playerRearguard: [{ slotIndex: 1, cardId: 'blue_37_mago_aprendiz', atk: 2, hp: 3, maxHp: 3 }],
          p1Hp: 24,
          p1Essence: 6,
          p1MaxEssence: 6,
          p2Hp: 25,
          p2Essence: 4,
          p2MaxEssence: 6,
        },
        afterBoard: {
          aiRearguard: [{ slotIndex: 4, cardId: 'red_01_kobold', atk: 2, hp: 2, maxHp: 2 }],
          playerVanguard: [
            { slotIndex: 2, cardId: 'blue_152_arquimago_vortice', atk: 3, hp: 5, maxHp: 5, armor: 1, stance: 'defend' },
          ],
          aiVanguard: [
            {
              slotIndex: 1,
              cardId: 'red_02_magmin',
              atk: 2,
              hp: 1,
              maxHp: 1,
              isFrozen: true,
              isHitTarget: true,
              feedback: { text: '❄️ Congelado!', color: 'freeze' },
            },
            {
              slotIndex: 2,
              cardId: 'red_04_meio_dragao',
              atk: 4,
              hp: 4,
              maxHp: 4,
              armor: 1,
              isFrozen: true,
              isHitTarget: true,
              feedback: { text: '❄️ Congelado!', color: 'freeze' },
            },
            {
              slotIndex: 4,
              cardId: 'red_18_marechal_rubro',
              atk: 4,
              hp: 3,
              maxHp: 3,
              isFrozen: true,
              isHitTarget: true,
              feedback: { text: '❄️ Congelado!', color: 'freeze' },
            },
          ],
          playerRearguard: [{ slotIndex: 1, cardId: 'blue_37_mago_aprendiz', atk: 2, hp: 3, maxHp: 3 }],
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
        stepBadge: 'PASSO 2/4 • RELÍQUIA GLACIAL',
        title: 'Posicionar Trono do Inverno Eterno na Retaguarda',
        narrative:
          'O Jogador 1 seleciona a Relíquia Trono do Inverno Eterno na mão e a posiciona na Retaguarda [R], mantendo a Vanguarda inimiga congelada e gerando vantagem de cartas todo turno.',
        sfx: 'shield_up',
        musicTrack: 'ambient_battle',
        handCardIds: [
          'blue_146_trono_inverno_eterno',
          'blue_154_dragao_safira_soberano',
          'blue_161_singularidade_temporal',
          'blue_37_mago_aprendiz',
        ],
        selectedHandIndex: 0,
        dockActionLabel: '+ Posicionar Relíquia [R]',
        dockActionType: 'rearguard',
        dockStatusText: '🏛️ Posicionando Trono do Inverno Eterno na Casa 4 da Retaguarda!',
        targetLane: 'playerRearguard',
        targetSlotIndex: 3,
        targetWatermark: '+ Relíquia [R]',
        heraldTitle: '🏛️ RELÍQUIA: TRONO DO INVERNO ETERNO',
        heraldSubtitle: 'Aura de Permafrost ativada na Retaguarda: Congela ameaças e compra cartas extras!',
        heraldDomain: 'blue',
        beforeBoard: {
          aiRearguard: [{ slotIndex: 4, cardId: 'red_01_kobold', atk: 2, hp: 2, maxHp: 2 }],
          playerVanguard: [
            { slotIndex: 2, cardId: 'blue_152_arquimago_vortice', atk: 3, hp: 5, maxHp: 5, armor: 1, stance: 'defend' },
          ],
          aiVanguard: [
            { slotIndex: 1, cardId: 'red_02_magmin', atk: 2, hp: 1, maxHp: 1, isFrozen: true },
            { slotIndex: 2, cardId: 'red_04_meio_dragao', atk: 4, hp: 4, maxHp: 4, armor: 1, isFrozen: true },
            { slotIndex: 4, cardId: 'red_18_marechal_rubro', atk: 4, hp: 3, maxHp: 3, isFrozen: true },
          ],
          playerRearguard: [{ slotIndex: 1, cardId: 'blue_37_mago_aprendiz', atk: 2, hp: 3, maxHp: 3 }],
          p1Hp: 24,
          p1Essence: 4,
          p1MaxEssence: 6,
          p2Hp: 25,
          p2Essence: 4,
          p2MaxEssence: 6,
        },
        afterBoard: {
          aiRearguard: [{ slotIndex: 4, cardId: 'red_01_kobold', atk: 2, hp: 2, maxHp: 2 }],
          playerVanguard: [
            { slotIndex: 2, cardId: 'blue_152_arquimago_vortice', atk: 3, hp: 5, maxHp: 5, armor: 1, stance: 'defend' },
          ],
          aiVanguard: [
            { slotIndex: 1, cardId: 'red_02_magmin', atk: 2, hp: 1, maxHp: 1, isFrozen: true },
            { slotIndex: 2, cardId: 'red_04_meio_dragao', atk: 4, hp: 4, maxHp: 4, armor: 1, isFrozen: true },
            { slotIndex: 4, cardId: 'red_18_marechal_rubro', atk: 4, hp: 3, maxHp: 3, isFrozen: true },
          ],
          playerRearguard: [
            { slotIndex: 1, cardId: 'blue_37_mago_aprendiz', atk: 2, hp: 3, maxHp: 3 },
            {
              slotIndex: 3,
              cardId: 'blue_146_trono_inverno_eterno',
              atk: 0,
              hp: 6,
              maxHp: 6,
              armor: 1,
              isNewlySummoned: true,
              isBurstTarget: true,
              feedback: { text: '❄️ Permafrost Ativo!', color: 'shield' },
            },
          ],
          p1Hp: 24,
          p1Essence: 0,
          p1MaxEssence: 6,
          p2Hp: 25,
          p2Essence: 4,
          p2MaxEssence: 6,
        },
      },
      {
        id: 'blu-step-3',
        stepBadge: 'PASSO 3/4 • EXPANSÃO DE DOMÍNIO',
        title: 'Expansão: Olho do Maelstrom Astral + Dragão de Safira',
        narrative:
          'Com 6/6 de Afinidade da Tempestade, o Jogador 1 expande o Olho do Maelstrom Astral e invoca o Dragão de Safira Sônico na Vanguarda, varrendo a linha inimiga com Sopro Glacial!',
        sfx: 'domain_expand',
        musicTrack: 'domain_blue',
        activeDomain: 'blue',
        domainBannerTitle: '⛩️ OLHO DO MAELSTROM ASTRAL (3 TURNOS)',
        domainBannerSubtitle: 'Bônus de Domínio: Aliados +1/+1 e Ímpeto • Acerto Garantido direto no Soberano!',
        handCardIds: [
          'blue_154_dragao_safira_soberano',
          'blue_161_singularidade_temporal',
          'blue_136_leviata_cronos',
          'blue_09_onda_repulsora',
        ],
        selectedHandIndex: 0,
        dockActionLabel: '+ Vanguarda [V] + Expandir Domínio',
        dockActionType: 'vanguard',
        dockStatusText: '🐉 Invocando Dragão de Safira Sônico na Casa 4 da Vanguarda sob o Maelstrom Astral!',
        targetLane: 'playerVanguard',
        targetSlotIndex: 3,
        targetWatermark: '+ Vanguarda [V]',
        heraldTitle: '⛩️ OLHO DO MAELSTROM + DRAGÃO DE SAFIRA!',
        heraldSubtitle: 'Sopro Sônico causa dano em área e mantém o exército inimigo congelado!',
        heraldDomain: 'blue',
        breathWaveLane: 'aiVanguard',
        breathWaveDomain: 'blue',
        beforeBoard: {
          aiRearguard: [{ slotIndex: 4, cardId: 'red_01_kobold', atk: 2, hp: 2, maxHp: 2 }],
          playerVanguard: [
            { slotIndex: 2, cardId: 'blue_152_arquimago_vortice', atk: 3, hp: 5, maxHp: 5, armor: 1, stance: 'defend' },
          ],
          aiVanguard: [
            { slotIndex: 1, cardId: 'red_02_magmin', atk: 2, hp: 1, maxHp: 1, isFrozen: true },
            { slotIndex: 2, cardId: 'red_04_meio_dragao', atk: 4, hp: 4, maxHp: 4, armor: 1, isFrozen: true },
            { slotIndex: 4, cardId: 'red_18_marechal_rubro', atk: 4, hp: 3, maxHp: 3, isFrozen: true },
          ],
          playerRearguard: [
            { slotIndex: 1, cardId: 'blue_37_mago_aprendiz', atk: 2, hp: 3, maxHp: 3 },
            { slotIndex: 3, cardId: 'blue_146_trono_inverno_eterno', atk: 0, hp: 6, maxHp: 6, armor: 1 },
          ],
          p1Hp: 24,
          p1Essence: 7,
          p1MaxEssence: 7,
          p2Hp: 25,
          p2Essence: 5,
          p2MaxEssence: 7,
        },
        afterBoard: {
          aiRearguard: [{ slotIndex: 4, cardId: 'red_01_kobold', atk: 2, hp: 2, maxHp: 2, isFrozen: true }],
          playerVanguard: [
            { slotIndex: 2, cardId: 'blue_152_arquimago_vortice', atk: 4, hp: 5, maxHp: 5, armor: 1, stance: 'defend' },
            {
              slotIndex: 3,
              cardId: 'blue_154_dragao_safira_soberano',
              atk: 8,
              hp: 8,
              maxHp: 8,
              armor: 2,
              stance: 'attack',
              isNewlySummoned: true,
              isBurstTarget: true,
              feedback: { text: '❄️ Sopro Sônico!', color: 'freeze' },
            },
          ],
          aiVanguard: [
            {
              slotIndex: 2,
              cardId: 'red_04_meio_dragao',
              atk: 4,
              hp: 2,
              maxHp: 4,
              armor: 0,
              isFrozen: true,
              isHitTarget: true,
              feedback: { text: '-2 ❄️ Sopro!', color: 'damage' },
            },
            {
              slotIndex: 4,
              cardId: 'red_18_marechal_rubro',
              atk: 4,
              hp: 1,
              maxHp: 3,
              isFrozen: true,
              isHitTarget: true,
              feedback: { text: '-2 ❄️ Sopro!', color: 'damage' },
            },
          ],
          playerRearguard: [
            { slotIndex: 1, cardId: 'blue_37_mago_aprendiz', atk: 3, hp: 3, maxHp: 3 },
            { slotIndex: 3, cardId: 'blue_146_trono_inverno_eterno', atk: 0, hp: 6, maxHp: 6, armor: 1 },
          ],
          p1Hp: 24,
          p1Essence: 0,
          p1MaxEssence: 7,
          p2Hp: 19,
          p2Essence: 5,
          p2MaxEssence: 7,
          p2Feedback: { text: '-6 ❄️ Tempestade', color: 'damage' },
        },
      },
      {
        id: 'blu-step-4',
        stepBadge: 'PASSO 4/4 • SINGULARIDADE & VOO LETAL',
        title: 'Pilares da Geada Eterna Estilhaçam o Tabuleiro Rival',
        narrative:
          'No turno seguinte, o Jogador 1 lança Pilares da Geada Eterna da mão para estilhaçar as unidades congeladas e voa livremente com o Dragão de Safira Sônico contra o Soberano rival!',
        sfx: 'spell_arcane',
        musicTrack: 'domain_blue',
        activeDomain: 'blue',
        domainBannerTitle: '⛩️ OLHO DO MAELSTROM ASTRAL (DOMÍNIO TOTAL)',
        domainBannerSubtitle: 'Tabuleiro inimigo estilhaçado — ataque aéreo direto com Voo!',
        handCardIds: [
          'blue_161_singularidade_temporal',
          'blue_136_leviata_cronos',
          'blue_09_onda_repulsora',
          'blue_28_orbe_tempestade',
        ],
        selectedHandIndex: 0,
        dockActionLabel: '⚡ Lançar Pilares da Geada',
        dockActionType: 'spell',
        dockStatusText: '💥 Estilhaçando todas as unidades inimigas congeladas e atacando pelo ar!',
        targetLane: 'aiVanguard',
        targetSlotIndex: 2,
        heraldTitle: '❄️ PILARES DA GEADA + VOO DO DRAGÃO DE SAFIRA!',
        heraldSubtitle: 'Unidades congeladas são estilhaçadas! Dragão de Safira e Hydrissa finalizam o duelo!',
        heraldDomain: 'blue',
        breathWaveLane: 'aiVanguard',
        breathWaveDomain: 'blue',
        beforeBoard: {
          aiRearguard: [{ slotIndex: 4, cardId: 'red_01_kobold', atk: 2, hp: 2, maxHp: 2, isFrozen: true }],
          playerVanguard: [
            { slotIndex: 2, cardId: 'blue_152_arquimago_vortice', atk: 4, hp: 5, maxHp: 5, armor: 1, stance: 'attack' },
            {
              slotIndex: 3,
              cardId: 'blue_154_dragao_safira_soberano',
              atk: 8,
              hp: 8,
              maxHp: 8,
              armor: 2,
              stance: 'attack',
            },
          ],
          aiVanguard: [
            { slotIndex: 2, cardId: 'red_04_meio_dragao', atk: 4, hp: 2, maxHp: 4, isFrozen: true },
            { slotIndex: 4, cardId: 'red_18_marechal_rubro', atk: 4, hp: 1, maxHp: 3, isFrozen: true },
          ],
          playerRearguard: [
            { slotIndex: 1, cardId: 'blue_37_mago_aprendiz', atk: 3, hp: 3, maxHp: 3 },
            { slotIndex: 3, cardId: 'blue_146_trono_inverno_eterno', atk: 0, hp: 6, maxHp: 6, armor: 1 },
          ],
          p1Hp: 24,
          p1Essence: 8,
          p1MaxEssence: 8,
          p2Hp: 19,
          p2Essence: 5,
          p2MaxEssence: 8,
        },
        afterBoard: {
          aiRearguard: [],
          playerVanguard: [
            {
              slotIndex: 2,
              cardId: 'blue_152_arquimago_vortice',
              atk: 5,
              hp: 5,
              maxHp: 5,
              armor: 1,
              stance: 'attack',
              isLunging: true,
              feedback: { text: '⚔️ -5 Arcano!', color: 'buff' },
            },
            {
              slotIndex: 3,
              cardId: 'blue_154_dragao_safira_soberano',
              atk: 9,
              hp: 8,
              maxHp: 8,
              armor: 2,
              stance: 'attack',
              isLunging: true,
              isBurstTarget: true,
              feedback: { text: '❄️ -9 Direto!', color: 'damage' },
            },
          ],
          aiVanguard: [],
          playerRearguard: [
            { slotIndex: 1, cardId: 'blue_37_mago_aprendiz', atk: 3, hp: 3, maxHp: 3, isLunging: true },
            { slotIndex: 3, cardId: 'blue_146_trono_inverno_eterno', atk: 0, hp: 6, maxHp: 6, armor: 1 },
          ],
          p1Hp: 24,
          p1Essence: 2,
          p1MaxEssence: 8,
          p2Hp: 0,
          p2Essence: 5,
          p2MaxEssence: 8,
          p2Feedback: { text: '💥 -19 VITÓRIA!', color: 'damage' },
        },
      },
    ],
  },
  {
    id: 'abyssal_crypt_domain',
    shortTab: '💀 Cripta Abissal',
    badge: 'COMBO #10 • REANIMAÇÃO DA CRIPTA & ECLIPSE DO TRONO',
    title: 'Eclipse do Trono de Ossos',
    subtitle: 'Campanário dos Mortos + Exumar a Legião Caída + Dragão Umbral do Eclipse',
    comboRef: 'Grimório: Legião da Cripta • Combo Oficial #10',
    accentColor: '#a855f7',
    p1Name: 'Vesperion, Lich (Você)',
    p1AvatarCardId: 'purple_156_lich_coroa_entropia',
    p1Domain: 'purple',
    p2Name: 'Vorágine, Titã Silvestre',
    p2AvatarCardId: 'green_09_hidra',
    p2Domain: 'green',
    steps: [
      {
        id: 'pur-step-1',
        stepBadge: 'PASSO 1/4 • RELÍQUIA NECRÓTICA',
        title: 'Posicionar Campanário dos Mortos na Retaguarda',
        narrative:
          'O Jogador 1 escolhe a Relíquia Campanário dos Mortos na mão e a posiciona na Retaguarda [R], drenando VIDA do Soberano inimigo todo início de turno.',
        sfx: 'summon_heavy',
        musicTrack: 'ambient_battle',
        handCardIds: [
          'purple_126_campanario_mortos',
          'purple_68_exumar_legiao',
          'purple_156_lich_coroa_entropia',
          'purple_123_eclipse_abissal',
          'purple_28_filacterio_noite',
        ],
        selectedHandIndex: 0,
        dockActionLabel: '+ Posicionar Relíquia [R]',
        dockActionType: 'rearguard',
        dockStatusText: '🏛️ Posicionando Campanário dos Mortos na Casa 3 da Retaguarda (Dreno Contínuo)!',
        targetLane: 'playerRearguard',
        targetSlotIndex: 2,
        targetWatermark: '+ Relíquia [R]',
        heraldTitle: '🏛️ RELÍQUIA: CAMPANÁRIO DOS MORTOS',
        heraldSubtitle: 'Badalada fúnebre drena VIDA do Soberano rival e fortalece a Cripta!',
        heraldDomain: 'purple',
        beforeBoard: {
          aiRearguard: [],
          playerVanguard: [
            { slotIndex: 1, cardId: 'purple_25_dama_seis_laminas', atk: 4, hp: 3, maxHp: 3, stance: 'attack' },
            { slotIndex: 3, cardId: 'purple_07_lich', atk: 5, hp: 5, maxHp: 5, armor: 1, stance: 'defend' },
          ],
          aiVanguard: [
            { slotIndex: 2, cardId: 'green_115_carnotauro_chifre', atk: 5, hp: 5, maxHp: 5, stance: 'attack' },
            { slotIndex: 4, cardId: 'green_07_troll', atk: 6, hp: 8, maxHp: 8, stance: 'attack' },
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
            { slotIndex: 1, cardId: 'purple_25_dama_seis_laminas', atk: 4, hp: 3, maxHp: 3, stance: 'attack' },
            { slotIndex: 3, cardId: 'purple_07_lich', atk: 5, hp: 5, maxHp: 5, armor: 1, stance: 'defend' },
          ],
          aiVanguard: [
            { slotIndex: 2, cardId: 'green_115_carnotauro_chifre', atk: 5, hp: 5, maxHp: 5, stance: 'attack' },
            { slotIndex: 4, cardId: 'green_07_troll', atk: 6, hp: 8, maxHp: 8, stance: 'attack' },
          ],
          playerRearguard: [
            {
              slotIndex: 2,
              cardId: 'purple_126_campanario_mortos',
              atk: 0,
              hp: 5,
              maxHp: 5,
              armor: 1,
              isNewlySummoned: true,
              isBurstTarget: true,
              feedback: { text: '🔔 Dreno Ativo!', color: 'heal' },
            },
          ],
          p1Hp: 24,
          p1Essence: 3,
          p1MaxEssence: 6,
          p2Hp: 20,
          p2Essence: 4,
          p2MaxEssence: 6,
          p1Feedback: { text: '+2 ❤️ Dreno', color: 'heal' },
          p2Feedback: { text: '-2 💀 Campanário', color: 'damage' },
        },
      },
      {
        id: 'pur-step-2',
        stepBadge: 'PASSO 2/4 • EXPANSÃO DE DOMÍNIO + REANIMAÇÃO',
        title: 'Expansão: Eclipse do Trono de Ossos & Exumar a Legião',
        narrative:
          'Com 6/6 de Afinidade do Abismo, o Jogador 1 expande o Eclipse do Trono de Ossos e lança Exumar a Legião Caída (4⚡), reanimando Necrothor, Soberano da Carniça diretamente da Cripta e dando +1/+1 a todos os aliados!',
        sfx: 'domain_expand',
        musicTrack: 'domain_purple',
        activeDomain: 'purple',
        domainBannerTitle: '⛩️ ECLIPSE DO TRONO DE OSSOS (3 TURNOS)',
        domainBannerSubtitle: 'Bônus de Domínio: Aliados +1/+1 e Ímpeto • Acerto Garantido direto no Soberano!',
        handCardIds: [
          'purple_68_exumar_legiao',
          'purple_156_lich_coroa_entropia',
          'purple_123_eclipse_abissal',
          'purple_28_filacterio_noite',
        ],
        selectedHandIndex: 0,
        dockActionLabel: '🪦 Lançar Exumar + Expandir Domínio',
        dockActionType: 'domain',
        dockStatusText: '⛩️ Expandindo Eclipse do Trono de Ossos e reanimando Necrothor da Cripta!',
        targetLane: 'playerVanguard',
        targetSlotIndex: 2,
        targetWatermark: '+ Reanimar [V]',
        heraldTitle: '⛩️ ECLIPSE DO TRONO DE OSSOS + EXUMAR LEGIÃO!',
        heraldSubtitle: 'Necrothor renasce da Cripta na Vanguarda e toda a legião recebe +1/+1 e Dreno de Vida!',
        heraldDomain: 'purple',
        beforeBoard: {
          aiRearguard: [],
          playerVanguard: [
            { slotIndex: 1, cardId: 'purple_25_dama_seis_laminas', atk: 4, hp: 3, maxHp: 3, stance: 'attack' },
            { slotIndex: 3, cardId: 'purple_07_lich', atk: 5, hp: 5, maxHp: 5, armor: 1, stance: 'defend' },
          ],
          aiVanguard: [
            { slotIndex: 2, cardId: 'green_115_carnotauro_chifre', atk: 5, hp: 5, maxHp: 5, stance: 'attack' },
            { slotIndex: 4, cardId: 'green_07_troll', atk: 6, hp: 8, maxHp: 8, stance: 'attack' },
          ],
          playerRearguard: [
            { slotIndex: 2, cardId: 'purple_126_campanario_mortos', atk: 0, hp: 5, maxHp: 5, armor: 1 },
          ],
          p1Hp: 24,
          p1Essence: 6,
          p1MaxEssence: 6,
          p2Hp: 20,
          p2Essence: 4,
          p2MaxEssence: 6,
        },
        afterBoard: {
          aiRearguard: [],
          playerVanguard: [
            {
              slotIndex: 1,
              cardId: 'purple_25_dama_seis_laminas',
              atk: 6,
              hp: 4,
              maxHp: 4,
              stance: 'attack',
              feedback: { text: '+2/+1 Exumar!', color: 'buff' },
            },
            {
              slotIndex: 2,
              cardId: 'purple_138_soberano_carnica',
              atk: 7,
              hp: 7,
              maxHp: 7,
              armor: 1,
              stance: 'attack',
              isNewlySummoned: true,
              isBurstTarget: true,
              feedback: { text: '🪦 Reanimado!', color: 'heal' },
            },
            {
              slotIndex: 3,
              cardId: 'purple_07_lich',
              atk: 7,
              hp: 6,
              maxHp: 6,
              armor: 1,
              stance: 'defend',
              feedback: { text: '+2/+1 Exumar!', color: 'buff' },
            },
          ],
          aiVanguard: [
            {
              slotIndex: 2,
              cardId: 'green_115_carnotauro_chifre',
              atk: 5,
              hp: 2,
              maxHp: 5,
              isHitTarget: true,
              feedback: { text: '-3 💀 Carniça!', color: 'damage' },
            },
            {
              slotIndex: 4,
              cardId: 'green_07_troll',
              atk: 6,
              hp: 5,
              maxHp: 8,
              isHitTarget: true,
              feedback: { text: '-3 💀 Carniça!', color: 'damage' },
            },
          ],
          playerRearguard: [
            { slotIndex: 2, cardId: 'purple_126_campanario_mortos', atk: 0, hp: 5, maxHp: 5, armor: 1 },
          ],
          p1Hp: 27,
          p1Essence: 2,
          p1MaxEssence: 6,
          p2Hp: 17,
          p2Essence: 4,
          p2MaxEssence: 6,
          p1Feedback: { text: '+3 ❤️ Dreno', color: 'heal' },
          p2Feedback: { text: '-3 💀 Acerto Garantido', color: 'damage' },
        },
      },
      {
        id: 'pur-step-3',
        stepBadge: 'PASSO 3/4 • DESCIDA DO DRAGÃO UMBRAL',
        title: 'Invocar Dragão Umbral do Eclipse',
        narrative:
          'O Jogador 1 seleciona o Dragão Umbral do Eclipse na mão e o invoca na Casa 5 da Vanguarda [V], reanimando mais um campeão caído e fortalecendo todo o exército imortal!',
        sfx: 'summon_heavy',
        musicTrack: 'domain_purple',
        activeDomain: 'purple',
        domainBannerTitle: '⛩️ ECLIPSE DO TRONO DE OSSOS (2 TURNOS)',
        domainBannerSubtitle: 'Reanimação da Cripta ativa — o exército imortal domina as 6 casas!',
        handCardIds: [
          'purple_156_lich_coroa_entropia',
          'purple_123_eclipse_abissal',
          'purple_28_filacterio_noite',
          'purple_30_erguer_mortos',
        ],
        selectedHandIndex: 0,
        dockActionLabel: '+ Vanguarda [V]',
        dockActionType: 'vanguard',
        dockStatusText: '🐉 Invocando Dragão Umbral do Eclipse na Casa 5 da Vanguarda!',
        targetLane: 'playerVanguard',
        targetSlotIndex: 4,
        targetWatermark: '+ Vanguarda [V]',
        heraldTitle: '💀 LENDÁRIA: DRAGÃO UMBRAL DO ECLIPSE',
        heraldSubtitle: 'Ao Entrar: Fortalece toda a fileira aliada e drena a essência vital do inimigo!',
        heraldDomain: 'purple',
        beforeBoard: {
          aiRearguard: [],
          playerVanguard: [
            { slotIndex: 1, cardId: 'purple_25_dama_seis_laminas', atk: 6, hp: 4, maxHp: 4, stance: 'attack' },
            { slotIndex: 2, cardId: 'purple_138_soberano_carnica', atk: 7, hp: 7, maxHp: 7, armor: 1, stance: 'attack' },
            { slotIndex: 3, cardId: 'purple_07_lich', atk: 7, hp: 6, maxHp: 6, armor: 1, stance: 'defend' },
          ],
          aiVanguard: [
            { slotIndex: 2, cardId: 'green_115_carnotauro_chifre', atk: 5, hp: 2, maxHp: 5 },
            { slotIndex: 4, cardId: 'green_07_troll', atk: 6, hp: 5, maxHp: 8 },
          ],
          playerRearguard: [
            { slotIndex: 2, cardId: 'purple_126_campanario_mortos', atk: 0, hp: 5, maxHp: 5, armor: 1 },
          ],
          p1Hp: 27,
          p1Essence: 7,
          p1MaxEssence: 7,
          p2Hp: 17,
          p2Essence: 5,
          p2MaxEssence: 7,
        },
        afterBoard: {
          aiRearguard: [],
          playerVanguard: [
            { slotIndex: 1, cardId: 'purple_25_dama_seis_laminas', atk: 7, hp: 5, maxHp: 5, stance: 'attack' },
            { slotIndex: 2, cardId: 'purple_138_soberano_carnica', atk: 8, hp: 8, maxHp: 8, armor: 1, stance: 'attack' },
            { slotIndex: 3, cardId: 'purple_07_lich', atk: 8, hp: 7, maxHp: 7, armor: 1, stance: 'attack' },
            {
              slotIndex: 4,
              cardId: 'purple_156_lich_coroa_entropia',
              atk: 8,
              hp: 8,
              maxHp: 8,
              armor: 2,
              stance: 'attack',
              isNewlySummoned: true,
              isBurstTarget: true,
              feedback: { text: '🐉 Eclipse +1/+1!', color: 'buff' },
            },
          ],
          aiVanguard: [
            { slotIndex: 4, cardId: 'green_07_troll', atk: 6, hp: 3, maxHp: 8, isHitTarget: true },
          ],
          playerRearguard: [
            { slotIndex: 2, cardId: 'purple_126_campanario_mortos', atk: 0, hp: 5, maxHp: 5, armor: 1 },
          ],
          p1Hp: 29,
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
        title: 'Eclipse do Sol Abissal + Dreno de Vida Total',
        narrative:
          'O Jogador 1 seleciona Eclipse do Sol Abissal na mão, varre o último Guardião inimigo e ataca com toda a Legião Imortal, drenando os últimos 14 PV do Soberano rival!',
        sfx: 'attack_hit',
        musicTrack: 'domain_purple',
        activeDomain: 'purple',
        domainBannerTitle: '⛩️ ECLIPSE DO TRONO DE OSSOS (VITÓRIA IMORTAL)',
        domainBannerSubtitle: 'Dreno de Vida restaura o Soberano para 30 PV enquanto finaliza o oponente!',
        handCardIds: [
          'purple_123_eclipse_abissal',
          'purple_28_filacterio_noite',
          'purple_30_erguer_mortos',
        ],
        selectedHandIndex: 0,
        dockActionLabel: '💀 Lançar Eclipse + Ataque Total',
        dockActionType: 'spell',
        dockStatusText: '⚔️ Ceifando a Vanguarda inimiga e desferindo 24 de dano necrótico ao Soberano rival!',
        targetLane: 'aiVanguard',
        targetSlotIndex: 4,
        heraldTitle: '💀 CEIFA IMORTAL DA LEGIÃO DO ECLIPSE!',
        heraldSubtitle: 'Eclipse do Sol Abissal limpa o caminho e a Vanguarda drena toda a Vida rival!',
        heraldDomain: 'purple',
        breathWaveLane: 'aiVanguard',
        breathWaveDomain: 'purple',
        beforeBoard: {
          aiRearguard: [],
          playerVanguard: [
            { slotIndex: 1, cardId: 'purple_25_dama_seis_laminas', atk: 7, hp: 5, maxHp: 5, stance: 'attack' },
            { slotIndex: 2, cardId: 'purple_138_soberano_carnica', atk: 8, hp: 8, maxHp: 8, armor: 1, stance: 'attack' },
            { slotIndex: 3, cardId: 'purple_07_lich', atk: 8, hp: 7, maxHp: 7, armor: 1, stance: 'attack' },
            {
              slotIndex: 4,
              cardId: 'purple_156_lich_coroa_entropia',
              atk: 8,
              hp: 8,
              maxHp: 8,
              armor: 2,
              stance: 'attack',
            },
          ],
          aiVanguard: [{ slotIndex: 4, cardId: 'green_07_troll', atk: 6, hp: 3, maxHp: 8, stance: 'defend' }],
          playerRearguard: [
            { slotIndex: 2, cardId: 'purple_126_campanario_mortos', atk: 0, hp: 5, maxHp: 5, armor: 1 },
          ],
          p1Hp: 29,
          p1Essence: 8,
          p1MaxEssence: 8,
          p2Hp: 14,
          p2Essence: 5,
          p2MaxEssence: 8,
        },
        afterBoard: {
          aiRearguard: [],
          playerVanguard: [
            {
              slotIndex: 1,
              cardId: 'purple_25_dama_seis_laminas',
              atk: 7,
              hp: 5,
              maxHp: 5,
              stance: 'attack',
              isLunging: true,
              feedback: { text: '☠ -7 Letal!', color: 'damage' },
            },
            {
              slotIndex: 2,
              cardId: 'purple_138_soberano_carnica',
              atk: 8,
              hp: 8,
              maxHp: 8,
              armor: 1,
              stance: 'attack',
              isLunging: true,
              feedback: { text: '💀 -8 Dreno!', color: 'heal' },
            },
            {
              slotIndex: 3,
              cardId: 'purple_07_lich',
              atk: 8,
              hp: 7,
              maxHp: 7,
              armor: 1,
              stance: 'attack',
              isLunging: true,
            },
            {
              slotIndex: 4,
              cardId: 'purple_156_lich_coroa_entropia',
              atk: 8,
              hp: 8,
              maxHp: 8,
              armor: 2,
              stance: 'attack',
              isLunging: true,
              feedback: { text: '⚔️ -8 Eclipse!', color: 'damage' },
            },
          ],
          aiVanguard: [],
          playerRearguard: [
            { slotIndex: 2, cardId: 'purple_126_campanario_mortos', atk: 0, hp: 5, maxHp: 5, armor: 1 },
          ],
          p1Hp: 30,
          p1Essence: 3,
          p1MaxEssence: 8,
          p2Hp: 0,
          p2Essence: 5,
          p2MaxEssence: 8,
          p1Feedback: { text: '+4 ❤️ Vida Cheia!', color: 'heal' },
          p2Feedback: { text: '💥 -14 VITÓRIA!', color: 'damage' },
        },
      },
    ],
  },
  {
    id: 'golden_citadel_clash',
    shortTab: '☀️ Cidadela & Colisão',
    badge: 'COMBO #15 • ESCUDO DIVINO EM MASSA & COLISÃO DE DOMÍNIOS 50/50',
    title: 'Cidadela da Aurora vs Eclipse Abissal',
    subtitle: 'Trono do Imperador Eterno + Cúpula das Asas Seráficas + Aurelius, Soberano da Alvorada',
    comboRef: 'Grimório: Bastião de Aurelius • Combo Oficial #15',
    accentColor: '#eab308',
    p1Name: 'Aurelius (Você)',
    p1AvatarCardId: 'gold_157_dragao_soberano_alvorada',
    p1Domain: 'gold',
    p2Name: 'Monarca dos Três Crânios',
    p2AvatarCardId: 'purple_157_dragao_sombra_abissal',
    p2Domain: 'purple',
    steps: [
      {
        id: 'gld-step-1',
        stepBadge: 'PASSO 1/4 • RELÍQUIA IMPERIAL',
        title: 'Posicionar Trono Supremo do Imperador Eterno na Retaguarda',
        narrative:
          'Sob o domínio inimigo, o Jogador 1 escolhe a Relíquia Trono Supremo do Imperador Eterno na mão e a posiciona na Retaguarda [R], concedendo +1/+1 e Escudo Divino à sua Vanguarda!',
        sfx: 'shield_up',
        musicTrack: 'domain_purple',
        activeDomain: 'purple',
        domainBannerTitle: '⛩️ DOMÍNIO INIMIGO ATIVO: ECLIPSE DO TRONO DE OSSOS',
        domainBannerSubtitle: 'O oponente tenta dominar o tabuleiro — prepare sua resposta de Ordem & Ferro!',
        handCardIds: [
          'gold_146_trono_imperador_eterno',
          'gold_160_decreto_invulnerabilidade',
          'gold_157_dragao_soberano_alvorada',
          'gold_138_imperador_sol_supremo',
          'gold_30_escudo_solar',
        ],
        selectedHandIndex: 0,
        dockActionLabel: '+ Posicionar Relíquia [R]',
        dockActionType: 'rearguard',
        dockStatusText: '🏛️ Posicionando Trono Supremo do Imperador Eterno na Casa 4 da Retaguarda!',
        targetLane: 'playerRearguard',
        targetSlotIndex: 3,
        targetWatermark: '+ Relíquia [R]',
        heraldTitle: '🏛️ RELÍQUIA: TRONO DO IMPERADOR ETERNO',
        heraldSubtitle: 'Aura Imperial concede +1/+1 e Escudo Divino à Falange na Vanguarda!',
        heraldDomain: 'gold',
        beforeBoard: {
          aiRearguard: [
            { slotIndex: 2, cardId: 'purple_126_campanario_mortos', atk: 0, hp: 5, maxHp: 5, armor: 1 },
          ],
          playerVanguard: [
            { slotIndex: 1, cardId: 'gold_26_muralha_aco', atk: 3, hp: 5, maxHp: 5, armor: 2, stance: 'defend' },
            { slotIndex: 2, cardId: 'gold_07_dragao_ouro', atk: 5, hp: 6, maxHp: 6, armor: 2, stance: 'defend' },
          ],
          aiVanguard: [
            { slotIndex: 2, cardId: 'purple_138_soberano_carnica', atk: 6, hp: 6, maxHp: 6, armor: 1, stance: 'attack' },
            { slotIndex: 3, cardId: 'purple_157_dragao_sombra_abissal', atk: 7, hp: 7, maxHp: 7, armor: 1, stance: 'attack' },
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
          aiRearguard: [
            { slotIndex: 2, cardId: 'purple_126_campanario_mortos', atk: 0, hp: 5, maxHp: 5, armor: 1 },
          ],
          playerVanguard: [
            {
              slotIndex: 1,
              cardId: 'gold_26_muralha_aco',
              atk: 4,
              hp: 6,
              maxHp: 6,
              armor: 2,
              hasDivineShield: true,
              stance: 'defend',
              isBurstTarget: true,
              feedback: { text: '+1/+1 & Escudo!', color: 'buff' },
            },
            {
              slotIndex: 2,
              cardId: 'gold_07_dragao_ouro',
              atk: 6,
              hp: 7,
              maxHp: 7,
              armor: 2,
              hasDivineShield: true,
              stance: 'defend',
              feedback: { text: '+1/+1 Imperial!', color: 'buff' },
            },
          ],
          aiVanguard: [
            { slotIndex: 2, cardId: 'purple_138_soberano_carnica', atk: 6, hp: 6, maxHp: 6, armor: 1, stance: 'attack' },
            { slotIndex: 3, cardId: 'purple_157_dragao_sombra_abissal', atk: 7, hp: 7, maxHp: 7, armor: 1, stance: 'attack' },
          ],
          playerRearguard: [
            {
              slotIndex: 3,
              cardId: 'gold_146_trono_imperador_eterno',
              atk: 0,
              hp: 6,
              maxHp: 6,
              armor: 2,
              isNewlySummoned: true,
              isBurstTarget: true,
              feedback: { text: 'Trono Ativo!', color: 'shield' },
            },
          ],
          p1Hp: 21,
          p1Essence: 2,
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
          'O Jogador 1 responde com sua própria Expansão de Domínio! O tabuleiro racha ao meio em uma Colisão de Domínios 50/50 (anulando o Acerto Garantido inimigo) enquanto lança Cúpula das Asas Seráficas blindando toda a tropa!',
        sfx: 'domain_expand',
        musicTrack: 'domain_clash',
        activeDomain: 'clash_gold_purple',
        domainBannerTitle: '⚡ COLISÃO DE DOMÍNIOS: CIDADELA DA AURORA vs ECLIPSE ABISSAL',
        domainBannerSubtitle: 'Fenda Central ativa! Acertos Garantidos anulados — Potências colidem 50/50!',
        handCardIds: [
          'gold_160_decreto_invulnerabilidade',
          'gold_157_dragao_soberano_alvorada',
          'gold_138_imperador_sol_supremo',
          'gold_30_escudo_solar',
        ],
        selectedHandIndex: 0,
        dockActionLabel: '⛩️ Expandir Domínio + Cúpula Seráfica',
        dockActionType: 'domain',
        dockStatusText: '⚡ Colisão de Domínios! Concedendo ✦ Escudo Divino e +1/+1 a todas as unidades aliadas!',
        targetLane: 'playerVanguard',
        targetSlotIndex: 2,
        heraldTitle: '⚡ COLISÃO DE DOMÍNIOS + CÚPULA SERÁFICA!',
        heraldSubtitle: 'Cidadela da Aurora divide o tabuleiro ao meio e blinda toda a sua tropa com Escudo Divino!',
        heraldDomain: 'gold',
        beforeBoard: {
          aiRearguard: [
            { slotIndex: 2, cardId: 'purple_126_campanario_mortos', atk: 0, hp: 5, maxHp: 5, armor: 1 },
          ],
          playerVanguard: [
            { slotIndex: 1, cardId: 'gold_26_muralha_aco', atk: 4, hp: 6, maxHp: 6, armor: 2, hasDivineShield: true, stance: 'defend' },
            { slotIndex: 2, cardId: 'gold_07_dragao_ouro', atk: 6, hp: 7, maxHp: 7, armor: 2, hasDivineShield: true, stance: 'defend' },
          ],
          aiVanguard: [
            { slotIndex: 2, cardId: 'purple_138_soberano_carnica', atk: 6, hp: 6, maxHp: 6, armor: 1, stance: 'attack' },
            { slotIndex: 3, cardId: 'purple_157_dragao_sombra_abissal', atk: 7, hp: 7, maxHp: 7, armor: 1, stance: 'attack' },
          ],
          playerRearguard: [
            { slotIndex: 3, cardId: 'gold_146_trono_imperador_eterno', atk: 0, hp: 6, maxHp: 6, armor: 2 },
          ],
          p1Hp: 21,
          p1Essence: 6,
          p1MaxEssence: 6,
          p2Hp: 22,
          p2Essence: 4,
          p2MaxEssence: 6,
        },
        afterBoard: {
          aiRearguard: [
            { slotIndex: 2, cardId: 'purple_126_campanario_mortos', atk: 0, hp: 5, maxHp: 5, armor: 1 },
          ],
          playerVanguard: [
            {
              slotIndex: 1,
              cardId: 'gold_26_muralha_aco',
              atk: 5,
              hp: 7,
              maxHp: 7,
              armor: 3,
              hasDivineShield: true,
              stance: 'defend',
              isBurstTarget: true,
              feedback: { text: '✦ Escudo Divino!', color: 'shield' },
            },
            {
              slotIndex: 2,
              cardId: 'gold_07_dragao_ouro',
              atk: 7,
              hp: 8,
              maxHp: 8,
              armor: 3,
              hasDivineShield: true,
              stance: 'defend',
              isBurstTarget: true,
              feedback: { text: '✦ Escudo Divino!', color: 'shield' },
            },
          ],
          aiVanguard: [
            { slotIndex: 2, cardId: 'purple_138_soberano_carnica', atk: 6, hp: 6, maxHp: 6, armor: 1, stance: 'attack' },
            { slotIndex: 3, cardId: 'purple_157_dragao_sombra_abissal', atk: 7, hp: 7, maxHp: 7, armor: 1, stance: 'attack' },
          ],
          playerRearguard: [
            {
              slotIndex: 3,
              cardId: 'gold_146_trono_imperador_eterno',
              atk: 0,
              hp: 6,
              maxHp: 6,
              armor: 3,
              hasDivineShield: true,
              feedback: { text: '✦ Protegido!', color: 'shield' },
            },
          ],
          p1Hp: 25,
          p1Essence: 2,
          p1MaxEssence: 6,
          p2Hp: 22,
          p2Essence: 4,
          p2MaxEssence: 6,
          p1Feedback: { text: '+4 ❤️ Asas Seráficas', color: 'heal' },
        },
      },
      {
        id: 'gld-step-3',
        stepBadge: 'PASSO 3/4 • DESCIDA DO DRAGÃO DA ALVORADA',
        title: 'Invocar Aurelius, Soberano da Alvorada & Quebrar o Domínio Inimigo',
        narrative:
          'O Jogador 1 seleciona Aurelius, Dragão Soberano da Alvorada na mão e o invoca na Vanguarda [V]. Seu Sopro Solar devasta a linha inimiga e quebra o domínio rival, fazendo a Cidadela da Aurora reinar absoluta!',
        sfx: 'ascend',
        musicTrack: 'domain_gold',
        activeDomain: 'gold',
        domainBannerTitle: '⛩️ CIDADELA DA AURORA INABALÁVEL (DOMÍNIO SOBERANO)',
        domainBannerSubtitle: 'Domínio inimigo estilhaçado! Toda a sua tropa recebe +2/+2 e Escudo Divino!',
        handCardIds: [
          'gold_157_dragao_soberano_alvorada',
          'gold_138_imperador_sol_supremo',
          'gold_30_escudo_solar',
          'gold_28_reliquia_pacto',
        ],
        selectedHandIndex: 0,
        dockActionLabel: '+ Vanguarda [V]',
        dockActionType: 'vanguard',
        dockStatusText: '☀️ Invocação Lendária: Aurelius, Soberano da Alvorada pousa na Casa 4 da Vanguarda!',
        targetLane: 'playerVanguard',
        targetSlotIndex: 3,
        targetWatermark: '+ Vanguarda [V]',
        heraldTitle: '☀️ LENDÁRIA: AURELIUS, SOBERANO DA ALVORADA',
        heraldSubtitle: 'Domínio inimigo quebrado! Aurelius concede +2/+2 a todos os aliados e pune o Abismo!',
        heraldDomain: 'gold',
        breathWaveLane: 'aiVanguard',
        breathWaveDomain: 'gold',
        beforeBoard: {
          aiRearguard: [
            { slotIndex: 2, cardId: 'purple_126_campanario_mortos', atk: 0, hp: 5, maxHp: 5, armor: 1 },
          ],
          playerVanguard: [
            { slotIndex: 1, cardId: 'gold_26_muralha_aco', atk: 5, hp: 7, maxHp: 7, armor: 3, hasDivineShield: true, stance: 'defend' },
            { slotIndex: 2, cardId: 'gold_07_dragao_ouro', atk: 7, hp: 8, maxHp: 8, armor: 3, hasDivineShield: true, stance: 'defend' },
          ],
          aiVanguard: [
            { slotIndex: 2, cardId: 'purple_138_soberano_carnica', atk: 6, hp: 6, maxHp: 6, armor: 1, stance: 'attack' },
            { slotIndex: 3, cardId: 'purple_157_dragao_sombra_abissal', atk: 7, hp: 7, maxHp: 7, armor: 1, stance: 'attack' },
          ],
          playerRearguard: [
            { slotIndex: 3, cardId: 'gold_146_trono_imperador_eterno', atk: 0, hp: 6, maxHp: 6, armor: 3, hasDivineShield: true },
          ],
          p1Hp: 25,
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
              cardId: 'gold_26_muralha_aco',
              atk: 7,
              hp: 9,
              maxHp: 9,
              armor: 3,
              hasDivineShield: true,
              stance: 'attack',
              feedback: { text: '+2/+2 Aurelius!', color: 'buff' },
            },
            {
              slotIndex: 2,
              cardId: 'gold_07_dragao_ouro',
              atk: 9,
              hp: 10,
              maxHp: 10,
              armor: 3,
              hasDivineShield: true,
              stance: 'attack',
              feedback: { text: '+2/+2 Aurelius!', color: 'buff' },
            },
            {
              slotIndex: 3,
              cardId: 'gold_157_dragao_soberano_alvorada',
              atk: 10,
              hp: 10,
              maxHp: 10,
              armor: 3,
              hasDivineShield: true,
              stance: 'attack',
              isNewlySummoned: true,
              isBurstTarget: true,
              burstKind: 'ascend',
              feedback: { text: '☀️ Sopro Solar 3!', color: 'buff' },
            },
          ],
          aiVanguard: [
            {
              slotIndex: 3,
              cardId: 'purple_157_dragao_sombra_abissal',
              atk: 7,
              hp: 2,
              maxHp: 7,
              armor: 0,
              isHitTarget: true,
              feedback: { text: '-5 ☀️ Sopro Solar!', color: 'damage' },
            },
          ],
          playerRearguard: [
            { slotIndex: 3, cardId: 'gold_146_trono_imperador_eterno', atk: 0, hp: 6, maxHp: 6, armor: 3, hasDivineShield: true },
          ],
          p1Hp: 29,
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
          'Com todas as unidades protegidas por Escudo Divino e fortalecidas pela Cidadela da Aurora, o Jogador 1 aciona ⚔️ ATACAR para desferir 26 de dano solar e conquistar a vitória!',
        sfx: 'victory',
        musicTrack: 'domain_gold',
        activeDomain: 'gold',
        domainBannerTitle: '⛩️ CIDADELA DA AURORA INABALÁVEL (VITÓRIA SUPREMA)',
        domainBannerSubtitle: '26 de Poder de Ataque com Escudo Divino intacto!',
        handCardIds: [
          'gold_138_imperador_sol_supremo',
          'gold_30_escudo_solar',
          'gold_28_reliquia_pacto',
        ],
        selectedHandIndex: 0,
        dockActionLabel: '⚔️ ATACAR COM TODOS (26 ⚔️)',
        dockActionType: 'spell',
        dockStatusText: '☀️ Marcha Solar: Aurelius (10⚔️) + Aurarius (9⚔️) + Falange (7⚔️) atacam em formação!',
        targetLane: 'aiVanguard',
        targetSlotIndex: 3,
        heraldTitle: '☀️ VITÓRIA SOBERANA: JULGAMENTO DA AURORA!',
        heraldSubtitle: 'A Falange Dourada marcha invulnerável e reduz o Soberano rival a 0 PV!',
        heraldDomain: 'gold',
        breathWaveLane: 'aiVanguard',
        breathWaveDomain: 'gold',
        beforeBoard: {
          aiRearguard: [],
          playerVanguard: [
            { slotIndex: 1, cardId: 'gold_26_muralha_aco', atk: 7, hp: 9, maxHp: 9, armor: 3, hasDivineShield: true, stance: 'attack' },
            { slotIndex: 2, cardId: 'gold_07_dragao_ouro', atk: 9, hp: 10, maxHp: 10, armor: 3, hasDivineShield: true, stance: 'attack' },
            {
              slotIndex: 3,
              cardId: 'gold_157_dragao_soberano_alvorada',
              atk: 10,
              hp: 10,
              maxHp: 10,
              armor: 3,
              hasDivineShield: true,
              stance: 'attack',
            },
          ],
          aiVanguard: [
            { slotIndex: 3, cardId: 'purple_157_dragao_sombra_abissal', atk: 7, hp: 2, maxHp: 7, armor: 0, stance: 'defend' },
          ],
          playerRearguard: [
            { slotIndex: 3, cardId: 'gold_146_trono_imperador_eterno', atk: 0, hp: 6, maxHp: 6, armor: 3, hasDivineShield: true },
          ],
          p1Hp: 29,
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
              cardId: 'gold_26_muralha_aco',
              atk: 7,
              hp: 9,
              maxHp: 9,
              armor: 3,
              hasDivineShield: true,
              stance: 'attack',
              isLunging: true,
              feedback: { text: '⚔️ -7 Solar!', color: 'buff' },
            },
            {
              slotIndex: 2,
              cardId: 'gold_07_dragao_ouro',
              atk: 9,
              hp: 10,
              maxHp: 10,
              armor: 3,
              hasDivineShield: true,
              stance: 'attack',
              isLunging: true,
              feedback: { text: '⚔️ -9 Solar!', color: 'buff' },
            },
            {
              slotIndex: 3,
              cardId: 'gold_157_dragao_soberano_alvorada',
              atk: 10,
              hp: 10,
              maxHp: 10,
              armor: 3,
              hasDivineShield: true,
              stance: 'attack',
              isLunging: true,
              isBurstTarget: true,
              burstKind: 'ascend',
              feedback: { text: '☀️ -10 Letal!', color: 'damage' },
            },
          ],
          aiVanguard: [],
          playerRearguard: [
            { slotIndex: 3, cardId: 'gold_146_trono_imperador_eterno', atk: 0, hp: 6, maxHp: 6, armor: 3, hasDivineShield: true },
          ],
          p1Hp: 30,
          p1Essence: 4,
          p1MaxEssence: 8,
          p2Hp: 0,
          p2Essence: 4,
          p2MaxEssence: 8,
          p2Feedback: { text: '💥 -24 VITÓRIA!', color: 'damage' },
        },
      },
    ],
  },
];

function resolveRealCard(cardId: string): CardDefinition {
  return CARDS_BY_ID[cardId] ?? ALL_CARDS[0];
}

function buildSyntheticUnit(
  spec: SimSlotSpec,
  owner: 'player' | 'ai',
  row: RowType,
): BoardUnit {
  const baseCard = resolveRealCard(spec.cardId);

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
  const [paceMode, setPaceMode] = useState<'human' | 'fast'>('human');
  const [isAudioLive, setIsAudioLive] = useState<boolean>(() => !soundMuted);

  const scenario = SIM_DUEL_SCENARIOS[scenarioIdx] ?? SIM_DUEL_SCENARIOS[0];
  const step = scenario.steps[stepIdx] ?? scenario.steps[0];

  // Keep showcase audio synced with global navbar mute button
  useEffect(() => {
    if (soundMuted !== undefined) {
      setIsAudioLive(!soundMuted);
    }
  }, [soundMuted]);

  // Realistic Human Match Pacing:
  // 'hand' (Player 1 inspecting hand & choosing card): 4.5s
  // 'dock' (Player 1 reading card command dock & aiming at board slot): 4.8s
  // 'impact' (Card flight, summon slam, herald banner, dragon breath / mandala & floating numbers): 5.5s
  useEffect(() => {
    if (!isAutoPlaying) return undefined;

    const baseMs =
      subPhase === 'hand' ? 4500 : subPhase === 'dock' ? 4800 : 5500;
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

  // Trigger real game audio & multi-layered combat SFX on every phase transition
  useEffect(() => {
    if (!isAudioLive || soundMuted) return undefined;

    setBattleMusicTrack(step.musicTrack);
    const timers: number[] = [];

    if (subPhase === 'hand') {
      playSoundEffect('card_draw');
    } else if (subPhase === 'dock') {
      playSoundEffect('button_click');
      timers.push(
        window.setTimeout(() => {
          playSfx('draw');
        }, 260),
      );
    } else if (subPhase === 'impact') {
      playSoundEffect(step.sfx);

      const allAfterUnits = [
        ...step.afterBoard.aiRearguard,
        ...step.afterBoard.playerVanguard,
        ...step.afterBoard.aiVanguard,
        ...step.afterBoard.playerRearguard,
      ];
      const hasNewlySummoned = allAfterUnits.some((u) => u.isNewlySummoned);
      const hasLunging = allAfterUnits.some((u) => u.isLunging);
      const hasHitTarget =
        allAfterUnits.some((u) => u.isHitTarget) ||
        Boolean(step.afterBoard.p2Feedback && step.afterBoard.p2Feedback.color === 'damage');
      const isLethalVictory = step.afterBoard.p2Hp <= 0;

      if (hasNewlySummoned && step.sfx !== 'summon_heavy') {
        timers.push(
          window.setTimeout(() => {
            playSfx('summon');
          }, 180),
        );
      }
      if (step.breathWaveLane) {
        timers.push(
          window.setTimeout(() => {
            playSfx('spell');
          }, 220),
        );
      }
      if (hasLunging) {
        timers.push(
          window.setTimeout(() => {
            playSfx('attack');
          }, 260),
        );
        timers.push(
          window.setTimeout(() => {
            playSfx('hit');
          }, 480),
        );
      } else if (hasHitTarget) {
        timers.push(
          window.setTimeout(() => {
            playSfx('hit');
          }, 340),
        );
      }
      if (isLethalVictory) {
        timers.push(
          window.setTimeout(() => {
            playSfx('victory');
          }, 680),
        );
      }
    }

    return () => {
      for (const t of timers) {
        window.clearTimeout(t);
      }
    };
  }, [isAudioLive, soundMuted, scenarioIdx, stepIdx, subPhase, step]);

  // As soon as browser unlocks Web Audio on the user's first gesture anywhere on the page, start current step audio
  useEffect(() => {
    let hasTriggeredInitialUnlock = false;
    const unsub = onAudioUnlocked(() => {
      if (hasTriggeredInitialUnlock) return;
      hasTriggeredInitialUnlock = true;
      if (isAudioLive && !soundMuted) {
        setBattleMusicTrack(step.musicTrack);
        if (subPhase === 'hand') {
          playSoundEffect('card_draw');
        } else if (subPhase === 'dock') {
          playSoundEffect('button_click');
        } else {
          playSoundEffect(step.sfx);
        }
      }
    });
    return () => unsub();
  }, [isAudioLive, soundMuted, step.musicTrack, step.sfx, subPhase]);

  useEffect(() => {
    return () => {
      stopBattleMusic();
    };
  }, []);

  const handleToggleAudio = () => {
    getSharedAudioContext();
    const next = !isAudioLive;
    setIsAudioLive(next);
    if (next) {
      if (soundMuted && onToggleSound) {
        onToggleSound();
      }
      setBattleMusicTrack(step.musicTrack);
      playSoundEffect(step.sfx);
    } else {
      if (!soundMuted && onToggleSound) {
        onToggleSound();
      }
      stopBattleMusic();
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

  const boardState = subPhase === 'impact' ? step.afterBoard : step.beforeBoard;
  const handCards = step.handCardIds.map((id) => resolveRealCard(id));
  const selectedHandCard =
    handCards[step.selectedHandIndex] ?? handCards[0] ?? ALL_CARDS[0];

  const p1AvatarCard = resolveRealCard(scenario.p1AvatarCardId);
  const p2AvatarCard = resolveRealCard(scenario.p2AvatarCardId);

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
                    } ${
                      subPhase === 'impact' && spec?.isNewlySummoned
                        ? 'sim-card-flight-slam'
                        : ''
                    } ${subPhase === 'impact' && spec?.isLunging ? 'is-lunging-attacker' : ''} ${
                      subPhase === 'impact' && spec?.isHitTarget ? 'is-hit-target' : ''
                    }`}
                    style={
                      {
                        '--lunge-x': '0px',
                        '--lunge-y': owner === 'player' ? '-78px' : '78px',
                      } as React.CSSProperties
                    }
                  >
                    {subPhase === 'impact' && spec?.isNewlySummoned && (
                      <div className="board-summon-shockwave" />
                    )}

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
            {isAudioLive ? '🔊 Som: ON' : '🔇 Ativar Som & Música'}
          </button>
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
            onClick={() => setIsAutoPlaying((prev) => !prev)}
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
            title="Alternar entre o ritmo natural de uma partida humana (~15s por jogada) e ritmo rápido"
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
            1. 🃏 Escolhendo Carta na Mão
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
            2. 🎯 Painel & Escolha de Alvo
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
            3. 💥 Carta & Efeitos na Mesa
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
              onClick={() => onInspectCard(p2AvatarCard)}
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
                  onClick={() => onInspectCard(p1AvatarCard)}
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

          {/* ===================================================================
              4. AUTHENTIC PLAYER 1 HAND FAN ('hand') OR SELECTED CARD COMMAND DOCK ('dock')
                 (Anchored directly inside .sim-authentic-fullscreen-stage so it is NEVER clipped!)
              =================================================================== */}
          <div className="mtg-bottom-zone floating-bottom-hud sim-anchored-bottom-hud">
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
                      💥 Executar Jogada
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
                    const liftY = isSelected ? -28 : Math.abs(offsetIdx) * 3;

                    return (
                      <div
                        key={`${card.id}-sim-hand-${idx}`}
                        className={`mtg-hand-card-slot ${isSelected ? 'is-selected-slot' : ''}`}
                        style={{
                          transform: `translateY(${liftY}px) rotate(${rotDeg}deg)`,
                          zIndex: isSelected ? 65 : idx + 10,
                          marginLeft: idx === 0 ? '0px' : '-22px',
                        }}
                      >
                        {isSelected && (
                          <div className="sim-hand-selected-pointer">
                            👆 ESCOLHENDO ESTA CARTA
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
    </div>
  );
};
