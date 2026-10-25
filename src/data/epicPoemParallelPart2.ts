import { EpicPoemCanto } from './epicPoemTypes';

/**
 * CANTOS PARALELOS — PARTE 2 (V-A, VI-A e VII-A)
 * Crônicas paralelas que ocorrem no exato instante histórico de eventos-chave dos Cantos V, VI e VII,
 * formando cânticos contínuos de 12 estrofes onde as cartas interagem diretamente na mesma cena.
 */
export const EPIC_POEM_PARALLEL_PART_2: EpicPoemCanto[] = [
  // ==========================================================================
  // CANTO PARALELO V-A: CAÇADORES DE SELOS (Ano 689 D.F. • Subsolo da Torre dos Cinco Selos)
  // Amplia diretamente: "O Juramento da Torre dos Cinco Selos (Ano 689 D.F.)"
  // ==========================================================================
  {
    id: 'canto_5a_conclaves_ocultos',
    isParallel: true,
    parentCantoId: 'canto_5_pacto',
    parallelCode: 'V-A',
    shortTitle: 'Caçadores de Selos',
    cantoNumber: 'CANTO PARALELO V-A',
    eraNumber: 'IVª ERA • CRÔNICA PARALELA',
    periodLabel: 'Ano 689 D.F. • Subsolo da Torre dos Cinco Selos',
    title: 'A Noite das Cem Memórias e a Emboscada do Subsolo',
    subtitle: 'Como a tentativa de furto do Tomo Astral durante a assinatura do Pacto Cromático originou a lei das Reações e Emboscadas Ocultas',
    accentColor: '#10b981',
    bannerImage: '/assets/arena/tabletop_green.png',
    nodes: [
      {
        id: 'node_5a_1_prelude_grimorio',
        kind: 'prelude',
        cardId: 'neutral_13_grimorio_astral',
        domain: 'neutral',
        title: 'O Contrabando do Tomo Viajante',
        subtitle: 'Enquanto Valkyra colhia o sangue dos Soberanos no salão superior, sabotadores violaram o cofre do Tomo das Estrelas Viajantes',
        yearLabel: 'Ano 689 D.F.',
        locationLabel: 'Subsolo da Torre dos Cinco Selos',
        stanzas: [
          [
            'No Ano Seiscentos e Oitenta e Nove, à meia-noite fria,',
            'Enquanto no alto da Torre o grande Pacto nascia,',
            'Sabotadores desceram por um túnel esquecido,',
            'Buscando no subsolo o arquivo recém-esculpido.',
          ],
          [
            'Lá repousava o Tomo das Estrelas Viajantes,',
            'Gravando as Cem Memórias em páginas cintilantes;',
            'Queriam furtar a matriz antes do selo secar,',
            'Para impedir que a Arena pudesse a guerra encerrar.',
          ],
          [
            'Mas junto ao pedestal onde o Grimório fulgia,',
            'O Capitão Mercenário montava estreita vigia;',
            'E ao ver os ladrões de sombras tocarem o livro astral,',
            'Ergueu sua lâmina fria e deu o oculto sinal!',
          ],
        ],
      },
      {
        id: 'node_5a_2_mercenario_veterano',
        kind: 'creature',
        cardId: 'neutral_01_mercenario_veterano',
        domain: 'neutral',
        title: 'Capitão Mercenário da Fronteira',
        subtitle: 'O guarda veterano contratado por Valkyra que atraiu os invasores para o corredor de armadilhas sob a Torre',
        yearLabel: 'Ano 689 D.F.',
        locationLabel: 'Subsolo da Torre dos Cinco Selos',
        stanzas: [
          [
            'O Capitão Mercenário da Fronteira não recuou,',
            'Tomou o Tomo nos braços e o corredor alcançou;',
            'Fingindo fugir em pânico diante da horda assassina,',
            'Guiou os sabotadores direto para a ruína.',
          ],
          [
            'Ele havia preparado, com astúcia de veterano,',
            'Duas emboscadas vivas no pavimento subterrâneo;',
            'Pois sabia que a espada sozinha não bastaria',
            'Contra vinte caçadores sedentos de bruxaria.',
          ],
          [
            'Quando a turba invasora pisou na laje central,',
            'O Capitão cortou a corda do alçapão vegetal;',
            'E sob os pés dos ladrões que vinham na escuridão,',
            'Abriu-se o Fosso de Vinhas faminto de destruição!',
          ],
        ],
      },
      {
        id: 'node_5a_3_fosso_vinhas',
        kind: 'creature',
        cardId: 'green_35_fosso_vinhas',
        domain: 'green',
        title: 'Fosso de Vinhas Estranguladoras',
        subtitle: 'As raízes de Veridia plantadas sob as lajes da Torre que enlaçaram metade dos invasores num bote repentino',
        yearLabel: 'Ano 689 D.F.',
        locationLabel: 'Subsolo da Torre dos Cinco Selos',
        stanzas: [
          [
            'Das fendas da pedra fria brotou a flora letal:',
            'O Fosso de Vinhas vivas num bote descomunal!',
            'Cipós grossos como lanças subiram do abismo escuro,',
            'Prendendo os sabotadores contra a umidade do muro.',
          ],
          [
            'Metade do bando infame ficou ali sufocada,',
            'Com suas adagas presas na verde rede trançada;',
            'Mas os líderes da emboscada saltaram sobre o espinheiro,',
            'Tentando alcançar o Tomo nas mãos do audaz guerreiro.',
          ],
          [
            'O Capitão Mercenário sorriu por trás do broquel,',
            'Vendo os sobreviventes correrem pelo túnel cruel;',
            'Pois as Vinhas os forçaram a entrar no arco fechado',
            'Onde o Sarcófago Negro já estava engatilhado!',
          ],
        ],
      },
      {
        id: 'node_5a_4_cripta_espinhos',
        kind: 'creature',
        cardId: 'purple_34_cripta_espinhos',
        domain: 'purple',
        title: 'Sarcófago de Espinhos Negros',
        subtitle: 'A armadilha umbral que selou o destino dos últimos ladrões e inspirou Valkyra a consagrar a Retaguarda Oculta',
        yearLabel: 'Ano 689 D.F.',
        locationLabel: 'Subsolo da Torre dos Cinco Selos',
        stanzas: [
          [
            'No fim da galeria estreita, erguia-se a peça fria:',
            'O Sarcófago de Espinhos que a Umbra forneceram um dia;',
            'Assim que o líder invasor ergueu o punhal traidor,',
            'A mola oculta soltou-se com um estalo de horror!',
          ],
          [
            'As portas de ferro negro fecharam-se num segundo,',
            'Trancando os últimos ladrões num cárcere tão profundo;',
            'E o Tomo das Estrelas voltou intacto ao altar,',
            'Nos braços do Mercenário que soube o golpe esperar.',
          ],
          [
            'Descendo as escadas de pedra, Valkyra tudo assistiu,',
            'E no tratado do Pacto mais uma cláusula insculpia e abriu:',
            'Que toda carta na Arena guardada na escuridão',
            'Faria da Retaguarda o berço da Reação!',
          ],
        ],
      },
    ],
  },

  // ==========================================================================
  // CANTO PARALELO VI-A: OFICINAS BICOLORES (Ano 880 D.F. • Fronteira de Pyros e Solária)
  // Amplia diretamente: "A Concordata da Forja Solar (Ano 880 D.F.)"
  // ==========================================================================
  {
    id: 'canto_6a_alquimistas_hibridos',
    isParallel: true,
    parentCantoId: 'canto_6_tratados',
    parallelCode: 'VI-A',
    shortTitle: 'Oficinas Bicolores',
    cantoNumber: 'CANTO PARALELO VI-A',
    eraNumber: 'Vª ERA • CRÔNICA PARALELA',
    periodLabel: 'Ano 880 D.F. • Fronteira de Pyros e Solária',
    title: 'O Ritual da Forja Solar e o Primeiro Combo Bicolor',
    subtitle: 'A demonstração ao vivo no dia da Concordata em que o Portal de Runas, o Piromante, o Troll e as Valquírias fundiram quatro domínios em cadeia',
    accentColor: '#38bdf8',
    bannerImage: '/assets/arena/tabletop_blue.png',
    nodes: [
      {
        id: 'node_6a_1_prelude_portal_runas',
        kind: 'prelude',
        cardId: 'blue_10_portal_runas',
        domain: 'blue',
        title: 'O Laboratório das Duas Correntes',
        subtitle: 'A instalação do Códice da Ressonância Astral no centro da Forja Solar para testar a fusão dos domínios',
        yearLabel: 'Ano 880 D.F.',
        locationLabel: 'Fronteira de Pyros e Solária',
        stanzas: [
          [
            'No Ano Oitocentos e Oitenta, perante a Forja Solar,',
            'Reuniram-se os Soberanos para a Concordata assinar;',
            'Mas muitos duvidavam que cores tão diferentes',
            'Pudessem no mesmo Grimório somar as suas correntes.',
          ],
          [
            'Então no centro do pátio ergueram o grande anel:',
            'O Portal de Runas Azuis brilhando sob o dossel;',
            'Aquele Códice Astral de Vórtex tinha o condão',
            'De duplicar cada chama lançada em seu turbilhão.',
          ],
          [
            'Para provar aos monarcas do acordo a força real,',
            'Quatro cartas entraram no círculo experimental:',
            'O Piromante de Pyros, o Troll da mata sombria,',
            'O Portal de Ressonância e o coro da Valquíria!',
          ],
        ],
      },
      {
        id: 'node_6a_2_lancador_chamas',
        kind: 'creature',
        cardId: 'red_97_lancador_chamas',
        domain: 'red',
        title: 'Piromante Lança-Chamas',
        subtitle: 'O disparo flamejante através do Portal de Runas que iniciou a reação em cadeia diante dos reis',
        yearLabel: 'Ano 880 D.F.',
        locationLabel: 'Fronteira de Pyros e Solária',
        stanzas: [
          [
            'Primeiro o Piromante Lança-Chamas avançou,',
            'E contra o Portal de Runas seu jato ardente apontou;',
            'A labareda vermelha cruzou o arco anilado,',
            'Dividindo-se em dois feixes de fogo multiplicado!',
          ],
          [
            'Os reis de Pyros e Vórtex ergueram-se em aclamação,',
            'Vendo a ciência azulada dobrar a destruição;',
            'Mas os dois raios de brasa não iam se dissipar:',
            'Correram pelo ladrilho buscando a quem calcinar!',
          ],
          [
            'No outro lado da arena, rugindo como um vulcão,',
            'O Troll Regenerador aguardava a explosão;',
            'E o Piromante cravou no peito da fera bruta',
            'Aquela dupla rajada que abriu a segunda disputa!',
          ],
        ],
      },
      {
        id: 'node_6a_3_troll_regenerador',
        kind: 'creature',
        cardId: 'green_07_troll',
        domain: 'green',
        title: 'Troll Regenerador do Pântano',
        subtitle: 'A absorção da dupla rajada ígnea que despertou a Fúria Crescente e provou a sinergia entre dor e poder',
        yearLabel: 'Ano 880 D.F.',
        locationLabel: 'Fronteira de Pyros e Solária',
        stanzas: [
          [
            'Atingido duas vezes pelo clarão carmesim,',
            'O Troll Regenerador soltou um urro sem fim;',
            'Mas em vez de tombar morto no chão da Forja Solar,',
            'Sua carne de Veridia pôs-se logo a regenerar!',
          ],
          [
            'Cada impacto sofrido da chama duplicada',
            'Dobrou a Fúria Crescente na criatura blindada;',
            'Seus músculos engrossaram com a seiva do rancor,',
            'Convertendo o próprio dano em mais ataque e vigor!',
          ],
          [
            'Porém o couro ainda ardia à beira da exaustão,',
            'Prestes a consumir-se naquela imensa combustão;',
            'Foi quando os clérigos áureos ergueram a voz ao céu,',
            'Invocando sobre o monstro o seu dourado broquel!',
          ],
        ],
      },
      {
        id: 'node_6a_4_chamado_valquirias',
        kind: 'creature',
        cardId: 'gold_35_chamado_valquirias',
        domain: 'gold',
        title: 'Chamado das Valquírias Solares',
        subtitle: 'O fecho luminoso do ritual que revestiu o Troll e o Piromante em Escudo Divino, selando a Concordata',
        yearLabel: 'Ano 880 D.F.',
        locationLabel: 'Fronteira de Pyros e Solária',
        stanzas: [
          [
            'Ao som das trombetas claras, rasgando o céu do verão,',
            'O Chamado das Valquírias desceu sobre o pavilhão;',
            'Suas asas de ouro puro cobriram a arena inteira,',
            'Banhando o Troll e o Piromante na luz hospitaleira!',
          ],
          [
            'Um Escudo Celestial envolveu o colosso verde,',
            'E ao artilheiro das chamas deu proteção que não perde;',
            'Quatro forças se fundiram num único movimento:',
            'A runa, o fogo, a fúria e o divino firmamento!',
          ],
          [
            'Diante daquele prodígio que os olhos reais viram lá,',
            'Todos selaram a cera da grande Concordata já;',
            'Pois ficou provado ao mundo naquele dia imortal',
            'Que a união de duas cores cria o combo triunfal!',
          ],
        ],
      },
    ],
  },

  // ==========================================================================
  // CANTO PARALELO VII-A: ASSALTO AO RELICÁRIO (Ano 1.121 D.F. • Subsolo da Torre dos Cinco Selos)
  // Amplia diretamente: "O Estalo do Sétimo Selo (Ano 1.121 D.F.)"
  // ==========================================================================
  {
    id: 'canto_7a_ladroes_relicario',
    isParallel: true,
    parentCantoId: 'canto_7_presente',
    parallelCode: 'VII-A',
    shortTitle: 'Assalto ao Relicário',
    cantoNumber: 'CANTO PARALELO VII-A',
    eraNumber: 'VIª ERA • CRÔNICA PARALELA',
    periodLabel: 'Ano 1.121 D.F. • Subsolo da Torre dos Cinco Selos',
    title: 'A Noite da Fenda Áurea e o Decreto do Relicário',
    subtitle: 'O que realmente aconteceu no subsolo da Torre durante o Estalo do Sétimo Selo entre Vesperion, Kongor e o Arcanjo Zephaniel',
    accentColor: '#eab308',
    bannerImage: '/assets/arena/tabletop_gold.png',
    nodes: [
      {
        id: 'node_7a_1_prelude_pedra_filosofal',
        kind: 'prelude',
        cardId: 'neutral_17_pedra_filosofal',
        domain: 'neutral',
        title: 'A Abertura dos Cofres de Ouro',
        subtitle: 'A sobrecarga da Pedra Filosofal no sétimo alicerce que fez estalar o selo e revelou as 891 Memórias',
        yearLabel: 'Ano 1.121 D.F.',
        locationLabel: 'Subsolo da Torre dos Cinco Selos',
        stanzas: [
          [
            'No Ano Mil Cento e Vinte e Um, no fundo da fundação,',
            'O sétimo alicerce ardia em secreta transmutação;',
            'Cravada bem no centro da abóbada primordial,',
            'Pulsava em febre rubra a Pedra Filosofal.',
          ],
          [
            'Tanta energia acumulada nas eras de invocação',
            'Fez a Pedra converter a rocha bruta em clarão;',
            'Ouviram-se sete estalos no mármore secular,',
            'E o cofre das Oitocentas e Noventa e Uma abriu-se no ar!',
          ],
          [
            'O cheiro do Ouro puro e das relíquias sem véu',
            'Rompeu as travas da terra e subiu até o céu;',
            'E no mesmo instante exato em que a fenda se rasgou,',
            'Vesperion surgiu das sombras e Kongor na brecha entrou!',
          ],
        ],
      },
      {
        id: 'node_7a_2_vesperion_lich',
        kind: 'creature',
        cardId: 'purple_07_lich',
        domain: 'purple',
        title: 'Vesperion, Arquimago Lich Imortal',
        subtitle: 'A investida imediata do Lich Imortal sobre a fenda recém-aberta para tomar todas as memórias antes dos rivais',
        yearLabel: 'Ano 1.121 D.F.',
        locationLabel: 'Subsolo da Torre dos Cinco Selos',
        stanzas: [
          [
            'Através da rachadura que o Sétimo Selo abriu,',
            'Vesperion, o Lich Imortal, da névoa roxa emergiu;',
            'Seus dedos de osso antigo buscaram a Pedra ardente,',
            'Querendo drenar o cofre num golpe só e repente.',
          ],
          [
            '"Todas as almas gravadas serão meu próprio exército!"',
            'Bradou o Arquimago morto com seu esgar esquelético;',
            'E lançando correntes negras sobre o tesouro estelar,',
            'Começou as relíquias áureas para o seu manto puxar.',
          ],
          [
            'Mas antes que o necromante fechasse a mão no cristal,',
            'A parede do subsolo ruiu num urro brutal;',
            'Pois Kongor saltou da brecha com seus punhos de titã,',
            'Atacando o Lich sombrio pela glória do seu clã!',
          ],
        ],
      },
      {
        id: 'node_7a_3_kongor_gorila_alfa',
        kind: 'creature',
        cardId: 'green_32_gorila_alfa',
        domain: 'green',
        title: 'Kongor, Rei de Costas Prateadas',
        subtitle: 'O choque descomunal do Rei Gorila contra o escudo necromântico de Vesperion sobre o cofre aberto',
        yearLabel: 'Ano 1.121 D.F.',
        locationLabel: 'Subsolo da Torre dos Cinco Selos',
        stanzas: [
          [
            'Kongor, de Costas Prateadas, bateu no peito e rugiu,',
            'E sobre a guarda de ossos de Vesperion investiu;',
            'Com um soco que estremeceu as colunas do salão,',
            'Fez o cajado do Lich saltar longe pelo chão!',
          ],
          [
            'O Arquimago respondeu com rajadas de pavor,',
            'Enquanto o Gorila Alfa rasgava o véu de terror;',
            'Entre a morte congelada e a força da natureza,',
            'A fenda do Sétimo Selo tremia em sua incerteza!',
          ],
          [
            'As Oitocentas e Noventa e Uma memórias no ar',
            'Estavam prestes a romper-se e o mundo despedaçar;',
            'Foi quando o teto da cripta se abriu num raio de sol,',
            'E Zephaniel desceu armado como um celeste farol!',
          ],
        ],
      },
      {
        id: 'node_7a_4_zephaniel_serafim',
        kind: 'creature',
        cardId: 'gold_09_serafim_solar',
        domain: 'gold',
        title: 'Zephaniel, Arcanjo Solar do Zênite',
        subtitle: 'A sentença da espada flamejante que trancou as memórias em Pacotes Selados para os campeões da Arena',
        yearLabel: 'Ano 1.121 D.F.',
        locationLabel: 'Subsolo da Torre dos Cinco Selos',
        stanzas: [
          [
            'Batendo seis asas áureas no subsolo esfumaçado,',
            'Zephaniel cravou a lâmina bem no meio do tablado;',
            'A onda de fogo santo jogou Kongor para trás,',
            'E queimou de Vesperion o manto de treva audaz!',
          ],
          [
            'Tocando a Pedra Filosofal com a ponta de seu aço,',
            'O Arcanjo recolheu as relíquias num só abraço;',
            'Fundiu o Ouro derretido em Pacotes de esplendor,',
            'Trancando cada memória num cofre revelador!',
          ],
          [
            '"Nem a garra, nem a treva roubarão este poder!" —',
            'Trovejou o Serafim para a Torre inteira ver:',
            '"Só o Ouro conquistado nos duelos da razão',
            'Abrirá no Relicário a suprema coleção!"',
          ],
        ],
      },
    ],
  },
];
