import React, { useState } from 'react';
import { CardDefinition, Domain } from '../types/game';
import { ALL_CARDS, CARDS_BY_ID } from '../data/cards';
import { CardView, DOMAIN_META } from './CardView';

export interface TutorialCodexViewProps {
  isModal?: boolean;
  onClose?: () => void;
  onStartPracticeDuel?: () => void;
  onInspectCard?: (card: CardDefinition) => void;
}

type CodexSectionId =
  | 'walkthrough'
  | 'combat_rules'
  | 'board_stacking'
  | 'deckbuilding'
  | 'domains'
  | 'weather_runes'
  | 'modes_economy'
  | 'keywords'
  | 'controls';

interface WalkthroughStep {
  stepNumber: number;
  badge: string;
  title: string;
  subtitle: string;
  cardId: string;
  summary: string;
  keyPoints: { tag: string; title: string; detail: string }[];
  proTip: string;
}

const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    stepNumber: 1,
    badge: 'FUNDAMENTOS DA PARTIDA',
    title: 'Os Soberanos, Fadiga & Condição de Vitória',
    subtitle: 'Reduza a Vida do Soberano rival de 40 a 0 (grimório vazio causa 2 de Fadiga por compra).',
    cardId: 'neutral_10_valkyra_pentacromatica',
    summary:
      'Cada Soberano inicia com 40 pontos de Vida, 3 de Essência Máxima e 7 cartas na mão (teto de 12 cartas na mão; compras acima de 12 queimam para a Cripta). Em caso de Colapso Mútuo simultâneo (ambos <= 0 PV), o jogador prevalece.',
    keyPoints: [
      {
        tag: 'RITUAL • 2 ESSÊNCIA',
        title: 'Poder do Soberano (1×/Turno)',
        detail:
          'Ativável uma vez por turno na barra inferior. Dispara a técnica assinatura do Domínio principal do seu grimório para causar dano, congelar, curar ou blindar aliados.',
      },
      {
        tag: 'RITUAL • 3 VIDA & +1 CORRUPÇÃO',
        title: 'Pacto de Sangue & Fadiga (-2 PV)',
        detail:
          'Sacrifique 3 PV (exige > 3 PV) 1× por turno para ganhar +1 Essência imediata e +1 Corrupção. Se o grimório acabar, você não perde na hora: cada compra vazia causa 2 de dano de Fadiga.',
      },
      {
        tag: 'PREPARAÇÃO • 30s / 60s',
        title: 'Mulligan Inicial & Relógio de Fase',
        detail:
          'Antes do Turno 1 (30s), troque cartas pesadas da mão inicial (você compra as novas antes de reembaralhar as devolvidas). Em partida, cada fase tem 60 segundos.',
      },
    ],
    proTip:
      'Ao atingir 5+ de Corrupção Abissal, todas as suas criaturas entram com +1 ATQ permanente e seus feitiços/sopros ganham +1 de dano — mas não estoure 10/10 (-2 PV de Sobrecarga)!',
  },
  {
    stepNumber: 2,
    badge: 'ECONOMIA ELEMENTAL',
    title: 'Essência (até 15), Afinidade Inicial & Canalização',
    subtitle: 'Sua Essência sobe +1 por rodada (até 15) e 65% da Afinidade de outras cores apoia cartas multicor.',
    cardId: 'blue_36_tomo_infinito',
    summary:
      'Baralhos de 1 cor já iniciam a partida com 2 de Afinidade na sua cor; baralhos multicor iniciam com 1 + 1 nas duas cores principais. A cada rodada sua Essência Máxima sobe +1 (até 15) e você compra 1 carta.',
    keyPoints: [
      {
        tag: 'ATALHO [C] • 1×/TURNO',
        title: 'Canalizar Carta (+1 Afinidade & +1 Carta)',
        detail:
          'Recicle 1 carta da mão no Altar para ganhar +1 Afinidade da cor dela e comprar +1 carta substituta. Canalizar uma carta Neutra concede +1 Neutro E +1 automático na cor que sua mão mais precisa!',
      },
      {
        tag: 'IMPULSO EXTRA [C]',
        title: 'Queimar Cartas por Essência (+1⚡)',
        detail:
          'Sem limite por turno: envie cartas extras da mão para a Cripta (sem comprar carta de reposição) em troca de +1 de Essência temporária neste turno e +1 de Afinidade.',
      },
      {
        tag: 'AFINIDADE CRUZADA 65%',
        title: 'Apoio Multicor & Marco 6/6',
        detail:
          'Para jogar cartas com requisito de Afinidade, 65% (arredondado para cima) das suas Afinidades nas demais cores contam junto! E no seu Domínio Primário, todas as cores somam rumo ao marco 6/6 da Expansão.',
      },
    ],
    proTip:
      'Nos três primeiros turnos, canalize [C] cartas pesadas ou Neutras para ciclar sua mão gratuitamente e destravar tanto cartas multicor quanto o marco 6/6.',
  },
  {
    stepNumber: 3,
    badge: 'POSICIONAMENTO TÁTICO',
    title: 'Mesa 6×4, Vanguarda vs. Retaguarda & Pilhas 3x',
    subtitle: 'Seis colunas independentes e duas fileiras por lado, com até 3 unidades empilhadas por slot.',
    cardId: 'gold_07_dragao_ouro',
    summary:
      'Cada lado possui 6 slots de Vanguarda (frente) e 6 de Retaguarda (trás). A fileira define quem você alcança, como o Soberano é protegido e quais bônus automáticos sua tropa recebe.',
    keyPoints: [
      {
        tag: 'LINHA DE FRENTE [V]',
        title: 'Vanguarda: Alcança Tudo & Falange',
        detail:
          'Ataca qualquer coluna inimiga (Vanguarda ou Retaguarda) e atinge o Soberano rival se a própria coluna estiver livre. Recebe +1 Armadura ao lado de um Guardião na Vanguarda e +1 ATQ de Invasão se a Retaguarda oposta da coluna estiver vazia.',
      },
      {
        tag: 'SUPORTE [R]',
        title: 'Retaguarda: Defesa Só na Coluna & +1 ATQ',
        detail:
          'Ganha +1 ATQ de Disparo Apoiado quando há aliado na Vanguarda da mesma coluna. Atenção: uma criatura comum na Retaguarda só protege o Soberano contra ataques vindos da SUA própria coluna!',
      },
      {
        tag: 'MOVIMENTAÇÃO 1×/TURNO',
        title: 'Alternar Fileira & Pilhas 3x',
        detail:
          'Uma vez por turno, mova gratuitamente 1 criatura não congelada entre Vanguarda e Retaguarda. Empilhe até 3 cartas atrás de um Guardião contra alvos únicos, mas espalhe colunas contra Sopro e Atropelar.',
      },
    ],
    proTip:
      'Consulte a aba "Combate, Fileiras & Bloqueios" aqui no Tutorial para ver a matriz completa de alcance por coluna, Voo, Alcance e Guardião!',
  },
  {
    stepNumber: 4,
    badge: 'TIPOS DE CARTAS, EMBOSCADAS & ASCENSÃO',
    title: 'Invocações Ocultas, Emboscadas & Evolução ★',
    subtitle: 'Entenda como Emboscadas disparam, por que não bloqueiam colunas e como a Ascensão preserva buffs.',
    cardId: 'green_40_licantropo_alfa',
    summary:
      'Na Fase 1 (Mobilização), invocações rivais permanecem ocultas até a revelação da Fase 2. Combine criaturas, Relíquias de Retaguarda, Feitiços, Emboscadas e Ascensões.',
    keyPoints: [
      {
        tag: 'PERMANENTES [R]',
        title: 'Criaturas vs. Relíquias de Retaguarda',
        detail:
          'Relíquias de baralho são instaladas exclusivamente na Retaguarda com Durabilidade própria (não atacam nem contra-atacam, mas geram efeitos passivos ou por turno). Não confunda com a Relíquia da Coroa equipada antes da batalha!',
      },
      {
        tag: 'GATILHO EXATO • EMBOSCADAS',
        title: 'Como Funcionam as Emboscadas',
        detail:
          'Reações armadas na Retaguarda NÃO bloqueiam a coluna nem impedem +1 ATQ de Invasão. Elas disparam ANTES do golpe se um inimigo atacar naquela mesma coluna OU se qualquer inimigo atacar seu Soberano (se matar/congelar o agressor, o golpe é cancelado!).',
      },
      {
        tag: 'EVOLUÇÃO ★ • PRESERVA BUFFS',
        title: 'Ascensão de Criatura em Campo',
        detail:
          'Ao pagar o custo de Ascensão (★), a unidade evolui preservando 100% dos bônus permanentes (+ATQ/+ARM/+VID) que já havia acumulado antes, cura o ganho de Vida e recebe suas novas palavras-chave na hora.',
      },
    ],
    proTip:
      'Como qualquer ataque direto ao seu Soberano aciona Emboscadas armadas em QUALQUER coluna da sua Retaguarda, 1 Emboscada bem guardada pode salvar você de um golpe letal!',
  },
  {
    stepNumber: 5,
    badge: 'FASES DA RODADA, BLOQUEIO & 3 ONDAS',
    title: 'Posturas (Atacar / Defender), Guardião, Voo & Alcance',
    subtitle: 'Fase 1 de Mobilização, Fase 2 de Planejamento e Resolução Ordenada em 3 Ondas.',
    cardId: 'gold_59_cavaleiro_grifo',
    summary:
      'Cada rodada divide-se em Mobilização (invocar, canalizar e mover 1 fileira) e Planejamento de Combate (alternar posturas Atacar ⚔️ ou Defender 🛡️ +1 Armadura, lançar feitiços e executar as 3 Ondas).',
    keyPoints: [
      {
        tag: '3 ONDAS & REDIRECIONAMENTO',
        title: 'Magias → Ímpeto → Choque Simultâneo',
        detail:
          '1º Feitiços/Poderes; 2º Ímpeto (sem contra-ataque se matar alvo sem Ímpeto!); 3º Choque Simultâneo (duelos mútuos batem uma única vez simultânea, e se o alvo já morreu na Onda 1/2 a unidade avança automaticamente na coluna!).',
      },
      {
        tag: 'QUEM BLOQUEIA QUEM',
        title: 'Guardião, Voo & Alcance',
        detail:
          'Ter apenas Voo ou Alcance NÃO bloqueia ataques inimigos! Atacantes com Voo só são travados por Guardião + Voo; atacantes com Alcance só são travados por qualquer Guardião na Vanguarda.',
      },
      {
        tag: 'CONTRA-ATAQUE & ARMADURA',
        title: 'Disparo Livre na Retaguarda',
        detail:
          'Alcance disparando da Retaguarda NÃO sofre contra-ataque (na Vanguarda sofre!). Se o Ataque for menor ou igual à Armadura do alvo, o dano causado é 0 total.',
      },
    ],
    proTip:
      'Coloque campeões feridos em postura Defender (🛡️ +1 Armadura) e mantenha unidades de Alcance na Retaguarda atrás de um aliado (+1 ATQ e zero contra-ataque).',
  },
  {
    stepNumber: 6,
    badge: 'EXPANSÃO DE DOMÍNIO & CLIMAS',
    title: 'Barreira 6/6, 4 Contramedidas, Exaustão & 6 Climas',
    subtitle: 'Com 6/6 de Afinidade e 3 de Essência, domine o campo por 3 rodadas — ou quebre a barreira rival.',
    cardId: 'purple_65_principe_mortos',
    summary:
      'A Expansão de Domínio concede +1/+1, Ímpeto e Acerto Garantido a todas as suas criaturas aptas (atenção: NÃO remove Congelar nem Exaustão). Quando um Domínio é quebrado, o dono sofre 2 rodadas de Exaustão sem poder expandir.',
    keyPoints: [
      {
        tag: 'SOBREPUJAR vs. CHOQUE 50/50',
        title: 'Disputa por Afinidade (-3 PV)',
        detail:
          'Se você expandir contra um Domínio ativo tendo Afinidade ESTRITAMENTE MAIOR, estilhaça o Domínio rival na hora e causa 3 de dano ao Soberano dele! Se empatar ou for menor, inicia Disputa 50/50 anulando ambos os Acertos Garantidos.',
      },
      {
        tag: '4 CONTRAMEDIDAS',
        title: 'Simples (2⚡), Sacrifício (10❤️), 8+ Dano & Roda',
        detail:
          '1) Domínio Simples (2⚡, anula Acerto Garantido por 1 rodada); 2) Tributo de Sacrifício (10 PV distribuídos entre tropas e Soberano, sem matar seu Soberano); 3) Causar 8+ de dano ao Soberano rival na rodada; 4) Unidades Quebra-Domínio (☸).',
      },
      {
        tag: '6 CLIMAS ELEMENTAIS',
        title: 'Climas Geográficos & Planares',
        detail:
          'Mapas regionais, Cercos da Conquista e Fendas ativam 6 Climas de Arena (Cinzas Rubras, Nevasca Astral, Eclipse Umbral, Monção Silvestre, Zênite Solar e Convergência Astral). Veja todos na aba "Expansão, Climas & Quebra"!',
      },
    ],
    proTip:
      'Se o inimigo expandir o Domínio e você tiver tropas com bastante Vida sobrando, use o Tributo de Sacrifício (10 PV distribuídos) para quebrar a barreira dele e deixá-lo 2 turnos em Exaustão!',
  },
  {
    stepNumber: 7,
    badge: 'GRIMÓRIOS, PACOTES & ESTILHAÇOS ASTRAIS',
    title: 'Forja de 100 Cartas (100🪙), Relicário (30🪙) & Estilhaços (💎)',
    subtitle: '1º Grimório grátis, pacotes por 30 Ouro, edição completa por 100 Ouro e criação direta por Estilhaços.',
    cardId: 'blue_06_dragao_azul',
    summary:
      `Você inicia com 160 de Ouro (+10 de Ouro por vitória padrão) e monta seu 1º Grimório de 100 cartas gratuitamente entre as ${ALL_CARDS.length} cartas ou qualquer um dos 30 modelos táticos.`,
    keyPoints: [
      {
        tag: 'RELICÁRIO • 30 OURO',
        title: 'Pacotes de 5 Cartas (1 Rara/Lendária)',
        detail:
          'Cada pacote no Relicário custa 30 de Ouro (Pentacromático ou focado em 1 dos 5 Domínios) e traz 5 cartas com pelo menos 1 Rara ou Lendária garantida.',
      },
      {
        tag: 'FORJA • ESTILHAÇOS 💎',
        title: 'Reciclagem Automática & Criação Direta',
        detail:
          'Cópias além do limite útil (3× Comum/Incomum, 2× Rara, 1× Lendária) viram automaticamente Estilhaços Astrais (+5 / +15 / +40 / +120💎). Use-os na Forja para criar qualquer carta específica (20 / 50 / 140 / 360💎)!',
      },
      {
        tag: 'EDIÇÃO TOTAL • 100 OURO',
        title: 'Editar Grimório Base (100 🪙)',
        detail:
          `Trocar cartas que você já possui na coleção é sempre gratuito. E por apenas 100 de Ouro você reabre todo o catálogo de ${ALL_CARDS.length} cartas ou os 30 modelos táticos na Forja.`,
      },
    ],
    proTip:
      'Quer uma Lendária específica sem depender da sorte? Acumule 360 Estilhaços Astrais (💎) com duplicatas/Fendas/Draft ou derrote o chefe guardião dela na Grande Campanha!',
  },
  {
    stepNumber: 8,
    badge: 'TODOS OS MODOS & RELÍQUIAS DA COROA',
    title: 'Os 7 Modos de Jogo, 12 Relíquias da Coroa & Conclave 1×1',
    subtitle: 'Campanha (190 confrontos), Conquista (48 províncias), Expedição, Draft, Fendas, Enigmas e PvP.',
    cardId: 'red_08_dragao_vermelho',
    summary:
      'Antes de iniciar batalhas na Campanha, Conquista, Expedição, Arena ou Fendas, equipe 1 das 12 Relíquias da Coroa Soberana desbloqueadas na sua conta para receber bônus permanentes de abertura!',
    keyPoints: [
      {
        tag: 'ESTRATÉGIA & ROGUELITE',
        title: 'Campanha (190), Conquista (48) & Expedição (9)',
        detail:
          'Grande Campanha (21 mapas em zoom 100% e 190 chefes); Conquista Continental (48 províncias, Suprimentos, 5 Edifícios, Diplomacia e Crises); e Expedição Roguelite (6 Bênçãos Soberanas, 40 cartas e 9 etapas).',
      },
      {
        tag: 'DESAFIOS ESPECIAIS',
        title: 'Crisol (Draft), Fendas (6) & Enigmas Letais',
        detail:
          'Crisol dos Cinco Selos (Draft de 40 cartas sem limite de cópias até 7 vitórias ou 3 derrotas; 1º passe grátis, depois 100🪙); Fendas da Fratura (6 mutadores simétricos + bônus semanal); e Enigmas de Letal em 1 Turno.',
      },
      {
        tag: 'MULTIPLAYER 1×1',
        title: 'Conclave Online & Salas PACT-XXXX',
        detail:
          'Enfrente outros Soberanos em tempo real na Fila Rápida 1×1 (com ranking Elo de Reputação) ou crie Salas Privadas com código PACT-XXXX.',
      },
    ],
    proTip:
      'Consulte a nova aba "Economia, Relíquias & Modos" aqui no Tutorial para ver as regras detalhadas, custos e recompensas de cada um dos 7 modos!',
  },
  {
    stepNumber: 9,
    badge: 'SINERGIAS & COMPÊNDIO TÁTICO',
    title: 'Combos de 1 a 5 Cores & Reações em Cadeia',
    subtitle: 'Domine os 62 combos catalogados no Oráculo: Monocromáticos, Alianças, Tríades e Pentacromáticos.',
    cardId: 'gold_166_trono_soberano_sol',
    summary:
      `As ${ALL_CARDS.length} cartas foram desenhadas com sinergias cruzadas entre Criaturas Ascendidas (★), Relíquias de Retaguarda, Feitiços Cataclísmicos e Emboscadas Ocultas. Consulte o Compêndio de Combos no Oráculo de Guerra para ver quais combinações já estão ativas no seu Grimório.`,
    keyPoints: [
      {
        tag: '1 A 2 CORES',
        title: 'Motores Puros & As 10 Alianças',
        detail:
          'Combos de 1 Cor atingem 6/6 de Afinidade rapidamente para a Expansão de Domínio, enquanto as 10 Alianças de 2 Cores unem forças complementares (ex.: Rampa Verde + Trava Glacial Azul, ou Fênix Rubra + Reanimação Umbral).',
      },
      {
        tag: '3 CORES • 10 TRÍADES',
        title: 'As 10 Tríades Elementais',
        detail:
          'Canalizando 1 carta por turno nos 3 primeiros turnos ([C]), você habilita as 10 Tríades de 3 Cores — combinando geração de Essência, controle em área e finalizadores lendários de múltiplos Domínios.',
      },
      {
        tag: '4–5 CORES • TRONOS #166',
        title: 'Convergência Pentacromática',
        detail:
          'Relíquias Neutras de 0 Afinidade (Pedra Filosofal, Graal do Prisma) sustentam baralhos de 4–5 cores, permitindo reunir os Cinco Tronos Soberanos (#166) ou a Revoada da Imperatriz Pentacromática.',
      },
    ],
    proTip:
      'Abra o "Oráculo de Guerra → Compêndio de Combos" e ative o filtro "★ No Meu Grimório" para descobrir instantaneamente todos os combos compatíveis com as cartas que você possui!',
  },
  {
    stepNumber: 10,
    badge: 'ATLAS & GRANDE CAMPANHA DE VAELORIA',
    title: '21 Mapas (Zoom 100%), 190 Confrontos & Zona de Controle',
    subtitle: 'Derrote todas as 276 criaturas Raras e Lendárias passo a passo pelas estradas e converta o continente à sua cor.',
    cardId: 'neutral_173_gorgonoth_devorador_continentes',
    summary:
      'O Atlas de Vaeloria reúne 21 mapas 16:9 fixados em 100% de zoom e 100% visíveis na tela. Na Grande Campanha, você marcha passo a passo por 190 confrontos geográficos cobrindo 100% das criaturas Raras e Lendárias.',
    keyPoints: [
      {
        tag: 'ZONA DE CONTROLE',
        title: 'Marcha Passo a Passo Sem Saltar Inimigos',
        detail:
          'O Soberano caminha pelas estradas geográficas. Um adversário vivo bloqueia estritamente os caminhos e portais adiante dele — é preciso vencê-lo para abrir passagem.',
      },
      {
        tag: 'RECUO TÁTICO LIVRE',
        title: 'Mudança de Rota/Cor & Desbloqueio de Cartas',
        detail:
          'Se um Trono Tier 4–5 estiver forte demais, recue livremente por estradas já vencidas e migre para a fronteira Tier 1 de outra cor: cada vitória desbloqueia as cartas Raras/Lendárias daquele chefe no seu Grimório!',
      },
      {
        tag: 'DOMINAÇÃO CROMÁTICA',
        title: 'Conversão Territorial em 100%',
        detail:
          'Ao derrotar 100% dos confrontos de um sub-mapa, toda aquela região e seu território no Mapa Continental assumem permanentemente a cor da bandeira do seu Soberano.',
      },
    ],
    proTip:
      'As cartas Lendárias mais poderosas de custo 8–10 guardam os 6 Tronos Finais de cada cor, culminando em Gorgonoth na Cidade Franca Axial!',
  },
];

