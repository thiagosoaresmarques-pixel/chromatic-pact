/**
 * SCRIPT DE OTIMIZAÇÃO DIÁRIA AUTOMÁTICA + UPGRADE DE TORNEIOS DIÁRIOS (V2) — CHROMATIC PACT
 * Frequência recomendada no Google Ads: Diariamente (ex.: 07:00 da manhã)
 *
 * O que este script faz automaticamente:
 * 1. Auto-Upgrade Idempotente para Torneios Diários às 19h (sem zerar aprendizado):
 *    - Garante o anúncio RSA atualizado no GA1 (Torneios Diários às 19h + 1.188 Cartas),
 *    - Garante o GA3 dedicado ("GA3 - Torneios de Card Game Online" -> ?tab=tournaments),
 *    - Garante os 4 Sitelinks oficiais (Torneios às 19h, Ranking ELO, Campanha, Grimório),
 *    - Garante o impulso de +15% no horário pré-torneio (16h00 às 20h00).
 * 2. Trava de Segurança de Orçamento: Nunca passa de R$ 50,00/dia.
 * 3. Pausa de Palavras-Chave com CTR Baixo (< 1,5% após 150+ impressões).
 * 4. Ajuste Dinâmico de Lances (+12% nas campeãs, -15% nas caras de baixo CTR, +10% nas travadas).
 * 5. Blindagem Automática de Termos de Pesquisa Negativos (jogos de azar, apostas, físico, APK/mod).
 */

function hasRsaWithPath2(adGroup, path2Value) {
  var adIter = adGroup.ads()
    .withCondition("Type = RESPONSIVE_SEARCH_AD")
    .withCondition("Status != REMOVED")
    .get();
  while (adIter.hasNext()) {
    var ad = adIter.next();
    try {
      if (ad.asType().responsiveSearchAd().getPath2() === path2Value) {
        return true;
      }
    } catch (e) {}
  }
  return false;
}

function ensureKeywordsExist(adGroup, keywords, cpc) {
  var existing = {};
  var kwIter = adGroup.keywords()
    .withCondition("Status != REMOVED")
    .get();
  while (kwIter.hasNext()) {
    existing[kwIter.next().getText().toLowerCase()] = true;
  }
  for (var i = 0; i < keywords.length; i++) {
    if (!existing[keywords[i].toLowerCase()]) {
      adGroup.newKeywordBuilder().withText(keywords[i]).withCpc(cpc).build();
    }
  }
}

