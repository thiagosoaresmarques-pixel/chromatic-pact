import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { CardDefinition, Domain } from '../types/game';
import { CARDS_BY_ID } from '../data/cards';
import { EpicPoemCanto, EpicPoemNode } from '../data/epicPoemTypes';
import {
  EPIC_POEM_CANTOS,
  EPIC_POEM_STATS,
  NavigateToPoemDetail,
  PARALLEL_EPIC_POEM_CANTOS,
  PARALLEL_CANTOS_BY_PARENT_ID,
} from '../data/epicPoemData';
import { VAELORIA_WORLD_MAP_IMAGE } from '../data/vaeloriaMapData';
import {
  PROVINCE_REGIONAL_COORDS,
  REALM_WEATHER_PRESETS,
  SCOPE_PROVINCE_PROJECTIONS,
  VAELORIA_REGIONAL_MAPS,
  VaeloriaMapScope,
} from '../data/vaeloriaMultimapData';
import { CONQUEST_PROVINCES } from '../data/vaeloriaConquestData';
import {
  AtlasLayerVisibility,
  DEFAULT_ATLAS_LAYER_VISIBILITY,
  VAELORIA_HISTORICAL_ERAS,
  VaeloriaHistoricalEraId,
} from '../data/vaeloriaCartographyDetails';
import {
  CartographicInspectionNote,
  VAELORIA_CAPITAL_DISTRICTS,
  VaeloriaGazetteerEntry,
  buildDistrictInspectionNote,
} from '../data/vaeloriaCapitalDistricts';
import {
  AtlasLayerAndSearchHud,
  CartographerInspectorCard,
  CartographicHtmlPinsLayer,
  CartographicScaleRuler,
  CartographicSvgLayer,
  GazetteerHighlightTarget,
} from './CartographicAtlasExtras';

interface MythologyAtlasViewProps {
  onInspectCard: (card: CardDefinition) => void;
  jumpTarget?: NavigateToPoemDetail | null;
  onConsumeJumpTarget?: () => void;
}

interface PoemReadingProgress {
  readChapterIds: string[];
  bookmarkChapterId: string | null;
}

const POEM_PROGRESS_STORAGE_KEY = 'chromatic_pact_poem_progress_v1';

function loadPoemProgress(): PoemReadingProgress {
  try {
    const raw = localStorage.getItem(POEM_PROGRESS_STORAGE_KEY);
    if (!raw) return { readChapterIds: [], bookmarkChapterId: null };
    const parsed = JSON.parse(raw) as Partial<PoemReadingProgress>;
    return {
      readChapterIds: Array.isArray(parsed.readChapterIds) ? parsed.readChapterIds : [],
      bookmarkChapterId:
        typeof parsed.bookmarkChapterId === 'string' ? parsed.bookmarkChapterId : null,
    };
  } catch {
    return { readChapterIds: [], bookmarkChapterId: null };
  }
}

const DOMAIN_LABELS: Record<Domain | 'all', { label: string; color: string }> = {
  all: { label: 'Todos os Domínios', color: '#f59e0b' },
  red: { label: 'Pyros (Rubro)', color: '#ef4444' },
  blue: { label: 'Vórtex (Safira)', color: '#38bdf8' },
  purple: { label: 'Eclipse (Umbral)', color: '#a855f7' },
  green: { label: 'Veridia (Esmeralda)', color: '#10b981' },
  gold: { label: 'Solária (Alvorada)', color: '#eab308' },
  neutral: { label: 'Fronteira Cinzenta', color: '#94a3b8' },
};

interface VaeloriaCompassRegion {
  domain: Domain;
  direction: string;
  shortDir: string;
  name: string;
  epithet: string;
  icon: string;
  color: string;
  citadel: string;
  champions: string;
  summary: string;
  keyChapterIds: string[];
  gridArea: 'polar' | 'north' | 'west' | 'center' | 'east' | 'south';
}

