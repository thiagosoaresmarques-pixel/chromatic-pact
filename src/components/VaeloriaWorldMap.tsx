import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { CampaignBoss, CardDefinition, OverworldFieldBuff } from '../types/game';
import { CARDS_BY_ID } from '../data/cards';
import { DOMAIN_META } from './CardView';
import { playRealmEntryMotif, playSfx } from '../utils/soundEngine';
import { setMusicState } from '../utils/musicEngine';
import {
  VAELORIA_WORLD_MAP_IMAGE,
  VaeloriaStageMapNode,
  resolvePrimaryBossDomain,
  resolveStageMapNode,
  resolveNearestTerritory,
} from '../data/vaeloriaMapData';
import {
  CARDINAL_TO_CAPITAL_MAP,
  SCOPE_STAGE_PROJECTIONS,
  VAELORIA_CARDINAL_REALMS,
  VAELORIA_DEEP_FRONTIERS,
  VAELORIA_REALM_ORDER,
  VAELORIA_REGIONAL_MAPS,
  VAELORIA_TRANSIT_CORRIDORS,
  VaeloriaMapScope,
  VaeloriaRealmId,
  RegionalBorderPortal,
  RegionalLocalLandmark,
  resolveNearestRealmFromWorldCoords,
  resolveStageRegionalPlacement,
} from '../data/vaeloriaMultimapData';
import {
  AtlasLayerVisibility,
  DEFAULT_ATLAS_LAYER_VISIBILITY,
  VaeloriaHistoricalEraId,
} from '../data/vaeloriaCartographyDetails';
import {
  CartographicInspectionNote,
  VaeloriaGazetteerEntry,
} from '../data/vaeloriaCapitalDistricts';
import {
  AtlasLayerAndSearchHud,
  CartographerInspectorCard,
  CartographicHtmlPinsLayer,
  CartographicScaleRuler,
  CartographicSvgLayer,
  GazetteerHighlightTarget,
  MultiScaleScopeNavigator,
} from './CartographicAtlasExtras';
import { getWeeklyFeaturedRift, WEEKLY_RIFT_SHARDS_BONUS } from '../data/fractureRiftsData';
import {
  getFogOfWarEnabled,
  getLandmarkEventDef,
  getPendingOverworldBuff,
  getVisitedCampaignLandmarks,
  getVisitedExpeditionLandmarks,
  getVisitedRealms,
  markCampaignLandmarkVisited,
  markExpeditionLandmarkVisited,
  markRealmVisited,
  setFogOfWarEnabled,
  setPendingOverworldBuff,
} from '../data/vaeloriaOverworldEvents';
import { OverworldEventModal } from './OverworldEventModal';

export interface VaeloriaWorldMapProps {
  mode: 'campaign' | 'expedition';
  bosses: CampaignBoss[];
  allBosses?: CampaignBoss[];
  selectedBossId: string;
  clearedBossIds: string[];
  sovereignAvatarCardId?: string;
  sovereignLabel?: string;
  isDossierCollapsed?: boolean;
  onToggleDossier?: () => void;
  onSelectBoss: (boss: CampaignBoss) => void;
  onChallengeBoss: (boss: CampaignBoss) => void;
  onRewardGold?: (amount: number, reason?: string) => void;
  onRewardShards?: (amount: number, reason?: string) => void;
  onGrantExpeditionCard?: (card: CardDefinition) => void;
  onOpenWeeklyRift?: () => void;
}

interface PositionedBossEntry {
  boss: CampaignBoss;
  worldNode: VaeloriaStageMapNode;
  realm: VaeloriaRealmId;
  rx: number;
  ry: number;
  /** Active X (0..100) in current mapScope */
  x: number;
  /** Active Y (0..100) in current mapScope */
  y: number;
}

const LOCAL_LANDMARK_ICON: Record<string, string> = {
  town: '🏘️',
  ruin: '🏛️',
  fort: '🛡️',
  port: '⚓',
  shrine: '⛩️',
  pass: '🌉',
};

const CLAMP_MIN_X = 4.5;
const CLAMP_MAX_X = 95.5;
const CLAMP_MIN_Y = 6.5;
const CLAMP_MAX_Y = 93.5;

