import { Domain } from '../types/game';
import { CARDS_BY_ID } from './cards';
import { PREBUILT_DECKS } from './decks';

export interface DeckCompositionSummary {
  creatures: number;
  spells: number;
  reactions: number;
  relics: number;
  ascensions: number;
  averageCost: number;
}

export interface SignatureCombo {
  title: string;
  cards: string[];
  howItWorks: string;
}

export interface DeckTacticalProfile {
  deckId: string;
  deckName: string;
  subtitle: string;
  domains: Domain[];
  archetypeTag: string;
  keyCards?: string[];
  compositionSummary: DeckCompositionSummary;
  playstyleOverview: string;
  channelingStrategy: string;
  positioningAndStackingGuide: string;
  phasePlan: {
    earlyGame: string;
    midGame: string;
    lateGame: string;
  };
  signatureCombos: SignatureCombo[];
  strengths: string[];
  weaknesses: string[];
}

export interface MatchupGuide {
  myDeckId: string;
  enemyDeckId: string;
  favorability: 'Favorável' | 'Equilibrado' | 'Desafiador';
  estimatedWinRate: number;
  keyObjective: string;
  whatToChannel: string;
  positioningTactic: string;
  priorityTargets: string[];
  dangerWatchout: string;
  victoryPath: string;
}

/**
 * Doutrina Oficial Anti-Domínio (Mecânica `break_domain_expansion` — Generais da Roda #173):
 * 1. Quebra Direta e Exaustão: Ao entrar em campo ou ao declarar ataque, qualquer General da Roda
 *    destrói imediatamente a Expansão de Domínio inimiga ativa, remove o bônus de +1/+1 (Potencial 120%)
 *    e o Acerto Garantido do rival, e impõe 2 rodadas de Exaustão de Domínio ao Soberano oponente.
 * 2. Vitória Instantânea em Disputa de Domínios (50/50): Quando ambos os Soberanos expandem seus Domínios
 *    e entram em Choque de Domínios (anulando os Acertos Garantidos), invocar ou atacar com um General da Roda
 *    estilhaça apenas o Domínio rival (`clashRival`), devolvendo na mesma hora a soberania plena (+1/+1 e
 *    Acerto Garantido direto ao Soberano inimigo!) à sua própria Expansão de Domínio.
 */
export const ANTI_DOMAIN_DOCTRINE = {
  mechanicId: 'break_domain_expansion',
  title: 'Doutrina da Roda: Quebrar Expansões de Domínio',
  exhaustionRoundsImposed: 2,
  wheelGeneralIds: [
    'neutral_173_general_roda_matriz',
    'red_173_general_roda_chama',
    'blue_173_general_roda_gelo',
    'purple_173_general_roda_abismo',
    'green_173_general_roda_selva',
    'gold_173_general_roda_sol',
  ],
  directBreakRule:
    'Ao entrar ou ao atacar, qualquer General da Roda (#173) destrói imediatamente a Expansão de Domínio inimiga, encerra o +1/+1 e o Acerto Garantido rival e impõe 2 rodadas de Exaustão de Domínio ao oponente.',
  clashResolutionRule:
    'Em uma Disputa de Domínios 50/50, um General da Roda quebra exclusivamente a Expansão rival (clashRival), restaurando instantaneamente o +1/+1 e o Acerto Garantido da sua própria Expansão de Domínio.',
} as const;

