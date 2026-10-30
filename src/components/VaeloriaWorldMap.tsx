import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { CampaignBoss } from '../types/game';
import { CARDS_BY_ID } from '../data/cards';
import { DOMAIN_META } from './CardView';
import { playSfx } from '../utils/soundEngine';
import {
  VAELORIA_WORLD_MAP_IMAGE,
  VAELORIA_MAP_TERRITORIES,
  VAELORIA_SUB_LANDMARKS,
  VaeloriaStageMapNode,
  resolveStageMapNode,
  resolveNearestTerritory,
} from '../data/vaeloriaMapData';

export interface VaeloriaWorldMapProps {
  mode: 'campaign' | 'expedition';
  bosses: CampaignBoss[];
  selectedBossId: string;
  clearedBossIds: string[];
  sovereignAvatarCardId?: string;
  sovereignLabel?: string;
  onSelectBoss: (boss: CampaignBoss) => void;
  onChallengeBoss: (boss: CampaignBoss) => void;
}

interface PositionedBossEntry {
  boss: CampaignBoss;
  node: VaeloriaStageMapNode;
}

const CLAMP_MIN_X = 4.5;
const CLAMP_MAX_X = 95.5;
const CLAMP_MIN_Y = 6.5;
const CLAMP_MAX_Y = 93.5;