export const VaeloriaWorldMap: React.FC<VaeloriaWorldMapProps> = ({
  mode,
  bosses,
  allBosses,
  selectedBossId,
  clearedBossIds,
  sovereignAvatarCardId,
  sovereignLabel = 'Seu Soberano',
  isDossierCollapsed = false,
  onToggleDossier,
  onSelectBoss,
  onChallengeBoss,
  onRewardGold,
  onRewardShards,
  onGrantExpeditionCard,
  onOpenWeeklyRift,
}) => {
  const completeRoster = allBosses && allBosses.length > 0 ? allBosses : bosses;
  const weeklyRift = useMemo(() => getWeeklyFeaturedRift(), []);
  const weeklyRiftWorldCoords = useMemo(() => {
    const coordsByRift: Record<string, { x: number; y: number }> = {
      astral_torrent: { x: 56.5, y: 11.2 },
      immortal_pantheon: { x: 82.5, y: 50.5 },
      eternal_cataclysm: { x: 46.5, y: 23.5 },
      glass_thrones: { x: 56.5, y: 27.5 },
      living_forge: { x: 69.5, y: 38.5 },
      black_sun_night: { x: 25.5, y: 45.5 },
    };
    return coordsByRift[weeklyRift.id] ?? { x: 48.5, y: 53.5 };
  }, [weeklyRift.id]);

  const isMobileViewport = () =>
    typeof window !== 'undefined' && window.innerWidth <= 768;

  const [mapScope, setMapScope] = useState<VaeloriaMapScope>('world');
  const [isTheaterFullscreen, setIsTheaterFullscreen] = useState<boolean>(false);
  const [followPawn, setFollowPawn] = useState<boolean>(false);
  const [showMinimap, setShowMinimap] = useState<boolean>(() => !isMobileViewport());
  const [portalBanner, setPortalBanner] = useState<string | null>(null);
  const [fogEnabled, setFogEnabled] = useState<boolean>(() => getFogOfWarEnabled());
  const [visitedRealms, setVisitedRealms] = useState<Set<VaeloriaRealmId>>(() =>
    getVisitedRealms()
  );
  const [visitedLandmarks, setVisitedLandmarks] = useState<Set<string>>(() =>
    mode === 'campaign' ? getVisitedCampaignLandmarks() : getVisitedExpeditionLandmarks()
  );
  const [pendingBuff, setPendingBuff] = useState<OverworldFieldBuff | null>(() =>
    getPendingOverworldBuff(mode)
  );
  const [activeLandmarkModal, setActiveLandmarkModal] = useState<{
    realm: VaeloriaRealmId;
    landmark: RegionalLocalLandmark;
  } | null>(null);
  const [atlasLayers, setAtlasLayers] = useState<AtlasLayerVisibility>(
    DEFAULT_ATLAS_LAYER_VISIBILITY
  );
  const [eraFilter, setEraFilter] = useState<VaeloriaHistoricalEraId>('all_eras');
  const [inspectedNote, setInspectedNote] =
    useState<CartographicInspectionNote | null>(null);
  const [gazetteerHighlight, setGazetteerHighlight] =
    useState<GazetteerHighlightTarget | null>(null);

  useEffect(() => {
    if (!gazetteerHighlight) return;
    const t = window.setTimeout(() => setGazetteerHighlight(null), 5500);
    return () => window.clearTimeout(t);
  }, [gazetteerHighlight]);

  useEffect(() => {
    setVisitedLandmarks(
      mode === 'campaign' ? getVisitedCampaignLandmarks() : getVisitedExpeditionLandmarks()
    );
    setPendingBuff(getPendingOverworldBuff(mode));
  }, [mode, clearedBossIds.length]);

  const enrichedAllBosses = useMemo(() => {
    return completeRoster.map((boss) => {
      const worldNode = resolveStageMapNode(mode, boss.id, boss.stage);
      const reg = resolveStageRegionalPlacement(mode, boss.id, boss.stage);
      return {
        boss,
        worldNode,
        realm: reg.realm,
        rx: reg.rx,
        ry: reg.ry,
      };
    });
  }, [completeRoster, mode]);

  const realmBossCounts = useMemo(() => {
    const counts = {} as Record<VaeloriaRealmId, { total: number; cleared: number }>;
    for (const rid of VAELORIA_REALM_ORDER) {
      counts[rid] = { total: 0, cleared: 0 };
    }
    for (const item of enrichedAllBosses) {
      const isCleared = clearedBossIds.includes(item.boss.id);
      counts[item.realm].total += 1;
      if (isCleared) counts[item.realm].cleared += 1;
      for (const rid of VAELORIA_REALM_ORDER) {
        if (rid === item.realm) continue;
        if (SCOPE_STAGE_PROJECTIONS[rid]?.[item.boss.id]) {
          counts[rid].total += 1;
          if (isCleared) counts[rid].cleared += 1;
        }
      }
    }
    return counts;
  }, [enrichedAllBosses, clearedBossIds]);

  const realmBadgeStrings = useMemo(() => {
    const out: Partial<Record<VaeloriaRealmId, string>> = {};
    for (const rid of VAELORIA_REALM_ORDER) {
      const st = realmBossCounts[rid];
      if (st.total > 0) {
        out[rid] = `${st.cleared}/${st.total}`;
      }
    }
    return out;
  }, [realmBossCounts]);

  // Visible bosses in current map scope:
  // - On 'world': show `bosses` (respects Act filter in Campaign)
  // - Inside a Regional / Corridor / Capital Map: show primary + projected bosses!
  const positionedBosses: PositionedBossEntry[] = useMemo(() => {
    if (mapScope === 'world') {
      const visibleIds = new Set(bosses.map((b) => b.id));
      return enrichedAllBosses
        .filter((item) => visibleIds.has(item.boss.id))
        .map((item) => ({
          ...item,
          x: item.worldNode.x,
          y: item.worldNode.y,
        }));
    }
    const proj = SCOPE_STAGE_PROJECTIONS[mapScope];
    return enrichedAllBosses.flatMap((item) => {
      if (item.realm === mapScope) {
        return [{ ...item, x: item.rx, y: item.ry }];
      }
      const pCoord = proj?.[item.boss.id];
      if (pCoord) {
        return [{ ...item, x: pCoord.rx, y: pCoord.ry }];
      }
      return [];
    });
  }, [mapScope, bosses, enrichedAllBosses]);

  const selectedEntryGlobal = useMemo(
    () =>
      enrichedAllBosses.find((entry) => entry.boss.id === selectedBossId) ??
      enrichedAllBosses[0],
    [enrichedAllBosses, selectedBossId]
  );

  // Sovereign physical coordinates in the active mapScope (in % 0..100)
  const [pawnPos, setPawnPos] = useState<{ x: number; y: number }>(() => ({
    x: selectedEntryGlobal?.worldNode.x ?? 50,
    y: selectedEntryGlobal?.worldNode.y ?? 50.5,
  }));
  const [marchOrigin, setMarchOrigin] = useState<{ x: number; y: number } | null>(null);
  const [marchTarget, setMarchTarget] = useState<{ x: number; y: number } | null>(null);
  const [facingLeft, setFacingLeft] = useState<boolean>(false);

  // Camera Pan & Zoom (All maps open initially at 100% / 1.0x clean view)
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showGeographyLabels, setShowGeographyLabels] = useState<boolean>(true);
  const [hoveredBossId, setHoveredBossId] = useState<string | null>(null);
  const [clickedBossLabelId, setClickedBossLabelId] = useState<string | null>(null);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const pawnPosRef = useRef<{ x: number; y: number }>(pawnPos);
  pawnPosRef.current = pawnPos;
  const mapScopeRef = useRef<VaeloriaMapScope>(mapScope);
  mapScopeRef.current = mapScope;
  const portalCooldownUntilRef = useRef<number>(0);

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

  const showPortalNotification = useCallback((msg: string) => {
    setPortalBanner(msg);
  }, []);

  useEffect(() => {
    if (!portalBanner) return;
    const t = window.setTimeout(() => setPortalBanner(null), 2800);
    return () => window.clearTimeout(t);
  }, [portalBanner]);

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

  const centerCameraAt = useCallback(
    (pctX: number, pctY: number, targetZoom: number) => {
      if (!viewportRef.current || targetZoom <= 1.01) {
        setPan({ x: 0, y: 0 });
        return;
      }
      const rect = viewportRef.current.getBoundingClientRect();
      const desiredPanX = ((50 - pctX) / 100) * rect.width * targetZoom;
      const desiredPanY = ((50 - pctY) / 100) * rect.height * targetZoom;
      setPan(clampPan({ x: desiredPanX, y: desiredPanY }, targetZoom));
    },
    [clampPan]
  );

  // Keep camera smoothly following the Sovereign whenever `followPawn` is active & zoomed in
  useEffect(() => {
    if (!followPawn || zoom <= 1.02) return;
    centerCameraAt(pawnPos.x, pawnPos.y, zoom);
  }, [followPawn, pawnPos.x, pawnPos.y, zoom, centerCameraAt]);

  // Escape exits Theater Fullscreen
  useEffect(() => {
    if (!isTheaterFullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsTheaterFullscreen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isTheaterFullscreen]);

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

  // Switch between 'world' and any of the 6 Regional Maps seamlessly
  const handleSwitchMapScope = useCallback(
    (
      nextScope: VaeloriaMapScope,
      arrivalOverride?: { x: number; y: number; banner?: string; viaPortal?: boolean }
    ) => {
      if (nextScope === mapScopeRef.current && !arrivalOverride) return;
      portalCooldownUntilRef.current = performance.now() + 1100;
      setMarchTarget(null);
      setMarchOrigin(null);
      setClickedBossLabelId(null);
      if (arrivalOverride?.viaPortal) {
        playSfx('portal_cross');
      } else {
        playSfx('channel');
      }
      playRealmEntryMotif(nextScope);

      if (nextScope === 'world') {
        setMusicState('tactical', 'purple');
        // Place Sovereign on the continent at selected boss (if in previous realm) or previous realm's worldCenter
        const prevScope = mapScopeRef.current;
        let wx = selectedEntryGlobal?.worldNode.x ?? 50;
        let wy = selectedEntryGlobal?.worldNode.y ?? 50.5;
        if (prevScope !== 'world' && selectedEntryGlobal?.realm !== prevScope) {
          const prevDef = VAELORIA_REGIONAL_MAPS[prevScope];
          wx = prevDef.worldCenter.x;
          wy = prevDef.worldCenter.y;
        }
        mapScopeRef.current = 'world';
        setMapScope('world');
        pawnPosRef.current = { x: wx, y: wy };
        setPawnPos({ x: wx, y: wy });
        setZoom(1);
        setPan({ x: 0, y: 0 });
        showPortalNotification('🌍 Visão Continental de Vaeloria');
        return;
      }

      const regDef = VAELORIA_REGIONAL_MAPS[nextScope];
      setMusicState('sanctuary', regDef.domain);
      setVisitedRealms(markRealmVisited(nextScope));

      const realmBosses = enrichedAllBosses.filter((b) => b.realm === nextScope);
      const activeInRealm = realmBosses.find((b) => b.boss.id === selectedBossId);
      const preferredEntry =
        activeInRealm ??
        realmBosses.find((b) => !clearedBossIds.includes(b.boss.id)) ??
        realmBosses[0];

      const destX = arrivalOverride?.x ?? preferredEntry?.rx ?? 50;
      const destY = arrivalOverride?.y ?? preferredEntry?.ry ?? 50;

      mapScopeRef.current = nextScope;
      setMapScope(nextScope);
      pawnPosRef.current = { x: destX, y: destY };
      setPawnPos({ x: destX, y: destY });

      // Full-bleed Regional Map starts at crisp 1.0x so all local landmarks & border gates fill the widescreen stage!
      setZoom(1);
      setPan({ x: 0, y: 0 });

      if (!arrivalOverride && preferredEntry && preferredEntry.boss.id !== selectedBossId) {
        lastSyncedBossIdRef.current = preferredEntry.boss.id;
        onSelectBoss(preferredEntry.boss);
      }

      showPortalNotification(
        arrivalOverride?.banner ?? `${regDef.icon} ${regDef.name}`
      );
    },
    [
      selectedEntryGlobal,
      enrichedAllBosses,
      selectedBossId,
      clearedBossIds,
      centerCameraAt,
      onSelectBoss,
      showPortalNotification,
    ]
  );

  const handleTraversePortal = useCallback(
    (portal: RegionalBorderPortal) => {
      const targetDef = VAELORIA_REGIONAL_MAPS[portal.targetRealm];
      handleSwitchMapScope(portal.targetRealm, {
        x: portal.arrivalX,
        y: portal.arrivalY,
        banner: `🧭 Fronteira atravessada: ${targetDef.icon} ${targetDef.name}`,
        viaPortal: true,
      });
    },
    [handleSwitchMapScope]
  );

  // Sync Sovereign when selectedBossId changes externally (e.g. Act filter tab)
  const lastSyncedBossIdRef = useRef<string>(selectedBossId);
  useEffect(() => {
    if (selectedBossId !== lastSyncedBossIdRef.current && selectedEntryGlobal) {
      lastSyncedBossIdRef.current = selectedBossId;
      if (mapScopeRef.current === 'world') {
        const dist = Math.hypot(
          pawnPosRef.current.x - selectedEntryGlobal.worldNode.x,
          pawnPosRef.current.y - selectedEntryGlobal.worldNode.y
        );
        if (dist > 1.8) {
          startMarchTo(selectedEntryGlobal.worldNode.x, selectedEntryGlobal.worldNode.y, true);
        }
      } else if (selectedEntryGlobal.realm !== mapScopeRef.current) {
        // Jump regional atlas to the newly selected boss's Realm
        handleSwitchMapScope(selectedEntryGlobal.realm, {
          x: selectedEntryGlobal.rx,
          y: selectedEntryGlobal.ry,
        });
      } else {
        startMarchTo(selectedEntryGlobal.rx, selectedEntryGlobal.ry, true);
      }
    }
  }, [selectedBossId, selectedEntryGlobal, startMarchTo, handleSwitchMapScope]);

  // Smooth RAF Loop: handles point-to-point March, continuous WASD/Arrow/D-pad roaming, AND Border Gate Portal crossings!
  useEffect(() => {
    let rafId = 0;
    let lastTs = performance.now();

    const checkProximityTriggers = (nx: number, ny: number, nowTs: number) => {
      // 1. Check Regional Border Gate Portals when inside a Regional Map
      const activeScope = mapScopeRef.current;
      if (activeScope !== 'world' && nowTs > portalCooldownUntilRef.current) {
        const regDef = VAELORIA_REGIONAL_MAPS[activeScope];
        for (const portal of regDef.portals) {
          if (Math.hypot(nx - portal.x, ny - portal.y) <= 4.6) {
            handleTraversePortal(portal);
            return true;
          }
        }
      }

      // 2. Auto-select Boss Citadel when walking close to it
      let closest: PositionedBossEntry | null = null;
      let closestDist = 4.5;
      for (const entry of positionedBosses) {
        const d = Math.hypot(nx - entry.x, ny - entry.y);
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
      return false;
    };

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
        checkProximityTriggers(nx, ny, now);
      } else if (marchTarget) {
        const cur = pawnPosRef.current;
        const dx = marchTarget.x - cur.x;
        const dy = marchTarget.y - cur.y;
        const dist = Math.hypot(dx, dy);
        const marchSpeed = Math.max(34, dist * 2.7);
        const maxStep = marchSpeed * dt;

        if (dist <= maxStep || dist < 0.35) {
          const fx = marchTarget.x;
          const fy = marchTarget.y;
          pawnPosRef.current = { x: fx, y: fy };
          setPawnPos({ x: fx, y: fy });
          setMarchTarget(null);
          setMarchOrigin(null);
          checkProximityTriggers(fx, fy, now);
        } else {
          const nx = cur.x + (dx / dist) * maxStep;
          const ny = cur.y + (dy / dist) * maxStep;
          pawnPosRef.current = { x: nx, y: ny };
          setPawnPos({ x: nx, y: ny });
          checkProximityTriggers(nx, ny, now);
        }
      }

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [marchTarget, positionedBosses, onSelectBoss, handleTraversePortal]);

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
          (entry) => Math.hypot(cur.x - entry.x, cur.y - entry.y) <= 4.8
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
  const currentWorldTerritory = useMemo(
    () => resolveNearestTerritory(pawnPos.x, pawnPos.y),
    [pawnPos.x, pawnPos.y]
  );

  const activeRegionalDef = mapScope !== 'world' ? VAELORIA_REGIONAL_MAPS[mapScope] : null;
  const inferredRealmFromWorld: VaeloriaRealmId =
    mapScope !== 'world' ? mapScope : resolveNearestRealmFromWorldCoords(pawnPos.x, pawnPos.y);

  const dockedBossEntry = useMemo(() => {
    let best: PositionedBossEntry | null = null;
    let bestDist = 4.8;
    for (const entry of positionedBosses) {
      const d = Math.hypot(pawnPos.x - entry.x, pawnPos.y - entry.y);
      if (d < bestDist) {
        bestDist = d;
        best = entry;
      }
    }
    return best;
  }, [positionedBosses, pawnPos.x, pawnPos.y]);

  const dockedLandmark = useMemo(() => {
    if (!activeRegionalDef) return null;
    let best: RegionalLocalLandmark | null = null;
    let bestDist = 4.6;
    for (const lm of activeRegionalDef.localLandmarks) {
      const d = Math.hypot(pawnPos.x - lm.x, pawnPos.y - lm.y);
      if (d < bestDist) {
        bestDist = d;
        best = lm;
      }
    }
    return best;
  }, [activeRegionalDef, pawnPos.x, pawnPos.y]);

  const sovereignCard = sovereignAvatarCardId ? CARDS_BY_ID[sovereignAvatarCardId] : undefined;

  const nextUnclearBossId = useMemo(() => {
    const uncleared = enrichedAllBosses.find((e) => !clearedBossIds.includes(e.boss.id));
    return uncleared?.boss.id ?? null;
  }, [enrichedAllBosses, clearedBossIds]);

  const applyZoom = (nextZoomRaw: number) => {
    const nextZoom = Math.max(1, Math.min(4.5, Number(nextZoomRaw.toFixed(2))));
    setZoom(nextZoom);
    if (followPawn && nextZoom > 1.02) {
      centerCameraAt(pawnPosRef.current.x, pawnPosRef.current.y, nextZoom);
    } else {
      setPan((prev) => clampPan(prev, nextZoom));
    }
  };

  const handleSelectGazetteerEntry = useCallback(
    (entry: VaeloriaGazetteerEntry) => {
      setGazetteerHighlight({
        scope: entry.scope,
        x: entry.x,
        y: entry.y,
        label: entry.name,
      });
      if (entry.inspectionNote) {
        setInspectedNote(entry.inspectionNote);
      }
      if (entry.bossId) {
        const found = enrichedAllBosses.find((b) => b.boss.id === entry.bossId);
        if (found) onSelectBoss(found.boss);
      }
      const targetZoom = Math.max(1.2, Math.min(4.5, entry.recommendedZoom));
      if (entry.scope !== mapScopeRef.current) {
        handleSwitchMapScope(entry.scope, {
          x: entry.x,
          y: entry.y,
          banner: `🔎 ${entry.name}`,
        });
        window.setTimeout(() => {
          setFollowPawn(false);
          setZoom(targetZoom);
          centerCameraAt(entry.x, entry.y, targetZoom);
        }, 40);
      } else {
        setFollowPawn(false);
        startMarchTo(entry.x, entry.y, true);
        setZoom(targetZoom);
        requestAnimationFrame(() => {
          centerCameraAt(entry.x, entry.y, targetZoom);
        });
        showPortalNotification(`🔎 ${entry.name}`);
      }
    },
    [
      enrichedAllBosses,
      onSelectBoss,
      handleSwitchMapScope,
      centerCameraAt,
      startMarchTo,
      showPortalNotification,
    ]
  );

  const handleCenterOnSovereign = () => {
    const targetZoom = mapScope === 'world' ? Math.max(zoom, 1.75) : Math.max(zoom, 1.45);
    setFollowPawn(true);
    setZoom(targetZoom);
    centerCameraAt(pawnPos.x, pawnPos.y, targetZoom);
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
      if (followPawn) {
        setFollowPawn(false);
      }
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

    const targetEl = e.target as HTMLElement | null;
    if (
      targetEl?.closest(
        '.vwm-boss-node, .vwm-landmark-node, .vwm-pawn-challenge-pill, .vwm-dpad, .vwm-portal-gate, .vwm-realm-dive-chip, .vwm-minimap-radar, .vwm-minimap-toggle-pill, .carto-toponym-pin, .carto-unified-settlement-pin, .carto-capital-district-pin, .carto-historical-battle-pin, .cartographer-notebook-card, .atlas-hud-cluster, .cartographic-scale-ruler'
      )
    ) {
      return;
    }

    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    let snapEntry: PositionedBossEntry | null = null;
    let snapDist = 4.2;
    for (const entry of positionedBosses) {
      const d = Math.hypot(clickX - entry.x, clickY - entry.y);
      if (d < snapDist) {
        snapDist = d;
        snapEntry = entry;
      }
    }

    if (snapEntry) {
      lastSyncedBossIdRef.current = snapEntry.boss.id;
      setClickedBossLabelId(snapEntry.boss.id);
      onSelectBoss(snapEntry.boss);
      startMarchTo(snapEntry.x, snapEntry.y);
    } else {
      setClickedBossLabelId(null);
      startMarchTo(clickX, clickY);
    }
  };

  const handleWheelViewport = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.2 : -0.2;
    applyZoom(zoom + delta);
  };

  const handleClickBossPin = (e: React.MouseEvent, entry: PositionedBossEntry) => {
    e.stopPropagation();
    const distFromPawn = Math.hypot(pawnPos.x - entry.x, pawnPos.y - entry.y);
    lastSyncedBossIdRef.current = entry.boss.id;
    setClickedBossLabelId(entry.boss.id);
    onSelectBoss(entry.boss);

    if (distFromPawn <= 2.8 && selectedBossId === entry.boss.id) {
      onChallengeBoss(entry.boss);
    } else {
      startMarchTo(entry.x, entry.y);
    }
  };

  // Global Sovereign coordinates on the Continental Minimap Radar (0..100%)
  const globalSovereignCoords = useMemo(() => {
    if (mapScope === 'world') {
      return { x: pawnPos.x, y: pawnPos.y };
    }
    const b = VAELORIA_REGIONAL_MAPS[mapScope].worldBounds;
    return {
      x: b.x + (pawnPos.x / 100) * b.w,
      y: b.y + (pawnPos.y / 100) * b.h,
    };
  }, [mapScope, pawnPos.x, pawnPos.y]);

  // Camera Viewport Box on Continental Minimap when viewing 'world' at zoom > 1
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

  const pinCounterScale = zoom > 1.45 ? Math.max(0.68, 1.12 / Math.sqrt(zoom)) : 1;

  return (
    <div
      className={`vaeloria-world-map-shell ${
        isTheaterFullscreen ? 'is-theater-fullscreen' : ''
      } ${mapScope !== 'world' ? 'is-regional-scope' : ''}`}
    >
      {/* 1. 21-MAP QUADRI-SCALE INTERCONNECTED MULTIMAP ATLAS BAR */}
      <MultiScaleScopeNavigator
        mapScope={mapScope}
        onSelectScope={(s) => handleSwitchMapScope(s)}
        worldBadge={`${clearedBossIds.length}/${enrichedAllBosses.length}`}
        countByRealm={realmBadgeStrings}
        variant="overworld"
      />

      {/* 2. Top Cartographic Telemetry & Camera Controls */}
      <div className="vwm-hud-top">
        <div
          className="vwm-territory-pill"
          style={{
            borderColor: `${
              activeRegionalDef ? activeRegionalDef.accentColor : currentWorldTerritory.color
            }66`,
          }}
        >
          <span className="vwm-territory-icon">
            {activeRegionalDef ? activeRegionalDef.icon : currentWorldTerritory.icon}
          </span>
          <div className="vwm-territory-texts">
            <span className="vwm-territory-kicker">
              {activeRegionalDef
                ? activeRegionalDef.cardinalTitle
                : `${currentWorldTerritory.cardinalLabel} • VISÃO CONTINENTAL`}
            </span>
            <strong
              className="font-cinzel vwm-territory-title"
              style={{
                color: activeRegionalDef
                  ? activeRegionalDef.accentColor
                  : currentWorldTerritory.color,
              }}
            >
              {activeRegionalDef ? activeRegionalDef.name : currentWorldTerritory.name}
              <span className="vwm-territory-landmark">
                {' '}
                —{' '}
                {dockedBossEntry
                  ? dockedBossEntry.worldNode.landmarkName
                  : activeRegionalDef
                  ? activeRegionalDef.subtitle
                  : currentWorldTerritory.subtitle}
              </span>
            </strong>
          </div>
        </div>

        <div className="vwm-controls-group">
          {pendingBuff && (
            <span
              className="vwm-buff-ready-chip"
              title={`Bônus pronto para a próxima batalha (${pendingBuff.sourceLandmarkName})`}
            >
              ✦ {pendingBuff.summaryLabel}
            </span>
          )}

          {mapScope === 'world' ? (
            <button
              type="button"
              className="vwm-tool-btn is-highlight-action"
              onClick={() => handleSwitchMapScope(inferredRealmFromWorld)}
              title={`Mergulhar no Mapa Regional detalhado de ${VAELORIA_REGIONAL_MAPS[inferredRealmFromWorld].shortName}`}
            >
              🔍 Entrar em {VAELORIA_REGIONAL_MAPS[inferredRealmFromWorld].shortName}
            </button>
          ) : (
            <button
              type="button"
              className="vwm-tool-btn is-highlight-action"
              onClick={() => handleSwitchMapScope('world')}
              title="Voltar ao Mapa Continental de Vaeloria"
            >
              🌍 Mapa-Múndi
            </button>
          )}

          <button
            type="button"
            className={`vwm-tool-btn ${followPawn ? 'is-active' : ''}`}
            onClick={() => {
              const next = !followPawn;
              setFollowPawn(next);
              if (next) {
                const targetZ = Math.max(zoom, mapScope === 'world' ? 1.75 : 1.35);
                setZoom(targetZ);
                centerCameraAt(pawnPos.x, pawnPos.y, targetZ);
              }
            }}
            title="Câmera exploratória que acompanha o Soberano em tempo real"
          >
            🎥 Seguir
          </button>

          <button
            type="button"
            className={`vwm-tool-btn ${showGeographyLabels ? 'is-active' : ''}`}
            onClick={() => setShowGeographyLabels((v) => !v)}
            title="Mostrar ou ocultar nomes geográficos, vilas e marcos"
          >
            🏷️ Marcos
          </button>

          <button
            type="button"
            className={`vwm-tool-btn ${fogEnabled ? 'is-active' : ''}`}
            onClick={() => {
              const next = !fogEnabled;
              setFogEnabled(next);
              setFogOfWarEnabled(next);
            }}
            title="Ativar ou dissipar a Névoa de Exploração suave sobre fronteiras não visitadas"
          >
            🌫️ Névoa
          </button>

          <AtlasLayerAndSearchHud
            layers={atlasLayers}
            onChangeLayers={setAtlasLayers}
            eraFilter={eraFilter}
            onChangeEraFilter={setEraFilter}
            onSelectGazetteerEntry={handleSelectGazetteerEntry}
          />

          <button
            type="button"
            className="vwm-tool-btn"
            onClick={() => applyZoom(zoom - 0.25)}
            disabled={zoom <= 1.01}
            title="Afastar câmera"
          >
            −
          </button>
          <button
            type="button"
            className="vwm-tool-btn vwm-zoom-readout"
            onClick={() => {
              setFollowPawn(false);
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            title="Restaurar enquadramento 100% do mapa atual"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            type="button"
            className="vwm-tool-btn"
            onClick={() => applyZoom(zoom + 0.25)}
            disabled={zoom >= 4.49}
            title="Aproximar câmera até 450% (LOD 4)"
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
                  ? 'Mostrar painel lateral de Dossiê'
                  : 'Ocultar Dossiê lateral para expandir o Mapa em Widescreen'
              }
            >
              {isDossierCollapsed ? '📋 Mostrar Dossiê' : '↔️ Expandir'}
            </button>
          )}

          <button
            type="button"
            className={`vwm-tool-btn ${isTheaterFullscreen ? 'is-active' : ''}`}
            onClick={() => setIsTheaterFullscreen((v) => !v)}
            title={
              isTheaterFullscreen
                ? 'Sair da Tela Cheia (Esc)'
                : 'Abrir Multimapa em Tela Cheia (100% do monitor)'
            }
          >
            {isTheaterFullscreen ? '✕ Sair' : '⛶ Tela Cheia'}
          </button>
        </div>
      </div>

      {/* 3. Main 16:9 Traversable Giant Multimap Viewport */}
      <div
        ref={viewportRef}
        className={`vwm-viewport ${zoom > 1.01 ? 'is-zoomed' : ''}`}
        onPointerDown={handlePointerDownViewport}
        onPointerMove={handlePointerMoveViewport}
        onPointerUp={handlePointerUpViewport}
        onPointerCancel={handlePointerUpViewport}
        onWheel={handleWheelViewport}
      >
        {portalBanner && <div className="vwm-portal-toast">{portalBanner}</div>}

        <div
          ref={canvasRef}
          className="vwm-canvas"
          style={{
            transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
          }}
        >
          {/* Illustrated High-Resolution Map (World Continent OR Full-Bleed Regional Realm) */}
          <img
            key={activeRegionalDef ? activeRegionalDef.imagePath : VAELORIA_WORLD_MAP_IMAGE}
            src={activeRegionalDef ? activeRegionalDef.imagePath : VAELORIA_WORLD_MAP_IMAGE}
            alt={activeRegionalDef ? activeRegionalDef.name : 'Mapa Continental de Vaeloria'}
            className="vwm-terrain-img"
            draggable={false}
          />

          {/* Vector SVG Layer: Roads, Portal Trails, Landmarks & Compass Rose */}
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
              <filter id="vwmFogSoftBlur" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="44" />
              </filter>
              {fogEnabled && (
                <mask id="vwmExplorationFogMask">
                  <rect x="0" y="0" width="1600" height="900" fill="white" />
                  <g filter="url(#vwmFogSoftBlur)">
                    {/* Sovereign Vision Halo */}
                    <circle cx={pawnPos.x * 16} cy={pawnPos.y * 9} r="240" fill="black" />
                    {/* Cleared Boss Citadels */}
                    {positionedBosses
                      .filter((b) => clearedBossIds.includes(b.boss.id))
                      .map((b) => (
                        <circle
                          key={`fog-boss-${b.boss.id}`}
                          cx={b.x * 16}
                          cy={b.y * 9}
                          r="210"
                          fill="black"
                        />
                      ))}
                    {/* Visited Realms on World Map OR Explored Landmarks on Regional Map */}
                    {mapScope === 'world'
                      ? Array.from(visitedRealms).map((rid) => {
                          const r = VAELORIA_REGIONAL_MAPS[rid];
                          return (
                            <circle
                              key={`fog-realm-${rid}`}
                              cx={r.worldCenter.x * 16}
                              cy={r.worldCenter.y * 9}
                              r="260"
                              fill="black"
                            />
                          );
                        })
                      : activeRegionalDef?.localLandmarks
                          .filter((lm) => visitedLandmarks.has(lm.id))
                          .map((lm) => (
                            <circle
                              key={`fog-lm-${lm.id}`}
                              cx={lm.x * 16}
                              cy={lm.y * 9}
                              r="175"
                              fill="black"
                            />
                          ))}
                  </g>
                </mask>
              )}
            </defs>

            {/* Soft Cartographic Exploration Fog (toggleable, never hides labels or blocks clicks) */}
            {fogEnabled && (
              <rect
                x="0"
                y="0"
                width="1600"
                height="900"
                fill="rgba(4, 10, 24, 0.42)"
                mask="url(#vwmExplorationFogMask)"
                pointerEvents="none"
              />
            )}

            {/* Living Cartographic Hydrography, Magma, Sea Lanes, Sky Jets, Ley Lines & Animated Traffic */}
            <CartographicSvgLayer
              scope={mapScope}
              zoom={zoom}
              viewBoxWidth={1600}
              viewBoxHeight={900}
              layers={atlasLayers}
              idPrefix="vwm_svg"
              onInspectNote={setInspectedNote}
            />

            {/* Regional Roads from Central Citadel to Neighboring Citadels & Border Portals */}
            {activeRegionalDef ? (
              <g className="vwm-regional-roads-group">
                {positionedBosses.map((entry, idx) => {
                  if (idx === 0) return null;
                  const prev = positionedBosses[idx - 1];
                  const x1 = prev.x * 16;
                  const y1 = prev.y * 9;
                  const x2 = entry.x * 16;
                  const y2 = entry.y * 9;
                  const mx = (x1 + x2) / 2;
                  const my = (y1 + y2) / 2 - 22;
                  const bothCleared =
                    clearedBossIds.includes(prev.boss.id) &&
                    clearedBossIds.includes(entry.boss.id);
                  return (
                    <path
                      key={`reg-road-${prev.boss.id}-${entry.boss.id}`}
                      d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
                      fill="none"
                      className={`vwm-road-path ${bothCleared ? 'is-cleared-road' : 'is-frontier-road'}`}
                    />
                  );
                })}
              </g>
            ) : (
              /* Continental Sequential Overland Roads */
              positionedBosses.map((entry, idx) => {
                if (idx === 0) return null;
                const prev = positionedBosses[idx - 1];
                const x1 = prev.x * 16;
                const y1 = prev.y * 9;
                const x2 = entry.x * 16;
                const y2 = entry.y * 9;
                const mx = (x1 + x2) / 2;
                const my = (y1 + y2) / 2 - Math.min(48, Math.hypot(x2 - x1, y2 - y1) * 0.11);

                const bothCleared =
                  clearedBossIds.includes(prev.boss.id) &&
                  clearedBossIds.includes(entry.boss.id);
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
              })
            )}

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

            {/* Engraved Cartographic Compass Rose */}
            <g transform="translate(1515, 815)" opacity="0.88" filter="url(#vwmTextShadow)">
              <circle
                cx="0"
                cy="0"
                r="42"
                fill="rgba(7, 11, 20, 0.78)"
                stroke="rgba(212, 175, 55, 0.55)"
                strokeWidth="1.6"
              />
              <polygon points="0,-35 6,-7 0,-12 -6,-7" fill="#d4af37" />
              <polygon points="0,35 5,7 0,12 -5,7" fill="#94a3b8" />
              <polygon points="-35,0 -7,-5 -12,0 -7,5" fill="#94a3b8" />
              <polygon points="35,0 7,-5 12,0 7,5" fill="#94a3b8" />
              <circle cx="0" cy="0" r="4.2" fill="#e5c97b" />
              <text x="0" y="-44" textAnchor="middle" className="vwm-compass-letter" fill="#fde68a">
                N
              </text>
              <text x="0" y="54" textAnchor="middle" className="vwm-compass-letter" fill="#cbd5e1">
                S
              </text>
            </g>
          </svg>

          {/* Multi-LOD Toponyms, 162 Unified Settlements, 36 Capital Districts & VII Cantos Battlefields */}
          <CartographicHtmlPinsLayer
            scope={mapScope}
            zoom={zoom}
            layers={atlasLayers}
            eraFilter={eraFilter}
            showUnifiedSettlements={showGeographyLabels}
            highlightTarget={gazetteerHighlight}
            inspectedNoteId={inspectedNote?.id ?? null}
            onInspectNote={setInspectedNote}
          />

          {/* On World Map: Clickable Gateways on Realms, Deep Frontiers, Corridors & Capital Dive Pills */}
          {mapScope === 'world' &&
            showGeographyLabels &&
            [
              ...VAELORIA_CARDINAL_REALMS,
              ...VAELORIA_DEEP_FRONTIERS,
              ...VAELORIA_TRANSIT_CORRIDORS,
            ].map((rid) => {
              const rdef = VAELORIA_REGIONAL_MAPS[rid];
              const capId = CARDINAL_TO_CAPITAL_MAP[rid];
              const capDef = capId ? VAELORIA_REGIONAL_MAPS[capId] : null;
              const edgeClass =
                rdef.worldCenter.x < 16
                  ? 'is-edge-left'
                  : rdef.worldCenter.x > 84
                    ? 'is-edge-right'
                    : '';
              const diveOffsetY =
                rdef.tier === 'cardinal_realm' && rid !== 'matrix' ? 4.5 : 0;
              return (
                <React.Fragment key={`dive-group-${rid}`}>
                  <button
                    type="button"
                    className={`vwm-realm-dive-chip ${edgeClass}`}
                    style={
                      {
                        left: `${rdef.worldCenter.x}%`,
                        top: `${rdef.worldCenter.y + diveOffsetY}%`,
                        transform: `translate(-50%, -50%) scale(${pinCounterScale})`,
                      } as React.CSSProperties
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSwitchMapScope(rid);
                    }}
                    title={`Entrar no Mapa de ${rdef.name}`}
                  >
                    <span
                      className="vwm-dive-dot"
                      style={{ background: rdef.accentColor }}
                      aria-hidden="true"
                    />
                    <strong className="vwm-hover-pill-text">{rdef.shortName}</strong>
                  </button>
                  {capDef && zoom >= 1.9 && (
                    <button
                      type="button"
                      className={`vwm-realm-dive-chip is-capital-dive-chip ${edgeClass}`}
                      style={
                        {
                          left: `${rdef.worldCenter.x}%`,
                          top: `${rdef.worldCenter.y + (rid === 'matrix' ? 4.2 : 8.2)}%`,
                          transform: `translate(-50%, -50%) scale(${pinCounterScale})`,
                        } as React.CSSProperties
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSwitchMapScope(capDef.id);
                      }}
                      title={`Mergulhar na 4ª Escala Urbana: ${capDef.name}`}
                    >
                      <span
                        className="vwm-dive-dot"
                        style={{ background: capDef.accentColor }}
                        aria-hidden="true"
                      />
                      <strong className="vwm-hover-pill-text">{capDef.shortName}</strong>
                    </button>
                  )}
                </React.Fragment>
              );
            })}

          {/* Inside Regional Map: Interactive Living Landmarks (6 per Realm = 36 Overworld Events!) */}
          {activeRegionalDef &&
            activeRegionalDef.localLandmarks.map((lm) => {
              const isExplored = visitedLandmarks.has(lm.id);
              return (
                <button
                  key={lm.id}
                  type="button"
                  className={`vwm-landmark-node ${isExplored ? 'is-explored' : 'is-ready'} ${
                    lm.x < 16 ? 'is-edge-left' : lm.x > 84 ? 'is-edge-right' : ''
                  } ${lm.y > 84 ? 'is-edge-bottom' : ''}`}
                  style={
                    {
                      left: `${lm.x}%`,
                      top: `${lm.y}%`,
                      '--lm-accent': activeRegionalDef.accentColor,
                    } as React.CSSProperties
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    startMarchTo(lm.x, lm.y);
                    playSfx('channel');
                    setActiveLandmarkModal({
                      realm: activeRegionalDef.id,
                      landmark: lm,
                    });
                  }}
                  title={`${lm.name} — ${
                    isExplored ? 'Marco já explorado' : 'Clique para explorar este Marco Vivo!'
                  }`}
                >
                  <span className="vwm-lm-icon">{LOCAL_LANDMARK_ICON[lm.kind] ?? '✦'}</span>
                  <span className="vwm-lm-status-dot">{isExplored ? '✓' : '✦'}</span>
                  <span className="vwm-lm-label">{lm.name}</span>
                </button>
              );
            })}

          {/* Inside Regional Map: Walkable & Clickable Border Gate Portals to Neighboring Realms */}
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
                  title={`Cruzar fronteira para ${targetDef.name} (${portal.sublabel})`}
                >
                  <span
                    className="vwm-portal-dot"
                    style={{ background: targetDef.accentColor }}
                    aria-hidden="true"
                  />
                  <span className="vwm-portal-dir-badge">{portal.directionIcon}</span>
                  <span className="vwm-portal-texts">
                    <strong>{portal.label}</strong>
                    <small>{portal.sublabel}</small>
                  </span>
                </button>
              );
            })}

          {/* Live Weekly Fracture Rift Anomaly Marker on Continental World Map */}
          {mapScope === 'world' && mode === 'campaign' && onOpenWeeklyRift && (
            <button
              type="button"
              className="vwm-rift-anomaly-pin"
              style={
                {
                  left: `${weeklyRiftWorldCoords.x}%`,
                  top: `${weeklyRiftWorldCoords.y}%`,
                  '--rift-accent': weeklyRift.accent,
                } as React.CSSProperties
              }
              onClick={(e) => {
                e.stopPropagation();
                playSfx('portal_cross');
                onOpenWeeklyRift();
              }}
              title={`Fenda Semanal em Destaque: ${weeklyRift.name} — ${weeklyRift.shortRule} (+${WEEKLY_RIFT_SHARDS_BONUS} Estilhaços)`}
            >
              <span className="vwm-rift-anomaly-ring" />
              <span className="vwm-rift-anomaly-core">{weeklyRift.icon}</span>
              <span className="vwm-rift-anomaly-tag">
                <strong>Fenda: {weeklyRift.name}</strong>
                <small>+{WEEKLY_RIFT_SHARDS_BONUS} Estilhaços • Entrar</small>
              </span>
            </button>
          )}

          {/* Boss Citadel Pins */}
          {positionedBosses.map((entry) => {
            const { boss, worldNode, x, y } = entry;
            const isSelected = boss.id === selectedBossId;
            const isCleared = clearedBossIds.includes(boss.id);
            const isNextTarget = boss.id === nextUnclearBossId;
            const isHovered = hoveredBossId === boss.id;
            const isDockedHere = dockedBossEntry?.boss.id === boss.id;
            const primaryDom = resolvePrimaryBossDomain(boss.domains);
            const domColor = DOMAIN_META[primaryDom].color;
            const bossCard = CARDS_BY_ID[boss.avatarCardId];
            const isFinalWheel =
              boss.stage === 26 || boss.stage === 32 || (mode === 'expedition' && boss.stage === 9);

            return (
              <button
                key={boss.id}
                type="button"
                className={`vwm-boss-node ${isSelected ? 'is-selected' : ''} ${
                  isCleared ? 'is-cleared' : ''
                } ${isNextTarget ? 'is-next-target' : ''} ${isFinalWheel ? 'is-axial-apex' : ''} ${
                  y < 23 ? 'is-near-top' : ''
                } ${x < 16 ? 'is-near-left' : x > 84 ? 'is-near-right' : ''}`}
                style={
                  {
                    left: `${x}%`,
                    top: `${y}%`,
                    '--pin-color': domColor,
                  } as React.CSSProperties
                }
                onClick={(e) => handleClickBossPin(e, entry)}
                onMouseEnter={() => setHoveredBossId(boss.id)}
                onMouseLeave={() => setHoveredBossId((prev) => (prev === boss.id ? null : prev))}
                title={`${boss.name} — ${worldNode.landmarkName} (${worldNode.regionName})`}
              >
                <span className="vwm-boss-node-ring" />
                <span className="vwm-boss-node-portrait">
                  {bossCard?.imagePath ? (
                    <img src={bossCard.imagePath} alt={boss.name} draggable={false} />
                  ) : (
                    <span>⚔</span>
                  )}
                </span>
                <span className="vwm-boss-stage-badge">
                  {isCleared ? `✓${boss.stage}` : boss.stage}
                </span>

                {(isHovered || (!isDockedHere && clickedBossLabelId === boss.id)) && (
                  <span className="vwm-boss-tooltip">
                    <strong>{boss.name}</strong>
                    <em>{worldNode.landmarkName}</em>
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
            {dockedBossEntry ? (
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
            ) : dockedLandmark && activeRegionalDef && !visitedLandmarks.has(dockedLandmark.id) ? (
              <button
                type="button"
                className="vwm-pawn-challenge-pill is-explore-pill"
                onClick={(e) => {
                  e.stopPropagation();
                  playSfx('channel');
                  setActiveLandmarkModal({
                    realm: activeRegionalDef.id,
                    landmark: dockedLandmark,
                  });
                }}
              >
                🧭 Explorar {dockedLandmark.name}
              </button>
            ) : null}

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

        {/* Live Continental Minimap Radar (Top-Right) */}
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
                if (zoom > 1.05) {
                  centerCameraAt(mx, my, zoom);
                }
              } else {
                handleSwitchMapScope(resolveNearestRealmFromWorldCoords(mx, my));
              }
            }}
            title="Minimapa Continental de Vaeloria — Clique para saltar para qualquer Reino"
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
                left: `${globalSovereignCoords.x}%`,
                top: `${globalSovereignCoords.y}%`,
              }}
            />
            <span className="vwm-minimap-caption">
              {activeRegionalDef ? activeRegionalDef.shortName : 'GPS Vaeloria'}
            </span>
            <button
              type="button"
              className="vwm-minimap-close"
              onClick={(e) => {
                e.stopPropagation();
                setShowMinimap(false);
              }}
              title="Recolher minimapa"
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
            title="Abrir Minimapa GPS Continental"
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
              handleCenterOnSovereign();
            }}
            title="Focar câmera no Soberano"
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

        {/* Dynamic Cartographic Scale Ruler (Leagues / Meters) */}
        <CartographicScaleRuler scope={mapScope} zoom={zoom} />

        {/* "📖 Caderno do Cartógrafo Real" Inspector Drawer */}
        <CartographerInspectorCard
          note={inspectedNote}
          onClose={() => setInspectedNote(null)}
          onNavigateScope={(s) => handleSwitchMapScope(s)}
        />
      </div>

      {/* Bottom Cartographic Legend & Navigation Hint */}
      <div className="vwm-footer-hint">
        <span>
          {mapScope === 'world' ? (
            <>
              🧭 <strong>Atlas Quadri-Escala (21 Mapas)</strong>: Explore <strong>6 Reinos</strong>,{' '}
              <strong>6 Fronteiras</strong>, <strong>2 Corredores</strong> e <strong>6 Capitais</strong> •{' '}
              Clique em rios, topônimos ou vilas para abrir o <strong>📖 Caderno do Cartógrafo</strong> •{' '}
              <strong>WASD</strong> / Clique para marchar (Zoom até <strong>4.5x</strong>)
            </>
          ) : (
            <>
              🧭 Clique nos <strong>✦ 120 Marcos Vivos</strong>, <strong>🏰 36 Distritos Imperiais</strong> ou{' '}
              <strong>🌊 Rios & Rotas</strong> para ver crônicas e <strong>Cartas Nativas</strong> •{' '}
              Marche até os <strong>Portais</strong> para cruzar entre as 4 escalas
            </>
          )}
        </span>
      </div>

      {activeLandmarkModal && (
        <OverworldEventModal
          eventDef={getLandmarkEventDef(
            activeLandmarkModal.realm,
            activeLandmarkModal.landmark
          )}
          mode={mode}
          alreadyExplored={visitedLandmarks.has(activeLandmarkModal.landmark.id)}
          onSelectChoice={(_choice, preview) => {
            if (mode === 'campaign') {
              setVisitedLandmarks(
                markCampaignLandmarkVisited(activeLandmarkModal.landmark.id)
              );
            } else {
              setVisitedLandmarks(
                markExpeditionLandmarkVisited(activeLandmarkModal.landmark.id)
              );
            }
            if (preview.goldDelta > 0) {
              onRewardGold?.(
                preview.goldDelta,
                `Descoberta em ${activeLandmarkModal.landmark.name}`
              );
            }
            if (preview.shardsDelta > 0) {
              onRewardShards?.(
                preview.shardsDelta,
                `Pacto Ancestral em ${activeLandmarkModal.landmark.name}`
              );
            }
            if (preview.recruitedCard) {
              onGrantExpeditionCard?.(preview.recruitedCard);
            }
            if (preview.fieldBuff) {
              setPendingOverworldBuff(mode, preview.fieldBuff);
              setPendingBuff(preview.fieldBuff);
            }
            showPortalNotification(
              `✦ ${activeLandmarkModal.landmark.name}: ${preview.rewardBadge}`
            );
            setActiveLandmarkModal(null);
          }}
          onClose={() => setActiveLandmarkModal(null)}
        />
      )}
    </div>
  );
};
