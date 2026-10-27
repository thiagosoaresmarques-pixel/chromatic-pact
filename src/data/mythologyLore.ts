import { CardDefinition, Domain } from '../types/game';
import { LEGENDARY_CREATURE_BIOGRAPHIES } from './legendaryCreaturesLore';
import { EPIC_POEM_CREATURE_NODES_BY_CARD_ID } from './epicPoemData';

export interface TimelineMilestone {
  yearLabel: string;
  title: string;
  summary: string;
  sungCouplet: string;
  cardId: string;
}

export interface TimelineEra {
  id: string;
  eraNumber: string;
  periodLabel: string;
  title: string;
  subtitle: string;
  accentColor: string;
  bannerImage: string;
  proseOverview: string[];
  bardBallad: string[];
  milestones: TimelineMilestone[];
}

export interface MythologyCantoSection {
  id: string;
  heading: string;
  chronicleYear: string;
  proseParagraphs: string[];
  sungStanzas: string[][];
  featuredCardIds: string[];
}

export interface MythologyBook {
  id: string;
  romanNumeral: string;
  domain: Domain | 'all';
  title: string;
  subtitle: string;
  epigraph: string;
  accentColor: string;
  bannerImage: string;
  cantos: MythologyCantoSection[];
}

export interface CardMythologyEntry {
  cardId: string;
  yearLabel: string;
  eraTitle: string;
  locationLabel: string;
  proseStory: string;
  sungStanza: string[];
}

/**
 * LINHA DO TEMPO CRONOLÓGICA DE VAELORIA
 * Calendário Oficial: A.F. (Antes da Fratura do Coroa-Prisma) e D.F. (Depois da Fratura)
 */
