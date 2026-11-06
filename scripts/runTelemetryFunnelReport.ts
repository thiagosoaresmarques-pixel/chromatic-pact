import fs from 'node:fs';
import {
  isBotOrInternalTelemetrySession,
  isEngagedVisitorSession,
  isReturningVisitorSession,
} from '../src/utils/adsTelemetry';
import {
  CloudVisitorSessionEntry,
  fetchAllCloudProfilesForAdmin,
  hashPassword,
  invokeSupabaseRpc,
} from '../src/utils/multiplayerEngine';

/**
 * Relatório Executivo Automático de Aquisição & Funil de Conversão (100% Cloud via GitHub Actions)
 * - Lê as sessões reais de telemetria gravadas no Supabase via RPC autenticado (`rpc_admin_action`).
 * - Agrupa automaticamente por origem detalhada (YouTube Shorts, TikTok, itch.io, TabNews, Reddit, Google Ads, Discord, Orgânico/Direto).
 * - Gera painel executivo em Markdown no $GITHUB_STEP_SUMMARY e (opcionalmente) envia para webhook PRIVADO administrativo
 *   (ADMIN_DISCORD_WEBHOOK_URL — jamais para o webhook público da comunidade!).
 */

interface BucketStats {
  label: string;
  sessions: number;
  engaged: number;
  totalEngagedSec: number;
  duelsStarted: number;
  victories: number;
  tournamentsJoined: number;
  accountsCreated: number;
  returning: number;
}

function classifyDetailedSource(s: CloudVisitorSessionEntry): string {
  const src = (s.utmSource || '').trim().toLowerCase();
  const med = (s.utmMedium || '').trim().toLowerCase();
  const url = (s.landingUrl || '').toLowerCase();

  if (src.startsWith('yt_short') || url.includes('utm_source=yt_short') || src.includes('youtube')) {
    return 'YouTube Shorts (@ChromaticPact)';
  }
  if (src.includes('tiktok') || src === 'tt' || url.includes('ttclid=') || url.includes('utm_source=tiktok')) {
    return 'TikTok (@ChromaticPact)';
  }
  if (src.startsWith('itchio') || url.includes('utm_source=itchio') || url.includes('itch.io')) {
    return 'itch.io (HTML5 + Devlogs)';
  }
  if (src.startsWith('tabnews') || url.includes('utm_source=tabnews')) {
    return 'TabNews (@ChromaticPact)';
  }
  if (src.startsWith('reddit') || url.includes('utm_source=reddit')) {
    return `Reddit (${src || 'orgânico'})`;
  }
  if (
    Boolean(s.gclid) ||
    src.includes('google') ||
    med === 'cpc' ||
    url.includes('gclid=') ||
    url.includes('gad_source=')
  ) {
    return 'Google Ads (Search)';
  }
  if (src.includes('discord') || url.includes('utm_source=discord')) {
    return 'Discord Oficial';
  }
  if (src) {
    return `UTM: ${src}`;
  }
  return 'Direto / Busca Orgânica';
}

function pct(num: number, den: number): string {
  if (den <= 0) return '0,0%';
  return `${((num / den) * 100).toFixed(1).replace('.', ',')}%`;
}

function fmtDuration(sec: number): string {
  if (sec <= 0) return '0s';
  if (sec < 60) return `${Math.round(sec)}s`;
  const m = Math.floor(sec / 60);
  const r = Math.round(sec % 60);
  return `${m}m${r.toString().padStart(2, '0')}s`;
}

