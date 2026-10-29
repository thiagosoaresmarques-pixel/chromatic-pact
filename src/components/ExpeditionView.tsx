import React, { useState, useEffect, useMemo } from 'react';
import { CampaignBoss, CardDefinition, CardType, Domain } from '../types/game';
import { ALL_CARDS, CARDS_BY_ID } from '../data/cards';
import { PREBUILT_DECKS } from '../data/decks';
import { playSfx } from '../utils/soundEngine';
import { VICTORY_GOLD_REWARD } from '../utils/multiplayerEngine';
import { CardView, CardInspectModal, DOMAIN_META, CARD_TYPE_LABELS } from './CardView';
import { CustomSavedDeck } from './BattleArena';

export interface SovereignBlessing {
  id: 'forge_crown' | 'dragon_blood' | 'arcane_conclave' | 'immortal_phalanx';
  name: string;
  kicker: string;
  icon: string;
  accent: string;
  description: string;
  tacticalTip: string;
  preferredDomains: Domain[];
}

export const SOVEREIGN_BLESSINGS: SovereignBlessing[] = [
  {
    id: 'forge_crown',
    name: 'Coroa da Forja',
    kicker: 'BÊNÇÃO DAS RELÍQUIAS & FERRO',
    icon: '⚒️',
    accent: '#f59e0b',
    description:
      'Relíquias custam -1 de Essência e curam +1 PV do Soberano ao entrar. Pacotes do Draft têm maior chance de Relíquias e Guardiões.',
    tacticalTip:
      'Empilhe Relíquias na Retaguarda atrás de Guardiões blindados para gerar valor infinito.',
    preferredDomains: ['gold', 'blue'],
  },
  {
    id: 'dragon_blood',
    name: 'Sangue Dracônico',
    kicker: 'BÊNÇÃO DO SOPRO & FÚRIA',
    icon: '🐉',
    accent: '#ef4444',
    description:
      'Unidades com Ímpeto ou Sopro Elemental recebem +1 ATQ ofensivo. Pacotes do Draft priorizam Dragões e Feras de Assalto.',
    tacticalTip:
      'Varra colunas empilhadas com Sopro Elemental e invada colunas abertas para abates rápidos.',
    preferredDomains: ['red', 'green'],
  },
  {
    id: 'arcane_conclave',
    name: 'Conclave Arcano',
    kicker: 'BÊNÇÃO DA TEMPESTADE & RUNAS',
    icon: '⚡',
    accent: '#38bdf8',
    description:
      'Comece cada duelo com +1 de Essência Máxima adicional e feitiços de alto impacto nos pacotes do Draft.',
    tacticalTip:
      'Use sua vantagem de mana no Turno 1 para paralisar a Vanguarda inimiga e armar Emboscadas.',
    preferredDomains: ['blue', 'purple'],
  },
  {
    id: 'immortal_phalanx',
    name: 'Falange Imortal',
    kicker: 'BÊNÇÃO DA CRIPTA & BALUARTE',
    icon: '🛡️',
    accent: '#10b981',
    description:
      'A primeira unidade de cada coluna ganha +1 Armadura e unidades com Renascer/Regeneração aparecem com frequência no Draft.',
    tacticalTip:
      'Ideal para empilhamento 3x por slot: seu líder de coluna absorve o impacto enquanto a pilha contra-ataca.',
    preferredDomains: ['green', 'purple', 'gold'],
  },
];

interface DraftPackBucket {
  id: string;
  title: string;
  subtitle: string;
  domain: Domain;
  cards: CardDefinition[];
}

interface ExpeditionRunState {
  phase: 'blessing' | 'draft' | 'trail' | 'completed';
  blessingId: SovereignBlessing['id'] | null;
  draftRound: number; // 1 to 20
  deckCardIds: string[];
  currentStage: number; // 1 to 7
  clearedStages: number[];
  lootPending: boolean;
  totalGoldEarned: number;
}

const EXPEDITION_STORAGE_KEY = 'chromatic_pact_expedition_v1';

