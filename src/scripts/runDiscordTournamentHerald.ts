import {
  autoDispatchDiscordTournamentHerald,
  fetchCommunityDiscordConfigFromCloud,
} from '../utils/discordCommunityEngine';
import {
  consolidateFinishedSwissTournamentLiveElo,
  fetchHydratedLiveSovereignRoster,
} from '../utils/sovereignLiveEloEngine';
import {
  computeTournamentSnapshot,
  fetchTournamentCatalogFromCloud,
  getTournamentNowMs,
} from '../utils/tournamentEngine';

async function main(): Promise<void> {
  const nowMs = getTournamentNowMs();

  // 1. Consolidate continuous Live Arena ELO checkpoints in Supabase
  await fetchHydratedLiveSovereignRoster(nowMs, true);

  const catalog = await fetchTournamentCatalogFromCloud();
  const cfg = await fetchCommunityDiscordConfigFromCloud();

  for (const def of catalog.tournaments) {
    const entries = catalog.entriesByTournament[def.id] ?? [];
    const snap = computeTournamentSnapshot(def, entries, null, nowMs);

    // 2. Consolidate finished Swiss Tournaments into Global Sovereign ELO
    if (snap.phase === 'finished' && nowMs <= def.endsAtMs + 48 * 3600_000) {
      const flatPairings = Object.values(snap.roundsPairings)
        .flat()
        .map((p) => ({
          sovereignIdA: p.playerA.sovereignEntry?.sovereignId ?? null,
          sovereignIdB: p.playerB?.sovereignEntry?.sovereignId ?? null,
          humanEloA: p.playerA.kind === 'human' ? p.playerA.eloRating : null,
          humanEloB: p.playerB?.kind === 'human' ? p.playerB.eloRating : null,
          result: p.result,
        }));
      const consolidated = await consolidateFinishedSwissTournamentLiveElo(def.id, flatPairings);
      if (consolidated) {
        console.log(`[LiveSovereignElo] Torneio consolidado no Ranking Global: ${def.id}`);
      }
    }

    // 3. Dispatch idempotent Discord Herald notifications (cloud config + env fallback)
    const effectiveWebhook = (
      cfg.webhookUrl ||
      (typeof process !== 'undefined' ? process.env.DISCORD_WEBHOOK_URL || '' : '')
    ).trim();
    if (effectiveWebhook) {
      const outcome = await autoDispatchDiscordTournamentHerald({
        webhookUrl: effectiveWebhook,
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
  }

  console.log('[DiscordHerald] Ciclo concluído.');
}

void main();
