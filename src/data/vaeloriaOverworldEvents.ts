import { ALL_CARDS } from './cards';
import { CardDefinition, Domain, OverworldFieldBuff } from '../types/game';
import {
  RegionalLocalLandmark,
  VAELORIA_REGIONAL_MAPS,
  VaeloriaRealmId,
} from './vaeloriaMultimapData';

export type OverworldExplorationMode = 'campaign' | 'expedition' | 'conquest';

export interface OverworldEventChoiceDef {
  id: 'choice_a' | 'choice_b' | 'choice_c';
  title: string;
  icon: string;
  flavorOutcome: string;
  buffKind: 'vitality' | 'essence' | 'bastion' | 'ancestral_pact';
}

export interface OverworldLandmarkEventDef {
  landmarkId: string;
  realm: VaeloriaRealmId;
  title: string;
  kicker: string;
  loreParagraph: string;
  choices: OverworldEventChoiceDef[];
}

export interface ResolvedOverworldChoicePreview {
  rewardBadge: string;
  goldDelta: number;
  suppliesDelta: number;
  shardsDelta: number;
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

  // === INFRAFORJA MAGMÁTICA DE IGNAROTH ===
  lm_underforge_1: {
    kicker: 'FUNDIÇÃO ABISSAL • INFRAFORJA',
    lore: 'Martelos ciclópicos cravam escamas de dragão incandescente sobre bigornas alimentadas pelo manto planetário.',
    choiceATitle: 'Arrematar Lingotes de Escama-Fogo',
    choiceAIcon: '⚒️',
    choiceAOutcome: 'Lotes de metal primordial abastecem generosamente os cofres da sua campanha.',
    choiceBTitle: 'Temperar Escudos na Escória Rubra',
    choiceBIcon: '🛡️',
    choiceBOutcome: 'Armaduras incandescentes protegem sua Vanguarda logo na abertura.',
    buffKind: 'bastion',
  },
  lm_underforge_2: {
    kicker: 'TRAVESSIA MAGMÁTICA • INFRAFORJA',
    lore: 'Elos de ferro do tamanho de torres cruzam o cânion de lava onde patrulhas de Ignaroth cobram tributo de sangue e aço.',
    choiceATitle: 'Confiscar Pedágio das Correntes',
    choiceAIcon: '⛓️',
    choiceAOutcome: 'Cofres de pedágio subterrâneo passam para sua intendência.',
    choiceBTitle: 'Marchar em Formação Blindada',
    choiceBIcon: '🛡️',
    choiceBOutcome: 'A disciplina sobre o abismo endurece sua primeira fileira.',
    buffKind: 'bastion',
  },
  lm_underforge_3: {
    kicker: 'PORTO DE LAVA • INFRAFORJA',
    lore: 'Barcaças de basalto rúnico navegam sobre rios de rocha fundida transportando cristais piroclásticos.',
    choiceATitle: 'Fretar Barcaça de Basalto',
    choiceAIcon: '🚢',
    choiceAOutcome: 'Mercadorias ígneas rendem lucro imediato e suprimentos pesados.',
    choiceBTitle: 'Drenar Fornalha da Barcaça',
    choiceBIcon: '⚡',
    choiceBOutcome: 'O núcleo térmico concede +1⚡ de Essência extra na abertura.',
    buffKind: 'essence',
  },
  lm_underforge_4: {
    kicker: 'SANTUÁRIO DO MANTO • INFRAFORJA',
    lore: 'No altar suspenso sobre o núcleo rubro, pulsa uma brasa que arde desde antes da divisão dos cinco domínios.',
    choiceATitle: 'Colher Gemas do Núcleo',
    choiceAIcon: '💎',
    choiceAOutcome: 'Diamantes vulcânicos puros enriquecem sua reserva real.',
    choiceBTitle: 'Comungar com o Coração de Ignaroth',
    choiceBIcon: '🔥',
    choiceBOutcome: 'Chama ancestral percorre suas veias, ampliando sua Essência inicial.',
    buffKind: 'essence',
  },
  lm_underforge_5: {
    kicker: 'FORTALEZA SUBTERRÂNEA • INFRAFORJA',
    lore: 'Comportas de bronze negro represam uma catarata inteira de magma para defender a cidadela interna.',
    choiceATitle: 'Esvaziar Arsenal da Represa',
    choiceAIcon: '⚙️',
    choiceAOutcome: 'Munições de cerco e provisões reforçam sua coluna.',
    choiceBTitle: 'Erguer Barricadas de Basalto',
    choiceBIcon: '🛡️',
    choiceBOutcome: 'Sua Vanguarda ganha blindagem extra para o próximo confronto.',
    buffKind: 'bastion',
  },
  lm_underforge_6: {
    kicker: 'MAUSOLÉU TITÂNICO • INFRAFORJA',
    lore: 'Sarcófagos de ferro meteórico guardam os artífices primordiais que moldaram as primeiras Relíquias Reais.',
    choiceATitle: 'Resgatar Martelos Ancestrais',
    choiceAIcon: '🔨',
    choiceAOutcome: 'Relíquias de forja raras elevam seu patrimônio militar.',
    choiceBTitle: 'Invocar Vigor dos Artífices',
    choiceBIcon: '❤️',
    choiceBOutcome: 'A bênção dos mestres ferreiros amplia a vitalidade do Soberano.',
    buffKind: 'vitality',
  },

  // === ARQUIPÉLAGO ASTRAL DAS ESTRELAS MORTAS ===
  lm_astral_isles_1: {
    kicker: 'ATALAIA CRONOLÓGICA • ILHAS ASTRAIS',
    lore: 'Um farol de latão gira no sentido anti-horário, projetando luz safira sobre escolhos onde o tempo corre mais devagar.',
    choiceATitle: 'Recolher Lentes de Safira',
    choiceAIcon: '🔭',
    choiceAOutcome: 'Instrumentos náuticos raros enriquecem sua expedição.',
    choiceBTitle: 'Ancorar Escudos no Feixe Temporal',
    choiceBIcon: '🛡️',
    choiceBOutcome: 'Camadas de gelo temporal protegem sua Vanguarda.',
    buffKind: 'bastion',
  },
  lm_astral_isles_2: {
    kicker: 'PONTE DE CONSTELAÇÕES • ILHAS ASTRAIS',
    lore: 'Fragmentos sólidos de luz estelar ligam duas ilhas flutuantes sobre o mar polar.',
    choiceATitle: 'Coletar Poeira Estelar Condensada',
    choiceAIcon: '✨',
    choiceAOutcome: 'Pó astral reluzente rende alto valor entre arcanistas.',
    choiceBTitle: 'Absorver Centelha da Passarela',
    choiceBIcon: '⚡',
    choiceBOutcome: 'A travessia carrega +1⚡ de Essência extra para sua mão inicial.',
    buffKind: 'essence',
  },
  lm_astral_isles_3: {
    kicker: 'NAUFRÁGIOS ASTRAIS • ILHAS ASTRAIS',
    lore: 'Galeões inteiros permanecem encapsulados em cristal translúcido após a queda de uma estrela morta.',
    choiceATitle: 'Escavar Cofres Cristalizados',
    choiceAIcon: '💎',
    choiceAOutcome: 'Tesouros navais preservados por séculos passam ao seu domínio.',
    choiceBTitle: 'Libertar Eco dos Navegadores',
    choiceBIcon: '❤️',
    choiceBOutcome: 'A memória imortal da frota fortalece o sangue do Soberano.',
    buffKind: 'vitality',
  },
  lm_astral_isles_4: {
    kicker: 'PLANETÁRIO CAÍDO • ILHAS ASTRAIS',
    lore: 'Sete esferas metálicas orbitam silenciosamente uma cratera inundada de éter líquido.',
    choiceATitle: 'Extrair Astrolábios das Esferas',
    choiceAIcon: '🪐',
    choiceAOutcome: 'Mecanismos celestes valiosos abastecem seu tesouro.',
    choiceBTitle: 'Alinhar as Sete Órbitas',
    choiceBIcon: '⚡',
    choiceBOutcome: 'A conjunção planetária concede +1⚡ de Essência na abertura.',
    buffKind: 'essence',
  },
  lm_astral_isles_5: {
    kicker: 'PORTO BOREAL • ILHAS ASTRAIS',
    lore: 'Corsários astrais e exploradores polares negociam cartas náuticas no último porto antes do horizonte sem fim.',
    choiceATitle: 'Taxar Frotas Exploradoras',
    choiceAIcon: '⚓',
    choiceAOutcome: 'Tributos portuários reforçam imediatamente suas reservas.',
    choiceBTitle: 'Contratar Timoneiros de Safira',
    choiceBIcon: '❤️',
    choiceBOutcome: 'Provisões árticas de elite ampliam seus Pontos de Vida iniciais.',
    buffKind: 'vitality',
  },
  lm_astral_isles_6: {
    kicker: 'VILA DOS ASTRÔNOMOS • ILHAS ASTRAIS',
    lore: 'Cúpulas de cobre aquecidas por cristais azuis abrigam escribas que catalogam meteoros e fendas.',
    choiceATitle: 'Comerciar Pergaminhos Celestes',
    choiceAIcon: '📜',
    choiceAOutcome: 'Mapas raros são convertidos em ouro e suprimentos.',
    choiceBTitle: 'Estudar Geometria Defensiva',
    choiceBIcon: '🛡️',
    choiceBOutcome: 'Barreiras rúnicas fortalecem a armadura da sua Vanguarda.',
    buffKind: 'bastion',
  },

