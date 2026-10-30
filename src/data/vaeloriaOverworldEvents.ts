import { ALL_CARDS } from './cards';
import { CardDefinition, Domain, OverworldFieldBuff } from '../types/game';
import {
  RegionalLocalLandmark,
  VAELORIA_REGIONAL_MAPS,
  VaeloriaRealmId,
} from './vaeloriaMultimapData';

export type OverworldExplorationMode = 'campaign' | 'expedition' | 'conquest';

export interface OverworldEventChoiceDef {
  id: 'choice_a' | 'choice_b';
  title: string;
  icon: string;
  flavorOutcome: string;
  buffKind: 'vitality' | 'essence' | 'bastion';
}

export interface OverworldLandmarkEventDef {
  landmarkId: string;
  realm: VaeloriaRealmId;
  title: string;
  kicker: string;
  loreParagraph: string;
  choices: [OverworldEventChoiceDef, OverworldEventChoiceDef];
}

export interface ResolvedOverworldChoicePreview {
  rewardBadge: string;
  goldDelta: number;
  suppliesDelta: number;
  recruitedCard: CardDefinition | null;
  fieldBuff: OverworldFieldBuff | null;
}

const CAMPAIGN_LANDMARKS_KEY = 'chromatic_pact_ow_campaign_visited_v1';
const EXPEDITION_LANDMARKS_KEY = 'chromatic_pact_ow_expedition_visited_v1';
const PENDING_BUFF_PREFIX = 'chromatic_pact_ow_pending_buff_v1_';
const FOG_ENABLED_KEY = 'chromatic_pact_map_fog_enabled_v1';
const VISITED_REALMS_KEY = 'chromatic_pact_map_visited_realms_v1';

/**
 * 36 Eventos Narrativos e Táticos Canônicos (6 por Reino Regional de Vaeloria)
 */
const LANDMARK_CUSTOM_LORE: Record<
  string,
  {
    kicker: string;
    lore: string;
    choiceATitle: string;
    choiceAIcon: string;
    choiceAOutcome: string;
    choiceBTitle: string;
    choiceBIcon: string;
    choiceBOutcome: string;
    buffKind: 'vitality' | 'essence' | 'bastion';
  }
