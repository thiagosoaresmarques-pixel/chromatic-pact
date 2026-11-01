import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AI_SKILL_TIER_SPECS } from '../data/aiMonocolorMastery';
import { getUnifiedStandingForDeckId } from '../data/aiUnifiedTournament';
import {
  UNIFIED_CHAMPION_STANDINGS,
  UnifiedFormatKind,
} from '../data/aiUnifiedTournamentData';
import { CARDS_BY_ID } from '../data/cards';
import { PREBUILT_DECKS } from '../data/decks';
import {
  ARCHETYPE_TIER_ELO_MAP,
  calculateFideRankedEloDelta,
  ELO_DIVISIONS,
  EloDivisionId,
  getEloDivisionMeta,
  getEloDivisionProgressPct,
  SOVEREIGN_ELO_CALIBRATION_SUMMARY,
  SovereignAiLeaderboardEntry,
} from '../data/sovereignEloLadder';
import { AiSkillTier, CardDefinition, Domain } from '../types/game';
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

type LeaderboardTabScope = 'all' | 'humans' | 'sovereigns';

const FORMAT_LABELS: Record<UnifiedFormatKind, string> = {
  monocolor: 'Monocolor',
  bicolor: 'Bicolor',
  tricolor: 'Tricolor',
  pentachromatic: 'Pentacromático',
};

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
  const [scopeTab, setScopeTab] = useState<LeaderboardTabScope>('all');
  const [includeRegionalCommanders, setIncludeRegionalCommanders] = useState<boolean>(true);
  const [divisionFilter, setDivisionFilter] = useState<'all' | EloDivisionId>('all');
  const [domainFilter, setDomainFilter] = useState<'all' | Domain>('all');
  const [tierFilter, setTierFilter] = useState<'all' | AiSkillTier>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [oracleModalSovereign, setOracleModalSovereign] =
    useState<SovereignAiLeaderboardEntry | null>(null);

  // Build available 100-card decks for Ranked Challenge
  const availableDecks = useMemo(() => {
    const list: Array<{ id: string; label: string; cardIds: string[]; isCustom: boolean }> = [];
    for (const d of customDecks) {
      if (d.cardIds && d.cardIds.length >= 100) {
        list.push({
          id: d.id,
          label: `📖 ${d.name} (${d.wins ?? 0}V/${d.losses ?? 0}D)`,
          cardIds: d.cardIds,
          isCustom: true,
        });
      }
    }
    if (list.length === 0) {
      // Allow testing or starter prebuilts if guest or before saving custom deck
      for (const pb of PREBUILT_DECKS.slice(0, 12)) {
        list.push({
          id: pb.id,
          label: `⚔️ ${pb.name} (${pb.subtitle})`,
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

  const playerElo = currentUser.eloRating ?? 1200;
  const playerDiv = getEloDivisionMeta(playerElo);
  const playerDivPct = getEloDivisionProgressPct(playerElo);
  const playerWins = (currentUser.pvpWins ?? 0) + (currentUser.rankedSovereignWins ?? 0);
  const playerLosses = (currentUser.pvpLosses ?? 0) + (currentUser.rankedSovereignLosses ?? 0);

  const filteredEntries = useMemo(() => {
    if (!snapshot) return [];
    const q = searchQuery.trim().toLowerCase();
    return snapshot.entries.filter((e) => {
      if (scopeTab === 'humans' && e.kind !== 'human') return false;
      if (scopeTab === 'sovereigns' && e.kind !== 'sovereign_ai') return false;
      if (divisionFilter !== 'all' && getEloDivisionMeta(e.eloRating).id !== divisionFilter) {
        return false;
      }
      if (domainFilter !== 'all' && !e.domains.includes(domainFilter)) return false;
      if (tierFilter !== 'all') {
        if (e.kind !== 'sovereign_ai' || e.skillTier !== tierFilter) return false;
      }
      if (q) {
        const hay = `${e.displayName} ${e.subtitle} ${e.realmOrOrigin}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [snapshot, scopeTab, divisionFilter, domainFilter, tierFilter, searchQuery]);

  const podiumTop3 = useMemo(() => {
    if (!snapshot) return [];
    const base = snapshot.entries.filter((e) => {
      if (scopeTab === 'humans') return e.kind === 'human';
      if (scopeTab === 'sovereigns') return e.kind === 'sovereign_ai';
      return true;
    });
    return base.slice(0, 3);
  }, [snapshot, scopeTab]);

  const standingById = useMemo(() => {
    const map = new Map<string, (typeof UNIFIED_CHAMPION_STANDINGS)[number]>();
    for (const s of UNIFIED_CHAMPION_STANDINGS) {
      map.set(s.archetypeId, s);
    }
    return map;
  }, []);

  const renderAvatarThumb = (avatarCardId: string, size = 44, borderColor = '#d4af37') => {
    const card = CARDS_BY_ID[avatarCardId];
    return (
      <button
        type="button"
        onClick={() => card && onInspectCard(card)}
        title={card ? `Inspecionar Carta Avatar: ${card.name}` : 'Avatar do Soberano'}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          overflow: 'hidden',
          border: `2px solid ${borderColor}`,
          background: 'rgba(15, 23, 42, 0.95)',
          padding: 0,
          cursor: card ? 'pointer' : 'default',
          flexShrink: 0,
          boxShadow: '0 4px 12px rgba(0,0,0,0.65)',
        }}
      >
        {card?.imagePath ? (
          <img
            src={card.imagePath}
            alt={card.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <span style={{ fontSize: `${Math.round(size * 0.45)}px` }}>👑</span>
        )}
      </button>
    );
  };

  return (
    <div
      className="aaa-page-shell"
      style={{ maxWidth: '1260px', margin: '0 auto', padding: '1rem 1rem 3rem' }}
    >
      {/* =====================================================================
          1. HERO HEADER & CALIBRATION METRICS
          ===================================================================== */}
      <section
        style={{
          borderRadius: '14px',
          padding: '1.15rem 1.3rem',
          marginBottom: '1rem',
          background:
            'radial-gradient(circle at top right, rgba(234, 179, 8, 0.16), transparent 55%), linear-gradient(145deg, rgba(10, 15, 30, 0.96), rgba(17, 24, 39, 0.94))',
          border: '1px solid rgba(212, 175, 55, 0.45)',
          boxShadow: '0 14px 34px rgba(0, 0, 0, 0.65)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '0.85rem',
          }}
        >
          <div>
            <div
              className="font-cinzel"
              style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                letterSpacing: '0.14em',
                color: '#fde047',
                marginBottom: '0.25rem',
              }}
            >
              🏆 ESCADA COMPETITIVA UNIFICADA • MODELO FIDE / BRADLEY-TERRY
            </div>
            <h1
              className="font-cinzel gold-gradient-text"
              style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.8rem)', margin: 0 }}
            >
              Ranking Geral ELO de Vaeloria
            </h1>
            <p
              style={{
                margin: '0.35rem 0 0',
                fontSize: '0.83rem',
                color: '#cbd5e1',
                maxWidth: '780px',
                lineHeight: 1.45,
              }}
            >
              Usuários reais sincronizados na nuvem e os Soberanos de Vaeloria dividem a mesma
              tabela ELO oficial — calibrada em{' '}
              <strong style={{ color: '#fde68a' }}>
                {(
                  SOVEREIGN_ELO_CALIBRATION_SUMMARY.totalCalibrationMatches + 27984
                ).toLocaleString('pt-BR')}{' '}
                duelos neurais multi-tier
              </strong>{' '}
              com mediana do <strong>Tier II Regular ancorada em 1200 ELO</strong>.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span
              style={{
                padding: '5px 10px',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: 700,
                background: snapshot?.isCloudConnected
                  ? 'rgba(16, 185, 129, 0.16)'
                  : 'rgba(234, 179, 8, 0.16)',
                border: snapshot?.isCloudConnected
                  ? '1px solid rgba(52, 211, 153, 0.5)'
                  : '1px solid rgba(250, 204, 21, 0.45)',
                color: snapshot?.isCloudConnected ? '#6ee7b7' : '#fde047',
              }}
            >
              {snapshot?.isCloudConnected
                ? `🟢 Nuvem Ativa (${snapshot.latencyMs}ms)`
                : '🟡 Ranking Local + IA'}
            </span>
            <button
              type="button"
              className="aaa-btn aaa-btn-secondary"
              onClick={() => void loadLeaderboard()}
              disabled={isLoading}
            >
              {isLoading ? '⏳ Atualizando...' : '🔄 Atualizar Ranking'}
            </button>
            <button
              type="button"
              className="aaa-btn aaa-btn-primary"
              onClick={onOpenPvpConclave}
              title="Salas 1×1 ao vivo entre humanos valem K=32 pontos FIDE"
            >
              🌐 Conclave 1×1 (K=32)
            </button>
          </div>
        </div>

        {/* Empirical Tier I-V ELO Reference Curve */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))',
            gap: '0.5rem',
            marginTop: '0.9rem',
            paddingTop: '0.8rem',
            borderTop: '1px solid rgba(148, 163, 184, 0.18)',
          }}
        >
          {([1, 2, 3, 4, 5] as AiSkillTier[]).map((tier) => {
            const dist = SOVEREIGN_ELO_CALIBRATION_SUMMARY.tierEloDistribution[tier];
            const spec = AI_SKILL_TIER_SPECS[tier];
            const divMeta = getEloDivisionMeta(dist.medianElo);
            return (
              <div
                key={tier}
                style={{
                  padding: '0.45rem 0.65rem',
                  borderRadius: '8px',
                  background: 'rgba(2, 6, 23, 0.65)',
                  border: `1px solid ${divMeta.borderRgba}`,
                  fontSize: '0.72rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: 800,
                    color: divMeta.color,
                  }}
                >
                  <span>🧠 {spec.shortLabel}</span>
                  <span>~{dist.medianElo} ELO</span>
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.65rem', marginTop: '2px' }}>
                  Faixa empírica: {dist.minElo}–{dist.maxElo} ELO
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =====================================================================
          2. POST-RANKED-MATCH ELO DELTA CALLOUT (IF RETURNING FROM ARENA)
          ===================================================================== */}
      {lastRankedResult && (
        <div
          style={{
            padding: '0.8rem 1.05rem',
            marginBottom: '0.95rem',
            borderRadius: '11px',
            background: lastRankedResult.didWin
              ? 'linear-gradient(135deg, rgba(6, 78, 59, 0.72), rgba(15, 23, 42, 0.94))'
              : 'linear-gradient(135deg, rgba(127, 29, 29, 0.68), rgba(15, 23, 42, 0.94))',
            border: lastRankedResult.didWin
              ? '1px solid rgba(52, 211, 153, 0.65)'
              : '1px solid rgba(248, 113, 113, 0.58)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.6rem',
          }}
        >
          <div style={{ fontSize: '0.84rem', color: '#f8fafc' }}>
            <strong
              className="font-cinzel"
              style={{
                color: lastRankedResult.didWin ? '#6ee7b7' : '#fca5a5',
                marginRight: '0.45rem',
              }}
            >
              {lastRankedResult.didWin ? '🏆 VITÓRIA RANQUEADA!' : '⚔️ DUELO RANQUEADO CONCLUÍDO:'}
            </strong>
            Contra <strong>{lastRankedResult.opponentName}</strong> ({lastRankedResult.opponentElo}{' '}
            ELO) • Rating:{' '}
            <strong>
              {lastRankedResult.previousElo} ➔ {lastRankedResult.newElo} ELO (
              {lastRankedResult.deltaElo >= 0
                ? `+${lastRankedResult.deltaElo}`
                : lastRankedResult.deltaElo}
              )
            </strong>
          </div>
          <span
            style={{
              padding: '3px 10px',
              borderRadius: '999px',
              fontSize: '0.72rem',
              fontWeight: 800,
              color: getEloDivisionMeta(lastRankedResult.newElo).color,
              border: `1px solid ${getEloDivisionMeta(lastRankedResult.newElo).borderRgba}`,
              background: getEloDivisionMeta(lastRankedResult.newElo).bgRgba,
            }}
          >
            {getEloDivisionMeta(lastRankedResult.newElo).icon}{' '}
            {getEloDivisionMeta(lastRankedResult.newElo).label}
          </span>
        </div>
      )}

      {/* =====================================================================
          3. YOUR SOVEREIGN STANDING + DECK SELECTOR + NEXT TARGET RIVAL
          ===================================================================== */}
      <section
        style={{
          borderRadius: '12px',
          padding: '0.95rem 1.15rem',
          marginBottom: '1.1rem',
          background:
            'linear-gradient(135deg, rgba(30, 41, 59, 0.92), rgba(15, 23, 42, 0.96))',
          border: `1.5px solid ${playerDiv.borderRgba}`,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '0.95rem',
            alignItems: 'center',
          }}
        >
          {/* Left: Current Player Standing */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            {renderAvatarThumb(
              currentUser.avatarCardId || 'neutral_10_valkyra_pentacromatica',
              54,
              playerDiv.color
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <strong className="font-cinzel" style={{ fontSize: '1rem', color: '#f8fafc' }}>
                  {isGuest ? 'Visitante (Sem Conta)' : currentUser.username}
                </strong>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '999px',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    color: playerDiv.color,
                    background: playerDiv.bgRgba,
                    border: `1px solid ${playerDiv.borderRgba}`,
                  }}
                >
                  {playerDiv.icon} {playerDiv.label}
                </span>
              </div>

              <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '3px' }}>
                <strong style={{ color: '#fde047', fontSize: '0.92rem' }}>{playerElo} ELO</strong>
                {snapshot?.currentUserEntry && (
                  <>
                    {' '}
                    • Posição Geral <strong>#{snapshot.currentUserEntry.globalRank}</strong> (
                    <strong>#{snapshot.currentUserEntry.categoryRank}</strong> entre Humanos)
                  </>
                )}
                {' • '}
                <span>
                  {playerWins}V / {playerLosses}D
                </span>
              </div>

              {/* Progress to next division */}
              <div style={{ marginTop: '5px' }}>
                <div
                  style={{
                    height: '5px',
                    borderRadius: '999px',
                    background: 'rgba(15, 23, 42, 0.9)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${playerDivPct}%`,
                      height: '100%',
                      background: playerDiv.color,
                    }}
                  />
                </div>
                <div style={{ fontSize: '0.64rem', color: '#94a3b8', marginTop: '2px' }}>
                  {playerDiv.nextThreshold
                    ? `Próxima Liga aos ${playerDiv.nextThreshold} ELO (faltam +${Math.max(
                        1,
                        playerDiv.nextThreshold - playerElo
                      )} pts)`
                    : 'Liga Ápice Alcançada (2000+ ELO)'}
                </div>
              </div>
            </div>
          </div>

          {/* Center: Deck Selection for Fair 40v40 Ranked Duel */}
          <div>
            <label
              htmlFor="ranked-deck-select"
              style={{
                display: 'block',
                fontSize: '0.68rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                color: '#fde68a',
                marginBottom: '4px',
              }}
            >
              ⚔️ SEU GRIMÓRIO PARA DUELO RANQUEADO (40❤️ VS 40❤️ JUSTO)
            </label>
            <select
              id="ranked-deck-select"
              value={selectedDeckId}
              onChange={(e) => setSelectedDeckId(e.target.value)}
              style={{
                width: '100%',
                padding: '0.48rem 0.65rem',
                borderRadius: '8px',
                background: 'rgba(2, 6, 23, 0.88)',
                border: '1px solid rgba(212, 175, 55, 0.45)',
                color: '#f8fafc',
                fontSize: '0.78rem',
                fontWeight: 600,
              }}
            >
              {availableDecks.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>
            {isGuest && (
              <div style={{ marginTop: '5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.68rem', color: '#fde047' }}>
                  ✨ Crie sua conta gratuita para gravar seu ELO na nuvem!
                </span>
                <button
                  type="button"
                  className="aaa-btn aaa-btn-primary"
                  style={{ padding: '2px 9px', fontSize: '0.68rem' }}
                  onClick={() => onOpenAccountModal('create')}
                >
                  Criar Conta (+160🪙)
                </button>
              </div>
            )}
          </div>

          {/* Right: Next Sovereign Rival Above You */}
          {snapshot?.nextSovereignTarget?.sovereignEntry && (
            <div
              style={{
                padding: '0.65rem 0.8rem',
                borderRadius: '10px',
                background: 'rgba(2, 6, 23, 0.72)',
                border: '1px solid rgba(250, 204, 21, 0.4)',
              }}
            >
              <div
                style={{
                  fontSize: '0.64rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  color: '#fde047',
                }}
              >
                🎯 PRÓXIMO SOBERANO NA SUA MIRA (#{snapshot.nextSovereignTarget.globalRank})
              </div>
              <div
                style={{
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  color: '#f8fafc',
                  marginTop: '2px',
                }}
              >
                {snapshot.nextSovereignTarget.displayName} (
                {snapshot.nextSovereignTarget.eloRating} ELO)
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '6px' }}>
                {snapshot.nextSovereignTarget.eloRating > playerElo
                  ? `Faltam +${snapshot.nextSovereignTarget.eloRating - playerElo} pts para ultrapassá-lo`
                  : 'Rival do Topo da Escada'}
              </div>
              <button
                type="button"
                className="aaa-btn aaa-btn-primary"
                style={{ width: '100%', padding: '0.38rem 0.7rem', fontSize: '0.76rem' }}
                onClick={() =>
                  snapshot.nextSovereignTarget?.sovereignEntry &&
                  handleLaunchChallenge(snapshot.nextSovereignTarget.sovereignEntry)
                }
              >
                ⚔️ Desafiar {snapshot.nextSovereignTarget.displayName.split(/[, ]+/)[0]} pelo ELO
              </button>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================================
          4. ILLUSTRATED TOP 3 PODIUM
          ===================================================================== */}
      {podiumTop3.length > 0 && (
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '0.8rem',
            marginBottom: '1.1rem',
          }}
        >
          {podiumTop3.map((p, idx) => {
            const medal = idx === 0 ? '🥇 #1' : idx === 1 ? '🥈 #2' : '🥉 #3';
            const accent = idx === 0 ? '#fde047' : idx === 1 ? '#e2e8f0' : '#f59e0b';
            const div = getEloDivisionMeta(p.eloRating);
            return (
              <div
                key={p.entryId}
                style={{
                  padding: '0.9rem 1rem',
                  borderRadius: '12px',
                  background:
                    idx === 0
                      ? 'radial-gradient(circle at top, rgba(250, 204, 21, 0.18), rgba(15, 23, 42, 0.96) 70%)'
                      : 'linear-gradient(145deg, rgba(15, 23, 42, 0.94), rgba(30, 41, 59, 0.88))',
                  border: `1.5px solid ${accent}88`,
                  boxShadow: '0 10px 24px rgba(0, 0, 0, 0.55)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.6rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {renderAvatarThumb(p.avatarCardId, 56, accent)}
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span
                        className="font-cinzel"
                        style={{ fontSize: '0.76rem', fontWeight: 900, color: accent }}
                      >
                        {medal} • {p.kind === 'human' ? '👤 JOGADOR' : '👑 SOBERANO IA'}
                      </span>
                      <span
                        style={{
                          fontSize: '0.92rem',
                          fontWeight: 900,
                          color: '#fde047',
                        }}
                      >
                        {p.eloRating} ELO
                      </span>
                    </div>
                    <div
                      className="font-cinzel"
                      style={{
                        fontSize: '0.95rem',
                        fontWeight: 800,
                        color: '#f8fafc',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {p.displayName}
                    </div>
                    <div
                      style={{
                        fontSize: '0.7rem',
                        color: '#cbd5e1',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {p.subtitle}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '6px',
                    flexWrap: 'wrap',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      color: div.color,
                    }}
                  >
                    {div.icon} {div.shortLabel} • {(p.winRate * 100).toFixed(1)}% WR
                  </span>
                  {p.sovereignEntry && (
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button
                        type="button"
                        className="aaa-btn aaa-btn-secondary"
                        style={{ padding: '3px 8px', fontSize: '0.68rem' }}
                        onClick={() => setOracleModalSovereign(p.sovereignEntry!)}
                      >
                        📊 Oráculo
                      </button>
                      <button
                        type="button"
                        className="aaa-btn aaa-btn-primary"
                        style={{ padding: '3px 10px', fontSize: '0.7rem' }}
                        onClick={() => handleLaunchChallenge(p.sovereignEntry!)}
                      >
                        ⚔️ Desafiar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* =====================================================================
          5. SCOPE TABS & FILTER BAR
          ===================================================================== */}
      <section
        style={{
          padding: '0.8rem 0.95rem',
          borderRadius: '11px',
          marginBottom: '0.9rem',
          background: 'rgba(15, 23, 42, 0.9)',
          border: '1px solid rgba(148, 163, 184, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`section-subnav-pill ${scopeTab === 'all' ? 'is-active' : ''}`}
              onClick={() => setScopeTab('all')}
            >
              🌐 Geral ({snapshot?.entries.length ?? 0})
            </button>
            <button
              type="button"
              className={`section-subnav-pill ${scopeTab === 'humans' ? 'is-active' : ''}`}
              onClick={() => setScopeTab('humans')}
            >
              👤 Usuários da Plataforma ({snapshot?.humanCount ?? 0})
            </button>
            <button
              type="button"
              className={`section-subnav-pill ${scopeTab === 'sovereigns' ? 'is-active' : ''}`}
              onClick={() => setScopeTab('sovereigns')}
            >
              👑 Soberanos IA ({snapshot?.sovereignCount ?? 0})
            </button>
          </div>

          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.74rem',
              color: '#cbd5e1',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={includeRegionalCommanders}
              onChange={(e) => setIncludeRegionalCommanders(e.target.checked)}
            />
            <span>Incluir Comandantes Regionais (Tiers I–IV) na escada</span>
          </label>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(165px, 1fr))',
            gap: '0.5rem',
          }}
        >
          <input
            type="search"
            placeholder="🔍 Buscar jogador, Soberano, arquétipo ou reino..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '0.42rem 0.65rem',
              borderRadius: '7px',
              background: 'rgba(2, 6, 23, 0.85)',
              border: '1px solid rgba(148, 163, 184, 0.35)',
              color: '#f8fafc',
              fontSize: '0.76rem',
            }}
          />

          <select
            value={divisionFilter}
            onChange={(e) => setDivisionFilter(e.target.value as 'all' | EloDivisionId)}
            style={{
              padding: '0.42rem 0.6rem',
              borderRadius: '7px',
              background: 'rgba(2, 6, 23, 0.85)',
              border: '1px solid rgba(148, 163, 184, 0.35)',
              color: '#f8fafc',
              fontSize: '0.76rem',
            }}
          >
            <option value="all">🏅 Todas as 7 Divisões ELO</option>
            {ELO_DIVISIONS.slice()
              .reverse()
              .map((d) => (
                <option key={d.id} value={d.id}>
                  {d.icon} {d.label} ({d.rangeText})
                </option>
              ))}
          </select>

          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value as 'all' | Domain)}
            style={{
              padding: '0.42rem 0.6rem',
              borderRadius: '7px',
              background: 'rgba(2, 6, 23, 0.85)',
              border: '1px solid rgba(148, 163, 184, 0.35)',
              color: '#f8fafc',
              fontSize: '0.76rem',
            }}
          >
            <option value="all">🎨 Todos os Domínios</option>
            {(['red', 'blue', 'purple', 'green', 'gold', 'neutral'] as Domain[]).map((dom) => (
              <option key={dom} value={dom}>
                {DOMAIN_META[dom].icon} {DOMAIN_META[dom].name}
              </option>
            ))}
          </select>

          <select
            value={tierFilter === 'all' ? 'all' : String(tierFilter)}
            onChange={(e) =>
              setTierFilter(
                e.target.value === 'all' ? 'all' : (Number(e.target.value) as AiSkillTier)
              )
            }
            style={{
              padding: '0.42rem 0.6rem',
              borderRadius: '7px',
              background: 'rgba(2, 6, 23, 0.85)',
              border: '1px solid rgba(148, 163, 184, 0.35)',
              color: '#f8fafc',
              fontSize: '0.76rem',
            }}
          >
            <option value="all">🧠 Todos os Graus IA (I–V)</option>
            <option value="5">👑 Tier V • Grão-Mestres (44)</option>
            <option value="4">⚔️ Tier IV • Arcontes</option>
            <option value="3">🛡️ Tier III • Marechais</option>
            <option value="2">🎖️ Tier II • Capitães (1200 ELO)</option>
            <option value="1">🧭 Tier I • Batedores</option>
          </select>
        </div>
      </section>

      {/* =====================================================================
          6. UNIFIED LEADERBOARD LIST
          ===================================================================== */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {filteredEntries.length === 0 ? (
          <div
            style={{
              padding: '2rem',
              textAlign: 'center',
              borderRadius: '12px',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(148, 163, 184, 0.25)',
              color: '#94a3b8',
            }}
          >
            Nenhum participante encontrado para os filtros selecionados.
          </div>
        ) : (
          filteredEntries.map((row: UnifiedLeaderboardEntry) => {
            const div = getEloDivisionMeta(row.eloRating);
            const isHuman = row.kind === 'human';
            const sov = row.sovereignEntry;
            const winCalc = sov
              ? calculateFideRankedEloDelta({
                  playerElo,
                  opponentElo: sov.eloRating,
                  didWin: true,
                  recentOpponentIds: currentUser.recentRankedOpponentIds,
                  opponentKey: sov.sovereignId,
                })
              : null;
            const lossCalc = sov
              ? calculateFideRankedEloDelta({
                  playerElo,
                  opponentElo: sov.eloRating,
                  didWin: false,
                  recentOpponentIds: currentUser.recentRankedOpponentIds,
                  opponentKey: sov.sovereignId,
                })
              : null;

            return (
              <div
                key={row.entryId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  padding: '0.7rem 0.95rem',
                  borderRadius: '10px',
                  background: row.isCurrentUser
                    ? 'linear-gradient(135deg, rgba(234, 179, 8, 0.2), rgba(15, 23, 42, 0.95))'
                    : isHuman
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.09), rgba(15, 23, 42, 0.92))'
                    : 'rgba(15, 23, 42, 0.86)',
                  border: row.isCurrentUser
                    ? '1.5px solid rgba(250, 204, 21, 0.8)'
                    : isHuman
                    ? '1px solid rgba(52, 211, 153, 0.35)'
                    : '1px solid rgba(148, 163, 184, 0.2)',
                }}
              >
                {/* Left: Rank + Avatar + Identity */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    flex: '1 1 320px',
                    minWidth: 0,
                  }}
                >
                  <div
                    className="font-cinzel"
                    style={{
                      minWidth: '46px',
                      textAlign: 'center',
                      fontWeight: 900,
                      fontSize: row.globalRank <= 3 ? '1rem' : '0.88rem',
                      color:
                        row.globalRank === 1
                          ? '#fde047'
                          : row.globalRank === 2
                          ? '#e2e8f0'
                          : row.globalRank === 3
                          ? '#f59e0b'
                          : '#94a3b8',
                    }}
                  >
                    #{row.globalRank}
                  </div>

                  {renderAvatarThumb(row.avatarCardId, 44, div.color)}

                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <strong
                        className="font-cinzel"
                        style={{ fontSize: '0.92rem', color: '#f8fafc' }}
                      >
                        {row.isAdmin ? '👑 ' : ''}
                        {row.displayName}
                      </strong>

                      <span
                        style={{
                          padding: '1px 7px',
                          borderRadius: '999px',
                          fontSize: '0.62rem',
                          fontWeight: 800,
                          background: isHuman
                            ? 'rgba(16, 185, 129, 0.2)'
                            : row.isGrandSovereign
                            ? 'rgba(250, 204, 21, 0.18)'
                            : 'rgba(148, 163, 184, 0.18)',
                          color: isHuman
                            ? '#6ee7b7'
                            : row.isGrandSovereign
                            ? '#fde047'
                            : '#cbd5e1',
                          border: isHuman
                            ? '1px solid rgba(52, 211, 153, 0.45)'
                            : '1px solid rgba(250, 204, 21, 0.35)',
                        }}
                      >
                        {isHuman
                          ? row.isCurrentUser
                            ? '👤 VOCÊ'
                            : '👤 JOGADOR'
                          : `🧠 T${AI_SKILL_TIER_SPECS[row.skillTier ?? 5].roman} • ${
                              row.isGrandSovereign ? 'SOBERANO' : 'COMANDANTE'
                            }`}
                      </span>

                      <span style={{ fontSize: '0.74rem' }}>
                        {row.domains.map((d) => DOMAIN_META[d].icon).join('')}
                      </span>
                    </div>

                    <div
                      style={{
                        fontSize: '0.73rem',
                        color: '#cbd5e1',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {row.subtitle} • <span style={{ color: '#94a3b8' }}>{row.realmOrOrigin}</span>
                    </div>
                  </div>
                </div>

                {/* Middle: Division + ELO + Record */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <span
                    style={{
                      padding: '3px 9px',
                      borderRadius: '999px',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      color: div.color,
                      background: div.bgRgba,
                      border: `1px solid ${div.borderRgba}`,
                    }}
                  >
                    {div.icon} {div.shortLabel}
                  </span>

                  <div style={{ textAlign: 'right', minWidth: '88px' }}>
                    <div
                      style={{
                        fontSize: '0.98rem',
                        fontWeight: 900,
                        color: '#fde047',
                      }}
                    >
                      {row.eloRating} <span style={{ fontSize: '0.68rem' }}>ELO</span>
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                      {row.totalGames > 0
                        ? `${(row.winRate * 100).toFixed(1)}% WR (${row.wins}V/${row.losses}D)`
                        : 'Sem duelos ranqueados'}
                    </div>
                  </div>

                  {/* Right Actions */}
                  {sov ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {winCalc && lossCalc && (
                        <span
                          className="hide-on-mobile"
                          style={{
                            fontSize: '0.65rem',
                            color: '#cbd5e1',
                            padding: '2px 7px',
                            borderRadius: '6px',
                            background: 'rgba(2, 6, 23, 0.7)',
                            border: '1px solid rgba(148, 163, 184, 0.22)',
                          }}
                          title={`Cálculo FIDE em duelo 40❤️ vs 40❤️ (K=${winCalc.kFactorUsed})`}
                        >
                          <strong style={{ color: '#6ee7b7' }}>+{winCalc.delta}</strong> /{' '}
                          <strong style={{ color: '#fca5a5' }}>{lossCalc.delta}</strong>
                        </span>
                      )}
                      <button
                        type="button"
                        className="aaa-btn aaa-btn-secondary"
                        style={{ padding: '4px 9px', fontSize: '0.7rem' }}
                        onClick={() => setOracleModalSovereign(sov)}
                        title="Inspecionar Matchups e Escada Tier I–V deste Soberano"
                      >
                        📊 Matchup
                      </button>
                      <button
                        type="button"
                        className="aaa-btn aaa-btn-primary"
                        style={{ padding: '4px 11px', fontSize: '0.72rem' }}
                        onClick={() => handleLaunchChallenge(sov)}
                        title={`Desafiar ${sov.sovereignName} (${sov.eloRating} ELO) em Duelo Justo 40❤️ vs 40❤️`}
                      >
                        ⚔️ Desafiar
                      </button>
                    </div>
                  ) : (
                    <div style={{ minWidth: '124px', textAlign: 'right' }}>
                      {row.isCurrentUser ? (
                        <button
                          type="button"
                          className="aaa-btn aaa-btn-secondary"
                          style={{ padding: '4px 10px', fontSize: '0.7rem' }}
                          onClick={() => onOpenAccountModal(isGuest ? 'create' : 'profile')}
                        >
                          ⚙️ Meu Perfil
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="aaa-btn aaa-btn-secondary"
                          style={{ padding: '4px 10px', fontSize: '0.7rem' }}
                          onClick={onOpenPvpConclave}
                        >
                          🌐 Sala 1×1
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* =====================================================================
          7. ORACLE MATCHUP & TIER I-V ELO DOSSIER MODAL
          ===================================================================== */}
      {oracleModalSovereign && (
        <div
          className="modal-backdrop"
          onClick={() => setOracleModalSovereign(null)}
          style={{ zIndex: 2400 }}
        >
          <div
            className="modal-panel"
            style={{ maxWidth: '640px', padding: '1.35rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const s = oracleModalSovereign;
              const standing =
                standingById.get(s.archetypeId) ?? getUnifiedStandingForDeckId(s.archetypeId);
              const tierLadder = ARCHETYPE_TIER_ELO_MAP[s.archetypeId];
              return (
                <>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      marginBottom: '0.9rem',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                      {renderAvatarThumb(s.avatarCardId, 58, '#fde047')}
                      <div>
                        <div
                          className="font-cinzel"
                          style={{ fontSize: '0.68rem', color: '#fde047', fontWeight: 800 }}
                        >
                          🔮 DOSSIÊ DO ORÁCULO • {FORMAT_LABELS[s.format].toUpperCase()}
                        </div>
                        <h3
                          className="font-cinzel gold-gradient-text"
                          style={{ margin: '2px 0', fontSize: '1.2rem' }}
                        >
                          {s.sovereignName} ({s.eloRating} ELO)
                        </h3>
                        <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                          {s.archetypeName} • {s.realmOrigin}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-fantasy"
                      onClick={() => setOracleModalSovereign(null)}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Calibrated ELO across Tiers I-V for this Archetype */}
                  {tierLadder && (
                    <div style={{ marginBottom: '0.9rem' }}>
                      <div
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          color: '#fde68a',
                          marginBottom: '6px',
                        }}
                      >
                        📈 CURVA DE ELO CALIBRADA POR GRAU DESTE ARQUÉTIPO (TIERS I–V)
                      </div>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(5, 1fr)',
                          gap: '6px',
                        }}
                      >
                        {([1, 2, 3, 4, 5] as AiSkillTier[]).map((t) => {
                          const cell = tierLadder[t];
                          const isSelected = t === s.skillTier;
                          return (
                            <div
                              key={t}
                              style={{
                                padding: '6px',
                                borderRadius: '8px',
                                textAlign: 'center',
                                background: isSelected
                                  ? 'rgba(250, 204, 21, 0.2)'
                                  : 'rgba(2, 6, 23, 0.72)',
                                border: isSelected
                                  ? '1.5px solid #fde047'
                                  : '1px solid rgba(148, 163, 184, 0.25)',
                              }}
                            >
                              <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                                Tier {AI_SKILL_TIER_SPECS[t].roman}
                              </div>
                              <div
                                style={{
                                  fontSize: '0.88rem',
                                  fontWeight: 900,
                                  color: '#fde047',
                                }}
                              >
                                {cell.elo}
                              </div>
                              <div style={{ fontSize: '0.6rem', color: '#cbd5e1' }}>
                                ±{cell.rd} ELO
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Matchup Highlights from Unified Championship */}
                  {standing && (
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '0.75rem',
                        marginBottom: '1rem',
                      }}
                    >
                      <div
                        style={{
                          padding: '0.65rem 0.75rem',
                          borderRadius: '8px',
                          background: 'rgba(6, 78, 59, 0.28)',
                          border: '1px solid rgba(52, 211, 153, 0.35)',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            color: '#6ee7b7',
                            marginBottom: '4px',
                          }}
                        >
                          ⚔️ ALVOS FAVORÁVEIS DESTE SOBERANO
                        </div>
                        {standing.bestMatchups.slice(0, 3).map((m) => {
                          const opp = standingById.get(m.opponentId);
                          return (
                            <div
                              key={m.opponentId}
                              style={{ fontSize: '0.73rem', color: '#e2e8f0', marginBottom: '2px' }}
                            >
                              • {opp?.name ?? m.opponentId}:{' '}
                              <strong style={{ color: '#6ee7b7' }}>
                                {(m.winRate * 100).toFixed(1)}% WR
                              </strong>
                            </div>
                          );
                        })}
                      </div>

                      <div
                        style={{
                          padding: '0.65rem 0.75rem',
                          borderRadius: '8px',
                          background: 'rgba(127, 29, 29, 0.28)',
                          border: '1px solid rgba(248, 113, 113, 0.35)',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            color: '#fca5a5',
                            marginBottom: '4px',
                          }}
                        >
                          🛡️ PRINCIPAIS COUNTERS (PONTOS FRACOS)
                        </div>
                        {standing.worstMatchups.slice(0, 3).map((m) => {
                          const opp = standingById.get(m.opponentId);
                          return (
                            <div
                              key={m.opponentId}
                              style={{ fontSize: '0.73rem', color: '#e2e8f0', marginBottom: '2px' }}
                            >
                              • {opp?.name ?? m.opponentId}:{' '}
                              <strong style={{ color: '#fca5a5' }}>
                                {(m.winRate * 100).toFixed(1)}% WR
                              </strong>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
                    <button
                      type="button"
                      className="aaa-btn aaa-btn-secondary"
                      onClick={() => setOracleModalSovereign(null)}
                    >
                      Fechar
                    </button>
                    <button
                      type="button"
                      className="aaa-btn aaa-btn-primary"
                      onClick={() => {
                        const target = oracleModalSovereign;
                        setOracleModalSovereign(null);
                        handleLaunchChallenge(target);
                      }}
                    >
                      ⚔️ Desafiar {s.sovereignName} pelo ELO (40❤️ vs 40❤️)
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
export default GlobalLeaderboardView;