  // === FOSSA SUBMERSA DA CATEDRAL AFOGADA ===
  lm_sunken_abyss_1: {
    kicker: 'ANCORADOURO ESPECTRAL • FOSSA ABISSAL',
    lore: 'Chamas verdes flutuam sobre a água negra onde submersíveis de osso e bronze atracam em silêncio.',
    choiceATitle: 'Tomar Carga das Galeras Negras',
    choiceAIcon: '⚓',
    choiceAOutcome: 'Pérolas negras e moedas abissais reforçam seu cofre.',
    choiceBTitle: 'Guiar-se pelo Fogo-Fátuo',
    choiceBIcon: '⚡',
    choiceBOutcome: 'As lanternas espectrais concedem +1⚡ de Essência inicial.',
    buffKind: 'essence',
  },
  lm_sunken_abyss_2: {
    kicker: 'DESFILADEIRO HADAL • FOSSA ABISSAL',
    lore: 'O esqueleto de um Leviatã da Primeira Era forma um túnel natural contra a pressão esmagadora do oceano profundo.',
    choiceATitle: 'Serrar Marfim Abissal',
    choiceAIcon: '🦴',
    choiceAOutcome: 'Placas ósseas raras rendem excelente espólio de guerra.',
    choiceBTitle: 'Revestir Tropas em Quitina Hadal',
    choiceBIcon: '🛡️',
    choiceBOutcome: 'Sua Vanguarda recebe +1🛡️ de Armadura contra impactos.',
    buffKind: 'bastion',
  },
  lm_sunken_abyss_3: {
    kicker: 'ALTAR BIOLUMINESCENTE • FOSSA ABISSAL',
    lore: 'Recifes de coral carmesim pulsam como veias vivas ao redor de um cálice submerso.',
    choiceATitle: 'Colher Pérolas Sanguíneas',
    choiceAIcon: '🩸',
    choiceAOutcome: 'Gemas orgânicas raras ampliam sua riqueza.',
    choiceBTitle: 'Sorver Essência do Recife Vivo',
    choiceBIcon: '❤️',
    choiceBOutcome: 'Vitalidade abissal eleva os Pontos de Vida do Soberano.',
    buffKind: 'vitality',
  },
  lm_sunken_abyss_4: {
    kicker: 'BASTIÃO ABISSAL • FOSSA ABISSAL',
    lore: 'Uma torre hermética de pedra negra vigia as correntes profundas com arpões rúnicos.',
    choiceATitle: 'Requisitar Cofre da Atalaia',
    choiceAIcon: '🏰',
    choiceAOutcome: 'Suprimentos selados em cera negra passam ao seu exército.',
    choiceBTitle: 'Postura de Pressão Profunda',
    choiceBIcon: '🛡️',
    choiceBOutcome: 'Sua primeira linha entra em combate com blindagem reforçada.',
    buffKind: 'bastion',
  },
  lm_sunken_abyss_5: {
    kicker: 'RUÍNA AFOGADA • FOSSA ABISSAL',
    lore: 'Quando as correntes marinhas cruzam o claustro submerso, sinos de bronze tocam debaixo d’água.',
    choiceATitle: 'Recuperar Relíquias do Claustro',
    choiceAIcon: '🔔',
    choiceAOutcome: 'Artefatos sacros submersos enriquecem sua caravana.',
    choiceBTitle: 'Ressoar com o Cântico Submerso',
    choiceBIcon: '⚡',
    choiceBOutcome: 'A vibração mística desperta +1⚡ de Essência na abertura.',
    buffKind: 'essence',
  },
  lm_sunken_abyss_6: {
    kicker: 'ENTREPOSTO ABISSAL • FOSSA ABISSAL',
    lore: 'Sob domos de vidro encantado, mercadores umbrais negociam relíquias resgatadas das fossas oceânicas.',
    choiceATitle: 'Cobrar Taxa do Domo Submerso',
    choiceAIcon: '🪙',
    choiceAOutcome: 'O comércio das profundezas abastece seus cofres.',
    choiceBTitle: 'Adquirir Tônicos de Pressão',
    choiceBIcon: '❤️',
    choiceBOutcome: 'Elixires raros ampliam a reserva vital do Soberano.',
    buffKind: 'vitality',
  },

  // === RAÍZES ABISSAIS DA ÁRVORE-MÃE ===
  lm_deep_roots_1: {
    kicker: 'RUÍNA ENGOLIDA • RAÍZES PROFUNDAS',
    lore: 'Raízes do tamanho de muralhas abraçam um zigurate de jade onde repousam ídolos primevos.',
    choiceATitle: 'Extrair Ídolos de Jade Vivo',
    choiceAIcon: '🐍',
    choiceAOutcome: 'Esculturas ancestrais rendem valioso espólio.',
    choiceBTitle: 'Despertar Guardiões de Pedra-Musgo',
    choiceBIcon: '🛡️',
    choiceBOutcome: 'Casca pétrea envolve sua Vanguarda no próximo duelo.',
    buffKind: 'bastion',
  },
  lm_deep_roots_2: {
    kicker: 'SANTUÁRIO MICELIAL • RAÍZES PROFUNDAS',
    lore: 'Cogumelos gigantes iluminam a caverna em tons esmeralda e azul, liberando esporos de pura memória ancestral.',
    choiceATitle: 'Destilar Esporos Luminosos',
    choiceAIcon: '🍄',
    choiceAOutcome: 'Alquimistas pagam alto pelos extratos bioluminescentes.',
    choiceBTitle: 'Inalar Névoa da Memória Viva',
    choiceBIcon: '⚡',
    choiceBOutcome: 'Sua mente desperta +1⚡ de Essência extra para o combate.',
    buffKind: 'essence',
  },
  lm_deep_roots_3: {
    kicker: 'PONTE DE ÂMBAR • RAÍZES PROFUNDAS',
    lore: 'Fios espessos de resina dourada solidificada formam pontes translúcidas sobre rios subterrâneos.',
    choiceATitle: 'Cortar Blocos de Âmbar Real',
    choiceAIcon: '🟠',
    choiceAOutcome: 'Resina milenar abastece sua economia de guerra.',
    choiceBTitle: 'Revestir Escudos em Resina Elástica',
    choiceBIcon: '🛡️',
    choiceBOutcome: 'Armadura orgânica protege sua linha de frente.',
    buffKind: 'bastion',
  },
  lm_deep_roots_4: {
    kicker: 'COMUNA SUBTERRÂNEA • RAÍZES PROFUNDAS',
    lore: 'Druidas cegos do subsolo cultivam ervas imortais irrigadas pelas veias diretas da Árvore-Mãe.',
    choiceATitle: 'Trocar Sementes Raras',
    choiceAIcon: '🌱',
    choiceAOutcome: 'Bolsas de sementes sagradas fortalecem suas finanças.',
    choiceBTitle: 'Banquete de Raízes Imortais',
    choiceBIcon: '❤️',
    choiceBOutcome: 'A refeição sagrada concede vigor extra ao Soberano.',
    buffKind: 'vitality',
  },
  lm_deep_roots_5: {
    kicker: 'PLATÔ FÓSSIL • RAÍZES PROFUNDAS',
    lore: 'Crânios de titãs pré-históricos formam uma fortaleza natural vigiada por patrulhas silvestres.',
    choiceATitle: 'Recolher Presas Primordiais',
    choiceAIcon: '🦖',
    choiceAOutcome: 'Troféus colossais enriquecem sua marcha.',
    choiceBTitle: ' Postura do Behemoth Subterrâneo',
    choiceBIcon: '🛡️',
    choiceBOutcome: 'Sua Vanguarda entra em campo blindada como rocha.',
    buffKind: 'bastion',
  },
  lm_deep_roots_6: {
    kicker: 'PORTO SUBTERRÂNEO • RAÍZES PROFUNDAS',
    lore: 'Canoas entalhadas em casca gigante cruzam um lago cálido de âmbar e seiva dourada.',
    choiceATitle: 'Embarcar Tonéis de Seiva Pura',
    choiceAIcon: '🛶',
    choiceAOutcome: 'Carregamentos valiosos reforçam seus suprimentos.',
    choiceBTitle: 'Ungir Tropas no Lago Dourado',
    choiceBIcon: '❤️',
    choiceBOutcome: 'O banho de âmbar amplia os Pontos de Vida iniciais.',
    buffKind: 'vitality',
  },

