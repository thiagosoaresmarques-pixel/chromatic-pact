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
      "creatures": 55,
      "spells": 27,
      "reactions": 10,
      "relics": 8,
      "ascensions": 0,
      "averageCost": 3.04
    },
    "playstyleOverview": "Baralho agressivo de pressão constante (100 cartas) que combina 55 feras vulcânicas de Ímpeto com 37 cartas de queima e reação piromântica (27 Feitiços e 10 Reações). O objetivo é abrir brechas na Vanguarda inimiga com dano em área e finalizar com o Sopro devastador dos Dragões Vermelhos.",
    "channelingStrategy": "Turnos 1–3: Canalize um dragão de custo 6–7 duplicado ou uma Relíquia lenta para garantir Afinidade Vermelha nível 2 rapidamente. Turnos 4+: Pare de canalizar magias de queima direta — cada feitiço na mão representa alcance letal contra o Soberano rival.",
    "positioningAndStackingGuide": "Coloque Batedores Escamados e Salamandras na Retaguarda com Alcance. Na Vanguarda, espalhe atacantes de Ímpeto em colunas diferentes para forçar múltiplos bloqueios e ativar Invasão de Coluna (+1⚔️ ATQ) nos slots vazios inimigos.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Víbora de Brasa Jovem, Batedor Escamado das Brasas, Diabrete de Escória Vulcânica para disputar colunas e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine o meio de jogo combinando Fúria de Sangue Vulcânico e Pausar e Pensar um Segundo e Botas Aladas do Mensageiro, punindo colunas congestionadas e preparando sua Expansão de Domínio (6/6).",
      "lateGame": "Invoque a Expansão de Domínio e finalize a partida com Igniskar, Tirano da Cratera, Pyroclasmos, Imperador das Chamas, Magmarok, o Tirano Piroclástico pressionando diretamente o Soberano rival."
    },
    "signatureCombos": [
      {
        "title": "Caldeirão Piroclástico",
        "cards": [
          "Botas Aladas do Mensageiro",
          "Bigorna Dracônica da Cratera",
          "Fornalha Rúnica de Muspel"
        ],
        "howItWorks": "Combine Botas Aladas do Mensageiro + Bigorna Dracônica da Cratera + Fornalha Rúnica de Muspel para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
      },
      {
        "title": "Mergulho da Fênix",
        "cards": [
          "Igniskar, Tirano da Cratera",
          "Pyroclasmos, Imperador das Chamas"
        ],
        "howItWorks": "Articule Igniskar, Tirano da Cratera + Pyroclasmos, Imperador das Chamas nos turnos decisivos para quebrar a linha de Guardiões rivais e abrir letal contra o Soberano inimigo."
      }
    ],
    "strengths": [
      "Altíssimo poder de finalização direta contra o Soberano com magias e Sopros.",
      "Excelente remoção em área contra baralhos de enxame (Verde/Dourado).",
      "Velocidade explosiva nos primeiros 5 turnos."
    ],
    "weaknesses": [
      "Poucas opções de cura para o próprio Soberano em duelos prolongados.",
      "Criaturas de custo baixo têm pouca VIDA contra Escudo Divino."
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
      "creatures": 42,
      "spells": 35,
      "reactions": 13,
      "relics": 10,
      "ascensions": 3,
      "averageCost": 3.46
    },
    "playstyleOverview": "Quase metade do grimório de 100 cartas (35 Feitiços e 13 Reações) consiste em magias de gelo, relâmpago e manipulação temporal. Em vez de disputar força bruta na Vanguarda, o Conclave paralisa colunas inteiras com Congelamento e vence pelos céus com Leviatãs, Esfinges e Krakens.",
    "channelingStrategy": "Canalize feitiços situacionais nos primeiros turnos; mantenha sempre Essência aberta para suas 13 Reações.",
    "positioningAndStackingGuide": "Empilhe até 2–3 Magos de Alcance num mesmo slot protegido da Retaguarda atrás de uma Naga Guardiã ou Gigante de Gelo Jarl na Vanguarda. Use suas 10 Reações para punir qualquer tentativa inimiga de quebrar sua coluna principal.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Sentinela das Correntes Aéreas, Iniciado da Torre Astral, Iniciado do Relógio Astral para disputar colunas e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine o meio de jogo combinando Pausar e Pensar um Segundo e Translocação na Neblina e Astrolábio das Eras Eternas, punindo colunas congestionadas e preparando sua Expansão de Domínio (6/6).",
      "lateGame": "Invoque a Expansão de Domínio e finalize a partida com Kraken da Fossa Abissal, Orion, Arconte da Tempestade Astral, Thalassia, A Maré Devoradora pressionando diretamente o Soberano rival."
    },
    "signatureCombos": [
      {
        "title": "Inverno Perpétuo",
        "cards": [
          "Botas Aladas do Mensageiro",
          "Códice da Ressonância Astral",
          "Astrolábio das Eras Eternas"
        ],
        "howItWorks": "Combine Botas Aladas do Mensageiro + Códice da Ressonância Astral + Astrolábio das Eras Eternas para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
      },
      {
        "title": "Eco da Singularidade",
        "cards": [
          "Kraken da Fossa Abissal",
          "Orion, Arconte da Tempestade Astral",
          "Thalassia, A Maré Devoradora"
        ],
        "howItWorks": "Articule Kraken da Fossa Abissal + Orion, Arconte da Tempestade Astral + Thalassia, A Maré Devoradora nos turnos decisivos para quebrar a linha de Guardiões rivais e abrir letal contra o Soberano inimigo."
      }
    ],
    "strengths": [
      "Neutraliza completamente colossos lentos e pilhas de esquadrão com Congelamento.",
      "Maior capacidade de compra de cartas entre os baralhos mono-domínio.",
      "Forte presença aérea com Voo e Alcance."
    ],
    "weaknesses": [
      "Vulnerável a dano direto de feitiços que ignoram a Vanguarda congelada.",
      "Exige gestão cuidadosa de Essência para manter Reações ativas."
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
      "creatures": 55,
      "spells": 22,
      "reactions": 10,
      "relics": 13,
      "ascensions": 7,
      "averageCost": 3.24
    },
    "playstyleOverview": "Grimório de atrito imortal (100 cartas: 55 Criaturas, 22 Feitiços, 10 Reações e 13 Relíquias) focado em Renascer, Dreno de Vida e reanimação contínua da Cripta.",
    "channelingStrategy": "Turnos 1–3: Canalize cartas de custo 5–6 ou feitiços situacionais para ativar Afinidade Roxa 2+. Turnos 4+: Evite canalizar criaturas lendárias se você tiver Exumar Legião ou Erguer os Mortos, pois até unidades abatidas em combate voltam da Cripta.",
    "positioningAndStackingGuide": "Use mortos-vivos com Renascer e Toque Letal na Vanguarda e proteja suas 13 Relíquias na Retaguarda.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Sabujo Devorador de Almas, Escolo-Couraçada da Cripta, Garra Decepada Animada para disputar colunas e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine o meio de jogo combinando Sentença do Oblívio e Toque da Decomposição e Botas Aladas do Mensageiro, punindo colunas congestionadas e preparando sua Expansão de Domínio (6/6).",
      "lateGame": "Invoque a Expansão de Domínio e finalize a partida com Ossaurion, Dragão-Ossário Eterno, Malakor, Imperador da Entropia, Vesperion, Arquimago Lich Imortal pressionando diretamente o Soberano rival."
    },
    "signatureCombos": [
      {
        "title": "Sifão da Eternidade",
        "cards": [
          "Lanterna das Almas Penadas",
          "Botas Aladas do Mensageiro",
          "Ampulheta das Mil Mortes"
        ],
        "howItWorks": "Combine Lanterna das Almas Penadas + Botas Aladas do Mensageiro + Ampulheta das Mil Mortes para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
      },
      {
        "title": "Retorno do Dragão-Ossário",
        "cards": [
          "Ossaurion, Dragão-Ossário Eterno",
          "Malakor, Imperador da Entropia",
          "Vesperion, Arquimago Lich Imortal"
        ],
        "howItWorks": "Articule Ossaurion, Dragão-Ossário Eterno + Malakor, Imperador da Entropia + Vesperion, Arquimago Lich Imortal nos turnos decisivos para quebrar a linha de Guardiões rivais e abrir letal contra o Soberano inimigo."
      }
    ],
    "strengths": [
      "Sustentação excepcional graças a Dreno de Vida e relíquias de cura.",
      "Toque Letal elimina qualquer titã inimigo independentemente da VIDA.",
      "Domina partidas longas graças à recursão da Cripta."
    ],
    "weaknesses": [
      "O acúmulo de Corrupção exige atenção para não sofrer recuo sombrio se a partida fugir do controle.",
      "Congelamento atrasa os gatilhos de Dreno de Vida em combate."
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
      "creatures": 80,
      "spells": 10,
      "reactions": 5,
      "relics": 5,
      "ascensions": 9,
      "averageCost": 2.75
    },
    "playstyleOverview": "Força bruta em estado puro: 80 das 100 cartas são criaturas! Com 9 unidades de Ascensão, Regeneração natural e Atropelar em massa, este baralho sufoca o tabuleiro ocupando todas as 6 colunas e empilhando esquadrões ferozes.",
    "channelingStrategy": "Como 80% do deck são criaturas, canalize qualquer fera de custo médio redundante nos Turnos 1–4 para garantir uma curva de Essência perfeita até 7⚡ (Hidra, Rex Primordial e Chelonia).",
    "positioningAndStackingGuide": "Empilhe 2 a 3 feras por slot nas colunas onde o inimigo colocou bloqueadores fracos: com Atropelar e Chamado da Selva (+bônus em área), o dano excedente esmaga o Soberano rival diretamente!",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Lebre Astral do Tempo Perdido, Emboscador Goblin da Mata, Lobo Atroz da Espinha Gelada para disputar colunas e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine o meio de jogo combinando Fosso de Vinhas Estranguladoras e Rugido de Sobrevivência e Altar das Presas Ancestrais, punindo colunas congestionadas e preparando sua Expansão de Domínio (6/6).",
      "lateGame": "Invoque a Expansão de Domínio e finalize a partida com Chelonia, A Tartaruga-Continente, Vorágine, Hidra Voraz do Pântano, Rex Primordial da Cratera Perdida pressionando diretamente o Soberano rival."
    },
    "signatureCombos": [
      {
        "title": "Estouro da Alcateia",
        "cards": [
          "Altar das Presas Ancestrais",
          "Monólito de Comando da Terra",
          "Pedra Filosofal do Alquimista"
        ],
        "howItWorks": "Combine Altar das Presas Ancestrais + Monólito de Comando da Terra + Pedra Filosofal do Alquimista para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
      },
      {
        "title": "Muralha Regenerativa",
        "cards": [
          "Chelonia, A Tartaruga-Continente",
          "Vorágine, Hidra Voraz do Pântano",
          "Rex Primordial da Cratera Perdida"
        ],
        "howItWorks": "Articule Chelonia, A Tartaruga-Continente + Vorágine, Hidra Voraz do Pântano + Rex Primordial da Cratera Perdida nos turnos decisivos para quebrar a linha de Guardiões rivais e abrir letal contra o Soberano inimigo."
      }
    ],
    "strengths": [
      "Maior densidade de ameaças por turno do jogo (64 criaturas).",
      "Atropelar impede que o inimigo sobreviva usando pequenos bloqueadores.",
      "Forte resistência contra queima leve graças à Regeneração."
    ],
    "weaknesses": [
      "Poucas magias de remoção direta contra unidades na Retaguarda inimiga.",
      "Vulnerável a Congelamento em massa se não diversificar com unidades de Alcance."
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
      "creatures": 55,
      "spells": 12,
      "reactions": 8,
      "relics": 25,
      "ascensions": 0,
      "averageCost": 4.18
    },
    "playstyleOverview": "Cidadela impenetrável de 100 cartas que combina 55 soldados, paladinos e anjos blindados com 25 Relíquias Contínuas na Retaguarda, 12 Feitiços e 8 Reações.",
    "channelingStrategy": "Turnos 1–3: Canalize criaturas de custo 6–7 se precisar de Afinidade Dourada, mas preserve suas Relíquias de custo 2–3 (Escudo Solar, Martelo do Trovão), pois cada relíquia instalada gera valor cumulativo até o fim do jogo.",
    "positioningAndStackingGuide": "Posicione Guardiões com Escudo Divino na Vanguarda para proteger suas 25 Relíquias Contínuas na Retaguarda.",
    "phasePlan": {
      "earlyGame": "Posicione Escudeiro Solar, Lanceiro da Falange e Cão de Guarda Real enquanto instala a primeira Relíquia.",
      "midGame": "Domine o meio de jogo combinando Intervenção da Égide Angelical e Correntes Sagradas da Catedral e Estandarte da Legião Dourada, punindo colunas congestionadas e preparando sua Expansão de Domínio (6/6).",
      "lateGame": "Invoque a Expansão de Domínio e finalize a partida com Aurelius, Soberano Dragão da Alvorada, Aurarius, Majestade do Sol, Justinian, Soberano da Ordem Eterna pressionando diretamente o Soberano rival."
    },
    "signatureCombos": [
      {
        "title": "Santuário das Dez Relíquias",
        "cards": [
          "Cálice Real da Alvorada",
          "Obelisco do Bastião Inexpugnável",
          "Obelisco da Lei Suprema"
        ],
        "howItWorks": "Combine Cálice Real da Alvorada + Obelisco do Bastião Inexpugnável + Obelisco da Lei Suprema para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
      },
      {
        "title": "Julgamento Imaculado",
        "cards": [
          "Aurarius, Majestade do Sol",
          "Aurelius, Soberano Dragão da Alvorada",
          "Justinian, Soberano da Ordem Eterna"
        ],
        "howItWorks": "Articule Aurarius, Majestade do Sol + Aurelius, Soberano Dragão da Alvorada + Justinian, Soberano da Ordem Eterna nos turnos decisivos para quebrar a linha de Guardiões rivais e abrir letal contra o Soberano inimigo."
      }
    ],
    "strengths": [
      "A defesa mais difícil de penetrar em todo o jogo (Armadura + Escudo Divino + Cura).",
      "Efeito bola de neve imbatível se as Relíquias da Retaguarda não forem destruídas.",
      "Excelente contra baralhos agressivos (Vermelho e Verde)."
    ],
    "weaknesses": [
      "Construção mais lenta nos primeiros turnos enquanto instala Relíquias.",
      "Vulnerável a Toque Letal se o Escudo Divino já tiver sido consumido."
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
      "creatures": 60,
      "spells": 18,
      "reactions": 7,
      "relics": 15,
      "ascensions": 5,
      "averageCost": 2.95
    },
    "playstyleOverview": "Une a fúria piromântica dos dragões vermelhos à blindagem sagrada dos dragões e 15 Relíquias douradas em um grimório de 100 cartas (60 Criaturas, 18 Feitiços, 7 Reações e 15 Relíquias).",
    "channelingStrategy": "Priorize atingir 2 de Afinidade Vermelha e 2 de Afinidade Dourada até o Turno 4, canalizando cartas de custo 5 duplicadas.",
    "positioningAndStackingGuide": "Mantenha Guardiões Dourados na frente (posição 0 da pilha) e coloque Artilheiros/Meio-Dragões como 2ª unidade do mesmo slot para somar fogo concentrado sem expor os atacantes.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Lâmina Voadora Consagrada, Homúnculo do Alquimista, Víbora de Brasa Jovem para disputar colunas e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine o meio de jogo combinando Fornalha Interior e Édito da Falange Dourada e Bigorna da Chama Primordial, punindo colunas congestionadas e preparando sua Expansão de Domínio (6/6).",
      "lateGame": "Invoque a Expansão de Domínio e finalize a partida com Aurarius, Majestade do Sol, Igniskar, Tirano da Cratera, Valkyra, Imperatriz Pentacromática pressionando diretamente o Soberano rival."
    },
    "signatureCombos": [
      {
        "title": "Sopro Cruzado Imperial",
        "cards": [
          "Bigorna da Chama Primordial",
          "Bigorna Dracônica da Cratera",
          "Maça Solar da Ruptura"
        ],
        "howItWorks": "Combine Bigorna da Chama Primordial + Bigorna Dracônica da Cratera + Maça Solar da Ruptura para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
      }
    ],
    "strengths": [
      "Superioridade aérea com múltiplos Dragões Lendários.",
      "Equilíbrio sólido entre ataque explosivo e defesa blindada."
    ],
    "weaknesses": [
      "Curva de custo médio elevada (3.55⚡), exigindo canalização disciplinada nos primeiros turnos."
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
      "creatures": 50,
      "spells": 28,
      "reactions": 10,
      "relics": 12,
      "ascensions": 3,
      "averageCost": 3.48
    },
    "playstyleOverview": "Combina o Congelamento e compra de cartas do Azul com a reanimação e Dreno de Vida do Roxo (50 Criaturas, 28 Feitiços, 10 Reações e 12 Relíquias). O oponente fica preso em uma teia de paralisia e perda contínua de vida.",
    "channelingStrategy": "Garanta 2 Azul e 2 Roxo cedo; canalize criaturas que você pretende reanimar mais tarde ou feitiços situacionais.",
    "positioningAndStackingGuide": "Use Aparições e Carniçais Reais com Renascer na Vanguarda para absorver pressão enquanto acumula Magos da Ilusão, Serafim dos Anéis Abissais e Lanterna das Almas na Retaguarda.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Tritão Guardião dos Recifes, Iniciado da Torre Astral, Garra Decepada Animada para disputar colunas e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine o meio de jogo combinando Sentença do Oblívio e Toque da Decomposição e Códice da Ressonância Astral, punindo colunas congestionadas e preparando sua Expansão de Domínio (6/6).",
      "lateGame": "Invoque a Expansão de Domínio e finalize a partida com Kraken da Fossa Abissal, Thalassia, A Maré Devoradora, Vesperion, Arquimago Lich Imortal pressionando diretamente o Soberano rival."
    },
    "signatureCombos": [
      {
        "title": "Pesadelo Paralisante",
        "cards": [
          "Códice da Ressonância Astral",
          "Ampulheta das Mil Mortes",
          "Cálice de Comando das Águas"
        ],
        "howItWorks": "Combine Códice da Ressonância Astral + Ampulheta das Mil Mortes + Cálice de Comando das Águas para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
      }
    ],
    "strengths": [
      "Controle absoluto de ritmo e recursos.",
      "Excelente contra baralhos de criaturas pesadas."
    ],
    "weaknesses": [
      "Exige paciência tática para fechar o jogo."
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
      "creatures": 68,
      "spells": 20,
      "reactions": 5,
      "relics": 7,
      "ascensions": 9,
      "averageCost": 2.47
    },
    "playstyleOverview": "Grimório de investida veloz (100 cartas) que une 68 feras com Ímpeto e Atropelar do Verde aos 20 feitiços de queima, 5 Reações e 7 Relíquias do Vermelho.",
    "channelingStrategy": "Canalize nos Turnos 1–4 para chegar a 5–6⚡ rapidamente; depois do Turno 5, jogue todas as cartas da mão para manter pressão máxima.",
    "positioningAndStackingGuide": "Ocupar todas as 6 colunas da Vanguarda é prioridade máxima para garantir ataques de Invasão de Coluna (+1⚔️ ATQ) nos slots onde você destruir o defensor com Flecha Explosiva.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Lebre Astral do Tempo Perdido, Víbora de Brasa Jovem, Emboscador Goblin da Mata para disputar colunas e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine o meio de jogo combinando Fúria de Sangue Vulcânico e Vigor Titânico da Selva e Botas Aladas do Mensageiro, punindo colunas congestionadas e preparando sua Expansão de Domínio (6/6).",
      "lateGame": "Invoque a Expansão de Domínio e finalize a partida com Igniskar, Tirano da Cratera, Tauron-Khor, Titã Quebra-Tronos, Ignarok, o Devorador de Reinos pressionando diretamente o Soberano rival."
    },
    "signatureCombos": [
      {
        "title": "Brecha Vulcânica",
        "cards": [
          "Botas Aladas do Mensageiro",
          "Corazón da Árvore-Mundo",
          "Orbe do Sol Aprisionado"
        ],
        "howItWorks": "Combine Botas Aladas do Mensageiro + Corazón da Árvore-Mundo + Orbe do Sol Aprisionado para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
      }
    ],
    "strengths": [
      "Pressão sufocante desde o primeiro turno.",
      "Quebra defesas passivas antes que instalem relíquias."
    ],
    "weaknesses": [
      "Pode ficar sem cartas na mão se a partida passar do Turno 14."
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
      "creatures": 42,
      "spells": 20,
      "reactions": 8,
      "relics": 30,
      "ascensions": 2,
      "averageCost": 3.34
    },
    "playstyleOverview": "Com 30 Relíquias Contínuas, 42 Criaturas e 28 Magias/Reações, a Forja Arcana transforma a Retaguarda em uma linha de montagem de escudos, compra de cartas e fortalecimento mecânico.",
    "channelingStrategy": "Nunca canalize suas Relíquias de geração de recursos (Bolsa de Conjurar, Relógio de Bolso Real); canalize feitiços duplicados.",
    "positioningAndStackingGuide": "Preencha a Retaguarda com 4 a 5 Relíquias e empilhe Autômatos e Guardiões com Escudo Divino em 3 unidades por slot na Vanguarda para proteger suas máquinas.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Coruja Astral de Vigília, Sentinela das Correntes Aéreas, Mastim Couraçado da Cidadela para disputar colunas e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine o meio de jogo combinando Pausar e Pensar um Segundo e Intervenção da Égide Angelical e Estandarte da Legião Dourada, punindo colunas congestionadas e preparando sua Expansão de Domínio (6/6).",
      "lateGame": "Invoque a Expansão de Domínio e finalize a partida com Justinian, Soberano da Ordem Eterna, Hyperion, Deus-Imperador da Aurora, Chronoleviatã, Soberano do Tempo pressionando diretamente o Soberano rival."
    },
    "signatureCombos": [
      {
        "title": "Engrenagem Perpétua",
        "cards": [
          "Estandarte da Legião Dourada",
          "Bastião do Sol Invicto",
          "Visagem Real das Cinco Coroas"
        ],
        "howItWorks": "Combine Estandarte da Legião Dourada + Bastião do Sol Invicto + Visagem Real das Cinco Coroas para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
      }
    ],
    "strengths": [
      "Economia de cartas e buffs contínuos insuperável.",
      "Altíssima taxa de vitória contra baralhos de atrito."
    ],
    "weaknesses": [
      "Espaço limitado na Retaguarda devido às 12 Relíquias."
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
      "creatures": 70,
      "spells": 15,
      "reactions": 5,
      "relics": 10,
      "ascensions": 17,
      "averageCost": 2.77
    },
    "playstyleOverview": "Potência de atrito (100 cartas) que combina a massa de 70 criaturas do Verde e Roxo com Toque Letal, Renascer, 20 Magias/Reações e 10 Relíquias.",
    "channelingStrategy": "Canalize titãs de custo 6–7 se vierem cedo demais; você pode tanto invocá-los mais tarde quanto reanimá-los.",
    "positioningAndStackingGuide": "Coloque uma unidade de Toque Letal ou Renascer na frente de cada pilha e empilhe feras de alto ATQ atrás dela no mesmo slot.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Acólito do Sol Negro, Lebre Astral do Tempo Perdido, Escolo-Couraçada da Cripta para disputar colunas e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine o meio de jogo combinando Sentença do Oblívio e Toque da Decomposição e Corazón da Árvore-Mundo, punindo colunas congestionadas e preparando sua Expansão de Domínio (6/6).",
      "lateGame": "Invoque a Expansão de Domínio e finalize a partida com Ossaurion, Dragão-Ossário Eterno, Gorgoroth, Behemoth Devorador de Montanhas, Vesperion, Arquimago Lich Imortal pressionando diretamente o Soberano rival."
    },
    "signatureCombos": [
      {
        "title": "Colheita Peçonhenta",
        "cards": [
          "Corazón da Árvore-Mundo",
          "Altar das Presas Ancestrais",
          "Ampulheta das Mil Mortes"
        ],
        "howItWorks": "Combine Corazón da Árvore-Mundo + Altar das Presas Ancestrais + Ampulheta das Mil Mortes para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
      }
    ],
    "strengths": [
      "Domina o combate entre criaturas graças a Toque Letal + Renascer.",
      "Infinita reposição de unidades."
    ],
    "weaknesses": [
      "Pouca presença de Voo para interceptar dragões na Retaguarda."
    ]
  },
  "deck_dual_blood_flame": {
    "deckId": "deck_dual_blood_flame",
    "deckName": "Grimório da Chama Sangrenta",
    "subtitle": "Pacto Duplo 🔥+💀 • Chama & Abismo",
    "domains": [
      "red",
      "purple"
    ],
    "archetypeTag": "Pacto de Corrupção & Queima (52 Criaturas / 35 Magias)",
    "compositionSummary": {
      "creatures": 52,
      "spells": 25,
      "reactions": 10,
      "relics": 13,
      "ascensions": 5,
      "averageCost": 2.9
    },
    "playstyleOverview": "Agressão sombria de 100 cartas (52 Criaturas, 25 Feitiços, 10 Reações e 13 Relíquias) que utiliza Corrupção como combustível para feitiços devastadores, Fênix velozes e Lordes Abissais.",
    "channelingStrategy": "Atinja 2 Vermelho e 2 Roxo até o Turno 4; guarde Dreno Vital e Colheita das Sombras para compensar a vida gasta em pactos.",
    "positioningAndStackingGuide": "Espalhe atacantes agressivos na Vanguarda e mantenha a Lanterna das Almas e o Caldeirão de Magma protegidos na Retaguarda.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Acólito do Sol Negro, Víbora de Brasa Jovem, Batedor Escamado das Brasas para disputar colunas e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine o meio de jogo combinando Contrato das Sete Correntes e Toque da Decomposição e Botas Aladas do Mensageiro, punindo colunas congestionadas e preparando sua Expansão de Domínio (6/6).",
      "lateGame": "Invoque a Expansão de Domínio e finalize a partida com Igniskar, Tirano da Cratera, Carmilla, Condessa de Sangue e Ouro, Ignis-Aeterna, A Fênix do Tempo Emprestado pressionando diretamente o Soberano rival."
    },
    "signatureCombos": [
      {
        "title": "Chama do Eclipse",
        "cards": [
          "Botas Aladas do Mensageiro",
          "Ampulheta das Mil Mortes",
          "Bigorna Dracônica da Cratera"
        ],
        "howItWorks": "Combine Botas Aladas do Mensageiro + Ampulheta das Mil Mortes + Bigorna Dracônica da Cratera para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
      }
    ],
    "strengths": [
      "Grande poder explosivo de dano direto e remoção."
    ],
    "weaknesses": [
      "Exige equilíbrio entre agressão e gerenciamento de VIDA/Corrupção."
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
      "creatures": 60,
      "spells": 20,
      "reactions": 8,
      "relics": 12,
      "ascensions": 9,
      "averageCost": 3.23
    },
    "playstyleOverview": "Recordista em evolução: possui 60 criaturas apoiadas por 20 Feitiços, 8 Reações e 12 Relíquias! Usa a geração de Essência extra da Selva e da Tempestade para transformar recrutas em Semideuses.",
    "channelingStrategy": "Sempre canalize nos primeiros 5 turnos! A Essência máxima elevada permite invocar e Ascender no mesmo turno.",
    "positioningAndStackingGuide": "Proteja suas unidades de Ascensão atrás de um Guardião no mesmo slot até ter Essência para despertá-las.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Sentinela das Correntes Aéreas, Tritão Guardião dos Recifes, Emboscador Goblin da Mata para disputar colunas e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine o meio de jogo combinando Fosso de Vinhas Estranguladoras e Congelar o Instante e Botas Aladas do Mensageiro, punindo colunas congestionadas e preparando sua Expansão de Domínio (6/6).",
      "lateGame": "Invoque a Expansão de Domínio e finalize a partida com Kraken da Fossa Abissal, Chelonia, A Tartaruga-Continente, Thalassia, A Maré Devoradora pressionando diretamente o Soberano rival."
    },
    "signatureCombos": [
      {
        "title": "Despertar Simultâneo",
        "cards": [
          "Botas Aladas do Mensageiro",
          "Códice da Ressonância Astral",
          "Altar das Presas Ancestrais"
        ],
        "howItWorks": "Combine Botas Aladas do Mensageiro + Códice da Ressonância Astral + Altar das Presas Ancestrais para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
      }
    ],
    "strengths": [
      "Maior teto de poder de criaturas no meio/fim de jogo.",
      "Flexibilidade entre controle e agressão."
    ],
    "weaknesses": [
      "Perder uma criatura antes de Ascendê-la reduz o ritmo se não houver backup."
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
      "creatures": 65,
      "spells": 12,
      "reactions": 5,
      "relics": 18,
      "ascensions": 15,
      "averageCost": 2.51
    },
    "playstyleOverview": "Une a Regeneração e 65 feras colossais do Verde aos Escudos Divinos, 17 Magias/Reações e 18 Relíquias do Dourado. Suas unidades simplesmente se recusam a morrer.",
    "channelingStrategy": "Canalize cartas de custo 6–7 duplicadas nos primeiros turnos para estabilizar 2 Verde e 2 Dourado.",
    "positioningAndStackingGuide": "Empilhe 3 unidades por slot combinando Guardiões Dourados na frente e feras regenerativas/arqueiros atrás.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Lâmina Voadora Consagrada, Lebre Astral do Tempo Perdido, Lanceiro da Guarda da Alvorada para disputar colunas e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine o meio de jogo combinando Renovação das Quatro Estações e Chamado da Matilha Alfa e Monólito da Presa Primordial, punindo colunas congestionadas e preparando sua Expansão de Domínio (6/6).",
      "lateGame": "Invoque a Expansão de Domínio e finalize a partida com Tellurion, Avatar Primordial da Terra Viva, Chelonia, A Tartaruga-Continente, Aurelion, O Titã Empíreo pressionando diretamente o Soberano rival."
    },
    "signatureCombos": [
      {
        "title": "Aurora Imortal",
        "cards": [
          "Monólito da Presa Primordial",
          "Estandarte da Legião Dourada",
          "Bastião do Sol Invicto"
        ],
        "howItWorks": "Combine Monólito da Presa Primordial + Estandarte da Legião Dourada + Bastião do Sol Invicto para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
      }
    ],
    "strengths": [
      "Altíssima durabilidade em combate de trincheira."
    ],
    "weaknesses": [
      "Pouca remoção direta contra a Retaguarda inimiga."
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
      "creatures": 55,
      "spells": 17,
      "reactions": 8,
      "relics": 20,
      "ascensions": 4,
      "averageCost": 3.58
    },
    "playstyleOverview": "A Catedral de Sangue e Ouro: desgasta o oponente com 55 Criaturas, 20 Relíquias Contínuas, 25 Magias/Reações, Escudos Divinos e Dreno de Vida vampírico.",
    "channelingStrategy": "Priorize 2 Roxo e 2 Dourado; mantenha sempre uma Relíquia de sustentação na mão.",
    "positioningAndStackingGuide": "Empilhe Inquisidores e Escudeiros na Vanguarda para proteger suas 20 Relíquias na Retaguarda.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Garra Decepada Animada, Legionário Ossudo, Operário de Relojoaria para disputar colunas e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine o meio de jogo combinando Sentença do Oblívio e Toque da Decomposição e Estandarte da Legião Dourada, punindo colunas congestionadas e preparando sua Expansão de Domínio (6/6).",
      "lateGame": "Invoque a Expansão de Domínio e finalize a partida com Justinian, Soberano da Ordem Eterna, Malakor, Imperador da Entropia, Malakor-Vael, Soberano da Não-Vida pressionando diretamente o Soberano rival."
    },
    "signatureCombos": [
      {
        "title": "Dízimo da Catedral",
        "cards": [
          "Carmilla, Condessa de Sangue e Ouro",
          "Talismã do Zênite Puro",
          "Cálice de Obsidiana do Sangue Imortal"
        ],
        "howItWorks": "Combine Carmilla, Condessa de Sangue e Ouro + Talismã do Zênite Puro + Cálice de Obsidiana do Sangue Imortal para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
      }
    ],
    "strengths": [
      "Sustentação de VIDA quase inesgotável para o Soberano."
    ],
    "weaknesses": [
      "Ritmo lento contra baralhos de combo ou rampa extrema."
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
      "creatures": 45,
      "spells": 33,
      "reactions": 10,
      "relics": 12,
      "ascensions": 3,
      "averageCost": 3.29
    },
    "playstyleOverview": "Tempestade de 33 Feitiços e 10 Reações de fogo e gelo apoiada por 45 Criaturas (Fênix, Wyverns e Dragões) e 12 Relíquias. Cada magia lançada limpa o caminho para ataques aéreos.",
    "channelingStrategy": "Canalize criaturas pesadas nos Turnos 1–3; conserve feitiços de custo baixo para combar com Caldeirão de Magma e Cajado do Magi.",
    "positioningAndStackingGuide": "Mantenha voadores e artilheiros na Retaguarda e use Congelamento/Queima para impedir que a Vanguarda rival contra-ataque.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Batedor Escamado das Brasas, Iniciado da Torre Astral, Diabrete de Escória Vulcânica para disputar colunas e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine o meio de jogo combinando Fornalha Interior e Fúria de Sangue Vulcânico e Botas Aladas do Mensageiro, punindo colunas congestionadas e preparando sua Expansão de Domínio (6/6).",
      "lateGame": "Invoque a Expansão de Domínio e finalize a partida com Igniskar, Tirano da Cratera, Kraken da Fossa Abissal, Pyroclasmos, Imperador das Chamas pressionando diretamente o Soberano rival."
    },
    "signatureCombos": [
      {
        "title": "Tormenta da Fênix",
        "cards": [
          "Botas Aladas do Mensageiro",
          "Códice da Ressonância Astral",
          "Turíbulo dos Quatro Ventos"
        ],
        "howItWorks": "Combine Botas Aladas do Mensageiro + Códice da Ressonância Astral + Turíbulo dos Quatro Ventos para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
      }
    ],
    "strengths": [
      "Domínio aéreo e excelente remoção em área."
    ],
    "weaknesses": [
      "Linha de frente mais leve se não comprar feitiços de controle a tempo."
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
      "creatures": 38,
      "spells": 38,
      "reactions": 12,
      "relics": 12,
      "ascensions": 2,
      "averageCost": 3.12
    },
    "playstyleOverview": "Exatamente 50% do grimório de 100 cartas são Feitiços e Reações (38 Feitiços + 12 Reações, além de 38 Criaturas e 12 Relíquias)! Une Azul, Vermelho e Roxo para controlar, queimar e drenar o oponente.",
    "channelingStrategy": "Nos Turnos 1–3, canalize 1 carta da cor que faltar para ter 🔵+🔴+🟣 ativos; depois canalize apenas criaturas excedentes.",
    "positioningAndStackingGuide": "Posicione seus 38 especialistas (Magos, Artilheiros, Dragões) em slots protegidos e mantenha sempre 1–2 Reações armadas na Retaguarda.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Sentinela das Correntes Aéreas, Tritão Guardião dos Recifes, Batedor Escamado das Brasas para disputar colunas e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine o meio de jogo combinando Fornalha Interior e Fúria de Sangue Vulcânico e Cálice de Obsidiana do Sangue Imortal, punindo colunas congestionadas e preparando sua Expansão de Domínio (6/6).",
      "lateGame": "Invoque a Expansão de Domínio e finalize a partida com Kraken da Fossa Abissal, Ossaurion, Dragão-Ossário Eterno, Aureon, Dragão da Geada Astral pressionando diretamente o Soberano rival."
    },
    "signatureCombos": [
      {
        "title": "Tríade do Cataclismo",
        "cards": [
          "Cálice de Obsidiana do Sangue Imortal",
          "Turíbulo dos Quatro Ventos",
          "Ampulheta das Mil Mortes"
        ],
        "howItWorks": "Combine Cálice de Obsidiana do Sangue Imortal + Turíbulo dos Quatro Ventos + Ampulheta das Mil Mortes para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
      }
    ],
    "strengths": [
      "Respostas versáteis para absolutamente qualquer ameaça no jogo."
    ],
    "weaknesses": [
      "Exige precisão na escolha de qual cor canalizar nos 3 primeiros turnos."
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
      "creatures": 82,
      "spells": 8,
      "reactions": 3,
      "relics": 7,
      "ascensions": 9,
      "averageCost": 2.65
    },
    "playstyleOverview": "Avalanche tripartida de Selva, Chama e Ordem com 82 criaturas em 100 cartas (82%)! Dinossauros, Dragões, Grifos e Colossos avançam sem trégua.",
    "channelingStrategy": "Canalize qualquer criatura de custo 4–5 nos primeiros turnos para corrigir as 3 cores (🟢+🔴+🟡) e acelerar até 7⚡.",
    "positioningAndStackingGuide": "Empilhe 2–3 unidades por slot em todas as colunas ofensivas; use o Julgamento Solar e Chamado da Selva para abrir caminho.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Lâmina Voadora Consagrada, Lebre Astral do Tempo Perdido, Homúnculo do Alquimista para disputar colunas e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine o meio de jogo combinando Mandíbula da Fenda Tectônica e Emboscada do Gêiser Piroclástico e Martelo Forjado em Estrela, punindo colunas congestionadas e preparando sua Expansão de Domínio (6/6).",
      "lateGame": "Invoque a Expansão de Domínio e finalize a partida com Pyroclasmos, Imperador das Chamas, Magmarok, o Tirano Piroclástico, Ignis-Vael, Príncipe do Núcleo Ardente pressionando diretamente o Soberano rival."
    },
    "signatureCombos": [
      {
        "title": "Investida dos Três Reinos",
        "cards": [
          "Martelo Forjado em Estrela",
          "Monólito de Comando da Terra",
          "Orbe do Sol Aprisionado"
        ],
        "howItWorks": "Combine Martelo Forjado em Estrela + Monólito de Comando da Terra + Orbe do Sol Aprisionado para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
      }
    ],
    "strengths": [
      "Pressão física esmagadora em todos os turnos da partida."
    ],
    "weaknesses": [
      "Apenas 4 magias no baralho — depende do combate de unidades para remover ameaças."
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
      "creatures": 40,
      "spells": 17,
      "reactions": 8,
      "relics": 35,
      "ascensions": 0,
      "averageCost": 3.25
    },
    "playstyleOverview": "O maior arsenal de relíquias do jogo: 35 Relíquias Contínuas (35% do grimório de 100 cartas), 40 Criaturas e 25 Magias/Reações que transformam a Retaguarda em uma fortaleza sagrada de efeitos passivos.",
    "channelingStrategy": "Canalize criaturas duplicadas nos Turnos 1–3 para fixar 🟡+🔵+🟣; preserve os artefatos lendários (Relógio da Eternidade, Arca da Aliança).",
    "positioningAndStackingGuide": "Ocupar 4 a 5 slots da Retaguarda com Relíquias e empilhar todas as suas criaturas em 3 por slot na Vanguarda para maximizar os buffs em área das Relíquias.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Errante das Catacumbas, Sentinela das Correntes Aéreas, Tritão Guardião dos Recifes para disputar colunas e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine o meio de jogo combinando Sentença do Oblívio e Visão do Oráculo Astral e Estandarte da Legião Dourada, punindo colunas congestionadas e preparando sua Expansão de Domínio (6/6).",
      "lateGame": "Invoque a Expansão de Domínio e finalize a partida com Aurelion, O Titã Empíreo, Malakor-Vael, Soberano da Não-Vida, Heliodor, Dragão do Sol Nascente pressionando diretamente o Soberano rival."
    },
    "signatureCombos": [
      {
        "title": "Catedral das Catorze Relíquias",
        "cards": [
          "Estandarte da Legião Dourada",
          "Astrolábio das Eras Eternas",
          "Estandarte da Legião Dourada"
        ],
        "howItWorks": "Combine Estandarte da Legião Dourada + Astrolábio das Eras Eternas + Estandarte da Legião Dourada para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
      }
    ],
    "strengths": [
      "O final de jogo mais poderoso em geração passiva de valor."
    ],
    "weaknesses": [
      "Vulnerável nos primeiros 3 turnos se comprar apenas relíquias caras."
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
      "creatures": 68,
      "spells": 15,
      "reactions": 7,
      "relics": 10,
      "ascensions": 6,
      "averageCost": 2.79
    },
    "playstyleOverview": "Aliança sombria entre Abismo, Selva e Chama: 68 criaturas ferozes e mortas-vivas (com 15 Feitiços, 7 Reações e 10 Relíquias) que atacam sem medo da morte, pois retornam mais fortes da Cripta.",
    "channelingStrategy": "Garanta 🟣+🟢+🔴 cedo; canalize criaturas pesadas sabendo que Exumar Legião e Príncipe dos Mortos podem trazê-las de volta.",
    "positioningAndStackingGuide": "Use unidades com Renascer e Toque Letal na linha de frente das pilhas para proteger os causadores de dano (Meio-Dragão, Sombra Assassina).",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Acólito do Sol Negro, Víbora de Brasa Jovem, Escolo-Couraçada da Cripta para disputar colunas e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine o meio de jogo combinando Toque da Decomposição e Fosso de Vinhas Estranguladoras e Trono de Ossos do Arquimago, punindo colunas congestionadas e preparando sua Expansão de Domínio (6/6).",
      "lateGame": "Invoque a Expansão de Domínio e finalize a partida com Vesperion, Arquimago Lich Imortal, Malakor-Vael, Soberano da Não-Vida, Carmilla, Condessa de Sangue e Ouro pressionando diretamente o Soberano rival."
    },
    "signatureCombos": [
      {
        "title": "Noite de Malakor-Vael",
        "cards": [
          "Trono de Ossos do Arquimago",
          "Ampulheta das Mil Mortes",
          "Bigorna Dracônica da Cratera"
        ],
        "howItWorks": "Combine Trono de Ossos do Arquimago + Ampulheta das Mil Mortes + Bigorna Dracônica da Cratera para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
      }
    ],
    "strengths": [
      "Resiliência absurda contra remoções em área."
    ],
    "weaknesses": [
      "Poucas unidades com Escudo Divino contra dano perfurante."
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
      "creatures": 62,
      "spells": 15,
      "reactions": 5,
      "relics": 18,
      "ascensions": 9,
      "averageCost": 3.14
    },
    "playstyleOverview": "Une 62 Criaturas (Anjos, Esfinges, Leviatãs e a Tartaruga-Continente) sob a proteção de 18 Relíquias e 20 Magias/Reações de Ordem, Selva e Tempestade.",
    "channelingStrategy": "Canalize nos Turnos 1–4 para atingir 🟡+🟢+🔵 e acelerar até os colossos de custo 6–7.",
    "positioningAndStackingGuide": "Coloque Guardiões regenerativos na Vanguarda e mantenha Arcontes, Magos e Relíquias na Retaguarda.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Lâmina Voadora Consagrada, Coruja Astral de Vigília, Sentinela das Correntes Aéreas para disputar colunas e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine o meio de jogo combinando Vigor Titânico da Selva e Intervenção da Égide Angelical e Monólito da Presa Primordial, punindo colunas congestionadas e preparando sua Expansão de Domínio (6/6).",
      "lateGame": "Invoque a Expansão de Domínio e finalize a partida com Chelonia, A Tartaruga-Continente, Orion, Arconte da Tempestade Astral, Aurelion, O Titã Empíreo pressionando diretamente o Soberano rival."
    },
    "signatureCombos": [
      {
        "title": "Horizonte Inexpugnável",
        "cards": [
          "Monólito da Presa Primordial",
          "Talismã do Zênite Puro",
          "Altar das Presas Ancestrais"
        ],
        "howItWorks": "Combine Monólito da Presa Primordial + Talismã do Zênite Puro + Altar das Presas Ancestrais para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
      }
    ],
    "strengths": [
      "Forte equilíbrio entre defesa terrestre, poder aéreo e relíquias."
    ],
    "weaknesses": [
      "Menos feitiços de dano direto para finalizar sem combate."
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
      "creatures": 40,
      "spells": 25,
      "reactions": 10,
      "relics": 25,
      "ascensions": 0,
      "averageCost": 3.55
    },
    "playstyleOverview": "Grimório temático da Ordem do Relógio Eterno (100 cartas): combina 25 Relíquias temporais com 35 magias/reações de manipulação do tempo e 40 campeões horológicos.",
    "channelingStrategy": "Preserve o Relógio de Bolso Real e a Roda do Tempo; canalize criaturas duplicadas para atingir 2 Azul e 2 Dourado.",
    "positioningAndStackingGuide": "Instale seus relógios e pêndulos na Retaguarda e agrupe Guerreiros Horologistas e Paladinos do Destino em pilhas protegidas na Vanguarda.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Tritão Guardião dos Recifes, Iniciado do Relógio Astral, Operário de Relojoaria para disputar colunas e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine o meio de jogo combinando Pausar e Pensar um Segundo e Intervenção da Égide Angelical e Astrolábio das Eras Eternas, punindo colunas congestionadas e preparando sua Expansão de Domínio (6/6).",
      "lateGame": "Invoque a Expansão de Domínio e finalize a partida com Orion, Arconte da Tempestade Astral, Aegirion, Soberano das Fendas Abissais, Aureon, Dragão da Geada Astral pressionando diretamente o Soberano rival."
    },
    "signatureCombos": [
      {
        "title": "Badalada da Meia-Noite",
        "cards": [
          "Estandarte da Legião Dourada",
          "Cálice Real da Alvorada",
          "Astrolábio das Eras Eternas"
        ],
        "howItWorks": "Combine Estandarte da Legião Dourada + Cálice Real da Alvorada + Astrolábio das Eras Eternas para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
      }
    ],
    "strengths": [
      "Sinergia altíssima entre Relíquias temporais e Congelamento."
    ],
    "weaknesses": [
      "Exige proteger a Retaguarda contra invasões rápidas."
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
      "creatures": 65,
      "spells": 15,
      "reactions": 5,
      "relics": 15,
      "ascensions": 0,
      "averageCost": 2.89
    },
    "playstyleOverview": "Une os 5 Domínios Elementais sob o comando de Valkyra (65 Criaturas, 15 Feitiços, 5 Reações e 15 Relíquias), canalizando artefatos prismáticos para invocar dragões e lendas de todas as cores!",
    "channelingStrategy": "Use o Altar da Canalização para descartar cartas de custo baixo no meio do jogo e alcançar rapidamente os custos 6 e 7 de Valkyra.",
    "positioningAndStackingGuide": "Combine palavras-chave complementares no mesmo slot: Guardião Dourado na frente + Fera Verde no meio + Artilheiro Azul/Vermelho atrás!",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Lâmina Voadora Consagrada, Sentinela das Correntes Aéreas, Tritão Guardião dos Recifes para disputar colunas e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine o meio de jogo combinando Sentença do Oblívio e Toque da Decomposição e Astrolábio das Eras Eternas, punindo colunas congestionadas e preparando sua Expansão de Domínio (6/6).",
      "lateGame": "Invoque a Expansão de Domínio e finalize a partida com Valkyra, Imperatriz Pentacromática, Pyroclasmos, Imperador das Chamas, Orion, Arconte da Tempestade Astral pressionando diretamente o Soberano rival."
    },
    "signatureCombos": [
      {
        "title": "Despertar Pentacromático",
        "cards": [
          "Valkyra, Imperatriz Pentacromática",
          "Astrolábio das Eras Eternas",
          "Bigorna Dracônica da Cratera"
        ],
        "howItWorks": "Combine Valkyra, Imperatriz Pentacromática + Astrolábio das Eras Eternas + Bigorna Dracônica da Cratera para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
      }
    ],
    "strengths": [
      "Acesso às melhores cartas de todos os cinco domínios."
    ],
    "weaknesses": [
      "Cartas de Afinidade 3 exigem canalizar a cor específica adicionalmente."
    ]
  },
  "deck_tri_astral_cataclysm": {
    "deckId": "deck_tri_astral_cataclysm",
    "deckName": "Grimório da Convergência Astral",
    "subtitle": "Pacto Triplo ❄️+🔥+☀️ • Tempestade, Chama & Ordem",
    "domains": [
      "red",
      "blue",
      "purple"
    ],
    "archetypeTag": "Sobrecarga de Feitiços & Queima (35 Criaturas / 53 Magias & Reações!)",
    "compositionSummary": {
      "creatures": 35,
      "spells": 40,
      "reactions": 13,
      "relics": 12,
      "ascensions": 8,
      "averageCost": 3.08
    },
    "playstyleOverview": "A versão mais explosiva da cabala 🔴+🔵+🟣: com 35 criaturas, 53 Magias/Reações (40 Feitiços + 13 Reações) e 12 Relíquias de gatilho arcano, cada turno transforma-se em uma barragem de raios, meteoros e drenos.",
    "channelingStrategy": "Canalize criaturas situacionais nos Turnos 1–3 para ativar as 3 cores; nunca canalize Fornalha Dracônica, Coroa das Tempestades ou Grimório do Necromante.",
    "positioningAndStackingGuide": "Mantenha Piromante Lança-Chamas e Arquimago da Tempestade na Retaguarda junto com suas 12 Relíquias de Ao Lançar Feitiço, e use suas 13 Reações para impedir que o inimigo encoste neles.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Iniciado Rúnico da Torre, Batedor Escamado das Brasas, Diabrete de Escória Vulcânica para disputar colunas e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine o meio de jogo combinando Fornalha Interior e Fúria de Sangue Vulcânico e Trono de Ossos do Arquimago, punindo colunas congestionadas e preparando sua Expansão de Domínio (6/6).",
      "lateGame": "Invoque a Expansão de Domínio e finalize a partida com Pyroclasmos, Imperador das Chamas, Aegirion, Soberano das Fendas Abissais, Zephyros, O Dragão da Tempestade Astral pressionando diretamente o Soberano rival."
    },
    "signatureCombos": [
      {
        "title": "Bateria de Gatilhos Arcanos",
        "cards": [
          "Fornalha das Escamas Rubras",
          "Trono de Ossos do Arquimago",
          "Cálice da Sede Carmesim"
        ],
        "howItWorks": "Combine Fornalha das Escamas Rubras + Trono de Ossos do Arquimago + Cálice da Sede Carmesim para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
      }
    ],
    "strengths": [
      "Destrói formações inimigas sem precisar travar combate corpo a corpo."
    ],
    "weaknesses": [
      "Baixa contagem de criaturas exige proteger bem seus conjuradores."
    ]
  },
  "deck_tri_primordial_forge": {
    "deckId": "deck_tri_primordial_forge",
    "deckName": "Códice dos Behemoths de Obsidiana",
    "subtitle": "Pacto Triplo 🌿+🔥+💀 • Selva, Chama & Abismo",
    "domains": [
      "red",
      "green",
      "gold"
    ],
    "archetypeTag": "Falange de Colossos & Atropelar (78 Criaturas Pesadas)",
    "compositionSummary": {
      "creatures": 78,
      "spells": 10,
      "reactions": 5,
      "relics": 7,
      "ascensions": 12,
      "averageCost": 2.66
    },
    "playstyleOverview": "Rolo compressor tripartido: 78 criaturas blindadas e ferozes de Chama, Selva e Ordem (com 10 Feitiços, 5 Reações e 7 Relíquias), culminando nos Dragões Anciões Soberanos.",
    "channelingStrategy": "Canalize todo turno até atingir 7⚡ de Essência máxima; cada compra no fim de jogo é um titã capaz de vencer sozinho.",
    "positioningAndStackingGuide": "Empilhe Guardiões (Urso Rúnico, Lanceiro da Alvorada) com atacantes de Atropelar (Berserker Dracônico, Gorila Esmeralda) e dispare Levante da Selva (+2/+2 para todos).",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Lâmina Voadora Consagrada, Lanceiro da Guarda da Alvorada, Homúnculo do Alquimista para disputar colunas e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine o meio de jogo combinando Fosso de Vinhas Estranguladoras e Armadilha Piroclástica e Visagem Real das Cinco Coroas, punindo colunas congestionadas e preparando sua Expansão de Domínio (6/6).",
      "lateGame": "Invoque a Expansão de Domínio e finalize a partida com Khorvath, O Dragão Vulcânico Ancião, Silvathor, O Dragão-Floresta Ancião, Polydra, A Hidra de Nove Cabeças pressionando diretamente o Soberano rival."
    },
    "signatureCombos": [
      {
        "title": "Forja dos Três Anciões",
        "cards": [
          "Rex Primordial da Cratera Verde",
          "Martelo Forjado em Estrela",
          "Visagem Real das Cinco Coroas"
        ],
        "howItWorks": "Combine Rex Primordial da Cratera Verde + Martelo Forjado em Estrela + Visagem Real das Cinco Coroas para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
      }
    ],
    "strengths": [
      "Domínio físico absoluto e altíssima taxa de vitória (63,8%)."
    ],
    "weaknesses": [
      "Poucas Reações; joga de forma proativa e agressiva."
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
      "creatures": 62,
      "spells": 22,
      "reactions": 8,
      "relics": 8,
      "ascensions": 12,
      "averageCost": 3.04
    },
    "playstyleOverview": "Potência de meio e fim de jogo (62 Criaturas, 22 Feitiços, 8 Reações e 8 Relíquias): combina Congelamento em área do Azul, evolução e feras regenerativas do Verde, e reanimação necrótica do Roxo.",
    "channelingStrategy": "Canalize nos primeiros 4 turnos para garantir 🔵+🟣+🟢 e ativar Semente da Árvore-Mundo o quanto antes.",
    "positioningAndStackingGuide": "Trave as colunas perigosas do inimigo com Serpente Constritora e Leviatã Abissal enquanto empilha unidades de Toque Letal e Dreno de Vida.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Sentinela das Correntes Aéreas, Iniciado Rúnico da Torre, Tritão Guardião dos Recifes para disputar colunas e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine o meio de jogo combinando Visão do Oráculo Astral e Fosso de Vinhas Estranguladoras e Astrolábio das Eras Eternas, punindo colunas congestionadas e preparando sua Expansão de Domínio (6/6).",
      "lateGame": "Invoque a Expansão de Domínio e finalize a partida com Morgath, O Dragão da Chama Necrótica, Orion, Arconte da Tempestade Astral, Silvathor, O Dragão-Floresta Ancião pressionando diretamente o Soberano rival."
    },
    "signatureCombos": [
      {
        "title": "Sopro de Gelo e Morte",
        "cards": [
          "Serpente Leviatã das Fendas",
          "Morgath, O Dragão da Chama Necrótica",
          "Despertar da Legião Eterna"
        ],
        "howItWorks": "Congela toda a Vanguarda inimiga e reanima colossos abatidos no mesmo turno."
      }
    ],
    "strengths": [
      "Combina os três melhores mecanismos de atrito: Congelar, Regenerar e Reanimar."
    ],
    "weaknesses": [
      "Requer sequência correta de cores nos primeiros turnos."
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
      "creatures": 50,
      "spells": 20,
      "reactions": 10,
      "relics": 20,
      "ascensions": 8,
      "averageCost": 2.77
    },
    "playstyleOverview": "Funde a disciplina blindada da Ordem Solar com o Dreno de Vida vampírico e a queima vulcânica. Suas 20 Relíquias Imperiais sustentam uma linha de frente de 50 Justicares, Vampiros e Serafins.",
    "channelingStrategy": "Priorize Afinidade Dourada e Roxa nos Turnos 1–3 para estabilizar a Vanguarda e instalar suas primeiras Relíquias.",
    "positioningAndStackingGuide": "Coloque Guardiões com Escudo Divino na frente das pilhas e posicione 4 Relíquias contínuas na Retaguarda.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Errante das Catacumbas, Mastim Couraçado da Cidadela, Escudeiro da Alvorada para disputar colunas e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine o meio de jogo combinando Fornalha Interior e Édito da Falange Dourada e Estandarte da Legião Dourada, punindo colunas congestionadas e preparando sua Expansão de Domínio (6/6).",
      "lateGame": "Invoque a Expansão de Domínio e finalize a partida com Pyroclasmos, Imperador das Chamas, Seraphiel, A Imperatriz das Seis Asas, Nosferatu, Monarca Carmesim pressionando diretamente o Soberano rival."
    },
    "signatureCombos": [
      {
        "title": "Decreto do Sol Carmesim",
        "cards": [
          "Seraphiel, A Imperatriz das Seis Asas",
          "Vladislaus, O Patriarca de Sangue",
          "Estandarte da Legião Dourada"
        ],
        "howItWorks": "Combine Seraphiel, A Imperatriz das Seis Asas + Vladislaus, O Patriarca de Sangue + Estandarte da Legião Dourada para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
      }
    ],
    "strengths": [
      "Forte sustentação de VIDA e proteção com Escudo Divino em área."
    ],
    "weaknesses": [
      "Menos compra de cartas que os baralhos com domínio Azul."
    ]
  },
  "deck_tri_eternal_horizon": {
    "deckId": "deck_tri_eternal_horizon",
    "deckName": "Códice do Horizonte Eterno",
    "subtitle": "Pacto Triplo 🌿+☀️+💀 • Selva, Ordem & Abismo",
    "domains": [
      "blue",
      "green",
      "gold"
    ],
    "archetypeTag": "Cidadela Guardiã & Rampa de Relíquias (58 Criaturas / 20 Relíquias)",
    "compositionSummary": {
      "creatures": 58,
      "spells": 15,
      "reactions": 7,
      "relics": 20,
      "ascensions": 12,
      "averageCost": 2.85
    },
    "playstyleOverview": "Aliança luminosa entre Tempestade, Selva e Ordem: ergue uma muralha intransponível de 58 Guardiões e Campeões enquanto 20 Relíquias geram Essência, cartas e buffs a cada turno.",
    "channelingStrategy": "Canalize duplicatas de custo alto nos Turnos 1–3; a Semente da Árvore-Mundo e a Coroa do Imperador acelerarão sua Essência rapidamente.",
    "positioningAndStackingGuide": "Empilhe Guardiões (Sentinela de Safira, Urso Rúnico, Colosso Celestial) na Vanguarda e preencha a Retaguarda com Relíquias e Magos de Alcance.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Lâmina Voadora Consagrada, Lanceiro da Guarda da Alvorada, Sentinela das Correntes Aéreas para disputar colunas e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine o meio de jogo combinando Fosso de Vinhas Estranguladoras e Congelar o Instante e Estandarte da Legião Dourada, punindo colunas congestionadas e preparando sua Expansão de Domínio (6/6).",
      "lateGame": "Invoque a Expansão de Domínio e finalize a partida com Tellurion, Avatar Primordial da Terra Viva, Orion, Arconte da Tempestade Astral, Aurion-Sol, O Dragão Imperial do Zênite pressionando diretamente o Soberano rival."
    },
    "signatureCombos": [
      {
        "title": "Horizonte Dourado",
        "cards": [
          "Aurion-Sol, O Dragão Imperial do Zênite",
          "Estandarte da Legião Dourada",
          "Corazón da Árvore-Mundo"
        ],
        "howItWorks": "Combine Aurion-Sol, O Dragão Imperial do Zênite + Estandarte da Legião Dourada + Corazón da Árvore-Mundo para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
      }
    ],
    "strengths": [
      "Defesa quase impenetrável com excelente geração de Essência e compra."
    ],
    "weaknesses": [
      "Partidas mais longas e metódicas."
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
      "creatures": 85,
      "spells": 8,
      "reactions": 2,
      "relics": 5,
      "ascensions": 15,
      "averageCost": 2.81
    },
    "playstyleOverview": "O baralho com maior densidade de criaturas de todo o jogo (85 criaturas em 100 cartas — 85%)! Projetado especificamente para explorar a mecânica de Empilhamento de Esquadrão (até 3 cartas por slot), enchendo o tabuleiro em tempo recorde e multiplicando bônus em área.",
    "channelingStrategy": "Você só precisa canalizar nos Turnos 1 a 3 (até 5⚡ de Essência). A partir do Turno 4, pare de canalizar e despeje 2 a 3 criaturas por turno no tabuleiro!",
    "positioningAndStackingGuide": "Regra de Ouro da Falange: monte pilhas completas de 3 unidades por slot! Coloque sempre um Guardião com Escudo Divino (Autômato de Bronze, Lanceiro da Alvorada) na posição 1 (frente da pilha) e duas unidades de ataque/Alcance atrás dele no mesmo slot. Quando você lançar Formação dos Mil Escudos ou Levante da Selva, cada slot de 3 unidades receberá +6/+6 de atributos totais combinados!",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Lince dos Espinhos, Lâmina Voadora Consagrada, Paladino do Brasão Solar para disputar colunas e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine o meio de jogo combinando Correntes Sagradas da Catedral e Faro do Predador Alfa e Estandarte da Legião Dourada, punindo colunas congestionadas e preparando sua Expansão de Domínio (6/6).",
      "lateGame": "Invoque a Expansão de Domínio e finalize a partida com Tellurion, Avatar Primordial da Terra Viva, Justinian, Soberano da Ordem Eterna, Sylvanhorn, Patriarca da Selva Eterna pressionando diretamente o Soberano rival."
    },
    "signatureCombos": [
      {
        "title": "Falange Tripla Multiplicadora",
        "cards": [
          "Estandarte da Legião Dourada",
          "Talismã do Zênite Puro",
          "Altar das Presas Ancestrais"
        ],
        "howItWorks": "Combine Estandarte da Legião Dourada + Talismã do Zênite Puro + Altar das Presas Ancestrais para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
      },
      {
        "title": "Escudo da Legião",
        "cards": [
          "Colosso de Mármore e Ouro",
          "Tellurion, Avatar Primordial da Terra Viva",
          "Justinian, Soberano da Ordem Eterna"
        ],
        "howItWorks": "Articule Colosso de Mármore e Ouro + Tellurion, Avatar Primordial da Terra Viva + Justinian, Soberano da Ordem Eterna nos turnos decisivos para quebrar a linha de Guardiões rivais e abrir letal contra o Soberano inimigo."
      }
    ],
    "strengths": [
      "Melhor aproveitamento da mecânica de 3 unidades por slot do jogo.",
      "Multiplica exponencialmente qualquer efeito `buff_all_allies` e `shield_all_allies`.",
      "Curva ultrarrápida (2.47⚡) que nunca trava na mão inicial."
    ],
    "weaknesses": [
      "Deve guardar Escudo Divino (Mestre da Forja / Égide Inquebrável) contra baralhos de Sopro Dracônico se empilhar unidades sem proteção."
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
      "creatures": 38,
      "spells": 32,
      "reactions": 15,
      "relics": 15,
      "ascensions": 8,
      "averageCost": 3.06
    },
    "playstyleOverview": "Especialista em bombardeio de longo alcance e controle tático: empilha 38 artilheiros, magos com Alcance e Guardiões de Safira enquanto controla o campo com 32 Feitiços, 15 Reações ocultas e 15 Relíquias.",
    "channelingStrategy": "Canalize nos primeiros turnos para destravar suas afinidades; mantenha sempre Essência disponível para acionar suas 15 Reações e Emboscadas.",
    "positioningAndStackingGuide": "Coloque Sentinela de Safira, Colosso de Obsidiana e Leviatã na Vanguarda, e empilhe 2–3 Artilheiros de Alcance (Artilheiro de Magma, Piromante Lança-Chamas, Arquimago) num mesmo slot da Retaguarda.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Sentinela das Correntes Aéreas, Iniciado Rúnico da Torre, Iniciado da Torre Astral para disputar colunas e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine o meio de jogo combinando Fornalha Interior e Fúria de Sangue Vulcânico e Botas Aladas do Mensageiro, punindo colunas congestionadas e preparando sua Expansão de Domínio (6/6).",
      "lateGame": "Invoque a Expansão de Domínio e finalize a partida com Dragão de Safira Sônico, Khorvath, O Dragão Vulcânico Ancião, Orion, Arconte da Tempestade Astral pressionando diretamente o Soberano rival."
    },
    "signatureCombos": [
      {
        "title": "Bateria de Morteiros Arcanos",
        "cards": [
          "Piromante Lança-Chamas",
          "Arquimago da Cidadela Flutuante",
          "Botas Aladas do Mensageiro"
        ],
        "howItWorks": "Combine Piromante Lança-Chamas + Arquimago da Cidadela Flutuante + Botas Aladas do Mensageiro para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
      }
    ],
    "strengths": [
      "Ataca da Retaguarda sem sofrer contra-ataque de unidades corpo a corpo."
    ],
    "weaknesses": [
      "Exige manter pelo menos um Guardião vivo na Vanguarda para evitar Invasão."
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
      "creatures": 50,
      "spells": 20,
      "reactions": 5,
      "relics": 25,
      "ascensions": 6,
      "averageCost": 3.53
    },
    "playstyleOverview": "Convergência suprema dos cinco domínios (50 Criaturas, 20 Feitiços, 5 Reações e 25 Relíquias): utiliza 25 Relíquias Prismáticas e geradoras de Essência e compra para invocar todos os Dragões Anciões Lendários do jogo!",
    "channelingStrategy": "Canalize nos Turnos 1–4 qualquer carta que não seja geradora de Essência para chegar rapidamente a 7⚡ e 3 pontos de afinidade nos seus Dragões Anciões.",
    "positioningAndStackingGuide": "Dedique 3–4 slots da Retaguarda às suas Relíquias Prismáticas (Graal Infinito, Relógio da Eternidade, Santuário da Ordem) e domine a Vanguarda com uma esquadrilha de Dragões Lendários.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Lanceiro da Guarda da Alvorada, Sentinela das Correntes Aéreas, Iniciado Rúnico da Torre para disputar colunas e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine o meio de jogo combinando Fornalha Interior e Fúria de Sangue Vulcânico e Estandarte da Legião Dourada, punindo colunas congestionadas e preparando sua Expansão de Domínio (6/6).",
      "lateGame": "Invoque a Expansão de Domínio e finalize a partida com Valkyra, Imperatriz Pentacromática, Dragão Umbral do Eclipse, Khorvath, O Dragão Vulcânico Ancião pressionando diretamente o Soberano rival."
    },
    "signatureCombos": [
      {
        "title": "Concílio dos Seis Dragões",
        "cards": [
          "Valkyra, Imperatriz Pentacromática",
          "Estandarte da Legião Dourada",
          "Monólito da Presa Primordial"
        ],
        "howItWorks": "Combine Valkyra, Imperatriz Pentacromática + Estandarte da Legião Dourada + Monólito da Presa Primordial para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
      }
    ],
    "strengths": [
      "Maior poder de fogo tardio do jogo com acesso aos 5 Dragões Anciões e Valkyra.",
      "10 Relíquias de alto impacto garantem vantagem de Essência e cartas."
    ],
    "weaknesses": [
      "Curva pesada (3.88⚡): depende de canalizar e usar aceleradores nos 3 primeiros turnos."
    ]
  }
};