const VAELORIA_COMPASS_REGIONS: VaeloriaCompassRegion[] = [
  {
    domain: 'blue',
    direction: 'Polos & Arquipélagos Setentrionais',
    shortDir: 'POLOS',
    name: 'Vórtex',
    epithet: 'Pináculos de Gelo & Planetário Astral',
    icon: '❄️',
    color: '#38bdf8',
    citadel: 'Pináculo Polar & Estreito de Safira',
    champions: 'Chronos • Vorthurion • Thalassia • Aldric • Thaddeus',
    summary:
      'Nos círculos polares e estreitos congelados de Vaeloria erguem-se os observatórios horológicos e as fossas abissais onde o tempo e as marés são medidos.',
    keyChapterIds: [
      'canto_1e_relogio_chronos',
      'canto_2g_agulhas_vidro_vorthurion',
      'canto_3b_conspiracao_planetario',
      'canto_7h_abertura_ceu_safira',
    ],
    gridArea: 'polar',
  },
  {
    domain: 'red',
    direction: 'Norte Vulcânico (Cordilheira Boreal)',
    shortDir: 'NORTE',
    name: 'Pyros',
    epithet: 'Caldeiras de Magma & Bigorna Primordial',
    icon: '🔥',
    color: '#ef4444',
    citadel: 'Caldeira Ancestral & Bigorna Partida',
    champions: 'Vulcanis • Igniskar • Kaelen • Zik • Dinastia Varkas',
    summary:
      'Ao norte fumegante ardem as crateras basálticas e forjas titânicas onde nasceu a primeira brasa contra o Coroa-Prisma e de onde marcharam as legiões férreas.',
    keyChapterIds: [
      'canto_1g_primeira_brasa_vulcanis',
      'canto_2d_grilhoes_vulcanor',
      'canto_3a_forja_cisma',
      'canto_4k_armadas_draconicas_ceu_sem_sol',
    ],
    gridArea: 'north',
  },
  {
    domain: 'purple',
    direction: 'Oeste Profundo (Fendas Umbrais)',
    shortDir: 'OESTE',
    name: 'Vale do Eclipse',
    epithet: 'Catedral de Obsidiana & Criptas Reais',
    icon: '💀',
    color: '#a855f7',
    citadel: 'Catedral de Obsidiana & Ossário Real',
    champions: 'Nocturnus • Vesperion • Carmilla • Vladislaus • Malakor',
    summary:
      'Nas gargantas sem sol do oeste estendem-se as charnecas cinzentas, catedrais góticas de sangue e criptas necromânticas onde ecoam juramentos eternos.',
    keyChapterIds: [
      'canto_1c_sussurro_nocturnus',
      'canto_2f_medula_ossaurion',
      'canto_3f_ascensao_vesperion',
      'canto_7c_batalha_trono_ossos',
    ],
    gridArea: 'west',
  },
  {
    domain: 'neutral',
    direction: 'Centro Axial (Umbigo do Continente)',
    shortDir: 'CENTRO',
    name: 'Fronteira Cinzenta',
    epithet: 'Torre Cinzenta → Torre dos Cinco Selos',
    icon: '☸',
    color: '#e2e8f0',
    citadel: 'Monte Axial & Arena do Pacto Cromático',
    champions: 'Valkyra • Comandante Garrick • Valerius • Generais da Roda',
    summary:
      'Onde tombaram as cascas sem cor do astro partido ergueu-se primeiro a Torre Cinzenta e, em 689 D.F., a Torre dos Cinco Selos — sede neutra da Arena.',
    keyChapterIds: [
      'canto_1a_conjura',
      'canto_2aa_arautos_prisma',
      'canto_5a_conclaves_ocultos',
      'canto_5k_generais_roda_quebra_dominios',
      'canto_7b_ultimo_conselho_arena',
    ],
    gridArea: 'center',
  },
  {
    domain: 'gold',
    direction: 'Leste Alto (Planaltos Orientais)',
    shortDir: 'LESTE',
    name: 'Solária',
    epithet: 'Bastião de Mármore & Sete Espelhos Solares',
    icon: '☀️',
    color: '#eab308',
    citadel: 'Zênite Dourado & Cidadela da Alvorada',
    champions: 'Titã da Alvorada • Zephaniel • Justinian • Heliodor • Hyperion',
    summary:
      'Nos planaltos orientais banhados pela primeira aurora reluzem as muralhas brancas, os códigos sagrados e as falanges aladas da Ordem Solar.',
    keyChapterIds: [
      'canto_1h_promessa_alvorada',
      'canto_3j_trono_celestial_estase',
      'canto_6h_escudo_bicolor_aurelion',
      'canto_7d_assalto_tres_cranios',
    ],
    gridArea: 'east',
  },
  {
    domain: 'green',
    direction: 'Sul Selvagem (Matas Austrais)',
    shortDir: 'SUL',
    name: 'Veridia',
    epithet: 'Santuário da Raiz-Ferro & Selva Primeva',
    icon: '🌿',
    color: '#10b981',
    citadel: 'Galhada Viva & Coração da Árvore-Mãe',
    champions: 'Sylvanor • Kongor • Lyra • Smaragda • Sylvanhorn',
    summary:
      'Ao sul colossal entrelaçam-se copas milenares, raízes encouraçadas e clareiras sagradas onde feras titânicas e espíritos ancestrais guardam a seiva do mundo.',
    keyChapterIds: [
      'canto_1d_semente_sylvanor',
      'canto_2h_santuario_galhada_viva',
      'canto_4g_pacto_vale_presas',
      'canto_7f_reis_selvagens_fenris',
    ],
    gridArea: 'south',
  },
];

const CANTO_RULER_ITEMS: Array<{
  id: string;
  roman: string;
  shortEra: string;
  yearMark: string;
}> = [
  { id: 'canto_1_vigilia', roman: 'I', shortEra: 'Vigília Imóvel', yearMark: '∞ A.F.' },
  { id: 'canto_2_fratura', roman: 'II', shortEra: 'A Fratura', yearMark: '1 D.F.' },
  { id: 'canto_3_cidadelas', roman: 'III', shortEra: 'As Cidadelas', yearMark: '143 D.F.' },
  { id: 'canto_4_guerra', roman: 'IV', shortEra: 'Era do Sangue', yearMark: '411 D.F.' },
  { id: 'canto_5_pacto', roman: 'V', shortEra: 'O Pacto', yearMark: '689 D.F.' },
  { id: 'canto_6_tratados', roman: 'VI', shortEra: 'Os Tratados', yearMark: '851 D.F.' },
  { id: 'canto_7_presente', roman: 'VII', shortEra: 'Sétimo Selo', yearMark: '1.121 D.F.' },
];