  // === BASTILHAS CELESTES DO ZÊNITE ===
  lm_sky_bastions_1: {
    kicker: 'TEMPLO DAS NUVENS • BASTILHAS CELESTES',
    lore: ' Suspenso por cristais gravitacionais, o altar recebe a luz solar antes de qualquer ponto do continente.',
    choiceATitle: 'Recolher Oferendas Celestes',
    choiceAIcon: '☀️',
    choiceAOutcome: 'Ouro puro consagrado pelos serafins reforça seus cofres.',
    choiceBTitle: 'Comungar com o Primeiro Raio',
    choiceBIcon: '⚡',
    choiceBOutcome: 'Luz empírea concede +1⚡ de Essência inicial.',
    buffKind: 'essence',
  },
  lm_sky_bastions_2: {
    kicker: 'VIADUTO EÓLICO • BASTILHAS CELESTES',
    lore: 'Arcos de luz sólida conectam bastiões flutuantes varridos por correntes ascendentes.',
    choiceATitle: 'Coletar Cristais de Sustentação',
    choiceAIcon: '🌤️',
    choiceAOutcome: 'Pedras gravitacionais rendem alto valor estratégico.',
    choiceBTitle: 'Formação de Escudos Alados',
    choiceBIcon: '🛡️',
    choiceBOutcome: 'Sua Vanguarda ganha proteção extra nas alturas.',
    buffKind: 'bastion',
  },
  lm_sky_bastions_3: {
    kicker: 'DOCA CELESTE • BASTILHAS CELESTES',
    lore: 'Naus-dragão de velas solares reabastecem antes de patrulhar os seis reinos lá embaixo.',
    choiceATitle: 'Requisitar Suprimentos da Frota',
    choiceAIcon: '⛵',
    choiceAOutcome: 'Caixas de provisões reais passam ao seu estandarte.',
    choiceBTitle: 'Embarcar Artilheiros do Zênite',
    choiceBIcon: '❤️',
    choiceBOutcome: 'A escolta aérea fortalece a vitalidade inicial do Soberano.',
    buffKind: 'vitality',
  },
  lm_sky_bastions_4: {
    kicker: 'TORRE DE ESPELHOS • BASTILHAS CELESTES',
    lore: 'Espelhos parabólicos de bronze polido comunicam ordens instantâneas através das nuvens.',
    choiceATitle: 'Desmontar Espelhos Reserva',
    choiceAIcon: '🔆',
    choiceAOutcome: 'Lentes imperiais enriquecem sua campanha.',
    choiceBTitle: 'Focalizar Escudo Heliográfico',
    choiceBIcon: '🛡️',
    choiceBOutcome: 'Feixes protetores blindam sua primeira fileira.',
    buffKind: 'bastion',
  },
  lm_sky_bastions_5: {
    kicker: 'OFICINA FLUTUANTE • BASTILHAS CELESTES',
    lore: 'Artífices celestes tecem penas metálicas e engrenagens solares em planadores de guerra.',
    choiceATitle: 'Negociar Peças de Precisão',
    choiceAIcon: '⚙️',
    choiceAOutcome: 'Artefatos mecânicos geram excelente receita.',
    choiceBTitle: 'Carregar Acumulador Solar',
    choiceBIcon: '⚡',
    choiceBOutcome: 'Energia armazenada concede +1⚡ de Essência na abertura.',
    buffKind: 'essence',
  },
  lm_sky_bastions_6: {
    kicker: 'ACROPOLE ANTIGA • BASTILHAS CELESTES',
    lore: 'Colunas partidas de mármore flutuam em órbita lenta ao redor do primeiro trono erguido nos céus.',
    choiceATitle: 'Recuperar Coroas Antigas',
    choiceAIcon: '👑',
    choiceAOutcome: 'Insígnias celestes somam-se ao seu tesouro.',
    choiceBTitle: 'Jurar Sob o Céu Eterno',
    choiceBIcon: '❤️',
    choiceBOutcome: 'A majestade ancestral eleva seus Pontos de Vida iniciais.',
    buffKind: 'vitality',
  },

