import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { CARDS_BY_ID } from '../data/cards';
import { playSfx } from '../utils/soundEngine';
import { VAELORIA_WORLD_MAP_IMAGE, VAELORIA_MAP_TERRITORIES } from '../data/vaeloriaMapData';
import {
  CONQUEST_FACTIONS,
  CONQUEST_MAP_HEIGHT,
  CONQUEST_MAP_WIDTH,
  CONQUEST_PROVINCES,
  CONQUEST_PROVINCES_BY_ID,
  ConquestFactionId,
  ConquestProvinceDef,
  getConquestMapGeometries,
} from '../data/vaeloriaConquestData';

export interface ActiveInvasionVector {
  fromProvinceId: string;
  toProvinceId: string;
  attackerFactionId: ConquestFactionId;
}

export interface ConquestMegamapProps {
  playerFactionId: ConquestFactionId;
  provinceOwners: Record<string, ConquestFactionId>;
  fortifications: Record<string, number>;
  truces: Record<string, number>;
  selectedProvinceId: string;
  attackableProvinceIds: Set<string>;
  activeInvasion?: ActiveInvasionVector | null;
  sovereignAvatarCardId?: string;
  hasActedThisSeason: boolean;
  onSelectProvince: (province: ConquestProvinceDef) => void;
  onLaunchSiege: (province: ConquestProvinceDef) => void;
}

const SETTLEMENT_KIND_ICON: Record<string, string> = {
  village: '⛺',
  mine: '⛏️',
  watchtower: '🗼',
  harbor: '⚓',
  shrine: '⛩️',
};

const TERRAIN_KIND_ICON: Record<string, string> = {
  citadel: '🏰',
  mountain_pass: '⛰️',
  port: '⚓',
  forge: '🔥',
  sanctuary: '✦',
  marsh: '☠️',
  forest: '🌲',
  glacier: '❄️',
  skyway: '🐉',
};

