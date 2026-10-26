/**
 * SCRIPT DE OTIMIZAÇÃO DIÁRIA AUTOMÁTICA — CHROMATIC PACT
 * Frequência recomendada no Google Ads: Diariamente (ex.: 07:00 da manhã)
 *
 * O que este script faz automaticamente todos os dias:
 * 1. Trava de Segurança de Orçamento: Garante que o orçamento diário nunca passe de R$ 50,00.
 * 2. Pausa de Palavras-Chave com CTR Baixo: Pausa termos com >= 150 impressões e CTR < 1,5%
 *    nos últimos 14 dias (protege o Índice de Qualidade da conta).
 * 3. Ajuste Dinâmico de Lances (Bid Optimization):
 *    - Palavras-chave campeãs (CTR >= 6% e >= 3 cliques): +12% no lance (teto máx. R$ 3,50).
 *    - Palavras-chave caras com baixo retorno (CPC médio > R$ 2,60 e CTR < 3,5%): -15% no lance (piso R$ 0,80).
 *    - Palavras-chave travadas sem entrega (0 impressões quando a campanha já tem tráfego): +10% (até R$ 3,00).
 * 4. Blindagem Automática de Termos de Pesquisa (Auto-Negativação):
 *    - Varre os termos reais digitados pelos usuários nos últimos 7 dias e negativa automaticamente
 *      qualquer termo com palavras de jogos de azar/apostas/pirataria/físico ou termos com >= 100 impressões e 0 cliques.
 */

