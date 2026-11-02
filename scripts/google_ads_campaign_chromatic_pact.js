/**
 * SCRIPT OFICIAL GOOGLE ADS (V4 — Foco em Torneios Diários às 19h + Ranking ELO + Sitelinks)
 * Campanha: Chromatic Pact — Card Game Tático Dark Fantasy
 * URL Final Principal: https://chromaticpact.com/
 * URL Torneios Diários: https://chromaticpact.com/?tab=tournaments
 * Orçamento Diário: R$ 50,00
 *
 * IMPORTANTE (Conformidade Google Ads):
 * - 100% seguro nas políticas do Google Ads: destaca Torneios Diários às 19h, Inscrição Gratuita,
 *   Ranking ELO ao Vivo, Cartas Lendárias e 1.038 cartas sem download (sem mencionar PIX/dinheiro no anúncio).
 * - Idempotente: se a campanha já existir, preserva todo o histórico e aprendizado da tag AW-16651599167,
 *   adicionando sem duplicar o anúncio atualizado no GA1, o novo GA3 de Torneios, 4 Sitelinks e ajuste +15% (16h–20h).
 */

function createCampaignShell(customerId) {
  var suffix = Math.floor(1000 + Math.random() * 9000);
  var campaignName = 'Chromatic Pact - Search Brasil #' + suffix;
  var budgetTempId = 'customers/' + customerId + '/campaignBudgets/-1';
  var campaignTempId = 'customers/' + customerId + '/campaigns/-2';

  var variants = [
    {
      label: 'ManualCPC + EU Flag',
      campaign: {
        resourceName: campaignTempId,
        name: campaignName,
        advertisingChannelType: 'SEARCH',
        status: 'ENABLED',
        campaignBudget: budgetTempId,
        manualCpc: { enhancedCpcEnabled: false },
        networkSettings: {
          targetGoogleSearch: true,
          targetSearchNetwork: true,
          targetContentNetwork: false
        },
        containsEuPoliticalAdvertising: 'DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING'
      }
    },
    {
      label: 'ManualCPC Padrão',
      campaign: {
        resourceName: campaignTempId,
        name: campaignName,
        advertisingChannelType: 'SEARCH',
        status: 'ENABLED',
        campaignBudget: budgetTempId,
        manualCpc: { enhancedCpcEnabled: false },
        networkSettings: {
          targetGoogleSearch: true,
          targetSearchNetwork: true,
          targetContentNetwork: false
        }
      }
    }
  ];

  for (var i = 0; i < variants.length; i++) {
    var v = variants[i];
    try {
      var ops = [
        {
          campaignBudgetOperation: {
            create: {
              resourceName: budgetTempId,
              name: 'Orcamento Chromatic Pact R$50 #' + suffix + '_' + i,
              amountMicros: '50000000',
              deliveryMethod: 'STANDARD',
              explicitlyShared: false
            }
          }
        },
        {
          campaignOperation: {
            create: v.campaign
          }
        }
      ];

      var res = AdsApp.mutateAll(ops);
      var ok = true;
      var errText = [];
      for (var r = 0; r < res.length; r++) {
        if (!res[r].isSuccessful()) {
          ok = false;
          errText.push(res[r].getErrorMessages().join(' | '));
        }
      }
      if (ok) {
        Logger.log('Campanha base criada com sucesso usando [' + v.label + ']: ' + campaignName);
        return campaignName;
      } else {
        Logger.log('Tentativa [' + v.label + '] recusada: ' + errText.join(' ; '));
      }
    } catch (e) {
      Logger.log('Exceção na tentativa [' + v.label + ']: ' + e);
    }
  }
  return null;
}

function getOrCreateAdGroup(campaign, name, defaultCpc) {
  var iter = campaign.adGroups()
    .withCondition("Name = '" + name + "'")
    .withCondition("Status != REMOVED")
    .get();
  if (iter.hasNext()) {
    return { adGroup: iter.next(), created: false };
  }
  var op = campaign.newAdGroupBuilder()
    .withName(name)
    .withCpc(defaultCpc)
    .withStatus('ENABLED')
    .build();
  if (op.isSuccessful()) {
    return { adGroup: op.getResult(), created: true };
  }
  return { adGroup: null, created: false };
}

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
  var added = 0;
  for (var i = 0; i < keywords.length; i++) {
    if (!existing[keywords[i].toLowerCase()]) {
      adGroup.newKeywordBuilder().withText(keywords[i]).withCpc(cpc).build();
      added++;
    }
  }
  return added;
}

