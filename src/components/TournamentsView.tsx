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
  fetchTournamentCatalogFromCloud,
  getTournamentNowMs,
  getTournamentStageKey,
  HumanTournamentEntry,
  inferDeckPrimaryDomain,
  ParticipantRoundHistoryItem,
  publishTournamentDefinitionToCloud,
  SwissTournamentDefinition,
  TOURNAMENT_TIME_CONTROLS,
  TournamentCatalogData,
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

type TournamentDetailTab = 'podium' | 'standings' | 'pairings';

const DOMAIN_LABELS_PT: Record<Domain, string> = {
  red: 'Pyros (Chama)',
  green: 'Veridia (Selva)',
  blue: 'Vórtex (Tempestade)',
  purple: 'Eclipse (Abismo)',
  gold: 'Solária (Ordem)',
  neutral: 'Matriz Axial',
};

const ALL_DOMAINS_ORDER: Domain[] = ['red', 'blue', 'gold', 'purple', 'green', 'neutral'];

function formatClockCountdown(ms: number): string {
  const totalSec = Math.max(0, Math.ceil(ms / 1000));
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (d > 0) {
    return `${d}d ${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m`;
  }
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

function formatBrtDateLabel(epochMs: number): string {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'America/Sao_Paulo',
    }).format(new Date(epochMs));
  } catch {
    return new Date(epochMs).toLocaleDateString('pt-BR');
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

function formatRoundChipLabel(item: ParticipantRoundHistoryItem): {
  short: string;
  tone: 'win' | 'draw' | 'loss' | 'live';
  tooltip: string;
} {
  if (item.outcome === 'IN_PROGRESS') {
    return {
      short: `R${item.round}`,
      tone: 'live',
      tooltip: `Rodada ${item.round} · Mesa #${item.tableNumber}: em andamento contra ${item.opponentName}`,
    };
  }
  if (item.outcome === 'BYE') {
    return {
      short: 'B',
      tone: 'win',
      tooltip: `Rodada ${item.round}: Bye Suíço (+1,0 pt)`,
    };
  }
  const hpText = item.hpDiff > 0 ? `+${item.hpDiff} PV` : `${item.hpDiff} PV`;
  const turnsText = item.turns > 0 ? `, ${item.turns} turnos` : '';
  if (item.outcome === 'WIN') {
    return {
      short: 'V',
      tone: 'win',
      tooltip: `R${item.round} · Mesa #${item.tableNumber}: Vitória (+1,0) vs ${item.opponentName} (${hpText}${turnsText})`,
    };
  }
  if (item.outcome === 'DRAW') {
    return {
      short: 'E',
      tone: 'draw',
      tooltip: `R${item.round} · Mesa #${item.tableNumber}: Empate (+0,5) vs ${item.opponentName} (${hpText}${turnsText})`,
    };
  }
  return {
    short: 'D',
    tone: 'loss',
    tooltip: `R${item.round} · Mesa #${item.tableNumber}: Derrota (0,0) vs ${item.opponentName} (${hpText}${turnsText})`,
  };
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
  const [catalog, setCatalog] = useState<TournamentCatalogData>(() => ({
    tournaments: [DEFAULT_INAUGURAL_TOURNAMENT],
    entriesByTournament: { [DEFAULT_INAUGURAL_TOURNAMENT.id]: [] },
    primaryTournamentId: DEFAULT_INAUGURAL_TOURNAMENT.id,
  }));
  // Null = Tournament Hub (Página Inicial dos Torneios); non-null = Specific Tournament Detail
  const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>(null);

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

  // Detail View state
  const [detailTab, setDetailTab] = useState<TournamentDetailTab>('standings');
  const [selectedRoundTab, setSelectedRoundTab] = useState<number>(1);
  const [standingsSearch, setStandingsSearch] = useState<string>('');
  const [domainFilter, setDomainFilter] = useState<'all' | Domain>('all');
  const [standingsPage, setStandingsPage] = useState<number>(1);
  const [pairingsSearch, setPairingsSearch] = useState<string>('');
  const [pairingsPage, setPairingsPage] = useState<number>(1);

  // Modals (Progressive Disclosure)
  const [inspectedParticipantId, setInspectedParticipantId] = useState<string | null>(null);
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  // Deterministic table handshake state
  const [pvpHandshakeState, setPvpHandshakeState] = useState<{
    roomCode: string;
    round: number;
    opponent: ComputedTournamentStanding;
    startedWaitAtMs: number;
    secondsLeft: number;
  } | null>(null);

  // Admin schedule form state
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

  const refreshCloudCatalog = useCallback(async () => {
    const res = await fetchTournamentCatalogFromCloud();
    setCatalog(res);
    setNowMs(getTournamentNowMs());
  }, []);

  useEffect(() => {
    void refreshCloudCatalog();
    const cloudTimer = window.setInterval(() => {
      void refreshCloudCatalog();
    }, 6000);
    const clockTimer = window.setInterval(() => {
      setNowMs(getTournamentNowMs());
    }, 1000);
    return () => {
      window.clearInterval(cloudTimer);
      window.clearInterval(clockTimer);
    };
  }, [refreshCloudCatalog]);

  useEffect(() => {
    if (!inspectedParticipantId && !showRulesModal) return;
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        if (inspectedParticipantId) setInspectedParticipantId(null);
        else setShowRulesModal(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [inspectedParticipantId, showRulesModal]);

  // Discrete stage fingerprint across catalog so snapshots only recompute when rounds/entries change
  const catalogStageSignature = useMemo(
    () =>
      catalog.tournaments
        .map((t) => `${t.id}:${getTournamentStageKey(t, nowMs)}`)
        .join('|'),
    [catalog.tournaments, nowMs]
  );

  // Precomputed snapshots for all catalog tournaments (each takes ~1.2ms, memoized on stage boundaries)
  const snapshotsById = useMemo(() => {
    const map: Record<string, ComputedTournamentSnapshot> = {};
    const snapNow = getTournamentNowMs();
    for (const def of catalog.tournaments) {
      const entries = catalog.entriesByTournament[def.id] ?? [];
      map[def.id] = computeTournamentSnapshot(
        def,
        entries,
        isGuest ? null : currentUser.username,
        snapNow
      );
    }
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catalog, catalogStageSignature, isGuest, currentUser.username]);

  const openTournamentDetail = useCallback(
    (tournamentId: string, preferredTab?: TournamentDetailTab) => {
      const snap = snapshotsById[tournamentId];
      setSelectedTournamentId(tournamentId);
      setStandingsSearch('');
      setDomainFilter('all');
      setStandingsPage(1);
      setPairingsSearch('');
      setPairingsPage(1);
      setInspectedParticipantId(null);
      if (preferredTab) {
        setDetailTab(preferredTab);
      } else if (snap?.phase === 'finished') {
        setDetailTab('podium');
      } else {
        setDetailTab('standings');
      }
      setSelectedRoundTab(Math.max(1, snap?.currentRound || 1));
    },
    [snapshotsById]
  );

  const activeDefinition: SwissTournamentDefinition = useMemo(() => {
    if (selectedTournamentId) {
      const found = catalog.tournaments.find((t) => t.id === selectedTournamentId);
      if (found) return found;
    }
    return catalog.tournaments[0] ?? DEFAULT_INAUGURAL_TOURNAMENT;
  }, [catalog.tournaments, selectedTournamentId]);

  const snapshot: ComputedTournamentSnapshot = useMemo(
    () =>
      snapshotsById[activeDefinition.id] ??
      computeTournamentSnapshot(
        activeDefinition,
        catalog.entriesByTournament[activeDefinition.id] ?? [],
        isGuest ? null : currentUser.username,
        nowMs
      ),
    [snapshotsById, activeDefinition, catalog.entriesByTournament, isGuest, currentUser.username, nowMs]
  );

  // Keep selectedRoundTab valid when currentRound advances
  useEffect(() => {
    if (snapshot.currentRound > 0 && selectedRoundTab > snapshot.currentRound) {
      setSelectedRoundTab(snapshot.currentRound);
    }
  }, [snapshot.currentRound, selectedRoundTab]);

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
      setCatalog((prev) => {
        const prevList = prev.entriesByTournament[snapshot.definition.id] ?? [];
        const clean = entry.username.trim().toLowerCase();
        return {
          ...prev,
          entriesByTournament: {
            ...prev.entriesByTournament,
            [snapshot.definition.id]: [
              ...prevList.filter((e) => e.username.trim().toLowerCase() !== clean),
              entry,
            ],
          },
        };
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

  // Listen for deterministic table handshake completion or 35s W.O. timeout
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
        void upsertHumanTournamentEntryToCloud(woEntry).then(() => refreshCloudCatalog());
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
    refreshCloudCatalog,
  ]);

  // Automatic Round Launch when inside an active tournament + enrolled + autoStartRounds enabled
  useEffect(() => {
    if (
      !selectedTournamentId ||
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
    selectedTournamentId,
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

  // Standings filtering & pagination
  const filteredStandings = useMemo(() => {
    const q = standingsSearch.trim().toLowerCase();
    return snapshot.standings.filter((s) => {
      if (domainFilter !== 'all' && s.primaryDomain !== domainFilter) return false;
      if (!q) return true;
      return (
        s.displayName.toLowerCase().includes(q) ||
        s.subtitle.toLowerCase().includes(q)
      );
    });
  }, [snapshot.standings, standingsSearch, domainFilter]);

  const totalStandingsPages = Math.max(1, Math.ceil(filteredStandings.length / PAGE_SIZE));
  const clampedStandingsPage = Math.min(standingsPage, totalStandingsPages);
  const visibleStandings = useMemo(() => {
    const start = (clampedStandingsPage - 1) * PAGE_SIZE;
    return filteredStandings.slice(start, start + PAGE_SIZE);
  }, [filteredStandings, clampedStandingsPage]);

  // Selected round pairings filtering & pagination
  const activeRoundPairingsList = useMemo(
    () => snapshot.roundsPairings[selectedRoundTab] ?? [],
    [snapshot.roundsPairings, selectedRoundTab]
  );

  const filteredPairings = useMemo(() => {
    const q = pairingsSearch.trim().toLowerCase();
    if (!q) return activeRoundPairingsList;
    return activeRoundPairingsList.filter((p) => {
      const tableMatch = `#${p.tableNumber}` === q || String(p.tableNumber) === q;
      const aMatch =
        p.playerA.displayName.toLowerCase().includes(q) ||
        p.playerA.subtitle.toLowerCase().includes(q);
      const bMatch = p.playerB
        ? p.playerB.displayName.toLowerCase().includes(q) ||
          p.playerB.subtitle.toLowerCase().includes(q)
        : false;
      return tableMatch || aMatch || bMatch;
    });
  }, [activeRoundPairingsList, pairingsSearch]);

  const totalPairingsPages = Math.max(1, Math.ceil(filteredPairings.length / PAGE_SIZE));
  const clampedPairingsPage = Math.min(pairingsPage, totalPairingsPages);
  const visiblePairings = useMemo(() => {
    const start = (clampedPairingsPage - 1) * PAGE_SIZE;
    return filteredPairings.slice(start, start + PAGE_SIZE);
  }, [filteredPairings, clampedPairingsPage]);

  // Edition Stats & Domain Best Performers for the Podium Tab
  const editionStats = useMemo(() => {
    let totalMatches = 0;
    let totalDraws = 0;
    for (const rKey of Object.keys(snapshot.roundsPairings)) {
      const list = snapshot.roundsPairings[Number(rKey)] ?? [];
      totalMatches += list.length;
      for (const p of list) {
        if (p.result === 'DRAW') totalDraws += 1;
      }
    }
    const undefeatedCount = snapshot.standings.filter(
      (s) => s.roundsPlayed > 0 && s.losses === 0 && s.draws === 0
    ).length;

    const topByDomain = ALL_DOMAINS_ORDER.map((dom) => ({
      domain: dom,
      leader: snapshot.standings.find((s) => s.primaryDomain === dom) ?? null,
    })).filter((x): x is { domain: Domain; leader: ComputedTournamentStanding } => Boolean(x.leader));

    return {
      totalMatches,
      totalDraws,
      undefeatedCount,
      topByDomain,
    };
  }, [snapshot.roundsPairings, snapshot.standings]);

  const inspectedStanding: ComputedTournamentStanding | null = useMemo(() => {
    if (!inspectedParticipantId) return null;
    return (
      snapshot.standings.find((s) => s.participantId === inspectedParticipantId) ?? null
    );
  }, [inspectedParticipantId, snapshot.standings]);

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
        desc: 'Sorteada automaticamente entre as Raras inéditas da cor predominante do Grimório do Campeão (+50 Ouro).',
      },
      unowned_domain_legendary_card: {
        label: '1 Carta Lendária Inédita (Cor do Grimório)',
        desc: 'Sorteada entre as Lendárias inéditas da cor predominante do Grimório do Campeão (+50 Ouro).',
      },
      gold_and_shards: {
        label: '300 Ouro + 150 Estilhaços Astrais',
        desc: 'Creditados diretamente na conta do Campeão ao término da última rodada.',
      },
      cash_brl_pix: {
        label: `Premiação Oficial R$ ${admCashBrl},00 (PIX) + Carta Rara`,
        desc: `R$ ${admCashBrl},00 via PIX mediante verificação de conta do Campeão + 1 Carta Rara inédita da cor do Grimório.`,
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
      await refreshCloudCatalog();
      setStatusFeedback(`Torneio "${newDef.title}" agendado e publicado com sucesso.`);
    }
  };

  // Hub lists: Live + Upcoming vs Finished
  const { liveAndUpcomingList, finishedList } = useMemo(() => {
    const liveOrNext: ComputedTournamentSnapshot[] = [];
    const done: ComputedTournamentSnapshot[] = [];
    for (const def of catalog.tournaments) {
      const snap = snapshotsById[def.id];
      if (!snap) continue;
      if (snap.phase === 'finished') done.push(snap);
      else liveOrNext.push(snap);
    }
    done.sort((a, b) => b.definition.startsAtMs - a.definition.startsAtMs);
    return { liveAndUpcomingList: liveOrNext, finishedList: done };
  }, [catalog.tournaments, snapshotsById]);

  // Status Header Badge Computation for Detail View
  const phaseSummary = useMemo(() => {
    if (snapshot.phase === 'registration') {
      const rem = snapshot.definition.startsAtMs - nowMs;
      return {
        tone: 'upcoming' as const,
        label: `Inscrições Abertas · Início em ${formatClockCountdown(rem)}`,
        sub: `${formatBrtDateLabel(snapshot.definition.startsAtMs)} · ${formatBrtHourMinute(
          snapshot.definition.startsAtMs
        )} às ${formatBrtHourMinute(snapshot.definition.endsAtMs)} (BRT)`,
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
        sub: 'Calculando mesas por pontuação e Buchholz',
      };
    }
    return {
      tone: 'finished' as const,
      label: `Encerrado · ${snapshot.definition.totalRounds}/${snapshot.definition.totalRounds} Rodadas`,
      sub: `${formatBrtDateLabel(snapshot.definition.startsAtMs)} · Homologado às ${formatBrtHourMinute(
        snapshot.definition.endsAtMs
      )}`,
    };
  }, [snapshot, nowMs]);

  const awardedPrizeCard = snapshot.finalizedAward?.cardId
    ? CARDS_BY_ID[snapshot.finalizedAward.cardId] ?? null
    : null;

  const podiumTop3 = useMemo(() => snapshot.standings.slice(0, 3), [snapshot.standings]);

  // Render Rules Modal (shared between Hub & Detail)
  const renderRulesModal = () => {
    if (!showRulesModal) return null;
    return (
      <div
        className="aaa-modal-backdrop"
        onClick={() => setShowRulesModal(false)}
        role="dialog"
        aria-modal="true"
      >
        <div className="trn-rules-modal" onClick={(e) => e.stopPropagation()}>
          <div className="trn-rules-header">
            <h2 className="font-cinzel" style={{ margin: 0, fontSize: '1.06rem' }}>
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
              <h3>1. Formato Suíço de Rodadas Fixas</h3>
              <p>
                Inspirado nos torneios clássicos semanais de rodadas fixas, nenhum competidor é
                eliminado: todos disputam todas as rodadas programadas em janelas sincronizadas. A
                cada rodada, o sistema emparceira competidores com a mesma pontuação (Vitória ={' '}
                <code>1,0</code>, Empate = <code>0,5</code>, Derrota = <code>0,0</code>), sem
                repetir confrontos.
              </p>
              <p>
                <strong>Critérios de desempate oficiais:</strong> 1º Pontos → 2º Buchholz (soma dos
                pontos finais de todos os adversários enfrentados) → 3º Saldo de PV → 4º Número de
                vitórias → 5º ELO. Se o relógio da rodada zerar com duelo em curso, prevalece maior
                Vida atual ou maior poder total em mesa (soma de Ataque + Vida das tropas vivas).
              </p>
            </section>

            <section className="trn-rules-sec">
              <h3>2. Calibração de Limites de Tempo por Turno (40 PV vs 40 PV)</h3>
              <p>
                Na <strong>Campanha, Expedição e modos solo</strong>, não há relógio por turno. A
                cronometragem aplica-se exclusivamente aos Torneios, Conclave 1×1 e Duelos
                Ranqueados:
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
                      className={tc.id === 'rapid_45s' ? 'trn-row-me' : ''}
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
              <h3>3. Premiações Oficiais (Cartas, Ouro &amp; R$ / PIX)</h3>
              <p>
                Ao término da última rodada, a súmula oficial é homologada automaticamente e a
                premiação da edição é creditada no inventário do Campeão (ou liquidada via PIX nas
                edições especiais patrocinadas, mediante Grimório travado na inscrição e auditoria
                automática das rodadas).
              </p>
            </section>
          </div>
        </div>
      </div>
    );
  };

  // Render Admin Progressive Disclosure
  const renderAdminPanel = () => {
    if (!isAdminProfile(currentUser)) return null;
    return (
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
    );
  };

  // ==========================================================================
  // VIEW A: TOURNAMENT HUB (PÁGINA INICIAL DOS TORNEIOS)
  // ==========================================================================
  if (!selectedTournamentId) {
    return (
      <div className="aaa-page-shell tournaments-shell">
        <header className="trn-header-bar">
          <div className="trn-header-titles">
            <div className="trn-title-row">
              <h1 className="font-cinzel trn-main-title">Salão de Torneios de Vaeloria</h1>
              <span className="trn-status-pill trn-status-upcoming">Circuito Suíço Oficial</span>
            </div>
            <p className="trn-subtitle">
              Edições regulares de rodadas fixas com pareamento Suíço automático, controle de tempo
              por turno e súmulas homologadas.
            </p>
          </div>

          <div className="trn-header-actions">
            <button
              type="button"
              className="aaa-btn aaa-btn-secondary trn-compact-btn"
              onClick={() => setShowRulesModal(true)}
            >
              Regulamento &amp; Cadências
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

        {/* 1. LIVE & UPCOMING SCHEDULED TOURNAMENTS */}
        <section className="trn-hub-section">
          <div className="trn-hub-section-head">
            <h2 className="font-cinzel trn-hub-section-title">
              Torneios Abertos &amp; Próximas Edições
            </h2>
            <span className="trn-hub-section-meta">
              Inscrição gratuita · Grimório de 100 cartas
            </span>
          </div>

          {liveAndUpcomingList.length === 0 ? (
            <div className="trn-empty-pairings">
              Nenhum torneio agendado no momento. Novas edições oficiais são abertas semanalmente.
            </div>
          ) : (
            <div className="trn-hub-cards-list">
              {liveAndUpcomingList.map((tSnap) => {
                const isLive = tSnap.phase === 'round_active' || tSnap.phase === 'round_break';
                const remMs = isLive
                  ? tSnap.roundEndsAtMs - nowMs
                  : tSnap.definition.startsAtMs - nowMs;
                const enrolled = Boolean(tSnap.myEntry);

                return (
                  <div
                    key={tSnap.definition.id}
                    className={`trn-hub-event-row ${isLive ? 'is-live' : ''}`}
                  >
                    <div className="trn-hub-event-main">
                      <div className="trn-title-row">
                        <span
                          className={`trn-status-pill ${
                            isLive ? 'trn-status-live' : 'trn-status-upcoming'
                          }`}
                        >
                          {isLive
                            ? `Ao Vivo · Rodada ${tSnap.currentRound}/${tSnap.definition.totalRounds}`
                            : `Inscrições Abertas · ${formatClockCountdown(remMs)}`}
                        </span>
                        {enrolled && <span className="trn-enrolled-pill">Inscrito</span>}
                        <strong className="trn-hub-event-title">{tSnap.definition.title}</strong>
                      </div>
                      <div className="trn-hub-event-sub">
                        {formatBrtDateLabel(tSnap.definition.startsAtMs)} ·{' '}
                        {formatBrtHourMinute(tSnap.definition.startsAtMs)} às{' '}
                        {formatBrtHourMinute(tSnap.definition.endsAtMs)} (BRT) ·{' '}
                        {tSnap.definition.totalRounds} Rodadas ·{' '}
                        {tSnap.definition.turnTimeLimitSec}s/turno ·{' '}
                        {tSnap.totalParticipantsCount} competidores · Prêmio:{' '}
                        <strong style={{ color: '#e2e8f0' }}>
                          {tSnap.definition.prizeSpec.label}
                        </strong>
                      </div>
                    </div>

                    <div className="trn-hub-event-cta">
                      <button
                        type="button"
                        className="aaa-btn aaa-btn-primary trn-compact-btn"
                        onClick={() => openTournamentDetail(tSnap.definition.id, 'standings')}
                      >
                        {isLive
                          ? 'Entrar no Torneio'
                          : enrolled
                          ? 'Ver Inscrição'
                          : 'Abrir & Inscrever-se'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* 2. COMPLETED TOURNAMENTS ARCHIVE (WITH TOP 3 SUMMARY & SÚMULA ACCESS) */}
        <section className="trn-hub-section">
          <div className="trn-hub-section-head">
            <h2 className="font-cinzel trn-hub-section-title">
              Torneios Encerrados — Galeria &amp; Súmulas Oficiais
            </h2>
            <span className="trn-hub-section-meta">
              Pódio, classificação completa, mesas por rodada e histórico individual
            </span>
          </div>

          {finishedList.length === 0 ? (
            <div className="trn-empty-pairings">Nenhuma edição encerrada registrada ainda.</div>
          ) : (
            <div className="trn-table-wrap">
              <table className="trn-table">
                <thead>
                  <tr>
                    <th>Edição &amp; Data</th>
                    <th style={{ textAlign: 'right' }}>Competidores</th>
                    <th>Pódio Oficial (1º · 2º · 3º)</th>
                    <th style={{ textAlign: 'right', width: '132px' }}>Súmula</th>
                  </tr>
                </thead>
                <tbody>
                  {finishedList.map((fSnap) => {
                    const first = fSnap.standings[0];
                    const second = fSnap.standings[1];
                    const third = fSnap.standings[2];
                    const champCard = first ? CARDS_BY_ID[first.avatarCardId] : undefined;

                    return (
                      <tr key={fSnap.definition.id} className="trn-clickable-row" onClick={() => openTournamentDetail(fSnap.definition.id, 'podium')}>
                        <td>
                          <div className="trn-player-text">
                            <span className="trn-player-name">{fSnap.definition.title}</span>
                            <span className="trn-player-sub">
                              {formatBrtDateLabel(fSnap.definition.startsAtMs)} ·{' '}
                              {formatBrtHourMinute(fSnap.definition.startsAtMs)}–
                              {formatBrtHourMinute(fSnap.definition.endsAtMs)} ·{' '}
                              {fSnap.definition.totalRounds} Rodadas (
                              {fSnap.definition.turnTimeLimitSec}s/turno)
                            </span>
                          </div>
                        </td>
                        <td className="trn-num-muted">{fSnap.totalParticipantsCount}</td>
                        <td>
                          {first ? (
                            <div className="trn-player-cell">
                              {champCard?.imagePath ? (
                                <img
                                  src={`${champCard.imagePath}?v=12`}
                                  alt={first.displayName}
                                  loading="lazy"
                                  className="trn-avatar trn-avatar-gold"
                                />
                              ) : (
                                <div className="trn-avatar" />
                              )}
                              <div className="trn-player-text">
                                <span className="trn-player-name">
                                  1º {first.displayName}{' '}
                                  <span style={{ color: '#f3e3b0', fontWeight: 700 }}>
                                    ({formatPoints(first.points)} pts)
                                  </span>
                                </span>
                                <span className="trn-player-sub">
                                  {second
                                    ? `2º ${second.displayName} (${formatPoints(second.points)})`
                                    : ''}
                                  {third
                                    ? ` · 3º ${third.displayName} (${formatPoints(third.points)})`
                                    : ''}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span className="trn-player-sub">—</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            className="aaa-btn aaa-btn-secondary trn-compact-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              openTournamentDetail(fSnap.definition.id, 'podium');
                            }}
                          >
                            Ver Súmula
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {renderAdminPanel()}
        {renderRulesModal()}
      </div>
    );
  }

  // ==========================================================================
  // VIEW B: SPECIFIC TOURNAMENT DETAIL PAGE (PÓDIO | CLASSIFICAÇÃO | RODADAS)
  // ==========================================================================
  return (
    <div className="aaa-page-shell tournaments-shell">
      {/* 1. TOURNAMENT HEADER BAR WITH BACK TO HUB */}
      <header className="trn-header-bar">
        <div className="trn-header-titles">
          <div className="trn-title-row">
            <button
              type="button"
              className="aaa-btn aaa-btn-secondary trn-compact-btn"
              onClick={() => setSelectedTournamentId(null)}
            >
              ← Todos os Torneios
            </button>
            <h1 className="font-cinzel trn-main-title">{snapshot.definition.title}</h1>
            <span className={`trn-status-pill trn-status-${phaseSummary.tone}`}>
              {phaseSummary.label}
            </span>
          </div>
          <p className="trn-subtitle">
            {phaseSummary.sub} · {snapshot.totalParticipantsCount} competidores ·{' '}
            {snapshot.definition.turnTimeLimitSec}s/turno · Prêmio:{' '}
            <strong>{snapshot.definition.prizeSpec.label}</strong>
          </p>
        </div>

        <div className="trn-header-actions">
          {snapshot.myStanding && (
            <button
              type="button"
              className="aaa-btn aaa-btn-secondary trn-compact-btn"
              onClick={() => setInspectedParticipantId(snapshot.myStanding!.participantId)}
            >
              Minha Campanha (#{snapshot.myStanding.rank} · {formatPoints(snapshot.myStanding.points)} pt)
            </button>
          )}
          <button
            type="button"
            className="aaa-btn aaa-btn-secondary trn-compact-btn"
            onClick={() => setShowRulesModal(true)}
          >
            Regulamento
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

      {/* 2. ENROLLMENT OR ACTIVE ROUND MATCH STRIP (WHEN NOT FINISHED) */}
      {snapshot.phase !== 'finished' && (
        <section className="trn-action-strip">
          {!snapshot.myEntry ? (
            <div className="trn-enroll-row">
              <div className="trn-enroll-info">
                <div className="trn-strip-title">
                  {snapshot.phase === 'registration'
                    ? 'Inscrição Gratuita Aberta'
                    : `Inscrição Tardia Aberta (Entrada na Rodada ${snapshot.currentRound})`}
                </div>
                <div className="trn-strip-desc">
                  Escolha seu Grimório de 100 cartas para disputar as{' '}
                  {snapshot.definition.totalRounds} rodadas Suíças. Premiação oficial:{' '}
                  {snapshot.definition.prizeSpec.label}.
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
                    Trocar Grimório
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

      {/* 3. SUB-NAVIGATION TABS + CONTEXTUAL FILTERS */}
      <div className="trn-toolbar">
        <div className="trn-subtabs" role="tablist">
          {snapshot.phase === 'finished' && (
            <button
              type="button"
              role="tab"
              aria-selected={detailTab === 'podium'}
              className={`trn-subtab ${detailTab === 'podium' ? 'active' : ''}`}
              onClick={() => setDetailTab('podium')}
            >
              Pódio Oficial
            </button>
          )}
          <button
            type="button"
            role="tab"
            aria-selected={detailTab === 'standings'}
            className={`trn-subtab ${detailTab === 'standings' ? 'active' : ''}`}
            onClick={() => setDetailTab('standings')}
          >
            Classificação Geral ({snapshot.totalParticipantsCount})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={detailTab === 'pairings'}
            className={`trn-subtab ${detailTab === 'pairings' ? 'active' : ''}`}
            onClick={() => {
              setDetailTab('pairings');
              if (snapshot.currentRound > 0 && selectedRoundTab < 1) {
                setSelectedRoundTab(snapshot.currentRound);
              }
            }}
          >
            {snapshot.currentRound > 0
              ? `Rodadas & Mesas (${snapshot.currentRound}/${snapshot.definition.totalRounds})`
              : 'Rodadas & Mesas'}
          </button>
        </div>

        {detailTab === 'standings' && (
          <div className="trn-filter-cluster">
            <select
              className="trn-domain-select"
              value={domainFilter}
              onChange={(e) => {
                setDomainFilter(e.target.value as 'all' | Domain);
                setStandingsPage(1);
              }}
              aria-label="Filtrar por domínio cromático"
            >
              <option value="all">Todos os Domínios</option>
              {ALL_DOMAINS_ORDER.map((dom) => (
                <option key={dom} value={dom}>
                  {DOMAIN_LABELS_PT[dom]}
                </option>
              ))}
            </select>
            <input
              type="search"
              className="trn-search-input"
              placeholder="Buscar competidor ou reino..."
              value={standingsSearch}
              onChange={(e) => {
                setStandingsSearch(e.target.value);
                setStandingsPage(1);
              }}
            />
          </div>
        )}

        {detailTab === 'pairings' && snapshot.currentRound > 0 && (
          <div className="trn-filter-cluster">
            <input
              type="search"
              className="trn-search-input"
              placeholder="Buscar competidor ou nº da mesa..."
              value={pairingsSearch}
              onChange={(e) => {
                setPairingsSearch(e.target.value);
                setPairingsPage(1);
              }}
            />
          </div>
        )}
      </div>

      {/* 4A. TAB: PÓDIO OFICIAL & SÚMULA DE HONRA (DEDICATED VIEW — NO REDUNDANT FULL TABLE BELOW) */}
      {detailTab === 'podium' && snapshot.phase === 'finished' && (
        <div className="trn-podium-stage">
          <div className="trn-podium-grid">
            {[podiumTop3[1], podiumTop3[0], podiumTop3[2]].map((medalist, visualIdx) => {
              if (!medalist) return null;
              const place = visualIdx === 1 ? 1 : visualIdx === 0 ? 2 : 3;
              const placeLabel =
                place === 1
                  ? '1º Lugar · Campeão Oficial'
                  : place === 2
                  ? '2º Lugar · Vice-Campeão'
                  : '3º Lugar · Pódio Oficial';
              const portrait = CARDS_BY_ID[medalist.avatarCardId];
              const hpSign = medalist.hpDiff > 0 ? `+${medalist.hpDiff}` : `${medalist.hpDiff}`;

              return (
                <article
                  key={medalist.participantId}
                  className={`trn-podium-card trn-podium-place-${place}`}
                >
                  <div className="trn-podium-place-kicker">{placeLabel}</div>

                  <div className="trn-podium-identity">
                    {portrait?.imagePath ? (
                      <img
                        src={`${portrait.imagePath}?v=12`}
                        alt={medalist.displayName}
                        className="trn-podium-portrait"
                      />
                    ) : (
                      <div className="trn-podium-portrait" />
                    )}
                    <div className="trn-podium-names">
                      <h3 className="font-cinzel trn-podium-name">{medalist.displayName}</h3>
                      <div className="trn-podium-sub">{medalist.subtitle}</div>
                    </div>
                  </div>

                  <div className="trn-podium-metrics">
                    <div className="trn-podium-metric">
                      <span className="trn-podium-metric-label">Pontos</span>
                      <strong className="trn-podium-metric-val gold">
                        {formatPoints(medalist.points)}
                      </strong>
                    </div>
                    <div className="trn-podium-metric">
                      <span className="trn-podium-metric-label">Buchholz</span>
                      <strong className="trn-podium-metric-val">
                        {formatPoints(medalist.buchholz)}
                      </strong>
                    </div>
                    <div className="trn-podium-metric">
                      <span className="trn-podium-metric-label">V-E-D</span>
                      <strong className="trn-podium-metric-val">
                        {medalist.wins}-{medalist.draws}-{medalist.losses}
                      </strong>
                    </div>
                    <div className="trn-podium-metric">
                      <span className="trn-podium-metric-label">Saldo PV</span>
                      <strong className="trn-podium-metric-val">{hpSign}</strong>
                    </div>
                  </div>

                  <div className="trn-round-chips-row">
                    {medalist.matchHistory.map((item) => {
                      const chip = formatRoundChipLabel(item);
                      return (
                        <span
                          key={`pod_r${item.round}`}
                          className={`trn-round-chip tone-${chip.tone}`}
                          title={chip.tooltip}
                        >
                          R{item.round}:{chip.short}
                        </span>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    className={
                      place === 1
                        ? 'aaa-btn aaa-btn-primary trn-compact-btn'
                        : 'aaa-btn aaa-btn-secondary trn-compact-btn'
                    }
                    onClick={() => setInspectedParticipantId(medalist.participantId)}
                  >
                    Ver as {medalist.matchHistory.length} Partidas
                  </button>
                </article>
              );
            })}
          </div>

          {snapshot.finalizedAward && awardedPrizeCard && (
            <div className="trn-finished-banner">
              <div className="trn-finished-col">
                <div className="trn-kicker">Premiação Oficial Homologada</div>
                <div className="trn-finished-headline">
                  Campeão: <strong>{snapshot.finalizedAward.winnerUsername}</strong> (
                  {formatPoints(snapshot.finalizedAward.winnerPoints)} pts ·{' '}
                  {DOMAIN_LABELS_PT[snapshot.finalizedAward.primaryDomain]})
                </div>
                <div className="trn-strip-desc">
                  Carta Rara inédita sorteada e creditada automaticamente no Grimório do Campeão.
                </div>
              </div>
              <button
                type="button"
                className="trn-prize-card-chip"
                onClick={() => onInspectCard(awardedPrizeCard)}
              >
                {awardedPrizeCard.imagePath && (
                  <img
                    src={`${awardedPrizeCard.imagePath}?v=12`}
                    alt={awardedPrizeCard.name}
                    className="trn-prize-card-thumb"
                  />
                )}
                <div className="trn-prize-card-meta">
                  <span className="trn-kicker">Carta Rara Entregue</span>
                  <strong className="trn-prize-card-name">{awardedPrizeCard.name}</strong>
                  <span className="trn-prize-card-sub">Clique para inspecionar a carta</span>
                </div>
              </button>
            </div>
          )}

          {/* EDITION METRICS & BEST BY CHROMATIC DOMAIN */}
          <div className="trn-edition-stats-bar">
            <div className="trn-stat-cell">
              <span className="trn-stat-label">Partidas Homologadas</span>
              <strong className="trn-stat-value">
                {editionStats.totalMatches} ({snapshot.definition.totalRounds} rodadas)
              </strong>
            </div>
            <div className="trn-stat-cell">
              <span className="trn-stat-label">Campanhas 100% Invictas</span>
              <strong className="trn-stat-value">{editionStats.undefeatedCount}</strong>
            </div>
            <div className="trn-stat-cell">
              <span className="trn-stat-label">Empates Técnicos (½–½)</span>
              <strong className="trn-stat-value">{editionStats.totalDraws}</strong>
            </div>
            <div className="trn-stat-cell">
              <span className="trn-stat-label">Cadência Oficial</span>
              <strong className="trn-stat-value">
                {snapshot.definition.turnTimeLimitSec}s / turno
              </strong>
            </div>
          </div>

          <section className="trn-domain-leaders-panel">
            <div className="trn-domain-leaders-header">
              <span className="trn-domain-leaders-title">
                Melhor Campanha por Domínio Cromático
              </span>
              <span className="trn-domain-leaders-hint">
                Clique em qualquer competidor para ver contra quem jogou em cada rodada
              </span>
            </div>
            <div className="trn-domain-leaders-grid">
              {editionStats.topByDomain.map(({ domain, leader }) => {
                const avatar = CARDS_BY_ID[leader.avatarCardId];
                return (
                  <button
                    key={domain}
                    type="button"
                    className="trn-domain-leader-btn"
                    onClick={() => setInspectedParticipantId(leader.participantId)}
                  >
                    {avatar?.imagePath ? (
                      <img
                        src={`${avatar.imagePath}?v=12`}
                        alt={leader.displayName}
                        loading="lazy"
                        className="trn-avatar"
                      />
                    ) : (
                      <div className="trn-avatar" />
                    )}
                    <div className="trn-player-text">
                      <span className="trn-domain-kicker">{DOMAIN_LABELS_PT[domain]}</span>
                      <span className="trn-player-name">
                        #{leader.rank} {leader.displayName}
                      </span>
                      <span className="trn-player-sub">
                        {formatPoints(leader.points)} pts · Buchholz {formatPoints(leader.buchholz)} ·{' '}
                        {leader.wins}-{leader.draws}-{leader.losses}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* 4B. TAB: CLASSIFICAÇÃO GERAL COMPLETA (CLICKABLE ROWS + ROUND TRAJECTORY) */}
      {detailTab === 'standings' && (
        <div className="trn-table-wrap">
          <div className="trn-table-hint-bar">
            <span>
              Clique em qualquer competidor para abrir a súmula completa das rodadas e adversários
              enfrentados.
            </span>
            <span>{filteredStandings.length} competidores exibidos</span>
          </div>
          <table className="trn-table">
            <thead>
              <tr>
                <th style={{ width: '52px' }}>#</th>
                <th>Competidor</th>
                <th style={{ textAlign: 'right' }}>Pts</th>
                <th style={{ textAlign: 'right' }}>Buchholz</th>
                <th style={{ textAlign: 'center' }}>V-E-D</th>
                <th>Campanha por Rodada</th>
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
                    className={`trn-clickable-row ${isMe ? 'trn-row-me' : ''}`}
                    onClick={() => setInspectedParticipantId(row.participantId)}
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
                            {isMe && <span className="trn-me-tag">Você</span>}
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
                    <td>
                      {row.matchHistory.length === 0 ? (
                        <span className="trn-player-sub">Aguardando 1ª rodada</span>
                      ) : (
                        <div className="trn-round-chips-row">
                          {row.matchHistory.map((item) => {
                            const chip = formatRoundChipLabel(item);
                            return (
                              <span
                                key={`${row.participantId}_r${item.round}`}
                                className={`trn-round-chip tone-${chip.tone}`}
                                title={chip.tooltip}
                              >
                                {chip.short}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </td>
                    <td className="trn-num-muted">{hpSign}</td>
                    <td className="trn-num-muted">{row.eloRating}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {totalStandingsPages > 1 && (
            <div className="trn-pagination">
              <button
                type="button"
                className="aaa-btn aaa-btn-secondary trn-compact-btn"
                disabled={clampedStandingsPage <= 1}
                onClick={() => setStandingsPage((p) => Math.max(1, p - 1))}
              >
                Anterior
              </button>
              <span className="trn-page-indicator">
                Página {clampedStandingsPage} de {totalStandingsPages}
              </span>
              <button
                type="button"
                className="aaa-btn aaa-btn-secondary trn-compact-btn"
                disabled={clampedStandingsPage >= totalStandingsPages}
                onClick={() => setStandingsPage((p) => Math.min(totalStandingsPages, p + 1))}
              >
                Próxima
              </button>
            </div>
          )}
        </div>
      )}

      {/* 4C. TAB: RODADAS & MESAS (ROUND SELECTOR R1..RN + ALL TABLES) */}
      {detailTab === 'pairings' && (
        <div className="trn-table-wrap">
          {snapshot.currentRound === 0 ? (
            <div className="trn-empty-pairings">
              O emparceiramento da 1ª Rodada será publicado automaticamente às{' '}
              <strong>{formatBrtHourMinute(snapshot.definition.startsAtMs)}</strong> com todos os{' '}
              {snapshot.totalParticipantsCount} competidores.
            </div>
          ) : (
            <>
              <div className="trn-round-selector-bar">
                <div className="trn-round-pills-list" role="tablist" aria-label="Selecionar rodada">
                  {Array.from({ length: snapshot.currentRound }, (_, idx) => idx + 1).map(
                    (rNum) => {
                      const count = (snapshot.roundsPairings[rNum] ?? []).length;
                      const isActive = selectedRoundTab === rNum;
                      return (
                        <button
                          key={`round_sel_${rNum}`}
                          type="button"
                          role="tab"
                          aria-selected={isActive}
                          className={`trn-round-tab-btn ${isActive ? 'active' : ''}`}
                          onClick={() => {
                            setSelectedRoundTab(rNum);
                            setPairingsPage(1);
                          }}
                        >
                          Rodada {rNum} ({count} mesas)
                        </button>
                      );
                    }
                  )}
                </div>
                <span className="trn-round-selector-hint">
                  Mesas ordenadas pela pontuação Suíça no início da Rodada {selectedRoundTab}
                </span>
              </div>

              <table className="trn-table">
                <thead>
                  <tr>
                    <th style={{ width: '72px' }}>Mesa</th>
                    <th>Competidor A</th>
                    <th style={{ width: '165px', textAlign: 'center' }}>Placar &amp; Detalhe</th>
                    <th>Competidor B</th>
                  </tr>
                </thead>
                <tbody>
                  {visiblePairings.map((pair: ComputedRoundPairing) => {
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

                    const avatarA = CARDS_BY_ID[pair.playerA.avatarCardId];
                    const avatarB = pair.playerB
                      ? CARDS_BY_ID[pair.playerB.avatarCardId]
                      : undefined;
                    const aWon = pair.result === 'A_WIN' || pair.result === 'BYE';
                    const bWon = pair.result === 'B_WIN';
                    const absMargin = Math.abs(pair.hpDiffA);

                    return (
                      <tr
                        key={`tb_${pair.round}_${pair.tableNumber}`}
                        className={pair.isMyTable ? 'trn-row-me' : ''}
                      >
                        <td className="trn-rank-cell">#{pair.tableNumber}</td>
                        <td>
                          <button
                            type="button"
                            className="trn-pair-player-btn"
                            onClick={() => setInspectedParticipantId(pair.playerA.participantId)}
                          >
                            {avatarA?.imagePath ? (
                              <img
                                src={`${avatarA.imagePath}?v=12`}
                                alt={pair.playerA.displayName}
                                loading="lazy"
                                className="trn-avatar trn-avatar-sm"
                              />
                            ) : (
                              <div className="trn-avatar trn-avatar-sm" />
                            )}
                            <div className="trn-player-text">
                              <span
                                className={`trn-player-name ${aWon ? 'trn-winner-highlight' : ''}`}
                              >
                                {pair.playerA.displayName}
                              </span>
                              <span className="trn-pair-pts">
                                #{pair.playerA.rank} geral · tinha {formatPoints(pair.pointsBeforeA)}{' '}
                                pt · {pair.playerA.eloRating} ELO
                              </span>
                            </div>
                          </button>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <div className="trn-score-stack">
                            <span
                              className={`trn-score-badge ${
                                pair.result === 'IN_PROGRESS' ? 'live' : ''
                              }`}
                            >
                              {resLabel}
                            </span>
                            {pair.result !== 'IN_PROGRESS' && pair.result !== 'BYE' && (
                              <span className="trn-score-detail">
                                {pair.turns > 0 ? `${pair.turns} turnos · ` : ''}
                                {absMargin > 0 ? `saldo ${absMargin} PV` : 'igualdade'}
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          {pair.playerB ? (
                            <button
                              type="button"
                              className="trn-pair-player-btn"
                              onClick={() => setInspectedParticipantId(pair.playerB!.participantId)}
                            >
                              {avatarB?.imagePath ? (
                                <img
                                  src={`${avatarB.imagePath}?v=12`}
                                  alt={pair.playerB.displayName}
                                  loading="lazy"
                                  className="trn-avatar trn-avatar-sm"
                                />
                              ) : (
                                <div className="trn-avatar trn-avatar-sm" />
                              )}
                              <div className="trn-player-text">
                                <span
                                  className={`trn-player-name ${
                                    bWon ? 'trn-winner-highlight' : ''
                                  }`}
                                >
                                  {pair.playerB.displayName}
                                </span>
                                <span className="trn-pair-pts">
                                  #{pair.playerB.rank} geral · tinha{' '}
                                  {formatPoints(pair.pointsBeforeB)} pt · {pair.playerB.eloRating}{' '}
                                  ELO
                                </span>
                              </div>
                            </button>
                          ) : (
                            <span className="trn-player-sub">Bye Suíço (+1,0 pt)</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {totalPairingsPages > 1 && (
                <div className="trn-pagination">
                  <button
                    type="button"
                    className="aaa-btn aaa-btn-secondary trn-compact-btn"
                    disabled={clampedPairingsPage <= 1}
                    onClick={() => setPairingsPage((p) => Math.max(1, p - 1))}
                  >
                    Anterior
                  </button>
                  <span className="trn-page-indicator">
                    Página {clampedPairingsPage} de {totalPairingsPages}
                  </span>
                  <button
                    type="button"
                    className="aaa-btn aaa-btn-secondary trn-compact-btn"
                    disabled={clampedPairingsPage >= totalPairingsPages}
                    onClick={() =>
                      setPairingsPage((p) => Math.min(totalPairingsPages, p + 1))
                    }
                  >
                    Próxima
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* 5. MODAL: SÚMULA INDIVIDUAL DO COMPETIDOR (ROUND-BY-ROUND OPPONENTS & RESULTS) */}
      {inspectedStanding && (
        <div
          className="aaa-modal-backdrop"
          onClick={() => setInspectedParticipantId(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="trn-competitor-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="trn-competitor-modal-head">
              <div className="trn-player-cell">
                {CARDS_BY_ID[inspectedStanding.avatarCardId]?.imagePath ? (
                  <img
                    src={`${CARDS_BY_ID[inspectedStanding.avatarCardId].imagePath}?v=12`}
                    alt={inspectedStanding.displayName}
                    className="trn-podium-portrait"
                  />
                ) : (
                  <div className="trn-podium-portrait" />
                )}
                <div className="trn-player-text">
                  <div className="trn-kicker">
                    #{inspectedStanding.rank} na Classificação ·{' '}
                    {DOMAIN_LABELS_PT[inspectedStanding.primaryDomain]}
                  </div>
                  <h2 className="font-cinzel" style={{ margin: '2px 0', fontSize: '1.08rem' }}>
                    {inspectedStanding.displayName}
                  </h2>
                  <div className="trn-player-sub">{inspectedStanding.subtitle}</div>
                </div>
              </div>

              <button
                type="button"
                className="aaa-btn aaa-btn-secondary trn-compact-btn"
                onClick={() => setInspectedParticipantId(null)}
              >
                Fechar
              </button>
            </div>

            <div className="trn-competitor-summary-strip">
              <div>
                <span>Pontuação</span>
                <strong style={{ color: '#f3e3b0' }}>
                  {formatPoints(inspectedStanding.points)} pts
                </strong>
              </div>
              <div>
                <span>Buchholz</span>
                <strong>{formatPoints(inspectedStanding.buchholz)}</strong>
              </div>
              <div>
                <span>Campanha (V-E-D)</span>
                <strong>
                  {inspectedStanding.wins}-{inspectedStanding.draws}-{inspectedStanding.losses}
                </strong>
              </div>
              <div>
                <span>Saldo de PV</span>
                <strong>
                  {inspectedStanding.hpDiff > 0
                    ? `+${inspectedStanding.hpDiff}`
                    : inspectedStanding.hpDiff}
                </strong>
              </div>
              <div>
                <span>ELO</span>
                <strong>{inspectedStanding.eloRating}</strong>
              </div>
            </div>

            <div className="trn-competitor-modal-body">
              {inspectedStanding.matchHistory.length === 0 ? (
                <div className="trn-empty-pairings">
                  Este competidor ainda não possui rodadas concluídas nesta edição.
                </div>
              ) : (
                <table className="trn-table">
                  <thead>
                    <tr>
                      <th style={{ width: '96px' }}>Rodada</th>
                      <th>Adversário Enfrentado</th>
                      <th style={{ textAlign: 'center', width: '125px' }}>Resultado</th>
                      <th style={{ textAlign: 'right', width: '130px' }}>Detalhe</th>
                      <th style={{ textAlign: 'right', width: '80px' }}>Acum.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inspectedStanding.matchHistory.map((m) => {
                      const oppCard = CARDS_BY_ID[m.opponentAvatarCardId];
                      const outcomeLabel =
                        m.outcome === 'WIN'
                          ? 'Vitória (+1,0)'
                          : m.outcome === 'DRAW'
                          ? 'Empate (+0,5)'
                          : m.outcome === 'BYE'
                          ? 'Bye (+1,0)'
                          : m.outcome === 'IN_PROGRESS'
                          ? 'Em jogo'
                          : 'Derrota (0,0)';
                      const tone =
                        m.outcome === 'WIN' || m.outcome === 'BYE'
                          ? 'win'
                          : m.outcome === 'DRAW'
                          ? 'draw'
                          : m.outcome === 'IN_PROGRESS'
                          ? 'live'
                          : 'loss';
                      const hpStr = m.hpDiff > 0 ? `+${m.hpDiff} PV` : `${m.hpDiff} PV`;

                      return (
                        <tr key={`hist_r${m.round}`}>
                          <td>
                            <button
                              type="button"
                              className="trn-jump-table-link"
                              onClick={() => {
                                setInspectedParticipantId(null);
                                setDetailTab('pairings');
                                setSelectedRoundTab(m.round);
                                setPairingsSearch(`#${m.tableNumber}`);
                                setPairingsPage(1);
                              }}
                              title={`Ir para a Mesa #${m.tableNumber} da Rodada ${m.round}`}
                            >
                              R{m.round} · Mesa #{m.tableNumber}
                            </button>
                          </td>
                          <td>
                            {m.opponentId === '__BYE__' ? (
                              <span className="trn-player-sub">Bye Suíço regulamentar</span>
                            ) : (
                              <button
                                type="button"
                                className="trn-pair-player-btn"
                                onClick={() => setInspectedParticipantId(m.opponentId)}
                                title={`Abrir súmula de ${m.opponentName}`}
                              >
                                {oppCard?.imagePath ? (
                                  <img
                                    src={`${oppCard.imagePath}?v=12`}
                                    alt={m.opponentName}
                                    loading="lazy"
                                    className="trn-avatar trn-avatar-sm"
                                  />
                                ) : (
                                  <div className="trn-avatar trn-avatar-sm" />
                                )}
                                <div className="trn-player-text">
                                  <span className="trn-player-name">{m.opponentName}</span>
                                  <span className="trn-pair-pts">
                                    #{m.opponentFinalRank} na classificação · fechou com{' '}
                                    {formatPoints(m.opponentFinalPoints)} pts · {m.opponentElo} ELO
                                  </span>
                                </div>
                              </button>
                            )}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <span className={`trn-round-chip tone-${tone}`}>{outcomeLabel}</span>
                          </td>
                          <td className="trn-num-muted">
                            {m.outcome === 'IN_PROGRESS'
                              ? '—'
                              : `${hpStr}${m.turns > 0 ? ` · ${m.turns}t` : ''}`}
                          </td>
                          <td className="trn-num-strong">{formatPoints(m.cumulativePoints)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}

              <div className="trn-buchholz-footnote">
                Buchholz ({formatPoints(inspectedStanding.buchholz)}) = soma dos pontos finais dos
                adversários enfrentados nesta edição. Clique no nome de qualquer adversário acima
                para inspecionar a campanha dele.
              </div>
            </div>
          </div>
        </div>
      )}

      {renderAdminPanel()}
      {renderRulesModal()}
    </div>
  );
};
