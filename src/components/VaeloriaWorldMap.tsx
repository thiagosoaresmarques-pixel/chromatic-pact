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
import {
  GRAND_CAMPAIGN_NODES_BY_ID,
  GRAND_CAMPAIGN_SUBMAP_GRAPHS,
  SOVEREIGN_BANNER_PALETTE,
  STARTING_REALM_BY_SOVEREIGN_DOMAIN,
  SovereignBannerDomain,
  WORLD_SUBMAP_EDGES,
  computeSubmapReachability,
  computeUnlockedCampaignSubmaps,
  findSubmapStepPath,
  findWorldSubmapStepPath,
  loadCampaignMapSession,
  saveCampaignMapSession,
} from '../data/vaeloriaGrandCampaign';

export interface VaeloriaWorldMapProps {
  mode: 'campaign' | 'expedition';
  bosses: CampaignBoss[];
  allBosses?: CampaignBoss[];
  selectedBossId: string;
  clearedBossIds: string[];
  sovereignDomain?: SovereignBannerDomain;
  sovereignAvatarCardId?: string;
  sovereignLabel?: string;
  isDossierCollapsed?: boolean;
  onToggleDossier?: () => void;
  onOpenDossier?: () => void;
  onCloseDossier?: () => void;
  isTheaterFullscreen?: boolean;
  onChangeTheaterFullscreen?: (next: boolean) => void;
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
  x: number;
  y: number;
  tier?: 1 | 2 | 3 | 4 | 5;
  submapOrder?: number;
  isEntryNode?: boolean;
  isThroneNode?: boolean;
  encounterKind?: 'rare_garrison' | 'legendary_sovereign' | 'throne_apex';
}

interface MarchWaypoint {
  x: number;
  y: number;
  onArrive?: () => void;
}

const LOCAL_LANDMARK_GLYPH: Record<string, string> = {
  town: '◈',
  ruin: '❖',
  fort: '⛨',
  port: '⚓',
  shrine: '✦',
  pass: '⬡',
};

const CLAMP_MIN_X = 3.5;
const CLAMP_MAX_X = 96.5;
const CLAMP_MIN_Y = 4.5;
const CLAMP_MAX_Y = 95.5;

