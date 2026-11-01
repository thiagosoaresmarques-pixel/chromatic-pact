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
  red: 'Pyros',
  green: 'Veridia',
  blue: 'Vórtex',
  purple: 'Eclipse',
  gold: 'Solária',
  neutral: 'Matriz Axial',
};

const DOMAIN_ACCENT_HEX: Record<Domain, string> = {
  red: '#ef4444',
  green: '#22c55e',
  blue: '#38bdf8',
  purple: '#a855f7',
  gold: '#eab308',
  neutral: '#94a3b8',
};

const ALL_DOMAINS_ORDER: Domain[] = ['red', 'blue', 'gold', 'purple', 'green', 'neutral'];

function formatClockCountdown(ms: number): string {
  const totalSec = Math.max(0, Math.ceil(ms / 1000));
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (d > 0) {
    return `${d}d ${h}h`;
  }
  if (h > 0) {
    return `${h}h ${String(m).padStart(2, '0')}m`;
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

function formatBrtFriendlyDate(epochMs: number): string {
  try {
    const raw = new Intl.DateTimeFormat('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      timeZone: 'America/Sao_Paulo',
    }).format(new Date(epochMs));
    const clean = raw.replace(/\./g, '');
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  } catch {
    return new Date(epochMs).toLocaleDateString('pt-BR');
  }
}

function formatPoints(pts: number): string {
  return Number.isInteger(pts) ? `${pts}.0` : pts.toFixed(1);
}

function compactDisplayName(name: string): string {
  const commaIdx = name.indexOf(',');
  if (commaIdx > 2) return name.slice(0, commaIdx).trim();
  return name;
}

function cleanTournamentTitle(title: string): string {
  return title
    .replace(/\s*—\s*Circuito Suíço Oficial/i, '')
    .replace(/\s*—\s*Suíço Oficial/i, '');
}

const LEGENDARY_BACKDROP_CARDS = ALL_CARDS.filter(
  (c) => c.rarity === 'legendary' && Boolean(c.imagePath)
);

function pickEventBackdropArt(defId: string): string | undefined {
  if (LEGENDARY_BACKDROP_CARDS.length === 0) return undefined;
  let sum = 17;
  for (let i = 0; i < defId.length; i += 1) sum = (sum * 31 + defId.charCodeAt(i)) >>> 0;
  return LEGENDARY_BACKDROP_CARDS[sum % LEGENDARY_BACKDROP_CARDS.length]?.imagePath;
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
      short: '•',
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
  const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>(() => {
    try {
      return new URLSearchParams(window.location.search).get('tid') || null;
    } catch {
      return null;
    }
  });

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
  const [detailTab, setDetailTab] = useState<TournamentDetailTab>(() => {
    try {
      const v = new URLSearchParams(window.location.search).get('tview');
      if (v === 'podium' || v === 'standings' || v === 'pairings') return v;
    } catch {
      // ignore
    }
    return 'standings';
  });
  const [selectedRoundTab, setSelectedRoundTab] = useState<number>(() => {
    try {
      const r = Number(new URLSearchParams(window.location.search).get('tround'));
      if (Number.isFinite(r) && r >= 1) return Math.floor(r);
    } catch {
      // ignore
    }
    return 1;
  });
  const [standingsSearch, setStandingsSearch] = useState<string>('');
  const [domainFilter, setDomainFilter] = useState<'all' | Domain>('all');
  const [standingsPage, setStandingsPage] = useState<number>(1);
  const [pairingsSearch, setPairingsSearch] = useState<string>('');
  const [pairingsPage, setPairingsPage] = useState<number>(1);

  // Modals (Progressive Disclosure)
  const [inspectedParticipantId, setInspectedParticipantId] = useState<string | null>(null);
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
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
  const [admTitle, setAdmTitle] = useState<string>('Terça Soberana');
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
    if (!inspectedParticipantId && !showRulesModal && !showAdminModal) return;
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        if (inspectedParticipantId) setInspectedParticipantId(null);
        else if (showRulesModal) setShowRulesModal(false);
        else setShowAdminModal(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [inspectedParticipantId, showRulesModal, showAdminModal]);

  const catalogStageSignature = useMemo(
    () =>
      catalog.tournaments
        .map((t) => `${t.id}:${getTournamentStageKey(t, nowMs)}`)
        .join('|'),
    [catalog.tournaments, nowMs]
  );

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
        `Inscrição confirmada com "${entry.deckName}" (${domLabel}).`
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
          `Vitória por W.O. (+1,0 pt) registrada na Rodada ${pvpHandshakeState.round}.`
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
        label: '1 Carta Rara Inédita',
        desc: 'Sorteada automaticamente entre as Raras inéditas da cor predominante do Grimório do Campeão (+50 Ouro).',
      },
      unowned_domain_legendary_card: {
        label: '1 Carta Lendária Inédita',
        desc: 'Sorteada entre as Lendárias inéditas da cor predominante do Grimório do Campeão (+50 Ouro).',
      },
      gold_and_shards: {
        label: '300 Ouro + 150 Estilhaços',
        desc: 'Creditados diretamente na conta do Campeão ao término da última rodada.',
      },
      cash_brl_pix: {
        label: `R$ ${admCashBrl},00 (PIX) + Carta Rara`,
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
      setShowAdminModal(false);
      await refreshCloudCatalog();
      setStatusFeedback(`Torneio "${newDef.title}" agendado com sucesso.`);
    }
  };

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

  const phaseSummary = useMemo(() => {
    if (snapshot.phase === 'registration') {
      const rem = snapshot.definition.startsAtMs - nowMs;
      return {
        tone: 'upcoming' as const,
        label: `Início em ${formatClockCountdown(rem)}`,
        sub: `${formatBrtFriendlyDate(snapshot.definition.startsAtMs)} · ${formatBrtHourMinute(
          snapshot.definition.startsAtMs
        )}–${formatBrtHourMinute(snapshot.definition.endsAtMs)}`,
      };
    }
    if (snapshot.phase === 'round_active') {
      const rem = snapshot.roundPlayDeadlineMs - nowMs;
      return {
        tone: 'live' as const,
        label: `Rodada ${snapshot.currentRound}/${snapshot.definition.totalRounds} · ${formatClockCountdown(
          rem
        )}`,
        sub: `${snapshot.definition.turnTimeLimitSec}s por turno`,
      };
    }
    if (snapshot.phase === 'round_break') {
      const rem = snapshot.roundEndsAtMs - nowMs;
      const nextR = Math.min(snapshot.definition.totalRounds, snapshot.currentRound + 1);
      return {
        tone: 'break' as const,
        label: `Próxima rodada (${nextR}/${snapshot.definition.totalRounds}) em ${formatClockCountdown(
          rem
        )}`,
        sub: 'Emparceiramento automático',
      };
    }
    return {
      tone: 'finished' as const,
      label: 'Encerrado',
      sub: `${formatBrtFriendlyDate(snapshot.definition.startsAtMs)} · ${formatBrtHourMinute(
        snapshot.definition.startsAtMs
      )}–${formatBrtHourMinute(snapshot.definition.endsAtMs)}`,
    };
  }, [snapshot, nowMs]);

  const awardedPrizeCard = snapshot.finalizedAward?.cardId
    ? CARDS_BY_ID[snapshot.finalizedAward.cardId] ?? null
    : null;

  const podiumTop3 = useMemo(() => snapshot.standings.slice(0, 3), [snapshot.standings]);

  // Shared Modals (Rules & Admin Creation)
  const renderSharedModals = () => (
    <>
      {showRulesModal && (
        <div
          className="trn-modal-backdrop"
          onClick={() => setShowRulesModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="trn-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="trn-modal-head">
              <h2 className="trn-modal-title">Regulamento &amp; Cadências</h2>
              <button
                type="button"
                className="trn-btn trn-btn-ghost"
                onClick={() => setShowRulesModal(false)}
              >
                Fechar
              </button>
            </div>

            <div className="trn-rules-body">
              <section className="trn-rules-sec">
                <h3>Formato Suíço de Rodadas Fixas</h3>
                <p>
                  Nenhum competidor é eliminado: todos disputam todas as rodadas programadas em
                  janelas sincronizadas. A cada rodada, cruzam-se competidores de mesma pontuação
                  (Vitória = <code>1,0</code>, Empate = <code>0,5</code>, Derrota = <code>0,0</code>
                  ), sem repetir confrontos.
                </p>
                <p>
                  <strong>Desempate na classificação:</strong> 1º Pontos → 2º Buchholz (soma dos
                  pontos finais dos adversários enfrentados) → 3º Saldo de PV → 4º Vitórias → 5º
                  ELO. No fim do tempo da rodada, prevalece maior Vida atual ou maior soma de Ataque
                  + Vida em mesa.
                </p>
              </section>

              <section className="trn-rules-sec">
                <h3>Calibração de Tempo por Turno</h3>
                <p>
                  Na Campanha e modos de exploração não há relógio. A cronometragem vale apenas em
                  Torneios e partidas competitivas:
                </p>
                <table className="trn-table trn-bench-table">
                  <thead>
                    <tr>
                      <th>Cadência</th>
                      <th>Média</th>
                      <th>Teto P95</th>
                      <th>Em 1 hora</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(TOURNAMENT_TIME_CONTROLS).map((tc) => (
                      <tr key={tc.id} className={tc.id === 'rapid_45s' ? 'trn-row-me' : ''}>
                        <td>
                          <strong>{tc.label}</strong>
                        </td>
                        <td>{tc.avgMatchMinutes}</td>
                        <td>{tc.p95MatchMinutes}</td>
                        <td>{tc.recommendedRoundsIn1h} rodadas</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              <section className="trn-rules-sec">
                <h3>Premiações</h3>
                <p>
                  Ao término da última rodada, a súmula é homologada automaticamente e a premiação é
                  creditada ao Campeão da edição.
                </p>
              </section>
            </div>
          </div>
        </div>
      )}

      {showAdminModal && isAdminProfile(currentUser) && (
        <div
          className="trn-modal-backdrop"
          onClick={() => setShowAdminModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="trn-modal-box trn-modal-narrow" onClick={(e) => e.stopPropagation()}>
            <div className="trn-modal-head">
              <h2 className="trn-modal-title">Agendar Novo Torneio</h2>
              <button
                type="button"
                className="trn-btn trn-btn-ghost"
                onClick={() => setShowAdminModal(false)}
              >
                Fechar
              </button>
            </div>
            <form
              className="trn-admin-modal-form"
              onSubmit={(e) => void handleAdminPublishTournament(e)}
            >
              <label className="trn-field">
                <span>Nome do torneio</span>
                <input
                  type="text"
                  value={admTitle}
                  onChange={(e) => setAdmTitle(e.target.value)}
                  required
                />
              </label>
              <div className="trn-form-row-2">
                <label className="trn-field">
                  <span>Data e horário de início</span>
                  <input
                    type="datetime-local"
                    value={admStartLocal}
                    onChange={(e) => setAdmStartLocal(e.target.value)}
                    required
                  />
                </label>
                <label className="trn-field">
                  <span>Rodadas</span>
                  <input
                    type="number"
                    min={3}
                    max={11}
                    value={admRounds}
                    onChange={(e) => setAdmRounds(Number(e.target.value))}
                  />
                </label>
              </div>
              <label className="trn-field">
                <span>Ritmo de jogo</span>
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
                <span>Premiação oficial</span>
                <select
                  value={admPrizeKind}
                  onChange={(e) => setAdmPrizeKind(e.target.value as TournamentPrizeKind)}
                >
                  <option value="unowned_domain_rare_card">
                    1 Carta Rara Inédita (Cor do Grimório)
                  </option>
                  <option value="unowned_domain_legendary_card">
                    1 Carta Lendária Inédita (Cor do Grimório)
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
              <div className="trn-modal-foot">
                <button
                  type="button"
                  className="trn-btn trn-btn-ghost"
                  onClick={() => setShowAdminModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="trn-btn trn-btn-primary">
                  Publicar torneio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );

  // ==========================================================================
  // VIEW A: TOURNAMENT HUB (CLEAN EDITORIAL ARENA LOBBY)
  // ==========================================================================
  if (!selectedTournamentId) {
    return (
      <div className="aaa-page-shell tournaments-shell">
        <header className="trn-top-bar">
          <div className="trn-top-bar-left">
            <h1 className="trn-page-heading">Torneios</h1>
            <span className="trn-page-sub">
              Sistema Suíço de rodadas fixas · Pareamento automático
            </span>
          </div>

          <div className="trn-top-bar-actions">
            {isAdminProfile(currentUser) && (
              <button
                type="button"
                className="trn-btn trn-btn-ghost"
                onClick={() => setShowAdminModal(true)}
              >
                + Novo torneio
              </button>
            )}
            <button
              type="button"
              className="trn-btn trn-btn-ghost"
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

        {/* 1. UPCOMING & LIVE EVENTS (2-COLUMN ARCHITECTURAL CARDS) */}
        <section className="trn-section">
          <div className="trn-section-bar">
            <h2 className="trn-section-title">Próximas edições</h2>
          </div>

          {liveAndUpcomingList.length === 0 ? (
            <div className="trn-empty-pairings">
              Nenhuma edição aberta no momento.
            </div>
          ) : (
            <div className="trn-upcoming-grid">
              {liveAndUpcomingList.map((tSnap) => {
                const isLive = tSnap.phase === 'round_active' || tSnap.phase === 'round_break';
                const remMs = isLive
                  ? tSnap.roundEndsAtMs - nowMs
                  : tSnap.definition.startsAtMs - nowMs;
                const enrolled = Boolean(tSnap.myEntry);
                const artPath = pickEventBackdropArt(tSnap.definition.id);

                return (
                  <article
                    key={tSnap.definition.id}
                    className={`trn-event-card ${isLive ? 'is-live' : ''}`}
                    onClick={() => openTournamentDetail(tSnap.definition.id, 'standings')}
                  >
                    {artPath && (
                      <div
                        className="trn-event-card-art"
                        style={{ backgroundImage: `url(${artPath}?v=12)` }}
                        aria-hidden="true"
                      />
                    )}

                    <div className="trn-event-card-content">
                      <div className="trn-event-card-top">
                        <span className={`trn-badge ${isLive ? 'live' : 'upcoming'}`}>
                          {isLive
                            ? `Ao vivo · R${tSnap.currentRound}/${tSnap.definition.totalRounds}`
                            : `Em ${formatClockCountdown(remMs)}`}
                        </span>
                        <span className="trn-event-date">
                          {formatBrtFriendlyDate(tSnap.definition.startsAtMs)} ·{' '}
                          {formatBrtHourMinute(tSnap.definition.startsAtMs)}
                        </span>
                      </div>

                      <h3 className="trn-event-card-title">
                        {cleanTournamentTitle(tSnap.definition.title)}
                      </h3>

                      <div className="trn-event-specs-grid">
                        <div className="trn-spec-item">
                          <span className="trn-spec-label">Formato</span>
                          <span className="trn-spec-val">
                            Suíço · {tSnap.definition.totalRounds} rodadas
                          </span>
                        </div>
                        <div className="trn-spec-item">
                          <span className="trn-spec-label">Ritmo</span>
                          <span className="trn-spec-val">
                            {tSnap.definition.turnTimeLimitSec}s / turno
                          </span>
                        </div>
                        <div className="trn-spec-item">
                          <span className="trn-spec-label">Premiação</span>
                          <span className="trn-spec-val gold">
                            {tSnap.definition.prizeSpec.label.replace(/\s*\(Cor do Grimório\)/i, '')}
                          </span>
                        </div>
                      </div>

                      <div className="trn-event-card-foot">
                        <span className="trn-event-count">
                          {tSnap.totalParticipantsCount} competidores
                          {enrolled ? ' · Inscrito' : ''}
                        </span>

                        <button
                          type="button"
                          className="trn-btn trn-btn-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            openTournamentDetail(tSnap.definition.id, 'standings');
                          }}
                        >
                          {isLive
                            ? 'Entrar na mesa'
                            : enrolled
                            ? 'Ver torneio'
                            : 'Inscrever-se'}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* 2. COMPLETED TOURNAMENTS ARCHIVE (CLEAN PODIUM MINI-STRIP, ZERO TRUNCATION) */}
        <section className="trn-section">
          <div className="trn-section-bar">
            <h2 className="trn-section-title">Edições concluídas</h2>
          </div>

          {finishedList.length === 0 ? (
            <div className="trn-empty-pairings">Nenhuma edição concluída ainda.</div>
          ) : (
            <div className="trn-archive-list">
              {finishedList.map((fSnap) => {
                const top3 = fSnap.standings.slice(0, 3);
                return (
                  <div
                    key={fSnap.definition.id}
                    className="trn-archive-card"
                    onClick={() => openTournamentDetail(fSnap.definition.id, 'podium')}
                  >
                    <div className="trn-archive-info">
                      <div className="trn-archive-title">{fSnap.definition.title}</div>
                      <div className="trn-archive-meta">
                        {formatBrtFriendlyDate(fSnap.definition.startsAtMs)} ·{' '}
                        {fSnap.definition.totalRounds} rodadas ·{' '}
                        {fSnap.totalParticipantsCount} competidores
                      </div>
                    </div>

                    <div className="trn-archive-medals">
                      {top3.map((m, idx) => {
                        const card = CARDS_BY_ID[m.avatarCardId];
                        return (
                          <div
                            key={m.participantId}
                            className={`trn-mini-medal place-${idx + 1}`}
                            title={`${idx + 1}º ${m.displayName} (${formatPoints(m.points)} pts)`}
                          >
                            {card?.imagePath ? (
                              <img
                                src={`${card.imagePath}?v=12`}
                                alt={m.displayName}
                                loading="lazy"
                                className="trn-mini-medal-avatar"
                              />
                            ) : (
                              <div className="trn-mini-medal-avatar" />
                            )}
                            <div className="trn-mini-medal-text">
                              <span className="trn-mini-medal-rank">
                                {idx + 1}º {compactDisplayName(m.displayName)}
                              </span>
                              <span className="trn-mini-medal-pts">
                                {formatPoints(m.points)} pts
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="trn-archive-cta">
                      <button
                        type="button"
                        className="trn-btn trn-btn-ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          openTournamentDetail(fSnap.definition.id, 'podium');
                        }}
                      >
                        Ver resultados →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {renderSharedModals()}
      </div>
    );
  }

  // ==========================================================================
  // VIEW B: SPECIFIC TOURNAMENT DETAIL PAGE (PÓDIO | CLASSIFICAÇÃO | RODADAS)
  // ==========================================================================
  return (
    <div className="aaa-page-shell tournaments-shell">
      <header className="trn-top-bar">
        <div className="trn-top-bar-left">
          <div className="trn-detail-title-line">
            <button
              type="button"
              className="trn-back-btn"
              onClick={() => setSelectedTournamentId(null)}
            >
              ← Torneios
            </button>
            <span className="trn-crumb-sep">/</span>
            <h1 className="trn-page-heading">{snapshot.definition.title}</h1>
            <span className={`trn-badge ${phaseSummary.tone}`}>{phaseSummary.label}</span>
          </div>
          <span className="trn-page-sub">
            {phaseSummary.sub} · {snapshot.definition.totalRounds} rodadas ·{' '}
            {snapshot.definition.turnTimeLimitSec}s/turno · {snapshot.totalParticipantsCount}{' '}
            competidores · Prêmio: {snapshot.definition.prizeSpec.label}
          </span>
        </div>

        <div className="trn-top-bar-actions">
          {snapshot.myStanding && (
            <button
              type="button"
              className="trn-btn trn-btn-ghost"
              onClick={() => setInspectedParticipantId(snapshot.myStanding!.participantId)}
            >
              Minha campanha (#{snapshot.myStanding.rank} ·{' '}
              {formatPoints(snapshot.myStanding.points)} pt)
            </button>
          )}
          <button
            type="button"
            className="trn-btn trn-btn-ghost"
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

      {/* ENROLLMENT OR ACTIVE MATCH BAR (WHEN NOT FINISHED) */}
      {snapshot.phase !== 'finished' && (
        <section className="trn-action-strip">
          {!snapshot.myEntry ? (
            <div className="trn-enroll-row">
              <div className="trn-enroll-info">
                <div className="trn-strip-title">
                  {snapshot.phase === 'registration'
                    ? 'Inscrição aberta'
                    : `Inscrição tardia aberta (Rodada ${snapshot.currentRound})`}
                </div>
                <div className="trn-strip-desc">
                  Selecione seu Grimório de 100 cartas para competir nas{' '}
                  {snapshot.definition.totalRounds} rodadas.
                </div>
              </div>

              <div className="trn-enroll-controls">
                {!isGuest && customDecks.length > 0 && (
                  <select
                    className="trn-deck-select"
                    value={selectedDeckObj?.id ?? ''}
                    onChange={(e) => setSelectedDeckId(e.target.value)}
                    aria-label="Selecionar Grimório"
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
                  className="trn-btn trn-btn-primary"
                  disabled={isEnrolling}
                  onClick={() => void handleEnroll()}
                >
                  {isGuest
                    ? 'Entrar na conta'
                    : customDecks.length === 0
                    ? 'Montar Grimório'
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
                      Inscrito com <strong>{snapshot.myEntry.deckName}</strong> (
                      {DOMAIN_LABELS_PT[snapshot.myEntry.primaryDomain]})
                    </>
                  ) : myOpponentStanding ? (
                    <>
                      Rodada {snapshot.currentRound}/{snapshot.definition.totalRounds} · Mesa #
                      {snapshot.myCurrentPairing?.tableNumber ?? 1}:{' '}
                      <strong>{currentUser.username}</strong> vs{' '}
                      <strong>{myOpponentStanding.displayName}</strong> ({myOpponentStanding.eloRating})
                    </>
                  ) : (
                    <>Rodada {snapshot.currentRound}: Bye Suíço (+1,0 pt)</>
                  )}
                </div>
                <div className="trn-strip-desc">
                  {snapshot.phase === 'registration'
                    ? `A 1ª rodada começa às ${formatBrtHourMinute(
                        snapshot.definition.startsAtMs
                      )}.`
                    : myCurrentRoundRecord
                    ? `Resultado registrado (${
                        myCurrentRoundRecord.score === 1
                          ? 'Vitória +1,0'
                          : myCurrentRoundRecord.score === 0.5
                          ? 'Empate +0,5'
                          : 'Derrota 0,0'
                      }). Próxima rodada em ${formatClockCountdown(
                        snapshot.roundEndsAtMs - nowMs
                      )}.`
                    : pvpHandshakeState
                    ? `Aguardando ${pvpHandshakeState.opponent.displayName} na mesa (${pvpHandshakeState.secondsLeft}s)...`
                    : snapshot.phase === 'round_break'
                    ? `Próxima rodada em ${formatClockCountdown(snapshot.roundEndsAtMs - nowMs)}.`
                    : `Tempo restante da rodada: ${formatClockCountdown(
                        snapshot.roundPlayDeadlineMs - nowMs
                      )}.`}
                </div>
              </div>

              <div className="trn-my-table-right">
                <label className="trn-autostart-toggle">
                  <input
                    type="checkbox"
                    checked={autoStartRounds}
                    onChange={(e) => handleToggleAutoStart(e.target.checked)}
                  />
                  <span>Auto-iniciar</span>
                </label>

                {snapshot.phase === 'registration' && customDecks.length > 1 && (
                  <button
                    type="button"
                    className="trn-btn trn-btn-ghost"
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
                      className="trn-btn trn-btn-primary"
                      onClick={() => void handleEnterRoundMatch()}
                    >
                      Entrar na mesa · R{snapshot.currentRound}
                    </button>
                  )}
              </div>
            </div>
          )}
        </section>
      )}

      {/* SUB-NAVIGATION BAR */}
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
              Pódio
            </button>
          )}
          <button
            type="button"
            role="tab"
            aria-selected={detailTab === 'standings'}
            className={`trn-subtab ${detailTab === 'standings' ? 'active' : ''}`}
            onClick={() => setDetailTab('standings')}
          >
            Classificação ({snapshot.totalParticipantsCount})
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
            Rodadas &amp; Mesas
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
              aria-label="Domínio"
            >
              <option value="all">Todos os domínios</option>
              {ALL_DOMAINS_ORDER.map((dom) => (
                <option key={dom} value={dom}>
                  {DOMAIN_LABELS_PT[dom]}
                </option>
              ))}
            </select>
            <input
              type="search"
              className="trn-search-input"
              placeholder="Buscar competidor..."
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
              placeholder="Buscar competidor ou mesa..."
              value={pairingsSearch}
              onChange={(e) => {
                setPairingsSearch(e.target.value);
                setPairingsPage(1);
              }}
            />
          </div>
        )}
      </div>

      {/* TAB 1: PÓDIO OFICIAL */}
      {detailTab === 'podium' && snapshot.phase === 'finished' && (
        <div className="trn-podium-stage">
          <div className="trn-podium-grid">
            {[podiumTop3[1], podiumTop3[0], podiumTop3[2]].map((medalist, visualIdx) => {
              if (!medalist) return null;
              const place = visualIdx === 1 ? 1 : visualIdx === 0 ? 2 : 3;
              const placeLabel =
                place === 1
                  ? '1º Lugar · Campeão'
                  : place === 2
                  ? '2º Lugar · Vice-campeão'
                  : '3º Lugar';
              const portrait = CARDS_BY_ID[medalist.avatarCardId];
              const hpSign = medalist.hpDiff > 0 ? `+${medalist.hpDiff}` : `${medalist.hpDiff}`;

              return (
                <article
                  key={medalist.participantId}
                  className={`trn-podium-card place-${place}`}
                  onClick={() => setInspectedParticipantId(medalist.participantId)}
                >
                  {portrait?.imagePath && (
                    <div
                      className="trn-podium-bg-art"
                      style={{ backgroundImage: `url(${portrait.imagePath}?v=12)` }}
                      aria-hidden="true"
                    />
                  )}

                  <div className="trn-podium-card-inner">
                    <div className="trn-podium-head">
                      <span className="trn-podium-kicker">{placeLabel}</span>
                      <span
                        className="trn-domain-dot"
                        style={{ backgroundColor: DOMAIN_ACCENT_HEX[medalist.primaryDomain] }}
                        title={DOMAIN_LABELS_PT[medalist.primaryDomain]}
                      />
                    </div>

                    <div className="trn-podium-hero">
                      {portrait?.imagePath ? (
                        <img
                          src={`${portrait.imagePath}?v=12`}
                          alt={medalist.displayName}
                          className="trn-podium-avatar-lg"
                        />
                      ) : (
                        <div className="trn-podium-avatar-lg" />
                      )}
                      <div className="trn-podium-names">
                        <h3 className="trn-podium-name">{medalist.displayName}</h3>
                        <span className="trn-podium-sub">{medalist.subtitle}</span>
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

                    <div className="trn-podium-foot">
                      <div className="trn-round-chips-row">
                        {medalist.matchHistory.map((item) => {
                          const chip = formatRoundChipLabel(item);
                          return (
                            <span
                              key={`pod_r${item.round}`}
                              className={`trn-round-chip tone-${chip.tone}`}
                              title={chip.tooltip}
                            >
                              {chip.short}
                            </span>
                          );
                        })}
                      </div>

                      <span className="trn-podium-link">Ver partidas →</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {snapshot.finalizedAward && awardedPrizeCard && (
            <div className="trn-finished-banner">
              <div className="trn-finished-col">
                <div className="trn-kicker">Premiação Entregue</div>
                <div className="trn-finished-headline">
                  <strong>{awardedPrizeCard.name}</strong> creditada para{' '}
                  <strong>{snapshot.finalizedAward.winnerUsername}</strong>
                </div>
              </div>
              <button
                type="button"
                className="trn-btn trn-btn-ghost"
                onClick={() => onInspectCard(awardedPrizeCard)}
              >
                Inspecionar carta
              </button>
            </div>
          )}

          {/* COMPACT STATS & DOMAIN LEADERS */}
          <div className="trn-edition-stats-bar">
            <div className="trn-stat-cell">
              <span className="trn-stat-label">Partidas disputadas</span>
              <strong className="trn-stat-value">
                {editionStats.totalMatches} em {snapshot.definition.totalRounds} rodadas
              </strong>
            </div>
            <div className="trn-stat-cell">
              <span className="trn-stat-label">Campanhas invictas</span>
              <strong className="trn-stat-value">{editionStats.undefeatedCount}</strong>
            </div>
            <div className="trn-stat-cell">
              <span className="trn-stat-label">Empates técnicos</span>
              <strong className="trn-stat-value">{editionStats.totalDraws}</strong>
            </div>
            <div className="trn-stat-cell">
              <span className="trn-stat-label">Ritmo oficial</span>
              <strong className="trn-stat-value">
                {snapshot.definition.turnTimeLimitSec}s por turno
              </strong>
            </div>
          </div>

          <section className="trn-domain-leaders-panel">
            <div className="trn-domain-leaders-header">
              <span className="trn-domain-leaders-title">Líderes por domínio cromático</span>
              <span className="trn-domain-leaders-hint">
                Clique para ver os adversários enfrentados nas 6 rodadas
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
                      <span className="trn-domain-kicker">
                        <span
                          className="trn-domain-dot-inline"
                          style={{ backgroundColor: DOMAIN_ACCENT_HEX[domain] }}
                        />
                        {DOMAIN_LABELS_PT[domain]} · #{leader.rank} geral
                      </span>
                      <span className="trn-player-name">{compactDisplayName(leader.displayName)}</span>
                      <span className="trn-player-sub">
                        {formatPoints(leader.points)} pts · Buchholz {formatPoints(leader.buchholz)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* TAB 2: CLASSIFICAÇÃO GERAL */}
      {detailTab === 'standings' && (
        <div className="trn-table-wrap">
          <table className="trn-table">
            <thead>
              <tr>
                <th style={{ width: '52px' }}>#</th>
                <th>Competidor</th>
                <th style={{ textAlign: 'right' }}>Pts</th>
                <th style={{ textAlign: 'right' }}>Buchholz</th>
                <th style={{ textAlign: 'center' }}>V-E-D</th>
                <th>Rodadas</th>
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
                          <div className="trn-avatar" />
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
                        <span className="trn-player-sub">—</span>
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
                className="trn-btn trn-btn-ghost"
                disabled={clampedStandingsPage <= 1}
                onClick={() => setStandingsPage((p) => Math.max(1, p - 1))}
              >
                ← Anterior
              </button>
              <span className="trn-page-indicator">
                Página {clampedStandingsPage} de {totalStandingsPages}
              </span>
              <button
                type="button"
                className="trn-btn trn-btn-ghost"
                disabled={clampedStandingsPage >= totalStandingsPages}
                onClick={() => setStandingsPage((p) => Math.min(totalStandingsPages, p + 1))}
              >
                Próxima →
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: RODADAS & MESAS (SYMMETRIC FACE-OFF LAYOUT) */}
      {detailTab === 'pairings' && (
        <div className="trn-table-wrap">
          {snapshot.currentRound === 0 ? (
            <div className="trn-empty-pairings">
              As mesas da 1ª rodada serão abertas automaticamente às{' '}
              <strong>{formatBrtHourMinute(snapshot.definition.startsAtMs)}</strong>.
            </div>
          ) : (
            <>
              <div className="trn-round-selector-bar">
                <div className="trn-round-pills-list" role="tablist" aria-label="Selecionar rodada">
                  {Array.from({ length: snapshot.currentRound }, (_, idx) => idx + 1).map(
                    (rNum) => {
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
                          Rodada {rNum}
                        </button>
                      );
                    }
                  )}
                </div>
                <span className="trn-round-selector-hint">
                  {filteredPairings.length} mesas · Clique em qualquer competidor para ver sua súmula
                </span>
              </div>

              <table className="trn-table trn-pairings-table">
                <thead>
                  <tr>
                    <th style={{ width: '64px' }}>Mesa</th>
                    <th style={{ textAlign: 'right' }}>Competidor A</th>
                    <th style={{ width: '140px', textAlign: 'center' }}>Resultado</th>
                    <th style={{ textAlign: 'left' }}>Competidor B</th>
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
                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            className="trn-pair-player-btn align-right"
                            onClick={() => setInspectedParticipantId(pair.playerA.participantId)}
                          >
                            <div className="trn-player-text align-right">
                              <span
                                className={`trn-player-name ${aWon ? 'trn-winner-highlight' : ''}`}
                              >
                                {pair.playerA.displayName}
                              </span>
                              <span className="trn-pair-pts">
                                #{pair.playerA.rank} · {formatPoints(pair.pointsBeforeA)} pt ·{' '}
                                {pair.playerA.eloRating}
                              </span>
                            </div>
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
                                {pair.turns > 0 ? `${pair.turns}t · ` : ''}
                                {absMargin > 0 ? `+${absMargin} PV` : '0 PV'}
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
                                  #{pair.playerB.rank} · {formatPoints(pair.pointsBeforeB)} pt ·{' '}
                                  {pair.playerB.eloRating}
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
                    className="trn-btn trn-btn-ghost"
                    disabled={clampedPairingsPage <= 1}
                    onClick={() => setPairingsPage((p) => Math.max(1, p - 1))}
                  >
                    ← Anterior
                  </button>
                  <span className="trn-page-indicator">
                    Página {clampedPairingsPage} de {totalPairingsPages}
                  </span>
                  <button
                    type="button"
                    className="trn-btn trn-btn-ghost"
                    disabled={clampedPairingsPage >= totalPairingsPages}
                    onClick={() =>
                      setPairingsPage((p) => Math.min(totalPairingsPages, p + 1))
                    }
                  >
                    Próxima →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* MODAL: SÚMULA INDIVIDUAL DO COMPETIDOR */}
      {inspectedStanding && (
        <div
          className="trn-modal-backdrop"
          onClick={() => setInspectedParticipantId(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="trn-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="trn-modal-head">
              <div className="trn-player-cell">
                {CARDS_BY_ID[inspectedStanding.avatarCardId]?.imagePath ? (
                  <img
                    src={`${CARDS_BY_ID[inspectedStanding.avatarCardId].imagePath}?v=12`}
                    alt={inspectedStanding.displayName}
                    className="trn-podium-avatar-lg"
                  />
                ) : (
                  <div className="trn-podium-avatar-lg" />
                )}
                <div className="trn-player-text">
                  <div className="trn-kicker">
                    #{inspectedStanding.rank} na classificação ·{' '}
                    {DOMAIN_LABELS_PT[inspectedStanding.primaryDomain]}
                  </div>
                  <h2 className="trn-modal-title" style={{ marginTop: '2px' }}>
                    {inspectedStanding.displayName}
                  </h2>
                  <div className="trn-player-sub">{inspectedStanding.subtitle}</div>
                </div>
              </div>

              <button
                type="button"
                className="trn-btn trn-btn-ghost"
                onClick={() => setInspectedParticipantId(null)}
              >
                Fechar
              </button>
            </div>

            <div className="trn-competitor-summary-strip">
              <div>
                <span>Pontos</span>
                <strong style={{ color: '#f3e3b0' }}>
                  {formatPoints(inspectedStanding.points)}
                </strong>
              </div>
              <div>
                <span>Buchholz</span>
                <strong>{formatPoints(inspectedStanding.buchholz)}</strong>
              </div>
              <div>
                <span>V-E-D</span>
                <strong>
                  {inspectedStanding.wins}-{inspectedStanding.draws}-{inspectedStanding.losses}
                </strong>
              </div>
              <div>
                <span>Saldo PV</span>
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
                  Nenhuma rodada concluída nesta edição ainda.
                </div>
              ) : (
                <table className="trn-table">
                  <thead>
                    <tr>
                      <th style={{ width: '96px' }}>Mesa</th>
                      <th>Adversário</th>
                      <th style={{ textAlign: 'center', width: '120px' }}>Resultado</th>
                      <th style={{ textAlign: 'right', width: '115px' }}>Detalhe</th>
                      <th style={{ textAlign: 'right', width: '72px' }}>Acum.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inspectedStanding.matchHistory.map((m) => {
                      const oppCard = CARDS_BY_ID[m.opponentAvatarCardId];
                      const outcomeLabel =
                        m.outcome === 'WIN'
                          ? 'Vitória +1,0'
                          : m.outcome === 'DRAW'
                          ? 'Empate +0,5'
                          : m.outcome === 'BYE'
                          ? 'Bye +1,0'
                          : m.outcome === 'IN_PROGRESS'
                          ? 'Em jogo'
                          : 'Derrota 0,0';
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
                              R{m.round} · #{m.tableNumber}
                            </button>
                          </td>
                          <td>
                            {m.opponentId === '__BYE__' ? (
                              <span className="trn-player-sub">Bye Suíço</span>
                            ) : (
                              <button
                                type="button"
                                className="trn-pair-player-btn"
                                onClick={() => setInspectedParticipantId(m.opponentId)}
                                title={`Ver campanha de ${m.opponentName}`}
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
                                    #{m.opponentFinalRank} geral · {formatPoints(m.opponentFinalPoints)}{' '}
                                    pts · {m.opponentElo} ELO
                                  </span>
                                </div>
                              </button>
                            )}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <span className={`trn-round-chip pill tone-${tone}`}>
                              {outcomeLabel}
                            </span>
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
                Buchholz ({formatPoints(inspectedStanding.buchholz)}) corresponde à soma dos pontos
                finais dos adversários enfrentados. Clique em qualquer adversário para abrir a
                campanha dele.
              </div>
            </div>
          </div>
        </div>
      )}

      {renderSharedModals()}
    </div>
  );
};
