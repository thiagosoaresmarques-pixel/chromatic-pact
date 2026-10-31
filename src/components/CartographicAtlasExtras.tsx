import React, { useMemo, useState } from 'react';
import { CardDefinition, Domain } from '../types/game';
import { CardInspectModal, DOMAIN_META } from './CardView';
import {
  CARDINAL_TO_CAPITAL_MAP,
  PROVINCE_REGIONAL_COORDS,
  SCOPE_PROVINCE_PROJECTIONS,
  VAELORIA_CARDINAL_REALMS,
  VAELORIA_DEEP_FRONTIERS,
  VAELORIA_IMPERIAL_CAPITALS,
  VAELORIA_REGIONAL_MAPS,
  VAELORIA_TRANSIT_CORRIDORS,
  VaeloriaMapScope,
  VaeloriaRealmId,
  VaeloriaRealmTier,
  getMapScaleMetadata,
  getScopeBreadcrumbChain,
} from '../data/vaeloriaMultimapData';
import {
  AtlasLayerVisibility,
  CartographicPathFeature,
  VAELORIA_HISTORICAL_ERAS,
  VaeloriaHistoricalEraId,
  getCartographicPathsForScope,
  getCartographicToponymsForScope,
  getHistoricalBattlefieldsForScope,
  pointsToSmoothSvgPath,
} from '../data/vaeloriaCartographyDetails';
import {
  CartographicInspectionNote,
  VAELORIA_CAPITAL_DISTRICTS,
  VaeloriaGazetteerEntry,
  buildBattlefieldInspectionNote,
  buildDistrictInspectionNote,
  buildPathInspectionNote,
  buildSettlementInspectionNote,
  buildToponymInspectionNote,
  getVaeloriaGazetteerIndex,
  searchVaeloriaGazetteer,
} from '../data/vaeloriaCapitalDistricts';
import { CONQUEST_PROVINCES } from '../data/vaeloriaConquestData';
import { playSfx } from '../utils/soundEngine';

const PATH_COLOR_BY_KIND: Record<
  CartographicPathFeature['kind'],
  { stroke: string; glow: string; dash?: string; widthFactor: number }
> = {
  river: {
    stroke: 'rgba(125, 211, 252, 0.78)',
    glow: 'rgba(14, 165, 233, 0.35)',
    widthFactor: 1.0,
  },
  lava_stream: {
    stroke: 'rgba(251, 146, 60, 0.88)',
    glow: 'rgba(239, 68, 68, 0.5)',
    widthFactor: 1.08,
  },
  sea_lane: {
    stroke: 'rgba(186, 230, 253, 0.72)',
    glow: 'rgba(56, 189, 248, 0.3)',
    dash: '10 8',
    widthFactor: 0.9,
  },
  sky_jet: {
    stroke: 'rgba(253, 224, 71, 0.72)',
    glow: 'rgba(250, 204, 21, 0.3)',
    dash: '14 7 4 7',
    widthFactor: 0.92,
  },
  ley_conduit: {
    stroke: 'rgba(216, 180, 254, 0.82)',
    glow: 'rgba(168, 85, 247, 0.45)',
    dash: '6 5',
    widthFactor: 0.96,
  },
};

const DOMAIN_ACCENT_HEX: Record<Domain, string> = {
  red: '#f87171',
  blue: '#38bdf8',
  purple: '#c084fc',
  green: '#34d399',
  gold: '#fbbf24',
  neutral: '#e2e8f0',
};

const TRAFFIC_EMOJI: Record<
  NonNullable<CartographicPathFeature['trafficKind']>,
  string
> = {
  caravan: '🐪',
  galleon: '⛵',
  sky_patrol: '🐉',
  ley_pulse: '✨',
};

export interface GazetteerHighlightTarget {
  scope: VaeloriaMapScope;
  x: number;
  y: number;
  label: string;
}

// ============================================================================
// 1. MULTI-SCALE 4-TIER NAVIGATOR & BREADCRUMB BAR (21 MAPS)
// ============================================================================

export interface MultiScaleScopeNavigatorProps {
  mapScope: VaeloriaMapScope;
  onSelectScope: (scope: VaeloriaMapScope) => void;
  worldBadge?: string | number;
  countByRealm?: Partial<Record<VaeloriaRealmId, string | number>>;
  variant?: 'overworld' | 'conquest';
}

