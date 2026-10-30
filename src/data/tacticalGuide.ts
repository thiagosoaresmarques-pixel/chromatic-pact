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
      "creatures": 55,
      "spells": 27,
      "reactions": 10,
      "relics": 8,
      "ascensions": 0,
      "averageCost": 3.09
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
        "title": "Caldeirão Piroclástico",
        "cards": [
          "Botas Aladas do Mensageiro",
          "Bigorna Dracônica da Cratera",
          "Fornalha Rúnica de Muspel"
        ],
        "howItWorks": "Combine Botas Aladas do Mensageiro + Bigorna Dracônica da Cratera + Fornalha Rúnica de Muspel para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
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
      "red_08_dragao_vermelho",
      "red_173_general_roda_chama",
      "red_172_armada_draconica_chama",
      "red_167_arauto_prisma_chama",
      "red_171_pactuario_elemental_chama",
      "red_169_pressagio_revoada_chama",
      "red_168_tecelao_feixe_chama",
      "red_170_flagelo_cornudo_chama"
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
      "averageCost": 3.43
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
        "title": "Inverno Perpétuo",
        "cards": [
          "Botas Aladas do Mensageiro",
          "Códice da Ressonância Astral",
          "Astrolábio das Eras Eternas"
        ],
        "howItWorks": "Combine Botas Aladas do Mensageiro + Códice da Ressonância Astral + Astrolábio das Eras Eternas para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
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
      "blue_07_kraken",
      "blue_173_general_roda_gelo",
      "blue_172_armada_draconica_gelo",
      "blue_167_arauto_prisma_gelo",
      "blue_171_pactuario_elemental_gelo",
      "blue_169_pressagio_revoada_gelo",
      "blue_168_tecelao_feixe_gelo",
      "blue_170_flagelo_cornudo_gelo"
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
      "averageCost": 3.2
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
        "title": "Sifão da Eternidade",
        "cards": [
          "Lanterna das Almas Penadas",
          "Botas Aladas do Mensageiro",
          "Ampulheta das Mil Mortes"
        ],
        "howItWorks": "Combine Lanterna das Almas Penadas + Botas Aladas do Mensageiro + Ampulheta das Mil Mortes para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
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
      "O acúmulo de Corrupção exige atenção para não sofrer recuo sombrio se a partida fugir do controle.",
      "Congelamento atrasa os gatilhos de Dreno de Vida em combate."
    ],
    "keyCards": [
      "purple_07_lich",
      "purple_173_general_roda_abismo",
      "purple_172_armada_draconica_abismo",
      "purple_167_arauto_prisma_abismo",
      "purple_171_pactuario_elemental_abismo",
      "purple_169_pressagio_revoada_abismo",
      "purple_168_tecelao_feixe_abismo",
      "purple_170_flagelo_cornudo_abismo"
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
      "averageCost": 2.76
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
        "title": "Estouro da Alcateia",
        "cards": [
          "Altar das Presas Ancestrais",
          "Monólito de Comando da Terra",
          "Pedra Filosofal do Alquimista"
        ],
        "howItWorks": "Combine Altar das Presas Ancestrais + Monólito de Comando da Terra + Pedra Filosofal do Alquimista para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
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
      "green_172_armada_draconica_selva",
      "green_167_arauto_prisma_selva",
      "green_171_pactuario_elemental_selva",
      "green_169_pressagio_revoada_selva",
      "green_168_tecelao_feixe_selva",
      "green_170_flagelo_cornudo_selva"
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
      "averageCost": 4.13
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
        "title": "Santuário das Dez Relíquias",
        "cards": [
          "Cálice Real da Alvorada",
          "Obelisco do Bastião Inexpugnável",
          "Obelisco da Lei Suprema"
        ],
        "howItWorks": "Combine Cálice Real da Alvorada + Obelisco do Bastião Inexpugnável + Obelisco da Lei Suprema para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
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
      "gold_167_arauto_prisma_sol",
      "gold_171_pactuario_elemental_sol",
      "gold_169_pressagio_revoada_sol",
      "gold_168_tecelao_feixe_sol",
      "gold_170_flagelo_cornudo_sol"
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
      "averageCost": 3.04
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
        "title": "Sopro Cruzado Imperial",
        "cards": [
          "Bigorna da Chama Primordial",
          "Bigorna Dracônica da Cratera",
          "Maça Solar da Ruptura"
        ],
        "howItWorks": "Combine Bigorna da Chama Primordial + Bigorna Dracônica da Cratera + Maça Solar da Ruptura para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
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
      "neutral_10_valkyra_pentacromatica",
      "gold_173_general_roda_sol",
      "red_172_armada_draconica_chama",
      "red_169_pressagio_revoada_chama",
      "gold_168_tecelao_feixe_sol",
      "gold_170_flagelo_cornudo_sol"
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
      "averageCost": 3.44
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
        "title": "Pesadelo Paralisante",
        "cards": [
          "Códice da Ressonância Astral",
          "Ampulheta das Mil Mortes",
          "Cálice de Comando das Águas"
        ],
        "howItWorks": "Combine Códice da Ressonância Astral + Ampulheta das Mil Mortes + Cálice de Comando das Águas para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
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
      "purple_06_tirano_ocular",
      "blue_173_general_roda_gelo",
      "purple_167_arauto_prisma_abismo",
      "blue_171_pactuario_elemental_gelo",
      "purple_168_tecelao_feixe_abismo",
      "blue_170_flagelo_cornudo_gelo"
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
      "averageCost": 2.63
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
        "title": "Brecha Vulcânica",
        "cards": [
          "Botas Aladas do Mensageiro",
          "Corazón da Árvore-Mundo",
          "Orbe do Sol Aprisionado"
        ],
        "howItWorks": "Combine Botas Aladas do Mensageiro + Corazón da Árvore-Mundo + Orbe do Sol Aprisionado para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
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
      "neutral_09_baphometis_abismo",
      "red_173_general_roda_chama",
      "green_173_general_roda_selva",
      "green_172_armada_draconica_selva",
      "green_167_arauto_prisma_selva",
      "green_168_tecelao_feixe_selva",
      "red_168_tecelao_feixe_chama",
      "red_170_flagelo_cornudo_chama"
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
      "ascensions": 5,
      "averageCost": 3.41
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
        "title": "Engrenagem Perpétua",
        "cards": [
          "Estandarte da Legião Dourada",
          "Bastião do Sol Invicto",
          "Visagem Real das Cinco Coroas"
        ],
        "howItWorks": "Combine Estandarte da Legião Dourada + Bastião do Sol Invicto + Visagem Real das Cinco Coroas para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
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
      "gold_33_trono_celestial",
      "gold_173_general_roda_sol",
      "gold_172_armada_draconica_sol",
      "neutral_167_arauto_prisma_matriz",
      "gold_171_pactuario_elemental_sol",
      "neutral_168_tecelao_feixe_matriz",
      "neutral_170_flagelo_cornudo_matriz"
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
      "averageCost": 2.88
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
        "title": "Colheita Peçonhenta",
        "cards": [
          "Corazón da Árvore-Mundo",
          "Altar das Presas Ancestrais",
          "Ampulheta das Mil Mortes"
        ],
        "howItWorks": "Combine Corazón da Árvore-Mundo + Altar das Presas Ancestrais + Ampulheta das Mil Mortes para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
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
      "purple_172_armada_draconica_abismo",
      "purple_169_pressagio_revoada_abismo",
      "green_169_pressagio_revoada_selva",
      "purple_170_flagelo_cornudo_abismo"
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
      "averageCost": 3.02
    },
    "playstyleOverview": "Agressão sombria de 100 cartas (52 Criaturas, 25 Feitiços, 10 Reações e 13 Relíquias) que utiliza Corrupção como combustível para feitiços devastadores, Fênix velozes e Lordes Abissais.",
    "channelingStrategy": "Atinja 2 Vermelho e 2 Roxo até o Turno 4; guarde Dreno Vital e Colheita das Sombras para compensar a vida gasta em pactos. Jamais canalize Pyrrakon, General da Roda Vulcânica e Nyxaroth, General da Roda Fúnebre nos turnos médios/finais: preserve seu General da Roda para quebrar a Expansão de Domínio inimiga (ou vencer instantaneamente uma Disputa de Domínios 50/50)!",
    "positioningAndStackingGuide": "Espalhe atacantes agressivos na Vanguarda e mantenha a Lanterna das Almas e o Caldeirão de Magma protegidos na Retaguarda.",
    "phasePlan": {
      "earlyGame": "Estabeleça presença imediata na Vanguarda com Acólito do Sol Negro, Víbora de Brasa Jovem, Batedor Escamado das Brasas para disputar colunas e ativar Invasão de Território (+1 ATQ).",
      "midGame": "Domine a transição de meio de jogo com Tecelão do Feixe Umbral, Pactuário do Espírito Magmático, Pactuário do Espírito Umbral, consolidando colunas chave e acumulando Afinidade rumo à sua Expansão de Domínio (6/6). Use Pactuário do Espírito Magmático na Retaguarda com Alcance para disparar bônus a cada feitiço lançado enquanto invoca proteção na Vanguarda.",
      "lateGame": "Ative sua Expansão de Domínio (6/6) e domine o fim de jogo com Pyrrakon, General da Roda Vulcânica, Nyxaroth, General da Roda Fúnebre, Hoste Dracônica da Cratera, Arauto da Supernova Prismática. Se o rival ativar o Domínio dele — ou forçar uma Disputa de Domínios 50/50 —, invoque (ou ataque com) Pyrrakon, General da Roda Vulcânica e Nyxaroth, General da Roda Fúnebre para quebrar a Expansão inimiga, impor 2 rodadas de Exaustão de Domínio ao oponente, blindar seus aliados com Escudo Divino e reativar na hora o +1/+1 e o Acerto Garantido do seu próprio Domínio! Com Hoste Dracônica da Cratera, varra a Vanguarda rival com Sopro em área, gere duas fichas 2/2 imediatas e dispare seu efeito devastador ao atacar."
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
      "Exige equilíbrio entre agressão e gerenciamento de VIDA/Corrupção."
    ],
    "keyCards": [
      "purple_08_lorde_abissal",
      "red_173_general_roda_chama",
      "purple_173_general_roda_abismo",
      "red_172_armada_draconica_chama",
      "red_167_arauto_prisma_chama",
      "red_171_pactuario_elemental_chama",
      "purple_171_pactuario_elemental_abismo",
      "purple_168_tecelao_feixe_abismo"
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
      "ascensions": 14,
      "averageCost": 3.27
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
        "title": "Despertar Simultâneo",
        "cards": [
          "Botas Aladas do Mensageiro",
          "Códice da Ressonância Astral",
          "Altar das Presas Ancestrais"
        ],
        "howItWorks": "Combine Botas Aladas do Mensageiro + Códice da Ressonância Astral + Altar das Presas Ancestrais para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
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
      "green_30_xama_druida",
      "neutral_173_general_roda_matriz",
      "neutral_172_armada_draconica_matriz",
      "green_171_pactuario_elemental_selva",
      "blue_169_pressagio_revoada_gelo",
      "neutral_170_flagelo_cornudo_matriz"
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
      "averageCost": 2.63
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
        "title": "Aurora Imortal",
        "cards": [
          "Monólito da Presa Primordial",
          "Estandarte da Legião Dourada",
          "Bastião do Sol Invicto"
        ],
        "howItWorks": "Combine Monólito da Presa Primordial + Estandarte da Legião Dourada + Bastião do Sol Invicto para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
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
      "gold_47_dragao_solar",
      "gold_173_general_roda_sol",
      "green_173_general_roda_selva",
      "gold_172_armada_draconica_sol",
      "gold_167_arauto_prisma_sol",
      "gold_169_pressagio_revoada_sol",
      "green_168_tecelao_feixe_selva",
      "gold_170_flagelo_cornudo_sol"
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
      "averageCost": 3.56
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
        "title": "Dízimo da Catedral",
        "cards": [
          "Carmilla, Condessa de Sangue e Ouro",
          "Talismã do Zênite Puro",
          "Cálice de Obsidiana do Sangue Imortal"
        ],
        "howItWorks": "Combine Carmilla, Condessa de Sangue e Ouro + Talismã do Zênite Puro + Cálice de Obsidiana do Sangue Imortal para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
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
      "purple_46_noiva_vampira",
      "purple_173_general_roda_abismo",
      "gold_167_arauto_prisma_sol",
      "purple_169_pressagio_revoada_abismo",
      "gold_168_tecelao_feixe_sol",
      "purple_170_flagelo_cornudo_abismo"
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
      "averageCost": 3.43
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
        "title": "Tormenta da Fênix",
        "cards": [
          "Botas Aladas do Mensageiro",
          "Códice da Ressonância Astral",
          "Turíbulo dos Quatro Ventos"
        ],
        "howItWorks": "Combine Botas Aladas do Mensageiro + Códice da Ressonância Astral + Turíbulo dos Quatro Ventos para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
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
      "red_45_fenix_primordial",
      "blue_173_general_roda_gelo",
      "blue_172_armada_draconica_gelo",
      "blue_167_arauto_prisma_gelo",
      "red_171_pactuario_elemental_chama",
      "blue_171_pactuario_elemental_gelo",
      "blue_168_tecelao_feixe_gelo"
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
      "ascensions": 3,
      "averageCost": 3.2
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
        "title": "Tríade do Cataclismo",
        "cards": [
          "Cálice de Obsidiana do Sangue Imortal",
          "Turíbulo dos Quatro Ventos",
          "Ampulheta das Mil Mortes"
        ],
        "howItWorks": "Combine Cálice de Obsidiana do Sangue Imortal + Turíbulo dos Quatro Ventos + Ampulheta das Mil Mortes para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
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
      "neutral_173_general_roda_matriz",
      "blue_173_general_roda_gelo",
      "red_167_arauto_prisma_chama",
      "purple_167_arauto_prisma_abismo",
      "neutral_171_pactuario_elemental_matriz",
      "purple_171_pactuario_elemental_abismo"
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
      "averageCost": 2.62
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
        "title": "Investida dos Três Reinos",
        "cards": [
          "Martelo Forjado em Estrela",
          "Monólito de Comando da Terra",
          "Orbe do Sol Aprisionado"
        ],
        "howItWorks": "Combine Martelo Forjado em Estrela + Monólito de Comando da Terra + Orbe do Sol Aprisionado para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
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
      "green_173_general_roda_selva",
      "green_172_armada_draconica_selva",
      "green_169_pressagio_revoada_selva",
      "red_168_tecelao_feixe_chama",
      "green_170_flagelo_cornudo_selva"
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
      "ascensions": 1,
      "averageCost": 3.36
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
        "title": "Catedral das Catorze Relíquias",
        "cards": [
          "Estandarte da Legião Dourada",
          "Astrolábio das Eras Eternas",
          "Estandarte da Legião Dourada"
        ],
        "howItWorks": "Combine Estandarte da Legião Dourada + Astrolábio das Eras Eternas + Estandarte da Legião Dourada para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
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
      "neutral_173_general_roda_matriz",
      "blue_167_arauto_prisma_gelo",
      "gold_167_arauto_prisma_sol",
      "gold_169_pressagio_revoada_sol",
      "neutral_168_tecelao_feixe_matriz"
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
      "averageCost": 2.84
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
        "title": "Noite de Malakor-Vael",
        "cards": [
          "Trono de Ossos do Arquimago",
          "Ampulheta das Mil Mortes",
          "Bigorna Dracônica da Cratera"
        ],
        "howItWorks": "Combine Trono de Ossos do Arquimago + Ampulheta das Mil Mortes + Bigorna Dracônica da Cratera para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
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
      "purple_173_general_roda_abismo",
      "purple_172_armada_draconica_abismo",
      "red_169_pressagio_revoada_chama",
      "purple_170_flagelo_cornudo_abismo",
      "red_170_flagelo_cornudo_chama"
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
      "averageCost": 3.23
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
        "title": "Horizonte Inexpugnável",
        "cards": [
          "Monólito da Presa Primordial",
          "Talismã do Zênite Puro",
          "Altar das Presas Ancestrais"
        ],
        "howItWorks": "Combine Monólito da Presa Primordial + Talismã do Zênite Puro + Altar das Presas Ancestrais para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
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
      "gold_65_emperion_solar",
      "gold_173_general_roda_sol",
      "blue_172_armada_draconica_gelo",
      "green_167_arauto_prisma_selva",
      "neutral_167_arauto_prisma_matriz",
      "neutral_169_pressagio_revoada_matriz",
      "blue_169_pressagio_revoada_gelo",
      "blue_170_flagelo_cornudo_gelo"
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
      "ascensions": 1,
      "averageCost": 3.53
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
        "title": "Badalada da Meia-Noite",
        "cards": [
          "Estandarte da Legião Dourada",
          "Cálice Real da Alvorada",
          "Astrolábio das Eras Eternas"
        ],
        "howItWorks": "Combine Estandarte da Legião Dourada + Cálice Real da Alvorada + Astrolábio das Eras Eternas para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
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
      "blue_80_senhor_tempo",
      "blue_173_general_roda_gelo",
      "neutral_173_general_roda_matriz",
      "neutral_171_pactuario_elemental_matriz",
      "gold_171_pactuario_elemental_sol",
      "blue_168_tecelao_feixe_gelo"
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
      "ascensions": 5,
      "averageCost": 2.78
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
        "title": "Despertar Pentacromático",
        "cards": [
          "Valkyra, Imperatriz Pentacromática",
          "Astrolábio das Eras Eternas",
          "Bigorna Dracônica da Cratera"
        ],
        "howItWorks": "Combine Valkyra, Imperatriz Pentacromática + Astrolábio das Eras Eternas + Bigorna Dracônica da Cratera para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
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
      "neutral_10_valkyra_pentacromatica",
      "neutral_173_general_roda_matriz",
      "neutral_172_armada_draconica_matriz",
      "neutral_167_arauto_prisma_matriz",
      "neutral_171_pactuario_elemental_matriz",
      "neutral_169_pressagio_revoada_matriz",
      "neutral_168_tecelao_feixe_matriz",
      "neutral_170_flagelo_cornudo_matriz"
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
      "ascensions": 9,
      "averageCost": 3.2
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
        "title": "Bateria de Gatilhos Arcanos",
        "cards": [
          "Fornalha das Escamas Rubras",
          "Trono de Ossos do Arquimago",
          "Cálice da Sede Carmesim"
        ],
        "howItWorks": "Combine Fornalha das Escamas Rubras + Trono de Ossos do Arquimago + Cálice da Sede Carmesim para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
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
      "red_173_general_roda_chama",
      "neutral_172_armada_draconica_matriz",
      "blue_167_arauto_prisma_gelo",
      "red_167_arauto_prisma_chama",
      "red_171_pactuario_elemental_chama",
      "blue_171_pactuario_elemental_gelo",
      "purple_171_pactuario_elemental_abismo"
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
      "averageCost": 2.75
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
        "title": "Forja dos Três Anciões",
        "cards": [
          "Rex Primordial da Cratera Verde",
          "Martelo Forjado em Estrela",
          "Visagem Real das Cinco Coroas"
        ],
        "howItWorks": "Combine Rex Primordial da Cratera Verde + Martelo Forjado em Estrela + Visagem Real das Cinco Coroas para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
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
      "green_101_tiranossauro_alfa",
      "red_173_general_roda_chama",
      "red_172_armada_draconica_chama",
      "red_169_pressagio_revoada_chama",
      "green_168_tecelao_feixe_selva",
      "red_170_flagelo_cornudo_chama"
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
      "averageCost": 3.18
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
        "title": "Sopro de Gelo e Morte",
        "cards": [
          "Serpente Leviatã das Fendas",
          "Morgath, O Dragão da Chama Necrótica",
          "Despertar da Legião Eterna"
        ],
        "howItWorks": "Congela toda a Vanguarda inimiga e reanima colossos abatidos no mesmo turno."
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
      "purple_173_general_roda_abismo",
      "purple_172_armada_draconica_abismo",
      "green_167_arauto_prisma_selva",
      "green_171_pactuario_elemental_selva",
      "purple_169_pressagio_revoada_abismo",
      "blue_170_flagelo_cornudo_gelo"
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
      "averageCost": 2.83
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
        "title": "Decreto do Sol Carmesim",
        "cards": [
          "Seraphiel, A Imperatriz das Seis Asas",
          "Vladislaus, O Patriarca de Sangue",
          "Estandarte da Legião Dourada"
        ],
        "howItWorks": "Combine Seraphiel, A Imperatriz das Seis Asas + Vladislaus, O Patriarca de Sangue + Estandarte da Legião Dourada para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
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
      "gold_173_general_roda_sol",
      "purple_167_arauto_prisma_abismo",
      "gold_167_arauto_prisma_sol",
      "purple_168_tecelao_feixe_abismo",
      "gold_168_tecelao_feixe_sol",
      "purple_170_flagelo_cornudo_abismo"
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
      "ascensions": 13,
      "averageCost": 3.04
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
        "title": "Horizonte Dourado",
        "cards": [
          "Aurion-Sol, O Dragão Imperial do Zênite",
          "Estandarte da Legião Dourada",
          "Corazón da Árvore-Mundo"
        ],
        "howItWorks": "Combine Aurion-Sol, O Dragão Imperial do Zênite + Estandarte da Legião Dourada + Corazón da Árvore-Mundo para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
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
      "gold_100_dragao_imperial_ouro",
      "green_173_general_roda_selva",
      "neutral_173_general_roda_matriz",
      "gold_172_armada_draconica_sol",
      "gold_169_pressagio_revoada_sol",
      "green_169_pressagio_revoada_selva",
      "neutral_169_pressagio_revoada_matriz"
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
      "averageCost": 2.94
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
        "title": "Falange Tripla Multiplicadora",
        "cards": [
          "Estandarte da Legião Dourada",
          "Talismã do Zênite Puro",
          "Altar das Presas Ancestrais"
        ],
        "howItWorks": "Combine Estandarte da Legião Dourada + Talismã do Zênite Puro + Altar das Presas Ancestrais para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
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
      "gold_97_colosso_celestial",
      "green_173_general_roda_selva",
      "gold_173_general_roda_sol",
      "green_172_armada_draconica_selva",
      "gold_172_armada_draconica_sol",
      "green_169_pressagio_revoada_selva",
      "neutral_169_pressagio_revoada_matriz",
      "gold_170_flagelo_cornudo_sol"
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
      "ascensions": 9,
      "averageCost": 3.2
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
        "title": "Bateria de Morteiros Arcanos",
        "cards": [
          "Piromante Lança-Chamas",
          "Arquimago da Cidadela Flutuante",
          "Botas Aladas do Mensageiro"
        ],
        "howItWorks": "Combine Piromante Lança-Chamas + Arquimago da Cidadela Flutuante + Botas Aladas do Mensageiro para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
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
      "red_100_dragao_vulcanico_anciao",
      "blue_173_general_roda_gelo",
      "blue_172_armada_draconica_gelo",
      "neutral_172_armada_draconica_matriz",
      "red_171_pactuario_elemental_chama",
      "blue_171_pactuario_elemental_gelo",
      "neutral_168_tecelao_feixe_matriz",
      "red_168_tecelao_feixe_chama"
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
      "ascensions": 11,
      "averageCost": 3.33
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
        "title": "Concílio dos Seis Dragões",
        "cards": [
          "Valkyra, Imperatriz Pentacromática",
          "Estandarte da Legião Dourada",
          "Monólito da Presa Primordial"
        ],
        "howItWorks": "Combine Valkyra, Imperatriz Pentacromática + Estandarte da Legião Dourada + Monólito da Presa Primordial para gerar vantagem contínua de campo e pressionar a fileira inimiga sem perder tempo de Essência."
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
      "neutral_172_armada_draconica_matriz",
      "neutral_167_arauto_prisma_matriz",
      "neutral_171_pactuario_elemental_matriz",
      "gold_171_pactuario_elemental_sol",
      "neutral_169_pressagio_revoada_matriz",
      "blue_169_pressagio_revoada_gelo"
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
