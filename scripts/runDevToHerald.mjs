/**
 * Arauto Editorial Cloud — Série de Artigos sobre Card Games no Dev.to (GitHub Actions)
 * 100% Automático, Idempotente e Zero Intervenção Humana:
 * - Consulta os artigos já publicados em https://dev.to/api/articles/me/all via DEVTO_API_KEY.
 * - Publica no máximo 1 novo artigo por execução, respeitando janela mínima anti-spam (~72h) e datas de desbloqueio.
 * - Artigos editoriais comparativos (PT-BR e EN) voltados a buscas reais no Google ("melhores card games grátis navegador",
 *   "jogos estilo Magic e Runeterra sem pay-to-win", "free tactical browser card games like MTG & Duelyst"), posicionando
 *   naturalmente o Chromatic Pact com links rastreados via UTM.
 */

const DEVTO_API = 'https://dev.to/api';
const MIN_HOURS_BETWEEN_ARTICLES = 68;

function sanitizeTags(tags) {
  return (tags || [])
    .map((t) => String(t).toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20))
    .filter(Boolean)
    .slice(0, 4);
}

const ARTICLES = [
  {
    id: 'devto_01_7_cardgames_taticos_gratis_ptbr',
    unlockAfterIso: '2026-11-08T00:00:00Z',
    matchKeywords: ['7 card games táticos', 'estilo magic e runeterra'],
    payload: {
      title: '7 Card Games Táticos (Estilo Magic e Runeterra) Para Jogar Grátis Sem Pay-to-Win em 2026',
      description: 'Comparativo direto dos melhores card games de estratégia gratuitos para PC, celular e navegador — do clássico MTG Arena a tabuleiros táticos sem download.',
      tags: ['gaming', 'gamedev', 'rpg', 'indiedev'],
      series: 'Guia de Card Games Estratégicos',
      main_image: 'https://chromaticpact.com/press/mesa-combate.png',
      body_markdown: `Se você gosta da profundidade estratégica de **Magic: The Gathering**, das respostas de turno de **Legends of Runeterra** ou do posicionamento em tabuleiro de **Duelyst**, provavelmente já esbarrou nos mesmos três muros em 2026:

1. **Clientes pesados de 10 GB a 25 GB** que drenam bateria no celular ou pedem atualizações gigantes antes de uma partida rápida;
2. **Economias agressivas de pacotes**, onde montar um único deck competitivo exige semanas de *grind* ou cartão de crédito;
3. **Buscas poluídas**: procurar *"card game grátis no navegador"* quase sempre devolve apenas Paciência, Uno ou Truco — e quase nunca um TCG tático de verdade.

Reunimos abaixo **7 card games táticos gratuitos** que realmente premiam leitura de mesa, construção de deck e tomada de decisão, destacando onde cada um brilha (e onde pesa).

---

### 1. Chromatic Pact (Navegador — PC e Mobile, Zero Download)

![Mesa de combate tático 6x2 no Chromatic Pact](https://chromaticpact.com/press/mesa-combate.png)

Para quem quer entrar em um duelo tático profundo em **2 segundos direto na aba do navegador** (sem instalar nada e sem obrigação de cadastro para testar), **[Chromatic Pact](https://chromaticpact.com/?utm_source=devto_art1&utm_medium=editorial&utm_campaign=cardgames_seo)** combina construção de **Grimórios de 100 cartas** com um **tabuleiro 6×2 de Vanguarda e Retaguarda**.

- **Por que se destaca:** Posicionamento físico importa — unidades na *Vanguarda* protegem conjuradores e artilharia na *Retaguarda*. Além disso, cada Soberano pode desencadear **Expansões de Domínio** (*Chama, Tempestade, Abismo, Selva, Ordem e Neutro*), gerando **Choques de Domínio** pelo controle territorial da arena e **Ascensões** de criaturas em pleno combate.
- **Economia & Modos:** 100% gratuito e zero *pay-to-win* (ouro e pacotes vêm exclusivamente de vitórias, missões, campanha com **190 duelos em 48 Províncias** e **Torneios Suíços Diários** gratuitos seg–sex às 19h e sáb/dom às 14h BRT).
- **Onde jogar agora:** [Abrir mesa direto no navegador (chromaticpact.com)](https://chromaticpact.com/?utm_source=devto_art1&utm_medium=editorial&utm_campaign=cardgames_seo)

---

### 2. Duelyst II (Steam / Web Desktop)

Herdeiro espiritual do clássico *Duelyst*, mistura cartas com movimentação em grade estilo xadrez tático (*Tactics*).

- **Ponto forte:** Posicionamento do General no tabuleiro cria partidas tensas do primeiro ao último turno.
- **Ponto de atenção:** Curva inicial exigente para quem nunca jogou táticos em grade e foco maior em telas grandes (desktop).

---

### 3. Magic: The Gathering Arena (PC / Mobile)

A referência histórica de complexidade e interação na pilha (*stack*).

- **Ponto forte:** Regras lendárias, dezenas de coleções e formatos como *Draft* e *Brawl*.
- **Ponto de atenção:** Download pesado, rotações que encarecem manter múltiplos decks competitivos sem investir dinheiro e o clássico problema de *mana screw / mana flood* (comprar terrenos demais ou de menos).

---

### 4. Legends of Runeterra (PC / Mobile)

Mesmo após a mudança de foco da Riot para o modo solo (*Caminho dos Campeões*), continua sendo uma aula de design de turnos alternados e reserva de mana de feitiço.

- **Ponto forte:** Excelente experiência PvE *roguelite* e progressão generosa de cartas.
- **Ponto de atenção:** O cenário competitivo ranqueado e de torneios oficiais perdeu espaço em relação aos primeiros anos.

---

### 5. Gwent: The Witcher Card Game — Comunidade *Gwentfinity* (PC / Mobile)

Sem mana e focado em melhor de 3 rodadas onde cada carta do seu deck precisa render o máximo de pontos e blefe.

- **Ponto forte:** Arte sombria impecável e altíssimo teto de habilidade em gestão de recursos entre rodadas.
- **Ponto de atenção:** Não há combate direto de criaturas atacando um líder; a dinâmica é soma estratégica de força por fileiras.

---

### 6. Eternal Card Game (PC / Mobile / Consoles)

Projetado por veteranos do circuito profissional de *Magic*, adapta mecânicas de resposta rápida para uma interface digital mais enxuta.

- **Ponto forte:** Modos solo (*Gauntlet* e *Forge*) divertidos e bom suporte a *draft*.
- **Ponto de atenção:** Comunidade menor no Brasil e necessidade de instalar cliente dedicado.

---

### 7. Pokémon TCG Live (PC / Mobile)

Entre os gigantes físicos traduzidos para o digital, é hoje o mais generoso na entrega de baralhos competitivos prontos logo no início.

- **Ponto forte:** Zero microtransações diretas dentro do cliente; ótimo para treinar listas reais.
- **Ponto de atenção:** Ritmo muito focado em buscas repetidas no baralho (*tutoring*) e sem sistema de bloqueio/posicionamento tático.

---

### Qual escolher para jogar hoje?

- Se você busca **roguelite solo em app instalado**: *Legends of Runeterra*.
- Se quer **regras clássicas de pilha e tem espaço em disco/tempo de grind**: *MTG Arena*.
- Se quer **fantasia sombria, tabuleiro tático Vanguarda/Retaguarda, 1.038 cartas em português e partida instantânea no navegador (PC ou celular, zero download)**: experimente um duelo em **[Chromatic Pact](https://chromaticpact.com/?utm_source=devto_art1&utm_medium=editorial&utm_campaign=cardgames_seo)**.

Qual desses sistemas de combate e economia mais combina com o seu estilo de jogo?`,
    },
  },
  {
    id: 'devto_02_best_free_browser_tcgs_en',
    unlockAfterIso: '2026-11-10T14:00:00Z',
    matchKeywords: ['7 best free tactical card games', 'play in your browser'],
    payload: {
      title: '7 Best Free Tactical Card Games You Can Play in Your Browser (No Download, Zero Pay-to-Win)',
      description: 'Tired of 20 GB launchers and pay-to-win booster packs? Here are 7 genuinely deep tactical card games and browser TCGs playable right now.',
      tags: ['gaming', 'gamedev', 'webdev', 'indiedev'],
      series: 'Tactical Card Games & Design',
      main_image: 'https://chromaticpact.com/press/grimorio-1038-cartas.png',
      body_markdown: `Search Google for *"free browser card games"* and 95% of results are Solitaire, Uno, and Hearts. Meanwhile, if you actually want a **deep tactical Collectible Card Game (CCG/TCG)** in the vein of *Magic: The Gathering*, *Duelyst*, or *Legends of Runeterra*, most modern titles demand a 15 GB client and aggressive booster monetization.

Fortunately, modern Web engines have sparked a quiet renaissance of **instant-play tactical card games**. Here are **7 standout tactical card games** — prioritizing instant browser access, real positional depth, and fair free-to-play progression.

---

### 1. Chromatic Pact (Instant Browser — Desktop & Mobile)

![1,038 Dark Fantasy Cards in Chromatic Pact](https://chromaticpact.com/press/grimorio-1038-cartas.png)

**[Chromatic Pact](https://chromaticpact.com/?utm_source=devto_art2_en&utm_medium=editorial&utm_campaign=cardgames_seo)** is a dark-fantasy tactical card game built from day one to boot in **~2 seconds directly in your browser** (\`~460 KB\` initial payload, no download, no mandatory sign-up for your first match).

- **Tactical Hook:** Matches play out on a **6-column × 2-row battlefield** where Frontline (*Vanguard*) units physically shield Rearguard spellweavers. Sovereigns build **100-card Grimoires** across **1,038 illustrated cards** and **6 Domains**, clashing over territory with **Domain Expansions** and mid-combat creature **Ascensions**.
- **Modes & Fair Economy:** 190 single-player campaign encounters across 48 Provinces, an active global Sovereign Elo ladder, and free automated **6-round Daily Swiss Tournaments** — with zero paid booster packs.
- **Play instantly:** [Launch Chromatic Pact in Browser](https://chromaticpact.com/?utm_source=devto_art2_en&utm_medium=editorial&utm_campaign=cardgames_seo) (also on [itch.io](https://tsm81.itch.io/chromatic-pact)).

---

### 2. Duelyst II (Browser Desktop & Steam)

A faithful revival of the beloved tactical-grid CCG where card play meets miniature war-gaming.

- **Best for:** Players who love spatial puzzles, flanking, and general positioning on a full grid.

---

### 3. Talishar — Flesh and Blood Community Web Client

An open fan-built browser platform where competitive *Flesh and Blood* players test full decks without buying physical singles.

- **Best for:** Hardcore paper TCG veterans who already know *Flesh and Blood* rules inside out.

---

### 4. Netrunner via Jinteki.net (Browser)

Asymmetric cyberpunk brilliance: one player builds defended servers as a megacorporation while the other hacks in as a Runner.

- **Best for:** Bluffing, hidden information, and asymmetric deckbuilding directly in a web tab.

---

### 5. Mythgard (Steam / Mobile / Web heritage)

Created by former *Blizzard* and *Magic* veterans, Mythgard pioneered lane-based blocking and burning spare cards directly into mana/gems.

- **Best for:** Solving mana flood/screw through card-burning resource mechanics.

---

### 6. Ariokan (Browser / Indie CCG)

Known for letting players invent balanced custom cards within strict mathematical point budgets.

- **Best for:** Theorycrafters who enjoy faction customization.

---

### 7. Card Hunter (Browser / Steam)

Blends tabletop D&D dungeon crawling with card-driven movement and armor equipment decks.

- **Best for:** Co-op or solo tactical board scenarios with classic tabletop charm.

---

### Quick Takeaway

If you want to skip launchers entirely and jump straight into a **dark-fantasy lane-tactical duel** with 1,038 cards and daily Swiss cups, give **[Chromatic Pact](https://chromaticpact.com/?utm_source=devto_art2_en&utm_medium=editorial&utm_campaign=cardgames_seo)** a spin right in your browser tab.`,
    },
  },
  {
    id: 'devto_03_cardgames_navegador_pc_fraco_celular_ptbr',
    unlockAfterIso: '2026-11-13T14:00:00Z',
    matchKeywords: ['rodam direto no navegador sem baixar', 'pc fraco e celular'],
    payload: {
      title: 'Melhores Card Games de Estratégia e RPG que Rodam Direto no Navegador Sem Baixar Nada (PC e Celular)',
      description: 'Guia prático de jogos de cartas estratégicos e dark fantasy que abrem instantaneamente no Chrome, Edge ou Safari sem ocupar memória.',
      tags: ['gaming', 'webdev', 'rpg', 'gamedev'],
      series: 'Guia de Card Games Estratégicos',
      main_image: 'https://chromaticpact.com/press/mesa-combate.png',
      body_markdown: `Nem sempre você quer instalar um launcher de 18 GB no notebook de trabalho ou apagar fotos do celular só para jogar **uma partida tática de 4 minutos**.

A boa notícia é que os jogos de cartas estratégicos na Web evoluíram muito além dos passatempos casuais. Abaixo estão as melhores opções de **Card Games de Estratégia e RPG que rodam direto no navegador**, mesmo em notebooks modestos e celulares intermediários.

---

### O que diferencia um bom Card Game Web em 2026?

1. **Abertura em menos de 3 segundos:** Se uma página exige baixar centenas de megabytes de *assets* antes do menu, ela perde toda a vantagem da Web.
2. **Duelo imediato sem muro de login:** Poder testar a primeira partida como visitante antes de criar conta.
3. **Profundidade tática real:** Construção de baralho, sinergias de arquétipos e posicionamento na mesa.

---

### Destaque Dark Fantasy em Português: Chromatic Pact

Projetado especificamente para carregar em cerca de \`~460 KB\` iniciais, **[Chromatic Pact](https://chromaticpact.com/?utm_source=devto_art3&utm_medium=editorial&utm_campaign=cardgames_seo)** coloca você em duelos de fantasia sombria com **1.038 cartas em português** sem instalar nada:

- **Mesa Tática 6×2:** Coloque tanques com *Guarda* na **Vanguarda** para proteger magos e arqueiros na **Retaguarda**.
- **Sem "Zica de Mana":** A ação tática de **Canalizar (+1)** garante progressão consistente de terrenos e evita perder partidas sem conseguir jogar cartas.
- **Campanha + Competitivo:** 48 Províncias no mapa de Vaeloria (190 duelos) e **Torneios Suíços gratuitos** todos os dias (19h BRT durante a semana; 14h BRT aos sábados e domingos).

👉 **[Testar partida rápida sem download em chromaticpact.com](https://chromaticpact.com/?utm_source=devto_art3&utm_medium=editorial&utm_campaign=cardgames_seo)**

---

### Outras ótimas alternativas em aba do navegador

- **Jinteki.net (Android: Netrunner):** Pura tensão assimétrica cyberpunk (em inglês, voltado a veteranos).
- **Lorcana / Flesh and Blood via Talishar:** Excelente laboratório de treino para jogadores de TCG físico.
- **Duelyst II (Web Desktop):** Tática em tabuleiro quadriculado com estética pixel-art clássica.

Se você joga pelo celular no intervalo ou em um PC sem placa de vídeo dedicada, vale salvar esses links nos favoritos — zero instalação e estratégia pura.`,
    },
  },
  {
    id: 'devto_04_orfaos_runeterra_duelyst_posicionamento_ptbr',
    unlockAfterIso: '2026-11-16T14:00:00Z',
    matchKeywords: ['órfãos de legends of runeterra e duelyst', 'posicionamento vence'],
    payload: {
      title: 'Órfãos de Legends of Runeterra e Duelyst: 5 Card Games Onde o Posicionamento Vence a Carteira',
      description: 'Sente falta do competitivo de Runeterra ou do tabuleiro tático de Duelyst? Veja 5 alternativas gratuitas onde leitura de mesa supera gastos.',
      tags: ['gaming', 'gamedev', 'indiedev', 'rpg'],
      series: 'Guia de Card Games Estratégicos',
      main_image: 'https://chromaticpact.com/press/torneios-suicos.png',
      body_markdown: `Quem viveu o auge competitivo de **Legends of Runeterra** ou passou madrugadas calculando diagonais em **Duelyst** compartilha uma saudade muito específica: a sensação de vencer um oponente porque **você leu melhor o tabuleiro e o tempo de resposta**, não porque comprou mais pacotes raros.

Se você procura um novo lar competitivo em 2026, estes **5 jogos gratuitos** mantêm viva essa filosofia:

---

### 1. Chromatic Pact — Vanguarda, Retaguarda, Choques de Domínio e Copas Diárias

![Torneios Suíços Diários no Chromatic Pact](https://chromaticpact.com/press/torneios-suicos.png)

Em **[Chromatic Pact](https://chromaticpact.com/?utm_source=devto_art4&utm_medium=editorial&utm_campaign=cardgames_seo)**, jogar a carta certa na coluna errada custa a partida. O tabuleiro **6 colunas × 2 linhas** exige decidir constantemente quem absorve o impacto na **Vanguarda** e quem escala valor na **Retaguarda**.

Para quem sente falta de torneios acessíveis dentro do próprio jogo (como os antigos *Open Tournaments* do Runeterra), há **Torneios Suíços automatizados de 6 rodadas todos os dias** (segunda a sexta às 19h00 e sábados/domingos às 14h00 BRT), com inscrição gratuita em 1 clique e replays compartilháveis direto no turno da virada.

- **Jogar grátis no navegador:** [chromaticpact.com](https://chromaticpact.com/?utm_source=devto_art4&utm_medium=editorial&utm_campaign=cardgames_seo)

---

### 2. Duelyst II — A Grade Tática Original

Mantém a movimentação completa de unidades em tabuleiro 9×5. Ideal para quem quer xadrez tático com cartas no PC.

---

### 3. Gwent (*Gwentfinity*) — Três Rodadas e Zero Mana

Com o balanceamento votado mensalmente pela própria comunidade competitiva, continua recompensando blefe e leitura de passe como poucos jogos na história.

---

### 4. Mythgard — Queima Inteligente de Cartas e Colunas Adjacentes

Um sistema brilhante de bloqueio em colunas vizinhas que elimina compras mortas transformando cartas extras em recurso.

---

### 5. Warpforge / KARDS — Controle da Linha de Frente

Em *KARDS* (temática histórica), disputar a linha de frente central divide o combate entre agressão rápida e artilharia de longo alcance.

---

O melhor dos jogos táticos modernos é provar que **geometria de mesa + economia justa** envelhecem muito melhor do que *power creep* pago.`,
    },
  },
  {
    id: 'devto_05_problema_da_mana_game_design_ptbr',
    unlockAfterIso: '2026-11-20T14:00:00Z',
    matchKeywords: ['problema da mana', 'de magic a chromatic pact'],
    payload: {
      title: 'Game Design de TCGs: De Magic a Chromatic Pact, Como os Card Games Tentam Resolver o "Problema da Mana"',
      description: 'Análise comparativa de sistemas de recursos em card games: terrenos clássicos, mana automática, queima de cartas e canalização híbrida.',
      tags: ['gamedev', 'gaming', 'indiedev', 'rpg'],
      series: 'Guia de Card Games Estratégicos',
      main_image: 'https://chromaticpact.com/press/grimorio-1038-cartas.png',
      body_markdown: `Todo fã de card games conhece a dor: você monta um baralho impecável, entra em uma partida decisiva e passa quatro turnos seguidos comprando apenas terrenos (*mana flood*) — ou travado com duas manas na mesa enquanto a mão inteira custa quatro (*mana screw*).

Ao longo de 30 anos de design de TCGs, cada geração tentou resolver esse dilema de um jeito diferente — e cada solução cobra um preço estratégico oculto.

---

### Modelo 1: Terrenos no Baralho (*Magic: The Gathering*)
- **A genialidade:** Permite misturar cores com risco real. Um deck de 3 ou 4 cores paga com inconsistência a ambição do seu poder.
- **O efeito colateral:** Cerca de 15% a 20% das partidas sofrem de não-jogos causados puramente pela variância extrema da compra inicial.

### Modelo 2: +1 Mana Automática por Turno (*Hearthstone* / *Shadowverse*)
- **A genialidade:** Zero travamento de recurso; toda carta comprada é ação.
- **O efeito colateral:** Decks de curva agressiva e *midrange* ficam previsíveis demais, e desaparece a tensão de construir bases multicoloridas.

### Modelo 3: Reserva de Mana de Feitiço (*Legends of Runeterra*)
- **A genialidade:** Guardar até 3 pontos de mana não gastos para mágicas nos turnos seguintes premiou o jogo reativo sem precisar de cartas de terreno.

### Modelo 4: Terrenos + Canalização Tática (**Chromatic Pact**)

Quando projetamos o motor de **[Chromatic Pact](https://chromaticpact.com/?utm_source=devto_art5&utm_medium=editorial&utm_campaign=cardgames_seo)** para **Grimórios de 100 cartas** e **6 Domínios**, queríamos preservar a riqueza de construir bases elementais (*Chama, Tempestade, Abismo, Selva, Ordem*) **sem permitir que um jogador perca no turno 3 por falta de terreno**.

A solução híbrida une:
1. **Terrenos e afinidades de Domínio** que habilitam sinergias profundas e *Expansões de Domínio*;
2. **Ação de Canalizar (+1 uma vez por turno):** garante progressão fluida de energia mesmo quando a mão vem carregada de criaturas e feitiços táticos, mantendo 100% das partidas jogáveis do início ao clímax.

Se você curte estudar sistemas de regras na prática, pode testar esse ritmo em menos de 3 minutos direto no navegador: **[chromaticpact.com](https://chromaticpact.com/?utm_source=devto_art5&utm_medium=editorial&utm_campaign=cardgames_seo)**.`,
    },
  },
  {
    id: 'devto_06_dark_fantasy_campanha_solo_ptbr',
    unlockAfterIso: '2026-11-24T14:00:00Z',
    matchKeywords: ['card games dark fantasy em português', 'campanha solo'],
    payload: {
      title: '5 Card Games Dark Fantasy com Campanha Solo Profunda (Para Quem Ama RPG Sombrio e Deckbuilding)',
      description: 'Seleção de jogos de cartas com atmosfera sombria, progressão de campanha solo e construção estratégica de grimórios.',
      tags: ['gaming', 'rpg', 'gamedev', 'indiedev'],
      series: 'Guia de Card Games Estratégicos',
      main_image: 'https://chromaticpact.com/press/ranking-soberanos.png',
      body_markdown: `Nem todo jogador de cartas quer apenas filas ranqueadas frenéticas. Para quem vem de **RPG de mesa, Dark Souls, Diablo ou fantasia sombria**, conquistar um mapa, desbloquear relíquias e enfrentar comandantes com identidades próprias é metade da magia.

Estes **5 card games Dark Fantasy** entregam excelentes experiências solo e progressão temática:

---

### 1. Chromatic Pact — O Continente de Vaeloria (Grátis no Navegador, PT-BR)

Em **[Chromatic Pact](https://chromaticpact.com/?utm_source=devto_art6&utm_medium=editorial&utm_campaign=cardgames_seo)**, a campanha solo leva você por **48 Províncias e 190 confrontos contra Soberanos** espalhados pelas fronteiras abissais, florestas ancestrais e cidadelas de Vaeloria.

- Cada vitória rende ouro para expandir sua coleção entre **1.038 cartas ilustradas em português**, preparando seus Grimórios tanto para os chefes regionais quanto para o Ranking Global de Soberanos.
- **Acesso imediato (sem instalar):** [Explorar Vaeloria em chromaticpact.com](https://chromaticpact.com/?utm_source=devto_art6&utm_medium=editorial&utm_campaign=cardgames_seo)

---

### 2. Thronebreaker: The Witcher Tales (PC / Consoles)
Um RPG completo escrito pela equipe de *The Witcher 3*, onde cada batalha e dilema moral é resolvido em partidas táticas de cartas com regras sob medida.

### 3. Inscryption (PC / Consoles)
Mistura *escape room* psicológico, horror atmosférico e sacrifício de criaturas na mesa. Obrigatório para fãs de narrativa sombria.

### 4. Tainted Grail: Conquest (PC)
Fusão densa de *dark Arthurian fantasy* com construção progressiva de baralho e exploração sob névoa mortal.

### 5. Slay the Spire (PC / Mobile)
O pilar absoluto dos *deckbuilders roguelike*: simples na interface, infinito nas combinações de relíquias e maldições.`,
    },
  },
  {
    id: 'devto_07_decks_100_cartas_commander_grimorios_ptbr',
    unlockAfterIso: '2026-11-28T14:00:00Z',
    matchKeywords: ['decks de 100 cartas vs. 30 cartas', 'grimórios grandes'],
    payload: {
      title: 'Decks de 100 Cartas vs. 30 Cartas: Por Que Grimórios Grandes Deixam Card Games Muito Mais Estratégicos',
      description: 'Por que formatos de 100 cartas evitam partidas repetitivas e premiam adaptação tática em vez de combos decorados.',
      tags: ['gaming', 'gamedev', 'rpg', 'indiedev'],
      series: 'Guia de Card Games Estratégicos',
      main_image: 'https://chromaticpact.com/press/grimorio-1038-cartas.png',
      body_markdown: `Em card games de **20 ou 30 cartas** (como *Marvel Snap* ou *Hearthstone*), quase toda partida executa exatamente o mesmo roteiro nos turnos 1, 2, 3 e 4. É rápido — mas depois de vinte partidas no mesmo dia, você sente que está repetindo um fluxograma decorado.

Não é por acaso que o formato mais amado do mundo físico hoje (*Commander / EDH* no Magic) usa **100 cartas**. Veja o que muda quando um jogo digital abraça **Grimórios de 100 cartas**:

### 1. Improviso e Leitura de Mesa Superam "Receitas de Bolo"
Com 100 cartas, você não vence forçando sempre a mesma peça única: precisa construir **redundância funcional** (várias unidades de Vanguarda, remoções situacionais, motores de compra e finalizadores de Domínio) e adaptar seu plano ao que a mesa apresenta.

### 2. Espaço Para Cartas Táticas de Virada
Em decks minúsculos, qualquer carta técnica contra armadura, voo ou expansão territorial acaba cortada. Em um Grimório de 100 cartas, há espaço real para respostas criativas, Ascensões e sinergias de facção.

### 3. Onde Testar Grimórios de 100 Cartas Grátis no Navegador
Em **[Chromatic Pact](https://chromaticpact.com/?utm_source=devto_art7&utm_medium=editorial&utm_campaign=cardgames_seo)**, todos os Grimórios oficiais seguem o padrão estratégico de **100 cartas** dentro de um acervo de **1.038 cartas em português** — e você já começa com Grimórios completos prontos para duelar em 2 segundos sem baixar nada.

👉 **[Testar Grimórios de 100 cartas em chromaticpact.com](https://chromaticpact.com/?utm_source=devto_art7&utm_medium=editorial&utm_campaign=cardgames_seo)**`,
    },
  },
  {
    id: 'devto_08_torneios_suicos_card_games_ptbr',
    unlockAfterIso: '2026-12-02T14:00:00Z',
    matchKeywords: ['como funcionam torneios suíços em card games', 'copas gratuitas'],
    payload: {
      title: 'Como Funcionam Torneios Suíços em Card Games Competitivos (e Onde Jogar Copas Gratuitas Todos os Dias)',
      description: 'Entenda por que o Sistema Suíço com desempate Buchholz é o padrão ouro dos torneios de cartas e xadrez — e onde disputar edições diárias sem taxa.',
      tags: ['gaming', 'gamedev', 'webdev', 'indiedev'],
      series: 'Guia de Card Games Estratégicos',
      main_image: 'https://chromaticpact.com/press/torneios-suicos.png',
      body_markdown: `Em torneios de eliminação simples (*mata-mata*), uma única mão ruim na 1ª rodada manda você para casa após cinco minutos de evento. É por isso que tanto o **Xadrez de elite** quanto os **grandes circuitos de TCG** adotam o **Sistema Suíço**.

### Como funciona o Sistema Suíço na prática?
1. **Ninguém é eliminado na primeira derrota:** Todos jogam um número fixo de rodadas (por exemplo, **6 rodadas**).
2. **Pareamento por pontuação:** A cada rodada, jogadores com \`2–0\` enfrentam outros \`2–0\`; quem está \`1–1\` enfrenta \`1–1\`, garantindo duelos equilibrados do início ao fim.
3. **Desempate Buchholz:** Se dois jogadores terminam com \`5–1\`, fica à frente quem enfrentou adversários com campanha mais forte ao longo do torneio.

---

### Onde treinar em Torneios Suíços Gratuitos de 1 Hora?

No **[Chromatic Pact](https://chromaticpact.com/?tab=tournaments&utm_source=devto_art8&utm_medium=editorial&utm_campaign=cardgames_seo)**, estruturamos **Torneios Suíços automatizados de 6 rodadas** com ritmo oficial de **45 segundos por turno**, cabendo perfeitamente em uma janela de 60 minutos direto no navegador:

- **Segunda a Sexta:** \`19h00 BRT\`
- **Sábados e Domingos (incluindo a Grande Copa Dominical):** \`14h00 BRT\`
- **Inscrição:** 100% gratuita, com premiação em Ouro e pacotes para o Top Soberanos e súmula com replay da Mesa #1.

👉 **[Ver calendário da Arena de Torneios ao vivo](https://chromaticpact.com/?tab=tournaments&utm_source=devto_art8&utm_medium=editorial&utm_campaign=cardgames_seo)**`,
    },
  },
  {
    id: 'devto_09_lane_combat_game_design_en',
    unlockAfterIso: '2026-12-06T14:00:00Z',
    matchKeywords: ['designing 6x2 tactical lane combat', 'vanguard, rearguard'],
    payload: {
      title: 'Designing 6x2 Tactical Lane Combat in a Browser Card Game: Vanguard, Rearguard & Domain Clashes',
      description: 'How adding a front/back row grid and territorial Domain Expansions turns creature combat from simple math into spatial tactics.',
      tags: ['gamedev', 'gaming', 'webdev', 'indiedev'],
      series: 'Tactical Card Games & Design',
      main_image: 'https://chromaticpact.com/press/mesa-combate.png',
      body_markdown: `In traditional laneless card games, creatures sit in a single horizontal strip: either everything can attack face freely, or a single keyword (*Taunt* / *Defender*) stops the entire board.

When designing **[Chromatic Pact](https://chromaticpact.com/?utm_source=devto_art9_en&utm_medium=editorial&utm_campaign=cardgames_seo)**, we wanted spatial decisions on every single turn without slowing matches past 5 minutes. Here is how our **6-column × 2-row grid** shapes deckbuilding:

### 1. Vanguard Shielding & Column Geometry
Each player controls 6 columns split into **Vanguard (frontline)** and **Rearguard (backline)**. Placing an armored unit in Column 3's Vanguard physically protects fragile spellweavers or aura engines behind it — unless the opponent brings *Flying*, *Trample*, or targeted backline removal.

### 2. Domain Expansions & Territorial Clashes
Rather than static passive emblems, playing a **Domain Expansion** transforms the battlefield's elemental resonance. When the opposing Sovereign responds with a rival Domain Expansion, a **Domain Clash** triggers across the board, turning territory control into a tug-of-war.

### 3. Try It Live in 2 Seconds
Because the entire client boots in \`~460 KB\` in standard HTML5/TypeScript, you can test lane positioning immediately in your browser with zero install:
- **Play live:** [chromaticpact.com](https://chromaticpact.com/?utm_source=devto_art9_en&utm_medium=editorial&utm_campaign=cardgames_seo)`,
    },
  },
  {
    id: 'devto_10_guia_arquetipos_vanguarda_controle_ptbr',
    unlockAfterIso: '2026-12-10T14:00:00Z',
    matchKeywords: ['guia de arquétipos em card games táticos', 'vanguarda, retaguarda, controle'],
    payload: {
      title: 'Guia de Arquétipos em Card Games Táticos: Aggro de Vanguarda, Controle Territorial e Combo de Ascensão',
      description: 'Como funcionam os arquétipos clássicos de TCG (Aggro, Midrange, Controle e Tempo) quando entram em um tabuleiro de Vanguarda e Retaguarda.',
      tags: ['gaming', 'gamedev', 'rpg', 'indiedev'],
      series: 'Guia de Card Games Estratégicos',
      main_image: 'https://chromaticpact.com/press/ranking-soberanos.png',
      body_markdown: `Nos card games tradicionais, a tríade clássica é simples: **Aggro vence Controle, Controle vence Midrange, Midrange vence Aggro**. Mas o que acontece quando o jogo adiciona **colunas físicas de Vanguarda e Retaguarda** e disputa territorial de Domínio?

Veja como os 4 grandes arquétipos ganham novas camadas táticas em jogos de posicionamento como **[Chromatic Pact](https://chromaticpact.com/?utm_source=devto_art10&utm_medium=editorial&utm_campaign=cardgames_seo)**:

### 1. Aggro de Flanco (Chama / Tempestade)
Em vez de apenas despejar dano direto, o jogador agressivo abre colunas laterais vazias com unidades de *Ímpeto* e *Voo*, forçando o defensor a espalhar recursos.

### 2. Muralha & Artilharia (Ordem / Selva)
Unidades com alta **Armadura fixa (ARM)** e *Guarda* travam as colunas centrais na Vanguarda enquanto motores de valor escalam na Retaguarda sem sofrer contra-ataque.

### 3. Controle Abissal & Drenagem (Abismo)
Usa *Toque Letal*, *Drenar Vida* e remoções cirúrgicas para punir colunas sobrecarregadas antes de virar a partida com uma **Expansão de Domínio** tardia.

### 4. Evolução por Ascensão
Protege unidades-chave até cumprirem sua condição de batalha e **Ascenderem** em pleno combate para formas superiores capazes de encerrar o duelo.

Quer testar qual arquétipo combina mais com sua leitura de jogo? Os Grimórios iniciais já estão liberados gratuitamente direto no navegador: **[chromaticpact.com](https://chromaticpact.com/?utm_source=devto_art10&utm_medium=editorial&utm_campaign=cardgames_seo)**.`,
    },
  },
];