const EXPEDITION_STAGES: CampaignBoss[] = [
  {
    id: 'exp_boss_1',
    stage: 1,
    name: 'Rastejador da Fenda Umbral',
    title: 'Guardião do Limiar (Etapa 1/7)',
    domains: ['green'],
    avatarCardId: 'green_03_ursogrifo',
    startingHp: 38,
    passiveName: 'Fome da Fronteira',
    passiveDescription: 'Enxame veloz de feras que testa a defesa das suas colunas iniciais.',
    rewardGold: 120,
    loreIntro: 'A primeira fenda do Vazio se abre na floresta petrificada.',
    deckId: 'deck_green_wild',
  },
  {
    id: 'exp_boss_2',
    stage: 2,
    name: 'Magus Kaelen do Vórtex',
    title: 'Tecelão de Relâmpagos (Etapa 2/7)',
    domains: ['blue', 'red'],
    avatarCardId: 'blue_06_dragao_azul',
    startingHp: 44,
    passiveName: 'Ressonância Rúnica',
    passiveDescription: 'Dispara feitiços de congelamento e raios em cadeia contra slots agrupados.',
    rewardGold: 160,
    loreIntro: 'Torres flutuantes de cristal faiscam no horizonte do Vazio.',
    deckId: 'deck_blue_tempest',
  },
  {
    id: 'exp_boss_3',
    stage: 3,
    name: 'Forjador-Mor Vaelgor',
    title: 'Senhor dos Autômatos Solares (Etapa 3/7)',
    domains: ['gold', 'red'],
    avatarCardId: 'gold_07_dragao_ouro',
    startingHp: 50,
    passiveName: 'Bigorna Eterna',
    passiveDescription: 'Posiciona Relíquias na Retaguarda e Golems com Armadura pesada.',
    rewardGold: 210,
    loreIntro: 'As forjas abandonadas do Vazio ainda batem em ritmo de guerra.',
    deckId: 'deck_gold_bastion',
  },
  {
    id: 'exp_boss_4',
    stage: 4,
    name: 'Sacerdotisa Nyx da Cripta',
    title: ' Dama dos Ecos Abissais (Etapa 4/7)',
    domains: ['purple', 'blue'],
    avatarCardId: 'purple_07_lich',
    startingHp: 55,
    passiveName: 'Eco dos Caídos',
    passiveDescription: 'Recicla criaturas com Renascer e drena a vitalidade do seu Soberano.',
    rewardGold: 260,
    loreIntro: 'Os guerreiros que caíram nas expedições passadas erguem-se contra você.',
    deckId: 'deck_purple_abyss',
  },
  {
    id: 'exp_boss_5',
    stage: 5,
    name: 'Ignis-Vोर, Devorador de Crateras',
    title: 'Tirano Dracônico do Vazio (Etapa 5/7)',
    domains: ['red', 'gold'],
    avatarCardId: 'red_08_dragao_vermelho',
    startingHp: 62,
    passiveName: 'Sopro Cataclísmico',
    passiveDescription: 'Dragões ancestrais que varrem fileiras inteiras com Sopro Elemental.',
    rewardGold: 320,
    loreIntro: 'O calor do núcleo planar derrete até mesmo os escudos mais espessos.',
    deckId: 'deck_dual_draconic_pact',
  },
  {
    id: 'exp_boss_6',
    stage: 6,
    name: 'Chronos-Vael, Juiz das Eras',
    title: 'Regente do Relógio Quebrado (Etapa 6/7)',
    domains: ['blue', 'gold', 'purple'],
    avatarCardId: 'blue_80_senhor_tempo',
    startingHp: 68,
    passiveName: 'Paradoxo Temporal',
    passiveDescription: 'Congela a Vanguarda e comanda 10 Relíquias temporais na Retaguarda.',
    rewardGold: 400,
    loreIntro: 'Faltando um passo para o coração do Vazio, o próprio tempo tenta detê-lo.',
    deckId: 'deck_spec_chronomancer',
  },
  {
    id: 'exp_boss_7',
    stage: 7,
    name: 'Valkyra do Eclipsar Pentacromático',
    title: 'Soberana Suprema da Expedição (Etapa Final 7/7)',
    domains: ['red', 'blue', 'purple', 'green', 'gold'],
    avatarCardId: 'neutral_10_valkyra_pentacromatica',
    startingHp: 76,
    passiveName: 'Convergência do Vazio',
    passiveDescription: 'Domina os 5 Domínios simultaneamente com lendas de todas as cores.',
    rewardGold: 600,
    loreIntro: 'No trono despedaçado do Vazio, as cinco tormentas aguardam seu desafio final!',
    deckId: 'deck_spec_pentachromatic',
  },
];