async function fetchTelemetryFromCloud(): Promise<{
  totalRegisteredProfiles: number;
  visitorSessions: CloudVisitorSessionEntry[];
  authMode: 'admin_rpc' | 'public_fallback';
}> {
  const adminUser = (process.env.CHROMA_ADMIN_USER || 'tsm81').trim();
  const rawPass = (process.env.CHROMA_ADMIN_PASSWORD || '').trim();
  const rawHash = (process.env.CHROMA_ADMIN_PASSWORD_HASH || '').trim();
  const passwordHash = rawHash || (rawPass ? hashPassword(rawPass) : '');

  if (adminUser && passwordHash) {
    const rpcRes = await invokeSupabaseRpc<{
      ok?: boolean;
      code?: string;
      profiles?: Array<{ username?: string }>;
      telemetry?: Array<{ username: string; title: string }>;
    }>('rpc_admin_action', {
      p_admin_username: adminUser,
      p_admin_password_hash: passwordHash,
      p_action: 'fetch_dashboard',
    });

    if (rpcRes.status === 'ok' && rpcRes.data?.ok) {
      const visitorSessions: CloudVisitorSessionEntry[] = [];
      for (const tr of rpcRes.data.telemetry ?? []) {
        if (!tr.username || !tr.username.startsWith('__telemetry_session__:')) continue;
        try {
          const parsed = JSON.parse(tr.title) as CloudVisitorSessionEntry;
          if (parsed && parsed.sessionId) visitorSessions.push(parsed);
        } catch {
          // Ignore malformed telemetry row
        }
      }
      const realProfiles = (rpcRes.data.profiles ?? []).filter(
        (p) => p.username && !p.username.startsWith('__')
      );
      visitorSessions.sort((a, b) => b.lastSeenAt - a.lastSeenAt);
      return {
        totalRegisteredProfiles: realProfiles.length,
        visitorSessions,
        authMode: 'admin_rpc',
      };
    }
  }

  const fallback = await fetchAllCloudProfilesForAdmin();
  return {
    totalRegisteredProfiles: fallback.profiles.length,
    visitorSessions: fallback.visitorSessions,
    authMode: 'public_fallback',
  };
}