export const ConquestMegamap: React.FC<ConquestMegamapProps> = ({
  playerFactionId,
  provinceOwners,
  fortifications,
  truces,
  selectedProvinceId,
  attackableProvinceIds,
  activeInvasion,
  sovereignAvatarCardId,
  hasActedThisSeason,
  onSelectProvince,
  onLaunchSiege,
}) => {
  const geometries = useMemo(() => getConquestMapGeometries(), []);

  const selectedProvince =
    CONQUEST_PROVINCES_BY_ID[selectedProvinceId] ?? CONQUEST_PROVINCES[0];

  const [pawnPos, setPawnPos] = useState<{ x: number; y: number }>(() => ({
    x: selectedProvince.x,
    y: selectedProvince.y,
  }));
  const [marchTarget, setMarchTarget] = useState<{ x: number; y: number } | null>(null);
  const [facingLeft, setFacingLeft] = useState<boolean>(false);

  const [zoom, setZoom] = useState<number>(1.35);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [overlayMode, setOverlayMode] = useState<'political' | 'terrain'>('political');
  const [hoveredProvId, setHoveredProvId] = useState<string | null>(null);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const pawnPosRef = useRef(pawnPos);
  pawnPosRef.current = pawnPos;

  const heldKeysRef = useRef<Set<string>>(new Set());
  const dpadDirRef = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });
  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    startPanX: 0,
    startPanY: 0,
  });

  // Semantic Level of Detail (LOD 1: Empire | LOD 2: Strategic Provinces | LOD 3: Local Tactical)
  const lodLevel: 1 | 2 | 3 = zoom < 1.55 ? 1 : zoom < 2.35 ? 2 : 3;

  const clampPan = useCallback((nextPan: { x: number; y: number }, nextZoom: number) => {
    if (nextZoom <= 1.01 || !viewportRef.current) {
      return { x: 0, y: 0 };
    }
    const rect = viewportRef.current.getBoundingClientRect();
    const maxX = ((nextZoom - 1) * rect.width) / 2;
    const maxY = ((nextZoom - 1) * rect.height) / 2;
    return {
      x: Math.max(-maxX, Math.min(maxX, nextPan.x)),
      y: Math.max(-maxY, Math.min(maxY, nextPan.y)),
    };
  }, []);

  const applyZoom = useCallback(
    (rawZoom: number) => {
      const nextZoom = Math.max(1, Math.min(3.8, Number(rawZoom.toFixed(2))));
      setZoom(nextZoom);
      setPan((prev) => clampPan(prev, nextZoom));
    },
    [clampPan]
  );

  const focusCameraOnPercent = useCallback(
    (pctX: number, pctY: number, minTargetZoom = 1.8) => {
      if (!viewportRef.current) return;
      const targetZoom = Math.max(zoom, minTargetZoom);
      const rect = viewportRef.current.getBoundingClientRect();
      const desiredX = ((50 - pctX) / 100) * rect.width * targetZoom;
      const desiredY = ((50 - pctY) / 100) * rect.height * targetZoom;
      setZoom(targetZoom);
      setPan(clampPan({ x: desiredX, y: desiredY }, targetZoom));
    },
    [zoom, clampPan]
  );

  const startMarchTo = useCallback((destX: number, destY: number, silent = false) => {
    const cx = Math.max(5, Math.min(95, destX));
    const cy = Math.max(6, Math.min(94, destY));
    const cur = pawnPosRef.current;
    if (Math.hypot(cx - cur.x, cy - cur.y) < 0.35) {
      setMarchTarget(null);
      return;
    }
    if (Math.abs(cx - cur.x) > 0.3) {
      setFacingLeft(cx < cur.x);
    }
    setMarchTarget({ x: cx, y: cy });
    if (!silent) {
      playSfx('draw');
    }
  }, []);

  // Center camera on player's capital on initial mount
  const didInitialFocusRef = useRef(false);
  useEffect(() => {
    if (didInitialFocusRef.current) return;
    didInitialFocusRef.current = true;
    const capId = CONQUEST_FACTIONS[playerFactionId].capitalProvinceId;
    const cap = CONQUEST_PROVINCES_BY_ID[capId];
    if (cap) {
      setPawnPos({ x: cap.x, y: cap.y });
      pawnPosRef.current = { x: cap.x, y: cap.y };
      requestAnimationFrame(() => {
        focusCameraOnPercent(cap.x, cap.y, 1.55);
      });
    }
  }, [playerFactionId, focusCameraOnPercent]);

  // Sync Sovereign pawn when selectedProvinceId changes externally
  const lastSelectedRef = useRef(selectedProvinceId);
  useEffect(() => {
    if (selectedProvinceId !== lastSelectedRef.current) {
      lastSelectedRef.current = selectedProvinceId;
      const prov = CONQUEST_PROVINCES_BY_ID[selectedProvinceId];
      if (prov) {
        startMarchTo(prov.x, prov.y, true);
      }
    }
  }, [selectedProvinceId, startMarchTo]);

  // Auto-focus camera if an AI invasion alarm triggers!
  useEffect(() => {
    if (!activeInvasion) return;
    const targetProv = CONQUEST_PROVINCES_BY_ID[activeInvasion.toProvinceId];
    if (targetProv) {
      focusCameraOnPercent(targetProv.x, targetProv.y, 2.0);
    }
  }, [activeInvasion, focusCameraOnPercent]);

  // RAF loop for smooth Sovereign movement (Click-to-march + WASD/Arrows/D-pad)
  useEffect(() => {
    let rafId = 0;
    let lastTs = performance.now();

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - lastTs) / 1000);
      lastTs = now;

      let kdx = dpadDirRef.current.dx;
      let kdy = dpadDirRef.current.dy;
      const keys = heldKeysRef.current;
      if (keys.has('w') || keys.has('arrowup')) kdy -= 1;
      if (keys.has('s') || keys.has('arrowdown')) kdy += 1;
      if (keys.has('a') || keys.has('arrowleft')) kdx -= 1;
      if (keys.has('d') || keys.has('arrowright')) kdx += 1;

      if (kdx !== 0 || kdy !== 0) {
        const mag = Math.hypot(kdx, kdy) || 1;
        const speed = 24;
        const cur = pawnPosRef.current;
        const nx = Math.max(5, Math.min(95, cur.x + (kdx / mag) * speed * dt));
        const ny = Math.max(6, Math.min(94, cur.y + (kdy / mag) * speed * dt));
        if (Math.abs(kdx) > 0.1) setFacingLeft(kdx < 0);
        if (marchTarget) setMarchTarget(null);
        pawnPosRef.current = { x: nx, y: ny };
        setPawnPos({ x: nx, y: ny });

        let closest: ConquestProvinceDef | null = null;
        let bestD = 4.6;
        for (const p of CONQUEST_PROVINCES) {
          const d = Math.hypot(nx - p.x, ny - p.y);
          if (d < bestD) {
            bestD = d;
            closest = p;
          }
        }
        if (closest && closest.id !== lastSelectedRef.current) {
          lastSelectedRef.current = closest.id;
          playSfx('channel');
          onSelectProvince(closest);
        }
      } else if (marchTarget) {
        const cur = pawnPosRef.current;
        const dx = marchTarget.x - cur.x;
        const dy = marchTarget.y - cur.y;
        const dist = Math.hypot(dx, dy);
        const speed = Math.max(30, dist * 2.5);
        const stepLen = speed * dt;
        if (dist <= stepLen || dist < 0.35) {
          pawnPosRef.current = { x: marchTarget.x, y: marchTarget.y };
          setPawnPos({ x: marchTarget.x, y: marchTarget.y });
          setMarchTarget(null);
        } else {
          const nx = cur.x + (dx / dist) * stepLen;
          const ny = cur.y + (dy / dist) * stepLen;
          pawnPosRef.current = { x: nx, y: ny };
          setPawnPos({ x: nx, y: ny });
        }
      }

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [marchTarget, onSelectProvince]);

  // WASD / Arrow Keys listener
  useEffect(() => {
    const isEditable = (el: EventTarget | null) => {
      if (!(el instanceof HTMLElement)) return false;
      const t = el.tagName.toLowerCase();
      return t === 'input' || t === 'textarea' || t === 'select' || el.isContentEditable;
    };
    const onDown = (e: KeyboardEvent) => {
      if (isEditable(e.target)) return;
      const k = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) {
        e.preventDefault();
        heldKeysRef.current.add(k);
      }
    };
    const onUp = (e: KeyboardEvent) => heldKeysRef.current.delete(e.key.toLowerCase());
    const onBlur = () => heldKeysRef.current.clear();

    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  // Unique undirected road pairs across the 30 provinces
  const roadLinks = useMemo(() => {
    const seen = new Set<string>();
    const links: { a: ConquestProvinceDef; b: ConquestProvinceDef; isNavalOrSky: boolean }[] = [];
    for (const p of CONQUEST_PROVINCES) {
      for (const nid of p.neighbors) {
        const nb = CONQUEST_PROVINCES_BY_ID[nid];
        if (!nb) continue;
        const key = p.id < nb.id ? `${p.id}|${nb.id}` : `${nb.id}|${p.id}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const isPolarCrossing =
          (p.initialOwner === 'vortex') !== (nb.initialOwner === 'vortex') ||
          p.terrainKind === 'skyway' ||
          nb.terrainKind === 'skyway';
        links.push({ a: p, b: nb, isNavalOrSky: isPolarCrossing });
      }
    }
    return links;
  }, []);

  const dockedProvince = useMemo(() => {
    let best: ConquestProvinceDef | null = null;
    let bestD = 4.2;
    for (const p of CONQUEST_PROVINCES) {
      const d = Math.hypot(pawnPos.x - p.x, pawnPos.y - p.y);
      if (d < bestD) {
        bestD = d;
        best = p;
      }
    }
    return best;
  }, [pawnPos.x, pawnPos.y]);

  const canChallengeDocked =
    Boolean(dockedProvince) &&
    !hasActedThisSeason &&
    attackableProvinceIds.has(dockedProvince!.id);

  const playerFaction = CONQUEST_FACTIONS[playerFactionId];
  const sovereignCard = sovereignAvatarCardId ? CARDS_BY_ID[sovereignAvatarCardId] : undefined;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    dragRef.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      startPanX: pan.x,
      startPanY: pan.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const st = dragRef.current;
    if (!st.active) return;
    const dx = e.clientX - st.startX;
    const dy = e.clientY - st.startY;
    if (Math.hypot(dx, dy) > 6) {
      st.moved = true;
    }
    if (st.moved && zoom > 1.01) {
      setPan(clampPan({ x: st.startPanX + dx, y: st.startPanY + dy }, zoom));
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const st = dragRef.current;
    dragRef.current.active = false;
    if (st.moved) return;

    const targetEl = e.target as HTMLElement | null;
    if (
      targetEl?.closest(
        '.cqm-prov-pin, .vwm-pawn-challenge-pill, .vwm-dpad, .cqm-poly-hit'
      )
    ) {
      return;
    }

    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;
    startMarchTo(clickX, clickY);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.24 : -0.24;
    applyZoom(zoom + delta);
  };

  const handleActivateProvince = (e: React.MouseEvent, prov: ConquestProvinceDef) => {
    e.stopPropagation();
    const dist = Math.hypot(pawnPos.x - prov.x, pawnPos.y - prov.y);
    lastSelectedRef.current = prov.id;
    onSelectProvince(prov);

    if (
      dist <= 2.8 &&
      selectedProvinceId === prov.id &&
      !hasActedThisSeason &&
      attackableProvinceIds.has(prov.id)
    ) {
      onLaunchSiege(prov);
    } else {
      startMarchTo(prov.x, prov.y);
    }
  };

  return (
    <div className="conquest-megamap-shell">
      {/* Top Megamap Telemetry & Multi-LOD Controls */}
      <div className="cqm-toolbar">
        <div className="cqm-lod-group">
          <span className={`cqm-lod-pill lod-${lodLevel}`}>
            {lodLevel === 1
              ? '🔭 LOD 1 • IMPÉRIOS'
              : lodLevel === 2
              ? '🗺️ LOD 2 • PROVÍNCIAS (30)'
              : '🔍 LOD 3 • TÁTICO LOCAL'}
          </span>

          <div className="vwm-mode-switch">
            <button
              type="button"
              className={`vwm-mode-switch-btn ${overlayMode === 'political' ? 'is-active' : ''}`}
              onClick={() => setOverlayMode('political')}
            >
              🎨 Político
            </button>
            <button
              type="button"
              className={`vwm-mode-switch-btn ${overlayMode === 'terrain' ? 'is-active' : ''}`}
              onClick={() => setOverlayMode('terrain')}
            >
              🏔️ Relevo Puro
            </button>
          </div>
        </div>

        <div className="vwm-controls-group">
          <button
            type="button"
            className="vwm-tool-btn"
            onClick={() => applyZoom(1)}
            title="Visão Continental 100% (LOD 1)"
          >
            🌍 1x
          </button>
          <button
            type="button"
            className="vwm-tool-btn"
            onClick={() => applyZoom(1.85)}
            title="Visão Estratégica de Províncias (LOD 2)"
          >
            🗺️ 1.8x
          </button>
          <button
            type="button"
            className="vwm-tool-btn"
            onClick={() => applyZoom(2.85)}
            title="Visão Tática de Vilas, Minas e Gargalos (LOD 3)"
          >
            🔍 2.8x
          </button>
          <button
            type="button"
            className="vwm-tool-btn"
            onClick={() => applyZoom(zoom - 0.3)}
            disabled={zoom <= 1.01}
          >
            −
          </button>
          <span className="cqm-zoom-pct">{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            className="vwm-tool-btn"
            onClick={() => applyZoom(zoom + 0.3)}
            disabled={zoom >= 3.79}
          >
            +
          </button>
          <button
            type="button"
            className="vwm-tool-btn"
            onClick={() => focusCameraOnPercent(pawnPos.x, pawnPos.y, Math.max(zoom, 1.9))}
            title="Centralizar câmera no seu Exército Real"
          >
            🎯 Exército
          </button>
        </div>
      </div>

      {/* Interactive 16:9 Deep-Zoom Megamap Viewport */}
      <div
        ref={viewportRef}
        className={`vwm-viewport cqm-viewport ${zoom > 1.01 ? 'is-zoomed' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
      >
        <div
          ref={canvasRef}
          className="vwm-canvas"
          style={{
            transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
          }}
        >
          {/* Seamless Vaeloria Base Terrain */}
          <img
            src={VAELORIA_WORLD_MAP_IMAGE}
            alt="Megamapa Continental de Vaeloria"
            className="vwm-terrain-img cqm-terrain-hd"
            draggable={false}
          />

          {/* High-Precision 3200x1800 Geopolitical SVG Mesh */}
          <svg
            className="cqm-svg-mesh"
            viewBox={`0 0 ${CONQUEST_MAP_WIDTH} ${CONQUEST_MAP_HEIGHT}`}
            preserveAspectRatio="none"
          >
            <defs>
              <filter id="cqmTextHalo" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#020617" floodOpacity="0.96" />
                <feDropShadow dx="0" dy="0" stdDeviation="7" floodColor="#020617" floodOpacity="0.9" />
              </filter>
              <pattern
                id="cqmTargetHatch"
                width="22"
                height="22"
                patternTransform="rotate(45 0 0)"
                patternUnits="userSpaceOnUse"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="22"
                  stroke="rgba(250, 204, 21, 0.35)"
                  strokeWidth="4"
                />
              </pattern>
              <marker
                id="cqmInvasionArrowHead"
                markerWidth="10"
                markerHeight="10"
                refX="8"
                refY="5"
                orient="auto"
              >
                <polygon points="0,0 10,5 0,10" fill="#ef4444" />
              </marker>
            </defs>

            {/* LOD 3 Fine Cartographic Latitude/Longitude Graticule */}
            {lodLevel >= 3 && (
              <g className="cqm-graticule-layer" opacity="0.24">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                  <line
                    key={`gx-${i}`}
                    x1={i * 320}
                    y1={0}
                    x2={i * 320}
                    y2={CONQUEST_MAP_HEIGHT}
                    stroke="#cbd5e1"
                    strokeWidth="1"
                    strokeDasharray="6 10"
                  />
                ))}
                {[1, 2, 3, 4, 5].map((j) => (
                  <line
                    key={`gy-${j}`}
                    x1={0}
                    y1={j * 300}
                    x2={CONQUEST_MAP_WIDTH}
                    y2={j * 300}
                    stroke="#cbd5e1"
                    strokeWidth="1"
                    strokeDasharray="6 10"
                  />
                ))}
              </g>
            )}

            {/* 1. Political Territory Polygons (30 Organic Provinces) */}
            <g className="cqm-provinces-polys">
              {CONQUEST_PROVINCES.map((prov) => {
                const geo = geometries.provinces[prov.id];
                if (!geo) return null;
                const ownerId = provinceOwners[prov.id] ?? prov.initialOwner;
                const faction = CONQUEST_FACTIONS[ownerId];
                const isSelected = prov.id === selectedProvinceId;
                const isHovered = prov.id === hoveredProvId;
                const isAttackable = !hasActedThisSeason && attackableProvinceIds.has(prov.id);
                const isPlayerOwned = ownerId === playerFactionId;

                return (
                  <g key={`poly-${prov.id}`}>
                    <path
                      d={geo.svgPath}
                      fill={
                        overlayMode === 'political'
                          ? faction.fillColor
                          : isSelected
                          ? 'rgba(250, 204, 21, 0.14)'
                          : 'rgba(15, 23, 42, 0.04)'
                      }
                      fillOpacity={
                        overlayMode === 'terrain'
                          ? 1
                          : isSelected || isHovered
                          ? 1
                          : isPlayerOwned
                          ? 0.92
                          : 0.72
                      }
                      stroke={
                        isSelected
                          ? '#fef08a'
                          : isAttackable && isHovered
                          ? '#f87171'
                          : overlayMode === 'political'
                          ? faction.color
                          : 'rgba(226, 232, 240, 0.22)'
                      }
                      strokeWidth={isSelected ? 4.5 : 1.4}
                      strokeOpacity={isSelected ? 0.98 : overlayMode === 'political' ? 0.42 : 0.25}
                      className="cqm-poly-hit"
                      onClick={(e) => handleActivateProvince(e, prov)}
                      onMouseEnter={() => setHoveredProvId(prov.id)}
                      onMouseLeave={() =>
                        setHoveredProvId((prev) => (prev === prov.id ? null : prev))
                      }
                    />
                    {isAttackable && (isSelected || isHovered) && (
                      <path
                        d={geo.svgPath}
                        fill="url(#cqmTargetHatch)"
                        pointerEvents="none"
                      />
                    )}
                  </g>
                );
              })}
            </g>

            {/* 2. Dynamic Empire Merging Borders vs Internal County Borders */}
            <g className="cqm-borders-layer" pointerEvents="none">
              {geometries.sharedBorders.map((b) => {
                const ownerA = provinceOwners[b.provA];
                const ownerB = provinceOwners[b.provB];
                const sameEmpire = ownerA === ownerB;

                if (sameEmpire) {
                  // Internal county border: hidden at LOD 1 so Empires fuse seamlessly!
                  if (lodLevel === 1) return null;
                  return (
                    <path
                      key={b.key}
                      d={b.svgPath}
                      fill="none"
                      stroke="rgba(226, 232, 240, 0.34)"
                      strokeWidth={lodLevel === 3 ? 1.5 : 1.9}
                      strokeDasharray="7 7"
                    />
                  );
                }

                const involvesPlayer = ownerA === playerFactionId || ownerB === playerFactionId;
                return (
                  <g key={b.key}>
                    <path
                      d={b.svgPath}
                      fill="none"
                      stroke="rgba(2, 6, 23, 0.9)"
                      strokeWidth={involvesPlayer ? 8 : 6}
                      strokeLinecap="round"
                    />
                    <path
                      d={b.svgPath}
                      fill="none"
                      stroke={involvesPlayer ? '#fde047' : '#f8fafc'}
                      strokeOpacity={involvesPlayer ? 0.95 : 0.65}
                      strokeWidth={involvesPlayer ? 3.4 : 2.3}
                      strokeLinecap="round"
                    />
                  </g>
                );
              })}
            </g>

            {/* 3. Continental Roads, Mountain Passes & Naval/Skyway Routes (LOD 2 & 3, or adjacent to selected) */}
            <g className="cqm-roads-layer" pointerEvents="none">
              {roadLinks.map((lnk) => {
                const touchesSelected =
                  lnk.a.id === selectedProvinceId || lnk.b.id === selectedProvinceId;
                if (lodLevel === 1 && !touchesSelected) return null;

                const x1 = (lnk.a.x / 100) * CONQUEST_MAP_WIDTH;
                const y1 = (lnk.a.y / 100) * CONQUEST_MAP_HEIGHT;
                const x2 = (lnk.b.x / 100) * CONQUEST_MAP_WIDTH;
                const y2 = (lnk.b.y / 100) * CONQUEST_MAP_HEIGHT;
                const mx = (x1 + x2) / 2;
                const my = (y1 + y2) / 2 - (lnk.isNavalOrSky ? 28 : 12);

                const isAttackVector =
                  !hasActedThisSeason &&
                  ((provinceOwners[lnk.a.id] === playerFactionId &&
                    attackableProvinceIds.has(lnk.b.id)) ||
                    (provinceOwners[lnk.b.id] === playerFactionId &&
                      attackableProvinceIds.has(lnk.a.id)));

                return (
                  <path
                    key={`rd-${lnk.a.id}-${lnk.b.id}`}
                    d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
                    fill="none"
                    stroke={
                      isAttackVector
                        ? 'rgba(251, 146, 60, 0.92)'
                        : lnk.isNavalOrSky
                        ? 'rgba(56, 189, 248, 0.65)'
                        : 'rgba(226, 232, 240, 0.45)'
                    }
                    strokeWidth={touchesSelected || isAttackVector ? 3.4 : 2.1}
                    strokeDasharray={lnk.isNavalOrSky ? '10 8' : '5 7'}
                  />
                );
              })}
            </g>

            {/* 4. LOD 1 Realm Macro Titles (Fade cleanly when zoomed deep into LOD 3) */}
            {lodLevel <= 2 && (
              <g filter="url(#cqmTextHalo)" pointerEvents="none" opacity={lodLevel === 1 ? 0.95 : 0.55}>
                {VAELORIA_MAP_TERRITORIES.map((reg) => (
                  <g
                    key={`macro-${reg.id}`}
                    transform={`translate(${(reg.labelX / 100) * CONQUEST_MAP_WIDTH}, ${
                      (reg.labelY / 100) * CONQUEST_MAP_HEIGHT
                    })`}
                  >
                    <text
                      x="0"
                      y="-18"
                      textAnchor="middle"
                      fill={reg.color}
                      fontSize="22"
                      fontWeight="900"
                      letterSpacing="5"
                      fontFamily="Cinzel, serif"
                    >
                      {reg.cardinalLabel}
                    </text>
                    <text
                      x="0"
                      y="18"
                      textAnchor="middle"
                      fill="#fffbeb"
                      fontSize="42"
                      fontWeight="900"
                      letterSpacing="6"
                      fontFamily="Cinzel, serif"
                    >
                      {reg.name}
                    </text>
                  </g>
                ))}
              </g>
            )}

            {/* 5. LOD 3 Local Micro-Settlements (75+ Villages, Mines, Harbors, Shrines, Watchtowers) */}
            {lodLevel >= 3 && (
              <g filter="url(#cqmTextHalo)" pointerEvents="none">
                {CONQUEST_PROVINCES.map((prov) =>
                  prov.microSettlements.map((ms, idx) => {
                    const sx = ((prov.x + ms.dx) / 100) * CONQUEST_MAP_WIDTH;
                    const sy = ((prov.y + ms.dy) / 100) * CONQUEST_MAP_HEIGHT;
                    return (
                      <g key={`${prov.id}-ms-${idx}`} transform={`translate(${sx}, ${sy})`}>
                        <circle
                          cx="0"
                          cy="0"
                          r="9"
                          fill="rgba(9, 13, 22, 0.88)"
                          stroke="rgba(250, 204, 21, 0.65)"
                          strokeWidth="1.4"
                        />
                        <text x="0" y="4" textAnchor="middle" fontSize="11">
                          {SETTLEMENT_KIND_ICON[ms.kind] ?? '•'}
                        </text>
                        <text
                          x="0"
                          y="21"
                          textAnchor="middle"
                          fill="#e2e8f0"
                          fontSize="13.5"
                          fontWeight="700"
                          fontFamily="Cinzel, serif"
                        >
                          {ms.name}
                        </text>
                      </g>
                    );
                  })
                )}
              </g>
            )}

            {/* 6. Active Sovereign March Line */}
            {marchTarget && (
              <g pointerEvents="none">
                <line
                  x1={(pawnPos.x / 100) * CONQUEST_MAP_WIDTH}
                  y1={(pawnPos.y / 100) * CONQUEST_MAP_HEIGHT}
                  x2={(marchTarget.x / 100) * CONQUEST_MAP_WIDTH}
                  y2={(marchTarget.y / 100) * CONQUEST_MAP_HEIGHT}
                  className="vwm-march-line"
                  strokeWidth="5"
                />
              </g>
            )}

            {/* 7. Active Enemy Invasion Alarm Vector */}
            {activeInvasion && (
              <g pointerEvents="none">
                {(() => {
                  const fromP = CONQUEST_PROVINCES_BY_ID[activeInvasion.fromProvinceId];
                  const toP = CONQUEST_PROVINCES_BY_ID[activeInvasion.toProvinceId];
                  if (!fromP || !toP) return null;
                  const x1 = (fromP.x / 100) * CONQUEST_MAP_WIDTH;
                  const y1 = (fromP.y / 100) * CONQUEST_MAP_HEIGHT;
                  const x2 = (toP.x / 100) * CONQUEST_MAP_WIDTH;
                  const y2 = (toP.y / 100) * CONQUEST_MAP_HEIGHT;
                  return (
                    <>
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#ef4444"
                        strokeWidth="8"
                        strokeDasharray="16 10"
                        markerEnd="url(#cqmInvasionArrowHead)"
                        className="cqm-invasion-arrow"
                      />
                      <circle
                        cx={x2}
                        cy={y2}
                        r="48"
                        fill="rgba(239, 68, 68, 0.22)"
                        stroke="#ef4444"
                        strokeWidth="4"
                      />
                    </>
                  );
                })()}
              </g>
            )}
          </svg>

          {/* Interactive Province Citadel & Garrison Nodes */}
          {CONQUEST_PROVINCES.map((prov) => {
            const ownerId = provinceOwners[prov.id] ?? prov.initialOwner;
            const ownerFaction = CONQUEST_FACTIONS[ownerId];
            const fortLvl = fortifications[prov.id] ?? 0;
            const hasTruce = (truces[ownerId] ?? 0) > 0;
            const isSelected = prov.id === selectedProvinceId;
            const isHovered = prov.id === hoveredProvId;
            const isAttackable = !hasActedThisSeason && attackableProvinceIds.has(prov.id);
            const isUnderSiege = activeInvasion?.toProvinceId === prov.id;

            // Counter-scale pins slightly at deep zoom so they never become huge blobs!
            const pinCounterScale = zoom > 1.6 ? Math.max(0.56, 1.15 / Math.sqrt(zoom)) : 1;

            return (
              <button
                key={prov.id}
                type="button"
                className={`cqm-prov-pin ${prov.isCapital ? 'is-capital' : ''} ${
                  isSelected ? 'is-selected' : ''
                } ${isAttackable ? 'is-attackable' : ''} ${
                  ownerId === playerFactionId ? 'is-player-owned' : ''
                } ${isUnderSiege ? 'is-under-siege' : ''}`}
                style={
                  {
                    left: `${prov.x}%`,
                    top: `${prov.y}%`,
                    '--prov-color': ownerFaction.color,
                    transform: `translate(-50%, -50%) scale(${pinCounterScale})`,
                  } as React.CSSProperties
                }
                onClick={(e) => handleActivateProvince(e, prov)}
                onMouseEnter={() => setHoveredProvId(prov.id)}
                onMouseLeave={() =>
                  setHoveredProvId((prev) => (prev === prov.id ? null : prev))
                }
                title={`${prov.name} (${ownerFaction.shortName}) • +${prov.supplyIncome}⚙️`}
              >
                <span className="cqm-pin-emblem">
                  {prov.isCapital ? '👑' : TERRAIN_KIND_ICON[prov.terrainKind] ?? ownerFaction.icon}
                </span>

                <span
                  className="cqm-pin-faction-dot"
                  style={{ backgroundColor: ownerFaction.color }}
                >
                  {ownerFaction.icon}
                </span>

                {fortLvl > 0 && <span className="cqm-pin-fort-badge">🛡️{fortLvl}</span>}
                {hasTruce && ownerId !== playerFactionId && (
                  <span className="cqm-pin-truce-badge" title="Trégua Diplomática Ativa">
                    🕊️
                  </span>
                )}

                {/* LOD-Aware Province Nameplate */}
                {(prov.isCapital || lodLevel >= 2 || isSelected || isHovered) && (
                  <span className="cqm-prov-label">
                    <strong>{prov.name}</strong>
                    {(lodLevel >= 3 || isSelected || isHovered) && (
                      <em>
                        {ownerFaction.shortName} • +{prov.supplyIncome}⚙️
                        {isAttackable ? ' • ⚔️ ALVO' : ''}
                      </em>
                    )}
                  </span>
                )}
              </button>
            );
          })}

          {/* Player's Traversable Imperial Army Pawn */}
          <div
            className={`vwm-sovereign-pawn ${marchTarget ? 'is-marching' : ''} ${
              facingLeft ? 'is-facing-left' : ''
            }`}
            style={{
              left: `${pawnPos.x}%`,
              top: `${pawnPos.y}%`,
              transform: `translate(-50%, -84%) scale(${
                zoom > 1.5 ? Math.max(0.58, 1.12 / Math.sqrt(zoom)) : 1
              })`,
            }}
          >
            {canChallengeDocked && dockedProvince && (
              <button
                type="button"
                className="vwm-pawn-challenge-pill"
                onClick={(e) => {
                  e.stopPropagation();
                  onLaunchSiege(dockedProvince);
                }}
              >
                ⚔️ Cercar {dockedProvince.isCapital ? 'Capital' : 'Província'}
              </button>
            )}

            <div className="vwm-pawn-aura" />
            <div
              className="vwm-pawn-token"
              style={{ borderColor: playerFaction.color }}
              title={`Exército Real de ${playerFaction.shortName}`}
            >
              {sovereignCard?.imagePath ? (
                <img src={sovereignCard.imagePath} alt={playerFaction.name} draggable={false} />
              ) : (
                <span className="vwm-pawn-crown">{playerFaction.icon}</span>
              )}
            </div>
            <div className="vwm-pawn-pedestal" style={{ background: playerFaction.color }} />
          </div>
        </div>

        {/* On-Screen Directional March Pad */}
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
          >
            ◀
          </button>
          <button
            type="button"
            className="vwm-dpad-btn center"
            onClick={(e) => {
              e.stopPropagation();
              focusCameraOnPercent(pawnPos.x, pawnPos.y, 2.1);
            }}
            title="Aproximar câmera no Exército"
          >
            {playerFaction.icon}
          </button>
          <button
            type="button"
            className="vwm-dpad-btn right"
            onPointerDown={(e) => {
              e.stopPropagation();
              dpadDirRef.current = { dx: 1, dy: 0 };
            }}
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
          >
            ▼
          </button>
        </div>

        <div className="vwm-bottom-hint">
          <span>
            🔍 Roda do mouse para <strong>Zoom LOD (1x–3.8x)</strong> • Clique numa província rival conectada para <strong>Cercar</strong> • <strong>WASD</strong> para marchar
          </span>
        </div>
      </div>
    </div>
  );
};