export const TIMELINE_ERAS: TimelineEra[] = [
  {
    id: 'era_0_vigilia',
    eraNumber: 'ERA ZERO',
    periodLabel: '∞ A.F.',
    title: 'A Vigília Imóvel sob o Coroa-Prisma',
    subtitle: 'Quando o mundo de Vaeloria não conhecia sombra, estação nem morte',
    accentColor: '#e2e8f0',
    bannerImage: '/assets/arena/tabletop_neutral.png',
    proseOverview: [
      'Antes que os relógios de Vórtex tivessem ponteiros ou que as forjas de Pyros conhecessem a primeira fagulha, o continente de Vaeloria jazia sob o Coroa-Prisma: um sol hexagonal de luz branca absoluta suspenso no zênite do firmamento.',
      'Sob sua claridade imóvel, nenhuma folha caía nas matas, nenhuma maré subia nos mares e nenhum mortal envelhecia. Mas a perfeição sem mudança era também uma prisão de vidro: nada podia nascer, nada podia ser sonhado e nenhuma canção tinha fim.',
      'Foi no silêncio daquela vigília sem tempo que os Cinco Titãs Primogênitos — forjados a partir da própria crosta do mundo — ergueram cinco armas colossais contra o céu para inaugurar o fluxo do tempo.',
    ],
    bardBallad: [
      'Não havia aurora nem vinha o luar,',
      'O sol era branco, parado no ar;',
      'Sem vento nas velas, sem fogo no chão,',
      'O mundo dormia em fria perfeição.',
    ],
    milestones: [
      {
        yearLabel: '∞ A.F.',
        title: 'O Silêncio Cristalino',
        summary: 'Vaeloria repousa em estase perpétua sob os raios indivisos do Coroa-Prisma.',
        sungCouplet: 'Na luz sem mudança de um céu sem senhor, / Não havia ferida, nem glória, nem dor.',
        cardId: 'neutral_61_fragmento_coroa_prisma',
      },
      {
        yearLabel: '∞ A.F.',
        title: 'A Conspiração dos Cinco Primogênitos',
        summary: 'Vulcanis, Vorthurion, Malakor, Terrakhor e Aurelius reúnem-se no pico central do continente e forjam o Juramento da Ruptura.',
        sungCouplet: 'Cinco vozes antigas juraram no monte: / Partir o sol branco e rasgar o horizonte!',
        cardId: 'red_157_dragao_tiamat_carmesim',
      },
      {
        yearLabel: '∞ A.F.',
        title: 'O Golpe Pentacromático',
        summary: 'No último instante da Era Zero, o martelo primordial, o raio astral, a foice umbral, a presa tectônica e a lança solar atingem o Coroa-Prisma em uníssono.',
        sungCouplet: 'Subiu o martelo, brilhou o trovão, / E o astro supremo partiu-se em clarão!',
        cardId: 'neutral_55_ruptura_planar',
      },
    ],
  },
  {
    id: 'era_1_fratura',
    eraNumber: 'Iª ERA',
    periodLabel: '1 D.F. — 142 D.F.',
    title: 'A Grande Fratura e a Chuva de Estilhaços',
    subtitle: 'O nascimento das Cinco Correntes Cromáticas e da Fronteira Cinzenta',
    accentColor: '#f59e0b',
    bannerImage: '/assets/arena/domain_red.png',
    proseOverview: [
      'Com o estilhaçar do Coroa-Prisma no Ano 1 D.F. (Depois da Fratura), a luz branca decompôs-se em cinco rios colossais de Essência que despencaram sobre os extremos de Vaeloria, tingindo a geografia, a fauna e o sangue dos povos.',
      'Ao norte vulcânico jorrou a Corrente Rubra, abrindo as Caldeiras de Pyros; aos arquipélagos polares desceu a Corrente Safira de Vórtex; às fendas profundas do oeste escorreu a Corrente Umbral do Eclipse; ao sul selvagem brotou a Corrente Esmeralda de Veridia; e nos planaltos orientais pousou a Corrente Dourada de Solária.',
      'No umbigo do continente, onde caíram as cascas sem cor do astro partido, formou-se a Fronteira Cinzenta — uma terra neutra de cinza prateada e relíquias adormecidas.',
    ],
    bardBallad: [
      'Do branco partido nasceram as cores,',
      'Cinco astros acesos, cinco novos senhores:',
      'A Brasa, a Safira, o Eclipse e o Verdor,',
      'E o Ouro da Aurora em seu trono de alvor!',
    ],
    milestones: [
      {
        yearLabel: '1 D.F.',
        title: 'O Dia dos Cinco Sóis',
        summary: 'As cinco correntes cromáticas atingem a terra e despertam os Dragões Ancestrais de cada domínio.',
        sungCouplet: 'Caiu sobre a terra a chuva de cor, / Despertando o dragão de seu longo torpor.',
        cardId: 'red_08_dragao_vermelho',
      },
      {
        yearLabel: '39 D.F.',
        title: 'A Queda da Casca Cinzenta',
        summary: 'O núcleo descolorido do Prisma afunda no centro de Vaeloria, erguendo a Torre dos Cinco Selos.',
        sungCouplet: 'No centro do mapa, sem cor e sem rei, / Ergueu-se a muralha da antiga lei.',
        cardId: 'neutral_58_colosso_reliquia',
      },
      {
        yearLabel: '118 D.F.',
        title: 'O Despertar das Feras Primordiais',
        summary: 'Em Veridia, a seiva esmeralda agiganta a fauna pré-histórica, dando origem aos primeiros dinossauros-titãs e hidras.',
        sungCouplet: 'A mata bebeu a esmeralda do céu, / E o rugido das feras rasgou todo véu.',
        cardId: 'green_161_dragao_esmeralda_primordial',
      },
    ],
  },
  {
    id: 'era_2_cidadelas',
    eraNumber: 'IIª ERA',
    periodLabel: '143 D.F. — 410 D.F.',
    title: 'A Era das Cinco Cidadelas',
    subtitle: 'Quando a pedra, o bronze, a safira, a obsidiana e o ouro ganharam muralhas',
    accentColor: '#38bdf8',
    bannerImage: '/assets/arena/domain_blue.png',
    proseOverview: [
      'Passado o caos do primeiro século, os soberanos e artífices de cada corrente ergueram cinco capitais monumentais sobre os pontos de impacto dos fragmentos maiores do Prisma.',
      'Em Pyros foi fundada a Cidadela da Caldeira, onde rios de escória movem bigornas gigantescas. Em Vórtex ergueu-se o Observatório de Safira, cujos astrolábios medem o próprio destino. No Vale do Eclipse foi escavada a Catedral de Obsidiana, onde a morte é apenas promoção militar.',
      'Em Veridia cresceu o Círculo de Raiz-Ferro, entrelaçando carvalhos milenares e rocha viva; e em Solária foram consagradas as muralhas de mármore branco do Bastião dos Sete Sóis.',
    ],
    bardBallad: [
      'Cinco fortalezas tocaram o véu:',
      'Caldeira de bronze, safira no céu,',
      'Igreja de sombra e raiz imortal,',
      'E o Bastião Dourado de glória solar!',
    ],
    milestones: [
      {
        yearLabel: '164 D.F.',
        title: 'Acendimento da Bigorna Primordial',
        summary: 'Os ferreiros de Pyros represam o maior vulcão do norte para forjar armas vivas e colossos de basalto.',
        sungCouplet: 'Na Bigorna Rubra o martelo cantou, / E o ferro candente em guerreiro acordou.',
        cardId: 'red_165_bigorna_fogo_primordial',
      },
      {
        yearLabel: '240 D.F.',
        title: 'Alinhamento do Grande Planetário de Vórtex',
        summary: 'Os arquimagos de Safira concluem o Planetário Horológico, dominando a criomancia e a leitura do tempo.',
        sungCouplet: 'Giraram as luas de prata e cristal, / Prendendo o inverno num selo imortal.',
        cardId: 'blue_54_planetario_arcano',
      },
      {
        yearLabel: '388 D.F.',
        title: 'A Coroação da Corte Carmesim e do Trono Solar',
        summary: 'No mesmo ano, a Catedral de Obsidiana sela o Cálice do Sangue Imortal e Solária inaugura o Bastião dos Sete Sóis, fixando a rivalidade eterna entre Luz e Sombra.',
        sungCouplet: 'De um lado o Cálice em noite profunda, / Do outro a Alvorada que os campos inunda.',
        cardId: 'gold_157_dragao_soberano_alvorada',
      },
    ],
  },
  {
    id: 'era_3_guerra',
    eraNumber: 'IIIª ERA',
    periodLabel: '411 D.F. — 688 D.F.',
    title: 'A Guerra do Sangue Derramado e o Despertar de Kragmorth',
    subtitle: 'Três séculos de guerra total que quase afundaram Vaeloria no vazio',
    accentColor: '#ef4444',
    bannerImage: '/assets/arena/domain_purple.png',
    proseOverview: [
      'Na ambição de reunir os cinco fragmentos do Prisma sob uma única bandeira, os exércitos das Cinco Cidadelas marcharam uns contra os outros sem freios nem regras no Ano 411 D.F.',
      'Cidades inteiras foram incineradas por cataclismos vulcânicos, congeladas em geleiras eternas ou erguidas como legiões de mortos-vivos. O excesso de magia bélica rachou o subsolo de Veridia no Ano 599 D.F., despertando Kragmorth, O Devorador de Eras.',
      'Quando o continente inteiro começou a rachar em direção ao abismo, ficou claro que mais um século de guerra aberta extinguiria todas as cinco correntes.',
    ],
    bardBallad: [
      'Trezentos invernos de lança e carvão,',
      'Sangraram os rios, tremeu todo o chão;',
      'Quando Kragmorth ergueu-se faminto do pó,',
      'Dos cinco impérios restava um nó só!',
    ],
    milestones: [
      {
        yearLabel: '411 D.F.',
        title: 'A Batalha das Cinzas Partidas',
        summary: 'As legiões de Pyros e as falanges de Solária chocam-se nas planícies centrais durante quarenta dias sem noite.',
        sungCouplet: 'Choveram meteoros no escudo dourado, / Ficando o horizonte de brasa manchado.',
        cardId: 'red_29_meteoro_draconico',
      },
      {
        yearLabel: '532 D.F.',
        title: 'A Noite da Longa Exumação',
        summary: 'A Catedral de Obsidiana ergue simultaneamente os caídos de quatro exércitos, forçando Vórtex e Veridia a recuarem.',
        sungCouplet: 'Tocou o sino negro na cripta sem fim, / E os mortos marcharam em passo carmim.',
        cardId: 'purple_154_cavaleiro_morte_eterna',
      },
      {
        yearLabel: '599 D.F.',
        title: 'O Despertar de Kragmorth, O Devorador de Eras',
        summary: 'A carapaça continental rompe-se no sul e o maior colosso vivo de Vaeloria devora três fortalezas em uma única marcha.',
        sungCouplet: 'Montanha que anda com dentes de aço, / Engole muralhas a cada compasso!',
        cardId: 'green_86_tarrasque_desperto',
      },
    ],
  },
  {
    id: 'era_4_pacto',
    eraNumber: 'IVª ERA',
    periodLabel: '689 D.F. — 850 D.F.',
    title: 'A Assinatura do Pacto Cromático',
    subtitle: 'O nascimento dos Duelos Rituais, das Duas Fileiras e da Oferenda de Essência',
    accentColor: '#a855f7',
    bannerImage: '/assets/arena/domain_gold.png',
    proseOverview: [
      'No inverno de 689 D.F., Valkyra — guardiã da Fronteira Cinzenta — convocou os monarcas das Cinco Cidadelas à Torre dos Cinco Selos. Sobre a mesa de obsidiana e ouro, foi assinado o Pacto Cromático.',
      'Pela lei sagrada do Pacto, ficou proibida a guerra de extermínio em campo aberto. Toda disputa por território, relíquias ou soberania passou a ser decidida na Arena do Pacto: um campo ritual de duas fileiras (Vanguarda de Escudos e Retaguarda de Comando) onde cada Soberano traz exatamente 100 memórias encadernadas em um Grimório.',
      'Para invocar o poder das cartas, o Soberano realiza a Oferenda ao Prisma: dissolve uma memória por turno para gerar Essência (⚡) e Afinidade cromática.',
    ],
    bardBallad: [
      'Na Torre Cinzenta o tratado se fez:',
      'Cem cartas no livro de cada vez;',
      'Vanguarda na frente, comando detrás,',
      'No duelo de Essência decide-se a paz!',
    ],
    milestones: [
      {
        yearLabel: '689 D.F.',
        title: 'O Juramento da Torre dos Cinco Selos',
        summary: 'Valkyra e os Cinco Soberanos selam o Pacto Cromático, instituindo as regras da Arena 2×4 e dos Grimórios de 100 cartas.',
        sungCouplet: 'Cinco selos brilharam na mesa central, / Trocando o massacre por lei imortal.',
        cardId: 'neutral_55_ruptura_planar',
      },
      {
        yearLabel: '740 D.F.',
        title: 'A Codificação da Oferenda de Essência',
        summary: 'Os escribas do Conclave Cinzento padronizam os pergaminhos: até 3 ecos para tropas comuns e incomuns, 2 para campeões raros e 1 único eco para lendas vivas.',
        sungCouplet: 'Três soldados marcham na mesma fileira, / Mas só uma Lenda carrega a bandeira.',
        cardId: 'purple_06_tirano_ocular',
      },
    ],
  },
  {
    id: 'era_5_tratados',
    eraNumber: 'Vª ERA',
    periodLabel: '851 D.F. — 1.120 D.F.',
    title: 'A Era dos Dez Tratados Bicolores e dos Trinta Grimórios',
    subtitle: 'Quando duas cores uniram seus selos para criar novas doutrinas de guerra',
    accentColor: '#10b981',
    bannerImage: '/assets/arena/domain_green.png',
    proseOverview: [
      'Ao longo do nono século, os estrategistas perceberam que uma única cor possuía fraquezas naturais: a fúria de Pyros cansava diante das muralhas de Solária; a paciência de Vórtex sucumbia ao enxame de Veridia.',
      'Assim nasceram os Dez Tratados Bicolores: alianças históricas entre pares de domínios que deram origem aos 30 Grimórios Oficiais da Grande Biblioteca. Ferro vulcânico foi abençoado com luz solar; gelo rúnico foi temperado com sombras da cripta; e feras da selva receberam armaduras de brasa.',
    ],
    bardBallad: [
      'Quando duas correntes se juntam no mar,',
      'Nasce um novo Grimório difícil de dobrar:',
      'A Brasa com o Ouro, a Geada e o Terror,',
      'Trinta tomos escritos com sangue e fulgor!',
    ],
    milestones: [
      {
        yearLabel: '880 D.F.',
        title: 'A Concordata da Forja Solar (Rubro + Alvorada)',
        summary: 'Os armeiros de Pyros e os paladinos de Solária fundam as legiões blindadas de fogo consagrado.',
        sungCouplet: 'O malho da brasa e o escudo do sol / Marcharam unidos num mesmo farol.',
        cardId: 'gold_155_arconte_lanca_solar',
      },
      {
        yearLabel: '965 D.F.',
        title: 'O Pacto do Inverno Umbral (Safira + Eclipse)',
        summary: 'O Observatório de Vórtex e a Catedral de Obsidiana unem criomancia e necromancia nos Códices do Silêncio.',
        sungCouplet: 'Onde o gelo prendeu, a foice colheu; / No frio da cripta ninguém se moveu.',
        cardId: 'purple_116_devorador_mentes',
      },
      {
        yearLabel: '1.080 D.F.',
        title: 'O Grande Torneio dos Trinta Grimórios',
        summary: 'Na Arena Imperial, os 30 Grimórios clássicos atingem o equilíbrio tático perfeito reconhecido pelo Conclave.',
        sungCouplet: 'Trinta livros abertos no grande salão, / Cada qual com sua arte e sua canção.',
        cardId: 'blue_149_arquimago_safira',
      },
    ],
  },
  {
    id: 'era_6_presente',
    eraNumber: 'VIª ERA (PRESENTE)',
    periodLabel: '1.121 D.F. — 1.240 D.F.',
    title: 'O Eclipse do Sétimo Selo e a Abertura dos Relicários',
    subtitle: 'O tempo presente: fissuras na Fronteira Cinzenta e a ascensão de um novo Soberano',
    accentColor: '#eab308',
    bannerImage: '/assets/arena/tabletop_gold.png',
    proseOverview: [
      'Chegamos ao Ano 1.240 D.F. Após mais de meio milênio de estabilidade, os Cinco Selos da Torre Cinzenta começaram a vibrar com uma frequência desconhecida.',
      'Antigos cofres da Primeira Era — os Relicários — emergiram das fendas trazendo à tona 996 ecos de criaturas, feitiços e artefatos de todas as eras passadas. Ao mesmo tempo, vinte Senhores da Guerra rebeldes ocuparam as rotas da Campanha em cinco atos, desafiando a autoridade da Torre.',
      'Agora, o destino do Coroa-Prisma repousa nas mãos de quem abrir os Grimórios, atravessar a Expedição do Vazio e cantar a última estrofe de Vaeloria.',
    ],
    bardBallad: [
      'Mil duzentos e quarenta girou a estação,',
      'Os Selos antigos tremeram no chão;',
      'Abre o teu Grimório, ó novo Senhor,',
      'Que o Canto do Mundo reclama cantor!',
    ],
    milestones: [
      {
        yearLabel: '1.198 D.F.',
        title: 'A Abertura das Fendas do Vazio',
        summary: 'Surgem as rotas instáveis da Expedição do Vazio, onde Soberanos precisam improvisar grimórios em marcha.',
        sungCouplet: 'Na estrada partida onde a névoa conduz, / Só vence quem forja no escuro a sua luz.',
        cardId: 'purple_04_cefalita',
      },
      {
        yearLabel: '1.240 D.F.',
        title: 'A Convocação dos Novecentos e Noventa e Seis Ecos',
        summary: 'Todas as 996 cartas das seis eras despertam simultaneamente nos Relicários de Vaeloria.',
        sungCouplet: 'Novecentas e noventa e seis lendas no ar: / Qual delas tua voz hoje vai invocar?',
        cardId: 'gold_166_trono_soberano_sol',
      },
    ],
  },
];

