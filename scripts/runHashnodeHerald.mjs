/**
 * Arauto Editorial Cloud — Série de Artigos sobre Card Games no Hashnode (GitHub Actions)
 * 100% Automático e Idempotente via GraphQL API oficial (https://gql.hashnode.com):
 * - Consulta a publicação oficial e os artigos já publicados para evitar duplicidade.
 * - Publica no máximo 1 artigo inédito por execução (~2 por semana, intervalo mínimo de 70h).
 * - Textos e ângulos originais complementares ao Dev.to e Medium para indexação independente no Google.
 */

const HASHNODE_GQL = 'https://gql.hashnode.com';
const MIN_HOURS_BETWEEN_POSTS = 70;

const ARTICLES = [
  {
    id: 'hn_01_top_card_games_estrategia_sem_instalar_ptbr',
    unlockAfterIso: '2026-11-08T00:00:00Z',
    slug: 'melhores-card-games-taticos-gratis-navegador-2026',
    matchKeywords: ['sem baixar 20 gb', 'guia definitivo de card games táticos'],
    title: 'Guia Definitivo de Card Games Táticos Grátis em 2026 (Para Jogar Sem Baixar 20 GB nem Gastar com Pacotes)',
    subtitle: 'Comparativo de jogos de cartas estratégicos que premiam leitura de mesa, posicionamento e construção de deck justa.',
    coverImageUrl: 'https://chromaticpact.com/press/mesa-combate.png',
    tags: [
      { slug: 'gaming', name: 'Gaming' },
      { slug: 'gamedev', name: 'Game Development' },
      { slug: 'web-development', name: 'Web Development' },
      { slug: 'indie-game', name: 'Indie Game' },
    ],
    contentMarkdown: `Para quem cresceu montando decks em **Magic: The Gathering**, calculando turnos em **Legends of Runeterra** ou disputando casas no tabuleiro de **Duelyst**, encontrar um novo card game competitivo em 2026 virou um garimpo difícil. De um lado, gigantes que exigem 20 GB de instalação e rotação cara de coleções; de outro, listas de "jogos de cartas no navegador" dominadas apenas por Paciência e Uno.

Este guia reúne os **melhores card games táticos gratuitos** disponíveis hoje para quem valoriza **profundidade real de regras, economia justa e acesso rápido**.

---

## 1. Chromatic Pact — Tabuleiro 6×2, 1.038 Cartas Dark Fantasy e Zero Download

![Combate tático 6x2 no Chromatic Pact](https://chromaticpact.com/press/mesa-combate.png)

Se a sua prioridade é **abrir uma aba no PC ou celular e estar em duelo em cerca de 2 segundos** (sem instalar launcher e sem cadastro obrigatório para testar), **[Chromatic Pact](https://chromaticpact.com/?utm_source=hashnode_art1&utm_medium=editorial&utm_campaign=cardgames_seo)** entrega um híbrido raro de TCG clássico com tática posicional:

- **Geometria de Vanguarda e Retaguarda (6×2):** Unidades posicionadas na linha de frente protegem fisicamente suportes e conjuradores atrás delas.
- **Expansões e Choques de Domínio:** Seis Domínios (*Chama, Tempestade, Abismo, Selva, Ordem e Neutro*) disputam o território ativo da mesa, somados a criaturas que **Ascendem** para formas superiores no meio da batalha.
- **Grimórios de 100 Cartas + Zero Pay-to-Win:** Toda a progressão vem de partidas rápidas, da **Campanha de Vaeloria (48 Províncias e 190 confrontos contra Soberanos)** e dos **Torneios Suíços Diários gratuitos** (segunda a sexta às \`19h00 BRT\` e sábados/domingos às \`14h00 BRT\`).

👉 **[Entrar em duelo direto no navegador: chromaticpact.com](https://chromaticpact.com/?utm_source=hashnode_art1&utm_medium=editorial&utm_campaign=cardgames_seo)**

---

## 2. Duelyst II — Xadrez Tático com Cartas

Ideal para quem busca movimentação completa em tabuleiro quadriculado no desktop, onde cercar o General adversário vale tanto quanto a curva de mana.

## 3. Legends of Runeterra — Referência em Modo Solo (*Caminho dos Campeões*)

Continua imbatível para quem quer uma campanha *roguelite* instalada no celular ou PC com excelente polimento audiovisual.

## 4. Gwent (*Gwentfinity*) — Blefe em Três Rodadas

Sem sistema de mana: você administra um orçamento finito de cartas ao longo de três rodadas, decidindo o momento exato de passar e forçar o erro do oponente.

## 5. Magic: The Gathering Arena — O Clássico Absoluto de Pilha

Para quem aceita o peso do cliente e o ritmo de coleção em troca de décadas de mecânicas e formatos como *Draft* e *Brawl*.

---

### Veredito Rápido

Quer testar agora mesmo um sistema tático em português, sem download e com torneios diários gratuitos? Abra **[chromaticpact.com](https://chromaticpact.com/?utm_source=hashnode_art1&utm_medium=editorial&utm_campaign=cardgames_seo)** e jogue sua primeira partida em menos de 3 minutos.`,
  },
  {
    id: 'hn_02_free_tactical_browser_ccgs_en',
    unlockAfterIso: '2026-11-11T14:00:00Z',
    slug: 'free-tactical-card-games-browser-like-mtg-duelyst',
    matchKeywords: ['without 20gb launchers', 'tactical browser card games'],
    title: 'Top Tactical Browser Card Games Like MTG, Runeterra & Duelyst (Without 20GB Launchers)',
    subtitle: 'Instant-play strategy CCGs featuring lane positioning, deep deckbuilding, and zero pay-to-win.',
    coverImageUrl: 'https://chromaticpact.com/press/grimorio-1038-cartas.png',
    tags: [
      { slug: 'gaming', name: 'Gaming' },
      { slug: 'gamedev', name: 'Game Development' },
      { slug: 'web-development', name: 'Web Development' },
      { slug: 'indie-game', name: 'Indie Game' },
    ],
    contentMarkdown: `Modern browser engines have quietly made 20 GB card-game launchers obsolete. If you miss positional depth like **Duelyst** or reactive turn structure like **Legends of Runeterra** and **Magic**, here are the strongest **instant-browser tactical card games** playable right now:

1. **[Chromatic Pact](https://chromaticpact.com/?utm_source=hashnode_art2_en&utm_medium=editorial&utm_campaign=cardgames_seo)** — Boots in ~2 seconds (\`~460 KB\`), featuring a **6×2 Vanguard/Rearguard battlefield**, **1,038 dark-fantasy cards**, **100-card Grimoires**, territorial **Domain Clashes**, 190 Sovereign campaign battles, and free automated **Daily Swiss Tournaments**.
2. **Duelyst II** — Full grid positioning meets classic CCG hand management.
3. **Jinteki.net (Netrunner)** — Asymmetric bluffing and hidden-information cyberwarfare in a browser tab.
4. **Talishar** — Instant web testing ground for *Flesh and Blood* enthusiasts.
5. **Card Hunter** — Tabletop tactical RPG movement powered by equipment card decks.

Jump straight into a live match with zero install at **[chromaticpact.com](https://chromaticpact.com/?utm_source=hashnode_art2_en&utm_medium=editorial&utm_campaign=cardgames_seo)**.`,
  },
  {
    id: 'hn_03_arquitetura_cardgame_460kb_web_ptbr',
    unlockAfterIso: '2026-11-15T14:00:00Z',
    slug: 'como-construimos-card-game-1038-cartas-460kb-web',
    matchKeywords: ['460 kb iniciais', '1.038 cartas ilustradas'],
    title: 'Engenharia de Jogos na Web: Como Carregar um Card Game Tático de 1.038 Cartas em ~460 KB Iniciais',
    subtitle: 'Lições práticas de performance, divisão de bundles e UX instantânea para jogos de estratégia no navegador.',
    coverImageUrl: 'https://chromaticpact.com/press/grimorio-1038-cartas.png',
    tags: [
      { slug: 'web-development', name: 'Web Development' },
      { slug: 'gamedev', name: 'Game Development' },
      { slug: 'typescript', name: 'TypeScript' },
      { slug: 'gaming', name: 'Gaming' },
    ],
    contentMarkdown: `Na Web, cada segundo extra de tela de carregamento custa metade dos jogadores curiosos. Quando projetamos **[Chromatic Pact](https://chromaticpact.com/?utm_source=hashnode_art3&utm_medium=editorial&utm_campaign=cardgames_seo)**, tínhamos um desafio claro: entregar **1.038 cartas ilustradas**, tabuleiro tático 6×2, campanha de 48 Províncias e Torneios Suíços mantendo o carregamento inicial em torno de **460 KB gzipped**.

### Os 3 Pilares que Tornaram Isso Possível

1. ** Vitrine Viva Antes do Login:** Ao abrir o site, o visitante já vê uma mesa real em andamento e entra no seu primeiro duelo em 1 clique — sem formulários bloqueando a porta.
2. **Artes WebP sob Demanda & Sprites Enxutos:** Em vez de empacotar centenas de megabytes no bundle principal, apenas as cartas presentes na mão e na mesa são decodificadas em tempo real.
3. **Replays Determinísticos Compactos (\`?replay=...&tframe=...\`):** Compartilhar o exato turno do clímax de uma partida transmite poucos kilobytes de estado, funcionando instantaneamente até em redes móveis.

Teste o tempo de abertura ao vivo no seu navegador: **[chromaticpact.com](https://chromaticpact.com/?utm_source=hashnode_art3&utm_medium=editorial&utm_campaign=cardgames_seo)**.`,
  },
  {
    id: 'hn_04_choque_dominios_vanguarda_retaguarda_ptbr',
    unlockAfterIso: '2026-11-19T14:00:00Z',
    slug: 'vanguarda-retaguarda-choque-de-dominios-card-games',
    matchKeywords: ['geometria de mesa', 'choques de domínio'],
    title: 'Além do Ataque Direto: Por Que Vanguarda, Retaguarda e Choques de Domínio Renovam os Card Games',
    subtitle: 'Como transformar o espaço físico da mesa em recurso estratégico a cada turno.',
    coverImageUrl: 'https://chromaticpact.com/press/torneios-suicos.png',
    tags: [
      { slug: 'gaming', name: 'Gaming' },
      { slug: 'gamedev', name: 'Game Development' },
      { slug: 'indie-game', name: 'Indie Game' },
    ],
    contentMarkdown: `Em muitos card games digitais, a mesa é apenas uma lista sem coordenadas: não importa se uma criatura está à esquerda ou à direita.

Em **[Chromatic Pact](https://chromaticpact.com/?utm_source=hashnode_art4&utm_medium=editorial&utm_campaign=cardgames_seo)**, cada coluna possui **Vanguarda** e **Retaguarda**:
- Posicionar um defensor com *Armadura fixa (ARM)* na Vanguarda cria um escudo físico real para unidades de suporte na mesma coluna;
- Ativar uma **Expansão de Domínio** altera as regras elementais do campo — e quando o Soberano rival responde com seu próprio Domínio, ocorre um **Choque de Domínios** pelo controle da arena.

Experimente essa dinâmica gratuitamente em **[chromaticpact.com](https://chromaticpact.com/?utm_source=hashnode_art4&utm_medium=editorial&utm_campaign=cardgames_seo)**.`,
  },
];