> = {
  // === VERIDIA (SUL SELVAGEM) ===
  lm_veridia_1: {
    kicker: 'ASSENTAMENTO SILVESTRE • VERIDIA',
    lore: 'Entre raízes colossais iluminadas por âmbar vivo, anciãos druidas oferecem cálices de seiva ancestral ou provisões para sua caravana.',
    choiceATitle: 'Comerciar Âmbar Primevo',
    choiceAIcon: '🪙',
    choiceAOutcome: 'Os mercadores da aldeia trocam resinas raras por provisões valiosas para sua marcha.',
    choiceBTitle: 'Comungar com a Seiva Antiga',
    choiceBIcon: '🌿',
    choiceBOutcome: 'O néctar cálido fecha feridas e fortalece o vigor do Soberano para o próximo embate.',
    buffKind: 'vitality',
  },
  lm_veridia_2: {
    kicker: 'TRAVESSIA SUSPENSA • VERIDIA',
    lore: 'Acima do abismo verdejante, batedores de Cipó-Ferro vigiam comboios imperiais e conhecem atalhos ocultos na copa.',
    choiceATitle: 'Cobrar Pedágio da Copa',
    choiceAIcon: '🎒',
    choiceAOutcome: 'Os batedores partilham os tributos recolhidos nas pontes suspensas.',
    choiceBTitle: 'Posicionar Escudos nos Cabos',
    choiceBIcon: '🛡️',
    choiceBOutcome: 'Sua Vanguarda aprende a lutar em formação cerrada sobre terreno instável.',
    buffKind: 'bastion',
  },
  lm_veridia_3: {
    kicker: 'RELÍQUIA ANFIBIA • VERIDIA',
    lore: 'Colunas de jade cobertas de lírios bioluminescentes emergem das águas rasas, guardando cofres da Primeira Era.',
    choiceATitle: 'Resgatar Relicário Submerso',
    choiceAIcon: '💎',
    choiceAOutcome: 'Seus mergulhadores trazem moedas e artefatos intactos do fundo de jade.',
    choiceBTitle: 'Canalizar o Altar Esmeralda',
    choiceBIcon: '⚡',
    choiceBOutcome: 'A água encantada desperta uma reserva extra de Essência para a abertura do próximo duelo.',
    buffKind: 'essence',
  },
  lm_veridia_4: {
    kicker: 'SANTUÁRIO TOTÊMICO • VERIDIA',
    lore: 'Totens esculpidos em presas de behemoth vibram sob tambores xamânicos que convocam os espíritos da Grande Caçada.',
    choiceATitle: 'Recolher Troféus da Caçada',
    choiceAIcon: '🦴',
    choiceAOutcome: 'As peles e marfins sagrados enriquecem o tesouro de guerra da sua expedição.',
    choiceBTitle: 'Invocar Fúria do Espírito-Fera',
    choiceBIcon: '🐾',
    choiceBOutcome: 'A bênção totêmica revigora sua linhagem com sangue indomável antes da batalha.',
    buffKind: 'vitality',
  },
  lm_veridia_5: {
    kicker: 'GUARNIÇÃO DE FRONTEIRA • VERIDIA',
    lore: 'Muralhas trançadas em madeira-ferro viva barram invasões vindas da Fronteira Cinzenta.',
    choiceATitle: 'Requisitar Paiol da Fronteira',
    choiceAIcon: '⚙️',
    choiceAOutcome: 'O comandante do forte entrega suprimentos excedentes ao seu estandarte.',
    choiceBTitle: 'Reforçar Escudos com Casca-Ferro',
    choiceBIcon: '🛡️',
    choiceBOutcome: 'Ferreiros silvestres revestem as armaduras da sua primeira linha.',
    buffKind: 'bastion',
  },
  lm_veridia_6: {
    kicker: 'PORTO DO MAR DO SUL • VERIDIA',
    lore: 'Veleiros de madeira esmeralda atracam carregados de especiarias e pergaminhos náuticos de terras austrais.',
    choiceATitle: 'Fretar Carga Mercante',
    choiceAIcon: '⚓',
    choiceAOutcome: 'O comércio portuário rende dividendos imediatos para sua campanha.',
    choiceBTitle: 'Abastecer Tropas com Elixires Marinhos',
    choiceBIcon: '🌊',
    choiceBOutcome: 'A brisa salgada e os tônicos austrais ampliam sua vitalidade de abertura.',
    buffKind: 'vitality',
  },

  // === VALE DO ECLIPSE (OESTE PROFUNDO) ===
  lm_eclipse_1: {
    kicker: 'RUÍNA FUNERÁRIA • ECLIPSE',
    lore: 'Campanários de pedra negra permanecem imóveis, mas cada passo ecoa sussurros de arcontes sepultados.',
    choiceATitle: 'Saquear Cripta dos Sinos',
    choiceAIcon: '⚰️',
    choiceAOutcome: 'Óbolos antigos de prata escura são recolhidos dos sarcófagos.',
    choiceBTitle: 'Escutar o Badalar Silencioso',
    choiceBIcon: '🔮',
    choiceBOutcome: 'O eco espectral condensa Essência pura nas mãos do seu Soberano.',
    buffKind: 'essence',
  },
  lm_eclipse_2: {
    kicker: 'VILA CREPUSCULAR • ECLIPSE',
    lore: 'Lanternas violetas ardem dia e noite na Vila da Vigília, onde alquimistas destilam soros contra a podridão.',
    choiceATitle: 'Negociar com Alquimistas',
    choiceAIcon: '🧪',
    choiceAOutcome: 'Frascos raros e moedas imperiais reforçam seus cofres.',
    choiceBTitle: 'Beber o Tônico da Vigília',
    choiceBIcon: '🩸',
    choiceBOutcome: 'O elixir sombrio fortalece o coração do Soberano contra golpes letais.',
    buffKind: 'vitality',
  },
  lm_eclipse_3: {
    kicker: 'PASSAGEM GÓTICA • ECLIPSE',
    lore: 'Estátuas aladas de obsidiana observam o cânion; runas defensivas antigas ainda pulsam nos parapeitos.',
    choiceATitle: 'Extrair Gemas Oculares',
    choiceAIcon: '💎',
    choiceAOutcome: 'As ametistas cravadas nos pedestais rendem rico espólio.',
    choiceBTitle: 'Despertar Égide de Gárgula',
    choiceBIcon: '🛡️',
    choiceBOutcome: 'Pele pétrea envolve os campeões que marcharem na sua Vanguarda.',
    buffKind: 'bastion',
  },
  lm_eclipse_4: {
    kicker: 'PORTO COSTAL • ECLIPSE',
    lore: 'No topo da falésia ocidental, uma chama carmesim guia galeras fantasmas através dos recifes de ossos.',
    choiceATitle: 'Confiscar Contrabando Abissal',
    choiceAIcon: '⚓',
    choiceAOutcome: 'Caixas seladas dos corsários sombrios abastecem sua guerra.',
    choiceBTitle: 'Alinhar Astrolábio à Lua Sangrenta',
    choiceBIcon: '🌑',
    choiceBOutcome: 'A maré carmesim concede fluxo místico imediato ao iniciar o próximo combate.',
    buffKind: 'essence',
  },
  lm_eclipse_5: {
    kicker: 'ALTAR PROIBIDO • ECLIPSE',
    lore: 'Velas negras cercam um códice acorrentado onde antigos Pactuários registraram juramentos de poder.',
    choiceATitle: 'Recolher Oferendas do Altar',
    choiceAIcon: '🕯️',
    choiceAOutcome: 'Relíquias votivas de ouro velho são integradas ao seu tesouro.',
    choiceBTitle: 'Selar Pacto Menor de Sangue-Sombra',
    choiceBIcon: '⚡',
    choiceBOutcome: 'Uma centelha arcana extra acompanhará sua mão inicial na próxima batalha.',
    buffKind: 'essence',
  },
  lm_eclipse_6: {
    kicker: 'FORTALEZA INQUISITORIAL • ECLIPSE',
    lore: 'Forjas frias de Sangue-Ferro produzem placas negras quase impenetráveis às lâminas comuns.',
    choiceATitle: 'Tomar Lingotes Imperiais',
    choiceAIcon: '⛓️',
    choiceAOutcome: 'Carregamentos de metal raro financiam o avanço das suas forças.',
    choiceBTitle: 'Blindar a Primeira Fileira',
    choiceBIcon: '🛡️',
    choiceBOutcome: 'Placas de Sangue-Ferro protegem sua Vanguarda no próximo confronto.',
    buffKind: 'bastion',
  },

  // === CENTRO AXIAL (FRONTEIRA CINZENTA) ===
  lm_matrix_1: {
    kicker: 'ARENA DE PROVAÇÃO • CENTRO AXIAL',
    lore: 'Veteranos de cinco reinos treinam sob os arcos partidos do Coliseu Externo, testando táticas de cerco.',
    choiceATitle: 'Apoiar Campeões da Arena',
    choiceAIcon: '🏆',
    choiceAOutcome: 'Os prêmios da arena rendem ouro e prestígio imediato.',
    choiceBTitle: 'Treinar Formação de Falange',
    choiceBIcon: '🛡️',
    choiceBOutcome: 'Seus guerreiros entram em combate com disciplina defensiva superior.',
    buffKind: 'bastion',
  },
  lm_matrix_2: {
    kicker: 'NEXO PLANAR • CENTRO AXIAL',
    lore: 'Cinco feixes luminosos cruzam o solo vitrificado, fazendo o ar crepitar com pura Essência prismática.',
    choiceATitle: 'Colher Cristais Condensados',
    choiceAIcon: '💠',
    choiceAOutcome: 'Fragmentos de Ley cristalizados são convertidos em recursos valiosos.',
    choiceBTitle: 'Sintonizar Grimório às Linhas de Ley',
    choiceBIcon: '☸',
    choiceBOutcome: 'Seu Soberano inicia a próxima batalha com +1⚡ de Essência extra.',
    buffKind: 'essence',
  },
  lm_matrix_3: {
    kicker: 'MERCADO LIVRE • CENTRO AXIAL',
    lore: 'Sob bandeira branca, caravanas de Solária, Veridia e Pyros trocam mapas, aço e provisões raras.',
    choiceATitle: 'Taxar Rotas da Encruzilhada',
    choiceAIcon: '⚖️',
    choiceAOutcome: 'As guildas mercantes pagam pedágio diplomático ao seu estandarte.',
    choiceBTitle: 'Adquirir Rações Reais de Campanha',
    choiceBIcon: '🍞',
    choiceBOutcome: 'Tropas bem alimentadas elevam a reserva vital do Soberano.',
    buffKind: 'vitality',
  },
  lm_matrix_4: {
    kicker: 'CONCLAVE DIPLOMÁTICO • CENTRO AXIAL',
    lore: 'Embaixadores dos Seis Tronos debatem tratados ao redor do obelisco neutro da Praça Central.',
    choiceATitle: 'Receber Subsídio Diplomático',
    choiceAIcon: '📜',
    choiceAOutcome: 'Cartas de crédito imperiais reforçam sua economia de guerra.',
    choiceBTitle: 'Reivindicar Imunidade do Árbitro',
    choiceBIcon: '🛡️',
    choiceBOutcome: 'Selos diplomáticos concedem proteção adicional à sua linha de frente.',
    buffKind: 'bastion',
  },
  lm_matrix_5: {
    kicker: 'MONUMENTO ANCESTRAL • CENTRO AXIAL',
    lore: 'Espelhos partidos da Primeira Refração ainda dividem a luz branca nas cinco cores primordiais.',
    choiceATitle: 'Recuperar Lentes Prismáticas',
    choiceAIcon: '🔆',
    choiceAOutcome: 'Artefatos ópticos raros enriquecem sua reserva estratégica.',
    choiceBTitle: 'Banhar-se no Feixe Pentacromático',
    choiceBIcon: '⚡',
    choiceBOutcome: 'A refração desperta poder latente para o primeiro turno do duelo seguinte.',
    buffKind: 'essence',
  },
  lm_matrix_6: {
    kicker: 'BASTIÃO DE VIGIA • CENTRO AXIAL',
    lore: 'Sentinelas da Ordem Axial mantêm balistas e sinos de prontidão no alto da escarpa de granito.',
    choiceATitle: 'Inspecionar Reserva da Atalaia',
    choiceAIcon: '🏰',
    choiceAOutcome: 'Suprimentos militares estocados passam ao seu comando.',
    choiceBTitle: 'Erguer Escudos de Granito Axial',
    choiceBIcon: '🛡️',
    choiceBOutcome: 'Sua Vanguarda recebe blindagem extra para segurar o próximo assalto.',
    buffKind: 'bastion',
  },

  // === SOLÁRIA (LESTE ALTO) ===
  lm_solaria_1: {
    kicker: 'ENGENHARIA IMPERIAL • SOLÁRIA',
    lore: 'Águas cristalinas correm por arcos brancos de alabastro banhados pelo sol perpétuo do planalto.',
    choiceATitle: 'Coletar Tributos do Aqueduto',
    choiceAIcon: '🏛️',
    choiceAOutcome: 'Os coletores solares entregam moedas cunhadas no Grande Domo.',
    choiceBTitle: 'Purificar Tropas nas Águas Solares',
    choiceBIcon: '☀️',
    choiceBOutcome: 'A água abençoada amplia a vitalidade inicial do Soberano.',
    buffKind: 'vitality',
  },
  lm_solaria_2: {
    kicker: 'METRÓPOLE ESCALONADA • SOLÁRIA',
    lore: 'Jardins dourados e oficinas de ourivesaria cintilam nos terraços de mármore voltados para o nascente.',
    choiceATitle: 'Patrocinar Guilda dos Ourives',
    choiceAIcon: '👑',
    choiceAOutcome: 'O investimento retorna imediatamente em ouro reluzente.',
    choiceBTitle: 'Consagrar Estandarte na Aurora',
    choiceBIcon: '✨',
    choiceBOutcome: 'O fulgor matinal energiza suas reservas arcanas.',
    buffKind: 'essence',
  },
  lm_solaria_3: {
    kicker: 'PORTO DOURADO • SOLÁRIA',
    lore: 'Galeões de velas brancas e proas de bronze embarcam legiões e relíquias rumo aos mares orientais.',
    choiceATitle: 'Arrematar Carga Real',
    choiceAIcon: '⛵',
    choiceAOutcome: 'Os armadores reais partilham lucros marítimos com sua frota.',
    choiceBTitle: 'Embarcar Escudeiros do Sol',
    choiceBIcon: '🛡️',
    choiceBOutcome: 'Veteranos navais reforçam a armadura da sua Vanguarda.',
    buffKind: 'bastion',
  },
  lm_solaria_4: {
    kicker: 'SANTUÁRIO ÓPTICO • SOLÁRIA',
    lore: 'Monges solares alinham lentes gigantescas que convertem a luz do zênite em chamas purificadoras.',
    choiceATitle: 'Guardar Cristais Focalizadores',
    choiceAIcon: '🔆',
    choiceAOutcome: 'Lentes excedentes rendem alto valor nos mercados do reino.',
    choiceBTitle: 'Concentrar Luz no Coração Arcano',
    choiceBIcon: '⚡',
    choiceBOutcome: 'A lente mestra carrega +1⚡ de Essência extra para sua próxima partida.',
    buffKind: 'essence',
  },
  lm_solaria_5: {
    kicker: 'CIDADELA PALADINA • SOLÁRIA',
    lore: 'A Guarda Dourada mantém vigília ininterrupta diante dos salões de armas reluzentes.',
    choiceATitle: 'Requisitar Cofre Militar',
    choiceAIcon: '🛡️',
    choiceAOutcome: 'Fundos de campanha são liberados pela intendência solar.',
    choiceBTitle: 'Receber Benção de Escudo Dourado',
    choiceBIcon: '⚜️',
    choiceBOutcome: 'Armadura consagrada envolve sua Vanguarda no próximo combate.',
    buffKind: 'bastion',
  },
  lm_solaria_6: {
    kicker: 'MEMORIAL DINÁSTICO • SOLÁRIA',
    lore: 'Estátuas monumentais dos primeiros reis-sacerdotes guardam inscrições de coragem imortal.',
    choiceATitle: 'Recuperar Insígnias Reais',
    choiceAIcon: '🏺',
    choiceAOutcome: 'Medalhões dinásticos aumentam seu tesouro de guerra.',
    choiceBTitle: 'Jurar Diante dos Reis Antigos',
    choiceBIcon: '❤️',
    choiceBOutcome: 'O juramento real eleva os Pontos de Vida iniciais do Soberano.',
    buffKind: 'vitality',
  },

  // === PYROS (NORTE VULCÂNICO) ===
  lm_pyros_1: {
    kicker: 'GARGANTA MAGMÁTICA • PYROS',
    lore: 'Correntes titânicas sustentam a ponte incandescente por onde marcham as legiões blindadas do Norte.',
    choiceATitle: 'Cobrar Tributo de Travessia',
    choiceAIcon: '⛓️',
    choiceAOutcome: 'Comboios de minério pagam passagem ao seu exército.',
    choiceBTitle: 'Temperar Escudos no Vapor Rubro',
    choiceBIcon: '🛡️',
    choiceBOutcome: 'O choque térmico endurece o aço da sua Vanguarda.',
    buffKind: 'bastion',
  },
  lm_pyros_2: {
    kicker: 'CIDADE-FORJA • PYROS',
    lore: 'Martelos hidráulicos movidos a magma batem dia e noite na Fundição das Legiões Rubras.',
    choiceATitle: 'Vender Escória Rúnica',
    choiceAIcon: '🔨',
    choiceAOutcome: 'As fornalhas pagam generosamente pelo minério bruto.',
    choiceBTitle: 'Forjar Couraças de Aço-Dracônico',
    choiceBIcon: '🔥',
    choiceBOutcome: 'Placas recém-saídas da bigorna protegem seus campeões de frente.',
    buffKind: 'bastion',
  },
  lm_pyros_3: {
    kicker: 'AEROPORTO IMPERIAL • PYROS',
    lore: 'Dirigíveis couraçados e ginetes de wyvern abastecem caldeiras nas docas suspensas sobre o penhasco.',
    choiceATitle: 'Descarregar Espólios Aéreos',
    choiceAIcon: '🎈',
    choiceAOutcome: 'Cargas trazidas pelos céus reforçam seu caixa militar.',
    choiceBTitle: 'Sobrecarregar Núcleo Piro-Rúnico',
    choiceBIcon: '⚡',
    choiceBOutcome: 'Combustível astral garante +1⚡ de Essência na abertura da próxima luta.',
    buffKind: 'essence',
  },
  lm_pyros_4: {
    kicker: 'SANTUÁRIO VULCÂNICO • PYROS',
    lore: 'Uma língua eterna de fogo branco arde sem consumir a rocha, venerada pelos piromantes ancestrais.',
    choiceATitle: 'Recolher Rubis de Cinza',
    choiceAIcon: '💎',
    choiceAOutcome: 'Pedras ígneas lapidadas pelo vulcão enriquecem sua jornada.',
    choiceBTitle: 'Absorver a Chama Primordial',
    choiceBIcon: '🔥',
    choiceBOutcome: 'O calor sagrado expande sua Essência inicial para o próximo embate.',
    buffKind: 'essence',
  },
  lm_pyros_5: {
    kicker: 'FORTALEZA VULCÂNICA • PYROS',
    lore: 'Torres facetadas de vidro vulcânico negro refletem os rios de lava ao redor da guarnição.',
    choiceATitle: 'Abrir Paiol de Obsidiana',
    choiceAIcon: '⚙️',
    choiceAOutcome: 'Munições e lingotes são incorporados à sua coluna de marcha.',
    choiceBTitle: 'Fortificar Vanguarda com Obsidiana',
    choiceBIcon: '🛡️',
    choiceBOutcome: 'Escudos vitrificados garantem proteção extra na abertura do combate.',
    buffKind: 'bastion',
  },
  lm_pyros_6: {
    kicker: 'CEMITÉRIO COLOSSAL • PYROS',
    lore: 'Costelas do tamanho de catedrais marcam o local onde um Dragão Ancestral tombou na Era da Ruptura.',
    choiceATitle: 'Extrair Escamas Fósseis',
    choiceAIcon: '🐉',
    choiceAOutcome: 'Escamas milenares valem uma fortuna entre armeiros e magos.',
    choiceBTitle: 'Despertar Medula Dracônica',
    choiceBIcon: '❤️',
    choiceBOutcome: 'A vitalidade ancestral do colosso fortalece o sangue do seu Soberano.',
    buffKind: 'vitality',
  },

  // === VÓRTEX (POLOS SETENTRIONAIS) ===
  lm_vortex_1: {
    kicker: 'ARCO GLACIAL • VÓRTEX',
    lore: 'Um arco translúcido de gelo azul jamais derrete, suspenso sobre águas onde constelações se refletem.',
    choiceATitle: 'Recolher Safiras de Geada',
    choiceAIcon: '❄️',
    choiceAOutcome: 'Cristais polares puros reforçam seus recursos imediatos.',
    choiceBTitle: 'Revestir Escudos em Gelo Eterno',
    choiceBIcon: '🛡️',
    choiceBOutcome: 'Camadas glaciais blindam sua Vanguarda contra o primeiro impacto.',
    buffKind: 'bastion',
  },
  lm_vortex_2: {
    kicker: 'PORTO ÁRTICO • VÓRTEX',
    lore: 'Navios revestidos de bronze rúnico partem a banquisa polar trazendo relíquias de ilhas distantes.',
    choiceATitle: 'Fretar Comboio Quebra-Gelo',
    choiceAIcon: '⚓',
    choiceAOutcome: 'Os capitães árticos entregam suprimentos e moedas ao seu comando.',
    choiceBTitle: 'Rações Térmicas da Frota Real',
    choiceBIcon: '❤️',
    choiceBOutcome: 'Sua tropa recupera fôlego e entra em batalha com PV ampliado.',
    buffKind: 'vitality',
  },
  lm_vortex_3: {
    kicker: 'OFICINA HOROLÓGICA • VÓRTEX',
    lore: 'Centenas de pêndulos e engrenagens de latão giram em sincronia nas oficinas dos mestres relojoeiros.',
    choiceATitle: 'Comerciar Cronômetros Rúnicos',
    choiceAIcon: '⏱️',
    choiceAOutcome: 'Mecanismos de precisão rendem excelente retorno financeiro.',
    choiceBTitle: 'Adiantar o Pêndulo de Abertura',
    choiceBIcon: '⚡',
    choiceBOutcome: 'Dobra temporal concede +1⚡ de Essência logo no início do próximo duelo.',
    buffKind: 'essence',
  },
  lm_vortex_4: {
    kicker: 'OBSERVATÓRIO BOREAL • VÓRTEX',
    lore: 'Cortinas de aurora verde e azul dançam sobre o domo aberto onde oráculos leem o destino das nações.',
    choiceATitle: 'Guardar Mapas Estelares',
    choiceAIcon: '🌌',
    choiceAOutcome: 'Cartas celestes raras aumentam o tesouro da sua campanha.',
    choiceBTitle: 'Canalizar a Aurora Boreal',
    choiceBIcon: '⚡',
    choiceBOutcome: 'Luz astral pura preenche sua reserva de Essência para a próxima batalha.',
    buffKind: 'essence',
  },
  lm_vortex_5: {
    kicker: 'BASTIÃO POLAR • VÓRTEX',
    lore: 'Muralhas escuras incrustadas na geleira resistem às piores tormentas do topo do mundo.',
    choiceATitle: 'Requisitar Estoque Polar',
    choiceAIcon: '🏰',
    choiceAOutcome: 'Suprimentos preservados no gelo passam para o seu exército.',
    choiceBTitle: 'Doutrina da Muralha Boreal',
    choiceBIcon: '🛡️',
    choiceBOutcome: 'Sua Vanguarda ganha proteção extra para segurar colunas críticas.',
    buffKind: 'bastion',
  },
  lm_vortex_6: {
    kicker: 'DESTROÇOS CONGELADOS • VÓRTEX',
    lore: 'Presa verticalmente num iceberg colossal, a nau capitânia da Primeira Armada ainda guarda relíquias intactas.',
    choiceATitle: 'Resgatar Cofre do Almirante',
    choiceAIcon: '🧭',
    choiceAOutcome: 'Moedas imperiais antigas e mapas navais são recuperados do casco.',
    choiceBTitle: 'Despertar Espírito da Tripulação',
    choiceBIcon: '❤️',
    choiceBOutcome: 'A resiliência dos antigos navegadores concede PV adicional ao Soberano.',
    buffKind: 'vitality',
  },
};

