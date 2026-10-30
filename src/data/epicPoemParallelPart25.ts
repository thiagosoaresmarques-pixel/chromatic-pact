import { EpicPoemCanto } from './epicPoemTypes';

/**
 * CANTOS PARALELOS — PARTE 25
 * 1) CAPÍTULO IV-K (IIIª Era, 655–688 D.F.): A Guerra dos Céus Sem Horizonte e as Seis Armadas Dracônicas (#172)
 *    — O clímax aéreo apocalíptico da Guerra do Sangue Derramado imediatamente antes do Pacto de 689 D.F.
 * 2) CAPÍTULO V-K (IVª Era, 825–849 D.F.): A Heresia das Redomas Soberanas e os Seis Generais da Roda (#173)
 *    — O despertar dos Arcontes Quebra-Domínios no fechamento da Quarta Era para preservar o equilíbrio da Arena.
 */
export const EPIC_POEM_PARALLEL_PART_25: EpicPoemCanto[] = [
  // ==========================================================================
  // CAPÍTULO IV-K: AS SEIS ARMADAS DRACÔNICAS (Anos 655–688 D.F.)
  // 9 nós = 6 com imagem (4 estrofes) + 3 pontes sem imagem (3 estrofes) = 33 estrofes
  // ==========================================================================
  {
    id: 'canto_4k_armadas_draconicas_ceu_sem_sol',
    isParallel: true,
    parentCantoId: 'canto_4_guerra',
    anchorNodeId: 'node_creature_42_tauron_khor',
    parallelCode: 'IV-K',
    shortTitle: 'As Armadas Dracônicas',
    cantoNumber: 'CAPÍTULO IV-K',
    eraNumber: 'IIIª ERA • O CLÍMAX AÉREO DA GUERRA DO SANGUE DERRAMADO',
    periodLabel: 'Anos 655–688 D.F. • Firmamento Rasgado sobre Vaeloria',
    title: 'A Guerra dos Céus Sem Horizonte e o Choque das Seis Armadas Dracônicas',
    subtitle:
      'De como, quando o solo rachado por Kragmorth impediu a marcha dos exércitos terrestres, as Cinco Cidadelas e a Fronteira Cinzenta lançaram revoadas inteiras de guerra aos ares até apagarem o próprio azul do céu na véspera do Pacto de 689 D.F.',
    accentColor: '#ef4444',
    bannerImage: '/assets/arena/domain_red.png',
    nodes: [
      {
        id: 'node_4j_1_hoste_cratera',
        kind: 'creature',
        cardId: 'red_172_armada_draconica_chama',
        domain: 'red',
        title: 'Hoste Dracônica da Cratera',
        subtitle:
          'No Ano 655 D.F., Pyros abre todas as chaminés da Grande Caldeira de uma só vez e despeja nos céus um exército inteiro de dragões de basalto e magma',
        yearLabel: 'Ano 655 D.F.',
        locationLabel: 'Abóbada Vulcânica do Norte',
        stanzas: [
          [
            'Quando o passo de Kragmorth partiu todo o chão,',
            'Já não tinha caminho qualquer batalhão;',
            'Então Pyros abriu sua boca maior,',
            'Entregando às alturas a guerra pior!',
          ],
          [
            'Não subiu um só draco de crista imperial,',
            'Mas a Hoste Dracônica em fúria total:',
            'Cem gargantas de lava rugindo de par,',
            'Com chifres de touro rasgando o alto ar!',
          ],
          [
            'De horizonte a horizonte o vermelho correu,',
            'Parecendo que a própria cratera ferveu;',
            'Onde a nuvem de escamas abria o pulmão,',
            'Três fileiras viravam fagulha e carvão!',
          ],
          [
            'Seu ataque descia qual chuva de breu,',
            'Atingindo na tenda o monarca plebeu;',
            'Mas do polo gelado soprou em resposta',
            'A segunda revoada varrendo a encosta!',
          ],
        ],
      },
      {
        id: 'node_4j_2_esquadra_nevasca',
        kind: 'creature',
        cardId: 'blue_172_armada_draconica_gelo',
        domain: 'blue',
        title: 'Esquadra Dracônica da Nevasca',
        subtitle:
          'Em 661 D.F., o Pináculo de Vórtex responde ao incêndio boreal soltando dezenas de leviatãs alados de geada e relâmpago em formação ciclônica',
        yearLabel: 'Ano 661 D.F.',
        locationLabel: 'Frente Ciclônica de Vórtex',
        stanzas: [
          [
            'Seis invernos depois que a fornalha subiu,',
            'Toda a torre de Vórtex nos ventos se abriu:',
            'Em espiral de safira, relâmpago e sal,',
            'Descolou das geleiras a Esquadra glacial!',
          ],
          [
            'Serpentinas de gelo em perfeita fileira',
            'Giravam nas nuvens qual fria bandeira;',
            'Entre um dorso e outro dorso o trovão reluzia,',
            'Costurando de azul a tormenta bravia!',
          ],
          [
            'Antes mesmo da garra tocar o broquel,',
            'Congelava a vanguarda debaixo do céu;',
            'Transformando soldados, cavalos e lança',
            'Num jardim de estátuas sem voz nem mudança!',
          ],
          [
            'E nos ventos gelados que a frota soprava,',
            'Segredos de guerra o arquimago comprava;',
            'Até o dia medonho em que o norte e o mar',
            'Bateram de frente no meio do ar!',
          ],
        ],
      },
      {
        id: 'node_4j_3_interlude_choque_vapor',
        kind: 'interlude',
        cardId: 'blue_172_armada_draconica_gelo',
        hideCardArt: true,
        domain: 'blue',
        title: 'A Cortina de Vapor e Granizo Fervendo',
        subtitle:
          'No Ano 664 D.F., o encontro direto entre a Hoste da Cratera e a Esquadra da Nevasca envolve o centro do continente em uma tempestade cega',
        yearLabel: 'Ano 664 D.F.',
        locationLabel: 'Estratosfera das Planícies Centrais',
        stanzas: [
          [
            'Quando o sopro de magma bateu no cristal,',
            'Rebentou nas alturas um estrondo mortal;',
            'Nem vencia a geada, nem punha-se o ardor:',
            'Todo o céu virou nuvem de espesso vapor!',
          ],
          [
            'Chovia água fervendo misturada ao granizo,',
            'Tirando dos homens o rumo e o juízo;',
            'Lá no alto estalavam escamas e dentes,',
            'Caindo nos vales dragões incandescentes.',
          ],
          [
            'E sentindo o perfume daquela carnificina,',
            'Abriu-se no oeste a garganta assassina:',
            'Pois onde cem feras tombavam sem vida,',
            'A Cripta encontrava sua messe querida!',
          ],
        ],
      },
      {
        id: 'node_4j_4_legiao_eclipse',
        kind: 'creature',
        cardId: 'purple_172_armada_draconica_abismo',
        domain: 'purple',
        title: 'Legião Dracônica do Eclipse',
        subtitle:
          'Em 669 D.F., os necromantes de Obsidiana erguem ossadas aladas de três séculos de guerra numa nuvem roxa que apaga o meio-dia',
        yearLabel: 'Ano 669 D.F.',
        locationLabel: 'Firmamento Sem Sol do Oeste',
        stanzas: [
          [
            'Das carcaças caídas na terra sangrenta,',
            'Nasceu no ocidente a revoada cinzenta:',
            'A Legião do Eclipse, de osso e terror,',
            'Subindo num vórtice roxo e sem cor!',
          ],
          [
            'Dracoliches sem carne, com chamas no peito,',
            'Voavam unidos num teto perfeito;',
            'Tão cerrada era a malha de asa rasgada,',
            'Que ao bater meio-dia fez noite fechada!',
          ],
          [
            'Seu bafejo violeta secava o pulmão,',
            'Derrubando os escudos da frente no chão;',
            'E a cada rasante que o bando fazia,',
            'O campeão mais antigo da Cripta se erguia!',
          ],
          [
            'Nem a flecha matava quem morto já era,',
            'Pois das cinzas voltava mais torpe a quimera;',
            'Foi então que Veridia, ferida no sul,',
            'Mandou a floresta engolir todo o azul!',
          ],
        ],
      },
      {
        id: 'node_4j_5_enxame_ancestral',
        kind: 'creature',
        cardId: 'green_172_armada_draconica_selva',
        domain: 'green',
        title: 'Enxame Dracônico Ancestral',
        subtitle:
          'No Ano 675 D.F., das copas milenares de Veridia levanta voo uma nuvem esmeralda de serpes galhadas e esporos corrosivos',
        yearLabel: 'Ano 675 D.F.',
        locationLabel: 'Dossel Ascendente de Veridia',
        stanzas: [
          [
            'Sacudiram-se os ramos da mata primeira,',
            'Como se decolasse a floresta inteira:',
            'Em nuvem de jade, veneno e cipó,',
            'O Enxame Ancestral levantou-se de um só!',
          ],
          [
            'Com galhadas de cervo e plumagem de folha,',
            'Não deixavam no espaço vazio que se escolha;',
            'Espargiam das fauces um ácido ardente,',
            'Derretendo as couraças da linha da frente!',
          ],
          [
            'Se uma lança rasgava seu couro escamoso,',
            'Brotava outra fibra no sangue viçoso;',
            'E o rugido selvagem da verde legião',
            'Dobrava o vigor de qualquer batalhão!',
          ],
          [
            'Quatro céus inimigos mordiam-se ao vento,',
            'Sem deixar respirar um só palmo cinzento;',
            'Até que nas torres do leste dourado',
            'Soou o clarim do Bastião Sagrado!',
          ],
        ],
      },
      {
        id: 'node_4j_6_interlude_noite_escamas',
        kind: 'interlude',
        cardId: 'green_172_armada_draconica_selva',
        hideCardArt: true,
        domain: 'gold',
        title: 'O Ano em que Nenhuma Sombra Tocou o Chão',
        subtitle:
          'Em 680 D.F., os cronistas registram que quatro camadas sobrepostas de dragões impediam a luz natural de alcançar os campos de trigo de Vaeloria',
        yearLabel: 'Ano 680 D.F.',
        locationLabel: 'Vales Escurecidos do Continente',
        stanzas: [
          [
            'No ano seiscentos e oitenta escreveram',
            'Os monges que em fundas cavernas viveram:',
            '— "Já não há madrugada, nem tarde, nem luar;',
            'Há somente escamas cobrindo todo o ar!"',
          ],
          [
            'As lavouras secaram debaixo da bruma,',
            'Não cantava nas árvores ave nenhuma;',
            'Pois acima das nuvens o fogo e o veneno',
            'Disputavam aos gritos o mundo terreno.',
          ],
          [
            'Para abrir uma fenda naquele telhado,',
            'Solária reuniu seu plantel consagrado;',
            'E em cunha de bronze, de glória e clarão,',
            'Lançou a quinta armada na escuridão!',
          ],
        ],
      },
      {
        id: 'node_4j_7_armada_zenite',
        kind: 'creature',
        cardId: 'gold_172_armada_draconica_sol',
        domain: 'gold',
        title: 'Armada Dracônica do Zênite',
        subtitle:
          'No Ano 683 D.F., dezenas de dragões-serafins de juba leonina e seis asas descem em formação de cunha sobre as planícies sitiadas',
        yearLabel: 'Ano 683 D.F.',
        locationLabel: 'Cunha Celeste de Solária',
        stanzas: [
          [
            'Rompendo as camadas de fumo e geada,',
            'Desceu em V d’ouro a falange sagrada:',
            'A Armada do Zênite, em seis asas belas,',
            'Acesa qual frota de vivas estrelas!',
          ],
          [
            'Com jubas de leão e couraça luzente,',
            'Varriam de fogo dourado a vanguarda da frente;',
            'E a cada investida do bando solar,',
            'Mil escudos divinos vestiam o ar!',
          ],
          [
            'Curavam de longe o seu rei combalido,',
            'Sustentando nas asas o povo ferido;',
            'Mas nem mesmo Solária logrou pôr um fim',
            'À tormenta de cinco bandeiras sem fim!',
          ],
          [
            'Pois quanto mais ouro brilhava no espaço,',
            'Mais ferviam a sombra, a tormenta e o mormaço;',
            'Até que da Torre no centro do chão',
            'Valkyra soltou a última legião!',
          ],
        ],
      },
      {
        id: 'node_4j_8_armada_prisma',
        kind: 'creature',
        cardId: 'neutral_172_armada_draconica_matriz',
        domain: 'neutral',
        title: 'Armada Dracônica do Prisma',
        subtitle:
          'Em 687 D.F., da cúpula da Torre Axial ergue-se a revoada geométrica de cristal e mercúrio para separar à força os cinco céus em guerra',
        yearLabel: 'Ano 687 D.F.',
        locationLabel: 'Zênite Cinzento sobre a Torre Axial',
        stanzas: [
          [
            'Da agulha mais alta da Torre Cinzenta,',
            'Subiu no seiscentos e oitenta e sete a tormenta:',
            'A Armada do Prisma, em mercúrio e cristal,',
            'Refratando nos ares a luz ancestral!',
          ],
          [
            'Dezenas de dracos de faces polidas',
            'Cruzavam em feixes as nuvens feridas;',
            'Disparando das bocas o raio irisado',
            'Que empurrava p’ra longe cada principado!',
          ],
          [
            'A cada rasante da frota sem cor,',
            'Brotava na terra Essência e fulgor;',
            'E ao erguer-se em Esquadra Suprema no véu,',
            'Trancou cinco exércitos fora do céu!',
          ],
          [
            'Seis armadas suspensas num arco tensíssimo',
            'Fizeram tremer o próprio abismo altíssimo;',
            'Bastaria mais uma centelha no ar',
            'P’ra toda a atmosfera do mundo queimar!',
          ],
        ],
      },
      {
        id: 'node_4j_9_interlude_silencio_688',
        kind: 'interlude',
        cardId: 'neutral_172_armada_draconica_matriz',
        hideCardArt: true,
        domain: 'neutral',
        title: 'A Chuva de Escamas Partidas e o Chamado à Torre',
        subtitle:
          'No inverno de 688 D.F., exaustos sob um firmamento prestes a colapsar, os Cinco Soberanos recolhem suas revoadas e atendem à convocação de Valkyra',
        yearLabel: 'Ano 688 D.F.',
        locationLabel: 'Escadarias da Torre dos Cinco Selos',
        stanzas: [
          [
            'Olharam os reis para o teto rasgado,',
            'Sem nuvem sadia, sem astro prateado;',
            'Se as seis revoadas tornassem a chocar,',
            'Não restaria ar p’ra ninguém respirar.',
          ],
          [
            'Soaram trombetas de trégua cansada,',
            'Pousou nos rochedos cada grande armada;',
            'E por sete semanas caiu sobre o chão',
            'Uma neve de escamas, fuligem e carvão.',
          ],
          [
            'Por isso no inverno seguinte subiram',
            'Os Cinco Monarcas que a morte sentiram;',
            'Jurando na Torre jamais libertar',
            'Exércitos soltos na terra ou no ar!',
          ],
        ],
      },
    ],
  },

  // ==========================================================================
  // CAPÍTULO V-K: OS SEIS GENERAIS DA RODA (Anos 825–849 D.F.)
  // 9 nós = 6 com imagem (4 estrofes) + 3 pontes sem imagem (3 estrofes) = 33 estrofes
  // ==========================================================================
  {
    id: 'canto_5k_generais_roda_quebra_dominios',
    isParallel: true,
    parentCantoId: 'canto_5_pacto',
    anchorNodeId: 'node_creature_50_smaragda',
    parallelCode: 'V-K',
    shortTitle: 'Os Generais da Roda',
    cantoNumber: 'CAPÍTULO V-K',
    eraNumber: 'IVª ERA • A CRISE DAS REDOMAS SOBERANAS NA ARENA',
    periodLabel: 'Anos 825–849 D.F. • Arena Ritual e Câmaras Axiais da Torre',
    title: 'A Heresia das Redomas Soberanas e a Consagração dos Seis Generais da Roda',
    subtitle:
      'De como, no fim da Quarta Era, monarcas soberbos descobriram como aprisionar a Arena em Expansões de Domínio inexpugnáveis, e de como foram despertados Vaelkor, Pyrrakon, Cryonax, Nyxaroth, Sylvarok e Heliokar para quebrar todo falso firmamento',
    accentColor: '#a855f7',
    bannerImage: '/assets/arena/domain_gold.png',
    nodes: [
      {
        id: 'node_5k_1_interlude_heresia_redomas',
        kind: 'interlude',
        cardId: 'neutral_173_general_roda_matriz',
        hideCardArt: true,
        domain: 'neutral',
        title: 'A Brecha das Redomas Absolutas',
        subtitle:
          'No Ano 825 D.F., duelistas reais distorcem os artigos do Pacto Cromático projetando as primeiras Expansões de Domínio sobre o campo sagrado',
        yearLabel: 'Ano 825 D.F.',
        locationLabel: 'Arena Central da Torre dos Cinco Selos',
        stanzas: [
          [
            'Cem anos depois que o Tratado vigia,',
            'Surgiu nos duelos sutil tirania:',
            'Não podendo marchar em campanha campal,',
            'Inventaram os reis a redoma mortal!',
          ],
          [
            'Erguiam na Arena uma cúpula extrema —',
            'A Expansão de Domínio, soberba e suprema —,',
            'Fechando o oponente num mundo fechado',
            'Onde o próprio destino já estava julgado!',
          ],
          [
            'Vendo o jogo sagrado virar cativeiro,',
            'Valkyra desceu ao altar derradeiro;',
            'E unindo seis rodas de antiga aliança,',
            'Deu forma aos Arcontes que quebram a fiança!',
          ],
        ],
      },
      {
        id: 'node_5k_2_vaelkor_roda_prismatica',
        kind: 'creature',
        cardId: 'neutral_173_general_roda_matriz',
        domain: 'neutral',
        title: 'Vaelkor, General da Roda Prismática',
        subtitle:
          'Em 828 D.F., o primeiro Arconte-Juiz ergue-se no Átrio Axial carregando às costas a roda de oito octaedros capaz de refratar e estilhaçar qualquer cúpula soberana',
        yearLabel: 'Ano 828 D.F.',
        locationLabel: 'Átrio Axial da Torre dos Cinco Selos',
        stanzas: [
          [
            'Do núcleo cinzento de mercúrio e cristal,',
            'Ergueu-se o primeiro juiz imortal:',
            'Vaelkor caminhou sobre a pedra partida,',
            'Trazendo nos ombros a Roda esculpida!',
          ],
          [
            'Oito prismas giravam atrás de seu manto,',
            'Medindo a estrutura de cada quebranto;',
            'Quando um rei levantou sua cúpula ardente,',
            'A roda deu um giro sereno e estridente!',
          ],
          [
            'Num único golpe do braço laminado,',
            'Todo o falso domínio caiu estilhaçado;',
            'Enquanto sua tropa em escudos brilhou,',
            'E a pura Essência no campo dobrou!',
          ],
          [
            'Ficou escrito na pedra o preceito primeiro:',
            'Nenhum santuário será carcereiro;',
            'E logo nas forjas do norte inflamado',
            'O segundo General foi em brasa moldado!',
          ],
        ],
      },
      {
        id: 'node_5k_3_pyrrakon_roda_vulcanica',
        kind: 'creature',
        cardId: 'red_173_general_roda_chama',
        domain: 'red',
        title: 'Pyrrakon, General da Roda Vulcânica',
        subtitle:
          'No Ano 832 D.F., das bigornas abissais de Pyros salta o colosso acorrentado cujos oito cadinhos ferventes derretem barreiras e domínios rivais',
        yearLabel: 'Ano 832 D.F.',
        locationLabel: 'Bigorna Suprema de Pyros',
        stanzas: [
          [
            'Para que nenhum mago de gelo ou de sombra',
            'Prendesse as falanges de Pyros na alfombra,',
            'Fundiram em ferro e basalto incandescente',
            'Pyrrakon, o senhor da fornalha vivente!',
          ],
          [
            'Elmo de grelha vomitando fumaça,',
            'Dois cutelos presos em elos de brasa;',
            'Às costas girava o terrível brasão:',
            'Oito cadinhos cheios de magma em fusão!',
          ],
          [
            'Ao pisar na Arena com ímpeto bruto,',
            'Quebrava o Domínio no mesmo minuto;',
            'Vestindo os aliados de luz protetora',
            'Enquanto varria a vanguarda opressora!',
          ],
          [
            'Cada golpe sofrido fechava em fulgor,',
            'Crescendo na carne mais raiva e calor;',
            'Mas lá nas agulhas de Vórtex brilhava',
            'O terceiro General que o relâmpago armava!',
          ],
        ],
      },
      {
        id: 'node_5k_4_cryonax_roda_astral',
        kind: 'creature',
        cardId: 'blue_173_general_roda_gelo',
        domain: 'blue',
        title: 'Cryonax, General da Roda Astral',
        subtitle:
          'Em 836 D.F., os mestres horológicos consagram o duelista de safira espelhada cujo astrolábio de oito esferas tempestuosas decifra e trinca redomas como vidro',
        yearLabel: 'Ano 836 D.F.',
        locationLabel: 'Câmara do Astrolábio Frio, Vórtex',
        stanzas: [
          [
            'No alto pináculo onde o vento raciocina,',
            'Desceu Cryonax de couraça cristalina;',
            'Empunhando a alabarda de gume polar,',
            'Com quatro asas frias cortando o alto ar!',
          ],
          [
            'Atrás de seus ombros, sem falha ou ruído,',
            'Girava o astrolábio de gelo polido:',
            'Oito globos azuis de tormenta guardada,',
            'Calculando a fraqueza da cúpula armada!',
          ],
          [
            'Bastou um estalo do aro celeste',
            'P’ra quebrar a redoma qual vidro agreste;',
            'Congelou na vanguarda o exército alheio',
            'E cobriu seus irmãos de sagrado arneio!',
          ],
          [
            'A cada investida da lança serena,',
            'Um novo pergaminho chegava na Arena;',
            'Provando aos soberbos de cada nação',
            'Como opera da Roda a sublime razão!',
          ],
        ],
      },
      {
        id: 'node_5k_5_interlude_giro_oito_raios',
        kind: 'interlude',
        cardId: 'blue_173_general_roda_gelo',
        hideCardArt: true,
        domain: 'purple',
        title: 'A Doutrina dos Oito Raios e a Exaustão do Trono',
        subtitle:
          'Em 838 D.F., os escribas do Conclave registram por que nenhum Soberano consegue reerguer imediatamente um Domínio despedaçado por um General da Roda',
        yearLabel: 'Ano 838 D.F.',
        locationLabel: 'Salão dos Escribas da Torre',
        stanzas: [
          [
            'Escreveram os sábios no livro da lei',
            'O segredo que dobra a soberba do rei:',
            '— "Quando a Roda Sagrada completa seu giro,',
            'Corta a própria raiz do soberbo suspiro!"',
          ],
          [
            'Quer desça o General no começo da lida,',
            'Quer avance atacando em feroz investida,',
            'A cúpula hostil se desfaz em pedaços,',
            'Deixando o monarca cansado nos braços!',
          ],
          [
            'Por dois longos giros do pêndulo real,',
            'Fica exausto o senhor do domínio fatal;',
            'E vendo essa força nos pátios da luz,',
            'Também o Eclipse forjou quem conduz!',
          ],
        ],
      },
      {
        id: 'node_5k_6_nyxaroth_roda_funebre',
        kind: 'creature',
        cardId: 'purple_173_general_roda_abismo',
        domain: 'purple',
        title: 'Nyxaroth, General da Roda Fúnebre',
        subtitle:
          'No Ano 841 D.F., da Catedral de Obsidiana levita o arconte de quatro braços e roda de oito lanternas cranianas que executa campeões e desfaz santuários',
        yearLabel: 'Ano 841 D.F.',
        locationLabel: 'Nave Sem Luz da Catedral de Obsidiana',
        stanzas: [
          [
            'Nas criptas profundas de pedra-sabão,',
            'Despertou Nyxaroth em funérea oração;',
            'Quatro braços erguidos: dois ferros curvos,',
            'Dois selos de raios violetas e turvos!',
          ],
          [
            'Em roda de ferro batido em lamento,',
            'Oito crânios acesos giravam ao vento;',
            'Cada chama guardava o decreto final',
            'Contra o tolo que erguesse um abrigo imortal!',
          ],
          [
            'Ao surgir na fileira, rasgava o sacrário,',
            'Partindo o Domínio do rei adversário;',
            'Dava Escudo Divino à falange sombria',
            'E da própria ferida mais forte renascia!',
          ],
          [
            'Quando ia ao ataque, nem cota nem fé',
            'Mantinha o campeão mais robusto de pé;',
            'Enquanto no sul a floresta ancestral',
            'Acordava em raízes seu par natural!',
          ],
        ],
      },
      {
        id: 'node_5k_7_sylvarok_roda_primeva',
        kind: 'creature',
        cardId: 'green_173_general_roda_selva',
        domain: 'green',
        title: 'Sylvarok, General da Roda Primeva',
        subtitle:
          'Em 845 D.F., o Círculo de Raiz-Ferro desperta o guardião de pau-ferro e jade cujas raízes arrombam qualquer fronteira artificial imposta sobre a terra',
        yearLabel: 'Ano 845 D.F.',
        locationLabel: 'Trono de Pau-Ferro, Veridia',
        stanzas: [
          [
            'Debaixo do tronco mais velho do sul,',
            'Onde nunca entrou muro de ouro ou de azul,',
            'Ergueu-se Sylvarok com galhada real,',
            'Cravando no solo seu gládio ancestral!',
          ],
          [
            'Quatro asas de folhas e musgo sereno,',
            'Couraça de jade imune ao veneno;',
            'Às costas girava em madeira sagrada',
            'A roda de oito orbes de seiva encantada!',
          ],
          [
            'Onde um mago fechava sua redoma vã,',
            'Arrombava o cimento a raiz temporã;',
            'Quebrando o Domínio num tranco profundo',
            'E devolvendo o ar livre às criaturas do mundo!',
          ],
          [
            'Revestia a matilha de força e de escudo,',
            'Curando na carne o golpe mais rudo;',
            'Faltando somente na cúpula auroral',
            'Descer das alturas o sexto General!',
          ],
        ],
      },
      {
        id: 'node_5k_8_heliokar_roda_celeste',
        kind: 'creature',
        cardId: 'gold_173_general_roda_sol',
        domain: 'gold',
        title: 'Heliokar, General da Roda Celeste',
        subtitle:
          'No Ano 848 D.F., sob o zimbório de Solária desce o arconte de alabastro e ouro com sua roda de oito sóis de bronze para selar o equilíbrio definitivo da Arena',
        yearLabel: 'Ano 848 D.F.',
        locationLabel: 'Zimbório Dourado de Solária',
        stanzas: [
          [
            'Por fim, quando o sol bateu reto no altar,',
            'Desceu de Solária o supremo Heliokar;',
            'Em mármore branco e armadura dourada,',
            'Plantando nas lajes a grande montante sagrada!',
          ],
          [
            'Com quatro asas claras de pluma imortal',
            'E elmo radiante de corte real,',
            'Trazia nos ombros o círculo ardente',
            'De oito sóis de bronze girando em torrente!',
          ],
          [
            'Ao erguer a mão destra em sereno julgar,',
            'Fazia todo falso firmamento ruir pelo ar;',
            'Vestindo os aliados de cota e broquel,',
            'E curando o monarca que fora fiel!',
          ],
          [
            'Se o ferro inimigo lhe abria um sinal,',
            'Fechava-se a chaga na luz matinal;',
            'Completando o colégio dos seis guardiões',
            'Que regem os limites das seis ambições!',
          ],
        ],
      },
      {
        id: 'node_5k_9_interlude_equilibrio_restaurado',
        kind: 'interlude',
        cardId: 'gold_173_general_roda_sol',
        hideCardArt: true,
        domain: 'gold',
        title: 'O Decreto das Cúpulas Quebráveis',
        subtitle:
          'Em 849 D.F., com os Seis Generais da Roda inscritos nos Grimórios, nenhuma Expansão de Domínio volta a ser absoluta, abrindo caminho para os Dez Tratados Bicolores',
        yearLabel: 'Ano 849 D.F.',
        locationLabel: 'Mesa dos Selos, Fronteira Cinzenta',
        stanzas: [
          [
            'Desde oito-quatro-nove ficou assenteado',
            'No código vivo do nosso Tratado:',
            'Um rei pode erguer seu Domínio no chão,',
            'Mas nunca terá inquebrável prisão!',
          ],
          [
            'Pois basta que gire nos ombros de um bravo',
            'A Roda de Oito Raios que livra o escravo,',
            'E toda redoma, por forte que for,',
            'Desaba em estilhaços diante do fulgor!',
          ],
          [
            'Sabendo que sozinho ninguém vence tudo,',
            'Uniram os reinos a lança e o escudo;',
            'E logo no ano seguinte se abriram',
            'Os Dez Tratados que as cores uniram!',
          ],
        ],
      },
    ],
  },
];