export const MultiScaleScopeNavigator: React.FC<MultiScaleScopeNavigatorProps> =
  React.memo(
    ({
      mapScope,
      onSelectScope,
      worldBadge,
      countByRealm,
      variant = 'overworld',
    }) => {
      const derivedTier: VaeloriaRealmTier =
        mapScope === 'world'
          ? 'cardinal_realm'
          : VAELORIA_REGIONAL_MAPS[mapScope].tier;

      const [manualTierTab, setManualTierTab] = useState<VaeloriaRealmTier | null>(
        null
      );

      const activeTierTab: VaeloriaRealmTier =
        mapScope !== 'world' ? derivedTier : manualTierTab ?? 'cardinal_realm';

      const tierRealms: VaeloriaRealmId[] = useMemo(() => {
        if (activeTierTab === 'imperial_capital') return VAELORIA_IMPERIAL_CAPITALS;
        if (activeTierTab === 'transit_corridor') return VAELORIA_TRANSIT_CORRIDORS;
        if (activeTierTab === 'deep_frontier') return VAELORIA_DEEP_FRONTIERS;
        return VAELORIA_CARDINAL_REALMS;
      }, [activeTierTab]);

      const breadcrumbs = useMemo(
        () => getScopeBreadcrumbChain(mapScope),
        [mapScope]
      );

      const linkedCapitalId =
        mapScope !== 'world' ? CARDINAL_TO_CAPITAL_MAP[mapScope] : undefined;
      const linkedCapitalDef = linkedCapitalId
        ? VAELORIA_REGIONAL_MAPS[linkedCapitalId]
        : null;

      const parentRealmId =
        mapScope !== 'world'
          ? VAELORIA_REGIONAL_MAPS[mapScope].parentRealmId
          : undefined;
      const parentRealmDef = parentRealmId
        ? VAELORIA_REGIONAL_MAPS[parentRealmId]
        : null;

      return (
        <div
          className={`multiscale-atlas-nav multiscale-atlas-nav-${variant}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="multiscale-tier-row">
            <button
              type="button"
              className={`multiscale-tier-tab ${mapScope === 'world' ? 'active' : ''}`}
              onClick={() => {
                setManualTierTab(null);
                onSelectScope('world');
              }}
              title="1ª Escala: Carta Geral do Continente de Vaeloria"
            >
              <span>🌍 Continente</span>
              {worldBadge !== undefined && (
                <span className="multiscale-chip-badge">{worldBadge}</span>
              )}
            </button>

            <button
              type="button"
              className={`multiscale-tier-tab ${
                mapScope !== 'world' && activeTierTab === 'cardinal_realm'
                  ? 'active'
                  : activeTierTab === 'cardinal_realm'
                    ? 'subactive'
                    : ''
              }`}
              onClick={() => setManualTierTab('cardinal_realm')}
              title="2ª Escala: Os 6 Reinos Cardeais"
            >
              👑 6 Reinos
            </button>

            <button
              type="button"
              className={`multiscale-tier-tab ${
                mapScope !== 'world' && activeTierTab === 'deep_frontier'
                  ? 'active'
                  : activeTierTab === 'deep_frontier'
                    ? 'subactive'
                    : ''
              }`}
              onClick={() => setManualTierTab('deep_frontier')}
              title="3ª Escala: As 6 Fronteiras Profundas (Ato VII)"
            >
              🌌 6 Fronteiras
            </button>

            <button
              type="button"
              className={`multiscale-tier-tab ${
                mapScope !== 'world' && activeTierTab === 'transit_corridor'
                  ? 'active'
                  : activeTierTab === 'transit_corridor'
                    ? 'subactive'
                    : ''
              }`}
              onClick={() => setManualTierTab('transit_corridor')}
              title="3ª Escala: Corredores Náutico & Celeste"
            >
              ⚓ 2 Corredores
            </button>

            <button
              type="button"
              className={`multiscale-tier-tab multiscale-tier-tab-capital ${
                mapScope !== 'world' && activeTierTab === 'imperial_capital'
                  ? 'active'
                  : activeTierTab === 'imperial_capital'
                    ? 'subactive'
                    : ''
              }`}
              onClick={() => setManualTierTab('imperial_capital')}
              title="4ª Escala: As 6 Cidadelas-Capitais Imperiais"
            >
              🏰 6 Capitais
            </button>

            {/* Breadcrumb + Quick Capital Dive / Exit */}
            <div className="multiscale-breadcrumb-strip">
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb.scope}>
                  {idx > 0 && <span className="multiscale-crumb-sep">›</span>}
                  <button
                    type="button"
                    className={`multiscale-crumb-btn ${
                      crumb.scope === mapScope ? 'current' : ''
                    }`}
                    onClick={() => onSelectScope(crumb.scope)}
                    title={crumb.tierLabel}
                  >
                    <span>{crumb.icon}</span>
                    <span>{crumb.label}</span>
                  </button>
                </React.Fragment>
              ))}

              {linkedCapitalDef && (
                <button
                  type="button"
                  className="multiscale-capital-dive-btn"
                  style={{ borderColor: linkedCapitalDef.accentColor }}
                  onClick={() => onSelectScope(linkedCapitalDef.id)}
                  title={`Mergulhar na 4ª Escala Urbana: ${linkedCapitalDef.name}`}
                >
                  🏰 Entrar em {linkedCapitalDef.shortName}
                </button>
              )}

              {parentRealmDef &&
                mapScope !== 'world' &&
                VAELORIA_REGIONAL_MAPS[mapScope].tier === 'imperial_capital' && (
                  <button
                    type="button"
                    className="multiscale-capital-dive-btn multiscale-capital-exit-btn"
                    onClick={() => onSelectScope(parentRealmDef.id)}
                    title={`Retornar à 2ª Escala Regional: ${parentRealmDef.name}`}
                  >
                    ↩ Reino: {parentRealmDef.shortName}
                  </button>
                )}
            </div>
          </div>

          <div className="multiscale-realms-row">
            {tierRealms.map((rid) => {
              const r = VAELORIA_REGIONAL_MAPS[rid];
              const badge = countByRealm?.[rid];
              const isSelected = mapScope === rid;
              return (
                <button
                  key={rid}
                  type="button"
                  className={`multiscale-realm-chip ${isSelected ? 'active' : ''}`}
                  style={
                    isSelected
                      ? {
                          borderColor: r.accentColor,
                          boxShadow: `0 0 12px ${r.accentColor}55`,
                        }
                      : undefined
                  }
                  onClick={() => {
                    setManualTierTab(r.tier);
                    onSelectScope(rid);
                  }}
                  title={`${r.name} — ${r.subtitle}`}
                >
                  <span className="multiscale-realm-icon">{r.icon}</span>
                  <span className="multiscale-realm-name">{r.shortName}</span>
                  {badge !== undefined && (
                    <span className="multiscale-chip-badge">{badge}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      );
    }
  );

// ============================================================================
// 2. FLOATING LAYERS, ERA TIMELINE & GAZETTEER SEARCH HUD (760+ LOCATIONS)
// ============================================================================

export interface AtlasLayerAndSearchHudProps {
  layers: AtlasLayerVisibility;
  onChangeLayers: (next: AtlasLayerVisibility) => void;
  eraFilter: VaeloriaHistoricalEraId;
  onChangeEraFilter: (era: VaeloriaHistoricalEraId) => void;
  onSelectGazetteerEntry: (entry: VaeloriaGazetteerEntry) => void;
}

export const AtlasLayerAndSearchHud: React.FC<AtlasLayerAndSearchHudProps> =
  React.memo(
    ({
      layers,
      onChangeLayers,
      eraFilter,
      onChangeEraFilter,
      onSelectGazetteerEntry,
    }) => {
      const [openPopover, setOpenPopover] = useState<
        'none' | 'layers' | 'search' | 'eras'
      >('none');
      const [searchQuery, setSearchQuery] = useState('');

      const totalIndexed = useMemo(
        () => getVaeloriaGazetteerIndex().length,
        []
      );

      const searchResults = useMemo(() => {
        if (openPopover !== 'search') return [];
        return searchVaeloriaGazetteer(searchQuery, 16);
      }, [openPopover, searchQuery]);

      const toggleLayer = (key: keyof AtlasLayerVisibility) => {
        playSfx('draw');
        onChangeLayers({
          ...layers,
          [key]: !layers[key],
        });
      };

      const activeEraDef =
        VAELORIA_HISTORICAL_ERAS.find((e) => e.id === eraFilter) ??
        VAELORIA_HISTORICAL_ERAS[0];

      return (
        <div
          className="atlas-hud-cluster"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="atlas-hud-buttons-row">
            <button
              type="button"
              className={`atlas-hud-pill-btn ${
                openPopover === 'search' ? 'active' : ''
              }`}
              onClick={() =>
                setOpenPopover((p) => (p === 'search' ? 'none' : 'search'))
              }
              title={`Buscar entre ${totalIndexed} locais cartografados de Vaeloria`}
            >
              🔎 Buscar ({totalIndexed})
            </button>

            <button
              type="button"
              className={`atlas-hud-pill-btn ${
                openPopover === 'layers' ? 'active' : ''
              }`}
              onClick={() =>
                setOpenPopover((p) => (p === 'layers' ? 'none' : 'layers'))
              }
              title="Ligar ou desligar camadas de Rios, Relevo, Linhas de Ley, Tráfego e Assentamentos"
            >
              🗺️ Camadas
            </button>

            <button
              type="button"
              className={`atlas-hud-pill-btn ${
                layers.historicalEras || openPopover === 'eras' ? 'active' : ''
              }`}
              onClick={() => {
                if (!layers.historicalEras) {
                  onChangeLayers({ ...layers, historicalEras: true });
                }
                setOpenPopover((p) => (p === 'eras' ? 'none' : 'eras'));
              }}
              title="Filtrar Campos de Batalha Históricos dos VII Cantos"
            >
              ⏳ {layers.historicalEras ? activeEraDef.shortLabel : 'Cantos'}
            </button>
          </div>

          {openPopover === 'layers' && (
            <div className="atlas-hud-popover atlas-layers-popover">
              <div className="atlas-popover-header">
                <span>🗺️ Camadas Cartográficas</span>
                <button
                  type="button"
                  className="atlas-popover-close"
                  onClick={() => setOpenPopover('none')}
                >
                  ✕
                </button>
              </div>
              <label className="atlas-layer-toggle-row">
                <input
                  type="checkbox"
                  checked={layers.hydrographyAndRoutes}
                  onChange={() => toggleLayer('hydrographyAndRoutes')}
                />
                <span>🌊 Rios, Magma, Mares & Rotas Aéreas</span>
              </label>
              <label className="atlas-layer-toggle-row">
                <input
                  type="checkbox"
                  checked={layers.reliefAndToponyms}
                  onChange={() => toggleLayer('reliefAndToponyms')}
                />
                <span>🏔️ Relevo & Topônimos (LOD 1–4)</span>
              </label>
              <label className="atlas-layer-toggle-row">
                <input
                  type="checkbox"
                  checked={layers.leyLines}
                  onChange={() => toggleLayer('leyLines')}
                />
                <span>🔮 Malha Pentacromática de Ley</span>
              </label>
              <label className="atlas-layer-toggle-row">
                <input
                  type="checkbox"
                  checked={layers.livingTraffic}
                  onChange={() => toggleLayer('livingTraffic')}
                />
                <span>🐪 Tráfego Vivo (Caravanas & Frotas)</span>
              </label>
              <label className="atlas-layer-toggle-row">
                <input
                  type="checkbox"
                  checked={layers.settlementsAndDistricts}
                  onChange={() => toggleLayer('settlementsAndDistricts')}
                />
                <span>🏰 Distritos Urbanos & Assentamentos</span>
              </label>
              <label className="atlas-layer-toggle-row">
                <input
                  type="checkbox"
                  checked={layers.historicalEras}
                  onChange={() => toggleLayer('historicalEras')}
                />
                <span>⚔️ Batalhas Históricas dos Cantos</span>
              </label>
            </div>
          )}

          {openPopover === 'eras' && (
            <div className="atlas-hud-popover atlas-eras-popover">
              <div className="atlas-popover-header">
                <span>⏳ Cronologia Militar dos VII Cantos</span>
                <button
                  type="button"
                  className="atlas-popover-close"
                  onClick={() => setOpenPopover('none')}
                >
                  ✕
                </button>
              </div>
              <div className="atlas-era-chips-list">
                {VAELORIA_HISTORICAL_ERAS.map((era) => (
                  <button
                    key={era.id}
                    type="button"
                    className={`atlas-era-option-btn ${
                      eraFilter === era.id && layers.historicalEras ? 'active' : ''
                    }`}
                    style={
                      eraFilter === era.id && layers.historicalEras
                        ? { borderColor: era.accentColor }
                        : undefined
                    }
                    onClick={() => {
                      playSfx('draw');
                      onChangeLayers({ ...layers, historicalEras: true });
                      onChangeEraFilter(era.id);
                    }}
                  >
                    <div className="atlas-era-opt-top">
                      <strong>{era.title}</strong>
                      <span>{era.yearLabel}</span>
                    </div>
                    <div className="atlas-era-opt-sub">
                      {era.cantoLabel} — {era.summary}
                    </div>
                  </button>
                ))}
              </div>
              {layers.historicalEras && (
                <button
                  type="button"
                  className="atlas-era-hide-btn"
                  onClick={() => {
                    onChangeLayers({ ...layers, historicalEras: false });
                    setOpenPopover('none');
                  }}
                >
                  Ocultar Marcadores Históricos
                </button>
              )}
            </div>
          )}

          {openPopover === 'search' && (
            <div className="atlas-hud-popover atlas-gazetteer-popover">
              <div className="atlas-popover-header">
                <span>🔎 Almanaque Real de Vaeloria</span>
                <button
                  type="button"
                  className="atlas-popover-close"
                  onClick={() => setOpenPopover('none')}
                >
                  ✕
                </button>
              </div>
              <input
                type="text"
                className="atlas-gazetteer-input"
                placeholder="Buscar cidade, rio, distrito, chefe, batalha..."
                value={searchQuery}
                autoFocus
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="atlas-gazetteer-results">
                {searchResults.length === 0 ? (
                  <div className="atlas-gazetteer-empty">
                    Nenhum local encontrado para &ldquo;{searchQuery}&rdquo;.
                  </div>
                ) : (
                  searchResults.map((entry) => (
                    <button
                      key={entry.id}
                      type="button"
                      className="atlas-gazetteer-item"
                      onClick={() => {
                        playSfx('landmark_discover');
                        onSelectGazetteerEntry(entry);
                        setOpenPopover('none');
                      }}
                    >
                      <span
                        className="atlas-gaz-icon"
                        style={{ color: DOMAIN_ACCENT_HEX[entry.domain] }}
                      >
                        {entry.icon}
                      </span>
                      <span className="atlas-gaz-body">
                        <span className="atlas-gaz-title">{entry.name}</span>
                        <span className="atlas-gaz-sub">{entry.subtitle}</span>
                      </span>
                      <span className="atlas-gaz-scope-pill">
                        {entry.scopeShortName}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      );
    }
  );

// ============================================================================
// 3. SVG HYDROGRAPHY, LEY CONDUITS, CURVED LABELS & ANIMATED TRAFFIC LAYER
// ============================================================================

export interface CartographicSvgLayerProps {
  scope: VaeloriaMapScope;
  zoom: number;
  viewBoxWidth: number;
  viewBoxHeight: number;
  layers: AtlasLayerVisibility;
  idPrefix: string;
  onInspectNote: (note: CartographicInspectionNote) => void;
}

export const CartographicSvgLayer: React.FC<CartographicSvgLayerProps> =
  React.memo(
    ({
      scope,
      zoom,
      viewBoxWidth,
      viewBoxHeight,
      layers,
      idPrefix,
      onInspectNote,
    }) => {
      const visiblePaths = useMemo(
        () => getCartographicPathsForScope(scope, zoom, layers),
        [scope, zoom, layers]
      );

      const scaleUnit = viewBoxWidth / 1600;
      const zoomDamp = 1 / Math.pow(Math.max(1, zoom), 0.35);

      return (
        <g className="cartographic-svg-layer">
          {visiblePaths.map((p) => {
            const d = pointsToSmoothSvgPath(
              p.points,
              viewBoxWidth,
              viewBoxHeight
            );
            if (!d) return null;
            const pathDomId = `${idPrefix}_${p.id}`;
            const styleSpec = PATH_COLOR_BY_KIND[p.kind];
            const strokeColor =
              p.kind === 'ley_conduit'
                ? DOMAIN_ACCENT_HEX[p.domain]
                : styleSpec.stroke;
            const baseWidth = 2.8 * styleSpec.widthFactor * scaleUnit * zoomDamp;
            const showCurvedName = zoom >= 1.25 || scope !== 'world';
            const showTraffic =
              layers.livingTraffic && Boolean(p.trafficKind) && Boolean(d);

            return (
              <g
                key={p.id}
                className={`carto-path-group carto-path-${p.kind}`}
              >
                {/* Soft Luminous Aura */}
                <path
                  d={d}
                  fill="none"
                  stroke={styleSpec.glow}
                  strokeWidth={baseWidth * 3.1}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ pointerEvents: 'none' }}
                />

                {/* Primary Calibrated Vector Curve */}
                <path
                  id={pathDomId}
                  d={d}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={baseWidth}
                  strokeDasharray={styleSpec.dash}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={
                    p.kind === 'ley_conduit'
                      ? 'carto-ley-animated-stroke'
                      : p.kind === 'river' || p.kind === 'lava_stream'
                        ? 'carto-fluid-animated-stroke'
                        : undefined
                  }
                  style={{ pointerEvents: 'none' }}
                />

                {/* Wide Invisible Clickable Hit Target */}
                <path
                  d={d}
                  fill="none"
                  stroke="rgba(255,255,255,0.001)"
                  strokeWidth={Math.max(14 * scaleUnit, baseWidth * 5)}
                  strokeLinecap="round"
                  style={{ cursor: 'pointer', pointerEvents: 'stroke' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    playSfx('landmark_discover');
                    onInspectNote(buildPathInspectionNote(p));
                  }}
                >
                  <title>{`${p.name} (${p.elevationLabel}) — Clique para abrir no Caderno do Cartógrafo`}</title>
                </path>

                {/* Curved Calligraphic River / Route Label */}
                {showCurvedName && (
                  <text
                    dy={-5 * scaleUnit * zoomDamp}
                    fontSize={Math.max(9.5, 11.5 * scaleUnit * zoomDamp)}
                    className={`carto-curved-path-label carto-curved-label-${p.kind}`}
                    style={{ pointerEvents: 'none' }}
                  >
                    <textPath
                      href={`#${pathDomId}`}
                      startOffset="50%"
                      textAnchor="middle"
                    >
                      {p.name}
                    </textPath>
                  </text>
                )}

                {/* Living Cartographic Traffic Token */}
                {showTraffic && p.trafficKind && (
                  <g
                    className="carto-living-traffic-token"
                    style={{ cursor: 'pointer', pointerEvents: 'all' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      playSfx('landmark_discover');
                      onInspectNote(buildPathInspectionNote(p));
                    }}
                  >
                    <animateMotion
                      dur={`${p.durationSec ?? 18}s`}
                      repeatCount="indefinite"
                      path={d}
                    />
                    <circle
                      r={9.5 * scaleUnit * zoomDamp}
                      fill="rgba(8, 12, 24, 0.88)"
                      stroke={DOMAIN_ACCENT_HEX[p.domain]}
                      strokeWidth={1.4 * scaleUnit}
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={11.5 * scaleUnit * zoomDamp}
                    >
                      {TRAFFIC_EMOJI[p.trafficKind]}
                    </text>
                    <title>{`${p.trafficLabel ?? 'Tráfego Ativo'} — ${p.name}`}</title>
                  </g>
                )}
              </g>
            );
          })}
        </g>
      );
    }
  );