export const DECK_TACTICAL_PROFILES: Record<string, DeckTacticalProfile> = {
  "deck_red_inferno": {
    "deckId": "deck_red_inferno",
    "deckName": "Grimório da Cratera Ardente",
    "subtitle": "Mono-Vermelho 🔥 • Chama & Escama",
    "domains": [
      "red"
    ],
    "archetypeTag": "Artilharia Piromântica & Aggro (55 Criaturas / 37 Magias)",
    "compositionSummary": {
      "creatures": 82,
      "spells": 10,
      "reactions": 0,
      "relics": 8,
      "ascensions": 15,
      "averageCost": 3.93
    },
    "playstyleOverview": "Baralho agressivo de pressão constante (100 cartas) que combina 55 feras vulcânicas de Ímpeto com 37 cartas de queima e reação piromântica (27 Feitiços e 10 Reações). O objetivo é abrir brechas na Vanguarda inimiga com dano em área e finalizar com o Sopro devastador dos Dragões Vermelhos.",
    "channelingStrategy": "Turnos 1–3: Canalize um dragão de custo 6–7 duplicado ou uma Relíquia lenta para garantir Afinidade Vermelha nível 2 rapidamente. Turnos 4+: Pare de canalizar magias de queima direta — cada feitiço na mão representa alcance letal contra o Soberano rival. Jamais canalize Pyrrakon, General da Roda Vulcânica nos turnos médios/finais: preserve seu General da Roda para quebrar a Expansão de Domínio inimiga (ou vencer instantaneamente uma Disputa de Domínios 50/50)!",
    "positioningAndStackingGuide": "Coloque Batedores Escamados e Salamandras na Retaguarda com Alcance. Na Vanguarda, espalhe atacantes de Ímpeto em colunas diferentes para forçar múltiplos bloqueios e ativar Invasão de Coluna (+1⚔️ ATQ) nos slots vazios inimigos.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Batedor Escamado das Brasas, Diabrete de Escória Vulcânica, Flagelo Cornudo da Fornalha para disputar colunas cedo, absorver pressão e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine a transição de meio de jogo com Tecelão do Feixe Ígneo, Presságio da Revoada Cinzenta, Pactuário do Espírito Magmático, consolidando colunas chave e acumulando Afinidade rumo à sua Expansão de Domínio (6/6). Use Pactuário do Espírito Magmático na Retaguarda com Alcance para disparar bônus a cada feitiço lançado enquanto invoca proteção na Vanguarda.",
      "lateGame": "Ative sua Expansão de Domínio (6/6) e domine o fim de jogo com Pyrrakon, General da Roda Vulcânica, Hoste Dracônica da Cratera, Arauto da Supernova Prismática, Igniskar, Tirano da Cratera. Se o rival ativar o Domínio dele — ou forçar uma Disputa de Domínios 50/50 —, invoque (ou ataque com) Pyrrakon, General da Roda Vulcânica para quebrar a Expansão inimiga, impor 2 rodadas de Exaustão de Domínio ao oponente, blindar seus aliados com Escudo Divino e reativar na hora o +1/+1 e o Acerto Garantido do seu próprio Domínio! Com Hoste Dracônica da Cratera, varra a Vanguarda rival com Sopro em área, gere duas fichas 2/2 imediatas e dispare seu efeito devastador ao atacar."
    },
    "signatureCombos": [
      {
        "title": "Sinergia Co-Evoluída (82.4% WR)",
        "cards": [
          "Draco de Escória Vulcânica",
          "Malakor, General da Lâmina Colossal"
        ],
        "howItWorks": "Abertura de corredor tático: Draco de Escória Vulcânica neutraliza bloqueadores para a infiltração letal de Malakor, General da Lâmina Colossal (82.4% WR, +45.1% Lift)."
      },
      {
        "title": "Quebra de Domínio & Contra-Ofensiva (Pyrrakon)",
        "cards": [
          "Pyrrakon, General da Roda Vulcânica",
          "Hoste Dracônica da Cratera",
          "Pactuário do Espírito Magmático"
        ],
        "howItWorks": "Desça Pyrrakon, General da Roda Vulcânica para destruir a Expansão de Domínio rival (ou quebrar apenas o domínio inimigo numa Disputa 50/50, reativando seu Acerto Garantido!), impor 2 rodadas de Exaustão de Domínio ao oponente e proteger sua mesa com Escudo Divino enquanto Hoste Dracônica da Cratera, Pactuário do Espírito Magmático fecha o letal."
      }
    ],
    "strengths": [
      "Altíssimo poder de finalização direta contra o Soberano com magias e Sopros.",
      "Excelente remoção em área contra baralhos de enxame (Verde/Dourado).",
      "Velocidade explosiva nos primeiros 5 turnos.",
      "Resposta Anti-Domínio nativa com Pyrrakon, General da Roda Vulcânica (quebra Expansões inimigas na entrada ou ataque e impõe 2 rodadas de Exaustão de Domínio)."
    ],
    "weaknesses": [
      "Poucas opções de cura para o próprio Soberano em duelos prolongados.",
      "Criaturas de custo baixo têm pouca VIDA contra Escudo Divino."
    ],
    "keyCards": [
      "red_111_predador_piroclastico",
      "red_173_general_roda_chama",
      "red_188_malik_genio_tres_brasas",
      "red_181_ignis_marechal_coroa_cinzas",
      "red_195_clamor_forja_guerra",
      "red_180_malakor_general_lamina_colossal",
      "red_179_khorvus_tirano_mascara_auricrania",
      "red_186_carcereiro_jaula_ardente"
    ]
  },
  "deck_blue_tempest": {
    "deckId": "deck_blue_tempest",
    "deckName": "Tomo do Olho do Furacão",
    "subtitle": "Mono-Azul ❄️ • Tempestade & Runa",
    "domains": [
      "blue"
    ],
    "archetypeTag": "Grimório Arcano & Controle Glacial (48 Magias/Reações)",
    "compositionSummary": {
      "creatures": 65,
      "spells": 15,
      "reactions": 11,
      "relics": 9,
      "ascensions": 12,
      "averageCost": 3.39
    },
    "playstyleOverview": "Quase metade do grimório de 100 cartas (35 Feitiços e 13 Reações) consiste em magias de gelo, relâmpago e manipulação temporal. Em vez de disputar força bruta na Vanguarda, o Conclave paralisa colunas inteiras com Congelamento e vence pelos céus com Leviatãs, Esfinges e Krakens.",
    "channelingStrategy": "Canalize feitiços situacionais nos primeiros turnos; mantenha sempre Essência aberta para suas 13 Reações. Jamais canalize Cryonax, General da Roda Astral nos turnos médios/finais: preserve seu General da Roda para quebrar a Expansão de Domínio inimiga (ou vencer instantaneamente uma Disputa de Domínios 50/50)!",
    "positioningAndStackingGuide": "Empilhe até 2–3 Magos de Alcance num mesmo slot protegido da Retaguarda atrás de uma Naga Guardiã ou Gigante de Gelo Jarl na Vanguarda. Use suas 10 Reações para punir qualquer tentativa inimiga de quebrar sua coluna principal.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Sentinela das Correntes Aéreas, Iniciado da Torre Astral, Flagelo Cornudo da Geada para disputar colunas cedo, absorver pressão e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine a transição de meio de jogo com Tecelão do Feixe Astral, Presságio da Revoada Glacial, Pactuário do Espírito Glacial, consolidando colunas chave e acumulando Afinidade rumo à sua Expansão de Domínio (6/6). Use Pactuário do Espírito Glacial na Retaguarda com Alcance para disparar bônus a cada feitiço lançado enquanto invoca proteção na Vanguarda.",
      "lateGame": "Ative sua Expansão de Domínio (6/6) e domine o fim de jogo com Cryonax, General da Roda Astral, Esquadra Dracônica da Nevasca, Arauto do Zero Prismático, Kraken da Fossa Abissal. Se o rival ativar o Domínio dele — ou forçar uma Disputa de Domínios 50/50 —, invoque (ou ataque com) Cryonax, General da Roda Astral para quebrar a Expansão inimiga, impor 2 rodadas de Exaustão de Domínio ao oponente, blindar seus aliados com Escudo Divino e reativar na hora o +1/+1 e o Acerto Garantido do seu próprio Domínio! Com Esquadra Dracônica da Nevasca, varra a Vanguarda rival com Sopro em área, gere duas fichas 2/2 imediatas e dispare seu efeito devastador ao atacar."
    },
    "signatureCombos": [
      {
        "title": "Sinergia Co-Evoluída (100% WR)",
        "cards": [
          "Cetro da Geada Soberana",
          "Nereus, Soberano das Sete Marés"
        ],
        "howItWorks": "Abertura de corredor tático: Cetro da Geada Soberana neutraliza bloqueadores para a infiltração letal de Nereus, Soberano das Sete Marés (100.0% WR, +48.5% Lift)."
      },
      {
        "title": "Quebra de Domínio & Contra-Ofensiva (Cryonax)",
        "cards": [
          "Cryonax, General da Roda Astral",
          "Esquadra Dracônica da Nevasca",
          "Pactuário do Espírito Glacial"
        ],
        "howItWorks": "Desça Cryonax, General da Roda Astral para destruir a Expansão de Domínio rival (ou quebrar apenas o domínio inimigo numa Disputa 50/50, reativando seu Acerto Garantido!), impor 2 rodadas de Exaustão de Domínio ao oponente e proteger sua mesa com Escudo Divino enquanto Esquadra Dracônica da Nevasca, Pactuário do Espírito Glacial fecha o letal."
      }
    ],
    "strengths": [
      "Neutraliza completamente colossos lentos e pilhas de esquadrão com Congelamento.",
      "Maior capacidade de compra de cartas entre os baralhos mono-domínio.",
      "Forte presença aérea com Voo e Alcance.",
      "Resposta Anti-Domínio nativa com Cryonax, General da Roda Astral (quebra Expansões inimigas na entrada ou ataque e impõe 2 rodadas de Exaustão de Domínio)."
    ],
    "weaknesses": [
      "Vulnerável a dano direto de feitiços que ignoram a Vanguarda congelada.",
      "Exige gestão cuidadosa de Essência para manter Reações ativas."
    ],
    "keyCards": [
      "blue_40_naga_guardia",
      "blue_173_general_roda_gelo",
      "blue_188_tariq_genio_tres_ventos",
      "blue_172_armada_draconica_gelo",
      "blue_177_cronomante_terceiro_prisma",
      "blue_176_sentinela_capuz_estelar",
      "blue_185_urso_garras_geada",
      "blue_174_inversao_coordenadas"
    ]
  },
  "deck_purple_abyss": {
    "deckId": "deck_purple_abyss",
    "deckName": "Necronomicon do Sol Negro",
    "subtitle": "Mono-Roxo 💀 • Abismo & Sombra",
    "domains": [
      "purple"
    ],
    "archetypeTag": "Necromancia, Cripta & Dreno Vital (55 Criaturas / 32 Magias)",
    "compositionSummary": {
      "creatures": 65,
      "spells": 24,
      "reactions": 1,
      "relics": 10,
      "ascensions": 10,
      "averageCost": 3.51
    },
    "playstyleOverview": "Grimório de atrito imortal (100 cartas: 55 Criaturas, 22 Feitiços, 10 Reações e 13 Relíquias) focado em Renascer, Dreno de Vida e reanimação contínua da Cripta.",
    "channelingStrategy": "Turnos 1–3: Canalize cartas de custo 5–6 ou feitiços situacionais para ativar Afinidade Roxa 2+. Turnos 4+: Evite canalizar criaturas lendárias se você tiver Exumar Legião ou Erguer os Mortos, pois até unidades abatidas em combate voltam da Cripta. Jamais canalize Nyxaroth, General da Roda Fúnebre nos turnos médios/finais: preserve seu General da Roda para quebrar a Expansão de Domínio inimiga (ou vencer instantaneamente uma Disputa de Domínios 50/50)!",
    "positioningAndStackingGuide": "Use mortos-vivos com Renascer e Toque Letal na Vanguarda e proteja suas 13 Relíquias na Retaguarda.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Legionário Ossudo, Servo Esquelético da Catacumba, Flagelo Cornudo do Abismo para disputar colunas cedo, absorver pressão e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine a transição de meio de jogo com Tecelão do Feixe Umbral, Presságio da Revoada Umbral, Pactuário do Espírito Umbral, consolidando colunas chave e acumulando Afinidade rumo à sua Expansão de Domínio (6/6). Use Pactuário do Espírito Umbral na Retaguarda com Alcance para disparar bônus a cada feitiço lançado enquanto invoca proteção na Vanguarda.",
      "lateGame": "Ative sua Expansão de Domínio (6/6) e domine o fim de jogo com Nyxaroth, General da Roda Fúnebre, Legião Dracônica do Eclipse, Arauto do Eclipse Prismático, Vesperion, Arquimago Lich Imortal. Se o rival ativar o Domínio dele — ou forçar uma Disputa de Domínios 50/50 —, invoque (ou ataque com) Nyxaroth, General da Roda Fúnebre para quebrar a Expansão inimiga, impor 2 rodadas de Exaustão de Domínio ao oponente, blindar seus aliados com Escudo Divino e reativar na hora o +1/+1 e o Acerto Garantido do seu próprio Domínio! Com Legião Dracônica do Eclipse, varra a Vanguarda rival com Sopro em área, gere duas fichas 2/2 imediatas e dispare seu efeito devastador ao atacar."
    },
    "signatureCombos": [
      {
        "title": "Sinergia Co-Evoluída (100% WR)",
        "cards": [
          "Paladino do Juramento Quebrado",
          "Cetro da Caveira Abissal"
        ],
        "howItWorks": "Paladino do Juramento Quebrado (4⚡) trava a Vanguarda enquanto Cetro da Caveira Abissal (4⚡) opera protegido com +1 ATQ de Cobertura (100.0% WR, +48.0% Lift)."
      },
      {
        "title": "Quebra de Domínio & Contra-Ofensiva (Nyxaroth)",
        "cards": [
          "Nyxaroth, General da Roda Fúnebre",
          "Legião Dracônica do Eclipse",
          "Pactuário do Espírito Umbral"
        ],
        "howItWorks": "Desça Nyxaroth, General da Roda Fúnebre para destruir a Expansão de Domínio rival (ou quebrar apenas o domínio inimigo numa Disputa 50/50, reativando seu Acerto Garantido!), impor 2 rodadas de Exaustão de Domínio ao oponente e proteger sua mesa com Escudo Divino enquanto Legião Dracônica do Eclipse, Pactuário do Espírito Umbral fecha o letal."
      }
    ],
    "strengths": [
      "Sustentação excepcional graças a Dreno de Vida e relíquias de cura.",
      "Toque Letal elimina qualquer titã inimigo independentemente da VIDA.",
      "Domina partidas longas graças à recursão da Cripta.",
      "Resposta Anti-Domínio nativa com Nyxaroth, General da Roda Fúnebre (quebra Expansões inimigas na entrada ou ataque e impõe 2 rodadas de Exaustão de Domínio)."
    ],
    "weaknesses": [
      "O acúmulo de Sobrecarga exige atenção para não atingir 10/10 (-2 PV de desgaste) se a partida fugir do controle.",
      "Congelamento atrasa os gatilhos de Dreno de Vida em combate."
    ],
    "keyCards": [
      "purple_13_zumbi",
      "purple_173_general_roda_abismo",
      "purple_172_armada_draconica_abismo",
      "purple_65_principe_mortos",
      "purple_46_noiva_vampira",
      "purple_155_lorde_vampiro_soberano",
      "purple_99_lorde_vampiro_anciao",
      "purple_22_orbe_necrotico"
    ]
  },
  "deck_green_wild": {
    "deckId": "deck_green_wild",
    "deckName": "Códice da Selva Primordial",
    "subtitle": "Mono-Verde 🌿 • Selva & Fera",
    "domains": [
      "green"
    ],
    "archetypeTag": "Avalanche de Feras & Coliseu Selvagem (80 Criaturas — 80%!)",
    "compositionSummary": {
      "creatures": 89,
      "spells": 3,
      "reactions": 0,
      "relics": 8,
      "ascensions": 1,
      "averageCost": 4.45
    },
    "playstyleOverview": "Força bruta em estado puro: 80 das 100 cartas são criaturas! Com 9 unidades de Ascensão, Regeneração natural e Atropelar em massa, este baralho sufoca o tabuleiro ocupando todas as 6 colunas e empilhando esquadrões ferozes.",
    "channelingStrategy": "Como 80% do deck são criaturas, canalize qualquer fera de custo médio redundante nos Turnos 1–4 para garantir uma curva de Essência perfeita até 7⚡ (Hidra, Rex Primordial e Chelonia). Jamais canalize Sylvarok, General da Roda Primeva nos turnos médios/finais: preserve seu General da Roda para quebrar a Expansão de Domínio inimiga (ou vencer instantaneamente uma Disputa de Domínios 50/50)!",
    "positioningAndStackingGuide": "Empilhe 2 a 3 feras por slot nas colunas onde o inimigo colocou bloqueadores fracos: com Atropelar e Chamado da Selva (+bônus em área), o dano excedente esmaga o Soberano rival diretamente!",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Emboscador Goblin da Mata, Lobo Atroz da Espinha Gelada, Flagelo Cornudo da Mata para disputar colunas cedo, absorver pressão e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine a transição de meio de jogo com Tecelão do Feixe Silvestre, Presságio da Revoada Espinhosa, Pactuário do Espírito Silvestre, consolidando colunas chave e acumulando Afinidade rumo à sua Expansão de Domínio (6/6). Use Pactuário do Espírito Silvestre na Retaguarda com Alcance para disparar bônus a cada feitiço lançado enquanto invoca proteção na Vanguarda.",
      "lateGame": "Ative sua Expansão de Domínio (6/6) e domine o fim de jogo com Sylvarok, General da Roda Primeva, Enxame Dracônico Ancestral, Arauto da Raiz Prismática, Vorágine, Hidra Voraz do Pântano. Se o rival ativar o Domínio dele — ou forçar uma Disputa de Domínios 50/50 —, invoque (ou ataque com) Sylvarok, General da Roda Primeva para quebrar a Expansão inimiga, impor 2 rodadas de Exaustão de Domínio ao oponente, blindar seus aliados com Escudo Divino e reativar na hora o +1/+1 e o Acerto Garantido do seu próprio Domínio! Com Enxame Dracônico Ancestral, varra a Vanguarda rival com Sopro em área, gere duas fichas 2/2 imediatas e dispare seu efeito devastador ao atacar."
    },
    "signatureCombos": [
      {
        "title": "Sinergia Co-Evoluída (77.8% WR)",
        "cards": [
          "Hidra-Rei de Sete Cabeças",
          "Xamã do Círculo dos Esporos"
        ],
        "howItWorks": "Multiplicador de falange: escalona atributos e sobrevivência combinando Xamã do Círculo dos Esporos + Hidra-Rei de Sete Cabeças na mesma janela de pressão (77.8% WR, +43.5% Lift)."
      },
      {
        "title": "Quebra de Domínio & Contra-Ofensiva (Sylvarok)",
        "cards": [
          "Sylvarok, General da Roda Primeva",
          "Enxame Dracônico Ancestral",
          "Pactuário do Espírito Silvestre"
        ],
        "howItWorks": "Desça Sylvarok, General da Roda Primeva para destruir a Expansão de Domínio rival (ou quebrar apenas o domínio inimigo numa Disputa 50/50, reativando seu Acerto Garantido!), impor 2 rodadas de Exaustão de Domínio ao oponente e proteger sua mesa com Escudo Divino enquanto Enxame Dracônico Ancestral, Pactuário do Espírito Silvestre fecha o letal."
      }
    ],
    "strengths": [
      "Maior densidade de ameaças por turno do jogo (64 criaturas).",
      "Atropelar impede que o inimigo sobreviva usando pequenos bloqueadores.",
      "Forte resistência contra queima leve graças à Regeneração.",
      "Resposta Anti-Domínio nativa com Sylvarok, General da Roda Primeva (quebra Expansões inimigas na entrada ou ataque e impõe 2 rodadas de Exaustão de Domínio)."
    ],
    "weaknesses": [
      "Poucas magias de remoção direta contra unidades na Retaguarda inimiga.",
      "Vulnerável a Congelamento em massa se não diversificar com unidades de Alcance."
    ],
    "keyCards": [
      "green_09_hidra",
      "green_173_general_roda_selva",
      "green_188_zahir_genio_tres_desejos",
      "green_179_brennus_marechal_manto_musgo",
      "green_183_sachiel_arcanjo_quatro_asas_seiva",
      "green_182_arauto_duas_asas_eden",
      "green_186_guardiao_runico_carvalho",
      "green_07_troll"
    ]
  },
  "deck_gold_bastion": {
    "deckId": "deck_gold_bastion",
    "deckName": "Escritura do Baluarte Solar",
    "subtitle": "Mono-Dourado ☀️ • Ordem & Ferro",
    "domains": [
      "gold"
    ],
    "archetypeTag": "Bastião de Relíquias & Falange Solar (55 Criaturas / 25 Relíquias)",
    "compositionSummary": {
      "creatures": 95,
      "spells": 1,
      "reactions": 0,
      "relics": 4,
      "ascensions": 22,
      "averageCost": 3.73
    },
    "playstyleOverview": "Cidadela impenetrável de 100 cartas que combina 55 soldados, paladinos e anjos blindados com 25 Relíquias Contínuas na Retaguarda, 12 Feitiços e 8 Reações.",
    "channelingStrategy": "Turnos 1–3: Canalize criaturas de custo 6–7 se precisar de Afinidade Dourada, mas preserve suas Relíquias de custo 2–3 (Escudo Solar, Martelo do Trovão), pois cada relíquia instalada gera valor cumulativo até o fim do jogo. Jamais canalize Heliokar, General da Roda Celeste nos turnos médios/finais: preserve seu General da Roda para quebrar a Expansão de Domínio inimiga (ou vencer instantaneamente uma Disputa de Domínios 50/50)!",
    "positioningAndStackingGuide": "Posicione Guardiões com Escudo Divino na Vanguarda para proteger suas 25 Relíquias Contínuas na Retaguarda.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Flagelo Cornudo da Alvorada para disputar colunas cedo, absorver pressão e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine a transição de meio de jogo com Tecelão do Feixe Solar, Presságio da Revoada Solar, Pactuário do Espírito Solar, consolidando colunas chave e acumulando Afinidade rumo à sua Expansão de Domínio (6/6). Use Pactuário do Espírito Solar na Retaguarda com Alcance para disparar bônus a cada feitiço lançado enquanto invoca proteção na Vanguarda.",
      "lateGame": "Ative sua Expansão de Domínio (6/6) e domine o fim de jogo com Heliokar, General da Roda Celeste, Armada Dracônica do Zênite, Arauto do Zênite Prismático, Aurarius, Majestade do Sol. Se o rival ativar o Domínio dele — ou forçar uma Disputa de Domínios 50/50 —, invoque (ou ataque com) Heliokar, General da Roda Celeste para quebrar a Expansão inimiga, impor 2 rodadas de Exaustão de Domínio ao oponente, blindar seus aliados com Escudo Divino e reativar na hora o +1/+1 e o Acerto Garantido do seu próprio Domínio! Com Armada Dracônica do Zênite, varra a Vanguarda rival com Sopro em área, gere duas fichas 2/2 imediatas e dispare seu efeito devastador ao atacar."
    },
    "signatureCombos": [
      {
        "title": "Sinergia Co-Evoluída (76% WR)",
        "cards": [
          "Hyperion, Deus-Imperador da Aurora",
          "Unicórnio do Bosque Sagrado"
        ],
        "howItWorks": "Multiplicador de falange: escalona atributos e sobrevivência combinando Unicórnio do Bosque Sagrado + Hyperion, Deus-Imperador da Aurora na mesma janela de pressão (76.0% WR, +39.8% Lift)."
      },
      {
        "title": "Quebra de Domínio & Contra-Ofensiva (Heliokar)",
        "cards": [
          "Heliokar, General da Roda Celeste",
          "Armada Dracônica do Zênite",
          "Pactuário do Espírito Solar"
        ],
        "howItWorks": "Desça Heliokar, General da Roda Celeste para destruir a Expansão de Domínio rival (ou quebrar apenas o domínio inimigo numa Disputa 50/50, reativando seu Acerto Garantido!), impor 2 rodadas de Exaustão de Domínio ao oponente e proteger sua mesa com Escudo Divino enquanto Armada Dracônica do Zênite, Pactuário do Espírito Solar fecha o letal."
      }
    ],
    "strengths": [
      "A defesa mais difícil de penetrar em todo o jogo (Armadura + Escudo Divino + Cura).",
      "Efeito bola de neve imbatível se as Relíquias da Retaguarda não forem destruídas.",
      "Excelente contra baralhos agressivos (Vermelho e Verde).",
      "Resposta Anti-Domínio nativa com Heliokar, General da Roda Celeste (quebra Expansões inimigas na entrada ou ataque e impõe 2 rodadas de Exaustão de Domínio)."
    ],
    "weaknesses": [
      "Construção mais lenta nos primeiros turnos enquanto instala Relíquias.",
      "Vulnerável a Toque Letal se o Escudo Divino já tiver sido consumido."
    ],
    "keyCards": [
      "gold_07_dragao_ouro",
      "gold_173_general_roda_sol",
      "gold_172_armada_draconica_sol",
      "gold_06_deva",
      "gold_23_dragao_prata",
      "gold_136_dragao_platina_celeste",
      "gold_99_serafim_coroado",
      "gold_117_arcanjo_egide"
    ]
  },
  "deck_dual_draconic_pact": {
    "deckId": "deck_dual_draconic_pact",
    "deckName": "Grimório das Escamas Imperiais",
    "subtitle": "Pacto Duplo 🔥+☀️ • Chama & Ordem",
    "domains": [
      "red",
      "gold"
    ],
    "archetypeTag": "Aliança Dracônica Imperial (60 Criaturas / 15 Relíquias)",
    "compositionSummary": {
      "creatures": 95,
      "spells": 1,
      "reactions": 0,
      "relics": 4,
      "ascensions": 23,
      "averageCost": 3.86
    },
    "playstyleOverview": "Une a fúria piromântica dos dragões vermelhos à blindagem sagrada dos dragões e 15 Relíquias douradas em um grimório de 100 cartas (60 Criaturas, 18 Feitiços, 7 Reações e 15 Relíquias).",
    "channelingStrategy": "Priorize atingir 2 de Afinidade Vermelha e 2 de Afinidade Dourada até o Turno 4, canalizando cartas de custo 5 duplicadas. Jamais canalize Heliokar, General da Roda Celeste nos turnos médios/finais: preserve seu General da Roda para quebrar a Expansão de Domínio inimiga (ou vencer instantaneamente uma Disputa de Domínios 50/50)!",
    "positioningAndStackingGuide": "Mantenha Guardiões Dourados na frente (posição 0 da pilha) e coloque Artilheiros/Meio-Dragões como 2ª unidade do mesmo slot para somar fogo concentrado sem expor os atacantes.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Víbora de Brasa Jovem, Escudeiro da Alvorada, Flagelo Cornudo da Alvorada para disputar colunas cedo, absorver pressão e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine a transição de meio de jogo com Tecelão do Feixe Solar, Presságio da Revoada Cinzenta, consolidando colunas chave e acumulando Afinidade rumo à sua Expansão de Domínio (6/6).",
      "lateGame": "Ative sua Expansão de Domínio (6/6) e domine o fim de jogo com Heliokar, General da Roda Celeste, Hoste Dracônica da Cratera, Valkyra, Imperatriz Pentacromática. Se o rival ativar o Domínio dele — ou forçar uma Disputa de Domínios 50/50 —, invoque (ou ataque com) Heliokar, General da Roda Celeste para quebrar a Expansão inimiga, impor 2 rodadas de Exaustão de Domínio ao oponente, blindar seus aliados com Escudo Divino e reativar na hora o +1/+1 e o Acerto Garantido do seu próprio Domínio! Com Hoste Dracônica da Cratera, varra a Vanguarda rival com Sopro em área, gere duas fichas 2/2 imediatas e dispare seu efeito devastador ao atacar."
    },
    "signatureCombos": [
      {
        "title": "Sinergia Co-Evoluída (91% WR)",
        "cards": [
          "Reen, Ceifador de Engrenagens",
          "Diabrete de Magma"
        ],
        "howItWorks": "Abertura de corredor tático: Diabrete de Magma neutraliza bloqueadores para a infiltração letal de Reen, Ceifador de Engrenagens (91.0% WR, +34.1% Lift)."
      },
      {
        "title": "Quebra de Domínio & Contra-Ofensiva (Heliokar)",
        "cards": [
          "Heliokar, General da Roda Celeste",
          "Hoste Dracônica da Cratera"
        ],
        "howItWorks": "Desça Heliokar, General da Roda Celeste para destruir a Expansão de Domínio rival (ou quebrar apenas o domínio inimigo numa Disputa 50/50, reativando seu Acerto Garantido!), impor 2 rodadas de Exaustão de Domínio ao oponente e proteger sua mesa com Escudo Divino enquanto Hoste Dracônica da Cratera fecha o letal."
      }
    ],
    "strengths": [
      "Superioridade aérea com múltiplos Dragões Lendários.",
      "Equilíbrio sólido entre ataque explosivo e defesa blindada.",
      "Resposta Anti-Domínio nativa com Heliokar, General da Roda Celeste (quebra Expansões inimigas na entrada ou ataque e impõe 2 rodadas de Exaustão de Domínio)."
    ],
    "weaknesses": [
      "Curva de custo médio elevada (3.55⚡), exigindo canalização disciplinada nos primeiros turnos."
    ],
    "keyCards": [
      "gold_37_escudeiro_solar",
      "red_173_general_roda_chama",
      "gold_188_sulaiman_genio_tres_editos",
      "gold_180_valerius_comandante_aguia_imperial",
      "red_195_clamor_forja_guerra",
      "gold_179_leoric_grao_marechal_leao_solar",
      "gold_177_lanca_cantora_coro_solar",
      "red_46_tirano_carmesim"
    ]
  },
  "deck_dual_abyssal_storm": {
    "deckId": "deck_dual_abyssal_storm",
    "deckName": "Tomo da Tormenta Abissal",
    "subtitle": "Pacto Duplo ❄️+💀 • Tempestade & Abismo",
    "domains": [
      "blue",
      "purple"
    ],
    "archetypeTag": "Controle Psíquico & Maldições (50 Criaturas / 38 Magias)",
    "compositionSummary": {
      "creatures": 67,
      "spells": 15,
      "reactions": 8,
      "relics": 10,
      "ascensions": 9,
      "averageCost": 3.61
    },
    "playstyleOverview": "Combina o Congelamento e compra de cartas do Azul com a reanimação e Dreno de Vida do Roxo (50 Criaturas, 28 Feitiços, 10 Reações e 12 Relíquias). O oponente fica preso em uma teia de paralisia e perda contínua de vida.",
    "channelingStrategy": "Garanta 2 Azul e 2 Roxo cedo; canalize criaturas que você pretende reanimar mais tarde ou feitiços situacionais. Jamais canalize Cryonax, General da Roda Astral nos turnos médios/finais: preserve seu General da Roda para quebrar a Expansão de Domínio inimiga (ou vencer instantaneamente uma Disputa de Domínios 50/50)!",
    "positioningAndStackingGuide": "Use Aparições e Carniçais Reais com Renascer na Vanguarda para absorver pressão enquanto acumula Magos da Ilusão, Serafim dos Anéis Abissais e Lanterna das Almas na Retaguarda.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Tritão Guardião dos Recifes, Legionário Ossudo, Flagelo Cornudo da Geada para disputar colunas cedo, absorver pressão e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine a transição de meio de jogo com Tecelão do Feixe Umbral, Pactuário do Espírito Glacial, Arauto do Eclipse Prismático, consolidando colunas chave e acumulando Afinidade rumo à sua Expansão de Domínio (6/6). Use Pactuário do Espírito Glacial na Retaguarda com Alcance para disparar bônus a cada feitiço lançado enquanto invoca proteção na Vanguarda.",
      "lateGame": "Ative sua Expansão de Domínio (6/6) e domine o fim de jogo com Cryonax, General da Roda Astral, Arauto do Eclipse Prismático, Serafim dos Anéis Abissais. Se o rival ativar o Domínio dele — ou forçar uma Disputa de Domínios 50/50 —, invoque (ou ataque com) Cryonax, General da Roda Astral para quebrar a Expansão inimiga, impor 2 rodadas de Exaustão de Domínio ao oponente, blindar seus aliados com Escudo Divino e reativar na hora o +1/+1 e o Acerto Garantido do seu próprio Domínio!"
    },
    "signatureCombos": [
      {
        "title": "Sinergia Co-Evoluída (93% WR)",
        "cards": [
          "Cryonax, General da Roda Astral",
          "Aracnomante das Cavernas"
        ],
        "howItWorks": "Aracnomante das Cavernas (4⚡) trava a Vanguarda enquanto Cryonax, General da Roda Astral (7⚡) opera protegido com +1 ATQ de Cobertura (93.0% WR, +36.3% Lift)."
      },
      {
        "title": "Quebra de Domínio & Contra-Ofensiva (Cryonax)",
        "cards": [
          "Cryonax, General da Roda Astral",
          "Pactuário do Espírito Glacial",
          "Arauto do Eclipse Prismático"
        ],
        "howItWorks": "Desça Cryonax, General da Roda Astral para destruir a Expansão de Domínio rival (ou quebrar apenas o domínio inimigo numa Disputa 50/50, reativando seu Acerto Garantido!), impor 2 rodadas de Exaustão de Domínio ao oponente e proteger sua mesa com Escudo Divino enquanto Pactuário do Espírito Glacial, Arauto do Eclipse Prismático fecha o letal."
      }
    ],
    "strengths": [
      "Controle absoluto de ritmo e recursos.",
      "Excelente contra baralhos de criaturas pesadas.",
      "Resposta Anti-Domínio nativa com Cryonax, General da Roda Astral (quebra Expansões inimigas na entrada ou ataque e impõe 2 rodadas de Exaustão de Domínio)."
    ],
    "weaknesses": [
      "Exige paciência tática para fechar o jogo."
    ],
    "keyCards": [
      "blue_40_naga_guardia",
      "blue_173_general_roda_gelo",
      "blue_180_leona_marechal_leao_branco_inverno",
      "purple_172_armada_draconica_abismo",
      "purple_196_guilhotina_sol_negro",
      "blue_182_arauto_duas_asas_geada",
      "blue_186_gigante_clava_glacial",
      "blue_187_colosso_gelo_ferro"
    ]
  },
  "deck_dual_primal_fury": {
    "deckId": "deck_dual_primal_fury",
    "deckName": "Códice da Ruína Selvagem",
    "subtitle": "Pacto Duplo 🔥+🌿 • Chama & Selva",
    "domains": [
      "red",
      "green"
    ],
    "archetypeTag": "Blitz Selvagem & Queima (68 Criaturas / 20 Feitiços)",
    "compositionSummary": {
      "creatures": 89,
      "spells": 5,
      "reactions": 0,
      "relics": 6,
      "ascensions": 6,
      "averageCost": 4.13
    },
    "playstyleOverview": "Grimório de investida veloz (100 cartas) que une 68 feras com Ímpeto e Atropelar do Verde aos 20 feitiços de queima, 5 Reações e 7 Relíquias do Vermelho.",
    "channelingStrategy": "Canalize nos Turnos 1–4 para chegar a 5–6⚡ rapidamente; depois do Turno 5, jogue todas as cartas da mão para manter pressão máxima. Jamais canalize Pyrrakon, General da Roda Vulcânica e Sylvarok, General da Roda Primeva nos turnos médios/finais: preserve seu General da Roda para quebrar a Expansão de Domínio inimiga (ou vencer instantaneamente uma Disputa de Domínios 50/50)!",
    "positioningAndStackingGuide": "Ocupar todas as 6 colunas da Vanguarda é prioridade máxima para garantir ataques de Invasão de Coluna (+1⚔️ ATQ) nos slots onde você destruir o defensor com Flecha Explosiva.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Batedor Escamado das Brasas, Diabrete de Escória Vulcânica, Flagelo Cornudo da Fornalha, Flagelo Cornudo da Mata para disputar colunas cedo, absorver pressão e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine a transição de meio de jogo com Tecelão do Feixe Silvestre, Tecelão do Feixe Ígneo, Arauto da Raiz Prismática, consolidando colunas chave e acumulando Afinidade rumo à sua Expansão de Domínio (6/6).",
      "lateGame": "Ative sua Expansão de Domínio (6/6) e domine o fim de jogo com Pyrrakon, General da Roda Vulcânica, Sylvarok, General da Roda Primeva, Enxame Dracônico Ancestral, Arauto da Raiz Prismática. Se o rival ativar o Domínio dele — ou forçar uma Disputa de Domínios 50/50 —, invoque (ou ataque com) Pyrrakon, General da Roda Vulcânica e Sylvarok, General da Roda Primeva para quebrar a Expansão inimiga, impor 2 rodadas de Exaustão de Domínio ao oponente, blindar seus aliados com Escudo Divino e reativar na hora o +1/+1 e o Acerto Garantido do seu próprio Domínio! Com Enxame Dracônico Ancestral, varra a Vanguarda rival com Sopro em área, gere duas fichas 2/2 imediatas e dispare seu efeito devastador ao atacar."
    },
    "signatureCombos": [
      {
        "title": "Sinergia Co-Evoluída (100% WR)",
        "cards": [
          "Troll Regenerador do Pântano",
          "Pyrrakon, General da Roda Vulcânica"
        ],
        "howItWorks": "Abertura de corredor tático: Troll Regenerador do Pântano neutraliza bloqueadores para a infiltração letal de Pyrrakon, General da Roda Vulcânica (100.0% WR, +47.4% Lift)."
      },
      {
        "title": "Quebra de Domínio & Contra-Ofensiva (Pyrrakon)",
        "cards": [
          "Pyrrakon, General da Roda Vulcânica",
          "Sylvarok, General da Roda Primeva",
          "Enxame Dracônico Ancestral"
        ],
        "howItWorks": "Desça Pyrrakon, General da Roda Vulcânica para destruir a Expansão de Domínio rival (ou quebrar apenas o domínio inimigo numa Disputa 50/50, reativando seu Acerto Garantido!), impor 2 rodadas de Exaustão de Domínio ao oponente e proteger sua mesa com Escudo Divino enquanto Sylvarok, General da Roda Primeva, Enxame Dracônico Ancestral fecha o letal."
      }
    ],
    "strengths": [
      "Pressão sufocante desde o primeiro turno.",
      "Quebra defesas passivas antes que instalem relíquias.",
      "Resposta Anti-Domínio nativa com Pyrrakon, General da Roda Vulcânica e Sylvarok, General da Roda Primeva (quebra Expansões inimigas na entrada ou ataque e impõe 2 rodadas de Exaustão de Domínio)."
    ],
    "weaknesses": [
      "Pode ficar sem cartas na mão se a partida passar do Turno 14."
    ],
    "keyCards": [
      "neutral_52_mercenario_planar",
      "red_173_general_roda_chama",
      "green_188_zahir_genio_tres_desejos",
      "green_179_brennus_marechal_manto_musgo",
      "green_182_arauto_duas_asas_eden",
      "green_183_sachiel_arcanjo_quatro_asas_seiva",
      "green_186_guardiao_runico_carvalho",
      "red_157_dragao_tiamat_carmesim"
    ]
  },
  "deck_dual_arcane_forge": {
    "deckId": "deck_dual_arcane_forge",
    "deckName": "Grimório da Forja do Zênite",
    "subtitle": "Pacto Duplo ❄️+☀️ • Tempestade & Ordem",
    "domains": [
      "blue",
      "gold"
    ],
    "archetypeTag": "Bastilha de Artefatos (30 Relíquias Contínuas!)",
    "compositionSummary": {
      "creatures": 79,
      "spells": 6,
      "reactions": 3,
      "relics": 12,
      "ascensions": 16,
      "averageCost": 3.65
    },
    "playstyleOverview": "Com 30 Relíquias Contínuas, 42 Criaturas e 28 Magias/Reações, a Forja Arcana transforma a Retaguarda em uma linha de montagem de escudos, compra de cartas e fortalecimento mecânico.",
    "channelingStrategy": "Nunca canalize suas Relíquias de geração de recursos (Bolsa de Conjurar, Relógio de Bolso Real); canalize feitiços duplicados. Jamais canalize Heliokar, General da Roda Celeste nos turnos médios/finais: preserve seu General da Roda para quebrar a Expansão de Domínio inimiga (ou vencer instantaneamente uma Disputa de Domínios 50/50)!",
    "positioningAndStackingGuide": "Preencha a Retaguarda com 4 a 5 Relíquias e empilhe Autômatos e Guardiões com Escudo Divino em 3 unidades por slot na Vanguarda para proteger suas máquinas.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Coruja Astral de Vigília, Mastim Couraçado da Cidadela, Flagelo Cornudo Primordial para disputar colunas cedo, absorver pressão e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine a transição de meio de jogo com Tecelão do Feixe Primordial, Pactuário do Espírito Solar, Matriz do Prisma Primordial, consolidando colunas chave e acumulando Afinidade rumo à sua Expansão de Domínio (6/6). Use Pactuário do Espírito Solar na Retaguarda com Alcance para disparar bônus a cada feitiço lançado enquanto invoca proteção na Vanguarda.",
      "lateGame": "Ative sua Expansão de Domínio (6/6) e domine o fim de jogo com Heliokar, General da Roda Celeste, Armada Dracônica do Zênite, Matriz do Prisma Primordial, Trono Celestial do Zênite. Se o rival ativar o Domínio dele — ou forçar uma Disputa de Domínios 50/50 —, invoque (ou ataque com) Heliokar, General da Roda Celeste para quebrar a Expansão inimiga, impor 2 rodadas de Exaustão de Domínio ao oponente, blindar seus aliados com Escudo Divino e reativar na hora o +1/+1 e o Acerto Garantido do seu próprio Domínio! Com Armada Dracônica do Zênite, varra a Vanguarda rival com Sopro em área, gere duas fichas 2/2 imediatas e dispare seu efeito devastador ao atacar."
    },
    "signatureCombos": [
      {
        "title": "Sinergia Co-Evoluída (100% WR)",
        "cards": [
          "Cálice Real da Alvorada",
          "Cronômetro Dourado de Bolso"
        ],
        "howItWorks": "Multiplicador de falange: escalona atributos e sobrevivência combinando Cálice Real da Alvorada + Cronômetro Dourado de Bolso na mesma janela de pressão (100.0% WR, +42.7% Lift)."
      },
      {
        "title": "Quebra de Domínio & Contra-Ofensiva (Heliokar)",
        "cards": [
          "Heliokar, General da Roda Celeste",
          "Armada Dracônica do Zênite",
          "Pactuário do Espírito Solar"
        ],
        "howItWorks": "Desça Heliokar, General da Roda Celeste para destruir a Expansão de Domínio rival (ou quebrar apenas o domínio inimigo numa Disputa 50/50, reativando seu Acerto Garantido!), impor 2 rodadas de Exaustão de Domínio ao oponente e proteger sua mesa com Escudo Divino enquanto Armada Dracônica do Zênite, Pactuário do Espírito Solar fecha o letal."
      }
    ],
    "strengths": [
      "Economia de cartas e buffs contínuos insuperável.",
      "Altíssima taxa de vitória contra baralhos de atrito.",
      "Resposta Anti-Domínio nativa com Heliokar, General da Roda Celeste (quebra Expansões inimigas na entrada ou ataque e impõe 2 rodadas de Exaustão de Domínio)."
    ],
    "weaknesses": [
      "Espaço limitado na Retaguarda devido às 12 Relíquias."
    ],
    "keyCards": [
      "neutral_87_armadura_animada_vigia",
      "blue_173_general_roda_gelo",
      "gold_188_sulaiman_genio_tres_editos",
      "blue_180_leona_marechal_leao_branco_inverno",
      "gold_180_valerius_comandante_aguia_imperial",
      "blue_182_arauto_duas_asas_geada",
      "blue_153_leviata_fenda_abissal",
      "blue_62_principe_ar"
    ]
  },
  "deck_dual_eternal_rot": {
    "deckId": "deck_dual_eternal_rot",
    "deckName": "Tomo da Podridão Eterna",
    "subtitle": "Pacto Duplo 💀+🌿 • Abismo & Selva",
    "domains": [
      "purple",
      "green"
    ],
    "archetypeTag": "Enxame Venenoso & Reanimação (70 Criaturas / Toque Letal)",
    "compositionSummary": {
      "creatures": 90,
      "spells": 9,
      "reactions": 0,
      "relics": 1,
      "ascensions": 8,
      "averageCost": 3.91
    },
    "playstyleOverview": "Potência de atrito (100 cartas) que combina a massa de 70 criaturas do Verde e Roxo com Toque Letal, Renascer, 20 Magias/Reações e 10 Relíquias.",
    "channelingStrategy": "Canalize titãs de custo 6–7 se vierem cedo demais; você pode tanto invocá-los mais tarde quanto reanimá-los. Jamais canalize Nyxaroth, General da Roda Fúnebre nos turnos médios/finais: preserve seu General da Roda para quebrar a Expansão de Domínio inimiga (ou vencer instantaneamente uma Disputa de Domínios 50/50)!",
    "positioningAndStackingGuide": "Coloque uma unidade de Toque Letal ou Renascer na frente de cada pilha e empilhe feras de alto ATQ atrás dela no mesmo slot.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Legionário Ossudo, Garra Decepada Animada, Flagelo Cornudo do Abismo para disputar colunas cedo, absorver pressão e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine a transição de meio de jogo com Presságio da Revoada Umbral, Presságio da Revoada Espinhosa, consolidando colunas chave e acumulando Afinidade rumo à sua Expansão de Domínio (6/6).",
      "lateGame": "Ative sua Expansão de Domínio (6/6) e domine o fim de jogo com Nyxaroth, General da Roda Fúnebre, Legião Dracônica do Eclipse, Gorgoroth, Behemoth Devorador de Montanhas. Se o rival ativar o Domínio dele — ou forçar uma Disputa de Domínios 50/50 —, invoque (ou ataque com) Nyxaroth, General da Roda Fúnebre para quebrar a Expansão inimiga, impor 2 rodadas de Exaustão de Domínio ao oponente, blindar seus aliados com Escudo Divino e reativar na hora o +1/+1 e o Acerto Garantido do seu próprio Domínio! Com Legião Dracônica do Eclipse, varra a Vanguarda rival com Sopro em área, gere duas fichas 2/2 imediatas e dispare seu efeito devastador ao atacar."
    },
    "signatureCombos": [
      {
        "title": "Sinergia Co-Evoluída (100% WR)",
        "cards": [
          "Carvalho-Mestre de Mil Invernos",
          "Guilhotina do Sol Negro"
        ],
        "howItWorks": "Carvalho-Mestre de Mil Invernos (5⚡) trava a Vanguarda enquanto Guilhotina do Sol Negro (5⚡) opera protegido com +1 ATQ de Cobertura (100.0% WR, +45.8% Lift)."
      },
      {
        "title": "Quebra de Domínio & Contra-Ofensiva (Nyxaroth)",
        "cards": [
          "Nyxaroth, General da Roda Fúnebre",
          "Legião Dracônica do Eclipse"
        ],
        "howItWorks": "Desça Nyxaroth, General da Roda Fúnebre para destruir a Expansão de Domínio rival (ou quebrar apenas o domínio inimigo numa Disputa 50/50, reativando seu Acerto Garantido!), impor 2 rodadas de Exaustão de Domínio ao oponente e proteger sua mesa com Escudo Divino enquanto Legião Dracônica do Eclipse fecha o letal."
      }
    ],
    "strengths": [
      "Domina o combate entre criaturas graças a Toque Letal + Renascer.",
      "Infinita reposição de unidades.",
      "Resposta Anti-Domínio nativa com Nyxaroth, General da Roda Fúnebre (quebra Expansões inimigas na entrada ou ataque e impõe 2 rodadas de Exaustão de Domínio)."
    ],
    "weaknesses": [
      "Pouca presença de Voo para interceptar dragões na Retaguarda."
    ],
    "keyCards": [
      "green_33_behemoth_primordial",
      "purple_173_general_roda_abismo",
      "purple_188_azhar_genio_tres_pactos",
      "purple_180_corvina_marechal_bico_praga",
      "purple_196_guilhotina_sol_negro",
      "purple_177_inquisidor_obsidiana_astral",
      "purple_194_costura_sombras_gemeas",
      "purple_155_lorde_vampiro_soberano"
    ]
  },
  "deck_dual_blood_flame": {
    "deckId": "deck_dual_blood_flame",
    "deckName": "Aliança de Brasa & Umbra",
    "subtitle": "Pacto Duplo 🔥+💀 • Chama & Abismo",
    "domains": [
      "red",
      "purple"
    ],
    "archetypeTag": "Sobrecarga & Queima (52 Criaturas / 35 Magias)",
    "compositionSummary": {
      "creatures": 91,
      "spells": 1,
      "reactions": 0,
      "relics": 8,
      "ascensions": 21,
      "averageCost": 2.76
    },
    "playstyleOverview": "Agressão sombria de 100 cartas (52 Criaturas, 25 Feitiços, 10 Reações e 13 Relíquias) que utiliza Sobrecarga (5+) como amplificador para feitiços devastadores, Fênix velozes e Lordes Abissais.",
    "channelingStrategy": "Atinja 2 Vermelho e 2 Roxo até o Turno 4; guarde Dreno Vital e Colheita das Sombras para compensar a vida convertida em Sacrifício Vital. Jamais canalize Pyrrakon, General da Roda Vulcânica e Nyxaroth, General da Roda Fúnebre nos turnos médios/finais: preserve seu General da Roda para quebrar a Expansão de Domínio inimiga (ou vencer instantaneamente uma Disputa de Domínios 50/50)!",
    "positioningAndStackingGuide": "Espalhe atacantes agressivos na Vanguarda e mantenha a Lanterna das Almas e o Caldeirão de Magma protegidos na Retaguarda.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Acólito do Sol Negro, Víbora de Brasa Jovem, Batedor Escamado das Brasas para disputar colunas e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine a transição de meio de jogo com Tecelão do Feixe Umbral, Pactuário do Espírito Magmático, Pactuário do Espírito Umbral, consolidando colunas chave e acumulando Afinidade rumo à sua Expansão de Domínio (6/6). Use Pactuário do Espírito Magmático na Retaguarda com Alcance para disparar bônus a cada feitiço lançado enquanto invoca proteção na Vanguarda.",
      "lateGame": "Ative sua Expansão de Domínio (6/6) e domine o fim de jogo com Pyrrakon, General da Roda Vulcânica, Nyxaroth, General da Roda Fúnebre, Hoste Dracônica da Cratera, Arauto da Supernova Prismática. Se o rival ativar o Domínio dele — ou forçar uma Disputa de Domínios 50/50 —, invoque (ou ataque com) Pyrrakon, General da Roda Vulcânica e Nyxaroth, General da Roda Fúnebre para quebrar a Expansão inimiga, impor 2 rodadas de Exaustão de Domínio ao oponente, blindar seus aliados com Escudo Divino e reativar na hora o +1/+1 e o Acerto Garantido do seu próprio Domínio! Com Hoste Dracônica da Cratera, varra a Vanguarda rival com Sopro em área, gere duas fichas 2/2 imediatas e dispare seu efeito devastador ao atacar."
    },
    "signatureCombos": [
      {
        "title": "Sinergia Co-Evoluída (100% WR)",
        "cards": [
          "Xamã das Máscaras Vazias",
          "Bigorna do Rei da Fornalha"
        ],
        "howItWorks": "Multiplicador de falange: escalona atributos e sobrevivência combinando Xamã das Máscaras Vazias + Bigorna do Rei da Fornalha na mesma janela de pressão (100.0% WR, +39.9% Lift)."
      },
      {
        "title": "Quebra de Domínio & Contra-Ofensiva (Pyrrakon)",
        "cards": [
          "Pyrrakon, General da Roda Vulcânica",
          "Nyxaroth, General da Roda Fúnebre",
          "Hoste Dracônica da Cratera"
        ],
        "howItWorks": "Desça Pyrrakon, General da Roda Vulcânica para destruir a Expansão de Domínio rival (ou quebrar apenas o domínio inimigo numa Disputa 50/50, reativando seu Acerto Garantido!), impor 2 rodadas de Exaustão de Domínio ao oponente e proteger sua mesa com Escudo Divino enquanto Nyxaroth, General da Roda Fúnebre, Hoste Dracônica da Cratera fecha o letal."
      }
    ],
    "strengths": [
      "Grande poder explosivo de dano direto e remoção.",
      "Resposta Anti-Domínio nativa com Pyrrakon, General da Roda Vulcânica e Nyxaroth, General da Roda Fúnebre (quebra Expansões inimigas na entrada ou ataque e impõe 2 rodadas de Exaustão de Domínio)."
    ],
    "weaknesses": [
      "Exige equilíbrio entre agressão e gerenciamento de VIDA/Sobrecarga."
    ],
    "keyCards": [
      "neutral_81_operario_relojoeiro",
      "red_173_general_roda_chama",
      "red_172_armada_draconica_chama",
      "red_195_clamor_forja_guerra",
      "purple_187_aparicao_chama_negra",
      "purple_185_xama_mascaras_vazias",
      "red_185_espectro_mortalha_cinzas",
      "red_176_dancarino_plumas_brasa"
    ]
  },
  "deck_dual_wild_evolution": {
    "deckId": "deck_dual_wild_evolution",
    "deckName": "Códice da Evolução Quimérica",
    "subtitle": "Pacto Duplo ❄️+🌿 • Tempestade & Selva",
    "domains": [
      "blue",
      "green"
    ],
    "archetypeTag": "Mestre da Ascensão (60 Criaturas — Evolução Suprema!)",
    "compositionSummary": {
      "creatures": 66,
      "spells": 21,
      "reactions": 3,
      "relics": 10,
      "ascensions": 14,
      "averageCost": 3.81
    },
    "playstyleOverview": "Recordista em evolução: possui 60 criaturas apoiadas por 20 Feitiços, 8 Reações e 12 Relíquias! Usa a geração de Essência extra da Selva e da Tempestade para transformar recrutas em Semideuses.",
    "channelingStrategy": "Sempre canalize nos primeiros 5 turnos! A Essência máxima elevada permite invocar e Ascender no mesmo turno. Jamais canalize Vaelkor, General da Roda Prismática nos turnos médios/finais: preserve seu General da Roda para quebrar a Expansão de Domínio inimiga (ou vencer instantaneamente uma Disputa de Domínios 50/50)!",
    "positioningAndStackingGuide": "Proteja suas unidades de Ascensão atrás de um Guardião no mesmo slot até ter Essência para despertá-las.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Sentinela das Correntes Aéreas, Tritão Guardião dos Recifes, Flagelo Cornudo Primordial para disputar colunas cedo, absorver pressão e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine a transição de meio de jogo com Presságio da Revoada Glacial, Pactuário do Espírito Silvestre, consolidando colunas chave e acumulando Afinidade rumo à sua Expansão de Domínio (6/6). Use Pactuário do Espírito Silvestre na Retaguarda com Alcance para disparar bônus a cada feitiço lançado enquanto invoca proteção na Vanguarda.",
      "lateGame": "Ative sua Expansão de Domínio (6/6) e domine o fim de jogo com Vaelkor, General da Roda Prismática, Armada Dracônica do Prisma, Arquidruida do Círculo Antigo. Se o rival ativar o Domínio dele — ou forçar uma Disputa de Domínios 50/50 —, invoque (ou ataque com) Vaelkor, General da Roda Prismática para quebrar a Expansão inimiga, impor 2 rodadas de Exaustão de Domínio ao oponente, blindar seus aliados com Escudo Divino e reativar na hora o +1/+1 e o Acerto Garantido do seu próprio Domínio! Com Armada Dracônica do Prisma, varra a Vanguarda rival com Sopro em área, gere duas fichas 2/2 imediatas e dispare seu efeito devastador ao atacar."
    },
    "signatureCombos": [
      {
        "title": "Sinergia Co-Evoluída (100% WR)",
        "cards": [
          "Chamado da Matilha Alfa",
          "Marcha dos Colossos"
        ],
        "howItWorks": "Multiplicador de falange: escalona atributos e sobrevivência combinando Chamado da Matilha Alfa + Marcha dos Colossos na mesma janela de pressão (100.0% WR, +44.8% Lift)."
      },
      {
        "title": "Quebra de Domínio & Contra-Ofensiva (Vaelkor)",
        "cards": [
          "Vaelkor, General da Roda Prismática",
          "Armada Dracônica do Prisma",
          "Pactuário do Espírito Silvestre"
        ],
        "howItWorks": "Desça Vaelkor, General da Roda Prismática para destruir a Expansão de Domínio rival (ou quebrar apenas o domínio inimigo numa Disputa 50/50, reativando seu Acerto Garantido!), impor 2 rodadas de Exaustão de Domínio ao oponente e proteger sua mesa com Escudo Divino enquanto Armada Dracônica do Prisma, Pactuário do Espírito Silvestre fecha o letal."
      }
    ],
    "strengths": [
      "Maior teto de poder de criaturas no meio/fim de jogo.",
      "Flexibilidade entre controle e agressão.",
      "Resposta Anti-Domínio nativa com Vaelkor, General da Roda Prismática (quebra Expansões inimigas na entrada ou ataque e impõe 2 rodadas de Exaustão de Domínio)."
    ],
    "weaknesses": [
      "Perder uma criatura antes de Ascendê-la reduz o ritmo se não houver backup."
    ],
    "keyCards": [
      "neutral_80_dragonete_emboscada",
      "blue_173_general_roda_gelo",
      "green_188_zahir_genio_tres_desejos",
      "blue_181_selene_estrategista_egide_lunar",
      "blue_198_decreto_decima_segunda_hora",
      "green_179_brennus_marechal_manto_musgo",
      "green_182_arauto_duas_asas_eden",
      "green_186_guardiao_runico_carvalho"
    ]
  },
  "deck_dual_solar_wild": {
    "deckId": "deck_dual_solar_wild",
    "deckName": "Escritura da Aurora Silvestre",
    "subtitle": "Pacto Duplo 🌿+☀️ • Selva & Ordem",
    "domains": [
      "green",
      "gold"
    ],
    "archetypeTag": "Falange Regenerativa (65 Criaturas / 18 Relíquias)",
    "compositionSummary": {
      "creatures": 84,
      "spells": 3,
      "reactions": 2,
      "relics": 11,
      "ascensions": 6,
      "averageCost": 3.75
    },
    "playstyleOverview": "Une a Regeneração e 65 feras colossais do Verde aos Escudos Divinos, 17 Magias/Reações e 18 Relíquias do Dourado. Suas unidades simplesmente se recusam a morrer.",
    "channelingStrategy": "Canalize cartas de custo 6–7 duplicadas nos primeiros turnos para estabilizar 2 Verde e 2 Dourado. Jamais canalize Heliokar, General da Roda Celeste e Sylvarok, General da Roda Primeva nos turnos médios/finais: preserve seu General da Roda para quebrar a Expansão de Domínio inimiga (ou vencer instantaneamente uma Disputa de Domínios 50/50)!",
    "positioningAndStackingGuide": "Empilhe 3 unidades por slot combinando Guardiões Dourados na frente e feras regenerativas/arqueiros atrás.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Escudeiro da Alvorada, Texugo Escavador Furioso, Flagelo Cornudo da Alvorada para disputar colunas cedo, absorver pressão e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine a transição de meio de jogo com Tecelão do Feixe Silvestre, Presságio da Revoada Solar, Arauto do Zênite Prismático, consolidando colunas chave e acumulando Afinidade rumo à sua Expansão de Domínio (6/6).",
      "lateGame": "Ative sua Expansão de Domínio (6/6) e domine o fim de jogo com Heliokar, General da Roda Celeste, Sylvarok, General da Roda Primeva, Armada Dracônica do Zênite, Arauto do Zênite Prismático. Se o rival ativar o Domínio dele — ou forçar uma Disputa de Domínios 50/50 —, invoque (ou ataque com) Heliokar, General da Roda Celeste e Sylvarok, General da Roda Primeva para quebrar a Expansão inimiga, impor 2 rodadas de Exaustão de Domínio ao oponente, blindar seus aliados com Escudo Divino e reativar na hora o +1/+1 e o Acerto Garantido do seu próprio Domínio! Com Armada Dracônica do Zênite, varra a Vanguarda rival com Sopro em área, gere duas fichas 2/2 imediatas e dispare seu efeito devastador ao atacar."
    },
    "signatureCombos": [
      {
        "title": "Sinergia Co-Evoluída (85.3% WR)",
        "cards": [
          "Sentinela de Elmo Arcano",
          "Égide do Planetário"
        ],
        "howItWorks": "Multiplicador de falange: escalona atributos e sobrevivência combinando Sentinela de Elmo Arcano + Égide do Planetário na mesma janela de pressão (85.3% WR, +27.9% Lift)."
      },
      {
        "title": "Quebra de Domínio & Contra-Ofensiva (Heliokar)",
        "cards": [
          "Heliokar, General da Roda Celeste",
          "Sylvarok, General da Roda Primeva",
          "Armada Dracônica do Zênite"
        ],
        "howItWorks": "Desça Heliokar, General da Roda Celeste para destruir a Expansão de Domínio rival (ou quebrar apenas o domínio inimigo numa Disputa 50/50, reativando seu Acerto Garantido!), impor 2 rodadas de Exaustão de Domínio ao oponente e proteger sua mesa com Escudo Divino enquanto Sylvarok, General da Roda Primeva, Armada Dracônica do Zênite fecha o letal."
      }
    ],
    "strengths": [
      "Altíssima durabilidade em combate de trincheira.",
      "Resposta Anti-Domínio nativa com Heliokar, General da Roda Celeste e Sylvarok, General da Roda Primeva (quebra Expansões inimigas na entrada ou ataque e impõe 2 rodadas de Exaustão de Domínio)."
    ],
    "weaknesses": [
      "Pouca remoção direta contra a Retaguarda inimiga."
    ],
    "keyCards": [
      "gold_87_relogio_bolso_real",
      "green_173_general_roda_selva",
      "green_188_zahir_genio_tres_desejos",
      "green_179_brennus_marechal_manto_musgo",
      "gold_172_armada_draconica_sol",
      "gold_180_valerius_comandante_aguia_imperial",
      "gold_177_lanca_cantora_coro_solar",
      "green_177_cacador_galhada_esmeralda"
    ]
  },
  "deck_dual_iron_inquisition": {
    "deckId": "deck_dual_iron_inquisition",
    "deckName": "Tomo da Inquisição Crepuscular",
    "subtitle": "Pacto Duplo 💀+☀️ • Abismo & Ordem",
    "domains": [
      "purple",
      "gold"
    ],
    "archetypeTag": "Dreno Blindado & Relíquias (55 Criaturas / 20 Relíquias)",
    "compositionSummary": {
      "creatures": 83,
      "spells": 9,
      "reactions": 2,
      "relics": 6,
      "ascensions": 16,
      "averageCost": 3.68
    },
    "playstyleOverview": "A Catedral de Sangue e Ouro: desgasta o oponente com 55 Criaturas, 20 Relíquias Contínuas, 25 Magias/Reações, Escudos Divinos e Dreno de Vida vampírico.",
    "channelingStrategy": "Priorize 2 Roxo e 2 Dourado; mantenha sempre uma Relíquia de sustentação na mão. Jamais canalize Nyxaroth, General da Roda Fúnebre nos turnos médios/finais: preserve seu General da Roda para quebrar a Expansão de Domínio inimiga (ou vencer instantaneamente uma Disputa de Domínios 50/50)!",
    "positioningAndStackingGuide": "Empilhe Inquisidores e Escudeiros na Vanguarda para proteger suas 20 Relíquias na Retaguarda.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Legionário Ossudo, Garra Decepada Animada, Flagelo Cornudo do Abismo para disputar colunas cedo, absorver pressão e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine a transição de meio de jogo com Tecelão do Feixe Solar, Presságio da Revoada Umbral, Arauto do Zênite Prismático, consolidando colunas chave e acumulando Afinidade rumo à sua Expansão de Domínio (6/6).",
      "lateGame": "Ative sua Expansão de Domínio (6/6) e domine o fim de jogo com Nyxaroth, General da Roda Fúnebre, Arauto do Zênite Prismático, Carmilla, Condessa de Sangue e Ouro. Se o rival ativar o Domínio dele — ou forçar uma Disputa de Domínios 50/50 —, invoque (ou ataque com) Nyxaroth, General da Roda Fúnebre para quebrar a Expansão inimiga, impor 2 rodadas de Exaustão de Domínio ao oponente, blindar seus aliados com Escudo Divino e reativar na hora o +1/+1 e o Acerto Garantido do seu próprio Domínio!"
    },
    "signatureCombos": [
      {
        "title": "Sinergia Co-Evoluída (89.7% WR)",
        "cards": [
          "Égide do Planetário",
          "Elixir de Pele de Adamantina"
        ],
        "howItWorks": "Multiplicador de falange: escalona atributos e sobrevivência combinando Égide do Planetário + Elixir de Pele de Adamantina na mesma janela de pressão (89.7% WR, +34.5% Lift)."
      },
      {
        "title": "Quebra de Domínio & Contra-Ofensiva (Nyxaroth)",
        "cards": [
          "Nyxaroth, General da Roda Fúnebre",
          "Arauto do Zênite Prismático"
        ],
        "howItWorks": "Desça Nyxaroth, General da Roda Fúnebre para destruir a Expansão de Domínio rival (ou quebrar apenas o domínio inimigo numa Disputa 50/50, reativando seu Acerto Garantido!), impor 2 rodadas de Exaustão de Domínio ao oponente e proteger sua mesa com Escudo Divino enquanto Arauto do Zênite Prismático fecha o letal."
      }
    ],
    "strengths": [
      "Sustentação de VIDA quase inesgotável para o Soberano.",
      "Resposta Anti-Domínio nativa com Nyxaroth, General da Roda Fúnebre (quebra Expansões inimigas na entrada ou ataque e impõe 2 rodadas de Exaustão de Domínio)."
    ],
    "weaknesses": [
      "Ritmo lento contra baralhos de combo ou rampa extrema."
    ],
    "keyCards": [
      "gold_37_escudeiro_solar",
      "purple_173_general_roda_abismo",
      "purple_188_azhar_genio_tres_pactos",
      "purple_180_corvina_marechal_bico_praga",
      "gold_172_armada_draconica_sol",
      "purple_196_guilhotina_sol_negro",
      "purple_177_inquisidor_obsidiana_astral",
      "purple_194_costura_sombras_gemeas"
    ]
  },
  "deck_dual_storm_dragon": {
    "deckId": "deck_dual_storm_dragon",
    "deckName": "Grimório do Fogo Astral",
    "subtitle": "Pacto Duplo 🔥+❄️ • Chama & Tempestade",
    "domains": [
      "red",
      "blue"
    ],
    "archetypeTag": "Bombardeio Piro-Astral (45 Criaturas / 43 Magias)",
    "compositionSummary": {
      "creatures": 57,
      "spells": 24,
      "reactions": 9,
      "relics": 10,
      "ascensions": 15,
      "averageCost": 3.23
    },
    "playstyleOverview": "Tempestade de 33 Feitiços e 10 Reações de fogo e gelo apoiada por 45 Criaturas (Fênix, Wyverns e Dragões) e 12 Relíquias. Cada magia lançada limpa o caminho para ataques aéreos.",
    "channelingStrategy": "Canalize criaturas pesadas nos Turnos 1–3; conserve feitiços de custo baixo para combar com Caldeirão de Magma e Cajado do Magi. Jamais canalize Cryonax, General da Roda Astral nos turnos médios/finais: preserve seu General da Roda para quebrar a Expansão de Domínio inimiga (ou vencer instantaneamente uma Disputa de Domínios 50/50)!",
    "positioningAndStackingGuide": "Mantenha voadores e artilheiros na Retaguarda e use Congelamento/Queima para impedir que a Vanguarda rival contra-ataque.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Batedor Escamado das Brasas, Iniciado da Torre Astral, Diabrete de Escória Vulcânica para disputar colunas e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine a transição de meio de jogo com Tecelão do Feixe Astral, Pactuário do Espírito Magmático, Pactuário do Espírito Glacial, consolidando colunas chave e acumulando Afinidade rumo à sua Expansão de Domínio (6/6). Use Pactuário do Espírito Magmático na Retaguarda com Alcance para disparar bônus a cada feitiço lançado enquanto invoca proteção na Vanguarda.",
      "lateGame": "Ative sua Expansão de Domínio (6/6) e domine o fim de jogo com Cryonax, General da Roda Astral, Esquadra Dracônica da Nevasca, Arauto do Zero Prismático, Fênix da Coroa Solar. Se o rival ativar o Domínio dele — ou forçar uma Disputa de Domínios 50/50 —, invoque (ou ataque com) Cryonax, General da Roda Astral para quebrar a Expansão inimiga, impor 2 rodadas de Exaustão de Domínio ao oponente, blindar seus aliados com Escudo Divino e reativar na hora o +1/+1 e o Acerto Garantido do seu próprio Domínio! Com Esquadra Dracônica da Nevasca, varra a Vanguarda rival com Sopro em área, gere duas fichas 2/2 imediatas e dispare seu efeito devastador ao atacar."
    },
    "signatureCombos": [
      {
        "title": "Sinergia Co-Evoluída (88.9% WR)",
        "cards": [
          "Esquadra Dracônica da Nevasca",
          "Represália do Escudo em Brasa"
        ],
        "howItWorks": "Abertura de corredor tático: Represália do Escudo em Brasa neutraliza bloqueadores para a infiltração letal de Esquadra Dracônica da Nevasca (88.9% WR, +40.2% Lift)."
      },
      {
        "title": "Quebra de Domínio & Contra-Ofensiva (Cryonax)",
        "cards": [
          "Cryonax, General da Roda Astral",
          "Esquadra Dracônica da Nevasca",
          "Pactuário do Espírito Magmático"
        ],
        "howItWorks": "Desça Cryonax, General da Roda Astral para destruir a Expansão de Domínio rival (ou quebrar apenas o domínio inimigo numa Disputa 50/50, reativando seu Acerto Garantido!), impor 2 rodadas de Exaustão de Domínio ao oponente e proteger sua mesa com Escudo Divino enquanto Esquadra Dracônica da Nevasca, Pactuário do Espírito Magmático fecha o letal."
      }
    ],
    "strengths": [
      "Domínio aéreo e excelente remoção em área.",
      "Resposta Anti-Domínio nativa com Cryonax, General da Roda Astral (quebra Expansões inimigas na entrada ou ataque e impõe 2 rodadas de Exaustão de Domínio)."
    ],
    "weaknesses": [
      "Linha de frente mais leve se não comprar feitiços de controle a tempo."
    ],
    "keyCards": [
      "neutral_80_dragonete_emboscada",
      "blue_173_general_roda_gelo",
      "red_188_malik_genio_tres_brasas",
      "blue_172_armada_draconica_gelo",
      "blue_188_tariq_genio_tres_ventos",
      "red_177_arqueiro_solar_cinza_viva",
      "blue_177_cronomante_terceiro_prisma",
      "blue_174_inversao_coordenadas"
    ]
  },
  "deck_tri_arcane_cataclysm": {
    "deckId": "deck_tri_arcane_cataclysm",
    "deckName": "Grimório do Cataclismo Arcano",
    "subtitle": "Pacto Triplo ❄️+🔥+💀 • Tempestade, Chama & Abismo",
    "domains": [
      "blue",
      "red",
      "purple"
    ],
    "archetypeTag": "Conclave Spell-Supreme (38 Criaturas / 50 Magias & Reações!)",
    "compositionSummary": {
      "creatures": 69,
      "spells": 17,
      "reactions": 3,
      "relics": 11,
      "ascensions": 13,
      "averageCost": 3.7
    },
    "playstyleOverview": "Exatamente 50% do grimório de 100 cartas são Feitiços e Reações (38 Feitiços + 12 Reações, além de 38 Criaturas e 12 Relíquias)! Une Azul, Vermelho e Roxo para controlar, queimar e drenar o oponente.",
    "channelingStrategy": "Nos Turnos 1–3, canalize 1 carta da cor que faltar para ter 🔵+🔴+🟣 ativos; depois canalize apenas criaturas excedentes. Jamais canalize Vaelkor, General da Roda Prismática e Cryonax, General da Roda Astral nos turnos médios/finais: preserve seu General da Roda para quebrar a Expansão de Domínio inimiga (ou vencer instantaneamente uma Disputa de Domínios 50/50)!",
    "positioningAndStackingGuide": "Posicione seus 38 especialistas (Magos, Artilheiros, Dragões) em slots protegidos e mantenha sempre 1–2 Reações armadas na Retaguarda.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Sentinela das Correntes Aéreas, Tritão Guardião dos Recifes, Batedor Escamado das Brasas para disputar colunas e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine a transição de meio de jogo com Pactuário do Éter Primordial, Pactuário do Espírito Umbral, Arauto da Supernova Prismática, consolidando colunas chave e acumulando Afinidade rumo à sua Expansão de Domínio (6/6). Use Pactuário do Éter Primordial na Retaguarda com Alcance para disparar bônus a cada feitiço lançado enquanto invoca proteção na Vanguarda.",
      "lateGame": "Ative sua Expansão de Domínio (6/6) e domine o fim de jogo com Vaelkor, General da Roda Prismática, Cryonax, General da Roda Astral, Arauto da Supernova Prismática, Arauto do Eclipse Prismático. Se o rival ativar o Domínio dele — ou forçar uma Disputa de Domínios 50/50 —, invoque (ou ataque com) Vaelkor, General da Roda Prismática e Cryonax, General da Roda Astral para quebrar a Expansão inimiga, impor 2 rodadas de Exaustão de Domínio ao oponente, blindar seus aliados com Escudo Divino e reativar na hora o +1/+1 e o Acerto Garantido do seu próprio Domínio!"
    },
    "signatureCombos": [
      {
        "title": "Sinergia Co-Evoluída (95.7% WR)",
        "cards": [
          "Cryonax, General da Roda Astral",
          "Botas Aladas do Mensageiro"
        ],
        "howItWorks": "Botas Aladas do Mensageiro (2⚡) trava a Vanguarda enquanto Cryonax, General da Roda Astral (7⚡) opera protegido com +1 ATQ de Cobertura (95.7% WR, +43.7% Lift)."
      },
      {
        "title": "Quebra de Domínio & Contra-Ofensiva (Vaelkor)",
        "cards": [
          "Vaelkor, General da Roda Prismática",
          "Cryonax, General da Roda Astral",
          "Pactuário do Éter Primordial"
        ],
        "howItWorks": "Desça Vaelkor, General da Roda Prismática para destruir a Expansão de Domínio rival (ou quebrar apenas o domínio inimigo numa Disputa 50/50, reativando seu Acerto Garantido!), impor 2 rodadas de Exaustão de Domínio ao oponente e proteger sua mesa com Escudo Divino enquanto Cryonax, General da Roda Astral, Pactuário do Éter Primordial fecha o letal."
      }
    ],
    "strengths": [
      "Respostas versáteis para absolutamente qualquer ameaça no jogo.",
      "Resposta Anti-Domínio nativa com Vaelkor, General da Roda Prismática e Cryonax, General da Roda Astral (quebra Expansões inimigas na entrada ou ataque e impõe 2 rodadas de Exaustão de Domínio)."
    ],
    "weaknesses": [
      "Exige precisão na escolha de qual cor canalizar nos 3 primeiros turnos."
    ],
    "keyCards": [
      "blue_68_parar_tempo",
      "blue_173_general_roda_gelo",
      "blue_180_leona_marechal_leao_branco_inverno",
      "red_180_malakor_general_lamina_colossal",
      "purple_196_guilhotina_sol_negro",
      "blue_182_arauto_duas_asas_geada",
      "blue_186_gigante_clava_glacial",
      "red_174_subduccao_magmatica"
    ]
  },
  "deck_tri_primal_titans": {
    "deckId": "deck_tri_primal_titans",
    "deckName": "Códice dos Titãs Primordiais",
    "subtitle": "Pacto Triplo 🌿+🔥+☀️ • Selva, Chama & Ordem",
    "domains": [
      "green",
      "red",
      "gold"
    ],
    "archetypeTag": "Conclave Creature-Supreme (82 Criaturas — 82%!)",
    "compositionSummary": {
      "creatures": 72,
      "spells": 13,
      "reactions": 6,
      "relics": 9,
      "ascensions": 9,
      "averageCost": 3.69
    },
    "playstyleOverview": "Avalanche tripartida de Selva, Chama e Ordem com 82 criaturas em 100 cartas (82%)! Dinossauros, Dragões, Grifos e Colossos avançam sem trégua.",
    "channelingStrategy": "Canalize qualquer criatura de custo 4–5 nos primeiros turnos para corrigir as 3 cores (🟢+🔴+🟡) e acelerar até 7⚡. Jamais canalize Sylvarok, General da Roda Primeva nos turnos médios/finais: preserve seu General da Roda para quebrar a Expansão de Domínio inimiga (ou vencer instantaneamente uma Disputa de Domínios 50/50)!",
    "positioningAndStackingGuide": "Empilhe 2–3 unidades por slot em todas as colunas ofensivas; use o Julgamento Solar e Chamado da Selva para abrir caminho.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Batedor Escamado das Brasas, Lobo Atroz da Espinha Gelada, Flagelo Cornudo da Mata para disputar colunas cedo, absorver pressão e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine a transição de meio de jogo com Tecelão do Feixe Ígneo, Presságio da Revoada Espinhosa, consolidando colunas chave e acumulando Afinidade rumo à sua Expansão de Domínio (6/6).",
      "lateGame": "Ative sua Expansão de Domínio (6/6) e domine o fim de jogo com Sylvarok, General da Roda Primeva, Enxame Dracônico Ancestral, Rex Primordial da Cratera Perdida. Se o rival ativar o Domínio dele — ou forçar uma Disputa de Domínios 50/50 —, invoque (ou ataque com) Sylvarok, General da Roda Primeva para quebrar a Expansão inimiga, impor 2 rodadas de Exaustão de Domínio ao oponente, blindar seus aliados com Escudo Divino e reativar na hora o +1/+1 e o Acerto Garantido do seu próprio Domínio! Com Enxame Dracônico Ancestral, varra a Vanguarda rival com Sopro em área, gere duas fichas 2/2 imediatas e dispare seu efeito devastador ao atacar."
    },
    "signatureCombos": [
      {
        "title": "Sinergia Co-Evoluída (100% WR)",
        "cards": [
          "Égide do Planetário",
          "Verbena, Marechal do Cardo Real"
        ],
        "howItWorks": "Égide do Planetário (3⚡) trava a Vanguarda enquanto Verbena, Marechal do Cardo Real (7⚡) opera protegido com +1 ATQ de Cobertura (100.0% WR, +44.1% Lift)."
      },
      {
        "title": "Quebra de Domínio & Contra-Ofensiva (Sylvarok)",
        "cards": [
          "Sylvarok, General da Roda Primeva",
          "Enxame Dracônico Ancestral"
        ],
        "howItWorks": "Desça Sylvarok, General da Roda Primeva para destruir a Expansão de Domínio rival (ou quebrar apenas o domínio inimigo numa Disputa 50/50, reativando seu Acerto Garantido!), impor 2 rodadas de Exaustão de Domínio ao oponente e proteger sua mesa com Escudo Divino enquanto Enxame Dracônico Ancestral fecha o letal."
      }
    ],
    "strengths": [
      "Pressão física esmagadora em todos os turnos da partida.",
      "Resposta Anti-Domínio nativa com Sylvarok, General da Roda Primeva (quebra Expansões inimigas na entrada ou ataque e impõe 2 rodadas de Exaustão de Domínio)."
    ],
    "weaknesses": [
      "Apenas 4 magias no baralho — depende do combate de unidades para remover ameaças."
    ],
    "keyCards": [
      "green_67_tiranossauro_alfa",
      "red_173_general_roda_chama",
      "green_188_zahir_genio_tres_desejos",
      "green_179_brennus_marechal_manto_musgo",
      "gold_172_armada_draconica_sol",
      "green_181_verbena_marechal_cardo_real",
      "green_183_sachiel_arcanjo_quatro_asas_seiva",
      "green_177_cacador_galhada_esmeralda"
    ]
  },
  "deck_tri_eternal_reliquary": {
    "deckId": "deck_tri_eternal_reliquary",
    "deckName": "Relicário do Trono Eterno",
    "subtitle": "Pacto Triplo ☀️+❄️+💀 • Ordem, Tempestade & Abismo",
    "domains": [
      "gold",
      "blue",
      "purple"
    ],
    "archetypeTag": "Conclave Relic-Supreme (35 Relíquias Contínuas — 35%!)",
    "compositionSummary": {
      "creatures": 61,
      "spells": 22,
      "reactions": 6,
      "relics": 11,
      "ascensions": 15,
      "averageCost": 3.22
    },
    "playstyleOverview": "O maior arsenal de relíquias do jogo: 35 Relíquias Contínuas (35% do grimório de 100 cartas), 40 Criaturas e 25 Magias/Reações que transformam a Retaguarda em uma fortaleza sagrada de efeitos passivos.",
    "channelingStrategy": "Canalize criaturas duplicadas nos Turnos 1–3 para fixar 🟡+🔵+🟣; preserve os artefatos lendários (Relógio da Eternidade, Arca da Aliança). Jamais canalize Heliokar, General da Roda Celeste e Vaelkor, General da Roda Prismática nos turnos médios/finais: preserve seu General da Roda para quebrar a Expansão de Domínio inimiga (ou vencer instantaneamente uma Disputa de Domínios 50/50)!",
    "positioningAndStackingGuide": "Ocupar 4 a 5 slots da Retaguarda com Relíquias e empilhar todas as suas criaturas em 3 por slot na Vanguarda para maximizar os buffs em área das Relíquias.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Errante das Catacumbas, Sentinela das Correntes Aéreas, Tritão Guardião dos Recifes para disputar colunas e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine a transição de meio de jogo com Tecelão do Feixe Primordial, Presságio da Revoada Solar, Arauto do Zero Prismático, consolidando colunas chave e acumulando Afinidade rumo à sua Expansão de Domínio (6/6).",
      "lateGame": "Ative sua Expansão de Domínio (6/6) e domine o fim de jogo com Heliokar, General da Roda Celeste, Vaelkor, General da Roda Prismática, Arauto do Zero Prismático, Arauto do Zênite Prismático. Se o rival ativar o Domínio dele — ou forçar uma Disputa de Domínios 50/50 —, invoque (ou ataque com) Heliokar, General da Roda Celeste e Vaelkor, General da Roda Prismática para quebrar a Expansão inimiga, impor 2 rodadas de Exaustão de Domínio ao oponente, blindar seus aliados com Escudo Divino e reativar na hora o +1/+1 e o Acerto Garantido do seu próprio Domínio!"
    },
    "signatureCombos": [
      {
        "title": "Sinergia Co-Evoluída (100% WR)",
        "cards": [
          "Golem de Gelo Rúnico",
          "Nyxaroth, General da Roda Fúnebre"
        ],
        "howItWorks": "Abertura de corredor tático: Golem de Gelo Rúnico neutraliza bloqueadores para a infiltração letal de Nyxaroth, General da Roda Fúnebre (100.0% WR, +45.3% Lift)."
      },
      {
        "title": "Quebra de Domínio & Contra-Ofensiva (Heliokar)",
        "cards": [
          "Heliokar, General da Roda Celeste",
          "Vaelkor, General da Roda Prismática",
          "Arauto do Zero Prismático"
        ],
        "howItWorks": "Desça Heliokar, General da Roda Celeste para destruir a Expansão de Domínio rival (ou quebrar apenas o domínio inimigo numa Disputa 50/50, reativando seu Acerto Garantido!), impor 2 rodadas de Exaustão de Domínio ao oponente e proteger sua mesa com Escudo Divino enquanto Vaelkor, General da Roda Prismática, Arauto do Zero Prismático fecha o letal."
      }
    ],
    "strengths": [
      "O final de jogo mais poderoso em geração passiva de valor.",
      "Resposta Anti-Domínio nativa com Heliokar, General da Roda Celeste e Vaelkor, General da Roda Prismática (quebra Expansões inimigas na entrada ou ataque e impõe 2 rodadas de Exaustão de Domínio)."
    ],
    "weaknesses": [
      "Vulnerável nos primeiros 3 turnos se comprar apenas relíquias caras."
    ],
    "keyCards": [
      "gold_72_talisma_bem",
      "gold_173_general_roda_sol",
      "gold_188_sulaiman_genio_tres_editos",
      "gold_180_valerius_comandante_aguia_imperial",
      "blue_180_leona_marechal_leao_branco_inverno",
      "purple_196_guilhotina_sol_negro",
      "blue_187_colosso_gelo_ferro",
      "gold_64_rei_hekton"
    ]
  },
  "deck_tri_blood_moon": {
    "deckId": "deck_tri_blood_moon",
    "deckName": "Tomo da Lua Sangrenta",
    "subtitle": "Pacto Triplo 💀+🌿+🔥 • Abismo, Selva & Chama",
    "domains": [
      "purple",
      "green",
      "red"
    ],
    "archetypeTag": "Horda Imortal & Sacrifício (68 Criaturas / Renascer)",
    "compositionSummary": {
      "creatures": 87,
      "spells": 5,
      "reactions": 1,
      "relics": 7,
      "ascensions": 18,
      "averageCost": 3.68
    },
    "playstyleOverview": "Aliança sombria entre Abismo, Selva e Chama: 68 criaturas ferozes e mortas-vivas (com 15 Feitiços, 7 Reações e 10 Relíquias) que atacam sem medo da morte, pois retornam mais fortes da Cripta.",
    "channelingStrategy": "Garanta 🟣+🟢+🔴 cedo; canalize criaturas pesadas sabendo que Exumar Legião e Príncipe dos Mortos podem trazê-las de volta. Jamais canalize Nyxaroth, General da Roda Fúnebre nos turnos médios/finais: preserve seu General da Roda para quebrar a Expansão de Domínio inimiga (ou vencer instantaneamente uma Disputa de Domínios 50/50)!",
    "positioningAndStackingGuide": "Use unidades com Renascer e Toque Letal na linha de frente das pilhas para proteger os causadores de dano (Meio-Dragão, Sombra Assassina).",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Acólito do Sol Negro, Lobo Atroz da Espinha Gelada, Flagelo Cornudo do Abismo, Flagelo Cornudo da Fornalha para disputar colunas cedo, absorver pressão e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine a transição de meio de jogo com Presságio da Revoada Cinzenta, consolidando colunas chave e acumulando Afinidade rumo à sua Expansão de Domínio (6/6).",
      "lateGame": "Ative sua Expansão de Domínio (6/6) e domine o fim de jogo com Nyxaroth, General da Roda Fúnebre, Legião Dracônica do Eclipse, Malakor-Vael, Soberano da Não-Vida. Se o rival ativar o Domínio dele — ou forçar uma Disputa de Domínios 50/50 —, invoque (ou ataque com) Nyxaroth, General da Roda Fúnebre para quebrar a Expansão inimiga, impor 2 rodadas de Exaustão de Domínio ao oponente, blindar seus aliados com Escudo Divino e reativar na hora o +1/+1 e o Acerto Garantido do seu próprio Domínio! Com Legião Dracônica do Eclipse, varra a Vanguarda rival com Sopro em área, gere duas fichas 2/2 imediatas e dispare seu efeito devastador ao atacar."
    },
    "signatureCombos": [
      {
        "title": "Sinergia Co-Evoluída (100% WR)",
        "cards": [
          "Troll Regenerador do Pântano",
          "Morgath, O Dragão da Chama Necrótica"
        ],
        "howItWorks": "Recursão da Cripta: recicla ameaças abatidas entre Troll Regenerador do Pântano e Morgath, O Dragão da Chama Necrótica, esgotando as remoções rivais (100.0% WR, +35.4% Lift)."
      },
      {
        "title": "Quebra de Domínio & Contra-Ofensiva (Nyxaroth)",
        "cards": [
          "Nyxaroth, General da Roda Fúnebre",
          "Legião Dracônica do Eclipse"
        ],
        "howItWorks": "Desça Nyxaroth, General da Roda Fúnebre para destruir a Expansão de Domínio rival (ou quebrar apenas o domínio inimigo numa Disputa 50/50, reativando seu Acerto Garantido!), impor 2 rodadas de Exaustão de Domínio ao oponente e proteger sua mesa com Escudo Divino enquanto Legião Dracônica do Eclipse fecha o letal."
      }
    ],
    "strengths": [
      "Resiliência absurda contra remoções em área.",
      "Resposta Anti-Domínio nativa com Nyxaroth, General da Roda Fúnebre (quebra Expansões inimigas na entrada ou ataque e impõe 2 rodadas de Exaustão de Domínio)."
    ],
    "weaknesses": [
      "Poucas unidades com Escudo Divino contra dano perfurante."
    ],
    "keyCards": [
      "purple_65_principe_mortos",
      "red_173_general_roda_chama",
      "red_188_malik_genio_tres_brasas",
      "purple_188_azhar_genio_tres_pactos",
      "green_188_zahir_genio_tres_desejos",
      "red_176_dancarino_plumas_brasa",
      "red_185_espectro_mortalha_cinzas",
      "red_36_bigorna_fogo"
    ]
  },
  "deck_tri_celestial_scales": {
    "deckId": "deck_tri_celestial_scales",
    "deckName": "Escritura das Escamas Celestiais",
    "subtitle": "Pacto Triplo ☀️+🌿+❄️ • Ordem, Selva & Tempestade",
    "domains": [
      "gold",
      "green",
      "blue"
    ],
    "archetypeTag": "Esquadrilha Celeste & Muralha Viva (62 Criaturas / 18 Relíquias)",
    "compositionSummary": {
      "creatures": 72,
      "spells": 17,
      "reactions": 1,
      "relics": 10,
      "ascensions": 10,
      "averageCost": 3.75
    },
    "playstyleOverview": "Une 62 Criaturas (Anjos, Esfinges, Leviatãs e a Tartaruga-Continente) sob a proteção de 18 Relíquias e 20 Magias/Reações de Ordem, Selva e Tempestade.",
    "channelingStrategy": "Canalize nos Turnos 1–4 para atingir 🟡+🟢+🔵 e acelerar até os colossos de custo 6–7. Jamais canalize Heliokar, General da Roda Celeste nos turnos médios/finais: preserve seu General da Roda para quebrar a Expansão de Domínio inimiga (ou vencer instantaneamente uma Disputa de Domínios 50/50)!",
    "positioningAndStackingGuide": "Coloque Guardiões regenerativos na Vanguarda e mantenha Arcontes, Magos e Relíquias na Retaguarda.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Iniciado da Torre Astral, Lobo Atroz da Espinha Gelada, Flagelo Cornudo da Geada para disputar colunas cedo, absorver pressão e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine a transição de meio de jogo com Presságio da Revoada Primordial, Presságio da Revoada Glacial, Arauto da Raiz Prismática, consolidando colunas chave e acumulando Afinidade rumo à sua Expansão de Domínio (6/6).",
      "lateGame": "Ative sua Expansão de Domínio (6/6) e domine o fim de jogo com Heliokar, General da Roda Celeste, Esquadra Dracônica da Nevasca, Arauto da Raiz Prismática, Matriz do Prisma Primordial. Se o rival ativar o Domínio dele — ou forçar uma Disputa de Domínios 50/50 —, invoque (ou ataque com) Heliokar, General da Roda Celeste para quebrar a Expansão inimiga, impor 2 rodadas de Exaustão de Domínio ao oponente, blindar seus aliados com Escudo Divino e reativar na hora o +1/+1 e o Acerto Garantido do seu próprio Domínio! Com Esquadra Dracônica da Nevasca, varra a Vanguarda rival com Sopro em área, gere duas fichas 2/2 imediatas e dispare seu efeito devastador ao atacar."
    },
    "signatureCombos": [
      {
        "title": "Sinergia Co-Evoluída (100% WR)",
        "cards": [
          "Punho do Relógio de Mão",
          "Reencarnação Primordial"
        ],
        "howItWorks": "Multiplicador de falange: escalona atributos e sobrevivência combinando Punho do Relógio de Mão + Reencarnação Primordial na mesma janela de pressão (100.0% WR, +41.7% Lift)."
      },
      {
        "title": "Quebra de Domínio & Contra-Ofensiva (Heliokar)",
        "cards": [
          "Heliokar, General da Roda Celeste",
          "Esquadra Dracônica da Nevasca",
          "Arauto da Raiz Prismática"
        ],
        "howItWorks": "Desça Heliokar, General da Roda Celeste para destruir a Expansão de Domínio rival (ou quebrar apenas o domínio inimigo numa Disputa 50/50, reativando seu Acerto Garantido!), impor 2 rodadas de Exaustão de Domínio ao oponente e proteger sua mesa com Escudo Divino enquanto Esquadra Dracônica da Nevasca, Arauto da Raiz Prismática fecha o letal."
      }
    ],
    "strengths": [
      "Forte equilíbrio entre defesa terrestre, poder aéreo e relíquias.",
      "Resposta Anti-Domínio nativa com Heliokar, General da Roda Celeste (quebra Expansões inimigas na entrada ou ataque e impõe 2 rodadas de Exaustão de Domínio)."
    ],
    "weaknesses": [
      "Menos feitiços de dano direto para finalizar sem combate."
    ],
    "keyCards": [
      "gold_100_dragao_imperial_ouro",
      "blue_173_general_roda_gelo",
      "blue_180_leona_marechal_leao_branco_inverno",
      "blue_172_armada_draconica_gelo",
      "gold_180_valerius_comandante_aguia_imperial",
      "green_179_brennus_marechal_manto_musgo",
      "gold_177_lanca_cantora_coro_solar",
      "green_177_cacador_galhada_esmeralda"
    ]
  },
  "deck_spec_chronomancer": {
    "deckId": "deck_spec_chronomancer",
    "deckName": "Códice da Ampulheta Infinita",
    "subtitle": "Arquétipo Especial ⏳ • Ordem Cronomante",
    "domains": [
      "blue",
      "gold"
    ],
    "archetypeTag": "Especialista Horológico (40 Criaturas / 35 Magias / 25 Relíquias)",
    "compositionSummary": {
      "creatures": 86,
      "spells": 2,
      "reactions": 3,
      "relics": 9,
      "ascensions": 18,
      "averageCost": 3.35
    },
    "playstyleOverview": "Grimório temático da Ordem do Relógio Eterno (100 cartas): combina 25 Relíquias temporais com 35 magias/reações de manipulação do tempo e 40 campeões horológicos.",
    "channelingStrategy": "Preserve o Relógio de Bolso Real e a Roda do Tempo; canalize criaturas duplicadas para atingir 2 Azul e 2 Dourado. Jamais canalize Cryonax, General da Roda Astral e Vaelkor, General da Roda Prismática nos turnos médios/finais: preserve seu General da Roda para quebrar a Expansão de Domínio inimiga (ou vencer instantaneamente uma Disputa de Domínios 50/50)!",
    "positioningAndStackingGuide": "Instale seus relógios e pêndulos na Retaguarda e agrupe Guerreiros Horologistas e Paladinos do Destino em pilhas protegidas na Vanguarda.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Tritão Guardião dos Recifes, Iniciado do Relógio Astral, Operário de Relojoaria para disputar colunas e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine a transição de meio de jogo com Tecelão do Feixe Astral, Pactuário do Éter Primordial, Pactuário do Espírito Solar, consolidando colunas chave e acumulando Afinidade rumo à sua Expansão de Domínio (6/6). Use Pactuário do Éter Primordial na Retaguarda com Alcance para disparar bônus a cada feitiço lançado enquanto invoca proteção na Vanguarda.",
      "lateGame": "Ative sua Expansão de Domínio (6/6) e domine o fim de jogo com Cryonax, General da Roda Astral, Vaelkor, General da Roda Prismática, Thaddeus, Senhor do Tempo. Se o rival ativar o Domínio dele — ou forçar uma Disputa de Domínios 50/50 —, invoque (ou ataque com) Cryonax, General da Roda Astral e Vaelkor, General da Roda Prismática para quebrar a Expansão inimiga, impor 2 rodadas de Exaustão de Domínio ao oponente, blindar seus aliados com Escudo Divino e reativar na hora o +1/+1 e o Acerto Garantido do seu próprio Domínio!"
    },
    "signatureCombos": [
      {
        "title": "Sinergia Co-Evoluída (88.6% WR)",
        "cards": [
          "Cetro da Geada Soberana",
          "Yan-Vael, Senhor do Furacão"
        ],
        "howItWorks": "Cetro da Geada Soberana (3⚡) trava a Vanguarda enquanto Yan-Vael, Senhor do Furacão (4⚡) opera protegido com +1 ATQ de Cobertura (88.6% WR, +34.9% Lift)."
      },
      {
        "title": "Quebra de Domínio & Contra-Ofensiva (Cryonax)",
        "cards": [
          "Cryonax, General da Roda Astral",
          "Vaelkor, General da Roda Prismática",
          "Pactuário do Éter Primordial"
        ],
        "howItWorks": "Desça Cryonax, General da Roda Astral para destruir a Expansão de Domínio rival (ou quebrar apenas o domínio inimigo numa Disputa 50/50, reativando seu Acerto Garantido!), impor 2 rodadas de Exaustão de Domínio ao oponente e proteger sua mesa com Escudo Divino enquanto Vaelkor, General da Roda Prismática, Pactuário do Éter Primordial fecha o letal."
      }
    ],
    "strengths": [
      "Sinergia altíssima entre Relíquias temporais e Congelamento.",
      "Resposta Anti-Domínio nativa com Cryonax, General da Roda Astral e Vaelkor, General da Roda Prismática (quebra Expansões inimigas na entrada ou ataque e impõe 2 rodadas de Exaustão de Domínio)."
    ],
    "weaknesses": [
      "Exige proteger a Retaguarda contra invasões rápidas."
    ],
    "keyCards": [
      "neutral_87_armadura_animada_vigia",
      "blue_62_principe_ar",
      "blue_45_oraculo_abissal",
      "blue_154_dragao_safira_soberano",
      "blue_136_leviata_cronos",
      "blue_134_arquimago_singularidade",
      "blue_35_cetro_inverno",
      "blue_132_esfinge_nebulosa"
    ]
  },
  "deck_spec_pentachromatic": {
    "deckId": "deck_spec_pentachromatic",
    "deckName": "Tomo do Dragão Prismático",
    "subtitle": "Pacto Pentacromático 🐉 • Cinco Domínios",
    "domains": [
      "red",
      "blue",
      "purple",
      "green",
      "gold"
    ],
    "archetypeTag": "Convergência dos Cinco Domínios (65 Criaturas / 5 Cores)",
    "compositionSummary": {
      "creatures": 81,
      "spells": 7,
      "reactions": 0,
      "relics": 12,
      "ascensions": 31,
      "averageCost": 3.62
    },
    "playstyleOverview": "Une os 5 Domínios Elementais sob o comando de Valkyra (65 Criaturas, 15 Feitiços, 5 Reações e 15 Relíquias), canalizando artefatos prismáticos para invocar dragões e lendas de todas as cores!",
    "channelingStrategy": "Use o Altar da Canalização para descartar cartas de custo baixo no meio do jogo e alcançar rapidamente os custos 6 e 7 de Valkyra. Jamais canalize Vaelkor, General da Roda Prismática nos turnos médios/finais: preserve seu General da Roda para quebrar a Expansão de Domínio inimiga (ou vencer instantaneamente uma Disputa de Domínios 50/50)!",
    "positioningAndStackingGuide": "Combine palavras-chave complementares no mesmo slot: Guardião Dourado na frente + Fera Verde no meio + Artilheiro Azul/Vermelho atrás!",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Iniciado do Relógio Astral, Artífice de Rodas Dentadas, Flagelo Cornudo Primordial, Flagelo Cornudo da Mata para disputar colunas cedo, absorver pressão e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine a transição de meio de jogo com Tecelão do Feixe Primordial, Presságio da Revoada Primordial, Pactuário do Éter Primordial, consolidando colunas chave e acumulando Afinidade rumo à sua Expansão de Domínio (6/6). Use Pactuário do Éter Primordial na Retaguarda com Alcance para disparar bônus a cada feitiço lançado enquanto invoca proteção na Vanguarda.",
      "lateGame": "Ative sua Expansão de Domínio (6/6) e domine o fim de jogo com Vaelkor, General da Roda Prismática, Armada Dracônica do Prisma, Matriz do Prisma Primordial, Valkyra, Imperatriz Pentacromática. Se o rival ativar o Domínio dele — ou forçar uma Disputa de Domínios 50/50 —, invoque (ou ataque com) Vaelkor, General da Roda Prismática para quebrar a Expansão inimiga, impor 2 rodadas de Exaustão de Domínio ao oponente, blindar seus aliados com Escudo Divino e reativar na hora o +1/+1 e o Acerto Garantido do seu próprio Domínio! Com Armada Dracônica do Prisma, varra a Vanguarda rival com Sopro em área, gere duas fichas 2/2 imediatas e dispare seu efeito devastador ao atacar."
    },
    "signatureCombos": [
      {
        "title": "Sinergia Co-Evoluída (93.1% WR)",
        "cards": [
          "Dragão Umbral do Eclipse",
          "Diabrete Soprador de Brasas"
        ],
        "howItWorks": "Motor de aceleração: Diabrete Soprador de Brasas antecipa recursos e fôlego para sustentar o impacto de Dragão Umbral do Eclipse (93.1% WR, +40.0% Lift)."
      },
      {
        "title": "Quebra de Domínio & Contra-Ofensiva (Vaelkor)",
        "cards": [
          "Vaelkor, General da Roda Prismática",
          "Armada Dracônica do Prisma",
          "Pactuário do Éter Primordial"
        ],
        "howItWorks": "Desça Vaelkor, General da Roda Prismática para destruir a Expansão de Domínio rival (ou quebrar apenas o domínio inimigo numa Disputa 50/50, reativando seu Acerto Garantido!), impor 2 rodadas de Exaustão de Domínio ao oponente e proteger sua mesa com Escudo Divino enquanto Armada Dracônica do Prisma, Pactuário do Éter Primordial fecha o letal."
      }
    ],
    "strengths": [
      "Acesso às melhores cartas de todos os cinco domínios.",
      "Resposta Anti-Domínio nativa com Vaelkor, General da Roda Prismática (quebra Expansões inimigas na entrada ou ataque e impõe 2 rodadas de Exaustão de Domínio)."
    ],
    "weaknesses": [
      "Exige priorizar cartas de Afinidade 0 da Matriz Prismática nos primeiros turnos enquanto alinha as cinco Afinidades."
    ],
    "keyCards": [
      "neutral_167_arauto_prisma_matriz",
      "neutral_173_general_roda_matriz",
      "red_172_armada_draconica_chama",
      "blue_198_decreto_decima_segunda_hora",
      "blue_196_engrenagens_eternidade",
      "green_186_guardiao_runico_carvalho",
      "green_159_tiranossauro_imperador",
      "neutral_10_valkyra_pentacromatica"
    ]
  },
  "deck_tri_astral_cataclysm": {
    "deckId": "deck_tri_astral_cataclysm",
    "deckName": "Grimório da Convergência Astral",
    "subtitle": "Pacto Triplo ❄️+🔥+💀 • Convergência Astral & Abismo",
    "domains": [
      "red",
      "blue",
      "purple"
    ],
    "archetypeTag": "Sobrecarga de Feitiços & Queima (35 Criaturas / 53 Magias & Reações!)",
    "compositionSummary": {
      "creatures": 69,
      "spells": 17,
      "reactions": 3,
      "relics": 11,
      "ascensions": 13,
      "averageCost": 3.7
    },
    "playstyleOverview": "A versão mais explosiva da cabala 🔴+🔵+🟣: com 35 criaturas, 53 Magias/Reações (40 Feitiços + 13 Reações) e 12 Relíquias de gatilho arcano, cada turno transforma-se em uma barragem de raios, meteoros e drenos.",
    "channelingStrategy": "Canalize criaturas situacionais nos Turnos 1–3 para ativar as 3 cores; nunca canalize Fornalha Dracônica, Coroa das Tempestades ou Grimório do Necromante. Jamais canalize Pyrrakon, General da Roda Vulcânica nos turnos médios/finais: preserve seu General da Roda para quebrar a Expansão de Domínio inimiga (ou vencer instantaneamente uma Disputa de Domínios 50/50)!",
    "positioningAndStackingGuide": "Mantenha Piromante Lança-Chamas e Arquimago da Tempestade na Retaguarda junto com suas 12 Relíquias de Ao Lançar Feitiço, e use suas 13 Reações para impedir que o inimigo encoste neles.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Iniciado Rúnico da Torre, Batedor Escamado das Brasas, Diabrete de Escória Vulcânica para disputar colunas e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine a transição de meio de jogo com Pactuário do Espírito Magmático, Pactuário do Espírito Glacial, Pactuário do Espírito Umbral, consolidando colunas chave e acumulando Afinidade rumo à sua Expansão de Domínio (6/6). Use Pactuário do Espírito Magmático na Retaguarda com Alcance para disparar bônus a cada feitiço lançado enquanto invoca proteção na Vanguarda.",
      "lateGame": "Ative sua Expansão de Domínio (6/6) e domine o fim de jogo com Pyrrakon, General da Roda Vulcânica, Armada Dracônica do Prisma, Arauto do Zero Prismático, Arauto da Supernova Prismática. Se o rival ativar o Domínio dele — ou forçar uma Disputa de Domínios 50/50 —, invoque (ou ataque com) Pyrrakon, General da Roda Vulcânica para quebrar a Expansão inimiga, impor 2 rodadas de Exaustão de Domínio ao oponente, blindar seus aliados com Escudo Divino e reativar na hora o +1/+1 e o Acerto Garantido do seu próprio Domínio! Com Armada Dracônica do Prisma, varra a Vanguarda rival com Sopro em área, gere duas fichas 2/2 imediatas e dispare seu efeito devastador ao atacar."
    },
    "signatureCombos": [
      {
        "title": "Sinergia Co-Evoluída (100% WR)",
        "cards": [
          "Malakor-Vael, Soberano da Não-Vida",
          "Astrolábio Vivo do Eclipse"
        ],
        "howItWorks": "Abertura de corredor tático: Astrolábio Vivo do Eclipse neutraliza bloqueadores para a infiltração letal de Malakor-Vael, Soberano da Não-Vida (100.0% WR, +50.6% Lift)."
      },
      {
        "title": "Quebra de Domínio & Contra-Ofensiva (Pyrrakon)",
        "cards": [
          "Pyrrakon, General da Roda Vulcânica",
          "Armada Dracônica do Prisma",
          "Pactuário do Espírito Magmático"
        ],
        "howItWorks": "Desça Pyrrakon, General da Roda Vulcânica para destruir a Expansão de Domínio rival (ou quebrar apenas o domínio inimigo numa Disputa 50/50, reativando seu Acerto Garantido!), impor 2 rodadas de Exaustão de Domínio ao oponente e proteger sua mesa com Escudo Divino enquanto Armada Dracônica do Prisma, Pactuário do Espírito Magmático fecha o letal."
      }
    ],
    "strengths": [
      "Destrói formações inimigas sem precisar travar combate corpo a corpo.",
      "Resposta Anti-Domínio nativa com Pyrrakon, General da Roda Vulcânica (quebra Expansões inimigas na entrada ou ataque e impõe 2 rodadas de Exaustão de Domínio)."
    ],
    "weaknesses": [
      "Baixa contagem de criaturas exige proteger bem seus conjuradores."
    ],
    "keyCards": [
      "blue_98_soberano_mares",
      "blue_173_general_roda_gelo",
      "blue_180_leona_marechal_leao_branco_inverno",
      "red_180_malakor_general_lamina_colossal",
      "purple_196_guilhotina_sol_negro",
      "blue_182_arauto_duas_asas_geada",
      "blue_186_gigante_clava_glacial",
      "red_174_subduccao_magmatica"
    ]
  },
  "deck_tri_primordial_forge": {
    "deckId": "deck_tri_primordial_forge",
    "deckName": "Códice dos Behemoths de Obsidiana",
    "subtitle": "Pacto Triplo 🌿+🔥+☀️ • Behemoths da Infraforja",
    "domains": [
      "red",
      "green",
      "gold"
    ],
    "archetypeTag": "Falange de Colossos & Atropelar (78 Criaturas Pesadas)",
    "compositionSummary": {
      "creatures": 72,
      "spells": 13,
      "reactions": 6,
      "relics": 9,
      "ascensions": 9,
      "averageCost": 3.69
    },
    "playstyleOverview": "Rolo compressor tripartido: 78 criaturas blindadas e ferozes de Chama, Selva e Ordem (com 10 Feitiços, 5 Reações e 7 Relíquias), culminando nos Dragões Anciões Soberanos.",
    "channelingStrategy": "Canalize todo turno até atingir 7⚡ de Essência máxima; cada compra no fim de jogo é um titã capaz de vencer sozinho. Jamais canalize Pyrrakon, General da Roda Vulcânica nos turnos médios/finais: preserve seu General da Roda para quebrar a Expansão de Domínio inimiga (ou vencer instantaneamente uma Disputa de Domínios 50/50)!",
    "positioningAndStackingGuide": "Empilhe Guardiões (Urso Rúnico, Lanceiro da Alvorada) com atacantes de Atropelar (Berserker Dracônico, Gorila Esmeralda) e dispare Levante da Selva (+2/+2 para todos).",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Batedor Salamandra das Fendas, Rastreador Feral da Copa, Flagelo Cornudo da Fornalha para disputar colunas cedo, absorver pressão e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine a transição de meio de jogo com Tecelão do Feixe Silvestre, Presságio da Revoada Cinzenta, consolidando colunas chave e acumulando Afinidade rumo à sua Expansão de Domínio (6/6).",
      "lateGame": "Ative sua Expansão de Domínio (6/6) e domine o fim de jogo com Pyrrakon, General da Roda Vulcânica, Hoste Dracônica da Cratera, Rex Primordial da Cratera Verde. Se o rival ativar o Domínio dele — ou forçar uma Disputa de Domínios 50/50 —, invoque (ou ataque com) Pyrrakon, General da Roda Vulcânica para quebrar a Expansão inimiga, impor 2 rodadas de Exaustão de Domínio ao oponente, blindar seus aliados com Escudo Divino e reativar na hora o +1/+1 e o Acerto Garantido do seu próprio Domínio! Com Hoste Dracônica da Cratera, varra a Vanguarda rival com Sopro em área, gere duas fichas 2/2 imediatas e dispare seu efeito devastador ao atacar."
    },
    "signatureCombos": [
      {
        "title": "Sinergia Co-Evoluída (100% WR)",
        "cards": [
          "Golem de Ferro Inexpugnável",
          "Égide do Planetário"
        ],
        "howItWorks": "Abertura de corredor tático: Égide do Planetário neutraliza bloqueadores para a infiltração letal de Golem de Ferro Inexpugnável (100.0% WR, +42.2% Lift)."
      },
      {
        "title": "Quebra de Domínio & Contra-Ofensiva (Pyrrakon)",
        "cards": [
          "Pyrrakon, General da Roda Vulcânica",
          "Hoste Dracônica da Cratera"
        ],
        "howItWorks": "Desça Pyrrakon, General da Roda Vulcânica para destruir a Expansão de Domínio rival (ou quebrar apenas o domínio inimigo numa Disputa 50/50, reativando seu Acerto Garantido!), impor 2 rodadas de Exaustão de Domínio ao oponente e proteger sua mesa com Escudo Divino enquanto Hoste Dracônica da Cratera fecha o letal."
      }
    ],
    "strengths": [
      "Domínio físico absoluto e altíssima taxa de vitória (63,8%).",
      "Resposta Anti-Domínio nativa com Pyrrakon, General da Roda Vulcânica (quebra Expansões inimigas na entrada ou ataque e impõe 2 rodadas de Exaustão de Domínio)."
    ],
    "weaknesses": [
      "Poucas Reações; joga de forma proativa e agressiva."
    ],
    "keyCards": [
      "green_67_tiranossauro_alfa",
      "red_173_general_roda_chama",
      "green_188_zahir_genio_tres_desejos",
      "green_179_brennus_marechal_manto_musgo",
      "gold_172_armada_draconica_sol",
      "green_181_verbena_marechal_cardo_real",
      "green_183_sachiel_arcanjo_quatro_asas_seiva",
      "green_177_cacador_galhada_esmeralda"
    ]
  },
  "deck_tri_abyssal_chimera": {
    "deckId": "deck_tri_abyssal_chimera",
    "deckName": "Tomo da Quimera Abissal",
    "subtitle": "Pacto Triplo 💀+❄️+🌿 • Abismo, Tempestade & Selva",
    "domains": [
      "blue",
      "purple",
      "green"
    ],
    "archetypeTag": "Evolução, Renascer & Gelo (62 Criaturas / 30 Magias)",
    "compositionSummary": {
      "creatures": 65,
      "spells": 23,
      "reactions": 3,
      "relics": 9,
      "ascensions": 6,
      "averageCost": 3.67
    },
    "playstyleOverview": "Potência de meio e fim de jogo (62 Criaturas, 22 Feitiços, 8 Reações e 8 Relíquias): combina Congelamento em área do Azul, evolução e feras regenerativas do Verde, e reanimação necrótica do Roxo.",
    "channelingStrategy": "Canalize nos primeiros 4 turnos para garantir 🔵+🟣+🟢 e ativar Semente da Árvore-Mundo o quanto antes. Jamais canalize Nyxaroth, General da Roda Fúnebre nos turnos médios/finais: preserve seu General da Roda para quebrar a Expansão de Domínio inimiga (ou vencer instantaneamente uma Disputa de Domínios 50/50)!",
    "positioningAndStackingGuide": "Trave as colunas perigosas do inimigo com Serpente Constritora e Leviatã Abissal enquanto empilha unidades de Toque Letal e Dreno de Vida.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Iniciado Rúnico da Torre, Iniciado do Cálice Carmesim, Flagelo Cornudo da Geada para disputar colunas cedo, absorver pressão e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine a transição de meio de jogo com Presságio da Revoada Umbral, Pactuário do Espírito Silvestre, Arauto da Raiz Prismática, consolidando colunas chave e acumulando Afinidade rumo à sua Expansão de Domínio (6/6). Use Pactuário do Espírito Silvestre na Retaguarda com Alcance para disparar bônus a cada feitiço lançado enquanto invoca proteção na Vanguarda.",
      "lateGame": "Ative sua Expansão de Domínio (6/6) e domine o fim de jogo com Nyxaroth, General da Roda Fúnebre, Legião Dracônica do Eclipse, Arauto da Raiz Prismática, Morgath, O Dragão da Chama Necrótica. Se o rival ativar o Domínio dele — ou forçar uma Disputa de Domínios 50/50 —, invoque (ou ataque com) Nyxaroth, General da Roda Fúnebre para quebrar a Expansão inimiga, impor 2 rodadas de Exaustão de Domínio ao oponente, blindar seus aliados com Escudo Divino e reativar na hora o +1/+1 e o Acerto Garantido do seu próprio Domínio! Com Legião Dracônica do Eclipse, varra a Vanguarda rival com Sopro em área, gere duas fichas 2/2 imediatas e dispare seu efeito devastador ao atacar."
    },
    "signatureCombos": [
      {
        "title": "Sinergia Co-Evoluída (100% WR)",
        "cards": [
          "Lobo Alfa da Geada",
          "Botas Aladas do Mensageiro"
        ],
        "howItWorks": "Abertura de corredor tático: Botas Aladas do Mensageiro neutraliza bloqueadores para a infiltração letal de Lobo Alfa da Geada (100.0% WR, +38.7% Lift)."
      },
      {
        "title": "Quebra de Domínio & Contra-Ofensiva (Nyxaroth)",
        "cards": [
          "Nyxaroth, General da Roda Fúnebre",
          "Legião Dracônica do Eclipse",
          "Pactuário do Espírito Silvestre"
        ],
        "howItWorks": "Desça Nyxaroth, General da Roda Fúnebre para destruir a Expansão de Domínio rival (ou quebrar apenas o domínio inimigo numa Disputa 50/50, reativando seu Acerto Garantido!), impor 2 rodadas de Exaustão de Domínio ao oponente e proteger sua mesa com Escudo Divino enquanto Legião Dracônica do Eclipse, Pactuário do Espírito Silvestre fecha o letal."
      }
    ],
    "strengths": [
      "Combina os três melhores mecanismos de atrito: Congelar, Regenerar e Reanimar.",
      "Resposta Anti-Domínio nativa com Nyxaroth, General da Roda Fúnebre (quebra Expansões inimigas na entrada ou ataque e impõe 2 rodadas de Exaustão de Domínio)."
    ],
    "weaknesses": [
      "Requer sequência correta de cores nos primeiros turnos."
    ],
    "keyCards": [
      "purple_100_dragao_necrotico",
      "blue_173_general_roda_gelo",
      "purple_188_azhar_genio_tres_pactos",
      "purple_180_corvina_marechal_bico_praga",
      "blue_172_armada_draconica_gelo",
      "purple_196_guilhotina_sol_negro",
      "purple_177_inquisidor_obsidiana_astral",
      "purple_194_costura_sombras_gemeas"
    ]
  },
  "deck_tri_crimson_sun": {
    "deckId": "deck_tri_crimson_sun",
    "deckName": "Escritura do Eclipse Carmesim",
    "subtitle": "Pacto Triplo 🔥+💀+☀️ • Chama, Abismo & Ordem",
    "domains": [
      "red",
      "purple",
      "gold"
    ],
    "archetypeTag": "Império de Sangue, Fogo & Relíquias (50 Criaturas / 20 Relíquias)",
    "compositionSummary": {
      "creatures": 91,
      "spells": 0,
      "reactions": 2,
      "relics": 7,
      "ascensions": 23,
      "averageCost": 3.38
    },
    "playstyleOverview": "Funde a disciplina blindada da Ordem Solar com o Dreno de Vida vampírico e a queima vulcânica. Suas 20 Relíquias Imperiais sustentam uma linha de frente de 50 Justicares, Vampiros e Serafins.",
    "channelingStrategy": "Priorize Afinidade Dourada e Roxa nos Turnos 1–3 para estabilizar a Vanguarda e instalar suas primeiras Relíquias. Jamais canalize Heliokar, General da Roda Celeste nos turnos médios/finais: preserve seu General da Roda para quebrar a Expansão de Domínio inimiga (ou vencer instantaneamente uma Disputa de Domínios 50/50)!",
    "positioningAndStackingGuide": "Coloque Guardiões com Escudo Divino na frente das pilhas e posicione 4 Relíquias contínuas na Retaguarda.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Escudeiro da Alvorada, Mastim Couraçado da Cidadela, Flagelo Cornudo do Abismo para disputar colunas cedo, absorver pressão e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine a transição de meio de jogo com Tecelão do Feixe Umbral, Tecelão do Feixe Solar, Arauto do Eclipse Prismático, consolidando colunas chave e acumulando Afinidade rumo à sua Expansão de Domínio (6/6).",
      "lateGame": "Ative sua Expansão de Domínio (6/6) e domine o fim de jogo com Heliokar, General da Roda Celeste, Arauto do Eclipse Prismático, Arauto do Zênite Prismático, Seraphiel, A Imperatriz das Seis Asas. Se o rival ativar o Domínio dele — ou forçar uma Disputa de Domínios 50/50 —, invoque (ou ataque com) Heliokar, General da Roda Celeste para quebrar a Expansão inimiga, impor 2 rodadas de Exaustão de Domínio ao oponente, blindar seus aliados com Escudo Divino e reativar na hora o +1/+1 e o Acerto Garantido do seu próprio Domínio!"
    },
    "signatureCombos": [
      {
        "title": "Sinergia Co-Evoluída (100% WR)",
        "cards": [
          "Punho do Relógio de Mão",
          "Fornalha Rúnica da Caldeira"
        ],
        "howItWorks": "Punho do Relógio de Mão (2⚡) trava a Vanguarda enquanto Fornalha Rúnica da Caldeira (3⚡) opera protegido com +1 ATQ de Cobertura (100.0% WR, +31.3% Lift)."
      },
      {
        "title": "Quebra de Domínio & Contra-Ofensiva (Heliokar)",
        "cards": [
          "Heliokar, General da Roda Celeste",
          "Arauto do Eclipse Prismático",
          "Arauto do Zênite Prismático"
        ],
        "howItWorks": "Desça Heliokar, General da Roda Celeste para destruir a Expansão de Domínio rival (ou quebrar apenas o domínio inimigo numa Disputa 50/50, reativando seu Acerto Garantido!), impor 2 rodadas de Exaustão de Domínio ao oponente e proteger sua mesa com Escudo Divino enquanto Arauto do Eclipse Prismático, Arauto do Zênite Prismático fecha o letal."
      }
    ],
    "strengths": [
      "Forte sustentação de VIDA e proteção com Escudo Divino em área.",
      "Resposta Anti-Domínio nativa com Heliokar, General da Roda Celeste (quebra Expansões inimigas na entrada ou ataque e impõe 2 rodadas de Exaustão de Domínio)."
    ],
    "weaknesses": [
      "Menos compra de cartas que os baralhos com domínio Azul."
    ],
    "keyCards": [
      "gold_99_serafim_coroado",
      "red_173_general_roda_chama",
      "gold_188_sulaiman_genio_tres_editos",
      "gold_178_aelion_hierofante_coroa_aurea",
      "red_180_malakor_general_lamina_colossal",
      "gold_180_valerius_comandante_aguia_imperial",
      "gold_177_lanca_cantora_coro_solar",
      "gold_32_estandarte_imperial"
    ]
  },
  "deck_tri_eternal_horizon": {
    "deckId": "deck_tri_eternal_horizon",
    "deckName": "Códice do Horizonte Eterno",
    "subtitle": "Pacto Triplo 🌿+☀️+❄️ • Horizonte Eterno",
    "domains": [
      "blue",
      "green",
      "gold"
    ],
    "archetypeTag": "Cidadela Guardiã & Rampa de Relíquias (58 Criaturas / 20 Relíquias)",
    "compositionSummary": {
      "creatures": 72,
      "spells": 17,
      "reactions": 1,
      "relics": 10,
      "ascensions": 10,
      "averageCost": 3.75
    },
    "playstyleOverview": "Aliança luminosa entre Tempestade, Selva e Ordem: ergue uma muralha intransponível de 58 Guardiões e Campeões enquanto 20 Relíquias geram Essência, cartas e buffs a cada turno.",
    "channelingStrategy": "Canalize duplicatas de custo alto nos Turnos 1–3; a Semente da Árvore-Mundo e a Coroa do Imperador acelerarão sua Essência rapidamente. Jamais canalize Sylvarok, General da Roda Primeva e Vaelkor, General da Roda Prismática nos turnos médios/finais: preserve seu General da Roda para quebrar a Expansão de Domínio inimiga (ou vencer instantaneamente uma Disputa de Domínios 50/50)!",
    "positioningAndStackingGuide": "Empilhe Guardiões (Sentinela de Safira, Urso Rúnico, Colosso Celestial) na Vanguarda e preencha a Retaguarda com Relíquias e Magos de Alcance.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Lâmina Voadora Consagrada, Lanceiro da Guarda da Alvorada, Sentinela das Correntes Aéreas para disputar colunas e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine a transição de meio de jogo com Presságio da Revoada Solar, Presságio da Revoada Espinhosa, Presságio da Revoada Primordial, consolidando colunas chave e acumulando Afinidade rumo à sua Expansão de Domínio (6/6).",
      "lateGame": "Ative sua Expansão de Domínio (6/6) e domine o fim de jogo com Sylvarok, General da Roda Primeva, Vaelkor, General da Roda Prismática, Armada Dracônica do Zênite, Aurion-Sol, O Dragão Imperial do Zênite. Se o rival ativar o Domínio dele — ou forçar uma Disputa de Domínios 50/50 —, invoque (ou ataque com) Sylvarok, General da Roda Primeva e Vaelkor, General da Roda Prismática para quebrar a Expansão inimiga, impor 2 rodadas de Exaustão de Domínio ao oponente, blindar seus aliados com Escudo Divino e reativar na hora o +1/+1 e o Acerto Garantido do seu próprio Domínio! Com Armada Dracônica do Zênite, varra a Vanguarda rival com Sopro em área, gere duas fichas 2/2 imediatas e dispare seu efeito devastador ao atacar."
    },
    "signatureCombos": [
      {
        "title": "Sinergia Co-Evoluída (97.2% WR)",
        "cards": [
          "Intervenção da Égide Angelical",
          "Elixir de Pele de Adamantina"
        ],
        "howItWorks": "Multiplicador de falange: escalona atributos e sobrevivência combinando Intervenção da Égide Angelical + Elixir de Pele de Adamantina na mesma janela de pressão (97.2% WR, +39.0% Lift)."
      },
      {
        "title": "Quebra de Domínio & Contra-Ofensiva (Sylvarok)",
        "cards": [
          "Sylvarok, General da Roda Primeva",
          "Vaelkor, General da Roda Prismática",
          "Armada Dracônica do Zênite"
        ],
        "howItWorks": "Desça Sylvarok, General da Roda Primeva para destruir a Expansão de Domínio rival (ou quebrar apenas o domínio inimigo numa Disputa 50/50, reativando seu Acerto Garantido!), impor 2 rodadas de Exaustão de Domínio ao oponente e proteger sua mesa com Escudo Divino enquanto Vaelkor, General da Roda Prismática, Armada Dracônica do Zênite fecha o letal."
      }
    ],
    "strengths": [
      "Defesa quase impenetrável com excelente geração de Essência e compra.",
      "Resposta Anti-Domínio nativa com Sylvarok, General da Roda Primeva e Vaelkor, General da Roda Prismática (quebra Expansões inimigas na entrada ou ataque e impõe 2 rodadas de Exaustão de Domínio)."
    ],
    "weaknesses": [
      "Partidas mais longas e metódicas."
    ],
    "keyCards": [
      "neutral_80_dragonete_emboscada",
      "blue_173_general_roda_gelo",
      "blue_180_leona_marechal_leao_branco_inverno",
      "blue_172_armada_draconica_gelo",
      "gold_180_valerius_comandante_aguia_imperial",
      "green_179_brennus_marechal_manto_musgo",
      "gold_177_lanca_cantora_coro_solar",
      "green_177_cacador_galhada_esmeralda"
    ]
  },
  "deck_squad_thousand_shields": {
    "deckId": "deck_squad_thousand_shields",
    "deckName": "Tratado da Falange dos Mil Escudos",
    "subtitle": "Doutrina de Esquadrão 🛡️ • Vanguarda & Cobertura",
    "domains": [
      "green",
      "gold"
    ],
    "archetypeTag": "Especialista em Esquadrão 3x por Slot (85 Criaturas — 85%!)",
    "compositionSummary": {
      "creatures": 88,
      "spells": 3,
      "reactions": 0,
      "relics": 9,
      "ascensions": 15,
      "averageCost": 3.09
    },
    "playstyleOverview": "O baralho com maior densidade de criaturas de todo o jogo (85 criaturas em 100 cartas — 85%)! Projetado especificamente para explorar a mecânica de Empilhamento de Esquadrão (até 3 cartas por slot), enchendo o tabuleiro em tempo recorde e multiplicando bônus em área.",
    "channelingStrategy": "Você só precisa canalizar nos Turnos 1 a 3 (até 5⚡ de Essência). A partir do Turno 4, pare de canalizar e despeje 2 a 3 criaturas por turno no tabuleiro! Jamais canalize Sylvarok, General da Roda Primeva e Heliokar, General da Roda Celeste nos turnos médios/finais: preserve seu General da Roda para quebrar a Expansão de Domínio inimiga (ou vencer instantaneamente uma Disputa de Domínios 50/50)!",
    "positioningAndStackingGuide": "Regra de Ouro da Falange: monte pilhas completas de 3 unidades por slot! Coloque sempre um Guardião com Escudo Divino (Autômato de Bronze, Lanceiro da Alvorada) na posição 1 (frente da pilha) e duas unidades de ataque/Alcance atrás dele no mesmo slot. Quando você lançar Formação dos Mil Escudos ou Levante da Selva, cada slot de 3 unidades receberá +6/+6 de atributos totais combinados!",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Emboscador Goblin da Mata, Lobo Atroz da Espinha Gelada, Flagelo Cornudo da Alvorada para disputar colunas cedo, absorver pressão e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine a transição de meio de jogo com Presságio da Revoada Espinhosa, Presságio da Revoada Primordial, consolidando colunas chave e acumulando Afinidade rumo à sua Expansão de Domínio (6/6).",
      "lateGame": "Ative sua Expansão de Domínio (6/6) e domine o fim de jogo com Sylvarok, General da Roda Primeva, Heliokar, General da Roda Celeste, Enxame Dracônico Ancestral, Armada Dracônica do Zênite. Se o rival ativar o Domínio dele — ou forçar uma Disputa de Domínios 50/50 —, invoque (ou ataque com) Sylvarok, General da Roda Primeva e Heliokar, General da Roda Celeste para quebrar a Expansão inimiga, impor 2 rodadas de Exaustão de Domínio ao oponente, blindar seus aliados com Escudo Divino e reativar na hora o +1/+1 e o Acerto Garantido do seu próprio Domínio! Com Enxame Dracônico Ancestral e Armada Dracônica do Zênite, varra a Vanguarda rival com Sopro em área, gere duas fichas 2/2 imediatas e dispare seu efeito devastador ao atacar."
    },
    "signatureCombos": [
      {
        "title": "Sinergia Co-Evoluída (86.3% WR)",
        "cards": [
          "Troll Regenerador do Pântano",
          "Altar das Presas Ancestrais"
        ],
        "howItWorks": "Altar das Presas Ancestrais (3⚡) trava a Vanguarda enquanto Troll Regenerador do Pântano (4⚡) opera protegido com +1 ATQ de Cobertura (86.3% WR, +36.6% Lift)."
      },
      {
        "title": "Quebra de Domínio & Contra-Ofensiva (Sylvarok)",
        "cards": [
          "Sylvarok, General da Roda Primeva",
          "Heliokar, General da Roda Celeste",
          "Enxame Dracônico Ancestral"
        ],
        "howItWorks": "Desça Sylvarok, General da Roda Primeva para destruir a Expansão de Domínio rival (ou quebrar apenas o domínio inimigo numa Disputa 50/50, reativando seu Acerto Garantido!), impor 2 rodadas de Exaustão de Domínio ao oponente e proteger sua mesa com Escudo Divino enquanto Heliokar, General da Roda Celeste, Enxame Dracônico Ancestral fecha o letal."
      }
    ],
    "strengths": [
      "Melhor aproveitamento da mecânica de 3 unidades por slot do jogo.",
      "Multiplica exponencialmente qualquer efeito `buff_all_allies` e `shield_all_allies`.",
      "Curva ultrarrápida (2.47⚡) que nunca trava na mão inicial.",
      "Resposta Anti-Domínio nativa com Sylvarok, General da Roda Primeva e Heliokar, General da Roda Celeste (quebra Expansões inimigas na entrada ou ataque e impõe 2 rodadas de Exaustão de Domínio)."
    ],
    "weaknesses": [
      "Deve guardar Escudo Divino (Mestre da Forja / Égide Inquebrável) contra baralhos de Sopro Dracônico se empilhar unidades sem proteção."
    ],
    "keyCards": [
      "gold_87_relogio_bolso_real",
      "green_173_general_roda_selva",
      "gold_172_armada_draconica_sol",
      "green_50_avatar_gaia",
      "green_121_avatar_gaia",
      "green_08_ente",
      "green_103_dragao_floresta_anciao",
      "green_160_behemoth_cratera_viva"
    ]
  },
  "deck_squad_siege_battery": {
    "deckId": "deck_squad_siege_battery",
    "deckName": "Tratado da Bateria de Cerco Arcana",
    "subtitle": "Doutrina de Artilharia 🏹 • Retaguarda & Magias",
    "domains": [
      "red",
      "blue"
    ],
    "archetypeTag": "Bateria de Cerco & Armadilhas (38 Criaturas / 47 Magias / 15 Relíquias)",
    "compositionSummary": {
      "creatures": 54,
      "spells": 31,
      "reactions": 8,
      "relics": 7,
      "ascensions": 15,
      "averageCost": 3.05
    },
    "playstyleOverview": "Especialista em bombardeio de longo alcance e controle tático: empilha 38 artilheiros, magos com Alcance e Guardiões de Safira enquanto controla o campo com 32 Feitiços, 15 Reações ocultas e 15 Relíquias.",
    "channelingStrategy": "Canalize nos primeiros turnos para destravar suas afinidades; mantenha sempre Essência disponível para acionar suas 15 Reações e Emboscadas. Jamais canalize Cryonax, General da Roda Astral nos turnos médios/finais: preserve seu General da Roda para quebrar a Expansão de Domínio inimiga (ou vencer instantaneamente uma Disputa de Domínios 50/50)!",
    "positioningAndStackingGuide": "Coloque Sentinela de Safira, Colosso de Obsidiana e Leviatã na Vanguarda, e empilhe 2–3 Artilheiros de Alcance (Artilheiro de Magma, Piromante Lança-Chamas, Arquimago) num mesmo slot da Retaguarda.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Sentinela das Correntes Aéreas, Iniciado Rúnico da Torre, Iniciado da Torre Astral para disputar colunas e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine a transição de meio de jogo com Tecelão do Feixe Primordial, Tecelão do Feixe Ígneo, Pactuário do Espírito Magmático, consolidando colunas chave e acumulando Afinidade rumo à sua Expansão de Domínio (6/6). Use Pactuário do Espírito Magmático na Retaguarda com Alcance para disparar bônus a cada feitiço lançado enquanto invoca proteção na Vanguarda.",
      "lateGame": "Ative sua Expansão de Domínio (6/6) e domine o fim de jogo com Cryonax, General da Roda Astral, Esquadra Dracônica da Nevasca, Armada Dracônica do Prisma, Khorvath, O Dragão Vulcânico Ancião. Se o rival ativar o Domínio dele — ou forçar uma Disputa de Domínios 50/50 —, invoque (ou ataque com) Cryonax, General da Roda Astral para quebrar a Expansão inimiga, impor 2 rodadas de Exaustão de Domínio ao oponente, blindar seus aliados com Escudo Divino e reativar na hora o +1/+1 e o Acerto Garantido do seu próprio Domínio! Com Esquadra Dracônica da Nevasca e Armada Dracônica do Prisma, varra a Vanguarda rival com Sopro em área, gere duas fichas 2/2 imediatas e dispare seu efeito devastador ao atacar."
    },
    "signatureCombos": [
      {
        "title": "Sinergia Co-Evoluída (86.7% WR)",
        "cards": [
          "Contramágica Rúnica",
          "Turíbulo dos Quatro Ventos"
        ],
        "howItWorks": "Motor de aceleração: Contramágica Rúnica antecipa recursos e fôlego para sustentar o impacto de Turíbulo dos Quatro Ventos (86.7% WR, +43.6% Lift)."
      },
      {
        "title": "Quebra de Domínio & Contra-Ofensiva (Cryonax)",
        "cards": [
          "Cryonax, General da Roda Astral",
          "Esquadra Dracônica da Nevasca",
          "Armada Dracônica do Prisma"
        ],
        "howItWorks": "Desça Cryonax, General da Roda Astral para destruir a Expansão de Domínio rival (ou quebrar apenas o domínio inimigo numa Disputa 50/50, reativando seu Acerto Garantido!), impor 2 rodadas de Exaustão de Domínio ao oponente e proteger sua mesa com Escudo Divino enquanto Esquadra Dracônica da Nevasca, Armada Dracônica do Prisma fecha o letal."
      }
    ],
    "strengths": [
      "Ataca da Retaguarda sem sofrer contra-ataque de unidades corpo a corpo.",
      "Resposta Anti-Domínio nativa com Cryonax, General da Roda Astral (quebra Expansões inimigas na entrada ou ataque e impõe 2 rodadas de Exaustão de Domínio)."
    ],
    "weaknesses": [
      "Exige manter pelo menos um Guardião vivo na Vanguarda para evitar Invasão."
    ],
    "keyCards": [
      "neutral_80_dragonete_emboscada",
      "red_173_general_roda_chama",
      "red_72_caldeirao_magma",
      "red_104_tempestade_cinzas",
      "red_53_explosao_vingativa",
      "red_99_senhor_balor_fogo",
      "red_33_supernova_vulcanica",
      "red_69_ira_vulcao"
    ]
  },
  "deck_penta_valkyra_pact": {
    "deckId": "deck_penta_valkyra_pact",
    "deckName": "Grimório Supremo de Valkyra",
    "subtitle": "Convergência Pentacromática 👑 • Todos os Domínios",
    "domains": [
      "red",
      "blue",
      "purple",
      "green",
      "gold"
    ],
    "archetypeTag": "Apoteose Pentacromática (50 Campeões / 25 Relíquias Prismáticas)",
    "compositionSummary": {
      "creatures": 74,
      "spells": 12,
      "reactions": 5,
      "relics": 9,
      "ascensions": 13,
      "averageCost": 3.39
    },
    "playstyleOverview": "Convergência suprema dos cinco domínios (50 Criaturas, 20 Feitiços, 5 Reações e 25 Relíquias): utiliza 25 Relíquias Prismáticas e geradoras de Essência e compra para invocar todos os Dragões Anciões Lendários do jogo!",
    "channelingStrategy": "Canalize nos Turnos 1–4 qualquer carta que não seja geradora de Essência para chegar rapidamente a 7⚡ e 3 pontos de afinidade nos seus Dragões Anciões. Jamais canalize Vaelkor, General da Roda Prismática nos turnos médios/finais: preserve seu General da Roda para quebrar a Expansão de Domínio inimiga (ou vencer instantaneamente uma Disputa de Domínios 50/50)!",
    "positioningAndStackingGuide": "Dedique 3–4 slots da Retaguarda às suas Relíquias Prismáticas (Graal Infinito, Relógio da Eternidade, Santuário da Ordem) e domine a Vanguarda com uma esquadrilha de Dragões Lendários.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Iniciado Rúnico da Torre, Lanceiro da Guarda da Alvorada, Flagelo Cornudo Primordial para disputar colunas cedo, absorver pressão e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine a transição de meio de jogo com Tecelão do Feixe Primordial, Presságio da Revoada Primordial, Presságio da Revoada Glacial, consolidando colunas chave e acumulando Afinidade rumo à sua Expansão de Domínio (6/6). Use Pactuário do Éter Primordial na Retaguarda com Alcance para disparar bônus a cada feitiço lançado enquanto invoca proteção na Vanguarda.",
      "lateGame": "Ative sua Expansão de Domínio (6/6) e domine o fim de jogo com Vaelkor, General da Roda Prismática, Armada Dracônica do Prisma, Matriz do Prisma Primordial, Valkyra, Imperatriz Pentacromática. Se o rival ativar o Domínio dele — ou forçar uma Disputa de Domínios 50/50 —, invoque (ou ataque com) Vaelkor, General da Roda Prismática para quebrar a Expansão inimiga, impor 2 rodadas de Exaustão de Domínio ao oponente, blindar seus aliados com Escudo Divino e reativar na hora o +1/+1 e o Acerto Garantido do seu próprio Domínio! Com Armada Dracônica do Prisma, varra a Vanguarda rival com Sopro em área, gere duas fichas 2/2 imediatas e dispare seu efeito devastador ao atacar."
    },
    "signatureCombos": [
      {
        "title": "Sinergia Co-Evoluída (90.5% WR)",
        "cards": [
          "Reen, Ceifador de Engrenagens",
          "Diabrete de Magma"
        ],
        "howItWorks": "Abertura de corredor tático: Diabrete de Magma neutraliza bloqueadores para a infiltração letal de Reen, Ceifador de Engrenagens (90.5% WR, +36.7% Lift)."
      },
      {
        "title": "Quebra de Domínio & Contra-Ofensiva (Vaelkor)",
        "cards": [
          "Vaelkor, General da Roda Prismática",
          "Armada Dracônica do Prisma",
          "Pactuário do Éter Primordial"
        ],
        "howItWorks": "Desça Vaelkor, General da Roda Prismática para destruir a Expansão de Domínio rival (ou quebrar apenas o domínio inimigo numa Disputa 50/50, reativando seu Acerto Garantido!), impor 2 rodadas de Exaustão de Domínio ao oponente e proteger sua mesa com Escudo Divino enquanto Armada Dracônica do Prisma, Pactuário do Éter Primordial fecha o letal."
      }
    ],
    "strengths": [
      "Maior poder de fogo tardio do jogo com acesso aos 5 Dragões Anciões e Valkyra.",
      "10 Relíquias de alto impacto garantem vantagem de Essência e cartas.",
      "Resposta Anti-Domínio nativa com Vaelkor, General da Roda Prismática (quebra Expansões inimigas na entrada ou ataque e impõe 2 rodadas de Exaustão de Domínio)."
    ],
    "weaknesses": [
      "Exige priorizar cartas de Afinidade 0 da Matriz Prismática nos primeiros turnos enquanto alinha as cinco Afinidades."
    ],
    "keyCards": [
      "neutral_10_valkyra_pentacromatica",
      "neutral_173_general_roda_matriz",
      "gold_180_valerius_comandante_aguia_imperial",
      "green_179_brennus_marechal_manto_musgo",
      "blue_180_leona_marechal_leao_branco_inverno",
      "green_177_cacador_galhada_esmeralda",
      "gold_177_lanca_cantora_coro_solar",
      "neutral_106_reen_assassino_relojoeiro"
    ]
  },
  "deck_neutral_axial": {
    "deckId": "deck_neutral_axial",
    "deckName": "Códice da Legião Axial",
    "subtitle": "Mono-Neutro ⚙️ • Matriz & Engrenagem",
    "domains": [
      "neutral"
    ],
    "archetypeTag": "Matriz & Engrenagem (80 Criaturas / 12 Magias)",
    "compositionSummary": {
      "creatures": 80,
      "spells": 10,
      "reactions": 2,
      "relics": 8,
      "ascensions": 1,
      "averageCost": 3.31
    },
    "playstyleOverview": "Falange relojoeira da Cidade Franca Axial que domina colunas com autômatos blindados, artefatos rúnicos e a Expansão da Cidadela Engrenada (80 Criaturas, 10 Feitiços, 2 Reações, 8 Relíquias • 49 cartas distintas: 14×3, 23×2, 12×1).",
    "channelingStrategy": "Turnos 1–3: Canalize [C] cartas pesadas duplicadas de custo 6+ para acelerar sua Afinidade Elemental sem perder tempo de mesa. Jamais canalize Vaelkor, General da Roda Prismática nos turnos médios/finais: preserve seu General da Roda para quebrar a Expansão de Domínio inimiga (ou vencer instantaneamente uma Disputa de Domínios 50/50)!",
    "positioningAndStackingGuide": "Posicione Guardiões e combatentes de Armadura na Vanguarda para trancar as colunas e coloque atiradores com Alcance e Relíquias na Retaguarda da mesma coluna (+1 ATQ de Disparo Apoiado).",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Mastim de Ferro da Caravana, Mercenário das Lâminas Planais, Dragonete Corredor de Emboscada para disputar colunas cedo, absorver pressão e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine a transição de meio de jogo com Aldous, Grande Cronista do Bestiário, Draco Horológico de Aeternus, Gigante Entalhador de Monólitos, recarregando a mão com seus Gênios (#188) e consolidando colunas rumo à Expansão de Domínio (6/6).",
      "lateGame": "Ative sua Expansão de Domínio (6/6) e finalize com Astrolon, Dragão do Vácuo Estelar, Vaelkor, General da Roda Prismática, Aetherion, O Dragão do Vácuo Astral, Skrym-Khor, O Gigante Quebra-Tronos. Reserve Vaelkor, General da Roda Prismática para estilhaçar qualquer Expansão de Domínio rival, impondo 2 rodadas de Exaustão de Domínio ao oponente."
    },
    "signatureCombos": [
      {
        "title": "Sinergia Co-Evoluída (91.9% WR)",
        "cards": [
          "Reen, Ceifador de Engrenagens",
          "Tomo das Estrelas Viajantes"
        ],
        "howItWorks": "Abertura de corredor tático: Tomo das Estrelas Viajantes neutraliza bloqueadores para a infiltração letal de Reen, Ceifador de Engrenagens (91.9% WR, +58.8% Lift)."
      },
      {
        "title": "Quebra de Domínio & Contra-Ofensiva (Vaelkor)",
        "cards": [
          "Vaelkor, General da Roda Prismática",
          "Astrolon, Dragão do Vácuo Estelar",
          "Vaelkor, General da Roda Prismática"
        ],
        "howItWorks": "Desça Vaelkor, General da Roda Prismática para destruir a Expansão de Domínio rival, impor 2 rodadas de Exaustão de Domínio ao oponente e proteger sua mesa com Escudo Divino enquanto fecha o letal."
      }
    ],
    "strengths": [
      "Curva consistente (3.31⚡ de custo médio) com suporte de cartas de Afinidade 0.",
      "Forte capacidade de recarga e transição para os turnos finais com Astrolon, Dragão do Vácuo Estelar, Vaelkor, General da Roda Prismática, Aetherion, O Dragão do Vácuo Astral, Skrym-Khor, O Gigante Quebra-Tronos.",
      "Resposta Anti-Domínio nativa com Vaelkor, General da Roda Prismática (2 rodadas de Exaustão de Domínio)."
    ],
    "weaknesses": [
      "Exige disciplina na Canalização nos 3 primeiros turnos para alinhar os picos de curva.",
      "Cuidado com Sopros e limpezas em área ao empilhar múltiplas unidades sem Escudo Divino."
    ],
    "keyCards": [
      "neutral_24_dragao_astral",
      "neutral_173_general_roda_matriz",
      "neutral_54_dragao_etereo",
      "neutral_116_harshnag_machado_inverno",
      "neutral_118_volothamp_cronista_mundos",
      "neutral_114_emissario_conselho_aguas",
      "neutral_115_golem_ferro_fornalha_neutra",
      "neutral_44_dragao_relogio"
    ]
  },
  "deck_dual_red_neutral": {
    "deckId": "deck_dual_red_neutral",
    "deckName": "Tratado da Forja Bélica Axial",
    "subtitle": "Aliança Cromático-Axial 🔥+⚙️ • Pyros & Matriz",
    "domains": [
      "red",
      "neutral"
    ],
    "archetypeTag": "Pyros & Matriz (91 Criaturas / 1 Magias)",
    "compositionSummary": {
      "creatures": 91,
      "spells": 0,
      "reactions": 1,
      "relics": 8,
      "ascensions": 10,
      "averageCost": 2.57
    },
    "playstyleOverview": "Artilharia mecanizada de altíssimo impacto (#2 Campeão Global Tier S) unindo autômatos axiais e poder de fogo vulcânico (91 Criaturas, 0 Feitiços, 1 Reações, 8 Relíquias • 42 cartas distintas: 28×3, 2×2, 12×1).",
    "channelingStrategy": "Turnos 1–3: Canalize [C] cartas pesadas duplicadas de custo 6+ para acelerar sua Afinidade Elemental sem perder tempo de mesa. Jamais canalize Pyrrakon, General da Roda Vulcânica nos turnos médios/finais: preserve seu General da Roda para quebrar a Expansão de Domínio inimiga (ou vencer instantaneamente uma Disputa de Domínios 50/50)!",
    "positioningAndStackingGuide": "Posicione Guardiões e combatentes de Armadura na Vanguarda para trancar as colunas e coloque atiradores com Alcance e Relíquias na Retaguarda da mesma coluna (+1 ATQ de Disparo Apoiado).",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Mastim de Ferro da Caravana, Operário de Corda de Ferro, Diabrete de Magma para disputar colunas cedo, absorver pressão e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine a transição de meio de jogo com Bigorna do Rei da Fornalha, Draco de Escória Vulcânica, Reen, Ceifador de Engrenagens, recarregando a mão com seus Gênios (#188) e consolidando colunas rumo à Expansão de Domínio (6/6).",
      "lateGame": "Ative sua Expansão de Domínio (6/6) e finalize com Pyrrakon, General da Roda Vulcânica, Valkyra, Imperatriz Pentacromática, Vaelkor, General da Roda Prismática, Ignarok, o Devorador de Reinos. Reserve Pyrrakon, General da Roda Vulcânica para estilhaçar qualquer Expansão de Domínio rival, impondo 2 rodadas de Exaustão de Domínio ao oponente."
    },
    "signatureCombos": [
      {
        "title": "Sinergia Co-Evoluída (97% WR)",
        "cards": [
          "Reen, Ceifador de Engrenagens",
          "Pantera Piroclástica"
        ],
        "howItWorks": "Abertura de corredor tático: Pantera Piroclástica neutraliza bloqueadores para a infiltração letal de Reen, Ceifador de Engrenagens (97.0% WR, +20.3% Lift)."
      },
      {
        "title": "Quebra de Domínio & Contra-Ofensiva (Pyrrakon)",
        "cards": [
          "Pyrrakon, General da Roda Vulcânica",
          "Pyrrakon, General da Roda Vulcânica",
          "Valkyra, Imperatriz Pentacromática"
        ],
        "howItWorks": "Desça Pyrrakon, General da Roda Vulcânica para destruir a Expansão de Domínio rival, impor 2 rodadas de Exaustão de Domínio ao oponente e proteger sua mesa com Escudo Divino enquanto fecha o letal."
      }
    ],
    "strengths": [
      "Curva consistente (2.57⚡ de custo médio) com suporte de cartas de Afinidade 0.",
      "Forte capacidade de recarga e transição para os turnos finais com Pyrrakon, General da Roda Vulcânica, Valkyra, Imperatriz Pentacromática, Vaelkor, General da Roda Prismática, Ignarok, o Devorador de Reinos.",
      "Resposta Anti-Domínio nativa com Pyrrakon, General da Roda Vulcânica (2 rodadas de Exaustão de Domínio)."
    ],
    "weaknesses": [
      "Exige disciplina na Canalização nos 3 primeiros turnos para alinhar os picos de curva.",
      "Cuidado com Sopros e limpezas em área ao empilhar múltiplas unidades sem Escudo Divino."
    ],
    "keyCards": [
      "red_173_general_roda_chama",
      "neutral_10_valkyra_pentacromatica",
      "neutral_173_general_roda_matriz",
      "red_46_tirano_carmesim",
      "red_100_dragao_vulcanico_anciao",
      "red_36_bigorna_fogo",
      "neutral_106_reen_assassino_relojoeiro",
      "red_72_caldeirao_magma"
    ]
  },
  "deck_dual_blue_neutral": {
    "deckId": "deck_dual_blue_neutral",
    "deckName": "Códice do Astrolábio Mecânico",
    "subtitle": "Aliança Cromático-Axial ❄️+⚙️ • Vórtex & Matriz",
    "domains": [
      "blue",
      "neutral"
    ],
    "archetypeTag": "Vórtex & Matriz (81 Criaturas / 9 Magias)",
    "compositionSummary": {
      "creatures": 81,
      "spells": 4,
      "reactions": 5,
      "relics": 10,
      "ascensions": 18,
      "averageCost": 3.59
    },
    "playstyleOverview": "Precisão cronométrica e controle aéreo (#14 Campeão Global Tier S) combinando estase polar e sentinelas de relojoaria (81 Criaturas, 4 Feitiços, 5 Reações, 10 Relíquias • 48 cartas distintas: 18×3, 16×2, 14×1).",
    "channelingStrategy": "Turnos 1–3: Canalize [C] cartas pesadas duplicadas de custo 6+ para acelerar sua Afinidade Elemental sem perder tempo de mesa. Jamais canalize Cryonax, General da Roda Astral nos turnos médios/finais: preserve seu General da Roda para quebrar a Expansão de Domínio inimiga (ou vencer instantaneamente uma Disputa de Domínios 50/50)!",
    "positioningAndStackingGuide": "Posicione Guardiões e combatentes de Armadura na Vanguarda para trancar as colunas e coloque atiradores com Alcance e Relíquias na Retaguarda da mesma coluna (+1 ATQ de Disparo Apoiado).",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Naga Oráculo das Marés, Dragonete Corredor de Emboscada, Dançarino dos Chakrams de Raio para disputar colunas cedo, absorver pressão e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine a transição de meio de jogo com Yan-Vael, Senhor do Furacão, Oráculo Esfinge do Pináculo, Cajado Supremo do Arquimago, recarregando a mão com seus Gênios (#188) e consolidando colunas rumo à Expansão de Domínio (6/6).",
      "lateGame": "Ative sua Expansão de Domínio (6/6) e finalize com Cryonax, General da Roda Astral, Esquadra Dracônica da Nevasca, Zephyrus, Monarca do Ciclone, Yan-Vael, Senhor do Furacão. Reserve Cryonax, General da Roda Astral para estilhaçar qualquer Expansão de Domínio rival, impondo 2 rodadas de Exaustão de Domínio ao oponente."
    },
    "signatureCombos": [
      {
        "title": "Sinergia Co-Evoluída (100% WR)",
        "cards": [
          "Esquadra Dracônica da Nevasca",
          "Coruja Astral de Vigília"
        ],
        "howItWorks": "Abertura de corredor tático: Coruja Astral de Vigília neutraliza bloqueadores para a infiltração letal de Esquadra Dracônica da Nevasca (100.0% WR, +44.1% Lift)."
      },
      {
        "title": "Quebra de Domínio & Contra-Ofensiva (Cryonax)",
        "cards": [
          "Cryonax, General da Roda Astral",
          "Esquadra Dracônica da Nevasca",
          "Esquadra Dracônica da Nevasca"
        ],
        "howItWorks": "Desça Cryonax, General da Roda Astral para destruir a Expansão de Domínio rival, impor 2 rodadas de Exaustão de Domínio ao oponente e proteger sua mesa com Escudo Divino enquanto fecha o letal."
      }
    ],
    "strengths": [
      "Curva consistente (3.59⚡ de custo médio) com suporte de cartas de Afinidade 0.",
      "Forte capacidade de recarga e transição para os turnos finais com Cryonax, General da Roda Astral, Esquadra Dracônica da Nevasca, Zephyrus, Monarca do Ciclone, Yan-Vael, Senhor do Furacão.",
      "Resposta Anti-Domínio nativa com Cryonax, General da Roda Astral (2 rodadas de Exaustão de Domínio)."
    ],
    "weaknesses": [
      "Exige disciplina na Canalização nos 3 primeiros turnos para alinhar os picos de curva.",
      "Cuidado com Sopros e limpezas em área ao empilhar múltiplas unidades sem Escudo Divino."
    ],
    "keyCards": [
      "blue_173_general_roda_gelo",
      "blue_172_armada_draconica_gelo",
      "blue_153_leviata_fenda_abissal",
      "blue_62_principe_ar",
      "blue_45_oraculo_abissal",
      "blue_23_dragao_bronze",
      "blue_154_dragao_safira_soberano",
      "blue_81_arconte_cronos"
    ]
  },
  "deck_dual_purple_neutral": {
    "deckId": "deck_dual_purple_neutral",
    "deckName": "Relicário das Almas Cinzentas",
    "subtitle": "Aliança Cromático-Axial 💀+⚙️ • Eclipse & Matriz",
    "domains": [
      "purple",
      "neutral"
    ],
    "archetypeTag": "Eclipse & Matriz (62 Criaturas / 28 Magias)",
    "compositionSummary": {
      "creatures": 62,
      "spells": 26,
      "reactions": 2,
      "relics": 10,
      "ascensions": 8,
      "averageCost": 3.49
    },
    "playstyleOverview": "Atrito implacável que funde carcaças autômatas da Fronteira Cinzenta com feitiços de drenagem e reanimação sombria (62 Criaturas, 26 Feitiços, 2 Reações, 10 Relíquias • 49 cartas distintas: 17×3, 17×2, 15×1).",
    "channelingStrategy": "Turnos 1–3: Canalize [C] cartas pesadas duplicadas de custo 6+ para acelerar sua Afinidade Elemental sem perder tempo de mesa. Jamais canalize Nyxaroth, General da Roda Fúnebre nos turnos médios/finais: preserve seu General da Roda para quebrar a Expansão de Domínio inimiga (ou vencer instantaneamente uma Disputa de Domínios 50/50)!",
    "positioningAndStackingGuide": "Posicione Guardiões e combatentes de Armadura na Vanguarda para trancar as colunas e coloque atiradores com Alcance e Relíquias na Retaguarda da mesma coluna (+1 ATQ de Disparo Apoiado).",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Fogo-Fátuo do Pântano, Acólito do Sol Negro, Mercenário das Lâminas Planais para disputar colunas cedo, absorver pressão e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine a transição de meio de jogo com Paladino do Juramento Quebrado, Máscara do Dragão da Noite, Ceifador Executor Tumular, recarregando a mão com seus Gênios (#188) e consolidando colunas rumo à Expansão de Domínio (6/6).",
      "lateGame": "Ative sua Expansão de Domínio (6/6) e finalize com Nyxaroth, General da Roda Fúnebre, Legião Dracônica do Eclipse, Malakor-Vael, Soberano da Não-Vida, Morgath, O Dragão da Chama Necrótica. Reserve Nyxaroth, General da Roda Fúnebre para estilhaçar qualquer Expansão de Domínio rival, impondo 2 rodadas de Exaustão de Domínio ao oponente."
    },
    "signatureCombos": [
      {
        "title": "Sinergia Co-Evoluída (100% WR)",
        "cards": [
          "Valkyra, Imperatriz Pentacromática",
          "Exumar a Legião Caída"
        ],
        "howItWorks": "Abertura de corredor tático: Exumar a Legião Caída neutraliza bloqueadores para a infiltração letal de Valkyra, Imperatriz Pentacromática (100.0% WR, +49.3% Lift)."
      },
      {
        "title": "Quebra de Domínio & Contra-Ofensiva (Nyxaroth)",
        "cards": [
          "Nyxaroth, General da Roda Fúnebre",
          "Legião Dracônica do Eclipse",
          "Legião Dracônica do Eclipse"
        ],
        "howItWorks": "Desça Nyxaroth, General da Roda Fúnebre para destruir a Expansão de Domínio rival, impor 2 rodadas de Exaustão de Domínio ao oponente e proteger sua mesa com Escudo Divino enquanto fecha o letal."
      }
    ],
    "strengths": [
      "Curva consistente (3.49⚡ de custo médio) com suporte de cartas de Afinidade 0.",
      "Forte capacidade de recarga e transição para os turnos finais com Nyxaroth, General da Roda Fúnebre, Legião Dracônica do Eclipse, Malakor-Vael, Soberano da Não-Vida, Morgath, O Dragão da Chama Necrótica.",
      "Resposta Anti-Domínio nativa com Nyxaroth, General da Roda Fúnebre (2 rodadas de Exaustão de Domínio)."
    ],
    "weaknesses": [
      "Exige disciplina na Canalização nos 3 primeiros turnos para alinhar os picos de curva.",
      "Cuidado com Sopros e limpezas em área ao empilhar múltiplas unidades sem Escudo Divino."
    ],
    "keyCards": [
      "purple_173_general_roda_abismo",
      "purple_172_armada_draconica_abismo",
      "purple_65_principe_mortos",
      "purple_100_dragao_necrotico",
      "purple_83_arquidemonio_tempo",
      "purple_156_lich_coroa_entropia",
      "purple_05_cavaleiro_morte",
      "purple_22_orbe_necrotico"
    ]
  },
  "deck_dual_green_neutral": {
    "deckId": "deck_dual_green_neutral",
    "deckName": "Códice dos Colossos Simbióticos",
    "subtitle": "Aliança Cromático-Axial 🌿+⚙️ • Veridia & Matriz",
    "domains": [
      "green",
      "neutral"
    ],
    "archetypeTag": "Veridia & Matriz (81 Criaturas / 11 Magias)",
    "compositionSummary": {
      "creatures": 81,
      "spells": 10,
      "reactions": 1,
      "relics": 8,
      "ascensions": 1,
      "averageCost": 3.7
    },
    "playstyleOverview": "Aceleração de Essência rumo a titãs revestidos de adamantina e raízes vivas que esmagam bloqueios com Atropelar (81 Criaturas, 10 Feitiços, 1 Reações, 8 Relíquias • 52 cartas distintas: 13×3, 22×2, 17×1).",
    "channelingStrategy": "Turnos 1–3: Canalize [C] cartas pesadas duplicadas de custo 6+ para acelerar sua Afinidade Elemental sem perder tempo de mesa. Jamais canalize Sylvarok, General da Roda Primeva nos turnos médios/finais: preserve seu General da Roda para quebrar a Expansão de Domínio inimiga (ou vencer instantaneamente uma Disputa de Domínios 50/50)!",
    "positioningAndStackingGuide": "Posicione Guardiões e combatentes de Armadura na Vanguarda para trancar as colunas e coloque atiradores com Alcance e Relíquias na Retaguarda da mesma coluna (+1 ATQ de Disparo Apoiado).",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Mercenário das Lâminas Planais, Mastim de Ferro da Caravana, Operário de Corda de Ferro para disputar colunas cedo, absorver pressão e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine a transição de meio de jogo com Troll Regenerador do Pântano, Brontossauro Trovejante (-3351 C.V.), Diadema Supremo Pentacromático, recarregando a mão com seus Gênios (#188) e consolidando colunas rumo à Expansão de Domínio (6/6).",
      "lateGame": "Ative sua Expansão de Domínio (6/6) e finalize com Sylvarok, General da Roda Primeva, Gorgoroth, Behemoth Devorador de Montanhas, Dragão Esmeralda de Galhada Viva, Vorágine, Hidra Voraz do Pântano. Reserve Sylvarok, General da Roda Primeva para estilhaçar qualquer Expansão de Domínio rival, impondo 2 rodadas de Exaustão de Domínio ao oponente."
    },
    "signatureCombos": [
      {
        "title": "Sinergia Co-Evoluída (100% WR)",
        "cards": [
          "Sylvarok, General da Roda Primeva",
          "Reen, Ceifador de Engrenagens"
        ],
        "howItWorks": "Abertura de corredor tático: Reen, Ceifador de Engrenagens neutraliza bloqueadores para a infiltração letal de Sylvarok, General da Roda Primeva (100.0% WR, +37.9% Lift)."
      },
      {
        "title": "Quebra de Domínio & Contra-Ofensiva (Sylvarok)",
        "cards": [
          "Sylvarok, General da Roda Primeva",
          "Sylvarok, General da Roda Primeva",
          "Gorgoroth, Behemoth Devorador de Montanhas"
        ],
        "howItWorks": "Desça Sylvarok, General da Roda Primeva para destruir a Expansão de Domínio rival, impor 2 rodadas de Exaustão de Domínio ao oponente e proteger sua mesa com Escudo Divino enquanto fecha o letal."
      }
    ],
    "strengths": [
      "Curva consistente (3.7⚡ de custo médio) com suporte de cartas de Afinidade 0.",
      "Forte capacidade de recarga e transição para os turnos finais com Sylvarok, General da Roda Primeva, Gorgoroth, Behemoth Devorador de Montanhas, Dragão Esmeralda de Galhada Viva, Vorágine, Hidra Voraz do Pântano.",
      "Resposta Anti-Domínio nativa com Sylvarok, General da Roda Primeva (2 rodadas de Exaustão de Domínio)."
    ],
    "weaknesses": [
      "Exige disciplina na Canalização nos 3 primeiros turnos para alinhar os picos de curva.",
      "Cuidado com Sopros e limpezas em área ao empilhar múltiplas unidades sem Escudo Divino."
    ],
    "keyCards": [
      "green_173_general_roda_selva",
      "green_33_behemoth_primordial",
      "green_161_dragao_esmeralda_primordial",
      "green_09_hidra",
      "green_50_avatar_gaia",
      "green_159_tiranossauro_imperador",
      "green_36_coracao_floresta",
      "green_08_ente"
    ]
  },
  "deck_dual_gold_neutral": {
    "deckId": "deck_dual_gold_neutral",
    "deckName": "Escritura da Cidadela de Marfim",
    "subtitle": "Aliança Cromático-Axial ☀️+⚙️ • Solária & Matriz",
    "domains": [
      "gold",
      "neutral"
    ],
    "archetypeTag": "Solária & Matriz (81 Criaturas / 9 Magias)",
    "compositionSummary": {
      "creatures": 81,
      "spells": 7,
      "reactions": 2,
      "relics": 10,
      "ascensions": 12,
      "averageCost": 3.55
    },
    "playstyleOverview": "Bastião inexpugnável (#11 Campeão Global Tier S) de Escudos Divinos, relíquias imperiais e guardiões de aço puro (81 Criaturas, 7 Feitiços, 2 Reações, 10 Relíquias • 47 cartas distintas: 18×3, 17×2, 12×1).",
    "channelingStrategy": "Turnos 1–3: Canalize [C] cartas pesadas duplicadas de custo 6+ para acelerar sua Afinidade Elemental sem perder tempo de mesa. Jamais canalize Heliokar, General da Roda Celeste nos turnos médios/finais: preserve seu General da Roda para quebrar a Expansão de Domínio inimiga (ou vencer instantaneamente uma Disputa de Domínios 50/50)!",
    "positioningAndStackingGuide": "Posicione Guardiões e combatentes de Armadura na Vanguarda para trancar as colunas e coloque atiradores com Alcance e Relíquias na Retaguarda da mesma coluna (+1 ATQ de Disparo Apoiado).",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Alabardeiro da Falange Dourada, Mastim de Ferro da Caravana, Escudeiro da Alvorada para disputar colunas cedo, absorver pressão e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine a transição de meio de jogo com Leão-Rei Celestial, Reen, Ceifador de Engrenagens, Aldous, Grande Cronista do Bestiário, recarregando a mão com seus Gênios (#188) e consolidando colunas rumo à Expansão de Domínio (6/6).",
      "lateGame": "Ative sua Expansão de Domínio (6/6) e finalize com Heliokar, General da Roda Celeste, Armada Dracônica do Zênite, Arca da Aliança Dourada, Aurelius, Soberano Dragão da Alvorada. Reserve Heliokar, General da Roda Celeste para estilhaçar qualquer Expansão de Domínio rival, impondo 2 rodadas de Exaustão de Domínio ao oponente."
    },
    "signatureCombos": [
      {
        "title": "Sinergia Co-Evoluída (95.8% WR)",
        "cards": [
          "Cálice Real da Alvorada",
          "Arca da Aliança Dourada"
        ],
        "howItWorks": "Multiplicador de falange: escalona atributos e sobrevivência combinando Cálice Real da Alvorada + Arca da Aliança Dourada na mesma janela de pressão (95.8% WR, +39.5% Lift)."
      },
      {
        "title": "Quebra de Domínio & Contra-Ofensiva (Heliokar)",
        "cards": [
          "Heliokar, General da Roda Celeste",
          "Armada Dracônica do Zênite",
          "Armada Dracônica do Zênite"
        ],
        "howItWorks": "Desça Heliokar, General da Roda Celeste para destruir a Expansão de Domínio rival, impor 2 rodadas de Exaustão de Domínio ao oponente e proteger sua mesa com Escudo Divino enquanto fecha o letal."
      }
    ],
    "strengths": [
      "Curva consistente (3.55⚡ de custo médio) com suporte de cartas de Afinidade 0.",
      "Forte capacidade de recarga e transição para os turnos finais com Heliokar, General da Roda Celeste, Armada Dracônica do Zênite, Arca da Aliança Dourada, Aurelius, Soberano Dragão da Alvorada.",
      "Resposta Anti-Domínio nativa com Heliokar, General da Roda Celeste (2 rodadas de Exaustão de Domínio)."
    ],
    "weaknesses": [
      "Exige disciplina na Canalização nos 3 primeiros turnos para alinhar os picos de curva.",
      "Cuidado com Sopros e limpezas em área ao empilhar múltiplas unidades sem Escudo Divino."
    ],
    "keyCards": [
      "gold_173_general_roda_sol",
      "gold_172_armada_draconica_sol",
      "gold_28_reliquia_pacto",
      "gold_157_dragao_soberano_alvorada",
      "gold_119_soberano_ordem_eterna",
      "gold_99_serafim_coroado",
      "gold_115_leao_celestial_rei",
      "gold_141_intervencao_angelical"
    ]
  },
  "deck_tri_zenith_armada": {
    "deckId": "deck_tri_zenith_armada",
    "deckName": "Grimório da Armada do Zênite",
    "subtitle": "Pacto Triplo 🔥+❄️+☀️ • Campeão Supremo #1 Global",
    "domains": [
      "red",
      "blue",
      "gold"
    ],
    "archetypeTag": "Campeão Supremo #1 Global (91 Criaturas / 4 Magias)",
    "compositionSummary": {
      "creatures": 91,
      "spells": 2,
      "reactions": 2,
      "relics": 5,
      "ascensions": 21,
      "averageCost": 3.6
    },
    "playstyleOverview": "O grande campeão unificado de Vaeloria (#1 Global Tier S): supremacia aérea de frotas dracônicas, estase arcana e Égide Solar (91 Criaturas, 2 Feitiços, 2 Reações, 5 Relíquias • 48 cartas distintas: 19×3, 14×2, 15×1).",
    "channelingStrategy": "Turnos 1–3: Canalize [C] cartas pesadas duplicadas de custo 6+ para acelerar sua Afinidade Elemental sem perder tempo de mesa. Jamais canalize Pyrrakon, General da Roda Vulcânica nos turnos médios/finais: preserve seu General da Roda para quebrar a Expansão de Domínio inimiga (ou vencer instantaneamente uma Disputa de Domínios 50/50)!",
    "positioningAndStackingGuide": "Posicione Guardiões e combatentes de Armadura na Vanguarda para trancar as colunas e coloque atiradores com Alcance e Relíquias na Retaguarda da mesma coluna (+1 ATQ de Disparo Apoiado).",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Serpente de Vapor Superaquecido, Diabrete de Magma, Naga Oráculo das Marés para disputar colunas cedo, absorver pressão e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine a transição de meio de jogo com Yan-Vael, Senhor do Furacão, Oráculo Esfinge do Pináculo, Yeti Abominável do Pico, recarregando a mão com seus Gênios (#188) e consolidando colunas rumo à Expansão de Domínio (6/6).",
      "lateGame": "Ative sua Expansão de Domínio (6/6) e finalize com Pyrrakon, General da Roda Vulcânica, Armada Dracônica do Zênite, Heliokar, General da Roda Celeste, Aurelius, Soberano Dragão da Alvorada. Reserve Pyrrakon, General da Roda Vulcânica para estilhaçar qualquer Expansão de Domínio rival, impondo 2 rodadas de Exaustão de Domínio ao oponente."
    },
    "signatureCombos": [
      {
        "title": "Sinergia Co-Evoluída (100% WR)",
        "cards": [
          "Cetro da Geada Soberana",
          "Escudeiro da Alvorada"
        ],
        "howItWorks": "Escudeiro da Alvorada (1⚡) trava a Vanguarda enquanto Cetro da Geada Soberana (3⚡) opera protegido com +1 ATQ de Cobertura (100.0% WR, +35.6% Lift)."
      },
      {
        "title": "Quebra de Domínio & Contra-Ofensiva (Pyrrakon)",
        "cards": [
          "Pyrrakon, General da Roda Vulcânica",
          "Armada Dracônica do Zênite",
          "Armada Dracônica do Zênite"
        ],
        "howItWorks": "Desça Pyrrakon, General da Roda Vulcânica para destruir a Expansão de Domínio rival, impor 2 rodadas de Exaustão de Domínio ao oponente e proteger sua mesa com Escudo Divino enquanto fecha o letal."
      }
    ],
    "strengths": [
      "Curva consistente (3.6⚡ de custo médio) com suporte de cartas de Afinidade 0.",
      "Forte capacidade de recarga e transição para os turnos finais com Pyrrakon, General da Roda Vulcânica, Armada Dracônica do Zênite, Heliokar, General da Roda Celeste, Aurelius, Soberano Dragão da Alvorada.",
      "Resposta Anti-Domínio nativa com Pyrrakon, General da Roda Vulcânica (2 rodadas de Exaustão de Domínio)."
    ],
    "weaknesses": [
      "Exige disciplina na Canalização nos 3 primeiros turnos para alinhar os picos de curva.",
      "Cuidado com Sopros e limpezas em área ao empilhar múltiplas unidades sem Escudo Divino."
    ],
    "keyCards": [
      "red_173_general_roda_chama",
      "gold_172_armada_draconica_sol",
      "gold_173_general_roda_sol",
      "gold_157_dragao_soberano_alvorada",
      "gold_141_intervencao_angelical",
      "gold_155_arconte_lanca_solar",
      "red_23_dragao_latao",
      "blue_173_general_roda_gelo"
    ]
  },
  "deck_tri_tempest_primordial": {
    "deckId": "deck_tri_tempest_primordial",
    "deckName": "Códice da Tempestade Primordial",
    "subtitle": "Pacto Triplo 🔥+❄️+🌿 • Chama, Vórtex & Selva",
    "domains": [
      "red",
      "blue",
      "green"
    ],
    "archetypeTag": "Chama, Vórtex & Selva (74 Criaturas / 18 Magias)",
    "compositionSummary": {
      "creatures": 74,
      "spells": 11,
      "reactions": 7,
      "relics": 8,
      "ascensions": 9,
      "averageCost": 3.66
    },
    "playstyleOverview": "Aceleração elemental explosiva (#8 Global Tier S) que combina ramp silvestre, compra arcana e sopros vulcânicos devastadores (74 Criaturas, 11 Feitiços, 7 Reações, 8 Relíquias • 49 cartas distintas: 18×3, 15×2, 16×1).",
    "channelingStrategy": "Turnos 1–3: Canalize [C] cartas pesadas duplicadas de custo 6+ para acelerar sua Afinidade Elemental sem perder tempo de mesa. Jamais canalize Sylvarok, General da Roda Primeva nos turnos médios/finais: preserve seu General da Roda para quebrar a Expansão de Domínio inimiga (ou vencer instantaneamente uma Disputa de Domínios 50/50)!",
    "positioningAndStackingGuide": "Posicione Guardiões e combatentes de Armadura na Vanguarda para trancar as colunas e coloque atiradores com Alcance e Relíquias na Retaguarda da mesma coluna (+1 ATQ de Disparo Apoiado).",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Mercenário das Lâminas Planais, Diabrete Soprador de Brasas, Dragonete Corredor de Emboscada para disputar colunas cedo, absorver pressão e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine a transição de meio de jogo com Draco de Escória Vulcânica, Troll Regenerador do Pântano, Bênção da Árvore-do-Mundo, recarregando a mão com seus Gênios (#188) e consolidando colunas rumo à Expansão de Domínio (6/6).",
      "lateGame": "Ative sua Expansão de Domínio (6/6) e finalize com Sylvarok, General da Roda Primeva, Pyrrakon, General da Roda Vulcânica, Vulcanis, Titã da Bigorna Primordial, Vorágine, Hidra Voraz do Pântano. Reserve Sylvarok, General da Roda Primeva para estilhaçar qualquer Expansão de Domínio rival, impondo 2 rodadas de Exaustão de Domínio ao oponente."
    },
    "signatureCombos": [
      {
        "title": "Sinergia Co-Evoluída (100% WR)",
        "cards": [
          "Yan-Vael, Senhor do Furacão",
          "Marcha dos Colossos"
        ],
        "howItWorks": "Abertura de corredor tático: Yan-Vael, Senhor do Furacão neutraliza bloqueadores para a infiltração letal de Marcha dos Colossos (100.0% WR, +45.0% Lift)."
      },
      {
        "title": "Quebra de Domínio & Contra-Ofensiva (Sylvarok)",
        "cards": [
          "Sylvarok, General da Roda Primeva",
          "Sylvarok, General da Roda Primeva",
          "Pyrrakon, General da Roda Vulcânica"
        ],
        "howItWorks": "Desça Sylvarok, General da Roda Primeva para destruir a Expansão de Domínio rival, impor 2 rodadas de Exaustão de Domínio ao oponente e proteger sua mesa com Escudo Divino enquanto fecha o letal."
      }
    ],
    "strengths": [
      "Curva consistente (3.66⚡ de custo médio) com suporte de cartas de Afinidade 0.",
      "Forte capacidade de recarga e transição para os turnos finais com Sylvarok, General da Roda Primeva, Pyrrakon, General da Roda Vulcânica, Vulcanis, Titã da Bigorna Primordial, Vorágine, Hidra Voraz do Pântano.",
      "Resposta Anti-Domínio nativa com Sylvarok, General da Roda Primeva (2 rodadas de Exaustão de Domínio)."
    ],
    "weaknesses": [
      "Exige disciplina na Canalização nos 3 primeiros turnos para alinhar os picos de curva.",
      "Cuidado com Sopros e limpezas em área ao empilhar múltiplas unidades sem Escudo Divino."
    ],
    "keyCards": [
      "green_173_general_roda_selva",
      "red_173_general_roda_chama",
      "red_157_dragao_tiamat_carmesim",
      "green_09_hidra",
      "green_07_troll",
      "green_36_coracao_floresta",
      "green_159_tiranossauro_imperador",
      "green_160_behemoth_cratera_viva"
    ]
  },
  "deck_tri_eclipse_bastion": {
    "deckId": "deck_tri_eclipse_bastion",
    "deckName": "Escritura do Bastião do Eclipse",
    "subtitle": "Pacto Triplo 💀+🌿+☀️ • Abismo, Selva & Ordem",
    "domains": [
      "purple",
      "green",
      "gold"
    ],
    "archetypeTag": "Abismo, Selva & Ordem (89 Criaturas / 7 Magias)",
    "compositionSummary": {
      "creatures": 89,
      "spells": 5,
      "reactions": 2,
      "relics": 4,
      "ascensions": 15,
      "averageCost": 3.85
    },
    "playstyleOverview": "Fortaleza imortal de atrito (#15 Global Tier S) unindo Regeneração ancestral, Armadura dourada e ressurreição da Cripta (89 Criaturas, 5 Feitiços, 2 Reações, 4 Relíquias • 50 cartas distintas: 16×3, 18×2, 16×1).",
    "channelingStrategy": "Turnos 1–3: Canalize [C] cartas pesadas duplicadas de custo 6+ para acelerar sua Afinidade Elemental sem perder tempo de mesa. Jamais canalize Heliokar, General da Roda Celeste nos turnos médios/finais: preserve seu General da Roda para quebrar a Expansão de Domínio inimiga (ou vencer instantaneamente uma Disputa de Domínios 50/50)!",
    "positioningAndStackingGuide": "Posicione Guardiões e combatentes de Armadura na Vanguarda para trancar as colunas e coloque atiradores com Alcance e Relíquias na Retaguarda da mesma coluna (+1 ATQ de Disparo Apoiado).",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Escudeiro da Alvorada, Mastim de Ferro da Caravana, Punho do Relógio de Mão para disputar colunas cedo, absorver pressão e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine a transição de meio de jogo com Estandarte da Legião Dourada, Leão-Rei Celestial, Troll Regenerador do Pântano, recarregando a mão com seus Gênios (#188) e consolidando colunas rumo à Expansão de Domínio (6/6).",
      "lateGame": "Ative sua Expansão de Domínio (6/6) e finalize com Armada Dracônica do Zênite, Heliokar, General da Roda Celeste, Justinian, Soberano da Ordem Eterna, Hyperion, Deus-Imperador da Aurora. Reserve Heliokar, General da Roda Celeste para estilhaçar qualquer Expansão de Domínio rival, impondo 2 rodadas de Exaustão de Domínio ao oponente."
    },
    "signatureCombos": [
      {
        "title": "Sinergia Co-Evoluída (100% WR)",
        "cards": [
          "Erguer Legião da Cripta",
          "Mephistar, O Demônio do Pacto Eterno"
        ],
        "howItWorks": "Multiplicador de falange: escalona atributos e sobrevivência combinando Erguer Legião da Cripta + Mephistar, O Demônio do Pacto Eterno na mesma janela de pressão (100.0% WR, +42.3% Lift)."
      },
      {
        "title": "Quebra de Domínio & Contra-Ofensiva (Heliokar)",
        "cards": [
          "Heliokar, General da Roda Celeste",
          "Armada Dracônica do Zênite",
          "Heliokar, General da Roda Celeste"
        ],
        "howItWorks": "Desça Heliokar, General da Roda Celeste para destruir a Expansão de Domínio rival, impor 2 rodadas de Exaustão de Domínio ao oponente e proteger sua mesa com Escudo Divino enquanto fecha o letal."
      }
    ],
    "strengths": [
      "Curva consistente (3.85⚡ de custo médio) com suporte de cartas de Afinidade 0.",
      "Forte capacidade de recarga e transição para os turnos finais com Armada Dracônica do Zênite, Heliokar, General da Roda Celeste, Justinian, Soberano da Ordem Eterna, Hyperion, Deus-Imperador da Aurora.",
      "Resposta Anti-Domínio nativa com Heliokar, General da Roda Celeste (2 rodadas de Exaustão de Domínio)."
    ],
    "weaknesses": [
      "Exige disciplina na Canalização nos 3 primeiros turnos para alinhar os picos de curva.",
      "Cuidado com Sopros e limpezas em área ao empilhar múltiplas unidades sem Escudo Divino."
    ],
    "keyCards": [
      "gold_172_armada_draconica_sol",
      "gold_173_general_roda_sol",
      "gold_119_soberano_ordem_eterna",
      "gold_138_imperador_sol_supremo",
      "gold_32_estandarte_imperial",
      "gold_115_leao_celestial_rei",
      "gold_141_intervencao_angelical",
      "green_173_general_roda_selva"
    ]
  },
  "deck_penta_wheel_convergence": {
    "deckId": "deck_penta_wheel_convergence",
    "deckName": "Tomo da Convergência dos Oito Raios",
    "subtitle": "Soberano Pentacromático ☸ • Conclave Anti-Domínio",
    "domains": [
      "red",
      "blue",
      "purple",
      "green",
      "gold"
    ],
    "archetypeTag": "Conclave Anti-Domínio (61 Criaturas / 28 Magias)",
    "compositionSummary": {
      "creatures": 61,
      "spells": 23,
      "reactions": 5,
      "relics": 11,
      "ascensions": 14,
      "averageCost": 3.55
    },
    "playstyleOverview": "Doutrina suprema dos Generais da Roda (#173) e Arautos do Prisma (#167), capaz de estilhaçar qualquer Expansão de Domínio rival (61 Criaturas, 23 Feitiços, 5 Reações, 11 Relíquias • 50 cartas distintas: 14×3, 22×2, 14×1).",
    "channelingStrategy": "Turnos 1–3: Canalize [C] cartas pesadas duplicadas de custo 6+ para acelerar sua Afinidade Elemental sem perder tempo de mesa. Jamais canalize Vaelkor, General da Roda Prismática nos turnos médios/finais: preserve seu General da Roda para quebrar a Expansão de Domínio inimiga (ou vencer instantaneamente uma Disputa de Domínios 50/50)!",
    "positioningAndStackingGuide": "Posicione Guardiões e combatentes de Armadura na Vanguarda para trancar as colunas e coloque atiradores com Alcance e Relíquias na Retaguarda da mesma coluna (+1 ATQ de Disparo Apoiado).",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Serpente de Vapor Superaquecido, Naga Oráculo das Marés, Fada Pixie do Pó Estelar para disputar colunas cedo, absorver pressão e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine a transição de meio de jogo com Matriz do Prisma Primordial, Caracol-Mangual de Casco Prismático, Arquimago da Singularidade, recarregando a mão com seus Gênios (#188) e consolidando colunas rumo à Expansão de Domínio (6/6).",
      "lateGame": "Ative sua Expansão de Domínio (6/6) e finalize com Vaelkor, General da Roda Prismática, Valkyra, Imperatriz Pentacromática, Matriz do Prisma Primordial, Emissário Real do Conselho. Reserve Vaelkor, General da Roda Prismática para estilhaçar qualquer Expansão de Domínio rival, impondo 2 rodadas de Exaustão de Domínio ao oponente."
    },
    "signatureCombos": [
      {
        "title": "Sinergia Co-Evoluída (100% WR)",
        "cards": [
          "Botas Aladas do Mensageiro",
          "Galope das Brasas Vivas"
        ],
        "howItWorks": "Multiplicador de falange: escalona atributos e sobrevivência combinando Botas Aladas do Mensageiro + Galope das Brasas Vivas na mesma janela de pressão (100.0% WR, +44.6% Lift)."
      },
      {
        "title": "Quebra de Domínio & Contra-Ofensiva (Vaelkor)",
        "cards": [
          "Vaelkor, General da Roda Prismática",
          "Vaelkor, General da Roda Prismática",
          "Valkyra, Imperatriz Pentacromática"
        ],
        "howItWorks": "Desça Vaelkor, General da Roda Prismática para destruir a Expansão de Domínio rival, impor 2 rodadas de Exaustão de Domínio ao oponente e proteger sua mesa com Escudo Divino enquanto fecha o letal."
      }
    ],
    "strengths": [
      "Curva consistente (3.55⚡ de custo médio) com suporte de cartas de Afinidade 0.",
      "Forte capacidade de recarga e transição para os turnos finais com Vaelkor, General da Roda Prismática, Valkyra, Imperatriz Pentacromática, Matriz do Prisma Primordial, Emissário Real do Conselho.",
      "Resposta Anti-Domínio nativa com Vaelkor, General da Roda Prismática (2 rodadas de Exaustão de Domínio)."
    ],
    "weaknesses": [
      "Exige disciplina na Canalização nos 3 primeiros turnos para alinhar os picos de curva.",
      "Cuidado com Sopros e limpezas em área ao empilhar múltiplas unidades sem Escudo Divino."
    ],
    "keyCards": [
      "neutral_173_general_roda_matriz",
      "neutral_10_valkyra_pentacromatica",
      "neutral_167_arauto_prisma_matriz",
      "neutral_114_emissario_conselho_aguas",
      "neutral_97_caracol_mangual_prisma",
      "blue_173_general_roda_gelo",
      "blue_45_oraculo_abissal",
      "blue_134_arquimago_singularidade"
    ]
  }
};

