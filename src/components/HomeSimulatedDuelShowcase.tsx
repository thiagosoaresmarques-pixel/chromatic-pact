import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CardDefinition, Domain } from '../types/game';
import { CARDS_BY_ID, ALL_CARDS } from '../data/cards';
import { DOMAIN_META } from './CardView';
import { playSfx, SfxType, isMuted, toggleMute } from '../utils/soundEngine';
import { setMusicState, startAdaptiveMusic, MusicIntensityStage } from '../utils/musicEngine';

export interface HomeSimulatedDuelShowcaseProps {
  onInspectCard?: (card: CardDefinition) => void;
  onPlayDuelNow?: () => void;
  onOpenCombosCompendium?: () => void;
  soundMuted?: boolean;
  onToggleSound?: () => void;
}

interface SimulatedSlotUnit {
  cardId: string;
  atk: number;
  hp: number;
  maxHp: number;
  armor?: number;
  stackCount?: number;
  isAscended?: boolean;
  ascendedName?: string;
  hasShield?: boolean;
  isFrozen?: boolean;
  isTrapHidden?: boolean;
  isTrapRevealed?: boolean;
  isAttacking?: boolean;
  isHit?: boolean;
  floatingText?: string;
  floatingColor?: string;
}

interface SimulatedDomainState {
  mode: 'none' | 'single' | 'clash_50_50';
  owner?: 'player' | 'enemy';
  domain: Domain;
  name: string;
  rivalDomain?: Domain;
  rivalName?: string;
  effectSummary: string;
}

interface SimulatedDuelStep {
  stepIndex: number;
  turnLabel: string;
  phaseBadge: string;
  comboTitle: string;
  narrative: string;
  sfx: SfxType;
  musicStage: MusicIntensityStage;
  musicDomain: Domain;
  spotlightCardId?: string;
  spotlightLabel?: string;
  playerHp: number;
  playerEssence: string;
  playerAffinity: string;
  enemyHp: number;
  enemyEssence: string;
  enemyAffinity: string;
  domainState: SimulatedDomainState;
  // 4 columns for Desktop ( Smartphone focuses on columns 0 and 1 )
  enemyRearguard: (SimulatedSlotUnit | null)[];
  enemyVanguard: (SimulatedSlotUnit | null)[];
  playerVanguard: (SimulatedSlotUnit | null)[];
  playerRearguard: (SimulatedSlotUnit | null)[];
}

interface SimulatedDuelScenario {
  id: string;
  shortTabLabel: string;
  title: string;
  subtitle: string;
  comboBadge: string;
  playerSovereign: {
    name: string;
    title: string;
    domain: Domain;
    avatarCardId: string;
  };
  enemySovereign: {
    name: string;
    title: string;
    domain: Domain;
    avatarCardId: string;
  };
  steps: SimulatedDuelStep[];
}