// ============================================================================
// 4. HTML OVERLAY PINS: MULTI-LOD TOPONYMS, 36 DISTRICTS, 162 SETTLEMENTS & ERAS
// ============================================================================

export interface CartographicHtmlPinsLayerProps {
  scope: VaeloriaMapScope;
  zoom: number;
  layers: AtlasLayerVisibility;
  eraFilter: VaeloriaHistoricalEraId;
  showUnifiedSettlements: boolean;
  highlightTarget?: GazetteerHighlightTarget | null;
  onInspectNote: (note: CartographicInspectionNote) => void;
}

export const CartographicHtmlPinsLayer: React.FC<CartographicHtmlPinsLayerProps> =
  React.memo(
    ({
      scope,
      zoom,
      layers,
      eraFilter,
      showUnifiedSettlements,
      highlightTarget,
      onInspectNote,
    }) => {
      const visibleToponyms = useMemo(
        () => getCartographicToponymsForScope(scope, zoom, layers),
        [scope, zoom, layers]
      );

      const capitalDistricts = useMemo(() => {
        if (!layers.settlementsAndDistricts) return [];
        if (!scope.startsWith('capital_')) return [];
        return VAELORIA_CAPITAL_DISTRICTS.filter(
          (d) => d.capitalScope === scope
        );
      }, [scope, layers.settlementsAndDistricts]);

      const historicalSites = useMemo(() => {
        if (!layers.historicalEras) return [];
        return getHistoricalBattlefieldsForScope(scope, eraFilter);
      }, [scope, eraFilter, layers.historicalEras]);

      const unifiedSettlementPins = useMemo(() => {
        if (!showUnifiedSettlements || !layers.settlementsAndDistricts) {
          return [];
        }
        if (scope.startsWith('capital_')) return [];
        if (scope === 'world' && zoom < 1.65) return [];
        if (scope !== 'world' && zoom < 1.08) return [];

        const pins: Array<{
          key: string;
          x: number;
          y: number;
          icon: string;
          name: string;
          note: CartographicInspectionNote;
        }> = [];

        const secondaryMap =
          scope !== 'world' ? SCOPE_PROVINCE_PROJECTIONS[scope] : undefined;

        for (const prov of CONQUEST_PROVINCES) {
          let px: number | null = null;
          let py: number | null = null;
          let spreadFactor = 1.0;

          if (scope === 'world') {
            px = prov.x;
            py = prov.y;
            spreadFactor = 0.85;
          } else {
            const direct = PROVINCE_REGIONAL_COORDS[prov.id];
            if (direct && direct.realm === scope) {
              px = direct.rx;
              py = direct.ry;
              spreadFactor = 2.2;
            } else if (secondaryMap?.[prov.id]) {
              px = secondaryMap[prov.id].rx;
              py = secondaryMap[prov.id].ry;
              spreadFactor = 1.8;
            }
          }

          if (px === null || py === null) continue;

          for (const ms of prov.microSettlements) {
            const sx = Math.max(4, Math.min(96, px + ms.dx * spreadFactor));
            const sy = Math.max(5, Math.min(95, py + ms.dy * spreadFactor));
            const note = buildSettlementInspectionNote(
              prov,
              ms,
              sx,
              sy,
              scope
            );
            pins.push({
              key: `${prov.id}_${ms.name}`,
              x: sx,
              y: sy,
              icon: note.icon,
              name: ms.name,
              note,
            });
          }
        }
        return pins;
      }, [scope, zoom, showUnifiedSettlements, layers.settlementsAndDistricts]);

      const invScale = 1 / Math.pow(Math.max(1, zoom), 0.44);

      return (
        <div className="cartographic-html-pins-layer">
          {/* 1. Multi-LOD Toponyms (LOD 1–4) */}
          {visibleToponyms.map((top) => (
            <button
              key={top.id}
              type="button"
              className={`carto-toponym-pin carto-toponym-lod-${top.lod} carto-toponym-${top.kind}`}
              style={{
                left: `${top.x}%`,
                top: `${top.y}%`,
                transform: `translate(-50%, -50%) scale(${invScale.toFixed(3)}) rotate(${
                  top.angleDeg ?? 0
                }deg)`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                playSfx('landmark_discover');
                onInspectNote(buildToponymInspectionNote(top));
              }}
              title={`${top.name} (${top.elevationLabel}) — Clique para ler no Caderno do Cartógrafo`}
            >
              {top.name}
            </button>
          ))}

          {/* 2. Unified 162 Micro-Settlements (Overworld) */}
          {unifiedSettlementPins.map((pin) => (
            <button
              key={pin.key}
              type="button"
              className="carto-unified-settlement-pin"
              style={{
                left: `${pin.x}%`,
                top: `${pin.y}%`,
                transform: `translate(-50%, -50%) scale(${invScale.toFixed(3)})`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                playSfx('landmark_discover');
                onInspectNote(pin.note);
              }}
              title={`${pin.name} — Clique para inspecionar assentamento e cartas nativas`}
            >
              <span className="carto-settle-dot">{pin.icon}</span>
              {zoom >= 1.9 && (
                <span className="carto-settle-name">{pin.name}</span>
              )}
            </button>
          ))}

          {/* 3. 36 Interactive Imperial Capital Districts (4th Scale) */}
          {capitalDistricts.map((dist) => (
            <button
              key={dist.id}
              type="button"
              className={`carto-capital-district-pin carto-district-${dist.role}`}
              style={{
                left: `${dist.x}%`,
                top: `${dist.y}%`,
                borderColor: DOMAIN_ACCENT_HEX[dist.domain],
                transform: `translate(-50%, -50%) scale(${invScale.toFixed(3)})`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                playSfx('diplomacy_seal');
                onInspectNote(buildDistrictInspectionNote(dist));
              }}
              title={`${dist.name} (${dist.roleLabel}) — Clique para inspecionar Distrito Imperial`}
            >
              <span className="carto-district-crest">{dist.icon}</span>
              <span className="carto-district-meta">
                <span className="carto-district-role">{dist.roleLabel}</span>
                <span className="carto-district-title">{dist.name}</span>
              </span>
            </button>
          ))}

          {/* 4. Historical Battlefields of the VII Cantos */}
          {historicalSites.map((bf) => (
            <button
              key={bf.id}
              type="button"
              className="carto-historical-battle-pin"
              style={{
                left: `${bf.displayX}%`,
                top: `${bf.displayY}%`,
                borderColor: DOMAIN_ACCENT_HEX[bf.domain],
                transform: `translate(-50%, -50%) scale(${invScale.toFixed(3)})`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                playSfx('landmark_discover');
                onInspectNote(buildBattlefieldInspectionNote(bf, scope));
              }}
              title={`${bf.name} (${bf.yearLabel}) — ${bf.cantoRef}`}
            >
              <span className="carto-battle-swords">⚔️</span>
              <span className="carto-battle-year">{bf.yearLabel}</span>
              <span className="carto-battle-name">{bf.name}</span>
            </button>
          ))}

          {/* 5. Gazetteer Pulsing Compass Highlight Ring */}
          {highlightTarget && highlightTarget.scope === scope && (
            <div
              className="carto-gazetteer-highlight-ring"
              style={{
                left: `${highlightTarget.x}%`,
                top: `${highlightTarget.y}%`,
              }}
            >
              <div className="carto-gazetteer-ring-pulse" />
              <span className="carto-gazetteer-ring-tag">
                ✦ {highlightTarget.label}
              </span>
            </div>
          )}
        </div>
      );
    }
  );

