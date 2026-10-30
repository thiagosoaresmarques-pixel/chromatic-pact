import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { CARDS_BY_ID } from '../data/cards';
import { playSfx } from '../utils/soundEngine';
import {
  VAELORIA_WORLD_MAP_IMAGE,
  VAELORIA_MAP_TERRITORIES,
  resolveNearestTerritory,
} from '../data/vaeloriaMapData';
import {
  CONQUEST_FACTIONS,
  CONQUEST_MAP_HEIGHT,
  CONQUEST_MAP_WIDTH,
  CONQUEST_PROVINCES,
  CONQUEST_PROVINCES_BY_ID,
  ConquestFactionId,
  ConquestProvinceDef,
  getConquestMapGeometries,
  getRegionalConquestGeometries,
} from '../data/vaeloriaConquestData';
import {
  PROVINCE_REGIONAL_COORDS,
  RegionalBorderPortal,
  VAELORIA_REALM_ORDER,
  VAELORIA_REGIONAL_MAPS,
  VaeloriaMapScope,
  VaeloriaRealmId,
  mapTerritoryIdToRealmId,
} from '../data/vaeloriaMultimapData';

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
  isDossierCollapsed?: boolean;
  onToggleDossier?: () => void;
  onSelectProvince: (province: ConquestProvinceDef) => void;
  onLaunchSiege: (province: ConquestProvinceDef) => void;
}