const SIMULATED_DUEL_SCENARIOS: SimulatedDuelScenario[] = [
  // =========================================================================
  // CENÁRIO 1: CHAMA vs TEMPESTADE (CHOQUE DE DOMÍNIOS 50/50 & SUPERNOVA)
  // =========================================================================
  {
    id: 'duel_red_vs_blue_clash',
    shortTabLabel: '🔥 vs ❄️ Choque 50/50',
    title: 'Cataclismo Solar vs. Zero Absoluto',
    subtitle: 'Combo Artilharia Piromante + Choque de Domínios 50/50 + Sopro Vulcânico',
    comboBadge: 'COMBO: ORBE DO SOL (#166) + CATACLISMO SOLAR',
    playerSovereign: {
      name: 'Igniskar',
      title: 'Tirano da Cratera',
      domain: 'red',
      avatarCardId: 'red_08_dragao_vermelho',
    },
    enemySovereign: {
      name: 'Vorthurion',
      title: 'Tempestade do Deserto',
      domain: 'blue',
      avatarCardId: 'blue_06_dragao_azul',
    },
    steps: [
      {
        stepIndex: 1,
        turnLabel: 'TURNO 4 • PREPARAÇÃO DO COMBO',
        phaseBadge: 'MOTOR DE RELÍQUIAS [R]',
        comboTitle: 'Orbe do Sol Aprisionado + Piromante na Retaguarda',
        narrative:
          'Igniskar instala o Orbe do Sol Aprisionado (#166) e o Piromante na Retaguarda [R] com Cobertura (+1⚔️). Vorthurion arma uma Emboscada Oculta e o Cetro Astral.',
        sfx: 'summon',
        musicStage: 'tactical',
        musicDomain: 'red',
        spotlightCardId: 'red_166_coroa_imperador_vulcao',
        spotlightLabel: 'RELÍQUIA LENDÁRIA #166 EM CAMPO',
        playerHp: 36,
        playerEssence: '6/6⚡',
        playerAffinity: '5/6 🔥',
        enemyHp: 34,
        enemyEssence: '6/6⚡',
        enemyAffinity: '5/6 ❄️',
        domainState: {
          mode: 'none',
          domain: 'red',
          name: 'Mesa de Guerra',
          effectSummary: 'Ambos os Soberanos a 1 ponto da Expansão de Domínio (5/6)',
        },
        enemyRearguard: [
          { cardId: 'blue_166_trono_oniciencia_astral', atk: 0, hp: 5, maxHp: 5 },
          { cardId: 'blue_144_espelho_geada', atk: 0, hp: 1, maxHp: 1, isTrapHidden: true },
          { cardId: 'blue_152_arquimago_vortice', atk: 4, hp: 5, maxHp: 5, armor: 2 },
          null,
        ],
        enemyVanguard: [
          { cardId: 'blue_116_kraken_tempestade', atk: 6, hp: 7, maxHp: 7, armor: 2 },
          { cardId: 'blue_131_cavaleiro_geada_real', atk: 3, hp: 5, maxHp: 5, armor: 1 },
          null,
          null,
        ],
        playerVanguard: [
          {
            cardId: 'red_153_elemental_fornalha_viva',
            atk: 5,
            hp: 5,
            maxHp: 5,
            floatingText: '+1⚔️ COBERTURA',
            floatingColor: '#fde047',
          },
          { cardId: 'red_115_centuriao_obsidiana', atk: 4, hp: 6, maxHp: 6, armor: 1, stackCount: 2 },
          null,
          null,
        ],
        playerRearguard: [
          {
            cardId: 'red_166_coroa_imperador_vulcao',
            atk: 0,
            hp: 5,
            maxHp: 5,
            floatingText: '🔥 MOTOR ATIVO',
            floatingColor: '#fb923c',
          },
          { cardId: 'red_97_lancador_chamas', atk: 4, hp: 4, maxHp: 4 },
          { cardId: 'red_107_fornalha_draconica', atk: 0, hp: 4, maxHp: 4 },
          null,
        ],
      },
      {
        stepIndex: 2,
        turnLabel: 'TURNO 5 • EMBOSCADA & ASCENSÃO ★',
        phaseBadge: '★ ASCENSÃO EM CAMPO',
        comboTitle: 'Emboscada Revelada vs. Titã da Fornalha Solar (★)',
        narrative:
          'Vorthurion revela a Emboscada Espelho Congelante, mas Igniskar paga 4⚡ para Ascender a Quimera em ★ Titã da Fornalha Solar (8/8, Sopro Dracônico 2)!',
        sfx: 'ascend',
        musicStage: 'battle',
        musicDomain: 'red',
        spotlightCardId: 'red_153_elemental_fornalha_viva',
        spotlightLabel: '★ ASCENSÃO: TITÃ DA FORNALHA (8/8)',
        playerHp: 36,
        playerEssence: '4/7⚡',
        playerAffinity: '6/6 🔥',
        enemyHp: 31,
        enemyEssence: '6/6⚡',
        enemyAffinity: '6/6 ❄️',
        domainState: {
          mode: 'none',
          domain: 'red',
          name: 'Mesa de Guerra',
          effectSummary: 'Afinidade 6/6 atingida! Ritual de Expansão de Domínio disponível.',
        },
        enemyRearguard: [
          { cardId: 'blue_166_trono_oniciencia_astral', atk: 0, hp: 5, maxHp: 5 },
          {
            cardId: 'blue_144_espelho_geada',
            atk: 0,
            hp: 1,
            maxHp: 1,
            isTrapRevealed: true,
            floatingText: '⚠️ EMBOSCADA!',
            floatingColor: '#38bdf8',
          },
          { cardId: 'blue_152_arquimago_vortice', atk: 4, hp: 5, maxHp: 5, armor: 2 },
          null,
        ],
        enemyVanguard: [
          { cardId: 'blue_116_kraken_tempestade', atk: 6, hp: 7, maxHp: 7, armor: 2, hasShield: true },
          { cardId: 'blue_131_cavaleiro_geada_real', atk: 3, hp: 5, maxHp: 5, armor: 1 },
          null,
          null,
        ],
        playerVanguard: [
          {
            cardId: 'red_153_elemental_fornalha_viva',
            atk: 8,
            hp: 8,
            maxHp: 8,
            armor: 2,
            isAscended: true,
            ascendedName: '★ Titã da Fornalha Solar',
            floatingText: '★ ASCENSÃO 8/8!',
            floatingColor: '#fde047',
          },
          { cardId: 'red_115_centuriao_obsidiana', atk: 4, hp: 6, maxHp: 6, armor: 1, isFrozen: true, stackCount: 2 },
          null,
          null,
        ],
        playerRearguard: [
          { cardId: 'red_166_coroa_imperador_vulcao', atk: 0, hp: 5, maxHp: 5 },
          { cardId: 'red_97_lancador_chamas', atk: 4, hp: 4, maxHp: 4 },
          { cardId: 'red_107_fornalha_draconica', atk: 0, hp: 4, maxHp: 4 },
          null,
        ],
      },
      {
        stepIndex: 3,
        turnLabel: 'TURNO 6 • EXPANSÃO DE DOMÍNIO (⛩️ 6/6)',
        phaseBadge: '⛩️ EXPANSÃO DE DOMÍNIO',
        comboTitle: '⛩️ Caldeira do Sol Carmesim (Potencial 120% + Acerto Garantido)',
        narrative:
          'Com 6/6 de Afinidade e 3⚡, Igniskar manifesta a Caldeira do Sol Carmesim! A mesa de madeira transforma-se em magma vivo (+2 ATQ a todos os aliados e queima de 2🔥 por turno).',
        sfx: 'channel',
        musicStage: 'domain_clash',
        musicDomain: 'red',
        spotlightCardId: 'red_08_dragao_vermelho',
        spotlightLabel: '⛩️ EXPANSÃO: CALDEIRA DO SOL CARMESIM',
        playerHp: 36,
        playerEssence: '5/8⚡',
        playerAffinity: '⛩️ ATIVO (3T)',
        enemyHp: 27,
        enemyEssence: '7/7⚡',
        enemyAffinity: '6/6 ❄️',
        domainState: {
          mode: 'single',
          owner: 'player',
          domain: 'red',
          name: '⛩️ Caldeira do Sol Carmesim',
          effectSummary: 'Potencial 120% (+2⚔️ ATQ às tropas Rubras) + Acerto Garantido ativo!',
        },
        enemyRearguard: [
          { cardId: 'blue_166_trono_oniciencia_astral', atk: 0, hp: 5, maxHp: 5 },
          null,
          { cardId: 'blue_152_arquimago_vortice', atk: 4, hp: 5, maxHp: 5, armor: 2 },
          null,
        ],
        enemyVanguard: [
          {
            cardId: 'blue_116_kraken_tempestade',
            atk: 6,
            hp: 5,
            maxHp: 7,
            armor: 2,
            isHit: true,
            floatingText: '-2 🔥 PULSO',
            floatingColor: '#f87171',
          },
          {
            cardId: 'blue_131_cavaleiro_geada_real',
            atk: 3,
            hp: 3,
            maxHp: 5,
            armor: 1,
            isHit: true,
            floatingText: '-2 🔥 PULSO',
            floatingColor: '#f87171',
          },
          null,
          null,
        ],
        playerVanguard: [
          {
            cardId: 'red_153_elemental_fornalha_viva',
            atk: 10,
            hp: 8,
            maxHp: 8,
            armor: 2,
            isAscended: true,
            floatingText: '+2⚔️ DOMÍNIO',
            floatingColor: '#fb923c',
          },
          {
            cardId: 'red_115_centuriao_obsidiana',
            atk: 6,
            hp: 6,
            maxHp: 6,
            armor: 1,
            stackCount: 2,
            floatingText: '+2⚔️ DOMÍNIO',
            floatingColor: '#fb923c',
          },
          null,
          null,
        ],
        playerRearguard: [
          { cardId: 'red_166_coroa_imperador_vulcao', atk: 0, hp: 5, maxHp: 5 },
          { cardId: 'red_97_lancador_chamas', atk: 6, hp: 4, maxHp: 4 },
          { cardId: 'red_107_fornalha_draconica', atk: 0, hp: 4, maxHp: 4 },
          null,
        ],
      },
      {
        stepIndex: 4,
        turnLabel: 'TURNO 6 (RIVAL) • CHOQUE DE DOMÍNIOS 50/50!',
        phaseBadge: '⚡ CHOQUE DE DOMÍNIOS 50/50',
        comboTitle: 'Caldeira do Sol Carmesim ⚡ Vazio Infinito de Cronos',
        narrative:
          'Vorthurion responde expandindo o Vazio Infinito de Cronos (6/6) e invocando o Dragão de Safira Sônico (#154)! O tabuleiro divide-se ao meio em um Choque 50/50!',
        sfx: 'freeze',
        musicStage: 'domain_clash',
        musicDomain: 'blue',
        spotlightCardId: 'blue_154_dragao_safira_soberano',
        spotlightLabel: '⚡ CHOQUE DE DOMÍNIOS 50/50!',
        playerHp: 33,
        playerEssence: '8/8⚡',
        playerAffinity: '⛩️ CHOQUE 50/50',
        enemyHp: 27,
        enemyEssence: '2/8⚡',
        enemyAffinity: '⛩️ CHOQUE 50/50',
        domainState: {
          mode: 'clash_50_50',
          owner: 'player',
          domain: 'red',
          name: 'Caldeira do Sol Carmesim',
          rivalDomain: 'blue',
          rivalName: 'Vazio Infinito de Cronos',
          effectSummary: 'CHOQUE 50/50: Acerto Garantido anulado! Cause 8+ dano ao Soberano para quebrar o Domínio rival!',
        },
        enemyRearguard: [
          { cardId: 'blue_166_trono_oniciencia_astral', atk: 0, hp: 5, maxHp: 5 },
          { cardId: 'blue_152_arquimago_vortice', atk: 5, hp: 5, maxHp: 5, armor: 2 },
          null,
          null,
        ],
        enemyVanguard: [
          { cardId: 'blue_116_kraken_tempestade', atk: 7, hp: 5, maxHp: 7, armor: 2 },
          {
            cardId: 'blue_154_dragao_safira_soberano',
            atk: 9,
            hp: 8,
            maxHp: 8,
            armor: 2,
            floatingText: '❄️ SOPRO SÔNICO 3',
            floatingColor: '#38bdf8',
          },
          { cardId: 'blue_131_cavaleiro_geada_real', atk: 4, hp: 3, maxHp: 5, armor: 1 },
          null,
        ],
        playerVanguard: [
          {
            cardId: 'red_153_elemental_fornalha_viva',
            atk: 10,
            hp: 6,
            maxHp: 8,
            armor: 2,
            isAscended: true,
            isFrozen: true,
            floatingText: '❄️ CONGELADO',
            floatingColor: '#38bdf8',
          },
          { cardId: 'red_115_centuriao_obsidiana', atk: 8, hp: 4, maxHp: 6, armor: 1, stackCount: 2 },
          null,
          null,
        ],
        playerRearguard: [
          { cardId: 'red_166_coroa_imperador_vulcao', atk: 0, hp: 5, maxHp: 5 },
          { cardId: 'red_97_lancador_chamas', atk: 6, hp: 4, maxHp: 4 },
          { cardId: 'red_107_fornalha_draconica', atk: 0, hp: 4, maxHp: 4 },
          null,
        ],
      },
      {
        stepIndex: 5,
        turnLabel: 'TURNO 7 • COMBO SUPERNOVA & QUEBRA DE DOMÍNIO!',
        phaseBadge: '🔥 COMBO EM CADEIA',
        comboTitle: 'Detonação do Sol Carmesim (#123) + Gatilhos de Fornalha',
        narrative:
          'Igniskar conjura Detonação do Sol Carmesim! O feitiço causa 5🔥 a todos os inimigos e dispara o Piromante + Fornalha (-9💥 no Soberano rival), estilhaçando o Domínio Azul!',
        sfx: 'spell',
        musicStage: 'climax',
        musicDomain: 'red',
        spotlightCardId: 'red_123_cataclismo_solar',
        spotlightLabel: '💥 QUEBRA DE DOMÍNIO (-9 NO SOBERANO!)',
        playerHp: 33,
        playerEssence: '3/9⚡',
        playerAffinity: '⛩️ SOBERANIA RUBRA',
        enemyHp: 14,
        enemyEssence: '2/8⚡',
        enemyAffinity: '💔 ESTILHAÇADO!',
        domainState: {
          mode: 'single',
          owner: 'player',
          domain: 'red',
          name: '⛩️ Caldeira do Sol Carmesim (Domínio Rival Estilhaçado!)',
          effectSummary: 'O Domínio inimigo colapsou após sofrer 9 de dano! Acerto Garantido restaurado!',
        },
        enemyRearguard: [
          { cardId: 'blue_166_trono_oniciencia_astral', atk: 0, hp: 2, maxHp: 5, isHit: true },
          {
            cardId: 'blue_152_arquimago_vortice',
            atk: 5,
            hp: 1,
            maxHp: 5,
            armor: 2,
            isHit: true,
            floatingText: '-5 🔥 SOLAR',
            floatingColor: '#ef4444',
          },
          null,
          null,
        ],
        enemyVanguard: [
          null,
          {
            cardId: 'blue_154_dragao_safira_soberano',
            atk: 9,
            hp: 3,
            maxHp: 8,
            armor: 2,
            isHit: true,
            floatingText: '-5 🔥 CATACLISMO',
            floatingColor: '#ef4444',
          },
          null,
          null,
        ],
        playerVanguard: [
          {
            cardId: 'red_153_elemental_fornalha_viva',
            atk: 10,
            hp: 6,
            maxHp: 8,
            armor: 2,
            isAscended: true,
          },
          { cardId: 'red_115_centuriao_obsidiana', atk: 8, hp: 4, maxHp: 6, armor: 1, stackCount: 2 },
          null,
          null,
        ],
        playerRearguard: [
          {
            cardId: 'red_166_coroa_imperador_vulcao',
            atk: 0,
            hp: 5,
            maxHp: 5,
            floatingText: '+2🔥 GATILHO',
            floatingColor: '#fde047',
          },
          {
            cardId: 'red_97_lancador_chamas',
            atk: 6,
            hp: 4,
            maxHp: 4,
            floatingText: '+2🔥 GATILHO',
            floatingColor: '#fde047',
          },
          {
            cardId: 'red_107_fornalha_draconica',
            atk: 0,
            hp: 4,
            maxHp: 4,
            floatingText: '+2🔥 GATILHO',
            floatingColor: '#fde047',
          },
          null,
        ],
      },
      {
        stepIndex: 6,
        turnLabel: 'TURNO 7 • EXECUÇÃO SOBERANA (SOPRO 3)',
        phaseBadge: '👑 VITÓRIA POR COMBO',
        comboTitle: 'Vulcanis (#157) + Investida com Acerto Garantido',
        narrative:
          'Vulcanis, Titã da Bigorna Primordial (#157) desce partindo a linha rival com Sopro Vulcânico 3 e o Titã Ascendido desfere o golpe final com Acerto Garantido (0❤️)!',
        sfx: 'victory',
        musicStage: 'climax',
        musicDomain: 'red',
        spotlightCardId: 'red_157_dragao_tiamat_carmesim',
        spotlightLabel: '👑 VITÓRIA DE IGNISKAR (-14 LETAL!)',
        playerHp: 33,
        playerEssence: '0/9⚡',
        playerAffinity: '⛩️ VITÓRIA',
        enemyHp: 0,
        enemyEssence: '0/8⚡',
        enemyAffinity: '0❤️ DERROTADO',
        domainState: {
          mode: 'single',
          owner: 'player',
          domain: 'red',
          name: '👑 TRIUNFO: CALDEIRA DO SOL CARMESIM',
          effectSummary: 'Soberano rival reduzido a 0❤️! Recompensa: +10 Ouro & +Reputação.',
        },
        enemyRearguard: [null, null, null, null],
        enemyVanguard: [null, null, null, null],
        playerVanguard: [
          {
            cardId: 'red_153_elemental_fornalha_viva',
            atk: 10,
            hp: 6,
            maxHp: 8,
            armor: 2,
            isAscended: true,
            isAttacking: true,
            floatingText: '⚔️ -10 DIRETO!',
            floatingColor: '#fde047',
          },
          {
            cardId: 'red_157_dragao_tiamat_carmesim',
            atk: 10,
            hp: 9,
            maxHp: 9,
            armor: 2,
            isAttacking: true,
            floatingText: '🌋 SOPRO VULCÂNICO 3!',
            floatingColor: '#ef4444',
          },
          { cardId: 'red_115_centuriao_obsidiana', atk: 8, hp: 4, maxHp: 6, armor: 1, stackCount: 2 },
          null,
        ],
        playerRearguard: [
          { cardId: 'red_166_coroa_imperador_vulcao', atk: 0, hp: 5, maxHp: 5 },
          { cardId: 'red_97_lancador_chamas', atk: 6, hp: 4, maxHp: 4 },
          { cardId: 'red_107_fornalha_draconica', atk: 0, hp: 4, maxHp: 4 },
          null,
        ],
      },
    ],
  },

  // =========================================================================
  // CENÁRIO 2: ABISMO vs ORDEM (SOBREPOSIÇÃO DE DOMÍNIO & CRIPTA IMORTAL)
  // =========================================================================
  {
    id: 'duel_purple_vs_gold_crypt',
    shortTabLabel: '💀 vs ☀️ Cripta & Sol',
    title: 'Catedral das Almas vs. Corte de Hyperion',
    subtitle: 'Combo Eclipse Abissal + Ascensão Vampírica + Sobreposição de Domínio (7/6 > 6/6)',
    comboBadge: 'COMBO: VISAGEM DA PESTE (#166) + ECLIPSE ABISSAL',
    playerSovereign: {
      name: 'Vesperion',
      title: 'Arquimago Lich Imortal',
      domain: 'purple',
      avatarCardId: 'purple_07_lich',
    },
    enemySovereign: {
      name: 'Hyperion',
      title: 'Deus-Imperador da Aurora',
      domain: 'gold',
      avatarCardId: 'gold_138_imperador_sol_supremo',
    },
    steps: [
      {
        stepIndex: 1,
        turnLabel: 'TURNO 4 • PACTO & CATEDRAL NEGRA',
        phaseBadge: 'ACELERAÇÃO UMBRAL',
        comboTitle: 'Pacto de Sangue (#104) + Visagem do Dragão da Peste (#166)',
        narrative:
          'Hyperion ergue uma falange com Escudo Divino. Vesperion lança Pacto de Sangue (+2⚡) para instalar a Visagem do Dragão da Peste (#166) e o Campanário dos Mortos.',
        sfx: 'channel',
        musicStage: 'tactical',
        musicDomain: 'purple',
        spotlightCardId: 'purple_166_altar_ceifador_supremo',
        spotlightLabel: 'VISAGEM DO DRAGÃO DA PESTE (#166)',
        playerHp: 35,
        playerEssence: '6/6⚡',
        playerAffinity: '5/6 💀',
        enemyHp: 38,
        enemyEssence: '6/6⚡',
        enemyAffinity: '6/6 ☀️',
        domainState: {
          mode: 'none',
          domain: 'purple',
          name: 'Mesa de Guerra',
          effectSummary: 'Visagem da Peste pronta para corroer os Escudos Divinos dourados.',
        },
        enemyRearguard: [
          { cardId: 'gold_146_trono_imperador_eterno', atk: 0, hp: 5, maxHp: 5 },
          { cardId: 'gold_166_trono_soberano_sol', atk: 0, hp: 5, maxHp: 5 },
          null,
          null,
        ],
        enemyVanguard: [
          { cardId: 'gold_118_colosso_sol_invicto', atk: 6, hp: 7, maxHp: 7, armor: 2, hasShield: true },
          { cardId: 'gold_116_centuriao_forja_dourada', atk: 5, hp: 6, maxHp: 6, armor: 2, hasShield: true },
          null,
          null,
        ],
        playerVanguard: [
          { cardId: 'purple_155_lorde_vampiro_soberano', atk: 6, hp: 6, maxHp: 6, armor: 1 },
          { cardId: 'purple_115_golem_ossario', atk: 4, hp: 6, maxHp: 6, armor: 2, stackCount: 2 },
          null,
          null,
        ],
        playerRearguard: [
          {
            cardId: 'purple_166_altar_ceifador_supremo',
            atk: 0,
            hp: 5,
            maxHp: 5,
            floatingText: '☠️ MIASMA ATIVO',
            floatingColor: '#c084fc',
          },
          { cardId: 'purple_126_campanario_mortos', atk: 0, hp: 4, maxHp: 4 },
          null,
          null,
        ],
      },
      {
        stepIndex: 2,
        turnLabel: 'TURNO 5 • EXPANSÃO SOLAR RIVAL & ASCENSÃO ★',
        phaseBadge: '⛩️ DOMÍNIO RIVAL vs ★ ASCENSÃO',
        comboTitle: 'Tribunal Dourado (6/6) vs. ★ Patriarca Imortal da Noite',
        narrative:
          'Hyperion expande o Tribunal da Sentença Dourada (6/6)! Vesperion responde Ascendendo o Ceifador do Eclipse em ★ Patriarca Imortal da Noite (9/9, Dreno de Vida)!',
        sfx: 'ascend',
        musicStage: 'domain_clash',
        musicDomain: 'gold',
        spotlightCardId: 'purple_155_lorde_vampiro_soberano',
        spotlightLabel: '★ PATRIARCA IMORTAL DA NOITE (9/9)',
        playerHp: 38,
        playerEssence: '5/7⚡',
        playerAffinity: '6/6 💀',
        enemyHp: 34,
        enemyEssence: '4/7⚡',
        enemyAffinity: '⛩️ ATIVO (6/6)',
        domainState: {
          mode: 'single',
          owner: 'enemy',
          domain: 'gold',
          name: '⛩️ Tribunal da Sentença Dourada (Rival)',
          effectSummary: 'O oponente ativou Expansão de Domínio! Canalize +1 carta para sobrepujar com 7/6!',
        },
        enemyRearguard: [
          { cardId: 'gold_146_trono_imperador_eterno', atk: 0, hp: 5, maxHp: 5 },
          { cardId: 'gold_166_trono_soberano_sol', atk: 0, hp: 5, maxHp: 5 },
          null,
          null,
        ],
        enemyVanguard: [
          { cardId: 'gold_118_colosso_sol_invicto', atk: 7, hp: 7, maxHp: 7, armor: 3, hasShield: true },
          { cardId: 'gold_116_centuriao_forja_dourada', atk: 6, hp: 6, maxHp: 6, armor: 3, hasShield: true },
          { cardId: 'gold_138_imperador_sol_supremo', atk: 8, hp: 8, maxHp: 8, armor: 2, hasShield: true },
          null,
        ],
        playerVanguard: [
          {
            cardId: 'purple_155_lorde_vampiro_soberano',
            atk: 9,
            hp: 9,
            maxHp: 9,
            armor: 2,
            isAscended: true,
            floatingText: '★ ASCENSÃO 9/9!',
            floatingColor: '#e879f9',
          },
          { cardId: 'purple_115_golem_ossario', atk: 4, hp: 6, maxHp: 6, armor: 2, stackCount: 2 },
          null,
          null,
        ],
        playerRearguard: [
          { cardId: 'purple_166_altar_ceifador_supremo', atk: 0, hp: 5, maxHp: 5 },
          { cardId: 'purple_126_campanario_mortos', atk: 0, hp: 4, maxHp: 4 },
          null,
          null,
        ],
      },
      {
        stepIndex: 3,
        turnLabel: 'TURNO 6 • QUEBRA DE ESCUDOS & ECLIPSE ABISSAL',
        phaseBadge: '💀 COMBO DE ERRADICAÇÃO',
        comboTitle: 'Visagem da Peste (-2 em área) + Eclipse do Sol Abissal (#123)',
        narrative:
          'No início do turno, a Visagem da Peste estoura todos os Escudos Divinos! Em seguida, Eclipse do Sol Abissal varre a fileira desprotegida (-4💀) e drena +4❤️ do Soberano!',
        sfx: 'spell',
        musicStage: 'domain_clash',
        musicDomain: 'purple',
        spotlightCardId: 'purple_123_eclipse_abissal',
        spotlightLabel: '🌑 ECLIPSE DO SOL ABISSAL (-4 EM ÁREA)',
        playerHp: 40,
        playerEssence: '3/8⚡',
        playerAffinity: '7/6 💀',
        enemyHp: 26,
        enemyEssence: '4/7⚡',
        enemyAffinity: '⛩️ ATIVO (6/6)',
        domainState: {
          mode: 'single',
          owner: 'enemy',
          domain: 'gold',
          name: '⛩️ Tribunal da Sentença Dourada (Escudos Rompidos!)',
          effectSummary: 'Combo Umbral removeu os Escudos Divinos antes do impacto do Feitiço Lendário!',
        },
        enemyRearguard: [
          { cardId: 'gold_146_trono_imperador_eterno', atk: 0, hp: 3, maxHp: 5, isHit: true },
          { cardId: 'gold_166_trono_soberano_sol', atk: 0, hp: 3, maxHp: 5, isHit: true },
          null,
          null,
        ],
        enemyVanguard: [
          {
            cardId: 'gold_118_colosso_sol_invicto',
            atk: 7,
            hp: 3,
            maxHp: 7,
            armor: 3,
            isHit: true,
            floatingText: '💔 ESCUDO QUEBRADO -4',
            floatingColor: '#c084fc',
          },
          {
            cardId: 'gold_116_centuriao_forja_dourada',
            atk: 6,
            hp: 2,
            maxHp: 6,
            armor: 3,
            isHit: true,
            floatingText: '-4 💀 ECLIPSE',
            floatingColor: '#c084fc',
          },
          {
            cardId: 'gold_138_imperador_sol_supremo',
            atk: 8,
            hp: 4,
            maxHp: 8,
            armor: 2,
            isHit: true,
            floatingText: '-4 💀 ECLIPSE',
            floatingColor: '#c084fc',
          },
          null,
        ],
        playerVanguard: [
          { cardId: 'purple_155_lorde_vampiro_soberano', atk: 9, hp: 9, maxHp: 9, armor: 2, isAscended: true },
          { cardId: 'purple_115_golem_ossario', atk: 5, hp: 7, maxHp: 7, armor: 2, stackCount: 2 },
          null,
          null,
        ],
        playerRearguard: [
          {
            cardId: 'purple_166_altar_ceifador_supremo',
            atk: 0,
            hp: 5,
            maxHp: 5,
            floatingText: '☠️ QUEBROU ESCUDOS!',
            floatingColor: '#fde047',
          },
          {
            cardId: 'purple_126_campanario_mortos',
            atk: 0,
            hp: 4,
            maxHp: 4,
            floatingText: '+2❤️ DRENO REAL',
            floatingColor: '#4ade80',
          },
          null,
          null,
        ],
      },
      {
        stepIndex: 4,
        turnLabel: 'TURNO 6 • SOBREPOSIÇÃO DE DOMÍNIO (7/6 > 6/6)!',
        phaseBadge: '⛩️ ESMAGAMENTO DE DOMÍNIO',
        comboTitle: '⛩️ Santuário Malevolente das Almas Sobrepõe o Tribunal!',
        narrative:
          'Com 7 de Afinidade Umbral contra 6 de Hyperion, Vesperion invoca o Santuário Malevolente das Almas! O domínio maior esmaga o menor instantaneamente!',
        sfx: 'hit',
        musicStage: 'climax',
        musicDomain: 'purple',
        spotlightCardId: 'purple_07_lich',
        spotlightLabel: '⛩️ SANTUÁRIO MALEVOLENTE (7/6 > 6/6)',
        playerHp: 40,
        playerEssence: '0/8⚡',
        playerAffinity: '⛩️ SUPREMO (7/6)',
        enemyHp: 12,
        enemyEssence: '4/7⚡',
        enemyAffinity: '💔 ESMAGADO!',
        domainState: {
          mode: 'single',
          owner: 'player',
          domain: 'purple',
          name: '⛩️ Santuário Malevolente das Almas',
          effectSummary: 'Afinidade 7/6 sobrepujou 6/6! +2⚔️ ATQ, Dreno de Vida e Acerto Garantido!',
        },
        enemyRearguard: [
          { cardId: 'gold_146_trono_imperador_eterno', atk: 0, hp: 3, maxHp: 5 },
          null,
          null,
          null,
        ],
        enemyVanguard: [
          null,
          null,
          {
            cardId: 'gold_138_imperador_sol_supremo',
            atk: 8,
            hp: 2,
            maxHp: 8,
            armor: 2,
            isHit: true,
            floatingText: '-2 💀 SANTUÁRIO',
            floatingColor: '#e879f9',
          },
          null,
        ],
        playerVanguard: [
          {
            cardId: 'purple_155_lorde_vampiro_soberano',
            atk: 11,
            hp: 9,
            maxHp: 9,
            armor: 2,
            isAscended: true,
            floatingText: '+2⚔️ POTENCIAL 120%',
            floatingColor: '#e879f9',
          },
          { cardId: 'purple_115_golem_ossario', atk: 7, hp: 7, maxHp: 7, armor: 2, stackCount: 2 },
          null,
          null,
        ],
        playerRearguard: [
          { cardId: 'purple_166_altar_ceifador_supremo', atk: 0, hp: 5, maxHp: 5 },
          { cardId: 'purple_126_campanario_mortos', atk: 0, hp: 4, maxHp: 4 },
          null,
          null,
        ],
      },
      {
        stepIndex: 5,
        turnLabel: 'TURNO 7 • MONARCA DOS TRÊS CRÂNIOS & CEIFA FINAL',
        phaseBadge: '👑 VITÓRIA UMBRAL',
        comboTitle: 'Monarca dos Três Crânios (#157) + Sopro de Morte 3',
        narrative:
          'O Monarca dos Três Crânios (#157) surge com Sopro de Morte 3 e o Patriarca Imortal ataca diretamente o Soberano rival com Acerto Garantido (40❤️ vs 0❤️)!',
        sfx: 'victory',
        musicStage: 'climax',
        musicDomain: 'purple',
        spotlightCardId: 'purple_157_dragao_sombra_abissal',
        spotlightLabel: '👑 VITÓRIA IMORTAL (40❤️ INTACTO!)',
        playerHp: 40,
        playerEssence: '1/9⚡',
        playerAffinity: '⛩️ VITÓRIA',
        enemyHp: 0,
        enemyEssence: '0/8⚡',
        enemyAffinity: '0❤️ DERROTADO',
        domainState: {
          mode: 'single',
          owner: 'player',
          domain: 'purple',
          name: '👑 TRIUNFO: SANTUÁRIO MALEVOLENTE DAS ALMAS',
          effectSummary: 'Dreno contínuo manteve Vesperion com 40/40❤️ enquanto zerava o Soberano rival!',
        },
        enemyRearguard: [null, null, null, null],
        enemyVanguard: [null, null, null, null],
        playerVanguard: [
          {
            cardId: 'purple_155_lorde_vampiro_soberano',
            atk: 11,
            hp: 9,
            maxHp: 9,
            armor: 2,
            isAscended: true,
            isAttacking: true,
            floatingText: '🩸 -11 LETAL!',
            floatingColor: '#e879f9',
          },
          {
            cardId: 'purple_157_dragao_sombra_abissal',
            atk: 11,
            hp: 9,
            maxHp: 9,
            armor: 2,
            isAttacking: true,
            floatingText: '☠️ SOPRO DE MORTE 3!',
            floatingColor: '#c084fc',
          },
          { cardId: 'purple_115_golem_ossario', atk: 7, hp: 7, maxHp: 7, armor: 2, stackCount: 2 },
          null,
        ],
        playerRearguard: [
          { cardId: 'purple_166_altar_ceifador_supremo', atk: 0, hp: 5, maxHp: 5 },
          { cardId: 'purple_126_campanario_mortos', atk: 0, hp: 4, maxHp: 4 },
          null,
          null,
        ],
      },
    ],
  },

  // =========================================================================
  // CENÁRIO 3: CONVERGÊNCIA PENTACROMÁTICA (5 TRONOS #166 & VALKYRA)
  // =========================================================================
  {
    id: 'duel_poly_five_thrones',
    shortTabLabel: '🌈 5 Cores & Valkyra',
    title: 'Convergência dos Tronos (#166) & Valkyra',
    subtitle: 'Combo Pentacromático de Relíquias #166 + Mar de Árvores Primordial + Sopro 4',
    comboBadge: 'COMBO: TRONOS SOBERANOS (#166) + IMPERATRIZ VALKYRA',
    playerSovereign: {
      name: 'Valkyra',
      title: 'Imperatriz Pentacromática',
      domain: 'green',
      avatarCardId: 'neutral_10_valkyra_pentacromatica',
    },
    enemySovereign: {
      name: 'Baelgor',
      title: 'Senhor do Fosso Ardente',
      domain: 'red',
      avatarCardId: 'red_22_tirano_fogo',
    },
    steps: [
      {
        stepIndex: 1,
        turnLabel: 'TURNO 4 • CONVERGÊNCIA DOS TRONOS (#166)',
        phaseBadge: '🌈 SINERGIA PENTACROMÁTICA',
        comboTitle: 'Totem Urso (#166) + Diadema Orbital (#166) + Cetro Astral (#166)',
        narrative:
          'Valkyra alinha 3 Tronos Soberanos #166 na Retaguarda! Todo início de turno gera +2⚡ extras, compra +1 carta, concede Escudo Divino, congela 1 inimigo e cura +2❤️ em todos!',
        sfx: 'channel',
        musicStage: 'tactical',
        musicDomain: 'green',
        spotlightCardId: 'gold_166_trono_soberano_sol',
        spotlightLabel: 'CONVERGÊNCIA DOS TRONOS #166',
        playerHp: 39,
        playerEssence: '8/6⚡',
        playerAffinity: '5/6 🌿✨❄️',
        enemyHp: 34,
        enemyEssence: '6/6⚡',
        enemyAffinity: '5/6 🔥💀',
        domainState: {
          mode: 'none',
          domain: 'green',
          name: 'Mesa de Guerra',
          effectSummary: 'Motor Pentacromático ativo na Retaguarda (+2⚡, Escudo Divino e Cura global/turno).',
        },
        enemyRearguard: [
          { cardId: 'red_146_coroa_chama_eterna', atk: 0, hp: 4, maxHp: 4 },
          { cardId: 'purple_145_orgao_catedrais_negras', atk: 0, hp: 4, maxHp: 4 },
          null,
          null,
        ],
        enemyVanguard: [
          { cardId: 'red_138_colosso_vulcano_primordial', atk: 7, hp: 7, maxHp: 7, armor: 1 },
          { cardId: 'purple_138_soberano_carnica', atk: 7, hp: 7, maxHp: 7, armor: 1 },
          null,
          null,
        ],
        playerVanguard: [
          {
            cardId: 'green_160_behemoth_cratera_viva',
            atk: 7,
            hp: 9,
            maxHp: 9,
            armor: 3,
            hasShield: true,
            floatingText: '✨ ESCUDO +2❤️',
            floatingColor: '#fde047',
          },
          {
            cardId: 'green_141_soberano_fera_primordial',
            atk: 8,
            hp: 7,
            maxHp: 7,
            hasShield: true,
          },
          null,
          null,
        ],
        playerRearguard: [
          { cardId: 'green_166_coracao_arvore_mundo', atk: 0, hp: 5, maxHp: 5 },
          { cardId: 'gold_166_trono_soberano_sol', atk: 0, hp: 5, maxHp: 5 },
          { cardId: 'blue_166_trono_oniciencia_astral', atk: 0, hp: 5, maxHp: 5 },
          { cardId: 'neutral_166_protocolo_torre_axial', atk: 0, hp: 1, maxHp: 1, isTrapHidden: true },
        ],
      },
      {
        stepIndex: 2,
        turnLabel: 'TURNO 5 • EMBOSCADA DA TORRE AXIAL (#166)',
        phaseBadge: '⚠️ REAÇÃO PENTACROMÁTICA',
        comboTitle: 'Decreto de Paz Armada da Torre (#166) Trava o Ataque Rival!',
        narrative:
          'Quando Baelgor avança com seus dois colossos, a Emboscada Decreto de Paz Armada (#166) dispara: congela toda a Vanguarda inimiga, compra 2 cartas e restaura +3❤️!',
        sfx: 'freeze',
        musicStage: 'battle',
        musicDomain: 'blue',
        spotlightCardId: 'neutral_166_protocolo_torre_axial',
        spotlightLabel: '⚠️ EMBOSCADA: CONGELAMENTO TOTAL!',
        playerHp: 40,
        playerEssence: '8/7⚡',
        playerAffinity: '6/6 🌿✨',
        enemyHp: 32,
        enemyEssence: '6/7⚡',
        enemyAffinity: '5/6 🔥💀',
        domainState: {
          mode: 'none',
          domain: 'green',
          name: 'Mesa de Guerra',
          effectSummary: 'Toda a Vanguarda inimiga está Congelada! Caminho livre para a Expansão.',
        },
        enemyRearguard: [
          { cardId: 'red_146_coroa_chama_eterna', atk: 0, hp: 4, maxHp: 4 },
          { cardId: 'purple_145_orgao_catedrais_negras', atk: 0, hp: 4, maxHp: 4 },
          null,
          null,
        ],
        enemyVanguard: [
          {
            cardId: 'red_138_colosso_vulcano_primordial',
            atk: 7,
            hp: 7,
            maxHp: 7,
            isFrozen: true,
            floatingText: '❄️ CONGELADO',
            floatingColor: '#38bdf8',
          },
          {
            cardId: 'purple_138_soberano_carnica',
            atk: 7,
            hp: 7,
            maxHp: 7,
            isFrozen: true,
            floatingText: '❄️ CONGELADO',
            floatingColor: '#38bdf8',
          },
          null,
          null,
        ],
        playerVanguard: [
          { cardId: 'green_160_behemoth_cratera_viva', atk: 8, hp: 10, maxHp: 10, armor: 3, hasShield: true },
          { cardId: 'green_141_soberano_fera_primordial', atk: 9, hp: 8, maxHp: 8, hasShield: true },
          null,
          null,
        ],
        playerRearguard: [
          { cardId: 'green_166_coracao_arvore_mundo', atk: 0, hp: 5, maxHp: 5 },
          { cardId: 'gold_166_trono_soberano_sol', atk: 0, hp: 5, maxHp: 5 },
          { cardId: 'blue_166_trono_oniciencia_astral', atk: 0, hp: 5, maxHp: 5 },
          {
            cardId: 'neutral_166_protocolo_torre_axial',
            atk: 0,
            hp: 1,
            maxHp: 1,
            isTrapRevealed: true,
            floatingText: '⚠️ PAZ ARMADA!',
            floatingColor: '#fde047',
          },
        ],
      },
      {
        stepIndex: 3,
        turnLabel: 'TURNO 6 • EXPANSÃO: MAR DE ÁRVORES PRIMORDIAL (⛩️ 6/6)',
        phaseBadge: '⛩️ EXPANSÃO DE DOMÍNIO',
        comboTitle: '⛩️ Mar de Árvores Primordial + Dragão Esmeralda (#161)',
        narrative:
          'Valkyra expande o Mar de Árvores Primordial (6/6) e invoca o Dragão Esmeralda de Galhada Viva (#161)! Todas as unidades recebem +2⚔️, +1🛡️, Atropelar e Acerto Garantido!',
        sfx: 'summon',
        musicStage: 'domain_clash',
        musicDomain: 'green',
        spotlightCardId: 'green_161_dragao_esmeralda_primordial',
        spotlightLabel: '⛩️ MAR DE ÁRVORES + DRAGÃO #161',
        playerHp: 40,
        playerEssence: '7/9⚡',
        playerAffinity: '⛩️ ATIVO (3T)',
        enemyHp: 22,
        enemyEssence: '6/7⚡',
        enemyAffinity: '5/6 🔥💀',
        domainState: {
          mode: 'single',
          owner: 'player',
          domain: 'green',
          name: '⛩️ Mar de Árvores Primordial',
          effectSummary: 'Potencial 120%: +2⚔️ ATQ, +1🛡️ ARM, Atropelar global e Acerto Garantido!',
        },
        enemyRearguard: [
          { cardId: 'red_146_coroa_chama_eterna', atk: 0, hp: 4, maxHp: 4 },
          null,
          null,
          null,
        ],
        enemyVanguard: [
          {
            cardId: 'red_138_colosso_vulcano_primordial',
            atk: 7,
            hp: 4,
            maxHp: 7,
            isFrozen: true,
            isHit: true,
            floatingText: '-3 🌿 ESPINHOS',
            floatingColor: '#4ade80',
          },
          {
            cardId: 'purple_138_soberano_carnica',
            atk: 7,
            hp: 4,
            maxHp: 7,
            isFrozen: true,
            isHit: true,
            floatingText: '-3 🌿 ESPINHOS',
            floatingColor: '#4ade80',
          },
          null,
          null,
        ],
        playerVanguard: [
          { cardId: 'green_160_behemoth_cratera_viva', atk: 10, hp: 11, maxHp: 11, armor: 4, hasShield: true },
          { cardId: 'green_141_soberano_fera_primordial', atk: 11, hp: 9, maxHp: 9, armor: 1, hasShield: true },
          {
            cardId: 'green_161_dragao_esmeralda_primordial',
            atk: 11,
            hp: 10,
            maxHp: 10,
            armor: 3,
            floatingText: '🐉 SOPRO ESPINHOS 3',
            floatingColor: '#4ade80',
          },
          null,
        ],
        playerRearguard: [
          { cardId: 'green_166_coracao_arvore_mundo', atk: 0, hp: 5, maxHp: 5 },
          { cardId: 'gold_166_trono_soberano_sol', atk: 0, hp: 5, maxHp: 5 },
          { cardId: 'blue_166_trono_oniciencia_astral', atk: 0, hp: 5, maxHp: 5 },
          null,
        ],
      },
      {
        stepIndex: 4,
        turnLabel: 'TURNO 6 • DESCIDA DE VALKYRA & INVESTIDA LETAL',
        phaseBadge: '👑 VITÓRIA PENTACROMÁTICA',
        comboTitle: 'Valkyra, Imperatriz Pentacromática (Sopro 4) + Atropelar Total!',
        narrative:
          'Valkyra desce aos céus varrendo os defensores congelados com Sopro Pentacromático 4 e lidera a investida de 32⚔️ com Atropelar e Acerto Garantido (0❤️)!',
        sfx: 'victory',
        musicStage: 'climax',
        musicDomain: 'gold',
        spotlightCardId: 'neutral_10_valkyra_pentacromatica',
        spotlightLabel: '👑 SOPRO PENTACROMÁTICO 4 (-22 LETAL!)',
        playerHp: 40,
        playerEssence: '0/9⚡',
        playerAffinity: '⛩️ VITÓRIA',
        enemyHp: 0,
        enemyEssence: '0/7⚡',
        enemyAffinity: '0❤️ DERROTADO',
        domainState: {
          mode: 'single',
          owner: 'player',
          domain: 'green',
          name: '👑 TRIUNFO: CONVERGÊNCIA PENTACROMÁTICA',
          effectSummary: 'Os Tronos #166 e Valkyra aniquilaram toda a mesa rival em um único turno!',
        },
        enemyRearguard: [null, null, null, null],
        enemyVanguard: [null, null, null, null],
        playerVanguard: [
          {
            cardId: 'green_160_behemoth_cratera_viva',
            atk: 10,
            hp: 11,
            maxHp: 11,
            armor: 4,
            hasShield: true,
            isAttacking: true,
          },
          {
            cardId: 'neutral_10_valkyra_pentacromatica',
            atk: 10,
            hp: 9,
            maxHp: 9,
            armor: 3,
            hasShield: true,
            isAttacking: true,
            floatingText: '🌈 SOPRO 4 + ATROPELAR!',
            floatingColor: '#fde047',
          },
          {
            cardId: 'green_161_dragao_esmeralda_primordial',
            atk: 11,
            hp: 10,
            maxHp: 10,
            armor: 3,
            isAttacking: true,
          },
          {
            cardId: 'green_141_soberano_fera_primordial',
            atk: 11,
            hp: 9,
            maxHp: 9,
            armor: 1,
            isAttacking: true,
          },
        ],
        playerRearguard: [
          { cardId: 'green_166_coracao_arvore_mundo', atk: 0, hp: 5, maxHp: 5 },
          { cardId: 'gold_166_trono_soberano_sol', atk: 0, hp: 5, maxHp: 5 },
          { cardId: 'blue_166_trono_oniciencia_astral', atk: 0, hp: 5, maxHp: 5 },
          null,
        ],
      },
    ],
  },
];