  // === CRATERA DA FRATURA PRISMÁTICA ===
  lm_prismatic_crater_1: {
    kicker: 'PILAR DE REFRAÇÃO • CRATERA PRISMÁTICA',
    lore: 'Um monólito carmesim vibra em ressonância direta com a energia bruta liberada na Primeira Fratura.',
    choiceATitle: 'Extrair Estilhaços Rubros',
    choiceAIcon: '💎',
    choiceAOutcome: 'Cristais de alta pureza fortalecem seu cofre.',
    choiceBTitle: 'Canalizar Pulso da Fratura',
    choiceBIcon: '⚡',
    choiceBOutcome: 'O monólito concede +1⚡ de Essência extra na abertura.',
    buffKind: 'essence',
  },
  lm_prismatic_crater_2: {
    kicker: 'RUÍNA DO VÉU • CRATERA PRISMÁTICA',
    lore: 'Fendas ametistas revelam vislumbres de linhas temporais alternativas ao redor das pedras partidas.',
    choiceATitle: 'Recolher Relíquias Paradoxais',
    choiceAIcon: '🔮',
    choiceAOutcome: 'Artefatos de outras eras rendem grande fortuna.',
    choiceBTitle: 'Absorver Vigor Transplanar',
    choiceBIcon: '❤️',
    choiceBOutcome: 'Energia além do véu amplia o PV inicial do Soberano.',
    buffKind: 'vitality',
  },
  lm_prismatic_crater_3: {
    kicker: 'LINHA DE LEY OCIDENTAL • CRATERA PRISMÁTICA',
    lore: 'Uma ponte natural de quartzo azul conduz sobre o abismo furta-cor do núcleo planetário.',
    choiceATitle: 'Colher Quartzo de Ley',
    choiceAIcon: '💠',
    choiceAOutcome: 'Cristais condutores abastecem sua intendência.',
    choiceBTitle: 'Cristalizar Escudos de Vanguarda',
    choiceBIcon: '🛡️',
    choiceBOutcome: 'Barreira prismática concede +1🛡️ à linha de frente.',
    buffKind: 'bastion',
  },
  lm_prismatic_crater_4: {
    kicker: 'LINHA DE LEY ORIENTAL • CRATERA PRISMÁTICA',
    lore: 'Raios dourados ascendem do fundo da cratera, iluminando degraus suspensos no vazio.',
    choiceATitle: 'Capturar Filamentos Áureos',
    choiceAIcon: '✨',
    choiceAOutcome: 'Fios de luz condensada enriquecem sua marcha.',
    choiceBTitle: 'Sintonizar Reserva Pentacromática',
    choiceBIcon: '⚡',
    choiceBOutcome: 'Você inicia o próximo duelo com +1⚡ de Essência adicional.',
    buffKind: 'essence',
  },
  lm_prismatic_crater_5: {
    kicker: 'EXPEDIÇÃO AXIAL • CRATERA PRISMÁTICA',
    lore: 'Sábios e cartógrafos dos seis reinos mantêm tendas blindadas na borda interna da cratera.',
    choiceATitle: 'Adquirir Relatórios da Cratera',
    choiceAIcon: '🗺️',
    choiceAOutcome: 'Dados estratégicos e suprimentos reforçam sua campanha.',
    choiceBTitle: 'Receber Tônicos Anti-Radiação Planar',
    choiceBIcon: '❤️',
    choiceBOutcome: 'Preparo alquímico eleva a vitalidade do Soberano.',
    buffKind: 'vitality',
  },
  lm_prismatic_crater_6: {
    kicker: 'FORTALEZA DOS OITO RAIOS • CRATERA PRISMÁTICA',
    lore: 'Ergue-se sobre uma engrenagem colossal partida da Roda Matriz, guardando a descida final rumo a Aetherion.',
    choiceATitle: 'Abrir Arsenal dos Oito Raios',
    choiceAIcon: '☸',
    choiceAOutcome: 'Suprimentos lendários passam ao seu comando.',
    choiceBTitle: 'Blindagem da Roda Matriz',
    choiceBIcon: '🛡️',
    choiceBOutcome: 'Sua Vanguarda recebe proteção ancestral superior.',
    buffKind: 'bastion',
  },
  // === CORREDOR NÁUTICO: MAR DAS TORMENTAS ===
  lm_sea_storms_1: {
    kicker: 'BALUARTE NÁUTICO • MAR DAS TORMENTAS',
    lore: 'O Farol Vulcânico do Nordeste queima óleo de salamandra em lentes de cristal para guiar frotas entre recifes em chamas.',
    choiceATitle: 'Requisitar Cartas de Maré do Farol',
    choiceAIcon: '🧭',
    choiceAOutcome: 'Rotas seguras rendem provisões e tesouros navais.',
    choiceBTitle: 'Reforçar Cascos & Escudos da Frota',
    choiceBIcon: '🛡️',
    choiceBOutcome: 'Sua Vanguarda marcha protegida por blindagem costeira.',
    buffKind: 'bastion',
  },
  lm_sea_storms_2: {
    kicker: 'VIGÍLIA SUDOESTE • MAR DAS TORMENTAS',
    lore: 'Cravado sobre corais cortantes, este farol vigia a borda ocidental do grande vórtice bioluminescente.',
    choiceATitle: 'Resgatar Cargas de Naufrágios',
    choiceAIcon: '⚓',
    choiceAOutcome: 'Caixas seladas de mercadores imperiais enriquecem sua marcha.',
    choiceBTitle: 'Bênção dos Vigias da Tormenta',
    choiceBIcon: '🛡️',
    choiceBOutcome: 'Defesas sólidas fortalecem sua linha de frente.',
    buffKind: 'bastion',
  },
  lm_sea_storms_3: {
    kicker: 'RELÍQUIA ABISSAL • MAR DAS TORMENTAS',
    lore: 'O crânio petrificado de um Leviatã da Primeira Era forma um arco natural onde marés arcanas sussurram segredos.',
    choiceATitle: 'Extrair Marfim Abissal',
    choiceAIcon: '🦴',
    choiceAOutcome: 'Relíquias marinhas raras são integradas ao seu espólio.',
    choiceBTitle: 'Canalizar Ressonância do Leviatã',
    choiceBIcon: '⚡',
    choiceBOutcome: 'Fluxo oceânico concede +1⚡ de Essência de abertura.',
    buffKind: 'essence',
  },
  lm_sea_storms_4: {
    kicker: 'PORTO COURAÇADO • MAR DAS TORMENTAS',
    lore: 'Galés mercantes e corsários ancoram sob baterias de balistas antes de cruzar o Estreito das Frotas.',
    choiceATitle: 'Cobrar Pedágio de Ancoragem',
    choiceAIcon: '🪙',
    choiceAOutcome: 'Tributos portuários financiam sua campanha.',
    choiceBTitle: 'Rações da Esquadra Real',
    choiceBIcon: '❤️',
    choiceBOutcome: 'Sua tripulação recupera vigor para a próxima batalha.',
    buffKind: 'vitality',
  },
  lm_sea_storms_5: {
    kicker: 'ATOL LIVRE • MAR DAS TORMENTAS',
    lore: 'Na Laguna dos Corsários de Coral, capitães de seis bandeiras negociam mapas proibidos sob trégua armada.',
    choiceATitle: 'Negociar no Mercado Flutuante',
    choiceAIcon: '🏴‍☠️',
    choiceAOutcome: 'Contrabando fino reforça seu tesouro.',
    choiceBTitle: 'Recrutar Timoneiros Veteranos',
    choiceBIcon: '❤️',
    choiceBOutcome: 'Vitalidade extra revigora o comando da expedição.',
    buffKind: 'vitality',
  },
  lm_sea_storms_6: {
    kicker: 'SANTUÁRIO SUBMERSO • MAR DAS TORMENTAS',
    lore: 'Uma rosa-dos-ventos colossal em bronze astral brilha sob águas rasas, apontando para todas as linhas de ley costeiras.',
    choiceATitle: 'Recolher Pérolas de Ley',
    choiceAIcon: '🔮',
    choiceAOutcome: 'Cristais marinhos valiosos enriquecem sua reserva.',
    choiceBTitle: 'Alinhar a Bússola Astral',
    choiceBIcon: '⚡',
    choiceBOutcome: 'Você inicia o próximo embate com +1⚡ de Essência extra.',
    buffKind: 'essence',
  },
  // === CORREDOR CELESTE: CORREDOR BOREAL DAS NUVENS ===
  lm_skyway_1: {
    kicker: 'FORTALEZA SUSPENSA • CORREDOR DAS NUVENS',
    lore: 'Ancorada entre correntes de ar polar e colunas térmicas, a Cidadela-Relé guarda o trânsito aéreo do continente.',
    choiceATitle: 'Inspecionar Paióis Aéreos',
    choiceAIcon: '🦅',
    choiceAOutcome: 'Suprimentos estratégicos fortalecem sua marcha.',
    choiceBTitle: 'Escudos Barométricos do Relé',
    choiceBIcon: '🛡️',
    choiceBOutcome: 'Sua Vanguarda recebe +1🛡️ de proteção celeste.',
    buffKind: 'bastion',
  },
  lm_skyway_2: {
    kicker: 'ENGENHARIA ANTIGA • CORREDOR DAS NUVENS',
    lore: 'Arcos ciclópicos ligam rochedos flutuantes acima das nuvens, remanescentes da Era das Armadas.',
    choiceATitle: 'Coletar Fragmentos de Pedra-Leve',
    choiceAIcon: '🏛️',
    choiceAOutcome: 'Minério gravitacional raro agrega valor ao seu arsenal.',
    choiceBTitle: 'Marcha Rápida pelo Viaduto',
    choiceBIcon: '⚡',
    choiceBOutcome: 'Vento favorável concede +1⚡ de Essência inicial.',
    buffKind: 'essence',
  },
  lm_skyway_3: {
    kicker: 'DOCA DAS ARMADAS • CORREDOR DAS NUVENS',
    lore: 'Naus-dragão e galés solares atracam nas torres leste para reabastecer cristais de propulsão.',
    choiceATitle: 'Requisitar Cristais de Propulsão',
    choiceAIcon: '⛵',
    choiceAOutcome: 'Cargas imperiais ampliam seus recursos.',
    choiceBTitle: 'Descanso nos Pavilhões Suspensos',
    choiceBIcon: '❤️',
    choiceBOutcome: 'Ar puro da estratosfera restaura a vitalidade do Soberano.',
    buffKind: 'vitality',
  },
  lm_skyway_4: {
    kicker: 'NINHO REAL • CORREDOR DAS NUVENS',
    lore: 'Nos Picos da Revoada Escarlate, dracos aquecem suas asas nas fumaças vulcânicas que sobem de Pyros.',
    choiceATitle: 'Recolher Escamas Mudadas',
    choiceAIcon: '🐉',
    choiceAOutcome: 'Escamas dracônicas forjam peças valiosas.',
    choiceBTitle: 'Comunhão com os Ginetes do Céu',
    choiceBIcon: '⚡',
    choiceBOutcome: 'Fervor aéreo concede +1⚡ de Essência na abertura.',
    buffKind: 'essence',
  },
  lm_skyway_5: {
    kicker: 'ESPIRAL EÓLICA • CORREDOR DAS NUVENS',
    lore: 'Um redemoinho luminoso de éter azul-celeste eleva embarcações inteiras sem esforço de velas.',
    choiceATitle: 'Capturar Condensado Etéreo',
    choiceAIcon: '🌪️',
    choiceAOutcome: 'Frascos de éter puro enriquecem sua caravana.',
    choiceBTitle: 'Sintonizar o Vórtice Celeste',
    choiceBIcon: '⚡',
    choiceBOutcome: '+1⚡ de Essência adicional flui no início do combate.',
    buffKind: 'essence',
  },
  lm_skyway_6: {
    kicker: 'MEMÓRIA DO QUARTO CANTO • CORREDOR DAS NUVENS',
    lore: 'Pilares partidos marcam o ponto exato onde duas esquadras dracônicas colidiram em 411 D.F.',
    choiceATitle: 'Recuperar Insígnias da Guerra Aérea',
    choiceAIcon: '⚔️',
    choiceAOutcome: 'Armas históricas reforçam seu espólio.',
    choiceBTitle: 'Juramento dos Céus Antigos',
    choiceBIcon: '🛡️',
    choiceBOutcome: 'Couraça ancestral protege sua Vanguarda.',
    buffKind: 'bastion',
  },
  // === 6 CIDADELAS-CAPITAIS IMPERIAIS (4ª ESCALA) ===
  lm_cap_veridia_1: {
    kicker: 'CORAÇÃO DE GALHADA VIVA • CAPITAL DE VERIDIA',
    lore: 'No alto do tronco milenar da Árvore-Mãe, pontes de âmbar convergem para o Trono da Copa Esmeralda.',
    choiceATitle: 'Tributo da Corte Silvestre',
    choiceAIcon: '🌿',
    choiceAOutcome: 'Dons reais de Galhada Viva fortalecem sua expedição.',
    choiceBTitle: 'Sopro Vital da Árvore-Mãe',
    choiceBIcon: '⚡',
    choiceBOutcome: 'Seiva imperial concede +1⚡ de Essência inicial.',
    buffKind: 'essence',
  },
  lm_cap_veridia_2: {
    kicker: 'MURALHA VIVA • CAPITAL DE VERIDIA',
    lore: 'Raízes entrelaçadas mais duras que aço negro formam o Portão Norte de Cipó-Ferro.',
    choiceATitle: 'Inspecionar Paiol de Pau-Ferro',
    choiceAIcon: '🏹',
    choiceAOutcome: 'Viros e escudos vivos reforçam seus recursos.',
    choiceBTitle: 'Guarda de Espinhos da Muralha',
    choiceBIcon: '🛡️',
    choiceBOutcome: 'Sua Vanguarda ganha +1🛡️ de proteção arbórea.',
    buffKind: 'bastion',
  },
  lm_cap_veridia_3: {
    kicker: 'DISTRITO MARCIAL • CAPITAL DE VERIDIA',
    lore: 'Cercada por seis totens colossais, a Arena dos Domadores treina feras alfa e guerreiros da selva.',
    choiceATitle: 'Apostas de Honra dos Clãs',
    choiceAIcon: '🐾',
    choiceAOutcome: 'Recompensas de combate ampliam seu tesouro.',
    choiceBTitle: 'Treino com os Domadores Reais',
    choiceBIcon: '🛡️',
    choiceBOutcome: 'Disciplina feroz blinda sua Vanguarda.',
    buffKind: 'bastion',
  },
  lm_cap_veridia_4: {
    kicker: 'DOCA FLUVIAL • CAPITAL DE VERIDIA',
    lore: 'Canoas entalhadas deslizam sobre águas bioluminescentes sob as raízes arqueadas do Porto de Jade.',
    choiceATitle: 'Desembarcar Especiarias do Sul',
    choiceAIcon: '🛶',
    choiceAOutcome: 'Mercadorias fluviais enriquecem sua reserva.',
    choiceBTitle: 'Elixir das Águas de Jade',
    choiceBIcon: '❤️',
    choiceBOutcome: 'Vitalidade renovada fortalece seu Soberano.',
    buffKind: 'vitality',
  },
  lm_cap_veridia_5: {
    kicker: 'ANEL DRUÍDICO • CAPITAL DE VERIDIA',
    lore: 'Nove monólitos musgosos cercam poças douradas de seiva pura onde os Arquidruidas leem as estações.',
    choiceATitle: 'Colher Gotas de Âmbar Solar',
    choiceAIcon: '✨',
    choiceAOutcome: 'Relíquias druídicas agregam poder à jornada.',
    choiceBTitle: 'Ritual das Poças Douradas',
    choiceBIcon: '⚡',
    choiceBOutcome: 'Harmonia primeva concede +1⚡ de Essência de abertura.',
    buffKind: 'essence',
  },
  lm_cap_veridia_6: {
    kicker: 'MEMÓRIA VIVA • CAPITAL DE VERIDIA',
    lore: 'Esculpido dentro de uma cúpula translúcida de resina fossilizada, o Grande Arquivo preserva sementes de eras extintas.',
    choiceATitle: 'Estudar Pergaminhos Botânicos',
    choiceAIcon: '📜',
    choiceAOutcome: 'Sabedoria antiga rende recursos valiosos.',
    choiceBTitle: 'Tônico de Longevidade Primeva',
    choiceBIcon: '❤️',
    choiceBOutcome: 'Seu Soberano recebe vigor adicional.',
    buffKind: 'vitality',
  },
  lm_cap_vortex_1: {
    kicker: 'EIXO DE CHRONOS • CAPITAL DE CRISTÁLIA',
    lore: 'Anéis colossais de latão giram perpetuamente no topo do Domo do Grande Astrolábio, medindo marés e eclipses.',
    choiceATitle: 'Consultar Efemérides Reais',
    choiceAIcon: '🔭',
    choiceAOutcome: 'Previsões precisas rendem vantagem material.',
    choiceBTitle: 'Sincronia do Pêndulo Polar',
    choiceBIcon: '⚡',
    choiceBOutcome: 'Precisão horológica concede +1⚡ de Essência inicial.',
    buffKind: 'essence',
  },
  lm_cap_vortex_2: {
    kicker: 'TORRES DE REFRAÇÃO • CAPITAL DE CRISTÁLIA',
    lore: 'Sete pináculos de safira viva capturam a luz das auroras boreais para alimentar as defesas da capital.',
    choiceATitle: 'Recolher Lascas de Safira Astral',
    choiceAIcon: '💎',
    choiceAOutcome: 'Gemas polares enriquecem sua reserva.',
    choiceBTitle: 'Sobrecarga de Luz Boreal',
    choiceBIcon: '⚡',
    choiceBOutcome: '+1⚡ de Essência extra energiza sua abertura.',
    buffKind: 'essence',
  },
  lm_cap_vortex_3: {
    kicker: 'DISTRITO MECÂNICO • CAPITAL DE CRISTÁLIA',
    lore: 'Rodas dentadas gigantescas movidas por vapor geotérmico forjam autômatos e cronômetros de guerra.',
    choiceATitle: 'Encomendar Peças de Precisão',
    choiceAIcon: '⚙️',
    choiceAOutcome: 'Engenhos relojoeiros ampliam seus suprimentos.',
    choiceBTitle: 'Calibrar Armaduras da Vanguarda',
    choiceBIcon: '🛡️',
    choiceBOutcome: 'Placas ajustadas concedem +1🛡️ na frente de combate.',
    buffKind: 'bastion',
  },
  lm_cap_vortex_4: {
    kicker: 'ARQUIVO ÁLGIDO • CAPITAL DE CRISTÁLIA',
    lore: 'No silêncio absoluto do Claustro Congelado, monges copistas preservam tratados anteriores à Fratura.',
    choiceATitle: 'Decifrar Códices Polares',
    choiceAIcon: '📘',
    choiceAOutcome: 'Segredos estratégicos fortalecem sua campanha.',
    choiceBTitle: 'Meditação do Zero Sereno',
    choiceBIcon: '⚡',
    choiceBOutcome: 'Mente clara concede +1⚡ de Essência inicial.',
    buffKind: 'essence',
  },
  lm_cap_vortex_5: {
    kicker: 'PORTO POLAR • CAPITAL DE CRISTÁLIA',
    lore: 'Fragatas quebra-gelos aguardam nas eclusas aquecidas antes de enfrentar o Mar das Estrelas Mortas.',
    choiceATitle: 'Receber Tarifas da Frota Boreal',
    choiceAIcon: '🚢',
    choiceAOutcome: 'Ouro mercante reforça seus cofres.',
    choiceBTitle: 'Provisões Térmicas da Esquadra',
    choiceBIcon: '❤️',
    choiceBOutcome: 'Vigor reforçado protege seu Soberano.',
    buffKind: 'vitality',
  },
  lm_cap_vortex_6: {
    kicker: 'BASTIÃO SUL • CAPITAL DE CRISTÁLIA',
    lore: 'Torres gêmeas de granito azulado guardam a única ponte terrestre sobre as fendas glaciais de Cristália.',
    choiceATitle: 'Inspecionar Guarnição Boreal',
    choiceAIcon: '🏰',
    choiceAOutcome: 'Suprimentos militares somam-se à sua tropa.',
    choiceBTitle: 'Formação de Escudos de Gelo',
    choiceBIcon: '🛡️',
    choiceBOutcome: 'Sua Vanguarda recebe +1🛡️ de Armadura.',
    buffKind: 'bastion',
  },
  lm_cap_solaria_1: {
    kicker: 'COROA DE AETHELGARD • CAPITAL DE SOLÁRIA',
    lore: 'Cúpulas folheadas a ouro puro coroam a Basílica do Sol Invicto diante da imensa Praça do Tribunal.',
    choiceATitle: 'Receber Subvenção do Senado Solar',
    choiceAIcon: '☀️',
    choiceAOutcome: 'Fundos imperiais impulsionam sua jornada.',
    choiceBTitle: 'Consagração no Altar do Zênite',
    choiceBIcon: '⚡',
    choiceBOutcome: 'Luz sagrada concede +1⚡ de Essência inicial.',
    buffKind: 'essence',
  },
  lm_cap_solaria_2: {
    kicker: 'MARAVILHA HELIOSTÁTICA • CAPITAL DE SOLÁRIA',
    lore: 'Centenas de espelhos côncavos de bronze polido concentram o sol nascente num único feixe ofuscante.',
    choiceATitle: 'Coletar Cristais Solarizados',
    choiceAIcon: '🔆',
    choiceAOutcome: 'Focos luminosos raros enriquecem seu arsenal.',
    choiceBTitle: 'Canalizar o Feixe Heliostático',
    choiceBIcon: '⚡',
    choiceBOutcome: '+1⚡ de Essência adicional ilumina sua abertura.',
    buffKind: 'essence',
  },
  lm_cap_solaria_3: {
    kicker: 'PORTO CELESTE • CAPITAL DE SOLÁRIA',
    lore: 'Projetados sobre o abismo de nuvens, os píeres de mármore recebem dirigíveis e galés aladas do império.',
    choiceATitle: 'Fretamento das Galés Reais',
    choiceAIcon: '⛵',
    choiceAOutcome: 'Comércio celeste multiplica seus recursos.',
    choiceBTitle: 'Brisa Revigorante do Alto-Mar',
    choiceBIcon: '❤️',
    choiceBOutcome: 'Vitalidade extra fortalece o Soberano.',
    buffKind: 'vitality',
  },
  lm_cap_solaria_4: {
    kicker: 'CIDADELA MILITAR • CAPITAL DE SOLÁRIA',
    lore: 'Fumaça branca sobe das forjas consagradas onde ferreiros batem escudos para a Falange Dourada.',
    choiceATitle: 'Requisitar Armas Consagradas',
    choiceAIcon: '⚒️',
    choiceAOutcome: 'Equipamento de elite passa ao seu comando.',
    choiceBTitle: 'Couraças da Falange Imperial',
    choiceBIcon: '🛡️',
    choiceBOutcome: 'Sua Vanguarda entra em combate com +1🛡️.',
    buffKind: 'bastion',
  },
  lm_cap_solaria_5: {
    kicker: 'TERRAÇOS DO SUL • CAPITAL DE SOLÁRIA',
    lore: 'Arcos triplos de alabastro conduzem águas cristalinas por jardins suspensos acima das falésias marinhas.',
    choiceATitle: 'Colher Ervas dos Jardins Reais',
    choiceAIcon: '🏛️',
    choiceAOutcome: 'Bálsamos nobres enriquecem sua comitiva.',
    choiceBTitle: 'Banho nas Fontes da Aurora',
    choiceBIcon: '❤️',
    choiceBOutcome: '+PV extras revigoram seu Soberano.',
    buffKind: 'vitality',
  },
  lm_cap_solaria_6: {
    kicker: 'ANEL COMERCIAL • CAPITAL DE SOLÁRIA',
    lore: 'Mercadores de todo o Leste Alto negociam sedas, relíquias e contratos sob os toldos dourados de Aethelgard.',
    choiceATitle: 'Cobrar Impostos Imperiais',
    choiceAIcon: '⚖️',
    choiceAOutcome: 'Moedas solares reforçam seu cofre.',
    choiceBTitle: 'Banquete dos Patrícios',
    choiceBIcon: '❤️',
    choiceBOutcome: 'Moral elevada concede vitalidade extra.',
    buffKind: 'vitality',
  },
  lm_cap_eclipse_1: {
    kicker: 'TRONO UMBRAL • CAPITAL DE NOCTURNUS',
    lore: 'Suspensa sobre o abismo roxo por pilares góticos, a Alta Catedral de Obsidiana ressoa com órgãos espectrais.',
    choiceATitle: 'Reivindicar Dízimos da Catedral',
    choiceAIcon: '🕯️',
    choiceAOutcome: 'Relíquias sombrias fortalecem seu espólio.',
    choiceBTitle: 'Comunhão sob o Vitral Violeta',
    choiceBIcon: '⚡',
    choiceBOutcome: 'Ressonância umbral concede +1⚡ de Essência inicial.',
    buffKind: 'essence',
  },
  lm_cap_eclipse_2: {
    kicker: 'NECRÓPOLE REAL • CAPITAL DE NOCTURNUS',
    lore: 'Mausoléus esculpidos em marfim pálido guardam os reis juramentados antes da Queda do Quarto Selo.',
    choiceATitle: 'ExumarJoias da Dinastia Antiga',
    choiceAIcon: '👑',
    choiceAOutcome: 'Tesouros ancestrais passam às suas mãos.',
    choiceBTitle: 'Pacto com os Reis Silenciosos',
    choiceBIcon: '⚡',
    choiceBOutcome: 'Memória real concede +1⚡ de Essência extra.',
    buffKind: 'essence',
  },
  lm_cap_eclipse_3: {
    kicker: 'ENGENHO SANGUÍNEO • CAPITAL DE NOCTURNUS',
    lore: 'Arcos elevados transportam elixir carmesim aquecido das destilarias orientais para os salões nobres.',
    choiceATitle: 'Coletar Frascos de Ícor Rubro',
    choiceAIcon: '🧪',
    choiceAOutcome: 'Alquimia rara valoriza sua marcha.',
    choiceBTitle: 'Transfusão Alquímica Real',
    choiceBIcon: '❤️',
    choiceBOutcome: 'Vitalidade extra fortalece seu Soberano.',
    buffKind: 'vitality',
  },
  lm_cap_eclipse_4: {
    kicker: 'ORDEM DOS CORVOS • CAPITAL DE NOCTURNUS',
    lore: 'Espiões e cronistas sombrios arquivam todos os pactos quebrados de Vaeloria nas torres leste.',
    choiceATitle: 'Interceptar Missivas Secretas',
    choiceAIcon: '🪶',
    choiceAOutcome: 'Informação privilegiada rende espólios.',
    choiceBTitle: 'Manto Tático dos Inquisidores',
    choiceBIcon: '🛡️',
    choiceBOutcome: 'Preparo defensivo concede +1🛡️ à Vanguarda.',
    buffKind: 'bastion',
  },
  lm_cap_eclipse_5: {
    kicker: 'PORTO SUBTERRÂNEO • CAPITAL DE NOCTURNUS',
    lore: 'Barcaças silenciosas iluminadas por lanternas violetas partem rumo à Fossa Submersa e ao mar aberto.',
    choiceATitle: 'Taxar Contrabando Abissal',
    choiceAIcon: '🛶',
    choiceAOutcome: 'Mercadorias raras somam-se ao seu cofre.',
    choiceBTitle: 'Bênção do Barqueiro Cinzento',
    choiceBIcon: '❤️',
    choiceBOutcome: 'Proteção anímica eleva seus pontos de vida.',
    buffKind: 'vitality',
  },
  lm_cap_eclipse_6: {
    kicker: 'PORTÃO DE ÉBANO • CAPITAL DE NOCTURNUS',
    lore: 'Muralhas dentadas de ferro negro e lanças rúnicas vigiam a estrada que sobe do Vale do Eclipse.',
    choiceATitle: 'Inspecionar Arsenal Sangue-Negro',
    choiceAIcon: '⚔️',
    choiceAOutcome: 'Aço temperado em sombra reforça sua tropa.',
    choiceBTitle: 'Falange dos Cavaleiros Pálidos',
    choiceBIcon: '🛡️',
    choiceBOutcome: 'Sua Vanguarda recebe +1🛡️ de Armadura.',
    buffKind: 'bastion',
  },
  lm_cap_pyros_1: {
    kicker: 'CORAÇÃO DE VULCANOR • CAPITAL DE PYROS',
    lore: 'No centro do hexágono de basalto, uma bigorna do tamanho de uma montanha verte rios de fogo líquido sob o Trono Rubro.',
    choiceATitle: 'Forjar Tributo na Grande Bigorna',
    choiceAIcon: '🔨',
    choiceAOutcome: 'Lingotes dracônicos enriquecem seu império.',
    choiceBTitle: 'Chama Soberana da Caldeira',
    choiceBIcon: '⚡',
    choiceBOutcome: 'Calor primordial concede +1⚡ de Essência inicial.',
    buffKind: 'essence',
  },
  lm_cap_pyros_2: {
    kicker: 'BARRAGEM MAGMÁTICA • CAPITAL DE PYROS',
    lore: 'Comportas titânicas domam cascatas de lava incandescente para mover os martelos hidráulicos da cidade.',
    choiceATitle: 'Extrair Cristais de Escória Pura',
    choiceAIcon: '🌋',
    choiceAOutcome: 'Minérios ígneos ampliam seu tesouro.',
    choiceBTitle: 'Canalizar Pressão Térmica',
    choiceBIcon: '⚡',
    choiceBOutcome: '+1⚡ de Essência extra impulsiona o turno inicial.',
    buffKind: 'essence',
  },
  lm_cap_pyros_3: {
    kicker: 'DISTRITO INDUSTRIAL • CAPITAL DE PYROS',
    lore: 'Dezenas de chaminés e cadinhos abertos fundem aço-dragão dia e noite para as legiões do Norte.',
    choiceATitle: 'Requisitar Lotes das Fundições',
    choiceAIcon: '⚙️',
    choiceAOutcome: 'Armamentos pesados reforçam sua reserva.',
    choiceBTitle: 'Blindagem Temperada em Magma',
    choiceBIcon: '🛡️',
    choiceBOutcome: 'Placas rubras concedem +1🛡️ à Vanguarda.',
    buffKind: 'bastion',
  },
  lm_cap_pyros_4: {
    kicker: 'TORRES AÉREAS • CAPITAL DE PYROS',
    lore: 'Agulhas vulcânicas escarpadas servem de poleiro para wyverns imperiais e ginetes de escama carmesim.',
    choiceATitle: 'Suprimentos da Esquadra Alada',
    choiceAIcon: '🐉',
    choiceAOutcome: 'Equipamento de voo agrega valor à campanha.',
    choiceBTitle: 'Vigor dos Ginetes de Brasa',
    choiceBIcon: '❤️',
    choiceBOutcome: 'Seu Soberano ganha vitalidade extra.',
    buffKind: 'vitality',
  },
  lm_cap_pyros_5: {
    kicker: 'COLISEU DE CINZAS • CAPITAL DE PYROS',
    lore: 'No anfiteatro escavado na rocha viva, campeões disputam honra e comando diante dos generais de Vulcanor.',
    choiceATitle: 'Prêmio dos Campeões da Arena',
    choiceAIcon: '🏆',
    choiceAOutcome: 'Ouro de combate reforça seus cofres.',
    choiceBTitle: 'Fervor Marcial dos Gladiadores',
    choiceBIcon: '🛡️',
    choiceBOutcome: 'Postura aguerrida concede +1🛡️ na frente.',
    buffKind: 'bastion',
  },
  lm_cap_pyros_6: {
    kicker: 'TRAVESSIA SUL • CAPITAL DE PYROS',
    lore: 'Correntes da grossura de troncos sustentam a ponte levadiça sobre o abismo incandescente da caldeira.',
    choiceATitle: 'Pedágio da Ponte de Ferro',
    choiceAIcon: '⛓️',
    choiceAOutcome: 'Tributos de caravanas fortalecem sua marcha.',
    choiceBTitle: 'Trancar Escudos nas Correntes',
    choiceBIcon: '🛡️',
    choiceBOutcome: 'Sua Vanguarda entra fortalecida com +1🛡️.',
    buffKind: 'bastion',
  },
  lm_cap_axial_1: {
    kicker: 'EIXO DO MUNDO • CIDADE FRANCA AXIAL',
    lore: 'No centro exato das cinco avenidas de ley ergue-se a Torre dos Cinco Selos, cercada pelas arquibancadas do Coliseu do Pacto.',
    choiceATitle: 'Audiência no Conselho Pentacromático',
    choiceAIcon: '☸',
    choiceAOutcome: 'Subsídios diplomáticos ampliam seu tesouro.',
    choiceBTitle: 'Convergência dos Cinco Selos',
    choiceBIcon: '⚡',
    choiceBOutcome: 'Você inicia o próximo duelo com +1⚡ de Essência extra.',
    buffKind: 'essence',
  },
  lm_cap_axial_2: {
    kicker: 'SETOR NOROESTE • CIDADE FRANCA AXIAL',
    lore: 'Fornalhas diplomáticas da Embaixada Rubra forjam lâminas cerimoniais e armaduras para guardas de caravana.',
    choiceATitle: 'Contratos do Arsenal Rubro',
    choiceAIcon: '🔥',
    choiceAOutcome: 'Aço imperial reforça seus recursos.',
    choiceBTitle: 'Couraças da Guarda da Embaixada',
    choiceBIcon: '🛡️',
    choiceBOutcome: 'Sua Vanguarda recebe +1🛡️ de proteção.',
    buffKind: 'bastion',
  },
  lm_cap_axial_3: {
    kicker: 'SETOR NORDESTE • CIDADE FRANCA AXIAL',
    lore: 'Cúpulas azuladas e obeliscos de cristal marcam a Embaixada Safira, centro de cartografia e câmbio planar.',
    choiceATitle: 'Adquirir Atlas do Conclave',
    choiceAIcon: '❄️',
    choiceAOutcome: 'Mapas raros rendem vantagem estratégica.',
    choiceBTitle: 'Foco de Cristal Safira',
    choiceBIcon: '⚡',
    choiceBOutcome: '+1⚡ de Essência adicional energiza sua mão inicial.',
    buffKind: 'essence',
  },
  lm_cap_axial_4: {
    kicker: 'SETOR LESTE • CIDADE FRANCA AXIAL',
    lore: 'Sob domos dourados funciona a Casa da Moeda Axial, onde todos os tributos continentais são pesados.',
    choiceATitle: 'Resgatar Letras de Câmbio Reais',
    choiceAIcon: '☀️',
    choiceAOutcome: 'Fundos generosos abastecem sua campanha.',
    choiceBTitle: 'Guarda de Honra Aurífera',
    choiceBIcon: '🛡️',
    choiceBOutcome: '+1🛡️ blinda sua linha de Vanguarda.',
    buffKind: 'bastion',
  },
  lm_cap_axial_5: {
    kicker: 'SETOR SUL • CIDADE FRANCA AXIAL',
    lore: 'Jardins botânicos e canais curativos da Embaixada Esmeralda oferecem refúgio aos viajantes dos cinco reinos.',
    choiceATitle: 'Colher Bálsamos Diplomáticos',
    choiceAIcon: '🌿',
    choiceAOutcome: 'Especiarias raras enriquecem sua comitiva.',
    choiceBTitle: 'Descanso nos Jardins do Pacto',
    choiceBIcon: '❤️',
    choiceBOutcome: 'Vitalidade renovada fortalece seu Soberano.',
    buffKind: 'vitality',
  },
  lm_cap_axial_6: {
    kicker: 'SETOR OESTE • CIDADE FRANCA AXIAL',
    lore: 'Catedrais pontiagudas em pedra violeta abrigam a Embaixada Umbral, onde contratos de sangue e segredos de Estado são selados.',
    choiceATitle: 'Negociar nos Salões de Veludo',
    choiceAIcon: '💀',
    choiceAOutcome: 'Pactos lucrativos aumentam seu espólio.',
    choiceBTitle: 'Selo de Vigilância Umbral',
    choiceBIcon: '⚡',
    choiceBOutcome: '+1⚡ de Essência extra flui na abertura.',
    buffKind: 'essence',
  },
};

