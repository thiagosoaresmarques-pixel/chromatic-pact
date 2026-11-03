import type { TacticalProblem } from './problemsRuntime';

/**
 * PROBLEMAS DOS GRÃO-MESTRES IA (#111–#116)
 * Desafios táticos letais em 1 turno inspirados diretamente nas sinergias e cartas de maior
 * Valor Shapley descobertas pelos Campeões Tier V do Grande Torneio Unificado de Vaeloria (44 × 43).
 */
export const GRANDMASTER_CHAMPION_PROBLEMS: Omit<TacticalProblem, 'number' | 'code'>[] = [
  // ============================================================================
  // #111 — CAMPEÃO #1 GLOBAL: CONCLAVE DA CHAMA CELESTE (tri_red_blue_gold)
  // ============================================================================
  {
    id: 'prob_champ_01_chama_celeste',
    title: 'O Veredito da Chama Celeste',
    subtitle:
      'Campeão #1 Global (Pyros + Vórtex + Solária): Refratar +1⚡ com o Arauto da Supernova, varrer bloqueadores enfraquecidos e amplificar a esquadra aérea com Tambores da Conquista',
    difficulty: 'campeoes_torneio',
    difficultyLabel: '🏆 Grão-Soberanos',
    stars: 5,
    goldReward: 12,
    primaryDomain: 'red',
    mechanicTag: '🏆 #1 Conclave da Chama Celeste • Refração +1⚡ + Voo & Invasão',
    scenarioLore:
      'Inspirado no grimório Campeão #1 Global (75.0% WR): dois Guardiões feridos (2 ❤️ cada, sem Armadura) fecham a Vanguarda rival nas Colunas 2 e 4, protegendo o Soberano inimigo. Você tem apenas 6⚡ de Essência para encaixar uma sequência de 7⚡!',
    objectiveText: 'Derrote o Arconte Rival neste turno usando o combo assinatura do Campeão #1.',
    hint1:
      'O Arauto da Supernova Prismática (5⚡) tem Voo + Ímpeto, causa 2 de dano a toda a Vanguarda inimiga Ao Entrar E refrata +1⚡ de Essência extra neste turno — exatamente o que falta para conjurar Tambores da Conquista (2⚡)!',
    hint2:
      '1º Invoque o Arauto da Supernova Prismática (5⚡ -> sobra 1⚡ + 1⚡ refratada = 2⚡) na Vanguarda da Coluna 2 (apoiado pelo Tecelão Astral na Retaguarda): o impacto varre os dois Guardiões de 2 ❤️ e libera Invasão! 2º Conjure Tambores da Conquista (2⚡) para +2⚔️ em todo o esquadrão! 3º Ataque direto o Soberano rival com o Arauto da Supernova, o Justicar Solar e o Tecelão Astral!',
    solutionSteps: [
      '1. Invoque o Arauto da Supernova Prismática (5⚡) na Vanguarda [V] da Coluna 2 (com Cobertura do Tecelão do Feixe Astral): Ao Entrar, ele incinera os dois Guardiões rivais de 2 ❤️ e refrata +1⚡ (ficando com 2⚡).',
      '2. Conjure Tambores da Conquista (2⚡) para conceder +2⚔️ de ATQ a todos os seus 3 aliados.',
      '3. Ataque o Soberano rival diretamente com o Arauto da Supernova (Col. 2), o Justicar da Aurora (Col. 4) e o Tecelão do Feixe Astral (Retaguarda Col. 2) para o abate exato!',
    ],
    whyIndefensible:
      'Se você conjurar Tambores da Conquista antes do Arauto da Supernova, ficará com apenas 4⚡ (insuficiente para o Arauto de 5⚡) e o Arauto perderá o bônus de +2⚔️!',
    turnNumber: 6,
    p1Name: 'Almirante da Chama Celeste (Você)',
    p1AvatarCardId: 'red_167_arauto_prisma_chama',
    p1Hp: 24,
    p1Essence: 6,
    p1MaxEssence: 6,
    p1Affinities: { red: 4, blue: 3, purple: 0, green: 0, gold: 3, neutral: 0 },
    p1HandCardIds: ['red_167_arauto_prisma_chama', 'red_27_frenesi_batalha'],
    p1DeckTopCardIds: ['gold_80_paladino_destino'],
    p1ChanneledCardIds: [
      'red_01_kobold',
      'blue_168_tecelao_feixe_gelo',
      'gold_80_paladino_destino',
    ],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'blue_168_tecelao_feixe_gelo', row: 'rearguard', slotIndex: 1 },
      { cardId: 'gold_80_paladino_destino', row: 'vanguard', slotIndex: 3 },
    ],
    p2Name: 'Bastião da Geada',
    p2Title: 'Guarnição Invernal',
    p2AvatarCardId: 'blue_170_flagelo_cornudo_gelo',
    p2Domain: 'blue',
    p2Hp: 22,
    p2Essence: 0,
    p2MaxEssence: 6,
    p2Affinities: { red: 0, blue: 4, purple: 0, green: 0, gold: 2, neutral: 0 },
    p2Units: [
      { cardId: 'green_19_guardiao_ursino', row: 'vanguard', slotIndex: 1, damageTaken: 3 },
      { cardId: 'green_19_guardiao_ursino', row: 'vanguard', slotIndex: 3, damageTaken: 3 },
    ],
  },

  // ============================================================================
  // #112 — CAMPEÃO #2 GLOBAL: ARTILHARIA DE MERCÚRIO (dual_red_neutral)
  // ============================================================================
  {
    id: 'prob_champ_02_artilharia_mercurio',
    title: 'Salva Axial de Mercúrio',
    subtitle:
      'Campeão #2 Global (Pyros + Matriz Axial): Gerar +1⚡ com o Mercenário Planar, assassinar o Guardião blindado com Toque Letal e detonar o Núcleo da Fornalha',
    difficulty: 'campeoes_torneio',
    difficultyLabel: '🏆 Grão-Soberanos',
    stars: 5,
    goldReward: 12,
    primaryDomain: 'red',
    mechanicTag: '🏆 #2 Artilharia de Mercúrio • Ímpeto Axial + Toque Letal + Fornalha',
    scenarioLore:
      'Inspirado na Artilharia de Mercúrio (#2 Global • 71.7% WR): um Titã Forjado em Adamantina (7/8, 3🛡️ Armadura, Guardião, mas sem Escudo Divino) bloqueia a Coluna 3, enquanto uma Sentinela de 4 ❤️ guarda a Coluna 5. Você tem 7⚡ para executar 8⚡ de ações!',
    objectiveText: 'Rompa os dois Guardiões e finalize o Soberano rival neste turno.',
    hint1:
      'O Mercenário das Lâminas Planais (2⚡) tem Ímpeto e gera +1⚡ Ao Entrar, elevando seus 7⚡ para 8⚡ (2⚡ + 3⚡ + 3⚡)! E atenção à regra de Grão-Mestre: Toque Letal à distância (Retaguarda) só aplica -1 de veneno — você precisa posicionar a Lâmina Silenciosa na VANGUARDA (corpo-a-corpo) e buffá-la para 4⚔️ antes de atacar os 3🛡️ de Armadura do Titã!',
    hint2:
      '1º Invoque o Mercenário das Lâminas Planais (2⚡ -> gera +1⚡, ficando com 6⚡) na Vanguarda da Coluna 1 (com Cobertura do Altar)! 2º Invoque a Lâmina Silenciosa da Guilda (3⚡ -> sobra 3⚡) na VANGUARDA da Coluna 3! 3º Lance Detonação do Núcleo da Fornalha (3⚡) no Guardião ferido da Coluna 5 (abatendo-o e dando +1⚔️ global — subindo a Lâmina para 4⚔️, suficiente para furar os 3🛡️ do Titã)! 4º Ataque o Titã na Coluna 3 com a Lâmina em corpo-a-corpo (Toque Letal executa na hora!) e finalize o Soberano rival com o Mercenário Planar (Col. 1) e o Corsário Astral (Col. 5)!',
    solutionSteps: [
      '1. Invoque o Mercenário das Lâminas Planais (2⚡) na Vanguarda [V] da Coluna 1 (apoiado pelo Altar Dracônico): Ao Entrar, ele gera +1⚡ (ficando com 6⚡).',
      '2. Invoque a Lâmina Silenciosa da Guilda (3⚡, Ímpeto + Toque Letal) na VANGUARDA [V] da Coluna 3 (em combate corpo-a-corpo o Toque Letal executa qualquer alvo que sofra 1+ de dano!).',
      '3. ANTES de atacar com a Lâmina, lance Detonação do Núcleo da Fornalha (3⚡) no Guardião ferido da Coluna 5: ele é destruído e todos os aliados ganham +1⚔️ (elevando a Lâmina de 3⚔️ para 4⚔️ para perfurar os 3🛡️ de Armadura do Titã!).',
      '4. Ataque o Titã Forjado em Adamantina (Col. 3) com a Lâmina Silenciosa: 4⚔️ - 3🛡️ = 1 de dano líquido em corpo-a-corpo -> Toque Letal executa o Titã!',
      '5. Com ambos os Guardiões eliminados, ataque o Soberano rival com o Mercenário Planar (Col. 1) e o Corsário da Lâmina Prateada (Col. 5) para 12 de dano cravado!',
    ],
    whyIndefensible:
      'Se você puser a Lâmina na Retaguarda, o tiro com Alcance só causa -1 de veneno em vez de executar; e se atacar antes da Detonação da Fornalha, 3⚔️ contra 3🛡️ causa 0 de dano líquido e não ativa o Toque Letal!',
    turnNumber: 6,
    p1Name: 'Artilheiro de Mercúrio (Você)',
    p1AvatarCardId: 'neutral_05_corsario_astral',
    p1Hp: 19,
    p1Essence: 7,
    p1MaxEssence: 7,
    p1Affinities: { red: 4, blue: 0, purple: 0, green: 0, gold: 0, neutral: 4 },
    p1HandCardIds: [
      'neutral_52_mercenario_planar',
      'neutral_02_assassino_guilda',
      'red_140_explosao_fornalha',
    ],
    p1DeckTopCardIds: ['neutral_01_mercenario_veterano'],
    p1ChanneledCardIds: ['red_10_altar_draconico', 'neutral_05_corsario_astral'],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'red_10_altar_draconico', row: 'rearguard', slotIndex: 0 },
      { cardId: 'neutral_05_corsario_astral', row: 'vanguard', slotIndex: 4 },
    ],
    p2Name: 'Arconte Forjador',
    p2Title: 'Senhor da Adamantina',
    p2AvatarCardId: 'neutral_35_colosso_adamantina',
    p2Domain: 'gold',
    p2Hp: 12,
    p2Essence: 0,
    p2MaxEssence: 7,
    p2Affinities: { red: 0, blue: 0, purple: 0, green: 0, gold: 4, neutral: 3 },
    p2Units: [
      { cardId: 'neutral_35_colosso_adamantina', row: 'vanguard', slotIndex: 2 },
      { cardId: 'green_19_guardiao_ursino', row: 'vanguard', slotIndex: 4, damageTaken: 2 },
    ],
  },

  // ============================================================================
  // #113 — CAMPEÃO #3 GLOBAL: CORTE DA LUA SANGRENTA (tri_red_purple_green)
  // ============================================================================
  {
    id: 'prob_champ_03_corte_lua_sangrenta',
    title: 'A Canalização da Lua Carmesim',
    subtitle:
      'Campeão #3 Global (Pyros + Eclipse + Veridia): Sacrifício Vital no limite vital, gatilho duplo do Pactuário Umbral e Atropelar sobre o bloqueador',
    difficulty: 'campeoes_torneio',
    difficultyLabel: '🏆 Grão-Soberanos',
    stars: 5,
    goldReward: 12,
    primaryDomain: 'purple',
    mechanicTag: '🏆 #3 Corte da Lua Carmesim • Sacrifício Vital + Pactuário + Atropelar',
    scenarioLore:
      'Inspirado na Corte da Lua Carmesim (#3 Global • 71.7% WR): você está com apenas 6 ❤️ e 3⚡, mas seu Pactuário do Espírito Umbral está na Retaguarda (causando 2 de dano direto ao Soberano rival a cada Feitiço lançado!) e Vorágine, a Hidra com Atropelar, aguarda na Coluna 2.',
    objectiveText: 'Use o Sacrifício Vital e encadeie dois feitiços letais para abater o rival.',
    hint1:
      'Com 6 ❤️, você ainda pode ativar o Sacrifício Vital (-3 ❤️ -> +1⚡), subindo de 3⚡ para 4⚡ — o suficiente para conjurar DOIS feitiços de custo 2⚡ (Fúria de Sangue Vulcânico + Tambores da Conquista), disparando duas vezes o Pactuário Umbral (4 de dano direto)!',
    hint2:
      '1º Ative o Sacrifício Vital (-3 ❤️ -> 4⚡)! 2º Conjure Fúria de Sangue Vulcânico (2⚡) na Hidra Vorágine (+2/+1 na Hidra + 2 de dano do feitiço + 2 de dano do Pactuário)! 3º Conjure Tambores da Conquista (2⚡ -> +2⚔️ a todos os aliados + 2 de dano do Pactuário)! 4º Ataque o bloqueador da Coluna 2 com Vorágine (Atropelar perfura todo o excedente) e dispare com o Pactuário Umbral (Alcance)!',
    solutionSteps: [
      '1. Ative o Sacrifício Vital no seu Soberano (-3 ❤️, subindo de 3⚡ para 4⚡).',
      '2. Conjure Fúria de Sangue Vulcânico (2⚡) mirando Vorágine, Hidra Voraz na Coluna 2 (+2/+1 na Hidra, +2 de dano direto do feitiço e +2 de dano do Pactuário Umbral!).',
      '3. Conjure Tambores da Conquista (2⚡): +2⚔️ para todos os aliados (incluindo a Cria Dracônica e o Pactuário) e mais +2 de dano direto do Pactuário Umbral!',
      '4. Ataque o bloqueador rival da Coluna 2 com Vorágine (Atropelar transpassa a vida restante direto no Soberano!) e ataque direto com o Pactuário do Espírito Umbral (Alcance)!',
    ],
    whyIndefensible:
      'Sem o Sacrifício Vital você só lança 1 feitiço; e se aplicar a Fúria de Sangue no Pactuário em vez da Hidra com Atropelar (ou atacar antes dos buffs), perderá o dano excedente ou o bônus nas unidades!',
    turnNumber: 7,
    p1Name: 'Soberano da Lua Sangrenta (Você)',
    p1AvatarCardId: 'purple_171_pactuario_elemental_abismo',
    p1Hp: 6,
    p1Essence: 3,
    p1MaxEssence: 7,
    p1Affinities: { red: 3, blue: 0, purple: 4, green: 3, gold: 0, neutral: 0 },
    p1HandCardIds: ['red_30_furia_sangue', 'red_27_frenesi_batalha'],
    p1DeckTopCardIds: ['red_01_kobold', 'purple_11_garra_rastejante'],
    p1ChanneledCardIds: ['green_09_hidra', 'purple_171_pactuario_elemental_abismo'],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'green_09_hidra', row: 'vanguard', slotIndex: 1 },
      { cardId: 'purple_171_pactuario_elemental_abismo', row: 'rearguard', slotIndex: 1 },
    ],
    p2Name: 'Patriarca de Veridia',
    p2Title: 'Guardião da Mata',
    p2AvatarCardId: 'green_19_guardiao_ursino',
    p2Domain: 'green',
    p2Hp: 14,
    p2Essence: 0,
    p2MaxEssence: 7,
    p2Affinities: { red: 0, blue: 0, purple: 0, green: 5, gold: 0, neutral: 0 },
    p2Units: [
      { cardId: 'green_19_guardiao_ursino', row: 'vanguard', slotIndex: 1, bonusHp: 5 },
    ],
  },

  // ============================================================================
  // #114 — CAMPEÃO PENTACROMÁTICO: CONVERGÊNCIA DOS OITO RAIOS (penta_wheel_convergence)
  // ============================================================================
  {
    id: 'prob_champ_04_convergencia_roda',
    title: 'O Giro Supremo de Vaelkor',
    subtitle:
      'Convergência dos Oito Raios (Pentacromático): Quebrar exclusivamente o Domínio rival numa Disputa 50/50 para reativar Ímpeto + Acerto Garantido e reembolsar +2⚡',
    difficulty: 'campeoes_torneio',
    difficultyLabel: '🏆 Grão-Soberanos',
    stars: 5,
    goldReward: 12,
    primaryDomain: 'gold',
    mechanicTag: '☸️ Doutrina da Roda (#173) • Quebra de Choque 50/50 + Acerto Garantido',
    scenarioLore:
      'Ambos os Soberanos expandiram seus Domínios e travaram uma Disputa de Domínios 50/50: seus Acertos Garantidos estão anulados e dois Guardiões colossais com Escudo Divino fecham o campo! Você tem exatamente 7⚡ e Vaelkor, General da Roda Prismática na mão.',
    objectiveText: 'Estilhace o Domínio rival na Disputa 50/50 e ignore os Guardiões para vencer.',
    hint1:
      'Pela Doutrina Oficial Anti-Domínio, invocar Vaelkor, General da Roda Prismática (7⚡) durante um Choque 50/50 destrói APENAS o Domínio rival (`clashRival`), restaurando instantaneamente o +1/+1, o Ímpeto e o Acerto Garantido da sua Expansão de Domínio — além de conceder +2⚡ extras neste turno!',
    hint2:
      '1º Invoque Vaelkor, General da Roda Prismática (7⚡) na Vanguarda da Coluna 2 (com Cobertura do Altar): ele estilhaça o Domínio rival, reativa seu Acerto Garantido + Ímpeto (inclusive no próprio Vaelkor!) e gera +2⚡! 2º Use os 2⚡ reembolsados para conjurar Tambores da Conquista (+2⚔️ em todos os aliados)! 3º Mire diretamente o Soberano rival com Vaelkor e seus aliados, ignorando totalmente os dois Guardiões graças ao Acerto Garantido!',
    solutionSteps: [
      '1. Invoque Vaelkor, General da Roda Prismática (7⚡) na Vanguarda [V] da Coluna 2 (apoiado pelo Altar Dracônico na Retaguarda): ele quebra o Domínio rival no Choque 50/50, restaura +1/+1, Ímpeto e Acerto Garantido da sua Expansão de Domínio e gera +2⚡!',
      '2. Com os 2⚡ gerados por Vaelkor, conjure Tambores da Conquista (2⚡) para conceder +2⚔️ a todos os seus aliados.',
      '3. Graças ao Acerto Garantido do seu Domínio restaurado, ataque DIRETAMENTE o Soberano rival com Vaelkor (Col. 2) e o Justicar da Aurora (Col. 4), ignorando os dois Guardiões!',
    ],
    whyIndefensible:
      'Se você atacar antes de descer Vaelkor, o Choque 50/50 obriga seus ataques a baterem nos Escudos Divinos dos Guardiões causando 0 de dano ao Soberano rival!',
    turnNumber: 8,
    p1Name: 'Árbitro dos Oito Raios (Você)',
    p1AvatarCardId: 'neutral_173_general_roda_matriz',
    p1Hp: 18,
    p1Essence: 7,
    p1MaxEssence: 8,
    p1Affinities: { red: 6, blue: 3, purple: 3, green: 3, gold: 4, neutral: 4 },
    p1HandCardIds: ['neutral_173_general_roda_matriz', 'red_27_frenesi_batalha'],
    p1DeckTopCardIds: ['gold_80_paladino_destino'],
    p1ChanneledCardIds: ['red_10_altar_draconico', 'gold_80_paladino_destino'],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'red_10_altar_draconico', row: 'rearguard', slotIndex: 1 },
      { cardId: 'gold_80_paladino_destino', row: 'vanguard', slotIndex: 3 },
    ],
    p2Name: 'Imperador Solar',
    p2Title: 'Senhor do Tribunal Dourado',
    p2AvatarCardId: 'gold_07_dragao_ouro',
    p2Domain: 'gold',
    p2Hp: 18,
    p2Essence: 0,
    p2MaxEssence: 8,
    p2Affinities: { red: 0, blue: 0, purple: 0, green: 0, gold: 6, neutral: 2 },
    p2Units: [
      { cardId: 'gold_07_dragao_ouro', row: 'vanguard', slotIndex: 1, hasDivineShield: true },
      { cardId: 'neutral_35_colosso_adamantina', row: 'vanguard', slotIndex: 3, hasDivineShield: true },
    ],
    initialDomainState: {
      owner: 'player',
      domain: 'red',
      turnsRemaining: 2,
      clashRival: {
        owner: 'ai',
        domain: 'gold',
        turnsRemaining: 2,
      },
    },
  },

  // ============================================================================
  // #115 — CAMPEÃO PENTACROMÁTICO: SOBERANIA DA CRATERA PRISMÁTICA (penta_prismatic_crater)
  // ============================================================================
  {
    id: 'prob_champ_05_cratera_prismatica',
    title: 'A Refração das Cinco Afinidades',
    subtitle:
      'Soberania da Cratera Prismática (Pentacromático): Canalizar para atingir 6/6 de Afinidade, refratar +1⚡ com o Arauto da Raiz, Ascender o Flagelo e Expandir o Domínio',
    difficulty: 'campeoes_torneio',
    difficultyLabel: '🏆 Grão-Soberanos',
    stars: 5,
    goldReward: 12,
    primaryDomain: 'green',
    mechanicTag: '🌈 Cratera Prismática • Canalizar 6/6 + Arauto + Ascensão + Domínio',
    scenarioLore:
      'Seu Flagelo Cornudo Primordial aguarda na Vanguarda diante de uma muralha de Guardiões, enquanto sua Afinidade Verde está em 5/6 e você possui 11⚡. Um único erro de ordem entre Canalizar, Invocar, Ascender e Expandir Domínio custa a vitória!',
    objectiveText: 'Ative 6/6 de Afinidade, ascenda seu Flagelo, expanda o Domínio e vença.',
    hint1:
      'Você começa com 5/6 de Afinidade Verde e 11⚡! Canalizar a carta Verde extra na mão sobe sua Afinidade Verde para 6/6 (habilitando a Expansão de Domínio por 3⚡), enquanto o Arauto da Raiz Prismática (5⚡) concede +1/+2 a todos os aliados E refrata +1⚡ — elevando seus 11⚡ para 12⚡ exatos (5⚡ + 4⚡ Ascensão + 3⚡ Domínio)!',
    hint2:
      '1º Canalize [C] o Patriarca Urso-Ancestral da mão para atingir 6/6 de Afinidade Verde! 2º Ascenda o Flagelo Cornudo Primordial na Coluna 2 (4⚡ -> vira Colosso Cornudo 5/6)! 3º Invoque o Arauto da Raiz Prismática (5⚡ -> refrata +1⚡, sobrando 3⚡) na Vanguarda da Coluna 4, dando +1/+2 ao Colosso! 4º Ative a Expansão de Domínio (3⚡): todos ganham +1/+1, Ímpeto (liberando o Arauto recém-invocado!) e Acerto Garantido direto no Soberano rival!',
    solutionSteps: [
      '1. Canalize [C] o Patriarca Urso-Ancestral da mão para elevar sua Afinidade Verde de 5/6 para 6/6.',
      '2. Ascenda o Flagelo Cornudo Primordial na Coluna 2 (4⚡ -> transforma-se em Colosso Cornudo do Prisma 5/6).',
      '3. Invoque o Arauto da Raiz Prismática (5⚡) na Vanguarda [V] da Coluna 4: concede +1/+2 aos aliados e refrata +1⚡ (deixando exatamente 3⚡!).',
      '4. Invoque a Expansão de Domínio (3⚡): seu exército ganha +1/+1, Ímpeto (habilitando o Arauto a atacar neste turno!) e Acerto Garantido!',
      '5. Ataque diretamente o Soberano rival com o Colosso Cornudo Ascendido e o Arauto da Raiz Prismática ignorando os Guardiões!',
    ],
    whyIndefensible:
      'Importante: se você invocar o Arauto da Raiz ANTES de Ascender o Flagelo, a Ascensão redefine os atributos base para 5/6 (perdendo o +1/+2 Ao Entrar do Arauto)! Você precisa Ascender primeiro e buffar com o Arauto depois!',
    turnNumber: 8,
    p1Name: 'Soberana da Cratera Prismática (Você)',
    p1AvatarCardId: 'green_167_arauto_prisma_selva',
    p1Hp: 25,
    p1Essence: 11,
    p1MaxEssence: 11,
    p1Affinities: { red: 3, blue: 3, purple: 3, green: 5, gold: 3, neutral: 2 },
    p1HandCardIds: ['green_19_guardiao_ursino', 'green_167_arauto_prisma_selva'],
    p1DeckTopCardIds: ['neutral_01_mercenario_veterano'],
    p1ChanneledCardIds: ['neutral_170_flagelo_cornudo_matriz'],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'neutral_170_flagelo_cornudo_matriz', row: 'vanguard', slotIndex: 1 },
      { cardId: 'red_10_altar_draconico', row: 'rearguard', slotIndex: 1 },
      { cardId: 'red_10_altar_draconico', row: 'rearguard', slotIndex: 3 },
    ],
    p2Name: 'Guardião da Cidadela',
    p2Title: 'Muralha Imortal',
    p2AvatarCardId: 'gold_05_automato_guardiao',
    p2Domain: 'gold',
    p2Hp: 16,
    p2Essence: 0,
    p2MaxEssence: 9,
    p2Affinities: { red: 0, blue: 0, purple: 0, green: 0, gold: 6, neutral: 0 },
    p2Units: [
      { cardId: 'gold_05_automato_guardiao', row: 'vanguard', slotIndex: 1, hasDivineShield: true },
      { cardId: 'gold_05_automato_guardiao', row: 'vanguard', slotIndex: 3, hasDivineShield: true },
    ],
  },

  // ============================================================================
  // #116 — CAMPEÃO TRICOLOR #8 GLOBAL: BASTIÃO DO ECLIPSE DOURADO (tri_purple_green_gold)
  // ============================================================================
  {
    id: 'prob_champ_06_bastiao_eclipse',
    title: 'Manobra do Bastião do Eclipse',
    subtitle:
      'Bastião do Eclipse Dourado (Eclipse + Veridia + Solária): Manobra de Fileira [⇄], Poder do Soberano para romper Escudo Divino e abate com Toque Letal',
    difficulty: 'campeoes_torneio',
    difficultyLabel: '🏆 Grão-Soberanos',
    stars: 5,
    goldReward: 12,
    primaryDomain: 'gold',
    mechanicTag: '🛡️ Bastião do Eclipse • Manobra [⇄] + Poder Soberano + Toque Letal',
    scenarioLore:
      'Seu Titã do Pêndulo Dourado (6⚔️, e causa +2 de dano direto ao Soberano rival Ao Atacar!) foi empurrado para a Retaguarda da Coluna 4 (sem Alcance, incapaz de atacar de lá!), enquanto um Guardião Colossal com Escudo Divino bloqueia a Coluna 2 diante do seu Flagelo com Toque Letal.',
    objectiveText: 'Reposicione seu Titã para a Vanguarda, quebre o Escudo Divino + Guardião e vença.',
    hint1:
      '1) Unidades corpo-a-corpo presas na Retaguarda não atacam — use sua 1 Manobra de Fileira gratuita [⇄] do turno para avançar o Titã do Pêndulo Dourado para a Vanguarda da Coluna 4! 2) Se o Flagelo com Toque Letal bater no Escudo Divino, causará 0 de dano líquido e NÃO ativará o Toque Letal — estoure o Escudo antes!',
    hint2:
      '1º Use a Manobra de Fileira [⇄] (0⚡) no Titã do Pêndulo Dourado na Coluna 4 para avançá-lo da Retaguarda à Vanguarda! 2º Invoque a Lâmina Silenciosa da Guilda (3⚡, Alcance + Ímpeto) na Retaguarda da Coluna 4 (dando Cobertura ao Titã!) e ataque o Guardião da Coluna 2 com a Lâmina para estourar o Escudo Divino dele! 3º Agora ataque o Guardião sem escudo com o Flagelo Cornudo do Abismo (Toque Letal destrói o Guardião, e se o Flagelo morrer na troca, seu Ao Morrer ainda causa +2 de dano direto ao Soberano rival!)! 4º Conjure Tecelão do Feixe Silvestre (4⚡) dando +2/+2 ao Titã do Pêndulo e ataque o Soberano rival com o Titã!',
    solutionSteps: [
      '1. Use a Manobra de Fileira [⇄] (gratuita, 1× por turno) para avançar o Titã do Pêndulo Dourado da Retaguarda [R] para a Vanguarda [V] na Coluna 4.',
      '2. Invoque a Lâmina Silenciosa da Guilda (3⚡, Alcance + Ímpeto) na Retaguarda [R] da Coluna 4 (concedendo Cobertura +1⚔️ ao Titã!) e use-a para atacar o Guardião rival na Coluna 2, estourando seu Escudo Divino.',
      '3. Ataque o Guardião agora desprotegido na Coluna 2 com seu Flagelo Cornudo do Abismo: o Toque Letal abate o Guardião (e o Flagelo morre no contra-ataque causando +2 de dano Ao Morrer ao Soberano rival, além de Renascer!).',
      '4. Invoque o Tecelão do Feixe Silvestre (4⚡) concedendo +2/+2 ao Titã do Pêndulo Dourado na Coluna 4.',
      '5. Com o Guardião eliminado e a Coluna 4 em Invasão + Cobertura, ataque o Soberano rival com o Titã do Pêndulo Dourado (causando +2 de badalada Ao Atacar + dano de combate letal)!',
    ],
    whyIndefensible:
      'Atacar com o Flagelo antes de estourar o Escudo Divino desperdiça o Toque Letal; invocar a Lâmina fora da Retaguarda da Coluna 4 nega +1⚔️ de Cobertura ao Titã; e esquecer a Manobra [⇄] deixa o Titã incapaz de atacar!',
    turnNumber: 7,
    p1Name: 'Regente do Eclipse Dourado (Você)',
    p1AvatarCardId: 'gold_81_colosso_engrenagem',
    p1Hp: 20,
    p1Essence: 7,
    p1MaxEssence: 7,
    p1Affinities: { red: 0, blue: 0, purple: 3, green: 3, gold: 4, neutral: 1 },
    p1HandCardIds: ['neutral_02_assassino_guilda', 'green_168_tecelao_feixe_selva'],
    p1DeckTopCardIds: ['gold_80_paladino_destino'],
    p1ChanneledCardIds: ['gold_81_colosso_engrenagem', 'purple_170_flagelo_cornudo_abismo'],
    p1CryptCardIds: [],
    p1Units: [
      { cardId: 'purple_170_flagelo_cornudo_abismo', row: 'vanguard', slotIndex: 1 },
      { cardId: 'gold_81_colosso_engrenagem', row: 'rearguard', slotIndex: 3 },
    ],
    p2Name: 'Bastião de Adamantina',
    p2Title: 'Sentinela Imóvel',
    p2AvatarCardId: 'neutral_35_colosso_adamantina',
    p2Domain: 'gold',
    p2Hp: 11,
    p2Essence: 0,
    p2MaxEssence: 7,
    p2Affinities: { red: 0, blue: 0, purple: 0, green: 0, gold: 5, neutral: 2 },
    p2Units: [
      { cardId: 'neutral_35_colosso_adamantina', row: 'vanguard', slotIndex: 1, hasDivineShield: true },
    ],
  },
];