export const VaeloriaWorldMap: React.FC<VaeloriaWorldMapProps> = ({
  mode,
  bosses,
  selectedBossId,
  clearedBossIds,
  sovereignAvatarCardId,
  sovereignLabel = 'Seu Soberano',
  onSelectBoss,
  onChallengeBoss,
}) => {
  const positionedBosses: PositionedBossEntry[] = useMemo(
    () =>
      bosses.map((boss) => ({
        boss,
        node: resolveStageMapNode(mode, boss.id, boss.stage),
      })),
    [bosses, mode]
  );

  const selectedEntry = useMemo(
    () =>
      positionedBosses.find((entry) => entry.boss.id === selectedBossId) ?? positionedBosses[0],
    [positionedBosses, selectedBossId]
  );

  // Sovereign physical coordinates on the continent (in % 0..100)
  const [pawnPos, setPawnPos] = useState<{ x: number; y: number }>(() => ({
    x: selectedEntry?.node.x ?? 50,
    y: selectedEntry?.node.y ?? 50.5,
  }));
  const [marchOrigin, setMarchOrigin] = useState<{ x: number; y: number } | null>(null);
  const [marchTarget, setMarchTarget] = useState<{ x: number; y: number } | null>(null);
  const [facingLeft, setFacingLeft] = useState<boolean>(false);

  // Camera Pan & Zoom
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showGeographyLabels, setShowGeographyLabels] = useState<boolean>(true);
  const [hoveredBossId, setHoveredBossId] = useState<string | null>(null);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const pawnPosRef = useRef<{ x: number; y: number }>(pawnPos);
  pawnPosRef.current = pawnPos;

  const heldKeysRef = useRef<Set<string>>(new Set());
  const dpadDirRef = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });
  const activePointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchStartRef = useRef<{ dist: number; startZoom: number } | null>(null);
  const dragStateRef = useRef<{
    active: boolean;
    moved: boolean;
    startClientX: number;
    startClientY: number;
    startPanX: number;
    startPanY: number;
  }>({
    active: false,
    moved: false,
    startClientX: 0,
    startClientY: 0,
    startPanX: 0,
    startPanY: 0,
  });

  const clampPan = useCallback((nextPan: { x: number; y: number }, nextZoom: number) => {
    if (nextZoom <= 1.01 || !viewportRef.current) {
      return { x: 0, y: 0 };
    }
    const rect = viewportRef.current.getBoundingClientRect();
    const maxOffsetX = ((nextZoom - 1) * rect.width) / 2;
    const maxOffsetY = ((nextZoom - 1) * rect.height) / 2;
    return {
      x: Math.max(-maxOffsetX, Math.min(maxOffsetX, nextPan.x)),
      y: Math.max(-maxOffsetY, Math.min(maxOffsetY, nextPan.y)),
    };
  }, []);

  const startMarchTo = useCallback((destX: number, destY: number, silent = false) => {
    const clampedX = Math.max(CLAMP_MIN_X, Math.min(CLAMP_MAX_X, destX));
    const clampedY = Math.max(CLAMP_MIN_Y, Math.min(CLAMP_MAX_Y, destY));
    const cur = pawnPosRef.current;
    const dx = clampedX - cur.x;
    const dy = clampedY - cur.y;
    if (Math.hypot(dx, dy) < 0.35) {
      setMarchTarget(null);
      setMarchOrigin(null);
      return;
    }
    if (Math.abs(dx) > 0.4) {
      setFacingLeft(dx < 0);
    }
    setMarchOrigin({ x: cur.x, y: cur.y });
    setMarchTarget({ x: clampedX, y: clampedY });
    if (!silent) {
      playSfx('draw');
    }
  }, []);

  // When selectedBossId changes externally (e.g. Act filter tab or Dossier navigation), march Sovereign there
  const lastSyncedBossIdRef = useRef<string>(selectedBossId);
  useEffect(() => {
    if (selectedBossId !== lastSyncedBossIdRef.current && selectedEntry) {
      lastSyncedBossIdRef.current = selectedBossId;
      const dist = Math.hypot(
        pawnPosRef.current.x - selectedEntry.node.x,
        pawnPosRef.current.y - selectedEntry.node.y
      );
      if (dist > 1.8) {
        startMarchTo(selectedEntry.node.x, selectedEntry.node.y, true);
      }
    }
  }, [selectedBossId, selectedEntry, startMarchTo]);

  // Smooth RAF Loop: handles both point-to-point March AND continuous WASD/Arrow/D-pad roaming
  useEffect(() => {
    let rafId = 0;
    let lastTs = performance.now();

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - lastTs) / 1000);
      lastTs = now;

      let keyDx = dpadDirRef.current.dx;
      let keyDy = dpadDirRef.current.dy;
      const keys = heldKeysRef.current;
      if (keys.has('w') || keys.has('arrowup')) keyDy -= 1;
      if (keys.has('s') || keys.has('arrowdown')) keyDy += 1;
      if (keys.has('a') || keys.has('arrowleft')) keyDx -= 1;
      if (keys.has('d') || keys.has('arrowright')) keyDx += 1;

      if (keyDx !== 0 || keyDy !== 0) {
        const mag = Math.hypot(keyDx, keyDy) || 1;
        const speedPctPerSec = 26;
        const cur = pawnPosRef.current;
        const nx = Math.max(
          CLAMP_MIN_X,
          Math.min(CLAMP_MAX_X, cur.x + (keyDx / mag) * speedPctPerSec * dt)
        );
        const ny = Math.max(
          CLAMP_MIN_Y,
          Math.min(CLAMP_MAX_Y, cur.y + (keyDy / mag) * speedPctPerSec * dt)
        );
        if (Math.abs(keyDx) > 0.1) {
          setFacingLeft(keyDx < 0);
        }
        if (marchTarget) {
          setMarchTarget(null);
          setMarchOrigin(null);
        }
        pawnPosRef.current = { x: nx, y: ny };
        setPawnPos({ x: nx, y: ny });

        // Auto-select Boss Citadel when walking close to it
        let closest: PositionedBossEntry | null = null;
        let closestDist = 4.4;
        for (const entry of positionedBosses) {
          const d = Math.hypot(nx - entry.node.x, ny - entry.node.y);
          if (d < closestDist) {
            closestDist = d;
            closest = entry;
          }
        }
        if (closest && closest.boss.id !== lastSyncedBossIdRef.current) {
          lastSyncedBossIdRef.current = closest.boss.id;
          playSfx('channel');
          onSelectBoss(closest.boss);
        }
      } else if (marchTarget) {
        const cur = pawnPosRef.current;
        const dx = marchTarget.x - cur.x;
        const dy = marchTarget.y - cur.y;
        const dist = Math.hypot(dx, dy);
        const marchSpeed = Math.max(32, dist * 2.6);
        const maxStep = marchSpeed * dt;

        if (dist <= maxStep || dist < 0.35) {
          pawnPosRef.current = { x: marchTarget.x, y: marchTarget.y };
          setPawnPos({ x: marchTarget.x, y: marchTarget.y });
          setMarchTarget(null);
          setMarchOrigin(null);
        } else {
          const nx = cur.x + (dx / dist) * maxStep;
          const ny = cur.y + (dy / dist) * maxStep;
          pawnPosRef.current = { x: nx, y: ny };
          setPawnPos({ x: nx, y: ny });
        }
      }

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [marchTarget, positionedBosses, onSelectBoss]);

  // Keyboard listeners for WASD / Arrow Keys + Enter to Challenge nearby Citadel
  useEffect(() => {
    const isEditableElement = (el: EventTarget | null): boolean => {
      if (!(el instanceof HTMLElement)) return false;
      const tag = el.tagName.toLowerCase();
      return tag === 'input' || tag === 'textarea' || tag === 'select' || el.isContentEditable;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditableElement(e.target)) return;
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        e.preventDefault();
        heldKeysRef.current.add(key);
      } else if (key === 'enter') {
        const cur = pawnPosRef.current;
        const docked = positionedBosses.find(
          (entry) => Math.hypot(cur.x - entry.node.x, cur.y - entry.node.y) <= 4.8
        );
        if (docked) {
          e.preventDefault();
          onChallengeBoss(docked.boss);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      heldKeysRef.current.delete(e.key.toLowerCase());
    };

    const handleBlur = () => {
      heldKeysRef.current.clear();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [positionedBosses, onChallengeBoss]);

  // Live Geographic Region & Docked Boss Detection
  const currentTerritory = useMemo(
    () => resolveNearestTerritory(pawnPos.x, pawnPos.y),
    [pawnPos.x, pawnPos.y]
  );

  const dockedBossEntry = useMemo(() => {
    let best: PositionedBossEntry | null = null;
    let bestDist = 4.6;
    for (const entry of positionedBosses) {
      const d = Math.hypot(pawnPos.x - entry.node.x, pawnPos.y - entry.node.y);
      if (d < bestDist) {
        bestDist = d;
        best = entry;
      }
    }
    return best;
  }, [positionedBosses, pawnPos.x, pawnPos.y]);

  const sovereignCard = sovereignAvatarCardId ? CARDS_BY_ID[sovereignAvatarCardId] : undefined;

  // Next sequential stage to highlight as active frontier
  const nextUnclearBossId = useMemo(() => {
    const uncleared = positionedBosses.find((e) => !clearedBossIds.includes(e.boss.id));
    return uncleared?.boss.id ?? null;
  }, [positionedBosses, clearedBossIds]);

  const applyZoom = (nextZoomRaw: number) => {
    const nextZoom = Math.max(1, Math.min(2.25, Number(nextZoomRaw.toFixed(2))));
    setZoom(nextZoom);
    setPan((prev) => clampPan(prev, nextZoom));
  };

  const handleCenterOnSovereign = () => {
    if (!viewportRef.current) return;
    const targetZoom = Math.max(zoom, 1.35);
    const rect = viewportRef.current.getBoundingClientRect();
    const desiredPanX = ((50 - pawnPos.x) / 100) * rect.width * targetZoom;
    const desiredPanY = ((50 - pawnPos.y) / 100) * rect.height * targetZoom;
    setZoom(targetZoom);
    setPan(clampPan({ x: desiredPanX, y: desiredPanY }, targetZoom));
  };

  const handlePointerDownViewport = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (activePointersRef.current.size === 2) {
      const pts = Array.from(activePointersRef.current.values());
      const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
      pinchStartRef.current = { dist: Math.max(20, dist), startZoom: zoom };
      dragStateRef.current.moved = true;
      return;
    }

    dragStateRef.current = {
      active: true,
      moved: false,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startPanX: pan.x,
      startPanY: pan.y,
    };
  };

  const handlePointerMoveViewport = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointersRef.current.has(e.pointerId)) {
      activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }

    if (activePointersRef.current.size === 2 && pinchStartRef.current) {
      const pts = Array.from(activePointersRef.current.values());
      const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
      const ratio = dist / pinchStartRef.current.dist;
      applyZoom(pinchStartRef.current.startZoom * ratio);
      dragStateRef.current.moved = true;
      return;
    }

    const st = dragStateRef.current;
    if (!st.active) return;
    const dx = e.clientX - st.startClientX;
    const dy = e.clientY - st.startClientY;
    if (Math.hypot(dx, dy) > 6) {
      st.moved = true;
    }
    if (st.moved && zoom > 1.01) {
      setPan(
        clampPan(
          {
            x: st.startPanX + dx,
            y: st.startPanY + dy,
          },
          zoom
        )
      );
    }
  };

  const handlePointerUpViewport = (e: React.PointerEvent<HTMLDivElement>) => {
    activePointersRef.current.delete(e.pointerId);
    if (activePointersRef.current.size < 2) {
      pinchStartRef.current = null;
    }
    if (activePointersRef.current.size > 0) {
      return;
    }

    const st = dragStateRef.current;
    dragStateRef.current.active = false;
    if (st.moved) return;

    // Ignore clicks on interactive controls or Boss Citadel buttons (handled by their own onClick)
    const targetEl = e.target as HTMLElement | null;
    if (targetEl?.closest('.vwm-boss-node, .vwm-pawn-challenge-pill, .vwm-dpad, .vwm-floating-controls')) {
      return;
    }

    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // Snap onto a Boss Citadel if clicked very close to one
    let snapEntry: PositionedBossEntry | null = null;
    let snapDist = 4.2;
    for (const entry of positionedBosses) {
      const d = Math.hypot(clickX - entry.node.x, clickY - entry.node.y);
      if (d < snapDist) {
        snapDist = d;
        snapEntry = entry;
      }
    }

    if (snapEntry) {
      lastSyncedBossIdRef.current = snapEntry.boss.id;
      onSelectBoss(snapEntry.boss);
      startMarchTo(snapEntry.node.x, snapEntry.node.y);
    } else {
      startMarchTo(clickX, clickY);
    }
  };

  const handleWheelViewport = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.ctrlKey || zoom > 1.01) {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.18 : -0.18;
      applyZoom(zoom + delta);
    }
  };

  const handleClickBossPin = (e: React.MouseEvent, entry: PositionedBossEntry) => {
    e.stopPropagation();
    const distFromPawn = Math.hypot(pawnPos.x - entry.node.x, pawnPos.y - entry.node.y);
    lastSyncedBossIdRef.current = entry.boss.id;
    onSelectBoss(entry.boss);

    if (distFromPawn <= 2.4 && selectedBossId === entry.boss.id) {
      onChallengeBoss(entry.boss);
    } else {
      startMarchTo(entry.node.x, entry.node.y);
    }
  };

  return (
    <div className="vaeloria-world-map-shell">
      {/* Top Cartographic Telemetry Bar */}
      <div className="vwm-hud-top">
        <div
          className="vwm-territory-pill"
          style={{ borderColor: `${currentTerritory.color}66` }}
        >
          <span className="vwm-territory-icon">{currentTerritory.icon}</span>
          <div className="vwm-territory-texts">
            <span className="vwm-territory-kicker">
              {currentTerritory.cardinalLabel} • POSIÇÃO DO SOBERANO
            </span>
            <strong className="font-cinzel vwm-territory-title" style={{ color: currentTerritory.color }}>
              {currentTerritory.name}
              <span className="vwm-territory-landmark">
                {' '}
                — {dockedBossEntry ? dockedBossEntry.node.landmarkName : currentTerritory.subtitle}
              </span>
            </strong>
          </div>
        </div>

        <div className="vwm-controls-group">
          <button
            type="button"
            className={`vwm-tool-btn ${showGeographyLabels ? 'is-active' : ''}`}
            onClick={() => setShowGeographyLabels((v) => !v)}
            title="Mostrar ou ocultar nomes geográficos dos reinos e marcos"
          >
            🏷️ Geografia
          </button>
          <button
            type="button"
            className="vwm-tool-btn"
            onClick={() => applyZoom(zoom - 0.25)}
            disabled={zoom <= 1.01}
            title="Afastar mapa"
          >
            −
          </button>
          <button
            type="button"
            className="vwm-tool-btn vwm-zoom-readout"
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            title="Restaurar visão continental completa (100%)"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            type="button"
            className="vwm-tool-btn"
            onClick={() => applyZoom(zoom + 0.25)}
            disabled={zoom >= 2.24}
            title="Aproximar mapa"
          >
            +
          </button>
          <button
            type="button"
            className="vwm-tool-btn"
            onClick={handleCenterOnSovereign}
            title="Focar câmera na posição atual do seu Soberano"
          >
            🎯 Soberano
          </button>
        </div>
      </div>

      {/* Main 16:9 Traversable Continent Viewport */}
      <div
        ref={viewportRef}
        className={`vwm-viewport ${zoom > 1.01 ? 'is-zoomed' : ''}`}
        onPointerDown={handlePointerDownViewport}
        onPointerMove={handlePointerMoveViewport}
        onPointerUp={handlePointerUpViewport}
        onPointerCancel={handlePointerUpViewport}
        onWheel={handleWheelViewport}
      >
        <div
          ref={canvasRef}
          className="vwm-canvas"
          style={{
            transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
          }}
        >
          {/* Illustrated High-Resolution Vaeloria Continent */}
          <img
            src={VAELORIA_WORLD_MAP_IMAGE}
            alt="Mapa Continental de Vaeloria"
            className="vwm-terrain-img"
            draggable={false}
          />

          {/* Vector SVG Layer: Roads, March Trail, Compass Rose & Geographic Labels */}
          <svg
            className="vwm-svg-layer"
            viewBox="0 0 1600 900"
            preserveAspectRatio="none"
          >
            <defs>
              <filter id="vwmTextShadow" x="-25%" y="-25%" width="150%" height="150%">
                <feDropShadow dx="0" dy="2" stdDeviation="3.5" floodColor="#020617" floodOpacity="0.96" />
                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#020617" floodOpacity="0.88" />
              </filter>
            </defs>

            {/* Sequential Overland Roads */}
            {positionedBosses.map((entry, idx) => {
              if (idx === 0) return null;
              const prev = positionedBosses[idx - 1];
              const x1 = prev.node.x * 16;
              const y1 = prev.node.y * 9;
              const x2 = entry.node.x * 16;
              const y2 = entry.node.y * 9;
              const mx = (x1 + x2) / 2;
              const my = (y1 + y2) / 2 - Math.min(48, Math.hypot(x2 - x1, y2 - y1) * 0.11);

              const bothCleared =
                clearedBossIds.includes(prev.boss.id) && clearedBossIds.includes(entry.boss.id);
              const isFrontierRoad =
                clearedBossIds.includes(prev.boss.id) && entry.boss.id === nextUnclearBossId;

              return (
                <path
                  key={`road-${prev.boss.id}-${entry.boss.id}`}
                  d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
                  fill="none"
                  className={`vwm-road-path ${
                    bothCleared
                      ? 'is-cleared-road'
                      : isFrontierRoad
                      ? 'is-frontier-road'
                      : ''
                  }`}
                />
              );
            })}

            {/* Active Overland March Route */}
            {marchTarget && marchOrigin && (
              <g className="vwm-march-route-group">
                <line
                  x1={pawnPos.x * 16}
                  y1={pawnPos.y * 9}
                  x2={marchTarget.x * 16}
                  y2={marchTarget.y * 9}
                  className="vwm-march-line"
                />
                <circle
                  cx={marchTarget.x * 16}
                  cy={marchTarget.y * 9}
                  r="13"
                  className="vwm-march-beacon"
                />
              </g>
            )}

            {/* Canonical Kingdom Banners & Landmarks */}
            {showGeographyLabels && (
              <g filter="url(#vwmTextShadow)">
                {VAELORIA_SUB_LANDMARKS.map((lm) => (
                  <text
                    key={lm.id}
                    x={lm.x * 16}
                    y={lm.y * 9}
                    textAnchor="middle"
                    className="vwm-sublandmark-label"
                  >
                    ✦ {lm.name}
                  </text>
                ))}

                {VAELORIA_MAP_TERRITORIES.map((reg) => (
                  <g key={reg.id} transform={`translate(${reg.labelX * 16}, ${reg.labelY * 9})`}>
                    <text
                      x="0"
                      y="-11"
                      textAnchor="middle"
                      className="vwm-region-cardinal"
                      fill={reg.color}
                    >
                      {reg.cardinalLabel}
                    </text>
                    <text x="0" y="9" textAnchor="middle" className="vwm-region-title">
                      {reg.name}
                    </text>
                  </g>
                ))}
              </g>
            )}

            {/* Engraved Cartographic Compass Rose (Bottom-Right Ocean) */}
            <g transform="translate(1490, 800)" opacity="0.88" filter="url(#vwmTextShadow)">
              <circle
                cx="0"
                cy="0"
                r="46"
                fill="rgba(7, 11, 20, 0.72)"
                stroke="rgba(230, 200, 117, 0.55)"
                strokeWidth="1.8"
              />
              <circle
                cx="0"
                cy="0"
                r="36"
                fill="none"
                stroke="rgba(230, 200, 117, 0.28)"
                strokeDasharray="3 3"
              />
              <polygon points="0,-40 7,-8 0,-14 -7,-8" fill="#facc15" />
              <polygon points="0,40 6,8 0,14 -6,8" fill="#10b981" />
              <polygon points="-40,0 -8,-6 -14,0 -8,6" fill="#a855f7" />
              <polygon points="40,0 8,-6 14,0 8,6" fill="#eab308" />
              <circle cx="0" cy="0" r="5" fill="#fef08a" />
              <text x="0" y="-48" textAnchor="middle" className="vwm-compass-letter" fill="#fde047">
                N
              </text>
              <text x="0" y="59" textAnchor="middle" className="vwm-compass-letter" fill="#6ee7b7">
                S
              </text>
              <text x="-53" y="4" textAnchor="middle" className="vwm-compass-letter" fill="#d8b4fe">
                O
              </text>
              <text x="53" y="4" textAnchor="middle" className="vwm-compass-letter" fill="#fde047">
                L
              </text>
            </g>
          </svg>

          {/* Boss Citadel Pins */}
          {positionedBosses.map((entry) => {
            const { boss, node } = entry;
            const isSelected = boss.id === selectedBossId;
            const isCleared = clearedBossIds.includes(boss.id);
            const isNextTarget = boss.id === nextUnclearBossId;
            const isHovered = hoveredBossId === boss.id;
            const isDockedHere = dockedBossEntry?.boss.id === boss.id;
            const domColor = DOMAIN_META[boss.domains[0] ?? 'neutral'].color;
            const bossCard = CARDS_BY_ID[boss.avatarCardId];
            const isFinalWheel = boss.stage === 26 || (mode === 'expedition' && boss.stage === 9);

            return (
              <button
                key={boss.id}
                type="button"
                className={`vwm-boss-node ${isSelected ? 'is-selected' : ''} ${
                  isCleared ? 'is-cleared' : ''
                } ${isNextTarget ? 'is-next-target' : ''} ${isFinalWheel ? 'is-axial-apex' : ''} ${
                  node.y < 23 ? 'is-near-top' : ''
                } ${node.x < 16 ? 'is-near-left' : node.x > 84 ? 'is-near-right' : ''}`}
                style={
                  {
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    '--pin-color': domColor,
                  } as React.CSSProperties
                }
                onClick={(e) => handleClickBossPin(e, entry)}
                onMouseEnter={() => setHoveredBossId(boss.id)}
                onMouseLeave={() => setHoveredBossId((prev) => (prev === boss.id ? null : prev))}
                title={`${boss.name} — ${node.landmarkName} (${node.regionName})`}
              >
                <span className="vwm-boss-node-ring" />
                <span className="vwm-boss-node-portrait">
                  {bossCard?.imagePath ? (
                    <img src={bossCard.imagePath} alt={boss.name} draggable={false} />
                  ) : (
                    <span>⚔️</span>
                  )}
                </span>
                <span className="vwm-boss-stage-badge">
                  {isCleared ? `✓${boss.stage}` : boss.stage}
                </span>

                {!isDockedHere && (isSelected || isHovered) && (
                  <span className="vwm-boss-tooltip">
                    <strong>{boss.name}</strong>
                    <em>📍 {node.landmarkName}</em>
                  </span>
                )}
              </button>
            );
          })}

          {/* Traversable Sovereign Avatar Token */}
          <div
            className={`vwm-sovereign-pawn ${marchTarget ? 'is-marching' : ''} ${
              facingLeft ? 'is-facing-left' : ''
            } ${pawnPos.y < 23 ? 'is-near-top' : ''} ${
              pawnPos.x < 16 ? 'is-near-left' : pawnPos.x > 84 ? 'is-near-right' : ''
            }`}
            style={{
              left: `${pawnPos.x}%`,
              top: `${pawnPos.y}%`,
            }}
          >
            {dockedBossEntry && (
              <button
                type="button"
                className="vwm-pawn-challenge-pill"
                onClick={(e) => {
                  e.stopPropagation();
                  onChallengeBoss(dockedBossEntry.boss);
                }}
              >
                ⚔️ Desafiar #{dockedBossEntry.boss.stage}
              </button>
            )}

            <div className="vwm-pawn-aura" />
            <div className="vwm-pawn-token" title={`${sovereignLabel} — Em marcha por Vaeloria`}>
              {sovereignCard?.imagePath ? (
                <img src={sovereignCard.imagePath} alt={sovereignLabel} draggable={false} />
              ) : (
                <span className="vwm-pawn-crown">👑</span>
              )}
            </div>
            <div className="vwm-pawn-pedestal" />
          </div>
        </div>

        {/* On-Screen Directional March Pad (Mobile & Mouse Free-Roaming) */}
        <div
          className="vwm-dpad"
          onPointerUp={() => {
            dpadDirRef.current = { dx: 0, dy: 0 };
          }}
          onPointerLeave={() => {
            dpadDirRef.current = { dx: 0, dy: 0 };
          }}
        >
          <button
            type="button"
            className="vwm-dpad-btn up"
            onPointerDown={(e) => {
              e.stopPropagation();
              dpadDirRef.current = { dx: 0, dy: -1 };
            }}
            aria-label="Marchar para o Norte"
            title="Marchar para o Norte (W / ↑)"
          >
            ▲
          </button>
          <button
            type="button"
            className="vwm-dpad-btn left"
            onPointerDown={(e) => {
              e.stopPropagation();
              dpadDirRef.current = { dx: -1, dy: 0 };
            }}
            aria-label="Marchar para o Oeste"
            title="Marchar para o Oeste (A / ←)"
          >
            ◀
          </button>
          <button
            type="button"
            className="vwm-dpad-btn center"
            onClick={(e) => {
              e.stopPropagation();
              if (selectedEntry) {
                startMarchTo(selectedEntry.node.x, selectedEntry.node.y);
              }
            }}
            title="Marchar até a cidadela selecionada"
          >
            👑
          </button>
          <button
            type="button"
            className="vwm-dpad-btn right"
            onPointerDown={(e) => {
              e.stopPropagation();
              dpadDirRef.current = { dx: 1, dy: 0 };
            }}
            aria-label="Marchar para o Leste"
            title="Marchar para o Leste (D / →)"
          >
            ▶
          </button>
          <button
            type="button"
            className="vwm-dpad-btn down"
            onPointerDown={(e) => {
              e.stopPropagation();
              dpadDirRef.current = { dx: 0, dy: 1 };
            }}
            aria-label="Marchar para o Sul"
            title="Marchar para o Sul (S / ↓)"
          >
            ▼
          </button>
        </div>
      </div>

      {/* Subtle Cartographic Footer Hint (Outside viewport so it never covers Veridia) */}
      <div className="vwm-footer-hint">
        <span>
          🥾 Clique em qualquer região ou cidadela para marchar • <strong>WASD / Setas</strong> para explorar • <strong>Enter</strong> ou 2º clique para duelar
        </span>
      </div>
    </div>
  );
};