/**
 * OS SETE LIVROS CANTADOS DO ATLAS MITOLÓGICO (PROSA + VERSO ILUSTRADO)
 */
export const MYTHOLOGY_BOOKS: MythologyBook[] = [
  {
    id: 'book_prelude',
    romanNumeral: 'PRELÚDIO',
    domain: 'all',
    title: 'O Canto da Primeira Luz e da Fratura',
    subtitle: 'De como o Coroa-Prisma foi partido e o Pacto Cromático foi jurado (∞ A.F. – 689 D.F.)',
    epigraph: '«Cantai, ó cronistas da Torre Cinzenta, o dia em que o branco aprendeu a sangrar em cinco cores.»',
    accentColor: '#f59e0b',
    bannerImage: '/assets/arena/tabletop_neutral.png',
    cantos: [
      {
        id: 'canto_p1',
        heading: 'Canto I — O Sol que Não Conhecia o Poente',
        chronicleYear: 'Era Zero (∞ A.F.)',
        proseParagraphs: [
          'Dizem as tábuas mais antigas da Torre dos Cinco Selos que, antes da contagem dos anos, Vaeloria era um espelho sem rugas. No alto do firmamento ardia o Coroa-Prisma, um astro de seis faces perfeitas cujo clarão branco impedia que qualquer sombra se deitasse sobre a relva. As árvores não cresciam nem secavam; os rios não corriam para o mar; e os corações dos primeiros seres batiam um único compasso interminável.',
          'Mas no silêncio daquela eternidade de porcelana, cinco espíritos primordiais ouviram o chamado daquilo que ainda não existia: o calor da paixão, o mistério do amanhã, a dignidade do fim, a fome de crescer e a justiça escolhida por vontade própria. No clímax daquela vigília imemorial, os Cinco Primogênitos subiram ao Monte Axial e golpearam o Coroa-Prisma, criando o primeiro segundo do tempo.',
        ],
        sungStanzas: [
          [
            'Escutai, viajantes da mesa e do dado,',
            'O conto do tempo que esteve parado:',
            'Brilhava no zênite um astro de cal,',
            'Sem noite, sem vento, sem bem e sem mal.',
          ],
          [
            'Mas cinco gigantes de antiga memória',
            'Quiseram dar sangue e dar rumo à história;',
            'Subiram ao pico de pedra e cristal,',
            'E deram no Prisma o golpe mortal!',
          ],
        ],
        featuredCardIds: [
          'neutral_10_valkyra_pentacromatica',
          'neutral_55_ruptura_planar',
          'neutral_58_colosso_reliquia',
        ],
      },
      {
        id: 'canto_p2',
        heading: 'Canto II — A Lei da Arena e da Oferenda',
        chronicleYear: 'Ano 689 D.F. (IVª Era)',
        proseParagraphs: [
          'Quando o astro se partiu, cada um dos cinco fragmentos tingiu uma ponta de Vaeloria, dando origem aos Cinco Domínios. Por quase setecentos anos, os herdeiros dessas correntes guerrearam até que o próprio continente ameaçou ruir sob os passos de Kragmorth e o peso dos cataclismos.',
          'Foi então que Valkyra ergueu a Bandeira Cinzenta e selou o Pacto Cromático: nunca mais duas nações destruiriam a terra com exércitos sem fim. Em vez disso, os Soberanos enfrentam-se no Tabuleiro Sagrado de duas linhas — quatro postos na Vanguarda para o choque do aço, quatro postos na Retaguarda para o comando arcano — sacrificando uma memória por turno na Oferenda de Essência.',
        ],
        sungStanzas: [
          [
            'Quatro colunas na linha de frente,',
            'Onde o escudo segura a torrente;',
            'Quatro colunas na linha de trás,',
            'Onde o feitiço desfaz e refaz!',
          ],
          [
            'Uma memória se entrega ao altar,',
            'Para a Essência e a Cor despertar;',
            'Cem pergaminhos compõem a canção,',
            'E vence na Arena quem tem mais visão!',
          ],
        ],
        featuredCardIds: [
          'green_86_tarrasque_desperto',
          'neutral_34_cavaleiro_planar',
          'neutral_60_trono_cinco_pactos',
        ],
      },
    ],
  },
  {
    id: 'book_red',
    romanNumeral: 'LIVRO I',
    domain: 'red',
    title: 'O Canto da Brasa Viva — As Caldeiras de Pyros',
    subtitle: 'A crônica do Domínio Rubro: ferreiros vulcânicos, dragões de escória e a Cidadela de Bronze',
    epigraph: '«Em Pyros não perguntamos quanto tempo dura a paz; perguntamos quão quente está a bigorna.»',
    accentColor: '#ef4444',
    bannerImage: '/assets/arena/domain_red.png',
    cantos: [
      {
        id: 'canto_red_1',
        heading: 'Canto I — A Forja sob o Vulcão e o Trono de Escória',
        chronicleYear: '1 D.F. — 1.240 D.F. (Domínio Rubro)',
        proseParagraphs: [
          'Ao norte de Vaeloria, onde o Fragmento Rubro afundou na cordilheira de basalto, a terra jamais esfriou. Lá ergue-se a Cidadela da Caldeira e os terraços suspensos da Cidadela de Bronze. Os filhos de Pyros acreditam que toda hesitação é ferrugem: por isso suas tropas dominam o Ímpeto, lançando-se ao ataque no mesmo instante em que pisam na arena.',
          'Acima das chaminés de enxofre reinam Igniskar, Tirano da Cratera, e o colossal Vulcanis, cujo martelo bateu na Bigorna da Chama Primordial as primeiras coroas dos reis da fornalha. Quando um Soberano Rubro vai à guerra, a própria armadura de seus guerreiros queima quem ousa golpeá-la.',
        ],
        sungStanzas: [
          [
            'Lá nas montanhas onde o ferro chora,',
            'O povo de Pyros não pede demora:',
            'Bate na bigorna o martelo ancestral,',
            'E salta da brasa a falange imortal!',
          ],
          [
            'Quando Igniskar abre as asas no norte,',
            'Sopra nas nuvens o vento da morte;',
            'Quem bate em seu peito de brasa e carvão,',
            'Vê derreter sua espada na mão!',
          ],
        ],
        featuredCardIds: [
          'red_08_dragao_vermelho',
          'red_157_dragao_tiamat_carmesim',
          'red_165_bigorna_fogo_primordial',
          'red_153_elemental_fornalha_viva',
        ],
      },
    ],
  },
  {
    id: 'book_blue',
    romanNumeral: 'LIVRO II',
    domain: 'blue',
    title: 'O Canto do Astrolábio — O Pináculo de Vórtex',
    subtitle: 'A crônica do Domínio Safira: arquimagos do tempo, fossas abissais e tempestades glaciais',
    epigraph: '«A espada mais rápida do mundo ainda precisa atravessar o segundo que nós congelamos.»',
    accentColor: '#38bdf8',
    bannerImage: '/assets/arena/domain_blue.png',
    cantos: [
      {
        id: 'canto_blue_1',
        heading: 'Canto I — O Observatório das Marés e do Gelo Rúnico',
        chronicleYear: '1 D.F. — 1.240 D.F. (Domínio Safira)',
        proseParagraphs: [
          'Nas ilhas verticais e geleiras suspensas de Vórtex, onde caiu o Fragmento de Safira, o vento sopra em espirais geométricas perfeitas. Ali o Conclave do Astrolábio construiu torres de prata e cristal que calculam o movimento das marés e das constelações.',
          'Os mestres de Vórtex raramente vencem pela força bruta imediata: eles congelam a Vanguarda inimiga em estátuas de geada rúnica, acumulam conhecimento comprando pergaminhos adicionais e aguardam nas sombras da Retaguarda até que Vorthurion ou os Krakens da Fossa Abissal varram o tabuleiro.',
        ],
        sungStanzas: [
          [
            'No alto Pináculo cercado de mar,',
            'Os sábios de Vórtex aprenderam a olhar:',
            'No giro das rodas de prata e safira,',
            'Congela o guerreiro antes mesmo da ira!',
          ],
          [
            'Se avanças correndo com lança na mão,',
            'Encontras um muro de gelo no chão;',
            'E quando o abismo desperta no sul,',
            'O céu inteiro se fecha em azul!',
          ],
        ],
        featuredCardIds: [
          'blue_06_dragao_azul',
          'blue_07_kraken',
          'blue_149_arquimago_safira',
          'blue_165_planetario_horologico',
        ],
      },
    ],
  },
  {
    id: 'book_purple',
    romanNumeral: 'LIVRO III',
    domain: 'purple',
    title: 'O Canto da Catedral Negra — O Vale do Eclipse',
    subtitle: 'A crônica do Domínio Umbral: a Corte Carmesim, os Inquisidores do Vazio e os Ossários',
    epigraph: '«Os vivos lutam temendo a queda; os nossos começam a lutar depois dela.»',
    accentColor: '#a855f7',
    bannerImage: '/assets/arena/domain_purple.png',
    cantos: [
      {
        id: 'canto_purple_1',
        heading: 'Canto I — Onde o Sino Fúnebre É Toque de Alvorada',
        chronicleYear: '1 D.F. — 1.240 D.F. (Domínio Umbral)',
        proseParagraphs: [
          'Nas gargantas profundas do oeste, onde o Fragmento Umbral abriu uma fenda permanente sob a lua negra, ergue-se a Catedral de Obsidiana. Governado pelos Reis-Liches da Coroa Psiônica, pelos Inquisidores da Máscara do Vazio e pelos nobres da Corte Carmesim, o Vale do Eclipse enxerga a Cripta não como um cemitério, mas como uma reserva estratégica.',
          'Suas criaturas drenam a vitalidade adversária a cada estocada, abatem colossos com um único Toque Letal de veneno abissal e retornam das tumbas com a habilidade Renascer enquanto o Cálice de Obsidiana do Sangue Imortal transborda.',
        ],
        sungStanzas: [
          [
            'Não chores o morto que cai no vallado,',
            'Pois sob o Eclipse ele é só convocado;',
            'Ao toque do sino da negra catedral,',
            'Levanta-se o osso em couraça real!',
          ],
          [
            'Com máscara fria de prata sem rosto,',
            'O Inquisidor cobra o último imposto;',
            'E o sangue que escorre na pedra do chão',
            'Renova a coroa do nosso barão!',
          ],
        ],
        featuredCardIds: [
          'purple_04_cefalita',
          'purple_06_tirano_ocular',
          'purple_116_devorador_mentes',
          'purple_165_calice_sangue_imortal',
        ],
      },
    ],
  },
  {
    id: 'book_green',
    romanNumeral: 'LIVRO IV',
    domain: 'green',
    title: 'O Canto da Raiz-Ferro — A Selva de Veridia',
    subtitle: 'A crônica do Domínio Esmeralda: círculos druídicos, feras pré-históricas e titãs vivos',
    epigraph: '«Erguei vossas torres o quão alto quiserdes; nossas raízes têm todo o tempo do mundo.»',
    accentColor: '#10b981',
    bannerImage: '/assets/arena/domain_green.png',
    cantos: [
      {
        id: 'canto_green_1',
        heading: 'Canto I — O Rugido que Faz Tremer as Muralhas',
        chronicleYear: '1 D.F. — 1.240 D.F. (Domínio Esmeralda)',
        proseParagraphs: [
          'No vasto continente meridional de Veridia, o Fragmento Esmeralda fundiu-se às raízes da terra, acelerando a força vital de tudo o que respira. Ali os Arquidruidas do Círculo de Raiz-Ferro não constroem castelos de alvenaria: eles despertam a própria floresta e caminham ao lado de predadores colossais.',
          'Enquanto o Lince Espectral da Névoa embosca batedores nas trilhas, o solo estremece sob os passos do Tatu-Titã Quebra-Rochas, do Crocodilo-Monólito do Pântano e do lendário Kragmorth, O Devorador de Eras — feras que regeneram suas feridas a cada turno e atropelam qualquer bloqueio.',
        ],
        sungStanzas: [
          [
            'Na mata fechada onde o sol é esmeralda,',
            'A pedra respira e a raiz se respalda;',
            'Caminha o colosso coberto de musgo,',
            'Partindo em gravetos o muro mais brusco!',
          ],
          [
            'Se feres a hidra, seu colo redobra,',
            'Se cercas o lince, só névoa te sobra;',
            'Pois quando Veridia desperta em furor,',
            'A própria floresta se faz caçador!',
          ],
        ],
        featuredCardIds: [
          'green_86_tarrasque_desperto',
          'green_04_pantera_miragem',
          'green_23_colosso_escavador',
          'green_155_ente_carvalho_anciao',
        ],
      },
    ],
  },
  {
    id: 'book_gold',
    romanNumeral: 'LIVRO V',
    domain: 'gold',
    title: 'O Canto dos Sete Sóis — O Bastião de Solária',
    subtitle: 'A crônica do Domínio Alvorada: falanges sagradas, arcanjos solares e autômatos reais',
    epigraph: '«Um escudo sozinho protege um homem; cem escudos alinhados protegem uma era.»',
    accentColor: '#eab308',
    bannerImage: '/assets/arena/domain_gold.png',
    cantos: [
      {
        id: 'canto_gold_1',
        heading: 'Canto I — A Muralha de Ouro Branco e as Asas da Lei',
        chronicleYear: '1 D.F. — 1.240 D.F. (Domínio Alvorada)',
        proseParagraphs: [
          'Nos planaltos luminosos do leste, onde o Fragmento Dourado pousou sem quebrar a rocha, ergue-se o Bastião dos Sete Sóis, capital de Solária. Ali a Ordem da Alvorada combina devoção marcial com engenharia relojoeira sagrada: paladinos juramentados marcham ombro a ombro com golens de adamantina e esfinges juízas.',
          'Acima das cúpulas douradas paira Aurelius, Soberano Dragão da Alvorada, e os serafins de seis asas. Na Arena, Solária transforma sua Vanguarda em uma cidadela intransponível com Guardiões de alta Armadura e Escudos Divinos que anulam o impacto inimigo.',
        ],
        sungStanzas: [
          [
            'Ao toque do bronze na torre dourada,',
            'Alinha-se a tropa na luz da alvorada:',
            'Escudo com escudo, sem brecha ou temor,',
            'Brilhando nas armas do nosso Senhor!',
          ],
          [
            'Do céu desce o canto de Aurelius real,',
            'Cobrindo os feridos num manto imortal;',
            'Quem tenta romper o Bastião de Solária',
            'Encontra de frente a muralha lendária!',
          ],
        ],
        featuredCardIds: [
          'gold_157_dragao_soberano_alvorada',
          'gold_20_androesfinge',
          'gold_24_tita_empirico',
          'gold_166_trono_soberano_sol',
        ],
      },
    ],
  },
  {
    id: 'book_neutral',
    romanNumeral: 'LIVRO VI',
    domain: 'neutral',
    title: 'O Canto da Fronteira Cinzenta e dos Dez Tratados',
    subtitle: 'A crônica do Conclave Cinzento e das 10 Alianças Bicolores que regem os 30 Grimórios',
    epigraph: '«Todas as cinco cores juraram na nossa mesa; por isso nossas portas se abrem a todas elas.»',
    accentColor: '#94a3b8',
    bannerImage: '/assets/arena/tabletop_neutral.png',
    cantos: [
      {
        id: 'canto_neutral_1',
        heading: 'Canto I — Os Guardiões da Torre dos Cinco Selos',
        chronicleYear: '39 D.F. — 1.240 D.F. (Domínio Neutro)',
        proseParagraphs: [
          'No coração geográfico de Vaeloria estende-se a Fronteira Cinzenta: a terra livre onde nenhuma cor reina sozinha e onde todas as caravanas, embaixadas e companhias mercenárias se encontram. Sob a regência de Valkyra, os artífices e cavaleiros cinzentos não exigem Afinidade de cor para atender ao chamado de um Soberano.',
          'Foi também nos salões da Torre dos Cinco Selos que foram redigidos os Dez Tratados Bicolores — as alianças históricas entre cada par de domínios que deram origem aos 30 Grimórios Oficiais disputados hoje na Arena.',
        ],
        sungStanzas: [
          [
            'Nem rubro de brasa, nem frio de mar,',
            'Na terra cinzenta qualquer um pode entrar;',
            'Aqui se assinaram os dez pergaminhos',
            'Que uniram em pares os cinco caminhos!',
          ],
          [
            'Valkyra vigia do alto do trono',
            'O mundo que um dia acordou de seu sono;',
            'E cada carta escrita no grande salão',
            'Tem parte na história e tem voz na canção!',
          ],
        ],
        featuredCardIds: [
          'neutral_10_valkyra_pentacromatica',
          'neutral_11_botas_aladas',
          'neutral_34_cavaleiro_planar',
          'neutral_58_colosso_reliquia',
        ],
      },
    ],
  },
];

