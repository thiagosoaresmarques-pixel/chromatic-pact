/**
 * Arauto Cloud — Publicação & Sincronização Automática no TabNews (GitHub Actions)
 * Idempotente: consulta o histórico público do autor antes de publicar e aplica PATCH automático se o texto base mudar.
 */

const TABNEWS_API = 'https://www.tabnews.com.br/api/v1';

const POST_PAYLOAD = {
  title: 'Show TabNews: Construí um Card Game Tático Web com 1.038 cartas e ~460 KB de carregamento inicial (sem instalar nada)',
  source_url: 'https://chromaticpact.com/?utm_source=tabnews&utm_medium=post&utm_campaign=launch_sem1',
  status: 'published',
  body: `Olá, pessoal do TabNews!

Nos últimos meses venho construindo o **Chromatic Pact**, um híbrido de Card Game Tático e RPG Dark Fantasy projetado desde o dia zero para abrir instantaneamente na Web (desktop e mobile), sem exigir download nem barreira de cadastro para jogar.

### Desafios de Engenharia & Produto que resolvemos

1. **Carregamento inicial enxuto (\`~460 KB\` gzipped) mesmo com 1.038 cartas ilustradas:**
   Separamos o carregamento crítico da vitrine e do motor de regras em chunks sob demanda, mantendo a abertura da mesa em cerca de 2 segundos até em redes móveis.
2. **Tabuleiro Tático 6×2 (Vanguarda e Retaguarda) + Choque de Domínios:**
   Em vez de apenas somar atributos, o posicionamento em colunas protege unidades de suporte na retaguarda, enquanto *Expansões de Domínio* disputam o controle territorial do tabuleiro.
3. **Replays Determinísticos com Links de Clímax (\`?replay=...&tframe=...\`):**
   Qualquer duelo pode ser compartilhado apontando exatamente para o turno decisivo da virada, além de contarmos com Torneios Suíços automatizados todos os dias (segunda a sexta às 19h00 e sábados/domingos às 14h00 BRT, incluindo a Grande Copa Dominical) e campanha com 190 confrontos contra Soberanos.

### Teste ao vivo

- **Jogar direto no navegador:** https://chromaticpact.com/?utm_source=tabnews&utm_medium=post&utm_campaign=launch_sem1
- **Página no itch.io:** https://tsm81.itch.io/chromatic-pact

Ficarei muito feliz em ouvir críticas técnicas sobre performance no navegador, UX em telas menores, tempo de carregamento e clareza das mecânicas!`,
};

async function main() {
  const email = (process.env.TABNEWS_EMAIL || '').trim();
  const password = (process.env.TABNEWS_PASSWORD || '').trim();

  if (!email || !password) {
    console.log('[TabNews Herald] Secrets TABNEWS_EMAIL / TABNEWS_PASSWORD ainda não configurados. Pulando sem erro.');
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

  // 3. Checagem idempotente + sincronização de texto se houver ajuste de horários
  const existingRes = await fetch(`${TABNEWS_API}/contents/${user.username}?per_page=30`, {
    headers: { Cookie: cookieHeader },
  });
  if (existingRes.ok) {
    const existingList = await existingRes.json();
    const already = Array.isArray(existingList)
      ? existingList.find(
          (item) =>
            item.status === 'published' &&
            !item.parent_id &&
            ((item.title || '').toLowerCase().includes('card game') ||
              (item.title || '').toLowerCase().includes('chromatic pact') ||
              (item.source_url || '').includes('chromaticpact.com'))
        )
      : null;

    if (already) {
      const detailRes = await fetch(`${TABNEWS_API}/contents/${user.username}/${already.slug}`, {
        headers: { Cookie: cookieHeader },
      });
      if (detailRes.ok) {
        const detail = await detailRes.json();
        if ((detail.body || '').trim() !== POST_PAYLOAD.body.trim()) {
          const patchRes = await fetch(`${TABNEWS_API}/contents/${user.username}/${already.slug}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Cookie: cookieHeader,
            },
            body: JSON.stringify({
              title: POST_PAYLOAD.title,
              body: POST_PAYLOAD.body,
              source_url: POST_PAYLOAD.source_url,
            }),
          });
          if (patchRes.ok) {
            console.log(`[TabNews Herald] ATUALIZADO AUTOMATICAMENTE: https://www.tabnews.com.br/${user.username}/${already.slug}`);
            return;
          }
        }
      }
      console.log(
        `[TabNews Herald] Post já publicado e sincronizado: https://www.tabnews.com.br/${user.username}/${already.slug} — noop.`
      );
      return;
    }
  }

  // 4. Publicar artigo pela 1ª vez
  const pubRes = await fetch(`${TABNEWS_API}/contents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
    },
    body: JSON.stringify(POST_PAYLOAD),
  });

  if (!pubRes.ok) {
    const errBody = await pubRes.text();
    throw new Error(`Erro ao publicar no TabNews (${pubRes.status}): ${errBody}`);
  }

  const created = await pubRes.json();
  console.log(`[TabNews Herald] PUBLICADO COM SUCESSO: https://www.tabnews.com.br/${created.owner_username}/${created.slug}`);
}

main().catch((err) => {
  console.error('[TabNews Herald] Erro:', err.message);
  process.exit(1);
});
