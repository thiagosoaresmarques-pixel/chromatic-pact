import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { CardDefinition, Domain } from '../types/game';
import { CARDS_BY_ID } from '../data/cards';
import { EpicPoemCanto, EpicPoemNode } from '../data/epicPoemTypes';
import {
  EPIC_POEM_CANTOS,
  PARALLEL_EPIC_POEM_CANTOS,
  PARALLEL_CANTOS_BY_PARENT_ID,
} from '../data/epicPoemData';

interface MythologyAtlasViewProps {
  onInspectCard: (card: CardDefinition) => void;
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

export const MythologyAtlasView: React.FC<MythologyAtlasViewProps> = ({ onInspectCard }) => {
  const [selectedCantoId, setSelectedCantoId] = useState<string>('all');
  const [selectedDomain, setSelectedDomain] = useState<Domain | 'all'>('all');
  const [nodeFilterKind, setNodeFilterKind] = useState<'all' | 'creatures_only'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeScrollCantoId, setActiveScrollCantoId] = useState<string>('canto_1_vigilia');
  const programmaticScrollLockUntil = useRef<number>(0);

  const scrollToSectionById = useCallback((domId: string, fallbackDomId?: string) => {
    programmaticScrollLockUntil.current = Date.now() + 950;

    const attemptScroll = (isRetry: boolean) => {
      const el =
        document.getElementById(domId) ||
        (fallbackDomId ? document.getElementById(fallbackDomId) : null);
      if (!el) return;

      const navOffset = 98;
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

  // Track which Canto or Chapter is currently visible in the viewport for the Lateral Chronological Ruler
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
        }
      },
      {
        rootMargin: '-12% 0px -65% 0px',
        threshold: 0,
      }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, [filteredCantos]);

