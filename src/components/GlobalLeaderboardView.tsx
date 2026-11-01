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
  fetchUnifiedPlatformLeaderboard,
  SovereignSavedDeck,
  SovereignUserProfile,
  UnifiedLeaderboardEntry,
  UnifiedLeaderboardSnapshot,
} from '../utils/multiplayerEngine';
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
}) => {
  const [snapshot, setSnapshot] = useState<UnifiedLeaderboardSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [includeRegionalCommanders, setIncludeRegionalCommanders] = useState<boolean>(true);
  const [divisionFilter, setDivisionFilter] = useState<'all' | EloDivisionId>('all');
  const [domainFilter, setDomainFilter] = useState<'all' | Domain>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dossierSovereign, setDossierSovereign] =
    useState<SovereignAiLeaderboardEntry | null>(null);
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

  const loadLeaderboard = useCallback(async () => {
    setIsLoading(true);
    const snap = await fetchUnifiedPlatformLeaderboard(currentUser, {
      includeRegionalCommanders,
    });
    setSnapshot(snap);
    setIsLoading(false);
  }, [currentUser, includeRegionalCommanders]);

  useEffect(() => {
    void loadLeaderboard();
  }, [loadLeaderboard]);

  useEffect(() => {
    if (!dossierSovereign && !showRulesModal && !showHistoryModal) return;
    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        setDossierSovereign(null);
        setShowRulesModal(false);
        setShowHistoryModal(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [dossierSovereign, showRulesModal, showHistoryModal]);

  const activeDeck = useMemo(
    () => availableDecks.find((d) => d.id === selectedDeckId) ?? availableDecks[0] ?? null,
    [availableDecks, selectedDeckId]
  );

  const handleLaunchChallenge = (entry: SovereignAiLeaderboardEntry) => {
    if (!isGuest && customDecks.length === 0) {
      onOpenDeckBuilder();
      return;
    }
    if (!activeDeck) return;
    onChallengeSovereign(entry, activeDeck.cardIds, activeDeck.id);
  };

  const playerElo = currentUser.eloRating ?? INITIAL_PLAYER_ELO;
  const playerDiv = getEloDivisionMeta(playerElo);
  const playerWins = (currentUser.pvpWins ?? 0) + (currentUser.rankedSovereignWins ?? 0);
  const playerLosses = (currentUser.pvpLosses ?? 0) + (currentUser.rankedSovereignLosses ?? 0);

  const filteredEntries = useMemo(() => {
    if (!snapshot) return [];
    const q = searchQuery.trim().toLowerCase();
    return snapshot.entries.filter((e) => {
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
  }, [snapshot, divisionFilter, domainFilter, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [divisionFilter, domainFilter, searchQuery, includeRegionalCommanders]);

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

  const renderPortrait = (avatarCardId: string, size = 36, highlight = false) => {
    const card = CARDS_BY_ID[avatarCardId];
    return (
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
          flexShrink: 0,
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
    );
  };

  const nextRival = snapshot?.nextSovereignTarget?.sovereignEntry ?? null;
  const nextRivalRank = snapshot?.nextSovereignTarget?.globalRank ?? null;

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
              padding: 0,
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
              style={{ padding: '6px 12px', fontSize: '0.76rem', whiteSpace: 'nowrap' }}
              onClick={() => handleLaunchChallenge(nextRival)}
              title={`Desafiar o próximo colocado acima do seu ELO: ${nextRival.sovereignName} (${nextRival.eloRating} ELO)`}
            >
              Desafiar #{nextRivalRank} ({nextRival.eloRating})
            </button>
          )}
        </div>
      </section>

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
          <strong style={{ color: '#e2e8f0' }}>{filteredEntries.length}</strong> Soberanos
        </div>

        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="search"
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
              width: '185px',
            }}
          />

          <select
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <span className="hide-on-mobile" style={{ width: '64px', textAlign: 'center' }}>
              Domínio
            </span>
            <span className="hide-on-mobile" style={{ width: '92px' }}>
              Divisão
            </span>
            <span style={{ width: '68px', textAlign: 'right' }}>ELO</span>
            <span style={{ width: '88px', textAlign: 'right' }}>Ação</span>
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
              const cleanSubtitle = sov ? sov.archetypeName : row.subtitle;

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
                  onClick={() => {
                    if (sov) setDossierSovereign(sov);
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
                    cursor: sov ? 'pointer' : 'default',
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', minWidth: 0 }}>
                    {renderPortrait(row.avatarCardId, 36, isMe)}
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
                          color: '#64748b',
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
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
                      style={{
                        width: '68px',
                        textAlign: 'right',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc' }}>
                        {row.eloRating}
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
                      style={{ width: '88px', display: 'flex', justifyContent: 'flex-end' }}
                      onClick={(ev) => ev.stopPropagation()}
                    >
                      {sov ? (
                        <button
                          type="button"
                          className="aaa-btn aaa-btn-secondary"
                          style={{ padding: '5px 11px', fontSize: '0.73rem' }}
                          onClick={() => handleLaunchChallenge(sov)}
                        >
                          Desafiar
                        </button>
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

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button
                      type="button"
                      className="aaa-btn aaa-btn-secondary"
                      style={{ padding: '7px 14px', fontSize: '0.78rem' }}
                      onClick={() => setDossierSovereign(null)}
                    >
                      Fechar
                    </button>
                    <button
                      type="button"
                      className="aaa-btn aaa-btn-primary"
                      style={{ padding: '7px 16px', fontSize: '0.78rem' }}
                      onClick={() => {
                        const target = s;
                        setDossierSovereign(null);
                        handleLaunchChallenge(target);
                      }}
                    >
                      Desafiar ({s.eloRating} ELO)
                    </button>
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
              {(currentUser.recentRankedHistory ?? []).map((h, idx, arr) => (
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
                      textAlign: 'right',
                      fontVariantNumeric: 'tabular-nums',
                      flexShrink: 0,
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
                </div>
              ))}
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