const DOMAIN_BOARD_BACKGROUNDS: Record<Domain, string> = {
  red: 'radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.36) 0%, rgba(69, 10, 10, 0.92) 70%, #090507 100%)',
  blue: 'radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.34) 0%, rgba(12, 34, 64, 0.92) 70%, #050914 100%)',
  purple: 'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.35) 0%, rgba(42, 11, 64, 0.93) 70%, #07040d 100%)',
  green: 'radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.32) 0%, rgba(10, 46, 26, 0.92) 70%, #040b07 100%)',
  gold: 'radial-gradient(circle at 50% 50%, rgba(250, 204, 21, 0.34) 0%, rgba(66, 46, 8, 0.92) 70%, #0d0a04 100%)',
  neutral: 'radial-gradient(circle at 50% 50%, rgba(148, 163, 184, 0.22) 0%, rgba(15, 23, 42, 0.94) 70%, #070a12 100%)',
};

const WOOD_WAR_TABLE_BG =
  'radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.08) 0%, transparent 65%), linear-gradient(180deg, #1b130d 0%, #241911 48%, #160f0a 100%)';

export const HomeSimulatedDuelShowcase: React.FC<HomeSimulatedDuelShowcaseProps> = ({
  onInspectCard,
  onPlayDuelNow,
  onOpenCombosCompendium,
  soundMuted,
  onToggleSound,
}) => {
  const [scenarioIdx, setScenarioIdx] = useState<number>(0);
  const [stepIdx, setStepIdx] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  );
  const [isVisibleOnScreen, setIsVisibleOnScreen] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const scenario = SIMULATED_DUEL_SCENARIOS[scenarioIdx] ?? SIMULATED_DUEL_SCENARIOS[0];
  const step = scenario.steps[stepIdx] ?? scenario.steps[0];

  // Detect Desktop vs Smartphone viewport
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobileViewport(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Pause simulation when scrolled out of view to save battery/CPU
  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]) {
          setIsVisibleOnScreen(entries[0].isIntersecting);
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  // Trigger real match SFX & Adaptive Music whenever the step changes while visible
  useEffect(() => {
    if (!isVisibleOnScreen) return;
    setMusicState(step.musicStage, step.musicDomain);
    if (!isMuted()) {
      playSfx(step.sfx);
    }
  }, [scenarioIdx, stepIdx, isVisibleOnScreen, step.musicStage, step.musicDomain, step.sfx]);

  // Auto-advance step every 3.4s and auto-rotate across the 3 thematic duels
  useEffect(() => {
    if (isPaused || !isVisibleOnScreen) return;
    const durationMs = stepIdx === scenario.steps.length - 1 ? 4200 : 3300;
    const timer = window.setTimeout(() => {
      if (stepIdx < scenario.steps.length - 1) {
        setStepIdx((prev) => prev + 1);
      } else {
        setScenarioIdx((prev) => (prev + 1) % SIMULATED_DUEL_SCENARIOS.length);
        setStepIdx(0);
      }
    }, durationMs);
    return () => window.clearTimeout(timer);
  }, [isPaused, isVisibleOnScreen, stepIdx, scenario.steps.length]);

  const handleSelectScenario = (idx: number) => {
    startAdaptiveMusic();
    setScenarioIdx(idx);
    setStepIdx(0);
  };

  const handleNextStep = () => {
    startAdaptiveMusic();
    if (stepIdx < scenario.steps.length - 1) {
      setStepIdx((prev) => prev + 1);
    } else {
      setScenarioIdx((prev) => (prev + 1) % SIMULATED_DUEL_SCENARIOS.length);
      setStepIdx(0);
    }
  };

  const handlePrevStep = () => {
    startAdaptiveMusic();
    if (stepIdx > 0) {
      setStepIdx((prev) => prev - 1);
    } else {
      const prevScen =
        (scenarioIdx - 1 + SIMULATED_DUEL_SCENARIOS.length) % SIMULATED_DUEL_SCENARIOS.length;
      setScenarioIdx(prevScen);
      setStepIdx(SIMULATED_DUEL_SCENARIOS[prevScen].steps.length - 1);
    }
  };

  const handleSoundButton = () => {
    startAdaptiveMusic();
    if (onToggleSound) {
      onToggleSound();
    } else {
      toggleMute();
    }
  };

  const playerAvatarCard =
    CARDS_BY_ID[scenario.playerSovereign.avatarCardId] ?? ALL_CARDS[0];
  const enemyAvatarCard =
    CARDS_BY_ID[scenario.enemySovereign.avatarCardId] ?? ALL_CARDS[1];
  const spotlightCard = step.spotlightCardId ? CARDS_BY_ID[step.spotlightCardId] : null;

  const boardSurfaceStyle = useMemo((): React.CSSProperties => {
    const ds = step.domainState;
    if (ds.mode === 'clash_50_50' && ds.rivalDomain) {
      return {
        background: `linear-gradient(180deg, rgba(14, 116, 144, 0.44) 0%, rgba(15, 23, 42, 0.92) 49%, rgba(250, 204, 21, 0.55) 50%, rgba(185, 28, 28, 0.45) 51%, rgba(30, 10, 10, 0.94) 100%)`,
        borderColor: '#fde047',
        boxShadow: '0 0 28px rgba(56, 189, 248, 0.35), inset 0 0 32px rgba(239, 68, 68, 0.35)',
      };
    }
    if (ds.mode === 'single') {
      const domColor = DOMAIN_META[ds.domain]?.color ?? '#d4af37';
      return {
        background: DOMAIN_BOARD_BACKGROUNDS[ds.domain] ?? WOOD_WAR_TABLE_BG,
        borderColor: domColor,
        boxShadow: `0 0 28px ${domColor}44, inset 0 0 36px ${domColor}2e`,
      };
    }
    return {
      background: WOOD_WAR_TABLE_BG,
      borderColor: 'rgba(212, 175, 55, 0.38)',
      boxShadow: 'inset 0 0 28px rgba(0, 0, 0, 0.75)',
    };
  }, [step.domainState]);

  const renderSlotUnit = (
    unit: SimulatedSlotUnit | null,
    rowKey: string,
    colIdx: number,
    compactMobile = false
  ) => {
    if (!unit) {
      return (
        <div
          key={`${rowKey}-${colIdx}`}
          style={{
            minHeight: compactMobile ? '64px' : '72px',
            borderRadius: '7px',
            border: '1px dashed rgba(212, 175, 55, 0.16)',
            background: 'rgba(5, 8, 15, 0.34)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.58rem',
            color: 'rgba(148, 163, 184, 0.28)',
            fontWeight: 700,
          }}
        >
          {rowKey.includes('Vanguard') ? '[V]' : '[R]'}
        </div>
      );
    }

    const card = CARDS_BY_ID[unit.cardId];
    if (!card) return null;
    const domColor = DOMAIN_META[card.domain]?.color ?? '#d4af37';

    if (unit.isTrapHidden) {
      return (
        <div
          key={`${rowKey}-${colIdx}`}
          onClick={() => onInspectCard?.(card)}
          title="Emboscada Oculta na Retaguarda (Clique para espiar)"
          style={{
            minHeight: compactMobile ? '64px' : '72px',
            borderRadius: '7px',
            border: '1.5px solid rgba(56, 189, 248, 0.55)',
            background: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative',
            padding: '4px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
          }}
        >
          <span style={{ fontSize: '1.1rem' }}>🪤</span>
          <span
            style={{
              fontSize: '0.56rem',
              fontWeight: 800,
              color: '#bae6fd',
              textAlign: 'center',
              letterSpacing: '0.04em',
            }}
          >
            EMBOSCADA OCULTA
          </span>
        </div>
      );
    }

    const displayName = unit.ascendedName || card.name;

    return (
      <div
        key={`${rowKey}-${colIdx}-${unit.cardId}`}
        onClick={() => onInspectCard?.(card)}
        title={`${displayName} — Clique para inspecionar em 3D`}
        style={{
          minHeight: compactMobile ? '64px' : '72px',
          borderRadius: '7px',
          position: 'relative',
          cursor: 'pointer',
          overflow: 'hidden',
          border: unit.isAscended
            ? '1.5px solid #fde047'
            : unit.hasShield
            ? '1.5px solid #fef08a'
            : unit.isFrozen
            ? '1.5px solid #38bdf8'
            : `1.5px solid ${domColor}`,
          background: '#070a12',
          boxShadow: unit.isAscended
            ? '0 0 16px rgba(250, 204, 21, 0.55)'
            : unit.isHit
            ? '0 0 16px rgba(239, 68, 68, 0.7)'
            : '0 4px 12px rgba(0,0,0,0.65)',
          transform: unit.isAttacking
            ? 'translateY(-7px) scale(1.05)'
            : unit.isHit
            ? 'scale(0.96)'
            : 'none',
          transition: 'all 0.28s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {card.imagePath && (
          <img
            src={card.imagePath}
            alt={displayName}
            style={{
              width: '100%',
              height: compactMobile ? '64px' : '72px',
              objectFit: 'cover',
              objectPosition: 'center 22%',
              display: 'block',
              filter: unit.isFrozen
                ? 'saturate(0.4) brightness(1.1) hue-rotate(170deg)'
                : unit.isHit
                ? 'brightness(1.25) contrast(1.15)'
                : 'brightness(0.92)',
            }}
          />
        )}

        {/* Top Badges: Stack 2x/3x, Shield, Frozen, Ascended */}
        <div
          style={{
            position: 'absolute',
            top: '2px',
            left: '3px',
            right: '3px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              fontSize: '0.54rem',
              fontWeight: 900,
              padding: '1px 4px',
              borderRadius: '4px',
              background: 'rgba(2, 6, 23, 0.86)',
              color: unit.isAscended ? '#fde047' : domColor,
              border: `1px solid ${domColor}77`,
            }}
          >
            {unit.isAscended ? '★ ASC' : `${card.cost}⚡`}
          </span>

          <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
            {unit.stackCount && unit.stackCount > 1 && (
              <span
                style={{
                  fontSize: '0.54rem',
                  fontWeight: 900,
                  padding: '1px 4px',
                  borderRadius: '4px',
                  background: '#d4af37',
                  color: '#050811',
                }}
              >
                {unit.stackCount}×
              </span>
            )}
            {unit.hasShield && (
              <span
                style={{
                  fontSize: '0.58rem',
                  padding: '0 3px',
                  borderRadius: '4px',
                  background: 'rgba(250, 204, 21, 0.9)',
                  color: '#050811',
                  fontWeight: 900,
                }}
              >
                ✨
              </span>
            )}
            {unit.isFrozen && (
              <span
                style={{
                  fontSize: '0.58rem',
                  padding: '0 3px',
                  borderRadius: '4px',
                  background: 'rgba(56, 189, 248, 0.92)',
                  color: '#050811',
                  fontWeight: 900,
                }}
              >
                ❄️
              </span>
            )}
          </div>
        </div>

        {/* Floating Combat Callout Pill */}
        {unit.floatingText && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(2, 6, 23, 0.92)',
              border: `1px solid ${unit.floatingColor ?? '#fde047'}`,
              color: unit.floatingColor ?? '#fde047',
              fontSize: compactMobile ? '0.56rem' : '0.58rem',
              fontWeight: 900,
              padding: '2px 5px',
              borderRadius: '999px',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(0,0,0,0.85)',
              zIndex: 4,
            }}
          >
            {unit.floatingText}
          </div>
        )}

        {/* Bottom Name & Stats Strip */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(180deg, transparent 0%, rgba(2, 6, 23, 0.95) 42%)',
            padding: '8px 4px 2px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: '2px',
          }}
        >
          <span
            style={{
              fontSize: '0.55rem',
              fontWeight: 700,
              color: '#f8fafc',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '62%',
            }}
          >
            {displayName}
          </span>

          {card.type === 'creature' ? (
            <span
              style={{
                fontSize: '0.56rem',
                fontWeight: 900,
                color: '#fde047',
                background: 'rgba(2, 6, 23, 0.9)',
                padding: '0 4px',
                borderRadius: '4px',
                border: '1px solid rgba(250, 204, 21, 0.35)',
                whiteSpace: 'nowrap',
              }}
            >
              {unit.atk}⚔️/{unit.hp}❤️
            </span>
          ) : (
            <span
              style={{
                fontSize: '0.53rem',
                fontWeight: 800,
                color: '#cbd5e1',
                background: 'rgba(2, 6, 23, 0.85)',
                padding: '0 4px',
                borderRadius: '4px',
              }}
            >
              {card.type === 'relic' ? '🏛️' : '⚡'}
            </span>
          )}
        </div>
      </div>
    );
  };

  // Columns to display: 4 columns on Desktop, 2 main action columns on Smartphone
  const visibleColumnIndices = isMobileViewport ? [0, 1] : [0, 1, 2, 3];

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.55rem',
        width: '100%',
        maxWidth: '640px',
        margin: '0 auto',
        padding: isMobileViewport ? '0.6rem' : '0.75rem 0.85rem',
        borderRadius: '10px',
        background: 'linear-gradient(160deg, rgba(13, 18, 30, 0.96) 0%, rgba(7, 10, 18, 0.98) 100%)',
        border: '1px solid rgba(212, 175, 55, 0.42)',
        boxShadow: '0 18px 44px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        textAlign: 'left',
      }}
    >
      {/* TOP BAR: SCENARIO TABS + AUDIO / PAUSE CONTROLS */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.35rem',
        }}
      >
        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
          {SIMULATED_DUEL_SCENARIOS.map((sc, idx) => {
            const active = idx === scenarioIdx;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => handleSelectScenario(idx)}
                style={{
                  padding: isMobileViewport ? '3px 7px' : '4px 9px',
                  borderRadius: '6px',
                  fontSize: isMobileViewport ? '0.62rem' : '0.66rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  background: active
                    ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.28), rgba(30, 41, 59, 0.95))'
                    : 'rgba(15, 23, 42, 0.75)',
                  border: active
                    ? '1px solid #fde047'
                    : '1px solid rgba(148, 163, 184, 0.22)',
                  color: active ? '#fef08a' : '#cbd5e1',
                }}
              >
                {sc.shortTabLabel}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <button
            type="button"
            onClick={handleSoundButton}
            title="Ativar/Silenciar Efeitos Sonoros e Trilha Orquestral da Partida"
            style={{
              padding: '3px 7px',
              borderRadius: '6px',
              fontSize: '0.62rem',
              fontWeight: 800,
              cursor: 'pointer',
              background: soundMuted ? 'rgba(15, 23, 42, 0.8)' : 'rgba(22, 101, 52, 0.35)',
              border: soundMuted
                ? '1px solid rgba(148, 163, 184, 0.28)'
                : '1px solid rgba(74, 222, 128, 0.55)',
              color: soundMuted ? '#94a3b8' : '#86efac',
            }}
          >
            {soundMuted ? '🔇 Som Off' : '🔊 Som Real'}
          </button>
          <button
            type="button"
            onClick={() => setIsPaused((p) => !p)}
            title={isPaused ? 'Retomar Simulação' : 'Pausar Simulação'}
            style={{
              padding: '3px 7px',
              borderRadius: '6px',
              fontSize: '0.62rem',
              fontWeight: 800,
              cursor: 'pointer',
              background: 'rgba(15, 23, 42, 0.82)',
              border: '1px solid rgba(212, 175, 55, 0.32)',
              color: '#fde047',
            }}
          >
            {isPaused ? '▶' : '⏸'}
          </button>
          <button
            type="button"
            onClick={handlePrevStep}
            title="Jogada Anterior"
            style={{
              padding: '3px 6px',
              borderRadius: '6px',
              fontSize: '0.62rem',
              fontWeight: 800,
              cursor: 'pointer',
              background: 'rgba(15, 23, 42, 0.82)',
              border: '1px solid rgba(148, 163, 184, 0.25)',
              color: '#e2e8f0',
            }}
          >
            ◀
          </button>
          <button
            type="button"
            onClick={handleNextStep}
            title="Próxima Jogada"
            style={{
              padding: '3px 6px',
              borderRadius: '6px',
              fontSize: '0.62rem',
              fontWeight: 800,
              cursor: 'pointer',
              background: 'rgba(15, 23, 42, 0.82)',
              border: '1px solid rgba(148, 163, 184, 0.25)',
              color: '#e2e8f0',
            }}
          >
            ▶
          </button>
        </div>
      </div>

      {/* ENEMY SOVEREIGN HUD BAR */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.38rem 0.6rem',
          borderRadius: '7px',
          background: 'rgba(15, 23, 42, 0.88)',
          border: `1px solid ${DOMAIN_META[scenario.enemySovereign.domain].color}55`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          {enemyAvatarCard?.imagePath && (
            <img
              src={enemyAvatarCard.imagePath}
              alt={scenario.enemySovereign.name}
              onClick={() => onInspectCard?.(enemyAvatarCard)}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: `1.5px solid ${DOMAIN_META[scenario.enemySovereign.domain].color}`,
                cursor: 'pointer',
              }}
            />
          )}
          <div>
            <div
              className="font-cinzel"
              style={{ fontSize: '0.72rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1.1 }}
            >
              {scenario.enemySovereign.name}
            </div>
            {!isMobileViewport && (
              <div style={{ fontSize: '0.58rem', color: '#94a3b8' }}>
                {scenario.enemySovereign.title}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span
            style={{
              fontSize: '0.62rem',
              fontWeight: 800,
              padding: '2px 6px',
              borderRadius: '999px',
              background: 'rgba(30, 41, 59, 0.9)',
              color: '#bae6fd',
              border: '1px solid rgba(56, 189, 248, 0.35)',
            }}
          >
            {step.enemyAffinity}
          </span>
          <span
            style={{
              fontSize: '0.62rem',
              fontWeight: 800,
              padding: '2px 6px',
              borderRadius: '999px',
              background: 'rgba(30, 41, 59, 0.9)',
              color: '#fde047',
            }}
          >
            {step.enemyEssence}
          </span>
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 900,
              padding: '2px 8px',
              borderRadius: '999px',
              background: step.enemyHp <= 0 ? 'rgba(239, 68, 68, 0.35)' : 'rgba(127, 29, 29, 0.65)',
              color: '#fecaca',
              border: '1px solid rgba(248, 113, 113, 0.6)',
            }}
          >
            {step.enemyHp}❤️
          </span>
        </div>
      </div>

      {/* WAR TABLE / DOMAIN EXPANSION BATTLEFIELD */}
      <div
        style={{
          ...boardSurfaceStyle,
          borderRadius: '9px',
          borderWidth: '1.5px',
          borderStyle: 'solid',
          padding: isMobileViewport ? '0.45rem' : '0.55rem',
          position: 'relative',
          transition: 'all 0.45s ease',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
        }}
      >
        {/* Domain Expansion Active Banner Inside Table */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '2px 7px',
            borderRadius: '5px',
            background:
              step.domainState.mode === 'none'
                ? 'rgba(2, 6, 23, 0.65)'
                : 'rgba(2, 6, 23, 0.88)',
            border:
              step.domainState.mode === 'clash_50_50'
                ? '1px solid #fde047'
                : step.domainState.mode === 'single'
                ? `1px solid ${DOMAIN_META[step.domainState.domain].color}`
                : '1px solid rgba(255,255,255,0.08)',
            fontSize: '0.6rem',
            fontWeight: 800,
            color: step.domainState.mode === 'none' ? '#cbd5e1' : '#fde047',
          }}
        >
          <span>
            {step.domainState.mode === 'clash_50_50'
              ? `⚡ CHOQUE 50/50: ${step.domainState.name} vs ${step.domainState.rivalName}`
              : step.domainState.name}
          </span>
          <span style={{ color: '#94a3b8', fontSize: '0.56rem' }}>
            {isMobileViewport ? '📱 Visão Mobile 2 Colunas' : '🖥️ Mesa Tática 4 Colunas'}
          </span>
        </div>

        {/* Enemy Rearguard [R] (Hidden on Mobile if empty to prioritize front clash legibility, or shown as 2 cols) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${visibleColumnIndices.length}, 1fr)`,
            gap: '0.35rem',
          }}
        >
          {visibleColumnIndices.map((cIdx) =>
            renderSlotUnit(step.enemyRearguard[cIdx] ?? null, 'enemyRearguard', cIdx, isMobileViewport)
          )}
        </div>

        {/* Enemy Vanguard [V] */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${visibleColumnIndices.length}, 1fr)`,
            gap: '0.35rem',
          }}
        >
          {visibleColumnIndices.map((cIdx) =>
            renderSlotUnit(step.enemyVanguard[cIdx] ?? null, 'enemyVanguard', cIdx, isMobileViewport)
          )}
        </div>

        {/* Center Clash Line + Spotlight Card Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            margin: '1px 0',
          }}
        >
          <div
            style={{
              height: '1px',
              width: '100%',
              background:
                step.domainState.mode === 'clash_50_50'
                  ? 'linear-gradient(90deg, #38bdf8, #fde047, #ef4444)'
                  : 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.55), transparent)',
            }}
          />
          {spotlightCard && (
            <div
              onClick={() => onInspectCard?.(spotlightCard)}
              title={`Clique para inspecionar ${spotlightCard.name} em 3D`}
              style={{
                position: 'absolute',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '2px 8px',
                borderRadius: '999px',
                background: 'rgba(2, 6, 23, 0.94)',
                border: '1px solid #fde047',
                color: '#fef08a',
                fontSize: '0.58rem',
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(0,0,0,0.85)',
                zIndex: 5,
                whiteSpace: 'nowrap',
              }}
            >
              <span>{step.spotlightLabel}</span>
              <span style={{ color: '#94a3b8' }}>🔍</span>
            </div>
          )}
        </div>

        {/* Player Vanguard [V] */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${visibleColumnIndices.length}, 1fr)`,
            gap: '0.35rem',
          }}
        >
          {visibleColumnIndices.map((cIdx) =>
            renderSlotUnit(step.playerVanguard[cIdx] ?? null, 'playerVanguard', cIdx, isMobileViewport)
          )}
        </div>

        {/* Player Rearguard [R] */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${visibleColumnIndices.length}, 1fr)`,
            gap: '0.35rem',
          }}
        >
          {visibleColumnIndices.map((cIdx) =>
            renderSlotUnit(step.playerRearguard[cIdx] ?? null, 'playerRearguard', cIdx, isMobileViewport)
          )}
        </div>
      </div>

      {/* PLAYER SOVEREIGN HUD BAR */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.38rem 0.6rem',
          borderRadius: '7px',
          background: 'rgba(15, 23, 42, 0.92)',
          border: `1px solid ${DOMAIN_META[scenario.playerSovereign.domain].color}77`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          {playerAvatarCard?.imagePath && (
            <img
              src={playerAvatarCard.imagePath}
              alt={scenario.playerSovereign.name}
              onClick={() => onInspectCard?.(playerAvatarCard)}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: `1.5px solid ${DOMAIN_META[scenario.playerSovereign.domain].color}`,
                cursor: 'pointer',
              }}
            />
          )}
          <div>
            <div
              className="font-cinzel"
              style={{ fontSize: '0.72rem', fontWeight: 800, color: '#fde047', lineHeight: 1.1 }}
            >
              {scenario.playerSovereign.name} (Você)
            </div>
            {!isMobileViewport && (
              <div style={{ fontSize: '0.58rem', color: '#cbd5e1' }}>
                {scenario.comboBadge}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span
            style={{
              fontSize: '0.62rem',
              fontWeight: 800,
              padding: '2px 6px',
              borderRadius: '999px',
              background: 'rgba(212, 175, 55, 0.16)',
              color: '#fde047',
              border: '1px solid rgba(250, 204, 21, 0.45)',
            }}
          >
            {step.playerAffinity}
          </span>
          <span
            style={{
              fontSize: '0.62rem',
              fontWeight: 800,
              padding: '2px 6px',
              borderRadius: '999px',
              background: 'rgba(30, 41, 59, 0.9)',
              color: '#fde047',
            }}
          >
            {step.playerEssence}
          </span>
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 900,
              padding: '2px 8px',
              borderRadius: '999px',
              background: 'rgba(20, 83, 45, 0.65)',
              color: '#bbf7d0',
              border: '1px solid rgba(74, 222, 128, 0.55)',
            }}
          >
            {step.playerHp}❤️
          </span>
        </div>
      </div>

      {/* LIVE TACTICAL NARRATOR & STEP PROGRESS FOOTER */}
      <div
        style={{
          padding: '0.5rem 0.65rem',
          borderRadius: '8px',
          background: 'rgba(2, 6, 23, 0.88)',
          border: '1px solid rgba(212, 175, 55, 0.28)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.32rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.4rem',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontSize: '0.6rem',
              fontWeight: 900,
              color: '#fde047',
              letterSpacing: '0.06em',
            }}
          >
            {step.turnLabel} • {step.phaseBadge}
          </span>
          <div style={{ display: 'flex', gap: '4px' }}>
            {scenario.steps.map((s, idx) => (
              <button
                key={s.stepIndex}
                type="button"
                onClick={() => {
                  startAdaptiveMusic();
                  setStepIdx(idx);
                }}
                title={`Ir para Passo ${idx + 1}`}
                style={{
                  width: idx === stepIdx ? '18px' : '7px',
                  height: '7px',
                  borderRadius: '999px',
                  border: 'none',
                  cursor: 'pointer',
                  background: idx === stepIdx ? '#fde047' : 'rgba(148, 163, 184, 0.35)',
                  transition: 'all 0.2s ease',
                  padding: 0,
                }}
              />
            ))}
          </div>
        </div>

        <div
          className="font-cinzel"
          style={{ fontSize: '0.76rem', fontWeight: 800, color: '#f8fafc' }}
        >
          {step.comboTitle}
        </div>
        <p style={{ fontSize: '0.7rem', color: '#cbd5e1', lineHeight: 1.42, margin: 0 }}>
          {step.narrative}
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.45rem',
            marginTop: '0.15rem',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ fontSize: '0.6rem', color: '#94a3b8' }}>
            💡 Clique em qualquer carta da mesa para inspecionar em 3D
          </span>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {onOpenCombosCompendium && (
              <button
                type="button"
                onClick={onOpenCombosCompendium}
                style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(212, 175, 55, 0.45)',
                  color: '#fde68a',
                }}
              >
                ⚡ Ver 62 Combos
              </button>
            )}
            {onPlayDuelNow && (
              <button
                type="button"
                onClick={onPlayDuelNow}
                style={{
                  padding: '3px 9px',
                  borderRadius: '6px',
                  fontSize: '0.62rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, #d4af37, #b45309)',
                  border: 'none',
                  color: '#050811',
                }}
              >
                ⚔️ Jogar Agora →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