interface KeywordEntry {
  icon: string;
  name: string;
  category: 'Ofensiva' | 'Defensiva' | 'Mobilidade' | 'Especial';
  color: string;
  description: string;
  tacticalTip: string;
  exampleCardId: string;
}

const KEYWORD_ENCYCLOPEDIA: KeywordEntry[] = [
  {
    icon: '⚡',
    name: 'Ímpeto',
    category: 'Ofensiva',
    color: '#ef4444',
    description:
      'Ignora o tempo de preparação para atacar no turno em que entra e age na Onda 2 (Iniciativa Rápida): se abater um defensor sem Ímpeto, mata o alvo antes que ele possa contra-atacar.',
    tacticalTip:
      'Ideal para abater ameaças frágeis sem sofrer dano de retorno ou finalizar o Soberano rival de surpresa.',
    exampleCardId: 'red_04_meio_dragao',
  },
  {
    icon: '🛡️',
    name: 'Guardião',
    category: 'Defensiva',
    color: '#facc15',
    description:
      'Na Vanguarda: obriga atacantes terrestres (de todas as 6 colunas) e arqueiros com Alcance a atacá-lo primeiro, além de dar +1 Armadura a vizinhos na Vanguarda. Na Retaguarda: só intercepta atacantes terrestres da Vanguarda rival até ±1 coluna e não para Alcance. Só bloqueia Voo se tiver Guardião + Voo.',
    tacticalTip:
      'Mantenha seus Guardiões na Vanguarda para travar todas as colunas do tabuleiro ao mesmo tempo.',
    exampleCardId: 'gold_04_armadura_conjurada',
  },
  {
    icon: '🪽',
    name: 'Voo',
    category: 'Mobilidade',
    color: '#38bdf8',
    description:
      'Ataca qualquer coluna, ignora bloqueadores sem Voo e pode alvejar direto a Retaguarda ou o Soberano rival — só é bloqueado por inimigos com Guardião + Voo. Atenção: ter apenas Voo NÃO bloqueia voadores inimigos no turno deles.',
    tacticalTip:
      'Use como antiaéreo ativo no seu turno ou para destruir Relíquias escondidas atrás de Guardiões terrestres.',
    exampleCardId: 'red_06_efreeti',
  },
  {
    icon: '🏹',
    name: 'Alcance',
    category: 'Mobilidade',
    color: '#60a5fa',
    description:
      'Atinge alvos terrestres ou com Voo em qualquer coluna (só é travado por Guardião na Vanguarda inimiga). Quando ataca a partir da Retaguarda, NÃO sofre contra-ataque! Na Vanguarda, sofre contra-ataque normal. Ter apenas Alcance não bloqueia ataques rivais.',
    tacticalTip:
      'Posicione na Retaguarda exatamente atrás de um aliado na mesma coluna para ganhar +1 ATQ de Disparo Apoiado e bater sem levar troco.',
    exampleCardId: 'green_02_aranha_gigante',
  },
  {
    icon: '✨',
    name: 'Escudo Divino',
    category: 'Defensiva',
    color: '#fde047',
    description:
      'Anula completamente a primeira instância de dano que a unidade sofreria de qualquer fonte (inclusive impedindo Toque Letal nesse golpe).',
    tacticalTip:
      'Remova o Escudo Divino inimigo com um efeito leve antes de desferir seu ataque pesado.',
    exampleCardId: 'gold_09_serafim_solar',
  },
  {
    icon: '☠️',
    name: 'Toque Letal',
    category: 'Ofensiva',
    color: '#a855f7',
    description:
      'Causando pelo menos 1 de dano real em combate (após Armadura e Escudo Divino): no corpo a corpo (ou atacando da Vanguarda) executa a criatura instantaneamente; em disparo à distância (Alcance na Retaguarda), aplica -1 de veneno adicional.',
    tacticalTip:
      'Avance o assassino para a Vanguarda quando quiser execução letal imediata contra colossos de alta Vida.',
    exampleCardId: 'purple_02_sombra',
  },
  {
    icon: '🩸',
    name: 'Dreno de Vida',
    category: 'Especial',
    color: '#c084fc',
    description:
      'Restaura +2 pontos de Vida ao seu Soberano ao causar dano real direto ao Soberano rival, ou +1 ponto de Vida ao causar dano real a criaturas (tanto atacando quanto contra-atacando na defesa).',
    tacticalTip:
      'Acertar diretamente o Soberano rival dobra a cura (+2 PV), compensando rapidamente o Pacto de Sangue.',
    exampleCardId: 'purple_19_conde_vampiro',
  },
  {
    icon: '🔥',
    name: 'Fúria Crescente',
    category: 'Ofensiva',
    color: '#fb923c',
    description:
      'Sempre que esta criatura sobrevive a dano, recebe +2 de Ataque permanentemente.',
    tacticalTip:
      'Combine com curas ou Armadura para escalar o poder ofensivo da unidade a cada troca.',
    exampleCardId: 'red_16_orc_saqueador',
  },
  {
    icon: '⚰️',
    name: 'Renascer',
    category: 'Especial',
    color: '#e879f9',
    description:
      'Na primeira vez em que é destruída, retorna imediatamente ao campo com 1 ponto de Vida.',
    tacticalTip:
      'Exige dois ataques inimigos para liberar a coluna, mantendo sua Vanguarda ativa por mais tempo.',
    exampleCardId: 'purple_01_esqueleto',
  },
  {
    icon: '🦏',
    name: 'Atropelar',
    category: 'Ofensiva',
    color: '#22c55e',
    description:
      'Ao destruir o defensor, varre em sequência as demais cartas empilhadas naquele mesmo slot e transfere o dano restante diretamente ao Soberano rival.',
    tacticalTip:
      'Pune formações empilhadas 3x e garante dano contínuo ao Soberano oponente.',
    exampleCardId: 'green_03_ursogrifo',
  },
  {
    icon: '🌋',
    name: 'Pele Incandescente',
    category: 'Defensiva',
    color: '#fb7185',
    description:
      'Ao sofrer um ataque engajado (sem Alcance da Retaguarda) e o agressor ainda sobreviver ao contra-ataque normal, causa +1 de dano de fogo extra de retorno.',
    tacticalTip:
      'Posicione na Vanguarda para desgastar enxames de unidades de baixa Vida ou quebrar Escudos Divinos.',
    exampleCardId: 'red_05_salamandra',
  },
  {
    icon: '🐉',
    name: 'Sopro Elemental',
    category: 'Ofensiva',
    color: '#f97316',
    description:
      'Ao entrar em campo: varre toda a fileira inimiga da frente (Vanguarda, ou Retaguarda se a Vanguarda estiver vazia, incluindo pilhas 3×). Ao atacar em combate: queima todas as outras cartas empilhadas no mesmo slot do alvo!',
    tacticalTip:
      'A ferramenta definitiva para limpar fileiras inteiras ao entrar e punir slots empilhados 3× a cada ataque.',
    exampleCardId: 'red_08_dragao_vermelho',
  },
  {
    icon: '🧱',
    name: 'Armadura',
    category: 'Defensiva',
    color: '#cbd5e1',
    description:
      'Reduz o dano sofrido: se Ataque <= Armadura, o dano recebido é 0 total! Se Ataque > Armadura, o dano recebido é (Ataque - Armadura, mínimo 1). Postura Defender concede +1 de Armadura extra.',
    tacticalTip:
      'Unidades com 2+ de Armadura (ou ao lado de um Guardião na Falange) anulam completamente atacantes pequenos.',
    exampleCardId: 'gold_05_automato_guardiao',
  },
  {
    icon: '🌿',
    name: 'Regeneração',
    category: 'Defensiva',
    color: '#4ade80',
    description:
      'No início de cada turno do seu controlador, restaura automaticamente +X pontos de Vida conforme o valor de Regeneração da carta e bônus ativos (+1, +2 ou +3).',
    tacticalTip:
      'Faça trocas parciais no seu turno para recuperar a integridade da criatura na rodada seguinte.',
    exampleCardId: 'green_07_troll',
  },
  {
    icon: '❄️',
    name: 'Congelar',
    category: 'Especial',
    color: '#38bdf8',
    description:
      'Impede a unidade atingida de atacar ou se mover até o final do próximo turno do seu controlador.',
    tacticalTip:
      'Neutralize o maior colosso inimigo por uma rodada inteira para abrir espaço para sua ofensiva.',
    exampleCardId: 'blue_06_dragao_azul',
  },
];

