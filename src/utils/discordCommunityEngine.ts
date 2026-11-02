import { getSupabaseConfig } from './multiplayerEngine';

export interface CommunityDiscordConfig {
  inviteUrl: string;
  webhookUrl: string;
  sundayPixBrl: number;
  pixInstructions: string;
  updatedAtMs: number;
}

const LOCAL_COMMUNITY_CONFIG_KEY = 'chromatic_pact_community_discord_v1';
const CLOUD_COMMUNITY_CONFIG_ROW = '__community_config__:global';

export const DEFAULT_COMMUNITY_DISCORD_CONFIG: CommunityDiscordConfig = {
  inviteUrl: 'https://discord.gg/nJQq56HzVW',
  webhookUrl: '',
  sundayPixBrl: 30,
  pixInstructions:
    'Envie seu protocolo de súmula no canal #premiacoes-e-suporte do Discord Oficial para resgate via PIX.',
  updatedAtMs: 0,
};

type CommunityConfigListener = (cfg: CommunityDiscordConfig) => void;
const listeners = new Set<CommunityConfigListener>();

function normalizeConfig(raw?: Partial<CommunityDiscordConfig> | null): CommunityDiscordConfig {
  const pixNum = Number(raw?.sundayPixBrl);
  return {
    inviteUrl:
      typeof raw?.inviteUrl === 'string' && raw.inviteUrl.trim()
        ? raw.inviteUrl.trim()
        : DEFAULT_COMMUNITY_DISCORD_CONFIG.inviteUrl,
    webhookUrl: typeof raw?.webhookUrl === 'string' ? raw.webhookUrl.trim() : '',
    sundayPixBrl:
      Number.isFinite(pixNum) && pixNum >= 0
        ? Math.round(pixNum)
        : DEFAULT_COMMUNITY_DISCORD_CONFIG.sundayPixBrl,
    pixInstructions:
      typeof raw?.pixInstructions === 'string' && raw.pixInstructions.trim().length > 0
        ? raw.pixInstructions.trim()
        : DEFAULT_COMMUNITY_DISCORD_CONFIG.pixInstructions,
    updatedAtMs: typeof raw?.updatedAtMs === 'number' ? raw.updatedAtMs : 0,
  };
}

export function getCommunityDiscordConfig(): CommunityDiscordConfig {
  if (typeof window === 'undefined') return DEFAULT_COMMUNITY_DISCORD_CONFIG;
  try {
    const raw = window.localStorage.getItem(LOCAL_COMMUNITY_CONFIG_KEY);
    if (!raw) return DEFAULT_COMMUNITY_DISCORD_CONFIG;
    return normalizeConfig(JSON.parse(raw) as Partial<CommunityDiscordConfig>);
  } catch {
    return DEFAULT_COMMUNITY_DISCORD_CONFIG;
  }
}

export function getConfiguredSundayPixBrl(): number {
  return getCommunityDiscordConfig().sundayPixBrl;
}

function saveLocalCommunityConfig(cfg: CommunityDiscordConfig): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(LOCAL_COMMUNITY_CONFIG_KEY, JSON.stringify(cfg));
  } catch {
    // Ignore storage quota issues
  }
  for (const fn of listeners) {
    try {
      fn(cfg);
    } catch {
      // Ignore listener errors
    }
  }
}