  const handleSelectCantoDropdown = (val: string) => {
    setSelectedCantoId(val);
    const parallelMatch = PARALLEL_EPIC_POEM_CANTOS.find((p) => p.id === val);
    if (parallelMatch) {
      if (selectedDomain !== 'all') setSelectedDomain('all');
      if (nodeFilterKind !== 'all') setNodeFilterKind('all');
      if (searchQuery.trim() !== '') setSearchQuery('');
      setActiveScrollCantoId(parallelMatch.id);
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
    setTimeout(() => {
      scrollToSectionById(
        `poem-parallel-card-${parallelCanto.id}`,
        `poem-canto-${parallelCanto.id}`
      );
    }, 55);
  };

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

    return (
      <section
        key={parallelCanto.id}
        id={`poem-canto-${parallelCanto.id}`}
        className="poem-canto-section is-parallel-canto"
      >
        <div
          id={`poem-parallel-card-${parallelCanto.id}`}
          className="poem-parallel-unified-card"
          style={{
            borderColor: `${parallelCanto.accentColor}55`,
            backgroundImage: `linear-gradient(180deg, rgba(10, 14, 26, 0.92) 0%, rgba(7, 10, 19, 0.98) 100%), url('${parallelCanto.bannerImage}')`,
          }}
        >
          <header className="poem-parallel-unified-header">
            <div className="poem-canto-meta-top">
              <span
                className="poem-canto-kicker"
                style={{ color: parallelCanto.accentColor }}
              >
                {parallelCanto.cantoNumber} • {parallelCanto.periodLabel}
              </span>
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

              if (!showArt) {
                return (
                  <div
                    key={node.id}
                    className="poem-parallel-stream-segment is-narrative-bridge"
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
                  className={`poem-parallel-stream-segment ${
                    isRightMedallion ? 'is-medallion-right' : 'is-medallion-left'
                  }`}
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
                          src={`${card.imagePath}?v=27`}
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
              — ❖ FIM DO {parallelCanto.cantoNumber} ({parallelCanto.eraNumber}) ❖ —
            </span>
          </footer>
        </div>
      </section>
    );
  };

  return (
    <div className="myth-atlas-shell">
      {/* =====================================================================
          CABEÇALHO LITERÁRIO DO PERGAMINHO
      ===================================================================== */}
      <header className="myth-hero-banner">
        <div className="myth-hero-content">
          <h1 className="font-cinzel gold-gradient-text myth-main-title">
            A CANÇÃO DA FRATURA CROMÁTICA
          </h1>
          <p className="myth-hero-subtitle">
            O Grande Poema Épico de Vaeloria — do silêncio cristalino do Coroa-Prisma à guerra do
            Sétimo Selo.
          </p>
        </div>
      </header>

      {/* =====================================================================
          BARRA DE FILTROS EM LINHA ÚNICA (100% DEDICADA AO POEMA ÉPICO)
      ===================================================================== */}
      <nav className="poem-sticky-Controls">
        <div className="poem-controls-single-bar">
          <div className="poem-filters-inline">
            <select
              className="myth-select-compact"
              value={selectedCantoId}
              onChange={(e) => handleSelectCantoDropdown(e.target.value)}
              aria-label="Selecionar Canto"
            >
              <option value="all">
                Todos os 7 Cantos ({PARALLEL_EPIC_POEM_CANTOS.length} Capítulos da Crônica Principal)
              </option>
              {CANTO_RULER_ITEMS.map((item) => {
                const parallels = PARALLEL_CANTOS_BY_PARENT_ID[item.id] || [];
                return (
                  <React.Fragment key={item.id}>
                    <option value={item.id}>
                      Canto {item.roman} — {item.shortEra} ({item.yearMark})
                    </option>
                    {parallels.map((parallel) => (
                      <option key={parallel.id} value={parallel.id}>
                        {`   ↳ Cap. ${parallel.parallelCode}: ${parallel.shortTitle} (${parallel.periodLabel})`}
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

            <select
              className="myth-select-compact"
              value={nodeFilterKind}
              onChange={(e) => setNodeFilterKind(e.target.value as 'all' | 'creatures_only')}
              aria-label="Filtrar Episódios"
            >
              <option value="all">Poema Completo (História + Criaturas)</option>
              <option value="creatures_only">Apenas Criaturas e Lendas</option>
            </select>

            <input
              type="text"
              className="myth-search-compact"
              placeholder="Buscar verso, lenda, local ou ano..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </nav>

      {/* =====================================================================
          RÉGUA CRONOLÓGICA LATERAL FIXA (I a VII + Capítulos I-A a VII-I)
      ===================================================================== */}
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
                title={`Ir para Canto ${item.roman} — ${item.shortEra} (${item.yearMark})`}
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
                return (
                  <button
                    key={parallel.id}
                    type="button"
                    className={`poem-ruler-substep is-expanded ${isParallelCurrent ? 'active' : ''}`}
                    onClick={() => handleJumpToParallelCanto(parallel)}
                    title={`Ir para Capítulo ${parallel.parallelCode}: ${parallel.title}`}
                  >
                    <span className="poem-ruler-substep-arrow">↳</span>
                    <span className="poem-ruler-substep-text">
                      {parallel.parallelCode} • {parallel.shortTitle}
                    </span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </aside>

      {/* =====================================================================
          COLUNA ÚNICA DE LIVRO CLÁSSICO — CRÔNICA PRINCIPAL CONTÍNUA
      ===================================================================== */}
      <main className="poem-single-column-container">
        {filteredCantos.length === 0 ? (
          <div className="poem-empty-state">
            Nenhuma estrofe encontrada para o filtro selecionado. Limpe a busca para contemplar o
            poema completo.
          </div>
        ) : (
          filteredCantos.map((canto) => (
            <section key={canto.id} id={`poem-canto-${canto.id}`} className="poem-canto-section">
              {/* FRONTISPÍCIO DA ERA / CANTO PRINCIPAL */}
              <div
                className="poem-canto-banner"
                style={{
                  borderColor: `${canto.accentColor}44`,
                  backgroundImage: `linear-gradient(180deg, rgba(8, 10, 19, 0.9) 0%, rgba(7, 9, 16, 0.97) 100%), url('${canto.bannerImage}')`,
                }}
              >
                <div className="poem-canto-meta-top">
                  <span
                    className="poem-canto-kicker"
                    style={{ color: canto.accentColor }}
                  >
                    {canto.cantoNumber} • {canto.eraNumber} • {canto.periodLabel}
                  </span>
                </div>

                <h2 className="font-cinzel gold-gradient-text poem-canto-title">
                  {canto.title}
                </h2>
                <p className="poem-canto-subtitle">{canto.subtitle}</p>
              </div>

              {/* CAPÍTULOS CONTÍNUOS DA CRÔNICA PRINCIPAL DESTA ERA */}
              {canto.parallelCantos.map((chapter) =>
                renderParallelCantoUnifiedCard(chapter, chapter.nodes)
              )}

              {/* COLOFÃO EDITORIAL DE FECHO DA ERA */}
              <footer className="poem-canto-colophon">
                <span>
                  — ❖ FIM DO {canto.cantoNumber} ({canto.eraNumber}) ❖ —
                </span>
              </footer>
            </section>
          ))
        )}
      </main>
    </div>
  );
};
