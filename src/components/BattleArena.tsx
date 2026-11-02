import React, { Suspense, useState, useEffect, useMemo, useRef } from 'react';
import {
  AiSkillTier,
  BoardUnit,
  CampaignBoss,
  CardDefinition,
  ConquestBattleModifiers,
  Domain,
  FloatingFeedback,
  GameState,
  RowType,
  SacrificeAllocation,
} from '../types/game';
import { ALL_CARDS, CARDS_BY_ID } from '../data/cards';
import { PREBUILT_DECKS } from '../data/decks';
import {
  AI_SKILL_TIER_SPECS,
  BICOLOR_ARCHETYPE_MASTERY,
  getTrainedBicolorPrebuiltDecks,
  getTrainedMonocolorPrebuiltDecks,
  getTrainedPolycolorPrebuiltDecks,
  MONOCOLOR_ARCHETYPE_MASTERY,
  MonocolorArchetypeId,
  POLYCOLOR_ARCHETYPE_MASTERY,
  resolveBicolorArchetypeForDeckId,
  resolveCampaignBossGraduatedSetup,
  resolveDomainValueMlpForActor,
  resolvePolycolorArchetypeForDeckId,
} from '../data/aiMonocolorMastery';
import {
  getEmpiricalUnifiedWinRatePct,
  getUnifiedStandingForDeckId,
} from '../data/aiUnifiedTournament';
import { evaluateStateWithValueMlp } from '../engine/aiValueNetwork';
import { getMatchupGuide } from '../data/tacticalGuide';
import { resolvePrimaryBossDomain } from '../data/vaeloriaMapData';
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
  findAttackingUnitBetweenStates,
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
  resolveActualAttackVisualTarget,
  useSovereignPower,
} from '../engine/gameEngine';
import { executeAiMulligan, executeAiTurnStep } from '../engine/aiEngine';
import { playSfx } from '../utils/soundEngine';
import { MusicIntensityStage, setMusicState, startAdaptiveMusic } from '../utils/musicEngine';
import {
  flipGameStatePerspective,
  MONOCHROMATIC_STARTER_DECKS,
  MultiplayerRoom,
  publishMpMessage,
  SovereignUserProfile,
  subscribeMultiplayerBus,
  VICTORY_GOLD_REWARD,
} from '../utils/multiplayerEngine';
import {
  CardView,
  CardInspectModal,
  CARD_TYPE_LABELS,
  DOMAIN_META,
  formatCardFaceDescription,
  KEYWORD_TOOLTIPS,
} from './CardView';
const TacticalGuideView = React.lazy(() =>
  import('./TacticalGuideView').then((m) => ({ default: m.TacticalGuideView }))
);
const TutorialCodexView = React.lazy(() =>
  import('./TutorialCodexView').then((m) => ({ default: m.TutorialCodexView }))
);
import {
  buildProblemInitialGameState,
  PROBLEM_DIFFICULTY_META,
  recordProblemAttemptFailed,
  recordProblemHintUsed,
  TacticalProblem,
} from '../data/problemsRuntime';
import {
  recordDailyProblemAttemptResult,
  recordDailyQuestEvent,
} from '../utils/dailyQuestsEngine';
import { computeMatchDossier } from '../utils/matchStatsTracker';
import {
  getEloDivisionMeta,
  resolveCalibratedEloForArchetype,
  SovereignAiLeaderboardEntry,
} from '../data/sovereignEloLadder';
import type { LastRankedDuelSummary } from './GlobalLeaderboardView';
import {
  ComputedRoundPairing,
  getTournamentNowMs,
  SwissTournamentDefinition,
} from '../utils/tournamentEngine';
import {
  extractReplayClimaxMarkers,
  fetchCloudTournamentMatchLog,
  getArenaGameStateForReplayFrame,
  getOrSynthesizeSovereignMatchLog,
  subscribeTournamentTvUpdates,
  TournamentMatchReplayLog,
} from '../utils/tournamentSpectatorEngine';
import {
  PersonalMatchHistoryEntry,
  publishPersonalReplayShareToCloud,
  recordPersonalMatchFrame,
} from '../utils/personalMatchHistoryEngine';
import {
  ActiveArenaVideoSession,
  isArenaVideoCaptureSupported,
  startArenaVideoCapture,
} from '../utils/arenaVideoRecorder';
import { trackAdsEvent } from '../utils/adsTelemetry';

const ARENA_COACHMARK_STEPS = [
  {
    step: 1,
    badge: 'PASSO 1 DE 8 • FUNDAMENTOS, FADIGA & BARRAS SIMÉTRICAS',
    title: '40❤️ de Vida, 3⚡ Iniciais, 7 Cartas & Limite de 12 na Mão',
    text: 'Você inicia com 40❤️ de Vida, 3⚡ de Essência Máxima e 7 cartas (com Mulligan inicial de 30s e 60s por fase). Limite de 12 cartas na mão (excedentes queimam para a Cripta) e grimório vazio causa 2❤️ de Fadiga por compra. Use as barras no topo (▾ Rival) e na base (▴ Você) para inspecionar Afinidades, Cripta e Corrupção!',
  },
  {
    step: 2,
    badge: 'PASSO 2 DE 8 • ESSÊNCIA ATÉ 15⚡, CANALIZAR & QUEIMAR [C]',
    title: 'Essência Máxima (+1⚡/Rodada até 15⚡) & Canalizar 1× por Turno',
    text: 'A cada rodada, sua Essência Máxima sobe em +1⚡ (até 15⚡)! Uma vez por turno, selecione uma carta da mão e pressione [C] para Canalizá-la: você ganha +1 de Afinidade Elemental (65% cruzada para outras cores; cartas Neutras dão +1 na cor mais necessária) e compra +1 carta! Usos extras de [C] queimam a carta para a Cripta por +1⚡ temporário e +1 Afinidade.',
  },
  {
    step: 3,
    badge: 'PASSO 3 DE 8 • MESA 6×4, VANGUARDA [V] vs. RETAGUARDA [R]',
    title: 'Alcance por Coluna, Invasão (+1⚔️), Disparo Apoiado (+1⚔️) & Falange (+1🛡️)',
    text: 'Na Vanguarda [V], sua tropa alcança qualquer coluna inimiga, ganha +1🛡️ de Falange ao lado de um Guardião e +1⚔️ de Invasão se a Retaguarda rival da mesma coluna estiver vazia. Na Retaguarda [R], ganha +1⚔️ atrás de um aliado na mesma coluna (e Alcance atira sem levar contra-ataque!), mas unidades comuns na Retaguarda só defendem o Soberano na SUA própria coluna!',
  },
  {
    step: 4,
    badge: 'PASSO 4 DE 8 • FASE 1, FASE 2, POSTURAS & 3 ONDAS DE COMBATE',
    title: 'Mobilização → Planejamento (⚔️ Atacar / 🛡️ Defender +1🛡️) → 3 Ondas',
    text: 'Na Fase 1 você invoca cartas, arma Emboscadas na Retaguarda e move 1 unidade de fileira (⇄). Na Fase 2 (após revelação das invocações ocultas), escolha a postura de cada unidade (⚔️ Atacar ou 🛡️ Defender +1🛡️), lance Feitiços e execute as 3 Ondas: 1º Magias → 2º Ímpeto (sem contra-ataque se abater alvo sem Ímpeto!) → 3º Choque Simultâneo (com redirecionamento automático de coluna).',
  },
  {
    step: 5,
    badge: 'PASSO 5 DE 8 • BLOQUEIOS (VOO, ALCANCE, GUARDIÃO) & PILHAS 3×',
    title: 'Quem Bloqueia Quem & Empilhamento 3× por Slot',
    text: 'Ter apenas Voo ou Alcance NÃO bloqueia ataques rivais! Voo só é bloqueado por Guardião + Voo; Alcance só é bloqueado por Guardião na Vanguarda. Cada slot comporta até 3 cartas empilhadas: agrupe atrás de um Guardião contra alvos únicos, mas espalhe colunas contra Sopro Elemental e Atropelar!',
  },
  {
    step: 6,
    badge: 'PASSO 6 DE 8 • EXPANSÃO DE DOMÍNIO (⛩️ 6/6 AFINIDADE, 3⚡)',
    title: '+1/+1, Ímpeto, Acerto Garantido & 4 Contramedidas',
    text: 'Com 6/6 de Afinidade e 3⚡, invoque sua Expansão de Domínio por 3 rodadas: suas criaturas ganham +1/+1, Ímpeto e Acerto Garantido direto no Soberano rival (não remove Congelar). Contramedidas: Domínio Simples (2⚡, anula Acerto Garantido por 1 turno), Tributo de 10❤️ distribuídos, causar 8+ de dano no Soberano rival na rodada ou Disputa de Domínio (quebrar impõe 2 rodadas de Exaustão).',
  },
  {
    step: 7,
    badge: 'PASSO 7 DE 8 • RITUAIS, CORRUPÇÃO ABISSAL & ASCENSÃO ★',
    title: 'Poder do Soberano (2⚡), Pacto de Sangue (-3❤️/+1⚡) & Evolução',
    text: 'Ative 1× por turno o Poder do Soberano (2⚡) e o Pacto de Sangue (-3❤️ → +1⚡ e +1 Corrupção; com 5+ de Corrupção suas tropas ganham +1⚔️ e magias +1 dano, mas em 10/10 sofre -2❤️ de sobrecarga). Ao pagar Ascensão (★) numa unidade em campo, ela evolui preservando todos os buffs permanentes já acumulados!',
  },
  {
    step: 8,
    badge: 'PASSO 8 DE 8 • RELICÁRIO (30🪙), EDIÇÃO (100🪙) & ESTILHAÇOS (💎)',
    title: 'Grimório de 100 Cartas, Forja Direta & 12 Relíquias da Coroa',
    text: 'Seu Grimório tem 100 cartas (3× Comum/Incomum, 2× Rara, 1× Lendária, máx. 10 Lendárias). Pacotes no Relicário custam 30🪙 (duplicatas excedentes viram Estilhaços Astrais 💎 para forjar cartas exatas: 20/50/140/360💎), e editar todo o Grimório Base custa apenas 100🪙. Equipe também 1 das 12 Relíquias da Coroa antes das batalhas!',
  },
];

export interface CustomSavedDeck {
  id: string;
  name: string;
  cardIds: string[];
  wins?: number;
  losses?: number;
}

export interface BattleArenaProps {
  customDecks: CustomSavedDeck[];
  isGuest?: boolean;
  campaignBoss?: CampaignBoss | null;
  campaignPlayerDeckIds?: string[] | null;
  expeditionBlessingId?: string | null;
  conquestModifiers?: ConquestBattleModifiers | null;
  tacticalProblem?: TacticalProblem | null;
  onSelectProblem?: (problem: TacticalProblem) => void;
  onExitProblems?: () => void;
  initialPlayerDeckId?: string;
  initialAiDeckId?: string;
  initialAiSkillTier?: AiSkillTier;
  quickDuelNonce?: number;
  onCampaignVictory?: (boss: CampaignBoss) => void;
  onCampaignDefeat?: (boss: CampaignBoss) => void;
  onExitArena?: () => void;
  onExitCampaign?: () => void;
  onRewardGold?: (amount: number, reason: string) => void;
  onMatchConcluded?: (info: { didWin: boolean; usedDeckId: string | null }) => void;
  onOpenLastPersonalReplay?: () => void;
  onGuestClaimVictoryAccount?: (bonusGold: number) => void;
  onlineMatch?: {
    room: MultiplayerRoom;
    role: 'host' | 'guest';
    currentUser: SovereignUserProfile;
    onExitPvp: () => void;
    onPvpResult: (didWin: boolean) => void;
  } | null;
  rankedDuelContext?: {
    opponentEntry: SovereignAiLeaderboardEntry;
    playerElo: number;
    lastResult?: LastRankedDuelSummary | null;
    onExitLeaderboard: () => void;
  } | null;
  tournamentContext?: {
    tournamentTitle: string;
    roundNumber: number;
    totalRounds: number;
    roundPlayDeadlineMs: number;
    turnTimeLimitSec: number;
    mulliganTimeLimitSec: number;
    onExitTournament: () => void;
    onTournamentLiveStateUpdate?: (state: GameState, turnTimeLeftSec: number) => void;
    onTournamentMatchResult: (info: {
      score: 1 | 0.5 | 0;
      hpDiff: number;
      turns: number;
      reason: string;
    }) => void;
  } | null;
  tournamentSpectatorContext?: {
    tournament: SwissTournamentDefinition;
    pairing: ComputedRoundPairing;
    onExitSpectator: () => void;
    variant?: 'tournament' | 'home_live' | 'personal_replay';
    preloadedReplayLog?: TournamentMatchReplayLog | null;
    personalEntry?: PersonalMatchHistoryEntry | null;
    initialSpecFrame?: number;
    liveShareKey?: string;
    exitButtonLabel?: string;
    customTableBadge?: string;
    livePvpRoom?: MultiplayerRoom | null;
    onCycleNextLiveMatch?: () => void;
    onPlayNowFromHome?: () => void;
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
  const isNarrowScreen = typeof window !== 'undefined' && window.innerWidth <= 768;
  const rawRot = isNarrowScreen ? 0 : ((absHash % 45) - 22) / 10;
  const jitterX = isNarrowScreen || stackTotal > 1 ? 0 : ((absHash >> 4) % 9) - 4;
  const jitterY = isNarrowScreen || stackTotal > 1 ? 0 : ((absHash >> 9) % 7) - 3;

  const midStack = (stackTotal - 1) / 2;
  const stackRel = stackIdx - midStack;
  const stackOffsetX =
    stackTotal > 1 ? Math.round(stackRel * (isNarrowScreen ? 8 : 16)) : 0;
  const stackOffsetY = stackTotal > 1 ? Math.round(stackIdx * -4) : 0;
  const stackRot = stackTotal > 1 ? stackRel * (isNarrowScreen ? 1.8 : 2.8) : 0;

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
    '--pose-x': `${finalX}px`,
    '--pose-y': `${finalY}px`,
    '--stack-rel': stackRel,
    '--stack-idx': stackIdx,
    zIndex: (isInvading ? 18 : isClashingAtBorder ? 14 : 10) + stackIdx * 2,
  } as React.CSSProperties;
}

const ACTIVE_BATTLE_STORAGE_KEY = 'chromatic_pact_active_battle_v1';

interface SavedBattleSnapshot {
  mode: 'problem' | 'boss' | 'solo';
  problemId: string | null;
  bossId: string | null;
  selectedPlayerDeckId: string;
  selectedAiDeckId: string;
  isMulliganOpen: boolean;
  rewardClaimed: boolean;
  gameState: GameState;
  savedAt: number;
}

