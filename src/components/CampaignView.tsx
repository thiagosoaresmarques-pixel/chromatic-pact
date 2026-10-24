import React, { useState, useMemo } from 'react';
import { CampaignBoss, CardDefinition } from '../types/game';
import { CARDS_BY_ID } from '../data/cards';
import { CAMPAIGN_BOSSES, PREBUILT_DECKS } from '../data/decks';
import { DOMAIN_META, CardInspectModal } from './CardView';
import { CustomSavedDeck } from './BattleArena';
import { TacticalGuideView } from './TacticalGuideView';

export interface CampaignViewProps {
  defeatedBossIds: string[];
  customDecks: CustomSavedDeck[];
  onStartBossBattle: (boss: CampaignBoss, playerDeckCardIds: string[]) => void;
}

const FALLBACK_ACT_V_BOSSES: CampaignBoss[] = [
  {
    id: 'boss_stage_15_solar_forges',
    stage: 15,
    name: 'Vulcanus & Solaria, A Forja Solar',
    title: 'Ato V • Regentes do Trono de Bronze e Fogo',
    domains: ['red', 'gold', 'green'],
    avatarCardId: 'gold_07_dragao_ouro',
    startingHp: 75,
    passiveName: 'Têmpera Piro-Solar',
    passiveDescription:
      'Suas Relíquias e Guardiões entram com proteção reforçada enquanto dragões varrem as fileiras.',
    rewardGold: 780,
    loreIntro:
      'No Primeiro Trono Tripartido, o fogo primordial da cratera alimenta as bigornas celestiais da Ordem Solar.',
    deckId: 'deck_dual_draconic_pact',
  },
  {
    id: 'boss_stage_16_umbral_conclave',
    stage: 16,
    name: 'Nocturna & Vael, Conclave Umbral',
    title: 'Ato V • Senhores do Eclipse Psíquico',
    domains: ['blue', 'purple', 'gold'],
    avatarCardId: 'purple_06_tirano_ocular',
    startingHp: 78,
    passiveName: 'Véu de Estase e Sombra',
    passiveDescription:
      'Combina armadilhas de Retaguarda, congelamento temporal e dreno constante de Essência.',
    rewardGold: 820,
    loreIntro:
      'No Segundo Trono Tripartido, cada pensamento é vigiado pelos olhos abissais e pelas engrenagens do tempo.',
    deckId: 'deck_dual_abyssal_storm',
  },
  {
    id: 'boss_stage_17_primal_cataclysm',
    stage: 17,
    name: 'Gorgoroth, O Cataclismo Selvagem',
    title: 'Ato V • Behemoth das Três Matas',
    domains: ['green', 'red', 'purple'],
    avatarCardId: 'green_09_hidra',
    startingHp: 80,
    passiveName: 'Rugido de Sangue e Espinhos',
    passiveDescription:
      'Inunda as 6 colunas com feras de Atropelar, Regeneração e Renascer da Cripta.',
    rewardGold: 860,
    loreIntro:
      'A própria terra se parte quando a Hidra Ancestral desperta as raízes famintas do Subterrâneo.',
    deckId: 'deck_green_wild',
  },
  {
    id: 'boss_stage_18_celestial_inquisition',
    stage: 18,
    name: 'Seraphiel, Supremo Inquisidor Astral',
    title: 'Ato V • Guardião das Dezesseis Relíquias',
    domains: ['gold', 'blue', 'red'],
    avatarCardId: 'gold_09_serafim_solar',
    startingHp: 82,
    passiveName: 'Julgamento das Estrelas',
    passiveDescription:
      'Comanda Serafins com Voo, Escudo Divino e uma linha inteira de Relíquias Imperiais.',
    rewardGold: 900,
    loreIntro:
      'Acima do firmamento, o Tribunal Tripartido pronuncia sua sentença em chamas e relâmpagos dourados.',
    deckId: 'deck_gold_bastion',
  },
  {
    id: 'boss_stage_19_archlich_void',
    stage: 19,
    name: 'Morgath-Zul, Arqui-Lich das Eras',
    title: 'Ato V • Devorador de Cronologias',
    domains: ['purple', 'blue', 'green'],
    avatarCardId: 'purple_07_lich',
    startingHp: 85,
    passiveName: 'Ampulheta da Não-Vida',
    passiveDescription:
      'Congela a Vanguarda, revive titãs da Cripta e pune qualquer tentativa de empilhamento descuidado.',
    rewardGold: 950,
    loreIntro:
      'Penúltimo guardião dos Tronos Tripartidos, Morgath-Zul fundiu a necromancia ao próprio fluxo temporal.',
    deckId: 'deck_purple_abyss',
  },
  {
    id: 'boss_stage_20_omega_valkyra',
    stage: 20,
    name: 'Valkyra Ômega, A Soberana dos 30 Pactos',
    title: 'Ato V • Deidade Absoluta do Pacto Cromático',
    domains: ['red', 'blue', 'purple', 'green', 'gold'],
    avatarCardId: 'neutral_10_valkyra_pentacromatica',
    startingHp: 90,
    passiveName: 'Onipotência Pentacromática',
    passiveDescription:
      'Domina as 5 Expansões de Domínio, comanda lendas de todos os elementos e exige domínio tático absoluto!',
    rewardGold: 1500,
    loreIntro:
      'No ápice do Ato V, todos os Tronos Tripartidos curvam-se diante da forma final de Valkyra. Prove ser o verdadeiro Soberano Supremo!',
    deckId: 'deck_spec_pentachromatic',
  },
];

