import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ALL_CARDS, CARDS_BY_ID } from '../data/cards';
import { createInitialGameState } from '../engine/gameEngine';
import { CardDefinition, Domain } from '../types/game';
import {
  getActiveRoomsList,
  getAvatarHonorificTitle,
  getRoomByCode,
  isAdminProfile,
  MultiplayerRoom,
  publishMpMessage,
  SovereignUserProfile,
  subscribeMultiplayerBus,
} from '../utils/multiplayerEngine';
import { playSfx } from '../utils/soundEngine';
import {
  ComputedRoundPairing,
  ComputedTournamentSnapshot,
  ComputedTournamentStanding,
  computeTournamentSnapshot,
  DEFAULT_INAUGURAL_TOURNAMENT,
  enrollHumanInTournament,
  fetchActiveTournamentStateFromCloud,
  getTournamentNowMs,
  HumanTournamentEntry,
  inferDeckPrimaryDomain,
  publishTournamentDefinitionToCloud,
  SwissTournamentDefinition,
  TOURNAMENT_TIME_CONTROLS,
  TournamentPrizeKind,
  TournamentTimeControlId,
  upsertHumanTournamentEntryToCloud,
} from '../utils/tournamentEngine';
import type { CustomSavedDeck } from './BattleArena';
import { DOMAIN_META } from './CardView';

export interface ActiveTournamentMatchLaunch {
  tournament: SwissTournamentDefinition;
  roundNumber: number;
  roundPlayDeadlineMs: number;
  entry: HumanTournamentEntry;
  opponentStanding: ComputedTournamentStanding;
}

interface TournamentsViewProps {
  currentUser: SovereignUserProfile;
  customDecks: CustomSavedDeck[];
  unlockedCardIds: Record<string, number>;
  isGuest: boolean;
  onRequireAccount: () => void;
  onRequireDeckSetup: () => void;
  onInspectCard: (card: CardDefinition) => void;
  onStartTournamentSovereignMatch: (launch: ActiveTournamentMatchLaunch) => void;
  onStartTournamentPvpMatch: (
    launch: ActiveTournamentMatchLaunch,
    room: MultiplayerRoom,
    role: 'host' | 'guest'
  ) => void;
}

const DOMAIN_LABELS_PT: Record<Domain, string> = {
  red: 'Pyros (Chama)',
  green: 'Veridia (Selva)',
  blue: 'Vórtex (Tempestade)',
  purple: 'Eclipse (Abismo)',
  gold: 'Solária (Ordem)',
  neutral: 'Matriz Axial',
};