function loadSavedBattleSnapshot(
  expectedMode: 'problem' | 'boss' | 'solo',
  expectedProblemId?: string,
  expectedBossId?: string
): SavedBattleSnapshot | null {
  try {
    const raw = localStorage.getItem(ACTIVE_BATTLE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SavedBattleSnapshot>;
    if (!parsed || !parsed.gameState || parsed.gameState.phase === 'gameover') {
      return null;
    }
    if (parsed.mode !== expectedMode) return null;
    if (expectedMode === 'problem' && parsed.problemId !== (expectedProblemId ?? null)) {
      return null;
    }
    if (expectedMode === 'boss' && parsed.bossId !== (expectedBossId ?? null)) {
      return null;
    }
    return parsed as SavedBattleSnapshot;
  } catch {
    return null;
  }
}

export const BattleArena: React.FC<BattleArenaProps> = ({
  customDecks,
  isGuest = false,
  campaignBoss,
  campaignPlayerDeckIds,
  expeditionBlessingId,
  conquestModifiers,
  tacticalProblem,
  onSelectProblem,
  onExitProblems,
  initialPlayerDeckId,
  initialAiDeckId,
  initialAiSkillTier,
  quickDuelNonce,
  onCampaignVictory,
  onCampaignDefeat,
  onExitArena,
  onExitCampaign,
  onRewardGold,
  onMatchConcluded,
  onOpenLastPersonalReplay,
  onGuestClaimVictoryAccount,
  onlineMatch,
  rankedDuelContext,
  tournamentContext,
  tournamentSpectatorContext,
}) => {
  const isSpectatorMode = Boolean(tournamentSpectatorContext);

  const handleExitBattle = () => {
    if (tournamentSpectatorContext) {
      tournamentSpectatorContext.onExitSpectator();
      return;
    }
    try {
      localStorage.removeItem(ACTIVE_BATTLE_STORAGE_KEY);
    } catch {
      // Ignore
    }
    if (tournamentContext) {
      if (gameState.phase !== 'gameover') {
        tournamentContext.onTournamentMatchResult({
          score: 0,
          hpDiff: -20,
          turns: gameState.turn,
          reason: 'Abandono de mesa durante a rodada',
        });
      }
      tournamentContext.onExitTournament();
      return;
    }
    if (onlineMatch) {
      onlineMatch.onExitPvp();
    } else if (rankedDuelContext) {
      rankedDuelContext.onExitLeaderboard();
    } else if (tacticalProblem && onExitProblems) {
      onExitProblems();
    } else if (campaignBoss && onExitCampaign) {
      onExitCampaign();
    } else if (onExitArena) {
      onExitArena();
    }
  };
  const allowedPlayerDecks = useMemo(() => {
    if (!isGuest && customDecks.length > 0) {
      return customDecks.map((cd) => ({
        id: cd.id,
        name: `★ ${cd.name}`,
        subtitle: 'Grimório Autoral (100 Cartas)',
        coverCardId: cd.cardIds[0] ?? 'red_01',
        cardIds: cd.cardIds,
      }));
    }
    const guestPool = [
      ...MONOCHROMATIC_STARTER_DECKS,
      ...getTrainedPolycolorPrebuiltDecks(5),
      ...getTrainedBicolorPrebuiltDecks(5),
      ...getTrainedMonocolorPrebuiltDecks(5),
      ...PREBUILT_DECKS,
    ];
    const seen = new Set<string>();
    const unique: {
      id: string;
      name: string;
      subtitle: string;
      coverCardId: string;
      cardIds: string[];
    }[] = [];
    for (const d of guestPool) {
      if (seen.has(d.id)) continue;
      seen.add(d.id);
      unique.push({
        id: d.id,
        name: d.name,
        subtitle: d.subtitle,
        coverCardId: d.coverCardId,
        cardIds: d.cardIds,
      });
    }
    return unique;
  }, [isGuest, customDecks]);

  const initialSavedSnapshot = useMemo(() => {
    if (onlineMatch || isSpectatorMode) return null;
    const mode: 'problem' | 'boss' | 'solo' = tacticalProblem
      ? 'problem'
      : campaignBoss
      ? 'boss'
      : 'solo';
    return loadSavedBattleSnapshot(mode, tacticalProblem?.id, campaignBoss?.id);
  }, []);

  const restoredBossIdRef = useRef<string | null>(
    initialSavedSnapshot?.mode === 'boss' ? initialSavedSnapshot.bossId : null
  );
  const restoredProblemIdRef = useRef<string | null>(
    initialSavedSnapshot?.mode === 'problem' ? initialSavedSnapshot.problemId : null
  );

  const [selectedPlayerDeckId, setSelectedPlayerDeckId] = useState<string>(
    () =>
      initialSavedSnapshot?.selectedPlayerDeckId ??
      initialPlayerDeckId ??
      allowedPlayerDecks[0]?.id ??
      'deck_red_inferno'
  );
  const [selectedAiSkillTier, setSelectedAiSkillTier] = useState<AiSkillTier>(
    () => initialSavedSnapshot?.gameState?.aiSkillTier ?? initialAiSkillTier ?? 3
  );
  const allAvailableAiDecks = useMemo(() => {
    const trainedMono = getTrainedMonocolorPrebuiltDecks(selectedAiSkillTier);
    const trainedBi = getTrainedBicolorPrebuiltDecks(selectedAiSkillTier);
    const trainedPoly = getTrainedPolycolorPrebuiltDecks(selectedAiSkillTier);
    const seen = new Set([
      ...trainedMono.map((d) => d.id),
      ...trainedBi.map((d) => d.id),
      ...trainedPoly.map((d) => d.id),
    ]);
    return [
      ...trainedMono,
      ...trainedBi,
      ...trainedPoly,
      ...PREBUILT_DECKS.filter((d) => !seen.has(d.id)),
    ];
  }, [selectedAiSkillTier]);
  const [selectedAiDeckId, setSelectedAiDeckId] = useState<string>(
    () =>
      initialSavedSnapshot?.selectedAiDeckId ??
      initialAiDeckId ??
      PREBUILT_DECKS[1]?.id ??
      'deck_blue_tempest'
  );

  const [lazyProblemsModule, setLazyProblemsModule] = useState<
    typeof import('../data/problems') | null
  >(null);
  useEffect(() => {
    if (!tacticalProblem || lazyProblemsModule) return;
    import('../data/problems')
      .then((m) => setLazyProblemsModule(m))
      .catch(() => undefined);
  }, [tacticalProblem, lazyProblemsModule]);

  const [gameState, setGameState] = useState<GameState>(() => {
    if (tournamentSpectatorContext) {
      if (tournamentSpectatorContext.livePvpRoom?.canonicalState) {
        return tournamentSpectatorContext.livePvpRoom.canonicalState;
      }
      const initLog =
        tournamentSpectatorContext.preloadedReplayLog ??
        getOrSynthesizeSovereignMatchLog(
          tournamentSpectatorContext.tournament,
          tournamentSpectatorContext.pairing
        );
      const nowInit = getTournamentNowMs();
      const isLiveInit =
        tournamentSpectatorContext.variant !== 'personal_replay' &&
        (!initLog.isCompleted || nowInit < initLog.matchFinishMs);
      const requestedInitFrame =
        typeof tournamentSpectatorContext.initialSpecFrame === 'number' &&
        tournamentSpectatorContext.initialSpecFrame > 0
          ? Math.max(
              0,
              Math.min(initLog.frames.length - 1, Math.floor(tournamentSpectatorContext.initialSpecFrame))
            )
          : null;
      let startIdx = requestedInitFrame ?? 0;
      if (requestedInitFrame === null && isLiveInit) {
        for (let i = 0; i < initLog.frames.length; i += 1) {
          if (initLog.frames[i].atMs <= nowInit) startIdx = i;
        }
      }
      return getArenaGameStateForReplayFrame(
        tournamentSpectatorContext.tournament,
        tournamentSpectatorContext.pairing,
        initLog,
        startIdx
      );
    }
    if (initialSavedSnapshot?.gameState) {
      return initialSavedSnapshot.gameState;
    }
    if (tacticalProblem) {
      return buildProblemInitialGameState(tacticalProblem);
    }
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

    const bossGraduatedSetup = campaignBoss
      ? resolveCampaignBossGraduatedSetup(campaignBoss)
      : null;

    const bossDeckObj = campaignBoss
      ? allAvailableAiDecks.find((d) => d.id === (bossGraduatedSetup?.archetypeId ?? campaignBoss.deckId)) ??
        PREBUILT_DECKS[1]
      : allAvailableAiDecks.find((d) => d.id === selectedAiDeckId) ??
        PREBUILT_DECKS[1] ??
        PREBUILT_DECKS[0];

    const bossDeckCardIds = campaignBoss
      ? campaignBoss.customDeckCardIds && campaignBoss.customDeckCardIds.length >= 30
        ? campaignBoss.customDeckCardIds
        : bossGraduatedSetup?.cardIds ?? bossDeckObj?.cardIds ?? []
      : bossDeckObj?.cardIds ?? [];

    return createInitialGameState(
      resolveDeckCards(pDeckIds),
      resolveDeckCards(bossDeckCardIds),
      campaignBoss
        ? {
            playerName: 'Seu Soberano',
            aiName: campaignBoss.name,
            aiTitle: campaignBoss.title,
            aiAvatarCardId: campaignBoss.avatarCardId,
            aiStartingHp: campaignBoss.startingHp,
            bossId: campaignBoss.id,
            playerDeckId: defaultPlayerDeck?.id,
            aiDeckId: bossGraduatedSetup?.archetypeId ?? campaignBoss.deckId,
            aiSkillTier: bossGraduatedSetup?.skillTier ?? campaignBoss.difficultyTier ?? 3,
            expeditionBlessingId: expeditionBlessingId ?? undefined,
            conquestModifiers: conquestModifiers ?? null,
          }
        : {
            playerName: 'Seu Soberano',
            aiName: bossDeckObj?.name ?? 'Arconte Rival',
            aiTitle: bossDeckObj?.subtitle ?? 'Mestre do Domínio',
            aiAvatarCardId: bossDeckObj?.coverCardId,
            playerDeckId: defaultPlayerDeck?.id,
            aiDeckId: bossDeckObj?.id,
            aiSkillTier: selectedAiSkillTier,
          }
    );
  });

  const [selectedHandIndex, setSelectedHandIndex] = useState<number | null>(null);
  const [selectedAttackerId, setSelectedAttackerId] = useState<string | null>(null);
  const [hoveredAttackTargetId, setHoveredAttackTargetId] = useState<string | null>(null);
  const [inspectCard, setInspectCard] = useState<CardDefinition | null>(null);

  // Neural Value MLP Turn-by-Turn Advantage Telemetry (Post-Match Oracle Analysis)
  const neuralTelemetryRef = useRef<
    {
      stepKey: string;
      turn: number;
      activePlayer: 'player' | 'ai';
      winPct: number;
      playerHp: number;
      aiHp: number;
      keyAction: string;
    }[]
  >([]);

  useEffect(() => {
    if (tacticalProblem || isSpectatorMode) return;
    if (
      gameState.turn === 1 &&
      gameState.combatLog.length <= 2 &&
      neuralTelemetryRef.current.length > 3
    ) {
      neuralTelemetryRef.current = [];
    }

    let winPct = 50;
    if (gameState.phase === 'gameover') {
      winPct = gameState.winner === 'player' ? 100 : gameState.winner === 'ai' ? 0 : 50;
    } else {
      const pMlp = resolveDomainValueMlpForActor(gameState, 'player');
      const aMlp = resolveDomainValueMlpForActor(gameState, 'ai');
      const vP = evaluateStateWithValueMlp(gameState, 'player', pMlp);
      const vA = evaluateStateWithValueMlp(gameState, 'ai', aMlp);
      const symV = (vP - vA) * 0.5;
      winPct = Math.max(2, Math.min(98, Math.round((symV + 1) * 50)));
    }

    let latestMsg = '';
    for (let i = gameState.combatLog.length - 1; i >= 0; i--) {
      const entry = gameState.combatLog[i];
      if (entry && entry.category !== 'turn') {
        latestMsg = entry.message;
        break;
      }
    }

    const stepKey =
      gameState.phase === 'gameover'
        ? `gameover_t${gameState.turn}`
        : `t${gameState.turn}_${gameState.activePlayer}`;
    const snap = {
      stepKey,
      turn: gameState.turn,
      activePlayer: gameState.activePlayer,
      winPct,
      playerHp: gameState.player.hp,
      aiHp: gameState.ai.hp,
      keyAction: latestMsg,
    };

    const arr = neuralTelemetryRef.current;
    if (arr.length > 0 && arr[arr.length - 1].stepKey === stepKey) {
      arr[arr.length - 1] = snap;
    } else {
      arr.push(snap);
      if (arr.length > 60) arr.shift();
    }
  }, [
    tacticalProblem,
    gameState.turn,
    gameState.activePlayer,
    gameState.phase,
    gameState.winner,
    gameState.combatLog.length,
    gameState.player.hp,
    gameState.ai.hp,
  ]);
  const [hoveredCardInfo, setHoveredCardInfo] = useState<{
    card: CardDefinition;
    unit?: BoardUnit;
  } | null>(null);
  const [cryptModalOwner, setCryptModalOwner] = useState<'player' | 'ai' | null>(null);
  const [showQuickRules, setShowQuickRules] = useState(false);
  const [arenaTutorialStep, setArenaTutorialStep] = useState<number | null>(null);
  const [showTacticalAdvisor, setShowTacticalAdvisor] = useState(false);

  const isDesktopHoverDevice = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    window.innerWidth > 768;

  const isMobileViewport = () =>
    typeof window !== 'undefined' &&
    (window.innerWidth <= 768 || window.innerHeight <= 540);

  const [showLogSidebar, setShowLogSidebar] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState<boolean>(
    () => initialSavedSnapshot?.rewardClaimed ?? false
  );
  const [gameoverStage, setGameoverStage] = useState<
    'none' | 'cinematic' | 'modal' | 'dismissed'
  >('none');
  const [isMulliganOpen, setIsMulliganOpen] = useState<boolean>(() =>
    isSpectatorMode
      ? false
      : initialSavedSnapshot !== null
      ? Boolean(initialSavedSnapshot.isMulliganOpen)
      : !tacticalProblem
  );
  const [problemHintStage, setProblemHintStage] = useState<0 | 1 | 2 | 3>(0);
  const [isProblemHudMinimized, setIsProblemHudMinimized] = useState<boolean>(() =>
    isMobileViewport()
  );
  const [showProblemIncompleteModal, setShowProblemIncompleteModal] = useState(false);
  const [mulliganSwapIndices, setMulliganSwapIndices] = useState<number[]>([]);
  const isTimedCompetitiveMatch = Boolean(
    tournamentContext || onlineMatch || rankedDuelContext
  );
  const MULLIGAN_TIME_LIMIT_SECONDS = tournamentContext
    ? tournamentContext.mulliganTimeLimitSec
    : 30;
  const TURN_TIME_LIMIT_SECONDS = tournamentContext
    ? tournamentContext.turnTimeLimitSec
    : 60;
  const [mulliganTimeLeft, setMulliganTimeLeft] = useState<number>(MULLIGAN_TIME_LIMIT_SECONDS);
  const [turnTimeLeft, setTurnTimeLeft] = useState<number>(TURN_TIME_LIMIT_SECONDS);
  const [roundSecondsLeft, setRoundSecondsLeft] = useState<number>(() =>
    tournamentContext
      ? Math.max(0, Math.ceil((tournamentContext.roundPlayDeadlineMs - getTournamentNowMs()) / 1000))
      : 0
  );

  useEffect(() => {
    if (!tournamentContext?.onTournamentLiveStateUpdate) return;
    tournamentContext.onTournamentLiveStateUpdate(gameState, turnTimeLeft);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.combatLog.length, gameState.turn, gameState.phase]);

  // Automatic Personal Match Replay Recorder (saves player's last 15 full duels across all modes)
  const personalMatchSessionRef = useRef<{
    id: string;
    completed: boolean;
  }>({
    id: `duel-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    completed: false,
  });

  useEffect(() => {
    if (isSpectatorMode || tacticalProblem || isMulliganOpen) return;
    if (
      personalMatchSessionRef.current.completed &&
      gameState.phase !== 'gameover' &&
      gameState.turn <= 1
    ) {
      personalMatchSessionRef.current = {
        id: `duel-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
        completed: false,
      };
    }

    const modeLabel = tournamentContext
      ? tournamentContext.tournamentTitle || 'Torneio Suíço'
      : rankedDuelContext
      ? 'Duelo Ranqueado'
      : onlineMatch
      ? 'Conclave 1×1'
      : conquestModifiers?.riftMutator
      ? conquestModifiers.riftName || 'Fenda da Fratura'
      : conquestModifiers?.provinceName
      ? `Conquista · ${conquestModifiers.provinceName}`
      : expeditionBlessingId
      ? 'Expedição'
      : campaignBoss
      ? 'Campanha de Vaeloria'
      : 'Arena de Combate';

    recordPersonalMatchFrame(
      {
        sessionId: personalMatchSessionRef.current.id,
        modeLabel,
        playerElo: rankedDuelContext?.playerElo ?? 1500,
        opponentElo: rankedDuelContext?.opponentEntry.eloRating ?? 1500,
        turnTimeLimitSec: TURN_TIME_LIMIT_SECONDS,
      },
      gameState,
      turnTimeLeft
    );

    if (gameState.phase === 'gameover') {
      personalMatchSessionRef.current.completed = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isSpectatorMode,
    tacticalProblem,
    isMulliganOpen,
    gameState.combatLog.length,
    gameState.turn,
    gameState.phase,
  ]);
  const [isHandPinnedOpen, setIsHandPinnedOpen] = useState(false);
  const [isHandHovered, setIsHandHovered] = useState(false);
  const [isCommandDockMinimized, setIsCommandDockMinimized] = useState(false);
  const [focusedBoardUnitId, setFocusedBoardUnitId] = useState<string | null>(null);
  const [isP2DrawerPinned, setIsP2DrawerPinned] = useState(false);
  const [isP1DrawerPinned, setIsP1DrawerPinned] = useState(false);
  const [activeRightDrawer, setActiveRightDrawer] = useState<'terrains' | 'guide' | 'menu' | null>(
    null
  );

  const closeAllArenaDrawers = () => {
    setIsP2DrawerPinned(false);
    setIsP1DrawerPinned(false);
    setIsHandPinnedOpen(false);
    setIsHandHovered(false);
    setActiveRightDrawer(null);
    setIsProblemHudMinimized(true);
  };

  const clearHandSelectionAndDrawers = () => {
    setSelectedHandIndex(null);
    setFocusedBoardUnitId(null);
    setIsHandPinnedOpen(false);
    setIsHandHovered(false);
    setIsCommandDockMinimized(false);
  };
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
    domain: Domain;
    name: string;
    icon: string;
    mode: 'expire' | 'shatter' | 'wheel_shatter';
    reasonText: string;
  } | null>(null);
  const prevDomainExpansionRef = useRef<GameState['domainExpansion']>(gameState.domainExpansion);
  const latestGameStateRef = useRef<GameState>(gameState);
  latestGameStateRef.current = gameState;
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
    kind:
      | 'breath'
      | 'spell'
      | 'legendary'
      | 'ascend'
      | 'sovereign'
      | 'armada'
      | 'wheel_general';
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

  const hasTrackedFirstActionRef = useRef<boolean>(false);

  const triggerCardPlaySpectacle = (
    actor: 'player' | 'ai',
    card: CardDefinition,
    prePlayState: GameState,
    targetId?: string
  ) => {
    if (!isSpectatorMode && actor === 'player' && !hasTrackedFirstActionRef.current) {
      hasTrackedFirstActionRef.current = true;
      trackAdsEvent('first_card_played', { action: 'play_card', isGuest });
    }
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

    // 0A. Dragon Armada Sky-Full-of-Dragons Flyover (#172)
    if (card.id.includes('_172_armada_draconica_')) {
      const targetRowName: RowType = enemyState.vanguard.some((u) => u !== null)
        ? 'vanguard'
        : 'rearguard';
      const targetLaneId = `${enemyActor}-${targetRowName}`;
      triggerScreenShake('heavy');
      playSfx('dragon_armada');
      setSpectacleFx({
        kind: 'armada',
        card,
        domain: card.domain,
        title: `🐉🔥 ARMADA DRACÔNICA: ${card.name.toUpperCase()}`,
        subtitle:
          formatCardFaceDescription(card) ||
          'Esquadrões colossais escurecem o firmamento da Arena!',
        targetLaneId,
      });
      setTimeout(() => setSpectacleFx(null), 1280);
      return;
    }

    // 0B. Sacred Wheel General Entrance (#173 — Anti-Domain Expansion Sovereign General)
    if (card.effects.some((e) => e.type === 'break_domain_expansion')) {
      const willBreakEnemyDomain = Boolean(
        prePlayState.domainExpansion &&
          (prePlayState.domainExpansion.owner === enemyActor ||
            prePlayState.domainExpansion.clashRival?.owner === enemyActor)
      );
      triggerScreenShake('heavy');
      if (!willBreakEnemyDomain) {
        playSfx('ascend');
      }
      setSpectacleFx({
        kind: 'wheel_general',
        card,
        domain: card.domain,
        title: willBreakEnemyDomain
          ? `☸ QUEBRA DE DOMÍNIO: ${card.name.toUpperCase()}`
          : `☸ GENERAL DA RODA CELESTE: ${card.name.toUpperCase()}`,
        subtitle: willBreakEnemyDomain
          ? 'A Roda de Oito Raios gira e estilhaça a Expansão de Domínio rival (Exaustão: 2 rodadas)!'
          : formatCardFaceDescription(card) || card.flavorText,
      });
      setTimeout(() => setSpectacleFx(null), 1320);
      return;
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
            : formatCardFaceDescription(card),
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
        subtitle: formatCardFaceDescription(card) || card.flavorText,
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
        subtitle: formatCardFaceDescription(card),
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

    const aRectFallback = attackerEl?.getBoundingClientRect() ?? null;
    const attackerInNorthHalf =
      targetId === 'player-sovereign' ||
      (aRectFallback !== null && aRectFallback.top + aRectFallback.height / 2 < window.innerHeight / 2);

    let startX = aRectFallback
      ? Math.round(aRectFallback.left + aRectFallback.width / 2)
      : window.innerWidth / 2;
    let startY = aRectFallback
      ? Math.round(aRectFallback.top + aRectFallback.height / 2)
      : window.innerHeight / 2 + (attackerInNorthHalf ? -80 : 80);
    let lungeX = 0;
    let lungeY = attackerInNorthHalf ? 96 : -96;
    let impactX = startX;
    let impactY = startY + lungeY;
    let angleDeg = attackerInNorthHalf ? 90 : -90;
    let distancePx = 120;

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
      if (restoredBossIdRef.current === campaignBoss.id) {
        restoredBossIdRef.current = null;
        return;
      }
      const pDeckIds =
        campaignPlayerDeckIds && campaignPlayerDeckIds.length >= 30
          ? campaignPlayerDeckIds
          : PREBUILT_DECKS[0]?.cardIds ?? [];
      const bossSetup = resolveCampaignBossGraduatedSetup(campaignBoss);
      const bossDeckCardIds =
        campaignBoss.customDeckCardIds && campaignBoss.customDeckCardIds.length >= 30
          ? campaignBoss.customDeckCardIds
          : bossSetup.cardIds;

      setGameState(
        createInitialGameState(
          resolveDeckCards(pDeckIds),
          resolveDeckCards(bossDeckCardIds),
          {
            playerName: 'Seu Soberano',
            aiName: campaignBoss.name,
            aiTitle: campaignBoss.title,
            aiAvatarCardId: campaignBoss.avatarCardId,
            aiStartingHp: campaignBoss.startingHp,
            bossId: campaignBoss.id,
            playerDeckId: selectedPlayerDeckId,
            aiDeckId: bossSetup.archetypeId,
            aiSkillTier: bossSetup.skillTier,
            expeditionBlessingId: expeditionBlessingId ?? undefined,
            conquestModifiers: conquestModifiers ?? null,
          }
        )
      );
      setSelectedHandIndex(null);
      setSelectedAttackerId(null);
      setRewardClaimed(false);
      setIsMulliganOpen(true);
      setMulliganSwapIndices([]);
    }
  }, [campaignBoss, campaignPlayerDeckIds, expeditionBlessingId, conquestModifiers]);

  // Detect Domain Expansion lifecycle transitions: Entry (AI), Clash, Natural Expiration, Sacred Wheel Shatter, and Destruction
  useEffect(() => {
    const prev = prevDomainExpansionRef.current;
    const curr = gameState.domainExpansion;
    const recentLogsText = [
      ...gameState.combatLog.slice(0, 6),
      ...gameState.combatLog.slice(-6),
    ]
      .map((l) => l.message)
      .join(' ');
    const wasWheelShattered = recentLogsText.includes('QUEBRA DE EXPANSÃO DE DOMÍNIO');
    const wheelBreakerMatch = recentLogsText.match(/QUEBRA DE EXPANSÃO DE DOMÍNIO!\s*\[([^\]]+)\]/);
    const wheelBreakerLabel = wheelBreakerMatch?.[1] ? `${wheelBreakerMatch[1].toUpperCase()}: ` : '';

    if (prev && !curr) {
      const wasShattered =
        wasWheelShattered ||
        recentLogsText.includes('QUEBRA DE BARREIRA') ||
        recentLogsText.includes('QUEBRA DE CONCENTRAÇÃO') ||
        recentLogsText.includes('estilhaçou') ||
        recentLogsText.includes('estilhaçar') ||
        recentLogsText.includes('colapsou');

      if (wasWheelShattered) {
        triggerScreenShake('heavy');
        playSfx('wheel_domain_shatter');
        setDomainExitAnim({
          domain: prev.domain,
          name: prev.name,
          icon: prev.icon,
          mode: 'wheel_shatter',
          reasonText: `☸ RODA DE OITO RAIOS! ${wheelBreakerLabel}[${prev.name.toUpperCase()}] ESTILHAÇADO • EXAUSTÃO (2 RODADAS)!`,
        });
        const t = setTimeout(() => setDomainExitAnim(null), 1680);
        prevDomainExpansionRef.current = curr;
        return () => clearTimeout(t);
      } else if (wasShattered) {
        triggerScreenShake('heavy');
        playSfx('domain_shatter');
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
      // Sacred Wheel General or Overwhelming Affinity shattered the previous Domain Expansion and replaced/promoted the rival!
      triggerScreenShake('heavy');
      playSfx(wasWheelShattered ? 'wheel_domain_shatter' : 'domain_shatter');
      setDomainExitAnim({
        domain: prev.domain,
        name: prev.name,
        icon: prev.icon,
        mode: wasWheelShattered ? 'wheel_shatter' : 'shatter',
        reasonText: wasWheelShattered
          ? `☸ RODA DE OITO RAIOS! ${wheelBreakerLabel}[${prev.name.toUpperCase()}] ESTILHAÇADO • [${curr.name.toUpperCase()}] REINA!`
          : `💥 [${curr.name.toUpperCase()}] ESTILHAÇOU [${prev.name.toUpperCase()}]!`,
      });
      const t = setTimeout(() => setDomainExitAnim(null), wasWheelShattered ? 1680 : 1300);
      prevDomainExpansionRef.current = curr;
      return () => clearTimeout(t);
    }

    if (prev && curr && prev.clashRival && !curr.clashRival) {
      // One domain won the 50/50 Domain Clash or a Wheel General shattered the rival barrier!
      const shatteredDom =
        curr.owner === prev.owner ? prev.clashRival : { domain: prev.domain, name: prev.name, icon: prev.icon };
      triggerScreenShake('heavy');
      playSfx(wasWheelShattered ? 'wheel_domain_shatter' : 'domain_shatter');
      setDomainExitAnim({
        domain: shatteredDom.domain,
        name: shatteredDom.name,
        icon: shatteredDom.icon,
        mode: wasWheelShattered ? 'wheel_shatter' : 'shatter',
        reasonText: wasWheelShattered
          ? `☸ RODA DE OITO RAIOS! ${wheelBreakerLabel}[${shatteredDom.name.toUpperCase()}] ESTILHAÇADO NA DISPUTA!`
          : `💥 DISPUTA VENCIDA! [${shatteredDom.name.toUpperCase()}] ESTILHAÇADO!`,
      });
      const t = setTimeout(() => setDomainExitAnim(null), wasWheelShattered ? 1680 : 1300);
      prevDomainExpansionRef.current = curr;
      return () => clearTimeout(t);
    }

    if (prev && curr && !prev.clashRival && curr.clashRival) {
      // Entered Domain Clash (Two Domains fighting on the table)!
      triggerScreenShake('heavy');
      playSfx('domain_clash');
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
    } else if (!prev && curr && (curr.owner === 'ai' || isSpectatorMode)) {
      // AI (or either Sovereign in Spectator/Replay mode) invoked Domain Expansion on its turn
      playSfx('domain_expand');
      const ownerActor = curr.owner;
      const casterCard = CARDS_BY_ID[gameState[ownerActor].avatarCardId] ?? ALL_CARDS[0];
      triggerSovereignSpectacle(
        ownerActor,
        isSpectatorMode
          ? `⛩️ EXPANSÃO DE DOMÍNIO: ${curr.name.toUpperCase()}`
          : `⛩️ EXPANSÃO DE DOMÍNIO INIMIGA: ${curr.name.toUpperCase()}`,
        `${curr.potencyDesc} • ${curr.sureHitDesc}`,
        curr.domain,
        casterCard
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
      const nextWithAiMulligan = executeAiMulligan(next, 'ai');
      setGameState(nextWithAiMulligan);
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
        const prevLocal = latestGameStateRef.current;
        const newestEntry = localized.combatLog[0];
        if (
          newestEntry &&
          newestEntry.id !== prevLocal.combatLog[0]?.id &&
          newestEntry.category === 'combat' &&
          (newestEntry.actor === 'ai' || newestEntry.actor === 'player')
        ) {
          const atkOwner = newestEntry.actor;
          const atkUnit = findAttackingUnitBetweenStates(prevLocal, localized, atkOwner);
          if (atkUnit) {
            const hitTargetId = resolveActualAttackVisualTarget(
              prevLocal,
              localized,
              atkOwner,
              atkUnit.instanceId
            );
            const isRanged =
              atkUnit.row === 'rearguard' && atkUnit.keywords.includes('Alcance');
            const isHeavy = atkUnit.currentAtk >= 5 || localized.phase === 'gameover';
            measureAndTriggerLunge(
              atkUnit.instanceId,
              hitTargetId,
              atkUnit.card.domain,
              isRanged,
              () => {
                setGameState(localized);
              },
              isHeavy
            );
            return;
          }
        }
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

  // Persist active solo / campaign / problem battle state across page reloads (F5 / mobile refresh)
  useEffect(() => {
    if (onlineMatch || isSpectatorMode) return;
    try {
      if (gameState.phase === 'gameover') {
        localStorage.removeItem(ACTIVE_BATTLE_STORAGE_KEY);
        return;
      }
      const snapshot: SavedBattleSnapshot = {
        mode: tacticalProblem ? 'problem' : campaignBoss ? 'boss' : 'solo',
        problemId: tacticalProblem?.id ?? null,
        bossId: campaignBoss?.id ?? null,
        selectedPlayerDeckId,
        selectedAiDeckId,
        isMulliganOpen,
        rewardClaimed,
        gameState,
        savedAt: Date.now(),
      };
      localStorage.setItem(ACTIVE_BATTLE_STORAGE_KEY, JSON.stringify(snapshot));
    } catch {
      // Ignore storage quota errors
    }
  }, [
    onlineMatch,
    tacticalProblem,
    campaignBoss,
    selectedPlayerDeckId,
    selectedAiDeckId,
    isMulliganOpen,
    rewardClaimed,
    gameState,
  ]);

  const restartCurrentProblem = () => {
    if (!tacticalProblem) return;
    try {
      localStorage.removeItem(ACTIVE_BATTLE_STORAGE_KEY);
    } catch {
      // Ignore
    }
    setGameState(buildProblemInitialGameState(tacticalProblem));
    setSelectedHandIndex(null);
    setSelectedAttackerId(null);
    setFocusedBoardUnitId(null);
    setRewardClaimed(false);
    setGameoverStage('none');
    setIsMulliganOpen(false);
    setIsProblemHudMinimized(isMobileViewport());
    setShowProblemIncompleteModal(false);
    setShowSacrificeBreakModal(false);
    playSfx('draw');
  };

  useEffect(() => {
    if (!tacticalProblem) return;
    if (restoredProblemIdRef.current === tacticalProblem.id) {
      restoredProblemIdRef.current = null;
      return;
    }
    setGameState(buildProblemInitialGameState(tacticalProblem));
    setSelectedHandIndex(null);
    setSelectedAttackerId(null);
    setFocusedBoardUnitId(null);
    setRewardClaimed(false);
    setGameoverStage('none');
    setIsMulliganOpen(false);
    setProblemHintStage(0);
    setIsProblemHudMinimized(isMobileViewport());
    setShowProblemIncompleteModal(false);
    setShowSacrificeBreakModal(false);
  }, [tacticalProblem?.id]);

  const startNewQuickMatch = (
    pDeckId: string,
    aDeckId: string,
    explicitAiTier?: AiSkillTier
  ) => {
    if (tacticalProblem) {
      restartCurrentProblem();
      return;
    }
    try {
      localStorage.removeItem(ACTIVE_BATTLE_STORAGE_KEY);
    } catch {
      // Ignore
    }

    if (campaignBoss) {
      const pDeckIds =
        campaignPlayerDeckIds && campaignPlayerDeckIds.length >= 30
          ? campaignPlayerDeckIds
          : (allowedPlayerDecks.find((d) => d.id === pDeckId) ?? allowedPlayerDecks[0])?.cardIds ??
            [];
      const bossSetup = resolveCampaignBossGraduatedSetup(campaignBoss);
      const bossDeckCardIds =
        campaignBoss.customDeckCardIds && campaignBoss.customDeckCardIds.length >= 30
          ? campaignBoss.customDeckCardIds
          : bossSetup.cardIds;

      const nextBossState = createInitialGameState(
        resolveDeckCards(pDeckIds),
        resolveDeckCards(bossDeckCardIds),
        {
          playerName: 'Seu Soberano',
          aiName: campaignBoss.name,
          aiTitle: campaignBoss.title,
          aiAvatarCardId: campaignBoss.avatarCardId,
          aiStartingHp: campaignBoss.startingHp,
          bossId: campaignBoss.id,
          playerDeckId: pDeckId,
          aiDeckId: bossSetup.archetypeId,
          aiSkillTier: bossSetup.skillTier,
          expeditionBlessingId: expeditionBlessingId ?? undefined,
          conquestModifiers: conquestModifiers ?? null,
        }
      );

      setGameState(nextBossState);
      setSelectedHandIndex(null);
      setSelectedAttackerId(null);
      setRewardClaimed(false);
      setIsMulliganOpen(true);
      setMulliganSwapIndices([]);
      setMulliganTimeLeft(MULLIGAN_TIME_LIMIT_SECONDS);
      setTurnTimeLeft(TURN_TIME_LIMIT_SECONDS);
      playSfx('draw');
      return;
    }

    const tierToUse = explicitAiTier ?? selectedAiSkillTier;
    const pDeck = allowedPlayerDecks.find((d) => d.id === pDeckId) ?? allowedPlayerDecks[0];
    const monoMastery = MONOCOLOR_ARCHETYPE_MASTERY[aDeckId as MonocolorArchetypeId];
    const biArchId = resolveBicolorArchetypeForDeckId(aDeckId);
    const biMastery = biArchId ? BICOLOR_ARCHETYPE_MASTERY[biArchId] : undefined;
    const polyArchId = resolvePolycolorArchetypeForDeckId(aDeckId);
    const polyMastery = polyArchId ? POLYCOLOR_ARCHETYPE_MASTERY[polyArchId] : undefined;
    const aDeck =
      allAvailableAiDecks.find((d) => d.id === aDeckId) ??
      PREBUILT_DECKS.find((d) => d.id === aDeckId) ??
      PREBUILT_DECKS[1] ??
      PREBUILT_DECKS[0];
    const aiCardIds =
      monoMastery?.tierDecks?.[tierToUse]?.cardIds ??
      biMastery?.tierDecks?.[tierToUse]?.cardIds ??
      polyMastery?.tierDecks?.[tierToUse]?.cardIds ??
      aDeck?.cardIds ??
      [];

    const nextState = createInitialGameState(
      resolveDeckCards(pDeck?.cardIds ?? []),
      resolveDeckCards(aiCardIds),
      {
        playerName: pDeck?.name ?? 'Seu Soberano',
        aiName: aDeck?.name ?? 'Arconte Rival',
        aiTitle: aDeck?.subtitle ?? 'Soberano Oponente',
        aiAvatarCardId: aDeck?.coverCardId,
        playerDeckId: pDeck?.id,
        aiDeckId: aDeck?.id,
        aiSkillTier: tierToUse,
      }
    );

    setGameState(nextState);
    setSelectedHandIndex(null);
    setSelectedAttackerId(null);
    setRewardClaimed(false);
    setIsMulliganOpen(true);
    setMulliganSwapIndices([]);
    setMulliganTimeLeft(MULLIGAN_TIME_LIMIT_SECONDS);
    setTurnTimeLeft(TURN_TIME_LIMIT_SECONDS);
    playSfx('draw');
  };

  const lastQuickDuelNonceRef = useRef<number | undefined>(quickDuelNonce);
  useEffect(() => {
    if (
      quickDuelNonce === undefined ||
      quickDuelNonce === lastQuickDuelNonceRef.current ||
      campaignBoss ||
      tacticalProblem ||
      onlineMatch
    ) {
      return;
    }
    lastQuickDuelNonceRef.current = quickDuelNonce;
    const nextP = initialPlayerDeckId ?? selectedPlayerDeckId;
    const nextA = initialAiDeckId ?? selectedAiDeckId;
    const nextT = initialAiSkillTier ?? selectedAiSkillTier;
    setSelectedPlayerDeckId(nextP);
    setSelectedAiDeckId(nextA);
    setSelectedAiSkillTier(nextT);
    startNewQuickMatch(nextP, nextA, nextT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quickDuelNonce]);

  // Reset Turn Timer whenever the turn number, active player, or Mulligan state changes
  useEffect(() => {
    setTurnTimeLeft(TURN_TIME_LIMIT_SECONDS);
  }, [gameState.turn, gameState.activePlayer, isMulliganOpen, TURN_TIME_LIMIT_SECONDS]);

  // Tournament Round Deadline Referee: counts down round window and adjudicates unfinished boards at 0s
  useEffect(() => {
    if (!tournamentContext || gameState.phase === 'gameover') return;
    const tick = () => {
      const rem = Math.max(
        0,
        Math.ceil((tournamentContext.roundPlayDeadlineMs - getTournamentNowMs()) / 1000)
      );
      setRoundSecondsLeft(rem);
      if (rem <= 0) {
        setIsMulliganOpen(false);
        setGameState((prev) => {
          if (prev.phase === 'gameover') return prev;
          const pBoard = getAllBoardUnits(prev.player).reduce(
            (s, u) => s + u.currentAtk + u.currentHp,
            0
          );
          const aBoard = getAllBoardUnits(prev.ai).reduce(
            (s, u) => s + u.currentAtk + u.currentHp,
            0
          );
          let winner: 'player' | 'ai' | null = null;
          let winReason = 'Tempo regulamentar da rodada encerrado — empate técnico (0,5 pt).';
          if (prev.player.hp > prev.ai.hp) {
            winner = 'player';
            winReason = `Tempo da rodada encerrado — vitória por saldo de Vida (${prev.player.hp} vs ${prev.ai.hp} PV).`;
          } else if (prev.ai.hp > prev.player.hp) {
            winner = 'ai';
            winReason = `Tempo da rodada encerrado — vitória de ${prev.ai.name} por saldo de Vida (${prev.ai.hp} vs ${prev.player.hp} PV).`;
          } else if (pBoard > aBoard) {
            winner = 'player';
            winReason = `Tempo da rodada encerrado com PV empatados — vitória por domínio de mesa (${pBoard} vs ${aBoard}).`;
          } else if (aBoard > pBoard) {
            winner = 'ai';
            winReason = `Tempo da rodada encerrado com PV empatados — vitória de ${prev.ai.name} por domínio de mesa (${aBoard} vs ${pBoard}).`;
          }
          return {
            ...prev,
            phase: 'gameover',
            winner,
            winReason,
          };
        });
      }
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [tournamentContext, gameState.phase]);

  // Mulligan Countdown Timer (Active ONLY in competitive timed modes; Campaign & PvE have no timer!)
  useEffect(() => {
    if (
      !isTimedCompetitiveMatch ||
      tacticalProblem ||
      !isMulliganOpen ||
      gameState.turn !== 1 ||
      gameState.phase === 'gameover'
    ) {
      return;
    }
    if (
      !onlineMatch &&
      !tournamentContext &&
      (showQuickRules || showTacticalAdvisor || arenaTutorialStep !== null || showSurrenderConfirm)
    ) {
      return;
    }

    if (mulliganTimeLeft <= 0) {
      handleConfirmMulligan();
      return;
    }

    const timer = window.setTimeout(() => {
      setMulliganTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [
    isTimedCompetitiveMatch,
    tacticalProblem,
    isMulliganOpen,
    mulliganTimeLeft,
    gameState.turn,
    gameState.phase,
    onlineMatch,
    tournamentContext,
    showQuickRules,
    showTacticalAdvisor,
    arenaTutorialStep,
    showSurrenderConfirm,
  ]);

  // Turn Countdown Timer (Active ONLY in competitive timed modes; Campaign & PvE are untimed!)
  useEffect(() => {
    if (
      !isTimedCompetitiveMatch ||
      tacticalProblem ||
      isMulliganOpen ||
      gameState.phase === 'gameover'
    ) {
      return;
    }
    if (
      !onlineMatch &&
      !tournamentContext &&
      (showQuickRules || showTacticalAdvisor || arenaTutorialStep !== null || showSurrenderConfirm)
    ) {
      return;
    }

    if (gameState.activePlayer === 'player' && turnTimeLeft <= 0) {
      setSelectedHandIndex(null);
      setSelectedAttackerId(null);
      setFocusedBoardUnitId(null);
      setShowSacrificeBreakModal(false);
      closeAllArenaDrawers();
      playSfx('draw');
      setGameState((prev) => {
        if (prev.phase === 'gameover' || prev.activePlayer !== 'player') return prev;
        const timedOutState = endTurn(prev);
        return {
          ...timedOutState,
          combatLog: [
            {
              id: `timeout-${Date.now()}`,
              turn: prev.turn,
              actor: 'system',
              category: 'turn',
              message: `⌛ Tempo limite do turno (${TURN_TIME_LIMIT_SECONDS}s) esgotado! O turno de ${prev.player.name} foi encerrado automaticamente.`,
            },
            ...timedOutState.combatLog,
          ],
        };
      });
      return;
    }

    // In 1v1 Online, if the remote opponent exceeds the 60s turn limit (+2s network grace), auto-advance their turn
    if (onlineMatch && gameState.activePlayer === 'ai' && turnTimeLeft <= -2) {
      playSfx('draw');
      setGameState((prev) => {
        if (prev.phase === 'gameover' || prev.activePlayer !== 'ai') return prev;
        const timedOutState = endTurn(prev);
        return {
          ...timedOutState,
          combatLog: [
            {
              id: `timeout-opp-${Date.now()}`,
              turn: prev.turn,
              actor: 'system',
              category: 'turn',
              message: `⌛ Tempo limite do turno (${TURN_TIME_LIMIT_SECONDS}s) de ${prev.ai.name} esgotado! Turno encerrado automaticamente.`,
            },
            ...timedOutState.combatLog,
          ],
        };
      });
      return;
    }

    if (gameState.activePlayer === 'player' && (turnTimeLeft === 10 || turnTimeLeft === 5)) {
      playSfx('channel');
    }

    const timer = window.setTimeout(() => {
      setTurnTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [
    isTimedCompetitiveMatch,
    isMulliganOpen,
    turnTimeLeft,
    gameState.phase,
    gameState.activePlayer,
    onlineMatch,
    tournamentContext,
    showQuickRules,
    showTacticalAdvisor,
    arenaTutorialStep,
    showSurrenderConfirm,
  ]);

  // =========================================================================
  // REAL-TABLETOP TOURNAMENT & HOME LIVE SPECTATOR / REPLAY / VIDEO RECORDER
  // Drives BattleArena with 100% authentic lunges, spells, Domain Expansions,
  // adaptive battle/climax music, Sovereign finisher cutscenes & MP4 export!
  // =========================================================================
  const isHomeLiveShowcase = tournamentSpectatorContext?.variant === 'home_live';
  const livePvpRoom = tournamentSpectatorContext?.livePvpRoom ?? null;
  const livePvpCanonicalRef = useRef<GameState | null>(livePvpRoom?.canonicalState ?? null);
  const arenaStageRef = useRef<HTMLDivElement | null>(null);
  const videoSessionRef = useRef<ActiveArenaVideoSession | null>(null);
  const [isRecordingVideo, setIsRecordingVideo] = useState<boolean>(false);
  const [recordingElapsedSec, setRecordingElapsedSec] = useState<number>(0);
  const canRecordVideo = useMemo(() => isArenaVideoCaptureSupported(), []);

  useEffect(() => {
    if (!isRecordingVideo) return;
    const id = window.setInterval(() => {
      setRecordingElapsedSec((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [isRecordingVideo]);

  useEffect(() => {
    return () => {
      videoSessionRef.current?.cancelWithoutDownload();
      videoSessionRef.current = null;
    };
  }, []);

  const handleToggleVideoRecording = async () => {
    if (videoSessionRef.current) {
      videoSessionRef.current.stopAndDownload();
      return;
    }
    setShowLogSidebar(false);
    setIsHandPinnedOpen(false);
    setIsP1DrawerPinned(false);
    setIsP2DrawerPinned(false);
    setActiveRightDrawer(null);

    const session = await startArenaVideoCapture({
      stageElement: arenaStageRef.current,
      southName: gameState.player.name,
      northName: gameState.ai.name,
      onAutoStopped: () => {
        videoSessionRef.current = null;
        setIsRecordingVideo(false);
        setRecordingElapsedSec(0);
      },
    });
    if (session) {
      videoSessionRef.current = session;
      setRecordingElapsedSec(0);
      setIsRecordingVideo(true);
    }
  };

  const [specLog, setSpecLog] = useState<TournamentMatchReplayLog | null>(() =>
    tournamentSpectatorContext && !tournamentSpectatorContext.livePvpRoom
      ? tournamentSpectatorContext.preloadedReplayLog ??
        getOrSynthesizeSovereignMatchLog(
          tournamentSpectatorContext.tournament,
          tournamentSpectatorContext.pairing
        )
      : null
  );
  const [specNowMs, setSpecNowMs] = useState<number>(() => getTournamentNowMs());
  const [specFlipped, setSpecFlipped] = useState<boolean>(false);
  const [specSpeed, setSpecSpeed] = useState<1 | 2 | 4>(1);
  const [specFollowLive, setSpecFollowLive] = useState<boolean>(() =>
    !(
      typeof tournamentSpectatorContext?.initialSpecFrame === 'number' &&
      tournamentSpectatorContext.initialSpecFrame > 0
    )
  );
  const [specShareFeedback, setSpecShareFeedback] = useState<
    'idle' | 'sharing' | 'copied_url' | 'copied_discord'
  >('idle');
  const [lastSharedSpecUrl, setLastSharedSpecUrl] = useState<string>('');
  const specShareTimerRef = useRef<number | null>(null);
  const [specCinemaMode, setSpecCinemaMode] = useState<boolean>(false);
  const [specCinemaAspect, setSpecCinemaAspect] = useState<'16:9' | '9:16'>('16:9');
  const [specCinemaHudVisible, setSpecCinemaHudVisible] = useState<boolean>(false);
  const cinemaHideTimerRef = useRef<number | null>(null);

  const wakeCinemaStudioHud = () => {
    if (cinemaHideTimerRef.current !== null) {
      window.clearTimeout(cinemaHideTimerRef.current);
    }
    setSpecCinemaHudVisible(true);
    cinemaHideTimerRef.current = window.setTimeout(() => {
      setSpecCinemaHudVisible(false);
    }, 2400);
  };

  const toggleSpecCinemaMode = (nextVal?: boolean) => {
    const targetVal = typeof nextVal === 'boolean' ? nextVal : !specCinemaMode;
    setSpecCinemaMode(targetVal);
    if (targetVal) {
      setShowLogSidebar(false);
      setIsHandPinnedOpen(false);
      setIsP1DrawerPinned(false);
      setIsP2DrawerPinned(false);
      setActiveRightDrawer(null);
      startAdaptiveMusic();
      wakeCinemaStudioHud();
      try {
        if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
          void document.documentElement.requestFullscreen().catch(() => {});
        }
      } catch {
        // ignore if blocked
      }
    } else {
      if (cinemaHideTimerRef.current !== null) {
        window.clearTimeout(cinemaHideTimerRef.current);
        cinemaHideTimerRef.current = null;
      }
      setSpecCinemaHudVisible(false);
      try {
        if (document.fullscreenElement && document.exitFullscreen) {
          void document.exitFullscreen().catch(() => {});
        }
      } catch {
        // ignore
      }
    }
  };

  useEffect(() => {
    return () => {
      if (cinemaHideTimerRef.current !== null) {
        window.clearTimeout(cinemaHideTimerRef.current);
      }
      if (specShareTimerRef.current !== null) {
        window.clearTimeout(specShareTimerRef.current);
      }
    };
  }, []);

  const specClimaxMarkers = useMemo(
    () => extractReplayClimaxMarkers(specLog),
    [specLog]
  );

  const specStartedAsLiveRef = useRef<boolean>(
    Boolean(
      tournamentSpectatorContext &&
        tournamentSpectatorContext.variant !== 'personal_replay' &&
        (tournamentSpectatorContext.variant === 'home_live' ||
          !specLog ||
          !specLog.isCompleted ||
          getTournamentNowMs() < specLog.matchFinishMs)
    )
  );
  const [specCursor, setSpecCursor] = useState<number>(() => {
    if (!tournamentSpectatorContext || !specLog) return 0;
    if (
      typeof tournamentSpectatorContext.initialSpecFrame === 'number' &&
      tournamentSpectatorContext.initialSpecFrame > 0
    ) {
      return Math.max(
        0,
        Math.min(specLog.frames.length - 1, Math.floor(tournamentSpectatorContext.initialSpecFrame))
      );
    }
    if (tournamentSpectatorContext.variant === 'personal_replay') return 0;
    const nowInit = getTournamentNowMs();
    const isLiveInit =
      tournamentSpectatorContext.variant === 'home_live' ||
      !specLog.isCompleted ||
      nowInit < specLog.matchFinishMs;
    if (!isLiveInit) return 0;
    let idx = 0;
    for (let i = 0; i < specLog.frames.length; i += 1) {
      if (specLog.frames[i].atMs <= nowInit) idx = i;
    }
    return idx;
  });
  const [specIsPlaying, setSpecIsPlaying] = useState<boolean>(() => {
    if (!tournamentSpectatorContext || !specLog) return false;
    if (
      typeof tournamentSpectatorContext.initialSpecFrame === 'number' &&
      tournamentSpectatorContext.initialSpecFrame > 0
    ) {
      return true;
    }
    if (tournamentSpectatorContext.variant === 'personal_replay') return true;
    const nowInit = getTournamentNowMs();
    const isLiveInit =
      tournamentSpectatorContext.variant === 'home_live' ||
      !specLog.isCompleted ||
      nowInit < specLog.matchFinishMs;
    return !isLiveInit;
  });
  const prevAppliedSpecCursorRef = useRef<number>(specCursor);
  const prevAppliedSpecFlipRef = useRef<boolean>(false);
  const prevAppliedSpecLogRef = useRef<TournamentMatchReplayLog | null>(specLog);
  const onCycleNextLiveMatchRef = useRef<(() => void) | undefined>(
    tournamentSpectatorContext?.onCycleNextLiveMatch
  );
  useEffect(() => {
    onCycleNextLiveMatchRef.current = tournamentSpectatorContext?.onCycleNextLiveMatch;
  }, [tournamentSpectatorContext?.onCycleNextLiveMatch]);

  // Safety watchdogs ensuring combatAnim / spectacleFx can never remain stuck non-null
  useEffect(() => {
    if (!combatAnim) return;
    const guard = window.setTimeout(() => setCombatAnim(null), 900);
    return () => window.clearTimeout(guard);
  }, [combatAnim]);

  useEffect(() => {
    if (!spectacleFx) return;
    const guard = window.setTimeout(() => setSpectacleFx(null), 1650);
    return () => window.clearTimeout(guard);
  }, [spectacleFx]);

  // Unlock & start adaptive arena soundtrack immediately upon entering Spectator/Replay
  useEffect(() => {
    if (!isSpectatorMode) return;
    startAdaptiveMusic();
  }, [isSpectatorMode]);

  // Live Conclave PvP Room spectator stream (when Home tunes into an active PvP room)
  useEffect(() => {
    if (!livePvpRoom) return;
    if (livePvpRoom.canonicalState) {
      livePvpCanonicalRef.current = livePvpRoom.canonicalState;
      setGameState(
        specFlipped
          ? flipGameStatePerspective(livePvpRoom.canonicalState)
          : livePvpRoom.canonicalState
      );
    }
    const unsub = subscribeMultiplayerBus((msg) => {
      if (msg.type === 'MATCH_STATE_SYNC' && msg.roomCode === livePvpRoom.code) {
        livePvpCanonicalRef.current = msg.canonicalState;
        const localized = specFlipped
          ? flipGameStatePerspective(msg.canonicalState)
          : msg.canonicalState;
        const prevLocal = latestGameStateRef.current;
        const newestEntry = localized.combatLog[0];
        if (
          newestEntry &&
          newestEntry.id !== prevLocal.combatLog[0]?.id &&
          newestEntry.category === 'combat' &&
          (newestEntry.actor === 'ai' || newestEntry.actor === 'player')
        ) {
          const atkOwner = newestEntry.actor;
          const atkUnit = findAttackingUnitBetweenStates(prevLocal, localized, atkOwner);
          if (atkUnit) {
            const hitTargetId = resolveActualAttackVisualTarget(
              prevLocal,
              localized,
              atkOwner,
              atkUnit.instanceId
            );
            const isRanged =
              atkUnit.row === 'rearguard' && atkUnit.keywords.includes('Alcance');
            const isHeavy = atkUnit.currentAtk >= 5 || localized.phase === 'gameover';
            measureAndTriggerLunge(
              atkUnit.instanceId,
              hitTargetId,
              atkUnit.card.domain,
              isRanged,
              () => {
                setGameState(localized);
              },
              isHeavy
            );
            return;
          }
        }
        playSfx('draw');
        setGameState(localized);
      } else if (
        msg.type === 'ROOM_UPSERT' &&
        msg.room.code === livePvpRoom.code &&
        msg.room.canonicalState
      ) {
        livePvpCanonicalRef.current = msg.room.canonicalState;
        setGameState(
          specFlipped
            ? flipGameStatePerspective(msg.room.canonicalState)
            : msg.room.canonicalState
        );
      }
    });
    return () => unsub();
  }, [livePvpRoom, specFlipped]);

  // Auto-save recorded clip and/or tune into the next live table once the finisher cutscene completes
  useEffect(() => {
    if (!isSpectatorMode || gameState.phase !== 'gameover') return;
    if (isRecordingVideo && videoSessionRef.current) {
      const saveTimer = window.setTimeout(() => {
        videoSessionRef.current?.stopAndDownload();
        if (isHomeLiveShowcase && onCycleNextLiveMatchRef.current) {
          window.setTimeout(() => {
            onCycleNextLiveMatchRef.current?.();
          }, 700);
        }
      }, 3400);
      return () => window.clearTimeout(saveTimer);
    }
    if (isHomeLiveShowcase && onCycleNextLiveMatchRef.current) {
      const nextTimer = window.setTimeout(() => {
        onCycleNextLiveMatchRef.current?.();
      }, 3600);
      return () => window.clearTimeout(nextTimer);
    }
  }, [isSpectatorMode, gameState.phase, isRecordingVideo, isHomeLiveShowcase]);

  const specMatchIdentity = tournamentSpectatorContext
    ? `${tournamentSpectatorContext.tournament.id}::r${tournamentSpectatorContext.pairing.round}::t${tournamentSpectatorContext.pairing.tableNumber}`
    : '';

  // Load / subscribe live human match telemetry when applicable
  useEffect(() => {
    if (!tournamentSpectatorContext || tournamentSpectatorContext.livePvpRoom) {
      setSpecLog(null);
      return;
    }
    if (tournamentSpectatorContext.preloadedReplayLog) {
      specStartedAsLiveRef.current = false;
      setSpecLog(tournamentSpectatorContext.preloadedReplayLog);
      return;
    }
    const { tournament, pairing } = tournamentSpectatorContext;
    const baseSynth = getOrSynthesizeSovereignMatchLog(tournament, pairing);
    const nowLoad = getTournamentNowMs();
    const liveOnLoad =
      tournamentSpectatorContext.variant === 'home_live' ||
      !baseSynth.isCompleted ||
      nowLoad < baseSynth.matchFinishMs;
    specStartedAsLiveRef.current = liveOnLoad;
    setSpecLog(baseSynth);

    const hasHuman =
      pairing.playerA.kind === 'human' || pairing.playerB?.kind === 'human';
    if (!hasHuman || !pairing.playerB) return;

    let cancelled = false;
    let appliedCloudInitFrame = false;
    const loadCloud = async () => {
      const cloud = await fetchCloudTournamentMatchLog(
        tournament.id,
        pairing.round,
        pairing.playerA.participantId,
        pairing.playerB!.participantId
      );
      if (!cancelled && cloud && cloud.frames.length > 0) {
        setSpecLog(cloud);
        if (
          !appliedCloudInitFrame &&
          typeof tournamentSpectatorContext.initialSpecFrame === 'number' &&
          tournamentSpectatorContext.initialSpecFrame > 0
        ) {
          appliedCloudInitFrame = true;
          setSpecCursor(
            Math.max(
              0,
              Math.min(cloud.frames.length - 1, Math.floor(tournamentSpectatorContext.initialSpecFrame))
            )
          );
        }
      }
    };
    void loadCloud();

    const unsub = subscribeTournamentTvUpdates((incoming) => {
      if (
        incoming.tournamentId === tournament.id &&
        incoming.round === pairing.round &&
        incoming.tableNumber === pairing.tableNumber
      ) {
        setSpecLog(incoming);
      }
    });
    const poll = window.setInterval(() => {
      void loadCloud();
    }, 3000);
    return () => {
      cancelled = true;
      unsub();
      window.clearInterval(poll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [specMatchIdentity]);

  // 1-second wall-clock tick for live broadcasts & turn clocks
  useEffect(() => {
    if (!isSpectatorMode) return;
    const id = window.setInterval(() => {
      setSpecNowMs(getTournamentNowMs());
    }, 1000);
    return () => window.clearInterval(id);
  }, [isSpectatorMode]);

  const isSpecLiveMatch = Boolean(
    isSpectatorMode &&
      tournamentSpectatorContext?.variant !== 'personal_replay' &&
      specLog &&
      (!specLog.isCompleted || specNowMs < specLog.matchFinishMs)
  );

  const handleJumpToNextSpecClimax = () => {
    if (specClimaxMarkers.length === 0) return;
    startAdaptiveMusic();
    const nextMarker =
      specClimaxMarkers.find((m) => m.frameIndex > specCursor + 1) ??
      specClimaxMarkers[0];
    setSpecFollowLive(false);
    setSpecCursor(nextMarker.leadInIndex);
    setSpecIsPlaying(true);
  };

  const handleShareSpectatorLink = async (mode: 'url' | 'discord' = 'url') => {
    if (!tournamentSpectatorContext || specShareFeedback === 'sharing') return;
    const base = `${window.location.origin}${window.location.pathname}`;
    let shareUrl = base;

    try {
      if (
        tournamentSpectatorContext.variant === 'personal_replay' &&
        tournamentSpectatorContext.personalEntry
      ) {
        setSpecShareFeedback('sharing');
        const shareId = await publishPersonalReplayShareToCloud(
          tournamentSpectatorContext.personalEntry
        );
        const frameParam = specCursor > 0 ? `&tframe=${specCursor}` : '';
        shareUrl = `${base}?replay=${encodeURIComponent(shareId)}${frameParam}`;
      } else if (
        tournamentSpectatorContext.liveShareKey &&
        tournamentSpectatorContext.liveShareKey.startsWith('trn_')
      ) {
        const parts = tournamentSpectatorContext.liveShareKey.slice(4).split('__');
        if (parts.length >= 3) {
          shareUrl = `${base}?tid=${encodeURIComponent(parts[0])}&tround=${parts[1]}&ttable=${parts[2]}`;
        }
      } else if (tournamentSpectatorContext.liveShareKey) {
        const frameParam = !isSpecLiveMatch && specCursor > 0 ? `&tframe=${specCursor}` : '';
        shareUrl = `${base}?live=${encodeURIComponent(
          tournamentSpectatorContext.liveShareKey
        )}${frameParam}`;
      } else {
        const frameParam = !isSpecLiveMatch && specCursor > 0 ? `&tframe=${specCursor}` : '';
        shareUrl = `${base}?tid=${encodeURIComponent(
          tournamentSpectatorContext.tournament.id
        )}&tround=${tournamentSpectatorContext.pairing.round}&ttable=${
          tournamentSpectatorContext.pairing.tableNumber
        }${frameParam}`;
      }

      setLastSharedSpecUrl(shareUrl);

      const safeP1 = (gameState.player.name || 'Soberano').replace(/[[\]]/g, '').trim();
      const safeP2 = (gameState.ai.name || 'Soberano').replace(/[[\]]/g, '').trim();
      const clipboardText =
        mode === 'discord'
          ? `[Partida: ${safeP1} × ${safeP2}](${shareUrl})`
          : shareUrl;

      let copiedOk = false;
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(clipboardText);
          copiedOk = true;
        } catch {
          copiedOk = false;
        }
      }
      if (!copiedOk) {
        const ta = document.createElement('textarea');
        ta.value = clipboardText;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }

      if (
        mode === 'url' &&
        typeof navigator.share === 'function' &&
        typeof window !== 'undefined' &&
        window.innerWidth <= 768
      ) {
        void navigator
          .share({
            title: `${gameState.player.name} × ${gameState.ai.name} — Chromatic Pact`,
            url: shareUrl,
          })
          .catch(() => {});
      }

      setSpecShareFeedback(mode === 'discord' ? 'copied_discord' : 'copied_url');
      if (specShareTimerRef.current !== null) {
        window.clearTimeout(specShareTimerRef.current);
      }
      specShareTimerRef.current = window.setTimeout(() => {
        setSpecShareFeedback('idle');
      }, 2200);
    } catch {
      setSpecShareFeedback('idle');
    }
  };

  const specVisibleMaxIdx = useMemo(() => {
    if (!specLog || specLog.frames.length === 0) return 0;
    if (!isSpecLiveMatch) return specLog.frames.length - 1;
    let idx = 0;
    for (let i = 0; i < specLog.frames.length; i += 1) {
      if (specLog.frames[i].atMs <= specNowMs) idx = i;
    }
    return idx;
  }, [specLog, isSpecLiveMatch, specNowMs]);

  // Follow live broadcast edge step-by-step (including the final lethal blow when matchFinishMs is reached!)
  useEffect(() => {
    const shouldFollowStream =
      specFollowLive &&
      (isSpecLiveMatch || isHomeLiveShowcase || specStartedAsLiveRef.current);
    if (!shouldFollowStream) return;
    if (specVisibleMaxIdx - specCursor > 4 && !combatAnim && !spectacleFx) {
      setSpecCursor(Math.max(0, specVisibleMaxIdx - 1));
      return;
    }
    if (specCursor < specVisibleMaxIdx && !combatAnim && !spectacleFx) {
      const t = window.setTimeout(() => {
        setSpecCursor((prev) =>
          prev < specVisibleMaxIdx ? prev + 1 : specVisibleMaxIdx
        );
      }, 260);
      return () => window.clearTimeout(t);
    }
  }, [
    isSpecLiveMatch,
    isHomeLiveShowcase,
    specFollowLive,
    specCursor,
    specVisibleMaxIdx,
    combatAnim,
    spectacleFx,
  ]);

  // Auto-play timer for past match replays (1x / 2x / 4x)
  useEffect(() => {
    if (!isSpectatorMode || isSpecLiveMatch || !specIsPlaying) return;
    if (specCursor >= specVisibleMaxIdx) {
      setSpecIsPlaying(false);
      return;
    }
    if (combatAnim || spectacleFx) return;

    const delayMs = specSpeed === 4 ? 480 : specSpeed === 2 ? 900 : 1580;
    const t = window.setTimeout(() => {
      setSpecCursor((prev) => Math.min(specVisibleMaxIdx, prev + 1));
    }, delayMs);
    return () => window.clearTimeout(t);
  }, [
    isSpectatorMode,
    isSpecLiveMatch,
    specIsPlaying,
    specCursor,
    specVisibleMaxIdx,
    specSpeed,
    combatAnim,
    spectacleFx,
  ]);

  // Apply cursor & perspective transitions onto BattleArena's real GameState with full combat FX!
  useEffect(() => {
    if (!tournamentSpectatorContext || !specLog || specLog.frames.length === 0) return;
    const maxBound = specLog.frames.length - 1;
    const clampedIdx = Math.max(0, Math.min(maxBound, specCursor));
    const prevIdx = prevAppliedSpecCursorRef.current;
    const flipChanged = prevAppliedSpecFlipRef.current !== specFlipped;
    const logChanged = prevAppliedSpecLogRef.current !== specLog;
    if (!flipChanged && !logChanged && clampedIdx === prevIdx) return;

    prevAppliedSpecCursorRef.current = clampedIdx;
    prevAppliedSpecFlipRef.current = specFlipped;
    prevAppliedSpecLogRef.current = specLog;

    const rawNext = getArenaGameStateForReplayFrame(
      tournamentSpectatorContext.tournament,
      tournamentSpectatorContext.pairing,
      specLog,
      clampedIdx
    );
    const nextLocalized = specFlipped ? flipGameStatePerspective(rawNext) : rawNext;

    if (nextLocalized.phase !== 'gameover') {
      setRewardClaimed(false);
      setGameoverStage('none');
    }

    const isSingleForwardStep = !flipChanged && clampedIdx === prevIdx + 1;
    if (!isSingleForwardStep) {
      setCombatAnim(null);
      setSpectacleFx(null);
      setGameState(nextLocalized);
      return;
    }

    const nextFrame = specLog.frames[clampedIdx];
    const prevRaw = getArenaGameStateForReplayFrame(
      tournamentSpectatorContext.tournament,
      tournamentSpectatorContext.pairing,
      specLog,
      prevIdx
    );
    const prevLocalized = specFlipped ? flipGameStatePerspective(prevRaw) : prevRaw;

    // Determine whether Side A corresponds to 'player' or 'ai' after optional perspective flip
    const actorOwner: 'player' | 'ai' =
      nextFrame.actorSide === 'B'
        ? specFlipped
          ? 'player'
          : 'ai'
        : specFlipped
        ? 'ai'
        : 'player';

    const isAttackFrame =
      nextFrame.kind === 'attack' ||
      (nextFrame.kind === 'finish' &&
        (Boolean(nextFrame.attackerId) ||
          (nextLocalized.combatLog[0]?.category === 'combat' &&
            nextLocalized.combatLog[0]?.id !== prevLocalized.combatLog[0]?.id)));

    if (isAttackFrame) {
      const attackerUnit = findAttackingUnitBetweenStates(
        prevLocalized,
        nextLocalized,
        actorOwner,
        nextFrame.attackerId,
        nextFrame.cardId
      );

      const localizedFrameTargetId =
        nextFrame.targetId === 'A-sovereign'
          ? specFlipped
            ? 'ai-sovereign'
            : 'player-sovereign'
          : nextFrame.targetId === 'B-sovereign'
          ? specFlipped
            ? 'player-sovereign'
            : 'ai-sovereign'
          : nextFrame.targetId;

      const hitTargetId = resolveActualAttackVisualTarget(
        prevLocalized,
        nextLocalized,
        actorOwner,
        attackerUnit?.instanceId,
        localizedFrameTargetId
      );

      if (attackerUnit) {
        const isRanged =
          attackerUnit.row === 'rearguard' && attackerUnit.keywords.includes('Alcance');
        const isHeavy =
          attackerUnit.currentAtk >= 5 || nextLocalized.phase === 'gameover';
        measureAndTriggerLunge(
          attackerUnit.instanceId,
          hitTargetId,
          attackerUnit.card.domain,
          isRanged,
          () => {
            setGameState(nextLocalized);
          },
          isHeavy
        );
        return;
      }
      playSfx('attack');
      setGameState(nextLocalized);
      return;
    }

    if (nextFrame.kind === 'play_card') {
      const playedCard =
        (nextFrame.cardId ? CARDS_BY_ID[nextFrame.cardId] : undefined) ??
        prevLocalized[actorOwner].hand.find((c) =>
          nextFrame.summary.includes(`[${c.name}]`)
        );
      if (playedCard) {
        playSfx(
          playedCard.type === 'spell' || playedCard.type === 'reaction' ? 'spell' : 'summon'
        );
        triggerCardPlaySpectacle(
          actorOwner,
          playedCard,
          prevLocalized,
          nextLocalized.feedbacks[0]?.targetId
        );
      } else {
        playSfx('summon');
      }
      setGameState(nextLocalized);
      return;
    }

    if (nextFrame.kind === 'ascend') {
      playSfx('ascend');
      const prevActorUnits = getAllBoardUnits(prevLocalized[actorOwner]);
      const nextActorUnits = getAllBoardUnits(nextLocalized[actorOwner]);
      const ascendedUnit = nextActorUnits.find((nu) => {
        const pu = prevActorUnits.find((x) => x.instanceId === nu.instanceId);
        return pu && !pu.isAscended && nu.isAscended;
      });
      if (ascendedUnit) {
        triggerAscendSpectacle(ascendedUnit);
      }
      setGameState(nextLocalized);
      return;
    }

    if (nextFrame.kind === 'channel') {
      playSfx('channel');
    } else if (nextFrame.kind === 'power') {
      playSfx('spell');
    } else if (nextFrame.kind === 'end_turn') {
      playSfx('draw');
    }
    setGameState(nextLocalized);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [specCursor, specFlipped, specLog]);

  // AI step-by-step execution with Physical Lunge Animation on AI Attacks!
  useEffect(() => {
    if (
      isSpectatorMode ||
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

      if (step.attackerId || step.actionSummary.includes('ataque')) {
        // Identify which AI unit just attacked and the exact defender unit or Sovereign that absorbed the blow
        const aiAttacker = findAttackingUnitBetweenStates(
          gameState,
          step.nextState,
          'ai',
          step.attackerId
        );
        const hitTargetId = resolveActualAttackVisualTarget(
          gameState,
          step.nextState,
          'ai',
          aiAttacker?.instanceId,
          step.targetId
        );

        if (aiAttacker) {
          const isRanged =
            aiAttacker.row === 'rearguard' && aiAttacker.keywords.includes('Alcance');
          const isHeavy =
            aiAttacker.currentAtk >= 5 || step.nextState.phase === 'gameover';
          measureAndTriggerLunge(
            aiAttacker.instanceId,
            hitTargetId,
            aiAttacker.card.domain,
            isRanged,
            () => {
              setGameState(step.nextState);
            },
            isHeavy
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
      activeDomain = resolvePrimaryBossDomain(campaignBoss.domains);
    } else {
      const pTerrain = getBiomeTerrainInfo(gameState.player);
      activeDomain = pTerrain.domain;
    }

    // Determine musical intensity stage (0..4) — Domain Expansion always escalates to maximum intensity ('climax')
    let stage: MusicIntensityStage = 'tactical';
    const isNearDeath = gameState.player.hp <= 14 || gameState.ai.hp <= 14;
    const isLateBossClimax =
      (Boolean(campaignBoss) || isSpectatorMode || Boolean(tournamentContext)) &&
      gameState.turn >= 6;
    const hasDomainExpansion = Boolean(gameState.domainExpansion);

    if (hasDomainExpansion || isNearDeath || hasAscendedUnit || isLateBossClimax) {
      stage = 'climax';
    } else if (hasLegendaryUnit) {
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

      if (isSpectatorMode) {
        playSfx('victory');
        return;
      }

      if (gameState.winner === 'player') {
        trackAdsEvent('match_victory', {
          mode: tournamentContext
            ? 'tournament'
            : onlineMatch
            ? 'pvp'
            : campaignBoss
            ? 'campaign'
            : tacticalProblem
            ? 'problem'
            : 'arena',
          isGuest,
        });
      }

      if (tournamentContext) {
        const score: 1 | 0.5 | 0 =
          gameState.winner === 'player' ? 1 : gameState.winner === 'ai' ? 0 : 0.5;
        playSfx(score === 1 ? 'victory' : 'defeat');
        if (score === 1) {
          recordDailyQuestEvent('match_won', 1);
          if (onRewardGold) {
            onRewardGold(15, `Vitória na Rodada ${tournamentContext.roundNumber} do Torneio`);
          }
        }
        tournamentContext.onTournamentMatchResult({
          score,
          hpDiff: gameState.player.hp - gameState.ai.hp,
          turns: gameState.turn,
          reason: gameState.winReason || '',
        });
      } else if (gameState.winner === 'player') {
        playSfx('victory');
        if (tacticalProblem) {
          const handleSolved = (mod: typeof import('../data/problems')) => {
            const solvedRes = mod.markProblemAsSolved(tacticalProblem.id);
            if (solvedRes.isFirstTime && onRewardGold) {
              onRewardGold(
                tacticalProblem.goldReward,
                `Resolução do ${tacticalProblem.code}: ${tacticalProblem.title}`
              );
            }
            const dailyRes = recordDailyProblemAttemptResult(tacticalProblem.id, 'solved');
            if (solvedRes.entry.solvedOnFirstTry) {
              recordDailyQuestEvent('problem_solved_clean', 1);
            }
            if (dailyRes.earnedDailyBonusGold > 0 && onRewardGold) {
              onRewardGold(
                dailyRes.earnedDailyBonusGold,
                `🎯 Bônus do Problema do Dia (${tacticalProblem.code} de 1ª sem Dica)`
              );
            }
          };
          if (lazyProblemsModule) {
            handleSolved(lazyProblemsModule);
          } else {
            import('../data/problems').then((m) => {
              setLazyProblemsModule(m);
              handleSolved(m);
            });
          }
        } else if (onlineMatch) {
          recordDailyQuestEvent('match_won', 1);
          onlineMatch.onPvpResult(true);
          if (onRewardGold) onRewardGold(VICTORY_GOLD_REWARD, 'Vitória em Duelo Online 1x1');
        } else if (campaignBoss && onCampaignVictory) {
          recordDailyQuestEvent('match_won', 1);
          onCampaignVictory(campaignBoss);
        } else if (onRewardGold) {
          recordDailyQuestEvent('match_won', 1);
          onRewardGold(VICTORY_GOLD_REWARD, 'Vitória em Duelo na Arena');
        }
      } else {
        playSfx('defeat');
        if (onlineMatch) {
          onlineMatch.onPvpResult(false);
        } else if (campaignBoss && onCampaignDefeat) {
          onCampaignDefeat(campaignBoss);
        }
      }

      if (!tacticalProblem && onMatchConcluded) {
        onMatchConcluded({
          didWin: gameState.winner === 'player',
          usedDeckId: campaignBoss ? null : selectedPlayerDeckId,
        });
      }
    }
  }, [
    gameState.phase,
    gameState.winner,
    rewardClaimed,
    isSpectatorMode,
    campaignBoss,
    onCampaignVictory,
    onCampaignDefeat,
    onRewardGold,
  ]);

  useEffect(() => {
    if (gameState.phase !== 'gameover' || gameoverStage !== 'cinematic' || isHomeLiveShowcase) {
      return;
    }
    const timer = window.setTimeout(() => {
      setGameoverStage('modal');
    }, 2550);
    return () => window.clearTimeout(timer);
  }, [gameState.phase, gameoverStage, isHomeLiveShowcase]);

  const isPlayerTurn =
    !isSpectatorMode && gameState.activePlayer === 'player' && gameState.phase !== 'gameover';

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
    clearHandSelectionAndDrawers();
  };

  const handleQuickChannelCard = (handIdx: number) => {
    if (!isPlayerTurn || gameState.player.hasChanneledThisTurn) return;
    if (!isSpectatorMode && !hasTrackedFirstActionRef.current) {
      hasTrackedFirstActionRef.current = true;
      trackAdsEvent('first_card_played', { action: 'channel_essence', isGuest });
    }
    const next = channelCard(gameState, 'player', handIdx);
    playSfx('channel');
    setGameState(next);
    clearHandSelectionAndDrawers();
  };

  const handleQuickBurnCard = (handIdx: number) => {
    if (!isPlayerTurn) return;
    const next = burnCardForEssence(gameState, 'player', handIdx);
    playSfx('channel');
    setGameState(next);
    clearHandSelectionAndDrawers();
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
    const isClash = Boolean(gameState.domainExpansion && gameState.domainExpansion.owner !== 'player');
    triggerSovereignSpectacle(
      'player',
      isClash
        ? `⚡⛩️ DISPUTA DE DOMÍNIOS: ${spec.name.toUpperCase()} vs ${gameState.domainExpansion!.name.toUpperCase()}`
        : `⛩️ EXPANSÃO DE DOMÍNIO: ${spec.name.toUpperCase()}`,
      isClash
        ? 'As duas barreiras colidem 50/50 no centro da mesa! O Acerto Garantido de ambos foi anulado!'
        : `${spec.potencyDesc} • ${spec.sureHitDesc}`,
      check.domain,
      pCard
    );
    recordDailyQuestEvent('domain_invoked', 1);
    if (isClash) {
      recordDailyQuestEvent('domain_clashed_or_broken', 1);
    }
    const next = invokeDomainExpansion(gameState, 'player');
    playSfx(isClash ? 'domain_clash' : 'domain_expand');
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
    recordDailyQuestEvent('domain_clashed_or_broken', 1);
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
      recordDailyQuestEvent('domain_clashed_or_broken', 1);
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
    const effectiveTargetId = targetId ?? focusedBoardUnitId ?? undefined;
    const card = gameState.player.hand[handIdx];
    if (card) {
      triggerCardPlaySpectacle('player', card, gameState, effectiveTargetId);
    }
    const next = playCard(gameState, 'player', handIdx, { targetId: effectiveTargetId });
    playSfx('spell');
    setGameState(next);
    clearHandSelectionAndDrawers();
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
    clearHandSelectionAndDrawers();
  };

  const handleExecuteUnitAttackOnTarget = (attackerUnit: BoardUnit, targetId: string) => {
    if (!isPlayerTurn || combatAnim) return;
    const targets = getValidAttackTargets(gameState, attackerUnit.instanceId);
    if (!targets.includes(targetId)) return;

    const resolvedNextState = executeAttack(gameState, attackerUnit.instanceId, targetId);
    if (resolvedNextState === gameState) return;

    const visualTargetId = resolveActualAttackVisualTarget(
      gameState,
      resolvedNextState,
      'player',
      attackerUnit.instanceId,
      targetId
    );
    const isRanged =
      attackerUnit.row === 'rearguard' && attackerUnit.keywords.includes('Alcance');
    const prevOut = allTargetPreviews[targetId];
    const isHeavy = Boolean(
      attackerUnit.currentAtk >= 5 ||
        visualTargetId === 'ai-sovereign' ||
        prevOut?.targetDies ||
        resolvedNextState.phase === 'gameover'
    );
    setSelectedAttackerId(null);
    setFocusedBoardUnitId(null);

    measureAndTriggerLunge(
      attackerUnit.instanceId,
      visualTargetId,
      attackerUnit.card.domain,
      isRanged,
      () => {
        setGameState(resolvedNextState);
      },
      isHeavy
    );
  };

  // Auto-attack with all ready units: when Sovereign is a valid target (e.g. Domain Expansion Sure-Hit or open lane), ALWAYS attacks the Sovereign directly!
  const handleAutoAttackAll = () => {
    if (!isPlayerTurn || combatAnim) return;
    const units = getAllBoardUnits(gameState.player);
    const firstReady = units.find(
      (u) => getValidAttackTargets(gameState, u.instanceId).length > 0
    );
    if (!firstReady) return;

    const targets = getValidAttackTargets(gameState, firstReady.instanceId);
    let chosenTarget = targets.includes('ai-sovereign') ? 'ai-sovereign' : targets[0];
    if (!targets.includes('ai-sovereign')) {
      const enemyUnits = getAllBoardUnits(gameState.ai).filter((eu) =>
        targets.includes(eu.instanceId)
      );
      const killableEnemy = enemyUnits.find((eu) => eu.currentHp <= firstReady.currentAtk);
      if (killableEnemy) {
        chosenTarget = killableEnemy.instanceId;
      }
    }

    handleExecuteUnitAttackOnTarget(firstReady, chosenTarget);
  };

  const handleDeployToPlayerSlot = (
    row: RowType,
    slotIndex: number,
    explicitTargetId?: string
  ) => {
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
      const effectiveTargetId = explicitTargetId ?? focusedBoardUnitId ?? undefined;
      triggerCardPlaySpectacle('player', selectedHandCard, gameState, effectiveTargetId);
      const next = playCard(gameState, 'player', selectedHandIndex, {
        row,
        slotIndex,
        targetId: effectiveTargetId,
      });
      playSfx('summon');
      setGameState(next);
      clearHandSelectionAndDrawers();
    }
  };

  const handleClickFriendlyUnit = (unit: BoardUnit, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (combatAnim) return;
    if (!isPlayerTurn) {
      closeAllArenaDrawers();
      const friendlySlotUnits = getSlotUnits(gameState.player, unit.row, unit.slotIndex);
      if (focusedBoardUnitId === unit.instanceId && friendlySlotUnits.length > 1) {
        const curIdx = friendlySlotUnits.findIndex((u) => u.instanceId === unit.instanceId);
        const nextFriendly = friendlySlotUnits[(curIdx + 1) % friendlySlotUnits.length];
        setFocusedBoardUnitId(nextFriendly.instanceId);
      } else {
        setFocusedBoardUnitId((prev) =>
          prev === unit.instanceId ? null : unit.instanceId
        );
      }
      setIsCommandDockMinimized(false);
      return;
    }

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
      // 2. If holding a Creature, Relic, or Trap and clicking a slot that can stack (< 3 cards), stack it right into this slot and target this ally if applicable!
      if (
        (selectedHandCard.type === 'creature' ||
          (selectedHandCard.type === 'relic' && unit.row === 'rearguard') ||
          (selectedHandCard.type === 'reaction' && unit.row === 'rearguard')) &&
        canDeployToSlot(gameState.player, unit.row, unit.slotIndex)
      ) {
        handleDeployToPlayerSlot(unit.row, unit.slotIndex, unit.instanceId);
        return;
      }
      // 2b. If holding an ally-targeted Creature or Relic (e.g. Relic clicked on a Vanguard unit or full slot), deploy to best slot targeting this unit!
      if (
        (selectedHandCard.type === 'creature' || selectedHandCard.type === 'relic') &&
        targetMode === 'ally'
      ) {
        const targetRow: RowType =
          selectedHandCard.type === 'relic' ? 'rearguard' : selectedHandCard.preferredRow;
        const bestSlot = findBestDeploySlot(targetRow);
        const fallbackRow: RowType = targetRow === 'vanguard' ? 'rearguard' : 'vanguard';
        const finalRow =
          bestSlot !== -1
            ? targetRow
            : selectedHandCard.type === 'creature'
            ? fallbackRow
            : targetRow;
        const finalSlot = bestSlot !== -1 ? bestSlot : findBestDeploySlot(finalRow);
        if (finalSlot !== -1) {
          handleDeployToPlayerSlot(finalRow, finalSlot, unit.instanceId);
          return;
        }
      }
    }

    // 3. Select / deselect creature on board for attack, maneuver, ascension, or inspection
    closeAllArenaDrawers();
    const slotUnits = getSlotUnits(gameState.player, unit.row, unit.slotIndex);
    const isTogglingOff =
      focusedBoardUnitId === unit.instanceId &&
      (selectedAttackerId === unit.instanceId || selectedAttackerId === null);
    if (isTogglingOff) {
      if (slotUnits.length > 1) {
        const curIdx = slotUnits.findIndex((u) => u.instanceId === unit.instanceId);
        const nextUnit = slotUnits[(curIdx + 1) % slotUnits.length];
        setFocusedBoardUnitId(nextUnit.instanceId);
        setSelectedHandIndex(null);
        setIsCommandDockMinimized(false);
        const nextTargets = getValidAttackTargets(gameState, nextUnit.instanceId);
        setSelectedAttackerId(nextTargets.length > 0 ? nextUnit.instanceId : null);
      } else {
        setFocusedBoardUnitId(null);
        setSelectedAttackerId(null);
      }
    } else {
      setFocusedBoardUnitId(unit.instanceId);
      setSelectedHandIndex(null);
      setIsCommandDockMinimized(false);
      const targets = getValidAttackTargets(gameState, unit.instanceId);
      if (targets.length > 0) {
        setSelectedAttackerId(unit.instanceId);
      } else {
        setSelectedAttackerId(null);
      }
    }
  };

  const handleCycleSlotStack = (
    owner: 'player' | 'ai',
    row: RowType,
    slotIndex: number,
    e?: React.MouseEvent
  ) => {
    e?.stopPropagation();
    const slotUnits = getSlotUnits(gameState[owner], row, slotIndex).filter(
      (u) => owner === 'player' || !u.isTrap
    );
    if (slotUnits.length === 0) return;
    closeAllArenaDrawers();
    const currentId = selectedAttackerId ?? focusedBoardUnitId;
    const curIdx = slotUnits.findIndex((u) => u.instanceId === currentId);
    const nextUnit = slotUnits[(curIdx + 1) % slotUnits.length];
    setFocusedBoardUnitId(nextUnit.instanceId);
    setSelectedHandIndex(null);
    setIsCommandDockMinimized(false);
    if (owner === 'player' && isPlayerTurn) {
      const targets = getValidAttackTargets(gameState, nextUnit.instanceId);
      setSelectedAttackerId(targets.length > 0 ? nextUnit.instanceId : null);
    } else {
      setSelectedAttackerId(null);
    }
  };

  const handleSelectPlayerSlot = (row: RowType, slotIndex: number, e?: React.MouseEvent) => {
    if (!isPlayerTurn || combatAnim) return;
    if (selectedHandIndex !== null && selectedHandCard && canPlaySelectedHandCard.allowed) {
      if (
        selectedHandCard.type === 'creature' ||
        (selectedHandCard.type === 'relic' && row === 'rearguard') ||
        (selectedHandCard.type === 'reaction' && row === 'rearguard')
      ) {
        e?.stopPropagation();
        handleDeployToPlayerSlot(row, slotIndex);
        return;
      }
    }
    if (isHandPinnedOpen || isHandHovered) {
      setIsHandPinnedOpen(false);
      setIsHandHovered(false);
    }
    const slotUnits = getSlotUnits(gameState.player, row, slotIndex);
    if (slotUnits.length > 0) {
      e?.stopPropagation();
      const currentlyFocusedInSlot = slotUnits.find(
        (u) => u.instanceId === focusedBoardUnitId || u.instanceId === selectedAttackerId
      );
      const targetUnitInSlot =
        currentlyFocusedInSlot ??
        slotUnits.find((u) => getValidAttackTargets(gameState, u.instanceId).length > 0) ??
        slotUnits[slotUnits.length - 1];
      handleClickFriendlyUnit(targetUnitInSlot, e);
    }
  };

  const handleClickEnemyUnit = (enemyUnit: BoardUnit, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (combatAnim) return;
    if (!isPlayerTurn) {
      if (!enemyUnit.isTrap) {
        closeAllArenaDrawers();
        const enemySlotUnits = getSlotUnits(
          gameState.ai,
          enemyUnit.row,
          enemyUnit.slotIndex
        ).filter((u) => !u.isTrap);
        if (focusedBoardUnitId === enemyUnit.instanceId && enemySlotUnits.length > 1) {
          const curIdx = enemySlotUnits.findIndex((u) => u.instanceId === enemyUnit.instanceId);
          const nextEnemy = enemySlotUnits[(curIdx + 1) % enemySlotUnits.length];
          setFocusedBoardUnitId(nextEnemy.instanceId);
        } else {
          setFocusedBoardUnitId((prev) =>
            prev === enemyUnit.instanceId ? null : enemyUnit.instanceId
          );
        }
        setIsCommandDockMinimized(false);
      }
      return;
    }

    if (selectedAttackerId && validAttackTargets.includes(enemyUnit.instanceId)) {
      const attackerUnit = getAllBoardUnits(gameState.player).find(
        (u) => u.instanceId === selectedAttackerId
      );
      if (attackerUnit) {
        handleExecuteUnitAttackOnTarget(attackerUnit, enemyUnit.instanceId);
      }
      return;
    }

    if (
      selectedHandIndex !== null &&
      selectedHandCard &&
      canPlaySelectedHandCard.allowed &&
      (selectedHandCard.type === 'spell' || selectedHandCard.type === 'reaction')
    ) {
      handleQuickCastSpell(selectedHandIndex, enemyUnit.instanceId);
      return;
    }

    if (
      selectedHandIndex !== null &&
      selectedHandCard &&
      canPlaySelectedHandCard.allowed &&
      (selectedHandCard.type === 'creature' || selectedHandCard.type === 'relic') &&
      doesCardUseTarget(selectedHandCard) === 'enemy'
    ) {
      const targetRow: RowType =
        selectedHandCard.type === 'relic' ? 'rearguard' : selectedHandCard.preferredRow;
      const bestSlot = findBestDeploySlot(targetRow);
      const fallbackRow: RowType = targetRow === 'vanguard' ? 'rearguard' : 'vanguard';
      const finalRow =
        bestSlot !== -1
          ? targetRow
          : selectedHandCard.type === 'creature'
          ? fallbackRow
          : targetRow;
      const finalSlot = bestSlot !== -1 ? bestSlot : findBestDeploySlot(finalRow);
      if (finalSlot !== -1) {
        handleDeployToPlayerSlot(finalRow, finalSlot, enemyUnit.instanceId);
        return;
      }
    }

    if (!enemyUnit.isTrap) {
      closeAllArenaDrawers();
      const enemySlotUnits = getSlotUnits(
        gameState.ai,
        enemyUnit.row,
        enemyUnit.slotIndex
      ).filter((u) => !u.isTrap);
      if (focusedBoardUnitId === enemyUnit.instanceId && enemySlotUnits.length > 1) {
        const curIdx = enemySlotUnits.findIndex((u) => u.instanceId === enemyUnit.instanceId);
        const nextEnemy = enemySlotUnits[(curIdx + 1) % enemySlotUnits.length];
        setFocusedBoardUnitId(nextEnemy.instanceId);
      } else {
        setFocusedBoardUnitId((prev) =>
          prev === enemyUnit.instanceId ? null : enemyUnit.instanceId
        );
      }
      setIsCommandDockMinimized(false);
    }
  };

  const handleClickAiSovereign = () => {
    if (!isPlayerTurn || combatAnim) return;

    if (selectedAttackerId && validAttackTargets.includes('ai-sovereign')) {
      const attackerUnit = getAllBoardUnits(gameState.player).find(
        (u) => u.instanceId === selectedAttackerId
      );
      if (attackerUnit) {
        handleExecuteUnitAttackOnTarget(attackerUnit, 'ai-sovereign');
      }
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
    recordDailyQuestEvent('unit_ascended', 1);
    const next = ascendUnit(gameState, 'player', unit.instanceId);
    playSfx('ascend');
    setGameState(next);
  };

  const handleEndPlayerTurn = () => {
    if (!isPlayerTurn || combatAnim) return;
    if (tacticalProblem && gameState.ai.hp > 0) {
      recordProblemAttemptFailed(tacticalProblem.id);
      recordDailyProblemAttemptResult(tacticalProblem.id, 'failed');
      setShowProblemIncompleteModal(true);
      playSfx('hit');
      return;
    }
    setSelectedHandIndex(null);
    setSelectedAttackerId(null);
    setFocusedBoardUnitId(null);
    setIsHandPinnedOpen(false);
    setIsHandHovered(false);
    const next = endTurn(gameState);
    playSfx('draw');
    setGameState(next);
  };

  // Keyboard shortcuts in Arena: Escape = Dismiss modals/drawers/selection, Space = Advance Phase / Execute Combat, C = Channel selected card, V = Deploy Vanguard, R = Deploy Rearguard
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

      if (e.key === 'Escape') {
        e.preventDefault();
        if (specCinemaMode) {
          toggleSpecCinemaMode(false);
          return;
        }
        setInspectCard(null);
        setShowQuickRules(false);
        setShowTacticalAdvisor(false);
        setShowSacrificeBreakModal(false);
        setShowSurrenderConfirm(false);
        setCryptModalOwner(null);
        setSelectedAttackerId(null);
        clearHandSelectionAndDrawers();
        closeAllArenaDrawers();
        return;
      }

      if (isSpectatorMode) {
        if (e.key.toLowerCase() === 'f') {
          e.preventDefault();
          toggleSpecCinemaMode();
          return;
        }
        if (e.code === 'Space') {
          e.preventDefault();
          if (!isSpecLiveMatch) {
            if (specCursor >= specVisibleMaxIdx) {
              setSpecCursor(0);
              setSpecIsPlaying(true);
            } else {
              setSpecIsPlaying((p) => !p);
            }
          }
          return;
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          setSpecIsPlaying(false);
          setSpecFollowLive(false);
          setSpecCursor((c) => Math.max(0, c - 1));
          return;
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          setSpecIsPlaying(false);
          setSpecCursor((c) => {
            const next = Math.min(specVisibleMaxIdx, c + 1);
            if (isSpecLiveMatch && next >= specVisibleMaxIdx) setSpecFollowLive(true);
            return next;
          });
          return;
        }
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
    const coloredDomains: Exclude<Domain, 'neutral'>[] = ['red', 'blue', 'purple', 'green', 'gold'];
    const activeColored = coloredDomains.filter((dom) => (affinities[dom] ?? 0) > 0);
    const activeList: Domain[] =
      activeColored.length > 0
        ? activeColored
        : (affinities.neutral ?? 0) > 0
        ? ['neutral']
        : [];
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
          {prev.breaksTargetShield ? (
            <>
              ⚔️<span className="hide-on-mobile"> Quebra</span> Escudo
            </>
          ) : (
            <>
              ⚔️<span className="hide-on-mobile"> Causará </span>-{prev.damageToTarget}
              <span className="hide-on-mobile"> dano</span>
            </>
          )}
        </span>
        {!prev.isSovereignTarget && (
          <span className="tcp-dmg-in">
            {prev.breaksAttackerShield ? (
              <>
                <span className="hide-on-mobile">• </span>🛡️0
                <span className="hide-on-mobile"> Escudo</span>
              </>
            ) : (
              <>
                <span className="hide-on-mobile">• </span>🛡️-{revideVal}
                <span className="hide-on-mobile"> revide</span>
              </>
            )}
          </span>
        )}
        {(prev.targetDies || prev.lethalTouchTriggeredOnTarget) && (
          <span className="tcp-dmg-lethal">
            <span className="hide-on-mobile">• </span>☠️
            <span className="hide-on-mobile"> Abate Garantido</span>
          </span>
        )}
        {prev.slotSplashCount > 0 && (
          <span className="tcp-dmg-splash hide-on-mobile">
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
      {/* COLLAPSIBLE TACTICAL PROBLEM HUD BAR (1-TURN LETHAL PUZZLE MODE — CAN BE MINIMIZED/HIDDEN) */}
      {tacticalProblem && !isProblemHudMinimized && (
        <div
          style={{
            position: 'fixed',
            top: 86,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1180,
            width: 'min(920px, 95vw)',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(9, 13, 24, 0.98))',
            border: `1.5px solid ${PROBLEM_DIFFICULTY_META[tacticalProblem.difficulty].color}`,
            borderRadius: 12,
            padding: '7px 12px',
            boxShadow: '0 10px 28px rgba(0, 0, 0, 0.78)',
            color: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: 6,
                  background: PROBLEM_DIFFICULTY_META[tacticalProblem.difficulty].bg,
                  border: `1px solid ${PROBLEM_DIFFICULTY_META[tacticalProblem.difficulty].border}`,
                  color: PROBLEM_DIFFICULTY_META[tacticalProblem.difficulty].color,
                  fontSize: '0.68rem',
                  fontWeight: 900,
                }}
              >
                ♟️ {tacticalProblem.code} • {PROBLEM_DIFFICULTY_META[tacticalProblem.difficulty].starsText}
              </span>
              <strong style={{ fontSize: '0.84rem', fontFamily: 'Cinzel, serif', color: '#fef08a' }}>
                {tacticalProblem.title}
              </strong>
              <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                — 🎯 {tacticalProblem.objectiveText} (Rival: <strong style={{ color: '#f87171' }}>{gameState.ai.hp} ❤️</strong>)
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() =>
                  setProblemHintStage((prev) => {
                    const nextStage = ((prev + 1) % 3) as 0 | 1 | 2;
                    if (nextStage > 0) {
                      recordProblemHintUsed(tacticalProblem.id, nextStage);
                      recordDailyProblemAttemptResult(tacticalProblem.id, 'hint_used');
                    }
                    return nextStage;
                  })
                }
                style={{
                  padding: '4px 10px',
                  borderRadius: 8,
                  border: '1px solid rgba(250, 204, 21, 0.55)',
                  background: 'rgba(250, 204, 21, 0.16)',
                  color: '#fde047',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                {problemHintStage === 0
                  ? '💡 Dica 1/2'
                  : problemHintStage === 1
                  ? '💡 Dica 2/2'
                  : '✕ Ocultar Dica'}
              </button>
              <button
                type="button"
                onClick={restartCurrentProblem}
                style={{
                  padding: '4px 10px',
                  borderRadius: 8,
                  border: '1px solid rgba(56, 189, 248, 0.55)',
                  background: 'rgba(56, 189, 248, 0.16)',
                  color: '#7dd3fc',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                🔄 Reiniciar Turno
              </button>
              {onExitProblems && (
                <button
                  type="button"
                  onClick={onExitProblems}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 8,
                    border: '1px solid rgba(148, 163, 184, 0.38)',
                    background: 'rgba(30, 41, 59, 0.85)',
                    color: '#e2e8f0',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  📋 Lista de Problemas
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsProblemHudMinimized(true)}
                title="Minimizar/Ocultar painel do problema (reabra na barra inferior)"
                style={{
                  padding: '4px 10px',
                  borderRadius: 8,
                  border: '1px solid rgba(248, 113, 113, 0.55)',
                  background: 'rgba(127, 29, 29, 0.45)',
                  color: '#fecaca',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                ▴ Ocultar
              </button>
            </div>
          </div>

          {problemHintStage > 0 && (
            <div
              style={{
                padding: '7px 10px',
                borderRadius: 8,
                background: 'rgba(2, 6, 23, 0.85)',
                border: '1px solid rgba(250, 204, 21, 0.35)',
                fontSize: '0.76rem',
                lineHeight: 1.45,
                color: '#fef9c3',
              }}
            >
              {problemHintStage === 1 && (
                <div>
                  <strong>💡 Dica 1/2 (Tema Tático):</strong> {tacticalProblem.mechanicTag}
                </div>
              )}
              {problemHintStage >= 2 && (
                <div>
                  <strong>💡 Dica 2/2 (Pista Conceitual):</strong> {tacticalProblem.hint1}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* INCOMPLETE 1-TURN LETHAL PROBLEM MODAL */}
      {tacticalProblem && showProblemIncompleteModal && gameState.phase !== 'gameover' && (
        <div
          className="modal-backdrop"
          onClick={() => setShowProblemIncompleteModal(false)}
        >
          <div
            className="modal-panel"
            style={{ maxWidth: 480, textAlign: 'center', padding: '1.75rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="font-cinzel"
              style={{
                fontSize: '0.74rem',
                letterSpacing: '0.14em',
                color: '#fde047',
                marginBottom: 6,
              }}
            >
              ♟️ {tacticalProblem.code} • XEQUE-MATE EM 1 TURNO
            </div>
            <h3
              className="font-cinzel gold-gradient-text"
              style={{ fontSize: '1.3rem', marginBottom: 10 }}
            >
              O SOBERANO RIVAL SOBREVIVEU ({gameState.ai.hp} ❤️)!
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.86rem', lineHeight: 1.5, marginBottom: 16 }}>
              Nos <strong>Problemas Táticos</strong>, a vitória precisa ser conquistada{' '}
              <strong>neste exato turno</strong>. Revise a mesa, sua mão e sua Essência — ou consulte uma{' '}
              <strong>💡 Dica</strong> se precisar de uma pista conceitual!
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-fantasy btn-fantasy-primary"
                onClick={restartCurrentProblem}
              >
                🔄 Tentar Novamente (Reiniciar Turno)
              </button>
              {onSelectProblem && lazyProblemsModule && (() => {
                const { nextProblem } = lazyProblemsModule.getNextPlayableProblem(tacticalProblem.id);
                if (!nextProblem || nextProblem.id === tacticalProblem.id) return null;
                return (
                  <button
                    type="button"
                    className="btn-fantasy"
                    onClick={() => {
                      setShowProblemIncompleteModal(false);
                      onSelectProblem(nextProblem);
                    }}
                  >
                    ⏭️ Pular p/ {nextProblem.code} (Mesmo Grau)
                  </button>
                );
              })()}
              <button
                type="button"
                className="btn-fantasy"
                onClick={() => {
                  setShowProblemIncompleteModal(false);
                  setIsProblemHudMinimized(false);
                  const nextStage = problemHintStage < 1 ? 1 : 2;
                  recordProblemHintUsed(tacticalProblem.id, nextStage);
                  recordDailyProblemAttemptResult(tacticalProblem.id, 'hint_used');
                  setProblemHintStage(nextStage);
                }}
              >
                💡 Consultar Dica
              </button>
              <button
                type="button"
                className="btn-fantasy"
                onClick={() => setShowProblemIncompleteModal(false)}
              >
                Voltar à Mesa
              </button>
            </div>
          </div>
        </div>
      )}
      {/* CINEMATIC FLOATING MULLIGAN HUD (7 Cards in a Panoramic Arc Over the Battlefield) */}
      {isMulliganOpen && gameState.turn === 1 && gameState.phase !== 'gameover' && (
        <div className="mulligan-modal-backdrop">
          <div className="mulligan-modal-panel">
            <div className="mulligan-header" style={{ marginBottom: '0.6rem' }}>
              <div
                className="mulligan-title"
                style={{ textTransform: 'none', letterSpacing: '0.02em', fontSize: '1.35rem' }}
              >
                Escolha sua mão inicial
              </div>
              <div className="mulligan-subtitle">
                Selecione as cartas que deseja substituir antes do início do duelo.
                {isTimedCompetitiveMatch && (
                  <span
                    className={`mulligan-stat-pill ${
                      mulliganTimeLeft <= 10 ? 'is-timer-urgent' : ''
                    }`}
                    style={{ marginLeft: '0.5rem' }}
                    title="Tempo restante para confirmar sua mão inicial"
                  >
                    {Math.max(0, mulliganTimeLeft)}s
                  </span>
                )}
              </div>
            </div>

            <div className="mulligan-cards-row">
              {gameState.player.hand.map((card, idx) => {
                const isMarkedForSwap = mulliganSwapIndices.includes(idx);
                const total = gameState.player.hand.length;
                const mid = (total - 1) / 2;
                const offset = idx - mid;
                const arcAngle = offset * 1.4;
                const arcY = Math.abs(offset) * Math.abs(offset) * 1.8;

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
                        onInspect={setInspectCard}
                      />
                      {isMarkedForSwap && (
                        <div className="mulligan-swap-slash-overlay">
                          <span className="swap-slash-text" style={{ textTransform: 'none' }}>
                            Substituir
                          </span>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      className={`mulligan-swap-badge ${isMarkedForSwap ? 'swap' : 'keep'}`}
                      style={{ textTransform: 'none', letterSpacing: '0.02em' }}
                    >
                      {isMarkedForSwap ? 'Trocar' : 'Manter'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mulligan-actions-row">
              <button
                type="button"
                className="mulligan-exit-btn"
                onClick={handleExitBattle}
                style={{ textTransform: 'none' }}
              >
                Sair
              </button>
              <button
                type="button"
                className="mulligan-confirm-btn"
                onClick={handleConfirmMulligan}
                style={{ textTransform: 'none', letterSpacing: '0.02em' }}
              >
                <span>
                  {mulliganSwapIndices.length === 0
                    ? 'Confirmar mão inicial'
                    : `Trocar ${mulliganSwapIndices.length} e iniciar`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING VIDEO RECORDING CONTROL PILL (positioned outside cropped stage) */}
      {isRecordingVideo && (
        <div
          className="arena-video-rec-floating-pill"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="arena-video-rec-dot" />
          <span className="arena-video-rec-timer">
            Gravando{' '}
            {`${String(Math.floor(recordingElapsedSec / 60)).padStart(2, '0')}:${String(
              recordingElapsedSec % 60
            ).padStart(2, '0')}`}
          </span>
          <button
            type="button"
            className="arena-video-rec-save-btn"
            onClick={() => void handleToggleVideoRecording()}
          >
            Baixar Vídeo
          </button>
        </div>
      )}

      {/* AUTO-HIDING STUDIO CINEMA OVERLAY FOR CLEAN WINDOWS / REELS / YOUTUBE CAPTURE */}
      {isSpectatorMode && specCinemaMode && (
        <div
          className={`arena-cinema-hover-zone ${
            specCinemaHudVisible ? 'is-visible' : 'is-hidden'
          }`}
          onMouseMove={wakeCinemaStudioHud}
          onClick={wakeCinemaStudioHud}
        >
          <div
            className="arena-cinema-studio-pill"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="arena-cinema-studio-label">Estúdio</span>
            <button
              type="button"
              className={`arena-spec-btn ${specCinemaAspect === '16:9' ? 'is-active' : ''}`}
              onClick={() => {
                setSpecCinemaAspect('16:9');
                wakeCinemaStudioHud();
              }}
              title="Enquadramento Paisagem 16:9 (YouTube / X / Tela Cheia)"
            >
              16:9 Paisagem
            </button>
            <button
              type="button"
              className={`arena-spec-btn ${specCinemaAspect === '9:16' ? 'is-active' : ''}`}
              onClick={() => {
                setSpecCinemaAspect('9:16');
                wakeCinemaStudioHud();
              }}
              title="Enquadramento Vertical 9:16 centralizado (Instagram Reels / TikTok / Shorts)"
            >
              9:16 Vertical
            </button>
            {!isSpecLiveMatch && !isHomeLiveShowcase && specLog && (
              <>
                <button
                  type="button"
                  className="arena-spec-btn"
                  onClick={() => {
                    startAdaptiveMusic();
                    if (specCursor >= specVisibleMaxIdx) {
                      setSpecCursor(0);
                      setSpecIsPlaying(true);
                    } else {
                      setSpecIsPlaying((p) => !p);
                    }
                    wakeCinemaStudioHud();
                  }}
                >
                  {specIsPlaying ? '⏸ Pausar' : '▶ Reproduzir'}
                </button>
                {specClimaxMarkers.length > 0 && (
                  <button
                    type="button"
                    className="arena-spec-btn"
                    onClick={() => {
                      handleJumpToNextSpecClimax();
                      wakeCinemaStudioHud();
                    }}
                    title="Pular para o próximo momento de clímax da partida"
                  >
                    ✦ Clímax
                  </button>
                )}
              </>
            )}
            {isHomeLiveShowcase && tournamentSpectatorContext?.onCycleNextLiveMatch && (
              <button
                type="button"
                className="arena-spec-btn"
                onClick={() => {
                  tournamentSpectatorContext.onCycleNextLiveMatch?.();
                  wakeCinemaStudioHud();
                }}
              >
                Outra Mesa
              </button>
            )}
            <button
              type="button"
              className="arena-spec-btn exit"
              onClick={() => toggleSpecCinemaMode(false)}
              title="Sair do Modo Cinema (Esc ou F)"
            >
              Sair (Esc)
            </button>
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
                  ? spectacleFx.domain === 'neutral'
                    ? '⚙️⛩️'
                    : '👑⚡'
                  : DOMAIN_META[spectacleFx.domain]?.icon ?? '✨'}
              </span>
            </div>
          )}

          {/* Bespoke Axial Horological Astrolabe & Interlocking Gears Cutscene (Neutral Sovereign / Domain Expansion) */}
          {spectacleFx.kind === 'sovereign' && spectacleFx.domain === 'neutral' && (
            <div className="axial-matrix-domain-cutscene" aria-hidden="true">
              <div className="axial-zero-point-flash" />
              <div className="axial-astrolabe-stage">
                <svg viewBox="0 0 260 260" className="axial-astrolabe-svg outer-gear-wheel">
                  <circle cx="130" cy="130" r="112" fill="none" stroke="currentColor" strokeWidth="3.5" />
                  <circle cx="130" cy="130" r="98" fill="none" stroke="currentColor" strokeWidth="1.8" strokeDasharray="6 4" />
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                    <g key={deg} transform={`rotate(${deg} 130 130)`}>
                      <rect x="125" y="10" width="10" height="11" rx="1.5" fill="currentColor" />
                      <line x1="130" y1="22" x2="130" y2="34" stroke="currentColor" strokeWidth="2.4" />
                    </g>
                  ))}
                </svg>
                <svg viewBox="0 0 260 260" className="axial-astrolabe-svg inner-compass-wheel">
                  <circle cx="130" cy="130" r="72" fill="none" stroke="currentColor" strokeWidth="2.6" />
                  <polygon
                    points="130,58 148,112 202,130 148,148 130,202 112,148 58,130 112,112"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle cx="130" cy="130" r="26" fill="none" stroke="currentColor" strokeWidth="3.2" />
                  <circle cx="130" cy="130" r="8" fill="currentColor" />
                </svg>
              </div>
            </div>
          )}

          {/* Legendary Golden Screen-Shake & Pillar Flash */}
          {spectacleFx.kind === 'legendary' && (
            <div className={`legendary-entrance-backdrop domain-${spectacleFx.domain}`}>
              <div className="legendary-rays-burst" />
            </div>
          )}

          {/* Dragon Armada Sky-Full-of-Dragons Flyover (#172) */}
          {spectacleFx.kind === 'armada' && (
            <div
              className={`dragon-armada-sky-sweep domain-${spectacleFx.domain}`}
              aria-hidden="true"
            >
              <div className="armada-storm-veil" />
              {[0, 1, 2, 3, 4, 5, 6].map((dIdx) => (
                <div
                  key={dIdx}
                  className={`armada-dragon-silhouette dragon-wing-${dIdx}`}
                  style={
                    {
                      '--d-top': `${12 + ((dIdx * 13) % 68)}%`,
                      '--d-delay': `${dIdx * 0.08}s`,
                      '--d-scale': `${dIdx === 3 ? 1.38 : 0.78 + (dIdx % 3) * 0.18}`,
                    } as React.CSSProperties
                  }
                >
                  <svg viewBox="0 0 120 80" className="armada-dragon-svg">
                    <path
                      d="M8,42 C26,18 46,6 68,18 L54,34 L88,36 L114,40 L88,44 L54,46 L68,62 C46,74 26,62 8,42 Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              ))}
            </div>
          )}

          {/* Sacred Eight-Spoke Wheel General Entrance Halo (#173) */}
          {spectacleFx.kind === 'wheel_general' && (
            <div
              className={`wheel-general-entrance-backdrop domain-${spectacleFx.domain}`}
              aria-hidden="true"
            >
              <div className="legendary-rays-burst" />
              <div className="wheel-general-halo-wrap">
                <svg viewBox="0 0 200 200" className="sacred-eight-spoke-wheel-svg">
                  <circle cx="100" cy="100" r="82" fill="none" stroke="currentColor" strokeWidth="6" />
                  <circle cx="100" cy="100" r="66" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="8 6" />
                  <circle cx="100" cy="100" r="22" fill="none" stroke="currentColor" strokeWidth="5" />
                  <circle cx="100" cy="100" r="8" fill="currentColor" />
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                    <g key={deg} transform={`rotate(${deg} 100 100)`}>
                      <line x1="100" y1="22" x2="100" y2="78" stroke="currentColor" strokeWidth="4.5" />
                      <polygon points="100,4 94,18 106,18" fill="currentColor" />
                    </g>
                  ))}
                </svg>
              </div>
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

      {/* RIGHT-SIDE MAXIMIZED CARD PREVIEW & ACTION PANEL (Never covers Vanguarda or Retaguarda on the board!) */}
      {(() => {
        const anyHudPopoverOpen =
          isP1DrawerPinned || isP2DrawerPinned || activeRightDrawer !== null;
        const activeHandCard =
          !anyHudPopoverOpen && selectedHandIndex !== null
            ? gameState.player.hand[selectedHandIndex] ?? null
            : null;
        const activePlayCheck = activeHandCard
          ? canPlayCard(gameState, 'player', activeHandCard)
          : { allowed: false, reason: '' };
        const activeBoardUnitId =
          !anyHudPopoverOpen &&
          selectedHandIndex === null &&
          !isHandPinnedOpen &&
          !isHandHovered
            ? selectedAttackerId ?? focusedBoardUnitId
            : null;
        const activeBoardUnitFound = activeBoardUnitId
          ? findUnitOnBoard(gameState, activeBoardUnitId)
          : null;
        const activeBoardUnit =
          activeBoardUnitFound && !activeBoardUnitFound.unit.isTrap
            ? activeBoardUnitFound.unit
            : null;
        const activeBoardUnitOwner = activeBoardUnitFound?.owner ?? null;

        const sideCardInfo = hoveredCardInfo
          ? hoveredCardInfo
          : activeHandCard
          ? { card: activeHandCard }
          : activeBoardUnit
          ? { card: activeBoardUnit.card, unit: activeBoardUnit }
          : null;

        if (!sideCardInfo) return null;

        const isInteractiveSelection = Boolean(
          (activeHandCard && selectedHandIndex !== null) || activeBoardUnit
        );

        return (
          <div
            className={`cpa-hover-zoom-panel ${
              isInteractiveSelection ? 'is-interactive-selection' : ''
            }`}
          >
            <div className="side-zoom-card-wrap">
              <CardView
                card={sideCardInfo.card}
                unit={sideCardInfo.unit}
                mode="inspect"
              />
            </div>

            {sideCardInfo.unit && !activeHandCard && (
              <div className="cpa-hover-unit-status">
                <div style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: '2px' }}>
                  Posição:{' '}
                  {sideCardInfo.unit.row === 'vanguard'
                    ? 'Vanguarda (Frente)'
                    : 'Retaguarda (Suporte)'}{' '}
                  • Coluna {sideCardInfo.unit.slotIndex + 1}
                </div>
                {sideCardInfo.unit.invasionAtkBonus ? (
                  <div style={{ color: '#fdba74' }}>• Invasão de Território: +1 ATQ ativo</div>
                ) : null}
                {sideCardInfo.unit.formationAtkBonus ? (
                  <div style={{ color: '#fef08a' }}>• Cobertura de Coluna: +1 ATQ ativo</div>
                ) : null}
                {sideCardInfo.unit.formationArmorBonus ? (
                  <div style={{ color: '#fde68a' }}>• Formação em Falange: +1 Armadura ativa</div>
                ) : null}
                {sideCardInfo.card.ascension && !sideCardInfo.unit.isAscended && (
                  <div style={{ color: '#fbbf24', marginTop: '3px' }}>
                    • Ascensão ({sideCardInfo.card.ascension.cost} Essência): Evolui para{' '}
                    <strong>{sideCardInfo.card.ascension.newName}</strong> (
                    {sideCardInfo.card.ascension.newAtk}/{sideCardInfo.card.ascension.newMaxHp})
                  </div>
                )}
              </div>
            )}

            {/* Selected Hand Card Actions + Direct Column 1..6 Selector on the Right Side */}
            {activeHandCard && selectedHandIndex !== null && (
              <div className="side-card-command-box">
                <div className="side-cmd-header">
                  <span className="side-cmd-title">
                    {DOMAIN_META[activeHandCard.domain]?.icon} {activeHandCard.name} (
                    {CARD_TYPE_LABELS[activeHandCard.type]})
                  </span>
                  <div className="side-cmd-top-btns">
                    <button
                      type="button"
                      className="sccd-toggle-btn show-on-mobile-inline"
                      onClick={() => setInspectCard(activeHandCard)}
                    >
                      🔍 Ler
                    </button>
                    <button
                      type="button"
                      className="sccd-toggle-btn"
                      onClick={() => {
                        setSelectedHandIndex(null);
                        setIsHandPinnedOpen(true);
                      }}
                    >
                      🃏 Mão
                    </button>
                    <button
                      type="button"
                      className="sccd-cancel-btn"
                      onClick={() => clearHandSelectionAndDrawers()}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div
                  className={`side-cmd-status ${
                    isPlayerTurn && activePlayCheck.allowed ? 'is-ready' : 'is-warn'
                  }`}
                >
                  {!isPlayerTurn
                    ? '⏳ Aguarde seu turno.'
                    : activePlayCheck.allowed
                    ? activeHandCard.type === 'creature'
                      ? '✅ Clique direto na Coluna (1 a 6) na mesa ou escolha abaixo:'
                      : activeHandCard.type === 'relic'
                      ? '✅ Clique direto na Retaguarda (Col 1 a 6) na mesa ou abaixo:'
                      : '✅ Pronta para usar:'
                    : `⚠️ ${
                        activePlayCheck.reason || 'Essência/Afinidade insuficiente'
                      } (${KEYWORD_TOOLTIPS[activeHandCard.keywords[0]] ? activeHandCard.keywords[0] : 'use Canalizar/Sacrificar abaixo'})`}
                </div>

                {isPlayerTurn &&
                  activePlayCheck.allowed &&
                  activeHandCard.type === 'creature' && (
                    <div className="side-col-picker-group">
                      {hasEmptyVanguard && (
                        <div className="side-col-picker-row">
                          <span className="side-col-row-label vanguard">⚔️ Vanguarda:</span>
                          <div className="side-col-btns">
                            {[0, 1, 2, 3, 4, 5].map((colIdx) => {
                              const canCol = canDeployToSlot(
                                gameState.player,
                                'vanguard',
                                colIdx
                              );
                              return (
                                <button
                                  key={`side-van-${colIdx}`}
                                  type="button"
                                  disabled={!canCol}
                                  className="side-col-btn vanguard"
                                  onClick={() => handleDeployToPlayerSlot('vanguard', colIdx)}
                                  title={`Jogar na Vanguarda • Coluna ${colIdx + 1}`}
                                >
                                  C{colIdx + 1}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      {hasEmptyRearguard && (
                        <div className="side-col-picker-row">
                          <span className="side-col-row-label rearguard">🛡️ Retaguarda:</span>
                          <div className="side-col-btns">
                            {[0, 1, 2, 3, 4, 5].map((colIdx) => {
                              const canCol = canDeployToSlot(
                                gameState.player,
                                'rearguard',
                                colIdx
                              );
                              return (
                                <button
                                  key={`side-rear-${colIdx}`}
                                  type="button"
                                  disabled={!canCol}
                                  className="side-col-btn rearguard"
                                  onClick={() => handleDeployToPlayerSlot('rearguard', colIdx)}
                                  title={`Jogar na Retaguarda • Coluna ${colIdx + 1}`}
                                >
                                  C{colIdx + 1}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                {isPlayerTurn &&
                  activePlayCheck.allowed &&
                  activeHandCard.type === 'relic' &&
                  hasEmptyRearguard && (
                    <div className="side-col-picker-group">
                      <div className="side-col-picker-row">
                        <span className="side-col-row-label rearguard">🏺 Retaguarda:</span>
                        <div className="side-col-btns">
                          {[0, 1, 2, 3, 4, 5].map((colIdx) => {
                            const canCol = canDeployToSlot(
                              gameState.player,
                              'rearguard',
                              colIdx
                            );
                            return (
                              <button
                                key={`side-relic-${colIdx}`}
                                type="button"
                                disabled={!canCol}
                                className="side-col-btn rearguard"
                                onClick={() => handleDeployToPlayerSlot('rearguard', colIdx)}
                              >
                                C{colIdx + 1}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                {isPlayerTurn &&
                  activePlayCheck.allowed &&
                  activeHandCard.type === 'reaction' &&
                  hasEmptyRearguard && (
                    <div className="side-col-picker-group">
                      <div className="side-col-picker-row">
                        <span className="side-col-row-label rearguard">🪤 Emboscada:</span>
                        <div className="side-col-btns">
                          {[0, 1, 2, 3, 4, 5].map((colIdx) => {
                            const canCol = canDeployToSlot(
                              gameState.player,
                              'rearguard',
                              colIdx
                            );
                            return (
                              <button
                                key={`side-trap-${colIdx}`}
                                type="button"
                                disabled={!canCol}
                                className="side-col-btn rearguard"
                                onClick={() => handleQuickArmTrap(selectedHandIndex, colIdx)}
                              >
                                C{colIdx + 1}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                <div className="side-cmd-actions">
                  {isPlayerTurn &&
                    activePlayCheck.allowed &&
                    (activeHandCard.type === 'spell' ||
                      activeHandCard.type === 'reaction') && (
                      <button
                        type="button"
                        className="quick-act-btn act-spell"
                        onClick={() => handleQuickCastSpell(selectedHandIndex)}
                      >
                        ✨ Lançar Agora
                      </button>
                    )}

                  {isPlayerTurn && !gameState.player.hasChanneledThisTurn && (
                    <button
                      type="button"
                      className="quick-act-btn act-channel"
                      onClick={() => handleQuickChannelCard(selectedHandIndex)}
                    >
                      ⛰️ Canalizar (+1 Afin. & Compra) [C]
                    </button>
                  )}

                  {isPlayerTurn && gameState.player.hasChanneledThisTurn && (
                    <button
                      type="button"
                      className="quick-act-btn act-burn"
                      onClick={() => handleQuickBurnCard(selectedHandIndex)}
                    >
                      🔥 Sacrificar (+1 Essência) [C]
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Selected Board Unit Actions on the Right Side */}
            {activeBoardUnit && !activeHandCard && (
              <div className="side-card-command-box">
                <div className="side-cmd-header">
                  <span className="side-cmd-title">
                    {activeBoardUnit.card.name} (C{activeBoardUnit.slotIndex + 1})
                  </span>
                  <button
                    type="button"
                    className="sccd-cancel-btn"
                    onClick={() => {
                      setSelectedAttackerId(null);
                      setFocusedBoardUnitId(null);
                    }}
                  >
                    ✕
                  </button>
                </div>

                {activeBoardUnitOwner === 'player' && isPlayerTurn && (
                  <div className="side-cmd-actions">
                    {(() => {
                      const unitTargets = getValidAttackTargets(
                        gameState,
                        activeBoardUnit.instanceId
                      );
                      const canHitSovereign = unitTargets.includes('ai-sovereign');
                      const targetableEnemies = getAllBoardUnits(gameState.ai).filter((eu) =>
                        unitTargets.includes(eu.instanceId)
                      );
                      return (
                        <>
                          {canHitSovereign && (
                            <button
                              type="button"
                              className="quick-act-btn act-vanguard"
                              onClick={() =>
                                handleExecuteUnitAttackOnTarget(
                                  activeBoardUnit,
                                  'ai-sovereign'
                                )
                              }
                              onMouseEnter={() => setHoveredAttackTargetId('ai-sovereign')}
                              onMouseLeave={() => setHoveredAttackTargetId(null)}
                            >
                              {isSureHitActiveFor(gameState, 'player') ? '⛩️ ' : '👑 '}
                              Atacar Soberano (❤️ {gameState.ai.hp})
                            </button>
                          )}
                          {targetableEnemies.map((eu) => (
                            <button
                              key={`unit-atk-tgt-${eu.instanceId}`}
                              type="button"
                              className="quick-act-btn act-burn"
                              onClick={() =>
                                handleExecuteUnitAttackOnTarget(
                                  activeBoardUnit,
                                  eu.instanceId
                                )
                              }
                              onMouseEnter={() => setHoveredAttackTargetId(eu.instanceId)}
                              onMouseLeave={() => setHoveredAttackTargetId(null)}
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
                        onClick={() => handleAscendFriendlyUnit(activeBoardUnit)}
                      >
                        👑 Ascender ({activeBoardUnit.card.ascension?.cost}⚡)
                      </button>
                    )}
                    {canMoveUnitRow(gameState, 'player', activeBoardUnit.instanceId) && (
                      <button
                        type="button"
                        className="quick-act-btn act-rearguard"
                        onClick={() => handleMoveFriendlyUnitRow(activeBoardUnit)}
                      >
                        ⇅ Mover para{' '}
                        {activeBoardUnit.row === 'vanguard' ? 'Retaguarda' : 'Vanguarda'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })()}

      <div
        className={`arena-main-column cpa-arena-table ${
          arenaShake ? `arena-shake-${arenaShake}` : ''
        } ${
          isSpectatorMode && specCinemaMode
            ? `is-cinema-studio-active ${
                specCinemaAspect === '9:16' ? 'cinema-aspect-9-16' : 'cinema-aspect-16-9'
              }`
            : ''
        }`}
        onMouseMove={(e) => {
          if (isSpectatorMode && specCinemaMode && e.clientY <= 68) {
            wakeCinemaStudioHud();
          }
        }}
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
            <div
              ref={arenaStageRef}
              className={`arena-fullscreen-stage ${isSpectatorMode ? 'is-spectator-arena' : ''} ${
                isRecordingVideo || specCinemaMode ? 'is-video-recording-clean' : ''
              } ${
                gameState.conquestModifiers?.biomeRealm
                  ? `biome-realm-${gameState.conquestModifiers.biomeRealm}`
                  : ''
              }`}
            >
              {/* GPU-Friendly Atmospheric Weather & Regional Particle Layer (pointer-events: none) */}
              {(gameState.weather || gameState.conquestModifiers?.biomeRealm) && (
                <div
                  className={`arena-weather-fx-layer ${
                    gameState.weather
                      ? `is-${gameState.weather.type}`
                      : `is-realm-${gameState.conquestModifiers?.biomeRealm}`
                  }`}
                  aria-hidden="true"
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((pIdx) => (
                    <span
                      key={pIdx}
                      className="arena-weather-mote"
                      style={
                        {
                          '--mote-left': `${6 + pIdx * 9.4}%`,
                          '--mote-delay': `${(pIdx * 0.7) % 4.5}s`,
                          '--mote-dur': `${5.2 + (pIdx % 4) * 1.1}s`,
                        } as React.CSSProperties
                      }
                    />
                  ))}
                </div>
              )}

              {/* =====================================================
                  1. TOP-CENTER SYMMETRIC P2 PILL (OPPONENT / SOVEREIGN 2)
                  One sleek flush pill at the top center; expands P2 details on hover/click.
                  ===================================================== */}
              <header
                className={`hud-unified-top-bar ${
                  isP2DrawerPinned ? 'is-pinned-open' : ''
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
                  {tournamentSpectatorContext ? (() => {
                    const northSov = specFlipped
                      ? tournamentSpectatorContext.pairing.playerA
                      : tournamentSpectatorContext.pairing.playerB;
                    if (!northSov) return null;
                    return (
                      <span
                        className="hud-pill-env-chip"
                        style={{
                          borderColor: 'rgba(148, 163, 184, 0.25)',
                          color: '#cbd5e1',
                          fontSize: '0.64rem',
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                        }}
                        title={`#${northSov.rank} na classificação · ${northSov.eloRating} ELO · ${northSov.subtitle}`}
                      >
                        #{northSov.rank} · {northSov.eloRating} ELO
                      </span>
                    );
                  })() : !onlineMatch && !tacticalProblem && (() => {
                    const activeAiTier = gameState.aiSkillTier ?? 3;
                    const tSpec = AI_SKILL_TIER_SPECS[activeAiTier];
                    const rawAiKey =
                      gameState.aiDeckId ??
                      campaignBoss?.archetypeId ??
                      campaignBoss?.deckId ??
                      selectedAiDeckId;
                    const champStanding = getUnifiedStandingForDeckId(rawAiKey);
                    const calibratedElo =
                      rankedDuelContext?.opponentEntry.eloRating ??
                      resolveCalibratedEloForArchetype(rawAiKey, activeAiTier);
                    return (
                      <span
                        className="hud-pill-env-chip"
                        style={{
                          borderColor: rankedDuelContext
                            ? 'rgba(212, 175, 55, 0.45)'
                            : 'rgba(148, 163, 184, 0.25)',
                          color: rankedDuelContext ? '#fde68a' : '#cbd5e1',
                          fontSize: '0.64rem',
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                        }}
                        title={`${tSpec.title}${
                          calibratedElo ? ` · ${calibratedElo} ELO` : ''
                        }${
                          champStanding
                            ? ` · #${champStanding.rank}: ${champStanding.name}`
                            : ''
                        }`}
                      >
                        {rankedDuelContext ? 'Ranqueado · ' : ''}
                        {calibratedElo ? `${calibratedElo} ELO` : tSpec.title}
                      </span>
                    );
                  })()}
                  <span className="hud-pill-stat hp" title="Pontos de Vida do oponente">
                    {gameState.ai.hp} PV
                  </span>
                  <span className="hud-pill-stat mana" title="Essência disponível do oponente">
                    {gameState.ai.currentEssence}/{gameState.ai.maxEssence} Ess.
                  </span>
                  <span className="hud-pill-stat hand" title={`Mão: ${gameState.ai.hand.length} · Grimório: ${gameState.ai.deck.length} · Cripta: ${gameState.ai.crypt.length}`}>
                    Mão {gameState.ai.hand.length}
                  </span>

                  {gameState.conquestModifiers?.equippedRelic && (
                    <span
                      className="hud-pill-env-chip relic-chip"
                      title={`Relíquia da Coroa — ${gameState.conquestModifiers.equippedRelic.name}: ${gameState.conquestModifiers.equippedRelic.shortBonus}`}
                    >
                      <span className="hide-on-mobile">
                        {gameState.conquestModifiers.equippedRelic.name}
                      </span>
                    </span>
                  )}

                  {gameState.conquestModifiers?.riftMutator && (
                    <span
                      className="hud-pill-env-chip rift-chip"
                      title={gameState.conquestModifiers.bannerSummary ?? 'Mutador de Fenda Ativo'}
                    >
                      <span className="hide-on-mobile">
                        {gameState.conquestModifiers.riftName ?? 'Fenda'}
                      </span>
                    </span>
                  )}

                  {gameState.conquestModifiers?.landmarkLabel && (
                    <span
                      className="hud-pill-env-chip geo-loc hide-on-mobile"
                      title={gameState.conquestModifiers.bannerSummary}
                    >
                      {gameState.conquestModifiers.landmarkLabel}
                    </span>
                  )}

                  {gameState.weather && (
                    <span
                      className="hud-pill-env-chip"
                      title={`${gameState.weather.name}: ${gameState.weather.shortDesc}`}
                    >
                      {gameState.weather.name} ({gameState.weather.turnsRemaining}t)
                    </span>
                  )}
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
                        ? `Disputa (${gameState.domainExpansion.turnsRemaining}r)`
                        : `Domínio (${gameState.domainExpansion.turnsRemaining}r)`}
                    </span>
                  )}

                  <button
                    type="button"
                    className={`hud-pill-expand-btn ${isP2DrawerPinned ? 'active' : ''}`}
                    style={{ width: 'auto', padding: '0 7px', gap: '3px', fontWeight: 600, textTransform: 'none' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsP2DrawerPinned((prev) => {
                        const next = !prev;
                        if (next) {
                          setIsP1DrawerPinned(false);
                          setIsHandPinnedOpen(false);
                          setIsHandHovered(false);
                          setActiveRightDrawer(null);
                          setSelectedHandIndex(null);
                          setSelectedAttackerId(null);
                          setFocusedBoardUnitId(null);
                        }
                        return next;
                      });
                    }}
                  >
                    {isP2DrawerPinned ? 'Ocultar' : 'Detalhes'}
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
                  {tournamentSpectatorContext ? (() => {
                    const northSov = specFlipped
                      ? tournamentSpectatorContext.pairing.playerA
                      : tournamentSpectatorContext.pairing.playerB;
                    if (!northSov) return null;
                    return (
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '5px 8px',
                          marginTop: '4px',
                          borderRadius: '6px',
                          background: 'rgba(15, 23, 42, 0.85)',
                          border: '1px solid rgba(212, 175, 55, 0.35)',
                          fontSize: '0.68rem',
                          color: '#e2e8f0',
                        }}
                      >
                        <strong style={{ color: '#fde68a' }}>
                          #{northSov.rank} na classificação · {northSov.eloRating} ELO
                        </strong>
                        <span style={{ color: '#64748b' }}>·</span>
                        <span style={{ color: '#cbd5e1' }}>{northSov.subtitle}</span>
                      </div>
                    );
                  })() : !onlineMatch && !tacticalProblem && (() => {
                    const activeAiTier = gameState.aiSkillTier ?? 3;
                    const tSpec = AI_SKILL_TIER_SPECS[activeAiTier];
                    const champStanding = getUnifiedStandingForDeckId(
                      gameState.aiDeckId ??
                        campaignBoss?.archetypeId ??
                        campaignBoss?.deckId ??
                        selectedAiDeckId
                    );
                    const aiModeText = tSpec.title;
                    return (
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '5px 8px',
                          marginTop: '4px',
                          borderRadius: '6px',
                          background: 'rgba(15, 23, 42, 0.85)',
                          border: '1px solid rgba(212, 175, 55, 0.35)',
                          fontSize: '0.68rem',
                          color: '#e2e8f0',
                        }}
                      >
                        <strong style={{ color: '#fde047' }}>
                          {tSpec.shortLabel} · {aiModeText}
                        </strong>
                        {champStanding && (
                          <>
                            <span style={{ color: '#64748b' }}>•</span>
                            <span style={{ color: '#93c5fd', fontWeight: 700 }}>
                              🏆 Rank #{champStanding.rank}/44 [Tier {champStanding.tierBadge}] —{' '}
                              {champStanding.name} (
                              {(champStanding.overallWinRate * 100).toFixed(1)}% WR Global)
                            </span>
                          </>
                        )}
                      </div>
                    );
                  })()}
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
                          onClick={() => {
                            setIsP2DrawerPinned(false);
                            setCryptModalOwner('ai');
                          }}
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
                          <div className="cpa-lands-stack">
                            {gameState.ai.channeledCards.slice(-6).map((c, i) => (
                              <div
                                key={`ai-land-${i}`}
                                className={`cpa-land-card domain-${c.domain}`}
                                style={{ marginLeft: i === 0 ? 0 : '-10px', zIndex: i + 1 }}
                                onMouseEnter={() => handleHoverCard(c)}
                                onMouseLeave={() => handleHoverCard(null)}
                                title={c.name}
                              >
                                {c.imagePath ? <img src={c.imagePath} alt={c.name} /> : null}
                                <span className="cpa-land-domain-pip">
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
                className={`cpa-battlefield-surface wooden-tabletop-surface ${
                  gameState.domainExpansion
                    ? `has-domain-tabletop domain-tabletop-${gameState.domainExpansion.domain}`
                    : ''
                } ${isAimingAnyTarget ? 'is-aiming-target' : ''} ${
                  gameState.weather ? `has-arena-weather weather-${gameState.weather.type}` : ''
                }`}
                onClick={() => {
                  if (
                    isP2DrawerPinned ||
                    isP1DrawerPinned ||
                    isHandPinnedOpen ||
                    isHandHovered ||
                    activeRightDrawer ||
                    !isProblemHudMinimized
                  ) {
                    closeAllArenaDrawers();
                  }
                  if (
                    selectedHandIndex !== null ||
                    selectedAttackerId !== null ||
                    focusedBoardUnitId !== null
                  ) {
                    setSelectedHandIndex(null);
                    setSelectedAttackerId(null);
                    setFocusedBoardUnitId(null);
                  }
                }}
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
                      {gameState.domainExpansion.domain === 'neutral' && (
                        <div className="tabletop-axial-horology-overlay" aria-hidden="true">
                          <svg viewBox="0 0 400 400" className="tabletop-axial-gear-ring slow-cw">
                            <circle cx="200" cy="200" r="168" fill="none" stroke="currentColor" strokeWidth="1.6" strokeDasharray="10 6" />
                            <circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" strokeWidth="1.1" />
                            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                              <g key={deg} transform={`rotate(${deg} 200 200)`}>
                                <rect x="196" y="24" width="8" height="9" rx="1" fill="currentColor" />
                                <line x1="200" y1="34" x2="200" y2="50" stroke="currentColor" strokeWidth="1.4" />
                              </g>
                            ))}
                          </svg>
                          <svg viewBox="0 0 400 400" className="tabletop-axial-gear-ring slow-ccw">
                            <circle cx="200" cy="200" r="116" fill="none" stroke="currentColor" strokeWidth="1.3" />
                            <polygon
                              points="200,84 224,176 316,200 224,224 200,316 176,224 84,200 176,176"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.1"
                            />
                            <circle cx="200" cy="200" r="38" fill="none" stroke="currentColor" strokeWidth="1.6" strokeDasharray="5 4" />
                          </svg>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 2. DOMAIN CLASH: TWO DOMAINS FIGHTING (50/50 Organic Blend + Subtle Energy Seam) */}
                  {gameState.domainExpansion && gameState.domainExpansion.clashRival && (() => {
                    const exp = gameState.domainExpansion;
                    const rival = exp.clashRival!;
                    const topDom = exp.owner === 'ai' ? exp : rival;
                    const bottomDom = exp.owner === 'player' ? exp : rival;
                    const topColor =
                      topDom.domain === 'neutral'
                        ? '#e2e8f0'
                        : DOMAIN_META[topDom.domain]?.color || '#38bdf8';
                    const bottomColor =
                      bottomDom.domain === 'neutral'
                        ? '#e2e8f0'
                        : DOMAIN_META[bottomDom.domain]?.color || '#ef4444';
                    return (
                      <div
                        key={`domain-clash-${topDom.domain}-${bottomDom.domain}`}
                        className="tabletop-domain-clash-stage"
                        style={
                          {
                            '--top-clash-color': topColor,
                            '--bottom-clash-color': bottomColor,
                          } as React.CSSProperties
                        }
                      >
                        <div className={`tabletop-domain-clash-half top-half domain-${topDom.domain}`}>
                          <div className={`tabletop-domain-flow-fx domain-${topDom.domain}`} />
                        </div>

                        <div className={`tabletop-domain-clash-half bottom-half domain-${bottomDom.domain}`}>
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

                  {/* 4. DESTRUCTION / SACRED WHEEL SHATTER ANIMATION (8 Polygonal Barrier Shards + Celestial Wheel Mandala) */}
                  {domainExitAnim &&
                    (domainExitAnim.mode === 'shatter' || domainExitAnim.mode === 'wheel_shatter') && (
                      <div
                        key={`domain-shatter-${domainExitAnim.mode}-${domainExitAnim.domain}`}
                        className={`tabletop-domain-shatter-layer domain-${domainExitAnim.domain} ${
                          domainExitAnim.mode === 'wheel_shatter' ? 'is-wheel-shatter' : ''
                        }`}
                      >
                        <div className="domain-shatter-impact-flash" />
                        <div className="domain-shatter-fracture-web" />
                        {domainExitAnim.mode === 'wheel_shatter' && (
                          <div className="wheel-shatter-celestial-mandala" aria-hidden="true">
                            <div className="wheel-shatter-shockwave-ring" />
                            <svg viewBox="0 0 200 200" className="sacred-eight-spoke-wheel-svg is-shattering">
                              <circle cx="100" cy="100" r="82" fill="none" stroke="currentColor" strokeWidth="6.5" />
                              <circle cx="100" cy="100" r="64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="10 6" />
                              <circle cx="100" cy="100" r="24" fill="none" stroke="currentColor" strokeWidth="5.5" />
                              <circle cx="100" cy="100" r="9" fill="currentColor" />
                              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                                <g key={deg} transform={`rotate(${deg} 100 100)`}>
                                  <line x1="100" y1="20" x2="100" y2="76" stroke="currentColor" strokeWidth="5" />
                                  <polygon points="100,2 93,18 107,18" fill="currentColor" />
                                </g>
                              ))}
                            </svg>
                          </div>
                        )}
                        {[0, 1, 2, 3, 4, 5, 6, 7].map((shardIdx) => (
                          <div
                            key={shardIdx}
                            className={`domain-shatter-shard shard-${shardIdx} domain-${domainExitAnim.domain}`}
                          />
                        ))}
                        <div
                          className={`domain-exit-status-banner shatter-banner ${
                            domainExitAnim.mode === 'wheel_shatter' ? 'wheel-shatter-banner' : ''
                          }`}
                        >
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
                <div className="cpa-board-lane rearguard-lane ai-rearguard-lane">
                  {(spectacleFx?.kind === 'breath' || spectacleFx?.kind === 'armada') &&
                    spectacleFx.targetLaneId === 'ai-rearguard' && (
                      <div className={`dragon-breath-wave-fx domain-${spectacleFx.domain}`} />
                    )}
                  <div className="cpa-lane-slots">
                    {[0, 1, 2, 3, 4, 5].map((idx) => {
                      const slotUnits = getSlotUnits(gameState.ai, 'rearguard', idx);
                      return (
                        <div
                          key={`ai-rear-${idx}`}
                          className={`cpa-slot ${slotUnits.length > 1 ? 'has-stacked-units' : ''}`}
                        >
                          {slotUnits.length > 1 && (
                            <span
                              className="slot-stack-count-badge enemy-stack-badge"
                              onClick={(e) => handleCycleSlotStack('ai', 'rearguard', idx, e)}
                              title="Alternar carta empilhada"
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
                              const isFocusedInStack = focusedBoardUnitId === unit.instanceId;
                              return (
                                <div
                                  key={unit.instanceId}
                                  data-combat-id={unit.instanceId}
                                  className={`organic-tabletop-card stacked-card-item ${
                                    isLunging ? 'is-lunging-attacker' : ''
                                  } ${isHit ? 'is-hit-target' : ''} ${
                                    isFocusedInStack ? 'is-stack-focused' : ''
                                  }`}
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
                                    onClick={(e) => handleClickEnemyUnit(unit, e)}
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

                {/* 2ª Fileira: AI Vanguard (Logo à frente da Retaguarda do Adversário) */}
                <div className="cpa-board-lane vanguard-lane ai-vanguard-lane">
                  {(spectacleFx?.kind === 'breath' || spectacleFx?.kind === 'armada') &&
                    spectacleFx.targetLaneId === 'ai-vanguard' && (
                      <div className={`dragon-breath-wave-fx domain-${spectacleFx.domain}`} />
                    )}
                  <div className="cpa-lane-slots">
                    {[0, 1, 2, 3, 4, 5].map((idx) => {
                      const slotUnits = getSlotUnits(gameState.ai, 'vanguard', idx);
                      const pVanUnits = getSlotUnits(gameState.player, 'vanguard', idx);
                      const isInvading = slotUnits.length > 0 && pVanUnits.length === 0;
                      const isClashing = slotUnits.length > 0 && pVanUnits.length > 0;

                      return (
                        <div
                          key={`ai-van-${idx}`}
                          className={`cpa-slot ${slotUnits.length > 1 ? 'has-stacked-units' : ''}`}
                        >
                          {slotUnits.length > 1 && (
                            <span
                              className="slot-stack-count-badge enemy-stack-badge"
                              onClick={(e) => handleCycleSlotStack('ai', 'vanguard', idx, e)}
                              title="Alternar carta empilhada"
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
                              const isFocusedInStack = focusedBoardUnitId === unit.instanceId;
                              return (
                                <div
                                  key={unit.instanceId}
                                  data-combat-id={unit.instanceId}
                                  className={`organic-tabletop-card stacked-card-item ${
                                    isLunging ? 'is-lunging-attacker' : ''
                                  } ${isHit ? 'is-hit-target' : ''} ${
                                    isInvading ? 'is-crossing-border-ai' : ''
                                  } ${isFocusedInStack ? 'is-stack-focused' : ''}`}
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
                                    onClick={(e) => handleClickEnemyUnit(unit, e)}
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

                {/* FRONTEIRA CENTRAL DOS TERRITÓRIOS */}
                <div className="tabletop-clash-gap" />

                {/* 3ª Fileira: Player Vanguard (Logo à frente da nossa Retaguarda) */}
                <div className="cpa-board-lane vanguard-lane player-vanguard-lane">
                  {(spectacleFx?.kind === 'breath' || spectacleFx?.kind === 'armada') &&
                    spectacleFx.targetLaneId === 'player-vanguard' && (
                      <div className={`dragon-breath-wave-fx domain-${spectacleFx.domain}`} />
                    )}
                  <div className="cpa-lane-slots">
                    {[0, 1, 2, 3, 4, 5].map((idx) => {
                      const slotUnits = getSlotUnits(gameState.player, 'vanguard', idx);
                      const aiVanUnits = getSlotUnits(gameState.ai, 'vanguard', idx);
                      const canStackHere =
                        canDeployCreature && canDeployToSlot(gameState.player, 'vanguard', idx);
                      const isInvading = slotUnits.length > 0 && aiVanUnits.length === 0;
                      const isClashing = slotUnits.length > 0 && aiVanUnits.length > 0;

                      return (
                        <div
                          key={`player-van-${idx}`}
                          className={`cpa-slot ${canStackHere ? 'can-deploy' : ''} ${
                            slotUnits.length > 1 ? 'has-stacked-units' : ''
                          }`}
                          onClick={(e) => handleSelectPlayerSlot('vanguard', idx, e)}
                        >
                          {slotUnits.length > 1 && (
                            <span
                              className="slot-stack-count-badge ally-stack-badge"
                              onClick={(e) => handleCycleSlotStack('player', 'vanguard', idx, e)}
                              title="Alternar carta empilhada"
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
                                handleDeployToPlayerSlot('vanguard', idx);
                              }}
                            >
                              +<span className="hide-on-mobile"> Empilhar</span> ({slotUnits.length + 1}/{MAX_UNITS_PER_SLOT})
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
                                const isFocusedInStack =
                                  selectedAttackerId === unit.instanceId ||
                                  focusedBoardUnitId === unit.instanceId;

                                return (
                                  <div
                                    key={unit.instanceId}
                                    data-combat-id={unit.instanceId}
                                    className={`organic-tabletop-card stacked-card-item ${
                                      isLunging ? 'is-lunging-attacker' : ''
                                    } ${isHit ? 'is-hit-target' : ''} ${
                                      isInvading ? 'is-crossing-border-player' : ''
                                    } ${isFocusedInStack ? 'is-stack-focused' : ''}`}
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
                                      isSelected={
                                        selectedAttackerId === unit.instanceId ||
                                        focusedBoardUnitId === unit.instanceId
                                      }
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
                            <span className="cpa-slot-watermark">
                              +<span className="hide-on-mobile"> Vanguarda • Col {idx + 1}</span>
                            </span>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4ª Fileira (Base): Player Rearguard */}
                <div className="cpa-board-lane rearguard-lane player-lane">
                  {(spectacleFx?.kind === 'breath' || spectacleFx?.kind === 'armada') &&
                    spectacleFx.targetLaneId === 'player-rearguard' && (
                      <div className={`dragon-breath-wave-fx domain-${spectacleFx.domain}`} />
                    )}
                  <div className="cpa-lane-slots">
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
                          className={`cpa-slot ${canStackHere ? 'can-deploy' : ''} ${
                            hasColumnCover && slotUnits.length === 0 ? 'has-column-cover' : ''
                          } ${slotUnits.length > 1 ? 'has-stacked-units' : ''}`}
                          onClick={(e) => handleSelectPlayerSlot('rearguard', idx, e)}
                        >
                          {slotUnits.length > 1 && (
                            <span
                              className="slot-stack-count-badge ally-stack-badge"
                              onClick={(e) => handleCycleSlotStack('player', 'rearguard', idx, e)}
                              title="Alternar carta empilhada"
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
                              +<span className="hide-on-mobile"> Empilhar</span> ({slotUnits.length + 1}/{MAX_UNITS_PER_SLOT})
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
                                const isFocusedInStack =
                                  selectedAttackerId === unit.instanceId ||
                                  focusedBoardUnitId === unit.instanceId;

                                return (
                                  <div
                                    key={unit.instanceId}
                                    data-combat-id={unit.instanceId}
                                    className={`organic-tabletop-card stacked-card-item ${
                                      isLunging ? 'is-lunging-attacker' : ''
                                    } ${isHit ? 'is-hit-target' : ''} ${
                                      isFocusedInStack ? 'is-stack-focused' : ''
                                    }`}
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
                                      isSelected={
                                        selectedAttackerId === unit.instanceId ||
                                        focusedBoardUnitId === unit.instanceId
                                      }
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
                            <span className="cpa-slot-watermark">
                              +
                              <span className="hide-on-mobile">
                                {canDeployTrap
                                  ? ` Emboscada • Col ${idx + 1}`
                                  : hasColumnCover
                                  ? ` Retaguarda • Col ${idx + 1} (+1 ATQ)`
                                  : ` Retaguarda • Col ${idx + 1}`}
                              </span>
                            </span>
                          ) : hasColumnCover ? (
                            <span className="cpa-slot-cover-rune">
                              +1<span className="hide-on-mobile"> ATQ</span>
                              <span className="show-on-mobile-inline">⚔️</span>
                            </span>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* =====================================================
                  2B. COMPACT CONTEXTUAL COMMAND BAR (SMARTPHONE / TOUCH)
                  Docked cleanly above the bottom bar — NEVER covers the 6x4 board!
                  ===================================================== */}
              {(() => {
                const anyPopover =
                  isP1DrawerPinned || isP2DrawerPinned || activeRightDrawer !== null;
                if (anyPopover) return null;

                const activeHand =
                  selectedHandIndex !== null
                    ? gameState.player.hand[selectedHandIndex] ?? null
                    : null;
                const activeBoardId =
                  selectedHandIndex === null ? selectedAttackerId ?? focusedBoardUnitId : null;
                const activeBoardFound = activeBoardId
                  ? findUnitOnBoard(gameState, activeBoardId)
                  : null;
                const activeUnit =
                  activeBoardFound &&
                  (!activeBoardFound.unit.isTrap || activeBoardFound.owner === 'player')
                    ? activeBoardFound.unit
                    : null;
                const activeUnitOwner = activeBoardFound?.owner ?? null;

                if (activeHand && selectedHandIndex !== null) {
                  const playCheck = canPlayCard(gameState, 'player', activeHand);
                  const targetMode = doesCardUseTarget(activeHand);
                  const compactBlockedReason = !playCheck.allowed
                    ? gameState.player.currentEssence < activeHand.cost
                      ? `⚡ ${gameState.player.currentEssence}/${activeHand.cost}`
                      : playCheck.reason?.includes('Afinidade')
                      ? `🔮 Afin. < ${activeHand.affinityReq}`
                      : '⚠️ Cheio'
                    : '';
                  const hintText = !isPlayerTurn
                    ? '⏳ Aguarde'
                    : !playCheck.allowed
                    ? compactBlockedReason
                    : activeHand.type === 'creature'
                    ? '⚡ Toque no slot'
                    : activeHand.type === 'relic'
                    ? '🏺 Retaguarda'
                    : activeHand.type === 'reaction'
                    ? '🪤 Armar/Lançar'
                    : targetMode !== null
                    ? '🎯 Toque no alvo'
                    : '✨ Pronto';

                  return (
                    <div
                      className="mobile-context-command-bar"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="mccb-info">
                        <span className="mccb-cost">{activeHand.cost}⚡</span>
                        <span className="mccb-name">{activeHand.name}</span>
                        <span
                          className={`mccb-hint ${
                            isPlayerTurn && playCheck.allowed ? 'is-ready' : 'is-warn'
                          }`}
                        >
                          {hintText}
                        </span>
                      </div>
                      <div className="mccb-actions">
                        {isPlayerTurn &&
                          playCheck.allowed &&
                          activeHand.type === 'creature' &&
                          hasEmptyVanguard && (
                            <button
                              type="button"
                              className="mccb-btn act-cast"
                              onClick={() => handleQuickDeployToRow(selectedHandIndex, 'vanguard')}
                              title="Invocar automaticamente na Vanguarda"
                            >
                              ⚔️ Vang.
                            </button>
                          )}
                        {isPlayerTurn &&
                          playCheck.allowed &&
                          activeHand.type === 'creature' &&
                          hasEmptyRearguard && (
                            <button
                              type="button"
                              className="mccb-btn act-move"
                              onClick={() => handleQuickDeployToRow(selectedHandIndex, 'rearguard')}
                              title="Invocar automaticamente na Retaguarda"
                            >
                              🛡️ Retag.
                            </button>
                          )}
                        {isPlayerTurn &&
                          playCheck.allowed &&
                          activeHand.type === 'relic' &&
                          hasEmptyRearguard && (
                            <button
                              type="button"
                              className="mccb-btn act-cast"
                              onClick={() => handleQuickDeployToRow(selectedHandIndex, 'rearguard')}
                              title="Forjar Relíquia na Retaguarda"
                            >
                              🏺 Retag.
                            </button>
                          )}
                        {isPlayerTurn &&
                          playCheck.allowed &&
                          (activeHand.type === 'spell' || activeHand.type === 'reaction') && (
                            <button
                              type="button"
                              className="mccb-btn act-cast"
                              onClick={() => handleQuickCastSpell(selectedHandIndex)}
                            >
                              ✨ Lançar
                            </button>
                          )}
                        {isPlayerTurn &&
                          playCheck.allowed &&
                          (activeHand.type === 'spell' || activeHand.type === 'reaction') &&
                          targetMode === 'enemy' &&
                          getAllBoardUnits(gameState.ai)
                            .filter((u) => !u.isTrap)
                            .map((tu) => (
                              <button
                                key={tu.instanceId}
                                type="button"
                                className="mccb-btn act-burn"
                                onClick={() =>
                                  handleQuickCastSpell(selectedHandIndex, tu.instanceId)
                                }
                                title={`Mirar em ${tu.card.name} (Col ${tu.slotIndex + 1} • ${tu.currentAtk}/${tu.currentHp})`}
                              >
                                🎯 {tu.card.name.split(' ')[0]} C{tu.slotIndex + 1} ({tu.currentHp}❤️)
                              </button>
                            ))}
                        {isPlayerTurn &&
                          playCheck.allowed &&
                          (activeHand.type === 'spell' || activeHand.type === 'reaction') &&
                          targetMode === 'ally' &&
                          getAllBoardUnits(gameState.player)
                            .filter((u) => !u.isTrap)
                            .map((tu) => (
                              <button
                                key={tu.instanceId}
                                type="button"
                                className="mccb-btn act-move"
                                onClick={() =>
                                  handleQuickCastSpell(selectedHandIndex, tu.instanceId)
                                }
                                title={`Mirar em ${tu.card.name} (Col ${tu.slotIndex + 1} • ${tu.currentAtk}/${tu.currentHp})`}
                              >
                                🎯 {tu.card.name.split(' ')[0]} C{tu.slotIndex + 1} ({tu.currentHp}❤️)
                              </button>
                            ))}
                        {isPlayerTurn &&
                          playCheck.allowed &&
                          activeHand.type === 'reaction' &&
                          hasEmptyRearguard && (
                            <button
                              type="button"
                              className="mccb-btn act-trap"
                              onClick={() => handleQuickArmTrap(selectedHandIndex)}
                            >
                              🪤 Armar
                            </button>
                          )}
                        {isPlayerTurn && !gameState.player.hasChanneledThisTurn && (
                          <button
                            type="button"
                            className="mccb-btn act-channel"
                            onClick={() => handleQuickChannelCard(selectedHandIndex)}
                            title="Canalizar (+1 Afinidade, +1 Essência e Compra)"
                          >
                            🔮 +1⚡
                          </button>
                        )}
                        {isPlayerTurn && gameState.player.hasChanneledThisTurn && (
                          <button
                            type="button"
                            className="mccb-btn act-burn"
                            onClick={() => handleQuickBurnCard(selectedHandIndex)}
                            title="Sacrificar carta por +1 Essência"
                          >
                            🔥 +1⚡
                          </button>
                        )}
                        <button
                          type="button"
                          className="mccb-btn act-inspect"
                          onClick={() => setInspectCard(activeHand)}
                          title="Ver detalhes da carta"
                        >
                          🔍
                        </button>
                        <button
                          type="button"
                          className="mccb-btn act-cancel"
                          onClick={() => clearHandSelectionAndDrawers()}
                          title="Cancelar seleção"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                }

                if (activeUnit) {
                  const activeSlotUnits = activeUnitOwner
                    ? getSlotUnits(
                        gameState[activeUnitOwner],
                        activeUnit.row,
                        activeUnit.slotIndex
                      ).filter((u) => activeUnitOwner === 'player' || !u.isTrap)
                    : [];
                  const activeStackIdx = activeSlotUnits.findIndex(
                    (u) => u.instanceId === activeUnit.instanceId
                  );

                  if (activeUnit.isTrap) {
                    return (
                      <div
                        className="mobile-context-command-bar"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="mccb-info">
                          <span className="mccb-cost">🪤</span>
                          <span className="mccb-name">{activeUnit.card.name}</span>
                          <span className="mccb-hint is-ready">
                            Armada • C{activeUnit.slotIndex + 1}
                          </span>
                        </div>
                        <div className="mccb-actions">
                          {activeSlotUnits.length > 1 && activeUnitOwner && (
                            <button
                              type="button"
                              className="mccb-btn act-move"
                              onClick={() =>
                                handleCycleSlotStack(
                                  activeUnitOwner,
                                  activeUnit.row,
                                  activeUnit.slotIndex
                                )
                              }
                              title="Alternar carta empilhada neste slot"
                            >
                              🥞 {activeStackIdx + 1}/{activeSlotUnits.length} ▸
                            </button>
                          )}
                          <button
                            type="button"
                            className="mccb-btn act-inspect"
                            onClick={() => setInspectCard(activeUnit.card)}
                            title="Ver detalhes da Emboscada"
                          >
                            🔍
                          </button>
                          <button
                            type="button"
                            className="mccb-btn act-cancel"
                            onClick={() => {
                              setSelectedAttackerId(null);
                              setFocusedBoardUnitId(null);
                            }}
                            title="Cancelar seleção"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    );
                  }

                  const unitTargets =
                    activeUnitOwner === 'player' && isPlayerTurn
                      ? getValidAttackTargets(gameState, activeUnit.instanceId)
                      : [];
                  const canHitSovereign = unitTargets.includes('ai-sovereign');
                  const validEnemyTargetUnits =
                    unitTargets.length > 0
                      ? getAllBoardUnits(gameState.ai).filter((eu) =>
                          unitTargets.includes(eu.instanceId)
                        )
                      : [];
                  const canAscend =
                    activeUnitOwner === 'player' &&
                    isPlayerTurn &&
                    canAscendUnit(gameState, 'player', activeUnit.instanceId);
                  const canMove =
                    activeUnitOwner === 'player' &&
                    isPlayerTurn &&
                    canMoveUnitRow(gameState, 'player', activeUnit.instanceId);
                  const unitHint =
                    activeUnitOwner !== 'player'
                      ? `Rival • C${activeUnit.slotIndex + 1}`
                      : unitTargets.length > 0
                      ? '🎯 Toque no alvo'
                      : activeUnit.hasSummoningSickness
                      ? '💤 Aguarda 1t'
                      : activeUnit.hasAttackedThisTurn
                      ? '⤵ Já atacou'
                      : `C${activeUnit.slotIndex + 1}`;

                  return (
                    <div
                      className="mobile-context-command-bar"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="mccb-info">
                        <span className="mccb-name">{activeUnit.card.name}</span>
                        <span className="mccb-stats">
                          ⚔️{activeUnit.currentAtk}/❤️{activeUnit.currentHp}
                        </span>
                        <span
                          className={`mccb-hint ${
                            unitTargets.length > 0 ? 'is-ready' : ''
                          }`}
                        >
                          {unitHint}
                        </span>
                      </div>
                      <div className="mccb-actions">
                        {activeSlotUnits.length > 1 && activeUnitOwner && (
                          <button
                            type="button"
                            className="mccb-btn act-move"
                            onClick={() =>
                              handleCycleSlotStack(
                                activeUnitOwner,
                                activeUnit.row,
                                activeUnit.slotIndex
                              )
                            }
                            title="Alternar carta empilhada neste slot"
                          >
                            🥞 {activeStackIdx + 1}/{activeSlotUnits.length} ▸
                          </button>
                        )}
                        {canHitSovereign && (
                          <button
                            type="button"
                            className="mccb-btn act-sovereign"
                            onClick={() =>
                              handleExecuteUnitAttackOnTarget(activeUnit, 'ai-sovereign')
                            }
                          >
                            👑 Soberano
                          </button>
                        )}
                        {validEnemyTargetUnits.map((eu) => (
                          <button
                            key={eu.instanceId}
                            type="button"
                            className="mccb-btn act-burn"
                            onClick={() =>
                              handleExecuteUnitAttackOnTarget(activeUnit, eu.instanceId)
                            }
                            title={`Atacar ${eu.card.name} (Col ${eu.slotIndex + 1} • ${eu.currentAtk}/${eu.currentHp})`}
                          >
                            ⚔️ {eu.card.name.split(' ')[0]} C{eu.slotIndex + 1} ({eu.currentHp}❤️)
                          </button>
                        ))}
                        {canAscend && (
                          <button
                            type="button"
                            className="mccb-btn act-ascend"
                            onClick={() => handleAscendFriendlyUnit(activeUnit)}
                          >
                            ★ {activeUnit.card.ascension?.cost}⚡
                          </button>
                        )}
                        {canMove && (
                          <button
                            type="button"
                            className="mccb-btn act-move"
                            onClick={() => handleMoveFriendlyUnitRow(activeUnit)}
                          >
                            ⇄ {activeUnit.row === 'vanguard' ? 'Recuar' : 'Avançar'}
                          </button>
                        )}
                        <button
                          type="button"
                          className="mccb-btn act-inspect"
                          onClick={() => setInspectCard(activeUnit.card)}
                          title="Ver detalhes da carta"
                        >
                          🔍
                        </button>
                        <button
                          type="button"
                          className="mccb-btn act-cancel"
                          onClick={() => {
                            setSelectedAttackerId(null);
                            setFocusedBoardUnitId(null);
                          }}
                          title="Cancelar seleção"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                }

                return null;
              })()}

              {/* =====================================================
                  3. UNIFIED SYMMETRIC P1 + PHASE + MENU DOCK (BOTTOM EDGE)
                  Consolidates P1 Sovereign, Hand toggle, Phase button, and Match Menu into ONE sleek bar!
                  ===================================================== */}
              <footer className="hud-unified-bottom-bar">
                {/* SPECTATOR / REPLAY TIMELINE SCRUBBER BAR ON REAL COMBAT TABLETOP */}
                {isSpectatorMode && tournamentSpectatorContext && (specLog || livePvpRoom) && (() => {
                  const clampedIdx = specLog
                    ? Math.max(0, Math.min(specVisibleMaxIdx, specCursor))
                    : 0;
                  const curFrame = specLog ? specLog.frames[clampedIdx] : null;
                  const liveStatusFlag = Boolean(livePvpRoom || isSpecLiveMatch);
                  const latestMoveText =
                    curFrame?.summary ||
                    gameState.combatLog.find((entry) => entry.category !== 'turn')?.message ||
                    '';
                  const badgeLabel =
                    tournamentSpectatorContext.customTableBadge ||
                    `Mesa #${tournamentSpectatorContext.pairing.tableNumber} · R${tournamentSpectatorContext.pairing.round}`;
                  return (
                    <div
                      className={`arena-spec-scrubber-row ${
                        isHomeLiveShowcase ? 'is-home-live-row' : ''
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="arena-spec-table-tag">{badgeLabel}</span>
                      {liveStatusFlag ? (
                        <span className="arena-spec-live-badge">
                          <span className="trn-live-dot" />
                          Ao vivo
                        </span>
                      ) : (
                        <span className="arena-spec-replay-badge">Reprise</span>
                      )}
                      {!isHomeLiveShowcase && specLog && (
                        <>
                          <div className="arena-spec-timeline-wrap">
                            <input
                              type="range"
                              className="arena-spec-range"
                              min={0}
                              max={Math.max(1, specVisibleMaxIdx)}
                              value={clampedIdx}
                              onChange={(e) => {
                                const v = Number(e.target.value);
                                setSpecIsPlaying(false);
                                if (isSpecLiveMatch) {
                                  setSpecFollowLive(v >= specVisibleMaxIdx);
                                }
                                setSpecCursor(v);
                              }}
                              aria-label="Linha do tempo da partida"
                            />
                            {!isSpecLiveMatch &&
                              specVisibleMaxIdx > 1 &&
                              specClimaxMarkers.map((mk) => {
                                const pct = Math.max(
                                  2,
                                  Math.min(
                                    98,
                                    (mk.frameIndex / Math.max(1, specVisibleMaxIdx)) * 100
                                  )
                                );
                                return (
                                  <button
                                    key={`climax-${mk.frameIndex}`}
                                    type="button"
                                    className={`arena-spec-climax-tick kind-${mk.kind}`}
                                    style={{ left: `${pct.toFixed(1)}%` }}
                                    title={`${mk.label} (Turno ${mk.turn}) — clique para assistir`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      startAdaptiveMusic();
                                      setSpecFollowLive(false);
                                      setSpecCursor(mk.leadInIndex);
                                      setSpecIsPlaying(true);
                                    }}
                                  />
                                );
                              })}
                          </div>
                          <span className="arena-spec-step-counter">
                            {clampedIdx}/{specVisibleMaxIdx}
                          </span>
                        </>
                      )}
                      {latestMoveText && (
                        <span
                          className={`arena-spec-move-summary ${
                            isHomeLiveShowcase ? 'is-home-live-summary' : ''
                          }`}
                          title={latestMoveText}
                        >
                          {latestMoveText}
                        </span>
                      )}
                    </div>
                  );
                })()}
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
                          {/* Left Card: Channeled Lands, Elemental Affinities & Crypt */}
                          <div className="hud-dropdown-section hud-drawer-card">
                            <div className="hud-drawer-card-header">
                              <span className="hud-sec-label">
                                ⛰️ SEUS TERRENOS ({gameState.player.channeledCards.length})
                              </span>
                              <button
                                type="button"
                                className="hud-inline-btn crypt-btn"
                                onClick={() => {
                                  setIsP1DrawerPinned(false);
                                  setCryptModalOwner('player');
                                }}
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
                                <div className="cpa-lands-stack">
                                  {gameState.player.channeledCards.slice(-6).map((c, i) => (
                                    <div
                                      key={`pl-land-${i}`}
                                      className={`cpa-land-card domain-${c.domain}`}
                                      style={{ marginLeft: i === 0 ? 0 : '-10px', zIndex: i + 1 }}
                                      onMouseEnter={() => handleHoverCard(c)}
                                      onMouseLeave={() => handleHoverCard(null)}
                                      title={c.name}
                                    >
                                      {c.imagePath ? <img src={c.imagePath} alt={c.name} /> : null}
                                      <span className="cpa-land-domain-pip">
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
                            {gameState.domainExpansion.owner === 'ai' && isPlayerTurn && (
                              <div className="hud-env-inline-actions">
                                <button
                                  type="button"
                                  className="hud-inline-btn"
                                  disabled={!simpleDomCheck}
                                  onClick={handleActivateSimpleDomain}
                                >
                                  💠 Domínio Simples (2⚡)
                                </button>
                                <button
                                  type="button"
                                  className="hud-inline-btn danger"
                                  disabled={!canSacBreak}
                                  onClick={handleOpenSacrificeBreakModal}
                                >
                                  💥 Romper (10❤️)
                                </button>
                              </div>
                            )}
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
                      <span className="hud-pill-stat hp" title="Seus Pontos de Vida">
                        {gameState.player.hp} PV
                      </span>
                      <span className="hud-pill-stat mana" title="Essência disponível">
                        {gameState.player.currentEssence}/{gameState.player.maxEssence} Ess.
                      </span>

                      {!isSpectatorMode && (
                      <div className="hud-p1-rituals">
                        <button
                          type="button"
                          className="hud-ritual-chip"
                          disabled={!canPwr}
                          onClick={handleSovereignPower}
                          title="Poder do Soberano (2 Essência)"
                        >
                          Poder (2)
                        </button>
                        <button
                          type="button"
                          className="hud-ritual-chip"
                          disabled={!canBlood}
                          onClick={handleBloodPact}
                          title="Pacto de Sangue (-2 PV por +1 Essência)"
                        >
                          Pacto (+1)
                        </button>
                        <button
                          type="button"
                          className={`hud-ritual-chip ${domExpCheck.allowed ? 'ready' : ''}`}
                          disabled={!domExpCheck.allowed}
                          onClick={handleInvokeDomainExpansion}
                          title="Expansão de Domínio (6 Afinidade + 3 Essência)"
                        >
                          Domínio {domExpCheck.affinity}/6
                        </button>
                        {gameState.domainExpansion?.owner === 'ai' && isPlayerTurn && (
                          <>
                            <button
                              type="button"
                              className="hud-ritual-chip"
                              disabled={!simpleDomCheck}
                              onClick={handleActivateSimpleDomain}
                              title="Domínio Simples: Anula Acerto Garantido inimigo por 2 turnos (2 Essência)"
                            >
                              Simples (2)
                            </button>
                            <button
                              type="button"
                              className="hud-ritual-chip"
                              disabled={!canSacBreak}
                              onClick={handleOpenSacrificeBreakModal}
                              title="Romper Domínio Inimigo (-10 PV)"
                            >
                              Romper (10 PV)
                            </button>
                          </>
                        )}
                      </div>
                      )}

                      <button
                        type="button"
                        className={`hud-pill-expand-btn ${isP1DrawerPinned ? 'active' : ''}`}
                        style={{ width: 'auto', padding: '0 7px', gap: '3px', fontWeight: 600, textTransform: 'none' }}
                        title={`Terrenos (${gameState.player.channeledCards.length}) · Grimório (${gameState.player.deck.length}) · Cripta (${gameState.player.crypt.length})`}
                        onClick={() =>
                          setIsP1DrawerPinned((prev) => {
                            const next = !prev;
                            if (next) {
                              setIsP2DrawerPinned(false);
                              setIsHandPinnedOpen(false);
                              setIsHandHovered(false);
                              setActiveRightDrawer(null);
                              setSelectedHandIndex(null);
                              setSelectedAttackerId(null);
                              setFocusedBoardUnitId(null);
                            }
                            return next;
                          })
                        }
                      >
                        {isP1DrawerPinned ? 'Ocultar' : 'Terrenos'}
                      </button>
                    </div>

                    <div className="hud-strip-divider" />

                    {/* Center Segment: Hand Drawer Handle */}
                    <button
                      type="button"
                      className={`hud-hand-trigger-btn ${
                        isHandPinnedOpen || isHandHovered ? 'active' : ''
                      }`}
                      style={{ textTransform: 'none', letterSpacing: '0.02em' }}
                      onMouseEnter={() => {
                        if (
                          isDesktopHoverDevice() &&
                          !isP1DrawerPinned &&
                          !isP2DrawerPinned &&
                          !activeRightDrawer &&
                          selectedHandIndex === null
                        ) {
                          setIsHandHovered(true);
                        }
                      }}
                      onClick={() => {
                        setIsHandHovered(false);
                        setSelectedAttackerId(null);
                        setFocusedBoardUnitId(null);
                        if (selectedHandIndex !== null) {
                          setSelectedHandIndex(null);
                          setIsCommandDockMinimized(false);
                          setIsP2DrawerPinned(false);
                          setIsP1DrawerPinned(false);
                          setActiveRightDrawer(null);
                          setIsHandPinnedOpen(true);
                        } else {
                          setIsHandPinnedOpen((prev) => {
                            const next = !prev;
                            if (next) {
                              setIsP2DrawerPinned(false);
                              setIsP1DrawerPinned(false);
                              setActiveRightDrawer(null);
                            }
                            return next;
                          });
                        }
                      }}
                    >
                      Mão ({gameState.player.hand.length}){' '}
                      {isHandPinnedOpen || isHandHovered ? '▾' : '▴'}
                    </button>

                    <div className="hud-strip-divider" />

                    {/* Right Segment: Phase Action & Single Gear Menu */}
                    <div
                      className="hud-phase-segment"
                      onMouseEnter={() => setIsHandHovered(false)}
                    >
                    {isSpectatorMode && tournamentSpectatorContext && (specLog || livePvpRoom) ? (
                      (() => {
                        const clampedIdx = specLog
                          ? Math.max(0, Math.min(specVisibleMaxIdx, specCursor))
                          : 0;
                        const curFrame = specLog ? specLog.frames[clampedIdx] : null;
                        const nextUnseen = specLog ? specLog.frames[clampedIdx + 1] : null;
                        const turnLim = tournamentSpectatorContext.tournament.turnTimeLimitSec || 45;
                        let liveClockSec =
                          curFrame?.activeSide === 'B'
                            ? curFrame?.clockSecB ?? turnLim
                            : curFrame?.clockSecA ?? turnLim;
                        if (isSpecLiveMatch && specFollowLive && curFrame && nextUnseen) {
                          const baseStartClock =
                            nextUnseen.actorSide === 'B'
                              ? curFrame.clockSecB
                              : curFrame.clockSecA;
                          const elapsedSinceCurSec = Math.max(
                            0,
                            Math.floor((specNowMs - curFrame.atMs) / 1000)
                          );
                          liveClockSec = Math.max(1, baseStartClock - elapsedSinceCurSec);
                        } else if (livePvpRoom) {
                          liveClockSec = Math.max(1, 60 - (Math.floor(specNowMs / 1000) % 45));
                        }

                        const renderSecondarySpecPopover = () => (
                          <details style={{ position: 'relative' }}>
                            <summary
                              className="arena-spec-btn"
                              style={{
                                listStyle: 'none',
                                cursor: 'pointer',
                                userSelect: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                              }}
                            >
                              Mais ▾
                            </summary>
                            <div
                              style={{
                                position: 'absolute',
                                bottom: 'calc(100% + 8px)',
                                right: 0,
                                zIndex: 240,
                                minWidth: '185px',
                                padding: '0.35rem',
                                borderRadius: '8px',
                                background: '#0b0f19',
                                border: '1px solid rgba(148, 163, 184, 0.22)',
                                boxShadow: '0 14px 32px rgba(0, 0, 0, 0.88)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.22rem',
                              }}
                            >
                              <button
                                type="button"
                                className={`arena-spec-btn ${specFlipped ? 'is-active' : ''}`}
                                style={{ width: '100%', justifyContent: 'flex-start', textAlign: 'left' }}
                                onClick={() => {
                                  setSelectedHandIndex(null);
                                  setFocusedBoardUnitId(null);
                                  setSpecFlipped((f) => !f);
                                }}
                              >
                                Inverter mesa
                              </button>
                              <button
                                type="button"
                                className={`arena-spec-btn ${
                                  specShareFeedback === 'copied_url' ? 'is-active' : ''
                                }`}
                                style={{ width: '100%', justifyContent: 'flex-start', textAlign: 'left' }}
                                data-shared-url={lastSharedSpecUrl || undefined}
                                onClick={() => void handleShareSpectatorLink('url')}
                              >
                                {specShareFeedback === 'copied_url'
                                  ? 'Link copiado'
                                  : specShareFeedback === 'sharing'
                                  ? 'Gerando link...'
                                  : 'Compartilhar partida'}
                              </button>
                              <button
                                type="button"
                                className={`arena-spec-btn ${
                                  specShareFeedback === 'copied_discord' ? 'is-active' : ''
                                }`}
                                style={{ width: '100%', justifyContent: 'flex-start', textAlign: 'left' }}
                                onClick={() => void handleShareSpectatorLink('discord')}
                              >
                                {specShareFeedback === 'copied_discord'
                                  ? 'Copiado p/ Discord'
                                  : specShareFeedback === 'sharing'
                                  ? 'Gerando link...'
                                  : 'Copiar p/ Discord'}
                              </button>
                              {canRecordVideo && (
                                <button
                                  type="button"
                                  className={`arena-spec-btn ${isRecordingVideo ? 'is-active' : ''}`}
                                  style={{ width: '100%', justifyContent: 'flex-start', textAlign: 'left' }}
                                  onClick={() => void handleToggleVideoRecording()}
                                >
                                  {isRecordingVideo ? 'Parar gravação' : 'Gravar vídeo'}
                                </button>
                              )}
                              <button
                                type="button"
                                className={`arena-spec-btn ${specCinemaMode ? 'is-active' : ''}`}
                                style={{ width: '100%', justifyContent: 'flex-start', textAlign: 'left' }}
                                onClick={() => toggleSpecCinemaMode()}
                              >
                                {specCinemaMode ? 'Sair do Modo Cinema' : 'Modo Cinema'}
                              </button>
                              <button
                                type="button"
                                className={`arena-spec-btn ${showLogSidebar ? 'is-active' : ''}`}
                                style={{ width: '100%', justifyContent: 'flex-start', textAlign: 'left' }}
                                onClick={() => setShowLogSidebar((p) => !p)}
                              >
                                {showLogSidebar ? 'Ocultar histórico' : 'Histórico de lances'}
                              </button>
                            </div>
                          </details>
                        );

                        if (isHomeLiveShowcase) {
                          const showDesktopCinemaBtn =
                            typeof window === 'undefined' || window.innerWidth >= 768;
                          return (
                            <div className="arena-spec-controls">
                              <span
                                className="hud-round-chip hud-turn-timer-chip"
                                title={`Turno ${gameState.turn} · Relógio de turno`}
                              >
                                <span>T{gameState.turn}</span>
                                <span className="hud-timer-sep">·</span>
                                <span className="hud-timer-val">{liveClockSec}s</span>
                              </span>

                              {tournamentSpectatorContext.onCycleNextLiveMatch && (
                                <button
                                  type="button"
                                  className="arena-spec-btn"
                                  onClick={() => {
                                    startAdaptiveMusic();
                                    tournamentSpectatorContext.onCycleNextLiveMatch?.();
                                  }}
                                  title="Sintonizar outra partida ao vivo em andamento"
                                >
                                  Outra mesa
                                </button>
                              )}

                              {showDesktopCinemaBtn && (
                                <button
                                  type="button"
                                  className={`arena-spec-btn ${specCinemaMode ? 'is-active' : ''}`}
                                  onClick={() => toggleSpecCinemaMode()}
                                  title="Modo Cinema: tela limpa 16:9 ou 9:16 ideal para gravar (Atalho: F)"
                                >
                                  Cinema
                                </button>
                              )}

                              {renderSecondarySpecPopover()}

                              <button
                                type="button"
                                className="arena-spec-btn primary"
                                onClick={() => {
                                  startAdaptiveMusic();
                                  trackAdsEvent('quick_play_clicked', {
                                    source: 'home_live_hud',
                                    isGuest,
                                  });
                                  const act =
                                    tournamentSpectatorContext.onPlayNowFromHome ??
                                    tournamentSpectatorContext.onExitSpectator;
                                  act();
                                }}
                                title="Entrar em combate agora na Arena"
                              >
                                Jogar agora
                              </button>
                            </div>
                          );
                        }

                        return (
                          <div className="arena-spec-controls">
                            <span
                              className="hud-round-chip hud-turn-timer-chip"
                              title={`Turno ${gameState.turn} · Relógio de turno`}
                            >
                              <span>T{gameState.turn}</span>
                              <span className="hud-timer-sep">·</span>
                              <span className="hud-timer-val">{liveClockSec}s</span>
                            </span>

                            <button
                              type="button"
                              className="arena-spec-btn"
                              disabled={clampedIdx <= 0}
                              onClick={() => {
                                setSpecIsPlaying(false);
                                setSpecFollowLive(false);
                                setSpecCursor(0);
                              }}
                              title="Início da partida"
                            >
                              |◀
                            </button>
                            <button
                              type="button"
                              className="arena-spec-btn"
                              disabled={clampedIdx <= 0}
                              onClick={() => {
                                setSpecIsPlaying(false);
                                setSpecFollowLive(false);
                                setSpecCursor((c) => Math.max(0, c - 1));
                              }}
                              title="Lance anterior (←)"
                            >
                              ◀
                            </button>

                            {!isSpecLiveMatch ? (
                              <button
                                type="button"
                                className="arena-spec-btn primary"
                                onClick={() => {
                                  startAdaptiveMusic();
                                  if (clampedIdx >= specVisibleMaxIdx) {
                                    setSpecCursor(0);
                                    setSpecIsPlaying(true);
                                  } else {
                                    setSpecIsPlaying((p) => !p);
                                  }
                                }}
                                title="Reproduzir / Pausar reprise (Espaço)"
                              >
                                {specIsPlaying
                                  ? 'Pausar'
                                  : clampedIdx >= specVisibleMaxIdx
                                  ? 'Rever'
                                  : 'Reproduzir'}
                              </button>
                            ) : !specFollowLive ? (
                              <button
                                type="button"
                                className="arena-spec-btn live-sync"
                                onClick={() => {
                                  setSpecFollowLive(true);
                                  setSpecCursor(specVisibleMaxIdx);
                                }}
                                title="Retornar ao tempo real da mesa"
                              >
                                Ao vivo
                              </button>
                            ) : null}

                            <button
                              type="button"
                              className="arena-spec-btn"
                              disabled={clampedIdx >= specVisibleMaxIdx}
                              onClick={() => {
                                setSpecIsPlaying(false);
                                setSpecCursor((c) => {
                                  const next = Math.min(specVisibleMaxIdx, c + 1);
                                  if (isSpecLiveMatch && next >= specVisibleMaxIdx) {
                                    setSpecFollowLive(true);
                                  }
                                  return next;
                                });
                              }}
                              title="Próximo lance (→)"
                            >
                              ▶
                            </button>
                            <button
                              type="button"
                              className="arena-spec-btn"
                              disabled={clampedIdx >= specVisibleMaxIdx}
                              onClick={() => {
                                setSpecIsPlaying(false);
                                if (isSpecLiveMatch) setSpecFollowLive(true);
                                setSpecCursor(specVisibleMaxIdx);
                              }}
                              title="Último lance disponível"
                            >
                              ▶|
                            </button>

                            {!isSpecLiveMatch && (
                              <button
                                type="button"
                                className="arena-spec-btn"
                                onClick={() =>
                                  setSpecSpeed((s) => (s === 1 ? 2 : s === 2 ? 4 : 1))
                                }
                                title="Alternar velocidade da reprise"
                              >
                                {specSpeed}×
                              </button>
                            )}

                            {!isSpecLiveMatch && specClimaxMarkers.length > 0 && (
                              <button
                                type="button"
                                className="arena-spec-btn"
                                onClick={handleJumpToNextSpecClimax}
                                title="Saltar para o próximo momento decisivo da partida"
                              >
                                Clímax
                              </button>
                            )}

                            <button
                              type="button"
                              className={`arena-spec-btn ${specCinemaMode ? 'is-active' : ''}`}
                              onClick={() => toggleSpecCinemaMode()}
                              title="Modo Cinema: tela limpa 16:9 ou 9:16 ideal para gravar (Atalho: F)"
                            >
                              Cinema
                            </button>

                            {renderSecondarySpecPopover()}

                            <button
                              type="button"
                              className="arena-spec-btn exit"
                              onClick={handleExitBattle}
                              title={`Voltar (${
                                tournamentSpectatorContext.exitButtonLabel || 'Torneio'
                              })`}
                            >
                              ←
                              <span className="hide-on-mobile">
                                {' '}
                                {tournamentSpectatorContext.exitButtonLabel || 'Torneio'}
                              </span>
                            </button>
                          </div>
                        );
                      })()
                    ) : (
                    <>
                    {tacticalProblem && (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <button
                          type="button"
                          className={`hud-pill-expand-btn ${!isProblemHudMinimized ? 'active' : ''}`}
                          style={{
                            width: 'auto',
                            padding: '0 8px',
                            gap: 4,
                            fontWeight: 900,
                            borderColor: PROBLEM_DIFFICULTY_META[tacticalProblem.difficulty].color,
                            color: '#fef08a',
                          }}
                          onClick={() => setIsProblemHudMinimized((prev) => !prev)}
                          title={
                            isProblemHudMinimized
                              ? 'Mostrar painel do Problema Tático e Dicas'
                              : 'Ocultar painel do Problema Tático'
                          }
                        >
                          ♟️ #{String(tacticalProblem.number).padStart(2, '0')}{' '}
                          {isProblemHudMinimized ? '▴' : '▾'}
                          <span className="hide-on-mobile">
                            {isProblemHudMinimized ? ' Mostrar' : ' Ocultar'}
                          </span>
                        </button>
                        <button
                          type="button"
                          className="hud-pill-expand-btn"
                          style={{ width: 'auto', padding: '0 7px', fontWeight: 800, color: '#7dd3fc' }}
                          onClick={restartCurrentProblem}
                          title="Reiniciar Turno do Problema"
                        >
                          🔄
                        </button>
                      </div>
                    )}
                    {tournamentContext && (
                      <span
                        className="hud-round-chip"
                        style={{
                          borderColor:
                            roundSecondsLeft <= 60
                              ? 'rgba(248, 113, 113, 0.55)'
                              : 'rgba(212, 175, 55, 0.42)',
                          color: roundSecondsLeft <= 60 ? '#fca5a5' : '#fef08a',
                        }}
                        title={`${tournamentContext.tournamentTitle} — Rodada ${tournamentContext.roundNumber} de ${tournamentContext.totalRounds}`}
                      >
                        <span>
                          R{tournamentContext.roundNumber}/{tournamentContext.totalRounds}
                        </span>
                        <span className="hud-timer-sep">·</span>
                        <span>
                          {String(Math.floor(roundSecondsLeft / 60)).padStart(2, '0')}:
                          {String(roundSecondsLeft % 60).padStart(2, '0')}
                        </span>
                      </span>
                    )}
                    <span
                      className={`hud-round-chip ${
                        isTimedCompetitiveMatch ? 'hud-turn-timer-chip' : ''
                      } ${
                        isTimedCompetitiveMatch && turnTimeLeft <= 10
                          ? 'is-critical'
                          : isTimedCompetitiveMatch && turnTimeLeft <= 20
                          ? 'is-warning'
                          : ''
                      }`}
                      title={
                        isTimedCompetitiveMatch
                          ? `Turno ${gameState.turn} · Limite de ${TURN_TIME_LIMIT_SECONDS}s por turno (${Math.max(
                              0,
                              turnTimeLeft
                            )}s restantes)`
                          : `Turno ${gameState.turn} · Sem limite de tempo`
                      }
                    >
                      <span>T{gameState.turn}</span>
                      {isTimedCompetitiveMatch && (
                        <>
                          <span className="hud-timer-sep">•</span>
                          <span className="hud-timer-val">{Math.max(0, turnTimeLeft)}s</span>
                        </>
                      )}
                    </span>

                    {isPlayerTurn && readyPlayerUnits.length > 0 && (
                      <button
                        type="button"
                        className="hud-action-cta attack-all"
                        disabled={Boolean(combatAnim)}
                        onClick={handleAutoAttackAll}
                      >
                        ⚔️ <span className="hide-on-mobile">ATACAR </span>({readyPlayerUnits.length})
                      </button>
                    )}

                    <button
                      type="button"
                      className="hud-action-cta primary"
                      disabled={!isPlayerTurn || Boolean(combatAnim)}
                      onClick={handleEndPlayerTurn}
                    >
                      {!isPlayerTurn ? (
                        'AGUARDE...'
                      ) : (
                        <>
                          ⏭️ PASSAR<span className="hide-on-mobile"> TURNO [ESPAÇO]</span>
                        </>
                      )}
                    </button>

                    {gameState.phase !== 'gameover' && (
                      <button
                        type="button"
                        className="hud-action-cta hide-on-mobile"
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
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingBottom: '4px',
                            borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
                          }}
                        >
                          <span
                            className="font-cinzel"
                            style={{ fontSize: '0.62rem', fontWeight: 800, color: '#fde68a' }}
                          >
                            ⚙️ OPÇÕES DA PARTIDA
                          </span>
                          <button
                            type="button"
                            className="hud-inline-btn danger"
                            onClick={() => setActiveRightDrawer(null)}
                          >
                            ✕ Ocultar
                          </button>
                        </div>
                        <div className="menu-popover-guide">
                          <strong>
                            {isPlayerTurn
                              ? `⚔️ TURNO ${gameState.turn} • SEU TURNO`
                              : `⏳ TURNO ${gameState.turn} • TURNO DO ADVERSÁRIO`}
                          </strong>
                          <span>{getStepGuideText()}</span>
                        </div>

                        {!campaignBoss && !onlineMatch && !tacticalProblem && (
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
                                <optgroup label="Grão-Soberanos Tricolores & Pentacromáticos (13 Ápices)">
                                  {allAvailableAiDecks
                                    .filter((d) => d.id.startsWith('tri_') || d.id.startsWith('penta_'))
                                    .map((d) => {
                                      const st = getUnifiedStandingForDeckId(d.id);
                                      const rankTag = st ? `#${st.rank} [${st.tierBadge}] ` : '';
                                      return (
                                        <option key={d.id} value={d.id}>
                                          {rankTag}{d.name}
                                        </option>
                                      );
                                    })}
                                </optgroup>
                                <optgroup label="Soberanos Bicolores (15 Pactos)">
                                  {allAvailableAiDecks
                                    .filter((d) => d.id.startsWith('dual_'))
                                    .map((d) => {
                                      const st = getUnifiedStandingForDeckId(d.id);
                                      const rankTag = st ? `#${st.rank} [${st.tierBadge}] ` : '';
                                      return (
                                        <option key={d.id} value={d.id}>
                                          {rankTag}{d.name}
                                        </option>
                                      );
                                    })}
                                </optgroup>
                                <optgroup label="Soberanos Monocolores (16 Arquétipos)">
                                  {allAvailableAiDecks
                                    .filter((d) => d.id.startsWith('mono_'))
                                    .map((d) => {
                                      const st = getUnifiedStandingForDeckId(d.id);
                                      const rankTag = st ? `#${st.rank} [${st.tierBadge}] ` : '';
                                      return (
                                        <option key={d.id} value={d.id}>
                                          {rankTag}{d.name} ({d.domains[0]?.toUpperCase()})
                                        </option>
                                      );
                                    })}
                                </optgroup>
                                <optgroup label="Grimórios Oficiais de Vaeloria">
                                  {PREBUILT_DECKS.map((d) => (
                                    <option key={d.id} value={d.id}>
                                      {d.name}
                                    </option>
                                  ))}
                                </optgroup>
                              </select>
                            </div>

                            <div className="awmt-deck-field">
                              <span className="awmt-deck-tag p2" title="Define o Grau de Maestria e poder do Grimório do Soberano rival">
                                MAESTRIA
                              </span>
                              <select
                                value={selectedAiSkillTier}
                                onChange={(e) => {
                                  const nextTier = Number(e.target.value) as AiSkillTier;
                                  setSelectedAiSkillTier(nextTier);
                                  startNewQuickMatch(
                                    selectedPlayerDeckId,
                                    selectedAiDeckId,
                                    nextTier
                                  );
                                }}
                                className="awmt-deck-select"
                                title={AI_SKILL_TIER_SPECS[selectedAiSkillTier].description}
                              >
                                {([1, 2, 3, 4, 5] as AiSkillTier[]).map((t) => (
                                  <option key={t} value={t}>
                                    {AI_SKILL_TIER_SPECS[t].shortLabel} — {AI_SKILL_TIER_SPECS[t].title}
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
                          <button
                            type="button"
                            className="awmt-btn danger full-width"
                            onClick={() => {
                              setActiveRightDrawer(null);
                              handleExitBattle();
                            }}
                          >
                            {campaignBoss ? '🗺️ Voltar ao Mapa' : '🏠 Sair para o Início'}
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        className={`hud-gear-btn ${activeRightDrawer === 'menu' ? 'active' : ''}`}
                        onClick={() =>
                          setActiveRightDrawer((prev) => {
                            const next = prev === 'menu' ? null : 'menu';
                            if (next === 'menu') {
                              setIsP2DrawerPinned(false);
                              setIsP1DrawerPinned(false);
                              setIsHandPinnedOpen(false);
                              setIsHandHovered(false);
                              setSelectedHandIndex(null);
                              setSelectedAttackerId(null);
                              setFocusedBoardUnitId(null);
                            }
                            return next;
                          })
                        }
                      >
                        {activeRightDrawer === 'menu' ? '✕' : '⚙️'}
                      </button>
                    </div>
                    </>
                    )}
                  </div>
                </div>
              </footer>
            </div>
          );
        })()}

        {/* =========================================================
            BOTTOM CENTER HAND DRAWER (Unobstructed — Selected Card & Actions live in the Right Panel!)
            ========================================================= */}
        {(() => {
          const anyHudPopoverOpen =
            isP1DrawerPinned || isP2DrawerPinned || activeRightDrawer !== null;
          const isHandExpanded =
            !anyHudPopoverOpen &&
            selectedHandIndex === null &&
            (isHandPinnedOpen || isHandHovered);

          return (
            <div className="cpa-bottom-zone floating-bottom-hud">
              <div
                className={`cpa-hand-drawer ${
                  isHandExpanded ? 'is-expanded' : 'is-collapsed'
                }`}
                onMouseEnter={() => {
                  if (isDesktopHoverDevice() && selectedHandIndex === null) {
                    setIsHandHovered(true);
                  }
                }}
                onMouseLeave={() => setIsHandHovered(false)}
              >
                <div className="hand-drawer-handle-bar">
                  <button
                    type="button"
                    className={`hand-drawer-toggle-btn ${isHandPinnedOpen ? 'is-pinned' : ''}`}
                    onClick={() => {
                      setIsHandPinnedOpen(false);
                      setIsHandHovered(false);
                    }}
                  >
                    {isHandExpanded
                      ? `🃏 SUA MÃO (${gameState.player.hand.length}) • ▼ OCULTAR MÃO (VER TABULEIRO)`
                      : `🃏 MÃO (${gameState.player.hand.length}) ▲`}
                  </button>
                </div>

                  <div className="cpa-hand-fan">
                    {gameState.player.hand.length === 0 ? (
                      <div className="cpa-empty-hand-msg">
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
                            className={`cpa-hand-card-slot ${isSelected ? 'is-selected-slot' : ''}`}
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
                                setSelectedAttackerId(null);
                                setFocusedBoardUnitId(null);
                                setIsP2DrawerPinned(false);
                                setIsP1DrawerPinned(false);
                                setActiveRightDrawer(null);
                                setIsHandHovered(false);
                                setIsHandPinnedOpen(false);
                                setIsCommandDockMinimized(false);
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
            isSpectatorMode || gameState.winner === 'player'
              ? 'is-victory-finisher'
              : 'is-defeat-finisher'
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

          {/* Center Sweeping Herald Banner (Cinematic Dark Fantasy Herald Style) */}
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
                <span>👑</span>
              )}
            </div>
            <div className="finisher-herald-kicker font-cinzel">
              {isSpectatorMode
                ? gameState.winner
                  ? '⚔️ SÚMULA OFICIAL • TRIUNFO SOBERANO ⚔️'
                  : '⚖️ TEMPO REGULAMENTAR • IGUALDADE NA MESA ⚖️'
                : gameState.winner === 'player'
                ? '⚔️ BASTIÃO INIMIGO DESTRUÍDO • TRIUNFO SOBERANO ⚔️'
                : '💀 SEU BASTIÃO SUCUMBIU • QUEDA DO SOBERANO 💀'}
            </div>
            <div className="finisher-herald-title font-cinzel">
              {isSpectatorMode
                ? gameState.winner === 'player'
                  ? `VITÓRIA DE ${gameState.player.name.toUpperCase()}`
                  : gameState.winner === 'ai'
                  ? `VITÓRIA DE ${gameState.ai.name.toUpperCase()}`
                  : 'EMPATE TÉCNICO (½ – ½)'
                : gameState.winner === 'player'
                ? 'VITÓRIA DO SOBERANO'
                : 'DERROTA NA BATALHA'}
            </div>
            <div className="finisher-herald-sub">{gameState.winReason}</div>
          </div>
        </div>
      )}

      {/* 2. GAME OVER SUMMARY MODAL CARD (APPEARS AFTER FINISHER ANIMATION) */}
      {gameState.phase === 'gameover' && gameoverStage === 'modal' && (
        <div className="modal-backdrop" onClick={() => setGameoverStage('dismissed')}>
          <div
            className="modal-panel gameover-modal-panel"
            style={{
              maxWidth: '560px',
              maxHeight: '90vh',
              overflowY: 'auto',
              textAlign: 'center',
              padding: '1.5rem 1.35rem',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="btn-fantasy"
              style={{
                position: 'absolute',
                top: '0.75rem',
                right: '0.75rem',
                padding: '4px 10px',
                fontSize: '0.74rem',
              }}
              onClick={() => setGameoverStage('dismissed')}
              title="Fechar resumo e ver o tabuleiro final"
            >
              ✕ Fechar
            </button>
            <div
              className="font-cinzel"
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.18em',
                color: isSpectatorMode || gameState.winner === 'player' ? '#d4af37' : '#ef4444',
                marginBottom: '0.5rem',
              }}
            >
              {isSpectatorMode
                ? tournamentSpectatorContext?.variant === 'personal_replay'
                  ? tournamentSpectatorContext.tournament.title.toUpperCase()
                  : `MESA #${tournamentSpectatorContext?.pairing.tableNumber ?? 1} · RODADA ${
                      tournamentSpectatorContext?.pairing.round ?? 1
                    }`
                : gameState.winner === 'player'
                ? 'TRIUNFO SOBERANO'
                : 'QUEDA DO BASTIÃO'}
            </div>
            <h2
              className="font-cinzel gold-gradient-text"
              style={{ fontSize: '1.65rem', marginBottom: '0.5rem' }}
            >
              {isSpectatorMode
                ? gameState.winner === 'player'
                  ? `VITÓRIA DE ${gameState.player.name}`
                  : gameState.winner === 'ai'
                  ? `VITÓRIA DE ${gameState.ai.name}`
                  : 'EMPATE TÉCNICO (½ – ½)'
                : gameState.winner === 'player'
                ? 'VITÓRIA DO SOBERANO'
                : 'DERROTA NA BATALHA'}
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.92rem', marginBottom: '0.95rem' }}>
              {gameState.winReason}
            </p>

            {/* Official FIDE Ranked ELO Duel Outcome Card */}
            {rankedDuelContext && (() => {
              const res = rankedDuelContext.lastResult;
              const newElo = res?.newElo ?? rankedDuelContext.playerElo;
              const prevElo = res?.previousElo ?? rankedDuelContext.playerElo;
              const delta = res?.deltaElo ?? 0;
              const div = getEloDivisionMeta(newElo);
              return (
                <div
                  style={{
                    padding: '0.8rem 0.95rem',
                    marginBottom: '0.9rem',
                    borderRadius: '10px',
                    textAlign: 'left',
                    background:
                      gameState.winner === 'player'
                        ? 'linear-gradient(135deg, rgba(6, 78, 59, 0.72), rgba(15, 23, 42, 0.94))'
                        : 'linear-gradient(135deg, rgba(127, 29, 29, 0.65), rgba(15, 23, 42, 0.94))',
                    border:
                      gameState.winner === 'player'
                        ? '1.5px solid rgba(52, 211, 153, 0.7)'
                        : '1.5px solid rgba(248, 113, 113, 0.6)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '6px',
                      marginBottom: '4px',
                    }}
                  >
                    <span
                      className="font-cinzel"
                      style={{ fontSize: '0.72rem', fontWeight: 800, color: '#fde047' }}
                    >
                      Ranking Geral de Vaeloria
                    </span>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '0.66rem',
                        fontWeight: 700,
                        color: div.color,
                        background: div.bgRgba,
                        border: `1px solid ${div.borderRgba}`,
                      }}
                    >
                      {div.label}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.86rem', color: '#f8fafc', fontWeight: 800 }}>
                    Rating: {prevElo} → {newElo} ELO (
                    <span style={{ color: delta >= 0 ? '#6ee7b7' : '#fca5a5' }}>
                      {delta >= 0 ? `+${delta}` : delta} ELO
                    </span>
                    )
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '2px' }}>
                    Oponente: {rankedDuelContext.opponentEntry.sovereignName} (
                    {rankedDuelContext.opponentEntry.eloRating} ELO · Grau{' '}
                    {rankedDuelContext.opponentEntry.skillTier})
                  </div>
                </div>
              );
            })()}

            {/* Post-Match Tactical Dossier & MVP Card Spotlight */}
            {!tacticalProblem && (() => {
              const dossier = computeMatchDossier(gameState);
              return (
                <div className="gameover-mvp-dossier">
                  <div className="gmd-mvp-row">
                    {dossier.mvpCard.imagePath && (
                      <img
                        src={dossier.mvpCard.imagePath}
                        alt={dossier.mvpCard.name}
                        className="gmd-mvp-thumb"
                      />
                    )}
                    <div className="gmd-mvp-copy">
                      <span className="gmd-mvp-kicker">{dossier.mvpKicker}</span>
                      <strong className="font-cinzel gmd-mvp-name">
                        {dossier.mvpCard.name}
                      </strong>
                      <small className="gmd-mvp-reason">{dossier.mvpReason}</small>
                    </div>
                  </div>
                  <div className="gmd-metrics-strip">
                    <span>{dossier.turnsPlayed} turnos</span>
                    <span>{dossier.playerUnitsSummoned} invocações</span>
                    <span>{dossier.playerSpellsAndReactions} magias</span>
                    <span>
                      {dossier.playerFinalHp} vs {dossier.aiFinalHp} PV
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Post-Match Neural Telemetry ("Análise do Oráculo" via Value MLP) */}
            {!tacticalProblem && !onlineMatch && (() => {
              const snaps = neuralTelemetryRef.current;
              const rivalRawId =
                gameState.aiDeckId ??
                campaignBoss?.archetypeId ??
                campaignBoss?.deckId ??
                selectedAiDeckId;
              const rivalStanding = getUnifiedStandingForDeckId(rivalRawId);
              const playerRawId = gameState.playerDeckId ?? selectedPlayerDeckId;
              const playerStanding = getUnifiedStandingForDeckId(playerRawId);
              const empiricalWr = getEmpiricalUnifiedWinRatePct(playerRawId, rivalRawId);

              const myClassicId =
                playerStanding?.classicDeckIds[0] ??
                (PREBUILT_DECKS.some((d) => d.id === playerRawId)
                  ? playerRawId
                  : 'deck_red_inferno');
              const enemyClassicId =
                rivalStanding?.classicDeckIds[0] ??
                campaignBoss?.deckId ??
                (PREBUILT_DECKS.some((d) => d.id === rivalRawId)
                  ? rivalRawId
                  : 'deck_blue_tempest');
              const matchupGuide = getMatchupGuide(myClassicId, enemyClassicId);

              // Find biggest single-step swing in neural advantage
              let bestIdx = snaps.length > 1 ? 1 : 0;
              let bestAbsDelta = 0;
              for (let i = 1; i < snaps.length; i++) {
                const absDelta = Math.abs(snaps[i].winPct - snaps[i - 1].winPct);
                if (absDelta >= bestAbsDelta) {
                  bestAbsDelta = absDelta;
                  bestIdx = i;
                }
              }
              const prevWin = snaps[bestIdx - 1]?.winPct ?? 50;
              const currWin =
                snaps[bestIdx]?.winPct ?? (gameState.winner === 'player' ? 100 : 0);
              const delta = currWin - prevWin;
              const pivotTurn = snaps[bestIdx]?.turn ?? gameState.turn;
              const pivotAction = snaps[bestIdx]?.keyAction || gameState.winReason;

              // Build SVG sparkline coordinates (240x40)
              const svgW = 240;
              const svgH = 40;
              const plotSnaps =
                snaps.length >= 2
                  ? snaps
                  : [
                      { winPct: 50, turn: 1 },
                      { winPct: gameState.winner === 'player' ? 100 : 0, turn: gameState.turn },
                    ];
              const polyPoints = plotSnaps
                .map((s, idx) => {
                  const x = (idx / Math.max(1, plotSnaps.length - 1)) * (svgW - 8) + 4;
                  const y = svgH - 4 - (s.winPct / 100) * (svgH - 8);
                  return `${x.toFixed(1)},${y.toFixed(1)}`;
                })
                .join(' ');
              const pivotX =
                snaps.length >= 2
                  ? (bestIdx / Math.max(1, snaps.length - 1)) * (svgW - 8) + 4
                  : svgW - 4;
              const pivotY = svgH - 4 - (currWin / 100) * (svgH - 8);

              return (
                <details
                  style={{
                    textAlign: 'left',
                    padding: '0.55rem 0.75rem',
                    marginBottom: '0.85rem',
                    borderRadius: '8px',
                    background: 'rgba(15, 23, 42, 0.65)',
                    border: '1px solid rgba(148, 163, 184, 0.18)',
                  }}
                >
                  <summary
                    style={{
                      cursor: 'pointer',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      color: '#cbd5e1',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>Análise tática da partida (Turno decisivo: T{pivotTurn})</span>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                      {tournamentSpectatorContext
                        ? `Mesa #${tournamentSpectatorContext.pairing.tableNumber}`
                        : rivalStanding
                        ? rivalStanding.name
                        : ''}
                    </span>
                  </summary>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '112px 1fr',
                      gap: '8px',
                      alignItems: 'center',
                      padding: '6px 8px',
                      borderRadius: '7px',
                      background: 'rgba(2, 6, 23, 0.55)',
                      border: '1px solid rgba(148, 163, 184, 0.14)',
                      marginTop: '8px',
                      marginBottom: '7px',
                    }}
                  >
                    <div>
                      <svg
                        viewBox={`0 0 ${svgW} ${svgH}`}
                        style={{ width: '100%', height: '36px', display: 'block' }}
                        aria-label="Trajetória de vantagem turno a turno"
                      >
                        <line
                          x1="0"
                          y1={svgH / 2}
                          x2={svgW}
                          y2={svgH / 2}
                          stroke="rgba(148,163,184,0.3)"
                          strokeDasharray="3 3"
                          strokeWidth="1"
                        />
                        <polyline
                          fill="none"
                          stroke={gameState.winner === 'player' ? '#34d399' : '#f87171'}
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={polyPoints}
                        />
                        <circle
                          cx={pivotX}
                          cy={pivotY}
                          r="3.5"
                          fill="#fde047"
                          stroke="#0f172a"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>

                    <div style={{ fontSize: '0.72rem', lineHeight: 1.35, color: '#e2e8f0' }}>
                      <strong
                        style={{
                          color: delta >= 0 ? '#6ee7b7' : '#fca5a5',
                          display: 'block',
                        }}
                      >
                        Virada no Turno {pivotTurn}: {prevWin}% → {currWin}%
                      </strong>
                      {pivotAction && (
                        <span
                          style={{
                            color: '#94a3b8',
                            fontSize: '0.68rem',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {pivotAction}
                        </span>
                      )}
                    </div>
                  </div>

                  {!isSpectatorMode && (
                  <div style={{ fontSize: '0.72rem', lineHeight: 1.4, color: '#94a3b8' }}>
                    {empiricalWr !== null && (
                      <div style={{ marginBottom: '3px', color: '#cbd5e1' }}>
                        Taxa empírica deste confronto: {empiricalWr}%
                      </div>
                    )}
                    <div>
                      <strong style={{ color: '#e2e8f0' }}>Contra-tática:</strong>{' '}
                      {matchupGuide.positioningTactic}
                    </div>
                  </div>
                  )}
                </details>
              );
            })()}

            {!isSpectatorMode && gameState.winner === 'player' && (
              <div
                style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  background: 'rgba(212, 175, 55, 0.08)',
                  border: '1px solid rgba(212, 175, 55, 0.28)',
                  color: '#fde68a',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  marginBottom: '1.15rem',
                }}
              >
                {tacticalProblem ? (
                  `${tacticalProblem.code} resolvido · +${tacticalProblem.goldReward} Ouro (1ª conclusão)`
                ) : isGuest ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span>
                      Vitória como Visitante · Salve este espólio (+{160 + VICTORY_GOLD_REWARD} Ouro + Grimório de 100 cartas)
                    </span>
                    {onGuestClaimVictoryAccount && (
                      <button
                        type="button"
                        className="btn-fantasy btn-fantasy-primary"
                        style={{ padding: '5px 12px', fontSize: '0.78rem' }}
                        onClick={() => onGuestClaimVictoryAccount(VICTORY_GOLD_REWARD)}
                      >
                        Criar Conta Gratuita
                      </button>
                    )}
                  </div>
                ) : campaignBoss ? (
                  <div>
                    <div>
                      Espólio: +{Math.max(VICTORY_GOLD_REWARD, campaignBoss.rewardGold ?? VICTORY_GOLD_REWARD)} Ouro
                      {campaignBoss.rewardShards ? ` · +${campaignBoss.rewardShards} Estilhaços` : ''}
                    </div>
                    {campaignBoss.rewardCardIds && campaignBoss.rewardCardIds.length > 0 && (
                      <div style={{ fontSize: '0.74rem', color: '#cbd5e1', fontWeight: 500, marginTop: 3 }}>
                        1ª vitória integra +1 cópia à coleção:{' '}
                        {campaignBoss.rewardCardIds
                          .map((cid) => CARDS_BY_ID[cid]?.name)
                          .filter(Boolean)
                          .join(', ')}
                      </div>
                    )}
                  </div>
                ) : (
                  `+${VICTORY_GOLD_REWARD} Ouro`
                )}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              {tacticalProblem && onSelectProblem && lazyProblemsModule && (() => {
                const { nextProblem, isCyclingUnsolvedInTier, pendingInCurrentTier } =
                  lazyProblemsModule.getNextPlayableProblem(tacticalProblem.id);
                if (!nextProblem) return null;
                return (
                  <button
                    type="button"
                    className="btn-fantasy btn-fantasy-primary"
                    onClick={() => onSelectProblem(nextProblem)}
                  >
                    {isCyclingUnsolvedInTier
                      ? `Resolver pendente deste Grau: ${nextProblem.code} (faltam ${pendingInCurrentTier})`
                      : nextProblem.difficulty !== tacticalProblem.difficulty
                        ? `Avançar ao próximo Grau: ${nextProblem.code}`
                        : `Próximo: ${nextProblem.code}`}
                  </button>
                );
              })()}
              {tournamentSpectatorContext ? (
                isHomeLiveShowcase ? (
                  <>
                    <button
                      type="button"
                      className="btn-fantasy btn-fantasy-primary"
                      onClick={() => {
                        trackAdsEvent('quick_play_clicked', {
                          source: 'home_live_gameover',
                          isGuest,
                        });
                        const act =
                          tournamentSpectatorContext.onPlayNowFromHome ??
                          tournamentSpectatorContext.onExitSpectator;
                        act();
                      }}
                    >
                      Jogar Agora
                    </button>
                    {tournamentSpectatorContext.onCycleNextLiveMatch && (
                      <button
                        type="button"
                        className="btn-fantasy"
                        onClick={tournamentSpectatorContext.onCycleNextLiveMatch}
                      >
                        Outra Mesa Ao Vivo
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="btn-fantasy btn-fantasy-primary"
                      onClick={tournamentSpectatorContext.onExitSpectator}
                    >
                      {tournamentSpectatorContext.exitButtonLabel
                        ? `← Voltar (${tournamentSpectatorContext.exitButtonLabel})`
                        : '← Voltar ao Salão do Torneio'}
                    </button>
                    <button
                      type="button"
                      className="btn-fantasy"
                      onClick={() => {
                        setGameoverStage('none');
                        setRewardClaimed(false);
                        setSpecCursor(0);
                        setSpecIsPlaying(true);
                      }}
                    >
                      ↻ Rever do Início
                    </button>
                  </>
                )
              ) : tournamentContext ? (
                <button
                  type="button"
                  className="btn-fantasy btn-fantasy-primary"
                  onClick={tournamentContext.onExitTournament}
                >
                  Voltar ao Salão do Torneio
                </button>
              ) : rankedDuelContext ? (
                <button
                  type="button"
                  className="btn-fantasy btn-fantasy-primary"
                  onClick={rankedDuelContext.onExitLeaderboard}
                >
                  Voltar ao Ranking ELO
                </button>
              ) : (
                campaignBoss &&
                onExitCampaign &&
                gameState.winner === 'player' && (
                  <button
                    type="button"
                    className="btn-fantasy btn-fantasy-primary"
                    onClick={onExitCampaign}
                  >
                    Voltar ao Mapa
                  </button>
                )
              )}
              {!isSpectatorMode && !onlineMatch && !tournamentContext && (
                <button
                  type="button"
                  className={
                    tacticalProblem || (campaignBoss && gameState.winner === 'player')
                      ? 'btn-fantasy'
                      : 'btn-fantasy btn-fantasy-primary'
                  }
                  onClick={() => startNewQuickMatch(selectedPlayerDeckId, selectedAiDeckId)}
                >
                  {tacticalProblem
                    ? 'Repetir Problema'
                    : campaignBoss && gameState.winner === 'player'
                      ? 'Reenfrentar'
                      : 'Jogar Novamente'}
                </button>
              )}
              {tacticalProblem && onExitProblems && (
                <button type="button" className="btn-fantasy" onClick={onExitProblems}>
                  Lista de Problemas
                </button>
              )}
              {onlineMatch && !tournamentContext && (
                <button
                  type="button"
                  className="btn-fantasy btn-fantasy-primary"
                  onClick={onlineMatch.onExitPvp}
                >
                  Voltar ao Conclave 1×1
                </button>
              )}
              {!tournamentContext &&
                !rankedDuelContext &&
                campaignBoss &&
                onExitCampaign &&
                gameState.winner !== 'player' && (
                  <button type="button" className="btn-fantasy" onClick={onExitCampaign}>
                    Voltar ao Mapa
                  </button>
                )}
              {!isSpectatorMode && !tournamentContext && !onlineMatch && !campaignBoss && !tacticalProblem && onExitArena && (
                <button type="button" className="btn-fantasy" onClick={onExitArena}>
                  Voltar ao Início
                </button>
              )}
              {!isSpectatorMode && !tacticalProblem && onOpenLastPersonalReplay && (
                <button
                  type="button"
                  className="btn-fantasy"
                  onClick={onOpenLastPersonalReplay}
                >
                  Rever Partida
                </button>
              )}
              <button
                type="button"
                className="btn-fantasy"
                onClick={() => setGameoverStage('dismissed')}
              >
                👁️ Ver Tabuleiro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Post-Game Banner when Game Over Modal was Dismissed to View Board */}
      {gameState.phase === 'gameover' && gameoverStage === 'dismissed' && (
        <div
          style={{
            position: 'fixed',
            top: '56px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1500,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            padding: '0.45rem 0.85rem',
            borderRadius: '999px',
            background: 'rgba(10, 15, 28, 0.95)',
            border: '1.5px solid rgba(250, 204, 21, 0.65)',
            boxShadow: '0 10px 28px rgba(0, 0, 0, 0.85)',
          }}
        >
          <span className="font-cinzel gold-gradient-text" style={{ fontSize: '0.74rem', fontWeight: 800 }}>
            {isSpectatorMode
              ? gameState.winner === 'player'
                ? `🏆 VITÓRIA DE ${gameState.player.name.toUpperCase()}`
                : gameState.winner === 'ai'
                ? `🏆 VITÓRIA DE ${gameState.ai.name.toUpperCase()}`
                : '⚖️ EMPATE TÉCNICO'
              : gameState.winner === 'player'
              ? '🏆 VITÓRIA'
              : '💀 FIM DE PARTIDA'}
          </span>
          {!isSpectatorMode && !onlineMatch && !tournamentContext && (
            <button
              type="button"
              className="btn-fantasy btn-fantasy-primary"
              style={{ padding: '4px 10px', fontSize: '0.7rem' }}
              onClick={() => startNewQuickMatch(selectedPlayerDeckId, selectedAiDeckId)}
            >
              Jogar Novamente
            </button>
          )}
          <button
            type="button"
            className="btn-fantasy"
            style={{ padding: '4px 10px', fontSize: '0.7rem' }}
            onClick={handleExitBattle}
          >
            {tournamentSpectatorContext
              ? tournamentSpectatorContext.exitButtonLabel ?? 'Voltar ao Torneio'
              : tournamentContext
              ? 'Voltar ao Torneio'
              : campaignBoss
              ? 'Voltar ao Mapa'
              : 'Sair'}
          </button>
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
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
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
              {!onlineMatch && (
                <button
                  type="button"
                  className="btn-fantasy"
                  onClick={() => {
                    setShowSurrenderConfirm(false);
                    handleExitBattle();
                  }}
                >
                  {campaignBoss ? '🗺️ Voltar ao Mapa' : '🏠 Sair para o Início'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TURN TIMER ROPE WARNING BANNER (FINAL 15 SECONDS OF TURN — COMPETITIVE MODES ONLY) */}
      {isTimedCompetitiveMatch &&
        !isMulliganOpen &&
        gameState.phase !== 'gameover' &&
        turnTimeLeft <= 15 && (
        <div
          className={`turn-rope-warning-banner ${
            turnTimeLeft <= 6 ? 'is-critical' : ''
          }`}
        >
          <span>
            {isPlayerTurn ? (
              <>
                🔥 {Math.max(0, turnTimeLeft)}s restantes
                <span className="hide-on-mobile"> — conclua suas ações ou passe o turno!</span>
              </>
            ) : (
              `⏳ ${gameState.ai.name}: ${Math.max(0, turnTimeLeft)}s`
            )}
          </span>
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
        <Suspense fallback={null}>
          <TutorialCodexView
            isModal={true}
            onClose={() => setShowQuickRules(false)}
            onStartPracticeDuel={() => {
              setShowQuickRules(false);
              setArenaTutorialStep(0);
            }}
            onInspectCard={setInspectCard}
          />
        </Suspense>
      )}

      {/* REAL-TIME TACTICAL ADVISOR OVERLAY MODAL */}
      {showTacticalAdvisor && (
        <Suspense fallback={null}>
          <TacticalGuideView
            customDecks={customDecks}
            initialPlayerDeckId={selectedPlayerDeckId}
            initialOpponentDeckId={campaignBoss ? campaignBoss.deckId : selectedAiDeckId}
            isModal={true}
            onClose={() => setShowTacticalAdvisor(false)}
            onLaunchDuel={(pId, aId, tier) => {
              const nextTier = tier ?? selectedAiSkillTier;
              setShowTacticalAdvisor(false);
              setSelectedPlayerDeckId(pId);
              setSelectedAiDeckId(aId);
              setSelectedAiSkillTier(nextTier);
              startNewQuickMatch(pId, aId, nextTier);
            }}
          />
        </Suspense>
      )}

      {/* CARD INSPECT MODAL */}
      {inspectCard && (
        <CardInspectModal card={inspectCard} onClose={() => setInspectCard(null)} />
      )}
    </div>
  );
};