export const VaeloriaWorldMap: React.FC<VaeloriaWorldMapProps> = ({
  mode,
  bosses,
  allBosses,
  selectedBossId,
  clearedBossIds,
  sovereignDomain = 'green',
  sovereignAvatarCardId,
  sovereignLabel = 'Seu Soberano',
  isDossierCollapsed = true,
  onToggleDossier,
  onOpenDossier,
  onCloseDossier,
  isTheaterFullscreen: controlledTheaterFullscreen,
  onChangeTheaterFullscreen,
  onSelectBoss,
  onChallengeBoss,
  onRewardGold,
  onRewardShards,
  onGrantExpeditionCard,
  onOpenWeeklyRift,
}) => {
  const completeRoster = allBosses && allBosses.length > 0 ? allBosses : bosses;
  const isCampaign = mode === 'campaign';
  const bannerPalette = SOVEREIGN_BANNER_PALETTE[sovereignDomain];
  const startingRealm = STARTING_REALM_BY_SOVEREIGN_DOMAIN[sovereignDomain];

  const clearedSet = useMemo(() => new Set(clearedBossIds), [clearedBossIds]);

  const weeklyRift = useMemo(() => getWeeklyFeaturedRift(), []);
  const weeklyRiftWorldCoords = useMemo(() => {
    const coordsByRift: Record<string, { x: number; y: number }> = {
      astral_torrent: { x: 56.5, y: 12.5 },
      immortal_pantheon: { x: 80.5, y: 49.5 },
      eternal_cataclysm: { x: 46.5, y: 24.5 },
      glass_thrones: { x: 55.5, y: 28.5 },
      living_forge: { x: 67.5, y: 39.5 },
      black_sun_night: { x: 25.5, y: 46.5 },
    };
    return coordsByRift[weeklyRift.id] ?? { x: 49.5, y: 52.5 };
  }, [weeklyRift.id]);

  // Zoom strictly locked at 100% (1.0x) on all maps and submaps
  const zoom = 1;

  // Grand Campaign Submap Unlock & Reachability State
  const unlockedCampaignSubmaps = useMemo(
    () =>
      isCampaign
        ? computeUnlockedCampaignSubmaps(clearedBossIds, sovereignDomain)
        : new Set<VaeloriaRealmId>(VAELORIA_REALM_ORDER),
    [isCampaign, clearedBossIds, sovereignDomain]
  );

  const initialCampaignSessionRef = useRef(
    isCampaign ? loadCampaignMapSession() : null
  );

  const [mapScope, setMapScope] = useState<VaeloriaMapScope>(() => {
    const saved = initialCampaignSessionRef.current;
    if (!isCampaign || !saved) return 'world';
    if (saved.mapScope === 'world') return 'world';
    return unlockedCampaignSubmaps.has(saved.mapScope) ? saved.mapScope : 'world';
  });
  const [internalTheaterFullscreen, setInternalTheaterFullscreen] = useState<boolean>(() =>
    isCampaign ? Boolean(initialCampaignSessionRef.current?.isTheaterFullscreen) : false
  );
  const isTheaterFullscreen =
    controlledTheaterFullscreen !== undefined
      ? controlledTheaterFullscreen
      : internalTheaterFullscreen;

  const handleSetTheaterFullscreen = useCallback(
    (next: boolean | ((prev: boolean) => boolean)) => {
      const resolved = typeof next === 'function' ? next(isTheaterFullscreen) : next;
      setInternalTheaterFullscreen(resolved);
      onChangeTheaterFullscreen?.(resolved);
      if (isCampaign) {
        saveCampaignMapSession({ isTheaterFullscreen: resolved });
      }
    },
    [isTheaterFullscreen, onChangeTheaterFullscreen, isCampaign]
  );

  const [showMinimap, setShowMinimap] = useState<boolean>(false);
  const [portalBanner, setPortalBanner] = useState<string | null>(() =>
    isCampaign ? initialCampaignSessionRef.current?.returnBanner ?? null : null
  );
  const [fogEnabled, setFogEnabled] = useState<boolean>(() =>
    isCampaign ? false : getFogOfWarEnabled()
  );
  const [visitedRealms, setVisitedRealms] = useState<Set<VaeloriaRealmId>>(() =>
    getVisitedRealms()
  );
  const [visitedLandmarks, setVisitedLandmarks] = useState<Set<string>>(() =>
    isCampaign ? getVisitedCampaignLandmarks() : getVisitedExpeditionLandmarks()
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
  const [showGeographyLabels, setShowGeographyLabels] = useState<boolean>(false);
  const [hoveredBossId, setHoveredBossId] = useState<string | null>(null);
  const [hoveredWorldHubId, setHoveredWorldHubId] = useState<VaeloriaRealmId | null>(null);

  useEffect(() => {
    if (!gazetteerHighlight) return;
    const t = window.setTimeout(() => setGazetteerHighlight(null), 5500);
    return () => window.clearTimeout(t);
  }, [gazetteerHighlight]);

  useEffect(() => {
    setVisitedLandmarks(
      isCampaign ? getVisitedCampaignLandmarks() : getVisitedExpeditionLandmarks()
    );
    setPendingBuff(getPendingOverworldBuff(mode));
  }, [isCampaign, mode, clearedBossIds.length]);

  const lockedCampaignSubmaps = useMemo(() => {
    if (!isCampaign) return new Set<VaeloriaRealmId>();
    const locked = new Set<VaeloriaRealmId>();
    for (const rid of VAELORIA_REALM_ORDER) {
      if (!unlockedCampaignSubmaps.has(rid)) locked.add(rid);
    }
    return locked;
  }, [isCampaign, unlockedCampaignSubmaps]);

  const submapReachByRealm = useMemo(() => {
    const out = {} as Record<
      VaeloriaRealmId,
      ReturnType<typeof computeSubmapReachability>
    >;
    for (const rid of VAELORIA_REALM_ORDER) {
      out[rid] = computeSubmapReachability(rid, clearedBossIds);
    }
    return out;
  }, [clearedBossIds]);

  const conqueredCampaignSubmaps = useMemo(() => {
    const set = new Set<VaeloriaRealmId>();
    if (!isCampaign) return set;
    for (const rid of VAELORIA_REALM_ORDER) {
      if (submapReachByRealm[rid]?.isSubmapConquered) {
        set.add(rid);
      }
    }
    return set;
  }, [isCampaign, submapReachByRealm]);

  const enrichedAllBosses = useMemo(() => {
    return completeRoster.map((boss) => {
      const gcNode = isCampaign ? GRAND_CAMPAIGN_NODES_BY_ID[boss.id] : undefined;
      if (gcNode) {
        const rdef = VAELORIA_REGIONAL_MAPS[gcNode.submapId];
        const worldNode: VaeloriaStageMapNode = {
          stage: gcNode.stage,
          bossId: gcNode.id,
          territoryDomain: resolvePrimaryBossDomain(boss.domains),
          x: gcNode.worldX,
          y: gcNode.worldY,
          regionName: rdef.name,
          landmarkName: gcNode.landmarkName,
        };
        return {
          boss,
          worldNode,
          realm: gcNode.submapId,
          rx: gcNode.rx,
          ry: gcNode.ry,
          tier: gcNode.tier,
          submapOrder: gcNode.submapOrder,
          isEntryNode: gcNode.isEntryNode,
          isThroneNode: gcNode.isThroneNode,
          encounterKind: gcNode.encounterKind,
        };
      }
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
  }, [completeRoster, isCampaign, mode]);

  const realmBossCounts = useMemo(() => {
    const counts = {} as Record<VaeloriaRealmId, { total: number; cleared: number }>;
    for (const rid of VAELORIA_REALM_ORDER) {
      if (isCampaign) {
        const reach = submapReachByRealm[rid];
        counts[rid] = {
          total: reach.totalCount,
          cleared: reach.clearedCount,
        };
      } else {
        counts[rid] = { total: 0, cleared: 0 };
      }
    }
    if (!isCampaign) {
      for (const item of enrichedAllBosses) {
        const isCleared = clearedSet.has(item.boss.id);
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
    }
    return counts;
  }, [isCampaign, submapReachByRealm, enrichedAllBosses, clearedSet]);

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

  // Visible boss pins:
  // - In Campaign 'world': 0 individual boss pins (Continent cleanly shows the 20 Submap Territory Hubs & Roads!)
  // - In Campaign submap: ONLY that submap's native Grand Campaign encounters (6..14 pins, planar road graph)
  // - In Expedition: 9 expedition stages
  const positionedBosses: PositionedBossEntry[] = useMemo(() => {
    if (isCampaign) {
      if (mapScope === 'world') return [];
      return enrichedAllBosses
        .filter((item) => item.realm === mapScope)
        .sort((a, b) => (a.submapOrder ?? a.boss.stage) - (b.submapOrder ?? b.boss.stage))
        .map((item) => ({
          ...item,
          x: item.rx,
          y: item.ry,
        }));
    }

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
  }, [isCampaign, mapScope, bosses, enrichedAllBosses]);

  const selectedEntryGlobal = useMemo(
    () =>
      enrichedAllBosses.find((entry) => entry.boss.id === selectedBossId) ??
      enrichedAllBosses[0],
    [enrichedAllBosses, selectedBossId]
  );

  // Sovereign Pawn Coordinates (0..100%)
  const [pawnPos, setPawnPos] = useState<{ x: number; y: number }>(() => {
    if (isCampaign) {
      const saved = initialCampaignSessionRef.current;
      if (saved?.pawnPos && (saved.mapScope === 'world' || unlockedCampaignSubmaps.has(saved.mapScope))) {
        return saved.pawnPos;
      }
      if (mapScope !== 'world') {
        const g = GRAND_CAMPAIGN_SUBMAP_GRAPHS[mapScope];
        return { x: g.entryPos.x, y: g.entryPos.y };
      }
      const startHub = GRAND_CAMPAIGN_SUBMAP_GRAPHS[startingRealm].worldHub;
      return { x: startHub.x, y: startHub.y };
    }
    return {
      x: selectedEntryGlobal?.worldNode.x ?? 50,
      y: selectedEntryGlobal?.worldNode.y ?? 50.5,
    };
  });

  const [marchWaypoints, setMarchWaypoints] = useState<MarchWaypoint[]>([]);
  const [facingLeft, setFacingLeft] = useState<boolean>(false);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const pawnPosRef = useRef<{ x: number; y: number }>(pawnPos);
  pawnPosRef.current = pawnPos;
  const mapScopeRef = useRef<VaeloriaMapScope>(mapScope);
  mapScopeRef.current = mapScope;
  const marchWaypointsRef = useRef<MarchWaypoint[]>(marchWaypoints);
  marchWaypointsRef.current = marchWaypoints;
  const lastWorldRealmRef = useRef<VaeloriaRealmId>(
    mapScope !== 'world' ? mapScope : startingRealm
  );
  const prevStartingRealmRef = useRef<VaeloriaRealmId>(startingRealm);

  // Restore submap music & clear one-shot return banner on mount
  useEffect(() => {
    if (!isCampaign) return;
    if (mapScopeRef.current !== 'world') {
      const regDef = VAELORIA_REGIONAL_MAPS[mapScopeRef.current];
      setMusicState('sanctuary', regDef.domain);
      setVisitedRealms(markRealmVisited(mapScopeRef.current));
    }
    if (initialCampaignSessionRef.current?.returnBanner) {
      saveCampaignMapSession({ returnBanner: null });
    }
  }, [isCampaign]);

  // Reposition Sovereign on world map ONLY when player explicitly switches Sovereign Banner Color
  useEffect(() => {
    if (!isCampaign) return;
    if (prevStartingRealmRef.current === startingRealm) return;
    prevStartingRealmRef.current = startingRealm;
    lastWorldRealmRef.current = startingRealm;
    if (mapScopeRef.current === 'world') {
      const hub = GRAND_CAMPAIGN_SUBMAP_GRAPHS[startingRealm].worldHub;
      pawnPosRef.current = { x: hub.x, y: hub.y };
      setPawnPos({ x: hub.x, y: hub.y });
      setMarchWaypoints([]);
      saveCampaignMapSession({ mapScope: 'world', pawnPos: { x: hub.x, y: hub.y } });
    }
  }, [isCampaign, startingRealm]);

  const showPortalNotification = useCallback((msg: string) => {
    setPortalBanner(msg);
  }, []);

  useEffect(() => {
    if (!portalBanner) return;
    const t = window.setTimeout(() => setPortalBanner(null), 2800);
    return () => window.clearTimeout(t);
  }, [portalBanner]);

  // Escape closes Dossier Drawer first if open, otherwise exits Theater Fullscreen
  useEffect(() => {
    if (!isTheaterFullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!isDossierCollapsed && onCloseDossier) {
          onCloseDossier();
          return;
        }
        handleSetTheaterFullscreen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isTheaterFullscreen, isDossierCollapsed, onCloseDossier, handleSetTheaterFullscreen]);

  const startWaypointMarch = useCallback((waypoints: MarchWaypoint[], silent = false) => {
    if (waypoints.length === 0) return;
    const sanitized = waypoints.map((wp) => ({
      ...wp,
      x: Math.max(CLAMP_MIN_X, Math.min(CLAMP_MAX_X, wp.x)),
      y: Math.max(CLAMP_MIN_Y, Math.min(CLAMP_MAX_Y, wp.y)),
    }));
    const first = sanitized[0];
    const cur = pawnPosRef.current;
    if (
      sanitized.length === 1 &&
      Math.hypot(first.x - cur.x, first.y - cur.y) < 0.45
    ) {
      marchWaypointsRef.current = [];
      setMarchWaypoints([]);
      first.onArrive?.();
      return;
    }
    const dx = first.x - cur.x;
    if (Math.abs(dx) > 0.35) {
      setFacingLeft(dx < 0);
    }
    marchWaypointsRef.current = sanitized;
    setMarchWaypoints(sanitized);
    if (!silent) {
      playSfx('draw');
    }
  }, []);

  const explainLockedSubmap = useCallback(
    (targetRealm: VaeloriaRealmId) => {
      const targetDef = VAELORIA_REGIONAL_MAPS[targetRealm];
      playSfx('channel');
      // Find a gatekeeper node that unlocks targetRealm
      const gateNode = enrichedAllBosses.find((e) => {
        const gcn = GRAND_CAMPAIGN_NODES_BY_ID[e.boss.id];
        return gcn?.unlocksSubmaps.includes(targetRealm);
      });
      if (gateNode) {
        const parentDef = VAELORIA_REGIONAL_MAPS[gateNode.realm];
        showPortalNotification(
          `🔒 ${targetDef.shortName} bloqueado — vença ${gateNode.boss.name} em ${parentDef.shortName}`
        );
      } else {
        const startDef = VAELORIA_REGIONAL_MAPS[startingRealm];
        showPortalNotification(
          `🔒 ${targetDef.shortName} bloqueado — abra a fronteira inicial em ${startDef.shortName}`
        );
      }
    },
    [enrichedAllBosses, startingRealm, showPortalNotification]
  );

  // Switch between 'world' and any of the 20 Submaps at strict 100% fit-on-screen
  const handleSwitchMapScope = useCallback(
    (
      nextScope: VaeloriaMapScope,
      arrivalOverride?: { x: number; y: number; banner?: string; viaPortal?: boolean }
    ) => {
      if (isCampaign && nextScope !== 'world' && !unlockedCampaignSubmaps.has(nextScope)) {
        explainLockedSubmap(nextScope);
        return;
      }
      if (nextScope === mapScopeRef.current && !arrivalOverride) return;

      marchWaypointsRef.current = [];
      setMarchWaypoints([]);

      if (arrivalOverride?.viaPortal) {
        playSfx('portal_cross');
      } else {
        playSfx('channel');
      }
      playRealmEntryMotif(nextScope);

      if (nextScope === 'world') {
        setMusicState('tactical', 'purple');
        const prevScope = mapScopeRef.current;
        let wx = pawnPosRef.current.x;
        let wy = pawnPosRef.current.y;
        if (isCampaign) {
          const hubRealm =
            prevScope !== 'world' ? prevScope : lastWorldRealmRef.current;
          const hub = GRAND_CAMPAIGN_SUBMAP_GRAPHS[hubRealm]?.worldHub;
          wx = hub?.x ?? 50;
          wy = hub?.y ?? 50;
        } else if (prevScope !== 'world') {
          const prevDef = VAELORIA_REGIONAL_MAPS[prevScope];
          wx = prevDef.worldCenter.x;
          wy = prevDef.worldCenter.y;
        }
        mapScopeRef.current = 'world';
        setMapScope('world');
        pawnPosRef.current = { x: wx, y: wy };
        setPawnPos({ x: wx, y: wy });
        if (isCampaign) {
          saveCampaignMapSession({ mapScope: 'world', pawnPos: { x: wx, y: wy }, returnBanner: null });
        }
        showPortalNotification('Carta Continental de Vaeloria');
        return;
      }

      lastWorldRealmRef.current = nextScope;
      const regDef = VAELORIA_REGIONAL_MAPS[nextScope];
      setMusicState('sanctuary', regDef.domain);
      setVisitedRealms(markRealmVisited(nextScope));

      let destX = arrivalOverride?.x ?? 50;
      let destY = arrivalOverride?.y ?? 50;

      if (isCampaign) {
        const g = GRAND_CAMPAIGN_SUBMAP_GRAPHS[nextScope];
        const reach = submapReachByRealm[nextScope];
        if (!arrivalOverride) {
          destX = g.entryPos.x;
          destY = g.entryPos.y;
        }
        // Auto-select first frontline boss (or throne if conquered) without opening drawer until clicked
        const firstFrontlineId =
          g.nodeIds.find((nid) => reach.frontlineNodeIds.has(nid)) ?? g.throneNodeId;
        const foundBoss = enrichedAllBosses.find((b) => b.boss.id === firstFrontlineId);
        if (foundBoss && foundBoss.boss.id !== selectedBossId) {
          onSelectBoss(foundBoss.boss);
        }
      } else {
        const realmBosses = enrichedAllBosses.filter((b) => b.realm === nextScope);
        const preferred =
          realmBosses.find((b) => b.boss.id === selectedBossId) ??
          realmBosses.find((b) => !clearedSet.has(b.boss.id)) ??
          realmBosses[0];
        destX = arrivalOverride?.x ?? preferred?.rx ?? 50;
        destY = arrivalOverride?.y ?? preferred?.ry ?? 50;
        if (!arrivalOverride && preferred && preferred.boss.id !== selectedBossId) {
          onSelectBoss(preferred.boss);
        }
      }

      mapScopeRef.current = nextScope;
      setMapScope(nextScope);
      pawnPosRef.current = { x: destX, y: destY };
      setPawnPos({ x: destX, y: destY });
      if (isCampaign) {
        saveCampaignMapSession({
          mapScope: nextScope,
          pawnPos: { x: destX, y: destY },
          returnBanner: null,
        });
      }

      showPortalNotification(arrivalOverride?.banner ?? regDef.name);
    },
    [
      isCampaign,
      unlockedCampaignSubmaps,
      explainLockedSubmap,
      submapReachByRealm,
      enrichedAllBosses,
      selectedBossId,
      clearedSet,
      onSelectBoss,
      showPortalNotification,
    ]
  );

  // Check whether a submap border portal is open in Campaign mode
  const isPortalUnlockedInCampaign = useCallback(
    (fromRealm: VaeloriaRealmId, portal: RegionalBorderPortal): { ok: boolean; reason?: string } => {
      if (!isCampaign) return { ok: true };
      const targetDef = VAELORIA_REGIONAL_MAPS[portal.targetRealm];
      if (!unlockedCampaignSubmaps.has(portal.targetRealm)) {
        const g = GRAND_CAMPAIGN_SUBMAP_GRAPHS[fromRealm];
        const localGateId = g?.portalGatekeepers[portal.targetRealm];
        const gateBoss = localGateId ? GRAND_CAMPAIGN_NODES_BY_ID[localGateId]?.boss : null;
        return {
          ok: false,
          reason: gateBoss
            ? `🔒 Passagem para ${targetDef.shortName} bloqueada por ${gateBoss.name}`
            : `🔒 Fronteira para ${targetDef.shortName} bloqueada — avance na estrada`,
        };
      }
      // Also check local gatekeeper if targetRealm is deeper tier than fromRealm
      const g = GRAND_CAMPAIGN_SUBMAP_GRAPHS[fromRealm];
      const gateId = g?.portalGatekeepers[portal.targetRealm];
      const fromDef = VAELORIA_REGIONAL_MAPS[fromRealm];
      const isRetreatToCardinal =
        targetDef.tier === 'cardinal_realm' && fromDef.tier !== 'cardinal_realm';
      if (gateId && !isRetreatToCardinal && !clearedSet.has(gateId)) {
        // Allow border-ring between unlocked cardinal realms once at least 1 entry node in fromRealm is cleared OR retreating to startingRealm
        const sameCardinalRing =
          fromDef.tier === 'cardinal_realm' &&
          targetDef.tier === 'cardinal_realm' &&
          (portal.targetRealm === startingRealm ||
            submapReachByRealm[fromRealm].clearedCount > 0 ||
            submapReachByRealm[portal.targetRealm].clearedCount > 0);
        if (!sameCardinalRing) {
          const gateBoss = GRAND_CAMPAIGN_NODES_BY_ID[gateId]?.boss;
          return {
            ok: false,
            reason: gateBoss
              ? `🔒 Estrada vigiada por ${gateBoss.name} — derrote-o para cruzar`
              : `🔒 Passagem bloqueada na estrada`,
          };
        }
      }
      return { ok: true };
    },
    [isCampaign, unlockedCampaignSubmaps, clearedSet, startingRealm, submapReachByRealm]
  );

  const handleTraversePortal = useCallback(
    (portal: RegionalBorderPortal) => {
      const curScope = mapScopeRef.current;
      if (curScope !== 'world') {
        const check = isPortalUnlockedInCampaign(curScope, portal);
        if (!check.ok) {
          playSfx('channel');
          showPortalNotification(check.reason ?? '🔒 Fronteira bloqueada');
          return;
        }
      }
      const targetDef = VAELORIA_REGIONAL_MAPS[portal.targetRealm];
      handleSwitchMapScope(portal.targetRealm, {
        x: portal.arrivalX,
        y: portal.arrivalY,
        banner: `Fronteira atravessada: ${targetDef.name}`,
        viaPortal: true,
      });
    },
    [isPortalUnlockedInCampaign, handleSwitchMapScope, showPortalNotification]
  );

  // Smooth RAF Loop for Multi-Waypoint Step-by-Step Road March
  useEffect(() => {
    if (marchWaypoints.length === 0) return;
    let rafId = 0;
    let lastTs = performance.now();

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - lastTs) / 1000);
      lastTs = now;

      const queue = marchWaypointsRef.current;
      if (queue.length === 0) return;

      const target = queue[0];
      const cur = pawnPosRef.current;
      const dx = target.x - cur.x;
      const dy = target.y - cur.y;
      const dist = Math.hypot(dx, dy);
      const speedPctPerSec = Math.max(42, dist * 3.1);
      const maxStep = speedPctPerSec * dt;

      if (dist <= maxStep || dist < 0.35) {
        pawnPosRef.current = { x: target.x, y: target.y };
        setPawnPos({ x: target.x, y: target.y });
        const arrivedCallback = target.onArrive;
        const remaining = queue.slice(1);
        marchWaypointsRef.current = remaining;
        setMarchWaypoints(remaining);
        if (remaining.length > 0) {
          const nextDx = remaining[0].x - target.x;
          if (Math.abs(nextDx) > 0.3) setFacingLeft(nextDx < 0);
        }
        arrivedCallback?.();
        if (remaining.length === 0) {
          if (isCampaign) {
            saveCampaignMapSession({
              mapScope: mapScopeRef.current,
              pawnPos: { x: target.x, y: target.y },
            });
          }
          return;
        }
      } else {
        if (Math.abs(dx) > 0.3) setFacingLeft(dx < 0);
        const nx = cur.x + (dx / dist) * maxStep;
        const ny = cur.y + (dy / dist) * maxStep;
        pawnPosRef.current = { x: nx, y: ny };
        setPawnPos({ x: nx, y: ny });
      }

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [marchWaypoints]);

  // Live Geographic Region & Docked Boss Detection
  const currentWorldTerritory = useMemo(
    () => resolveNearestTerritory(pawnPos.x, pawnPos.y),
    [pawnPos.x, pawnPos.y]
  );

  const activeRegionalDef = mapScope !== 'world' ? VAELORIA_REGIONAL_MAPS[mapScope] : null;
  const activeSubmapGraph =
    isCampaign && mapScope !== 'world' ? GRAND_CAMPAIGN_SUBMAP_GRAPHS[mapScope] : null;
  const activeSubmapReach =
    isCampaign && mapScope !== 'world' ? submapReachByRealm[mapScope] : null;

  const currentWorldNearestHubRealm: VaeloriaRealmId = useMemo(() => {
    if (mapScope !== 'world') return mapScope;
    if (!isCampaign) return resolveNearestRealmFromWorldCoords(pawnPos.x, pawnPos.y);
    let best: VaeloriaRealmId = startingRealm;
    let bestD = Infinity;
    for (const rid of VAELORIA_REALM_ORDER) {
      const hub = GRAND_CAMPAIGN_SUBMAP_GRAPHS[rid].worldHub;
      const d = Math.hypot(pawnPos.x - hub.x, pawnPos.y - hub.y);
      if (d < bestD) {
        bestD = d;
        best = rid;
      }
    }
    return best;
  }, [mapScope, isCampaign, pawnPos.x, pawnPos.y, startingRealm]);

  const dockedBossEntry = useMemo(() => {
    let best: PositionedBossEntry | null = null;
    let bestDist = 3.2;
    for (const entry of positionedBosses) {
      if (
        isCampaign &&
        activeSubmapReach &&
        !activeSubmapReach.accessibleNodeIds.has(entry.boss.id)
      ) {
        continue;
      }
      const d = Math.hypot(pawnPos.x - entry.x, pawnPos.y - entry.y);
      if (d < bestDist) {
        bestDist = d;
        best = entry;
      }
    }
    return best;
  }, [positionedBosses, pawnPos.x, pawnPos.y, isCampaign, activeSubmapReach]);

  const sovereignCard = sovereignAvatarCardId ? CARDS_BY_ID[sovereignAvatarCardId] : undefined;

  const handleSelectGazetteerEntry = useCallback(
    (entry: VaeloriaGazetteerEntry) => {
      if (
        isCampaign &&
        entry.scope !== 'world' &&
        !unlockedCampaignSubmaps.has(entry.scope)
      ) {
        explainLockedSubmap(entry.scope);
        return;
      }
      setGazetteerHighlight({
        scope: entry.scope,
        x: entry.x,
        y: entry.y,
        label: entry.name,
      });
      if (entry.inspectionNote) {
        setInspectedNote(entry.inspectionNote);
      }
      if (entry.scope !== mapScopeRef.current) {
        handleSwitchMapScope(entry.scope, {
          x: isCampaign
            ? GRAND_CAMPAIGN_SUBMAP_GRAPHS[entry.scope as VaeloriaRealmId]?.entryPos.x ?? entry.x
            : entry.x,
          y: isCampaign
            ? GRAND_CAMPAIGN_SUBMAP_GRAPHS[entry.scope as VaeloriaRealmId]?.entryPos.y ?? entry.y
            : entry.y,
          banner: entry.name,
        });
      } else {
        showPortalNotification(entry.name);
      }
    },
    [
      isCampaign,
      unlockedCampaignSubmaps,
      explainLockedSubmap,
      handleSwitchMapScope,
      showPortalNotification,
    ]
  );

  // Click on Continental Submap Hub (Campaign 'world')
  const handleClickWorldSubmapHub = (e: React.MouseEvent, rid: VaeloriaRealmId) => {
    e.stopPropagation();
    if (!unlockedCampaignSubmaps.has(rid)) {
      explainLockedSubmap(rid);
      return;
    }
    const targetHub = GRAND_CAMPAIGN_SUBMAP_GRAPHS[rid].worldHub;
    const dist = Math.hypot(pawnPosRef.current.x - targetHub.x, pawnPosRef.current.y - targetHub.y);
    if (dist <= 2.4) {
      handleSwitchMapScope(rid);
      return;
    }
    const stepPath = findWorldSubmapStepPath(
      currentWorldNearestHubRealm,
      rid,
      unlockedCampaignSubmaps
    );
    const waypoints: MarchWaypoint[] = stepPath.map((step, idx) => ({
      x: step.x,
      y: step.y,
      onArrive: idx === stepPath.length - 1 ? () => handleSwitchMapScope(rid) : undefined,
    }));
    startWaypointMarch(waypoints);
  };

  // Click on Boss Encounter Pin (Submap in Campaign, or World/Submap in Expedition)
  const handleClickBossPin = (e: React.MouseEvent, entry: PositionedBossEntry) => {
    e.stopPropagation();

    if (isCampaign && mapScope !== 'world' && activeSubmapReach) {
      const isAccessible = activeSubmapReach.accessibleNodeIds.has(entry.boss.id);
      onSelectBoss(entry.boss);
      onOpenDossier?.();

      if (!isAccessible) {
        playSfx('channel');
        showPortalNotification(
          '🔒 Passagem bloqueada — derrote a guarnição anterior na estrada!'
        );
        return;
      }

      const distFromPawn = Math.hypot(pawnPosRef.current.x - entry.x, pawnPosRef.current.y - entry.y);
      if (distFromPawn <= 2.4 && selectedBossId === entry.boss.id && !clearedSet.has(entry.boss.id)) {
        onChallengeBoss(entry.boss);
        return;
      }

      const steps = findSubmapStepPath(
        mapScope,
        pawnPosRef.current,
        entry.boss.id,
        clearedSet
      );
      startWaypointMarch(steps.map((s) => ({ x: s.x, y: s.y })));
      return;
    }

    // Expedition mode
    const distFromPawn = Math.hypot(pawnPosRef.current.x - entry.x, pawnPosRef.current.y - entry.y);
    onSelectBoss(entry.boss);
    onOpenDossier?.();
    if (distFromPawn <= 2.8 && selectedBossId === entry.boss.id) {
      onChallengeBoss(entry.boss);
    } else {
      startWaypointMarch([{ x: entry.x, y: entry.y }]);
    }
  };

  // Click empty canvas in Expedition mode (disabled in Campaign mode to enforce road graph!)
  const handleClickViewport = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isCampaign) return;
    const targetEl = e.target as HTMLElement | null;
    if (
      targetEl?.closest(
        '.vwm-boss-node, .vwm-world-submap-hub, .vwm-landmark-node, .vwm-pawn-challenge-pill, .vwm-portal-gate, .vwm-realm-dive-chip, .vwm-minimap-radar, .vwm-minimap-toggle-pill, .carto-toponym-pin, .carto-unified-settlement-pin, .carto-capital-district-pin, .carto-historical-battle-pin, .cartographer-notebook-card, .atlas-hud-cluster'
      )
    ) {
      return;
    }
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;
    startWaypointMarch([{ x: clickX, y: clickY }]);
  };

  // Global Sovereign coordinates on the optional Continental Minimap Radar
  const globalSovereignCoords = useMemo(() => {
    if (mapScope === 'world') {
      return { x: pawnPos.x, y: pawnPos.y };
    }
    if (isCampaign) {
      return GRAND_CAMPAIGN_SUBMAP_GRAPHS[mapScope].worldHub;
    }
    const b = VAELORIA_REGIONAL_MAPS[mapScope].worldBounds;
    return {
      x: b.x + (pawnPos.x / 100) * b.w,
      y: b.y + (pawnPos.y / 100) * b.h,
    };
  }, [mapScope, isCampaign, pawnPos.x, pawnPos.y]);

  const isCurrentSubmapConquered = Boolean(activeSubmapReach?.isSubmapConquered);

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
        lockedRealms={isCampaign ? lockedCampaignSubmaps : undefined}
        conqueredRealms={isCampaign ? conqueredCampaignSubmaps : undefined}
        sovereignAccentHex={isCampaign ? bannerPalette.hex : undefined}
        onBlockedScopeSelect={isCampaign ? explainLockedSubmap : undefined}
        variant="overworld"
      />

      {/* 2. Ultra-Slim Cartographic Telemetry & Controls Bar */}
      <div className="vwm-hud-top">
        <div
          className="vwm-territory-pill"
          style={{
            borderColor: isCurrentSubmapConquered
              ? bannerPalette.borderRgba
              : 'rgba(212, 175, 55, 0.34)',
          }}
        >
          <span
            className="vwm-territory-dot"
            style={{
              background: isCurrentSubmapConquered
                ? bannerPalette.hex
                : activeRegionalDef
                  ? activeRegionalDef.accentColor
                  : currentWorldTerritory.color,
            }}
          />
          <div className="vwm-territory-texts">
            <strong className="font-cinzel vwm-territory-title">
              {activeRegionalDef
                ? activeRegionalDef.name
                : 'Continente de Vaeloria (100% Enquadrado)'}
              <span className="vwm-territory-landmark">
                {' '}
                —{' '}
                {isCampaign && mapScope === 'world'
                  ? `Sub-mapas Unificados: ${conqueredCampaignSubmaps.size}/20 • Escolha um Reino desbloqueado`
                  : isCampaign && activeSubmapReach
                    ? isCurrentSubmapConquered
                      ? `✓ Território Convertido ao Estandarte ${bannerPalette.name} (${activeSubmapReach.clearedCount}/${activeSubmapReach.totalCount})`
                      : `Estrada Tática: ${activeSubmapReach.clearedCount}/${activeSubmapReach.totalCount} confrontos vencidos`
                    : dockedBossEntry
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
              onClick={() => handleSwitchMapScope(currentWorldNearestHubRealm)}
              title={`Entrar no Sub-mapa de ${VAELORIA_REGIONAL_MAPS[currentWorldNearestHubRealm].name}`}
            >
              Entrar em {VAELORIA_REGIONAL_MAPS[currentWorldNearestHubRealm].shortName}
            </button>
          ) : (
            <button
              type="button"
              className="vwm-tool-btn is-highlight-action"
              onClick={() => handleSwitchMapScope('world')}
              title="Retornar ao Mapa Continental de Vaeloria (Recuo Livre)"
            >
              Mapa Continental
            </button>
          )}

          <button
            type="button"
            className={`vwm-tool-btn ${showGeographyLabels ? 'is-active' : ''}`}
            onClick={() => setShowGeographyLabels((v) => !v)}
            title="Mostrar ou ocultar pinos de Santuários e Marcos Exploráveis"
          >
            Marcos
          </button>

          {!isCampaign && (
            <button
              type="button"
              className={`vwm-tool-btn ${fogEnabled ? 'is-active' : ''}`}
              onClick={() => {
                const next = !fogEnabled;
                setFogEnabled(next);
                setFogOfWarEnabled(next);
              }}
              title="Alternar Névoa de Exploração"
            >
              Névoa
            </button>
          )}

          <AtlasLayerAndSearchHud
            layers={atlasLayers}
            onChangeLayers={setAtlasLayers}
            eraFilter={eraFilter}
            onChangeEraFilter={setEraFilter}
            onSelectGazetteerEntry={handleSelectGazetteerEntry}
          />

          <span className="vwm-fixed-zoom-pill" title="Zoom fixado em 100% para nitidez máxima">
            100%
          </span>

          {onToggleDossier && (
            <button
              type="button"
              className={`vwm-tool-btn ${!isDossierCollapsed ? 'is-active' : ''}`}
              onClick={onToggleDossier}
              title={
                isDossierCollapsed
                  ? 'Abrir gaveta flutuante do Dossiê do Soberano adversário'
                  : 'Fechar gaveta do Dossiê'
              }
            >
              {isDossierCollapsed ? 'Dossiê' : '✕ Dossiê'}
            </button>
          )}

          <button
            type="button"
            className={`vwm-tool-btn ${isTheaterFullscreen ? 'is-active' : ''}`}
            onClick={() => handleSetTheaterFullscreen((v) => !v)}
            title={
              isTheaterFullscreen
                ? 'Sair da Tela Cheia (Esc)'
                : 'Abrir Mapa em Tela Cheia (100% na tela)'
            }
          >
            {isTheaterFullscreen ? '✕ Sair' : '⛶ Tela Cheia'}
          </button>
        </div>
      </div>

      {/* 3. Strict 100% Fit-On-Screen 16:9 Stage Box (Zero Scroll, Zero Clipping, Fixed 1.0x Zoom) */}
      <div className="vwm-stage-fit-box">
        <div
          ref={viewportRef}
          className="vwm-viewport"
          onClick={handleClickViewport}
        >
          {portalBanner && <div className="vwm-portal-toast">{portalBanner}</div>}

          <div ref={canvasRef} className="vwm-canvas">
            {/* Illustrated High-Resolution Map (World Continent OR Full-Bleed Submap) */}
            <img
              key={activeRegionalDef ? activeRegionalDef.imagePath : VAELORIA_WORLD_MAP_IMAGE}
              src={activeRegionalDef ? activeRegionalDef.imagePath : VAELORIA_WORLD_MAP_IMAGE}
              alt={activeRegionalDef ? activeRegionalDef.name : 'Mapa Continental de Vaeloria'}
              className="vwm-terrain-img"
              draggable={false}
            />

            {/* Sovereign Territory Chromatic Transformation Overlay when 100% of Submap is Conquered */}
            {isCampaign && mapScope !== 'world' && isCurrentSubmapConquered && (
              <div
                className="vwm-submap-conquered-tint"
                style={
                  {
                    '--sov-hex': bannerPalette.hex,
                    '--sov-tint': bannerPalette.tintFilterRgba,
                    '--sov-border': bannerPalette.borderRgba,
                  } as React.CSSProperties
                }
              >
                <span className="vwm-submap-conquered-seal">
                  ✓ Território Unificado • {bannerPalette.name}
                </span>
              </div>
            )}

            {/* Vector SVG Layer: Sovereign Polygons, Planar Road Graph & Active March Path */}
            <svg
              className="vwm-svg-layer"
              viewBox="0 0 1600 900"
              preserveAspectRatio="none"
            >
              <defs>
                <filter id="vwmTextShadow" x="-25%" y="-25%" width="150%" height="150%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3.5" floodColor="#020617" floodOpacity="0.96" />
                </filter>
                <filter id="vwmFogSoftBlur" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="44" />
                </filter>
                {fogEnabled && !isCampaign && (
                  <mask id="vwmExplorationFogMask">
                    <rect x="0" y="0" width="1600" height="900" fill="white" />
                    <g filter="url(#vwmFogSoftBlur)">
                      <circle cx={pawnPos.x * 16} cy={pawnPos.y * 9} r="240" fill="black" />
                      {positionedBosses
                        .filter((b) => clearedSet.has(b.boss.id))
                        .map((b) => (
                          <circle
                            key={`fog-boss-${b.boss.id}`}
                            cx={b.x * 16}
                            cy={b.y * 9}
                            r="210"
                            fill="black"
                          />
                        ))}
                      {mapScope === 'world' &&
                        Array.from(visitedRealms).map((rid) => {
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
                        })}
                    </g>
                  </mask>
                )}
              </defs>

              {fogEnabled && !isCampaign && (
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

              {/* Optional Cartographic Layers (all OFF by default for zero visual pollution) */}
              <CartographicSvgLayer
                scope={mapScope}
                zoom={zoom}
                viewBoxWidth={1600}
                viewBoxHeight={900}
                layers={atlasLayers}
                idPrefix="vwm_svg"
                onInspectNote={setInspectedNote}
              />

              {/* CAMPAIGN CONTINENTAL MAP: 20 Territory Polygons + Continental Road Graph */}
              {isCampaign && mapScope === 'world' && (
                <g className="vwm-world-campaign-layer">
                  {/* 1. Territory Polygons (Convert to Player's Sovereign Color when 100% cleared!) */}
                  {VAELORIA_REALM_ORDER.map((rid) => {
                    const g = GRAND_CAMPAIGN_SUBMAP_GRAPHS[rid];
                    const isConq = conqueredCampaignSubmaps.has(rid);
                    const isUnl = unlockedCampaignSubmaps.has(rid);
                    const isHov = hoveredWorldHubId === rid;
                    const pts = g.worldPolygon
                      .map(([px, py]) => `${(px * 16).toFixed(1)},${(py * 9).toFixed(1)}`)
                      .join(' ');

                    if (isConq) {
                      return (
                        <g key={`wpoly-${rid}`}>
                          <polygon
                            points={pts}
                            fill={bannerPalette.hex}
                            fillOpacity={isHov ? 0.46 : 0.36}
                            style={{ mixBlendMode: 'color' }}
                          />
                          <polygon
                            points={pts}
                            fill={bannerPalette.fillRgba}
                            stroke={bannerPalette.borderRgba}
                            strokeWidth={isHov ? 3.2 : 2.2}
                            strokeLinejoin="round"
                          />
                        </g>
                      );
                    }

                    if (isUnl) {
                      return (
                        <polygon
                          key={`wpoly-${rid}`}
                          points={pts}
                          fill={isHov ? 'rgba(212, 175, 55, 0.11)' : 'rgba(212, 175, 55, 0.03)'}
                          stroke={isHov ? 'rgba(250, 204, 21, 0.65)' : 'rgba(212, 175, 55, 0.24)'}
                          strokeWidth={isHov ? 2.2 : 1.2}
                          strokeLinejoin="round"
                        />
                      );
                    }

                    return (
                      <polygon
                        key={`wpoly-${rid}`}
                        points={pts}
                        fill="rgba(4, 8, 18, 0.32)"
                        stroke="rgba(100, 116, 139, 0.22)"
                        strokeWidth="1.1"
                        strokeDasharray="6 6"
                        strokeLinejoin="round"
                      />
                    );
                  })}

                  {/* 2. Continental Roads between the 20 Submap Hubs */}
                  {WORLD_SUBMAP_EDGES.map((edge, idx) => {
                    const g1 = GRAND_CAMPAIGN_SUBMAP_GRAPHS[edge.from];
                    const g2 = GRAND_CAMPAIGN_SUBMAP_GRAPHS[edge.to];
                    const x1 = g1.worldHub.x * 16;
                    const y1 = g1.worldHub.y * 9;
                    const x2 = g2.worldHub.x * 16;
                    const y2 = g2.worldHub.y * 9;
                    const bothConq =
                      conqueredCampaignSubmaps.has(edge.from) &&
                      conqueredCampaignSubmaps.has(edge.to);
                    const bothUnl =
                      unlockedCampaignSubmaps.has(edge.from) &&
                      unlockedCampaignSubmaps.has(edge.to);

                    return (
                      <line
                        key={`wroad-${idx}-${edge.from}-${edge.to}`}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={
                          bothConq
                            ? bannerPalette.hex
                            : bothUnl
                              ? 'rgba(212, 175, 55, 0.72)'
                              : 'rgba(100, 116, 139, 0.26)'
                        }
                        strokeWidth={bothConq ? 3.2 : bothUnl ? 2.4 : 1.5}
                        strokeDasharray={bothConq ? undefined : bothUnl ? '8 5' : '4 7'}
                        strokeLinecap="round"
                      />
                    );
                  })}
                </g>
              )}

              {/* CAMPAIGN SUBMAP: Planar Geographic Road Graph + Entry Camp */}
              {isCampaign && activeSubmapGraph && activeSubmapReach && (
                <g className="vwm-submap-graph-roads">
                  {/* Entry Camp to Entry Nodes */}
                  {activeSubmapGraph.entryNodeIds.map((eid) => {
                    const target = GRAND_CAMPAIGN_NODES_BY_ID[eid];
                    if (!target) return null;
                    const isCleared = activeSubmapReach.clearedNodeIds.has(eid);
                    return (
                      <line
                        key={`entry-road-${eid}`}
                        x1={activeSubmapGraph.entryPos.x * 16}
                        y1={activeSubmapGraph.entryPos.y * 9}
                        x2={target.rx * 16}
                        y2={target.ry * 9}
                        stroke={
                          isCleared ? bannerPalette.hex : 'rgba(212, 175, 55, 0.85)'
                        }
                        strokeWidth={isCleared ? 3.4 : 2.8}
                        strokeDasharray={isCleared ? undefined : '9 6'}
                        strokeLinecap="round"
                      />
                    );
                  })}

                  {/* Planar Edges between Submap Encounter Nodes */}
                  {activeSubmapGraph.edges.map(([u, v]) => {
                    const nu = GRAND_CAMPAIGN_NODES_BY_ID[u];
                    const nv = GRAND_CAMPAIGN_NODES_BY_ID[v];
                    if (!nu || !nv) return null;
                    const uCleared = activeSubmapReach.clearedNodeIds.has(u);
                    const vCleared = activeSubmapReach.clearedNodeIds.has(v);
                    const bothCleared = uCleared && vCleared;
                    const isFrontlineEdge =
                      (uCleared && activeSubmapReach.frontlineNodeIds.has(v)) ||
                      (vCleared && activeSubmapReach.frontlineNodeIds.has(u));

                    return (
                      <line
                        key={`edge-${u}-${v}`}
                        x1={nu.rx * 16}
                        y1={nu.ry * 9}
                        x2={nv.rx * 16}
                        y2={nv.ry * 9}
                        stroke={
                          bothCleared
                            ? bannerPalette.hex
                            : isFrontlineEdge
                              ? 'rgba(234, 179, 8, 0.88)'
                              : 'rgba(100, 116, 139, 0.34)'
                        }
                        strokeWidth={bothCleared ? 3.5 : isFrontlineEdge ? 2.8 : 1.8}
                        strokeDasharray={
                          bothCleared ? undefined : isFrontlineEdge ? '9 6' : '4 7'
                        }
                        strokeLinecap="round"
                      />
                    );
                  })}

                  {/* Discreet Entry Camp Marker */}
                  <g
                    transform={`translate(${activeSubmapGraph.entryPos.x * 16}, ${
                      activeSubmapGraph.entryPos.y * 9
                    })`}
                  >
                    <circle
                      r="9"
                      fill="#0b101c"
                      stroke={bannerPalette.hex}
                      strokeWidth="2"
                    />
                    <circle r="3.5" fill={bannerPalette.hex} />
                  </g>
                </g>
              )}

              {/* EXPEDITION SEQUENTIAL ROADS */}
              {!isCampaign &&
                positionedBosses.map((entry, idx) => {
                  if (idx === 0) return null;
                  const prev = positionedBosses[idx - 1];
                  const bothCleared =
                    clearedSet.has(prev.boss.id) && clearedSet.has(entry.boss.id);
                  return (
                    <line
                      key={`exp-road-${prev.boss.id}-${entry.boss.id}`}
                      x1={prev.x * 16}
                      y1={prev.y * 9}
                      x2={entry.x * 16}
                      y2={entry.y * 9}
                      className={`vwm-road-path ${
                        bothCleared ? 'is-cleared-road' : 'is-frontier-road'
                      }`}
                    />
                  );
                })}

              {/* Active Multi-Segment Road March Polyline */}
              {marchWaypoints.length > 0 && (
                <g className="vwm-march-route-group">
                  <polyline
                    fill="none"
                    points={[
                      `${pawnPos.x * 16},${pawnPos.y * 9}`,
                      ...marchWaypoints.map((w) => `${w.x * 16},${w.y * 9}`),
                    ].join(' ')}
                    className="vwm-march-line"
                  />
                  <circle
                    cx={marchWaypoints[marchWaypoints.length - 1].x * 16}
                    cy={marchWaypoints[marchWaypoints.length - 1].y * 9}
                    r="11"
                    className="vwm-march-beacon"
                  />
                </g>
              )}

              {/* Discreet Compass Rose in Bottom-Right Ocean Corner */}
              <g transform="translate(1542, 842)" opacity="0.72" filter="url(#vwmTextShadow)">
                <circle
                  cx="0"
                  cy="0"
                  r="28"
                  fill="rgba(7, 11, 20, 0.82)"
                  stroke="rgba(212, 175, 55, 0.45)"
                  strokeWidth="1.4"
                />
                <polygon points="0,-22 4.5,-5 0,-8.5 -4.5,-5" fill="#d4af37" />
                <polygon points="0,22 3.5,5 0,8.5 -3.5,5" fill="#94a3b8" />
                <polygon points="-22,0 -5,-3.5 -8.5,0 -5,3.5" fill="#94a3b8" />
                <polygon points="22,0 5,-3.5 8.5,0 5,3.5" fill="#94a3b8" />
                <circle cx="0" cy="0" r="3" fill="#e5c97b" />
              </g>
            </svg>

            {/* Optional Multi-LOD Toponyms, Capital Districts & Historical Battlefields */}
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

            {/* CAMPAIGN CONTINENTAL MAP: 20 Clean Submap Hub Pins (Hover-Only Labels!) */}
            {isCampaign &&
              mapScope === 'world' &&
              VAELORIA_REALM_ORDER.map((rid) => {
                const g = GRAND_CAMPAIGN_SUBMAP_GRAPHS[rid];
                const rdef = VAELORIA_REGIONAL_MAPS[rid];
                const reach = submapReachByRealm[rid];
                const isConq = conqueredCampaignSubmaps.has(rid);
                const isUnl = unlockedCampaignSubmaps.has(rid);
                const isStart = rid === startingRealm;
                const edgeY = g.worldHub.y < 20 ? 'is-near-top' : '';
                const edgeX =
                  g.worldHub.x < 16
                    ? 'is-near-left'
                    : g.worldHub.x > 84
                      ? 'is-near-right'
                      : '';

                return (
                  <button
                    key={`whub-${rid}`}
                    type="button"
                    className={`vwm-world-submap-hub ${
                      isConq
                        ? 'is-conquered'
                        : isUnl
                          ? 'is-unlocked'
                          : 'is-locked'
                    } ${isStart ? 'is-home-realm' : ''} ${edgeY} ${edgeX}`}
                    style={
                      {
                        left: `${g.worldHub.x}%`,
                        top: `${g.worldHub.y}%`,
                        '--hub-accent': isConq ? bannerPalette.hex : rdef.accentColor,
                      } as React.CSSProperties
                    }
                    onClick={(e) => handleClickWorldSubmapHub(e, rid)}
                    onMouseEnter={() => setHoveredWorldHubId(rid)}
                    onMouseLeave={() =>
                      setHoveredWorldHubId((prev) => (prev === rid ? null : prev))
                    }
                  >
                    <span
                      className="vwm-hub-core-dot"
                      style={{
                        background: isConq
                          ? bannerPalette.hex
                          : isUnl
                            ? rdef.accentColor
                            : '#475569',
                      }}
                    />
                    <span className="vwm-hub-glyph">
                      {isConq ? '✓' : !isUnl ? '🔒' : `${reach.clearedCount}/${reach.totalCount}`}
                    </span>
                    <span className="vwm-boss-tooltip">
                      <strong>{rdef.name}</strong>
                      <em>
                        {isConq
                          ? `✓ 100% Convertido (${reach.clearedCount}/${reach.totalCount}) • Entrar`
                          : isUnl
                            ? `${reach.clearedCount}/${reach.totalCount} confrontos • Clique para marchar`
                            : `🔒 Bloqueado (${reach.totalCount} confrontos)`}
                      </em>
                    </span>
                  </button>
                );
              })}

            {/* EXPEDITION WORLD MAP: Clean Dive Chips when Marcos is toggled */}
            {!isCampaign &&
              mapScope === 'world' &&
              showGeographyLabels &&
              [
                ...VAELORIA_CARDINAL_REALMS,
                ...VAELORIA_DEEP_FRONTIERS,
                ...VAELORIA_TRANSIT_CORRIDORS,
              ].map((rid) => {
                const rdef = VAELORIA_REGIONAL_MAPS[rid];
                return (
                  <button
                    key={`exp-dive-${rid}`}
                    type="button"
                    className="vwm-realm-dive-chip"
                    style={{
                      left: `${rdef.worldCenter.x}%`,
                      top: `${rdef.worldCenter.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSwitchMapScope(rid);
                    }}
                  >
                    <span
                      className="vwm-dive-dot"
                      style={{ background: rdef.accentColor }}
                      aria-hidden="true"
                    />
                    <strong className="vwm-hover-pill-text">{rdef.shortName}</strong>
                  </button>
                );
              })}

            {/* Inside Submap: Optional Interactive Living Landmarks (Shown ONLY when "Marcos" is toggled ON; Hover-only text) */}
            {activeRegionalDef &&
              showGeographyLabels &&
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
                        '--lm-accent': '#d4af37',
                      } as React.CSSProperties
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      playSfx('channel');
                      setActiveLandmarkModal({
                        realm: activeRegionalDef.id,
                        landmark: lm,
                      });
                    }}
                  >
                    <span className="vwm-lm-icon">{LOCAL_LANDMARK_GLYPH[lm.kind] ?? '✦'}</span>
                    <span className="vwm-lm-label">{lm.name}</span>
                  </button>
                );
              })}

            {/* Inside Submap: Border Gate Portals (Hover-Only Labels + Strict Gatekeeper Lock!) */}
            {activeRegionalDef &&
              activeRegionalDef.portals.map((portal) => {
                const targetDef = VAELORIA_REGIONAL_MAPS[portal.targetRealm];
                const lockState = isPortalUnlockedInCampaign(activeRegionalDef.id, portal);
                const isPortalConq = conqueredCampaignSubmaps.has(portal.targetRealm);
                return (
                  <button
                    key={portal.id}
                    type="button"
                    className={`vwm-portal-gate ${!lockState.ok ? 'is-locked-portal' : ''} ${
                      portal.x < 18 ? 'is-edge-left' : portal.x > 82 ? 'is-edge-right' : ''
                    } ${portal.y < 16 ? 'is-edge-top' : portal.y > 84 ? 'is-edge-bottom' : ''}`}
                    style={
                      {
                        left: `${portal.x}%`,
                        top: `${portal.y}%`,
                        '--portal-color': isPortalConq
                          ? bannerPalette.hex
                          : targetDef.accentColor,
                      } as React.CSSProperties
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTraversePortal(portal);
                    }}
                  >
                    <span
                      className="vwm-portal-dot"
                      style={{
                        background: !lockState.ok
                          ? '#475569'
                          : isPortalConq
                            ? bannerPalette.hex
                            : targetDef.accentColor,
                      }}
                      aria-hidden="true"
                    />
                    <span className="vwm-portal-icon">
                      {!lockState.ok ? '🔒' : '⇄'}
                    </span>
                    <span className="vwm-portal-texts">
                      <strong>{portal.label}</strong>
                      <small>
                        {!lockState.ok
                          ? 'Passagem bloqueada por guardião'
                          : portal.sublabel}
                      </small>
                    </span>
                  </button>
                );
              })}

            {/* Weekly Fracture Rift Anomaly Pin on Continental Map (Orb Only; Text Hidden Until Hover!) */}
            {mapScope === 'world' && isCampaign && onOpenWeeklyRift && (
              <button
                type="button"
                className="vwm-rift-anomaly-pin"
                style={
                  {
                    left: `${weeklyRiftWorldCoords.x}%`,
                    top: `${weeklyRiftWorldCoords.y}%`,
                    '--rift-accent': '#d4af37',
                  } as React.CSSProperties
                }
                onClick={(e) => {
                  e.stopPropagation();
                  playSfx('portal_cross');
                  onOpenWeeklyRift();
                }}
              >
                <span className="vwm-rift-anomaly-ring" />
                <span className="vwm-rift-anomaly-core">✦</span>
                <span className="vwm-rift-anomaly-tag">
                  <strong>Fenda Semanal: {weeklyRift.name}</strong>
                  <small>+{WEEKLY_RIFT_SHARDS_BONUS} Estilhaços • Clique para entrar</small>
                </span>
              </button>
            )}

            {/* Boss Encounter Pins (Submap Road Nodes in Campaign; Stages in Expedition) */}
            {positionedBosses.map((entry) => {
              const { boss, worldNode, x, y } = entry;
              const isSelected = boss.id === selectedBossId;
              const isCleared = clearedSet.has(boss.id);
              const isFrontline = Boolean(
                isCampaign && activeSubmapReach?.frontlineNodeIds.has(boss.id)
              );
              const isLocked = Boolean(
                isCampaign && activeSubmapReach?.lockedNodeIds.has(boss.id)
              );
              const isHovered = hoveredBossId === boss.id;
              const primaryDom = resolvePrimaryBossDomain(boss.domains);
              const domColor = isCleared && isCampaign
                ? bannerPalette.hex
                : DOMAIN_META[primaryDom].color;
              const bossCard = CARDS_BY_ID[boss.avatarCardId];
              const isThrone = Boolean(
                entry.isThroneNode || (!isCampaign && boss.stage === 9)
              );
              const badgeLabel = isCampaign
                ? isCleared
                  ? '✓'
                  : isLocked
                    ? '🔒'
                    : isThrone
                      ? `♛T${entry.tier ?? 5}`
                      : `T${entry.tier ?? 1}`
                : isCleared
                  ? `✓${boss.stage}`
                  : `${boss.stage}`;

              return (
                <button
                  key={boss.id}
                  type="button"
                  className={`vwm-boss-node ${isSelected ? 'is-selected' : ''} ${
                    isCleared ? 'is-cleared' : ''
                  } ${isFrontline ? 'is-next-target' : ''} ${
                    isLocked ? 'is-locked-node' : ''
                  } ${isThrone ? 'is-axial-apex' : ''} ${
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
                  onMouseLeave={() =>
                    setHoveredBossId((prev) => (prev === boss.id ? null : prev))
                  }
                >
                  <span className="vwm-boss-node-ring" />
                  <span className="vwm-boss-node-portrait">
                    {bossCard?.imagePath ? (
                      <img src={bossCard.imagePath} alt={boss.name} draggable={false} />
                    ) : (
                      <span>⚔</span>
                    )}
                  </span>
                  <span className="vwm-boss-stage-badge">{badgeLabel}</span>

                  {isHovered && (
                    <span className="vwm-boss-tooltip">
                      <strong>{boss.name}</strong>
                      <em>
                        {worldNode.landmarkName} • {boss.startingHp} PV
                        {entry.tier ? ` • Tier ${entry.tier}` : ''}
                      </em>
                      <small className="vwm-boss-tooltip-status">
                        {isCleared
                          ? '✓ Derrotado (Recuo livre / Reenfrentar)'
                          : isLocked
                            ? '🔒 Estrada bloqueada pela guarnição anterior'
                            : '⚔ Acessível — Clique para marchar / desafiar'}
                      </small>
                    </span>
                  )}
                </button>
              );
            })}

            {/* Traversable Sovereign Avatar Token (Challenge Pill Hidden Until Hover!) */}
            <div
              className={`vwm-sovereign-pawn ${
                marchWaypoints.length > 0 ? 'is-marching' : ''
              } ${facingLeft ? 'is-facing-left' : ''} ${
                pawnPos.y < 23 ? 'is-near-top' : ''
              } ${pawnPos.x < 16 ? 'is-near-left' : pawnPos.x > 84 ? 'is-near-right' : ''}`}
              style={
                {
                  left: `${pawnPos.x}%`,
                  top: `${pawnPos.y}%`,
                  '--sov-pawn-accent': isCampaign ? bannerPalette.hex : '#d4af37',
                } as React.CSSProperties
              }
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
                  ⚔ Desafiar {dockedBossEntry.boss.name}
                </button>
              )}

              <div className="vwm-pawn-aura" />
              <div className="vwm-pawn-token" title={`${sovereignLabel} — Em marcha`}>
                {sovereignCard?.imagePath ? (
                  <img src={sovereignCard.imagePath} alt={sovereignLabel} draggable={false} />
                ) : (
                  <span className="vwm-pawn-crown">♛</span>
                )}
              </div>
              <div className="vwm-pawn-pedestal" />
            </div>
          </div>

          {/* Collapsible Continental GPS Minimap (Collapsed by Default for Maximum Cleanliness) */}
          {showMinimap ? (
            <div
              className="vwm-minimap-radar"
              onClick={(e) => {
                e.stopPropagation();
                if (mapScope !== 'world') {
                  handleSwitchMapScope('world');
                }
              }}
              title="Minimapa Continental — Clique para retornar ao Mapa Continental"
            >
              <img src={VAELORIA_WORLD_MAP_IMAGE} alt="Minimapa" draggable={false} />
              <span
                className="vwm-minimap-pawn-dot"
                style={{
                  left: `${globalSovereignCoords.x}%`,
                  top: `${globalSovereignCoords.y}%`,
                  background: isCampaign ? bannerPalette.hex : '#d4af37',
                }}
              />
              <span className="vwm-minimap-caption">
                {activeRegionalDef ? activeRegionalDef.shortName : 'Vaeloria'}
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
              GPS
            </button>
          )}

          {/* "Caderno do Cartógrafo Real" Inspector Drawer */}
          <CartographerInspectorCard
            note={inspectedNote}
            onClose={() => setInspectedNote(null)}
            onNavigateScope={(s) => handleSwitchMapScope(s)}
          />
        </div>
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
            if (isCampaign) {
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
              `${activeLandmarkModal.landmark.name}: ${preview.rewardBadge}`
            );
            setActiveLandmarkModal(null);
          }}
          onClose={() => setActiveLandmarkModal(null)}
        />
      )}
    </div>
  );
};
