#!/usr/bin/env node
/**
 * Provisionador Automático do Servidor Discord "Pacto Cromático · Vaeloria"
 *
 * Uso:
 *   node scripts/provisionDiscordServer.mjs <DISCORD_BOT_TOKEN> [GUILD_ID_OPCIONAL]
 *
 * O que este script faz 100% sozinho via Discord REST API v10 + Supabase:
 * 1. Verifica se o Bot já foi adicionado ao servidor (se ainda não foi, gera o link OAuth2 de 1 clique!).
 * 2. Define o nome "Pacto Cromático · Vaeloria" e envia o ícone oficial da Coroa Prismática.
 * 3. Cria as categorias OFICIAL (somente leitura para membros) e CONCLAVE (aberta aos jogadores).
 * 4. Cria os 5 canais:
 *    - #boas-vindas-e-links (posta e fixa o guia oficial com links rastreados)
 *    - #torneios-e-resultados (cria o Webhook "Arauto do Conclave" e dispara mensagem inaugural)
 *    - #chat-geral
 *    - #grimorios-e-combos
 *    - #premiacoes-e-suporte
 * 5. Gera o link de convite permanente e ilimitado (max_age: 0, max_uses: 0).
 * 6. Salva automaticamente inviteUrl + webhookUrl no Supabase (__community_config__:global),
 *    ativando o botão Discord e os disparos automáticos em chromaticpact.com na hora!
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DISCORD_API = 'https://discord.com/api/v10';

const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL || 'https://hpsrvsjcenkvikmipgik.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Uk8HZmNDvhNLHIaosigqfA_raWP3k9l';
const CLOUD_COMMUNITY_CONFIG_ROW = '__community_config__:global';

const rawToken = (process.argv[2] || process.env.DISCORD_BOT_TOKEN || '').trim();
const explicitGuildId = (process.argv[3] || process.env.DISCORD_GUILD_ID || '').trim();

if (!rawToken) {
  console.error(
    '\n[ERRO] Informe o Bot Token: node scripts/provisionDiscordServer.mjs <DISCORD_BOT_TOKEN>\n'
  );
  process.exit(1);
}

const cleanToken = rawToken.replace(/^Bot\s+/i, '');

async function discordReq(method, endpoint, body) {
  const res = await fetch(`${DISCORD_API}${endpoint}`, {
    method,
    headers: {
      Authorization: `Bot ${cleanToken}`,
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }
  if (!res.ok) {
    throw new Error(
      `Discord API ${method} ${endpoint} -> HTTP ${res.status}: ${JSON.stringify(json)}`
    );
  }
  return json;
}

function readCrownDataUri() {
  const iconPath = path.resolve(__dirname, '../public/icons/brand-coroa-prisma.png');
  if (!fs.existsSync(iconPath)) return undefined;
  const b64 = fs.readFileSync(iconPath).toString('base64');
  return `data:image/png;base64,${b64}`;
}

async function ensureCategory(guildId, existingChannels, name, permissionOverwrites = []) {
  const found = existingChannels.find(
    (c) => c.type === 4 && c.name.toLowerCase() === name.toLowerCase()
  );
  if (found) {
    return await discordReq('PATCH', `/channels/${found.id}`, {
      name,
      permission_overwrites: permissionOverwrites,
    });
  }
  return await discordReq('POST', `/guilds/${guildId}/channels`, {
    name,
    type: 4, // GUILD_CATEGORY
    permission_overwrites: permissionOverwrites,
  });
}

async function ensureTextChannel(
  guildId,
  existingChannels,
  name,
  parentId,
  topic,
  permissionOverwrites = []
) {
  const found = existingChannels.find(
    (c) => c.type === 0 && c.name.toLowerCase() === name.toLowerCase()
  );
  if (found) {
    return await discordReq('PATCH', `/channels/${found.id}`, {
      name,
      parent_id: parentId,
      topic,
      permission_overwrites: permissionOverwrites,
    });
  }
  return await discordReq('POST', `/guilds/${guildId}/channels`, {
    name,
    type: 0, // GUILD_TEXT
    parent_id: parentId,
    topic,
    permission_overwrites: permissionOverwrites,
  });
}

async function saveToSupabase(inviteUrl, webhookUrl) {
  // Read existing sundayPixBrl if present
  let sundayPixBrl = 30;
  let pixInstructions =
    'Envie seu protocolo de súmula no canal #premiacoes-e-suporte do Discord Oficial para resgate via PIX.';
  try {
    const getRes = await fetch(
      `${SUPABASE_URL}/rest/v1/sovereign_profiles?username=eq.${encodeURIComponent(
        CLOUD_COMMUNITY_CONFIG_ROW
      )}&select=title&limit=1`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );
    if (getRes.ok) {
      const rows = await getRes.json();
      if (rows?.[0]?.title) {
        const prev = JSON.parse(rows[0].title);
        if (typeof prev.sundayPixBrl === 'number') sundayPixBrl = prev.sundayPixBrl;
      }
    }
  } catch {
    // Use defaults
  }

  const payload = {
    inviteUrl,
    webhookUrl,
    sundayPixBrl,
    pixInstructions,
    updatedAtMs: Date.now(),
  };

  const res = await fetch(`${SUPABASE_URL}/rest/v1/sovereign_profiles?on_conflict=username`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates',
    },
    body: JSON.stringify({
      username: CLOUD_COMMUNITY_CONFIG_ROW,
      title: JSON.stringify(payload),
      avatar_card_id: 'neutral_10_valkyra_pentacromatica',
      elo_rating: 1000,
      pvp_wins: 0,
      pvp_losses: 0,
      gold: 0,
      updated_at: new Date().toISOString(),
    }),
  });

  if (!res.ok) {
    throw new Error(`Supabase HTTP ${res.status}: ${await res.text()}`);
  }
}

async function main() {
  console.log('1/6 Conectando ao Discord API v10...');
  const app = await discordReq('GET', '/oauth2/applications/@me');
  const botUser = await discordReq('GET', '/users/@me');
  const guilds = await discordReq('GET', '/users/@me/guilds');

  const oauthInviteLink = `https://discord.com/oauth2/authorize?client_id=${app.id}&permissions=8&scope=bot`;

  if (!Array.isArray(guilds) || guilds.length === 0) {
    console.log('\n============================================================');
    console.log('BOT CONECTADO COM SUCESSO:', `${botUser.username} (App ID: ${app.id})`);
    console.log('Falta apenas autorizar o Bot no seu servidor vazio em 1 clique:');
    console.log(oauthInviteLink);
    console.log('Depois de autorizar, rode este mesmo comando novamente!');
    console.log('============================================================\n');
    return;
  }

  const targetGuild = explicitGuildId
    ? guilds.find((g) => g.id === explicitGuildId)
    : guilds[0];

  if (!targetGuild) {
    throw new Error(
      `Servidor ${explicitGuildId} não encontrado na lista do bot. Autorize em: ${oauthInviteLink}`
    );
  }

  const guildId = targetGuild.id;
  console.log(`2/6 Configurando servidor "${targetGuild.name}" (${guildId})...`);

  const crownIcon = readCrownDataUri();
  await discordReq('PATCH', `/guilds/${guildId}`, {
    name: 'Pacto Cromático · Vaeloria',
    ...(crownIcon ? { icon: crownIcon } : {}),
  });

  const existingChannels = await discordReq('GET', `/guilds/${guildId}/channels`);

  // Permission bitflags:
  // VIEW_CHANNEL = 1024 (1 << 10)
  // SEND_MESSAGES = 2048 (1 << 11)
  // READ_MESSAGE_HISTORY = 65536 (1 << 16)
  // ADD_REACTIONS = 64 (1 << 6)
  // CREATE_PUBLIC_THREADS = 34359738368
  // CREATE_PRIVATE_THREADS = 68719476736
  const readOnlyEveryoneOverwrite = [
    {
      id: guildId, // @everyone role ID equals guildId
      type: 0,
      allow: String(1024 + 65536 + 64),
      deny: String(2048n + 34359738368n + 68719476736n),
    },
    {
      id: botUser.id,
      type: 1,
      allow: String(1024 + 2048 + 65536 + 8192 + 536870912), // View, Send, Read, Manage Messages, Manage Webhooks
      deny: '0',
    },
  ];

  console.log('3/6 Criando categorias e canais oficiais...');
  const catOficial = await ensureCategory(
    guildId,
    existingChannels,
    'OFICIAL',
    readOnlyEveryoneOverwrite
  );
  const catConclave = await ensureCategory(guildId, existingChannels, 'CONCLAVE', []);

  const chWelcome = await ensureTextChannel(
    guildId,
    existingChannels,
    'boas-vindas-e-links',
    catOficial.id,
    'Guia oficial de Vaeloria, horários dos Torneios Diários e acesso rápido no navegador.',
    readOnlyEveryoneOverwrite
  );

  const chTourneys = await ensureTextChannel(
    guildId,
    existingChannels,
    'torneios-e-resultados',
    catOficial.id,
    'Convocações automáticas e súmulas homologadas com reprises dos Torneios Diários e da Grande Copa Dominical.',
    readOnlyEveryoneOverwrite
  );

  await ensureTextChannel(
    guildId,
    existingChannels,
    'chat-geral',
    catConclave.id,
    'Conversas sobre Pacto Cromático, lore de Vaeloria e desafios 1x1 no Conclave.'
  );

  await ensureTextChannel(
    guildId,
    existingChannels,
    'grimorios-e-combos',
    catConclave.id,
    'Compartilhe links diretos de Grimórios (?deck=...) e reprises de partidas (?replay=...).'
  );

  await ensureTextChannel(
    guildId,
    existingChannels,
    'premiacoes-e-suporte',
    catConclave.id,
    'Envio de protocolos PIX da Grande Copa Dominical, dúvidas e sugestões.'
  );

  console.log('4/6 Publicando e fixando mensagem oficial de boas-vindas...');
  const existingPins = await discordReq('GET', `/channels/${chWelcome.id}/pins`);
  const alreadyPinned =
    Array.isArray(existingPins) &&
    existingPins.some((m) => m.author?.id === botUser.id && m.embeds?.length > 0);

  if (!alreadyPinned) {
    const welcomeMsg = await discordReq('POST', `/channels/${chWelcome.id}/messages`, {
      embeds: [
        {
          title: 'Bem-vindo ao Conclave Oficial — Pacto Cromático',
          description:
            'Duelos táticos de cartas 100% gratuitos direto no navegador (PC ou celular, sem download), com **1.038 cartas**, **Expansões de Domínio** e **Torneios Suíços Diários**.',
          color: 0xd97706,
          fields: [
            {
              name: 'Jogar & Inscrever-se no Torneio',
              value:
                '• [Entrar no Salão de Torneios](https://chromaticpact.com/?tab=tournaments&utm_source=discord&utm_medium=canal_fixado&utm_campaign=conclave_diario)\n• [Jogar Agora na Mesa Principal](https://chromaticpact.com/?utm_source=discord&utm_medium=canal_fixado&utm_campaign=boas_vindas)',
              inline: false,
            },
            {
              name: 'Agenda Oficial (Horário de Brasília)',
              value:
                '• **Seg a Sex (19h00–20h00):** Torneio Diário (Lendária + Raras + Ouro escalonados)\n• **Sábado (14h00–15h00):** Torneio Diário Vespertino\n• **Domingo (14h00–15h00):** Grande Copa Dominical (**PIX + Carta Lendária Inédita** + prêmios escalonados)',
              inline: false,
            },
            {
              name: 'Canais do Conclave',
              value: `• <#${chTourneys.id}> — Avisos automáticos e súmulas com link direto das reprises\n• Use **#grimorios-e-combos** para compartilhar seus baralhos de 100 cartas e jogadas no clímax!`,
              inline: false,
            },
          ],
        },
      ],
    });
    await discordReq('PUT', `/channels/${chWelcome.id}/pins/${welcomeMsg.id}`);
  }

  console.log('5/6 Gerando convite permanente e Webhook automático...');
  const invite = await discordReq('POST', `/channels/${chWelcome.id}/invites`, {
    max_age: 0,
    max_uses: 0,
    unique: false,
  });
  const inviteUrl = `https://discord.gg/${invite.code}`;

  const existingWebhooks = await discordReq('GET', `/channels/${chTourneys.id}/webhooks`);
  let webhook =
    Array.isArray(existingWebhooks) &&
    existingWebhooks.find((w) => w.name === 'Arauto do Conclave' && w.token);

  if (!webhook) {
    webhook = await discordReq('POST', `/channels/${chTourneys.id}/webhooks`, {
      name: 'Arauto do Conclave',
      ...(crownIcon ? { avatar: crownIcon } : {}),
    });
  }
  const webhookUrl = `https://discord.com/api/webhooks/${webhook.id}/${webhook.token}`;

  console.log('6/6 Salvando inviteUrl e webhookUrl diretamente no Supabase...');
  await saveToSupabase(inviteUrl, webhookUrl);

  console.log('\n============================================================');
  console.log('CONCLUÍDO 100% AUTOMATICAMENTE!');
  console.log('Servidor:        Pacto Cromático · Vaeloria');
  console.log('Convite Oficial:', inviteUrl);
  console.log('Webhook Ativo:  ', webhookUrl.slice(0, 56) + '...');
  console.log('Supabase Cloud:  SINCRONIZADO (__community_config__:global)');
  console.log('============================================================\n');
}

main().catch((err) => {
  console.error('\n[FALHA]', err.message || err);
  process.exit(1);
});