export const MythologyAtlasView: React.FC<MythologyAtlasViewProps> = ({
  onInspectCard,
  jumpTarget,
  onConsumeJumpTarget,
}) => {
  const [selectedCantoId, setSelectedCantoId] = useState<string>('all');
  const [selectedDomain, setSelectedDomain] = useState<Domain | 'all'>('all');
  const [nodeFilterKind, setNodeFilterKind] = useState<'all' | 'creatures_only'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeScrollCantoId, setActiveScrollCantoId] = useState<string>('canto_1_vigilia');
  const [isCompassOpen, setIsCompassOpen] = useState<boolean>(false);
  const [compassSubMode, setCompassSubMode] = useState<'compass' | 'gallery21'>('gallery21');
  const [selectedAtlasScope, setSelectedAtlasScope] = useState<VaeloriaMapScope>('world');
  const [atlasZoom, setAtlasZoom] = useState<number>(1);
  const [atlasLayers, setAtlasLayers] = useState<AtlasLayerVisibility>(
    DEFAULT_ATLAS_LAYER_VISIBILITY
  );
  const [eraFilter, setEraFilter] = useState<VaeloriaHistoricalEraId>('all_eras');
  const [inspectedNote, setInspectedNote] = useState<CartographicInspectionNote | null>(null);
  const [gazetteerHighlight, setGazetteerHighlight] =
    useState<GazetteerHighlightTarget | null>(null);

  const handleSelectGazetteerInMythology = useCallback(
    (entry: VaeloriaGazetteerEntry) => {
      setSelectedAtlasScope(entry.scope);
      setAtlasZoom(1);
      setGazetteerHighlight({
        scope: entry.scope,
        x: entry.x,
        y: entry.y,
        label: entry.name,
      });
      if (entry.inspectionNote) {
        setInspectedNote(entry.inspectionNote);
      }
    },
    []
  );
  const [selectedCompassDomain, setSelectedCompassDomain] = useState<Domain>('neutral');
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);
  const [readingProgress, setReadingProgress] = useState<PoemReadingProgress>(() =>
    loadPoemProgress()
  );

  const programmaticScrollLockUntil = useRef<number>(0);

  useEffect(() => {
    try {
      localStorage.setItem(POEM_PROGRESS_STORAGE_KEY, JSON.stringify(readingProgress));
    } catch {
      // Ignore storage quota errors
    }
  }, [readingProgress]);

  const markChapterRead = useCallback((chapterId: string, alsoBookmark = false) => {
    if (!chapterId) return;
    setReadingProgress((prev) => {
      const alreadyRead = prev.readChapterIds.includes(chapterId);
      const nextRead = alreadyRead ? prev.readChapterIds : [...prev.readChapterIds, chapterId];
      const nextBookmark = alsoBookmark ? chapterId : prev.bookmarkChapterId;
      if (alreadyRead && nextBookmark === prev.bookmarkChapterId) return prev;
      return {
        readChapterIds: nextRead,
        bookmarkChapterId: nextBookmark,
      };
    });
  }, []);

  const toggleChapterBookmark = useCallback((chapterId: string) => {
    setReadingProgress((prev) => ({
      readChapterIds: prev.readChapterIds.includes(chapterId)
        ? prev.readChapterIds
        : [...prev.readChapterIds, chapterId],
      bookmarkChapterId: prev.bookmarkChapterId === chapterId ? null : chapterId,
    }));
  }, []);

  const scrollToSectionById = useCallback((domId: string, fallbackDomId?: string) => {
    programmaticScrollLockUntil.current = Date.now() + 950;

    const attemptScroll = (isRetry: boolean) => {
      const el =
        document.getElementById(domId) ||
        (fallbackDomId ? document.getElementById(fallbackDomId) : null);
      if (!el) return;

      const navOffset = 108;
      const rect = el.getBoundingClientRect();
      const absoluteTop = rect.top + window.scrollY - navOffset;
      const distance = Math.abs(window.scrollY - absoluteTop);

      if (!isRetry && distance > 3200) {
        const approachTop =
          absoluteTop > window.scrollY
            ? Math.max(0, absoluteTop - 380)
            : Math.max(0, absoluteTop + 380);
        window.scrollTo({ top: approachTop, behavior: 'auto' });
        requestAnimationFrame(() => {
          const targetEl =
            document.getElementById(domId) ||
            (fallbackDomId ? document.getElementById(fallbackDomId) : null);
          if (!targetEl) return;
          const updatedTop = targetEl.getBoundingClientRect().top + window.scrollY - navOffset;
          window.scrollTo({ top: Math.max(0, updatedTop), behavior: 'smooth' });
        });
      } else {
        window.scrollTo({ top: Math.max(0, absoluteTop), behavior: 'smooth' });
      }
    };

    requestAnimationFrame(() => {
      attemptScroll(false);
      setTimeout(() => attemptScroll(true), 180);
    });
  }, []);

  // Consume incoming Card -> Poem deep-link jump requests
  useEffect(() => {
    if (!jumpTarget) return;
    setSelectedCantoId('all');
    setSelectedDomain('all');
    setNodeFilterKind('all');
    setSearchQuery('');

    if (jumpTarget.chapterId) {
      setActiveScrollCantoId(jumpTarget.chapterId);
      markChapterRead(jumpTarget.chapterId, true);
    } else if (jumpTarget.cantoId) {
      setActiveScrollCantoId(jumpTarget.cantoId);
    }

    if (jumpTarget.nodeId) {
      setHighlightedNodeId(jumpTarget.nodeId);
    }

    const scrollTimer = setTimeout(() => {
      const primaryDomId = jumpTarget.nodeId
        ? `poem-node-${jumpTarget.nodeId}`
        : jumpTarget.chapterId
        ? `poem-parallel-card-${jumpTarget.chapterId}`
        : `poem-canto-${jumpTarget.cantoId}`;
      const fallbackDomId = jumpTarget.chapterId
        ? `poem-parallel-card-${jumpTarget.chapterId}`
        : `poem-canto-${jumpTarget.cantoId}`;
      scrollToSectionById(primaryDomId, fallbackDomId);
      onConsumeJumpTarget?.();
    }, 90);

    const clearHighlightTimer = setTimeout(() => {
      setHighlightedNodeId((prev) => (prev === jumpTarget.nodeId ? null : prev));
    }, 4800);

    return () => {
      clearTimeout(scrollTimer);
      clearTimeout(clearHighlightTimer);
    };
  }, [jumpTarget, markChapterRead, onConsumeJumpTarget, scrollToSectionById]);

  const filterNodes = (nodes: EpicPoemNode[], q: string): EpicPoemNode[] => {
    return nodes.filter((node) => {
      if (nodeFilterKind === 'creatures_only' && node.kind !== 'creature') return false;
      if (selectedDomain !== 'all' && node.domain !== selectedDomain) return false;
      if (q) {
        const card = CARDS_BY_ID[node.cardId];
        const inTitle = node.title.toLowerCase().includes(q);
        const inSub = node.subtitle.toLowerCase().includes(q);
        const inYear = node.yearLabel.toLowerCase().includes(q);
        const inLoc = node.locationLabel.toLowerCase().includes(q);
        const inOrder =
          node.creatureOrder !== undefined &&
          (`#${node.creatureOrder}` === q || `${node.creatureOrder}` === q);
        const inCardName = card ? card.name.toLowerCase().includes(q) : false;
        const inVerses = node.stanzas.some((st) =>
          st.some((line) => line.toLowerCase().includes(q))
        );
        return inTitle || inSub || inYear || inLoc || inOrder || inCardName || inVerses;
      }
      return true;
    });
  };

  // Filtered Cantos and their continuous canonical chapters for the Single-Column Classic Book Layout
  const filteredCantos = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return EPIC_POEM_CANTOS.filter((canto) => {
      const parallels = PARALLEL_CANTOS_BY_PARENT_ID[canto.id] || [];
      if (
        selectedCantoId !== 'all' &&
        canto.id !== selectedCantoId &&
        !parallels.some((p) => p.id === selectedCantoId)
      ) {
        return false;
      }
      return true;
    })
      .map((canto) => {
        const parallels = PARALLEL_CANTOS_BY_PARENT_ID[canto.id] || [];
        const mappedParallels = parallels
          .filter((p) => {
            const isSelectedParallel = PARALLEL_EPIC_POEM_CANTOS.some(
              (pc) => pc.id === selectedCantoId
            );
            if (isSelectedParallel && p.id !== selectedCantoId) return false;
            return true;
          })
          .map((p) => ({
            ...p,
            nodes: filterNodes(p.nodes, q),
            allNodes: p.nodes,
          }))
          .filter((p) => p.nodes.length > 0);

        return {
          ...canto,
          parallelCantos: mappedParallels,
        };
      })
      .filter((canto) => canto.parallelCantos.length > 0);
  }, [selectedCantoId, selectedDomain, nodeFilterKind, searchQuery]);

  const parallelChapterIdsSet = useMemo(
    () => new Set(PARALLEL_EPIC_POEM_CANTOS.map((p) => p.id)),
    []
  );

  // Track which Canto or Chapter is currently visible in the viewport for the Lateral Chronological Ruler & Reading Progress
  useEffect(() => {
    const mainIds = CANTO_RULER_ITEMS.map((item) => `poem-canto-${item.id}`);
    const parallelIds = PARALLEL_EPIC_POEM_CANTOS.map((p) => `poem-canto-${p.id}`);
    const sections = [...mainIds, ...parallelIds]
      .map((domId) => document.getElementById(domId))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (Date.now() < programmaticScrollLockUntil.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          const id = visible[0].target.id.replace('poem-canto-', '');
          setActiveScrollCantoId(id);
          if (parallelChapterIdsSet.has(id)) {
            markChapterRead(id, false);
          }
        }
      },
      {
        rootMargin: '-12% 0px -65% 0px',
        threshold: 0,
      }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, [filteredCantos, markChapterRead, parallelChapterIdsSet]);

  const handleSelectCantoDropdown = (val: string) => {
    setSelectedCantoId(val);
    const parallelMatch = PARALLEL_EPIC_POEM_CANTOS.find((p) => p.id === val);
    if (parallelMatch) {
      if (selectedDomain !== 'all') setSelectedDomain('all');
      if (nodeFilterKind !== 'all') setNodeFilterKind('all');
      if (searchQuery.trim() !== '') setSearchQuery('');
      setActiveScrollCantoId(parallelMatch.id);
      markChapterRead(parallelMatch.id, false);
      setTimeout(() => {
        scrollToSectionById(
          `poem-parallel-card-${parallelMatch.id}`,
          `poem-canto-${parallelMatch.id}`
        );
      }, 50);
    } else if (val !== 'all') {
      setActiveScrollCantoId(val);
      setTimeout(() => {
        scrollToSectionById(`poem-canto-${val}`);
      }, 40);
    }
  };

  const handleJumpToCanto = (cantoId: string) => {
    if (selectedCantoId !== 'all') {
      setSelectedCantoId('all');
    }
    if (selectedDomain !== 'all') {
      const targetChapters = PARALLEL_CANTOS_BY_PARENT_ID[cantoId] || [];
      if (!targetChapters.some((ch) => ch.nodes.some((n) => n.domain === selectedDomain))) {
        setSelectedDomain('all');
      }
    }
    if (searchQuery.trim() !== '') {
      setSearchQuery('');
    }
    setActiveScrollCantoId(cantoId);
    setTimeout(() => {
      scrollToSectionById(`poem-canto-${cantoId}`);
    }, 45);
  };

  const handleJumpToParallelCanto = (parallelCanto: EpicPoemCanto) => {
    if (
      selectedCantoId !== 'all' &&
      selectedCantoId !== parallelCanto.parentCantoId &&
      selectedCantoId !== parallelCanto.id
    ) {
      setSelectedCantoId('all');
    }
    if (
      selectedDomain !== 'all' &&
      !parallelCanto.nodes.some((n) => n.domain === selectedDomain)
    ) {
      setSelectedDomain('all');
    }
    if (
      nodeFilterKind === 'creatures_only' &&
      !parallelCanto.nodes.some((n) => n.kind === 'creature')
    ) {
      setNodeFilterKind('all');
    }
    if (searchQuery.trim() !== '') {
      setSearchQuery('');
    }
    setActiveScrollCantoId(parallelCanto.id);
    markChapterRead(parallelCanto.id, false);
    setTimeout(() => {
      scrollToSectionById(
        `poem-parallel-card-${parallelCanto.id}`,
        `poem-canto-${parallelCanto.id}`
      );
    }, 55);
  };

  const bookmarkedChapter = useMemo(
    () =>
      readingProgress.bookmarkChapterId
        ? PARALLEL_EPIC_POEM_CANTOS.find((p) => p.id === readingProgress.bookmarkChapterId) ?? null
        : null,
    [readingProgress.bookmarkChapterId]
  );

  const readChaptersCount = useMemo(
    () => readingProgress.readChapterIds.filter((id) => parallelChapterIdsSet.has(id)).length,
    [readingProgress.readChapterIds, parallelChapterIdsSet]
  );

  const readPct = Math.min(
    100,
    Math.round((readChaptersCount / Math.max(1, EPIC_POEM_STATS.totalChapters)) * 100)
  );

  const activeCompassRegion =
    VAELORIA_COMPASS_REGIONS.find((r) => r.domain === selectedCompassDomain) ||
    VAELORIA_COMPASS_REGIONS[3];

  /**
   * Renderiza cada Capítulo da Crônica Principal de Vaeloria dentro de um card contínuo de livro iluminado
   * (.poem-parallel-unified-card), exibindo o cabeçalho geral do Capítulo no topo e alternando as
   * ilustrações 310×310 sem moldura e sem legenda com as respectivas estrofes e pontes narrativas.
   */
  const renderParallelCantoUnifiedCard = (
    parallelCanto: EpicPoemCanto,
    nodesList: EpicPoemNode[]
  ) => {
    let illustratedCounter = 0;
    const isBookmarked = readingProgress.bookmarkChapterId === parallelCanto.id;
    const isChapterRead = readingProgress.readChapterIds.includes(parallelCanto.id);

    return (
      <section
        key={parallelCanto.id}
        id={`poem-canto-${parallelCanto.id}`}
        className="poem-canto-section is-parallel-canto"
      >
        <div
          id={`poem-parallel-card-${parallelCanto.id}`}
          className={`poem-parallel-unified-card ${isBookmarked ? 'is-bookmarked-chapter' : ''}`}
          style={{
            borderColor: isBookmarked
              ? 'rgba(250, 204, 21, 0.65)'
              : 'rgba(212, 175, 55, 0.25)',
            backgroundImage: `linear-gradient(180deg, rgba(10, 14, 24, 0.94) 0%, rgba(7, 10, 18, 0.98) 100%), url('${parallelCanto.bannerImage}')`,
          }}
        >
          <header className="poem-parallel-unified-header">
            <div className="poem-canto-meta-top poem-chapter-header-row">
              <span className="poem-canto-kicker" style={{ color: '#e6c875' }}>
                {parallelCanto.cantoNumber} • {parallelCanto.periodLabel}
              </span>

              <div className="poem-chapter-reading-tools">
                {isChapterRead && (
                  <span className="poem-chapter-read-pill" title="Capítulo visitado na leitura">
                    ✓ Lido
                  </span>
                )}
                <button
                  type="button"
                  className={`poem-bookmark-toggle-btn ${isBookmarked ? 'active' : ''}`}
                  onClick={() => toggleChapterBookmark(parallelCanto.id)}
                  title={
                    isBookmarked
                      ? 'Remover marcador de leitura deste capítulo'
                      : 'Salvar marcador de leitura neste capítulo'
                  }
                >
                  {isBookmarked ? 'Marcado' : 'Marcar'}
                </button>
              </div>
            </div>

            <h2 className="font-cinzel gold-gradient-text poem-canto-title">
              {parallelCanto.title}
            </h2>
            <p className="poem-canto-subtitle">{parallelCanto.subtitle}</p>
          </header>

          <div className="poem-parallel-unified-stream">
            {nodesList.map((node, nodeIdx) => {
              const card = CARDS_BY_ID[node.cardId];
              const domColor =
                DOMAIN_LABELS[node.domain]?.color || parallelCanto.accentColor || '#f59e0b';
              const showArt = Boolean(card && !node.hideCardArt);
              const isRightMedallion = showArt ? illustratedCounter++ % 2 === 1 : false;
              const isHighlighted = highlightedNodeId === node.id;

              if (!showArt) {
                return (
                  <div
                    key={node.id}
                    id={`poem-node-${node.id}`}
                    className={`poem-parallel-stream-segment is-narrative-bridge ${
                      isHighlighted ? 'is-highlighted-poem-node' : ''
                    }`}
                  >
                    <div className="poem-book-stanzas-centered">
                      {node.stanzas.map((stanza, sIdx) => (
                        <div key={sIdx} className="poem-book-stanza">
                          {stanza.map((line, lIdx) => (
                            <div
                              key={lIdx}
                              className={`poem-verse-line ${
                                nodeIdx === 0 && sIdx === 0 && lIdx === 0 ? 'poem-first-verse' : ''
                              }`}
                            >
                              {line}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={node.id}
                  id={`poem-node-${node.id}`}
                  className={`poem-parallel-stream-segment ${
                    isRightMedallion ? 'is-medallion-right' : 'is-medallion-left'
                  } ${isHighlighted ? 'is-highlighted-poem-node' : ''}`}
                >
                  <div className="poem-folio-body">
                    {card && (
                      <div
                        className="poem-card-medallion"
                        onClick={() => onInspectCard(card)}
                        style={{ '--dom-glow': `${domColor}45` } as React.CSSProperties}
                        title={`Clique para inspecionar ${card.name}`}
                      >
                        <img
                          src={`${card.imagePath}?v=56`}
                          alt={card.name}
                          className="poem-card-medallion-img"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="poem-book-stanzas">
                      {node.stanzas.map((stanza, sIdx) => (
                        <div key={sIdx} className="poem-book-stanza">
                          {stanza.map((line, lIdx) => (
                            <div
                              key={lIdx}
                              className={`poem-verse-line ${
                                nodeIdx === 0 && sIdx === 0 && lIdx === 0 ? 'poem-first-verse' : ''
                              }`}
                            >
                              {line}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <footer className="poem-canto-colophon">
            <span>
              — Fim do {parallelCanto.cantoNumber} ({parallelCanto.eraNumber}) —
            </span>
          </footer>
        </div>
      </section>
    );
  };

  const regionalMapValues = Object.values(VAELORIA_REGIONAL_MAPS);

  return (
    <div className={`myth-atlas-shell ${isCompassOpen ? 'is-atlas-only-mode' : ''}`}>
      {/* Clean Single-Row Top Bar: Epopeia | Atlas Cartográfico + Contextual Controls */}
      <nav
        className="poem-sticky-Controls"
        style={isCompassOpen ? { marginRight: 0 } : undefined}
      >
        <div
          className="poem-controls-single-bar"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`nav-tab-btn ${!isCompassOpen ? 'active' : ''}`}
              style={{ textTransform: 'none', letterSpacing: '0.01em', padding: '6px 12px', fontSize: '0.8rem' }}
              onClick={() => setIsCompassOpen(false)}
            >
              Epopeia ({PARALLEL_EPIC_POEM_CANTOS.length} Capítulos)
            </button>
            <button
              type="button"
              className={`nav-tab-btn ${isCompassOpen && compassSubMode === 'gallery21' ? 'active' : ''}`}
              style={{ textTransform: 'none', letterSpacing: '0.01em', padding: '6px 12px', fontSize: '0.8rem' }}
              onClick={() => {
                setIsCompassOpen(true);
                setCompassSubMode('gallery21');
              }}
            >
              Atlas Cartográfico (21 Mapas)
            </button>
            <button
              type="button"
              className={`nav-tab-btn ${isCompassOpen && compassSubMode === 'compass' ? 'active' : ''}`}
              style={{ textTransform: 'none', letterSpacing: '0.01em', padding: '6px 12px', fontSize: '0.8rem' }}
              onClick={() => {
                setIsCompassOpen(true);
                setCompassSubMode('compass');
              }}
            >
              Rosa dos Ventos
            </button>
          </div>

          {!isCompassOpen ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <select
                className="myth-select-compact"
                value={selectedCantoId}
                onChange={(e) => handleSelectCantoDropdown(e.target.value)}
                aria-label="Selecionar Canto"
              >
                <option value="all">Todos os 7 Cantos</option>
                {CANTO_RULER_ITEMS.map((item) => {
                  const parallels = PARALLEL_CANTOS_BY_PARENT_ID[item.id] || [];
                  return (
                    <React.Fragment key={item.id}>
                      <option value={item.id}>
                        Canto {item.roman} — {item.shortEra} ({item.yearMark})
                      </option>
                      {parallels.map((parallel) => (
                        <option key={parallel.id} value={parallel.id}>
                          {`   Cap. ${parallel.parallelCode}: ${parallel.shortTitle}`}
                        </option>
                      ))}
                    </React.Fragment>
                  );
                })}
              </select>

              <select
                className="myth-select-compact"
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value as Domain | 'all')}
                aria-label="Selecionar Domínio"
              >
                {(Object.keys(DOMAIN_LABELS) as Array<Domain | 'all'>).map((dom) => (
                  <option key={dom} value={dom}>
                    {DOMAIN_LABELS[dom].label}
                  </option>
                ))}
              </select>

              <input
                type="text"
                className="myth-search-compact"
                placeholder="Buscar verso, lenda ou local..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <span
                style={{ fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap' }}
                title={`${readChaptersCount} de ${EPIC_POEM_STATS.totalChapters} capítulos lidos (${readPct}%)`}
              >
                {readChaptersCount}/{EPIC_POEM_STATS.totalChapters} lidos
              </span>

              {bookmarkedChapter && (
                <button
                  type="button"
                  className="aaa-btn aaa-btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.74rem' }}
                  onClick={() => handleJumpToParallelCanto(bookmarkedChapter)}
                >
                  Retomar {bookmarkedChapter.parallelCode}
                </button>
              )}
            </div>
          ) : compassSubMode === 'gallery21' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <select
                aria-label="Selecionar mapa"
                className="myth-select-compact"
                style={{ minWidth: 230 }}
                value={selectedAtlasScope}
                onChange={(e) => {
                  setSelectedAtlasScope(e.target.value as VaeloriaMapScope);
                  setAtlasZoom(1);
                  setInspectedNote(null);
                }}
              >
                <option value="world">Continente de Vaeloria ({CONQUEST_PROVINCES.length} províncias)</option>
                <optgroup label="Reinos Cardeais (6)">
                  {regionalMapValues
                    .filter((m) => m.tier === 'cardinal_realm')
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Fronteiras Profundas (6)">
                  {regionalMapValues
                    .filter((m) => m.tier === 'deep_frontier')
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Corredores Transcontinentais (2)">
                  {regionalMapValues
                    .filter((m) => m.tier === 'transit_corridor')
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Capitais Imperiais (6)">
                  {regionalMapValues
                    .filter((m) => m.tier === 'imperial_capital')
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                </optgroup>
              </select>

              <select
                aria-label="Era histórica"
                className="myth-select-compact"
                value={atlasLayers.historicalEras ? eraFilter : 'off'}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'off') {
                    setAtlasLayers((prev) => ({ ...prev, historicalEras: false }));
                  } else {
                    setAtlasLayers((prev) => ({ ...prev, historicalEras: true }));
                    setEraFilter(val as VaeloriaHistoricalEraId);
                  }
                }}
              >
                <option value="off">Sem filtro de era</option>
                {VAELORIA_HISTORICAL_ERAS.map((era) => (
                  <option key={era.id} value={era.id}>
                    {era.shortLabel}
                  </option>
                ))}
              </select>

              <AtlasLayerAndSearchHud
                layers={atlasLayers}
                onChangeLayers={setAtlasLayers}
                eraFilter={eraFilter}
                onChangeEraFilter={setEraFilter}
                onSelectGazetteerEntry={handleSelectGazetteerInMythology}
              />
            </div>
          ) : null}
        </div>
      </nav>

      {/* =====================================================================
          MODE A: ATLAS CARTOGRÁFICO & ROSA DOS VENTOS (FULL CLEAN VIEWPORT)
      ===================================================================== */}
      {isCompassOpen ? (
        <section
          aria-label="Atlas Cartográfico de Vaeloria"
          style={{ maxWidth: 1220, margin: '12px auto 0', width: '100%' }}
        >
          <div
            style={{
              background: '#0b0f19',
              border: '1px solid rgba(148, 163, 184, 0.12)',
              borderRadius: 10,
              padding: '18px 20px',
            }}
          >
            {compassSubMode === 'gallery21' ? (
              (() => {
                const reg =
                  selectedAtlasScope !== 'world'
                    ? VAELORIA_REGIONAL_MAPS[selectedAtlasScope]
                    : null;
                const secondaryProj = reg ? SCOPE_PROVINCE_PROJECTIONS[reg.id] : undefined;
                const provCount = reg
                  ? CONQUEST_PROVINCES.filter(
                      (p) =>
                        PROVINCE_REGIONAL_COORDS[p.id]?.realm === reg.id ||
                        Boolean(secondaryProj?.[p.id])
                    ).length
                  : CONQUEST_PROVINCES.length;
                const capitalDistricts =
                  reg && reg.tier === 'imperial_capital'
                    ? VAELORIA_CAPITAL_DISTRICTS.filter((d) => d.capitalScope === reg.id)
                    : [];

                return (
                  <div className="myth-atlas-gallery-body">
                    <div className="myth-atlas-preview-frame" style={{ position: 'relative' }}>
                      <img
                        src={reg ? reg.imagePath : VAELORIA_WORLD_MAP_IMAGE}
                        alt={reg ? reg.name : 'Mapa Continental de Vaeloria'}
                        loading="lazy"
                      />

                      <svg
                        viewBox="0 0 1600 900"
                        preserveAspectRatio="none"
                        className="myth-atlas-svg-overlay"
                      >
                        <CartographicSvgLayer
                          scope={selectedAtlasScope}
                          zoom={atlasZoom}
                          viewBoxWidth={1600}
                          viewBoxHeight={900}
                          layers={atlasLayers}
                          idPrefix="myth_atlas_svg"
                          onInspectNote={setInspectedNote}
                        />
                      </svg>

                      <CartographicHtmlPinsLayer
                        scope={selectedAtlasScope}
                        zoom={atlasZoom}
                        layers={atlasLayers}
                        eraFilter={eraFilter}
                        showUnifiedSettlements={atlasZoom >= 1.8}
                        highlightTarget={gazetteerHighlight}
                        inspectedNoteId={inspectedNote?.id ?? null}
                        onInspectNote={setInspectedNote}
                      />

                      <CartographicScaleRuler scope={selectedAtlasScope} zoom={atlasZoom} />

                      <CartographerInspectorCard
                        note={inspectedNote}
                        onClose={() => setInspectedNote(null)}
                        onNavigateScope={(destScope) => {
                          setSelectedAtlasScope(destScope);
                        }}
                      />
                    </div>

                    <div className="myth-atlas-info-card">
                      <span
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          color: reg ? reg.accentColor : '#e5c97b',
                        }}
                      >
                        {reg ? reg.cardinalTitle : 'Carta Continental de Vaeloria'}
                      </span>
                      <h3
                        className="font-cinzel"
                        style={{ margin: '4px 0 8px', fontSize: '1.12rem', color: '#f8fafc' }}
                      >
                        {reg ? reg.name : 'Continente de Vaeloria'}
                      </h3>
                      <p
                        style={{
                          margin: '0 0 12px',
                          fontSize: '0.82rem',
                          color: '#cbd5e1',
                          lineHeight: 1.5,
                        }}
                      >
                        {reg
                          ? `${reg.subtitle}. Clique em qualquer rota, marco ou distrito sobre o mapa para abrir a nota cartográfica.`
                          : 'Reúne os 6 Reinos Cardeais, 6 Fronteiras Profundas, 2 Corredores Transcontinentais e as 6 Capitais Imperiais.'}
                      </p>

                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 12,
                          fontSize: '0.76rem',
                          color: '#94a3b8',
                          paddingTop: 10,
                          borderTop: '1px solid rgba(148, 163, 184, 0.1)',
                          marginBottom: 12,
                        }}
                      >
                        <span>
                          Províncias: <strong style={{ color: '#f8fafc' }}>{provCount}</strong>
                        </span>
                        <span>
                          Marcos: <strong style={{ color: '#f8fafc' }}>{reg ? reg.localLandmarks.length : 120}</strong>
                        </span>
                        {reg && (
                          <span>
                            Clima:{' '}
                            <strong style={{ color: '#f8fafc' }}>
                              {REALM_WEATHER_PRESETS[reg.id].name}
                            </strong>
                          </span>
                        )}
                      </div>

                      {capitalDistricts.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
                          <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#cbd5e1' }}>
                            Distritos urbanos
                          </span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {capitalDistricts.map((dist) => (
                              <button
                                key={dist.id}
                                type="button"
                                onClick={() => setInspectedNote(buildDistrictInspectionNote(dist))}
                                className="aaa-pill-tab"
                              >
                                {dist.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {reg && reg.localLandmarks.length > 0 && (
                        <details style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                          <summary style={{ cursor: 'pointer', color: '#cbd5e1', userSelect: 'none' }}>
                            Marcos cartográficos deste mapa ({reg.localLandmarks.length})
                          </summary>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                            {reg.localLandmarks.map((lm) => (
                              <span
                                key={lm.id}
                                style={{
                                  padding: '3px 8px',
                                  borderRadius: 6,
                                  fontSize: '0.73rem',
                                  background: 'rgba(15, 23, 42, 0.6)',
                                  border: '1px solid rgba(148, 163, 184, 0.14)',
                                  color: '#cbd5e1',
                                }}
                              >
                                {lm.name}
                              </span>
                            ))}
                          </div>
                        </details>
                      )}
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="vaeloria-compass-layout">
                <div className="vaeloria-compass-grid">
                  {VAELORIA_COMPASS_REGIONS.map((region) => {
                    const isActive = region.domain === selectedCompassDomain;
                    return (
                      <button
                        key={region.domain}
                        type="button"
                        className={`vaeloria-compass-node area-${region.gridArea} ${
                          isActive ? 'is-selected' : ''
                        }`}
                        style={{ '--region-color': region.color } as React.CSSProperties}
                        onClick={() => setSelectedCompassDomain(region.domain)}
                      >
                        <span className="compass-node-dir">{region.shortDir}</span>
                        <span className="compass-node-name">{region.name}</span>
                        <span className="compass-node-sub">{region.epithet}</span>
                      </button>
                    );
                  })}
                </div>

                <div
                  className="vaeloria-compass-detail"
                  style={{ '--region-color': activeCompassRegion.color } as React.CSSProperties}
                >
                  <div className="compass-detail-top">
                    <span className="compass-detail-dir">{activeCompassRegion.direction}</span>
                    <h4 className="font-cinzel compass-detail-name">
                      {activeCompassRegion.name} — {activeCompassRegion.epithet}
                    </h4>
                    <div className="compass-detail-citadel">
                      <strong>Bastião:</strong> {activeCompassRegion.citadel}
                    </div>
                    <div className="compass-detail-citadel">
                      <strong>Vultos:</strong> {activeCompassRegion.champions}
                    </div>
                  </div>

                  <p className="compass-detail-summary">{activeCompassRegion.summary}</p>

                  <div className="compass-detail-chapters">
                    <span className="compass-detail-chapters-label">Capítulos fundamentais:</span>
                    <div className="compass-detail-pills">
                      {activeCompassRegion.keyChapterIds.map((chId) => {
                        const ch = PARALLEL_EPIC_POEM_CANTOS.find((p) => p.id === chId);
                        if (!ch) return null;
                        return (
                          <button
                            key={ch.id}
                            type="button"
                            className="compass-chapter-pill"
                            onClick={() => {
                              setIsCompassOpen(false);
                              handleJumpToParallelCanto(ch);
                            }}
                          >
                            {ch.parallelCode} · {ch.shortTitle}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      ) : (
        <>
          {/* Clean Right-Hand Chronological TOC (No Repetitive Arrow Soup) */}
          <aside className="poem-lateral-ruler" aria-label="Linha do Tempo dos Sete Cantos">
            {CANTO_RULER_ITEMS.map((item) => {
              const parallels = PARALLEL_CANTOS_BY_PARENT_ID[item.id] || [];
              const isCurrent =
                selectedCantoId === item.id ||
                (selectedCantoId === 'all' && activeScrollCantoId === item.id);

              return (
                <div key={item.id} className="poem-ruler-group">
                  <button
                    type="button"
                    className={`poem-ruler-step ${isCurrent ? 'active' : ''}`}
                    onClick={() => handleJumpToCanto(item.id)}
                  >
                    <span className="poem-ruler-roman">{item.roman}</span>
                    <span className="poem-ruler-meta">
                      <span className="poem-ruler-era">{item.shortEra}</span>
                      <span className="poem-ruler-year">{item.yearMark}</span>
                    </span>
                  </button>

                  {parallels.map((parallel) => {
                    const isParallelCurrent =
                      selectedCantoId === parallel.id ||
                      (selectedCantoId === 'all' && activeScrollCantoId === parallel.id);
                    const isBookmarked = readingProgress.bookmarkChapterId === parallel.id;
                    const isRead = readingProgress.readChapterIds.includes(parallel.id);
                    return (
                      <button
                        key={parallel.id}
                        type="button"
                        className={`poem-ruler-substep is-expanded ${
                          isParallelCurrent ? 'active' : ''
                        } ${isBookmarked ? 'is-bookmarked' : ''} ${isRead ? 'is-read' : ''}`}
                        onClick={() => handleJumpToParallelCanto(parallel)}
                        title={`${parallel.parallelCode}: ${parallel.title}`}
                      >
                        <span className="poem-ruler-substep-text">
                          {isRead ? '✓ ' : ''}
                          {parallel.parallelCode} · {parallel.shortTitle}
                        </span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </aside>

          {/* Main Book Column */}
          <main className="poem-single-column-container">
            {filteredCantos.length === 0 ? (
              <div className="poem-empty-state">
                Nenhuma estrofe encontrada para o filtro selecionado.
              </div>
            ) : (
              filteredCantos.map((canto) => (
                <section key={canto.id} id={`poem-canto-${canto.id}`} className="poem-canto-section">
                  <div
                    className="poem-canto-banner"
                    style={{
                      borderColor: `${canto.accentColor}44`,
                      backgroundImage: `linear-gradient(180deg, rgba(8, 10, 19, 0.9) 0%, rgba(7, 9, 16, 0.97) 100%), url('${canto.bannerImage}')`,
                    }}
                  >
                    <div className="poem-canto-meta-top">
                      <span className="poem-canto-kicker" style={{ color: canto.accentColor }}>
                        {canto.cantoNumber} · {canto.eraNumber} · {canto.periodLabel}
                      </span>
                    </div>

                    <h2 className="font-cinzel gold-gradient-text poem-canto-title">
                      {canto.title}
                    </h2>
                    <p className="poem-canto-subtitle">{canto.subtitle}</p>
                  </div>

                  {canto.parallelCantos.map((chapter) =>
                    renderParallelCantoUnifiedCard(chapter, chapter.nodes)
                  )}

                  <footer className="poem-canto-colophon">
                    <span>
                      — Fim do {canto.cantoNumber} ({canto.eraNumber}) —
                    </span>
                  </footer>
                </section>
              ))
            )}
          </main>
        </>
      )}
    </div>
  );
};