export function getLandmarkEventDef(
  realm: VaeloriaRealmId,
  landmark: RegionalLocalLandmark
): OverworldLandmarkEventDef {
  const custom = LANDMARK_CUSTOM_LORE[landmark.id];
  const realmDef = VAELORIA_REGIONAL_MAPS[realm];
  const offersAncestralPact =
    realmDef.tier === 'deep_frontier' ||
    realmDef.tier === 'imperial_capital' ||
    realmDef.tier === 'transit_corridor' ||
    landmark.kind === 'shrine' ||
    landmark.kind === 'ruin';

  const ancestralChoice: OverworldEventChoiceDef = {
    id: 'choice_c',
    title:
      realmDef.tier === 'imperial_capital'
        ? 'Decreto Imperial da Cidadela'
        : realmDef.tier === 'transit_corridor'
          ? 'Pacto das Rotas Soberanas'
          : realmDef.tier === 'deep_frontier'
            ? 'Selar Pacto da Fronteira Profunda'
            : 'Invocar Pacto Ancestral do Santuário',
    icon: realmDef.tier === 'imperial_capital' ? '👑' : '💎',
    flavorOutcome:
      realmDef.tier === 'imperial_capital'
        ? 'A corte soberana da Cidadela concede Estilhaços Reais e convergência tática imediata para sua marcha.'
        : 'Você toca o veio profundo de Ley e reivindica Estilhaços Astrais junto a uma convergência tática de abertura.',
    buffKind: 'ancestral_pact',
  };

  if (custom) {
    const choices: OverworldEventChoiceDef[] = [
      {
        id: 'choice_a',
        title: custom.choiceATitle.trim(),
        icon: custom.choiceAIcon,
        flavorOutcome: custom.choiceAOutcome,
        buffKind: custom.buffKind,
      },
      {
        id: 'choice_b',
        title: custom.choiceBTitle.trim(),
        icon: custom.choiceBIcon,
        flavorOutcome: custom.choiceBOutcome,
        buffKind: custom.buffKind,
      },
    ];
    if (offersAncestralPact) {
      choices.push(ancestralChoice);
    }
    return {
      landmarkId: landmark.id,
      realm,
      title: landmark.name,
      kicker: custom.kicker,
      loreParagraph: custom.lore.trim(),
      choices,
    };
  }

  const fallbackChoices: OverworldEventChoiceDef[] = [
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
  ];
  if (offersAncestralPact) {
    fallbackChoices.push(ancestralChoice);
  }

  return {
    landmarkId: landmark.id,
    realm,
    title: landmark.name,
    kicker: `MARCO REGIONAL • ${realmDef.shortName.toUpperCase()}`,
    loreParagraph: `Sua comitiva alcança ${landmark.name}, um ponto estratégico nas terras de ${realmDef.shortName}.`,
    choices: fallbackChoices,
  };
}