export function getLandmarkEventDef(
  realm: VaeloriaRealmId,
  landmark: RegionalLocalLandmark
): OverworldLandmarkEventDef {
  const custom = LANDMARK_CUSTOM_LORE[landmark.id];
  const realmDef = VAELORIA_REGIONAL_MAPS[realm];

  if (custom) {
    return {
      landmarkId: landmark.id,
      realm,
      title: landmark.name,
      kicker: custom.kicker,
      loreParagraph: custom.lore,
      choices: [
        {
          id: 'choice_a',
          title: custom.choiceATitle,
          icon: custom.choiceAIcon,
          flavorOutcome: custom.choiceAOutcome,
          buffKind: custom.buffKind,
        },
        {
          id: 'choice_b',
          title: custom.choiceBTitle,
          icon: custom.choiceBIcon,
          flavorOutcome: custom.choiceBOutcome,
          buffKind: custom.buffKind,
        },
      ],
    };
  }

  return {
    landmarkId: landmark.id,
    realm,
    title: landmark.name,
    kicker: `MARCO REGIONAL • ${realmDef.shortName.toUpperCase()}`,
    loreParagraph: `Sua comitiva alcança ${landmark.name}, um ponto estratégico nas terras de ${realmDef.shortName}.`,
    choices: [
      {
        id: 'choice_a',
        title: 'Recolher Tributos Locais',
        icon: '🪙',
        flavorOutcome: 'Recursos estratégicos foram integrados à sua marcha.',
        buffKind: 'vitality',
      },
      {
        id: 'choice_b',
        title: 'Preparar Formação de Combate',
        icon: '⚔️',
        flavorOutcome: 'Suas tropas marcham fortalecidas para o próximo embate.',
        buffKind: 'vitality',
      },
    ],
  };
}