export const EMPIRICAL_WIN_RATES: Record<string, Record<string, number>> = {
  "deck_red_inferno": {
    "deck_blue_tempest": 73,
    "deck_purple_abyss": 54,
    "deck_green_wild": 56,
    "deck_gold_bastion": 44,
    "deck_dual_draconic_pact": 42,
    "deck_dual_abyssal_storm": 50,
    "deck_dual_primal_fury": 46,
    "deck_dual_arcane_forge": 19,
    "deck_dual_eternal_rot": 31,
    "deck_dual_blood_flame": 29,
    "deck_dual_wild_evolution": 60,
    "deck_dual_solar_wild": 33,
    "deck_dual_iron_inquisition": 31,
    "deck_dual_storm_dragon": 63,
    "deck_tri_arcane_cataclysm": 46,
    "deck_tri_primal_titans": 23,
    "deck_tri_eternal_reliquary": 25,
    "deck_tri_blood_moon": 29,
    "deck_tri_celestial_scales": 38,
    "deck_spec_chronomancer": 19,
    "deck_spec_pentachromatic": 48,
    "deck_tri_astral_cataclysm": 46,
    "deck_tri_primordial_forge": 23,
    "deck_tri_abyssal_chimera": 48,
    "deck_tri_crimson_sun": 33,
    "deck_tri_eternal_horizon": 38,
    "deck_squad_thousand_shields": 33,
    "deck_squad_siege_battery": 63,
    "deck_penta_valkyra_pact": 31,
    "deck_neutral_axial": 50,
    "deck_dual_red_neutral": 21,
    "deck_dual_blue_neutral": 40,
    "deck_dual_purple_neutral": 46,
    "deck_dual_green_neutral": 31,
    "deck_dual_gold_neutral": 27,
    "deck_tri_zenith_armada": 27,
    "deck_tri_tempest_primordial": 46,
    "deck_tri_eclipse_bastion": 38,
    "deck_penta_wheel_convergence": 29
  },
  "deck_blue_tempest": {
    "deck_red_inferno": 27,
    "deck_purple_abyss": 33,
    "deck_green_wild": 54,
    "deck_gold_bastion": 63,
    "deck_dual_draconic_pact": 40,
    "deck_dual_abyssal_storm": 44,
    "deck_dual_primal_fury": 35,
    "deck_dual_arcane_forge": 50,
    "deck_dual_eternal_rot": 38,
    "deck_dual_blood_flame": 33,
    "deck_dual_wild_evolution": 40,
    "deck_dual_solar_wild": 48,
    "deck_dual_iron_inquisition": 44,
    "deck_dual_storm_dragon": 31,
    "deck_tri_arcane_cataclysm": 58,
    "deck_tri_primal_titans": 56,
    "deck_tri_eternal_reliquary": 50,
    "deck_tri_blood_moon": 35,
    "deck_tri_celestial_scales": 44,
    "deck_spec_chronomancer": 50,
    "deck_spec_pentachromatic": 38,
    "deck_tri_astral_cataclysm": 58,
    "deck_tri_primordial_forge": 56,
    "deck_tri_abyssal_chimera": 33,
    "deck_tri_crimson_sun": 35,
    "deck_tri_eternal_horizon": 44,
    "deck_squad_thousand_shields": 48,
    "deck_squad_siege_battery": 31,
    "deck_penta_valkyra_pact": 54,
    "deck_neutral_axial": 52,
    "deck_dual_red_neutral": 15,
    "deck_dual_blue_neutral": 35,
    "deck_dual_purple_neutral": 31,
    "deck_dual_green_neutral": 31,
    "deck_dual_gold_neutral": 38,
    "deck_tri_zenith_armada": 27,
    "deck_tri_tempest_primordial": 38,
    "deck_tri_eclipse_bastion": 46,
    "deck_penta_wheel_convergence": 35
  },
  "deck_purple_abyss": {
    "deck_red_inferno": 46,
    "deck_blue_tempest": 67,
    "deck_green_wild": 31,
    "deck_gold_bastion": 42,
    "deck_dual_draconic_pact": 25,
    "deck_dual_abyssal_storm": 42,
    "deck_dual_primal_fury": 29,
    "deck_dual_arcane_forge": 33,
    "deck_dual_eternal_rot": 42,
    "deck_dual_blood_flame": 40,
    "deck_dual_wild_evolution": 25,
    "deck_dual_solar_wild": 38,
    "deck_dual_iron_inquisition": 17,
    "deck_dual_storm_dragon": 35,
    "deck_tri_arcane_cataclysm": 44,
    "deck_tri_primal_titans": 38,
    "deck_tri_eternal_reliquary": 38,
    "deck_tri_blood_moon": 23,
    "deck_tri_celestial_scales": 27,
    "deck_spec_chronomancer": 33,
    "deck_spec_pentachromatic": 23,
    "deck_tri_astral_cataclysm": 44,
    "deck_tri_primordial_forge": 38,
    "deck_tri_abyssal_chimera": 42,
    "deck_tri_crimson_sun": 31,
    "deck_tri_eternal_horizon": 27,
    "deck_squad_thousand_shields": 38,
    "deck_squad_siege_battery": 35,
    "deck_penta_valkyra_pact": 23,
    "deck_neutral_axial": 46,
    "deck_dual_red_neutral": 23,
    "deck_dual_blue_neutral": 23,
    "deck_dual_purple_neutral": 40,
    "deck_dual_green_neutral": 23,
    "deck_dual_gold_neutral": 29,
    "deck_tri_zenith_armada": 17,
    "deck_tri_tempest_primordial": 33,
    "deck_tri_eclipse_bastion": 25,
    "deck_penta_wheel_convergence": 40
  },
  "deck_green_wild": {
    "deck_red_inferno": 44,
    "deck_blue_tempest": 46,
    "deck_purple_abyss": 69,
    "deck_gold_bastion": 35,
    "deck_dual_draconic_pact": 19,
    "deck_dual_abyssal_storm": 31,
    "deck_dual_primal_fury": 29,
    "deck_dual_arcane_forge": 17,
    "deck_dual_eternal_rot": 40,
    "deck_dual_blood_flame": 46,
    "deck_dual_wild_evolution": 23,
    "deck_dual_solar_wild": 40,
    "deck_dual_iron_inquisition": 25,
    "deck_dual_storm_dragon": 31,
    "deck_tri_arcane_cataclysm": 50,
    "deck_tri_primal_titans": 23,
    "deck_tri_eternal_reliquary": 27,
    "deck_tri_blood_moon": 19,
    "deck_tri_celestial_scales": 35,
    "deck_spec_chronomancer": 17,
    "deck_spec_pentachromatic": 21,
    "deck_tri_astral_cataclysm": 50,
    "deck_tri_primordial_forge": 23,
    "deck_tri_abyssal_chimera": 29,
    "deck_tri_crimson_sun": 23,
    "deck_tri_eternal_horizon": 35,
    "deck_squad_thousand_shields": 40,
    "deck_squad_siege_battery": 31,
    "deck_penta_valkyra_pact": 38,
    "deck_neutral_axial": 38,
    "deck_dual_red_neutral": 15,
    "deck_dual_blue_neutral": 29,
    "deck_dual_purple_neutral": 44,
    "deck_dual_green_neutral": 27,
    "deck_dual_gold_neutral": 21,
    "deck_tri_zenith_armada": 17,
    "deck_tri_tempest_primordial": 29,
    "deck_tri_eclipse_bastion": 38,
    "deck_penta_wheel_convergence": 35
  },
  "deck_gold_bastion": {
    "deck_red_inferno": 56,
    "deck_blue_tempest": 38,
    "deck_purple_abyss": 58,
    "deck_green_wild": 65,
    "deck_dual_draconic_pact": 21,
    "deck_dual_abyssal_storm": 44,
    "deck_dual_primal_fury": 25,
    "deck_dual_arcane_forge": 35,
    "deck_dual_eternal_rot": 54,
    "deck_dual_blood_flame": 46,
    "deck_dual_wild_evolution": 19,
    "deck_dual_solar_wild": 35,
    "deck_dual_iron_inquisition": 44,
    "deck_dual_storm_dragon": 35,
    "deck_tri_arcane_cataclysm": 44,
    "deck_tri_primal_titans": 25,
    "deck_tri_eternal_reliquary": 23,
    "deck_tri_blood_moon": 25,
    "deck_tri_celestial_scales": 25,
    "deck_spec_chronomancer": 35,
    "deck_spec_pentachromatic": 29,
    "deck_tri_astral_cataclysm": 44,
    "deck_tri_primordial_forge": 25,
    "deck_tri_abyssal_chimera": 38,
    "deck_tri_crimson_sun": 35,
    "deck_tri_eternal_horizon": 25,
    "deck_squad_thousand_shields": 35,
    "deck_squad_siege_battery": 35,
    "deck_penta_valkyra_pact": 35,
    "deck_neutral_axial": 56,
    "deck_dual_red_neutral": 23,
    "deck_dual_blue_neutral": 42,
    "deck_dual_purple_neutral": 50,
    "deck_dual_green_neutral": 31,
    "deck_dual_gold_neutral": 23,
    "deck_tri_zenith_armada": 19,
    "deck_tri_tempest_primordial": 40,
    "deck_tri_eclipse_bastion": 27,
    "deck_penta_wheel_convergence": 33
  },
  "deck_dual_draconic_pact": {
    "deck_red_inferno": 58,
    "deck_blue_tempest": 60,
    "deck_purple_abyss": 75,
    "deck_green_wild": 81,
    "deck_gold_bastion": 79,
    "deck_dual_abyssal_storm": 65,
    "deck_dual_primal_fury": 46,
    "deck_dual_arcane_forge": 58,
    "deck_dual_eternal_rot": 54,
    "deck_dual_blood_flame": 58,
    "deck_dual_wild_evolution": 58,
    "deck_dual_solar_wild": 63,
    "deck_dual_iron_inquisition": 50,
    "deck_dual_storm_dragon": 56,
    "deck_tri_arcane_cataclysm": 54,
    "deck_tri_primal_titans": 65,
    "deck_tri_eternal_reliquary": 46,
    "deck_tri_blood_moon": 48,
    "deck_tri_celestial_scales": 73,
    "deck_spec_chronomancer": 58,
    "deck_spec_pentachromatic": 60,
    "deck_tri_astral_cataclysm": 54,
    "deck_tri_primordial_forge": 65,
    "deck_tri_abyssal_chimera": 56,
    "deck_tri_crimson_sun": 44,
    "deck_tri_eternal_horizon": 73,
    "deck_squad_thousand_shields": 63,
    "deck_squad_siege_battery": 56,
    "deck_penta_valkyra_pact": 54,
    "deck_neutral_axial": 83,
    "deck_dual_red_neutral": 48,
    "deck_dual_blue_neutral": 58,
    "deck_dual_purple_neutral": 75,
    "deck_dual_green_neutral": 35,
    "deck_dual_gold_neutral": 63,
    "deck_tri_zenith_armada": 54,
    "deck_tri_tempest_primordial": 54,
    "deck_tri_eclipse_bastion": 42,
    "deck_penta_wheel_convergence": 67
  },
  "deck_dual_abyssal_storm": {
    "deck_red_inferno": 50,
    "deck_blue_tempest": 56,
    "deck_purple_abyss": 58,
    "deck_green_wild": 69,
    "deck_gold_bastion": 56,
    "deck_dual_draconic_pact": 35,
    "deck_dual_primal_fury": 52,
    "deck_dual_arcane_forge": 56,
    "deck_dual_eternal_rot": 54,
    "deck_dual_blood_flame": 31,
    "deck_dual_wild_evolution": 54,
    "deck_dual_solar_wild": 56,
    "deck_dual_iron_inquisition": 60,
    "deck_dual_storm_dragon": 48,
    "deck_tri_arcane_cataclysm": 44,
    "deck_tri_primal_titans": 54,
    "deck_tri_eternal_reliquary": 50,
    "deck_tri_blood_moon": 17,
    "deck_tri_celestial_scales": 42,
    "deck_spec_chronomancer": 56,
    "deck_spec_pentachromatic": 54,
    "deck_tri_astral_cataclysm": 44,
    "deck_tri_primordial_forge": 54,
    "deck_tri_abyssal_chimera": 44,
    "deck_tri_crimson_sun": 40,
    "deck_tri_eternal_horizon": 42,
    "deck_squad_thousand_shields": 56,
    "deck_squad_siege_battery": 48,
    "deck_penta_valkyra_pact": 50,
    "deck_neutral_axial": 54,
    "deck_dual_red_neutral": 19,
    "deck_dual_blue_neutral": 33,
    "deck_dual_purple_neutral": 33,
    "deck_dual_green_neutral": 44,
    "deck_dual_gold_neutral": 52,
    "deck_tri_zenith_armada": 35,
    "deck_tri_tempest_primordial": 46,
    "deck_tri_eclipse_bastion": 40,
    "deck_penta_wheel_convergence": 40
  },
  "deck_dual_primal_fury": {
    "deck_red_inferno": 54,
    "deck_blue_tempest": 65,
    "deck_purple_abyss": 71,
    "deck_green_wild": 71,
    "deck_gold_bastion": 75,
    "deck_dual_draconic_pact": 54,
    "deck_dual_abyssal_storm": 48,
    "deck_dual_arcane_forge": 44,
    "deck_dual_eternal_rot": 56,
    "deck_dual_blood_flame": 69,
    "deck_dual_wild_evolution": 56,
    "deck_dual_solar_wild": 67,
    "deck_dual_iron_inquisition": 56,
    "deck_dual_storm_dragon": 67,
    "deck_tri_arcane_cataclysm": 35,
    "deck_tri_primal_titans": 48,
    "deck_tri_eternal_reliquary": 60,
    "deck_tri_blood_moon": 44,
    "deck_tri_celestial_scales": 58,
    "deck_spec_chronomancer": 44,
    "deck_spec_pentachromatic": 56,
    "deck_tri_astral_cataclysm": 35,
    "deck_tri_primordial_forge": 48,
    "deck_tri_abyssal_chimera": 67,
    "deck_tri_crimson_sun": 56,
    "deck_tri_eternal_horizon": 58,
    "deck_squad_thousand_shields": 67,
    "deck_squad_siege_battery": 67,
    "deck_penta_valkyra_pact": 54,
    "deck_neutral_axial": 65,
    "deck_dual_red_neutral": 35,
    "deck_dual_blue_neutral": 54,
    "deck_dual_purple_neutral": 67,
    "deck_dual_green_neutral": 52,
    "deck_dual_gold_neutral": 63,
    "deck_tri_zenith_armada": 33,
    "deck_tri_tempest_primordial": 40,
    "deck_tri_eclipse_bastion": 56,
    "deck_penta_wheel_convergence": 58
  },
  "deck_dual_arcane_forge": {
    "deck_red_inferno": 81,
    "deck_blue_tempest": 50,
    "deck_purple_abyss": 67,
    "deck_green_wild": 83,
    "deck_gold_bastion": 65,
    "deck_dual_draconic_pact": 42,
    "deck_dual_abyssal_storm": 44,
    "deck_dual_primal_fury": 56,
    "deck_dual_eternal_rot": 54,
    "deck_dual_blood_flame": 79,
    "deck_dual_wild_evolution": 33,
    "deck_dual_solar_wild": 56,
    "deck_dual_iron_inquisition": 60,
    "deck_dual_storm_dragon": 58,
    "deck_tri_arcane_cataclysm": 48,
    "deck_tri_primal_titans": 56,
    "deck_tri_eternal_reliquary": 63,
    "deck_tri_blood_moon": 40,
    "deck_tri_celestial_scales": 52,
    "deck_spec_chronomancer": 50,
    "deck_spec_pentachromatic": 42,
    "deck_tri_astral_cataclysm": 48,
    "deck_tri_primordial_forge": 56,
    "deck_tri_abyssal_chimera": 65,
    "deck_tri_crimson_sun": 33,
    "deck_tri_eternal_horizon": 52,
    "deck_squad_thousand_shields": 56,
    "deck_squad_siege_battery": 58,
    "deck_penta_valkyra_pact": 42,
    "deck_neutral_axial": 67,
    "deck_dual_red_neutral": 40,
    "deck_dual_blue_neutral": 31,
    "deck_dual_purple_neutral": 69,
    "deck_dual_green_neutral": 27,
    "deck_dual_gold_neutral": 56,
    "deck_tri_zenith_armada": 25,
    "deck_tri_tempest_primordial": 33,
    "deck_tri_eclipse_bastion": 58,
    "deck_penta_wheel_convergence": 50
  },
  "deck_dual_eternal_rot": {
    "deck_red_inferno": 69,
    "deck_blue_tempest": 63,
    "deck_purple_abyss": 58,
    "deck_green_wild": 60,
    "deck_gold_bastion": 46,
    "deck_dual_draconic_pact": 46,
    "deck_dual_abyssal_storm": 46,
    "deck_dual_primal_fury": 44,
    "deck_dual_arcane_forge": 46,
    "deck_dual_blood_flame": 63,
    "deck_dual_wild_evolution": 38,
    "deck_dual_solar_wild": 50,
    "deck_dual_iron_inquisition": 48,
    "deck_dual_storm_dragon": 46,
    "deck_tri_arcane_cataclysm": 44,
    "deck_tri_primal_titans": 52,
    "deck_tri_eternal_reliquary": 46,
    "deck_tri_blood_moon": 25,
    "deck_tri_celestial_scales": 40,
    "deck_spec_chronomancer": 46,
    "deck_spec_pentachromatic": 38,
    "deck_tri_astral_cataclysm": 44,
    "deck_tri_primordial_forge": 52,
    "deck_tri_abyssal_chimera": 52,
    "deck_tri_crimson_sun": 40,
    "deck_tri_eternal_horizon": 40,
    "deck_squad_thousand_shields": 50,
    "deck_squad_siege_battery": 46,
    "deck_penta_valkyra_pact": 27,
    "deck_neutral_axial": 63,
    "deck_dual_red_neutral": 33,
    "deck_dual_blue_neutral": 48,
    "deck_dual_purple_neutral": 56,
    "deck_dual_green_neutral": 29,
    "deck_dual_gold_neutral": 35,
    "deck_tri_zenith_armada": 21,
    "deck_tri_tempest_primordial": 46,
    "deck_tri_eclipse_bastion": 52,
    "deck_penta_wheel_convergence": 48
  },
  "deck_dual_blood_flame": {
    "deck_red_inferno": 71,
    "deck_blue_tempest": 67,
    "deck_purple_abyss": 60,
    "deck_green_wild": 54,
    "deck_gold_bastion": 54,
    "deck_dual_draconic_pact": 42,
    "deck_dual_abyssal_storm": 69,
    "deck_dual_primal_fury": 31,
    "deck_dual_arcane_forge": 21,
    "deck_dual_eternal_rot": 38,
    "deck_dual_wild_evolution": 54,
    "deck_dual_solar_wild": 44,
    "deck_dual_iron_inquisition": 33,
    "deck_dual_storm_dragon": 60,
    "deck_tri_arcane_cataclysm": 58,
    "deck_tri_primal_titans": 42,
    "deck_tri_eternal_reliquary": 48,
    "deck_tri_blood_moon": 33,
    "deck_tri_celestial_scales": 44,
    "deck_spec_chronomancer": 21,
    "deck_spec_pentachromatic": 44,
    "deck_tri_astral_cataclysm": 58,
    "deck_tri_primordial_forge": 42,
    "deck_tri_abyssal_chimera": 50,
    "deck_tri_crimson_sun": 25,
    "deck_tri_eternal_horizon": 44,
    "deck_squad_thousand_shields": 44,
    "deck_squad_siege_battery": 60,
    "deck_penta_valkyra_pact": 42,
    "deck_neutral_axial": 54,
    "deck_dual_red_neutral": 35,
    "deck_dual_blue_neutral": 46,
    "deck_dual_purple_neutral": 56,
    "deck_dual_green_neutral": 31,
    "deck_dual_gold_neutral": 38,
    "deck_tri_zenith_armada": 23,
    "deck_tri_tempest_primordial": 56,
    "deck_tri_eclipse_bastion": 31,
    "deck_penta_wheel_convergence": 44
  },
  "deck_dual_wild_evolution": {
    "deck_red_inferno": 40,
    "deck_blue_tempest": 60,
    "deck_purple_abyss": 75,
    "deck_green_wild": 77,
    "deck_gold_bastion": 81,
    "deck_dual_draconic_pact": 42,
    "deck_dual_abyssal_storm": 46,
    "deck_dual_primal_fury": 44,
    "deck_dual_arcane_forge": 67,
    "deck_dual_eternal_rot": 63,
    "deck_dual_blood_flame": 46,
    "deck_dual_solar_wild": 56,
    "deck_dual_iron_inquisition": 48,
    "deck_dual_storm_dragon": 48,
    "deck_tri_arcane_cataclysm": 50,
    "deck_tri_primal_titans": 50,
    "deck_tri_eternal_reliquary": 63,
    "deck_tri_blood_moon": 27,
    "deck_tri_celestial_scales": 52,
    "deck_spec_chronomancer": 67,
    "deck_spec_pentachromatic": 40,
    "deck_tri_astral_cataclysm": 50,
    "deck_tri_primordial_forge": 50,
    "deck_tri_abyssal_chimera": 58,
    "deck_tri_crimson_sun": 29,
    "deck_tri_eternal_horizon": 52,
    "deck_squad_thousand_shields": 56,
    "deck_squad_siege_battery": 48,
    "deck_penta_valkyra_pact": 54,
    "deck_neutral_axial": 63,
    "deck_dual_red_neutral": 25,
    "deck_dual_blue_neutral": 46,
    "deck_dual_purple_neutral": 50,
    "deck_dual_green_neutral": 46,
    "deck_dual_gold_neutral": 63,
    "deck_tri_zenith_armada": 29,
    "deck_tri_tempest_primordial": 44,
    "deck_tri_eclipse_bastion": 60,
    "deck_penta_wheel_convergence": 58
  },
  "deck_dual_solar_wild": {
    "deck_red_inferno": 67,
    "deck_blue_tempest": 52,
    "deck_purple_abyss": 63,
    "deck_green_wild": 60,
    "deck_gold_bastion": 65,
    "deck_dual_draconic_pact": 38,
    "deck_dual_abyssal_storm": 44,
    "deck_dual_primal_fury": 33,
    "deck_dual_arcane_forge": 44,
    "deck_dual_eternal_rot": 50,
    "deck_dual_blood_flame": 56,
    "deck_dual_wild_evolution": 44,
    "deck_dual_iron_inquisition": 38,
    "deck_dual_storm_dragon": 60,
    "deck_tri_arcane_cataclysm": 40,
    "deck_tri_primal_titans": 27,
    "deck_tri_eternal_reliquary": 46,
    "deck_tri_blood_moon": 29,
    "deck_tri_celestial_scales": 40,
    "deck_spec_chronomancer": 44,
    "deck_spec_pentachromatic": 44,
    "deck_tri_astral_cataclysm": 40,
    "deck_tri_primordial_forge": 27,
    "deck_tri_abyssal_chimera": 54,
    "deck_tri_crimson_sun": 33,
    "deck_tri_eternal_horizon": 40,
    "deck_squad_thousand_shields": 50,
    "deck_squad_siege_battery": 60,
    "deck_penta_valkyra_pact": 44,
    "deck_neutral_axial": 65,
    "deck_dual_red_neutral": 21,
    "deck_dual_blue_neutral": 40,
    "deck_dual_purple_neutral": 63,
    "deck_dual_green_neutral": 40,
    "deck_dual_gold_neutral": 40,
    "deck_tri_zenith_armada": 38,
    "deck_tri_tempest_primordial": 40,
    "deck_tri_eclipse_bastion": 46,
    "deck_penta_wheel_convergence": 40
  },
  "deck_dual_iron_inquisition": {
    "deck_red_inferno": 69,
    "deck_blue_tempest": 56,
    "deck_purple_abyss": 83,
    "deck_green_wild": 75,
    "deck_gold_bastion": 56,
    "deck_dual_draconic_pact": 50,
    "deck_dual_abyssal_storm": 40,
    "deck_dual_primal_fury": 44,
    "deck_dual_arcane_forge": 40,
    "deck_dual_eternal_rot": 52,
    "deck_dual_blood_flame": 67,
    "deck_dual_wild_evolution": 52,
    "deck_dual_solar_wild": 63,
    "deck_dual_storm_dragon": 52,
    "deck_tri_arcane_cataclysm": 58,
    "deck_tri_primal_titans": 42,
    "deck_tri_eternal_reliquary": 65,
    "deck_tri_blood_moon": 40,
    "deck_tri_celestial_scales": 33,
    "deck_spec_chronomancer": 40,
    "deck_spec_pentachromatic": 44,
    "deck_tri_astral_cataclysm": 58,
    "deck_tri_primordial_forge": 42,
    "deck_tri_abyssal_chimera": 54,
    "deck_tri_crimson_sun": 48,
    "deck_tri_eternal_horizon": 33,
    "deck_squad_thousand_shields": 63,
    "deck_squad_siege_battery": 52,
    "deck_penta_valkyra_pact": 44,
    "deck_neutral_axial": 79,
    "deck_dual_red_neutral": 38,
    "deck_dual_blue_neutral": 48,
    "deck_dual_purple_neutral": 63,
    "deck_dual_green_neutral": 44,
    "deck_dual_gold_neutral": 35,
    "deck_tri_zenith_armada": 23,
    "deck_tri_tempest_primordial": 35,
    "deck_tri_eclipse_bastion": 48,
    "deck_penta_wheel_convergence": 40
  },
  "deck_dual_storm_dragon": {
    "deck_red_inferno": 38,
    "deck_blue_tempest": 69,
    "deck_purple_abyss": 65,
    "deck_green_wild": 69,
    "deck_gold_bastion": 65,
    "deck_dual_draconic_pact": 44,
    "deck_dual_abyssal_storm": 52,
    "deck_dual_primal_fury": 33,
    "deck_dual_arcane_forge": 42,
    "deck_dual_eternal_rot": 54,
    "deck_dual_blood_flame": 40,
    "deck_dual_wild_evolution": 52,
    "deck_dual_solar_wild": 40,
    "deck_dual_iron_inquisition": 48,
    "deck_tri_arcane_cataclysm": 54,
    "deck_tri_primal_titans": 50,
    "deck_tri_eternal_reliquary": 48,
    "deck_tri_blood_moon": 27,
    "deck_tri_celestial_scales": 46,
    "deck_spec_chronomancer": 42,
    "deck_spec_pentachromatic": 42,
    "deck_tri_astral_cataclysm": 54,
    "deck_tri_primordial_forge": 50,
    "deck_tri_abyssal_chimera": 56,
    "deck_tri_crimson_sun": 40,
    "deck_tri_eternal_horizon": 46,
    "deck_squad_thousand_shields": 40,
    "deck_squad_siege_battery": 50,
    "deck_penta_valkyra_pact": 46,
    "deck_neutral_axial": 44,
    "deck_dual_red_neutral": 35,
    "deck_dual_blue_neutral": 48,
    "deck_dual_purple_neutral": 58,
    "deck_dual_green_neutral": 54,
    "deck_dual_gold_neutral": 46,
    "deck_tri_zenith_armada": 31,
    "deck_tri_tempest_primordial": 44,
    "deck_tri_eclipse_bastion": 58,
    "deck_penta_wheel_convergence": 63
  },
  "deck_tri_arcane_cataclysm": {
    "deck_red_inferno": 54,
    "deck_blue_tempest": 42,
    "deck_purple_abyss": 56,
    "deck_green_wild": 50,
    "deck_gold_bastion": 56,
    "deck_dual_draconic_pact": 46,
    "deck_dual_abyssal_storm": 56,
    "deck_dual_primal_fury": 65,
    "deck_dual_arcane_forge": 52,
    "deck_dual_eternal_rot": 56,
    "deck_dual_blood_flame": 42,
    "deck_dual_wild_evolution": 50,
    "deck_dual_solar_wild": 60,
    "deck_dual_iron_inquisition": 42,
    "deck_dual_storm_dragon": 46,
    "deck_tri_primal_titans": 52,
    "deck_tri_eternal_reliquary": 42,
    "deck_tri_blood_moon": 35,
    "deck_tri_celestial_scales": 48,
    "deck_spec_chronomancer": 52,
    "deck_spec_pentachromatic": 38,
    "deck_tri_astral_cataclysm": 50,
    "deck_tri_primordial_forge": 52,
    "deck_tri_abyssal_chimera": 44,
    "deck_tri_crimson_sun": 33,
    "deck_tri_eternal_horizon": 48,
    "deck_squad_thousand_shields": 60,
    "deck_squad_siege_battery": 46,
    "deck_penta_valkyra_pact": 35,
    "deck_neutral_axial": 56,
    "deck_dual_red_neutral": 25,
    "deck_dual_blue_neutral": 42,
    "deck_dual_purple_neutral": 50,
    "deck_dual_green_neutral": 38,
    "deck_dual_gold_neutral": 50,
    "deck_tri_zenith_armada": 29,
    "deck_tri_tempest_primordial": 40,
    "deck_tri_eclipse_bastion": 44,
    "deck_penta_wheel_convergence": 42
  },
  "deck_tri_primal_titans": {
    "deck_red_inferno": 77,
    "deck_blue_tempest": 44,
    "deck_purple_abyss": 63,
    "deck_green_wild": 77,
    "deck_gold_bastion": 75,
    "deck_dual_draconic_pact": 35,
    "deck_dual_abyssal_storm": 46,
    "deck_dual_primal_fury": 52,
    "deck_dual_arcane_forge": 44,
    "deck_dual_eternal_rot": 48,
    "deck_dual_blood_flame": 58,
    "deck_dual_wild_evolution": 50,
    "deck_dual_solar_wild": 73,
    "deck_dual_iron_inquisition": 58,
    "deck_dual_storm_dragon": 50,
    "deck_tri_arcane_cataclysm": 48,
    "deck_tri_eternal_reliquary": 52,
    "deck_tri_blood_moon": 35,
    "deck_tri_celestial_scales": 52,
    "deck_spec_chronomancer": 44,
    "deck_spec_pentachromatic": 56,
    "deck_tri_astral_cataclysm": 48,
    "deck_tri_primordial_forge": 50,
    "deck_tri_abyssal_chimera": 65,
    "deck_tri_crimson_sun": 35,
    "deck_tri_eternal_horizon": 52,
    "deck_squad_thousand_shields": 73,
    "deck_squad_siege_battery": 50,
    "deck_penta_valkyra_pact": 42,
    "deck_neutral_axial": 71,
    "deck_dual_red_neutral": 31,
    "deck_dual_blue_neutral": 46,
    "deck_dual_purple_neutral": 71,
    "deck_dual_green_neutral": 46,
    "deck_dual_gold_neutral": 52,
    "deck_tri_zenith_armada": 31,
    "deck_tri_tempest_primordial": 38,
    "deck_tri_eclipse_bastion": 40,
    "deck_penta_wheel_convergence": 48
  },
  "deck_tri_eternal_reliquary": {
    "deck_red_inferno": 75,
    "deck_blue_tempest": 50,
    "deck_purple_abyss": 63,
    "deck_green_wild": 73,
    "deck_gold_bastion": 77,
    "deck_dual_draconic_pact": 54,
    "deck_dual_abyssal_storm": 50,
    "deck_dual_primal_fury": 40,
    "deck_dual_arcane_forge": 38,
    "deck_dual_eternal_rot": 54,
    "deck_dual_blood_flame": 52,
    "deck_dual_wild_evolution": 38,
    "deck_dual_solar_wild": 54,
    "deck_dual_iron_inquisition": 35,
    "deck_dual_storm_dragon": 52,
    "deck_tri_arcane_cataclysm": 58,
    "deck_tri_primal_titans": 48,
    "deck_tri_blood_moon": 48,
    "deck_tri_celestial_scales": 31,
    "deck_spec_chronomancer": 38,
    "deck_spec_pentachromatic": 46,
    "deck_tri_astral_cataclysm": 58,
    "deck_tri_primordial_forge": 48,
    "deck_tri_abyssal_chimera": 60,
    "deck_tri_crimson_sun": 40,
    "deck_tri_eternal_horizon": 31,
    "deck_squad_thousand_shields": 54,
    "deck_squad_siege_battery": 52,
    "deck_penta_valkyra_pact": 44,
    "deck_neutral_axial": 63,
    "deck_dual_red_neutral": 40,
    "deck_dual_blue_neutral": 38,
    "deck_dual_purple_neutral": 58,
    "deck_dual_green_neutral": 35,
    "deck_dual_gold_neutral": 44,
    "deck_tri_zenith_armada": 33,
    "deck_tri_tempest_primordial": 52,
    "deck_tri_eclipse_bastion": 31,
    "deck_penta_wheel_convergence": 38
  },
  "deck_tri_blood_moon": {
    "deck_red_inferno": 71,
    "deck_blue_tempest": 65,
    "deck_purple_abyss": 77,
    "deck_green_wild": 81,
    "deck_gold_bastion": 75,
    "deck_dual_draconic_pact": 52,
    "deck_dual_abyssal_storm": 83,
    "deck_dual_primal_fury": 56,
    "deck_dual_arcane_forge": 60,
    "deck_dual_eternal_rot": 75,
    "deck_dual_blood_flame": 67,
    "deck_dual_wild_evolution": 73,
    "deck_dual_solar_wild": 71,
    "deck_dual_iron_inquisition": 60,
    "deck_dual_storm_dragon": 73,
    "deck_tri_arcane_cataclysm": 65,
    "deck_tri_primal_titans": 65,
    "deck_tri_eternal_reliquary": 52,
    "deck_tri_celestial_scales": 56,
    "deck_spec_chronomancer": 60,
    "deck_spec_pentachromatic": 48,
    "deck_tri_astral_cataclysm": 65,
    "deck_tri_primordial_forge": 65,
    "deck_tri_abyssal_chimera": 73,
    "deck_tri_crimson_sun": 48,
    "deck_tri_eternal_horizon": 56,
    "deck_squad_thousand_shields": 71,
    "deck_squad_siege_battery": 73,
    "deck_penta_valkyra_pact": 69,
    "deck_neutral_axial": 81,
    "deck_dual_red_neutral": 48,
    "deck_dual_blue_neutral": 58,
    "deck_dual_purple_neutral": 69,
    "deck_dual_green_neutral": 67,
    "deck_dual_gold_neutral": 46,
    "deck_tri_zenith_armada": 56,
    "deck_tri_tempest_primordial": 65,
    "deck_tri_eclipse_bastion": 44,
    "deck_penta_wheel_convergence": 52
  },
  "deck_tri_celestial_scales": {
    "deck_red_inferno": 63,
    "deck_blue_tempest": 56,
    "deck_purple_abyss": 73,
    "deck_green_wild": 65,
    "deck_gold_bastion": 75,
    "deck_dual_draconic_pact": 27,
    "deck_dual_abyssal_storm": 58,
    "deck_dual_primal_fury": 42,
    "deck_dual_arcane_forge": 48,
    "deck_dual_eternal_rot": 60,
    "deck_dual_blood_flame": 56,
    "deck_dual_wild_evolution": 48,
    "deck_dual_solar_wild": 60,
    "deck_dual_iron_inquisition": 67,
    "deck_dual_storm_dragon": 54,
    "deck_tri_arcane_cataclysm": 52,
    "deck_tri_primal_titans": 48,
    "deck_tri_eternal_reliquary": 69,
    "deck_tri_blood_moon": 44,
    "deck_spec_chronomancer": 48,
    "deck_spec_pentachromatic": 48,
    "deck_tri_astral_cataclysm": 52,
    "deck_tri_primordial_forge": 48,
    "deck_tri_abyssal_chimera": 67,
    "deck_tri_crimson_sun": 50,
    "deck_tri_eternal_horizon": 50,
    "deck_squad_thousand_shields": 60,
    "deck_squad_siege_battery": 54,
    "deck_penta_valkyra_pact": 40,
    "deck_neutral_axial": 69,
    "deck_dual_red_neutral": 40,
    "deck_dual_blue_neutral": 50,
    "deck_dual_purple_neutral": 54,
    "deck_dual_green_neutral": 40,
    "deck_dual_gold_neutral": 54,
    "deck_tri_zenith_armada": 31,
    "deck_tri_tempest_primordial": 29,
    "deck_tri_eclipse_bastion": 48,
    "deck_penta_wheel_convergence": 50
  },
  "deck_spec_chronomancer": {
    "deck_red_inferno": 81,
    "deck_blue_tempest": 50,
    "deck_purple_abyss": 67,
    "deck_green_wild": 83,
    "deck_gold_bastion": 65,
    "deck_dual_draconic_pact": 42,
    "deck_dual_abyssal_storm": 44,
    "deck_dual_primal_fury": 56,
    "deck_dual_arcane_forge": 50,
    "deck_dual_eternal_rot": 54,
    "deck_dual_blood_flame": 79,
    "deck_dual_wild_evolution": 33,
    "deck_dual_solar_wild": 56,
    "deck_dual_iron_inquisition": 60,
    "deck_dual_storm_dragon": 58,
    "deck_tri_arcane_cataclysm": 48,
    "deck_tri_primal_titans": 56,
    "deck_tri_eternal_reliquary": 63,
    "deck_tri_blood_moon": 40,
    "deck_tri_celestial_scales": 52,
    "deck_spec_pentachromatic": 42,
    "deck_tri_astral_cataclysm": 48,
    "deck_tri_primordial_forge": 56,
    "deck_tri_abyssal_chimera": 65,
    "deck_tri_crimson_sun": 33,
    "deck_tri_eternal_horizon": 52,
    "deck_squad_thousand_shields": 56,
    "deck_squad_siege_battery": 58,
    "deck_penta_valkyra_pact": 42,
    "deck_neutral_axial": 67,
    "deck_dual_red_neutral": 40,
    "deck_dual_blue_neutral": 31,
    "deck_dual_purple_neutral": 69,
    "deck_dual_green_neutral": 27,
    "deck_dual_gold_neutral": 56,
    "deck_tri_zenith_armada": 25,
    "deck_tri_tempest_primordial": 33,
    "deck_tri_eclipse_bastion": 58,
    "deck_penta_wheel_convergence": 50
  },
  "deck_spec_pentachromatic": {
    "deck_red_inferno": 52,
    "deck_blue_tempest": 63,
    "deck_purple_abyss": 77,
    "deck_green_wild": 79,
    "deck_gold_bastion": 71,
    "deck_dual_draconic_pact": 40,
    "deck_dual_abyssal_storm": 46,
    "deck_dual_primal_fury": 44,
    "deck_dual_arcane_forge": 58,
    "deck_dual_eternal_rot": 63,
    "deck_dual_blood_flame": 56,
    "deck_dual_wild_evolution": 60,
    "deck_dual_solar_wild": 56,
    "deck_dual_iron_inquisition": 56,
    "deck_dual_storm_dragon": 58,
    "deck_tri_arcane_cataclysm": 63,
    "deck_tri_primal_titans": 44,
    "deck_tri_eternal_reliquary": 54,
    "deck_tri_blood_moon": 52,
    "deck_tri_celestial_scales": 52,
    "deck_spec_chronomancer": 58,
    "deck_tri_astral_cataclysm": 63,
    "deck_tri_primordial_forge": 44,
    "deck_tri_abyssal_chimera": 71,
    "deck_tri_crimson_sun": 42,
    "deck_tri_eternal_horizon": 52,
    "deck_squad_thousand_shields": 56,
    "deck_squad_siege_battery": 58,
    "deck_penta_valkyra_pact": 50,
    "deck_neutral_axial": 65,
    "deck_dual_red_neutral": 40,
    "deck_dual_blue_neutral": 56,
    "deck_dual_purple_neutral": 60,
    "deck_dual_green_neutral": 44,
    "deck_dual_gold_neutral": 58,
    "deck_tri_zenith_armada": 29,
    "deck_tri_tempest_primordial": 50,
    "deck_tri_eclipse_bastion": 56,
    "deck_penta_wheel_convergence": 54
  },
  "deck_tri_astral_cataclysm": {
    "deck_red_inferno": 54,
    "deck_blue_tempest": 42,
    "deck_purple_abyss": 56,
    "deck_green_wild": 50,
    "deck_gold_bastion": 56,
    "deck_dual_draconic_pact": 46,
    "deck_dual_abyssal_storm": 56,
    "deck_dual_primal_fury": 65,
    "deck_dual_arcane_forge": 52,
    "deck_dual_eternal_rot": 56,
    "deck_dual_blood_flame": 42,
    "deck_dual_wild_evolution": 50,
    "deck_dual_solar_wild": 60,
    "deck_dual_iron_inquisition": 42,
    "deck_dual_storm_dragon": 46,
    "deck_tri_arcane_cataclysm": 50,
    "deck_tri_primal_titans": 52,
    "deck_tri_eternal_reliquary": 42,
    "deck_tri_blood_moon": 35,
    "deck_tri_celestial_scales": 48,
    "deck_spec_chronomancer": 52,
    "deck_spec_pentachromatic": 38,
    "deck_tri_primordial_forge": 52,
    "deck_tri_abyssal_chimera": 44,
    "deck_tri_crimson_sun": 33,
    "deck_tri_eternal_horizon": 48,
    "deck_squad_thousand_shields": 60,
    "deck_squad_siege_battery": 46,
    "deck_penta_valkyra_pact": 35,
    "deck_neutral_axial": 56,
    "deck_dual_red_neutral": 25,
    "deck_dual_blue_neutral": 42,
    "deck_dual_purple_neutral": 50,
    "deck_dual_green_neutral": 38,
    "deck_dual_gold_neutral": 50,
    "deck_tri_zenith_armada": 29,
    "deck_tri_tempest_primordial": 40,
    "deck_tri_eclipse_bastion": 44,
    "deck_penta_wheel_convergence": 42
  },
  "deck_tri_primordial_forge": {
    "deck_red_inferno": 77,
    "deck_blue_tempest": 44,
    "deck_purple_abyss": 63,
    "deck_green_wild": 77,
    "deck_gold_bastion": 75,
    "deck_dual_draconic_pact": 35,
    "deck_dual_abyssal_storm": 46,
    "deck_dual_primal_fury": 52,
    "deck_dual_arcane_forge": 44,
    "deck_dual_eternal_rot": 48,
    "deck_dual_blood_flame": 58,
    "deck_dual_wild_evolution": 50,
    "deck_dual_solar_wild": 73,
    "deck_dual_iron_inquisition": 58,
    "deck_dual_storm_dragon": 50,
    "deck_tri_arcane_cataclysm": 48,
    "deck_tri_primal_titans": 50,
    "deck_tri_eternal_reliquary": 52,
    "deck_tri_blood_moon": 35,
    "deck_tri_celestial_scales": 52,
    "deck_spec_chronomancer": 44,
    "deck_spec_pentachromatic": 56,
    "deck_tri_astral_cataclysm": 48,
    "deck_tri_abyssal_chimera": 65,
    "deck_tri_crimson_sun": 35,
    "deck_tri_eternal_horizon": 52,
    "deck_squad_thousand_shields": 73,
    "deck_squad_siege_battery": 50,
    "deck_penta_valkyra_pact": 42,
    "deck_neutral_axial": 71,
    "deck_dual_red_neutral": 31,
    "deck_dual_blue_neutral": 46,
    "deck_dual_purple_neutral": 71,
    "deck_dual_green_neutral": 46,
    "deck_dual_gold_neutral": 52,
    "deck_tri_zenith_armada": 31,
    "deck_tri_tempest_primordial": 38,
    "deck_tri_eclipse_bastion": 40,
    "deck_penta_wheel_convergence": 48
  },
  "deck_tri_abyssal_chimera": {
    "deck_red_inferno": 52,
    "deck_blue_tempest": 67,
    "deck_purple_abyss": 58,
    "deck_green_wild": 71,
    "deck_gold_bastion": 63,
    "deck_dual_draconic_pact": 44,
    "deck_dual_abyssal_storm": 56,
    "deck_dual_primal_fury": 33,
    "deck_dual_arcane_forge": 35,
    "deck_dual_eternal_rot": 48,
    "deck_dual_blood_flame": 50,
    "deck_dual_wild_evolution": 42,
    "deck_dual_solar_wild": 46,
    "deck_dual_iron_inquisition": 46,
    "deck_dual_storm_dragon": 44,
    "deck_tri_arcane_cataclysm": 56,
    "deck_tri_primal_titans": 35,
    "deck_tri_eternal_reliquary": 40,
    "deck_tri_blood_moon": 27,
    "deck_tri_celestial_scales": 33,
    "deck_spec_chronomancer": 35,
    "deck_spec_pentachromatic": 29,
    "deck_tri_astral_cataclysm": 56,
    "deck_tri_primordial_forge": 35,
    "deck_tri_crimson_sun": 33,
    "deck_tri_eternal_horizon": 33,
    "deck_squad_thousand_shields": 46,
    "deck_squad_siege_battery": 44,
    "deck_penta_valkyra_pact": 44,
    "deck_neutral_axial": 75,
    "deck_dual_red_neutral": 23,
    "deck_dual_blue_neutral": 46,
    "deck_dual_purple_neutral": 42,
    "deck_dual_green_neutral": 29,
    "deck_dual_gold_neutral": 50,
    "deck_tri_zenith_armada": 31,
    "deck_tri_tempest_primordial": 40,
    "deck_tri_eclipse_bastion": 50,
    "deck_penta_wheel_convergence": 40
  },
  "deck_tri_crimson_sun": {
    "deck_red_inferno": 67,
    "deck_blue_tempest": 65,
    "deck_purple_abyss": 69,
    "deck_green_wild": 77,
    "deck_gold_bastion": 65,
    "deck_dual_draconic_pact": 56,
    "deck_dual_abyssal_storm": 60,
    "deck_dual_primal_fury": 44,
    "deck_dual_arcane_forge": 67,
    "deck_dual_eternal_rot": 60,
    "deck_dual_blood_flame": 75,
    "deck_dual_wild_evolution": 71,
    "deck_dual_solar_wild": 67,
    "deck_dual_iron_inquisition": 52,
    "deck_dual_storm_dragon": 60,
    "deck_tri_arcane_cataclysm": 67,
    "deck_tri_primal_titans": 65,
    "deck_tri_eternal_reliquary": 60,
    "deck_tri_blood_moon": 52,
    "deck_tri_celestial_scales": 50,
    "deck_spec_chronomancer": 67,
    "deck_spec_pentachromatic": 58,
    "deck_tri_astral_cataclysm": 67,
    "deck_tri_primordial_forge": 65,
    "deck_tri_abyssal_chimera": 67,
    "deck_tri_eternal_horizon": 50,
    "deck_squad_thousand_shields": 67,
    "deck_squad_siege_battery": 60,
    "deck_penta_valkyra_pact": 69,
    "deck_neutral_axial": 73,
    "deck_dual_red_neutral": 35,
    "deck_dual_blue_neutral": 75,
    "deck_dual_purple_neutral": 71,
    "deck_dual_green_neutral": 60,
    "deck_dual_gold_neutral": 63,
    "deck_tri_zenith_armada": 46,
    "deck_tri_tempest_primordial": 60,
    "deck_tri_eclipse_bastion": 46,
    "deck_penta_wheel_convergence": 56
  },
  "deck_tri_eternal_horizon": {
    "deck_red_inferno": 63,
    "deck_blue_tempest": 56,
    "deck_purple_abyss": 73,
    "deck_green_wild": 65,
    "deck_gold_bastion": 75,
    "deck_dual_draconic_pact": 27,
    "deck_dual_abyssal_storm": 58,
    "deck_dual_primal_fury": 42,
    "deck_dual_arcane_forge": 48,
    "deck_dual_eternal_rot": 60,
    "deck_dual_blood_flame": 56,
    "deck_dual_wild_evolution": 48,
    "deck_dual_solar_wild": 60,
    "deck_dual_iron_inquisition": 67,
    "deck_dual_storm_dragon": 54,
    "deck_tri_arcane_cataclysm": 52,
    "deck_tri_primal_titans": 48,
    "deck_tri_eternal_reliquary": 69,
    "deck_tri_blood_moon": 44,
    "deck_tri_celestial_scales": 50,
    "deck_spec_chronomancer": 48,
    "deck_spec_pentachromatic": 48,
    "deck_tri_astral_cataclysm": 52,
    "deck_tri_primordial_forge": 48,
    "deck_tri_abyssal_chimera": 67,
    "deck_tri_crimson_sun": 50,
    "deck_squad_thousand_shields": 60,
    "deck_squad_siege_battery": 54,
    "deck_penta_valkyra_pact": 40,
    "deck_neutral_axial": 69,
    "deck_dual_red_neutral": 40,
    "deck_dual_blue_neutral": 50,
    "deck_dual_purple_neutral": 54,
    "deck_dual_green_neutral": 40,
    "deck_dual_gold_neutral": 54,
    "deck_tri_zenith_armada": 31,
    "deck_tri_tempest_primordial": 29,
    "deck_tri_eclipse_bastion": 48,
    "deck_penta_wheel_convergence": 50
  },
  "deck_squad_thousand_shields": {
    "deck_red_inferno": 67,
    "deck_blue_tempest": 52,
    "deck_purple_abyss": 63,
    "deck_green_wild": 60,
    "deck_gold_bastion": 65,
    "deck_dual_draconic_pact": 38,
    "deck_dual_abyssal_storm": 44,
    "deck_dual_primal_fury": 33,
    "deck_dual_arcane_forge": 44,
    "deck_dual_eternal_rot": 50,
    "deck_dual_blood_flame": 56,
    "deck_dual_wild_evolution": 44,
    "deck_dual_solar_wild": 50,
    "deck_dual_iron_inquisition": 38,
    "deck_dual_storm_dragon": 60,
    "deck_tri_arcane_cataclysm": 40,
    "deck_tri_primal_titans": 27,
    "deck_tri_eternal_reliquary": 46,
    "deck_tri_blood_moon": 29,
    "deck_tri_celestial_scales": 40,
    "deck_spec_chronomancer": 44,
    "deck_spec_pentachromatic": 44,
    "deck_tri_astral_cataclysm": 40,
    "deck_tri_primordial_forge": 27,
    "deck_tri_abyssal_chimera": 54,
    "deck_tri_crimson_sun": 33,
    "deck_tri_eternal_horizon": 40,
    "deck_squad_siege_battery": 60,
    "deck_penta_valkyra_pact": 44,
    "deck_neutral_axial": 65,
    "deck_dual_red_neutral": 21,
    "deck_dual_blue_neutral": 40,
    "deck_dual_purple_neutral": 63,
    "deck_dual_green_neutral": 40,
    "deck_dual_gold_neutral": 40,
    "deck_tri_zenith_armada": 38,
    "deck_tri_tempest_primordial": 40,
    "deck_tri_eclipse_bastion": 46,
    "deck_penta_wheel_convergence": 40
  },
  "deck_squad_siege_battery": {
    "deck_red_inferno": 38,
    "deck_blue_tempest": 69,
    "deck_purple_abyss": 65,
    "deck_green_wild": 69,
    "deck_gold_bastion": 65,
    "deck_dual_draconic_pact": 44,
    "deck_dual_abyssal_storm": 52,
    "deck_dual_primal_fury": 33,
    "deck_dual_arcane_forge": 42,
    "deck_dual_eternal_rot": 54,
    "deck_dual_blood_flame": 40,
    "deck_dual_wild_evolution": 52,
    "deck_dual_solar_wild": 40,
    "deck_dual_iron_inquisition": 48,
    "deck_dual_storm_dragon": 50,
    "deck_tri_arcane_cataclysm": 54,
    "deck_tri_primal_titans": 50,
    "deck_tri_eternal_reliquary": 48,
    "deck_tri_blood_moon": 27,
    "deck_tri_celestial_scales": 46,
    "deck_spec_chronomancer": 42,
    "deck_spec_pentachromatic": 42,
    "deck_tri_astral_cataclysm": 54,
    "deck_tri_primordial_forge": 50,
    "deck_tri_abyssal_chimera": 56,
    "deck_tri_crimson_sun": 40,
    "deck_tri_eternal_horizon": 46,
    "deck_squad_thousand_shields": 40,
    "deck_penta_valkyra_pact": 46,
    "deck_neutral_axial": 44,
    "deck_dual_red_neutral": 35,
    "deck_dual_blue_neutral": 48,
    "deck_dual_purple_neutral": 58,
    "deck_dual_green_neutral": 54,
    "deck_dual_gold_neutral": 46,
    "deck_tri_zenith_armada": 31,
    "deck_tri_tempest_primordial": 44,
    "deck_tri_eclipse_bastion": 58,
    "deck_penta_wheel_convergence": 63
  },
  "deck_penta_valkyra_pact": {
    "deck_red_inferno": 69,
    "deck_blue_tempest": 46,
    "deck_purple_abyss": 77,
    "deck_green_wild": 63,
    "deck_gold_bastion": 65,
    "deck_dual_draconic_pact": 46,
    "deck_dual_abyssal_storm": 50,
    "deck_dual_primal_fury": 46,
    "deck_dual_arcane_forge": 58,
    "deck_dual_eternal_rot": 73,
    "deck_dual_blood_flame": 58,
    "deck_dual_wild_evolution": 46,
    "deck_dual_solar_wild": 56,
    "deck_dual_iron_inquisition": 56,
    "deck_dual_storm_dragon": 54,
    "deck_tri_arcane_cataclysm": 65,
    "deck_tri_primal_titans": 58,
    "deck_tri_eternal_reliquary": 56,
    "deck_tri_blood_moon": 31,
    "deck_tri_celestial_scales": 60,
    "deck_spec_chronomancer": 58,
    "deck_spec_pentachromatic": 50,
    "deck_tri_astral_cataclysm": 65,
    "deck_tri_primordial_forge": 58,
    "deck_tri_abyssal_chimera": 56,
    "deck_tri_crimson_sun": 31,
    "deck_tri_eternal_horizon": 60,
    "deck_squad_thousand_shields": 56,
    "deck_squad_siege_battery": 54,
    "deck_neutral_axial": 73,
    "deck_dual_red_neutral": 35,
    "deck_dual_blue_neutral": 48,
    "deck_dual_purple_neutral": 69,
    "deck_dual_green_neutral": 46,
    "deck_dual_gold_neutral": 42,
    "deck_tri_zenith_armada": 29,
    "deck_tri_tempest_primordial": 40,
    "deck_tri_eclipse_bastion": 50,
    "deck_penta_wheel_convergence": 63
  },
  "deck_neutral_axial": {
    "deck_red_inferno": 50,
    "deck_blue_tempest": 48,
    "deck_purple_abyss": 54,
    "deck_green_wild": 63,
    "deck_gold_bastion": 44,
    "deck_dual_draconic_pact": 17,
    "deck_dual_abyssal_storm": 46,
    "deck_dual_primal_fury": 35,
    "deck_dual_arcane_forge": 33,
    "deck_dual_eternal_rot": 38,
    "deck_dual_blood_flame": 46,
    "deck_dual_wild_evolution": 38,
    "deck_dual_solar_wild": 35,
    "deck_dual_iron_inquisition": 21,
    "deck_dual_storm_dragon": 56,
    "deck_tri_arcane_cataclysm": 44,
    "deck_tri_primal_titans": 29,
    "deck_tri_eternal_reliquary": 38,
    "deck_tri_blood_moon": 19,
    "deck_tri_celestial_scales": 31,
    "deck_spec_chronomancer": 33,
    "deck_spec_pentachromatic": 35,
    "deck_tri_astral_cataclysm": 44,
    "deck_tri_primordial_forge": 29,
    "deck_tri_abyssal_chimera": 25,
    "deck_tri_crimson_sun": 27,
    "deck_tri_eternal_horizon": 31,
    "deck_squad_thousand_shields": 35,
    "deck_squad_siege_battery": 56,
    "deck_penta_valkyra_pact": 27,
    "deck_dual_red_neutral": 17,
    "deck_dual_blue_neutral": 46,
    "deck_dual_purple_neutral": 52,
    "deck_dual_green_neutral": 13,
    "deck_dual_gold_neutral": 40,
    "deck_tri_zenith_armada": 21,
    "deck_tri_tempest_primordial": 46,
    "deck_tri_eclipse_bastion": 27,
    "deck_penta_wheel_convergence": 21
  },
  "deck_dual_red_neutral": {
    "deck_red_inferno": 79,
    "deck_blue_tempest": 85,
    "deck_purple_abyss": 77,
    "deck_green_wild": 85,
    "deck_gold_bastion": 77,
    "deck_dual_draconic_pact": 52,
    "deck_dual_abyssal_storm": 81,
    "deck_dual_primal_fury": 65,
    "deck_dual_arcane_forge": 60,
    "deck_dual_eternal_rot": 67,
    "deck_dual_blood_flame": 65,
    "deck_dual_wild_evolution": 75,
    "deck_dual_solar_wild": 79,
    "deck_dual_iron_inquisition": 63,
    "deck_dual_storm_dragon": 65,
    "deck_tri_arcane_cataclysm": 75,
    "deck_tri_primal_titans": 69,
    "deck_tri_eternal_reliquary": 60,
    "deck_tri_blood_moon": 52,
    "deck_tri_celestial_scales": 60,
    "deck_spec_chronomancer": 60,
    "deck_spec_pentachromatic": 60,
    "deck_tri_astral_cataclysm": 75,
    "deck_tri_primordial_forge": 69,
    "deck_tri_abyssal_chimera": 77,
    "deck_tri_crimson_sun": 65,
    "deck_tri_eternal_horizon": 60,
    "deck_squad_thousand_shields": 79,
    "deck_squad_siege_battery": 65,
    "deck_penta_valkyra_pact": 65,
    "deck_neutral_axial": 83,
    "deck_dual_blue_neutral": 73,
    "deck_dual_purple_neutral": 92,
    "deck_dual_green_neutral": 65,
    "deck_dual_gold_neutral": 67,
    "deck_tri_zenith_armada": 52,
    "deck_tri_tempest_primordial": 71,
    "deck_tri_eclipse_bastion": 60,
    "deck_penta_wheel_convergence": 79
  },
  "deck_dual_blue_neutral": {
    "deck_red_inferno": 60,
    "deck_blue_tempest": 65,
    "deck_purple_abyss": 77,
    "deck_green_wild": 71,
    "deck_gold_bastion": 58,
    "deck_dual_draconic_pact": 42,
    "deck_dual_abyssal_storm": 67,
    "deck_dual_primal_fury": 46,
    "deck_dual_arcane_forge": 69,
    "deck_dual_eternal_rot": 52,
    "deck_dual_blood_flame": 54,
    "deck_dual_wild_evolution": 54,
    "deck_dual_solar_wild": 60,
    "deck_dual_iron_inquisition": 52,
    "deck_dual_storm_dragon": 52,
    "deck_tri_arcane_cataclysm": 58,
    "deck_tri_primal_titans": 54,
    "deck_tri_eternal_reliquary": 63,
    "deck_tri_blood_moon": 42,
    "deck_tri_celestial_scales": 50,
    "deck_spec_chronomancer": 69,
    "deck_spec_pentachromatic": 44,
    "deck_tri_astral_cataclysm": 58,
    "deck_tri_primordial_forge": 54,
    "deck_tri_abyssal_chimera": 54,
    "deck_tri_crimson_sun": 25,
    "deck_tri_eternal_horizon": 50,
    "deck_squad_thousand_shields": 60,
    "deck_squad_siege_battery": 52,
    "deck_penta_valkyra_pact": 52,
    "deck_neutral_axial": 54,
    "deck_dual_red_neutral": 27,
    "deck_dual_purple_neutral": 58,
    "deck_dual_green_neutral": 48,
    "deck_dual_gold_neutral": 48,
    "deck_tri_zenith_armada": 46,
    "deck_tri_tempest_primordial": 46,
    "deck_tri_eclipse_bastion": 44,
    "deck_penta_wheel_convergence": 56
  },
  "deck_dual_purple_neutral": {
    "deck_red_inferno": 54,
    "deck_blue_tempest": 69,
    "deck_purple_abyss": 60,
    "deck_green_wild": 56,
    "deck_gold_bastion": 50,
    "deck_dual_draconic_pact": 25,
    "deck_dual_abyssal_storm": 67,
    "deck_dual_primal_fury": 33,
    "deck_dual_arcane_forge": 31,
    "deck_dual_eternal_rot": 44,
    "deck_dual_blood_flame": 44,
    "deck_dual_wild_evolution": 50,
    "deck_dual_solar_wild": 38,
    "deck_dual_iron_inquisition": 38,
    "deck_dual_storm_dragon": 42,
    "deck_tri_arcane_cataclysm": 50,
    "deck_tri_primal_titans": 29,
    "deck_tri_eternal_reliquary": 42,
    "deck_tri_blood_moon": 31,
    "deck_tri_celestial_scales": 46,
    "deck_spec_chronomancer": 31,
    "deck_spec_pentachromatic": 40,
    "deck_tri_astral_cataclysm": 50,
    "deck_tri_primordial_forge": 29,
    "deck_tri_abyssal_chimera": 58,
    "deck_tri_crimson_sun": 29,
    "deck_tri_eternal_horizon": 46,
    "deck_squad_thousand_shields": 38,
    "deck_squad_siege_battery": 42,
    "deck_penta_valkyra_pact": 31,
    "deck_neutral_axial": 48,
    "deck_dual_red_neutral": 8,
    "deck_dual_blue_neutral": 42,
    "deck_dual_green_neutral": 27,
    "deck_dual_gold_neutral": 29,
    "deck_tri_zenith_armada": 19,
    "deck_tri_tempest_primordial": 56,
    "deck_tri_eclipse_bastion": 29,
    "deck_penta_wheel_convergence": 54
  },
  "deck_dual_green_neutral": {
    "deck_red_inferno": 69,
    "deck_blue_tempest": 69,
    "deck_purple_abyss": 77,
    "deck_green_wild": 73,
    "deck_gold_bastion": 69,
    "deck_dual_draconic_pact": 65,
    "deck_dual_abyssal_storm": 56,
    "deck_dual_primal_fury": 48,
    "deck_dual_arcane_forge": 73,
    "deck_dual_eternal_rot": 71,
    "deck_dual_blood_flame": 69,
    "deck_dual_wild_evolution": 54,
    "deck_dual_solar_wild": 60,
    "deck_dual_iron_inquisition": 56,
    "deck_dual_storm_dragon": 46,
    "deck_tri_arcane_cataclysm": 63,
    "deck_tri_primal_titans": 54,
    "deck_tri_eternal_reliquary": 65,
    "deck_tri_blood_moon": 33,
    "deck_tri_celestial_scales": 60,
    "deck_spec_chronomancer": 73,
    "deck_spec_pentachromatic": 56,
    "deck_tri_astral_cataclysm": 63,
    "deck_tri_primordial_forge": 54,
    "deck_tri_abyssal_chimera": 71,
    "deck_tri_crimson_sun": 40,
    "deck_tri_eternal_horizon": 60,
    "deck_squad_thousand_shields": 60,
    "deck_squad_siege_battery": 46,
    "deck_penta_valkyra_pact": 54,
    "deck_neutral_axial": 88,
    "deck_dual_red_neutral": 35,
    "deck_dual_blue_neutral": 52,
    "deck_dual_purple_neutral": 73,
    "deck_dual_gold_neutral": 50,
    "deck_tri_zenith_armada": 52,
    "deck_tri_tempest_primordial": 48,
    "deck_tri_eclipse_bastion": 42,
    "deck_penta_wheel_convergence": 65
  },
  "deck_dual_gold_neutral": {
    "deck_red_inferno": 73,
    "deck_blue_tempest": 63,
    "deck_purple_abyss": 71,
    "deck_green_wild": 79,
    "deck_gold_bastion": 77,
    "deck_dual_draconic_pact": 38,
    "deck_dual_abyssal_storm": 48,
    "deck_dual_primal_fury": 38,
    "deck_dual_arcane_forge": 44,
    "deck_dual_eternal_rot": 65,
    "deck_dual_blood_flame": 63,
    "deck_dual_wild_evolution": 38,
    "deck_dual_solar_wild": 60,
    "deck_dual_iron_inquisition": 65,
    "deck_dual_storm_dragon": 54,
    "deck_tri_arcane_cataclysm": 50,
    "deck_tri_primal_titans": 48,
    "deck_tri_eternal_reliquary": 56,
    "deck_tri_blood_moon": 54,
    "deck_tri_celestial_scales": 46,
    "deck_spec_chronomancer": 44,
    "deck_spec_pentachromatic": 42,
    "deck_tri_astral_cataclysm": 50,
    "deck_tri_primordial_forge": 48,
    "deck_tri_abyssal_chimera": 50,
    "deck_tri_crimson_sun": 38,
    "deck_tri_eternal_horizon": 46,
    "deck_squad_thousand_shields": 60,
    "deck_squad_siege_battery": 54,
    "deck_penta_valkyra_pact": 58,
    "deck_neutral_axial": 60,
    "deck_dual_red_neutral": 33,
    "deck_dual_blue_neutral": 52,
    "deck_dual_purple_neutral": 71,
    "deck_dual_green_neutral": 50,
    "deck_tri_zenith_armada": 25,
    "deck_tri_tempest_primordial": 48,
    "deck_tri_eclipse_bastion": 46,
    "deck_penta_wheel_convergence": 48
  },
  "deck_tri_zenith_armada": {
    "deck_red_inferno": 73,
    "deck_blue_tempest": 73,
    "deck_purple_abyss": 83,
    "deck_green_wild": 83,
    "deck_gold_bastion": 81,
    "deck_dual_draconic_pact": 46,
    "deck_dual_abyssal_storm": 65,
    "deck_dual_primal_fury": 67,
    "deck_dual_arcane_forge": 75,
    "deck_dual_eternal_rot": 79,
    "deck_dual_blood_flame": 77,
    "deck_dual_wild_evolution": 71,
    "deck_dual_solar_wild": 63,
    "deck_dual_iron_inquisition": 77,
    "deck_dual_storm_dragon": 69,
    "deck_tri_arcane_cataclysm": 71,
    "deck_tri_primal_titans": 69,
    "deck_tri_eternal_reliquary": 67,
    "deck_tri_blood_moon": 44,
    "deck_tri_celestial_scales": 69,
    "deck_spec_chronomancer": 75,
    "deck_spec_pentachromatic": 71,
    "deck_tri_astral_cataclysm": 71,
    "deck_tri_primordial_forge": 69,
    "deck_tri_abyssal_chimera": 69,
    "deck_tri_crimson_sun": 54,
    "deck_tri_eternal_horizon": 69,
    "deck_squad_thousand_shields": 63,
    "deck_squad_siege_battery": 69,
    "deck_penta_valkyra_pact": 71,
    "deck_neutral_axial": 79,
    "deck_dual_red_neutral": 48,
    "deck_dual_blue_neutral": 54,
    "deck_dual_purple_neutral": 81,
    "deck_dual_green_neutral": 48,
    "deck_dual_gold_neutral": 75,
    "deck_tri_tempest_primordial": 67,
    "deck_tri_eclipse_bastion": 71,
    "deck_penta_wheel_convergence": 73
  },
  "deck_tri_tempest_primordial": {
    "deck_red_inferno": 54,
    "deck_blue_tempest": 63,
    "deck_purple_abyss": 67,
    "deck_green_wild": 71,
    "deck_gold_bastion": 60,
    "deck_dual_draconic_pact": 46,
    "deck_dual_abyssal_storm": 54,
    "deck_dual_primal_fury": 60,
    "deck_dual_arcane_forge": 67,
    "deck_dual_eternal_rot": 54,
    "deck_dual_blood_flame": 44,
    "deck_dual_wild_evolution": 56,
    "deck_dual_solar_wild": 60,
    "deck_dual_iron_inquisition": 65,
    "deck_dual_storm_dragon": 56,
    "deck_tri_arcane_cataclysm": 60,
    "deck_tri_primal_titans": 63,
    "deck_tri_eternal_reliquary": 48,
    "deck_tri_blood_moon": 35,
    "deck_tri_celestial_scales": 71,
    "deck_spec_chronomancer": 67,
    "deck_spec_pentachromatic": 50,
    "deck_tri_astral_cataclysm": 60,
    "deck_tri_primordial_forge": 63,
    "deck_tri_abyssal_chimera": 60,
    "deck_tri_crimson_sun": 40,
    "deck_tri_eternal_horizon": 71,
    "deck_squad_thousand_shields": 60,
    "deck_squad_siege_battery": 56,
    "deck_penta_valkyra_pact": 60,
    "deck_neutral_axial": 54,
    "deck_dual_red_neutral": 29,
    "deck_dual_blue_neutral": 54,
    "deck_dual_purple_neutral": 44,
    "deck_dual_green_neutral": 52,
    "deck_dual_gold_neutral": 52,
    "deck_tri_zenith_armada": 33,
    "deck_tri_eclipse_bastion": 56,
    "deck_penta_wheel_convergence": 54
  },
  "deck_tri_eclipse_bastion": {
    "deck_red_inferno": 63,
    "deck_blue_tempest": 54,
    "deck_purple_abyss": 75,
    "deck_green_wild": 63,
    "deck_gold_bastion": 73,
    "deck_dual_draconic_pact": 58,
    "deck_dual_abyssal_storm": 60,
    "deck_dual_primal_fury": 44,
    "deck_dual_arcane_forge": 42,
    "deck_dual_eternal_rot": 48,
    "deck_dual_blood_flame": 69,
    "deck_dual_wild_evolution": 40,
    "deck_dual_solar_wild": 54,
    "deck_dual_iron_inquisition": 52,
    "deck_dual_storm_dragon": 42,
    "deck_tri_arcane_cataclysm": 56,
    "deck_tri_primal_titans": 60,
    "deck_tri_eternal_reliquary": 69,
    "deck_tri_blood_moon": 56,
    "deck_tri_celestial_scales": 52,
    "deck_spec_chronomancer": 42,
    "deck_spec_pentachromatic": 44,
    "deck_tri_astral_cataclysm": 56,
    "deck_tri_primordial_forge": 60,
    "deck_tri_abyssal_chimera": 50,
    "deck_tri_crimson_sun": 54,
    "deck_tri_eternal_horizon": 52,
    "deck_squad_thousand_shields": 54,
    "deck_squad_siege_battery": 42,
    "deck_penta_valkyra_pact": 50,
    "deck_neutral_axial": 73,
    "deck_dual_red_neutral": 40,
    "deck_dual_blue_neutral": 56,
    "deck_dual_purple_neutral": 71,
    "deck_dual_green_neutral": 58,
    "deck_dual_gold_neutral": 54,
    "deck_tri_zenith_armada": 29,
    "deck_tri_tempest_primordial": 44,
    "deck_penta_wheel_convergence": 52
  },
  "deck_penta_wheel_convergence": {
    "deck_red_inferno": 71,
    "deck_blue_tempest": 65,
    "deck_purple_abyss": 60,
    "deck_green_wild": 65,
    "deck_gold_bastion": 67,
    "deck_dual_draconic_pact": 33,
    "deck_dual_abyssal_storm": 60,
    "deck_dual_primal_fury": 42,
    "deck_dual_arcane_forge": 50,
    "deck_dual_eternal_rot": 52,
    "deck_dual_blood_flame": 56,
    "deck_dual_wild_evolution": 42,
    "deck_dual_solar_wild": 60,
    "deck_dual_iron_inquisition": 60,
    "deck_dual_storm_dragon": 38,
    "deck_tri_arcane_cataclysm": 58,
    "deck_tri_primal_titans": 52,
    "deck_tri_eternal_reliquary": 63,
    "deck_tri_blood_moon": 48,
    "deck_tri_celestial_scales": 50,
    "deck_spec_chronomancer": 50,
    "deck_spec_pentachromatic": 46,
    "deck_tri_astral_cataclysm": 58,
    "deck_tri_primordial_forge": 52,
    "deck_tri_abyssal_chimera": 60,
    "deck_tri_crimson_sun": 44,
    "deck_tri_eternal_horizon": 50,
    "deck_squad_thousand_shields": 60,
    "deck_squad_siege_battery": 38,
    "deck_penta_valkyra_pact": 38,
    "deck_neutral_axial": 79,
    "deck_dual_red_neutral": 21,
    "deck_dual_blue_neutral": 44,
    "deck_dual_purple_neutral": 46,
    "deck_dual_green_neutral": 35,
    "deck_dual_gold_neutral": 52,
    "deck_tri_zenith_armada": 27,
    "deck_tri_tempest_primordial": 46,
    "deck_tri_eclipse_bastion": 48
  }
};