async function fetchMyDevToArticles(apiKey) {
  const res = await fetch(`${DEVTO_API}/articles/me/all?per_page=100`, {
    headers: {
      'api-key': apiKey,
      Accept: 'application/vnd.forem.api-v1+json',
      'User-Agent': 'ChromaticPactEditorialHerald/1.0',
    },
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Falha ao consultar artigos no Dev.to (${res.status}): ${txt}`);
  }
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

function findMatchingArticle(existingList, item) {
  const targetTitle = item.payload.title.trim().toLowerCase();
  return existingList.find((art) => {
    const t = String(art.title || '').trim().toLowerCase();
    if (t === targetTitle) return true;
    const combined = `${t} ${String(art.body_markdown || '').toLowerCase()}`;
    return item.matchKeywords.every((kw) => combined.includes(kw.toLowerCase()));
  });
}

async function publishDevToArticle(apiKey, payload) {
  const articleBody = {
    title: payload.title,
    published: true,
    body_markdown: payload.body_markdown,
    description: payload.description,
    tags: sanitizeTags(payload.tags),
    series: payload.series,
    main_image: payload.main_image,
  };

  const res = await fetch(`${DEVTO_API}/articles`, {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.forem.api-v1+json',
      'User-Agent': 'ChromaticPactEditorialHerald/1.0',
    },
    body: JSON.stringify({ article: articleBody }),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Falha ao publicar artigo no Dev.to (${res.status}): ${text}`);
  }
  return JSON.parse(text);
}