function pickDeterministicDomainCard(landmarkId: string, domain: Domain): CardDefinition | null {
  const pool = ALL_CARDS.filter(
    (c) =>
      (c.domain === domain || (domain === 'neutral' && c.rarity === 'legendary')) &&
      (c.rarity === 'rare' || c.rarity === 'legendary')
  );
  const safePool = pool.length > 0 ? pool : ALL_CARDS;
  if (safePool.length === 0) return null;
  let hash = 0;
  for (let i = 0; i < landmarkId.length; i++) {
    hash = (hash * 31 + landmarkId.charCodeAt(i)) >>> 0;
  }
  return safePool[hash % safePool.length];
}

function buildFieldBuffFromKind(
  landmarkId: string,
  landmarkName: string,
  realm: VaeloriaRealmId,
  kind: 'vitality' | 'essence' | 'bastion',
  isExpedition = false
): OverworldFieldBuff {
  if (kind === 'essence') {
    return {
      id: `buff_${landmarkId}_${Date.now()}`,
      sourceLandmarkName: landmarkName,
      realm,
      bonusHp: isExpedition ? 3 : 0,
      bonusOpeningEssence: 1,
      vanguardArmorBonus: 0,
      summaryLabel: isExpedition ? '+1⚡ Essência Inicial & +3❤️ PV' : '+1⚡ Essência Inicial',
    };
  }
  if (kind === 'bastion') {
    return {
      id: `buff_${landmarkId}_${Date.now()}`,
      sourceLandmarkName: landmarkName,
      realm,
      bonusHp: isExpedition ? 3 : 2,
      bonusOpeningEssence: 0,
      vanguardArmorBonus: 1,
      summaryLabel: isExpedition
        ? '+1🛡️ Vanguarda & +3❤️ PV'
        : '+1🛡️ Vanguarda & +2❤️ PV',
    };
  }
  return {
    id: `buff_${landmarkId}_${Date.now()}`,
    sourceLandmarkName: landmarkName,
    realm,
    bonusHp: isExpedition ? 7 : 5,
    bonusOpeningEssence: 0,
    vanguardArmorBonus: 0,
    summaryLabel: isExpedition ? '+7❤️ PV Inicial' : '+5❤️ PV Inicial',
  };
}