function ensureTournamentUpgradeApplied(campaign) {
  var finalUrl = 'https://chromaticpact.com/';
  var tournamentsUrl = 'https://chromaticpact.com/?tab=tournaments';

  // A) Adiciona RSA com foco em Torneios Diários às 19h no GA1 existente (sem apagar o RSA antigo em aprendizado)
  var ag1Iter = campaign.adGroups()
    .withCondition("Name = 'GA1 - Card Games e TCG Online'")
    .withCondition("Status != REMOVED")
    .get();
  if (ag1Iter.hasNext()) {
    var ag1 = ag1Iter.next();
    if (!hasRsaWithPath2(ag1, 'Torneios')) {
      var adOp1 = ag1.newAd().responsiveSearchAdBuilder()
        .withFinalUrl(finalUrl)
        .withPath1('CardGame')
        .withPath2('Torneios')
        .withHeadlines([
          'Torneios Diários às 19h',
          'Chromatic Pact - Card Game',
          'Inscrição Grátis no Navegador',
          'Suba no Ranking Elo Ao Vivo',
          'TCG Tático de Dark Fantasy',
          '1.188 Cartas Ilustradas',
          'Torneio Suíço Competitivo',
          'Jogue Grátis Sem Download',
          'Monte Seu Grimório Lendário',
          'Duelos Táticos 1v1 Online',
          '6 Domínios Elementais Épicos',
          'Card Game 100% em Português'
        ])
        .withDescriptions([
          'Dispute torneios suíços diários às 19h valendo cartas lendárias com inscrição gratuita.',
          'Card game tático de fantasia sombria com 1.188 cartas direto no navegador sem instalar.',
          'Suba no ranking Elo ao vivo, monte seu grimório em 6 domínios e desafie Soberanos.',
          'Campanha solo com 190 confrontos táticos, duelos 1v1 online e mesas ao vivo no PC.'
        ])
        .build();
      if (adOp1.isSuccessful()) {
        Logger.log('[Auto-Upgrade] RSA de Torneios Diários às 19h adicionado ao GA1.');
      } else {
        Logger.log('[Aviso RSA GA1]: ' + adOp1.getErrors().join(' | '));
      }
    }
  }

  // B) Garante o Grupo de Anúncios dedicado GA3 - Torneios de Card Game Online -> ?tab=tournaments
  var ag3Iter = campaign.adGroups()
    .withCondition("Name = 'GA3 - Torneios de Card Game Online'")
    .withCondition("Status != REMOVED")
    .get();
  var ag3 = null;
  if (ag3Iter.hasNext()) {
    ag3 = ag3Iter.next();
  } else {
    var ag3Op = campaign.newAdGroupBuilder()
      .withName('GA3 - Torneios de Card Game Online')
      .withCpc(2.65)
      .withStatus('ENABLED')
      .build();
    if (ag3Op.isSuccessful()) {
      ag3 = ag3Op.getResult();
      Logger.log('[Auto-Upgrade] Grupo GA3 - Torneios de Card Game Online criado.');
    }
  }

  if (ag3) {
    if (!hasRsaWithPath2(ag3, 'Diarios')) {
      var adOp3 = ag3.newAd().responsiveSearchAdBuilder()
        .withFinalUrl(tournamentsUrl)
        .withPath1('Torneios')
        .withPath2('Diarios')
        .withHeadlines([
          'Torneios Diários às 19h',
          'Torneio de Card Game Online',
          'Inscrição Gratuita Todo Dia',
          'Formato Suíço Competitivo',
          'Conquiste Cartas Lendárias',
          'Ranking Elo Oficial Ao Vivo',
          'Jogue Grátis no Navegador',
          'Chromatic Pact - Card Game',
          '1.188 Cartas em 6 Domínios',
          'Duelos Estratégicos em Turnos',
          'Assista às Mesas Ao Vivo',
          'Entre na Rodada das 19h'
        ])
        .withDescriptions([
          'Participe dos torneios suíços todos os dias às 19h com inscrição gratuita no navegador.',
          'Suba no ranking Elo ao vivo em um card game tático com 1.188 cartas ilustradas.',
          'Monte seu grimório grátis sem instalar nada no PC ou celular e dispute a rodada de hoje.',
          'Acompanhe duelos em tempo real, estude partidas táticas e conquiste cartas lendárias.'
        ])
        .build();
      if (adOp3.isSuccessful()) {
        Logger.log('[Auto-Upgrade] RSA de Torneios Diários às 19h adicionado ao GA3.');
      } else {
        Logger.log('[Aviso RSA GA3]: ' + adOp3.getErrors().join(' | '));
      }
    }
    ensureKeywordsExist(ag3, [
      '"torneio card game online"',
      '"campeonato card game"',
      '"torneio jogo de cartas online"',
      '"card game competitivo"',
      '"tcg competitivo gratis"',
      '"card game ranking online"',
      '"jogo de cartas competitivo"',
      '"torneio tcg online"',
      '"card game campeonato gratis"'
    ], 2.65);
  }

  // C) Sitelinks diretos (?tab=tournaments, ?tab=leaderboard, ?tab=campaign, ?tab=deckbuilder)
  var sitelinkSpecs = [
    {
      linkText: 'Torneios Diários às 19h',
      finalUrl: 'https://chromaticpact.com/?tab=tournaments',
      desc1: 'Inscrição 100% gratuita todo dia',
      desc2: 'Formato Suíço valendo Lendárias'
    },
    {
      linkText: 'Ranking ELO Ao Vivo',
      finalUrl: 'https://chromaticpact.com/?tab=leaderboard',
      desc1: 'Veja os duelos ao vivo na mesa',
      desc2: 'Suba de divisão na liga oficial'
    },
    {
      linkText: 'Campanha Dark Fantasy',
      finalUrl: 'https://chromaticpact.com/?tab=campaign',
      desc1: '190 confrontos táticos de história',
      desc2: 'Jogue grátis no PC ou celular'
    },
    {
      linkText: 'Forjar Grimório (1.188)',
      finalUrl: 'https://chromaticpact.com/?tab=deckbuilder',
      desc1: 'Combine 6 domínios elementais',
      desc2: 'Monte seu deck direto no navegador'
    }
  ];

  var existingTexts = {};
  try {
    var slIter = campaign.extensions().sitelinks().get();
    while (slIter.hasNext()) {
      existingTexts[slIter.next().getLinkText()] = true;
    }
  } catch (e) {}

  for (var s = 0; s < sitelinkSpecs.length; s++) {
    var sp = sitelinkSpecs[s];
    if (existingTexts[sp.linkText]) continue;
    try {
      var slOp = AdsApp.extensions().newSitelinkBuilder()
        .withLinkText(sp.linkText)
        .withFinalUrl(sp.finalUrl)
        .withDescription1(sp.desc1)
        .withDescription2(sp.desc2)
        .build();
      if (slOp.isSuccessful()) {
        campaign.addSitelink(slOp.getResult());
        Logger.log('[Auto-Upgrade] Sitelink adicionado: ' + sp.linkText);
      }
    } catch (e) {}
  }

  // D) Programação de lance +15% na janela pré-torneio (16h00 às 20h00)
  var days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  var existingDays = {};
  try {
    var schedIter = campaign.targeting().adSchedules().get();
    while (schedIter.hasNext()) {
      var sc = schedIter.next();
      if (sc.getStartHour() === 16 && sc.getEndHour() === 20) {
        existingDays[sc.getDayOfWeek()] = true;
      }
    }
  } catch (e) {}

  for (var d = 0; d < days.length; d++) {
    if (existingDays[days[d]]) continue;
    try {
      campaign.addAdSchedule(days[d], 16, 0, 20, 0, 1.15);
    } catch (e) {}
  }
}

