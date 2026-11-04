import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { UNIFIED_CHAMPION_STANDINGS } from '../data/aiUnifiedTournamentData';
import { CARDS_BY_ID } from '../data/cards';
import { PREBUILT_DECKS } from '../data/decks';
import {
  calculateFideRankedEloDelta,
  ELO_DIVISIONS,
  EloDivisionId,
  getEloDivisionMeta,
  getSignatureCardsForSovereign,
  INITIAL_PLAYER_ELO,
  SOVEREIGN_AI_LEADERBOARD_ROSTER,
  SovereignAiLeaderboardEntry,
} from '../data/sovereignEloLadder';
import { CardDefinition, Domain } from '../types/game';
import {
  computeSovereignPresenceDirectory,
  getRecentMatchesForSovereign,
  refreshLiveArenaCloudPool,
  type LiveArenaFeedItem,
  type SovereignPresenceDirectorySnapshot,
} from '../utils/liveArenaFeedEngine';
import {
  evaluateSovereignChallengeInvite,
  getActiveRefusalCooldowns,
  type SovereignRefusalCooldownEntry,
} from '../utils/sovereignPresenceEngine';
import {
  fetchUnifiedPlatformLeaderboard,
  SovereignSavedDeck,
  SovereignUserProfile,
  UnifiedLeaderboardEntry,
  UnifiedLeaderboardSnapshot,
} from '../utils/multiplayerEngine';
import {
  computePersonalReplayShareId,
  fetchSharedPersonalReplay,
  fetchUserMatchHistoryForInspection,
  getPersonalMatchHistory,
  type PersonalMatchHistoryEntry,
  type UserInspectableMatchItem,
} from '../utils/personalMatchHistoryEngine';
import { DOMAIN_META } from './CardView';

export interface LastRankedDuelSummary {
  previousElo: number;
  newElo: number;
  deltaElo: number;
  opponentName: string;
  opponentElo: number;
  didWin: boolean;
}

interface GlobalLeaderboardViewProps {
  currentUser: SovereignUserProfile;
  customDecks: SovereignSavedDeck[];
  isGuest: boolean;
  lastRankedResult?: LastRankedDuelSummary | null;
  onChallengeSovereign: (
    entry: SovereignAiLeaderboardEntry,
    playerDeckIds: string[],
    playerDeckId: string
  ) => void;
  onOpenAccountModal: (tab: 'login' | 'create' | 'profile') => void;
  onOpenPvpConclave: () => void;
  onOpenDeckBuilder: () => void;
  onInspectCard: (card: CardDefinition) => void;
  onWatchSovereignMatch?: (item: LiveArenaFeedItem) => void;
  onWatchUserReplay?: (entry: PersonalMatchHistoryEntry) => void;
}

