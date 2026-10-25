import { EpicPoemCanto } from './epicPoemTypes';

/**
 * CANTOS PARALELOS — PARTE 2 (V-A, VI-A e VII-A)
 * Crônicas paralelas que aprofundam o submundo de ladrões de selos, as oficinas alquímicas bicolores
 * e o assalto final aos cofres do Relicário Astral, com interações diretas entre as cartas.
 */
export const EPIC_POEM_PARALLEL_PART_2: EpicPoemCanto[] = [
  // ==========================================================================
  // CANTO PARALELO V-A: CAÇADORES DE SELOS (702 D.F. — 835 D.F.)
  // ==========================================================================
  {
    id: 'canto_5a_conclaves_ocultos',
    isParallel: true,
    parentCantoId: 'canto_5_pacto',
    parallelCode: 'V-A',
    shortTitle: 'Caçadores de Selos',
    cantoNumber: 'CANTO PARALELO V-A',
    eraNumber: 'IVª ERA • CRÔNICA PARALELA',
    periodLabel: '702 D.F. — 835 D.F.',
    title: 'A Noite das Cem Memórias e os Caçadores de Selos',
    subtitle: 'O submundo de ladrões de grimórios, mercenários e armadilhas ocultas após a proibição da guerra aberta',
    accentColor: '#10b981',
    bannerImage: '/assets/arena/tabletop_green.png',
    nodes: [
      {
        id: 'node_5a_1_prelude_grimorio',
        kind: 'prelude',
        cardId: 'neutral_13_grimorio_astral',
        domain: 'neutral',
        title: 'O Contrabando do Tomo Viajante',
        subtitle: 'O roubo silencioso do Tomo das Estrelas Viajantes na Torre dos Cinco Selos e a fuga para a Fronteira Cinzenta',
        yearLabel: 'Ano 702 D.F.',
        locationLabel: 'Mercado Oculto da Fronteira Cinzenta',
        stanzas: [
          [
            'Quando o Pacto proibiu a guerra aberta pelo chão,',
            'A cobiça mergulhou nos becos frios da traição;',
            'Da alta Torre dos Cinco Selos, sob um véu de nevoeiro,',
            'Foi roubado o grande Tomo pelo bando forasteiro.',
          ],
          [
            'O Grimório das Estrelas Viajantes reluzia,',
            'Sussurrando velhos nomes de uma proibida magia;',
            'Para levá-lo em segredo pela estrada desolada,',
            'Contrataram o Capitão de cicatriz e fria espada.',
          ],
          [
            'Mas os bosques de Veridia e as catacumbas do terror',
            'Já sentiam nas raízes do artefato o resplendor;',
            'Tanto o Fosso de Vinhas quanto a Cripta de Espinheiro',
            'Aguardavam na penumbra o Mercenário aventureiro!',
          ],
        ],
      },
      {
        id: 'node_5a_2_mercenario_veterano',
        kind: 'creature',
        cardId: 'neutral_01_mercenario_veterano',
        domain: 'neutral',
        title: 'Capitão Mercenário da Fronteira',
        subtitle: 'O veterano de mil emboscadas que escoltou o Tomo Astral através das matas hostis e criptas traiçoeiras',
        yearLabel: 'Ano 740 D.F.',
        locationLabel: 'Ruínas da Estrada Cinzenta',
        stanzas: [
          [
            'O Capitão Mercenário da Fronteira caminhava,',
            'Com o Tomo das Estrelas preso à sela que montava;',
            'Seu olhar de veterano farejava a escuridão,',
            'Sabendo que cada sombra escondia uma traição.',
          ],
          [
            'De repente o solo abriu-se num rugido vegetal,',
            'E o Fosso de Vinhas vivas deu seu bote mortal;',
            'Com a lâmina de aço o Capitão cortou o cipó,',
            'Arrancando sua tropa do sufoco e do pó!',
          ],
          [
            'Fugindo da mata verde onde a flora o caçou,',
            'Nas Catacumbas Umbrais o Mercenário penetrou;',
            'Sem saber que lá no fundo das galerias sem luz,',
            'O Sarcófago de Espinhos era a sua nova cruz!',
          ],
        ],
      },
      {
        id: 'node_5a_3_fosso_vinhas',
        kind: 'creature',
        cardId: 'green_35_fosso_vinhas',
        domain: 'green',
        title: 'Fosso de Vinhas Estranguladoras',
        subtitle: 'A armadilha viva da Garganta de Raiz-Ferro acionada contra a caravana do Capitão Mercenário',
        yearLabel: 'Ano 785 D.F.',
        locationLabel: 'Garganta de Raiz-Ferro (Veridia)',
        stanzas: [
          [
            'Na Garganta de Raiz-Ferro, sob as folhas de esmeralda,',
            'O Fosso de Vinhas dorme onde a serra se desfralda;',
            'Basta o passo imprudente de um batedor invasor',
            'Para o chão virar garganta de faminto predador.',
          ],
          [
            'Quando a escolta do Capitão Mercenário ali pisou,',
            'A armadilha de Veridia num instante despertou;',
            'Cipós grossos como lanças enlaçaram seu corcel,',
            'Puxando os ladrões do Tomo para um pântano cruel.',
          ],
          [
            'Mesmo ferido e sangrando pelo abraço do espinheiro,',
            'O Capitão escapou do verde laço traiçoeiro;',
            'Mas as Vinhas o forçaram a descer pelo alçapão,',
            'Direto ao Sarcófago Negro que guardava a escuridão!',
          ],
        ],
      },
      {
        id: 'node_5a_4_cripta_espinhos',
        kind: 'creature',
        cardId: 'purple_34_cripta_espinhos',
        domain: 'purple',
        title: 'Sarcófago de Espinhos Negros',
        subtitle: 'O engenho de tortura umbral que selou os caçadores nas catacumbas e consagrou a arte das Reações Ocultas',
        yearLabel: 'Ano 835 D.F.',
        locationLabel: 'Catacumbas do Selo Partido',
        stanzas: [
          [
            'Nas Catacumbas do Selo, onde o sol jamais penetra,',
            'Jaz o Sarcófago horrendo de ferragem fria e tétrica;',
            'Fugindo do Fosso Verde que na mata o retalhou,',
            'O Capitão Mercenário nesta cripta se abrigou.',
          ],
          [
            'Quando os cães perseguiam o seu rastro ensanguentado,',
            'O veterano astuto fez o engodo calculado:',
            'Aflorou o Tomo Astral junto à tumba de metal,',
            'Disparando a Reação do Sarcófago letal!',
          ],
          [
            'Portas negras se fecharam com estalo de agonia,',
            'Cravando espinhos de ferro em quem na sombra corria;',
            'E assim os Soberanos aprenderam a lição:',
            'Que na Arena a Retaguarda vence pela emboscada e reação!',
          ],
        ],
      },
    ],
  },

  // ==========================================================================
  // CANTO PARALELO VI-A: OFICINAS BICOLORES (890 D.F. — 1.095 D.F.)
  // ==========================================================================
  {
    id: 'canto_6a_alquimistas_hibridos',
    isParallel: true,
    parentCantoId: 'canto_6_tratados',
    parallelCode: 'VI-A',
    shortTitle: 'Oficinas Bicolores',
    cantoNumber: 'CANTO PARALELO VI-A',
    eraNumber: 'Vª ERA • CRÔNICA PARALELA',
    periodLabel: '890 D.F. — 1.095 D.F.',
    title: 'As Oficinas Proibidas e os Pactos de Sangue Bicolor',
    subtitle: 'Quando piromantes, trolls e valquírias cruzaram suas essências para criar as primeiras reações em cadeia',
    accentColor: '#38bdf8',
    bannerImage: '/assets/arena/tabletop_blue.png',
    nodes: [
      {
        id: 'node_6a_1_prelude_portal_runas',
        kind: 'prelude',
        cardId: 'blue_10_portal_runas',
        domain: 'blue',
        title: 'O Laboratório das Duas Correntes',
        subtitle: 'A síntese entre o Códice da Ressonância Astral e a Fornalha Rubra na fronteira de Vórtex e Pyros',
        yearLabel: 'Ano 890 D.F.',
        locationLabel: 'Confluência de Vórtex e Pyros',
        stanzas: [
          [
            'Quando os Tratados de Sangue uniram os reinos rivais,',
            'Os alquimistas abriram os seus arcos ancestrais;',
            'Junto à Fornalha Rubra que ardia em brasa viva,',
            'Ergueram de Vórtex puro a Ressonância ativa.',
          ],
          [
            'O Portal de Runas Azuis começou a cintilar,',
            'Duplicando cada feitiço que cruzava o seu limiar;',
            'Ali o Piromante Rubro veio a chama conjurar,',
            'Enquanto o Troll de Veridia rugia para o enfrentar.',
          ],
          [
            'Não era mais o combate de um domínio isolado,',
            'Mas a dança das essências num circuito entrelaçado;',
            'Pois do alto do santuário, em dourado resplendor,',
            'As Valquírias observavam o crisol daquele ardor!',
          ],
        ],
      },
      {
        id: 'node_6a_2_lancador_chamas',
        kind: 'creature',
        cardId: 'red_97_lancador_chamas',
        domain: 'red',
        title: 'Piromante Lança-Chamas',
        subtitle: 'O mestre artilheiro de Pyros que usou a Ressonância de Vórtex para calcinar o Troll Regenerador',
        yearLabel: 'Ano 940 D.F.',
        locationLabel: 'Ponte das Runas Fumegantes',
        stanzas: [
          [
            'Sobre a Ponte Fumegante o Piromante se postou,',
            'E no Códice de Runas sua mana ele injetou;',
            'Cada fagulha lançada pelo braço abrasador',
            'Saía do arco azulado com o dobro do furor!',
          ],
          [
            'Contra o Troll Regenerador que do pântano subia,',
            'O Lança-Chamas disparou sua dupla artilharia;',
            'Duas línguas de incêndio atingiram o colosso,',
            'Queimando o couro musgoso até a medula do osso!',
          ],
          [
            'Mas em vez de cair morto sob o fogo carmesim,',
            'O monstro bebeu a dor num rugido sem ter fim;',
            'E o próprio Piromante viu com pasmo e admiração',
            'O poder da Fúria Verde despertar na combustão!',
          ],
        ],
      },
      {
        id: 'node_6a_3_troll_regenerador',
        kind: 'creature',
        cardId: 'green_07_troll',
        domain: 'green',
        title: 'Troll Regenerador do Pântano',
        subtitle: 'A besta indomável cuja carne se refez das chamas do Piromante para receber a graça de Solária',
        yearLabel: 'Ano 1.015 D.F.',
        locationLabel: 'Arena Experimental de Veridia-Solária',
        stanzas: [
          [
            'O Troll Regenerador do Pântano urrou de dor',
            'Quando o Piromante o feriu com seu duplo resplendor;',
            'Mas o sangue de Veridia ferveu dentro da ferida,',
            'Transformando a queimadura num vulcão de nova vida!',
          ],
          [
            'A carne carbonizada num instante se fechou,',
            'E com Fúria Crescente o seu punho agigantou;',
            'Avançando sobre as chamas num impulso colossal,',
            'Ele fez tremer as pedras do laboratório astral.',
          ],
          [
            'Vendo o monstro e o Piromante prontos para se matar,',
            'Os arautos de Solária fizeram a trombeta soar;',
            'E dos céus desceu o canto que a discórdia converteu:',
            'O Chamado das Valquírias que a ambos protegeu!',
          ],
        ],
      },
      {
        id: 'node_6a_4_chamado_valquirias',
        kind: 'creature',
        cardId: 'gold_35_chamado_valquirias',
        domain: 'gold',
        title: 'Chamado das Valquírias Solares',
        subtitle: 'A intervenção celeste que revestiu o Troll e o Piromante em Escudo Divino, selando o Pacto Bicolor',
        yearLabel: 'Ano 1.095 D.F.',
        locationLabel: 'Santuário dos Tratados Bicolores',
        stanzas: [
          [
            'Rompendo as nuvens de cinza com suas asas de luz,',
            'As Valquírias Solares desceram em áurea cruz;',
            'Seu cântico de batalha ecoou pelo salão,',
            'Unindo a Fúria de Veridia do Piromante ao clarão.',
          ],
          [
            'Sobre o Troll Regenerador estenderam seu broquel,',
            'E ao Piromante Lança-Chamas deram a graça do céu;',
            'Envoltos em luz dourada e Escudo Celestial,',
            'Os antigos inimigos formaram um par imortal!',
          ],
          [
            'O Portal de Runas Azuis gravou no livro da história',
            'Aquela sinergia ardente coroada de vitória;',
            'Assim nasceram os decks de aliança bicolor,',
            'Onde a chama, a mata e o ouro multiplicam seu valor!',
          ],
        ],
      },
    ],
  },

  // ==========================================================================
  // CANTO PARALELO VII-A: ASSALTO AO RELICÁRIO (1.180 D.F. — 1.240 D.F.)
  // ==========================================================================
  {
    id: 'canto_7a_ladroes_relicario',
    isParallel: true,
    parentCantoId: 'canto_7_presente',
    parallelCode: 'VII-A',
    shortTitle: 'Assalto ao Relicário',
    cantoNumber: 'CANTO PARALELO VII-A',
    eraNumber: 'VIª ERA • CRÔNICA PARALELA',
    periodLabel: '1.180 D.F. — 1.240 D.F.',
    title: 'O Assalto ao Relicário Astral e a Véspera do Sétimo Selo',
    subtitle: 'O confronto final entre Vesperion, Kongor e Zephaniel diante dos cofres de Ouro onde dormem as 891 Memórias',
    accentColor: '#eab308',
    bannerImage: '/assets/arena/tabletop_gold.png',
    nodes: [
      {
        id: 'node_7a_1_prelude_pedra_filosofal',
        kind: 'prelude',
        cardId: 'neutral_17_pedra_filosofal',
        domain: 'neutral',
        title: 'A Abertura dos Cofres de Ouro',
        subtitle: 'A transmutação da Pedra Filosofal que destrancou as abóbadas onde repousam as 891 Memórias Seladas',
        yearLabel: 'Ano 1.180 D.F.',
        locationLabel: 'Átrio do Relicário Astral',
        stanzas: [
          [
            'No coração de Vaeloria, sob a abóbada estelar,',
            'O Relicário das Eras guardava o espólio sem par;',
            'Oitocentas e noventa e uma memórias de poder',
            'Dormiam em pacotes áureos esperando renascer.',
          ],
          [
            'Com a Pedra Filosofal rubra como um vivo sol,',
            'Os alquimistas abriram o primeiro grande farol;',
            'O chumbo das velhas trancas em Ouro se converteu,',
            'E o perfume das relíquias pelos reinos se estendeu.',
          ],
          [
            'Atraído pelo brilho do tesouro primordial,',
            'Vesperion ergueu seu cetro da necrópole abissal;',
            'Mas Kongor veio da selva e Zephaniel do alto céu,',
            'Para impedir que o Lich rasgasse o sagrado véu!',
          ],
        ],
      },
      {
        id: 'node_7a_2_vesperion_lich',
        kind: 'creature',
        cardId: 'purple_07_lich',
        domain: 'purple',
        title: 'Vesperion, Arquimago Lich Imortal',
        subtitle: 'O senhor da não-vida que marchou sobre a Escadaria de Obsidiana para roubar as memórias e foi detido por Kongor',
        yearLabel: 'Ano 1.210 D.F.',
        locationLabel: 'Escadaria de Obsidiana do Relicário',
        stanzas: [
          [
            'Vesperion, o Lich Imortal, subiu o negro degrau,',
            'Com legiões de esqueletos sob o manto sepulcral;',
            'Seus olhos de fogo roxo miravam o cofre aberto,',
            'Querendo escravizar os selos com seu toque frio e esperto.',
          ],
          [
            'Ele estendeu a mão óssea para a Pedra Filosofal,',
            'Entoando um encantamento de drenagem abissal;',
            'Mas antes que sua garra tocasse o ouro sagrado,',
            'Um rugido de trovão fez o pórtico rachado!',
          ],
          [
            'Das colunas de esmeralda saltou a fera real:',
            'Kongor, de Costas Prateadas, num impacto descomunal;',
            'E o Arquimago Imortal teve seu escudo partido',
            'Pelo soco da floresta contra a morte desferido!',
          ],
        ],
      },
      {
        id: 'node_7a_3_kongor_gorila_alfa',
        kind: 'creature',
        cardId: 'green_32_gorila_alfa',
        domain: 'green',
        title: 'Kongor, Rei de Costas Prateadas',
        subtitle: 'O titã primata que esmagou a guarda óssea de Vesperion sob o olhar flamejante do Arcanjo Zephaniel',
        yearLabel: 'Ano 1.225 D.F.',
        locationLabel: 'Colunata dos Selos Partidos',
        stanzas: [
          [
            'Kongor bateu no seu peito como um sino de trovão,',
            'E esmagou de Vesperion a primeira legião;',
            'Ossos negros voaram longe pela grande colunata,',
            'Diante da força bruta do monarca de prata!',
          ],
          [
            'Vesperion lançou maldições de necromancia vil,',
            'Mas o Gorila Primata tinha a fúria de outros mil;',
            'Arrancando um pilar inteiro do templo monumental,',
            'Arremessou contra o Lich num embate colossal!',
          ],
          [
            'Quando o cajado de trevas e o punho da selva crua',
            'Iam partir o Relicário sob o eclipse da lua,',
            'O teto de cristal abriu-se num incêndio de esplendor:',
            'Era Zephaniel descendo com a espada do Senhor!',
          ],
        ],
      },
      {
        id: 'node_7a_4_zephaniel_serafim',
        kind: 'creature',
        cardId: 'gold_09_serafim_solar',
        domain: 'gold',
        title: 'Zephaniel, Arcanjo Solar do Zênite',
        subtitle: 'O juiz de seis asas que separou Vesperion e Kongor, instituindo a lei do Ouro e dos Pacotes Selados na Arena',
        yearLabel: 'Ano 1.240 D.F. (Presente)',
        locationLabel: 'Câmara Central do Relicário Astral',
        stanzas: [
          [
            'Com seis asas de ouro vivo que cegavam a escuridão,',
            'Zephaniel cravou a espada bem no centro do salão;',
            'Uma onda de luz solar empurrou para trás o mal,',
            'Separando Vesperion da fúria do rei animal!',
          ],
          [
            'Nem a garra do Lich morto, nem o punho de Kongor,',
            'Puderam cruzar a linha daquele fogo redentor;',
            'E a voz do Arcanjo ecoou pelos quatro cantos do mundo,',
            'Selando a lei do Relicário num decreto tão profundo:',
          ],
          [
            '"Ninguém tomará à força as memórias deste altar!',
            'Apenas quem na Arena souber com honra triunfar,',
            'Com o Ouro de suas vitórias poderá o selo abrir,',
            'E despertar os Campeões que o futuro vão decidir!"',
          ],
        ],
      },
    ],
  },
];