const DOMAIN_META: Record<
  Domain,
  {
    region: string;
    citadel: string;
    sovereign: string;
    rhymeA: string;
    rhymeB: string;
  }
> = {
  red: {
    region: 'Caldeiras de Pyros',
    citadel: 'Cidadela da Caldeira',
    sovereign: 'Igniskar e Vulcanis',
    rhymeA: 'na brasa que ferve no monte do norte',
    rhymeB: 'levando na lâmina o incêndio e a sorte',
  },
  blue: {
    region: 'Arquipélago de Vórtex',
    citadel: 'Observatório de Safira',
    sovereign: 'Vorthurion e Hydrissa',
    rhymeA: 'onde o vento de gelo obedece ao cristal',
    rhymeB: 'prendendo o destino num selo imortal',
  },
  purple: {
    region: 'Vale do Eclipse',
    citadel: 'Catedral de Obsidiana',
    sovereign: 'Malakor e a Corte Carmesim',
    rhymeA: 'sob o véu de obsidiana da noite sem fim',
    rhymeB: 'erguendo das criptas o pacto carmim',
  },
  green: {
    region: 'Continente-Selva de Veridia',
    citadel: 'Círculo de Raiz-Ferro',
    sovereign: 'Kragmorth e Terrakhor',
    rhymeA: 'onde a mata ancestral rompe a pedra do chão',
    rhymeB: 'fazendo tremer toda a vã construção',
  },
  gold: {
    region: 'Planalto de Solária',
    citadel: 'Bastião dos Sete Sóis',
    sovereign: 'Aurelius e o Tribunal Solar',
    rhymeA: 'sob o brilho sagrado dos sete faróis',
    rhymeB: 'guardando a muralha dos antigos heróis',
  },
  neutral: {
    region: 'Fronteira Cinzenta',
    citadel: 'Torre dos Cinco Selos',
    sovereign: 'Valkyra, a Imperatriz Pentacromática',
    rhymeA: 'nos marcos cinzentos da antiga aliança',
    rhymeB: 'pesando o destino na mesma balança',
  },
};