async function gqlRequest(token, query, variables = {}) {
  const res = await fetch(HASHNODE_GQL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (!res.ok || json.errors) {
    throw new Error(`Hashnode GraphQL error (${res.status}): ${JSON.stringify(json.errors || json)}`);
  }
  return json.data;
}

async function main() {
  const token = (process.env.HASHNODE_TOKEN || '').trim();
  let publicationId = (process.env.HASHNODE_PUBLICATION_ID || '').trim();

  if (!token) {
    console.log('[HashnodeHerald] HASHNODE_TOKEN não configurado — pulando etapa silenciosamente.');
    return;
  }

  const meData = await gqlRequest(
    token,
    `query {
      me {
        username
        publications(first: 5) {
          edges {
            node {
              id
              url
              title
              posts(first: 20) {
                edges {
                  node {
                    id
                    title
                    slug
                    url
                    publishedAt
                  }
                }
              }
            }
          }
        }
      }
    }`
  );

  const pubs = meData?.me?.publications?.edges?.map((e) => e.node) || [];
  if (pubs.length === 0) {
    console.log('[HashnodeHerald] Nenhuma publicação encontrada na conta Hashnode — crie o blog inicial uma vez.');
    return;
  }

  const targetPub = (publicationId && pubs.find((p) => p.id === publicationId)) || pubs[0];
  publicationId = targetPub.id;

  const existingPosts = (targetPub.posts?.edges || []).map((e) => e.node);
  console.log(`[HashnodeHerald] Publicação ativa: ${targetPub.url} (${existingPosts.length} artigos publicados)`);

  const now = new Date();
  const pubTimestamps = existingPosts
    .map((p) => new Date(p.publishedAt).getTime())
    .filter((ts) => !Number.isNaN(ts));
  const latestMs = pubTimestamps.length > 0 ? Math.max(...pubTimestamps) : 0;
  const hoursSinceLatest = latestMs > 0 ? (now.getTime() - latestMs) / 3_600_000 : Infinity;

  let publishedInRun = false;

  for (const art of ARTICLES) {
    const unlockDate = new Date(art.unlockAfterIso);
    const already = existingPosts.find(
      (p) =>
        p.slug === art.slug ||
        p.title.trim().toLowerCase() === art.title.trim().toLowerCase() ||
        art.matchKeywords.every((kw) => p.title.toLowerCase().includes(kw.toLowerCase()))
    );

    if (already) {
      console.log(`[HashnodeHerald] Já publicado (${art.id}): ${already.url}`);
      continue;
    }
    if (now < unlockDate) {
      console.log(`[HashnodeHerald] ${art.id} agendado para ${art.unlockAfterIso} — aguardando janela.`);
      continue;
    }
    if (publishedInRun) {
      console.log(`[HashnodeHerald] Limite de 1 artigo inédito por execução atingido; ${art.id} fica para a próxima janela.`);
      continue;
    }
    if (hoursSinceLatest < MIN_HOURS_BETWEEN_POSTS) {
      console.log(`[HashnodeHerald] Último artigo há ${hoursSinceLatest.toFixed(1)}h (mínimo ${MIN_HOURS_BETWEEN_POSTS}h) — aguardando.`);
      continue;
    }

    const pubRes = await gqlRequest(
      token,
      `mutation PublishPost($input: PublishPostInput!) {
        publishPost(input: $input) {
          post {
            id
            slug
            url
          }
        }
      }`,
      {
        input: {
          publicationId,
          title: art.title,
          subtitle: art.subtitle,
          slug: art.slug,
          contentMarkdown: art.contentMarkdown,
          coverImageOptions: art.coverImageUrl ? { coverImageURL: art.coverImageUrl } : undefined,
          tags: art.tags,
        },
      }
    );

    publishedInRun = true;
    console.log(`[HashnodeHerald] NOVO ARTIGO PUBLICADO (${art.id}): ${pubRes?.publishPost?.post?.url}`);
  }
}

main().catch((err) => {
  console.error('[HashnodeHerald] Erro fatal:', err);
  process.exit(1);
});