export function resolveLandmarkChoicePreview(
  eventDef: OverworldLandmarkEventDef,
  choice: OverworldEventChoiceDef,
  mode: OverworldExplorationMode
): ResolvedOverworldChoicePreview {
  const realmDef = VAELORIA_REGIONAL_MAPS[eventDef.realm];

  if (mode === 'campaign') {
    if (choice.id === 'choice_a') {
      return {
        rewardBadge: '+20 🪙 Ouro & Crônica Descoberta',
        goldDelta: 20,
        suppliesDelta: 0,
        recruitedCard: null,
        fieldBuff: null,
      };
    }
    const buff = buildFieldBuffFromKind(
      eventDef.landmarkId,
      eventDef.title,
      eventDef.realm,
      choice.buffKind,
      false
    );
    return {
      rewardBadge: `+10 🪙 Ouro & Bênção (${buff.summaryLabel})`,
      goldDelta: 10,
      suppliesDelta: 0,
      recruitedCard: null,
      fieldBuff: buff,
    };
  }

  if (mode === 'expedition') {
    if (choice.id === 'choice_a') {
      const card = pickDeterministicDomainCard(eventDef.landmarkId, realmDef.domain);
      return {
        rewardBadge: card
          ? `🃏 Recrutar [${card.name}] + 15 🪙 Ouro`
          : '+25 🪙 Ouro da Expedição',
        goldDelta: card ? 15 : 25,
        suppliesDelta: 0,
        recruitedCard: card,
        fieldBuff: null,
      };
    }
    const buff = buildFieldBuffFromKind(
      eventDef.landmarkId,
      eventDef.title,
      eventDef.realm,
      choice.buffKind,
      true
    );
    return {
      rewardBadge: `✦ Bênção Roguelike (${buff.summaryLabel})`,
      goldDelta: 0,
      suppliesDelta: 0,
      recruitedCard: null,
      fieldBuff: buff,
    };
  }

  // mode === 'conquest'
  if (choice.id === 'choice_a') {
    return {
      rewardBadge: '+35 ⚙️ Suprimentos Imperiais',
      goldDelta: 0,
      suppliesDelta: 35,
      recruitedCard: null,
      fieldBuff: null,
    };
  }
  const buff = buildFieldBuffFromKind(
    eventDef.landmarkId,
    eventDef.title,
    eventDef.realm,
    choice.buffKind,
    false
  );
  return {
    rewardBadge: `+15 ⚙️ Suprimentos & Bônus de Cerco (${buff.summaryLabel})`,
    goldDelta: 0,
    suppliesDelta: 15,
    recruitedCard: null,
    fieldBuff: buff,
  };
}

