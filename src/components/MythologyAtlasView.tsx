import React, { useState, useMemo, useEffect } from 'react';
import { CardDefinition, Domain } from '../types/game';
import { CARDS_BY_ID } from '../data/cards';
import { EpicPoemCanto, EpicPoemNode } from '../data/epicPoemTypes';
import {
  EPIC_POEM_CANTOS,
  ALL_EPIC_POEM_NODES,
  PARALLEL_EPIC_POEM_CANTOS,
  PARALLEL_CANTO_BY_PARENT_ID,
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
  { id: 'canto_4_sangue', roman: 'IV', shortEra: 'Era do Sangue', yearMark: '411 D.F.' },
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
  const [expandedParallelIds, setExpandedParallelIds] = useState<Record<string, boolean>>({});

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

  // Filtered Cantos and their nodes for the Single-Column Classic Book Layout
  const filteredCantos = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return EPIC_POEM_CANTOS.filter((canto) => {
      const parallel = PARALLEL_CANTO_BY_PARENT_ID[canto.id];
      if (
        selectedCantoId !== 'all' &&
        canto.id !== selectedCantoId &&
        parallel?.id !== selectedCantoId
      ) {
        return false;
      }
      return true;
    })
      .map((canto) => {
        const parallel = PARALLEL_CANTO_BY_PARENT_ID[canto.id];
        const matchingNodes = filterNodes(canto.nodes, q);
        const matchingParallelNodes = parallel ? filterNodes(parallel.nodes, q) : [];

        return {
          ...canto,
          nodes: matchingNodes,
          parallelCanto: parallel
            ? {
                ...parallel,
                nodes: matchingParallelNodes,
                allNodes: parallel.nodes,
              }
            : undefined,
        };
      })
      .filter(
        (canto) =>
          canto.nodes.length > 0 ||
          (canto.parallelCanto && canto.parallelCanto.nodes.length > 0)
      );
  }, [selectedCantoId, selectedDomain, nodeFilterKind, searchQuery]);

  // Track which Canto or Parallel Canto is currently visible in the viewport for the Lateral Chronological Ruler
  useEffect(() => {
    const mainIds = CANTO_RULER_ITEMS.map((item) => `poem-canto-${item.id}`);
    const parallelIds = PARALLEL_EPIC_POEM_CANTOS.map((p) => `poem-canto-${p.id}`);
    const sections = [...mainIds, ...parallelIds]
      .map((domId) => document.getElementById(domId))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          const id = visible[0].target.id.replace('poem-canto-', '');
          setActiveScrollCantoId(id);
        }
      },
      {
        rootMargin: '-15% 0px -65% 0px',
        threshold: 0,
      }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, [filteredCantos, expandedParallelIds]);

  const handleSelectCantoDropdown = (val: string) => {
    setSelectedCantoId(val);
    const parallelMatch = PARALLEL_EPIC_POEM_CANTOS.find((p) => p.id === val);
    if (parallelMatch) {
      setExpandedParallelIds((prev) => ({ ...prev, [parallelMatch.id]: true }));
      setActiveScrollCantoId(parallelMatch.id);
      setTimeout(() => {
        const el = document.getElementById(`poem-canto-${parallelMatch.id}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    } else if (val !== 'all') {
      setActiveScrollCantoId(val);
      setTimeout(() => {
        const el = document.getElementById(`poem-canto-${val}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 40);
    }
  };

  const handleJumpToCanto = (cantoId: string) => {
    if (selectedCantoId !== 'all') {
      setSelectedCantoId('all');
      setTimeout(() => {
        const el = document.getElementById(`poem-canto-${cantoId}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 40);
    } else {
      const el = document.getElementById(`poem-canto-${cantoId}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setActiveScrollCantoId(cantoId);
  };

  const handleJumpToParallelCanto = (parallelCanto: EpicPoemCanto) => {
    setExpandedParallelIds((prev) => ({ ...prev, [parallelCanto.id]: true }));
    if (selectedCantoId !== 'all' && selectedCantoId !== parallelCanto.parentCantoId && selectedCantoId !== parallelCanto.id) {
      setSelectedCantoId('all');
    }
    setActiveScrollCantoId(parallelCanto.id);
    setTimeout(() => {
      const el = document.getElementById(`poem-canto-${parallelCanto.id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 65);
  };

  const toggleParallelCanto = (parallelId: string) => {
    setExpandedParallelIds((prev) => {
      const nextOpen = !prev[parallelId];
      if (nextOpen) {
        setTimeout(() => {
          const el = document.getElementById(`poem-canto-${parallelId}`);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 65);
      }
      return { ...prev, [parallelId]: nextOpen };
    });
  };

  const renderCantoBookPages = (cantoObj: EpicPoemCanto, nodesList: EpicPoemNode[]) => (
    <div className="poem-book-pages">
      {nodesList.map((node, nodeIdx) => {
        const card = CARDS_BY_ID[node.cardId];
        const domColor = DOMAIN_LABELS[node.domain]?.color || cantoObj.accentColor || '#f59e0b';
        const isCreature = node.kind === 'creature';
        const isRightMedallion =
          isCreature &&
          (node.creatureOrder !== undefined ? node.creatureOrder % 2 === 0 : nodeIdx % 2 === 1);

        if (!isCreature) {
          /* =========================================================
             MARCO HISTÓRICO (PRELÚDIO / INTERLÚDIO) — CENTRALIZADO
          ========================================================= */
          return (
            <article key={node.id} className="poem-folio-historical">
              <div className="poem-ornamental-divider" style={{ color: domColor }}>
                ─── ❖ ───
              </div>

              <div className="poem-historical-dateline">
                <span style={{ color: domColor }}>{node.yearLabel}</span>
                <span className="poem-dateline-sep">•</span>
                <span>{node.locationLabel}</span>
              </div>

              <h3
                className="font-cinzel poem-historical-title"
                onClick={() => card && onInspectCard(card)}
                title={card ? `Inspecionar ${card.name}` : undefined}
              >
                {node.title}
              </h3>
              <div className="poem-historical-subtitle">{node.subtitle}</div>

              {card && (
                <div
                  className="poem-historical-vignette"
                  onClick={() => onInspectCard(card)}
                  style={{ borderColor: `${domColor}45` }}
                  title={`Clique para inspecionar ${card.name}`}
                >
                  <img
                    src={`${card.imagePath}?v=12`}
                    alt={card.name}
                    className="poem-historical-vignette-img"
                    loading="lazy"
                  />
                  <span className="poem-historical-vignette-caption">{card.name}</span>
                </div>
              )}

              <div className="poem-book-stanzas-centered">
                {node.stanzas.map((stanza, sIdx) => (
                  <div key={sIdx} className="poem-book-stanza">
                    {stanza.map((line, lIdx) => (
                      <div key={lIdx} className="poem-verse-line">
                        {line}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </article>
          );
        }

        /* ===========================================================
           CRIATURA — FOLIO DE LIVRO ILUMINADO COM MEDALHÃO CLICÁVEL
        =========================================================== */
        return (
          <article
            key={node.id}
            className={`poem-folio-creature ${
              isRightMedallion ? 'is-medallion-right' : 'is-medallion-left'
            }`}
          >
            <div className="poem-node-header">
              <div className="poem-node-dateline">
                <span className="poem-dateline-year" style={{ color: domColor }}>
                  {node.yearLabel}
                </span>
                <span className="poem-dateline-sep">•</span>
                <span className="poem-dateline-loc">{node.locationLabel}</span>
                {node.creatureOrder !== undefined && (
                  <>
                    <span className="poem-dateline-sep">•</span>
                    <span className="poem-dateline-legend">Lenda #{node.creatureOrder}</span>
                  </>
                )}
              </div>
            </div>

            <div className="poem-node-title-block">
              <h3
                className="font-cinzel poem-node-title"
                onClick={() => card && onInspectCard(card)}
                title={card ? `Clique para inspecionar ${card.name}` : undefined}
              >
                {node.title}
              </h3>
              <div className="poem-node-epithet">{node.subtitle}</div>
            </div>

            <div className="poem-folio-body">
              {card && (
                <div
                  className="poem-card-medallion"
                  onClick={() => onInspectCard(card)}
                  style={{
                    background: `radial-gradient(circle at 50% 45%, ${domColor}26 0%, rgba(9, 12, 22, 0.94) 76%)`,
                    borderColor: `${domColor}40`,
                  }}
                  title={`Clique para inspecionar ${card.name}`}
                >
                  <img
                    src={`${card.imagePath}?v=12`}
                    alt={card.name}
                    className="poem-card-medallion-img"
                    loading="lazy"
                  />
                  <span className="poem-card-medallion-name">{card.name}</span>
                </div>
              )}

              <div className="poem-book-stanzas">
                {node.stanzas.map((stanza, sIdx) => (
                  <div key={sIdx} className="poem-book-stanza">
                    {stanza.map((line, lIdx) => (
                      <div
                        key={lIdx}
                        className={`poem-verse-line ${
                          sIdx === 0 && lIdx === 0 ? 'poem-first-verse' : ''
                        }`}
                      >
                        {line}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );

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
                Todos os 7 Cantos ({ALL_EPIC_POEM_NODES.length} Capítulos + 7 Crônicas Paralelas)
              </option>
              {CANTO_RULER_ITEMS.map((item) => {
                const parallel = PARALLEL_CANTO_BY_PARENT_ID[item.id];
                return (
                  <React.Fragment key={item.id}>
                    <option value={item.id}>
                      Canto {item.roman} — {item.shortEra} ({item.yearMark})
                    </option>
                    {parallel && (
                      <option value={parallel.id}>
                        {`   ↳ Paralelo ${parallel.parallelCode}: ${parallel.shortTitle} (${parallel.periodLabel})`}
                      </option>
                    )}
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
          RÉGUA CRONOLÓGICA LATERAL FIXA (I a VII + Subitens I-A a VII-A)
      ===================================================================== */}
      <aside className="poem-lateral-ruler" aria-label="Linha do Tempo dos Sete Cantos">
        {CANTO_RULER_ITEMS.map((item) => {
          const parallel = PARALLEL_CANTO_BY_PARENT_ID[item.id];
          const isCurrent =
            selectedCantoId === item.id ||
            (selectedCantoId === 'all' && activeScrollCantoId === item.id);
          const isParallelCurrent =
            parallel &&
            (selectedCantoId === parallel.id ||
              (selectedCantoId === 'all' && activeScrollCantoId === parallel.id));

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

              {parallel && (
                <button
                  type="button"
                  className={`poem-ruler-substep ${isParallelCurrent ? 'active' : ''} ${
                    expandedParallelIds[parallel.id] ? 'is-expanded' : ''
                  }`}
                  onClick={() => handleJumpToParallelCanto(parallel)}
                  title={`Explorar Crônica Paralela ${parallel.parallelCode}: ${parallel.title}`}
                >
                  <span className="poem-ruler-substep-arrow">↳</span>
                  <span className="poem-ruler-substep-text">
                    {parallel.parallelCode} • {parallel.shortTitle}
                  </span>
                </button>
              )}
            </div>
          );
        })}
      </aside>

      {/* =====================================================================
          COLUNA ÚNICA DE LIVRO CLÁSSICO (SEM SUB-CAIXAS NAS ESTROFES)
      ===================================================================== */}
      <main className="poem-single-column-container">
        {filteredCantos.length === 0 ? (
          <div className="poem-empty-state">
            Nenhuma estrofe encontrada para o filtro selecionado. Limpe a busca para contemplar o
            poema completo.
          </div>
        ) : (
          filteredCantos.map((canto) => {
            const parallelCanto = canto.parallelCanto;
            const hasSearchQuery = searchQuery.trim().length > 0;
            const isParallelExpanded = Boolean(
              parallelCanto &&
                (expandedParallelIds[parallelCanto.id] ||
                  selectedCantoId === parallelCanto.id ||
                  (hasSearchQuery && parallelCanto.nodes.length > 0))
            );

            return (
              <React.Fragment key={canto.id}>
                {canto.nodes.length > 0 && selectedCantoId !== parallelCanto?.id && (
                  <section id={`poem-canto-${canto.id}`} className="poem-canto-section">
                    {/* FRONTISPÍCIO DO CANTO PRINCIPAL */}
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

                    {/* PÁGINAS DO CANTO PRINCIPAL */}
                    {renderCantoBookPages(canto, canto.nodes)}

                    {/* COLOFÃO EDITORIAL DE FECHO DO CANTO */}
                    <footer className="poem-canto-colophon">
                      <span>
                        — ❖ FIM DO {canto.cantoNumber} ({canto.eraNumber}) ❖ —
                      </span>
                    </footer>
                  </section>
                )}

                {/* PORTAL / SETA DE RAMIFICAÇÃO TEMPORAL (CRÔNICA PARALELA OPCIONAL) */}
                {parallelCanto && parallelCanto.nodes.length > 0 && (
                  <div className="poem-parallel-branch-wrapper">
                    <div
                      className={`poem-parallel-branch-trigger ${
                        isParallelExpanded ? 'is-expanded' : ''
                      }`}
                      style={{ borderColor: `${parallelCanto.accentColor}55` }}
                      onClick={() => toggleParallelCanto(parallelCanto.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleParallelCanto(parallelCanto.id);
                        }
                      }}
                    >
                      <div className="poem-branch-header-row">
                        <span
                          className="poem-branch-arrow"
                          style={{ color: parallelCanto.accentColor }}
                        >
                          ↳
                        </span>
                        <div className="poem-branch-copy">
                          <span
                            className="poem-branch-kicker"
                            style={{ color: parallelCanto.accentColor }}
                          >
                            CRÔNICA PARALELA OPCIONAL • {parallelCanto.cantoNumber} (
                            {parallelCanto.periodLabel})
                          </span>
                          <h3 className="font-cinzel poem-branch-title">
                            {parallelCanto.title}
                          </h3>
                          <p className="poem-branch-subtitle">{parallelCanto.subtitle}</p>
                        </div>
                      </div>

                      <div className="poem-branch-footer-row">
                        <div
                          className="poem-branch-thumbs"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {parallelCanto.allNodes.map((pNode) => {
                            const pCard = CARDS_BY_ID[pNode.cardId];
                            if (!pCard) return null;
                            return (
                              <button
                                key={pNode.id}
                                type="button"
                                className="poem-branch-thumb-btn"
                                onClick={() => onInspectCard(pCard)}
                                title={`Inspecionar ${pCard.name}`}
                              >
                                <img
                                  src={`${pCard.imagePath}?v=12`}
                                  alt={pCard.name}
                                  className="poem-branch-thumb-img"
                                  loading="lazy"
                                />
                              </button>
                            );
                          })}
                        </div>

                        <span className="poem-branch-cta-btn">
                          {isParallelExpanded
                            ? '▴ Ocultar História Paralela'
                            : `↳ Explorar História Paralela (${parallelCanto.nodes.length} Episódios) →`}
                        </span>
                      </div>
                    </div>

                    {/* SEÇÃO EXPANDIDA DO CANTO PARALELO */}
                    {isParallelExpanded && (
                      <section
                        id={`poem-canto-${parallelCanto.id}`}
                        className="poem-canto-section is-parallel-canto"
                      >
                        <div
                          className="poem-canto-banner"
                          style={{
                            borderColor: `${parallelCanto.accentColor}55`,
                            backgroundImage: `linear-gradient(180deg, rgba(10, 14, 26, 0.9) 0%, rgba(7, 10, 19, 0.97) 100%), url('${parallelCanto.bannerImage}')`,
                          }}
                        >
                          <div className="poem-canto-meta-top">
                            <span
                              className="poem-canto-kicker"
                              style={{ color: parallelCanto.accentColor }}
                            >
                              ↳ {parallelCanto.cantoNumber} • {parallelCanto.eraNumber} •{' '}
                              {parallelCanto.periodLabel}
                            </span>
                          </div>

                          <h2 className="font-cinzel gold-gradient-text poem-canto-title">
                            {parallelCanto.title}
                          </h2>
                          <p className="poem-canto-subtitle">{parallelCanto.subtitle}</p>
                        </div>

                        {renderCantoBookPages(parallelCanto, parallelCanto.nodes)}

                        <footer className="poem-canto-colophon">
                          <span>
                            — ❖ FIM DO {parallelCanto.cantoNumber} ({parallelCanto.eraNumber}) ❖ —
                          </span>
                        </footer>
                      </section>
                    )}
                  </div>
                )}
              </React.Fragment>
            );
          })
        )}
      </main>
    </div>
  );
};