function main() {
  var MAX_DAILY_BUDGET = 20.00;
  var MAX_CPC_CEILING = 1.20;
  var MIN_CPC_FLOOR = 0.60;
  var DEFAULT_CPC = 1.20;

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

    // 0. Garante o upgrade de Torneios Diários às 19h + Sitelinks sem perder aprendizado
    ensureTournamentUpgradeApplied(campaign);

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
      var ctr14 = s14.getCtr();

      var impr7 = s7.getImpressions();
      var clicks7 = s7.getClicks();
      var ctr7 = s7.getCtr();
      var avgCpc7 = s7.getAverageCpc();
      var cost7 = s7.getCost();

      var currentCpc = kw.bidding().getCpc();
      if (!currentCpc || currentCpc <= 0) {
        currentCpc = kw.getAdGroup().bidding().getCpc() || DEFAULT_CPC;
      }

      if (currentCpc > MAX_CPC_CEILING) {
        try {
          kw.bidding().setCpc(MAX_CPC_CEILING);
          currentCpc = MAX_CPC_CEILING;
          loweredCount++;
        } catch (e) {}
      }

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
      'cassino', 'aposta', 'bet', 'tigrinho', 'dinheiro', 'pix', 'renda extra',
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
    Logger.log('=== OTIMIZAÇÃO DIÁRIA + UPGRADE V2 CONCLUÍDOS COM SUCESSO ===');
  }
}