function main() {
  var MAX_DAILY_BUDGET = 50.00;
  var MAX_CPC_CEILING = 3.50;
  var MIN_CPC_FLOOR = 0.80;
  var DEFAULT_CPC = 2.50;

  var campaignIter = AdsApp.campaigns()
    .withCondition("Name CONTAINS 'Chromatic Pact'")
    .withCondition("Status = ENABLED")
    .get();

  if (!campaignIter.hasNext()) {
    Logger.log('Nenhuma campanha ativa "Chromatic Pact" encontrada.');
    return;
  }

  while (campaignIter.hasNext()) {
    var campaign = campaignIter.next();
    var campName = campaign.getName();
    var stats7d = campaign.getStatsFor('LAST_7_DAYS');
    var campImpr7d = stats7d.getImpressions();
    var campClicks7d = stats7d.getClicks();
    var campCost7d = stats7d.getCost();
    var campCtr7d = (stats7d.getCtr() * 100).toFixed(2);

    Logger.log('====================================================');
    Logger.log('Otimizando Campanha: ' + campName);
    Logger.log('Resumo 7 dias: ' + campImpr7d + ' impr | ' + campClicks7d + ' cliques | CTR ' + campCtr7d + '% | Custo R$ ' + campCost7d.toFixed(2));

    // 1. Trava de Segurança do Orçamento Diário (R$ 50,00)
    try {
      var currentBudget = campaign.getBudget().getAmount();
      if (Math.abs(currentBudget - MAX_DAILY_BUDGET) > 0.01) {
        campaign.getBudget().setAmount(MAX_DAILY_BUDGET);
        Logger.log('[Orçamento] Ajustado de R$ ' + currentBudget.toFixed(2) + ' para R$ ' + MAX_DAILY_BUDGET.toFixed(2));
      } else {
        Logger.log('[Orçamento] Confirmado em R$ ' + MAX_DAILY_BUDGET.toFixed(2) + '/dia.');
      }
    } catch (e) {
      Logger.log('[Aviso Orçamento]: ' + e);
    }

    // 2. Otimização de Palavras-Chave (Pausa por CTR baixo e Ajuste de CPC)
    var kwIter = campaign.keywords()
      .withCondition("Status = ENABLED")
      .get();

    var pausedCount = 0;
    var raisedCount = 0;
    var loweredCount = 0;
    var keptCount = 0;

    while (kwIter.hasNext()) {
      var kw = kwIter.next();
      var kwText = kw.getText();
      var s14 = kw.getStatsFor('LAST_14_DAYS');
      var s7 = kw.getStatsFor('LAST_7_DAYS');

      var impr14 = s14.getImpressions();
      var ctr14 = s14.getCtr(); // decimal (0.015 = 1.5%)

      var impr7 = s7.getImpressions();
      var clicks7 = s7.getClicks();
      var ctr7 = s7.getCtr();
      var avgCpc7 = s7.getAverageCpc();
      var cost7 = s7.getCost();

      // Obtém lance atual da palavra-chave (ou do grupo de anúncios)
      var currentCpc = kw.bidding().getCpc();
      if (!currentCpc || currentCpc <= 0) {
        currentCpc = kw.getAdGroup().bidding().getCpc() || DEFAULT_CPC;
      }

      // REGRA A: Pausar palavras-chave com muitas impressões e CTR muito baixo (< 1,5% após 150+ impressões)
      // ou alto gasto (> R$ 25 na semana) com CTR pífio (< 1,2%)
      if ((impr14 >= 150 && ctr14 < 0.015) || (cost7 >= 25.0 && ctr7 < 0.012)) {
        try {
          kw.pause();
          pausedCount++;
          Logger.log('[PAUSADA - CTR Baixo] ' + kwText + ' (Impr 14d: ' + impr14 + ', CTR: ' + (ctr14 * 100).toFixed(2) + '%, Custo 7d: R$ ' + cost7.toFixed(2) + ')');
          continue;
        } catch (e) {
          Logger.log('[Aviso ao pausar ' + kwText + ']: ' + e);
        }
      }

      // REGRA B: Palavra-chave Campeã (CTR >= 6% e pelo menos 3 cliques nos últimos 7 dias) -> Impulsiona +12% até o teto de R$ 3,50
      if (clicks7 >= 3 && ctr7 >= 0.06 && currentCpc < MAX_CPC_CEILING) {
        var boostedCpc = Math.min(MAX_CPC_CEILING, Math.round(currentCpc * 1.12 * 100) / 100);
        if (boostedCpc > currentCpc) {
          try {
            kw.bidding().setCpc(boostedCpc);
            raisedCount++;
            Logger.log('[LANCE +12% - Alta Performance] ' + kwText + ': R$ ' + currentCpc.toFixed(2) + ' -> R$ ' + boostedCpc.toFixed(2) + ' (CTR 7d: ' + (ctr7 * 100).toFixed(2) + '%)');
            continue;
          } catch (e) {}
        }
      }

      // REGRA C: Palavra-chave Cara com CTR moderado/baixo (Cliques >= 3, CPC médio > R$ 2,60 e CTR < 3,5%) -> Reduz -15% para economizar verba
      if (clicks7 >= 3 && avgCpc7 > 2.60 && ctr7 < 0.035 && currentCpc > MIN_CPC_FLOOR) {
        var reducedCpc = Math.max(MIN_CPC_FLOOR, Math.round(currentCpc * 0.85 * 100) / 100);
        if (reducedCpc < currentCpc) {
          try {
            kw.bidding().setCpc(reducedCpc);
            loweredCount++;
            Logger.log('[LANCE -15% - Economia de CPC] ' + kwText + ': R$ ' + currentCpc.toFixed(2) + ' -> R$ ' + reducedCpc.toFixed(2) + ' (CPC Médio: R$ ' + avgCpc7.toFixed(2) + ')');
            continue;
          } catch (e) {}
        }
      }

      // REGRA D: Palavra-chave sem entrega (0 impressões nos últimos 7 dias quando a campanha já tem >= 100 impressões) -> +10% até R$ 3,00
      if (campImpr7d >= 100 && impr7 === 0 && currentCpc < 3.00) {
        var nudgeCpc = Math.min(3.00, Math.round(currentCpc * 1.10 * 100) / 100);
        if (nudgeCpc > currentCpc) {
          try {
            kw.bidding().setCpc(nudgeCpc);
            raisedCount++;
            Logger.log('[LANCE +10% - Destravar Impressões] ' + kwText + ': R$ ' + currentCpc.toFixed(2) + ' -> R$ ' + nudgeCpc.toFixed(2));
            continue;
          } catch (e) {}
        }
      }

      keptCount++;
    }

    Logger.log('[Resumo Palavras-Chave] Pausadas: ' + pausedCount + ' | Lances elevados: ' + raisedCount + ' | Lances reduzidos: ' + loweredCount + ' | Mantidas: ' + keptCount);

    // 3. Mineração Automática de Termos de Pesquisa Negativos (Últimos 7 dias)
    var badTokens = [
      'truco', 'poker', 'buraco', 'cacheta', 'paciencia', 'solitaire',
      'cassino', 'aposta', 'bet', 'tigrinho', 'dinheiro', 'pix',
      'tarot', 'cigano', 'horoscopo', 'comprar', 'mercado livre',
      'shopee', 'amazon', 'pdf', 'livro', 'apk', 'mod', 'hack', 'cheat'
    ];

    var negAdded = 0;
    try {
      var report = AdsApp.report(
        "SELECT search_term_view.search_term, metrics.impressions, metrics.clicks, metrics.cost_micros " +
        "FROM search_term_view " +
        "WHERE campaign.id = " + campaign.getId() + " " +
        "AND segments.date DURING LAST_7_DAYS"
      );

      var rows = report.rows();
      while (rows.hasNext()) {
        var row = rows.next();
        var term = (row['search_term_view.search_term'] || '').toLowerCase().trim();
        var tImpr = parseInt(row['metrics.impressions'] || '0', 10);
        var tClicks = parseInt(row['metrics.clicks'] || '0', 10);

        if (!term) continue;

        var shouldNegate = false;
        var reason = '';

        for (var b = 0; b < badTokens.length; b++) {
          if (term.indexOf(badTokens[b]) !== -1) {
            shouldNegate = true;
            reason = 'Termo indesejado ("' + badTokens[b] + '")';
            break;
          }
        }

        if (!shouldNegate && tImpr >= 100 && tClicks === 0) {
          shouldNegate = true;
          reason = '100+ impressões com 0 cliques';
        }

        if (shouldNegate) {
          campaign.createNegativeKeyword('[' + term + ']');
          negAdded++;
          Logger.log('[Termo Negativado Automaticamente] [' + term + '] — Motivo: ' + reason);
        }
      }
    } catch (e) {
      Logger.log('[Aviso Relatório de Termos]: ' + e);
    }

    Logger.log('[Blindagem de Termos] ' + negAdded + ' novos termos negativados hoje.');
    Logger.log('=== OTIMIZAÇÃO DIÁRIA CONCLUÍDA COM SUCESSO ===');
  }
}
