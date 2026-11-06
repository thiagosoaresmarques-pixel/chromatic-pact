import { fetchCommunityDiscordConfigFromCloud } from '../src/utils/discordCommunityEngine';
import { fetchHydratedLiveSovereignRoster } from '../src/utils/sovereignLiveEloEngine';
import {
  computeTournamentSnapshot,
  fetchTournamentCatalogFromCloud,
  getTournamentNowMs,
} from '../src/utils/tournamentEngine';

/**
 * Boletim Semanal Automático de Vaeloria (100% Cloud via GitHub Actions)
 * - Sexta-feira (17h30 BRT): Convocação de Fim de Semana & Top 5 Soberanos em Destaque
 * - Domingo (15h25 BRT): Crônica Oficial Pós-Grande Copa Dominical & Calendário da Semana
 * - Imersão diegética total (zero menção a termos técnicos fora do universo de Vaeloria).
 */

async function main(): Promise<void> {
  const isDryRun = process.argv.includes('--dry-run');
  const forceModeArg = process.argv.find((a) => a.startsWith('--mode='));
  const forcedMode = forceModeArg ? forceModeArg.split('=')[1] : null;

  const nowMs = getTournamentNowMs();
  // Horário em Brasília (UTC-3)
  const brtDate = new Date(nowMs - 3 * 3600_000);
  const brtDay = brtDate.getUTCDay(); // 0 = Domingo, 5 = Sexta

  const mode: 'friday_warmup' | 'sunday_recap' =
    forcedMode === 'friday_warmup' || forcedMode === 'sunday_recap'
      ? forcedMode
      : brtDay === 0
        ? 'sunday_recap'
        : 'friday_warmup';

  const [sovereignsRes, catalog, discordCfg] = await Promise.all([
    fetchHydratedLiveSovereignRoster(nowMs, false),
    fetchTournamentCatalogFromCloud(),
    fetchCommunityDiscordConfigFromCloud(),
  ]);

  const top5Sovereigns = [...sovereignsRes.roster]
    .sort((a, b) => b.eloRating - a.eloRating)
    .slice(0, 5);

  const top5Lines = top5Sovereigns
    .map(
      (s, idx) =>
        `**#${idx + 1}** ${s.sovereignName} *(${s.archetypeName})* — **${Math.round(s.eloRating)}** pts`
    )
    .join('\n');

  // Localizar o torneio finalizado mais recente (ex.: Grande Copa Dominical recém-encerrada)
  const finishedRecent = catalog.tournaments
    .map((def) => {
      const entries = catalog.entriesByTournament[def.id] ?? [];
      const snap = computeTournamentSnapshot(def, entries, null, nowMs);
      return { def, snap };
    })
    .filter((item) => item.snap.phase === 'finished' && item.snap.standings.length >= 3)
    .sort((a, b) => b.def.endsAtMs - a.def.endsAtMs)[0];

  const podiumBlock = finishedRecent
    ? finishedRecent.snap.standings
        .slice(0, 3)
        .map((st) => `**#${st.rank}** ${st.displayName} — **${st.points}** pts`)
        .join('\n')
    : 'A próxima súmula oficial será consagrada ao término da rodada de hoje.';

  const embed =
    mode === 'sunday_recap'
      ? {
          title: 'Crônica Semanal de Vaeloria — Súmula da Copa & Ranking dos Soberanos',
          url: 'https://chromaticpact.com/?utm_source=discord_sunday_recap&utm_medium=herald&utm_campaign=weekly_cloud',
          color: 0xd4af37,
          description:
            'As mesas da **Grande Copa Dominical de Vaeloria** encerraram mais um ciclo de disputas territoriais. Confira os destaques da semana e prepare seu Grimório para as rodadas diárias.',
          fields: [
            {
              name: finishedRecent
                ? `Último Pódio Consagrado (${finishedRecent.def.title})`
                : 'Último Pódio Consagrado',
              value: podiumBlock,
              inline: false,
            },
            {
              name: 'Grão-Soberanos no Topo do Ranking Global',
              value: top5Lines,
              inline: false,
            },
            {
              name: 'Calendário Oficial da Nova Semana (Horário de Brasília)',
              value:
                '• **Segunda a Sexta às 19h00:** Torneio Suíço Diário de Vaeloria (6 rodadas)\n' +
                '• **Sábado e Domingo às 14h00:** Edições de Fim de Semana & Grande Copa Dominical\n' +
                '• **Lances Táticos em Vídeo:** https://www.youtube.com/@ChromaticPact',
              inline: false,
            },
          ],
          footer: {
            text: 'Chromatic Pact · Jogue direto no navegador em chromaticpact.com',
          },
          timestamp: new Date(nowMs).toISOString(),
        }
      : {
          title: 'Convocação de Fim de Semana — Torneios de Vaeloria & Grande Copa',
          url: 'https://chromaticpact.com/?utm_source=discord_friday_warmup&utm_medium=herald&utm_campaign=weekly_cloud',
          color: 0xd4af37,
          description:
            'Os portões do Conclave abrem para o fim de semana em Vaeloria. Forje seu Grimório de 100 cartas e desafie os líderes da temporada direto pelo navegador.',
          fields: [
            {
              name: 'Agenda Competitiva do Fim de Semana (BRT)',
              value:
                '• **Hoje (Sexta) às 19h00:** Torneio Suíço Noturno\n' +
                '• **Sábado às 14h00:** Torneio Suíço de Sábado\n' +
                '• **Domingo às 14h00:** Grande Copa Dominical de Vaeloria (Inscrição Gratuita)',
              inline: false,
            },
            {
              name: 'Soberanos a Bater no Topo do Ranking',
              value: top5Lines,
              inline: false,
            },
            {
              name: 'Acesso Rápido & Lances da Semana',
              value:
                '• **Entrar na Mesa:** https://chromaticpact.com/?utm_source=discord_friday_warmup&utm_medium=herald&utm_campaign=weekly_cloud\n' +
                '• **Canal Oficial (@ChromaticPact):** https://www.youtube.com/@ChromaticPact',
              inline: false,
            },
          ],
          footer: {
            text: 'Chromatic Pact · Sem download · PC & Celular',
          },
          timestamp: new Date(nowMs).toISOString(),
        };

  const payload = {
    username: 'Arauto de Vaeloria',
    embeds: [embed],
  };

  if (isDryRun) {
    console.log('[WeeklyBulletin][DRY-RUN] Payload gerado com sucesso:');
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  const webhookUrl = (
    discordCfg.webhookUrl ||
    (typeof process !== 'undefined' ? process.env.DISCORD_WEBHOOK_URL || '' : '')
  ).trim();

  if (!webhookUrl) {
    console.log('[WeeklyBulletin] Nenhum DISCORD_WEBHOOK_URL configurado — pulando envio.');
    return;
  }

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Falha ao disparar Boletim Semanal no Discord (${res.status}): ${txt}`);
  }

  console.log(`[WeeklyBulletin] Publicado com sucesso (${mode}).`);
}

void main();
