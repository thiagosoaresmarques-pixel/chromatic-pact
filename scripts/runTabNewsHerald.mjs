/**
 * Arauto Cloud — Série Técnica & Sincronização Automática no TabNews (GitHub Actions)
 * 100% Idempotente e Anti-Spam:
 * - Mantém cada edição publicada sincronizada via PATCH caso o texto base seja atualizado.
 * - Desbloqueia automaticamente novas edições técnicas em janelas quinzenais (mínimo 12 dias desde o último artigo e saldo >= 2 TabCoins).
 */

const TABNEWS_API = 'https://www.tabnews.com.br/api/v1';
const MIN_DAYS_BETWEEN_EDITIONS = 12;

const EDITIONS = [
  {
    id: 'edicao_01_lancamento',
    unlockAfterIso: '2026-11-05T00:00:00Z',
    matchKeywords: ['1.038 cartas', '1.188 cartas', '460 kb', 'show tabnews: construí um card game'],
    payload: {
      title: 'Show TabNews: Construí um Card Game Tático Web com 1.188 cartas e ~460 KB de carregamento inicial (sem instalar nada)',
      source_url: 'https://chromaticpact.com/?utm_source=tabnews&utm_medium=post&utm_campaign=launch_sem1',
      status: 'published',
      body: `Olá, pessoal do TabNews!

Nos últimos meses venho construindo o **Chromatic Pact**, um híbrido de Card Game Tático e RPG Dark Fantasy projetado desde o dia zero para abrir instantaneamente na Web (desktop e mobile), sem exigir download nem barreira de cadastro para jogar.

### Desafios de Engenharia & Produto que resolvemos

1. **Carregamento inicial enxuto (\`~460 KB\` gzipped) mesmo com 1.188 cartas ilustradas:**
   Separamos o carregamento crítico da vitrine e do motor de regras em chunks sob demanda, mantendo a abertura da mesa em cerca de 2 segundos até em redes móveis.
2. **Tabuleiro Tático 6×2 (Vanguarda e Retaguarda) + Choque de Domínios:**
   Em vez de apenas somar atributos, o posicionamento em colunas protege unidades de suporte na retaguarda, enquanto *Expansões de Domínio* disputam o controle territorial do tabuleiro.
3. **Replays Determinísticos com Links de Clímax (\`?replay=...&tframe=...\`):**
   Qualquer duelo pode ser compartilhado apontando exatamente para o turno decisivo da virada, além de contarmos com Torneios Suíços automatizados todos os dias (segunda a sexta às 19h00 e sábados/domingos às 14h00 BRT, incluindo a Grande Copa Dominical) e campanha com 190 confrontos contra Soberanos.

### Teste ao vivo

- **Jogar direto no navegador:** https://chromaticpact.com/?utm_source=tabnews&utm_medium=post&utm_campaign=launch_sem1
- **Página no itch.io:** https://tsm81.itch.io/chromatic-pact

Ficarei muito feliz em ouvir críticas técnicas sobre performance no navegador, UX em telas menores, tempo de carregamento e clareza das mecânicas!`,
    },
  },
  {
    id: 'edicao_02_replays_deterministicos',
    unlockAfterIso: '2026-11-19T14:00:00Z',
    matchKeywords: ['replays determinísticos', 'tframe', 'links de clímax'],
    payload: {
      title: 'Arquitetura Web: Como implementamos Replays Determinísticos e Links de Clímax (?tframe=) em um Card Game Tático sem pesar no banco',
      source_url: 'https://chromaticpact.com/?utm_source=tabnews_ed2&utm_medium=post&utm_campaign=quinzenal_cloud',
      status: 'published',
      body: `Fala, pessoal do TabNews!

Duas semanas atrás compartilhei aqui o lançamento do **Chromatic Pact** (nosso card game tático dark fantasy que roda direto no navegador). Uma das perguntas técnicas mais legais que surgiram nos testes foi: **como permitir assistir partidas completas e compartilhar o exato turno de uma virada sem gravar vídeo nem estourar o armazenamento?**

### 1. Estados compactos por turno em vez de streaming de vídeo
Em jogos táticos de turnos (tabuleiro 6×2 com Vanguarda, Retaguarda e Choque de Domínios), gravar vídeo ou salvar snapshots completos de DOM custaria caro. Em vez disso, serializamos apenas a semente e a sequência compacta de transições de estado da partida.

### 2. Deep-link direto para o momento da virada (\`?replay=...&tframe=...\`)
Quando uma partida tem uma virada forte (como uma *Expansão de Domínio* ou *Ascensão* decisiva), o motor marca automaticamente o índice do frame de clímax. Assim, quem recebe o link abre o navegador e já cai direto naquele turno, podendo pausar, inspecionar cada carta na mesa ou continuar assistindo.

### 3. Impacto real nos Torneios Suíços Diários
Isso permitiu integrar súmulas com reprise imediata da Mesa #1 tanto nos torneios de segunda a sexta (19h00 BRT) quanto nas edições de sábado e na Grande Copa Dominical (14h00 BRT).

Para quem quiser testar na prática (abre em ~2s sem cadastro):
- **Mesa ao vivo e duelos:** https://chromaticpact.com/?utm_source=tabnews_ed2&utm_medium=post&utm_campaign=quinzenal_cloud
- **Shorts com lances táticos:** https://www.youtube.com/@ChromaticPact

Como vocês costumam lidar com auditoria de estado e replays em aplicações web interativas?`,
    },
  },
  {
    id: 'edicao_03_torneios_suicos_web',
    unlockAfterIso: '2026-12-03T14:00:00Z',
    matchKeywords: ['torneios suíços', 'pareamento', 'relógio de turno'],
    payload: {
      title: 'Como estruturamos Torneios Suíços Automatizados de 1 Hora direto no Navegador (pareamento, relógio de turno e zero fricção)',
      source_url: 'https://chromaticpact.com/?utm_source=tabnews_ed3&utm_medium=post&utm_campaign=quinzenal_cloud',
      status: 'published',
      body: `Olá, comunidade do TabNews!

Continuando os relatos técnicos de bastidores do **Chromatic Pact**, hoje queria compartilhar um desafio clássico de jogos competitivos independentes: **como organizar torneios diários com hora marcada que caibam exatamente em 1 hora de duração sem exigir juiz humano?**

### O que aprendemos calibrando janelas de 60 minutos
1. **Ritmo de 45s por turno + rodadas de 10 minutos:** Em partidas de 40 PV com Grimórios de 100 cartas, o controle *Rápido Oficial (45s/turno)* mantém média de 4 a 5 minutos por duelo e permite fechar **6 rodadas Suíças completas em 60 minutos**.
2. **Desempate Buchholz e inscrição tardia limpa:** Quem chega alguns minutos após a 1ª rodada ainda consegue ingressar sem travar a chave inteira.
3. **Calendário previsível:** Rodamos edições gratuitas de segunda a sexta às **19h00 BRT** e aos sábados e domingos às **14h00 BRT** (incluindo a Grande Copa Dominical).

Quem quiser conhecer ou entrar na próxima rodada direto pelo navegador (PC ou celular):
- **Acesso direto:** https://chromaticpact.com/?utm_source=tabnews_ed3&utm_medium=post&utm_campaign=quinzenal_cloud

Críticas e sugestões sobre formatos competitivos na Web são super bem-vindas!`,
    },
  },
];

