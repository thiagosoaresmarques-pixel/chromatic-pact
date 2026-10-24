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
  | 'domains'
  | 'weather_runes'
  | 'keywords'
  | 'board_stacking'
  | 'controls';

interface WalkthroughStep {
  stepNumber: number;
  badge: string;
  title: string;
  subtitle: string;
  cardId: string;
  summary: string;
  keyPoints: { icon: string; title: string; detail: string }[];
  proTip: string;
}

const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    stepNumber: 1,
    badge: 'FUNDAMENTOS DA PARTIDA',
    title: '1. Os Soberanos, 40❤️ de Vida, 3⚡ Inicial & 7 Cartas',
    subtitle: 'Cada jogador joga no seu turno: reduza a Vida do Soberano rival de 40❤️ a 0 ou esgote o grimório inimigo.',
    cardId: 'neutral_10_valkyra_pentacromatica',
    summary:
      'Em Chromatic Pact, a partida acontece em turnos alternados (cada jogador executa todas as suas ações no seu próprio turno). Cada Soberano inicia com 40 pontos de Vida (❤️), 3 de Essência Máxima (3⚡) e 7 cartas na mão, com direito a um Mulligan inicial para trocar cartas pesadas antes do Turno 1.',
    keyPoints: [
      {
        icon: '🔥',
        title: 'Poder do Soberano (🔥 2⚡ • 1x por Turno)',
        detail:
          'Na barra inferior do seu Soberano há o chip de ritual "🔥 2⚡". Seu efeito depende do Domínio principal do seu grimório: Chama Soberana (2🔥 a um inimigo e 1🔥 ao Soberano rival, ou 3🔥 ao Soberano se o campo estiver vazio), Pulso Rúnico (congela um inimigo causando 2❄️ e concede +1⚔️/+1❤️ a um aliado, ou compra 1 carta), Dreno Umbroso (causa 2💀, cura +2❤️ e gera +1 Corrupção), Rugido Alfa (+1⚔️/+2❤️ ao aliado mais forte ou cura +3❤️) ou Baluarte Imperial (+1🛡️/+2❤️ ao aliado mais ferido ou cura +3❤️).',
      },
      {
        icon: '🩸',
        title: 'Pacto de Sangue (🩸 +1⚡ • Custa 3❤️)',
        detail:
          'Precisa de 1 ponto extra de Essência para fechar uma jogada decisiva? Uma vez por turno, clique no chip "🩸 +1⚡" na barra inferior para pagar 3❤️ de Vida (+1 Corrupção) e ganhar +1⚡ de Essência temporária imediata.',
      },
      {
        icon: '🔄',
        title: 'Mulligan Tático na Mão Inicial (7 Cartas)',
        detail:
          'Antes do início do duelo, selecione quaisquer cartas de custo alto (5⚡+) da sua mão inicial de 7 cartas para devolvê-las ao grimório e comprar substitutas de curva baixa (1⚡ a 3⚡).',
      },
    ],
    proTip:
      'Dica de Mestre: Nunca encerre seu turno deixando 2⚡ sobrando sem antes ativar o Poder do Soberano (🔥 2⚡)!',
  },
  {
    stepNumber: 2,
    badge: 'ECONOMIA ELEMENTAL & AFINIDADE',
    title: '2. Progressão Automática (+1⚡/Turno), Canalizar ([C]) & Sacrificar',
    subtitle: 'Sua Essência Máxima cresce automaticamente a cada turno (+1⚡ até 10⚡) e cartas da mão geram Afinidade, Compra ou Mana Extra.',
    cardId: 'blue_36_tomo_infinito',
    summary:
      'Não existem cartas de terreno que travam o seu baralho. Você inicia com 3⚡ de Essência Máxima e, no início de cada turno, sua Essência Máxima aumenta automaticamente em +1⚡ (até 10⚡), toda a sua Essência é recarregada, sua Afinidade cresce +1 e você compra 1 carta. Além disso, você usa cartas da mão para acelerar sua Afinidade ou obter Essência extra imediata!',
    keyPoints: [
      {
        icon: '⚡',
        title: 'Canalizar 1 Carta por Turno (Tecla [C])',
        detail:
          'Uma vez por turno, selecione uma carta da mão e pressione [C] (ou clique em Canalizar). A carta vai para seus Terrenos Canalizados, você ganha +1 de Afinidade Elemental da cor da carta e compra +1 carta substituta imediatamente (reciclando cartas pesadas sem perder tamanho de mão)!',
      },
      {
        icon: '🔥',
        title: 'Sacrificar / Queimar Cartas Extras ([C])',
        detail:
          'Precisa de mais Essência ou Afinidade agora mesmo para descer um campeão no mesmo turno? Você pode Sacrificar/Queimar ([C]) cartas da mão para a Cripta em troca de +1⚡ de Essência temporária neste turno e +1 de Afinidade Elemental (sem comprar carta substituta).',
      },
      {
        icon: '⛩️',
        title: 'Para que serve a Afinidade Elemental?',
        detail:
          'A Afinidade Elemental acumulada serve para dois propósitos diretos: 1) Destravar cartas poderosas que exigem afinidade daquela cor; e 2) Invocar a suprema Expansão de Domínio ("⛩️ 6/6", custo 3⚡) ao atingir 6 de Afinidade!',
      },
    ],
    proTip:
      'Doutrina dos Turnos 1 a 3: Canalize 1 carta pesada ou situacional por turno para acumular Afinidade rumo ao 6/6 enquanto cicla sua mão gratuitamente em busca das melhores respostas!',
  },
  {
    stepNumber: 3,
    badge: 'MESA DE GUERRA 6×4 & EMPILHAMENTO 3x',
    title: '3. Vanguarda [V], Retaguarda [R] & Pilhas de até 3 Unidades',
    subtitle: 'O campo de batalha na mesa de madeira possui 6 colunas × 4 fileiras, suportando até 3 unidades por slot.',
    cardId: 'gold_07_dragao_ouro',
    summary:
      'A arena é uma mesa de guerra de madeira em tela cheia dividida em 6 colunas e 4 fileiras (Vanguarda e Retaguarda para cada Soberano). Cada slot individual comporta até 3 unidades empilhadas, criando formações táticas profundas.',
    keyPoints: [
      {
        icon: '⚔️',
        title: 'Vanguarda [V], Invasão (+1⚔️ ATQ) & Falange (+1🛡️ ARM)',
        detail:
          'A Vanguarda é sua linha de frente: unidades nela protegem a Retaguarda da mesma coluna e o seu Soberano contra ataques terrestres. Quando a Vanguarda inimiga oposta está vazia, suas unidades na Vanguarda ganham +1⚔️ ATQ de Invasão! Além disso, unidades na Vanguarda ao lado ou empilhadas com um Guardião ganham +1🛡️ Armadura de Falange de Escudos!',
      },
      {
        icon: '🏹',
        title: 'Retaguarda [R] & Cobertura de Coluna (+1⚔️ ATQ)',
        detail:
          'A Retaguarda abriga atiradores (Alcance), voadores, Relíquias Contínuas e Emboscadas/Reações. Enquanto houver um aliado na Vanguarda da mesma coluna, as unidades na Retaguarda ficam protegidas de ataques terrestres e ganham +1⚔️ ATQ de Cobertura!',
      },
      {
        icon: '📐',
        title: 'Empilhamento 3x por Slot vs. Ataques de Área',
        detail:
          'Você pode empilhar até 3 unidades no mesmo slot para concentrar poder atrás de um Guardião. Porém, Sopro, Atropelar e magias de área atingem TODAS as 3 unidades empilhadas no mesmo slot simultaneamente! Espalhe 1x por coluna contra dragões e empilhe 3x contra decks de alvo único.',
      },
    ],
    proTip:
      'Movimentação Tática (⇄): No seu turno, você pode mover unidades entre Vanguarda e Retaguarda na mesma coluna para proteger aliados feridos ou assumir a linha de frente.',
  },
  {
    stepNumber: 4,
    badge: 'INVOCAÇÕES LIVRES, RITUAIS & EVOLUÇÃO',
    title: '4. Os 4 Tipos de Cartas, Emboscadas & Ascensão de Criatura (★)',
    subtitle: 'Invoque Criaturas, instale Relíquias, arme Emboscadas/Reações, lance Feitiços e Ascenda campeões.',
    cardId: 'green_40_licantropo_alfa',
    summary:
      'Durante o seu turno, você tem liberdade total para combinar invocações, magias e rituais na ordem que preferir, adaptando sua estratégia em tempo real ao tabuleiro visível.',
    keyPoints: [
      {
        icon: '🛡️',
        title: 'Criaturas ([V] / [R]) & Relíquias Contínuas ([R])',
        detail:
          'Criaturas podem ser invocadas na Vanguarda [V] ou Retaguarda [R] (até 3 por slot). Relíquias são artefatos posicionados na Retaguarda [R] que permanecem em campo gerando efeitos contínuos a cada turno.',
      },
      {
        icon: '🪤',
        title: 'Feitiços Imediatos & Emboscadas / Reações ([R])',
        detail:
          'Feitiços resolvem seu efeito imediatamente ao serem lançados. Já as cartas de Reação podem ser lançadas na hora OU armadas na Retaguarda [R] como Emboscadas para dispararem automaticamente quando o oponente atacar no turno dele!',
      },
      {
        icon: '★',
        title: 'Ascensão de Criatura (Botão ★ Ascender)',
        detail:
          'Criaturas com a insígnia ★ possuem uma forma evoluída. No seu turno, tendo Essência suficiente, clique em "★ Ascender" sobre a criatura em campo para transformá-la permanentemente em sua forma suprema com atributos e habilidades ampliados!',
      },
    ],
    proTip:
      'Se uma criatura com Ascensão já estiver pronta para atacar, avalie se vale mais a pena Ascender antes do golpe (para causar mais dano) ou após limpar um bloqueador menor!',
  },
  {
    stepNumber: 5,
    badge: 'FLUXO DE TURNO & COMBATE IMEDIATO',
    title: '5. Como Funciona o Seu Turno & Combate Imediato (⚔️ ATACAR)',
    subtitle: 'Ataque em tempo real clicando nas suas unidades prontas ou usando o botão de ataque rápido na barra inferior.',
    cardId: 'gold_59_cavaleiro_grifo',
    summary:
      'Não há fases ocultas ou espera simultânea: quando é a sua vez, você controla 100% da ação e resolve seus ataques imediatamente contra os alvos inimigos válidos.',
    keyPoints: [
      {
        icon: '⚡',
        title: 'Prontidão de Combate & Palavra-Chave Ímpeto',
        detail:
          'Criaturas recém-invocadas entram em preparação (enjoo de invocação) e ficam prontas para atacar a partir do seu próximo turno — exceto criaturas com ⚡ Ímpeto, que podem atacar imediatamente no mesmo turno em que entram em campo!',
      },
      {
        icon: '🎯',
        title: 'Alvos Válidos & Botão "⚔️ ATACAR"',
        detail:
          'Para atacar manualmente, clique em qualquer criatura sua pronta e clique em um alvo inimigo válido ou no Soberano rival (você também pode clicar em "⚔️ ATACAR" na barra inferior para executar ataques automáticos com todas as criaturas prontas).',
      },
      {
        icon: '⏭️',
        title: 'Encerrando a Vez: "⏭️ PASSAR TURNO [ESPAÇO]"',
        detail:
          'Após canalizar [C], invocar suas cartas, ativar rituais e realizar todos os ataques desejados, clique em "⏭️ PASSAR TURNO" na barra inferior (ou pressione [ESPAÇO]) para passar o turno ao oponente.',
      },
    ],
    proTip:
      'Inimigos com 🛡️ Guardião protegem sua coluna e forçam ataques terrestres. Use criaturas com 🪽 Voo, 🏹 Alcance ou feitiços para eliminar alvos na Retaguarda inimiga ignorando a linha de frente!',
  },
  {
    stepNumber: 6,
    badge: 'CONSTRUÇÃO DE GRIMÓRIOS (3× / 2× / 1×) & ASSIMETRIA',
    title: '6. Regras dos 30 Grimórios (100 Cartas • 3× / 2× / 1× por Raridade)',
    subtitle: 'Estrutura competitiva de TCG real: até 3× Comum/Incomum, até 2× Rara e 1× Lendária (máx. 10 Lendas).',
    cardId: 'blue_06_dragao_azul',
    summary:
      'Os 30 Grimórios oficiais de 100 cartas seguem regras reais de TCG competitivo, combinando cópias múltiplas (3×, 2× e 1×) para garantir consistência tática nas compras, além de preservar a assimetria estrutural entre os 5 Domínios na faixa de equilíbrio 55/45.',
    keyPoints: [
      {
        icon: '🃏',
        title: 'Limite de Cópias Escalonado por Raridade (3× / 2× / 1×)',
        detail:
          'Todo Grimório de 100 cartas obedece à pirâmide oficial de raridades: Cartas Comuns e Incomuns permitem até 3× cópias (a espinha dorsal do deck); Cartas Raras permitem até 2× cópias; e Cartas Lendárias são Únicas (1× cópia por Grimório, com teto máximo de 10 Lendárias no baralho).',
      },
      {
        icon: '📐',
        title: 'Assimetria Tática por Domínio e Arquétipo (100 Cartas)',
        detail:
          '🌿 Verde joga com avalanche de criaturas (80 criaturas / 80%, focado em blocos de 3×); ❄️ Azul domina com magias e reações (48 magias/reações); ☀️ Dourado ergue fortalezas com 25 Relíquias Contínuas; 🔥 Vermelho combina agressão de Ímpeto e queima piromântica; 💀 Roxo controla a Cripta com Dreno de Vida e Renascer.',
      },
      {
        icon: '🔗',
        title: 'Customização na Forja de Grimórios (890 Cartas no Acervo)',
        detail:
          'Como cada Grimório Oficial usa entre 44 e 50 cartas distintas (somando 100 cartas com as cópias 3×/2×/1×), restam mais de 840 cartas no acervo para você carregar qualquer modelo oficial na Forja de Grimórios e criar suas próprias variações!',
      },
    ],
    proTip:
      'Ao canalizar Éter ([C]) nos primeiros turnos, dê preferência a cópias extras de cartas de custo médio/alto que você tem 2× ou 3× no grimório — assim você gera mana e Afinidade sabendo que ainda restam cópias no baralho!',
  },
  {
    stepNumber: 7,
    badge: 'EXPANSÃO DE DOMÍNIO & TRANSFORMAÇÃO DA MESA',
    title: '7. Expansão de Domínio (⛩️ 6/6 Afinidade e 3⚡)',
    subtitle: 'Transforme toda a mesa de madeira na forma visual e prática do seu Domínio por 3 rodadas!',
    cardId: 'purple_65_principe_mortos',
    summary:
      'O campo de batalha padrão é a mesa de guerra de madeira em tela cheia. Quando qualquer Soberano atinge 6+ de Afinidade (⛩️ 6/6) e paga 3⚡ no botão da barra inferior, toda a mesa de madeira se transforma visual e praticamente no ambiente daquele Domínio por 3 rodadas!',
    keyPoints: [
      {
        icon: '⛩️',
        title: 'Potencial 120% & Acerto Garantido no Soberano Rival',
        detail:
          'Durante as 3 rodadas da Expansão de Domínio, suas unidades daquele Domínio lutam com Potencial 120% e o Acerto Garantido permite que seus atacantes prontos atinjam diretamente o Soberano adversário ignorando bloqueadores comuns, além de disparar um pulso elemental a cada rodada!',
      },
      {
        icon: '🌍',
        title: 'As 5 Transformações Visuais e Práticas da Mesa de Madeira',
        detail:
          '🔥 Vermelho (Caldeira do Sol Carmesim): mesa carbonizada rachada por rios de lava derretida (+2⚔️ ATQ e 2🔥 queima/rodada); 💀 Roxo (Santuário Malevolente das Almas): cemitério gótico e névoa necrótica (+2⚔️ ATQ, Dreno de Vida e drena 2❤️/rodada); ❄️ Azul (Vazio Infinito de Cronos): santuário glacial e tempestade astral (+1⚔️/+1🛡️, congela 1 inimigo e compra +1 carta); 🌿 Verde (Mar de Árvores Primordial): solo de floresta viva (+2⚔️/+1🛡️, Atropelar e regenera +2❤️); ☀️ Dourado (Tribunal da Sentença Dourada): santuário imperial de ouro derretido (+1⚔️/+2🛡️, Escudo Divino no maior aliado e -2⚔️ no maior inimigo).',
      },
      {
        icon: '💥',
        title: 'Choque 50/50, Domínio Simples (2⚡) & Estilhaçamento',
        detail:
          'Quando dois Domínios colidem simultaneamente, a mesa se divide 50/50 com uma Linha de Falha Central faiscando no meio, neutralizando o Acerto Garantido! Você também pode erguer um Domínio Simples (2⚡) para anular o Acerto Garantido por 1 rodada, ou quebrar o Domínio rival causando 8+ de dano ao Soberano na mesma rodada ou pagando 10❤️ de Sacrifício Distribuído — estilhaçando o Domínio em 8 fragmentos poligonais 3D!',
      },
    ],
    proTip:
      'Acompanhe o marcador "⛩️ X/6" diretamente na sua barra inferior. Assim que atingir 6/6 de Afinidade e tiver 3⚡, invoque sua Expansão de Domínio para dominar a mesa!',
  },
  {
    stepNumber: 8,
    badge: 'INTERFACE FULLSCREEN & BARRAS SIMÉTRICAS',
    title: '8. Barras Simétricas (Topo ▾ / Base ▴) & Mão Auto-Ocultável',
    subtitle: 'Visão limpa em tela cheia da mesa 6×4 com gavetas inteligentes sob demanda.',
    cardId: 'red_08_dragao_vermelho',
    summary:
      'A interface da arena foi projetada sem barras laterais fixas para destacar 100% da mesa de madeira 6×4 e das artes das cartas, concentrando todas as informações em duas barras simétricas no topo e na base.',
    keyPoints: [
      {
        icon: '▾',
        title: 'Barra Superior (Soberano Oponente) & Gaveta de Inspeção (▾)',
        detail:
          'Pílula centralizada compacta no topo mostrando Vida (❤️), Essência (⚡), cartas na Mão, Grimório/Cripta e temporizador de Domínio ativo do oponente. Passe o mouse ou clique em "▾" para abrir os Terrenos Canalizados, Afinidades, botão da Cripta e status de Domínio do rival.',
      },
      {
        icon: '▴',
        title: 'Barra Inferior (Seu Soberano) & Gaveta de Status (▴)',
        detail:
          'Barra centralizada na base com sua Vida (❤️), Essência (⚡), Grimório/Cripta e chips de Rituais ("🔥 2⚡", "🩸 +1⚡", "⛩️ X/6"). Passe o mouse sobre seu nome/status ou clique em "▴" para abrir seus Terrenos Canalizados, Afinidades, Cripta e progresso para a Expansão de Domínio (6+ Afinidade).',
      },
      {
        icon: '🃏',
        title: 'Botão "🃏 MÃO", "⚔️ ATACAR", "⏭️ PASSAR TURNO" & "⚙️"',
        detail:
          'Passe o mouse sobre "🃏 MÃO" para revelar suas cartas instantaneamente ou clique para fixar a gaveta da mão aberta! Ao lado ficam os botões de ação rápida "⚔️ ATACAR", "⏭️ PASSAR TURNO [ESPAÇO]" e o menu "⚙️".',
      },
    ],
    proTip:
      'Manter a mão em modo auto-ocultável permite enxergar todas as 4 fileiras da mesa sem sobreposição, abrindo suas cartas apenas no momento de escolher sua próxima jogada!',
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
      'Prontidão imediata: ignora o enjoo de invocação e permite que a criatura ataque no mesmo turno em que entra no campo de batalha!',
    tacticalTip:
      'Excelente para surpreender o oponente abatendo uma ameaça recém-posicionada ou finalizando o Soberano rival de surpresa.',
    exampleCardId: 'red_04_meio_dragao',
  },
  {
    icon: '🛡️',
    name: 'Guardião',
    category: 'Defensiva',
    color: '#facc15',
    description:
      'Trava a coluna e protege aliados: inimigos terrestres são obrigados a atacar unidades com Guardião antes de poderem alvejar outras unidades da coluna ou o Soberano. Além disso, concede +1🛡️ Armadura (Falange) a aliados adjacentes na Vanguarda!',
    tacticalTip:
      'Coloque um Guardião liderando uma pilha 3x na Vanguarda para blindar 2 atacantes ou proteger Relíquias na Retaguarda atrás dele.',
    exampleCardId: 'gold_04_armadura_conjurada',
  },
  {
    icon: '🪽',
    name: 'Voo',
    category: 'Mobilidade',
    color: '#38bdf8',
    description:
      'Superioridade aérea: pode atacar qualquer alvo (incluindo unidades na Retaguarda inimiga ou diretamente o Soberano rival) ignorando bloqueadores terrestres sem Voo ou Alcance.',
    tacticalTip:
      'Ideal para destruir Relíquias e atiradores inimigos escondidos atrás de muralhas de Guardiões.',
    exampleCardId: 'red_06_efreeti',
  },
  {
    icon: '🏹',
    name: 'Alcance',
    category: 'Mobilidade',
    color: '#60a5fa',
    description:
      'Disparo à distância: pode atacar normalmente mesmo posicionado na Retaguarda, não sofre dano de contra-ataque ao disparar da Retaguarda e pode bloquear/alvejar unidades com Voo.',
    tacticalTip:
      'Mantenha unidades com Alcance na Retaguarda atrás de um aliado na Vanguarda para ganhar +1⚔️ ATQ de Cobertura de Coluna e atacar sem sofrer revide!',
    exampleCardId: 'green_02_aranha_gigante',
  },
  {
    icon: '✨',
    name: 'Escudo Divino',
    category: 'Defensiva',
    color: '#fde047',
    description:
      'Barreira sagrada impenetrável: anula completamente a primeira instância de dano (qualquer valor, inclusive Sopro ou Toque Letal) que a unidade sofreria.',
    tacticalTip:
      'Use um golpe leve de 1 de dano ou feitiço rápido para remover o Escudo Divino inimigo antes de desferir seu ataque pesado.',
    exampleCardId: 'gold_09_serafim_solar',
  },
  {
    icon: '☠️',
    name: 'Toque Letal',
    category: 'Ofensiva',
    color: '#a855f7',
    description:
      'Veneno absoluto: qualquer quantidade de dano de combate que esta unidade causar a uma criatura (desde que não seja absorvida por Escudo Divino) destrói o alvo instantaneamente.',
    tacticalTip:
      'O melhor antídoto de baixo custo para abater Titãs e colossos de custo 7+ com muita Vida.',
    exampleCardId: 'purple_02_sombra',
  },
  {
    icon: '🩸',
    name: 'Dreno de Vida',
    category: 'Especial',
    color: '#c084fc',
    description:
      'Sifão vampírico: sempre que esta unidade causa dano em combate, ela restaura +2❤️ de Vida ao seu Soberano.',
    tacticalTip:
      'Atacar com múltiplas unidades com Dreno de Vida permite recuperar Vida rapidamente e compensar usos do Pacto de Sangue!',
    exampleCardId: 'purple_19_conde_vampiro',
  },
  {
    icon: '🔥',
    name: 'Fúria Crescente',
    category: 'Ofensiva',
    color: '#fb923c',
    description:
      'Sede de batalha: sempre que esta criatura sobrevive a dano, ela recebe +2⚔️ ATQ permanentemente.',
    tacticalTip:
      'Proteja unidades com Fúria Crescente com curas ou Armadura para que escalem +2⚔️ ATQ a cada troca e dominem a coluna.',
    exampleCardId: 'red_16_orc_saqueador',
  },
  {
    icon: '⚰️',
    name: 'Renascer',
    category: 'Especial',
    color: '#e879f9',
    description:
      'Imortalidade da Cripta: na primeira vez em que esta unidade é destruída, ela retorna imediatamente ao campo de batalha com 1 ponto de Vida (consumindo o Renascer).',
    tacticalTip:
      'Use unidades com Renascer na Vanguarda para exigir dois ataques completos do oponente antes de liberar a coluna.',
    exampleCardId: 'purple_01_esqueleto',
  },
  {
    icon: '🦏',
    name: 'Atropelar',
    category: 'Ofensiva',
    color: '#22c55e',
    description:
      'Força esmagadora: atinge todas as cartas empilhadas no slot defensor e qualquer dano excedente além do necessário para abater o bloqueador passa diretamente para o Soberano inimigo!',
    tacticalTip:
      'Pune severamente oponentes que empilham múltiplas unidades fracas no mesmo slot.',
    exampleCardId: 'green_03_ursogrifo',
  },
  {
    icon: '🌋',
    name: 'Pele Incandescente',
    category: 'Defensiva',
    color: '#fb7185',
    description:
      'Corpo em brasa: sempre que esta criatura sofre um ataque corpo-a-corpo, ela causa +1🔥 de dano de fogo extra de retorno ao atacante.',
    tacticalTip:
      'Excelente na Vanguarda para punir enxames de criaturas de baixa vida que tentarem trocar golpes físicos.',
    exampleCardId: 'red_05_salamandra',
  },
  {
    icon: '🐉',
    name: 'Sopro (Sopro Elemental)',
    category: 'Ofensiva',
    color: '#f97316',
    description:
      'Cataclismo Dracônico: ao atacar, varre a fileira inimiga causando dano elemental a todas as unidades da fileira (atingindo todas as 3 cartas empilhadas em cada slot!).',
    tacticalTip:
      'A resposta definitiva contra enxames e formações empilhadas 3x.',
    exampleCardId: 'red_08_dragao_vermelho',
  },
  {
    icon: '🧱',
    name: 'Armadura (ARM)',
    category: 'Defensiva',
    color: '#cbd5e1',
    description:
      'Redução física permanente: reduz todo dano sofrido de ataques e feitiços pelo valor de Armadura da unidade.',
    tacticalTip:
      'Unidades com Armadura 2+ neutralizam enxames de criaturas pequenas sem perder Vida.',
    exampleCardId: 'gold_05_automato_guardiao',
  },
  {
    icon: '🌿',
    name: 'Regeneração',
    category: 'Defensiva',
    color: '#4ade80',
    description:
      'Vitalidade primordial: no início de cada turno do seu controlador, a criatura restaura automaticamente +2❤️ de Vida perdida.',
    tacticalTip:
      'Faça trocas parciais no seu turno: sua criatura se curará no início do seu próximo turno enquanto o inimigo permanece ferido.',
    exampleCardId: 'green_07_troll',
  },
  {
    icon: '❄️',
    name: 'Congelar',
    category: 'Especial',
    color: '#38bdf8',
    description:
      'Estase glacial: uma unidade Congelada fica impedida de atacar e de se mover entre fileiras até descongelar após o próximo turno do seu controlador.',
    tacticalTip:
      'Congele o maior colosso inimigo para neutralizar seu ataque no turno dele e abrir espaço para sua ofensiva.',
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

  const innerContent = (
    <div className={isModal ? 'tg-modal-inner' : 'aaa-page-shell'}>
      {/* HEADER */}
      <header className="aaa-page-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="aaa-kicker">
            CÓDICE OFICIAL ATUALIZADO • 890 CARTAS • 30 GRIMÓRIOS DE 100 CARTAS • MESA 6×4 & EXPANSÃO DE DOMÍNIO (⛩️)
          </div>
          <h1 className="aaa-page-title font-cinzel">
            🎓 Tutorial Interativo & Enciclopédia de Regras
          </h1>
        </div>

        <div className="aaa-header-actions" style={{ flexWrap: 'wrap', gap: '0.55rem' }}>
          <button
            type="button"
            className={`btn-fantasy ${activeSection === 'walkthrough' ? 'btn-fantasy-primary' : ''}`}
            onClick={() => setActiveSection('walkthrough')}
          >
            🎓 Passo a Passo ({WALKTHROUGH_STEPS.length} Lições)
          </button>
          <button
            type="button"
            className={`btn-fantasy ${activeSection === 'board_stacking' ? 'btn-fantasy-primary' : ''}`}
            onClick={() => setActiveSection('board_stacking')}
          >
            📐 Mesa 6×4 & Pilhas 3x
          </button>
          <button
            type="button"
            className={`btn-fantasy ${activeSection === 'domains' ? 'btn-fantasy-primary' : ''}`}
            onClick={() => setActiveSection('domains')}
          >
            🔥 5 Domínios & Expansões (⛩️)
          </button>
          <button
            type="button"
            className={`btn-fantasy ${activeSection === 'weather_runes' ? 'btn-fantasy-primary' : ''}`}
            onClick={() => setActiveSection('weather_runes')}
          >
            ⛩️ Santuários & Choque 50/50
          </button>
          <button
            type="button"
            className={`btn-fantasy ${activeSection === 'keywords' ? 'btn-fantasy-primary' : ''}`}
            onClick={() => setActiveSection('keywords')}
          >
            🗡️ Palavras-Chave ({KEYWORD_ENCYCLOPEDIA.length})
          </button>
          <button
            type="button"
            className={`btn-fantasy ${activeSection === 'controls' ? 'btn-fantasy-primary' : ''}`}
            onClick={() => setActiveSection('controls')}
          >
            ⌨️ Barras Simétricas & Atalhos
          </button>
          {isModal && onClose && (
            <button type="button" className="btn-fantasy btn-fantasy-danger" onClick={onClose}>
              ✕ Fechar Tutorial
            </button>
          )}
        </div>
      </header>

      {/* =====================================================================
          SECTION 1: INTERACTIVE STEP-BY-STEP WALKTHROUGH
         ===================================================================== */}
      {activeSection === 'walkthrough' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Step Progress Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(165px, 1fr))',
              gap: '0.6rem',
            }}
          >
            {WALKTHROUGH_STEPS.map((st, idx) => {
              const isCurrent = idx === activeStepIndex;
              return (
                <button
                  key={st.stepNumber}
                  type="button"
                  onClick={() => setActiveStepIndex(idx)}
                  style={{
                    textAlign: 'left',
                    padding: '0.75rem 0.9rem',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    background: isCurrent
                      ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.24), rgba(30, 41, 59, 0.95))'
                      : 'rgba(15, 23, 42, 0.78)',
                    border: isCurrent
                      ? '1px solid rgba(250, 204, 21, 0.75)'
                      : '1px solid rgba(148, 163, 184, 0.2)',
                    boxShadow: isCurrent ? '0 0 18px rgba(212, 175, 55, 0.22)' : 'none',
                    transition: 'all 0.18s ease',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      letterSpacing: '0.1em',
                      color: isCurrent ? '#fde047' : '#94a3b8',
                      marginBottom: '0.25rem',
                    }}
                  >
                    LIÇÃO {st.stepNumber} DE {WALKTHROUGH_STEPS.length}
                  </div>
                  <div
                    className="font-cinzel"
                    style={{
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      color: isCurrent ? '#ffffff' : '#cbd5e1',
                      lineHeight: 1.3,
                    }}
                  >
                    {st.title.replace(/^\d+\.\s*/, '')}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Lesson Showcase Card */}
          <div className="aaa-codex-row" style={{ alignItems: 'stretch' }}>
            <div
              className="aaa-codex-card-preview"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
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
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', textAlign: 'center' }}>
                🔍 Clique na carta para inspecionar em 3D
              </span>
            </div>

            <div className="aaa-codex-info" style={{ flex: 1 }}>
              <div className="aaa-kicker">{currentStep.badge}</div>
              <h2 className="font-cinzel aaa-codex-heading" style={{ fontSize: '1.45rem' }}>
                {currentStep.title}
              </h2>
              <p
                style={{
                  color: '#fde68a',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  marginBottom: '0.65rem',
                }}
              >
                {currentStep.subtitle}
              </p>
              <p className="aaa-codex-p" style={{ marginBottom: '1rem' }}>
                {currentStep.summary}
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '0.85rem',
                  marginBottom: '1rem',
                }}
              >
                {currentStep.keyPoints.map((kp, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '0.9rem 1rem',
                      borderRadius: '10px',
                      background: 'rgba(15, 23, 42, 0.85)',
                      border: '1px solid rgba(212, 175, 55, 0.25)',
                    }}
                  >
                    <div
                      className="font-cinzel"
                      style={{
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        color: '#fef08a',
                        marginBottom: '0.35rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                      }}
                    >
                      <span style={{ fontSize: '1.1rem' }}>{kp.icon}</span>
                      <span>{kp.title}</span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                      {kp.detail}
                    </p>
                  </div>
                ))}
              </div>

              {/* Pro Tip Banner */}
              <div
                style={{
                  padding: '0.8rem 1rem',
                  borderRadius: '8px',
                  background: 'linear-gradient(90deg, rgba(212, 175, 55, 0.16), rgba(15, 23, 42, 0.9))',
                  borderLeft: '4px solid #facc15',
                  color: '#fef9c3',
                  fontSize: '0.85rem',
                  marginBottom: '1.1rem',
                }}
              >
                💡 <strong>{currentStep.proTip}</strong>
              </div>

              {/* Lesson Navigation Footer */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  paddingTop: '0.5rem',
                  borderTop: '1px solid rgba(148, 163, 184, 0.18)',
                }}
              >
                <button
                  type="button"
                  className="btn-fantasy"
                  disabled={activeStepIndex === 0}
                  onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                >
                  ← Lição Anterior
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
                        onClick={() => setActiveSection('domains')}
                      >
                        🔥 Ver 5 Domínios & Expansões →
                      </button>
                      {onStartPracticeDuel && (
                        <button
                          type="button"
                          className="btn-fantasy btn-fantasy-primary"
                          onClick={onStartPracticeDuel}
                        >
                          ⚔️ Praticar na Arena Agora!
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SECTION 2: DOMAIN EXPANSION SANCTUARIES & CLASH STATES
         ===================================================================== */}
      {activeSection === 'weather_runes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Domain Expansion Sanctuaries Panel */}
          <div className="tg-panel">
            <div className="aaa-kicker">TRANSFORMAÇÃO SUPREMA DA MESA DE MADEIRA (⛩️ 6/6 AFINIDADE + 3⚡)</div>
            <h2 className="font-cinzel gold-gradient-text" style={{ fontSize: '1.35rem', marginBottom: '0.4rem' }}>
              ⛩️ As 5 Expansões de Domínio (Efeito Visual & Prático por 3 Rodadas)
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '1.1rem', lineHeight: 1.55 }}>
              A partida começa sobre a mesa de guerra de madeira em tela cheia. Ao acumular{' '}
              <strong>6 de Afinidade Elemental (⛩️ 6/6)</strong> e pagar <strong>3⚡</strong>, o Soberano invoca sua{' '}
              <strong>Expansão de Domínio</strong> por <strong>3 rodadas</strong>: uma onda radial transforma toda a mesa no ambiente daquele Domínio, concedendo{' '}
              <strong>Potencial 120%</strong> às unidades aliadas daquela cor e <strong>Acerto Garantido</strong> direto contra o Soberano inimigo! Se o rival também expandir seu Domínio, ocorre o{' '}
              <strong>Choque de Domínios 50/50</strong> (metade superior com o Domínio inimigo, metade inferior com o seu Domínio e uma Linha de Falha Central faiscando no meio). Ao terminar naturalmente após 3 rodadas, o Domínio se recolhe em íris radial; se for destruído à força, ele se{' '}
              <strong>estilhaça em 8 fragmentos poligonais 3D</strong>!
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '0.9rem',
              }}
            >
              {[
                {
                  icon: '🔥',
                  name: 'Caldeira do Sol Carmesim',
                  domain: 'Vermelho • Legião da Cratera Ardente',
                  color: '#ef4444',
                  effect:
                    'Mesa de guerra carbonizada e rachada por rios de lava derretida fluindo da esquerda para a direita. Concede Potencial 120% (+2⚔️ ATQ às unidades Rubras), 2🔥 de queima vulcânica por rodada e Acerto Garantido no Soberano rival.',
                  tactic:
                    'Combine com atacantes de Ímpeto e Sopro para finalizar o Soberano inimigo em uma única investida.',
                },
                {
                  icon: '💀',
                  name: 'Santuário Malevolente das Almas',
                  domain: 'Roxo • Cripta do Sol Negro',
                  color: '#a855f7',
                  effect:
                    'Cemitério gótico com lápides, portões de ferro e névoa necrótica púrpura. Concede Potencial 120% (+2⚔️ ATQ e Dreno de Vida às unidades Umbrais), drena 2❤️ do Soberano rival por rodada e libera Acerto Garantido.',
                  tactic:
                    'Use unidades Umbrais durante a Expansão para drenar Vida diretamente do Soberano rival a cada ataque.',
                },
                {
                  icon: '❄️',
                  name: 'Vazio Infinito de Cronos',
                  domain: 'Azul • Conclave do Olho do Furacão',
                  color: '#38bdf8',
                  effect:
                    'Santuário glacial congelado e tempestade astral com pilares de gelo rúnico e turbilhões. Concede Potencial 120% (+1⚔️ ATQ e +1🛡️ ARM às unidades Azuis), congela 1 inimigo + compra 1 carta por rodada e libera Acerto Garantido.',
                  tactic:
                    'Congele os maiores atacantes inimigos enquanto seus voadores e colossos golpeiam diretamente o Soberano adversário.',
                },
                {
                  icon: '🌿',
                  name: 'Mar de Árvores Primordial',
                  domain: 'Verde • Coração da Selva Primordial',
                  color: '#22c55e',
                  effect:
                    'Solo de floresta primordial tomado por raízes vivas, musgo esmeralda e pedras druídicas. Concede Potencial 120% (+2⚔️ ATQ, +1🛡️ ARM e Atropelar às unidades Verdes), regenera +2❤️ em todas as suas criaturas e libera Acerto Garantido.',
                  tactic:
                    'Acelere sua Afinidade com canalizações para expandir o Domínio cedo e esmagar o rival com colossos de Atropelar.',
                },
                {
                  icon: '☀️',
                  name: 'Tribunal da Sentença Dourada',
                  domain: 'Dourado • Cidadela da Aurora Dourada',
                  color: '#facc15',
                  effect:
                    'Santuário imperial de mármore e forja de bronze com canais fluindo ouro derretido. Concede Potencial 120% (+1⚔️ ATQ e +2🛡️ ARM às unidades Douradas), Escudo Divino ao maior aliado, -2⚔️ ATQ ao maior inimigo e Acerto Garantido.',
                  tactic:
                    'Transforma até mesmo seus Guardiões e suportes defensivos em finalizadores letais contra o Soberano inimigo.',
                },
              ].map((w, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '1rem',
                    borderRadius: '10px',
                    background: 'rgba(15, 23, 42, 0.88)',
                    border: `1px solid ${w.color}55`,
                    boxShadow: `inset 0 0 18px ${w.color}15`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '1.4rem' }}>{w.icon}</span>
                    <div>
                      <div className="font-cinzel" style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.92rem' }}>
                        {w.name}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: w.color, fontWeight: 700 }}>{w.domain}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#e2e8f0', lineHeight: 1.5, marginBottom: '0.45rem' }}>
                    {w.effect}
                  </p>
                  <div style={{ fontSize: '0.75rem', color: '#fde68a' }}>
                    🎯 <em>{w.tactic}</em>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Domain Animations & Clash States Panel */}
          <div className="tg-panel">
            <div className="aaa-kicker">DINÂMICA VISUAL E PRÁTICA DO TABULEIRO</div>
            <h2 className="font-cinzel gold-gradient-text" style={{ fontSize: '1.35rem', marginBottom: '0.4rem' }}>
              ⚡ Os 4 Estados da Expansão de Domínio na Mesa de Guerra
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '1.1rem', lineHeight: 1.55 }}>
              A Expansão de Domínio é o único efeito de transformação de campo do jogo, alterando tanto a estratégia prática quanto a superfície física da mesa de madeira em 4 momentos:
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '0.9rem',
              }}
            >
              {[
                {
                  icon: '⛩️',
                  name: '1. Entrada (Expansão Radial • 3⚡)',
                  color: '#fb923c',
                  reward: 'Ao pagar 3⚡ com 6/6 de Afinidade, um anel dourado expande do centro em onda de choque revelando o santuário do seu Domínio por 3 rodadas.',
                  bestWith: 'Concede Potencial 120% às unidades daquela cor e Acerto Garantido contra o Soberano rival.',
                },
                {
                  icon: '⚡',
                  name: '2. Choque de Domínios (Divisão 50/50)',
                  color: '#a855f7',
                  reward: 'Quando os dois Soberanos estão com Expansão de Domínio ativa com Afinidades empatadas, o tabuleiro se divide 50/50 (Domínio do Oponente no topo, seu Domínio na base) com uma Linha de Falha Central faiscando no meio! (Se a sua Afinidade for maior que a do rival, seu Domínio sobrepuja e estilhaça o dele imediatamente!)',
                  bestWith: 'Enquanto o Choque 50/50 dura, as barreiras colidem e o Acerto Garantido de ambos os lados é neutralizado.',
                },
                {
                  icon: '⏳',
                  name: '3. Expiração Natural (Fim das 3 Rodadas)',
                  color: '#38bdf8',
                  reward: 'Quando as 3 rodadas da Expansão de Domínio chegam ao fim naturalmente, o santuário elemental se recolhe suavemente em íris radial de volta para o centro.',
                  bestWith: 'A mesa de guerra de madeira original reaparece sem dano estrutural.',
                },
                {
                  icon: '💥',
                  name: '4. Contramedidas & Estilhaçamento (8 Fragmentos)',
                  color: '#ef4444',
                  reward: 'Você pode neutralizar o Acerto Garantido por 1 rodada ativando o Domínio Simples (2⚡), ou destruir o Domínio inimigo à força causando 8+ de dano ao Soberano controlador na mesma rodada ou pagando 10❤️ de Sacrifício Distribuído — estilhaçando o santuário em 8 fragmentos poligonais 3D!',
                  bestWith: 'Cancela imediatamente os bônus inimigos e devolve o combate à mesa de madeira.',
                },
              ].map((r, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '1rem',
                    borderRadius: '10px',
                    background: 'rgba(15, 23, 42, 0.88)',
                    border: `1px solid ${r.color}66`,
                  }}
                >
                  <div
                    className="font-cinzel"
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      color: r.color,
                      marginBottom: '0.4rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                    }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>{r.icon}</span>
                    <span>{r.name}</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#e2e8f0', lineHeight: 1.5, marginBottom: '0.45rem' }}>
                    {r.reward}
                  </p>
                  <div style={{ fontSize: '0.75rem', color: '#93c5fd' }}>💡 {r.bestWith}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SECTION 3: BOARD 6x4, 3x SLOT STACKING & WOODEN TABLE TRANSFORMATION
         ===================================================================== */}
      {activeSection === 'board_stacking' && (
        <div className="tg-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <div className="aaa-kicker">MESA DE GUERRA EM TELA CHEIA (6 COLUNAS × 4 FILEIRAS)</div>
            <h2 className="font-cinzel gold-gradient-text" style={{ fontSize: '1.35rem', marginBottom: '0.35rem' }}>
              📐 Tabuleiro 6×4 na Mesa de Madeira, Pilhas 3x & Transformação de Domínio
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.55 }}>
              O campo de batalha é uma mesa de guerra de madeira em tela cheia organizada em{' '}
              <strong>6 Colunas × 4 Fileiras</strong> (Vanguarda <code>[V]</code> e Retaguarda <code>[R]</code> para cada Soberano). Cada slot individual comporta até{' '}
              <strong>3 unidades empilhadas</strong>.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1rem',
            }}
          >
            <div
              style={{
                padding: '1rem',
                borderRadius: '10px',
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
              }}
            >
              <h3 className="font-cinzel" style={{ color: '#fca5a5', fontSize: '0.96rem', marginBottom: '0.4rem' }}>
                ⚔️ 1. Vanguarda [V], Invasão (+1⚔️ ATQ) & Falange (+1🛡️ ARM)
              </h3>
              <p style={{ fontSize: '0.83rem', color: '#e2e8f0', lineHeight: 1.55 }}>
                A Vanguarda bloqueia ataques terrestres contra a Retaguarda da mesma coluna e contra o seu Soberano. Quando a{' '}
                <strong>Vanguarda inimiga oposta está vazia</strong>, suas unidades na Vanguarda ganham{' '}
                <strong>+1⚔️ ATQ de Invasão</strong>! Além disso, unidades na Vanguarda adjacentes ou empilhadas com um{' '}
                <strong>Guardião</strong> ganham <strong>+1🛡️ Armadura de Falange</strong>!
              </p>
            </div>

            <div
              style={{
                padding: '1rem',
                borderRadius: '10px',
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
              }}
            >
              <h3 className="font-cinzel" style={{ color: '#93c5fd', fontSize: '0.96rem', marginBottom: '0.4rem' }}>
                🛡️ 2. Retaguarda [R] & Cobertura de Coluna (+1⚔️ ATQ)
              </h3>
              <p style={{ fontSize: '0.83rem', color: '#e2e8f0', lineHeight: 1.55 }}>
                A Retaguarda recebe Criaturas de suporte/Alcance, <strong>Relíquias</strong> e <strong>Emboscadas/Reações</strong>. Enquanto houver pelo menos 1 aliado vivo na{' '}
                <strong>Vanguarda da mesma coluna</strong>, suas unidades na Retaguarda ficam protegidas de ataques terrestres e ganham{' '}
                <strong>+1⚔️ ATQ de Cobertura</strong>!
              </p>
            </div>

            <div
              style={{
                padding: '1rem',
                borderRadius: '10px',
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(74, 222, 128, 0.4)',
              }}
            >
              <h3 className="font-cinzel" style={{ color: '#86efac', fontSize: '0.96rem', marginBottom: '0.4rem' }}>
                ✅ 3. Quando Empilhar até 3 Unidades por Slot
              </h3>
              <p style={{ fontSize: '0.83rem', color: '#e2e8f0', lineHeight: 1.55 }}>
                Contra oponentes focados em <strong>abates de alvo único ou combate físico</strong>, empilhe{' '}
                <strong>1 Guardião na frente + 2 Atacantes/Suportes no mesmo slot</strong>. O inimigo precisará passar pelo Guardião antes de tocar nos demais, enquanto toda a sua pilha ataca livremente no seu turno!
              </p>
            </div>

            <div
              style={{
                padding: '1rem',
                borderRadius: '10px',
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(250, 204, 21, 0.45)',
              }}
            >
              <h3 className="font-cinzel" style={{ color: '#fde047', fontSize: '0.96rem', marginBottom: '0.4rem' }}>
                ⚠️ 4. Quando Espalhar 1 Unidade por Coluna
              </h3>
              <p style={{ fontSize: '0.83rem', color: '#e2e8f0', lineHeight: 1.55 }}>
                Contra Dragões com <strong>Sopro</strong>, feras com <strong>Atropelar</strong> ou Grimórios de magias em área,{' '}
                <strong>NÃO empilhe 3 unidades frágeis no mesmo slot</strong>! Ataques de Sopro e explosões atingem{' '}
                <strong>todas as 3 cartas empilhadas naquele slot de uma só vez</strong>.
              </p>
            </div>
          </div>

          <div
            style={{
              padding: '1.05rem',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.92), rgba(15, 23, 42, 0.95))',
              border: '1px solid rgba(212, 175, 55, 0.45)',
            }}
          >
            <h3 className="font-cinzel" style={{ color: '#fde047', fontSize: '1.02rem', marginBottom: '0.45rem' }}>
              ⛩️ Transformação da Mesa de Madeira (Expansão de Domínio: 6/6 Afinidade e 3⚡)
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#e2e8f0', lineHeight: 1.55, margin: 0 }}>
              Quando qualquer Soberano invoca sua <strong>Expansão de Domínio</strong> (exige <strong>6/6 de Afinidade</strong> e custa <strong>3⚡</strong>), toda a mesa de madeira assume a forma visual e prática daquele Domínio por <strong>3 rodadas</strong>:
              <br />• <strong>🔥 Vermelho (Caldeira do Sol Carmesim):</strong> Mesa de guerra carbonizada e rachada por rios de lava derretida fluindo da esquerda para a direita (+2⚔️ ATQ às unidades Rubras e 2🔥 de queima por rodada).
              <br />• <strong>💀 Roxo (Santuário Malevolente das Almas):</strong> Cemitério gótico com lápides, portões de ferro e névoa necrótica púrpura (+2⚔️ ATQ e Dreno de Vida às unidades Umbrais + drena 2❤️ por rodada).
              <br />• <strong>❄️ Azul (Vazio Infinito de Cronos):</strong> Santuário glacial congelado e tempestade astral com pilares de gelo rúnico e turbilhões (+1⚔️ ATQ e +1🛡️ ARM às unidades Azuis + congela 1 inimigo e compra 1 carta).
              <br />• <strong>🌿 Verde (Mar de Árvores Primordial):</strong> Solo de floresta primordial tomado por raízes vivas, musgo esmeralda e pedras druídicas (+2⚔️ ATQ, +1🛡️ ARM e Atropelar às unidades Verdes + regenera +2❤️).
              <br />• <strong>☀️ Dourado (Tribunal da Sentença Dourada):</strong> Santuário imperial de mármore e forja de bronze com canais fluindo ouro derretido (+1⚔️ ATQ e +2🛡️ ARM às unidades Douradas + Escudo Divino no maior aliado e -2⚔️ ATQ no maior inimigo).
            </p>
          </div>
        </div>
      )}

      {/* =====================================================================
          SECTION 4: THE 5 ELEMENTAL DOMAINS, SOVEREIGN POWERS & DOMAIN EXPANSIONS
         ===================================================================== */}
      {activeSection === 'domains' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
            gap: '1rem',
          }}
        >
          {(
            [
              {
                domain: 'red' as Domain,
                sovereignPower: '🔥 Chama Soberana (2⚡): Causa 2🔥 a um inimigo e 1🔥 ao Soberano rival (ou 3🔥 ao Soberano se o campo estiver vazio).',
                affinityUsage:
                  '💎 Afinidade Vermelha: Destrava Dragões e piromancias pesadas e carrega o ritual "⛩️ 6/6" para a Expansão de Domínio.',
                domainExpansion:
                  '⛩️ Expansão de Domínio (6/6 Afinidade, 3⚡) — Caldeira do Sol Carmesim: Transforma toda a mesa de madeira em uma tábua de guerra carbonizada rachada por rios de lava derretida (3 rodadas, Potencial 120%: +2⚔️ ATQ, Acerto Garantido e 2🔥 de queima por rodada).',
                archetype: 'Agressão explosiva, Ímpeto, Fúria Crescente, Pele Incandescente, Dragões de Sopro e queima direta.',
                cardId: 'red_08_dragao_vermelho',
              },
              {
                domain: 'purple' as Domain,
                sovereignPower: '💀 Dreno Umbroso (2⚡): Causa 2💀 a um inimigo (ou ao Soberano rival), cura +2❤️ no seu Soberano e gera +1 Corrupção.',
                affinityUsage:
                  '💎 Afinidade Roxa: Destrava Lichs, Dracolichs e rituais da Cripta e carrega o ritual "⛩️ 6/6" para a Expansão de Domínio.',
                domainExpansion:
                  '⛩️ Expansão de Domínio (6/6 Afinidade, 3⚡) — Santuário Malevolente das Almas: Transforma toda a mesa de madeira em um cemitério gótico com lápides, portões de ferro e névoa necrótica púrpura (3 rodadas, Potencial 120%: +2⚔️ ATQ e Dreno de Vida, Acerto Garantido e drena 2❤️ por rodada).',
                archetype: 'Reanimação da Cripta, Toque Letal, Dreno de Vida, Renascer e Pactos de Sangue.',
                cardId: 'purple_07_lich',
              },
              {
                domain: 'blue' as Domain,
                sovereignPower: '❄️ Pulso Rúnico (2⚡): Congela um inimigo causando 2❄️ (ou 2❄️ ao Soberano rival) e concede +1⚔️/+1❤️ a um aliado (ou compra 1 carta).',
                affinityUsage:
                  '💎 Afinidade Azul: Destrava Leviatãs, Krakens e feitiços temporais e carrega o ritual "⛩️ 6/6" para a Expansão de Domínio.',
                domainExpansion:
                  '⛩️ Expansão de Domínio (6/6 Afinidade, 3⚡) — Vazio Infinito de Cronos: Transforma toda a mesa de madeira em um santuário glacial congelado e tempestade astral com pilares de gelo rúnico e turbilhões (3 rodadas, Potencial 120%: +1⚔️/+1🛡️, Acerto Garantido, congela 1 inimigo e compra 1 carta).',
                archetype: 'Congelamento, compra de cartas, Voo, Alcance, Reações de contra-feitiço e manipulação temporal.',
                cardId: 'blue_06_dragao_azul',
              },
              {
                domain: 'green' as Domain,
                sovereignPower: '🌿 Rugido Alfa (2⚡): Concede +1⚔️ ATQ e +2❤️ Vida ao aliado mais forte (ou cura +3❤️ no seu Soberano).',
                affinityUsage:
                  '💎 Afinidade Verde: Destrava Behemoths, Hidras e feras ancestrais e carrega o ritual "⛩️ 6/6" para a Expansão de Domínio.',
                domainExpansion:
                  '⛩️ Expansão de Domínio (6/6 Afinidade, 3⚡) — Mar de Árvores Primordial: Transforma toda a mesa de madeira em um solo de floresta primordial tomado por raízes vivas, musgo esmeralda e pedras druídicas (3 rodadas, Potencial 120%: +2⚔️/+1🛡️ e Atropelar, Acerto Garantido e regenera +2❤️).',
                archetype: 'Enxame de feras, Atropelar, Regeneração, aceleração de Afinidade e múltiplas Ascensões (★).',
                cardId: 'green_09_hidra',
              },
              {
                domain: 'gold' as Domain,
                sovereignPower: '☀️ Baluarte Imperial (2⚡): Concede +1🛡️ Armadura e +2❤️ Vida ao aliado mais ferido (ou cura +3❤️ no seu Soberano).',
                affinityUsage:
                  '💎 Afinidade Dourada: Destrava Serafins, Arcanjos e Relíquias Imperiais e carrega o ritual "⛩️ 6/6" para a Expansão de Domínio.',
                domainExpansion:
                  '⛩️ Expansão de Domínio (6/6 Afinidade, 3⚡) — Tribunal da Sentença Dourada: Transforma toda a mesa de madeira em um santuário imperial de mármore e forja de bronze com canais fluindo ouro derretido (3 rodadas, Potencial 120%: +1⚔️/+2🛡️, Acerto Garantido, Escudo Divino no maior aliado e -2⚔️ no maior inimigo).',
                archetype: 'Guardiões, Escudo Divino, Armadura pesada e Cidadela de Relíquias Contínuas na Retaguarda.',
                cardId: 'gold_09_serafim_solar',
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
                  border: `1px solid ${meta.color}66`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: meta.color, fontWeight: 800 }}>
                      DOMÍNIO ELEMENTAL
                    </div>
                    <h3 className="font-cinzel" style={{ fontSize: '1.15rem', color: '#ffffff' }}>
                      {meta.icon} {meta.name}
                    </h3>
                  </div>
                  {card?.imagePath && (
                    <img
                      src={card.imagePath}
                      alt={card.name}
                      style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '8px',
                        objectFit: 'cover',
                        border: `1px solid ${meta.color}`,
                        cursor: 'pointer',
                      }}
                      onClick={() => card && onInspectCard?.(card)}
                    />
                  )}
                </div>

                <p style={{ fontSize: '0.82rem', color: '#cbd5e1', margin: 0, lineHeight: 1.45 }}>
                  {d.archetype}
                </p>

                <div
                  style={{
                    fontSize: '0.78rem',
                    padding: '0.55rem 0.7rem',
                    borderRadius: '8px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    color: '#fde68a',
                  }}
                >
                  <strong>{d.sovereignPower}</strong>
                </div>

                <div
                  style={{
                    fontSize: '0.78rem',
                    padding: '0.55rem 0.7rem',
                    borderRadius: '8px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    color: '#e2e8f0',
                  }}
                >
                  {d.affinityUsage}
                </div>

                <div
                  style={{
                    fontSize: '0.78rem',
                    padding: '0.55rem 0.7rem',
                    borderRadius: '8px',
                    background: 'rgba(30, 41, 59, 0.85)',
                    border: `1px solid ${meta.color}44`,
                    color: '#fef08a',
                    lineHeight: 1.45,
                  }}
                >
                  {d.domainExpansion}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =====================================================================
          SECTION 5: KEYWORDS ENCYCLOPEDIA
         ===================================================================== */}
      {activeSection === 'keywords' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, marginRight: '0.4rem' }}>
              FILTRAR POR CATEGORIA:
            </span>
            {(['all', 'Ofensiva', 'Defensiva', 'Mobilidade', 'Especial'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                className={`btn-fantasy ${keywordFilter === cat ? 'btn-fantasy-primary' : ''}`}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                onClick={() => setKeywordFilter(cat)}
              >
                {cat === 'all' ? `Todas (${KEYWORD_ENCYCLOPEDIA.length})` : cat}
              </button>
            ))}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
              gap: '0.9rem',
            }}
          >
            {filteredKeywords.map((kw) => {
              const exCard = CARDS_BY_ID[kw.exampleCardId];
              return (
                <div
                  key={kw.name}
                  className="tg-panel"
                  style={{
                    border: `1px solid ${kw.color}55`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.6rem',
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
                          fontSize: '0.98rem',
                          fontWeight: 700,
                          color: kw.color,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                        }}
                      >
                        <span style={{ fontSize: '1.2rem' }}>{kw.icon}</span>
                        <span>{kw.name}</span>
                      </div>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          padding: '2px 7px',
                          borderRadius: '999px',
                          background: 'rgba(30, 41, 59, 0.9)',
                          border: `1px solid ${kw.color}55`,
                          color: kw.color,
                          fontWeight: 700,
                        }}
                      >
                        {kw.category}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.82rem', color: '#e2e8f0', lineHeight: 1.5, marginBottom: '0.45rem' }}>
                      {kw.description}
                    </p>
                    <div style={{ fontSize: '0.76rem', color: '#fde68a', lineHeight: 1.4 }}>
                      💡 <em>{kw.tacticalTip}</em>
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
                        background: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid rgba(148, 163, 184, 0.2)',
                        cursor: 'pointer',
                        marginTop: '0.25rem',
                      }}
                    >
                      {exCard.imagePath && (
                        <img
                          src={exCard.imagePath}
                          alt={exCard.name}
                          style={{ width: '32px', height: '32px', borderRadius: '5px', objectFit: 'cover' }}
                        />
                      )}
                      <div style={{ flex: 1, fontSize: '0.74rem' }}>
                        <div style={{ color: '#ffffff', fontWeight: 700 }}>Exemplo: {exCard.name}</div>
                        <div style={{ color: '#94a3b8', fontSize: '0.68rem' }}>
                          {exCard.cost}⚡ • Clique para ver em 3D
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          SECTION 6: SYMMETRIC BARS, AUTO-HIDE HAND & KEYBOARD SHORTCUTS
         ===================================================================== */}
      {activeSection === 'controls' && (
        <div className="tg-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <div className="aaa-kicker">INTERFACE EM TELA CHEIA, BARRAS SIMÉTRICAS & ATALHOS</div>
            <h2 className="font-cinzel gold-gradient-text" style={{ fontSize: '1.35rem', marginBottom: '0.35rem' }}>
              ⌨️ Guia das Barras Simétricas (Topo/Base), Mão Auto-Ocultável & Atalhos
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
              A arena utiliza uma interface limpa em tela cheia com duas barras simétricas centralizadas e gavetas retráteis:
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
                key: 'Barra Superior (▾)',
                title: 'Pílula do Soberano Oponente & Gaveta ▾',
                desc: 'Mostra Vida (❤️), Essência (⚡), contagem de cartas na Mão, Grimório/Cripta e temporizador de Domínio ativo do oponente. Passe o mouse ou clique em "▾" para abrir os Terrenos Canalizados, Afinidades, botão da Cripta e status de Expansão de Domínio do rival.',
              },
              {
                key: 'Barra Inferior (▴)',
                title: 'Barra do Seu Soberano & Gaveta ▴',
                desc: 'Exibe sua Vida (❤️), Essência (⚡), Grimório/Cripta e chips de Rituais (🔥 2⚡, 🩸 +1⚡, ⛩️ X/6). Passe o mouse sobre seu nome/status ou clique em "▴" para abrir seus Terrenos Canalizados, Afinidades, Cripta e status da Expansão de Domínio (6/6 Afinidade).',
              },
              {
                key: '🃏 MÃO',
                title: 'Gaveta da Mão Auto-Ocultável',
                desc: 'Passe o mouse sobre o botão "🃏 MÃO" na barra inferior para revelar suas cartas ou clique nele para fixar a gaveta da mão aberta enquanto planeja seu turno.',
              },
              {
                key: '[C]',
                title: 'Canalizar 1 Carta (+1 Afin. & Compra) / Sacrificar Extra',
                desc: 'Canaliza 1 carta da mão nos seus Terrenos Canalizados (+1 Afinidade Elemental da cor da carta e compra +1 carta substituta, somando-se ao +1⚡ de Essência Máxima automático de cada turno). Após canalizar, pressione [C] em outras cartas para Sacrificar/Queimar por +1⚡ temporário imediato e +1 Afinidade.',
              },
              {
                key: '[V] / [R]',
                title: 'Invocar na Vanguarda [V] ou Retaguarda [R]',
                desc: 'Com uma carta selecionada na mão, [V] invoca na Vanguarda (linha de frente e Invasão de Coluna) e [R] posiciona Criaturas, Relíquias ou Emboscadas/Reações na Retaguarda.',
              },
              {
                key: '⚔️ ATACAR',
                title: 'Combate Manual ou Automático',
                desc: 'Clique em qualquer criatura pronta (sem enjoo de invocação ou com ⚡ Ímpeto) e clique em um alvo inimigo válido — ou clique em "⚔️ ATACAR" na barra inferior para disparar ataques automáticos.',
              },
              {
                key: '[ESPAÇO]',
                title: '⏭️ PASSAR TURNO [ESPAÇO]',
                desc: 'Encerra imediatamente o seu turno e passa o controle da partida para o Soberano oponente.',
              },
              {
                key: '🔍 Lupa / [ESC]',
                title: 'Inspeção 3D & Cancelar Seleção',
                desc: 'Clique na lupa (ou botão direito) para inspecionar qualquer carta em 3D com lore e glossário. Pressione [ESC] para cancelar uma seleção ou fechar modais.',
              },
            ].map((sc, i) => (
              <div
                key={i}
                style={{
                  padding: '0.95rem',
                  borderRadius: '10px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(212, 175, 55, 0.28)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.4rem' }}>
                  <kbd
                    style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: 'rgba(212, 175, 55, 0.2)',
                      border: '1px solid #facc15',
                      color: '#fde047',
                      fontWeight: 800,
                      fontSize: '0.78rem',
                    }}
                  >
                    {sc.key}
                  </kbd>
                  <span className="font-cinzel" style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.88rem' }}>
                    {sc.title}
                  </span>
                </div>
                <p style={{ fontSize: '0.81rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>{sc.desc}</p>
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
          {innerContent}
        </div>
      </div>
    );
  }

  return innerContent;
};