function ensureCampaignSitelinks(campaign) {
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
      linkText: 'Forjar Grimório (1.038)',
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

  var createdCount = 0;
  for (var i = 0; i < sitelinkSpecs.length; i++) {
    var sp = sitelinkSpecs[i];
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
        createdCount++;
      }
    } catch (e) {
      Logger.log('Aviso ao criar Sitelink [' + sp.linkText + ']: ' + e);
    }
  }
  if (createdCount > 0) {
    Logger.log('[Sitelinks] ' + createdCount + ' extensões adicionadas à campanha.');
  }
}

function ensurePeakTournamentSchedule(campaign) {
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

  var added = 0;
  for (var i = 0; i < days.length; i++) {
    if (existingDays[days[i]]) continue;
    try {
      // +15% de ajuste de lance no horário nobre pré-torneio (16h00 às 20h00), mantendo entrega normal no restante do dia
      campaign.addAdSchedule(days[i], 16, 0, 20, 0, 1.15);
      added++;
    } catch (e) {}
  }
  if (added > 0) {
    Logger.log('[Horário Nobre 16h-20h] Ajuste de lance +15% configurado para os ' + added + ' dias da semana.');
  }
}

function main() {
  var customerId = AdsApp.currentAccount().getCustomerId().replace(/-/g, '');
  var finalUrl = 'https://chromaticpact.com/';
  var tournamentsUrl = 'https://chromaticpact.com/?tab=tournaments';

  var existingIter = AdsApp.campaigns()
    .withCondition("Name CONTAINS 'Chromatic Pact'")
    .withCondition("Status != REMOVED")
    .get();

  var campaign = null;
  if (existingIter.hasNext()) {
    campaign = existingIter.next();
    Logger.log('Campanha ativa encontrada (preservando histórico): ' + campaign.getName());
  } else {
    var createdName = createCampaignShell(customerId);
    if (!createdName) {
      Logger.log('Não foi possível criar a campanha base. Verifique a aba Registros.');
      return;
    }
    var newIter = AdsApp.campaigns()
      .withCondition("Name = '" + createdName + "'")
      .get();
    if (newIter.hasNext()) {
      campaign = newIter.next();
    } else {
      Logger.log('AVISO: Em modo Visualizar (Preview), a campanha recém-criada não aparece no seletor até clicar em "Executar".');
      return;
    }
  }

  try {
    campaign.getBudget().setAmount(50.00);
    Logger.log('Orçamento diário confirmado: R$ 50,00/dia.');
  } catch (e) {}

  try {
    campaign.addLocation(2076);
    campaign.addLanguage(1014);
    campaign.addLanguage(1000);
  } catch (e) {}

  var negatives = [
    'truco', 'poker', 'buraco', 'cacheta', 'paciencia',
    'solitaire', 'cassino', 'aposta', 'bet', 'tigrinho',
    'dinheiro real', 'renda extra', 'ganhar dinheiro', 'pix',
    'tarot', 'cigano', 'comprar cartas fisicas', 'uno'
  ];
  for (var n = 0; n < negatives.length; n++) {
    try {
      campaign.createNegativeKeyword(negatives[n]);
    } catch (e) {}
  }

  // 1. GA1 — Card Games e TCG Online (Preserva histórico e adiciona RSA V4 com Torneios Diários às 19h + 1.038 Cartas)
  var res1 = getOrCreateAdGroup(campaign, 'GA1 - Card Games e TCG Online', 2.50);
  if (res1.adGroup) {
    if (!hasRsaWithPath2(res1.adGroup, 'Torneios19h')) {
      res1.adGroup.newAd().responsiveSearchAdBuilder()
        .withFinalUrl(finalUrl)
        .withPath1('CardGame')
        .withPath2('Torneios19h')
        .withHeadlines([
          'Torneios Diários às 19h',
          'Chromatic Pact - Card Game',
          'Inscrição Grátis • Sem Baixar',
          'Suba no Ranking ELO Ao Vivo',
          'TCG Tático de Dark Fantasy',
          '1.038 Cartas Ilustradas',
          'Torneio Suíço Valendo Cartas',
          'Jogue Grátis no Navegador',
          'Monte Seu Grimório Lendário',
          'Duelos Táticos 1v1 Ao Vivo',
          'Alternativa a MTG e Yu-Gi-Oh',
          'Card Game 100% em Português'
        ])
        .withDescriptions([
          'Dispute Torneios Suíços diários às 19h valendo Cartas Lendárias. Inscrição 100% grátis!',
          'Card game tático Dark Fantasy com 1.038 cartas no navegador (PC e celular), sem baixar!',
          'Suba no Ranking ELO ao vivo, monte seu grimório em 6 domínios e desafie Grão-Soberanos!',
          'Campanha solo com 190 confrontos, duelos 1v1 e torneios diários em chromaticpact.com!'
        ])
        .build();
      Logger.log('[GA1] Novo anúncio RSA V4 (Torneios Diários às 19h + 1.038 Cartas) adicionado.');
    }

    ensureKeywordsExist(res1.adGroup, [
      '"card game online"',
      '"jogo de cartas online"',
      '"card game navegador"',
      '"tcg online gratis"',
      '"jogos tipo magic the gathering"',
      '"card game estrategia"',
      '"jogo de cartas rpg"',
      '"card game dark fantasy"',
      '[jogar card game gratis]',
      '"melhores card games pc"',
      '"deckbuilder online gratis"'
    ], 2.50);
  }

  // 2. GA2 — RPG Tático e Dark Fantasy
  var res2 = getOrCreateAdGroup(campaign, 'GA2 - RPG Tático e Dark Fantasy', 2.50);
  if (res2.adGroup) {
    if (!hasRsaWithPath2(res2.adGroup, 'Vaeloria')) {
      res2.adGroup.newAd().responsiveSearchAdBuilder()
        .withFinalUrl(finalUrl)
        .withPath1('RPG-Cartas')
        .withPath2('Vaeloria')
        .withHeadlines([
          'Chromatic Pact - RPG e Cartas',
          'Dark Fantasy Tático Online',
          'Torneios Diários às 19h',
          'Bestiário com 1.038 Cartas',
          'Jogue Grátis no Navegador',
          'Dragões, Lichs e Titãs Épicos',
          'Para Fãs de D&D e Castlevania',
          'Campanha com 190 Confrontos',
          'Suba no Ranking ELO Ao Vivo',
          'Estratégia em Turnos Online',
          'Explore a Lore de Vaeloria',
          '100% em Português e Gratuito'
        ])
        .withDescriptions([
          'Enfrente dragões, arquimagos e titãs em um Card Game tático de fantasia sombria.',
          '1.038 cartas com habilidades táticas, relíquias e armadilhas. Jogue sem baixar nada!',
          'Campanha de 190 confrontos e Torneios Suíços diários às 19h com inscrição gratuita!',
          'Acesso imediato no PC ou celular em chromaticpact.com. Comece sua jornada hoje!'
        ])
        .build();
      Logger.log('[GA2] Novo anúncio RSA V4 (1.038 Cartas + Torneios 19h) adicionado.');
    }

    ensureKeywordsExist(res2.adGroup, [
      '"jogo rpg navegador"',
      '"rpg tatico online"',
      '"jogo fantasia sombria online"',
      '"jogo de estrategia fantasia"',
      '"jogos estilo d&d online"',
      '"rpg de cartas online"',
      '"jogo estrategia turnos navegador"',
      '"dark fantasy game browser"'
    ], 2.50);
  }

  // 3. GA3 — Torneios de Card Game & Cenário Competitivo (Cai direto em ?tab=tournaments)
  var res3 = getOrCreateAdGroup(campaign, 'GA3 - Torneios de Card Game Online', 2.65);
  if (res3.adGroup) {
    if (!hasRsaWithPath2(res3.adGroup, 'As-19h')) {
      res3.adGroup.newAd().responsiveSearchAdBuilder()
        .withFinalUrl(tournamentsUrl)
        .withPath1('Torneios')
        .withPath2('As-19h')
        .withHeadlines([
          'Torneios Diários às 19h',
          'Torneio de Card Game Online',
          'Inscrição 100% Gratuita',
          'Formato Suíço Competitivo',
          'Ganhe Cartas Lendárias',
          'Ranking ELO Oficial Ao Vivo',
          'Jogue no Navegador Sem Baixar',
          'Chromatic Pact - TCG Tático',
          '1.038 Cartas • 6 Domínios',
          'Alternativa Competitiva a MTG',
          'Assista às Mesas Ao Vivo',
          'Entre Hoje na Rodada das 19h'
        ])
        .withDescriptions([
          'Participe dos Torneios Suíços todos os dias às 19h com inscrição grátis e ganhe Lendárias!',
          'Suba no Ranking ELO ao vivo em um TCG tático com 1.038 cartas direto no navegador.',
          'Monte seu grimório grátis sem baixar (PC e celular) e dispute o torneio de hoje às 19h!',
          'Acompanhe duelos em tempo real, estude replays táticos e conquiste o topo de Vaeloria.'
        ])
        .build();
      Logger.log('[GA3] Grupo competitivo e RSA de Torneios Diários às 19h criados com sucesso.');
    }

    ensureKeywordsExist(res3.adGroup, [
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

  // 4. Extensões de Sitelinks + Impulso Pré-Torneio (16h–20h +15%)
  ensureCampaignSitelinks(campaign);
  ensurePeakTournamentSchedule(campaign);

  Logger.log('=== CAMPANHA CHROMATIC PACT V4 (TORNEIOS DIÁRIOS ÀS 19H) ATUALIZADA COM SUCESSO! ===');
}