interface PositionedProvinceEntry {
  prov: ConquestProvinceDef;
  realm: VaeloriaRealmId;
  rx: number;
  ry: number;
  x: number;
  y: number;
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
  isDossierCollapsed = false,
  onToggleDossier,
  onSelectProvince,
  onLaunchSiege,
}) => {
  const isMobileViewport = () =>
    typeof window !== 'undefined' && window.innerWidth <= 768;

  const worldGeometries = useMemo(() => getConquestMapGeometries(), []);

  const [mapScope, setMapScope] = useState<VaeloriaMapScope>('world');
  const [isTheaterFullscreen, setIsTheaterFullscreen] = useState<boolean>(false);
  const [followPawn, setFollowPawn] = useState<boolean>(() => !isMobileViewport());
  const [showMinimap, setShowMinimap] = useState<boolean>(() => !isMobileViewport());
  const [portalBanner, setPortalBanner] = useState<string | null>(null);

  const selectedProvince =
    CONQUEST_PROVINCES_BY_ID[selectedProvinceId] ?? CONQUEST_PROVINCES[0];

  const enrichedAllProvinces = useMemo(() => {
    return CONQUEST_PROVINCES.map((prov) => {
      const reg = PROVINCE_REGIONAL_COORDS[prov.id] ?? {
        realm: prov.initialOwner as VaeloriaRealmId,
        rx: 50,
        ry: 50,
      };
      return {
        prov,
        realm: reg.realm,
        rx: reg.rx,
        ry: reg.ry,
      };
    });
  }, []);

  const realmProvinceStats = useMemo(() => {
    const stats: Record<VaeloriaRealmId, { total: number; owned: number }> = {
      veridia: { total: 0, owned: 0 },
      eclipse: { total: 0, owned: 0 },
      matrix: { total: 0, owned: 0 },
      solaria: { total: 0, owned: 0 },
      pyros: { total: 0, owned: 0 },
      vortex: { total: 0, owned: 0 },
    };
    for (const item of enrichedAllProvinces) {
      stats[item.realm].total += 1;
      const owner = provinceOwners[item.prov.id] ?? item.prov.initialOwner;
      if (owner === playerFactionId) {
        stats[item.realm].owned += 1;
      }
    }
    return stats;
  }, [enrichedAllProvinces, provinceOwners, playerFactionId]);

  const positionedProvinces: PositionedProvinceEntry[] = useMemo(() => {
    if (mapScope === 'world') {
      return enrichedAllProvinces.map((item) => ({
        ...item,
        x: item.prov.x,
        y: item.prov.y,
      }));
    }
    return enrichedAllProvinces
      .filter((item) => item.realm === mapScope)
      .map((item) => ({
        ...item,
        x: item.rx,
        y: item.ry,
      }));
  }, [mapScope, enrichedAllProvinces]);

  const activeGeometries = useMemo(() => {
    if (mapScope === 'world') {
      return worldGeometries;
    }
    const seeds = enrichedAllProvinces
      .filter((item) => item.realm === mapScope)
      .map((item) => ({
        provinceId: item.prov.id,
        rx: item.rx,
        ry: item.ry,
      }));
    return getRegionalConquestGeometries(mapScope, seeds);
  }, [mapScope, worldGeometries, enrichedAllProvinces]);

  const [pawnPos, setPawnPos] = useState<{ x: number; y: number }>(() => ({
    x: selectedProvince.x,
    y: selectedProvince.y,
  }));
  const [marchTarget, setMarchTarget] = useState<{ x: number; y: number } | null>(null);
  const [facingLeft, setFacingLeft] = useState<boolean>(false);

  const [zoom, setZoom] = useState<number>(() => (isMobileViewport() ? 1 : 1.75));
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [overlayMode, setOverlayMode] = useState<'political' | 'terrain'>('political');
  const [hoveredProvId, setHoveredProvId] = useState<string | null>(null);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const pawnPosRef = useRef(pawnPos);
  pawnPosRef.current = pawnPos;
  const mapScopeRef = useRef<VaeloriaMapScope>(mapScope);
  mapScopeRef.current = mapScope;
  const portalCooldownUntilRef = useRef<number>(0);

  const heldKeysRef = useRef<Set<string>>(new Set());
  const dpadDirRef = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });
  const activePointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchStartRef = useRef<{ dist: number; startZoom: number } | null>(null);
  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    startPanX: 0,
    startPanY: 0,
  });

  // Inside a Regional Map, LOD is automatically 3 (Tactical Local Detail!)
  const lodLevel: 1 | 2 | 3 =
    mapScope !== 'world' ? 3 : zoom < 1.55 ? 1 : zoom < 2.35 ? 2 : 3;

  useEffect(() => {
    if (!portalBanner) return;
    const t = window.setTimeout(() => setPortalBanner(null), 2800);
    return () => window.clearTimeout(t);
  }, [portalBanner]);

  useEffect(() => {
    if (!isTheaterFullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsTheaterFullscreen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isTheaterFullscreen]);

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

  const centerCameraAt = useCallback(
    (pctX: number, pctY: number, targetZoom: number) => {
      if (!viewportRef.current || targetZoom <= 1.01) {
        setPan({ x: 0, y: 0 });
        return;
      }
      const rect = viewportRef.current.getBoundingClientRect();
      const desiredX = ((50 - pctX) / 100) * rect.width * targetZoom;
      const desiredY = ((50 - pctY) / 100) * rect.height * targetZoom;
      setPan(clampPan({ x: desiredX, y: desiredY }, targetZoom));
    },
    [clampPan]
  );

  const applyZoom = useCallback(
    (rawZoom: number) => {
      const nextZoom = Math.max(1, Math.min(3.8, Number(rawZoom.toFixed(2))));
      setZoom(nextZoom);
      if (followPawn && nextZoom > 1.02) {
        centerCameraAt(pawnPosRef.current.x, pawnPosRef.current.y, nextZoom);
      } else {
        setPan((prev) => clampPan(prev, nextZoom));
      }
    },
    [clampPan, followPawn, centerCameraAt]
  );

  const focusCameraOnPercent = useCallback(
    (pctX: number, pctY: number, minTargetZoom = 1.8) => {
      const targetZoom = Math.max(zoom, minTargetZoom);
      setZoom(targetZoom);
      centerCameraAt(pctX, pctY, targetZoom);
    },
    [zoom, centerCameraAt]
  );

  useEffect(() => {
    if (!followPawn || zoom <= 1.02) return;
    centerCameraAt(pawnPos.x, pawnPos.y, zoom);
  }, [followPawn, pawnPos.x, pawnPos.y, zoom, centerCameraAt]);

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

  const lastSelectedRef = useRef(selectedProvinceId);

  const handleSwitchMapScope = useCallback(
    (
      nextScope: VaeloriaMapScope,
      arrivalOverride?: { x: number; y: number; banner?: string }
    ) => {
      if (nextScope === mapScopeRef.current && !arrivalOverride) return;
      portalCooldownUntilRef.current = performance.now() + 1100;
      setMarchTarget(null);
      playSfx('channel');

      if (nextScope === 'world') {
        const selProv = CONQUEST_PROVINCES_BY_ID[selectedProvinceId] ?? CONQUEST_PROVINCES[0];
        mapScopeRef.current = 'world';
        setMapScope('world');
        pawnPosRef.current = { x: selProv.x, y: selProv.y };
        setPawnPos({ x: selProv.x, y: selProv.y });
        const nextZ = isMobileViewport() ? 1 : 1.75;
        setZoom(nextZ);
        requestAnimationFrame(() => {
          centerCameraAt(selProv.x, selProv.y, nextZ);
        });
        setPortalBanner('🌍 Megamapa Continental de Vaeloria (30 Províncias)');
        return;
      }

      const regDef = VAELORIA_REGIONAL_MAPS[nextScope];
      const realmProvs = enrichedAllProvinces.filter((p) => p.realm === nextScope);
      const activeInRealm = realmProvs.find((p) => p.prov.id === selectedProvinceId);
      const preferred =
        activeInRealm ??
        realmProvs.find((p) => p.prov.isCapital) ??
        realmProvs[0];

      const destX = arrivalOverride?.x ?? preferred?.rx ?? 50;
      const destY = arrivalOverride?.y ?? preferred?.ry ?? 50;

      mapScopeRef.current = nextScope;
      setMapScope(nextScope);
      pawnPosRef.current = { x: destX, y: destY };
      setPawnPos({ x: destX, y: destY });
      setZoom(1);
      setPan({ x: 0, y: 0 });

      if (!arrivalOverride && preferred && preferred.prov.id !== selectedProvinceId) {
        lastSelectedRef.current = preferred.prov.id;
        onSelectProvince(preferred.prov);
      }

      setPortalBanner(
        arrivalOverride?.banner ?? `${regDef.icon} ${regDef.name} (5 Províncias)`
      );
    },
    [selectedProvinceId, enrichedAllProvinces, centerCameraAt, onSelectProvince]
  );

  const handleTraversePortal = useCallback(
    (portal: RegionalBorderPortal) => {
      const targetDef = VAELORIA_REGIONAL_MAPS[portal.targetRealm];
      handleSwitchMapScope(portal.targetRealm, {
        x: portal.arrivalX,
        y: portal.arrivalY,
        banner: `🧭 Exército cruzou a fronteira: ${targetDef.icon} ${targetDef.name}`,
      });
    },
    [handleSwitchMapScope]
  );

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
      if (!isMobileViewport()) {
        requestAnimationFrame(() => {
          focusCameraOnPercent(cap.x, cap.y, 1.75);
        });
      }
    }
  }, [playerFactionId, focusCameraOnPercent]);

  // Sync Sovereign pawn when selectedProvinceId changes externally
  useEffect(() => {
    if (selectedProvinceId !== lastSelectedRef.current) {
      lastSelectedRef.current = selectedProvinceId;
      const prov = CONQUEST_PROVINCES_BY_ID[selectedProvinceId];
      if (!prov) return;
      if (mapScopeRef.current === 'world') {
        startMarchTo(prov.x, prov.y, true);
      } else {
        const reg = PROVINCE_REGIONAL_COORDS[prov.id];
        if (reg && reg.realm !== mapScopeRef.current) {
          handleSwitchMapScope(reg.realm, { x: reg.rx, y: reg.ry });
        } else if (reg) {
          startMarchTo(reg.rx, reg.ry, true);
        }
      }
    }
  }, [selectedProvinceId, startMarchTo, handleSwitchMapScope]);

  // Auto-focus camera if an AI invasion alarm triggers!
  useEffect(() => {
    if (!activeInvasion) return;
    const targetProv = CONQUEST_PROVINCES_BY_ID[activeInvasion.toProvinceId];
    if (!targetProv) return;
    if (mapScopeRef.current !== 'world') {
      handleSwitchMapScope('world');
    }
    focusCameraOnPercent(targetProv.x, targetProv.y, 2.0);
  }, [activeInvasion, focusCameraOnPercent, handleSwitchMapScope]);

  // RAF loop for smooth Army movement + Border Gate Portal crossings
  useEffect(() => {
    let rafId = 0;
    let lastTs = performance.now();

    const checkProximityTriggers = (nx: number, ny: number, nowTs: number) => {
      const activeScope = mapScopeRef.current;
      if (activeScope !== 'world' && nowTs > portalCooldownUntilRef.current) {
        const regDef = VAELORIA_REGIONAL_MAPS[activeScope];
        for (const ptl of regDef.portals) {
          if (Math.hypot(nx - ptl.x, ny - ptl.y) <= 4.6) {
            handleTraversePortal(ptl);
            return;
          }
        }
      }

      let closest: PositionedProvinceEntry | null = null;
      let bestD = 4.8;
      for (const entry of positionedProvinces) {
        const d = Math.hypot(nx - entry.x, ny - entry.y);
        if (d < bestD) {
          bestD = d;
          closest = entry;
        }
      }
      if (closest && closest.prov.id !== lastSelectedRef.current) {
        lastSelectedRef.current = closest.prov.id;
        playSfx('channel');
        onSelectProvince(closest.prov);
      }
    };

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
        const speed = 25;
        const cur = pawnPosRef.current;
        const nx = Math.max(5, Math.min(95, cur.x + (kdx / mag) * speed * dt));
        const ny = Math.max(6, Math.min(94, cur.y + (kdy / mag) * speed * dt));
        if (Math.abs(kdx) > 0.1) setFacingLeft(kdx < 0);
        if (marchTarget) setMarchTarget(null);
        pawnPosRef.current = { x: nx, y: ny };
        setPawnPos({ x: nx, y: ny });
        checkProximityTriggers(nx, ny, now);
      } else if (marchTarget) {
        const cur = pawnPosRef.current;
        const dx = marchTarget.x - cur.x;
        const dy = marchTarget.y - cur.y;
        const dist = Math.hypot(dx, dy);
        const speed = Math.max(32, dist * 2.6);
        const stepLen = speed * dt;
        if (dist <= stepLen || dist < 0.35) {
          const fx = marchTarget.x;
          const fy = marchTarget.y;
          pawnPosRef.current = { x: fx, y: fy };
          setPawnPos({ x: fx, y: fy });
          setMarchTarget(null);
          checkProximityTriggers(fx, fy, now);
        } else {
          const nx = cur.x + (dx / dist) * stepLen;
          const ny = cur.y + (dy / dist) * stepLen;
          pawnPosRef.current = { x: nx, y: ny };
          setPawnPos({ x: nx, y: ny });
          checkProximityTriggers(nx, ny, now);
        }
      }

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [marchTarget, positionedProvinces, onSelectProvince, handleTraversePortal]);

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

  // Road links for active scope
  const roadLinks = useMemo(() => {
    const posById: Record<string, PositionedProvinceEntry> = {};
    for (const entry of positionedProvinces) {
      posById[entry.prov.id] = entry;
    }

    const seen = new Set<string>();
    const links: {
      a: PositionedProvinceEntry;
      b: PositionedProvinceEntry;
      isNavalOrSky: boolean;
    }[] = [];

    for (const entry of positionedProvinces) {
      for (const nid of entry.prov.neighbors) {
        const nb = posById[nid];
        if (!nb) continue;
        const key =
          entry.prov.id < nb.prov.id
            ? `${entry.prov.id}|${nb.prov.id}`
            : `${nb.prov.id}|${entry.prov.id}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const isPolarCrossing =
          (entry.prov.initialOwner === 'vortex') !==
            (nb.prov.initialOwner === 'vortex') ||
          entry.prov.terrainKind === 'skyway' ||
          nb.prov.terrainKind === 'skyway';
        links.push({ a: entry, b: nb, isNavalOrSky: isPolarCrossing });
      }
    }
    return links;
  }, [positionedProvinces]);

  const dockedProvince = useMemo(() => {
    let best: ConquestProvinceDef | null = null;
    let bestD = 4.6;
    for (const entry of positionedProvinces) {
      const d = Math.hypot(pawnPos.x - entry.x, pawnPos.y - entry.y);
      if (d < bestD) {
        bestD = d;
        best = entry.prov;
      }
    }
    return best;
  }, [positionedProvinces, pawnPos.x, pawnPos.y]);

  const canChallengeDocked =
    Boolean(dockedProvince) &&
    !hasActedThisSeason &&
    attackableProvinceIds.has(dockedProvince!.id);

  const playerFaction = CONQUEST_FACTIONS[playerFactionId];
  const sovereignCard = sovereignAvatarCardId ? CARDS_BY_ID[sovereignAvatarCardId] : undefined;
  const activeRegionalDef = mapScope !== 'world' ? VAELORIA_REGIONAL_MAPS[mapScope] : null;
  const inferredRealmOnWorld: VaeloriaRealmId =
    mapScope !== 'world'
      ? mapScope
      : (PROVINCE_REGIONAL_COORDS[selectedProvinceId]?.realm ?? playerFactionId);

  const ownedTotalCount = useMemo(
    () =>
      CONQUEST_PROVINCES.filter(
        (p) => (provinceOwners[p.id] ?? p.initialOwner) === playerFactionId
      ).length,
    [provinceOwners, playerFactionId]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (activePointersRef.current.size === 2) {
      const pts = Array.from(activePointersRef.current.values());
      const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
      pinchStartRef.current = { dist: Math.max(20, dist), startZoom: zoom };
      dragRef.current.moved = true;
      return;
    }

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
    if (activePointersRef.current.has(e.pointerId)) {
      activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }

    if (activePointersRef.current.size === 2 && pinchStartRef.current) {
      const pts = Array.from(activePointersRef.current.values());
      const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
      const ratio = dist / pinchStartRef.current.dist;
      applyZoom(pinchStartRef.current.startZoom * ratio);
      dragRef.current.moved = true;
      return;
    }

    const st = dragRef.current;
    if (!st.active) return;
    const dx = e.clientX - st.startX;
    const dy = e.clientY - st.startY;
    if (Math.hypot(dx, dy) > 6) {
      st.moved = true;
    }
    if (st.moved && zoom > 1.01) {
      if (followPawn) setFollowPawn(false);
      setPan(clampPan({ x: st.startPanX + dx, y: st.startPanY + dy }, zoom));
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    activePointersRef.current.delete(e.pointerId);
    if (activePointersRef.current.size < 2) {
      pinchStartRef.current = null;
    }
    if (activePointersRef.current.size > 0) {
      return;
    }

    const st = dragRef.current;
    dragRef.current.active = false;
    if (st.moved) return;

    const targetEl = e.target as HTMLElement | null;
    if (
      targetEl?.closest(
        '.cqm-prov-pin, .vwm-pawn-challenge-pill, .vwm-dpad, .cqm-poly-hit, .vwm-portal-gate, .vwm-realm-dive-chip, .vwm-minimap-radar, .vwm-minimap-toggle-pill'
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

  const handleActivateProvince = (e: React.MouseEvent, entry: PositionedProvinceEntry) => {
    e.stopPropagation();
    const { prov, x, y } = entry;
    const dist = Math.hypot(pawnPos.x - x, pawnPos.y - y);
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
      startMarchTo(x, y);
    }
  };

  const globalArmyCoords = useMemo(() => {
    if (mapScope === 'world') {
      return { x: pawnPos.x, y: pawnPos.y };
    }
    const b = VAELORIA_REGIONAL_MAPS[mapScope].worldBounds;
    return {
      x: b.x + (pawnPos.x / 100) * b.w,
      y: b.y + (pawnPos.y / 100) * b.h,
    };
  }, [mapScope, pawnPos.x, pawnPos.y]);

  const worldCameraBox = useMemo(() => {
    if (mapScope !== 'world') {
      return VAELORIA_REGIONAL_MAPS[mapScope].worldBounds;
    }
    const w = 100 / zoom;
    const h = 100 / zoom;
    let cx = 50;
    let cy = 50;
    if (viewportRef.current && zoom > 1.01) {
      const rect = viewportRef.current.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        cx = 50 - (pan.x / (rect.width * zoom)) * 100;
        cy = 50 - (pan.y / (rect.height * zoom)) * 100;
      }
    }
    return {
      x: Math.max(0, Math.min(100 - w, cx - w / 2)),
      y: Math.max(0, Math.min(100 - h, cy - h / 2)),
      w,
      h,
    };
  }, [mapScope, zoom, pan.x, pan.y]);

  return (
    <div
      className={`conquest-megamap-shell ${
        isTheaterFullscreen ? 'is-theater-fullscreen' : ''
      } ${mapScope !== 'world' ? 'is-regional-scope' : ''}`}
    >
      {/* 1. 7-MAP INTERCONNECTED GEOPOLITICAL MULTIMAP BAR */}
      <div className="vwm-multimap-atlas-bar" role="tablist" aria-label="Atlas Geopolítico de Vaeloria">
        <button
          type="button"
          className={`vwm-atlas-pill is-world-pill ${mapScope === 'world' ? 'is-active' : ''}`}
          onClick={() => handleSwitchMapScope('world')}
        >
          <span>🌍</span>
          <strong>Continente</strong>
          <small>{ownedTotalCount}/30</small>
        </button>

        {VAELORIA_REALM_ORDER.map((rid) => {
          const rdef = VAELORIA_REGIONAL_MAPS[rid];
          const st = realmProvinceStats[rid];
          const isCurrent = mapScope === rid;
          return (
            <button
              key={rid}
              type="button"
              className={`vwm-atlas-pill ${isCurrent ? 'is-active' : ''}`}
              style={{ '--realm-accent': rdef.accentColor } as React.CSSProperties}
              onClick={() => handleSwitchMapScope(rid)}
              title={`Abrir Mapa Regional de Guerra de ${rdef.name}`}
            >
              <span>{rdef.icon}</span>
              <strong>{rdef.shortName}</strong>
              <small>
                {st.owned}/{st.total}
              </small>
            </button>
          );
        })}
      </div>

      {/* 2. Top Megamap Telemetry & Multi-LOD Controls */}
      <div className="cqm-toolbar">
        <div className="cqm-lod-group">
          <span className={`cqm-lod-pill lod-${lodLevel}`}>
            {activeRegionalDef
              ? `${activeRegionalDef.icon} ${activeRegionalDef.shortName.toUpperCase()} • MAPA REGIONAL`
              : lodLevel === 1
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
              🏔️ Relevo
            </button>
          </div>
        </div>

        <div className="vwm-controls-group">
          {mapScope === 'world' ? (
            <button
              type="button"
              className="vwm-tool-btn is-highlight-action"
              onClick={() => handleSwitchMapScope(inferredRealmOnWorld)}
              title="Entrar no Mapa Regional detalhado da província selecionada"
            >
              🔍 Região {VAELORIA_REGIONAL_MAPS[inferredRealmOnWorld].shortName}
            </button>
          ) : (
            <button
              type="button"
              className="vwm-tool-btn is-highlight-action"
              onClick={() => handleSwitchMapScope('world')}
              title="Retornar ao Megamapa Continental de 30 Províncias"
            >
              🌍 30 Províncias
            </button>
          )}

          <button
            type="button"
            className={`vwm-tool-btn ${followPawn ? 'is-active' : ''}`}
            onClick={() => {
              const next = !followPawn;
              setFollowPawn(next);
              if (next) {
                const tz = Math.max(zoom, mapScope === 'world' ? 1.75 : 1.35);
                setZoom(tz);
                centerCameraAt(pawnPos.x, pawnPos.y, tz);
              }
            }}
            title="Câmera exploratória que acompanha o Exército"
          >
            🎥 Seguir
          </button>

          <button
            type="button"
            className="vwm-tool-btn"
            onClick={() => {
              setFollowPawn(false);
              applyZoom(1);
            }}
            title="Enquadramento 100%"
          >
            1x
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

          {onToggleDossier && !isTheaterFullscreen && (
            <button
              type="button"
              className={`vwm-tool-btn hide-on-mobile ${isDossierCollapsed ? 'is-active' : ''}`}
              onClick={onToggleDossier}
              title={
                isDossierCollapsed
                  ? 'Mostrar Sala de Guerra lateral'
                  : 'Ocultar Sala de Guerra lateral para expandir o Mapa'
              }
            >
              {isDossierCollapsed ? '📋 Sala de Guerra' : '↔️ Expandir'}
            </button>
          )}

          <button
            type="button"
            className={`vwm-tool-btn ${isTheaterFullscreen ? 'is-active' : ''}`}
            onClick={() => setIsTheaterFullscreen((v) => !v)}
            title={
              isTheaterFullscreen
                ? 'Sair da Tela Cheia (Esc)'
                : 'Abrir Megamapa em Tela Cheia'
            }
          >
            {isTheaterFullscreen ? '✕ Sair' : '⛶ Tela Cheia'}
          </button>
        </div>
      </div>

      {/* 3. Interactive 16:9 Deep-Zoom Giant Megamap Viewport */}
      <div
        ref={viewportRef}
        className={`vwm-viewport cqm-viewport lod-${lodLevel} ${zoom > 1.01 ? 'is-zoomed' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
      >
        {portalBanner && <div className="vwm-portal-toast">{portalBanner}</div>}

        <div
          ref={canvasRef}
          className="vwm-canvas"
          style={{
            transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
          }}
        >
          {/* Seamless Base Terrain (Continental World OR High-Detail Regional Realm) */}
          <img
            key={activeRegionalDef ? activeRegionalDef.imagePath : VAELORIA_WORLD_MAP_IMAGE}
            src={activeRegionalDef ? activeRegionalDef.imagePath : VAELORIA_WORLD_MAP_IMAGE}
            alt={activeRegionalDef ? activeRegionalDef.name : 'Megamapa Continental de Vaeloria'}
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

            {/* LOD 3 Cartographic Graticule */}
            {lodLevel >= 3 && (
              <g className="cqm-graticule-layer" opacity="0.2">
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

            {/* 1. Political Territory Polygons (30 World OR 5 Regional Provinces) */}
            <g className="cqm-provinces-polys">
              {positionedProvinces.map((entry) => {
                const { prov } = entry;
                const geo = activeGeometries.provinces[prov.id];
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
                          : activeRegionalDef
                          ? isSelected || isHovered
                            ? 0.85
                            : 0.62
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
                      strokeWidth={isSelected ? 4.5 : 1.6}
                      strokeOpacity={isSelected ? 0.98 : overlayMode === 'political' ? 0.48 : 0.25}
                      className="cqm-poly-hit"
                      onClick={(e) => handleActivateProvince(e, entry)}
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
              {activeGeometries.sharedBorders.map((b) => {
                const ownerA = provinceOwners[b.provA];
                const ownerB = provinceOwners[b.provB];
                const sameEmpire = ownerA === ownerB;

                if (sameEmpire) {
                  if (lodLevel === 1) return null;
                  return (
                    <path
                      key={b.key}
                      d={b.svgPath}
                      fill="none"
                      stroke="rgba(226, 232, 240, 0.38)"
                      strokeWidth={lodLevel === 3 ? 1.8 : 2}
                      strokeDasharray="8 8"
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

            {/* 3. Roads & Border Portal Spurs */}
            <g className="cqm-roads-layer" pointerEvents="none">
              {roadLinks.map((lnk) => {
                const touchesSelected =
                  lnk.a.prov.id === selectedProvinceId || lnk.b.prov.id === selectedProvinceId;
                if (lodLevel === 1 && !touchesSelected) return null;

                const x1 = (lnk.a.x / 100) * CONQUEST_MAP_WIDTH;
                const y1 = (lnk.a.y / 100) * CONQUEST_MAP_HEIGHT;
                const x2 = (lnk.b.x / 100) * CONQUEST_MAP_WIDTH;
                const y2 = (lnk.b.y / 100) * CONQUEST_MAP_HEIGHT;
                const mx = (x1 + x2) / 2;
                const my = (y1 + y2) / 2 - (lnk.isNavalOrSky ? 28 : 14);

                const isAttackVector =
                  !hasActedThisSeason &&
                  ((provinceOwners[lnk.a.prov.id] === playerFactionId &&
                    attackableProvinceIds.has(lnk.b.prov.id)) ||
                    (provinceOwners[lnk.b.prov.id] === playerFactionId &&
                      attackableProvinceIds.has(lnk.a.prov.id)));

                return (
                  <path
                    key={`rd-${lnk.a.prov.id}-${lnk.b.prov.id}`}
                    d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
                    fill="none"
                    stroke={
                      isAttackVector
                        ? 'rgba(251, 146, 60, 0.92)'
                        : lnk.isNavalOrSky
                        ? 'rgba(56, 189, 248, 0.65)'
                        : 'rgba(226, 232, 240, 0.5)'
                    }
                    strokeWidth={touchesSelected || isAttackVector ? 3.8 : 2.4}
                    strokeDasharray={lnk.isNavalOrSky ? '10 8' : '6 7'}
                  />
                );
              })}

              {activeRegionalDef &&
                activeRegionalDef.portals.map((ptl) => {
                  const anchor = positionedProvinces.reduce<PositionedProvinceEntry | null>(
                    (best, cur) => {
                      if (!best) return cur;
                      const dCur = Math.hypot(cur.x - ptl.x, cur.y - ptl.y);
                      const dBest = Math.hypot(best.x - ptl.x, best.y - ptl.y);
                      return dCur < dBest ? cur : best;
                    },
                    null
                  );
                  if (!anchor) return null;
                  return (
                    <line
                      key={`cqm-spur-${ptl.id}`}
                      x1={(anchor.x / 100) * CONQUEST_MAP_WIDTH}
                      y1={(anchor.y / 100) * CONQUEST_MAP_HEIGHT}
                      x2={(ptl.x / 100) * CONQUEST_MAP_WIDTH}
                      y2={(ptl.y / 100) * CONQUEST_MAP_HEIGHT}
                      stroke="rgba(250, 204, 21, 0.58)"
                      strokeWidth="4"
                      strokeDasharray="12 9"
                    />
                  );
                })}
            </g>

            {/* 4. World Map Macro Titles (LOD 1 & 2) */}
            {!activeRegionalDef && lodLevel <= 2 && (
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

            {/* 5. Local Micro-Settlements (LOD 3 on World OR Always inside Regional Maps!) */}
            {lodLevel >= 3 && (
              <g filter="url(#cqmTextHalo)" pointerEvents="none">
                {positionedProvinces.map((entry) =>
                  entry.prov.microSettlements.map((ms, idx) => {
                    const spreadMul = activeRegionalDef ? 2.15 : 1;
                    const pctX = Math.max(6, Math.min(94, entry.x + ms.dx * spreadMul));
                    const pctY = Math.max(8, Math.min(92, entry.y + ms.dy * spreadMul));
                    const sx = (pctX / 100) * CONQUEST_MAP_WIDTH;
                    const sy = (pctY / 100) * CONQUEST_MAP_HEIGHT;
                    return (
                      <g key={`${entry.prov.id}-ms-${idx}`} transform={`translate(${sx}, ${sy})`}>
                        <circle
                          cx="0"
                          cy="0"
                          r={activeRegionalDef ? 15 : 9}
                          fill="rgba(9, 13, 22, 0.9)"
                          stroke="rgba(250, 204, 21, 0.7)"
                          strokeWidth="1.8"
                        />
                        <text
                          x="0"
                          y={activeRegionalDef ? 6 : 4}
                          textAnchor="middle"
                          fontSize={activeRegionalDef ? 18 : 11}
                        >
                          {SETTLEMENT_KIND_ICON[ms.kind] ?? '•'}
                        </text>
                        <text
                          x="0"
                          y={activeRegionalDef ? 33 : 21}
                          textAnchor="middle"
                          fill="#f1f5f9"
                          fontSize={activeRegionalDef ? 22 : 13.5}
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

            {/* 7. Active Enemy Invasion Alarm Vector (on World Map) */}
            {mapScope === 'world' && activeInvasion && (
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

          {/* Inside Regional Map: Walkable & Clickable Border Gate Portals */}
          {activeRegionalDef &&
            activeRegionalDef.portals.map((portal) => {
              const targetDef = VAELORIA_REGIONAL_MAPS[portal.targetRealm];
              return (
                <button
                  key={portal.id}
                  type="button"
                  className={`vwm-portal-gate ${
                    portal.x < 18 ? 'is-edge-left' : portal.x > 82 ? 'is-edge-right' : ''
                  } ${portal.y < 16 ? 'is-edge-top' : portal.y > 84 ? 'is-edge-bottom' : ''}`}
                  style={
                    {
                      left: `${portal.x}%`,
                      top: `${portal.y}%`,
                      '--portal-color': targetDef.accentColor,
                    } as React.CSSProperties
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTraversePortal(portal);
                  }}
                  title={`Marchar para ${targetDef.name} (${portal.sublabel})`}
                >
                  <span className="vwm-portal-icon">
                    {portal.directionIcon} {targetDef.icon}
                  </span>
                  <span className="vwm-portal-texts">
                    <strong>{portal.label}</strong>
                    <small>{portal.sublabel}</small>
                  </span>
                </button>
              );
            })}

          {/* Interactive Province Citadel & Garrison Nodes */}
          {positionedProvinces.map((entry) => {
            const { prov, x, y } = entry;
            const ownerId = provinceOwners[prov.id] ?? prov.initialOwner;
            const ownerFaction = CONQUEST_FACTIONS[ownerId];
            const fortLvl = fortifications[prov.id] ?? 0;
            const hasTruce = (truces[ownerId] ?? 0) > 0;
            const isSelected = prov.id === selectedProvinceId;
            const isHovered = prov.id === hoveredProvId;
            const isAttackable = !hasActedThisSeason && attackableProvinceIds.has(prov.id);
            const isUnderSiege = activeInvasion?.toProvinceId === prov.id;
            const isDockedChallengeHere = canChallengeDocked && dockedProvince?.id === prov.id;

            const pinCounterScale =
              zoom > 1.6 ? Math.max(0.58, 1.15 / Math.sqrt(zoom)) : activeRegionalDef ? 1.12 : 1;

            return (
              <button
                key={prov.id}
                type="button"
                className={`cqm-prov-pin ${prov.isCapital ? 'is-capital' : ''} ${
                  isSelected ? 'is-selected' : ''
                } ${isAttackable ? 'is-attackable' : ''} ${
                  ownerId === playerFactionId ? 'is-player-owned' : ''
                } ${isUnderSiege ? 'is-under-siege' : ''} ${
                  y > 82 && !isDockedChallengeHere ? 'is-near-bottom' : ''
                } ${x < 14 ? 'is-near-left' : x > 86 ? 'is-near-right' : ''}`}
                style={
                  {
                    left: `${x}%`,
                    top: `${y}%`,
                    '--prov-color': ownerFaction.color,
                    transform: `translate(-50%, -50%) scale(${pinCounterScale})`,
                  } as React.CSSProperties
                }
                onClick={(e) => handleActivateProvince(e, entry)}
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
            } ${pawnPos.y < 23 ? 'is-near-top' : ''} ${
              pawnPos.x < 16 ? 'is-near-left' : pawnPos.x > 84 ? 'is-near-right' : ''
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

        {/* Live Continental Minimap Radar */}
        {showMinimap ? (
          <div
            className="vwm-minimap-radar"
            onClick={(e) => {
              e.stopPropagation();
              const rect = e.currentTarget.getBoundingClientRect();
              const mx = ((e.clientX - rect.left) / rect.width) * 100;
              const my = ((e.clientY - rect.top) / rect.height) * 100;
              if (mapScope === 'world') {
                startMarchTo(mx, my);
                if (zoom > 1.05) centerCameraAt(mx, my, zoom);
              } else {
                const nearestTerr = resolveNearestTerritory(mx, my);
                handleSwitchMapScope(mapTerritoryIdToRealmId(nearestTerr.id));
              }
            }}
            title="Minimapa Geopolítico — Clique para saltar para qualquer Reino"
          >
            <img src={VAELORIA_WORLD_MAP_IMAGE} alt="Minimapa" draggable={false} />
            <div
              className="vwm-minimap-cam-box"
              style={{
                left: `${worldCameraBox.x}%`,
                top: `${worldCameraBox.y}%`,
                width: `${worldCameraBox.w}%`,
                height: `${worldCameraBox.h}%`,
                borderColor: activeRegionalDef ? activeRegionalDef.accentColor : '#facc15',
              }}
            />
            <span
              className="vwm-minimap-pawn-dot"
              style={{
                left: `${globalArmyCoords.x}%`,
                top: `${globalArmyCoords.y}%`,
              }}
            />
            <span className="vwm-minimap-caption">
              {activeRegionalDef ? activeRegionalDef.shortName : 'GPS Guerra'}
            </span>
            <button
              type="button"
              className="vwm-minimap-close"
              onClick={(e) => {
                e.stopPropagation();
                setShowMinimap(false);
              }}
            >
              ×
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="vwm-minimap-toggle-pill"
            onClick={(e) => {
              e.stopPropagation();
              setShowMinimap(true);
            }}
          >
            🗺️ GPS
          </button>
        )}

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
              setFollowPawn(true);
              focusCameraOnPercent(pawnPos.x, pawnPos.y, mapScope === 'world' ? 1.9 : 1.35);
            }}
            title="Centralizar câmera no Exército"
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
      </div>

      <div className="vwm-footer-hint">
        <span>
          {mapScope === 'world' ? (
            <>
              🧭 <strong>Multimapa (7 Mapas)</strong>: Selecione qualquer <strong>Reino acima</strong> para o mapa regional tático • Roda do mouse para <strong>Zoom LOD (1x–3.8x)</strong> • Clique numa província rival vizinha para <strong>Cercar</strong>
            </>
          ) : (
            <>
              🧭 Marche até os <strong>Portais de Fronteira</strong> para invadir Reinos vizinhos • Clique numa província conectada para <strong>Cercar</strong> • <strong>🌍 Continente</strong> retorna às 30 províncias
            </>
          )}
        </span>
      </div>
    </div>
  );
};