export function subscribeCommunityDiscordConfig(fn: CommunityConfigListener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export async function fetchCommunityDiscordConfigFromCloud(): Promise<CommunityDiscordConfig> {
  const local = getCommunityDiscordConfig();
  const supa = getSupabaseConfig();
  if (!supa.isConfigured) return local;

  try {
    const res = await fetch(
      `${supa.url}/rest/v1/sovereign_profiles?username=eq.${encodeURIComponent(
        CLOUD_COMMUNITY_CONFIG_ROW
      )}&select=title,updated_at&limit=1`,
      {
        headers: {
          apikey: supa.anonKey,
          Authorization: `Bearer ${supa.anonKey}`,
        },
      }
    );
    if (!res.ok) return local;
    const rows = (await res.json()) as Array<{ title: string; updated_at?: string }>;
    if (!rows[0]?.title) return local;
    const cloudParsed = normalizeConfig(JSON.parse(rows[0].title) as Partial<CommunityDiscordConfig>);
    if (cloudParsed.updatedAtMs >= local.updatedAtMs) {
      saveLocalCommunityConfig(cloudParsed);
      return cloudParsed;
    }
    return local;
  } catch {
    return local;
  }
}

export async function saveCommunityDiscordConfigToCloud(
  patch: Partial<CommunityDiscordConfig>
): Promise<{ ok: boolean; config: CommunityDiscordConfig; error?: string }> {
  const merged = normalizeConfig({
    ...getCommunityDiscordConfig(),
    ...patch,
    updatedAtMs: Date.now(),
  });
  saveLocalCommunityConfig(merged);

  const supa = getSupabaseConfig();
  if (!supa.isConfigured) {
    return { ok: true, config: merged };
  }

  try {
    const res = await fetch(`${supa.url}/rest/v1/sovereign_profiles?on_conflict=username`, {
      method: 'POST',
      headers: {
        apikey: supa.anonKey,
        Authorization: `Bearer ${supa.anonKey}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        username: CLOUD_COMMUNITY_CONFIG_ROW,
        title: JSON.stringify(merged),
        avatar_card_id: 'neutral_10_valkyra_pentacromatica',
        elo_rating: 1000,
        pvp_wins: 0,
        pvp_losses: 0,
        gold: 0,
        updated_at: new Date().toISOString(),
      }),
    });
    if (!res.ok) {
      return {
        ok: false,
        config: merged,
        error: `HTTP ${res.status}`,
      };
    }
    return { ok: true, config: merged };
  } catch (err) {
    return {
      ok: false,
      config: merged,
      error: err instanceof Error ? err.message : 'Falha de rede ao salvar no Supabase.',
    };
  }
}

function getCanonicalOrigin(): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    if (!window.location.origin.includes('localhost')) {
      return window.location.origin;
    }
  }
  return 'https://chromaticpact.com';
}

export async function postDiscordWebhookTestPing(
  webhookUrl: string
): Promise<{ ok: boolean; error?: string }> {
  const clean = webhookUrl.trim();
  if (!clean.startsWith('https://discord.com/api/webhooks/') && !clean.startsWith('https://discordapp.com/api/webhooks/')) {
    return { ok: false, error: 'URL inválida. Cole um Webhook oficial do Discord (https://discord.com/api/webhooks/...).' };
  }

  const origin = getCanonicalOrigin();
  const tourneyLink = `${origin}/?tab=tournaments&utm_source=discord&utm_medium=webhook&utm_campaign=conclave_boas_vindas`;

  try {
    const res = await fetch(clean, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Arauto do Conclave · Pacto Cromático',
        embeds: [
          {
            title: 'Conclave de Vaeloria Conectado',
            description:
              'Este canal receberá as convocações oficiais do **Torneio Diário de Vaeloria**, da **Grande Copa Dominical** e as súmulas homologadas com link direto para assistir às partidas no tabuleiro.',
            color: 0xd97706,
            fields: [
              {
                name: 'Agenda Oficial (Horário de Brasília)',
                value: '• **Seg a Sex:** 19h00–20h00\n• **Sáb e Dom:** 14h00–15h00',
                inline: true,
              },
              {
                name: 'Acesso Direto no Navegador',
                value: `[Entrar no Salão de Torneios](${tourneyLink})`,
                inline: true,
              },
            ],
          },
        ],
      }),
    });
    if (!res.ok) {
      return { ok: false, error: `Discord retornou HTTP ${res.status}.` };
    }
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Falha ao enviar para o Webhook do Discord.',
    };
  }
}

export async function postTournamentCallToDiscordWebhook(params: {
  webhookUrl: string;
  tournamentId: string;
  title: string;
  startsAtMs: number;
  endsAtMs: number;
  totalRounds: number;
  turnTimeLimitSec: number;
  prizeHeadline: string;
  isSundayPix?: boolean;
  cashBrl?: number;
}): Promise<{ ok: boolean; error?: string }> {
  const clean = params.webhookUrl.trim();
  if (!clean) return { ok: false, error: 'Webhook não configurado no Painel Admin.' };

  const origin = getCanonicalOrigin();
  const link = `${origin}/?tab=tournaments&tid=${encodeURIComponent(
    params.tournamentId
  )}&utm_source=discord&utm_medium=webhook&utm_campaign=torneio_chamada`;

  const startStr = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  }).format(new Date(params.startsAtMs));

  const tiersDesc = params.isSundayPix && (params.cashBrl ?? 0) > 0
    ? [
        `• **Campeão (#1):** R$ ${params.cashBrl},00 (PIX) + 1 Carta Lendária Inédita + 200 Ouro + 100 Estilhaços`,
        '• **Pódio (#2 e #3):** 1 Carta Lendária Inédita + 120 Ouro + 60 Estilhaços',
        '• **Top 4 a 8:** 1 Carta Rara Inédita + 80 Ouro + 40 Estilhaços',
        '• **Top 9 a 16 / Líder Cromático:** 75 Ouro + 50 Estilhaços',
        '• **Honra de Combate (3+ rodadas):** 40 Ouro + 25 Estilhaços',
      ].join('\n')
    : [
        '• **Campeão (#1):** 1 Carta Lendária Inédita + 150 Ouro + 80 Estilhaços',
        '• **Pódio (#2 e #3):** 1 Carta Rara Inédita + 100 Ouro + 50 Estilhaços',
        '• **Top 4 a 8:** 1 Carta Rara Inédita + 60 Ouro + 30 Estilhaços',
        '• **Top 9 a 16 / Líder Cromático:** 60 Ouro + 40 Estilhaços',
        '• **Honra de Combate (3+ rodadas):** 30 Ouro + 20 Estilhaços',
      ].join('\n');

  try {
    const res = await fetch(clean, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Arauto do Conclave · Pacto Cromático',
        embeds: [
          {
            title: `Inscrições Abertas — ${params.title}`,
            url: link,
            description: `Disputa gratuita direto no navegador (PC ou celular, sem download). Sistema Suíço de **${params.totalRounds} rodadas** (${params.turnTimeLimitSec}s/turno).`,
            color: params.isSundayPix ? 0xeab308 : 0x38bdf8,
            fields: [
              {
                name: 'Início Oficial (BRT)',
                value: startStr,
                inline: true,
              },
              {
                name: 'Destaque',
                value: params.prizeHeadline,
                inline: true,
              },
              {
                name: 'Premiação Escalonada Oficial',
                value: tiersDesc,
                inline: false,
              },
              {
                name: 'Participar Agora',
                value: `[Inscrever Grimório em 1 Clique](${link})`,
                inline: false,
              },
            ],
          },
        ],
      }),
    });
    if (!res.ok) return { ok: false, error: `Discord retornou HTTP ${res.status}.` };
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Falha ao publicar chamada no Discord.',
    };
  }
}

export async function postTournamentResultsToDiscordWebhook(params: {
  webhookUrl: string;
  tournamentId: string;
  title: string;
  totalRounds: number;
  top3: Array<{ rank: number; name: string; points: number }>;
}): Promise<{ ok: boolean; error?: string }> {
  const clean = params.webhookUrl.trim();
  if (!clean) return { ok: false, error: 'Webhook não configurado no Painel Admin.' };

  const origin = getCanonicalOrigin();
  const replayLink = `${origin}/?tid=${encodeURIComponent(
    params.tournamentId
  )}&tround=${params.totalRounds}&ttable=1&utm_source=discord&utm_medium=webhook&utm_campaign=torneio_reprise`;
  const standingsLink = `${origin}/?tab=tournaments&tid=${encodeURIComponent(
    params.tournamentId
  )}&utm_source=discord&utm_medium=webhook&utm_campaign=torneio_sumula`;

  const podiumLines = params.top3
    .map((p) => {
      const pts = Number.isInteger(p.points) ? `${p.points}.0` : p.points.toFixed(1);
      return `**#${p.rank}** — ${p.name} (${pts} pts)`;
    })
    .join('\n');

  try {
    const res = await fetch(clean, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Arauto do Conclave · Pacto Cromático',
        embeds: [
          {
            title: `Súmula Homologada — ${params.title}`,
            url: standingsLink,
            description:
              'As premiações escalonadas já estão liberadas para crédito automático nas contas participantes.',
            color: 0x10b981,
            fields: [
              {
                name: 'Pódio Oficial',
                value: podiumLines || 'Súmula encerrada.',
                inline: false,
              },
              {
                name: 'Reprise da Mesa #1 & Classificação',
                value: `[Assistir Reprise da Rodada Final](${replayLink}) · [Ver Classificação Completa](${standingsLink})`,
                inline: false,
              },
            ],
          },
        ],
      }),
    });
    if (!res.ok) return { ok: false, error: `Discord retornou HTTP ${res.status}.` };
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Falha ao publicar resultados no Discord.',
    };
  }
}