// ============================================================================
// PERSISTENCE HELPERS (VISITED LANDMARKS, PENDING BUFF, FOG OF WAR & REALMS)
// ============================================================================

export function getVisitedCampaignLandmarks(): Set<string> {
  try {
    const raw = localStorage.getItem(CAMPAIGN_LANDMARKS_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? new Set(arr) : new Set();
  } catch {
    return new Set();
  }
}

export function markCampaignLandmarkVisited(landmarkId: string): Set<string> {
  const next = getVisitedCampaignLandmarks();
  next.add(landmarkId);
  try {
    localStorage.setItem(CAMPAIGN_LANDMARKS_KEY, JSON.stringify(Array.from(next)));
  } catch {
    // Ignore storage error
  }
  return next;
}

export function getVisitedExpeditionLandmarks(): Set<string> {
  try {
    const raw = localStorage.getItem(EXPEDITION_LANDMARKS_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? new Set(arr) : new Set();
  } catch {
    return new Set();
  }
}

export function markExpeditionLandmarkVisited(landmarkId: string): Set<string> {
  const next = getVisitedExpeditionLandmarks();
  next.add(landmarkId);
  try {
    localStorage.setItem(EXPEDITION_LANDMARKS_KEY, JSON.stringify(Array.from(next)));
  } catch {
    // Ignore
  }
  return next;
}

export function clearExpeditionVisitedLandmarks(): void {
  try {
    localStorage.removeItem(EXPEDITION_LANDMARKS_KEY);
    localStorage.removeItem(`${PENDING_BUFF_PREFIX}expedition`);
  } catch {
    // Ignore
  }
}

export function isConquestLandmarkReady(
  cooldowns: Record<string, number> | undefined,
  landmarkId: string,
  currentSeason: number
): boolean {
  if (!cooldowns) return true;
  const lastSeason = cooldowns[landmarkId];
  if (typeof lastSeason !== 'number') return true;
  return currentSeason - lastSeason >= 3;
}

export function getPendingOverworldBuff(mode: OverworldExplorationMode): OverworldFieldBuff | null {
  try {
    const raw = localStorage.getItem(`${PENDING_BUFF_PREFIX}${mode}`);
    if (!raw) return null;
    return JSON.parse(raw) as OverworldFieldBuff;
  } catch {
    return null;
  }
}

export function setPendingOverworldBuff(
  mode: OverworldExplorationMode,
  buff: OverworldFieldBuff | null
): void {
  try {
    const key = `${PENDING_BUFF_PREFIX}${mode}`;
    if (!buff) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(buff));
    }
  } catch {
    // Ignore
  }
}