function formatClockCountdown(ms: number): string {
  const totalSec = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) {
    return `${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatBrtHourMinute(epochMs: number): string {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo',
    }).format(new Date(epochMs));
  } catch {
    const d = new Date(epochMs);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }
}

function formatPoints(pts: number): string {
  return Number.isInteger(pts) ? `${pts}.0` : pts.toFixed(1);
}

function resolveDeckCardsForPvp(cardIds: string[]): CardDefinition[] {
  const out: CardDefinition[] = [];
  for (const cid of cardIds) {
    const c = CARDS_BY_ID[cid];
    if (c) out.push(c);
  }
  let idx = 0;
  while (out.length < 100 && ALL_CARDS.length > 0) {
    out.push(ALL_CARDS[idx % ALL_CARDS.length]);
    idx += 1;
  }
  return out;
}

const PAGE_SIZE = 50;
const AUTO_START_PREF_KEY = 'chromatic_pact_tournament_autostart_v1';

export const TournamentsView: React.FC<TournamentsViewProps> = ({
  currentUser,
  customDecks,
  unlockedCardIds,
  isGuest,
  onRequireAccount,
  onRequireDeckSetup,
  onInspectCard,
  onStartTournamentSovereignMatch,
  onStartTournamentPvpMatch,
}) => {
  const [definition, setDefinition] = useState<SwissTournamentDefinition>(
    DEFAULT_INAUGURAL_TOURNAMENT
  );
  const [humanEntries, setHumanEntries] = useState<HumanTournamentEntry[]>([]);
  const [nowMs, setNowMs] = useState<number>(() => getTournamentNowMs());
  const [selectedDeckId, setSelectedDeckId] = useState<string>(
    () => currentUser.preferredDeckId || customDecks[0]?.id || ''
  );
  const [isEnrolling, setIsEnrolling] = useState<boolean>(false);
  const [autoStartRounds, setAutoStartRounds] = useState<boolean>(() => {
    try {
      const v = localStorage.getItem(AUTO_START_PREF_KEY);
      return v === null ? true : v === '1';
    } catch {
      return true;
    }
  });
  const [activeSubView, setActiveSubView] = useState<'standings' | 'pairings'>('standings');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  // Human-vs-Human deterministic table handshake state
  const [pvpHandshakeState, setPvpHandshakeState] = useState<{
    roomCode: string;
    round: number;
    opponent: ComputedTournamentStanding;
    startedWaitAtMs: number;
    secondsLeft: number;
  } | null>(null);

  // Admin schedule form state (discreet progressive disclosure)
  const [admTitle, setAdmTitle] = useState<string>('Terça Soberana — Suíço Oficial');
  const [admStartLocal, setAdmStartLocal] = useState<string>(() => {
    const d = new Date(Date.now() + 15 * 60 * 1000);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}`;
  });
  const [admRounds, setAdmRounds] = useState<number>(6);
  const [admTimeControl, setAdmTimeControl] = useState<TournamentTimeControlId>('rapid_45s');
  const [admPrizeKind, setAdmPrizeKind] = useState<TournamentPrizeKind>(
    'unowned_domain_rare_card'
  );
  const [admCashBrl, setAdmCashBrl] = useState<number>(50);

  const lastAutoLaunchedKeyRef = useRef<string>('');

  useEffect(() => {
    if (!selectedDeckId && customDecks[0]?.id) {
      setSelectedDeckId(currentUser.preferredDeckId || customDecks[0].id);
    }
  }, [customDecks, currentUser.preferredDeckId, selectedDeckId]);

  const refreshCloudState = useCallback(async () => {
    const res = await fetchActiveTournamentStateFromCloud();
    setDefinition(res.definition);
    setHumanEntries(res.entries);
    setNowMs(getTournamentNowMs());
  }, []);

  useEffect(() => {
    void refreshCloudState();
    const cloudTimer = window.setInterval(() => {
      void refreshCloudState();
    }, 5000);
    const clockTimer = window.setInterval(() => {
      setNowMs(getTournamentNowMs());
    }, 1000);
    return () => {
      window.clearInterval(cloudTimer);
      window.clearInterval(clockTimer);
    };
  }, [refreshCloudState]);

  const snapshot: ComputedTournamentSnapshot = useMemo(
    () =>
      computeTournamentSnapshot(
        definition,
        humanEntries,
        isGuest ? null : currentUser.username,
        nowMs
      ),
    [definition, humanEntries, isGuest, currentUser.username, nowMs]
  );

  const selectedDeckObj = useMemo(
    () => customDecks.find((d) => d.id === selectedDeckId) ?? customDecks[0] ?? null,
    [customDecks, selectedDeckId]
  );

  const myOpponentStanding: ComputedTournamentStanding | null = useMemo(() => {
    const p = snapshot.myCurrentPairing;
    if (!p || !snapshot.myStanding) return null;
    if (p.playerA.participantId === snapshot.myStanding.participantId) {
      return p.playerB;
    }
    return p.playerA;
  }, [snapshot.myCurrentPairing, snapshot.myStanding]);

  const myCurrentRoundRecord = useMemo(() => {
    if (!snapshot.myEntry || snapshot.currentRound < 1) return null;
    return snapshot.myEntry.resultsByRound?.[snapshot.currentRound] ?? null;
  }, [snapshot.myEntry, snapshot.currentRound]);

  const handleToggleAutoStart = (checked: boolean) => {
    setAutoStartRounds(checked);
    try {
      localStorage.setItem(AUTO_START_PREF_KEY, checked ? '1' : '0');
    } catch {
      // Ignore
    }
  };

  const handleEnroll = async () => {
    if (isGuest) {
      onRequireAccount();
      return;
    }
    if (!selectedDeckObj || selectedDeckObj.cardIds.length < 30) {
      onRequireDeckSetup();
      return;
    }
    setIsEnrolling(true);
    try {
      const entry = await enrollHumanInTournament({
        tournament: snapshot.definition,
        user: currentUser,
        deckId: selectedDeckObj.id,
        deckName: selectedDeckObj.name,
        deckCardIds: selectedDeckObj.cardIds,
        unlockedCardIds,
      });
      playSfx('ascend');
      setHumanEntries((prev) => {
        const clean = entry.username.trim().toLowerCase();
        return [
          ...prev.filter((e) => e.username.trim().toLowerCase() !== clean),
          entry,
        ];
      });
      const domLabel = DOMAIN_LABELS_PT[entry.primaryDomain] ?? entry.primaryDomain;
      setStatusFeedback(
        `Inscrição confirmada com "${entry.deckName}" (${domLabel}). Pareamento automático ativo.`
      );
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleEnterRoundMatch = useCallback(async () => {
    if (
      !snapshot.myEntry ||
      !snapshot.myStanding ||
      !snapshot.myCurrentPairing ||
      snapshot.phase !== 'round_active' ||
      myCurrentRoundRecord
    ) {
      return;
    }

    const round = snapshot.currentRound;
    const opp = myOpponentStanding;
    if (!opp) return;

    // Mark activeRoundStarted on player's cloud entry so tiebreaks/forfeits know this player showed up
    const updatedEntry: HumanTournamentEntry = {
      ...snapshot.myEntry,
      activeRoundStarted: round,
      lastHeartbeatAtMs: getTournamentNowMs(),
    };
    void upsertHumanTournamentEntryToCloud(updatedEntry);

    const launchPayload: ActiveTournamentMatchLaunch = {
      tournament: snapshot.definition,
      roundNumber: round,
      roundPlayDeadlineMs: snapshot.roundPlayDeadlineMs,
      entry: updatedEntry,
      opponentStanding: opp,
    };

    if (opp.kind === 'sovereign' && opp.sovereignEntry) {
      playSfx('summon');
      onStartTournamentSovereignMatch(launchPayload);
      return;
    }

    // Human vs Human deterministic room handshake
    const roomCode =
      snapshot.myCurrentPairing.roomCode || `TRN${round}-${snapshot.myCurrentPairing.tableNumber}`;
    const amCanonicalHost = snapshot.myStanding.participantId < opp.participantId;
    const existing =
      getRoomByCode(roomCode) ?? getActiveRoomsList().find((r) => r.code === roomCode);

    if (!amCanonicalHost && existing && existing.status === 'waiting') {
      const hostCards = resolveDeckCardsForPvp(existing.host.cardIds);
      const guestCards = resolveDeckCardsForPvp(updatedEntry.deckCardIds);
      const canonicalState = createInitialGameState(hostCards, guestCards, {
        playerName: existing.host.username,
        aiName: currentUser.username,
        aiTitle: `${getAvatarHonorificTitle(currentUser.avatarCardId)} (${currentUser.eloRating} ELO)`,
        aiAvatarCardId: currentUser.avatarCardId,
      });
      canonicalState.player.title = `${getAvatarHonorificTitle(existing.host.avatarCardId)} (${existing.host.eloRating} ELO)`;
      canonicalState.player.avatarCardId = existing.host.avatarCardId;

      const joinedRoom: MultiplayerRoom = {
        ...existing,
        status: 'playing',
        guest: {
          id: currentUser.id,
          username: currentUser.username,
          title: getAvatarHonorificTitle(currentUser.avatarCardId),
          avatarCardId: currentUser.avatarCardId,
          eloRating: currentUser.eloRating,
          deckId: updatedEntry.deckId,
          cardIds: updatedEntry.deckCardIds,
        },
        canonicalState,
        stateVersion: existing.stateVersion + 1,
        lastActorId: currentUser.id,
      };
      publishMpMessage({ type: 'ROOM_UPSERT', room: joinedRoom });
      playSfx('ascend');
      onStartTournamentPvpMatch(launchPayload, joinedRoom, 'guest');
      return;
    }

    // Publish waiting room if canonical host (or wait for canonical host to publish within 35s)
    if (amCanonicalHost) {
      const waitingRoom: MultiplayerRoom = {
        code: roomCode,
        status: 'waiting',
        isPublicQueue: false,
        createdAt: Date.now(),
        host: {
          id: currentUser.id,
          username: currentUser.username,
          title: getAvatarHonorificTitle(currentUser.avatarCardId),
          avatarCardId: currentUser.avatarCardId,
          eloRating: currentUser.eloRating,
          deckId: updatedEntry.deckId,
          cardIds: updatedEntry.deckCardIds,
        },
        stateVersion: 1,
      };
      publishMpMessage({ type: 'ROOM_UPSERT', room: waitingRoom });
    }

    playSfx('channel');
    setPvpHandshakeState({
      roomCode,
      round,
      opponent: opp,
      startedWaitAtMs: Date.now(),
      secondsLeft: 35,
    });
  }, [
    snapshot,
    myCurrentRoundRecord,
    myOpponentStanding,
    currentUser,
    onStartTournamentSovereignMatch,
    onStartTournamentPvpMatch,
  ]);

  // Listen for Human-vs-Human room handshake completion or 35s W.O. timeout
  useEffect(() => {
    if (!pvpHandshakeState || !snapshot.myEntry || !snapshot.myStanding) return;

    const amCanonicalHost =
      snapshot.myStanding.participantId < pvpHandshakeState.opponent.participantId;

    const unsub = subscribeMultiplayerBus((msg) => {
      if (msg.type !== 'ROOM_UPSERT' || msg.room.code !== pvpHandshakeState.roomCode) return;
      const launchPayload: ActiveTournamentMatchLaunch = {
        tournament: snapshot.definition,
        roundNumber: pvpHandshakeState.round,
        roundPlayDeadlineMs: snapshot.roundPlayDeadlineMs,
        entry: snapshot.myEntry!,
        opponentStanding: pvpHandshakeState.opponent,
      };

      if (amCanonicalHost && msg.room.status === 'playing' && msg.room.guest) {
        setPvpHandshakeState(null);
        playSfx('ascend');
        onStartTournamentPvpMatch(launchPayload, msg.room, 'host');
      } else if (!amCanonicalHost && msg.room.status === 'waiting') {
        const hostCards = resolveDeckCardsForPvp(msg.room.host.cardIds);
        const guestCards = resolveDeckCardsForPvp(snapshot.myEntry!.deckCardIds);
        const canonicalState = createInitialGameState(hostCards, guestCards, {
          playerName: msg.room.host.username,
          aiName: currentUser.username,
          aiTitle: `${getAvatarHonorificTitle(currentUser.avatarCardId)} (${currentUser.eloRating} ELO)`,
          aiAvatarCardId: currentUser.avatarCardId,
        });
        canonicalState.player.title = `${getAvatarHonorificTitle(msg.room.host.avatarCardId)} (${msg.room.host.eloRating} ELO)`;
        canonicalState.player.avatarCardId = msg.room.host.avatarCardId;

        const joinedRoom: MultiplayerRoom = {
          ...msg.room,
          status: 'playing',
          guest: {
            id: currentUser.id,
            username: currentUser.username,
            title: getAvatarHonorificTitle(currentUser.avatarCardId),
            avatarCardId: currentUser.avatarCardId,
            eloRating: currentUser.eloRating,
            deckId: snapshot.myEntry!.deckId,
            cardIds: snapshot.myEntry!.deckCardIds,
          },
          canonicalState,
          stateVersion: msg.room.stateVersion + 1,
          lastActorId: currentUser.id,
        };
        publishMpMessage({ type: 'ROOM_UPSERT', room: joinedRoom });
        setPvpHandshakeState(null);
        playSfx('ascend');
        onStartTournamentPvpMatch(launchPayload, joinedRoom, 'guest');
      }
    });

    const timer = window.setInterval(() => {
      const elapsedSec = Math.floor((Date.now() - pvpHandshakeState.startedWaitAtMs) / 1000);
      const rem = Math.max(0, 35 - elapsedSec);
      setPvpHandshakeState((prev) => (prev ? { ...prev, secondsLeft: rem } : null));
      if (rem <= 0 && snapshot.myEntry) {
        window.clearInterval(timer);
        publishMpMessage({ type: 'ROOM_REMOVE', roomCode: pvpHandshakeState.roomCode });
        const woEntry: HumanTournamentEntry = {
          ...snapshot.myEntry,
          lastHeartbeatAtMs: getTournamentNowMs(),
          resultsByRound: {
            ...(snapshot.myEntry.resultsByRound ?? {}),
            [pvpHandshakeState.round]: {
              round: pvpHandshakeState.round,
              opponentId: pvpHandshakeState.opponent.participantId,
              opponentName: pvpHandshakeState.opponent.displayName,
              opponentKind: 'human',
              score: 1,
              hpDiff: 15,
              turns: 0,
              finishedAtMs: getTournamentNowMs(),
              reason: 'Vitória por W.O. (oponente ausente na mesa no início da rodada).',
            },
          },
        };
        setPvpHandshakeState(null);
        void upsertHumanTournamentEntryToCloud(woEntry).then(() => refreshCloudState());
        setStatusFeedback(
          `Vitória por W.O. (+1,0 pt) registrada na Rodada ${pvpHandshakeState.round}: ${pvpHandshakeState.opponent.displayName} não compareceu à mesa.`
        );
      }
    }, 1000);

    return () => {
      unsub();
      window.clearInterval(timer);
    };
  }, [
    pvpHandshakeState,
    snapshot.definition,
    snapshot.myEntry,
    snapshot.myStanding,
    snapshot.roundPlayDeadlineMs,
    currentUser,
    onStartTournamentPvpMatch,
    refreshCloudState,
  ]);

  // Automatic Round Launch when enrolled + autoStartRounds enabled + round is active
  useEffect(() => {
    if (
      !autoStartRounds ||
      snapshot.phase !== 'round_active' ||
      !snapshot.myEntry ||
      !snapshot.myCurrentPairing ||
      myCurrentRoundRecord ||
      pvpHandshakeState
    ) {
      return;
    }
    const autoKey = `${snapshot.definition.id}::r${snapshot.currentRound}`;
    if (lastAutoLaunchedKeyRef.current === autoKey) return;

    const delayTimer = window.setTimeout(() => {
      lastAutoLaunchedKeyRef.current = autoKey;
      void handleEnterRoundMatch();
    }, 1800);

    return () => window.clearTimeout(delayTimer);
  }, [
    autoStartRounds,
    snapshot.phase,
    snapshot.definition.id,
    snapshot.currentRound,
    snapshot.myEntry,
    snapshot.myCurrentPairing,
    myCurrentRoundRecord,
    pvpHandshakeState,
    handleEnterRoundMatch,
  ]);

  // Filtered & paginated standings
  const filteredStandings = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return snapshot.standings;
    return snapshot.standings.filter(
      (s) =>
        s.displayName.toLowerCase().includes(q) ||
        s.subtitle.toLowerCase().includes(q) ||
        (s.kind === 'human' && 'jogador humano'.includes(q))
    );
  }, [snapshot.standings, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredStandings.length / PAGE_SIZE));
  const clampedPage = Math.min(page, totalPages);
  const visibleStandings = useMemo(() => {
    const start = (clampedPage - 1) * PAGE_SIZE;
    return filteredStandings.slice(start, start + PAGE_SIZE);
  }, [filteredStandings, clampedPage]);

  const jumpToMyPosition = () => {
    if (!snapshot.myStanding) return;
    setSearchQuery('');
    setActiveSubView('standings');
    const targetPage = Math.ceil(snapshot.myStanding.rank / PAGE_SIZE);
    setPage(Math.max(1, targetPage));
  };

  const handleAdminPublishTournament = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdminProfile(currentUser)) return;
    const startMs = Date.parse(admStartLocal);
    if (Number.isNaN(startMs)) {
      setStatusFeedback('Data/hora de início inválida.');
      return;
    }
    const tc = TOURNAMENT_TIME_CONTROLS[admTimeControl];
    const roundMinutes = tc.recommendedRoundMinutes;
    const roundDurationMs = roundMinutes * 60 * 1000;
    const playWindowMs = Math.max(60_000, roundDurationMs - 30_000);
    const totalRounds = Math.max(3, Math.min(11, admRounds));
    const endMs = startMs + totalRounds * roundDurationMs;

    const prizeLabelMap: Record<TournamentPrizeKind, { label: string; desc: string }> = {
      unowned_domain_rare_card: {
        label: '1 Carta Rara Inédita (Cor do Grimório)',
        desc: 'Sorteada automaticamente entre as Raras da cor predominante do Grimório do melhor jogador humano que ele ainda não possua.',
      },
      unowned_domain_legendary_card: {
        label: '1 Carta Lendária Inédita (Cor do Grimório)',
        desc: 'Sorteada entre as Lendárias da cor predominante do Grimório do melhor jogador humano.',
      },
      gold_and_shards: {
        label: '300 Ouro + 150 Estilhaços Astrais',
        desc: 'Creditados diretamente na conta do jogador humano melhor qualificado.',
      },
      cash_brl_pix: {
        label: `Premiação Oficial R$ ${admCashBrl},00 (PIX) + Carta Rara`,
        desc: `R$ ${admCashBrl},00 via PIX mediante verificação de conta do melhor jogador humano + 1 Carta Rara inédita da cor do Grimório.`,
      },
    };

    const pMeta = prizeLabelMap[admPrizeKind];
    const newDef: SwissTournamentDefinition = {
      id: `swiss_${startMs}_${Math.random().toString(36).slice(2, 6)}`,
      title: admTitle.trim() || 'Copa Suíça de Vaeloria',
      subtitle: `Sistema Suíço · ${totalRounds} Rodadas · ${tc.label}`,
      startsAtMs: startMs,
      endsAtMs: endMs,
      totalRounds,
      roundDurationMs,
      playWindowMs,
      timeControlId: admTimeControl,
      turnTimeLimitSec: tc.turnSeconds,
      mulliganTimeLimitSec: tc.mulliganSeconds,
      includeAllSovereigns: true,
      prizeSpec: {
        kind: admPrizeKind,
        label: pMeta.label,
        description: pMeta.desc,
        goldBonus: admPrizeKind === 'gold_and_shards' ? 300 : 50,
        shardsBonus: admPrizeKind === 'gold_and_shards' ? 150 : 0,
        cashBrl: admPrizeKind === 'cash_brl_pix' ? admCashBrl : undefined,
      },
      createdBy: currentUser.username,
      createdAtMs: getTournamentNowMs(),
      finalizedAward: null,
    };

    const ok = await publishTournamentDefinitionToCloud(newDef);
    if (ok) {
      await refreshCloudState();
      setStatusFeedback(`Torneio "${newDef.title}" agendado e publicado com sucesso.`);
    }
  };

  // Status Header Badge Computation
  const phaseSummary = useMemo(() => {
    if (snapshot.phase === 'registration') {
      const rem = snapshot.definition.startsAtMs - nowMs;
      return {
        tone: 'upcoming' as const,
        label: `Inscrições Abertas · Início em ${formatClockCountdown(rem)}`,
        sub: `${formatBrtHourMinute(snapshot.definition.startsAtMs)} às ${formatBrtHourMinute(
          snapshot.definition.endsAtMs
        )} (BRT)`,
      };
    }
    if (snapshot.phase === 'round_active') {
      const rem = snapshot.roundPlayDeadlineMs - nowMs;
      return {
        tone: 'live' as const,
        label: `Rodada ${snapshot.currentRound}/${snapshot.definition.totalRounds} em andamento · ${formatClockCountdown(
          rem
        )}`,
        sub: `${snapshot.definition.turnTimeLimitSec}s por turno · Casamento Suíço automático`,
      };
    }
    if (snapshot.phase === 'round_break') {
      const rem = snapshot.roundEndsAtMs - nowMs;
      const nextR = Math.min(snapshot.definition.totalRounds, snapshot.currentRound + 1);
      return {
        tone: 'break' as const,
        label: `Emparceirando Rodada ${nextR}/${snapshot.definition.totalRounds} em ${formatClockCountdown(
          rem
        )}`,
        sub: 'Calculando chaves por pontuação e Buchholz',
      };
    }
    return {
      tone: 'finished' as const,
      label: `Torneio Encerrado · ${snapshot.definition.totalRounds}/${snapshot.definition.totalRounds} Rodadas`,
      sub: `Classificação homologada às ${formatBrtHourMinute(snapshot.definition.endsAtMs)}`,
    };
  }, [snapshot, nowMs]);

  const awardedPrizeCard = snapshot.finalizedAward?.cardId
    ? CARDS_BY_ID[snapshot.finalizedAward.cardId] ?? null
    : null;

  const generalChampion = snapshot.standings[0] ?? null;

  return (
    <div className="aaa-page-shell tournaments-shell">
      {/* 1. COMPACT SOBER HEADER BAR */}
      <header className="trn-header-bar">
        <div className="trn-header-titles">
          <div className="trn-title-row">
            <h1 className="font-cinzel trn-main-title">{snapshot.definition.title}</h1>
            <span className={`trn-status-pill trn-status-${phaseSummary.tone}`}>
              {phaseSummary.label}
            </span>
          </div>
          <p className="trn-subtitle">
            {phaseSummary.sub} · {snapshot.totalParticipantsCount} participantes (
            {snapshot.humanEntrantsCount}{' '}
            {snapshot.humanEntrantsCount === 1 ? 'jogador inscrito' : 'jogadores inscritos'}) ·
            Prêmio: <strong>{snapshot.definition.prizeSpec.label}</strong>
          </p>
        </div>

        <div className="trn-header-actions">
          {snapshot.myStanding && (
            <button
              type="button"
              className="aaa-btn aaa-btn-secondary trn-compact-btn"
              onClick={jumpToMyPosition}
            >
              Minha Posição (#{snapshot.myStanding.rank} · {formatPoints(snapshot.myStanding.points)} pt)
            </button>
          )}
          <button
            type="button"
            className="aaa-btn aaa-btn-secondary trn-compact-btn"
            onClick={() => setShowRulesModal(true)}
          >
            Formato &amp; Premiação
          </button>
        </div>
      </header>

      {statusFeedback && (
        <div className="trn-feedback-strip">
          <span>{statusFeedback}</span>
          <button
            type="button"
            className="trn-dismiss-link"
            onClick={() => setStatusFeedback(null)}
          >
            Fechar
          </button>
        </div>
      )}

      {/* 2. ENROLLMENT OR ACTIVE ROUND PAIRING STRIP (1 FOCUSED CONTEXT BLOCK) */}
      {snapshot.phase !== 'finished' && (
        <section className="trn-action-strip">
          {!snapshot.myEntry ? (
            <div className="trn-enroll-row">
              <div className="trn-enroll-info">
                <div className="trn-strip-title">
                  {snapshot.phase === 'registration'
                    ? 'Inscrição Gratuita Aberta a Todos'
                    : `Inscrição Tardia Aberta (Entrada imediata na Rodada ${snapshot.currentRound})`}
                </div>
                <div className="trn-strip-desc">
                  Escolha seu Grimório de 100 cartas. O melhor jogador humano recebe 1 Carta Rara
                  inédita da cor predominante do Grimório inscrito.
                </div>
              </div>

              <div className="trn-enroll-controls">
                {!isGuest && customDecks.length > 0 && (
                  <select
                    className="trn-deck-select"
                    value={selectedDeckObj?.id ?? ''}
                    onChange={(e) => setSelectedDeckId(e.target.value)}
                    aria-label="Selecionar Grimório para o Torneio"
                  >
                    {customDecks.map((d) => {
                      const dom = inferDeckPrimaryDomain(d.cardIds);
                      return (
                        <option key={d.id} value={d.id}>
                          {d.name} ({DOMAIN_META[dom]?.name ?? dom})
                        </option>
                      );
                    })}
                  </select>
                )}

                <button
                  type="button"
                  className="aaa-btn aaa-btn-primary trn-primary-cta"
                  disabled={isEnrolling}
                  onClick={() => void handleEnroll()}
                >
                  {isGuest
                    ? 'Entrar na Conta para Competir'
                    : customDecks.length === 0
                    ? 'Montar Grimório para Competir'
                    : isEnrolling
                    ? 'Inscrevendo...'
                    : 'Inscrever Grimório'}
                </button>
              </div>
            </div>
          ) : (
            <div className="trn-my-table-row">
              <div className="trn-my-table-left">
                <div className="trn-strip-title">
                  {snapshot.phase === 'registration' ? (
                    <>
                      Grimório inscrito: <strong>{snapshot.myEntry.deckName}</strong> (
                      {DOMAIN_LABELS_PT[snapshot.myEntry.primaryDomain]})
                    </>
                  ) : myOpponentStanding ? (
                    <>
                      Rodada {snapshot.currentRound}/{snapshot.definition.totalRounds} · Mesa #
                      {snapshot.myCurrentPairing?.tableNumber ?? 1}:{' '}
                      <strong>{currentUser.username}</strong> vs{' '}
                      <strong>{myOpponentStanding.displayName}</strong> ({myOpponentStanding.eloRating}{' '}
                      ELO)
                    </>
                  ) : (
                    <>Rodada {snapshot.currentRound}: Bye Suíço (+1,0 ponto automático)</>
                  )}
                </div>
                <div className="trn-strip-desc">
                  {snapshot.phase === 'registration'
                    ? `A 1ª rodada inicia automaticamente às ${formatBrtHourMinute(
                        snapshot.definition.startsAtMs
                      )}. Mantenha esta tela aberta para entrar na mesa.`
                    : myCurrentRoundRecord
                    ? `Partida concluída (${
                        myCurrentRoundRecord.score === 1
                          ? 'Vitória +1,0 pt'
                          : myCurrentRoundRecord.score === 0.5
                          ? 'Empate +0,5 pt'
                          : 'Derrota 0,0 pt'
                      }). Próxima rodada em ${formatClockCountdown(
                        snapshot.roundEndsAtMs - nowMs
                      )}.`
                    : pvpHandshakeState
                    ? `Conectando à mesa com ${pvpHandshakeState.opponent.displayName}... W.O. automático a seu favor em ${pvpHandshakeState.secondsLeft}s caso ausente.`
                    : snapshot.phase === 'round_break'
                    ? `Intervalo entre rodadas. Nova mesa em ${formatClockCountdown(
                        snapshot.roundEndsAtMs - nowMs
                      )}.`
                    : `Janela da rodada encerra em ${formatClockCountdown(
                        snapshot.roundPlayDeadlineMs - nowMs
                      )} (${snapshot.definition.turnTimeLimitSec}s por turno).`}
                </div>
              </div>

              <div className="trn-my-table-right">
                <label className="trn-autostart-toggle">
                  <input
                    type="checkbox"
                    checked={autoStartRounds}
                    onChange={(e) => handleToggleAutoStart(e.target.checked)}
                  />
                  <span>Auto-iniciar rodadas</span>
                </label>

                {snapshot.phase === 'registration' && customDecks.length > 1 && (
                  <button
                    type="button"
                    className="aaa-btn aaa-btn-secondary trn-compact-btn"
                    onClick={() => void handleEnroll()}
                  >
                    Atualizar Grimório
                  </button>
                )}

                {snapshot.phase === 'round_active' &&
                  myOpponentStanding &&
                  !myCurrentRoundRecord &&
                  !pvpHandshakeState && (
                    <button
                      type="button"
                      className="aaa-btn aaa-btn-primary trn-primary-cta"
                      onClick={() => void handleEnterRoundMatch()}
                    >
                      Entrar na Mesa · R{snapshot.currentRound}
                    </button>
                  )}
              </div>
            </div>
          )}
        </section>
      )}

      {/* 3. TOURNAMENT FINISHED SUMMARY & AUTOMATIC RARE CARD PRIZE BANNER */}
      {snapshot.phase === 'finished' && (
        <section className="trn-finished-banner">
          <div className="trn-finished-col">
            <div className="trn-kicker">Resultado Oficial Homologado</div>
            <div className="trn-finished-headline">
              {generalChampion ? (
                <>
                  Campeão Geral: <strong>{generalChampion.displayName}</strong> (
                  {formatPoints(generalChampion.points)} pts · Buchholz{' '}
                  {formatPoints(generalChampion.buchholz)})
                </>
              ) : (
                'Torneio Concluído'
              )}
            </div>
            {snapshot.finalizedAward ? (
              <div className="trn-strip-desc">
                Melhor Jogador Humano: <strong>{snapshot.finalizedAward.winnerUsername}</strong> (#
                {snapshot.finalizedAward.winnerGlobalRank} geral ·{' '}
                {formatPoints(snapshot.finalizedAward.winnerPoints)} pts ·{' '}
                {DOMAIN_LABELS_PT[snapshot.finalizedAward.primaryDomain]})
              </div>
            ) : (
              <div className="trn-strip-desc">
                Nenhum jogador humano concluiu partidas nesta edição.
              </div>
            )}
          </div>

          {snapshot.finalizedAward && awardedPrizeCard && (
            <button
              type="button"
              className="trn-prize-card-chip"
              onClick={() => onInspectCard(awardedPrizeCard)}
              title="Inspecionar Carta Rara Premiada"
            >
              {awardedPrizeCard.imagePath && (
                <img
                  src={`${awardedPrizeCard.imagePath}?v=12`}
                  alt={awardedPrizeCard.name}
                  className="trn-prize-card-thumb"
                />
              )}
              <div className="trn-prize-card-meta">
                <span className="trn-kicker">Carta Rara Sorteada &amp; Entregue</span>
                <strong className="trn-prize-card-name">{awardedPrizeCard.name}</strong>
                <span className="trn-prize-card-sub">
                  Creditada na coleção de {snapshot.finalizedAward.winnerUsername}
                </span>
              </div>
            </button>
          )}
        </section>
      )}

      {/* 4. SUB-NAVIGATION + SEARCH BAR */}
      <div className="trn-toolbar">
        <div className="trn-subtabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeSubView === 'standings'}
            className={`trn-subtab ${activeSubView === 'standings' ? 'active' : ''}`}
            onClick={() => setActiveSubView('standings')}
          >
            Classificação Geral ({snapshot.totalParticipantsCount})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeSubView === 'pairings'}
            className={`trn-subtab ${activeSubView === 'pairings' ? 'active' : ''}`}
            onClick={() => setActiveSubView('pairings')}
          >
            {snapshot.currentRound > 0
              ? `Mesas da Rodada ${snapshot.currentRound} (${snapshot.currentRoundPairings.length})`
              : 'Mesas da Rodada (Aguardando 17:00)'}
          </button>
        </div>

        {activeSubView === 'standings' && (
          <input
            type="search"
            className="trn-search-input"
            placeholder="Filtrar participante ou reino..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
          />
        )}
      </div>

      {/* 5. UNIFIED SWISS STANDINGS TABLE (ZERO SEPARATE PODIUM CARDS ABOVE!) */}
      {activeSubView === 'standings' ? (
        <div className="trn-table-wrap">
          <table className="trn-table">
            <thead>
              <tr>
                <th style={{ width: '56px' }}>#</th>
                <th>Participante</th>
                <th style={{ textAlign: 'right' }}>Pts</th>
                <th style={{ textAlign: 'right' }}>Buchholz</th>
                <th style={{ textAlign: 'center' }}>V-E-D</th>
                <th style={{ textAlign: 'right' }}>Saldo PV</th>
                <th style={{ textAlign: 'right' }}>ELO</th>
              </tr>
            </thead>
            <tbody>
              {visibleStandings.map((row) => {
                const isMe =
                  !isGuest &&
                  row.kind === 'human' &&
                  row.displayName.toLowerCase() === currentUser.username.toLowerCase();
                const avatarCard = CARDS_BY_ID[row.avatarCardId];
                const hpSign = row.hpDiff > 0 ? `+${row.hpDiff}` : `${row.hpDiff}`;
                return (
                  <tr
                    key={row.participantId}
                    className={isMe ? 'trn-row-me' : row.kind === 'human' ? 'trn-row-human' : ''}
                  >
                    <td className="trn-rank-cell">{row.rank}</td>
                    <td>
                      <div className="trn-player-cell">
                        {avatarCard?.imagePath ? (
                          <img
                            src={`${avatarCard.imagePath}?v=12`}
                            alt={row.displayName}
                            loading="lazy"
                            className="trn-avatar"
                          />
                        ) : (
                          <div className="trn-avatar trn-avatar-fallback" />
                        )}
                        <div className="trn-player-text">
                          <div className="trn-player-name-line">
                            <span className="trn-player-name">{row.displayName}</span>
                            {row.kind === 'human' && (
                              <span className="trn-human-tag">Jogador</span>
                            )}
                          </div>
                          <div className="trn-player-sub">{row.subtitle}</div>
                        </div>
                      </div>
                    </td>
                    <td className="trn-num-strong">{formatPoints(row.points)}</td>
                    <td className="trn-num-muted">{formatPoints(row.buchholz)}</td>
                    <td className="trn-ved-cell">
                      {row.wins}-{row.draws}-{row.losses}
                    </td>
                    <td className="trn-num-muted">{hpSign}</td>
                    <td className="trn-num-muted">{row.eloRating}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="trn-pagination">
              <button
                type="button"
                className="aaa-btn aaa-btn-secondary trn-compact-btn"
                disabled={clampedPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Anterior
              </button>
              <span className="trn-page-indicator">
                Página {clampedPage} de {totalPages}
              </span>
              <button
                type="button"
                className="aaa-btn aaa-btn-secondary trn-compact-btn"
                disabled={clampedPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Próxima
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="trn-table-wrap">
          {snapshot.currentRound === 0 ? (
            <div className="trn-empty-pairings">
              O emparceiramento da 1ª Rodada será publicado automaticamente às{' '}
              <strong>{formatBrtHourMinute(snapshot.definition.startsAtMs)}</strong> com todos os
              Jogadores inscritos e os 276 Soberanos de Vaeloria.
            </div>
          ) : (
            <table className="trn-table">
              <thead>
                <tr>
                  <th style={{ width: '68px' }}>Mesa</th>
                  <th>Lado A</th>
                  <th style={{ width: '130px', textAlign: 'center' }}>Resultado</th>
                  <th>Lado B</th>
                </tr>
              </thead>
              <tbody>
                {snapshot.currentRoundPairings.slice(0, 80).map((pair: ComputedRoundPairing) => {
                  const resLabel =
                    pair.result === 'A_WIN'
                      ? '1 – 0'
                      : pair.result === 'B_WIN'
                      ? '0 – 1'
                      : pair.result === 'DRAW'
                      ? '½ – ½'
                      : pair.result === 'BYE'
                      ? '1 – Bye'
                      : 'Em jogo';
                  return (
                    <tr
                      key={`tb_${pair.round}_${pair.tableNumber}`}
                      className={pair.isHumanTable ? 'trn-row-human' : ''}
                    >
                      <td className="trn-rank-cell">#{pair.tableNumber}</td>
                      <td>
                        <div className="trn-pair-side">
                          <span className="trn-player-name">{pair.playerA.displayName}</span>
                          <span className="trn-pair-pts">
                            ({formatPoints(pair.playerA.points)} pt · {pair.playerA.eloRating})
                          </span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span
                          className={`trn-score-badge ${
                            pair.result === 'IN_PROGRESS' ? 'live' : ''
                          }`}
                        >
                          {resLabel}
                        </span>
                      </td>
                      <td>
                        {pair.playerB ? (
                          <div className="trn-pair-side">
                            <span className="trn-player-name">{pair.playerB.displayName}</span>
                            <span className="trn-pair-pts">
                              ({formatPoints(pair.playerB.points)} pt · {pair.playerB.eloRating})
                            </span>
                          </div>
                        ) : (
                          <span className="trn-player-sub">Bye Suíço</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* 6. PROGRESSIVE DISCLOSURE FOR ADMIN SCHEDULING (ONLY VISIBLE TO ADMIN) */}
      {isAdminProfile(currentUser) && (
        <details className="trn-admin-details">
          <summary className="trn-admin-summary">
            Administração de Torneios · Agendar Nova Copa Suíça (Cartas ou R$ / PIX)
          </summary>
          <form className="trn-admin-form" onSubmit={(e) => void handleAdminPublishTournament(e)}>
            <label className="trn-field">
              <span>Título do Torneio</span>
              <input
                type="text"
                value={admTitle}
                onChange={(e) => setAdmTitle(e.target.value)}
                required
              />
            </label>
            <label className="trn-field">
              <span>Início (Horário Local)</span>
              <input
                type="datetime-local"
                value={admStartLocal}
                onChange={(e) => setAdmStartLocal(e.target.value)}
                required
              />
            </label>
            <label className="trn-field">
              <span>Cadência por Turno</span>
              <select
                value={admTimeControl}
                onChange={(e) => setAdmTimeControl(e.target.value as TournamentTimeControlId)}
              >
                {Object.values(TOURNAMENT_TIME_CONTROLS).map((tc) => (
                  <option key={tc.id} value={tc.id}>
                    {tc.label} ({tc.recommendedRoundMinutes} min/rodada)
                  </option>
                ))}
              </select>
            </label>
            <label className="trn-field">
              <span>Rodadas Fixas</span>
              <input
                type="number"
                min={3}
                max={11}
                value={admRounds}
                onChange={(e) => setAdmRounds(Number(e.target.value))}
              />
            </label>
            <label className="trn-field">
              <span>Premiação Principal</span>
              <select
                value={admPrizeKind}
                onChange={(e) => setAdmPrizeKind(e.target.value as TournamentPrizeKind)}
              >
                <option value="unowned_domain_rare_card">
                  Carta Rara Inédita (Cor do Grimório)
                </option>
                <option value="unowned_domain_legendary_card">
                  Carta Lendária Inédita (Cor do Grimório)
                </option>
                <option value="gold_and_shards">300 Ouro + 150 Estilhaços</option>
                <option value="cash_brl_pix">Premiação em R$ (PIX) + Carta Rara</option>
              </select>
            </label>
            {admPrizeKind === 'cash_brl_pix' && (
              <label className="trn-field">
                <span>Valor em R$ (PIX)</span>
                <input
                  type="number"
                  min={10}
                  step={10}
                  value={admCashBrl}
                  onChange={(e) => setAdmCashBrl(Number(e.target.value))}
                />
              </label>
            )}
            <div className="trn-admin-submit">
              <button type="submit" className="aaa-btn aaa-btn-primary trn-compact-btn">
                Publicar Torneio Oficial
              </button>
            </div>
          </form>
        </details>
      )}

      {/* 7. MODAL DE REVELAÇÃO PROGRESSIVA: BENCHMARK DE TEMPO, SISTEMA SUÍÇO & PREMIAÇÕES */}
      {showRulesModal && (
        <div
          className="aaa-modal-backdrop"
          onClick={() => setShowRulesModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="trn-rules-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="trn-rules-header">
              <h2 className="font-cinzel" style={{ margin: 0, fontSize: '1.08rem' }}>
                Regulamento Suíço, Cadência de Turno &amp; Premiações
              </h2>
              <button
                type="button"
                className="aaa-btn aaa-btn-secondary trn-compact-btn"
                onClick={() => setShowRulesModal(false)}
              >
                Fechar
              </button>
            </div>

            <div className="trn-rules-body">
              <section className="trn-rules-sec">
                <h3>1. Formato Suíço de Rodadas Fixas (Estilo Terça Soberana)</h3>
                <p>
                  Inspirado nos torneios clássicos de terça-feira com número fixo de rodadas, nenhum
                  participante é eliminado: todos jogam todas as <strong>{snapshot.definition.totalRounds} rodadas</strong>{' '}
                  em janelas sincronizadas de{' '}
                  <strong>{Math.round(snapshot.definition.roundDurationMs / 60000)} minutos</strong>.
                  A cada rodada, o sistema cruza participantes com a mesma pontuação (Vitória ={' '}
                  <code>1,0</code>, Empate = <code>0,5</code>, Derrota = <code>0,0</code>), sem
                  repetir confrontos.
                </p>
                <p>
                  <strong>Critérios de desempate oficiais:</strong> 1º Pontos → 2º Buchholz (soma
                  dos pontos dos adversários enfrentados) → 3º Saldo de PV → 4º Número de vitórias
                  → 5º ELO. Se o relógio da rodada zerar com duelo em curso, vence quem tiver maior
                  Vida atual (ou maior soma de Ataque + Vida em mesa).
                </p>
              </section>

              <section className="trn-rules-sec">
                <h3>2. Calibração Empírica de Limites de Tempo por Turno (40 PV vs 40 PV)</h3>
                <p>
                  Na <strong>Campanha, Expedição e modos solo de exploração</strong>, o relógio por
                  turno permanece <strong>desativado</strong> para leitura tranquila. O relógio vale
                  exclusivamente em Torneios, Conclave 1×1 e Duelos Ranqueados:
                </p>
                <table className="trn-table trn-bench-table">
                  <thead>
                    <tr>
                      <th>Cadência</th>
                      <th>Duração Média</th>
                      <th>Teto P95</th>
                      <th>Rodadas em 1h</th>
                      <th>Indicação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(TOURNAMENT_TIME_CONTROLS).map((tc) => (
                      <tr
                        key={tc.id}
                        className={
                          tc.id === snapshot.definition.timeControlId ? 'trn-row-me' : ''
                        }
                      >
                        <td>
                          <strong>{tc.label}</strong>
                        </td>
                        <td>{tc.avgMatchMinutes}</td>
                        <td>{tc.p95MatchMinutes}</td>
                        <td>{tc.recommendedRoundsIn1h} rodadas</td>
                        <td className="trn-player-sub">{tc.verdict}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              <section className="trn-rules-sec">
                <h3>3. Premiação em Cartas &amp; Governança para Premiação em R$ (PIX)</h3>
                <p>
                  <strong>Premiação desta edição:</strong> {snapshot.definition.prizeSpec.description}
                </p>
                <p>
                  <strong>Edições com premiação em R$ (PIX):</strong> inscrição gratuita promocional
                  ou circuito patrocinado (evitando exigência de taxa de aposta), Grimório travado
                  no ato da inscrição, validação de conta única e auditoria automática de turnos e
                  Buchholz antes da liquidação PIX ao campeão humano.
                </p>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