// ============================================================================
// AUTOMATIC IDEMPOTENT CLOUD HERALD (GITHUB ACTIONS CRON + IN-APP BACKUP)
// ============================================================================

const CLOUD_HERALD_LOG_ROW = '__discord_herald_log__:global';
const inMemoryHeraldSeen = new Set<string>();

async function fetchHeraldDispatchedKeysFromCloud(): Promise<string[]> {
  const supa = getSupabaseConfig();
  if (!supa.isConfigured) return Array.from(inMemoryHeraldSeen);

  try {
    const res = await fetch(
      `${supa.url}/rest/v1/sovereign_profiles?username=eq.${encodeURIComponent(
        CLOUD_HERALD_LOG_ROW
      )}&select=title&limit=1`,
      {
        headers: {
          apikey: supa.anonKey,
          Authorization: `Bearer ${supa.anonKey}`,
        },
      }
    );
    if (!res.ok) return Array.from(inMemoryHeraldSeen);
    const rows = (await res.json()) as Array<{ title?: string }>;
    if (!rows[0]?.title) return [];
    const parsed = JSON.parse(rows[0].title) as { keys?: string[] };
    const list = Array.isArray(parsed?.keys) ? parsed.keys : [];
    for (const k of list) inMemoryHeraldSeen.add(k);
    return list;
  } catch {
    return Array.from(inMemoryHeraldSeen);
  }
}