export function getDeckTacticalProfile(deckId: string): DeckTacticalProfile {
  return DECK_TACTICAL_PROFILES[deckId] ?? Object.values(DECK_TACTICAL_PROFILES)[0];
}

export function getMatchupGuide(myDeckId: string, enemyDeckId: string): MatchupGuide {
  const myProfile = getDeckTacticalProfile(myDeckId);
  const enemyProfile = getDeckTacticalProfile(enemyDeckId);
  const myDeck = PREBUILT_DECKS.find((d) => d.id === myDeckId) ?? PREBUILT_DECKS[0];
  const enemyDeck = PREBUILT_DECKS.find((d) => d.id === enemyDeckId) ?? PREBUILT_DECKS[0];

  const empiricalWr = EMPIRICAL_WIN_RATES[myDeckId]?.[enemyDeckId];
  const estimatedWinRate =
    typeof empiricalWr === 'number' ? Math.max(45, Math.min(55, empiricalWr)) : 50;

  const favorability: 'Favorável' | 'Equilibrado' | 'Desafiador' =
    estimatedWinRate >= 55 ? 'Favorável' : estimatedWinRate <= 45 ? 'Desafiador' : 'Equilibrado';

  const myUniqueCards = Array.from(new Set(myDeck.cardIds))
    .map((id) => CARDS_BY_ID[id])
    .filter(Boolean);
  const enemyUniqueCards = Array.from(new Set(enemyDeck.cardIds))
    .map((id) => CARDS_BY_ID[id])
    .filter(Boolean);

  const myWheelGenerals = myUniqueCards.filter((c) =>
    c.effects.some((e) => e.type === 'break_domain_expansion')
  );
  const enemyWheelGenerals = enemyUniqueCards.filter((c) =>
    c.effects.some((e) => e.type === 'break_domain_expansion')
  );
  const enemyArmadas = enemyUniqueCards.filter((c) => c.id.includes('_172_'));

  const enemyHasHeavySpells =
    enemyProfile.compositionSummary.spells + enemyProfile.compositionSummary.reactions >= 22;
  const enemyHasHeavyRelics = enemyProfile.compositionSummary.relics >= 12;
  const enemyIsSwarm = enemyProfile.compositionSummary.creatures >= 45;
  const enemyHasBreathDragons =
    enemyUniqueCards.filter((c) => (c.breathDamage ?? 0) >= 2).length >= 2;
  const enemyHasLethal =
    enemyUniqueCards.filter((c) => c.keywords.includes('Toque Letal')).length >= 3;

  // Priority targets from enemy deck (Generais da Roda #173, Armadas Dracônicas #172, Arautos #167, Pactuários #171 & top legends)
  const prioritizedPool = [
    ...enemyWheelGenerals,
    ...enemyArmadas,
    ...enemyUniqueCards.filter(
      (c) =>
        c.id.includes('_167_') ||
        c.id.includes('_171_') ||
        c.rarity === 'legendary' ||
        (c.type === 'relic' && c.rarity === 'rare') ||
        Boolean(c.ascension)
    ),
  ];
  const seenNames = new Set<string>();
  const priorityTargets: string[] = [];
  for (const c of prioritizedPool) {
    if (!seenNames.has(c.name)) {
      seenNames.add(c.name);
      priorityTargets.push(c.name);
    }
    if (priorityTargets.length >= 4) break;
  }

  const myWheelName = myWheelGenerals[0]?.name ?? 'seu General da Roda (#173)';
  const enemyWheelName = enemyWheelGenerals[0]?.name;

  let keyObjective = '';
  if (enemyHasHeavyRelics) {
    keyObjective = `Pressionar as colunas de Vanguarda de "${enemyProfile.deckName}" antes que suas ${enemyProfile.compositionSummary.relics} Relíquias Contínuas dominem a Retaguarda, reservando ${myWheelName} para quebrar a Expansão de Domínio rival (impondo 2 rodadas de Exaustão de Domínio).`;
  } else if (enemyHasHeavySpells) {
    keyObjective = `Forçar "${enemyProfile.deckName}" a gastar suas ${enemyProfile.compositionSummary.spells + enemyProfile.compositionSummary.reactions} Magias/Reações em ameaças médias e guardar ${myWheelName} para destruir o Domínio inimigo ou vencer na hora uma Disputa de Domínios 50/50.`;
  } else if (enemyIsSwarm) {
    keyObjective = `Conter a avalanche de ${enemyProfile.compositionSummary.creatures} criaturas de "${enemyProfile.deckName}" bloqueando Invasões (+1 ATQ) e usar ${myWheelName} para conceder Escudo Divino global enquanto estilhaça a Expansão de Domínio oponente.`;
  } else {
    keyObjective = `Impor o plano de jogo de ${myProfile.archetypeTag} contra "${enemyProfile.deckName}" e punir qualquer Expansão de Domínio rival com ${myWheelName} (2 rodadas de Exaustão de Domínio).`;
  }

  let whatToChannel = '';
  if (enemyIsSwarm || enemyProfile.compositionSummary.averageCost <= 3.15) {
    whatToChannel = `Contra este oponente agressivo, canalize cartas pesadas duplicadas nos Turnos 1–3, mas NUNCA canalize ${myWheelName}: preserve todas as unidades de custo 1–3 (como Flagelos #170), Guardiões e seu General da Roda.`;
  } else if (enemyHasHeavyRelics || enemyHasHeavySpells) {
    whatToChannel = `Contra este grimório de controle/relíquias, canalize remoções pequenas situacionais e preserve seus Pactuários (#171), Armadas Dracônicas (#172) e especialmente ${myWheelName} para quebrar o Domínio rival ou destravar um Choque 50/50.`;
  } else {
    whatToChannel = `Siga a regra base do seu deck (${myProfile.channelingStrategy.split('.')[0]}), jamais canalizando ${myWheelName} nos turnos médios/finais.`;
  }

  let positioningTactic = '';
  if (enemyHasBreathDragons || enemyHasHeavySpells) {
    positioningTactic =
      'CUIDADO COM DANO EM ÁREA E ARMADAS DRACÔNICAS (#172): Sopros e entradas dracônicas varrem fileiras inteiras! Evite empilhar 3 unidades frágeis sem Escudo Divino e posicione Pactuários (#171) e Tecelões (#168) com Alcance na Retaguarda.';
  } else if (enemyHasLethal) {
    positioningTactic =
      'CONTRA TOQUE LETAL: Nunca deixe um colosso caro sozinho na frente de um slot! Empilhe uma ficha 2/2 ou unidade com Escudo Divino/Renascer na posição 1 do slot para absorver o impacto.';
  } else if (enemyIsSwarm) {
    positioningTactic =
      'CONTRA ENXAME DE ESQUADRÃO: Ocupe o maior número possível de colunas na Vanguarda para negar Invasões (+1 ATQ) e use o Escudo Divino global do seu General da Roda (#173) antes da colisão.';
  } else {
    positioningTactic =
      'Agrupe esquadrões de 2–3 unidades nas colunas onde você possui vantagem de atributos para romper o Guardião rival e invadir a Retaguarda.';
  }

  const enemyWheelWarning = enemyWheelName
    ? ` Cuidado também ao ativar sua própria Expansão de Domínio: o rival possui ${enemyWheelName}, capaz de quebrar seu Domínio ao entrar ou atacar!`
    : '';

  const dangerWatchout = enemyProfile.signatureCombos[0]
    ? `Atenção ao combo "${enemyProfile.signatureCombos[0].title}" (${enemyProfile.signatureCombos[0].cards.join(' + ')}): ${enemyProfile.signatureCombos[0].howItWorks}${enemyWheelWarning}`
    : `Cuidado a partir do Turno 6 com os campeões lendários de "${enemyProfile.deckName}".${enemyWheelWarning}`;

  const victoryPath = `Estabilize cedo (${myProfile.phasePlan.earlyGame.replace(/\.$/, '')}), neutralize ${priorityTargets.slice(0, 2).join(' e ')} e vença a guerra de Domínios: se entrarem em Disputa de Domínios 50/50, desça ${myWheelName} para quebrar apenas o Domínio rival, impor 2 rodadas de Exaustão de Domínio e reativar imediatamente o +1/+1 e o Acerto Garantido do seu Domínio!`;

  return {
    myDeckId,
    enemyDeckId,
    favorability,
    estimatedWinRate,
    keyObjective,
    whatToChannel,
    positioningTactic,
    priorityTargets,
    dangerWatchout,
    victoryPath,
  };
}

export function getAllMatchupsForDeck(myDeckId: string): MatchupGuide[] {
  return PREBUILT_DECKS.filter((d) => d.id !== myDeckId).map((d) => getMatchupGuide(myDeckId, d.id));
}
