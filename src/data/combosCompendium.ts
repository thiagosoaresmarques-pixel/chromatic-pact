import { Domain } from '../types/game';

export type ComboColorTier = 'mono' | 'dual' | 'tri' | 'poly';

export interface TacticalComboEntry {
  id: string;
  tier: ComboColorTier;
  tierLabel: string;
  domains: Domain[];
  title: string;
  archetypeTag: string;
  cardIds: string[];
  mechanism: string;
  payoff: string;
}

export const TACTICAL_COMBOS_COMPENDIUM: TacticalComboEntry[] = [
  // =========================================================================
  // 1 COR — COMBOS MONOCROMÁTICOS (DOMÍNIOS PUROS + SUPORTE ÉTER ARCANO)
  // =========================================================================
  {
    id: 'mono_red_pyromancy',
    tier: 'mono',
    tierLabel: '1 Cor • Monocromático',
    domains: ['red'],
    title: 'Artilharia Piromante de Retaguarda',
    archetypeTag: 'Dano Direto por Feitiço',
    cardIds: [
      'red_107_fornalha_draconica',
      'red_72_caldeirao_magma',
      'red_97_lancador_chamas',
      'red_32_ritual_cinzas',
      'red_85_tempo_emprestado',
    ],
    mechanism:
      'Com o Piromante e as duas Fornalhas na Retaguarda, cada feitiço lançado dispara 5 de dano automático ao Soberano inimigo (2 + 2 + 1). Feitiços que devolvem +1⚡ (Ritual da Pira e Fúria da Ampulheta) encadeiam múltiplos disparos no mesmo turno.',
    payoff: '15+ de dano direto ao Soberano rival em um único turno ignorando Guardiões.',
  },
  {
    id: 'mono_red_swarm',
    tier: 'mono',
    tierLabel: '1 Cor • Monocromático',
    domains: ['red'],
    title: 'Forja de Crias Dracônicas & Comando de Falange',
    archetypeTag: 'Enxame & Buff de Fileira',
    cardIds: [
      'red_10_altar_draconico',
      'red_36_bigorna_fogo',
      'red_17_orc_xama',
      'red_18_marechal_rubro',
    ],
    mechanism:
      'A Máscara do Trono Rubro e a Bigorna do Rei da Fornalha concedem +1/+1 na entrada, invocam Crias Dracônicas (2/1) e fortalecem as tropas a cada início de turno. Quando o Marechal da Legião Férrea ataca, concede +1 ATQ extra a toda a fileira.',
    payoff: 'Geração perpétua de atacantes 4+ ATQ sem custo de Essência.',
  },
  {
    id: 'mono_red_deathrattle',
    tier: 'mono',
    tierLabel: '1 Cor • Monocromático',
    domains: ['red'],
    title: 'Bomba-Relógio Vulcânica (Último Suspiro)',
    archetypeTag: 'Detonação de Vanguarda',
    cardIds: [
      'red_02_magmin',
      'red_75_kobold_cronobomba',
      'red_45_fenix_primordial',
    ],
    mechanism:
      'Posicione unidades explosivas na Vanguarda. Qualquer ataque ou limpeza inimiga detona Últimos Suspiros em cadeia sobre toda a Vanguarda rival, enquanto a Fênix da Coroa Solar renasce imediatamente com Voo e Ímpeto.',
    payoff: '5 de dano em área garantido na Vanguarda inimiga + retorno imortal da Fênix.',
  },
  {
    id: 'mono_blue_spellslinger',
    tier: 'mono',
    tierLabel: '1 Cor • Monocromático',
    domains: ['blue'],
    title: 'Ressonância Rúnica & Ciclo de Essência',
    archetypeTag: 'Compra & Disparo Arcano',
    cardIds: [
      'blue_37_mago_aprendiz',
      'blue_10_portal_runas',
      'blue_36_tomo_infinito',
      'blue_30_visao_ancestral',
      'blue_32_transmutar_eter',
    ],
    mechanism:
      'O Códice, o Grimório do Infinito e o Iniciado disparam 5 de dano distribuído a cada magia lançada. Visão do Oráculo e Transmutação em Éter devolvem +1⚡ e compram novas cartas para manter a sequência ativa.',
    payoff: 'Limpeza contínua da mesa inimiga sem jamais esgotar a mão.',
  },
  {
    id: 'mono_blue_permafrost',
    tier: 'mono',
    tierLabel: '1 Cor • Monocromático',
    domains: ['blue'],
    title: 'Prisão Glacial Perpétua',
    archetypeTag: 'Trava Total de Mesa',
    cardIds: [
      'blue_28_orbe_tempestade',
      'blue_35_cetro_inverno',
      'blue_09_onda_repulsora',
      'blue_86_mudanca_quantica',
    ],
    mechanism:
      'O Astrolábio e o Cetro da Geada congelam automaticamente 2 inimigos todo início de turno. Se o rival tentar atacar com unidades restantes, Maremoto de Gelo congela toda a Vanguarda inimiga na hora.',
    payoff: 'Neutraliza completamente os ataques terrestres do adversário.',
  },
  {
    id: 'mono_purple_dark_ritual',
    tier: 'mono',
    tierLabel: '1 Cor • Monocromático',
    domains: ['purple'],
    title: 'Ritual Abissal de Aceleração Precoce',
    archetypeTag: 'Explosão de Essência',
    cardIds: [
      'purple_104_pacto_demoniaco',
      'purple_50_pacto_proibido',
      'purple_25_dama_seis_laminas',
      'purple_07_lich',
    ],
    mechanism:
      'Pacto de Sangue (1⚡ → +2⚡) e Contrato das Sete Correntes (2⚡ → +2⚡ e compra 2 cartas) convertem Corrupção em Essência imediata, permitindo descer colossos de custo 6–7 já nos primeiros turnos.',
    payoff: 'Invoca Serpente Abissal (7/6 Ímpeto) ou Vesperion vários turnos antes da curva normal.',
  },
  {
    id: 'mono_purple_reanimator',
    tier: 'mono',
    tierLabel: '1 Cor • Monocromático',
    domains: ['purple'],
    title: 'Ciclo Imortal da Cripta',
    archetypeTag: 'Reanimação & Buff Global',
    cardIds: [
      'purple_28_filacterio_noite',
      'purple_30_erguer_mortos',
      'purple_68_exumar_legiao',
      'purple_07_lich',
    ],
    mechanism:
      'Sempre que seus campeões tombam, Erguer Legião da Cripta (3⚡) e Exumar a Legião Caída (4⚡) os trazem de volta ao campo e ainda concedem +1/+1 a todas as unidades aliadas.',
    payoff: 'Exército que volta mais forte da Cripta a cada tentativa de remoção do oponente.',
  },
  {
    id: 'mono_green_ramp',
    tier: 'mono',
    tierLabel: '1 Cor • Monocromático',
    domains: ['green'],
    title: 'Seiva Primordial & Despertar da Hidra',
    archetypeTag: 'Aceleração & Colosso',
    cardIds: [
      'green_12_pixie',
      'green_36_coracao_floresta',
      'green_28_totem_silvestre',
      'green_09_hidra',
    ],
    mechanism:
      'A Fada Pixie (+1⚡), o Coração da Seiva (+1⚡ e compra 1) e o Santuário Silvestre (+2⚡) reembolsam Essência no mesmo turno em que entram, financiando a chegada imediata de Vorágine, Hidra Voraz.',
    payoff: 'Coloca uma Hidra 8/9 (Armadura 2, Regeneração 3, Sopro 2) com suporte de cura contínua.',
  },
  {
    id: 'mono_green_enrage',
    tier: 'mono',
    tierLabel: '1 Cor • Monocromático',
    domains: ['green'],
    title: 'Muralha de Fúria Crescente & Regeneração',
    archetypeTag: 'Escalada de Ataque',
    cardIds: [
      'green_07_troll',
      'green_54_totem_ancestral',
      'green_53_carapaca_espinhosa',
    ],
    mechanism:
      'O Troll Regenerador (6/8, Guardião, Atropelar, Fúria Crescente, Regeneração 3) absorve ataques inimigos, recupera até 5 de VIDA por turno com o Monólito e ganha +2 ATQ permanente a cada impacto sofrido.',
    payoff: 'Cria um Guardião 12+ ATQ com Atropelar que esmaga a coluna inimiga.',
  },
  {
    id: 'mono_gold_aegis',
    tier: 'mono',
    tierLabel: '1 Cor • Monocromático',
    domains: ['gold'],
    title: 'Falange Invulnerável do Sol Invicto',
    archetypeTag: 'Escudo Divino em Massa',
    cardIds: [
      'gold_28_reliquia_pacto',
      'gold_30_escudo_solar',
      'gold_26_muralha_aco',
      'gold_10_egide_radiante',
    ],
    mechanism:
      'A Arca da Aliança e o Bastião do Sol concedem Escudo Divino a toda a tropa ao entrar. Quando o inimigo ataca para quebrar os escudos, a Reação Falange de Escudos Animados reaplica Escudo Divino em todos.',
    payoff: 'Trocas de combate 100% gratuitas onde suas unidades jamais perdem VIDA.',
  },
  {
    id: 'mono_gold_empire_engine',
    tier: 'mono',
    tierLabel: '1 Cor • Monocromático',
    domains: ['gold'],
    title: 'Motor Imperial de Essência & Zênite',
    archetypeTag: 'Geração de Mana & Cura',
    cardIds: [
      'gold_105_coroa_imperador',
      'gold_90_trono_horas',
      'gold_33_trono_celestial',
      'gold_07_dragao_ouro',
    ],
    mechanism:
      'A Coroa Imperial e o Santuário do Relógio geram +2⚡ extras todo início de turno enquanto curam toda a fileira, acelerando a entrada do Trono Celestial e de Aurarius, Majestade do Sol.',
    payoff: '+2⚡ permanentes por turno + fileira inteira blindada com Armadura 3 e Escudo Divino.',
  },
  {
    id: 'mono_neutral_archmage',
    tier: 'mono',
    tierLabel: 'Suporte Universal • Éter Arcano',
    domains: ['neutral'],
    title: 'Motor Arcano Universal (0 Afinidade)',
    archetypeTag: 'Catalisador para Qualquer Cor',
    cardIds: [
      'neutral_13_grimorio_astral',
      'neutral_49_fragmento_mental',
      'neutral_40_cajado_magi',
      'neutral_17_pedra_filosofal',
    ],
    mechanism:
      'Sem exigir Afinidade Elemental, a Pedra Filosofal gera Essência extra todo turno enquanto o Tomo, o Diadema e o Cajado Supremo convertem qualquer feitiço em 5 de dano + 1 de dreno de VIDA.',
    payoff: 'Encaixa em qualquer Grimório para multiplicar o impacto de feitiços e acelerar a curva.',
  },

  // =========================================================================
  // 2 CORES — AS 10 ALIANÇAS BICROMÁTICAS
  // =========================================================================
  {
    id: 'dual_red_blue',
    tier: 'dual',
    tierLabel: '2 Cores • Aliança Bicromática',
    domains: ['red', 'blue'],
    title: 'Tempestade Piroclástica (Spell-Burn)',
    archetypeTag: 'Chama + Tempestade',
    cardIds: [
      'red_97_lancador_chamas',
      'red_107_fornalha_draconica',
      'blue_10_portal_runas',
      'blue_30_visao_ancestral',
      'blue_49_mente_onisciente',
    ],
    mechanism:
      'O Vermelho fornece os maiores gatilhos de dano ao Soberano por feitiço lançado, enquanto o Azul fornece feitiços que devolvem +1⚡ e compram 1–2 cartas (Visão do Oráculo e Epifania), evitando que a mão se esgote.',
    payoff: 'Permite encadear 4 a 5 feitiços no mesmo turno para um abate explosivo à distância.',
  },
  {
    id: 'dual_red_purple',
    tier: 'dual',
    tierLabel: '2 Cores • Aliança Bicromática',
    domains: ['red', 'purple'],
    title: 'Fênix Imortal do Abismo',
    archetypeTag: 'Chama + Abismo',
    cardIds: [
      'purple_104_pacto_demoniaco',
      'red_45_fenix_primordial',
      'purple_30_erguer_mortos',
      'purple_28_filacterio_noite',
    ],
    mechanism:
      'Use o Pacto de Sangue para invocar a Fênix da Coroa Solar cedo. Quando ela gastar seu Renascer e finalmente cair na Cripta (causando 2× dano em área), Erguer Legião da Cripta e a Máscara a trazem de volta com Renascer renovado.',
    payoff: 'Uma Fênix com Voo e Ímpeto que precisa ser morta 4 a 6 vezes pelo oponente.',
  },
  {
    id: 'dual_red_green',
    tier: 'dual',
    tierLabel: '2 Cores • Aliança Bicromática',
    domains: ['red', 'green'],
    title: 'Avalanche de Fúria & Atropelar',
    archetypeTag: 'Chama + Selva',
    cardIds: [
      'green_05_minotauro',
      'green_32_gorila_alfa',
      'red_85_tempo_emprestado',
      'red_17_orc_xama',
    ],
    mechanism:
      'O Verde entrega criaturas brutais com Ímpeto, Atropelar e Fúria Crescente (Minotauro Quebra-Muros e Kongor), e o Vermelho injeta +3/+1 e +1⚡ imediato com Fúria da Ampulheta Rubra.',
    payoff: 'Golpes imediatos de 9+ ATQ com Atropelar que atravessam bloqueadores e acertam o Soberano.',
  },
  {
    id: 'dual_red_gold',
    tier: 'dual',
    tierLabel: '2 Cores • Aliança Bicromática',
    domains: ['red', 'gold'],
    title: 'Falange Dracônica Blindada',
    archetypeTag: 'Chama + Ordem',
    cardIds: [
      'red_10_altar_draconico',
      'red_36_bigorna_fogo',
      'gold_28_reliquia_pacto',
      'gold_27_decreto_gloria',
    ],
    mechanism:
      'As Relíquias vermelhas inundam o campo com Crias Dracônicas ofensivas, e o Dourado elimina a fragilidade delas concedendo +1/+2 (Juramento do Campeão) e Escudo Divino global (Arca da Aliança).',
    payoff: 'Transforma fichas 2/1 em soldados 4/3 com Escudo Divino imunes a limpezas de área.',
  },
  {
    id: 'dual_blue_purple',
    tier: 'dual',
    tierLabel: '2 Cores • Aliança Bicromática',
    domains: ['blue', 'purple'],
    title: 'Usurpação Mental & Controle Sombrio',
    archetypeTag: 'Tempestade + Abismo',
    cardIds: [
      'purple_27_emboscada_umbrosa',
      'purple_44_devorador_intelecto',
      'purple_21_abolete',
      'blue_27_dissipacao_astral',
    ],
    mechanism:
      'Manto Sufocante da Caverna reduz o ATQ da Vanguarda inimiga em -2, colocando campeões rivais dentro do limite (ATQ <= 3) para serem roubados permanentemente pelo Espectro Usurpador ou Leviatã Psíquico.',
    payoff: 'Rouba as melhores criaturas do adversário para o seu lado do tabuleiro.',
  },
  {
    id: 'dual_blue_green',
    tier: 'dual',
    tierLabel: '2 Cores • Aliança Bicromática',
    domains: ['blue', 'green'],
    title: 'Inverno Primordial (Ramp & Caminho Livre)',
    archetypeTag: 'Tempestade + Selva',
    cardIds: [
      'green_28_totem_silvestre',
      'green_36_coracao_floresta',
      'blue_28_orbe_tempestade',
      'green_09_hidra',
    ],
    mechanism:
      'O Verde acelera a Essência para colocar colossos em campo rapidamente, enquanto o Astrolábio azul congela toda a Vanguarda inimiga, impedindo revides contra suas feras.',
    payoff: 'Seus colossos verdes atacam livremente contra defensores congelados.',
  },
  {
    id: 'dual_blue_gold',
    tier: 'dual',
    tierLabel: '2 Cores • Aliança Bicromática',
    domains: ['blue', 'gold'],
    title: 'Cidadela de Quartzo & Égide Solar',
    archetypeTag: 'Tempestade + Ordem',
    cardIds: [
      'blue_41_golem_cristal',
      'gold_105_coroa_imperador',
      'gold_26_muralha_aco',
      'blue_09_onda_repulsora',
    ],
    mechanism:
      'Combina os Escudos Divinos reativos dourados com o congelamento em área azul e o Autômato de Quartzo Rúnico, que cura todos os aliados a cada feitiço ou reação lançada.',
    payoff: 'Defesa intransponível que anula tanto ataques físicos quanto magias de atrito.',
  },
  {
    id: 'dual_purple_green',
    tier: 'dual',
    tierLabel: '2 Cores • Aliança Bicromática',
    domains: ['purple', 'green'],
    title: 'Reencarnação Selvagem da Cripta',
    archetypeTag: 'Abismo + Selva',
    cardIds: [
      'green_07_troll',
      'green_09_hidra',
      'green_88_reencarnacao_ancestral',
      'purple_30_erguer_mortos',
    ],
    mechanism:
      'Une as maiores feras regenerativas verdes com as magias de reanimação em massa roxas e verdes. Cada vez que um colosso cai e retorna, todo o seu exército recebe +1/+1 ou +1/+2.',
    payoff: 'Feras gigantescas que voltam da Cripta ainda maiores do que quando entraram.',
  },
  {
    id: 'dual_purple_gold',
    tier: 'dual',
    tierLabel: '2 Cores • Aliança Bicromática',
    domains: ['purple', 'gold'],
    title: 'Pacto das Valquírias & Necromancia Solar',
    archetypeTag: 'Abismo + Ordem',
    cardIds: [
      'gold_35_chamado_valquirias',
      'purple_22_orbe_necrotico',
      'purple_07_lich',
      'gold_28_reliquia_pacto',
    ],
    mechanism:
      'Chamado das Valquírias Solares (4⚡) reanima o Crânio Arcano da Morte (custo 6⚡) e concede Escudo Divino a todos; ao entrar em campo, o Crânio Arcano dispara seu próprio efeito e reanima mais um aliado da Cripta!',
    payoff: 'Reanima 2 criaturas pesadas em cadeia por apenas 4⚡ com Escudo Divino em toda a mesa.',
  },
  {
    id: 'dual_green_gold',
    tier: 'dual',
    tierLabel: '2 Cores • Aliança Bicromática',
    domains: ['green', 'gold'],
    title: 'Bastião Imortal de Fúria & Escudo Divino',
    archetypeTag: 'Selva + Ordem',
    cardIds: [
      'green_07_troll',
      'green_32_gorila_alfa',
      'gold_33_trono_celestial',
      'gold_90_trono_horas',
    ],
    mechanism:
      'Criaturas verdes de alta VIDA, Regeneração e Fúria Crescente recebem Armadura, Escudo Divino e +3 de cura por turno das Relíquias douradas, tornando-se impossíveis de abater.',
    payoff: 'Vanguarda com 8+ VIDA, Regeneração 3 e Escudo Divino que cresce a cada turno.',
  },

  // =========================================================================
  // 3 CORES — AS 4 GRANDES TRÍADES TÁTICAS
  // =========================================================================
  {
    id: 'tri_red_blue_purple',
    tier: 'tri',
    tierLabel: '3 Cores • Tríade Tática',
    domains: ['red', 'blue', 'purple'],
    title: 'Tríade do Cataclismo Arcano (Storm OTK)',
    archetypeTag: 'Chama + Tempestade + Abismo',
    cardIds: [
      'purple_104_pacto_demoniaco',
      'purple_50_pacto_proibido',
      'red_107_fornalha_draconica',
      'red_97_lancador_chamas',
      'blue_30_visao_ancestral',
      'purple_107_grimorio_necromante',
    ],
    mechanism:
      'Estágio 1 (Roxo): Pacto de Sangue e Contrato geram +4⚡ de explosão. Estágio 2 (Vermelho + Roxo): Fornalha, Piromante e Necronomicon na Retaguarda. Estágio 3 (Azul): Feitiços de compra e restituição de Essência disparam todos os gatilhos em sequência.',
    payoff: 'Cada feitiço causa 5+ de dano direto e drena VIDA, permitindo abater o Soberano rival em um único turno.',
  },
  {
    id: 'tri_green_gold_red',
    tier: 'tri',
    tierLabel: '3 Cores • Tríade Tática',
    domains: ['green', 'gold', 'red'],
    title: 'Tríade da Avalanche Solar',
    archetypeTag: 'Selva + Ordem + Chama',
    cardIds: [
      'green_28_totem_silvestre',
      'green_32_gorila_alfa',
      'red_18_marechal_rubro',
      'gold_28_reliquia_pacto',
      'gold_27_decreto_gloria',
    ],
    mechanism:
      'O Verde gera a explosão de Essência (+2⚡ do Santuário), o Vermelho e o Verde colocam atacantes de Ímpeto e comando de fileira, e o Dourado sela o turno com +1/+2 e Escudo Divino para todos.',
    payoff: 'Investida total com 6 colunas fortalecidas e protegidas por Escudo Divino.',
  },
  {
    id: 'tri_blue_purple_green',
    tier: 'tri',
    tierLabel: '3 Cores • Tríade Tática',
    domains: ['blue', 'purple', 'green'],
    title: 'Tríade da Eternidade (Ramp, Trava & Cripta)',
    archetypeTag: 'Tempestade + Abismo + Selva',
    cardIds: [
      'green_36_coracao_floresta',
      'blue_10_portal_runas',
      'blue_28_orbe_tempestade',
      'purple_30_erguer_mortos',
      'green_88_reencarnacao_ancestral',
    ],
    mechanism:
      'Combina a aceleração de Essência verde, a compra de cartas e congelamento azul, e a dupla reanimação com buff global (Erguer Legião + Reencarnação Primordial).',
    payoff: 'Domínio absoluto de recursos: você tem mais Essência, mais cartas na mão e recicla toda a Cripta.',
  },
  {
    id: 'tri_red_purple_gold',
    tier: 'tri',
    tierLabel: '3 Cores • Tríade Tática',
    domains: ['red', 'purple', 'gold'],
    title: 'Tríade dos Imortais Caídos',
    archetypeTag: 'Chama + Abismo + Ordem',
    cardIds: [
      'red_45_fenix_primordial',
      'purple_22_orbe_necrotico',
      'purple_07_lich',
      'gold_35_chamado_valquirias',
    ],
    mechanism:
      'Une campeões com Renascer nativo (Fênix e Vesperion) ao Chamado das Valquírias Solares e ao Crânio Arcano da Morte, revivendo múltiplas lendas simultaneamente com Escudo Divino.',
    payoff: 'Tabuleiro imortal que pune qualquer tentativa de troca do adversário.',
  },

  // =========================================================================
  // 4 E 5 CORES — CONVERGÊNCIA POLICROMÁTICA / PENTACROMÁTICA
  // =========================================================================
  {
    id: 'poly_five_suns_citadel',
    tier: 'poly',
    tierLabel: '4–5 Cores • Convergência Pentacromática',
    domains: ['red', 'blue', 'purple', 'green', 'gold', 'neutral'],
    title: 'Cidadela dos Cinco Sóis (Motor de Relíquias)',
    archetypeTag: 'Sinfonia de 5 Domínios + Éter',
    cardIds: [
      'neutral_30_coroa_pactos',
      'neutral_17_pedra_filosofal',
      'gold_105_coroa_imperador',
      'green_36_coracao_floresta',
      'blue_35_cetro_inverno',
      'purple_35_calice_vampirico',
    ],
    mechanism:
      'Canalize 1 carta por turno nos 3 primeiros turnos para fixar Afinidade multi-domínio enquanto o Diadema Supremo Pentacromático e a Pedra Filosofal (0 Afinidade) geram +2⚡ extras e curam todo turno.',
    payoff: 'Todo início/fim de turno gera +3⚡ extras, congela 1 inimigo, cura 5+ de VIDA, drena 2 do rival e dá +1/+1 à tropa.',
  },
  {
    id: 'poly_ambush_web',
    tier: 'poly',
    tierLabel: '4–5 Cores • Convergência Pentacromática',
    domains: ['blue', 'purple', 'green', 'gold', 'neutral'],
    title: 'Labirinto Pentacromático de Emboscadas',
    archetypeTag: 'Rede de Reações Ocultas',
    cardIds: [
      'neutral_46_pausar_pensar',
      'green_35_fosso_vinhas',
      'gold_26_muralha_aco',
      'blue_27_dissipacao_astral',
      'purple_34_cripta_espinhos',
    ],
    mechanism:
      'Como todas as Reações entram ocultas na Retaguarda com requisito apenas 1 de Afinidade, o adversário jamais sabe qual punição acionará ao declarar um ataque.',
    payoff: 'Cada ataque inimigo resulta em destruição imediata, devolução à mão, paralisia ou Escudo Divino global.',
  },
];
