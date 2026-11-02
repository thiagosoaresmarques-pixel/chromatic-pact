import {
  autoDispatchDiscordTournamentHerald,
  fetchCommunityDiscordConfigFromCloud,
} from '../utils/discordCommunityEngine';
import {
  computeTournamentSnapshot,
  fetchTournamentCatalogFromCloud,
  getTournamentNowMs,
} from '../utils/tournamentEngine';

async function main(): Promise<void> {
  const cfg = await fetchCommunityDiscordConfigFromCloud();
  if (!cfg.webhookUrl.trim()) {
    console.log('[DiscordHerald] Webhook não configurado em __community_config__:global. Encerrando sem ação.');
    return;
  }

  const catalog = await fetchTournamentCatalogFromCloud();
  const nowMs = getTournamentNowMs();

  for (const def of catalog.tournaments) {
    const entries = catalog.entriesByTournament[def.id] ?? [];
    const snap = computeTournamentSnapshot(def, entries, null, nowMs);
    const outcome = await autoDispatchDiscordTournamentHerald({
      webhookUrl: cfg.webhookUrl,
      nowMs,
      tournamentId: def.id,
      title: def.title,
      startsAtMs: def.startsAtMs,
      endsAtMs: def.endsAtMs,
      totalRounds: def.totalRounds,
      turnTimeLimitSec: def.turnTimeLimitSec,
      prizeHeadline: def.prizeSpec.label,
      isSundayPix: def.prizeSpec.kind === 'cash_brl_pix',
      cashBrl: def.prizeSpec.cashBrl,
      phase: snap.phase,
      top3: snap.standings.slice(0, 3).map((s) => ({
        rank: s.rank,
        name: s.displayName,
        points: s.points,
      })),
    });

    if (outcome !== 'noop') {
      console.log(`[DiscordHerald] ${outcome} -> ${def.id} (${def.title})`);
    }
  }

  console.log('[DiscordHerald] Ciclo concluído.');
}

void main();