function matchesEdition(post, edition) {
  const title = (post.title || '').toLowerCase();
  const src = (post.source_url || '').toLowerCase();
  if (src && edition.payload.source_url && src === edition.payload.source_url.toLowerCase()) {
    return true;
  }
  return edition.matchKeywords.some((kw) => title.includes(kw.toLowerCase()));
}

async function main() {
  const isDryRun = process.argv.includes('--dry-run');
  const email = (process.env.TABNEWS_EMAIL || '').trim();
  const password = (process.env.TABNEWS_PASSWORD || '').trim();

  if (!email || !password) {
    console.log('[TabNews Herald] Secrets TABNEWS_EMAIL / TABNEWS_PASSWORD ausentes. Modo diagnóstico local concluído.');
    return;
  }

  // 1. Criar sessão autenticada
  const sessionRes = await fetch(`${TABNEWS_API}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!sessionRes.ok) {
    const errText = await sessionRes.text();
    throw new Error(`Falha ao autenticar no TabNews (${sessionRes.status}): ${errText}`);
  }

  const session = await sessionRes.json();
  const cookieHeader = `session_id=${session.token}`;

  // 2. Obter dados do usuário autenticado
  const userRes = await fetch(`${TABNEWS_API}/user`, {
    headers: { Cookie: cookieHeader },
  });
  if (!userRes.ok) {
    throw new Error(`Falha ao consultar /user no TabNews (${userRes.status})`);
  }
  const user = await userRes.json();
  console.log(`[TabNews Herald] Conectado como @${user.username} (TabCoins: ${user.tabcoins})`);

  // 2B. Garantir descrição e link oficial no perfil público do TabNews
  const targetDescription =
    'Card Game Tático & RPG Dark Fantasy direto no navegador (~460 KB, 1.188 cartas em português, tabuleiro 6×2 de Vanguarda e Retaguarda e Torneios Suíços diários gratuitos).\n\nJogue sem instalar nada: https://chromaticpact.com';
  if (!isDryRun && (!user.description || !user.description.includes('chromaticpact.com'))) {
    const profPatch = await fetch(`${TABNEWS_API}/users/${user.username}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      body: JSON.stringify({ description: targetDescription }),
    });
    console.log(`[TabNews Herald] Atualização de bio/link do perfil: HTTP ${profPatch.status}`);
  }

  // 3. Consultar histórico do autor
  const existingRes = await fetch(`${TABNEWS_API}/contents/${user.username}?per_page=50`, {
    headers: { Cookie: cookieHeader },
  });
  const existingList = existingRes.ok ? await existingRes.json() : [];
  const rootPosts = Array.isArray(existingList)
    ? existingList.filter((item) => item.status === 'published' && !item.parent_id)
    : [];

  const nowMs = Date.now();

  // 3A. Sincronizar edições já publicadas caso o texto tenha recebido atualização
  for (const edition of EDITIONS) {
    const found = rootPosts.find((p) => matchesEdition(p, edition));
    if (!found) continue;

    const detailRes = await fetch(`${TABNEWS_API}/contents/${user.username}/${found.slug}`, {
      headers: { Cookie: cookieHeader },
    });
    if (detailRes.ok) {
      const detail = await detailRes.json();
      if ((detail.body || '').trim() !== edition.payload.body.trim()) {
        if (isDryRun) {
          console.log(`[TabNews Herald][DRY-RUN] Atualizaria via PATCH: ${edition.id} (${found.slug})`);
          continue;
        }
        const patchRes = await fetch(`${TABNEWS_API}/contents/${user.username}/${found.slug}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Cookie: cookieHeader,
          },
          body: JSON.stringify({
            title: edition.payload.title,
            body: edition.payload.body,
            source_url: edition.payload.source_url,
          }),
        });
        if (patchRes.ok) {
          console.log(`[TabNews Herald] ATUALIZADO VIA PATCH: https://www.tabnews.com.br/${user.username}/${found.slug}`);
        }
      }
    }
  }

  // 3B. Verificar se há próxima edição desbloqueada pela data e respeitando espaçamento anti-spam
  const latestPostMs = rootPosts.reduce((acc, p) => {
    const t = Date.parse(p.published_at || p.created_at || '');
    return Number.isFinite(t) && t > acc ? t : acc;
  }, 0);

  const daysSinceLast = latestPostMs > 0 ? (nowMs - latestPostMs) / (86400 * 1000) : 999;

  const nextDue = EDITIONS.find((edition) => {
    const alreadyPublished = rootPosts.some((p) => matchesEdition(p, edition));
    if (alreadyPublished) return false;
    return nowMs >= Date.parse(edition.unlockAfterIso);
  });

  if (!nextDue) {
    console.log('[TabNews Herald] Todas as edições liberadas até a data atual já estão publicadas e sincronizadas — noop.');
    return;
  }

  if (daysSinceLast < MIN_DAYS_BETWEEN_EDITIONS) {
    console.log(
      `[TabNews Herald] Próxima edição (${nextDue.id}) aguarda intervalo mínimo anti-spam (${daysSinceLast.toFixed(1)}d/${MIN_DAYS_BETWEEN_EDITIONS}d).`
    );
    return;
  }

  if (typeof user.tabcoins === 'number' && user.tabcoins < 1) {
    console.log(`[TabNews Herald] Saldo insuficiente de TabCoins (${user.tabcoins}) para publicar nova edição agora — aguardando engajamento orgânico.`);
    return;
  }

  if (isDryRun) {
    console.log(`[TabNews Herald][DRY-RUN] Publicaria agora: ${nextDue.id} -> ${nextDue.payload.title}`);
    return;
  }

  const pubRes = await fetch(`${TABNEWS_API}/contents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
    },
    body: JSON.stringify(nextDue.payload),
  });

  if (!pubRes.ok) {
    const errBody = await pubRes.text();
    throw new Error(`Erro ao publicar ${nextDue.id} no TabNews (${pubRes.status}): ${errBody}`);
  }

  const created = await pubRes.json();
  console.log(`[TabNews Herald] NOVA EDIÇÃO PUBLICADA: https://www.tabnews.com.br/${created.owner_username}/${created.slug}`);
}

main().catch((err) => {
  console.error('[TabNews Herald] Erro:', err.message);
  process.exit(1);
});