async function main(): Promise<void> {
  const nowMs = Date.now();
  const windowDaysArg = process.argv.find((a) => a.startsWith('--days='));
  const windowDays = windowDaysArg ? Math.max(1, Number(windowDaysArg.split('=')[1])) : 7;
  const cutoffMs = nowMs - windowDays * 86400_000;
  const cutoff24hMs = nowMs - 24 * 3600_000;

  const cloud = await fetchTelemetryFromCloud();

  if (cloud.authMode === 'public_fallback' && cloud.visitorSessions.length === 0) {
    console.log(
      '[TelemetryReport] Secret CHROMA_ADMIN_PASSWORD_HASH ainda não configurado no GitHub Secrets (RLS ativo no Supabase). Assim que configurado, os dados completos de sessões serão lidos automaticamente.'
    );
  }

  const validSessions = cloud.visitorSessions.filter(
    (s) => !isBotOrInternalTelemetrySession(s) && s.lastSeenAt >= cutoffMs
  );
  const last24hSessions = validSessions.filter((s) => s.lastSeenAt >= cutoff24hMs);

  const buckets = new Map<string, BucketStats>();
  const ensureBucket = (label: string): BucketStats => {
    let b = buckets.get(label);
    if (!b) {
      b = {
        label,
        sessions: 0,
        engaged: 0,
        totalEngagedSec: 0,
        duelsStarted: 0,
        victories: 0,
        tournamentsJoined: 0,
        accountsCreated: 0,
        returning: 0,
      };
      buckets.set(label, b);
    }
    return b;
  };

  for (const s of validSessions) {
    const label = classifyDetailedSource(s);
    const b = ensureBucket(label);
    b.sessions += 1;
    if (isEngagedVisitorSession(s)) b.engaged += 1;
    b.totalEngagedSec += Math.max(0, s.engagedSec ?? 0);

    const ev = new Set(s.events || []);
    if (ev.has('start_duel') || ev.has('start_campaign_boss') || ev.has('first_card_played')) {
      b.duelsStarted += 1;
    }
    if (ev.has('match_victory')) b.victories += 1;
    if (ev.has('join_tournament')) b.tournamentsJoined += 1;
    if (ev.has('register_account') || Boolean(s.registeredUsername)) b.accountsCreated += 1;
    if (isReturningVisitorSession(s)) b.returning += 1;
  }

  const sorted = [...buckets.values()].sort(
    (a, b) => b.duelsStarted - a.duelsStarted || b.sessions - a.sessions
  );

  const totals = sorted.reduce(
    (acc, b) => {
      acc.sessions += b.sessions;
      acc.engaged += b.engaged;
      acc.totalEngagedSec += b.totalEngagedSec;
      acc.duelsStarted += b.duelsStarted;
      acc.victories += b.victories;
      acc.tournamentsJoined += b.tournamentsJoined;
      acc.accountsCreated += b.accountsCreated;
      acc.returning += b.returning;
      return acc;
    },
    {
      sessions: 0,
      engaged: 0,
      totalEngagedSec: 0,
      duelsStarted: 0,
      victories: 0,
      tournamentsJoined: 0,
      accountsCreated: 0,
      returning: 0,
    }
  );

  const brtStamp = new Date(nowMs - 3 * 3600_000).toISOString().replace('T', ' ').slice(0, 16);
  const bestDuelChannel = [...sorted]
    .filter((b) => b.sessions >= 2)
    .sort((a, b) => b.duelsStarted / b.sessions - a.duelsStarted / a.sessions)[0];

  const mdLines: string[] = [
    `# Relatório Automático de Conversão — Chromatic Pact (${windowDays} dias)`,
    `> Gerado na nuvem em **${brtStamp} BRT** · Modo: \`${cloud.authMode}\` · Contas registradas no banco: **${cloud.totalRegisteredProfiles}** · Visitantes ativos nas últimas 24h: **${last24hSessions.length}**`,
    '',
    '## Resumo Executivo do Funil',
    `- **Visitantes únicos reais (${windowDays}d):** ${totals.sessions}`,
    `- **Sessões engajadas:** ${totals.engaged} (${pct(totals.engaged, totals.sessions)}) · Tempo médio ativo: ${fmtDuration(totals.sessions > 0 ? totals.totalEngagedSec / totals.sessions : 0)}`,
    `- **Entraram em duelo na mesa:** ${totals.duelsStarted} (${pct(totals.duelsStarted, totals.sessions)} dos visitantes)`,
    `- **Venceram ao menos 1 partida:** ${totals.victories} · **Inscritos em Torneio:** ${totals.tournamentsJoined}`,
    `- **Criaram conta permanente:** ${totals.accountsCreated} (${pct(totals.accountsCreated, totals.sessions)}) · **Retornaram em outro turno/dia:** ${totals.returning} (${pct(totals.returning, totals.sessions)})`,
    bestDuelChannel
      ? `- **Canal com melhor ativação em partida:** **${bestDuelChannel.label}** (${pct(bestDuelChannel.duelsStarted, bestDuelChannel.sessions)} iniciam duelo)`
      : '',
    '',
    '## Desempenho por Canal de Aquisição (`utm_source` / Origem)',
    '| Canal / Origem | Visitas | Engajados | Duelos (`%`) | Vitórias | Contas (`%`) | Retorno | Tempo Médio |',
    '| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |',
    ...sorted.map((b) => {
      const avgSec = b.sessions > 0 ? b.totalEngagedSec / b.sessions : 0;
      return `| **${b.label}** | ${b.sessions} | ${b.engaged} (${pct(b.engaged, b.sessions)}) | **${b.duelsStarted}** (${pct(b.duelsStarted, b.sessions)}) | ${b.victories} | **${b.accountsCreated}** (${pct(b.accountsCreated, b.sessions)}) | ${b.returning} | ${fmtDuration(avgSec)} |`;
    }),
    '',
  ].filter(Boolean);

  const markdownReport = mdLines.join('\n');
  console.log(markdownReport);

  // Gravar automaticamente no painel visual nativo do GitHub Actions ($GITHUB_STEP_SUMMARY)
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (summaryPath) {
    fs.appendFileSync(summaryPath, `${markdownReport}\n`, 'utf8');
  }

  // Envio opcional APENAS para webhook privado administrativo (nunca para o Discord público de jogadores!)
  const privateAdminWebhook = (process.env.ADMIN_DISCORD_WEBHOOK_URL || '').trim();
  if (privateAdminWebhook) {
    const topRows = sorted
      .slice(0, 8)
      .map(
        (b) =>
          `• **${b.label}**: ${b.sessions} vis · **${b.duelsStarted}** duelos (${pct(b.duelsStarted, b.sessions)}) · **${b.accountsCreated}** contas`
      )
      .join('\n');

    await fetch(privateAdminWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Telemetria Executiva Cloud',
        embeds: [
          {
            title: `Funil de Aquisição (${windowDays}d) — ${brtStamp} BRT`,
            color: 0x38bdf8,
            description:
              `**Visitas (${windowDays}d):** ${totals.sessions} *(24h: ${last24hSessions.length})* · ` +
              `**Duelos:** ${totals.duelsStarted} (${pct(totals.duelsStarted, totals.sessions)}) · ` +
              `**Contas:** ${totals.accountsCreated} (${pct(totals.accountsCreated, totals.sessions)}) · ` +
              `**Total Contas:** ${cloud.totalRegisteredProfiles}`,
            fields: [
              {
                name: 'Canais por Ativação em Duelo',
                value: topRows || 'Sem sessões no período.',
                inline: false,
              },
            ],
          },
        ],
      }),
    });
    console.log('[TelemetryReport] Enviado ao webhook administrativo privado.');
  }
}

void main();