function formatRelativeTimePt(tsMs: number): string {
  const diffSec = Math.max(0, Math.floor((Date.now() - tsMs) / 1000));
  if (diffSec < 60) return 'agora';
  const mins = Math.floor(diffSec / 60);
  if (mins < 60) return `há ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `há ${hours} h`;
  const days = Math.floor(hours / 24);
  return `há ${days} d`;
}

const DOMAIN_OPTIONS: Array<{ id: Domain; label: string }> = [
  { id: 'red', label: 'Pyros (Vermelho)' },
  { id: 'blue', label: 'Vórtex (Azul)' },
  { id: 'gold', label: 'Solária (Dourado)' },
  { id: 'purple', label: 'Eclipse (Roxo)' },
  { id: 'green', label: 'Veridia (Verde)' },
  { id: 'neutral', label: 'Matriz Axial (Neutro)' },
];

export const GlobalLeaderboardView: React.FC<GlobalLeaderboardViewProps> = ({
  currentUser,
  customDecks,
  isGuest,
  lastRankedResult,
  onChallengeSovereign,
  onOpenAccountModal,
  onOpenPvpConclave,
  onOpenDeckBuilder,
  onInspectCard,
  onWatchSovereignMatch,
  onWatchUserReplay,
}) => {
  const [snapshot, setSnapshot] = useState<UnifiedLeaderboardSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [includeRegionalCommanders, setIncludeRegionalCommanders] = useState<boolean>(true);
  const [onlyAvailableNow, setOnlyAvailableNow] = useState<boolean>(false);
  const [divisionFilter, setDivisionFilter] = useState<'all' | EloDivisionId>('all');
  const [domainFilter, setDomainFilter] = useState<'all' | Domain>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [presenceDir, setPresenceDir] = useState<SovereignPresenceDirectorySnapshot>(() =>
    computeSovereignPresenceDirectory()
  );
  const [refusalCooldowns, setRefusalCooldowns] = useState<
    Record<string, SovereignRefusalCooldownEntry>
  >(() => getActiveRefusalCooldowns());
  const [invitingSovereignId, setInvitingSovereignId] = useState<string | null>(null);
  const [refusalNotice, setRefusalNotice] = useState<{
    sovereignName: string;
    reason: string;
    watchItem?: LiveArenaFeedItem;
  } | null>(null);
  const [dossierSovereign, setDossierSovereign] =
    useState<SovereignAiLeaderboardEntry | null>(null);
  const [dossierHuman, setDossierHuman] = useState<UnifiedLeaderboardEntry | null>(null);
  const [humanMatches, setHumanMatches] = useState<UserInspectableMatchItem[]>([]);
  const [isLoadingHumanMatches, setIsLoadingHumanMatches] = useState<boolean>(false);
  const [loadingReplayKey, setLoadingReplayKey] = useState<string | null>(null);
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const PAGE_SIZE = 50;

  const grandSovereignsCount = useMemo(
    () => SOVEREIGN_AI_LEADERBOARD_ROSTER.filter((s) => s.isGrandSovereign).length,
    []
  );

  const availableDecks = useMemo(() => {
    const list: Array<{ id: string; label: string; cardIds: string[]; isCustom: boolean }> = [];
    for (const d of customDecks) {
      if (d.cardIds && d.cardIds.length >= 100) {
        list.push({
          id: d.id,
          label: d.name,
          cardIds: d.cardIds,
          isCustom: true,
        });
      }
    }
    if (list.length === 0) {
      for (const pb of PREBUILT_DECKS.slice(0, 12)) {
        list.push({
          id: pb.id,
          label: pb.name,
          cardIds: pb.cardIds,
          isCustom: false,
        });
      }
    }
    return list;
  }, [customDecks]);

  const [selectedDeckId, setSelectedDeckId] = useState<string>(
    () => currentUser.preferredDeckId || availableDecks[0]?.id || ''
  );

  useEffect(() => {
    if (!availableDecks.some((d) => d.id === selectedDeckId)) {
      setSelectedDeckId(currentUser.preferredDeckId || availableDecks[0]?.id || '');
    }
  }, [availableDecks, currentUser.preferredDeckId, selectedDeckId]);

  const loadLeaderboard = useCallback(
    async (silent = false) => {
      if (!silent) setIsLoading(true);
      void refreshLiveArenaCloudPool();
      const snap = await fetchUnifiedPlatformLeaderboard(currentUser, {
        includeRegionalCommanders,
      });
      setSnapshot(snap);
      setPresenceDir(computeSovereignPresenceDirectory());
      setRefusalCooldowns(getActiveRefusalCooldowns());
      setDossierSovereign((prev) => {
        if (!prev) return null;
        const updated = snap.entries.find(
          (e) => e.sovereignEntry?.sovereignId === prev.sovereignId
        )?.sovereignEntry;
        return updated ?? prev;
      });
      if (!silent) setIsLoading(false);
    },
    [currentUser, includeRegionalCommanders]
  );

  useEffect(() => {
    void loadLeaderboard(false);
    const timer = window.setInterval(() => {
      void loadLeaderboard(true);
    }, 18_000);
    const presenceTimer = window.setInterval(() => {
      setPresenceDir(computeSovereignPresenceDirectory());
      setRefusalCooldowns(getActiveRefusalCooldowns());
    }, 8_000);
    return () => {
      window.clearInterval(timer);
      window.clearInterval(presenceTimer);
    };
  }, [loadLeaderboard]);

  useEffect(() => {
    if (!dossierSovereign && !dossierHuman && !showRulesModal && !showHistoryModal) return;
    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        setDossierSovereign(null);
        setDossierHuman(null);
        setShowRulesModal(false);
        setShowHistoryModal(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [dossierSovereign, dossierHuman, showRulesModal, showHistoryModal]);

  useEffect(() => {
    const hp = dossierHuman?.humanProfile;
    if (!hp) {
      setHumanMatches([]);
      setIsLoadingHumanMatches(false);
      return;
    }
    let cancelled = false;
    setIsLoadingHumanMatches(true);
    void fetchUserMatchHistoryForInspection(hp, Boolean(dossierHuman?.isCurrentUser)).then(
      (items) => {
        if (!cancelled) {
          setHumanMatches(items);
          setIsLoadingHumanMatches(false);
        }
      }
    );
    return () => {
      cancelled = true;
    };
  }, [dossierHuman]);

  const handleOpenUserReplay = async (
    key: string,
    localEntry?: PersonalMatchHistoryEntry,
    shareId?: string
  ) => {
    if (!onWatchUserReplay) return;
    if (localEntry) {
      setDossierHuman(null);
      setShowHistoryModal(false);
      onWatchUserReplay(localEntry);
      return;
    }
    if (!shareId) return;
    setLoadingReplayKey(key);
    const fetched = await fetchSharedPersonalReplay(shareId);
    setLoadingReplayKey(null);
    if (fetched) {
      setDossierHuman(null);
      setShowHistoryModal(false);
      onWatchUserReplay(fetched);
    }
  };

  const activeDeck = useMemo(
    () => availableDecks.find((d) => d.id === selectedDeckId) ?? availableDecks[0] ?? null,
    [availableDecks, selectedDeckId]
  );

  const playerElo = currentUser.eloRating ?? INITIAL_PLAYER_ELO;
  const playerDiv = getEloDivisionMeta(playerElo);
  const playerWins = (currentUser.pvpWins ?? 0) + (currentUser.rankedSovereignWins ?? 0);
  const playerLosses = (currentUser.pvpLosses ?? 0) + (currentUser.rankedSovereignLosses ?? 0);

  const handleLaunchChallenge = (entry: SovereignAiLeaderboardEntry) => {
    if (!isGuest && customDecks.length === 0) {
      onOpenDeckBuilder();
      return;
    }
    if (!activeDeck || invitingSovereignId) return;

    const freshDir = computeSovereignPresenceDirectory();
    setPresenceDir(freshDir);
    const pres = freshDir.byId[entry.sovereignId];

    if (pres && pres.status !== 'online_idle') {
      setDossierSovereign(null);
      setRefusalNotice({
        sovereignName: entry.sovereignName,
        reason:
          pres.status === 'in_match'
            ? `${pres.detailLabel} neste momento.`
            : pres.status === 'in_tournament'
            ? `${pres.detailLabel} e não pode aceitar desafios avulsos.`
            : 'Acabou de se ausentar do salão.',
        watchItem: pres.liveWatchItem,
      });
      return;
    }

    setRefusalNotice(null);
    setInvitingSovereignId(entry.sovereignId);

    window.setTimeout(() => {
      const evalRes = evaluateSovereignChallengeInvite({
        sovereign: entry,
        playerElo,
        recentOpponentIds: currentUser.recentRankedOpponentIds ?? [],
        justFinishedMatchAgoMs: pres?.justFinishedMatchAgoMs ?? null,
      });
      setInvitingSovereignId(null);
      setRefusalCooldowns(getActiveRefusalCooldowns());

      if (!evalRes.accepted) {
        setDossierSovereign(null);
        setRefusalNotice({
          sovereignName: entry.sovereignName,
          reason: evalRes.reason,
        });
        return;
      }

      setDossierSovereign(null);
      onChallengeSovereign(entry, activeDeck.cardIds, activeDeck.id);
    }, 1300);
  };

  const filteredEntries = useMemo(() => {
    if (!snapshot) return [];
    const q = searchQuery.trim().toLowerCase();
    return snapshot.entries.filter((e) => {
      if (onlyAvailableNow && e.sovereignEntry && !e.isCurrentUser) {
        const st = presenceDir.byId[e.sovereignEntry.sovereignId]?.status;
        const onCd = Boolean(refusalCooldowns[e.sovereignEntry.sovereignId]);
        if (st !== 'online_idle' || onCd) return false;
      }
      if (divisionFilter !== 'all' && getEloDivisionMeta(e.eloRating).id !== divisionFilter) {
        return false;
      }
      if (domainFilter !== 'all' && !e.domains.includes(domainFilter)) return false;
      if (q) {
        const hay = `${e.displayName} ${e.subtitle} ${e.realmOrOrigin}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [
    snapshot,
    onlyAvailableNow,
    presenceDir,
    refusalCooldowns,
    divisionFilter,
    domainFilter,
    searchQuery,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [divisionFilter, domainFilter, searchQuery, includeRegionalCommanders, onlyAvailableNow]);

  const totalPages = Math.max(1, Math.ceil(filteredEntries.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageEntries = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredEntries.slice(start, start + PAGE_SIZE);
  }, [filteredEntries, safePage]);

  const myTargetPage = useMemo(() => {
    if (filteredEntries.length === 0) return 1;
    const meIdx = filteredEntries.findIndex((e) => e.isCurrentUser);
    if (meIdx >= 0) return Math.floor(meIdx / PAGE_SIZE) + 1;
    let bestIdx = 0;
    let bestDiff = Infinity;
    for (let i = 0; i < filteredEntries.length; i++) {
      const diff = Math.abs(filteredEntries[i].eloRating - playerElo);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestIdx = i;
      }
    }
    return Math.floor(bestIdx / PAGE_SIZE) + 1;
  }, [filteredEntries, playerElo]);

  const standingById = useMemo(() => {
    const map = new Map<string, (typeof UNIFIED_CHAMPION_STANDINGS)[number]>();
    for (const s of UNIFIED_CHAMPION_STANDINGS) {
      map.set(s.archetypeId, s);
    }
    return map;
  }, []);

  const renderPortrait = (
    avatarCardId: string,
    size = 36,
    highlight = false,
    statusDot?: { color: string; title: string }
  ) => {
    const card = CARDS_BY_ID[avatarCardId];
    return (
      <div style={{ position: 'relative', width: `${size}px`, height: `${size}px`, flexShrink: 0 }}>
        <button
          type="button"
          onClick={(ev) => {
            ev.stopPropagation();
            if (card) onInspectCard(card);
          }}
          title={card ? `Inspecionar carta: ${card.name}` : undefined}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            overflow: 'hidden',
            border: highlight
              ? '1.5px solid rgba(234, 179, 8, 0.7)'
              : '1px solid rgba(148, 163, 184, 0.28)',
            background: '#0f172a',
            padding: 0,
            cursor: card ? 'pointer' : 'default',
            display: 'block',
          }}
        >
          {card?.imagePath ? (
            <img
              src={card.imagePath}
              alt={card.name}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : null}
        </button>
        {statusDot && (
          <span
            title={statusDot.title}
            style={{
              position: 'absolute',
              right: '-1px',
              bottom: '-1px',
              width: size >= 48 ? '10px' : '8px',
              height: size >= 48 ? '10px' : '8px',
              borderRadius: '50%',
              background: statusDot.color,
              border: '1.5px solid #0b0f19',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
    );
  };

  const nextAvailableRivalRow = useMemo<UnifiedLeaderboardEntry | null>(() => {
    if (!snapshot) return null;
    for (let i = snapshot.entries.length - 1; i >= 0; i -= 1) {
      const entryItem: UnifiedLeaderboardEntry = snapshot.entries[i];
      const sid = entryItem.sovereignEntry?.sovereignId;
      if (
        sid &&
        entryItem.eloRating > playerElo &&
        presenceDir.byId[sid]?.status === 'online_idle' &&
        !refusalCooldowns[sid]
      ) {
        return entryItem;
      }
    }
    return (
      snapshot.entries.find((entryItem: UnifiedLeaderboardEntry) => {
        const sid = entryItem.sovereignEntry?.sovereignId;
        return Boolean(
          sid && presenceDir.byId[sid]?.status === 'online_idle' && !refusalCooldowns[sid]
        );
      }) ?? null
    );
  }, [snapshot, playerElo, presenceDir, refusalCooldowns]);

  const nextRival = nextAvailableRivalRow?.sovereignEntry ?? null;
  const nextRivalRank = nextAvailableRivalRow?.globalRank ?? null;

  return (
    <div
      className="aaa-page-shell"
      style={{ maxWidth: '1080px', margin: '0 auto', padding: '1.1rem 1rem 3rem' }}
    >
      {/* 1. CLEAN MINIMAL HEADER */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '0.85rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap' }}>
          <h1
            className="font-cinzel"
            style={{
              fontSize: '1.35rem',
              fontWeight: 700,
              color: '#f8fafc',
              margin: 0,
              letterSpacing: '0.02em',
            }}
          >
            Ranking Geral
          </h1>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
            {snapshot
              ? `${snapshot.humanCount + snapshot.sovereignCount} participantes`
              : 'Carregando...'}
            {snapshot && (
              <>
                {' · '}
                <span style={{ color: snapshot.isCloudConnected ? '#10b981' : '#94a3b8' }}>
                  {snapshot.isCloudConnected ? 'Sincronizado' : 'Modo local'}
                </span>
              </>
            )}
          </span>
          <button
            type="button"
            onClick={() => setShowRulesModal(true)}
            style={{
              background: 'none',
              border: 'none',
              padding: '4px 2px',
              minHeight: '32px',
              display: 'inline-flex',
              alignItems: 'center',
              color: '#94a3b8',
              fontSize: '0.76rem',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              cursor: 'pointer',
            }}
          >
            Divisões & Regras
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
          <button
            type="button"
            className="aaa-btn aaa-btn-secondary"
            style={{ padding: '6px 11px', fontSize: '0.75rem' }}
            onClick={onOpenPvpConclave}
          >
            Salas 1×1
          </button>
          <button
            type="button"
            className="aaa-btn aaa-btn-secondary"
            style={{ padding: '6px 11px', fontSize: '0.75rem' }}
            onClick={() => void loadLeaderboard()}
            disabled={isLoading}
          >
            {isLoading ? 'Atualizando...' : 'Atualizar'}
          </button>
        </div>
      </header>

      {/* 2. COMPACT SINGLE-LINE PERSONAL STANDING & DECK BAR (Zero nested boxes) */}
      <section
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.85rem',
          padding: '0.75rem 1rem',
          marginBottom: '0.9rem',
          borderRadius: '10px',
          background: 'rgba(15, 23, 42, 0.58)',
          border: '1px solid rgba(148, 163, 184, 0.16)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', minWidth: '220px' }}>
          {renderPortrait(
            currentUser.avatarCardId || 'neutral_10_valkyra_pentacromatica',
            38,
            true
          )}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc' }}>
                {currentUser.username}
              </span>
              <span
                style={{
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: '#eab308',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {playerElo} ELO
              </span>
              {lastRankedResult && (
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    padding: '1px 6px',
                    borderRadius: '4px',
                    background: lastRankedResult.didWin
                      ? 'rgba(16, 185, 129, 0.14)'
                      : 'rgba(239, 68, 68, 0.14)',
                    color: lastRankedResult.didWin ? '#6ee7b7' : '#fca5a5',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                  title={`Último duelo contra ${lastRankedResult.opponentName}`}
                >
                  {lastRankedResult.deltaElo >= 0
                    ? `+${lastRankedResult.deltaElo}`
                    : lastRankedResult.deltaElo}
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '1px' }}>
              {playerDiv.shortLabel}
              {snapshot?.currentUserEntry ? ` · #${snapshot.currentUserEntry.globalRank} geral` : ''}
              {playerWins + playerLosses > 0 ? ` · ${playerWins}V ${playerLosses}D` : ''}
              {(currentUser.recentRankedHistory?.length ?? 0) > 0 && (
                <>
                  {' · '}
                  <button
                    type="button"
                    onClick={() => setShowHistoryModal(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: '#cbd5e1',
                      fontSize: '0.74rem',
                      textDecoration: 'underline',
                      textUnderlineOffset: '2px',
                      cursor: 'pointer',
                    }}
                  >
                    Histórico ({currentUser.recentRankedHistory!.length})
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem',
            flexWrap: 'wrap',
          }}
        >
          <label
            htmlFor="ranked-deck-select"
            style={{ fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap' }}
          >
            Grimório:
          </label>
          <select
            id="ranked-deck-select"
            value={selectedDeckId}
            onChange={(e) => setSelectedDeckId(e.target.value)}
            style={{
              padding: '6px 10px',
              borderRadius: '7px',
              background: '#0b0f19',
              border: '1px solid rgba(148, 163, 184, 0.24)',
              color: '#e2e8f0',
              fontSize: '0.78rem',
              maxWidth: '220px',
            }}
          >
            {availableDecks.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>

          {isGuest && (
            <button
              type="button"
              className="aaa-btn aaa-btn-secondary"
              style={{ padding: '6px 11px', fontSize: '0.75rem' }}
              onClick={() => onOpenAccountModal('create')}
            >
              Salvar na Nuvem
            </button>
          )}

          {nextRival && (
            <button
              type="button"
              className="aaa-btn aaa-btn-primary"
              disabled={Boolean(invitingSovereignId)}
              style={{ padding: '6px 12px', fontSize: '0.76rem', whiteSpace: 'nowrap' }}
              onClick={() => handleLaunchChallenge(nextRival)}
              title={`Desafiar o próximo Soberano disponível acima do seu ELO: ${nextRival.sovereignName} (${nextRival.eloRating} ELO)`}
            >
              {invitingSovereignId === nextRival.sovereignId
                ? 'Convidando...'
                : `Desafiar #${nextRivalRank} (${nextRival.eloRating})`}
            </button>
          )}
        </div>
      </section>

      {refusalNotice && (
        <div
          role="status"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.65rem',
            padding: '0.6rem 0.9rem',
            marginBottom: '0.85rem',
            borderRadius: '8px',
            background: 'rgba(15, 23, 42, 0.72)',
            border: '1px solid rgba(245, 158, 11, 0.28)',
            fontSize: '0.77rem',
            color: '#e2e8f0',
          }}
        >
          <div>
            <strong style={{ color: '#fde68a' }}>{refusalNotice.sovereignName}:</strong>{' '}
            <span style={{ color: '#cbd5e1' }}>{refusalNotice.reason}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            {refusalNotice.watchItem && onWatchSovereignMatch ? (
              <button
                type="button"
                className="aaa-btn aaa-btn-secondary"
                style={{ padding: '4px 10px', fontSize: '0.72rem' }}
                onClick={() => {
                  const target = refusalNotice.watchItem!;
                  setRefusalNotice(null);
                  onWatchSovereignMatch(target);
                }}
              >
                Assistir mesa
              </button>
            ) : nextRival ? (
              <button
                type="button"
                className="aaa-btn aaa-btn-secondary"
                disabled={Boolean(invitingSovereignId)}
                style={{ padding: '4px 10px', fontSize: '0.72rem' }}
                onClick={() => {
                  setRefusalNotice(null);
                  handleLaunchChallenge(nextRival);
                }}
              >
                Desafiar #{nextRivalRank} ({nextRival.eloRating})
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setRefusalNotice(null)}
              aria-label="Fechar aviso"
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '2px 6px',
                fontSize: '0.78rem',
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 3. SINGLE-ROW MINIMALIST FILTER BAR */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.6rem',
          marginBottom: '0.65rem',
        }}
      >
        <div
          style={{
            fontSize: '0.77rem',
            color: '#94a3b8',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          Classificação Oficial ·{' '}
          <strong style={{ color: '#e2e8f0' }}>{filteredEntries.length}</strong> listados ·{' '}
          <span style={{ color: '#6ee7b7' }}>{presenceDir.onlineIdleCount} disponíveis</span>
          {presenceDir.inMatchCount > 0 ? ` · ${presenceDir.inMatchCount} em duelo` : ''}
          {presenceDir.inTournamentCount > 0
            ? ` · ${presenceDir.inTournamentCount} em torneio`
            : ''}
        </div>

        <div className="glb-filter-bar" style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="search"
            className="glb-search-input"
            placeholder="Buscar nome ou arquétipo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '6px 10px',
              borderRadius: '7px',
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(148, 163, 184, 0.18)',
              color: '#f8fafc',
              fontSize: '0.76rem',
              width: '215px',
            }}
          />

          <select
            className="glb-filter-select"
            value={divisionFilter}
            onChange={(e) => setDivisionFilter(e.target.value as 'all' | EloDivisionId)}
            aria-label="Filtrar por divisão"
            style={{
              padding: '6px 9px',
              borderRadius: '7px',
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(148, 163, 184, 0.18)',
              color: '#cbd5e1',
              fontSize: '0.76rem',
            }}
          >
            <option value="all">Todas as divisões</option>
            {[...ELO_DIVISIONS].reverse().map((d) => (
              <option key={d.id} value={d.id}>
                {d.shortLabel} ({d.minElo}+)
              </option>
            ))}
          </select>

          <select
            className="glb-filter-select"
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value as 'all' | Domain)}
            aria-label="Filtrar por domínio"
            style={{
              padding: '6px 9px',
              borderRadius: '7px',
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(148, 163, 184, 0.18)',
              color: '#cbd5e1',
              fontSize: '0.76rem',
            }}
          >
            <option value="all">Todos os domínios</option>
            {DOMAIN_OPTIONS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="glb-filter-btn"
            onClick={() => setOnlyAvailableNow((v) => !v)}
            style={{
              padding: '6px 10px',
              borderRadius: '7px',
              background: onlyAvailableNow
                ? 'rgba(16, 185, 129, 0.14)'
                : 'rgba(15, 23, 42, 0.65)',
              border: onlyAvailableNow
                ? '1px solid rgba(16, 185, 129, 0.42)'
                : '1px solid rgba(148, 163, 184, 0.18)',
              color: onlyAvailableNow ? '#6ee7b7' : '#94a3b8',
              fontSize: '0.75rem',
              cursor: 'pointer',
            }}
            title="Mostrar apenas Soberanos online e livres para desafio neste momento"
          >
            Apenas disponíveis
          </button>

          <button
            type="button"
            className="glb-filter-btn"
            onClick={() => setIncludeRegionalCommanders((v) => !v)}
            style={{
              padding: '6px 10px',
              borderRadius: '7px',
              background: !includeRegionalCommanders
                ? 'rgba(255, 255, 255, 0.09)'
                : 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(148, 163, 184, 0.18)',
              color: !includeRegionalCommanders ? '#f8fafc' : '#94a3b8',
              fontSize: '0.75rem',
              cursor: 'pointer',
            }}
            title={`Alternar entre todos os Soberanos ou apenas os ${grandSovereignsCount} Grão-Soberanos`}
          >
            {includeRegionalCommanders
              ? 'Todos os Soberanos'
              : `${grandSovereignsCount} Grão-Soberanos`}
          </button>

          {totalPages > 1 && safePage !== myTargetPage && (
            <button
              type="button"
              className="glb-filter-btn"
              onClick={() => setCurrentPage(myTargetPage)}
              style={{
                padding: '6px 10px',
                borderRadius: '7px',
                background: 'rgba(15, 23, 42, 0.65)',
                border: '1px solid rgba(234, 179, 8, 0.28)',
                color: '#fde047',
                fontSize: '0.75rem',
                cursor: 'pointer',
              }}
              title="Ir para a página da sua faixa atual de ELO"
            >
              Minha posição
            </button>
          )}
        </div>
      </div>

      {/* 4. SINGLE UNIFIED TABLE SURFACE (1px subtle dividers, high data-ink ratio) */}
      <section
        aria-label="Classificação ELO"
        style={{
          borderRadius: '10px',
          background: 'rgba(11, 15, 25, 0.78)',
          border: '1px solid rgba(148, 163, 184, 0.15)',
          overflow: 'hidden',
        }}
      >
        {/* Column Headers */}
        <div
          className="glb-grid-row glb-grid-header"
          style={{
            display: 'grid',
            gridTemplateColumns: '48px minmax(0, 1fr) auto',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.55rem 1rem',
            borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
            fontSize: '0.68rem',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#64748b',
          }}
        >
          <span>#</span>
          <span>Participante</span>
          <div className="glb-right-cols" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <span className="hide-on-mobile" style={{ width: '64px', textAlign: 'center' }}>
              Domínio
            </span>
            <span className="hide-on-mobile" style={{ width: '92px' }}>
              Divisão
            </span>
            <span className="glb-elo-col" style={{ width: '84px', textAlign: 'right' }}>ELO</span>
            <span className="glb-action-col" style={{ width: '88px', textAlign: 'right' }}>Ação</span>
          </div>
        </div>

        {filteredEntries.length === 0 ? (
          <div style={{ padding: '2.2rem 1rem', textAlign: 'center', color: '#64748b', fontSize: '0.84rem' }}>
            Nenhum participante encontrado para os filtros atuais.
          </div>
        ) : (
          <div>
            {pageEntries.map((row: UnifiedLeaderboardEntry, idx: number) => {
              const div = getEloDivisionMeta(row.eloRating);
              const isMe = Boolean(row.isCurrentUser);
              const sov = row.sovereignEntry ?? null;
              const sovPresence = sov ? presenceDir.byId[sov.sovereignId] : undefined;
              const sovRefusalCd = sov ? refusalCooldowns[sov.sovereignId] : undefined;
              const isInvitingThis = Boolean(sov && invitingSovereignId === sov.sovereignId);

              const cleanSubtitle = sov
                ? sovPresence?.status === 'in_match'
                  ? sovPresence.detailLabel
                  : sov.archetypeName
                : row.subtitle;

              const statusDot = sov
                ? sovPresence?.status === 'online_idle' && !sovRefusalCd
                  ? { color: '#10b981', title: 'Disponível para duelo' }
                  : sovPresence?.status === 'in_match' ||
                    sovPresence?.status === 'in_tournament' ||
                    sovRefusalCd
                  ? {
                      color: '#f59e0b',
                      title: sovRefusalCd ? sovRefusalCd.reason : sovPresence?.detailLabel ?? '',
                    }
                  : { color: '#475569', title: 'Ausente no momento' }
                : isMe
                ? { color: '#10b981', title: 'Conectado' }
                : undefined;

              const rankColor =
                row.globalRank === 1
                  ? '#eab308'
                  : row.globalRank === 2
                  ? '#cbd5e1'
                  : row.globalRank === 3
                  ? '#d97706'
                  : '#64748b';

              return (
                <div
                  key={row.entryId}
                  className="glb-grid-row"
                  onClick={() => {
                    if (sov) setDossierSovereign(sov);
                    else if (row.humanProfile) setDossierHuman(row);
                  }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '48px minmax(0, 1fr) auto',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.62rem 1rem',
                    borderBottom:
                      idx < pageEntries.length - 1 || totalPages > 1
                        ? '1px solid rgba(148, 163, 184, 0.08)'
                        : 'none',
                    background: isMe ? 'rgba(234, 179, 8, 0.06)' : 'transparent',
                    cursor: sov || row.humanProfile ? 'pointer' : 'default',
                    transition: 'background 0.12s ease',
                  }}
                  onMouseEnter={(ev) => {
                    if (!isMe) {
                      ev.currentTarget.style.background = 'rgba(255, 255, 255, 0.025)';
                    }
                  }}
                  onMouseLeave={(ev) => {
                    if (!isMe) {
                      ev.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {/* Rank */}
                  <div
                    style={{
                      fontSize: row.globalRank <= 3 ? '0.92rem' : '0.82rem',
                      fontWeight: row.globalRank <= 3 ? 700 : 500,
                      color: rankColor,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {row.globalRank}
                  </div>

                  {/* Identity */}
                  <div className="glb-identity-col" style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', minWidth: 0 }}>
                    {renderPortrait(row.avatarCardId, 36, isMe, statusDot)}
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          minWidth: 0,
                        }}
                      >
                        <span
                          style={{
                            fontSize: '0.88rem',
                            fontWeight: 600,
                            color: isMe ? '#fef08a' : '#f1f5f9',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {row.displayName}
                        </span>
                        {isMe && (
                          <span
                            style={{
                              fontSize: '0.64rem',
                              fontWeight: 600,
                              padding: '1px 5px',
                              borderRadius: '4px',
                              background: 'rgba(234, 179, 8, 0.16)',
                              color: '#fde047',
                              flexShrink: 0,
                            }}
                          >
                            Você
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: sovPresence?.status === 'in_match' ? '#fcd34d' : '#64748b',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          marginTop: '1px',
                        }}
                      >
                        {cleanSubtitle}
                      </div>
                    </div>
                  </div>

                  {/* Right Columns */}
                  <div className="glb-right-cols" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    {/* Clean Geometric Domain Dots */}
                    <div
                      className="hide-on-mobile"
                      style={{
                        width: '64px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                      title={row.domains.map((d) => DOMAIN_META[d]?.name ?? d).join(' · ')}
                    >
                      {row.domains.map((d) => (
                        <span
                          key={d}
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: DOMAIN_META[d]?.color ?? '#94a3b8',
                            opacity: 0.9,
                          }}
                        />
                      ))}
                    </div>

                    {/* Division */}
                    <div
                      className="hide-on-mobile"
                      style={{
                        width: '92px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.76rem',
                        color: '#94a3b8',
                      }}
                    >
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: div.color,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {div.shortLabel}
                      </span>
                    </div>

                    {/* ELO Rating */}
                    <div
                      className="glb-elo-col"
                      style={{
                        width: '84px',
                        textAlign: 'right',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.92rem',
                          fontWeight: 700,
                          color: '#f8fafc',
                          display: 'flex',
                          justifyContent: 'flex-end',
                          alignItems: 'baseline',
                          gap: '4px',
                        }}
                      >
                        {typeof row.recentEloDelta === 'number' && row.recentEloDelta !== 0 && (
                          <span
                            className="glb-elo-delta"
                            style={{
                              fontSize: '0.66rem',
                              fontWeight: 600,
                              color: row.recentEloDelta > 0 ? '#10b981' : '#f87171',
                            }}
                            title="Variação recente nas últimas partidas oficiais"
                          >
                            {row.recentEloDelta > 0
                              ? `+${row.recentEloDelta}`
                              : row.recentEloDelta}
                          </span>
                        )}
                        <span>{row.eloRating}</span>
                      </div>
                      {row.totalGames > 0 && (
                        <div
                          style={{ fontSize: '0.67rem', color: '#64748b' }}
                          title={`Taxa de vitórias: ${Math.round(row.winRate * 100)}% (${row.wins.toLocaleString('pt-BR')} vitórias e ${row.losses.toLocaleString('pt-BR')} derrotas)`}
                        >
                          {Math.round(row.winRate * 100)}% vit.
                        </div>
                      )}
                    </div>

                    {/* Single Action */}
                    <div
                      className="glb-action-col"
                      style={{ width: '96px', display: 'flex', justifyContent: 'flex-end' }}
                      onClick={(ev) => ev.stopPropagation()}
                    >
                      {sov ? (
                        isInvitingThis ? (
                          <button
                            type="button"
                            className="aaa-btn aaa-btn-secondary"
                            disabled
                            style={{ padding: '5px 9px', fontSize: '0.71rem', opacity: 0.8 }}
                          >
                            Convidando...
                          </button>
                        ) : sovPresence?.status === 'in_match' &&
                          sovPresence.liveWatchItem &&
                          onWatchSovereignMatch ? (
                          <button
                            type="button"
                            className="aaa-btn aaa-btn-secondary"
                            style={{
                              padding: '5px 11px',
                              fontSize: '0.73rem',
                              borderColor: 'rgba(245, 158, 11, 0.35)',
                              color: '#fde68a',
                            }}
                            title={sovPresence.detailLabel}
                            onClick={() => onWatchSovereignMatch(sovPresence.liveWatchItem!)}
                          >
                            Assistir
                          </button>
                        ) : sovRefusalCd ? (
                          <span
                            title={sovRefusalCd.reason}
                            style={{
                              fontSize: '0.71rem',
                              color: '#94a3b8',
                              fontVariantNumeric: 'tabular-nums',
                              padding: '5px 4px',
                            }}
                          >
                            Recusou (
                            {Math.max(1, Math.ceil((sovRefusalCd.untilMs - Date.now()) / 60_000))}
                            m)
                          </span>
                        ) : sovPresence?.status === 'online_idle' ? (
                          <button
                            type="button"
                            className="aaa-btn aaa-btn-secondary"
                            disabled={Boolean(invitingSovereignId)}
                            style={{ padding: '5px 11px', fontSize: '0.73rem' }}
                            onClick={() => handleLaunchChallenge(sov)}
                          >
                            Desafiar
                          </button>
                        ) : (
                          <span
                            title={sovPresence?.detailLabel}
                            style={{
                              fontSize: '0.71rem',
                              color:
                                sovPresence?.status === 'in_tournament' ? '#cbd5e1' : '#64748b',
                              padding: '5px 4px',
                            }}
                          >
                            {sovPresence?.status === 'in_tournament' ? 'Em torneio' : 'Ausente'}
                          </span>
                        )
                      ) : isMe ? (
                        <button
                          type="button"
                          className="aaa-btn aaa-btn-secondary"
                          style={{ padding: '5px 11px', fontSize: '0.73rem' }}
                          onClick={() => onOpenAccountModal(isGuest ? 'create' : 'profile')}
                        >
                          {isGuest ? 'Entrar' : 'Perfil'}
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="aaa-btn aaa-btn-secondary"
                          style={{ padding: '5px 11px', fontSize: '0.73rem' }}
                          onClick={onOpenPvpConclave}
                        >
                          Salas 1×1
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {totalPages > 1 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 1rem',
                  background: 'rgba(15, 23, 42, 0.45)',
                  borderTop: '1px solid rgba(148, 163, 184, 0.12)',
                  fontSize: '0.75rem',
                  color: '#94a3b8',
                }}
              >
                <span>
                  Exibindo {(safePage - 1) * PAGE_SIZE + 1}–
                  {Math.min(safePage * PAGE_SIZE, filteredEntries.length)} de{' '}
                  {filteredEntries.length} participantes
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className="aaa-btn aaa-btn-secondary"
                    disabled={safePage <= 1}
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.73rem',
                      opacity: safePage <= 1 ? 0.45 : 1,
                    }}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    Anterior
                  </button>
                  <span style={{ fontVariantNumeric: 'tabular-nums', color: '#cbd5e1' }}>
                    Página {safePage} / {totalPages}
                  </span>
                  <button
                    type="button"
                    className="aaa-btn aaa-btn-secondary"
                    disabled={safePage >= totalPages}
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.73rem',
                      opacity: safePage >= totalPages ? 0.45 : 1,
                    }}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* =====================================================================
          PROGRESSIVE DISCLOSURE MODAL 1: SOVEREIGN PROFILE & MATCHUP GUIDE
          (Opened by clicking any Sovereign row)
          ===================================================================== */}
      {dossierSovereign && (
        <div
          className="modal-backdrop"
          onClick={() => setDossierSovereign(null)}
          style={{ zIndex: 3200 }}
        >
          <div
            className="modal-panel"
            style={{ maxWidth: '620px', width: '94vw', padding: '1.35rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const s = dossierSovereign;
              const standing = standingById.get(s.archetypeId);
              const div = getEloDivisionMeta(s.eloRating);
              const winRatePct = Math.round(s.simulatedWinRate * 100);
              const totalPlayerGames = playerWins + playerLosses;
              const winDelta = calculateFideRankedEloDelta({
                playerElo,
                opponentElo: s.eloRating,
                didWin: true,
                recentOpponentIds: currentUser.recentRankedOpponentIds,
                opponentKey: s.sovereignId,
                totalRankedGamesPlayed: totalPlayerGames,
              }).delta;
              const lossDelta = calculateFideRankedEloDelta({
                playerElo,
                opponentElo: s.eloRating,
                didWin: false,
                recentOpponentIds: currentUser.recentRankedOpponentIds,
                opponentKey: s.sovereignId,
                totalRankedGamesPlayed: totalPlayerGames,
              }).delta;

              return (
                <>
                  {/* Header: Identity, Archetype & Explicit Domain Colors */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '1rem',
                      marginBottom: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                      {renderPortrait(s.avatarCardId, 52, true)}
                      <div>
                        <h3
                          className="font-cinzel"
                          style={{ margin: 0, fontSize: '1.08rem', color: '#f8fafc' }}
                        >
                          {s.sovereignName}
                        </h3>
                        <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '2px' }}>
                          Grimório: {s.archetypeName}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '0.55rem',
                            marginTop: '4px',
                            fontSize: '0.73rem',
                            color: '#94a3b8',
                          }}
                        >
                          {s.domains.map((d) => (
                            <span
                              key={d}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                            >
                              <span
                                style={{
                                  width: '7px',
                                  height: '7px',
                                  borderRadius: '50%',
                                  background: DOMAIN_META[d]?.color ?? '#94a3b8',
                                }}
                              />
                              {DOMAIN_META[d]?.shortName ?? d}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="aaa-btn aaa-btn-secondary"
                      style={{ padding: '4px 9px', fontSize: '0.75rem' }}
                      onClick={() => setDossierSovereign(null)}
                      aria-label="Fechar"
                    >
                      ✕
                    </button>
                  </div>

                  {/* 3 Self-Explanatory Summary Metrics */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(165px, 1fr))',
                      gap: '0.75rem',
                      padding: '0.85rem 0.95rem',
                      borderRadius: '8px',
                      background: 'rgba(15, 23, 42, 0.65)',
                      border: '1px solid rgba(148, 163, 184, 0.14)',
                      marginBottom: '1rem',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '2px' }}>
                        Pontuação no ranking
                      </div>
                      <div
                        style={{
                          fontSize: '1.05rem',
                          fontWeight: 700,
                          color: '#f8fafc',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {s.eloRating} ELO
                      </div>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '0.72rem',
                          color: '#94a3b8',
                          marginTop: '2px',
                        }}
                      >
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: div.color,
                          }}
                        />
                        Divisão {div.shortLabel}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '2px' }}>
                        Aproveitamento
                      </div>
                      <div
                        style={{
                          fontSize: '1.05rem',
                          fontWeight: 700,
                          color: '#f8fafc',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {winRatePct}% de vitórias
                      </div>
                      <div
                        style={{
                          fontSize: '0.72rem',
                          color: '#64748b',
                          marginTop: '2px',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {s.simulatedWins.toLocaleString('pt-BR')} vitórias ·{' '}
                        {s.simulatedLosses.toLocaleString('pt-BR')} derrotas
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '3px' }}>
                        Valendo para o seu ELO
                      </div>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: '#6ee7b7',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        Se vencer: +{winDelta} ELO
                      </div>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: '#fca5a5',
                          marginTop: '2px',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        Se perder: {lossDelta} ELO
                      </div>
                    </div>
                  </div>

                  {/* Single-Perspective Matchup Guide (Player's win chance against this Sovereign) */}
                  {standing && (
                    <div style={{ marginBottom: '1.15rem' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'baseline',
                          flexWrap: 'wrap',
                          gap: '0.4rem',
                          marginBottom: '0.45rem',
                        }}
                      >
                        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#e2e8f0' }}>
                          Como enfrentar este Soberano
                        </span>
                        <span style={{ fontSize: '0.71rem', color: '#64748b' }}>
                          Chance de vitória ao desafiá-lo com cada grimório
                        </span>
                      </div>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
                          gap: '0.65rem',
                        }}
                      >
                        {/* Challenger's Best Decks = Sovereign's Worst Matchups */}
                        <div
                          style={{
                            padding: '0.7rem 0.8rem',
                            borderRadius: '8px',
                            background: 'rgba(15, 23, 42, 0.45)',
                            border: '1px solid rgba(148, 163, 184, 0.12)',
                          }}
                        >
                          <div
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              color: '#6ee7b7',
                              marginBottom: '0.4rem',
                            }}
                          >
                            Melhores escolhas contra ele
                          </div>
                          {standing.worstMatchups.slice(0, 3).map((m) => {
                            const challengerWinPct = Math.max(
                              0,
                              Math.min(100, Math.round((1 - m.winRate) * 100))
                            );
                            return (
                              <div
                                key={m.opponentId}
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  fontSize: '0.76rem',
                                  color: '#cbd5e1',
                                  padding: '3px 0',
                                }}
                              >
                                <span
                                  style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {standingById.get(m.opponentId)?.name ?? m.opponentId}
                                </span>
                                <span
                                  style={{
                                    color: '#6ee7b7',
                                    fontWeight: 600,
                                    fontVariantNumeric: 'tabular-nums',
                                    flexShrink: 0,
                                  }}
                                >
                                  {challengerWinPct}% de vitória
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Challenger's Worst Decks = Sovereign's Best Matchups */}
                        <div
                          style={{
                            padding: '0.7rem 0.8rem',
                            borderRadius: '8px',
                            background: 'rgba(15, 23, 42, 0.45)',
                            border: '1px solid rgba(148, 163, 184, 0.12)',
                          }}
                        >
                          <div
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              color: '#fca5a5',
                              marginBottom: '0.4rem',
                            }}
                          >
                            Grimórios em desvantagem (evite)
                          </div>
                          {standing.bestMatchups.slice(0, 3).map((m) => {
                            const challengerWinPct = Math.max(
                              0,
                              Math.min(100, Math.round((1 - m.winRate) * 100))
                            );
                            return (
                              <div
                                key={m.opponentId}
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  fontSize: '0.76rem',
                                  color: '#cbd5e1',
                                  padding: '3px 0',
                                }}
                              >
                                <span
                                  style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {standingById.get(m.opponentId)?.name ?? m.opponentId}
                                </span>
                                <span
                                  style={{
                                    color: '#fca5a5',
                                    fontWeight: 600,
                                    fontVariantNumeric: 'tabular-nums',
                                    flexShrink: 0,
                                  }}
                                >
                                  {challengerWinPct}% de vitória
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Progressive Disclosure: Recent Official Matches of this Sovereign */}
                  {(() => {
                    const recentSovMatches = getRecentMatchesForSovereign(s.sovereignId, 6);
                    if (recentSovMatches.length === 0) return null;
                    return (
                      <details
                        style={{
                          marginBottom: '0.65rem',
                          borderRadius: '8px',
                          background: 'rgba(15, 23, 42, 0.45)',
                          border: '1px solid rgba(148, 163, 184, 0.12)',
                          padding: '0.55rem 0.8rem',
                        }}
                      >
                        <summary
                          style={{
                            fontSize: '0.76rem',
                            fontWeight: 600,
                            color: '#cbd5e1',
                            cursor: 'pointer',
                            userSelect: 'none',
                          }}
                        >
                          Ver últimas partidas deste Soberano ({recentSovMatches.length} partidas)
                        </summary>
                        <div
                          style={{
                            marginTop: '0.6rem',
                            borderRadius: '6px',
                            border: '1px solid rgba(148, 163, 184, 0.12)',
                            background: 'rgba(11, 15, 25, 0.72)',
                            overflow: 'hidden',
                          }}
                        >
                          {recentSovMatches.map((m, mIdx) => {
                            const sign = m.deltaElo >= 0 ? `+${m.deltaElo}` : `${m.deltaElo}`;
                            return (
                              <div
                                key={m.id}
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  gap: '0.65rem',
                                  padding: '0.5rem 0.7rem',
                                  borderBottom:
                                    mIdx < recentSovMatches.length - 1
                                      ? '1px solid rgba(148, 163, 184, 0.08)'
                                      : 'none',
                                }}
                              >
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.55rem',
                                    minWidth: 0,
                                  }}
                                >
                                  {renderPortrait(m.opponent.avatarCardId, 30, false)}
                                  <div style={{ minWidth: 0 }}>
                                    <div
                                      style={{
                                        fontSize: '0.78rem',
                                        fontWeight: 600,
                                        color: '#f1f5f9',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                      }}
                                    >
                                      vs. {m.opponent.sovereignName}
                                    </div>
                                    <div
                                      style={{
                                        fontSize: '0.69rem',
                                        color: m.didWin ? '#6ee7b7' : '#fca5a5',
                                        fontVariantNumeric: 'tabular-nums',
                                      }}
                                    >
                                      {m.didWin ? 'Vitória' : 'Derrota'} ({sign} ELO) ·{' '}
                                      <span style={{ color: '#64748b' }}>
                                        {formatRelativeTimePt(m.playedAtMs)}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {onWatchSovereignMatch && (
                                  <button
                                    type="button"
                                    className="aaa-btn aaa-btn-secondary"
                                    style={{
                                      padding: '4px 10px',
                                      fontSize: '0.72rem',
                                      flexShrink: 0,
                                    }}
                                    onClick={() => {
                                      setDossierSovereign(null);
                                      onWatchSovereignMatch(m.spectatorItem);
                                    }}
                                  >
                                    Assistir
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </details>
                    );
                  })()}

                  {/* Progressive Disclosure: Signature Cards of this Sovereign's Grimoire */}
                  {(() => {
                    const sigCards = getSignatureCardsForSovereign(s, 8);
                    if (sigCards.length === 0) return null;
                    return (
                      <details
                        style={{
                          marginBottom: '1.1rem',
                          borderRadius: '8px',
                          background: 'rgba(15, 23, 42, 0.45)',
                          border: '1px solid rgba(148, 163, 184, 0.12)',
                          padding: '0.55rem 0.8rem',
                        }}
                      >
                        <summary
                          style={{
                            fontSize: '0.76rem',
                            fontWeight: 600,
                            color: '#cbd5e1',
                            cursor: 'pointer',
                            userSelect: 'none',
                          }}
                        >
                          Ver cartas principais deste grimório ({sigCards.length} cartas)
                        </summary>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(215px, 1fr))',
                            gap: '0.45rem',
                            marginTop: '0.65rem',
                          }}
                        >
                          {sigCards.map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => onInspectCard(c)}
                              title={`Inspecionar carta: ${c.name}`}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.55rem',
                                padding: '5px 8px',
                                borderRadius: '6px',
                                background: 'rgba(11, 15, 25, 0.72)',
                                border: '1px solid rgba(148, 163, 184, 0.14)',
                                color: '#e2e8f0',
                                textAlign: 'left',
                                cursor: 'pointer',
                              }}
                            >
                              {c.imagePath ? (
                                <img
                                  src={c.imagePath}
                                  alt={c.name}
                                  loading="lazy"
                                  style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '4px',
                                    objectFit: 'cover',
                                    flexShrink: 0,
                                  }}
                                />
                              ) : null}
                              <span
                                style={{
                                  flex: 1,
                                  fontSize: '0.74rem',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {c.name}
                              </span>
                              <span
                                style={{
                                  fontSize: '0.7rem',
                                  color: '#94a3b8',
                                  fontVariantNumeric: 'tabular-nums',
                                  flexShrink: 0,
                                }}
                              >
                                Custo {c.cost}
                              </span>
                            </button>
                          ))}
                        </div>
                      </details>
                    );
                  })()}

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                      {(() => {
                        const p = presenceDir.byId[s.sovereignId];
                        const cd = refusalCooldowns[s.sovereignId];
                        if (cd) return cd.reason;
                        return p?.detailLabel ?? 'Disponível para duelo';
                      })()}
                    </span>

                    <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
                      <button
                        type="button"
                        className="aaa-btn aaa-btn-secondary"
                        style={{ padding: '7px 14px', fontSize: '0.78rem' }}
                        onClick={() => setDossierSovereign(null)}
                      >
                        Fechar
                      </button>
                      {(() => {
                        const p = presenceDir.byId[s.sovereignId];
                        const cd = refusalCooldowns[s.sovereignId];
                        const isInvitingModal = invitingSovereignId === s.sovereignId;

                        if (isInvitingModal) {
                          return (
                            <button
                              type="button"
                              className="aaa-btn aaa-btn-primary"
                              disabled
                              style={{ padding: '7px 16px', fontSize: '0.78rem', opacity: 0.8 }}
                            >
                              Convidando...
                            </button>
                          );
                        }
                        if (p?.status === 'in_match' && p.liveWatchItem && onWatchSovereignMatch) {
                          return (
                            <button
                              type="button"
                              className="aaa-btn aaa-btn-primary"
                              style={{ padding: '7px 16px', fontSize: '0.78rem' }}
                              onClick={() => {
                                const targetMatch = p.liveWatchItem!;
                                setDossierSovereign(null);
                                onWatchSovereignMatch(targetMatch);
                              }}
                            >
                              Assistir partida ao vivo
                            </button>
                          );
                        }
                        if (cd) {
                          const mins = Math.max(
                            1,
                            Math.ceil((cd.untilMs - Date.now()) / 60_000)
                          );
                          return (
                            <button
                              type="button"
                              className="aaa-btn aaa-btn-secondary"
                              disabled
                              style={{ padding: '7px 16px', fontSize: '0.76rem', opacity: 0.6 }}
                            >
                              Recusou · aguarde {mins} min
                            </button>
                          );
                        }
                        if (p && p.status !== 'online_idle') {
                          return (
                            <button
                              type="button"
                              className="aaa-btn aaa-btn-secondary"
                              disabled
                              style={{ padding: '7px 16px', fontSize: '0.76rem', opacity: 0.6 }}
                            >
                              {p.status === 'in_tournament' ? 'Em torneio oficial' : 'Ausente agora'}
                            </button>
                          );
                        }
                        return (
                          <button
                            type="button"
                            className="aaa-btn aaa-btn-primary"
                            disabled={Boolean(invitingSovereignId)}
                            style={{ padding: '7px 16px', fontSize: '0.78rem' }}
                            onClick={() => handleLaunchChallenge(s)}
                          >
                            Desafiar ({s.eloRating} ELO)
                          </button>
                        );
                      })()}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* =====================================================================
          PROGRESSIVE DISCLOSURE MODAL 1B: HUMAN PLAYER PROFILE & RECENT MATCHES
          (Opened by clicking any Human Player row)
          ===================================================================== */}
      {dossierHuman && dossierHuman.humanProfile && (
        <div
          className="modal-backdrop"
          onClick={() => setDossierHuman(null)}
          style={{ zIndex: 3200 }}
        >
          <div
            className="modal-panel"
            style={{ maxWidth: '580px', width: '94vw', padding: '1.35rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const h = dossierHuman;
              const hp = h.humanProfile!;
              const div = getEloDivisionMeta(h.eloRating);
              const campaignWins = hp.defeatedBossIds?.length ?? 0;
              const customDeckCount = hp.customDecks?.length ?? 0;

              return (
                <>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '1rem',
                      marginBottom: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                      {renderPortrait(h.avatarCardId, 52, Boolean(h.isCurrentUser))}
                      <div>
                        <h3
                          className="font-cinzel"
                          style={{ margin: 0, fontSize: '1.08rem', color: '#f8fafc' }}
                        >
                          {h.displayName}
                        </h3>
                        <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '2px' }}>
                          {h.subtitle}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="aaa-btn aaa-btn-secondary"
                      style={{ padding: '4px 9px', fontSize: '0.75rem' }}
                      onClick={() => setDossierHuman(null)}
                      aria-label="Fechar"
                    >
                      ✕
                    </button>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))',
                      gap: '0.75rem',
                      padding: '0.85rem 0.95rem',
                      borderRadius: '8px',
                      background: 'rgba(15, 23, 42, 0.65)',
                      border: '1px solid rgba(148, 163, 184, 0.14)',
                      marginBottom: '1rem',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '2px' }}>
                        Pontuação no ranking
                      </div>
                      <div
                        style={{
                          fontSize: '1.05rem',
                          fontWeight: 700,
                          color: '#f8fafc',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {h.eloRating} ELO
                      </div>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '0.72rem',
                          color: '#94a3b8',
                          marginTop: '2px',
                        }}
                      >
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: div.color,
                          }}
                        />
                        #{h.globalRank} · Divisão {div.shortLabel}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '2px' }}>
                        Aproveitamento ranqueado
                      </div>
                      <div
                        style={{
                          fontSize: '1.05rem',
                          fontWeight: 700,
                          color: '#f8fafc',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {h.totalGames > 0
                          ? `${Math.round(h.winRate * 100)}% de vitórias`
                          : 'Em calibração'}
                      </div>
                      <div
                        style={{
                          fontSize: '0.72rem',
                          color: '#64748b',
                          marginTop: '2px',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {h.wins} vitórias · {h.losses} derrotas
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '2px' }}>
                        Jornada em Vaeloria
                      </div>
                      <div
                        style={{
                          fontSize: '1.05rem',
                          fontWeight: 700,
                          color: '#f8fafc',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {campaignWins} {campaignWins === 1 ? 'vitória' : 'vitórias'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                        {customDeckCount} {customDeckCount === 1 ? 'grimório salvo' : 'grimórios salvos'}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.1rem' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        marginBottom: '0.45rem',
                      }}
                    >
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#e2e8f0' }}>
                        Partidas recentes
                      </span>
                      <span style={{ fontSize: '0.71rem', color: '#64748b' }}>
                        {isLoadingHumanMatches
                          ? 'Sincronizando...'
                          : `${humanMatches.length} ${humanMatches.length === 1 ? 'partida' : 'partidas'}`}
                      </span>
                    </div>

                    <div
                      style={{
                        borderRadius: '8px',
                        background: 'rgba(15, 23, 42, 0.45)',
                        border: '1px solid rgba(148, 163, 184, 0.12)',
                        maxHeight: '260px',
                        overflowY: 'auto',
                      }}
                    >
                      {isLoadingHumanMatches ? (
                        <div
                          style={{
                            padding: '1.1rem',
                            textAlign: 'center',
                            fontSize: '0.78rem',
                            color: '#64748b',
                          }}
                        >
                          Carregando histórico de partidas...
                        </div>
                      ) : humanMatches.length === 0 ? (
                        <div
                          style={{
                            padding: '1.1rem',
                            textAlign: 'center',
                            fontSize: '0.78rem',
                            color: '#64748b',
                          }}
                        >
                          Nenhuma partida recente registrada nesta conta.
                        </div>
                      ) : (
                        humanMatches.map((m, idx) => {
                          const canWatch = Boolean(
                            onWatchUserReplay && (m.localReplay || m.shareId)
                          );
                          const outcomeText =
                            m.didWin === true
                              ? 'Vitória'
                              : m.didWin === false
                              ? 'Derrota'
                              : 'Empate';
                          const deltaText =
                            typeof m.deltaElo === 'number'
                              ? ` (${m.deltaElo >= 0 ? `+${m.deltaElo}` : m.deltaElo} ELO)`
                              : '';
                          const isOpening = loadingReplayKey === m.id;

                          return (
                            <div
                              key={m.id}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: '0.7rem',
                                padding: '0.55rem 0.8rem',
                                borderBottom:
                                  idx < humanMatches.length - 1
                                    ? '1px solid rgba(148, 163, 184, 0.08)'
                                    : 'none',
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.6rem',
                                  minWidth: 0,
                                }}
                              >
                                {renderPortrait(m.opponentAvatarCardId, 30, false)}
                                <div style={{ minWidth: 0 }}>
                                  <div
                                    style={{
                                      fontSize: '0.79rem',
                                      fontWeight: 600,
                                      color: '#f1f5f9',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    vs. {m.opponentName}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: '0.69rem',
                                      color:
                                        m.didWin === true
                                          ? '#6ee7b7'
                                          : m.didWin === false
                                          ? '#fca5a5'
                                          : '#cbd5e1',
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                    }}
                                  >
                                    {outcomeText}
                                    {deltaText} ·{' '}
                                    <span style={{ color: '#64748b' }}>{m.modeLabel}</span>
                                  </div>
                                </div>
                              </div>

                              {canWatch ? (
                                <button
                                  type="button"
                                  className="aaa-btn aaa-btn-secondary"
                                  disabled={isOpening}
                                  style={{
                                    padding: '4px 10px',
                                    fontSize: '0.72rem',
                                    flexShrink: 0,
                                  }}
                                  onClick={() =>
                                    void handleOpenUserReplay(m.id, m.localReplay, m.shareId)
                                  }
                                >
                                  {isOpening ? 'Abrindo...' : 'Assistir'}
                                </button>
                              ) : (
                                <span
                                  style={{
                                    fontSize: '0.69rem',
                                    color: '#64748b',
                                    flexShrink: 0,
                                  }}
                                >
                                  {formatRelativeTimePt(m.playedAtMs)}
                                </span>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button
                      type="button"
                      className="aaa-btn aaa-btn-secondary"
                      style={{ padding: '7px 14px', fontSize: '0.78rem' }}
                      onClick={() => setDossierHuman(null)}
                    >
                      Fechar
                    </button>
                    {h.isCurrentUser ? (
                      <button
                        type="button"
                        className="aaa-btn aaa-btn-primary"
                        style={{ padding: '7px 16px', fontSize: '0.78rem' }}
                        onClick={() => {
                          setDossierHuman(null);
                          onOpenAccountModal(isGuest ? 'create' : 'profile');
                        }}
                      >
                        {isGuest ? 'Criar Conta' : 'Meu Perfil'}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="aaa-btn aaa-btn-primary"
                        style={{ padding: '7px 16px', fontSize: '0.78rem' }}
                        onClick={() => {
                          setDossierHuman(null);
                          onOpenPvpConclave();
                        }}
                      >
                        Salas 1×1
                      </button>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* =====================================================================
          PROGRESSIVE DISCLOSURE MODAL 2: DIVISIONS & METHODOLOGY
          ===================================================================== */}
      {showRulesModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowRulesModal(false)}
          style={{ zIndex: 3200 }}
        >
          <div
            className="modal-panel"
            style={{ maxWidth: '540px', width: '94vw', padding: '1.35rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.75rem',
              }}
            >
              <h3 className="font-cinzel" style={{ margin: 0, fontSize: '1.05rem', color: '#f8fafc' }}>
                Divisões & Cálculo de ELO
              </h3>
              <button
                type="button"
                className="aaa-btn aaa-btn-secondary"
                style={{ padding: '4px 9px', fontSize: '0.75rem' }}
                onClick={() => setShowRulesModal(false)}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 0.9rem' }}>
              Todos os Soberanos de Vaeloria compartilham a mesma escala competitiva oficial.
              Novos Soberanos iniciam em <strong style={{ color: '#e2e8f0' }}>{INITIAL_PLAYER_ELO} ELO</strong>{' '}
              (Ferro Axial), com calibração acelerada nas 10 primeiras partidas. Todos os duelos
              ranqueados são disputados em igualdade (40 PV vs 40 PV, grimórios de 100 cartas, sem
              modificadores externos).
            </p>

            <div
              style={{
                borderRadius: '8px',
                border: '1px solid rgba(148, 163, 184, 0.14)',
                overflow: 'hidden',
                marginBottom: '1rem',
              }}
            >
              {[...ELO_DIVISIONS].reverse().map((d, idx) => (
                <div
                  key={d.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.5rem 0.85rem',
                    fontSize: '0.78rem',
                    borderBottom:
                      idx < ELO_DIVISIONS.length - 1
                        ? '1px solid rgba(148, 163, 184, 0.08)'
                        : 'none',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e2e8f0' }}>
                    <span
                      style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        background: d.color,
                      }}
                    />
                    {d.label}
                  </span>
                  <span style={{ color: '#94a3b8', fontVariantNumeric: 'tabular-nums' }}>
                    {d.rangeText}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="aaa-btn aaa-btn-secondary"
                style={{ padding: '6px 14px', fontSize: '0.76rem' }}
                onClick={() => setShowRulesModal(false)}
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          PROGRESSIVE DISCLOSURE MODAL 3: RECENT RANKED MATCH HISTORY
          ===================================================================== */}
      {showHistoryModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowHistoryModal(false)}
          style={{ zIndex: 3200 }}
        >
          <div
            className="modal-panel"
            style={{ maxWidth: '520px', width: '94vw', padding: '1.35rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.85rem',
              }}
            >
              <h3 className="font-cinzel" style={{ margin: 0, fontSize: '1.02rem', color: '#f8fafc' }}>
                Histórico Recente de Duelos Ranqueados
              </h3>
              <button
                type="button"
                className="aaa-btn aaa-btn-secondary"
                style={{ padding: '4px 9px', fontSize: '0.75rem' }}
                onClick={() => setShowHistoryModal(false)}
              >
                ✕
              </button>
            </div>

            <div
              style={{
                borderRadius: '8px',
                border: '1px solid rgba(148, 163, 184, 0.14)',
                overflow: 'hidden',
                marginBottom: '1rem',
              }}
            >
              {(currentUser.recentRankedHistory ?? []).map((h, idx, arr) => {
                const localList = getPersonalMatchHistory();
                const matchedLocal = localList.find(
                  (le) =>
                    (h.replayShareId &&
                      (le.shareId === h.replayShareId ||
                        computePersonalReplayShareId(le) === h.replayShareId)) ||
                    (Math.abs(le.playedAtMs - h.timestamp) <= 35_000 &&
                      le.opponentName.trim().toLowerCase() ===
                        h.opponentName.trim().toLowerCase())
                );
                const canWatch = Boolean(
                  onWatchUserReplay && (matchedLocal || h.replayShareId)
                );
                const isOpening = loadingReplayKey === h.id;

                return (
                  <div
                    key={h.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.55rem 0.85rem',
                      borderBottom:
                        idx < arr.length - 1 ? '1px solid rgba(148, 163, 184, 0.08)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
                      {h.opponentAvatarCardId
                        ? renderPortrait(h.opponentAvatarCardId, 30, false)
                        : null}
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: '#f1f5f9',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {h.opponentName}
                        </div>
                        <div style={{ fontSize: '0.69rem', color: '#64748b' }}>
                          {h.opponentElo} ELO · {h.didWin ? 'Vitória' : 'Derrota'}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          textAlign: 'right',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            color: h.deltaElo >= 0 ? '#6ee7b7' : '#fca5a5',
                          }}
                        >
                          {h.deltaElo >= 0 ? `+${h.deltaElo}` : h.deltaElo} ELO
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{h.newElo} final</div>
                      </div>

                      {canWatch && (
                        <button
                          type="button"
                          className="aaa-btn aaa-btn-secondary"
                          disabled={isOpening}
                          style={{ padding: '4px 10px', fontSize: '0.71rem' }}
                          onClick={() =>
                            void handleOpenUserReplay(h.id, matchedLocal, h.replayShareId)
                          }
                        >
                          {isOpening ? 'Abrindo...' : 'Assistir'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="aaa-btn aaa-btn-secondary"
                style={{ padding: '6px 14px', fontSize: '0.76rem' }}
                onClick={() => setShowHistoryModal(false)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
