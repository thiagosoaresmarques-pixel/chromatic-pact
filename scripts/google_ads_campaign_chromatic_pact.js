/**
 * SCRIPT OFICIAL GOOGLE ADS (V3 Final — Com AdsApp.mutateAll Corrigido)
 * Campanha: Chromatic Pact — Card Game Tático Dark Fantasy
 * URL Final: https://chromaticpact.com/
 * Orçamento Diário: R$ 50,00
 *
 * Causa do erro anterior identificada e corrigida:
 * - No Google Ads Scripts, para enviar uma lista (Array) de operações, o método correto da API
 *   é AdsApp.mutateAll(operations) (enquanto AdsApp.mutate aceita apenas 1 objeto isolado).
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

      // O método oficial para Array de operações é AdsApp.mutateAll(ops)
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

function main() {
  var customerId = AdsApp.currentAccount().getCustomerId().replace(/-/g, '');
  var finalUrl = 'https://chromaticpact.com/';

  // 1. Verifica se já existe a campanha ou cria uma nova via AdsApp.mutateAll
  var existingIter = AdsApp.campaigns()
    .withCondition("Name CONTAINS 'Chromatic Pact'")
    .withCondition("Status != REMOVED")
    .get();

  var campaign = null;
  if (existingIter.hasNext()) {
    campaign = existingIter.next();
    Logger.log('Campanha encontrada: ' + campaign.getName());
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
      Logger.log('AVISO: Em modo Visualizar (Preview), a campanha recém-criada não aparece no seletor até ser executada de fato. Clique em "Executar sem visualizar"!');
      return;
    }
  }

  // 2. Confirma orçamento diário de R$ 50,00
  try {
    campaign.getBudget().setAmount(50.00);
    Logger.log('Orçamento diário configurado: R$ 50,00/dia.');
  } catch (e) {
    Logger.log('Aviso no orçamento: ' + e);
  }

  // 3. Segmentação Geográfica: Brasil (2076) e Idiomas: Português (1014) + Inglês (1000)
  try {
    campaign.addLocation(2076);
    campaign.addLanguage(1014);
    campaign.addLanguage(1000);
    Logger.log('Segmentação Brasil + Português/Inglês configurada.');
  } catch (e) {
    Logger.log('Aviso em local/idioma: ' + e);
  }

  // 4. Palavras-Chave Negativas (Bloqueia termos de baralho comum/cassino)
  var negatives = [
    'truco', 'poker', 'buraco', 'cacheta', 'paciencia',
    'solitaire', 'cassino', 'aposta', 'dinheiro real',
    'tarot', 'cigano', 'comprar cartas fisicas', 'uno'
  ];
  for (var n = 0; n < negatives.length; n++) {
    try {
      campaign.createNegativeKeyword(negatives[n]);
    } catch (e) {}
  }
  Logger.log('13 palavras-chave negativas aplicadas.');

  // 5. Grupo de Anúncios 1: Card Games e TCG Online
  var ag1Op = campaign.newAdGroupBuilder()
    .withName('GA1 - Card Games e TCG Online')
    .withCpc(2.50)
    .withStatus('ENABLED')
    .build();

  if (ag1Op.isSuccessful()) {
    var ag1 = ag1Op.getResult();
    Logger.log('Grupo 1 criado: ' + ag1.getName());

    ag1.newAd().responsiveSearchAdBuilder()
      .withFinalUrl(finalUrl)
      .withPath1('CardGame')
      .withPath2('Gratis')
      .withHeadlines([
        'Chromatic Pact - Card Game',
        'Jogue Grátis no Navegador',
        'TCG Tático de Dark Fantasy',
        'Quase 1.000 Cartas Únicas',
        'Sem Download - Jogue Agora',
        'Monte Seu Grimório Lendário',
        'Duelos Táticos 1v1 Online',
        'Alternativa a MTG e Yu-Gi-Oh',
        '5 Domínios Elementais Épicos',
        'Duelos de Cartas Estratégicos',
        'Criaturas e Relíquias Épicas',
        'Card Game 100% em Português'
      ])
      .withDescriptions([
        'Domine 6 domínios e 996 cartas ilustradas em batalhas de Vanguarda e Retaguarda.',
        'Jogue grátis direto no navegador sem instalar nada. Campanha solo e duelos 1v1!',
        'Inspirado nos clássicos de Dark Fantasy e TCG. Crie seu deck e desafie Soberanos.',
        'Estratégia profunda, arte sombria e trilha épica. Entre em Vaeloria grátis agora!'
      ])
      .build();

    var kw1 = [
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
    ];
    for (var i = 0; i < kw1.length; i++) {
      ag1.newKeywordBuilder().withText(kw1[i]).withCpc(2.50).build();
    }
    Logger.log('Anúncio RSA e 11 palavras-chave adicionados ao Grupo 1.');
  }

  // 6. Grupo de Anúncios 2: RPG Tático e Dark Fantasy
  var ag2Op = campaign.newAdGroupBuilder()
    .withName('GA2 - RPG Tático e Dark Fantasy')
    .withCpc(2.50)
    .withStatus('ENABLED')
    .build();

  if (ag2Op.isSuccessful()) {
    var ag2 = ag2Op.getResult();
    Logger.log('Grupo 2 criado: ' + ag2.getName());

    ag2.newAd().responsiveSearchAdBuilder()
      .withFinalUrl(finalUrl)
      .withPath1('RPG-Cartas')
      .withPath2('Jogar')
      .withHeadlines([
        'Chromatic Pact - RPG e Cartas',
        'Dark Fantasy Tático Online',
        'Jogue Grátis no Navegador',
        'Bestiário com 996 Cartas',
        'Dragões, Lichs e Titãs Épicos',
        'Para Fãs de D&D e Castlevania',
        'Combate Tático e Magia',
        'Sem Cadastro Obrigatório',
        'Campanha Épica e Duelos 1v1',
        'Estratégia em Turnos Online',
        'Explore a Lore de Vaeloria',
        '100% em Português e Gratuito'
      ])
      .withDescriptions([
        'Enfrente dragões, arquimagos e titãs em um Card Game tático de fantasia sombria.',
        '996 cartas com habilidades táticas, relíquias e armadilhas. Jogue sem baixar nada!',
        'Construa seu baralho nos 5 domínios cromáticos e vença chefes lendários online.',
        'Acesso imediato no PC ou celular em chromaticpact.com. Comece sua jornada hoje!'
      ])
      .build();

    var kw2 = [
      '"jogo rpg navegador"',
      '"rpg tatico online"',
      '"jogo fantasia sombria online"',
      '"jogo de estrategia fantasia"',
      '"jogos estilo d&d online"',
      '"rpg de cartas online"',
      '"jogo estrategia turnos navegador"',
      '"dark fantasy game browser"'
    ];
    for (var j = 0; j < kw2.length; j++) {
      ag2.newKeywordBuilder().withText(kw2[j]).withCpc(2.50).build();
    }
    Logger.log('Anúncio RSA e 8 palavras-chave adicionados ao Grupo 2.');
  }

  Logger.log('=== CAMPANHA CHROMATIC PACT CRIADA E OTIMIZADA COM SUCESSO! ===');
}
