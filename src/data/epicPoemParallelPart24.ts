import { EpicPoemCanto } from './epicPoemTypes';

/**
 * CANTOS PARALELOS — PARTE 24 (TRÍADE DA REFRAÇÃO — AURORA DO ANO 1 D.F.)
 * Trilogia canônica situada imediatamente após a destruição do Coroa-Prisma (entre o
 * Golpe Pentacromático no Monte Axial e o impacto dos Cinco Sóis sobre os vales mortais):
 * 1) A Aparição dos Seis Arautos do Prisma (#167)
 * 2) A Intervenção dos Seis Tecelões do Feixe (#168)
 * 3) O Voo dos Seis Presságios da Revoada (#169)
 */
export const EPIC_POEM_PARALLEL_PART_24: EpicPoemCanto[] = [
  // ==========================================================================
  // CAPÍTULO II-A: OS SEIS ARAUTOS DO PRISMA (1ª Hora do Ano 1 D.F.)
  // 9 nós = 6 com imagem (4 estrofes) + 3 pontes sem imagem (3 estrofes) = 33 estrofes
  // ==========================================================================
  {
    id: 'canto_2aa_arautos_prisma',
    isParallel: true,
    parentCantoId: 'canto_2_fratura',
    anchorNodeId: 'canto_2_prelude_cinco_sois',
    parallelCode: 'II-01',
    shortTitle: 'Arautos do Prisma',
    cantoNumber: 'CAPÍTULO II-A',
    eraNumber: 'Iª ERA • A PRIMEIRA HORA APÓS A DESTRUIÇÃO DO PRISMA',
    periodLabel: 'Ano 1 D.F. (1ª Hora) • Zênite Partido sobre o Monte Axial',
    title: 'O Despertar dos Seis Arautos no Zênite Partido',
    subtitle:
      'De como, no primeiro segundo após o Golpe Pentacromático partir o Coroa-Prisma, sua alma despedaçada encarnou na Matriz Primordial e nos cinco Arautos elementais suspensos sobre Vaeloria',
    accentColor: '#e2e8f0',
    bannerImage: '/assets/arena/tabletop_neutral.png',
    nodes: [
      {
        id: 'node_2aa_1_matriz_prisma',
        kind: 'creature',
        cardId: 'neutral_167_arauto_prisma_matriz',
        domain: 'neutral',
        title: 'Matriz do Prisma Primordial',
        subtitle:
          'O coração diamantino e ciclópico que permaneceu suspenso no eixo do céu quando as seis faces do Coroa-Prisma se partiram',
        yearLabel: 'Ano 1 D.F. • 1ª Hora',
        locationLabel: 'Eixo Partido do Zênite',
        stanzas: [
          [
            'Mal desceu o martelo e o trovão reboou,',
            'O grande Coroa-Prisma nos ares rachou;',
            'Mas antes que o caco caísse no chão,',
            'Abriu-se no centro uma estranha visão!',
          ],
          [
            'Pois o astro quebrado não era só cal,',
            'Guardava lá dentro um espírito imortal:',
            'Em anéis de mercúrio e platina sem cor,',
            'Despertou a Matriz do primeiro fulgor!',
          ],
          [
            'Um olho ciclópico, branco e profundo,',
            'Mirou lá do alto a vertigem do mundo;',
            'No peito um diamante girava em clarão,',
            'Sangrando em silêncio a quíntupla refração!',
          ],
          [
            '— "Partistes meu corpo!" — cantou no vazio,',
            'Com voz que era brasa, floresta e arrepio;',
            '— "Agora de cada faceta caída',
            'Erguer-se-á um Arauto com sede de vida!"',
          ],
        ],
      },
      {
        id: 'node_2aa_2_arauto_supernova',
        kind: 'creature',
        cardId: 'red_167_arauto_prisma_chama',
        domain: 'red',
        title: 'Arauto da Supernova Prismática',
        subtitle:
          'A primeira consciência desprendida da Matriz, nascida da faceta rubra em ebulição sobre as cordilheiras do norte',
        yearLabel: 'Ano 1 D.F. • 1ª Hora',
        locationLabel: 'Abóbada Ardente do Norte',
        stanzas: [
          [
            'Da fenda vermelha do peito central,',
            'Saltou o primeiro avatar elemental:',
            'O Arauto da Supernova, em basalto e carvão,',
            'Trazendo uma estrela fundida ao pulmão!',
          ],
          [
            'Ao redor de sua fronte girava inclemente',
            'Um halo forjado em escória candente;',
            'Onde antes dormia o silêncio polar,',
            'Seu sopro incendiou as camadas do ar!',
          ],
          [
            'Vulcanis, no cume, ergueu o olhar,',
            'Vendo aquele espírito em chamas bailar;',
            'Não era um escravo da forja mortal,',
            'Mas a própria paixão da centelha inaugural!',
          ],
          [
            'Varrendo as alturas num rastro encarnado,',
            'Deixou todo o norte de fogo banhado;',
            'Enquanto no extremo contrário do véu,',
            'O segundo Arauto gelava o alto céu!',
          ],
        ],
      },
      {
        id: 'node_2aa_3_bridge_fogo_gelo',
        kind: 'interlude',
        cardId: 'red_167_arauto_prisma_chama',
        hideCardArt: true,
        domain: 'blue',
        title: 'A Divisão da Temperatura Cósmica',
        subtitle:
          'Quando o calor serpeante da Supernova obrigou o próprio éter a condensar seu avesso glacial',
        yearLabel: 'Ano 1 D.F. • 1ª Hora',
        locationLabel: 'Estratosfera do Monte Axial',
        stanzas: [
          [
            'Até aquele instante, na eterna planura,',
            'O ar não sabia o que é febre ou friura;',
            'Mas quando a Supernova rasgou a amplidão,',
            'Nasceu por contraste a primeira estação.',
          ],
          [
            'Todo o calor do universo subiu',
            'P’ra o lado onde o raio vermelho seguiu;',
            'Deixando na banda contrária do espaço',
            'Um vácuo de prata, silêncio e estilhaço.',
          ],
          [
            'E lá onde a luz azulada coalhou,',
            'Um aro de gelo nos ventos girou;',
            'Abrindo a pupila serena e fatal',
            'Do ser que governa o minuto glacial!',
          ],
        ],
      },
      {
        id: 'node_2aa_4_arauto_zero',
        kind: 'creature',
        cardId: 'blue_167_arauto_prisma_gelo',
        domain: 'blue',
        title: 'Arauto do Zero Prismático',
        subtitle:
          'O avatar de safira e geada estelar que congelou o instante da queda para impedir que os mares evaporassem',
        yearLabel: 'Ano 1 D.F. • 1ª Hora',
        locationLabel: 'Zênite Polar de Vórtex',
        stanzas: [
          [
            'Vestido em cristais de safira polida,',
            'Com uma estrela fria no torso contida,',
            'O Arauto do Zero Prismático ergueu',
            'Os aros celestes que o polo teceu!',
          ],
          [
            'Seu olho ciclópico, claro e sereno,',
            'Mediu em silêncio o abismo terreno;',
            'E vendo que a chama ia o mar ressecar,',
            'Soprou a geada por cima do mar!',
          ],
          [
            'As nuvens pararam em formas perfeitas,',
            'Em leis matemáticas logo sujeitas;',
            'Até Chronos sentiu no seu eixo correr',
            'O frio compasso daquele poder!',
          ],
          [
            'Mas onde há clarão de safira e de brasa,',
            'A sombra projetada também abre a asa;',
            'E atrás dos dois astros, no vácuo sem fim,',
            'Abriu-se a pupila do eclipse carmim!',
          ],
        ],
      },
      {
        id: 'node_2aa_5_arauto_eclipse',
        kind: 'creature',
        cardId: 'purple_167_arauto_prisma_abismo',
        domain: 'purple',
        title: 'Arauto do Eclipse Prismático',
        subtitle:
          'A entidade nascida da primeira sombra projetada no universo após a quebra do sol branco',
        yearLabel: 'Ano 1 D.F. • 1ª Hora',
        locationLabel: 'Fenda Ocidental do Firmamento',
        stanzas: [
          [
            'Enquanto o Coroa-Prisma sozinho existia,',
            'Sombra nenhuma no mundo caía;',
            'Mas quando a Matriz em pedaços partiu,',
            'A costas da luz o Primeiro Véu riu!',
          ],
          [
            'Com anéis de ametista e um vórtice oco,',
            'Que suga as estrelas aos poucos, a pouco,',
            'O Arauto do Eclipse Prismático veio,',
            'Trazendo um abismo faminto no seio!',
          ],
          [
            'Ao simples fulgor de seu olho violeta,',
            'Curvou-se a coragem da carne incompleta;',
            'Pois ele ensinava à matéria recém-nascida',
            'Que toda jornada termina em partida.',
          ],
          [
            'Nocturnus saudou-o do vale sombrio,',
            'Sentindo na foice correr novo brio;',
            'Mas contra a penumbra que vinha tragar,',
            'Dois outros Arautos puseram-se a arfar!',
          ],
        ],
      },
      {
        id: 'node_2aa_6_bridge_vida_lei',
        kind: 'interlude',
        cardId: 'purple_167_arauto_prisma_abismo',
        hideCardArt: true,
        domain: 'green',
        title: 'A Resposta da Semente e da Coroa',
        subtitle:
          'Como as facetas esmeralda e dourada responderam à fome do Eclipse com o pulso do crescimento e da ordem',
        yearLabel: 'Ano 1 D.F. • 1ª Hora',
        locationLabel: 'Arco Meridional e Oriental do Céu',
        stanzas: [
          [
            'Se apenas o Fogo, a Geada e o Abismo',
            'Reinassem sozinhos no grande cataclismo,',
            'Vaeloria seria um deserto partido',
            'De cinza, de gelo e de pó esquecido.',
          ],
          [
            'Porém da Matriz que no centro sangrava,',
            'Um jorro esmeralda no vento brotava;',
            'Cheirando a resina, a chuva e a flor',
            'Que ainda dormiam sem nome ou sabor.',
          ],
          [
            'E junto ao verdor que descia pro sul,',
            'Rasgando a cortina de fumo e de azul,',
            'Brilhou no nascente o decreto real',
            'Do ouro mais puro da lei celestial!',
          ],
        ],
      },
      {
        id: 'node_2aa_7_arauto_raiz',
        kind: 'creature',
        cardId: 'green_167_arauto_prisma_selva',
        domain: 'green',
        title: 'Arauto da Raiz Prismática',
        subtitle:
          'O colosso astral de pau-ferro e esmeralda viva cujos anéis de cipós semearam o fôlego vital sobre o sul',
        yearLabel: 'Ano 1 D.F. • 1ª Hora',
        locationLabel: 'Abóbada Meridional sobre Veridia',
        stanzas: [
          [
            'Entrelaçando cipós sobre a rocha estelar,',
            'Com seiva brilhante no peito a pulsar,',
            'O Arauto da Raiz Prismática abriu',
            'Os braços de lenho que o mundo sentiu!',
          ],
          [
            'Em volta do torso giravam espinhos,',
            'Traçando nos ares fecundos caminhos;',
            'Cada gota verde que dele pingou',
            'Em musgo e floresta a montanha mudou!',
          ],
          [
            'Não teme ferida, pois torna a crescer,',
            'Dando força aos irmãos que com ele combater;',
            'Sylvanor, lá embaixo, estendeu sua mão,',
            'Bebendo o milagre daquela estação!',
          ],
          [
            'E enquanto o sul inteiro vestia o verdor,',
            'Ao leste subia o sexto esplendor:',
            'Fechando no céu a coroa sagrada',
            'Com o brilho supremo da nova alvorada!',
          ],
        ],
      },
      {
        id: 'node_2aa_8_arauto_zenite',
        kind: 'creature',
        cardId: 'gold_167_arauto_prisma_sol',
        domain: 'gold',
        title: 'Arauto do Zênite Prismático',
        subtitle:
          'O arconte-avatar da faceta dourada, portador do sol interior que estendeu o primeiro Escudo Divino sobre a criação',
        yearLabel: 'Ano 1 D.F. • 1ª Hora',
        locationLabel: 'Céu Oriental sobre Solária',
        stanzas: [
          [
            'Em ouro celeste e com runas de luz,',
            'Surgiu a presença que a Ordem conduz:',
            'O Arauto do Zênite Prismático ardia',
            'Qual sol em miniatura no berço do dia!',
          ],
          [
            'Vendo que o choque dos cinco elementos',
            'Podia rasgar os terrenos nascentes,',
            'Abriu sobre os justos seu manto sagrado,',
            'Deixando o horizonte de escudos cercado!',
          ],
          [
            'Curava na terra o que o raio feriu,',
            'Guardava o penhasco que quase ruiu;',
            'E o Titã da Alvorada curvou o joelho,',
            'Mirando nos ares tão puro conselho.',
          ],
          [
            'Estavam despertos os seis avatares,',
            'Pairando soberbos por cima dos mares;',
            'Mas os feixes que deles desciam sem freio',
            'Iam partir Vaeloria bem pelo meio!',
          ],
        ],
      },
      {
        id: 'node_2aa_9_bridge_chamado_teceloes',
        kind: 'interlude',
        cardId: 'gold_167_arauto_prisma_sol',
        hideCardArt: true,
        domain: 'neutral',
        title: 'O Dilúvio Vertical de Luz Bruta',
        subtitle:
          'Por que a fúria perpendicular dos seis Arautos exigiu o surgimento imediato dos Tecelões do Feixe',
        yearLabel: 'Ano 1 D.F. • Fim da 1ª Hora',
        locationLabel: 'Céu Central de Vaeloria',
        stanzas: [
          [
            'Seis colunas de Essência desciam a prumo,',
            'Sem curva, sem freio, sem leito e sem rumo;',
            'Batendo de frente no Monte Axial,',
            'Com peso capaz de fundir o pedestal!',
          ],
          [
            'Nem mesmo os Primogênitos tinham na palma',
            'Sutileza p’ra dobrar da luz a viva alma;',
            'Pois malho e espada só sabem quebrar,',
            'Não sabem o fio do espectro curvar.',
          ],
          [
            'Foi quando da poeira do vácuo estrelado,',
            'Com cachos de faíscas e olhar afilado,',
            'Seis vultos escuros estenderam a mão',
            'E dobraram os raios em plena amplidão!',
          ],
        ],
      },
    ],
  },

  // ==========================================================================
  // CAPÍTULO II-B: OS SEIS TECELÕES DO FEIXE (2ª Hora do Ano 1 D.F.)
  // 9 nós = 6 com imagem (4 estrofes) + 3 pontes sem imagem (3 estrofes) = 33 estrofes
  // ==========================================================================
  {
    id: 'canto_2ab_teceloes_feixe',
    isParallel: true,
    parentCantoId: 'canto_2_fratura',
    anchorNodeId: 'canto_2_prelude_cinco_sois',
    parallelCode: 'II-02',
    shortTitle: 'Tecelões do Feixe',
    cantoNumber: 'CAPÍTULO II-B',
    eraNumber: 'Iª ERA • A SEGUNDA HORA APÓS A DESTRUIÇÃO DO PRISMA',
    periodLabel: 'Ano 1 D.F. (2ª Hora) • Correntes Superiores do Firmamento',
    title: 'As Mãos que Curvaram o Dilúvio — Os Tecelões do Feixe',
    subtitle:
      'Como seis entidades silenciosas de sombra estelar tocaram os raios mortais recém-saídos dos Arautos e os desviaram em arcos perfeitos para os cinco cantos de Vaeloria',
    accentColor: '#38bdf8',
    bannerImage: '/assets/arena/domain_blue.png',
    nodes: [
      {
        id: 'node_2ab_1_tecelao_primordial',
        kind: 'creature',
        cardId: 'neutral_168_tecelao_feixe_matriz',
        domain: 'neutral',
        title: 'Tecelão do Feixe Primordial',
        subtitle:
          'O primeiro arquiteto de sombra prateada que segurou o eixo branco da Matriz para ancorar o centro do continente',
        yearLabel: 'Ano 1 D.F. • 2ª Hora',
        locationLabel: 'Coroa de Nuvens sobre a Fronteira Cinzenta',
        stanzas: [
          [
            'Nascido da cinza de prata e cristal',
            'Que sobrou nos dedos do Golpe fatal,',
            'O Tecelão do Feixe Primordial surgiu',
            'Onde o raio branco da Matriz caiu!',
          ],
          [
            'Seu corpo era noite salpicada de alvor,',
            'Seus olhos estreitos não tinham temor;',
            'Erguendo a mão negra na frente do rosto,',
            'Pegou o clarão como fio disposto!',
          ],
          [
            'Ao toque dos dedos, a lança de luz',
            'Curvou-se mansinha por onde ele induz;',
            'Sem queimar o centro do solo sagrado,',
            'Pousou como prata no vale acinzentado!',
          ],
          [
            'Com um gesto sereno aos cinco irmãos seus,',
            'Mostrou na teia os caminhos dos céus:',
            '— "Curvai cada feixe p’ra sua morada,',
            'Ou morre Vaeloria na primeira alvorada!"',
          ],
        ],
      },
      {
        id: 'node_2ab_2_tecelao_igneo',
        kind: 'creature',
        cardId: 'red_168_tecelao_feixe_chama',
        domain: 'red',
        title: 'Tecelão do Feixe Ígneo',
        subtitle:
          'O espírito de brasa e fuligem que agarrou o jorro da Supernova e o arqueou rumo às montanhas boreais de Pyros',
        yearLabel: 'Ano 1 D.F. • 2ª Hora',
        locationLabel: 'Rota Aérea das Caldeiras do Norte',
        stanzas: [
          [
            'Com fagulhas vivas nos cachos de fumo,',
            'Saltou o segundo p’ra dar novo rumo:',
            'O Tecelão do Feixe Ígneo enfrentou',
            'A língua de magma que do alto jorrou!',
          ],
          [
            'A pele de brasa estalou no contato,',
            'Mas seus cinco dedos fecharam no ato;',
            'Torcendo em diagonal a torrente vermelha,',
            'Lançou-a pro norte em ardente centelha!',
          ],
          [
            'Em vez de queimar as planícies do meio,',
            'O rio de fogo nos montes deu freio;',
            'Abrindo as crateras onde Pyros nasceu,',
            'Guardando nas rochas o dom prometeu!',
          ],
          [
            'Quem hoje na Arena o vê apontar,',
            'Sabe que um só raio faz o ferro estalar;',
            'Pois traz na mão escura a memória fiel',
            'Do dia em que dobrou um vulcão pelo céu!',
          ],
        ],
      },
      {
        id: 'node_2ab_3_bridge_arcos_frios',
        kind: 'interlude',
        cardId: 'red_168_tecelao_feixe_chama',
        hideCardArt: true,
        domain: 'blue',
        title: 'O Cruzamento dos Arcos no Horizonte',
        subtitle:
          'Quando o céu de Vaeloria se transformou num tear gigantesco de correntes cruzadas',
        yearLabel: 'Ano 1 D.F. • 2ª Hora',
        locationLabel: 'Abóbada de Vaeloria',
        stanzas: [
          [
            'Quem olhasse da terra naquele segundo',
            'Veria um tear sobre a face do mundo:',
            'Riscando as alturas de ponta a ponta,',
            'Em curvas que nenhuma crônica conta.',
          ],
          [
            'Faltava desviar a torrente polar,',
            'Que ia congelar o coração do pomar;',
            'E a fenda violeta do escuro pavor,',
            'Que descia faminta buscando o calor.',
          ],
          [
            'Nos ventos mais altos, lado a lado no véu,',
            'Dois novos Tecelões assumiram o papel:',
            'Um feito de aurora e poeira glacial,',
            'Outro feito de névoa e silêncio abissal!',
          ],
        ],
      },
      {
        id: 'node_2ab_4_tecelao_astral',
        kind: 'creature',
        cardId: 'blue_168_tecelao_feixe_gelo',
        domain: 'blue',
        title: 'Tecelão do Feixe Astral',
        subtitle:
          'O vulto da meia-noite polar que conduziu o raio do Zero Prismático até os arquipélagos e geleiras de Vórtex',
        yearLabel: 'Ano 1 D.F. • 2ª Hora',
        locationLabel: 'Corredor das Auroras Polares',
        stanzas: [
          [
            'Coberto de geada e poeira de estrela,',
            'Surgiu quem governa a nevasca e a congela:',
            'O Tecelão do Feixe Astral estendeu',
            'Os dedos escuros no jorro do céu!',
          ],
          [
            'A luz de safira, cortante qual faca,',
            'Ao toque sutil fez-se mansa e opaca;',
            'Deslizando num arco de fino cristal',
            'Até as ilhas altas do mar boreal!',
          ],
          [
            'Onde a ponta do feixe tocou o oceano,',
            'Subiram geleiras de porte soberano;',
            'Deixando as águas mornas do resto correr,',
            'Para o peixe nadar e o navio viver!',
          ],
          [
            'Ainda hoje, se toca um guerreiro rival,',
            'Prende-lhe o passo num selo invernal;',
            'Enquanto à sua esquerda, na treva sem fim,',
            'Seu irmão dedilhava a corda carmim!',
          ],
        ],
      },
      {
        id: 'node_2ab_5_tecelao_umbral',
        kind: 'creature',
        cardId: 'purple_168_tecelao_feixe_abismo',
        domain: 'purple',
        title: 'Tecelão do Feixe Umbral',
        subtitle:
          'A entidade de faíscas nebulosas que recolheu o feixe do Eclipse e o enterrou nas gargantas profundas do oeste',
        yearLabel: 'Ano 1 D.F. • 2ª Hora',
        locationLabel: 'Céu Ocidental sobre o Vale do Eclipse',
        stanzas: [
          [
            'Onde a fenda violeta rasgava o espaço,',
            'Sugando o alento num frio cansaço,',
            'O Tecelão do Feixe Umbral inclinou',
            'A fronte onde a névoa noturna brilhou!',
          ],
          [
            'Como harpa funesta tangida sem dó,',
            'Puxou para o oeste o relâmpago só;',
            'Cravando na rocha do vale profundo',
            'A porta secreta das criptas do mundo!',
          ],
          [
            'Com o que sobrou da energia drenada,',
            'Deu fôlego à terra recém-machucada;',
            'Ensinando que a sombra que sabe colher',
            'Também guarda a força de quem vai reger!',
          ],
          [
            'Restavam no alto dois rios de luz:',
            'O verde que nutre e o ouro que conduz;',
            'E para guiá-los ao pouso final,',
            'Surgiram os gêmeos do alento vital!',
          ],
        ],
      },
      {
        id: 'node_2ab_6_bridge_seiva_ouro',
        kind: 'interlude',
        cardId: 'purple_168_tecelao_feixe_abismo',
        hideCardArt: true,
        domain: 'gold',
        title: 'As Duas Cordas da Esperança',
        subtitle:
          'A harmonia entre o feixe esmeralda do sul e o feixe solar do leste nos últimos minutos da Segunda Hora',
        yearLabel: 'Ano 1 D.F. • 2ª Hora',
        locationLabel: 'Horizonte Sul-Oriental',
        stanzas: [
          [
            'Já quatro torrentes haviam achado',
            'No mapa terrestre seu canto sagrado;',
            'E o eixo do monte parou de rachar,',
            'Aliviado do peso que vinha esmagar.',
          ],
          [
            'Mas o sul esperava sedento a semente,',
            'E o leste pedia um farol permanente;',
            'Sem mata que cresça e sem lei que ampare,',
            'Não há povo livre que o tempo encare.',
          ],
          [
            'Por isso os dois últimos vultos da altura',
            'Teceram na brisa a mais bela gravura:',
            'Cruzando esmeralda com ouro de sol',
            'Num arco suave de vivo arrebol!',
          ],
        ],
      },
      {
        id: 'node_2ab_7_tecelao_silvestre',
        kind: 'creature',
        cardId: 'green_168_tecelao_feixe_selva',
        domain: 'green',
        title: 'Tecelão do Feixe Silvestre',
        subtitle:
          'O guardião de esporos bioluminescentes que derramou a corrente da Raiz Prismática sobre o berço de Veridia',
        yearLabel: 'Ano 1 D.F. • 2ª Hora',
        locationLabel: 'Dossel Nascente do Sul',
        stanzas: [
          [
            'Com esporos brilhantes na cabeleira escura,',
            'E olhos de jade mirando a planura,',
            'O Tecelão do Feixe Silvestre tomou',
            'A corda esmeralda que o céu derramou!',
          ],
          [
            'Não quis represá-la num único poço:',
            'Abriu-a em mil fios de verde alvoroço;',
            'Regando colinas, savanas e rios,',
            'Vestindo de folhas os montes vazios!',
          ],
          [
            'A cada criatura que a seiva bebia,',
            'O músculo inchava e a chaga sumia;',
            'Dando à alcateia do mundo nascente',
            'O vigor indomável da mata valente!',
          ],
          [
            'E vendo Veridia inteira florir,',
            'Olhou para o leste onde o sol ia abrir:',
            'Lá o sexto irmão, numa prece calada,',
            'Curvava nos dedos a primeira alvorada!',
          ],
        ],
      },
      {
        id: 'node_2ab_8_tecelao_solar',
        kind: 'creature',
        cardId: 'gold_168_tecelao_feixe_sol',
        domain: 'gold',
        title: 'Tecelão do Feixe Solar',
        subtitle:
          'A silhueta de noite cravejada de ouro que pousou suavemente o raio do Zênite sobre os planaltos de Solária',
        yearLabel: 'Ano 1 D.F. • 2ª Hora',
        locationLabel: 'Planalto Luminoso do Leste',
        stanzas: [
          [
            'Embora vestido de breu sideral,',
            'Trazia nos olhos a chama real:',
            'O Tecelão do Feixe Solar acolheu',
            'O raio dourado mais puro do céu!',
          ],
          [
            'Por isso não houve cratera ou estrago',
            'Quando o ouro pousou sobre o monte e o lago;',
            'Com mãos pacientes guiou o clarão',
            'Sem quebrar uma pedra sequer do torrão!',
          ],
          [
            'E aos seres feridos no grande estilhaço,',
            'Mandou um calor de ternura e abraço;',
            'Fechando os cortes que o vidro rasgou,',
            'Mostrando que a luz para a cura ficou!',
          ],
          [
            'Cumprida a tarefa dos seis Tecelões,',
            'Os feixes correram p’ra as cinco regiões;',
            'Mas das fitas de luz sacudidas no vento,',
            'Nasceu nos ares um terceiro portento!',
          ],
        ],
      },
      {
        id: 'node_2ab_9_bridge_espuma_asas',
        kind: 'interlude',
        cardId: 'gold_168_tecelao_feixe_sol',
        hideCardArt: true,
        domain: 'neutral',
        title: 'As Fitas que Ganharam Penas',
        subtitle:
          'De como as fagulhas desprendidas dos seis feixes curvados condensaram-se nos Presságios da Revoada',
        yearLabel: 'Ano 1 D.F. • Transição para a Alvorada',
        locationLabel: 'Nuvens Baixas de Vaeloria',
        stanzas: [
          [
            'Ao serem dobrados por mão tão potente,',
            'Os seis grandes feixes soltaram semente:',
            'Milhares de fitas de tinta e fulgor',
            'Dançando nas nuvens de cada setor.',
          ],
          [
            'Na brisa recém-acordada da terra,',
            'Aqueles retalhos desceram a serra;',
            'Tomando figura de mantos reais',
            'Que logo se abriam em bandos leais!',
          ],
          [
            'Eram os Presságios da primeira manhã,',
            'Voando na frente da chuva titã;',
            'Para que todo vivente olhasse pro véu',
            'E visse que o Tempo chegava do céu!',
          ],
        ],
      },
    ],
  },

  // ==========================================================================
  // CAPÍTULO II-C: OS SEIS PRESSÁGIOS DA REVOADA (Alvorada do Ano 1 D.F.)
  // 9 nós = 6 com imagem (4 estrofes) + 3 pontes sem imagem (3 estrofes) = 33 estrofes
  // ==========================================================================
  {
    id: 'canto_2ac_pressagios_revoada',
    isParallel: true,
    parentCantoId: 'canto_2_fratura',
    anchorNodeId: 'canto_2_prelude_cinco_sois',
    parallelCode: 'II-03',
    shortTitle: 'Presságios da Revoada',
    cantoNumber: 'CAPÍTULO II-C',
    eraNumber: 'Iª ERA • OS MENSAGEIROS ALADOS DA GRANDE FRATURA',
    periodLabel: 'Ano 1 D.F. (Alvorada) • Vales e Horizontes de Vaeloria',
    title: 'As Asas do Primeiro Anúncio — Os Presságios da Revoada',
    subtitle:
      'Como seis espectros monolíticos desfeitos em revoadas elementais cruzaram Vaeloria antes da queda dos meteoros, despertando os povos adormecidos para a Era das Cores',
    accentColor: '#a855f7',
    bannerImage: '/assets/arena/domain_purple.png',
    nodes: [
      {
        id: 'node_2ac_1_pressagio_primordial',
        kind: 'creature',
        cardId: 'neutral_169_pressagio_revoada_matriz',
        domain: 'neutral',
        title: 'Presságio da Revoada Primordial',
        subtitle:
          'O vulto monolítico de obsidiana e mercúrio líquido de cujo manto voaram os primeiros corvos prateados sobre o centro do mundo',
        yearLabel: 'Ano 1 D.F. • Alvorada',
        locationLabel: 'Planícies Centrais de Vaeloria',
        stanzas: [
          [
            'Sobre os campos imóveis onde o povo dormia,',
            'Sem saber que o relógio do mundo batia,',
            'Ergueu-se na bruma um monólito só,',
            'Com rosto de prisma brilhando sem pó!',
          ],
          [
            'Era o Presságio da Revoada Primordial,',
            'Trajado em fitas de prata e metal;',
            'De súbito a barra do manto rasgou,',
            'E em cem corvos vivos nos ares voou!',
          ],
          [
            'Batendo asas claras de puro mercúrio,',
            'Gritaram nas aldeias o primeiro augúrio;',
            'Quebrando o torpor da longa vigília,',
            'Chamando p’ra fora toda família!',
          ],
          [
            'Dois guardas alados deixou no caminho',
            'Para abrir a Vanguarda ao povo sozinho;',
            'Enquanto nas grotas onde a noite desceu,',
            'Um bando mais roxo nas sombras nasceu!',
          ],
        ],
      },
      {
        id: 'node_2ac_2_pressagio_umbral',
        kind: 'creature',
        cardId: 'purple_169_pressagio_revoada_abismo',
        domain: 'purple',
        title: 'Presságio da Revoada Umbral',
        subtitle:
          'A mortalha espectral do oeste cujos corvos violetas ensinaram às almas antigas o segredo da passagem e do retorno',
        yearLabel: 'Ano 1 D.F. • Alvorada',
        locationLabel: 'Desfiladeiros Ocidentais do Eclipse',
        stanzas: [
          [
            'Nas fendas do oeste, onde a pedra cedeu,',
            'O Presságio da Revoada Umbral apareceu;',
            'No peito um losango de crânio brilhava,',
            'E a sombra em redor como tinta bailava!',
          ],
          [
            'Das pregas escuras soltaram-se ao léu',
            'Mil corvos espectrais manchando o céu;',
            'Mas não traziam somente o pavor:',
            'Cantavam que a morte não apaga o valor!',
          ],
          [
            'Pois quem na jornada tombasse primeiro',
            'Teria na Cripta um abrigo guerreiro;',
            'Podendo ao chamado da asa voltar,',
            'Para o juramento deixado acabar!',
          ],
          [
            'Ouvindo o crocitar daquele estandarte,',
            'Os velhos perderam o medo que parte;',
            'Enquanto pro norte, entre cinza e vulcão,',
            'Subia das brasas um rubro esquadrão!',
          ],
        ],
      },
      {
        id: 'node_2ac_3_bridge_cinza_geada',
        kind: 'interlude',
        cardId: 'purple_169_pressagio_revoada_abismo',
        hideCardArt: true,
        domain: 'red',
        title: 'O Céu Dividido em Fagulhas e Cristais',
        subtitle:
          'Quando as revoadas do norte vulcânico e do mar polar cruzaram suas rotas sobre as montanhas',
        yearLabel: 'Ano 1 D.F. • Alvorada',
        locationLabel: 'Cordilheira Boreal',
        stanzas: [
          [
            'Nos picos do norte o espetáculo ardia:',
            'De um lado a fornalha que tudo lambia,',
            'Do outro a nevasca que vinha do mar,',
            'Disputando as nuvens palmo a palmo no ar!',
          ],
          [
            'Das cinzas quentes que o vento levou,',
            'Um bando de fogo as penas formou;',
            'E da espuma branca batida em maré,',
            'Nasceram gaivotas e corvos de fé.',
          ],
          [
            'Dois novos Presságios regiam o voo,',
            'Gritando nos montes seu duplo reboo:',
            'Um acendendo a coragem da mão,',
            'O outro limpando a cegueira e a ilusão!',
          ],
        ],
      },
      {
        id: 'node_2ac_4_pressagio_cinzento',
        kind: 'creature',
        cardId: 'red_169_pressagio_revoada_chama',
        domain: 'red',
        title: 'Presságio da Revoada Cinzenta',
        subtitle:
          'O espectro envolto em carvão e fumo ardente cujas aves de brasa varreram os obstáculos diante das tribos do norte',
        yearLabel: 'Ano 1 D.F. • Alvorada',
        locationLabel: 'Encostas Fumegantes de Pyros',
        stanzas: [
          [
            'De manto queimado em fuligem e ardor,',
            'Com rosto de brasa soprando vapor,',
            'O Presságio da Revoada Cinzenta subiu',
            'Da primeira cratera que o fogo abriu!',
          ],
          [
            'Não eram fagulhas perdidas no ar,',
            'Mas aves famintas prontas a atacar;',
            'Rasgando em rasante a pedreira caída,',
            'Abriram passagem p’ra a tribo corrida!',
          ],
          [
            'Nos peitos dos fortes puseram o calor',
            'Do Ímpeto vivo que ignora o temor;',
            'Dizendo no grito de brasa e carvão:',
            '— "Quem hesita no fogo vira cinza no chão!"',
          ],
          [
            'Kaelen, lá embaixo, viu o bando passar,',
            'E soube p’ra onde seu povo levar;',
            'Ao tempo em que Aldric olhava pro norte,',
            'Vendo nas nuvens de gelo outro porte!',
          ],
        ],
      },
      {
        id: 'node_2ac_5_pressagio_glacial',
        kind: 'creature',
        cardId: 'blue_169_pressagio_revoada_gelo',
        domain: 'blue',
        title: 'Presságio da Revoada Glacial',
        subtitle:
          'A entidade de safira e geada cujos corvos cristalinos afastaram os terrores cegos e trouxeram clareza aos primeiros magos',
        yearLabel: 'Ano 1 D.F. • Alvorada',
        locationLabel: 'Costas Geladas de Vórtex',
        stanzas: [
          [
            'Num redemoinho de neve e cristal,',
            'Desceu o Presságio da Revoada Glacial;',
            'Seu núcleo azulado brilhava qual farol',
            'Entre as nuvens rasgadas do novo arrebol!',
          ],
          [
            'De suas fitas de gelo partiram a voar',
            'Cem aves espelhadas por cima do mar;',
            'Levando no bico o saber esquecido,',
            'Devolvendo ao abismo o monstro atrevido!',
          ],
          [
            'Uma pena caída nas mãos do aprendiz',
            'Mostrou o desenho que o cosmos prediz;',
            'Foi lendo no voo daquela revoada',
            'Que Aldric ergueu sua abóbada azulada!',
          ],
          [
            'E lá para o sul e os campos do leste,',
            'Voaram os últimos bandos da veste:',
            'Gaviões de esmeralda na mata a brotar,',
            'E falcões dourados na luz a curar!',
          ],
        ],
      },
      {
        id: 'node_2ac_6_bridge_sul_leste',
        kind: 'interlude',
        cardId: 'blue_169_pressagio_revoada_gelo',
        hideCardArt: true,
        domain: 'green',
        title: 'O Encontro das Penas Verdes e Douradas',
        subtitle:
          'Como as duas últimas revoadas protegeram a fauna recém-desperta e os refugiados das planícies',
        yearLabel: 'Ano 1 D.F. • Alvorada',
        locationLabel: 'Fronteira entre Veridia e Solária',
        stanzas: [
          [
            'No sul os espinhos cresciam sem lei,',
            'Assustando o rebanho que não tinha rei;',
            'No leste os clarões cegavam a vista',
            'De quem procurava o caminho na crista.',
          ],
          [
            'Mas antes que o pânico fizesse raiz,',
            'Cantou nas alturas um par mais feliz:',
            'Asas de folha batendo em cadência,',
            'E penas de sol derramando clemência!',
          ],
          [
            'Assim se fechava o ciclo do ar,',
            'Antes da pedra pesada tombar:',
            'Arauto na fonte, Tecelão no caminho,',
            'E a Revoada guiando o pequeno e o ninho!',
          ],
        ],
      },
      {
        id: 'node_2ac_7_pressagio_espinhoso',
        kind: 'creature',
        cardId: 'green_169_pressagio_revoada_selva',
        domain: 'green',
        title: 'Presságio da Revoada Espinhosa',
        subtitle:
          'O vulto de pau-ferro e cipós vivos de cujo manto saltaram gaviões de esporos para escoltar Lyra e as criaturas da mata',
        yearLabel: 'Ano 1 D.F. • Alvorada',
        locationLabel: 'Orla Verdejante de Veridia',
        stanzas: [
          [
            'Coberto de sarças e musgo ancestral,',
            'Com uma semente acesa em cristal,',
            'O Presságio da Revoada Espinhosa se abriu',
            'No meio da selva que a chuva nutriu!',
          ],
          [
            'De seus ramos tortos voaram velozes',
            'Gaviões de esmeralda com gritos ferozes;',
            'Pousando na frente de cada clareira,',
            'Formaram de asas a viva barreira!',
          ],
          [
            'Se o fogo lambia a borda do chão,',
            'O bando curava o verde torrão;',
            'E Lyra seguiu o seu rastro brilhante',
            'Até encontrar o cortejo errante!',
          ],
          [
            'Enquanto nas serras banhadas de alvor,',
            'O sexto Presságio abria o esplendor:',
            'Desfazendo o ouro de seu manto real',
            'Num voo sagrado de cura imortal!',
          ],
        ],
      },
      {
        id: 'node_2ac_8_pressagio_solar',
        kind: 'creature',
        cardId: 'gold_169_pressagio_revoada_sol',
        domain: 'gold',
        title: 'Presságio da Revoada Solar',
        subtitle:
          'A aparição cerimonial de obsidiana e ouro líquido cujos falcões luminosos derramaram bálsamo sobre os sobreviventes do Dia dos Cinco Sóis',
        yearLabel: 'Ano 1 D.F. • Alvorada',
        locationLabel: 'Terraços Orientais de Solária',
        stanzas: [
          [
            'Solene qual templo suspenso no ar,',
            'Brilhou o Presságio da Revoada Solar;',
            'Trazendo no peito o losango do dia,',
            'E fitas de ouro em sagrada harmonia!',
          ],
          [
            'Quando o decreto dourado se abriu,',
            'Um bando de falcões celestes subiu;',
            'Onde sua sombra tocava o ferido,',
            'Cessava na carne o pranto e o gemido!',
          ],
          [
            'Coberto por um Escudo Divino de luz,',
            'Mostrou a Solária o dever que conduz:',
            'Que toda grandeza nascida do céu',
            'Existe p’ra ser dos humildes broquel!',
          ],
          [
            'Passada a revoada nos seis horizontes,',
            'Começou a chover o estilhaço nos montes;',
            'Mas graças à Tríade que o Prisma gerou,',
            'Vaeloria inteira de pé despertou!',
          ],
        ],
      },
      {
        id: 'node_2ac_9_bridge_queda_meteoros',
        kind: 'interlude',
        cardId: 'gold_169_pressagio_revoada_sol',
        hideCardArt: true,
        domain: 'red',
        title: 'O Início da Chuva sobre os Vales Mortais',
        subtitle:
          'Ponte direta para a marcha de Aldric, Kaelen, Zik e Lyra sob a Cortina de Fogo Abissal no Dia dos Cinco Sóis',
        yearLabel: 'Ano 1 D.F. • Meio-Dia',
        locationLabel: 'Vale das Cinzas Primeiras',
        stanzas: [
          [
            'No alto ficaram os Arautos velando,',
            'Nas nuvens os seis Tecelões sustentando,',
            'E em cada floresta, geleira ou vulcão,',
            'Um eco de penas guardando a canção.',
          ],
          [
            'Então os fragmentos pesados de rocha,',
            'Acesos nos ares qual múltipla tocha,',
            'Cruzaram as nuvens num urro profundo,',
            'Trazendo o batismo de fogo ao mundo!',
          ],
          [
            'Lá embaixo, nos vales de cinza e suor,',
            'Os povos já ouviam o grande clamor;',
            'E à frente da turba que punha-se a andar,',
            'Aldric ergueu seu cajado no ar!',
          ],
        ],
      },
    ],
  },
];