function pickDeterministicDomainCard(
  landmarkId: string,
  domain: Domain,
  legendaryOnly = false
): CardDefinition | null {
  const pool = ALL_CARDS.filter((c) => {
    const matchesDomain =
      c.domain === domain || (domain === 'neutral' && c.rarity === 'legendary');
    if (!matchesDomain) return false;
    return legendaryOnly ? c.rarity === 'legendary' : c.rarity === 'rare' || c.rarity === 'legendary';
  });
  const safePool = pool.length > 0 ? pool : ALL_CARDS;
  if (safePool.length === 0) return null;
  let hash = legendaryOnly ? 7919 : 0;
  for (let i = 0; i < landmarkId.length; i++) {
    hash = (hash * 31 + landmarkId.charCodeAt(i)) >>> 0;
  }
  return safePool[hash % safePool.length];
}

function buildFieldBuffFromKind(
  landmarkId: string,
  landmarkName: string,
  realm: VaeloriaRealmId,
  kind: 'vitality' | 'essence' | 'bastion' | 'ancestral_pact',
  isExpedition = false
): OverworldFieldBuff {
  if (kind === 'ancestral_pact') {
    return {
      id: `buff_${landmarkId}_${Date.now()}`,
      sourceLandmarkName: landmarkName,
      realm,
      bonusHp: isExpedition ? 4 : 2,
      bonusOpeningEssence: 1,
      vanguardArmorBonus: 0,
      bonusOpeningDraw: 1,
      summaryLabel: isExpedition
        ? '+1⚡ Essência, +1🃏 Compra & +4❤️ PV'
        : '+1⚡ Essência, +1🃏 Compra & +2❤️ PV',
    };
  }
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
        shardsDelta: 0,
        recruitedCard: null,
        fieldBuff: null,
      };
    }
    if (choice.id === 'choice_c') {
      const buff = buildFieldBuffFromKind(
        eventDef.landmarkId,
        eventDef.title,
        eventDef.realm,
        'ancestral_pact',
        false
      );
      return {
        rewardBadge: `+15 💎 Estilhaços & Pacto (${buff.summaryLabel})`,
        goldDelta: 0,
        suppliesDelta: 0,
        shardsDelta: 15,
        recruitedCard: null,
        fieldBuff: buff,
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
      shardsDelta: 0,
      recruitedCard: null,
      fieldBuff: buff,
    };
  }

  if (mode === 'expedition') {
    if (choice.id === 'choice_a') {
      const card = pickDeterministicDomainCard(eventDef.landmarkId, realmDef.domain, false);
      return {
        rewardBadge: card
          ? `🃏 Recrutar [${card.name}] + 15 🪙 Ouro`
          : '+25 🪙 Ouro da Expedição',
        goldDelta: card ? 15 : 25,
        suppliesDelta: 0,
        shardsDelta: 0,
        recruitedCard: card,
        fieldBuff: null,
      };
    }
    if (choice.id === 'choice_c') {
      const card = pickDeterministicDomainCard(eventDef.landmarkId, realmDef.domain, true);
      const buff = buildFieldBuffFromKind(
        eventDef.landmarkId,
        eventDef.title,
        eventDef.realm,
        'ancestral_pact',
        true
      );
      return {
        rewardBadge: card
          ? `💎 Lenda [${card.name}] & Pacto (${buff.summaryLabel})`
          : `💎 Pacto Ancestral (${buff.summaryLabel})`,
        goldDelta: 0,
        suppliesDelta: 0,
        shardsDelta: 10,
        recruitedCard: card,
        fieldBuff: buff,
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
      shardsDelta: 0,
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
      shardsDelta: 0,
      recruitedCard: null,
      fieldBuff: null,
    };
  }
  if (choice.id === 'choice_c') {
    const buff = buildFieldBuffFromKind(
      eventDef.landmarkId,
      eventDef.title,
      eventDef.realm,
      'ancestral_pact',
      false
    );
    return {
      rewardBadge: `+25 ⚙️ Suprimentos, +4 💎 & Cerco (${buff.summaryLabel})`,
      goldDelta: 0,
      suppliesDelta: 25,
      shardsDelta: 4,
      recruitedCard: null,
      fieldBuff: buff,
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
    shardsDelta: 0,
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