export const TutorialCodexView: React.FC<TutorialCodexViewProps> = ({
  isModal = false,
  onClose,
  onStartPracticeDuel,
  onInspectCard,
}) => {
  const [activeSection, setActiveSection] = useState<CodexSectionId>('walkthrough');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [keywordFilter, setKeywordFilter] = useState<string>('all');

  const currentStep = WALKTHROUGH_STEPS[activeStepIndex] ?? WALKTHROUGH_STEPS[0];
  const stepCard = CARDS_BY_ID[currentStep.cardId] ?? ALL_CARDS[0];

  const filteredKeywords = KEYWORD_ENCYCLOPEDIA.filter(
    (k) => keywordFilter === 'all' || k.category === keywordFilter
  );

  const STEP_SHORT_LABELS: Record<number, string> = {
    1: '1. Soberanos',
    2: '2. Essência',
    3: '3. Mesa 6×4',
    4: '4. Cartas',
    5: '5. Combate',
    6: '6. Expansão',
    7: '7. Grimório',
    8: '8. Conclave',
    9: '9. Combos',
    10: '10. Campanha',
  };

  const innerContent = (
    <div className={isModal ? 'tg-modal-inner' : 'aaa-page-shell'}>
      {/* Unified Navigation Header (Main Tabs + Contextual Sub-Tabs Aligned on Same Left Edge) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          padding: '8px 12px',
          background: '#0b0f17',
          border: '1px solid rgba(148, 163, 184, 0.18)',
          borderRadius: 8,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            <button
              type="button"
              className={`nav-tab-btn ${activeSection === 'walkthrough' ? 'active' : ''}`}
              onClick={() => setActiveSection('walkthrough')}
              style={{ padding: '5px 10px', fontSize: '0.73rem' }}
            >
              Passo a Passo ({WALKTHROUGH_STEPS.length})
            </button>
            <button
              type="button"
              className={`nav-tab-btn ${activeSection === 'combat_rules' ? 'active' : ''}`}
              onClick={() => setActiveSection('combat_rules')}
              style={{ padding: '5px 10px', fontSize: '0.73rem' }}
            >
              Combate, Fileiras & Bloqueios
            </button>
            <button
              type="button"
              className={`nav-tab-btn ${activeSection === 'board_stacking' ? 'active' : ''}`}
              onClick={() => setActiveSection('board_stacking')}
              style={{ padding: '5px 10px', fontSize: '0.73rem' }}
            >
              Mesa 6×4 & Formações
            </button>
            <button
              type="button"
              className={`nav-tab-btn ${activeSection === 'deckbuilding' ? 'active' : ''}`}
              onClick={() => setActiveSection('deckbuilding')}
              style={{ padding: '5px 10px', fontSize: '0.73rem' }}
            >
              Construção de Grimórios
            </button>
            <button
              type="button"
              className={`nav-tab-btn ${activeSection === 'domains' ? 'active' : ''}`}
              onClick={() => setActiveSection('domains')}
              style={{ padding: '5px 10px', fontSize: '0.73rem' }}
            >
              Os 5 Domínios
            </button>
            <button
              type="button"
              className={`nav-tab-btn ${activeSection === 'weather_runes' ? 'active' : ''}`}
              onClick={() => setActiveSection('weather_runes')}
              style={{ padding: '5px 10px', fontSize: '0.73rem' }}
            >
              Expansão, Climas & Quebra
            </button>
            <button
              type="button"
              className={`nav-tab-btn ${activeSection === 'modes_economy' ? 'active' : ''}`}
              onClick={() => setActiveSection('modes_economy')}
              style={{ padding: '5px 10px', fontSize: '0.73rem' }}
            >
              Economia, Relíquias & Modos
            </button>
            <button
              type="button"
              className={`nav-tab-btn ${activeSection === 'keywords' ? 'active' : ''}`}
              onClick={() => setActiveSection('keywords')}
              style={{ padding: '5px 10px', fontSize: '0.73rem' }}
            >
              Palavras-Chave ({KEYWORD_ENCYCLOPEDIA.length})
            </button>
            <button
              type="button"
              className={`nav-tab-btn ${activeSection === 'controls' ? 'active' : ''}`}
              onClick={() => setActiveSection('controls')}
              style={{ padding: '5px 10px', fontSize: '0.73rem' }}
            >
              Atalhos
            </button>
          </div>
          {isModal && onClose && (
            <button type="button" className="btn-fantasy btn-fantasy-danger" onClick={onClose}>
              Fechar
            </button>
          )}
        </div>

        {activeSection === 'walkthrough' && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.35rem',
              alignItems: 'center',
              paddingTop: '8px',
              borderTop: '1px solid rgba(148, 163, 184, 0.14)',
            }}
          >
            {WALKTHROUGH_STEPS.map((st, idx) => {
              const isCurrent = idx === activeStepIndex;
              return (
                <button
                  key={st.stepNumber}
                  type="button"
                  className={`nav-tab-btn ${isCurrent ? 'active' : ''}`}
                  onClick={() => setActiveStepIndex(idx)}
                  style={{ padding: '4px 9px', fontSize: '0.71rem' }}
                >
                  {STEP_SHORT_LABELS[st.stepNumber] ?? `${st.stepNumber}. ${st.title}`}
                </button>
              );
            })}
          </div>
        )}

        {activeSection === 'keywords' && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.35rem',
              alignItems: 'center',
              paddingTop: '8px',
              borderTop: '1px solid rgba(148, 163, 184, 0.14)',
            }}
          >
            {(['all', 'Ofensiva', 'Defensiva', 'Mobilidade', 'Especial'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                className={`nav-tab-btn ${keywordFilter === cat ? 'active' : ''}`}
                style={{ padding: '4px 9px', fontSize: '0.71rem' }}
                onClick={() => setKeywordFilter(cat)}
              >
                {cat === 'all' ? `Todas (${KEYWORD_ENCYCLOPEDIA.length})` : cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* =====================================================================
          SECTION 1: INTERACTIVE STEP-BY-STEP WALKTHROUGH
         ===================================================================== */}
      {activeSection === 'walkthrough' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* Active Lesson Showcase Card */}
          <div className="aaa-codex-row" style={{ alignItems: 'stretch', gap: '1.5rem' }}>
            <div
              className="aaa-codex-card-preview"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                minWidth: '240px',
              }}
            >
              {stepCard && (
                <CardView
                  card={stepCard}
                  mode="gallery"
                  isPlayable={true}
                  onClick={() => onInspectCard?.(stepCard)}
                  onInspect={onInspectCard}
                />
              )}
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', letterSpacing: '0.03em' }}>
                Clique na carta para inspecionar em 3D
              </span>
            </div>

            <div
              className="aaa-codex-info"
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div className="aaa-kicker" style={{ marginBottom: '0.25rem' }}>
                  LIÇÃO {String(currentStep.stepNumber).padStart(2, '0')} • {currentStep.badge}
                </div>
                <h2
                  className="font-cinzel aaa-codex-heading"
                  style={{ fontSize: '1.4rem', marginBottom: '0.35rem', color: '#f8fafc' }}
                >
                  {currentStep.title}
                </h2>
                <p
                  style={{
                    color: '#e6c875',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    marginBottom: '0.45rem',
                  }}
                >
                  {currentStep.subtitle}
                </p>
                <p
                  style={{
                    color: '#cbd5e1',
                    fontSize: '0.84rem',
                    lineHeight: 1.55,
                    margin: '0 0 0.85rem 0',
                  }}
                >
                  {currentStep.summary}
                </p>

                {/* Balanced 3-Column Key Points Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '0.85rem',
                    marginBottom: '1.1rem',
                  }}
                >
                  {currentStep.keyPoints.map((kp, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '0.95rem 1.05rem',
                        borderRadius: '10px',
                        background: 'rgba(15, 23, 42, 0.82)',
                        border: '1px solid rgba(212, 175, 55, 0.22)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        minHeight: '132px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.62rem',
                          fontWeight: 800,
                          letterSpacing: '0.09em',
                          color: '#d4af37',
                          marginBottom: '0.3rem',
                          textTransform: 'uppercase',
                        }}
                      >
                        {kp.tag}
                      </div>
                      <div
                        className="font-cinzel"
                        style={{
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          color: '#f8fafc',
                          marginBottom: '0.4rem',
                        }}
                      >
                        {kp.title}
                      </div>
                      <p
                        style={{
                          fontSize: '0.81rem',
                          color: '#cbd5e1',
                          lineHeight: 1.52,
                          margin: 0,
                        }}
                      >
                        {kp.detail}
                      </p>
                    </div>
                  ))}
                </div>

                {currentStep.proTip && (
                  <div
                    style={{
                      padding: '0.6rem 0.85rem',
                      borderRadius: '8px',
                      background: 'rgba(11, 16, 28, 0.92)',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      borderLeft: '3px solid #d4af37',
                      fontSize: '0.8rem',
                      color: '#e2e8f0',
                      lineHeight: 1.48,
                      marginBottom: '0.85rem',
                    }}
                  >
                    <strong style={{ color: '#fde68a' }}>Conselho do Mestre:</strong> {currentStep.proTip}
                  </div>
                )}
              </div>

              <div>
                {/* Lesson Navigation Footer */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    paddingTop: '0.65rem',
                    borderTop: '1px solid rgba(148, 163, 184, 0.15)',
                  }}
                >
                  <button
                    type="button"
                    className="btn-fantasy"
                    disabled={activeStepIndex === 0}
                    onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                  >
                    ← Anterior
                  </button>

                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    {activeStepIndex < WALKTHROUGH_STEPS.length - 1 ? (
                      <button
                        type="button"
                        className="btn-fantasy btn-fantasy-primary"
                        onClick={() =>
                          setActiveStepIndex((prev) =>
                            Math.min(WALKTHROUGH_STEPS.length - 1, prev + 1)
                          )
                        }
                      >
                        Próxima Lição ({activeStepIndex + 2}/{WALKTHROUGH_STEPS.length}) →
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="btn-fantasy"
                          onClick={() => setActiveSection('combat_rules')}
                        >
                          Ver Regras de Combate & Bloqueios →
                        </button>
                        {onStartPracticeDuel && (
                          <button
                            type="button"
                            className="btn-fantasy btn-fantasy-primary"
                            onClick={onStartPracticeDuel}
                          >
                            Praticar na Arena
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SECTION 1.2: EXPLICIT COMBAT, LANE, COLUMN & BLOCKING RULES MATRIX
         ===================================================================== */}
      {activeSection === 'combat_rules' && (
        <div className="tg-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
          <div>
            <div className="aaa-kicker">REGRAS EXATAS DO MOTOR DE COMBATE • COLUNAS, FILEIRAS, INTERCEPTAÇÃO & 3 ONDAS</div>
            <h2 className="font-cinzel gold-gradient-text" style={{ fontSize: '1.35rem', marginBottom: '0.35rem' }}>
              Vanguarda vs. Retaguarda, Defesa do Soberano, Voo, Alcance & Guardião
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
              Abaixo estão detalhadas todas as regras geométricas de alcance, proteção por coluna, contra-ataque e resolução em ondas exatamente como são calculadas na Arena.
            </p>
          </div>

          {/* TABELA 1: VANGUARDA VS RETAGUARDA (CRIATURAS TERRESTRES) */}
          <div
            style={{
              borderRadius: '10px',
              background: '#0b101c',
              border: '1px solid rgba(212, 175, 55, 0.32)',
              overflowX: 'auto',
            }}
          >
            <div
              style={{
                padding: '0.65rem 0.95rem',
                borderBottom: '1px solid rgba(212, 175, 55, 0.24)',
                background: '#0f1624',
                fontSize: '0.7rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                color: '#d4af37',
              }}
            >
              1. DIFERENÇAS EXATAS ENTRE VANGUARDA (FRENTE) E RETAGUARDA (TRÁS)
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', color: '#e2e8f0' }}>
              <thead>
                <tr style={{ background: 'rgba(15, 23, 42, 0.9)', textAlign: 'left' }}>
                  <th style={{ padding: '0.65rem 0.85rem', borderBottom: '1px solid rgba(148, 163, 184, 0.2)', width: '22%', color: '#fde68a' }}>
                    Situação Tática
                  </th>
                  <th style={{ padding: '0.65rem 0.85rem', borderBottom: '1px solid rgba(148, 163, 184, 0.2)', width: '39%', color: '#f8fafc' }}>
                    🛡️ Criatura na VANGUARDA (Frente)
                  </th>
                  <th style={{ padding: '0.65rem 0.85rem', borderBottom: '1px solid rgba(148, 163, 184, 0.2)', width: '39%', color: '#f8fafc' }}>
                    🏹 Criatura na RETAGUARDA (Trás)
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    topic: 'Quais criaturas inimigas pode atacar? (terrestre sem Voo/Alcance)',
                    vanguard:
                      'Alcança QUALQUER criatura terrestre inimiga em QUALQUER coluna — tanto na Vanguarda quanto na Retaguarda adversária (respeitando Guardião, se houver).',
                    rearguard:
                      'Contra a Vanguarda inimiga: alcança QUALQUER coluna. Contra a Retaguarda inimiga: fica presa à SUA PRÓPRIA coluna (e só se a Vanguarda daquela coluna estiver vazia). Só ataca a Retaguarda de outras colunas se TODA a Vanguarda terrestre inimiga estiver vazia.',
                  },
                  {
                    topic: 'Quando pode atacar o Soberano inimigo direto?',
                    vanguard:
                      'Assim que a SUA PRÓPRIA coluna estiver livre de bloqueadores terrestres (nem na Vanguarda nem na Retaguarda inimiga daquela coluna) e não houver Guardião interceptando.',
                    rearguard:
                      'Exige duas condições simultâneas: TODA a Vanguarda terrestre inimiga precisa estar vazia E a Retaguarda inimiga da sua própria coluna também precisa estar vazia.',
                  },
                  {
                    topic: 'Protege o seu Soberano contra ataques de outras colunas?',
                    vanguard:
                      'Criatura comum bloqueia apenas a sua própria coluna. Porém, um GUARDIÃO na Vanguarda protege TODAS as 6 colunas do tabuleiro ao mesmo tempo (inclusive travando arqueiros com Alcance)!',
                    rearguard:
                      'NÃO! Uma criatura comum na Retaguarda só defende ataques ao Soberano vindos da SUA PRÓPRIA coluna. Se outra coluna estiver vazia (frente e trás), o inimigo daquela coluna acerta o Soberano direto. Mesmo um Guardião na Retaguarda só intercepta colunas coladas (±1).',
                  },
                  {
                    topic: 'Como fica protegida de ataques inimigos?',
                    vanguard:
                      'Está na linha de frente: qualquer atacante inimigo (da Vanguarda ou da Retaguarda) pode alvejá-la.',
                    rearguard:
                      'Enquanto você mantiver unidades terrestres na sua Vanguarda, os atacantes terrestres da Retaguarda inimiga NÃO conseguem alcançar a sua Retaguarda fora de colunas abertas.',
                  },
                  {
                    topic: 'Bônus automáticos de Formação',
                    vanguard:
                      '• Falange (+1 Armadura): se estiver ao lado (coluna ±1) ou empilhada com um aliado Guardião na Vanguarda.\n• Invasão (+1 ATQ): se o slot da Retaguarda inimiga na mesma coluna estiver vazio.',
                    rearguard:
                      '• Disparo Apoiado (+1 ATQ): ganha +1 ATQ sempre que houver pelo menos 1 criatura aliada exatamente à sua frente na Vanguarda da mesma coluna.',
                  },
                ].map((row, rIdx) => (
                  <tr key={rIdx} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.14)' }}>
                    <td style={{ padding: '0.68rem 0.85rem', fontWeight: 700, color: '#e5c97b', verticalAlign: 'top' }}>
                      {row.topic}
                    </td>
                    <td style={{ padding: '0.68rem 0.85rem', color: '#cbd5e1', lineHeight: 1.5, verticalAlign: 'top', whiteSpace: 'pre-line' }}>
                      {row.vanguard}
                    </td>
                    <td style={{ padding: '0.68rem 0.85rem', color: '#cbd5e1', lineHeight: 1.5, verticalAlign: 'top', whiteSpace: 'pre-line' }}>
                      {row.rearguard}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TABELA 2: MATRIZ VOO, ALCANCE & GUARDIÃO */}
          <div
            style={{
              borderRadius: '10px',
              background: '#0b101c',
              border: '1px solid rgba(212, 175, 55, 0.32)',
              overflowX: 'auto',
            }}
          >
            <div
              style={{
                padding: '0.65rem 0.95rem',
                borderBottom: '1px solid rgba(212, 175, 55, 0.24)',
                background: '#0f1624',
                fontSize: '0.7rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                color: '#d4af37',
              }}
            >
              2. VOO, ALCANCE & GUARDIÃO: QUEM BLOQUEIA NO TURNO RIVAL vs. QUEM ACERTA NO SEU TURNO
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', color: '#e2e8f0' }}>
              <thead>
                <tr style={{ background: 'rgba(15, 23, 42, 0.9)', textAlign: 'left' }}>
                  <th style={{ padding: '0.65rem 0.85rem', borderBottom: '1px solid rgba(148, 163, 184, 0.2)', width: '20%', color: '#fde68a' }}>
                    Tipo de Atacante
                  </th>
                  <th style={{ padding: '0.65rem 0.85rem', borderBottom: '1px solid rgba(148, 163, 184, 0.2)', width: '32%', color: '#f8fafc' }}>
                    O que BLOQUEIA ele de bater no Soberano?
                  </th>
                  <th style={{ padding: '0.65rem 0.85rem', borderBottom: '1px solid rgba(148, 163, 184, 0.2)', width: '24%', color: '#f8fafc' }}>
                    O que NÃO o bloqueia?
                  </th>
                  <th style={{ padding: '0.65rem 0.85rem', borderBottom: '1px solid rgba(148, 163, 184, 0.2)', width: '24%', color: '#f8fafc' }}>
                    Contra-Ataque & Alvos
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    type: '🪽 Criatura com Voo',
                    blockedBy:
                      'SOMENTE uma criatura inimiga que tenha GUARDIÃO + VOO juntos (em qualquer fileira ou coluna).',
                    notBlockedBy:
                      'Criaturas comuns com Voo, criaturas com Alcance (mesmo na mesma coluna) e Guardiões terrestres sem Voo.',
                    counter:
                      'Sofre contra-ataque normal ao bater em criaturas. No turno do rival, pode ser alvejada por unidades com Voo, unidades com Alcance ou Feitiços (antiaéreo ativo).',
                  },
                  {
                    type: '🏹 Criatura com Alcance',
                    blockedBy:
                      'Qualquer criatura com GUARDIÃO posicionada na VANGUARDA inimiga (terrestre, voadora ou de alcance).',
                    notBlockedBy:
                      'Unidades sem Guardião (mesmo com Voo ou Alcance na mesma coluna) ou Guardiões escondidos na Retaguarda.',
                    counter:
                      'Na RETAGUARDA: Disparo Livre — NÃO sofre dano de contra-ataque! Na VANGUARDA: luta engajada e sofre contra-ataque normal. Acerta alvos terrestres e com Voo.',
                  },
                  {
                    type: '⚔️ Terrestre na Vanguarda (sem Voo/Alcance)',
                    blockedBy:
                      '• Qualquer Guardião terrestre na Vanguarda rival (todas as colunas);\n• Guardião terrestre na Retaguarda rival até ±1 coluna;\n• Para proteger o Soberano: qualquer terrestre naquela mesma coluna.',
                    notBlockedBy:
                      'Unidades comuns posicionadas em outras colunas ou unidades com Voo.',
                    counter:
                      'Sofre contra-ataque normal (salvo se tiver Ímpeto na Onda de Iniciativa e abater um alvo sem Ímpeto antes da resposta). Não acerta alvos com Voo.',
                  },
                  {
                    type: '🗡️ Terrestre na Retaguarda (sem Voo/Alcance)',
                    blockedBy:
                      '• Qualquer Guardião terrestre na Vanguarda rival;\n• Qualquer terrestre na Vanguarda rival impede ataques ao Soberano e às outras colunas da Retaguarda;\n• Terrestre na Retaguarda da mesma coluna protege o Soberano.',
                    notBlockedBy:
                      'Unidades com Voo (não bloqueiam terrestre, nem podem ser atacadas por terrestre sem Alcance).',
                    counter:
                      'Sofre contra-ataque normal (pois não tem Alcance). Use a Movimentação gratuita (1×/turno) para avançá-la à Vanguarda quando quiser abrir mais alvos.',
                  },
                ].map((row, rIdx) => (
                  <tr key={rIdx} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.14)' }}>
                    <td style={{ padding: '0.68rem 0.85rem', fontWeight: 700, color: '#e5c97b', verticalAlign: 'top' }}>
                      {row.type}
                    </td>
                    <td style={{ padding: '0.68rem 0.85rem', color: '#cbd5e1', lineHeight: 1.5, verticalAlign: 'top', whiteSpace: 'pre-line' }}>
                      {row.blockedBy}
                    </td>
                    <td style={{ padding: '0.68rem 0.85rem', color: '#94a3b8', lineHeight: 1.5, verticalAlign: 'top' }}>
                      {row.notBlockedBy}
                    </td>
                    <td style={{ padding: '0.68rem 0.85rem', color: '#cbd5e1', lineHeight: 1.5, verticalAlign: 'top' }}>
                      {row.counter}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* BLOCOS 3 & 4: FASES DA RODADA, 3 ONDAS, POSTURAS E FÓRMULAS EXATAS */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(265px, 1fr))',
              gap: '0.85rem',
            }}
          >
            {[
              {
                tag: 'FASE 1 + FASE 2 DA RODADA',
                title: 'Posturas: Atacar (⚔️) vs. Defender (🛡️ +1 Armadura)',
                desc: 'Na Fase 1 (Mobilização) você canaliza [C], invoca cartas e move até 1 unidade entre fileiras. Na Fase 2 (Planejamento) você escolhe a postura de cada criatura pronta: Atacar (definindo o alvo) ou Defender (não ataca na rodada, mas ganha +1 de Armadura de Bastião enquanto não estiver congelada).',
              },
              {
                tag: 'RESOLUÇÃO EM 3 ONDAS',
                title: '1º Magias → 2º Ímpeto → 3º Choque Simultâneo',
                desc: 'Ao clicar em Executar Combate: Onda 1 resolve Feitiços e Poderes (Proteção/Cura → Controle/Congelar → Dano); Onda 2 dispara criaturas com Ímpeto (se matarem um defensor sem Ímpeto, não levam contra-ataque!); Onda 3 resolve o Choque Simultâneo das demais tropas.',
              },
              {
                tag: 'FÓRMULA DE ARMADURA & ESCUDO',
                title: 'Absorção Total quando Ataque <= Armadura',
                desc: 'Se o Ataque do agressor for menor ou igual à Armadura atual do defensor (Ataque <= Armadura), o dano recebido é 0! Se Ataque > Armadura, o dano é (Ataque - Armadura). Já o Escudo Divino anula 100% da primeira instância de dano de qualquer valor.',
              },
              {
                tag: 'PILHAS 3× & INTERAÇÕES ESPECIAIS',
                title: 'Toque Letal, Atropelar & Sopro Elemental',
                desc: 'Toque Letal executa instantaneamente no corpo a corpo ao causar 1+ de dano real, mas à distância (Alcance na Retaguarda) aplica apenas -1 de veneno extra. Contra slots com até 3 cartas empilhadas, Atropelar varre toda a pilha antes de atingir o Soberano e Sopro queima todas as cartas do slot ao atacar (e toda a fileira ao entrar)!',
              },
              {
                tag: 'EMBOSCADAS & INVOCAÇÃO OCULTA',
                title: 'Gatilhos de Reação & Não-Bloqueio de Coluna',
                desc: 'Na Fase 1 as invocações rivais entram ocultas até a Fase 2. Reações armadas como Emboscada na Retaguarda NÃO bloqueiam a coluna nem impedem +1 ATQ de Invasão: elas disparam ANTES do golpe se um inimigo atacar naquela coluna OU atacar diretamente seu Soberano (se matarem ou congelarem o agressor, cancelam o ataque!).',
              },
              {
                tag: 'AVANÇO AUTOMÁTICO & DUELO MÚTUO',
                title: 'Redirecionamento de Coluna na Onda 2 e Onda 3',
                desc: 'Se o alvo planejado de uma unidade morrer antes da vez dela (na Onda 1 por feitiço ou na Onda 2 por Ímpeto), ela NÃO perde o ataque: redireciona automaticamente na mesma coluna ou avança até o Soberano! E se A planejou atacar B e B planejou atacar A na Onda 3, ambas trocam dano em um único Duelo Mútuo simultâneo.',
              },
              {
                tag: 'CORRUPÇÃO ABISSAL (0 A 10) & ASCENSÃO ★',
                title: 'Poder Sombrio (5+), Sobrecarga (10/10) & Evolução',
                desc: 'Pacto de Sangue (-3 PV), Dreno Umbroso e cartas Abissais somam Corrupção: com 5+ de Corrupção suas criaturas entram com +1 ATQ permanente e feitiços/sopros causam +1 de dano; porém em 10/10 cada ponto extra causa -2 PV de rebote! Já a Ascensão (★) evolui a criatura preservando 100% dos buffs permanentes acumulados.',
              },
              {
                tag: 'MÃO CHEIA (12), DEVOLUÇÃO (10) & FADIGA',
                title: 'Regras de Limite de Mão, Grimório Vazio & Empate',
                desc: 'O limite da mão é de 12 cartas (compras excedentes queimam direto para a Cripta; efeitos de devolver inimigo à mão enviam à Cripta se o rival tiver 10+ cartas). Grimório vazio não mata na hora: cada tentativa de compra causa -2 PV de Fadiga! Em Colapso Mútuo simultâneo (ambos <= 0 PV), o jogador prevalece.',
              },
            ].map((card, idx) => (
              <div
                key={idx}
                style={{
                  padding: '0.95rem 1.05rem',
                  borderRadius: '10px',
                  background: '#0b101c',
                  border: '1px solid rgba(212, 175, 55, 0.28)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                }}
              >
                <div style={{ fontSize: '0.63rem', fontWeight: 800, color: '#d4af37', letterSpacing: '0.08em' }}>
                  {card.tag}
                </div>
                <div className="font-cinzel" style={{ fontSize: '0.91rem', fontWeight: 700, color: '#f8fafc' }}>
                  {card.title}
                </div>
                <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.52, margin: 0 }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          SECTION 1.5: DECKBUILDING GUIDE (COLORS, COMBINATIONS, STRATEGIES & TACTICS)
         ===================================================================== */}
      {activeSection === 'deckbuilding' && (
        <div className="tg-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
          <div>
            <div className="aaa-kicker">ARQUITETURA DE 100 CARTAS • CORES, ALIANÇAS, ESTRATÉGIAS & TÁTICAS</div>
            <h2 className="font-cinzel gold-gradient-text" style={{ fontSize: '1.35rem', marginBottom: '0.35rem' }}>
              Guia Mestre de Construção de Grimórios
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
              Todo Grimório de Combate contém exatamente <strong>100 cartas</strong> (até <strong>3× Comum/Incomum</strong>, <strong>2× Rara</strong> e <strong>1× Lendária</strong>, com teto de <strong>10 Lendárias</strong>). O seu <strong>1º Grimório é 100% gratuito</strong>; a partir da 2ª vez, você pode trocar cartas da sua coleção livremente ou pagar <strong>100 de Ouro</strong> na Forja para editar/reconstruir todo o seu Grimório com qualquer carta do catálogo.
            </p>
          </div>

          {/* BLOCO 1: PROPORÇÕES E CURVA DE ESSÊNCIA */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(235px, 1fr))',
              gap: '0.85rem',
            }}
          >
            {[
              {
                badge: '55 A 68 CARTAS',
                title: '⚔️ Criaturas (Vanguarda vs. Retaguarda)',
                color: '#f87171',
                desc: 'Inclua pelo menos 35–42 criaturas de Vanguarda (Guardiões e combatentes corpo a corpo) para proteger suas 6 colunas contra Invasão, e 20–26 criaturas de Retaguarda (Alcance, Voo e suporte).',
              },
              {
                badge: '14 A 22 CARTAS',
                title: '✨ Feitiços de Impacto & Remoção',
                color: '#60a5fa',
                desc: 'Combine remoções diretas (para eliminar Campeões e alvos atrás de Guardiões), limpezas em área (contra pilhas 3×) e cartas de compra/aceleração de Essência.',
              },
              {
                badge: '6 A 12 CARTAS',
                title: '🪤 Reações & Emboscadas Ocultas',
                color: '#c084fc',
                desc: 'Instaladas gratuitamente na Retaguarda ou disparadas da mão. Punem ataques inimigos, anulam golpes letais ao Soberano ou congelam o agressor antes do dano.',
              },
              {
                badge: '6 A 12 CARTAS',
                title: '🏛️ Relíquias Contínuas & Curva (3.2–4.1⚡)',
                color: '#facc15',
                desc: 'Relíquias geram vantagem todo turno na Retaguarda. Mantenha 30+ cartas de custo 1–3⚡ para nunca perder os turnos iniciais e canalize [C] cartas de custo 6–8⚡ nos turnos 1 a 3.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '0.95rem 1.05rem',
                  borderRadius: '10px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: `1px solid ${item.color}44`,
                }}
              >
                <div style={{ fontSize: '0.64rem', fontWeight: 800, color: item.color, letterSpacing: '0.08em' }}>
                  {item.badge}
                </div>
                <div className="font-cinzel" style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc', margin: '0.28rem 0 0.4rem' }}>
                  {item.title}
                </div>
                <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* BLOCO 2: DICAS POR COR INDIVIDUAL (MONOCROMÁTICOS + NEUTRO) */}
          <div>
            <div className="aaa-kicker" style={{ marginBottom: '0.55rem' }}>
              IDENTIDADE TÁTICA POR COR (GRIMÓRIOS MONOCROMÁTICOS & BASE NEUTRA)
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
                gap: '0.85rem',
              }}
            >
              {[
                {
                  dom: 'red' as Domain,
                  role: 'Ofensiva Explosiva, Ímpeto & Sopro Dracônico',
                  strategy:
                    'Pressione desde o Turno 1 com unidades de Ímpeto e ocupe colunas vazias para ganhar +1 ATQ de Invasão. Finalize com Dragões de Sopro e feitiços de dano direto ao Soberano.',
                  keyCards: 'Priorize criaturas de custo 1–3 com Ímpeto, Feitiços de Queimadura em fileira e Relíquias de Forja Vulcânica.',
                },
                {
                  dom: 'blue' as Domain,
                  role: 'Cronomancia, Congelamento, Voo & Compra de Cartas',
                  strategy:
                    'Congele a Vanguarda inimiga para travar colunas inteiras enquanto suas criaturas com Voo e Condutores Rúnicos acumulam vantagem de cartas e preparam a Expansão de Domínio.',
                  keyCards: 'Priorize Magos de Congelamento, Feitiços com Gatilho de Magia (spell_cast), Tomos de Compra e Emboscadas de Stasis.',
                },
                {
                  dom: 'purple' as Domain,
                  role: 'Necromancia, Renascer, Dreno Vital & Corrupção Abissal',
                  strategy:
                    'Transforme a Cripta em recurso com Renascer e reanimações, e acumule 5+ de Corrupção Abissal (via Pacto de Sangue, Dreno Umbroso e cartas de Pacto) para dar +1 ATQ às suas criaturas e +1 de dano às magias (cuidando do teto 10/10).',
                  keyCards: 'Priorize Esqueletos/Lichs com Renascer, Vampiros com Dreno de Vida (+2 PV no Soberano), Remoções Letais e Altares de Reanimação.',
                },
                {
                  dom: 'green' as Domain,
                  role: 'Rampa de Essência, Enxame, Regeneração & Colossos',
                  strategy:
                    'Acelere sua Essência Máxima nos turnos iniciais para invocar feras colossais com Atropelar antes que o oponente consiga montar defesas, ou multiplique fichas e fortaleça toda a matilha.',
                  keyCards: 'Priorize Druidas de Essência (+1⚡), Feras com Atropelar/Regeneração, Licantropos de Ascensão ★ e Buffs Globais.',
                },
                {
                  dom: 'gold' as Domain,
                  role: 'Falange Impenetrável, Escudo Divino, Guardiões & Cura',
                  strategy:
                    'Domine a geometria das colunas: posicione Guardiões com Armadura e Escudo Divino na Vanguarda (+1 Armadura de Falange) protegendo Clérigos, Anjos e Relíquias Solares na Retaguarda.',
                  keyCards: 'Priorize Paladinos Guardiões, Anjos Voadores com Escudo Divino, Relíquias de Cura/Buff Contínuo e Julgamentos Solares.',
                },
                {
                  dom: 'neutral' as Domain,
                  role: 'Coringa Universal (0 Afinidade) & Suporte Multicor',
                  strategy:
                    'Cartas de Aço & Prisma exigem 0 de Afinidade Elemental. Elas entram em qualquer Grimório para corrigir lacunas da sua cor (ex.: dar Guardiões ao Azul/Vermelho ou compra/relíquias ao Verde).',
                  keyCards: 'Priorize Autômatos Guardiões, Relíquias de Geração de Essência (Pedra Filosofal, Graal) e Campeões Pentacromáticos.',
                },
              ].map((c) => (
                <div
                  key={c.dom}
                  style={{
                    padding: '0.95rem 1.05rem',
                    borderRadius: '10px',
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: `1px solid ${DOMAIN_META[c.dom].color}55`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>{DOMAIN_META[c.dom].icon}</span>
                    <span className="font-cinzel" style={{ fontSize: '0.92rem', fontWeight: 800, color: DOMAIN_META[c.dom].color }}>
                      {DOMAIN_META[c.dom].name}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#fde68a', marginBottom: '0.35rem' }}>
                    {c.role}
                  </div>
                  <p style={{ fontSize: '0.79rem', color: '#cbd5e1', lineHeight: 1.48, margin: '0 0 0.4rem' }}>
                    {c.strategy}
                  </p>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8', lineHeight: 1.4 }}>
                    <strong style={{ color: '#e2e8f0' }}>Foco de Construção:</strong> {c.keyCards}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BLOCO 3: COMBINAÇÕES DE CORES (2, 3 E 4-5 CORES) */}
          <div>
            <div className="aaa-kicker" style={{ marginBottom: '0.55rem' }}>
              COMBINAÇÕES DE CORES: ALIANÇAS (2 CORES), TRÍADES (3 CORES) & CONVERGÊNCIA (4–5 CORES)
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
                gap: '0.85rem',
              }}
            >
              <div style={{ padding: '0.95rem 1.05rem', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(56, 189, 248, 0.35)' }}>
                <div style={{ fontSize: '0.66rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.08em' }}>
                  2 CORES • AS 10 ALIANÇAS ELEMENTAIS
                </div>
                <div className="font-cinzel" style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc', margin: '0.28rem 0 0.4rem' }}>
                  Divisão Recomendada: 55–60 Primária / 25–30 Secundária / 10–15 Neutra
                </div>
                <p style={{ fontSize: '0.79rem', color: '#cbd5e1', lineHeight: 1.48, margin: '0 0 0.45rem' }}>
                  Ao ganhar Afinidade na cor principal, seus outros domínios recebem <strong>65% de Afinidade cruzada automática</strong>. Use a 2ª cor para cobrir a fraqueza da 1ª:
                </p>
                <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.76rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                  <li><strong>🔥+⏳ (Pyros/Aether):</strong> Feitiços em cadeia, Congelamento + Queimadura.</li>
                  <li><strong>🔥+💀 (Pyros/Umbra):</strong> Sacrifício agressivo, Fênix e Reanimação.</li>
                  <li><strong>⏳+☀️ (Aether/Solis):</strong> Muralha de Guardiões + Stasis e Compra.</li>
                  <li><strong>🌿+💀 (Sylva/Umbra):</strong> Rampa de Essência + Reciclagem eterna da Cripta.</li>
                  <li><strong>🌿+☀️ (Sylva/Solis):</strong> Enxame fortalecido com Escudo Divino e Cura.</li>
                </ul>
              </div>

              <div style={{ padding: '0.95rem 1.05rem', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(192, 132, 252, 0.35)' }}>
                <div style={{ fontSize: '0.66rem', fontWeight: 800, color: '#c084fc', letterSpacing: '0.08em' }}>
                  3 CORES • AS 10 TRÍADES ELEMENTAIS
                </div>
                <div className="font-cinzel" style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc', margin: '0.28rem 0 0.4rem' }}>
                  Divisão Recomendada: 40 Cor Base / 25 Cor B / 20 Cor C / 15 Neutra
                </div>
                <p style={{ fontSize: '0.79rem', color: '#cbd5e1', lineHeight: 1.48, margin: '0 0 0.45rem' }}>
                  Grimórios de 3 cores desbloqueiam sinergias devastadoras. O segredo tático é <strong>Canalizar [C] 1 carta das cores secundárias nos Turnos 1 a 3</strong>:
                </p>
                <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.76rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                  <li><strong>Regra de Afinidade:</strong> Evite cartas de Afinidade 3+ na 3ª cor (prefira Afinidade 1–2 nas cores de apoio).</li>
                  <li><strong>Tríade Templar (☀️+⏳+🌿):</strong> Rampa Verde + Controle Azul + Guardiões Dourados.</li>
                  <li><strong>Tríade Cataclísmica (🔥+💀+⏳):</strong> Remoção total, compra arcana e reanimação de Dragões.</li>
                </ul>
              </div>

              <div style={{ padding: '0.95rem 1.05rem', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(250, 204, 21, 0.4)' }}>
                <div style={{ fontSize: '0.66rem', fontWeight: 800, color: '#facc15', letterSpacing: '0.08em' }}>
                  4 A 5 CORES • CONVERGÊNCIA PENTACROMÁTICA
                </div>
                <div className="font-cinzel" style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc', margin: '0.28rem 0 0.4rem' }}>
                  Divisão Recomendada: 25–30 Neutras + 14–18 de Cada Domínio Elemental
                </div>
                <p style={{ fontSize: '0.79rem', color: '#cbd5e1', lineHeight: 1.48, margin: '0 0 0.45rem' }}>
                  Baralhos de 4–5 cores apoiam-se em <strong>Criaturas e Relíquias Neutras (0 Afinidade)</strong> para segurar os 3 primeiros turnos enquanto a Afinidade global sobe:
                </p>
                <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.76rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                  <li><strong>Os Cinco Tronos (#166):</strong> Relíquias Supremas que recompensam múltiplos domínios ativos.</li>
                  <li><strong>Valkyra & Tiamat:</strong> Campeãs Lendárias de fim de jogo que escalam com as 5 cores.</li>
                  <li><strong>Canalização Disciplinada:</strong> Canalize [C] todo turno a cor que ainda falta na sua mão.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* BLOCO 4: ESTRATÉGIAS E TÁTICAS COMUNS EM PARTIDA */}
          <div>
            <div className="aaa-kicker" style={{ marginBottom: '0.55rem' }}>
              ESTRATÉGIAS DE ARQUÉTIPO & TÁTICAS COMUNS DE COMBATE
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '0.85rem',
              }}
            >
              {[
                {
                  tag: 'ARQUÉTIPO 1 • AGGRO / INVASÃO',
                  title: '⚡ Pressão de Colunas Vazias',
                  desc: 'Espalhe criaturas rápidas (custo 1–3) em colunas onde a Vanguarda inimiga está vazia para ativar +1 ATQ de Invasão. Ignore trocas demoradas contra tanques e force o rival a gastar Essência apagando incêndios enquanto você finaliza com dano direto.',
                },
                {
                  tag: 'ARQUÉTIPO 2 • MIDRANGE / FALANGE',
                  title: '🛡️ Domínio de Coluna & Trocas 2-por-1',
                  desc: 'Construa colunas completas: 1 Guardião robusto na Vanguarda + 1 Atirador (Alcance/Voo) na Retaguarda (+1 ATQ de Suporte). Use a Movimentação gratuita para recuar unidades feridas para a Retaguarda e colocar um Guardião novo na frente.',
                },
                {
                  tag: 'ARQUÉTIPO 3 • CONTROL / STASIS',
                  title: '⏳ Congelamento, Emboscadas & Limpeza',
                  desc: 'Não tenha pressa: instale Reações (Emboscadas) na Retaguarda e congele as colunas mais fortes do inimigo. Quando o oponente empilhar 2× ou 3× unidades na mesma coluna ou fileira, puna com Feitiços de Área ou Sopro Dracônico.',
                },
                {
                  tag: 'ARQUÉTIPO 4 • MOTOR / COMBO 6/6',
                  title: '👑 Relíquias, Ascensão ★ & Expansão',
                  desc: 'Acumule Relíquias contínuas na Retaguarda e acelere sua Afinidade até 6/6 canalizando [C] todo turno. No turno decisivo, ative a Expansão de Domínio (+1/+1, Ímpeto e Acerto Garantido) ou evolua seus Campeões com Ascensão ★ para vencer em um único ataque.',
                },
              ].map((st, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '0.95rem 1.05rem',
                    borderRadius: '10px',
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: '1px solid rgba(212, 175, 55, 0.28)',
                  }}
                >
                  <div style={{ fontSize: '0.63rem', fontWeight: 800, color: '#d4af37', letterSpacing: '0.08em' }}>
                    {st.tag}
                  </div>
                  <div className="font-cinzel" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', margin: '0.28rem 0 0.4rem' }}>
                    {st.title}
                  </div>
                  <p style={{ fontSize: '0.79rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>{st.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SECTION 2: BOARD 6x4 & FORMATIONS
         ===================================================================== */}
      {activeSection === 'board_stacking' && (
        <div className="tg-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <div className="aaa-kicker">GEOMETRIA DE COMBATE • 6 COLUNAS × 4 FILEIRAS</div>
            <h2 className="font-cinzel gold-gradient-text" style={{ fontSize: '1.35rem', marginBottom: '0.35rem' }}>
              Formações de Coluna & Empilhamento 3x
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
              Cada metade da mesa possui 6 slots de Vanguarda e 6 slots de Retaguarda. Cada slot individual comporta até 3 unidades empilhadas, gerando bônus táticos automáticos conforme a formação.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '0.9rem',
            }}
          >
            {[
              {
                tag: 'FILEIRA FRONTAL [V]',
                title: 'Vanguarda, Invasão & Falange',
                color: '#f87171',
                desc: 'Ataca qualquer coluna inimiga (frente ou trás) e atinge o Soberano rival assim que a própria coluna estiver vazia de terrestres. Ganha +1 ATQ de Invasão quando a Retaguarda oposta da mesma coluna está vazia e +1 de Armadura ao lado (ou empilhada) de um Guardião na Vanguarda.',
              },
              {
                tag: 'FILEIRA DE SUPORTE [R]',
                title: 'Retaguarda, Defesa por Coluna & +1 ATQ',
                color: '#60a5fa',
                desc: 'Abriga Alcance (disparo sem contra-ataque!), Relíquias e Emboscadas, ganhando +1 ATQ de Disparo Apoiado atrás de um aliado na mesma coluna. Lembre-se: na Retaguarda, unidades comuns só protegem o Soberano contra ataques vindos da sua própria coluna!',
              },
              {
                tag: 'CONCENTRAÇÃO (ATÉ 3X)',
                title: 'Quando Empilhar no Mesmo Slot',
                color: '#4ade80',
                desc: 'Contra baralhos de dano focado ou abate individual, posicione 1 Guardião liderando o slot na Vanguarda (protegendo todas as 6 colunas!) com até 2 aliados empilhados ou apoiando na Retaguarda.',
              },
              {
                tag: 'DISPERSÃO & MOVIMENTO (1×/TURNO)',
                title: 'Espalhar Colunas & Alternar Fileira',
                color: '#facc15',
                desc: 'Contra Sopro Elemental, Atropelar ou feitiços de área, espalhe suas tropas em colunas distintas. Use 1 movimentação gratuita por turno entre Vanguarda e Retaguarda para salvar campeões feridos.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  background: '#0b0f17',
                  border: '1px solid rgba(148, 163, 184, 0.18)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                }}
              >
                <div style={{ fontSize: '0.64rem', fontWeight: 800, letterSpacing: '0.08em', color: '#e6c875' }}>
                  {item.tag}
                </div>
                <h3 className="font-cinzel" style={{ color: '#f8fafc', fontSize: '0.95rem', margin: 0 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.55, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          SECTION 3: THE 5 ELEMENTAL DOMAINS
         ===================================================================== */}
      {activeSection === 'domains' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
          }}
        >
          {(
            [
              {
                domain: 'red' as Domain,
                sovereignPower: 'Chama Soberana (2 de Essência): Causa 2 de dano a um inimigo e 1 ao Soberano rival (ou 3 ao Soberano se o campo estiver vazio).',
                domainExpansion:
                  'Caldeira do Sol Carmesim: Suas criaturas ganham +1/+1, Ímpeto e Acerto Garantido direto no Soberano rival.',
                archetype: 'Agressão explosiva, Ímpeto, Fúria Crescente, Dragões de Sopro e dano direto.',
                cardId: 'red_08_dragao_vermelho',
              },
              {
                domain: 'purple' as Domain,
                sovereignPower: 'Dreno Umbroso (2 de Essência): Causa 2 de dano a um alvo, restaura 2 de Vida ao seu Soberano e gera +1 Corrupção.',
                domainExpansion:
                  'Santuário Malevolente das Almas: Suas criaturas ganham +1/+1, Ímpeto e Acerto Garantido direto no Soberano rival.',
                archetype: 'Reanimação da Cripta, Toque Letal, Dreno de Vida, Renascer e Pactos de Sangue.',
                cardId: 'purple_07_lich',
              },
              {
                domain: 'blue' as Domain,
                sovereignPower: 'Pulso Rúnico (2 de Essência): Congela um inimigo causando 2 de dano e concede +1/+1 a um aliado (ou compra 1 carta).',
                domainExpansion:
                  'Vazio Infinito de Cronos: Suas criaturas ganham +1/+1, Ímpeto e Acerto Garantido direto no Soberano rival.',
                archetype: 'Controle glacial, compra de cartas, Voo, Alcance e Reações de contra-ataque.',
                cardId: 'blue_06_dragao_azul',
              },
              {
                domain: 'green' as Domain,
                sovereignPower: 'Rugido Alfa (2 de Essência): Concede +1 ATQ e +2 de Vida ao aliado mais forte (ou restaura 3 de Vida ao Soberano).',
                domainExpansion:
                  'Mar de Árvores Primordial: Suas criaturas ganham +1/+1, Ímpeto e Acerto Garantido direto no Soberano rival.',
                archetype: 'Supremacia de criaturas, Atropelar, Regeneração, aceleração de Afinidade e Ascensões.',
                cardId: 'green_09_hidra',
              },
              {
                domain: 'gold' as Domain,
                sovereignPower: 'Baluarte Imperial (2 de Essência): Concede +1 ARM e +2 de Vida ao aliado mais ferido (ou restaura 3 de Vida ao Soberano).',
                domainExpansion:
                  'Tribunal da Sentença Dourada: Suas criaturas ganham +1/+1, Ímpeto e Acerto Garantido direto no Soberano rival.',
                archetype: 'Guardiões, Escudo Divino, Armadura pesada e Cidadela de Relíquias na Retaguarda.',
                cardId: 'gold_09_serafim_solar',
              },
              {
                domain: 'neutral' as Domain,
                sovereignPower: 'Pulso da Matriz (2 de Essência): Causa 2 de dano a um inimigo (ou ao Soberano rival) e concede +1 ARM e +1 de Vida ao seu maior aliado (ou restaura 2 de Vida ao Soberano).',
                domainExpansion:
                  'Matriz Horológica do Ponto Zero: Grimórios Axiais puros alcançam 6/6 de Afinidade Axial e concedem +1/+1, Ímpeto e Acerto Garantido por 3 rodadas.',
                archetype: 'Constructos de ferro meteórico, Guildas da Cidade Franca, Relíquias universais e coringas de Afinidade para grimórios mistos.',
                cardId: 'neutral_173_general_roda_matriz',
              },
            ] as const
          ).map((d) => {
            const meta = DOMAIN_META[d.domain];
            const card = CARDS_BY_ID[d.cardId];
            return (
              <div
                key={d.domain}
                className="tg-panel"
                style={{
                  border: '1px solid rgba(148, 163, 184, 0.18)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.7rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div>
                      <div style={{ fontSize: '0.65rem', color: '#e6c875', fontWeight: 800, letterSpacing: '0.08em' }}>
                        DOMÍNIO ELEMENTAL
                      </div>
                      <h3 className="font-cinzel" style={{ fontSize: '1.12rem', color: '#ffffff', margin: 0 }}>
                        {meta.name}
                      </h3>
                    </div>
                    {card?.imagePath && (
                      <img
                        src={card.imagePath}
                        alt={card.name}
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '6px',
                          objectFit: 'cover',
                          border: '1px solid rgba(212, 175, 55, 0.35)',
                          cursor: 'pointer',
                        }}
                        onClick={() => card && onInspectCard?.(card)}
                      />
                    )}
                  </div>

                  <p style={{ fontSize: '0.82rem', color: '#cbd5e1', margin: '0 0 0.65rem 0', lineHeight: 1.5 }}>
                    {d.archetype}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div
                    style={{
                      fontSize: '0.78rem',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '6px',
                      background: '#0b0f17',
                      border: '1px solid rgba(148, 163, 184, 0.16)',
                      color: '#e2e8f0',
                      lineHeight: 1.45,
                    }}
                  >
                    <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#e6c875', marginBottom: '0.15rem' }}>
                      PODER DO SOBERANO
                    </div>
                    {d.sovereignPower}
                  </div>

                  <div
                    style={{
                      fontSize: '0.78rem',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '6px',
                      background: '#101520',
                      border: '1px solid rgba(212, 175, 55, 0.25)',
                      color: '#f8fafc',
                      lineHeight: 1.45,
                    }}
                  >
                    <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#e6c875', marginBottom: '0.15rem' }}>
                      EXPANSÃO DE DOMÍNIO (6/6 AFINIDADE • 3 ESSÊNCIA)
                    </div>
                    {d.domainExpansion}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =====================================================================
          SECTION 4: DOMAIN EXPANSION, COUNTERMEASURES, EXHAUSTION & 6 WEATHERS
         ===================================================================== */}
      {activeSection === 'weather_runes' && (
        <div className="tg-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
          <div>
            <div className="aaa-kicker">MECÂNICA SUPREMA DE CAMPO • MARCO 6/6 DE AFINIDADE, QUEBRA & 6 CLIMAS</div>
            <h2 className="font-cinzel gold-gradient-text" style={{ fontSize: '1.35rem', marginBottom: '0.35rem' }}>
              Expansão de Domínio, Contramedidas, Exaustão & Climas de Arena
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
              Ao acumular <strong>6 de Afinidade Elemental</strong> (no seu Domínio Primário, todas as suas cores somam!) e pagar <strong>3 de Essência</strong>, o Soberano manifesta seu santuário por <strong>3 rodadas</strong>. Veja os números exatos de colisão, ruptura, exaustão e os 6 Climas Elementais:
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '0.9rem',
            }}
          >
            {[
              {
                tag: 'ESTADO 01 • EXPANSÃO ATIVA (3 RODADAS)',
                name: '+1/+1, Ímpeto & Acerto Garantido',
                desc: 'Todas as suas criaturas ganham +1/+1 e Ímpeto, e atravessam toda a Vanguarda/Guardiões para atingir diretamente o Soberano rival (ou qualquer unidade escolhida). Atenção: NÃO remove Congelar, 0 ATQ ou condições negativas das cartas!',
              },
              {
                tag: 'ESTADO 02 • SOBREPUJAR vs. CHOQUE 50/50',
                name: 'Disputa de Afinidade (-3 PV no Perdedor)',
                desc: 'Se você expandir contra um Domínio rival tendo Afinidade ESTRITAMENTE MAIOR, estilhaça o Domínio dele na hora e causa 3 de dano ao Soberano rival! Se as Afinidades empatarem (ou a sua for menor), entram em Choque 50/50 anulando ambos os Acertos Garantidos até alguém superar a Afinidade.',
              },
              {
                tag: 'ESTADO 03 • DOMÍNIO SIMPLES (2⚡)',
                name: 'Cúpula Pessoal Anti-Acerto Garantido',
                desc: 'Pague 2 de Essência (1× por turno) para erguer um Domínio Simples por 1 rodada: neutraliza o Acerto Garantido inimigo e volta a exigir que o oponente respeite suas colunas e Guardiões.',
              },
              {
                tag: 'ESTADO 04 • 3 FORMAS DE QUEBRA & EXAUSTÃO',
                name: '10❤️ Sacrifício, 8+ Dano, Roda ☸ & 2 Turnos',
                desc: 'Quebre imediatamente o Domínio rival: (1) pagando 10 PV distribuídos entre suas tropas/Relíquias e seu Soberano (sem matar seu Soberano, mantendo >= 1 PV); (2) causando 8+ de dano ao Soberano rival na mesma rodada; ou (3) com Unidades Quebra-Domínio (☸). Todo Domínio quebrado impõe 2 RODADAS de Exaustão sem poder expandir!',
              },
            ].map((r, idx) => (
              <div
                key={idx}
                style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  background: '#0b0f17',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                }}
              >
                <div style={{ fontSize: '0.64rem', fontWeight: 800, letterSpacing: '0.08em', color: '#e6c875' }}>
                  {r.tag}
                </div>
                <div className="font-cinzel" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                  {r.name}
                </div>
                <p style={{ fontSize: '0.81rem', color: '#cbd5e1', lineHeight: 1.55, margin: 0 }}>
                  {r.desc}
                </p>
              </div>
            ))}
          </div>

          <div>
            <div className="aaa-kicker" style={{ marginBottom: '0.55rem' }}>
              OS 6 CLIMAS ELEMENTAIS DE ARENA (SUB-MAPAS DA CAMPANHA, CERCOS DA CONQUISTA & FENDAS)
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.81rem', lineHeight: 1.5, margin: '0 0 0.75rem 0' }}>
              Nos confrontos geográficos dos 20 sub-mapas da Campanha e nas províncias da Conquista Continental, o terreno ativa <strong>2 rodadas iniciais de Clima Regional</strong> (e na Fenda do Cataclismo Mutante o clima rotaciona toda rodada):
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(255px, 1fr))',
                gap: '0.8rem',
              }}
            >
              {[
                {
                  icon: '🌋',
                  name: 'Tempestade de Cinzas Rubras',
                  tag: 'CLIMA RUBRO (PYROS)',
                  desc: 'Todas as criaturas em campo (de ambos os lados) ganham +1 ATQ. No início do turno, causa 1 de dano de fogo ao Soberano rival.',
                },
                {
                  icon: '❄️',
                  name: 'Nevasca Astral',
                  tag: 'CLIMA SAFIRA (VÓRTEX)',
                  desc: 'No início do turno, reduz -1 ATQ da criatura inimiga de maior ataque e concede +1 de Essência extra na abertura/1º feitiço.',
                },
                {
                  icon: '🌑',
                  name: 'Eclipse Umbral',
                  tag: 'CLIMA ABISSAL (ECLIPSE)',
                  desc: 'No início do turno, drena 1 ponto de Vida do Soberano rival e restaura +1 ponto de Vida no controlador do Eclipse.',
                },
                {
                  icon: '🌿',
                  name: 'Monção da Selva Primordial',
                  tag: 'CLIMA ESMERALDA (VERIDIA)',
                  desc: 'No início do turno, regenera +1 de Vida em todas as criaturas aliadas (+1 de Vida Máxima nas unidades da Vanguarda).',
                },
                {
                  icon: '☀️',
                  name: 'Zênite Solar Imperial',
                  tag: 'CLIMA SOLAR (SOLÁRIA)',
                  desc: 'No início do turno, concede +1 de Armadura a um campeão na Vanguarda e restaura +1 ponto de Vida no Soberano.',
                },
                {
                  icon: '🌀',
                  name: 'Convergência da Fenda Astral',
                  tag: 'CLIMA AXIAL (NEUTRO)',
                  desc: 'Fluxo planar acelerado: concede +1 de Essência extra temporária no início do turno para jogadas de alto impacto.',
                },
              ].map((w, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '0.9rem 1rem',
                    borderRadius: '8px',
                    background: '#0b101c',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                  }}
                >
                  <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#d4af37', letterSpacing: '0.08em' }}>
                    {w.tag}
                  </div>
                  <div className="font-cinzel" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', margin: '0.2rem 0 0.35rem' }}>
                    {w.icon} {w.name}
                  </div>
                  <p style={{ fontSize: '0.79rem', color: '#cbd5e1', lineHeight: 1.48, margin: 0 }}>{w.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SECTION 4.5: ECONOMY, ASTRAL SHARDS, 12 SOVEREIGN RELICS & ALL 7 GAME MODES
         ===================================================================== */}
      {activeSection === 'modes_economy' && (
        <div className="tg-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
          <div>
            <div className="aaa-kicker">ECONOMIA DO SOBERANO • FORJA DE ESTILHAÇOS, 12 RELÍQUIAS DA COROA & OS 7 MODOS</div>
            <h2 className="font-cinzel gold-gradient-text" style={{ fontSize: '1.35rem', marginBottom: '0.35rem' }}>
              Ouro, Estilhaços Astrais (💎), Relíquias da Coroa & Regras de Todos os Modos
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
              Guia completo de todas as moedas, criação direta de cartas, equipamentos da conta e regras específicas de cada modo de jogo em Vaeloria.
            </p>
          </div>

          {/* BLOCO 1: ECONOMIA, FORJA DE ESTILHAÇOS & RELÍQUIAS DA COROA */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '0.9rem',
            }}
          >
            <div
              style={{
                padding: '1rem',
                borderRadius: '10px',
                background: '#0b101c',
                border: '1px solid rgba(212, 175, 55, 0.3)',
              }}
            >
              <div style={{ fontSize: '0.64rem', fontWeight: 800, color: '#d4af37', letterSpacing: '0.08em' }}>
                OURO (🪙) & RELICÁRIO (30🪙)
              </div>
              <h3 className="font-cinzel" style={{ fontSize: '0.94rem', color: '#f8fafc', margin: '0.25rem 0 0.4rem' }}>
                Pacotes, Coleção & Edição por 100🪙
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.52, margin: 0 }}>
                Você inicia com <strong>160🪙</strong> e ganha <strong>+10🪙</strong> por vitória padrão (além de prêmios maiores em Chefes, Conquista, Expedição, Draft, Fendas e Missões Diárias). No <strong>Relicário</strong>, pacotes custam <strong>30🪙</strong> (5 cartas, sendo 1 Rara ou Lendária garantida). Trocar cartas já obtidas no seu Grimório é grátis; reconstruir livremente todo o Grimório Base custa <strong>100🪙</strong>.
              </p>
            </div>

            <div
              style={{
                padding: '1rem',
                borderRadius: '10px',
                background: '#0b101c',
                border: '1px solid rgba(212, 175, 55, 0.3)',
              }}
            >
              <div style={{ fontSize: '0.64rem', fontWeight: 800, color: '#d4af37', letterSpacing: '0.08em' }}>
                ESTILHAÇOS ASTRAIS (💎) • FORJA DIRETA
              </div>
              <h3 className="font-cinzel" style={{ fontSize: '0.94rem', color: '#f8fafc', margin: '0.25rem 0 0.4rem' }}>
                Reciclagem Automática & Custos de Criação
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.52, margin: 0 }}>
                Qualquer cópia excedente além do limite útil de baralho (<strong>3×</strong> Comum/Incomum, <strong>2×</strong> Rara, <strong>1×</strong> Lendária) converte-se automaticamente em Estilhaços: <strong>+5💎 Comum</strong>, <strong>+15💎 Incomum</strong>, <strong>+40💎 Rara</strong> e <strong>+120💎 Lendária</strong>. Na Forja de Grimórios, crie qualquer carta específica por <strong>20💎 (Comum)</strong>, <strong>50💎 (Incomum)</strong>, <strong>140💎 (Rara)</strong> ou <strong>360💎 (Lendária)</strong>!
              </p>
            </div>

            <div
              style={{
                padding: '1rem',
                borderRadius: '10px',
                background: '#0b101c',
                border: '1px solid rgba(212, 175, 55, 0.3)',
              }}
            >
              <div style={{ fontSize: '0.64rem', fontWeight: 800, color: '#d4af37', letterSpacing: '0.08em' }}>
                EQUIPAMENTO DE CONTA • 12 RELÍQUIAS
              </div>
              <h3 className="font-cinzel" style={{ fontSize: '0.94rem', color: '#f8fafc', margin: '0.25rem 0 0.4rem' }}>
                As 12 Relíquias da Coroa Soberana
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.52, margin: 0 }}>
                Diferente das <em>Cartas de Relíquia</em> (jogadas na Retaguarda durante o duelo), a <strong>Relíquia da Coroa Soberana</strong> é equipada <strong>antes da partida</strong> (barra seletora no topo dos modos). Existem <strong>12 Relíquias</strong> desbloqueáveis por vitórias e marcos, concedendo bônus passivos de abertura como <strong>+PV Máximo</strong>, <strong>+1⚡ Essência Inicial</strong>, <strong>+1 Carta Inicial</strong>, <strong>+1 Armadura na Vanguarda</strong>, <strong>+1 Afinidade</strong> ou <strong>Dano de Artilharia</strong> no rival!
              </p>
            </div>
          </div>

          {/* BLOCO 2: REGRAS EXATAS DE TODOS OS 7 MODOS DE JOGO */}
          <div>
            <div className="aaa-kicker" style={{ marginBottom: '0.55rem' }}>
              REGRAS ESPECÍFICAS DOS 7 MODOS DE JOGO
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(295px, 1fr))',
                gap: '0.85rem',
              }}
            >
              {[
                {
                  tag: 'MODO 1 • GRANDE CAMPANHA (21 MAPAS)',
                  title: '🗺️ 190 Confrontos, Zona de Controle & Dominação',
                  desc: '1 Mapa Continental + 20 Sub-Mapas em zoom 100%. Marche passo a passo pelas estradas: inimigos vivos bloqueiam caminhos e portais adiante (Zona de Controle), mas você pode recuar livremente para rotas vencidas ou migrar para outra cor. Vencer desbloqueia as cartas Raras/Lendárias daquele chefe (276 ao todo), ativa Pontos de Interesse no mapa e, em 100% do sub-mapa, converte todo o território à sua cor! (Inclui também a Trilha Clássica de 32 Chefes).',
                },
                {
                  tag: 'MODO 2 • CONQUISTA CONTINENTAL (48 PROVÍNCIAS)',
                  title: '🏰 Suprimentos, 5 Edifícios, Diplomacia & Crises',
                  desc: 'Guerra por Estações entre 6 Facções. Você realiza 1 Cerco ofensivo por estação e responde a Alarmes de Defesa. Mantenha Linhas de Suprimento ligadas à sua Capital! Erga Fortificações (65 Supr.) e 5 Edifícios Provinciais: Forja de Guerra (+1 dano de abertura a cada 2), Mercado Imperial (+18/+25 Supr.), Torre Astral (+3 PV / +1 ARM), Doca de Projeção (ponte aérea a 2 saltos e Voo +1 ATQ) e Santuário de Ley (+1⚡ local). Use Diplomacia (Trégua 75, Pacto Comercial 35, Coalizão 65, Sabotagem 55) e supere Crises Imperiais!',
                },
                {
                  tag: 'MODO 3 • EXPEDIÇÃO ROGUELITE (9 ETAPAS)',
                  title: '🧭 6 Bênçãos Soberanas & Evolução de Baralho',
                  desc: 'Escolha 1 entre 6 Bênçãos Soberanas exclusivas (Coroa da Forja, Sangue Dracônico, Conclave Arcano, Falange Imortal, Juramento da Roda ou Esquadra das Seis Asas), monte um grimório ágil de 40 cartas em 20 rodadas de escolhas e enfrente uma escalada de 9 Chefes da Fenda, coletando saques e Ouro a cada etapa vencida.',
                },
                {
                  tag: 'MODO 4 • CRISOL DOS CINCO SELOS (DRAFT)',
                  title: '⚖️ 40 Cartas Sem Limite de Cópias • 7 Vitórias / 3 Derrotas',
                  desc: 'Seu 1º Passe do Crisol é GRÁTIS (depois 100🪙). Escolha 1 de 3 Domínios sorteados e construa 40 cartas em 20 escolhas (2 cartas por rodada). Regra especial do Crisol: NÃO há limite de cópias 3×/2×/1× (você pode acumular quantas cópias aparecerem!). A jornada vai até 7 Vitórias (Glória Suprema: até 360🪙 + 125💎) ou 3 Derrotas.',
                },
                {
                  tag: 'MODO 5 • FENDAS DA FRATURA (6 MUTADORES)',
                  title: '🌀 Regras Planares Simétricas & Bônus Semanal',
                  desc: 'Duelos especiais onde uma anomalia altera as regras para AMBOS os lados: (1) Torrente Astral (+3⚡ iniciais); (2) Panteão Imortal (Lendárias custam -2⚡ e ganham +1/+1); (3) Trono de Vidro (Soberanos têm 20 PV e toda criatura ganha +2 ATQ e Ímpeto); (4) Noite do Sol Negro (todas as criaturas ganham Renascer); (5) Forja Viva (Relíquias custam -2⚡ e dão +1 ARM à coluna); (6) Cataclismo Mutante (Clima muda a cada rodada). A Fenda em Destaque Semanal paga +45🪙 e +25💎 extras!',
                },
                {
                  tag: 'MODO 6 & 7 • ENIGMAS LETAIS & CONCLAVE 1×1',
                  title: '🧩 Letal em 1 Turno, Arena Rápida & PvP Online',
                  desc: 'Nos Desafios Táticos (Enigmas), você recebe uma mesa e mão fixas e deve descobrir a sequência exata de formação, movimentação e ataques para derrotar o rival em 1 único turno. Na Arena Rápida você testa grimórios contra os 30 arquétipos da IA, e no Conclave Online disputa partidas 1×1 ranqueadas (Fila Rápida ou Sala PACT-XXXX).',
                },
              ].map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '0.95rem 1.05rem',
                    borderRadius: '10px',
                    background: '#0b101c',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                  }}
                >
                  <div style={{ fontSize: '0.63rem', fontWeight: 800, color: '#e6c875', letterSpacing: '0.08em' }}>
                    {m.tag}
                  </div>
                  <div className="font-cinzel" style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc' }}>
                    {m.title}
                  </div>
                  <p style={{ fontSize: '0.79rem', color: '#cbd5e1', lineHeight: 1.52, margin: 0 }}>{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SECTION 5: KEYWORDS ENCYCLOPEDIA
         ===================================================================== */}
      {activeSection === 'keywords' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '0.85rem',
          }}
        >
            {filteredKeywords.map((kw) => {
              const exCard = CARDS_BY_ID[kw.exampleCardId];
              return (
                <div
                  key={kw.name}
                  className="tg-panel"
                  style={{
                    border: '1px solid rgba(148, 163, 184, 0.18)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.65rem',
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.4rem',
                      }}
                    >
                      <div
                        className="font-cinzel"
                        style={{
                          fontSize: '0.96rem',
                          fontWeight: 700,
                          color: '#f8fafc',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                        }}
                      >
                        <span>{kw.icon}</span>
                        <span>{kw.name}</span>
                      </div>
                      <span
                        style={{
                          fontSize: '0.64rem',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: '#111622',
                          border: '1px solid rgba(148, 163, 184, 0.22)',
                          color: '#cbd5e1',
                          fontWeight: 700,
                        }}
                      >
                        {kw.category}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.48, margin: '0 0 0.45rem' }}>
                      {kw.description}
                    </p>
                    <div
                      style={{
                        fontSize: '0.74rem',
                        color: '#e5c97b',
                        lineHeight: 1.42,
                        padding: '0.38rem 0.55rem',
                        borderRadius: '6px',
                        background: 'rgba(11, 16, 28, 0.9)',
                        borderLeft: '2px solid rgba(212, 175, 55, 0.5)',
                      }}
                    >
                      <strong style={{ color: '#fde68a' }}>Dica Tática:</strong> {kw.tacticalTip}
                    </div>
                  </div>

                  {exCard && (
                    <div
                      onClick={() => onInspectCard?.(exCard)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.55rem',
                        padding: '0.4rem 0.6rem',
                        borderRadius: '8px',
                        background: 'rgba(15, 23, 42, 0.85)',
                        border: '1px solid rgba(148, 163, 184, 0.16)',
                        cursor: 'pointer',
                      }}
                    >
                      {exCard.imagePath && (
                        <img
                          src={exCard.imagePath}
                          alt={exCard.name}
                          style={{ width: '30px', height: '30px', borderRadius: '5px', objectFit: 'cover' }}
                        />
                      )}
                      <div style={{ flex: 1, fontSize: '0.73rem' }}>
                        <div style={{ color: '#ffffff', fontWeight: 700 }}>{exCard.name}</div>
                        <div style={{ color: '#94a3b8', fontSize: '0.67rem' }}>
                          Custo {exCard.cost} • Inspecionar carta
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}

      {/* =====================================================================
          SECTION 6: INTERFACE, SHORTCUTS & ACCOUNT SYSTEM
         ===================================================================== */}
      {activeSection === 'controls' && (
        <div className="tg-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div>
            <div className="aaa-kicker">CONTROLES DE ARENA & NAVEGAÇÃO</div>
            <h2 className="font-cinzel gold-gradient-text" style={{ fontSize: '1.35rem', marginBottom: '0.35rem' }}>
              Interface, Atalhos Rápidos & Conta do Soberano
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.88rem', margin: 0 }}>
              Referência rápida dos comandos de teclado, barras retráteis da arena e recursos da sua conta:
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '0.85rem',
            }}
          >
            {[
              {
                key: 'Barra Superior ▾',
                title: 'Status do Oponente',
                desc: 'Exibe Vida, Essência, cartas na mão e Cripta do rival. Clique para inspecionar Terrenos Canalizados e Afinidades inimigas.',
              },
              {
                key: 'Barra Inferior ▴',
                title: 'Seu Soberano & Rituais',
                desc: 'Reúne sua Vida, Essência, Poder do Soberano, Pacto de Sangue e o progresso 6/6 para a Expansão de Domínio.',
              },
              {
                key: 'Gaveta MÃO',
                title: 'Mão Auto-Ocultável',
                desc: 'Passe o mouse para revelar suas cartas ou clique no botão MÃO para fixar a gaveta aberta durante o planejamento.',
              },
              {
                key: 'Tecla [C]',
                title: 'Canalizar / Sacrificar',
                desc: 'Canaliza 1 carta por turno (+1 Afinidade e compra 1 carta). Em usos extras no mesmo turno, sacrifica a carta por +1 de Essência temporária.',
              },
              {
                key: '[V] / [R]',
                title: 'Invocação Rápida de Fileira',
                desc: 'Com uma carta selecionada na mão, [V] posiciona na Vanguarda e [R] posiciona na Retaguarda.',
              },
              {
                key: '[ESPAÇO] • ⏱️ 60s',
                title: 'Passar Turno & Relógio de Combate',
                desc: 'Cada jogador possui 60 segundos por turno (com alerta nos últimos 15s). Ao zerar o relógio ou pressionar [ESPAÇO], o turno passa automaticamente.',
              },
              {
                key: 'Perfil Soberano',
                title: 'Avatar Lendário & Senha',
                desc: 'No botão do topo direito, gerencie sua conta: escolha qualquer Criatura/Lendária como Avatar (com Título automático) ou recupere sua senha.',
              },
              {
                key: 'Conclave 1×1',
                title: 'Fila Rápida & Código PACT',
                desc: 'No menu Conclave Online, jogue partidas ranqueadas na Fila Rápida 1×1 ou compartilhe um código PACT-XXXX para duelos diretos.',
              },
              {
                key: 'Forja • 100 Cartas',
                title: 'Grimório Inicial & Troca Livre (−/+)',
                desc: 'Escolha livremente seu 1º Grimório de 100 cartas (3× Comum/Incomum, 2× Rara, 1× Lendária, máx. 10 Lendárias) e alterne cartas da sua reserva quando quiser.',
              },
              {
                key: 'Relicário (30🪙) & 100🪙',
                title: 'Pacotes, Estilhaços (💎) & Editar Base',
                desc: 'Pacotes custam 30 de Ouro (duplicatas excedentes viram Estilhaços Astrais 💎 para criar cartas exatas: 20/50/140/360💎). Por 100 de Ouro, edite ou substitua todo o Grimório Base.',
              },
              {
                key: 'Oráculo • 62 Combos',
                title: 'Compêndio de Combos (1 a 5 Cores)',
                desc: 'No Oráculo de Guerra, consulte os 62 combos táticos (Monocromáticos, Alianças, Tríades e Pentacromáticos) e filtre os que já estão no seu Grimório.',
              },
            ].map((sc, i) => (
              <div
                key={i}
                style={{
                  padding: '0.95rem',
                  borderRadius: '10px',
                  background: 'rgba(15, 23, 42, 0.84)',
                  border: '1px solid rgba(212, 175, 55, 0.22)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.4rem' }}>
                  <kbd
                    style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: 'rgba(212, 175, 55, 0.16)',
                      border: '1px solid rgba(250, 204, 21, 0.5)',
                      color: '#fde047',
                      fontWeight: 800,
                      fontSize: '0.74rem',
                    }}
                  >
                    {sc.key}
                  </kbd>
                  <span className="font-cinzel" style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.88rem' }}>
                    {sc.title}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>{sc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div
          className="modal-panel"
          style={{ maxWidth: '1140px', width: '95vw', maxHeight: '90vh', overflowY: 'auto' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-sticky-close-bar">
            <span className="font-cinzel gold-gradient-text" style={{ fontSize: '0.78rem', fontWeight: 800 }}>
              🎓 CÓDICE DE REGRAS & TUTORIAL
            </span>
            <button type="button" className="btn-fantasy btn-fantasy-danger" onClick={onClose}>
              ✕ Fechar Tutorial
            </button>
          </div>
          {innerContent}
        </div>
      </div>
    );
  }

  return innerContent;
};