export const EMPIRICAL_WIN_RATES: Record<string, Record<string, number>> = {
  "deck_red_inferno": {
    "deck_blue_tempest": 52,
    "deck_purple_abyss": 52,
    "deck_green_wild": 48,
    "deck_gold_bastion": 50,
    "deck_dual_draconic_pact": 48,
    "deck_dual_abyssal_storm": 48,
    "deck_dual_primal_fury": 50,
    "deck_dual_arcane_forge": 52,
    "deck_dual_eternal_rot": 52,
    "deck_dual_blood_flame": 50,
    "deck_dual_wild_evolution": 50,
    "deck_dual_solar_wild": 48,
    "deck_dual_iron_inquisition": 48,
    "deck_dual_storm_dragon": 48,
    "deck_tri_arcane_cataclysm": 48,
    "deck_tri_primal_titans": 52,
    "deck_tri_eternal_reliquary": 52,
    "deck_tri_blood_moon": 50,
    "deck_tri_celestial_scales": 50,
    "deck_spec_chronomancer": 50,
    "deck_spec_pentachromatic": 52,
    "deck_tri_astral_cataclysm": 48,
    "deck_tri_primordial_forge": 52,
    "deck_tri_abyssal_chimera": 48,
    "deck_tri_crimson_sun": 52,
    "deck_tri_eternal_horizon": 52,
    "deck_squad_thousand_shields": 48,
    "deck_squad_siege_battery": 48,
    "deck_penta_valkyra_pact": 48
  },
  "deck_blue_tempest": {
    "deck_red_inferno": 48,
    "deck_purple_abyss": 52,
    "deck_green_wild": 48,
    "deck_gold_bastion": 50,
    "deck_dual_draconic_pact": 50,
    "deck_dual_abyssal_storm": 52,
    "deck_dual_primal_fury": 48,
    "deck_dual_arcane_forge": 52,
    "deck_dual_eternal_rot": 50,
    "deck_dual_blood_flame": 48,
    "deck_dual_wild_evolution": 52,
    "deck_dual_solar_wild": 52,
    "deck_dual_iron_inquisition": 52,
    "deck_dual_storm_dragon": 48,
    "deck_tri_arcane_cataclysm": 50,
    "deck_tri_primal_titans": 48,
    "deck_tri_eternal_reliquary": 50,
    "deck_tri_blood_moon": 50,
    "deck_tri_celestial_scales": 52,
    "deck_spec_chronomancer": 48,
    "deck_spec_pentachromatic": 50,
    "deck_tri_astral_cataclysm": 48,
    "deck_tri_primordial_forge": 52,
    "deck_tri_abyssal_chimera": 50,
    "deck_tri_crimson_sun": 52,
    "deck_tri_eternal_horizon": 48,
    "deck_squad_thousand_shields": 52,
    "deck_squad_siege_battery": 50,
    "deck_penta_valkyra_pact": 50
  },
  "deck_purple_abyss": {
    "deck_red_inferno": 48,
    "deck_blue_tempest": 48,
    "deck_green_wild": 50,
    "deck_gold_bastion": 48,
    "deck_dual_draconic_pact": 48,
    "deck_dual_abyssal_storm": 50,
    "deck_dual_primal_fury": 52,
    "deck_dual_arcane_forge": 48,
    "deck_dual_eternal_rot": 48,
    "deck_dual_blood_flame": 52,
    "deck_dual_wild_evolution": 48,
    "deck_dual_solar_wild": 52,
    "deck_dual_iron_inquisition": 50,
    "deck_dual_storm_dragon": 48,
    "deck_tri_arcane_cataclysm": 50,
    "deck_tri_primal_titans": 48,
    "deck_tri_eternal_reliquary": 50,
    "deck_tri_blood_moon": 52,
    "deck_tri_celestial_scales": 52,
    "deck_spec_chronomancer": 48,
    "deck_spec_pentachromatic": 50,
    "deck_tri_astral_cataclysm": 52,
    "deck_tri_primordial_forge": 52,
    "deck_tri_abyssal_chimera": 50,
    "deck_tri_crimson_sun": 52,
    "deck_tri_eternal_horizon": 48,
    "deck_squad_thousand_shields": 52,
    "deck_squad_siege_battery": 48,
    "deck_penta_valkyra_pact": 52
  },
  "deck_green_wild": {
    "deck_red_inferno": 52,
    "deck_blue_tempest": 52,
    "deck_purple_abyss": 50,
    "deck_gold_bastion": 48,
    "deck_dual_draconic_pact": 48,
    "deck_dual_abyssal_storm": 48,
    "deck_dual_primal_fury": 50,
    "deck_dual_arcane_forge": 50,
    "deck_dual_eternal_rot": 48,
    "deck_dual_blood_flame": 50,
    "deck_dual_wild_evolution": 48,
    "deck_dual_solar_wild": 52,
    "deck_dual_iron_inquisition": 48,
    "deck_dual_storm_dragon": 50,
    "deck_tri_arcane_cataclysm": 52,
    "deck_tri_primal_titans": 48,
    "deck_tri_eternal_reliquary": 50,
    "deck_tri_blood_moon": 52,
    "deck_tri_celestial_scales": 52,
    "deck_spec_chronomancer": 48,
    "deck_spec_pentachromatic": 52,
    "deck_tri_astral_cataclysm": 50,
    "deck_tri_primordial_forge": 48,
    "deck_tri_abyssal_chimera": 50,
    "deck_tri_crimson_sun": 50,
    "deck_tri_eternal_horizon": 50,
    "deck_squad_thousand_shields": 52,
    "deck_squad_siege_battery": 50,
    "deck_penta_valkyra_pact": 52
  },
  "deck_gold_bastion": {
    "deck_red_inferno": 50,
    "deck_blue_tempest": 50,
    "deck_purple_abyss": 52,
    "deck_green_wild": 52,
    "deck_dual_draconic_pact": 48,
    "deck_dual_abyssal_storm": 48,
    "deck_dual_primal_fury": 48,
    "deck_dual_arcane_forge": 52,
    "deck_dual_eternal_rot": 52,
    "deck_dual_blood_flame": 50,
    "deck_dual_wild_evolution": 52,
    "deck_dual_solar_wild": 48,
    "deck_dual_iron_inquisition": 48,
    "deck_dual_storm_dragon": 50,
    "deck_tri_arcane_cataclysm": 52,
    "deck_tri_primal_titans": 50,
    "deck_tri_eternal_reliquary": 48,
    "deck_tri_blood_moon": 52,
    "deck_tri_celestial_scales": 52,
    "deck_spec_chronomancer": 52,
    "deck_spec_pentachromatic": 48,
    "deck_tri_astral_cataclysm": 48,
    "deck_tri_primordial_forge": 48,
    "deck_tri_abyssal_chimera": 50,
    "deck_tri_crimson_sun": 48,
    "deck_tri_eternal_horizon": 48,
    "deck_squad_thousand_shields": 48,
    "deck_squad_siege_battery": 50,
    "deck_penta_valkyra_pact": 48
  },
  "deck_dual_draconic_pact": {
    "deck_red_inferno": 52,
    "deck_blue_tempest": 50,
    "deck_purple_abyss": 52,
    "deck_green_wild": 52,
    "deck_gold_bastion": 52,
    "deck_dual_abyssal_storm": 50,
    "deck_dual_primal_fury": 48,
    "deck_dual_arcane_forge": 48,
    "deck_dual_eternal_rot": 52,
    "deck_dual_blood_flame": 52,
    "deck_dual_wild_evolution": 50,
    "deck_dual_solar_wild": 52,
    "deck_dual_iron_inquisition": 48,
    "deck_dual_storm_dragon": 52,
    "deck_tri_arcane_cataclysm": 50,
    "deck_tri_primal_titans": 52,
    "deck_tri_eternal_reliquary": 50,
    "deck_tri_blood_moon": 48,
    "deck_tri_celestial_scales": 48,
    "deck_spec_chronomancer": 48,
    "deck_spec_pentachromatic": 48,
    "deck_tri_astral_cataclysm": 50,
    "deck_tri_primordial_forge": 52,
    "deck_tri_abyssal_chimera": 48,
    "deck_tri_crimson_sun": 50,
    "deck_tri_eternal_horizon": 52,
    "deck_squad_thousand_shields": 50,
    "deck_squad_siege_battery": 48,
    "deck_penta_valkyra_pact": 48
  },
  "deck_dual_abyssal_storm": {
    "deck_red_inferno": 52,
    "deck_blue_tempest": 48,
    "deck_purple_abyss": 50,
    "deck_green_wild": 52,
    "deck_gold_bastion": 52,
    "deck_dual_draconic_pact": 50,
    "deck_dual_primal_fury": 48,
    "deck_dual_arcane_forge": 50,
    "deck_dual_eternal_rot": 52,
    "deck_dual_blood_flame": 52,
    "deck_dual_wild_evolution": 48,
    "deck_dual_solar_wild": 48,
    "deck_dual_iron_inquisition": 52,
    "deck_dual_storm_dragon": 48,
    "deck_tri_arcane_cataclysm": 52,
    "deck_tri_primal_titans": 48,
    "deck_tri_eternal_reliquary": 52,
    "deck_tri_blood_moon": 52,
    "deck_tri_celestial_scales": 52,
    "deck_spec_chronomancer": 50,
    "deck_spec_pentachromatic": 48,
    "deck_tri_astral_cataclysm": 50,
    "deck_tri_primordial_forge": 50,
    "deck_tri_abyssal_chimera": 48,
    "deck_tri_crimson_sun": 52,
    "deck_tri_eternal_horizon": 48,
    "deck_squad_thousand_shields": 52,
    "deck_squad_siege_battery": 48,
    "deck_penta_valkyra_pact": 50
  },
  "deck_dual_primal_fury": {
    "deck_red_inferno": 50,
    "deck_blue_tempest": 52,
    "deck_purple_abyss": 48,
    "deck_green_wild": 50,
    "deck_gold_bastion": 52,
    "deck_dual_draconic_pact": 52,
    "deck_dual_abyssal_storm": 52,
    "deck_dual_arcane_forge": 50,
    "deck_dual_eternal_rot": 48,
    "deck_dual_blood_flame": 50,
    "deck_dual_wild_evolution": 52,
    "deck_dual_solar_wild": 48,
    "deck_dual_iron_inquisition": 50,
    "deck_dual_storm_dragon": 50,
    "deck_tri_arcane_cataclysm": 48,
    "deck_tri_primal_titans": 50,
    "deck_tri_eternal_reliquary": 48,
    "deck_tri_blood_moon": 48,
    "deck_tri_celestial_scales": 50,
    "deck_spec_chronomancer": 52,
    "deck_spec_pentachromatic": 48,
    "deck_tri_astral_cataclysm": 48,
    "deck_tri_primordial_forge": 48,
    "deck_tri_abyssal_chimera": 50,
    "deck_tri_crimson_sun": 52,
    "deck_tri_eternal_horizon": 52,
    "deck_squad_thousand_shields": 50,
    "deck_squad_siege_battery": 52,
    "deck_penta_valkyra_pact": 52
  },
  "deck_dual_arcane_forge": {
    "deck_red_inferno": 48,
    "deck_blue_tempest": 48,
    "deck_purple_abyss": 52,
    "deck_green_wild": 50,
    "deck_gold_bastion": 48,
    "deck_dual_draconic_pact": 52,
    "deck_dual_abyssal_storm": 50,
    "deck_dual_primal_fury": 50,
    "deck_dual_eternal_rot": 52,
    "deck_dual_blood_flame": 48,
    "deck_dual_wild_evolution": 52,
    "deck_dual_solar_wild": 48,
    "deck_dual_iron_inquisition": 50,
    "deck_dual_storm_dragon": 52,
    "deck_tri_arcane_cataclysm": 48,
    "deck_tri_primal_titans": 50,
    "deck_tri_eternal_reliquary": 50,
    "deck_tri_blood_moon": 48,
    "deck_tri_celestial_scales": 52,
    "deck_spec_chronomancer": 50,
    "deck_spec_pentachromatic": 50,
    "deck_tri_astral_cataclysm": 52,
    "deck_tri_primordial_forge": 48,
    "deck_tri_abyssal_chimera": 50,
    "deck_tri_crimson_sun": 50,
    "deck_tri_eternal_horizon": 52,
    "deck_squad_thousand_shields": 50,
    "deck_squad_siege_battery": 50,
    "deck_penta_valkyra_pact": 52
  },
  "deck_dual_eternal_rot": {
    "deck_red_inferno": 48,
    "deck_blue_tempest": 50,
    "deck_purple_abyss": 52,
    "deck_green_wild": 52,
    "deck_gold_bastion": 48,
    "deck_dual_draconic_pact": 48,
    "deck_dual_abyssal_storm": 48,
    "deck_dual_primal_fury": 52,
    "deck_dual_arcane_forge": 48,
    "deck_dual_blood_flame": 52,
    "deck_dual_wild_evolution": 50,
    "deck_dual_solar_wild": 48,
    "deck_dual_iron_inquisition": 48,
    "deck_dual_storm_dragon": 48,
    "deck_tri_arcane_cataclysm": 48,
    "deck_tri_primal_titans": 50,
    "deck_tri_eternal_reliquary": 48,
    "deck_tri_blood_moon": 50,
    "deck_tri_celestial_scales": 52,
    "deck_spec_chronomancer": 48,
    "deck_spec_pentachromatic": 52,
    "deck_tri_astral_cataclysm": 52,
    "deck_tri_primordial_forge": 52,
    "deck_tri_abyssal_chimera": 52,
    "deck_tri_crimson_sun": 48,
    "deck_tri_eternal_horizon": 50,
    "deck_squad_thousand_shields": 50,
    "deck_squad_siege_battery": 48,
    "deck_penta_valkyra_pact": 52
  },
  "deck_dual_blood_flame": {
    "deck_red_inferno": 50,
    "deck_blue_tempest": 52,
    "deck_purple_abyss": 48,
    "deck_green_wild": 50,
    "deck_gold_bastion": 50,
    "deck_dual_draconic_pact": 48,
    "deck_dual_abyssal_storm": 48,
    "deck_dual_primal_fury": 50,
    "deck_dual_arcane_forge": 52,
    "deck_dual_eternal_rot": 48,
    "deck_dual_wild_evolution": 52,
    "deck_dual_solar_wild": 52,
    "deck_dual_iron_inquisition": 52,
    "deck_dual_storm_dragon": 52,
    "deck_tri_arcane_cataclysm": 52,
    "deck_tri_primal_titans": 48,
    "deck_tri_eternal_reliquary": 48,
    "deck_tri_blood_moon": 50,
    "deck_tri_celestial_scales": 48,
    "deck_spec_chronomancer": 50,
    "deck_spec_pentachromatic": 48,
    "deck_tri_astral_cataclysm": 50,
    "deck_tri_primordial_forge": 52,
    "deck_tri_abyssal_chimera": 48,
    "deck_tri_crimson_sun": 48,
    "deck_tri_eternal_horizon": 50,
    "deck_squad_thousand_shields": 52,
    "deck_squad_siege_battery": 50,
    "deck_penta_valkyra_pact": 52
  },
  "deck_dual_wild_evolution": {
    "deck_red_inferno": 50,
    "deck_blue_tempest": 48,
    "deck_purple_abyss": 52,
    "deck_green_wild": 52,
    "deck_gold_bastion": 48,
    "deck_dual_draconic_pact": 50,
    "deck_dual_abyssal_storm": 52,
    "deck_dual_primal_fury": 48,
    "deck_dual_arcane_forge": 48,
    "deck_dual_eternal_rot": 50,
    "deck_dual_blood_flame": 48,
    "deck_dual_solar_wild": 48,
    "deck_dual_iron_inquisition": 50,
    "deck_dual_storm_dragon": 52,
    "deck_tri_arcane_cataclysm": 50,
    "deck_tri_primal_titans": 50,
    "deck_tri_eternal_reliquary": 48,
    "deck_tri_blood_moon": 52,
    "deck_tri_celestial_scales": 48,
    "deck_spec_chronomancer": 52,
    "deck_spec_pentachromatic": 50,
    "deck_tri_astral_cataclysm": 48,
    "deck_tri_primordial_forge": 50,
    "deck_tri_abyssal_chimera": 52,
    "deck_tri_crimson_sun": 52,
    "deck_tri_eternal_horizon": 50,
    "deck_squad_thousand_shields": 50,
    "deck_squad_siege_battery": 52,
    "deck_penta_valkyra_pact": 50
  },
  "deck_dual_solar_wild": {
    "deck_red_inferno": 52,
    "deck_blue_tempest": 48,
    "deck_purple_abyss": 48,
    "deck_green_wild": 48,
    "deck_gold_bastion": 52,
    "deck_dual_draconic_pact": 48,
    "deck_dual_abyssal_storm": 52,
    "deck_dual_primal_fury": 52,
    "deck_dual_arcane_forge": 52,
    "deck_dual_eternal_rot": 52,
    "deck_dual_blood_flame": 48,
    "deck_dual_wild_evolution": 52,
    "deck_dual_iron_inquisition": 48,
    "deck_dual_storm_dragon": 52,
    "deck_tri_arcane_cataclysm": 52,
    "deck_tri_primal_titans": 50,
    "deck_tri_eternal_reliquary": 50,
    "deck_tri_blood_moon": 50,
    "deck_tri_celestial_scales": 50,
    "deck_spec_chronomancer": 48,
    "deck_spec_pentachromatic": 48,
    "deck_tri_astral_cataclysm": 52,
    "deck_tri_primordial_forge": 48,
    "deck_tri_abyssal_chimera": 52,
    "deck_tri_crimson_sun": 48,
    "deck_tri_eternal_horizon": 48,
    "deck_squad_thousand_shields": 48,
    "deck_squad_siege_battery": 48,
    "deck_penta_valkyra_pact": 52
  },
  "deck_dual_iron_inquisition": {
    "deck_red_inferno": 52,
    "deck_blue_tempest": 48,
    "deck_purple_abyss": 50,
    "deck_green_wild": 52,
    "deck_gold_bastion": 52,
    "deck_dual_draconic_pact": 52,
    "deck_dual_abyssal_storm": 48,
    "deck_dual_primal_fury": 50,
    "deck_dual_arcane_forge": 50,
    "deck_dual_eternal_rot": 52,
    "deck_dual_blood_flame": 48,
    "deck_dual_wild_evolution": 50,
    "deck_dual_solar_wild": 52,
    "deck_dual_storm_dragon": 48,
    "deck_tri_arcane_cataclysm": 52,
    "deck_tri_primal_titans": 50,
    "deck_tri_eternal_reliquary": 50,
    "deck_tri_blood_moon": 48,
    "deck_tri_celestial_scales": 48,
    "deck_spec_chronomancer": 48,
    "deck_spec_pentachromatic": 52,
    "deck_tri_astral_cataclysm": 52,
    "deck_tri_primordial_forge": 52,
    "deck_tri_abyssal_chimera": 50,
    "deck_tri_crimson_sun": 48,
    "deck_tri_eternal_horizon": 48,
    "deck_squad_thousand_shields": 50,
    "deck_squad_siege_battery": 48,
    "deck_penta_valkyra_pact": 52
  },
  "deck_dual_storm_dragon": {
    "deck_red_inferno": 52,
    "deck_blue_tempest": 52,
    "deck_purple_abyss": 52,
    "deck_green_wild": 50,
    "deck_gold_bastion": 50,
    "deck_dual_draconic_pact": 48,
    "deck_dual_abyssal_storm": 52,
    "deck_dual_primal_fury": 50,
    "deck_dual_arcane_forge": 48,
    "deck_dual_eternal_rot": 52,
    "deck_dual_blood_flame": 48,
    "deck_dual_wild_evolution": 48,
    "deck_dual_solar_wild": 48,
    "deck_dual_iron_inquisition": 52,
    "deck_tri_arcane_cataclysm": 52,
    "deck_tri_primal_titans": 50,
    "deck_tri_eternal_reliquary": 48,
    "deck_tri_blood_moon": 48,
    "deck_tri_celestial_scales": 50,
    "deck_spec_chronomancer": 48,
    "deck_spec_pentachromatic": 52,
    "deck_tri_astral_cataclysm": 52,
    "deck_tri_primordial_forge": 52,
    "deck_tri_abyssal_chimera": 50,
    "deck_tri_crimson_sun": 48,
    "deck_tri_eternal_horizon": 48,
    "deck_squad_thousand_shields": 50,
    "deck_squad_siege_battery": 50,
    "deck_penta_valkyra_pact": 50
  },
  "deck_tri_arcane_cataclysm": {
    "deck_red_inferno": 52,
    "deck_blue_tempest": 50,
    "deck_purple_abyss": 50,
    "deck_green_wild": 48,
    "deck_gold_bastion": 48,
    "deck_dual_draconic_pact": 50,
    "deck_dual_abyssal_storm": 48,
    "deck_dual_primal_fury": 52,
    "deck_dual_arcane_forge": 52,
    "deck_dual_eternal_rot": 52,
    "deck_dual_blood_flame": 48,
    "deck_dual_wild_evolution": 50,
    "deck_dual_solar_wild": 48,
    "deck_dual_iron_inquisition": 48,
    "deck_dual_storm_dragon": 48,
    "deck_tri_primal_titans": 52,
    "deck_tri_eternal_reliquary": 48,
    "deck_tri_blood_moon": 50,
    "deck_tri_celestial_scales": 48,
    "deck_spec_chronomancer": 52,
    "deck_spec_pentachromatic": 48,
    "deck_tri_astral_cataclysm": 48,
    "deck_tri_primordial_forge": 52,
    "deck_tri_abyssal_chimera": 52,
    "deck_tri_crimson_sun": 50,
    "deck_tri_eternal_horizon": 50,
    "deck_squad_thousand_shields": 50,
    "deck_squad_siege_battery": 50,
    "deck_penta_valkyra_pact": 50
  },
  "deck_tri_primal_titans": {
    "deck_red_inferno": 48,
    "deck_blue_tempest": 52,
    "deck_purple_abyss": 52,
    "deck_green_wild": 52,
    "deck_gold_bastion": 50,
    "deck_dual_draconic_pact": 48,
    "deck_dual_abyssal_storm": 52,
    "deck_dual_primal_fury": 50,
    "deck_dual_arcane_forge": 50,
    "deck_dual_eternal_rot": 50,
    "deck_dual_blood_flame": 52,
    "deck_dual_wild_evolution": 50,
    "deck_dual_solar_wild": 50,
    "deck_dual_iron_inquisition": 50,
    "deck_dual_storm_dragon": 50,
    "deck_tri_arcane_cataclysm": 48,
    "deck_tri_eternal_reliquary": 48,
    "deck_tri_blood_moon": 52,
    "deck_tri_celestial_scales": 50,
    "deck_spec_chronomancer": 52,
    "deck_spec_pentachromatic": 50,
    "deck_tri_astral_cataclysm": 52,
    "deck_tri_primordial_forge": 50,
    "deck_tri_abyssal_chimera": 48,
    "deck_tri_crimson_sun": 50,
    "deck_tri_eternal_horizon": 52,
    "deck_squad_thousand_shields": 50,
    "deck_squad_siege_battery": 48,
    "deck_penta_valkyra_pact": 48
  },
  "deck_tri_eternal_reliquary": {
    "deck_red_inferno": 48,
    "deck_blue_tempest": 50,
    "deck_purple_abyss": 50,
    "deck_green_wild": 50,
    "deck_gold_bastion": 52,
    "deck_dual_draconic_pact": 50,
    "deck_dual_abyssal_storm": 48,
    "deck_dual_primal_fury": 52,
    "deck_dual_arcane_forge": 50,
    "deck_dual_eternal_rot": 52,
    "deck_dual_blood_flame": 52,
    "deck_dual_wild_evolution": 52,
    "deck_dual_solar_wild": 50,
    "deck_dual_iron_inquisition": 50,
    "deck_dual_storm_dragon": 52,
    "deck_tri_arcane_cataclysm": 52,
    "deck_tri_primal_titans": 52,
    "deck_tri_blood_moon": 52,
    "deck_tri_celestial_scales": 48,
    "deck_spec_chronomancer": 50,
    "deck_spec_pentachromatic": 48,
    "deck_tri_astral_cataclysm": 48,
    "deck_tri_primordial_forge": 50,
    "deck_tri_abyssal_chimera": 50,
    "deck_tri_crimson_sun": 52,
    "deck_tri_eternal_horizon": 48,
    "deck_squad_thousand_shields": 50,
    "deck_squad_siege_battery": 48,
    "deck_penta_valkyra_pact": 50
  },
  "deck_tri_blood_moon": {
    "deck_red_inferno": 50,
    "deck_blue_tempest": 50,
    "deck_purple_abyss": 48,
    "deck_green_wild": 48,
    "deck_gold_bastion": 48,
    "deck_dual_draconic_pact": 52,
    "deck_dual_abyssal_storm": 48,
    "deck_dual_primal_fury": 52,
    "deck_dual_arcane_forge": 52,
    "deck_dual_eternal_rot": 50,
    "deck_dual_blood_flame": 50,
    "deck_dual_wild_evolution": 48,
    "deck_dual_solar_wild": 50,
    "deck_dual_iron_inquisition": 52,
    "deck_dual_storm_dragon": 52,
    "deck_tri_arcane_cataclysm": 50,
    "deck_tri_primal_titans": 48,
    "deck_tri_eternal_reliquary": 48,
    "deck_tri_celestial_scales": 48,
    "deck_spec_chronomancer": 50,
    "deck_spec_pentachromatic": 48,
    "deck_tri_astral_cataclysm": 48,
    "deck_tri_primordial_forge": 52,
    "deck_tri_abyssal_chimera": 52,
    "deck_tri_crimson_sun": 50,
    "deck_tri_eternal_horizon": 52,
    "deck_squad_thousand_shields": 52,
    "deck_squad_siege_battery": 52,
    "deck_penta_valkyra_pact": 50
  },
  "deck_tri_celestial_scales": {
    "deck_red_inferno": 50,
    "deck_blue_tempest": 48,
    "deck_purple_abyss": 48,
    "deck_green_wild": 48,
    "deck_gold_bastion": 48,
    "deck_dual_draconic_pact": 52,
    "deck_dual_abyssal_storm": 48,
    "deck_dual_primal_fury": 50,
    "deck_dual_arcane_forge": 48,
    "deck_dual_eternal_rot": 48,
    "deck_dual_blood_flame": 52,
    "deck_dual_wild_evolution": 52,
    "deck_dual_solar_wild": 50,
    "deck_dual_iron_inquisition": 52,
    "deck_dual_storm_dragon": 50,
    "deck_tri_arcane_cataclysm": 52,
    "deck_tri_primal_titans": 50,
    "deck_tri_eternal_reliquary": 52,
    "deck_tri_blood_moon": 52,
    "deck_spec_chronomancer": 48,
    "deck_spec_pentachromatic": 50,
    "deck_tri_astral_cataclysm": 50,
    "deck_tri_primordial_forge": 52,
    "deck_tri_abyssal_chimera": 52,
    "deck_tri_crimson_sun": 50,
    "deck_tri_eternal_horizon": 50,
    "deck_squad_thousand_shields": 50,
    "deck_squad_siege_battery": 48,
    "deck_penta_valkyra_pact": 48
  },
  "deck_spec_chronomancer": {
    "deck_red_inferno": 50,
    "deck_blue_tempest": 52,
    "deck_purple_abyss": 52,
    "deck_green_wild": 52,
    "deck_gold_bastion": 48,
    "deck_dual_draconic_pact": 52,
    "deck_dual_abyssal_storm": 50,
    "deck_dual_primal_fury": 48,
    "deck_dual_arcane_forge": 50,
    "deck_dual_eternal_rot": 52,
    "deck_dual_blood_flame": 50,
    "deck_dual_wild_evolution": 48,
    "deck_dual_solar_wild": 52,
    "deck_dual_iron_inquisition": 52,
    "deck_dual_storm_dragon": 52,
    "deck_tri_arcane_cataclysm": 48,
    "deck_tri_primal_titans": 48,
    "deck_tri_eternal_reliquary": 50,
    "deck_tri_blood_moon": 50,
    "deck_tri_celestial_scales": 52,
    "deck_spec_pentachromatic": 48,
    "deck_tri_astral_cataclysm": 52,
    "deck_tri_primordial_forge": 48,
    "deck_tri_abyssal_chimera": 50,
    "deck_tri_crimson_sun": 52,
    "deck_tri_eternal_horizon": 50,
    "deck_squad_thousand_shields": 50,
    "deck_squad_siege_battery": 48,
    "deck_penta_valkyra_pact": 48
  },
  "deck_spec_pentachromatic": {
    "deck_red_inferno": 48,
    "deck_blue_tempest": 50,
    "deck_purple_abyss": 50,
    "deck_green_wild": 48,
    "deck_gold_bastion": 52,
    "deck_dual_draconic_pact": 52,
    "deck_dual_abyssal_storm": 52,
    "deck_dual_primal_fury": 52,
    "deck_dual_arcane_forge": 50,
    "deck_dual_eternal_rot": 48,
    "deck_dual_blood_flame": 52,
    "deck_dual_wild_evolution": 50,
    "deck_dual_solar_wild": 52,
    "deck_dual_iron_inquisition": 48,
    "deck_dual_storm_dragon": 48,
    "deck_tri_arcane_cataclysm": 52,
    "deck_tri_primal_titans": 50,
    "deck_tri_eternal_reliquary": 52,
    "deck_tri_blood_moon": 52,
    "deck_tri_celestial_scales": 50,
    "deck_spec_chronomancer": 52,
    "deck_tri_astral_cataclysm": 50,
    "deck_tri_primordial_forge": 50,
    "deck_tri_abyssal_chimera": 50,
    "deck_tri_crimson_sun": 48,
    "deck_tri_eternal_horizon": 48,
    "deck_squad_thousand_shields": 50,
    "deck_squad_siege_battery": 50,
    "deck_penta_valkyra_pact": 48
  },
  "deck_tri_astral_cataclysm": {
    "deck_red_inferno": 52,
    "deck_blue_tempest": 52,
    "deck_purple_abyss": 48,
    "deck_green_wild": 50,
    "deck_gold_bastion": 52,
    "deck_dual_draconic_pact": 50,
    "deck_dual_abyssal_storm": 50,
    "deck_dual_primal_fury": 52,
    "deck_dual_arcane_forge": 48,
    "deck_dual_eternal_rot": 48,
    "deck_dual_blood_flame": 50,
    "deck_dual_wild_evolution": 52,
    "deck_dual_solar_wild": 48,
    "deck_dual_iron_inquisition": 48,
    "deck_dual_storm_dragon": 48,
    "deck_tri_arcane_cataclysm": 52,
    "deck_tri_primal_titans": 48,
    "deck_tri_eternal_reliquary": 52,
    "deck_tri_blood_moon": 52,
    "deck_tri_celestial_scales": 50,
    "deck_spec_chronomancer": 48,
    "deck_spec_pentachromatic": 50,
    "deck_tri_primordial_forge": 52,
    "deck_tri_abyssal_chimera": 48,
    "deck_tri_crimson_sun": 50,
    "deck_tri_eternal_horizon": 48,
    "deck_squad_thousand_shields": 52,
    "deck_squad_siege_battery": 52,
    "deck_penta_valkyra_pact": 50
  },
  "deck_tri_primordial_forge": {
    "deck_red_inferno": 48,
    "deck_blue_tempest": 48,
    "deck_purple_abyss": 48,
    "deck_green_wild": 52,
    "deck_gold_bastion": 52,
    "deck_dual_draconic_pact": 48,
    "deck_dual_abyssal_storm": 50,
    "deck_dual_primal_fury": 52,
    "deck_dual_arcane_forge": 52,
    "deck_dual_eternal_rot": 48,
    "deck_dual_blood_flame": 48,
    "deck_dual_wild_evolution": 50,
    "deck_dual_solar_wild": 52,
    "deck_dual_iron_inquisition": 48,
    "deck_dual_storm_dragon": 48,
    "deck_tri_arcane_cataclysm": 48,
    "deck_tri_primal_titans": 50,
    "deck_tri_eternal_reliquary": 50,
    "deck_tri_blood_moon": 48,
    "deck_tri_celestial_scales": 48,
    "deck_spec_chronomancer": 52,
    "deck_spec_pentachromatic": 50,
    "deck_tri_astral_cataclysm": 48,
    "deck_tri_abyssal_chimera": 52,
    "deck_tri_crimson_sun": 50,
    "deck_tri_eternal_horizon": 52,
    "deck_squad_thousand_shields": 48,
    "deck_squad_siege_battery": 50,
    "deck_penta_valkyra_pact": 52
  },
  "deck_tri_abyssal_chimera": {
    "deck_red_inferno": 52,
    "deck_blue_tempest": 50,
    "deck_purple_abyss": 50,
    "deck_green_wild": 50,
    "deck_gold_bastion": 50,
    "deck_dual_draconic_pact": 52,
    "deck_dual_abyssal_storm": 52,
    "deck_dual_primal_fury": 50,
    "deck_dual_arcane_forge": 50,
    "deck_dual_eternal_rot": 48,
    "deck_dual_blood_flame": 52,
    "deck_dual_wild_evolution": 48,
    "deck_dual_solar_wild": 48,
    "deck_dual_iron_inquisition": 50,
    "deck_dual_storm_dragon": 50,
    "deck_tri_arcane_cataclysm": 48,
    "deck_tri_primal_titans": 52,
    "deck_tri_eternal_reliquary": 50,
    "deck_tri_blood_moon": 48,
    "deck_tri_celestial_scales": 48,
    "deck_spec_chronomancer": 50,
    "deck_spec_pentachromatic": 50,
    "deck_tri_astral_cataclysm": 52,
    "deck_tri_primordial_forge": 48,
    "deck_tri_crimson_sun": 52,
    "deck_tri_eternal_horizon": 52,
    "deck_squad_thousand_shields": 48,
    "deck_squad_siege_battery": 52,
    "deck_penta_valkyra_pact": 50
  },
  "deck_tri_crimson_sun": {
    "deck_red_inferno": 48,
    "deck_blue_tempest": 48,
    "deck_purple_abyss": 48,
    "deck_green_wild": 50,
    "deck_gold_bastion": 52,
    "deck_dual_draconic_pact": 50,
    "deck_dual_abyssal_storm": 48,
    "deck_dual_primal_fury": 48,
    "deck_dual_arcane_forge": 50,
    "deck_dual_eternal_rot": 52,
    "deck_dual_blood_flame": 52,
    "deck_dual_wild_evolution": 48,
    "deck_dual_solar_wild": 52,
    "deck_dual_iron_inquisition": 52,
    "deck_dual_storm_dragon": 52,
    "deck_tri_arcane_cataclysm": 50,
    "deck_tri_primal_titans": 50,
    "deck_tri_eternal_reliquary": 48,
    "deck_tri_blood_moon": 50,
    "deck_tri_celestial_scales": 50,
    "deck_spec_chronomancer": 48,
    "deck_spec_pentachromatic": 52,
    "deck_tri_astral_cataclysm": 50,
    "deck_tri_primordial_forge": 50,
    "deck_tri_abyssal_chimera": 48,
    "deck_tri_eternal_horizon": 50,
    "deck_squad_thousand_shields": 50,
    "deck_squad_siege_battery": 52,
    "deck_penta_valkyra_pact": 48
  },
  "deck_tri_eternal_horizon": {
    "deck_red_inferno": 48,
    "deck_blue_tempest": 52,
    "deck_purple_abyss": 52,
    "deck_green_wild": 50,
    "deck_gold_bastion": 52,
    "deck_dual_draconic_pact": 48,
    "deck_dual_abyssal_storm": 52,
    "deck_dual_primal_fury": 48,
    "deck_dual_arcane_forge": 48,
    "deck_dual_eternal_rot": 50,
    "deck_dual_blood_flame": 50,
    "deck_dual_wild_evolution": 50,
    "deck_dual_solar_wild": 52,
    "deck_dual_iron_inquisition": 52,
    "deck_dual_storm_dragon": 52,
    "deck_tri_arcane_cataclysm": 50,
    "deck_tri_primal_titans": 48,
    "deck_tri_eternal_reliquary": 52,
    "deck_tri_blood_moon": 48,
    "deck_tri_celestial_scales": 50,
    "deck_spec_chronomancer": 50,
    "deck_spec_pentachromatic": 52,
    "deck_tri_astral_cataclysm": 52,
    "deck_tri_primordial_forge": 48,
    "deck_tri_abyssal_chimera": 48,
    "deck_tri_crimson_sun": 50,
    "deck_squad_thousand_shields": 48,
    "deck_squad_siege_battery": 52,
    "deck_penta_valkyra_pact": 52
  },
  "deck_squad_thousand_shields": {
    "deck_red_inferno": 52,
    "deck_blue_tempest": 48,
    "deck_purple_abyss": 48,
    "deck_green_wild": 48,
    "deck_gold_bastion": 52,
    "deck_dual_draconic_pact": 50,
    "deck_dual_abyssal_storm": 48,
    "deck_dual_primal_fury": 50,
    "deck_dual_arcane_forge": 50,
    "deck_dual_eternal_rot": 50,
    "deck_dual_blood_flame": 48,
    "deck_dual_wild_evolution": 50,
    "deck_dual_solar_wild": 52,
    "deck_dual_iron_inquisition": 50,
    "deck_dual_storm_dragon": 50,
    "deck_tri_arcane_cataclysm": 50,
    "deck_tri_primal_titans": 50,
    "deck_tri_eternal_reliquary": 50,
    "deck_tri_blood_moon": 48,
    "deck_tri_celestial_scales": 50,
    "deck_spec_chronomancer": 50,
    "deck_spec_pentachromatic": 50,
    "deck_tri_astral_cataclysm": 48,
    "deck_tri_primordial_forge": 52,
    "deck_tri_abyssal_chimera": 52,
    "deck_tri_crimson_sun": 50,
    "deck_tri_eternal_horizon": 52,
    "deck_squad_siege_battery": 52,
    "deck_penta_valkyra_pact": 50
  },
  "deck_squad_siege_battery": {
    "deck_red_inferno": 52,
    "deck_blue_tempest": 50,
    "deck_purple_abyss": 52,
    "deck_green_wild": 50,
    "deck_gold_bastion": 50,
    "deck_dual_draconic_pact": 52,
    "deck_dual_abyssal_storm": 52,
    "deck_dual_primal_fury": 48,
    "deck_dual_arcane_forge": 50,
    "deck_dual_eternal_rot": 52,
    "deck_dual_blood_flame": 50,
    "deck_dual_wild_evolution": 48,
    "deck_dual_solar_wild": 52,
    "deck_dual_iron_inquisition": 52,
    "deck_dual_storm_dragon": 50,
    "deck_tri_arcane_cataclysm": 50,
    "deck_tri_primal_titans": 52,
    "deck_tri_eternal_reliquary": 52,
    "deck_tri_blood_moon": 48,
    "deck_tri_celestial_scales": 52,
    "deck_spec_chronomancer": 52,
    "deck_spec_pentachromatic": 50,
    "deck_tri_astral_cataclysm": 48,
    "deck_tri_primordial_forge": 50,
    "deck_tri_abyssal_chimera": 48,
    "deck_tri_crimson_sun": 48,
    "deck_tri_eternal_horizon": 48,
    "deck_squad_thousand_shields": 48,
    "deck_penta_valkyra_pact": 48
  },
  "deck_penta_valkyra_pact": {
    "deck_red_inferno": 52,
    "deck_blue_tempest": 50,
    "deck_purple_abyss": 48,
    "deck_green_wild": 48,
    "deck_gold_bastion": 52,
    "deck_dual_draconic_pact": 52,
    "deck_dual_abyssal_storm": 50,
    "deck_dual_primal_fury": 48,
    "deck_dual_arcane_forge": 48,
    "deck_dual_eternal_rot": 48,
    "deck_dual_blood_flame": 48,
    "deck_dual_wild_evolution": 50,
    "deck_dual_solar_wild": 48,
    "deck_dual_iron_inquisition": 48,
    "deck_dual_storm_dragon": 50,
    "deck_tri_arcane_cataclysm": 50,
    "deck_tri_primal_titans": 52,
    "deck_tri_eternal_reliquary": 50,
    "deck_tri_blood_moon": 50,
    "deck_tri_celestial_scales": 52,
    "deck_spec_chronomancer": 52,
    "deck_spec_pentachromatic": 52,
    "deck_tri_astral_cataclysm": 50,
    "deck_tri_primordial_forge": 48,
    "deck_tri_abyssal_chimera": 50,
    "deck_tri_crimson_sun": 52,
    "deck_tri_eternal_horizon": 48,
    "deck_squad_thousand_shields": 50,
    "deck_squad_siege_battery": 52
  }
};