// ============================================================================
// 5. "📖 CADERNO DO CARTÓGRAFO REAL" INSPECTOR DRAWER + NATIVE CARDS MODAL
// ============================================================================

export interface CartographerInspectorCardProps {
  note: CartographicInspectionNote | null;
  onClose: () => void;
  onNavigateScope?: (scope: VaeloriaMapScope) => void;
}

export const CartographerInspectorCard: React.FC<CartographerInspectorCardProps> =
  ({ note, onClose, onNavigateScope }) => {
    const [inspectCard, setInspectCard] = useState<CardDefinition | null>(null);

    if (!note) return null;

    const accent = DOMAIN_ACCENT_HEX[note.domain];
    const domainMeta = DOMAIN_META[note.domain] ?? DOMAIN_META.neutral;

    return (
      <>
        <aside
          className="cartographer-notebook-card"
          style={{ borderColor: `${accent}88` }}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="cartographer-notebook-header">
            <div className="cartographer-notebook-heading">
              <span
                className="cartographer-notebook-kicker"
                style={{ color: accent }}
              >
                📖 CADERNO DO CARTÓGRAFO • {note.categoryBadge}
              </span>
              <h4 className="cartographer-notebook-title">
                <span>{note.icon}</span> {note.title}
              </h4>
              <div className="cartographer-notebook-sub">{note.subtitle}</div>
            </div>
            <button
              type="button"
              className="cartographer-notebook-close"
              onClick={onClose}
              title="Fechar Caderno do Cartógrafo"
            >
              ✕
            </button>
          </div>

          <div className="cartographer-telemetry-grid">
            <div className="cartographer-telemetry-cell">
              <span className="carto-tel-label">🏔️ Altitude / Cota</span>
              <span className="carto-tel-val">{note.elevationLabel}</span>
            </div>
            <div className="cartographer-telemetry-cell">
              <span className="carto-tel-label">🌦️ Microclima</span>
              <span className="carto-tel-val">{note.climateLabel}</span>
            </div>
            <div className="cartographer-telemetry-cell">
              <span className="carto-tel-label">📜 Registro Épico</span>
              <span className="carto-tel-val">{note.cantoRef}</span>
            </div>
            <div className="cartographer-telemetry-cell">
              <span className="carto-tel-label">◈ Afinidade</span>
              <span className="carto-tel-val" style={{ color: accent }}>
                {domainMeta.icon} {domainMeta.name}
              </span>
            </div>
          </div>

          <p className="cartographer-lore-paragraph">{note.loreText}</p>

          {note.tacticalSummary && (
            <div
              className="cartographer-tactical-box"
              style={{ borderLeftColor: accent }}
            >
              <strong>⚜ Doutrina & Relevo:</strong> {note.tacticalSummary}
            </div>
          )}

          {note.fastTravelScope && onNavigateScope && (
            <button
              type="button"
              className="cartographer-fasttravel-btn"
              style={{ borderColor: accent }}
              onClick={() => {
                const dest = note.fastTravelScope!;
                onClose();
                onNavigateScope(dest);
              }}
            >
              🧭 {note.fastTravelLabel ?? 'Viajar para Mapa Conectado'}
            </button>
          )}

          {note.nativeCards.length > 0 && (
            <div className="cartographer-native-cards-section">
              <div className="cartographer-native-header">
                <span>🃏 Fauna, Relíquias & Forças Nativas (Clique p/ abrir)</span>
              </div>
              <div className="cartographer-native-cards-grid">
                {note.nativeCards.map((card) => {
                  const cAccent = DOMAIN_ACCENT_HEX[card.domain];
                  return (
                    <button
                      key={card.id}
                      type="button"
                      className="cartographer-native-card-chip"
                      style={{ borderColor: `${cAccent}66` }}
                      onClick={() => {
                        playSfx('draw');
                        setInspectCard(card);
                      }}
                      title={`Inspecionar carta nativa: ${card.name}`}
                    >
                      <div className="carto-ncard-thumb-wrap">
                        {card.imagePath ? (
                          <img
                            src={card.imagePath}
                            alt={card.name}
                            className="carto-ncard-thumb"
                            loading="lazy"
                          />
                        ) : (
                          <span className="carto-ncard-fallback">🃏</span>
                        )}
                        <span
                          className="carto-ncard-cost"
                          style={{ background: cAccent }}
                        >
                          {card.cost}
                        </span>
                      </div>
                      <div className="carto-ncard-info">
                        <span className="carto-ncard-name">{card.name}</span>
                        <span className="carto-ncard-stats">
                          {card.type === 'creature'
                            ? `⚔️${card.atk} • ❤️${card.hp}`
                            : card.type === 'spell'
                              ? '✨ Feitiço'
                              : card.type === 'relic'
                                ? '🏺 Relíquia'
                                : '⚡ Reação'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </aside>

        {inspectCard && (
          <CardInspectModal
            card={inspectCard}
            onClose={() => setInspectCard(null)}
          />
        )}
      </>
    );
  };

// ============================================================================
// 6. DYNAMIC CARTOGRAPHIC SCALE RULER (LEAGUES / METERS)
// ============================================================================

export const CartographicScaleRuler: React.FC<{
  scope: VaeloriaMapScope;
  zoom: number;
}> = React.memo(({ scope, zoom }) => {
  const meta = useMemo(() => getMapScaleMetadata(scope, zoom), [scope, zoom]);
  return (
    <div
      className="cartographic-scale-ruler"
      onClick={(e) => e.stopPropagation()}
      title="Escala cartográfica dinâmica recalibrada em tempo real conforme o nível de zoom e a escala do mapa"
    >
      <span className="carto-scale-tier">{meta.tierBadge}</span>
      <span className="carto-scale-bar">{meta.rulerText}</span>
      <span className="carto-scale-zoom">{zoom.toFixed(1)}x</span>
    </div>
  );
});