async function saveHeraldDispatchedKeyToCloud(newKey: string, existingKeys: string[]): Promise<boolean> {
  inMemoryHeraldSeen.add(newKey);
  const nextKeys = Array.from(new Set([...existingKeys, newKey])).slice(-80);
  const supa = getSupabaseConfig();
  if (!supa.isConfigured) return true;

  try {
    const res = await fetch(`${supa.url}/rest/v1/sovereign_profiles?on_conflict=username`, {
      method: 'POST',
      headers: {
        apikey: supa.anonKey,
        Authorization: `Bearer ${supa.anonKey}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        username: CLOUD_HERALD_LOG_ROW,
        title: JSON.stringify({ keys: nextKeys, updatedAtMs: Date.now() }),
        avatar_card_id: 'neutral_10_valkyra_pentacromatica',
        elo_rating: 1000,
        pvp_wins: 0,
        pvp_losses: 0,
        gold: 0,
        updated_at: new Date().toISOString(),
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function autoDispatchDiscordTournamentHerald(params: {
  webhookUrl: string;
  nowMs: number;
  tournamentId: string;
  title: string;
  startsAtMs: number;
  endsAtMs: number;
  totalRounds: number;
  turnTimeLimitSec: number;
  prizeHeadline: string;
  isSundayPix?: boolean;
  cashBrl?: number;
  phase: 'registration' | 'round_active' | 'round_break' | 'finished';
  top3: Array<{ rank: number; name: string; points: number }>;
}): Promise<'dispatched_call' | 'dispatched_results' | 'noop'> {
  const cleanWebhook = params.webhookUrl.trim();
  if (!cleanWebhook) return 'noop';

  const isCallWindow =
    params.nowMs >= params.startsAtMs - 45 * 60_000 &&
    params.nowMs < params.startsAtMs + 20 * 60_000 &&
    params.phase !== 'finished';

  const isResultsWindow =
    params.phase === 'finished' &&
    params.nowMs >= params.endsAtMs &&
    params.nowMs <= params.endsAtMs + 6 * 3600_000;

  if (!isCallWindow && !isResultsWindow) return 'noop';

  const targetKey = isResultsWindow
    ? `result::${params.tournamentId}`
    : `call::${params.tournamentId}`;

  if (inMemoryHeraldSeen.has(targetKey)) return 'noop';

  const cloudKeys = await fetchHeraldDispatchedKeysFromCloud();
  if (cloudKeys.includes(targetKey)) return 'noop';

  // Claim lock in Supabase first to prevent multi-client duplicate posts
  const locked = await saveHeraldDispatchedKeyToCloud(targetKey, cloudKeys);
  if (!locked) return 'noop';

  if (isResultsWindow) {
    const res = await postTournamentResultsToDiscordWebhook({
      webhookUrl: cleanWebhook,
      tournamentId: params.tournamentId,
      title: params.title,
      totalRounds: params.totalRounds,
      top3: params.top3,
    });
    return res.ok ? 'dispatched_results' : 'noop';
  }

  const res = await postTournamentCallToDiscordWebhook({
    webhookUrl: cleanWebhook,
    tournamentId: params.tournamentId,
    title: params.title,
    startsAtMs: params.startsAtMs,
    endsAtMs: params.endsAtMs,
    totalRounds: params.totalRounds,
    turnTimeLimitSec: params.turnTimeLimitSec,
    prizeHeadline: params.prizeHeadline,
    isSundayPix: params.isSundayPix,
    cashBrl: params.cashBrl,
  });
  return res.ok ? 'dispatched_call' : 'noop';
}