const PACK_ARCHETYPES: {
  title: string;
  subtitle: string;
  domain: Domain;
  filter: (c: CardDefinition) => boolean;
}[] = [
  {
    title: 'Escamas da Cratera',
    subtitle: 'Dragões, Sopro Elemental & Piroclasmos',
    domain: 'red',
    filter: (c) => c.domain === 'red' || (c.breathDamage ?? 0) > 0,
  },
  {
    title: 'Conclave Cronomante',
    subtitle: 'Congelamento, Voo & Feitiços Rúnicos',
    domain: 'blue',
    filter: (c) => c.domain === 'blue' || c.type === 'spell',
  },
  {
    title: 'Legião do Sol Negro',
    subtitle: 'Renascer, Dreno de Vida & Toque Letal',
    domain: 'purple',
    filter: (c) => c.domain === 'purple' || c.keywords.includes('Renascer'),
  },
  {
    title: 'Matilha Primordial',
    subtitle: 'Feras Colossais, Atropelar & Regeneração',
    domain: 'green',
    filter: (c) => c.domain === 'green' || c.keywords.includes('Atropelar'),
  },
  {
    title: 'Baluarte & Relíquias',
    subtitle: 'Guardiões, Escudo Divino & Relíquias Contínuas',
    domain: 'gold',
    filter: (c) => c.domain === 'gold' || c.type === 'relic',
  },
  {
    title: 'Rede de Emboscadas',
    subtitle: 'Reações de Retaguarda, Alcance & Precisão',
    domain: 'neutral',
    filter: (c) =>
      c.type === 'reaction' || c.keywords.includes('Alcance') || c.domain === 'neutral',
  },
];

function generateThreeDraftBuckets(
  round: number,
  blessingId: SovereignBlessing['id'] | null
): DraftPackBucket[] {
  const blessing = SOVEREIGN_BLESSINGS.find((b) => b.id === blessingId);
  const shuffledArchetypes = [...PACK_ARCHETYPES].sort(() => Math.random() - 0.5);

  // Ensure at least one bucket matches the blessing's preferred domain
  if (blessing) {
    const prefIdx = shuffledArchetypes.findIndex((a) =>
      blessing.preferredDomains.includes(a.domain)
    );
    if (prefIdx > 0) {
      const [item] = shuffledArchetypes.splice(prefIdx, 1);
      shuffledArchetypes.unshift(item);
    }
  }

  return shuffledArchetypes.slice(0, 3).map((arch, idx) => {
    const pool = ALL_CARDS.filter(arch.filter);
    const safePool = pool.length >= 10 ? pool : ALL_CARDS;
    const lowCurve = safePool.filter((c) => c.cost <= 3);
    const midCurve = safePool.filter((c) => c.cost === 4 || c.cost === 5);
    const highCurve = safePool.filter((c) => c.cost >= 6 || c.rarity === 'legendary');

    const pick = (arr: CardDefinition[]) =>
      (arr.length > 0 ? arr : safePool)[
        Math.floor(Math.random() * (arr.length > 0 ? arr.length : safePool.length))
      ];

    const packCards: CardDefinition[] = [
      pick(lowCurve),
      pick(lowCurve),
      pick(midCurve),
      pick(midCurve),
      pick(highCurve),
    ];

    return {
      id: `bucket_${round}_${idx}_${Date.now()}`,
      title: arch.title,
      subtitle: arch.subtitle,
      domain: arch.domain,
      cards: packCards,
    };
  });
}

