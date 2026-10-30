import { EpicPoemCanto } from './epicPoemTypes';

/**
 * CANTOS PARALELOS — PARTE 26
 * 1) CAPÍTULO III-I (IIª Era, 324–346 D.F.): A Ruptura dos Grilhões e a Marcha dos Seis Flagelos Cornudos (#170)
 *    — A revolta das bestas prismáticas couraçadas nas pedreiras das Cinco Cidadelas e na Fronteira Cinzenta.
 * 2) CAPÍTULO VI-H (Vª Era, 1.008–1.034 D.F.): Os Votos da Dupla Presença e o Collegium dos Pactuários Elementais (#171)
 *    — A consagração dos seis arcanistas de Retaguarda que selaram pactos com espíritos colossais para reger Vanguarda e Feitiço.
 */
export const EPIC_POEM_PARALLEL_PART_26: EpicPoemCanto[] = [
  // ==========================================================================
  // CAPÍTULO 1 (Canto III): OS SEIS FLAGELOS CORNUDOS (Anos 324–346 D.F.)
  // 9 nós = 6 ilustrados (kind: 'prelude', 4 estrofes) + 3 pontes (kind: 'interlude', hideCardArt: true, 3 estrofes) = 33 estrofes
  // ==========================================================================
  {
    id: 'canto_3k_flagelos_cornudos_fronteira',
    isParallel: true,
    parentCantoId: 'canto_3_cidadelas',
    anchorNodeId: 'canto3_creature_24_tita_adamantina',
    parallelCode: 'III-I',
    shortTitle: 'Os Flagelos Cornudos',
    cantoNumber: 'CAPÍTULO III-I',
    eraNumber: 'IIª ERA • A REVOLTA DAS PEDREIRAS E OS BRUTOS DO PRISMA',
    periodLabel: 'Anos 324–346 D.F. • Fronteira Cinzenta & Muralhas das Cinco Cidadelas',
    title: 'A Ruptura dos Grilhões e a Marcha dos Seis Flagelos Cornudos',
    subtitle:
      'De como seis linhagens de brutos couraçados nascidos das cascas cristalinas do Prisma despedaçaram as correntes das pedreiras reais, exigindo a vigília do Titã de Adamantina antes de se tornarem baluartes juramentados das seis bandeiras',
    accentColor: '#94a3b8',
    bannerImage: '/assets/arena/tabletop_neutral.png',
    nodes: [
      {
        id: 'node_3k_1_flagelo_primordial',
        kind: 'prelude',
        cardId: 'neutral_170_flagelo_cornudo_matriz',
        domain: 'neutral',
        title: 'Flagelo Cornudo Primordial',
        subtitle:
          'No Ano 324 D.F., nas pedreiras profundas da Fronteira Cinzenta, o primeiro bruto de crânio platino arrebenta os grilhões da Primeira Era e revela o poder latente da Ascensão',
        yearLabel: 'Ano 324 D.F.',
        locationLabel: 'Pedreira Axial da Fronteira Cinzenta',
        stanzas: [
          [
            'No fundo cinzento da mina ancestral,',
            'Dormia em silêncio o bruto de sal:',
            'Com crânio de prata e marfim secular,',
            'Preso em grossos elos sem ver o luar!',
          ],
          [
            'Mas quando a picareta feriu seu rincão,',
            'Partiu num só urro o antigo grilhão;',
            'Nos chifres curvados de ferro e esplendor,',
            'Corria o arco-íris do Prisma anterior!',
          ],
          [
            'Postou-se qual muro diante do véu,',
            'Guardião couraçado que não pede céu;',
            'E quem lhe consagra quatro cargas de luz',
            'Vê nele o Colosso que o campo conduz!',
          ],
          [
            'Coberto num manto de Escudo Divino,',
            'Mudou das fronteiras o duro destino;',
            'Pois logo nas furnas do norte febril,',
            'Seu gêmeo de brasa rugiu no covil!',
          ],
        ],
      },
      {
        id: 'node_3k_2_flagelo_fornalha',
        kind: 'prelude',
        cardId: 'red_170_flagelo_cornudo_chama',
        domain: 'red',
        title: 'Flagelo Cornudo da Fornalha',
        subtitle:
          'Em 328 D.F., nos fossos de escória de Pyros, as correntes de ferro derretem nos pulsos da fera vulcânica que atropela escudos e atinge o próprio trono rival',
        yearLabel: 'Ano 328 D.F.',
        locationLabel: 'Fossos de Escória da Cidadela de Pyros',
        stanzas: [
          [
            'Quatro anos mais tarde, na furna acendida,',
            'Tombou a comporta de rocha fundida:',
            'Com crânio queimado em carvão e vapor,',
            'Saltou da Fornalha o cornudo terror!',
          ],
          [
            'Tentaram prendê-lo com cabos de aço,',
            'Mas tudo escorria ao calor de seu braço;',
            'Nas veias de lava fervia o vulcão,',
            'Pingando faíscas na pedra do chão!',
          ],
          [
            'Com Ímpeto cego dispara na frente,',
            'Capaz de atropelar a muralha valente;',
            'E o sopro de cinza que sai no encontrão',
            'Alcança o monarca no trono do vão!',
          ],
          [
            'Vendo essa investida descer da ladeira,',
            'Os mestres do norte abriram fileira;',
            'Enquanto nas costas do mar boreal,',
            'Forjava-se em gelo um rival de cristal!',
          ],
        ],
      },
      {
        id: 'node_3k_3_interlude_pedreiras_norte',
        kind: 'interlude',
        cardId: 'red_170_flagelo_cornudo_chama',
        hideCardArt: true,
        domain: 'blue',
        title: 'O Choque nos Desfiladeiros de Basalto e Escarcha',
        subtitle:
          'No Ano 331 D.F., caravanas fronteiriças testemunham o primeiro embate entre as patrulhas vulcânicas e os baluartes polares de Vórtex',
        yearLabel: 'Ano 331 D.F.',
        locationLabel: 'Garganta Boreal entre Pyros e Vórtex',
        stanzas: [
          [
            'Por todas as serras correu o rumor',
            'De que as cascas antigas ganhavam furor:',
            'Onde antes havia só rocha calada,',
            'Brotava uma testa de ponta recurvada!',
          ],
          [
            'Em Pyros deixaram o monstro correr,',
            'Fazendo das chamas seu livre poder;',
            'Já Vórtex gravou na geleira marinha',
            'As runas que davam firmeza à sua linha.',
          ],
          [
            'Assim, quando a brasa desceu pelo estreito,',
            'Achou no caminho um guardião de outro jeito:',
            'De chifres azuis reluzindo no ar,',
            'Pronto a investida no impacto gelar!',
          ],
        ],
      },
      {
        id: 'node_3k_4_flagelo_geada',
        kind: 'prelude',
        cardId: 'blue_170_flagelo_cornudo_gelo',
        domain: 'blue',
        title: 'Flagelo Cornudo da Geada',
        subtitle:
          'Em 333 D.F., o Observatório de Safira posiciona nas muralhas costeiras o bruto glacial cujos chifres congelam qualquer atacante no ato do choque',
        yearLabel: 'Ano 333 D.F.',
        locationLabel: 'Baluarte Costeiro de Vórtex',
        stanzas: [
          [
            'De crânio alvejado por vento polar,',
            'E olhos acesos qual frio luar,',
            'O Flagelo Cornudo da Geada cresceu',
            'Na fenda onde o gelo jamais derreteu!',
          ],
          [
            'Nos pulsos trazia correntes de escarcha,',
            'Pesadas qual âncora em lenta marcha;',
            'E os chifres maciços de pura safira',
            'Quebravam no meio do salto toda ira!',
          ],
          [
            'Plantado na frente em serena postura,',
            'Protege a Retaguarda com fria armadura;',
            'E todo inimigo que o chifre resvala',
            'Congela um turno no meio da ala!',
          ],
          [
            'Enquanto no norte reinava a geada,',
            'No sul a floresta quebrava a estrada:',
            'Cobrindo de musgo, espinheiro e vigor',
            'O quarto gigante daquele clamor!',
          ],
        ],
      },
      {
        id: 'node_3k_5_flagelo_mata',
        kind: 'prelude',
        cardId: 'green_170_flagelo_cornudo_selva',
        domain: 'green',
        title: 'Flagelo Cornudo da Mata',
        subtitle:
          'No Ano 336 D.F., nas trilhas de Veridia, desperta o colosso de madeira-ferro que regenera a própria carne e cresce em fúria a cada ferida',
        yearLabel: 'Ano 336 D.F.',
        locationLabel: 'Bosque de Raiz-Ferro (Veridia)',
        stanzas: [
          [
            'Nas matas fechadas do sul verdejante,',
            'Onde a árvore antiga abraçava o gigante,',
            'Surgiu entre sarças e cipó trançado',
            'O bruto da selva de casco pesado!',
          ],
          [
            'Não tinha nos braços argola de mina,',
            'Mas laços viventes de brava campina;',
            'Seus chifres torcidos de dura aroeira',
            'Rasgavam escudos qual folha ligeira!',
          ],
          [
            'Se a espada inimiga lhe corta o costado,',
            'A seiva refaz o tecido rasgado;',
            'E em Fúria Crescente redobra a pressão,',
            'Passando por cima de todo esquadrão!',
          ],
          [
            'Tão grande tumulto cercou a Fronteira,',
            'Que a Torre Cinzenta acendeu a fogueira;',
            'Mandando aos artífices logo fundir',
            'Um guarda capaz de a estrada abrir!',
          ],
        ],
      },
      {
        id: 'node_3k_6_interlude_tita_adamantina',
        kind: 'interlude',
        cardId: 'green_170_flagelo_cornudo_selva',
        hideCardArt: true,
        domain: 'neutral',
        title: 'A Vigília nos Portões da Torre dos Cinco Selos',
        subtitle:
          'No Ano 340 D.F., a fundação do Titã de Adamantina estabiliza o planalto central enquanto o Vale do Eclipse e Solária revelam os dois últimos Flagelos',
        yearLabel: 'Ano 340 D.F.',
        locationLabel: 'Portões da Torre dos Cinco Selos',
        stanzas: [
          [
            'No ano trezentos e quarenta contado,',
            'Ergueu-se o Titã no portão prateado:',
            'Em adamantina sem mancha nem cor,',
            'Contendo dos brutos o cego furor!',
          ],
          [
            'Diante do autômato firme na praça,',
            'Curvou-se em respeito a indômita raça;',
            'Mostrando que a força nascida do chão',
            'Podia servir a um mais alto brasão.',
          ],
          [
            'Porém restava ainda, nos cantos extremos,',
            'O par derradeiro que hoje tememos:',
            'Um vindo das criptas de osso e rancor,',
            'O outro banhado no ouro do alvor!',
          ],
        ],
      },
      {
        id: 'node_3k_7_flagelo_abismo',
        kind: 'prelude',
        cardId: 'purple_170_flagelo_cornudo_abismo',
        domain: 'purple',
        title: 'Flagelo Cornudo do Abismo',
        subtitle:
          'Em 343 D.F., nas masmorras de obsidiana do Vale do Eclipse, ergue-se o carrasco cornudo de toque venenoso que fere o Soberano na morte e retorna do túmulo',
        yearLabel: 'Ano 343 D.F.',
        locationLabel: 'Masmorras Inferiores do Vale do Eclipse',
        stanzas: [
          [
            'Nas covas escuras da negra catedral,',
            'Onde a sombra destila seu soro mortal,',
            'Subiu das masmorras num roxo clarão',
            'O Flagelo do Abismo arrastando o grilhão!',
          ],
          [
            'Seu crânio de osso vazava neblina,',
            'Seus chifres rachados traziam ruína;',
            'Bastava um arranho da ponta fatal',
            'Para em Toque Letal derrubar o rival!',
          ],
          [
            'E ai de quem julga vencê-lo na lida:',
            'Caindo, dispara no trono a ferida,',
            'Causando dois golpes de dor ao senhor',
            'Antes que o Renascer lhe devolva o vigor!',
          ],
          [
            'Contra essa ameaça de sombra infinita,',
            'Solária abriu sua abóbada bendita;',
            'Ungindo com óleo de sol matinal',
            'O último irmão da linhagem real!',
          ],
        ],
      },
      {
        id: 'node_3k_8_flagelo_alvorada',
        kind: 'prelude',
        cardId: 'gold_170_flagelo_cornudo_sol',
        domain: 'gold',
        title: 'Flagelo Cornudo da Alvorada',
        subtitle:
          'No Ano 345 D.F., no Bastião dos Sete Sóis, o sexto bruto redime os próprios grilhões em ouro consagrado, curando o Soberano e erguendo seu Escudo Divino',
        yearLabel: 'Ano 345 D.F.',
        locationLabel: 'Pátio dos Juramentos (Solária)',
        stanzas: [
          [
            'No Pátio dourado de mármore e paz,',
            'Não houve chicote nem ferro tenaz:',
            'Os padres tiraram o elo pesado,',
            'E o bruto ajoelhou-se no chão consagrado!',
          ],
          [
            'Banhado em alabastro e bronze solar,',
            'Seus chifres brunidos puseram-se a arfar;',
            'Guardando nos pulsos as argolas d’ouro',
            'Não mais como pena, mas nobre tesouro!',
          ],
          [
            'Ao pisar na Arena com passo seguro,',
            'Restaura o monarca detrás de seu muro;',
            'Com Escudo Divino na linha da frente,',
            'Sustenta o impacto da lança inclemente!',
          ],
          [
            'Assim seis irmãos de uma mesma raiz',
            'Tomaram assento em cada país;',
            'Provando que o jugo partido na mão',
            'Se torna na guerra o mais forte bastião!',
          ],
        ],
      },
      {
        id: 'node_3k_9_interlude_vanguarda_grilhoes',
        kind: 'interlude',
        cardId: 'gold_170_flagelo_cornudo_sol',
        hideCardArt: true,
        domain: 'gold',
        title: 'O Estatuto das Vanguardas Cornudas',
        subtitle:
          'Em 346 D.F., as Cinco Cidadelas encerram o uso servil das bestas do Prisma e inscrevem os Seis Flagelos na primeira linha oficial de choque',
        yearLabel: 'Ano 346 D.F.',
        locationLabel: 'Marco das Cinco Estradas',
        stanzas: [
          [
            'No ano trezentos e quarenta e seis,',
            'Firmou-se o costume na mesa dos reis:',
            'Nenhum cornudo voltaria ao grilhão',
            'De puxar vagões no escuro do chão.',
          ],
          [
            'Ganhando estandarte na tropa primeira,',
            'Ficaram famosos em toda fronteira:',
            'Por três de Essência já tomam lugar,',
            'Abrindo ou fechando o caminho do azar!',
          ],
          [
            'Vinte anos mais tarde, ao tocar o tambor,',
            'Quando em Pyros subiu o cruel Belphegor,',
            'Já achou nas muralhas de cada nação',
            'A guarda chifruda de pé no portão!',
          ],
        ],
      },
    ],
  },

  // ==========================================================================
  // CAPÍTULO 2 (Canto VI): OS SEIS PACTUÁRIOS ELEMENTAIS (Anos 1.008–1.034 D.F.)
  // 9 nós = 6 ilustrados (kind: 'prelude', 4 estrofes) + 3 pontes (kind: 'interlude', hideCardArt: true, 3 estrofes) = 33 estrofes
  // ==========================================================================
  {
    id: 'canto_6m_collegium_pactuarios_elementais',
    isParallel: true,
    parentCantoId: 'canto_6_tratados',
    anchorNodeId: 'creature_59_silvathor',
    parallelCode: 'VI-H',
    shortTitle: 'Pactuários Elementais',
    cantoNumber: 'CAPÍTULO VI-H',
    eraNumber: 'Vª ERA • O COLLEGIUM DOS VOTOS ELEMENTAIS',
    periodLabel: 'Anos 1.008–1.034 D.F. • Grande Biblioteca & Fronteiras dos Tratados',
    title: 'Os Votos da Dupla Presença e o Collegium dos Pactuários Elementais',
    subtitle:
      'De como seis conjuradores encapuzados da Retaguarda selaram juramentos vitais com espíritos colossais das seis essências, projetando guardiões na Vanguarda enquanto cada feitiço entoado desperta a fúria elemental às suas costas',
    accentColor: '#38bdf8',
    bannerImage: '/assets/arena/domain_blue.png',
    nodes: [
      {
        id: 'node_6m_1_pactuario_eter',
        kind: 'prelude',
        cardId: 'neutral_171_pactuario_elemental_matriz',
        domain: 'neutral',
        title: 'Pactuário do Éter Primordial',
        subtitle:
          'No Ano 1.008 D.F., na Grande Biblioteca da Torre Cinzenta, o primeiro arcanista de manto prateado vincula sua respiração à montanha viva de mercúrio e cristal',
        yearLabel: 'Ano 1.008 D.F.',
        locationLabel: 'Claustro Cinzento da Grande Biblioteca',
        stanzas: [
          [
            'Passado o milênio da era contada,',
            'Sofria o arcanista na linha afastada:',
            'Enquanto escrevia seu lento feitiço,',
            'Ficava a Vanguarda sem guarda maciço!',
          ],
          [
            'Foi quando no Claustro de prata e metal',
            'Surgiu o Pactuário do Éter Primordial:',
            'De capuz sereno que guarda a sua paz,',
            'E um monstro de vidro curvado por trás!',
          ],
          [
            'Assim que na Arena seu voto ressoa,',
            'Um guarda na frente de pronto abençoa;',
            'E a cada magia que os lábios entoam,',
            'Mais cargas de Essência nos dedos ecoam!',
          ],
          [
            'Ouvindo o sussurro do mercúrio vivo,',
            'Vórtex mandou seu discípulo altivo',
            'Subir às geleiras onde o vento corta,',
            'Para abrir do inverno a segunda porta!',
          ],
        ],
      },
      {
        id: 'node_6m_2_pactuario_glacial',
        kind: 'prelude',
        cardId: 'blue_171_pactuario_elemental_gelo',
        domain: 'blue',
        title: 'Pactuário do Espírito Glacial',
        subtitle:
          'Em 1.012 D.F., nos picos de Vórtex, um criomante jura jamais deixar faltar geada ao espírito de estalactites que guarda sua frente e congela o maior campeão rival',
        yearLabel: 'Ano 1.012 D.F.',
        locationLabel: 'Santuário da Geada Alta (Vórtex)',
        stanzas: [
          [
            'Sozinho na neve do pico estrelado,',
            'Subiu o criomante de manto azulado;',
            'E o velho inverno desceu da nevasca,',
            'Com presas de gelo e couraça de lasca!',
          ],
          [
            'Firmaram ali o severo contrato:',
            'Servir à palavra do sábio no ato,',
            'Contanto que nunca faltasse na lida',
            'O sopro da geada que o norte convida!',
          ],
          [
            'Na linha da frente põe guarda fiel,',
            'Enquanto de longe dispara o tropel;',
            'E basta um feitiço no livro cantar,',
            'P’ra o forte inimigo no gelo travar!',
          ],
          [
            'A nova doutrina cruzou todo o mar,',
            'Fazendo os tratados em par despertar:',
            'Pois quem dominava feitiço e fileira',
            'Valia por dois sob a mesma bandeira!',
          ],
        ],
      },
      {
        id: 'node_6m_3_interlude_dupla_fileira',
        kind: 'interlude',
        cardId: 'blue_171_pactuario_elemental_gelo',
        hideCardArt: true,
        domain: 'red',
        title: 'A Tese da Dupla Presença na Grande Biblioteca',
        subtitle:
          'No Ano 1.016 D.F., os mestres dos Trinta Grimórios codificam a escola pactuária, despertando a ambição das caldeiras de Pyros e das matas de Veridia',
        yearLabel: 'Ano 1.016 D.F.',
        locationLabel: 'Anfiteatro Tático da Torre Cinzenta',
        stanzas: [
          [
            'Nas aulas solenes do grande salão,',
            'Expôs o Collegium a nova lição:',
            '— "Não deve o conjuro viver separado',
            'Do escudo que guarda o terreno sagrado!"',
          ],
          [
            'Com Alcance longo na linha traseira,',
            'O mago comanda a batalha inteira;',
            'Enquanto na frente a forma invocada',
            'Aparava o bote da tropa avançada.',
          ],
          [
            'Ao verem a força de tal simetria,',
            'Pyros chamou sua brasa bravia;',
            'E logo em Veridia, na verde floresta,',
            'Fez-se nas raízes a força manifesta!',
          ],
        ],
      },
      {
        id: 'node_6m_4_pactuario_magmatico',
        kind: 'prelude',
        cardId: 'red_171_pactuario_elemental_chama',
        domain: 'red',
        title: 'Pactuário do Espírito Magmático',
        subtitle:
          'Em 1.019 D.F., junto às chaminés reais de Pyros, um piromante une a própria voz a um colosso de basalto fundido que varre em brasas toda a Vanguarda inimiga',
        yearLabel: 'Ano 1.019 D.F.',
        locationLabel: 'Galeria Piroclástica de Pyros',
        stanzas: [
          [
            'Na borda vermelha do poço fervente,',
            'Cantou o piromante de verbo ardente;',
            'E detrás dos ombros do vulto delgado,',
            'Ergueu-se o espírito em lava moldado!',
          ],
          [
            'Com olhos de brasa e presas de breu,',
            'Curvou-se às costas de quem o escolheu;',
            'Mandando à Vanguarda um guerreiro de ardor',
            'Pronto ao primeiro comando do autor!',
          ],
          [
            'A cada palavra que a boca dizia,',
            'Fervia nas costas a rubra agonia:',
            'Varrendo de fogo, num único açoite,',
            'Toda a Vanguarda que o cerco afoite!',
          ],
          [
            'Enquanto estalava na rocha o carvão,',
            'No sul Silvathor sacudia o sertão;',
            'E à sombra do grande patriarca desperto,',
            'Firmou-se na selva um voto mais perto!',
          ],
        ],
      },
      {
        id: 'node_6m_5_pactuario_silvestre',
        kind: 'prelude',
        cardId: 'green_171_pactuario_elemental_selva',
        domain: 'green',
        title: 'Pactuário do Espírito Silvestre',
        subtitle:
          'No Ano 1.023 D.F., um ano após o voo de Silvathor, uma xamã de Veridia sela paz com o espírito ancestral de pau-ferro, erguendo guarda robusta e nutrindo o campeão aliado',
        yearLabel: 'Ano 1.023 D.F.',
        locationLabel: 'Clareira do Coração de Raiz-Ferro (Veridia)',
        stanzas: [
          [
            'Pisando descalça no musgo sagrado,',
            'Em paz caminhava a xamã do valado;',
            'E a mata inteira curvou seu vigor,',
            'Tomando figura de um ente protetor!',
          ],
          [
            'De tronco retorcido e olhar esmeralda,',
            'O espírito imenso seus passos respalda;',
            'Plantando na frente um guardião natural',
            'De três por três forças no solo vital!',
          ],
          [
            'Quando ela murmura o feitiço da terra,',
            'A seiva transborda no chefe de guerra:',
            'Dando mais ataque e duas vidas a mais',
            'Ao forte campeão das fileiras leais!',
          ],
          [
            'Faltavam somente no grande conselho',
            'Os dois horizontes de oposto espelho:',
            'A luz do Bastião onde o bronze reluz,',
            'E a fenda onde a sombra seu dente produz!',
          ],
        ],
      },
      {
        id: 'node_6m_6_interlude_sinodo_luz_sombra',
        kind: 'interlude',
        cardId: 'green_171_pactuario_elemental_selva',
        hideCardArt: true,
        domain: 'gold',
        title: 'O Debate do Voto Sagrado e do Preço da Sombra',
        subtitle:
          'No Ano 1.027 D.F., emissários de Solária e do Vale do Eclipse confrontam na Torre Cinzenta duas visões opostas sobre o preço espiritual de um Pactuário',
        yearLabel: 'Ano 1.027 D.F.',
        locationLabel: 'Câmara Diplomática dos Cinco Selos',
        stanzas: [
          [
            'Reuniu-se na Torre o severo debate',
            'Sobre o preço oculto daquele combate:',
            'Dizia Solária que o voto leal',
            'Devia ser graça e dever divinal.',
          ],
          [
            'Sorria em resposta a embaixada sombria:',
            '— "Não há juramento sem dar garantia;',
            'Quem quer que o Abismo lhe guarde o punhal,',
            'Entrega a própria sombra no negro portal!"',
          ],
          [
            'Assim partiram p’ra leste e p’ra oeste,',
            'Cada qual fiel à doutrina que veste;',
            'Gerando nos templos de ouro e de breu',
            'O par derradeiro que na Era nasceu!',
          ],
        ],
      },
      {
        id: 'node_6m_7_pactuario_solar',
        kind: 'prelude',
        cardId: 'gold_171_pactuario_elemental_sol',
        domain: 'gold',
        title: 'Pactuário do Espírito Solar',
        subtitle:
          'Em 1.030 D.F., nos claustros dourados de Solária, o teurgo consagra seu voto ao colosso de bronze celeste que blinda o campeão aliado com Escudo Divino a cada oração',
        yearLabel: 'Ano 1.030 D.F.',
        locationLabel: 'Claustro do Zênite (Solária)',
        stanzas: [
          [
            'Diante do altar dos sete faróis,',
            'Orou o teurgo lembrando os heróis;',
            'E em bronze celeste de chama dourada,',
            'Desceu o guardião da solar morada!',
          ],
          [
            'Armadura firme vestiu-lhe o semblante,',
            'E um guarda postou-se na linha adiante;',
            'Nenhum golpe alcança o devoto cantor',
            'Enquanto o colosso vigia em fulgor!',
          ],
          [
            'A cada feitiço ou prece sagrada,',
            'Desce sobre a tropa a redoma dourada:',
            'Cobrindo o mais forte guerreiro do chão',
            'Com Escudo Divino de pura proteção!',
          ],
          [
            'Mas lá no ocidente sem réstia de dia,',
            'Uma maga ousada seu pacto cumpria:',
            'Cortando no chão sua sombra comprida',
            'P’ra dar-lhe nas trevas faminta guarida!',
          ],
        ],
      },
      {
        id: 'node_6m_8_pactuario_umbral',
        kind: 'prelude',
        cardId: 'purple_171_pactuario_elemental_abismo',
        domain: 'purple',
        title: 'Pactuário do Espírito Umbral',
        subtitle:
          'No Ano 1.033 D.F., na Catedral de Obsidiana, uma conjuradora entrega a própria sombra ao Vazio, erguendo uma fera dentada que fere diretamente o Soberano rival a cada feitiço',
        yearLabel: 'Ano 1.033 D.F.',
        locationLabel: 'Átrio sem Sombra (Vale do Eclipse)',
        stanzas: [
          [
            'No Átrio de pedra onde a vela não arde,',
            'Entrou sem receio na névoa da tarde:',
            'Cedeu sua sombra ao abismo calado,',
            'E a sombra cresceu com colmilho afiado!',
          ],
          [
            'Com olhos violetas brilhando no escuro,',
            'Curvou-se o demônio qual tétrico muro;',
            'Lançando à Vanguarda um espectro feroz',
            'Atento ao menor estalar de sua voz!',
          ],
          [
            'Enquanto a senhora conjura de trás,',
            'O vulto sedento jamais fica em paz:',
            'A cada feitiço atravessa o salão,',
            'Rasgando dois pontos no rei de plantão!',
          ],
          [
            'Com ela fecharam-se os seis juramentos',
            'Que regem na Arena os vivos elementos;',
            'Unindo num só pergaminho imortal',
            'A mente do mago e o colosso ancestral!',
          ],
        ],
      },
      {
        id: 'node_6m_9_interlude_codice_pactuarios',
        kind: 'interlude',
        cardId: 'purple_171_pactuario_elemental_abismo',
        hideCardArt: true,
        domain: 'neutral',
        title: 'O Selamento do Códice das Seis Vozes',
        subtitle:
          'Em 1.034 D.F., o Collegium deposita os seis pergaminhos pactuários na Torre Cinzenta, onze anos antes do Concílio das Seis Asas de Seraphiel',
        yearLabel: 'Ano 1.034 D.F.',
        locationLabel: 'Abóbada dos Grimórios (Torre Cinzenta)',
        stanzas: [
          [
            'No ano mil e trinta e quatro marcado,',
            'Ficou na Biblioteca o Códice atado:',
            'Seis mantos de estudo, seis bestas atrás,',
            'Servindo aos tratados de guerra e de paz!',
          ],
          [
            'Por cinco de Essência qualquer Soberano',
            'Convoca a presença do par veterano:',
            'Escudo na frente p’ra o golpe conter,',
            'E voz na Retaguarda fazendo tremer!',
          ],
          [
            'Assim preparou-se o terreno florido',
            'Para o grande canto que vinha em seguido:',
            'Pois logo em Solária, num coro sem par,',
            'As seis brancas asas iam se abrir no ar!',
          ],
        ],
      },
    ],
  },
];