function getActInfoForStage(stage: number): { actLabel: string; actTitle: string } {
  if (stage <= 4) {
    return { actLabel: 'ATO I', actTitle: 'As Fronteiras Despertas (Estágios 1–4)' };
  }
  if (stage <= 8) {
    return { actLabel: 'ATO II', actTitle: 'Os Pactos Dualistas (Estágios 5–8)' };
  }
  if (stage <= 12) {
    return { actLabel: 'ATO III', actTitle: 'Os Tronos Ancestrais (Estágios 9–12)' };
  }
  if (stage <= 14) {
    return { actLabel: 'ATO IV', actTitle: 'A Convergência do Tempo (Estágios 13–14)' };
  }
  return { actLabel: 'ATO V', actTitle: 'Os Tronos Tripartidos (Estágios 15–20)' };
}

export const CampaignView: React.FC<CampaignViewProps> = ({
  defeatedBossIds,
  customDecks,
  onStartBossBattle,
}) => {
  const fullBossRoster: CampaignBoss[] = useMemo(() => {
    if (CAMPAIGN_BOSSES.length >= 20) {
      return CAMPAIGN_BOSSES;
    }
    const existingStages = new Set(CAMPAIGN_BOSSES.map((b) => b.stage));
    const extras = FALLBACK_ACT_V_BOSSES.filter((fb) => !existingStages.has(fb.stage));
    return [...CAMPAIGN_BOSSES, ...extras].sort((a, b) => a.stage - b.stage);
  }, []);

  const [selectedDeckId, setSelectedDeckId] = useState<string>(
    PREBUILT_DECKS[0]?.id ?? 'deck_red_inferno'
  );
  const [selectedBossId, setSelectedBossId] = useState<string>(
    fullBossRoster[0]?.id ?? 'boss_1'
  );
  const [actFilter, setActFilter] = useState<'all' | 1 | 2 | 3 | 4 | 5>('all');
  const [inspectCard, setInspectCard] = useState<CardDefinition | null>(null);
  const [showTacticalGuideModal, setShowTacticalGuideModal] = useState<boolean>(false);

  const getSelectedDeckCardIds = (): string[] => {
    const prebuilt = PREBUILT_DECKS.find((d) => d.id === selectedDeckId);
    if (prebuilt) return prebuilt.cardIds;
    const custom = customDecks.find((cd) => cd.id === selectedDeckId);
    if (custom) return custom.cardIds;
    return PREBUILT_DECKS[0]?.cardIds ?? [];
  };

  const filteredRoster = useMemo(() => {
    if (actFilter === 'all') return fullBossRoster;
    return fullBossRoster.filter((b) => {
      if (actFilter === 1) return b.stage >= 1 && b.stage <= 4;
      if (actFilter === 2) return b.stage >= 5 && b.stage <= 8;
      if (actFilter === 3) return b.stage >= 9 && b.stage <= 12;
      if (actFilter === 4) return b.stage >= 13 && b.stage <= 14;
      return b.stage >= 15 && b.stage <= 20;
    });
  }, [fullBossRoster, actFilter]);

  const activeBoss =
    fullBossRoster.find((b) => b.id === selectedBossId) ?? fullBossRoster[0];
  const activeBossCard = activeBoss ? CARDS_BY_ID[activeBoss.avatarCardId] : undefined;
  const activePrimaryDomain = activeBoss?.domains[0] ?? 'neutral';
  const activeActInfo = activeBoss
    ? getActInfoForStage(activeBoss.stage)
    : { actLabel: 'ATO I', actTitle: '' };

  const pct = Math.min(
    100,
    Math.round((defeatedBossIds.length / Math.max(1, fullBossRoster.length)) * 100)
  );

  return (
    <div className="aaa-page-shell">
      {/* Compact Header & Deck Picker */}
      <header className="aaa-page-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="aaa-kicker">
            CRÔNICAS DO PACTO CROMÁTICO • 5 ATOS • 20 CHEFES • 30 DECKS
          </div>
          <h1 className="aaa-page-title font-cinzel">Desafio dos 20 Soberanos</h1>
        </div>

        <div className="aaa-header-actions" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
          <div className="aaa-stat-block">
            <span className="aaa-stat-label">PROGRESSO</span>
            <span className="aaa-stat-val gold-text">
              {defeatedBossIds.length}/{fullBossRoster.length} ({pct}%)
            </span>
          </div>

          <div className="aaa-deck-picker-inline">
            <span className="aaa-stat-label">SEU GRIMÓRIO</span>
            <select
              value={selectedDeckId}
              onChange={(e) => setSelectedDeckId(e.target.value)}
              className="aaa-select"
            >
              <optgroup label={`${PREBUILT_DECKS.length} Decks Oficiais (30 Grimórios)`}>
                {PREBUILT_DECKS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.subtitle})
                  </option>
                ))}
              </optgroup>
              {customDecks.length > 0 && (
                <optgroup label="Decks Personalizados">
                  {customDecks.map((cd) => (
                    <option key={cd.id} value={cd.id}>
                      ★ {cd.name} ({cd.cardIds.length})
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>

          <button
            type="button"
            className="btn-fantasy btn-fantasy-primary"
            onClick={() => setShowTacticalGuideModal(true)}
          >
            📐 Guia Tático / Como Vencer o Chefe
          </button>
        </div>
      </header>

      {/* Act Filter Tabs (Ato I .. Ato V — Os Tronos Tripartidos) */}
      <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
        {(
          [
            { id: 'all', label: `Todos os 20 Estágios` },
            { id: 1, label: 'Ato I: Fronteiras (1–4)' },
            { id: 2, label: 'Ato II: Dualistas (5–8)' },
            { id: 3, label: 'Ato III: Ancestrais (9–12)' },
            { id: 4, label: 'Ato IV: Tempo (13–14)' },
            { id: 5, label: '🔥 Ato V: Os Tronos Tripartidos (15–20)' },
          ] as const
        ).map((tab) => (
          <button
            key={String(tab.id)}
            type="button"
            className={`nav-tab-btn ${actFilter === tab.id ? 'active' : ''}`}
            onClick={() => setActFilter(tab.id)}
            style={{ padding: '0.36rem 0.85rem', fontSize: '0.73rem' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Master-Detail Split Layout */}
      <div className="aaa-campaign-workspace">
        {/* Left Column: Clean 20-Stage Roster List */}
        <aside className="aaa-boss-roster">
          {filteredRoster.map((boss) => {
            const isDefeated = defeatedBossIds.includes(boss.id);
            const isSelected = boss.id === activeBoss?.id;
            const avatar = CARDS_BY_ID[boss.avatarCardId];
            const dom = boss.domains[0] ?? 'neutral';
            const actInfo = getActInfoForStage(boss.stage);

            return (
              <div
                key={boss.id}
                onClick={() => setSelectedBossId(boss.id)}
                className={`aaa-boss-row ${isSelected ? 'is-selected' : ''} ${
                  isDefeated ? 'is-defeated' : ''
                }`}
              >
                <div
                  className="aaa-boss-row-accent"
                  style={{ backgroundColor: DOMAIN_META[dom].color }}
                />
                <div className="aaa-boss-row-thumb">
                  {avatar?.imagePath && <img src={avatar.imagePath} alt={boss.name} />}
                </div>
                <div className="aaa-boss-row-info">
                  <div className="aaa-boss-row-top">
                    <span className="aaa-boss-stage-num">
                      {actInfo.actLabel} • ESTÁGIO {boss.stage}
                    </span>
                    {isDefeated && <span className="aaa-boss-cleared-tag">CONCLUÍDO</span>}
                  </div>
                  <div className="font-cinzel aaa-boss-row-name">{boss.name}</div>
                  <div className="aaa-boss-row-sub">{boss.title}</div>
                </div>
                <div className="aaa-boss-row-stats">
                  <span>{boss.startingHp} PV</span>
                  <span className="gold-text">+{boss.rewardGold}</span>
                </div>
              </div>
            );
          })}
        </aside>

        {/* Right Column: Selected Boss Cinematic Dossier */}
        {activeBoss && (
          <section
            className="aaa-boss-dossier"
            style={
              {
                '--boss-accent': DOMAIN_META[activePrimaryDomain].color,
              } as React.CSSProperties
            }
          >
            <div className="aaa-dossier-visual">
              {activeBossCard?.imagePath && (
                <img
                  src={activeBossCard.imagePath}
                  alt={activeBoss.name}
                  className="aaa-dossier-portrait"
                  onClick={() => setInspectCard(activeBossCard)}
                />
              )}
              <div className="aaa-dossier-vignette" />
            </div>

            <div className="aaa-dossier-content">
              <div className="aaa-dossier-meta-row">
                <span className="aaa-dossier-stage-pill">
                  {activeActInfo.actLabel} ({activeActInfo.actTitle}) • ESTÁGIO {activeBoss.stage} DE{' '}
                  {fullBossRoster.length}
                </span>
                <div className="aaa-dossier-domains">
                  {activeBoss.domains.map((dom) => (
                    <span
                      key={dom}
                      className="aaa-domain-tag"
                      style={{ borderColor: DOMAIN_META[dom].color }}
                    >
                      <i
                        className="aaa-domain-dot"
                        style={{ backgroundColor: DOMAIN_META[dom].color }}
                      />
                      {DOMAIN_META[dom].name}
                    </span>
                  ))}
                </div>
              </div>

              <h2 className="font-cinzel aaa-dossier-title">{activeBoss.name}</h2>
              <div className="aaa-dossier-subtitle">{activeBoss.title}</div>

              <div className="aaa-dossier-metrics">
                <div className="aaa-metric-box">
                  <span className="aaa-metric-lbl">VIDA INICIAL DO SOBERANO</span>
                  <span className="aaa-metric-val">{activeBoss.startingHp} PV</span>
                </div>
                <div className="aaa-metric-box">
                  <span className="aaa-metric-lbl">RECOMPENSA DE VITÓRIA</span>
                  <span className="aaa-metric-val gold-text">+{activeBoss.rewardGold} OURO</span>
                </div>
                <div className="aaa-metric-box">
                  <span className="aaa-metric-lbl">STATUS</span>
                  <span className="aaa-metric-val">
                    {defeatedBossIds.includes(activeBoss.id) ? 'DERROTADO' : 'EM ABERTO'}
                  </span>
                </div>
              </div>

              <div className="aaa-dossier-passive-panel">
                <div className="aaa-passive-kicker">
                  AURA SOBERANA • {activeBoss.passiveName.toUpperCase()}
                </div>
                <p className="aaa-passive-desc">{activeBoss.passiveDescription}</p>
              </div>

              <blockquote className="aaa-dossier-lore">“{activeBoss.loreIntro}”</blockquote>

              <div className="aaa-dossier-actions" style={{ flexWrap: 'wrap', gap: '0.65rem' }}>
                <button
                  type="button"
                  className="aaa-btn aaa-btn-primary aaa-btn-lg"
                  onClick={() => onStartBossBattle(activeBoss, getSelectedDeckCardIds())}
                >
                  INICIAR CONFRONTO CONTRA {activeBoss.name.toUpperCase()}
                </button>
                <button
                  type="button"
                  className="aaa-btn aaa-btn-secondary"
                  onClick={() => setShowTacticalGuideModal(true)}
                >
                  📐 Como Vencer {activeBoss.name}
                </button>
                {activeBossCard && (
                  <button
                    type="button"
                    className="aaa-btn aaa-btn-ghost"
                    onClick={() => setInspectCard(activeBossCard)}
                  >
                    Inspecionar Carta-Chefe
                  </button>
                )}
              </div>
            </div>
          </section>
        )}
      </div>

      {showTacticalGuideModal && activeBoss && (
        <TacticalGuideView
          customDecks={customDecks}
          initialPlayerDeckId={selectedDeckId}
          initialOpponentDeckId={activeBoss.deckId}
          isModal={true}
          onClose={() => setShowTacticalGuideModal(false)}
        />
      )}

      {inspectCard && (
        <CardInspectModal card={inspectCard} onClose={() => setInspectCard(null)} />
      )}
    </div>
  );
};