export interface ExpeditionViewProps {
  onStartExpeditionBattle: (boss: CampaignBoss, playerDeckIds: string[]) => void;
  onSaveCustomDeck: (deck: CustomSavedDeck) => void;
  onRewardGold: (amount: number) => void;
  lastClearedExpeditionBossId?: string | null;
  isGuest?: boolean;
  onRequireAccount?: () => void;
}

export const ExpeditionView: React.FC<ExpeditionViewProps> = ({
  onStartExpeditionBattle,
  onSaveCustomDeck,
  onRewardGold: _onRewardGold,
  lastClearedExpeditionBossId,
  isGuest = false,
  onRequireAccount,
}) => {
  const [runState, setRunState] = useState<ExpeditionRunState>(() => {
    try {
      const saved = localStorage.getItem(EXPEDITION_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore parse error
    }
    return {
      phase: 'blessing',
      blessingId: null,
      draftRound: 1,
      deckCardIds: [],
      currentStage: 1,
      clearedStages: [],
      lootPending: false,
      totalGoldEarned: 0,
    };
  });

  const [draftBuckets, setDraftBuckets] = useState<DraftPackBucket[]>(() =>
    generateThreeDraftBuckets(1, null)
  );
  const [lootChoices, setLootChoices] = useState<CardDefinition[]>([]);
  const [inspectCard, setInspectCard] = useState<CardDefinition | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(EXPEDITION_STORAGE_KEY, JSON.stringify(runState));
    } catch {
      // Ignore storage error
    }
  }, [runState]);

  // Check if player just returned victorious from an Expedition boss battle
  useEffect(() => {
    if (!lastClearedExpeditionBossId) return;
    const boss = EXPEDITION_STAGES.find((b) => b.id === lastClearedExpeditionBossId);
    if (!boss) return;

    setRunState((prev) => {
      if (prev.clearedStages.includes(boss.stage)) return prev;
      const nextCleared = [...prev.clearedStages, boss.stage];
      const isAllCleared = nextCleared.length >= 7;
      // Generate 3 rare/legendary loot upgrade options
      const highTier = ALL_CARDS.filter((c) => c.rarity === 'legendary' || c.rarity === 'rare');
      const picks: CardDefinition[] = [];
      for (let i = 0; i < 3; i += 1) {
        picks.push(highTier[Math.floor(Math.random() * highTier.length)] ?? ALL_CARDS[i]);
      }
      setLootChoices(picks);

      return {
        ...prev,
        phase: isAllCleared ? 'completed' : 'trail',
        clearedStages: nextCleared,
        currentStage: Math.min(7, boss.stage + 1),
        lootPending: !isAllCleared,
        totalGoldEarned: prev.totalGoldEarned + VICTORY_GOLD_REWARD,
      };
    });
  }, [lastClearedExpeditionBossId]);

  const activeBlessing = useMemo(
    () => SOVEREIGN_BLESSINGS.find((b) => b.id === runState.blessingId) ?? null,
    [runState.blessingId]
  );

  // Live Expedition Deck Stats
  const deckStats = useMemo(() => {
    const cards = runState.deckCardIds
      .map((id) => CARDS_BY_ID[id])
      .filter((c): c is CardDefinition => Boolean(c));
    const counts: Record<CardType, number> = {
      creature: 0,
      spell: 0,
      reaction: 0,
      relic: 0,
    };
    const curve: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };
    for (const c of cards) {
      counts[c.type] += 1;
      const b = Math.min(7, Math.max(1, c.cost));
      curve[b] = (curve[b] ?? 0) + 1;
    }
    const maxCurve = Math.max(1, ...Object.values(curve));
    return { cards, counts, curve, maxCurve };
  }, [runState.deckCardIds]);

  const handleSelectBlessing = (blessing: SovereignBlessing) => {
    if (isGuest) {
      onRequireAccount?.();
      return;
    }
    playSfx('ascend');
    setDraftBuckets(generateThreeDraftBuckets(1, blessing.id));
    setRunState({
      phase: 'draft',
      blessingId: blessing.id,
      draftRound: 1,
      deckCardIds: [],
      currentStage: 1,
      clearedStages: [],
      lootPending: false,
      totalGoldEarned: 0,
    });
  };

  const handlePickBucket = (bucket: DraftPackBucket) => {
    playSfx('draw');
    const addedIds = bucket.cards.map((c) => c.id);
    const nextDeckIds = [...runState.deckCardIds, ...addedIds];
    const nextRound = runState.draftRound + 1;

    if (nextRound > 20 || nextDeckIds.length >= 100) {
      playSfx('victory');
      setRunState((prev) => ({
        ...prev,
        phase: 'trail',
        deckCardIds: nextDeckIds.slice(0, 100),
        draftRound: 20,
      }));
    } else {
      setDraftBuckets(generateThreeDraftBuckets(nextRound, runState.blessingId));
      setRunState((prev) => ({
        ...prev,
        deckCardIds: nextDeckIds,
        draftRound: nextRound,
      }));
    }
  };

  const handleAutoFinishDraft = () => {
    const baseDeck = PREBUILT_DECKS[0]?.cardIds ?? ALL_CARDS.slice(0, 100).map((c) => c.id);
    const combined = [...runState.deckCardIds, ...baseDeck].slice(0, 100);
    playSfx('victory');
    setRunState((prev) => ({
      ...prev,
      phase: 'trail',
      deckCardIds: combined,
      draftRound: 20,
    }));
  };

  const handlePickLootUpgrade = (lootCard: CardDefinition) => {
    playSfx('ascend');
    setRunState((prev) => {
      const nextDeck = [...prev.deckCardIds];
      // Replace a common card if possible, otherwise append/replace first card
      const commonIdx = nextDeck.findIndex((id) => CARDS_BY_ID[id]?.rarity === 'common');
      if (commonIdx !== -1) {
        nextDeck[commonIdx] = lootCard.id;
      } else if (nextDeck.length > 0) {
        nextDeck[0] = lootCard.id;
      }
      return {
        ...prev,
        deckCardIds: nextDeck,
        lootPending: false,
      };
    });
    setToastMsg(`✨ [${lootCard.name}] foi adicionada ao seu Grimório da Expedição!`);
    setTimeout(() => setToastMsg(null), 3200);
  };

  const handleSaveExpeditionDeckToGrimoire = () => {
    if (runState.deckCardIds.length < 40) return;
    const name = `Expedição: ${activeBlessing?.name ?? 'Vazio'}`;
    onSaveCustomDeck({
      id: `exp_custom_${Date.now()}`,
      name,
      cardIds: runState.deckCardIds.slice(0, 100),
    });
    setToastMsg(`Grimório "${name}" salvo nos seus Decks Personalizados!`);
    setTimeout(() => setToastMsg(null), 3200);
  };

  const handleRestartExpedition = () => {
    setRunState({
      phase: 'blessing',
      blessingId: null,
      draftRound: 1,
      deckCardIds: [],
      currentStage: 1,
      clearedStages: [],
      lootPending: false,
      totalGoldEarned: 0,
    });
  };

  const currentBoss =
    EXPEDITION_STAGES.find((b) => b.stage === runState.currentStage) ?? EXPEDITION_STAGES[0];

  return (
    <div className="aaa-page-shell">
      {/* Compact Status Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.65rem',
          flexWrap: 'wrap',
          padding: '8px 12px',
          background: '#0b0f17',
          border: '1px solid rgba(148, 163, 184, 0.18)',
          borderRadius: 8,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          <span className="font-cinzel" style={{ fontSize: '0.9rem', fontWeight: 800, color: '#e6c875' }}>
            Expedição do Vazio
          </span>
          {activeBlessing && (
            <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
              Bênção: <strong style={{ color: '#e6c875' }}>{activeBlessing.name}</strong>
            </span>
          )}
          <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
            Deck: <strong>{runState.deckCardIds.length}/100</strong>
          </span>
          <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
            Etapa: <strong>{runState.clearedStages.length}/7</strong>
          </span>
        </div>

        {runState.phase !== 'blessing' && (
          <button
            type="button"
            className="btn-fantasy btn-fantasy-danger"
            style={{ padding: '4px 10px', fontSize: '0.72rem' }}
            onClick={handleRestartExpedition}
          >
            Nova Expedição
          </button>
        )}
      </div>

      {toastMsg && <div className="aaa-toast-banner">{toastMsg}</div>}

      {/* =====================================================================
          STEP 1: CHOOSE 1 OF 4 SOVEREIGN PASSIVE BLESSINGS
          ===================================================================== */}
      {runState.phase === 'blessing' && (
        <div className="exp-step-container">
          <div className="exp-blessings-grid">
            {SOVEREIGN_BLESSINGS.map((b) => (
              <div
                key={b.id}
                className="exp-blessing-card"
                onClick={() => handleSelectBlessing(b)}
              >
                <div className="exp-blessing-top">
                  <span className="exp-blessing-icon">{b.icon}</span>
                  <span className="aaa-kicker">
                    {b.kicker}
                  </span>
                </div>
                <h3 className="font-cinzel exp-blessing-title">{b.name}</h3>
                <p className="exp-blessing-desc">{b.description}</p>
                <button type="button" className="aaa-btn aaa-btn-primary" style={{ marginTop: 'auto' }}>
                  Escolher {b.name} →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          STEP 2: 16-ROUND TACTICAL BUCKET DRAFT (1 OF 3 PACKS OF 5 CARDS = 80 CARDS)
          ===================================================================== */}
      {runState.phase === 'draft' && (
        <div className="exp-draft-workspace">
          <div className="exp-draft-main">
            <div className="exp-draft-header-bar">
              <div>
                <h2 className="font-cinzel" style={{ fontSize: '1.1rem', color: '#f8fafc', margin: 0 }}>
                  Draft {runState.draftRound}/20 — Escolha 1 Pacote (+5 Cartas)
                </h2>
              </div>
              <button
                type="button"
                className="btn-fantasy"
                onClick={handleAutoFinishDraft}
              >
                ⚡ Completar Draft
              </button>
            </div>

            <div className="exp-buckets-grid">
              {draftBuckets.map((bucket) => (
                <div key={bucket.id} className="exp-bucket-card">
                  <div className="exp-bucket-header">
                    <div>
                      <span className="aaa-kicker">
                        {DOMAIN_META[bucket.domain].icon} {DOMAIN_META[bucket.domain].name}
                      </span>
                      <h3 className="font-cinzel" style={{ fontSize: '1.05rem', color: '#f1f5f9' }}>
                        {bucket.title}
                      </h3>
                      <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{bucket.subtitle}</p>
                    </div>
                  </div>

                  <div className="exp-bucket-cards-list">
                    {bucket.cards.map((c, idx) => (
                      <div
                        key={`${c.id}-${idx}`}
                        className="exp-bucket-card-row"
                        onClick={() => setInspectCard(c)}
                      >
                        <span className="exp-bcr-cost">{c.cost}⚡</span>
                        {c.imagePath && <img src={c.imagePath} alt={c.name} className="exp-bcr-thumb" />}
                        <div className="exp-bcr-info">
                          <div className="exp-bcr-name">{c.name}</div>
                          <div className="exp-bcr-meta">
                            {CARD_TYPE_LABELS[c.type]}
                            {c.type === 'creature' ? ` • ${c.atk}/${c.hp} (ARM ${c.armor})` : ''}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="aaa-btn aaa-btn-primary"
                    style={{ width: '100%', marginTop: '0.75rem' }}
                    onClick={() => handlePickBucket(bucket)}
                  >
                    + Adicionar Pacote (+5 Cartas)
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Live Draft Asymmetry & Curve Sidebar */}
          <aside className="exp-draft-sidebar">
            <div className="aaa-kicker">SEU DECK EM CONSTRUÇÃO</div>
            <h3 className="font-cinzel" style={{ color: '#fde68a', marginBottom: '0.5rem' }}>
              {runState.deckCardIds.length} / 100 Cartas Escolhidas
            </h3>

            <div className="db-metrics-legend" style={{ marginBottom: '0.75rem' }}>
              <span><i className="dot-c" /> {deckStats.counts.creature} Criat.</span>
              <span><i className="dot-s" /> {deckStats.counts.spell} Feit.</span>
              <span><i className="dot-r" /> {deckStats.counts.reaction} Reaç.</span>
              <span><i className="dot-l" /> {deckStats.counts.relic} Relíq.</span>
            </div>

            <div className="db-mini-curve" style={{ marginBottom: '0.9rem' }}>
              {[1, 2, 3, 4, 5, 6, 7].map((bucket) => {
                const cnt = deckStats.curve[bucket] ?? 0;
                const hPct = Math.round((cnt / deckStats.maxCurve) * 100);
                return (
                  <div key={bucket} className="db-curve-col">
                    <span className="db-curve-val">{cnt > 0 ? cnt : ''}</span>
                    <div className="db-curve-track">
                      <div
                        className="db-curve-fill"
                        style={{ height: `${cnt > 0 ? Math.max(14, hPct) : 0}%` }}
                      />
                    </div>
                    <span className="db-curve-lbl">{bucket === 7 ? '7+' : bucket}</span>
                  </div>
                );
              })}
            </div>

            <div className="exp-drafted-scroll">
              {deckStats.cards.map((c, idx) => (
                <div
                  key={`${c.id}-dr-${idx}`}
                  className="db-deck-tile"
                  onClick={() => setInspectCard(c)}
                >
                  <span
                    className="db-tile-domain-bar"
                    style={{ background: DOMAIN_META[c.domain].color }}
                  />
                  <span className="db-tile-cost">{c.cost}</span>
                  <span className="db-tile-name">{c.name}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      )}

      {/* =====================================================================
          STEP 3: 7-BATTLE GAUNTLET TRAIL & BETWEEN-BATTLE LOOT UPGRADES
          ===================================================================== */}
      {(runState.phase === 'trail' || runState.phase === 'completed') && (
        <div className="exp-trail-workspace">
          {/* Loot Upgrade Sanctuary Modal/Banner between battles */}
          {runState.lootPending && lootChoices.length > 0 && (
            <div className="exp-loot-sanctuary">
              <div className="aaa-kicker">ESPÓLIOS DE VITÓRIA • REFORÇO DE GRIMÓRIO</div>
              <h3 className="font-cinzel gold-gradient-text" style={{ fontSize: '1.3rem' }}>
                Escolha 1 Carta Rara ou Lendária para Aprimorar seu Deck da Expedição
              </h3>
              <div className="exp-loot-cards-row">
                {lootChoices.map((card, i) => (
                  <div key={`${card.id}-loot-${i}`} className="exp-loot-choice">
                    <CardView
                      card={card}
                      mode="gallery"
                      onClick={() => handlePickLootUpgrade(card)}
                      onInspect={setInspectCard}
                    />
                    <button
                      type="button"
                      className="btn-fantasy btn-fantasy-primary"
                      onClick={() => handlePickLootUpgrade(card)}
                    >
                      + Integrar ao Deck
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7-Stage Vertical/Horizontal Progress Map */}
          <div className="aaa-campaign-workspace">
            <aside className="aaa-boss-roster">
              {EXPEDITION_STAGES.map((stageBoss) => {
                const isCleared = runState.clearedStages.includes(stageBoss.stage);
                const isCurrent = stageBoss.stage === runState.currentStage;
                const avatar = CARDS_BY_ID[stageBoss.avatarCardId];
                const dom = stageBoss.domains[0] ?? 'neutral';

                return (
                  <div
                    key={stageBoss.id}
                    onClick={() =>
                      setRunState((prev) => ({ ...prev, currentStage: stageBoss.stage }))
                    }
                    className={`aaa-boss-row ${isCurrent ? 'is-selected' : ''} ${
                      isCleared ? 'is-defeated' : ''
                    }`}
                  >
                    <div
                      className="aaa-boss-row-accent"
                      style={{ backgroundColor: DOMAIN_META[dom].color }}
                    />
                    <div className="aaa-boss-row-thumb">
                      {avatar?.imagePath && <img src={avatar.imagePath} alt={stageBoss.name} />}
                    </div>
                    <div className="aaa-boss-row-info">
                      <div className="aaa-boss-row-top">
                        <span className="aaa-boss-stage-num">ETAPA {stageBoss.stage} / 7</span>
                        {isCleared && <span className="aaa-boss-cleared-tag">VENCIDO</span>}
                      </div>
                      <div className="font-cinzel aaa-boss-row-name">{stageBoss.name}</div>
                      <div className="aaa-boss-row-sub">{stageBoss.title}</div>
                    </div>
                    <div className="aaa-boss-row-stats">
                      <span>{stageBoss.startingHp} PV</span>
                      <span className="gold-text">+{VICTORY_GOLD_REWARD}</span>
                    </div>
                  </div>
                );
              })}
            </aside>

            {/* Right Dossier for Selected Expedition Stage */}
            <section className="aaa-boss-dossier">
              <div className="aaa-dossier-content" style={{ padding: '2rem' }}>
                <div className="aaa-dossier-meta-row">
                  <span className="aaa-dossier-stage-pill">
                    PROVAÇÃO {currentBoss.stage} DE 7 • EXPEDIÇÃO DO VAZIO
                  </span>
                  {activeBlessing && (
                    <span
                      className="aaa-domain-tag"
                      style={{ borderColor: activeBlessing.accent, color: activeBlessing.accent }}
                    >
                      {activeBlessing.icon} Bênção: {activeBlessing.name}
                    </span>
                  )}
                </div>

                <h2 className="font-cinzel aaa-dossier-title">{currentBoss.name}</h2>
                <div className="aaa-dossier-subtitle">{currentBoss.title}</div>

                <div className="aaa-dossier-metrics">
                  <div className="aaa-metric-box">
                    <span className="aaa-metric-lbl">VIDA DO CHEFE</span>
                    <span className="aaa-metric-val">{currentBoss.startingHp} PV</span>
                  </div>
                  <div className="aaa-metric-box">
                    <span className="aaa-metric-lbl">RECOMPENSA</span>
                    <span className="aaa-metric-val gold-text">+{VICTORY_GOLD_REWARD} OURO</span>
                  </div>
                  <div className="aaa-metric-box">
                    <span className="aaa-metric-lbl">SEU DECK DRAFTADO</span>
                    <span className="aaa-metric-val">
                      {deckStats.counts.creature}C / {deckStats.counts.spell}M /{' '}
                      {deckStats.counts.reaction}R / {deckStats.counts.relic}Rel
                    </span>
                  </div>
                </div>

                <div className="aaa-dossier-passive-panel">
                  <div className="aaa-passive-kicker">
                    LEI DA FENDA • {currentBoss.passiveName.toUpperCase()}
                  </div>
                  <p className="aaa-passive-desc">{currentBoss.passiveDescription}</p>
                </div>

                <blockquote className="aaa-dossier-lore">“{currentBoss.loreIntro}”</blockquote>

                <div className="aaa-dossier-actions" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
                  <button
                    type="button"
                    className="aaa-btn aaa-btn-primary aaa-btn-lg"
                    onClick={() => onStartExpeditionBattle(currentBoss, runState.deckCardIds)}
                  >
                    INICIAR BATALHA DA ETAPA {currentBoss.stage}/7
                  </button>

                  <button
                    type="button"
                    className="aaa-btn aaa-btn-secondary"
                    onClick={handleSaveExpeditionDeckToGrimoire}
                  >
                    Salvar este Deck no Grimório
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      {inspectCard && (
        <CardInspectModal card={inspectCard} onClose={() => setInspectCard(null)} />
      )}
    </div>
  );
};
