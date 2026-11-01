import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CARDS_BY_ID } from '../data/cards';
import { CardDefinition, Domain } from '../types/game';
import { playSfx } from '../utils/soundEngine';
import {
  ComputedRoundPairing,
  getTournamentNowMs,
  SwissTournamentDefinition,
} from '../utils/tournamentEngine';
import {
  buildMatchStorageKey,
  CompactBoardUnit,
  CompactSideState,
  fetchCloudTournamentMatchLog,
  getOrSynthesizeSovereignMatchLog,
  subscribeTournamentTvUpdates,
  TournamentMatchReplayLog,
  TournamentReplayFrame,
} from '../utils/tournamentSpectatorEngine';

interface TournamentMatchViewerModalProps {
  tournament: SwissTournamentDefinition;
  pairing: ComputedRoundPairing;
  onClose: () => void;
  onInspectCard: (card: CardDefinition) => void;
}

const DOMAIN_COLOR_HEX: Record<Domain, string> = {
  red: '#ef4444',
  blue: '#38bdf8',
  purple: '#a855f7',
  green: '#22c55e',
  gold: '#eab308',
  neutral: '#94a3b8',
};

const DOMAIN_SHORT_LABEL: Record<Domain, string> = {
  red: 'Pyros',
  blue: 'Vórtex',
  purple: 'Eclipse',
  green: 'Veridia',
  gold: 'Solária',
  neutral: 'Axial',
};