/**
 * Gera a Crônica Histórica (para ser lida) e a Estrofe Rimada (para ser cantada),
 * além do Ano Cronológico oficial (D.F.), para QUALQUER uma das 996 cartas do jogo.
 */
export function getCardChronicleAndSong(card: CardDefinition): CardMythologyEntry {
  const bespokeLegendary = LEGENDARY_CREATURE_BIOGRAPHIES[card.id];
  const epicNode = EPIC_POEM_CREATURE_NODES_BY_CARD_ID[card.id];
  if (bespokeLegendary) {
    return {
      ...bespokeLegendary,
      sungStanza: epicNode ? epicNode.stanzas.flat() : bespokeLegendary.sungStanza,
    };
  }

  const meta = DOMAIN_META[card.domain] || DOMAIN_META.neutral;
  const numMatch = card.id.match(/_(\d+)_/);
  const cardNum = numMatch ? parseInt(numMatch[1], 10) : 1;

  // Determine chronological era and year based on rarity & card cycle number
  let yearNum = 210 + ((cardNum * 7 + card.cost * 19) % 980);
  let eraTitle = 'IIª Era — As Cinco Cidadelas';

  if (card.rarity === 'legendary' && card.cost >= 7) {
    yearNum = 12 + ((cardNum * 5) % 125);
    eraTitle = 'Iª Era — A Grande Fratura';
  } else if (cardNum <= 36) {
    yearNum = 155 + ((cardNum * 7) % 245);
    eraTitle = 'IIª Era — As Cinco Cidadelas';
  } else if (cardNum <= 72) {
    yearNum = 415 + ((cardNum * 6) % 265);
    eraTitle = 'IIIª Era — A Guerra do Sangue Derramado';
  } else if (cardNum <= 108) {
    yearNum = 692 + ((cardNum * 4) % 150);
    eraTitle = 'IVª Era — A Assinatura do Pacto';
  } else if (cardNum <= 146) {
    yearNum = 855 + ((cardNum * 5) % 255);
    eraTitle = 'Vª Era — Os Dez Tratados Bicolores';
  } else {
    yearNum = 1125 + ((cardNum * 3) % 115);
    eraTitle = 'VIª Era — O Eclipse do Sétimo Selo';
  }

  const yearLabel = `Ano ${yearNum} D.F.`;
  const shortName = card.name.split(',')[0].trim();
  const rowText =
    card.preferredRow === 'vanguard'
      ? 'na Linha de Escudos da Vanguarda'
      : 'no Círculo de Comando da Retaguarda';

  let proseStory = '';
  if (card.type === 'creature') {
    proseStory = `Registrado nos anais da ${meta.citadel} no ${yearLabel} (${eraTitle}), ${card.name} (${card.subtype}) ergueu-se nas ${meta.region} sob a bandeira de ${meta.sovereign}. Na doutrina do Pacto Cromático, combate ${rowText} com custo de ${card.cost}⚡ de Essência (${card.atk ?? 0} ATQ / ${card.hp ?? 0} VIDA${card.armor ? ` / ${card.armor} ARM` : ''}). ${card.description} Como recordam os bardos: "${card.flavorText}"`;
  } else if (card.type === 'spell') {
    proseStory = `Inscrito pela primeira vez nos pergaminhos da ${meta.citadel} no ${yearLabel} (${eraTitle}), o feitiço "${card.name}" (${card.subtype}) canaliza ${card.cost}⚡ de Essência das ${meta.region}. ${card.description} Entre os cronistas de Vaeloria, ficou imortalizado pelo verso: "${card.flavorText}"`;
  } else if (card.type === 'reaction') {
    proseStory = `Codificado pelos estrategistas das ${meta.region} no ${yearLabel} (${eraTitle}), o estratagema "${card.name}" (${card.subtype}) é preparado em segredo por ${card.cost}⚡ de Essência para surpreender o adversário. ${card.description} Nas crônicas da ${meta.citadel}, diz-se: "${card.flavorText}"`;
  } else {
    proseStory = `Consagrado nos cofres da ${meta.citadel} no ${yearLabel} (${eraTitle}), o artefato "${card.name}" (${card.subtype}) pulsa com a memória das ${meta.region}. Invocado por ${card.cost}⚡ de Essência, permanece em campo sustentando o Soberano: ${card.description} Como cantam os guardiões do Relicário: "${card.flavorText}"`;
  }

  // Build a 4-line rhymed ballad stanza specific to this card
  const sungStanza: string[] = [
    `No ${yearLabel}, ${meta.rhymeA},`,
    `Surgiu ${shortName}, ${meta.rhymeB};`,
    `«${card.flavorText.replace(/\.$/, '')}» —`,
    `Assim canta o bardo na ${meta.citadel}!`,
  ];

  return {
    cardId: card.id,
    yearLabel,
    eraTitle,
    locationLabel: `${meta.citadel} (${meta.region})`,
    proseStory,
    sungStanza,
  };
}