export function consumePendingOverworldBuff(
  mode: OverworldExplorationMode
): OverworldFieldBuff | null {
  const current = getPendingOverworldBuff(mode);
  if (current) {
    setPendingOverworldBuff(mode, null);
  }
  return current;
}

export function getFogOfWarEnabled(): boolean {
  try {
    const raw = localStorage.getItem(FOG_ENABLED_KEY);
    if (raw === null) return true;
    return raw === 'true';
  } catch {
    return true;
  }
}

export function setFogOfWarEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(FOG_ENABLED_KEY, enabled ? 'true' : 'false');
  } catch {
    // Ignore
  }
}

export function getVisitedRealms(): Set<VaeloriaRealmId> {
  try {
    const raw = localStorage.getItem(VISITED_REALMS_KEY);
    if (!raw) return new Set(['veridia', 'matrix']);
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? new Set(arr) : new Set(['veridia', 'matrix']);
  } catch {
    return new Set(['veridia', 'matrix']);
  }
}

export function markRealmVisited(realm: VaeloriaRealmId): Set<VaeloriaRealmId> {
  const next = getVisitedRealms();
  next.add(realm);
  try {
    localStorage.setItem(VISITED_REALMS_KEY, JSON.stringify(Array.from(next)));
  } catch {
    // Ignore
  }
  return next;
}