function formatClockMmSs(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(clamped / 60);
  const s = clamped % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function alignFrameToPairing(
  frame: TournamentReplayFrame,
  pairing: ComputedRoundPairing
): TournamentReplayFrame {
  const nameA = pairing.playerA.displayName.trim().toLowerCase();
  const frameA = frame.sideA.name.trim().toLowerCase();
  const frameB = frame.sideB.name.trim().toLowerCase();

  if (frameA !== nameA && frameB === nameA) {
    return {
      ...frame,
      activeSide: frame.activeSide === 'A' ? 'B' : 'A',
      actorSide:
        frame.actorSide === 'A'
          ? 'B'
          : frame.actorSide === 'B'
          ? 'A'
          : 'SYSTEM',
      clockSecA: frame.clockSecB,
      clockSecB: frame.clockSecA,
      domainExpansion: frame.domainExpansion
        ? {
            ...frame.domainExpansion,
            owner: frame.domainExpansion.owner === 'A' ? 'B' : 'A',
          }
        : null,
      sideA: frame.sideB,
      sideB: frame.sideA,
    };
  }
  return frame;
}

export const TournamentMatchViewerModal: React.FC<TournamentMatchViewerModalProps> = ({
  tournament,
  pairing,
  onClose,
  onInspectCard,
}) => {
  const [nowMs, setNowMs] = useState<number>(() => getTournamentNowMs());
  const [cloudLog, setCloudLog] = useState<TournamentMatchReplayLog | null>(null);
  const [loadingCloud, setLoadingCloud] = useState<boolean>(pairing.isHumanTable);
  const [revealHands, setRevealHands] = useState<boolean>(true);
  const [followingLive, setFollowingLive] = useState<boolean>(true);
  const [cursorIndex, setCursorIndex] = useState<number>(0);
  const [isPlayingReplay, setIsPlayingReplay] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 4>(1);

  const logListRef = useRef<HTMLDivElement | null>(null);
  const prevVisibleCountRef = useRef<number>(0);

  const targetMatchKey = useMemo(() => {
    if (!pairing.playerB) return '';
    return buildMatchStorageKey(
      tournament.id,
      pairing.round,
      pairing.playerA.participantId,
      pairing.playerB.participantId
    );
  }, [tournament.id, pairing]);

  // 1. Real-time wall clock tick (250ms for smooth live turn clock countdown & move reveals)
  useEffect(() => {
    const id = window.setInterval(() => {
      setNowMs(getTournamentNowMs());
    }, 250);
    return () => window.clearInterval(id);
  }, []);

  // 2. Escape key closes modal
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        ev.stopPropagation();
        onClose();
      } else if (ev.key === 'ArrowRight') {
        setFollowingLive(false);
        setIsPlayingReplay(false);
        setCursorIndex((c) => c + 1);
      } else if (ev.key === 'ArrowLeft') {
        setFollowingLive(false);
        setIsPlayingReplay(false);
        setCursorIndex((c) => Math.max(0, c - 1));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // 3. Load / subscribe cloud frames if human table
  useEffect(() => {
    if (!pairing.isHumanTable || !pairing.playerB) {
      setLoadingCloud(false);
      return;
    }

    let cancelled = false;
    const loadOnce = async () => {
      const found = await fetchCloudTournamentMatchLog(
        tournament.id,
        pairing.round,
        pairing.playerA.participantId,
        pairing.playerB!.participantId
      );
      if (!cancelled) {
        if (found) setCloudLog(found);
        setLoadingCloud(false);
      }
    };

    void loadOnce();
    const unsub = subscribeTournamentTvUpdates((incoming) => {
      if (incoming.matchKey === targetMatchKey && !cancelled) {
        setCloudLog(incoming);
      }
    });
    const pollId = window.setInterval(() => {
      void loadOnce();
    }, 3500);

    return () => {
      cancelled = true;
      unsub();
      window.clearInterval(pollId);
    };
  }, [pairing, tournament.id, targetMatchKey]);

  // 4. Resolve Match Log (Cloud recorded frames for human matches, or On-Demand Deterministic Engine Rollout)
  const resolvedLog: TournamentMatchReplayLog | null = useMemo(() => {
    if (!pairing.playerB) return null;
    if (cloudLog && cloudLog.frames.length > 0) return cloudLog;
    if (pairing.isHumanTable && loadingCloud) return null;
    // Synthesize deterministic engine match (works for Sovereign matches & fallback if a table had no cloud telemetry)
    return getOrSynthesizeSovereignMatchLog(tournament, pairing);
  }, [cloudLog, loadingCloud, pairing, tournament]);

  const alignedFrames = useMemo(() => {
    if (!resolvedLog) return [];
    return resolvedLog.frames.map((f) => alignFrameToPairing(f, pairing));
  }, [resolvedLog, pairing]);

  const isLiveMatch = useMemo(() => {
    if (!resolvedLog) return false;
    if (resolvedLog.isHumanRecorded) {
      return !resolvedLog.isCompleted && pairing.result === 'IN_PROGRESS';
    }
    return nowMs < resolvedLog.matchFinishMs;
  }, [resolvedLog, nowMs, pairing.result]);

  // Visible frames up to current wall-clock time when live, or all frames when finished
  const visibleFrames = useMemo(() => {
    if (!resolvedLog || alignedFrames.length === 0) return [];
    if (!isLiveMatch) return alignedFrames;
    if (resolvedLog.isHumanRecorded) return alignedFrames;
    const revealed = alignedFrames.filter((f) => f.atMs <= nowMs);
    return revealed.length > 0 ? revealed : [alignedFrames[0]];
  }, [resolvedLog, alignedFrames, isLiveMatch, nowMs]);

  const maxIndex = Math.max(0, visibleFrames.length - 1);

  // Sync cursor when following live & play subtle SFX on new live move
  useEffect(() => {
    if (isLiveMatch && followingLive) {
      setCursorIndex(maxIndex);
    }
    if (
      isLiveMatch &&
      prevVisibleCountRef.current > 0 &&
      visibleFrames.length > prevVisibleCountRef.current
    ) {
      const newest = visibleFrames[visibleFrames.length - 1];
      if (newest?.kind === 'attack') playSfx('attack');
      else if (newest?.kind === 'domain') playSfx('domain_expand');
      else if (newest?.kind === 'play_card') playSfx('summon');
    }
    prevVisibleCountRef.current = visibleFrames.length;
  }, [isLiveMatch, followingLive, maxIndex, visibleFrames]);

  // Replay auto-play timer when watching past games
  useEffect(() => {
    if (!isPlayingReplay) return;
    if (cursorIndex >= maxIndex) {
      setIsPlayingReplay(false);
      return;
    }
    const intervalMs = playbackSpeed === 4 ? 420 : playbackSpeed === 2 ? 850 : 1650;
    const t = window.setTimeout(() => {
      setCursorIndex((prev) => {
        const next = Math.min(maxIndex, prev + 1);
        const f = visibleFrames[next];
        if (f?.kind === 'attack') playSfx('attack');
        else if (f?.kind === 'domain') playSfx('domain_expand');
        else if (f?.kind === 'play_card') playSfx('summon');
        return next;
      });
    }, intervalMs);
    return () => window.clearTimeout(t);
  }, [isPlayingReplay, cursorIndex, maxIndex, playbackSpeed, visibleFrames]);

  const safeCursor = Math.min(cursorIndex, maxIndex);
  const activeFrame = visibleFrames[safeCursor] ?? null;

  // Auto-scroll move log to active move
  useEffect(() => {
    const container = logListRef.current;
    if (!container) return;
    const activeEl = container.querySelector('.trn-tv-log-item.active') as HTMLElement | null;
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [safeCursor]);

  // Compute live ticking turn clocks during thinking pause between frames
  const { displayClockA, displayClockB, thinkingLabel } = useMemo(() => {
    if (!activeFrame || !resolvedLog) {
      return { displayClockA: 45, displayClockB: 45, thinkingLabel: null };
    }
    if (!isLiveMatch || !followingLive || safeCursor < maxIndex) {
      return {
        displayClockA: activeFrame.clockSecA,
        displayClockB: activeFrame.clockSecB,
        thinkingLabel: null,
      };
    }

    const nextUpcoming = alignedFrames[visibleFrames.length];
    const thinkingSide = nextUpcoming?.actorSide === 'B'
      ? 'B'
      : nextUpcoming?.actorSide === 'A'
      ? 'A'
      : activeFrame.activeSide;
    const elapsedThinkingSec = Math.max(0, Math.floor((nowMs - activeFrame.atMs) / 1000));
    const limit = resolvedLog.turnTimeLimitSec || 45;

    const baseA =
      activeFrame.actorSide === 'A' && activeFrame.kind !== 'end_turn'
        ? activeFrame.clockSecA
        : limit;
    const baseB =
      activeFrame.actorSide === 'B' && activeFrame.kind !== 'end_turn'
        ? activeFrame.clockSecB
        : limit;

    const liveA = thinkingSide === 'A' ? Math.max(1, baseA - elapsedThinkingSec) : baseA;
    const liveB = thinkingSide === 'B' ? Math.max(1, baseB - elapsedThinkingSec) : baseB;
    const thinkerName =
      thinkingSide === 'A' ? activeFrame.sideA.name : activeFrame.sideB.name;

    return {
      displayClockA: liveA,
      displayClockB: liveB,
      thinkingLabel: `${thinkerName} avaliando jogada (${
        thinkingSide === 'A' ? liveA : liveB
      }s)`,
    };
  }, [
    activeFrame,
    resolvedLog,
    isLiveMatch,
    followingLive,
    safeCursor,
    maxIndex,
    alignedFrames,
    visibleFrames.length,
    nowMs,
  ]);

  const renderPlayerBar = (
    side: CompactSideState,
    sideKey: 'A' | 'B',
    clockSec: number,
    isThinkingNow: boolean
  ) => {
    const avatar = CARDS_BY_ID[side.avatarCardId];
    const nonZeroAffinities = (
      ['red', 'blue', 'purple', 'green', 'gold', 'neutral'] as Domain[]
    ).filter((d) => (side.affinities?.[d] ?? 0) > 0);

    return (
      <div className={`trn-tv-player-bar ${isThinkingNow ? 'is-active-turn' : ''}`}>
        <div className="trn-tv-player-id">
          {avatar?.imagePath ? (
            <img
              src={`${avatar.imagePath}?v=12`}
              alt={side.name}
              className="trn-tv-avatar"
              onClick={() => onInspectCard(avatar)}
              title="Inspecionar carta de avatar"
            />
          ) : (
            <div className="trn-tv-avatar" />
          )}
          <div className="trn-tv-player-names">
            <div className="trn-tv-player-name-row">
              <span
                className="trn-domain-dot"
                style={{ backgroundColor: DOMAIN_COLOR_HEX[side.primaryDomain] }}
              />
              <span className="trn-tv-player-name">{side.name}</span>
              <span className="trn-tv-side-tag">
                {sideKey === 'A' ? 'Mesa Sul' : 'Mesa Norte'}
              </span>
            </div>
            <span className="trn-tv-player-sub">{side.subtitle}</span>
          </div>
        </div>

        <div className="trn-tv-resources">
          <div className="trn-tv-res-chip" title="Essência atual / máxima">
            <span className="trn-tv-res-label">Essência</span>
            <strong>
              {side.essence}/{side.maxEssence}
            </strong>
          </div>

          {nonZeroAffinities.length > 0 && (
            <div className="trn-tv-affinities" title="Afinidades canalizadas">
              {nonZeroAffinities.map((dom) => (
                <span key={dom} className="trn-tv-aff-pill">
                  <span
                    className="trn-domain-dot-inline"
                    style={{ backgroundColor: DOMAIN_COLOR_HEX[dom] }}
                  />
                  {side.affinities[dom]}
                </span>
              ))}
            </div>
          )}

          <div className="trn-tv-zone-counts">
            <span>Mão {side.handCardIds.length}</span>
            <span>Grimório {side.deckCount}</span>
            <span>Cripta {side.cryptCardIds.length}</span>
          </div>

          <div className={`trn-tv-hp-badge ${side.hp <= 12 ? 'low' : ''}`}>
            <strong>{side.hp}</strong>
            <span>/{side.maxHp} PV</span>
          </div>

          <div className={`trn-tv-clock ${isThinkingNow ? 'ticking' : ''}`}>
            {formatClockMmSs(clockSec)}
          </div>
        </div>
      </div>
    );
  };

  const renderHandStrip = (cardIds: string[], label: string) => {
    if (!revealHands) return null;
    return (
      <div className="trn-tv-hand-strip">
        <span className="trn-tv-hand-label">{label}</span>
        {cardIds.length === 0 ? (
          <span className="trn-tv-hand-empty">Mão vazia</span>
        ) : (
          <div className="trn-tv-hand-cards">
            {cardIds.map((cid, idx) => {
              const card = CARDS_BY_ID[cid];
              if (!card) return null;
              return (
                <button
                  key={`${cid}_${idx}`}
                  type="button"
                  className="trn-tv-hand-card"
                  onClick={() => onInspectCard(card)}
                  title={`${card.name} (Custo ${card.cost}) — Clique para ler a carta`}
                >
                  <span
                    className="trn-tv-hand-cost"
                    style={{ borderColor: DOMAIN_COLOR_HEX[card.domain] }}
                  >
                    {card.cost}
                  </span>
                  {card.imagePath && (
                    <img
                      src={`${card.imagePath}?v=12`}
                      alt={card.name}
                      className="trn-tv-hand-thumb"
                    />
                  )}
                  <span className="trn-tv-hand-name">{card.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderBoardRow = (
    rowLabel: string,
    slots: CompactBoardUnit[][],
    ownerSide: 'A' | 'B'
  ) => (
    <div className={`trn-tv-row owner-${ownerSide.toLowerCase()}`}>
      <div className="trn-tv-row-tag">{rowLabel}</div>
      <div className="trn-tv-slots-grid">
        {Array.from({ length: 6 }, (_, colIdx) => {
          const stack = slots[colIdx] ?? [];
          const lead = stack[0];
          const card = lead ? CARDS_BY_ID[lead.cid] : undefined;

          if (!lead || !card) {
            return <div key={colIdx} className="trn-tv-slot empty" />;
          }

          const stateFlags: string[] = [];
          if (lead.shd) stateFlags.push('Escudo');
          if (lead.frz) stateFlags.push('Congelado');
          if (lead.asc) stateFlags.push('Ascendido');
          if (lead.trp) stateFlags.push('Armadilha');

          return (
            <button
              key={colIdx}
              type="button"
              className={`trn-tv-slot occupied ${lead.tap ? 'tapped' : ''} ${
                lead.frz ? 'frozen' : ''
              } ${lead.shd ? 'shielded' : ''}`}
              onClick={() => onInspectCard(card)}
              title={`${card.name} (${lead.atk}/${lead.hp})${
                stateFlags.length ? ` · ${stateFlags.join(', ')}` : ''
              } — Clique para inspecionar`}
            >
              {card.imagePath && (
                <img
                  src={`${card.imagePath}?v=12`}
                  alt={card.name}
                  className="trn-tv-unit-art"
                />
              )}
              <div className="trn-tv-unit-overlay">
                <div className="trn-tv-unit-top">
                  {stack.length > 1 && (
                    <span className="trn-tv-stack-pill">×{stack.length}</span>
                  )}
                  {lead.shd && <span className="trn-tv-flag-pill">Escudo</span>}
                  {lead.frz && <span className="trn-tv-flag-pill ice">Gelo</span>}
                </div>
                <div className="trn-tv-unit-bottom">
                  <span className="trn-tv-unit-name">{card.name}</span>
                  <span className="trn-tv-unit-stats">
                    {lead.atk}/{lead.hp}
                    {lead.arm > 0 ? `+${lead.arm}` : ''}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const scoreHeaderLabel = useMemo(() => {
    if (isLiveMatch) return null;
    const r =
      resolvedLog?.finalResult && resolvedLog.finalResult !== 'IN_PROGRESS'
        ? resolvedLog.finalResult
        : pairing.result;
    if (r === 'A_WIN') return '1 – 0';
    if (r === 'B_WIN') return '0 – 1';
    if (r === 'DRAW') return '½ – ½';
    return 'Encerrada';
  }, [isLiveMatch, resolvedLog, pairing.result]);

  return (
    <div
      className="trn-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Mesa ${pairing.tableNumber} da Rodada ${pairing.round}`}
    >
      <div className="trn-tv-modal" onClick={(e) => e.stopPropagation()}>
        {/* TOP HEADER */}
        <header className="trn-tv-header">
          <div className="trn-tv-header-left">
            <span className="trn-tv-table-id">
              Mesa #{pairing.tableNumber} · Rodada {pairing.round}
            </span>
            {isLiveMatch ? (
              <span className="trn-badge tone-live" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span className="trn-live-dot" />
                Ao vivo · Turno {activeFrame?.turn ?? 1}
              </span>
            ) : (
              <span className="trn-badge tone-muted">
                Resultado final: {scoreHeaderLabel}
              </span>
            )}
            {thinkingLabel && <span className="trn-tv-thinking-note">{thinkingLabel}</span>}
          </div>

          <div className="trn-tv-header-right">
            <button
              type="button"
              className="trn-btn trn-btn-ghost"
              onClick={() => setRevealHands((v) => !v)}
            >
              {revealHands ? 'Ocultar mãos' : 'Mostrar mãos'}
            </button>
            <button type="button" className="trn-btn trn-btn-ghost" onClick={onClose}>
              Fechar
            </button>
          </div>
        </header>

        {!activeFrame ? (
          <div className="trn-empty-pairings" style={{ padding: '4rem 1rem' }}>
            Sincronizando mesa #{pairing.tableNumber}...
          </div>
        ) : (
          <>
            {/* MAIN 2-COLUMN SPECTATOR STAGE */}
            <div className="trn-tv-body">
              <div className="trn-tv-board-col">
                {/* COMPETITOR B (NORTH) */}
                {renderPlayerBar(
                  activeFrame.sideB,
                  'B',
                  displayClockB,
                  activeFrame.activeSide === 'B' && activeFrame.kind !== 'finish'
                )}
                {renderHandStrip(activeFrame.sideB.handCardIds, 'Mão Norte')}

                {/* TACTICAL 4x6 BATTLEFIELD */}
                <div className="trn-tv-battlefield">
                  {renderBoardRow('Retaguarda', activeFrame.sideB.rearguard, 'B')}
                  {renderBoardRow('Vanguarda', activeFrame.sideB.vanguard, 'B')}

                  <div className="trn-tv-midline">
                    <span className="trn-tv-move-callout">
                      <strong>Lance {safeCursor}:</strong> {activeFrame.summary}
                    </span>
                    {activeFrame.domainExpansion && (
                      <span className="trn-tv-domain-pill">
                        <span
                          className="trn-domain-dot-inline"
                          style={{
                            backgroundColor:
                              DOMAIN_COLOR_HEX[activeFrame.domainExpansion.domain],
                          }}
                        />
                        Domínio Ativo: {activeFrame.domainExpansion.name} (
                        {DOMAIN_SHORT_LABEL[activeFrame.domainExpansion.domain]} ·{' '}
                        {activeFrame.domainExpansion.turnsRemaining}t)
                      </span>
                    )}
                  </div>

                  {renderBoardRow('Vanguarda', activeFrame.sideA.vanguard, 'A')}
                  {renderBoardRow('Retaguarda', activeFrame.sideA.rearguard, 'A')}
                </div>

                {/* COMPETITOR A (SOUTH) */}
                {renderHandStrip(activeFrame.sideA.handCardIds, 'Mão Sul')}
                {renderPlayerBar(
                  activeFrame.sideA,
                  'A',
                  displayClockA,
                  activeFrame.activeSide === 'A' && activeFrame.kind !== 'finish'
                )}
              </div>

              {/* CHRONOLOGICAL MOVE LOG */}
              <aside className="trn-tv-log-col">
                <div className="trn-tv-log-head">
                  <span>Registro de lances</span>
                  <span>
                    {safeCursor}/{maxIndex}
                  </span>
                </div>

                <div className="trn-tv-log-list" ref={logListRef}>
                  {visibleFrames.map((f, i) => {
                    const card = f.cardId ? CARDS_BY_ID[f.cardId] : undefined;
                    const relSec = resolvedLog
                      ? Math.max(0, Math.floor((f.atMs - resolvedLog.matchStartMs) / 1000))
                      : 0;
                    const isSelected = i === safeCursor;

                    return (
                      <button
                        key={f.index}
                        type="button"
                        className={`trn-tv-log-item ${isSelected ? 'active' : ''}`}
                        onClick={() => {
                          setIsPlayingReplay(false);
                          if (isLiveMatch && i < maxIndex) {
                            setFollowingLive(false);
                          } else if (isLiveMatch && i === maxIndex) {
                            setFollowingLive(true);
                          }
                          setCursorIndex(i);
                        }}
                      >
                        <span className="trn-tv-log-turn">T{f.turn}</span>
                        {card?.imagePath ? (
                          <img
                            src={`${card.imagePath}?v=12`}
                            alt={card.name}
                            className="trn-tv-log-thumb"
                            onClick={(ev) => {
                              ev.stopPropagation();
                              onInspectCard(card);
                            }}
                          />
                        ) : (
                          <span
                            className="trn-tv-log-dot"
                            style={{
                              backgroundColor:
                                f.actorSide === 'A'
                                  ? DOMAIN_COLOR_HEX[f.sideA.primaryDomain]
                                  : f.actorSide === 'B'
                                  ? DOMAIN_COLOR_HEX[f.sideB.primaryDomain]
                                  : '#64748b',
                            }}
                          />
                        )}
                        <span className="trn-tv-log-msg">{f.summary}</span>
                        <span className="trn-tv-log-time">{formatClockMmSs(relSec)}</span>
                      </button>
                    );
                  })}
                </div>
              </aside>
            </div>

            {/* BOTTOM TRANSPORT & SCRUBBER BAR */}
            <footer className="trn-tv-footer">
              <div className="trn-tv-transport">
                <button
                  type="button"
                  className="trn-btn trn-btn-ghost trn-tv-ctrl-btn"
                  disabled={safeCursor <= 0}
                  onClick={() => {
                    setIsPlayingReplay(false);
                    setFollowingLive(false);
                    setCursorIndex(0);
                  }}
                  title="Ir para o início da partida"
                >
                  |◀
                </button>
                <button
                  type="button"
                  className="trn-btn trn-btn-ghost trn-tv-ctrl-btn"
                  disabled={safeCursor <= 0}
                  onClick={() => {
                    setIsPlayingReplay(false);
                    setFollowingLive(false);
                    setCursorIndex((c) => Math.max(0, c - 1));
                  }}
                  title="Lance anterior"
                >
                  ◀
                </button>

                {!isLiveMatch || !followingLive ? (
                  <button
                    type="button"
                    className="trn-btn trn-btn-primary trn-tv-play-btn"
                    onClick={() => {
                      if (safeCursor >= maxIndex) {
                        setCursorIndex(0);
                        setIsPlayingReplay(true);
                      } else {
                        setIsPlayingReplay((p) => !p);
                      }
                    }}
                  >
                    {isPlayingReplay ? 'Pausar' : safeCursor >= maxIndex ? 'Rever do início' : 'Reproduzir'}
                  </button>
                ) : null}

                <button
                  type="button"
                  className="trn-btn trn-btn-ghost trn-tv-ctrl-btn"
                  disabled={safeCursor >= maxIndex}
                  onClick={() => {
                    setIsPlayingReplay(false);
                    const next = Math.min(maxIndex, safeCursor + 1);
                    if (isLiveMatch && next >= maxIndex) setFollowingLive(true);
                    setCursorIndex(next);
                  }}
                  title="Próximo lance"
                >
                  ▶
                </button>
                <button
                  type="button"
                  className="trn-btn trn-btn-ghost trn-tv-ctrl-btn"
                  disabled={safeCursor >= maxIndex}
                  onClick={() => {
                    setIsPlayingReplay(false);
                    if (isLiveMatch) setFollowingLive(true);
                    setCursorIndex(maxIndex);
                  }}
                  title="Ir para o lance mais recente"
                >
                  ▶|
                </button>
              </div>

              <div className="trn-tv-scrubber-wrap">
                <input
                  type="range"
                  min={0}
                  max={maxIndex}
                  value={safeCursor}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setIsPlayingReplay(false);
                    if (isLiveMatch && val < maxIndex) setFollowingLive(false);
                    else if (isLiveMatch && val >= maxIndex) setFollowingLive(true);
                    setCursorIndex(val);
                  }}
                  className="trn-tv-scrubber"
                  aria-label="Linha do tempo da partida"
                />
              </div>

              <div className="trn-tv-speed-cluster">
                {isLiveMatch ? (
                  followingLive ? (
                    <span className="trn-tv-live-sync-label">
                      <span className="trn-live-dot" /> Sincronizado ao vivo
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="trn-btn trn-btn-primary"
                      onClick={() => {
                        setIsPlayingReplay(false);
                        setFollowingLive(true);
                        setCursorIndex(maxIndex);
                      }}
                    >
                      Voltar ao vivo
                    </button>
                  )
                ) : (
                  ([1, 2, 4] as const).map((spd) => (
                    <button
                      key={spd}
                      type="button"
                      className={`trn-round-tab-btn ${playbackSpeed === spd ? 'active' : ''}`}
                      onClick={() => setPlaybackSpeed(spd)}
                    >
                      {spd}×
                    </button>
                  ))
                )}
              </div>
            </footer>
          </>
        )}
      </div>
    </div>
  );
};