async function updateDevToArticle(apiKey, id, payload) {
  const articleBody = {
    title: payload.title,
    published: true,
    body_markdown: payload.body_markdown,
    description: payload.description,
    tags: sanitizeTags(payload.tags),
    series: payload.series,
    main_image: payload.main_image,
  };

  const res = await fetch(`${DEVTO_API}/articles/${id}`, {
    method: 'PUT',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.forem.api-v1+json',
      'User-Agent': 'ChromaticPactEditorialHerald/1.0',
    },
    body: JSON.stringify({ article: articleBody }),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Falha ao atualizar artigo ${id} no Dev.to (${res.status}): ${text}`);
  }
  return JSON.parse(text);
}

async function main() {
  const apiKey = (process.env.DEVTO_API_KEY || '').trim();
  const syncExisting = process.env.SYNC_EXISTING === 'true';

  if (!apiKey) {
    console.log('[DevToHerald] DEVTO_API_KEY não configurado — pulando etapa silenciosamente.');
    return;
  }

  const now = new Date();
  const existing = await fetchMyDevToArticles(apiKey);
  console.log(`[DevToHerald] Artigos existentes em @chromaticpact: ${existing.length}`);

  const publishedDates = existing
    .filter((a) => a.published && a.published_at)
    .map((a) => new Date(a.published_at).getTime())
    .filter((ts) => !Number.isNaN(ts));

  const latestPublishedMs = publishedDates.length > 0 ? Math.max(...publishedDates) : 0;
  const hoursSinceLatest = latestPublishedMs > 0 ? (now.getTime() - latestPublishedMs) / 3_600_000 : Infinity;

  let publishedNewInThisRun = false;

  for (const item of ARTICLES) {
    const unlockDate = new Date(item.unlockAfterIso);
    const matched = findMatchingArticle(existing, item);

    if (matched) {
      if (syncExisting) {
        const updated = await updateDevToArticle(apiKey, matched.id, item.payload);
        console.log(`[DevToHerald] Sincronizado (${item.id}): ${updated.url}`);
      } else {
        console.log(`[DevToHerald] Já publicado (${item.id}): ${matched.url}`);
      }
      continue;
    }

    if (now < unlockDate) {
      console.log(`[DevToHerald] ${item.id} agendado para ${item.unlockAfterIso} — aguardando janela.`);
      continue;
    }

    if (publishedNewInThisRun) {
      console.log(`[DevToHerald] Limite de 1 artigo inédito por execução atingido; ${item.id} fica para a próxima janela.`);
      continue;
    }

    if (hoursSinceLatest < MIN_HOURS_BETWEEN_ARTICLES) {
      console.log(
        `[DevToHerald] Último artigo há ${hoursSinceLatest.toFixed(1)}h (mínimo ${MIN_HOURS_BETWEEN_ARTICLES}h) — respeitando cadência editorial.`
      );
      continue;
    }

    const created = await publishDevToArticle(apiKey, item.payload);
    publishedNewInThisRun = true;
    console.log(`[DevToHerald] NOVO ARTIGO PUBLICADO (${item.id}): ${created.url}`);
  }
}

main().catch((err) => {
  console.error('[DevToHerald] Erro fatal:', err);
  process.exit(1);
});