export function getDeckTacticalProfile(deckId: string): DeckTacticalProfile {
  return DECK_TACTICAL_PROFILES[deckId] ?? Object.values(DECK_TACTICAL_PROFILES)[0];
}

export function getMatchupGuide(myDeckId: string, enemyDeckId: string): MatchupGuide {
  const myProfile = getDeckTacticalProfile(myDeckId);
  const enemyProfile = getDeckTacticalProfile(enemyDeckId);
  const enemyDeck = PREBUILT_DECKS.find((d) => d.id === enemyDeckId) ?? PREBUILT_DECKS[0];

  const empiricalWr = EMPIRICAL_WIN_RATES[myDeckId]?.[enemyDeckId];
  const estimatedWinRate =
    typeof empiricalWr === 'number' ? Math.max(45, Math.min(55, empiricalWr)) : 50;

  const favorability: 'Favorável' | 'Equilibrado' | 'Desafiador' =
    estimatedWinRate >= 55 ? 'Favorável' : estimatedWinRate <= 45 ? 'Desafiador' : 'Equilibrado';

  const enemyCards = enemyDeck.cardIds.map((id) => CARDS_BY_ID[id]).filter(Boolean);
  const enemyHasHeavySpells =
    enemyProfile.compositionSummary.spells + enemyProfile.compositionSummary.reactions >= 22;
  const enemyHasHeavyRelics = enemyProfile.compositionSummary.relics >= 12;
  const enemyIsSwarm = enemyProfile.compositionSummary.creatures >= 45;
  const enemyHasBreathDragons = enemyCards.filter((c) => (c.breathDamage ?? 0) >= 2).length >= 2;
  const enemyHasLethal = enemyCards.filter((c) => c.keywords.includes('Toque Letal')).length >= 3;

  // Priority targets from enemy deck (top legendary/rare threats + key engines)
  const priorityTargets = enemyCards
    .filter((c) => c.rarity === 'legendary' || (c.type === 'relic' && c.rarity === 'rare') || c.ascension)
    .slice(-4)
    .map((c) => c.name);

  let keyObjective = '';
  if (enemyHasHeavyRelics) {
    keyObjective = `Pressionar as colunas de Vanguarda de "${enemyProfile.deckName}" antes que suas ${enemyProfile.compositionSummary.relics} Relíquias Contínuas gerem vantagem insuperável na Retaguarda.`;
  } else if (enemyHasHeavySpells) {
    keyObjective = `Forçar "${enemyProfile.deckName}" a gastar suas ${enemyProfile.compositionSummary.spells + enemyProfile.compositionSummary.reactions} Magias/Reações em ameaças médias antes de comprometer seus campeões principais.`;
  } else if (enemyIsSwarm) {
    keyObjective = `Conter a avalanche de ${enemyProfile.compositionSummary.creatures} criaturas de "${enemyProfile.deckName}" disputando os 6 slots da Vanguarda para negar bônus de Invasão (+1 ATQ).`;
  } else {
    keyObjective = `Impor o plano de jogo de ${myProfile.archetypeTag} contra a curva de ${enemyProfile.compositionSummary.averageCost}⚡ de "${enemyProfile.deckName}".`;
  }

  let whatToChannel = '';
  if (enemyIsSwarm || enemyProfile.compositionSummary.averageCost <= 3.15) {
    whatToChannel =
      'Contra este oponente agressivo, canalize cartas lentas de custo 6–7 na mão inicial e preserve todas as unidades de custo 1–3, Guardiões, curas e remoções em área.';
  } else if (enemyHasHeavyRelics || enemyHasHeavySpells) {
    whatToChannel =
      'Contra este baralho de controle/relíquias, canalize remoções pequenas de alvo único e preserve seus geradores de Essência, compra de cartas e ameaças pesadas com Escudo Divino ou Renascer.';
  } else {
    whatToChannel = `Siga a regra base do seu deck (${myProfile.channelingStrategy.split('.')[0]}), priorizando manter respostas para ${priorityTargets[0] ?? 'os campeões rivais'}.`;
  }

  let positioningTactic = '';
  if (enemyHasBreathDragons || enemyHasHeavySpells) {
    positioningTactic =
      'CUIDADO COM DANO EM ÁREA E SOPRO: Evite empilhar 3 unidades frágeis na mesma fileira sem Escudo Divino. Distribua suas forças em colunas separadas e mantenha artilheiros de Alcance na Retaguarda.';
  } else if (enemyHasLethal) {
    positioningTactic =
      'CONTRA TOQUE LETAL: Nunca deixe um colosso caro sozinho na frente de um slot! Empilhe um recruta barato ou unidade com Escudo Divino/Renascer na posição 1 do slot para absorver o Toque Letal inimigo.';
  } else if (enemyIsSwarm) {
    positioningTactic =
      'CONTRA ENXAME DE ESQUADRÃO: Ocupe o maior número possível de colunas na Vanguarda para bloquear Invasões (+1 ATQ) e empilhe 2–3 unidades atrás dos seus melhores Guardiões.';
  } else {
    positioningTactic =
      'Agrupe esquadrões de 2–3 unidades nas colunas onde você possui vantagem de atributos para romper o Guardião rival e invadir a Retaguarda.';
  }

  const dangerWatchout = enemyProfile.signatureCombos[0]
    ? `Atenção ao combo "${enemyProfile.signatureCombos[0].title}" (${enemyProfile.signatureCombos[0].cards.join(' + ')}): ${enemyProfile.signatureCombos[0].howItWorks}`
    : `Cuidado a partir do Turno 6 com a entrada dos campeões lendários de "${enemyProfile.deckName}".`;

  const victoryPath = `Estabilize nos turnos iniciais seguindo seu plano (${myProfile.phasePlan.earlyGame.replace(/\.$/, '')}), neutralize ${priorityTargets.slice(0, 2).join(' e ')} no meio do jogo e feche a partida com ${myProfile.signatureCombos[0]?.title ?? 'seus campeões lendários'}.`;

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
